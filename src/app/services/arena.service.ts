import { Injectable } from '@angular/core';
import { Arena } from "../models/arena";
import { BehaviorSubject, Observable } from "rxjs";
import { Circle } from "../models/circle";
import { CircleService } from "./circle.service";
import { MidiFileService } from './midiFile.service';
import { BasicPitch, noteFramesToTime, addPitchBendsToNoteEvents, outputToNotesPoly } from '@spotify/basic-pitch';
import { Midi } from "@tonejs/midi";

@Injectable({
  providedIn: 'root'
})
export class ArenaService {

  private arenaListSubject = new BehaviorSubject<Arena[]>([
    {
      id: 0,
      circleListWaiting: [],
      circleListDead: [],
      circleListAlive: [],
      isMuted: false,
      name: 'Arène 1'
    }
  ]);
  arenaList$: Observable<Arena[]> = this.arenaListSubject.asObservable();

  activeArenaSubject = new BehaviorSubject<Arena>({
    id: 0,
    circleListWaiting: [],
    circleListDead: [],
    circleListAlive: [],
    isMuted: false,
    name: 'Arène 1'
  });
  activeArena$ = this.activeArenaSubject.asObservable();

  constructor(private circleService: CircleService, private midiFileService: MidiFileService) {

    this.activeArenaSubject.next(this.arenaListSubject.getValue()[0]);

    this.circleService.circleNewAlive$.subscribe(circle => {
      let arena = this.activeArenaSubject.getValue();
      arena.circleListAlive.push(circle);
      this.activeArenaSubject.next(arena);
    });

    this.circleService.circleMovedToWaiting$.subscribe(circle => {
      this.moveCircleToWaitingList(circle);
    });
    this.circleService.circleMovedToDead$.subscribe(circle => {
      this.moveCircleToDeadList(circle);
    });
    this.circleService.circleMovedToAlive$.subscribe(circle => {
      this.moveCircleToAliveList(circle);
    });


  }

  addArena(): number {
    const currentArenas = this.arenaListSubject.getValue();
    let newId = 0;

    // Create a sorted array of existing IDs for efficient checking
    const existingIds = currentArenas.map(arena => arena.id).sort((a, b) => a - b);

    // Find the first unused ID
    while (existingIds.includes(newId)) {
      newId++;
    }
    let newNameNumber: number = newId + 1;

    const newArena: Arena = {
      id: newId,
      circleListWaiting: [],
      circleListDead: [],
      circleListAlive: [],
      isMuted: false,
      name: 'Arène ' + newNameNumber
    };

    const updatedArenas = [...this.arenaListSubject.getValue(), newArena];
    this.arenaListSubject.next(updatedArenas);
    this.activeArenaSubject.next(newArena);

    return newArena.id;
  }

  setActiveArena(idArena: number) {
    const arena = this.arenaListSubject.getValue().find(arena => arena.id === idArena);
    if (arena) {
      this.activeArenaSubject.next(arena);
    }
  }

  muteArena(idArena: number) {
    // Get the current list of arenas
    const arenas = this.arenaListSubject.getValue();

    // Find the arena with the specified ID
    const arenaToMute = arenas.find(arena => arena.id === idArena);

    // Check if the arena was found
    if (arenaToMute) {
      // Toggle the `isMuted` property of the arena
      arenaToMute.isMuted = true;

      // Update the arena list subject with the modified arena list
      this.arenaListSubject.next([...arenas]);
    }
  }

  unmuteArena(idArena: number) {
    // Get the current list of arenas
    const arenas = this.arenaListSubject.getValue();

    // Find the arena with the specified ID
    const arenaToMute = arenas.find(arena => arena.id === idArena);

    // Check if the arena was found
    if (arenaToMute) {
      // Toggle the `isMuted` property of the arena
      arenaToMute.isMuted = false;

      // Update the arena list subject with the modified arena list
      this.arenaListSubject.next([...arenas]);
    }
  }

  deleteArena(idArena: number) {
    const currentArenas = this.arenaListSubject.getValue();

    // Prevent deletion if only one arena exists
    if (currentArenas.length === 1) {
      return;
    }

    const updatedArenas = currentArenas.filter(arena => arena.id !== idArena);
    this.arenaListSubject.next(updatedArenas);

    // Check if the deleted arena was the active one
    if (this.activeArenaSubject.getValue().id === idArena) {
      // Set the first arena as the new active arena
      this.activeArenaSubject.next(updatedArenas[0]);
    }
  }

  isActiveArena(idArena: number): boolean {
    return this.activeArenaSubject.getValue()?.id === idArena;
  }

