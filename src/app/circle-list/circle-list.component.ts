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
}
