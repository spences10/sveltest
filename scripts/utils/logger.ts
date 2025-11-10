#!/usr/bin/env tsx

/**
 * Pretty console logger with colors and formatting
 */

export const logger = {
	info: (message: string) => {
		console.log(`ℹ️  ${message}`);
	},

	success: (message: string) => {
		console.log(`✅ ${message}`);
	},

	error: (message: string) => {
		console.error(`❌ ${message}`);
	},

	warn: (message: string) => {
		console.warn(`⚠️  ${message}`);
	},

	step: (step: number, message: string) => {
		console.log(`\n🔹 Step ${step}: ${message}`);
	},

	header: (message: string) => {
		console.log(`\n${'='.repeat(60)}`);
		console.log(`  ${message}`);
		console.log(`${'='.repeat(60)}\n`);
	},

	progress: (message: string) => {
		process.stdout.write(`⏳ ${message}...`);
	},

	progress_done: () => {
		console.log(' Done!');
	},

	table: (data: Record<string, string | number>) => {
		console.log('');
		Object.entries(data).forEach(([key, value]) => {
			const formatted_key = key.padEnd(25);
			console.log(`  ${formatted_key} ${value}`);
		});
		console.log('');
	},

	divider: () => {
		console.log(`${'─'.repeat(60)}`);
	},
};
