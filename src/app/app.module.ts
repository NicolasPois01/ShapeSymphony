import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MainComponentComponent } from './main-component/main-component.component';
import { SquareComponent } from './square/square.component';
import { CircleComponent } from './square/circle/circle.component';
import { CircleListComponent } from './circle-list/circle-list.component';
import { NotesTabComponent } from './notes-tab/notes-tab.component';
import { InstrumentsTabComponent } from './instruments-tab/instruments-tab.component';

@NgModule({
  declarations: [
    MainComponentComponent,
    SquareComponent,
    CircleComponent,
    CircleListComponent,
    NotesTabComponent,
    InstrumentsTabComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [MainComponentComponent]
})
export class AppModule { }
