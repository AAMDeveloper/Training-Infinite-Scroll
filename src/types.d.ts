declare global {
  interface Array<T> {
    toSorted(compareFn?: (a: T, b: T) => number): T[]
  }
}

export interface User {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  origin: Location
  location: Location
  image: string
  episode: string[]
  url: string
  created: string
}

export interface Location {
  name: string
  url: string
}

export interface APIResults {
  info: PaginationInfo
  results: User[]
}

export interface PaginationInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export enum SortBy {
  NONE = 'none',
  NAME = 'name',
  SPECIES = 'species',
  STATUS = 'status',
}
