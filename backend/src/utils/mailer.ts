import axios from 'axios';

const brevoApiKey = process.env.BREVO_API_KEY;

export const sendRegistrationWelcomeEmail = async (email: string, name: string) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { email: 'junaidarif7078@gmail.com', name: 'Shot News' },
        to: [{ email, name }],
        subject: 'Welcome to Shot News!',
        textContent: `Hello ${name},\n\nWelcome to Shot News! We're thrilled to have you with us. Get ready to explore the latest news and updates tailored just for you.\n\nBest regards,\nShot News Team`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #0044cc;">Hello ${name},</h2>
            <p>Welcome to <strong>Shot News</strong>! We're thrilled to have you with us. Get ready to explore the latest news and updates tailored just for you.</p>
            <p>Best regards,<br>Shot News Team</p>
            <hr style="border: 0; border-top: 1px solid #ccc;">
            <footer style="font-size: 0.8em; color: #888;">You are receiving this email because you signed up for Shot News.</footer>
          </div>
        `,
      },
      {
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Registration welcome email sent successfully', response.data);
  } catch (error) {
    console.error('Error sending registration welcome email:', error);
  }
};


export const sendLoginWelcomeEmail = async (email: string, name: string) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { email: 'junaidarif7078@gmail.com', name: 'Shot News' },
        to: [{ email, name }],
        subject: 'Welcome Back to Shot News!',
        textContent: `Hello ${name},\n\nWelcome back to Shot News! We're excited to see you again. Dive into the latest news and updates right now.\n\nBest regards,\nShot News Team`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #0044cc;">Hello ${name},</h2>
            <p>Welcome back to <strong>Shot News</strong>! We're excited to see you again. Dive into the latest news and updates right now.</p>
            <p>Best regards,<br>Shot News Team</p>
            <hr style="border: 0; border-top: 1px solid #ccc;">
            <footer style="font-size: 0.8em; color: #888;">You are receiving this email because you logged in to your Shot News account.</footer>
          </div>
        `,
      },
      {
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Login welcome email sent successfully', response.data);
  } catch (error) {
    console.error('Error sending login welcome email:', error);
  }
};

