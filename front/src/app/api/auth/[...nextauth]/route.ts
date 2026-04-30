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
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            googleId: account?.providerAccountId,
            picture: user.image,
          }),
        });

        if (!res.ok) return false;

        const data = await res.json() as { isNew: boolean };
        user.isNewGoogleUser = data.isNew;
        return true;
      } catch {
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