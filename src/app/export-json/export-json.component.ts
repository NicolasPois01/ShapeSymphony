import {Component, OnInit} from '@angular/core';
import {ArenaService} from "../services/arena.service";

@Component({
  selector: 'app-json-export',
  templateUrl: './export-json.component.html',
  styleUrls: ['./export-json.component.scss']
})
export class JsonExportComponent implements OnInit {
  data: any; // les données à exporter
  filename: string = 'data.json'; // nom du fichier à exporter

  constructor(private arenaService: ArenaService) {
    this.arenaService.arenaList$.subscribe(arenaList => this.data = arenaList);
  }

  ngOnInit() {
  }

  exportToJSON(): void {
    const jsonData = JSON.stringify(this.data);
    const blob = new Blob([jsonData], { type: 'text/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = this.filename;
    a.click();
  }
}
