import {Component, OnInit} from '@angular/core';
import {CircleService} from "../services/circle.service";
import {Circle} from "../models/circle";

@Component({
  selector: 'app-circle-characteristics-list',
  templateUrl: './circle-characteristics.component.html',
  styleUrls: ['./circle-characteristics.component.scss']
})
export class CircleCharacteristicsComponent implements OnInit{
  selectedCircle: Circle | null | undefined;

  constructor(private circlesService: CircleService) {}

  ngOnInit() {
    this.circlesService.selectedCircle$.subscribe((circle: Circle | null) => {
      this.selectedCircle = circle;
    });
  }

}
