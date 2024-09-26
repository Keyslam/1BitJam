import * as ts from "typescript";
import * as tstl from "typescript-to-lua";

const plugin: tstl.Plugin = {
	afterPrint(program: ts.Program, options: tstl.CompilerOptions, emitHost: tstl.EmitHost, result: tstl.ProcessedFile[]) {
		for (const file of result) {
			if (file.fileName.endsWith(".spec.ts")) {
				file.fileName = file.fileName.replace(".spec.ts", "-spec.ts");
			}
		}
	},
};

export default plugin;
