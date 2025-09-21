import { getAllSlots } from '@/lib/actions'
import Link from 'next/link'
import Image from 'next/image'
import AdminPanel from './AdminPanel'

export default async function AdminPage() {
  const slots = await getAllSlots()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <div className="mb-4">
              <p className="text-lg md:text-xl opacity-90 mb-3 font-playfair">
                || Jai Mata Di ||
              </p>
              <div className="flex justify-center mb-3">
                <Image
                  src="/UtsavAnand.svg"
                  alt="Utsavanand"
                  width={350}
                  height={100}
                  className="max-w-full h-auto"
                />
              </div>
              <h2 className="text-xl md:text-2xl font-light mb-2 opacity-90 font-playfair">
                Admin Panel - Aarti Management
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Booking Portal
          </Link>
        </div>

        {/* Admin Panel */}
        <AdminPanel slots={slots} />

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Admin Access Required
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Manage Bookings
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Secure Management
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
