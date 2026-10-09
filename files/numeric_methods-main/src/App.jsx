/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-spaces-and-tabs */
import "./App.css";
import "//unpkg.com/mathlive";
import nerdamer from "nerdamer/nerdamer.core.js";
import "nerdamer/Algebra.js";
import "nerdamer/Calculus.js";
import "nerdamer/Solve.js";
import "nerdamer/Extra";
import { useState, useRef, useEffect } from "react";
import Dropdown from "./components/Dropdown";
import { Button, Input, Image } from "@nextui-org/react";
import { CiCalculator2 } from "react-icons/ci";
import an from "./assets/an_round.png";
import { VisuallyHidden, useSwitch } from "@nextui-org/react";
import { LiaPercentSolid } from "react-icons/lia";
import { IoInformationOutline } from "react-icons/io5";
import { RiSettings3Fill } from "react-icons/ri";
import DataTable from "./components/DataTable";
import {
	Biseccion,
	NewtonRaphson,
	ReglaFalsa,
	derivar,
	expandir,
	factorizar,
	puntoFijo,
	secante,
	simplificar,
	solveFor
} from "./utils/formulas";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem
} from "@nextui-org/react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter
} from "@nextui-org/react";
import Latex from "react-latex";

const regex = /^-?\d*\.?\d+(?:[eE][-+]?\d+)?$/;
const regexNoNegative = /^[0-9]+(?:\.[0-9]+)?(?:e[0-9]+)?$/;

