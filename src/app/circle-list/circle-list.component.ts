import {Component, OnInit} from '@angular/core';
import {CircleService} from "../services/circle.service";
import {Circle} from "../models/circle";
import { Subscription } from 'rxjs';
import {ArenaService} from "../services/arena.service";
import {Arena} from "../models/arena";
import {SoundService} from "../services/sound.service";
import {forEach} from "lodash";

@Component({
  selector: 'app-circle-list',
  templateUrl: './circle-list.component.html',
  styleUrls: ['./circle-list.component.scss']
})
export class CircleListComponent implements OnInit  {
  circlesList!: Circle[];
  activeArena!: Arena;
  selectedCircle: Circle | null | undefined;
  circleNameList: [Circle, string, number][] = [];    //circleNameList[circle, name, occurrence];
  private arenaSubscription!: Subscription;
  private circlesListSubscription!: Subscription;

  constructor(private circlesService: CircleService,
              private arenaService: ArenaService) {}

  ngOnInit() {
    this.arenaSubscription = this.arenaService.activeArena$
      .subscribe(arena => {
        this.activeArena = arena;
        this.circlesList = arena.circleList
        this.circleListDisplay(this.circlesList)
      });  // S'abonner à circleList de l'activeArena$

      this.circlesListSubscription = this.circlesService.circleChanged$.subscribe(
        (updatedCircle: Circle) => {
          const index = this.circlesList.findIndex(
            (circle) => circle.id === updatedCircle.id
          );
          if (index !== -1) {
            this.circlesList[index] = updatedCircle;
          }
        }
      );

    this.circlesList = this.circlesService.circleList;

    this.circlesService.selectedCircle$.subscribe((circle: Circle | null) => {
      this.selectedCircle = circle;
    });
    this.circleListDisplay(this.circlesList);
  }

  ngOnDestroy() {
    if (this.circlesListSubscription) {
      this.circlesListSubscription.unsubscribe();  // Se désabonner lors de la destruction du composant
    }
    if (this.arenaSubscription) {
      this.arenaSubscription.unsubscribe();  // Se désabonner lors de la destruction du composant
    }
  }

  circleClicked(circle: Circle) {
    this.circlesService.setSelectedCircle(circle);
  }

  deleteCircle(circle: Circle): void {
    this.arenaService.deleteCircleFromActiveArena(circle);  // Mettre à jour pour utiliser la méthode de service
    this.circlesService.selectedCircle$.subscribe(selectedCircle => {
      if (selectedCircle && selectedCircle.id === circle.id) {
        this.circlesService.setSelectedCircle(null);
      }
    });
  }

  isSelected(circle: Circle) {
    return circle == this.selectedCircle;
  }

  circleListDisplay(circleList : Circle[]) {
    this.circleNameList = [];
    circleList.forEach(circle => {
      let name: string;
      let counter: number = 0;

      if (circle.instrument === "Percussion") {
        name = circle.instrument;}
      else {
        name = circle.instrument + circle.note + circle.alteration + circle.octave;
      }

      let index = this.circleNameList.length - 1;
      while (index >= 0) {
        const currentTuple = this.circleNameList[index];
        if (currentTuple[1] === name) {
          counter = currentTuple[2];
          break;
        }
        index--;
      }
      this.circleNameList.push([circle,name,counter + 1]);
    });
  }

  protected readonly CircleService = CircleService;
  protected readonly SoundService = SoundService;
}
