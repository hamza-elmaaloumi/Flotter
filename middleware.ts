import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

export const config = { 
  matcher: [
    "/cards/:path*", 
    "/api/cards/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/ranking/:path*"
  ] 
}