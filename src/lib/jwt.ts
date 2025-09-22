import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export interface UnlockTokenPayload {
  jti: string
  orderId: string
  listId: string
  email: string
  exp: number
}

export async function issueUnlockJWT(payload: {
  orderId: string
  listId: string
  email: string
}): Promise<{ token: string; jti: string; exp: number }> {
  const jti = crypto.randomUUID()
  const exp = Math.floor(Date.now() / 1000) + 10 * 60 // 10 minutes

  const token = await new SignJWT({
    jti,
    orderId: payload.orderId,
    listId: payload.listId,
    email: payload.email,
    exp,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret)

  return { token, jti, exp }
}

export async function verifyUnlockJWT(token: string): Promise<UnlockTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as UnlockTokenPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}
