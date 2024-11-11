import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "../../../app/_lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      // Adiciona o ID e o nome do usuário à sessão
      if (session?.user) {
        session.user.id = user.id;
        session.user.name = user.name;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async signIn({ account, profile }) {
      if (account && profile) {
        try {
          // Verifica se o usuário já existe no banco de dados pelo email
          const existingUser = await db.user.findUnique({
            where: { email: profile.email || "" },
          });

          if (!existingUser) {
            // Cria um novo usuário no banco de dados se não existir
            const newUser = await db.user.create({
              data: {
                email: profile.email || "",
                name: profile.name || "", // Salva o nome do usuário
                image: (profile as { picture?: string }).picture || "", // Tipagem mais específica para 'profile'
                accounts: {
                  create: {
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    type: account.type || "oauth", // Adiciona o tipo da conta
                    access_token: account.access_token || null,
                    refresh_token: account.refresh_token || null,
                    token_type: account.token_type || null,
                    id_token: account.id_token || null,
                    expires_at: account.expires_at || null,
                  },
                },
              },
            });
            return !!newUser;
          } else {
            // Vincula a nova conta ao usuário existente se necessário
            await db.account.upsert({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
              update: {
                access_token: account.access_token || null,
                refresh_token: account.refresh_token || null,
                token_type: account.token_type || null,
                id_token: account.id_token || null,
                expires_at: account.expires_at || null,
              },
              create: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type || "oauth", // Adiciona o tipo da conta
                access_token: account.access_token || null,
                refresh_token: account.refresh_token || null,
                token_type: account.token_type || null,
                id_token: account.id_token || null,
                expires_at: account.expires_at || null,
                userId: existingUser.id, // Vincula ao usuário existente
              },
            });
          }
        } catch (error) {
          console.error("Erro ao criar ou vincular conta:", error);
          return false;
        }
      }
      return true;
    },
  },
};

export default NextAuth(authOptions);
