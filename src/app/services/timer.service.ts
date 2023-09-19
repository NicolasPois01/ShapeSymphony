import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private startSubject = new Subject<void>();
  private pauseSubject = new Subject<void>();

  start$ = this.startSubject.asObservable();
  pause$ = this.pauseSubject.asObservable();

  start(): void {
    this.startSubject.next();
  }

  pause(): void {
    this.pauseSubject.next();
  }
}
