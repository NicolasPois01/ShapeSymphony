import { Injectable } from "@angular/core";
import { Midi } from '@tonejs/midi'
import { SoundService } from "./sound.service";
import { Percussions } from "../models/percussionEnum";
import { CircleService } from "./circle.service";

interface StringArray {
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class MidiFileService {

  constructor(private soundService: SoundService, private circleService: CircleService) { }

  async processMidiFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      var midiProcessed = { name: file.name, elements: {} as StringArray };
      Midi.fromUrl(URL.createObjectURL(file)).then((midi) => {
        midi.tracks.forEach(track => {
          const notes = track.notes;
          notes.forEach(note => {
            let note_name = this.soundService.getValidNoteName(note.name);
            let alteration = this.soundService.getAlteration(note.name);
            midiProcessed.elements[track.instrument.family] = midiProcessed.elements[track.instrument.family] || {};
            midiProcessed.elements[track.instrument.family][note_name + alteration + note.octave] = midiProcessed.elements[track.instrument.family][note_name + alteration + note.octave] || [];
            midiProcessed.elements[track.instrument.family][note_name + alteration + note.octave].push({
              note: note_name,
              alteration: alteration,
              time: note.time.toFixed(3),
              duration: note.duration.toFixed(3),
              octave: note.octave,
              percussion: track.instrument.percussion,
              instrument: track.instrument.name,
              instrumentFamily: track.instrument.family,
              volume: Math.floor(note.velocity * 100)
            });
          });
        });
        resolve(midiProcessed);
      });
    });
  }

  async processMidiObject(midi: Midi): Promise<any> {
    return new Promise((resolve, reject) => {
      var midiProcessed = { name: "imported", elements: {} as StringArray };
      midi.tracks.forEach(track => {
        const notes = track.notes;
        notes.forEach(note => {
          let note_name = this.soundService.getValidNoteName(note.name);
          let alteration = this.soundService.getAlteration(note.name);
          midiProcessed.elements[track.instrument.family] = midiProcessed.elements[track.instrument.family] || {};
          midiProcessed.elements[track.instrument.family][note_name + alteration + note.octave] = midiProcessed.elements[track.instrument.family][note_name + alteration + note.octave] || [];
          midiProcessed.elements[track.instrument.family][note_name + alteration + note.octave].push({
            note: note_name,
            alteration: alteration,
            time: note.time.toFixed(3),
            duration: note.duration.toFixed(3),
            octave: note.octave,
            percussion: track.instrument.percussion,
            instrument: track.instrument.name,
            instrumentFamily: track.instrument.family,
            volume: Math.floor(note.velocity * 100)
          });
        });
      });
      resolve(midiProcessed);
    });
  }


  getCircles(processMidiFile: any): any[] {
    var circle_sets = Array<any>();
    var suites = Array<any>();
    var circle_set = Array<any>();
    console.log(processMidiFile);
    (Object.entries(processMidiFile.elements) as any[]).forEach(([_instrument_index, instrument]) => {
      (Object.entries(instrument) as any[]).forEach(([note_index, notes]) => {
        console.log(notes);
        notes.forEach((note_first: any, index_note_first: any) => {
          circle_set.push(note_first);
          notes.every((note_ecart: any, index_note_ecart: any) => {
            if (index_note_ecart <= index_note_first) {
              return true;
            }
            let current_suite = Array<any>();
            current_suite.push(note_first);
            current_suite.push(note_ecart);
            let ecart = note_ecart.time - note_first.time;
            let last_time = note_ecart.time;
            notes.every((note: any, index_note: any) => {
              if (index_note <= index_note_ecart) {
                return true;
              }
              if (note.time - last_time == ecart) {
                current_suite.push(note);
                last_time = note.time;
                return true;
              } else if (note.time - last_time <= ecart) {
                return true;
              } else {
                return false;
              }
            });
            suites.push(current_suite);
            return true;
          });
        });
      });
    });
    // sort array by length
    suites.sort((a, b) => {
      return b.length - a.length;
    });
    suites.forEach((suite: any) => {
      let circle_keeped = false;
      suite.forEach((note: any) => {
        if (!circle_set.includes(note)) {
          circle_keeped = true;
        }
      });
      if (!circle_keeped) {
        circle_sets.push(suite);
        suite.forEach((note: any) => {
          if (circle_set.indexOf(note) != -1)
            circle_set.splice(circle_set.indexOf(note), 1);
        });
      }
    });
    circle_set.forEach((note: any) => {
      circle_sets.push([note]);
    });
    circle_sets.forEach((circle_set, index) => {
      let randomDirection = Math.floor(Math.random() * 2);
      if (circle_set.length > 1) {
        /*
        * |                      distance (m)   |
        * |                      ecart_time (s) |
        * |                  x<---------------->|
        * |                   A (x,y)           |
        * |<----------------------------------->|
        * |               ecart (s)             |
        */
        let x = Math.round((Math.random() * 8) - 4);
        let y = x;
        let ecart = circle_set[1].time - circle_set[0].time;
        let direction = 0;
        let distance = 0;
        let speed = 0;
        if (randomDirection == 0) {
          y = Math.round((Math.random() * 8) - 4);
          direction = Math.round(Math.random()); // 0 = horizontal, 1 = vertical
          distance = direction ? 4.5 - Math.abs(y) : 4.5 - Math.abs(x);
          speed = 9 / ecart;
        } else {
          direction = Math.floor(Math.random() * 4); // 0 = droite bas, 1 = droite haut, 2 = gauche haut, 3 = gauche bas
          distance = Math.sqrt(40.5) - Math.sqrt(2 * Math.pow(Math.abs(x), 2));
          speed = Math.sqrt(162) / ecart;
          if (direction === 0 && x < 0) {
            x = -x;
            y = x;
          } else if (direction === 1) {
            if (x < 0) {
              x = -x;
            } else {
              y = -y;
            }
          } else if (direction === 2 && x > 0) {
            x = -x;
            y = x;
          } else if (direction === 3) {
            if (x < 0) {
              y = -y;
            } else {
              x = -x;
            }
          }
        }
        let ecart_time = distance / speed;
        let spawnTime = (circle_set[0].time - ecart_time) * 1000
        if (ecart_time > circle_set[0].time) {
          spawnTime = 0;
          let ecart_distance = circle_set[0].time * speed;
          if (randomDirection == 0) {
            if (direction) {
              y = 4.5 - ecart_distance;
            } else {
              x = 4.5 - ecart_distance;
            }
          } else {
            if (x > 0) {
              x = 4.5 - Math.sqrt(Math.pow(ecart_distance, 2) / 2);
            } else {
              x = -4.5 + Math.sqrt(Math.pow(ecart_distance, 2) / 2);
            }
            if (y > 0) {
              y = 4.5 - Math.sqrt(Math.pow(ecart_distance, 2) / 2);
            } else {
              y = -4.5 + Math.sqrt(Math.pow(ecart_distance, 2) / 2);
            }
          }
        }
        if (randomDirection == 0) {
          if (direction === 1 && y < 0) {
            speed = -speed;
          } else if (direction === 0 && x < 0) {
            speed = -speed;
          }
        }
        let instrument = this.soundService.getValidInstrument(circle_set[0].instrument, circle_set[0].instrumentFamily);
        let audioFilePath = "";
        if (Object.values(Percussions).includes(instrument as Percussions)) {
          let audioFileName = instrument + '.mp3';
          audioFilePath = `./assets/samples/Percussion/${audioFileName}`;
        } else {
          let audioFileName = instrument + circle_set[0].note + circle_set[0].alteration + circle_set[0].octave + '.mp3';
          audioFilePath = `./assets/samples/${instrument}/${audioFileName}`;
        }
        const audio = new Audio(audioFilePath);
        audio.volume = (circle_set[0].volume / 100);
        if (randomDirection == 1) {
          speed = Math.sqrt(Math.pow(speed, 2) / 2);
        }
        circle_sets[index] = {
          id: index,
          x: x,
          y: y,
          xSpeed: randomDirection == 0 ? (direction ? 0 : speed) : (direction === 0 || direction === 1 ? speed : -speed),
          ySpeed: randomDirection == 0 ? (direction ? speed : 0) : (direction === 0 || direction === 3 ? speed : -speed),
          color: this.circleService.getRandomColor(),
          startX: x,
          startY: y,
          startXSpeed: randomDirection == 0 ? (direction ? 0 : speed) : (direction === 0 || direction === 1 ? speed : -speed),
          startYSpeed: randomDirection == 0 ? (direction ? speed : 0) : (direction === 0 || direction === 3 ? speed : -speed),
          instrument: instrument,
          note: circle_set[0].note,
          alteration: circle_set[0].alteration,
          octave: circle_set[0].octave,
          volume: circle_set[0].volume,
          spawnTime: spawnTime,
          maxBounces: circle_set.length,
          maxTime: 0,
          nbBounces: 0,
          showable: true,
          contactPoint: { x: -1, y: -1 },
          isColliding: false,
          audio: audio
        };
      } else {
        let x = Math.round((Math.random() * 8) - 4);
        let y = Math.round((Math.random() * 8) - 4);
        let contactPoint = Math.round((Math.random() * 9) - 4.5);
        let contactWall = Math.round(Math.random() * 3);
        let xContact = contactPoint;
        let yContact = contactPoint;
        if (contactWall === 0) {
          xContact = 4.5;
        } else if (contactWall === 1) {
          yContact = -4.5;
        } else if (contactWall === 2) {
          xContact = -4.5;
        } else {
          yContact = 4.5;
        }
        let distance = Math.sqrt(Math.pow(xContact - x, 2) + Math.pow(yContact - y, 2));
        let speed = distance / 10;
        if (circle_set[0].time < 10) {
          speed = distance / circle_set[0].time;
        }
        let xSpeed = (xContact - x) / 10;
        let ySpeed = (yContact - y) / 10;
        let instrument = this.soundService.getValidInstrument(circle_set[0].instrument, circle_set[0].instrumentFamily);
        let audioFilePath = "";
        if (Object.values(Percussions).includes(instrument as Percussions)) {
          let audioFileName = instrument + '.mp3';
          audioFilePath = `./assets/samples/Percussion/${audioFileName}`;
        } else {
          let audioFileName = instrument + circle_set[0].note + circle_set[0].alteration + circle_set[0].octave + '.mp3';
          audioFilePath = `./assets/samples/${instrument}/${audioFileName}`;
        }
        const audio = new Audio(audioFilePath);
        audio.volume = (circle_set[0].volume / 100);
        console.log(circle_set[0].time);
        console.log(circle_set[0]);
        circle_sets[index] = {
          id: index,
          x: x,
          y: y,
          xSpeed: xSpeed,
          ySpeed: ySpeed,
          color: this.circleService.getRandomColor(),
          startX: x,
          startY: y,
          startXSpeed: xSpeed,
          startYSpeed: ySpeed,
          instrument: instrument,
          note: circle_set[0].note,
          alteration: circle_set[0].alteration,
          octave: circle_set[0].octave,
          volume: circle_set[0].volume,
          spawnTime: circle_set[0].time < 1 ? 0 : (circle_set[0].time * 1000) - 10000,
          maxBounces: 1,
          maxTime: 0,
          nbBounces: 0,
          showable: true,
          contactPoint: { x: -1, y: -1 },
          isColliding: false,
          audio: audio
        };
      }
    });
    return circle_sets;
  }
}
