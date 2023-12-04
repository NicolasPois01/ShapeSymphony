import { Injectable } from '@angular/core';
import { Circle } from '../models/circle';
import { TimerService } from './timer.service';

@Injectable({
  providedIn: 'root'
})
export class ExportMp3Service {
  private collisionData: any[] = []; // Liste pour stocker les données de collision
  private currentTime: number=0;

  constructor(private timerService: TimerService) {
  }
  exportMp3(circle: Circle) {
    this.currentTime = this.timerService.getTimeStamp();
    console.log("running in export service    " + this.timerService?.getIsRunning());
    console.log("Current time in ExportMp3Service: " + this.currentTime);
    // Créez un objet avec les données de collision
    const collisionInfo = {
      instrument: circle.instrument,
      note: circle.note,
      octave: circle.octave,
      alteration: circle.alteration,
      currentTime: this.currentTime/10
    };

    // Ajoutez l'objet à la liste de collision
    this.collisionData.push(collisionInfo);
  }

  // Méthode pour exporter les données stockées en JSON
  exportCollisionDataAsJson() {
    return JSON.stringify(this.collisionData);
  }

  // Méthode pour réinitialiser les données stockées
  resetCollisionData() {
    this.collisionData = [];
  }



}
