import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";
import { normalizeNigerianPhone } from "@/lib/utils";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    // Phone OTP — code written by /api/otp/send, verified here
    Credentials({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "OTP Code", type: "text" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ phone: z.string(), code: z.string().length(6) })
          .safeParse(credentials);
        if (!parsed.success) return null;

        const phone = normalizeNigerianPhone(parsed.data.phone);
        const { code } = parsed.data;
        const otp = await db.otpCode.findFirst({
          where: { phone, code, used: false, expires: { gt: new Date() } },
        });
        if (!otp) return null;

        await db.otpCode.update({ where: { id: otp.id }, data: { used: true } });

        const user = await db.user.upsert({
          where: { phone },
          update: { phoneVerified: new Date() },
          create: { phone, phoneVerified: new Date() },
        });

        return user;
      },
    }),

    // Email + Password
    Credentials({
      id: "email-password",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({ where: { email: parsed.data.email } });
        if (!user?.password) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});
