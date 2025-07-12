import React from 'react'

// React component performance wrapper
export function measureComponentRender<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function MeasuredComponent(props: T) {
    const startTime = performance.now()
    
    React.useEffect(() => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      if (renderTime > 16) { // Warn if render takes longer than one frame
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`)
      }
    })

    return React.createElement(Component, props)
  }
}