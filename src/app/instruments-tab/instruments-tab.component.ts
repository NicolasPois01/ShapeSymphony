import { Component, Output, EventEmitter } from '@angular/core';
import {SoundService} from '../services/sound.service';

@Component({
  selector: 'app-instruments-tab',
  templateUrl: './instruments-tab.component.html',
  styleUrls: ['./instruments-tab.component.scss']
})
export class InstrumentsTabComponent {
  @Output() instrumentChanged = new EventEmitter<void>();

  instrumentsList!: string [];
  activeInstrument!: string;
  percussion: boolean = false;
  constructor(private soundService: SoundService) {
    this.instrumentsList = this.soundService.instruments;
    this.soundService.activeInstrument$.subscribe(activeInstrument => this.activeInstrument = activeInstrument)
  }

  isActive(instrument: string): boolean {
    if (instrument === "Percussion") {
      return this.soundService.isPercussion(this.activeInstrument);
    } else {
      return instrument === this.activeInstrument;
    }
  }


  toggleInstrument(instrument: string) {
    instrument = instrument === "Percussion" ? "Clap" : instrument;
    this.soundService.setActiveInstrument(instrument);
  }
}
