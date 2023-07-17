import {
  redirect,
  type ActionArgs,
  type LoaderArgs,
  json,
} from '@remix-run/node'
import {
  Link,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useParams,
  useRouteError,
} from '@remix-run/react'
import { prisma, badRequest, requireUserId } from '~/utils'

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return 'That joke is too short'
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return "That joke's name is too short"
  }
}

export const loader = async ({ params, request }: LoaderArgs) => {
  await requireUserId(request)

  const joke = await prisma.joke.findUnique({
    where: { id: params.jokeId },
  })

  if (!joke) {
    throw new Response('What a joke! Not found.', {
      status: 404,
    })
  }

  return json({ joke })
}

export const action = async ({ params, request }: ActionArgs) => {
  await requireUserId(request)

  const { jokeId } = params

  const form = await request.formData()
  const content = form.get('content')
  const name = form.get('name')

  if (typeof content !== 'string' || typeof name !== 'string')
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: 'Form not submitted correctly.',
    })

  const fieldErrors = {
    content: validateJokeContent(content),
    name: validateJokeName(name),
  }

  const fields = { content, name }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    })
  }

  const joke = await prisma.joke.update({
    where: { id: jokeId },
    data: fields,
  })

  return redirect(`/jokes/${joke.id}`)
}

export default function NewJokeRoute() {
  const { joke } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  return (
    <div>
      <p>Update your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name:{' '}
            <input
              type="text"
              name="name"
              defaultValue={joke?.name}
              aria-invalid={Boolean(actionData?.fieldErrors?.name)}
              aria-errormessage={
                actionData?.fieldErrors?.name ? 'name-error' : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" id="name-error" role="alert">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{' '}
            <textarea
              name="content"
              defaultValue={joke?.content}
              aria-invalid={Boolean(actionData?.fieldErrors?.content)}
              aria-errormessage={
                actionData?.fieldErrors?.content ? 'content-error' : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              id="content-error"
              role="alert"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            Update
          </button>
        </div>
      </form>
    </div>
  )
}

export function ErrorBoundary() {
  const { jokeId } = useParams()
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="error-container">Huh? What the heck is "{jokeId}"?</div>
      )
    }

    if (error.status === 401) {
      return (
        <div className="error-container">
          <p>You must be logged in to create a joke.</p>
          <Link to="/login">Login</Link>
        </div>
      )
    }
  }

  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  )
}
