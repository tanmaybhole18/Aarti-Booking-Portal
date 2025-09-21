'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'

export interface SlotWithBookings {
  id: string
  date: string
  time: string
  capacity: number
  bookings: {
    id: string
    name: string
    flat: string
    phone: string
    createdAt: Date
  }[]
}

export async function getAllSlots(): Promise<SlotWithBookings[]> {
  try {
    console.log('Fetching slots from database...')
    const slots = await prisma.aartiSlot.findMany({
      include: {
        bookings: true
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    })
    console.log('Fetched slots:', slots.length)
    return slots
  } catch (error) {
    console.error('Error fetching slots:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown'
    })
    // Return empty array instead of throwing to prevent page crash
    return []
  }
}

export async function getSlotById(slotId: string): Promise<SlotWithBookings | null> {
  try {
    const slot = await prisma.aartiSlot.findUnique({
      where: { id: slotId },
      include: {
        bookings: true
      }
    })
    return slot
  } catch (error) {
    console.error('Error fetching slot:', error)
    throw new Error('Failed to fetch slot')
  }
}

export async function bookSlot(
  slotId: string,
  formData: {
    name: string
    flat: string
    phone: string
  }
) {
  try {
    // Check if slot exists and get current booking count
    const slot = await prisma.aartiSlot.findUnique({
      where: { id: slotId },
      include: { bookings: true }
    })

    if (!slot) {
      return { success: false, error: 'Slot not found' }
    }

    // Check if slot is at capacity
    if (slot.bookings.length >= slot.capacity) {
      return { success: false, error: 'Slot Full' }
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        name: formData.name,
        flat: formData.flat,
        phone: formData.phone,
        slotId: slotId
      }
    })

    // Revalidate the homepage to show updated slot status
    revalidatePath('/')
    revalidatePath(`/book/${slotId}`)

    return { success: true, booking }
  } catch (error) {
    console.error('Error booking slot:', error)
    return { success: false, error: 'Failed to book slot. Please try again.' }
  }
}
