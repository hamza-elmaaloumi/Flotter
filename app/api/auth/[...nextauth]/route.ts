import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Add your database logic here
        // const user = await db.user.findUnique({ where: { email: credentials.email } })
        
        // 2. Check password (use bcrypt.compare!)
        // if (user && passwordMatches) {
        //   return user; 
        // }

        // If auth fails
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login', // Redirect to your custom login page
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };