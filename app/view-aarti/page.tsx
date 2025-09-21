import { getAllSlots } from '@/lib/actions'
import Link from 'next/link'
import Image from 'next/image'

export default async function ViewAartiPage() {
  const slots = await getAllSlots()


  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString)
  //   return date.toLocaleDateString('en-GB', {
  //     weekday: 'long',
  //     day: '2-digit',
  //     month: 'long',
  //     year: 'numeric'
  //   })
  // }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">
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
                Aarti Bookings View
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

        {/* Stats Cards */}
        

        {/* Aarti Schedule Table */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-200">
            <h3 className="text-xl font-semibold text-red-800 font-playfair">
              Navratri Aarti Schedule
            </h3>
            <p className="text-red-600 mt-1">
              Complete booking schedule for all Aarti sessions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-red-50">
                  <th className="px-4 py-3 text-center text-sm font-bold text-red-800 border-2 border-red-200">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-red-800 border-2 border-red-200">
                    Day
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-red-800 border-2 border-red-200">
                    First Aarti
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-red-800 border-2 border-red-200">
                    Second Aarti
                  </th>
                </tr>
              </thead>
              <tbody>
                {slots.reduce((acc, slot) => {
                  const existingRow = acc.find(row => row.date === slot.date)
                  if (existingRow) {
                    if (slot.time === 'First Aarti') {
                      existingRow.firstAarti = slot.bookings
                    } else {
                      existingRow.secondAarti = slot.bookings
                    }
                  } else {
                    acc.push({
                      date: slot.date,
                      day: new Date(slot.date).toLocaleDateString('en-GB', { weekday: 'long' }),
                      firstAarti: slot.time === 'First Aarti' ? slot.bookings : [],
                      secondAarti: slot.time === 'Second Aarti' ? slot.bookings : []
                    })
                  }
                  return acc
                }, [] as Array<{
                  date: string
                  day: string
                  firstAarti: {
                    id: string
                    name: string
                    flat: string
                    phone: string
                    createdAt: Date
                  }[]
                  secondAarti: {
                    id: string
                    name: string
                    flat: string
                    phone: string
                    createdAt: Date
                  }[]
                }>).map((row) => (
                  <tr key={row.date} className="hover:bg-red-25 transition-colors">
                    <td className="px-4 py-3 text-center text-sm font-medium text-red-800 border-2 border-red-200">
                      {new Date(row.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-red-800 border-2 border-red-200">
                      {row.day}
                    </td>
                    <td className="px-4 py-3 text-left text-sm text-red-700 border-2 border-red-200">
                      {row.firstAarti.length === 0 ? (
                        <span className="text-gray-400 italic">Available</span>
                      ) : (
                        <div className="space-y-1">
                          {row.firstAarti.map((booking) => (
                            <div key={booking.id} className="font-medium">
                              {booking.flat} - {booking.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-left text-sm text-red-700 border-2 border-red-200">
                      {row.secondAarti.length === 0 ? (
                        <span className="text-gray-400 italic">Available</span>
                      ) : (
                        <div className="space-y-1">
                          {row.secondAarti.map((booking) => (
                            <div key={booking.id} className="font-medium">
                              {booking.flat} - {booking.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              First-come-first-serve basis
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              No login required
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Secure booking system
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
