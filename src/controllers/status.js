const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

exports.status = async (req, res) => {
  console.log("status route has been called")
  const postsCount = await prisma.post.count()
  const usersCount = await prisma.user.count()
  const reactionsCount = await prisma.reaction.count()
  // Tout les authors
  const authors = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      imageProfile: true,
    }
  })
  res.status(200).json({
    status: "Tout est up!",
    date: {
      serverDate: new Date(),
      serverDateFormatted: new Date().toLocaleString(),
      serverDateFormattedParis: new Date().toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      }),
    },
    stats: { postsCount, usersCount, reactionsCount }
  })
}
