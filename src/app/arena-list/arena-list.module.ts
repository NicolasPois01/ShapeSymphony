// arena-list.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArenaListComponent } from './arena-list.component';
import { LucideAngularModule, Plus, Trash2, VolumeX, Volume2, EyeOff, Eye, Eraser } from 'lucide-angular';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ArenaListComponent,
  ],
  imports: [
    CommonModule,
    LucideAngularModule.pick({Plus, Trash2, VolumeX, Volume2, EyeOff, Eye, Eraser}),
    FormsModule,
  ],
  exports: [
    ArenaListComponent
  ],
})
export class ArenaListModule { }
