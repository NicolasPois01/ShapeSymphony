import { Component, Output, EventEmitter, NgModule, Input } from '@angular/core';
import { SoundService } from '../services/sound.service';

@Component({
  selector: 'app-alteration',
  templateUrl: './alteration.component.html',
  styleUrls: ['./alteration.component.scss']
})
export class AlterationComponent {
  selectedAlteration: number = this.soundService.getActiveAlteration();

  constructor(private soundService: SoundService) {}

  updateAlteration(): void {
    this.soundService.setActiveAlteration(this.selectedAlteration);
  }
}
