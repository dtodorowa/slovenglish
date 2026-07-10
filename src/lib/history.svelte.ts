export type Entry = { en: string; sl: string; ts: number };

const KEY = 'slovenglish:history';
const MAX = 100;

function load(): Entry[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

/**
 * Translation history. localStorage is just the current backing store — swapping
 * it for a synced backend later means changing only persist()/load(), not callers.
 */
class History {
	entries = $state<Entry[]>(load());

	private persist() {
		try {
			localStorage.setItem(KEY, JSON.stringify(this.entries));
		} catch {
			// Private-mode Safari and quota errors: history just doesn't survive reload.
		}
	}

	add(en: string, sl: string, now: number) {
		en = en.trim();
		sl = sl.trim();
		if (!en || !sl) return;

		// Collapse progressive typing/dictation: "when", "when is", "when is dinner"
		// are the same phrase mid-flight, so replace the newest entry when one is a
		// prefix of the other instead of stacking three rows.
		const prev = this.entries[0];
		if (prev && (en.startsWith(prev.en) || prev.en.startsWith(en))) {
			this.entries[0] = { en, sl, ts: now };
			this.persist();
			return;
		}

		this.entries.unshift({ en, sl, ts: now });
		if (this.entries.length > MAX) this.entries.length = MAX;
		this.persist();
	}

	remove(ts: number) {
		this.entries = this.entries.filter((e) => e.ts !== ts);
		this.persist();
	}

	clear() {
		this.entries = [];
		this.persist();
	}
}

export const history = new History();
