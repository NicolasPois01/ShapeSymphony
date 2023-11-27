import { Injectable } from '@angular/core';
import {Circle} from "../models/circle";
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  selectionChanged = new EventEmitter<void>();
  instruments = ["Piano", "Batterie", "Guitare", "Violon", "Trompette", "Clavecin"];
  notes = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];
  octaves = ["1","2","3","4","5","6","7"];
  alterations = ["","b","d"];   //Legende : d=dièse, b=bémol.

  activeInstrument: string = "Piano";
  activeNote: string = "Do";
  activeOctave: number = 3;
  activeAlteration: number = 0;
  activeAlterationString: string ="";

  constructor() { }

  async loadAudioFiles() {
      for (const instrument of this.instruments) {
        for (const note of this.notes) {
          for (const octave of this.octaves) {
            for (const alteration of this.alterations) {
            const audioFileName = `${instrument}${note}${alteration}${octave}.mp3`;
            const audioFilePath = `./assets/samples/${instrument}/${audioFileName}`;
            //Vérifie si le fichier audio existe :
            const response = await fetch(audioFilePath, { method: 'HEAD' });
              if (response.ok) {
                const audio = new Audio(audioFilePath);
                audio.load();   //Chargement des samples audio
              }
            }
          }
        }
      }
  }

  playAudio = function(circle : Circle) {
       const audioFileName = circle.instrument+circle.note+circle.alteration+circle.octave+'.mp3';
       const audioFilePath = `./assets/samples/${circle.instrument}/${audioFileName}`;
       const audio = new Audio(audioFilePath);
       audio.play();
  }

  setActiveInstrument(instrument: string){
    this.activeInstrument = instrument;
    this.selectionChanged.emit();
  }

  getActiveInstrument(){
    return this.activeInstrument;
  }

  setActiveNote(note: string) {
    this.activeNote = note;
    this.selectionChanged.emit();
  }

  getActiveNote(){
    return this.activeNote;
  }

  setActiveOctave(octave: number){
    this.activeOctave = octave;
    this.selectionChanged.emit();
  }

  getActiveOctave(){
    return this.activeOctave;
  }

  setActiveAlteration(alteration: number){
    this.activeAlteration = alteration;
    this.selectionChanged.emit();
  }

  getActiveAlteration(){
    return this.activeAlteration;
  }

  getCurrentSelection(){
    let alterationSymbol = '';
    switch (this.activeAlteration) {
      case -1:
        alterationSymbol = '♭';
        this.activeAlterationString = 'b';
        break;
      case 1:
        alterationSymbol = '♯';
        this.activeAlterationString = 'd';
        break;
      default:
        alterationSymbol = '';
        this.activeAlterationString = '';
        break;
    }
    return `${this.activeInstrument} ${this.activeNote}${alterationSymbol}${this.activeOctave}`;
  }
}
