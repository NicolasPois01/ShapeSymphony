import { Component } from '@angular/core';
import { CircleService } from '../services/circle.service';
import { TimerService } from '../services/timer.service';
import { Circle } from '../models/circle';

@Component({
  selector: 'app-import-json',
  templateUrl: './import-json.component.html',
  styleUrls: ['./import-json.component.scss']
})
export class ImportJsonComponent {

  constructor(private circleService: CircleService, private timerService: TimerService) { }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const jsonString = e.target.result;
        this.playCirclesFromJson(jsonString);
      };
      reader.readAsText(file);

      // Réinitialiser la valeur de l'input pour permettre l'importation du même fichier
      event.target.value = '';
    }
  }


  playCirclesFromJson(jsonString: string): void {
    try {
      const circles = JSON.parse(jsonString);
      if (Array.isArray(circles)) {
        this.circleService.clearAllCircles();
        this.timerService.resetTimer();
        circles.forEach(circleData => {
          let circle = new Circle(circleData.id, circleData.startX, circleData.startY, circleData.xSpeed, circleData.ySpeed, circleData.color, circleData.instrument,  circleData.note, circleData.alteration, circleData.octave)
          this.circleService.addCircleToActiveArena(circle);
        });
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier JSON.", error);
    }
  }
}
