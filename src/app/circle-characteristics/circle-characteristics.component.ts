import {Component, OnInit} from '@angular/core';
import {CircleService} from "../services/circle.service";
import {Circle} from "../models/circle";
import {TimerService} from "../services/timer.service";

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
  selectedAlteration: string = '';
  selectedOctave: number | undefined;
  availableColors: string[] = this.circlesService.colors;
  availableNotes: string[] = this.circlesService.notes;
  availableAlterations: string[] = this.circlesService.alterations;
  availableOctaves: string[] = this.circlesService.octaves;
  newStartX: number | undefined;
  newStartY: number | undefined;
  newAngle: number | undefined;

  constructor(private circlesService: CircleService, private timerService: TimerService) {}

  ngOnInit() {
    this.circlesService.selectedCircle$.subscribe((circle: Circle | null) => {
      this.selectedCircle = circle;
      if (circle) {
        this.newStartX = circle.startX;
        this.newStartY = circle.startY;
        this.selectedColor = circle.color;
        this.selectedNote = circle.note;
        this.selectedAlteration = circle.alteration;
        this.selectedOctave = circle.octave;
        this.angleDepart = Math.atan2(-circle.ySpeed, circle.xSpeed);
        if (this.angleDepart < 0) {
          this.angleDepart += 2 * Math.PI;
        }
        this.angleDepart = +((this.angleDepart * 180) / Math.PI).toFixed(0);;
        this.newAngle = this.angleDepart;
        this.vitesseGlobale = +Math.sqrt(Math.pow(circle.xSpeed, 2) + Math.pow(circle.ySpeed, 2)).toFixed(2);
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
  setAlteration(alteration: string | undefined) {
    if (this.selectedCircle) {
      if (alteration != null) {
        this.selectedCircle.alteration = alteration;
      }
      this.circlesService.setAlteration(alteration);
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
}
