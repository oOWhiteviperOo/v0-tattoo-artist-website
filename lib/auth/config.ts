import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const allowedUsernames = process.env.ADMIN_GITHUB_USERNAMES?.split(',').map(u => u.trim()) || []
      if (allowedUsernames.length === 0) return true // no whitelist = allow all
      return allowedUsernames.includes(profile?.login as string)
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.username = profile.login
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as Record<string, unknown>).username = token.username
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
})
