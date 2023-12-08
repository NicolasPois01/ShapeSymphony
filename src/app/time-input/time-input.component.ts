import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'time-input',
    templateUrl: './time-input.component.html',
    styleUrls: ['./time-input.component.scss']
})
export class TimeInputComponent {
    public minutes: number = 0;
    public secondes: number = 0;
    public millisecondes: number = 0;

    @Output() public onValueChange: EventEmitter<any> = new EventEmitter();

    public onUpClick(): void {
        this.minutes++;
    }

    public onDownClick(): void {
        this.minutes--;
    }

    public onMinutesChange(event: any): void {
        this.minutes = Number(event.target.value);
        if(this.minutes < 0) this.minutes = 0;
        else if(this.minutes < 10) event.target.value = "0" + this.minutes.toString();
        else if(this.minutes <= 59) event.target.value = this.minutes;
        else if(this.minutes > 59) {
            this.minutes = 59;
            event.target.value = this.minutes;
        }
        this.onValueChange.emit([this.getValue()]);
    }

    public onSecondesChange(event: any): void {
        this.secondes = Number(event.target.value);
        if(this.secondes < 0) this.secondes = 0;
        else if(this.secondes < 10) event.target.value = "0" + this.secondes.toString();
        else if(this.secondes <= 59) event.target.value = this.secondes;
        else if(this.secondes > 59) {
            this.secondes = 59;
            event.target.value = this.secondes;
        }
        this.onValueChange.emit([this.getValue()]);
    }

    public onMillisecondesChange(event: any): void {
        this.millisecondes = Number(event.target.value);
        if(this.millisecondes < 0) this.millisecondes = 0;
        else if(this.millisecondes < 10) event.target.value = "0" + this.millisecondes.toString();
        else if(this.millisecondes <= 999) event.target.value = this.millisecondes;
        else if(this.millisecondes > 999) {
            this.millisecondes = 999;
            event.target.value = this.millisecondes;
        }
        this.onValueChange.emit([this.getValue()]);
    }

    public getValueStringify(): string {
        return this.minutes + ":" + this.secondes + "." + this.millisecondes;
    }

    public getValue(): object {
        return {
            minutes: this.minutes,
            secondes: this.secondes,
            millisecondes: this.millisecondes
        }
    }
}