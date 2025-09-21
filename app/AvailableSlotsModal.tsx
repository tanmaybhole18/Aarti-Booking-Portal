'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SlotWithBookings } from '@/lib/actions'

interface AvailableSlotsModalProps {
  slots: SlotWithBookings[]
}

export default function AvailableSlotsModal({ slots }: AvailableSlotsModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Filter only available slots
  const availableSlots = slots.filter(slot => slot.bookings.length < slot.capacity)

  // Group available slots by date
  const availableSlotsByDate = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = []
    }
    acc[slot.date].push(slot)
    return acc
  }, {} as Record<string, typeof availableSlots>)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusColor = (bookedCount: number, capacity: number) => {
    if (bookedCount === 0) {
      return 'bg-green-100 text-green-800 border-green-200'
    } else if (bookedCount < capacity) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    } else {
      return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getStatusText = (bookedCount: number, capacity: number) => {
    if (bookedCount === 0) {
      return 'Available'
    } else if (bookedCount < capacity) {
      return `Booked ${bookedCount}/${capacity}`
    } else {
      return 'Full'
    }
  }

  return (
    <>
      {/* Modal Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
      >
        Show Available Slots
      </button>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-playfair">Available Slots</h2>
                  <p className="text-green-100 mt-1">
                    {availableSlots.length} slots available for booking
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {Object.keys(availableSlotsByDate).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Available Slots</h3>
                  <p className="text-gray-600">All slots are currently booked. Please check back later.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(availableSlotsByDate).map(([date, dateSlots]) => (
                    <div key={date}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 font-playfair">
                        {formatDate(date)}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dateSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {slot.time}
                              </h4>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(slot.bookings.length, slot.capacity)}`}>
                                {getStatusText(slot.bookings.length, slot.capacity)}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-4">
                              🌆 Evening Aarti • {slot.time === 'First Aarti' ? '6:00 PM - 7:00 PM' : '7:00 PM - 8:00 PM'}
                            </div>

                            {slot.bookings.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-2">
                                  Current bookings ({slot.bookings.length}/{slot.capacity}):
                                </p>
                                <div className="space-y-1">
                                  {slot.bookings.map((booking, index) => (
                                    <div key={booking.id} className="text-xs text-gray-600">
                                      {index + 1}. {booking.name} (Flat {booking.flat})
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <Link
                              href={`/book/${slot.id}`}
                              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-all duration-200 text-center block"
                            >
                              Book This Slot
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  )
}
