import nerdamer from "nerdamer/nerdamer.core.js";
import "nerdamer/Algebra.js";
import "nerdamer/Calculus.js";
import "nerdamer/Solve.js";
import "nerdamer/Extra";
import { abs } from "mathjs";

nerdamer.setFunction("ln", "x", "log(x)");

const getXr = (Xi, Xs) => {
	return (Xi + Xs) / 2;
};

const getXrReglaFalsa = (Xi, Xs, fxi, fxs) => {
	return (Xs * fxi - Xi * fxs) / (fxi - fxs);
};

const getError = (Xr, oldXr, isPercentage = false) => {
	if (isPercentage) {
		return Math.abs(((Xr - oldXr) / Xr) * 100);
	}

	return Math.abs((Xr - oldXr) / Xr);
};

export const Biseccion = (Xi, Xs, error, isPercentage, f, maxI = 50) => {
	let xi = parseFloat(Xi);
	let xs = parseFloat(Xs);
	let err = parseFloat(error);

	let fxi = Math.sign(
		parseFloat(nerdamer(f).evaluate({ x: xi }).text("decimals"))
	);
	let fxs = Math.sign(
		parseFloat(nerdamer(f).evaluate({ x: xs }).text("decimals"))
	);

	if (fxi === fxs) {
		return {
			rows: [],
			fList: []
		};
	}

	let xr = getXr(xi, xs);
	let fxr = Math.sign(
		parseFloat(nerdamer(f).evaluate({ x: xr }).text("decimals"))
	);

	let errorXr = 1;
	let iterations = 1;
	const rows = [];
	rows.push([
		iterations,
		xi,
		xs,
		xr,
		fxi > 0 ? "+" : "-",
		fxs > 0 ? "+" : "-",
		fxr > 0 ? "+" : "-",
		" "
	]);

	while (errorXr > err && iterations < maxI) {
		if (fxi * fxr < 0) {
			xs = xr;
		} else {
			xi = xr;
		}

		let oldXr = xr;
		xr = getXr(xi, xs);
		fxi = Math.sign(
			parseFloat(nerdamer(f).evaluate({ x: xi }).text("decimals"))
		);
		fxs = Math.sign(
			parseFloat(nerdamer(f).evaluate({ x: xs }).text("decimals"))
		);
		fxr = Math.sign(
			parseFloat(nerdamer(f).evaluate({ x: xr }).text("decimals"))
		);
		errorXr = getError(xr, oldXr, isPercentage);
		iterations++;
		rows.push([
			iterations,
			xi,
			xs,
			xr,
			fxi > 0 ? "+" : "-",
			fxs > 0 ? "+" : "-",
			fxr > 0 ? "+" : "-",
			errorXr
		]);
	}

	return {
		rows,
		fList: []
	};
};

export const ReglaFalsa = (Xi, Xs, error, isPercentage, f, maxI = 50) => {
	let xi = parseFloat(Xi);
	let xs = parseFloat(Xs);
	let err = parseFloat(error);

	let fxi = parseFloat(nerdamer(f).evaluate({ x: xi }).text("decimals"));
	let fxs = parseFloat(nerdamer(f).evaluate({ x: xs }).text("decimals"));

	if (Math.sign(fxi) === Math.sign(fxs)) {
		return {
			rows: [],
			fList: []
		};
	}

	let xr = getXrReglaFalsa(xi, xs, fxi, fxs);
	let fxr = parseFloat(nerdamer(f).evaluate({ x: xr }).text("decimals"));

	let errorXr = 1;
	let iterations = 1;
	const rows = [];
	rows.push([iterations, xi, xs, xr, fxi, fxs, fxr, " "]);

	while (errorXr > err && iterations < maxI) {
		if (Math.sign(fxi) * Math.sign(fxr) < 0) {
			xs = xr;
		} else {
			xi = xr;
		}

		let oldXr = xr;
		xr = getXrReglaFalsa(xi, xs, fxi, fxs);
		fxi = parseFloat(nerdamer(f).evaluate({ x: xi }).text("decimals"));

		fxs = parseFloat(nerdamer(f).evaluate({ x: xs }).text("decimals"));

		fxr = parseFloat(nerdamer(f).evaluate({ x: xr }).text("decimals"));

		errorXr = getError(xr, oldXr, isPercentage);
		iterations++;
		rows.push([iterations, xi, xs, xr, fxi, fxs, fxr, errorXr]);
	}

	return {
		rows,
		fList: []
	};
};

const getXiPlus1 = (xi, fxi, fpxi) => {
	return xi - fxi / fpxi;
};

export const NewtonRaphson = (Xi, error, isPercentage, f, maxI = 50) => {
	try {
		let xi = parseFloat(Xi);
		let err = parseFloat(error);

		let fxi = parseFloat(nerdamer(f).evaluate({ x: xi }).text("decimals"));

		let fpxi = parseFloat(
			nerdamer.diff(f, "x").evaluate({ x: xi }).text("decimals")
		);

		let xiPlusOne = getXiPlus1(xi, fxi, fpxi);

		let errorXr = 1;
		let iterations = 1;
		const rows = [];
		rows.push([iterations, xi, fxi, fpxi, xiPlusOne, " "]);

		while (errorXr > err && iterations < maxI) {
			xi = xiPlusOne;
			fxi = parseFloat(nerdamer(f).evaluate({ x: xi }).text("decimals"));
			fpxi = parseFloat(
				nerdamer.diff(f, "x").evaluate({ x: xi }).text("decimals")
			);
			xiPlusOne = getXiPlus1(xi, fxi, fpxi);
			errorXr = getError(xiPlusOne, xi, isPercentage);
			iterations++;
			rows.push([iterations, xi, fxi, fpxi, xiPlusOne, errorXr]);
		}

		const LFPXi = nerdamer.diff(f, "x").toString();

		return {
			rows,
			fList: [
				{
					f: nerdamer.convertToLaTeX(LFPXi).toString(),
					label: "f'(x)="
				}
				/* {
					f: simplificar(LFPXi)[0].f,
					label: "f'(x)="
				} */
			]
		};
	} catch (e) {
		return {
			rows: [],
			fList: []
		};
	}
};

