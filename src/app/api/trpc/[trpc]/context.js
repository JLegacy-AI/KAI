import { dbConnect } from "@/server/services/mongoose";
import { cookies } from "next/headers";
import { checkAuthByJWT } from "@/lib/serverAuthUtils";

export async function createContext({ req }) {
  try {
    await dbConnect();
    let token = cookies().get("access-token")?.value;
    if (!token) return { req };

    const authResult = await checkAuthByJWT(token);
    if (authResult.error) return { req };
    return { req, ...authResult };

  } catch (err) {
    console.log("[error@trpc_createContext]: ", err.message);
    return { req };
  }
}
