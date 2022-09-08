const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const {hash} = require("bcrypt");

prisma.user.create({
    data: {
        email: email,
        password: await hash.gen(password),
        firstName: firstName,
        lastName: lastName
    },
})
