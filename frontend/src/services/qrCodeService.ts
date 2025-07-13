/**
 * QR Code Service
 * Manages QR code generation, validation, and settings
 */

export interface QRCodeConfig {
  id: string
  code: string
  url: string
  isActive: boolean
  createdAt: Date
  expiresAt: Date | null
  usageCount: number
}

export interface CheckInSettings {
  timeWindow: {
    startTime: string
    endTime: string
    timezone: string
  }
  pointsConfig: {
    earlyBirdTime: string
    earlyBirdPoints: number
    onTimeEndTime: string
    onTimePoints: number
    latePoints: number
  }
  bonuses: {
    perfectWeek: number
    tenDayStreak: number
  }
}

const QR_CODE_STORAGE_KEY = 'systemkleen_active_qr_code'
const QR_CODE_HISTORY_KEY = 'systemkleen_qr_history'
const CHECKIN_SETTINGS_KEY = 'systemkleen_checkin_settings'

export class QRCodeService {
  /**
   * Generate a new QR code
   */
  static generateQRCode(): QRCodeConfig {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    const code = `SK${new Date().getFullYear()}-${timestamp}-${random}`
    
    return {
      id: `qr-${Date.now()}`,
      code,
      url: `https://systemkleen.com/checkin/${code}`,
      isActive: true,
      createdAt: new Date(),
      expiresAt: null,
      usageCount: 0
    }
  }

  /**
   * Get the active QR code
   */
  static getActiveQRCode(): QRCodeConfig | null {
    const stored = localStorage.getItem(QR_CODE_STORAGE_KEY)
    if (!stored) {
      // Generate initial QR code
      const newCode = this.generateQRCode()
      this.saveActiveQRCode(newCode)
      return newCode
    }
    
    const qrCode = JSON.parse(stored)
    return {
      ...qrCode,
      createdAt: new Date(qrCode.createdAt),
      expiresAt: qrCode.expiresAt ? new Date(qrCode.expiresAt) : null
    }
  }

  /**
   * Save active QR code
   */
  static saveActiveQRCode(qrCode: QRCodeConfig): void {
    localStorage.setItem(QR_CODE_STORAGE_KEY, JSON.stringify(qrCode))
  }

  /**
   * Deactivate current QR code and generate new one
   */
  static rotateQRCode(): QRCodeConfig {
    const currentCode = this.getActiveQRCode()
    
    // Add current code to history
    if (currentCode) {
      const deactivatedCode = {
        ...currentCode,
        isActive: false,
        expiresAt: new Date()
      }
      this.addToHistory(deactivatedCode)
    }
    
    // Generate and save new code
    const newCode = this.generateQRCode()
    this.saveActiveQRCode(newCode)
    
    return newCode
  }

  /**
   * Add QR code to history
   */
  static addToHistory(qrCode: QRCodeConfig): void {
    const history = this.getQRCodeHistory()
    history.unshift(qrCode)
    // Keep only last 50 codes
    if (history.length > 50) {
      history.pop()
    }
    localStorage.setItem(QR_CODE_HISTORY_KEY, JSON.stringify(history))
  }

  /**
   * Get QR code history
   */
  static getQRCodeHistory(): QRCodeConfig[] {
    const stored = localStorage.getItem(QR_CODE_HISTORY_KEY)
    if (!stored) return []
    
    const history = JSON.parse(stored)
    return history.map((qr: any) => ({
      ...qr,
      createdAt: new Date(qr.createdAt),
      expiresAt: qr.expiresAt ? new Date(qr.expiresAt) : null
    }))
  }

