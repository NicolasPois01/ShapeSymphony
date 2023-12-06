import { Component } from '@angular/core';
import {ExportWAVService} from "../services/exportWAV.service";
import { TimerService } from "../services/timer.service";
import { ArenaService } from "../services/arena.service";
import { AnimationService } from "../services/animation.service";
import { Arena } from "../models/arena";

@Component({
  selector: 'app-export-mp3',
  templateUrl: './export-mp3.component.html',
  styleUrls: ['./export-mp3.component.scss']
})
export class ExportMp3Component {
  showModal: boolean = false;
  inputMinutes: number | undefined;
  inputSeconds: number | undefined;
  private arenas: Arena[] = [];
  private totalTimeInMilliseconds: number = 0;

  constructor(
    private ExportWAVService: ExportWAVService,
    private timerService: TimerService,
    private arenaService: ArenaService,
    private animationService: AnimationService,
  ) {}

  ngOnInit(): void {}

  private downloadJson(jsonObject: string, fileName: string) {
    const blob = new Blob([jsonObject], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }

  openTimeInputModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  submitTime() {
    this.showModal = false;
    this.arenaService.arenaList$.subscribe(arenas => { this.arenas = arenas; });
    this.arenas.forEach(arena => { this.arenaService.muteArena(arena.id); });
    this.totalTimeInMilliseconds = ((this.inputMinutes || 0) * 60000) + ((this.inputSeconds || 0) * 1000);
    this.ExportWAVService.startUpdateLoop(this.totalTimeInMilliseconds);

    this.ExportWAVService.intervalChanged$.subscribe(() => {
      this.finalizeRecording(this.totalTimeInMilliseconds);
    });
  }



  finalizeRecording(duration: number) {
    this.timerService?.pause();
    this.timerService?.resetTimer();
    this.animationService.pauseAnimation();
    this.arenaService.restoreArenas();

    this.arenas.forEach(arena => { this.arenaService.unmuteArena(arena.id); });

    const jsonData = this.ExportWAVService.exportCollisionDataAsJson();
    this.processAudioMerge(duration);
  }

  processAudioMerge(duration: number) {
    const jsonData = this.ExportWAVService.exportCollisionDataAsJson();
    console.log(jsonData);
    const audioData = JSON.parse(jsonData);
    this.ExportWAVService.mergeAudio(audioData, duration);
  }

}
