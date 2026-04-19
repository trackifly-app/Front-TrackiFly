import "next-auth"

declare module "next-auth" {
  interface Session {
    backendToken: string
    isNewGoogleUser: boolean
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  interface User {
    backendToken?: string
    isNewGoogleUser?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string
    isNewGoogleUser?: boolean
  }
}