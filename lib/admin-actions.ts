'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'

export async function deleteBooking(bookingId: string) {
  try {
    console.log('Attempting to delete booking:', bookingId)
    
    // Delete the booking
    await prisma.booking.delete({
      where: { id: bookingId }
    })

    console.log('Booking deleted successfully')

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath('/view-aarti')
    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('Error deleting booking:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      bookingId
    })
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete booking. Please try again.' 
    }
  }
}

export async function updateBooking(bookingId: string, formData: {
  name: string
  flat: string
  phone: string
}) {
  try {
    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        name: formData.name,
        flat: formData.flat,
        phone: formData.phone
      }
    })

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath('/view-aarti')
    revalidatePath('/admin')

    return { success: true, booking: updatedBooking }
  } catch (error) {
    console.error('Error updating booking:', error)
    return { success: false, error: 'Failed to update booking. Please try again.' }
  }
}

export async function getAllBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        slot: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return bookings
  } catch (error) {
    console.error('Error fetching bookings:', error)
    throw new Error('Failed to fetch bookings')
  }
}
