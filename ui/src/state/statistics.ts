import { Time } from './time'

export interface StatisticsEntry {
  type?: string
  slowestSpeed?: number
  fastestSpeed?: number
  averageSpeed?: number
  shortestDistance?: number
  longestDistance?: number
  averageDistance?: number
  distance?: number
  time?: Time
  averageTime?: Time
}

export interface YearlyStatisticsEntry extends StatisticsEntry {
  year?: number
}

export interface MonthlyStatisticsEntry extends YearlyStatisticsEntry {
  month?: number
}

export interface WeeklyStatisticsEntry extends MonthlyStatisticsEntry {
  week?: number
}

export interface Statistics {
  overall?: StatisticsEntry[]
  yearly?: YearlyStatisticsEntry[]
  monthly?: MonthlyStatisticsEntry[]
  weekly?: WeeklyStatisticsEntry[]
}