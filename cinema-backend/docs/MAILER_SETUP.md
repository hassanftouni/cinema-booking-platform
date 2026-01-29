# Mailer Setup Guide

To send actual emails to users' inboxes (like Gmail), you need to configure a real mail provider in your `.env` file.

## Option 1: Using Gmail SMTP (Recommended for Personal Dev)

1. **Enable 2-Step Verification** on your Google Account if you haven't already.
2. **Generate an App Password**:
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords).
   - Select "Mail" and "Other (Custom name)".
   - Copy the 16-character password generated.
3. **Update your `.env` file**:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-character-app-password
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="your-email@gmail.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## Option 2: Using Mailtrap (Recommended for Testing)

1. Sign up at [Mailtrap.io](https://mailtrap.io).
2. Go to "Email Testing" -> "Inboxes" -> "SMTP Settings".
3. Copy the credentials provided for Laravel.
4. **Update your `.env` file**:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

---

> [!TIP]
> After updating your `.env` file, you may need to clear the config cache by running:
> `php artisan config:clear`
