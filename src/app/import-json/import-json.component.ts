import { Component } from '@angular/core';
import { CircleService } from '../services/circle.service';

@Component({
  selector: 'app-import-json',
  templateUrl: './import-json.component.html',
  styleUrls: ['./import-json.component.scss']
})
export class ImportJsonComponent {

  constructor(private circleService: CircleService) { }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const jsonString = e.target.result;
        this.playCirclesFromJson(jsonString);
      };
      reader.readAsText(file);
    }
  }

  playCirclesFromJson(jsonString: string): void {
    try {
      const circles = JSON.parse(jsonString);
      if (Array.isArray(circles)) {
        circles.forEach(circleData => {
          this.circleService.addCircle(circleData.x, circleData.y, circleData.vX, circleData.vY);
          // Note: Ici, nous considérons simplement x et y, mais si vous souhaitez prendre en compte d'autres attributs, vous devrez les intégrer également.
        });
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier JSON.", error);
    }
  }
}
