import "next-auth"

declare module "next-auth" {
  interface Session {
    isNewGoogleUser: boolean
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  interface User {
    isNewGoogleUser?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isNewGoogleUser?: boolean
    role?: string
  }
}