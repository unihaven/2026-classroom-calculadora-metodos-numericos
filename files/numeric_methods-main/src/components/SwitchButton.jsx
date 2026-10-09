import { VisuallyHidden, useSwitch } from "@nextui-org/react";
import { useEffect } from "react";
import { LiaPercentSolid } from "react-icons/lia";

const ThemeSwitch = (props) => {
	const {
		Component,
		slots,
		isSelected,
		getBaseProps,
		getInputProps,
		getWrapperProps,
	} = useSwitch(props);

	useEffect(() => {
		console.log(isSelected);
	}, [isSelected]);

	return (
		<div className="flex flex-col gap-2">
			<Component {...getBaseProps()}>
				<VisuallyHidden>
					<input {...getInputProps()} />
				</VisuallyHidden>
				<div
					{...getWrapperProps()}
					className={slots.wrapper({
						class: [
							"w-10 h-10",
							"flex items-center justify-center",
							"rounded-lg bg-default-100 hover:bg-default-200",
						],
					})}
				>
					<LiaPercentSolid />
				</div>
			</Component>
		</div>
	);
};

export default function App() {
	return <ThemeSwitch />;
}
