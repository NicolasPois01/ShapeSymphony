import {Circle} from "./circle";

export interface Arena {
  id: number,
  circleListWaiting: Circle[],
  circleListDead: Circle[],
  circleListAlive: Circle[],
  isMuted: boolean,
  name: string
}
