import AWS from "aws-sdk";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);

    // Only authenticated users can send emails
    if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { from, to, subject, htmlContent, displayText } = req.body;

    if (!from || !to || !subject || (!htmlContent && !displayText)) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Configure AWS SES with server-side environment variables
    AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const sesv2 = new AWS.SES({ apiVersion: "2019-09-27" });

    try {
        const result = await sesv2
            .sendEmail({
                Source: from,
                Destination: { ToAddresses: [to] },
                Message: {
                    Body: {
                        Html: { Charset: "UTF-8", Data: htmlContent },
                        Text: { Charset: "UTF-8", Data: displayText },
                    },
                    Subject: { Charset: "UTF-8", Data: subject },
                },
            })
            .promise();

        return res.status(200).json({ message: "Email sent successfully", sesResponse: result });
    } catch (error) {
        console.error("SES Send Error:", error);
        return res.status(500).json({ message: error.message || "Failed to send email" });
    }
}
