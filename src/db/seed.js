const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { user: User } = prisma

async function main() {
  await User.create({
    data: {
      firstName: 'Admin',
      lastName: 'Smith',
      email: 'admin@thomasbnt.fr',
      password: 'password',
      imageProfile: 'x',
      role: 'ADMIN',
    },
  })
}

main()
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
