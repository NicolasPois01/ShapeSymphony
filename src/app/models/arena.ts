import {Circle} from "./circle";

export interface Arena {
  id: number,
  circleList: Circle[],
  isMuted: boolean
}
