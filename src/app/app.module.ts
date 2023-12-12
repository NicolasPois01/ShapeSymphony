import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MainComponentComponent } from './main-component/main-component.component';
import { SquareComponent } from './square/square.component';
import { CircleComponent } from './square/circle/circle.component';
import { CircleListComponent } from './circle-list/circle-list.component';
import { NotesTabComponent } from './notes-tab/notes-tab.component';
import { InstrumentsTabComponent } from './instruments-tab/instruments-tab.component';
import { PercussionTabComponent } from './percussion-tab/percussion-tab.component';
import { CircleCharacteristicsComponent } from "./circle-characteristics/circle-characteristics.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ZeroPaddingPipe } from './zero-padding.pipe';
import { TimerComponent } from './timer/timer.component';
import { JsonExportComponent } from './export-json/export-json.component';
import { ImportJsonComponent } from './import-json/import-json.component';
import { AlterationComponent } from './alteration/alteration.component';
import { OctaveComponent } from './octave/octave.component';
import { FormsModule } from "@angular/forms";
import { MusicComponent} from './music-component/music-component.component';
import { ExportMp3Component } from './export-mp3/export-mp3.component';
import {ArenaListModule} from "./arena-list/arena-list.module";
import {VolumeModule} from "./volume/volume.module";
import { TimeInputComponent } from './time-input/time-input.component';

@NgModule({
  declarations: [
    MainComponentComponent,
    SquareComponent,
    CircleComponent,
    CircleListComponent,
    NotesTabComponent,
    InstrumentsTabComponent,
    PercussionTabComponent,
    CircleCharacteristicsComponent,
    ZeroPaddingPipe,
    TimerComponent,
    JsonExportComponent,
    ImportJsonComponent,
    AlterationComponent,
    OctaveComponent,
    MusicComponent,
    ExportMp3Component,
    TimeInputComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ArenaListModule,
    FormsModule,
    VolumeModule
  ],
  providers: [],
  bootstrap: [MainComponentComponent]
})
export class AppModule { }
