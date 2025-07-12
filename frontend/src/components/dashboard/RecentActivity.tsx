import { format } from 'date-fns'
import { CheckIn } from '../../services/supabase'

interface RecentActivityProps {
  checkIns: CheckIn[]
}

export function RecentActivity({ checkIns }: RecentActivityProps) {
  const getCheckInIcon = (type: string) => {
    switch (type) {
      case 'early':
        return '🌅'
      case 'ontime':
        return '⏰'
      case 'late':
        return '📅'
      default:
        return '✅'
    }
  }

  const getCheckInColor = (type: string) => {
    switch (type) {
      case 'early':
        return 'text-green-600 bg-green-100'
      case 'ontime':
        return 'text-blue-600 bg-blue-100'
      case 'late':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (checkIns.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No check-ins yet. Start your streak today!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {checkIns.map((checkIn) => (
          <div key={checkIn.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100">
            <div className="text-2xl">{getCheckInIcon(checkIn.check_in_type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCheckInColor(checkIn.check_in_type)}`}>
                  {checkIn.check_in_type === 'early' ? 'Early Bird' : 
                   checkIn.check_in_type === 'ontime' ? 'On Time' : 'Late'}
                </span>
                {checkIn.points_earned > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-yellow-800 bg-yellow-100">
                    +{checkIn.points_earned} pts
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {format(new Date(checkIn.check_in_time), 'MMM d, yyyy \'at\' h:mm a')}
              </p>
              {checkIn.streak_day > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Streak day {checkIn.streak_day}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}