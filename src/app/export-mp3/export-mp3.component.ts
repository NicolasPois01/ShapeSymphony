import { Component } from '@angular/core';
import {ExportMp3Service} from "../services/exportmp3.service";

@Component({
  selector: 'app-export-mp3',
  templateUrl: './export-mp3.component.html',
  styleUrls: ['./export-mp3.component.scss']
})
export class ExportMp3Component {

  constructor(private exportMp3Service: ExportMp3Service) { }

  ngOnInit(): void {
  }

  exportToMP3() {

    const jsonData = this.exportMp3Service.exportCollisionDataAsJson();
    this.downloadJson(jsonData, 'collision-data.json');
  }

  private downloadJson(jsonObject: string, fileName: string) {
    const blob = new Blob([jsonObject], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }
}
