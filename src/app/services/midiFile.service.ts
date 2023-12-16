import { Injectable } from "@angular/core";
import { Midi } from '@tonejs/midi'
import { SoundService } from "./sound.service";
import { Percussions } from "../models/percussionEnum";

interface StringArray {
    [key:string]: any
}

@Injectable({
    providedIn: 'root'
})
export class MidiFileService {

    constructor(private soundService: SoundService) {}

    async processMidiFile(file: File): Promise<any> {
        return new Promise(async (resolve, reject) => {
            var midiProcessed = { name: file.name, elements: {} as StringArray };
            const midi = await Midi.fromUrl(URL.createObjectURL(file));
            midi.tracks.forEach(track => {
                const notes = track.notes;
                notes.forEach(note => {
                    let note_name = this.soundService.getValidNoteName(note.name);
                    let alteration = this.soundService.getAlteration(note.name);
                    midiProcessed.elements[track.instrument.family] = midiProcessed.elements[track.instrument.family] || {};
                    midiProcessed.elements[track.instrument.family][note_name+alteration+note.octave] = midiProcessed.elements[track.instrument.family][note_name+alteration+note.octave] || [];
                    midiProcessed.elements[track.instrument.family][note_name+alteration+note.octave].push({
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
        (Object.entries(processMidiFile.elements) as any[]).forEach(([instrument_index, instrument]) => {
            (Object.entries(instrument) as any[]).forEach(([note_index, notes]) => {
                notes.forEach((note_first: any, index_note_first: any) => {
                    circle_set.push(note_first);
                    notes.every((note_ecart: any, index_note_ecart: any) => {
                        if(index_note_ecart <= index_note_first) {
                            return true;
                        }
                        let current_suite = Array<any>();
                        current_suite.push(note_first);
                        current_suite.push(note_ecart);
                        let ecart = note_ecart.time - note_first.time;
                        let last_time = note_ecart.time;
                        notes.every((note: any, index_note: any) => {
                            if(index_note <= index_note_ecart) {
                                return true;
                            }
                            if(note.time - last_time == ecart) {
                                current_suite.push(note);
                                last_time = note.time;
                                return true;
                            } else if(note.time - last_time <= ecart) {
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
                if(!circle_set.includes(note)) {
                    circle_keeped = true;
                }
            });
            if(!circle_keeped) {
                circle_sets.push(suite);
                suite.forEach((note: any) => {
                    if(circle_set.indexOf(note) != -1)
                        circle_set.splice(circle_set.indexOf(note), 1);
                });
            }
        });
        circle_set.forEach((note: any) => {
            circle_sets.push([note]);
        });
        circle_sets.forEach((circle_set, index) => {
            if(circle_set.length > 1) {
                /*
                * |                      distance (m)   |
                * |                      ecart_time (s) |
                * |                  x<---------------->|
                * |                   A (x,y)           |
                * |<----------------------------------->|
                * |               ecart (s)             |
                */
                let x = Math.round((Math.random() * 8) - 4);
                let y = Math.round((Math.random() * 8) - 4);
                let ecart = circle_set[1].time - circle_set[0].time;
                let direction = Math.round(Math.random()); // 0 = horizontal, 1 = vertical
                let distance = direction ? 4.5 - Math.abs(y) : 4.5 - Math.abs(x);
                let speed = 9 / ecart;
                let ecart_time = distance / speed;
                let spawnTime = (circle_set[0].time - ecart_time) * 1000
                if(ecart_time > circle_set[0].time) {
                    spawnTime = 0;
                    let ecart_distance = circle_set[0].time / speed;
                    if(direction) {
                        y = 4.5 - ecart_distance;
                    } else {
                        x = 4.5 - ecart_distance;
                    }
                }
                if(direction === 1 && y < 0) {
                    speed = -speed;
                } else if(direction === 0 && x < 0) {
                    speed = -speed;
                }
                let instrument = this.soundService.getValidInstrument(circle_set[0].instrument, circle_set[0].instrumentFamily);
                let audioFilePath = "";
                if (Object.values(Percussions).includes(instrument as Percussions)){
                  let audioFileName = instrument+'.mp3';
                  audioFilePath = `./assets/samples/Percussion/${audioFileName}`;
                } else {
                  let audioFileName = instrument+circle_set[0].note+circle_set[0].alteration+circle_set[0].octave+'.mp3';
                  audioFilePath = `./assets/samples/${instrument}/${audioFileName}`;
                }
                const audio = new Audio(audioFilePath);
                audio.volume = (50/100);
                circle_sets[index] = {
                    id: index,
                    x: x,
                    y: y,
                    xSpeed: direction ? 0 : speed,
                    ySpeed: direction ? speed : 0,
                    color: "red",
                    startX: x,
                    startY: y,
                    startXSpeed: direction ? 0 : speed,
                    startYSpeed: direction ? speed : 0,
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
                    contactPoint: {x: -1, y: -1},
                    isColliding: false,
                    audio: audio
                };
            } else {
                let x = Math.round((Math.random() * 8) - 4);
                let y = Math.round((Math.random() * 8) - 4);
                let direction = Math.round(Math.random()); // 0 = horizontal, 1 = vertical
                let distance = direction ? 4.5 - Math.abs(y) : 4.5 - Math.abs(x);
                let speed = distance;
                if(circle_set[0].time < 1) {
                    speed = distance / circle_set[0].time;
                }
                if(direction === 1 && y < 0) {
                    speed = -speed;
                } else if(direction === 0 && x < 0) {
                    speed = -speed;
                }
                let instrument = this.soundService.getValidInstrument(circle_set[0].instrument, circle_set[0].instrumentFamily);
                let audioFilePath = "";
                if (Object.values(Percussions).includes(instrument as Percussions)){
                  let audioFileName = instrument+'.mp3';
                  audioFilePath = `./assets/samples/Percussion/${audioFileName}`;
                } else {
                  let audioFileName = instrument+circle_set[0].note+circle_set[0].alteration+circle_set[0].octave+'.mp3';
                  audioFilePath = `./assets/samples/${instrument}/${audioFileName}`;
                }
                const audio = new Audio(audioFilePath);
                audio.volume = (50/100);
                circle_sets[index] = {
                    id: index,
                    x: x,
                    y: y,
                    xSpeed: direction ? 0 : speed,
                    ySpeed: direction ? speed : 0,
                    color: "red",
                    startX: x,
                    startY: y,
                    startXSpeed: direction ? 0 : speed,
                    startYSpeed: direction ? speed : 0,
                    instrument: instrument,
                    note: circle_set[0].note,
                    alteration: circle_set[0].alteration,
                    octave: circle_set[0].octave,
                    volume: circle_set[0].volume,
                    spawnTime: circle_set[0].time < 1 ? 0 : (circle_set[0].time * 1000) - 1000,
                    maxBounces: 1,
                    maxTime: 0,
                    nbBounces: 0,
                    showable: true,
                    contactPoint: {x: -1, y: -1},
                    isColliding: false,
                    audio: audio
                };
            }
        });
        return circle_sets;
    }
}
