/**
 * Slovenian text-to-speech via the browser's built-in voices. Shared so the
 * translator and the list pages all pronounce through one voice + one state.
 */
class Speech {
	voice = $state<SpeechSynthesisVoice | null>(null);
	voicesLoaded = $state(false);
	/** Text currently being spoken, so any row rendering that text can show it's active. */
	speakingText = $state<string | null>(null);

	private started = false;

	get missingVoice() {
		return this.voicesLoaded && !this.voice;
	}

	/** Idempotent — safe to call from the root layout on every mount. */
	init() {
		if (this.started || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
		this.started = true;

		const load = () => {
			const all = speechSynthesis.getVoices();
			if (!all.length) return;
			this.voicesLoaded = true;
			this.voice = all.find((v) => v.lang.toLowerCase().startsWith('sl')) ?? null;
		};

		load();
		speechSynthesis.addEventListener('voiceschanged', load);
	}

	speak(text: string) {
		if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
		text = text.trim();
		if (!text) return;

		speechSynthesis.cancel();

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = 'sl-SI';
		if (this.voice) utterance.voice = this.voice;
		utterance.rate = 0.85; // a touch slow — you're reading along to pronounce it

		utterance.onstart = () => (this.speakingText = text);
		utterance.onend = () => {
			if (this.speakingText === text) this.speakingText = null;
		};
		utterance.onerror = () => {
			if (this.speakingText === text) this.speakingText = null;
		};

		speechSynthesis.speak(utterance);
	}
}

export const speech = new Speech();
