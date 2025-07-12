import { useState } from 'react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Input } from '../ui/Input'
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Gift, 
  Coffee, 
  ShoppingBag, 
  Gamepad2, 
  Car, 
  Plane, 
  Heart 
} from 'lucide-react'
import { clsx } from 'clsx'

interface FilterState {
  search: string
  categories: string[]
  priceRange: [number, number]
  availability: 'all' | 'available' | 'limited'
  sortBy: 'popularity' | 'price_low' | 'price_high' | 'newest'
}

interface RewardFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  totalResults: number
  className?: string
}

const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: Coffee, color: 'bg-orange-100 text-orange-700' },
  { id: 'retail', label: 'Retail & Shopping', icon: ShoppingBag, color: 'bg-blue-100 text-blue-700' },
  { id: 'entertainment', label: 'Entertainment', icon: Gamepad2, color: 'bg-purple-100 text-purple-700' },
  { id: 'travel', label: 'Travel', icon: Plane, color: 'bg-green-100 text-green-700' },
  { id: 'automotive', label: 'Automotive', icon: Car, color: 'bg-gray-100 text-gray-700' },
  { id: 'wellness', label: 'Health & Wellness', icon: Heart, color: 'bg-pink-100 text-pink-700' }
]

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' }
]

const PRICE_RANGES = [
  { label: 'Under 100', range: [0, 100] as [number, number] },
  { label: '100 - 500', range: [100, 500] as [number, number] },
  { label: '500 - 1000', range: [500, 1000] as [number, number] },
  { label: '1000+', range: [1000, 10000] as [number, number] }
]

export function RewardFilters({ 
  filters, 
  onFiltersChange, 
  totalResults,
  className 
}: RewardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates })
  }
  
  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId]
    updateFilters({ categories: newCategories })
  }
  
  const clearFilters = () => {
    onFiltersChange({
      search: '',
      categories: [],
      priceRange: [0, 10000],
      availability: 'all',
      sortBy: 'popularity'
    })
  }
  
  const hasActiveFilters = filters.search || 
    filters.categories.length > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 10000 ||
    filters.availability !== 'all'

  return (
    <div className={clsx('bg-white border border-gray-200 rounded-lg', className)}>
      {/* Search and Sort Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search rewards..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <Button
              variant="outline"
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="primary" className="text-xs">
                  {filters.categories.length + (hasActiveFilters ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-600">
            {totalResults} rewards found
          </p>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="small"
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all filters
              <X className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => {
                const isSelected = filters.categories.includes(category.id)
                const Icon = category.icon
                
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      isSelected
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Price Range */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Points Range</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRICE_RANGES.map(range => {
                const isSelected = filters.priceRange[0] === range.range[0] && 
                                 filters.priceRange[1] === range.range[1]
                
                return (
                  <button
                    key={range.label}
                    onClick={() => updateFilters({ priceRange: range.range })}
                    className={clsx(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      isSelected
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                    )}
                  >
                    {range.label} pts
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Availability */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Rewards' },
                { value: 'available', label: 'Available Now' },
                { value: 'limited', label: 'Limited Time' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => updateFilters({ availability: option.value as any })}
                  className={clsx(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    filters.availability === option.value
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}