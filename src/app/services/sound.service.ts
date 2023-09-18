import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  instruments = ["Piano", "Batterie", "Guitare", "Violon", "Trompette", "Clavecin"];
  notes = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"]

  activeInstrument = "Piano"
  activeNote = "Do"
  constructor() { }

  setActiveInstrument(instrument: string) {
    this.activeInstrument = instrument;
  }
}
