import { p as editor } from "./editor.api2-J5VvnjYP.js";
//#region node_modules/monaco-editor/esm/vs/common/workers.js
function createTrustedTypesPolicy(policyName, policyOptions) {
	const monacoEnvironment = globalThis.MonacoEnvironment;
	if (monacoEnvironment?.createTrustedTypesPolicy) try {
		return monacoEnvironment.createTrustedTypesPolicy(policyName, policyOptions);
	} catch (err) {
		console.error(err);
		return;
	}
	try {
		return globalThis.trustedTypes?.createPolicy(policyName, policyOptions);
	} catch (err) {
		console.error(err);
		return;
	}
}
var ttPolicy;
if (typeof self === "object" && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope" && globalThis.workerttPolicy !== void 0) ttPolicy = globalThis.workerttPolicy;
else ttPolicy = createTrustedTypesPolicy("defaultWorkerFactory", { createScriptURL: (value) => value });
function getWorker(descriptor) {
	const label = descriptor.label;
	const monacoEnvironment = globalThis.MonacoEnvironment;
	if (monacoEnvironment) {
		if (typeof monacoEnvironment.getWorker === "function") return monacoEnvironment.getWorker("workerMain.js", label);
		if (typeof monacoEnvironment.getWorkerUrl === "function") {
			const workerUrl = monacoEnvironment.getWorkerUrl("workerMain.js", label);
			return new Worker(ttPolicy ? ttPolicy.createScriptURL(workerUrl) : workerUrl, {
				name: label,
				type: "module"
			});
		}
	}
	if (descriptor.createWorker) return descriptor.createWorker();
	throw new Error(`You must define a function MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker`);
}
function createWebWorker(opts) {
	const worker = Promise.resolve(getWorker({
		label: opts.label ?? "monaco-editor-worker",
		moduleId: opts.moduleId,
		createWorker: opts.createWorker
	})).then((w) => {
		w.postMessage("ignore");
		w.postMessage(opts.createData);
		return w;
	});
	return editor.createWebWorker({
		worker,
		host: opts.host,
		keepIdleModels: opts.keepIdleModels
	});
}
//#endregion
export { createWebWorker as t };
