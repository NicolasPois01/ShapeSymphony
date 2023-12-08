import { Component, Output, EventEmitter, NgModule, Input } from '@angular/core';
import { SoundService } from '../services/sound.service';

@Component({
  selector: 'app-volume',
  templateUrl: './volume.component.html',
  styleUrls: ['./volume.component.scss']
})

export class VolumeComponent {
  selectedVolume!: number;

  constructor(private soundService: SoundService) {
    this.soundService.activeVolume$.subscribe(volume=> {
      this.selectedVolume = volume;
    })
  }

  updateVolume(): void {
    this.soundService.setActiveVolume(this.selectedVolume);
  }
}
