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
        // Simple check for X-Tenant-ID header for now.
        // In production, this would likely also check subdomains or API keys.

        $tenantId = $request->header('X-Tenant-ID');

        if (!$tenantId) {
            // Optional: for development, allow a default tenant or fail
            // For now, we will just proceed but log a warning or set a null tenant
            // return response()->json(['message' => 'X-Tenant-ID header is required'], 400);
        }

        // Store tenant ID in a singleton or request attribute for later use
        // e.g. Context::set('tenant_id', $tenantId);
        $request->attributes->set('tenant_id', $tenantId);

        return $next($request);
    }
}
