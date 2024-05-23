import { cookies } from "next/headers";

export function checkIsAdminByCookies() {
    if (
      cookies().get("is-admin")?.value == "true" &&
      cookies().get("access-token")?.value
    ) {
      return true;
    }
    return false;
  }
  
  export function checkIsUserByCookies() {
    if (
      cookies().get("access-token")?.value &&
      cookies().get("is-admin")?.value !== "true"
    ) {
      return true;
    }
    return false;
  }