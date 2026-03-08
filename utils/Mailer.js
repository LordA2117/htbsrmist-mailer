// Mailer.js - Updated to call server-side API route


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

    // Send email using the server-side API
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: email,
          subject,
          htmlContent,
          displayText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Email sent to", email);
        onEmailSent(email);
      } else {
        throw new Error(data.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email to", email, ":", error);
    }

    // Wait for 200 milliseconds before sending the next email
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
};

export default sendEmail;
