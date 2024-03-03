/** @type {import("prettier").Options} */
export default {
	useTabs: true,
	semi: false,
	singleQuote: true,
	jsxSingleQuote: false,
	printWidth: 80,
	arrowParens: 'avoid',
	bracketSameLine: false,
	bracketSpacing: true,
	embeddedLanguageFormatting: 'auto',
	endOfLine: 'lf',
	htmlWhitespaceSensitivity: 'css',
	insertPragma: false,
	proseWrap: 'always',
	quoteProps: 'as-needed',
	requirePragma: false,
	singleAttributePerLine: false,
	tabWidth: 4,
	trailingComma: 'all',
	overrides: [
		{
			files: ['**/*.json'],
			options: {
				useTabs: false,
			},
		},
	],
	plugins: ['prettier-plugin-tailwindcss'],
}
