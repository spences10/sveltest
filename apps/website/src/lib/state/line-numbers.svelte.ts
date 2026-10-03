// Reader preference for code block line numbers. The cookie lets the
// server set `data-line-numbers` on <html> so there's no flash on load.
export const LINE_NUMBERS_COOKIE = 'line_numbers';

class LineNumbersState {
	visible = $state(false);

	sync() {
		this.visible = document.documentElement.hasAttribute(
			'data-line-numbers',
		);
	}

	toggle() {
		this.visible = !this.visible;
		document.documentElement.toggleAttribute(
			'data-line-numbers',
			this.visible,
		);
		const one_year = 60 * 60 * 24 * 365;
		document.cookie = `${LINE_NUMBERS_COOKIE}=${this.visible ? 1 : 0}; max-age=${one_year}; path=/; SameSite=Strict;`;
	}
}

export const line_numbers_state = new LineNumbersState();
