class CommandPaletteState {
	dialog: HTMLDialogElement | null = null;
	input: HTMLInputElement | null = null;
	query = $state('');
	recent = $state<string[]>([]);
	is_open = $state(false);

	// Attach function for dialog - register element with state
	register = (dialog: HTMLDialogElement) => {
		this.dialog = dialog;
		return () => {
			this.dialog = null;
		};
	};

	// Attach function for input - register for focus management
	register_input = (input: HTMLInputElement) => {
		this.input = input;
		return () => {
			this.input = null;
		};
	};

	open() {
		if (!this.dialog?.open) {
			this.is_open = true;
			this.dialog?.showModal();
			this.input?.focus();
		}
	}

	close() {
		this.is_open = false;
		this.dialog?.close();
		this.query = '';
	}

	toggle() {
		if (this.is_open) {
			this.close();
		} else {
			this.open();
		}
	}

	add_recent(href: string) {
		// Remove if already exists, add to front, keep max 5
		this.recent = [
			href,
			...this.recent.filter((r) => r !== href),
		].slice(0, 5);
	}
}

export const command_palette_state = new CommandPaletteState();
