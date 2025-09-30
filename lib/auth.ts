// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// JWT Payload Schema
const JWTPayloadSchema = z.object({
  leaderId: z.string(),
  email: z.string().email(),
  role: z.string(),
  iat: z.number(),
  exp: z.number(),
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  return new TextEncoder().encode(secret);
};

/**
 * Signs a JWT token with the provided payload
 * @param payload Data to include in the token
 * @returns Signed JWT token
 */
export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret());
}

/**
 * Verifies a JWT token
 * @param token Token to verify
 * @returns Decoded payload if valid
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return JWTPayloadSchema.parse(payload);
}

/**
 * Authenticates a request by verifying the JWT token from cookies
 * @param request NextRequest object
 * @returns Decoded payload if authenticated
 */
export async function authenticateRequest(request: NextRequest): Promise<JWTPayload> {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) throw new Error('No token provided');
  return verifyToken(token);
}

/**
 * Gets session from cookies (for Server Components)
 * @returns Decoded payload if authenticated
 */
export async function getSession(): Promise<JWTPayload | null> {
  try {
    const token = (await cookies()).get('auth-token')?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}