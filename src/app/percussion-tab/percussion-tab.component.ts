import { Component, Output, EventEmitter } from '@angular/core';
import {SoundService} from '../services/sound.service';

@Component({
  selector: 'app-percussion-tab',
  templateUrl: './percussion-tab.component.html',
  styleUrls: ['./percussion-tab.component.scss']
})
export class PercussionTabComponent {
  @Output() percussionChanged = new EventEmitter<void>();

  percussionsList!: string [];
  activeInstrument!: string;
  constructor(private soundService: SoundService) {
    this.percussionsList = this.soundService.percussions;
    //this.activeInstrument = this.soundService.activeInstrument;
    this.soundService.activeInstrument$.subscribe(activeInstrument => this.activeInstrument = activeInstrument)
  }

  isActive(percussion: string) {
    return percussion == this.activeInstrument;
  }

  togglePercussion(percussion: string) {
    this.soundService.setActiveInstrument(percussion);
    this.activeInstrument = this.soundService.getActiveInstrument();
    this.percussionChanged.emit();
  }
}
