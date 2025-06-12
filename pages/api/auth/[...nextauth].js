import NextAuth from "next-auth";
import connectDB from "./lib/connectDB";
import CredentialsProvider from "next-auth/providers/credentials";
import MailerUsers from "../../../utils/models/userModel";
import bcrypt from "bcryptjs";
connectDB();

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        const email = credentials.email;
        const password = credentials.password;
        const user = await MailerUsers.findOne({ email });
        if (!user) {
          throw new Error("You haven't registered");
        }
        if (user) {
          return signInUser({ password, user });
        }
      },
    }),
  ],
  secret: "secret",
  database: process.env.NEXT_PUBLIC_MONGODB_URI,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
});

const signInUser = async ({ password, user }) => {
  if (!user.password) {
    throw new Error("Please enter password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Password not correct");
  }
  console.log(user, "user");
  return user;
};