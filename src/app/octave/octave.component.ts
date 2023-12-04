import { Component, Output, EventEmitter } from '@angular/core';
import { SoundService } from '../services/sound.service';

@Component({
  selector: 'app-octave',
  templateUrl: './octave.component.html',
  styleUrls: ['./octave.component.scss']
})
export class OctaveComponent {
  @Output() octaveChanged = new EventEmitter<void>();
  selectedOctave!: number;

  constructor(private soundService: SoundService) {
    this.soundService.activeOctave$.subscribe(octave => this.selectedOctave = octave);
  }
  increaseOctave() {
    if (this.selectedOctave < 7) {
      this.soundService.setActiveOctave(this.selectedOctave + 1);
    }
  }

  decreaseOctave() {
    if (this.selectedOctave > 1) {
      this.soundService.setActiveOctave(this.selectedOctave - 1);
    }
  }
}
