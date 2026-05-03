import { useEffect, useState } from 'react';
import LetterGlitch from './LetterGlitch.jsx';

const THEMES = {
	light: {
		colors: ['#3858D6', '#5AA9C8', '#C8B4CC'],
		speed: 66,
	},
	dark: {
		colors: ['#5227FF', '#FF9FFC', '#61B3DC'],
		speed: 48,
	},
};

function resolveTheme() {
	const selected = document.documentElement.getAttribute('data-theme') || 'auto';
	if (selected === 'light' || selected === 'dark') return selected;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function BlogLetterGlitch() {
	const [theme, setTheme] = useState('dark');
	const config = THEMES[theme];

	useEffect(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const updateTheme = () => setTheme(resolveTheme());
		const observer = new MutationObserver(updateTheme);

		updateTheme();
		observer.observe(document.documentElement, {
			attributeFilter: ['data-theme'],
			attributes: true,
		});
		media.addEventListener('change', updateTheme);

		return () => {
			observer.disconnect();
			media.removeEventListener('change', updateTheme);
		};
	}, []);

	return (
		<LetterGlitch
			className={`letter-glitch-container letter-glitch-theme-${theme}`}
			glitchColors={config.colors}
			glitchSpeed={config.speed}
			centerVignette={false}
			outerVignette={false}
			smooth={true}
			characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]/\\|=_+-.:;"
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 0,
				width: '100vw',
				height: '100vh',
				pointerEvents: 'none',
				background: 'var(--liquid-bg)',
				filter: 'var(--liquid-filter)',
				transition: 'background 0.35s ease, filter 0.35s ease',
			}}
		/>
	);
}
