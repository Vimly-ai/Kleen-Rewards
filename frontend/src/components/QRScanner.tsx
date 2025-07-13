import React, { useState, useRef, useEffect } from 'react'
import { BrowserQRCodeReader } from '@zxing/browser'
import { X, Camera } from 'lucide-react'
import QRCodeService from '../services/qrCodeService'

interface QRScannerProps {
  onScanSuccess: (data: string) => void
  onClose: () => void
  isOpen: boolean
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose, isOpen }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasScanned, setHasScanned] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<BrowserQRCodeReader | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isProcessingRef = useRef<boolean>(false)

  useEffect(() => {
    if (!isOpen) {
      stopScanning()
      setHasScanned(false)
      return
    }

    // Reset state when opening
    setHasScanned(false)
    setError(null)
    
    // Start scanning after a small delay
    const startTimeout = setTimeout(() => {
      startScanning()
    }, 500)
    
    // Cleanup function
    return () => {
      clearTimeout(startTimeout)
      stopScanning()
    }
  }, [isOpen])
  
  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  const startScanning = async () => {
    try {
      setError(null)
      setIsScanning(true)

      // Initialize the reader
      if (!readerRef.current) {
        readerRef.current = new BrowserQRCodeReader()
      }

      // Check for camera permissions first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment' // Prefer back camera
          } 
        })
        
        // Stop the test stream
        stream.getTracks().forEach(track => track.stop())
      } catch (permissionError) {
        throw new Error('Camera permission denied. Please allow camera access and try again.')
      }

      // Get available video devices
      let videoInputDevices
      try {
        videoInputDevices = await readerRef.current.listVideoInputDevices()
      } catch (deviceError) {
        // Fallback: try to get devices directly from navigator
        const devices = await navigator.mediaDevices.enumerateDevices()
        videoInputDevices = devices.filter(device => device.kind === 'videoinput')
      }
      
      if (!videoInputDevices || videoInputDevices.length === 0) {
        throw new Error('No camera devices found')
      }

      // Find back camera if available, otherwise use first camera
      let selectedDeviceId = videoInputDevices[0].deviceId
      const backCamera = videoInputDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      )
      if (backCamera) {
        selectedDeviceId = backCamera.deviceId
      }

      if (videoRef.current) {
        // Store the stream reference
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedDeviceId,
            facingMode: 'environment'
          }
        })
        streamRef.current = stream
        
        await readerRef.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, error) => {
            if (result && !hasScanned && !isProcessingRef.current) {
              // Prevent multiple scans
              isProcessingRef.current = true
              setHasScanned(true)
              console.log('QR Code detected:', result.getText())
              
              // Stop the reader immediately to prevent further scanning
              if (readerRef.current) {
                readerRef.current.reset()
              }
              
              // Stop scanning and cleanup
              stopScanning()
              
              // Call success callback after ensuring scanner is stopped
              setTimeout(() => {
                onScanSuccess(result.getText())
                onClose()
                isProcessingRef.current = false
              }, 100)
            }
            if (error && error.name !== 'NotFoundException' && !hasScanned) {
              // Log scanning errors (but don't stop scanning for "not found" errors)
              console.debug('Scanning error:', error)
            }
          }
        )
        setIsScanning(true)
      }
    } catch (err: any) {
      console.error('Error starting scanner:', err)
      setError(err.message || 'Failed to start camera. Please check camera permissions.')
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    try {
      // Clear any pending timeouts
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current)
        scanTimeoutRef.current = null
      }
      
      // Reset the reader if it exists
      if (readerRef.current) {
        // This stops the decode loop
        readerRef.current.reset()
        readerRef.current = null
      }
      
      // Stop the video stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop()
        })
        streamRef.current = null
      }
      
      // Stop the video element
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => {
          track.stop()
        })
        videoRef.current.srcObject = null
      }
      
      setIsScanning(false)
      setError(null)
      setHasScanned(false)
      isProcessingRef.current = false
    } catch (err) {
      console.error('Error stopping scanner:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopScanning()
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Close button clicked - stopping scanner')
            stopScanning()
            // Ensure close is called after stop
            setTimeout(() => {
              onClose()
            }, 100)
          }}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <Camera className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Employee Check-In</h3>
          <p className="text-gray-600 mb-2">Point your camera at the office QR code</p>
          {(() => {
            const settings = QRCodeService.getCheckInSettings()
            const now = new Date()
            const timeStr = now.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZone: settings.timeWindow.timezone 
            })
            const tzAbbr = settings.timeWindow.timezone === 'America/Denver' ? 'MST' : 
                          settings.timeWindow.timezone === 'America/Chicago' ? 'CST' :
                          settings.timeWindow.timezone === 'America/New_York' ? 'EST' :
                          settings.timeWindow.timezone === 'America/Los_Angeles' ? 'PST' : 'TZ'
            
            return (
              <>
                <div className="text-sm text-gray-500">
                  <p className="font-medium">Current Time: {timeStr} {tzAbbr}</p>
                  <p className="text-xs mt-1">Check-in window: {settings.timeWindow.startTime} - {settings.timeWindow.endTime} {tzAbbr}</p>
                </div>
                <div className="mt-3 p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
                  <p className="font-medium">Point System:</p>
                  <p>• Early (≤{settings.pointsConfig.earlyBirdTime}): {settings.pointsConfig.earlyBirdPoints} points</p>
                  <p>• On-time ({settings.pointsConfig.earlyBirdTime}-{settings.pointsConfig.onTimeEndTime}): {settings.pointsConfig.onTimePoints} point</p>
                  <p>• Late (≥{settings.pointsConfig.onTimeEndTime}): {settings.pointsConfig.latePoints} points</p>
                </div>
              </>
            )
          })()}
        </div>

        {error ? (
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600">{error}</p>
            </div>
            <button
              onClick={startScanning}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-64 bg-black rounded-lg object-cover"
              playsInline
            />
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-blue-500 w-48 h-48 rounded-lg animate-pulse"></div>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Make sure the QR code is clearly visible and well-lit
          </p>
        </div>
      </div>
    </div>
  )
}

export default QRScanner