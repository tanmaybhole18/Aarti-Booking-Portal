'use client'

import { useState } from 'react'
import { SlotWithBookings } from '@/lib/actions'
import { deleteBooking, updateBooking } from '../../lib/admin-actions'

interface AdminPanelProps {
  slots: SlotWithBookings[]
}

export default function AdminPanel({ slots }: AdminPanelProps) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    flat: '',
    phone: ''
  })
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert('Invalid password!')
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return
    
    setIsDeleting(bookingId)
    try {
      const result = await deleteBooking(bookingId)
      if (result.success) {
        // Don't refresh the page, just show success message
        alert('Booking deleted successfully!')
      } else {
        alert('Failed to delete booking: ' + result.error)
      }
    } catch {
      alert('Error deleting booking')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEditBooking = (booking: {
    id: string
    name: string
    flat: string
    phone: string
  }) => {
    setIsEditing(booking.id)
    setEditForm({
      name: booking.name,
      flat: booking.flat,
      phone: booking.phone
    })
  }

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '')
    // Check if it's exactly 10 digits
    return cleanPhone.length === 10
  }

  const handleUpdateBooking = async (bookingId: string) => {
    if (!editForm.name || !editForm.flat || !editForm.phone) {
      alert('Please fill in all fields')
      return
    }

    // Validate phone number
    if (!validatePhoneNumber(editForm.phone)) {
      alert('Please enter a valid 10-digit phone number')
      return
    }

    // Validate flat number (basic check - server will do detailed validation)
    if (editForm.flat.trim() === '') {
      alert('Please enter a valid flat number')
      return
    }

    setIsUpdating(bookingId)
    try {
      const result = await updateBooking(bookingId, editForm)
      if (result.success) {
        alert('Booking updated successfully!')
        setIsEditing(null)
        setEditForm({ name: '', flat: '', phone: '' })
      } else {
        alert('Failed to update booking: ' + result.error)
      }
    } catch {
      alert('Error updating booking')
    } finally {
      setIsUpdating(null)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(null)
    setEditForm({ name: '', flat: '', phone: '' })
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h3>
            <p className="text-gray-600">Enter admin password to manage Aarti bookings</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 hover:shadow-lg"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Flatten all bookings with slot information
  const allBookings = slots.flatMap(slot => 
    slot.bookings.map(booking => ({
      ...booking,
      slotDate: slot.date,
      slotTime: slot.time,
      slotCapacity: slot.capacity
    }))
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }


  return (
    <div className="space-y-8">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">20</div>
          <div className="text-gray-600">Total Slots</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {slots.filter(slot => slot.bookings.length === 0).length}
          </div>
          <div className="text-gray-600">Available</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {slots.filter(slot => slot.bookings.length > 0 && slot.bookings.length < slot.capacity).length}
          </div>
          <div className="text-gray-600">Partially Booked</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {allBookings.length}
          </div>
          <div className="text-gray-600">Total Bookings</div>
        </div>
      </div>

      {/* Bookings Management Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 font-playfair">
            Manage Bookings
          </h3>
          <p className="text-gray-600 mt-1">
            View and manage all Aarti bookings
          </p>
        </div>

        {allBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600">No bookings have been made for any Aarti slots.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resident Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flat Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aarti Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aarti Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booked On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allBookings.map((booking, index) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {isEditing === booking.id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        booking.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {isEditing === booking.id ? (
                        <input
                          type="text"
                          value={editForm.flat}
                          onChange={(e) => setEditForm({...editForm, flat: e.target.value})}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        booking.flat
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {isEditing === booking.id ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => {
                            const formatted = e.target.value.replace(/\D/g, '').slice(0, 10)
                            setEditForm({...editForm, phone: formatted})
                          }}
                          maxLength={10}
                          className={`w-full px-2 py-1 border rounded text-sm ${
                            editForm.phone.length === 10 
                              ? 'border-green-400 bg-green-50' 
                              : 'border-gray-300'
                          }`}
                          placeholder="9876543210"
                        />
                      ) : (
                        booking.phone
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(booking.slotDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {booking.slotTime}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        {isEditing === booking.id ? (
                          <>
                            <button
                              onClick={() => handleUpdateBooking(booking.id)}
                              disabled={isUpdating === booking.id}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isUpdating === booking.id ? (
                                <>
                                  <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin"></div>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Save
                                </>
                              )}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors duration-200"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditBooking(booking)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors duration-200"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              disabled={isDeleting === booking.id}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isDeleting === booking.id ? (
                                <>
                                  <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="text-center">
        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
