// emailService.js
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

const sesv2 = new AWS.SES({ apiVersion: "2019-09-27" });

const sendEmail = async (
  from,
  subject,
  htmlContent,
  displayText,
  jsonContent,
  onEmailSent
) => {
  // Check if jsonContent is defined
  if (!jsonContent) {
    console.error("JSON content is not defined.");
    return;
  }

  // Extract emails from the JSON content
  const emails = jsonContent.map((item) => item.email);

  // Iterate through each email
  for (const email of emails) {
    console.log("Debug: Email to be sent:", email);

    // Send email using SES
    try {
      const result = await sesv2
        .sendEmail({
          Source: from,
          Destination: { ToAddresses: [email] },
          Message: {
            Body: {
              Html: { Charset: "UTF-8", Data: htmlContent },
              Text: { Charset: "UTF-8", Data: displayText },
            },
            Subject: { Charset: "UTF-8", Data: subject },
          },
        })
        .promise();

      console.log("Email sent to", email);
      console.log("SES Response:", result);
      onEmailSent(email);
    } catch (error) {
      console.error("Error sending email to", email, ":", error);
    }

    // Wait for 200 milliseconds before sending the next email
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
};

export default sendEmail;
