import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-json-export',
  templateUrl: './export-json.component.html',
  styleUrls: ['./export-json.component.scss']
})
export class JsonExportComponent {
  @Input() data: any; // les données à exporter
  @Input() filename: string = 'data.json'; // nom du fichier à exporter

  exportToJSON(): void {
    const jsonData = JSON.stringify(this.data);
    const blob = new Blob([jsonData], { type: 'text/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = this.filename;
    a.click();
  }
}
