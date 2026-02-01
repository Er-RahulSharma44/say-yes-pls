// Utility functions to encode/decode game data for clean URLs

export interface GameData {
  name: string
  question: string
  theme: string
  yesText: string
  noText: string
}

export function encodeGameData(data: GameData): string {
  try {
    const json = JSON.stringify(data)
    // Use base64 encoding for cleaner URLs
    return btoa(encodeURIComponent(json))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '') // Remove padding
  } catch (error) {
    console.error('Error encoding data:', error)
    return ''
  }
}

export function decodeGameData(encoded: string): GameData | null {
  try {
    // Add padding back if needed
    let padded = encoded.replace(/-/g, '+').replace(/_/g, '/')
    while (padded.length % 4) {
      padded += '='
    }
    
    const json = decodeURIComponent(atob(padded))
    return JSON.parse(json)
  } catch (error) {
    console.error('Error decoding data:', error)
    return null
  }
}

