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
    this.activeInstrument = this.soundService.activeInstrument;
  }

  isActive(instrument: string) {
    return instrument == this.activeInstrument;
  }

  toggleInstrument(instrument: string) {
    this.percussion = (instrument === "Batterie");
    this.soundService.setActiveInstrument(instrument);
    this.activeInstrument = this.soundService.getActiveInstrument();
    this.instrumentChanged.emit();
  }

}