function App(props) {
	const [value, setValue] = useState("");
	const [onlyXi, setOnlyXi] = useState(false);
	const [onlyX, setOnlyX] = useState(false);
	const [onlyF, setOnlyF] = useState(false);
	const [despejar, setDespejar] = useState(false);
	const [validation, setValidation] = useState({
		Xi: "default",
		Xs: "default",
		error: "default",
		maxI: "default"
	});
	const [result, setResult] = useState({
		columns: [],
		rows: [],
		method: "",
		steps: []
	});
	const [eq, setEq] = useState({
		index: -1,
		f: "",
		multiple: false
	});

	const [message, setMessage] = useState("");
	const method = useRef("");
	const Xi = useRef();
	const Xs = useRef();
	const error = useRef();

	const [infoIsOpen, setInfoOpen] = useState(false);
	const [settingsIsOpen, setSettingsOpen] = useState(false);
	const [maxIterations, setMaxIterations] = useState(50);

	const send = (e) => {
		e.preventDefault();
		setMessage("");
		setResult({
			columns: [],
			rows: [],
			method: "",
			steps: []
		});
		const f = nerdamer.convertFromLaTeX(mf.current.value).toString();

		if (method.current === "Bisección") {
			const { rows, fList } = Biseccion(
				Xi.current.value,
				Xs.current.value,
				error.current.value,
				isSelected,
				f,
				maxIterations
			);

			if (rows.length === 0) {
				setMessage("No hay raíces en el intervalo dado.");
				return;
			}
			setMessage("");

			setResult({
				columns: [
					"Iteración",
					"Xi",
					"Xs",
					"Xr",
					"F(Xi)",
					"F(Xs)",
					"F(Xr)",
					"Error"
				],
				rows,
				method: "Bisección",
				steps: fList
			});
		}

		if (method.current === "Regla Falsa") {
			const { rows, fList } = ReglaFalsa(
				Xi.current.value,
				Xs.current.value,
				error.current.value,
				isSelected,
				f,
				maxIterations
			);

			if (rows.length === 0) {
				setMessage("No hay raíces en el intervalo dado.");
				return;
			}
			setMessage("");

			setResult({
				columns: [
					"Iteración",
					"Xi",
					"Xs",
					"Xr",
					"F(Xi)",
					"F(Xs)",
					"F(Xr)",
					"Error"
				],
				rows,
				method: "Regla Falsa",
				steps: fList
			});
		}

		if (method.current === "Newton Raphson") {
			const { rows, fList } = NewtonRaphson(
				Xi.current.value,
				error.current.value,
				isSelected,
				f,
				maxIterations
			);

			if (rows.length === 0) {
				setMessage("No se encontró la raíz. Intente con otro valor de Xi.");
				return;
			}
			setMessage("");

			setResult({
				columns: ["Iteración", "Xi", "F(Xi)", "F'(Xi)", "Xi+1", "Error"],
				rows,
				method: "Newton Raphson",
				steps: fList
			});
		}

		if (method.current === "Derivar") {
			const derivates = derivar(f, Xi.current.value, Xs.current.value);
			setResult({
				columns: [],
				rows: [],
				method: "Derivar",
				steps: derivates
			});
		}

		if (method.current === "Simplificar") {
			const steps = simplificar(f);
			setResult({
				columns: [],
				rows: [],
				method: "Simplificar",
				steps
			});
		}

		if (method.current === "Expandir") {
			const steps = expandir(f);
			setResult({
				columns: [],
				rows: [],
				method: "Expandir",
				steps
			});
		}

		if (method.current === "Despejar") {
			const steps = solveFor(f, Xi.current.value);
			setResult({
				columns: [],
				rows: [],
				method: "Despejar",
				steps
			});
		}

		if (method.current === "Factorizar") {
			const steps = factorizar(f);
			setResult({
				columns: [],
				rows: [],
				method: "Factorizar",
				steps
			});
		}

		if (method.current === "Secante") {
			const { rows } = secante(
				Xi.current.value,
				Xs.current.value,
				f,
				error.current.value,
				isSelected,
				maxIterations
			);

			if (rows.length === 0) {
				setMessage("No se encontró la raíz.");
				return;
			}
			setMessage("");

			setResult({
				columns: [
					"Iteración",
					"Xi",
					"Xi-1",
					"Xi+1",
					"F(Xi-1)",
					"F(Xi)",
					"Error"
				],
				rows,
				method: "Secante",
				steps: []
			});
		}

		if (method.current === "Punto Fijo") {
			setEq({
				index: -1,
				f: "",
				multiple: false
			});
			const equations = solveFor(f, "x");

			if (equations.length > 1) {
				setResult({
					columns: [],
					rows: [],
					method: "Despejar",
					steps: equations
				});

				setEq({
					index: -1,
					f: "",
					multiple: true
				});

				return;
			}
			console.log(Xi.current.value, error.current.value);
			console.log(equations[0].f);
			const nf = nerdamer.convertFromLaTeX(equations[0].f);
			console.log(nf.toString());

			const { rows, fList } = puntoFijo(
				Xi.current.value,
				nerdamer.convertFromLaTeX(equations[0].f).toString(),
				error.current.value,
				isSelected,
				maxIterations
			);

			if (rows.length === 0) {
				setMessage("No se encontró la raíz.");
				return;
			}
			setMessage("");
			setResult({
				rows: rows,
				columns: ["Iteración", "Xi", "Xi+1", "Error"],
				method: "Punto Fijo",
				steps: fList
			});
		}
	};

	const {
		Component,
		slots,
		isSelected,
		getBaseProps,
		getInputProps,
		getWrapperProps
	} = useSwitch(props);

	// Customize the mathfield when it is mounted
	const mf = useRef();
	useEffect(() => {
		// Read more about customizing the mathfield: https://cortexjs.io/mathlive/guides/customizing/
		mf.current.smartFence = true;
		mf.current.focus();

		mf.current.addEventListener("input", (evt) => {
			// When the return key is pressed, play a sound
			evt.preventDefault();
			evt.stopPropagation();
			if (evt.inputType === "insertLineBreak") {
				// The mathfield is available as `evt.target`
				// The mathfield can be controlled with `executeCommand`
				// Read more: https://cortexjs.io/mathlive/guides/commands/
				evt.target.executeCommand("plonk");
				// console.log(
				// 	nerdamer
				// 		.diff(nerdamer.convertFromLaTeX(mf.current.value).toString(), "x")
				// 		.evaluate({ x: Xi.current.value })
				// 		.toString()
				// );
				const f = nerdamer.convertFromLaTeX(mf.current.value).toString();
				//const e = nerdamer(f).evaluate({ x: 2 }).text("decimals");
				//console.log(mf.current.value);
				console.log(f);
				//console.log(e);
				//console.log(nerdamer("ln(3x)").evaluate({ x: 2 }).text("decimals"));
			}
		});

		const maxI = localStorage.getItem("maxIterations");
		if (maxI) setMaxIterations(maxI);
	}, []);

	// Update the mathfield when the value changes
	useEffect(() => {
		mf.current.value = value;
	}, [value]);

	useEffect(() => {
		if (method.current !== "Punto Fijo") return;
		if (eq.index === -1) return;

		const { rows, fList } = puntoFijo(
			Xi.current.value,
			eq.f,
			error.current.value,
			isSelected
		);
		if (rows.length === 0) {
			setMessage("No se encontró la raíz.");
			return;
		}
		setMessage("");
		setResult({
			rows: rows,
			columns: ["Iteración", "Xi", "Xi+1", "Error"],
			method: "Punto Fijo",
			steps: fList
		});
	}, [eq]);

	return (
		<form className="App" onSubmit={send}>
			<Navbar id="Navbar">
				<NavbarBrand id="navbarBrand" style={{ display: "flex", gap: "10px" }}>
					<Image
						id="logo"
						src={an}
						alt="Análisis Numérico"
						width={70}
						height={70}
					/>
					<p className="font-bold text-lg">Análisis Numérico</p>
				</NavbarBrand>
				<NavbarContent id="navbarContent">
					<NavbarItem>
						<Button
							onPress={() => setInfoOpen(!infoIsOpen)}
							isIconOnly
							variant="flat"
							color="primary"
							aria-label="info"
						>
							<IoInformationOutline />
						</Button>
					</NavbarItem>
					<NavbarItem>
						<Button
							onPress={() => setSettingsOpen(!settingsIsOpen)}
							isIconOnly
							color="primary"
							variant="flat"
						>
							<RiSettings3Fill />
						</Button>
					</NavbarItem>
				</NavbarContent>
			</Navbar>
			<div className="inputs">
				<math-field ref={mf} onInput={(evt) => setValue(evt.target.value)}>
					{value}
				</math-field>
				{onlyF ? (
					<></>
				) : (
					<div className="xDivider flex justify-between gap-4">
						<div className="flex gap-2">
							<Input
								placeholder={onlyX || despejar ? "Variable" : "Xi"}
								className="w-32"
								isRequired
								ref={Xi}
								color={validation.Xi}
								onChange={(e) => {
									if (
										!regex.test(e.target.value) &&
										e.target.value !== "" &&
										!onlyX &&
										!despejar
									) {
										setMessage("Xi debe ser un número");
										setValidation({ ...validation, Xi: "danger" });
									} else {
										setMessage("");
										setValidation({ ...validation, Xi: "default" });
									}
								}}
							/>
							{onlyXi || despejar ? (
								<></>
							) : (
								<Input
									placeholder={onlyX ? "# Derivada" : "Xs"}
									className="w-32"
									ref={Xs}
									isRequired
									color={validation.Xs}
									onChange={(e) => {
										if (!regex.test(e.target.value) && e.target.value !== "") {
											setMessage("Xs debe ser un número");
											setValidation({ ...validation, Xs: "danger" });
										} else {
											setMessage("");
											setValidation({ ...validation, Xs: "default" });
										}
									}}
								/>
							)}
						</div>
						{onlyX || despejar ? (
							<></>
						) : (
							<div className="flex justify-start gap-2">
								<Input
									placeholder="Error"
									className="w-52"
									ref={error}
									isRequired
									color={validation.error}
									onChange={(e) => {
										if (!regex.test(e.target.value) && e.target.value !== "") {
											setMessage("El error aproximado debe ser un número");
											setValidation({ ...validation, error: "danger" });
										} else {
											setMessage("");
											setValidation({ ...validation, error: "default" });
										}
									}}
								/>
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
													"rounded-lg bg-default-100 hover:bg-default-200"
												]
											})}
										>
											<LiaPercentSolid />
										</div>
									</Component>
								</div>
							</div>
						)}
					</div>
				)}
				<div className="controllers">
					<Dropdown
						method={method}
						setOnlyXi={setOnlyXi}
						setOnlyX={setOnlyX}
						setOnlyF={setOnlyF}
						setDespejar={setDespejar}
					/>
					<Button
						color="primary"
						variant="ghost"
						endContent={<CiCalculator2 />}
						type="submit"
					>
						Calcular
					</Button>
				</div>
			</div>
			{message ? (
				<h4>{message}</h4>
			) : (
				<div className="flex items-center flex-col gap-3">
					{method.current === "Punto Fijo"
						? result.steps.map((step, index) => (
								<div key={"step " + index} id="puntoFijoEquations">
									<math-field
										style={{
											borderRadius: eq.multiple ? "8px 0 0 8px" : "8px"
										}}
										read-only
									>
										{step.label + step.f}
									</math-field>
									{eq.multiple ? (
										<button
											className={eq.index === index ? "active" : ""}
											onClick={() =>
												setEq({
													index,
													f: nerdamer.convertFromLaTeX(step.f).toString()
												})
											}
											aria-label="Take a photo"
											//type="submit"
										>
											<CiCalculator2 />
										</button>
									) : (
										<></>
									)}
								</div>
						  ))
						: result.steps.map((step, index) => (
								<math-field key={"step " + index} read-only style={{}}>
									{step.label + step.f}
								</math-field>
						  ))}

					<div className="w-full overflow-auto">
						<div className="w-full table table-fixed">
							<DataTable
								columns={result.columns}
								rows={result.rows}
								method={result.method}
							/>
						</div>
					</div>
				</div>
			)}
			<Modal isOpen={infoIsOpen} onClose={() => setInfoOpen(false)}>
				<ModalContent>
					{() => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Recomendaciones
							</ModalHeader>
							<ModalBody>
								<Latex>
									Encierra expresiones con exponentes entre paréntesis de alguna
									de las siguientes formas: \( (a)^b \) o \( (a^b) \).
								</Latex>
								<Latex>
									Las funciones trigonométricas y logaritmos deben llevar
									paréntesis: sin(x), log(2x), \(ln(x)^3 \).
								</Latex>
								<p>
									El programa solo resuelve con respecto a la variable x, en el
									método de punto fijo se despeja x y se usa k para evaluar.
								</p>
								<Latex>
									Para usar notación científica se reemplaza x10 por e, por
									ejemplo, \(5x10^4\) = 5e4
								</Latex>
								<p>
									Los exponentes compuestos deben estar entre paréntesis, por
									ejemplo: a^(b-c+1).
								</p>
								<p>Para multiplicar es recomendable usar paréntesis.</p>
								<p>No se utilizan espacios en blanco.</p>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={() => setInfoOpen(false)}
								>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<Modal
				isOpen={settingsIsOpen}
				onClose={() => {
					const maxI = localStorage.getItem("maxIterations");
					if (maxI) setMaxIterations(maxI);
					else setMaxIterations(50);
					setSettingsOpen(false);
				}}
			>
				<ModalContent>
					{() => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Configuración
							</ModalHeader>
							<ModalBody>
								<Input
									size="lg"
									value={maxIterations}
									label="Máximo de iteraciones"
									color={validation.maxI}
									onChange={(e) => {
										if (
											!regexNoNegative.test(e.target.value) &&
											e.target.value !== ""
										) {
											setValidation({ ...validation, maxI: "danger" });
										} else {
											setValidation({ ...validation, maxI: "default" });
										}
										setMaxIterations(e.target.value);
									}}
								/>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={() => {
										const maxI = localStorage.getItem("maxIterations");
										if (maxI) setMaxIterations(maxI);
										else setMaxIterations(50);
										setSettingsOpen(false);
									}}
								>
									Close
								</Button>
								<Button
									color="primary"
									variant="solid"
									onPress={() => {
										localStorage.setItem("maxIterations", maxIterations);
										setSettingsOpen(false);
									}}
								>
									Aceptar
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</form>
	);
}

export default App;
