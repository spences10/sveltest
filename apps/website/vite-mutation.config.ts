import { defineConfig } from 'vite-plus';
import vite_config from './vite.config';

// Select tests here: Stryker 10.1.1's testFiles option activates
// module-level schema mutations too late, producing false survivors.
export default defineConfig({
	...vite_config,
	test: {
		...vite_config.test,
		projects: undefined,
		environment: 'node',
		include: ['src/lib/utils/validation.test.ts'],
	},
});
