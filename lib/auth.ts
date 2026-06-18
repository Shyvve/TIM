export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomUUID()
  const data = new TextEncoder().encode(salt + password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${salt}:${hex}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, storedHash] = stored.split(':')
  const data = new TextEncoder().encode(salt + password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
  return hex === storedHash
}

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16)
}
