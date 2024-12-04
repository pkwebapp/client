import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import twilio from "twilio";

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_VERIFY_SERVICE_SID) {
  throw new Error("Twilio credentials are missing");
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOtpToPhone = async (phoneNumber) => {
  const formattedPhoneNumber = phoneNumber.startsWith("+")
    ? phoneNumber
    : `+91${phoneNumber}`;
  
  try {
    const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({ to: formattedPhoneNumber, channel: "sms" });
      
  } catch (error) {
    console.error("Twilio API Error:", error);
    throw new Error("Failed to send OTP");
  }
};
