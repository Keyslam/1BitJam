import pluginJs from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default [
	{
		files: ["src/**/*.ts"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: "./tsconfig.json",
			},
		},
		rules: {
			"@typescript-eslint/strict-boolean-expressions": "error",
			eqeqeq: ["error", "always"],
			"no-restricted-syntax": [
				"error",
				{
					selector: "Literal[raw='null']",
					message: "Use undefined instead of null",
				},
			],

		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	eslintConfigPrettier,
];
