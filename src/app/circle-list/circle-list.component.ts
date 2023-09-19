import { Component } from '@angular/core';
import {CircleService} from "../services/circle.service";
import {Circle} from "../models/circle";

@Component({
  selector: 'app-circle-list',
  templateUrl: './circle-list.component.html',
  styleUrls: ['./circle-list.component.scss']
})
export class CircleListComponent {
  circlesList!: Circle[];

  constructor(private circlesService: CircleService) {
    this.circlesList = this.circlesService.circleList;
  }

  circleClicked(circle: Circle) {
    this.circlesService.setSelectedCircle(circle);
  }

  deleteCircle(circle: Circle): void {
    const index = this.circlesList.indexOf(circle);
    if (index > -1) {
      this.circlesList.splice(index, 1);
    }
  }

}
