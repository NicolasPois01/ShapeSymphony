import { Component } from '@angular/core';
import { SoundService } from '../services/sound.service';

@Component({
  selector: 'app-octave',
  templateUrl: './octave.component.html',
  styleUrls: ['./octave.component.scss']
})
export class OctaveComponent {
  selectedOctave!: number;
  minOctave: number = 1;
  maxOctave: number = 7;

  constructor(private soundService: SoundService) {
    this.soundService.activeOctave$.subscribe(octave => this.selectedOctave = octave);
    this.soundService.activeInstrument$.subscribe(instru => {
      if (instru == "Xylophone" || instru == "Bass") {
        this.minOctave = 4;
      }
      else {
        this.minOctave = 1;
      }
      if (this.selectedOctave < this.minOctave) this.soundService.setActiveOctave(this.minOctave);
    });
  }
  increaseOctave() {
    if (this.selectedOctave < this.maxOctave) {
      this.soundService.setActiveOctave(this.selectedOctave + 1);
    }
  }

  decreaseOctave() {
    if (this.selectedOctave > this.minOctave) {
      this.soundService.setActiveOctave(this.selectedOctave - 1);
    }
  }
}
