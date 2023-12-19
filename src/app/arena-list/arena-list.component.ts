import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Arena} from "../models/arena";
import {ArenaService} from "../services/arena.service";
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-arena-list',
  templateUrl: './arena-list.component.html',
  styleUrls: ['./arena-list.component.scss']
})
export class ArenaListComponent implements OnInit {
  arenaList!: Arena[];
  activeArena!: Arena;
  isProcessModalVisible: boolean = false;

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  constructor(private arenaService: ArenaService) {
  }

  ngOnInit() {
    this.arenaService.arenaList$.subscribe(
      arenas => this.arenaList = arenas
    );
    this.arenaService.activeArena$.subscribe(
      arena => this.activeArena = arena
    );
  }

  clearActive(id: number) {
    this.arenaService.clearArenaById(id);
  }

  addArena() {
    let newArenaId = this.arenaService.addArena();
    this.setActiveArena(newArenaId);
  }

  uploadMidiFile() {
    this.fileInput?.nativeElement.addEventListener('change', async (event: any) => {
      const file = event.target.files[0];
      this.showProcessModal();
      await this.arenaService.uploadMidiFile(file);
      this.hideProcessModal();
    });
    this.fileInput?.nativeElement.click();
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

  showProcessModal() {
    this.isProcessModalVisible = true;
  }

  hideProcessModal() {
    this.isProcessModalVisible = false;
  }
}
