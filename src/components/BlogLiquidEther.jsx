import { useEffect, useState } from 'react';
import LiquidEther from './LiquidEther.jsx';

const THEMES = {
	light: {
		colors: ['#526DFF', '#70E1F5', '#D6B6D8'],
		autoIntensity: 2.15,
	},
	dark: {
		colors: ['#5227FF', '#FF9FFC', '#B497CF'],
		autoIntensity: 3.4,
	},
};

function resolveTheme() {
	const selected = document.documentElement.getAttribute('data-theme') || 'auto';
	if (selected === 'light' || selected === 'dark') return selected;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function BlogLiquidEther() {
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
		<LiquidEther
			className={`liquid-ether-theme-${theme}`}
			colors={config.colors}
			mouseForce={20}
			cursorSize={theme === 'dark' ? 110 : 96}
			isViscous={false}
			viscous={30}
			iterationsViscous={32}
			iterationsPoisson={32}
			resolution={theme === 'dark' ? 0.5 : 0.46}
			isBounce={false}
			autoDemo={true}
			autoSpeed={theme === 'dark' ? 0.55 : 0.42}
			autoIntensity={config.autoIntensity}
			takeoverDuration={0.25}
			autoResumeDelay={1800}
			autoRampDuration={0.6}
		/>
	);
}
