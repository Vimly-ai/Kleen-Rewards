import { useState, useEffect } from 'react'
import { useAdminStore, selectFilteredAuditLogs } from '../../stores/adminStore'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { 
  FileText, 
  Filter, 
  Download, 
  Calendar,
  User,
  Shield,
  Settings,
  DollarSign,
  AlertCircle,
  Search,
  ChevronDown
} from 'lucide-react'
import { clsx } from 'clsx'
import { format } from 'date-fns'

const CATEGORIES = [
  { value: 'all', label: 'All Categories', icon: FileText },
  { value: 'user', label: 'User Actions', icon: User },
  { value: 'system', label: 'System Events', icon: Settings },
  { value: 'points', label: 'Points & Rewards', icon: DollarSign },
  { value: 'security', label: 'Security', icon: Shield },
  { value: 'config', label: 'Configuration', icon: Settings }
]

const SEVERITIES = [
  { value: 'all', label: 'All Severities' },
  { value: 'info', label: 'Info', color: 'bg-blue-100 text-blue-800' },
  { value: 'warning', label: 'Warning', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'error', label: 'Error', color: 'bg-red-100 text-red-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-600 text-white' }
]

export function AuditLog() {
  const store = useAdminStore()
  const { auditFilter, setAuditFilter, addAuditLog, startExport } = store
  const filteredLogs = selectFilteredAuditLogs(store)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  
  // Simulate audit log entries
  useEffect(() => {
    const actions = [
      { action: 'User login', category: 'security', severity: 'info' },
      { action: 'Points awarded', category: 'points', severity: 'info' },
      { action: 'Failed login attempt', category: 'security', severity: 'warning' },
      { action: 'System configuration changed', category: 'config', severity: 'warning' },
      { action: 'User account created', category: 'user', severity: 'info' },
      { action: 'Reward redeemed', category: 'points', severity: 'info' },
      { action: 'Database backup completed', category: 'system', severity: 'info' },
      { action: 'API rate limit exceeded', category: 'system', severity: 'error' }
    ]
    
    const interval = setInterval(() => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      addAuditLog({
        userId: `user_${Math.floor(Math.random() * 100)}`,
        userName: `User ${Math.floor(Math.random() * 100)}`,
        action: randomAction.action,
        category: randomAction.category as any,
        details: {
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0...'
        },
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0...',
        severity: randomAction.severity as any
      })
    }, 10000) // Add new log every 10 seconds
    
    return () => clearInterval(interval)
  }, [addAuditLog])
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setAuditFilter({ category: category === 'all' ? null : category })
  }
  
  const handleSeverityChange = (severity: string) => {
    setSelectedSeverity(severity)
    setAuditFilter({ severity: severity === 'all' ? null : severity })
  }
  
  const handleExport = () => {
    startExport('audit')
    // Simulate export process
    setTimeout(() => {
      const exportId = store.exportQueue[store.exportQueue.length - 1]?.id
      if (exportId) {
        store.updateExportStatus(exportId, 'processing', 50)
        setTimeout(() => {
          store.updateExportStatus(exportId, 'completed', 100, '/downloads/audit-log.csv')
        }, 2000)
      }
    }, 1000)
  }
  
  const getCategoryIcon = (category: string) => {
    const categoryConfig = CATEGORIES.find(c => c.value === category)
    const Icon = categoryConfig?.icon || FileText
    return <Icon className="w-4 h-4" />
  }
  
  const getSeverityBadge = (severity: string) => {
    const severityConfig = SEVERITIES.find(s => s.value === severity)
    return (
      <Badge className={clsx('text-xs', severityConfig?.color || 'bg-gray-100 text-gray-800')}>
        {severityConfig?.label || severity}
      </Badge>
    )
  }
  
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss')
  }
  
  return (
    <Card>
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Audit Log
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Track all system activities and changes
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={clsx(
                'w-4 h-4 transition-transform',
                showFilters && 'rotate-180'
              )} />
            </Button>
            
            <Button
              size="small"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  size="small"
                />
              </div>
              
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              
              {/* Severity Filter */}
              <select
                value={selectedSeverity}
                onChange={(e) => handleSeverityChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {SEVERITIES.map(severity => (
                  <option key={severity.value} value={severity.value}>
                    {severity.label}
                  </option>
                ))}
              </select>
              
              {/* Date Range */}
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  size="small"
                  onChange={(e) => setAuditFilter({ dateFrom: e.target.value })}
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  size="small"
                  onChange={(e) => setAuditFilter({ dateTo: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.length > 0 ? (
              filteredLogs.slice(0, 20).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{log.userName}</div>
                      <div className="text-gray-500 text-xs">{log.userId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      {getCategoryIcon(log.category)}
                      <span className="capitalize">{log.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSeverityBadge(log.severity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500">No audit logs found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Activities will appear here as they occur
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredLogs.length > 20 && (
        <div className="px-6 py-4 border-t border-gray-200 text-center">
          <Button variant="secondary" size="small">
            Load More
          </Button>
        </div>
      )}
    </Card>
  )
}