const gerXiPlusOne = (xi, fxi, ximinus1, fxiMinus1) => {
	const xiplusone = (fxi * ximinus1 - fxiMinus1 * xi) / (fxi - fxiMinus1);
	return xiplusone;
};

export const secante = (Xi, Xs, f, error, isPercentage, maxI = 50) => {
	try {
		let err = parseFloat(error);
		let xi = parseFloat(Xi);
		let ximinus1 = parseFloat(Xs);
		let fxi = parseFloat(nerdamer(f).evaluate({ x: xi }).text("decimals"));
		let fxiMinus1 = parseFloat(
			nerdamer(f).evaluate({ x: ximinus1 }).text("decimals")
		);
		let xiPlusOne = gerXiPlusOne(xi, fxi, ximinus1, fxiMinus1);
		let errorXr = 1;
		let iterations = 1;
		const rows = [];
		rows.push([iterations, xi, ximinus1, xiPlusOne, fxiMinus1, fxi, " "]);

		while (errorXr > err && iterations < maxI) {
			let oldXiPlusOne = xiPlusOne;
			xi = ximinus1;
			ximinus1 = xiPlusOne;
			fxi = fxiMinus1;

			fxiMinus1 = parseFloat(
				nerdamer(f).evaluate({ x: ximinus1 }).text("decimals")
			);
			xiPlusOne = gerXiPlusOne(xi, fxi, ximinus1, fxiMinus1);

			errorXr = getError(xiPlusOne, oldXiPlusOne, isPercentage);

			iterations++;
			rows.push([iterations, xi, ximinus1, xiPlusOne, fxiMinus1, fxi, errorXr]);
		}

		return {
			rows,
			fList: [{ f: "", label: "" }]
		};
	} catch (e) {
		return {
			rows: [],
			fList: [{ f: "", label: "" }]
		};
	}
};

export const puntoFijo = (Xi, f, error, isPercentage, maxI = 50) => {
	try {
		console.log(f);
		let xi = parseFloat(Xi);
		let err = parseFloat(error);

		const sol = f;
		const solDiff = nerdamer.diff(sol, "k").toString();

		let fxi = abs(
			parseFloat(nerdamer(solDiff).evaluate({ k: xi }).text("decimals"))
		);

		console.log(fxi, "fxi");
		if (fxi >= 1) {
			return {
				rows: [],
				fList: []
			};
		}

		let xiPlusOne = parseFloat(
			nerdamer(sol).evaluate({ k: xi }).text("decimals")
		);
		let errorXr = 1;
		let iterations = 1;
		const rows = [];
		rows.push([iterations, xi, xiPlusOne, " "]);

		while (errorXr > err && iterations < maxI) {
			xi = xiPlusOne;
			xiPlusOne = parseFloat(
				nerdamer(sol).evaluate({ k: xi }).text("decimals")
			);
			errorXr = getError(xiPlusOne, xi, isPercentage);

			iterations++;
			rows.push([iterations, xi, xiPlusOne, errorXr]);
		}
		return {
			rows,
			fList: [
				{ f: nerdamer.convertToLaTeX(sol).toString(), label: "g(x)=" },
				{ f: nerdamer.convertToLaTeX(solDiff).toString(), label: "g'(x)=" }
			]
		};
	} catch (e) {
		return {
			rows: [],
			fList: [{ f: "", label: "" }]
		};
	}
};

export const derivar = (f, variable, i) => {
	const derivates = [];
	for (let j = 1; j <= i; j++) {
		f = nerdamer.diff(f, variable).toString();
		derivates.push({
			f: nerdamer.convertToLaTeX(f).toString(),
			label: `f^${j}'(${variable})=`
		});
	}
	return derivates;
};

export const simplificar = (f) => {
	return [
		{
			f: nerdamer
				.convertToLaTeX(nerdamer(`simplify(${f})`).toString())
				.toString(),
			label: ""
		}
	];
};

export const solveFor = (f, variable) => {
	const solved = nerdamer(f).solveFor(variable).toString();
	const results = solved.split(",");
	if (results.length > 1) {
		return results.map((result, i) => {
			const simplified = simplificar(result)[i].f;
			return {
				f: simplified,
				label: `${variable}=`
			};
		});
	}

	const simplified = simplificar(solved)[0].f;
	return [{ f: simplified, label: `${variable}=` }];
};

export const expandir = (f) => {
	return [
		{
			f: nerdamer
				.convertToLaTeX(nerdamer(`expand(${f})`).toString())
				.toString(),
			label: ""
		}
	];
};

export const factorizar = (f) => {
	return [
		{
			f: nerdamer
				.convertToLaTeX(nerdamer(`factor(${f})`).toString())
				.toString(),
			label: ""
		}
	];
};
