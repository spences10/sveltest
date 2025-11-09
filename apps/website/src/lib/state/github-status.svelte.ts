import { browser } from '$app/environment';

export interface GitHubStatus {
	unit_tests: {
		status: 'passing' | 'failing' | 'unknown';
		badge_url: string;
	};
	e2e_tests: {
		status: 'passing' | 'failing' | 'unknown';
		badge_url: string;
	};
}

interface GitHubStatusState {
	data: GitHubStatus | null;
	loading: boolean;
	error: string | null;
	last_updated: number | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export class GitHubStatusManager {
	private state = $state<GitHubStatusState>({
		data: null,
		loading: false,
		error: null,
		last_updated: null,
	});

	constructor() {
		// Auto-fetch on creation (client-side only)
		if (browser) {
			this.fetch_status();
		}
	}

	get data() {
		return this.state.data;
	}

	get loading() {
		return this.state.loading;
	}

	get error() {
		return this.state.error;
	}

	get last_updated() {
		return this.state.last_updated;
	}

	get overall_status(): 'passing' | 'failing' | 'unknown' {
		if (!this.state.data) return 'unknown';

		const { unit_tests, e2e_tests } = this.state.data;

		// If both are passing, overall is passing
		if (
			unit_tests.status === 'passing' &&
			e2e_tests.status === 'passing'
		) {
			return 'passing';
		}

		// If either is failing, overall is failing
		if (
			unit_tests.status === 'failing' ||
			e2e_tests.status === 'failing'
		) {
			return 'failing';
		}

		// Otherwise unknown
		return 'unknown';
	}

	get status_message(): string {
		if (!this.state.data) return 'Status unknown';

		const { unit_tests, e2e_tests } = this.state.data;
		const overall = this.overall_status;

		if (overall === 'passing') {
			return 'All tests passing';
		} else if (overall === 'failing') {
			// Provide specific failure messages
			const unit_failing = unit_tests.status === 'failing';
			const e2e_failing = e2e_tests.status === 'failing';

			if (unit_failing && e2e_failing) {
				return 'Unit & E2E tests failing';
			} else if (unit_failing) {
				return 'Unit tests failing';
			} else if (e2e_failing) {
				return 'E2E tests failing';
			} else {
				return 'Tests failing';
			}
		} else {
			return 'Test status unknown';
		}
	}

	get status_color(): 'success' | 'error' | 'warning' {
		const overall = this.overall_status;
		return overall === 'passing'
			? 'success'
			: overall === 'failing'
				? 'error'
				: 'warning';
	}

	async fetch_status(force_refresh = false) {
		if (!browser) return;

		// Don't fetch if we have recent data and not forcing refresh
		if (
			!force_refresh &&
			this.state.data &&
			this.state.last_updated
		) {
			const time_since_update = Date.now() - this.state.last_updated;
			if (time_since_update < CACHE_DURATION) {
				return;
			}
		}

		this.state.loading = true;
		this.state.error = null;

		try {
			const response = await fetch('/api/github-status');

			// Handle both successful responses and 500s with valid data
			if (response.ok || response.status === 500) {
				const data: GitHubStatus = await response.json();

				this.state.data = data;
				this.state.last_updated = Date.now();
				this.state.loading = false;

				// Set error state for 500 responses but still use the data
				if (response.status === 500) {
					this.state.error = 'GitHub API temporarily unavailable';
					console.warn(
						'GitHub status API returned 500, using fallback data',
					);
				} else {
					this.state.error = null;
				}
			} else {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}
		} catch (error) {
			const error_message =
				error instanceof Error
					? error.message
					: 'Unknown error occurred';

			this.state.loading = false;
			this.state.error = error_message;

			console.error('Failed to fetch GitHub status:', error);
		}
	}

	refresh() {
		return this.fetch_status(true);
	}
}

export const github_status = new GitHubStatusManager();
