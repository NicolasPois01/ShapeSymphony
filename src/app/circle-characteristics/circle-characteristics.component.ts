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
  angleDepart: number | undefined;
  selectedColor: string = '';
  availableColors: string[] = this.circlesService.colors;

  constructor(private circlesService: CircleService) {}

  ngOnInit() {
    this.circlesService.selectedCircle$.subscribe((circle: Circle | null) => {
      this.selectedCircle = circle;
      if (circle) {
        this.selectedColor = circle.color;
        this.angleDepart = Math.atan2(-circle.ySpeed, circle.xSpeed);
        if (this.angleDepart < 0) {
          this.angleDepart += 2 * Math.PI;
        }
        this.angleDepart = (this.angleDepart * 180) / Math.PI;
      }
    });
  }

  setColor(color: string | undefined) {
    if (this.selectedCircle) {
      if (color != null) {
        this.selectedCircle.color = color;
      }
      this.circlesService.setColor(color);
    }
  }

}
