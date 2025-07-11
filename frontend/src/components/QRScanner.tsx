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

      if (!readerRef.current) {
        readerRef.current = new BrowserMultiFormatReader()
      }

      const videoInputDevices = await readerRef.current.listVideoInputDevices()
      
      if (videoInputDevices.length === 0) {
        throw new Error('No camera devices found')
      }

      // Use the first available camera (usually back camera on mobile)
      const selectedDeviceId = videoInputDevices[0].deviceId

      if (videoRef.current) {
        await readerRef.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              onScanSuccess(result.getText())
              stopScanning()
              onClose()
            }
            if (error && !(error instanceof Error)) {
              // Only log unexpected errors
              console.log('Scanning...', error)
            }
          }
        )
      }
    } catch (err: any) {
      console.error('Error starting scanner:', err)
      setError(err.message || 'Failed to start camera')
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
          <h3 className="text-xl font-semibold mb-2">QR Code Scanner</h3>
          <p className="text-gray-600">Point your camera at the QR code to check in</p>
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