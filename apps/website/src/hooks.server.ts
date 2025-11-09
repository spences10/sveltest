import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { csp_directives } from './csp-directives';

// Handle function for security headers
export const handle_security_headers: Handle = async ({
	event,
	resolve,
}) => {
	const response = await resolve(event);
	const headers = new Headers(response.headers);

	// Basic security headers
	headers.set('X-Frame-Options', 'SAMEORIGIN');
	headers.set('X-Content-Type-Options', 'nosniff');
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	headers.set(
		'Permissions-Policy',
		'camera=(), microphone=(), geolocation=()',
	);

	// Build CSP directive string
	const csp_directive_string = Object.entries(csp_directives)
		.map(([key, values]) => {
			if (values.length === 0) {
				return key; // For directives like 'upgrade-insecure-requests'
			}
			return `${key} ${values.join(' ')}`;
		})
		.join('; ');

	headers.set('Content-Security-Policy', csp_directive_string);

	return new Response(response.body, {
		headers,
		status: response.status,
		statusText: response.statusText,
	});
};

// Handle function for error handling
export const handle_errors: Handle = async ({ event, resolve }) => {
	try {
		return await resolve(event);
	} catch (err: any) {
		// In a real app, you'd want proper logging here
		console.error('Request handler error:', {
			message: err.message,
			stack: err.stack,
			path: event.url.pathname,
			method: event.request.method,
		});

		throw err;
	}
};

// Combine all handle functions in sequence
export const handle = sequence(
	handle_security_headers,
	handle_errors,
);
