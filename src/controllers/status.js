const resp = require("../modules/responses")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

exports.status = async (req, res) => {
  console.log("status route has been called")
  const postsCount = await prisma.post.count()
  const usersCount = await prisma.user.count()
  res.status(200).json({
    status: "Tout est up!",
    date: {
      serverDate: new Date(),
      serverDateFormatted: new Date().toLocaleString(),
      serverDateFormattedParis: new Date().toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      }),
    },
    stats: { postsCount, usersCount },
  })
}
