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
  activePercussion!: string;
  constructor(private soundService: SoundService) {
    this.percussionsList = this.soundService.percussions;
    this.activePercussion = this.soundService.activePercussion;
  }

  isActive(percussion: string) {
    return percussion == this.activePercussion;
  }

  togglePercussion(percussion: string) {
    this.soundService.setActivePercussion(percussion);
    this.activePercussion = this.soundService.getActivePercussion();
    this.percussionChanged.emit();
  }

}
