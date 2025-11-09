import { describe, expect, it } from 'vitest';
import type {
	ButtonSize,
	ButtonState,
	ButtonTestScenario,
	ButtonVariant,
} from './+server';
import { GET } from './+server';

/**
 * Meta-Example: Testing the Button Variants Endpoint
 *
 * This test demonstrates:
 * - Server-side testing with real Request objects (minimal mocking)
 * - Testing endpoints that provide testing scenario data
 * - Validation of test pattern documentation
 *
 * Pattern: Client-Server Alignment Strategy
 * - Uses real Request objects
 * - Validates data structure matches component requirements
 * - Ensures endpoint data is accurate and useful
 */

describe('Button Variants Endpoint', () => {
	describe('Response Structure', () => {
		it('should return valid JSON response', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(response.headers.get('content-type')).toContain(
				'application/json',
			);
			expect(data).toBeDefined();
		});

		it('should include all required top-level fields', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data).toHaveProperty('title');
			expect(data).toHaveProperty('description');
			expect(data).toHaveProperty('source_file');
			expect(data).toHaveProperty('total_tests');
			expect(data).toHaveProperty('variants');
			expect(data).toHaveProperty('sizes');
			expect(data).toHaveProperty('states');
			expect(data).toHaveProperty('test_scenarios');
			expect(data).toHaveProperty('testing_patterns');
			expect(data).toHaveProperty('meta');
		});

		it('should have correct metadata', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data.meta).toEqual({
				component: 'Button',
				test_type: 'Component Testing (Browser)',
				framework: 'vitest-browser-svelte',
				patterns_demonstrated: [
					'Snippet testing',
					'User interactions',
					'Accessibility',
					'CSS class testing',
					'State management',
				],
			});
		});
	});

	describe('Button Variants Data', () => {
		it('should return all button variants', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data.variants).toHaveLength(4);
			const variantTypes = data.variants.map(
				(v: ButtonVariant) => v.variant,
			);
			expect(variantTypes).toEqual([
				'primary',
				'secondary',
				'outline',
				'ghost',
			]);
		});

		it('should have valid variant structure', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const variant: ButtonVariant = data.variants[0];
			expect(variant).toHaveProperty('variant');
			expect(variant).toHaveProperty('expected_class');
			expect(variant).toHaveProperty('description');
		});

		it('should map variants to correct CSS classes', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const expectedMappings = {
				primary: 'btn-primary',
				secondary: 'btn-secondary',
				outline: 'btn-outline',
				ghost: 'btn-ghost',
			};

			data.variants.forEach((v: ButtonVariant) => {
				expect(v.expected_class).toBe(expectedMappings[v.variant]);
			});
		});
	});

	describe('Button Sizes Data', () => {
		it('should return all button sizes', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data.sizes).toHaveLength(3);
			const sizeTypes = data.sizes.map((s: ButtonSize) => s.size);
			expect(sizeTypes).toEqual(['sm', 'md', 'lg']);
		});

		it('should have valid size structure', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const size: ButtonSize = data.sizes[0];
			expect(size).toHaveProperty('size');
			expect(size).toHaveProperty('expected_class');
			expect(size).toHaveProperty('description');
		});

		it('should handle medium size with no extra class', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const mediumSize = data.sizes.find(
				(s: ButtonSize) => s.size === 'md',
			);
			expect(mediumSize.expected_class).toBeNull();
			expect(mediumSize.description).toContain('Default');
		});
	});

	describe('Button States Data', () => {
		it('should return all button states', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data.states).toHaveLength(3);
			const stateTypes = data.states.map((s: ButtonState) => s.state);
			expect(stateTypes).toEqual(['enabled', 'disabled', 'loading']);
		});

		it('should have valid state structure', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const state: ButtonState = data.states[0];
			expect(state).toHaveProperty('state');
			expect(state).toHaveProperty('props');
			expect(state).toHaveProperty('expected_behavior');
			expect(state).toHaveProperty('accessibility');
			expect(Array.isArray(state.accessibility)).toBe(true);
		});

		it('should include accessibility expectations for each state', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			data.states.forEach((state: ButtonState) => {
				expect(state.accessibility.length).toBeGreaterThan(0);
				expect(state.accessibility).toContain('role="button"');
			});
		});

		it('should have correct props for disabled state', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const disabledState = data.states.find(
				(s: ButtonState) => s.state === 'disabled',
			);
			expect(disabledState.props).toEqual({ disabled: true });
			expect(disabledState.accessibility).toContain(
				'aria-disabled="true"',
			);
		});

		it('should have correct props for loading state', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const loadingState = data.states.find(
				(s: ButtonState) => s.state === 'loading',
			);
			expect(loadingState.props).toEqual({ loading: true });
			expect(loadingState.accessibility).toContain(
				'toHaveTextContent("Loading...")',
			);
		});
	});

	describe('Test Scenarios', () => {
		it('should include test scenarios by category', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(Array.isArray(data.test_scenarios)).toBe(true);
			expect(data.test_scenarios.length).toBeGreaterThan(0);

			const categories = data.test_scenarios.map(
				(s: ButtonTestScenario) => s.category,
			);
			expect(categories).toContain('Basic Rendering');
			expect(categories).toContain('Variants and Styling');
			expect(categories).toContain('Sizes');
			expect(categories).toContain('User Interactions');
			expect(categories).toContain('States');
			expect(categories).toContain('Accessibility');
			expect(categories).toContain('Custom Classes');
			expect(categories).toContain('Edge Cases');
		});

		it('should have scenarios array for each category', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			data.test_scenarios.forEach((scenario: ButtonTestScenario) => {
				expect(scenario).toHaveProperty('category');
				expect(scenario).toHaveProperty('scenarios');
				expect(Array.isArray(scenario.scenarios)).toBe(true);
				expect(scenario.scenarios.length).toBeGreaterThan(0);
			});
		});

		it('should include code examples where appropriate', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const userInteractions = data.test_scenarios.find(
				(s: ButtonTestScenario) => s.category === 'User Interactions',
			);

			expect(userInteractions.scenarios[0]).toHaveProperty(
				'code_example',
			);
			expect(userInteractions.scenarios[0].code_example).toContain(
				'vi.fn()',
			);
			expect(userInteractions.scenarios[0].code_example).toContain(
				'await button.click()',
			);
		});
	});

	describe('Testing Patterns Documentation', () => {
		it('should include critical patterns', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data.testing_patterns.critical_patterns).toBeDefined();
			expect(
				Array.isArray(data.testing_patterns.critical_patterns),
			).toBe(true);
			expect(
				data.testing_patterns.critical_patterns.length,
			).toBeGreaterThan(0);
		});

		it('should include common mistakes', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data.testing_patterns.common_mistakes).toBeDefined();
			expect(
				Array.isArray(data.testing_patterns.common_mistakes),
			).toBe(true);
		});

		it('should include best practices', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(data.testing_patterns.best_practices).toBeDefined();
			expect(
				Array.isArray(data.testing_patterns.best_practices),
			).toBe(true);
		});

		it('should emphasize locator usage', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const hasLocatorPattern =
				data.testing_patterns.critical_patterns.some((p: string) =>
					p.includes('locators'),
				);
			expect(hasLocatorPattern).toBe(true);
		});

		it('should warn against using containers', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			const hasContainerWarning =
				data.testing_patterns.common_mistakes.some((p: string) =>
					p.includes('containers'),
				);
			expect(hasContainerWarning).toBe(true);
		});
	});

	describe('Data Consistency', () => {
		it('should return consistent data across requests', async () => {
			const request1 = new Request(
				'http://localhost/api/examples/button-variants',
			);
			const request2 = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response1 = await GET({ request: request1 } as any);
			const response2 = await GET({ request: request2 } as any);

			const data1 = await response1.json();
			const data2 = await response2.json();

			expect(data1).toEqual(data2);
		});

		it('should have total_tests matching actual test file', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
			);

			const response = await GET({ request } as any);
			const data = await response.json();

			// The actual button.svelte.test.ts file has 24 tests
			expect(data.total_tests).toBe(24);
		});
	});

	describe('Request Handling', () => {
		it('should handle requests with different origins', async () => {
			const request = new Request(
				'https://example.com/api/examples/button-variants',
			);

			const response = await GET({ request } as any);

			expect(response.status).toBe(200);
		});

		it('should handle requests with query parameters', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants?format=detailed',
			);

			const response = await GET({ request } as any);

			expect(response.status).toBe(200);
		});

		it('should handle requests with custom headers', async () => {
			const request = new Request(
				'http://localhost/api/examples/button-variants',
				{
					headers: {
						'user-agent': 'Test Client',
						accept: 'application/json',
					},
				},
			);

			const response = await GET({ request } as any);

			expect(response.status).toBe(200);
		});
	});
});
