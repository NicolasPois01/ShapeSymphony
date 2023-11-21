export interface Circle {
  id: number,
  x: number,
  y: number,
  xSpeed: number,
  ySpeed: number,
  xSpeedStart: number,
  ySpeedStart: number,
  color: string,
  startX: number,
  startY: number,
  instrument: string,
  note: string,
  alteration: string,
  octave: number,
  spawnTime: number,
  maxBounces: number,
  maxTime: number
  isColliding: boolean;
  contactPoint: {
    x: number;
    y: number;
  } | null; // Ajoutez | null si vous voulez qu'il puisse être nul
}
