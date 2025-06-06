export const csp_directives = {
	'default-src': ["'self'"],
	'script-src': [
		"'self'",
		"'unsafe-inline'",
		"'unsafe-eval'",
		"'wasm-unsafe-eval'",
	],
	'style-src': ["'self'", "'unsafe-inline'"],
	'img-src': ["'self'", 'data:'],
	'font-src': ["'self'", 'data:'],
	'connect-src': ["'self'"],
	'frame-src': ["'none'"],
	'object-src': ["'none'"],
	'base-uri': ["'self'"],
	'form-action': ["'self'"],
	'frame-ancestors': ["'none'"],
	'upgrade-insecure-requests': [],
	'report-uri': ['/api/csp-report'],
} as const;
