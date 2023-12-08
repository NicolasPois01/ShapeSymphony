import {Component, NgModule, OnInit} from '@angular/core';
import {Arena} from "../models/arena";
import {ArenaService} from "../services/arena.service";

@Component({
  selector: 'app-arena-list',
  templateUrl: './arena-list.component.html',
  styleUrls: ['./arena-list.component.scss']
})
export class ArenaListComponent implements OnInit {
  arenaList!: Arena[];
  activeArena!: Arena;

  constructor(private arenaService: ArenaService) {}

  ngOnInit() {
    this.arenaService.arenaList$.subscribe(
      arenas => this.arenaList = arenas
    );
    this.arenaService.activeArena$.subscribe(
      arena => this.activeArena = arena
    )
  }

  clearActive() {
    this.arenaService.clearActiveArena();
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

  setArenaName(idArena: number, name: string) {
    this.arenaService.setArenaName(idArena, name);
  }
}