  deleteCircleFromActiveArena(circle: Circle) {
    // Get the current active arena
    const activeArena = this.activeArenaSubject.getValue();

    // Filter out the circle to be deleted from the circleList
    const updatedCircleListWaiting = activeArena.circleListWaiting.filter(c => c.id !== circle.id);
    const updatedCircleListAlive = activeArena.circleListAlive.filter(c => c.id !== circle.id);
    const updatedCircleListDead = activeArena.circleListDead.filter(c => c.id !== circle.id);

    // Create an updated arena without the deleted circle
    const updatedArena = { ...activeArena, circleListWaiting: updatedCircleListWaiting, circleListAlive: updatedCircleListAlive, circleListDead: updatedCircleListDead };

    // Update the active arena subject with the updated arena
    this.activeArenaSubject.next(updatedArena);

    // Update the arena list as well (if needed)
    const arenas = this.arenaListSubject.getValue();
    const arenaIndex = arenas.findIndex(a => a.id === activeArena.id);

    if (arenaIndex !== -1) {
      // Update the arena in the list with the updated arena
      arenas[arenaIndex] = updatedArena;

      // Update the arena list subject with the updated list of arenas
      this.arenaListSubject.next(arenas);
    }
  }

  moveCircleToDeadList(circle: Circle) {
    const arenas = this.arenaListSubject.getValue();
    arenas.forEach((arena, arenaIndex) => {
      const index = arena.circleListAlive.findIndex(c => c.id === circle.id);
      if (index !== -1) {
        arena.circleListAlive.splice(index, 1);
        arena.circleListDead.push(circle);
        arenas[arenaIndex] = arena;
        this.arenaListSubject.next([...arenas]);
        if (arena.id === this.activeArenaSubject.getValue().id) {
          this.activeArenaSubject.next(arena);
        }
        return;
      }
    });
  }

  moveCircleToWaitingList(circle: Circle) {
    const arenas = this.arenaListSubject.getValue();
    arenas.forEach((arena, arenaIndex) => {
      const index = arena.circleListAlive.findIndex(c => c.id === circle.id);
      if (index !== -1) {
        arena.circleListAlive.splice(index, 1);
        arena.circleListWaiting.push(circle);
        arenas[arenaIndex] = arena;
        this.arenaListSubject.next(arenas);
        if (arena.id === this.activeArenaSubject.getValue().id) {
          this.activeArenaSubject.next(arena);
        }
        return;
      }
    });
  }

  moveCircleToAliveList(circle: Circle) {
    const arenas = this.arenaListSubject.getValue();
    arenas.forEach((arena, arenaIndex) => {
      const index = arena.circleListWaiting.findIndex(c => c.id === circle.id);
      if (index !== -1) {
        arena.circleListWaiting.splice(index, 1);
        arena.circleListAlive.push(circle);
        arenas[arenaIndex] = arena;
        this.arenaListSubject.next(arenas);
        if (arena.id === this.activeArenaSubject.getValue().id) {
          this.activeArenaSubject.next(arena);
        }
        return;
      }
    });
  }

  updateArenas(elapsedTime: number, time: number, squareUnit: number, exportMP3Active: boolean = false, mode: string = 'Normal') {
    const arenas = this.arenaListSubject.getValue();

    let midSquareSize = squareUnit / 2 - this.circleService.circleRad;

    for (let arena of arenas) {
      for (let circle of arena.circleListWaiting) {
        if (time >= circle.spawnTime) {
          this.circleService.moveCircleToAliveList(circle);
        }
      };
      for (let circle of arena.circleListAlive) {
        this.circleService.calculatePos(elapsedTime, time, circle, squareUnit, arena.isMuted, midSquareSize, exportMP3Active);
      };
    };

    this.arenaListSubject.next(arenas);
  }

  clearAll() {
    const currentArenas = this.arenaListSubject.getValue();

    currentArenas[0].circleListAlive = [];
    currentArenas[0].circleListDead = [];
    currentArenas[0].circleListWaiting = [];

    const updatedArenas = [currentArenas[0]];

    this.arenaListSubject.next(updatedArenas);
    this.activeArenaSubject.next(updatedArenas[0]);
  }

  clearArenaById(idArena: number): void {
    const arenas = this.arenaListSubject.getValue();
    const arenaIndex = arenas.findIndex(a => a.id === idArena);

    if (arenaIndex !== -1) {
      // Clear the circle lists of the targeted arena
      arenas[arenaIndex].circleListAlive = [];
      arenas[arenaIndex].circleListDead = [];
      arenas[arenaIndex].circleListWaiting = [];

      // Update the arena list with the modified arena
      this.arenaListSubject.next([...arenas]);

      // If the cleared arena is the active one, update the active arena subject
      if (this.activeArenaSubject.getValue().id === idArena) {
        this.activeArenaSubject.next(arenas[arenaIndex]);
      }
    }
  }

