import * as React from "react";

function BreadcrumbNav({ navItems }) {
	return (
		<div className="flex gap-1.5 items-center w-full text-xs font-medium leading-tight min-h-[16px] text-neutral-500 max-md:max-w-full">
			<div className="flex flex-wrap gap-1.5 items-center self-stretch my-auto min-w-[240px] w-[662px]">
				{navItems.map((item, index) => (
					<React.Fragment key={index}>
						<div
							className={`self-stretch my-auto ${
								item.active ? "font-semibold text-blue-600" : ""
							}`}
						>
							{item.text}
						</div>
						{index < navItems.length - 1 && (
							<img
								loading="lazy"
								src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/3d8d7f2021b728c7d5a74d1c7d50145ed502b9e6e55b681885a23f72d8a1967e?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
								className="object-contain shrink-0 self-stretch my-auto w-4 aspect-[1.07]"
								alt=""
							/>
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
}

export default BreadcrumbNav;
