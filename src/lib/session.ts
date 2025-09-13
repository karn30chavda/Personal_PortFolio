
import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
const cookieName = "session";

interface SessionPayload {
  expires: Date;
}

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.log("Failed to verify session");
    return null;
  }
}

export async function setSession() {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ expires });

  cookies().set(cookieName, session, {
    expires,
    httpOnly: true,
    path: "/",
  });
}

export async function getSession(request?: NextRequest) {
  const cookieStore = request ? request.cookies : cookies();
  const sessionCookie = cookieStore.get(cookieName)?.value;

  if (!sessionCookie) {
    return null;
  }
  
  const session = await decrypt(sessionCookie);

  if (!session) {
    return null;
  }

  const isExpired = session.expires && new Date(session.expires) < new Date();

  if (isExpired) {
    return null;
  }

  return session;
}
