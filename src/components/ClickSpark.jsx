import { useCallback, useEffect, useRef } from 'react';

const ClickSpark = ({
	sparkColor = '#fff',
	sparkSize = 10,
	sparkRadius = 15,
	sparkCount = 8,
	duration = 400,
	easing = 'ease-out',
	extraScale = 1,
	className = '',
	style = {},
}) => {
	const canvasRef = useRef(null);
	const sparksRef = useRef([]);

	const resizeCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const width = window.innerWidth;
		const height = window.innerHeight;
		canvas.width = Math.floor(width * dpr);
		canvas.height = Math.floor(height * dpr);
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;

		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}
	}, []);

	useEffect(() => {
		let resizeTimeout;
		const handleResize = () => {
			window.clearTimeout(resizeTimeout);
			resizeTimeout = window.setTimeout(resizeCanvas, 100);
		};

		resizeCanvas();
		window.addEventListener('resize', handleResize);

		return () => {
			window.clearTimeout(resizeTimeout);
			window.removeEventListener('resize', handleResize);
		};
	}, [resizeCanvas]);

	const easeFunc = useCallback(
		(t) => {
			switch (easing) {
				case 'linear':
					return t;
				case 'ease-in':
					return t * t;
				case 'ease-in-out':
					return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
				default:
					return t * (2 - t);
			}
		},
		[easing],
	);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animationId;
		const draw = (timestamp) => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			ctx.clearRect(0, 0, width, height);

			sparksRef.current = sparksRef.current.filter((spark) => {
				const elapsed = timestamp - spark.startTime;
				if (elapsed >= duration) return false;

				const progress = elapsed / duration;
				const eased = easeFunc(progress);
				const distance = eased * sparkRadius * extraScale;
				const lineLength = sparkSize * (1 - eased);
				const x1 = spark.x + distance * Math.cos(spark.angle);
				const y1 = spark.y + distance * Math.sin(spark.angle);
				const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
				const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

				ctx.strokeStyle = sparkColor;
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.stroke();

				return true;
			});

			animationId = window.requestAnimationFrame(draw);
		};

		animationId = window.requestAnimationFrame(draw);

		return () => {
			window.cancelAnimationFrame(animationId);
		};
	}, [duration, easeFunc, extraScale, sparkColor, sparkRadius, sparkSize]);

	useEffect(() => {
		const handleClick = (event) => {
			const now = performance.now();
			const newSparks = Array.from({ length: sparkCount }, (_, index) => ({
				x: event.clientX,
				y: event.clientY,
				angle: (2 * Math.PI * index) / sparkCount,
				startTime: now,
			}));

			sparksRef.current.push(...newSparks);
		};

		window.addEventListener('click', handleClick, { passive: true });

		return () => {
			window.removeEventListener('click', handleClick);
		};
	}, [sparkCount]);

	return (
		<canvas
			ref={canvasRef}
			className={`click-spark-canvas ${className}`}
			aria-hidden="true"
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 20,
				display: 'block',
				pointerEvents: 'none',
				userSelect: 'none',
				...style,
			}}
		/>
	);
};

export default ClickSpark;
