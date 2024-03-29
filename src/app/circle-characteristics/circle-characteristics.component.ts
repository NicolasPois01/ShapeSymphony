import { Component, OnInit } from '@angular/core';
import { CircleService } from "../services/circle.service";
import { Circle } from "../models/circle";
import { TimerService } from "../services/timer.service";
import { TimeInputComponent } from '../time-input/time-input.component';
import {SoundService} from "../services/sound.service";

@Component({
  selector: 'app-circle-characteristics-list',
  templateUrl: './circle-characteristics.component.html',
  styleUrls: ['./circle-characteristics.component.scss']
})
export class CircleCharacteristicsComponent implements OnInit{
  selectedCircle: Circle | null | undefined;
  angleDepart: number | undefined;
  vitesseGlobale: number | undefined;
  selectedColor: string = '';
  selectedNote: string = '';
  selectedAlteration: number = 0;
  selectedOctave: number | undefined;
  availableColors: string[] = this.circlesService.colors;
  availableNotes: string[] = this.circlesService.notes;
  availableAlterations: string[] = this.circlesService.alterations;
  availableOctaves: string[] = this.circlesService.octaves;
  newStartX: number | undefined;
  newStartY: number | undefined;
  newAngle: number | undefined;
  maxBounces: number = 0;
  spawnTime: any = { millisecondes: 0, secondes: 0, minutes: 0 };
  instrumentName!: string;

  constructor(private circlesService: CircleService,
              private timerService: TimerService,
              private soundService: SoundService) {}

  ngOnInit() {
    this.circlesService.selectedCircle$.subscribe((circle: Circle | null) => {
      this.selectedCircle = circle;
      if (circle) {
        this.instrumentName = circle.instrument;
        this.newStartX = circle.startX;
        this.newStartY = circle.startY;
        this.selectedColor = circle.color;
        this.selectedNote = circle.note;
        this.selectedAlteration = Number(circle.alteration);
        this.selectedOctave = circle.octave;
        this.angleDepart = Math.atan2(-circle.ySpeed, circle.xSpeed);
        if (this.angleDepart < 0) {
          this.angleDepart += 2 * Math.PI;
        }
        this.angleDepart = +((this.angleDepart * 180) / Math.PI).toFixed(0);;
        this.newAngle = this.angleDepart;
        this.vitesseGlobale = +Math.sqrt(Math.pow(circle.xSpeed, 2) + Math.pow(circle.ySpeed, 2)).toFixed(2);
        this.maxBounces = circle.maxBounces;
        this.spawnTime = {
          millisecondes: circle.spawnTime % 1000,
          secondes: Math.floor(circle.spawnTime / 1000) % 60,
          minutes: Math.floor(circle.spawnTime / 60000) % 60
        };
      }
    });
  }

  setColor(color: string | undefined) {
    if (this.selectedCircle) {
      if (color != null) {
        this.selectedCircle.color = color;
      }
      this.circlesService.setColor(color);
    }
  }

  setNote(note: string | undefined) {
    if (this.selectedCircle) {
      if (note != null) {
        this.selectedCircle.note = note;
      }
      this.circlesService.setNote(note);
    }
  }

  setMaxBounces(maxBounces: number) {
    if (this.selectedCircle) {
      if (maxBounces != null) {
        this.selectedCircle.maxBounces = maxBounces;
      }
      this.circlesService.setMaxBounces(maxBounces);
    }
  }

  setAlteration(alteration: number | undefined) {
    let trueAlteration =""
    switch (alteration){
      case -1:
        trueAlteration = "b";
        break;
      case 0:
        trueAlteration = "";
        break;
      case 1:
        trueAlteration = "d";
        break;
    }

    if (this.selectedCircle) {
      if (alteration != null) {
        this.selectedCircle.alteration = trueAlteration;
      }
      this.circlesService.setAlteration(trueAlteration);
    }
  }

  setOctave(octave: number | undefined) {
    if (this.selectedCircle) {
      if (octave != null) {
        this.selectedCircle.octave = octave;
      }
      this.circlesService.setOctave(octave);
    }
  }

  getMinutesSpawnTime() {
    return this.spawnTime.minutes;
  }

  getSecondesSpawnTime() {
    return this.spawnTime.secondes;
  }

  getMillisecondesSpawnTime() {
    return this.spawnTime.millisecondes;
  }



  validateStartX(value: number | undefined) {
    if (value !== undefined) {
      if (value < -4.5) {
        this.newStartX = -4.5;
      } else if (value > 4.5) {
        this.newStartX = 4.5;
      } else {
        this.newStartX = value;
      }

      if (this.selectedCircle) {
        this.selectedCircle.startX = this.newStartX;
        this.circlesService.updatePos(this.selectedCircle, this.selectedCircle.startX, this.selectedCircle.startY);
      }
    }
  }

  validateStartY(value: number | undefined) {
    if (value !== undefined) {
      if (value < -4.5) {
        this.newStartY = -4.5;
      } else if (value > 4.5) {
        this.newStartY = 4.5;
      } else {
        this.newStartY = value;
      }

      if (this.selectedCircle) {
        this.selectedCircle.startY = this.newStartY;
        this.circlesService.updatePos(this.selectedCircle, this.selectedCircle.startX, this.selectedCircle.startY);
      }
    }
  }

  changeAngle(angle: number | undefined) {
    if (angle !== undefined && this.selectedCircle) {
      const speed = this.vitesseGlobale || 1;
      const xSpeed = speed * Math.cos((angle * Math.PI) / 180);
      const ySpeed = -speed * Math.sin((angle * Math.PI) / 180);
      this.selectedCircle.xSpeed = xSpeed;
      this.selectedCircle.ySpeed = ySpeed;
      this.circlesService.updateCircleSpeed(this.selectedCircle);
    }
  }

  onTimeChange(time: any) {
    if (this.selectedCircle) {
      this.selectedCircle.spawnTime = time.millisecondes + (time.secondes * 1000) + (time.minutes * 60000);
      this.circlesService.updateSpawnTime(this.selectedCircle);
      if(this.selectedCircle.spawnTime > 0) {
        this.circlesService.moveCircleToWaitingList(this.selectedCircle);
      } else {
        this.circlesService.moveCircleToAliveList(this.selectedCircle);
      }
      this.selectedCircle.spawnTime = this.selectedCircle.spawnTime;
      this.circlesService.setSpawnTime(this.selectedCircle.spawnTime);
    }
  }

  isTimerNotStarted() {
   return this.timerService.isTimerNotStarted();
  }

  changeSpeed(NewSpeed: number | undefined) {
    //maxspeed = squarunits * fps
    if (NewSpeed !== undefined && this.selectedCircle) {
      const angle = Math.atan2(this.selectedCircle.ySpeed, this.selectedCircle.xSpeed);
      const xSpeed = NewSpeed * Math.cos(angle);
      const ySpeed = NewSpeed * Math.sin(angle);
      this.selectedCircle.xSpeed = xSpeed;
      this.selectedCircle.ySpeed = ySpeed;
      this.circlesService.updateCircleSpeed(this.selectedCircle);
    }
  }

  increaseOctave() {
    if (this.selectedOctave && this.selectedOctave < 7) {
      this.selectedOctave++;
      this.circlesService.setOctave(this.selectedOctave);
    }
  }

  decreaseOctave() {
    if (this.selectedOctave &&this.selectedOctave > 1) {
      this.selectedOctave--;
      this.circlesService.setOctave(this.selectedOctave);
    }
  }

  isPercussion(instrument: string): boolean {
    return this.soundService.isPercussion(instrument);
  }
}
