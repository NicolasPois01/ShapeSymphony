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

  notes!: string[];

  constructor(private soundService: SoundService) {
    this.notes = this.soundService.notes;
  }

  isActive(instrument: string) {
    return instrument == this.activeNote;
  }
  toggleNote(note: string) {
    this.soundService.setActiveNote(note);
    this.activeNote = note; // Assurez-vous que cette ligne est présente pour mettre à jour la note active
    this.noteChanged.emit();
  }

}
