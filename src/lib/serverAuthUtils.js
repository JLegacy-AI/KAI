import jwt from "jsonwebtoken";
import { ADMIN_JWT_SECRET, USER_JWT_SECRET } from "@/lib/constants";
import userModel from "@/server/models/user.model";
import { cookies } from "next/headers";

export function signUserJWT(userId) {
  const token = jwt.sign({ userId }, USER_JWT_SECRET, { expiresIn: "12h" });
  return token;
}

export function signAdminJWT() {
  const token = jwt.sign({ isAdmin: true }, ADMIN_JWT_SECRET, {
    expiresIn: "12h",
  });
  return token;
}

export function verifyUserJWT(token) {
  try {
    const decoded = jwt.verify(token, USER_JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function verifyAdminJWT(token) {
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function setAuthCookies(token, isAdmin = false) {
  cookies().set({
    name: "access-token",
    value: token,
    httpOnly: true,
    maxAge: 12 * 60 * 60, // 12 hours
  });
  if (isAdmin) {
    cookies().set({
      name: "is-admin",
      value: "true",
      httpOnly: true,
      maxAge: 12 * 60 * 60, // 12 hours
    });
  }else {
    cookies().set({
      name: "is-admin",
      value: "false",
      httpOnly: true,
      maxAge: 12 * 60 * 60, // 12 hours
    });
  }
}

export function clearAuthCookies() {
  cookies().delete("access-token");
  cookies().delete("is-admin");
}



export async function checkAuthByJWT(token, getUser = true) {
  try {
    let decoded = verifyAdminJWT(token);
    if (decoded) return { isAdmin: true };

    // Verify the token for user
    decoded = verifyUserJWT(token);
    if (!getUser) return { userId: decoded.userId };
    // get the user from the database
    let user = await userModel.findById(decoded.userId);
    if (!user) return { error: "User not found" };
    return { user };
  } catch (err) {
    console.log("Error: ", err.message);
    return { error: "Invalid token" };
  }
}
