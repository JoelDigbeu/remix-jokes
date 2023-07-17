import { redirect, type ActionArgs } from '@remix-run/node'
import { prisma } from '~/db.server'
import { isString } from '~/utils'

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData()
  const content = form.get('content')
  const name = form.get('name')

  if (!isString(content) || !isString(name))
    throw new Error('Form not submitted correctly.')

  const fields = { content, name }

  const joke = await prisma.joke.create({ data: fields })
  return redirect(`/jokes/${joke.id}`)
}

export default function NewJokeRoute() {
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  )
}
