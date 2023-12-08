import { Component, Output, EventEmitter, NgModule, Input } from '@angular/core';
import { SoundService } from '../services/sound.service';

@Component({
  selector: 'app-volume',
  templateUrl: './volume.component.html',
  styleUrls: ['./volume.component.scss']
})

export class VolumeComponent {
  @Output() volumeChanged = new EventEmitter<void>();
  selectedVolume: number = this.soundService.getActiveVolume();

  constructor(private soundService: SoundService) {}

  updateVolume(): void {
    this.soundService.setActiveVolume(this.selectedVolume);
    this.volumeChanged.emit();
  }
}
