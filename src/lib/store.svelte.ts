export type Entry = { en: string; sl: string; ts: number };

const HKEY = 'slovenglish:history';
const SKEY = 'slovenglish:starred';
const MAX_HISTORY = 100;

function load(key: string): Entry[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(key);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

/**
 * All persisted phrases. localStorage is just the current backing store — swapping
 * it for a synced backend later means changing only save()/load(), not callers.
 */
class Store {
	history = $state<Entry[]>(load(HKEY));
	starred = $state<Entry[]>(load(SKEY));

	/** A phrase queued to open in the translator, set just before navigating to '/'. */
	pending: Entry | null = null;

	private save(key: string, list: Entry[]) {
		try {
			localStorage.setItem(key, JSON.stringify(list));
		} catch {
			// Private-mode Safari and quota errors: the list just doesn't survive reload.
		}
	}

	add(en: string, sl: string, now: number) {
		en = en.trim();
		sl = sl.trim();
		if (!en || !sl) return;

		// Collapse progressive typing/dictation: "when", "when is", "when is dinner"
		// are one phrase mid-flight, so replace the newest entry when one is a prefix
		// of the other instead of stacking three rows.
		const prev = this.history[0];
		if (prev && (en.startsWith(prev.en) || prev.en.startsWith(en))) {
			this.history[0] = { en, sl, ts: now };
		} else {
			this.history.unshift({ en, sl, ts: now });
			if (this.history.length > MAX_HISTORY) this.history.length = MAX_HISTORY;
		}
		this.save(HKEY, this.history);
	}

	removeHistory(ts: number) {
		this.history = this.history.filter((e) => e.ts !== ts);
		this.save(HKEY, this.history);
	}

	clearHistory() {
		this.history = [];
		this.save(HKEY, this.history);
	}

	isStarred(en: string, sl: string) {
		en = en.trim();
		sl = sl.trim();
		return this.starred.some((e) => e.en === en && e.sl === sl);
	}

	toggleStar(en: string, sl: string, now: number) {
		en = en.trim();
		sl = sl.trim();
		if (!en || !sl) return;
		const i = this.starred.findIndex((e) => e.en === en && e.sl === sl);
		if (i >= 0) this.starred.splice(i, 1);
		else this.starred.unshift({ en, sl, ts: now });
		this.save(SKEY, this.starred);
	}

	removeStar(ts: number) {
		this.starred = this.starred.filter((e) => e.ts !== ts);
		this.save(SKEY, this.starred);
	}
}

export const store = new Store();
