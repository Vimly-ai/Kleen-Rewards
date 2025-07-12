import { useMemo } from 'react'
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { clsx } from 'clsx'

interface DataPoint {
  name: string
  value: number
  [key: string]: any
}

interface BarChartProps {
  data: DataPoint[]
  bars: Array<{
    dataKey: string
    name: string
    color: string
    stackId?: string
  }>
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  horizontal?: boolean
  animate?: boolean
  className?: string
  xAxisFormatter?: (value: any) => string
  yAxisFormatter?: (value: any) => string
  tooltipFormatter?: (value: any) => string
  barSize?: number
  showValues?: boolean
}

export function BarChart({
  data,
  bars,
  height = 300,
  showGrid = true,
  showLegend = true,
  horizontal = false,
  animate = true,
  className,
  xAxisFormatter,
  yAxisFormatter = (value) => value.toLocaleString(),
  tooltipFormatter = (value) => value.toLocaleString(),
  barSize,
  showValues = false
}: BarChartProps) {
  const chartData = useMemo(() => data, [data])
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {tooltipFormatter(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }
  
  const renderCustomLabel = (props: any) => {
    if (!showValues) return null
    const { x, y, width, height, value } = props
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#374151"
        textAnchor="middle"
        fontSize={12}
        fontWeight={500}
      >
        {yAxisFormatter(value)}
      </text>
    )
  }
  
  return (
    <div className={clsx('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={chartData}
          margin={{ top: showValues ? 20 : 5, right: 30, left: 20, bottom: 5 }}
          layout={horizontal ? 'horizontal' : 'vertical'}
        >
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb"
              vertical={!horizontal}
              horizontal={horizontal}
            />
          )}
          
          {horizontal ? (
            <>
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={{ stroke: '#e5e7eb' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={xAxisFormatter || yAxisFormatter}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={{ stroke: '#e5e7eb' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={{ stroke: '#e5e7eb' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={xAxisFormatter}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={{ stroke: '#e5e7eb' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={yAxisFormatter}
              />
            </>
          )}
          
          <Tooltip content={<CustomTooltip />} />
          
          {showLegend && bars.length > 1 && (
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
              iconSize={18}
            />
          )}
          
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              stackId={bar.stackId}
              animationDuration={animate ? 1500 : 0}
              barSize={barSize}
              label={showValues ? renderCustomLabel : undefined}
            >
              {bars.length === 1 && chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || bar.color} />
              ))}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}