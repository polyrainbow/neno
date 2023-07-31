import { h as languages } from "./editor.api2-J5VvnjYP.js";
import { t as createWebWorker } from "./workers-DfUx76m9.js";
import { _ as toRange, a as DocumentFormattingEditProvider, c as DocumentRangeFormattingEditProvider, d as HoverAdapter, f as ReferenceAdapter, g as fromRange, h as fromPosition, i as DocumentColorAdapter, l as DocumentSymbolAdapter, m as SelectionRangeAdapter, n as DefinitionAdapter, o as DocumentHighlightAdapter, p as RenameAdapter, r as DiagnosticsAdapter, s as DocumentLinkAdapter, t as CompletionAdapter, u as FoldingRangeAdapter, v as toTextEdit } from "./lspLanguageFeatures-B34ux6fH.js";
//#region node_modules/monaco-editor/esm/vs/language/css/workerManager.js
var STOP_WHEN_IDLE_FOR = 120 * 1e3;
var WorkerManager = class {
	constructor(defaults) {
		this._defaults = defaults;
		this._worker = null;
		this._client = null;
		this._idleCheckInterval = window.setInterval(() => this._checkIfIdle(), 30 * 1e3);
		this._lastUsedTime = 0;
		this._configChangeListener = this._defaults.onDidChange(() => this._stopWorker());
	}
	_stopWorker() {
		if (this._worker) {
			this._worker.dispose();
			this._worker = null;
		}
		this._client = null;
	}
	dispose() {
		clearInterval(this._idleCheckInterval);
		this._configChangeListener.dispose();
		this._stopWorker();
	}
	_checkIfIdle() {
		if (!this._worker) return;
		if (Date.now() - this._lastUsedTime > STOP_WHEN_IDLE_FOR) this._stopWorker();
	}
	_getClient() {
		this._lastUsedTime = Date.now();
		if (!this._client) {
			this._worker = createWebWorker({
				moduleId: "vs/language/css/cssWorker",
				createWorker: () => new Worker(new URL(
					/* @vite-ignore */
					"/neno/assets/css.worker-OeGZeuPh.js",
					"" + import.meta.url
				), { type: "module" }),
				label: this._defaults.languageId,
				createData: {
					options: this._defaults.options,
					languageId: this._defaults.languageId
				}
			});
			this._client = this._worker.getProxy();
		}
		return this._client;
	}
	getLanguageServiceWorker(...resources) {
		let _client;
		return this._getClient().then((client) => {
			_client = client;
		}).then((_) => {
			if (this._worker) return this._worker.withSyncedResources(resources);
		}).then((_) => _client);
	}
};
//#endregion
//#region node_modules/monaco-editor/esm/vs/language/css/cssMode.js
function setupMode(defaults) {
	const disposables = [];
	const providers = [];
	const client = new WorkerManager(defaults);
	disposables.push(client);
	const worker = (...uris) => {
		return client.getLanguageServiceWorker(...uris);
	};
	function registerProviders() {
		const { languageId, modeConfiguration } = defaults;
		disposeAll(providers);
		if (modeConfiguration.completionItems) providers.push(languages.registerCompletionItemProvider(languageId, new CompletionAdapter(worker, [
			"/",
			"-",
			":"
		])));
		if (modeConfiguration.hovers) providers.push(languages.registerHoverProvider(languageId, new HoverAdapter(worker)));
		if (modeConfiguration.documentHighlights) providers.push(languages.registerDocumentHighlightProvider(languageId, new DocumentHighlightAdapter(worker)));
		if (modeConfiguration.definitions) providers.push(languages.registerDefinitionProvider(languageId, new DefinitionAdapter(worker)));
		if (modeConfiguration.references) providers.push(languages.registerReferenceProvider(languageId, new ReferenceAdapter(worker)));
		if (modeConfiguration.documentSymbols) providers.push(languages.registerDocumentSymbolProvider(languageId, new DocumentSymbolAdapter(worker)));
		if (modeConfiguration.rename) providers.push(languages.registerRenameProvider(languageId, new RenameAdapter(worker)));
		if (modeConfiguration.colors) providers.push(languages.registerColorProvider(languageId, new DocumentColorAdapter(worker)));
		if (modeConfiguration.foldingRanges) providers.push(languages.registerFoldingRangeProvider(languageId, new FoldingRangeAdapter(worker)));
		if (modeConfiguration.diagnostics) providers.push(new DiagnosticsAdapter(languageId, worker, defaults.onDidChange));
		if (modeConfiguration.selectionRanges) providers.push(languages.registerSelectionRangeProvider(languageId, new SelectionRangeAdapter(worker)));
		if (modeConfiguration.documentFormattingEdits) providers.push(languages.registerDocumentFormattingEditProvider(languageId, new DocumentFormattingEditProvider(worker)));
		if (modeConfiguration.documentRangeFormattingEdits) providers.push(languages.registerDocumentRangeFormattingEditProvider(languageId, new DocumentRangeFormattingEditProvider(worker)));
	}
	registerProviders();
	disposables.push(asDisposable(providers));
	return asDisposable(disposables);
}
function asDisposable(disposables) {
	return { dispose: () => disposeAll(disposables) };
}
function disposeAll(disposables) {
	while (disposables.length) disposables.pop().dispose();
}
//#endregion
export { CompletionAdapter, DefinitionAdapter, DiagnosticsAdapter, DocumentColorAdapter, DocumentFormattingEditProvider, DocumentHighlightAdapter, DocumentLinkAdapter, DocumentRangeFormattingEditProvider, DocumentSymbolAdapter, FoldingRangeAdapter, HoverAdapter, ReferenceAdapter, RenameAdapter, SelectionRangeAdapter, WorkerManager, fromPosition, fromRange, setupMode, toRange, toTextEdit };
