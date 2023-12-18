// arena-option.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArenaOptionComponent } from './arena-option.component';
import { Circle, CircleOff, EyeOff, LucideAngularModule } from 'lucide-angular';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ArenaOptionComponent,
  ],
  imports: [
    CommonModule,
    LucideAngularModule.pick({Circle, CircleOff, EyeOff}),
    FormsModule,
  ],
  exports: [
    ArenaOptionComponent
  ],
})
export class ArenaOptionModule { }