  restoreArenas() {
    let tempoArenaList = this.arenaListSubject.getValue();
    let arenaActiveId = 0;
    tempoArenaList.forEach(arena => {
      if (this.activeArenaSubject.getValue().id === arena.id) {
        arenaActiveId = arena.id;
      }
      arena.circleListDead.forEach(circle => {
        if (circle.spawnTime > 0) {
          arena.circleListWaiting.push(circle);
        } else {
          arena.circleListAlive.push(circle);
        }
      });
      arena.circleListDead = [];
      arena.circleListAlive = arena.circleListAlive.filter(circle => {
        circle.x = circle.startX;
        circle.y = circle.startY;
        circle.xSpeed = circle.startXSpeed;
        circle.ySpeed = circle.startYSpeed;
        circle.nbBounces = 0;
        circle.showable = true;
        circle.isColliding = false;
        circle.contactPoint = { x: -1, y: -1 };
        if (circle.spawnTime > 0) {
          arena.circleListWaiting.push(circle);
          return false;
        }
        return true;
      });

      arena.circleListWaiting = arena.circleListWaiting.filter(circle => {
        circle.x = circle.startX;
        circle.y = circle.startY;
        circle.xSpeed = circle.startXSpeed;
        circle.ySpeed = circle.startYSpeed;
        circle.nbBounces = 0;
        circle.showable = true;
        circle.isColliding = false;
        circle.contactPoint = { x: -1, y: -1 };
        return true;
      });
    });
    this.setArenaList(tempoArenaList, arenaActiveId);
  }

  setArenaList(arenaList: Arena[], arenaActiveId: number) {
    this.arenaListSubject.next(arenaList);
    this.activeArenaSubject.next(arenaList[arenaActiveId]);
  }

  setArenaName(idArena: number, name: string) {
    const arenas = this.arenaListSubject.getValue();
    const arenaIndex = arenas.findIndex(a => a.id === idArena);

    if (arenaIndex !== -1) {
      // Update the arena in the list with the modified active arena
      arenas[arenaIndex].name = name;
      // Update the arena list subject with the updated list of arenas
      this.arenaListSubject.next([...arenas]);
    }
  }

  async uploadMidiFile(file: File) {
    this.clearAll();
    let processedMidiFile = await this.midiFileService.processMidiFile(file);
    let circles = this.midiFileService.getCircles(processedMidiFile);
    let arena = this.activeArenaSubject.getValue();
    arena.circleListWaiting = circles.filter(circle => circle.spawnTime > 0);
    arena.circleListAlive = circles.filter(circle => circle.spawnTime === 0);
    this.setArenaList(this.arenaListSubject.getValue(), arena.id);
    this.circleService.setCircleListWaiting(arena.circleListWaiting);
    this.circleService.setCircleListAlive(arena.circleListAlive);
  }

  async uploadAudioFile(file: File) {
    var audioCtx = new AudioContext({ sampleRate: 22050 });
    const soundBuffer = await file.arrayBuffer();
    const sampleBuffer = await audioCtx.decodeAudioData(soundBuffer);
    const sampleSource = audioCtx.createBufferSource();
    const monoBuffer = audioCtx.createBuffer(1, sampleBuffer.length, audioCtx.sampleRate);
    if (sampleBuffer.numberOfChannels > 1) {
      for (let i = 0; i < sampleBuffer.length; i++) {
        monoBuffer.getChannelData(0)[i] = (sampleBuffer.getChannelData(0)[i] + sampleBuffer.getChannelData(1)[i]) / 2;
      }
    } else {
      monoBuffer.getChannelData(0).set(sampleBuffer.getChannelData(0));
    }
    sampleSource.buffer = monoBuffer;
    sampleSource.connect(audioCtx.destination);
    const frames: any[] = [];
    const onsets: any[] = [];
    const contours: any[] = [];
    let pct = 0;
    const model = "https://unpkg.com/@spotify/basic-pitch@1.0.1/model/model.json";
    const basicPitch = new BasicPitch(model);
    await basicPitch.evaluateModel(
      sampleSource.buffer,
      (f, o, c) => {
        frames.push(...f);
        onsets.push(...o);
        contours.push(...c);
      },
      (p) => {
        pct = p;
      }
    );

    const notes = noteFramesToTime(
      addPitchBendsToNoteEvents(
        contours,
        outputToNotesPoly(frames, onsets, 0.5, 0.5, 5)
      )
    );

    const midi = new Midi();
    const track = midi.addTrack();
    notes.forEach(note => {
      track.addNote({
        midi: note.pitchMidi,
        time: note.startTimeSeconds,
        duration: note.durationSeconds,
        velocity: note.amplitude,
      });
      if (note.pitchBends !== undefined && note.pitchBends !== null) {
        note.pitchBends.forEach((bend, i) => {
          track.addPitchBend({
            time:
              note.startTimeSeconds +
              (i * note.durationSeconds) / note.pitchBends!.length,
            value: bend,
          });
        });
      }
    });
    this.clearAll();
    let processedMidiFile = await this.midiFileService.processMidiObject(midi);
    let circles = this.midiFileService.getCircles(processedMidiFile);
    let arena = this.activeArenaSubject.getValue();
    arena.circleListWaiting = circles.filter(circle => circle.spawnTime > 0);
    arena.circleListAlive = circles.filter(circle => circle.spawnTime === 0);
    this.setArenaList(this.arenaListSubject.getValue(), arena.id);
    this.circleService.setCircleListWaiting(arena.circleListWaiting);
    this.circleService.setCircleListAlive(arena.circleListAlive);
  }
}
