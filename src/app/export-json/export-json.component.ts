import { Component, OnInit } from '@angular/core';
import { ArenaService } from "../services/arena.service";
import { Arena } from "../models/arena";

@Component({
  selector: 'app-json-export',
  templateUrl: './export-json.component.html',
  styleUrls: ['./export-json.component.scss']
})
export class JsonExportComponent implements OnInit {
  data: Arena[] = []; // les données à exporter
  filename: string = 'data.json'; // nom du fichier à exporter

  constructor(private arenaService: ArenaService) {
    this.arenaService.arenaList$.subscribe(arenaList => this.data = arenaList);
  }

  ngOnInit() {
  }

  exportToJSON(): void {
    let tempoArenaList = this.data;
    let arenaActiveId = 0;
    tempoArenaList.forEach(arena => {
      if (this.arenaService.activeArenaSubject.getValue().id === arena.id) {
        arenaActiveId = arena.id;
      }
      arena.circleListDead.forEach(circle => {
        if (circle.spawnTime > 0) {
          arena.circleListWaiting.push(circle);
        } else {
          arena.circleListAlive.push(circle);
        }
      });
      arena.circleListDead = [];
      arena.circleListAlive = arena.circleListAlive.filter(circle => {
        circle.x = circle.startX;
        circle.y = circle.startY;
        circle.xSpeed = circle.startXSpeed;
        circle.ySpeed = circle.startYSpeed;
        circle.nbBounces = 0;
        circle.showable = true;
        circle.isColliding = false;
        circle.contactPoint = { x: -1, y: -1 };
        if (circle.spawnTime > 0) {
          arena.circleListWaiting.push(circle);
          return false;
        }
        return true;
      });

      arena.circleListWaiting = arena.circleListWaiting.filter(circle => {
        circle.x = circle.startX;
        circle.y = circle.startY;
        circle.xSpeed = circle.startXSpeed;
        circle.ySpeed = circle.startYSpeed;
        circle.nbBounces = 0;
        circle.showable = true;
        circle.isColliding = false;
        circle.contactPoint = { x: -1, y: -1 };
        return true;
      });
    });
    const jsonData = JSON.stringify(tempoArenaList);
    const blob = new Blob([jsonData], { type: 'text/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = this.filename;
    a.click();
  }
}
