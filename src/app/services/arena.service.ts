import { Injectable } from '@angular/core';
import {Arena} from "../models/arena";
import {BehaviorSubject, Observable} from "rxjs";
import {Circle} from "../models/circle";


@Injectable({
  providedIn: 'root'
})
export class ArenaService {

  private arenaListSubject = new BehaviorSubject<Arena[]>([
    {
      id: 0,
      circleList: []
    },
    {
      id: 1,
      circleList: []
    },
    {
      id: 2,
      circleList: []
    }
  ]);
  arenaList$: Observable<Arena[]> = this.arenaListSubject.asObservable();

  activeArenaSubject = new BehaviorSubject<Arena>({
    id: 0,
    circleList: []
  });
  activeArena$ = this.activeArenaSubject.asObservable();

  constructor() {}

  addArena(): number {
    const newArena: Arena = {
      id: this.arenaListSubject.getValue().length,
      circleList: []
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
}