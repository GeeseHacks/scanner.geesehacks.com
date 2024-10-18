import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      console.log("Next URL: ", nextUrl.pathname);
      
      const isOnLoginOrSignUp = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup') || nextUrl.pathname.startsWith('/forgot-password') || nextUrl.pathname.startsWith('/reset-password');
      if (isLoggedIn && isOnLoginOrSignUp) {
        return Response.redirect(new URL('/', nextUrl));
      }
      else if (isLoggedIn || (!isLoggedIn && isOnLoginOrSignUp)) {
        return true;
      }

      return Response.redirect(new URL('/login', nextUrl));
    },
    jwt({ token, user, account, profile }) {
      if (profile && account?.provider === 'google') {
        token.id = profile.sub;
      }
      else if (profile && account?.provider === 'discord') {
        token.id = profile.id;
      }

      else if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
