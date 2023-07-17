import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import stylesheet from '~/tailwind.css'
import globalLargeStylesUrl from '~/styles/global-large.css'
import globalMediumStylesUrl from '~/styles/global-medium.css'
import globalStylesUrl from '~/styles/global.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  { rel: 'stylesheet', href: globalStylesUrl },
  {
    rel: 'stylesheet',
    href: globalMediumStylesUrl,
    media: 'print, (min-width: 640px)',
  },
  {
    rel: 'stylesheet',
    href: globalLargeStylesUrl,
    media: 'screen and (min-width: 1024px)',
  },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
