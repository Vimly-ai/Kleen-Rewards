import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, UserButton } from '@clerk/clerk-react'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Employee Rewards - System Kleen
            </h1>
            <UserButton />
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-6 mb-6">
          <h2 className="text-2xl font-bold">Welcome to System Kleen!</h2>
          <p className="mt-2">Your Employee Rewards Dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-2">Total Points</h3>
            <p className="text-3xl font-bold text-blue-600">245</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-2">Current Streak</h3>
            <p className="text-3xl font-bold text-green-600">7 days</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-2">Rank</h3>
            <p className="text-3xl font-bold text-purple-600">#3</p>
          </div>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SignedIn>
        <Routes>
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)