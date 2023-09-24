import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  instruments = ["Piano", "Batterie", "Guitare", "Violon", "Trompette", "Clavecin"];
  //notes = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];
  notes = ["A", "B", "C", "D", "E", "F", "G"];
  octaves = ["1","2","3","4","5","6","7"];
  hauteurs = ["","b","d"];

  activeInstrument = "Piano"
  activeNote = "Do"
  activeOctaves = "3"
  activeHauteurs = ""

  constructor() { }

  async loadAudioFiles() {
      for (const instrument of this.instruments) {
        for (const note of this.notes) {
          for (const octave of this.octaves) {
            for (const hauteur of this.hauteurs) {
            const audioFileName = `${instrument}${note}${hauteur}${octave}.aiff`;
            const audioFilePath = `C:/Users/Lenovo/Desktop/Mines Ales/2ème Année/Web_services/ShapeSymphony/Samples/${audioFileName}`;
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

  $scope.playAudio = function() {
       audio.play();
  };

  setActiveInstrument(instrument: string) {
    this.activeInstrument = instrument;
  }
}
