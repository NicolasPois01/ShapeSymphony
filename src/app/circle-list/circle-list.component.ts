import {Component, OnInit} from '@angular/core';
import {CircleService} from "../services/circle.service";
import {Circle} from "../models/circle";
import { Subscription } from 'rxjs';
import {ArenaService} from "../services/arena.service";
import {Arena} from "../models/arena";

@Component({
  selector: 'app-circle-list',
  templateUrl: './circle-list.component.html',
  styleUrls: ['./circle-list.component.scss']
})
export class CircleListComponent implements OnInit  {  // Ajouter OnDestroy
  circlesList!: Circle[];
  activeArena!: Arena;
  selectedCircle: Circle | null | undefined;
  private circlesListSubscription!: Subscription;  // Ajouter cette ligne

  constructor(private circlesService: CircleService,
              private arenaService: ArenaService) {}

  ngOnInit() {
    this.circlesListSubscription = this.arenaService.activeArena$
      .subscribe(arena => {
        this.activeArena = arena;
        this.circlesList = arena.circleList
      });  // S'abonner à circleList de l'activeArena$

    this.circlesService.selectedCircle$
      .subscribe(circle => this.selectedCircle = circle);
  }

  ngOnDestroy() {
    if (this.circlesListSubscription) {
      this.circlesListSubscription.unsubscribe();  // Se désabonner lors de la destruction du composant
    }
    this.circlesList = this.circlesService.circleList;

    this.circlesService.selectedCircle$.subscribe((circle: Circle | null) => {
      this.selectedCircle = circle;
    });

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
  }

  circleClicked(circle: Circle) {
    this.circlesService.setSelectedCircle(circle);
  }

  deleteCircle(circle: Circle): void {
    this.arenaService.deleteCircleFromActiveArena(circle);  // Mettre à jour pour utiliser la méthode de service
  }

  isSelected(circle: Circle) {
    return circle == this.selectedCircle;
  }

}
