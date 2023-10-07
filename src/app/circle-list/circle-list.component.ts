import {Component, OnInit, OnDestroy} from '@angular/core';
import {CircleService} from "../services/circle.service";
import {Circle} from "../models/circle";
import { Subscription } from 'rxjs';  // Import Subscription

@Component({
  selector: 'app-circle-list',
  templateUrl: './circle-list.component.html',
  styleUrls: ['./circle-list.component.scss']
})
export class CircleListComponent implements OnInit, OnDestroy {  // Ajouter OnDestroy
  circlesList!: Circle[];
  selectedCircle: Circle | null | undefined;
  private circlesListSubscription!: Subscription;  // Ajouter cette ligne

  constructor(private circlesService: CircleService) {}

  ngOnInit() {
    this.circlesListSubscription = this.circlesService.circleList$
      .subscribe(circles => this.circlesList = circles);  // S'abonner à circleList$

    this.circlesService.selectedCircle$
      .subscribe(circle => this.selectedCircle = circle);
  }

  ngOnDestroy() {
    if (this.circlesListSubscription) {
      this.circlesListSubscription.unsubscribe();  // Se désabonner lors de la destruction du composant
    }
  }

  circleClicked(circle: Circle) {
    this.circlesService.setSelectedCircle(circle);
  }

  deleteCircle(circle: Circle): void {
    this.circlesService.deleteCircle(circle);  // Mettre à jour pour utiliser la méthode de service
  }

  isSelected(circle: Circle) {
    return circle == this.selectedCircle;
  }
}
