const __vite__fileDeps=["assets/editor.main-D3FeRMV7.js","assets/editor-BWz_v2Ue.css"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== 'string' && !Array.isArray(e)) { for (const k in e) {
      if (k !== 'default' && !(k in n)) {
        const d = Object.getOwnPropertyDescriptor(e, k);
        if (d) {
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    } }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' }));
}

true&&(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
}());

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

var react = {exports: {}};

var react_production_min = {};

/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$6=Symbol.for("react.element"),n$3=Symbol.for("react.portal"),p$6=Symbol.for("react.fragment"),q$2=Symbol.for("react.strict_mode"),r$3=Symbol.for("react.profiler"),t$2=Symbol.for("react.provider"),u$4=Symbol.for("react.context"),v$2=Symbol.for("react.forward_ref"),w$1=Symbol.for("react.suspense"),x$4=Symbol.for("react.memo"),y$2=Symbol.for("react.lazy"),z$2=Symbol.iterator;function A$2(a){if(null===a||"object"!==typeof a)return null;a=z$2&&a[z$2]||a["@@iterator"];return "function"===typeof a?a:null}
var B$2={isMounted:function(){return !1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C$3=Object.assign,D$2={};function E$1(a,b,e){this.props=a;this.context=b;this.refs=D$2;this.updater=e||B$2;}E$1.prototype.isReactComponent={};
E$1.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,b,"setState");};E$1.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};function F$1(){}F$1.prototype=E$1.prototype;function G$2(a,b,e){this.props=a;this.context=b;this.refs=D$2;this.updater=e||B$2;}var H$3=G$2.prototype=new F$1;
H$3.constructor=G$2;C$3(H$3,E$1.prototype);H$3.isPureReactComponent=!0;var I$2=Array.isArray,J$1=Object.prototype.hasOwnProperty,K$2={current:null},L$4={key:!0,ref:!0,__self:!0,__source:!0};
function M$4(a,b,e){var d,c={},k=null,h=null;if(null!=b)for(d in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)J$1.call(b,d)&&!L$4.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(1===g)c.children=e;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];c.children=f;}if(a&&a.defaultProps)for(d in g=a.defaultProps,g)void 0===c[d]&&(c[d]=g[d]);return {$$typeof:l$6,type:a,key:k,ref:h,props:c,_owner:K$2.current}}
function N$3(a,b){return {$$typeof:l$6,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function O$1(a){return "object"===typeof a&&null!==a&&a.$$typeof===l$6}function escape(a){var b={"=":"=0",":":"=2"};return "$"+a.replace(/[=:]/g,function(a){return b[a]})}var P$1=/\/+/g;function Q$3(a,b){return "object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function R$2(a,b,e,d,c){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case l$6:case n$3:h=!0;}}if(h)return h=a,c=c(h),a=""===d?"."+Q$3(h,0):d,I$2(c)?(e="",null!=a&&(e=a.replace(P$1,"$&/")+"/"),R$2(c,b,e,"",function(a){return a})):null!=c&&(O$1(c)&&(c=N$3(c,e+(!c.key||h&&h.key===c.key?"":(""+c.key).replace(P$1,"$&/")+"/")+a)),b.push(c)),1;h=0;d=""===d?".":d+":";if(I$2(a))for(var g=0;g<a.length;g++){k=
a[g];var f=d+Q$3(k,g);h+=R$2(k,b,e,f,c);}else if(f=A$2(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=d+Q$3(k,g++),h+=R$2(k,b,e,f,c);else if("object"===k)throw b=String(a),Error("Objects are not valid as a React child (found: "+("[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}
function S$3(a,b,e){if(null==a)return a;var d=[],c=0;R$2(a,d,"","",function(a){return b.call(e,a,c++)});return d}function T$3(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b;},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b;});-1===a._status&&(a._status=0,a._result=b);}if(1===a._status)return a._result.default;throw a._result;}
var U$2={current:null},V$2={transition:null},W$2={ReactCurrentDispatcher:U$2,ReactCurrentBatchConfig:V$2,ReactCurrentOwner:K$2};function X$2(){throw Error("act(...) is not supported in production builds of React.");}
react_production_min.Children={map:S$3,forEach:function(a,b,e){S$3(a,function(){b.apply(this,arguments);},e);},count:function(a){var b=0;S$3(a,function(){b++;});return b},toArray:function(a){return S$3(a,function(a){return a})||[]},only:function(a){if(!O$1(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};react_production_min.Component=E$1;react_production_min.Fragment=p$6;react_production_min.Profiler=r$3;react_production_min.PureComponent=G$2;react_production_min.StrictMode=q$2;react_production_min.Suspense=w$1;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W$2;react_production_min.act=X$2;
react_production_min.cloneElement=function(a,b,e){if(null===a||void 0===a)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var d=C$3({},a.props),c=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=K$2.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)J$1.call(b,f)&&!L$4.hasOwnProperty(f)&&(d[f]=void 0===b[f]&&void 0!==g?g[f]:b[f]);}var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){g=Array(f);
for(var m=0;m<f;m++)g[m]=arguments[m+2];d.children=g;}return {$$typeof:l$6,type:a.type,key:c,ref:k,props:d,_owner:h}};react_production_min.createContext=function(a){a={$$typeof:u$4,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};a.Provider={$$typeof:t$2,_context:a};return a.Consumer=a};react_production_min.createElement=M$4;react_production_min.createFactory=function(a){var b=M$4.bind(null,a);b.type=a;return b};react_production_min.createRef=function(){return {current:null}};
react_production_min.forwardRef=function(a){return {$$typeof:v$2,render:a}};react_production_min.isValidElement=O$1;react_production_min.lazy=function(a){return {$$typeof:y$2,_payload:{_status:-1,_result:a},_init:T$3}};react_production_min.memo=function(a,b){return {$$typeof:x$4,type:a,compare:void 0===b?null:b}};react_production_min.startTransition=function(a){var b=V$2.transition;V$2.transition={};try{a();}finally{V$2.transition=b;}};react_production_min.unstable_act=X$2;react_production_min.useCallback=function(a,b){return U$2.current.useCallback(a,b)};react_production_min.useContext=function(a){return U$2.current.useContext(a)};
react_production_min.useDebugValue=function(){};react_production_min.useDeferredValue=function(a){return U$2.current.useDeferredValue(a)};react_production_min.useEffect=function(a,b){return U$2.current.useEffect(a,b)};react_production_min.useId=function(){return U$2.current.useId()};react_production_min.useImperativeHandle=function(a,b,e){return U$2.current.useImperativeHandle(a,b,e)};react_production_min.useInsertionEffect=function(a,b){return U$2.current.useInsertionEffect(a,b)};react_production_min.useLayoutEffect=function(a,b){return U$2.current.useLayoutEffect(a,b)};
react_production_min.useMemo=function(a,b){return U$2.current.useMemo(a,b)};react_production_min.useReducer=function(a,b,e){return U$2.current.useReducer(a,b,e)};react_production_min.useRef=function(a){return U$2.current.useRef(a)};react_production_min.useState=function(a){return U$2.current.useState(a)};react_production_min.useSyncExternalStore=function(a,b,e){return U$2.current.useSyncExternalStore(a,b,e)};react_production_min.useTransition=function(){return U$2.current.useTransition()};react_production_min.version="18.3.1";

{
  react.exports = react_production_min;
}

var reactExports = react.exports;
const React = /*@__PURE__*/getDefaultExportFromCjs(reactExports);

const React$1 = /*#__PURE__*/_mergeNamespaces({
  __proto__: null,
  default: React
}, [reactExports]);

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f$3=reactExports,k$2=Symbol.for("react.element"),l$5=Symbol.for("react.fragment"),m$6=Object.prototype.hasOwnProperty,n$2=f$3.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p$5={key:!0,ref:!0,__self:!0,__source:!0};
function q$1(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m$6.call(a,b)&&!p$5.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k$2,type:c,key:e,ref:h,props:d,_owner:n$2.current}}reactJsxRuntime_production_min.Fragment=l$5;reactJsxRuntime_production_min.jsx=q$1;reactJsxRuntime_production_min.jsxs=q$1;

{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}

var jsxRuntimeExports = jsxRuntime.exports;

var reactDom = {exports: {}};

var reactDom_production_min = {};

var scheduler = {exports: {}};

var scheduler_production_min = {};

/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

(function (exports) {
function f(a,b){var c=a.length;a.push(b);a:for(;0<c;){var d=c-1>>>1,e=a[d];if(0<g(e,b))a[d]=b,a[c]=e,c=d;else break a}}function h(a){return 0===a.length?null:a[0]}function k(a){if(0===a.length)return null;var b=a[0],c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length,w=e>>>1;d<w;){var m=2*(d+1)-1,C=a[m],n=m+1,x=a[n];if(0>g(C,c))n<e&&0>g(x,C)?(a[d]=x,a[n]=c,d=n):(a[d]=C,a[m]=c,d=m);else if(n<e&&0>g(x,c))a[d]=x,a[n]=c,d=n;else break a}}return b}
	function g(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()};}else {var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q};}var r=[],t=[],u=1,v=null,y=3,z=!1,A=!1,B=!1,D="function"===typeof setTimeout?setTimeout:null,E="function"===typeof clearTimeout?clearTimeout:null,F="undefined"!==typeof setImmediate?setImmediate:null;
	"undefined"!==typeof navigator&&void 0!==navigator.scheduling&&void 0!==navigator.scheduling.isInputPending&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function G(a){for(var b=h(t);null!==b;){if(null===b.callback)k(t);else if(b.startTime<=a)k(t),b.sortIndex=b.expirationTime,f(r,b);else break;b=h(t);}}function H(a){B=!1;G(a);if(!A)if(null!==h(r))A=!0,I(J);else {var b=h(t);null!==b&&K(H,b.startTime-a);}}
	function J(a,b){A=!1;B&&(B=!1,E(L),L=-1);z=!0;var c=y;try{G(b);for(v=h(r);null!==v&&(!(v.expirationTime>b)||a&&!M());){var d=v.callback;if("function"===typeof d){v.callback=null;y=v.priorityLevel;var e=d(v.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?v.callback=e:v===h(r)&&k(r);G(b);}else k(r);v=h(r);}if(null!==v)var w=!0;else {var m=h(t);null!==m&&K(H,m.startTime-b);w=!1;}return w}finally{v=null,y=c,z=!1;}}var N=!1,O=null,L=-1,P=5,Q=-1;
	function M(){return exports.unstable_now()-Q<P?!1:!0}function R(){if(null!==O){var a=exports.unstable_now();Q=a;var b=!0;try{b=O(!0,a);}finally{b?S():(N=!1,O=null);}}else N=!1;}var S;if("function"===typeof F)S=function(){F(R);};else if("undefined"!==typeof MessageChannel){var T=new MessageChannel,U=T.port2;T.port1.onmessage=R;S=function(){U.postMessage(null);};}else S=function(){D(R,0);};function I(a){O=a;N||(N=!0,S());}function K(a,b){L=D(function(){a(exports.unstable_now());},b);}
	exports.unstable_IdlePriority=5;exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null;};exports.unstable_continueExecution=function(){A||z||(A=!0,I(J));};
	exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<a?Math.floor(1E3/a):5;};exports.unstable_getCurrentPriorityLevel=function(){return y};exports.unstable_getFirstCallbackNode=function(){return h(r)};exports.unstable_next=function(a){switch(y){case 1:case 2:case 3:var b=3;break;default:b=y;}var c=y;y=b;try{return a()}finally{y=c;}};exports.unstable_pauseExecution=function(){};
	exports.unstable_requestPaint=function(){};exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3;}var c=y;y=a;try{return b()}finally{y=c;}};
	exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3;}e=c+e;a={id:u++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,f(t,a),null===h(r)&&a===h(t)&&(B?(E(L),L=-1):B=!0,K(H,c-d))):(a.sortIndex=e,f(r,a),A||z||(A=!0,I(J)));return a};
	exports.unstable_shouldYield=M;exports.unstable_wrapCallback=function(a){var b=y;return function(){var c=y;y=b;try{return a.apply(this,arguments)}finally{y=c;}}}; 
} (scheduler_production_min));

{
  scheduler.exports = scheduler_production_min;
}

var schedulerExports = scheduler.exports;

/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa=reactExports,ca=schedulerExports;function p$4(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return "Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var da=new Set,ea={};function fa(a,b){ha(a,b);ha(a+"Capture",b);}
function ha(a,b){ea[a]=b;for(a=0;a<b.length;a++)da.add(b[a]);}
var ia=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ja=Object.prototype.hasOwnProperty,ka=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,la=
{},ma={};function oa(a){if(ja.call(ma,a))return !0;if(ja.call(la,a))return !1;if(ka.test(a))return ma[a]=!0;la[a]=!0;return !1}function pa(a,b,c,d){if(null!==c&&0===c.type)return !1;switch(typeof b){case "function":case "symbol":return !0;case "boolean":if(d)return !1;if(null!==c)return !c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return "data-"!==a&&"aria-"!==a;default:return !1}}
function qa(a,b,c,d){if(null===b||"undefined"===typeof b||pa(a,b,c,d))return !0;if(d)return !1;if(null!==c)switch(c.type){case 3:return !b;case 4:return !1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return !1}function v$1(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g;}var z$1={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){z$1[a]=new v$1(a,0,!1,a,null,!1,!1);});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];z$1[b]=new v$1(b,1,!1,a[1],null,!1,!1);});["contentEditable","draggable","spellCheck","value"].forEach(function(a){z$1[a]=new v$1(a,2,!1,a.toLowerCase(),null,!1,!1);});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){z$1[a]=new v$1(a,2,!1,a,null,!1,!1);});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){z$1[a]=new v$1(a,3,!1,a.toLowerCase(),null,!1,!1);});
["checked","multiple","muted","selected"].forEach(function(a){z$1[a]=new v$1(a,3,!0,a,null,!1,!1);});["capture","download"].forEach(function(a){z$1[a]=new v$1(a,4,!1,a,null,!1,!1);});["cols","rows","size","span"].forEach(function(a){z$1[a]=new v$1(a,6,!1,a,null,!1,!1);});["rowSpan","start"].forEach(function(a){z$1[a]=new v$1(a,5,!1,a.toLowerCase(),null,!1,!1);});var ra=/[\-:]([a-z])/g;function sa(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(ra,
sa);z$1[b]=new v$1(b,1,!1,a,null,!1,!1);});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(ra,sa);z$1[b]=new v$1(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1);});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(ra,sa);z$1[b]=new v$1(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1);});["tabIndex","crossOrigin"].forEach(function(a){z$1[a]=new v$1(a,1,!1,a.toLowerCase(),null,!1,!1);});
z$1.xlinkHref=new v$1("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){z$1[a]=new v$1(a,1,!1,a.toLowerCase(),null,!0,!0);});
function ta(a,b,c,d){var e=z$1.hasOwnProperty(b)?z$1[b]:null;if(null!==e?0!==e.type:d||!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1])qa(b,c,e,d)&&(c=null),d||null===e?oa(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c)));}
var ua=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,va=Symbol.for("react.element"),wa=Symbol.for("react.portal"),ya=Symbol.for("react.fragment"),za=Symbol.for("react.strict_mode"),Aa=Symbol.for("react.profiler"),Ba=Symbol.for("react.provider"),Ca=Symbol.for("react.context"),Da=Symbol.for("react.forward_ref"),Ea=Symbol.for("react.suspense"),Fa=Symbol.for("react.suspense_list"),Ga=Symbol.for("react.memo"),Ha=Symbol.for("react.lazy");var Ia=Symbol.for("react.offscreen");var Ja=Symbol.iterator;function Ka(a){if(null===a||"object"!==typeof a)return null;a=Ja&&a[Ja]||a["@@iterator"];return "function"===typeof a?a:null}var A$1=Object.assign,La;function Ma(a){if(void 0===La)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);La=b&&b[1]||"";}return "\n"+La+a}var Na=!1;
function Oa(a,b){if(!a||Na)return "";Na=!0;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[]);}catch(l){var d=l;}Reflect.construct(a,[],b);}else {try{b.call();}catch(l){d=l;}a.call(b.prototype);}else {try{throw Error();}catch(l){d=l;}a();}}catch(l){if(l&&d&&"string"===typeof l.stack){for(var e=l.stack.split("\n"),
f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h]){var k="\n"+e[g].replace(" at new "," at ");a.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",a.displayName));return k}while(1<=g&&0<=h)}break}}}finally{Na=!1,Error.prepareStackTrace=c;}return (a=a?a.displayName||a.name:"")?Ma(a):""}
function Pa(a){switch(a.tag){case 5:return Ma(a.type);case 16:return Ma("Lazy");case 13:return Ma("Suspense");case 19:return Ma("SuspenseList");case 0:case 2:case 15:return a=Oa(a.type,!1),a;case 11:return a=Oa(a.type.render,!1),a;case 1:return a=Oa(a.type,!0),a;default:return ""}}
function Qa(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ya:return "Fragment";case wa:return "Portal";case Aa:return "Profiler";case za:return "StrictMode";case Ea:return "Suspense";case Fa:return "SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case Ca:return (a.displayName||"Context")+".Consumer";case Ba:return (a._context.displayName||"Context")+".Provider";case Da:var b=a.render;a=a.displayName;a||(a=b.displayName||
b.name||"",a=""!==a?"ForwardRef("+a+")":"ForwardRef");return a;case Ga:return b=a.displayName||null,null!==b?b:Qa(a.type)||"Memo";case Ha:b=a._payload;a=a._init;try{return Qa(a(b))}catch(c){}}return null}
function Ra(a){var b=a.type;switch(a.tag){case 24:return "Cache";case 9:return (b.displayName||"Context")+".Consumer";case 10:return (b._context.displayName||"Context")+".Provider";case 18:return "DehydratedFragment";case 11:return a=b.render,a=a.displayName||a.name||"",b.displayName||(""!==a?"ForwardRef("+a+")":"ForwardRef");case 7:return "Fragment";case 5:return b;case 4:return "Portal";case 3:return "Root";case 6:return "Text";case 16:return Qa(b);case 8:return b===za?"StrictMode":"Mode";case 22:return "Offscreen";
case 12:return "Profiler";case 21:return "Scope";case 13:return "Suspense";case 19:return "SuspenseList";case 25:return "TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if("function"===typeof b)return b.displayName||b.name||null;if("string"===typeof b)return b}return null}function Sa(a){switch(typeof a){case "boolean":case "number":case "string":case "undefined":return a;case "object":return a;default:return ""}}
function Ta(a){var b=a.type;return (a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
function Ua(a){var b=Ta(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a);}});Object.defineProperty(a,b,{enumerable:c.enumerable});return {getValue:function(){return d},setValue:function(a){d=""+a;},stopTracking:function(){a._valueTracker=
null;delete a[b];}}}}function Va(a){a._valueTracker||(a._valueTracker=Ua(a));}function Wa(a){if(!a)return !1;var b=a._valueTracker;if(!b)return !0;var c=b.getValue();var d="";a&&(d=Ta(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}function Xa(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
function Ya(a,b){var c=b.checked;return A$1({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value};}function ab(a,b){b=b.checked;null!=b&&ta(a,"checked",b,!1);}
function bb(a,b){ab(a,b);var c=Sa(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c;}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?cb(a,b.type,c):b.hasOwnProperty("defaultValue")&&cb(a,b.type,Sa(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked);}
function db(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b;}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c);}
function cb(a,b,c){if("number"!==b||Xa(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c);}var eb=Array.isArray;
function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0);}else {c=""+Sa(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e]);}null!==b&&(b.selected=!0);}}
function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(p$4(91));return A$1({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(p$4(92));if(eb(c)){if(1<c.length)throw Error(p$4(93));c=c[0];}b=c;}null==b&&(b="");c=b;}a._wrapperState={initialValue:Sa(c)};}
function ib(a,b){var c=Sa(b.value),d=Sa(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d);}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b);}function kb(a){switch(a){case "svg":return "http://www.w3.org/2000/svg";case "math":return "http://www.w3.org/1998/Math/MathML";default:return "http://www.w3.org/1999/xhtml"}}
function lb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?kb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
var mb,nb=function(a){return "undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)});}:a}(function(a,b){if("http://www.w3.org/2000/svg"!==a.namespaceURI||"innerHTML"in a)a.innerHTML=b;else {mb=mb||document.createElement("div");mb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=mb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild);}});
function ob(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b;}
var pb={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,
zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},qb=["Webkit","ms","Moz","O"];Object.keys(pb).forEach(function(a){qb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);pb[b]=pb[a];});});function rb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||pb.hasOwnProperty(a)&&pb[a]?(""+b).trim():b+"px"}
function sb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=rb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e;}}var tb=A$1({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
function ub(a,b){if(b){if(tb[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(p$4(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(p$4(60));if("object"!==typeof b.dangerouslySetInnerHTML||!("__html"in b.dangerouslySetInnerHTML))throw Error(p$4(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(p$4(62));}}
function vb(a,b){if(-1===a.indexOf("-"))return "string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return !1;default:return !0}}var wb=null;function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(p$4(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b));}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a;}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a]);}}function Gb(a,b){return a(b)}function Hb(){}var Ib=!1;function Jb(a,b,c){if(Ib)return a(b,c);Ib=!0;try{return Gb(a,b,c)}finally{if(Ib=!1,null!==zb||null!==Ab)Hb(),Fb();}}
function Kb(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1;}if(a)return null;if(c&&"function"!==
typeof c)throw Error(p$4(231,b,typeof c));return c}var Lb=!1;if(ia)try{var Mb={};Object.defineProperty(Mb,"passive",{get:function(){Lb=!0;}});window.addEventListener("test",Mb,Mb);window.removeEventListener("test",Mb,Mb);}catch(a){Lb=!1;}function Nb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l);}catch(m){this.onError(m);}}var Ob=!1,Pb=null,Qb=!1,Rb=null,Sb={onError:function(a){Ob=!0;Pb=a;}};function Tb(a,b,c,d,e,f,g,h,k){Ob=!1;Pb=null;Nb.apply(Sb,arguments);}
function Ub(a,b,c,d,e,f,g,h,k){Tb.apply(this,arguments);if(Ob){if(Ob){var l=Pb;Ob=!1;Pb=null;}else throw Error(p$4(198));Qb||(Qb=!0,Rb=l);}}function Vb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else {a=b;do b=a,0!==(b.flags&4098)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function Wb(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function Xb(a){if(Vb(a)!==a)throw Error(p$4(188));}
function Yb(a){var b=a.alternate;if(!b){b=Vb(a);if(null===b)throw Error(p$4(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return Xb(e),a;if(f===d)return Xb(e),b;f=f.sibling;}throw Error(p$4(188));}if(c.return!==d.return)c=e,d=f;else {for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling;}if(!g){for(h=f.child;h;){if(h===
c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling;}if(!g)throw Error(p$4(189));}}if(c.alternate!==d)throw Error(p$4(190));}if(3!==c.tag)throw Error(p$4(188));return c.stateNode.current===c?a:b}function Zb(a){a=Yb(a);return null!==a?$b(a):null}function $b(a){if(5===a.tag||6===a.tag)return a;for(a=a.child;null!==a;){var b=$b(a);if(null!==b)return b;a=a.sibling;}return null}
var ac=ca.unstable_scheduleCallback,bc=ca.unstable_cancelCallback,cc=ca.unstable_shouldYield,dc=ca.unstable_requestPaint,B$1=ca.unstable_now,ec=ca.unstable_getCurrentPriorityLevel,fc=ca.unstable_ImmediatePriority,gc=ca.unstable_UserBlockingPriority,hc=ca.unstable_NormalPriority,ic=ca.unstable_LowPriority,jc=ca.unstable_IdlePriority,kc=null,lc=null;function mc(a){if(lc&&"function"===typeof lc.onCommitFiberRoot)try{lc.onCommitFiberRoot(kc,a,void 0,128===(a.current.flags&128));}catch(b){}}
var oc=Math.clz32?Math.clz32:nc,pc=Math.log,qc=Math.LN2;function nc(a){a>>>=0;return 0===a?32:31-(pc(a)/qc|0)|0}var rc=64,sc=4194304;
function tc(a){switch(a&-a){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return a&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;
default:return a}}function uc(a,b){var c=a.pendingLanes;if(0===c)return 0;var d=0,e=a.suspendedLanes,f=a.pingedLanes,g=c&268435455;if(0!==g){var h=g&~e;0!==h?d=tc(h):(f&=g,0!==f&&(d=tc(f)));}else g=c&~e,0!==g?d=tc(g):0!==f&&(d=tc(f));if(0===d)return 0;if(0!==b&&b!==d&&0===(b&e)&&(e=d&-d,f=b&-b,e>=f||16===e&&0!==(f&4194240)))return b;0!==(d&4)&&(d|=c&16);b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-oc(b),e=1<<c,d|=a[c],b&=~e;return d}
function vc(a,b){switch(a){case 1:case 2:case 4:return b+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return b+5E3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return -1;case 134217728:case 268435456:case 536870912:case 1073741824:return -1;default:return -1}}
function wc(a,b){for(var c=a.suspendedLanes,d=a.pingedLanes,e=a.expirationTimes,f=a.pendingLanes;0<f;){var g=31-oc(f),h=1<<g,k=e[g];if(-1===k){if(0===(h&c)||0!==(h&d))e[g]=vc(h,b);}else k<=b&&(a.expiredLanes|=h);f&=~h;}}function xc(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function yc(){var a=rc;rc<<=1;0===(rc&4194240)&&(rc=64);return a}function zc(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
function Ac(a,b,c){a.pendingLanes|=b;536870912!==b&&(a.suspendedLanes=0,a.pingedLanes=0);a=a.eventTimes;b=31-oc(b);a[b]=c;}function Bc(a,b){var c=a.pendingLanes&~b;a.pendingLanes=b;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=b;a.mutableReadLanes&=b;a.entangledLanes&=b;b=a.entanglements;var d=a.eventTimes;for(a=a.expirationTimes;0<c;){var e=31-oc(c),f=1<<e;b[e]=0;d[e]=-1;a[e]=-1;c&=~f;}}
function Cc(a,b){var c=a.entangledLanes|=b;for(a=a.entanglements;c;){var d=31-oc(c),e=1<<d;e&b|a[d]&b&&(a[d]|=b);c&=~e;}}var C$2=0;function Dc(a){a&=-a;return 1<a?4<a?0!==(a&268435455)?16:536870912:4:1}var Ec,Fc,Gc,Hc,Ic,Jc=!1,Kc=[],Lc=null,Mc=null,Nc=null,Oc=new Map,Pc=new Map,Qc=[],Rc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a,b){switch(a){case "focusin":case "focusout":Lc=null;break;case "dragenter":case "dragleave":Mc=null;break;case "mouseover":case "mouseout":Nc=null;break;case "pointerover":case "pointerout":Oc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":Pc.delete(b.pointerId);}}
function Tc(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a={blockedOn:b,domEventName:c,eventSystemFlags:d,nativeEvent:f,targetContainers:[e]},null!==b&&(b=Cb(b),null!==b&&Fc(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
function Uc(a,b,c,d,e){switch(b){case "focusin":return Lc=Tc(Lc,a,b,c,d,e),!0;case "dragenter":return Mc=Tc(Mc,a,b,c,d,e),!0;case "mouseover":return Nc=Tc(Nc,a,b,c,d,e),!0;case "pointerover":var f=e.pointerId;Oc.set(f,Tc(Oc.get(f)||null,a,b,c,d,e));return !0;case "gotpointercapture":return f=e.pointerId,Pc.set(f,Tc(Pc.get(f)||null,a,b,c,d,e)),!0}return !1}
function Vc(a){var b=Wc(a.target);if(null!==b){var c=Vb(b);if(null!==c)if(b=c.tag,13===b){if(b=Wb(c),null!==b){a.blockedOn=b;Ic(a.priority,function(){Gc(c);});return}}else if(3===b&&c.stateNode.current.memoizedState.isDehydrated){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null;}
function Xc(a){if(null!==a.blockedOn)return !1;for(var b=a.targetContainers;0<b.length;){var c=Yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null===c){c=a.nativeEvent;var d=new c.constructor(c.type,c);wb=d;c.target.dispatchEvent(d);wb=null;}else return b=Cb(c),null!==b&&Fc(b),a.blockedOn=c,!1;b.shift();}return !0}function Zc(a,b,c){Xc(a)&&c.delete(b);}function $c(){Jc=!1;null!==Lc&&Xc(Lc)&&(Lc=null);null!==Mc&&Xc(Mc)&&(Mc=null);null!==Nc&&Xc(Nc)&&(Nc=null);Oc.forEach(Zc);Pc.forEach(Zc);}
function ad(a,b){a.blockedOn===b&&(a.blockedOn=null,Jc||(Jc=!0,ca.unstable_scheduleCallback(ca.unstable_NormalPriority,$c)));}
function bd(a){function b(b){return ad(b,a)}if(0<Kc.length){ad(Kc[0],a);for(var c=1;c<Kc.length;c++){var d=Kc[c];d.blockedOn===a&&(d.blockedOn=null);}}null!==Lc&&ad(Lc,a);null!==Mc&&ad(Mc,a);null!==Nc&&ad(Nc,a);Oc.forEach(b);Pc.forEach(b);for(c=0;c<Qc.length;c++)d=Qc[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<Qc.length&&(c=Qc[0],null===c.blockedOn);)Vc(c),null===c.blockedOn&&Qc.shift();}var cd=ua.ReactCurrentBatchConfig,dd=!0;
function ed(a,b,c,d){var e=C$2,f=cd.transition;cd.transition=null;try{C$2=1,fd(a,b,c,d);}finally{C$2=e,cd.transition=f;}}function gd(a,b,c,d){var e=C$2,f=cd.transition;cd.transition=null;try{C$2=4,fd(a,b,c,d);}finally{C$2=e,cd.transition=f;}}
function fd(a,b,c,d){if(dd){var e=Yc(a,b,c,d);if(null===e)hd(a,b,d,id,c),Sc(a,d);else if(Uc(e,a,b,c,d))d.stopPropagation();else if(Sc(a,d),b&4&&-1<Rc.indexOf(a)){for(;null!==e;){var f=Cb(e);null!==f&&Ec(f);f=Yc(a,b,c,d);null===f&&hd(a,b,d,id,c);if(f===e)break;e=f;}null!==e&&d.stopPropagation();}else hd(a,b,d,null,c);}}var id=null;
function Yc(a,b,c,d){id=null;a=xb(d);a=Wc(a);if(null!==a)if(b=Vb(a),null===b)a=null;else if(c=b.tag,13===c){a=Wb(b);if(null!==a)return a;a=null;}else if(3===c){if(b.stateNode.current.memoizedState.isDehydrated)return 3===b.tag?b.stateNode.containerInfo:null;a=null;}else b!==a&&(a=null);id=a;return null}
function jd(a){switch(a){case "cancel":case "click":case "close":case "contextmenu":case "copy":case "cut":case "auxclick":case "dblclick":case "dragend":case "dragstart":case "drop":case "focusin":case "focusout":case "input":case "invalid":case "keydown":case "keypress":case "keyup":case "mousedown":case "mouseup":case "paste":case "pause":case "play":case "pointercancel":case "pointerdown":case "pointerup":case "ratechange":case "reset":case "resize":case "seeked":case "submit":case "touchcancel":case "touchend":case "touchstart":case "volumechange":case "change":case "selectionchange":case "textInput":case "compositionstart":case "compositionend":case "compositionupdate":case "beforeblur":case "afterblur":case "beforeinput":case "blur":case "fullscreenchange":case "focus":case "hashchange":case "popstate":case "select":case "selectstart":return 1;case "drag":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "mousemove":case "mouseout":case "mouseover":case "pointermove":case "pointerout":case "pointerover":case "scroll":case "toggle":case "touchmove":case "wheel":case "mouseenter":case "mouseleave":case "pointerenter":case "pointerleave":return 4;
case "message":switch(ec()){case fc:return 1;case gc:return 4;case hc:case ic:return 16;case jc:return 536870912;default:return 16}default:return 16}}var kd=null,ld=null,md=null;function nd(){if(md)return md;var a,b=ld,c=b.length,d,e="value"in kd?kd.value:kd.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md=e.slice(a,1<d?1-d:void 0)}
function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd(){return !0}function qd(){return !1}
function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:!1===f.returnValue)?pd:qd;this.isPropagationStopped=qd;return this}A$1(b.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
(a.returnValue=!1),this.isDefaultPrevented=pd);},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=pd);},persist:function(){},isPersistent:pd});return b}
var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td=rd(sd),ud=A$1({},sd,{view:0,detail:0}),vd=rd(ud),wd,xd,yd,Ad=A$1({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
a)return a.movementX;a!==yd&&(yd&&"mousemove"===a.type?(wd=a.screenX-yd.screenX,xd=a.screenY-yd.screenY):xd=wd=0,yd=a);return wd},movementY:function(a){return "movementY"in a?a.movementY:xd}}),Bd=rd(Ad),Cd=A$1({},Ad,{dataTransfer:0}),Dd=rd(Cd),Ed=A$1({},ud,{relatedTarget:0}),Fd=rd(Ed),Gd=A$1({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd),Id=A$1({},sd,{clipboardData:function(a){return "clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd=rd(Id),Kd=A$1({},sd,{data:0}),Ld=rd(Kd),Md={Esc:"Escape",
Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od[a])?!!b[a]:!1}function zd(){return Pd}
var Qd=A$1({},ud,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return "keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return "keypress"===a.type?od(a):0},keyCode:function(a){return "keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return "keypress"===
a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd),Sd=A$1({},Ad,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=rd(Sd),Ud=A$1({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud),Wd=A$1({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd),Yd=A$1({},Ad,{deltaX:function(a){return "deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
deltaY:function(a){return "deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae$1=ia&&"CompositionEvent"in window,be$1=null;ia&&"documentMode"in document&&(be$1=document.documentMode);var ce$1=ia&&"TextEvent"in window&&!be$1,de$1=ia&&(!ae$1||be$1&&8<be$1&&11>=be$1),ee$1=String.fromCharCode(32),fe$1=!1;
function ge$1(a,b){switch(a){case "keyup":return -1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return !0;default:return !1}}function he$1(a){a=a.detail;return "object"===typeof a&&"data"in a?a.data:null}var ie$1=!1;function je(a,b){switch(a){case "compositionend":return he$1(b);case "keypress":if(32!==b.which)return null;fe$1=!0;return ee$1;case "textInput":return a=b.data,a===ee$1&&fe$1?null:a;default:return null}}
function ke$1(a,b){if(ie$1)return "compositionend"===a||!ae$1&&ge$1(a,b)?(a=nd(),md=ld=kd=null,ie$1=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de$1&&"ko"!==b.locale?null:b.data;default:return null}}
var le$1={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function me$1(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return "input"===b?!!le$1[a.type]:"textarea"===b?!0:!1}function ne$1(a,b,c,d){Eb(d);b=oe(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}));}var pe$1=null,qe=null;function re$1(a){se$1(a,0);}function te$1(a){var b=ue$1(a);if(Wa(b))return a}
function ve$1(a,b){if("change"===a)return b}var we$1=!1;if(ia){var xe$1;if(ia){var ye$1="oninput"in document;if(!ye$1){var ze$1=document.createElement("div");ze$1.setAttribute("oninput","return;");ye$1="function"===typeof ze$1.oninput;}xe$1=ye$1;}else xe$1=!1;we$1=xe$1&&(!document.documentMode||9<document.documentMode);}function Ae$1(){pe$1&&(pe$1.detachEvent("onpropertychange",Be),qe=pe$1=null);}function Be(a){if("value"===a.propertyName&&te$1(qe)){var b=[];ne$1(b,qe,a,xb(a));Jb(re$1,b);}}
function Ce$1(a,b,c){"focusin"===a?(Ae$1(),pe$1=b,qe=c,pe$1.attachEvent("onpropertychange",Be)):"focusout"===a&&Ae$1();}function De$1(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te$1(qe)}function Ee$1(a,b){if("click"===a)return te$1(b)}function Fe$1(a,b){if("input"===a||"change"===a)return te$1(b)}function Ge$1(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He$1="function"===typeof Object.is?Object.is:Ge$1;
function Ie$1(a,b){if(He$1(a,b))return !0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return !1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return !1;for(d=0;d<c.length;d++){var e=c[d];if(!ja.call(b,e)||!He$1(a[e],b[e]))return !1}return !0}function Je$1(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
function Ke$1(a,b){var c=Je$1(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return {node:c,offset:b-a};a=d;}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode;}c=void 0;}c=Je$1(c);}}function Le$1(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Le$1(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
function Me$1(){for(var a=window,b=Xa();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href;}catch(d){c=!1;}if(c)a=b.contentWindow;else break;b=Xa(a.document);}return b}function Ne$1(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
function Oe$1(a){var b=Me$1(),c=a.focusedElem,d=a.selectionRange;if(b!==c&&c&&c.ownerDocument&&Le$1(c.ownerDocument.documentElement,c)){if(null!==d&&Ne$1(c))if(b=d.start,a=d.end,void 0===a&&(a=b),"selectionStart"in c)c.selectionStart=b,c.selectionEnd=Math.min(a,c.value.length);else if(a=(b=c.ownerDocument||document)&&b.defaultView||window,a.getSelection){a=a.getSelection();var e=c.textContent.length,f=Math.min(d.start,e);d=void 0===d.end?f:Math.min(d.end,e);!a.extend&&f>d&&(e=d,d=f,f=e);e=Ke$1(c,f);var g=Ke$1(c,
d);e&&g&&(1!==a.rangeCount||a.anchorNode!==e.node||a.anchorOffset!==e.offset||a.focusNode!==g.node||a.focusOffset!==g.offset)&&(b=b.createRange(),b.setStart(e.node,e.offset),a.removeAllRanges(),f>d?(a.addRange(b),a.extend(g.node,g.offset)):(b.setEnd(g.node,g.offset),a.addRange(b)));}b=[];for(a=c;a=a.parentNode;)1===a.nodeType&&b.push({element:a,left:a.scrollLeft,top:a.scrollTop});"function"===typeof c.focus&&c.focus();for(c=0;c<b.length;c++)a=b[c],a.element.scrollLeft=a.left,a.element.scrollTop=a.top;}}
var Pe$1=ia&&"documentMode"in document&&11>=document.documentMode,Qe$1=null,Re$1=null,Se$1=null,Te$1=!1;
function Ue$1(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te$1||null==Qe$1||Qe$1!==Xa(d)||(d=Qe$1,"selectionStart"in d&&Ne$1(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se$1&&Ie$1(Se$1,d)||(Se$1=d,d=oe(Re$1,"onSelect"),0<d.length&&(b=new td("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe$1)));}
function Ve$1(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var We$1={animationend:Ve$1("Animation","AnimationEnd"),animationiteration:Ve$1("Animation","AnimationIteration"),animationstart:Ve$1("Animation","AnimationStart"),transitionend:Ve$1("Transition","TransitionEnd")},Xe$1={},Ye={};
ia&&(Ye=document.createElement("div").style,"AnimationEvent"in window||(delete We$1.animationend.animation,delete We$1.animationiteration.animation,delete We$1.animationstart.animation),"TransitionEvent"in window||delete We$1.transitionend.transition);function Ze$1(a){if(Xe$1[a])return Xe$1[a];if(!We$1[a])return a;var b=We$1[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Ye)return Xe$1[a]=b[c];return a}var $e$1=Ze$1("animationend"),af=Ze$1("animationiteration"),bf=Ze$1("animationstart"),cf=Ze$1("transitionend"),df=new Map,ef="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a,b){df.set(a,b);fa(b,[a]);}for(var gf=0;gf<ef.length;gf++){var hf=ef[gf],jf=hf.toLowerCase(),kf=hf[0].toUpperCase()+hf.slice(1);ff(jf,"on"+kf);}ff($e$1,"onAnimationEnd");ff(af,"onAnimationIteration");ff(bf,"onAnimationStart");ff("dblclick","onDoubleClick");ff("focusin","onFocus");ff("focusout","onBlur");ff(cf,"onTransitionEnd");ha("onMouseEnter",["mouseout","mouseover"]);ha("onMouseLeave",["mouseout","mouseover"]);ha("onPointerEnter",["pointerout","pointerover"]);
ha("onPointerLeave",["pointerout","pointerover"]);fa("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));fa("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));fa("onBeforeInput",["compositionend","keypress","textInput","paste"]);fa("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));fa("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var lf$1="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),mf=new Set("cancel close invalid load scroll toggle".split(" ").concat(lf$1));
function nf(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Ub(d,b,void 0,a);a.currentTarget=null;}
function se$1(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k;}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k;}}}if(Qb)throw a=Rb,Qb=!1,Rb=null,a;}
function D$1(a,b){var c=b[of];void 0===c&&(c=b[of]=new Set);var d=a+"__bubble";c.has(d)||(pf(b,a,2,!1),c.add(d));}function qf(a,b,c){var d=0;b&&(d|=4);pf(c,a,d,b);}var rf="_reactListening"+Math.random().toString(36).slice(2);function sf(a){if(!a[rf]){a[rf]=!0;da.forEach(function(b){"selectionchange"!==b&&(mf.has(b)||qf(b,!1,a),qf(b,!0,a));});var b=9===a.nodeType?a:a.ownerDocument;null===b||b[rf]||(b[rf]=!0,qf("selectionchange",!1,b));}}
function pf(a,b,c,d){switch(jd(b)){case 1:var e=ed;break;case 4:e=gd;break;default:e=fd;}c=e.bind(null,b,c,a);e=void 0;!Lb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=!0);d?void 0!==e?a.addEventListener(b,c,{capture:!0,passive:e}):a.addEventListener(b,c,!0):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,!1);}
function hd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return;}for(;null!==h;){g=Wc(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode;}}d=d.return;}Jb(function(){var d=f,e=xb(c),g=[];
a:{var h=df.get(a);if(void 0!==h){var k=td,n=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":n="focus";k=Fd;break;case "focusout":n="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case $e$1:case af:case bf:k=Hd;break;case cf:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td;}var t=0!==(b&4),J=!t&&"scroll"===a,x=t?null!==h?h+"Capture":null:h;t=[];for(var w=d,u;null!==
w;){u=w;var F=u.stateNode;5===u.tag&&null!==F&&(u=F,null!==x&&(F=Kb(w,x),null!=F&&t.push(tf(w,F,u))));if(J)break;w=w.return;}0<t.length&&(h=new k(h,n,null,c,e),g.push({event:h,listeners:t}));}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&c!==wb&&(n=c.relatedTarget||c.fromElement)&&(Wc(n)||n[uf]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(n=c.relatedTarget||c.toElement,k=d,n=n?Wc(n):null,null!==
n&&(J=Vb(n),n!==J||5!==n.tag&&6!==n.tag))n=null;}else k=null,n=d;if(k!==n){t=Bd;F="onMouseLeave";x="onMouseEnter";w="mouse";if("pointerout"===a||"pointerover"===a)t=Td,F="onPointerLeave",x="onPointerEnter",w="pointer";J=null==k?h:ue$1(k);u=null==n?h:ue$1(n);h=new t(F,w+"leave",k,c,e);h.target=J;h.relatedTarget=u;F=null;Wc(e)===d&&(t=new t(x,w+"enter",n,c,e),t.target=u,t.relatedTarget=J,F=t);J=F;if(k&&n)b:{t=k;x=n;w=0;for(u=t;u;u=vf(u))w++;u=0;for(F=x;F;F=vf(F))u++;for(;0<w-u;)t=vf(t),w--;for(;0<u-w;)x=
vf(x),u--;for(;w--;){if(t===x||null!==x&&t===x.alternate)break b;t=vf(t);x=vf(x);}t=null;}else t=null;null!==k&&wf(g,h,k,t,!1);null!==n&&null!==J&&wf(g,J,n,t,!0);}}}a:{h=d?ue$1(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var na=ve$1;else if(me$1(h))if(we$1)na=Fe$1;else {na=De$1;var xa=Ce$1;}else (k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(na=Ee$1);if(na&&(na=na(a,d))){ne$1(g,na,c,e);break a}xa&&xa(a,h,d);"focusout"===a&&(xa=h._wrapperState)&&
xa.controlled&&"number"===h.type&&cb(h,"number",h.value);}xa=d?ue$1(d):window;switch(a){case "focusin":if(me$1(xa)||"true"===xa.contentEditable)Qe$1=xa,Re$1=d,Se$1=null;break;case "focusout":Se$1=Re$1=Qe$1=null;break;case "mousedown":Te$1=!0;break;case "contextmenu":case "mouseup":case "dragend":Te$1=!1;Ue$1(g,c,e);break;case "selectionchange":if(Pe$1)break;case "keydown":case "keyup":Ue$1(g,c,e);}var $a;if(ae$1)b:{switch(a){case "compositionstart":var ba="onCompositionStart";break b;case "compositionend":ba="onCompositionEnd";
break b;case "compositionupdate":ba="onCompositionUpdate";break b}ba=void 0;}else ie$1?ge$1(a,c)&&(ba="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(ba="onCompositionStart");ba&&(de$1&&"ko"!==c.locale&&(ie$1||"onCompositionStart"!==ba?"onCompositionEnd"===ba&&ie$1&&($a=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie$1=!0)),xa=oe(d,ba),0<xa.length&&(ba=new Ld(ba,a,null,c,e),g.push({event:ba,listeners:xa}),$a?ba.data=$a:($a=he$1(c),null!==$a&&(ba.data=$a))));if($a=ce$1?je(a,c):ke$1(a,c))d=oe(d,"onBeforeInput"),
0<d.length&&(e=new Ld("onBeforeInput","beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=$a);}se$1(g,b);});}function tf(a,b,c){return {instance:a,listener:b,currentTarget:c}}function oe(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Kb(a,c),null!=f&&d.unshift(tf(a,f,e)),f=Kb(a,b),null!=f&&d.push(tf(a,f,e)));a=a.return;}return d}function vf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
function wf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Kb(c,f),null!=k&&g.unshift(tf(c,k,h))):e||(k=Kb(c,f),null!=k&&g.push(tf(c,k,h))));c=c.return;}0!==g.length&&a.push({event:b,listeners:g});}var xf=/\r\n?/g,yf=/\u0000|\uFFFD/g;function zf(a){return ("string"===typeof a?a:""+a).replace(xf,"\n").replace(yf,"")}function Af(a,b,c){b=zf(b);if(zf(a)!==b&&c)throw Error(p$4(425));}function Bf(){}
var Cf=null,Df=null;function Ef(a,b){return "textarea"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}
var Ff="function"===typeof setTimeout?setTimeout:void 0,Gf="function"===typeof clearTimeout?clearTimeout:void 0,Hf="function"===typeof Promise?Promise:void 0,Jf="function"===typeof queueMicrotask?queueMicrotask:"undefined"!==typeof Hf?function(a){return Hf.resolve(null).then(a).catch(If)}:Ff;function If(a){setTimeout(function(){throw a;});}
function Kf(a,b){var c=b,d=0;do{var e=c.nextSibling;a.removeChild(c);if(e&&8===e.nodeType)if(c=e.data,"/$"===c){if(0===d){a.removeChild(e);bd(b);return}d--;}else "$"!==c&&"$?"!==c&&"$!"!==c||d++;c=e;}while(c);bd(b);}function Lf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break;if(8===b){b=a.data;if("$"===b||"$!"===b||"$?"===b)break;if("/$"===b)return null}}return a}
function Mf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--;}else "/$"===c&&b++;}a=a.previousSibling;}return null}var Nf=Math.random().toString(36).slice(2),Of="__reactFiber$"+Nf,Pf="__reactProps$"+Nf,uf="__reactContainer$"+Nf,of="__reactEvents$"+Nf,Qf="__reactListeners$"+Nf,Rf="__reactHandles$"+Nf;
function Wc(a){var b=a[Of];if(b)return b;for(var c=a.parentNode;c;){if(b=c[uf]||c[Of]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=Mf(a);null!==a;){if(c=a[Of])return c;a=Mf(a);}return b}a=c;c=a.parentNode;}return null}function Cb(a){a=a[Of]||a[uf];return !a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue$1(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(p$4(33));}function Db(a){return a[Pf]||null}var Sf=[],Tf=-1;function Uf(a){return {current:a}}
function E(a){0>Tf||(a.current=Sf[Tf],Sf[Tf]=null,Tf--);}function G$1(a,b){Tf++;Sf[Tf]=a.current;a.current=b;}var Vf={},H$2=Uf(Vf),Wf=Uf(!1),Xf=Vf;function Yf(a,b){var c=a.type.contextTypes;if(!c)return Vf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}
function Zf(a){a=a.childContextTypes;return null!==a&&void 0!==a}function $f(){E(Wf);E(H$2);}function ag(a,b,c){if(H$2.current!==Vf)throw Error(p$4(168));G$1(H$2,b);G$1(Wf,c);}function bg(a,b,c){var d=a.stateNode;b=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in b))throw Error(p$4(108,Ra(a)||"Unknown",e));return A$1({},c,d)}
function cg(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Vf;Xf=H$2.current;G$1(H$2,a);G$1(Wf,Wf.current);return !0}function dg(a,b,c){var d=a.stateNode;if(!d)throw Error(p$4(169));c?(a=bg(a,b,Xf),d.__reactInternalMemoizedMergedChildContext=a,E(Wf),E(H$2),G$1(H$2,a)):E(Wf);G$1(Wf,c);}var eg=null,fg=!1,gg=!1;function hg(a){null===eg?eg=[a]:eg.push(a);}function ig(a){fg=!0;hg(a);}
function jg(){if(!gg&&null!==eg){gg=!0;var a=0,b=C$2;try{var c=eg;for(C$2=1;a<c.length;a++){var d=c[a];do d=d(!0);while(null!==d)}eg=null;fg=!1;}catch(e){throw null!==eg&&(eg=eg.slice(a+1)),ac(fc,jg),e;}finally{C$2=b,gg=!1;}}return null}var kg=[],lg=0,mg=null,ng=0,og=[],pg=0,qg=null,rg=1,sg="";function tg(a,b){kg[lg++]=ng;kg[lg++]=mg;mg=a;ng=b;}
function ug(a,b,c){og[pg++]=rg;og[pg++]=sg;og[pg++]=qg;qg=a;var d=rg;a=sg;var e=32-oc(d)-1;d&=~(1<<e);c+=1;var f=32-oc(b)+e;if(30<f){var g=e-e%5;f=(d&(1<<g)-1).toString(32);d>>=g;e-=g;rg=1<<32-oc(b)+e|c<<e|d;sg=f+a;}else rg=1<<f|c<<e|d,sg=a;}function vg(a){null!==a.return&&(tg(a,1),ug(a,1,0));}function wg(a){for(;a===mg;)mg=kg[--lg],kg[lg]=null,ng=kg[--lg],kg[lg]=null;for(;a===qg;)qg=og[--pg],og[pg]=null,sg=og[--pg],og[pg]=null,rg=og[--pg],og[pg]=null;}var xg=null,yg=null,I$1=!1,zg=null;
function Ag(a,b){var c=Bg(5,null,null,0);c.elementType="DELETED";c.stateNode=b;c.return=a;b=a.deletions;null===b?(a.deletions=[c],a.flags|=16):b.push(c);}
function Cg(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,xg=a,yg=Lf(b.firstChild),!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,xg=a,yg=null,!0):!1;case 13:return b=8!==b.nodeType?null:b,null!==b?(c=null!==qg?{id:rg,overflow:sg}:null,a.memoizedState={dehydrated:b,treeContext:c,retryLane:1073741824},c=Bg(18,null,null,0),c.stateNode=b,c.return=a,a.child=c,xg=a,yg=
null,!0):!1;default:return !1}}function Dg(a){return 0!==(a.mode&1)&&0===(a.flags&128)}function Eg(a){if(I$1){var b=yg;if(b){var c=b;if(!Cg(a,b)){if(Dg(a))throw Error(p$4(418));b=Lf(c.nextSibling);var d=xg;b&&Cg(a,b)?Ag(d,c):(a.flags=a.flags&-4097|2,I$1=!1,xg=a);}}else {if(Dg(a))throw Error(p$4(418));a.flags=a.flags&-4097|2;I$1=!1;xg=a;}}}function Fg(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;xg=a;}
function Gg(a){if(a!==xg)return !1;if(!I$1)return Fg(a),I$1=!0,!1;var b;(b=3!==a.tag)&&!(b=5!==a.tag)&&(b=a.type,b="head"!==b&&"body"!==b&&!Ef(a.type,a.memoizedProps));if(b&&(b=yg)){if(Dg(a))throw Hg(),Error(p$4(418));for(;b;)Ag(a,b),b=Lf(b.nextSibling);}Fg(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(p$4(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){yg=Lf(a.nextSibling);break a}b--;}else "$"!==c&&"$!"!==c&&"$?"!==c||b++;}a=a.nextSibling;}yg=
null;}}else yg=xg?Lf(a.stateNode.nextSibling):null;return !0}function Hg(){for(var a=yg;a;)a=Lf(a.nextSibling);}function Ig(){yg=xg=null;I$1=!1;}function Jg(a){null===zg?zg=[a]:zg.push(a);}var Kg=ua.ReactCurrentBatchConfig;
function Lg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(p$4(309));var d=c.stateNode;}if(!d)throw Error(p$4(147,a));var e=d,f=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===f)return b.ref;b=function(a){var b=e.refs;null===a?delete b[f]:b[f]=a;};b._stringRef=f;return b}if("string"!==typeof a)throw Error(p$4(284));if(!c._owner)throw Error(p$4(290,a));}return a}
function Mg(a,b){a=Object.prototype.toString.call(b);throw Error(p$4(31,"[object Object]"===a?"object with keys {"+Object.keys(b).join(", ")+"}":a));}function Ng(a){var b=a._init;return b(a._payload)}
function Og(a){function b(b,c){if(a){var d=b.deletions;null===d?(b.deletions=[c],b.flags|=16):d.push(c);}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Pg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return b.flags|=1048576,c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags|=2,c):d;b.flags|=2;return c}function g(b){a&&
null===b.alternate&&(b.flags|=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Qg(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){var f=c.type;if(f===ya)return m(a,b,c.props.children,d,c.key);if(null!==b&&(b.elementType===f||"object"===typeof f&&null!==f&&f.$$typeof===Ha&&Ng(f)===b.type))return d=e(b,c.props),d.ref=Lg(a,b,c),d.return=a,d;d=Rg(c.type,c.key,c.props,null,a.mode,d);d.ref=Lg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||
b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=Sg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function m(a,b,c,d,f){if(null===b||7!==b.tag)return b=Tg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function q(a,b,c){if("string"===typeof b&&""!==b||"number"===typeof b)return b=Qg(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case va:return c=Rg(b.type,b.key,b.props,null,a.mode,c),
c.ref=Lg(a,null,b),c.return=a,c;case wa:return b=Sg(b,a.mode,c),b.return=a,b;case Ha:var d=b._init;return q(a,d(b._payload),c)}if(eb(b)||Ka(b))return b=Tg(b,a.mode,c,null),b.return=a,b;Mg(a,b);}return null}function r(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c&&""!==c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case va:return c.key===e?k(a,b,c,d):null;case wa:return c.key===e?l(a,b,c,d):null;case Ha:return e=c._init,r(a,
b,e(c._payload),d)}if(eb(c)||Ka(c))return null!==e?null:m(a,b,c,d,null);Mg(a,c);}return null}function y(a,b,c,d,e){if("string"===typeof d&&""!==d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case va:return a=a.get(null===d.key?c:d.key)||null,k(b,a,d,e);case wa:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e);case Ha:var f=d._init;return y(a,b,c,f(d._payload),e)}if(eb(d)||Ka(d))return a=a.get(c)||null,m(b,a,d,e,null);Mg(b,d);}return null}
function n(e,g,h,k){for(var l=null,m=null,u=g,w=g=0,x=null;null!==u&&w<h.length;w++){u.index>w?(x=u,u=null):x=u.sibling;var n=r(e,u,h[w],k);if(null===n){null===u&&(u=x);break}a&&u&&null===n.alternate&&b(e,u);g=f(n,g,w);null===m?l=n:m.sibling=n;m=n;u=x;}if(w===h.length)return c(e,u),I$1&&tg(e,w),l;if(null===u){for(;w<h.length;w++)u=q(e,h[w],k),null!==u&&(g=f(u,g,w),null===m?l=u:m.sibling=u,m=u);I$1&&tg(e,w);return l}for(u=d(e,u);w<h.length;w++)x=y(u,e,w,h[w],k),null!==x&&(a&&null!==x.alternate&&u.delete(null===
x.key?w:x.key),g=f(x,g,w),null===m?l=x:m.sibling=x,m=x);a&&u.forEach(function(a){return b(e,a)});I$1&&tg(e,w);return l}function t(e,g,h,k){var l=Ka(h);if("function"!==typeof l)throw Error(p$4(150));h=l.call(h);if(null==h)throw Error(p$4(151));for(var u=l=null,m=g,w=g=0,x=null,n=h.next();null!==m&&!n.done;w++,n=h.next()){m.index>w?(x=m,m=null):x=m.sibling;var t=r(e,m,n.value,k);if(null===t){null===m&&(m=x);break}a&&m&&null===t.alternate&&b(e,m);g=f(t,g,w);null===u?l=t:u.sibling=t;u=t;m=x;}if(n.done)return c(e,
m),I$1&&tg(e,w),l;if(null===m){for(;!n.done;w++,n=h.next())n=q(e,n.value,k),null!==n&&(g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);I$1&&tg(e,w);return l}for(m=d(e,m);!n.done;w++,n=h.next())n=y(m,e,w,n.value,k),null!==n&&(a&&null!==n.alternate&&m.delete(null===n.key?w:n.key),g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);a&&m.forEach(function(a){return b(e,a)});I$1&&tg(e,w);return l}function J(a,d,f,h){"object"===typeof f&&null!==f&&f.type===ya&&null===f.key&&(f=f.props.children);if("object"===typeof f&&null!==f){switch(f.$$typeof){case va:a:{for(var k=
f.key,l=d;null!==l;){if(l.key===k){k=f.type;if(k===ya){if(7===l.tag){c(a,l.sibling);d=e(l,f.props.children);d.return=a;a=d;break a}}else if(l.elementType===k||"object"===typeof k&&null!==k&&k.$$typeof===Ha&&Ng(k)===l.type){c(a,l.sibling);d=e(l,f.props);d.ref=Lg(a,l,f);d.return=a;a=d;break a}c(a,l);break}else b(a,l);l=l.sibling;}f.type===ya?(d=Tg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Rg(f.type,f.key,f.props,null,a.mode,h),h.ref=Lg(a,d,f),h.return=a,a=h);}return g(a);case wa:a:{for(l=f.key;null!==
d;){if(d.key===l)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else {c(a,d);break}else b(a,d);d=d.sibling;}d=Sg(f,a.mode,h);d.return=a;a=d;}return g(a);case Ha:return l=f._init,J(a,d,l(f._payload),h)}if(eb(f))return n(a,d,f,h);if(Ka(f))return t(a,d,f,h);Mg(a,f);}return "string"===typeof f&&""!==f||"number"===typeof f?(f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):
(c(a,d),d=Qg(f,a.mode,h),d.return=a,a=d),g(a)):c(a,d)}return J}var Ug=Og(!0),Vg=Og(!1),Wg=Uf(null),Xg=null,Yg=null,Zg=null;function $g(){Zg=Yg=Xg=null;}function ah(a){var b=Wg.current;E(Wg);a._currentValue=b;}function bh(a,b,c){for(;null!==a;){var d=a.alternate;(a.childLanes&b)!==b?(a.childLanes|=b,null!==d&&(d.childLanes|=b)):null!==d&&(d.childLanes&b)!==b&&(d.childLanes|=b);if(a===c)break;a=a.return;}}
function ch(a,b){Xg=a;Zg=Yg=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(dh=!0),a.firstContext=null);}function eh(a){var b=a._currentValue;if(Zg!==a)if(a={context:a,memoizedValue:b,next:null},null===Yg){if(null===Xg)throw Error(p$4(308));Yg=a;Xg.dependencies={lanes:0,firstContext:a};}else Yg=Yg.next=a;return b}var fh=null;function gh(a){null===fh?fh=[a]:fh.push(a);}
function hh(a,b,c,d){var e=b.interleaved;null===e?(c.next=c,gh(b)):(c.next=e.next,e.next=c);b.interleaved=c;return ih(a,d)}function ih(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}var jh=!1;function kh(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null};}
function lh(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects});}function mh(a,b){return {eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}
function nh(a,b,c){var d=a.updateQueue;if(null===d)return null;d=d.shared;if(0!==(K$1&2)){var e=d.pending;null===e?b.next=b:(b.next=e.next,e.next=b);d.pending=b;return ih(a,c)}e=d.interleaved;null===e?(b.next=b,gh(d)):(b.next=e.next,e.next=b);d.interleaved=b;return ih(a,c)}function oh(a,b,c){b=b.updateQueue;if(null!==b&&(b=b.shared,0!==(c&4194240))){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c);}}
function ph(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next;}while(null!==c);null===f?e=f=b:f=f.next=b;}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
b;c.lastBaseUpdate=b;}
function qh(a,b,c,d){var e=a.updateQueue;jh=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var m=a.alternate;null!==m&&(m=m.updateQueue,h=m.lastBaseUpdate,h!==g&&(null===h?m.firstBaseUpdate=l:h.next=l,m.lastBaseUpdate=k));}if(null!==f){var q=e.baseState;g=0;m=l=k=null;h=f;do{var r=h.lane,y=h.eventTime;if((d&r)===r){null!==m&&(m=m.next={eventTime:y,lane:0,tag:h.tag,payload:h.payload,callback:h.callback,
next:null});a:{var n=a,t=h;r=b;y=c;switch(t.tag){case 1:n=t.payload;if("function"===typeof n){q=n.call(y,q,r);break a}q=n;break a;case 3:n.flags=n.flags&-65537|128;case 0:n=t.payload;r="function"===typeof n?n.call(y,q,r):n;if(null===r||void 0===r)break a;q=A$1({},q,r);break a;case 2:jh=!0;}}null!==h.callback&&0!==h.lane&&(a.flags|=64,r=e.effects,null===r?e.effects=[h]:r.push(h));}else y={eventTime:y,lane:r,tag:h.tag,payload:h.payload,callback:h.callback,next:null},null===m?(l=m=y,k=q):m=m.next=y,g|=r;
h=h.next;if(null===h)if(h=e.shared.pending,null===h)break;else r=h,h=r.next,r.next=null,e.lastBaseUpdate=r,e.shared.pending=null;}while(1);null===m&&(k=q);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=m;b=e.shared.interleaved;if(null!==b){e=b;do g|=e.lane,e=e.next;while(e!==b)}else null===f&&(e.shared.lanes=0);rh|=g;a.lanes=g;a.memoizedState=q;}}
function sh(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(p$4(191,e));e.call(d);}}}var th={},uh=Uf(th),vh=Uf(th),wh=Uf(th);function xh(a){if(a===th)throw Error(p$4(174));return a}
function yh(a,b){G$1(wh,b);G$1(vh,a);G$1(uh,th);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:lb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=lb(b,a);}E(uh);G$1(uh,b);}function zh(){E(uh);E(vh);E(wh);}function Ah(a){xh(wh.current);var b=xh(uh.current);var c=lb(b,a.type);b!==c&&(G$1(vh,a),G$1(uh,c));}function Bh(a){vh.current===a&&(E(uh),E(vh));}var L$3=Uf(0);
function Ch(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&128))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}return null}var Dh=[];
function Eh(){for(var a=0;a<Dh.length;a++)Dh[a]._workInProgressVersionPrimary=null;Dh.length=0;}var Fh=ua.ReactCurrentDispatcher,Gh=ua.ReactCurrentBatchConfig,Hh=0,M$3=null,N$2=null,O=null,Ih=!1,Jh=!1,Kh=0,Lh=0;function P(){throw Error(p$4(321));}function Mh(a,b){if(null===b)return !1;for(var c=0;c<b.length&&c<a.length;c++)if(!He$1(a[c],b[c]))return !1;return !0}
function Nh(a,b,c,d,e,f){Hh=f;M$3=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;Fh.current=null===a||null===a.memoizedState?Oh:Ph;a=c(d,e);if(Jh){f=0;do{Jh=!1;Kh=0;if(25<=f)throw Error(p$4(301));f+=1;O=N$2=null;b.updateQueue=null;Fh.current=Qh;a=c(d,e);}while(Jh)}Fh.current=Rh;b=null!==N$2&&null!==N$2.next;Hh=0;O=N$2=M$3=null;Ih=!1;if(b)throw Error(p$4(300));return a}function Sh(){var a=0!==Kh;Kh=0;return a}
function Th(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===O?M$3.memoizedState=O=a:O=O.next=a;return O}function Uh(){if(null===N$2){var a=M$3.alternate;a=null!==a?a.memoizedState:null;}else a=N$2.next;var b=null===O?M$3.memoizedState:O.next;if(null!==b)O=b,N$2=a;else {if(null===a)throw Error(p$4(310));N$2=a;a={memoizedState:N$2.memoizedState,baseState:N$2.baseState,baseQueue:N$2.baseQueue,queue:N$2.queue,next:null};null===O?M$3.memoizedState=O=a:O=O.next=a;}return O}
function Vh(a,b){return "function"===typeof b?b(a):b}
function Wh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p$4(311));c.lastRenderedReducer=a;var d=N$2,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g;}d.baseQueue=e=f;c.pending=null;}if(null!==e){f=e.next;d=d.baseState;var h=g=null,k=null,l=f;do{var m=l.lane;if((Hh&m)===m)null!==k&&(k=k.next={lane:0,action:l.action,hasEagerState:l.hasEagerState,eagerState:l.eagerState,next:null}),d=l.hasEagerState?l.eagerState:a(d,l.action);else {var q={lane:m,action:l.action,hasEagerState:l.hasEagerState,
eagerState:l.eagerState,next:null};null===k?(h=k=q,g=d):k=k.next=q;M$3.lanes|=m;rh|=m;}l=l.next;}while(null!==l&&l!==f);null===k?g=d:k.next=h;He$1(d,b.memoizedState)||(dh=!0);b.memoizedState=d;b.baseState=g;b.baseQueue=k;c.lastRenderedState=d;}a=c.interleaved;if(null!==a){e=a;do f=e.lane,M$3.lanes|=f,rh|=f,e=e.next;while(e!==a)}else null===e&&(c.lanes=0);return [b.memoizedState,c.dispatch]}
function Xh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p$4(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He$1(f,b.memoizedState)||(dh=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f;}return [f,d]}function Yh(){}
function Zh(a,b){var c=M$3,d=Uh(),e=b(),f=!He$1(d.memoizedState,e);f&&(d.memoizedState=e,dh=!0);d=d.queue;$h(ai$1.bind(null,c,d,a),[a]);if(d.getSnapshot!==b||f||null!==O&&O.memoizedState.tag&1){c.flags|=2048;bi(9,ci$1.bind(null,c,d,e,b),void 0,null);if(null===Q$2)throw Error(p$4(349));0!==(Hh&30)||di$1(c,b,e);}return e}function di$1(a,b,c){a.flags|=16384;a={getSnapshot:b,value:c};b=M$3.updateQueue;null===b?(b={lastEffect:null,stores:null},M$3.updateQueue=b,b.stores=[a]):(c=b.stores,null===c?b.stores=[a]:c.push(a));}
function ci$1(a,b,c,d){b.value=c;b.getSnapshot=d;ei$1(b)&&fi$1(a);}function ai$1(a,b,c){return c(function(){ei$1(b)&&fi$1(a);})}function ei$1(a){var b=a.getSnapshot;a=a.value;try{var c=b();return !He$1(a,c)}catch(d){return !0}}function fi$1(a){var b=ih(a,1);null!==b&&gi(b,a,1,-1);}
function hi$1(a){var b=Th();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Vh,lastRenderedState:a};b.queue=a;a=a.dispatch=ii$1.bind(null,M$3,a);return [b.memoizedState,a]}
function bi(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=M$3.updateQueue;null===b?(b={lastEffect:null,stores:null},M$3.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function ji(){return Uh().memoizedState}function ki(a,b,c,d){var e=Th();M$3.flags|=a;e.memoizedState=bi(1|b,c,void 0,void 0===d?null:d);}
function li$1(a,b,c,d){var e=Uh();d=void 0===d?null:d;var f=void 0;if(null!==N$2){var g=N$2.memoizedState;f=g.destroy;if(null!==d&&Mh(d,g.deps)){e.memoizedState=bi(b,c,f,d);return}}M$3.flags|=a;e.memoizedState=bi(1|b,c,f,d);}function mi$1(a,b){return ki(8390656,8,a,b)}function $h(a,b){return li$1(2048,8,a,b)}function ni$1(a,b){return li$1(4,2,a,b)}function oi$1(a,b){return li$1(4,4,a,b)}
function pi(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null);};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null;}}function qi(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return li$1(4,4,pi.bind(null,b,a),c)}function ri$1(){}function si$1(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}
function ti$1(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}function ui$1(a,b,c){if(0===(Hh&21))return a.baseState&&(a.baseState=!1,dh=!0),a.memoizedState=c;He$1(c,b)||(c=yc(),M$3.lanes|=c,rh|=c,a.baseState=!0);return b}function vi$1(a,b){var c=C$2;C$2=0!==c&&4>c?c:4;a(!0);var d=Gh.transition;Gh.transition={};try{a(!1),b();}finally{C$2=c,Gh.transition=d;}}function wi(){return Uh().memoizedState}
function xi$1(a,b,c){var d=yi(a);c={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(zi(a))Ai(b,c);else if(c=hh(a,b,c,d),null!==c){var e=R$1();gi(c,a,d,e);Bi(c,b,d);}}
function ii$1(a,b,c){var d=yi(a),e={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(zi(a))Ai(b,e);else {var f=a.alternate;if(0===a.lanes&&(null===f||0===f.lanes)&&(f=b.lastRenderedReducer,null!==f))try{var g=b.lastRenderedState,h=f(g,c);e.hasEagerState=!0;e.eagerState=h;if(He$1(h,g)){var k=b.interleaved;null===k?(e.next=e,gh(b)):(e.next=k.next,k.next=e);b.interleaved=e;return}}catch(l){}finally{}c=hh(a,b,e,d);null!==c&&(e=R$1(),gi(c,a,d,e),Bi(c,b,d));}}
function zi(a){var b=a.alternate;return a===M$3||null!==b&&b===M$3}function Ai(a,b){Jh=Ih=!0;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b;}function Bi(a,b,c){if(0!==(c&4194240)){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c);}}
var Rh={readContext:eh,useCallback:P,useContext:P,useEffect:P,useImperativeHandle:P,useInsertionEffect:P,useLayoutEffect:P,useMemo:P,useReducer:P,useRef:P,useState:P,useDebugValue:P,useDeferredValue:P,useTransition:P,useMutableSource:P,useSyncExternalStore:P,useId:P,unstable_isNewReconciler:!1},Oh={readContext:eh,useCallback:function(a,b){Th().memoizedState=[a,void 0===b?null:b];return a},useContext:eh,useEffect:mi$1,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return ki(4194308,
4,pi.bind(null,b,a),c)},useLayoutEffect:function(a,b){return ki(4194308,4,a,b)},useInsertionEffect:function(a,b){return ki(4,2,a,b)},useMemo:function(a,b){var c=Th();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Th();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};d.queue=a;a=a.dispatch=xi$1.bind(null,M$3,a);return [d.memoizedState,a]},useRef:function(a){var b=
Th();a={current:a};return b.memoizedState=a},useState:hi$1,useDebugValue:ri$1,useDeferredValue:function(a){return Th().memoizedState=a},useTransition:function(){var a=hi$1(!1),b=a[0];a=vi$1.bind(null,a[1]);Th().memoizedState=a;return [b,a]},useMutableSource:function(){},useSyncExternalStore:function(a,b,c){var d=M$3,e=Th();if(I$1){if(void 0===c)throw Error(p$4(407));c=c();}else {c=b();if(null===Q$2)throw Error(p$4(349));0!==(Hh&30)||di$1(d,b,c);}e.memoizedState=c;var f={value:c,getSnapshot:b};e.queue=f;mi$1(ai$1.bind(null,d,
f,a),[a]);d.flags|=2048;bi(9,ci$1.bind(null,d,f,c,b),void 0,null);return c},useId:function(){var a=Th(),b=Q$2.identifierPrefix;if(I$1){var c=sg;var d=rg;c=(d&~(1<<32-oc(d)-1)).toString(32)+c;b=":"+b+"R"+c;c=Kh++;0<c&&(b+="H"+c.toString(32));b+=":";}else c=Lh++,b=":"+b+"r"+c.toString(32)+":";return a.memoizedState=b},unstable_isNewReconciler:!1},Ph={readContext:eh,useCallback:si$1,useContext:eh,useEffect:$h,useImperativeHandle:qi,useInsertionEffect:ni$1,useLayoutEffect:oi$1,useMemo:ti$1,useReducer:Wh,useRef:ji,useState:function(){return Wh(Vh)},
useDebugValue:ri$1,useDeferredValue:function(a){var b=Uh();return ui$1(b,N$2.memoizedState,a)},useTransition:function(){var a=Wh(Vh)[0],b=Uh().memoizedState;return [a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi,unstable_isNewReconciler:!1},Qh={readContext:eh,useCallback:si$1,useContext:eh,useEffect:$h,useImperativeHandle:qi,useInsertionEffect:ni$1,useLayoutEffect:oi$1,useMemo:ti$1,useReducer:Xh,useRef:ji,useState:function(){return Xh(Vh)},useDebugValue:ri$1,useDeferredValue:function(a){var b=Uh();return null===
N$2?b.memoizedState=a:ui$1(b,N$2.memoizedState,a)},useTransition:function(){var a=Xh(Vh)[0],b=Uh().memoizedState;return [a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi,unstable_isNewReconciler:!1};function Ci(a,b){if(a&&a.defaultProps){b=A$1({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}function Di(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:A$1({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c);}
var Ei={isMounted:function(a){return (a=a._reactInternals)?Vb(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=R$1(),e=yi(a),f=mh(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi(b,a,e,d),oh(b,a,e));},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=R$1(),e=yi(a),f=mh(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi(b,a,e,d),oh(b,a,e));},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=R$1(),d=
yi(a),e=mh(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=b);b=nh(a,e,d);null!==b&&(gi(b,a,d,c),oh(b,a,d));}};function Fi(a,b,c,d,e,f,g){a=a.stateNode;return "function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Ie$1(c,d)||!Ie$1(e,f):!0}
function Gi(a,b,c){var d=!1,e=Vf;var f=b.contextType;"object"===typeof f&&null!==f?f=eh(f):(e=Zf(b)?Xf:H$2.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Yf(a,e):Vf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Ei;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function Hi(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Ei.enqueueReplaceState(b,b.state,null);}
function Ii(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs={};kh(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=eh(f):(f=Zf(b)?Xf:H$2.current,e.context=Yf(a,f));e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Di(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||(b=e.state,
"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Ei.enqueueReplaceState(e,e.state,null),qh(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4194308);}function Ji(a,b){try{var c="",d=b;do c+=Pa(d),d=d.return;while(d);var e=c;}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack;}return {value:a,source:b,stack:e,digest:null}}
function Ki(a,b,c){return {value:a,source:null,stack:null!=c?c:null,digest:null!=b?b:null}}function Li(a,b){try{console.error(b.value);}catch(c){setTimeout(function(){throw c;});}}var Mi="function"===typeof WeakMap?WeakMap:Map;function Ni(a,b,c){c=mh(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Oi||(Oi=!0,Pi=d);Li(a,b);};return c}
function Qi(a,b,c){c=mh(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){return d(e)};c.callback=function(){Li(a,b);};}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){Li(a,b);"function"!==typeof d&&(null===Ri?Ri=new Set([this]):Ri.add(this));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""});});return c}
function Si(a,b,c){var d=a.pingCache;if(null===d){d=a.pingCache=new Mi;var e=new Set;d.set(b,e);}else e=d.get(b),void 0===e&&(e=new Set,d.set(b,e));e.has(c)||(e.add(c),a=Ti.bind(null,a,b,c),b.then(a,a));}function Ui(a){do{var b;if(b=13===a.tag)b=a.memoizedState,b=null!==b?null!==b.dehydrated?!0:!1:!0;if(b)return a;a=a.return;}while(null!==a);return null}
function Vi(a,b,c,d,e){if(0===(a.mode&1))return a===b?a.flags|=65536:(a.flags|=128,c.flags|=131072,c.flags&=-52805,1===c.tag&&(null===c.alternate?c.tag=17:(b=mh(-1,1),b.tag=2,nh(c,b,1))),c.lanes|=1),a;a.flags|=65536;a.lanes=e;return a}var Wi=ua.ReactCurrentOwner,dh=!1;function Xi(a,b,c,d){b.child=null===a?Vg(b,null,c,d):Ug(b,a.child,c,d);}
function Yi(a,b,c,d,e){c=c.render;var f=b.ref;ch(b,e);d=Nh(a,b,c,d,f,e);c=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi(a,b,e);I$1&&c&&vg(b);b.flags|=1;Xi(a,b,d,e);return b.child}
function $i(a,b,c,d,e){if(null===a){var f=c.type;if("function"===typeof f&&!aj(f)&&void 0===f.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=f,bj(a,b,f,d,e);a=Rg(c.type,null,d,b,b.mode,e);a.ref=b.ref;a.return=b;return b.child=a}f=a.child;if(0===(a.lanes&e)){var g=f.memoizedProps;c=c.compare;c=null!==c?c:Ie$1;if(c(g,d)&&a.ref===b.ref)return Zi(a,b,e)}b.flags|=1;a=Pg(f,d);a.ref=b.ref;a.return=b;return b.child=a}
function bj(a,b,c,d,e){if(null!==a){var f=a.memoizedProps;if(Ie$1(f,d)&&a.ref===b.ref)if(dh=!1,b.pendingProps=d=f,0!==(a.lanes&e))0!==(a.flags&131072)&&(dh=!0);else return b.lanes=a.lanes,Zi(a,b,e)}return cj(a,b,c,d,e)}
function dj(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode)if(0===(b.mode&1))b.memoizedState={baseLanes:0,cachePool:null,transitions:null},G$1(ej,fj),fj|=c;else {if(0===(c&1073741824))return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a,cachePool:null,transitions:null},b.updateQueue=null,G$1(ej,fj),fj|=a,null;b.memoizedState={baseLanes:0,cachePool:null,transitions:null};d=null!==f?f.baseLanes:c;G$1(ej,fj);fj|=d;}else null!==
f?(d=f.baseLanes|c,b.memoizedState=null):d=c,G$1(ej,fj),fj|=d;Xi(a,b,e,c);return b.child}function gj(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=512,b.flags|=2097152;}function cj(a,b,c,d,e){var f=Zf(c)?Xf:H$2.current;f=Yf(b,f);ch(b,e);c=Nh(a,b,c,d,f,e);d=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi(a,b,e);I$1&&d&&vg(b);b.flags|=1;Xi(a,b,c,e);return b.child}
function hj(a,b,c,d,e){if(Zf(c)){var f=!0;cg(b);}else f=!1;ch(b,e);if(null===b.stateNode)ij(a,b),Gi(b,c,d),Ii(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=eh(l):(l=Zf(c)?Xf:H$2.current,l=Yf(b,l));var m=c.getDerivedStateFromProps,q="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;q||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||
(h!==d||k!==l)&&Hi(b,g,d,l);jh=!1;var r=b.memoizedState;g.state=r;qh(b,d,g,e);k=b.memoizedState;h!==d||r!==k||Wf.current||jh?("function"===typeof m&&(Di(b,c,m,d),k=b.memoizedState),(h=jh||Fi(b,c,h,d,r,k,l))?(q||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.flags|=4194308)):
("function"===typeof g.componentDidMount&&(b.flags|=4194308),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4194308),d=!1);}else {g=b.stateNode;lh(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:Ci(b.type,h);g.props=l;q=b.pendingProps;r=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=eh(k):(k=Zf(c)?Xf:H$2.current,k=Yf(b,k));var y=c.getDerivedStateFromProps;(m="function"===typeof y||"function"===typeof g.getSnapshotBeforeUpdate)||
"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==q||r!==k)&&Hi(b,g,d,k);jh=!1;r=b.memoizedState;g.state=r;qh(b,d,g,e);var n=b.memoizedState;h!==q||r!==n||Wf.current||jh?("function"===typeof y&&(Di(b,c,y,d),n=b.memoizedState),(l=jh||Fi(b,c,l,d,r,n,k)||!1)?(m||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,n,k),"function"===typeof g.UNSAFE_componentWillUpdate&&
g.UNSAFE_componentWillUpdate(d,n,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=1024)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),b.memoizedProps=d,b.memoizedState=n),g.props=d,g.state=n,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===
a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),d=!1);}return jj(a,b,c,d,f,e)}
function jj(a,b,c,d,e,f){gj(a,b);var g=0!==(b.flags&128);if(!d&&!g)return e&&dg(b,c,!1),Zi(a,b,f);d=b.stateNode;Wi.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Ug(b,a.child,null,f),b.child=Ug(b,null,h,f)):Xi(a,b,h,f);b.memoizedState=d.state;e&&dg(b,c,!0);return b.child}function kj(a){var b=a.stateNode;b.pendingContext?ag(a,b.pendingContext,b.pendingContext!==b.context):b.context&&ag(a,b.context,!1);yh(a,b.containerInfo);}
function lj(a,b,c,d,e){Ig();Jg(e);b.flags|=256;Xi(a,b,c,d);return b.child}var mj={dehydrated:null,treeContext:null,retryLane:0};function nj(a){return {baseLanes:a,cachePool:null,transitions:null}}
function oj(a,b,c){var d=b.pendingProps,e=L$3.current,f=!1,g=0!==(b.flags&128),h;(h=g)||(h=null!==a&&null===a.memoizedState?!1:0!==(e&2));if(h)f=!0,b.flags&=-129;else if(null===a||null!==a.memoizedState)e|=1;G$1(L$3,e&1);if(null===a){Eg(b);a=b.memoizedState;if(null!==a&&(a=a.dehydrated,null!==a))return 0===(b.mode&1)?b.lanes=1:"$!"===a.data?b.lanes=8:b.lanes=1073741824,null;g=d.children;a=d.fallback;return f?(d=b.mode,f=b.child,g={mode:"hidden",children:g},0===(d&1)&&null!==f?(f.childLanes=0,f.pendingProps=
g):f=pj(g,d,0,null),a=Tg(a,d,c,null),f.return=b,a.return=b,f.sibling=a,b.child=f,b.child.memoizedState=nj(c),b.memoizedState=mj,a):qj(b,g)}e=a.memoizedState;if(null!==e&&(h=e.dehydrated,null!==h))return rj(a,b,g,d,h,e,c);if(f){f=d.fallback;g=b.mode;e=a.child;h=e.sibling;var k={mode:"hidden",children:d.children};0===(g&1)&&b.child!==e?(d=b.child,d.childLanes=0,d.pendingProps=k,b.deletions=null):(d=Pg(e,k),d.subtreeFlags=e.subtreeFlags&14680064);null!==h?f=Pg(h,f):(f=Tg(f,g,c,null),f.flags|=2);f.return=
b;d.return=b;d.sibling=f;b.child=d;d=f;f=b.child;g=a.child.memoizedState;g=null===g?nj(c):{baseLanes:g.baseLanes|c,cachePool:null,transitions:g.transitions};f.memoizedState=g;f.childLanes=a.childLanes&~c;b.memoizedState=mj;return d}f=a.child;a=f.sibling;d=Pg(f,{mode:"visible",children:d.children});0===(b.mode&1)&&(d.lanes=c);d.return=b;d.sibling=null;null!==a&&(c=b.deletions,null===c?(b.deletions=[a],b.flags|=16):c.push(a));b.child=d;b.memoizedState=null;return d}
function qj(a,b){b=pj({mode:"visible",children:b},a.mode,0,null);b.return=a;return a.child=b}function sj(a,b,c,d){null!==d&&Jg(d);Ug(b,a.child,null,c);a=qj(b,b.pendingProps.children);a.flags|=2;b.memoizedState=null;return a}
function rj(a,b,c,d,e,f,g){if(c){if(b.flags&256)return b.flags&=-257,d=Ki(Error(p$4(422))),sj(a,b,g,d);if(null!==b.memoizedState)return b.child=a.child,b.flags|=128,null;f=d.fallback;e=b.mode;d=pj({mode:"visible",children:d.children},e,0,null);f=Tg(f,e,g,null);f.flags|=2;d.return=b;f.return=b;d.sibling=f;b.child=d;0!==(b.mode&1)&&Ug(b,a.child,null,g);b.child.memoizedState=nj(g);b.memoizedState=mj;return f}if(0===(b.mode&1))return sj(a,b,g,null);if("$!"===e.data){d=e.nextSibling&&e.nextSibling.dataset;
if(d)var h=d.dgst;d=h;f=Error(p$4(419));d=Ki(f,d,void 0);return sj(a,b,g,d)}h=0!==(g&a.childLanes);if(dh||h){d=Q$2;if(null!==d){switch(g&-g){case 4:e=2;break;case 16:e=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:e=32;break;case 536870912:e=268435456;break;default:e=0;}e=0!==(e&(d.suspendedLanes|g))?0:e;
0!==e&&e!==f.retryLane&&(f.retryLane=e,ih(a,e),gi(d,a,e,-1));}tj();d=Ki(Error(p$4(421)));return sj(a,b,g,d)}if("$?"===e.data)return b.flags|=128,b.child=a.child,b=uj.bind(null,a),e._reactRetry=b,null;a=f.treeContext;yg=Lf(e.nextSibling);xg=b;I$1=!0;zg=null;null!==a&&(og[pg++]=rg,og[pg++]=sg,og[pg++]=qg,rg=a.id,sg=a.overflow,qg=b);b=qj(b,d.children);b.flags|=4096;return b}function vj(a,b,c){a.lanes|=b;var d=a.alternate;null!==d&&(d.lanes|=b);bh(a.return,b,c);}
function wj(a,b,c,d,e){var f=a.memoizedState;null===f?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e}:(f.isBackwards=b,f.rendering=null,f.renderingStartTime=0,f.last=d,f.tail=c,f.tailMode=e);}
function xj(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;Xi(a,b,d.children,c);d=L$3.current;if(0!==(d&2))d=d&1|2,b.flags|=128;else {if(null!==a&&0!==(a.flags&128))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&vj(a,c,b);else if(19===a.tag)vj(a,c,b);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return;}a.sibling.return=a.return;a=a.sibling;}d&=1;}G$1(L$3,d);if(0===(b.mode&1))b.memoizedState=
null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===Ch(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);wj(b,!1,e,c,f);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===Ch(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a;}wj(b,!0,c,null,f);break;case "together":wj(b,!1,null,null,void 0);break;default:b.memoizedState=null;}return b.child}
function ij(a,b){0===(b.mode&1)&&null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);}function Zi(a,b,c){null!==a&&(b.dependencies=a.dependencies);rh|=b.lanes;if(0===(c&b.childLanes))return null;if(null!==a&&b.child!==a.child)throw Error(p$4(153));if(null!==b.child){a=b.child;c=Pg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Pg(a,a.pendingProps),c.return=b;c.sibling=null;}return b.child}
function yj(a,b,c){switch(b.tag){case 3:kj(b);Ig();break;case 5:Ah(b);break;case 1:Zf(b.type)&&cg(b);break;case 4:yh(b,b.stateNode.containerInfo);break;case 10:var d=b.type._context,e=b.memoizedProps.value;G$1(Wg,d._currentValue);d._currentValue=e;break;case 13:d=b.memoizedState;if(null!==d){if(null!==d.dehydrated)return G$1(L$3,L$3.current&1),b.flags|=128,null;if(0!==(c&b.child.childLanes))return oj(a,b,c);G$1(L$3,L$3.current&1);a=Zi(a,b,c);return null!==a?a.sibling:null}G$1(L$3,L$3.current&1);break;case 19:d=0!==(c&
b.childLanes);if(0!==(a.flags&128)){if(d)return xj(a,b,c);b.flags|=128;}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);G$1(L$3,L$3.current);if(d)break;else return null;case 22:case 23:return b.lanes=0,dj(a,b,c)}return Zi(a,b,c)}var zj,Aj,Bj,Cj;
zj=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;}c.sibling.return=c.return;c=c.sibling;}};Aj=function(){};
Bj=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;xh(uh.current);var f=null;switch(c){case "input":e=Ya(a,e);d=Ya(a,d);f=[];break;case "select":e=A$1({},e,{value:void 0});d=A$1({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=Bf);}ub(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&
(c||(c={}),c[g]="");}else "dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ea.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||(c={}),c[g]=k[g]);}else c||(f||(f=[]),f.push(l,
c)),c=k;else "dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ea.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&D$1("scroll",a),f||h===k||(f=[])):(f=f||[]).push(l,k));}c&&(f=f||[]).push("style",c);var l=f;if(b.updateQueue=l)b.flags|=4;}};Cj=function(a,b,c,d){c!==d&&(b.flags|=4);};
function Dj(a,b){if(!I$1)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null;}}
function S$2(a){var b=null!==a.alternate&&a.alternate.child===a.child,c=0,d=0;if(b)for(var e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags&14680064,d|=e.flags&14680064,e.return=a,e=e.sibling;else for(e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags,d|=e.flags,e.return=a,e=e.sibling;a.subtreeFlags|=d;a.childLanes=c;return b}
function Ej(a,b,c){var d=b.pendingProps;wg(b);switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return S$2(b),null;case 1:return Zf(b.type)&&$f(),S$2(b),null;case 3:d=b.stateNode;zh();E(Wf);E(H$2);Eh();d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)Gg(b)?b.flags|=4:null===a||a.memoizedState.isDehydrated&&0===(b.flags&256)||(b.flags|=1024,null!==zg&&(Fj(zg),zg=null));Aj(a,b);S$2(b);return null;case 5:Bh(b);var e=xh(wh.current);
c=b.type;if(null!==a&&null!=b.stateNode)Bj(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=512,b.flags|=2097152);else {if(!d){if(null===b.stateNode)throw Error(p$4(166));S$2(b);return null}a=xh(uh.current);if(Gg(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[Of]=b;d[Pf]=f;a=0!==(b.mode&1);switch(c){case "dialog":D$1("cancel",d);D$1("close",d);break;case "iframe":case "object":case "embed":D$1("load",d);break;case "video":case "audio":for(e=0;e<lf$1.length;e++)D$1(lf$1[e],d);break;case "source":D$1("error",d);break;case "img":case "image":case "link":D$1("error",
d);D$1("load",d);break;case "details":D$1("toggle",d);break;case "input":Za(d,f);D$1("invalid",d);break;case "select":d._wrapperState={wasMultiple:!!f.multiple};D$1("invalid",d);break;case "textarea":hb(d,f),D$1("invalid",d);}ub(c,f);e=null;for(var g in f)if(f.hasOwnProperty(g)){var h=f[g];"children"===g?"string"===typeof h?d.textContent!==h&&(!0!==f.suppressHydrationWarning&&Af(d.textContent,h,a),e=["children",h]):"number"===typeof h&&d.textContent!==""+h&&(!0!==f.suppressHydrationWarning&&Af(d.textContent,
h,a),e=["children",""+h]):ea.hasOwnProperty(g)&&null!=h&&"onScroll"===g&&D$1("scroll",d);}switch(c){case "input":Va(d);db(d,f,!0);break;case "textarea":Va(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=Bf);}d=e;b.updateQueue=d;null!==d&&(b.flags|=4);}else {g=9===e.nodeType?e:e.ownerDocument;"http://www.w3.org/1999/xhtml"===a&&(a=kb(c));"http://www.w3.org/1999/xhtml"===a?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):
"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=!0:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[Of]=b;a[Pf]=d;zj(a,b,!1,!1);b.stateNode=a;a:{g=vb(c,d);switch(c){case "dialog":D$1("cancel",a);D$1("close",a);e=d;break;case "iframe":case "object":case "embed":D$1("load",a);e=d;break;case "video":case "audio":for(e=0;e<lf$1.length;e++)D$1(lf$1[e],a);e=d;break;case "source":D$1("error",a);e=d;break;case "img":case "image":case "link":D$1("error",
a);D$1("load",a);e=d;break;case "details":D$1("toggle",a);e=d;break;case "input":Za(a,d);e=Ya(a,d);D$1("invalid",a);break;case "option":e=d;break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=A$1({},d,{value:void 0});D$1("invalid",a);break;case "textarea":hb(a,d);e=gb(a,d);D$1("invalid",a);break;default:e=d;}ub(c,e);h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?sb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&nb(a,k)):"children"===f?"string"===typeof k?("textarea"!==
c||""!==k)&&ob(a,k):"number"===typeof k&&ob(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ea.hasOwnProperty(f)?null!=k&&"onScroll"===f&&D$1("scroll",a):null!=k&&ta(a,f,k,g));}switch(c){case "input":Va(a);db(a,d,!1);break;case "textarea":Va(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,!1):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,
!0);break;default:"function"===typeof e.onClick&&(a.onclick=Bf);}switch(c){case "button":case "input":case "select":case "textarea":d=!!d.autoFocus;break a;case "img":d=!0;break a;default:d=!1;}}d&&(b.flags|=4);}null!==b.ref&&(b.flags|=512,b.flags|=2097152);}S$2(b);return null;case 6:if(a&&null!=b.stateNode)Cj(a,b,a.memoizedProps,d);else {if("string"!==typeof d&&null===b.stateNode)throw Error(p$4(166));c=xh(wh.current);xh(uh.current);if(Gg(b)){d=b.stateNode;c=b.memoizedProps;d[Of]=b;if(f=d.nodeValue!==c)if(a=
xg,null!==a)switch(a.tag){case 3:Af(d.nodeValue,c,0!==(a.mode&1));break;case 5:!0!==a.memoizedProps.suppressHydrationWarning&&Af(d.nodeValue,c,0!==(a.mode&1));}f&&(b.flags|=4);}else d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[Of]=b,b.stateNode=d;}S$2(b);return null;case 13:E(L$3);d=b.memoizedState;if(null===a||null!==a.memoizedState&&null!==a.memoizedState.dehydrated){if(I$1&&null!==yg&&0!==(b.mode&1)&&0===(b.flags&128))Hg(),Ig(),b.flags|=98560,f=!1;else if(f=Gg(b),null!==d&&null!==d.dehydrated){if(null===
a){if(!f)throw Error(p$4(318));f=b.memoizedState;f=null!==f?f.dehydrated:null;if(!f)throw Error(p$4(317));f[Of]=b;}else Ig(),0===(b.flags&128)&&(b.memoizedState=null),b.flags|=4;S$2(b);f=!1;}else null!==zg&&(Fj(zg),zg=null),f=!0;if(!f)return b.flags&65536?b:null}if(0!==(b.flags&128))return b.lanes=c,b;d=null!==d;d!==(null!==a&&null!==a.memoizedState)&&d&&(b.child.flags|=8192,0!==(b.mode&1)&&(null===a||0!==(L$3.current&1)?0===T$2&&(T$2=3):tj()));null!==b.updateQueue&&(b.flags|=4);S$2(b);return null;case 4:return zh(),
Aj(a,b),null===a&&sf(b.stateNode.containerInfo),S$2(b),null;case 10:return ah(b.type._context),S$2(b),null;case 17:return Zf(b.type)&&$f(),S$2(b),null;case 19:E(L$3);f=b.memoizedState;if(null===f)return S$2(b),null;d=0!==(b.flags&128);g=f.rendering;if(null===g)if(d)Dj(f,!1);else {if(0!==T$2||null!==a&&0!==(a.flags&128))for(a=b.child;null!==a;){g=Ch(a);if(null!==g){b.flags|=128;Dj(f,!1);d=g.updateQueue;null!==d&&(b.updateQueue=d,b.flags|=4);b.subtreeFlags=0;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=14680066,
g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.subtreeFlags=0,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.subtreeFlags=0,f.deletions=null,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;G$1(L$3,L$3.current&1|2);return b.child}a=
a.sibling;}null!==f.tail&&B$1()>Gj&&(b.flags|=128,d=!0,Dj(f,!1),b.lanes=4194304);}else {if(!d)if(a=Ch(g),null!==a){if(b.flags|=128,d=!0,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Dj(f,!0),null===f.tail&&"hidden"===f.tailMode&&!g.alternate&&!I$1)return S$2(b),null}else 2*B$1()-f.renderingStartTime>Gj&&1073741824!==c&&(b.flags|=128,d=!0,Dj(f,!1),b.lanes=4194304);f.isBackwards?(g.sibling=b.child,b.child=g):(c=f.last,null!==c?c.sibling=g:b.child=g,f.last=g);}if(null!==f.tail)return b=f.tail,f.rendering=
b,f.tail=b.sibling,f.renderingStartTime=B$1(),b.sibling=null,c=L$3.current,G$1(L$3,d?c&1|2:c&1),b;S$2(b);return null;case 22:case 23:return Hj(),d=null!==b.memoizedState,null!==a&&null!==a.memoizedState!==d&&(b.flags|=8192),d&&0!==(b.mode&1)?0!==(fj&1073741824)&&(S$2(b),b.subtreeFlags&6&&(b.flags|=8192)):S$2(b),null;case 24:return null;case 25:return null}throw Error(p$4(156,b.tag));}
function Ij(a,b){wg(b);switch(b.tag){case 1:return Zf(b.type)&&$f(),a=b.flags,a&65536?(b.flags=a&-65537|128,b):null;case 3:return zh(),E(Wf),E(H$2),Eh(),a=b.flags,0!==(a&65536)&&0===(a&128)?(b.flags=a&-65537|128,b):null;case 5:return Bh(b),null;case 13:E(L$3);a=b.memoizedState;if(null!==a&&null!==a.dehydrated){if(null===b.alternate)throw Error(p$4(340));Ig();}a=b.flags;return a&65536?(b.flags=a&-65537|128,b):null;case 19:return E(L$3),null;case 4:return zh(),null;case 10:return ah(b.type._context),null;case 22:case 23:return Hj(),
null;case 24:return null;default:return null}}var Jj=!1,U$1=!1,Kj="function"===typeof WeakSet?WeakSet:Set,V$1=null;function Lj(a,b){var c=a.ref;if(null!==c)if("function"===typeof c)try{c(null);}catch(d){W$1(a,b,d);}else c.current=null;}function Mj(a,b,c){try{c();}catch(d){W$1(a,b,d);}}var Nj=!1;
function Oj(a,b){Cf=dd;a=Me$1();if(Ne$1(a)){if("selectionStart"in a)var c={start:a.selectionStart,end:a.selectionEnd};else a:{c=(c=a.ownerDocument)&&c.defaultView||window;var d=c.getSelection&&c.getSelection();if(d&&0!==d.rangeCount){c=d.anchorNode;var e=d.anchorOffset,f=d.focusNode;d=d.focusOffset;try{c.nodeType,f.nodeType;}catch(F){c=null;break a}var g=0,h=-1,k=-1,l=0,m=0,q=a,r=null;b:for(;;){for(var y;;){q!==c||0!==e&&3!==q.nodeType||(h=g+e);q!==f||0!==d&&3!==q.nodeType||(k=g+d);3===q.nodeType&&(g+=
q.nodeValue.length);if(null===(y=q.firstChild))break;r=q;q=y;}for(;;){if(q===a)break b;r===c&&++l===e&&(h=g);r===f&&++m===d&&(k=g);if(null!==(y=q.nextSibling))break;q=r;r=q.parentNode;}q=y;}c=-1===h||-1===k?null:{start:h,end:k};}else c=null;}c=c||{start:0,end:0};}else c=null;Df={focusedElem:a,selectionRange:c};dd=!1;for(V$1=b;null!==V$1;)if(b=V$1,a=b.child,0!==(b.subtreeFlags&1028)&&null!==a)a.return=b,V$1=a;else for(;null!==V$1;){b=V$1;try{var n=b.alternate;if(0!==(b.flags&1024))switch(b.tag){case 0:case 11:case 15:break;
case 1:if(null!==n){var t=n.memoizedProps,J=n.memoizedState,x=b.stateNode,w=x.getSnapshotBeforeUpdate(b.elementType===b.type?t:Ci(b.type,t),J);x.__reactInternalSnapshotBeforeUpdate=w;}break;case 3:var u=b.stateNode.containerInfo;1===u.nodeType?u.textContent="":9===u.nodeType&&u.documentElement&&u.removeChild(u.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(p$4(163));}}catch(F){W$1(b,b.return,F);}a=b.sibling;if(null!==a){a.return=b.return;V$1=a;break}V$1=b.return;}n=Nj;Nj=!1;return n}
function Pj(a,b,c){var d=b.updateQueue;d=null!==d?d.lastEffect:null;if(null!==d){var e=d=d.next;do{if((e.tag&a)===a){var f=e.destroy;e.destroy=void 0;void 0!==f&&Mj(b,c,f);}e=e.next;}while(e!==d)}}function Qj(a,b){b=b.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){var c=b=b.next;do{if((c.tag&a)===a){var d=c.create;c.destroy=d();}c=c.next;}while(c!==b)}}function Rj(a){var b=a.ref;if(null!==b){var c=a.stateNode;switch(a.tag){case 5:a=c;break;default:a=c;}"function"===typeof b?b(a):b.current=a;}}
function Sj(a){var b=a.alternate;null!==b&&(a.alternate=null,Sj(b));a.child=null;a.deletions=null;a.sibling=null;5===a.tag&&(b=a.stateNode,null!==b&&(delete b[Of],delete b[Pf],delete b[of],delete b[Qf],delete b[Rf]));a.stateNode=null;a.return=null;a.dependencies=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.stateNode=null;a.updateQueue=null;}function Tj(a){return 5===a.tag||3===a.tag||4===a.tag}
function Uj(a){a:for(;;){for(;null===a.sibling;){if(null===a.return||Tj(a.return))return null;a=a.return;}a.sibling.return=a.return;for(a=a.sibling;5!==a.tag&&6!==a.tag&&18!==a.tag;){if(a.flags&2)continue a;if(null===a.child||4===a.tag)continue a;else a.child.return=a,a=a.child;}if(!(a.flags&2))return a.stateNode}}
function Vj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=Bf));else if(4!==d&&(a=a.child,null!==a))for(Vj(a,b,c),a=a.sibling;null!==a;)Vj(a,b,c),a=a.sibling;}
function Wj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(Wj(a,b,c),a=a.sibling;null!==a;)Wj(a,b,c),a=a.sibling;}var X$1=null,Xj=!1;function Yj(a,b,c){for(c=c.child;null!==c;)Zj(a,b,c),c=c.sibling;}
function Zj(a,b,c){if(lc&&"function"===typeof lc.onCommitFiberUnmount)try{lc.onCommitFiberUnmount(kc,c);}catch(h){}switch(c.tag){case 5:U$1||Lj(c,b);case 6:var d=X$1,e=Xj;X$1=null;Yj(a,b,c);X$1=d;Xj=e;null!==X$1&&(Xj?(a=X$1,c=c.stateNode,8===a.nodeType?a.parentNode.removeChild(c):a.removeChild(c)):X$1.removeChild(c.stateNode));break;case 18:null!==X$1&&(Xj?(a=X$1,c=c.stateNode,8===a.nodeType?Kf(a.parentNode,c):1===a.nodeType&&Kf(a,c),bd(a)):Kf(X$1,c.stateNode));break;case 4:d=X$1;e=Xj;X$1=c.stateNode.containerInfo;Xj=!0;
Yj(a,b,c);X$1=d;Xj=e;break;case 0:case 11:case 14:case 15:if(!U$1&&(d=c.updateQueue,null!==d&&(d=d.lastEffect,null!==d))){e=d=d.next;do{var f=e,g=f.destroy;f=f.tag;void 0!==g&&(0!==(f&2)?Mj(c,b,g):0!==(f&4)&&Mj(c,b,g));e=e.next;}while(e!==d)}Yj(a,b,c);break;case 1:if(!U$1&&(Lj(c,b),d=c.stateNode,"function"===typeof d.componentWillUnmount))try{d.props=c.memoizedProps,d.state=c.memoizedState,d.componentWillUnmount();}catch(h){W$1(c,b,h);}Yj(a,b,c);break;case 21:Yj(a,b,c);break;case 22:c.mode&1?(U$1=(d=U$1)||null!==
c.memoizedState,Yj(a,b,c),U$1=d):Yj(a,b,c);break;default:Yj(a,b,c);}}function ak(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Kj);b.forEach(function(b){var d=bk.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d));});}}
function ck(a,b){var c=b.deletions;if(null!==c)for(var d=0;d<c.length;d++){var e=c[d];try{var f=a,g=b,h=g;a:for(;null!==h;){switch(h.tag){case 5:X$1=h.stateNode;Xj=!1;break a;case 3:X$1=h.stateNode.containerInfo;Xj=!0;break a;case 4:X$1=h.stateNode.containerInfo;Xj=!0;break a}h=h.return;}if(null===X$1)throw Error(p$4(160));Zj(f,g,e);X$1=null;Xj=!1;var k=e.alternate;null!==k&&(k.return=null);e.return=null;}catch(l){W$1(e,b,l);}}if(b.subtreeFlags&12854)for(b=b.child;null!==b;)dk(b,a),b=b.sibling;}
function dk(a,b){var c=a.alternate,d=a.flags;switch(a.tag){case 0:case 11:case 14:case 15:ck(b,a);ek(a);if(d&4){try{Pj(3,a,a.return),Qj(3,a);}catch(t){W$1(a,a.return,t);}try{Pj(5,a,a.return);}catch(t){W$1(a,a.return,t);}}break;case 1:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);break;case 5:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);if(a.flags&32){var e=a.stateNode;try{ob(e,"");}catch(t){W$1(a,a.return,t);}}if(d&4&&(e=a.stateNode,null!=e)){var f=a.memoizedProps,g=null!==c?c.memoizedProps:f,h=a.type,k=a.updateQueue;
a.updateQueue=null;if(null!==k)try{"input"===h&&"radio"===f.type&&null!=f.name&&ab(e,f);vb(h,g);var l=vb(h,f);for(g=0;g<k.length;g+=2){var m=k[g],q=k[g+1];"style"===m?sb(e,q):"dangerouslySetInnerHTML"===m?nb(e,q):"children"===m?ob(e,q):ta(e,m,q,l);}switch(h){case "input":bb(e,f);break;case "textarea":ib(e,f);break;case "select":var r=e._wrapperState.wasMultiple;e._wrapperState.wasMultiple=!!f.multiple;var y=f.value;null!=y?fb(e,!!f.multiple,y,!1):r!==!!f.multiple&&(null!=f.defaultValue?fb(e,!!f.multiple,
f.defaultValue,!0):fb(e,!!f.multiple,f.multiple?[]:"",!1));}e[Pf]=f;}catch(t){W$1(a,a.return,t);}}break;case 6:ck(b,a);ek(a);if(d&4){if(null===a.stateNode)throw Error(p$4(162));e=a.stateNode;f=a.memoizedProps;try{e.nodeValue=f;}catch(t){W$1(a,a.return,t);}}break;case 3:ck(b,a);ek(a);if(d&4&&null!==c&&c.memoizedState.isDehydrated)try{bd(b.containerInfo);}catch(t){W$1(a,a.return,t);}break;case 4:ck(b,a);ek(a);break;case 13:ck(b,a);ek(a);e=a.child;e.flags&8192&&(f=null!==e.memoizedState,e.stateNode.isHidden=f,!f||
null!==e.alternate&&null!==e.alternate.memoizedState||(fk=B$1()));d&4&&ak(a);break;case 22:m=null!==c&&null!==c.memoizedState;a.mode&1?(U$1=(l=U$1)||m,ck(b,a),U$1=l):ck(b,a);ek(a);if(d&8192){l=null!==a.memoizedState;if((a.stateNode.isHidden=l)&&!m&&0!==(a.mode&1))for(V$1=a,m=a.child;null!==m;){for(q=V$1=m;null!==V$1;){r=V$1;y=r.child;switch(r.tag){case 0:case 11:case 14:case 15:Pj(4,r,r.return);break;case 1:Lj(r,r.return);var n=r.stateNode;if("function"===typeof n.componentWillUnmount){d=r;c=r.return;try{b=d,n.props=
b.memoizedProps,n.state=b.memoizedState,n.componentWillUnmount();}catch(t){W$1(d,c,t);}}break;case 5:Lj(r,r.return);break;case 22:if(null!==r.memoizedState){gk(q);continue}}null!==y?(y.return=r,V$1=y):gk(q);}m=m.sibling;}a:for(m=null,q=a;;){if(5===q.tag){if(null===m){m=q;try{e=q.stateNode,l?(f=e.style,"function"===typeof f.setProperty?f.setProperty("display","none","important"):f.display="none"):(h=q.stateNode,k=q.memoizedProps.style,g=void 0!==k&&null!==k&&k.hasOwnProperty("display")?k.display:null,h.style.display=
rb("display",g));}catch(t){W$1(a,a.return,t);}}}else if(6===q.tag){if(null===m)try{q.stateNode.nodeValue=l?"":q.memoizedProps;}catch(t){W$1(a,a.return,t);}}else if((22!==q.tag&&23!==q.tag||null===q.memoizedState||q===a)&&null!==q.child){q.child.return=q;q=q.child;continue}if(q===a)break a;for(;null===q.sibling;){if(null===q.return||q.return===a)break a;m===q&&(m=null);q=q.return;}m===q&&(m=null);q.sibling.return=q.return;q=q.sibling;}}break;case 19:ck(b,a);ek(a);d&4&&ak(a);break;case 21:break;default:ck(b,
a),ek(a);}}function ek(a){var b=a.flags;if(b&2){try{a:{for(var c=a.return;null!==c;){if(Tj(c)){var d=c;break a}c=c.return;}throw Error(p$4(160));}switch(d.tag){case 5:var e=d.stateNode;d.flags&32&&(ob(e,""),d.flags&=-33);var f=Uj(a);Wj(a,f,e);break;case 3:case 4:var g=d.stateNode.containerInfo,h=Uj(a);Vj(a,h,g);break;default:throw Error(p$4(161));}}catch(k){W$1(a,a.return,k);}a.flags&=-3;}b&4096&&(a.flags&=-4097);}function hk(a,b,c){V$1=a;ik(a);}
function ik(a,b,c){for(var d=0!==(a.mode&1);null!==V$1;){var e=V$1,f=e.child;if(22===e.tag&&d){var g=null!==e.memoizedState||Jj;if(!g){var h=e.alternate,k=null!==h&&null!==h.memoizedState||U$1;h=Jj;var l=U$1;Jj=g;if((U$1=k)&&!l)for(V$1=e;null!==V$1;)g=V$1,k=g.child,22===g.tag&&null!==g.memoizedState?jk(e):null!==k?(k.return=g,V$1=k):jk(e);for(;null!==f;)V$1=f,ik(f),f=f.sibling;V$1=e;Jj=h;U$1=l;}kk(a);}else 0!==(e.subtreeFlags&8772)&&null!==f?(f.return=e,V$1=f):kk(a);}}
function kk(a){for(;null!==V$1;){var b=V$1;if(0!==(b.flags&8772)){var c=b.alternate;try{if(0!==(b.flags&8772))switch(b.tag){case 0:case 11:case 15:U$1||Qj(5,b);break;case 1:var d=b.stateNode;if(b.flags&4&&!U$1)if(null===c)d.componentDidMount();else {var e=b.elementType===b.type?c.memoizedProps:Ci(b.type,c.memoizedProps);d.componentDidUpdate(e,c.memoizedState,d.__reactInternalSnapshotBeforeUpdate);}var f=b.updateQueue;null!==f&&sh(b,f,d);break;case 3:var g=b.updateQueue;if(null!==g){c=null;if(null!==b.child)switch(b.child.tag){case 5:c=
b.child.stateNode;break;case 1:c=b.child.stateNode;}sh(b,g,c);}break;case 5:var h=b.stateNode;if(null===c&&b.flags&4){c=h;var k=b.memoizedProps;switch(b.type){case "button":case "input":case "select":case "textarea":k.autoFocus&&c.focus();break;case "img":k.src&&(c.src=k.src);}}break;case 6:break;case 4:break;case 12:break;case 13:if(null===b.memoizedState){var l=b.alternate;if(null!==l){var m=l.memoizedState;if(null!==m){var q=m.dehydrated;null!==q&&bd(q);}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;
default:throw Error(p$4(163));}U$1||b.flags&512&&Rj(b);}catch(r){W$1(b,b.return,r);}}if(b===a){V$1=null;break}c=b.sibling;if(null!==c){c.return=b.return;V$1=c;break}V$1=b.return;}}function gk(a){for(;null!==V$1;){var b=V$1;if(b===a){V$1=null;break}var c=b.sibling;if(null!==c){c.return=b.return;V$1=c;break}V$1=b.return;}}
function jk(a){for(;null!==V$1;){var b=V$1;try{switch(b.tag){case 0:case 11:case 15:var c=b.return;try{Qj(4,b);}catch(k){W$1(b,c,k);}break;case 1:var d=b.stateNode;if("function"===typeof d.componentDidMount){var e=b.return;try{d.componentDidMount();}catch(k){W$1(b,e,k);}}var f=b.return;try{Rj(b);}catch(k){W$1(b,f,k);}break;case 5:var g=b.return;try{Rj(b);}catch(k){W$1(b,g,k);}}}catch(k){W$1(b,b.return,k);}if(b===a){V$1=null;break}var h=b.sibling;if(null!==h){h.return=b.return;V$1=h;break}V$1=b.return;}}
var lk=Math.ceil,mk=ua.ReactCurrentDispatcher,nk=ua.ReactCurrentOwner,ok=ua.ReactCurrentBatchConfig,K$1=0,Q$2=null,Y$1=null,Z$1=0,fj=0,ej=Uf(0),T$2=0,pk=null,rh=0,qk=0,rk=0,sk=null,tk=null,fk=0,Gj=Infinity,uk=null,Oi=!1,Pi=null,Ri=null,vk=!1,wk=null,xk=0,yk=0,zk=null,Ak=-1,Bk=0;function R$1(){return 0!==(K$1&6)?B$1():-1!==Ak?Ak:Ak=B$1()}
function yi(a){if(0===(a.mode&1))return 1;if(0!==(K$1&2)&&0!==Z$1)return Z$1&-Z$1;if(null!==Kg.transition)return 0===Bk&&(Bk=yc()),Bk;a=C$2;if(0!==a)return a;a=window.event;a=void 0===a?16:jd(a.type);return a}function gi(a,b,c,d){if(50<yk)throw yk=0,zk=null,Error(p$4(185));Ac(a,c,d);if(0===(K$1&2)||a!==Q$2)a===Q$2&&(0===(K$1&2)&&(qk|=c),4===T$2&&Ck(a,Z$1)),Dk(a,d),1===c&&0===K$1&&0===(b.mode&1)&&(Gj=B$1()+500,fg&&jg());}
function Dk(a,b){var c=a.callbackNode;wc(a,b);var d=uc(a,a===Q$2?Z$1:0);if(0===d)null!==c&&bc(c),a.callbackNode=null,a.callbackPriority=0;else if(b=d&-d,a.callbackPriority!==b){null!=c&&bc(c);if(1===b)0===a.tag?ig(Ek.bind(null,a)):hg(Ek.bind(null,a)),Jf(function(){0===(K$1&6)&&jg();}),c=null;else {switch(Dc(d)){case 1:c=fc;break;case 4:c=gc;break;case 16:c=hc;break;case 536870912:c=jc;break;default:c=hc;}c=Fk(c,Gk.bind(null,a));}a.callbackPriority=b;a.callbackNode=c;}}
function Gk(a,b){Ak=-1;Bk=0;if(0!==(K$1&6))throw Error(p$4(327));var c=a.callbackNode;if(Hk()&&a.callbackNode!==c)return null;var d=uc(a,a===Q$2?Z$1:0);if(0===d)return null;if(0!==(d&30)||0!==(d&a.expiredLanes)||b)b=Ik(a,d);else {b=d;var e=K$1;K$1|=2;var f=Jk();if(Q$2!==a||Z$1!==b)uk=null,Gj=B$1()+500,Kk(a,b);do try{Lk();break}catch(h){Mk(a,h);}while(1);$g();mk.current=f;K$1=e;null!==Y$1?b=0:(Q$2=null,Z$1=0,b=T$2);}if(0!==b){2===b&&(e=xc(a),0!==e&&(d=e,b=Nk(a,e)));if(1===b)throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B$1()),c;if(6===b)Ck(a,d);
else {e=a.current.alternate;if(0===(d&30)&&!Ok(e)&&(b=Ik(a,d),2===b&&(f=xc(a),0!==f&&(d=f,b=Nk(a,f))),1===b))throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B$1()),c;a.finishedWork=e;a.finishedLanes=d;switch(b){case 0:case 1:throw Error(p$4(345));case 2:Pk(a,tk,uk);break;case 3:Ck(a,d);if((d&130023424)===d&&(b=fk+500-B$1(),10<b)){if(0!==uc(a,0))break;e=a.suspendedLanes;if((e&d)!==d){R$1();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=Ff(Pk.bind(null,a,tk,uk),b);break}Pk(a,tk,uk);break;case 4:Ck(a,d);if((d&4194240)===
d)break;b=a.eventTimes;for(e=-1;0<d;){var g=31-oc(d);f=1<<g;g=b[g];g>e&&(e=g);d&=~f;}d=e;d=B$1()-d;d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3E3>d?3E3:4320>d?4320:1960*lk(d/1960))-d;if(10<d){a.timeoutHandle=Ff(Pk.bind(null,a,tk,uk),d);break}Pk(a,tk,uk);break;case 5:Pk(a,tk,uk);break;default:throw Error(p$4(329));}}}Dk(a,B$1());return a.callbackNode===c?Gk.bind(null,a):null}
function Nk(a,b){var c=sk;a.current.memoizedState.isDehydrated&&(Kk(a,b).flags|=256);a=Ik(a,b);2!==a&&(b=tk,tk=c,null!==b&&Fj(b));return a}function Fj(a){null===tk?tk=a:tk.push.apply(tk,a);}
function Ok(a){for(var b=a;;){if(b.flags&16384){var c=b.updateQueue;if(null!==c&&(c=c.stores,null!==c))for(var d=0;d<c.length;d++){var e=c[d],f=e.getSnapshot;e=e.value;try{if(!He$1(f(),e))return !1}catch(g){return !1}}}c=b.child;if(b.subtreeFlags&16384&&null!==c)c.return=b,b=c;else {if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return !0;b=b.return;}b.sibling.return=b.return;b=b.sibling;}}return !0}
function Ck(a,b){b&=~rk;b&=~qk;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-oc(b),d=1<<c;a[c]=-1;b&=~d;}}function Ek(a){if(0!==(K$1&6))throw Error(p$4(327));Hk();var b=uc(a,0);if(0===(b&1))return Dk(a,B$1()),null;var c=Ik(a,b);if(0!==a.tag&&2===c){var d=xc(a);0!==d&&(b=d,c=Nk(a,d));}if(1===c)throw c=pk,Kk(a,0),Ck(a,b),Dk(a,B$1()),c;if(6===c)throw Error(p$4(345));a.finishedWork=a.current.alternate;a.finishedLanes=b;Pk(a,tk,uk);Dk(a,B$1());return null}
function Qk(a,b){var c=K$1;K$1|=1;try{return a(b)}finally{K$1=c,0===K$1&&(Gj=B$1()+500,fg&&jg());}}function Rk(a){null!==wk&&0===wk.tag&&0===(K$1&6)&&Hk();var b=K$1;K$1|=1;var c=ok.transition,d=C$2;try{if(ok.transition=null,C$2=1,a)return a()}finally{C$2=d,ok.transition=c,K$1=b,0===(K$1&6)&&jg();}}function Hj(){fj=ej.current;E(ej);}
function Kk(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,Gf(c));if(null!==Y$1)for(c=Y$1.return;null!==c;){var d=c;wg(d);switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&$f();break;case 3:zh();E(Wf);E(H$2);Eh();break;case 5:Bh(d);break;case 4:zh();break;case 13:E(L$3);break;case 19:E(L$3);break;case 10:ah(d.type._context);break;case 22:case 23:Hj();}c=c.return;}Q$2=a;Y$1=a=Pg(a.current,null);Z$1=fj=b;T$2=0;pk=null;rk=qk=rh=0;tk=sk=null;if(null!==fh){for(b=
0;b<fh.length;b++)if(c=fh[b],d=c.interleaved,null!==d){c.interleaved=null;var e=d.next,f=c.pending;if(null!==f){var g=f.next;f.next=e;d.next=g;}c.pending=d;}fh=null;}return a}
function Mk(a,b){do{var c=Y$1;try{$g();Fh.current=Rh;if(Ih){for(var d=M$3.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next;}Ih=!1;}Hh=0;O=N$2=M$3=null;Jh=!1;Kh=0;nk.current=null;if(null===c||null===c.return){T$2=1;pk=b;Y$1=null;break}a:{var f=a,g=c.return,h=c,k=b;b=Z$1;h.flags|=32768;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k,m=h,q=m.tag;if(0===(m.mode&1)&&(0===q||11===q||15===q)){var r=m.alternate;r?(m.updateQueue=r.updateQueue,m.memoizedState=r.memoizedState,
m.lanes=r.lanes):(m.updateQueue=null,m.memoizedState=null);}var y=Ui(g);if(null!==y){y.flags&=-257;Vi(y,g,h,f,b);y.mode&1&&Si(f,l,b);b=y;k=l;var n=b.updateQueue;if(null===n){var t=new Set;t.add(k);b.updateQueue=t;}else n.add(k);break a}else {if(0===(b&1)){Si(f,l,b);tj();break a}k=Error(p$4(426));}}else if(I$1&&h.mode&1){var J=Ui(g);if(null!==J){0===(J.flags&65536)&&(J.flags|=256);Vi(J,g,h,f,b);Jg(Ji(k,h));break a}}f=k=Ji(k,h);4!==T$2&&(T$2=2);null===sk?sk=[f]:sk.push(f);f=g;do{switch(f.tag){case 3:f.flags|=65536;
b&=-b;f.lanes|=b;var x=Ni(f,k,b);ph(f,x);break a;case 1:h=k;var w=f.type,u=f.stateNode;if(0===(f.flags&128)&&("function"===typeof w.getDerivedStateFromError||null!==u&&"function"===typeof u.componentDidCatch&&(null===Ri||!Ri.has(u)))){f.flags|=65536;b&=-b;f.lanes|=b;var F=Qi(f,h,b);ph(f,F);break a}}f=f.return;}while(null!==f)}Sk(c);}catch(na){b=na;Y$1===c&&null!==c&&(Y$1=c=c.return);continue}break}while(1)}function Jk(){var a=mk.current;mk.current=Rh;return null===a?Rh:a}
function tj(){if(0===T$2||3===T$2||2===T$2)T$2=4;null===Q$2||0===(rh&268435455)&&0===(qk&268435455)||Ck(Q$2,Z$1);}function Ik(a,b){var c=K$1;K$1|=2;var d=Jk();if(Q$2!==a||Z$1!==b)uk=null,Kk(a,b);do try{Tk();break}catch(e){Mk(a,e);}while(1);$g();K$1=c;mk.current=d;if(null!==Y$1)throw Error(p$4(261));Q$2=null;Z$1=0;return T$2}function Tk(){for(;null!==Y$1;)Uk(Y$1);}function Lk(){for(;null!==Y$1&&!cc();)Uk(Y$1);}function Uk(a){var b=Vk(a.alternate,a,fj);a.memoizedProps=a.pendingProps;null===b?Sk(a):Y$1=b;nk.current=null;}
function Sk(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&32768)){if(c=Ej(c,b,fj),null!==c){Y$1=c;return}}else {c=Ij(c,b);if(null!==c){c.flags&=32767;Y$1=c;return}if(null!==a)a.flags|=32768,a.subtreeFlags=0,a.deletions=null;else {T$2=6;Y$1=null;return}}b=b.sibling;if(null!==b){Y$1=b;return}Y$1=b=a;}while(null!==b);0===T$2&&(T$2=5);}function Pk(a,b,c){var d=C$2,e=ok.transition;try{ok.transition=null,C$2=1,Wk(a,b,c,d);}finally{ok.transition=e,C$2=d;}return null}
function Wk(a,b,c,d){do Hk();while(null!==wk);if(0!==(K$1&6))throw Error(p$4(327));c=a.finishedWork;var e=a.finishedLanes;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(p$4(177));a.callbackNode=null;a.callbackPriority=0;var f=c.lanes|c.childLanes;Bc(a,f);a===Q$2&&(Y$1=Q$2=null,Z$1=0);0===(c.subtreeFlags&2064)&&0===(c.flags&2064)||vk||(vk=!0,Fk(hc,function(){Hk();return null}));f=0!==(c.flags&15990);if(0!==(c.subtreeFlags&15990)||f){f=ok.transition;ok.transition=null;
var g=C$2;C$2=1;var h=K$1;K$1|=4;nk.current=null;Oj(a,c);dk(c,a);Oe$1(Df);dd=!!Cf;Df=Cf=null;a.current=c;hk(c);dc();K$1=h;C$2=g;ok.transition=f;}else a.current=c;vk&&(vk=!1,wk=a,xk=e);f=a.pendingLanes;0===f&&(Ri=null);mc(c.stateNode);Dk(a,B$1());if(null!==b)for(d=a.onRecoverableError,c=0;c<b.length;c++)e=b[c],d(e.value,{componentStack:e.stack,digest:e.digest});if(Oi)throw Oi=!1,a=Pi,Pi=null,a;0!==(xk&1)&&0!==a.tag&&Hk();f=a.pendingLanes;0!==(f&1)?a===zk?yk++:(yk=0,zk=a):yk=0;jg();return null}
function Hk(){if(null!==wk){var a=Dc(xk),b=ok.transition,c=C$2;try{ok.transition=null;C$2=16>a?16:a;if(null===wk)var d=!1;else {a=wk;wk=null;xk=0;if(0!==(K$1&6))throw Error(p$4(331));var e=K$1;K$1|=4;for(V$1=a.current;null!==V$1;){var f=V$1,g=f.child;if(0!==(V$1.flags&16)){var h=f.deletions;if(null!==h){for(var k=0;k<h.length;k++){var l=h[k];for(V$1=l;null!==V$1;){var m=V$1;switch(m.tag){case 0:case 11:case 15:Pj(8,m,f);}var q=m.child;if(null!==q)q.return=m,V$1=q;else for(;null!==V$1;){m=V$1;var r=m.sibling,y=m.return;Sj(m);if(m===
l){V$1=null;break}if(null!==r){r.return=y;V$1=r;break}V$1=y;}}}var n=f.alternate;if(null!==n){var t=n.child;if(null!==t){n.child=null;do{var J=t.sibling;t.sibling=null;t=J;}while(null!==t)}}V$1=f;}}if(0!==(f.subtreeFlags&2064)&&null!==g)g.return=f,V$1=g;else b:for(;null!==V$1;){f=V$1;if(0!==(f.flags&2048))switch(f.tag){case 0:case 11:case 15:Pj(9,f,f.return);}var x=f.sibling;if(null!==x){x.return=f.return;V$1=x;break b}V$1=f.return;}}var w=a.current;for(V$1=w;null!==V$1;){g=V$1;var u=g.child;if(0!==(g.subtreeFlags&2064)&&null!==
u)u.return=g,V$1=u;else b:for(g=w;null!==V$1;){h=V$1;if(0!==(h.flags&2048))try{switch(h.tag){case 0:case 11:case 15:Qj(9,h);}}catch(na){W$1(h,h.return,na);}if(h===g){V$1=null;break b}var F=h.sibling;if(null!==F){F.return=h.return;V$1=F;break b}V$1=h.return;}}K$1=e;jg();if(lc&&"function"===typeof lc.onPostCommitFiberRoot)try{lc.onPostCommitFiberRoot(kc,a);}catch(na){}d=!0;}return d}finally{C$2=c,ok.transition=b;}}return !1}function Xk(a,b,c){b=Ji(c,b);b=Ni(a,b,1);a=nh(a,b,1);b=R$1();null!==a&&(Ac(a,1,b),Dk(a,b));}
function W$1(a,b,c){if(3===a.tag)Xk(a,a,c);else for(;null!==b;){if(3===b.tag){Xk(b,a,c);break}else if(1===b.tag){var d=b.stateNode;if("function"===typeof b.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ri||!Ri.has(d))){a=Ji(c,a);a=Qi(b,a,1);b=nh(b,a,1);a=R$1();null!==b&&(Ac(b,1,a),Dk(b,a));break}}b=b.return;}}
function Ti(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=R$1();a.pingedLanes|=a.suspendedLanes&c;Q$2===a&&(Z$1&c)===c&&(4===T$2||3===T$2&&(Z$1&130023424)===Z$1&&500>B$1()-fk?Kk(a,0):rk|=c);Dk(a,b);}function Yk(a,b){0===b&&(0===(a.mode&1)?b=1:(b=sc,sc<<=1,0===(sc&130023424)&&(sc=4194304)));var c=R$1();a=ih(a,b);null!==a&&(Ac(a,b,c),Dk(a,c));}function uj(a){var b=a.memoizedState,c=0;null!==b&&(c=b.retryLane);Yk(a,c);}
function bk(a,b){var c=0;switch(a.tag){case 13:var d=a.stateNode;var e=a.memoizedState;null!==e&&(c=e.retryLane);break;case 19:d=a.stateNode;break;default:throw Error(p$4(314));}null!==d&&d.delete(b);Yk(a,c);}var Vk;
Vk=function(a,b,c){if(null!==a)if(a.memoizedProps!==b.pendingProps||Wf.current)dh=!0;else {if(0===(a.lanes&c)&&0===(b.flags&128))return dh=!1,yj(a,b,c);dh=0!==(a.flags&131072)?!0:!1;}else dh=!1,I$1&&0!==(b.flags&1048576)&&ug(b,ng,b.index);b.lanes=0;switch(b.tag){case 2:var d=b.type;ij(a,b);a=b.pendingProps;var e=Yf(b,H$2.current);ch(b,c);e=Nh(null,b,d,a,e,c);var f=Sh();b.flags|=1;"object"===typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof?(b.tag=1,b.memoizedState=null,b.updateQueue=
null,Zf(d)?(f=!0,cg(b)):f=!1,b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null,kh(b),e.updater=Ei,b.stateNode=e,e._reactInternals=b,Ii(b,d,a,c),b=jj(null,b,d,!0,f,c)):(b.tag=0,I$1&&f&&vg(b),Xi(null,b,e,c),b=b.child);return b;case 16:d=b.elementType;a:{ij(a,b);a=b.pendingProps;e=d._init;d=e(d._payload);b.type=d;e=b.tag=Zk(d);a=Ci(d,a);switch(e){case 0:b=cj(null,b,d,a,c);break a;case 1:b=hj(null,b,d,a,c);break a;case 11:b=Yi(null,b,d,a,c);break a;case 14:b=$i(null,b,d,Ci(d.type,a),c);break a}throw Error(p$4(306,
d,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),cj(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),hj(a,b,d,e,c);case 3:a:{kj(b);if(null===a)throw Error(p$4(387));d=b.pendingProps;f=b.memoizedState;e=f.element;lh(a,b);qh(b,d,null,c);var g=b.memoizedState;d=g.element;if(f.isDehydrated)if(f={element:d,isDehydrated:!1,cache:g.cache,pendingSuspenseBoundaries:g.pendingSuspenseBoundaries,transitions:g.transitions},b.updateQueue.baseState=
f,b.memoizedState=f,b.flags&256){e=Ji(Error(p$4(423)),b);b=lj(a,b,d,c,e);break a}else if(d!==e){e=Ji(Error(p$4(424)),b);b=lj(a,b,d,c,e);break a}else for(yg=Lf(b.stateNode.containerInfo.firstChild),xg=b,I$1=!0,zg=null,c=Vg(b,null,d,c),b.child=c;c;)c.flags=c.flags&-3|4096,c=c.sibling;else {Ig();if(d===e){b=Zi(a,b,c);break a}Xi(a,b,d,c);}b=b.child;}return b;case 5:return Ah(b),null===a&&Eg(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,Ef(d,e)?g=null:null!==f&&Ef(d,f)&&(b.flags|=32),
gj(a,b),Xi(a,b,g,c),b.child;case 6:return null===a&&Eg(b),null;case 13:return oj(a,b,c);case 4:return yh(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Ug(b,null,d,c):Xi(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),Yi(a,b,d,e,c);case 7:return Xi(a,b,b.pendingProps,c),b.child;case 8:return Xi(a,b,b.pendingProps.children,c),b.child;case 12:return Xi(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;f=b.memoizedProps;
g=e.value;G$1(Wg,d._currentValue);d._currentValue=g;if(null!==f)if(He$1(f.value,g)){if(f.children===e.children&&!Wf.current){b=Zi(a,b,c);break a}}else for(f=b.child,null!==f&&(f.return=b);null!==f;){var h=f.dependencies;if(null!==h){g=f.child;for(var k=h.firstContext;null!==k;){if(k.context===d){if(1===f.tag){k=mh(-1,c&-c);k.tag=2;var l=f.updateQueue;if(null!==l){l=l.shared;var m=l.pending;null===m?k.next=k:(k.next=m.next,m.next=k);l.pending=k;}}f.lanes|=c;k=f.alternate;null!==k&&(k.lanes|=c);bh(f.return,
c,b);h.lanes|=c;break}k=k.next;}}else if(10===f.tag)g=f.type===b.type?null:f.child;else if(18===f.tag){g=f.return;if(null===g)throw Error(p$4(341));g.lanes|=c;h=g.alternate;null!==h&&(h.lanes|=c);bh(g,c,b);g=f.sibling;}else g=f.child;if(null!==g)g.return=f;else for(g=f;null!==g;){if(g===b){g=null;break}f=g.sibling;if(null!==f){f.return=g.return;g=f;break}g=g.return;}f=g;}Xi(a,b,e.children,c);b=b.child;}return b;case 9:return e=b.type,d=b.pendingProps.children,ch(b,c),e=eh(e),d=d(e),b.flags|=1,Xi(a,b,d,c),
b.child;case 14:return d=b.type,e=Ci(d,b.pendingProps),e=Ci(d.type,e),$i(a,b,d,e,c);case 15:return bj(a,b,b.type,b.pendingProps,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci(d,e),ij(a,b),b.tag=1,Zf(d)?(a=!0,cg(b)):a=!1,ch(b,c),Gi(b,d,e),Ii(b,d,e,c),jj(null,b,d,!0,a,c);case 19:return xj(a,b,c);case 22:return dj(a,b,c)}throw Error(p$4(156,b.tag));};function Fk(a,b){return ac(a,b)}
function $k(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.subtreeFlags=this.flags=0;this.deletions=null;this.childLanes=this.lanes=0;this.alternate=null;}function Bg(a,b,c,d){return new $k(a,b,c,d)}function aj(a){a=a.prototype;return !(!a||!a.isReactComponent)}
function Zk(a){if("function"===typeof a)return aj(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Da)return 11;if(a===Ga)return 14}return 2}
function Pg(a,b){var c=a.alternate;null===c?(c=Bg(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.subtreeFlags=0,c.deletions=null);c.flags=a.flags&14680064;c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
function Rg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)aj(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ya:return Tg(c.children,e,f,b);case za:g=8;e|=8;break;case Aa:return a=Bg(12,c,b,e|2),a.elementType=Aa,a.lanes=f,a;case Ea:return a=Bg(13,c,b,e),a.elementType=Ea,a.lanes=f,a;case Fa:return a=Bg(19,c,b,e),a.elementType=Fa,a.lanes=f,a;case Ia:return pj(c,e,f,b);default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case Ba:g=10;break a;case Ca:g=9;break a;case Da:g=11;
break a;case Ga:g=14;break a;case Ha:g=16;d=null;break a}throw Error(p$4(130,null==a?a:typeof a,""));}b=Bg(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Tg(a,b,c,d){a=Bg(7,a,d,b);a.lanes=c;return a}function pj(a,b,c,d){a=Bg(22,a,d,b);a.elementType=Ia;a.lanes=c;a.stateNode={isHidden:!1};return a}function Qg(a,b,c){a=Bg(6,a,null,b);a.lanes=c;return a}
function Sg(a,b,c){b=Bg(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function al(a,b,c,d,e){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.callbackNode=this.pendingContext=this.context=null;this.callbackPriority=0;this.eventTimes=zc(0);this.expirationTimes=zc(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=zc(0);this.identifierPrefix=d;this.onRecoverableError=e;this.mutableSourceEagerHydrationData=
null;}function bl(a,b,c,d,e,f,g,h,k){a=new al(a,b,c,h,k);1===b?(b=1,!0===f&&(b|=8)):b=0;f=Bg(3,null,null,b);a.current=f;f.stateNode=a;f.memoizedState={element:d,isDehydrated:c,cache:null,transitions:null,pendingSuspenseBoundaries:null};kh(f);return a}function cl(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return {$$typeof:wa,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
function dl(a){if(!a)return Vf;a=a._reactInternals;a:{if(Vb(a)!==a||1!==a.tag)throw Error(p$4(170));var b=a;do{switch(b.tag){case 3:b=b.stateNode.context;break a;case 1:if(Zf(b.type)){b=b.stateNode.__reactInternalMemoizedMergedChildContext;break a}}b=b.return;}while(null!==b);throw Error(p$4(171));}if(1===a.tag){var c=a.type;if(Zf(c))return bg(a,c,b)}return b}
function el(a,b,c,d,e,f,g,h,k){a=bl(c,d,!0,a,e,f,g,h,k);a.context=dl(null);c=a.current;d=R$1();e=yi(c);f=mh(d,e);f.callback=void 0!==b&&null!==b?b:null;nh(c,f,e);a.current.lanes=e;Ac(a,e,d);Dk(a,d);return a}function fl(a,b,c,d){var e=b.current,f=R$1(),g=yi(e);c=dl(c);null===b.context?b.context=c:b.pendingContext=c;b=mh(f,g);b.payload={element:a};d=void 0===d?null:d;null!==d&&(b.callback=d);a=nh(e,b,g);null!==a&&(gi(a,e,g,f),oh(a,e,g));return g}
function gl(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function hl(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b;}}function il(a,b){hl(a,b);(a=a.alternate)&&hl(a,b);}function jl(){return null}var kl="function"===typeof reportError?reportError:function(a){console.error(a);};function ll(a){this._internalRoot=a;}
ml.prototype.render=ll.prototype.render=function(a){var b=this._internalRoot;if(null===b)throw Error(p$4(409));fl(a,b,null,null);};ml.prototype.unmount=ll.prototype.unmount=function(){var a=this._internalRoot;if(null!==a){this._internalRoot=null;var b=a.containerInfo;Rk(function(){fl(null,a,null,null);});b[uf]=null;}};function ml(a){this._internalRoot=a;}
ml.prototype.unstable_scheduleHydration=function(a){if(a){var b=Hc();a={blockedOn:null,target:a,priority:b};for(var c=0;c<Qc.length&&0!==b&&b<Qc[c].priority;c++);Qc.splice(c,0,a);0===c&&Vc(a);}};function nl(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType)}function ol(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}function pl(){}
function ql(a,b,c,d,e){if(e){if("function"===typeof d){var f=d;d=function(){var a=gl(g);f.call(a);};}var g=el(b,d,a,0,null,!1,!1,"",pl);a._reactRootContainer=g;a[uf]=g.current;sf(8===a.nodeType?a.parentNode:a);Rk();return g}for(;e=a.lastChild;)a.removeChild(e);if("function"===typeof d){var h=d;d=function(){var a=gl(k);h.call(a);};}var k=bl(a,0,!1,null,null,!1,!1,"",pl);a._reactRootContainer=k;a[uf]=k.current;sf(8===a.nodeType?a.parentNode:a);Rk(function(){fl(b,k,c,d);});return k}
function rl(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f;if("function"===typeof e){var h=e;e=function(){var a=gl(g);h.call(a);};}fl(b,g,a,e);}else g=ql(c,b,a,e,d);return gl(g)}Ec=function(a){switch(a.tag){case 3:var b=a.stateNode;if(b.current.memoizedState.isDehydrated){var c=tc(b.pendingLanes);0!==c&&(Cc(b,c|1),Dk(b,B$1()),0===(K$1&6)&&(Gj=B$1()+500,jg()));}break;case 13:Rk(function(){var b=ih(a,1);if(null!==b){var c=R$1();gi(b,a,1,c);}}),il(a,1);}};
Fc=function(a){if(13===a.tag){var b=ih(a,134217728);if(null!==b){var c=R$1();gi(b,a,134217728,c);}il(a,134217728);}};Gc=function(a){if(13===a.tag){var b=yi(a),c=ih(a,b);if(null!==c){var d=R$1();gi(c,a,b,d);}il(a,b);}};Hc=function(){return C$2};Ic=function(a,b){var c=C$2;try{return C$2=a,b()}finally{C$2=c;}};
yb=function(a,b,c){switch(b){case "input":bb(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(p$4(90));Wa(d);bb(d,e);}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,!1);}};Gb=Qk;Hb=Rk;
var sl={usingClientEntryPoint:!1,Events:[Cb,ue$1,Db,Eb,Fb,Qk]},tl={findFiberByHostInstance:Wc,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"};
var ul={bundleType:tl.bundleType,version:tl.version,rendererPackageName:tl.rendererPackageName,rendererConfig:tl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ua.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=Zb(a);return null===a?null:a.stateNode},findFiberByHostInstance:tl.findFiberByHostInstance||
jl,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var vl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!vl.isDisabled&&vl.supportsFiber)try{kc=vl.inject(ul),lc=vl;}catch(a){}}reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sl;
reactDom_production_min.createPortal=function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!nl(b))throw Error(p$4(200));return cl(a,b,null,c)};reactDom_production_min.createRoot=function(a,b){if(!nl(a))throw Error(p$4(299));var c=!1,d="",e=kl;null!==b&&void 0!==b&&(!0===b.unstable_strictMode&&(c=!0),void 0!==b.identifierPrefix&&(d=b.identifierPrefix),void 0!==b.onRecoverableError&&(e=b.onRecoverableError));b=bl(a,1,!1,null,null,c,!1,d,e);a[uf]=b.current;sf(8===a.nodeType?a.parentNode:a);return new ll(b)};
reactDom_production_min.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(p$4(188));a=Object.keys(a).join(",");throw Error(p$4(268,a));}a=Zb(b);a=null===a?null:a.stateNode;return a};reactDom_production_min.flushSync=function(a){return Rk(a)};reactDom_production_min.hydrate=function(a,b,c){if(!ol(b))throw Error(p$4(200));return rl(null,a,b,!0,c)};
reactDom_production_min.hydrateRoot=function(a,b,c){if(!nl(a))throw Error(p$4(405));var d=null!=c&&c.hydratedSources||null,e=!1,f="",g=kl;null!==c&&void 0!==c&&(!0===c.unstable_strictMode&&(e=!0),void 0!==c.identifierPrefix&&(f=c.identifierPrefix),void 0!==c.onRecoverableError&&(g=c.onRecoverableError));b=el(b,null,a,1,null!=c?c:null,e,!1,f,g);a[uf]=b.current;sf(a);if(d)for(a=0;a<d.length;a++)c=d[a],e=c._getVersion,e=e(c._source),null==b.mutableSourceEagerHydrationData?b.mutableSourceEagerHydrationData=[c,e]:b.mutableSourceEagerHydrationData.push(c,
e);return new ml(b)};reactDom_production_min.render=function(a,b,c){if(!ol(b))throw Error(p$4(200));return rl(null,a,b,!1,c)};reactDom_production_min.unmountComponentAtNode=function(a){if(!ol(a))throw Error(p$4(40));return a._reactRootContainer?(Rk(function(){rl(null,null,a,!1,function(){a._reactRootContainer=null;a[uf]=null;});}),!0):!1};reactDom_production_min.unstable_batchedUpdates=Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!ol(c))throw Error(p$4(200));if(null==a||void 0===a._reactInternals)throw Error(p$4(38));return rl(a,b,c,!1,d)};reactDom_production_min.version="18.3.1-next-f1338f8080-20240426";

function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}

var reactDomExports = reactDom.exports;
const index = /*@__PURE__*/getDefaultExportFromCjs(reactDomExports);

const ReactDOM = /*#__PURE__*/_mergeNamespaces({
  __proto__: null,
  default: index
}, [reactDomExports]);

var createRoot;
var m$5 = reactDomExports;
{
  createRoot = m$5.createRoot;
  m$5.hydrateRoot;
}

const Overlay = ({
  onClick,
  children
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      onClick,
      className: "overlay",
      children
    }
  );
};

const Dialog = ({
  children,
  onClickOnOverlay,
  className
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      onClick: onClickOnOverlay,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "dialog",
        {
          className: "dialog-box " + (className ?? ""),
          onClick: (e) => e.stopPropagation(),
          children
        }
      )
    }
  );
};

const DialogActionBar = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "dialog-action-bar",
      children
    }
  );
};

const ConfirmationDialog = ({
  params,
  onConfirm,
  onCancel
}) => {
  if (!params) return null;
  const {
    text,
    confirmText,
    cancelText,
    encourageConfirmation
  } = params;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dialog,
    {
      onClickOnOverlay: onCancel,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "dialog-text",
            children: text
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogActionBar, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onConfirm,
              autoFocus: encourageConfirmation,
              className: "default-button dialog-box-button " + (encourageConfirmation ? "default-action" : "dangerous-action"),
              children: confirmText
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onCancel,
              autoFocus: !encourageConfirmation,
              className: "default-button dialog-box-button " + (!encourageConfirmation ? "default-action" : ""),
              children: cancelText
            }
          )
        ] })
      ]
    }
  );
};

const ConfirmationServiceContext = React.createContext(null);

const ConfirmationServiceProvider = ({
  children
}) => {
  const [
    confirmationState,
    setConfirmationState
  ] = React.useState(null);
  const awaitingPromiseRef = React.useRef();
  const openConfirmation = (params) => {
    setConfirmationState(params);
    return new Promise((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  };
  const handleCancel = () => {
    if (!confirmationState) {
      return;
    }
    setConfirmationState(null);
  };
  const handleConfirm = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }
    setConfirmationState(null);
  };
  reactExports.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [confirmationState]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmationDialog,
      {
        params: confirmationState,
        onConfirm: handleConfirm,
        onCancel: handleCancel
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmationServiceContext.Provider,
      {
        value: openConfirmation,
        children
      }
    )
  ] });
};

const UnsavedChangesContext = reactExports.createContext(
  [false, null]
);

const AppMenuContext = reactExports.createContext(
  null
);

/**
 * @remix-run/router v1.16.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}

////////////////////////////////////////////////////////////////////////////////
//#region Types and Constants
////////////////////////////////////////////////////////////////////////////////
/**
 * Actions represent the type of change to a location value.
 */
var Action;
(function (Action) {
  /**
   * A POP indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. It does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * Note: This is the default action for newly created history objects.
   */
  Action["Pop"] = "POP";
  /**
   * A PUSH indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. When this happens, all subsequent
   * entries in the stack are lost.
   */
  Action["Push"] = "PUSH";
  /**
   * A REPLACE indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */
  Action["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
/**
 * Browser history stores the location in regular URLs. This is the standard for
 * most web apps, but it requires some configuration on the server to ensure you
 * serve the same app at multiple URLs.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createbrowserhistory
 */
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window, globalHistory) {
    let {
      pathname,
      search,
      hash
    } = window.location;
    return createLocation("", {
      pathname,
      search,
      hash
    },
    // state defaults to `null` because `window.history.state` does
    globalHistory.state && globalHistory.state.usr || null, globalHistory.state && globalHistory.state.key || "default");
  }
  function createBrowserHref(window, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== "undefined") console.warn(message);
    try {
      // Welcome to debugging history!
      //
      // This error is thrown as a convenience, so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
/**
 * For browser-based histories, we combine the state and key into an object
 */
function getHistoryState(location, index) {
  return {
    usr: location.state,
    key: location.key,
    idx: index
  };
}
/**
 * Creates a Location object with a unique key from the given Path
 */
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends$2({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location;
}
/**
 * Creates a string URL path from the given pathname, search, and hash components.
 */
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
/**
 * Parses a string URL path into its separate pathname, search, and hash components.
 */
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window.history;
  let action = Action.Pop;
  let listener = null;
  let index = getIndex();
  // Index should only be null when we initialize. If not, it's because the
  // user called history.pushState or history.replaceState directly, in which
  // case we should log a warning as it will result in bugs.
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends$2({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to, state) {
    action = Action.Push;
    let location = createLocation(history.location, to, state);
    index = getIndex() + 1;
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    // try...catch because iOS limits us to 100 pushState calls :/
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      // If the exception is because `state` can't be serialized, let that throw
      // outwards just like a replace call would so the dev knows the cause
      // https://html.spec.whatwg.org/multipage/nav-history-apis.html#shared-history-push/replace-state-steps
      // https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      // They are going to lose state here, but there is no real
      // way to warn them about it since the page will refresh...
      window.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to, state) {
    action = Action.Replace;
    let location = createLocation(history.location, to, state);
    index = getIndex();
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to) {
    // window.location.origin is "null" (the literal string value) in Firefox
    // under certain conditions, notably when serving from a local HTML file
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=878297
    let base = window.location.origin !== "null" ? window.location.origin : window.location.href;
    let href = typeof to === "string" ? to : createPath(to);
    // Treating this as a full URL will strip any trailing spaces so we need to
    // pre-encode them since they might be part of a matching splat param from
    // an ancestor route
    href = href.replace(/ $/, "%20");
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window, to);
    },
    createURL,
    encodeLocation(to) {
      // Encode a Location the same way window.location would
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n) {
      return globalHistory.go(n);
    }
  };
  return history;
}
//#endregion

var ResultType;
(function (ResultType) {
  ResultType["data"] = "data";
  ResultType["deferred"] = "deferred";
  ResultType["redirect"] = "redirect";
  ResultType["error"] = "error";
})(ResultType || (ResultType = {}));
const immutableRouteKeys = new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
function isIndexRoute(route) {
  return route.index === true;
}
// Walk the route tree generating unique IDs where necessary, so we are working
// solely with AgnosticDataRouteObject's within the Router
function convertRoutesToDataRoutes(routes, mapRouteProperties, parentPath, manifest) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  if (manifest === void 0) {
    manifest = {};
  }
  return routes.map((route, index) => {
    let treePath = [...parentPath, index];
    let id = typeof route.id === "string" ? route.id : treePath.join("-");
    invariant(route.index !== true || !route.children, "Cannot specify children on an index route");
    invariant(!manifest[id], "Found a route id collision on id \"" + id + "\".  Route " + "id's must be globally unique within Data Router usages");
    if (isIndexRoute(route)) {
      let indexRoute = _extends$2({}, route, mapRouteProperties(route), {
        id
      });
      manifest[id] = indexRoute;
      return indexRoute;
    } else {
      let pathOrLayoutRoute = _extends$2({}, route, mapRouteProperties(route), {
        id,
        children: undefined
      });
      manifest[id] = pathOrLayoutRoute;
      if (route.children) {
        pathOrLayoutRoute.children = convertRoutesToDataRoutes(route.children, mapRouteProperties, treePath, manifest);
      }
      return pathOrLayoutRoute;
    }
  });
}
/**
 * Matches the given routes to a location and returns the match data.
 *
 * @see https://reactrouter.com/utils/match-routes
 */
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    // Incoming pathnames are generally encoded from either window.location
    // or from router.navigate, but we want to match against the unencoded
    // paths in the route definitions.  Memory router locations won't be
    // encoded here but there also shouldn't be anything to decode so this
    // should be a safe operation.  This avoids needing matchRoutes to be
    // history-aware.
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(branches[i], decoded);
  }
  return matches;
}
function convertRouteMatchToUiMatch(match, loaderData) {
  let {
    route,
    pathname,
    params
  } = match;
  return {
    id: route.id,
    pathname,
    params,
    data: loaderData[route.id],
    handle: route.handle
  };
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === undefined ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), "Absolute route path \"" + meta.relativePath + "\" nested under path " + ("\"" + parentPath + "\" is not valid. An absolute child route path ") + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    // Add the children before adding this route to the array, so we traverse the
    // route tree depth-first and child routes appear before their parents in
    // the "flattened" version.
    if (route.children && route.children.length > 0) {
      invariant(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      route.index !== true, "Index routes must not have child routes. Please remove " + ("all child routes from route path \"" + path + "\"."));
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    // Routes without a path shouldn't ever match by themselves unless they are
    // index routes, so don't add them to the list of possible branches.
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    var _route$path;
    // coarse-grain check for optional params
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
/**
 * Computes all combinations of optional path segments for a given path,
 * excluding combinations that are ambiguous and of lower priority.
 *
 * For example, `/one/:two?/three/:four?/:five?` explodes to:
 * - `/one/three`
 * - `/one/:two/three`
 * - `/one/three/:four`
 * - `/one/three/:five`
 * - `/one/:two/three/:four`
 * - `/one/:two/three/:five`
 * - `/one/three/:four/:five`
 * - `/one/:two/three/:four/:five`
 */
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  // Optional path segments are denoted by a trailing `?`
  let isOptional = first.endsWith("?");
  // Compute the corresponding required segment: `foo?` -> `foo`
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    // Intepret empty string as omitting an optional segment
    // `["one", "", "three"]` corresponds to omitting `:two` from `/one/:two?/three` -> `/one/three`
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  // All child paths with the prefix.  Do this for all children before the
  // optional version for all children, so we get consistent ordering where the
  // parent optional aspect is preferred as required.  Otherwise, we can get
  // child sections interspersed where deeper optional segments are higher than
  // parent optional segments, where for example, /:two would explode _earlier_
  // then /:one.  By always including the parent as required _for all children_
  // first, we avoid this issue
  result.push(...restExploded.map(subpath => subpath === "" ? required : [required, subpath].join("/")));
  // Then, if this is an optional value, add all child versions without
  if (isOptional) {
    result.push(...restExploded);
  }
  // for absolute paths, ensure `/` instead of empty segment
  return result.map(exploded => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score // Higher score first
  : compareIndexes(a.routesMeta.map(meta => meta.childrenIndex), b.routesMeta.map(meta => meta.childrenIndex)));
}
const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = s => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter(s => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ?
  // If two routes are siblings, we should try to match the earlier sibling
  // first. This allows people to have fine-grained control over the matching
  // behavior by simply putting routes with identical paths in the order they
  // want them tried.
  a[a.length - 1] - b[b.length - 1] :
  // Otherwise, it doesn't really make sense to rank non-siblings by index,
  // so they sort equally.
  0;
}
function matchRouteBranch(branch, pathname) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    if (!match) return null;
    Object.assign(matchedParams, match.params);
    let route = meta.route;
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/utils/match-path
 */
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index) => {
    let {
      paramName,
      isOptional
    } = _ref;
    // We need to compute the pathnameBase here using the raw splat value
    // instead of using params["*"] later because it will be decoded then
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = undefined;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), "Route path \"" + path + "\" will be treated as if it were " + ("\"" + path.replace(/\*$/, "/*") + "\" because the `*` character must ") + "always follow a `/` in the pattern. To get rid of this warning, " + ("please change the route path to \"" + path.replace(/\*$/, "/*") + "\"."));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "") // Ignore trailing / and /*, we'll handle it below
  .replace(/^\/*/, "/") // Make sure it has a leading /
  .replace(/[\\.*+^${}|()[\]]/g, "\\$&") // Escape special regex chars
  .replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" // Already matched the initial /, just match the rest
    : "(?:\\/(.+)|\\/*)$"; // Don't include the / in params["*"]
  } else if (end) {
    // When matching to the end, ignore trailing slashes
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    // If our path is non-empty and contains anything beyond an initial slash,
    // then we have _some_ form of path in our regex, so we should expect to
    // match only if we find the end of this path segment.  Look for an optional
    // non-captured trailing slash (to match a portion of the URL) or the end
    // of the path (if we've matched to the end).  We used to do this with a
    // word boundary but that gives false positives on routes like
    // /user-preferences since `-` counts as a word boundary.
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map(v => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(false, "The URL path \"" + value + "\" could not be decoded because it is is a " + "malformed URL segment. This is probably due to a bad percent " + ("encoding (" + error + ")."));
    return value;
  }
}
/**
 * @private
 */
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  // We want to leave trailing slash behavior in the user's control, so if they
  // specify a basename with a trailing slash, we should support it
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    // pathname does not start with basename/
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
/**
 * Returns a resolved path object relative to the given pathname.
 *
 * @see https://reactrouter.com/utils/resolve-path
 */
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach(segment => {
    if (segment === "..") {
      // Keep the root "" segment so the pathname starts at /
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + "a string in <Link to=\"...\"> and the router will parse it for you.";
}
/**
 * @private
 *
 * When processing relative navigation we want to ignore ancestor routes that
 * do not contribute to the path, such that index/pathless layout routes don't
 * interfere.
 *
 * For example, when moving a route element into an index route and/or a
 * pathless layout route, relative link behavior contained within should stay
 * the same.  Both of the following examples should link back to the root:
 *
 *   <Route path="/">
 *     <Route path="accounts" element={<Link to=".."}>
 *   </Route>
 *
 *   <Route path="/">
 *     <Route path="accounts">
 *       <Route element={<AccountsLayout />}>       // <-- Does not contribute
 *         <Route index element={<Link to=".."} />  // <-- Does not contribute
 *       </Route
 *     </Route>
 *   </Route>
 */
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
// Return the array of pathnames for the current route matches - used to
// generate the routePathnames input for resolveTo()
function getResolveToMatches(matches, v7_relativeSplatPath) {
  let pathMatches = getPathContributingMatches(matches);
  // When v7_relativeSplatPath is enabled, use the full pathname for the leaf
  // match so we include splat values for "." links.  See:
  // https://github.com/remix-run/react-router/issues/11052#issuecomment-1836589329
  if (v7_relativeSplatPath) {
    return pathMatches.map((match, idx) => idx === matches.length - 1 ? match.pathname : match.pathnameBase);
  }
  return pathMatches.map(match => match.pathnameBase);
}
/**
 * @private
 */
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends$2({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  // Routing is relative to the current pathname if explicitly requested.
  //
  // If a pathname is explicitly provided in `to`, it should be relative to the
  // route context. This is explained in `Note on `<Link to>` values` in our
  // migration guide from v5 as a means of disambiguation between `to` values
  // that begin with `/` and those that do not. However, this is problematic for
  // `to` values that do not provide a pathname. `to` can simply be a search or
  // hash string, in which case we should assume that the navigation is relative
  // to the current location's pathname and *not* the route pathname.
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    // With relative="route" (the default), each leading .. segment means
    // "go up one route" instead of "go up one URL segment".  This is a key
    // difference from how <a href> works and a major reason we call this a
    // "to" value instead of a "href".
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  // Ensure the pathname has a trailing slash if the original "to" had one
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  // Or if this was a link to the current path which has a trailing slash
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
/**
 * @private
 */
const joinPaths = paths => paths.join("/").replace(/\/\/+/g, "/");
/**
 * @private
 */
const normalizePathname = pathname => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
/**
 * @private
 */
const normalizeSearch = search => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
/**
 * @private
 */
const normalizeHash = hash => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
/**
 * @private
 * Utility class we use to hold auto-unwrapped 4xx/5xx Response bodies
 *
 * We don't export the class for public use since it's an implementation
 * detail, but we export the interface above so folks can build their own
 * abstractions around instances via isRouteErrorResponse()
 */
class ErrorResponseImpl {
  constructor(status, statusText, data, internal) {
    if (internal === void 0) {
      internal = false;
    }
    this.status = status;
    this.statusText = statusText || "";
    this.internal = internal;
    if (data instanceof Error) {
      this.data = data.toString();
      this.error = data;
    } else {
      this.data = data;
    }
  }
}
/**
 * Check if the given error is an ErrorResponse generated from a 4xx/5xx
 * Response thrown from an action/loader
 */
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}

const validMutationMethodsArr = ["post", "put", "patch", "delete"];
const validMutationMethods = new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
const validRequestMethods = new Set(validRequestMethodsArr);
const redirectStatusCodes = new Set([301, 302, 303, 307, 308]);
const redirectPreserveMethodStatusCodes = new Set([307, 308]);
const IDLE_NAVIGATION = {
  state: "idle",
  location: undefined,
  formMethod: undefined,
  formAction: undefined,
  formEncType: undefined,
  formData: undefined,
  json: undefined,
  text: undefined
};
const IDLE_FETCHER = {
  state: "idle",
  data: undefined,
  formMethod: undefined,
  formAction: undefined,
  formEncType: undefined,
  formData: undefined,
  json: undefined,
  text: undefined
};
const IDLE_BLOCKER = {
  state: "unblocked",
  proceed: undefined,
  reset: undefined,
  location: undefined
};
const ABSOLUTE_URL_REGEX$1 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const defaultMapRouteProperties = route => ({
  hasErrorBoundary: Boolean(route.hasErrorBoundary)
});
const TRANSITIONS_STORAGE_KEY = "remix-router-transitions";
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region createRouter
////////////////////////////////////////////////////////////////////////////////
/**
 * Create a router and listen to history POP navigations
 */
function createRouter(init) {
  const routerWindow = init.window ? init.window : typeof window !== "undefined" ? window : undefined;
  const isBrowser = typeof routerWindow !== "undefined" && typeof routerWindow.document !== "undefined" && typeof routerWindow.document.createElement !== "undefined";
  const isServer = !isBrowser;
  invariant(init.routes.length > 0, "You must provide a non-empty routes array to createRouter");
  let mapRouteProperties;
  if (init.mapRouteProperties) {
    mapRouteProperties = init.mapRouteProperties;
  } else if (init.detectErrorBoundary) {
    // If they are still using the deprecated version, wrap it with the new API
    let detectErrorBoundary = init.detectErrorBoundary;
    mapRouteProperties = route => ({
      hasErrorBoundary: detectErrorBoundary(route)
    });
  } else {
    mapRouteProperties = defaultMapRouteProperties;
  }
  // Routes keyed by ID
  let manifest = {};
  // Routes in tree format for matching
  let dataRoutes = convertRoutesToDataRoutes(init.routes, mapRouteProperties, undefined, manifest);
  let inFlightDataRoutes;
  let basename = init.basename || "/";
  let dataStrategyImpl = init.unstable_dataStrategy || defaultDataStrategy;
  // Config driven behavior flags
  let future = _extends$2({
    v7_fetcherPersist: false,
    v7_normalizeFormMethod: false,
    v7_partialHydration: false,
    v7_prependBasename: false,
    v7_relativeSplatPath: false,
    unstable_skipActionErrorRevalidation: false
  }, init.future);
  // Cleanup function for history
  let unlistenHistory = null;
  // Externally-provided functions to call on all state changes
  let subscribers = new Set();
  // Externally-provided object to hold scroll restoration locations during routing
  let savedScrollPositions = null;
  // Externally-provided function to get scroll restoration keys
  let getScrollRestorationKey = null;
  // Externally-provided function to get current scroll position
  let getScrollPosition = null;
  // One-time flag to control the initial hydration scroll restoration.  Because
  // we don't get the saved positions from <ScrollRestoration /> until _after_
  // the initial render, we need to manually trigger a separate updateState to
  // send along the restoreScrollPosition
  // Set to true if we have `hydrationData` since we assume we were SSR'd and that
  // SSR did the initial scroll restoration.
  let initialScrollRestored = init.hydrationData != null;
  let initialMatches = matchRoutes(dataRoutes, init.history.location, basename);
  let initialErrors = null;
  if (initialMatches == null) {
    // If we do not match a user-provided-route, fall back to the root
    // to allow the error boundary to take over
    let error = getInternalRouterError(404, {
      pathname: init.history.location.pathname
    });
    let {
      matches,
      route
    } = getShortCircuitMatches(dataRoutes);
    initialMatches = matches;
    initialErrors = {
      [route.id]: error
    };
  }
  let initialized;
  let hasLazyRoutes = initialMatches.some(m => m.route.lazy);
  let hasLoaders = initialMatches.some(m => m.route.loader);
  if (hasLazyRoutes) {
    // All initialMatches need to be loaded before we're ready.  If we have lazy
    // functions around still then we'll need to run them in initialize()
    initialized = false;
  } else if (!hasLoaders) {
    // If we've got no loaders to run, then we're good to go
    initialized = true;
  } else if (future.v7_partialHydration) {
    // If partial hydration is enabled, we're initialized so long as we were
    // provided with hydrationData for every route with a loader, and no loaders
    // were marked for explicit hydration
    let loaderData = init.hydrationData ? init.hydrationData.loaderData : null;
    let errors = init.hydrationData ? init.hydrationData.errors : null;
    let isRouteInitialized = m => {
      // No loader, nothing to initialize
      if (!m.route.loader) {
        return true;
      }
      // Explicitly opting-in to running on hydration
      if (typeof m.route.loader === "function" && m.route.loader.hydrate === true) {
        return false;
      }
      // Otherwise, initialized if hydrated with data or an error
      return loaderData && loaderData[m.route.id] !== undefined || errors && errors[m.route.id] !== undefined;
    };
    // If errors exist, don't consider routes below the boundary
    if (errors) {
      let idx = initialMatches.findIndex(m => errors[m.route.id] !== undefined);
      initialized = initialMatches.slice(0, idx + 1).every(isRouteInitialized);
    } else {
      initialized = initialMatches.every(isRouteInitialized);
    }
  } else {
    // Without partial hydration - we're initialized if we were provided any
    // hydrationData - which is expected to be complete
    initialized = init.hydrationData != null;
  }
  let router;
  let state = {
    historyAction: init.history.action,
    location: init.history.location,
    matches: initialMatches,
    initialized,
    navigation: IDLE_NAVIGATION,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: init.hydrationData != null ? false : null,
    preventScrollReset: false,
    revalidation: "idle",
    loaderData: init.hydrationData && init.hydrationData.loaderData || {},
    actionData: init.hydrationData && init.hydrationData.actionData || null,
    errors: init.hydrationData && init.hydrationData.errors || initialErrors,
    fetchers: new Map(),
    blockers: new Map()
  };
  // -- Stateful internal variables to manage navigations --
  // Current navigation in progress (to be committed in completeNavigation)
  let pendingAction = Action.Pop;
  // Should the current navigation prevent the scroll reset if scroll cannot
  // be restored?
  let pendingPreventScrollReset = false;
  // AbortController for the active navigation
  let pendingNavigationController;
  // Should the current navigation enable document.startViewTransition?
  let pendingViewTransitionEnabled = false;
  // Store applied view transitions so we can apply them on POP
  let appliedViewTransitions = new Map();
  // Cleanup function for persisting applied transitions to sessionStorage
  let removePageHideEventListener = null;
  // We use this to avoid touching history in completeNavigation if a
  // revalidation is entirely uninterrupted
  let isUninterruptedRevalidation = false;
  // Use this internal flag to force revalidation of all loaders:
  //  - submissions (completed or interrupted)
  //  - useRevalidator()
  //  - X-Remix-Revalidate (from redirect)
  let isRevalidationRequired = false;
  // Use this internal array to capture routes that require revalidation due
  // to a cancelled deferred on action submission
  let cancelledDeferredRoutes = [];
  // Use this internal array to capture fetcher loads that were cancelled by an
  // action navigation and require revalidation
  let cancelledFetcherLoads = [];
  // AbortControllers for any in-flight fetchers
  let fetchControllers = new Map();
  // Track loads based on the order in which they started
  let incrementingLoadId = 0;
  // Track the outstanding pending navigation data load to be compared against
  // the globally incrementing load when a fetcher load lands after a completed
  // navigation
  let pendingNavigationLoadId = -1;
  // Fetchers that triggered data reloads as a result of their actions
  let fetchReloadIds = new Map();
  // Fetchers that triggered redirect navigations
  let fetchRedirectIds = new Set();
  // Most recent href/match for fetcher.load calls for fetchers
  let fetchLoadMatches = new Map();
  // Ref-count mounted fetchers so we know when it's ok to clean them up
  let activeFetchers = new Map();
  // Fetchers that have requested a delete when using v7_fetcherPersist,
  // they'll be officially removed after they return to idle
  let deletedFetchers = new Set();
  // Store DeferredData instances for active route matches.  When a
  // route loader returns defer() we stick one in here.  Then, when a nested
  // promise resolves we update loaderData.  If a new navigation starts we
  // cancel active deferreds for eliminated routes.
  let activeDeferreds = new Map();
  // Store blocker functions in a separate Map outside of router state since
  // we don't need to update UI state if they change
  let blockerFunctions = new Map();
  // Flag to ignore the next history update, so we can revert the URL change on
  // a POP navigation that was blocked by the user without touching router state
  let ignoreNextHistoryUpdate = false;
  // Initialize the router, all side effects should be kicked off from here.
  // Implemented as a Fluent API for ease of:
  //   let router = createRouter(init).initialize();
  function initialize() {
    // If history informs us of a POP navigation, start the navigation but do not update
    // state.  We'll update our own state once the navigation completes
    unlistenHistory = init.history.listen(_ref => {
      let {
        action: historyAction,
        location,
        delta
      } = _ref;
      // Ignore this event if it was just us resetting the URL from a
      // blocked POP navigation
      if (ignoreNextHistoryUpdate) {
        ignoreNextHistoryUpdate = false;
        return;
      }
      warning(blockerFunctions.size === 0 || delta != null, "You are trying to use a blocker on a POP navigation to a location " + "that was not created by @remix-run/router. This will fail silently in " + "production. This can happen if you are navigating outside the router " + "via `window.history.pushState`/`window.location.hash` instead of using " + "router navigation APIs.  This can also happen if you are using " + "createHashRouter and the user manually changes the URL.");
      let blockerKey = shouldBlockNavigation({
        currentLocation: state.location,
        nextLocation: location,
        historyAction
      });
      if (blockerKey && delta != null) {
        // Restore the URL to match the current UI, but don't update router state
        ignoreNextHistoryUpdate = true;
        init.history.go(delta * -1);
        // Put the blocker into a blocked state
        updateBlocker(blockerKey, {
          state: "blocked",
          location,
          proceed() {
            updateBlocker(blockerKey, {
              state: "proceeding",
              proceed: undefined,
              reset: undefined,
              location
            });
            // Re-do the same POP navigation we just blocked
            init.history.go(delta);
          },
          reset() {
            let blockers = new Map(state.blockers);
            blockers.set(blockerKey, IDLE_BLOCKER);
            updateState({
              blockers
            });
          }
        });
        return;
      }
      return startNavigation(historyAction, location);
    });
    if (isBrowser) {
      // FIXME: This feels gross.  How can we cleanup the lines between
      // scrollRestoration/appliedTransitions persistance?
      restoreAppliedTransitions(routerWindow, appliedViewTransitions);
      let _saveAppliedTransitions = () => persistAppliedTransitions(routerWindow, appliedViewTransitions);
      routerWindow.addEventListener("pagehide", _saveAppliedTransitions);
      removePageHideEventListener = () => routerWindow.removeEventListener("pagehide", _saveAppliedTransitions);
    }
    // Kick off initial data load if needed.  Use Pop to avoid modifying history
    // Note we don't do any handling of lazy here.  For SPA's it'll get handled
    // in the normal navigation flow.  For SSR it's expected that lazy modules are
    // resolved prior to router creation since we can't go into a fallbackElement
    // UI for SSR'd apps
    if (!state.initialized) {
      startNavigation(Action.Pop, state.location, {
        initialHydration: true
      });
    }
    return router;
  }
  // Clean up a router and it's side effects
  function dispose() {
    if (unlistenHistory) {
      unlistenHistory();
    }
    if (removePageHideEventListener) {
      removePageHideEventListener();
    }
    subscribers.clear();
    pendingNavigationController && pendingNavigationController.abort();
    state.fetchers.forEach((_, key) => deleteFetcher(key));
    state.blockers.forEach((_, key) => deleteBlocker(key));
  }
  // Subscribe to state updates for the router
  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }
  // Update our state and notify the calling context of the change
  function updateState(newState, opts) {
    if (opts === void 0) {
      opts = {};
    }
    state = _extends$2({}, state, newState);
    // Prep fetcher cleanup so we can tell the UI which fetcher data entries
    // can be removed
    let completedFetchers = [];
    let deletedFetchersKeys = [];
    if (future.v7_fetcherPersist) {
      state.fetchers.forEach((fetcher, key) => {
        if (fetcher.state === "idle") {
          if (deletedFetchers.has(key)) {
            // Unmounted from the UI and can be totally removed
            deletedFetchersKeys.push(key);
          } else {
            // Returned to idle but still mounted in the UI, so semi-remains for
            // revalidations and such
            completedFetchers.push(key);
          }
        }
      });
    }
    // Iterate over a local copy so that if flushSync is used and we end up
    // removing and adding a new subscriber due to the useCallback dependencies,
    // we don't get ourselves into a loop calling the new subscriber immediately
    [...subscribers].forEach(subscriber => subscriber(state, {
      deletedFetchers: deletedFetchersKeys,
      unstable_viewTransitionOpts: opts.viewTransitionOpts,
      unstable_flushSync: opts.flushSync === true
    }));
    // Remove idle fetchers from state since we only care about in-flight fetchers.
    if (future.v7_fetcherPersist) {
      completedFetchers.forEach(key => state.fetchers.delete(key));
      deletedFetchersKeys.forEach(key => deleteFetcher(key));
    }
  }
  // Complete a navigation returning the state.navigation back to the IDLE_NAVIGATION
  // and setting state.[historyAction/location/matches] to the new route.
  // - Location is a required param
  // - Navigation will always be set to IDLE_NAVIGATION
  // - Can pass any other state in newState
  function completeNavigation(location, newState, _temp) {
    var _location$state, _location$state2;
    let {
      flushSync
    } = _temp === void 0 ? {} : _temp;
    // Deduce if we're in a loading/actionReload state:
    // - We have committed actionData in the store
    // - The current navigation was a mutation submission
    // - We're past the submitting state and into the loading state
    // - The location being loaded is not the result of a redirect
    let isActionReload = state.actionData != null && state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && state.navigation.state === "loading" && ((_location$state = location.state) == null ? void 0 : _location$state._isRedirect) !== true;
    let actionData;
    if (newState.actionData) {
      if (Object.keys(newState.actionData).length > 0) {
        actionData = newState.actionData;
      } else {
        // Empty actionData -> clear prior actionData due to an action error
        actionData = null;
      }
    } else if (isActionReload) {
      // Keep the current data if we're wrapping up the action reload
      actionData = state.actionData;
    } else {
      // Clear actionData on any other completed navigations
      actionData = null;
    }
    // Always preserve any existing loaderData from re-used routes
    let loaderData = newState.loaderData ? mergeLoaderData(state.loaderData, newState.loaderData, newState.matches || [], newState.errors) : state.loaderData;
    // On a successful navigation we can assume we got through all blockers
    // so we can start fresh
    let blockers = state.blockers;
    if (blockers.size > 0) {
      blockers = new Map(blockers);
      blockers.forEach((_, k) => blockers.set(k, IDLE_BLOCKER));
    }
    // Always respect the user flag.  Otherwise don't reset on mutation
    // submission navigations unless they redirect
    let preventScrollReset = pendingPreventScrollReset === true || state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && ((_location$state2 = location.state) == null ? void 0 : _location$state2._isRedirect) !== true;
    if (inFlightDataRoutes) {
      dataRoutes = inFlightDataRoutes;
      inFlightDataRoutes = undefined;
    }
    if (isUninterruptedRevalidation) ; else if (pendingAction === Action.Pop) ; else if (pendingAction === Action.Push) {
      init.history.push(location, location.state);
    } else if (pendingAction === Action.Replace) {
      init.history.replace(location, location.state);
    }
    let viewTransitionOpts;
    // On POP, enable transitions if they were enabled on the original navigation
    if (pendingAction === Action.Pop) {
      // Forward takes precedence so they behave like the original navigation
      let priorPaths = appliedViewTransitions.get(state.location.pathname);
      if (priorPaths && priorPaths.has(location.pathname)) {
        viewTransitionOpts = {
          currentLocation: state.location,
          nextLocation: location
        };
      } else if (appliedViewTransitions.has(location.pathname)) {
        // If we don't have a previous forward nav, assume we're popping back to
        // the new location and enable if that location previously enabled
        viewTransitionOpts = {
          currentLocation: location,
          nextLocation: state.location
        };
      }
    } else if (pendingViewTransitionEnabled) {
      // Store the applied transition on PUSH/REPLACE
      let toPaths = appliedViewTransitions.get(state.location.pathname);
      if (toPaths) {
        toPaths.add(location.pathname);
      } else {
        toPaths = new Set([location.pathname]);
        appliedViewTransitions.set(state.location.pathname, toPaths);
      }
      viewTransitionOpts = {
        currentLocation: state.location,
        nextLocation: location
      };
    }
    updateState(_extends$2({}, newState, {
      actionData,
      loaderData,
      historyAction: pendingAction,
      location,
      initialized: true,
      navigation: IDLE_NAVIGATION,
      revalidation: "idle",
      restoreScrollPosition: getSavedScrollPosition(location, newState.matches || state.matches),
      preventScrollReset,
      blockers
    }), {
      viewTransitionOpts,
      flushSync: flushSync === true
    });
    // Reset stateful navigation vars
    pendingAction = Action.Pop;
    pendingPreventScrollReset = false;
    pendingViewTransitionEnabled = false;
    isUninterruptedRevalidation = false;
    isRevalidationRequired = false;
    cancelledDeferredRoutes = [];
    cancelledFetcherLoads = [];
  }
  // Trigger a navigation event, which can either be a numerical POP or a PUSH
  // replace with an optional submission
  async function navigate(to, opts) {
    if (typeof to === "number") {
      init.history.go(to);
      return;
    }
    let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, to, future.v7_relativeSplatPath, opts == null ? void 0 : opts.fromRouteId, opts == null ? void 0 : opts.relative);
    let {
      path,
      submission,
      error
    } = normalizeNavigateOptions(future.v7_normalizeFormMethod, false, normalizedPath, opts);
    let currentLocation = state.location;
    let nextLocation = createLocation(state.location, path, opts && opts.state);
    // When using navigate as a PUSH/REPLACE we aren't reading an already-encoded
    // URL from window.location, so we need to encode it here so the behavior
    // remains the same as POP and non-data-router usages.  new URL() does all
    // the same encoding we'd get from a history.pushState/window.location read
    // without having to touch history
    nextLocation = _extends$2({}, nextLocation, init.history.encodeLocation(nextLocation));
    let userReplace = opts && opts.replace != null ? opts.replace : undefined;
    let historyAction = Action.Push;
    if (userReplace === true) {
      historyAction = Action.Replace;
    } else if (userReplace === false) ; else if (submission != null && isMutationMethod(submission.formMethod) && submission.formAction === state.location.pathname + state.location.search) {
      // By default on submissions to the current location we REPLACE so that
      // users don't have to double-click the back button to get to the prior
      // location.  If the user redirects to a different location from the
      // action/loader this will be ignored and the redirect will be a PUSH
      historyAction = Action.Replace;
    }
    let preventScrollReset = opts && "preventScrollReset" in opts ? opts.preventScrollReset === true : undefined;
    let flushSync = (opts && opts.unstable_flushSync) === true;
    let blockerKey = shouldBlockNavigation({
      currentLocation,
      nextLocation,
      historyAction
    });
    if (blockerKey) {
      // Put the blocker into a blocked state
      updateBlocker(blockerKey, {
        state: "blocked",
        location: nextLocation,
        proceed() {
          updateBlocker(blockerKey, {
            state: "proceeding",
            proceed: undefined,
            reset: undefined,
            location: nextLocation
          });
          // Send the same navigation through
          navigate(to, opts);
        },
        reset() {
          let blockers = new Map(state.blockers);
          blockers.set(blockerKey, IDLE_BLOCKER);
          updateState({
            blockers
          });
        }
      });
      return;
    }
    return await startNavigation(historyAction, nextLocation, {
      submission,
      // Send through the formData serialization error if we have one so we can
      // render at the right error boundary after we match routes
      pendingError: error,
      preventScrollReset,
      replace: opts && opts.replace,
      enableViewTransition: opts && opts.unstable_viewTransition,
      flushSync
    });
  }
  // Revalidate all current loaders.  If a navigation is in progress or if this
  // is interrupted by a navigation, allow this to "succeed" by calling all
  // loaders during the next loader round
  function revalidate() {
    interruptActiveLoads();
    updateState({
      revalidation: "loading"
    });
    // If we're currently submitting an action, we don't need to start a new
    // navigation, we'll just let the follow up loader execution call all loaders
    if (state.navigation.state === "submitting") {
      return;
    }
    // If we're currently in an idle state, start a new navigation for the current
    // action/location and mark it as uninterrupted, which will skip the history
    // update in completeNavigation
    if (state.navigation.state === "idle") {
      startNavigation(state.historyAction, state.location, {
        startUninterruptedRevalidation: true
      });
      return;
    }
    // Otherwise, if we're currently in a loading state, just start a new
    // navigation to the navigation.location but do not trigger an uninterrupted
    // revalidation so that history correctly updates once the navigation completes
    startNavigation(pendingAction || state.historyAction, state.navigation.location, {
      overrideNavigation: state.navigation
    });
  }
  // Start a navigation to the given action/location.  Can optionally provide a
  // overrideNavigation which will override the normalLoad in the case of a redirect
  // navigation
  async function startNavigation(historyAction, location, opts) {
    // Abort any in-progress navigations and start a new one. Unset any ongoing
    // uninterrupted revalidations unless told otherwise, since we want this
    // new navigation to update history normally
    pendingNavigationController && pendingNavigationController.abort();
    pendingNavigationController = null;
    pendingAction = historyAction;
    isUninterruptedRevalidation = (opts && opts.startUninterruptedRevalidation) === true;
    // Save the current scroll position every time we start a new navigation,
    // and track whether we should reset scroll on completion
    saveScrollPosition(state.location, state.matches);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    pendingViewTransitionEnabled = (opts && opts.enableViewTransition) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let loadingNavigation = opts && opts.overrideNavigation;
    let matches = matchRoutes(routesToUse, location, basename);
    let flushSync = (opts && opts.flushSync) === true;
    // Short circuit with a 404 on the root error boundary if we match nothing
    if (!matches) {
      let error = getInternalRouterError(404, {
        pathname: location.pathname
      });
      let {
        matches: notFoundMatches,
        route
      } = getShortCircuitMatches(routesToUse);
      // Cancel all pending deferred on 404s since we don't keep any routes
      cancelActiveDeferreds();
      completeNavigation(location, {
        matches: notFoundMatches,
        loaderData: {},
        errors: {
          [route.id]: error
        }
      }, {
        flushSync
      });
      return;
    }
    // Short circuit if it's only a hash change and not a revalidation or
    // mutation submission.
    //
    // Ignore on initial page loads because since the initial load will always
    // be "same hash".  For example, on /page#hash and submit a <Form method="post">
    // which will default to a navigation to /page
    if (state.initialized && !isRevalidationRequired && isHashChangeOnly(state.location, location) && !(opts && opts.submission && isMutationMethod(opts.submission.formMethod))) {
      completeNavigation(location, {
        matches
      }, {
        flushSync
      });
      return;
    }
    // Create a controller/Request for this navigation
    pendingNavigationController = new AbortController();
    let request = createClientSideRequest(init.history, location, pendingNavigationController.signal, opts && opts.submission);
    let pendingActionResult;
    if (opts && opts.pendingError) {
      // If we have a pendingError, it means the user attempted a GET submission
      // with binary FormData so assign here and skip to handleLoaders.  That
      // way we handle calling loaders above the boundary etc.  It's not really
      // different from an actionError in that sense.
      pendingActionResult = [findNearestBoundary(matches).route.id, {
        type: ResultType.error,
        error: opts.pendingError
      }];
    } else if (opts && opts.submission && isMutationMethod(opts.submission.formMethod)) {
      // Call action if we received an action submission
      let actionResult = await handleAction(request, location, opts.submission, matches, {
        replace: opts.replace,
        flushSync
      });
      if (actionResult.shortCircuited) {
        return;
      }
      pendingActionResult = actionResult.pendingActionResult;
      loadingNavigation = getLoadingNavigation(location, opts.submission);
      flushSync = false;
      // Create a GET request for the loaders
      request = createClientSideRequest(init.history, request.url, request.signal);
    }
    // Call loaders
    let {
      shortCircuited,
      loaderData,
      errors
    } = await handleLoaders(request, location, matches, loadingNavigation, opts && opts.submission, opts && opts.fetcherSubmission, opts && opts.replace, opts && opts.initialHydration === true, flushSync, pendingActionResult);
    if (shortCircuited) {
      return;
    }
    // Clean up now that the action/loaders have completed.  Don't clean up if
    // we short circuited because pendingNavigationController will have already
    // been assigned to a new controller for the next navigation
    pendingNavigationController = null;
    completeNavigation(location, _extends$2({
      matches
    }, getActionDataForCommit(pendingActionResult), {
      loaderData,
      errors
    }));
  }
  // Call the action matched by the leaf route for this navigation and handle
  // redirects/errors
  async function handleAction(request, location, submission, matches, opts) {
    if (opts === void 0) {
      opts = {};
    }
    interruptActiveLoads();
    // Put us in a submitting state
    let navigation = getSubmittingNavigation(location, submission);
    updateState({
      navigation
    }, {
      flushSync: opts.flushSync === true
    });
    // Call our action and get the result
    let result;
    let actionMatch = getTargetMatch(matches, location);
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      result = {
        type: ResultType.error,
        error: getInternalRouterError(405, {
          method: request.method,
          pathname: location.pathname,
          routeId: actionMatch.route.id
        })
      };
    } else {
      let results = await callDataStrategy("action", request, [actionMatch], matches);
      result = results[0];
      if (request.signal.aborted) {
        return {
          shortCircuited: true
        };
      }
    }
    if (isRedirectResult(result)) {
      let replace;
      if (opts && opts.replace != null) {
        replace = opts.replace;
      } else {
        // If the user didn't explicity indicate replace behavior, replace if
        // we redirected to the exact same location we're currently at to avoid
        // double back-buttons
        let location = normalizeRedirectLocation(result.response.headers.get("Location"), new URL(request.url), basename);
        replace = location === state.location.pathname + state.location.search;
      }
      await startRedirectNavigation(request, result, {
        submission,
        replace
      });
      return {
        shortCircuited: true
      };
    }
    if (isDeferredResult(result)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    if (isErrorResult(result)) {
      // Store off the pending error - we use it to determine which loaders
      // to call and will commit it when we complete the navigation
      let boundaryMatch = findNearestBoundary(matches, actionMatch.route.id);
      // By default, all submissions are REPLACE navigations, but if the
      // action threw an error that'll be rendered in an errorElement, we fall
      // back to PUSH so that the user can use the back button to get back to
      // the pre-submission form location to try again
      if ((opts && opts.replace) !== true) {
        pendingAction = Action.Push;
      }
      return {
        pendingActionResult: [boundaryMatch.route.id, result]
      };
    }
    return {
      pendingActionResult: [actionMatch.route.id, result]
    };
  }
  // Call all applicable loaders for the given matches, handling redirects,
  // errors, etc.
  async function handleLoaders(request, location, matches, overrideNavigation, submission, fetcherSubmission, replace, initialHydration, flushSync, pendingActionResult) {
    // Figure out the right navigation we want to use for data loading
    let loadingNavigation = overrideNavigation || getLoadingNavigation(location, submission);
    // If this was a redirect from an action we don't have a "submission" but
    // we have it on the loading navigation so use that if available
    let activeSubmission = submission || fetcherSubmission || getSubmissionFromNavigation(loadingNavigation);
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, activeSubmission, location, future.v7_partialHydration && initialHydration === true, future.unstable_skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionResult);
    // Cancel pending deferreds for no-longer-matched routes or routes we're
    // about to reload.  Note that if this is an action reload we would have
    // already cancelled all pending deferreds so this would be a no-op
    cancelActiveDeferreds(routeId => !(matches && matches.some(m => m.route.id === routeId)) || matchesToLoad && matchesToLoad.some(m => m.route.id === routeId));
    pendingNavigationLoadId = ++incrementingLoadId;
    // Short circuit if we have no loaders to run
    if (matchesToLoad.length === 0 && revalidatingFetchers.length === 0) {
      let updatedFetchers = markFetchRedirectsDone();
      completeNavigation(location, _extends$2({
        matches,
        loaderData: {},
        // Commit pending error if we're short circuiting
        errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? {
          [pendingActionResult[0]]: pendingActionResult[1].error
        } : null
      }, getActionDataForCommit(pendingActionResult), updatedFetchers ? {
        fetchers: new Map(state.fetchers)
      } : {}), {
        flushSync
      });
      return {
        shortCircuited: true
      };
    }
    // If this is an uninterrupted revalidation, we remain in our current idle
    // state.  If not, we need to switch to our loading state and load data,
    // preserving any new action data or existing action data (in the case of
    // a revalidation interrupting an actionReload)
    // If we have partialHydration enabled, then don't update the state for the
    // initial data load since it's not a "navigation"
    if (!isUninterruptedRevalidation && (!future.v7_partialHydration || !initialHydration)) {
      revalidatingFetchers.forEach(rf => {
        let fetcher = state.fetchers.get(rf.key);
        let revalidatingFetcher = getLoadingFetcher(undefined, fetcher ? fetcher.data : undefined);
        state.fetchers.set(rf.key, revalidatingFetcher);
      });
      let actionData;
      if (pendingActionResult && !isErrorResult(pendingActionResult[1])) {
        // This is cast to `any` currently because `RouteData`uses any and it
        // would be a breaking change to use any.
        // TODO: v7 - change `RouteData` to use `unknown` instead of `any`
        actionData = {
          [pendingActionResult[0]]: pendingActionResult[1].data
        };
      } else if (state.actionData) {
        if (Object.keys(state.actionData).length === 0) {
          actionData = null;
        } else {
          actionData = state.actionData;
        }
      }
      updateState(_extends$2({
        navigation: loadingNavigation
      }, actionData !== undefined ? {
        actionData
      } : {}, revalidatingFetchers.length > 0 ? {
        fetchers: new Map(state.fetchers)
      } : {}), {
        flushSync
      });
    }
    revalidatingFetchers.forEach(rf => {
      if (fetchControllers.has(rf.key)) {
        abortFetcher(rf.key);
      }
      if (rf.controller) {
        // Fetchers use an independent AbortController so that aborting a fetcher
        // (via deleteFetcher) does not abort the triggering navigation that
        // triggered the revalidation
        fetchControllers.set(rf.key, rf.controller);
      }
    });
    // Proxy navigation abort through to revalidation fetchers
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach(f => abortFetcher(f.key));
    if (pendingNavigationController) {
      pendingNavigationController.signal.addEventListener("abort", abortPendingFetchRevalidations);
    }
    let {
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state.matches, matches, matchesToLoad, revalidatingFetchers, request);
    if (request.signal.aborted) {
      return {
        shortCircuited: true
      };
    }
    // Clean up _after_ loaders have completed.  Don't clean up if we short
    // circuited because fetchControllers would have been aborted and
    // reassigned to new controllers for the next navigation
    if (pendingNavigationController) {
      pendingNavigationController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
    }
    revalidatingFetchers.forEach(rf => fetchControllers.delete(rf.key));
    // If any loaders returned a redirect Response, start a new REPLACE navigation
    let redirect = findRedirect([...loaderResults, ...fetcherResults]);
    if (redirect) {
      if (redirect.idx >= matchesToLoad.length) {
        // If this redirect came from a fetcher make sure we mark it in
        // fetchRedirectIds so it doesn't get revalidated on the next set of
        // loader executions
        let fetcherKey = revalidatingFetchers[redirect.idx - matchesToLoad.length].key;
        fetchRedirectIds.add(fetcherKey);
      }
      await startRedirectNavigation(request, redirect.result, {
        replace
      });
      return {
        shortCircuited: true
      };
    }
    // Process and commit output from loaders
    let {
      loaderData,
      errors
    } = processLoaderData(state, matches, matchesToLoad, loaderResults, pendingActionResult, revalidatingFetchers, fetcherResults, activeDeferreds);
    // Wire up subscribers to update loaderData as promises settle
    activeDeferreds.forEach((deferredData, routeId) => {
      deferredData.subscribe(aborted => {
        // Note: No need to updateState here since the TrackedPromise on
        // loaderData is stable across resolve/reject
        // Remove this instance if we were aborted or if promises have settled
        if (aborted || deferredData.done) {
          activeDeferreds.delete(routeId);
        }
      });
    });
    // During partial hydration, preserve SSR errors for routes that don't re-run
    if (future.v7_partialHydration && initialHydration && state.errors) {
      Object.entries(state.errors).filter(_ref2 => {
        let [id] = _ref2;
        return !matchesToLoad.some(m => m.route.id === id);
      }).forEach(_ref3 => {
        let [routeId, error] = _ref3;
        errors = Object.assign(errors || {}, {
          [routeId]: error
        });
      });
    }
    let updatedFetchers = markFetchRedirectsDone();
    let didAbortFetchLoads = abortStaleFetchLoads(pendingNavigationLoadId);
    let shouldUpdateFetchers = updatedFetchers || didAbortFetchLoads || revalidatingFetchers.length > 0;
    return _extends$2({
      loaderData,
      errors
    }, shouldUpdateFetchers ? {
      fetchers: new Map(state.fetchers)
    } : {});
  }
  // Trigger a fetcher load/submit for the given fetcher key
  function fetch(key, routeId, href, opts) {
    if (isServer) {
      throw new Error("router.fetch() was called during the server render, but it shouldn't be. " + "You are likely calling a useFetcher() method in the body of your component. " + "Try moving it to a useEffect or a callback.");
    }
    if (fetchControllers.has(key)) abortFetcher(key);
    let flushSync = (opts && opts.unstable_flushSync) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, href, future.v7_relativeSplatPath, routeId, opts == null ? void 0 : opts.relative);
    let matches = matchRoutes(routesToUse, normalizedPath, basename);
    if (!matches) {
      setFetcherError(key, routeId, getInternalRouterError(404, {
        pathname: normalizedPath
      }), {
        flushSync
      });
      return;
    }
    let {
      path,
      submission,
      error
    } = normalizeNavigateOptions(future.v7_normalizeFormMethod, true, normalizedPath, opts);
    if (error) {
      setFetcherError(key, routeId, error, {
        flushSync
      });
      return;
    }
    let match = getTargetMatch(matches, path);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    if (submission && isMutationMethod(submission.formMethod)) {
      handleFetcherAction(key, routeId, path, match, matches, flushSync, submission);
      return;
    }
    // Store off the match so we can call it's shouldRevalidate on subsequent
    // revalidations
    fetchLoadMatches.set(key, {
      routeId,
      path
    });
    handleFetcherLoader(key, routeId, path, match, matches, flushSync, submission);
  }
  // Call the action for the matched fetcher.submit(), and then handle redirects,
  // errors, and revalidation
  async function handleFetcherAction(key, routeId, path, match, requestMatches, flushSync, submission) {
    interruptActiveLoads();
    fetchLoadMatches.delete(key);
    if (!match.route.action && !match.route.lazy) {
      let error = getInternalRouterError(405, {
        method: submission.formMethod,
        pathname: path,
        routeId: routeId
      });
      setFetcherError(key, routeId, error, {
        flushSync
      });
      return;
    }
    // Put this fetcher into it's submitting state
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getSubmittingFetcher(submission, existingFetcher), {
      flushSync
    });
    // Call the action for the fetcher
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal, submission);
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let actionResults = await callDataStrategy("action", fetchRequest, [match], requestMatches);
    let actionResult = actionResults[0];
    if (fetchRequest.signal.aborted) {
      // We can delete this so long as we weren't aborted by our own fetcher
      // re-submit which would have put _new_ controller is in fetchControllers
      if (fetchControllers.get(key) === abortController) {
        fetchControllers.delete(key);
      }
      return;
    }
    // When using v7_fetcherPersist, we don't want errors bubbling up to the UI
    // or redirects processed for unmounted fetchers so we just revert them to
    // idle
    if (future.v7_fetcherPersist && deletedFetchers.has(key)) {
      if (isRedirectResult(actionResult) || isErrorResult(actionResult)) {
        updateFetcherState(key, getDoneFetcher(undefined));
        return;
      }
      // Let SuccessResult's fall through for revalidation
    } else {
      if (isRedirectResult(actionResult)) {
        fetchControllers.delete(key);
        if (pendingNavigationLoadId > originatingLoadId) {
          // A new navigation was kicked off after our action started, so that
          // should take precedence over this redirect navigation.  We already
          // set isRevalidationRequired so all loaders for the new route should
          // fire unless opted out via shouldRevalidate
          updateFetcherState(key, getDoneFetcher(undefined));
          return;
        } else {
          fetchRedirectIds.add(key);
          updateFetcherState(key, getLoadingFetcher(submission));
          return startRedirectNavigation(fetchRequest, actionResult, {
            fetcherSubmission: submission
          });
        }
      }
      // Process any non-redirect errors thrown
      if (isErrorResult(actionResult)) {
        setFetcherError(key, routeId, actionResult.error);
        return;
      }
    }
    if (isDeferredResult(actionResult)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    // Start the data load for current matches, or the next location if we're
    // in the middle of a navigation
    let nextLocation = state.navigation.location || state.location;
    let revalidationRequest = createClientSideRequest(init.history, nextLocation, abortController.signal);
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let matches = state.navigation.state !== "idle" ? matchRoutes(routesToUse, state.navigation.location, basename) : state.matches;
    invariant(matches, "Didn't find any matches after fetcher action");
    let loadId = ++incrementingLoadId;
    fetchReloadIds.set(key, loadId);
    let loadFetcher = getLoadingFetcher(submission, actionResult.data);
    state.fetchers.set(key, loadFetcher);
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, submission, nextLocation, false, future.unstable_skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, [match.route.id, actionResult]);
    // Put all revalidating fetchers into the loading state, except for the
    // current fetcher which we want to keep in it's current loading state which
    // contains it's action submission info + action data
    revalidatingFetchers.filter(rf => rf.key !== key).forEach(rf => {
      let staleKey = rf.key;
      let existingFetcher = state.fetchers.get(staleKey);
      let revalidatingFetcher = getLoadingFetcher(undefined, existingFetcher ? existingFetcher.data : undefined);
      state.fetchers.set(staleKey, revalidatingFetcher);
      if (fetchControllers.has(staleKey)) {
        abortFetcher(staleKey);
      }
      if (rf.controller) {
        fetchControllers.set(staleKey, rf.controller);
      }
    });
    updateState({
      fetchers: new Map(state.fetchers)
    });
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach(rf => abortFetcher(rf.key));
    abortController.signal.addEventListener("abort", abortPendingFetchRevalidations);
    let {
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state.matches, matches, matchesToLoad, revalidatingFetchers, revalidationRequest);
    if (abortController.signal.aborted) {
      return;
    }
    abortController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
    fetchReloadIds.delete(key);
    fetchControllers.delete(key);
    revalidatingFetchers.forEach(r => fetchControllers.delete(r.key));
    let redirect = findRedirect([...loaderResults, ...fetcherResults]);
    if (redirect) {
      if (redirect.idx >= matchesToLoad.length) {
        // If this redirect came from a fetcher make sure we mark it in
        // fetchRedirectIds so it doesn't get revalidated on the next set of
        // loader executions
        let fetcherKey = revalidatingFetchers[redirect.idx - matchesToLoad.length].key;
        fetchRedirectIds.add(fetcherKey);
      }
      return startRedirectNavigation(revalidationRequest, redirect.result);
    }
    // Process and commit output from loaders
    let {
      loaderData,
      errors
    } = processLoaderData(state, state.matches, matchesToLoad, loaderResults, undefined, revalidatingFetchers, fetcherResults, activeDeferreds);
    // Since we let revalidations complete even if the submitting fetcher was
    // deleted, only put it back to idle if it hasn't been deleted
    if (state.fetchers.has(key)) {
      let doneFetcher = getDoneFetcher(actionResult.data);
      state.fetchers.set(key, doneFetcher);
    }
    abortStaleFetchLoads(loadId);
    // If we are currently in a navigation loading state and this fetcher is
    // more recent than the navigation, we want the newer data so abort the
    // navigation and complete it with the fetcher data
    if (state.navigation.state === "loading" && loadId > pendingNavigationLoadId) {
      invariant(pendingAction, "Expected pending action");
      pendingNavigationController && pendingNavigationController.abort();
      completeNavigation(state.navigation.location, {
        matches,
        loaderData,
        errors,
        fetchers: new Map(state.fetchers)
      });
    } else {
      // otherwise just update with the fetcher data, preserving any existing
      // loaderData for loaders that did not need to reload.  We have to
      // manually merge here since we aren't going through completeNavigation
      updateState({
        errors,
        loaderData: mergeLoaderData(state.loaderData, loaderData, matches, errors),
        fetchers: new Map(state.fetchers)
      });
      isRevalidationRequired = false;
    }
  }
  // Call the matched loader for fetcher.load(), handling redirects, errors, etc.
  async function handleFetcherLoader(key, routeId, path, match, matches, flushSync, submission) {
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getLoadingFetcher(submission, existingFetcher ? existingFetcher.data : undefined), {
      flushSync
    });
    // Call the loader for this fetcher route match
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal);
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let results = await callDataStrategy("loader", fetchRequest, [match], matches);
    let result = results[0];
    // Deferred isn't supported for fetcher loads, await everything and treat it
    // as a normal load.  resolveDeferredData will return undefined if this
    // fetcher gets aborted, so we just leave result untouched and short circuit
    // below if that happens
    if (isDeferredResult(result)) {
      result = (await resolveDeferredData(result, fetchRequest.signal, true)) || result;
    }
    // We can delete this so long as we weren't aborted by our our own fetcher
    // re-load which would have put _new_ controller is in fetchControllers
    if (fetchControllers.get(key) === abortController) {
      fetchControllers.delete(key);
    }
    if (fetchRequest.signal.aborted) {
      return;
    }
    // We don't want errors bubbling up or redirects followed for unmounted
    // fetchers, so short circuit here if it was removed from the UI
    if (deletedFetchers.has(key)) {
      updateFetcherState(key, getDoneFetcher(undefined));
      return;
    }
    // If the loader threw a redirect Response, start a new REPLACE navigation
    if (isRedirectResult(result)) {
      if (pendingNavigationLoadId > originatingLoadId) {
        // A new navigation was kicked off after our loader started, so that
        // should take precedence over this redirect navigation
        updateFetcherState(key, getDoneFetcher(undefined));
        return;
      } else {
        fetchRedirectIds.add(key);
        await startRedirectNavigation(fetchRequest, result);
        return;
      }
    }
    // Process any non-redirect errors thrown
    if (isErrorResult(result)) {
      setFetcherError(key, routeId, result.error);
      return;
    }
    invariant(!isDeferredResult(result), "Unhandled fetcher deferred data");
    // Put the fetcher back into an idle state
    updateFetcherState(key, getDoneFetcher(result.data));
  }
  /**
   * Utility function to handle redirects returned from an action or loader.
   * Normally, a redirect "replaces" the navigation that triggered it.  So, for
   * example:
   *
   *  - user is on /a
   *  - user clicks a link to /b
   *  - loader for /b redirects to /c
   *
   * In a non-JS app the browser would track the in-flight navigation to /b and
   * then replace it with /c when it encountered the redirect response.  In
   * the end it would only ever update the URL bar with /c.
   *
   * In client-side routing using pushState/replaceState, we aim to emulate
   * this behavior and we also do not update history until the end of the
   * navigation (including processed redirects).  This means that we never
   * actually touch history until we've processed redirects, so we just use
   * the history action from the original navigation (PUSH or REPLACE).
   */
  async function startRedirectNavigation(request, redirect, _temp2) {
    let {
      submission,
      fetcherSubmission,
      replace
    } = _temp2 === void 0 ? {} : _temp2;
    if (redirect.response.headers.has("X-Remix-Revalidate")) {
      isRevalidationRequired = true;
    }
    let location = redirect.response.headers.get("Location");
    invariant(location, "Expected a Location header on the redirect Response");
    location = normalizeRedirectLocation(location, new URL(request.url), basename);
    let redirectLocation = createLocation(state.location, location, {
      _isRedirect: true
    });
    if (isBrowser) {
      let isDocumentReload = false;
      if (redirect.response.headers.has("X-Remix-Reload-Document")) {
        // Hard reload if the response contained X-Remix-Reload-Document
        isDocumentReload = true;
      } else if (ABSOLUTE_URL_REGEX$1.test(location)) {
        const url = init.history.createURL(location);
        isDocumentReload =
        // Hard reload if it's an absolute URL to a new origin
        url.origin !== routerWindow.location.origin ||
        // Hard reload if it's an absolute URL that does not match our basename
        stripBasename(url.pathname, basename) == null;
      }
      if (isDocumentReload) {
        if (replace) {
          routerWindow.location.replace(location);
        } else {
          routerWindow.location.assign(location);
        }
        return;
      }
    }
    // There's no need to abort on redirects, since we don't detect the
    // redirect until the action/loaders have settled
    pendingNavigationController = null;
    let redirectHistoryAction = replace === true ? Action.Replace : Action.Push;
    // Use the incoming submission if provided, fallback on the active one in
    // state.navigation
    let {
      formMethod,
      formAction,
      formEncType
    } = state.navigation;
    if (!submission && !fetcherSubmission && formMethod && formAction && formEncType) {
      submission = getSubmissionFromNavigation(state.navigation);
    }
    // If this was a 307/308 submission we want to preserve the HTTP method and
    // re-submit the GET/POST/PUT/PATCH/DELETE as a submission navigation to the
    // redirected location
    let activeSubmission = submission || fetcherSubmission;
    if (redirectPreserveMethodStatusCodes.has(redirect.response.status) && activeSubmission && isMutationMethod(activeSubmission.formMethod)) {
      await startNavigation(redirectHistoryAction, redirectLocation, {
        submission: _extends$2({}, activeSubmission, {
          formAction: location
        }),
        // Preserve this flag across redirects
        preventScrollReset: pendingPreventScrollReset
      });
    } else {
      // If we have a navigation submission, we will preserve it through the
      // redirect navigation
      let overrideNavigation = getLoadingNavigation(redirectLocation, submission);
      await startNavigation(redirectHistoryAction, redirectLocation, {
        overrideNavigation,
        // Send fetcher submissions through for shouldRevalidate
        fetcherSubmission,
        // Preserve this flag across redirects
        preventScrollReset: pendingPreventScrollReset
      });
    }
  }
  // Utility wrapper for calling dataStrategy client-side without having to
  // pass around the manifest, mapRouteProperties, etc.
  async function callDataStrategy(type, request, matchesToLoad, matches) {
    try {
      let results = await callDataStrategyImpl(dataStrategyImpl, type, request, matchesToLoad, matches, manifest, mapRouteProperties);
      return await Promise.all(results.map((result, i) => {
        if (isRedirectHandlerResult(result)) {
          let response = result.result;
          return {
            type: ResultType.redirect,
            response: normalizeRelativeRoutingRedirectResponse(response, request, matchesToLoad[i].route.id, matches, basename, future.v7_relativeSplatPath)
          };
        }
        return convertHandlerResultToDataResult(result);
      }));
    } catch (e) {
      // If the outer dataStrategy method throws, just return the error for all
      // matches - and it'll naturally bubble to the root
      return matchesToLoad.map(() => ({
        type: ResultType.error,
        error: e
      }));
    }
  }
  async function callLoadersAndMaybeResolveData(currentMatches, matches, matchesToLoad, fetchersToLoad, request) {
    let [loaderResults, ...fetcherResults] = await Promise.all([matchesToLoad.length ? callDataStrategy("loader", request, matchesToLoad, matches) : [], ...fetchersToLoad.map(f => {
      if (f.matches && f.match && f.controller) {
        let fetcherRequest = createClientSideRequest(init.history, f.path, f.controller.signal);
        return callDataStrategy("loader", fetcherRequest, [f.match], f.matches).then(r => r[0]);
      } else {
        return Promise.resolve({
          type: ResultType.error,
          error: getInternalRouterError(404, {
            pathname: f.path
          })
        });
      }
    })]);
    await Promise.all([resolveDeferredResults(currentMatches, matchesToLoad, loaderResults, loaderResults.map(() => request.signal), false, state.loaderData), resolveDeferredResults(currentMatches, fetchersToLoad.map(f => f.match), fetcherResults, fetchersToLoad.map(f => f.controller ? f.controller.signal : null), true)]);
    return {
      loaderResults,
      fetcherResults
    };
  }
  function interruptActiveLoads() {
    // Every interruption triggers a revalidation
    isRevalidationRequired = true;
    // Cancel pending route-level deferreds and mark cancelled routes for
    // revalidation
    cancelledDeferredRoutes.push(...cancelActiveDeferreds());
    // Abort in-flight fetcher loads
    fetchLoadMatches.forEach((_, key) => {
      if (fetchControllers.has(key)) {
        cancelledFetcherLoads.push(key);
        abortFetcher(key);
      }
    });
  }
  function updateFetcherState(key, fetcher, opts) {
    if (opts === void 0) {
      opts = {};
    }
    state.fetchers.set(key, fetcher);
    updateState({
      fetchers: new Map(state.fetchers)
    }, {
      flushSync: (opts && opts.flushSync) === true
    });
  }
  function setFetcherError(key, routeId, error, opts) {
    if (opts === void 0) {
      opts = {};
    }
    let boundaryMatch = findNearestBoundary(state.matches, routeId);
    deleteFetcher(key);
    updateState({
      errors: {
        [boundaryMatch.route.id]: error
      },
      fetchers: new Map(state.fetchers)
    }, {
      flushSync: (opts && opts.flushSync) === true
    });
  }
  function getFetcher(key) {
    if (future.v7_fetcherPersist) {
      activeFetchers.set(key, (activeFetchers.get(key) || 0) + 1);
      // If this fetcher was previously marked for deletion, unmark it since we
      // have a new instance
      if (deletedFetchers.has(key)) {
        deletedFetchers.delete(key);
      }
    }
    return state.fetchers.get(key) || IDLE_FETCHER;
  }
  function deleteFetcher(key) {
    let fetcher = state.fetchers.get(key);
    // Don't abort the controller if this is a deletion of a fetcher.submit()
    // in it's loading phase since - we don't want to abort the corresponding
    // revalidation and want them to complete and land
    if (fetchControllers.has(key) && !(fetcher && fetcher.state === "loading" && fetchReloadIds.has(key))) {
      abortFetcher(key);
    }
    fetchLoadMatches.delete(key);
    fetchReloadIds.delete(key);
    fetchRedirectIds.delete(key);
    deletedFetchers.delete(key);
    state.fetchers.delete(key);
  }
  function deleteFetcherAndUpdateState(key) {
    if (future.v7_fetcherPersist) {
      let count = (activeFetchers.get(key) || 0) - 1;
      if (count <= 0) {
        activeFetchers.delete(key);
        deletedFetchers.add(key);
      } else {
        activeFetchers.set(key, count);
      }
    } else {
      deleteFetcher(key);
    }
    updateState({
      fetchers: new Map(state.fetchers)
    });
  }
  function abortFetcher(key) {
    let controller = fetchControllers.get(key);
    invariant(controller, "Expected fetch controller: " + key);
    controller.abort();
    fetchControllers.delete(key);
  }
  function markFetchersDone(keys) {
    for (let key of keys) {
      let fetcher = getFetcher(key);
      let doneFetcher = getDoneFetcher(fetcher.data);
      state.fetchers.set(key, doneFetcher);
    }
  }
  function markFetchRedirectsDone() {
    let doneKeys = [];
    let updatedFetchers = false;
    for (let key of fetchRedirectIds) {
      let fetcher = state.fetchers.get(key);
      invariant(fetcher, "Expected fetcher: " + key);
      if (fetcher.state === "loading") {
        fetchRedirectIds.delete(key);
        doneKeys.push(key);
        updatedFetchers = true;
      }
    }
    markFetchersDone(doneKeys);
    return updatedFetchers;
  }
  function abortStaleFetchLoads(landedId) {
    let yeetedKeys = [];
    for (let [key, id] of fetchReloadIds) {
      if (id < landedId) {
        let fetcher = state.fetchers.get(key);
        invariant(fetcher, "Expected fetcher: " + key);
        if (fetcher.state === "loading") {
          abortFetcher(key);
          fetchReloadIds.delete(key);
          yeetedKeys.push(key);
        }
      }
    }
    markFetchersDone(yeetedKeys);
    return yeetedKeys.length > 0;
  }
  function getBlocker(key, fn) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    if (blockerFunctions.get(key) !== fn) {
      blockerFunctions.set(key, fn);
    }
    return blocker;
  }
  function deleteBlocker(key) {
    state.blockers.delete(key);
    blockerFunctions.delete(key);
  }
  // Utility function to update blockers, ensuring valid state transitions
  function updateBlocker(key, newBlocker) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    // Poor mans state machine :)
    // https://mermaid.live/edit#pako:eNqVkc9OwzAMxl8l8nnjAYrEtDIOHEBIgwvKJTReGy3_lDpIqO27k6awMG0XcrLlnz87nwdonESogKXXBuE79rq75XZO3-yHds0RJVuv70YrPlUrCEe2HfrORS3rubqZfuhtpg5C9wk5tZ4VKcRUq88q9Z8RS0-48cE1iHJkL0ugbHuFLus9L6spZy8nX9MP2CNdomVaposqu3fGayT8T8-jJQwhepo_UtpgBQaDEUom04dZhAN1aJBDlUKJBxE1ceB2Smj0Mln-IBW5AFU2dwUiktt_2Qaq2dBfaKdEup85UV7Yd-dKjlnkabl2Pvr0DTkTreM
    invariant(blocker.state === "unblocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "proceeding" || blocker.state === "blocked" && newBlocker.state === "unblocked" || blocker.state === "proceeding" && newBlocker.state === "unblocked", "Invalid blocker state transition: " + blocker.state + " -> " + newBlocker.state);
    let blockers = new Map(state.blockers);
    blockers.set(key, newBlocker);
    updateState({
      blockers
    });
  }
  function shouldBlockNavigation(_ref4) {
    let {
      currentLocation,
      nextLocation,
      historyAction
    } = _ref4;
    if (blockerFunctions.size === 0) {
      return;
    }
    // We ony support a single active blocker at the moment since we don't have
    // any compelling use cases for multi-blocker yet
    if (blockerFunctions.size > 1) {
      warning(false, "A router only supports one blocker at a time");
    }
    let entries = Array.from(blockerFunctions.entries());
    let [blockerKey, blockerFunction] = entries[entries.length - 1];
    let blocker = state.blockers.get(blockerKey);
    if (blocker && blocker.state === "proceeding") {
      // If the blocker is currently proceeding, we don't need to re-check
      // it and can let this navigation continue
      return;
    }
    // At this point, we know we're unblocked/blocked so we need to check the
    // user-provided blocker function
    if (blockerFunction({
      currentLocation,
      nextLocation,
      historyAction
    })) {
      return blockerKey;
    }
  }
  function cancelActiveDeferreds(predicate) {
    let cancelledRouteIds = [];
    activeDeferreds.forEach((dfd, routeId) => {
      if (!predicate || predicate(routeId)) {
        // Cancel the deferred - but do not remove from activeDeferreds here -
        // we rely on the subscribers to do that so our tests can assert proper
        // cleanup via _internalActiveDeferreds
        dfd.cancel();
        cancelledRouteIds.push(routeId);
        activeDeferreds.delete(routeId);
      }
    });
    return cancelledRouteIds;
  }
  // Opt in to capturing and reporting scroll positions during navigations,
  // used by the <ScrollRestoration> component
  function enableScrollRestoration(positions, getPosition, getKey) {
    savedScrollPositions = positions;
    getScrollPosition = getPosition;
    getScrollRestorationKey = getKey || null;
    // Perform initial hydration scroll restoration, since we miss the boat on
    // the initial updateState() because we've not yet rendered <ScrollRestoration/>
    // and therefore have no savedScrollPositions available
    if (!initialScrollRestored && state.navigation === IDLE_NAVIGATION) {
      initialScrollRestored = true;
      let y = getSavedScrollPosition(state.location, state.matches);
      if (y != null) {
        updateState({
          restoreScrollPosition: y
        });
      }
    }
    return () => {
      savedScrollPositions = null;
      getScrollPosition = null;
      getScrollRestorationKey = null;
    };
  }
  function getScrollKey(location, matches) {
    if (getScrollRestorationKey) {
      let key = getScrollRestorationKey(location, matches.map(m => convertRouteMatchToUiMatch(m, state.loaderData)));
      return key || location.key;
    }
    return location.key;
  }
  function saveScrollPosition(location, matches) {
    if (savedScrollPositions && getScrollPosition) {
      let key = getScrollKey(location, matches);
      savedScrollPositions[key] = getScrollPosition();
    }
  }
  function getSavedScrollPosition(location, matches) {
    if (savedScrollPositions) {
      let key = getScrollKey(location, matches);
      let y = savedScrollPositions[key];
      if (typeof y === "number") {
        return y;
      }
    }
    return null;
  }
  function _internalSetRoutes(newRoutes) {
    manifest = {};
    inFlightDataRoutes = convertRoutesToDataRoutes(newRoutes, mapRouteProperties, undefined, manifest);
  }
  router = {
    get basename() {
      return basename;
    },
    get future() {
      return future;
    },
    get state() {
      return state;
    },
    get routes() {
      return dataRoutes;
    },
    get window() {
      return routerWindow;
    },
    initialize,
    subscribe,
    enableScrollRestoration,
    navigate,
    fetch,
    revalidate,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: to => init.history.createHref(to),
    encodeLocation: to => init.history.encodeLocation(to),
    getFetcher,
    deleteFetcher: deleteFetcherAndUpdateState,
    dispose,
    getBlocker,
    deleteBlocker,
    _internalFetchControllers: fetchControllers,
    _internalActiveDeferreds: activeDeferreds,
    // TODO: Remove setRoutes, it's temporary to avoid dealing with
    // updating the tree while validating the update algorithm.
    _internalSetRoutes
  };
  return router;
}
function isSubmissionNavigation(opts) {
  return opts != null && ("formData" in opts && opts.formData != null || "body" in opts && opts.body !== undefined);
}
function normalizeTo(location, matches, basename, prependBasename, to, v7_relativeSplatPath, fromRouteId, relative) {
  let contextualMatches;
  let activeRouteMatch;
  if (fromRouteId) {
    // Grab matches up to the calling route so our route-relative logic is
    // relative to the correct source route
    contextualMatches = [];
    for (let match of matches) {
      contextualMatches.push(match);
      if (match.route.id === fromRouteId) {
        activeRouteMatch = match;
        break;
      }
    }
  } else {
    contextualMatches = matches;
    activeRouteMatch = matches[matches.length - 1];
  }
  // Resolve the relative path
  let path = resolveTo(to ? to : ".", getResolveToMatches(contextualMatches, v7_relativeSplatPath), stripBasename(location.pathname, basename) || location.pathname, relative === "path");
  // When `to` is not specified we inherit search/hash from the current
  // location, unlike when to="." and we just inherit the path.
  // See https://github.com/remix-run/remix/issues/927
  if (to == null) {
    path.search = location.search;
    path.hash = location.hash;
  }
  // Add an ?index param for matched index routes if we don't already have one
  if ((to == null || to === "" || to === ".") && activeRouteMatch && activeRouteMatch.route.index && !hasNakedIndexQuery(path.search)) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  // If we're operating within a basename, prepend it to the pathname.  If
  // this is a root navigation, then just use the raw basename which allows
  // the basename to have full control over the presence of a trailing slash
  // on root actions
  if (prependBasename && basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
// Normalize navigation options by converting formMethod=GET formData objects to
// URLSearchParams so they behave identically to links with query params
function normalizeNavigateOptions(normalizeFormMethod, isFetcher, path, opts) {
  // Return location verbatim on non-submission navigations
  if (!opts || !isSubmissionNavigation(opts)) {
    return {
      path
    };
  }
  if (opts.formMethod && !isValidMethod(opts.formMethod)) {
    return {
      path,
      error: getInternalRouterError(405, {
        method: opts.formMethod
      })
    };
  }
  let getInvalidBodyError = () => ({
    path,
    error: getInternalRouterError(400, {
      type: "invalid-body"
    })
  });
  // Create a Submission on non-GET navigations
  let rawFormMethod = opts.formMethod || "get";
  let formMethod = normalizeFormMethod ? rawFormMethod.toUpperCase() : rawFormMethod.toLowerCase();
  let formAction = stripHashFromPath(path);
  if (opts.body !== undefined) {
    if (opts.formEncType === "text/plain") {
      // text only support POST/PUT/PATCH/DELETE submissions
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      let text = typeof opts.body === "string" ? opts.body : opts.body instanceof FormData || opts.body instanceof URLSearchParams ?
      // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
      Array.from(opts.body.entries()).reduce((acc, _ref5) => {
        let [name, value] = _ref5;
        return "" + acc + name + "=" + value + "\n";
      }, "") : String(opts.body);
      return {
        path,
        submission: {
          formMethod,
          formAction,
          formEncType: opts.formEncType,
          formData: undefined,
          json: undefined,
          text
        }
      };
    } else if (opts.formEncType === "application/json") {
      // json only supports POST/PUT/PATCH/DELETE submissions
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      try {
        let json = typeof opts.body === "string" ? JSON.parse(opts.body) : opts.body;
        return {
          path,
          submission: {
            formMethod,
            formAction,
            formEncType: opts.formEncType,
            formData: undefined,
            json,
            text: undefined
          }
        };
      } catch (e) {
        return getInvalidBodyError();
      }
    }
  }
  invariant(typeof FormData === "function", "FormData is not available in this environment");
  let searchParams;
  let formData;
  if (opts.formData) {
    searchParams = convertFormDataToSearchParams(opts.formData);
    formData = opts.formData;
  } else if (opts.body instanceof FormData) {
    searchParams = convertFormDataToSearchParams(opts.body);
    formData = opts.body;
  } else if (opts.body instanceof URLSearchParams) {
    searchParams = opts.body;
    formData = convertSearchParamsToFormData(searchParams);
  } else if (opts.body == null) {
    searchParams = new URLSearchParams();
    formData = new FormData();
  } else {
    try {
      searchParams = new URLSearchParams(opts.body);
      formData = convertSearchParamsToFormData(searchParams);
    } catch (e) {
      return getInvalidBodyError();
    }
  }
  let submission = {
    formMethod,
    formAction,
    formEncType: opts && opts.formEncType || "application/x-www-form-urlencoded",
    formData,
    json: undefined,
    text: undefined
  };
  if (isMutationMethod(submission.formMethod)) {
    return {
      path,
      submission
    };
  }
  // Flatten submission onto URLSearchParams for GET submissions
  let parsedPath = parsePath(path);
  // On GET navigation submissions we can drop the ?index param from the
  // resulting location since all loaders will run.  But fetcher GET submissions
  // only run a single loader so we need to preserve any incoming ?index params
  if (isFetcher && parsedPath.search && hasNakedIndexQuery(parsedPath.search)) {
    searchParams.append("index", "");
  }
  parsedPath.search = "?" + searchParams;
  return {
    path: createPath(parsedPath),
    submission
  };
}
// Filter out all routes below any caught error as they aren't going to
// render so we don't need to load them
function getLoaderMatchesUntilBoundary(matches, boundaryId) {
  let boundaryMatches = matches;
  if (boundaryId) {
    let index = matches.findIndex(m => m.route.id === boundaryId);
    if (index >= 0) {
      boundaryMatches = matches.slice(0, index);
    }
  }
  return boundaryMatches;
}
function getMatchesToLoad(history, state, matches, submission, location, isInitialLoad, skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionResult) {
  let actionResult = pendingActionResult ? isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : pendingActionResult[1].data : undefined;
  let currentUrl = history.createURL(state.location);
  let nextUrl = history.createURL(location);
  // Pick navigation matches that are net-new or qualify for revalidation
  let boundaryId = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[0] : undefined;
  let boundaryMatches = boundaryId ? getLoaderMatchesUntilBoundary(matches, boundaryId) : matches;
  // Don't revalidate loaders by default after action 4xx/5xx responses
  // when the flag is enabled.  They can still opt-into revalidation via
  // `shouldRevalidate` via `actionResult`
  let actionStatus = pendingActionResult ? pendingActionResult[1].statusCode : undefined;
  let shouldSkipRevalidation = skipActionErrorRevalidation && actionStatus && actionStatus >= 400;
  let navigationMatches = boundaryMatches.filter((match, index) => {
    let {
      route
    } = match;
    if (route.lazy) {
      // We haven't loaded this route yet so we don't know if it's got a loader!
      return true;
    }
    if (route.loader == null) {
      return false;
    }
    if (isInitialLoad) {
      if (typeof route.loader !== "function" || route.loader.hydrate) {
        return true;
      }
      return state.loaderData[route.id] === undefined && (
      // Don't re-run if the loader ran and threw an error
      !state.errors || state.errors[route.id] === undefined);
    }
    // Always call the loader on new route instances and pending defer cancellations
    if (isNewLoader(state.loaderData, state.matches[index], match) || cancelledDeferredRoutes.some(id => id === match.route.id)) {
      return true;
    }
    // This is the default implementation for when we revalidate.  If the route
    // provides it's own implementation, then we give them full control but
    // provide this value so they can leverage it if needed after they check
    // their own specific use cases
    let currentRouteMatch = state.matches[index];
    let nextRouteMatch = match;
    return shouldRevalidateLoader(match, _extends$2({
      currentUrl,
      currentParams: currentRouteMatch.params,
      nextUrl,
      nextParams: nextRouteMatch.params
    }, submission, {
      actionResult,
      unstable_actionStatus: actionStatus,
      defaultShouldRevalidate: shouldSkipRevalidation ? false :
      // Forced revalidation due to submission, useRevalidator, or X-Remix-Revalidate
      isRevalidationRequired || currentUrl.pathname + currentUrl.search === nextUrl.pathname + nextUrl.search ||
      // Search params affect all loaders
      currentUrl.search !== nextUrl.search || isNewRouteInstance(currentRouteMatch, nextRouteMatch)
    }));
  });
  // Pick fetcher.loads that need to be revalidated
  let revalidatingFetchers = [];
  fetchLoadMatches.forEach((f, key) => {
    // Don't revalidate:
    //  - on initial load (shouldn't be any fetchers then anyway)
    //  - if fetcher won't be present in the subsequent render
    //    - no longer matches the URL (v7_fetcherPersist=false)
    //    - was unmounted but persisted due to v7_fetcherPersist=true
    if (isInitialLoad || !matches.some(m => m.route.id === f.routeId) || deletedFetchers.has(key)) {
      return;
    }
    let fetcherMatches = matchRoutes(routesToUse, f.path, basename);
    // If the fetcher path no longer matches, push it in with null matches so
    // we can trigger a 404 in callLoadersAndMaybeResolveData.  Note this is
    // currently only a use-case for Remix HMR where the route tree can change
    // at runtime and remove a route previously loaded via a fetcher
    if (!fetcherMatches) {
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: null,
        match: null,
        controller: null
      });
      return;
    }
    // Revalidating fetchers are decoupled from the route matches since they
    // load from a static href.  They revalidate based on explicit revalidation
    // (submission, useRevalidator, or X-Remix-Revalidate)
    let fetcher = state.fetchers.get(key);
    let fetcherMatch = getTargetMatch(fetcherMatches, f.path);
    let shouldRevalidate = false;
    if (fetchRedirectIds.has(key)) {
      // Never trigger a revalidation of an actively redirecting fetcher
      shouldRevalidate = false;
    } else if (cancelledFetcherLoads.includes(key)) {
      // Always revalidate if the fetcher was cancelled
      shouldRevalidate = true;
    } else if (fetcher && fetcher.state !== "idle" && fetcher.data === undefined) {
      // If the fetcher hasn't ever completed loading yet, then this isn't a
      // revalidation, it would just be a brand new load if an explicit
      // revalidation is required
      shouldRevalidate = isRevalidationRequired;
    } else {
      // Otherwise fall back on any user-defined shouldRevalidate, defaulting
      // to explicit revalidations only
      shouldRevalidate = shouldRevalidateLoader(fetcherMatch, _extends$2({
        currentUrl,
        currentParams: state.matches[state.matches.length - 1].params,
        nextUrl,
        nextParams: matches[matches.length - 1].params
      }, submission, {
        actionResult,
        unstable_actionStatus: actionStatus,
        defaultShouldRevalidate: shouldSkipRevalidation ? false : isRevalidationRequired
      }));
    }
    if (shouldRevalidate) {
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: fetcherMatches,
        match: fetcherMatch,
        controller: new AbortController()
      });
    }
  });
  return [navigationMatches, revalidatingFetchers];
}
function isNewLoader(currentLoaderData, currentMatch, match) {
  let isNew =
  // [a] -> [a, b]
  !currentMatch ||
  // [a, b] -> [a, c]
  match.route.id !== currentMatch.route.id;
  // Handle the case that we don't have data for a re-used route, potentially
  // from a prior error or from a cancelled pending deferred
  let isMissingData = currentLoaderData[match.route.id] === undefined;
  // Always load if this is a net-new route or we don't yet have data
  return isNew || isMissingData;
}
function isNewRouteInstance(currentMatch, match) {
  let currentPath = currentMatch.route.path;
  return (
    // param change for this match, /users/123 -> /users/456
    currentMatch.pathname !== match.pathname ||
    // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    currentPath != null && currentPath.endsWith("*") && currentMatch.params["*"] !== match.params["*"]
  );
}
function shouldRevalidateLoader(loaderMatch, arg) {
  if (loaderMatch.route.shouldRevalidate) {
    let routeChoice = loaderMatch.route.shouldRevalidate(arg);
    if (typeof routeChoice === "boolean") {
      return routeChoice;
    }
  }
  return arg.defaultShouldRevalidate;
}
/**
 * Execute route.lazy() methods to lazily load route modules (loader, action,
 * shouldRevalidate) and update the routeManifest in place which shares objects
 * with dataRoutes so those get updated as well.
 */
async function loadLazyRouteModule(route, mapRouteProperties, manifest) {
  if (!route.lazy) {
    return;
  }
  let lazyRoute = await route.lazy();
  // If the lazy route function was executed and removed by another parallel
  // call then we can return - first lazy() to finish wins because the return
  // value of lazy is expected to be static
  if (!route.lazy) {
    return;
  }
  let routeToUpdate = manifest[route.id];
  invariant(routeToUpdate, "No route found in manifest");
  // Update the route in place.  This should be safe because there's no way
  // we could yet be sitting on this route as we can't get there without
  // resolving lazy() first.
  //
  // This is different than the HMR "update" use-case where we may actively be
  // on the route being updated.  The main concern boils down to "does this
  // mutation affect any ongoing navigations or any current state.matches
  // values?".  If not, it should be safe to update in place.
  let routeUpdates = {};
  for (let lazyRouteProperty in lazyRoute) {
    let staticRouteValue = routeToUpdate[lazyRouteProperty];
    let isPropertyStaticallyDefined = staticRouteValue !== undefined &&
    // This property isn't static since it should always be updated based
    // on the route updates
    lazyRouteProperty !== "hasErrorBoundary";
    warning(!isPropertyStaticallyDefined, "Route \"" + routeToUpdate.id + "\" has a static property \"" + lazyRouteProperty + "\" " + "defined but its lazy function is also returning a value for this property. " + ("The lazy route property \"" + lazyRouteProperty + "\" will be ignored."));
    if (!isPropertyStaticallyDefined && !immutableRouteKeys.has(lazyRouteProperty)) {
      routeUpdates[lazyRouteProperty] = lazyRoute[lazyRouteProperty];
    }
  }
  // Mutate the route with the provided updates.  Do this first so we pass
  // the updated version to mapRouteProperties
  Object.assign(routeToUpdate, routeUpdates);
  // Mutate the `hasErrorBoundary` property on the route based on the route
  // updates and remove the `lazy` function so we don't resolve the lazy
  // route again.
  Object.assign(routeToUpdate, _extends$2({}, mapRouteProperties(routeToUpdate), {
    lazy: undefined
  }));
}
// Default implementation of `dataStrategy` which fetches all loaders in parallel
function defaultDataStrategy(opts) {
  return Promise.all(opts.matches.map(m => m.resolve()));
}
async function callDataStrategyImpl(dataStrategyImpl, type, request, matchesToLoad, matches, manifest, mapRouteProperties, requestContext) {
  let routeIdsToLoad = matchesToLoad.reduce((acc, m) => acc.add(m.route.id), new Set());
  let loadedMatches = new Set();
  // Send all matches here to allow for a middleware-type implementation.
  // handler will be a no-op for unneeded routes and we filter those results
  // back out below.
  let results = await dataStrategyImpl({
    matches: matches.map(match => {
      let shouldLoad = routeIdsToLoad.has(match.route.id);
      // `resolve` encapsulates the route.lazy, executing the
      // loader/action, and mapping return values/thrown errors to a
      // HandlerResult.  Users can pass a callback to take fine-grained control
      // over the execution of the loader/action
      let resolve = handlerOverride => {
        loadedMatches.add(match.route.id);
        return shouldLoad ? callLoaderOrAction(type, request, match, manifest, mapRouteProperties, handlerOverride, requestContext) : Promise.resolve({
          type: ResultType.data,
          result: undefined
        });
      };
      return _extends$2({}, match, {
        shouldLoad,
        resolve
      });
    }),
    request,
    params: matches[0].params,
    context: requestContext
  });
  // Throw if any loadRoute implementations not called since they are what
  // ensures a route is fully loaded
  matches.forEach(m => invariant(loadedMatches.has(m.route.id), "`match.resolve()` was not called for route id \"" + m.route.id + "\". " + "You must call `match.resolve()` on every match passed to " + "`dataStrategy` to ensure all routes are properly loaded."));
  // Filter out any middleware-only matches for which we didn't need to run handlers
  return results.filter((_, i) => routeIdsToLoad.has(matches[i].route.id));
}
// Default logic for calling a loader/action is the user has no specified a dataStrategy
async function callLoaderOrAction(type, request, match, manifest, mapRouteProperties, handlerOverride, staticContext) {
  let result;
  let onReject;
  let runHandler = handler => {
    // Setup a promise we can race against so that abort signals short circuit
    let reject;
    // This will never resolve so safe to type it as Promise<HandlerResult> to
    // satisfy the function return value
    let abortPromise = new Promise((_, r) => reject = r);
    onReject = () => reject();
    request.signal.addEventListener("abort", onReject);
    let actualHandler = ctx => {
      if (typeof handler !== "function") {
        return Promise.reject(new Error("You cannot call the handler for a route which defines a boolean " + ("\"" + type + "\" [routeId: " + match.route.id + "]")));
      }
      return handler({
        request,
        params: match.params,
        context: staticContext
      }, ...(ctx !== undefined ? [ctx] : []));
    };
    let handlerPromise;
    if (handlerOverride) {
      handlerPromise = handlerOverride(ctx => actualHandler(ctx));
    } else {
      handlerPromise = (async () => {
        try {
          let val = await actualHandler();
          return {
            type: "data",
            result: val
          };
        } catch (e) {
          return {
            type: "error",
            result: e
          };
        }
      })();
    }
    return Promise.race([handlerPromise, abortPromise]);
  };
  try {
    let handler = match.route[type];
    if (match.route.lazy) {
      if (handler) {
        // Run statically defined handler in parallel with lazy()
        let handlerError;
        let [value] = await Promise.all([
        // If the handler throws, don't let it immediately bubble out,
        // since we need to let the lazy() execution finish so we know if this
        // route has a boundary that can handle the error
        runHandler(handler).catch(e => {
          handlerError = e;
        }), loadLazyRouteModule(match.route, mapRouteProperties, manifest)]);
        if (handlerError !== undefined) {
          throw handlerError;
        }
        result = value;
      } else {
        // Load lazy route module, then run any returned handler
        await loadLazyRouteModule(match.route, mapRouteProperties, manifest);
        handler = match.route[type];
        if (handler) {
          // Handler still runs even if we got interrupted to maintain consistency
          // with un-abortable behavior of handler execution on non-lazy or
          // previously-lazy-loaded routes
          result = await runHandler(handler);
        } else if (type === "action") {
          let url = new URL(request.url);
          let pathname = url.pathname + url.search;
          throw getInternalRouterError(405, {
            method: request.method,
            pathname,
            routeId: match.route.id
          });
        } else {
          // lazy() route has no loader to run.  Short circuit here so we don't
          // hit the invariant below that errors on returning undefined.
          return {
            type: ResultType.data,
            result: undefined
          };
        }
      }
    } else if (!handler) {
      let url = new URL(request.url);
      let pathname = url.pathname + url.search;
      throw getInternalRouterError(404, {
        pathname
      });
    } else {
      result = await runHandler(handler);
    }
    invariant(result.result !== undefined, "You defined " + (type === "action" ? "an action" : "a loader") + " for route " + ("\"" + match.route.id + "\" but didn't return anything from your `" + type + "` ") + "function. Please return a value or `null`.");
  } catch (e) {
    // We should already be catching and converting normal handler executions to
    // HandlerResults and returning them, so anything that throws here is an
    // unexpected error we still need to wrap
    return {
      type: ResultType.error,
      result: e
    };
  } finally {
    if (onReject) {
      request.signal.removeEventListener("abort", onReject);
    }
  }
  return result;
}
async function convertHandlerResultToDataResult(handlerResult) {
  let {
    result,
    type,
    status
  } = handlerResult;
  if (isResponse(result)) {
    let data;
    try {
      let contentType = result.headers.get("Content-Type");
      // Check between word boundaries instead of startsWith() due to the last
      // paragraph of https://httpwg.org/specs/rfc9110.html#field.content-type
      if (contentType && /\bapplication\/json\b/.test(contentType)) {
        if (result.body == null) {
          data = null;
        } else {
          data = await result.json();
        }
      } else {
        data = await result.text();
      }
    } catch (e) {
      return {
        type: ResultType.error,
        error: e
      };
    }
    if (type === ResultType.error) {
      return {
        type: ResultType.error,
        error: new ErrorResponseImpl(result.status, result.statusText, data),
        statusCode: result.status,
        headers: result.headers
      };
    }
    return {
      type: ResultType.data,
      data,
      statusCode: result.status,
      headers: result.headers
    };
  }
  if (type === ResultType.error) {
    return {
      type: ResultType.error,
      error: result,
      statusCode: isRouteErrorResponse(result) ? result.status : status
    };
  }
  if (isDeferredData(result)) {
    var _result$init, _result$init2;
    return {
      type: ResultType.deferred,
      deferredData: result,
      statusCode: (_result$init = result.init) == null ? void 0 : _result$init.status,
      headers: ((_result$init2 = result.init) == null ? void 0 : _result$init2.headers) && new Headers(result.init.headers)
    };
  }
  return {
    type: ResultType.data,
    data: result,
    statusCode: status
  };
}
// Support relative routing in internal redirects
function normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename, v7_relativeSplatPath) {
  let location = response.headers.get("Location");
  invariant(location, "Redirects returned/thrown from loaders/actions must have a Location header");
  if (!ABSOLUTE_URL_REGEX$1.test(location)) {
    let trimmedMatches = matches.slice(0, matches.findIndex(m => m.route.id === routeId) + 1);
    location = normalizeTo(new URL(request.url), trimmedMatches, basename, true, location, v7_relativeSplatPath);
    response.headers.set("Location", location);
  }
  return response;
}
function normalizeRedirectLocation(location, currentUrl, basename) {
  if (ABSOLUTE_URL_REGEX$1.test(location)) {
    // Strip off the protocol+origin for same-origin + same-basename absolute redirects
    let normalizedLocation = location;
    let url = normalizedLocation.startsWith("//") ? new URL(currentUrl.protocol + normalizedLocation) : new URL(normalizedLocation);
    let isSameBasename = stripBasename(url.pathname, basename) != null;
    if (url.origin === currentUrl.origin && isSameBasename) {
      return url.pathname + url.search + url.hash;
    }
  }
  return location;
}
// Utility method for creating the Request instances for loaders/actions during
// client-side navigations and fetches.  During SSR we will always have a
// Request instance from the static handler (query/queryRoute)
function createClientSideRequest(history, location, signal, submission) {
  let url = history.createURL(stripHashFromPath(location)).toString();
  let init = {
    signal
  };
  if (submission && isMutationMethod(submission.formMethod)) {
    let {
      formMethod,
      formEncType
    } = submission;
    // Didn't think we needed this but it turns out unlike other methods, patch
    // won't be properly normalized to uppercase and results in a 405 error.
    // See: https://fetch.spec.whatwg.org/#concept-method
    init.method = formMethod.toUpperCase();
    if (formEncType === "application/json") {
      init.headers = new Headers({
        "Content-Type": formEncType
      });
      init.body = JSON.stringify(submission.json);
    } else if (formEncType === "text/plain") {
      // Content-Type is inferred (https://fetch.spec.whatwg.org/#dom-request)
      init.body = submission.text;
    } else if (formEncType === "application/x-www-form-urlencoded" && submission.formData) {
      // Content-Type is inferred (https://fetch.spec.whatwg.org/#dom-request)
      init.body = convertFormDataToSearchParams(submission.formData);
    } else {
      // Content-Type is inferred (https://fetch.spec.whatwg.org/#dom-request)
      init.body = submission.formData;
    }
  }
  return new Request(url, init);
}
function convertFormDataToSearchParams(formData) {
  let searchParams = new URLSearchParams();
  for (let [key, value] of formData.entries()) {
    // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#converting-an-entry-list-to-a-list-of-name-value-pairs
    searchParams.append(key, typeof value === "string" ? value : value.name);
  }
  return searchParams;
}
function convertSearchParamsToFormData(searchParams) {
  let formData = new FormData();
  for (let [key, value] of searchParams.entries()) {
    formData.append(key, value);
  }
  return formData;
}
function processRouteLoaderData(matches, matchesToLoad, results, pendingActionResult, activeDeferreds, skipLoaderErrorBubbling) {
  // Fill in loaderData/errors from our loaders
  let loaderData = {};
  let errors = null;
  let statusCode;
  let foundError = false;
  let loaderHeaders = {};
  let pendingError = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : undefined;
  // Process loader results into state.loaderData/state.errors
  results.forEach((result, index) => {
    let id = matchesToLoad[index].route.id;
    invariant(!isRedirectResult(result), "Cannot handle redirect results in processLoaderData");
    if (isErrorResult(result)) {
      let error = result.error;
      // If we have a pending action error, we report it at the highest-route
      // that throws a loader error, and then clear it out to indicate that
      // it was consumed
      if (pendingError !== undefined) {
        error = pendingError;
        pendingError = undefined;
      }
      errors = errors || {};
      {
        // Look upwards from the matched route for the closest ancestor error
        // boundary, defaulting to the root match.  Prefer higher error values
        // if lower errors bubble to the same boundary
        let boundaryMatch = findNearestBoundary(matches, id);
        if (errors[boundaryMatch.route.id] == null) {
          errors[boundaryMatch.route.id] = error;
        }
      }
      // Clear our any prior loaderData for the throwing route
      loaderData[id] = undefined;
      // Once we find our first (highest) error, we set the status code and
      // prevent deeper status codes from overriding
      if (!foundError) {
        foundError = true;
        statusCode = isRouteErrorResponse(result.error) ? result.error.status : 500;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    } else {
      if (isDeferredResult(result)) {
        activeDeferreds.set(id, result.deferredData);
        loaderData[id] = result.deferredData.data;
        // Error status codes always override success status codes, but if all
        // loaders are successful we take the deepest status code.
        if (result.statusCode != null && result.statusCode !== 200 && !foundError) {
          statusCode = result.statusCode;
        }
        if (result.headers) {
          loaderHeaders[id] = result.headers;
        }
      } else {
        loaderData[id] = result.data;
        // Error status codes always override success status codes, but if all
        // loaders are successful we take the deepest status code.
        if (result.statusCode && result.statusCode !== 200 && !foundError) {
          statusCode = result.statusCode;
        }
        if (result.headers) {
          loaderHeaders[id] = result.headers;
        }
      }
    }
  });
  // If we didn't consume the pending action error (i.e., all loaders
  // resolved), then consume it here.  Also clear out any loaderData for the
  // throwing route
  if (pendingError !== undefined && pendingActionResult) {
    errors = {
      [pendingActionResult[0]]: pendingError
    };
    loaderData[pendingActionResult[0]] = undefined;
  }
  return {
    loaderData,
    errors,
    statusCode: statusCode || 200,
    loaderHeaders
  };
}
function processLoaderData(state, matches, matchesToLoad, results, pendingActionResult, revalidatingFetchers, fetcherResults, activeDeferreds) {
  let {
    loaderData,
    errors
  } = processRouteLoaderData(matches, matchesToLoad, results, pendingActionResult, activeDeferreds);
  // Process results from our revalidating fetchers
  for (let index = 0; index < revalidatingFetchers.length; index++) {
    let {
      key,
      match,
      controller
    } = revalidatingFetchers[index];
    invariant(fetcherResults !== undefined && fetcherResults[index] !== undefined, "Did not find corresponding fetcher result");
    let result = fetcherResults[index];
    // Process fetcher non-redirect errors
    if (controller && controller.signal.aborted) {
      // Nothing to do for aborted fetchers
      continue;
    } else if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(state.matches, match == null ? void 0 : match.route.id);
      if (!(errors && errors[boundaryMatch.route.id])) {
        errors = _extends$2({}, errors, {
          [boundaryMatch.route.id]: result.error
        });
      }
      state.fetchers.delete(key);
    } else if (isRedirectResult(result)) {
      // Should never get here, redirects should get processed above, but we
      // keep this to type narrow to a success result in the else
      invariant(false, "Unhandled fetcher revalidation redirect");
    } else if (isDeferredResult(result)) {
      // Should never get here, deferred data should be awaited for fetchers
      // in resolveDeferredResults
      invariant(false, "Unhandled fetcher deferred data");
    } else {
      let doneFetcher = getDoneFetcher(result.data);
      state.fetchers.set(key, doneFetcher);
    }
  }
  return {
    loaderData,
    errors
  };
}
function mergeLoaderData(loaderData, newLoaderData, matches, errors) {
  let mergedLoaderData = _extends$2({}, newLoaderData);
  for (let match of matches) {
    let id = match.route.id;
    if (newLoaderData.hasOwnProperty(id)) {
      if (newLoaderData[id] !== undefined) {
        mergedLoaderData[id] = newLoaderData[id];
      }
    } else if (loaderData[id] !== undefined && match.route.loader) {
      // Preserve existing keys not included in newLoaderData and where a loader
      // wasn't removed by HMR
      mergedLoaderData[id] = loaderData[id];
    }
    if (errors && errors.hasOwnProperty(id)) {
      // Don't keep any loader data below the boundary
      break;
    }
  }
  return mergedLoaderData;
}
function getActionDataForCommit(pendingActionResult) {
  if (!pendingActionResult) {
    return {};
  }
  return isErrorResult(pendingActionResult[1]) ? {
    // Clear out prior actionData on errors
    actionData: {}
  } : {
    actionData: {
      [pendingActionResult[0]]: pendingActionResult[1].data
    }
  };
}
// Find the nearest error boundary, looking upwards from the leaf route (or the
// route specified by routeId) for the closest ancestor error boundary,
// defaulting to the root match
function findNearestBoundary(matches, routeId) {
  let eligibleMatches = routeId ? matches.slice(0, matches.findIndex(m => m.route.id === routeId) + 1) : [...matches];
  return eligibleMatches.reverse().find(m => m.route.hasErrorBoundary === true) || matches[0];
}
function getShortCircuitMatches(routes) {
  // Prefer a root layout route if present, otherwise shim in a route object
  let route = routes.length === 1 ? routes[0] : routes.find(r => r.index || !r.path || r.path === "/") || {
    id: "__shim-error-route__"
  };
  return {
    matches: [{
      params: {},
      pathname: "",
      pathnameBase: "",
      route
    }],
    route
  };
}
function getInternalRouterError(status, _temp5) {
  let {
    pathname,
    routeId,
    method,
    type
  } = _temp5 === void 0 ? {} : _temp5;
  let statusText = "Unknown Server Error";
  let errorMessage = "Unknown @remix-run/router error";
  if (status === 400) {
    statusText = "Bad Request";
    if (method && pathname && routeId) {
      errorMessage = "You made a " + method + " request to \"" + pathname + "\" but " + ("did not provide a `loader` for route \"" + routeId + "\", ") + "so there is no way to handle the request.";
    } else if (type === "defer-action") {
      errorMessage = "defer() is not supported in actions";
    } else if (type === "invalid-body") {
      errorMessage = "Unable to encode submission body";
    }
  } else if (status === 403) {
    statusText = "Forbidden";
    errorMessage = "Route \"" + routeId + "\" does not match URL \"" + pathname + "\"";
  } else if (status === 404) {
    statusText = "Not Found";
    errorMessage = "No route matches URL \"" + pathname + "\"";
  } else if (status === 405) {
    statusText = "Method Not Allowed";
    if (method && pathname && routeId) {
      errorMessage = "You made a " + method.toUpperCase() + " request to \"" + pathname + "\" but " + ("did not provide an `action` for route \"" + routeId + "\", ") + "so there is no way to handle the request.";
    } else if (method) {
      errorMessage = "Invalid request method \"" + method.toUpperCase() + "\"";
    }
  }
  return new ErrorResponseImpl(status || 500, statusText, new Error(errorMessage), true);
}
// Find any returned redirect errors, starting from the lowest match
function findRedirect(results) {
  for (let i = results.length - 1; i >= 0; i--) {
    let result = results[i];
    if (isRedirectResult(result)) {
      return {
        result,
        idx: i
      };
    }
  }
}
function stripHashFromPath(path) {
  let parsedPath = typeof path === "string" ? parsePath(path) : path;
  return createPath(_extends$2({}, parsedPath, {
    hash: ""
  }));
}
function isHashChangeOnly(a, b) {
  if (a.pathname !== b.pathname || a.search !== b.search) {
    return false;
  }
  if (a.hash === "") {
    // /page -> /page#hash
    return b.hash !== "";
  } else if (a.hash === b.hash) {
    // /page#hash -> /page#hash
    return true;
  } else if (b.hash !== "") {
    // /page#hash -> /page#other
    return true;
  }
  // If the hash is removed the browser will re-perform a request to the server
  // /page#hash -> /page
  return false;
}
function isRedirectHandlerResult(result) {
  return isResponse(result.result) && redirectStatusCodes.has(result.result.status);
}
function isDeferredResult(result) {
  return result.type === ResultType.deferred;
}
function isErrorResult(result) {
  return result.type === ResultType.error;
}
function isRedirectResult(result) {
  return (result && result.type) === ResultType.redirect;
}
function isDeferredData(value) {
  let deferred = value;
  return deferred && typeof deferred === "object" && typeof deferred.data === "object" && typeof deferred.subscribe === "function" && typeof deferred.cancel === "function" && typeof deferred.resolveData === "function";
}
function isResponse(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
function isValidMethod(method) {
  return validRequestMethods.has(method.toLowerCase());
}
function isMutationMethod(method) {
  return validMutationMethods.has(method.toLowerCase());
}
async function resolveDeferredResults(currentMatches, matchesToLoad, results, signals, isFetcher, currentLoaderData) {
  for (let index = 0; index < results.length; index++) {
    let result = results[index];
    let match = matchesToLoad[index];
    // If we don't have a match, then we can have a deferred result to do
    // anything with.  This is for revalidating fetchers where the route was
    // removed during HMR
    if (!match) {
      continue;
    }
    let currentMatch = currentMatches.find(m => m.route.id === match.route.id);
    let isRevalidatingLoader = currentMatch != null && !isNewRouteInstance(currentMatch, match) && (currentLoaderData && currentLoaderData[match.route.id]) !== undefined;
    if (isDeferredResult(result) && (isFetcher || isRevalidatingLoader)) {
      // Note: we do not have to touch activeDeferreds here since we race them
      // against the signal in resolveDeferredData and they'll get aborted
      // there if needed
      let signal = signals[index];
      invariant(signal, "Expected an AbortSignal for revalidating fetcher deferred result");
      await resolveDeferredData(result, signal, isFetcher).then(result => {
        if (result) {
          results[index] = result || results[index];
        }
      });
    }
  }
}
async function resolveDeferredData(result, signal, unwrap) {
  if (unwrap === void 0) {
    unwrap = false;
  }
  let aborted = await result.deferredData.resolveData(signal);
  if (aborted) {
    return;
  }
  if (unwrap) {
    try {
      return {
        type: ResultType.data,
        data: result.deferredData.unwrappedData
      };
    } catch (e) {
      // Handle any TrackedPromise._error values encountered while unwrapping
      return {
        type: ResultType.error,
        error: e
      };
    }
  }
  return {
    type: ResultType.data,
    data: result.deferredData.data
  };
}
function hasNakedIndexQuery(search) {
  return new URLSearchParams(search).getAll("index").some(v => v === "");
}
function getTargetMatch(matches, location) {
  let search = typeof location === "string" ? parsePath(location).search : location.search;
  if (matches[matches.length - 1].route.index && hasNakedIndexQuery(search || "")) {
    // Return the leaf index route when index is present
    return matches[matches.length - 1];
  }
  // Otherwise grab the deepest "path contributing" match (ignoring index and
  // pathless layout routes)
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches[pathMatches.length - 1];
}
function getSubmissionFromNavigation(navigation) {
  let {
    formMethod,
    formAction,
    formEncType,
    text,
    formData,
    json
  } = navigation;
  if (!formMethod || !formAction || !formEncType) {
    return;
  }
  if (text != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: undefined,
      json: undefined,
      text
    };
  } else if (formData != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData,
      json: undefined,
      text: undefined
    };
  } else if (json !== undefined) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: undefined,
      json,
      text: undefined
    };
  }
}
function getLoadingNavigation(location, submission) {
  if (submission) {
    let navigation = {
      state: "loading",
      location,
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text
    };
    return navigation;
  } else {
    let navigation = {
      state: "loading",
      location,
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      formData: undefined,
      json: undefined,
      text: undefined
    };
    return navigation;
  }
}
function getSubmittingNavigation(location, submission) {
  let navigation = {
    state: "submitting",
    location,
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text
  };
  return navigation;
}
function getLoadingFetcher(submission, data) {
  if (submission) {
    let fetcher = {
      state: "loading",
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text,
      data
    };
    return fetcher;
  } else {
    let fetcher = {
      state: "loading",
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      formData: undefined,
      json: undefined,
      text: undefined,
      data
    };
    return fetcher;
  }
}
function getSubmittingFetcher(submission, existingFetcher) {
  let fetcher = {
    state: "submitting",
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text,
    data: existingFetcher ? existingFetcher.data : undefined
  };
  return fetcher;
}
function getDoneFetcher(data) {
  let fetcher = {
    state: "idle",
    formMethod: undefined,
    formAction: undefined,
    formEncType: undefined,
    formData: undefined,
    json: undefined,
    text: undefined,
    data
  };
  return fetcher;
}
function restoreAppliedTransitions(_window, transitions) {
  try {
    let sessionPositions = _window.sessionStorage.getItem(TRANSITIONS_STORAGE_KEY);
    if (sessionPositions) {
      let json = JSON.parse(sessionPositions);
      for (let [k, v] of Object.entries(json || {})) {
        if (v && Array.isArray(v)) {
          transitions.set(k, new Set(v || []));
        }
      }
    }
  } catch (e) {
    // no-op, use default empty object
  }
}
function persistAppliedTransitions(_window, transitions) {
  if (transitions.size > 0) {
    let json = {};
    for (let [k, v] of transitions) {
      json[k] = [...v];
    }
    try {
      _window.sessionStorage.setItem(TRANSITIONS_STORAGE_KEY, JSON.stringify(json));
    } catch (error) {
      warning(false, "Failed to save applied view transitions in sessionStorage (" + error + ").");
    }
  }
}

/**
 * React Router v6.23.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
const DataRouterContext = /* @__PURE__ */ reactExports.createContext(null);
const DataRouterStateContext = /* @__PURE__ */ reactExports.createContext(null);
const NavigationContext = /* @__PURE__ */ reactExports.createContext(null);
const LocationContext = /* @__PURE__ */ reactExports.createContext(null);
const RouteContext = /* @__PURE__ */ reactExports.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
const RouteErrorContext = /* @__PURE__ */ reactExports.createContext(null);
function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    basename,
    navigator
  } = reactExports.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}
function useInRouterContext() {
  return reactExports.useContext(LocationContext) != null;
}
function useLocation() {
  !useInRouterContext() ? invariant(false) : void 0;
  return reactExports.useContext(LocationContext).location;
}
function useIsomorphicLayoutEffect(cb) {
  let isStatic = reactExports.useContext(NavigationContext).static;
  if (!isStatic) {
    reactExports.useLayoutEffect(cb);
  }
}
function useNavigate() {
  let {
    isDataRoute
  } = reactExports.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ? invariant(false) : void 0;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  let {
    basename,
    future,
    navigator
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (!!options.replace ? navigator.replace : navigator.push)(path, options.state, options);
  }, [basename, navigator, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}
function useParams() {
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}
function useResolvedPath(to, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    future
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  return reactExports.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    navigator
  } = reactExports.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = reactExports.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  routeMatch && routeMatch.route;
  let locationFromContext = useLocation();
  let location;
  {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, {
    pathname: remainingPathname
  });
  let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator.encodeLocation ? navigator.encodeLocation(match.pathname).pathname : match.pathname
    ]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
    ])
  })), parentMatches, dataRouterState, future);
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ reactExports.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /* @__PURE__ */ reactExports.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /* @__PURE__ */ reactExports.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error !== void 0 ? /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ reactExports.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState, future) {
  var _dataRouterState2;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (future === void 0) {
    future = null;
  }
  if (matches == null) {
    var _dataRouterState;
    if ((_dataRouterState = dataRouterState) != null && _dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = (_dataRouterState2 = dataRouterState) == null ? void 0 : _dataRouterState2.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex((m) => m.route.id && (errors == null ? void 0 : errors[m.route.id]) !== void 0);
    !(errorIndex >= 0) ? invariant(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState && future && future.v7_partialHydration) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let {
          loaderData,
          errors: errors2
        } = dataRouterState;
        let needsToRunLoader = match.route.loader && loaderData[match.route.id] === void 0 && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : void 0;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        children = /* @__PURE__ */ reactExports.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /* @__PURE__ */ reactExports.createElement(RenderedRoute, {
        match,
        routeContext: {
          outlet,
          matches: matches2,
          isDataRoute: dataRouterState != null
        },
        children
      });
    };
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ reactExports.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches: matches2,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook$1 = /* @__PURE__ */ function(DataRouterHook2) {
  DataRouterHook2["UseBlocker"] = "useBlocker";
  DataRouterHook2["UseRevalidator"] = "useRevalidator";
  DataRouterHook2["UseNavigateStable"] = "useNavigate";
  return DataRouterHook2;
}(DataRouterHook$1 || {});
var DataRouterStateHook$1 = /* @__PURE__ */ function(DataRouterStateHook2) {
  DataRouterStateHook2["UseBlocker"] = "useBlocker";
  DataRouterStateHook2["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook2["UseActionData"] = "useActionData";
  DataRouterStateHook2["UseRouteError"] = "useRouteError";
  DataRouterStateHook2["UseNavigation"] = "useNavigation";
  DataRouterStateHook2["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook2["UseMatches"] = "useMatches";
  DataRouterStateHook2["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook2["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook2["UseRouteId"] = "useRouteId";
  return DataRouterStateHook2;
}(DataRouterStateHook$1 || {});
function useDataRouterContext(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = reactExports.useContext(DataRouterStateContext);
  !state ? invariant(false) : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = reactExports.useContext(RouteContext);
  !route ? invariant(false) : void 0;
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext();
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ? invariant(false) : void 0;
  return thisRoute.route.id;
}
function useRouteError() {
  var _state$errors;
  let error = reactExports.useContext(RouteErrorContext);
  let state = useDataRouterState(DataRouterStateHook$1.UseRouteError);
  let routeId = useCurrentRouteId(DataRouterStateHook$1.UseRouteError);
  if (error !== void 0) {
    return error;
  }
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext(DataRouterHook$1.UseNavigateStable);
  let id = useCurrentRouteId(DataRouterStateHook$1.UseNavigateStable);
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends$1({
        fromRouteId: id
      }, options));
    }
  }, [router, id]);
  return navigate;
}
function Navigate(_ref4) {
  let {
    to,
    replace,
    state,
    relative
  } = _ref4;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    future,
    static: isStatic
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let navigate = useNavigate();
  let path = resolveTo(to, getResolveToMatches(matches, future.v7_relativeSplatPath), locationPathname, relative === "path");
  let jsonPath = JSON.stringify(path);
  reactExports.useEffect(() => navigate(JSON.parse(jsonPath), {
    replace,
    state,
    relative
  }), [navigate, jsonPath, relative, replace, state]);
  return null;
}
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ? invariant(false) : void 0;
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = reactExports.useMemo(() => ({
    basename,
    navigator,
    static: staticProp,
    future: _extends$1({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = reactExports.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
    children,
    value: locationContext
  }));
}
new Promise(() => {
});
function mapRouteProperties(route) {
  let updates = {
    // Note: this check also occurs in createRoutesFromChildren so update
    // there if you change this -- please and thank you!
    hasErrorBoundary: route.ErrorBoundary != null || route.errorElement != null
  };
  if (route.Component) {
    Object.assign(updates, {
      element: /* @__PURE__ */ reactExports.createElement(route.Component),
      Component: void 0
    });
  }
  if (route.HydrateFallback) {
    Object.assign(updates, {
      hydrateFallbackElement: /* @__PURE__ */ reactExports.createElement(route.HydrateFallback),
      HydrateFallback: void 0
    });
  }
  if (route.ErrorBoundary) {
    Object.assign(updates, {
      errorElement: /* @__PURE__ */ reactExports.createElement(route.ErrorBoundary),
      ErrorBoundary: void 0
    });
  }
  return updates;
}

/**
 * React Router DOM v6.23.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "unstable_viewTransition"];
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e) {
}
function createBrowserRouter(routes, opts) {
  return createRouter({
    basename: opts == null ? void 0 : opts.basename,
    future: _extends({}, opts == null ? void 0 : opts.future, {
      v7_prependBasename: true
    }),
    history: createBrowserHistory({
      window: opts == null ? void 0 : opts.window
    }),
    hydrationData: (opts == null ? void 0 : opts.hydrationData) || parseHydrationData(),
    routes,
    mapRouteProperties: mapRouteProperties,
    unstable_dataStrategy: opts == null ? void 0 : opts.unstable_dataStrategy,
    window: opts == null ? void 0 : opts.window
  }).initialize();
}
function parseHydrationData() {
  var _window;
  let state = (_window = window) == null ? void 0 : _window.__staticRouterHydrationData;
  if (state && state.errors) {
    state = _extends({}, state, {
      errors: deserializeErrors(state.errors)
    });
  }
  return state;
}
function deserializeErrors(errors) {
  if (!errors) return null;
  let entries = Object.entries(errors);
  let serialized = {};
  for (let [key, val] of entries) {
    if (val && val.__type === "RouteErrorResponse") {
      serialized[key] = new ErrorResponseImpl(val.status, val.statusText, val.data, val.internal === true);
    } else if (val && val.__type === "Error") {
      if (val.__subType) {
        let ErrorConstructor = window[val.__subType];
        if (typeof ErrorConstructor === "function") {
          try {
            let error = new ErrorConstructor(val.message);
            error.stack = "";
            serialized[key] = error;
          } catch (e) {
          }
        }
      }
      if (serialized[key] == null) {
        let error = new Error(val.message);
        error.stack = "";
        serialized[key] = error;
      }
    } else {
      serialized[key] = val;
    }
  }
  return serialized;
}
const ViewTransitionContext = /* @__PURE__ */ reactExports.createContext({
  isTransitioning: false
});
const FetchersContext = /* @__PURE__ */ reactExports.createContext(/* @__PURE__ */ new Map());
const START_TRANSITION = "startTransition";
const startTransitionImpl = React$1[START_TRANSITION];
const FLUSH_SYNC = "flushSync";
const flushSyncImpl = ReactDOM[FLUSH_SYNC];
function startTransitionSafe(cb) {
  if (startTransitionImpl) {
    startTransitionImpl(cb);
  } else {
    cb();
  }
}
function flushSyncSafe(cb) {
  if (flushSyncImpl) {
    flushSyncImpl(cb);
  } else {
    cb();
  }
}
class Deferred {
  constructor() {
    this.status = "pending";
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (value) => {
        if (this.status === "pending") {
          this.status = "resolved";
          resolve(value);
        }
      };
      this.reject = (reason) => {
        if (this.status === "pending") {
          this.status = "rejected";
          reject(reason);
        }
      };
    });
  }
}
function RouterProvider(_ref) {
  let {
    fallbackElement,
    router,
    future
  } = _ref;
  let [state, setStateImpl] = reactExports.useState(router.state);
  let [pendingState, setPendingState] = reactExports.useState();
  let [vtContext, setVtContext] = reactExports.useState({
    isTransitioning: false
  });
  let [renderDfd, setRenderDfd] = reactExports.useState();
  let [transition, setTransition] = reactExports.useState();
  let [interruption, setInterruption] = reactExports.useState();
  let fetcherData = reactExports.useRef(/* @__PURE__ */ new Map());
  let {
    v7_startTransition
  } = future || {};
  let optInStartTransition = reactExports.useCallback((cb) => {
    if (v7_startTransition) {
      startTransitionSafe(cb);
    } else {
      cb();
    }
  }, [v7_startTransition]);
  let setState = reactExports.useCallback((newState, _ref2) => {
    let {
      deletedFetchers,
      unstable_flushSync: flushSync,
      unstable_viewTransitionOpts: viewTransitionOpts
    } = _ref2;
    deletedFetchers.forEach((key) => fetcherData.current.delete(key));
    newState.fetchers.forEach((fetcher, key) => {
      if (fetcher.data !== void 0) {
        fetcherData.current.set(key, fetcher.data);
      }
    });
    let isViewTransitionUnavailable = router.window == null || router.window.document == null || typeof router.window.document.startViewTransition !== "function";
    if (!viewTransitionOpts || isViewTransitionUnavailable) {
      if (flushSync) {
        flushSyncSafe(() => setStateImpl(newState));
      } else {
        optInStartTransition(() => setStateImpl(newState));
      }
      return;
    }
    if (flushSync) {
      flushSyncSafe(() => {
        if (transition) {
          renderDfd && renderDfd.resolve();
          transition.skipTransition();
        }
        setVtContext({
          isTransitioning: true,
          flushSync: true,
          currentLocation: viewTransitionOpts.currentLocation,
          nextLocation: viewTransitionOpts.nextLocation
        });
      });
      let t = router.window.document.startViewTransition(() => {
        flushSyncSafe(() => setStateImpl(newState));
      });
      t.finished.finally(() => {
        flushSyncSafe(() => {
          setRenderDfd(void 0);
          setTransition(void 0);
          setPendingState(void 0);
          setVtContext({
            isTransitioning: false
          });
        });
      });
      flushSyncSafe(() => setTransition(t));
      return;
    }
    if (transition) {
      renderDfd && renderDfd.resolve();
      transition.skipTransition();
      setInterruption({
        state: newState,
        currentLocation: viewTransitionOpts.currentLocation,
        nextLocation: viewTransitionOpts.nextLocation
      });
    } else {
      setPendingState(newState);
      setVtContext({
        isTransitioning: true,
        flushSync: false,
        currentLocation: viewTransitionOpts.currentLocation,
        nextLocation: viewTransitionOpts.nextLocation
      });
    }
  }, [router.window, transition, renderDfd, fetcherData, optInStartTransition]);
  reactExports.useLayoutEffect(() => router.subscribe(setState), [router, setState]);
  reactExports.useEffect(() => {
    if (vtContext.isTransitioning && !vtContext.flushSync) {
      setRenderDfd(new Deferred());
    }
  }, [vtContext]);
  reactExports.useEffect(() => {
    if (renderDfd && pendingState && router.window) {
      let newState = pendingState;
      let renderPromise = renderDfd.promise;
      let transition2 = router.window.document.startViewTransition(async () => {
        optInStartTransition(() => setStateImpl(newState));
        await renderPromise;
      });
      transition2.finished.finally(() => {
        setRenderDfd(void 0);
        setTransition(void 0);
        setPendingState(void 0);
        setVtContext({
          isTransitioning: false
        });
      });
      setTransition(transition2);
    }
  }, [optInStartTransition, pendingState, renderDfd, router.window]);
  reactExports.useEffect(() => {
    if (renderDfd && pendingState && state.location.key === pendingState.location.key) {
      renderDfd.resolve();
    }
  }, [renderDfd, transition, state.location, pendingState]);
  reactExports.useEffect(() => {
    if (!vtContext.isTransitioning && interruption) {
      setPendingState(interruption.state);
      setVtContext({
        isTransitioning: true,
        flushSync: false,
        currentLocation: interruption.currentLocation,
        nextLocation: interruption.nextLocation
      });
      setInterruption(void 0);
    }
  }, [vtContext.isTransitioning, interruption]);
  reactExports.useEffect(() => {
  }, []);
  let navigator = reactExports.useMemo(() => {
    return {
      createHref: router.createHref,
      encodeLocation: router.encodeLocation,
      go: (n) => router.navigate(n),
      push: (to, state2, opts) => router.navigate(to, {
        state: state2,
        preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
      }),
      replace: (to, state2, opts) => router.navigate(to, {
        replace: true,
        state: state2,
        preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
      })
    };
  }, [router]);
  let basename = router.basename || "/";
  let dataRouterContext = reactExports.useMemo(() => ({
    router,
    navigator,
    static: false,
    basename
  }), [router, navigator, basename]);
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(DataRouterContext.Provider, {
    value: dataRouterContext
  }, /* @__PURE__ */ reactExports.createElement(DataRouterStateContext.Provider, {
    value: state
  }, /* @__PURE__ */ reactExports.createElement(FetchersContext.Provider, {
    value: fetcherData.current
  }, /* @__PURE__ */ reactExports.createElement(ViewTransitionContext.Provider, {
    value: vtContext
  }, /* @__PURE__ */ reactExports.createElement(Router, {
    basename,
    location: state.location,
    navigationType: state.historyAction,
    navigator,
    future: {
      v7_relativeSplatPath: router.future.v7_relativeSplatPath
    }
  }, state.initialized || router.future.v7_partialHydration ? /* @__PURE__ */ reactExports.createElement(DataRoutes, {
    routes: router.routes,
    future: router.future,
    state
  }) : fallbackElement))))), null);
}
function DataRoutes(_ref3) {
  let {
    routes,
    future,
    state
  } = _ref3;
  return useRoutesImpl(routes, void 0, state, future);
}
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const Link = /* @__PURE__ */ reactExports.forwardRef(function LinkWithRef(_ref7, ref) {
  let {
    onClick,
    relative,
    reloadDocument,
    replace,
    state,
    target,
    to,
    preventScrollReset,
    unstable_viewTransition
  } = _ref7, rest = _objectWithoutPropertiesLoose(_ref7, _excluded);
  let {
    basename
  } = reactExports.useContext(NavigationContext);
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX.test(to)) {
    absoluteHref = to;
    if (isBrowser) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = stripBasename(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e) {
      }
    }
  }
  let href = useHref(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative,
    unstable_viewTransition
  });
  function handleClick(event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ reactExports.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref,
      target
    }))
  );
});
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmit"] = "useSubmit";
  DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook2["UseFetcher"] = "useFetcher";
  DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetcher"] = "useFetcher";
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative,
    unstable_viewTransition
  } = _temp === void 0 ? {} : _temp;
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, {
    relative
  });
  return reactExports.useCallback((event) => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      let replace = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
      navigate(to, {
        replace,
        state,
        preventScrollReset,
        relative,
        unstable_viewTransition
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative, unstable_viewTransition]);
}

var PathTemplate = /* @__PURE__ */ ((PathTemplate2) => {
  PathTemplate2["UNSELECTED_NOTE"] = "graph/%GRAPH_ID%/note";
  PathTemplate2["EXISTING_NOTE"] = "graph/%GRAPH_ID%/note/%SLUG%";
  PathTemplate2["NEW_NOTE"] = "graph/%GRAPH_ID%/note/new";
  PathTemplate2["LIST"] = "graph/%GRAPH_ID%/list";
  PathTemplate2["START"] = "start";
  PathTemplate2["STATS"] = "graph/%GRAPH_ID%/stats";
  PathTemplate2["FILES"] = "graph/%GRAPH_ID%/files";
  PathTemplate2["FILE"] = "graph/%GRAPH_ID%/files/%FILE_SLUG%";
  PathTemplate2["SETTINGS"] = "settings";
  PathTemplate2["SCRIPT"] = "graph/%GRAPH_ID%/script/%SCRIPT_SLUG%";
  return PathTemplate2;
})(PathTemplate || {});

const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "/neno/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (true && deps && deps.length > 0) {
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = Promise.all(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
          link.crossOrigin = "";
        }
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  return promise.then(() => baseModule()).catch((err) => {
    const e = new Event("vite:preloadError", { cancelable: true });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  });
};

const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};

const supportedLangs = [
  "en-US",
  "de-DE"
];
const defaultLang = "en-US";
let lang = defaultLang;
const localStorageValue = localStorage.getItem("language");
if (localStorageValue && supportedLangs.includes(localStorageValue)) {
  lang = localStorageValue;
} else if (supportedLangs.includes(navigator.language)) {
  lang = navigator.language;
}
localStorage.setItem("language", lang);
const langFile = (await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../intl/de-DE.json": () => __vitePreload(() => import('./de-DE-B4XRWTp2.js'),true?[]:void 0),"../intl/en-US.json": () => __vitePreload(() => import('./en-US-CQoQ2cNI.js'),true?[]:void 0)})), `../intl/${lang}.json`, 3)).default;
function l$4(key, replacements) {
  if (typeof langFile[key] === "string") {
    let output = langFile[key];
    for (const replacement in replacements) {
      if (Object.prototype.hasOwnProperty.call(replacements, replacement)) {
        output = output.replace(`{${replacement}}`, replacements[replacement]);
      }
    }
    return output;
  } else {
    console.warn("Translation not available: " + key);
    return key;
  }
}
function lf(key, replacements) {
  const output = l$4(key, replacements);
  if (output.includes("%EXTERNAL_LINK")) {
    const nodes = [];
    const regex = /%EXTERNAL_LINK\[(?<label>[^\]]*)\]\((?<url>[^)]*)\)/gm;
    const outerParts = output.split(regex);
    let i = 0;
    for (const match of output.matchAll(regex)) {
      nodes.push(/* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          children: outerParts[i]
        },
        `translation_${key}_op_${match.groups?.label}`
      ));
      nodes.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: match.groups?.url,
            target: "_blank",
            rel: "noreferrer noopener",
            children: match.groups?.label
          },
          `translation_${key}_match_${match.groups?.label}`
        )
      );
      i++;
    }
    nodes.push(outerParts[outerParts.length - 1]);
    return nodes;
  } else {
    return output;
  }
}
function getActiveLanguage() {
  return lang;
}
function setLanguage(language) {
  lang = language;
  localStorage.setItem("language", lang);
  location.reload();
}

const BASE_URL = "/neno/";
const VERSION = "8.5.1";

const DEFAULT_NOTE_CONTENT = "";
const LOCAL_GRAPH_ID = "local";
const ROOT_PATH = BASE_URL;
const ASSETS_PATH = `${ROOT_PATH}assets/`;
const ICON_PATH = `${ASSETS_PATH}icons/`;
const MAX_WIDTH_SMALL_SCREEN = 1280;
const SEARCH_RESULTS_PER_PAGE = 50;
const DEFAULT_DOCUMENT_TITLE = "NENO";
const FILE_PICKER_ACCEPT_TYPES = [
  {
    description: "Media file",
    accept: {
      "audio/*": [".mp3", ".flac"],
      "video/*": [".mp4", ".webm"],
      "application/*": [".pdf", ".js"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]
    }
  }
];
const SPAN_SEPARATOR = " · ";
const NOTE_FILE_EXTENSION = ".subtext";
const NOTE_MIME_TYPE = "text/subtext";
const NOTE_FILE_DESCRIPTION = "NENO subtext note";
const DEFAULT_FILE_SLUG_FOLDER = "files";
const NENO_SCRIPT_FILE_SUFFIX = ".neno.js";

function promisifyRequest(request) {
    return new Promise((resolve, reject) => {
        // @ts-ignore - file size hacks
        request.oncomplete = request.onsuccess = () => resolve(request.result);
        // @ts-ignore - file size hacks
        request.onabort = request.onerror = () => reject(request.error);
    });
}
function createStore(dbName, storeName) {
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    const dbp = promisifyRequest(request);
    return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
let defaultGetStoreFunc;
function defaultGetStore() {
    if (!defaultGetStoreFunc) {
        defaultGetStoreFunc = createStore('keyval-store', 'keyval');
    }
    return defaultGetStoreFunc;
}
/**
 * Get a value by its key.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function get(key, customStore = defaultGetStore()) {
    return customStore('readonly', (store) => promisifyRequest(store.get(key)));
}
/**
 * Set a value with a key.
 *
 * @param key
 * @param value
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function set(key, value, customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => {
        store.put(value, key);
        return promisifyRequest(store.transaction);
    });
}

class FileSystemAccessAPIStorageProvider {
  constructor(directoryHandle) {
    this.#directoryHandle = directoryHandle;
  }
  /** **************
    PRIVATE
  ****************/
  #directoryHandle;
  #descendantFolderHandles = /* @__PURE__ */ new Map();
  async #getSubFolderHandle(folderHandle, subDirName) {
    const subDir = await folderHandle.getDirectoryHandle(
      subDirName,
      {
        create: true
      }
    );
    return subDir;
  }
  async #getDescendantFolderHandle(folderHandle, descendantFolderPath) {
    if (!descendantFolderPath) {
      return folderHandle;
    }
    if (this.#descendantFolderHandles.has(descendantFolderPath)) {
      return this.#descendantFolderHandles.get(
        descendantFolderPath
      );
    }
    const pathSegments = descendantFolderPath.length > 0 ? this.#splitPath(descendantFolderPath) : [];
    let dirHandle = folderHandle;
    for (const pathSegment of pathSegments) {
      dirHandle = await this.#getSubFolderHandle(
        dirHandle,
        pathSegment
      );
    }
    this.#descendantFolderHandles.set(descendantFolderPath, dirHandle);
    return dirHandle;
  }
  async #getDescendantFileHandle(folderHandle, filePath, create) {
    const pathSegments = this.#splitPath(filePath);
    const folderPathSegments = pathSegments.slice(0, pathSegments.length - 1);
    const filename = pathSegments[pathSegments.length - 1];
    const destinationFolderHandle = folderPathSegments.length > 0 ? await this.#getDescendantFolderHandle(
      folderHandle,
      folderPathSegments.join(this.DS)
    ) : folderHandle;
    const fileHandle = await destinationFolderHandle.getFileHandle(
      filename,
      {
        create
      }
    );
    return fileHandle;
  }
  async #getFileHandle(requestPath, create) {
    return await this.#getDescendantFileHandle(
      this.#directoryHandle,
      requestPath,
      create
    );
  }
  /** **************
    PUBLIC
  ****************/
  DS = "/";
  async writeObject(requestPath, data) {
    const fileHandle = await this.#getFileHandle(requestPath, true);
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  }
  async renameFile(oldRequestPath, newRequestPath) {
    const oldFolder = oldRequestPath.substring(
      0,
      oldRequestPath.lastIndexOf("/")
    );
    const newFolder = newRequestPath.substring(
      0,
      newRequestPath.lastIndexOf("/")
    );
    if (oldFolder === newFolder) {
      const fileHandle = await this.#getFileHandle(oldRequestPath, true);
      const newEntryName = newRequestPath.substring(
        newRequestPath.indexOf("/") + 1
      );
      await fileHandle.move(newEntryName);
    } else {
      await this.writeObjectFromReadable(
        newRequestPath,
        await this.getReadableStream(oldRequestPath)
      );
      await this.removeObject(oldRequestPath);
    }
  }
  async writeObjectFromReadable(requestPath, readableStream) {
    const fileHandle = await this.#getFileHandle(requestPath, true);
    const writable = await fileHandle.createWritable();
    await readableStream.pipeTo(writable);
    const size = await this.getObjectSize(requestPath);
    return size;
  }
  async readObjectAsString(requestPath) {
    const fileHandle = await this.#getFileHandle(requestPath, false);
    const file = await fileHandle.getFile();
    const string = await file.text();
    return string;
  }
  async getReadableStream(requestPath, _range) {
    const fileHandle = await this.#getFileHandle(requestPath, false);
    const file = await fileHandle.getFile();
    const readable = file.stream();
    return readable;
  }
  async removeObject(requestPath) {
    const folderPath = requestPath.substring(
      0,
      requestPath.lastIndexOf(this.DS)
    );
    const dir = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      folderPath
    );
    const filename = requestPath.substring(requestPath.lastIndexOf(this.DS) + 1);
    await dir.removeEntry(filename);
  }
  async listSubDirectories(requestPath) {
    const dirHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      requestPath
    );
    const values = [];
    for await (const handle of dirHandle.values()) {
      values.push(handle);
    }
    const directoryNames = values.filter((value) => value.kind === "directory").map((dirHandle2) => dirHandle2.name);
    return directoryNames;
  }
  async #getFilenamesInFolder(folderPath) {
    const dirHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      folderPath
    );
    const filenames = [];
    for await (const handle of dirHandle.values()) {
      if (handle.kind === "file") {
        filenames.push(handle.name);
      } else {
        const filesInSubFolder = await this.#getFilenamesInFolder(
          this.#joinPath(folderPath, handle.name)
        );
        const requestPaths = filesInSubFolder.map((filename) => {
          return this.#joinPath(handle.name, filename);
        });
        filenames.push(...requestPaths);
      }
    }
    return filenames;
  }
  async getAllObjectNames() {
    return this.#getFilenamesInFolder("");
  }
  #joinPath(...args) {
    return args.filter((arg) => arg.length > 0).join(this.DS);
  }
  #splitPath(path) {
    return path.split(this.DS);
  }
  async getObjectSize(requestPath) {
    const fileHandle = await this.#getFileHandle(requestPath, false);
    const file = await fileHandle.getFile();
    const size = file.size;
    return size;
  }
  async #getFolderSize(folderPath) {
    const folderHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      folderPath
    );
    let sum = 0;
    for await (const handle of folderHandle.values()) {
      if (handle.kind === "file") {
        const file = await handle.getFile();
        const fileSize = file.size;
        sum += fileSize;
      } else {
        const folderSize = await this.#getFolderSize(
          this.#joinPath(folderPath, handle.name)
        );
        sum += folderSize;
      }
    }
    return sum;
  }
  async getTotalSize() {
    return this.#getFolderSize("");
  }
}

const MimeTypes = new Map(Object.entries({
  "png": "image/png",
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg",
  "webp": "image/webp",
  "gif": "image/gif",
  "svg": "image/svg+xml",
  "pdf": "application/pdf",
  "js": "text/javascript",
  "json": "application/json",
  "mp3": "audio/mp3",
  "flac": "audio/flac",
  "mp4": "video/mp4",
  "webm": "video/webm",
  "md": "text/markdown"
}));

var ErrorMessage = /* @__PURE__ */ ((ErrorMessage2) => {
  ErrorMessage2["GRAPH_NOT_FOUND"] = "GRAPH_NOT_FOUND";
  ErrorMessage2["NOTE_NOT_FOUND"] = "NOTE_NOT_FOUND";
  ErrorMessage2["PINNED_NOTES_NOT_FOUND"] = "PINNED_NOTES_NOT_FOUND";
  ErrorMessage2["PINNED_NOTE_NOT_FOUND"] = "PINNED_NOTE_NOT_FOUND";
  ErrorMessage2["FILE_NOT_FOUND"] = "FILE_NOT_FOUND";
  ErrorMessage2["INVALID_MIME_TYPE"] = "INVALID_MIME_TYPE";
  ErrorMessage2["SLUG_EXISTS"] = "SLUG_EXISTS";
  ErrorMessage2["INVALID_NOTE_STRUCTURE"] = "INVALID_NOTE_STRUCTURE";
  ErrorMessage2["UNAUTHORIZED"] = "UNAUTHORIZED";
  ErrorMessage2["INVALID_FILENAME_EXTENSION"] = "INVALID_FILENAME_EXTENSION";
  ErrorMessage2["NOT_SUPPORTED_BY_STORAGE_PROVIDER"] = "NOT_SUPPORTED_BY_STORAGE_PROVIDER";
  ErrorMessage2["INVALID_SLUG"] = "INVALID_SLUG";
  ErrorMessage2["INVALID_ALIAS"] = "INVALID_ALIAS";
  ErrorMessage2["ALIAS_EXISTS"] = "ALIAS_EXISTS";
  return ErrorMessage2;
})(ErrorMessage || {});

var MediaType = /* @__PURE__ */ ((MediaType2) => {
  MediaType2["IMAGE"] = "image";
  MediaType2["PDF"] = "pdf";
  MediaType2["AUDIO"] = "audio";
  MediaType2["VIDEO"] = "video";
  MediaType2["TEXT"] = "text";
  MediaType2["OTHER"] = "other";
  return MediaType2;
})(MediaType || {});

var BlockType = /* @__PURE__ */ ((BlockType2) => {
  BlockType2["PARAGRAPH"] = "paragraph";
  BlockType2["HEADING"] = "heading";
  BlockType2["UNORDERED_LIST_ITEM"] = "unordered-list-item";
  BlockType2["ORDERED_LIST_ITEM"] = "ordered-list-item";
  BlockType2["CODE"] = "code";
  BlockType2["QUOTE"] = "quote";
  BlockType2["KEY_VALUE_PAIR"] = "key-value-pair";
  BlockType2["EMPTY"] = "empty";
  return BlockType2;
})(BlockType || {});

class CharIterator {
  #chars;
  #index;
  constructor(input) {
    this.#chars = Array.from(input);
    this.#index = -1;
  }
  next() {
    this.#index++;
    const done = this.#index === this.#chars.length;
    return done ? {
      done,
      value: null
    } : {
      done,
      value: this.#chars[this.#index]
    };
  }
  peek(numberOfChars) {
    return this.#chars.slice(this.#index + 1, this.#index + 1 + numberOfChars);
  }
  peekBack(numberOfChars) {
    return this.#chars[this.#index - (numberOfChars ?? 1)];
  }
  getRest() {
    return this.#chars.slice(this.#index).join("");
  }
  charsUntil(delimiter, offset) {
    const stringToAnalyse = this.#chars.slice(this.#index + (offset ?? 0)).join("");
    const delimiterIndex = stringToAnalyse.indexOf(delimiter, 0);
    if (delimiterIndex === -1) {
      return null;
    }
    const charsUntilDelimiter = stringToAnalyse.slice(this.#index, delimiterIndex);
    return charsUntilDelimiter;
  }
}

var SpanType = /* @__PURE__ */ ((SpanType2) => {
  SpanType2["NORMAL_TEXT"] = "NORMAL_TEXT";
  SpanType2["HYPERLINK"] = "HYPERLINK";
  SpanType2["SLASHLINK"] = "SLASHLINK";
  SpanType2["WIKILINK"] = "WIKILINK";
  return SpanType2;
})(SpanType || {});

const isWhiteSpace$1 = (string) => {
  return string.trim().length === 0;
};
const parseText = (text) => {
  const spans = [];
  const iterator = new CharIterator(text);
  let currentSpanType = null;
  let currentSpanText = "";
  while (true) {
    const step = iterator.next();
    if (step.done) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      break;
    }
    const char = step.value;
    const lastChar = iterator.peekBack();
    if ((typeof lastChar !== "string" || isWhiteSpace$1(lastChar)) && char === "h" && (iterator.peek(5).join("") === "ttp:/" || iterator.peek(6).join("") === "ttps:/")) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.HYPERLINK;
    } else if ((typeof lastChar !== "string" || isWhiteSpace$1(lastChar)) && char === "/" && currentSpanType !== SpanType.WIKILINK && !isWhiteSpace$1(iterator.peek(1).join(""))) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.SLASHLINK;
    } else if (isWhiteSpace$1(char) && currentSpanType !== SpanType.NORMAL_TEXT && currentSpanType !== SpanType.WIKILINK) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.NORMAL_TEXT;
    } else if (char === "[" && iterator.peek(1).join("") === "[" && iterator.getRest().includes("]]") && !iterator.charsUntil("]]", 2)?.includes("[") && !iterator.charsUntil("]]", 2)?.includes("]")) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.WIKILINK;
    } else if (currentSpanType === SpanType.WIKILINK && lastChar === "]" && iterator.peekBack(2) === "]") {
      spans.push({
        type: currentSpanType,
        text: currentSpanText
      });
      currentSpanText = "";
      currentSpanType = SpanType.NORMAL_TEXT;
    } else if (!currentSpanType) {
      currentSpanType = SpanType.NORMAL_TEXT;
    }
    currentSpanText += char;
  }
  return spans;
};

const HEADING_SIGIL = "#";
const CODE_SIGIL = "```";
const QUOTE_SIGIL = ">";
const parse = (input) => {
  const lines = input.replaceAll("\r", "").split("\n");
  let withinBlock = false;
  let codeBlockJustStarted = false;
  const blocks = lines.reduce(
    (blocks2, line) => {
      if (withinBlock) {
        const currentBlock = blocks2[blocks2.length - 1];
        if (currentBlock.type === BlockType.CODE) {
          if (line.trimEnd() === CODE_SIGIL) {
            withinBlock = false;
            return blocks2;
          }
          const lineValue = line.trimEnd() === "\\" + CODE_SIGIL ? line.substring(1) : line;
          if (codeBlockJustStarted) {
            currentBlock.data.code += lineValue;
            codeBlockJustStarted = false;
          } else {
            currentBlock.data.code += "\n" + lineValue;
          }
          return blocks2;
        } else {
          throw new Error(
            "Subwaytext parser: Within unknown block: " + currentBlock.type
          );
        }
      } else {
        if (line.startsWith(HEADING_SIGIL)) {
          const newBlock = {
            type: BlockType.HEADING,
            data: {
              whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
              text: parseText(line.substring(1).trimStart())
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else if (/^\$[\p{L}\p{M}\d\-_]+(\s(.*)?)?$/gu.test(line)) {
          const newBlock = {
            type: BlockType.KEY_VALUE_PAIR,
            data: {
              key: line.substring(1).match(/^[^\s]+/)?.[0] ?? "",
              whitespace: line.substring(1).match(/\s+/g)?.[0] ?? "",
              value: parseText(
                Array.from(line.matchAll(/^[^\s]+\s*(.*)$/g))[0][1] ?? ""
              )
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else if (line.startsWith("-")) {
          const newBlock = {
            type: BlockType.UNORDERED_LIST_ITEM,
            data: {
              whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
              text: parseText(line.substring(1).trimStart())
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else if (line.startsWith(QUOTE_SIGIL)) {
          const newBlock = {
            type: BlockType.QUOTE,
            data: {
              whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
              text: parseText(line.substring(1).trimStart())
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else if (line.match(/^\d+\./)) {
          const index = line.match(/^\d+/)?.[0] ?? "0";
          const whitespace = line.match(/^\d+\.(\s*)/)?.[1] ?? "";
          const textString = line.match(/^\d+\.\s*(.*)/)?.[1] ?? "";
          const newBlock = {
            type: BlockType.ORDERED_LIST_ITEM,
            data: {
              index,
              whitespace,
              text: parseText(textString)
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else if (line.startsWith(CODE_SIGIL)) {
          withinBlock = true;
          codeBlockJustStarted = true;
          const newBlock = {
            type: BlockType.CODE,
            data: {
              code: "",
              contentType: line.substring(CODE_SIGIL.length).trim(),
              whitespace: line.substring(3).match(/^\s*/g)?.[0] ?? ""
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else if (line.trim().length === 0) {
          const newBlock = {
            type: BlockType.EMPTY,
            data: {
              whitespace: line
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        } else {
          const newBlock = {
            type: BlockType.PARAGRAPH,
            data: {
              text: parseText(line)
            }
          };
          blocks2.push(newBlock);
          return blocks2;
        }
      }
    },
    []
  );
  return blocks;
};
if (
  // @ts-ignore
  typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope
) {
  onmessage = (event) => {
    const eventData = event.data;
    if (eventData.action === "PARSE_NOTES") {
      const notes = eventData.notes;
      if (!Array.isArray(notes)) {
        throw new Error(
          "Subwaytext worker: Expected an array of notes, received " + typeof notes + " instead."
        );
      }
      const notesParsed = notes.map((note) => {
        return {
          id: note.id,
          parsedContent: parse(note.content)
        };
      });
      postMessage(notesParsed);
    }
  };
}

var CanonicalNoteHeader = /* @__PURE__ */ ((CanonicalNoteHeader2) => {
  CanonicalNoteHeader2["CREATED_AT"] = "created-at";
  CanonicalNoteHeader2["UPDATED_AT"] = "updated-at";
  CanonicalNoteHeader2["FLAGS"] = "neno-flags";
  return CanonicalNoteHeader2;
})(CanonicalNoteHeader || {});

const getExtensionFromFilename = (filename) => {
  const posOfDot = filename.lastIndexOf(".");
  if (posOfDot === -1) {
    return null;
  }
  const extension = filename.substring(posOfDot + 1).toLowerCase();
  if (extension.length === 0) {
    return null;
  }
  return extension;
};
const removeExtensionFromFilename = (filename) => {
  const posOfDot = filename.lastIndexOf(".");
  if (posOfDot === -1) {
    return filename;
  }
  return filename.substring(0, posOfDot);
};
const getMediaTypeFromFilename = (filename) => {
  const map = new Map(Object.entries({
    "png": MediaType.IMAGE,
    "jpg": MediaType.IMAGE,
    "jpeg": MediaType.IMAGE,
    "webp": MediaType.IMAGE,
    "gif": MediaType.IMAGE,
    "svg": MediaType.IMAGE,
    "pdf": MediaType.PDF,
    "wav": MediaType.AUDIO,
    "mp3": MediaType.AUDIO,
    "ogg": MediaType.AUDIO,
    "flac": MediaType.AUDIO,
    "mp4": MediaType.VIDEO,
    "webm": MediaType.VIDEO,
    "html": MediaType.TEXT,
    "css": MediaType.TEXT,
    "js": MediaType.TEXT,
    "json": MediaType.TEXT,
    "c": MediaType.TEXT,
    "cpp": MediaType.TEXT,
    "rs": MediaType.TEXT,
    "txt": MediaType.TEXT,
    "md": MediaType.TEXT,
    "xq": MediaType.TEXT,
    "xql": MediaType.TEXT,
    "xqm": MediaType.TEXT,
    "opml": MediaType.TEXT
  }));
  const extension = getExtensionFromFilename(filename);
  if (!extension) {
    return MediaType.OTHER;
  }
  return map.has(extension) ? map.get(extension) : MediaType.OTHER;
};
const shortenText$1 = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
};
const setsAreEqual = (a, b) => {
  return a.size === b.size && [...a].every((x) => b.has(x));
};
const getRandomKey = (collection) => {
  const index = Math.floor(Math.random() * collection.size);
  let cntr = 0;
  for (const key of collection.keys()) {
    if (cntr++ === index) {
      return key;
    }
  }
  return null;
};
const toISODateTime = (date) => {
  const timeZone = -date.getTimezoneOffset();
  const dif = timeZone >= 0 ? "+" : "-";
  const pad = (num) => {
    return num.toString().padStart(2, "0");
  };
  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + "T" + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds()) + dif + pad(Math.floor(Math.abs(timeZone) / 60)) + ":" + pad(Math.abs(timeZone) % 60);
};
const getCurrentISODateTime = () => {
  const date = /* @__PURE__ */ new Date();
  return toISODateTime(date);
};
const toUnixTimestamp = (date) => {
  return Math.floor(new Date(date).getTime() / 1e3);
};
const getCompareKeyForTimestamp = (dateRaw) => {
  if (!dateRaw) return 0;
  const date = new Date(dateRaw);
  return toUnixTimestamp(date);
};
const unixToISOTimestamp = (unixTimestamp) => {
  return toISODateTime(new Date(unixTimestamp));
};
const getEarliestISOTimestamp = (...timestamps) => {
  let earliest = timestamps[0];
  let earliestUNIX = toUnixTimestamp(new Date(earliest));
  for (let i = 1; i < timestamps.length; i++) {
    const unixTimestamp = toUnixTimestamp(new Date(timestamps[i]));
    if (unixTimestamp < earliestUNIX) {
      earliest = timestamps[i];
      earliestUNIX = unixTimestamp;
    }
  }
  return earliest;
};
const getLatestISOTimestamp = (...timestamps) => {
  let latest = timestamps[0];
  let latestUNIX = toUnixTimestamp(new Date(latest));
  for (let i = 1; i < timestamps.length; i++) {
    const unixTimestamp = toUnixTimestamp(new Date(timestamps[i]));
    if (unixTimestamp > latestUNIX) {
      latest = timestamps[i];
      latestUNIX = unixTimestamp;
    }
  }
  return latest;
};

const isValidFileSlug = (slug) => {
  const numberOfSlashes = slug.match(/\//gi)?.length ?? 0;
  return numberOfSlashes >= 1 && !slug.startsWith("/");
};
const trimSlug = (slug) => {
  return slug.replace(/^-+/, "").replace(/-+$/, "");
};
const sluggifyWikilinkText = (text) => {
  const slug = text.trim().replace(/['’]+/g, "").replace(/[^\p{L}\p{M}\d\-_/]+/gu, "-").replace(/(?<!\/)\/(?!\/)/g, "-").replace(/\/\/+/g, "/").replace(/-+/g, "-").toLowerCase();
  return trimSlug(slug);
};
const sluggifyFilename = (text) => {
  const slug = text.trim().replace(/['’]+/g, "").replace(/[^\p{L}\p{M}\d\-._]+/gu, "-").replace(/-+/g, "-").replace(/^\./g, "").toLowerCase();
  return trimSlug(slug);
};
const sluggifyNoteText = (text) => {
  const slug = text.trim().replace(/['’]+/g, "").replace(/[^\p{L}\p{M}\d\-_]+/gu, "-").replace(/-+/g, "-").toLowerCase();
  return trimSlug(slug).substring(0, 200);
};
const isValidSlug = (slug) => {
  return slug.length > 0 && slug.length <= 200 && slug.match(/^[\p{L}\d_][\p{L}\d\-/._]*$/u) !== null;
};
const isValidNoteSlug = (slug) => {
  return slug.length > 0 && slug.length <= 200 && slug.match(/^[\p{L}\d_][\p{L}\d\-/_]*$/u) !== null;
};
const isValidSlugOrEmpty = (slug) => {
  return isValidSlug(slug) || slug.length === 0;
};
const isValidNoteSlugOrEmpty = (slug) => {
  return isValidNoteSlug(slug) || slug.length === 0;
};
const getSlugsFromInlineText = (text) => {
  return text.filter(
    (span) => {
      return span.type === SpanType.SLASHLINK || span.type === SpanType.WIKILINK;
    }
  ).map((span) => {
    if (span.type === SpanType.SLASHLINK) {
      return span.text.substring(1);
    } else {
      return sluggifyWikilinkText(span.text.substring(2, span.text.length - 2));
    }
  });
};
const createSlug = (noteContent, existingSlugs) => {
  const title = getNoteTitle(noteContent);
  let slugStem = sluggifyNoteText(title);
  let n = 1;
  if (!slugStem) {
    slugStem = "new";
  }
  while (true) {
    const showIntegerSuffix = slugStem === "new" || n > 1;
    const slug = showIntegerSuffix ? `${slugStem}-${n}` : slugStem;
    if (!existingSlugs.includes(slug)) {
      return slug;
    }
    n++;
  }
};
const getSlugFromFilename = (folder, filename, existingFiles) => {
  const existingFileSlugs = existingFiles.map((file) => file.slug);
  const extension = getExtensionFromFilename(filename);
  const filenameWithoutExtension = removeExtensionFromFilename(filename);
  const sluggifiedFileStem = sluggifyFilename(filenameWithoutExtension);
  let n = 1;
  while (true) {
    const showIntegerSuffix = n > 1;
    const stemWithOptionalIntegerSuffix = showIntegerSuffix ? `${sluggifiedFileStem}-${n}` : sluggifiedFileStem;
    const slug = folder + "/" + stemWithOptionalIntegerSuffix + (extension ? (stemWithOptionalIntegerSuffix ? "." : "") + extension.trim().toLowerCase() : "");
    if (!existingFileSlugs.includes(slug)) {
      return slug;
    }
    n++;
  }
};
const getFilenameFromFileSlug = (fileSlug) => {
  if (!isValidFileSlug(fileSlug)) {
    throw new Error("Not a file slug: " + fileSlug);
  }
  return fileSlug.substring(fileSlug.indexOf("/") + 1);
};

var WriteGraphMetadataAction = /* @__PURE__ */ ((WriteGraphMetadataAction2) => {
  WriteGraphMetadataAction2["NONE"] = "NONE";
  WriteGraphMetadataAction2["WRITE"] = "WRITE";
  WriteGraphMetadataAction2["UPDATE_TIMESTAMP_AND_WRITE"] = "UPDATE_TIMESTAMP_AND_WRITE";
  return WriteGraphMetadataAction2;
})(WriteGraphMetadataAction || {});

function serializeInlineText(spans) {
  return spans.reduce((acc, span) => {
    return acc + span.text;
  }, "");
}
function serializeParagraph(block) {
  return serializeInlineText(block.data.text);
}
function serializeHeading(block) {
  return "#" + block.data.whitespace + serializeInlineText(block.data.text);
}
function serializeKeyValuePair(block) {
  return "$" + block.data.key + block.data.whitespace + serializeInlineText(block.data.value);
}
function serializeQuote(block) {
  return ">" + block.data.whitespace + serializeInlineText(block.data.text);
}
function serializeEmpty(block) {
  return block.data.whitespace;
}
function serializeCodeString(code) {
  return code.replace(/^```(.*)/gm, "\\```$1");
}
function serializeCodeBlock(block) {
  return "```" + block.data.whitespace + block.data.contentType + "\n" + serializeCodeString(block.data.code) + "\n```";
}
function serializeUnorderedListItem(block) {
  return "-" + block.data.whitespace + serializeInlineText(block.data.text);
}
function serializeOrderedListItem(block) {
  return block.data.index + "." + block.data.whitespace + serializeInlineText(block.data.text);
}
function serialize(blocks) {
  return blocks.map((block) => {
    switch (block.type) {
      case BlockType.PARAGRAPH:
        return serializeParagraph(block);
      case BlockType.HEADING:
        return serializeHeading(block);
      case BlockType.UNORDERED_LIST_ITEM:
        return serializeUnorderedListItem(block);
      case BlockType.ORDERED_LIST_ITEM:
        return serializeOrderedListItem(block);
      case BlockType.CODE:
        return serializeCodeBlock(block);
      case BlockType.QUOTE:
        return serializeQuote(block);
      case BlockType.KEY_VALUE_PAIR:
        return serializeKeyValuePair(block);
      case BlockType.EMPTY:
        return serializeEmpty(block);
    }
  }).join("\n");
}

const removeSlugFromIndexes = (graph, slug) => {
  graph.indexes.blocks.delete(slug);
  graph.indexes.outgoingLinks.delete(slug);
  graph.indexes.backlinks.delete(slug);
  graph.indexes.backlinks.forEach((backlinks) => {
    backlinks.delete(slug);
  });
};
const updateBacklinksIndex = (graph, ourSlug, ourOutgoingLinks) => {
  let ourBacklinks;
  if (graph.indexes.backlinks.has(ourSlug)) {
    ourBacklinks = graph.indexes.backlinks.get(ourSlug);
  } else {
    ourBacklinks = /* @__PURE__ */ new Set();
    graph.indexes.backlinks.set(ourSlug, ourBacklinks);
  }
  const ourAliases = getAliasesOfSlug(graph, ourSlug);
  for (const someExistingSlug of graph.notes.keys()) {
    if (someExistingSlug === ourSlug) {
      continue;
    }
    if (ourOutgoingLinks.includes(someExistingSlug)) {
      graph.indexes.backlinks.get(someExistingSlug).add(ourSlug);
    } else {
      graph.indexes.backlinks.get(someExistingSlug).delete(ourSlug);
    }
    const aliasesOfSomeExistingSlug = getAliasesOfSlug(graph, someExistingSlug);
    if (ourOutgoingLinks.some((outgoingLink) => {
      return aliasesOfSomeExistingSlug.has(outgoingLink);
    })) {
      graph.indexes.backlinks.get(someExistingSlug).add(ourSlug);
    }
    const theirOutgoingLinks = graph.indexes.outgoingLinks.get(
      someExistingSlug
    );
    if (theirOutgoingLinks.has(ourSlug) || [...ourAliases].some((alias) => {
      return theirOutgoingLinks.has(alias);
    })) {
      ourBacklinks.add(someExistingSlug);
    }
  }
};
const updateBlockIndex = (graph, existingNote) => {
  const blocks = parse(existingNote.content);
  graph.indexes.blocks.set(
    existingNote.meta.slug,
    blocks
  );
  return blocks;
};
const updateOutgoingLinksIndex = (graph, existingNote, blocks) => {
  const ourSlug = existingNote.meta.slug;
  const ourOutgoingLinks = getSlugsFromParsedNote(blocks);
  graph.indexes.outgoingLinks.set(ourSlug, new Set(ourOutgoingLinks));
  return ourOutgoingLinks;
};
const updateIndexes = (graph, existingNote) => {
  const blocks = updateBlockIndex(graph, existingNote);
  const ourOutgoingLinks = updateOutgoingLinksIndex(
    graph,
    existingNote,
    blocks
  );
  updateBacklinksIndex(graph, existingNote.meta.slug, ourOutgoingLinks);
};

const parseNoteHeaders = (note) => {
  const headerSection = note.substring(0, note.indexOf("\n\n"));
  const regex = /^:([^:]*):(.*)$/gm;
  const headers = /* @__PURE__ */ new Map();
  for (const [_match, key, value] of headerSection.matchAll(regex)) {
    headers.set(key, value);
  }
  return headers;
};
const serializeNoteHeaders = (headers) => {
  return Array.from(headers.entries()).map(([key, value]) => {
    return ":" + key + ":" + value;
  }).join("\n");
};
const canonicalHeaderKeys = /* @__PURE__ */ new Map([
  [
    CanonicalNoteHeader.CREATED_AT,
    (meta, val) => {
      meta.createdAt = val;
    }
  ],
  [
    CanonicalNoteHeader.UPDATED_AT,
    (meta, val) => {
      meta.updatedAt = val;
    }
  ],
  [
    CanonicalNoteHeader.FLAGS,
    (meta, val) => {
      meta.flags = val.trim().length > 0 ? val.trim().split(",") : [];
    }
  ]
]);
const cleanSerializedNote = (serializedNote) => {
  return serializedNote.replace(/\r/g, "");
};
const parseSerializedExistingNote = (serializedNote, slug) => {
  const serializedNoteCleaned = cleanSerializedNote(serializedNote);
  const headers = parseNoteHeaders(serializedNoteCleaned);
  const partialMeta = {};
  const additionalHeaders = {};
  for (const [key, value] of headers.entries()) {
    if (canonicalHeaderKeys.has(key)) {
      canonicalHeaderKeys.get(key)(
        partialMeta,
        value
      );
    } else {
      additionalHeaders[key] = value;
    }
  }
  const meta = {
    slug,
    createdAt: partialMeta.createdAt,
    updatedAt: partialMeta.updatedAt,
    flags: partialMeta.flags ?? [],
    additionalHeaders
  };
  const note = {
    content: headers.size > 0 ? serializedNoteCleaned.substring(
      serializedNoteCleaned.indexOf("\n\n") + 2
    ) : serializedNoteCleaned,
    meta
  };
  return note;
};
const parseSerializedNewNote = (serializedNote) => {
  const serializedNoteCleaned = cleanSerializedNote(serializedNote);
  const headers = parseNoteHeaders(serializedNoteCleaned);
  const partialMeta = {};
  const additionalHeaders = {};
  for (const [key, value] of headers.entries()) {
    if (canonicalHeaderKeys.has(key)) {
      canonicalHeaderKeys.get(key)(
        partialMeta,
        value
      );
    } else {
      additionalHeaders[key] = value;
    }
  }
  const meta = {
    flags: partialMeta.flags ?? [],
    additionalHeaders
  };
  const note = {
    content: headers.size > 0 ? serializedNoteCleaned.substring(
      serializedNoteCleaned.indexOf("\n\n") + 2
    ) : serializedNoteCleaned,
    meta
  };
  return note;
};
const serializeNote = (note) => {
  const headersToSerialize = /* @__PURE__ */ new Map();
  if (note.meta.createdAt) {
    headersToSerialize.set(
      CanonicalNoteHeader.CREATED_AT,
      note.meta.createdAt.toString()
    );
  }
  if (note.meta.updatedAt) {
    headersToSerialize.set(
      CanonicalNoteHeader.UPDATED_AT,
      note.meta.updatedAt.toString()
    );
  }
  if (note.meta.flags.length > 0) {
    headersToSerialize.set(
      CanonicalNoteHeader.FLAGS,
      note.meta.flags.join(",")
    );
  }
  for (const key in note.meta.additionalHeaders) {
    if (Object.hasOwn(note.meta.additionalHeaders, key)) {
      headersToSerialize.set(key, note.meta.additionalHeaders[key]);
    }
  }
  return serializeNoteHeaders(headersToSerialize) + "\n\n" + note.content;
};
const serializeNewNote = (note) => {
  const headers = /* @__PURE__ */ new Map([
    [
      CanonicalNoteHeader.FLAGS,
      note.meta.flags.join(",")
    ]
  ]);
  return serializeNoteHeaders(headers) + "\n\n" + note.content;
};
const getNumberOfCharacters = (note) => {
  return note.content.length;
};
const removeWikilinkPunctuation = (text) => {
  return text.replace(/(\[\[)|(]])/g, "");
};
const removeHeadingSigil = (text) => {
  return text.replace(/^#+\s*/, "");
};
const removeQuoteBlockSigil = (text) => {
  return text.replace(/^>\s*/, "");
};
const getNoteTitle = (noteContent, maxLength = 800) => {
  const lines = noteContent.split("\n");
  const firstContentLine = lines.find((line) => line.trim().length > 0);
  if (!firstContentLine) {
    return "";
  }
  const textNormalized = removeWikilinkPunctuation(
    removeHeadingSigil(removeQuoteBlockSigil(firstContentLine))
  );
  const titleShortened = shortenText$1(textNormalized, maxLength).trim();
  return titleShortened;
};
const getOutgoingLinksToOtherNotes = (graph, slug) => {
  if (!graph.indexes.outgoingLinks.has(slug)) {
    throw new Error("Could not determine outgoing links of " + slug);
  }
  const slugs = graph.indexes.outgoingLinks.get(slug);
  const validNoteSlugs = Array.from(slugs).filter((outgoingSlug) => {
    return graph.notes.has(outgoingSlug) && outgoingSlug !== slug || graph.aliases.has(outgoingSlug) && graph.aliases.get(outgoingSlug) !== slug;
  }).map((outgoingSlug) => {
    return graph.aliases.has(outgoingSlug) ? graph.aliases.get(outgoingSlug) : outgoingSlug;
  });
  return new Set(validNoteSlugs);
};
const getAliasesOfSlug = (graph, slug) => {
  return new Set(
    Array.from(graph.aliases.entries()).filter((entry) => {
      return entry[1] === slug;
    }).map((entry) => {
      return entry[0];
    })
  );
};
const getNotePreview = (graph, slug) => {
  if (!graph.notes.has(slug)) {
    throw new Error("Could not generate note preview of " + slug);
  }
  const note = graph.notes.get(slug);
  return {
    content: note.content,
    slug,
    aliases: getAliasesOfSlug(graph, slug),
    title: getNoteTitle(note.content),
    createdAt: note.meta.createdAt,
    updatedAt: note.meta.updatedAt
  };
};
const getBacklinks = (graph, slug) => {
  const backlinkSlugs = graph.indexes.backlinks.get(slug);
  if (!backlinkSlugs) {
    throw new Error("Could not determine backlinks for slug " + slug);
  }
  return Array.from(backlinkSlugs).map((slug2) => {
    const note = graph.notes.get(slug2);
    const backlink = {
      slug: note.meta.slug,
      aliases: getAliasesOfSlug(graph, note.meta.slug),
      title: getNoteTitle(note.content),
      createdAt: note.meta.createdAt,
      updatedAt: note.meta.updatedAt
    };
    return backlink;
  });
};
const getNumberOfLinkedNotes = (graph, slug) => {
  const outgoingLinks = getOutgoingLinksToOtherNotes(graph, slug);
  const backlinks = getBacklinks(graph, slug);
  return {
    outgoing: outgoingLinks.size,
    back: backlinks.length,
    sum: outgoingLinks.size + backlinks.length
  };
};
const getNumberOfUnlinkedNotes = (graph) => {
  return Array.from(graph.notes.keys()).filter((slug) => {
    return getNumberOfLinkedNotes(graph, slug).sum === 0;
  }).length;
};
const getAllInlineSpans = (blocks) => {
  const spans = [];
  blocks.forEach((block) => {
    if (block.type === BlockType.PARAGRAPH) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.HEADING) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.QUOTE) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.ORDERED_LIST_ITEM) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.UNORDERED_LIST_ITEM) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.KEY_VALUE_PAIR) {
      spans.push(...block.data.value);
    }
  });
  return spans;
};
const getFileSlugsInNote = (graph, noteSlug) => {
  const blocks = graph.indexes.blocks.get(noteSlug);
  const allInlineSpans = getAllInlineSpans(blocks);
  const allUsedSlugs = getSlugsFromInlineText(allInlineSpans);
  return allUsedSlugs.filter(isValidFileSlug);
};
const getFileInfos = (graph, slug) => {
  const fileSlugs = getFileSlugsInNote(graph, slug);
  const files = graph.metadata.files.filter((file) => fileSlugs.includes(file.slug));
  return files;
};
const getBlocks = (note, blockIndex) => {
  const slug = note.meta.slug;
  let parsedContent = blockIndex.get(slug);
  if (!parsedContent) {
    parsedContent = parse(note.content);
    blockIndex.set(slug, parsedContent);
  }
  return parsedContent;
};
const createNoteToTransmit = async (existingNote, graph) => {
  const noteToTransmit = {
    content: existingNote.content,
    meta: existingNote.meta,
    outgoingLinks: Array.from(
      getOutgoingLinksToOtherNotes(graph, existingNote.meta.slug)
    ).map((slug) => {
      const notePreview = getNotePreview(graph, slug);
      return notePreview;
    }),
    backlinks: getBacklinks(graph, existingNote.meta.slug),
    numberOfCharacters: getNumberOfCharacters(existingNote),
    numberOfBlocks: getBlocks(existingNote, graph.indexes.blocks).length,
    files: getFileInfos(graph, existingNote.meta.slug),
    aliases: getAliasesOfSlug(graph, existingNote.meta.slug)
  };
  return noteToTransmit;
};
const mapInlineSpans = (blocks, mapper) => {
  return blocks.map((block) => {
    if (block.type === BlockType.PARAGRAPH) {
      block.data.text = block.data.text.map(mapper);
    } else if (block.type === BlockType.HEADING) {
      block.data.text = block.data.text.map(mapper);
    } else if (block.type === BlockType.QUOTE) {
      block.data.text = block.data.text.map(mapper);
    } else if (block.type === BlockType.ORDERED_LIST_ITEM) {
      block.data.text = block.data.text.map(mapper);
    } else if (block.type === BlockType.UNORDERED_LIST_ITEM) {
      block.data.text = block.data.text.map(mapper);
    }
    return block;
  });
};
const getNoteFeatures = (note, graph) => {
  const blocks = graph.indexes.blocks.get(note.meta.slug);
  const spans = getAllInlineSpans(blocks);
  const containsWeblink = spans.some((span) => span.type === SpanType.HYPERLINK);
  const containsCode = blocks.some((block) => block.type === BlockType.CODE);
  let containsImages = false;
  let containsDocuments = false;
  let containsAudio = false;
  let containsVideo = false;
  const fileSlugs = getFileSlugsInNote(graph, note.meta.slug);
  fileSlugs.forEach((fileSlug) => {
    const mediaType = getMediaTypeFromFilename(fileSlug);
    if (mediaType === MediaType.IMAGE) {
      containsImages = true;
    } else if (mediaType === MediaType.PDF) {
      containsDocuments = true;
    } else if (mediaType === MediaType.AUDIO) {
      containsAudio = true;
    } else if (mediaType === MediaType.VIDEO) {
      containsVideo = true;
    }
  });
  const features = {
    containsWeblink,
    containsCode,
    containsImages,
    containsDocuments,
    containsAudio,
    containsVideo
  };
  return features;
};
const getNumberOfFiles = (graph, noteSlug) => {
  return getFileSlugsInNote(graph, noteSlug).length;
};
const createNoteListItem = (note, graph) => {
  const noteListItem = {
    slug: note.meta.slug,
    aliases: getAliasesOfSlug(graph, note.meta.slug),
    title: getNoteTitle(note.content),
    createdAt: note.meta.createdAt,
    updatedAt: note.meta.updatedAt,
    features: getNoteFeatures(note, graph),
    linkCount: getNumberOfLinkedNotes(graph, note.meta.slug),
    numberOfCharacters: getNumberOfCharacters(note),
    numberOfFiles: getNumberOfFiles(graph, note.meta.slug)
  };
  return noteListItem;
};
const createNoteListItems = (existingNotes, graph) => {
  const noteListItems = existingNotes.map((existingNote) => {
    return createNoteListItem(
      existingNote,
      graph
    );
  });
  return noteListItems;
};
const getURLsOfNote = (noteContent) => {
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=,]*)/g;
  return [...noteContent.matchAll(regex)].map((match) => match[0]);
};
const changeSlugReferencesInNote = (content, oldSlug, newSlug, newSluggifiableTitle) => {
  return mapInlineSpans(content, (span) => {
    if (span.type === SpanType.SLASHLINK && span.text.substring(1) === oldSlug) {
      span.text = "/" + newSlug;
    } else if (span.type === SpanType.WIKILINK && sluggifyWikilinkText(
      span.text.substring(2, span.text.length - 2)
    ) === oldSlug) {
      span.text = "[[" + (newSluggifiableTitle ?? newSlug) + "]]";
    }
    return span;
  });
};
const getSlugsFromParsedNote = (note) => {
  const inlineSpans = getAllInlineSpans(note);
  const slugs = getSlugsFromInlineText(inlineSpans);
  return slugs;
};
const handleExistingNoteUpdate = async (noteSaveRequest, io) => {
  const graph = await io.getGraph();
  const noteFromUser = noteSaveRequest.note;
  const existingNote = graph.notes.get(noteFromUser.meta.slug) || null;
  if (existingNote === null) {
    throw new Error(ErrorMessage.NOTE_NOT_FOUND);
  }
  existingNote.content = noteFromUser.content;
  existingNote.meta.updatedAt = noteSaveRequest.disableTimestampUpdate ? noteFromUser.meta.updatedAt : getCurrentISODateTime();
  existingNote.meta.flags = noteFromUser.meta.flags;
  existingNote.meta.additionalHeaders = noteFromUser.meta.additionalHeaders;
  const canonicalSlugShouldChange = "changeSlugTo" in noteSaveRequest && typeof noteSaveRequest.changeSlugTo === "string";
  const aliasesToUpdate = /* @__PURE__ */ new Set();
  if (noteSaveRequest.aliases) {
    for (const [alias, canonicalSlug] of graph.aliases.entries()) {
      if (canonicalSlug === existingNote.meta.slug && !noteSaveRequest.aliases.has(alias)) {
        graph.aliases.delete(alias);
        aliasesToUpdate.add(alias);
      }
    }
    noteSaveRequest.aliases.forEach((alias) => {
      if (!isValidNoteSlug(alias)) {
        throw new Error(ErrorMessage.INVALID_ALIAS);
      }
      if (alias === existingNote.meta.slug) {
        if (!canonicalSlugShouldChange) {
          throw new Error(ErrorMessage.ALIAS_EXISTS);
        }
      } else if (graph.notes.has(alias)) {
        throw new Error(ErrorMessage.SLUG_EXISTS);
      }
      if (graph.aliases.has(alias) && graph.aliases.get(alias) !== existingNote.meta.slug) {
        throw new Error(ErrorMessage.ALIAS_EXISTS);
      }
      if (graph.aliases.has(alias) && graph.aliases.get(alias) === existingNote.meta.slug) {
        return;
      }
      graph.aliases.set(alias, existingNote.meta.slug);
      aliasesToUpdate.add(alias);
    });
  }
  if ("changeSlugTo" in noteSaveRequest && typeof noteSaveRequest.changeSlugTo === "string") {
    if (!isValidNoteSlug(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (graph.notes.has(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    if (graph.metadata.files.find((f) => f.slug === noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    if (graph.aliases.has(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.ALIAS_EXISTS);
    }
    const oldSlug = existingNote.meta.slug;
    const newSlug = noteSaveRequest.changeSlugTo;
    const notesReferencingOurNoteBeforeChange = Array.from(graph.indexes.backlinks.get(oldSlug)).map((slug) => {
      return graph.notes.get(slug);
    });
    graph.notes.delete(oldSlug);
    removeSlugFromIndexes(graph, oldSlug);
    let flushMetadata = WriteGraphMetadataAction.NONE;
    for (let i = 0; i < graph.metadata.pinnedNotes.length; i++) {
      if (graph.metadata.pinnedNotes[i] === oldSlug) {
        graph.metadata.pinnedNotes[i] = newSlug;
        flushMetadata = WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE;
      }
    }
    const aliasesToUpdate2 = /* @__PURE__ */ new Set();
    for (const [alias, canonicalSlug] of graph.aliases.entries()) {
      if (canonicalSlug === oldSlug) {
        graph.aliases.delete(alias);
        graph.aliases.set(alias, newSlug);
        aliasesToUpdate2.add(alias);
      }
    }
    await io.flushChanges(
      graph,
      flushMetadata,
      /* @__PURE__ */ new Set([oldSlug]),
      aliasesToUpdate2
    );
    existingNote.meta.slug = newSlug;
    graph.notes.set(newSlug, existingNote);
    if ("updateReferences" in noteSaveRequest && noteSaveRequest.updateReferences) {
      updateIndexes(graph, existingNote);
      for (const thatNote of notesReferencingOurNoteBeforeChange) {
        const blocks = graph.indexes.blocks.get(
          thatNote.meta.slug
        );
        const noteTitle = getNoteTitle(existingNote.content);
        const newSluggifiableTitle = sluggifyNoteText(noteTitle) === newSlug ? noteTitle : newSlug;
        const newBlocks = changeSlugReferencesInNote(
          blocks,
          oldSlug,
          newSlug,
          newSluggifiableTitle
        );
        thatNote.content = serialize(newBlocks);
        graph.indexes.blocks.set(thatNote.meta.slug, newBlocks);
        updateIndexes(graph, thatNote);
        await io.flushChanges(
          graph,
          WriteGraphMetadataAction.NONE,
          /* @__PURE__ */ new Set([thatNote.meta.slug]),
          /* @__PURE__ */ new Set()
        );
      }
    }
  } else {
    graph.notes.set(existingNote.meta.slug, existingNote);
  }
  updateIndexes(graph, existingNote);
  await io.flushChanges(
    graph,
    WriteGraphMetadataAction.NONE,
    /* @__PURE__ */ new Set([existingNote.meta.slug]),
    aliasesToUpdate
  );
  const noteToTransmit = await createNoteToTransmit(existingNote, graph);
  return noteToTransmit;
};
const isExistingNoteSaveRequest = (noteSaveRequest) => {
  return "slug" in noteSaveRequest.note.meta;
};
const handleNewNoteSaveRequest = async (noteSaveRequest, io) => {
  const graph = await io.getGraph();
  const noteFromUser = noteSaveRequest.note;
  const existingSlugs = [
    ...Array.from(graph.notes.keys()),
    ...Array.from(graph.aliases.keys())
  ];
  let slug;
  if ("changeSlugTo" in noteSaveRequest && typeof noteSaveRequest.changeSlugTo === "string") {
    if (!isValidNoteSlug(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (graph.notes.has(noteSaveRequest.changeSlugTo) || graph.aliases.has(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    if (graph.metadata.files.find((f) => f.slug === noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    slug = noteSaveRequest.changeSlugTo;
  } else {
    slug = createSlug(
      noteFromUser.content,
      existingSlugs
    );
  }
  const aliasesToUpdate = /* @__PURE__ */ new Set();
  noteSaveRequest.aliases?.forEach((alias) => {
    if (!isValidNoteSlug(alias)) {
      throw new Error(ErrorMessage.INVALID_ALIAS);
    }
    if (graph.aliases.has(alias) && graph.aliases.get(alias) !== slug) {
      throw new Error(ErrorMessage.ALIAS_EXISTS);
    }
    if (graph.notes.has(alias)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    graph.aliases.set(alias, slug);
    aliasesToUpdate.add(alias);
  });
  const newNote = {
    meta: {
      slug,
      createdAt: getCurrentISODateTime(),
      updatedAt: getCurrentISODateTime(),
      additionalHeaders: {},
      flags: noteFromUser.meta.flags
    },
    content: noteFromUser.content
  };
  graph.notes.set(slug, newNote);
  updateIndexes(graph, newNote);
  await io.flushChanges(
    graph,
    WriteGraphMetadataAction.NONE,
    /* @__PURE__ */ new Set([newNote.meta.slug]),
    aliasesToUpdate
  );
  const noteToTransmit = await createNoteToTransmit(newNote, graph);
  return noteToTransmit;
};

const subwaytextWorkerUrl = "/neno/assets/index-CDMI1CG7.js";

class DatabaseIO {
  #storageProvider;
  #loadedGraph = null;
  #graphRetrievalInProgress = null;
  #finishedObtainingGraph = () => {
  };
  #GRAPH_METADATA_FILENAME = ".graph.json";
  static #NOTE_FILE_EXTENSION = ".subtext";
  #ALIAS_HEADER = ":alias-of:";
  // Block parsing is CPU intensive, so we use a web worker pool to parse
  // multiple notes in parallel.
  static #workerPool = [];
  // Returns the filename for a note with the given slug.
  static getFilenameForNoteSlug(slug) {
    if (slug.length === 0) {
      throw new Error("Cannot get filename for empty slug");
    }
    return `${slug}${DatabaseIO.#NOTE_FILE_EXTENSION}`;
  }
  static getSlugFromNoteFilename(filename) {
    if (!filename.endsWith(DatabaseIO.#NOTE_FILE_EXTENSION)) {
      throw new Error(
        "Filename does not end with default note filename extension"
      );
    }
    return filename.slice(0, -DatabaseIO.#NOTE_FILE_EXTENSION.length);
  }
  async getNoteFilenamesFromStorageProvider() {
    const objectNames = await this.#storageProvider.getAllObjectNames();
    return objectNames.filter(
      (filename) => {
        return filename.endsWith(DatabaseIO.#NOTE_FILE_EXTENSION) && isValidSlug(DatabaseIO.getSlugFromNoteFilename(filename));
      }
    );
  }
  async parseGraph(serializedNotesAndAliases, metadataSerialized) {
    const parsedNotes = /* @__PURE__ */ new Map();
    const aliases = /* @__PURE__ */ new Map();
    for (const [slug, serializedNote] of serializedNotesAndAliases) {
      let parsedNote;
      try {
        if (serializedNote.startsWith(this.#ALIAS_HEADER)) {
          const canonicalSlug = serializedNote.slice(this.#ALIAS_HEADER.length);
          aliases.set(slug, canonicalSlug);
        } else {
          parsedNote = parseSerializedExistingNote(serializedNote, slug);
          parsedNotes.set(slug, parsedNote);
        }
      } catch (e) {
        continue;
      }
    }
    let graphMetadata;
    if (typeof metadataSerialized === "string") {
      graphMetadata = JSON.parse(
        metadataSerialized
      );
      if (graphMetadata.version === "4") {
        graphMetadata.createdAt = unixToISOTimestamp(parseInt(graphMetadata.createdAt));
        graphMetadata.updatedAt = unixToISOTimestamp(parseInt(graphMetadata.updatedAt));
        for (const file of graphMetadata.files) {
          file.createdAt = unixToISOTimestamp(parseInt(
            file.createdAt
          ));
        }
        graphMetadata.version = "5";
        await this.writeGraphMetadataFile(graphMetadata);
        for (const [slug, note] of parsedNotes.entries()) {
          let flushNote = false;
          if (note.meta.createdAt && /^\d+$/.test(note.meta.createdAt)) {
            note.meta.createdAt = unixToISOTimestamp(parseInt(
              note.meta.createdAt
            ));
            flushNote = true;
          }
          if (note.meta.updatedAt && /^\d+$/.test(note.meta.updatedAt)) {
            note.meta.updatedAt = unixToISOTimestamp(parseInt(
              note.meta.updatedAt
            ));
            flushNote = true;
          }
          if (flushNote) {
            const filename = DatabaseIO.getFilenameForNoteSlug(slug);
            await this.#storageProvider.writeObject(
              filename,
              serializeNote(note)
            );
          }
        }
      }
    } else {
      graphMetadata = this.createEmptyGraphMetadata();
      await this.writeGraphMetadataFile(graphMetadata);
    }
    const blockIndex = await DatabaseIO.createBlockIndex(
      Array.from(parsedNotes.values())
    );
    const outgoingLinkIndex = DatabaseIO.createOutgoingLinkIndex(blockIndex);
    const backlinkIndex = DatabaseIO.createBacklinkIndex(
      outgoingLinkIndex,
      new Set(parsedNotes.keys()),
      aliases
    );
    const parsedGraphObject = {
      notes: parsedNotes,
      aliases,
      indexes: {
        blocks: blockIndex,
        outgoingLinks: outgoingLinkIndex,
        backlinks: backlinkIndex
      },
      metadata: graphMetadata
    };
    return parsedGraphObject;
  }
  async readAndParseGraphFromDisk() {
    let graphMetadataSerialized;
    try {
      graphMetadataSerialized = await this.#storageProvider.readObjectAsString(
        this.#GRAPH_METADATA_FILENAME
      );
    } catch (e) {
      graphMetadataSerialized = void 0;
    }
    const noteFilenames = await this.getNoteFilenamesFromStorageProvider();
    const serializedNotes = new Map(
      await Promise.all(
        noteFilenames.map(
          async (filename) => {
            const slug = filename.slice(
              0,
              -DatabaseIO.#NOTE_FILE_EXTENSION.length
            );
            const serializedNote = await this.#storageProvider.readObjectAsString(
              filename
            );
            return [slug, serializedNote];
          }
        )
      )
    );
    return this.parseGraph(serializedNotes, graphMetadataSerialized);
  }
  /*
    The outgoing link index contains all links that are referenced in a note,
    including links to files, no matter if the link target exists or not.
  */
  static createOutgoingLinkIndex(blockIndex) {
    const outgoingLinkIndex = /* @__PURE__ */ new Map();
    for (const [slug, blocks] of blockIndex) {
      const outgoingLinks = getSlugsFromParsedNote(blocks);
      outgoingLinkIndex.set(slug, new Set(outgoingLinks));
    }
    return outgoingLinkIndex;
  }
  /*
    The backlinks index only contains slugs of existing notes that
    reference a note or one of its aliases.
  */
  static createBacklinkIndex(outgoingLinks, existingNoteSlugs, aliases) {
    const backlinkIndex = /* @__PURE__ */ new Map();
    for (const [slug, links] of outgoingLinks) {
      if (!backlinkIndex.has(slug)) {
        backlinkIndex.set(slug, /* @__PURE__ */ new Set());
      }
      for (const link of links) {
        if (existingNoteSlugs.has(link)) {
          if (!backlinkIndex.has(link)) {
            backlinkIndex.set(link, /* @__PURE__ */ new Set());
          }
          backlinkIndex.get(link).add(slug);
        }
        if (aliases.has(link)) {
          const canonicalSlug = aliases.get(link);
          if (!backlinkIndex.has(canonicalSlug)) {
            backlinkIndex.set(canonicalSlug, /* @__PURE__ */ new Set());
          }
          backlinkIndex.get(canonicalSlug).add(slug);
        }
      }
    }
    return backlinkIndex;
  }
  static createBlockIndex(notes) {
    const concurrency = navigator.hardwareConcurrency || 2;
    if (DatabaseIO.#workerPool.length === 0) {
      for (let t = 0; t < concurrency; t++) {
        const worker = new Worker(
          subwaytextWorkerUrl,
          { type: "module" }
        );
        this.#workerPool.push(worker);
      }
    }
    return new Promise((resolve, reject) => {
      const blockIndex = /* @__PURE__ */ new Map();
      for (let t = 0; t < concurrency; t++) {
        const notesPerThread = Math.ceil(notes.length / concurrency);
        const start = t * notesPerThread;
        const end = Math.min((t + 1) * notesPerThread, notes.length);
        const notesForThread = notes.slice(start, end).map((note) => {
          return {
            id: note.meta.slug,
            content: note.content
          };
        });
        const worker = DatabaseIO.#workerPool[t];
        worker.onmessage = (event) => {
          const notesParsed = event.data;
          for (const noteParsed of notesParsed) {
            blockIndex.set(noteParsed.id, noteParsed.parsedContent);
          }
          if (blockIndex.size === notes.length) {
            resolve(blockIndex);
            return;
          }
        };
        worker.onerror = (event) => {
          reject(event.error);
        };
        worker.postMessage({
          "action": "PARSE_NOTES",
          "notes": notesForThread
        });
      }
    });
  }
  async writeGraphMetadataFile(graphMetadata) {
    await this.#storageProvider.writeObject(
      this.#GRAPH_METADATA_FILENAME,
      // we pretty print the JSON for Git to be able to show better diffs
      JSON.stringify(graphMetadata, null, 2)
    );
  }
  createEmptyGraphMetadata() {
    return {
      createdAt: getCurrentISODateTime(),
      updatedAt: getCurrentISODateTime(),
      pinnedNotes: [],
      files: [],
      version: "5"
    };
  }
  /**
    PUBLIC
  **/
  constructor(config) {
    this.#storageProvider = config.storageProvider;
  }
  async getRawNote(slug) {
    const rawNote = await this.#storageProvider.readObjectAsString(
      DatabaseIO.getFilenameForNoteSlug(slug)
    );
    if (!rawNote) {
      throw new Error(ErrorMessage.GRAPH_NOT_FOUND);
    }
    return rawNote;
  }
  async getGraph() {
    if (this.#graphRetrievalInProgress) {
      await this.#graphRetrievalInProgress;
    }
    this.#graphRetrievalInProgress = new Promise((resolve) => {
      this.#finishedObtainingGraph = () => {
        this.#graphRetrievalInProgress = null;
        resolve();
      };
    });
    if (this.#loadedGraph) {
      this.#finishedObtainingGraph();
      return this.#loadedGraph;
    }
    const graphFromDisk = await this.readAndParseGraphFromDisk();
    this.#loadedGraph = graphFromDisk;
    this.#finishedObtainingGraph();
    return graphFromDisk;
  }
  // flushChanges makes sure that the changes applied to the graph object are
  // written to the disk and thus are persistent. It should always be called
  // after any operation on the internal graph representation
  // has been performed.
  async flushChanges(graph, writeGraphMetadata, canonicalSlugsToFlush, aliasesToFlush) {
    if (writeGraphMetadata === WriteGraphMetadataAction.WRITE || writeGraphMetadata === WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE) {
      if (writeGraphMetadata === WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE) {
        graph.metadata.updatedAt = getCurrentISODateTime();
      }
      await this.writeGraphMetadataFile(graph.metadata);
    }
    this.#loadedGraph = graph;
    if (canonicalSlugsToFlush instanceof Set) {
      await Promise.all(Array.from(canonicalSlugsToFlush).map(async (slug) => {
        const filename = DatabaseIO.getFilenameForNoteSlug(slug);
        if (!graph.notes.has(slug)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          await this.#storageProvider.writeObject(
            filename,
            serializeNote(graph.notes.get(slug))
          );
        }
      }));
    } else {
      for (const [slug, note] of graph.notes) {
        const filename = DatabaseIO.getFilenameForNoteSlug(slug);
        if (!graph.notes.has(slug)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          await this.#storageProvider.writeObject(
            filename,
            serializeNote(note)
          );
        }
      }
    }
    if (aliasesToFlush instanceof Set) {
      await Promise.all(Array.from(aliasesToFlush).map(async (alias) => {
        const filename = DatabaseIO.getFilenameForNoteSlug(alias);
        if (!graph.aliases.has(alias)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          const canonicalSlug = graph.aliases.get(alias);
          await this.#storageProvider.writeObject(
            filename,
            `${this.#ALIAS_HEADER}${canonicalSlug}`
          );
        }
      }));
    } else {
      for (const [alias, canonicalSlug] of graph.aliases) {
        const filename = DatabaseIO.getFilenameForNoteSlug(alias);
        if (!graph.aliases.has(alias)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          await this.#storageProvider.writeObject(
            filename,
            `${this.#ALIAS_HEADER}${canonicalSlug}`
          );
        }
      }
    }
  }
  async addFile(slug, source) {
    if (!isValidFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    const size = await this.#storageProvider.writeObjectFromReadable(
      slug,
      source
    );
    return size;
  }
  async renameFile(slug, newSlug) {
    if (!isValidFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (!isValidFileSlug(newSlug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    await this.#storageProvider.renameFile(
      slug,
      newSlug
    );
  }
  async deleteFile(slug) {
    if (!isValidFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    await this.#storageProvider.removeObject(slug);
  }
  async getReadableStream(slug, range) {
    if (!isValidSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    const stream = await this.#storageProvider.getReadableStream(
      slug,
      range
    );
    return stream;
  }
  async getFileSize(slug) {
    if (!isValidFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    const fileSize = await this.#storageProvider.getObjectSize(slug);
    return fileSize;
  }
  async getSizeOfNotes() {
    const noteFilenames = await this.getNoteFilenamesFromStorageProvider();
    const noteSizes = [];
    for (const noteFilename of noteFilenames) {
      const noteSize = await this.#storageProvider.getObjectSize(noteFilename);
      noteSizes.push(noteSize);
    }
    return noteSizes.reduce((a, b) => a + b, 0);
  }
  async getTotalStorageSize() {
    return this.#storageProvider.getTotalSize();
  }
  async graphExistsInStorage() {
    try {
      await this.#storageProvider.readObjectAsString(
        this.#GRAPH_METADATA_FILENAME
      );
      return true;
    } catch (e) {
      const noteFilenamesInStorage = await this.getNoteFilenamesFromStorageProvider();
      return noteFilenamesInStorage.length > 0;
    }
  }
}

var NoteListSortMode = /* @__PURE__ */ ((NoteListSortMode2) => {
  NoteListSortMode2["CREATION_DATE_ASCENDING"] = "CREATION_DATE_ASCENDING";
  NoteListSortMode2["CREATION_DATE_DESCENDING"] = "CREATION_DATE_DESCENDING";
  NoteListSortMode2["UPDATE_DATE_ASCENDING"] = "UPDATE_DATE_ASCENDING";
  NoteListSortMode2["UPDATE_DATE_DESCENDING"] = "UPDATE_DATE_DESCENDING";
  NoteListSortMode2["TITLE_ASCENDING"] = "TITLE_ASCENDING";
  NoteListSortMode2["TITLE_DESCENDING"] = "TITLE_DESCENDING";
  NoteListSortMode2["NUMBER_OF_LINKS_ASCENDING"] = "NUMBER_OF_LINKS_ASCENDING";
  NoteListSortMode2["NUMBER_OF_LINKS_DESCENDING"] = "NUMBER_OF_LINKS_DESCENDING";
  NoteListSortMode2["NUMBER_OF_FILES_ASCENDING"] = "NUMBER_OF_FILES_ASCENDING";
  NoteListSortMode2["NUMBER_OF_FILES_DESCENDING"] = "NUMBER_OF_FILES_DESCENDING";
  NoteListSortMode2["NUMBER_OF_CHARACTERS_ASCENDING"] = "NUMBER_OF_CHARACTERS_ASCENDING";
  NoteListSortMode2["NUMBER_OF_CHARACTERS_DESCENDING"] = "NUMBER_OF_CHARACTERS_DESCENDING";
  return NoteListSortMode2;
})(NoteListSortMode || {});

const getSortKeyForTitle = (title) => {
  return title.toLowerCase().replace(/(["'.“”„‘’—\-»#*[\]/])/g, "").trim();
};
const getSortFunction = (sortMode) => {
  const sortFunctions = {
    [NoteListSortMode.CREATION_DATE_ASCENDING]: (a, b) => {
      return getCompareKeyForTimestamp(a.createdAt) - getCompareKeyForTimestamp(b.createdAt);
    },
    [NoteListSortMode.CREATION_DATE_DESCENDING]: (a, b) => {
      return getCompareKeyForTimestamp(b.createdAt) - getCompareKeyForTimestamp(a.createdAt);
    },
    [NoteListSortMode.UPDATE_DATE_ASCENDING]: (a, b) => {
      return getCompareKeyForTimestamp(a.updatedAt) - getCompareKeyForTimestamp(b.updatedAt);
    },
    [NoteListSortMode.UPDATE_DATE_DESCENDING]: (a, b) => {
      return getCompareKeyForTimestamp(b.updatedAt) - getCompareKeyForTimestamp(a.updatedAt);
    },
    [NoteListSortMode.TITLE_ASCENDING]: (a, b) => {
      const aNormalized = getSortKeyForTitle(a.title);
      const bNormalized = getSortKeyForTitle(b.title);
      return aNormalized.localeCompare(bNormalized);
    },
    [NoteListSortMode.TITLE_DESCENDING]: (a, b) => {
      const aNormalized = getSortKeyForTitle(a.title);
      const bNormalized = getSortKeyForTitle(b.title);
      return bNormalized.localeCompare(aNormalized);
    },
    [NoteListSortMode.NUMBER_OF_LINKS_ASCENDING]: (a, b) => {
      return a.linkCount.sum - b.linkCount.sum;
    },
    [NoteListSortMode.NUMBER_OF_LINKS_DESCENDING]: (a, b) => {
      return b.linkCount.sum - a.linkCount.sum;
    },
    [NoteListSortMode.NUMBER_OF_FILES_ASCENDING]: (a, b) => {
      return a.numberOfFiles - b.numberOfFiles;
    },
    [NoteListSortMode.NUMBER_OF_FILES_DESCENDING]: (a, b) => {
      return b.numberOfFiles - a.numberOfFiles;
    },
    [NoteListSortMode.NUMBER_OF_CHARACTERS_ASCENDING]: (a, b) => {
      return a.numberOfCharacters - b.numberOfCharacters;
    },
    [NoteListSortMode.NUMBER_OF_CHARACTERS_DESCENDING]: (a, b) => {
      return b.numberOfCharacters - a.numberOfCharacters;
    }
  };
  return sortFunctions[sortMode] ?? sortFunctions.UPDATE_DATE_ASCENDING;
};
const getNoteSortFunction = (sortMode) => {
  const sortFunctions = /* @__PURE__ */ new Map([
    [
      NoteListSortMode.CREATION_DATE_ASCENDING,
      (a, b) => {
        return getCompareKeyForTimestamp(a.meta.createdAt) - getCompareKeyForTimestamp(b.meta.createdAt);
      }
    ],
    [
      NoteListSortMode.CREATION_DATE_DESCENDING,
      (a, b) => {
        return getCompareKeyForTimestamp(b.meta.createdAt) - getCompareKeyForTimestamp(a.meta.createdAt);
      }
    ],
    [
      NoteListSortMode.UPDATE_DATE_ASCENDING,
      (a, b) => {
        return getCompareKeyForTimestamp(a.meta.updatedAt) - getCompareKeyForTimestamp(b.meta.updatedAt);
      }
    ],
    [
      NoteListSortMode.UPDATE_DATE_DESCENDING,
      (a, b) => {
        return getCompareKeyForTimestamp(b.meta.updatedAt) - getCompareKeyForTimestamp(a.meta.updatedAt);
      }
    ],
    [
      NoteListSortMode.NUMBER_OF_CHARACTERS_ASCENDING,
      (a, b) => {
        return a.content.length - b.content.length;
      }
    ],
    [
      NoteListSortMode.NUMBER_OF_CHARACTERS_DESCENDING,
      (a, b) => {
        return b.content.length - a.content.length;
      }
    ]
  ]);
  return sortFunctions.get(sortMode) ?? sortFunctions.get(
    NoteListSortMode.UPDATE_DATE_ASCENDING
  );
};
const breadthFirstSearch = (nodes, links, root) => {
  const queue = [];
  const discovered = [];
  discovered.push(root);
  queue.push(root);
  while (queue.length > 0) {
    const v = queue.shift();
    const connectedNodes = links.filter((link) => {
      return link[0] === v.meta.slug || link[1] === v.meta.slug;
    }).map((link) => {
      const linkedNoteId = link[0] === v.meta.slug ? link[1] : link[0];
      return nodes.find(
        (n) => n.meta.slug === linkedNoteId
      );
    }).filter((n) => {
      return n !== void 0;
    });
    for (let i = 0; i < connectedNodes.length; i++) {
      const w = connectedNodes[i];
      if (!discovered.includes(w)) {
        discovered.push(w);
        queue.push(w);
      }
    }
  }
  return discovered;
};
const getGraphLinks = (graph) => {
  return Array.from(graph.notes.keys()).reduce(
    (links, slug) => {
      if (!graph.indexes.outgoingLinks.has(slug)) {
        throw new Error(
          "Could not determine outgoing links for " + slug
        );
      }
      const linksFromThisSlug = Array.from(
        graph.indexes.outgoingLinks.get(slug)
      ).filter((targetSlug) => {
        return graph.notes.has(targetSlug) || graph.aliases.has(targetSlug);
      }).map((targetSlug) => {
        const canonicalTargetSlug = graph.aliases.get(targetSlug) ?? targetSlug;
        return [slug, canonicalTargetSlug];
      });
      return [
        ...links,
        ...linksFromThisSlug
      ];
    },
    []
  );
};
const getNumberOfComponents = (graph) => {
  const nodes = Array.from(graph.notes.values());
  const links = getGraphLinks(graph);
  let totallyDiscovered = [];
  let numberOfComponents = 0;
  let i = 0;
  while (totallyDiscovered.length < nodes.length) {
    let root = nodes[i];
    while (totallyDiscovered.includes(root)) {
      i++;
      root = nodes[i];
    }
    const inComponent = breadthFirstSearch(nodes, links, root);
    totallyDiscovered = [
      ...totallyDiscovered,
      ...inComponent
    ];
    numberOfComponents++;
    i++;
  }
  return numberOfComponents;
};
const getGraphCreationTimestamp = (graph) => {
  return getEarliestISOTimestamp(
    ...Array.from(graph.notes.values()).map((note) => note.meta.createdAt).filter((createdAt) => {
      return typeof createdAt === "string";
    }),
    graph.metadata.createdAt
  );
};
const getGraphUpdateTimestamp = (graph) => {
  return getLatestISOTimestamp(
    ...Array.from(graph.notes.values()).map((note) => note.meta.updatedAt).filter((createdAt) => {
      return typeof createdAt === "string";
    }),
    graph.metadata.updatedAt
  );
};

const getNotesWithDuplicateUrls = (notes) => {
  const urlIndex = /* @__PURE__ */ new Map();
  notes.forEach((note) => {
    const urls = getURLsOfNote(note.content);
    urls.forEach((url) => {
      if (urlIndex.has(url)) {
        urlIndex.get(url).add(note);
      } else {
        urlIndex.set(url, /* @__PURE__ */ new Set([note]));
      }
    });
  });
  const duplicates = /* @__PURE__ */ new Set();
  for (const notesWithUrl of urlIndex.values()) {
    if (notesWithUrl.size > 1) {
      notesWithUrl.forEach((note) => {
        duplicates.add(note);
      });
    }
  }
  return Array.from(duplicates);
};
const getNotesWithDuplicateTitles = (notes) => {
  const titleIndex = /* @__PURE__ */ new Map();
  notes.forEach((note) => {
    const noteTitle = getNoteTitle(note.content);
    if (titleIndex.has(noteTitle)) {
      titleIndex.get(noteTitle).add(note);
    } else {
      titleIndex.set(noteTitle, /* @__PURE__ */ new Set([note]));
    }
  });
  const duplicates = /* @__PURE__ */ new Set();
  for (const notesWithOneTitle of titleIndex.values()) {
    if (notesWithOneTitle.size > 1) {
      notesWithOneTitle.forEach((note) => {
        duplicates.add(note);
      });
    }
  }
  return Array.from(duplicates);
};
const getNotesByTitle = (notes, query, caseSensitive) => {
  return notes.filter((note) => {
    const title = getNoteTitle(note.content);
    return title.toLowerCase() === query.toLowerCase();
  });
};
const getNotesWithUrl = (notes, url) => {
  return notes.filter((note) => {
    return note.content.includes(url) && !note.content[note.content.indexOf(url) + url.length]?.trim();
  });
};
const getNotesWithKeyValue = (notes, graph, key, value) => {
  return notes.filter((note) => {
    return getBlocks(note, graph.indexes.blocks).some((block) => {
      return block.type === BlockType.KEY_VALUE_PAIR && block.data.key === key && (value.length === 0 || serializeInlineText(block.data.value).includes(value));
    });
  });
};
const getNotesWithFile = (notes, graph, fileSlug) => {
  return notes.filter((note) => {
    const fileSlugs = getFileSlugsInNote(graph, note.meta.slug);
    return fileSlugs.includes(fileSlug);
  });
};
const getNotesWithFlag = (notes, flag) => {
  return notes.filter((note) => {
    return note.meta.flags.includes(flag);
  });
};
const getNotesWithTitleSlugOrAliasContainingToken = (notes, token, caseSensitive, aliases) => {
  const fittingNoteSlugs = /* @__PURE__ */ new Set();
  for (const [alias, target] of aliases.entries()) {
    if (caseSensitive && alias.includes(token) || alias.includes(token.toLowerCase())) {
      fittingNoteSlugs.add(target);
    }
  }
  return Array.from(notes).filter((note) => {
    if (token.length === 0) {
      return true;
    }
    if (fittingNoteSlugs.has(note.meta.slug)) {
      return true;
    }
    if (caseSensitive) {
      return getNoteTitle(note.content).includes(token) || note.meta.slug.includes(token);
    } else {
      return getNoteTitle(note.content).toLowerCase().includes(
        token.toLowerCase()
      ) || note.meta.slug.toLowerCase().includes(token.toLowerCase());
    }
  });
};
const getNotesThatContainTokens = (notes, query, caseSensitive) => {
  const queryTokens = query.split(" ");
  return notes.filter((note) => {
    const noteContent = note.content;
    return queryTokens.every((queryToken) => {
      return caseSensitive ? noteContent.includes(queryToken) : noteContent.toLowerCase().includes(queryToken.toLowerCase());
    });
  });
};
const getNotesWithBlocksOfTypes = (notes, graph, types, notesMustContainAllBlockTypes) => {
  return notesMustContainAllBlockTypes ? notes.filter((note) => {
    return types.every((type) => {
      return getBlocks(note, graph.indexes.blocks).some((block) => block.type === type);
    });
  }) : notes.filter((note) => {
    return getBlocks(note, graph.indexes.blocks).some((block) => types.includes(block.type));
  });
};
const getNotesWithMediaTypes = (notes, graph, requiredMediaTypes, everyNoteMustContainAllMediaTypes) => {
  return everyNoteMustContainAllMediaTypes ? notes.filter((note) => {
    const fileSlugs = getFileSlugsInNote(graph, note.meta.slug);
    const includedMediaTypes = new Set(
      fileSlugs.map((fileSlug) => getMediaTypeFromFilename(fileSlug))
    );
    return setsAreEqual(requiredMediaTypes, includedMediaTypes);
  }) : notes.filter((note) => {
    const fileSlugs = getFileSlugsInNote(graph, note.meta.slug);
    const includedMediaTypes = new Set(
      fileSlugs.map((fileSlug) => getMediaTypeFromFilename(fileSlug))
    );
    return Array.from(requiredMediaTypes).some((requiredMediaType) => {
      return includedMediaTypes.has(requiredMediaType);
    });
  });
};

const NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE = 50;

const isWhiteSpace = (string) => {
  return string.trim().length === 0;
};
const parseToken = (token) => {
  if (token.length > 1 && token.indexOf(':"') > -1 && token.lastIndexOf('"') === token.length - 1) {
    return [
      token.substring(0, token.indexOf(':"')),
      token.substring(token.indexOf(':"') + 2, token.length - 1)
    ];
  } else if (token[0] === '"' && token[token.length - 1] === '"') {
    return [
      "",
      token.substring(1, token.length - 1)
    ];
  } else if (token.includes(":")) {
    const pos = token.indexOf(":");
    return [
      token.substring(0, pos),
      token.substring(pos + 1)
    ];
  } else {
    return ["", token];
  }
};
const getRawTokensFromQueryString = (queryString) => {
  const rawTokens = [];
  const iterator = new CharIterator(queryString);
  let mode = "whitespace";
  let withinQuote = false;
  let collector = "";
  while (true) {
    const step = iterator.next();
    if (step.done) {
      if (mode === "token") {
        mode = "whitespace";
        rawTokens.push(collector);
        collector = "";
      }
      break;
    }
    const value = step.value;
    if (mode === "whitespace") {
      if (isWhiteSpace(value)) {
        continue;
      } else {
        if (value === '"') {
          withinQuote = !withinQuote;
        }
        mode = "token";
        collector += value;
      }
    } else if (mode === "token") {
      if (value === '"') {
        withinQuote = !withinQuote;
      }
      if (!withinQuote && isWhiteSpace(value)) {
        mode = "whitespace";
        rawTokens.push(collector);
        collector = "";
      } else {
        collector += value;
      }
    }
  }
  return rawTokens;
};
const parseQueryString = (queryString) => {
  return getRawTokensFromQueryString(queryString).map(parseToken);
};
const search = async (graph, query) => {
  const searchString = query.searchString || "";
  const caseSensitive = query.caseSensitive || false;
  const page = query.page ? Math.max(query.page, 1) : 1;
  const sortMode = query.sortMode || NoteListSortMode.CREATION_DATE_DESCENDING;
  const limit = query.limit || 0;
  let matchingNotes = Array.from(graph.notes.values());
  const tokens = parseQueryString(searchString);
  for (let t = 0; t < tokens.length; t++) {
    if (matchingNotes.length === 0) break;
    const [key, value] = tokens[t];
    if (key === "duplicates") {
      if (value === "url") {
        matchingNotes = getNotesWithDuplicateUrls(matchingNotes);
      } else if (value === "title") {
        matchingNotes = getNotesWithDuplicateTitles(matchingNotes);
      } else {
        matchingNotes = [];
      }
    } else if (key === "exact") {
      matchingNotes = getNotesByTitle(matchingNotes, value);
    } else if (key === "has-url") {
      matchingNotes = getNotesWithUrl(matchingNotes, value);
    } else if (key === "has-file") {
      matchingNotes = getNotesWithFile(matchingNotes, graph, value);
    } else if (key === "has-flag") {
      matchingNotes = getNotesWithFlag(matchingNotes, value);
    } else if (key === "has-block") {
      const types = value.split("|");
      matchingNotes = getNotesWithBlocksOfTypes(matchingNotes, graph, types, false);
    } else if (key === "has-media") {
      const types = value.split("|");
      matchingNotes = getNotesWithMediaTypes(
        matchingNotes,
        graph,
        new Set(types),
        false
      );
    } else if (key === "ft") {
      matchingNotes = getNotesThatContainTokens(
        matchingNotes,
        value,
        caseSensitive
      );
    } else if (key.startsWith("$")) {
      matchingNotes = getNotesWithKeyValue(
        matchingNotes,
        graph,
        key.substring(1),
        value
      );
    } else {
      matchingNotes = getNotesWithTitleSlugOrAliasContainingToken(
        matchingNotes,
        value,
        caseSensitive,
        graph.aliases
      );
    }
  }
  const SIMPLE_SORT_MODES = [
    NoteListSortMode.CREATION_DATE_ASCENDING,
    NoteListSortMode.CREATION_DATE_DESCENDING,
    NoteListSortMode.UPDATE_DATE_ASCENDING,
    NoteListSortMode.UPDATE_DATE_DESCENDING,
    NoteListSortMode.NUMBER_OF_CHARACTERS_ASCENDING,
    NoteListSortMode.NUMBER_OF_CHARACTERS_DESCENDING
  ];
  if (SIMPLE_SORT_MODES.includes(sortMode)) {
    matchingNotes = matchingNotes.sort(getNoteSortFunction(sortMode));
    if (limit > 0 && limit < matchingNotes.length) {
      matchingNotes = matchingNotes.slice(0, limit);
    }
    const pagedMatches = getPagedMatches(
      matchingNotes,
      page,
      NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE
    );
    return {
      results: createNoteListItems(pagedMatches, graph),
      numberOfResults: matchingNotes.length
    };
  } else {
    const noteListItems = createNoteListItems(
      matchingNotes,
      graph
    ).sort(getSortFunction(sortMode));
    const pagedMatches = getPagedMatches(
      noteListItems,
      page,
      NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE
    );
    return {
      results: pagedMatches,
      numberOfResults: matchingNotes.length
    };
  }
};

class NotesProvider {
  /* STATIC */
  static getExtensionFromFilename = getExtensionFromFilename;
  static parseSerializedNewNote = parseSerializedNewNote;
  static serializeNewNote = serializeNewNote;
  static isValidSlug = isValidSlug;
  static isValidSlugOrEmpty = isValidSlugOrEmpty;
  static isValidNoteSlugOrEmpty = isValidNoteSlugOrEmpty;
  #io;
  constructor(storageProvider) {
    this.#io = new DatabaseIO({ storageProvider });
  }
  async get(slug) {
    const graph = await this.#io.getGraph();
    const canonicalSlug = graph.aliases.get(slug) || slug;
    if (!graph.notes.has(canonicalSlug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }
    const noteFromDB = graph.notes.get(canonicalSlug);
    const noteToTransmit = await createNoteToTransmit(noteFromDB, graph);
    return noteToTransmit;
  }
  async getRandom() {
    const graph = await this.#io.getGraph();
    const noteFromDB = graph.notes.size > 0 ? graph.notes.get(getRandomKey(graph.notes)) : null;
    if (!noteFromDB) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }
    const noteToTransmit = await createNoteToTransmit(noteFromDB, graph);
    return noteToTransmit;
  }
  async getRawNote(slug) {
    const graph = await this.#io.getGraph();
    const canonicalSlug = graph.aliases.get(slug) || slug;
    return this.#io.getRawNote(canonicalSlug);
  }
  async getNotesList(query) {
    const graph = await this.#io.getGraph();
    return search(graph, query);
  }
  async getStats(options) {
    const graph = await this.#io.getGraph();
    const numberOfUnlinkedNotes = getNumberOfUnlinkedNotes(graph);
    const stats = {
      numberOfAllNotes: graph.notes.size,
      numberOfLinks: getGraphLinks(graph).length,
      numberOfFiles: graph.metadata.files.length,
      numberOfPins: graph.metadata.pinnedNotes.length,
      numberOfAliases: graph.aliases.size,
      numberOfUnlinkedNotes
    };
    if (options.includeMetadata) {
      stats.metadata = {
        createdAt: getGraphCreationTimestamp(graph),
        updatedAt: getGraphUpdateTimestamp(graph),
        size: {
          total: await this.#io.getTotalStorageSize(),
          notes: await this.#io.getSizeOfNotes(),
          files: graph.metadata.files.reduce((a, b) => {
            return a + b.size;
          }, 0)
        },
        version: graph.metadata.version
      };
    }
    if (options.includeAnalysis) {
      const numberOfComponents = getNumberOfComponents(graph);
      stats.analysis = {
        numberOfComponents,
        numberOfComponentsWithMoreThanOneNode: numberOfComponents - numberOfUnlinkedNotes
      };
    }
    return stats;
  }
  async put(noteSaveRequest) {
    const noteFromUser = noteSaveRequest.note;
    if (!noteFromUser || typeof noteFromUser.content !== "string") {
      throw new Error(ErrorMessage.INVALID_NOTE_STRUCTURE);
    }
    if (isExistingNoteSaveRequest(noteSaveRequest)) {
      return handleExistingNoteUpdate(
        noteSaveRequest,
        this.#io
      );
    } else {
      return handleNewNoteSaveRequest(
        noteSaveRequest,
        this.#io
      );
    }
  }
  async remove(slug) {
    const graph = await this.#io.getGraph();
    if (!graph.notes.has(slug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }
    graph.notes.delete(slug);
    const aliasesToRemove = /* @__PURE__ */ new Set();
    for (const [alias, canonicalSlug] of graph.aliases.entries()) {
      if (canonicalSlug === slug) {
        graph.aliases.delete(alias);
        aliasesToRemove.add(alias);
      }
    }
    let flushMetadata = WriteGraphMetadataAction.NONE;
    graph.metadata.pinnedNotes = graph.metadata.pinnedNotes.filter((s) => {
      if (s === slug) {
        flushMetadata = WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE;
      }
      return s !== slug;
    });
    removeSlugFromIndexes(graph, slug);
    await this.#io.flushChanges(
      graph,
      flushMetadata,
      /* @__PURE__ */ new Set([slug]),
      aliasesToRemove
    );
  }
  async addFile(readable, folder, filename) {
    const graph = await this.#io.getGraph();
    const slug = getSlugFromFilename(folder, filename, graph.metadata.files);
    const size = await this.#io.addFile(slug, readable);
    const fileInfo = {
      slug,
      size,
      createdAt: getCurrentISODateTime()
    };
    graph.metadata.files.push(fileInfo);
    await this.#io.flushChanges(
      graph,
      WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set()
    );
    return fileInfo;
  }
  async updateFile(readable, slug) {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.metadata.files.find((file) => {
      return file.slug === slug;
    });
    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    const size = await this.#io.addFile(slug, readable);
    fileInfo.size = size;
    await this.#io.flushChanges(
      graph,
      WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set()
    );
    return fileInfo;
  }
  async renameFile(oldSlug, newSlug, updateReferences) {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.metadata.files.find((file) => {
      return file.slug === oldSlug;
    });
    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    if (!isValidFileSlug(newSlug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (graph.notes.has(newSlug) || graph.aliases.has(newSlug) || graph.metadata.files.find((f) => f.slug === newSlug)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    await this.#io.renameFile(
      oldSlug,
      newSlug
    );
    fileInfo.slug = newSlug;
    const notesThatNeedUpdate = /* @__PURE__ */ new Set();
    if (updateReferences) {
      for (const [noteSlug, outgoingLinks] of graph.indexes.outgoingLinks) {
        if (outgoingLinks.has(oldSlug)) {
          notesThatNeedUpdate.add(noteSlug);
          const note = graph.notes.get(noteSlug);
          if (!note) {
            throw new Error(
              "Note from index is undefined. This should not happen."
            );
          }
          const blocks = graph.indexes.blocks.get(
            noteSlug
          );
          const newBlocks = changeSlugReferencesInNote(
            blocks,
            oldSlug,
            newSlug,
            newSlug
          );
          note.content = serialize(newBlocks);
          graph.indexes.blocks.set(note.meta.slug, newBlocks);
          updateIndexes(graph, note);
        }
      }
    }
    await this.#io.flushChanges(
      graph,
      WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE,
      notesThatNeedUpdate,
      /* @__PURE__ */ new Set()
    );
    return fileInfo;
  }
  async deleteFile(slug) {
    await this.#io.deleteFile(slug);
    const graph = await this.#io.getGraph();
    graph.metadata.files = graph.metadata.files.filter((file) => file.slug !== slug);
    await this.#io.flushChanges(
      graph,
      WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set()
    );
  }
  async getFiles() {
    const graph = await this.#io.getGraph();
    return graph.metadata.files;
  }
  // get files not used in any note
  async getDanglingFiles() {
    const graph = await this.#io.getGraph();
    const allBlocks = Array.from(graph.indexes.blocks.values()).flat();
    const allInlineSpans = getAllInlineSpans(allBlocks);
    const allUsedSlugs = getSlugsFromInlineText(allInlineSpans);
    const allUsedFileSlugs = allUsedSlugs.filter(isValidFileSlug);
    const danglingFiles = graph.metadata.files.filter((file) => {
      return !allUsedFileSlugs.includes(file.slug);
    });
    return danglingFiles;
  }
  async getReadableFileStream(slug, range) {
    const graph = await this.#io.getGraph();
    if (!graph.metadata.files.map((file) => file.slug).includes(slug)) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    const stream = await this.#io.getReadableStream(slug, range);
    return stream;
  }
  async getFileInfo(slug) {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.metadata.files.find(
      (file) => file.slug === slug
    );
    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    return fileInfo;
  }
  async getPins() {
    const graph = await this.#io.getGraph();
    const pinnedNotes = (await Promise.allSettled(
      graph.metadata.pinnedNotes.map((slug) => {
        return this.get(slug);
      })
    )).filter((result) => {
      return result.status === "fulfilled";
    }).map((result) => result.value);
    return pinnedNotes;
  }
  async pin(slug) {
    const graph = await this.#io.getGraph();
    if (!graph.notes.has(slug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }
    const oldLength = graph.metadata.pinnedNotes.length;
    graph.metadata.pinnedNotes = Array.from(
      /* @__PURE__ */ new Set([...graph.metadata.pinnedNotes, slug])
    );
    const newLength = graph.metadata.pinnedNotes.length;
    const updateMetadata = oldLength !== newLength ? WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE : WriteGraphMetadataAction.NONE;
    await this.#io.flushChanges(graph, updateMetadata, /* @__PURE__ */ new Set(), /* @__PURE__ */ new Set());
    return this.getPins();
  }
  async movePinPosition(slug, offset) {
    const graph = await this.#io.getGraph();
    const oldPins = graph.metadata.pinnedNotes;
    if (!oldPins.includes(slug)) {
      throw new Error(ErrorMessage.PINNED_NOTE_NOT_FOUND);
    }
    const oldIndex = oldPins.indexOf(slug);
    const newIndex = oldIndex + offset;
    const newPins = oldPins.toSpliced(oldIndex, 1).toSpliced(newIndex, 0, slug);
    graph.metadata.pinnedNotes = newPins;
    const updateMetadata = offset !== 0 ? WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE : WriteGraphMetadataAction.NONE;
    await this.#io.flushChanges(graph, updateMetadata, /* @__PURE__ */ new Set(), /* @__PURE__ */ new Set());
    return this.getPins();
  }
  async unpin(slugToRemove) {
    const graph = await this.#io.getGraph();
    let updateMetadata = WriteGraphMetadataAction.NONE;
    graph.metadata.pinnedNotes = graph.metadata.pinnedNotes.filter((s) => {
      if (s === slugToRemove) {
        updateMetadata = WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE;
      }
      return s !== slugToRemove;
    });
    await this.#io.flushChanges(graph, updateMetadata, /* @__PURE__ */ new Set(), /* @__PURE__ */ new Set());
    return this.getPins();
  }
  async getGraph() {
    const graph = await this.#io.getGraph();
    return graph;
  }
  async graphExistsInStorage() {
    return this.#io.graphExistsInStorage();
  }
}

class MockStorageProvider {
  #objects = /* @__PURE__ */ new Map();
  journal = [];
  readObjectAsString(requestPath) {
    if (this.#objects.has(requestPath)) {
      const bytes = this.#objects.get(requestPath);
      const decoder = new TextDecoder();
      const string = decoder.decode(bytes);
      this.journal.push({
        type: "READ" /* READ */,
        requestPath,
        success: true
      });
      return Promise.resolve(string);
    } else {
      this.journal.push({
        type: "READ" /* READ */,
        requestPath,
        success: false
      });
      return Promise.reject(new Error("File not found."));
    }
  }
  getReadableStream(requestPath) {
    if (this.#objects.has(requestPath)) {
      const mapItem = this.#objects.get(requestPath);
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(mapItem);
          controller.close();
        }
      });
      this.journal.push({
        type: "READ" /* READ */,
        requestPath,
        success: true
      });
      return Promise.resolve(readableStream);
    } else {
      this.journal.push({
        type: "READ" /* READ */,
        requestPath,
        success: false
      });
      throw new Error("File not found.");
    }
  }
  removeObject(requestPath) {
    this.#objects.delete(requestPath);
    this.journal.push({
      type: "DELETE" /* DELETE */,
      requestPath,
      success: true
    });
    return Promise.resolve();
  }
  writeObject(requestPath, data) {
    const strToUTF8 = (string) => {
      const encoder = new TextEncoder();
      return encoder.encode(string);
    };
    this.journal.push({
      type: "WRITE" /* WRITE */,
      requestPath,
      data,
      success: true
    });
    this.#objects.set(requestPath, strToUTF8(data));
    return Promise.resolve();
  }
  async writeObjectFromReadable(requestPath, readableStream) {
    const blob = new Uint8Array(
      await (await new Response(readableStream).blob()).arrayBuffer()
    );
    this.#objects.set(requestPath, blob);
    const size = blob.length;
    this.journal.push({
      type: "WRITE" /* WRITE */,
      requestPath,
      success: true
    });
    return Promise.resolve(size);
  }
  async renameFile(oldRequestPath, newRequestPath) {
    if (this.#objects.has(oldRequestPath)) {
      const value = this.#objects.get(oldRequestPath);
      this.#objects.set(newRequestPath, value);
      this.#objects.delete(oldRequestPath);
      this.journal.push({
        type: "RENAME" /* RENAME */,
        requestPath: oldRequestPath,
        newRequestPath,
        success: true
      });
      return Promise.resolve();
    } else {
      this.journal.push({
        type: "RENAME" /* RENAME */,
        requestPath: oldRequestPath,
        newRequestPath,
        success: false
      });
      throw new Error("File not found.");
    }
  }
  joinPath(...segments) {
    return segments.join("/");
  }
  getObjectSize(requestPath) {
    if (this.#objects.has(requestPath)) {
      const value = this.#objects.get(requestPath);
      const size = value.length;
      return Promise.resolve(size);
    } else {
      throw new Error("Object not found.");
    }
  }
  listDirectory() {
    this.journal.push({
      type: "LIST_DIRECTORY" /* LIST_DIRECTORY */,
      requestPath: "/",
      success: true
    });
    return Promise.resolve(Array.from(this.#objects.keys()));
  }
  getAllObjectNames() {
    return Promise.resolve(Array.from(this.#objects.keys()));
  }
  getTotalSize() {
    let sum = 0;
    for (const obj of this.#objects.values()) {
      sum += obj.byteLength;
    }
    return Promise.resolve(sum);
  }
  clearJournal() {
    this.journal = [];
  }
}

const createDemoGraph = async (notesProvider) => {
  const DEMO_GRAPH_ASSETS_PATH = `${ROOT_PATH}assets/demo-graph-assets/`;
  const demoNoteSlugs = [
    "welcome-to-neno"
  ];
  const demoFiles = [
    "beach.jpg"
  ];
  for (const demoNoteSlug of demoNoteSlugs) {
    const response = await fetch(
      `${DEMO_GRAPH_ASSETS_PATH}${demoNoteSlug}.subtext`
    );
    const content = await response.text();
    const noteSaveRequest = {
      note: {
        content,
        meta: {
          flags: [],
          additionalHeaders: {}
        }
      },
      changeSlugTo: demoNoteSlug
    };
    await notesProvider.put(noteSaveRequest);
  }
  for (const demoFile of demoFiles) {
    const response = await fetch(
      `${DEMO_GRAPH_ASSETS_PATH}files/${demoFile}`
    );
    const readable = response.body;
    if (!readable) {
      throw new Error("Could not get readable stream");
    }
    await notesProvider.addFile(readable, "files", demoFile);
  }
};

async function verifyPermission(fileSystemHandle, readWrite) {
  const options = {};
  {
    options.mode = "readwrite";
  }
  if (await fileSystemHandle.queryPermission(options) === "granted") {
    return;
  }
  if (await fileSystemHandle.requestPermission(options) === "granted") {
    return;
  }
  throw new Error("User did not grant permission to " + fileSystemHandle.name);
}
const FOLDER_HANDLE_STORAGE_KEY = "LOCAL_DB_FOLDER_HANDLE";
let folderHandle = null;
let notesProvider = null;
const getExistingFolderHandleName = async () => {
  if (folderHandle) {
    return folderHandle.name;
  }
  const folderHandleFromStorage = await get(
    FOLDER_HANDLE_STORAGE_KEY
  );
  if (folderHandleFromStorage) {
    return folderHandleFromStorage.name;
  }
  return null;
};
const getActiveFolderHandle = () => {
  return folderHandle;
};
const getFolderHandleFromStorage = async () => {
  const folderHandle2 = await get(
    FOLDER_HANDLE_STORAGE_KEY
  );
  if (!folderHandle2) {
    throw new Error("No folder handle in storage");
  }
  return folderHandle2;
};
const createMockNotesProvider = async (createDummyNotes) => {
  const memoryStorageProvider = new MockStorageProvider();
  if (createDummyNotes) {
    for (let i = 1; i <= 1e3; i++) {
      await memoryStorageProvider.writeObject(
        "note-" + i + ".subtext",
        "Test note " + i
      );
    }
  }
  notesProvider = new NotesProvider(memoryStorageProvider);
  return notesProvider;
};
const initializeNotesProvider = async (newFolderHandle, createDummyNotes) => {
  if (!newFolderHandle) {
    return createMockNotesProvider(createDummyNotes ?? false);
  }
  await verifyPermission(newFolderHandle);
  await set(
    FOLDER_HANDLE_STORAGE_KEY,
    newFolderHandle
  );
  folderHandle = newFolderHandle;
  const storageProvider = new FileSystemAccessAPIStorageProvider(folderHandle);
  notesProvider = new NotesProvider(storageProvider);
  if (!await notesProvider.graphExistsInStorage()) {
    await createDemoGraph(notesProvider);
  }
  return notesProvider;
};
const initializeNotesProviderWithFolderHandleFromStorage = async () => {
  const folderHandleFromStorage = await getFolderHandleFromStorage();
  return initializeNotesProvider(folderHandleFromStorage);
};
const isInitialized = () => {
  return notesProvider instanceof NotesProvider;
};
const getNotesProvider = () => {
  return notesProvider;
};
const invalidateNotesProvider = async () => {
  if (!folderHandle) {
    throw new Error("No folder handle available");
  }
  const notesProvider2 = await initializeNotesProvider(folderHandle);
  return notesProvider2;
};
const getUrlForSlug = async (slug) => {
  if (!notesProvider) {
    throw new Error("Notes provider not initialized");
  }
  const readable = await notesProvider.getReadableFileStream(
    slug
  );
  const extension = NotesProvider.getExtensionFromFilename(slug);
  const mimeType = extension && MimeTypes.has(extension) ? MimeTypes.get(extension) : "application/neno-filestream";
  const blob = await streamToBlob(readable, mimeType);
  const url = URL.createObjectURL(blob);
  return url;
};
const saveFile = async (slug) => {
  if (!notesProvider) {
    throw new Error("Notes provider not initialized");
  }
  const readable = await notesProvider.getReadableFileStream(
    slug
  );
  const extension = NotesProvider.getExtensionFromFilename(slug);
  const mimeType = extension && MimeTypes.has(extension) ? MimeTypes.get(extension) : "application/neno-filestream";
  const writable = await getWritableStream({
    types: [{
      accept: {
        [mimeType]: ["." + extension]
      }
    }],
    suggestedName: getFilenameFromFileSlug(slug)
  });
  await readable.pipeTo(writable);
};

const shortenText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
};
const ISOTimestampToLocaleString = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};
const createContentFromSlugs = (slugs) => {
  return slugs.reduce((content, slug) => {
    return content + `/${slug}

`;
  }, "").trim();
};
const getNewNoteObject = (params) => {
  const note = {
    isUnsaved: true,
    initialContent: params.content ?? DEFAULT_NOTE_CONTENT,
    // Note may already have files, but the files list will be populated by
    // notesProvider
    files: [],
    flags: []
  };
  Object.seal(note);
  return note;
};
function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1e3 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }
  const units = si ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"] : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  return bytes.toLocaleString(void 0, {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp
  }) + " " + units[u];
}
const streamToBlob = async (stream, mimeType) => {
  const response = new Response(
    stream,
    {
      headers: { "Content-Type": mimeType }
    }
  );
  const blob = await response.blob();
  return blob;
};
const getAppPath = (pathTemplate, params, urlParams, doNotEncode) => {
  let path = `/${pathTemplate}`;
  params?.forEach((value, key) => {
    if (value.length === 0) {
      throw new Error(
        "getAppPath: Empty value for app path param received: " + key
      );
    }
    path = path.replace(
      `%${key}%`,
      doNotEncode ? value : encodeURIComponent(value)
    );
  });
  if (urlParams && urlParams.size > 0) {
    path += "?" + urlParams;
  }
  return path;
};
const getIconSrc = (iconName) => {
  if (iconName === "neno") {
    return ASSETS_PATH + "app-icon/logo.svg";
  }
  return ICON_PATH + iconName + ".svg";
};
const getFilesFromUserSelection = async (types, multiple) => {
  const fileHandles = await window.showOpenFilePicker({
    multiple,
    types,
    excludeAcceptAllOption: false
  });
  const files = await Promise.all(
    // @ts-ignore
    fileHandles.map((fileHandle) => fileHandle.getFile())
  );
  return files;
};
const readFileAsString = async (file) => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = function() {
      const result = fileReader.result;
      resolve(result);
    };
    fileReader.readAsText(file);
  });
};
const getUrl = async (file) => {
  const slug = file.slug;
  const url = await getUrlForSlug(slug);
  return url;
};
const getWritableStream = async (opts) => {
  const newHandle = await window.showSaveFilePicker(opts);
  const writableStream = await newHandle.createWritable();
  return writableStream;
};
const getPagedMatches = (allMatches, page, rows) => {
  const startIndex = (page - 1) * rows;
  if (allMatches.length < startIndex) {
    return [];
  } else {
    const allMatchesFromThisPageOn = allMatches.slice(startIndex);
    if (allMatchesFromThisPageOn.length > rows) {
      return allMatches.slice(startIndex, startIndex + rows);
    } else {
      return allMatchesFromThisPageOn;
    }
  }
};
const getLines = (text, startOffset, numberOfLines, onlyNonEmptyLines) => {
  let lines = text.split("\n");
  {
    lines = lines.filter((line) => line.trim().length > 0);
  }
  return lines.slice(startOffset, startOffset + numberOfLines).join("\n");
};
const getWikilinkForNote = (slug, title) => {
  const wikilinkContent = sluggifyWikilinkText(title) === slug ? title : slug.replace(/\//g, "//");
  const wikilink = `[[${wikilinkContent}]]`;
  return wikilink;
};

const StartViewLocal = () => {
  const [localDisclaimer, setLocalDisclaimer] = reactExports.useState(null);
  const [
    localDatabaseFolderHandleName,
    setLocalDatabaseFolderHandleName
  ] = reactExports.useState(null);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    const retrieveLocalDatabaseFolderHandle = async () => {
      const folderHandleName = await getExistingFolderHandleName();
      setLocalDatabaseFolderHandleName(folderHandleName);
    };
    retrieveLocalDatabaseFolderHandle();
  }, []);
  if (typeof window.showDirectoryPicker !== "function") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: l$4("start.local.unsupported") }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "start-view-local", children: [
    localDisclaimer === "INVALID_FOLDER_HANDLE" ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "error-text", children: l$4("start.local.error-accessing-folder") }) : "",
    typeof localDatabaseFolderHandleName === "string" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: l$4("start.local.already-created-folder") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "default-button default-action",
          onClick: async () => {
            try {
              await initializeNotesProviderWithFolderHandleFromStorage();
              const urlSearchParams = new URLSearchParams(window.location.search);
              if (urlSearchParams.has("redirect")) {
                navigate(urlSearchParams.get("redirect") ?? "/");
              } else {
                navigate(getAppPath(
                  PathTemplate.NEW_NOTE,
                  /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
                ));
              }
            } catch (e) {
              setLocalDatabaseFolderHandleName(null);
              setLocalDisclaimer("INVALID_FOLDER_HANDLE");
            }
          },
          children: l$4(
            "start.local.open-folder-x",
            { dbName: localDatabaseFolderHandleName }
          )
        }
      )
    ] }) : "",
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: l$4("start.local.select-folder.explainer") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "default-button default-action",
        onClick: async () => {
          try {
            const folderHandle = await window.showDirectoryPicker();
            await initializeNotesProvider(folderHandle);
            navigate(getAppPath(
              PathTemplate.NEW_NOTE,
              /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
            ));
          } catch (e) {
          }
        },
        children: l$4("start.local.select-folder")
      }
    )
  ] });
};

const Icon = ({
  icon,
  title,
  size
}, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      ref,
      src: getIconSrc(icon),
      alt: title,
      width: size.toString(),
      height: size.toString(),
      className: "svg-icon"
    }
  );
};
const Icon$1 = React.forwardRef(Icon);

const IconButton = ({
  id,
  title,
  icon,
  onClick,
  disabled = false
}) => {
  const ref = reactExports.useRef(null);
  const popoverRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const showPopover = () => {
      const popoverElement = document.createElement("div");
      popoverElement.popover = "auto";
      popoverElement.className = "tooltip";
      document.body.appendChild(popoverElement);
      popoverElement.innerHTML = title;
      popoverElement.showPopover();
      popoverRef.current = popoverElement;
      const popoverRect = popoverElement.getBoundingClientRect();
      const targetRect = ref.current?.getBoundingClientRect();
      if (!targetRect) throw new Error("Target rect undefined");
      const css = new CSSStyleSheet();
      css.replaceSync(`
      .tooltip:popover-open {
        top: ${targetRect.y - 35}px;
        left: ${targetRect.x + 25 - popoverRect.width / 2}px;
      }`);
      document.adoptedStyleSheets = [css];
    };
    const hidePopover = () => {
      popoverRef.current?.hidePopover();
      popoverRef.current?.parentElement?.removeChild(popoverRef.current);
    };
    ref.current?.addEventListener("mouseenter", showPopover);
    ref.current?.addEventListener("mouseleave", hidePopover);
    return () => {
      ref.current?.removeEventListener("mouseenter", showPopover);
      ref.current?.removeEventListener("mouseleave", hidePopover);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      className: "icon-button",
      id,
      onClick,
      disabled,
      ref,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Icon$1,
        {
          icon,
          title,
          size: 24
        }
      )
    }
  );
};

const AppTitle = ({ toggleAppMenu }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    IconButton,
    {
      onClick: toggleAppMenu,
      icon: "menu",
      title: l$4("app.menu-button.alt")
    }
  );
};

const AppMenuItem = ({
  icon,
  label,
  onClick,
  disabled = false
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onClick: disabled ? void 0 : onClick,
      className: "app-menu-item" + (disabled ? " disabled" : ""),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: getIconSrc(icon),
            alt: label,
            width: "24",
            height: "24",
            className: "svg-icon"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "label",
            children: label
          }
        )
      ]
    }
  );
};

function useOutsideAlerter(ref, callback) {
  const [
    hasAlreadyBeenTriggeredOnce,
    setHasAlreadyBeenTriggeredOnce
  ] = reactExports.useState(false);
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      if (hasAlreadyBeenTriggeredOnce) {
        callback();
      } else {
        setHasAlreadyBeenTriggeredOnce(true);
      }
    }
  }
  reactExports.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });
}
function OutsideAlerter({
  children,
  onOutsideClick
}) {
  const wrapperRef = reactExports.useRef(null);
  useOutsideAlerter(wrapperRef, onOutsideClick);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: wrapperRef,
      className: "outside-alerter",
      children
    }
  );
}

const QUERY = `(max-width: ${MAX_WIDTH_SMALL_SCREEN}px)`;
let isSmallScreen;
let changeCallbacks = [];
const getIsSmallScreenFromBrowser = () => {
  return window.matchMedia(QUERY).matches;
};
const getIsSmallScreen = () => {
  return isSmallScreen;
};
const addChangeListener = (callback) => {
  changeCallbacks.push(callback);
};
const removeChangeListener = (callback) => {
  const index = changeCallbacks.findIndex((callbackInArray) => {
    return callbackInArray === callback;
  });
  changeCallbacks.splice(index, 1);
};
const handleChange = () => {
  const newIsSmallScreen = getIsSmallScreenFromBrowser();
  if (newIsSmallScreen !== isSmallScreen) {
    isSmallScreen = newIsSmallScreen;
    changeCallbacks.forEach((callback) => {
      callback(isSmallScreen);
    });
  }
};
isSmallScreen = getIsSmallScreenFromBrowser();
const mediaQueryList = window.matchMedia(QUERY);
mediaQueryList.addEventListener("change", handleChange);

const useIsSmallScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = reactExports.useState(
    getIsSmallScreen()
  );
  reactExports.useEffect(() => {
    const updateMatch = () => {
      setIsSmallScreen(getIsSmallScreen());
    };
    updateMatch();
    addChangeListener(updateMatch);
    return () => {
      removeChangeListener(updateMatch);
    };
  }, []);
  return isSmallScreen;
};

const useConfirm = () => {
  const confirm = reactExports.useContext(
    ConfirmationServiceContext
  );
  if (!confirm) {
    throw new Error(
      "ConfirmationServiceContext is not initialized"
    );
  }
  return confirm;
};

const useConfirmDiscardingUnsavedChangesDialog = () => {
  const confirm = useConfirm();
  const confirmDiscardingUnsavedChanges = () => {
    return confirm({
      text: l$4("editor.discard-changes-confirmation.text"),
      confirmText: l$4("editor.discard-changes-confirmation.confirm"),
      cancelText: l$4("dialog.cancel"),
      encourageConfirmation: false
    });
  };
  return confirmDiscardingUnsavedChanges;
};

const AppMenu = () => {
  const {
    isAppMenuOpen,
    setIsAppMenuOpen
  } = reactExports.useContext(AppMenuContext);
  const [unsavedChanges, setUnsavedChanges] = reactExports.useContext(UnsavedChangesContext);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  if (!isAppMenuOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    OutsideAlerter,
    {
      onOutsideClick: () => setIsAppMenuOpen(false),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-menu", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AppMenuItem,
          {
            disabled: false,
            label: l$4("menu.launchpad"),
            icon: "rocket_launch",
            onClick: async () => {
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(getAppPath(PathTemplate.START));
              setIsAppMenuOpen(false);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AppMenuItem,
          {
            disabled: !isInitialized(),
            label: isSmallScreen ? l$4("menu.note-list") : l$4("menu.editor"),
            icon: isSmallScreen ? "list" : "create",
            onClick: async () => {
              const target = getAppPath(
                isSmallScreen ? PathTemplate.LIST : PathTemplate.NEW_NOTE,
                /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
              );
              if (pathname === target) return;
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(target);
              setIsAppMenuOpen(false);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AppMenuItem,
          {
            disabled: !isInitialized(),
            label: l$4("menu.files"),
            icon: "grid_view",
            onClick: async () => {
              const target = getAppPath(
                PathTemplate.FILES,
                /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
              );
              if (pathname === target) return;
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(target);
              setIsAppMenuOpen(false);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AppMenuItem,
          {
            disabled: !isInitialized(),
            label: l$4("menu.stats"),
            icon: "query_stats",
            onClick: async () => {
              const target = getAppPath(
                PathTemplate.STATS,
                /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
              );
              if (pathname === target) return;
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(target);
              setIsAppMenuOpen(false);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AppMenuItem,
          {
            disabled: false,
            label: l$4("menu.settings"),
            icon: "settings",
            onClick: async () => {
              const target = getAppPath(
                PathTemplate.SETTINGS,
                /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
              );
              if (pathname === target) return;
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(target);
              setIsAppMenuOpen(false);
            }
          }
        )
      ] })
    }
  );
};

const HeaderContainer = ({
  children,
  noBackground
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "app-header " + (noBackground ? "no-background" : ""), children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppMenu, {})
  ] });
};

const HeaderContainerLeftRight = ({
  leftContent,
  rightContent,
  noBackground
}) => {
  const { toggleAppMenu } = reactExports.useContext(AppMenuContext);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(HeaderContainer, { noBackground, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AppTitle,
        {
          toggleAppMenu
        }
      ),
      leftContent
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "header-right", children: rightContent })
  ] });
};

const useKeyboardShortcuts = (handlers, elementRef) => {
  const handleKeydown = (e) => {
    if (handlers.onSave && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey) && e.key === "s" && !e.shiftKey) {
      handlers.onSave();
      e.preventDefault();
    }
    if (handlers.onCmdDot && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey) && e.key === ".") {
      handlers.onCmdDot();
      e.preventDefault();
    }
    if (handlers.onCmdB && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey) && e.key === "b") {
      handlers.onCmdB();
      e.preventDefault();
    }
    if (handlers.onCmdE && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey) && e.key === "e") {
      handlers.onCmdE();
      e.preventDefault();
    }
    if (handlers.onCmdI && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey) && e.key === "i") {
      handlers.onCmdI();
      e.preventDefault();
    }
    if (handlers.onCmdU && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey) && e.key === "u") {
      handlers.onCmdU();
      e.preventDefault();
    }
    if (handlers.onArrowUp && e.key === "ArrowUp") {
      handlers.onArrowUp();
      e.preventDefault();
    }
    if (handlers.onArrowDown && e.key === "ArrowDown") {
      handlers.onArrowDown();
      e.preventDefault();
    }
    if (handlers.onEnter && e.key === "Enter") {
      handlers.onEnter();
      e.preventDefault();
    }
  };
  reactExports.useEffect(() => {
    if (elementRef?.current) {
      elementRef.current.addEventListener("keydown", handleKeydown);
    } else {
      document.body.addEventListener("keydown", handleKeydown);
    }
    return () => {
      if (elementRef?.current) {
        elementRef.current.removeEventListener("keydown", handleKeydown);
      } else {
        document.body.removeEventListener("keydown", handleKeydown);
      }
    };
  }, [handleKeydown, handlers, elementRef]);
};

const StartView = () => {
  const [
    memoryStorageProviderVisbility,
    setMemoryStorageProviderVisbility
  ] = reactExports.useState(false);
  const navigate = useNavigate();
  useKeyboardShortcuts({
    onCmdDot: () => {
      setMemoryStorageProviderVisbility(true);
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderContainerLeftRight, { noBackground: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "section-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "start-welcome",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: ASSETS_PATH + "app-icon/logo.svg",
                alt: l$4("start.logo.alt"),
                id: "start-logo"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "start-welcome-app-title", children: l$4("app.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: l$4("start.introduction") })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StartViewLocal, {}),
      memoryStorageProviderVisbility ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "memory-storage-providers",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "default-button default-action",
                id: "memory-storage-load-button",
                onClick: async () => {
                  await initializeNotesProvider(void 0, false);
                  const urlSearchParams = new URLSearchParams(window.location.search);
                  if (urlSearchParams.has("redirect")) {
                    navigate(urlSearchParams.get("redirect") ?? "/");
                  } else {
                    navigate(getAppPath(
                      PathTemplate.NEW_NOTE,
                      /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
                    ));
                  }
                },
                children: "Memory Storage"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "default-button memory-storage",
                id: "memory-storage-dummy-notes-load-button",
                onClick: async () => {
                  await initializeNotesProvider(void 0, true);
                  const urlSearchParams = new URLSearchParams(window.location.search);
                  if (urlSearchParams.has("redirect")) {
                    navigate(urlSearchParams.get("redirect") ?? "/");
                  } else {
                    navigate(getAppPath(
                      PathTemplate.NEW_NOTE,
                      /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
                    ));
                  }
                },
                children: "Memory Storage with dummy notes"
              }
            )
          ]
        }
      ) : "",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "links", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: ROOT_PATH + "docs/index.html",
              children: l$4("start.links.user-manual")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com/polyrainbow/neno/", children: l$4("start.links.source-code") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "version", children: VERSION })
      ] })
    ] })
  ] });
};

const AppHeaderStatsItem = ({
  icon,
  label,
  value
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "app-header-stats-item",
      title: label,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon$1, { icon, size: 24, title: label }),
        " ",
        value
      ]
    }
  );
};

const BusyIndicator = ({
  alt,
  height
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: ASSETS_PATH + "busy.svg",
      alt,
      height
    }
  );
};

const AppHeaderStats = ({
  stats
}) => {
  const showStats = !!stats;
  if (!showStats) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "header-stats", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      BusyIndicator,
      {
        alt: l$4("stats.loading-stats"),
        height: 20
      }
    ) });
  }
  let percentageOfUnlinkedNotes = NaN;
  if (showStats && stats.numberOfAllNotes > 0) {
    percentageOfUnlinkedNotes = Math.round(
      stats.numberOfUnlinkedNotes / stats.numberOfAllNotes * 100 * 100
    ) / 100;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-stats", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppHeaderStatsItem,
      {
        icon: "note",
        label: l$4("stats.number-of-notes"),
        value: stats.numberOfAllNotes.toLocaleString()
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppHeaderStatsItem,
      {
        icon: "link",
        label: l$4("stats.number-of-links"),
        value: stats.numberOfLinks.toLocaleString()
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppHeaderStatsItem,
      {
        icon: "link_off",
        label: l$4("stats.unlinked-notes"),
        value: `${stats.numberOfUnlinkedNotes.toLocaleString()}` + (percentageOfUnlinkedNotes ? ` (${percentageOfUnlinkedNotes.toLocaleString()} %)` : "")
      }
    )
  ] });
};

const HeaderButton = ({
  onClick,
  icon,
  children,
  disabled,
  onDragStart,
  onDragEnd,
  onDragOver,
  className,
  draggable,
  dangerous
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      disabled,
      draggable,
      onDragStart,
      onDragEnd,
      onDragOver,
      className: "header-button " + (icon ? "with-icon" : "without-icon") + (className ? " " + className : "") + (dangerous ? " dangerous" : ""),
      onClick: () => onClick(),
      children: [
        icon ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: getIconSrc(icon),
            role: "presentation",
            width: "24",
            height: "24",
            className: "svg-icon",
            draggable: false
          }
        ) : "",
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children })
      ]
    }
  );
};

const NoteViewHeaderPinnedNote = ({
  note,
  isActive,
  onClick,
  onDragStart,
  onDragEnd,
  onDragOver
}) => {
  const noteTitle = getNoteTitle(note.content);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    HeaderButton,
    {
      className: "pinned-note " + (isActive ? "active" : ""),
      onClick: () => onClick(),
      draggable: true,
      onDragStart: (e) => {
        const wikilink = getWikilinkForNote(note.meta.slug, noteTitle);
        e.dataTransfer.effectAllowed = "linkMove";
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData("text/plain", wikilink);
        onDragStart();
      },
      onDragEnd: (e) => onDragEnd(e.nativeEvent),
      onDragOver: (e) => {
        e.dataTransfer.dropEffect = "move";
        onDragOver(e.nativeEvent);
        e.preventDefault();
      },
      icon: "push_pin",
      children: shortenText(
        noteTitle || note.meta.slug,
        35
      )
    }
  );
};

const useGoToNote = () => {
  const navigate = useNavigate();
  const goToNote = (slug, params) => {
    const path = getAppPath(
      PathTemplate.EXISTING_NOTE,
      /* @__PURE__ */ new Map([
        ["GRAPH_ID", LOCAL_GRAPH_ID],
        ["SLUG", slug]
      ])
    );
    return navigate(path, {
      replace: params?.replace,
      state: {
        contentIfNewNote: params?.contentIfNewNote
      }
    });
  };
  return goToNote;
};

const FlexContainer = ({
  onClick,
  className,
  centerAlignedItems,
  children
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      onClick,
      className: "flex-container" + (className ? " " + className : "") + (centerAlignedItems ? " center-aligned-items" : ""),
      children
    }
  );
};

const NoteViewHeader = ({
  stats,
  pinnedNotes,
  activeNote,
  movePin
}) => {
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  const goToNote = useGoToNote();
  const [unsavedChanges, setUnsavedChanges] = reactExports.useContext(UnsavedChangesContext);
  const { toggleAppMenu } = reactExports.useContext(AppMenuContext);
  const draggedPinIndex = reactExports.useRef(-1);
  const pinRects = reactExports.useRef(null);
  const [dragTargetSlotIndex, setDragTargetSlotIndex] = reactExports.useState(-1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(HeaderContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppTitle,
      {
        toggleAppMenu
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FlexContainer,
      {
        className: "pinned-notes",
        children: Array.isArray(pinnedNotes) ? pinnedNotes.length > 0 ? pinnedNotes.map(
          (pinnedNote, pinIndex) => {
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
              draggedPinIndex.current > -1 && dragTargetSlotIndex === 0 && pinIndex === 0 && dragTargetSlotIndex !== draggedPinIndex.current && dragTargetSlotIndex !== draggedPinIndex.current + 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "pin-insert-indicator"
                },
                "pin-insert-indicator-start-0"
              ) : "",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                NoteViewHeaderPinnedNote,
                {
                  note: pinnedNote,
                  onDragStart: () => {
                    draggedPinIndex.current = pinIndex;
                    setDragTargetSlotIndex(pinIndex);
                    pinRects.current = Array.from(
                      document.querySelectorAll("button.pinned-note")
                    ).map((el) => {
                      return el.getBoundingClientRect();
                    });
                  },
                  onDragOver: (e) => {
                    if (!pinRects.current) return;
                    let slotIndex = 0;
                    for (let p = 0; p < pinRects.current.length; p++) {
                      const pinRect = pinRects.current[p];
                      if (e.clientX > pinRect.x + pinRect.width / 2) {
                        slotIndex++;
                      } else {
                        break;
                      }
                    }
                    setDragTargetSlotIndex(slotIndex);
                  },
                  onDragEnd: (e) => {
                    const dpi = draggedPinIndex.current;
                    if (dragTargetSlotIndex === dpi || dragTargetSlotIndex === dpi + 1) {
                      setDragTargetSlotIndex(-1);
                      draggedPinIndex.current = -1;
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }
                    const offset = dragTargetSlotIndex > dpi ? dragTargetSlotIndex - dpi - 1 : dragTargetSlotIndex - dpi;
                    movePin(pinnedNote.meta.slug, offset);
                    setDragTargetSlotIndex(-1);
                    draggedPinIndex.current = -1;
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  },
                  onClick: async () => {
                    if (activeNote && "slug" in activeNote && pinnedNote.meta.slug === activeNote.slug) {
                      return;
                    }
                    if (unsavedChanges) {
                      await confirmDiscardingUnsavedChanges();
                      setUnsavedChanges(false);
                    }
                    goToNote(pinnedNote.meta.slug);
                  },
                  isActive: !!activeNote && !activeNote.isUnsaved && pinnedNote.meta.slug === activeNote.slug
                },
                `pinnedNote_${pinnedNote.meta.slug}`
              ),
              draggedPinIndex.current > -1 && dragTargetSlotIndex === pinIndex + 1 && dragTargetSlotIndex !== draggedPinIndex.current && dragTargetSlotIndex !== draggedPinIndex.current + 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "pin-insert-indicator"
                },
                "pin-insert-indicator-end-" + pinIndex
              ) : ""
            ] }, "pin-fragment-" + pinnedNote.meta.slug);
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "pinned-notes-placeholder",
            children: l$4("app.pinned-notes-placeholder")
          }
        ) : ""
      }
    ),
    stats ? /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeaderStats, { stats }) : ""
  ] });
};

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const e={},r$2={},s$1={},i$3={},o$2={},l$3={},c$2={},a$2={},u$3={},f$2={},d$2={},h$3={},g$3={},_$2={},p$3={},y$1={},m$4={},x$3={},v={},T$1={},C$1={},k$1={},S$1={},b$1={},w={},N$1={},F={},I={},L$2={},A={},M$2={},z={},W={},B={},R={},K={},J={},U={},V={},$$1={};function H$1(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var j=H$1((function(t){const e=new URLSearchParams;e.append("code",t);for(let t=1;t<arguments.length;t++)e.append("v",arguments[t]);throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));const q="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement,Q$1=q&&"documentMode"in document?document.documentMode:null,X=q&&/Mac|iPod|iPhone|iPad/.test(navigator.platform),Y=q&&/^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent),Z=!(!q||!("InputEvent"in window)||Q$1)&&"getTargetRanges"in new window.InputEvent("input"),G=q&&/Version\/[\d.]+.*Safari/.test(navigator.userAgent),tt=q&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,et=q&&/Android/.test(navigator.userAgent),nt=q&&/^(?=.*Chrome).*/i.test(navigator.userAgent),rt=q&&et&&nt,st=q&&/AppleWebKit\/[\d.]+/.test(navigator.userAgent)&&!nt,it=1,ot=3,lt=0,ct=1,at=2,ut=0,ft=1,dt=2,ht=4,gt=8,_t=240|(3|ht|gt),pt=1,yt=2,mt=3,xt=4,vt=5,Tt=6,Ct=G||tt||st?" ":"​",kt="\n\n",St=Y?" ":Ct,bt="֑-߿יִ-﷽ﹰ-ﻼ",wt="A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿",Nt=new RegExp("^[^"+wt+"]*["+bt+"]"),Et=new RegExp("^[^"+bt+"]*["+wt+"]"),Pt={bold:1,code:16,highlight:128,italic:2,strikethrough:ht,subscript:32,superscript:64,underline:gt},Dt={directionless:1,unmergeable:2},Ft={center:yt,end:Tt,justify:xt,left:pt,right:mt,start:vt},Ot={[yt]:"center",[Tt]:"end",[xt]:"justify",[pt]:"left",[mt]:"right",[vt]:"start"},It={normal:0,segmented:2,token:1},Lt={[ut]:"normal",[dt]:"segmented",[ft]:"token"};function At(...t){const e=[];for(const n of t)if(n&&"string"==typeof n)for(const[t]of n.matchAll(/\S+/g))e.push(t);return e}const Mt=100;let zt=!1,Wt=0;function Bt(t){Wt=t.timeStamp;}function Rt(t,e,n){return e.__lexicalLineBreak===t||void 0!==t[`__lexicalKey_${n._key}`]}function Kt(t,e,n){const r=ln(n._window);let s=null,i=null;null!==r&&r.anchorNode===t&&(s=r.anchorOffset,i=r.focusOffset);const o=t.nodeValue;null!==o&&Ne(e,o,s,i,!1);}function Jt(t,e,n){if(ns(t)){const e=t.anchor.getNode();if(e.is(n)&&t.format!==e.getFormat())return !1}return e.nodeType===ot&&n.isAttached()}function Ut(t,e,n){zt=!0;const r=performance.now()-Wt>Mt;try{Ys(t,(()=>{const s=ms()||function(t){return t.getEditorState().read((()=>{const t=ms();return null!==t?t.clone():null}))}(t),i=new Map,o=t.getRootElement(),l=t._editorState,c=t._blockCursorElement;let a=!1,u="";for(let n=0;n<e.length;n++){const f=e[n],d=f.type,h=f.target;let g=ge(h,l);if(!(null===g&&h!==o||ni(g)))if("characterData"===d)r&&$r(g)&&Jt(s,h,g)&&Kt(h,g,t);else if("childList"===d){a=!0;const e=f.addedNodes;for(let n=0;n<e.length;n++){const r=e[n],s=he(r),i=r.parentNode;if(null!=i&&r!==c&&null===s&&("BR"!==r.nodeName||!Rt(r,i,t))){if(Y){const t=r.innerText||r.nodeValue;t&&(u+=t);}i.removeChild(r);}}const n=f.removedNodes,r=n.length;if(r>0){let e=0;for(let s=0;s<r;s++){const r=n[s];("BR"===r.nodeName&&Rt(r,h,t)||c===r)&&(h.appendChild(r),e++);}r!==e&&(h===o&&(g=me(l)),i.set(h,g));}}}if(i.size>0)for(const[e,n]of i)if(Gs(n)){const r=n.getChildrenKeys();let s=e.firstChild;for(let n=0;n<r.length;n++){const i=r[n],o=t.getElementByKey(i);null!==o&&(null==s?(e.appendChild(o),s=o):s!==o&&e.replaceChild(o,s),s=s.nextSibling);}}else $r(n)&&n.markDirty();const f=n.takeRecords();if(f.length>0){for(let e=0;e<f.length;e++){const n=f[e],r=n.addedNodes,s=n.target;for(let e=0;e<r.length;e++){const n=r[e],i=n.parentNode;null==i||"BR"!==n.nodeName||Rt(n,s,t)||i.removeChild(n);}}n.takeRecords();}null!==s&&(a&&(s.dirty=!0,xe(s)),Y&&Je(t)&&s.insertRawText(u));}));}finally{zt=!1;}}function Vt(t){const e=t._observer;if(null!==e){Ut(t,e.takeRecords(),e);}}function $t(t){!function(t){0===Wt&&Xe(t).addEventListener("textInput",Bt,!0);}(t),t._observer=new MutationObserver(((e,n)=>{Ut(t,e,n);}));}function Ht(t,e){const n=t.__mode,r=t.__format,s=t.__style,i=e.__mode,o=e.__format,l=e.__style;return !(null!==n&&n!==i||null!==r&&r!==o||null!==s&&s!==l)}function jt(t,e){const n=t.mergeWithSibling(e),r=Bs()._normalizedNodes;return r.add(t.__key),r.add(e.__key),n}function qt(t){let e,n,r=t;if(""!==r.__text||!r.isSimpleText()||r.isUnmergeable()){for(;null!==(e=r.getPreviousSibling())&&$r(e)&&e.isSimpleText()&&!e.isUnmergeable();){if(""!==e.__text){if(Ht(e,r)){r=jt(e,r);break}break}e.remove();}for(;null!==(n=r.getNextSibling())&&$r(n)&&n.isSimpleText()&&!n.isUnmergeable();){if(""!==n.__text){if(Ht(r,n)){r=jt(r,n);break}break}n.remove();}}else r.remove();}function Qt(t){return Xt(t.anchor),Xt(t.focus),t}function Xt(t){for(;"element"===t.type;){const e=t.getNode(),n=t.offset;let r,s;if(n===e.getChildrenSize()?(r=e.getChildAtIndex(n-1),s=!0):(r=e.getChildAtIndex(n),s=!1),$r(r)){t.set(r.__key,s?r.getTextContentSize():0,"text");break}if(!Gs(r))break;t.set(r.__key,s?r.getChildrenSize():0,"element");}}let Yt=1;const Zt="function"==typeof queueMicrotask?queueMicrotask:t=>{Promise.resolve().then(t);};function Gt(t){const e=document.activeElement;if(null===e)return !1;const n=e.nodeName;return ni(ge(t))&&("INPUT"===n||"TEXTAREA"===n||"true"===e.contentEditable&&null==e.__lexicalEditor)}function te(t,e,n){const r=t.getRootElement();try{return null!==r&&r.contains(e)&&r.contains(n)&&null!==e&&!Gt(e)&&ee(e)===t}catch(t){return !1}}function ee(t){let e=t;for(;null!=e;){const t=e.__lexicalEditor;if(null!=t)return t;e=He(e);}return null}function ne(t){return t.isToken()||t.isSegmented()}function re(t){return t.nodeType===ot}function se(t){let e=t;for(;null!=e;){if(re(e))return e;e=e.firstChild;}return null}function ie(t,e,n){const r=Pt[e];if(null!==n&&(t&r)==(n&r))return t;let s=t^r;return "subscript"===e?s&=~Pt.superscript:"superscript"===e&&(s&=~Pt.subscript),s}function le(t,e){if(null!=e)return void(t.__key=e);Ms(),zs();const n=Bs(),r=Ws(),s=""+Yt++;r._nodeMap.set(s,t),Gs(t)?n._dirtyElements.set(s,!0):n._dirtyLeaves.add(s),n._cloneNotNeeded.add(s),n._dirtyType=ct,t.__key=s;}function ce(t){const e=t.getParent();if(null!==e){const n=t.getWritable(),r=e.getWritable(),s=t.getPreviousSibling(),i=t.getNextSibling();if(null===s)if(null!==i){const t=i.getWritable();r.__first=i.__key,t.__prev=null;}else r.__first=null;else {const t=s.getWritable();if(null!==i){const e=i.getWritable();e.__prev=t.__key,t.__next=e.__key;}else t.__next=null;n.__prev=null;}if(null===i)if(null!==s){const t=s.getWritable();r.__last=s.__key,t.__next=null;}else r.__last=null;else {const t=i.getWritable();if(null!==s){const e=s.getWritable();e.__next=t.__key,t.__prev=e.__key;}else t.__prev=null;n.__next=null;}r.__size--,n.__parent=null;}}function ae(t){zs();const e=t.getLatest(),n=e.__parent,r=Ws(),s=Bs(),i=r._nodeMap,o=s._dirtyElements;null!==n&&function(t,e,n){let r=t;for(;null!==r;){if(n.has(r))return;const t=e.get(r);if(void 0===t)break;n.set(r,!1),r=t.__parent;}}(n,i,o);const l=e.__key;s._dirtyType=ct,Gs(t)?o.set(l,!0):s._dirtyLeaves.add(l);}function ue(t){Ms();const e=Bs(),n=e._compositionKey;if(t!==n){if(e._compositionKey=t,null!==n){const t=de(n);null!==t&&t.getWritable();}if(null!==t){const e=de(t);null!==e&&e.getWritable();}}}function fe(){if(As())return null;return Bs()._compositionKey}function de(t,e){const n=(e||Ws())._nodeMap.get(t);return void 0===n?null:n}function he(t,e){const n=t[`__lexicalKey_${Bs()._key}`];return void 0!==n?de(n,e):null}function ge(t,e){let n=t;for(;null!=n;){const t=he(n,e);if(null!==t)return t;n=He(n);}return null}function _e(t){const e=t._decorators,n=Object.assign({},e);return t._pendingDecorators=n,n}function pe(t){return t.read((()=>ye().getTextContent()))}function ye(){return me(Ws())}function me(t){return t._nodeMap.get("root")}function xe(t){Ms();const e=Ws();null!==t&&(t.dirty=!0,t.setCachedNodes(null)),e._selection=t;}function ve(t){const e=Bs(),n=function(t,e){let n=t;for(;null!=n;){const t=n[`__lexicalKey_${e._key}`];if(void 0!==t)return t;n=He(n);}return null}(t,e);if(null===n){return t===e.getRootElement()?de("root"):null}return de(n)}function Te(t,e){return e?t.getTextContentSize():0}function Ce(t){return /[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(t)}function ke(t){const e=[];let n=t;for(;null!==n;)e.push(n),n=n._parentEditor;return e}function Se(){return Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,5)}function be(t){return t.nodeType===ot?t.nodeValue:null}function we(t,e,n){const r=ln(e._window);if(null===r)return;const s=r.anchorNode;let{anchorOffset:i,focusOffset:o}=r;if(null!==s){let e=be(s);const r=ge(s);if(null!==e&&$r(r)){if(e===Ct&&n){const t=n.length;e=n,i=t,o=t;}null!==e&&Ne(r,e,i,o,t);}}}function Ne(t,e,n,r,s){let i=t;if(i.isAttached()&&(s||!i.isDirty())){const o=i.isComposing();let l=e;(o||s)&&e[e.length-1]===Ct&&(l=e.slice(0,-1));const c=i.getTextContent();if(s||l!==c){if(""===l){if(ue(null),G||tt||st)i.remove();else {const t=Bs();setTimeout((()=>{t.update((()=>{i.isAttached()&&i.remove();}));}),20);}return}const e=i.getParent(),s=xs(),c=i.getTextContentSize(),a=fe(),u=i.getKey();if(i.isToken()||null!==a&&u===a&&!o||ns(s)&&(null!==e&&!e.canInsertTextBefore()&&0===s.anchor.offset||s.anchor.key===t.__key&&0===s.anchor.offset&&!i.canInsertTextBefore()&&!o||s.focus.key===t.__key&&s.focus.offset===c&&!i.canInsertTextAfter()&&!o))return void i.markDirty();const f=ms();if(!ns(f)||null===n||null===r)return void i.setTextContent(l);if(f.setTextNodeRange(i,n,i,r),i.isSegmented()){const t=Vr(i.getTextContent());i.replace(t),i=t;}i.setTextContent(l);}}}function Ee(t,e){if(e.isSegmented())return !0;if(!t.isCollapsed())return !1;const n=t.anchor.offset,r=e.getParentOrThrow(),s=e.isToken();return 0===n?!e.canInsertTextBefore()||!r.canInsertTextBefore()&&!e.isComposing()||s||function(t){const e=t.getPreviousSibling();return ($r(e)||Gs(e)&&e.isInline())&&!e.canInsertTextAfter()}(e):n===e.getTextContentSize()&&(!e.canInsertTextAfter()||!r.canInsertTextAfter()&&!e.isComposing()||s)}function Pe(t){return "ArrowLeft"===t}function De(t){return "ArrowRight"===t}function Fe(t,e){return X?t:e}function Oe(t){return "Enter"===t}function Ie(t){return "Backspace"===t}function Le(t){return "Delete"===t}function Ae(t,e,n){return "a"===t.toLowerCase()&&Fe(e,n)}function Me(){const t=ye();xe(Qt(t.select(0,t.getChildrenSize())));}function ze(t,e){void 0===t.__lexicalClassNameCache&&(t.__lexicalClassNameCache={});const n=t.__lexicalClassNameCache,r=n[e];if(void 0!==r)return r;const s=t[e];if("string"==typeof s){const t=At(s);return n[e]=t,t}return s}function We(t,e,n,r,s){if(0===n.size)return;const i=r.__type,o=r.__key,l=e.get(i);void 0===l&&j(33,i);const c=l.klass;let a=t.get(c);void 0===a&&(a=new Map,t.set(c,a));const u=a.get(o),f="destroyed"===u&&"created"===s;(void 0===u||f)&&a.set(o,f?"updated":s);}function Re(t,e,n){const r=t.getParent();let s=n,i=t;return null!==r&&(e&&0===n?(s=i.getIndexWithinParent(),i=r):e||n!==i.getChildrenSize()||(s=i.getIndexWithinParent()+1,i=r)),i.getChildAtIndex(e?s-1:s)}function Ke(t,e){const n=t.offset;if("element"===t.type){return Re(t.getNode(),e,n)}{const r=t.getNode();if(e&&0===n||!e&&n===r.getTextContentSize()){const t=e?r.getPreviousSibling():r.getNextSibling();return null===t?Re(r.getParentOrThrow(),e,r.getIndexWithinParent()+(e?0:1)):t}}return null}function Je(t){const e=Xe(t).event,n=e&&e.inputType;return "insertFromPaste"===n||"insertFromPasteAsQuotation"===n}function Ue(t,e,n){return qs(t,e,n)}function Ve(t){return !si(t)&&!t.isLastChild()&&!t.isInline()}function $e(t,e){const n=t._keyToDOMMap.get(e);return void 0===n&&j(75,e),n}function He(t){const e=t.assignedSlot||t.parentElement;return null!==e&&11===e.nodeType?e.host:e}function Qe(t,e){let n=t.getParent();for(;null!==n;){if(n.is(e))return !0;n=n.getParent();}return !1}function Xe(t){const e=t._window;return null===e&&j(78),e}function Ze(t){let e=t.getParentOrThrow();for(;null!==e;){if(Ge(e))return e;e=e.getParentOrThrow();}return e}function Ge(t){return si(t)||Gs(t)&&t.isShadowRoot()}function en(t){const e=Bs(),n=t.constructor.getType(),r=e._nodes.get(n);void 0===r&&j(97);const s=r.replace;if(null!==s){const e=s(t);return e instanceof t.constructor||j(98),e}return t}function nn(t,e){!si(t.getParent())||Gs(e)||ni(e)||j(99);}function rn(t){return (ni(t)||Gs(t)&&!t.canBeEmpty())&&!t.isInline()}function sn(t,e,n){n.style.removeProperty("caret-color"),e._blockCursorElement=null;const r=t.parentElement;null!==r&&r.removeChild(t);}function on(t,e,n){let r=t._blockCursorElement;if(ns(n)&&n.isCollapsed()&&"element"===n.anchor.type&&e.contains(document.activeElement)){const s=n.anchor,i=s.getNode(),o=s.offset;let l=!1,c=null;if(o===i.getChildrenSize()){rn(i.getChildAtIndex(o-1))&&(l=!0);}else {const e=i.getChildAtIndex(o);if(rn(e)){const n=e.getPreviousSibling();(null===n||rn(n))&&(l=!0,c=t.getElementByKey(e.__key));}}if(l){const n=t.getElementByKey(i.__key);return null===r&&(t._blockCursorElement=r=function(t){const e=t.theme,n=document.createElement("div");n.contentEditable="false",n.setAttribute("data-lexical-cursor","true");let r=e.blockCursor;if(void 0!==r){if("string"==typeof r){const t=At(r);r=e.blockCursor=t;}void 0!==r&&n.classList.add(...r);}return n}(t._config)),e.style.caretColor="transparent",void(null===c?n.appendChild(r):n.insertBefore(r,c))}}null!==r&&sn(r,t,e);}function ln(t){return q?(t||window).getSelection():null}function an(t){return un(t)&&"A"===t.tagName}function un(t){return 1===t.nodeType}function fn(t){const e=new RegExp(/^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var|#text)$/,"i");return null!==t.nodeName.match(e)}function hn(t){if(si(t)||ni(t)&&!t.isInline())return !0;if(!Gs(t)||Ge(t))return !1;const e=t.getFirstChild(),n=null===e||Nr(e)||$r(e)||e.isInline();return !t.isInline()&&!1!==t.canBeEmpty()&&n}function gn(t,e){let n=t;for(;null!==n&&null!==n.getParent()&&!e(n);)n=n.getParentOrThrow();return e(n)?n:null}function pn(t,e,n,r,s,i){let o=t.getFirstChild();for(;null!==o;){const t=o.__key;o.__parent===e&&(Gs(o)&&pn(o,t,n,r,s,i),n.has(t)||i.delete(t),s.push(t)),o=o.getNextSibling();}}let yn,mn,xn,vn,Tn,Cn,kn,Sn,bn,wn,Nn="",En="",Pn=null,Dn="",Fn=!1,On=!1,In=null;function Ln(t,e){const n=kn.get(t);if(null!==e){const n=Yn(t);n.parentNode===e&&e.removeChild(n);}if(Sn.has(t)||mn._keyToDOMMap.delete(t),Gs(n)){const t=Hn(n,kn);An(t,0,t.length-1,null);}void 0!==n&&We(wn,xn,vn,n,"destroyed");}function An(t,e,n,r){let s=e;for(;s<=n;++s){const e=t[s];void 0!==e&&Ln(e,r);}}function Mn(t,e){t.setProperty("text-align",e);}const zn="40px";function Wn(t,e){const n=yn.theme.indent;if("string"==typeof n){const r=t.classList.contains(n);e>0&&!r?t.classList.add(n):e<1&&r&&t.classList.remove(n);}const r=getComputedStyle(t).getPropertyValue("--lexical-indent-base-value")||zn;t.style.setProperty("padding-inline-start",0===e?"":`calc(${e} * ${r})`);}function Bn(t,e){const n=t.style;0===e?Mn(n,""):e===pt?Mn(n,"left"):e===yt?Mn(n,"center"):e===mt?Mn(n,"right"):e===xt?Mn(n,"justify"):e===vt?Mn(n,"start"):e===Tt&&Mn(n,"end");}function Rn(t,e,n){const r=Sn.get(t);void 0===r&&j(60);const s=r.createDOM(yn,mn);if(function(t,e,n){const r=n._keyToDOMMap;e["__lexicalKey_"+n._key]=t,r.set(t,e);}(t,s,mn),$r(r)?s.setAttribute("data-lexical-text","true"):ni(r)&&s.setAttribute("data-lexical-decorator","true"),Gs(r)){const t=r.__indent,e=r.__size;if(0!==t&&Wn(s,t),0!==e){const t=e-1;!function(t,e,n,r){const s=En;En="",Kn(t,n,0,e,r,null),Vn(n,r),En=s;}(Hn(r,Sn),t,r,s);}const n=r.__format;0!==n&&Bn(s,n),r.isInline()||Un(null,r,s),Ve(r)&&(Nn+=kt,Dn+=kt);}else {const e=r.getTextContent();if(ni(r)){const e=r.decorate(mn,yn);null!==e&&qn(t,e),s.contentEditable="false";}else $r(r)&&(r.isDirectionless()||(En+=e));Nn+=e,Dn+=e;}if(null!==e)if(null!=n)e.insertBefore(s,n);else {const t=e.__lexicalLineBreak;null!=t?e.insertBefore(s,t):e.appendChild(s);}return We(wn,xn,vn,r,"created"),s}function Kn(t,e,n,r,s,i){const o=Nn;Nn="";let l=n;for(;l<=r;++l){Rn(t[l],s,i);const e=Sn.get(t[l]);null!==e&&null===Pn&&$r(e)&&(Pn=e.getFormat());}Ve(e)&&(Nn+=kt),s.__lexicalTextContent=Nn,Nn=o+Nn;}function Jn(t,e){const n=e.get(t);return Nr(n)||ni(n)&&n.isInline()}function Un(t,e,n){const r=null!==t&&(0===t.__size||Jn(t.__last,kn)),s=0===e.__size||Jn(e.__last,Sn);if(r){if(!s){const t=n.__lexicalLineBreak;null!=t&&n.removeChild(t),n.__lexicalLineBreak=null;}}else if(s){const t=document.createElement("br");n.__lexicalLineBreak=t,n.appendChild(t);}}function Vn(t,e){const n=e.__lexicalDirTextContent,r=e.__lexicalDir;if(n!==En||r!==In){const n=""===En,i=n?In:(s=En,Nt.test(s)?"rtl":Et.test(s)?"ltr":null);if(i!==r){const s=e.classList,o=yn.theme;let l=null!==r?o[r]:void 0,c=null!==i?o[i]:void 0;if(void 0!==l){if("string"==typeof l){const t=At(l);l=o[r]=t;}s.remove(...l);}if(null===i||n&&"ltr"===i)e.removeAttribute("dir");else {if(void 0!==c){if("string"==typeof c){const t=At(c);c=o[i]=t;}void 0!==c&&s.add(...c);}e.dir=i;}if(!On){t.getWritable().__dir=i;}}In=i,e.__lexicalDirTextContent=En,e.__lexicalDir=i;}var s;}function $n(t,e,n){const r=En;var s;En="",Pn=null,function(t,e,n){const r=Nn,s=t.__size,i=e.__size;if(Nn="",1===s&&1===i){const r=t.__first,s=e.__first;if(r===s)jn(r,n);else {const t=Yn(r),e=Rn(s,null,null);n.replaceChild(e,t),Ln(r,null);}const i=Sn.get(s);null===Pn&&$r(i)&&(Pn=i.getFormat());}else {const r=Hn(t,kn),o=Hn(e,Sn);if(0===s)0!==i&&Kn(o,e,0,i-1,n,null);else if(0===i){if(0!==s){const t=null==n.__lexicalLineBreak;An(r,0,s-1,t?null:n),t&&(n.textContent="");}}else !function(t,e,n,r,s,i){const o=r-1,l=s-1;let c,a,u=(h=i,h.firstChild),f=0,d=0;var h;for(;f<=o&&d<=l;){const t=e[f],r=n[d];if(t===r)u=Qn(jn(r,i)),f++,d++;else {void 0===c&&(c=new Set(e)),void 0===a&&(a=new Set(n));const s=a.has(t),o=c.has(r);if(s)if(o){const t=$e(mn,r);t===u?u=Qn(jn(r,i)):(null!=u?i.insertBefore(t,u):i.appendChild(t),jn(r,i)),f++,d++;}else Rn(r,i,u),d++;else u=Qn(Yn(t)),Ln(t,i),f++;}const s=Sn.get(r);null!==s&&null===Pn&&$r(s)&&(Pn=s.getFormat());}const g=f>o,_=d>l;if(g&&!_){const e=n[l+1];Kn(n,t,d,l,i,void 0===e?null:mn.getElementByKey(e));}else _&&!g&&An(e,f,o,i);}(e,r,o,s,i,n);}Ve(e)&&(Nn+=kt);n.__lexicalTextContent=Nn,Nn=r+Nn;}(t,e,n),Vn(e,n),di(s=e)&&null!=Pn&&Pn!==s.__textFormat&&s.setTextFormat(Pn),En=r,Pn=null;}function Hn(t,e){const n=[];let r=t.__first;for(;null!==r;){const t=e.get(r);void 0===t&&j(101),n.push(r),r=t.__next;}return n}function jn(t,e){const n=kn.get(t);let r=Sn.get(t);void 0!==n&&void 0!==r||j(61);const s=Fn||Cn.has(t)||Tn.has(t),i=$e(mn,t);if(n===r&&!s){if(Gs(n)){const t=i.__lexicalTextContent;void 0!==t&&(Nn+=t,Dn+=t);const e=i.__lexicalDirTextContent;void 0!==e&&(En+=e);}else {const t=n.getTextContent();$r(n)&&!n.isDirectionless()&&(En+=t),Dn+=t,Nn+=t;}return i}if(n!==r&&s&&We(wn,xn,vn,r,"updated"),r.updateDOM(n,i,yn)){const n=Rn(t,null,null);return null===e&&j(62),e.replaceChild(n,i),Ln(t,null),n}if(Gs(n)&&Gs(r)){const t=r.__indent;t!==n.__indent&&Wn(i,t);const e=r.__format;e!==n.__format&&Bn(i,e),s&&($n(n,r,i),si(r)||r.isInline()||Un(n,r,i)),Ve(r)&&(Nn+=kt,Dn+=kt);}else {const e=r.getTextContent();if(ni(r)){const e=r.decorate(mn,yn);null!==e&&qn(t,e);}else $r(r)&&!r.isDirectionless()&&(En+=e);Nn+=e,Dn+=e;}if(!On&&si(r)&&r.__cachedText!==Dn){const t=r.getWritable();t.__cachedText=Dn,r=t;}return i}function qn(t,e){let n=mn._pendingDecorators;const r=mn._decorators;if(null===n){if(r[t]===e)return;n=_e(mn);}n[t]=e;}function Qn(t){let e=t.nextSibling;return null!==e&&e===mn._blockCursorElement&&(e=e.nextSibling),e}function Xn(t,e,n,r,s,i){Nn="",Dn="",En="",Fn=r===at,In=null,mn=n,yn=n._config,xn=n._nodes,vn=mn._listeners.mutation,Tn=s,Cn=i,kn=t._nodeMap,Sn=e._nodeMap,On=e._readOnly,bn=new Map(n._keyToDOMMap);const o=new Map;return wn=o,jn("root",null),mn=void 0,xn=void 0,Tn=void 0,Cn=void 0,kn=void 0,Sn=void 0,yn=void 0,bn=void 0,wn=void 0,o}function Yn(t){const e=bn.get(t);return void 0===e&&j(75,t),e}const Zn=Object.freeze({}),Gn=30,tr=[["keydown",function(t,e){if(er=t.timeStamp,nr=t.key,e.isComposing())return;const{key:n,shiftKey:r,ctrlKey:o,metaKey:l,altKey:c}=t;if(Ue(e,_$2,t))return;if(null==n)return;if(function(t,e,n,r){return De(t)&&!e&&!r&&!n}(n,o,c,l))Ue(e,p$3,t);else if(function(t,e,n,r,s){return De(t)&&!r&&!n&&(e||s)}(n,o,r,c,l))Ue(e,y$1,t);else if(function(t,e,n,r){return Pe(t)&&!e&&!r&&!n}(n,o,c,l))Ue(e,m$4,t);else if(function(t,e,n,r,s){return Pe(t)&&!r&&!n&&(e||s)}(n,o,r,c,l))Ue(e,x$3,t);else if(function(t,e,n){return function(t){return "ArrowUp"===t}(t)&&!e&&!n}(n,o,l))Ue(e,v,t);else if(function(t,e,n){return function(t){return "ArrowDown"===t}(t)&&!e&&!n}(n,o,l))Ue(e,T$1,t);else if(function(t,e){return Oe(t)&&e}(n,r))cr=!0,Ue(e,C$1,t);else if(function(t){return " "===t}(n))Ue(e,k$1,t);else if(function(t,e){return X&&e&&"o"===t.toLowerCase()}(n,o))t.preventDefault(),cr=!0,Ue(e,i$3,!0);else if(function(t,e){return Oe(t)&&!e}(n,r))cr=!1,Ue(e,C$1,t);else if(function(t,e,n,r){return X?!e&&!n&&(Ie(t)||"h"===t.toLowerCase()&&r):!(r||e||n)&&Ie(t)}(n,c,l,o))Ie(n)?Ue(e,S$1,t):(t.preventDefault(),Ue(e,s$1,!0));else if(function(t){return "Escape"===t}(n))Ue(e,b$1,t);else if(function(t,e,n,r,s){return X?!(n||r||s)&&(Le(t)||"d"===t.toLowerCase()&&e):!(e||r||s)&&Le(t)}(n,o,r,c,l))Le(n)?Ue(e,w,t):(t.preventDefault(),Ue(e,s$1,!1));else if(function(t,e,n){return Ie(t)&&(X?e:n)}(n,c,o))t.preventDefault(),Ue(e,u$3,!0);else if(function(t,e,n){return Le(t)&&(X?e:n)}(n,c,o))t.preventDefault(),Ue(e,u$3,!1);else if(function(t,e){return X&&e&&Ie(t)}(n,l))t.preventDefault(),Ue(e,f$2,!0);else if(function(t,e){return X&&e&&Le(t)}(n,l))t.preventDefault(),Ue(e,f$2,!1);else if(function(t,e,n,r){return "b"===t.toLowerCase()&&!e&&Fe(n,r)}(n,c,l,o))t.preventDefault(),Ue(e,d$2,"bold");else if(function(t,e,n,r){return "u"===t.toLowerCase()&&!e&&Fe(n,r)}(n,c,l,o))t.preventDefault(),Ue(e,d$2,"underline");else if(function(t,e,n,r){return "i"===t.toLowerCase()&&!e&&Fe(n,r)}(n,c,l,o))t.preventDefault(),Ue(e,d$2,"italic");else if(function(t,e,n,r){return "Tab"===t&&!e&&!n&&!r}(n,c,o,l))Ue(e,N$1,t);else if(function(t,e,n,r){return "z"===t.toLowerCase()&&!e&&Fe(n,r)}(n,r,l,o))t.preventDefault(),Ue(e,h$3,void 0);else if(function(t,e,n,r){return X?"z"===t.toLowerCase()&&n&&e:"y"===t.toLowerCase()&&r||"z"===t.toLowerCase()&&r&&e}(n,r,l,o))t.preventDefault(),Ue(e,g$3,void 0);else {ss(e._editorState._selection)?!function(t,e,n,r){return !e&&"c"===t.toLowerCase()&&(X?n:r)}(n,r,l,o)?!function(t,e,n,r){return !e&&"x"===t.toLowerCase()&&(X?n:r)}(n,r,l,o)?Ae(n,l,o)&&(t.preventDefault(),Ue(e,W,t)):(t.preventDefault(),Ue(e,z,t)):(t.preventDefault(),Ue(e,M$2,t)):!Y&&Ae(n,l,o)&&(t.preventDefault(),Ue(e,W,t));}(function(t,e,n,r){return t||e||n||r})(o,r,c,l)&&Ue(e,$$1,t);}],["pointerdown",function(t,e){const n=t.target,r=t.pointerType;n instanceof Node&&"touch"!==r&&Ys(e,(()=>{ni(ge(n))||(lr=!0);}));}],["compositionstart",function(t,e){Ys(e,(()=>{const n=ms();if(ns(n)&&!e.isComposing()){const r=n.anchor,s=n.anchor.getNode();ue(r.key),(t.timeStamp<er+Gn||"element"===r.type||!n.isCollapsed()||s.getFormat()!==n.format||$r(s)&&s.getStyle()!==n.style)&&Ue(e,l$3,St);}}));}],["compositionend",function(t,e){Y?ar=!0:Ys(e,(()=>{_r(e,t.data);}));}],["input",function(t,e){t.stopPropagation(),Ys(e,(()=>{const n=ms(),r=t.data,s=gr(t);if(null!=r&&ns(n)&&fr(n,s,r,t.timeStamp,!1)){ar&&(_r(e,r),ar=!1);const s=n.anchor.getNode(),i=ln(e._window);if(null===i)return;const o=n.isBackward(),c=o?n.anchor.offset:n.focus.offset,a=o?n.focus.offset:n.anchor.offset;Z&&!n.isCollapsed()&&$r(s)&&null!==i.anchorNode&&s.getTextContent().slice(0,c)+r+s.getTextContent().slice(c+a)===be(i.anchorNode)||Ue(e,l$3,r);const u=r.length;Y&&u>1&&"insertCompositionText"===t.inputType&&!e.isComposing()&&(n.anchor.offset-=u),G||tt||st||!e.isComposing()||(er=0,ue(null));}else {we(!1,e,null!==r?r:void 0),ar&&(_r(e,r||void 0),ar=!1);}Ms(),Vt(Bs());})),sr=null;}],["click",function(t,e){Ys(e,(()=>{const n=ms(),s=ln(e._window),i=xs();if(s)if(ns(n)){const e=n.anchor,r=e.getNode();if("element"===e.type&&0===e.offset&&n.isCollapsed()&&!si(r)&&1===ye().getChildrenSize()&&r.getTopLevelElementOrThrow().isEmpty()&&null!==i&&n.is(i))s.removeAllRanges(),n.dirty=!0;else if(3===t.detail&&!n.isCollapsed()){r!==n.focus.getNode()&&(Gs(r)?r.select(0):r.getParentOrThrow().select(0));}}else if("touch"===t.pointerType){const n=s.anchorNode;if(null!==n){const r=n.nodeType;if(r===it||r===ot){xe(ys(i,s,e,t));}}}Ue(e,r$2,t);}));}],["cut",Zn],["copy",Zn],["dragstart",Zn],["dragover",Zn],["dragend",Zn],["paste",Zn],["focus",Zn],["blur",Zn],["drop",Zn]];Z&&tr.push(["beforeinput",(t,e)=>function(t,e){const n=t.inputType,r=gr(t);if("deleteCompositionText"===n||Y&&Je(e))return;if("insertCompositionText"===n)return;Ys(e,(()=>{const _=ms();if("deleteContentBackward"===n){if(null===_){const t=xs();if(!ns(t))return;xe(t.clone());}if(ns(_)){const n=_.anchor.key===_.focus.key;if(p=t.timeStamp,"MediaLast"===nr&&p<er+Gn&&e.isComposing()&&n){if(ue(null),er=0,setTimeout((()=>{Ys(e,(()=>{ue(null);}));}),Gn),ns(_)){const t=_.anchor.getNode();t.markDirty(),_.format=t.getFormat(),$r(t)||j(142),_.style=t.getStyle();}}else {ue(null),t.preventDefault();const r=_.anchor.getNode().getTextContent(),i=0===_.anchor.offset&&_.focus.offset===r.length;rt&&n&&!i||Ue(e,s$1,!0);}return}}var p;if(!ns(_))return;const y=t.data;null!==sr&&we(!1,e,sr),_.dirty&&null===sr||!_.isCollapsed()||si(_.anchor.getNode())||null===r||_.applyDOMRange(r),sr=null;const m=_.anchor,x=_.focus,v=m.getNode(),T=x.getNode();if("insertText"!==n&&"insertTranspose"!==n)switch(t.preventDefault(),n){case"insertFromYank":case"insertFromDrop":case"insertReplacementText":Ue(e,l$3,t);break;case"insertFromComposition":ue(null),Ue(e,l$3,t);break;case"insertLineBreak":ue(null),Ue(e,i$3,!1);break;case"insertParagraph":ue(null),cr&&!tt?(cr=!1,Ue(e,i$3,!1)):Ue(e,o$2,void 0);break;case"insertFromPaste":case"insertFromPasteAsQuotation":Ue(e,c$2,t);break;case"deleteByComposition":(function(t,e){return t!==e||Gs(t)||Gs(e)||!t.isToken()||!e.isToken()})(v,T)&&Ue(e,a$2,t);break;case"deleteByDrag":case"deleteByCut":Ue(e,a$2,t);break;case"deleteContent":Ue(e,s$1,!1);break;case"deleteWordBackward":Ue(e,u$3,!0);break;case"deleteWordForward":Ue(e,u$3,!1);break;case"deleteHardLineBackward":case"deleteSoftLineBackward":Ue(e,f$2,!0);break;case"deleteContentForward":case"deleteHardLineForward":case"deleteSoftLineForward":Ue(e,f$2,!1);break;case"formatStrikeThrough":Ue(e,d$2,"strikethrough");break;case"formatBold":Ue(e,d$2,"bold");break;case"formatItalic":Ue(e,d$2,"italic");break;case"formatUnderline":Ue(e,d$2,"underline");break;case"historyUndo":Ue(e,h$3,void 0);break;case"historyRedo":Ue(e,g$3,void 0);}else {if("\n"===y)t.preventDefault(),Ue(e,i$3,!1);else if(y===kt)t.preventDefault(),Ue(e,o$2,void 0);else if(null==y&&t.dataTransfer){const e=t.dataTransfer.getData("text/plain");t.preventDefault(),_.insertRawText(e);}else null!=y&&fr(_,r,y,t.timeStamp,!0)?(t.preventDefault(),Ue(e,l$3,y)):sr=y;rr=t.timeStamp;}}));}(t,e)]);let er=0,nr=null,rr=0,sr=null;const ir=new WeakMap;let or=!1,lr=!1,cr=!1,ar=!1,ur=[0,"",0,"root",0];function fr(t,e,n,r,s){const i=t.anchor,o=t.focus,l=i.getNode(),c=Bs(),a=ln(c._window),u=null!==a?a.anchorNode:null,f=i.key,d=c.getElementByKey(f),h=n.length;return f!==o.key||!$r(l)||(!s&&(!Z||rr<r+50)||l.isDirty()&&h<2||Ce(n))&&i.offset!==o.offset&&!l.isComposing()||ne(l)||l.isDirty()&&h>1||(s||!Z)&&null!==d&&!l.isComposing()&&u!==se(d)||null!==a&&null!==e&&(!e.collapsed||e.startContainer!==a.anchorNode||e.startOffset!==a.anchorOffset)||l.getFormat()!==t.format||l.getStyle()!==t.style||Ee(t,l)}function dr(t,e){return null!==t&&null!==t.nodeValue&&t.nodeType===ot&&0!==e&&e!==t.nodeValue.length}function hr(t,n,r){const{anchorNode:s,anchorOffset:i,focusNode:o,focusOffset:l}=t;or&&(or=!1,dr(s,i)&&dr(o,l))||Ys(n,(()=>{if(!r)return void xe(null);if(!te(n,s,o))return;const c=ms();if(ns(c)){const e=c.anchor,r=e.getNode();if(c.isCollapsed()){"Range"===t.type&&t.anchorNode===t.focusNode&&(c.dirty=!0);const s=Xe(n).event,i=s?s.timeStamp:performance.now(),[o,l,a,u,f]=ur,d=ye(),h=!1===n.isComposing()&&""===d.getTextContent();if(i<f+200&&e.offset===a&&e.key===u)c.format=o,c.style=l;else if("text"===e.type)$r(r)||j(141),c.format=r.getFormat(),c.style=r.getStyle();else if("element"===e.type&&!h){const t=e.getNode();t instanceof ai&&0===t.getChildrenSize()?c.format=t.getTextFormat():c.format=0,c.style="";}}else {const t=e.key,n=c.focus.key,r=c.getNodes(),s=r.length,o=c.isBackward(),a=o?l:i,u=o?i:l,f=o?n:t,d=o?t:n;let h=_t,g=!1;for(let t=0;t<s;t++){const e=r[t],n=e.getTextContentSize();if($r(e)&&0!==n&&!(0===t&&e.__key===f&&a===n||t===s-1&&e.__key===d&&0===u)&&(g=!0,h&=e.getFormat(),0===h))break}c.format=g?h:0;}}Ue(n,e,void 0);}));}function gr(t){if(!t.getTargetRanges)return null;const e=t.getTargetRanges();return 0===e.length?null:e[0]}function _r(t,e){const n=t._compositionKey;if(ue(null),null!==n&&null!=e){if(""===e){const e=de(n),r=se(t.getElementByKey(n));return void(null!==r&&null!==r.nodeValue&&$r(e)&&Ne(e,r.nodeValue,null,null,!0))}if("\n"===e[e.length-1]){const e=ms();if(ns(e)){const n=e.focus;return e.anchor.set(n.key,n.offset,n.type),void Ue(t,C$1,null)}}}we(!0,t,e);}function pr(t){let e=t.__lexicalEventHandles;return void 0===e&&(e=[],t.__lexicalEventHandles=e),e}const yr=new Map;function mr(t){const e=t.target,n=ln(null==e?null:9===e.nodeType?e.defaultView:e.ownerDocument.defaultView);if(null===n)return;const r=ee(n.anchorNode);if(null===r)return;lr&&(lr=!1,Ys(r,(()=>{const e=xs(),s=n.anchorNode;if(null===s)return;const i=s.nodeType;if(i!==it&&i!==ot)return;xe(ys(e,n,r,t));})));const s=ke(r),i=s[s.length-1],o=i._key,l=yr.get(o),c=l||i;c!==r&&hr(n,c,!1),hr(n,r,!0),r!==i?yr.set(o,r):l&&yr.delete(o);}function xr(t){t._lexicalHandled=!0;}function vr(t){return !0===t._lexicalHandled}function Tr(t){const e=t.ownerDocument,n=ir.get(e);void 0===n&&j(162);const r=n-1;r>=0||j(164),ir.set(e,r),0===r&&e.removeEventListener("selectionchange",mr);const s=t.__lexicalEditor;null!=s&&(!function(t){if(null!==t._parentEditor){const e=ke(t),n=e[e.length-1]._key;yr.get(n)===t&&yr.delete(n);}else yr.delete(t._key);}(s),t.__lexicalEditor=null);const i=pr(t);for(let t=0;t<i.length;t++)i[t]();t.__lexicalEventHandles=[];}function Cr(t,e,n){Ms();const r=t.__key,s=t.getParent();if(null===s)return;const i=function(t){const e=ms();if(!ns(e)||!Gs(t))return e;const{anchor:n,focus:r}=e,s=n.getNode(),i=r.getNode();return Qe(s,t)&&n.set(t.__key,0,"element"),Qe(i,t)&&r.set(t.__key,0,"element"),e}(t);let o=!1;if(ns(i)&&e){const e=i.anchor,n=i.focus;e.key===r&&(Cs(e,t,s,t.getPreviousSibling(),t.getNextSibling()),o=!0),n.key===r&&(Cs(n,t,s,t.getPreviousSibling(),t.getNextSibling()),o=!0);}else ss(i)&&e&&t.isSelected()&&t.selectPrevious();if(ns(i)&&e&&!o){const e=t.getIndexWithinParent();ce(t),vs(i,s,e,-1);}else ce(t);n||Ge(s)||s.canBeEmpty()||!s.isEmpty()||Cr(s,e),e&&si(s)&&s.isEmpty()&&s.selectEnd();}class kr{static getType(){j(64,this.name);}static clone(t){j(65,this.name);}constructor(t){this.__type=this.constructor.getType(),this.__parent=null,this.__prev=null,this.__next=null,le(this,t);}getType(){return this.__type}isInline(){j(137,this.constructor.name);}isAttached(){let t=this.__key;for(;null!==t;){if("root"===t)return !0;const e=de(t);if(null===e)break;t=e.__parent;}return !1}isSelected(t){const e=t||ms();if(null==e)return !1;const n=e.getNodes().some((t=>t.__key===this.__key));return ($r(this)||!ns(e)||"element"!==e.anchor.type||"element"!==e.focus.type||e.anchor.key!==e.focus.key||e.anchor.offset!==e.focus.offset)&&n}getKey(){return this.__key}getIndexWithinParent(){const t=this.getParent();if(null===t)return -1;let e=t.getFirstChild(),n=0;for(;null!==e;){if(this.is(e))return n;n++,e=e.getNextSibling();}return -1}getParent(){const t=this.getLatest().__parent;return null===t?null:de(t)}getParentOrThrow(){const t=this.getParent();return null===t&&j(66,this.__key),t}getTopLevelElement(){let t=this;for(;null!==t;){const e=t.getParent();if(Ge(e))return Gs(t)||j(138),t;t=e;}return null}getTopLevelElementOrThrow(){const t=this.getTopLevelElement();return null===t&&j(67,this.__key),t}getParents(){const t=[];let e=this.getParent();for(;null!==e;)t.push(e),e=e.getParent();return t}getParentKeys(){const t=[];let e=this.getParent();for(;null!==e;)t.push(e.__key),e=e.getParent();return t}getPreviousSibling(){const t=this.getLatest().__prev;return null===t?null:de(t)}getPreviousSiblings(){const t=[],e=this.getParent();if(null===e)return t;let n=e.getFirstChild();for(;null!==n&&!n.is(this);)t.push(n),n=n.getNextSibling();return t}getNextSibling(){const t=this.getLatest().__next;return null===t?null:de(t)}getNextSiblings(){const t=[];let e=this.getNextSibling();for(;null!==e;)t.push(e),e=e.getNextSibling();return t}getCommonAncestor(t){const e=this.getParents(),n=t.getParents();Gs(this)&&e.unshift(this),Gs(t)&&n.unshift(t);const r=e.length,s=n.length;if(0===r||0===s||e[r-1]!==n[s-1])return null;const i=new Set(n);for(let t=0;t<r;t++){const n=e[t];if(i.has(n))return n}return null}is(t){return null!=t&&this.__key===t.__key}isBefore(t){if(this===t)return !1;if(t.isParentOf(this))return !0;if(this.isParentOf(t))return !1;const e=this.getCommonAncestor(t);let n=0,r=0,s=this;for(;;){const t=s.getParentOrThrow();if(t===e){n=s.getIndexWithinParent();break}s=t;}for(s=t;;){const t=s.getParentOrThrow();if(t===e){r=s.getIndexWithinParent();break}s=t;}return n<r}isParentOf(t){const e=this.__key;if(e===t.__key)return !1;let n=t;for(;null!==n;){if(n.__key===e)return !0;n=n.getParent();}return !1}getNodesBetween(t){const e=this.isBefore(t),n=[],r=new Set;let s=this;for(;null!==s;){const i=s.__key;if(r.has(i)||(r.add(i),n.push(s)),s===t)break;const o=Gs(s)?e?s.getFirstChild():s.getLastChild():null;if(null!==o){s=o;continue}const l=e?s.getNextSibling():s.getPreviousSibling();if(null!==l){s=l;continue}const c=s.getParentOrThrow();if(r.has(c.__key)||n.push(c),c===t)break;let a=null,u=c;do{if(null===u&&j(68),a=e?u.getNextSibling():u.getPreviousSibling(),u=u.getParent(),null===u)break;null!==a||r.has(u.__key)||n.push(u);}while(null===a);s=a;}return e||n.reverse(),n}isDirty(){const t=Bs()._dirtyLeaves;return null!==t&&t.has(this.__key)}getLatest(){const t=de(this.__key);return null===t&&j(113),t}getWritable(){Ms();const t=Ws(),e=Bs(),n=t._nodeMap,r=this.__key,s=this.getLatest(),i=s.__parent,o=e._cloneNotNeeded,l=ms();if(null!==l&&l.setCachedNodes(null),o.has(r))return ae(s),s;const c=s.constructor.clone(s);return c.__parent=i,c.__next=s.__next,c.__prev=s.__prev,Gs(s)&&Gs(c)?(di(s)&&di(c)&&(c.__textFormat=s.__textFormat),c.__first=s.__first,c.__last=s.__last,c.__size=s.__size,c.__indent=s.__indent,c.__format=s.__format,c.__dir=s.__dir):$r(s)&&$r(c)&&(c.__format=s.__format,c.__style=s.__style,c.__mode=s.__mode,c.__detail=s.__detail),o.add(r),c.__key=r,ae(c),n.set(r,c),c}getTextContent(){return ""}getTextContentSize(){return this.getTextContent().length}createDOM(t,e){j(70);}updateDOM(t,e,n){j(71);}exportDOM(t){return {element:this.createDOM(t._config,t)}}exportJSON(){j(72);}static importJSON(t){j(18,this.name);}static transform(){return null}remove(t){Cr(this,!0,t);}replace(t,e){Ms();let n=ms();null!==n&&(n=n.clone()),nn(this,t);const r=this.getLatest(),s=this.__key,i=t.__key,o=t.getWritable(),l=this.getParentOrThrow().getWritable(),c=l.__size;ce(o);const a=r.getPreviousSibling(),u=r.getNextSibling(),f=r.__prev,d=r.__next,h=r.__parent;if(Cr(r,!1,!0),null===a)l.__first=i;else {a.getWritable().__next=i;}if(o.__prev=f,null===u)l.__last=i;else {u.getWritable().__prev=i;}if(o.__next=d,o.__parent=h,l.__size=c,e&&(Gs(this)&&Gs(o)||j(139),this.getChildren().forEach((t=>{o.append(t);}))),ns(n)){xe(n);const t=n.anchor,e=n.focus;t.key===s&&Gr(t,o),e.key===s&&Gr(e,o);}return fe()===s&&ue(i),o}insertAfter(t,e=!0){Ms(),nn(this,t);const n=this.getWritable(),r=t.getWritable(),s=r.getParent(),i=ms();let o=!1,l=!1;if(null!==s){const e=t.getIndexWithinParent();if(ce(r),ns(i)){const t=s.__key,n=i.anchor,r=i.focus;o="element"===n.type&&n.key===t&&n.offset===e+1,l="element"===r.type&&r.key===t&&r.offset===e+1;}}const c=this.getNextSibling(),a=this.getParentOrThrow().getWritable(),u=r.__key,f=n.__next;if(null===c)a.__last=u;else {c.getWritable().__prev=u;}if(a.__size++,n.__next=u,r.__next=f,r.__prev=n.__key,r.__parent=n.__parent,e&&ns(i)){const t=this.getIndexWithinParent();vs(i,a,t+1);const e=a.__key;o&&i.anchor.set(e,t+2,"element"),l&&i.focus.set(e,t+2,"element");}return t}insertBefore(t,e=!0){Ms(),nn(this,t);const n=this.getWritable(),r=t.getWritable(),s=r.__key;ce(r);const i=this.getPreviousSibling(),o=this.getParentOrThrow().getWritable(),l=n.__prev,c=this.getIndexWithinParent();if(null===i)o.__first=s;else {i.getWritable().__next=s;}o.__size++,n.__prev=s,r.__prev=l,r.__next=n.__key,r.__parent=n.__parent;const a=ms();if(e&&ns(a)){vs(a,this.getParentOrThrow(),c);}return t}isParentRequired(){return !1}createParentElementNode(){return fi()}selectStart(){return this.selectPrevious()}selectEnd(){return this.selectNext(0,0)}selectPrevious(t,e){Ms();const n=this.getPreviousSibling(),r=this.getParentOrThrow();if(null===n)return r.select(0,0);if(Gs(n))return n.select();if(!$r(n)){const t=n.getIndexWithinParent()+1;return r.select(t,t)}return n.select(t,e)}selectNext(t,e){Ms();const n=this.getNextSibling(),r=this.getParentOrThrow();if(null===n)return r.select();if(Gs(n))return n.select(0,0);if(!$r(n)){const t=n.getIndexWithinParent();return r.select(t,t)}return n.select(t,e)}markDirty(){this.getWritable();}}class Sr extends kr{static getType(){return "linebreak"}static clone(t){return new Sr(t.__key)}constructor(t){super(t);}getTextContent(){return "\n"}createDOM(){return document.createElement("br")}updateDOM(){return !1}static importDOM(){return {br:t=>function(t){const e=t.parentElement;if(null!==e){const n=e.firstChild;if(n===t||n.nextSibling===t&&Er(n)){const n=e.lastChild;if(n===t||n.previousSibling===t&&Er(n))return !0}}return !1}(t)?null:{conversion:br,priority:0}}}static importJSON(t){return wr()}exportJSON(){return {type:"linebreak",version:1}}}function br(t){return {node:wr()}}function wr(){return en(new Sr)}function Nr(t){return t instanceof Sr}function Er(t){return t.nodeType===ot&&/^( |\t|\r?\n)+$/.test(t.textContent||"")}function Pr(t,e){return 16&e?"code":128&e?"mark":32&e?"sub":64&e?"sup":null}function Dr(t,e){return 1&e?"strong":2&e?"em":"span"}function Fr(t,e,n,r,s){const i=r.classList;let o=ze(s,"base");void 0!==o&&i.add(...o),o=ze(s,"underlineStrikethrough");let l=!1;const c=e&gt&&e&ht;void 0!==o&&(n&gt&&n&ht?(l=!0,c||i.add(...o)):c&&i.remove(...o));for(const t in Pt){const r=Pt[t];if(o=ze(s,t),void 0!==o)if(n&r){if(l&&("underline"===t||"strikethrough"===t)){e&r&&i.remove(...o);continue}e&r&&(!c||"underline"!==t)&&"strikethrough"!==t||i.add(...o);}else e&r&&i.remove(...o);}}function Or(t,e,n){const r=e.firstChild,s=n.isComposing(),i=t+(s?Ct:"");if(null==r)e.textContent=i;else {const t=r.nodeValue;if(t!==i)if(s||Y){const[e,n,s]=function(t,e){const n=t.length,r=e.length;let s=0,i=0;for(;s<n&&s<r&&t[s]===e[s];)s++;for(;i+s<n&&i+s<r&&t[n-i-1]===e[r-i-1];)i++;return [s,n-s-i,e.slice(s,r-i)]}(t,i);0!==n&&r.deleteData(e,n),r.insertData(e,s);}else r.nodeValue=i;}}function Ir(t,e,n,r,s,i){Or(s,t,e);const o=i.theme.text;void 0!==o&&Fr(0,0,r,t,o);}function Lr(t,e){const n=document.createElement(e);return n.appendChild(t),n}class Ar extends kr{static getType(){return "text"}static clone(t){return new Ar(t.__text,t.__key)}constructor(t,e){super(e),this.__text=t,this.__format=0,this.__style="",this.__mode=0,this.__detail=0;}getFormat(){return this.getLatest().__format}getDetail(){return this.getLatest().__detail}getMode(){const t=this.getLatest();return Lt[t.__mode]}getStyle(){return this.getLatest().__style}isToken(){return 1===this.getLatest().__mode}isComposing(){return this.__key===fe()}isSegmented(){return 2===this.getLatest().__mode}isDirectionless(){return !!(1&this.getLatest().__detail)}isUnmergeable(){return !!(2&this.getLatest().__detail)}hasFormat(t){const e=Pt[t];return !!(this.getFormat()&e)}isSimpleText(){return "text"===this.__type&&0===this.__mode}getTextContent(){return this.getLatest().__text}getFormatFlags(t,e){return ie(this.getLatest().__format,t,e)}canHaveFormat(){return !0}createDOM(t,e){const n=this.__format,r=Pr(0,n),s=Dr(0,n),i=null===r?s:r,o=document.createElement(i);let l=o;this.hasFormat("code")&&o.setAttribute("spellcheck","false"),null!==r&&(l=document.createElement(s),o.appendChild(l));Ir(l,this,0,n,this.__text,t);const c=this.__style;return ""!==c&&(o.style.cssText=c),o}updateDOM(t,e,n){const r=this.__text,s=t.__format,i=this.__format,o=Pr(0,s),l=Pr(0,i),c=Dr(0,s),a=Dr(0,i);if((null===o?c:o)!==(null===l?a:l))return !0;if(o===l&&c!==a){const t=e.firstChild;null==t&&j(48);const s=document.createElement(a);return Ir(s,this,0,i,r,n),e.replaceChild(s,t),!1}let u=e;null!==l&&null!==o&&(u=e.firstChild,null==u&&j(49)),Or(r,u,this);const f=n.theme.text;void 0!==f&&s!==i&&Fr(0,s,i,u,f);const d=t.__style,h=this.__style;return d!==h&&(e.style.cssText=h),!1}static importDOM(){return {"#text":()=>({conversion:Rr,priority:0}),b:()=>({conversion:zr,priority:0}),code:()=>({conversion:Ur,priority:0}),em:()=>({conversion:Ur,priority:0}),i:()=>({conversion:Ur,priority:0}),s:()=>({conversion:Ur,priority:0}),span:()=>({conversion:Mr,priority:0}),strong:()=>({conversion:Ur,priority:0}),sub:()=>({conversion:Ur,priority:0}),sup:()=>({conversion:Ur,priority:0}),u:()=>({conversion:Ur,priority:0})}}static importJSON(t){const e=Vr(t.text);return e.setFormat(t.format),e.setDetail(t.detail),e.setMode(t.mode),e.setStyle(t.style),e}exportDOM(t){let{element:e}=super.exportDOM(t);return null!==e&&un(e)||j(132),e.style.whiteSpace="pre-wrap",this.hasFormat("bold")&&(e=Lr(e,"b")),this.hasFormat("italic")&&(e=Lr(e,"i")),this.hasFormat("strikethrough")&&(e=Lr(e,"s")),this.hasFormat("underline")&&(e=Lr(e,"u")),{element:e}}exportJSON(){return {detail:this.getDetail(),format:this.getFormat(),mode:this.getMode(),style:this.getStyle(),text:this.getTextContent(),type:"text",version:1}}selectionTransform(t,e){}setFormat(t){const e=this.getWritable();return e.__format="string"==typeof t?Pt[t]:t,e}setDetail(t){const e=this.getWritable();return e.__detail="string"==typeof t?Dt[t]:t,e}setStyle(t){const e=this.getWritable();return e.__style=t,e}toggleFormat(t){const e=ie(this.getFormat(),t,null);return this.setFormat(e)}toggleDirectionless(){const t=this.getWritable();return t.__detail^=1,t}toggleUnmergeable(){const t=this.getWritable();return t.__detail^=2,t}setMode(t){const e=It[t];if(this.__mode===e)return this;const n=this.getWritable();return n.__mode=e,n}setTextContent(t){if(this.__text===t)return this;const e=this.getWritable();return e.__text=t,e}select(t,e){Ms();let n=t,r=e;const s=ms(),i=this.getTextContent(),o=this.__key;if("string"==typeof i){const t=i.length;void 0===n&&(n=t),void 0===r&&(r=t);}else n=0,r=0;if(!ns(s))return hs(o,n,o,r,"text","text");{const t=fe();t!==s.anchor.key&&t!==s.focus.key||ue(o),s.setTextNodeRange(this,n,this,r);}return s}selectStart(){return this.select(0,0)}selectEnd(){const t=this.getTextContentSize();return this.select(t,t)}spliceText(t,e,n,r){const s=this.getWritable(),i=s.__text,o=n.length;let l=t;l<0&&(l=o+l,l<0&&(l=0));const c=ms();if(r&&ns(c)){const e=t+o;c.setTextNodeRange(s,e,s,e);}const a=i.slice(0,l)+n+i.slice(l+e);return s.__text=a,s}canInsertTextBefore(){return !0}canInsertTextAfter(){return !0}splitText(...t){Ms();const e=this.getLatest(),n=e.getTextContent(),r=e.__key,s=fe(),i=new Set(t),o=[],l=n.length;let c="";for(let t=0;t<l;t++)""!==c&&i.has(t)&&(o.push(c),c=""),c+=n[t];""!==c&&o.push(c);const a=o.length;if(0===a)return [];if(o[0]===n)return [e];const u=o[0],f=e.getParentOrThrow();let d;const h=e.getFormat(),g=e.getStyle(),_=e.__detail;let p=!1;e.isSegmented()?(d=Vr(u),d.__format=h,d.__style=g,d.__detail=_,p=!0):(d=e.getWritable(),d.__text=u);const y=ms(),m=[d];let x=u.length;for(let t=1;t<a;t++){const e=o[t],n=e.length,i=Vr(e).getWritable();i.__format=h,i.__style=g,i.__detail=_;const l=i.__key,c=x+n;if(ns(y)){const t=y.anchor,e=y.focus;t.key===r&&"text"===t.type&&t.offset>x&&t.offset<=c&&(t.key=l,t.offset-=x,y.dirty=!0),e.key===r&&"text"===e.type&&e.offset>x&&e.offset<=c&&(e.key=l,e.offset-=x,y.dirty=!0);}s===r&&ue(l),x=c,m.push(i);}!function(t){const e=t.getPreviousSibling(),n=t.getNextSibling();null!==e&&ae(e),null!==n&&ae(n);}(this);const v=f.getWritable(),T=this.getIndexWithinParent();return p?(v.splice(T,0,m),this.remove()):v.splice(T,1,m),ns(y)&&vs(y,f,T,a-1),m}mergeWithSibling(t){const e=t===this.getPreviousSibling();e||t===this.getNextSibling()||j(50);const n=this.__key,r=t.__key,s=this.__text,i=s.length;fe()===r&&ue(n);const o=ms();if(ns(o)){const s=o.anchor,l=o.focus;null!==s&&s.key===r&&(ks(s,e,n,t,i),o.dirty=!0),null!==l&&l.key===r&&(ks(l,e,n,t,i),o.dirty=!0);}const l=t.__text,c=e?l+s:s+l;this.setTextContent(c);const a=this.getWritable();return t.remove(),a}isTextEntity(){return !1}}function Mr(t){return {forChild:Hr(t.style),node:null}}function zr(t){const e=t,n="normal"===e.style.fontWeight;return {forChild:Hr(e.style,n?void 0:"bold"),node:null}}const Wr=new WeakMap;function Br(t){return "PRE"===t.nodeName||t.nodeType===it&&void 0!==t.style&&void 0!==t.style.whiteSpace&&t.style.whiteSpace.startsWith("pre")}function Rr(t){const e=t;null===t.parentElement&&j(129);let n=e.textContent||"";if(null!==function(t){let e,n=t.parentNode;const r=[t];for(;null!==n&&void 0===(e=Wr.get(n))&&!Br(n);)r.push(n),n=n.parentNode;const s=void 0===e?n:e;for(let t=0;t<r.length;t++)Wr.set(r[t],s);return s}(e)){const t=n.split(/(\r?\n|\t)/),e=[],r=t.length;for(let n=0;n<r;n++){const r=t[n];"\n"===r||"\r\n"===r?e.push(wr()):"\t"===r?e.push(qr()):""!==r&&e.push(Vr(r));}return {node:e}}if(n=n.replace(/\r/g,"").replace(/[ \t\n]+/g," "),""===n)return {node:null};if(" "===n[0]){let t=e,r=!0;for(;null!==t&&null!==(t=Kr(t,!1));){const e=t.textContent||"";if(e.length>0){/[ \t\n]$/.test(e)&&(n=n.slice(1)),r=!1;break}}r&&(n=n.slice(1));}if(" "===n[n.length-1]){let t=e,r=!0;for(;null!==t&&null!==(t=Kr(t,!0));){if((t.textContent||"").replace(/^( |\t|\r?\n)+/,"").length>0){r=!1;break}}r&&(n=n.slice(0,n.length-1));}return ""===n?{node:null}:{node:Vr(n)}}function Kr(t,e){let n=t;for(;;){let t;for(;null===(t=e?n.nextSibling:n.previousSibling);){const t=n.parentElement;if(null===t)return null;n=t;}if(n=t,n.nodeType===it){const t=n.style.display;if(""===t&&!fn(n)||""!==t&&!t.startsWith("inline"))return null}let r=n;for(;null!==(r=e?n.firstChild:n.lastChild);)n=r;if(n.nodeType===ot)return n;if("BR"===n.nodeName)return null}}const Jr={code:"code",em:"italic",i:"italic",s:"strikethrough",strong:"bold",sub:"subscript",sup:"superscript",u:"underline"};function Ur(t){const e=Jr[t.nodeName.toLowerCase()];return void 0===e?{node:null}:{forChild:Hr(t.style,e),node:null}}function Vr(t=""){return en(new Ar(t))}function $r(t){return t instanceof Ar}function Hr(t,e){const n=t.fontWeight,r=t.textDecoration.split(" "),s="700"===n||"bold"===n,i=r.includes("line-through"),o="italic"===t.fontStyle,l=r.includes("underline"),c=t.verticalAlign;return t=>$r(t)?(s&&!t.hasFormat("bold")&&t.toggleFormat("bold"),i&&!t.hasFormat("strikethrough")&&t.toggleFormat("strikethrough"),o&&!t.hasFormat("italic")&&t.toggleFormat("italic"),l&&!t.hasFormat("underline")&&t.toggleFormat("underline"),"sub"!==c||t.hasFormat("subscript")||t.toggleFormat("subscript"),"super"!==c||t.hasFormat("superscript")||t.toggleFormat("superscript"),e&&!t.hasFormat(e)&&t.toggleFormat(e),t):t}class jr extends Ar{static getType(){return "tab"}static clone(t){const e=new jr(t.__key);return e.__text=t.__text,e.__format=t.__format,e.__style=t.__style,e}constructor(t){super("\t",t),this.__detail=2;}static importDOM(){return null}static importJSON(t){const e=qr();return e.setFormat(t.format),e.setStyle(t.style),e}exportJSON(){return {...super.exportJSON(),type:"tab",version:1}}setTextContent(t){j(126);}setDetail(t){j(127);}setMode(t){j(128);}canInsertTextBefore(){return !1}canInsertTextAfter(){return !1}}function qr(){return en(new jr)}function Qr(t){return t instanceof jr}class Xr{constructor(t,e,n){this._selection=null,this.key=t,this.offset=e,this.type=n;}is(t){return this.key===t.key&&this.offset===t.offset&&this.type===t.type}isBefore(t){let e=this.getNode(),n=t.getNode();const r=this.offset,s=t.offset;if(Gs(e)){const t=e.getDescendantByIndex(r);e=null!=t?t:e;}if(Gs(n)){const t=n.getDescendantByIndex(s);n=null!=t?t:n;}return e===n?r<s:e.isBefore(n)}getNode(){const t=de(this.key);return null===t&&j(20),t}set(t,e,n){const r=this._selection,s=this.key;this.key=t,this.offset=e,this.type=n,As()||(fe()===s&&ue(t),null!==r&&(r.setCachedNodes(null),r.dirty=!0));}}function Yr(t,e,n){return new Xr(t,e,n)}function Zr(t,e){let n=e.__key,r=t.offset,s="element";if($r(e)){s="text";const t=e.getTextContentSize();r>t&&(r=t);}else if(!Gs(e)){const t=e.getNextSibling();if($r(t))n=t.__key,r=0,s="text";else {const t=e.getParent();t&&(n=t.__key,r=e.getIndexWithinParent()+1);}}t.set(n,r,s);}function Gr(t,e){if(Gs(e)){const n=e.getLastDescendant();Gs(n)||$r(n)?Zr(t,n):Zr(t,e);}else Zr(t,e);}function ts(t,e,n,r){t.key=e,t.offset=n,t.type=r;}class es{constructor(t){this._cachedNodes=null,this._nodes=t,this.dirty=!1;}getCachedNodes(){return this._cachedNodes}setCachedNodes(t){this._cachedNodes=t;}is(t){if(!ss(t))return !1;const e=this._nodes,n=t._nodes;return e.size===n.size&&Array.from(e).every((t=>n.has(t)))}isCollapsed(){return !1}isBackward(){return !1}getStartEndPoints(){return null}add(t){this.dirty=!0,this._nodes.add(t),this._cachedNodes=null;}delete(t){this.dirty=!0,this._nodes.delete(t),this._cachedNodes=null;}clear(){this.dirty=!0,this._nodes.clear(),this._cachedNodes=null;}has(t){return this._nodes.has(t)}clone(){return new es(new Set(this._nodes))}extract(){return this.getNodes()}insertRawText(t){}insertText(){}insertNodes(t){const e=this.getNodes(),n=e.length,r=e[n-1];let s;if($r(r))s=r.select();else {const t=r.getIndexWithinParent()+1;s=r.getParentOrThrow().select(t,t);}s.insertNodes(t);for(let t=0;t<n;t++)e[t].remove();}getNodes(){const t=this._cachedNodes;if(null!==t)return t;const e=this._nodes,n=[];for(const t of e){const e=de(t);null!==e&&n.push(e);}return As()||(this._cachedNodes=n),n}getTextContent(){const t=this.getNodes();let e="";for(let n=0;n<t.length;n++)e+=t[n].getTextContent();return e}}function ns(t){return t instanceof rs}class rs{constructor(t,e,n,r){this.anchor=t,this.focus=e,t._selection=this,e._selection=this,this._cachedNodes=null,this.format=n,this.style=r,this.dirty=!1;}getCachedNodes(){return this._cachedNodes}setCachedNodes(t){this._cachedNodes=t;}is(t){return !!ns(t)&&(this.anchor.is(t.anchor)&&this.focus.is(t.focus)&&this.format===t.format&&this.style===t.style)}isCollapsed(){return this.anchor.is(this.focus)}getNodes(){const t=this._cachedNodes;if(null!==t)return t;const e=this.anchor,n=this.focus,r=e.isBefore(n),s=r?e:n,i=r?n:e;let o=s.getNode(),l=i.getNode();const c=s.offset,a=i.offset;if(Gs(o)){const t=o.getDescendantByIndex(c);o=null!=t?t:o;}if(Gs(l)){let t=l.getDescendantByIndex(a);null!==t&&t!==o&&l.getChildAtIndex(a)===t&&(t=t.getPreviousSibling()),l=null!=t?t:l;}let u;return u=o.is(l)?Gs(o)&&o.getChildrenSize()>0?[]:[o]:o.getNodesBetween(l),As()||(this._cachedNodes=u),u}setTextNodeRange(t,e,n,r){ts(this.anchor,t.__key,e,"text"),ts(this.focus,n.__key,r,"text"),this._cachedNodes=null,this.dirty=!0;}getTextContent(){const t=this.getNodes();if(0===t.length)return "";const e=t[0],n=t[t.length-1],r=this.anchor,s=this.focus,i=r.isBefore(s),[o,l]=os(this);let c="",a=!0;for(let u=0;u<t.length;u++){const f=t[u];if(Gs(f)&&!f.isInline())a||(c+="\n"),a=!f.isEmpty();else if(a=!1,$r(f)){let t=f.getTextContent();f===e?f===n?"element"===r.type&&"element"===s.type&&s.offset!==r.offset||(t=o<l?t.slice(o,l):t.slice(l,o)):t=i?t.slice(o):t.slice(l):f===n&&(t=i?t.slice(0,l):t.slice(0,o)),c+=t;}else !ni(f)&&!Nr(f)||f===n&&this.isCollapsed()||(c+=f.getTextContent());}return c}applyDOMRange(t){const e=Bs(),n=e.getEditorState()._selection,r=fs(t.startContainer,t.startOffset,t.endContainer,t.endOffset,e,n);if(null===r)return;const[s,i]=r;ts(this.anchor,s.key,s.offset,s.type),ts(this.focus,i.key,i.offset,i.type),this._cachedNodes=null;}clone(){const t=this.anchor,e=this.focus;return new rs(Yr(t.key,t.offset,t.type),Yr(e.key,e.offset,e.type),this.format,this.style)}toggleFormat(t){this.format=ie(this.format,t,null),this.dirty=!0;}setStyle(t){this.style=t,this.dirty=!0;}hasFormat(t){const e=Pt[t];return !!(this.format&e)}insertRawText(t){const e=t.split(/(\r?\n|\t)/),n=[],r=e.length;for(let t=0;t<r;t++){const r=e[t];"\n"===r||"\r\n"===r?n.push(wr()):"\t"===r?n.push(qr()):n.push(Vr(r));}this.insertNodes(n);}insertText(t){const e=this.anchor,n=this.focus,r=this.format,s=this.style;let i=e,o=n;!this.isCollapsed()&&n.isBefore(e)&&(i=n,o=e),"element"===i.type&&function(t,e,n,r){const s=t.getNode(),i=s.getChildAtIndex(t.offset),o=Vr(),l=si(s)?fi().append(o):o;o.setFormat(n),o.setStyle(r),null===i?s.append(l):i.insertBefore(l),t.is(e)&&e.set(o.__key,0,"text"),t.set(o.__key,0,"text");}(i,o,r,s);const l=i.offset;let c=o.offset;const a=this.getNodes(),u=a.length;let f=a[0];$r(f)||j(26);const d=f.getTextContent().length,h=f.getParentOrThrow();let g=a[u-1];if(1===u&&"element"===o.type&&(c=d,o.set(i.key,c,"text")),this.isCollapsed()&&l===d&&(f.isSegmented()||f.isToken()||!f.canInsertTextAfter()||!h.canInsertTextAfter()&&null===f.getNextSibling())){let e=f.getNextSibling();if($r(e)&&e.canInsertTextBefore()&&!ne(e)||(e=Vr(),e.setFormat(r),h.canInsertTextAfter()?f.insertAfter(e):h.insertAfter(e)),e.select(0,0),f=e,""!==t)return void this.insertText(t)}else if(this.isCollapsed()&&0===l&&(f.isSegmented()||f.isToken()||!f.canInsertTextBefore()||!h.canInsertTextBefore()&&null===f.getPreviousSibling())){let e=f.getPreviousSibling();if($r(e)&&!ne(e)||(e=Vr(),e.setFormat(r),h.canInsertTextBefore()?f.insertBefore(e):h.insertBefore(e)),e.select(),f=e,""!==t)return void this.insertText(t)}else if(f.isSegmented()&&l!==d){const t=Vr(f.getTextContent());t.setFormat(r),f.replace(t),f=t;}else if(!this.isCollapsed()&&""!==t){const e=g.getParent();if(!h.canInsertTextBefore()||!h.canInsertTextAfter()||Gs(e)&&(!e.canInsertTextBefore()||!e.canInsertTextAfter()))return this.insertText(""),us(this.anchor,this.focus,null),void this.insertText(t)}if(1===u){if(f.isToken()){const e=Vr(t);return e.select(),void f.replace(e)}const e=f.getFormat(),n=f.getStyle();if(l!==c||e===r&&n===s){if(Qr(f)){const e=Vr(t);return e.setFormat(r),e.setStyle(s),e.select(),void f.replace(e)}}else {if(""!==f.getTextContent()){const e=Vr(t);if(e.setFormat(r),e.setStyle(s),e.select(),0===l)f.insertBefore(e,!1);else {const[t]=f.splitText(l);t.insertAfter(e,!1);}return void(e.isComposing()&&"text"===this.anchor.type&&(this.anchor.offset-=t.length))}f.setFormat(r),f.setStyle(s);}const i=c-l;f=f.spliceText(l,i,t,!0),""===f.getTextContent()?f.remove():"text"===this.anchor.type&&(f.isComposing()?this.anchor.offset-=t.length:(this.format=e,this.style=n));}else {const e=new Set([...f.getParentKeys(),...g.getParentKeys()]),n=Gs(f)?f:f.getParentOrThrow();let r=Gs(g)?g:g.getParentOrThrow(),s=g;if(!n.is(r)&&r.isInline())do{s=r,r=r.getParentOrThrow();}while(r.isInline());if("text"===o.type&&(0!==c||""===g.getTextContent())||"element"===o.type&&g.getIndexWithinParent()<c)if($r(g)&&!g.isToken()&&c!==g.getTextContentSize()){if(g.isSegmented()){const t=Vr(g.getTextContent());g.replace(t),g=t;}si(o.getNode())||"text"!==o.type||(g=g.spliceText(0,c,"")),e.add(g.__key);}else {const t=g.getParentOrThrow();t.canBeEmpty()||1!==t.getChildrenSize()?g.remove():t.remove();}else e.add(g.__key);const i=r.getChildren(),h=new Set(a),_=n.is(r),p=n.isInline()&&null===f.getNextSibling()?n:f;for(let t=i.length-1;t>=0;t--){const e=i[t];if(e.is(f)||Gs(e)&&e.isParentOf(f))break;e.isAttached()&&(!h.has(e)||e.is(s)?_||p.insertAfter(e,!1):e.remove());}if(!_){let t=r,n=null;for(;null!==t;){const r=t.getChildren(),s=r.length;(0===s||r[s-1].is(n))&&(e.delete(t.__key),n=t),t=t.getParent();}}if(f.isToken())if(l===d)f.select();else {const e=Vr(t);e.select(),f.replace(e);}else f=f.spliceText(l,d-l,t,!0),""===f.getTextContent()?f.remove():f.isComposing()&&"text"===this.anchor.type&&(this.anchor.offset-=t.length);for(let t=1;t<u;t++){const n=a[t],r=n.__key;e.has(r)||n.remove();}}}removeText(){this.insertText("");}formatText(t){if(this.isCollapsed())return this.toggleFormat(t),void ue(null);const e=this.getNodes(),n=[];for(const t of e)$r(t)&&n.push(t);const r=n.length;if(0===r)return this.toggleFormat(t),void ue(null);const s=this.anchor,i=this.focus,o=this.isBackward(),l=o?i:s,c=o?s:i;let a=0,u=n[0],f="element"===l.type?0:l.offset;if("text"===l.type&&f===u.getTextContentSize()&&(a=1,u=n[1],f=0),null==u)return;const d=u.getFormatFlags(t,null),h=r-1;let g=n[h];const _="text"===c.type?c.offset:g.getTextContentSize();if(u.is(g)){if(f===_)return;if(ne(u)||0===f&&_===u.getTextContentSize())u.setFormat(d);else {const t=u.splitText(f,_),e=0===f?t[0]:t[1];e.setFormat(d),"text"===l.type&&l.set(e.__key,0,"text"),"text"===c.type&&c.set(e.__key,_-f,"text");}return void(this.format=d)}0===f||ne(u)||([,u]=u.splitText(f),f=0),u.setFormat(d);const p=g.getFormatFlags(t,d);_>0&&(_===g.getTextContentSize()||ne(g)||([g]=g.splitText(_)),g.setFormat(p));for(let e=a+1;e<h;e++){const r=n[e],s=r.getFormatFlags(t,p);r.setFormat(s);}"text"===l.type&&l.set(u.__key,f,"text"),"text"===c.type&&c.set(g.__key,_,"text"),this.format=d|p;}insertNodes(t){if(0===t.length)return;if("root"===this.anchor.key){this.insertParagraph();const e=ms();return ns(e)||j(134),e.insertNodes(t)}const e=gn((this.isBackward()?this.focus:this.anchor).getNode(),hn),n=t[t.length-1];if("__language"in e&&Gs(e)){if("__language"in t[0])this.insertText(t[0].getTextContent());else {const r=Ns(this);e.splice(r,0,t),n.selectEnd();}return}if(!t.some((t=>(Gs(t)||ni(t))&&!t.isInline()))){Gs(e)||j(135);const r=Ns(this);return e.splice(r,0,t),void n.selectEnd()}const r=function(t){const e=fi();let n=null;for(let r=0;r<t.length;r++){const s=t[r],i=Nr(s);if(i||ni(s)&&s.isInline()||Gs(s)&&s.isInline()||$r(s)||s.isParentRequired()){if(null===n&&(n=s.createParentElementNode(),e.append(n),i))continue;null!==n&&n.append(s);}else e.append(s),n=null;}return e}(t),s=r.getLastDescendant(),i=r.getChildren(),o=t=>"__value"in t&&"__checked"in t,l=!Gs(e)||!e.isEmpty()?this.insertParagraph():null,c=i[i.length-1];let a=i[0];var u;Gs(u=a)&&hn(u)&&!u.isEmpty()&&Gs(e)&&(!e.isEmpty()||o(e))&&(Gs(e)||j(135),e.append(...a.getChildren()),a=i[1]),a&&function(t,e,n){const r=e.getParentOrThrow().getLastChild();let s=e;const i=[e];for(;s!==r;)s.getNextSibling()||j(140),s=s.getNextSibling(),i.push(s);let o=t;for(const t of i)o=o.insertAfter(t);}(e,a);const f=gn(s,hn);l&&Gs(f)&&(o(l)||hn(c))&&(f.append(...l.getChildren()),l.remove()),Gs(e)&&e.isEmpty()&&e.remove(),s.selectEnd();const d=Gs(e)?e.getLastChild():null;Nr(d)&&f!==e&&d.remove();}insertParagraph(){if("root"===this.anchor.key){const t=fi();return ye().splice(this.anchor.offset,0,[t]),t.select(),t}const t=Ns(this),e=gn(this.anchor.getNode(),hn);Gs(e)||j(136);const n=e.getChildAtIndex(t),r=n?[n,...n.getNextSiblings()]:[],s=e.insertNewAfter(this,!1);return s?(s.append(...r),s.selectStart(),s):null}insertLineBreak(t){const e=wr();if(this.insertNodes([e]),t){const t=e.getParentOrThrow(),n=e.getIndexWithinParent();t.select(n,n);}}extract(){const t=this.getNodes(),e=t.length,n=e-1,r=this.anchor,s=this.focus;let i=t[0],o=t[n];const[l,c]=os(this);if(0===e)return [];if(1===e){if($r(i)&&!this.isCollapsed()){const t=l>c?c:l,e=l>c?l:c,n=i.splitText(t,e),r=0===t?n[0]:n[1];return null!=r?[r]:[]}return [i]}const a=r.isBefore(s);if($r(i)){const e=a?l:c;e===i.getTextContentSize()?t.shift():0!==e&&([,i]=i.splitText(e),t[0]=i);}if($r(o)){const e=o.getTextContent().length,r=a?c:l;0===r?t.pop():r!==e&&([o]=o.splitText(r),t[n]=o);}return t}modify(t,e,n){const r=this.focus,s=this.anchor,i="move"===t,o=Ke(r,e);if(ni(o)&&!o.isIsolated()){if(i&&o.isKeyboardSelectable()){const t=_s();return t.add(o.__key),void xe(t)}const t=e?o.getPreviousSibling():o.getNextSibling();if($r(t)){const n=t.__key,o=e?t.getTextContent().length:0;return r.set(n,o,"text"),void(i&&s.set(n,o,"text"))}{const n=o.getParentOrThrow();let l,c;return Gs(t)?(c=t.__key,l=e?t.getChildrenSize():0):(l=o.getIndexWithinParent(),c=n.__key,e||l++),r.set(c,l,"element"),void(i&&s.set(c,l,"element"))}}const l=Bs(),c=ln(l._window);if(!c)return;const a=l._blockCursorElement,u=l._rootElement;if(null===u||null===a||!Gs(o)||o.isInline()||o.canBeEmpty()||sn(a,l,u),function(t,e,n,r){t.modify(e,n,r);}(c,t,e?"backward":"forward",n),c.rangeCount>0){const t=c.getRangeAt(0),n=this.anchor.getNode(),r=si(n)?n:Ze(n);if(this.applyDOMRange(t),this.dirty=!0,!i){const n=this.getNodes(),s=[];let i=!1;for(let t=0;t<n.length;t++){const e=n[t];Qe(e,r)?s.push(e):i=!0;}if(i&&s.length>0)if(e){const t=s[0];Gs(t)?t.selectStart():t.getParentOrThrow().selectStart();}else {const t=s[s.length-1];Gs(t)?t.selectEnd():t.getParentOrThrow().selectEnd();}c.anchorNode===t.startContainer&&c.anchorOffset===t.startOffset||function(t){const e=t.focus,n=t.anchor,r=n.key,s=n.offset,i=n.type;ts(n,e.key,e.offset,e.type),ts(e,r,s,i),t._cachedNodes=null;}(this);}}}forwardDeletion(t,e,n){if(!n&&("element"===t.type&&Gs(e)&&t.offset===e.getChildrenSize()||"text"===t.type&&t.offset===e.getTextContentSize())){const t=e.getParent(),n=e.getNextSibling()||(null===t?null:t.getNextSibling());if(Gs(n)&&n.isShadowRoot())return !0}return !1}deleteCharacter(t){const n=this.isCollapsed();if(this.isCollapsed()){const n=this.anchor;let r=n.getNode();if(this.forwardDeletion(n,r,t))return;const s=this.focus,i=Ke(s,t);if(ni(i)&&!i.isIsolated()){if(i.isKeyboardSelectable()&&Gs(r)&&0===r.getChildrenSize()){r.remove();const t=_s();t.add(i.__key),xe(t);}else {i.remove();Bs().dispatchCommand(e,void 0);}return}if(!t&&Gs(i)&&Gs(r)&&r.isEmpty())return r.remove(),void i.selectStart();if(this.modify("extend",t,"character"),this.isCollapsed()){if(t&&0===n.offset){if(("element"===n.type?n.getNode():n.getNode().getParentOrThrow()).collapseAtStart(this))return}}else {const e="text"===s.type?s.getNode():null;if(r="text"===n.type?n.getNode():null,null!==e&&e.isSegmented()){const n=s.offset,i=e.getTextContentSize();if(e.is(r)||t&&n!==i||!t&&0!==n)return void ls(e,t,n)}else if(null!==r&&r.isSegmented()){const s=n.offset,i=r.getTextContentSize();if(r.is(e)||t&&0!==s||!t&&s!==i)return void ls(r,t,s)}!function(t,e){const n=t.anchor,r=t.focus,s=n.getNode(),i=r.getNode();if(s===i&&"text"===n.type&&"text"===r.type){const t=n.offset,i=r.offset,o=t<i,l=o?t:i,c=o?i:t,a=c-1;if(l!==a){Ce(s.getTextContent().slice(l,c))||(e?r.offset=a:n.offset=a);}}}(this,t);}}if(this.removeText(),t&&!n&&this.isCollapsed()&&"element"===this.anchor.type&&0===this.anchor.offset){const t=this.anchor.getNode();t.isEmpty()&&si(t.getParent())&&0===t.getIndexWithinParent()&&t.collapseAtStart(this);}}deleteLine(t){if(this.isCollapsed()){const e="element"===this.anchor.type;e&&this.insertText(" "),this.modify("extend",t,"lineboundary");if(0===(t?this.focus:this.anchor).offset&&this.modify("extend",t,"character"),e){const e=t?this.anchor:this.focus;e.set(e.key,e.offset+1,e.type);}}this.removeText();}deleteWord(t){if(this.isCollapsed()){const e=this.anchor,n=e.getNode();if(this.forwardDeletion(e,n,t))return;this.modify("extend",t,"word");}this.removeText();}isBackward(){return this.focus.isBefore(this.anchor)}getStartEndPoints(){return [this.anchor,this.focus]}}function ss(t){return t instanceof es}function is(t){const e=t.offset;if("text"===t.type)return e;const n=t.getNode();return e===n.getChildrenSize()?n.getTextContent().length:0}function os(t){const e=t.getStartEndPoints();if(null===e)return [0,0];const[n,r]=e;return "element"===n.type&&"element"===r.type&&n.key===r.key&&n.offset===r.offset?[0,0]:[is(n),is(r)]}function ls(t,e,n){const r=t,s=r.getTextContent().split(/(?=\s)/g),i=s.length;let o=0,l=0;for(let t=0;t<i;t++){const r=t===i-1;if(l=o,o+=s[t].length,e&&o===n||o>n||r){s.splice(t,1),r&&(l=void 0);break}}const c=s.join("").trim();""===c?r.remove():(r.setTextContent(c),r.select(l,l));}function cs(t,e,n,r){let s,i=e;if(t.nodeType===it){let o=!1;const l=t.childNodes,c=l.length,a=r._blockCursorElement;i===c&&(o=!0,i=c-1);let u=l[i],f=!1;if(u===a)u=l[i+1],f=!0;else if(null!==a){const n=a.parentNode;if(t===n){e>Array.prototype.indexOf.call(n.children,a)&&i--;}}if(s=ve(u),$r(s))i=Te(s,o);else {let r=ve(t);if(null===r)return null;if(Gs(r)){i=Math.min(r.getChildrenSize(),i);let t=r.getChildAtIndex(i);if(Gs(t)&&function(t,e,n){const r=t.getParent();return null===n||null===r||!r.canBeEmpty()||r!==n.getNode()}(t,0,n)){const e=o?t.getLastDescendant():t.getFirstDescendant();null===e?r=t:(t=e,r=Gs(t)?t:t.getParentOrThrow()),i=0;}$r(t)?(s=t,r=null,i=Te(t,o)):t!==r&&o&&!f&&i++;}else {const n=r.getIndexWithinParent();i=0===e&&ni(r)&&ve(t)===r?n:n+1,r=r.getParentOrThrow();}if(Gs(r))return Yr(r.__key,i,"element")}}else s=ve(t);return $r(s)?Yr(s.__key,i,"text"):null}function as(t,e,n){const r=t.offset,s=t.getNode();if(0===r){const r=s.getPreviousSibling(),i=s.getParent();if(e){if((n||!e)&&null===r&&Gs(i)&&i.isInline()){const e=i.getPreviousSibling();$r(e)&&(t.key=e.__key,t.offset=e.getTextContent().length);}}else Gs(r)&&!n&&r.isInline()?(t.key=r.__key,t.offset=r.getChildrenSize(),t.type="element"):$r(r)&&(t.key=r.__key,t.offset=r.getTextContent().length);}else if(r===s.getTextContent().length){const r=s.getNextSibling(),i=s.getParent();if(e&&Gs(r)&&r.isInline())t.key=r.__key,t.offset=0,t.type="element";else if((n||e)&&null===r&&Gs(i)&&i.isInline()&&!i.canInsertTextAfter()){const e=i.getNextSibling();$r(e)&&(t.key=e.__key,t.offset=0);}}}function us(t,e,n){if("text"===t.type&&"text"===e.type){const r=t.isBefore(e),s=t.is(e);as(t,r,s),as(e,!r,s),s&&(e.key=t.key,e.offset=t.offset,e.type=t.type);const i=Bs();if(i.isComposing()&&i._compositionKey!==t.key&&ns(n)){const r=n.anchor,s=n.focus;ts(t,r.key,r.offset,r.type),ts(e,s.key,s.offset,s.type);}}}function fs(t,e,n,r,s,i){if(null===t||null===n||!te(s,t,n))return null;const o=cs(t,e,ns(i)?i.anchor:null,s);if(null===o)return null;const l=cs(n,r,ns(i)?i.focus:null,s);if(null===l)return null;if("element"===o.type&&"element"===l.type){const e=ve(t),r=ve(n);if(ni(e)&&ni(r))return null}return us(o,l,i),[o,l]}function hs(t,e,n,r,s,i){const o=Ws(),l=new rs(Yr(t,e,s),Yr(n,r,i),0,"");return l.dirty=!0,o._selection=l,l}function _s(){return new es(new Set)}function ys(t,e,n,r){const s=n._window;if(null===s)return null;const i=r||s.event,o=i?i.type:void 0,l="selectionchange"===o,c=!zt&&(l||"beforeinput"===o||"compositionstart"===o||"compositionend"===o||"click"===o&&i&&3===i.detail||"drop"===o||void 0===o);let a,u,f,d;if(ns(t)&&!c)return t.clone();if(null===e)return null;if(a=e.anchorNode,u=e.focusNode,f=e.anchorOffset,d=e.focusOffset,l&&ns(t)&&!te(n,a,u))return t.clone();const h=fs(a,f,u,d,n,t);if(null===h)return null;const[g,_]=h;return new rs(g,_,ns(t)?t.format:0,ns(t)?t.style:"")}function ms(){return Ws()._selection}function xs(){return Bs()._editorState._selection}function vs(t,e,n,r=1){const s=t.anchor,i=t.focus,o=s.getNode(),l=i.getNode();if(!e.is(o)&&!e.is(l))return;const c=e.__key;if(t.isCollapsed()){const e=s.offset;if(n<=e&&r>0||n<e&&r<0){const n=Math.max(0,e+r);s.set(c,n,"element"),i.set(c,n,"element"),Ts(t);}}else {const o=t.isBackward(),l=o?i:s,a=l.getNode(),u=o?s:i,f=u.getNode();if(e.is(a)){const t=l.offset;(n<=t&&r>0||n<t&&r<0)&&l.set(c,Math.max(0,t+r),"element");}if(e.is(f)){const t=u.offset;(n<=t&&r>0||n<t&&r<0)&&u.set(c,Math.max(0,t+r),"element");}}Ts(t);}function Ts(t){const e=t.anchor,n=e.offset,r=t.focus,s=r.offset,i=e.getNode(),o=r.getNode();if(t.isCollapsed()){if(!Gs(i))return;const t=i.getChildrenSize(),s=n>=t,o=s?i.getChildAtIndex(t-1):i.getChildAtIndex(n);if($r(o)){let t=0;s&&(t=o.getTextContentSize()),e.set(o.__key,t,"text"),r.set(o.__key,t,"text");}}else {if(Gs(i)){const t=i.getChildrenSize(),r=n>=t,s=r?i.getChildAtIndex(t-1):i.getChildAtIndex(n);if($r(s)){let t=0;r&&(t=s.getTextContentSize()),e.set(s.__key,t,"text");}}if(Gs(o)){const t=o.getChildrenSize(),e=s>=t,n=e?o.getChildAtIndex(t-1):o.getChildAtIndex(s);if($r(n)){let t=0;e&&(t=n.getTextContentSize()),r.set(n.__key,t,"text");}}}}function Cs(t,e,n,r,s){let i=null,o=0,l=null;null!==r?(i=r.__key,$r(r)?(o=r.getTextContentSize(),l="text"):Gs(r)&&(o=r.getChildrenSize(),l="element")):null!==s&&(i=s.__key,$r(s)?l="text":Gs(s)&&(l="element")),null!==i&&null!==l?t.set(i,o,l):(o=e.getIndexWithinParent(),-1===o&&(o=n.getChildrenSize()),t.set(n.__key,o,"element"));}function ks(t,e,n,r,s){"text"===t.type?(t.key=n,e||(t.offset+=s)):t.offset>r.getIndexWithinParent()&&(t.offset-=1);}function Ss(t,e,n,r,s,i,o){const l=r.anchorNode,c=r.focusNode,a=r.anchorOffset,u=r.focusOffset,f=document.activeElement;if(s.has("collaboration")&&f!==i||null!==f&&Gt(f))return;if(!ns(e))return void(null!==t&&te(n,l,c)&&r.removeAllRanges());const d=e.anchor,h=e.focus,g=d.key,_=h.key,p=$e(n,g),y=$e(n,_),m=d.offset,x=h.offset,v=e.format,T=e.style,C=e.isCollapsed();let k=p,S=y,b=!1;if("text"===d.type){k=se(p);const t=d.getNode();b=t.getFormat()!==v||t.getStyle()!==T;}else ns(t)&&"text"===t.anchor.type&&(b=!0);var w,N,E,P,D;if(("text"===h.type&&(S=se(y)),null!==k&&null!==S)&&(C&&(null===t||b||ns(t)&&(t.format!==v||t.style!==T))&&(w=v,N=T,E=m,P=g,D=performance.now(),ur=[w,N,E,P,D]),a!==m||u!==x||l!==k||c!==S||"Range"===r.type&&C||(null!==f&&i.contains(f)||i.focus({preventScroll:!0}),"element"===d.type))){try{r.setBaseAndExtent(k,m,S,x);}catch(t){}if(!s.has("skip-scroll-into-view")&&e.isCollapsed()&&null!==i&&i===document.activeElement){const t=e instanceof rs&&"element"===e.anchor.type?k.childNodes[m]||null:r.rangeCount>0?r.getRangeAt(0):null;if(null!==t){let e;if(t instanceof Text){const n=document.createRange();n.selectNode(t),e=n.getBoundingClientRect();}else e=t.getBoundingClientRect();!function(t,e,n){const r=n.ownerDocument,s=r.defaultView;if(null===s)return;let{top:i,bottom:o}=e,l=0,c=0,a=n;for(;null!==a;){const e=a===r.body;if(e)l=0,c=Xe(t).innerHeight;else {const t=a.getBoundingClientRect();l=t.top,c=t.bottom;}let n=0;if(i<l?n=-(l-i):o>c&&(n=o-c),0!==n)if(e)s.scrollBy(0,n);else {const t=a.scrollTop;a.scrollTop+=n;const e=a.scrollTop-t;i-=e,o-=e;}if(e)break;a=He(a);}}(n,e,i);}}or=!0;}}function Ns(t){let e=t;t.isCollapsed()||e.removeText();const n=ms();ns(n)&&(e=n),ns(e)||j(161);const r=e.anchor;let s=r.getNode(),i=r.offset;for(;!hn(s);)[s,i]=Es(s,i);return i}function Es(t,e){const n=t.getParent();if(!n){const t=fi();return ye().append(t),t.select(),[ye(),0]}if($r(t)){const r=t.splitText(e);if(0===r.length)return [n,t.getIndexWithinParent()];const s=0===e?0:1;return [n,r[0].getIndexWithinParent()+s]}if(!Gs(t)||0===e)return [n,t.getIndexWithinParent()];const r=t.getChildAtIndex(e);if(r){const n=new rs(Yr(t.__key,e,"element"),Yr(t.__key,e,"element"),0,""),s=t.insertNewAfter(n);s&&s.append(r,...r.getNextSiblings());}return [n,t.getIndexWithinParent()+1]}let Ps=null,Ds=null,Fs=!1,Os=!1,Is=0;const Ls={characterData:!0,childList:!0,subtree:!0};function As(){return Fs||null!==Ps&&Ps._readOnly}function Ms(){Fs&&j(13);}function zs(){Is>99&&j(14);}function Ws(){return null===Ps&&j(15),Ps}function Bs(){return null===Ds&&j(16),Ds}function Rs(){return Ds}function Ks(t,e,n){const r=e.__type,s=function(t,e){const n=t._nodes.get(e);return void 0===n&&j(30,e),n}(t,r);let i=n.get(r);void 0===i&&(i=Array.from(s.transforms),n.set(r,i));const o=i.length;for(let t=0;t<o&&(i[t](e),e.isAttached());t++);}function Js(t,e){return void 0!==t&&t.__key!==e&&t.isAttached()}function Vs(t,e){const n=t.type,r=e.get(n);void 0===r&&j(17,n);const s=r.klass;t.type!==s.getType()&&j(18,s.name);const i=s.importJSON(t),o=t.children;if(Gs(i)&&Array.isArray(o))for(let t=0;t<o.length;t++){const n=Vs(o[t],e);i.append(n);}return i}function $s(t,e){const n=Ps,r=Fs,s=Ds;Ps=t,Fs=!0,Ds=null;try{return e()}finally{Ps=n,Fs=r,Ds=s;}}function Hs(t,n){const r=t._pendingEditorState,s=t._rootElement,i=t._headless||null===s;if(null===r)return;const o=t._editorState,l=o._selection,c=r._selection,a=t._dirtyType!==lt,u=Ps,f=Fs,d=Ds,h=t._updating,g=t._observer;let _=null;if(t._pendingEditorState=null,t._editorState=r,!i&&a&&null!==g){Ds=t,Ps=r,Fs=!1,t._updating=!0;try{const e=t._dirtyType,n=t._dirtyElements,s=t._dirtyLeaves;g.disconnect(),_=Xn(o,r,t,e,n,s);}catch(e){if(e instanceof Error&&t._onError(e),Os)throw e;return mi(t,null,s,r),$t(t),t._dirtyType=at,Os=!0,Hs(t,o),void(Os=!1)}finally{g.observe(s,Ls),t._updating=h,Ps=u,Fs=f,Ds=d;}}r._readOnly||(r._readOnly=!0);const p=t._dirtyLeaves,y=t._dirtyElements,m=t._normalizedNodes,x=t._updateTags,v=t._deferred;a&&(t._dirtyType=lt,t._cloneNotNeeded.clear(),t._dirtyLeaves=new Set,t._dirtyElements=new Map,t._normalizedNodes=new Set,t._updateTags=new Set),function(t,e){const n=t._decorators;let r=t._pendingDecorators||n;const s=e._nodeMap;let i;for(i in r)s.has(i)||(r===n&&(r=_e(t)),delete r[i]);}(t,r);const T=i?null:ln(t._window);if(t._editable&&null!==T&&(a||null===c||c.dirty)){Ds=t,Ps=r;try{if(null!==g&&g.disconnect(),a||null===c||c.dirty){const e=t._blockCursorElement;null!==e&&sn(e,t,s),Ss(l,c,t,T,x,s);}on(t,s,c),null!==g&&g.observe(s,Ls);}finally{Ds=d,Ps=u;}}null!==_&&function(t,e,n,r,s){const i=Array.from(t._listeners.mutation),o=i.length;for(let t=0;t<o;t++){const[o,l]=i[t],c=e.get(l);void 0!==c&&o(c,{dirtyLeaves:r,prevEditorState:s,updateTags:n});}}(t,_,x,p,o),ns(c)||null===c||null!==l&&l.is(c)||t.dispatchCommand(e,void 0);const C=t._pendingDecorators;null!==C&&(t._decorators=C,t._pendingDecorators=null,js("decorator",t,!0,C)),function(t,e,n){const r=pe(e),s=pe(n);r!==s&&js("textcontent",t,!0,s);}(t,n||o,r),js("update",t,!0,{dirtyElements:y,dirtyLeaves:p,editorState:r,normalizedNodes:m,prevEditorState:n||o,tags:x}),function(t,e){if(t._deferred=[],0!==e.length){const n=t._updating;t._updating=!0;try{for(let t=0;t<e.length;t++)e[t]();}finally{t._updating=n;}}}(t,v),function(t){const e=t._updates;if(0!==e.length){const n=e.shift();if(n){const[e,r]=n;Xs(t,e,r);}}}(t);}function js(t,e,n,...r){const s=e._updating;e._updating=n;try{const n=Array.from(e._listeners[t]);for(let t=0;t<n.length;t++)n[t].apply(null,r);}finally{e._updating=s;}}function qs(t,e,n){if(!1===t._updating||Ds!==t){let r=!1;return t.update((()=>{r=qs(t,e,n);})),r}const r=ke(t);for(let s=4;s>=0;s--)for(let i=0;i<r.length;i++){const o=r[i]._commands.get(e);if(void 0!==o){const e=o[s];if(void 0!==e){const r=Array.from(e),s=r.length;for(let e=0;e<s;e++)if(!0===r[e](n,t))return !0}}}return !1}function Qs(t,e){const n=t._updates;let r=e||!1;for(;0!==n.length;){const e=n.shift();if(e){const[n,s]=e;let i,o;void 0!==s&&(i=s.onUpdate,o=s.tag,s.skipTransforms&&(r=!0),i&&t._deferred.push(i),o&&t._updateTags.add(o)),n();}}return r}function Xs(t,e,n){const r=t._updateTags;let s,i,o=!1,l=!1;void 0!==n&&(s=n.onUpdate,i=n.tag,null!=i&&r.add(i),o=n.skipTransforms||!1,l=n.discrete||!1),s&&t._deferred.push(s);const c=t._editorState;let a=t._pendingEditorState,u=!1;(null===a||a._readOnly)&&(a=t._pendingEditorState=new li(new Map((a||c)._nodeMap)),u=!0),a._flushSync=l;const f=Ps,d=Fs,h=Ds,g=t._updating;Ps=a,Fs=!1,t._updating=!0,Ds=t;try{u&&(t._headless?null!==c._selection&&(a._selection=c._selection.clone()):a._selection=function(t){const e=t.getEditorState()._selection,n=ln(t._window);return ns(e)||null==e?ys(e,n,t,null):e.clone()}(t));const n=t._compositionKey;e(),o=Qs(t,o),function(t,e){const n=e.getEditorState()._selection,r=t._selection;if(ns(r)){const t=r.anchor,e=r.focus;let s;if("text"===t.type&&(s=t.getNode(),s.selectionTransform(n,r)),"text"===e.type){const t=e.getNode();s!==t&&t.selectionTransform(n,r);}}}(a,t),t._dirtyType!==lt&&(o?function(t,e){const n=e._dirtyLeaves,r=t._nodeMap;for(const t of n){const e=r.get(t);$r(e)&&e.isAttached()&&e.isSimpleText()&&!e.isUnmergeable()&&qt(e);}}(a,t):function(t,e){const n=e._dirtyLeaves,r=e._dirtyElements,s=t._nodeMap,i=fe(),o=new Map;let l=n,c=l.size,a=r,u=a.size;for(;c>0||u>0;){if(c>0){e._dirtyLeaves=new Set;for(const t of l){const r=s.get(t);$r(r)&&r.isAttached()&&r.isSimpleText()&&!r.isUnmergeable()&&qt(r),void 0!==r&&Js(r,i)&&Ks(e,r,o),n.add(t);}if(l=e._dirtyLeaves,c=l.size,c>0){Is++;continue}}e._dirtyLeaves=new Set,e._dirtyElements=new Map;for(const t of a){const n=t[0],l=t[1];if("root"!==n&&!l)continue;const c=s.get(n);void 0!==c&&Js(c,i)&&Ks(e,c,o),r.set(n,l);}l=e._dirtyLeaves,c=l.size,a=e._dirtyElements,u=a.size,Is++;}e._dirtyLeaves=n,e._dirtyElements=r;}(a,t),Qs(t),function(t,e,n,r){const s=t._nodeMap,i=e._nodeMap,o=[];for(const[t]of r){const e=i.get(t);void 0!==e&&(e.isAttached()||(Gs(e)&&pn(e,t,s,i,o,r),s.has(t)||r.delete(t),o.push(t)));}for(const t of o)i.delete(t);for(const t of n){const e=i.get(t);void 0===e||e.isAttached()||(s.has(t)||n.delete(t),i.delete(t));}}(c,a,t._dirtyLeaves,t._dirtyElements));n!==t._compositionKey&&(a._flushSync=!0);const r=a._selection;if(ns(r)){const t=a._nodeMap,e=r.anchor.key,n=r.focus.key;void 0!==t.get(e)&&void 0!==t.get(n)||j(19);}else ss(r)&&0===r._nodes.size&&(a._selection=null);}catch(e){return e instanceof Error&&t._onError(e),t._pendingEditorState=c,t._dirtyType=at,t._cloneNotNeeded.clear(),t._dirtyLeaves=new Set,t._dirtyElements.clear(),void Hs(t)}finally{Ps=f,Fs=d,Ds=h,t._updating=g,Is=0;}const _=t._dirtyType!==lt||function(t,e){const n=e.getEditorState()._selection,r=t._selection;if(null!==r){if(r.dirty||!r.is(n))return !0}else if(null!==n)return !0;return !1}(a,t);_?a._flushSync?(a._flushSync=!1,Hs(t)):u&&Zt((()=>{Hs(t);})):(a._flushSync=!1,u&&(r.clear(),t._deferred=[],t._pendingEditorState=null));}function Ys(t,e,n){t._updating?t._updates.push([e,n]):Xs(t,e,n);}class Zs extends kr{constructor(t){super(t),this.__first=null,this.__last=null,this.__size=0,this.__format=0,this.__indent=0,this.__dir=null;}getFormat(){return this.getLatest().__format}getFormatType(){const t=this.getFormat();return Ot[t]||""}getIndent(){return this.getLatest().__indent}getChildren(){const t=[];let e=this.getFirstChild();for(;null!==e;)t.push(e),e=e.getNextSibling();return t}getChildrenKeys(){const t=[];let e=this.getFirstChild();for(;null!==e;)t.push(e.__key),e=e.getNextSibling();return t}getChildrenSize(){return this.getLatest().__size}isEmpty(){return 0===this.getChildrenSize()}isDirty(){const t=Bs()._dirtyElements;return null!==t&&t.has(this.__key)}isLastChild(){const t=this.getLatest(),e=this.getParentOrThrow().getLastChild();return null!==e&&e.is(t)}getAllTextNodes(){const t=[];let e=this.getFirstChild();for(;null!==e;){if($r(e)&&t.push(e),Gs(e)){const n=e.getAllTextNodes();t.push(...n);}e=e.getNextSibling();}return t}getFirstDescendant(){let t=this.getFirstChild();for(;Gs(t);){const e=t.getFirstChild();if(null===e)break;t=e;}return t}getLastDescendant(){let t=this.getLastChild();for(;Gs(t);){const e=t.getLastChild();if(null===e)break;t=e;}return t}getDescendantByIndex(t){const e=this.getChildren(),n=e.length;if(t>=n){const t=e[n-1];return Gs(t)&&t.getLastDescendant()||t||null}const r=e[t];return Gs(r)&&r.getFirstDescendant()||r||null}getFirstChild(){const t=this.getLatest().__first;return null===t?null:de(t)}getFirstChildOrThrow(){const t=this.getFirstChild();return null===t&&j(45,this.__key),t}getLastChild(){const t=this.getLatest().__last;return null===t?null:de(t)}getLastChildOrThrow(){const t=this.getLastChild();return null===t&&j(96,this.__key),t}getChildAtIndex(t){const e=this.getChildrenSize();let n,r;if(t<e/2){for(n=this.getFirstChild(),r=0;null!==n&&r<=t;){if(r===t)return n;n=n.getNextSibling(),r++;}return null}for(n=this.getLastChild(),r=e-1;null!==n&&r>=t;){if(r===t)return n;n=n.getPreviousSibling(),r--;}return null}getTextContent(){let t="";const e=this.getChildren(),n=e.length;for(let r=0;r<n;r++){const s=e[r];t+=s.getTextContent(),Gs(s)&&r!==n-1&&!s.isInline()&&(t+=kt);}return t}getTextContentSize(){let t=0;const e=this.getChildren(),n=e.length;for(let r=0;r<n;r++){const s=e[r];t+=s.getTextContentSize(),Gs(s)&&r!==n-1&&!s.isInline()&&(t+=kt.length);}return t}getDirection(){return this.getLatest().__dir}hasFormat(t){if(""!==t){const e=Ft[t];return !!(this.getFormat()&e)}return !1}select(t,e){Ms();const n=ms();let r=t,s=e;const i=this.getChildrenSize();if(!this.canBeEmpty())if(0===t&&0===e){const t=this.getFirstChild();if($r(t)||Gs(t))return t.select(0,0)}else if(!(void 0!==t&&t!==i||void 0!==e&&e!==i)){const t=this.getLastChild();if($r(t)||Gs(t))return t.select()}void 0===r&&(r=i),void 0===s&&(s=i);const o=this.__key;return ns(n)?(n.anchor.set(o,r,"element"),n.focus.set(o,s,"element"),n.dirty=!0,n):hs(o,r,o,s,"element","element")}selectStart(){const t=this.getFirstDescendant();return t?t.selectStart():this.select()}selectEnd(){const t=this.getLastDescendant();return t?t.selectEnd():this.select()}clear(){const t=this.getWritable();return this.getChildren().forEach((t=>t.remove())),t}append(...t){return this.splice(this.getChildrenSize(),0,t)}setDirection(t){const e=this.getWritable();return e.__dir=t,e}setFormat(t){return this.getWritable().__format=""!==t?Ft[t]:0,this}setIndent(t){return this.getWritable().__indent=t,this}splice(t,e,n){const r=n.length,s=this.getChildrenSize(),i=this.getWritable(),o=i.__key,l=[],c=[],a=this.getChildAtIndex(t+e);let u=null,f=s-e+r;if(0!==t)if(t===s)u=this.getLastChild();else {const e=this.getChildAtIndex(t);null!==e&&(u=e.getPreviousSibling());}if(e>0){let t=null===u?this.getFirstChild():u.getNextSibling();for(let n=0;n<e;n++){null===t&&j(100);const e=t.getNextSibling(),n=t.__key;ce(t.getWritable()),c.push(n),t=e;}}let d=u;for(let t=0;t<r;t++){const e=n[t];null!==d&&e.is(d)&&(u=d=d.getPreviousSibling());const r=e.getWritable();r.__parent===o&&f--,ce(r);const s=e.__key;if(null===d)i.__first=s,r.__prev=null;else {const t=d.getWritable();t.__next=s,r.__prev=t.__key;}e.__key===o&&j(76),r.__parent=o,l.push(s),d=e;}if(t+e===s){if(null!==d){d.getWritable().__next=null,i.__last=d.__key;}}else if(null!==a){const t=a.getWritable();if(null!==d){const e=d.getWritable();t.__prev=d.__key,e.__next=a.__key;}else t.__prev=null;}if(i.__size=f,c.length){const t=ms();if(ns(t)){const e=new Set(c),n=new Set(l),{anchor:r,focus:s}=t;ti(r,e,n)&&Cs(r,r.getNode(),this,u,a),ti(s,e,n)&&Cs(s,s.getNode(),this,u,a),0!==f||this.canBeEmpty()||Ge(this)||this.remove();}}return i}exportJSON(){return {children:[],direction:this.getDirection(),format:this.getFormatType(),indent:this.getIndent(),type:"element",version:1}}insertNewAfter(t,e){return null}canIndent(){return !0}collapseAtStart(t){return !1}excludeFromCopy(t){return !1}canReplaceWith(t){return !0}canInsertAfter(t){return !0}canBeEmpty(){return !0}canInsertTextBefore(){return !0}canInsertTextAfter(){return !0}isInline(){return !1}isShadowRoot(){return !1}canMergeWith(t){return !1}extractWithChild(t,e,n){return !1}}function Gs(t){return t instanceof Zs}function ti(t,e,n){let r=t.getNode();for(;r;){const t=r.__key;if(e.has(t)&&!n.has(t))return !0;r=r.getParent();}return !1}class ei extends kr{constructor(t){super(t);}decorate(t,e){j(47);}isIsolated(){return !1}isInline(){return !0}isKeyboardSelectable(){return !0}}function ni(t){return t instanceof ei}class ri extends Zs{static getType(){return "root"}static clone(){return new ri}constructor(){super("root"),this.__cachedText=null;}getTopLevelElementOrThrow(){j(51);}getTextContent(){const t=this.__cachedText;return !As()&&Bs()._dirtyType!==lt||null===t?super.getTextContent():t}remove(){j(52);}replace(t){j(53);}insertBefore(t){j(54);}insertAfter(t){j(55);}updateDOM(t,e){return !1}append(...t){for(let e=0;e<t.length;e++){const n=t[e];Gs(n)||ni(n)||j(56);}return super.append(...t)}static importJSON(t){const e=ye();return e.setFormat(t.format),e.setIndent(t.indent),e.setDirection(t.direction),e}exportJSON(){return {children:[],direction:this.getDirection(),format:this.getFormatType(),indent:this.getIndent(),type:"root",version:1}}collapseAtStart(){return !0}}function si(t){return t instanceof ri}function ii(){return new li(new Map([["root",new ri]]))}function oi(t){const e=t.exportJSON(),n=t.constructor;if(e.type!==n.getType()&&j(130,n.name),Gs(t)){const r=e.children;Array.isArray(r)||j(59,n.name);const s=t.getChildren();for(let t=0;t<s.length;t++){const e=oi(s[t]);r.push(e);}}return e}class li{constructor(t,e){this._nodeMap=t,this._selection=e||null,this._flushSync=!1,this._readOnly=!1;}isEmpty(){return 1===this._nodeMap.size&&null===this._selection}read(t){return $s(this,t)}clone(t){const e=new li(this._nodeMap,void 0===t?this._selection:t);return e._readOnly=!0,e}toJSON(){return $s(this,(()=>({root:oi(ye())})))}}class ci extends Zs{static getType(){return "artificial"}createDOM(t){return document.createElement("div")}}class ai extends Zs{constructor(t){super(t),this.__textFormat=0;}static getType(){return "paragraph"}getTextFormat(){return this.getLatest().__textFormat}setTextFormat(t){const e=this.getWritable();return e.__textFormat=t,e}hasTextFormat(t){const e=Pt[t];return !!(this.getTextFormat()&e)}static clone(t){return new ai(t.__key)}createDOM(t){const e=document.createElement("p"),n=ze(t.theme,"paragraph");if(void 0!==n){e.classList.add(...n);}return e}updateDOM(t,e,n){return !1}static importDOM(){return {p:t=>({conversion:ui,priority:0})}}exportDOM(t){const{element:e}=super.exportDOM(t);if(e&&un(e)){this.isEmpty()&&e.append(document.createElement("br"));const t=this.getFormatType();e.style.textAlign=t;const n=this.getDirection();n&&(e.dir=n);const r=this.getIndent();r>0&&(e.style.textIndent=20*r+"px");}return {element:e}}static importJSON(t){const e=fi();return e.setFormat(t.format),e.setIndent(t.indent),e.setDirection(t.direction),e.setTextFormat(t.textFormat),e}exportJSON(){return {...super.exportJSON(),textFormat:this.getTextFormat(),type:"paragraph",version:1}}insertNewAfter(t,e){const n=fi();n.setTextFormat(t.format);const r=this.getDirection();return n.setDirection(r),n.setFormat(this.getFormatType()),this.insertAfter(n,e),n}collapseAtStart(){const t=this.getChildren();if(0===t.length||$r(t[0])&&""===t[0].getTextContent().trim()){if(null!==this.getNextSibling())return this.selectNext(),this.remove(),!0;if(null!==this.getPreviousSibling())return this.selectPrevious(),this.remove(),!0}return !1}}function ui(t){const e=fi();if(t.style){e.setFormat(t.style.textAlign);const n=parseInt(t.style.textIndent,10)/20;n>0&&e.setIndent(n);}return {node:e}}function fi(){return en(new ai)}function di(t){return t instanceof ai}const hi=0;function mi(t,e,n,r){const s=t._keyToDOMMap;s.clear(),t._editorState=ii(),t._pendingEditorState=r,t._compositionKey=null,t._dirtyType=lt,t._cloneNotNeeded.clear(),t._dirtyLeaves=new Set,t._dirtyElements.clear(),t._normalizedNodes=new Set,t._updateTags=new Set,t._updates=[],t._blockCursorElement=null;const i=t._observer;null!==i&&(i.disconnect(),t._observer=null),null!==e&&(e.textContent=""),null!==n&&(n.textContent="",s.set("root",n));}function xi(t){const e=t||{},n=Rs(),r=e.theme||{},s=void 0===t?n:e.parentEditor||null,i=e.disableEvents||!1,o=ii(),l=e.namespace||(null!==s?s._config.namespace:Se()),c=e.editorState,a=[ri,Ar,Sr,jr,ai,ci,...e.nodes||[]],{onError:u,html:f}=e,d=void 0===e.editable||e.editable;let h;if(void 0===t&&null!==n)h=n._nodes;else {h=new Map;for(let t=0;t<a.length;t++){let e=a[t],n=null,r=null;if("function"!=typeof e){const t=e;e=t.replace,n=t.with,r=t.withKlass||null;}const s=e.getType(),i=e.transform(),o=new Set;null!==i&&o.add(i),h.set(s,{exportDOM:f&&f.export?f.export.get(e):void 0,klass:e,replace:n,replaceWithKlass:r,transforms:o});}}const g=new vi(o,s,h,{disableEvents:i,namespace:l,theme:r},u||console.error,function(t,e){const n=new Map,r=new Set,s=t=>{Object.keys(t).forEach((e=>{let r=n.get(e);void 0===r&&(r=[],n.set(e,r)),r.push(t[e]);}));};return t.forEach((t=>{const e=t.klass.importDOM;if(null==e||r.has(e))return;r.add(e);const n=e.call(t.klass);null!==n&&s(n);})),e&&s(e),n}(h,f?f.import:void 0),d);return void 0!==c&&(g._pendingEditorState=c,g._dirtyType=at),g}class vi{constructor(t,e,n,r,s,i,o){this._parentEditor=e,this._rootElement=null,this._editorState=t,this._pendingEditorState=null,this._compositionKey=null,this._deferred=[],this._keyToDOMMap=new Map,this._updates=[],this._updating=!1,this._listeners={decorator:new Set,editable:new Set,mutation:new Map,root:new Set,textcontent:new Set,update:new Set},this._commands=new Map,this._config=r,this._nodes=n,this._decorators={},this._pendingDecorators=null,this._dirtyType=lt,this._cloneNotNeeded=new Set,this._dirtyLeaves=new Set,this._dirtyElements=new Map,this._normalizedNodes=new Set,this._updateTags=new Set,this._observer=null,this._key=Se(),this._onError=s,this._htmlConversions=i,this._editable=o,this._headless=null!==e&&e._headless,this._window=null,this._blockCursorElement=null;}isComposing(){return null!=this._compositionKey}registerUpdateListener(t){const e=this._listeners.update;return e.add(t),()=>{e.delete(t);}}registerEditableListener(t){const e=this._listeners.editable;return e.add(t),()=>{e.delete(t);}}registerDecoratorListener(t){const e=this._listeners.decorator;return e.add(t),()=>{e.delete(t);}}registerTextContentListener(t){const e=this._listeners.textcontent;return e.add(t),()=>{e.delete(t);}}registerRootListener(t){const e=this._listeners.root;return t(this._rootElement,null),e.add(t),()=>{t(null,this._rootElement),e.delete(t);}}registerCommand(t,e,n){void 0===n&&j(35);const r=this._commands;r.has(t)||r.set(t,[new Set,new Set,new Set,new Set,new Set]);const s=r.get(t);void 0===s&&j(36,String(t));const i=s[n];return i.add(e),()=>{i.delete(e),s.every((t=>0===t.size))&&r.delete(t);}}registerMutationListener(t,e){let n=this._nodes.get(t.getType());void 0===n&&j(37,t.name);let r=t,s=null;for(;s=n.replaceWithKlass;)r=s,n=this._nodes.get(s.getType()),void 0===n&&j(37,s.name);const i=this._listeners.mutation;return i.set(e,r),()=>{i.delete(e);}}registerNodeTransformToKlass(t,e){const n=t.getType(),r=this._nodes.get(n);void 0===r&&j(37,t.name);return r.transforms.add(e),r}registerNodeTransform(t,e){const n=this.registerNodeTransformToKlass(t,e),r=[n],s=n.replaceWithKlass;if(null!=s){const t=this.registerNodeTransformToKlass(s,e);r.push(t);}var i,o;return i=this,o=t.getType(),Ys(i,(()=>{const t=Ws();if(t.isEmpty())return;if("root"===o)return void ye().markDirty();const e=t._nodeMap;for(const[,t]of e)t.markDirty();}),null===i._pendingEditorState?{tag:"history-merge"}:void 0),()=>{r.forEach((t=>t.transforms.delete(e)));}}hasNode(t){return this._nodes.has(t.getType())}hasNodes(t){return t.every(this.hasNode.bind(this))}dispatchCommand(t,e){return Ue(this,t,e)}getDecorators(){return this._decorators}getRootElement(){return this._rootElement}getKey(){return this._key}setRootElement(t){const e=this._rootElement;if(t!==e){const n=ze(this._config.theme,"root"),r=this._pendingEditorState||this._editorState;if(this._rootElement=t,mi(this,e,t,r),null!==e&&(this._config.disableEvents||Tr(e),null!=n&&e.classList.remove(...n)),null!==t){const e=function(t){const e=t.ownerDocument;return e&&e.defaultView||null}(t),r=t.style;r.userSelect="text",r.whiteSpace="pre-wrap",r.wordBreak="break-word",t.setAttribute("data-lexical-editor","true"),this._window=e,this._dirtyType=at,$t(this),this._updateTags.add("history-merge"),Hs(this),this._config.disableEvents||function(t,e){const n=t.ownerDocument,r=ir.get(n);(void 0===r||r<1)&&n.addEventListener("selectionchange",mr),ir.set(n,(r||0)+1),t.__lexicalEditor=e;const s=pr(t);for(let n=0;n<tr.length;n++){const[r,i]=tr[n],o="function"==typeof i?t=>{vr(t)||(xr(t),(e.isEditable()||"click"===r)&&i(t,e));}:t=>{if(vr(t))return;xr(t);const n=e.isEditable();switch(r){case"cut":return n&&Ue(e,z,t);case"copy":return Ue(e,M$2,t);case"paste":return n&&Ue(e,c$2,t);case"dragstart":return n&&Ue(e,I,t);case"dragover":return n&&Ue(e,L$2,t);case"dragend":return n&&Ue(e,A,t);case"focus":return n&&Ue(e,U,t);case"blur":return n&&Ue(e,V,t);case"drop":return n&&Ue(e,F,t)}};t.addEventListener(r,o),s.push((()=>{t.removeEventListener(r,o);}));}}(t,this),null!=n&&t.classList.add(...n);}else this._editorState=r,this._pendingEditorState=null,this._window=null;js("root",this,!1,t,e);}}getElementByKey(t){return this._keyToDOMMap.get(t)||null}getEditorState(){return this._editorState}setEditorState(t,e){t.isEmpty()&&j(38),Vt(this);const n=this._pendingEditorState,r=this._updateTags,s=void 0!==e?e.tag:null;null===n||n.isEmpty()||(null!=s&&r.add(s),Hs(this)),this._pendingEditorState=t,this._dirtyType=at,this._dirtyElements.set("root",!1),this._compositionKey=null,null!=s&&r.add(s),Hs(this);}parseEditorState(t,e){return function(t,e,n){const r=ii(),s=Ps,i=Fs,o=Ds,l=e._dirtyElements,c=e._dirtyLeaves,a=e._cloneNotNeeded,u=e._dirtyType;e._dirtyElements=new Map,e._dirtyLeaves=new Set,e._cloneNotNeeded=new Set,e._dirtyType=0,Ps=r,Fs=!1,Ds=e;try{const s=e._nodes;Vs(t.root,s),n&&n(),r._readOnly=!0;}catch(t){t instanceof Error&&e._onError(t);}finally{e._dirtyElements=l,e._dirtyLeaves=c,e._cloneNotNeeded=a,e._dirtyType=u,Ps=s,Fs=i,Ds=o;}return r}("string"==typeof t?JSON.parse(t):t,this,e)}update(t,e){Ys(this,t,e);}focus(t,e={}){const n=this._rootElement;null!==n&&(n.setAttribute("autocapitalize","off"),Ys(this,(()=>{const t=ms(),n=ye();null!==t?t.dirty=!0:0!==n.getChildrenSize()&&("rootStart"===e.defaultSelection?n.selectStart():n.selectEnd());}),{onUpdate:()=>{n.removeAttribute("autocapitalize"),t&&t();},tag:"focus"}),null===this._pendingEditorState&&n.removeAttribute("autocapitalize"));}blur(){const t=this._rootElement;null!==t&&t.blur();const e=ln(this._window);null!==e&&e.removeAllRanges();}isEditable(){return this._editable}setEditable(t){this._editable!==t&&(this._editable=t,js("editable",this,!0,t));}toJSON(){return {editorState:this._editorState.toJSON()}}}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function r$1(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var t$1=r$1((function(e){const n=new URLSearchParams;n.append("code",e);for(let e=1;e<arguments.length;e++)n.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${n} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));const l$2=reactExports.createContext(null);function o$1(e,n){let r=null;return {getTheme:function(){return null!=n?n:null!=r?r.getTheme():null}}}function u$2(){const e=reactExports.useContext(l$2);return null==e&&t$1(8),e}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const s="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement,m$3=s?reactExports.useLayoutEffect:reactExports.useEffect,u$1={tag:"history-merge"};function p$2({initialConfig:l,children:c}){const p=reactExports.useMemo((()=>{const{theme:t,namespace:c,editor__DEPRECATED:a,nodes:d,onError:m,editorState:p,html:f}=l,E=o$1(null,t);let h=a||null;if(null===h){const e=xi({editable:l.editable,html:f,namespace:c,nodes:d,onError:t=>m(t,e),theme:t});!function(e,t){if(null===t)return;if(void 0===t)e.update((()=>{const t=ye();if(t.isEmpty()){const o=fi();t.append(o);const n=s?document.activeElement:null;(null!==ms()||null!==n&&n===e.getRootElement())&&o.select();}}),u$1);else if(null!==t)switch(typeof t){case"string":{const o=e.parseEditorState(t);e.setEditorState(o,u$1);break}case"object":e.setEditorState(t,u$1);break;case"function":e.update((()=>{ye().isEmpty()&&t(e);}),u$1);}}(e,p),h=e;}return [h,E]}),[]);return m$3((()=>{const e=l.editable,[t]=p;t.setEditable(void 0===e||e);}),[]),jsxRuntimeExports.jsx(l$2.Provider,{value:p,children:c})}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const d$1="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement?reactExports.useLayoutEffect:reactExports.useEffect;function n$1({ariaActiveDescendant:a,ariaAutoComplete:i,ariaControls:n,ariaDescribedBy:l,ariaExpanded:c,ariaLabel:s,ariaLabelledBy:m,ariaMultiline:u,ariaOwns:b,ariaRequired:p,autoCapitalize:x,className:w,id:v,role:f="textbox",spellCheck:y=!0,style:C,tabIndex:E,"data-testid":D,...L}){const[h]=u$2(),[k,q]=reactExports.useState(!1),z=reactExports.useCallback((e=>{e&&e.ownerDocument&&e.ownerDocument.defaultView&&h.setRootElement(e);}),[h]);return d$1((()=>(q(h.isEditable()),h.registerEditableListener((e=>{q(e);})))),[h]),jsxRuntimeExports.jsx("div",{...L,"aria-activedescendant":k?a:void 0,"aria-autocomplete":k?i:"none","aria-controls":k?n:void 0,"aria-describedby":l,"aria-expanded":k&&"combobox"===f?!!c:void 0,"aria-label":s,"aria-labelledby":m,"aria-multiline":u,"aria-owns":k?b:void 0,"aria-readonly":!k||void 0,"aria-required":p,autoCapitalize:x,className:w,contentEditable:k,"data-testid":D,id:v,ref:z,role:f,spellCheck:y,style:C,tabIndex:E})}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function m$2(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}m$2((function(e){const t=new URLSearchParams;t.append("code",e);for(let e=1;e<arguments.length;e++)t.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${t} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));function L$1(e,n){const o=Ke(e.focus,n);return ni(o)&&!o.isIsolated()||Gs(o)&&!o.isInline()&&!o.canBeEmpty()}function D(e,t,n,o){e.modify(t?"extend":"move",n,o);}function M$1(e){const t=e.anchor.getNode();return "rtl"===(si(t)?t:t.getParentOrThrow()).getDirection()}function H(e,t,n){const o=M$1(e);D(e,t,n?!o:o,"character");}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function g$2(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}g$2((function(e){const t=new URLSearchParams;t.append("code",e);for(let e=1;e<arguments.length;e++)t.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${t} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));const h$2="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement,m$1=h$2&&"documentMode"in document?document.documentMode:null;!(!h$2||!("InputEvent"in window)||m$1)&&"getTargetRanges"in new window.InputEvent("input");function L(...e){const t=[];for(const n of e)if(n&&"string"==typeof n)for(const[e]of n.matchAll(/\S+/g))t.push(e);return t}function b(...e){return ()=>{e.forEach((e=>e()));}}function $(e,...t){const n=L(...t);n.length>0&&e.classList.add(...n);}const Q=(e,t)=>{let n=e;for(;n!==ye()&&null!=n;){if(t(n))return n;n=n.getParent();}return null};

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const i$2=new Set(["mouseenter","mouseleave"]);function l$1({nodeType:l,eventType:s,eventListener:c}){const[u]=u$2(),a=reactExports.useRef(c);return a.current=c,reactExports.useEffect((()=>{const e=i$2.has(s),r=r=>{u.update((()=>{const o=ge(r.target);if(null!==o){const n=e?o instanceof l?o:null:Q(o,(e=>e instanceof l));if(null!==n)return void a.current(r,u,n.getKey())}}));};return u.registerRootListener(((t,n)=>{t&&t.addEventListener(s,r,e),n&&n.removeEventListener(s,r,e);}))}),[u,l]),null}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const l=0,_$1=1,f$1=2,p$1=0,h$1=1,m=2,g$1=3,y=4;function S(t,e,n,o,r){if(null===t||0===n.size&&0===o.size&&!r)return p$1;const i=e._selection,s=t._selection;if(r)return h$1;if(!(ns(i)&&ns(s)&&s.isCollapsed()&&i.isCollapsed()))return p$1;const c=function(t,e,n){const o=t._nodeMap,r=[];for(const t of e){const e=o.get(t);void 0!==e&&r.push(e);}for(const[t,e]of n){if(!e)continue;const n=o.get(t);void 0===n||si(n)||r.push(n);}return r}(e,n,o);if(0===c.length)return p$1;if(c.length>1){const n=e._nodeMap,o=n.get(i.anchor.key),r=n.get(s.anchor.key);return o&&r&&!t._nodeMap.has(o.__key)&&$r(o)&&1===o.__text.length&&1===i.anchor.offset?m:p$1}const l=c[0],_=t._nodeMap.get(l.__key);if(!$r(_)||!$r(l)||_.__mode!==l.__mode)return p$1;const f=_.__text,S=l.__text;if(f===S)return p$1;const k=i.anchor,C=s.anchor;if(k.key!==C.key||"text"!==k.type)return p$1;const x=k.offset,M=C.offset,z=S.length-f.length;return 1===z&&M===x-1?m:-1===z&&M===x+1?g$1:-1===z&&M===x?y:p$1}function k(t,e){let n=Date.now(),o=p$1;return (r,i,s,c,d,h)=>{const m=Date.now();if(h.has("historic"))return o=p$1,n=m,f$1;const g=S(r,i,c,d,t.isComposing()),y=(()=>{const y=null===s||s.editor===t,S=h.has("history-push");if(!S&&y&&h.has("history-merge"))return l;if(null===r)return _$1;const k=i._selection;if(!(c.size>0||d.size>0))return null!==k?l:f$1;if(!1===S&&g!==p$1&&g===o&&m<n+e&&y)return l;if(1===c.size){if(function(t,e,n){const o=e._nodeMap.get(t),r=n._nodeMap.get(t),i=e._selection,s=n._selection;let c=!1;return ns(i)&&ns(s)&&(c="element"===i.anchor.type&&"element"===i.focus.type&&"text"===s.anchor.type&&"text"===s.focus.type),!(c||!$r(o)||!$r(r))&&o.__type===r.__type&&o.__text===r.__text&&o.__mode===r.__mode&&o.__detail===r.__detail&&o.__style===r.__style&&o.__format===r.__format&&o.__parent===r.__parent}(Array.from(c)[0],r,i))return l}return _$1})();return n=m,o=g,y}}function C(t){t.undoStack=[],t.redoStack=[],t.current=null;}function x$2(a,u,d){const l=k(a,d),p=b(a.registerCommand(h$3,(()=>(function(t,e){const n=e.redoStack,o=e.undoStack;if(0!==o.length){const r=e.current,i=o.pop();null!==r&&(n.push(r),t.dispatchCommand(K,!0)),0===o.length&&t.dispatchCommand(J,!1),e.current=i||null,i&&i.editor.setEditorState(i.editorState,{tag:"historic"});}}(a,u),!0)),hi),a.registerCommand(g$3,(()=>(function(t,e){const n=e.redoStack,o=e.undoStack;if(0!==n.length){const r=e.current;null!==r&&(o.push(r),t.dispatchCommand(J,!0));const i=n.pop();0===n.length&&t.dispatchCommand(K,!1),e.current=i||null,i&&i.editor.setEditorState(i.editorState,{tag:"historic"});}}(a,u),!0)),hi),a.registerCommand(B,(()=>(C(u),!1)),hi),a.registerCommand(R,(()=>(C(u),a.dispatchCommand(K,!1),a.dispatchCommand(J,!1),!0)),hi),a.registerUpdateListener((({editorState:t,prevEditorState:e,dirtyLeaves:n,dirtyElements:o,tags:r})=>{const i=u.current,d=u.redoStack,p=u.undoStack,h=null===i?null:i.editorState;if(null!==i&&t===h)return;const m=l(e,t,i,n,o,r);if(m===_$1)0!==d.length&&(u.redoStack=[],a.dispatchCommand(K,!1)),null!==i&&(p.push({...i}),a.dispatchCommand(J,!0));else if(m===f$1)return;u.current={editor:a,editorState:t};})));return p}function M(){return {current:null,redoStack:[],undoStack:[]}}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function c$1({externalHistoryState:c}){const[a]=u$2();return function(t,c,a=1e3){const l=reactExports.useMemo((()=>c||M()),[c]);reactExports.useEffect((()=>x$2(t,l,a)),[a,t,l]);}(a,c),null}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const r="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement?reactExports.useLayoutEffect:reactExports.useEffect;function i$1({ignoreHistoryMergeTagChange:t=!0,ignoreSelectionChange:o=!1,onChange:i}){const[n]=u$2();return r((()=>{if(i)return n.registerUpdateListener((({editorState:e,dirtyElements:r,dirtyLeaves:a,prevEditorState:d,tags:s})=>{o&&0===r.size&&0===a.size||t&&s.has("history-merge")||d.isEmpty()||i(e,n,s);}))}),[n,t,o,i]),null}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function t(r,e){return t=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,e){return r.__proto__=e,r},t(r,e)}var o={error:null},n=function(e){var n,a;function s(){for(var r,t=arguments.length,n=new Array(t),a=0;a<t;a++)n[a]=arguments[a];return (r=e.call.apply(e,[this].concat(n))||this).state=o,r.resetErrorBoundary=function(){for(var e,t=arguments.length,o=new Array(t),n=0;n<t;n++)o[n]=arguments[n];null==r.props.onReset||(e=r.props).onReset.apply(e,o),r.reset();},r}a=e,(n=s).prototype=Object.create(a.prototype),n.prototype.constructor=n,t(n,a),s.getDerivedStateFromError=function(r){return {error:r}};var l=s.prototype;return l.reset=function(){this.setState(o);},l.componentDidCatch=function(r,e){var t,o;null==(t=(o=this.props).onError)||t.call(o,r,e);},l.componentDidUpdate=function(r,e){var t,o,n,a,s=this.state.error,l=this.props.resetKeys;null!==s&&null!==e.error&&(void 0===(n=r.resetKeys)&&(n=[]),void 0===(a=l)&&(a=[]),n.length!==a.length||n.some((function(r,e){return !Object.is(r,a[e])})))&&(null==(t=(o=this.props).onResetKeysChange)||t.call(o,r.resetKeys,l),this.reset());},l.render=function(){var e=this.state.error,t=this.props,o=t.fallbackRender,n=t.FallbackComponent,a=t.fallback;if(null!==e){var s={error:e,resetErrorBoundary:this.resetErrorBoundary};if(reactExports.isValidElement(a))return a;if("function"==typeof o)return o(s);if(n)return reactExports.createElement(n,s);throw new Error("react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop")}return this.props.children},s}(reactExports.Component);function a$1({children:r,onError:t}){return jsxRuntimeExports.jsx(n,{fallback:jsxRuntimeExports.jsx("div",{style:{border:"1px solid #f00",color:"#f00",padding:"8px"},children:"An error was thrown."}),onError:t,children:r})}

var ElementNodeType = /* @__PURE__ */ ((ElementNodeType2) => {
  ElementNodeType2["CODE"] = "code";
  ElementNodeType2["PARAGRAPH"] = "paragraph";
  ElementNodeType2["QUOTE"] = "quote";
  ElementNodeType2["HEADING"] = "heading";
  ElementNodeType2["LIST_ITEM"] = "list-item";
  ElementNodeType2["KEY_VALUE_NODE"] = "key-value";
  return ElementNodeType2;
})(ElementNodeType || {});

class HeadingNode extends ai {
  static getType() {
    return ElementNodeType.HEADING;
  }
  static clone() {
    return new HeadingNode();
  }
  constructor() {
    super();
  }
  createDOM(config) {
    const element = super.createDOM(config);
    $(element, config.theme.sHeading);
    return element;
  }
  static importJSON() {
    throw new Error("Method not implemented.");
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.HEADING
    };
  }
}
function $createHeadingNode() {
  return en(new HeadingNode());
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const u=new Set(["http:","https:","mailto:","sms:","tel:"]);class _ extends Zs{static getType(){return "link"}static clone(t){return new _(t.__url,{rel:t.__rel,target:t.__target,title:t.__title},t.__key)}constructor(t,e={},r){super(r);const{target:i=null,rel:n=null,title:l=null}=e;this.__url=t,this.__target=i,this.__rel=n,this.__title=l;}createDOM(e){const r=document.createElement("a");return r.href=this.sanitizeUrl(this.__url),null!==this.__target&&(r.target=this.__target),null!==this.__rel&&(r.rel=this.__rel),null!==this.__title&&(r.title=this.__title),$(r,e.theme.link),r}updateDOM(t,e,r){const i=this.__url,n=this.__target,l=this.__rel,s=this.__title;return i!==t.__url&&(e.href=i),n!==t.__target&&(n?e.target=n:e.removeAttribute("target")),l!==t.__rel&&(l?e.rel=l:e.removeAttribute("rel")),s!==t.__title&&(s?e.title=s:e.removeAttribute("title")),!1}static importDOM(){return {a:t=>({conversion:a,priority:1})}}static importJSON(t){const e=g(t.url,{rel:t.rel,target:t.target,title:t.title});return e.setFormat(t.format),e.setIndent(t.indent),e.setDirection(t.direction),e}sanitizeUrl(t){try{const e=new URL(t);if(!u.has(e.protocol))return "about:blank"}catch(e){return t}return t}exportJSON(){return {...super.exportJSON(),rel:this.getRel(),target:this.getTarget(),title:this.getTitle(),type:"link",url:this.getURL(),version:1}}getURL(){return this.getLatest().__url}setURL(t){this.getWritable().__url=t;}getTarget(){return this.getLatest().__target}setTarget(t){this.getWritable().__target=t;}getRel(){return this.getLatest().__rel}setRel(t){this.getWritable().__rel=t;}getTitle(){return this.getLatest().__title}setTitle(t){this.getWritable().__title=t;}insertNewAfter(t,e=!0){const r=g(this.__url,{rel:this.__rel,target:this.__target,title:this.__title});return this.insertAfter(r,e),r}canInsertTextBefore(){return !1}canInsertTextAfter(){return !1}canBeEmpty(){return !1}isInline(){return !0}extractWithChild(t,e,r){if(!ns(e))return !1;const i=e.anchor.getNode(),l=e.focus.getNode();return this.isParentOf(i)&&this.isParentOf(l)&&e.getTextContent().length>0}}function a(t){let r=null;if(an(t)){const e=t.textContent;(null!==e&&""!==e||t.children.length>0)&&(r=g(t.getAttribute("href")||"",{rel:t.getAttribute("rel"),target:t.getAttribute("target"),title:t.getAttribute("title")}));}return {node:r}}function g(t,e){return en(new _(t,e))}function c(t){return t instanceof _}class h extends _{static getType(){return "autolink"}static clone(t){return new h(t.__url,{rel:t.__rel,target:t.__target,title:t.__title},t.__key)}static importJSON(t){const e=f(t.url,{rel:t.rel,target:t.target,title:t.title});return e.setFormat(t.format),e.setIndent(t.indent),e.setDirection(t.direction),e}static importDOM(){return null}exportJSON(){return {...super.exportJSON(),type:"autolink",version:1}}insertNewAfter(t,e=!0){const r=this.getParentOrThrow().insertNewAfter(t,e);if(Gs(r)){const t=f(this.__url,{rel:this.__rel,target:this.__target,title:this.__title});return r.append(t),t}return null}}function f(t,e){return en(new h(t,e))}function p(t){return t instanceof h}

const Transclusion = ({
  slug,
  getTransclusionContent
}) => {
  const [content, setContent] = reactExports.useState(null);
  const [isError, setIsError] = reactExports.useState(false);
  reactExports.useEffect(() => {
    getTransclusionContent(slug).then((content2) => {
      setContent(content2);
      setIsError(false);
    }).catch(() => {
      setContent(/* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Not available." }));
      setIsError(true);
    });
  }, [slug]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "transclusion " + (isError ? "unavailable" : ""),
      "data-transclusion-id": slug,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "slug", children: [
          "/",
          slug
        ] }),
        isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "not-available-disclaimer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Icon$1,
            {
              icon: "warning",
              title: l$4("editor.transclusion.not-available"),
              size: 70
            }
          ),
          l$4("editor.transclusion.not-available")
        ] }) : content ?? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Loading..." })
      ]
    }
  );
};
class TransclusionNode extends ei {
  static getType() {
    return "transclusion";
  }
  static clone(node) {
    return new TransclusionNode(
      node.__link,
      node.__getTransclusionContent,
      node.__key
    );
  }
  __link;
  __getTransclusionContent;
  constructor(link, getTransclusionContent, key) {
    super(key);
    this.__link = link;
    this.__getTransclusionContent = getTransclusionContent;
  }
  decorate() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Transclusion,
      {
        slug: this.__link.substring(1),
        getTransclusionContent: this.__getTransclusionContent
      }
    );
  }
  createDOM() {
    const div = document.createElement("div");
    div.classList.add("transclusion-wrapper");
    return div;
  }
  updateDOM() {
    return false;
  }
  static importJSON() {
    throw new Error("Method not implemented.");
  }
  exportJSON() {
    return super.exportJSON();
  }
  isInline() {
    return false;
  }
}
function $createTransclusionNode(link, getTransclusionContent) {
  return new TransclusionNode(link, getTransclusionContent);
}
function $isTransclusionNode(node) {
  return node instanceof TransclusionNode;
}

function createLinkMatcherWithRegExp(regExp, urlTransformer = (text) => text, attributes) {
  return (text) => {
    const match = regExp.exec(text);
    if (match === null) return null;
    return {
      attributes,
      index: match.index,
      length: match[0].length,
      text: match[0],
      url: urlTransformer(text)
    };
  };
}
function findFirstMatch(text, matchers) {
  for (let i = 0; i < matchers.length; i++) {
    const match = matchers[i](text);
    if (match) {
      return match;
    }
  }
  return null;
}
const SPACE = /\s/;
function isSeparator(char) {
  return SPACE.test(char);
}
function endsWithSeparator(textContent) {
  return isSeparator(textContent[textContent.length - 1]);
}
function startsWithSeparator(textContent) {
  return isSeparator(textContent[0]);
}
function isPreviousNodeValid(node) {
  let previousNode = node.getPreviousSibling();
  if (Gs(previousNode)) {
    previousNode = previousNode.getLastDescendant();
  }
  return previousNode === null || Nr(previousNode) || $r(previousNode) && endsWithSeparator(previousNode.getTextContent());
}
function isNextNodeValid(node) {
  let nextNode = node.getNextSibling();
  if (Gs(nextNode)) {
    nextNode = nextNode.getFirstDescendant();
  }
  return nextNode === null || Nr(nextNode) || $r(nextNode) && startsWithSeparator(nextNode.getTextContent()) || $isTransclusionNode(nextNode);
}
function isContentAroundIsValid(matchStart, matchEnd, text, node) {
  const contentBeforeIsValid = matchStart > 0 ? isSeparator(text[matchStart - 1]) : isPreviousNodeValid(node);
  if (!contentBeforeIsValid) {
    return false;
  }
  const contentAfterIsValid = matchEnd < text.length ? isSeparator(text[matchEnd]) : isNextNodeValid(node);
  return contentAfterIsValid;
}
function handleLinkCreation(node, matchers, onChange) {
  const nodeText = node.getTextContent();
  let text = nodeText;
  let invalidMatchEnd = 0;
  let remainingTextNode = node;
  let match;
  while ((match = findFirstMatch(text, matchers)) && match !== null) {
    const matchStart = match.index;
    const matchLength = match.length;
    const matchEnd = matchStart + matchLength;
    const isValid = isContentAroundIsValid(
      invalidMatchEnd + matchStart,
      invalidMatchEnd + matchEnd,
      nodeText,
      node
    );
    if (isValid) {
      let linkTextNode;
      if (invalidMatchEnd + matchStart === 0) {
        [linkTextNode, remainingTextNode] = remainingTextNode.splitText(
          invalidMatchEnd + matchLength
        );
      } else {
        [, linkTextNode, remainingTextNode] = remainingTextNode.splitText(
          invalidMatchEnd + matchStart,
          invalidMatchEnd + matchStart + matchLength
        );
      }
      const linkNode = f(match.url, match.attributes);
      const textNode = Vr(match.text);
      textNode.setFormat(linkTextNode.getFormat());
      textNode.setDetail(linkTextNode.getDetail());
      linkNode.append(textNode);
      linkTextNode.replace(linkNode);
      onChange(match.url, null);
      invalidMatchEnd = 0;
    } else {
      invalidMatchEnd += matchEnd;
    }
    text = text.substring(matchEnd);
  }
}
function handleLinkEdit(linkNode, matchers, onChange) {
  const children = linkNode.getChildren();
  const childrenLength = children.length;
  for (let i = 0; i < childrenLength; i++) {
    const child = children[i];
    if (!$r(child) || !child.isSimpleText()) {
      replaceWithChildren(linkNode);
      onChange(null, linkNode.getURL());
      return;
    }
  }
  const text = linkNode.getTextContent();
  const match = findFirstMatch(text, matchers);
  if (match === null || match.text !== text) {
    replaceWithChildren(linkNode);
    onChange(null, linkNode.getURL());
    return;
  }
  if (!isPreviousNodeValid(linkNode) || !isNextNodeValid(linkNode)) {
    replaceWithChildren(linkNode);
    onChange(null, linkNode.getURL());
    return;
  }
  const url = linkNode.getURL();
  if (url !== match.url) {
    linkNode.setURL(match.url);
    onChange(match.url, url);
  }
  if (match.attributes) {
    const rel = linkNode.getRel();
    if (rel !== match.attributes.rel) {
      linkNode.setRel(match.attributes.rel || null);
      onChange(match.attributes.rel || null, rel);
    }
    const target = linkNode.getTarget();
    if (target !== match.attributes.target) {
      linkNode.setTarget(match.attributes.target || null);
      onChange(match.attributes.target || null, target);
    }
  }
}
function handleBadNeighbors(textNode, matchers, onChange) {
  const previousSibling = textNode.getPreviousSibling();
  const nextSibling = textNode.getNextSibling();
  const text = textNode.getTextContent();
  if (p(previousSibling) && !startsWithSeparator(text)) {
    previousSibling.append(textNode);
    handleLinkEdit(previousSibling, matchers, onChange);
    onChange(null, previousSibling.getURL());
  }
  if (p(nextSibling) && !endsWithSeparator(text)) {
    replaceWithChildren(nextSibling);
    handleLinkEdit(nextSibling, matchers, onChange);
    onChange(null, nextSibling.getURL());
  }
}
function replaceWithChildren(node) {
  const children = node.getChildren();
  const childrenLength = children.length;
  for (let j = childrenLength - 1; j >= 0; j--) {
    node.insertAfter(children[j]);
  }
  node.remove();
  return children.map((child) => child.getLatest());
}
function useAutoLink(editor, matchers, onChange) {
  reactExports.useEffect(() => {
    if (!editor.hasNodes([h])) {
      throw new Error(
        "LexicalAutoLinkPlugin: AutoLinkNode not registered on editor"
      );
    }
    const onChangeWrapped = (url, prevUrl) => {
      if (onChange) {
        onChange(url, prevUrl);
      }
    };
    return b(
      editor.registerNodeTransform(Ar, (textNode) => {
        const parent = textNode.getParentOrThrow();
        const previous = textNode.getPreviousSibling();
        if (p(parent)) {
          handleLinkEdit(parent, matchers, onChangeWrapped);
        } else if (!c(parent)) {
          if (textNode.isSimpleText() && (startsWithSeparator(textNode.getTextContent()) || !p(previous))) {
            handleLinkCreation(textNode, matchers, onChangeWrapped);
          }
          handleBadNeighbors(textNode, matchers, onChangeWrapped);
        }
      }),
      /*
        We need a paragraph node transformer here for the following use case:
        Removing the space between "/1 /2". This whitespace removal would not
        trigger the above text node transform as it would just remove the
        text node between the two link nodes which stay untouched. But we need
        to unify these two link nodes into one: "/1/2". So let's check if there
        are two link nodes next to each other and remove one of them to trigger
        another transform.
      */
      editor.registerNodeTransform(ai, (paragraphNode) => {
        const children = paragraphNode.getChildren();
        for (let childrenIndex = 0; childrenIndex < children.length; childrenIndex++) {
          const child = children[childrenIndex];
          const nextChild = children[childrenIndex + 1];
          if (p(child) && p(nextChild)) {
            replaceWithChildren(child);
          }
        }
      })
    );
  }, [editor, matchers, onChange]);
}
function AutoLinkPlugin({
  matchers,
  onChange
}) {
  const [editor] = u$2();
  useAutoLink(editor, matchers, onChange);
  return null;
}

const URL_REGEX = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}(\.[a-zA-Z0-9()]{1,13})?\b([-a-zA-Z0-9()@:%_+.~#!?&//=,;']*)/;
const EMAIL_REGEX = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
const SLASHLINK_REGEX = /(@[\p{L}\p{M}\d\-_/]+)?(\/[\p{L}\p{M}\d\-_:.]+)+/u;
const MATCHERS = [
  createLinkMatcherWithRegExp(
    URL_REGEX,
    (text) => {
      return text.startsWith("http") ? text : `https://${text}`;
    },
    {
      rel: "noopener noreferrer"
    }
  ),
  createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => {
    return `mailto:${text}`;
  }),
  createLinkMatcherWithRegExp(SLASHLINK_REGEX, (text) => {
    return "#" + text.substring(1);
  })
];
function LexicalAutoLinkPlugin() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AutoLinkPlugin, { matchers: MATCHERS });
}

class WikiLinkContentNode extends Ar {
  constructor(text, getLinkAvailability) {
    super(text);
    this.getLinkAvailability = getLinkAvailability;
  }
  static getType() {
    return "wikiLinkContent";
  }
  static clone(node) {
    return new WikiLinkContentNode(node.__text, node.getLinkAvailability);
  }
  createDOM(config) {
    const element = super.createDOM(config);
    $(element, config.theme.wikiLinkContent);
    this.getLinkAvailability(this.__text).then((isAvailable) => {
      if (isAvailable) {
        element?.classList.add("available");
      } else {
        element?.classList.add("unavailable");
      }
    });
    return element;
  }
  updateDOM(prevNode, element, config) {
    super.updateDOM(prevNode, element, config);
    this.getLinkAvailability(this.__text).then((isAvailable) => {
      if (isAvailable) {
        element?.classList.add("available");
        element?.classList.remove("unavailable");
      } else {
        element?.classList.add("unavailable");
        element?.classList.remove("available");
      }
    });
    return false;
  }
  // Dummy function. This will never happen.
  static importJSON(serializedNode) {
    const node = $createWikiLinkContentNode(
      serializedNode.text,
      () => Promise.resolve(true)
    );
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }
  canInsertTextBefore() {
    return false;
  }
  isTextEntity() {
    return true;
  }
  isInline() {
    return true;
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "wikiLinkContent"
    };
  }
  isValid() {
    const text = this.__text;
    return text.length > 0 && !text.includes("[") && !text.includes("]");
  }
}
function $createWikiLinkContentNode(text = "", getLinkAvailability) {
  return en(
    new WikiLinkContentNode(text, getLinkAvailability)
  );
}
function $isWikiLinkContentNode(node) {
  return node instanceof WikiLinkContentNode;
}

class WikiLinkPunctuationNode extends Ar {
  static getType() {
    return "wikiLinkPunctuation";
  }
  static clone(node) {
    return new WikiLinkPunctuationNode(node.__isClosing);
  }
  __isClosing = false;
  constructor(isClosing) {
    super(isClosing ? "]]" : "[[");
    this.__isClosing = isClosing;
  }
  createDOM(config) {
    const element = super.createDOM(config);
    $(element, config.theme.wikiLinkPunctuation);
    return element;
  }
  static importJSON(serializedNode) {
    const node = $createWikiLinkPunctuationNode(serializedNode.__isClosing);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }
  canInsertTextBefore() {
    return false;
  }
  // This is important so that no unnecessary transformation loop is triggered.
  // Text inserted after this node (no matter if opening of closing) should be
  // put in a normal text node
  canInsertTextAfter() {
    return false;
  }
  isTextEntity() {
    return true;
  }
  isInline() {
    return true;
  }
  isValid() {
    return this.__isClosing && this.__text === "]]" || !this.__isClosing && this.__text === "[[";
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "wikiLinkPunctuation"
    };
  }
}
function $createWikiLinkPunctuationNode(isClosing) {
  return en(new WikiLinkPunctuationNode(isClosing));
}
function $isWikiLinkPunctuationNode(node) {
  return node instanceof WikiLinkPunctuationNode;
}

class KeyValuePairKeyNode extends Ar {
  static getType() {
    return "keyValuePairKey";
  }
  static clone(node) {
    return new KeyValuePairKeyNode(node.__text);
  }
  constructor(text) {
    super(text);
  }
  createDOM(config) {
    const element = super.createDOM(config);
    $(element, config.theme.keyValuePairKey);
    return element;
  }
  updateDOM(prevNode, element, config) {
    super.updateDOM(prevNode, element, config);
    return false;
  }
  // Dummy function. This will never happen.
  static importJSON() {
    return new KeyValuePairKeyNode("");
  }
  canInsertTextBefore() {
    return true;
  }
  isTextEntity() {
    return false;
  }
  isInline() {
    return true;
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "keyValuePairKey"
    };
  }
}
function $createKeyValuePairKeyNode(text = "") {
  return en(
    new KeyValuePairKeyNode(text)
  );
}
function $isKeyValuePairKeyNode(node) {
  return node instanceof KeyValuePairKeyNode;
}

class CodeBlockNode extends ai {
  static getType() {
    return ElementNodeType.CODE;
  }
  constructor() {
    super();
  }
  static clone() {
    return new CodeBlockNode();
  }
  createDOM(config) {
    const element = super.createDOM(config);
    $(element, config.theme.codeBlock);
    return element;
  }
  static importJSON() {
    throw new Error("Method not implemented.");
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.CODE
    };
  }
}
function $createCodeBlockNode() {
  return en(new CodeBlockNode());
}
function $isCodeBlockNode(node) {
  return node instanceof CodeBlockNode;
}

const REGEX$2 = /\[\[[^[\]]+\]\]/;
const getWikiLinkMatch = (text) => {
  const matchArr = REGEX$2.exec(text);
  if (matchArr === null) {
    return null;
  }
  const wikiLinkLength = matchArr[0].length;
  const startOffset = matchArr.index;
  const endOffset = startOffset + wikiLinkLength;
  return {
    end: endOffset,
    start: startOffset
  };
};
function registerWikilinkTransforms(editor, getLinkAvailability) {
  const replaceWithSimpleText = (node) => {
    const textNode = Vr(node.getTextContent());
    textNode.setFormat(node.getFormat());
    node.replace(textNode);
  };
  const textNodeTransform = (node) => {
    if (!node.isSimpleText()) {
      return;
    }
    if ($isCodeBlockNode(node.getParent())) {
      return;
    }
    if ($isKeyValuePairKeyNode(node)) return;
    let text = node.getTextContent();
    let currentNode = node;
    let match;
    while (true) {
      match = getWikiLinkMatch(text);
      const nextText = match === null ? "" : text.slice(match.end);
      text = nextText;
      if (match === null) {
        return;
      }
      let nodeToReplace;
      if (match.start === 0) {
        [nodeToReplace, currentNode] = currentNode.splitText(match.end);
      } else {
        [, nodeToReplace, currentNode] = currentNode.splitText(
          match.start,
          match.end
        );
      }
      const wikilinkTextContent = nodeToReplace.getTextContent().slice(
        2,
        nodeToReplace.getTextContent().length - 2
      );
      const replacementNode1 = $createWikiLinkPunctuationNode(false);
      const replacementNode2 = $createWikiLinkContentNode(
        wikilinkTextContent,
        getLinkAvailability
      );
      const replacementNode3 = $createWikiLinkPunctuationNode(true);
      nodeToReplace.insertAfter(replacementNode1);
      replacementNode1.insertAfter(replacementNode2);
      replacementNode2.insertAfter(replacementNode3);
      const selection = ms();
      let selectionOffset = NaN;
      if (ns(selection) && selection.focus.key === nodeToReplace.getKey()) {
        selectionOffset = selection.focus.offset;
      }
      nodeToReplace.remove();
      if (!isNaN(selectionOffset)) {
        if (selectionOffset < 3) {
          replacementNode1.select(selectionOffset, selectionOffset);
        } else if (selectionOffset > nodeToReplace.getTextContent().length - 2) {
          const newNodeOffset = selectionOffset - replacementNode2.getTextContent().length - 2;
          replacementNode3.select(newNodeOffset, newNodeOffset);
        } else {
          const newNodeOffset = selectionOffset - 2;
          replacementNode2.select(newNodeOffset, newNodeOffset);
        }
      }
    }
  };
  const reverseWikilinkContentNodeTransform = (node) => {
    if (!node.getParent()) return;
    if ($isKeyValuePairKeyNode(node)) return;
    const prevSibling = node.getPreviousSibling();
    const nextSibling = node.getNextSibling();
    if (!$isWikiLinkPunctuationNode(prevSibling) || !$isWikiLinkPunctuationNode(nextSibling) || !node.isValid() || !prevSibling.isValid() || !nextSibling.isValid() || $isCodeBlockNode(node.getParent())) {
      replaceWithSimpleText(node);
      $isWikiLinkPunctuationNode(prevSibling) && replaceWithSimpleText(prevSibling);
      $isWikiLinkPunctuationNode(nextSibling) && replaceWithSimpleText(nextSibling);
    }
  };
  const reverseWikilinkPunctuationNodeTransform = (node) => {
    if (!node.getParent()) return;
    if ($isKeyValuePairKeyNode(node)) return;
    const hasAccompanyingContentNode = node.__isClosing ? $isWikiLinkContentNode(node.getPreviousSibling()) : $isWikiLinkContentNode(node.getNextSibling());
    if (!node.isValid() || !hasAccompanyingContentNode) {
      replaceWithSimpleText(node);
    }
  };
  const removePlainTextTransform = editor.registerNodeTransform(
    Ar,
    textNodeTransform
  );
  const removeReverseWikilinkContentNodeTransform = editor.registerNodeTransform(
    WikiLinkContentNode,
    reverseWikilinkContentNodeTransform
  );
  const removeReverseWikilinkPunctuationNodeTransform = editor.registerNodeTransform(
    WikiLinkPunctuationNode,
    reverseWikilinkPunctuationNodeTransform
  );
  return [
    removePlainTextTransform,
    removeReverseWikilinkContentNodeTransform,
    removeReverseWikilinkPunctuationNodeTransform
  ];
}
function WikiLinkPlugin({
  getLinkAvailability
}) {
  const [editor] = u$2();
  reactExports.useEffect(() => {
    if (!editor.hasNodes([WikiLinkContentNode, WikiLinkPunctuationNode])) {
      throw new Error("WikiLinkPlugin: WikiLinkNodes not registered on editor");
    }
    return b(
      ...registerWikilinkTransforms(
        editor,
        getLinkAvailability
      )
    );
  }, [editor]);
  return null;
}

class BoldNode extends Ar {
  static getType() {
    return "bold";
  }
  static clone(node) {
    return new BoldNode(node.__text, node.__key);
  }
  constructor(text, key) {
    super(text, key);
  }
  createDOM(config) {
    const element = super.createDOM(config);
    $(element, config.theme.bold);
    return element;
  }
  static importJSON(serializedNode) {
    const node = $createBoldNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "bold"
    };
  }
  canInsertTextBefore() {
    return false;
  }
  isTextEntity() {
    return true;
  }
}
function $createBoldNode(text = "") {
  return en(new BoldNode(text));
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function d(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var x$1=d((function(t){const e=new URLSearchParams;e.append("code",t);for(let t=1;t<arguments.length;t++)e.append("v",arguments[t]);throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));function T(t,e,n,r){const s=t=>t instanceof n,u=t=>{const e=Vr(t.getTextContent());e.setFormat(t.getFormat()),t.replace(e);};return [t.registerNodeTransform(Ar,(t=>{if(!t.isSimpleText())return;let n,o=t.getPreviousSibling(),l=t.getTextContent(),f=t;if($r(o)){const n=o.getTextContent(),r=e(n+l);if(s(o)){if(null===r||0!==(t=>t.getLatest().__mode)(o))return void u(o);{const e=r.end-n.length;if(e>0){const r=n+l.slice(0,e);if(o.select(),o.setTextContent(r),e===l.length)t.remove();else {const n=l.slice(e);t.setTextContent(n);}return}}}else if(null===r||r.start<n.length)return}let c=0;for(;;){n=e(l);let t,g=null===n?"":l.slice(n.end);if(l=g,""===g){const t=f.getNextSibling();if($r(t)){g=f.getTextContent()+t.getTextContent();const n=e(g);if(null===n)return void(s(t)?u(t):t.markDirty());if(0!==n.start)return}}if(null===n)return;if(0===n.start&&$r(o)&&o.isTextEntity()){c+=n.end;continue}0===n.start?[t,f]=f.splitText(n.end):[,t,f]=f.splitText(n.start+c,n.end+c),void 0===t&&x$1(165,"nodeToReplace");const a=r(t);if(a.setFormat(t.getFormat()),t.replace(a),null==f)return;c=0,o=a;}})),t.registerNodeTransform(n,(t=>{const n=t.getTextContent(),r=e(n);if(null===r||0!==r.start)return void u(t);if(n.length>r.end)return void t.splitText(r.end);const o=t.getPreviousSibling();$r(o)&&o.isTextEntity()&&(u(o),u(t));const l=t.getNextSibling();$r(l)&&l.isTextEntity()&&(u(l),s(t)&&u(t));}))]}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function i(i,m,c){const[l]=u$2();reactExports.useEffect((()=>b(...T(l,i,m,c))),[c,l,i,m]);}

const REGEX$1 = /\*[^*]+\*/;
function BoldPlugin() {
  const [editor] = u$2();
  reactExports.useEffect(() => {
    if (!editor.hasNodes([BoldNode])) {
      throw new Error("BoldPlugin: BoldNode not registered on editor");
    }
  }, [editor]);
  const createBoldNode = reactExports.useCallback((textNode) => {
    return $createBoldNode(textNode.getTextContent());
  }, []);
  const getBoldMatch = reactExports.useCallback((text) => {
    const matchArr = REGEX$1.exec(text);
    if (matchArr === null) {
      return null;
    }
    const headingLength = matchArr[0].length;
    const startOffset = matchArr.index;
    const endOffset = startOffset + headingLength;
    return {
      end: endOffset,
      start: startOffset
    };
  }, []);
  i(
    getBoldMatch,
    BoldNode,
    createBoldNode
  );
  return null;
}

const transclusionsMatchSlashlinks = (slashlinks, transclusions) => {
  if (slashlinks.length !== transclusions.length) return false;
  for (let i = 0; i < slashlinks.length; i++) {
    if (slashlinks[i].getTextContent() !== transclusions[i].__link) {
      return false;
    }
  }
  return true;
};
const splitParagraphAtLineBreaks = (node) => {
  const selection = ms();
  let cursor = node;
  let startOffset = 0;
  let endOffset;
  node.getTextContent().split("\n").forEach((line, i) => {
    const paragraphNode = fi();
    const textNode = Vr(line);
    paragraphNode.append(textNode);
    cursor.insertAfter(paragraphNode);
    cursor = paragraphNode;
    endOffset = startOffset + line.length;
    if (ns(selection) && selection.focus.offset >= startOffset && selection.focus.offset <= endOffset) {
      paragraphNode.select(selection.focus.offset - startOffset);
    }
    startOffset = endOffset + i;
  });
  node.remove();
  cursor.selectEnd();
};
const refreshTransclusionsForBlock = (node, getTransclusionContent) => {
  if (node.getType() === ElementNodeType.PARAGRAPH && node.getTextContent().includes("\n")) {
    splitParagraphAtLineBreaks(node);
    return;
  }
  const slashlinks = [
    ElementNodeType.PARAGRAPH,
    ElementNodeType.LIST_ITEM,
    ElementNodeType.HEADING
  ].includes(node.getType()) ? node.getChildren().filter((child) => {
    return p(child) && (child.getTextContent().startsWith("/") || child.getTextContent().startsWith("@"));
  }) : [];
  const transclusions = node.getChildren().filter(
    (child) => {
      return $isTransclusionNode(child);
    }
  );
  if (transclusionsMatchSlashlinks(slashlinks, transclusions)) {
    return;
  }
  while ($isTransclusionNode(node.getLastChild())) {
    node.getLastChild()?.remove();
  }
  slashlinks.forEach((slashlinkNode) => {
    const transclusionNode = $createTransclusionNode(
      slashlinkNode.getTextContent(),
      getTransclusionContent
    );
    node.append(transclusionNode);
  });
};

class ListItemNode extends ai {
  static getType() {
    return ElementNodeType.LIST_ITEM;
  }
  static clone() {
    return new ListItemNode();
  }
  constructor() {
    super();
  }
  createDOM(config) {
    const element = super.createDOM(config);
    $(element, config.theme.listItem);
    return element;
  }
  static importJSON() {
    throw new Error("Method not implemented.");
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.LIST_ITEM
    };
  }
}
function $createListItemNode() {
  return en(new ListItemNode());
}

const registerBlockNodeTransform = (editor, getTransclusionContent) => {
  editor.registerNodeTransform(ai, (node) => {
    refreshTransclusionsForBlock(node, getTransclusionContent);
  });
  editor.registerNodeTransform(ListItemNode, (node) => {
    refreshTransclusionsForBlock(node, getTransclusionContent);
  });
  editor.registerNodeTransform(HeadingNode, (node) => {
    refreshTransclusionsForBlock(node, getTransclusionContent);
  });
  editor.registerNodeTransform(h, (node) => {
    let currentNode = node.getParent();
    while (currentNode && !di(currentNode)) {
      currentNode = currentNode.getParent();
    }
    currentNode && refreshTransclusionsForBlock(currentNode, getTransclusionContent);
  });
};
function TransclusionPlugin({
  getTransclusionContent
}) {
  const [editor] = u$2();
  reactExports.useEffect(() => {
    if (!editor.hasNodes([TransclusionNode])) {
      throw new Error("Transclusion plugin is missing required nodes");
    }
    return registerBlockNodeTransform(
      editor,
      getTransclusionContent
    );
  }, [editor]);
  return null;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function x(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}x((function(t){const e=new URLSearchParams;e.append("code",t);for(let t=1;t<arguments.length;t++)e.append("v",arguments[t]);throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));function N(t,e){const n=t.getData("text/plain")||t.getData("text/uri-list");null!=n&&e.insertRawText(n);}

const documentMode = "documentMode" in document ? document.documentMode : null;
const CAN_USE_BEFORE_INPUT = "InputEvent" in window && !documentMode ? "getTargetRanges" in new window.InputEvent("input") : false;
const IS_SAFARI = /Version\/[\d.]+.*Safari/.test(navigator.userAgent);
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const IS_CHROME = /^(?=.*Chrome).*/i.test(navigator.userAgent);
const IS_APPLE_WEBKIT = /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && !IS_CHROME;

function onCopyForPlainText(event, editor) {
  if (!event) return;
  editor.update(() => {
    const clipboardData = event instanceof KeyboardEvent ? null : event.clipboardData;
    const selection = ms();
    if (selection !== null && clipboardData !== null) {
      event.preventDefault();
      clipboardData.setData("text/plain", selection.getTextContent());
    }
  });
}
function onPasteForPlainText(event, editor) {
  event.preventDefault();
  editor.update(
    () => {
      const selection = ms();
      const clipboardData = event instanceof InputEvent || event instanceof KeyboardEvent ? null : event.clipboardData;
      if (clipboardData !== null && ns(selection)) {
        N(clipboardData, selection);
      }
    },
    {
      tag: "paste"
    }
  );
}
function onCutForPlainText(event, editor) {
  onCopyForPlainText(event, editor);
  editor.update(() => {
    const selection = ms();
    if (ns(selection)) {
      selection.removeText();
    }
  });
}
function registerSubtext(editor) {
  const removeListener = b(
    editor.registerCommand(
      s$1,
      (isBackward) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        selection.deleteCharacter(isBackward);
        return true;
      },
      hi
    ),
    editor.registerCommand(
      u$3,
      (isBackward) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        selection.deleteWord(isBackward);
        return true;
      },
      hi
    ),
    editor.registerCommand(
      f$2,
      (isBackward) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        selection.deleteLine(isBackward);
        return true;
      },
      hi
    ),
    editor.registerCommand(
      l$3,
      (eventOrText) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        if (typeof eventOrText === "string") {
          selection.insertText(eventOrText);
        } else {
          const dataTransfer = eventOrText.dataTransfer;
          if (dataTransfer !== null) {
            N(dataTransfer, selection);
          } else {
            const data = eventOrText.data;
            if (data) {
              selection.insertText(data);
            }
          }
        }
        return true;
      },
      hi
    ),
    editor.registerCommand(
      a$2,
      () => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        selection.removeText();
        return true;
      },
      hi
    ),
    editor.registerCommand(
      i$3,
      () => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        selection.insertParagraph();
        return true;
      },
      hi
    ),
    editor.registerCommand(
      W,
      () => {
        Me();
        return true;
      },
      hi
    ),
    editor.registerCommand(
      o$2,
      () => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        selection.insertParagraph();
        return true;
      },
      hi
    ),
    editor.registerCommand(
      m$4,
      (payload) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        const event = payload;
        const isHoldingShift = event.shiftKey;
        if (L$1(selection, true)) {
          event.preventDefault();
          H(selection, isHoldingShift, true);
          return true;
        }
        return false;
      },
      hi
    ),
    editor.registerCommand(
      p$3,
      (payload) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        const event = payload;
        const isHoldingShift = event.shiftKey;
        if (L$1(selection, false)) {
          event.preventDefault();
          H(selection, isHoldingShift, false);
          return true;
        }
        return false;
      },
      hi
    ),
    editor.registerCommand(
      S$1,
      (event) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        event.preventDefault();
        return editor.dispatchCommand(s$1, true);
      },
      hi
    ),
    editor.registerCommand(
      w,
      (event) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        event.preventDefault();
        return editor.dispatchCommand(s$1, false);
      },
      hi
    ),
    editor.registerCommand(
      C$1,
      (event) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        if (event !== null) {
          if ((IS_IOS || IS_SAFARI || IS_APPLE_WEBKIT) && CAN_USE_BEFORE_INPUT) {
            return false;
          }
          event.preventDefault();
        }
        return editor.dispatchCommand(i$3, false);
      },
      hi
    ),
    editor.registerCommand(
      M$2,
      (event) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        onCopyForPlainText(event, editor);
        return true;
      },
      hi
    ),
    editor.registerCommand(
      z,
      (event) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        onCutForPlainText(event, editor);
        return true;
      },
      hi
    ),
    editor.registerCommand(
      c$2,
      (event) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        onPasteForPlainText(event, editor);
        return true;
      },
      hi
    ),
    editor.registerCommand(
      F,
      (event) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        event.preventDefault();
        return true;
      },
      hi
    ),
    editor.registerCommand(
      I,
      (event) => {
        const selection = ms();
        if (!ns(selection)) {
          return false;
        }
        event.preventDefault();
        return true;
      },
      hi
    )
  );
  return removeListener;
}

function useSubtextSetup(editor) {
  reactExports.useLayoutEffect(() => {
    return b(
      registerSubtext(editor)
    );
  }, [editor]);
}

function useDecorators(editor, ErrorBoundary) {
  const [decorators, setDecorators] = reactExports.useState(
    () => editor.getDecorators()
  );
  reactExports.useLayoutEffect(() => {
    return editor.registerDecoratorListener((nextDecorators) => {
      reactDomExports.flushSync(() => {
        setDecorators(nextDecorators);
      });
    });
  }, [editor]);
  reactExports.useEffect(() => {
    setDecorators(editor.getDecorators());
  }, [editor]);
  return reactExports.useMemo(() => {
    const decoratedPortals = [];
    const decoratorKeys = Object.keys(decorators);
    for (let i = 0; i < decoratorKeys.length; i++) {
      const nodeKey = decoratorKeys[i];
      const reactDecorator = /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { onError: (e) => editor._onError(e), children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: decorators[nodeKey] }) });
      const element = editor.getElementByKey(nodeKey);
      if (element !== null) {
        decoratedPortals.push(reactDomExports.createPortal(reactDecorator, element, nodeKey));
      }
    }
    return decoratedPortals;
  }, [ErrorBoundary, decorators, editor]);
}

function SubtextPlugin({
  ErrorBoundary
}) {
  const [editor] = u$2();
  const decorators = useDecorators(editor, ErrorBoundary);
  useSubtextSetup(editor);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: decorators });
}

const getSubtextFromEditor = (root) => {
  return root.getChildren().map((paragraph) => paragraph.getTextContent()).join("\n");
};

class InlineCodeNode extends Ar {
  static getType() {
    return "inline-code";
  }
  static clone(node) {
    return new InlineCodeNode(node.__text, node.__key);
  }
  constructor(text, key) {
    super(text, key);
  }
  createDOM(config) {
    const element = super.createDOM(config);
    $(element, config.theme.inlineCode);
    return element;
  }
  static importJSON(serializedNode) {
    const node = $createInlineCodeNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "inline-code"
    };
  }
  canInsertTextBefore() {
    return false;
  }
  isTextEntity() {
    return true;
  }
}
function $createInlineCodeNode(text = "") {
  return en(new InlineCodeNode(text));
}

const REGEX = /`[^`]+`/;
function InlineCodePlugin() {
  const [editor] = u$2();
  reactExports.useEffect(() => {
    if (!editor.hasNodes([InlineCodeNode])) {
      throw new Error(
        "InlineCodePlugin: InlineCodeNode not registered on editor"
      );
    }
  }, [editor]);
  const createInlineCodeNode = reactExports.useCallback(
    (textNode) => {
      return $createInlineCodeNode(textNode.getTextContent());
    },
    []
  );
  const getInlineCodeMatch = reactExports.useCallback((text) => {
    const matchArr = REGEX.exec(text);
    if (matchArr === null) {
      return null;
    }
    const headingLength = matchArr[0].length;
    const startOffset = matchArr.index;
    const endOffset = startOffset + headingLength;
    return {
      end: endOffset,
      start: startOffset
    };
  }, []);
  i(
    getInlineCodeMatch,
    InlineCodeNode,
    createInlineCodeNode
  );
  return null;
}

class QuoteBlockNode extends ai {
  static getType() {
    return ElementNodeType.QUOTE;
  }
  constructor() {
    super();
  }
  static clone() {
    return new QuoteBlockNode();
  }
  createDOM(config) {
    const element = super.createDOM(config);
    $(element, config.theme.quoteBlock);
    return element;
  }
  static importJSON() {
    throw new Error("Method not implemented.");
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.QUOTE
    };
  }
}
function $createQuoteBlockNode() {
  return en(new QuoteBlockNode());
}

class KeyValueNode extends ai {
  static getType() {
    return ElementNodeType.KEY_VALUE_NODE;
  }
  static clone() {
    return new KeyValueNode();
  }
  constructor() {
    super();
  }
  createDOM(config) {
    const element = super.createDOM(config);
    $(element, config.theme.keyValue);
    return element;
  }
  static importJSON() {
    throw new Error("Method not implemented.");
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.KEY_VALUE_NODE
    };
  }
}
function $createKeyValueNode() {
  return en(new KeyValueNode());
}
function $isKeyValueNode(node) {
  return node instanceof KeyValueNode;
}

const assignCorrectElementNodes = (elementNodes) => {
  const typeNodeShouldHaveMap = /* @__PURE__ */ new Map();
  let insideCodeBlock = false;
  for (const node of elementNodes) {
    const nodeText = node.getTextContent();
    if (!insideCodeBlock) {
      if (nodeText.startsWith("```")) {
        typeNodeShouldHaveMap.set(node, ElementNodeType.CODE);
        insideCodeBlock = true;
      } else if (nodeText.startsWith(">")) {
        typeNodeShouldHaveMap.set(node, ElementNodeType.QUOTE);
      } else if (nodeText.startsWith("#")) {
        typeNodeShouldHaveMap.set(node, ElementNodeType.HEADING);
      } else if (nodeText.startsWith("-")) {
        typeNodeShouldHaveMap.set(node, ElementNodeType.LIST_ITEM);
      } else if (/\$[\p{L}\p{M}\d\-_]+(\s(.*)?)?$/gu.test(nodeText)) {
        typeNodeShouldHaveMap.set(node, ElementNodeType.KEY_VALUE_NODE);
      } else {
        typeNodeShouldHaveMap.set(node, ElementNodeType.PARAGRAPH);
      }
    } else {
      if (nodeText.trimEnd() === "```") {
        typeNodeShouldHaveMap.set(node, ElementNodeType.CODE);
        insideCodeBlock = false;
      } else {
        typeNodeShouldHaveMap.set(node, ElementNodeType.CODE);
      }
    }
  }
  elementNodes.forEach((elementNode) => {
    const currentNodeType = elementNode.getType();
    const typeNodeShouldHave = typeNodeShouldHaveMap.get(elementNode);
    if (currentNodeType !== typeNodeShouldHave) {
      if (typeNodeShouldHave === ElementNodeType.PARAGRAPH) {
        elementNode.replace(fi(), true);
      } else if (typeNodeShouldHave === ElementNodeType.CODE) {
        elementNode.replace($createCodeBlockNode(), true);
      } else if (typeNodeShouldHave === ElementNodeType.QUOTE) {
        elementNode.replace($createQuoteBlockNode(), true);
      } else if (typeNodeShouldHave === ElementNodeType.HEADING) {
        elementNode.replace($createHeadingNode(), true);
      } else if (typeNodeShouldHave === ElementNodeType.LIST_ITEM) {
        elementNode.replace($createListItemNode(), true);
      } else if (typeNodeShouldHave === ElementNodeType.KEY_VALUE_NODE) {
        elementNode.replace($createKeyValueNode(), true);
      } else {
        throw new Error("Unknown node type: " + typeNodeShouldHave);
      }
    }
  });
};
function BlockTransformPlugin() {
  const [editor] = u$2();
  reactExports.useEffect(() => {
    editor.registerNodeTransform(ri, (root) => {
      assignCorrectElementNodes(root.getChildren());
      ue(null);
    });
    editor.registerNodeTransform(Sr, (node) => {
      const element = node.getParent();
      if (si(element)) {
        return;
      }
      const prevSiblings = node.getPreviousSiblings();
      const nextSiblings = node.getNextSiblings();
      const n1 = fi();
      n1.append(...prevSiblings);
      const n2 = fi();
      n2.append(...nextSiblings);
      element.replace(n1, false);
      n1.insertAfter(n2);
      element.remove();
    });
  }, [editor]);
  return null;
}

var LinkType = /* @__PURE__ */ ((LinkType2) => {
  LinkType2["SLASHLINK"] = "SLASHLINK";
  LinkType2["WIKILINK"] = "WIKILINK";
  return LinkType2;
})(LinkType || {});

var UserRequestType = /* @__PURE__ */ ((UserRequestType2) => {
  UserRequestType2["HYPERLINK"] = "HYPERLINK";
  UserRequestType2["WIKILINK"] = "WIKILINK";
  UserRequestType2["SLASHLINK"] = "SLASHLINK";
  UserRequestType2["TRANSCLUSION_TARGET"] = "TRANSCLUSION_TARGET";
  return UserRequestType2;
})(UserRequestType || {});

const setSubtext = (root, text) => {
  root.clear();
  const blocks = text.split("\n");
  blocks.forEach((blockText) => {
    const blockNode = fi();
    const textNode = Vr(blockText);
    textNode.markDirty();
    blockNode.append(textNode);
    root.append(blockNode);
  });
};

const PlainTextStateExchangePlugin = ({
  initialText,
  instanceId
}) => {
  const [editor] = u$2();
  const currentInstanceIdRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    editor.update(() => {
      const root = ye();
      if (currentInstanceIdRef.current !== instanceId) {
        setSubtext(root, initialText);
        editor.dispatchCommand(R, void 0);
        root.getFirstChild()?.selectStart();
        editor.focus();
      }
      currentInstanceIdRef.current = instanceId;
    });
  }, [editor, initialText, instanceId]);
  return null;
};

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  hashtag: "hashtag",
  link: "link",
  sHeading: "s-heading",
  // "heading" seems to be a reserved word
  wikiLinkPunctuation: "wikilink-punctuation",
  wikiLinkContent: "wikilink-content",
  bold: "bold",
  subtext: "subtext",
  inlineCode: "inline-code",
  codeBlock: "code-block",
  quoteBlock: "quote-block",
  listItem: "list-item",
  keyValue: "key-value",
  keyValuePairKey: "key-value-key"
};

function AutoFocusPlugin() {
  const [editor] = u$2();
  reactExports.useEffect(() => {
    editor.focus();
  }, [editor]);
  return null;
}

const highlightHeadingSigils = () => {
  const headingElements = document.querySelectorAll(
    "div[data-lexical-editor] .s-heading"
  );
  const ranges = [];
  Array.from(headingElements).forEach((element) => {
    const span = element.children[0];
    const textNode = span.childNodes[0];
    const range = new Range();
    range.setStart(textNode, 0);
    range.setEnd(textNode, 1);
    ranges.push(range);
  });
  const highlight = new Highlight(...ranges);
  CSS.highlights.set("heading-block-sigil", highlight);
};

const getKeyMatchInLine = (text) => {
  const REGEX = /[\p{L}\p{M}\d\-_]+/gu;
  const matchArr = REGEX.exec(text);
  if (matchArr === null) {
    return null;
  }
  if (text[0] !== "$") return null;
  const keyLength = matchArr[0].length;
  const startOffset = 1;
  const endOffset = startOffset + keyLength;
  return {
    end: endOffset,
    start: startOffset
  };
};
const getKeyMatchAtTextStart = (text) => {
  const REGEX = /^[\p{L}\p{M}\d\-_]+/gu;
  const matchArr = REGEX.exec(text);
  if (matchArr === null) {
    return null;
  }
  const keyLength = matchArr[0].length;
  const startOffset = 0;
  const endOffset = startOffset + keyLength;
  return {
    end: endOffset,
    start: startOffset
  };
};
function registerTransforms(editor) {
  const replaceWithSimpleText = (node) => {
    const textNode = Vr(node.getTextContent());
    textNode.setFormat(node.getFormat());
    node.replace(textNode);
  };
  const textNodeToKeyTransform = (node) => {
    if (!node.isSimpleText()) {
      return;
    }
    if (!$isKeyValueNode(node.getParent())) {
      return;
    }
    const textContent = node.getTextContent();
    const previousSibling = node.getPreviousSibling();
    if (!previousSibling && textContent.startsWith("$")) {
      const match = getKeyMatchInLine(textContent);
      if (!match) return;
      const [, nodeToReplace] = node.splitText(
        match.start,
        match.end
      );
      const keyNode = $createKeyValuePairKeyNode(
        nodeToReplace.getTextContent()
      );
      nodeToReplace.replace(keyNode);
    } else if ($isKeyValuePairKeyNode(previousSibling)) {
      const match = getKeyMatchAtTextStart(textContent);
      if (match) {
        const [nodeToBeCombined] = node.splitText(
          match.end
        );
        const kvNode = $createKeyValuePairKeyNode(
          nodeToBeCombined.getTextContent()
        );
        nodeToBeCombined.replace(kvNode);
      }
    }
  };
  const keyToTextNodeTransform = (node) => {
    const parent = node.getParent();
    if (!parent) return;
    const textContent = node.getTextContent();
    if (!$isKeyValueNode(parent) || !/^[\p{L}\p{M}\d\-_]+$/gu.test(textContent)) {
      replaceWithSimpleText(node);
    }
  };
  const combineKeyNodeTransform = (leftNode) => {
    const parent = leftNode.getParent();
    if (!parent) return;
    const rightNode = leftNode.getNextSibling();
    if ($isKeyValueNode(parent) && $isKeyValuePairKeyNode(rightNode)) {
      const leftNodeTextContent = leftNode.getTextContent();
      const combinedNode = $createKeyValuePairKeyNode(
        leftNodeTextContent + rightNode.getTextContent()
      );
      leftNode.replace(combinedNode);
      const selection = ms();
      let selectionOffset = NaN;
      if (ns(selection) && selection.focus.key === rightNode.getKey()) {
        selectionOffset = selection.focus.offset;
      }
      rightNode.remove();
      if (!isNaN(selectionOffset)) {
        combinedNode.select(
          leftNodeTextContent.length + selectionOffset,
          leftNodeTextContent.length + selectionOffset
        );
      }
      return;
    }
  };
  const removeTextNodeToKeyTransform = editor.registerNodeTransform(
    Ar,
    textNodeToKeyTransform
  );
  const removeKeyToTextNodeTransform = editor.registerNodeTransform(
    KeyValuePairKeyNode,
    keyToTextNodeTransform
  );
  const removeCombineKeyNodeTransform = editor.registerNodeTransform(
    KeyValuePairKeyNode,
    combineKeyNodeTransform
  );
  return [
    removeTextNodeToKeyTransform,
    removeKeyToTextNodeTransform,
    removeCombineKeyNodeTransform
  ];
}
function KeyValuePlugin() {
  const [editor] = u$2();
  reactExports.useEffect(() => {
    if (!editor.hasNodes([KeyValueNode, KeyValuePairKeyNode])) {
      throw new Error("KeyValuePlugin: Nodes not registered on editor");
    }
    return b(
      ...registerTransforms(
        editor
      )
    );
  }, [editor]);
  return null;
}

const Editor = ({
  initialText,
  instanceId,
  onChange,
  onUserRequest,
  getTransclusionContent,
  getLinkAvailability
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(n$1, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SubtextPlugin,
      {
        ErrorBoundary: a$1
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlainTextStateExchangePlugin,
      {
        initialText,
        instanceId
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(i$1, { onChange: (editorState) => {
      editorState.read(() => {
        highlightHeadingSigils();
        const root = ye();
        onChange(getSubtextFromEditor(root));
      });
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(c$1, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AutoFocusPlugin, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BoldPlugin, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InlineCodePlugin, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(KeyValuePlugin, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LexicalAutoLinkPlugin, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WikiLinkPlugin, { getLinkAvailability: (linkText) => {
      return getLinkAvailability(linkText, LinkType.WIKILINK);
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TransclusionPlugin,
      {
        getTransclusionContent
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BlockTransformPlugin, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      l$1,
      {
        nodeType: h,
        eventType: "click",
        eventListener: (e) => {
          const isSlashlink = (str) => {
            return str.startsWith("@") || str.startsWith("/");
          };
          if (!(e && e.target)) return;
          const link = e.target.innerText;
          if (isSlashlink(link)) {
            onUserRequest(UserRequestType.SLASHLINK, link.substring(1));
          } else {
            onUserRequest(UserRequestType.HYPERLINK, link);
          }
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      l$1,
      {
        nodeType: WikiLinkContentNode,
        eventType: "click",
        eventListener: (e) => {
          if (!(e && e.target)) return;
          const link = e.target.innerText;
          onUserRequest(UserRequestType.WIKILINK, link);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      l$1,
      {
        nodeType: TransclusionNode,
        eventType: "click",
        eventListener: (e) => {
          if (!(e && e.target)) return;
          let cursorElement = e.target;
          do {
            if ("transclusionId" in cursorElement.dataset) {
              const transclusionId = cursorElement.dataset.transclusionId;
              onUserRequest(
                UserRequestType.TRANSCLUSION_TARGET,
                transclusionId
              );
              return;
            }
            cursorElement = cursorElement.parentElement;
          } while (cursorElement);
        }
      }
    )
  ] });
};
const Context = ({
  children
}) => {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError: (error) => {
      console.error(error);
    },
    nodes: [
      h,
      HeadingNode,
      WikiLinkContentNode,
      WikiLinkPunctuationNode,
      BoldNode,
      TransclusionNode,
      InlineCodeNode,
      CodeBlockNode,
      QuoteBlockNode,
      ListItemNode,
      KeyValueNode,
      KeyValuePairKeyNode
    ]
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(p$2, { initialConfig, children });
};

const NoteStatsFileLink = ({
  file
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: getAppPath(PathTemplate.FILE, /* @__PURE__ */ new Map([
        ["GRAPH_ID", LOCAL_GRAPH_ID],
        ["FILE_SLUG", file.slug]
      ])),
      children: file.slug
    },
    "note-stats-link-" + file.slug
  );
};

const NoteStats = ({
  note
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      id: "stats",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: l$4("editor.stats.heading") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "data-table", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("editor.stats.slug") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.slug })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("editor.stats.created-at") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.createdAt === void 0 ? l$4("editor.stats.unknown") : ISOTimestampToLocaleString(note.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("editor.stats.updated-at") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.updatedAt === void 0 ? l$4("editor.stats.unknown") : ISOTimestampToLocaleString(note.updatedAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("editor.stats.number-of-blocks") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.numberOfBlocks })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("editor.stats.number-of-lines") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.initialContent.split("\n").length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("editor.stats.number-of-outgoing-links") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.outgoingLinks.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("editor.stats.number-of-backlinks") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.backlinks.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("editor.stats.number-of-characters") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.numberOfCharacters })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("editor.stats.files") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.files.length > 0 ? note.files.map((file, i, array) => {
              const fileType = getMediaTypeFromFilename(file.slug);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                reactExports.Fragment,
                {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      NoteStatsFileLink,
                      {
                        file
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
                    "(",
                    fileType,
                    ", ",
                    humanFileSize(file.size),
                    ")",
                    i < array.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}) : null
                  ]
                },
                "nsfwt_" + file.slug + note.slug
              );
            }) : l$4("editor.stats.files.none") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("editor.stats.flags") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: note.flags.length > 0 ? note.flags.join(", ") : l$4("editor.stats.flags.none") })
          ] })
        ] }) })
      ]
    }
  );
};

const NotesProviderContext = reactExports.createContext(
  null
);

const useNotesProvider = () => {
  const notesProviderContext = reactExports.useContext(NotesProviderContext);
  if (!notesProviderContext) {
    throw new Error("NotesProviderContext is not initialized");
  }
  return notesProviderContext;
};

const NoteControls = ({
  activeNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  setUnsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  handleUploadFilesRequest,
  importNote,
  disableNoteSaving,
  handleNoteExportRequest
}) => {
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const confirm = useConfirm();
  const goToNote = useGoToNote();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    isSmallScreen ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_list",
        title: l$4("editor.go-to-list"),
        icon: "list",
        onClick: async () => {
          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }
          navigate(getAppPath(
            PathTemplate.LIST,
            /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
          ));
        }
      }
    ) : null,
    !isSmallScreen ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        IconButton,
        {
          id: "button_new",
          title: l$4("editor.new-note"),
          icon: "add",
          onClick: async () => {
            if (unsavedChanges) {
              await confirmDiscardingUnsavedChanges();
              setUnsavedChanges(false);
            }
            goToNote("new");
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        IconButton,
        {
          id: "button_create-linked-note",
          disabled: activeNote.isUnsaved,
          title: l$4("editor.create-linked-note"),
          icon: "add_circle",
          onClick: async () => {
            if (activeNote.isUnsaved) return;
            if (unsavedChanges) {
              await confirmDiscardingUnsavedChanges();
              setUnsavedChanges(false);
            }
            goToNote("new", {
              contentIfNewNote: getWikilinkForNote(
                activeNote.slug,
                getNoteTitle(activeNote.initialContent)
              )
            });
          }
        }
      )
    ] }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_upload",
        title: l$4("editor.save-note"),
        icon: "save",
        disabled: disableNoteSaving,
        onClick: handleNoteSaveRequest
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_remove",
        disabled: activeNote.isUnsaved,
        title: l$4("editor.remove-note"),
        icon: "delete",
        onClick: async () => {
          await confirm({
            text: l$4("editor.remove-note.confirm.text"),
            confirmText: l$4("editor.remove-note.confirm.confirm"),
            cancelText: l$4("dialog.cancel"),
            encourageConfirmation: false
          });
          removeActiveNote();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_duplicate",
        disabled: activeNote.isUnsaved,
        title: l$4("editor.duplicate-note"),
        icon: "content_copy",
        onClick: () => duplicateNote()
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_pin",
        disabled: activeNote.isUnsaved,
        title: l$4("editor.pin-note"),
        icon: "push_pin",
        onClick: () => {
          if (activeNote.isUnsaved) return;
          pinOrUnpinNote(activeNote.slug);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_import-note",
        disabled: !activeNote.isUnsaved,
        title: l$4("editor.import-note"),
        icon: "file_upload",
        onClick: async () => {
          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
          }
          importNote();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_export-note",
        disabled: false,
        title: l$4("editor.export-note"),
        icon: "file_download",
        onClick: () => handleNoteExportRequest()
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_upload-file",
        disabled: false,
        title: l$4("editor.upload-file"),
        icon: "upload_file",
        onClick: () => handleUploadFilesRequest()
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IconButton,
      {
        id: "button_random-note",
        disabled: false,
        title: l$4("editor.open-random-note"),
        icon: "question_mark",
        onClick: async () => {
          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }
          goToNote("random");
        }
      }
    )
  ] });
};

const StatusIndicatorItem = ({
  isActive,
  title,
  icon
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Icon$1,
    {
      icon,
      title,
      size: 24
    }
  ) : "" });
};

const StatusIndicator = ({
  isNew,
  hasUnsavedChanges,
  isEverythingSaved,
  isUploading
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StatusIndicatorItem,
      {
        isActive: isNew,
        title: l$4("editor.note-has-not-been-saved-yet"),
        icon: "fiber_new"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StatusIndicatorItem,
      {
        isActive: hasUnsavedChanges,
        title: l$4("editor.unsaved-changes"),
        icon: "stream"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StatusIndicatorItem,
      {
        isActive: isEverythingSaved,
        title: l$4("editor.no-unsaved-changes"),
        icon: "done"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StatusIndicatorItem,
      {
        isActive: isUploading,
        title: l$4("editor.upload-in-progress"),
        icon: "file_upload"
      }
    )
  ] });
};

const NoteMenuBar = ({
  activeNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  setUnsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  handleUploadFilesRequest,
  uploadInProgress,
  importNote,
  disableNoteSaving,
  handleNoteExportRequest
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "note-controls", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "note-controls-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteControls,
      {
        activeNote,
        handleNoteSaveRequest,
        removeActiveNote,
        unsavedChanges,
        setUnsavedChanges,
        pinOrUnpinNote,
        duplicateNote,
        handleUploadFilesRequest,
        importNote,
        disableNoteSaving,
        handleNoteExportRequest
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "note-controls-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      StatusIndicator,
      {
        isNew: activeNote.isUnsaved,
        hasUnsavedChanges: unsavedChanges,
        isEverythingSaved: !unsavedChanges,
        isUploading: uploadInProgress
      }
    ) })
  ] });
};

const NoteListItemLinkedNotesIndicator = ({
  isActive,
  numberOfLinkedNotes,
  onLinkIndicatorClick,
  isLinkable
}) => {
  const linkControlLabel = !isLinkable && typeof numberOfLinkedNotes === "number" ? l$4("list.item.links.linked-to-x-notes", {
    numberOfLinkedNotes: numberOfLinkedNotes.toString()
  }) : isActive ? l$4("list.item.links.currently-selected") : l$4("list.item.links.link");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      className: "note-list-item-linked-notes-indicator " + (isLinkable ? "linkable" : "not-linkable"),
      onClick: (e) => {
        onLinkIndicatorClick?.();
        e.stopPropagation();
      },
      title: linkControlLabel,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "note-list-item-linked-notes-indicator-content",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: getIconSrc("link"),
                alt: linkControlLabel,
                className: "svg-icon"
              }
            ),
            typeof numberOfLinkedNotes === "number" && !isNaN(numberOfLinkedNotes) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "linked-notes-indicator-number",
                children: numberOfLinkedNotes > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: numberOfLinkedNotes }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    title: l$4("list.item.links.not-linked"),
                    className: "unlinked-note-indicator"
                  }
                )
              }
            ) : ""
          ]
        }
      )
    }
  );
};

const ICON_SIZE = 15;
const NoteListItemFeatures = ({
  features
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "note-features",
      children: [
        features.containsWeblink ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "public",
            title: l$4("list.item.features.contains-links"),
            size: ICON_SIZE
          }
        ) : null,
        features.containsCode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "code",
            title: l$4("list.item.features.contains-code"),
            size: ICON_SIZE
          }
        ) : null,
        features.containsImages ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "image",
            title: l$4("list.item.features.contains-images"),
            size: ICON_SIZE
          }
        ) : null,
        features.containsDocuments ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "note",
            title: l$4("list.item.features.contains-documents"),
            size: ICON_SIZE
          }
        ) : null,
        features.containsAudio ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "headphones",
            title: l$4("list.item.features.contains-audio"),
            size: ICON_SIZE
          }
        ) : null,
        features.containsVideo ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "movie",
            title: l$4("list.item.features.contains-video"),
            size: ICON_SIZE
          }
        ) : null
      ]
    }
  );
};

const NoteListItemInfo = ({
  note
}) => {
  const sections = [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "slug", children: [
      "/",
      note.slug
    ] }, "nli-" + note.slug)
  ];
  if (typeof note.updatedAt === "string") {
    sections.push(
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(note.updatedAt).toLocaleDateString() })
    );
  }
  if ("numberOfFiles" in note) {
    if (note.numberOfFiles > 0) {
      sections.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: l$4(
          note.numberOfFiles > 1 ? "list.item.files" : "list.item.file",
          { files: note.numberOfFiles.toString() }
        ) })
      );
    }
    if (Object.values(note.features).some((val) => val === true)) {
      sections.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NoteListItemFeatures,
          {
            features: note.features
          }
        )
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "note-list-item-info",
      children: sections.map((section, i, sections2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        reactExports.Fragment,
        {
          children: [
            section,
            i < sections2.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "separator",
                children: SPAN_SEPARATOR
              }
            )
          ]
        },
        "nlii_" + i
      ))
    }
  );
};

const NoteListItem = ({
  note,
  isActive,
  isSelected,
  isLinked,
  onSelect,
  onLinkIndicatorClick,
  isLinkable
}) => {
  const trClassList = ["note-list-item"];
  if (isActive) {
    trClassList.push("active");
  }
  if (isLinked) {
    trClassList.push("linked");
  }
  if (isSelected) {
    trClassList.push("selected");
  }
  trClassList.push(isLinkable ? "linkable" : "not-linkable");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: trClassList.join(" "),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "note-list-item-main with-link-edge",
            onClick: () => onSelect(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "title",
                  children: note.title || l$4("list.untitled-note")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(NoteListItemInfo, { note })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NoteListItemLinkedNotesIndicator,
          {
            isLinkable,
            isActive,
            numberOfLinkedNotes: "linkCount" in note ? note.linkCount.sum : null,
            onLinkIndicatorClick
          }
        )
      ]
    }
  );
};

const NoteBacklinks = ({
  note,
  setUnsavedChanges,
  unsavedChanges,
  onLinkIndicatorClick
}) => {
  const goToNote = useGoToNote();
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  if (!("backlinks" in note)) return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "note-backlinks-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: l$4(
      "editor.backlinks",
      { backlinks: note.backlinks.length.toString() }
    ) }),
    note.backlinks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "note-meta-paragraph",
        children: l$4("editor.no-backlinks-yet")
      }
    ) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "note-backlinks", children: note.backlinks.sort(
      (a, b) => getCompareKeyForTimestamp(b.updatedAt) - getCompareKeyForTimestamp(a.updatedAt)
    ).map((displayedLinkedNote) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteListItem,
      {
        note: displayedLinkedNote,
        onSelect: async () => {
          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }
          goToNote(displayedLinkedNote.slug);
        },
        isActive: false,
        isLinked: true,
        isSelected: false,
        isLinkable: true,
        onLinkIndicatorClick: () => {
          onLinkIndicatorClick(
            displayedLinkedNote.slug,
            displayedLinkedNote.title
          );
        }
      },
      "note-link-list-item-" + displayedLinkedNote.slug
    )) })
  ] });
};

const NoteSlugUpdateReferencesToggle = ({
  isActivated,
  setIsActivated
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "update-references-toggle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "switch", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "checkbox",
          checked: isActivated,
          onChange: (e) => setIsActivated(e.target.checked)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "slider round" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "update-references-toggle-text", children: l$4("note.slug.update-references") })
  ] });
};

const NoteSlug = ({
  note,
  slugInput,
  setSlugInput,
  displayedSlugAliases,
  setDisplayedSlugAliases,
  setUnsavedChanges,
  updateReferences,
  setUpdateReferences
}) => {
  const handleNewAliasRequest = () => {
    const newDisplayedSlugAliases = [...displayedSlugAliases];
    newDisplayedSlugAliases.push("");
    setDisplayedSlugAliases(newDisplayedSlugAliases);
  };
  useKeyboardShortcuts({
    onCmdU: handleNewAliasRequest
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "slug-lines", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "slug-line canonical", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: "slug",
          className: "note-slug " + (!NotesProvider.isValidNoteSlugOrEmpty(slugInput) ? "invalid" : ""),
          onInput: (e) => {
            const element = e.currentTarget;
            const newValue = element.value.replace(
              // In the input field, we also allow \p{SK} modifiers, as
              // they are used to create a full letter with modifier in a
              // second step. They are not valid slug characters on their own,
              // though.
              // We also allow apostrophes ('), as they might be used as a
              // dead key for letters like é.
              // Unfortunately, it seems like we cannot simulate pressing
              // dead keys in Playwright currently, so we cannot
              // add a meaningful test for this.
              /[^\p{L}\p{Sk}\d\-/._']/gu,
              ""
            ).toLowerCase();
            setSlugInput(newValue);
            setUnsavedChanges(true);
          },
          value: slugInput,
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              document.querySelector(
                "div[data-lexical-editor]"
              )?.focus();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              setSlugInput("slug" in note ? note.slug : "");
            }
          }
        }
      ),
      !NotesProvider.isValidNoteSlugOrEmpty(slugInput) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "note-slug-validation-error", children: l$4("note.slug.invalid-slug").toLocaleUpperCase() }) : "",
      "slug" in note && note.slug !== slugInput && NotesProvider.isValidSlug(slugInput) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteSlugUpdateReferencesToggle,
        {
          isActivated: updateReferences,
          setIsActivated: (val) => {
            setUpdateReferences(val);
          }
        }
      ) : "",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "alias-control-button",
          onClick: handleNewAliasRequest,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Icon$1,
            {
              icon: "add",
              title: "Add alias",
              size: 20
            }
          )
        }
      )
    ] }),
    displayedSlugAliases.map((slugAlias, index, aliases) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "slug-line canonical",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "alias",
                className: "note-slug " + (!NotesProvider.isValidNoteSlugOrEmpty(slugInput) ? "invalid" : ""),
                onInput: (e) => {
                  const element = e.currentTarget;
                  const newValue = element.value.replace(
                    // In the input field, we also allow \p{SK} modifiers, as
                    // they are used to create a full letter with modifier in a
                    // second step. They are not valid slug characters on its own,
                    // though.
                    // We also allow apostrophes ('), as they might be used as a
                    // dead key for letters like é.
                    // Unfortunately, it seems like we cannot simulate pressing
                    // dead keys in Playwright currently, so we cannot
                    // add a meaningful test for this.
                    /[^\p{L}\p{Sk}\d\-/._']/gu,
                    ""
                  ).toLowerCase();
                  const newDisplayedSlugAliases = [...displayedSlugAliases];
                  newDisplayedSlugAliases[index] = newValue;
                  setDisplayedSlugAliases(newDisplayedSlugAliases);
                  setUnsavedChanges(true);
                },
                value: slugAlias,
                autoFocus: (
                  /*
                    If this input field is the result of a user request to create
                    a new alias (field is empty and the last one), focus it.
                  */
                  slugAlias === "" && index === aliases.length - 1
                ),
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    document.querySelector(
                      "div[data-lexical-editor]"
                    )?.focus();
                  }
                  if (e.key === "Escape") {
                    e.preventDefault();
                    const newDisplayedSlugAliases = Array.from(displayedSlugAliases).splice(index, 1);
                    setDisplayedSlugAliases(newDisplayedSlugAliases);
                  }
                }
              }
            ),
            !NotesProvider.isValidNoteSlugOrEmpty(slugAlias) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "note-slug-validation-error", children: l$4("note.slug.invalid-slug").toLocaleUpperCase() }) : "",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "alias-control-button",
                onClick: () => {
                  const newDisplayedSlugAliases = [...displayedSlugAliases];
                  newDisplayedSlugAliases.splice(index, 1);
                  setDisplayedSlugAliases(newDisplayedSlugAliases);
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon$1,
                  {
                    icon: "delete",
                    title: "Remove alias",
                    size: 20
                  }
                )
              }
            )
          ]
        },
        "sla-" + index
      );
    })
  ] });
};

const NoteContentBlockActions = ({
  file
}) => {
  const isNenoScript = file.slug.endsWith(NENO_SCRIPT_FILE_SUFFIX);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(FlexContainer, { className: "preview-block-file-actions", children: [
    isNenoScript ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getAppPath(PathTemplate.SCRIPT, /* @__PURE__ */ new Map([
      ["GRAPH_ID", LOCAL_GRAPH_ID],
      ["SCRIPT_SLUG", file.slug]
    ])), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Icon$1,
      {
        icon: "play_arrow",
        title: "Open in script editor",
        size: 24
      }
    ) }) : "",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getAppPath(PathTemplate.FILE, /* @__PURE__ */ new Map([
      ["GRAPH_ID", LOCAL_GRAPH_ID],
      ["FILE_SLUG", file.slug]
    ])), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Icon$1,
      {
        icon: "info",
        title: "File details",
        size: 24
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        className: "preview-block-file-download-button",
        onClick: (e) => {
          saveFile(file.slug);
          e.stopPropagation();
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon$1,
          {
            icon: "file_download",
            title: l$4("note.download-file"),
            size: 24
          }
        )
      }
    )
  ] });
};

const NoteContentBlockAudio = ({
  file,
  notesProvider
}) => {
  const [url, setUrl] = reactExports.useState("");
  reactExports.useEffect(() => {
    getUrl(file).then((url2) => {
      setUrl(url2);
    });
  }, [file, notesProvider]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "preview-block-file-wrapper",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-first-line", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-info-title", children: file.slug }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-size", children: humanFileSize(file.size) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(NoteContentBlockActions, { file })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-audio-second-line", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "audio",
          {
            controls: true,
            src: url
          }
        ) })
      ]
    },
    file.slug
  );
};

const NoteContentBlockVideo = ({
  file,
  notesProvider
}) => {
  const [url, setUrl] = reactExports.useState("");
  reactExports.useEffect(() => {
    getUrl(file).then((url2) => {
      setUrl(url2);
    });
  }, [file, notesProvider]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "preview-block-file-wrapper",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-first-line", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-info-title", children: file.slug }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-size", children: humanFileSize(file.size) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(NoteContentBlockActions, { file })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-video-second-line", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            controls: true,
            src: url
          }
        ) })
      ]
    },
    file.slug
  );
};

const NoteContentBlockImage = ({
  file,
  notesProvider
}) => {
  const [url, setUrl] = reactExports.useState("");
  reactExports.useEffect(() => {
    getUrl(file).then((url2) => {
      setUrl(url2);
    });
  }, [file, notesProvider]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "preview-block-image-wrapper",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: url,
          alt: file.slug
        }
      )
    },
    file.slug
  );
};

const NoteContentBlockTextFile = ({
  file,
  notesProvider
}) => {
  const [text, setText] = reactExports.useState("");
  reactExports.useEffect(() => {
    getUrl(file).then((url) => {
      return fetch(url);
    }).then((response) => response.text()).then((text2) => setText(text2));
  }, [file, notesProvider]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "preview-block-file-wrapper",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-first-line", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-info", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-info-title", children: file.slug }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(NoteContentBlockActions, { file })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-audio-second-line", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "pre",
          {
            className: "preview-block-file-text",
            children: text
          },
          Math.random()
        ) })
      ]
    },
    file.slug
  );
};

const NoteContentBlockDocument = ({
  file
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "preview-block-file-wrapper",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-first-line", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-block-file-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-info-title", children: file.slug }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-block-file-size", children: humanFileSize(file.size) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NoteContentBlockActions, { file })
      ] })
    },
    file.slug
  );
};

const getSummary = (noteContent, noteTitle) => {
  const MAX_LINES = 5;
  const nonEmptyLines = noteContent.split("\n").filter((line) => line.trim().length > 0);
  let transclusionContent;
  const noteContentContainsTitle = removeWikilinkPunctuation(nonEmptyLines[0]).includes(noteTitle);
  if (nonEmptyLines.length <= MAX_LINES) {
    transclusionContent = noteContentContainsTitle ? nonEmptyLines.slice(1).join("\n") : nonEmptyLines.join("\n");
  } else {
    transclusionContent = getLines(
      noteContent,
      noteContentContainsTitle ? 1 : 0,
      MAX_LINES) + "\n…";
  }
  return removeWikilinkPunctuation(transclusionContent);
};
const getNoteTransclusionContent = (noteContent, noteTitle) => {
  const summary = getSummary(noteContent, noteTitle);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "transclusion-note-content", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "transclusion-note-title", children: noteTitle }),
    summary
  ] });
};
const getTransclusionContent = async (slug, note, notesProvider) => {
  if (!slug) {
    throw new Error("INVALID_FILE_SLUG");
  }
  const file = (await notesProvider.getFiles()).find((f) => slug === f.slug);
  if (file) {
    const mediaType = getMediaTypeFromFilename(slug);
    const file2 = await notesProvider.getFileInfo(slug);
    if (mediaType === MediaType.AUDIO) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockAudio,
        {
          file: file2,
          notesProvider
        },
        file2.slug
      );
    } else if (mediaType === MediaType.VIDEO) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockVideo,
        {
          file: file2,
          notesProvider
        },
        file2.slug
      );
    } else if (mediaType === MediaType.IMAGE) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockImage,
        {
          file: file2,
          notesProvider
        },
        file2.slug
      );
    } else if (mediaType === MediaType.TEXT) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockTextFile,
        {
          file: file2,
          notesProvider
        },
        file2.slug
      );
    } else {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockDocument,
        {
          file: file2
        },
        file2.slug
      );
    }
  }
  if ("outgoingLinks" in note) {
    const linkedNote2 = note.outgoingLinks.find(
      (link) => link.slug === slug
    );
    if (linkedNote2) {
      return getNoteTransclusionContent(linkedNote2.content, linkedNote2.title);
    }
  }
  const linkedNote = await notesProvider.get(slug);
  return getNoteTransclusionContent(
    linkedNote.content,
    getNoteTitle(linkedNote.content)
  );
};

const insert = (text, editor) => {
  editor.update(() => {
    const selection = ms();
    if (ns(selection)) {
      selection.insertText(text);
    }
  });
};
const concatenateInsertItems = (items) => {
  let concatenatedText = "";
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemBefore = i > 0 ? items[i] : null;
    if (item.type === "file-slug") {
      if (itemBefore?.value.endsWith(" ") || itemBefore?.type === "file-slug") {
        concatenatedText += " ";
      }
    } else {
      if (itemBefore?.type === "file-slug" && !item.value.startsWith(" ")) {
        concatenatedText += " ";
      }
    }
    concatenatedText += item.value;
  }
  return concatenatedText;
};
const insertItems = (items, editor) => {
  editor.update(() => {
    const selection = ms();
    if (ns(selection)) {
      let concatenatedText = concatenateInsertItems(items);
      const selectionIsCollapsed = selection.focus.key === selection.anchor.key && selection.focus.offset === selection.anchor.offset;
      if (selectionIsCollapsed) {
        const anchorNode = selection.anchor.getNode();
        const charBeforeCursor = anchorNode.getTextContent()[selection.anchor.offset - 1];
        if (charBeforeCursor && !isWhiteSpace$1(charBeforeCursor)) {
          concatenatedText = " " + concatenatedText;
        }
        let charAfterCursor = anchorNode.getTextContent()[selection.anchor.offset];
        const nextSibling = anchorNode.getNextSibling();
        if (!charAfterCursor && nextSibling) {
          charAfterCursor = nextSibling.getTextContent()[0];
        }
        if (charAfterCursor && !isWhiteSpace$1(charAfterCursor)) {
          concatenatedText = concatenatedText + " ";
        }
      }
      selection.insertText(concatenatedText);
    }
  });
};
const toggleWikilinkWrap = (editor) => {
  editor.update(() => {
    const selection = ms();
    if (ns(selection)) {
      const text = selection.getTextContent();
      if (text.startsWith("[[") && text.endsWith("]]")) {
        selection.insertText(text.substring(2, text.length - 2));
      } else {
        selection.insertText(`[[${text}]]`);
        if (text.length === 0) {
          selection.anchor.offset -= 2;
          selection.focus.offset -= 2;
        }
      }
    }
  });
};

const Note = ({
  editorInstanceId,
  isBusy,
  note,
  slugInput,
  setSlugInput,
  displayedSlugAliases,
  setDisplayedSlugAliases,
  handleEditorContentChange,
  addFilesToNoteObject,
  setUnsavedChanges,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  importNote,
  uploadInProgress,
  setUploadInProgress,
  updateReferences,
  setUpdateReferences,
  onLinkIndicatorClick,
  handleNoteExportRequest
}) => {
  const noteElement = reactExports.useRef(null);
  const notesProvider = useNotesProvider();
  const goToNote = useGoToNote();
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();
  const [editor] = u$2();
  const insertFilesAndStringsToNote = (fileOrString) => {
    const items = fileOrString.map((fos) => {
      if (typeof fos === "string") {
        return {
          type: "string",
          value: fos
        };
      } else {
        return {
          type: "file-slug",
          value: "/" + fos.slug
        };
      }
    });
    insertItems(items, editor);
  };
  const uploadFiles = async (notesProvider2, files) => {
    setUploadInProgress(true);
    const fileInfos = await Promise.all(
      files.map(
        (file) => {
          return notesProvider2.addFile(
            file.stream(),
            DEFAULT_FILE_SLUG_FOLDER,
            file.name
          );
        }
      )
    );
    setUploadInProgress(false);
    addFilesToNoteObject(fileInfos);
    return fileInfos;
  };
  const uploadFilesAndInsertFileSlugsToNote = async (notesProvider2, files) => {
    const fileInfos = await uploadFiles(notesProvider2, files);
    insertFilesAndStringsToNote(fileInfos);
  };
  const handleUploadFilesRequest = async () => {
    if (!notesProvider) throw new Error("NotesProvider not ready");
    const files = await getFilesFromUserSelection(
      FILE_PICKER_ACCEPT_TYPES,
      true
    );
    return uploadFilesAndInsertFileSlugsToNote(notesProvider, files);
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    const promisesToWaitFor = [];
    [...e.dataTransfer.items].forEach((item) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          setUploadInProgress(true);
          const fileUploadPromise = notesProvider.addFile(
            file.stream(),
            DEFAULT_FILE_SLUG_FOLDER,
            file.name
          );
          promisesToWaitFor.push(fileUploadPromise);
        }
      } else {
        const stringTransformPromise = new Promise((resolve) => {
          item.getAsString((val) => {
            resolve(val);
          });
        });
        promisesToWaitFor.push(stringTransformPromise);
      }
    });
    const items = await Promise.all(promisesToWaitFor);
    setUploadInProgress(false);
    insertFilesAndStringsToNote(items);
  };
  const getLinkAvailability = async (linkText, linkType) => {
    const slug = linkType === LinkType.WIKILINK ? sluggifyWikilinkText(linkText) : linkText;
    try {
      await notesProvider.getFileInfo(slug);
      return true;
    } catch (e) {
      try {
        await notesProvider.get(slug);
        return true;
      } catch (e2) {
        return false;
      }
    }
  };
  reactExports.useEffect(() => {
    if (noteElement.current) {
      noteElement.current.scrollTop = 0;
    }
  }, ["slug" in note ? note.slug : ""]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteMenuBar,
      {
        activeNote: note,
        disableNoteSaving: !NotesProvider.isValidNoteSlugOrEmpty(slugInput),
        handleNoteSaveRequest,
        removeActiveNote,
        unsavedChanges,
        setUnsavedChanges,
        pinOrUnpinNote,
        duplicateNote,
        handleUploadFilesRequest,
        uploadInProgress,
        importNote,
        handleNoteExportRequest
      }
    ),
    isBusy ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "note-busy-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BusyIndicator, { alt: l$4("app.loading"), height: 64 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "note",
        ref: noteElement,
        onDrop: handleDrop,
        onPaste: (e) => {
          if (!notesProvider) return;
          const files = Array.from(e.clipboardData.files);
          if (files.length > 0) {
            uploadFilesAndInsertFileSlugsToNote(notesProvider, files);
            e.preventDefault();
          }
        },
        onDragOver: (e) => {
          e.stopPropagation();
          e.preventDefault();
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NoteSlug,
            {
              note,
              slugInput,
              setSlugInput,
              displayedSlugAliases,
              setDisplayedSlugAliases,
              setUnsavedChanges,
              updateReferences,
              setUpdateReferences
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Editor,
            {
              initialText: note.initialContent,
              instanceId: editorInstanceId,
              onChange: (val) => {
                handleEditorContentChange(val);
              },
              onUserRequest: async (type, value) => {
                if (type !== UserRequestType.HYPERLINK) {
                  if (unsavedChanges) {
                    await confirmDiscardingUnsavedChanges();
                    setUnsavedChanges(false);
                  }
                  const slug = type === UserRequestType.WIKILINK ? sluggifyWikilinkText(value) : value;
                  try {
                    await notesProvider.getFileInfo(slug);
                    navigate(
                      getAppPath(PathTemplate.FILE, /* @__PURE__ */ new Map([
                        ["GRAPH_ID", LOCAL_GRAPH_ID],
                        ["FILE_SLUG", slug]
                      ]))
                    );
                  } catch (e) {
                    goToNote(slug, {
                      contentIfNewNote: type === UserRequestType.WIKILINK ? value : ""
                    });
                  }
                } else {
                  window.open(value, "_blank", "noopener,noreferrer");
                }
              },
              getTransclusionContent: (slug) => {
                return getTransclusionContent(slug, note, notesProvider);
              },
              getLinkAvailability
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "note-props",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NoteBacklinks,
                  {
                    note,
                    setUnsavedChanges,
                    unsavedChanges,
                    onLinkIndicatorClick
                  }
                ),
                !note.isUnsaved ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NoteStats,
                  {
                    note
                  }
                ) : null
              ]
            }
          )
        ]
      }
    )
  ] });
};

var NoteListStatus = /* @__PURE__ */ ((NoteListStatus2) => {
  NoteListStatus2["DEFAULT"] = "DEFAULT";
  NoteListStatus2["BUSY"] = "BUSY";
  NoteListStatus2["NO_NOTES_FOUND"] = "NO_NOTES_FOUND";
  return NoteListStatus2;
})(NoteListStatus || {});
const NoteListStatusIndicator = ({
  status
}) => {
  if (status === "BUSY" /* BUSY */) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "splash-message",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(BusyIndicator, { alt: l$4("list.status.busy"), height: 64 })
      }
    );
  }
  const map = /* @__PURE__ */ new Map([
    [
      "NO_NOTES_FOUND" /* NO_NOTES_FOUND */,
      {
        label: l$4("list.status.no-notes-found"),
        icon: "radio_button_unchecked"
      }
    ]
  ]);
  const activeState = map.get(status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "splash-message",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: getIconSrc(activeState.icon),
            alt: activeState.label,
            className: "svg-icon"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: activeState.label })
      ]
    }
  );
};

/*
  @license

  The MIT License (MIT)

  Copyright (c) 2014 Call-Em-All

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
function useControlled({
  controlled,
  default: defaultProp
}) {
  const { current: isControlled } = reactExports.useRef(controlled !== void 0);
  const [valueState, setValue] = reactExports.useState(defaultProp);
  const value = isControlled ? controlled : valueState;
  const setValueIfUncontrolled = reactExports.useCallback(
    (newValue) => {
      if (!isControlled) {
        setValue(newValue);
      }
    },
    []
  );
  return [value, setValueIfUncontrolled];
}

/*
  @license

  The MIT License (MIT)

  Copyright (c) 2014 Call-Em-All

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
function usePagination(props) {
  const {
    boundaryCount = 1,
    count = 1,
    defaultPage = 1,
    disabled = false,
    hideNextButton = false,
    hidePrevButton = false,
    onChange: handleChange,
    page: pageProp,
    showFirstButton = false,
    showLastButton = false,
    siblingCount = 1,
    ...other
  } = props;
  const [page, setPageState] = useControlled({
    controlled: pageProp,
    default: defaultPage
  });
  const handleClick = (event, value) => {
    if (!pageProp) {
      value && setPageState(value);
    }
    if (handleChange && value !== null) {
      handleChange(event, value);
    }
  };
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };
  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count
  );
  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1
    ),
    // Greater than startPages
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2
    ),
    // Less than endPages
    endPages.length > 0 ? endPages[0] - 2 : count - 1
  );
  const itemList = [
    ...showFirstButton ? ["first" /* First */] : [],
    ...hidePrevButton ? [] : ["previous" /* Previous */],
    ...startPages,
    // Start ellipsis
    ...siblingsStart > boundaryCount + 2 ? ["start-ellipsis" /* StartEllipsis */] : boundaryCount + 1 < count - boundaryCount ? [boundaryCount + 1] : [],
    // Sibling pages
    ...range(siblingsStart, siblingsEnd),
    // End ellipsis
    ...siblingsEnd < count - boundaryCount - 1 ? ["end-ellipsis" /* EndEllipsis */] : count - boundaryCount > boundaryCount ? [count - boundaryCount] : [],
    ...endPages,
    ...hideNextButton ? [] : ["next" /* Next */],
    ...showLastButton ? ["last" /* Last */] : []
  ];
  const buttonPage = (type) => {
    switch (type) {
      case "first" /* First */:
        return 1;
      case "previous" /* Previous */:
        return page - 1;
      case "next" /* Next */:
        return page + 1;
      case "last" /* Last */:
        return count;
      default:
        return null;
    }
  };
  const items = itemList.map((item) => {
    return typeof item === "number" ? {
      "onClick": (event) => {
        handleClick(event, item);
      },
      "type": "page" /* Page */,
      "page": item,
      "selected": item === page,
      disabled,
      "aria-current": item === page ? "true" : void 0
    } : {
      onClick: (event) => {
        handleClick(event, buttonPage(item));
      },
      type: item,
      page: buttonPage(item),
      selected: false,
      disabled: disabled || item.indexOf("ellipsis") === -1 && (item === "next" || item === "last" ? page >= count : page <= 1)
    };
  });
  return {
    items,
    ...other
  };
}

const getNumberOfPages = (numberOfResults, searchResultsPerPage) => {
  let numberOfPages;
  const numberOfFullPages = Math.floor(
    numberOfResults / searchResultsPerPage
  );
  if (numberOfResults % searchResultsPerPage !== 0) {
    numberOfPages = numberOfFullPages + 1;
  } else {
    numberOfPages = numberOfFullPages;
  }
  return numberOfPages;
};
const Pagination = ({
  numberOfResults,
  searchResultsPerPage,
  page,
  onChange
}) => {
  const doRenderPagination = numberOfResults > searchResultsPerPage;
  const numberOfPages = getNumberOfPages(
    numberOfResults,
    searchResultsPerPage
  );
  const { items } = usePagination({
    count: numberOfPages,
    page,
    onChange: (_event, newPage) => onChange(newPage)
  });
  if (!doRenderPagination) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pagination", children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: items.map(({ page: page2, type, selected, ...item }, index) => {
    let children = null;
    if (type === "start-ellipsis" || type === "end-ellipsis") {
      children = /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pagination-ellipsis", children: "…" });
    } else if (type === "page") {
      children = /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "default-button-small" + (selected ? " pagination-button-selected" : ""),
          ...item,
          children: page2
        }
      );
    } else {
      children = /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "default-button-small pagination-button-special",
          title: type === "previous" ? l$4("list.pagination.previous-page") : l$4("list.pagination.next-page"),
          ...item,
          children: type === "previous" ? "<" : ">"
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "li",
      {
        children
      },
      index
    );
  }) }) }) });
};

const NoteSearchDisclaimer = ({
  searchValue,
  numberOfResults,
  numberOfAllNotes
}) => {
  let label = "";
  if (numberOfResults) {
    if (typeof numberOfAllNotes === "number" && numberOfResults === numberOfAllNotes) {
      label = "";
    } else {
      label = l$4(
        numberOfResults === 1 ? "list.search.x-note-found" : "list.search.x-notes-found",
        { number: numberOfResults.toLocaleString() }
      );
    }
  } else if (searchValue.length > 0 && searchValue.length < 3) {
    label = "";
  }
  if (label === "") {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "note-search-disclaimer", children: label });
};

const NoteList = ({
  notes,
  numberOfResults,
  activeNote,
  isBusy,
  searchValue,
  scrollTop,
  setScrollTop,
  sortMode,
  page,
  setPage,
  numberOfAllNotes,
  itemsAreLinkable,
  onLinkIndicatorClick,
  selectedIndex,
  onSelect
}) => {
  const containerRef = reactExports.useRef(null);
  const isSmallScreen = useIsSmallScreen();
  let status = NoteListStatus.DEFAULT;
  if (isBusy) {
    status = NoteListStatus.BUSY;
  }
  reactExports.useEffect(() => {
    const container = containerRef.current;
    const onScroll = () => {
      container && setScrollTop(container.scrollTop);
    };
    if (!container) {
      return;
    }
    container.addEventListener("scroll", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [status]);
  reactExports.useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    container.scrollTop = scrollTop;
  }, [notes, status, sortMode]);
  if (status === NoteListStatus.BUSY) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteListStatusIndicator,
      {
        status
      }
    );
  }
  if (!Array.isArray(notes) || notes.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteListStatusIndicator,
      {
        status: NoteListStatus.NO_NOTES_FOUND
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      ref: containerRef,
      className: "list-section",
      children: [
        !isSmallScreen ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Pagination,
          {
            numberOfResults,
            page,
            searchResultsPerPage: SEARCH_RESULTS_PER_PAGE,
            onChange: (newPage) => setPage(newPage)
          }
        ) : "",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NoteSearchDisclaimer,
          {
            searchValue,
            numberOfResults,
            numberOfAllNotes
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "note-list",
            children: notes.map((note, i) => {
              const isActive = !!activeNote && !activeNote.isUnsaved && note.slug === activeNote.slug;
              const isLinked = !!activeNote && !activeNote.isUnsaved && (activeNote.outgoingLinks.map((n) => n.slug).includes(note.slug) || activeNote.backlinks.map((n) => n.slug).includes(note.slug));
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                NoteListItem,
                {
                  note,
                  isSelected: i === selectedIndex,
                  isActive,
                  isLinked,
                  onSelect: () => onSelect(note.slug),
                  isLinkable: itemsAreLinkable,
                  onLinkIndicatorClick: () => {
                    if (isActive) return;
                    onLinkIndicatorClick(note.slug, note.title);
                  }
                },
                `main-notes-list-item-${note.slug}`
              );
            })
          }
        ),
        notes.length >= 20 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Pagination,
          {
            numberOfResults,
            page,
            searchResultsPerPage: SEARCH_RESULTS_PER_PAGE,
            onChange: (newPage) => setPage(newPage)
          }
        ) : ""
      ]
    }
  );
};

const SearchInput = ({
  value,
  onChange,
  placeholder,
  autoComplete
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      id: "search-input",
      className: "search-input",
      type: "search",
      placeholder,
      value,
      onChange: (e) => {
        onChange(e.target.value);
      },
      autoComplete
    }
  );
};

const NoteListControls = ({
  value,
  onChange,
  sortMode,
  setSortMode,
  view,
  setView
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "note-list-controls",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SearchInput,
          {
            placeholder: l$4("list.search.placeholder"),
            value,
            onChange,
            autoComplete: "off"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          IconButton,
          {
            id: "button_show-search-presets",
            title: l$4("list.search.presets"),
            icon: "saved_search",
            onClick: () => {
              setView(
                view === NoteListView.SEARCH_PRESETS ? NoteListView.DEFAULT : NoteListView.SEARCH_PRESETS
              );
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "note-list-sort-mode-select",
            value: sortMode,
            onChange: (e) => setSortMode(e.target.value),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.CREATION_DATE_ASCENDING,
                  children: l$4("list.sort-mode.creation-date-ascending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.CREATION_DATE_DESCENDING,
                  children: l$4("list.sort-mode.creation-date-descending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.UPDATE_DATE_ASCENDING,
                  children: l$4("list.sort-mode.update-date-ascending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.UPDATE_DATE_DESCENDING,
                  children: l$4("list.sort-mode.update-date-descending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.TITLE_ASCENDING,
                  children: l$4("list.sort-mode.title-a-z")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.TITLE_DESCENDING,
                  children: l$4("list.sort-mode.title-z-a")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.NUMBER_OF_LINKS_ASCENDING,
                  children: l$4("list.sort-mode.number-of-links-ascending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.NUMBER_OF_LINKS_DESCENDING,
                  children: l$4("list.sort-mode.number-of-links-descending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.NUMBER_OF_FILES_ASCENDING,
                  children: l$4("list.sort-mode.number-of-files-ascending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.NUMBER_OF_FILES_DESCENDING,
                  children: l$4("list.sort-mode.number-of-files-descending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.NUMBER_OF_CHARACTERS_ASCENDING,
                  children: l$4("list.sort-mode.number-of-chars-ascending")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "option",
                {
                  value: NoteListSortMode.NUMBER_OF_CHARACTERS_DESCENDING,
                  children: l$4("list.sort-mode.number-of-chars-descending")
                }
              )
            ]
          }
        )
      ]
    }
  );
};

const SearchPresetsItem = ({
  label,
  query,
  onClick,
  onDelete
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "search-preset",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          label,
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: query })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "search-preset-buttons",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick,
                  className: "default-button-small dialog-box-button default-action",
                  children: l$4("list.search.presets.find")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onDelete,
                  className: "default-button-small dialog-box-button dangerous-action",
                  children: l$4("list.search.presets.remove")
                }
              )
            ]
          }
        )
      ]
    }
  );
};

const DEFAULT_SEARCH_PRESETS = [
  {
    "label": l$4("list.search.presets.untitled-notes"),
    "query": "exact:"
  },
  {
    "label": l$4("list.search.presets.notes-with-duplicate-titles"),
    "query": "duplicates:title"
  },
  {
    "label": l$4("list.search.presets.notes-with-duplicate-urls"),
    "query": "duplicates:url"
  },
  {
    "label": l$4("list.search.presets.notes-with-audio"),
    "query": "has-media:audio"
  },
  {
    "label": l$4("list.search.presets.notes-with-video"),
    "query": "has-media:video"
  },
  {
    "label": l$4("list.search.presets.notes-with-pdfs"),
    "query": "has-media:pdf"
  },
  {
    "label": l$4("list.search.presets.notes-with-images"),
    "query": "has-media:image"
  },
  {
    "label": l$4("list.search.presets.has-list"),
    "query": "has-block:unordered-list-item|ordered-list-item"
  },
  {
    "label": l$4("list.search.presets.has-key-value-pairs"),
    "query": "has-block:key-value-pair"
  }
];
const SearchPresets = ({
  onSelect,
  currentQuery,
  onClose
}) => {
  const [searchPresets, setSearchPresets] = reactExports.useState([]);
  const [currentQueryLabel, setCurrentQueryLabel] = reactExports.useState("");
  reactExports.useEffect(() => {
    get("SEARCH_PRESETS").then((searchPresets2) => {
      setSearchPresets(searchPresets2 || DEFAULT_SEARCH_PRESETS);
    }).catch(() => {
    });
  }, []);
  const setSearchPresetsPersistently = async (searchPresets2) => {
    setSearchPresets(searchPresets2);
    await set("SEARCH_PRESETS", searchPresets2);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "search-presets",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-presets-heading-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: l$4("list.search.presets") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            IconButton,
            {
              id: "close-search-presets",
              icon: "close",
              title: l$4("close"),
              onClick: onClose
            }
          )
        ] }),
        searchPresets.map((preset) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            SearchPresetsItem,
            {
              onClick: () => onSelect(preset.query),
              label: preset.label,
              query: preset.query,
              onDelete: () => {
                setSearchPresetsPersistently(
                  searchPresets.filter((p) => p.query !== preset.query)
                );
              }
            },
            preset.query + "__" + preset.label
          );
        }),
        currentQuery.trim().length > 2 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "save-current-query", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: l$4("list.search.presets.save-current-query") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "save-current-query-controls", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "search-preset-name-input",
                type: "text",
                placeholder: l$4("list.search.presets.preset-name"),
                onInput: (e) => {
                  setCurrentQueryLabel(e.target.value);
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setSearchPresetsPersistently([...searchPresets, {
                  query: currentQuery,
                  label: currentQueryLabel
                }]),
                className: "default-button-small default-action",
                children: l$4("list.search.presets.save")
              }
            )
          ] })
        ] }) : "",
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setSearchPresetsPersistently(DEFAULT_SEARCH_PRESETS),
            className: "default-button dangerous-action",
            children: l$4("list.search.presets.reset-to-defaults")
          }
        ) })
      ]
    }
  );
};

var NoteListView = /* @__PURE__ */ ((NoteListView2) => {
  NoteListView2["DEFAULT"] = "default";
  NoteListView2["SEARCH_PRESETS"] = "search-presets";
  return NoteListView2;
})(NoteListView || {});
const NoteListWithControls = ({
  numberOfAllNotes,
  handleSearchInputChange,
  searchValue,
  sortMode,
  handleSortModeChange,
  noteListItems,
  numberOfResults,
  noteListIsBusy,
  noteListScrollTop,
  setNoteListScrollTop,
  page,
  setPage,
  activeNote,
  itemsAreLinkable,
  onLinkIndicatorClick,
  selectedIndex,
  setSelectedIndex
}) => {
  const [view, setView] = reactExports.useState("default" /* DEFAULT */);
  const noteListWithControlsRef = reactExports.useRef(null);
  const [unsavedChanges, setUnsavedChanges] = reactExports.useContext(UnsavedChangesContext);
  const goToNote = useGoToNote();
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  const handleNoteSelection = async (slug) => {
    if (activeNote && "slug" in activeNote && activeNote.slug === slug) {
      return;
    }
    if (unsavedChanges) {
      await confirmDiscardingUnsavedChanges();
      setUnsavedChanges(false);
    }
    goToNote(slug);
  };
  useKeyboardShortcuts(
    {
      onArrowUp: () => {
        const newIndex = selectedIndex > 0 ? selectedIndex - 1 : noteListItems.length - 1;
        setSelectedIndex(newIndex);
      },
      onArrowDown: () => {
        const newIndex = selectedIndex < noteListItems.length - 1 ? selectedIndex + 1 : 0;
        setSelectedIndex(newIndex);
      },
      onEnter: async () => {
        if (selectedIndex > -1) {
          const note = noteListItems[selectedIndex];
          if (note) {
            handleNoteSelection(note.slug);
          }
        }
      }
    },
    noteListWithControlsRef
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "note-list-with-controls-wrapper",
      ref: noteListWithControlsRef,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NoteListControls,
          {
            onChange: handleSearchInputChange,
            value: searchValue,
            sortMode,
            setSortMode: handleSortModeChange,
            view,
            setView
          }
        ),
        view === "default" /* DEFAULT */ ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          NoteList,
          {
            notes: noteListItems,
            numberOfResults,
            activeNote,
            isBusy: noteListIsBusy,
            searchValue,
            scrollTop: noteListScrollTop,
            setScrollTop: setNoteListScrollTop,
            sortMode,
            page,
            onSelect: (slug) => handleNoteSelection(slug),
            setPage: (page2) => {
              setPage(page2);
              setNoteListScrollTop(0);
            },
            numberOfAllNotes,
            itemsAreLinkable,
            setUnsavedChanges,
            unsavedChanges,
            onLinkIndicatorClick,
            selectedIndex
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          SearchPresets,
          {
            onSelect: (preset) => {
              handleSearchInputChange(preset);
              setView("default" /* DEFAULT */);
            },
            currentQuery: searchValue,
            onClose: () => setView("default" /* DEFAULT */)
          }
        )
      ]
    }
  );
};

const useNoteList = (notesProvider, {
  searchQuery,
  sortMode,
  page
}) => {
  const currentRequestId = reactExports.useRef("");
  const [noteListItems, setNoteListItems] = reactExports.useState([]);
  const [numberOfResults, setNumberOfResults] = reactExports.useState(NaN);
  const [isBusy, setIsBusy] = reactExports.useState(true);
  const refreshNoteList = reactExports.useCallback(
    async () => {
      setNoteListItems([]);
      setIsBusy(true);
      const options = {
        page,
        sortMode,
        caseSensitive: false
      };
      options.searchString = searchQuery;
      const requestId = crypto.randomUUID();
      currentRequestId.current = requestId;
      const {
        results,
        numberOfResults: numberOfResults2
      } = await notesProvider.getNotesList(options);
      if (currentRequestId.current === requestId) {
        setNoteListItems(results);
        setNumberOfResults(numberOfResults2);
        setIsBusy(false);
      }
    },
    [searchQuery, page, sortMode, notesProvider]
  );
  reactExports.useEffect(() => {
    refreshNoteList();
  }, [page, sortMode, searchQuery]);
  return [noteListItems, numberOfResults, isBusy, refreshNoteList];
};

const SORT_MODE_LOCAL_STORAGE_KEY = "NOTE_LIST_SORT_MODE";
const useControlledNoteList = (notesProvider) => {
  const [searchQuery, setSearchQueryState] = reactExports.useState("");
  const [scrollTop, setScrollTop] = reactExports.useState(0);
  const [page, setPageState] = reactExports.useState(1);
  const initialSortMode = localStorage.getItem(
    SORT_MODE_LOCAL_STORAGE_KEY
  ) ?? NoteListSortMode.UPDATE_DATE_DESCENDING;
  const [sortMode, setSortMode] = reactExports.useState(initialSortMode);
  const [selectedIndex, setSelectedIndex] = reactExports.useState(-1);
  const setSearchQuery = (value) => {
    setSearchQueryState(value);
    setScrollTop(0);
    setPageState(1);
    setSelectedIndex(0);
  };
  const setPage = (page2) => {
    setPageState(page2);
    setScrollTop(0);
    setSelectedIndex(0);
  };
  const [
    noteListItems,
    numberOfResults,
    isBusy,
    refresh
  ] = useNoteList(
    notesProvider,
    {
      searchQuery,
      sortMode,
      page
    }
  );
  return {
    items: noteListItems,
    numberOfResults,
    isBusy,
    refresh,
    page,
    setPage,
    sortMode,
    setSortMode: (value) => {
      setSortMode(value);
      localStorage.setItem(SORT_MODE_LOCAL_STORAGE_KEY, value);
    },
    searchQuery,
    setSearchQuery,
    scrollTop,
    setScrollTop,
    selectedIndex,
    setSelectedIndex
  };
};

const useHeaderStats = (notesProvider) => {
  const [headerStats, setHeaderStats] = reactExports.useState(null);
  const refreshHeaderStats = async () => {
    const stats = await notesProvider.getStats(
      {
        includeMetadata: false,
        includeAnalysis: false
      }
    );
    setHeaderStats(stats);
  };
  return [headerStats, refreshHeaderStats];
};

const exportNote = async (activeNote, noteContent, notesProvider) => {
  let rawNote;
  if (activeNote.isUnsaved) {
    const note = {
      meta: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        additionalHeaders: {},
        flags: ["EXPORT_FROM_DRAFT"]
      },
      content: noteContent
    };
    rawNote = serializeNewNote(note);
  } else {
    const rawNoteFromDB = await notesProvider.getRawNote(
      activeNote.slug
    );
    if (!rawNoteFromDB) throw new Error("Raw export failed");
    rawNote = rawNoteFromDB;
  }
  const opts = {
    suggestedName: ("slug" in activeNote ? activeNote.slug : l$4("list.untitled-note")) + NOTE_FILE_EXTENSION,
    types: [{
      description: NOTE_FILE_DESCRIPTION,
      accept: { [NOTE_MIME_TYPE]: [NOTE_FILE_EXTENSION] }
    }]
  };
  const writableStream = await getWritableStream(opts);
  const writer = writableStream.getWriter();
  await writer.write(rawNote);
  writer.close();
};

const useActiveNote = (notesProvider) => {
  const [unsavedChanges, setUnsavedChanges] = reactExports.useContext(UnsavedChangesContext);
  const newNoteObject = getNewNoteObject({});
  const [activeNote, setActiveNote] = reactExports.useState(newNoteObject);
  const [isBusy, setIsBusy] = reactExports.useState(false);
  const noteContentRef = reactExports.useRef("");
  const [updateReferences, setUpdateReferences] = reactExports.useState(false);
  const [slugInput, setSlugInput] = reactExports.useState("");
  const [
    displayedSlugAliases,
    setDisplayedSlugAliases
  ] = reactExports.useState([]);
  const [editorInstanceId, setEditorInstanceId] = reactExports.useState(
    Math.random()
  );
  const updateEditorInstance = () => {
    setEditorInstanceId(Math.random());
  };
  const handleEditorContentChange = (newContent) => {
    if (noteContentRef.current !== newContent) {
      setUnsavedChanges(true);
    }
    noteContentRef.current = newContent;
  };
  const setNewNote = (params) => {
    const newNoteObject2 = getNewNoteObject(params);
    setActiveNote(newNoteObject2);
    setSlugInput(params.slug || "");
    setDisplayedSlugAliases([]);
    noteContentRef.current = "";
  };
  const createNewNote = async (params) => {
    setNewNote(params);
    if (params.content) {
      setUnsavedChanges(true);
    }
    updateEditorInstance();
  };
  const setActiveNoteFromServer = (noteFromServer) => {
    if (!("slug" in activeNote) || noteFromServer.meta.slug !== activeNote.slug) {
      noteContentRef.current = noteFromServer.content;
    }
    setActiveNote({
      slug: noteFromServer.meta.slug,
      // might be better to create a new set here
      aliases: new Set(noteFromServer.aliases),
      createdAt: noteFromServer.meta.createdAt,
      updatedAt: noteFromServer.meta.updatedAt,
      outgoingLinks: noteFromServer.outgoingLinks,
      backlinks: noteFromServer.backlinks,
      numberOfCharacters: noteFromServer.numberOfCharacters,
      numberOfBlocks: noteFromServer.numberOfBlocks,
      isUnsaved: false,
      initialContent: noteFromServer.content,
      files: noteFromServer.files,
      additionalHeaders: Object.entries(noteFromServer.meta.additionalHeaders),
      flags: noteFromServer.meta.flags
    });
    setSlugInput(noteFromServer.meta.slug);
    setDisplayedSlugAliases([...noteFromServer.aliases]);
  };
  const prepareNoteSaveRequest = () => {
    if (activeNote.isUnsaved) {
      return {
        note: {
          content: noteContentRef.current,
          meta: {
            additionalHeaders: {},
            flags: activeNote.flags
          }
        },
        // for new notes, use slug input if available. for existing notes, use
        // slug input only if it's different from the current slug.
        changeSlugTo: NotesProvider.isValidSlug(slugInput) ? slugInput : void 0,
        aliases: new Set(displayedSlugAliases.filter((a) => {
          return a !== slugInput && a.trim().length > 0 && NotesProvider.isValidSlug(a);
        }))
      };
    } else {
      return {
        note: {
          content: noteContentRef.current,
          meta: {
            additionalHeaders: Object.fromEntries(activeNote.additionalHeaders),
            slug: activeNote.slug,
            createdAt: activeNote.createdAt,
            updatedAt: activeNote.updatedAt,
            flags: activeNote.flags
          }
        },
        // for new notes, use slug input if available. for existing notes, use
        // slug input only if it's different from the current slug.
        changeSlugTo: slugInput !== activeNote.slug && NotesProvider.isValidSlug(slugInput) ? slugInput : void 0,
        updateReferences: slugInput !== activeNote.slug && NotesProvider.isValidSlug(slugInput) && updateReferences,
        aliases: new Set(displayedSlugAliases.filter((a) => {
          return a !== slugInput && a.trim().length > 0 && NotesProvider.isValidSlug(a);
        }))
      };
    }
  };
  const saveActiveNote = async () => {
    if (!NotesProvider.isValidNoteSlugOrEmpty(slugInput)) {
      throw new Error("Tried saving an invalid slug. This should not happen!");
    }
    const noteSaveRequest = prepareNoteSaveRequest();
    const noteFromDatabase = await notesProvider.put(noteSaveRequest);
    setActiveNoteFromServer(noteFromDatabase);
    if (noteFromDatabase.content === noteContentRef.current) {
      setUnsavedChanges(false);
    }
    return noteFromDatabase;
  };
  const importNote = async () => {
    const types = [{
      description: NOTE_FILE_DESCRIPTION,
      accept: { [NOTE_MIME_TYPE]: [NOTE_FILE_EXTENSION] }
    }];
    const [rawNoteFile] = await getFilesFromUserSelection(types, false);
    const rawNote = await readFileAsString(rawNoteFile);
    const parsedNote = parseSerializedNewNote(rawNote);
    const newActiveNote = {
      isUnsaved: true,
      initialContent: parsedNote.content,
      flags: [...parsedNote.meta.flags, "IMPORTED"],
      files: []
    };
    setActiveNote(newActiveNote);
    setSlugInput("");
    setUnsavedChanges(true);
    noteContentRef.current = parsedNote.content;
    updateEditorInstance();
  };
  const removeActiveNote = async () => {
    if (activeNote.isUnsaved) {
      return;
    }
    await notesProvider.remove(activeNote.slug);
    createNewNote({});
    setUnsavedChanges(false);
  };
  const duplicateNote = async () => {
    if (activeNote.isUnsaved) {
      throw new Error("Cannot duplicate an unsaved note");
    }
    const noteSaveRequest = {
      note: {
        meta: {
          additionalHeaders: Object.fromEntries(activeNote.additionalHeaders),
          flags: [...activeNote.flags, `DUPLICATE_OF(${activeNote.slug})`]
        },
        content: noteContentRef.current
      },
      aliases: /* @__PURE__ */ new Set()
    };
    const noteFromServer = await notesProvider.put(noteSaveRequest);
    setActiveNoteFromServer(noteFromServer);
    updateEditorInstance();
    return noteFromServer;
  };
  const handleNoteExportRequest = () => {
    exportNote(activeNote, noteContentRef.current, notesProvider);
  };
  const loadNote = async (slug, contentForNewNote) => {
    if (slug === "new") {
      createNewNote({
        slug: void 0,
        content: contentForNewNote ?? ""
      });
      return Promise.resolve(null);
    }
    let receivedNoteSlug = null;
    setIsBusy(true);
    try {
      const noteFromServer = slug === "random" ? await notesProvider.getRandom() : await notesProvider.get(slug);
      setActiveNoteFromServer(noteFromServer);
      receivedNoteSlug = noteFromServer.meta.slug;
      updateEditorInstance();
    } catch (e) {
      if (e instanceof Error && e.message === "NOTE_NOT_FOUND") {
        createNewNote({
          slug,
          content: contentForNewNote ?? ""
        });
      } else {
        throw e;
      }
    }
    setIsBusy(false);
    return receivedNoteSlug;
  };
  return {
    isBusy,
    activeNote,
    handleEditorContentChange,
    saveActiveNote,
    setActiveNote,
    importNote,
    removeActiveNote,
    duplicateNote,
    loadNote,
    unsavedChanges,
    setUnsavedChanges,
    slugInput,
    setSlugInput,
    displayedSlugAliases,
    setDisplayedSlugAliases,
    editorInstanceId,
    updateEditorInstance,
    updateReferences,
    setUpdateReferences,
    handleNoteExportRequest
  };
};

const usePinnedNotes = (notesProvider) => {
  const [pinnedNotes, setPinnedNotes] = reactExports.useState(null);
  const pinOrUnpinNote = async (slug) => {
    let newPinnedNotes;
    if (!pinnedNotes) {
      throw new Error("Pinned notes have not been initialized yet.");
    }
    if (pinnedNotes.find((pinnedNote) => pinnedNote.meta.slug === slug)) {
      newPinnedNotes = await notesProvider.unpin(slug);
    } else {
      newPinnedNotes = await notesProvider.pin(slug);
    }
    setPinnedNotes(newPinnedNotes);
  };
  const move = async (slug, offset) => {
    const newPinnedNotes = await notesProvider.movePinPosition(slug, offset);
    setPinnedNotes(newPinnedNotes);
  };
  const refreshPinnedNotes = async () => {
    const pinnedNotes2 = await notesProvider.getPins();
    setPinnedNotes(pinnedNotes2);
  };
  return {
    pinnedNotes,
    pinOrUnpinNote,
    refreshPinnedNotes,
    move
  };
};

const getValidNoteSlug = (noteSlugParam) => {
  if (noteSlugParam === "random") {
    return "random";
  }
  if (noteSlugParam && noteSlugParam !== "new" && noteSlugParam.length > 0) {
    return noteSlugParam;
  } else {
    return null;
  }
};
const NoteView = () => {
  const notesProvider = useNotesProvider();
  const isSmallScreen = useIsSmallScreen();
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();
  const [uploadInProgress, setUploadInProgress] = reactExports.useState(false);
  const goToNote = useGoToNote();
  const [editor] = u$2();
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  const {
    isBusy,
    activeNote,
    saveActiveNote,
    removeActiveNote,
    duplicateNote,
    loadNote,
    importNote,
    setActiveNote,
    handleEditorContentChange,
    unsavedChanges,
    setUnsavedChanges,
    slugInput,
    setSlugInput,
    displayedSlugAliases,
    setDisplayedSlugAliases,
    editorInstanceId,
    updateEditorInstance,
    updateReferences,
    setUpdateReferences,
    handleNoteExportRequest
  } = useActiveNote(notesProvider);
  const [headerStats, refreshHeaderStats] = useHeaderStats(notesProvider);
  const {
    pinnedNotes,
    pinOrUnpinNote,
    refreshPinnedNotes,
    move
  } = usePinnedNotes(notesProvider);
  const controlledNoteList = useControlledNoteList(notesProvider);
  const refreshContentViews = async () => {
    await refreshHeaderStats();
    await controlledNoteList.refresh();
    await refreshPinnedNotes();
  };
  const saveActiveNoteAndRefreshViews = async () => {
    const noteFromDatabase = await saveActiveNote();
    goToNote(
      noteFromDatabase.meta.slug,
      {
        replace: true
      }
    );
    await refreshContentViews();
    return noteFromDatabase;
  };
  const handleNoteSaveRequest = async () => {
    setUploadInProgress(true);
    try {
      await saveActiveNoteAndRefreshViews();
    } catch (e) {
      alert(e);
    }
    setUploadInProgress(false);
  };
  const setCanonicalNewNotePath = () => {
    const targetPath = getAppPath(
      PathTemplate.NEW_NOTE,
      /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
      new URLSearchParams(location.search)
    );
    if (location.pathname !== targetPath) {
      navigate(
        targetPath,
        {
          replace: true
        }
      );
    }
  };
  useKeyboardShortcuts({
    onSave: () => {
      if (!NotesProvider.isValidNoteSlugOrEmpty(slugInput)) {
        return;
      }
      handleNoteSaveRequest();
    },
    onCmdB: async () => {
      if (unsavedChanges) {
        await confirmDiscardingUnsavedChanges();
        setUnsavedChanges(false);
      }
      goToNote("new");
    },
    onCmdE: () => {
      document.getElementById("search-input")?.focus();
    },
    onCmdI: () => {
      toggleWikilinkWrap(editor);
    }
  });
  reactExports.useEffect(() => {
    const title = getNoteTitle(activeNote.initialContent);
    const documentTitle = title.length > 0 ? title : activeNote.isUnsaved ? l$4("editor.new-note") : l$4("list.untitled-note");
    if (document.title !== documentTitle) {
      document.title = documentTitle;
    }
    return () => {
      document.title = DEFAULT_DOCUMENT_TITLE;
    };
  }, [activeNote]);
  reactExports.useEffect(() => {
    setTimeout(() => {
      document.querySelector(
        "div[data-lexical-editor]"
      )?.focus();
    });
  }, []);
  reactExports.useEffect(() => {
    refreshContentViews();
    if (getValidNoteSlug(slug) === null) {
      goToNote("new", {
        contentIfNewNote: location.state?.contentIfNewNote || ""
      });
      setCanonicalNewNotePath();
    }
  }, []);
  const loadNoteAndRefreshURL = async (slug2, contentIfNewNote) => {
    if (slug2 === "new") {
      await loadNote(
        slug2,
        contentIfNewNote || ""
      );
    }
    const validNoteSlug = getValidNoteSlug(slug2);
    if (validNoteSlug !== null && !("slug" in activeNote && validNoteSlug === activeNote.slug)) {
      const receivedNoteSlug = await loadNote(
        validNoteSlug,
        contentIfNewNote
      );
      if (typeof receivedNoteSlug === "string" && validNoteSlug !== receivedNoteSlug) {
        navigate(
          getAppPath(
            PathTemplate.EXISTING_NOTE,
            /* @__PURE__ */ new Map([
              ["GRAPH_ID", LOCAL_GRAPH_ID],
              ["SLUG", receivedNoteSlug]
            ]),
            new URLSearchParams(location.search)
          ),
          { replace: true }
        );
      }
    }
  };
  reactExports.useEffect(() => {
    loadNoteAndRefreshURL(slug, location?.state?.contentIfNewNote);
  }, [slug, location.state]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteViewHeader,
      {
        stats: headerStats,
        pinnedNotes,
        movePin: move,
        activeNote
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      !isSmallScreen ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteListWithControls,
        {
          handleSearchInputChange: controlledNoteList.setSearchQuery,
          searchValue: controlledNoteList.searchQuery,
          sortMode: controlledNoteList.sortMode,
          handleSortModeChange: controlledNoteList.setSortMode,
          noteListItems: controlledNoteList.items,
          numberOfResults: controlledNoteList.numberOfResults,
          activeNote,
          noteListIsBusy: controlledNoteList.isBusy,
          noteListScrollTop: controlledNoteList.scrollTop,
          setNoteListScrollTop: controlledNoteList.setScrollTop,
          page: controlledNoteList.page,
          setPage: controlledNoteList.setPage,
          numberOfAllNotes: headerStats?.numberOfAllNotes,
          itemsAreLinkable: true,
          onLinkIndicatorClick: (slug2, title) => {
            const wikilink = getWikilinkForNote(slug2, title);
            insert(wikilink, editor);
          },
          selectedIndex: controlledNoteList.selectedIndex,
          setSelectedIndex: controlledNoteList.setSelectedIndex
        }
      ) }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "main-content-besides-sidebar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Note,
        {
          editorInstanceId,
          isBusy,
          note: activeNote,
          setSlugInput,
          slugInput,
          displayedSlugAliases,
          setDisplayedSlugAliases,
          handleEditorContentChange,
          addFilesToNoteObject: (files) => {
            setActiveNote((previousState) => {
              return {
                ...previousState,
                files: [...previousState.files, ...files]
              };
            });
          },
          setUnsavedChanges,
          handleNoteSaveRequest,
          removeActiveNote: async () => {
            await removeActiveNote();
            refreshContentViews();
            setCanonicalNewNotePath();
          },
          unsavedChanges,
          pinOrUnpinNote,
          duplicateNote: async () => {
            const duplicate = await duplicateNote();
            refreshContentViews();
            goToNote(duplicate.meta.slug);
            updateEditorInstance();
          },
          importNote,
          uploadInProgress,
          setUploadInProgress,
          updateReferences,
          setUpdateReferences,
          onLinkIndicatorClick: (slug2, title) => {
            const wikilink = getWikilinkForNote(slug2, title);
            insert(wikilink, editor);
          },
          handleNoteExportRequest
        }
      ) })
    ] })
  ] });
};
const NoteViewWithEditorContext = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Context, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteView, {}) });
};

const FloatingActionButton = ({
  title,
  icon,
  onClick,
  disabled = false
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      className: "floating-action-button",
      onClick,
      disabled,
      title,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: getIconSrc(icon),
          alt: title,
          width: "24",
          height: "24",
          className: "svg-icon"
        }
      )
    }
  );
};

const ListView = () => {
  const navigate = useNavigate();
  const notesProvider = useNotesProvider();
  const controlledNoteList = useControlledNoteList(notesProvider);
  const [headerStats] = useHeaderStats(
    notesProvider
  );
  const {
    pinnedNotes,
    refreshPinnedNotes,
    move
  } = usePinnedNotes(notesProvider);
  reactExports.useEffect(() => {
    refreshPinnedNotes();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteViewHeader,
      {
        stats: headerStats,
        pinnedNotes,
        activeNote: null,
        movePin: move
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteListWithControls,
      {
        handleSearchInputChange: controlledNoteList.setSearchQuery,
        searchValue: controlledNoteList.searchQuery,
        sortMode: controlledNoteList.sortMode,
        handleSortModeChange: controlledNoteList.setSortMode,
        noteListItems: controlledNoteList.items,
        numberOfResults: controlledNoteList.numberOfResults,
        activeNote: null,
        noteListIsBusy: controlledNoteList.isBusy,
        noteListScrollTop: controlledNoteList.scrollTop,
        setNoteListScrollTop: controlledNoteList.setScrollTop,
        page: controlledNoteList.page,
        setPage: controlledNoteList.setPage,
        numberOfAllNotes: headerStats?.numberOfAllNotes,
        itemsAreLinkable: false,
        onLinkIndicatorClick: () => {
          return;
        },
        selectedIndex: controlledNoteList.selectedIndex,
        setSelectedIndex: controlledNoteList.setSelectedIndex
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FloatingActionButton,
      {
        title: l$4("editor.new-note"),
        icon: "add",
        onClick: () => navigate(getAppPath(
          PathTemplate.NEW_NOTE,
          /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
        ))
      }
    )
  ] });
};

const FilesViewPreviewBox = ({
  file,
  isDangling
}) => {
  const navigate = useNavigate();
  const type = getMediaTypeFromFilename(file.slug) || "unknown";
  const isNenoScript = file.slug.endsWith(NENO_SCRIPT_FILE_SUFFIX);
  const [thumbnailImageSrc, setThumbnailImageSrc] = reactExports.useState(null);
  reactExports.useEffect(() => {
    getUrlForSlug(file.slug).then((src) => {
      if (isNenoScript) {
        setThumbnailImageSrc(getIconSrc("neno"));
        return;
      }
      const thumbnailImageSrcMap = {
        [MediaType.IMAGE]: src,
        [MediaType.AUDIO]: getIconSrc("audio_file"),
        [MediaType.VIDEO]: getIconSrc("video_file"),
        [MediaType.PDF]: getIconSrc("description"),
        [MediaType.TEXT]: getIconSrc("description"),
        [MediaType.OTHER]: getIconSrc("draft")
      };
      setThumbnailImageSrc(thumbnailImageSrcMap[type]);
    });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "files-view-preview-box",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: getAppPath(PathTemplate.FILE, /* @__PURE__ */ new Map([
            ["GRAPH_ID", LOCAL_GRAPH_ID],
            ["FILE_SLUG", file.slug]
          ])),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: thumbnailImageSrc || "",
                loading: "lazy",
                className: type === MediaType.IMAGE ? "checkerboard-background preview-image" : "file-type-icon"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "file-info",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "filename",
                      children: file.slug
                    }
                  ),
                  isDangling ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      title: l$4("files.dangling"),
                      className: "dangling-file-indicator"
                    }
                  ) : ""
                ]
              }
            ),
            isNenoScript ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              FloatingActionButton,
              {
                title: l$4("files.open-in-script-editor"),
                icon: "create",
                onClick: (e) => {
                  navigate(getAppPath(
                    PathTemplate.SCRIPT,
                    /* @__PURE__ */ new Map([
                      ["GRAPH_ID", LOCAL_GRAPH_ID],
                      ["SCRIPT_SLUG", file.slug]
                    ])
                  ));
                  e.stopPropagation();
                  e.preventDefault();
                }
              }
            ) : ""
          ]
        }
      )
    }
  );
};

const CreateScript = ({
  existingFiles,
  onCreated
}) => {
  const [newScriptName, setNewScriptName] = reactExports.useState("");
  const notesProvider = useNotesProvider();
  const newFilename = `${newScriptName}${NENO_SCRIPT_FILE_SUFFIX}`;
  const newSlug = `scripts/${newFilename}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "create-script", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: l$4("files.create-script") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "controls", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "/scripts/",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: newScriptName,
            onChange: (e) => setNewScriptName(e.target.value)
          }
        ),
        NENO_SCRIPT_FILE_SUFFIX
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "default-button-small default-action",
          disabled: existingFiles.map((s) => s.slug).includes(newSlug) || !isValidFileSlug(newSlug) || newScriptName.length === 0,
          onClick: async () => {
            const readable = new Blob(
              [],
              { type: "text/plain" }
            ).stream();
            await notesProvider.addFile(readable, "scripts", newFilename);
            setNewScriptName("");
            onCreated();
          },
          children: l$4("files.create-script.create")
        }
      )
    ] }),
    existingFiles.map((s) => s.slug).includes(newSlug) ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "error", children: l$4("files.create-script.script-already-exists") }) : ""
  ] });
};

const FilesView = () => {
  const notesProvider = useNotesProvider();
  const [files, setFiles] = reactExports.useState([]);
  const [filterInput, setFilterInput] = reactExports.useState("");
  const [danglingFileSlugs, setDanglingFileSlugs] = reactExports.useState([]);
  const [sortMode, setSortMode] = reactExports.useState(
    "CREATED_AT_DESCENDING" /* CREATED_AT_DESCENDING */
  );
  const [status, setStatus] = reactExports.useState("BUSY");
  const [page, setPage] = reactExports.useState(1);
  const updateDanglingFiles = async () => {
    const danglingFiles = await notesProvider.getDanglingFiles();
    setDanglingFileSlugs(danglingFiles.map((file) => file.slug));
  };
  const filteredFiles = files.filter((file) => {
    if (filterInput.startsWith("ends-with:")) {
      const suffix = filterInput.substring("ends-with:".length);
      return file.slug.toLowerCase().endsWith(suffix);
    } else {
      return file.slug.toLowerCase().startsWith(
        filterInput.toLowerCase()
      );
    }
  }).toSorted((a, b) => {
    if (sortMode === "CREATED_AT_DESCENDING" /* CREATED_AT_DESCENDING */) {
      return getCompareKeyForTimestamp(b.createdAt) - getCompareKeyForTimestamp(a.createdAt);
    } else if (sortMode === "CREATED_AT_ASCENDING" /* CREATED_AT_ASCENDING */) {
      return getCompareKeyForTimestamp(a.createdAt) - getCompareKeyForTimestamp(b.createdAt);
    } else if (sortMode === "NAME_ASCENDING" /* NAME_ASCENDING */) {
      if (a.slug.toLowerCase() < b.slug.toLowerCase()) return -1;
      if (a.slug.toLowerCase() > b.slug.toLowerCase()) return 1;
      return 0;
    } else if (sortMode === "NAME_DESCENDING" /* NAME_DESCENDING */) {
      if (a.slug.toLowerCase() < b.slug.toLowerCase()) return 1;
      if (a.slug.toLowerCase() > b.slug.toLowerCase()) return -1;
      return 0;
    } else if (sortMode === "SIZE_DESCENDING" /* SIZE_DESCENDING */) {
      return b.size - a.size;
    } else if (sortMode === "SIZE_ASCENDING" /* SIZE_ASCENDING */) {
      return a.size - b.size;
    } else {
      return 0;
    }
  });
  const displayedFiles = getPagedMatches(
    filteredFiles,
    page,
    SEARCH_RESULTS_PER_PAGE
  );
  const updateFiles = async () => {
    const files2 = await notesProvider.getFiles();
    setFiles(files2);
    await updateDanglingFiles();
    setStatus("READY");
  };
  reactExports.useEffect(() => {
    if (!notesProvider) return;
    updateFiles();
  }, [notesProvider]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderContainerLeftRight, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "content-section-wide files-view", children: status === "READY" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: l$4(
        "files.files-heading",
        { numberOfFiles: files.length.toString() }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "controls",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                onChange: (e) => setSortMode(e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "option",
                    {
                      value: "CREATED_AT_DESCENDING" /* CREATED_AT_DESCENDING */,
                      children: l$4("files.sort-mode.created-at.descending")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "option",
                    {
                      value: "CREATED_AT_ASCENDING" /* CREATED_AT_ASCENDING */,
                      children: l$4("files.sort-mode.created-at.ascending")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "option",
                    {
                      value: "NAME_ASCENDING" /* NAME_ASCENDING */,
                      children: l$4("files.sort-mode.name.ascending")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "option",
                    {
                      value: "NAME_DESCENDING" /* NAME_DESCENDING */,
                      children: l$4("files.sort-mode.name.descending")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "option",
                    {
                      value: "SIZE_ASCENDING" /* SIZE_ASCENDING */,
                      children: l$4("files.sort-mode.size.ascending")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "option",
                    {
                      value: "SIZE_DESCENDING" /* SIZE_DESCENDING */,
                      children: l$4("files.sort-mode.size.descending")
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "filter",
                type: "search",
                placeholder: l$4("files.filter"),
                value: filterInput,
                onChange: (e) => {
                  setFilterInput(e.target.value);
                  setPage(1);
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "default-button-small",
                onClick: () => {
                  setFilterInput("ends-with:.neno.js");
                  setPage(1);
                },
                children: l$4("files.show-neno-scripts")
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Pagination,
        {
          numberOfResults: filteredFiles.length,
          page,
          searchResultsPerPage: SEARCH_RESULTS_PER_PAGE,
          onChange: (newPage) => setPage(newPage)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FlexContainer,
        {
          className: "files",
          children: displayedFiles.map((file) => {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              FilesViewPreviewBox,
              {
                file,
                isDangling: danglingFileSlugs.includes(file.slug)
              },
              "img_" + file.slug
            );
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CreateScript,
        {
          existingFiles: files,
          onCreated: () => updateFiles()
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: l$4("files.fetching") }) })
  ] });
};

const FileViewPreview = ({
  type,
  src,
  text
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    FlexContainer,
    {
      className: "file-container",
      children: [
        type === MediaType.IMAGE ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            className: "checkerboard-background",
            src,
            loading: "lazy"
          }
        ) : "",
        type === MediaType.AUDIO ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "audio",
          {
            src,
            controls: true
          }
        ) : "",
        type === MediaType.VIDEO ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            src,
            controls: true
          }
        ) : "",
        type === MediaType.PDF ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "iframe",
          {
            src
          }
        ) : "",
        type === MediaType.TEXT ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "pre",
          {
            className: "preview-block-file-text",
            children: text
          }
        ) : ""
      ]
    }
  );
};

const getRenameInput = (slug) => {
  return removeExtensionFromFilename(slug);
};
const FileView = () => {
  const notesProvider = useNotesProvider();
  const [fileInfo, setFileInfo] = reactExports.useState(null);
  const [src, setSrc] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState(null);
  const [text, setText] = reactExports.useState("");
  const { slug } = useParams();
  const [slugRenameInput, setSlugRenameInput] = reactExports.useState(
    slug ? getRenameInput(slug) : ""
  );
  const extension = slug ? getExtensionFromFilename(slug) : "";
  const [updateReferences, setUpdateReferences] = reactExports.useState(true);
  const navigate = useNavigate();
  const type = slug ? getMediaTypeFromFilename(slug) : null;
  const confirm = useConfirm();
  const canShowTextPreview = type === MediaType.TEXT;
  const isNenoScript = slug?.endsWith(NENO_SCRIPT_FILE_SUFFIX) ?? false;
  reactExports.useEffect(() => {
    if (typeof slug !== "string") return;
    const getFileInfo = async () => {
      const fileInfo2 = await notesProvider.getFileInfo(slug);
      setFileInfo(fileInfo2);
      const src2 = await getUrl(fileInfo2);
      setSrc(src2);
      if (canShowTextPreview) {
        fetch(src2).then((response) => response.text()).then((text2) => setText(text2));
      }
    };
    const getNotes = async () => {
      const response = await notesProvider.getNotesList({
        searchString: "has-file:" + slug
      });
      setNotes(response.results);
    };
    getFileInfo();
    getNotes();
  }, [notesProvider, slug]);
  const canShowPreview = type !== MediaType.OTHER;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeaderContainerLeftRight,
      {
        leftContent: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-controls", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HeaderButton,
            {
              icon: "list",
              onClick: () => {
                navigate(
                  getAppPath(
                    PathTemplate.FILES,
                    /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
                  )
                );
              },
              children: l$4("files.show-all-files")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HeaderButton,
            {
              icon: "add",
              disabled: !fileInfo,
              onClick: async () => {
                if (!fileInfo) return;
                navigate(getAppPath(
                  PathTemplate.NEW_NOTE,
                  /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
                ), {
                  state: {
                    contentIfNewNote: createContentFromSlugs([
                      fileInfo.slug
                    ])
                  }
                });
              },
              children: l$4("files.create-note-with-file")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HeaderButton,
            {
              icon: "file_download",
              onClick: async () => {
                if (!fileInfo) return;
                await saveFile(fileInfo.slug);
              },
              children: l$4("files.save-duplicate")
            }
          ),
          isNenoScript ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            HeaderButton,
            {
              icon: "create",
              onClick: async () => {
                if (!fileInfo) return;
                navigate(getAppPath(
                  PathTemplate.SCRIPT,
                  /* @__PURE__ */ new Map([
                    ["GRAPH_ID", LOCAL_GRAPH_ID],
                    ["SCRIPT_SLUG", fileInfo.slug]
                  ])
                ));
              },
              children: l$4("files.open-in-script-editor")
            }
          ) : "",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HeaderButton,
            {
              icon: "delete",
              dangerous: true,
              disabled: !fileInfo,
              onClick: async () => {
                if (!fileInfo) return;
                await confirm({
                  text: l$4("files.confirm-delete"),
                  confirmText: l$4("files.confirm-delete.confirm"),
                  cancelText: l$4("dialog.cancel"),
                  encourageConfirmation: false
                });
                await notesProvider.deleteFile(fileInfo.slug);
                navigate(getAppPath(
                  PathTemplate.FILES,
                  /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
                ));
              },
              children: l$4("files.delete")
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "content-section-wide file-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: fileInfo ? fileInfo.slug : "" }),
      canShowPreview && type ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        FileViewPreview,
        {
          type,
          src,
          text
        }
      ) : "",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        fileInfo ? humanFileSize(fileInfo.size) : "",
        SPAN_SEPARATOR,
        fileInfo ? l$4("stats.metadata.created-at") + ": " + ISOTimestampToLocaleString(fileInfo.createdAt) : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: l$4("files.used-in") }),
      notes ? notes.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: notes.map((note) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: getAppPath(
              PathTemplate.EXISTING_NOTE,
              /* @__PURE__ */ new Map([
                ["GRAPH_ID", LOCAL_GRAPH_ID],
                ["SLUG", note.slug]
              ])
            ),
            children: note.title
          }
        ) }, "notelink-" + note.slug);
      }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: l$4("files.used-in.none") }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        BusyIndicator,
        {
          alt: l$4("app.loading"),
          height: 30
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: l$4("files.rename") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rename", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rename-section-input-line", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "file-slug-rename-input", children: [
            l$4("files.rename.new-slug"),
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "file-slug-rename-input",
                type: "text",
                value: slugRenameInput,
                onInput: (e) => {
                  const element = e.currentTarget;
                  const newValue = element.value.replace(
                    // In the input field, we also allow \p{SK} modifiers, as
                    // they are used to create a full letter with modifier in a
                    // second step. They are not valid slug characters on
                    // their own, though.
                    // We also allow apostrophes ('), as they might be used as a
                    // dead key for letters like é.
                    // Unfortunately, it seems like we cannot simulate pressing
                    // dead keys in Playwright currently, so we cannot
                    // add a meaningful test for this.
                    /[^\p{L}\p{Sk}\d\-/._']/gu,
                    ""
                  ).toLowerCase();
                  setSlugRenameInput(newValue);
                }
              }
            ),
            typeof extension === "string" ? `.${extension}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "update-references", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "switch", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: updateReferences,
                onChange: (e) => {
                  setUpdateReferences(e.target.checked);
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "slider round" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "update-references-toggle-text", children: l$4("note.slug.update-references") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            disabled: slugRenameInput === getRenameInput(slug || "") || !isValidFileSlug(slugRenameInput),
            className: "default-button-small dangerous-action",
            onClick: async () => {
              if (!slug || slugRenameInput === getRenameInput(slug || "") || !isValidFileSlug(slugRenameInput)) return;
              const newSlug = slugRenameInput + (typeof extension === "string" ? +"." + extension : "");
              try {
                const newFileInfo = await notesProvider.renameFile(
                  slug,
                  newSlug,
                  updateReferences
                );
                const src2 = await getUrl(newFileInfo);
                setFileInfo(newFileInfo);
                setSrc(src2);
                navigate(getAppPath(
                  PathTemplate.FILE,
                  /* @__PURE__ */ new Map([
                    ["GRAPH_ID", LOCAL_GRAPH_ID],
                    ["FILE_SLUG", newSlug]
                  ])
                ), {
                  replace: true
                });
              } catch (e) {
                console.error(e);
              }
            },
            children: l$4("files.rename")
          }
        )
      ] })
    ] })
  ] });
};

const StatsViewAnalysisTable = ({
  stats
}) => {
  const {
    numberOfAllNotes,
    numberOfUnlinkedNotes,
    numberOfLinks,
    analysis,
    numberOfAliases
  } = stats;
  const percentageOfUnlinkedNotes = numberOfAllNotes > 0 ? Math.round(
    numberOfUnlinkedNotes / numberOfAllNotes * 100 * 100
  ) / 100 : NaN;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "data-table", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.metadata.created-at") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: ISOTimestampToLocaleString(stats.metadata.createdAt) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.metadata.updated-at") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: ISOTimestampToLocaleString(stats.metadata.updatedAt) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.analysis.notes") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: numberOfAllNotes.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.analysis.aliases") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: numberOfAliases.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.analysis.notes-and-aliases") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: (numberOfAllNotes + numberOfAliases).toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.analysis.links") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: numberOfLinks.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.unlinked-notes") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: numberOfUnlinkedNotes.toLocaleString() + (numberOfAllNotes > 0 ? ` (${percentageOfUnlinkedNotes.toLocaleString()} %)` : "") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: lf("stats.analysis.components") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: analysis.numberOfComponents.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.analysis.components-with-more-than-one-node") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: analysis.numberOfComponentsWithMoreThanOneNode.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: lf("stats.analysis.cyclomatic-number") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: (numberOfLinks - numberOfAllNotes + analysis.numberOfComponents).toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.metadata.size-of-notes") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: humanFileSize(stats.metadata.size.notes) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.metadata.size-of-all-files") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: humanFileSize(stats.metadata.size.files) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.metadata.total-storage-size") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: humanFileSize(stats.metadata.size.total) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.metadata.number-of-files") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: stats.numberOfFiles.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.metadata.pins") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: stats.numberOfPins.toLocaleString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: l$4("stats.metadata.graph-version") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: stats.metadata.version })
    ] })
  ] }) });
};

const StatsView = () => {
  const notesProvider = useNotesProvider();
  const [stats, setStats] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const updateStats = async () => {
      const stats2 = await notesProvider.getStats({
        includeMetadata: true,
        includeAnalysis: true
      });
      setStats(stats2);
    };
    updateStats();
  }, [notesProvider]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderContainerLeftRight, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "content-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: l$4("stats.graph-stats") }),
      stats !== null ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatsViewAnalysisTable,
        {
          stats
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        BusyIndicator,
        {
          alt: l$4("stats.fetching"),
          height: 64
        }
      )
    ] })
  ] });
};

const ChangeLanguageSetting = () => {
  const activeLanguage = getActiveLanguage();
  const languages = supportedLangs;
  const [selectedLanguage, setSelectedLanguage] = reactExports.useState(activeLanguage);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setting", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: l$4("change-language.heading") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "select",
      {
        value: selectedLanguage,
        autoFocus: true,
        onChange: (e) => setSelectedLanguage(e.target.value),
        children: languages.map((language) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "option",
            {
              value: language,
              children: language
            },
            language
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          setLanguage(selectedLanguage);
        },
        className: "default-button dialog-box-button default-action",
        children: l$4("change-language.change")
      }
    ) })
  ] });
};

const SettingsView = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderContainerLeftRight, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "content-section-wide file-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: l$4("settings") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChangeLanguageSetting, {})
    ] })
  ] });
};

const BusyView = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "busy-view", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BusyIndicator, { height: 80, alt: l$4("app.loading") }) });
};

const useRunOnce = (fn) => {
  const hasRun = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!hasRun.current) {
      fn();
      hasRun.current = true;
    }
  }, []);
};

const NoteAccessProvider = ({
  children
}) => {
  const [isReady, setIsReady] = reactExports.useState(false);
  const navigate = useNavigate();
  useRunOnce(() => {
    if (!isInitialized()) {
      initializeNotesProviderWithFolderHandleFromStorage().then(() => {
        setIsReady(true);
      }).catch(() => {
        const urlParams = new URLSearchParams();
        urlParams.set(
          "redirect",
          window.location.pathname.substring(ROOT_PATH.length - 1)
        );
        navigate(getAppPath(PathTemplate.START, /* @__PURE__ */ new Map(), urlParams));
      });
    } else {
      setIsReady(true);
    }
  });
  if (!isReady) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(BusyView, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    NotesProviderContext.Provider,
    {
      value: getNotesProvider(),
      children
    }
  );
};

const noteWorkerUrl = "/neno/assets/index-Cj4X1xWC.js";

function WorkerWrapper(options) {
          return new Worker(
            "/neno/assets/ts.worker-DwcL78oh.js",
            {
        type: "module",
        name: options?.name
      }
          );
        }

const ScriptView = () => {
  const [activeScript, setActiveScript] = reactExports.useState(null);
  const [scriptInput, setScriptInput] = reactExports.useState(null);
  const [output, setOutput] = reactExports.useState(null);
  const [isBusyComputingOutput, setIsBusyComputingOutput] = reactExports.useState(
    false
  );
  const [worker, setWorker] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [unsavedChanges, setUnsavedChanges] = reactExports.useContext(UnsavedChangesContext);
  const [saveInProgress, setSaveInProgress] = reactExports.useState(false);
  const notesProvider = useNotesProvider();
  const { slug } = useParams();
  const navigate = useNavigate();
  const editorContainerRef = reactExports.useRef(null);
  useRunOnce(async () => {
    if (typeof slug !== "string") return;
    try {
      const readable = await notesProvider.getReadableFileStream(
        slug
      );
      const value = await new Response(readable).text();
      setActiveScript({
        slug,
        value
      });
      setScriptInput(value);
    } catch (e) {
      setError("SCRIPT_NOT_FOUND");
    }
  });
  useRunOnce(() => {
    const notesWorker = new Worker(noteWorkerUrl, { type: "module" });
    notesWorker.postMessage({
      action: "initialize",
      folderHandle: getActiveFolderHandle()
    });
    notesWorker.onmessage = (e) => {
      if (e.data.type === "EVALUATION_COMPLETED") {
        setIsBusyComputingOutput(false);
        setOutput(e.data.output);
      }
    };
    setWorker(notesWorker);
  });
  reactExports.useEffect(() => {
    if (!activeScript) return;
    globalThis.MonacoEnvironment = {
      getWorker: function() {
        return new WorkerWrapper();
      }
    };
    const containerElement = editorContainerRef.current;
    if (!containerElement) {
      throw new Error("Code editor container not ready!");
    }
    __vitePreload(() => import('./editor.main-D3FeRMV7.js').then(n => n.e),true?__vite__mapDeps([0,1]):void 0).then((module) => {
      const monacoEditor = module.editor;
      const editor = monacoEditor.create(containerElement, {
        value: scriptInput || "",
        language: "javascript",
        minimap: {
          enabled: false
        },
        fontSize: 16,
        fontFamily: "IBM Plex Mono",
        theme: "vs-dark"
      });
      editor.onDidChangeModelContent(() => {
        const newValue = editor.getValue();
        setScriptInput(newValue);
        setUnsavedChanges(true);
      });
    });
  }, [activeScript]);
  reactExports.useEffect(() => {
    return () => {
      invalidateNotesProvider();
    };
  }, []);
  const handleSaveRequest = async () => {
    if (!slug || !scriptInput) return;
    setSaveInProgress(true);
    const readable = new Blob(
      [scriptInput],
      { type: "text/plain" }
    ).stream();
    await notesProvider.updateFile(
      readable,
      slug
    );
    setUnsavedChanges(false);
    setSaveInProgress(false);
  };
  useKeyboardShortcuts({
    onSave: () => {
      handleSaveRequest();
    }
  });
  const confirmDiscardingUnsavedChanges = useConfirmDiscardingUnsavedChangesDialog();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeaderContainerLeftRight,
      {
        leftContent: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-controls", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HeaderButton,
            {
              icon: "list",
              onClick: async () => {
                if (unsavedChanges) {
                  await confirmDiscardingUnsavedChanges();
                  setUnsavedChanges(false);
                }
                navigate(
                  getAppPath(
                    PathTemplate.FILES,
                    /* @__PURE__ */ new Map([["GRAPH_ID", LOCAL_GRAPH_ID]])
                  )
                );
              },
              children: l$4("files.all-files")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HeaderButton,
            {
              icon: "play_arrow",
              disabled: !activeScript,
              onClick: async () => {
                setIsBusyComputingOutput(true);
                worker?.postMessage({
                  action: "evaluate",
                  script: scriptInput
                });
              },
              children: l$4("scripts.run")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HeaderButton,
            {
              icon: "save",
              disabled: !activeScript,
              onClick: () => {
                handleSaveRequest();
              },
              children: l$4("scripts.save")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HeaderButton,
            {
              icon: "description",
              onClick: async () => {
                if (unsavedChanges) {
                  await confirmDiscardingUnsavedChanges();
                  setUnsavedChanges(false);
                }
                navigate(
                  getAppPath(
                    PathTemplate.FILE,
                    /* @__PURE__ */ new Map([
                      ["GRAPH_ID", LOCAL_GRAPH_ID],
                      ["FILE_SLUG", slug || ""]
                    ])
                  )
                );
              },
              children: l$4("scripts.show-file-properties")
            }
          )
        ] })
      }
    ),
    activeScript ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "script-view-main active-script", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editor-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "title-bar", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: activeScript.slug }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatusIndicator,
            {
              isNew: false,
              hasUnsavedChanges: unsavedChanges,
              isEverythingSaved: !unsavedChanges,
              isUploading: saveInProgress
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            id: "editor-container",
            ref: editorContainerRef
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "output-section", children: isBusyComputingOutput ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        BusyIndicator,
        {
          alt: "Busy",
          height: 100
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "script-output", children: output ?? "" }) })
    ] }) : error === "SCRIPT_NOT_FOUND" ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Script not found." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "script-view-main-busy", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BusyIndicator, { height: 100, alt: "Loading script" }) })
  ] });
};

const AppRouter = () => {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: getAppPath(
          PathTemplate.NEW_NOTE,
          /* @__PURE__ */ new Map([["GRAPH_ID", "local"]]),
          void 0,
          true
        ), replace: true })
      },
      {
        path: getAppPath(PathTemplate.START),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(StartView, {})
      },
      {
        path: getAppPath(
          PathTemplate.UNSELECTED_NOTE,
          /* @__PURE__ */ new Map([["GRAPH_ID", ":graphId"]]),
          void 0,
          true
        ),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: getAppPath(
          PathTemplate.NEW_NOTE,
          /* @__PURE__ */ new Map([["GRAPH_ID", "local"]]),
          void 0,
          true
        ), replace: true })
      },
      {
        path: getAppPath(
          PathTemplate.EXISTING_NOTE,
          /* @__PURE__ */ new Map([
            ["SLUG", ":slug"],
            ["GRAPH_ID", ":graphId"]
          ]),
          void 0,
          true
        ),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteAccessProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteViewWithEditorContext, {}) })
      },
      {
        path: getAppPath(
          PathTemplate.LIST,
          /* @__PURE__ */ new Map([["GRAPH_ID", ":graphId"]]),
          void 0,
          true
        ),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteAccessProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListView, {}) })
      },
      {
        path: getAppPath(
          PathTemplate.FILES,
          /* @__PURE__ */ new Map([["GRAPH_ID", ":graphId"]]),
          void 0,
          true
        ),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteAccessProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FilesView, {}) })
      },
      {
        path: getAppPath(
          PathTemplate.FILE,
          /* @__PURE__ */ new Map([
            ["GRAPH_ID", ":graphId"],
            ["FILE_SLUG", ":slug"]
          ]),
          void 0,
          true
        ),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteAccessProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileView, {}) })
      },
      {
        path: getAppPath(
          PathTemplate.SCRIPT,
          /* @__PURE__ */ new Map([
            ["GRAPH_ID", ":graphId"],
            ["SCRIPT_SLUG", ":slug"]
          ]),
          void 0,
          true
        ),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteAccessProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScriptView, {}) })
      },
      {
        path: getAppPath(
          PathTemplate.STATS,
          /* @__PURE__ */ new Map([["GRAPH_ID", ":graphId"]]),
          void 0,
          true
        ),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(NoteAccessProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatsView, {}) })
      },
      {
        path: getAppPath(PathTemplate.SETTINGS),
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsView, {})
      }
    ],
    {
      basename: ROOT_PATH
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RouterProvider, { router });
};

const useWarnBeforeUnload = (isEnabled) => {
  const beforeUnload = function(e) {
    if (isEnabled) {
      e.preventDefault();
      e.returnValue = "";
    } else {
      delete e.returnValue;
    }
  };
  reactExports.useEffect(() => {
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [beforeUnload]);
};

const App = () => {
  const [unsavedChanges, setUnsavedChanges] = reactExports.useState(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = reactExports.useState(false);
  const appMenuControl = {
    isAppMenuOpen,
    setIsAppMenuOpen,
    toggleAppMenu: () => setIsAppMenuOpen(!isAppMenuOpen)
  };
  const notesProvider = getNotesProvider();
  useWarnBeforeUnload(unsavedChanges);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(NotesProviderContext.Provider, { value: notesProvider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmationServiceProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    UnsavedChangesContext.Provider,
    {
      value: [unsavedChanges, setUnsavedChanges],
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppMenuContext.Provider, { value: appMenuControl, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppRouter, {}) })
    }
  ) }) });
};

const appContainer = document.getElementById("app");
const root = createRoot(appContainer);
root.render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);

export { __vitePreload as _ };
