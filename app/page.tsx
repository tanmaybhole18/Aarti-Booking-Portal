import Link from "next/link";
import Image from "next/image";
import { getAllSlots } from "@/lib/actions";
import AvailableSlotsModal from "@/app/AvailableSlotsModal";

export default async function Home() {
  const slots = await getAllSlots();

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, typeof slots>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (bookedCount: number, capacity: number) => {
    if (bookedCount === 0) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (bookedCount < capacity) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusText = (bookedCount: number, capacity: number) => {
    if (bookedCount === 0) {
      return 'Available';
    } else if (bookedCount < capacity) {
      return `Booked ${bookedCount}/${capacity}`;
    } else {
      return 'Full';
    }
  };

  const isSlotFull = (bookedCount: number, capacity: number) => {
    return bookedCount >= capacity;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Hero Section */}
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
                Aarti Booking Portal
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Available Slots Filter */}
        <div className="flex justify-center gap-4 mb-12">
          <AvailableSlotsModal slots={slots} />
          <Link
            href="/view-aarti"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            View All Bookings
          </Link>
        </div>

        {/* Slots Grid */}
        <div className="max-w-7xl mx-auto">
          {Object.entries(slotsByDate).map(([date, dateSlots]) => (
            <div key={date} className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {formatDate(date)}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dateSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                      isSlotFull(slot.bookings.length, slot.capacity)
                        ? 'bg-white border border-red-200 shadow-sm hover:shadow-md'
                        : 'bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-orange-300'
                    }`}
                  >
                    {/* Status Indicator */}
                    <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                      slot.bookings.length === 0 ? 'bg-green-500' : 
                      slot.bookings.length < slot.capacity ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {slot.time}
                          </h3>
                        
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(slot.bookings.length, slot.capacity)}`}>
                          {getStatusText(slot.bookings.length, slot.capacity)}
                        </div>
                      </div>
                      
                      {slot.bookings.length > 0 ? (
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-sm font-medium text-gray-700 mb-3">
                              Current Bookings ({slot.bookings.length}/{slot.capacity})
                            </div>
                            <div className="space-y-3">
                              {slot.bookings.map((booking, index) => (
                                <div key={booking.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-200">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                      {index + 1}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900">{booking.name}</p>
                                      <p className="text-xs text-gray-500">Flat {booking.flat}</p>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {new Date(booking.createdAt).toLocaleDateString('en-GB', {
                                      day: '2-digit',
                                      month: 'short'
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}
                      
                      {isSlotFull(slot.bookings.length, slot.capacity) ? (
                        <div className="w-full py-4 px-6 bg-gray-100 text-gray-500 rounded-xl text-center font-medium">
                          Slot Full
                        </div>
                      ) : (
                        <Link
                          href={`/book/${slot.id}`}
                          className="group/btn relative inline-flex w-full items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-orange-700 hover:to-red-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span>Book This Slot</span>
                          <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 py-8 border-t border-gray-200">
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
  );
}
