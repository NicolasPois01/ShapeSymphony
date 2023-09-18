import {Component, Input} from '@angular/core';
import {Circle} from "../../models/circle";

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss']
})
export class CircleComponent {
  @Input() circle?: Circle;

  
}
