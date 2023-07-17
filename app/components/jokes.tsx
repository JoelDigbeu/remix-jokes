import type { Joke } from '@prisma/client'
import { Form, Link } from '@remix-run/react'

export function JokeDisplay({
  canDelete = true,
  isOwner,
  joke,
}: {
  canDelete?: boolean
  isOwner: boolean
  joke: Pick<Joke, 'content' | 'name'>
}) {
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">"{joke.name}" Permalink</Link>
      {isOwner ? (
        <Form method="post">
          <div>
            <Link to="edit" className="button mr-2 mt-4">
              {' '}
              Update joke
            </Link>
            <button
              className="button"
              disabled={!canDelete}
              name="intent"
              type="submit"
              value="delete"
            >
              Delete
            </button>
          </div>
        </Form>
      ) : null}
    </div>
  )
}
