import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), VitePWA(
		{
			includeAssets: ['public/vite.svg', 'icons/*.png'],
			manifest: {
				'id': 'com.alator21.grandtichu',
				'name': 'Grand Tichu',
				'short_name': 'Grand Tichu',
				'start_url': '/',
				'display': 'standalone',
				'theme_color': '#ffffff',
				'background_color': '#ffffff',
				'description': 'Grand Tichu',
				'icons': [
					{
						'src': '/icons/card72.png',
						'sizes': '72x72',
						'type': 'image/png',
					},
					{
						'src': '/icons/card96.png',
						'sizes': '96x96',
						'type': 'image/png',
					},
					{
						'src': '/icons/card128.png',
						'sizes': '128x128',
						'type': 'image/png',
					},
					{
						'src': '/icons/card144.png',
						'sizes': '144x144',
						'type': 'image/png',
					},
					{
						'src': '/icons/card152.png',
						'sizes': '152x152',
						'type': 'image/png',
					},
					{
						'src': '/icons/card192.png',
						'sizes': '192x192',
						'type': 'image/png',
					},
					{
						'src': '/icons/card384.png',
						'sizes': '384x384',
						'type': 'image/png',
					},
					{
						'src': '/icons/card512.png',
						'sizes': '512x512',
						'type': 'image/png',
					},
				],
			},
		},
	)],
});

