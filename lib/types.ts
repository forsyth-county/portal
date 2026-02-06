export interface Game {
  id: string
  name: string
  category: string
  iconUrl: string
  iframeSrc: string
  inappropriate?: boolean
}

export interface Utility {
  id: string
  name: string
  description: string
  iconUrl: string
  iframeSrc: string
  disabled?: boolean
  disabledReason?: string
}

export type Category = 
  | 'ACTION'
  | 'ADVENTURE'
  | 'PUZZLE'
  | 'SPORTS'
  | 'RACING'
  | 'STRATEGY'
  | 'PLATFORMER'
  | 'IO'
  | 'CLASSIC'
  | 'OTHER'
