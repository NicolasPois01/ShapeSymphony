import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AnimationService {
  isAnimationRunningSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAnimationRunning$: Observable<boolean> = this.isAnimationRunningSubject.asObservable();

  pauseAnimation() {
    this.isAnimationRunningSubject.next(false);
  }

  startAnimation() {
    this.isAnimationRunningSubject.next(true);
  }
}
