import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getSlotById } from '@/lib/actions'
import BookingForm from '@/app/book/[slotId]/BookingForm'

interface PageProps {
  params: {
    slotId: string
  }
}

export default async function BookSlotPage({ params }: PageProps) {
  const { slotId } = await params
  const slot = await getSlotById(slotId)

  if (!slot) {
    notFound()
  }

  if (slot.bookings.length >= slot.capacity) {
    redirect('/')
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center text-white">
          
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
              Book Aarti Slot
            </h1>
            <p className="text-lg opacity-90">
              Reserve your sacred moment
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Slot Info Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">
                    🌆
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {formatDate(slot.date)}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {slot.time}
                  </p>
                </div>
              </div>
             
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <BookingForm slotId={slot.id} />
          </div>

          {/* Back Link */}
                  <div className="text-center mt-8">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 group"
                    >
                      <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to all slots
                    </Link>
                  </div>
        </div>
      </div>
    </div>
  )
}
