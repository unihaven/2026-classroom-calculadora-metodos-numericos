/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React from "react";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
	DropdownSection
} from "@nextui-org/react";
import { useEffect } from "react";

export default function App({
	method,
	setOnlyXi,
	setOnlyX,
	setOnlyF,
	setDespejar
}) {
	const [selectedKeys, setSelectedKeys] = React.useState(
		new Set(["Selecciona un método"])
	);

	const selectedValue = React.useMemo(
		() => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
		[selectedKeys]
	);

	useEffect(() => {
		method.current = selectedValue;
		["Punto Fijo", "Newton Raphson"].includes(selectedValue)
			? setOnlyXi(true)
			: setOnlyXi(false);
		["Derivar"].includes(selectedValue) ? setOnlyX(true) : setOnlyX(false);
		["Simplificar", "Expandir", "Factorizar"].includes(selectedValue)
			? setOnlyF(true)
			: setOnlyF(false);
		["Despejar"].includes(selectedValue)
			? setDespejar(true)
			: setDespejar(false);
	}, [selectedValue]);

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button variant="bordered" className="capitalize">
					{selectedValue}
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label="Single selection example"
				variant="flat"
				disallowEmptySelection
				selectionMode="single"
				selectedKeys={selectedKeys}
				onSelectionChange={setSelectedKeys}
			>
				<DropdownSection title="Métodos" showDivider>
					<DropdownItem key="Bisección">Bisección</DropdownItem>
					<DropdownItem key="Regla Falsa">Regla Falsa</DropdownItem>
					<DropdownItem key="Newton Raphson">Newton Raphson</DropdownItem>
					<DropdownItem key="Secante">Secante</DropdownItem>
					<DropdownItem key="Punto Fijo">Punto Fijo</DropdownItem>
				</DropdownSection>
				<DropdownSection title="Operaciones">
					<DropdownItem key="Despejar">Despejar</DropdownItem>
					<DropdownItem key="Simplificar">Simplificar</DropdownItem>
					<DropdownItem key="Derivar">Derivar</DropdownItem>
					<DropdownItem key="Expandir">Expandir</DropdownItem>
					<DropdownItem key="Factorizar">Factorizar</DropdownItem>
				</DropdownSection>
			</DropdownMenu>
		</Dropdown>
	);
}
