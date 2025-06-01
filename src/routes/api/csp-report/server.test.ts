import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';
import { POST } from './+server';

describe('CSP Report API', () => {
	let console_warn_spy: any;
	let console_error_spy: any;

	beforeEach(() => {
		console_warn_spy = vi
			.spyOn(console, 'warn')
			.mockImplementation(() => {});
		console_error_spy = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {});
	});

	afterEach(() => {
		console_warn_spy.mockRestore();
		console_error_spy.mockRestore();
	});

	it('should handle valid CSP violation reports', async () => {
		const mock_csp_report = {
			'csp-report': {
				'blocked-uri': 'data:image/svg+xml,<svg>...</svg>',
				'violated-directive': 'img-src',
				'original-policy': "default-src 'self'; img-src 'self'",
				'document-uri': 'http://localhost:5173/todos',
				referrer: '',
				'line-number': 42,
				'column-number': 15,
				'source-file': 'http://localhost:5173/todos',
			},
		};

		const request = new Request('http://localhost/api/csp-report', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(mock_csp_report),
		});

		const response = await POST({ request } as any);
		const result = await response.json();

		expect(response.status).toBe(200);
		expect(result).toEqual({ received: true });
		expect(console_warn_spy).toHaveBeenCalledWith(
			'🚨 CSP Violation Report:',
			expect.objectContaining({
				'blocked-uri': 'data:image/svg+xml,<svg>...</svg>',
				'violated-directive': 'img-src',
				timestamp: expect.any(String),
			}),
		);
	});

	it('should handle malformed CSP reports gracefully', async () => {
		const request = new Request('http://localhost/api/csp-report', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: 'invalid json',
		});

		const response = await POST({ request } as any);
		const result = await response.json();

		expect(response.status).toBe(400);
		expect(result).toEqual({ error: 'Invalid report format' });
		expect(console_error_spy).toHaveBeenCalledWith(
			'Error processing CSP report:',
			expect.any(Error),
		);
	});

	it('should handle empty CSP reports', async () => {
		const request = new Request('http://localhost/api/csp-report', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({}),
		});

		const response = await POST({ request } as any);
		const result = await response.json();

		expect(response.status).toBe(200);
		expect(result).toEqual({ received: true });
		expect(console_warn_spy).toHaveBeenCalledWith(
			'🚨 CSP Violation Report:',
			expect.objectContaining({
				timestamp: expect.any(String),
				'blocked-uri': undefined,
				'violated-directive': undefined,
			}),
		);
	});

	it('should log all relevant CSP report fields', async () => {
		const comprehensive_report = {
			'csp-report': {
				'blocked-uri': 'https://evil.com/script.js',
				'violated-directive': 'script-src',
				'original-policy': "default-src 'self'; script-src 'self'",
				'document-uri': 'http://localhost:5173/page',
				referrer: 'http://localhost:5173/',
				'line-number': 123,
				'column-number': 45,
				'source-file': 'http://localhost:5173/page',
			},
		};

		const request = new Request('http://localhost/api/csp-report', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(comprehensive_report),
		});

		await POST({ request } as any);

		expect(console_warn_spy).toHaveBeenCalledWith(
			'🚨 CSP Violation Report:',
			expect.objectContaining({
				'blocked-uri': 'https://evil.com/script.js',
				'violated-directive': 'script-src',
				'original-policy': "default-src 'self'; script-src 'self'",
				'document-uri': 'http://localhost:5173/page',
				referrer: 'http://localhost:5173/',
				'line-number': 123,
				'column-number': 45,
				'source-file': 'http://localhost:5173/page',
				timestamp: expect.any(String),
			}),
		);
	});
});
