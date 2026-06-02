import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder_for_build");

const fromAddress = "Skillora <onboarding@resend.dev>";

export async function sendWelcomeEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[MAIL MOCK] Welcome email sent to ${to} (Name: ${name})`);
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from: fromAddress,
      to,
      subject: "Welcome to Skillora! 🎓",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #6366f1;">Welcome to Skillora, ${name}!</h2>
          <p>We are thrilled to have you join our global community of learners and educators.</p>
          <p>Whether you're looking to acquire new skills or share your expertise, Skillora provides all the tools you need to succeed.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
          </div>
          <p style="color: #71717a; font-size: 14px;">If you have any questions, feel free to reply directly to this email.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { error };
  }
}

export async function sendPurchaseConfirmation(to: string, name: string, courseTitle: string, price: number) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[MAIL MOCK] Purchase confirmation sent to ${to} (Name: ${name}, Course: ${courseTitle}, Price: $${price})`);
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from: fromAddress,
      to,
      subject: `Order Confirmed: ${courseTitle} 💳`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #6366f1;">Purchase Confirmed!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for your purchase. You now have full lifetime access to <strong>${courseTitle}</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr style="border-bottom: 1px solid #eaeaea;">
              <th style="text-align: left; padding: 8px 0;">Item</th>
              <th style="text-align: right; padding: 8px 0;">Price</th>
            </tr>
            <tr>
              <td style="padding: 8px 0;">${courseTitle}</td>
              <td style="text-align: right; padding: 8px 0;">$${price.toFixed(2)}</td>
            </tr>
          </table>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Start Learning</a>
          </div>
          <p style="color: #71717a; font-size: 14px;">A receipt has been generated. You can view all invoice records in your student profile transaction logs.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send purchase email:", error);
    return { error };
  }
}

export async function sendCertificateEmail(to: string, name: string, courseTitle: string, certId: string) {
  const certUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/certificates/${certId}`;
  if (!process.env.RESEND_API_KEY) {
    console.log(`[MAIL MOCK] Certificate email sent to ${to} (Name: ${name}, Course: ${courseTitle}, URL: ${certUrl})`);
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from: fromAddress,
      to,
      subject: `Congratulations on your graduation! 🎉`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; text-align: center;">
          <h1 style="color: #6366f1; margin-bottom: 20px;">Course Completed!</h1>
          <p style="font-size: 16px;">Congratulations, <strong>${name}</strong>!</p>
          <p>You have successfully completed <strong>${courseTitle}</strong> and passed all curriculum requirements.</p>
          <p>Your official verifiable certificate is now available online.</p>
          <div style="margin: 30px 0;">
            <a href="${certUrl}" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Verified Certificate</a>
          </div>
          <p style="color: #a1a1aa; font-size: 12px; margin-top: 20px;">Credential Verification ID: ${certId}</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send certificate email:", error);
    return { error };
  }
}
