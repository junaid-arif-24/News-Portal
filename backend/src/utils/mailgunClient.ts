// mailgunClient.ts
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const DOMAIN = process.env.MAILGUN_DOMAIN as string;
const API_KEY = process.env.MAILGUN_API_KEY as string;
console.log("API_KEY in client", API_KEY);
console.log("DOMAIN in Client", DOMAIN);
const mg = mailgun.client({ username: 'api', key: API_KEY });

export default mg;
