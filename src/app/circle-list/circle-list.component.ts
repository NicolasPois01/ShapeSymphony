import { Component, OnInit } from '@angular/core';
import { CircleService } from "../services/circle.service";
import { Circle } from "../models/circle";
import { Subscription } from 'rxjs';
import { ArenaService } from "../services/arena.service";
import { Arena } from "../models/arena";
import { SoundService } from "../services/sound.service";
import { TimerService } from '../services/timer.service';

@Component({
  selector: 'app-circle-list',
  templateUrl: './circle-list.component.html',
  styleUrls: ['./circle-list.component.scss']
})
export class CircleListComponent implements OnInit {
  circleListWaiting!: Circle[];
  circleListAlive!: Circle[];
  circleListDead!: Circle[];
  activeArena!: Arena;
  selectedCircle: Circle | null | undefined;
  circleNameList: [Circle, string, number, string][] = [];    //circleNameList[circle, name, occurrence, list];
  private arenaSubscription!: Subscription;
  private circlesListSubscription!: Subscription;
  private timerSubscription!: Subscription;


  constructor(private circlesService: CircleService,
    private arenaService: ArenaService,
    private timerService: TimerService) { }

  ngOnInit() {
    this.arenaSubscription = this.arenaService.activeArena$
      .subscribe(arena => {
        if (!this.timerService.isRunning) {
          this.activeArena = arena;
          this.circleListAlive = arena.circleListAlive;
          this.circleListWaiting = arena.circleListWaiting;
          this.circleListDead = arena.circleListDead;
          this.circleListDisplay();
        } else {
          this.activeArena = arena;
          this.circleListAlive = [];
          this.circleListWaiting = [];
          this.circleListDead = [];
          this.circleListDisplay();
        }
      });  // S'abonner à circleList de l'activeArena$

    this.timerSubscription = this.timerService.isRunning$.subscribe(isRunning => {
      if (!isRunning) {
        this.circleListAlive = this.activeArena.circleListAlive;
        this.circleListWaiting = this.activeArena.circleListWaiting;
        this.circleListDead = this.activeArena.circleListDead;
        this.circleListDisplay();
      } else {
        this.circleListAlive = [];
        this.circleListWaiting = [];
        this.circleListDead = [];
        this.circleListDisplay();
      }
    });

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

    this.circleListWaiting = this.circlesService.circleListWaitingSubject.getValue();
    this.circleListAlive = this.circlesService.circleListAliveSubject.getValue();
    this.circleListDead = this.circlesService.circleListDeadSubject.getValue();

    this.circlesService.selectedCircle$.subscribe((circle: Circle | null) => {
      this.selectedCircle = circle;
    });
    this.circleListDisplay();
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

  circleListDisplay() {
    this.circleNameList = [];
    this.circleListAlive.forEach(circle => {
      let tuple = this.getCircleNameList(circle, "Alive");
      this.circleNameList.push(tuple);
    });
    this.circleListWaiting.forEach(circle => {
      let tuple = this.getCircleNameList(circle, "Waiting");
      this.circleNameList.push(tuple);
    });
    this.circleListDead.forEach(circle => {
      let tuple = this.getCircleNameList(circle, "Dead");
      this.circleNameList.push(tuple);
    });
  }

  getCircleNameList(circle: Circle, list: string): [Circle, string, number, string] {
    let name: string;
    let counter: number = 0;
    let alteration: string = '';

    switch (circle.alteration) {
      case "b":
        alteration = '♭';
        break;
      case "d":
        alteration = '♯';
        break;
      default:
        alteration = '';
        break;
    }

    if (circle.instrument === "Percussion") {
      name = circle.instrument;
    } else {
      name = circle.instrument + circle.note + alteration + circle.octave;
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
    return [circle, name, counter + 1, list];
  }

  circleNameListWaiting() {
    return this.circleNameList.filter(tuple => tuple[3] === "Waiting");
  }

  circleNameListAlive() {
    return this.circleNameList.filter(tuple => tuple[3] === "Alive");
  }

  circleNameListDead() {
    return this.circleNameList.filter(tuple => tuple[3] === "Dead");
  }

  protected readonly CircleService = CircleService;
  protected readonly SoundService = SoundService;
}
