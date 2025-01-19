import type { Reroute } from '@sveltejs/kit';

export const reroute: Reroute = ({ url }) => {
	if (url.pathname.startsWith('/p/')) {
		return `/pengumpulan/${url.pathname.split('/p/')[1]}`;
	}
};
