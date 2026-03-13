import bcrypt from "bcryptjs";
import MailerUsers from "../../utils/models/userModel";
import connectDB from "./auth/lib/connectDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";


export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const ADMIN_EMAILS = ["mailer@htbchennai.in", "test@gmail.com"];

  if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
    return res.status(403).json({ message: "Forbidden: Only admins can register new users" });
  }

  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const userExists = await MailerUsers.findOne({ email });
    if (userExists) {
      return res.status(200).json({ message: "Already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new MailerUsers({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
