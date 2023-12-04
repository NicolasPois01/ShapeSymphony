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
export class CircleListComponent implements OnInit  {
  circleListWaiting!: Circle[];
  circleListAlive!: Circle[];
  circleListDead!: Circle[];
  activeArena!: Arena;
  selectedCircle: Circle | null | undefined;
  private arenaSubscription!: Subscription;
  private circlesListSubscription!: Subscription;

  constructor(private circlesService: CircleService,
              private arenaService: ArenaService) {}

  ngOnInit() {
    this.arenaSubscription = this.arenaService.activeArena$
      .subscribe(arena => {
        this.activeArena = arena;
        this.circleListAlive = arena.circleListAlive
      });  // S'abonner à circleListAlive de l'activeArena$

      this.circlesListSubscription = this.circlesService.circleChanged$.subscribe(
        (updatedCircle: Circle) => {
          let index = this.circleListAlive.findIndex(
            (circle) => circle.id === updatedCircle.id
          );
          if (index !== -1) {
            this.circleListAlive[index] = updatedCircle;
          } else {
            index = this.circleListWaiting.findIndex(
              (circle) => circle.id === updatedCircle.id
            );
            if (index !== -1) {
              this.circleListWaiting[index] = updatedCircle;
            } else {
              index = this.circleListDead.findIndex(
                (circle) => circle.id === updatedCircle.id
              );
              if (index !== -1) {
                this.circleListDead[index] = updatedCircle;
              }
            }
          }
        }
      );
      this.circlesService.circleDeleted$.subscribe(
        (deletedCircle: Circle) => {
          let index = this.circleListAlive.findIndex(
            (circle) => circle.id === deletedCircle.id
          );
          if (index !== -1) {
            this.circleListAlive.splice(index, 1);
          } else {
            index = this.circleListWaiting.findIndex(
              (circle) => circle.id === deletedCircle.id
            );
            if (index !== -1) {
              this.circleListWaiting.splice(index, 1);
            } else {
              index = this.circleListDead.findIndex(
                (circle) => circle.id === deletedCircle.id
              );
              if (index !== -1) {
                this.circleListDead.splice(index, 1);
              }
            }
          }
        }
      );

      this.circlesService.circleMovedToWaiting$.subscribe(
        (circle: Circle) => {
          let index = this.circleListDead.findIndex(
            (circle) => circle.id === circle.id
          );
          if (index !== -1) {
            this.circleListDead.splice(index, 1);
          }
          this.circleListWaiting.push(circle);
        }
      );

      this.circlesService.circleMovedToDead$.subscribe(
        (circle: Circle) => {
          let index = this.circleListAlive.findIndex(
            (circle) => circle.id === circle.id
          );
          if (index !== -1) {
            this.circleListAlive.splice(index, 1);
          }
          this.circleListDead.push(circle);
        }
      );

    this.circleListWaiting = this.circlesService.circleListWaitingSubject.getValue();
    this.circleListAlive = this.circlesService.circleListAliveSubject.getValue();
    this.circleListDead = this.circlesService.circleListDeadSubject.getValue();

    this.circlesService.selectedCircle$.subscribe((circle: Circle | null) => {
      this.selectedCircle = circle;
    });
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
  }

  isSelected(circle: Circle) {
    return circle == this.selectedCircle;
  }

}
