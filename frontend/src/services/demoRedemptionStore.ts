// Store for demo redemptions
interface StoredRedemption {
  id: string
  user_id: string
  reward_id: string
  points_spent: number
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled'
  requested_date: string
  created_at: string
  updated_at: string
  reward?: any
}

class DemoRedemptionStore {
  private redemptions: StoredRedemption[] = []
  
  constructor() {
    // Load from localStorage if available
    const stored = localStorage.getItem('demo_redemptions')
    if (stored) {
      try {
        this.redemptions = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored redemptions:', e)
        this.redemptions = []
      }
    }
  }
  
  add(redemption: StoredRedemption) {
    this.redemptions.push(redemption)
    this.save()
  }
  
  getByUserId(userId: string): StoredRedemption[] {
    return this.redemptions.filter(r => r.user_id === userId)
  }
  
  getAll(): StoredRedemption[] {
    return [...this.redemptions]
  }
  
  update(id: string, updates: Partial<StoredRedemption>) {
    const index = this.redemptions.findIndex(r => r.id === id)
    if (index !== -1) {
      this.redemptions[index] = { ...this.redemptions[index], ...updates }
      this.save()
    }
  }
  
  private save() {
    try {
      localStorage.setItem('demo_redemptions', JSON.stringify(this.redemptions))
    } catch (e) {
      console.error('Failed to save redemptions to localStorage:', e)
    }
  }
}

export const demoRedemptionStore = new DemoRedemptionStore()