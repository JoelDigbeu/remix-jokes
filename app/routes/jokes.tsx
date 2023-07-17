import { Link, Outlet } from '@remix-run/react'
import { json, type LinksFunction, type LoaderFunction } from '@remix-run/node'

import stylesUrl from '~/styles/jokes.css'
import { Jokes } from '~/models'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesUrl },
]

export const loader: LoaderFunction = async () => {
  return json({ jokes: await Jokes.findMany() })
}

export default function JokesRoute() {
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
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              <li>
                <Link to="some-joke-id">Hippo</Link>
              </li>
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
    </div>
  )
}
