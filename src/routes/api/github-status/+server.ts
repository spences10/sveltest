import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface GitHubStatus {
	unit_tests: {
		status: 'passing' | 'failing' | 'unknown';
		badge_url: string;
	};
	e2e_tests: {
		status: 'passing' | 'failing' | 'unknown';
		badge_url: string;
	};
}

const GITHUB_REPO = 'spences10/sveltest';
const UNIT_TESTS_WORKFLOW = 'unit-tests.yaml';
const E2E_WORKFLOW = 'e2e.yaml';

const get_workflow_status = async (
	workflow_file: string,
): Promise<'passing' | 'failing' | 'unknown'> => {
	try {
		// GitHub Actions API endpoint to get workflow runs
		const api_url = `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${workflow_file}/runs?per_page=1&status=completed`;

		const response = await fetch(api_url, {
			headers: {
				Accept: 'application/vnd.github.v3+json',
				'User-Agent': 'Sveltest-App',
			},
		});

		if (!response.ok) {
			console.warn(
				`Failed to fetch workflow status for ${workflow_file}:`,
				response.status,
			);
			return 'unknown';
		}

		const data = await response.json();

		if (!data.workflow_runs || data.workflow_runs.length === 0) {
			return 'unknown';
		}

		const latest_run = data.workflow_runs[0];

		// Check if the latest run was successful
		return latest_run.conclusion === 'success'
			? 'passing'
			: 'failing';
	} catch (error) {
		console.error(
			`Error fetching workflow status for ${workflow_file}:`,
			error,
		);
		return 'unknown';
	}
};

export const GET: RequestHandler = async () => {
	try {
		const [unit_status, e2e_status] = await Promise.all([
			get_workflow_status(UNIT_TESTS_WORKFLOW),
			get_workflow_status(E2E_WORKFLOW),
		]);

		// Check if any status is unknown due to errors
		const has_errors =
			unit_status === 'unknown' || e2e_status === 'unknown';

		const status: GitHubStatus = {
			unit_tests: {
				status: unit_status,
				badge_url: `https://github.com/${GITHUB_REPO}/actions/workflows/${UNIT_TESTS_WORKFLOW}/badge.svg`,
			},
			e2e_tests: {
				status: e2e_status,
				badge_url: `https://github.com/${GITHUB_REPO}/actions/workflows/${E2E_WORKFLOW}/badge.svg`,
			},
		};

		// Return 500 if there were errors fetching status
		if (has_errors) {
			return json(status, {
				status: 500,
				headers: {
					'Cache-Control': 'public, max-age=60', // Shorter cache for errors
				},
			});
		}

		return json(status, {
			headers: {
				'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
			},
		});
	} catch (error) {
		console.error('Error fetching GitHub status:', error);

		// Return fallback status
		return json(
			{
				unit_tests: {
					status: 'unknown' as const,
					badge_url: `https://github.com/${GITHUB_REPO}/actions/workflows/${UNIT_TESTS_WORKFLOW}/badge.svg`,
				},
				e2e_tests: {
					status: 'unknown' as const,
					badge_url: `https://github.com/${GITHUB_REPO}/actions/workflows/${E2E_WORKFLOW}/badge.svg`,
				},
			},
			{
				status: 500,
				headers: {
					'Cache-Control': 'public, max-age=60', // Shorter cache for errors
				},
			},
		);
	}
};
