import { c as createWebWorker, l as languages } from './editor.main-CrYb0rNR.js';
import { H as HoverAdapter, D as DocumentHighlightAdapter, h as DocumentLinkAdapter, F as FoldingRangeAdapter, b as DocumentSymbolAdapter, S as SelectionRangeAdapter, c as RenameAdapter, f as DocumentFormattingEditProvider, g as DocumentRangeFormattingEditProvider, C as CompletionAdapter } from './lspLanguageFeatures-o1S93pcA.js';
export { a as DefinitionAdapter, e as DiagnosticsAdapter, d as DocumentColorAdapter, R as ReferenceAdapter, i as fromPosition, j as fromRange, t as toRange, k as toTextEdit } from './lspLanguageFeatures-o1S93pcA.js';
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
        // module that exports the create() method and returns a `HTMLWorker` instance
        moduleId: "vs/language/html/htmlWorker",
        createWorker: () => new Worker(new URL(/* @vite-ignore */ "/neno/assets/html.worker-9nZ4sdjm.js", import.meta.url), { type: "module" }),
        // passed in to the create() method
        createData: {
          languageSettings: this._defaults.options,
          languageId: this._defaults.languageId
        },
        label: this._defaults.languageId
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

class HTMLCompletionAdapter extends CompletionAdapter {
  constructor(worker) {
    super(worker, [".", ":", "<", '"', "=", "/"]);
  }
}
function setupMode1(defaults) {
  const client = new WorkerManager(defaults);
  const worker = (...uris) => {
    return client.getLanguageServiceWorker(...uris);
  };
  let languageId = defaults.languageId;
  languages.registerCompletionItemProvider(languageId, new HTMLCompletionAdapter(worker));
  languages.registerHoverProvider(languageId, new HoverAdapter(worker));
  languages.registerDocumentHighlightProvider(
    languageId,
    new DocumentHighlightAdapter(worker)
  );
  languages.registerLinkProvider(languageId, new DocumentLinkAdapter(worker));
  languages.registerFoldingRangeProvider(
    languageId,
    new FoldingRangeAdapter(worker)
  );
  languages.registerDocumentSymbolProvider(
    languageId,
    new DocumentSymbolAdapter(worker)
  );
  languages.registerSelectionRangeProvider(
    languageId,
    new SelectionRangeAdapter(worker)
  );
  languages.registerRenameProvider(languageId, new RenameAdapter(worker));
  if (languageId === "html") {
    languages.registerDocumentFormattingEditProvider(
      languageId,
      new DocumentFormattingEditProvider(worker)
    );
    languages.registerDocumentRangeFormattingEditProvider(
      languageId,
      new DocumentRangeFormattingEditProvider(worker)
    );
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
        languages.registerCompletionItemProvider(languageId, new HTMLCompletionAdapter(worker))
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
    if (modeConfiguration.links) {
      providers.push(
        languages.registerLinkProvider(languageId, new DocumentLinkAdapter(worker))
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
    if (modeConfiguration.foldingRanges) {
      providers.push(
        languages.registerFoldingRangeProvider(
          languageId,
          new FoldingRangeAdapter(worker)
        )
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

export { CompletionAdapter, DocumentFormattingEditProvider, DocumentHighlightAdapter, DocumentLinkAdapter, DocumentRangeFormattingEditProvider, DocumentSymbolAdapter, FoldingRangeAdapter, HoverAdapter, RenameAdapter, SelectionRangeAdapter, WorkerManager, setupMode, setupMode1 };
