import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.adminUser.upsert({
    where: { email: 'admin@unchain.org' },
    update: {},
    create: {
      email: 'admin@unchain.org',
      password: hashedPassword,
    },
  })

  // Create sample parties
  const party1 = await prisma.party.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Winter Wonderland Party',
      date: new Date('2024-12-20T10:00:00Z'),
      location: 'Community Center, Johannesburg',
      description: 'A magical Christmas party for children from local shelters',
    },
  })

  const party2 = await prisma.party.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Santa\'s Workshop Celebration',
      date: new Date('2024-12-22T14:00:00Z'),
      location: 'Town Hall, Cape Town',
      description: 'Join us for crafts, games, and holiday cheer',
    },
  })

  // Create sample children
  const child1 = await prisma.child.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Thabo',
      age: 8,
      partyId: party1.id,
    },
  })

  const child2 = await prisma.child.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Lerato',
      age: 6,
      partyId: party1.id,
    },
  })

  const child3 = await prisma.child.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Sipho',
      age: 10,
      partyId: party2.id,
    },
  })

  // Create wishlist items
  await prisma.wishlistItem.createMany({
    data: [
      { childId: child1.id, text: 'A new bicycle' },
      { childId: child1.id, text: 'Coloring books' },
      { childId: child2.id, text: 'Dolls and accessories' },
      { childId: child2.id, text: 'Warm winter coat' },
      { childId: child3.id, text: 'Soccer ball' },
      { childId: child3.id, text: 'Puzzle games' },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })