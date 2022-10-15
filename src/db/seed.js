const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { user: User } = prisma
const hash = require("../middlewares/hash");


async function main() {
  await User.create({
    data: {
      firstName: "Admin",
      lastName: "local",
      email: "admin@ndd.local",
      password: await hash.gen('password'),
      imageProfile: "",
      role: "ADMIN",
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
