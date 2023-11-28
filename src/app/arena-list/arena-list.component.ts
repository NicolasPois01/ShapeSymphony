import {Component, OnInit} from '@angular/core';
import {Arena} from "../models/arena";
import {ArenaService} from "../services/arena.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-arena-list',
  templateUrl: './arena-list.component.html',
  styleUrls: ['./arena-list.component.scss']
})
export class ArenaListComponent implements OnInit{
  arenaList!: Arena[];
  arenaListSubscription!: Subscription;

  activeArena!: Arena;

  constructor(private arenaService: ArenaService) {}

  ngOnInit() {
    this.arenaListSubscription = this.arenaService.arenaList$.subscribe(
      arenas => this.arenaList = arenas
    );
    this.arenaService.activeArena$.subscribe(
      arena => this.activeArena = arena
    )
  }

  addArena() {
    let newArenaId = this.arenaService.addArena();
    this.setActiveArena(newArenaId);
  }

  deleteArena(idArena: number) {
    this.arenaService.deleteArena(idArena);
  }

  setActiveArena(idArena: number) {
    this.arenaService.setActiveArena(idArena);
  }

  isActiveArena(idArena: number): boolean {
    return this.arenaService.isActiveArena(idArena);
  }

  muteArena(idArena: number) {
    this.arenaService.muteArena(idArena);
  }

  unmuteArena (idArena: number) {
    this.arenaService.unmuteArena(idArena);
  }
}
