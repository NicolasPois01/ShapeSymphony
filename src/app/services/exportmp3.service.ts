import {Injectable} from "@angular/core";
import {Circle} from "../models/circle";
import {TimerService} from "./timer.service";
@Injectable({
  providedIn: 'root'
})
export class ExportMp3Service {

  constructor(private timerService: TimerService) {
  }

  exportMp3(circle: Circle) {
    const currentTime = this.timerService.getTimeStamp();

    // Créez un objet JSON avec les données requises
    const mp3Data = {
      instrument: circle.instrument,
      note: circle.note,
      octave: circle.octave,
      alteration: circle.alteration,
      currentTime: currentTime  // Utilisez la valeur de currentTime ici
    };

      return JSON.stringify(mp3Data);
  }
}
