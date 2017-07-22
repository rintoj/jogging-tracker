import { Time } from './time'

export interface JogLog {
  id?: string
  date?: string
  distance?: number
  time?: Time
  averageSpeed?: number
}