import { useEffect, useState } from 'react';
import ClickSpark from './ClickSpark.jsx';

function resolveTheme() {
	const selected = document.documentElement.getAttribute('data-theme') || 'auto';
	if (selected === 'light' || selected === 'dark') return selected;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function BlogClickSpark() {
	const [theme, setTheme] = useState('dark');

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
		<ClickSpark
			sparkColor={theme === 'dark' ? '#b4c2ff' : '#2337ff'}
			sparkSize={9}
			sparkRadius={18}
			sparkCount={8}
			duration={420}
			easing="ease-out"
			extraScale={1.05}
		/>
	);
}
