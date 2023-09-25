import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  selectionChanged = new EventEmitter<void>();
  instruments = ["Piano", "Batterie", "Guitare", "Violon", "Trompette", "Clavecin"];
  notes = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];

  activeInstrument: string = "Piano";
  activeNote: string = "Do";
  activeOctave: number = 3;
  activeAlteration: number = 0;

  constructor() { }

  setActiveInstrument(instrument: string) {
    this.activeInstrument = instrument;
    this.selectionChanged.emit();
  }


  getActiveInstrument(): string {
    return this.activeInstrument;
  }

  setActiveNote(note: string) {
    this.activeNote = note;
    this.selectionChanged.emit();
  }

  getActiveNote(): string {
    return this.activeNote;
  }

  setActiveOctave(octave: number) {
    this.activeOctave = octave;
    this.selectionChanged.emit();
  }

  getActiveOctave(): number {
    return this.activeOctave;
  }

  setActiveAlteration(alteration: number) {
    this.activeAlteration = alteration;
    this.selectionChanged.emit();
  }

  getActiveAlteration(): number {
    return this.activeAlteration;
  }

  getCurrentSelection(): string {
    let alterationSymbol = '';
    // @ts-ignore
    switch (this.activeAlteration) {
      case -1:
        alterationSymbol = '♭';
        break;
      case 1:
        alterationSymbol = '♯';
        break;
      default:
        alterationSymbol = '';
        break;
    }
    return `${this.activeInstrument} ${this.activeNote}${alterationSymbol}${this.activeOctave}`;

  }


}
