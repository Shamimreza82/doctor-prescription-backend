
export const verifyEmailTemplate = (link: string)=> {
 return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      }
      .header {
        background-color: #2563eb;
        padding: 20px;
        text-align: center;
        color: #ffffff;
      }
      .content {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        margin: 20px 0;
        padding: 12px 24px;
        background-color: #2563eb;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        padding: 20px;
        font-size: 12px;
        color: #777777;
        text-align: center;
        background-color: #fafafa;
      }
      .expire {
        color: #dc2626;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Email Verification</h2>
      </div>

      <div class="content">
        <p>Hello,</p>

        <p>
          Thank you for registering. Please confirm your email address by clicking
          the button below:
        </p>

        <p style="text-align: center;">
          <a href="${link}" class="button">Verify Email</a>
        </p>

        <p>
          This verification link is valid for
          <span class="expire">15 minutes</span>.
          If the link expires, you will need to request a new one.
        </p>

        <p>
          If you did not create an account, please ignore this email.
        </p>

        <p>Best regards,<br />Your Team</p>
      </div>

      <div class="footer">
        <p>
          © {{YEAR}} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
`
}