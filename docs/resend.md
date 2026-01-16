# Resend Email Service Integration

This document describes the integration of [Resend](https://resend.com/) as the email service provider for the CanAccesible application.

---

## Overview

Resend is a modern email API service that allows developers to send transactional emails easily. In our application, we use Resend for:

- **Login notifications** - Alert users when a login is detected on their account
- **Password recovery** - Send password reset links to users
- **Password change confirmations** - Notify users when their password has been updated

---

## Current Plan

We are currently using the **Free Plan** which includes:

| Limit          | Amount             |
| -------------- | ------------------ |
| Daily emails   | 100 emails/day     |
| Monthly emails | 3,000 emails/month |

> 💡 For higher volume needs, consider upgrading to a paid plan. See [Resend Pricing](https://resend.com/pricing) for more details.

---

## Installation

The Resend SDK was installed via npm:

```bash
npm install resend
```

**Package version:** `^6.7.0`

---

## Configuration

### 1. Environment Variable

Add your Resend API key to the `.env` file:

```env
RESEND_API=re_xxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Important:** Never commit your API key to version control. Make sure `.env` is included in your `.gitignore` file.

### 2. Resend Client Setup

The Resend client is configured in `backend/config/resend.js`:

```javascript
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API);

module.exports = resend;
```

---

## Usage

### Importing the Client

```javascript
const resend = require("../config/resend");
```

### Sending Emails

The basic structure for sending an email:

```javascript
const { data, error } = await resend.emails.send({
  from: "noreply@canaccesible.es",
  to: [recipient@example.com],
  subject: "Email Subject",
  html: `<h2>Hello!</h2><p>Your HTML content here.</p>`,
});

if (error) {
  console.error("Resend error:", error);
}
```

---

## Implementation Examples

### 1. Login Notification Email

When a user successfully logs in, an email notification is sent asynchronously:

```javascript
setImmediate(async () => {
  try {
    const { data, error } = await resend.emails.send({
      from: "noreply@canaccesible.es",
      to: [user.email],
      subject: "Login detected",
      html: `
        <h2>Hello ${user.firstName},</h2>
        <p>We have detected a recent login to your account.</p>
        <p>If this was you, no action is needed.</p>
        <p>If you don't recognize this login, we recommend changing your password immediately.</p>
      `,
    });

    if (error) {
      console.error("[MAIL] Resend error:", error);
    }
  } catch (emailError) {
    console.error("[MAIL] Send error:", emailError);
  }
});
```

> **Note:** We use `setImmediate()` to send emails asynchronously without blocking the response to the user.

### 2. Password Reset Email

For password recovery, we generate a token and send a reset link:

```javascript
const resetToken = crypto.randomBytes(32).toString("hex");
const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

const { error } = await resend.emails.send({
  from: "CANACCESIBLE <onboarding@resend.dev>",
  to: [user.email],
  subject: "Password Recovery",
  html: `
    <h2>Hello ${user.firstName},</h2>
    <p>You have requested to reset your password.</p>
    <p>Click the following link to continue:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
  `,
});
```

### 3. Password Change Confirmation

After a successful password change, a confirmation email is sent:

```javascript
setImmediate(async () => {
  try {
    await resend.emails.send({
      from: "noreply@canaccesible.es",
      to: [user.email],
      subject: "Password Updated",
      html: `
        <h2>Hello ${user.firstName},</h2>
        <p>Your password has been successfully updated.</p>
        <p>If you did not perform this action, please contact support immediately.</p>
      `,
    });
  } catch (error) {
    console.error("[MAIL] Error sending confirmation:", error);
  }
});
```

---

## Email Sender Addresses

| Use Case                     | From Address                           |
| ---------------------------- | -------------------------------------- |
| Login notifications          | `noreply@canaccesible.es`              |
| Password reset               | `CANACCESIBLE <onboarding@resend.dev>` |
| Password change confirmation | `noreply@canaccesible.es`              |

> **Note:** To use a custom domain (e.g., `@canaccesible.es`), you must verify the domain in your Resend dashboard.

---

## Domain Verification (Production)

To send emails from your own domain instead of `@resend.dev`:

1. Log in to your [Resend Dashboard](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain (e.g., `canaccesible.es`)
4. Add the provided DNS records (SPF, DKIM, DMARC) to your domain
5. Wait for verification (usually takes a few minutes)
6. Update the `from` address in your code to use your verified domain

---

## Error Handling

Always handle potential errors when sending emails:

```javascript
try {
  const { data, error } = await resend.emails.send({ ... });

  if (error) {
    console.error("[MAIL] Resend error:", error);
    // Handle the error appropriately
  } else {
    console.log("[MAIL] Email sent successfully:", data);
  }
} catch (emailError) {
  console.error("[MAIL] Send error:", emailError);
}
```

---

## Best Practices

1. **Asynchronous Sending**: Use `setImmediate()` for non-critical emails to avoid blocking API responses
2. **Error Logging**: Always log errors for debugging and monitoring
3. **Environment Variables**: Keep API keys in environment variables, never hardcode them
4. **HTML Templates**: Use proper HTML formatting for better email rendering across clients
5. **Personalization**: Include user's name in emails for a better experience

---

## Troubleshooting

| Issue                       | Solution                                                |
| --------------------------- | ------------------------------------------------------- |
| `Resend API key is missing` | Ensure `RESEND_API` is set in your `.env` file          |
| Emails not being received   | Check spam folder; verify domain if using custom domain |
| `from` address rejected     | Use `@resend.dev` domain or verify your custom domain   |
| Rate limiting errors        | Check Resend's rate limits for your plan                |

---

## Resources

- [Resend Documentation](https://resend.com/docs)
- [Domain Verification Guide](https://resend.com/docs/dashboard/domains/introduction)
- [API Reference](https://resend.com/docs/api-reference/emails/send-email)