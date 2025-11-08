import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const report = await request.json();

		// Log CSP violations for debugging
		console.warn('🚨 CSP Violation Report:', {
			timestamp: new Date().toISOString(),
			'blocked-uri': report['csp-report']?.['blocked-uri'],
			'violated-directive':
				report['csp-report']?.['violated-directive'],
			'original-policy': report['csp-report']?.['original-policy'],
			'document-uri': report['csp-report']?.['document-uri'],
			referrer: report['csp-report']?.['referrer'],
			'line-number': report['csp-report']?.['line-number'],
			'column-number': report['csp-report']?.['column-number'],
			'source-file': report['csp-report']?.['source-file'],
		});

		// In a production app, you might want to:
		// - Store violations in a database
		// - Send alerts for critical violations
		// - Aggregate violation data for analysis
		// - Filter out known false positives

		return json({ received: true }, { status: 200 });
	} catch (error) {
		console.error('Error processing CSP report:', error);
		return json({ error: 'Invalid report format' }, { status: 400 });
	}
};
