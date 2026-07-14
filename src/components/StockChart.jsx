import { useEffect, useMemo, useRef, useState } from 'react';

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 2,
});

function formatValue(value, includeSign = true) {
	const prefix = includeSign && value > 0 ? '+' : '';
	return `${prefix}${NUMBER_FORMATTER.format(value)}`;
}

function formatDate(date) {
	return new Intl.DateTimeFormat('en-US', {
		month: '2-digit',
		day: '2-digit',
	}).format(new Date(`${date}T00:00:00`));
}

function resolveTheme() {
	const selected = document.documentElement.getAttribute('data-theme') || 'auto';
	if (selected === 'light' || selected === 'dark') return selected;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getThemeColors(theme) {
	return theme === 'dark'
		? {
			grid: 'rgba(150, 165, 195, 0.18)',
			axis: 'rgba(210, 215, 225, 0.64)',
			positive: '#70e1b5',
			positiveSoft: 'rgba(112, 225, 181, 0.24)',
			negative: '#ff7890',
			negativeSoft: 'rgba(255, 120, 144, 0.22)',
			line: '#aebaff',
			lineFill: 'rgba(107, 131, 255, 0.1)',
			tooltip: 'rgba(15, 18, 30, 0.94)',
			tooltipText: '#f2f4ff',
		}
		: {
			grid: 'rgba(96, 115, 159, 0.16)',
			axis: 'rgba(34, 41, 57, 0.62)',
			positive: '#168b68',
			positiveSoft: 'rgba(22, 139, 104, 0.18)',
			negative: '#d84a64',
			negativeSoft: 'rgba(216, 74, 100, 0.16)',
			line: '#4d66e8',
			lineFill: 'rgba(77, 102, 232, 0.08)',
			tooltip: 'rgba(255, 255, 255, 0.96)',
			tooltipText: '#171b28',
		};
}

export default function StockChart({ entries }) {
	const canvasRef = useRef(null);
	const shellRef = useRef(null);
	const [theme, setTheme] = useState('dark');
	const [activeIndex, setActiveIndex] = useState(null);

	const chartData = useMemo(() => {
		let cumulative = 0;
		return entries.map((entry) => {
			cumulative += entry.value;
			return { ...entry, cumulative };
		});
	}, [entries]);

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

	useEffect(() => {
		const canvas = canvasRef.current;
		const shell = shellRef.current;
		if (!canvas || !shell || chartData.length === 0) return undefined;

		const draw = () => {
			const rect = shell.getBoundingClientRect();
			const width = Math.max(240, Math.floor(rect.width));
			const height = width < 390 ? 300 : width < 560 ? 330 : 390;
			const ratio = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = width * ratio;
			canvas.height = height * ratio;
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			const fontFamily = getComputedStyle(document.body).fontFamily || 'sans-serif';
			ctx.scale(ratio, ratio);
			ctx.clearRect(0, 0, width, height);

			const colors = getThemeColors(theme);
			const compact = width < 560;
			const padding = compact
				? { top: 28, right: 18, bottom: 42, left: 42 }
				: { top: 34, right: 52, bottom: 46, left: 58 };
			const chartWidth = width - padding.left - padding.right;
			const chartHeight = height - padding.top - padding.bottom;
			const baseline = padding.top + chartHeight / 2;
			const step = chartWidth / chartData.length;
			const maxDaily = Math.max(...chartData.map((item) => Math.abs(item.value)), 1);
			const dailyLimit = Math.ceil((maxDaily * 1.18) / 100) * 100;
			const dailyScale = chartHeight / 2 / dailyLimit;
			const cumulativeValues = chartData.map((item) => item.cumulative);
			const cumulativeMin = Math.min(...cumulativeValues);
			const cumulativeMax = Math.max(...cumulativeValues);
			const cumulativeRange = Math.max(cumulativeMax - cumulativeMin, 1);
			const cumulativeFloor = cumulativeMin - cumulativeRange * 0.16;
			const cumulativeCeiling = cumulativeMax + cumulativeRange * 0.16;
			const cumulativeY = (value) =>
				padding.top +
				((cumulativeCeiling - value) / (cumulativeCeiling - cumulativeFloor)) * chartHeight;

			ctx.font = `${compact ? 10 : 11}px ${fontFamily}`;
			ctx.textBaseline = 'middle';
			ctx.lineWidth = 1;

			for (const multiplier of [-1, -0.5, 0, 0.5, 1]) {
				const y = baseline - multiplier * dailyLimit * dailyScale;
				ctx.beginPath();
				ctx.strokeStyle = multiplier === 0 ? colors.axis : colors.grid;
				ctx.setLineDash(multiplier === 0 ? [] : [4, 5]);
				ctx.moveTo(padding.left, y);
				ctx.lineTo(width - padding.right, y);
				ctx.stroke();

				if (!compact || multiplier === 0) {
					ctx.fillStyle = colors.axis;
					ctx.textAlign = 'right';
					ctx.fillText(formatValue(multiplier * dailyLimit, false), padding.left - 9, y);
				}
			}
			ctx.setLineDash([]);

			chartData.forEach((item, index) => {
				const centerX = padding.left + step * index + step / 2;
				const barWidth = Math.max(6, Math.min(22, step * 0.52));
				const barHeight = Math.max(2, Math.abs(item.value) * dailyScale);
				const barY = item.value >= 0 ? baseline - barHeight : baseline;
				const isActive = index === activeIndex;

				ctx.fillStyle = item.value >= 0
					? (isActive ? colors.positive : colors.positiveSoft)
					: (isActive ? colors.negative : colors.negativeSoft);
				ctx.beginPath();
				ctx.roundRect(centerX - barWidth / 2, barY, barWidth, barHeight, 4);
				ctx.fill();
			});

			const areaGradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
			areaGradient.addColorStop(0, colors.lineFill);
			areaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
			ctx.beginPath();
			chartData.forEach((item, index) => {
				const x = padding.left + step * index + step / 2;
				const y = cumulativeY(item.cumulative);
				if (index === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			});
			const lastX = padding.left + step * (chartData.length - 1) + step / 2;
			const firstX = padding.left + step / 2;
			ctx.lineTo(lastX, height - padding.bottom);
			ctx.lineTo(firstX, height - padding.bottom);
			ctx.closePath();
			ctx.fillStyle = areaGradient;
			ctx.fill();

			ctx.beginPath();
			chartData.forEach((item, index) => {
				const x = padding.left + step * index + step / 2;
				const y = cumulativeY(item.cumulative);
				if (index === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			});
			ctx.strokeStyle = colors.line;
			ctx.lineWidth = 2.4;
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			ctx.stroke();

			chartData.forEach((item, index) => {
				const x = padding.left + step * index + step / 2;
				const y = cumulativeY(item.cumulative);
				if (index === activeIndex || index === chartData.length - 1) {
					ctx.beginPath();
					ctx.arc(x, y, index === activeIndex ? 4.5 : 3, 0, Math.PI * 2);
					ctx.fillStyle = colors.line;
					ctx.fill();
					ctx.lineWidth = 2;
					ctx.strokeStyle = theme === 'dark' ? '#171b28' : '#ffffff';
					ctx.stroke();
				}
			});

			const tickEvery = width < 390 ? 5 : compact ? 4 : chartData.length > 10 ? 2 : 1;
			chartData.forEach((item, index) => {
				if (index % tickEvery !== 0 && index !== chartData.length - 1) return;
				const x = padding.left + step * index + step / 2;
				ctx.fillStyle = colors.axis;
				ctx.textAlign = 'center';
				ctx.fillText(formatDate(item.date), x, height - padding.bottom + 24);
			});

			if (!compact) {
				ctx.fillStyle = colors.axis;
				ctx.textAlign = 'left';
				ctx.fillText('Daily', 0, padding.top - 13);
				ctx.textAlign = 'right';
				ctx.fillText('Cumulative', width, padding.top - 13);
				ctx.fillText(formatValue(cumulativeMax), width - 2, cumulativeY(cumulativeMax));
				ctx.fillText(formatValue(cumulativeMin), width - 2, cumulativeY(cumulativeMin));
			}

			if (Number.isInteger(activeIndex)) {
				const active = chartData[activeIndex];
				const pointX = padding.left + step * activeIndex + step / 2;
				const boxWidth = compact ? 132 : 146;
				const boxHeight = 64;
				const boxX = Math.min(
					Math.max(pointX - boxWidth / 2, padding.left),
					width - padding.right - boxWidth,
				);
				const lineY = cumulativeY(active.cumulative);
				const preferredBoxY = lineY < padding.top + boxHeight + 14
					? lineY + 14
					: lineY - boxHeight - 14;
				const boxY = Math.min(
					Math.max(preferredBoxY, padding.top),
					height - padding.bottom - boxHeight,
				);

				ctx.beginPath();
				ctx.setLineDash([3, 5]);
				ctx.strokeStyle = colors.grid;
				ctx.lineWidth = 1;
				ctx.moveTo(pointX, padding.top);
				ctx.lineTo(pointX, height - padding.bottom);
				ctx.stroke();
				ctx.setLineDash([]);

				ctx.fillStyle = colors.tooltip;
				ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
				ctx.shadowBlur = 18;
				ctx.beginPath();
				ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 10);
				ctx.fill();
				ctx.shadowBlur = 0;
				ctx.fillStyle = colors.tooltipText;
				ctx.textAlign = 'left';
				ctx.font = `600 11px ${fontFamily}`;
				ctx.fillText(formatDate(active.date), boxX + 12, boxY + 16);
				ctx.font = `12px ${fontFamily}`;
				ctx.fillText(`Daily ${formatValue(active.value)}`, boxX + 12, boxY + 34);
				ctx.fillText(`Total ${formatValue(active.cumulative)}`, boxX + 12, boxY + 51);
			}
		};

		draw();
		const resizeObserver = new ResizeObserver(draw);
		resizeObserver.observe(shell);
		return () => resizeObserver.disconnect();
	}, [activeIndex, chartData, theme]);

	function handlePointerMove(event) {
		const canvas = canvasRef.current;
		if (!canvas || chartData.length === 0) return;
		const rect = canvas.getBoundingClientRect();
		const compact = rect.width < 560;
		const left = compact ? 42 : 58;
		const right = compact ? 18 : 52;
		const chartWidth = rect.width - left - right;
		const step = chartWidth / chartData.length;
		const relativeX = event.clientX - rect.left - left - step / 2;
		const index = Math.round(relativeX / step);
		setActiveIndex(Math.min(chartData.length - 1, Math.max(0, index)));
	}

	return (
		<div className="stock-chart-shell" ref={shellRef}>
			<div className="stock-chart-legend" aria-hidden="true">
				<span><i className="legend-bar positive" />Daily gain</span>
				<span><i className="legend-bar negative" />Daily loss</span>
				<span><i className="legend-line" />Cumulative</span>
			</div>
			<canvas
				ref={canvasRef}
				onPointerMove={handlePointerMove}
				onPointerDown={handlePointerMove}
				onPointerLeave={() => setActiveIndex(null)}
				onPointerCancel={() => setActiveIndex(null)}
				role="img"
				aria-label="Daily profit and loss bars with a cumulative performance line. Values have no unit."
			/>
			<div className="sr-only">
				<table>
					<caption>Daily and cumulative profit and loss</caption>
					<thead>
						<tr><th>Date</th><th>Daily</th><th>Cumulative</th></tr>
					</thead>
					<tbody>
						{chartData.map((item) => (
							<tr key={item.date}>
								<td>{item.date}</td>
								<td>{formatValue(item.value)}</td>
								<td>{formatValue(item.cumulative)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
