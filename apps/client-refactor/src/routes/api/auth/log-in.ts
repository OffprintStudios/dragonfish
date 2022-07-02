import type { RequestHandler } from "./__types/log-in";
import { BASE_URL } from "$lib/util";
import type { Account, LoginPackage } from "$lib/models/accounts";

type OutputType = { account: Account };

export const post: RequestHandler<OutputType> = async ({ request }) => {
  const data: LoginPackage | null = await fetch(
    `${BASE_URL}/auth/login`,
    { method: 'POST', body: request.body }
  ).then(response => response.json()).catch(err => {
    console.log(err);
    return null;
  });

  if (data === null) {
    return {
      status: 400,
    };
  }

  return {
    status: 200,
    body: { account: data.account },
    headers: {
      'set-cookie': `token=${data.token};HttpOnly;SameSite=Strict`,
    }
  }
}