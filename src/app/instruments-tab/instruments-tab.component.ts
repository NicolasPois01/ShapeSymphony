import { Component } from '@angular/core';
import {SoundService} from '../services/sound.service';

@Component({
  selector: 'app-instruments-tab',
  templateUrl: './instruments-tab.component.html',
  styleUrls: ['./instruments-tab.component.scss']
})
export class InstrumentsTabComponent {

  instrumentsList!: string [];
  activeInstrument!: string;
  constructor(private soundService: SoundService) {
    this.instrumentsList = this.soundService.instruments;
    this.activeInstrument = this.soundService.activeInstrument;
  }

  isActive(instrument: string) {
    return instrument == this.activeInstrument;
  }

  toggleInstrument(instrument: string) {
    this.soundService.setActiveInstrument(instrument);
  }
}
