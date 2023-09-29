import { Component, OnInit, OnDestroy } from '@angular/core';
import { SoundService } from '../services/sound.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-music',
  templateUrl: './music-component.component.html',
  styleUrls: ['./music-component.component.scss']
})
export class MusicComponent implements OnInit, OnDestroy {
  currentSelection: string = '';
  private selectionSub: Subscription | undefined;

  constructor(public soundService: SoundService) {}

  ngOnInit(): void {
    this.updateCurrentSelection();
    this.selectionSub = this.soundService.selectionChanged.subscribe(() => {
      this.updateCurrentSelection();
    });
  }

  updateCurrentSelection(): void {
    this.currentSelection = this.soundService.getCurrentSelection();
  }

  get alterationSymbol(): string {
    switch (this.soundService.activeAlteration) {
      case -1: return '♭';
      case 1: return '♯';
      default: return '';
    }
  }

  ngOnDestroy(): void {
    if (this.selectionSub) {
      this.selectionSub.unsubscribe();
    }
  }
}
