import { Injectable } from '@angular/core';
import { Circle } from '../models/circle';
import { TimerService } from './timer.service';
import * as toWav from 'audiobuffer-to-wav';
import { SoundService } from './sound.service';
import { ArenaService } from "./arena.service";
import { Observable, Subject } from "rxjs";
import { CircleService } from "./circle.service";

@Injectable({
  providedIn: 'root'
})
export class ExportWAVService {
  collisionData: any[] = [];
  currentTime: number = 0;
  timestamp: number = 0;
  squareUnit: number = 10;
  elapsedTime: number = 0;
  fps: number = 60;
  intervalChangedSubject: Subject<any> = new Subject<any>();
  intervalChanged$: Observable<any> = this.intervalChangedSubject.asObservable();
  constructor(private timerService: TimerService, private soundService: SoundService, private arenaService: ArenaService, private circleService: CircleService) {
    this.circleService.exportWavCircle$.subscribe(data => {
      if (data) {
        this.exportMp3(data);
      }
    });
  }


  exportMp3(data: any[]) {
    var circle: Circle = data[0];
    const collisionInfo = {
      instrument: circle.instrument,
      note: circle.note,
      octave: circle.octave,
      alteration: circle.alteration,
      currentTime: data[1] / 1000,
      volume: circle.volume
    };
    this.collisionData.push(collisionInfo);
  }

  exportCollisionDataAsJson() {
    return JSON.stringify(this.collisionData);
  }

  resetCollisionData() {
    this.collisionData = [];
  }

  async mergeAudio(jsonData: any[], duration: number): Promise<void> {
    const context = new AudioContext();

    // Décoder tous les buffers audio en parallèle
    const buffers = await Promise.all(
      jsonData.map(async (item) => {
        let response;
        // Utiliser le chemin d'accès approprié pour charger l'audio
        if (this.soundService.isPercussion(item.instrument)) {
          response = await fetch(`assets/samples/Percussion/${item.instrument}.mp3`);
        }
        else {
          response = await fetch(`assets/samples/${item.instrument}/${item.instrument}${item.note}${item.octave}.mp3`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return context.decodeAudioData(arrayBuffer);
      })
    );

    // Créer un buffer audio pour la sortie avec la durée spécifiée
    const output = context.createBuffer(2, context.sampleRate * (duration / 1000), context.sampleRate);

    // Combinez tous les buffers en tenant compte du volume
    jsonData.forEach((item, index) => {
      const buffer = buffers[index];
      // Assurez-vous que le volume est une valeur entre 0 et 1
      const volume = item.volume / 100;

      for (let channel = 0; channel < output.numberOfChannels; channel++) {
        const outputData = output.getChannelData(channel);
        const inputData = buffer.getChannelData(channel);
        // Convertir le temps de collision en échantillons
        const startTime = context.sampleRate * item.currentTime;

        // Ajouter les données audio au buffer de sortie avec le volume appliqué
        for (let i = 0; i < inputData.length; i++) {
          // S'assurer que l'on ne dépasse pas la longueur du buffer de sortie
          if (i + startTime < outputData.length) {
            outputData[i + startTime] += inputData[i] * volume;
          }
        }
      }
    });

    await this.downloadAsWav(output);
  }

  async downloadAsWav(audioBuffer: AudioBuffer) {
    const wavFile = this.audioBufferToWav(audioBuffer);
    const blob = new Blob([wavFile], { type: 'audio/wav' });

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'audio_output.wav';
    anchor.click();
    window.URL.revokeObjectURL(url);
    this.collisionData = [];
  }

  private audioBufferToWav(audioBuffer: AudioBuffer) {
    return toWav(audioBuffer);
  }

  public startUpdateLoop(duration: number) {
    this.timerService?.start(false);
    const startTime = this.timerService?.getTimeStamp() ?? 0;
    console.log(`Début de la simulation sonore. Durée totale: ${duration} ms`);

    for (let currentTime = 10; currentTime <= duration; currentTime += 10) {
      this.elapsedTime = currentTime / 1000;
      console.log(`Mise à jour des arènes à ${currentTime} ms (temps écoulé: ${this.elapsedTime} s)`);
      this.arenaService.updateArenas(0.01, currentTime, this.squareUnit, true);

      if (currentTime >= duration) {
        console.log('Fin de la simulation sonore.');
        this.intervalChangedSubject.next(null); // Émettre une notification
        break;
      }
    }
  }


}
