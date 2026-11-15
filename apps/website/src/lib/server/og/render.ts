import {
	card_height,
	card_width,
	type site_card,
} from '#lib/og/cards.js';
import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import regular_font from './fonts/inter-400.ttf?inline';
import bold_font from './fonts/inter-700.ttf?inline';

// Bundle the fonts with the server. Native resvg reads fonts from disk.
const font_dir = join(tmpdir(), 'sveltest-og-fonts');
mkdirSync(font_dir, { recursive: true });
const font_files = [regular_font, bold_font].map(
	(data_url, index) => {
		const path = join(font_dir, `inter-${index}.ttf`);
		writeFileSync(
			path,
			Buffer.from(data_url.split(',')[1], 'base64'),
		);
		return path;
	},
);
const font_options = {
	font: {
		fontFiles: font_files,
		loadSystemFonts: false,
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
		const width = new Resvg(svg, font_options).getBBox()?.width ?? 0;
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

export function render_card(
	card: typeof site_card,
): Uint8Array<ArrayBuffer> {
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
	return new Uint8Array(
		new Resvg(svg, font_options).render().asPng(),
	);
}
