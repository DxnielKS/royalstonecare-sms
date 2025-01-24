import NextAuth from "next-auth/next";
import { options } from "../[...nextauth]/options"

const handler = NextAuth(options)

export { handler as GET, handler as POST}