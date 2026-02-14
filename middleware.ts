import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

export const config = { 
  // We use only two clean strings here to avoid the "matcher[2]" error
  matcher: [
    "/cards/:path*", 
    "/api/cards/:path*"
  ] 
}