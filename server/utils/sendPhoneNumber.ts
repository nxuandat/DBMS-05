import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

interface ISendPhoneNumberOptions {
  phoneNumber: string;
  data: any;
}

export async function sendPhoneNumber(options: ISendPhoneNumberOptions) {
  const { phoneNumber, data } = options;

  try {
    await client.messages.create({
      body: `Your verification code is ${data.activationCode}`,
      from: '+18339962987', // replace with your Twilio number
      to: phoneNumber
    });
    console.log("send sms succesfully");
  } catch (error:any) {
    console.error(`Failed to send SMS: ${error.message}`);
    throw error; // re-throw the error so it can be handled by the caller
  }
 
  
}


