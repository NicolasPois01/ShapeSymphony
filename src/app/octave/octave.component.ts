import { Component, Output, EventEmitter } from '@angular/core';
import { SoundService } from '../services/sound.service';

@Component({
  selector: 'app-octave',
  templateUrl: './octave.component.html',
  styleUrls: ['./octave.component.scss']
})
export class OctaveComponent {
  @Output() octaveChanged = new EventEmitter<void>();
  selectedOctave: number = this.soundService.getActiveOctave();

  constructor(private soundService: SoundService) {}
  increaseOctave() {
    if (this.selectedOctave < 7) {
      this.selectedOctave++;
    }
  }

  decreaseOctave() {
    if (this.selectedOctave > 1) {
      this.selectedOctave--;
    }
  }

  updateOctave(): void {
    this.soundService.setActiveOctave(this.selectedOctave);
    this.octaveChanged.emit();
  }
}
