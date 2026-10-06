import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      await prisma.user.upsert({
        where: { email: user.email.toLowerCase() },
        update: {
          name: user.name,
          image: user.image,
        },
        create: {
          email: user.email.toLowerCase(),
          name: user.name,
          image: user.image,
          emailVerified: new Date(),
        },
      });

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const databaseUser = user.email
          ? await prisma.user.findUnique({
              where: { email: user.email.toLowerCase() },
              select: { id: true },
            })
          : null;

        if (databaseUser) {
          token.id = databaseUser.id;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }

      return session;
    },

    authorized({ auth }) {
      return !!auth?.user;
    },
  },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { password } = parsed.data;
        const email = parsed.data.email.toLowerCase();

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          password,
          user.password,
        );

        if (!passwordMatch) {
          return null;
        }

        if (!user.emailVerified) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
});