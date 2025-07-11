import React from 'react'
import { QrCode, Download } from 'lucide-react'

export const QRCodeGenerator: React.FC = () => {
  // Sample QR code data for System Kleen check-in
  const qrData = 'systemkleen-checkin-location-main-office'
  
  // Generate QR code URL using a free service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`

  const downloadQR = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = 'systemkleen-checkin-qr.png'
    link.click()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <QrCode className="w-8 h-8 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold">Check-in QR Code</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-4">
          <img 
            src={qrCodeUrl} 
            alt="System Kleen Check-in QR Code" 
            className="mx-auto mb-4"
          />
          <p className="text-sm text-gray-600 mb-2">
            System Kleen Check-in QR Code
          </p>
          <p className="text-xs text-gray-500">
            Print this QR code and place it at your check-in location
          </p>
        </div>

        <button
          onClick={downloadQR}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
        >
          <Download className="w-4 h-4" />
          <span>Download QR Code</span>
        </button>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>For Testing:</strong> You can scan this QR code with the scanner to test the functionality.
          </p>
        </div>
      </div>
    </div>
  )
}

export default QRCodeGenerator