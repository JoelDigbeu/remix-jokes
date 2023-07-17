import { Form, Link, Outlet, useLoaderData } from '@remix-run/react'

import { json, type LoaderArgs, type LinksFunction } from '@remix-run/node'
import { getAuthenticatedUser, prisma } from '~/utils'

import stylesUrl from '~/styles/jokes.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesUrl },
]

export const loader = async ({ request }: LoaderArgs) => {
  const jokes = await prisma.joke.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true },
    take: 5,
  })

  const currentUser = await getAuthenticatedUser(request)

  return json({ jokes, currentUser })
}

export default function JokesRoute() {
  const { jokes, currentUser } = useLoaderData<typeof loader>()

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {currentUser ? (
            <div className="user-info">
              <span>{`Hi ${currentUser.username}`}</span>
              <Form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </Form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {jokes.map(({ id, name }) => (
                <li key={id}>
                  <Link to={id}>{name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
      <footer className="jokes-footer">
        <div className="container">
          <Link reloadDocument to="/jokes.rss">
            RSS
          </Link>
        </div>
      </footer>
    </div>
  )
}
