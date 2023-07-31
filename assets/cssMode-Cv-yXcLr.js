import { c as createWebWorker, l as languages } from './editor.main-CrYb0rNR.js';
import { C as CompletionAdapter, H as HoverAdapter, D as DocumentHighlightAdapter, a as DefinitionAdapter, R as ReferenceAdapter, b as DocumentSymbolAdapter, c as RenameAdapter, d as DocumentColorAdapter, F as FoldingRangeAdapter, e as DiagnosticsAdapter, S as SelectionRangeAdapter, f as DocumentFormattingEditProvider, g as DocumentRangeFormattingEditProvider } from './lspLanguageFeatures-o1S93pcA.js';
export { h as DocumentLinkAdapter, i as fromPosition, j as fromRange, t as toRange, k as toTextEdit } from './lspLanguageFeatures-o1S93pcA.js';
import './index-DDnCPAv-.js';

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1e3;
class WorkerManager {
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
    if (!this._worker) {
      return;
    }
    let timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
    if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
      this._stopWorker();
    }
  }
  _getClient() {
    this._lastUsedTime = Date.now();
    if (!this._client) {
      this._worker = createWebWorker({
        // module that exports the create() method and returns a `CSSWorker` instance
        moduleId: "vs/language/css/cssWorker",
        createWorker: () => new Worker(new URL(/* @vite-ignore */ "/neno/assets/css.worker-DG0XZUtL.js", import.meta.url), { type: "module" }),
        label: this._defaults.languageId,
        // passed in to the create() method
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
      if (this._worker) {
        return this._worker.withSyncedResources(resources);
      }
    }).then((_) => _client);
  }
}

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
    if (modeConfiguration.completionItems) {
      providers.push(
        languages.registerCompletionItemProvider(
          languageId,
          new CompletionAdapter(worker, ["/", "-", ":"])
        )
      );
    }
    if (modeConfiguration.hovers) {
      providers.push(
        languages.registerHoverProvider(languageId, new HoverAdapter(worker))
      );
    }
    if (modeConfiguration.documentHighlights) {
      providers.push(
        languages.registerDocumentHighlightProvider(
          languageId,
          new DocumentHighlightAdapter(worker)
        )
      );
    }
    if (modeConfiguration.definitions) {
      providers.push(
        languages.registerDefinitionProvider(
          languageId,
          new DefinitionAdapter(worker)
        )
      );
    }
    if (modeConfiguration.references) {
      providers.push(
        languages.registerReferenceProvider(
          languageId,
          new ReferenceAdapter(worker)
        )
      );
    }
    if (modeConfiguration.documentSymbols) {
      providers.push(
        languages.registerDocumentSymbolProvider(
          languageId,
          new DocumentSymbolAdapter(worker)
        )
      );
    }
    if (modeConfiguration.rename) {
      providers.push(
        languages.registerRenameProvider(languageId, new RenameAdapter(worker))
      );
    }
    if (modeConfiguration.colors) {
      providers.push(
        languages.registerColorProvider(
          languageId,
          new DocumentColorAdapter(worker)
        )
      );
    }
    if (modeConfiguration.foldingRanges) {
      providers.push(
        languages.registerFoldingRangeProvider(
          languageId,
          new FoldingRangeAdapter(worker)
        )
      );
    }
    if (modeConfiguration.diagnostics) {
      providers.push(
        new DiagnosticsAdapter(languageId, worker, defaults.onDidChange)
      );
    }
    if (modeConfiguration.selectionRanges) {
      providers.push(
        languages.registerSelectionRangeProvider(
          languageId,
          new SelectionRangeAdapter(worker)
        )
      );
    }
    if (modeConfiguration.documentFormattingEdits) {
      providers.push(
        languages.registerDocumentFormattingEditProvider(
          languageId,
          new DocumentFormattingEditProvider(worker)
        )
      );
    }
    if (modeConfiguration.documentRangeFormattingEdits) {
      providers.push(
        languages.registerDocumentRangeFormattingEditProvider(
          languageId,
          new DocumentRangeFormattingEditProvider(worker)
        )
      );
    }
  }
  registerProviders();
  disposables.push(asDisposable(providers));
  return asDisposable(disposables);
}
function asDisposable(disposables) {
  return { dispose: () => disposeAll(disposables) };
}
function disposeAll(disposables) {
  while (disposables.length) {
    disposables.pop().dispose();
  }
}

export { CompletionAdapter, DefinitionAdapter, DiagnosticsAdapter, DocumentColorAdapter, DocumentFormattingEditProvider, DocumentHighlightAdapter, DocumentRangeFormattingEditProvider, DocumentSymbolAdapter, FoldingRangeAdapter, HoverAdapter, ReferenceAdapter, RenameAdapter, SelectionRangeAdapter, WorkerManager, setupMode };
