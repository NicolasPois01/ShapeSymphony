import { Component } from '@angular/core';
import { CircleService } from '../services/circle.service';
import { TimerService } from '../services/timer.service';
import { Circle } from '../models/circle';
import {ArenaService} from "../services/arena.service";
import {Arena} from "../models/arena";

@Component({
  selector: 'app-import-json',
  templateUrl: './import-json.component.html',
  styleUrls: ['./import-json.component.scss']
})
export class ImportJsonComponent {

  constructor(private circleService: CircleService,
              private timerService: TimerService,
              private arenaService: ArenaService) { }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const jsonString = e.target.result;
        this.initArenasFromJson(jsonString);
      };
      reader.readAsText(file);

      // Réinitialiser la valeur de l'input pour permettre l'importation du même fichier
      event.target.value = '';
    }
  }

  initArenasFromJson(jsonString: string) {
    const arenas = JSON.parse(jsonString);

    if (Array.isArray(arenas)) {
      this.arenaService.clearAll();
      this.timerService.resetTimer();

      let arenaList: Arena [] = [];
      let circleListWaiting: Circle [] = [];
      let circleListAlive: Circle [] = [];
      let circleListDead: Circle [] = [];
      let arenaActiveId: number = 0;
      arenas.forEach(arenaData => {
        circleListWaiting = [];
        circleListAlive = [];
        circleListDead = [];
        if(arenaActiveId === 0) {
          arenaActiveId = arenaData.id;
        }
        arenaData.circleListAlive.forEach((circleData: Circle) => {
          circleListAlive.push(this.getCircleData(circleData));
        })
        arenaData.circleListWaiting.forEach((circleData: Circle) => {
          circleListWaiting.push(this.getCircleData(circleData));
        })
        arenaData.circleListDead.forEach((circleData: Circle) => {
          circleListDead.push(this.getCircleData(circleData));
        })
        arenaList.push({
          id: arenaData.id,
          circleListWaiting: circleListWaiting,
          circleListAlive: circleListAlive,
          circleListDead: circleListDead,
          isMuted: arenaData.isMuted
        });
      });
      this.arenaService.setArenaList(arenaList, arenaActiveId);
      this.circleService.setCircleListWaiting(circleListWaiting);
      this.circleService.setCircleListAlive(circleListAlive);
      this.circleService.setCircleListDead(circleListDead);
    }
  }

  getCircleData(circleData: Circle) {
   return {
      id: circleData.id,
      x: circleData.startX,
      y: circleData.startY,
      xSpeed: circleData.xSpeed,
      ySpeed: circleData.ySpeed,
      color: circleData.color,
      startX: circleData.startX,
      startY: circleData.startY,
      startXSpeed: circleData.startXSpeed,
      startYSpeed: circleData.startYSpeed,
      instrument: circleData.instrument,
      note: circleData.note,
      alteration: circleData.alteration,
      octave: circleData.octave,
      volume: circleData.volume,
      spawnTime: circleData.spawnTime,
      maxBounces: circleData.maxBounces,
      maxTime: circleData.maxTime,
      nbBounces: circleData.nbBounces,
      showable: circleData.showable,
      isColliding: false,
      contactPoint: {x: -1, y: -1}
    }
  }

  playCirclesFromJson(jsonString: string): void {
    try {
      const circles = JSON.parse(jsonString);
      if (Array.isArray(circles)) {
        this.circleService.clearAllCircles();
        this.timerService.resetTimer();
        circles.forEach(circleData => {
          let circle: Circle = {
            id: circleData.id,
            x: circleData.startX,
            y: circleData.startY,
            xSpeed: circleData.xSpeed,
            ySpeed: circleData.ySpeed,
            color: circleData.color,
            startX: circleData.startX,
            startY: circleData.startY,
            startXSpeed: circleData.startXSpeed,
            startYSpeed: circleData.startYSpeed,
            instrument: circleData.instrument,
            note: circleData.note,
            alteration: circleData.alteration,
            octave: circleData.octave,
            volume: circleData.volume,
            spawnTime: circleData.spawnTime,
            maxBounces: circleData.maxBounces,
            maxTime: circleData.maxTime,
            nbBounces: circleData.nbBounces,
            showable: circleData.showable,
            isColliding: false,
            contactPoint: {x: -1, y: -1}
          }
          this.circleService.addCircleToAliveList(circle);
        });
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier JSON.", error);
    }
  }
}
