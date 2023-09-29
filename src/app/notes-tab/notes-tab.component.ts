import { Component, Output, EventEmitter } from '@angular/core';
import {SoundService} from '../services/sound.service';

@Component({
  selector: 'app-notes-tab',
  templateUrl: './notes-tab.component.html',
  styleUrls: ['./notes-tab.component.scss']
})
export class NotesTabComponent {
  @Output() noteChanged = new EventEmitter<void>();

  notes!: string[];

  constructor(private soundService: SoundService) {
    this.notes = this.soundService.notes;
  }

  toggleNote(note: string) {
    this.soundService.setActiveNote(note);
    this.noteChanged.emit();
  }
}
