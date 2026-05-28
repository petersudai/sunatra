// Temporary diagnostic route — DELETE after debugging login issue
// Safe to expose: only shows presence/length, never actual values
export async function GET() {
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  return Response.json({
    ADMIN_EMAIL:          !!process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD_HASH:  !!process.env.ADMIN_PASSWORD_HASH,
    HASH_LENGTH:          hash.length,           // bcrypt hash should be 60 chars
    HASH_PREFIX:          hash.slice(0, 4),      // should be "$2a$"
    NEXTAUTH_SECRET:      !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL:         process.env.NEXTAUTH_URL ?? "NOT SET",
    SUNATRA_DATABASE_URL: !!process.env.SUNATRA_DATABASE_URL,
  });
}
