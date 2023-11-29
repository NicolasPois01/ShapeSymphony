

export class Circle {
  public id: number;
  public x: number;
  public y: number;
  public xSpeed: number;
  public ySpeed: number;
  public color: string;
  public startX: number;
  public startY: number;
  public instrument: string;
  public note: string;
  public alteration: string;
  public octave: number;
  public spawnTime: number | null;
  public maxBounces: number | null;
  public maxTime: number | null;
  public isColliding: boolean = false;
  public contactPoint: { x: number; y: number } | null = null;


  constructor(
    id: number,
    startX: number,
    startY: number,
    xSpeed: number,
    ySpeed: number,
    color: string,
    instrument: string,
    note: string,
    alteration: string,
    octave: number,
    spawnTime: number | null = null,
    maxBounces: number | null = null,
    maxTime: number | null = null
  ) {
    this.id = id;
    this.color = color;
    this.x = startX;
    this.y = startY;
    this.startX = startX;
    this.startY = startY;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.instrument = instrument;
    this.note = note;
    this.alteration = alteration;
    this.octave = octave;
    this.spawnTime = spawnTime;
    this.maxBounces = maxBounces;
    this.maxTime = maxTime;
  }
}
