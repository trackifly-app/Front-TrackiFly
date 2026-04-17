import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        const res = await fetch(
          `${process.env.API_URL}/auth/google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: account?.providerAccountId,
              picture: user.image,
            }),
          }
        )
        if (!res.ok) return false

        const data = await res.json()
        // Guardamos el JWT del back en el objeto user (temporal)
        user.backendToken = data.token
        return true
      } catch {
        return false
      }
    },

    async jwt({ token, user }) {
      // Primera vez: guardamos el token del back
      if (user?.backendToken) {
        token.backendToken = user.backendToken
      }
      return token
    },

    async session({ session, token }) {
      // Lo exponemos en la sesión para usarlo en fetch calls
      session.backendToken = token.backendToken as string
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }