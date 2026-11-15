declare module '@resvg/resvg-wasm/index_bg.wasm' {
	const wasm: WebAssembly.Module;
	export default wasm;
}

declare module '@resvg/resvg-wasm/index_bg.wasm?url&inline' {
	const data_url: string;
	export default data_url;
}
