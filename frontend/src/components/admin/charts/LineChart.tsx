import { useMemo } from 'react'
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { format } from 'date-fns'
import { clsx } from 'clsx'

interface DataPoint {
  name: string
  value: number
  [key: string]: any
}

interface LineChartProps {
  data: DataPoint[]
  lines: Array<{
    dataKey: string
    name: string
    color: string
    strokeWidth?: number
    strokeDasharray?: string
  }>
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  showArea?: boolean
  animate?: boolean
  className?: string
  xAxisFormatter?: (value: any) => string
  yAxisFormatter?: (value: any) => string
  tooltipFormatter?: (value: any) => string
}

export function LineChart({
  data,
  lines,
  height = 300,
  showGrid = true,
  showLegend = true,
  showArea = false,
  animate = true,
  className,
  xAxisFormatter,
  yAxisFormatter = (value) => value.toLocaleString(),
  tooltipFormatter = (value) => value.toLocaleString()
}: LineChartProps) {
  const chartData = useMemo(() => data, [data])
  
  const ChartComponent = showArea ? AreaChart : RechartsLineChart
  
  return (
    <div className={clsx('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb"
              vertical={false}
            />
          )}
          
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={xAxisFormatter}
          />
          
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={yAxisFormatter}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
            labelStyle={{ color: '#374151', fontWeight: 600, marginBottom: '4px' }}
            formatter={tooltipFormatter}
          />
          
          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
              iconSize={18}
            />
          )}
          
          {lines.map((line) => (
            showArea ? (
              <Area
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                strokeWidth={line.strokeWidth || 2}
                strokeDasharray={line.strokeDasharray}
                fill={line.color}
                fillOpacity={0.1}
                animationDuration={animate ? 1500 : 0}
              />
            ) : (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                strokeWidth={line.strokeWidth || 2}
                strokeDasharray={line.strokeDasharray}
                dot={false}
                activeDot={{ r: 6 }}
                animationDuration={animate ? 1500 : 0}
              />
            )
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
}