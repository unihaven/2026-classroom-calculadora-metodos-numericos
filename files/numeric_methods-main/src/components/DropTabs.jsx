/* eslint-disable react/prop-types */
import { Tabs, Tab } from "@nextui-org/react";

export default function DropTabs({ children1, type, children2, type2 }) {
	return (
		<div className="flex w-full flex-col">
			<Tabs aria-label="Options">
				<Tab key={type} title={type}>
					{children1}
				</Tab>
				<Tab key={type2} title={type2}>
					{children2}
				</Tab>
			</Tabs>
		</div>
	);
}
