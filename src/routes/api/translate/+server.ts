import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const key = env.DEEPL_API_KEY;
	if (!key) error(500, 'DEEPL_API_KEY is not set. Copy .env.example to .env and add your key.');

	const { text } = await request.json();
	if (typeof text !== 'string' || !text.trim()) return json({ translation: '' });

	// Free-tier keys end in ":fx" and are only accepted by the api-free host.
	const host = key.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com';

	const res = await fetch(`https://${host}/v2/translate`, {
		method: 'POST',
		headers: {
			Authorization: `DeepL-Auth-Key ${key}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ text: [text], source_lang: 'EN', target_lang: 'SL' })
	});

	if (!res.ok) error(res.status, `DeepL responded ${res.status}: ${await res.text()}`);

	const data = await res.json();
	return json({ translation: data.translations?.[0]?.text ?? '' });
};
