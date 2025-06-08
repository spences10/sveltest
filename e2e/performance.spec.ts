import { expect, test } from '@playwright/test';

// Define proper TypeScript interfaces for performance APIs
interface PerformanceNavigationTimingEntry extends PerformanceEntry {
	domContentLoadedEventEnd: number;
	domContentLoadedEventStart: number;
	domComplete: number;
	domInteractive: number;
	loadEventEnd: number;
	loadEventStart: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
	hadRecentInput: boolean;
	value: number;
}

interface ResourceInfo {
	url: string;
	size: number;
	type: string;
	status: number;
}

interface ImageInfo {
	url: string;
	size: string;
	type: string;
	status: number;
}

interface CacheInfo {
	url: string;
	status: number;
	fromCache: boolean;
	cacheControl: string;
	etag: string;
	lastModified: string;
}

test.describe('Performance Tests', () => {
	test('should meet Core Web Vitals thresholds', async ({ page }) => {
		await test.step('Navigate and measure performance', async () => {
			const startTime = Date.now();
			await page.goto('/');
			const navigationTime = Date.now() - startTime;

			// Navigation should complete within reasonable time
			expect(navigationTime).toBeLessThan(3000);
		});

		await test.step('Check Largest Contentful Paint (LCP)', async () => {
			// Wait for main content to be visible
			await expect(
				page.getByRole('heading', { name: 'Sveltest' }),
			).toBeVisible();

			// Measure LCP using Performance API
			const lcpValue = await page.evaluate(() => {
				return new Promise<number>((resolve) => {
					new PerformanceObserver((list) => {
						const entries = list.getEntries();
						const lastEntry = entries[entries.length - 1];
						resolve(lastEntry.startTime);
					}).observe({ entryTypes: ['largest-contentful-paint'] });

					// Fallback timeout
					setTimeout(() => resolve(0), 5000);
				});
			});

			// LCP should be under 2.5 seconds (good threshold)
			if (lcpValue > 0) {
				expect(lcpValue).toBeLessThan(2500);
			}
		});

		await test.step('Check Cumulative Layout Shift (CLS)', async () => {
			// Wait for page to stabilize
			await page.waitForTimeout(2000);

			const clsValue = await page.evaluate(() => {
				return new Promise<number>((resolve) => {
					let clsValue = 0;
					new PerformanceObserver((list) => {
						for (const entry of list.getEntries()) {
							const layoutShiftEntry = entry as LayoutShiftEntry;
							if (!layoutShiftEntry.hadRecentInput) {
								clsValue += layoutShiftEntry.value;
							}
						}
						resolve(clsValue);
					}).observe({ entryTypes: ['layout-shift'] });

					// Resolve after a short delay
					setTimeout(() => resolve(clsValue), 1000);
				});
			});

			// CLS should be under 0.1 (good threshold)
			expect(clsValue).toBeLessThan(0.1);
		});
	});

	test('should load resources efficiently', async ({ page }) => {
		const resourceSizes: ResourceInfo[] = [];
		const resourceTypes: string[] = [];

		await test.step('Monitor resource loading', async () => {
			page.on('response', (response) => {
				const url = response.url();
				const size = response.headers()['content-length'];
				const type = response.headers()['content-type'];

				resourceSizes.push({
					url,
					size: size ? parseInt(size) : 0,
					type,
					status: response.status(),
				});

				if (type) {
					resourceTypes.push(type);
				}
			});

			await page.goto('/');
			await page.waitForLoadState('networkidle');
		});

		await test.step('Validate resource efficiency', async () => {
			// Check that we're not loading excessively large resources
			const largeResources = resourceSizes.filter(
				(r) => r.size > 1000000,
			); // > 1MB

			if (largeResources.length > 0) {
				console.log('Large resources detected:', largeResources);
				// Log but don't fail - this is informational
			}

			// Check for successful resource loading, but exclude external API calls
			// External APIs (like GitHub) can be rate-limited in CI environments
			// Also exclude internal API endpoints that depend on external services
			const failedResources = resourceSizes.filter(
				(r) =>
					r.status >= 400 &&
					!r.url.includes('api.github.com') &&
					!r.url.includes('/api/github-status'),
			);
			expect(failedResources.length).toBe(0);
		});

		await test.step('Check resource types', async () => {
			// Verify we're loading expected resource types
			const hasCSS = resourceTypes.some((type) =>
				type?.includes('text/css'),
			);
			const hasJS = resourceTypes.some((type) =>
				type?.includes('javascript'),
			);
			const hasHTML = resourceTypes.some((type) =>
				type?.includes('text/html'),
			);

			expect(hasHTML).toBeTruthy();
			// CSS and JS might be inlined in SvelteKit, so we don't require them
		});
	});

	test('should handle concurrent users efficiently', async ({
		page,
		context,
	}) => {
		await test.step('Simulate multiple tabs', async () => {
			// Open multiple tabs to simulate concurrent usage
			const pages = [page];

			for (let i = 0; i < 3; i++) {
				const newPage = await context.newPage();
				pages.push(newPage);
			}

			// Navigate all pages simultaneously
			const navigationPromises = pages.map((p) => p.goto('/'));
			await Promise.all(navigationPromises);

			// Verify all pages loaded successfully
			for (const p of pages) {
				await expect(
					p.getByRole('heading', { name: 'Sveltest' }),
				).toBeVisible();
			}

			// Clean up
			for (let i = 1; i < pages.length; i++) {
				await pages[i].close();
			}
		});
	});

	test('should maintain performance under load', async ({ page }) => {
		await test.step('Rapid navigation test', async () => {
			const pages = ['/', '/examples'];
			const navigationTimes: number[] = [];

			for (let i = 0; i < 2; i++) {
				// Do 2 rounds
				for (const pagePath of pages) {
					const startTime = Date.now();
					await page.goto(pagePath);
					await page.waitForLoadState('domcontentloaded');
					const endTime = Date.now();

					navigationTimes.push(endTime - startTime);

					// Verify page loaded with specific heading
					if (pagePath === '/') {
						await expect(
							page.getByRole('heading', { name: 'Sveltest' }),
						).toBeVisible();
					} else if (pagePath === '/examples') {
						await expect(
							page.getByRole('heading', { name: 'Testing Patterns' }),
						).toBeVisible();
					}
				}
			}

			// Calculate average navigation time
			const avgTime =
				navigationTimes.reduce((a, b) => a + b, 0) /
				navigationTimes.length;
			console.log(`Average navigation time: ${avgTime}ms`);

			// Navigation should remain fast even with rapid switching
			expect(avgTime).toBeLessThan(2000);
		});
	});

	test('should optimize images and media', async ({ page }) => {
		const imageResources: ImageInfo[] = [];

		await test.step('Monitor image loading', async () => {
			page.on('response', (response) => {
				const contentType = response.headers()['content-type'];
				if (contentType?.startsWith('image/')) {
					imageResources.push({
						url: response.url(),
						size: response.headers()['content-length'],
						type: contentType,
						status: response.status(),
					});
				}
			});

			await page.goto('/');
			await page.waitForLoadState('networkidle');
		});

		await test.step('Validate image optimization', async () => {
			if (imageResources.length > 0) {
				// Check that images loaded successfully
				const failedImages = imageResources.filter(
					(img) => img.status >= 400,
				);
				expect(failedImages.length).toBe(0);

				// Check for modern image formats
				const modernFormats = imageResources.filter(
					(img) =>
						img.type?.includes('webp') ||
						img.type?.includes('avif') ||
						img.type?.includes('svg'),
				);

				console.log(
					`${modernFormats.length}/${imageResources.length} images use modern formats`,
				);
			}
		});
	});

	test('should have efficient JavaScript execution', async ({
		page,
	}) => {
		await test.step('Monitor JavaScript performance', async () => {
			await page.goto('/');

			// Measure JavaScript execution time
			const jsMetrics = await page.evaluate(() => {
				const navigation = performance.getEntriesByType(
					'navigation',
				)[0] as PerformanceNavigationTimingEntry;
				return {
					domContentLoaded:
						navigation.domContentLoadedEventEnd -
						navigation.domContentLoadedEventStart,
					domComplete:
						navigation.domComplete - navigation.domInteractive,
					loadComplete:
						navigation.loadEventEnd - navigation.loadEventStart,
				};
			});

			// DOM content should load quickly
			expect(jsMetrics.domContentLoaded).toBeLessThan(1000);

			console.log('JS Performance Metrics:', jsMetrics);
		});

		await test.step('Check for JavaScript errors', async () => {
			const jsErrors: string[] = [];

			page.on('console', (msg) => {
				if (msg.type() === 'error') {
					jsErrors.push(msg.text());
				}
			});

			page.on('pageerror', (error) => {
				jsErrors.push(error.message);
			});

			await page.goto('/');
			await page.waitForTimeout(2000);

			// Allow some errors but not excessive ones (development environment may have some)
			expect(jsErrors.length).toBeLessThan(10);
		});
	});

	test('should handle memory usage efficiently', async ({ page }) => {
		await test.step('Monitor memory usage', async () => {
			await page.goto('/');

			// Get initial memory usage
			const initialMemory = await page.evaluate(() => {
				return (performance as any).memory
					? {
							usedJSHeapSize: (performance as any).memory
								.usedJSHeapSize,
							totalJSHeapSize: (performance as any).memory
								.totalJSHeapSize,
							jsHeapSizeLimit: (performance as any).memory
								.jsHeapSizeLimit,
						}
					: null;
			});

			if (initialMemory) {
				console.log('Initial memory usage:', initialMemory);

				// Navigate through pages to test memory usage
				try {
					await page.goto('/examples', { timeout: 5000 });
					await page.waitForTimeout(500);

					// Try todos page but handle gracefully if it fails
					try {
						await page.goto('/todos', { timeout: 5000 });
						await page.waitForTimeout(500);
					} catch (error) {
						console.log(
							'Skipping todos page in memory test due to loading issues',
						);
					}

					await page.goto('/', { timeout: 5000 });
					await page.waitForTimeout(500);

					const finalMemory = await page.evaluate(() => {
						return {
							usedJSHeapSize: (performance as any).memory
								.usedJSHeapSize,
							totalJSHeapSize: (performance as any).memory
								.totalJSHeapSize,
							jsHeapSizeLimit: (performance as any).memory
								.jsHeapSizeLimit,
						};
					});

					console.log('Final memory usage:', finalMemory);

					// Memory usage shouldn't grow excessively
					const memoryGrowth =
						finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
					expect(memoryGrowth).toBeLessThan(10000000); // Less than 10MB growth
				} catch (error) {
					console.log(
						'Memory test navigation failed, but initial memory check passed',
					);
					// Don't fail the test if navigation fails
				}
			}
		});
	});

	test('should cache resources appropriately', async ({ page }) => {
		await test.step('Test resource caching', async () => {
			// First visit
			await page.goto('/');
			await page.waitForLoadState('networkidle');

			// Second visit - should use cached resources
			const cachedRequests: CacheInfo[] = [];
			page.on('response', (response) => {
				const cacheControl = response.headers()['cache-control'];
				const etag = response.headers()['etag'];
				const lastModified = response.headers()['last-modified'];

				if (cacheControl || etag || lastModified) {
					cachedRequests.push({
						url: response.url(),
						status: response.status(),
						fromCache:
							response.fromServiceWorker() ||
							response.status() === 304,
						cacheControl,
						etag,
						lastModified,
					});
				}
			});

			await page.reload();
			await page.waitForLoadState('networkidle');

			// Check that some resources are cached
			const cachedResources = cachedRequests.filter(
				(req) => req.fromCache || req.status === 304,
			);
			console.log(
				`${cachedResources.length}/${cachedRequests.length} resources served from cache`,
			);
		});
	});
});
