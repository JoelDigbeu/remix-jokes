import bcrypt from 'bcryptjs'

import { prisma } from '~/utils/db.server'

type AuthForm = {
  password: string
  username: string
}

export async function login({ password, username }: AuthForm) {
  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) return null

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isCorrectPassword) return null

  return { id: user.id, username }
}

export async function register({ password, username }: AuthForm) {
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: await bcrypt.hash(password, 10),
    },
  })

  return { id: user.id, username }
}
