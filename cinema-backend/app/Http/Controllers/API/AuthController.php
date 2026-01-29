<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            \Log::info('Registration started for email: ' . $request->email);

            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            \Log::info('Step 1: Validation passed');

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
            ]);

            \Log::info('Step 2: User created in DB with ID: ' . $user->id);

            try {
                \Log::info('Step 3: Attempting to fire Registered event...');
                event(new Registered($user));
                \Log::info('Step 4: Registered event fired successfully');
            } catch (\Throwable $e) {
                \Log::error('STEP 3 ERROR (Mail failure): ' . $e->getMessage());
                return response()->json([
                    'message' => 'Registration successful, but we could not send the verification email.',
                    'debug_mail_error' => $e->getMessage(),
                    'user' => $user,
                ], 201);
            }

            return response()->json([
                'message' => 'Registration successful. Please check your email to verify your account.',
                'user' => $user,
            ], 201);

        } catch (\Throwable $th) {
            \Log::error('CRITICAL REGISTRATION ERROR: ' . $th->getMessage());
            \Log::error($th->getTraceAsString()); // This will show us the REAL error in Railway logs
            return response()->json([
                'error_type' => 'Critical Registration Error',
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Your email address is not verified. Please check your inbox for a verification link.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
