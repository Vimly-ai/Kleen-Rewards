import React, { useState, useRef, useEffect } from 'react'
import { X, Camera, AlertCircle } from 'lucide-react'

interface SimpleQRScannerProps {
  onScanSuccess: (data: string) => void
  onClose: () => void
  isOpen: boolean
}

export const SimpleQRScanner: React.FC<SimpleQRScannerProps> = ({ onScanSuccess, onClose, isOpen }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isOpen) {
      stopScanning()
      return
    }

    startCamera()
    return () => stopScanning()
  }, [isOpen])

  const startCamera = async () => {
    try {
      setError(null)
      setIsScanning(true)

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer back camera
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
        
        // Start scanning when video is ready
        videoRef.current.onloadedmetadata = () => {
          startScanning()
        }
      }
    } catch (err: any) {
      console.error('Camera access error:', err)
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access and refresh the page.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.')
      } else {
        setError('Failed to access camera. Please try again.')
      }
      setIsScanning(false)
    }
  }

  const startScanning = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (!context) return

    // Set canvas size to match video
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    const scanInterval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // Get image data
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        
        // Try to detect QR code using a simple approach
        // This is a simplified scanner - in production you'd use a proper QR library
        tryDetectQR(imageData)
      }
    }, 500) // Scan every 500ms

    // Store interval reference to clear later
    ;(videoRef.current as any).scanInterval = scanInterval
  }

  const tryDetectQR = async (imageData: ImageData) => {
    try {
      // Use the browser's built-in barcode detector if available
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new (window as any).BarcodeDetector({
          formats: ['qr_code']
        })
        
        const barcodes = await barcodeDetector.detect(imageData)
        
        if (barcodes.length > 0) {
          console.log('QR Code detected:', barcodes[0].rawValue)
          onScanSuccess(barcodes[0].rawValue)
          stopScanning()
          onClose()
        }
      }
    } catch (error) {
      // BarcodeDetector not available or failed
      console.log('BarcodeDetector not available or failed:', error)
    }
  }

  const stopScanning = () => {
    // Clear scanning interval
    if (videoRef.current && (videoRef.current as any).scanInterval) {
      clearInterval((videoRef.current as any).scanInterval)
    }

    // Stop video stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }

    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsScanning(false)
  }

  const handleManualInput = () => {
    const qrData = prompt('Enter QR code data manually (for testing):\n\nExample: systemkleen-checkin-office-main')
    if (qrData && qrData.trim()) {
      onScanSuccess(qrData.trim())
      onClose()
    }
  }

  const handleTestCheckIn = () => {
    // Simulate a valid QR code scan for testing
    onScanSuccess('systemkleen-checkin-office-main')
    onClose()
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
            <p>Current Time: {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZone: 'America/Denver' 
            })} MST</p>
            <p className="text-xs mt-1">Check-in window: 6:00 AM - 9:00 AM</p>
          </div>
        </div>

        {error ? (
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={startCamera}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Camera Again
              </button>
              <button
                onClick={handleTestCheckIn}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                ✅ Test Check-In (Demo)
              </button>
              <button
                onClick={handleManualInput}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
              >
                Manual QR Input
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-64 bg-black rounded-lg object-cover"
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-blue-500 w-48 h-48 rounded-lg animate-pulse">
                  <div className="w-full h-full border-2 border-transparent bg-blue-500 bg-opacity-10 rounded-lg"></div>
                </div>
              </div>
            )}
            {/* Keep only the Test Check-In button inside the scanner for quick testing */}
            <div className="absolute bottom-2 left-2 right-2">
              <button
                onClick={handleTestCheckIn}
                className="w-full bg-green-600 bg-opacity-90 text-white text-sm py-2 px-4 rounded font-medium"
              >
                ✅ Test Check-In (Demo)
              </button>
            </div>
          </div>
        )}

        {/* Scanner control buttons below the video */}
        <div className="mt-4 space-y-2">
          <button
            onClick={() => {
              // Trigger a manual scan attempt
              if (canvasRef.current && videoRef.current) {
                const canvas = canvasRef.current
                const video = videoRef.current
                const context = canvas.getContext('2d')
                if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
                  canvas.width = video.videoWidth || 640
                  canvas.height = video.videoHeight || 480
                  context.drawImage(video, 0, 0, canvas.width, canvas.height)
                  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
                  tryDetectQR(imageData)
                }
              }
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
          >
            📸 Scan Now
          </button>
          <button
            onClick={handleManualInput}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Manual QR Input
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Position the QR code within the frame above
          </p>
        </div>
      </div>
    </div>
  )
}

export default SimpleQRScanner