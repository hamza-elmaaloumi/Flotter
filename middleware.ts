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
    "/api/tts/:path*",
    "/api/ai/:path*",
    "/api/xp/:path*",
    "/api/profile/:path*",
    "/api/checkout/:path*",
    "/api/images/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/ranking/:path*"
  ] 
}