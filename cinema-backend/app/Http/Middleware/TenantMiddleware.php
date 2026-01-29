<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $tenantId = $request->header('X-Tenant-ID');

            if (!$tenantId) {
                // For now, let's not block if it's missing, just log it. 
                // In production you might want: return response()->json(['message' => 'Missing header'], 400);
            }

            $request->attributes->set('tenant_id', $tenantId);

            return $next($request);
        } catch (\Throwable $e) {
            \Log::error('TenantMiddleware CRASH: ' . $e->getMessage());
            return response()->json(['error' => 'Middleware Error', 'message' => $e->getMessage()], 500);
        }
    }
}
