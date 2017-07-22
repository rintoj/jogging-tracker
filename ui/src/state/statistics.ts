import { Time } from './time'

export interface StatisticsEntry {
  type?: string
  slowest?: number
  fastest?: number
  shortestDistance?: number
  longestDistance?: number
  distance?: number
  time?: Time
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