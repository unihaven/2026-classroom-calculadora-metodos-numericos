/* eslint-disable react/prop-types */
import {
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell
} from "@nextui-org/react";
import { useState } from "react";
import { useEffect } from "react";

export default function DataTable({ columns, rows, method }) {
	const [m, setM] = useState(0);

	useEffect(() => {
		if (["Newton Raphson"].includes(method)) {
			setM(4);
		}
		if (["Regla Falsa", "Bisección", "Secante"].includes(method)) {
			setM(3);
		}
		if (["Punto Fijo"].includes(method)) {
			setM(2);
		}
	}, [method]);

	if (columns.length === 0 || rows.length === 0) {
		return <></>;
	}
	return (
		<Table id="mainTable" aria-label="roots" className="">
			<TableHeader>
				{columns.map((column, i) => (
					<TableColumn key={"column " + i}>{column}</TableColumn>
				))}
			</TableHeader>
			<TableBody>
				{rows.map((row, i) => {
					return (
						<TableRow key={"row " + i}>
							{row.map((cell, j) => (
								<TableCell
									className={
										i === rows.length - 1 && j === m
											? "bg-cyan-500 text-xs"
											: "text-xs"
									}
									key={"cell " + j}
								>
									{cell}
								</TableCell>
							))}
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
