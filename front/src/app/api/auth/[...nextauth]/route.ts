import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL

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
        if (!API_URL) {
          console.error("Google sign in failed: API_URL is not configured")
          return false
        }

        const res = await fetch(`${API_URL.replace(/\/$/, "")}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            googleId: account?.providerAccountId,
            picture: user.image,
          }),
        });

        if (!res.ok) {
          const errorBody = await res.text()
          console.error("Google sign in failed:", res.status, errorBody)
          return false;
        }

        const data = await res.json() as { isNew: boolean };
        user.isNewGoogleUser = data.isNew;
        return true;
      } catch (error) {
        console.error("Google sign in callback error:", error)
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user?.isNewGoogleUser !== undefined) {
        token.isNewGoogleUser = user.isNewGoogleUser;
      }
      return token;
    },

    async session({ session, token }) {
      session.isNewGoogleUser = token.isNewGoogleUser as boolean;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
