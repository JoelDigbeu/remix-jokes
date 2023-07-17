import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  const user = await createDefaultUser()

  await Promise.all(
    getJokes().map((joke) =>
      prisma.joke.create({
        data: {
          ...joke,
          jokester: {
            connect: {
              id: user.id,
            },
          },
        },
      }),
    ),
  )

  console.log(`Database has been seeded. 🌱`)
}

async function createDefaultUser() {
  const userData = {
    username: 'jowell',
    passwordHash: await bcrypt.hash('azertyuiop', 10),
  }

  return prisma.user.create({ data: userData })
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

function getJokes() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: 'Road worker',
      content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
    },
    {
      name: 'Frisbee',
      content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
    },
    {
      name: 'Trees',
      content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
    },
    {
      name: 'Skeletons',
      content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
    },
    {
      name: 'Hippos',
      content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
    },
    {
      name: 'Dinner',
      content: `What did one plate say to the other plate? Dinner is on me!`,
    },
    {
      name: 'Elevator',
      content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
    },
  ]
}
