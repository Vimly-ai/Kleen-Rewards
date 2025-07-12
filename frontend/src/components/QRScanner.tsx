import React, { useState, useRef, useEffect } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { X, Camera } from 'lucide-react'

interface QRScannerProps {
  onScanSuccess: (data: string) => void
  onClose: () => void
  isOpen: boolean
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose, isOpen }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)

  useEffect(() => {
    if (!isOpen) {
      stopScanning()
      return
    }

    startScanning()
    return () => stopScanning()
  }, [isOpen])

  const startScanning = async () => {
    try {
      setError(null)
      setIsScanning(true)

      // Initialize the reader
      if (!readerRef.current) {
        readerRef.current = new BrowserMultiFormatReader()
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
        await readerRef.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              console.log('QR Code detected:', result.getText())
              onScanSuccess(result.getText())
              stopScanning()
              onClose()
            }
            if (error) {
              // Log scanning errors (but don't stop scanning for common errors)
              console.log('Scanning error:', error)
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
    if (readerRef.current) {
      readerRef.current.reset()
    }
    setIsScanning(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <Camera className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Employee Check-In</h3>
          <p className="text-gray-600 mb-2">Point your camera at the office QR code</p>
          <div className="text-sm text-gray-500">
            <p className="font-medium">Current Time: {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZone: 'America/Denver' 
            })} MST</p>
            <p className="text-xs mt-1">Check-in window: 6:00 AM - 9:00 AM MST</p>
          </div>
          <div className="mt-3 p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
            <p className="font-medium">Point System:</p>
            <p>• Early (≤7:45 AM): 2 points</p>
            <p>• On-time (7:46-8:01 AM): 1 point</p>
            <p>• Late (≥8:02 AM): 0 points</p>
          </div>
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