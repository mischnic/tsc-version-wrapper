const fs = require("fs");
const path = require("path");
const { traverse } = require("@babel/traverse");
const { parse } = require("@babel/parser");
const t = require("@babel/types");
const { default: generate } = require("@babel/generator");

let versions = fs
	.readdirSync("data")
	.sort()
	.filter((f) => f.endsWith(".d.ts"))
	.map((f) => f.match(/typescript-(.*)\.d\.ts/)[1]);
// let versions = ["3.0.3", "3.7.7", "3.9.10", "4.9.3"];

let functions = new Map(
	versions.map((v) => [v, findFunctions(`typescript-${v}.d.ts`)])
);

let wrapper = "";
let report = "";
for (let name of [
	"createImportClause",
	"createImportDeclaration",
	"createImportSpecifier",
	"updateExportDeclaration",
]) {
	let data = generateWrapper(name);
	wrapper += data.wrapper;
	report += `# ${name}\n` + data.report + "\n";
}
fs.writeFileSync("result.js", wrapper);
fs.writeFileSync("report.txt", report);

function generateWrapper(name) {
	let report = "";
	let alternatives = [];

	let latestSignature = findFunction(functions.get(versions.at(-1)), name);
	let inputParams = new Map(
		latestSignature.params.map((p) => [
			p.name,
			generate(p.typeAnnotation.typeAnnotation)
				.code.replaceAll("readonly ", "")
				.replaceAll("undefined", "void"),
		])
	);

	let previousParams = null;
	for (let i = 0; i < versions.length; i++) {
		let version = versions[i];
		let isLatest = i === versions.length - 1;

		let funcs = functions.get(version);
		let [majorVersion, minorVersion] = version.split(".");
		let signature = findFunction(funcs, name);

		report += `${version.padEnd(8)} ${signature.params
			.map(
				(p) =>
					`${p.name}: ${
						generate(p.typeAnnotation.typeAnnotation).code
					}`
			)
			.join(", ")
			.replace(/ReadonlyArray<(\w+)>/g, "readonly $1[]")
			.replace(/ReadonlyArray<([^>]+)>/g, "readonly ($1)[]")}\n`;

		let params = signature.params.map((p) => p.name).join(", ");
		if (params != previousParams) {
			let condition = `majorVersion > ${majorVersion} || (majorVersion === ${majorVersion} && minorVersion >= ${minorVersion})`;
			let body = `\t\treturn factory.${name}(
\t\t\t${signature.params
				.map((p) =>
					inputParams.has(p.name)
						? p.name
						: `undefined /* ${p.name} */`
				)
				.join(",\n\t\t\t")}
\t\t);`;

			alternatives.unshift(`if (${condition}) {\n${body}\n\t}`);
		}
		previousParams = params;
	}

	if (alternatives.length === 1) {
		console.warn(
			`Warning: the signature of ${name} doesn't change across versions`
		);
	}

	return {
		report,
		wrapper: `export function ${name}(factory: any, ${[...inputParams]
			.map(([name, type]) => `${name}: ${type}`)
			.join(", ")}): ${latestSignature.returnType} {
	${alternatives.join(" else ")} else {
		invariant(false);
	}
}\n\n`,
	};
}

function findFunction(funcs, n) {
	if (funcs.factory) {
		let func = funcs.factory.body.find(
			(f) => t.isTSMethodSignature(f) && f.key.name === n
		);
		return {
			params: func.parameters,
			returnType: func.typeAnnotation.typeAnnotation.typeName.name,
		};
	} else {
		let func = funcs.legacy.body.find(
			(f) => t.isTSDeclareFunction(f) && f.id.name === n
		);
		return {
			params: func.params,
			returnType: func.returnType.typeAnnotation.typeName.name,
		};
	}
}

function findFunctions(f) {
	const program = parse(fs.readFileSync(path.join("data", f), "utf8"), {
		plugins: ["typescript"],
		sourceType: "module",
	}).program.body;

	let factory = program
		.map(
			(ns) =>
				t.isTSModuleDeclaration(ns) &&
				ns.id.name === "ts" &&
				t.isTSModuleBlock(ns.body) &&
				ns.body.body.find(
					(ex) =>
						t.isExportNamedDeclaration(ex) &&
						t.isTSInterfaceDeclaration(ex.declaration) &&
						ex.declaration.id.name === "NodeFactory"
				)
		)
		.filter(Boolean)[0]?.declaration.body;
	if (factory) {
		return { factory };
	}

	return {
		legacy: program.find((ns) => {
			if (
				t.isTSModuleDeclaration(ns) &&
				ns.id.name === "ts" &&
				t.isTSModuleBlock(ns.body)
			) {
				let func = ns.body.body[0];
				if (
					t.isTSDeclareFunction(func) &&
					func.id.name === "createNodeArray"
				) {
					return func;
				}
			}
		}).body,
	};
}
