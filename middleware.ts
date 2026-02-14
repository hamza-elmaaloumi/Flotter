import middleware from "next-auth/middleware";

export default middleware;

export const config = {
  matcher: ['/', '/cards/:path*'] // safe way to protect / and all /cards routes
};