import { Injectable } from '@angular/core';
import { Circle } from '../models/circle';
import { TimerService } from './timer.service';
import * as toWav from 'audiobuffer-to-wav';
import { SoundService } from './sound.service';
import {ArenaService} from "./arena.service";
import {Observable, Subject} from "rxjs";
import {CircleService} from "./circle.service";

@Injectable({
  providedIn: 'root'
})
export class ExportWAVService {
  collisionData: any[] = [];
  currentTime: number = 0;
  timestamp: number = 0;
  squareUnit: number = 10;
  fps: number= 60;
  intervalChangedSubject: Subject<any> = new Subject<any>();
  intervalChanged$: Observable<any> = this.intervalChangedSubject.asObservable();
  constructor(private timerService: TimerService, private soundService: SoundService, private arenaService: ArenaService, private circleService: CircleService) {
    this.circleService.exportWavCircle$.subscribe(circle => {
      if (circle) {
        this.exportMp3(circle);
      }
    });
  }


  exportMp3(circle: Circle) {
    console.log("exportMP3 " +this.timerService?.getTimeStamp() )

    const collisionInfo = {

      instrument: circle.instrument,
      note: circle.note,
      octave: circle.octave,
      alteration: circle.alteration,
      currentTime: this.timerService?.getTimeStamp() * 10
    };
    this.collisionData.push(collisionInfo);
  }

  exportCollisionDataAsJson() {
    return JSON.stringify(this.collisionData);
  }

  resetCollisionData() {
    this.collisionData = [];
  }

  async mergeAudio(jsonData: any[], duration: number ): Promise<void> {
    const context = new AudioContext();
    const buffers = await Promise.all(
      jsonData.map(async (item) => {
        let response;
        if(this.soundService.isPercussion(item.instrument)){
          response = await fetch(`assets/samples/Percussion/${item.instrument}.mp3`);
        }
        else{
          response = await fetch(`assets/samples/${item.instrument}/${item.instrument}${item.note}${item.octave}.mp3`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return context.decodeAudioData(arrayBuffer);
      })
    );
    const output = context.createBuffer(2, context.sampleRate * (duration/1000), context.sampleRate);
    jsonData.forEach((item, index) => {
      const buffer = buffers[index];
      for (let channel = 0; channel < output.numberOfChannels; channel++) {
        const outputData = output.getChannelData(channel);
        const inputData = buffer.getChannelData(channel);
        const startTime = context.sampleRate * item.currentTime / 1000;
        for (let i = 0; i < inputData.length; i++) {
          outputData[i + startTime] += inputData[i];
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
  }

  private audioBufferToWav(audioBuffer: AudioBuffer) {
    return toWav(audioBuffer);
  }

  public startUpdateLoop(duration: number) {
    this.timerService?.start(false);
    const interval = setInterval(() => {
      let elapsedTime = ((this.timerService?.getTimeStamp() ?? 0) - this.timestamp) / 1000;
      console.log("startUpdateLoop " +this.timerService?.getTimeStamp() )
      this.timestamp = this.timerService?.getTimeStamp();

      if (elapsedTime > 0) {
        this.arenaService.updateArenas(elapsedTime, this.squareUnit, this.timestamp, true);
      }

      if ((this.timerService?.getTimeStamp() ?? 0) >= duration/10) {
        clearInterval(interval);
        this.intervalChangedSubject.next(null); // Émettre une notification
      }
    }, 1000 / this.fps);
  }

}
