import { Injectable } from '@angular/core';
import {Arena} from "../models/arena";
import {BehaviorSubject, Observable} from "rxjs";
import {Circle} from "../models/circle";
import {CircleService} from "./circle.service";


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
      isMuted: false
    }
  ]);
  arenaList$: Observable<Arena[]> = this.arenaListSubject.asObservable();

  activeArenaSubject = new BehaviorSubject<Arena>({
    id: 0,
    circleListWaiting: [],
    circleListDead: [],
    circleListAlive: [],
    isMuted: false
  });
  activeArena$ = this.activeArenaSubject.asObservable();

  constructor(private circleService: CircleService) {

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

  }

  addArena(): number {
    const newArena: Arena = {
      id: this.arenaListSubject.getValue().length,
      circleListWaiting: [],
      circleListDead: [],
      circleListAlive: [],
      isMuted: false
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
      if(index !== -1) {
        arena.circleListAlive.splice(index, 1);
        arena.circleListDead.push(circle);
        arenas[arenaIndex] = arena;
        this.arenaListSubject.next([...arenas]);
        if(arena.id === this.activeArenaSubject.getValue().id) {
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
      if(index !== -1) {
        arena.circleListAlive.splice(index, 1);
        arena.circleListWaiting.push(circle);
        arenas[arenaIndex] = arena;
        this.arenaListSubject.next(arenas);
        if(arena.id === this.activeArenaSubject.getValue().id) {
          this.activeArenaSubject.next(arena);
        }
        return;
      }
    });
  }

  updateArenas(elapsedTime: number, squareUnit: number, offSet: number) {
    const arenas = this.arenaListSubject.getValue();
    arenas.forEach(arena => {
      arena.circleListAlive.forEach(circle => {
        this.circleService.calculatePos(elapsedTime, circle, squareUnit, offSet, arena.isMuted);
      });
    });

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

  clearActiveArena() {
    const activeArena = this.activeArenaSubject.getValue();
    // Empty the circle list of the active arena
    activeArena.circleListAlive = [];
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

  restoreArenas() {
    let tempoArenaList = this.arenaListSubject.getValue();
    let arenaActiveId = 0;
    tempoArenaList.forEach(arena => {
      if(this.activeArenaSubject.getValue().id === arena.id) {
        arenaActiveId = arena.id;
      }
      arena.circleListDead.forEach(circle => {
        arena.circleListAlive.push(circle);
      });
      arena.circleListDead = [];
      arena.circleListAlive.forEach(circle => {
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
    this.setArenaList(tempoArenaList, arenaActiveId);
  }

  setArenaList(arenaList: Arena[], arenaActiveId: number) {
    this.arenaListSubject.next(arenaList);
    this.activeArenaSubject.next(arenaList[arenaActiveId]);
  }
}
