<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class VerifyEmailNotification extends Notification
{
    use Queueable;

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verify Your Email Address')
            ->line('Please click the button below to verify your email address.')
            ->action('Verify Email Address', $verificationUrl)
            ->line('If you did not create an account, no further action is required.');
    }

    protected function verificationUrl($notifiable)
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');

        $temporarySignedUrl = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );

        // Convert the backend URL to a frontend URL
        // From: http://localhost:8000/api/email/verify/1/hash?expires=...&signature=...
        // To: http://localhost:3000/verify-email?id=1&hash=hash&expires=...&signature=...

        $urlParts = parse_url($temporarySignedUrl);
        $queryParams = [];
        parse_str($urlParts['query'] ?? '', $queryParams);

        // Extract ID and Hash from the path
        // Path is /api/email/verify/{id}/{hash}
        $pathParts = explode('/', trim($urlParts['path'] ?? '', '/'));

        if (count($pathParts) < 2) {
            // Fallback if URL parsing fails for some reason
            return $frontendUrl . '/verify-email?' . ($urlParts['query'] ?? '');
        }

        $id = $pathParts[count($pathParts) - 2];
        $hash = $pathParts[count($pathParts) - 1];

        $queryString = http_build_query(array_merge([
            'id' => $id,
            'hash' => $hash,
        ], $queryParams));

        return $frontendUrl . '/verify-email?' . $queryString;
    }
}
