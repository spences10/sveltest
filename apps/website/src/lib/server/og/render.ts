import {
	card_height,
	card_width,
	type site_card,
} from '#lib/og/cards.js';
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import regular_font from './fonts/inter-400.ttf?inline';
import bold_font from './fonts/inter-700.ttf?inline';

function decode_data_url(data_url: string) {
	return Uint8Array.from(atob(data_url.split(',')[1]), (character) =>
		character.charCodeAt(0),
	);
}

// Fonts stay in memory in both Node and Workers.
const font_buffers = [regular_font, bold_font].map(decode_data_url);
let wasm_ready: Promise<void> | undefined;

async function initialize_wasm() {
	// Share initialization across concurrent requests in this isolate.
	wasm_ready ??= (async () => {
		if (import.meta.env.CF_PAGES) {
			// Wrangler supplies a precompiled module; Workers cannot compile bytes.
			const { default: wasm } =
				await import('@resvg/resvg-wasm/index_bg.wasm');
			await initWasm(wasm);
		} else {
			// Vite dev, preview and Vitest run in Node, without Wrangler's loader.
			const { default: data_url } =
				await import('@resvg/resvg-wasm/index_bg.wasm?url&inline');
			await initWasm(decode_data_url(data_url));
		}
	})();
	await wasm_ready;
}
const font_options = {
	font: {
		fontBuffers: font_buffers,
		defaultFontFamily: 'Inter',
	},
};

function escape_xml(value: string) {
	return value.replace(
		/[&<>"']/g,
		(character) =>
			({
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&apos;',
			})[character]!,
	);
}

function wrap_text(text: string, size: number, weight: number) {
	const lines: string[] = [];
	let line = '';
	for (const word of text.split(/\s+/)) {
		const candidate = line ? `${line} ${word}` : word;
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="160"><text y="100" font-family="Inter" font-size="${size}" font-weight="${weight}">${escape_xml(candidate)}</text></svg>`;
		const renderer = new Resvg(svg, font_options);
		let width: number;
		try {
			const bounds = renderer.getBBox();
			try {
				width = bounds?.width ?? 0;
			} finally {
				bounds?.free();
			}
		} finally {
			renderer.free();
		}
		if (line && width > 1040) {
			lines.push(line);
			line = word;
		} else {
			line = candidate;
		}
	}
	if (line) lines.push(line);
	return lines;
}

export async function render_card(
	card: typeof site_card,
): Promise<Uint8Array<ArrayBuffer>> {
	await initialize_wasm();
	const title_lines = wrap_text(card.title, 72, 700);
	const description_lines = wrap_text(card.description, 30, 400);
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${card_width}" height="${card_height}">
		<defs>
			<linearGradient id="background" x2="1" y2="1"><stop stop-color="#f5f3ff"/><stop offset="1" stop-color="#e0f2fe"/></linearGradient>
			<linearGradient id="accent"><stop stop-color="#6d28d9"/><stop offset=".5" stop-color="#db2777"/><stop offset="1" stop-color="#0891b2"/></linearGradient>
		</defs>
		<rect width="1200" height="630" fill="url(#background)"/>
		<rect width="1200" height="10" fill="url(#accent)"/>
		<g font-family="Inter">
			<rect x="80" y="60" width="42" height="42" rx="12" fill="#6d28d9"/>
			<path d="m90 81 8 8 15-17" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
			<text x="138" y="92" font-size="36" font-weight="700" fill="#312e81">Sveltest</text>
			<text x="80" y="166" font-size="24" fill="#6d28d9">${escape_xml(card.category)}</text>
			${title_lines.map((line, index) => `<text x="76" y="${264 + index * 86}" font-size="72" font-weight="700" fill="#172554">${escape_xml(line)}</text>`).join('')}
			${description_lines.map((line, index) => `<text x="80" y="${426 + index * 42}" font-size="30" fill="#475569">${escape_xml(line)}</text>`).join('')}
			<path d="M80 528H1120" stroke="#cbd5e1"/>
			<text x="80" y="578" font-size="24" fill="#475569">sveltest.dev</text>
			<text x="1120" y="578" text-anchor="end" font-size="24" fill="#6d28d9">Svelte 5 · Vitest · Playwright</text>
		</g>
	</svg>`;
	const renderer = new Resvg(svg, font_options);
	try {
		const image = renderer.render();
		try {
			return new Uint8Array(image.asPng());
		} finally {
			image.free();
		}
	} finally {
		renderer.free();
	}
}
