export interface Circle {
  id: number,
  x: number,
  y: number,
  xSpeed: number,
  ySpeed: number,
  color: string,
  startX: number,
  startY: number,
  startXSpeed: number,
  startYSpeed: number,
  instrument: string,
  note: string,
  alteration: string,
  octave: number,
  volume: number,
  spawnTime: number,
  maxBounces: number,
  maxTime: number,
  nbBounces: number,
  showable: boolean,
  contactPoint: {x: number, y: number},
  isColliding: boolean,
  audio: HTMLAudioElement;
}