  /**
   * Validate QR code format and check if active
   */
  static validateQRCode(url: string): { valid: boolean; code?: string; error?: string } {
    const QR_URL_PATTERN = /^https?:\/\/systemkleen\.com\/checkin\/([A-Z0-9-]+)$/
    const match = url.match(QR_URL_PATTERN)
    
    if (!match) {
      return { valid: false, error: 'Invalid QR code format' }
    }
    
    const code = match[1]
    
    // Check format
    if (!code.startsWith('SK') || code.length < 10) {
      return { valid: false, error: 'Invalid QR code format' }
    }
    
    // In demo mode, accept the hardcoded demo QR code
    const DEMO_QR_CODE = 'SK2024-MAIN-001'
    if (code === DEMO_QR_CODE) {
      return { valid: true, code }
    }
    
    // Check if it's the active code
    const activeCode = this.getActiveQRCode()
    if (!activeCode || activeCode.code !== code) {
      return { valid: false, error: 'QR code is not active or has expired' }
    }
    
    // Increment usage count
    activeCode.usageCount++
    this.saveActiveQRCode(activeCode)
    
    return { valid: true, code }
  }

  /**
   * Get check-in settings
   */
  static getCheckInSettings(): CheckInSettings {
    const stored = localStorage.getItem(CHECKIN_SETTINGS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    
    // Default settings
    return {
      timeWindow: {
        startTime: "06:00",
        endTime: "09:00",
        timezone: "America/Denver"
      },
      pointsConfig: {
        earlyBirdTime: "07:45",
        earlyBirdPoints: 2,
        onTimeEndTime: "08:01",
        onTimePoints: 1,
        latePoints: 0
      },
      bonuses: {
        perfectWeek: 5,
        tenDayStreak: 10
      }
    }
  }

  /**
   * Save check-in settings
   */
  static saveCheckInSettings(settings: CheckInSettings): void {
    localStorage.setItem(CHECKIN_SETTINGS_KEY, JSON.stringify(settings))
  }

  /**
   * Check if within check-in window
   */
  static isWithinCheckInWindow(): { allowed: boolean; currentTime: Date; message?: string } {
    const settings = this.getCheckInSettings()
    const now = new Date()
    const timezone = settings.timeWindow.timezone
    
    // Get time in specified timezone
    const timeStr = now.toLocaleString("en-US", { timeZone: timezone })
    const localTime = new Date(timeStr)
    const hours = localTime.getHours()
    const minutes = localTime.getMinutes()
    const currentMinutes = hours * 60 + minutes
    
    // Parse start and end times
    const [startHour, startMin] = settings.timeWindow.startTime.split(':').map(Number)
    const [endHour, endMin] = settings.timeWindow.endTime.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    if (currentMinutes < startMinutes || currentMinutes >= endMinutes) {
      return {
        allowed: false,
        currentTime: localTime,
        message: `Check-ins are only allowed between ${settings.timeWindow.startTime} - ${settings.timeWindow.endTime} ${timezone}`
      }
    }
    
    return { allowed: true, currentTime: localTime }
  }

  /**
   * Calculate points based on check-in time
   */
  static calculatePoints(checkInTime?: Date): { points: number; type: 'early' | 'ontime' | 'late' } {
    const settings = this.getCheckInSettings()
    const time = checkInTime || new Date()
    
    // Get time in specified timezone
    const timeStr = time.toLocaleString("en-US", { timeZone: settings.timeWindow.timezone })
    const localTime = new Date(timeStr)
    const hours = localTime.getHours()
    const minutes = localTime.getMinutes()
    const currentMinutes = hours * 60 + minutes
    
    // Parse cutoff times
    const [earlyHour, earlyMin] = settings.pointsConfig.earlyBirdTime.split(':').map(Number)
    const [onTimeHour, onTimeMin] = settings.pointsConfig.onTimeEndTime.split(':').map(Number)
    const earlyMinutes = earlyHour * 60 + earlyMin
    const onTimeMinutes = onTimeHour * 60 + onTimeMin
    
    if (currentMinutes <= earlyMinutes) {
      return { points: settings.pointsConfig.earlyBirdPoints, type: 'early' }
    } else if (currentMinutes <= onTimeMinutes) {
      return { points: settings.pointsConfig.onTimePoints, type: 'ontime' }
    } else {
      return { points: settings.pointsConfig.latePoints, type: 'late' }
    }
  }
}

export default QRCodeService