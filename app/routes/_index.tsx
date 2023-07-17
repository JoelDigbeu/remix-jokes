import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => [{ title: "Remix Jokes" }];

export default function Index() {
  return <div>Hello Index Route</div>;
}
