import {Injectable, OnInit} from '@angular/core';
import {Circle} from "../models/circle";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CircleService {

  circleList: Circle[] = [];
  colors = ["red", "green", "blue", "yellow", "pink", "orange", "purple", "cyan", "magenta", "brown"];
  selectedCircle: Circle | null;
  constructor() {
    this.selectedCircle = null;
  }

  updatePos(id: number, x: number, y: number) {
    const circleIndex = this.circleList.findIndex(circle => circle.id === id);

    if (circleIndex !== -1) {
      this.circleList[circleIndex].x = x;
      this.circleList[circleIndex].y = y;
    }
  }

  bounceX(id: number) {
    const circleIndex = this.circleList.findIndex(circle => circle.id === id);

    if (circleIndex !== -1) {
      this.circleList[circleIndex].xSpeed = -this.circleList[circleIndex].xSpeed;
    }
  }

  bounceY(id: number) {
    const circleIndex = this.circleList.findIndex(circle => circle.id === id);

    if (circleIndex !== -1) {
      this.circleList[circleIndex].ySpeed = -this.circleList[circleIndex].ySpeed;
    }
  }

  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  getRandomSpeed(): number {
    // Assuming speed range is between -2 and 2.
    return Math.random() * 4 - 2;
  }

  addCircle(x: number, y: number) {
    const circle: Circle = {
      id: this.circleList.length, // Assuming unique ids based on list length
      x: x,
      y: y,
      xSpeed: this.getRandomSpeed(),
      ySpeed: this.getRandomSpeed(),
      color: this.getRandomColor()
    };

    this.circleList.push(circle);
  }

  private selectedCircleSubject = new BehaviorSubject<Circle | null>(null);
  selectedCircle$ = this.selectedCircleSubject.asObservable();

  setSelectedCircle(circle: Circle) {
    this.selectedCircleSubject.next(circle);
  }
}
