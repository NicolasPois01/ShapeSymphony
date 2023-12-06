import { Injectable } from '@angular/core';
import {Arena} from "../models/arena";
import {BehaviorSubject, Observable} from "rxjs";
import {Circle} from "../models/circle";
import {CircleService} from "./circle.service";
import cloneDeep from "lodash/cloneDeep";


@Injectable({
  providedIn: 'root'
})
export class ArenaService {

  private arenaListSubject = new BehaviorSubject<Arena[]>([
    {
      id: 0,
      circleList: [],
      isMuted: false
    }
  ]);
  arenaList$: Observable<Arena[]> = this.arenaListSubject.asObservable();

  activeArenaSubject = new BehaviorSubject<Arena>({
    id: 0,
    circleList: [],
    isMuted: false
  });
  activeArena$ = this.activeArenaSubject.asObservable();

  tempoArenaList!: Arena [];

  constructor(private circleService: CircleService) {
    this.circleService.newCircleSubject.subscribe(circle => {
      this.addCircleToActiveArena(circle);
      this.circleService.setSelectedCircle(circle);
    })
  }

  addArena(): number {
    const newArena: Arena = {
      id: this.arenaListSubject.getValue().length,
      circleList: [],
      isMuted: false
    };

    const updatedArenas = [...this.arenaListSubject.getValue(), newArena];
    this.arenaListSubject.next(updatedArenas);

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

  unmuteArena (idArena: number) {
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

  addCircleToActiveArena(circle: Circle) {
    const activeArena = this.activeArenaSubject.getValue();
    const updatedCircleList = [...activeArena.circleList, circle];
    const updatedArena = { ...activeArena, circleList: updatedCircleList };
    this.activeArenaSubject.next(updatedArena);

    // Update the arena list as well
    const arenas = this.arenaListSubject.getValue();
    const arenaIndex = arenas.findIndex(a => a.id === activeArena.id);
    arenas[arenaIndex] = updatedArena;
    this.arenaListSubject.next(arenas);
  }

  deleteCircleFromActiveArena(circle: Circle) {
    // Get the current active arena
    const activeArena = this.activeArenaSubject.getValue();

    // Filter out the circle to be deleted from the circleList
    const updatedCircleList = activeArena.circleList.filter(c => c.id !== circle.id);

    // Create an updated arena without the deleted circle
    const updatedArena = { ...activeArena, circleList: updatedCircleList };

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

  updateArenas(elapsedTime: number, squareUnit: number, offSet: number) {
    const arenas = this.arenaListSubject.getValue();

    arenas.forEach(arena => {
      arena.circleList.forEach(circle => {
        if(circle.showable) {
          this.circleService.calculatePos(elapsedTime, circle, squareUnit, offSet, arena.isMuted);
        }
      });
    });

    this.arenaListSubject.next(arenas);
  }

  clearAll() {
    const currentArenas = this.arenaListSubject.getValue();

    currentArenas[0].circleList = [];

    const updatedArenas = [currentArenas[0]];

    this.arenaListSubject.next(updatedArenas);
    this.tempoArenaList = updatedArenas;
    this.activeArenaSubject.next(updatedArenas[0]);
  }

  clearActiveArena() {
    const activeArena = this.activeArenaSubject.getValue();
    // Empty the circle list of the active arena
    activeArena.circleList = [];
    // Update the active arena subject with the modified active arena
    this.activeArenaSubject.next(activeArena);
    // Update the arena list as well
    const arenas = this.arenaListSubject.getValue();
    const arenaIndex = arenas.findIndex(a => a.id === activeArena.id);

    if (arenaIndex !== -1) {
      // Update the arena in the list with the modified active arena
      arenas[arenaIndex] = activeArena;
      // Update the arena list subject with the updated list of arenas
      this.arenaListSubject.next([...arenas]);
    }
  }

  saveArenas() {
    this.tempoArenaList = cloneDeep(this.arenaListSubject.getValue());
  }

  restoreArenas() {
    this.saveArenas();
    this.tempoArenaList.forEach(arena => {
      arena.circleList.forEach(circle => {
        circle.x = circle.startX;
        circle.y = circle.startY;
        circle.xSpeed = circle.startXSpeed;
        circle.ySpeed = circle.startYSpeed;
        circle.nbBounces = 0;
        circle.showable = true;
        circle.isColliding = false;
        circle.contactPoint = {x: -1, y: -1};
      });
    });
    this.setArenaList(this.tempoArenaList);
  }

  setArenaList(arenaList: Arena[]) {
    this.arenaListSubject.next(arenaList);
    this.activeArenaSubject.next(arenaList[0]);
  }
}
