import { redirect } from "@remix-run/node";
import type { UserSession } from "~/presentation/session/userSession";

// Currently, login is handled entirely on the client using `useLogin` and
// sessionStorage, so there is no server-side cookie session to check here.
// For now, any route that calls `requireUser` will simply redirect to /logIn
// if the user is not known on the server.
export async function requireUser(_request: Request): Promise<UserSession> {
  throw redirect("/logIn");
}

export async function requireManager(request: Request) {
  const user = await requireUser(request);

  if (user.title.toLowerCase() !== "manager") {
    throw new Response("Forbidden", { status: 403 });
  }

  return user;
}



