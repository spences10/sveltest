import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import Arrow from './arrow.svelte';

describe('Arrow SSR', () => {
	test('should render without errors', () => {
		expect(() => {
			render(Arrow);
		}).not.toThrow();
	});

	test('should render with all direction variants', () => {
		const directions = ['up', 'down', 'left', 'right'] as const;

		directions.forEach((direction) => {
			expect(() => {
				render(Arrow, { props: { direction } });
			}).not.toThrow();
		});
	});

	test('should render essential SVG structure for all browsers', () => {
		const { body } = render(Arrow);

		// ✅ Test essential SVG structure for SEO and accessibility
		expect(body).toContain('<svg');
		expect(body).toContain('xmlns="http://www.w3.org/2000/svg"');
		expect(body).toContain('viewBox="0 0 24 24"');
		expect(body).toContain('stroke="currentColor"');
		expect(body).toContain('<path');

		// ✅ Test semantic styling that affects user experience
		expect(body).toContain('stroke-linecap="round"');
		expect(body).toContain('stroke-linejoin="round"');

		// ❌ DON'T test exact stroke-width - that's implementation detail
		// SSR should render functional SVG, exact stroke width may vary
	});

	test('should render with correct rotation styles', () => {
		const test_cases = [
			{ direction: 'up', expected_rotation: '270deg' },
			{ direction: 'right', expected_rotation: '0deg' },
			{ direction: 'down', expected_rotation: '90deg' },
			{ direction: 'left', expected_rotation: '180deg' },
		] as const;

		test_cases.forEach(({ direction, expected_rotation }) => {
			const { body } = render(Arrow, { props: { direction } });
			expect(body).toContain(
				`transform: rotate(${expected_rotation})`,
			);
		});
	});

	test('should render with custom dimensions', () => {
		const { body } = render(Arrow, {
			props: { height: '32px', width: '32px' },
		});

		expect(body).toContain('height="32px"');
		expect(body).toContain('width="32px"');
	});

	test('should render with custom class names', () => {
		const { body } = render(Arrow, {
			props: { class_names: 'custom-arrow-class' },
		});

		expect(body).toContain('class="custom-arrow-class"');
	});

	test('should render default values when props are undefined', () => {
		const { body } = render(Arrow, {
			props: {
				direction: undefined,
				height: undefined,
				width: undefined,
				class_names: undefined,
			},
		});

		// Should use default values
		expect(body).toContain('height="24px"');
		expect(body).toContain('width="24px"');
		expect(body).toContain('transform: rotate(0deg)'); // default right direction
	});
});
