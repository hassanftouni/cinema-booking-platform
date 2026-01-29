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
            \Log::info('Entering TenantMiddleware for: ' . $request->fullUrl());

            // Simple check for X-Tenant-ID header for now.
            // In production, this would likely also check subdomains or API keys.

            $tenantId = $request->header('X-Tenant-ID');

            if (!$tenantId) {
                \Log::warning('X-Tenant-ID header is missing');
                // For now, let's not block if it's missing, just log it. 
                // In production you might want: return response()->json(['message' => 'Missing header'], 400);
            }

            // Store tenant ID in a singleton or request attribute for later use
            // e.g. Context::set('tenant_id', $tenantId);
            $request->attributes->set('tenant_id', $tenantId);

            return $next($request);
        } catch (\Throwable $e) {
            \Log::error('TenantMiddleware CRASH: ' . $e->getMessage());
            return response()->json(['error' => 'Middleware Error', 'message' => $e->getMessage()], 500);
        }
    }
}
