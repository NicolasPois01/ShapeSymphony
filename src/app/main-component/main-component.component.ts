import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CircleService } from '../services/circle.service';
import { Circle } from '../models/circle';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TimerService } from '../services/timer.service';
import { Arena } from "../models/arena";
import { ArenaService } from "../services/arena.service";
import { SoundService } from "../services/sound.service";
import { AnimationService } from '../services/animation.service';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)'
  },
  providers: [TimerService]
})
export class MainComponentComponent implements OnInit, OnDestroy {

  grid: boolean = false;
  precisionMode: boolean = false;
  circles: Circle[] = [];
  private unsubscribe$ = new Subject();

  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('audioFileInput') audioFileInput: ElementRef | undefined;

  fps: number = 60;
  squareUnit: number = 10;

  activeArena!: Arena;
  activeInstrument!: string;

  isProcessModalVisible: boolean = false;
  isProcessAudioModalVisible: boolean = false;

  constructor(private circleService: CircleService,
    private arenaService: ArenaService,
    public timerService: TimerService,
    private soundService: SoundService,
    private animationService: AnimationService) { }

  ngOnInit() {
    this.circleService.circleListAlive$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((circles: Circle[]) => this.circles = circles); // Ajoutez le type ici
    this.arenaService.activeArena$.subscribe(arena => {
      this.activeArena = arena;
    })
    this.soundService.activeInstrument$.subscribe(instru => this.activeInstrument = instru)
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null); // Ajoutez une valeur ici, même si elle n'est pas utilisée
    this.unsubscribe$.complete();
  }

  uploadMidiFile() {
    this.fileInput?.nativeElement.addEventListener('change', async (event: any) => {
      const file = event.target.files[0];
      this.showProcessModal();
      await this.arenaService.uploadMidiFile(file);
      this.hideProcessModal();
    });
    this.fileInput?.nativeElement.click();
  }

  uploadAudioFile() {
    this.audioFileInput?.nativeElement.addEventListener('change', async (event: any) => {
      const file = event.target.files[0];
      this.showProcessAudioModal();
      await this.arenaService.uploadAudioFile(file);
      this.hideProcessAudioModal();
    });
    this.audioFileInput?.nativeElement.click();
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement) return;
    if (event.key === "Shift") this.grid = !this.grid;
    else if (event.key === "Control") this.precisionMode = !this.precisionMode;
    else if (event.key === " ") {
      this.timerService.toggle();
      this.animationService.toggleAnimation();
    }
    if (event.target instanceof HTMLButtonElement) {
      // stop execution of button
      event.preventDefault();
      event.stopPropagation();
    }
  }

  isPercussion(instrument: string): boolean {
    return this.soundService.isPercussion(instrument);
  }

  isConfirmationModalVisible = false;

  showConfirmationModal() {
    this.isConfirmationModalVisible = true;
  }

  hideConfirmationModal() {
    this.isConfirmationModalVisible = false;
  }

  clearAll(): void {
    this.arenaService.clearAll();
    this.timerService?.resetTimer();
    this.hideConfirmationModal();
  }
  showProcessModal() {
    this.isProcessModalVisible = true;
  }

  hideProcessModal() {
    this.isProcessModalVisible = false;
  }

  showProcessAudioModal() {
    this.isProcessAudioModalVisible = true;
  }

  hideProcessAudioModal() {
    this.isProcessAudioModalVisible = false;
  }

}
