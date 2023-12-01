import { Component, Output, EventEmitter } from '@angular/core';
import {SoundService} from '../services/sound.service';

@Component({
  selector: 'app-notes-tab',
  templateUrl: './notes-tab.component.html',
  styleUrls: ['./notes-tab.component.scss']
})
export class NotesTabComponent {
  @Output() noteChanged = new EventEmitter<void>();
  activeNote!: string;
  activeInstrument!: string;

  notes!: string[];

  constructor(private soundService: SoundService) {
    this.notes = this.soundService.notes;
    //this.activeInstrument = this.soundService.activeInstrument;
    this.soundService.activeInstrument$.subscribe(activeInstrument => this.activeInstrument = activeInstrument);
    this.soundService.activeNote$.subscribe(note => this.activeNote = note);
  }

  isActive(instrument: string) {
    return instrument == this.activeNote;
  }

  toggleNote(note: string) {
    this.soundService.setActiveNote(note);
  }

  isPercussion(instrument: string): boolean {
    console.log(instrument, this.soundService.isPercussion(instrument), this.activeInstrument);
    return this.soundService.isPercussion(instrument);
  }

}
