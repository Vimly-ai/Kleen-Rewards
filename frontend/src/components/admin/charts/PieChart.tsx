import { useMemo } from 'react'
import { Pie, PieChart as RechartsPieChart, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts'
import { clsx } from 'clsx'

interface DataPoint {
  name: string
  value: number
  color?: string
}

interface PieChartProps {
  data: DataPoint[]
  height?: number
  innerRadius?: number
  outerRadius?: number
  showLegend?: boolean
  showLabels?: boolean
  animate?: boolean
  className?: string
  colors?: string[]
  tooltipFormatter?: (value: any) => string
  activeIndex?: number
  onPieClick?: (data: DataPoint, index: number) => void
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // yellow
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
]

export function PieChart({
  data,
  height = 300,
  innerRadius = 0,
  outerRadius = 80,
  showLegend = true,
  showLabels = true,
  animate = true,
  className,
  colors = DEFAULT_COLORS,
  tooltipFormatter = (value) => value.toLocaleString(),
  activeIndex,
  onPieClick
}: PieChartProps) {
  const chartData = useMemo(() => 
    data.map((item, index) => ({
      ...item,
      color: item.color || colors[index % colors.length]
    })), [data, colors])
  
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent
    } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#374151" className="text-lg font-semibold">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#374151" className="text-sm">
          {tooltipFormatter(payload.value)}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#9ca3af" className="text-xs">
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    )
  }
  
  const renderLabel = (props: any) => {
    if (!showLabels) return null
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180)
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180)

    if (percent < 0.05) return null // Don't show label for small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold" style={{ color: data.payload.color }}>
            {data.name}
          </p>
          <p className="text-sm text-gray-600">
            Value: {tooltipFormatter(data.value)}
          </p>
          <p className="text-sm text-gray-600">
            Percentage: {(data.percent * 100).toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }
  
  return (
    <div className={clsx('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            animationDuration={animate ? 1500 : 0}
            activeIndex={activeIndex}
            activeShape={activeIndex !== undefined ? renderActiveShape : undefined}
            onClick={onPieClick ? (data, index) => onPieClick(data, index) : undefined}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                style={{ cursor: onPieClick ? 'pointer' : 'default' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              iconSize={10}
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color }} className="text-sm">
                  {value}: {tooltipFormatter(entry.payload.value)}
                </span>
              )}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}