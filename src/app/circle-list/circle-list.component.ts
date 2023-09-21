import {Component, OnInit} from '@angular/core';
import {CircleService} from "../services/circle.service";
import {Circle} from "../models/circle";

@Component({
  selector: 'app-circle-list',
  templateUrl: './circle-list.component.html',
  styleUrls: ['./circle-list.component.scss']
})
export class CircleListComponent implements OnInit{
  circlesList!: Circle[];
  selectedCircle: Circle | null | undefined;

  constructor(private circlesService: CircleService) {
    this.circlesList = this.circlesService.circleList;
  }

  ngOnInit() {
    this.circlesService.selectedCircle$.subscribe((circle: Circle | null) => {
      this.selectedCircle = circle;
    });
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

  isSelected(circle: Circle) {
    return circle == this.selectedCircle;
  }
}
