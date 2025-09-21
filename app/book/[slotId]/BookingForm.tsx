'use client'

import { useState } from 'react'
import { bookSlot } from '@/lib/actions'
import { useRouter } from 'next/navigation'

interface BookingFormProps {
  slotId: string
}

export default function BookingForm({ slotId }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [phone, setPhone] = useState('')
  const [flat, setFlat] = useState('')
  const [flatError, setFlatError] = useState('')
  const router = useRouter()

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, '')
    // Limit to 10 digits
    const limitedPhone = phoneNumber.slice(0, 10)
    return limitedPhone
  }

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '')
    // Check if it's exactly 10 digits
    return cleanPhone.length === 10
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const handleFlatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFlat(value)
    setFlatError('')
    
    // Basic validation
    if (value.trim() === '') {
      setFlatError('Flat number is required')
    } else if (value.trim().length < 2) {
      setFlatError('Please enter a valid flat number')
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      const name = formData.get('name') as string
      const flat = formData.get('flat') as string
      const phone = formData.get('phone') as string

      // Validate phone number
      if (!validatePhoneNumber(phone)) {
        setError('Please enter a valid 10-digit phone number')
        setIsSubmitting(false)
        return
      }

      // Basic validation
      if (!name.trim() || !flat.trim() || !phone.trim()) {
        setError('Please fill in all fields')
        setIsSubmitting(false)
        return
      }

      // Flat number validation
      if (flat.trim().length < 2) {
        setFlatError('Please enter a valid flat number')
        setError('Please enter a valid flat number')
        setIsSubmitting(false)
        return
      }

      const result = await bookSlot(slotId, {
        name: name.trim(),
        flat: flat.trim(),
        phone: phone.trim(),
      })

      if (result.success) {
        setSuccess(true)
        // Redirect to homepage after 2 seconds
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setError(result.error || 'Failed to book slot')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Booking Successful! 🎉
        </h3>
        <p className="text-lg text-gray-600 mb-6">
          Your Aarti slot has been reserved successfully.
        </p>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700">
            You will be redirected to the homepage shortly...
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      handleSubmit(formData)
    }} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-3">
            Full Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter your full name"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="flat" className="block text-sm font-bold text-gray-900 mb-3">
            Flat Number * <span className="text-xs text-gray-500">(Use 000 for Mandal Aarti)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="flat"
              name="flat"
              value={flat}
              onChange={handleFlatChange}
              required
              className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 ${
                flatError 
                  ? 'border-red-400 bg-red-50' 
                  : flat.length >= 2 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-200'
              }`}
              placeholder="e.g., 101, 205, 000 (Mandal Aarti)"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              {flat.length >= 2 && !flatError ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : flatError ? (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
            </div>
          </div>
          {flatError && (
            <p className="text-sm text-red-600 mt-2">
              {flatError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-3">
            Phone Number * <span className="text-sm text-gray-500">(10 digits)</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={handlePhoneChange}
              required
              maxLength={10}
              className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 ${
                phone.length > 0 && phone.length < 10 
                  ? 'border-yellow-400 bg-yellow-50' 
                  : phone.length === 10 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-200'
              }`}
              placeholder="9876543210"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              {phone.length === 10 ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              )}
            </div>
          </div>
          {phone.length > 0 && phone.length < 10 && (
            <p className="text-sm text-yellow-600 mt-2">
              {10 - phone.length} more digits needed
            </p>
          )}
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting || phone.length !== 10 || flat.length < 2 || flatError !== ''}
          className={`group relative w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
            isSubmitting || phone.length !== 10 || flat.length < 2 || flatError !== ''
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-6 h-6 border-3 border-transparent border-t-white/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
              </div>
              <span className="font-medium">Booking Slot...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span>Book This Slot</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          )}
        </button>
        {(phone.length !== 10 || flat.length < 2 || flatError !== '') && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            {phone.length !== 10 ? 'Complete phone number' : 
             flat.length < 2 ? 'Enter valid flat number' : 
             flatError ? 'Fix flat number error' : 
             'Complete all fields'} to enable booking
          </p>
        )}
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold text-gray-700">Important Information</span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
        
          <p>• This is a first-come-first-serve booking system</p>
          <p>• <strong>One flat can only book one aarti</strong> (except 000 for Mandal Aarti)</p>
          <p>• Please be punctual</p>
         <hr className="max-w-md mx-auto"/>
          <p className='font-semibold'> Team UtsavAnand 💖</p>
        </div>
      </div>
    </form>
  )
}
