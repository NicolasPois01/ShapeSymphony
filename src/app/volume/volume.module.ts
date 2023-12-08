// arena-list.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VolumeComponent} from "./volume.component";
import { LucideAngularModule,VolumeX, Volume, Volume1, Volume2} from 'lucide-angular';
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        VolumeComponent,
    ],
    imports: [
        CommonModule,
        LucideAngularModule.pick({VolumeX,Volume, Volume1, Volume2}),
        FormsModule,
    ],
    exports: [
        VolumeComponent
    ],
})
export class VolumeModule { }
