import { Injectable } from '@angular/core';
import {Circle} from "../models/circle";
import { EventEmitter } from '@angular/core';
import {Percussions} from "../models/percussionEnum";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  selectionChanged = new EventEmitter<void>();
  instruments = ["Piano", "Percussion", "Guitare", "Violon", "Trompette", "Clavecin"];
  notes = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];
  percussions = ["Clap", "Cowbell", "Cymbale", "Gong", "Guiro", "Hat", "Kick", "Snap", "Snare", "Tambour", "Timbale", "Triangle"];
  octaves = ["1","2","3","4","5","6","7"];
  alterations = ["","b","d"];   //Legende : d=dièse, b=bémol.

  activeInstrument: string = "Piano";
  activeInstrumentSubject = new BehaviorSubject<string>("Piano");
  activeInstrument$ = this.activeInstrumentSubject.asObservable();
  activeNote: string = "Do";
  activeNoteSubject = new BehaviorSubject<string>("Do");
  activeNote$ = this.activeNoteSubject.asObservable();
  activeOctave: number = 3;
  activeOctaveSubject = new BehaviorSubject<number>(3);
  activeOctave$ = this.activeOctaveSubject.asObservable();
  activeAlteration: number = 0;
  activeAlterationSubject = new BehaviorSubject<number>(0);
  activeAlteration$ = this.activeAlterationSubject.asObservable();
  activeAlterationString: string ="";

  constructor() { }

  async loadAudioFiles() {
      for (const instrument of this.instruments) {
        if(instrument == "Percussion"){
          for (const percussion of this.percussions) {
            const audioFileName = `${percussion}.mp3`;
            const audioFilePath = `./assets/samples/${instrument}/${audioFileName}`;
            //Vérifie si le fichier audio existe :
            const response = await fetch(audioFilePath, {method: 'HEAD'});
            if (response.ok) {
              const audio = new Audio(audioFilePath);
              audio.preload;
              audio.load();   //Chargement des samples audio
            }
          }
        }
        else{
          for (const note of this.notes) {
            for (const octave of this.octaves) {
              for (const alteration of this.alterations) {
              const audioFileName = `${instrument}${note}${alteration}${octave}.mp3`;
              const audioFilePath = `./assets/samples/${instrument}/${audioFileName}`;
              //Vérifie si le fichier audio existe :
              const response = await fetch(audioFilePath, { method: 'HEAD' });
                if (response.ok) {
                  const audio = new Audio(audioFilePath);
                  audio.preload;
                  audio.load();   //Chargement des samples audio
                }
              }
            }
          }
        }
      }
  }

  isPercussion (instrument: string): boolean {
    return Object.values(Percussions).includes(instrument as Percussions)
  }

  playAudio = function(circle : Circle) {
    //Cas des percussions
    if (Object.values(Percussions).includes(circle.instrument as Percussions)){
      const audioFileName = circle.instrument+'.mp3';
      const audioFilePath = `./assets/samples/Percussion/${audioFileName}`;
      const audio = new Audio(audioFilePath);
      audio.volume = circle.volume;
      audio.play();
    }
    // les autres
    else {
      const audioFileName = circle.instrument+circle.note+circle.alteration+circle.octave+'.mp3';
      const audioFilePath = `./assets/samples/${circle.instrument}/${audioFileName}`;
      const audio = new Audio(audioFilePath);
      audio.volume = circle.volume;
      audio.play();
    }
  }

  setActiveInstrument(instrument: string){
    //this.activeInstrument = instrument;
    this.activeInstrumentSubject.next(instrument)
    //this.selectionChanged.emit();
  }

  getActiveInstrument(){
    return this.activeInstrumentSubject.getValue();
  }

  setActiveNote(note: string) {
    this.activeNoteSubject.next(note);
  }

  getActiveNote(){
    return this.activeNoteSubject.getValue();
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
