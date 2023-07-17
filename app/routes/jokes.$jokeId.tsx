import {
  type ActionArgs,
  json,
  redirect,
  type LoaderArgs,
} from '@remix-run/node'
import {
  Link,
  useLoaderData,
  useParams,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react'
import { getUserId, prisma } from '~/utils'

export const loader = async ({ params, request }: LoaderArgs) => {
  const currentUserId = await getUserId(request)

  const joke = await prisma.joke.findUnique({
    where: { id: params.jokeId },
  })

  if (!joke) {
    throw new Response('What a joke! Not found.', {
      status: 404,
    })
  }

  return json({ joke, isOwner: currentUserId === joke.jokesterId })
}

export const action = async ({ params, request }: ActionArgs) => {
  const form = await request.formData()

  if (form.get('intent') !== 'delete') {
    throw new Response(`The intent ${form.get('intent')} is not supported`, {
      status: 400,
    })
  }

  const joke = await prisma.joke.findUnique({
    where: { id: params.jokeId },
  })
  if (!joke) {
    throw new Response("Can't delete what does not exist", {
      status: 404,
    })
  }

  await prisma.joke.delete({ where: { id: params.jokeId } })
  return redirect('/jokes')
}

export default function JokeRoute() {
  const { joke, isOwner } = useLoaderData<typeof loader>()

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">"{joke.name}" Permalink</Link>
      {isOwner ? (
        <form method="post">
          <button className="button" name="intent" type="submit" value="delete">
            Delete
          </button>
        </form>
      ) : null}
    </div>
  )
}

export function ErrorBoundary() {
  const { jokeId } = useParams()
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return (
        <div className="error-container">
          What you're trying to do is not allowed.
        </div>
      )
    }

    if (error.status === 404) {
      return (
        <div className="error-container">Huh? What the heck is "{jokeId}"?</div>
      )
    }
  }

  return (
    <div className="error-container">
      There was an error loading joke by the id "${jokeId}". Sorry.
    </div>
  )
}
