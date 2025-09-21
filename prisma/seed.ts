import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Navratri dates: 22/09/2025 → 01/10/2025
  const navratriDates = [
    '2025-09-22',
    '2025-09-23', 
    '2025-09-24',
    '2025-09-25',
    '2025-09-26',
    '2025-09-27',
    '2025-09-28',
    '2025-09-29',
    '2025-09-30',
    '2025-10-01'
  ]

  const timeSlots = ['First Aarti', 'Second Aarti']

  // Create all slots
  for (const date of navratriDates) {
    for (const time of timeSlots) {
      await prisma.aartiSlot.upsert({
        where: {
          date_time: {
            date,
            time
          }
        },
        update: {},
        create: {
          date,
          time
        }
      })
    }
  }

  console.log('✅ Successfully seeded 20 Navratri Aarti slots!')
  console.log('📅 Dates: 22/09/2025 → 01/10/2025')
  console.log('⏰ Time slots: First Aarti & Second Aarti')
  console.log('👥 Capacity: 2 bookings per slot')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
