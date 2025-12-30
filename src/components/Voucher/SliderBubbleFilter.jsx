import React, { useState, useRef, useEffect } from "react";

const SliderBubbleFilter = ({
	activeFilters,
	onRemoveFilter,
	onClearAllFilters,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [visibleFilters, setVisibleFilters] = useState([]);
	const containerRef = useRef(null);

	useEffect(() => {
		updateVisibleFilters();
		setCurrentIndex(0);
	}, [activeFilters]);

	useEffect(() => {
		updateVisibleFilters();
		window.addEventListener("resize", updateVisibleFilters);
		return () => window.removeEventListener("resize", updateVisibleFilters);
	}, [currentIndex]);

	const updateVisibleFilters = () => {
		if (!containerRef.current) return;

		const containerWidth = containerRef.current.offsetWidth;
		let currentWidth = 0;
		let visibleCount = 0;

		const tempDiv = document.createElement("div");
		tempDiv.style.visibility = "hidden";
		tempDiv.style.position = "absolute";
		document.body.appendChild(tempDiv);

		for (let i = currentIndex; i < activeFilters.length; i++) {
			tempDiv.className =
				"flex gap-1 items-center px-[12px] py-[6px] bg-white rounded-2xl border border-blue-600";
			tempDiv.textContent = activeFilters[i];
			const filterWidth = tempDiv.offsetWidth + 12;

			if (currentWidth + filterWidth <= containerWidth - 96) {
				// Adjusted for navigation buttons
				currentWidth += filterWidth;
				visibleCount++;
			} else {
				// Show partial filter if there's still some space
				if (currentWidth < containerWidth - 96 && visibleCount === 0) {
					visibleCount = 1;
				}
				break;
			}
		}

		document.body.removeChild(tempDiv);

		setVisibleFilters(
			activeFilters.slice(
				currentIndex,
				currentIndex + Math.max(1, visibleCount)
			)
		);
	};

	const handlePrevious = () => {
		if (currentIndex > 0) {
			setCurrentIndex(prev => Math.max(0, prev - 1));
		}
	};

	const handleNext = () => {
		if (currentIndex < activeFilters.length - visibleFilters.length) {
			setCurrentIndex(prev => prev + 1);
		}
	};

	const FilterChip = ({ label }) => (
		<div className="flex gap-1 items-center px-[12px] py-[6px] bg-white rounded-2xl border border-blue-600  whitespace-normal">
			<div className="text-blue-600">{label}</div>
			<button
				onClick={() => onRemoveFilter(label)}
				className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-0.5 shrink-0"
				aria-label={`Hapus filter ${label}`}
			>
				<img
					loading="lazy"
					src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/1b2a72ef1255ffdf87864c1956c29adcd3f0da22ac86592fad18b4712481b8b7?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
					alt=""
					className="w-3.5 h-3.5"
				/>
			</button>
		</div>
	);

	if (activeFilters.length === 0) return null;

	const isAtStart = currentIndex === 0;
	const isAtEnd =
		currentIndex >= activeFilters.length - visibleFilters.length;

	return (
		<div className="flex items-center gap-3 p-4 bg-white">
			<button
				onClick={onClearAllFilters}
				className="text-xs font-semibold text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1 whitespace-nowrap"
			>
				Hapus Semua Filter
			</button>

			<div className="relative flex-1 min-w-0">
				<button
					onClick={handlePrevious}
					disabled={isAtStart}
					className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md z-10 ${
						isAtStart
							? "opacity-50 cursor-not-allowed"
							: "hover:bg-gray-50"
					}`}
					aria-label="Filter sebelumnya"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M10 12L6 8L10 4"
							stroke="#414141"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>

				<div
					ref={containerRef}
					className="flex gap-3 items-center overflow-hidden px-6"
				>
					<div className="flex gap-3 items-center transition-transform duration-300">
						{visibleFilters.map((filter, index) => (
							<FilterChip
								key={`${filter}-${index}`}
								label={filter}
							/>
						))}
					</div>
				</div>

				<button
					onClick={handleNext}
					disabled={isAtEnd}
					className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md z-10 ${
						isAtEnd
							? "opacity-50 cursor-not-allowed"
							: "hover:bg-gray-50"
					}`}
					aria-label="Filter selanjutnya"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6 12L10 8L6 4"
							stroke="#414141"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default SliderBubbleFilter;
