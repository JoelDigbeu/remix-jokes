import { prisma } from '~/db.server'

export class Jokes {
  public static findMany() {
    return prisma.joke.findMany()
  }
}
