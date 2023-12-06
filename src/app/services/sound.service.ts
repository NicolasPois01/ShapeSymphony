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
  instruments = ["Piano", "Percussion", "Xylophone", "Bass"];
  notes = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];
  percussions = ["Clap", "Cowbell", "Cymbale", "Gong", "Guiro", "Hat", "Kick", "Snap", "Snare", "Tambour", "Timbale", "Triangle"];
  octaves = ["1","2","3","4","5","6","7"];
  alterations = ["","b","d"];   //Legende : d=dièse, b=bémol.

  activeInstrumentSubject = new BehaviorSubject<string>("Piano");
  activeInstrument$ = this.activeInstrumentSubject.asObservable();
  activeNoteSubject = new BehaviorSubject<string>("Do");
  activeNote$ = this.activeNoteSubject.asObservable();
  activeOctaveSubject = new BehaviorSubject<number>(4);
  activeOctave$ = this.activeOctaveSubject.asObservable();
  activeAlterationSubject = new BehaviorSubject<number>(0);
  activeAlteration$ = this.activeAlterationSubject.asObservable();
  activeAlterationStringSubject = new BehaviorSubject<string>("");
  activeAlterationString$ = this.activeAlterationStringSubject.asObservable();

  constructor() {
    this.activeAlterationSubject.subscribe(value => {
      switch (value) {
        case -1:
          this.activeAlterationStringSubject.next('b');
          break
        case 1:
          this.activeAlterationStringSubject.next('d');
          break
        default:
          this.activeAlterationStringSubject.next('');
          break;
      }
    })
  }

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
    this.activeOctaveSubject.next(octave);
  }

  getActiveOctave(){
    return this.activeOctaveSubject.getValue();
  }

  setActiveAlteration(alteration: number){
    this.activeAlterationSubject.next(alteration);
  }

  getActiveAlteration(){
    return this.activeAlterationSubject.getValue();
  }

  getCurrentSelection(){
    let alterationSymbol = '';
    switch (this.activeAlterationSubject.getValue()) {
      case -1:
        alterationSymbol = '♭';
        this.activeAlterationStringSubject.next('b');
        break;
      case 1:
        alterationSymbol = '♯';
        this.activeAlterationStringSubject.next('d');
        break;
      default:
        alterationSymbol = '';
        this.activeAlterationStringSubject.next('');
        break;
    }
    return `${this.activeInstrumentSubject.getValue()} ${this.activeNoteSubject.getValue()}${alterationSymbol}${this.activeOctaveSubject.getValue()}`;
  }
}
