import { Time } from './time'

export interface StatisticsEntry {
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
  overall?: StatisticsEntry[]
  yearly?: StatisticsEntry[]
  monthly?: StatisticsEntry[]
  weekly?: StatisticsEntry[]
}