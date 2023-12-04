import { Injectable } from '@angular/core';
import * as toWav from 'audiobuffer-to-wav';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class AssembleMP3Service {

  constructor(private soundService: SoundService) { }
  async mergeAudio(jsonData: any[], duration: number ): Promise<void> {
    console.log(jsonData)
    const context = new AudioContext();
    const buffers = await Promise.all(
      jsonData.map(async (item) => {
        let response;
        console.log(item.instrument)
        if(this.soundService.isPercussion(item.instrument)){
          response = await fetch(`assets/samples/Percussion/${item.instrument}.mp3`);
          console.log(response)
        }
        else{
          response = await fetch(`assets/samples/${item.instrument}/${item.instrument}${item.note}${item.octave}.mp3`);
          console.log(response)
        }
        const arrayBuffer = await response.arrayBuffer();
        return context.decodeAudioData(arrayBuffer);
      })
    );
    console.log(typeof duration)
    const output = context.createBuffer(2, context.sampleRate * (duration/1000), context.sampleRate); // durée de 30 secondes par exemple
    jsonData.forEach((item, index) => {
      const buffer = buffers[index];
      for (let channel = 0; channel < output.numberOfChannels; channel++) {
        const outputData = output.getChannelData(channel);
        const inputData = buffer.getChannelData(channel);
        const startTime = context.sampleRate * item.currentTime / 1000; // convertir en échantillons
        for (let i = 0; i < inputData.length; i++) {
          outputData[i + startTime] += inputData[i];
        }
      }
    });

    // Télécharger le fichier WAV
    await this.downloadAsWav(output);
  }

  // Ajouter une méthode pour convertir AudioBuffer en WAV et télécharger le fichier
  async downloadAsWav(audioBuffer: AudioBuffer) {
    // Convertir AudioBuffer en WAV
    const wavFile = this.audioBufferToWav(audioBuffer);
    const blob = new Blob([wavFile], { type: 'audio/wav' });

    // Créer un URL pour le Blob et déclencher le téléchargement
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'audio_output.wav';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  // Convertir AudioBuffer en WAV
  private audioBufferToWav(audioBuffer: AudioBuffer) {
    return toWav(audioBuffer);
  }
}
