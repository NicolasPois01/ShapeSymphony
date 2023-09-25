import { Injectable } from '@angular/core';
import {Circle} from "../models/circle";

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  instruments = ["Piano", "Batterie", "Guitare", "Violon", "Trompette", "Clavecin"];
  //notes = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];
  notes = ["A", "B", "C", "D", "E", "F", "G"];    //Note sous convention universelle
  octaves = ["1","2","3","4","5","6","7"];
  alterations = ["","b","d"];   //Legende : d=dièse, b=bémol.

  activeInstrument = "Piano";
  activeNote = "Do";
  activeOctaves = "3";
  activeAlteration = "";

  constructor() { }

  async loadAudioFiles() {
      for (const instrument of this.instruments) {
        for (const note of this.notes) {
          for (const octave of this.octaves) {
            for (const alteration of this.alterations) {
            const audioFileName = ${instrument}${note}${alteration}${octave}'.aiff';
            const audioFilePath = 'C:/Users/Lenovo/Desktop/Mines Ales/2ème Année/Web_services/ShapeSymphony/Samples/'${audioFileName};
            //Vérifie si le fichier audio existe :
            const response = await fetch(audioFilePath, { method: 'HEAD' });
              if (response.ok) {
                const audio = new Audio(audioFilePath);
                audio.load();   //Chargement des samples audio
              }
            }
          }
        }
      }
    }
  }

  $scope.playAudio = function(circle : Circle) {
       const audioFileName = Circle.Instrument+Circle.Note+Circle.Alteration+Circle.Octave+'.aiff';
       const audioFilePath = 'C:/Users/Lenovo/Desktop/Mines Ales/2ème Année/Web_services/ShapeSymphony/Samples/'${audioFileName};
       const audio = new Audio(audioFilePath);
       audio.play();
  };

  setActiveInstrument(instrument: string) {
    this.activeInstrument = instrument;
  }
}
