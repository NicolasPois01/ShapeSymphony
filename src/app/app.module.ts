import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MainComponentComponent } from './main-component/main-component.component';
import { SquareComponent } from './square/square.component';
import { CircleComponent } from './square/circle/circle.component';
import { CircleListComponent } from './circle-list/circle-list.component';
import { NotesTabComponent } from './notes-tab/notes-tab.component';
import { InstrumentsTabComponent } from './instruments-tab/instruments-tab.component';
import { CircleCharacteristicsComponent } from "./circle-characteristics/circle-characteristics.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ZeroPaddingPipe } from './zero-padding.pipe';
import { TimerComponent } from './timer/timer.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    MainComponentComponent,
    SquareComponent,
    CircleComponent,
    CircleListComponent,
    NotesTabComponent,
    InstrumentsTabComponent,
    CircleCharacteristicsComponent,
    ZeroPaddingPipe,
    TimerComponent
  ],
    imports: [
        BrowserModule,
        NgbModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [MainComponentComponent]
})
export class AppModule { }
