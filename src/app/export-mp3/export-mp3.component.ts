import { Component } from '@angular/core';
import { ExportMp3Service } from "../services/exportmp3.service";
import { TimerService } from "../services/timer.service";
import { ArenaService } from "../services/arena.service";
import { AnimationService } from "../services/animation.service";
import { Arena } from "../models/arena";
import { AssembleMP3Service } from "../services/assembleMP3.service";

@Component({
  selector: 'app-export-mp3',
  templateUrl: './export-mp3.component.html',
  styleUrls: ['./export-mp3.component.scss']
})
export class ExportMp3Component {
  showModal: boolean = false;
  inputMinutes: number | undefined;
  inputSeconds: number | undefined;
  private timestamp: number | undefined = 0;
  private squareUnit: number = 10;
  private offset: number = 0;
  private fps: number = 60;
  private arenas: Arena[] = [];
  private totalTimeInMilliseconds: number = 0;

  constructor(
    private exportMp3Service: ExportMp3Service,
    private timerService: TimerService,
    private arenaService: ArenaService,
    private animationService: AnimationService,
    private assembleMP3service: AssembleMP3Service
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
    this.timerService?.start(false);
    this.startUpdateLoop(this.totalTimeInMilliseconds);
  }

  startUpdateLoop(duration: number) {
    const interval = setInterval(() => {
      let elapsedTime = ((this.timerService?.getTimeStamp() ?? 0) - (this.timestamp ?? 0)) / 1000;
      this.timestamp = this.timerService?.getTimeStamp();

      if (elapsedTime > 0) {
        this.arenaService.updateArenas(elapsedTime, this.squareUnit, true);
      }

      if ((this.timerService?.getTimeStamp() ?? 0) >= duration/10) {
        clearInterval(interval);
        this.finalizeRecording(duration);
      }
    }, 1000 / this.fps);
  }

  finalizeRecording(duration: number) {
    this.timerService?.pause();
    this.timerService?.resetTimer();
    this.animationService.pauseAnimation();
    this.arenaService.restoreArenas();

    this.arenas.forEach(arena => { this.arenaService.unmuteArena(arena.id); });

    const jsonData = this.exportMp3Service.exportCollisionDataAsJson();
    console.log(jsonData);
    this.processAudioMerge(duration);
  }

  processAudioMerge(duration: number) {
    const jsonData = this.generateJsonData();
    const audioData = JSON.parse(jsonData);
    this.assembleMP3service.mergeAudio(audioData, duration);
  }

  generateJsonData() {
    const jsonData = [];
    for (let i = 0; i <= 10; i++) {
      jsonData.push({
        instrument: "Piano",
        note: "Do",
        octave: 3,
        alteration: "",
        currentTime: i * 1000
      });

    }
    for (let i = 0; i <= 10; i++) {
      jsonData.push({
        instrument: "Bass",
        note: "Sol",
        octave: 4,
        alteration: "",
        currentTime: i * 1000
      });

    }
    for (let i = 0; i <= 10; i++) {
      jsonData.push({
        instrument: "Clap",
        note: "Mi",
        octave: 2,
        alteration: "",
        currentTime: i * 500
      });

    }
    return JSON.stringify(jsonData);
  }

}
