import { Time } from './time'

export interface StatisticEntry {
  type?: string
  value?: number
  slowest?: number
  fastest?: number
  shortestDistance?: number
  longestDistance?: number
  distance?: number
  time?: Time
}

export interface Statistics {
  overall?: StatisticEntry[]
  yearly?: StatisticEntry[]
  monthly?: StatisticEntry[]
  weekly?: StatisticEntry[]
}