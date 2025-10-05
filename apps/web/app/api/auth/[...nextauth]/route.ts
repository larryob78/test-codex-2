import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.OIDC_CLIENT_ID ?? 'adtech-web',
      clientSecret: process.env.OIDC_CLIENT_SECRET ?? 'dev-secret',
      issuer: process.env.KEYCLOAK_ISSUER ?? 'http://keycloak:8080/realms/adtech'
    })
  ],
  session: { strategy: 'jwt' }
});

export { handler as GET, handler as POST };
