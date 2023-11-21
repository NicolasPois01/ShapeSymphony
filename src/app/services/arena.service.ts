import { Injectable } from '@angular/core';
import {Arena} from "../models/arena";
import {BehaviorSubject, Observable} from "rxjs";


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
}
