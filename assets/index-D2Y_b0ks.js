const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/editor.main-DMJQtP5i.js","assets/editor-I_pgZkZi.css"])))=>i.map(i=>d[i]);
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
var l$6=Symbol.for("react.element"),n$2=Symbol.for("react.portal"),p$7=Symbol.for("react.fragment"),q$2=Symbol.for("react.strict_mode"),r$3=Symbol.for("react.profiler"),t$2=Symbol.for("react.provider"),u$4=Symbol.for("react.context"),v$3=Symbol.for("react.forward_ref"),w$2=Symbol.for("react.suspense"),x$4=Symbol.for("react.memo"),y$2=Symbol.for("react.lazy"),z$2=Symbol.iterator;function A$2(a){if(null===a||"object"!==typeof a)return null;a=z$2&&a[z$2]||a["@@iterator"];return "function"===typeof a?a:null}
var B$2={isMounted:function(){return !1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C$3=Object.assign,D$3={};function E$2(a,b,e){this.props=a;this.context=b;this.refs=D$3;this.updater=e||B$2;}E$2.prototype.isReactComponent={};
E$2.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,b,"setState");};E$2.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};function F(){}F.prototype=E$2.prototype;function G$2(a,b,e){this.props=a;this.context=b;this.refs=D$3;this.updater=e||B$2;}var H$2=G$2.prototype=new F;
H$2.constructor=G$2;C$3(H$2,E$2.prototype);H$2.isPureReactComponent=!0;var I$2=Array.isArray,J$1=Object.prototype.hasOwnProperty,K$2={current:null},L$3={key:!0,ref:!0,__self:!0,__source:!0};
function M$4(a,b,e){var d,c={},k=null,h=null;if(null!=b)for(d in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)J$1.call(b,d)&&!L$3.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(1===g)c.children=e;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];c.children=f;}if(a&&a.defaultProps)for(d in g=a.defaultProps,g)void 0===c[d]&&(c[d]=g[d]);return {$$typeof:l$6,type:a,key:k,ref:h,props:c,_owner:K$2.current}}
function N$2(a,b){return {$$typeof:l$6,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function O$2(a){return "object"===typeof a&&null!==a&&a.$$typeof===l$6}function escape(a){var b={"=":"=0",":":"=2"};return "$"+a.replace(/[=:]/g,function(a){return b[a]})}var P$1=/\/+/g;function Q$2(a,b){return "object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function R$2(a,b,e,d,c){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case l$6:case n$2:h=!0;}}if(h)return h=a,c=c(h),a=""===d?"."+Q$2(h,0):d,I$2(c)?(e="",null!=a&&(e=a.replace(P$1,"$&/")+"/"),R$2(c,b,e,"",function(a){return a})):null!=c&&(O$2(c)&&(c=N$2(c,e+(!c.key||h&&h.key===c.key?"":(""+c.key).replace(P$1,"$&/")+"/")+a)),b.push(c)),1;h=0;d=""===d?".":d+":";if(I$2(a))for(var g=0;g<a.length;g++){k=
a[g];var f=d+Q$2(k,g);h+=R$2(k,b,e,f,c);}else if(f=A$2(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=d+Q$2(k,g++),h+=R$2(k,b,e,f,c);else if("object"===k)throw b=String(a),Error("Objects are not valid as a React child (found: "+("[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}
function S$3(a,b,e){if(null==a)return a;var d=[],c=0;R$2(a,d,"","",function(a){return b.call(e,a,c++)});return d}function T$3(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b;},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b;});-1===a._status&&(a._status=0,a._result=b);}if(1===a._status)return a._result.default;throw a._result;}
var U$2={current:null},V$2={transition:null},W$2={ReactCurrentDispatcher:U$2,ReactCurrentBatchConfig:V$2,ReactCurrentOwner:K$2};function X$2(){throw Error("act(...) is not supported in production builds of React.");}
react_production_min.Children={map:S$3,forEach:function(a,b,e){S$3(a,function(){b.apply(this,arguments);},e);},count:function(a){var b=0;S$3(a,function(){b++;});return b},toArray:function(a){return S$3(a,function(a){return a})||[]},only:function(a){if(!O$2(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};react_production_min.Component=E$2;react_production_min.Fragment=p$7;react_production_min.Profiler=r$3;react_production_min.PureComponent=G$2;react_production_min.StrictMode=q$2;react_production_min.Suspense=w$2;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W$2;react_production_min.act=X$2;
react_production_min.cloneElement=function(a,b,e){if(null===a||void 0===a)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var d=C$3({},a.props),c=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=K$2.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)J$1.call(b,f)&&!L$3.hasOwnProperty(f)&&(d[f]=void 0===b[f]&&void 0!==g?g[f]:b[f]);}var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){g=Array(f);
for(var m=0;m<f;m++)g[m]=arguments[m+2];d.children=g;}return {$$typeof:l$6,type:a.type,key:c,ref:k,props:d,_owner:h}};react_production_min.createContext=function(a){a={$$typeof:u$4,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};a.Provider={$$typeof:t$2,_context:a};return a.Consumer=a};react_production_min.createElement=M$4;react_production_min.createFactory=function(a){var b=M$4.bind(null,a);b.type=a;return b};react_production_min.createRef=function(){return {current:null}};
react_production_min.forwardRef=function(a){return {$$typeof:v$3,render:a}};react_production_min.isValidElement=O$2;react_production_min.lazy=function(a){return {$$typeof:y$2,_payload:{_status:-1,_result:a},_init:T$3}};react_production_min.memo=function(a,b){return {$$typeof:x$4,type:a,compare:void 0===b?null:b}};react_production_min.startTransition=function(a){var b=V$2.transition;V$2.transition={};try{a();}finally{V$2.transition=b;}};react_production_min.unstable_act=X$2;react_production_min.useCallback=function(a,b){return U$2.current.useCallback(a,b)};react_production_min.useContext=function(a){return U$2.current.useContext(a)};
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
var f$4=reactExports,k$2=Symbol.for("react.element"),l$5=Symbol.for("react.fragment"),m$7=Object.prototype.hasOwnProperty,n$1=f$4.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p$6={key:!0,ref:!0,__self:!0,__source:!0};
function q$1(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m$7.call(a,b)&&!p$6.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k$2,type:c,key:e,ref:h,props:d,_owner:n$1.current}}reactJsxRuntime_production_min.Fragment=l$5;reactJsxRuntime_production_min.jsx=q$1;reactJsxRuntime_production_min.jsxs=q$1;

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
var aa=reactExports,ca=schedulerExports;function p$5(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return "Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var da=new Set,ea={};function fa(a,b){ha(a,b);ha(a+"Capture",b);}
function ha(a,b){ea[a]=b;for(a=0;a<b.length;a++)da.add(b[a]);}
var ia=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ja=Object.prototype.hasOwnProperty,ka=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,la=
{},ma={};function oa(a){if(ja.call(ma,a))return !0;if(ja.call(la,a))return !1;if(ka.test(a))return ma[a]=!0;la[a]=!0;return !1}function pa(a,b,c,d){if(null!==c&&0===c.type)return !1;switch(typeof b){case "function":case "symbol":return !0;case "boolean":if(d)return !1;if(null!==c)return !c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return "data-"!==a&&"aria-"!==a;default:return !1}}
function qa(a,b,c,d){if(null===b||"undefined"===typeof b||pa(a,b,c,d))return !0;if(d)return !1;if(null!==c)switch(c.type){case 3:return !b;case 4:return !1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return !1}function v$2(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g;}var z$1={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){z$1[a]=new v$2(a,0,!1,a,null,!1,!1);});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];z$1[b]=new v$2(b,1,!1,a[1],null,!1,!1);});["contentEditable","draggable","spellCheck","value"].forEach(function(a){z$1[a]=new v$2(a,2,!1,a.toLowerCase(),null,!1,!1);});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){z$1[a]=new v$2(a,2,!1,a,null,!1,!1);});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){z$1[a]=new v$2(a,3,!1,a.toLowerCase(),null,!1,!1);});
["checked","multiple","muted","selected"].forEach(function(a){z$1[a]=new v$2(a,3,!0,a,null,!1,!1);});["capture","download"].forEach(function(a){z$1[a]=new v$2(a,4,!1,a,null,!1,!1);});["cols","rows","size","span"].forEach(function(a){z$1[a]=new v$2(a,6,!1,a,null,!1,!1);});["rowSpan","start"].forEach(function(a){z$1[a]=new v$2(a,5,!1,a.toLowerCase(),null,!1,!1);});var ra=/[\-:]([a-z])/g;function sa(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(ra,
sa);z$1[b]=new v$2(b,1,!1,a,null,!1,!1);});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(ra,sa);z$1[b]=new v$2(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1);});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(ra,sa);z$1[b]=new v$2(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1);});["tabIndex","crossOrigin"].forEach(function(a){z$1[a]=new v$2(a,1,!1,a.toLowerCase(),null,!1,!1);});
z$1.xlinkHref=new v$2("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){z$1[a]=new v$2(a,1,!1,a.toLowerCase(),null,!0,!0);});
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
function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(p$5(91));return A$1({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(p$5(92));if(eb(c)){if(1<c.length)throw Error(p$5(93));c=c[0];}b=c;}null==b&&(b="");c=b;}a._wrapperState={initialValue:Sa(c)};}
function ib(a,b){var c=Sa(b.value),d=Sa(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d);}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b);}function kb(a){switch(a){case "svg":return "http://www.w3.org/2000/svg";case "math":return "http://www.w3.org/1998/Math/MathML";default:return "http://www.w3.org/1999/xhtml"}}
function lb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?kb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
var mb,nb=function(a){return "undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)});}:a}(function(a,b){if("http://www.w3.org/2000/svg"!==a.namespaceURI||"innerHTML"in a)a.innerHTML=b;else {mb=mb||document.createElement("div");mb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=mb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild);}});
function ob(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b;}
var pb={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,
zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},qb=["Webkit","ms","Moz","O"];Object.keys(pb).forEach(function(a){qb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);pb[b]=pb[a];});});function rb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||pb.hasOwnProperty(a)&&pb[a]?(""+b).trim():b+"px"}
function sb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=rb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e;}}var tb=A$1({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
function ub(a,b){if(b){if(tb[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(p$5(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(p$5(60));if("object"!==typeof b.dangerouslySetInnerHTML||!("__html"in b.dangerouslySetInnerHTML))throw Error(p$5(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(p$5(62));}}
function vb(a,b){if(-1===a.indexOf("-"))return "string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return !1;default:return !0}}var wb=null;function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(p$5(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b));}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a;}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a]);}}function Gb(a,b){return a(b)}function Hb(){}var Ib=!1;function Jb(a,b,c){if(Ib)return a(b,c);Ib=!0;try{return Gb(a,b,c)}finally{if(Ib=!1,null!==zb||null!==Ab)Hb(),Fb();}}
function Kb(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1;}if(a)return null;if(c&&"function"!==
typeof c)throw Error(p$5(231,b,typeof c));return c}var Lb=!1;if(ia)try{var Mb={};Object.defineProperty(Mb,"passive",{get:function(){Lb=!0;}});window.addEventListener("test",Mb,Mb);window.removeEventListener("test",Mb,Mb);}catch(a){Lb=!1;}function Nb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l);}catch(m){this.onError(m);}}var Ob=!1,Pb=null,Qb=!1,Rb=null,Sb={onError:function(a){Ob=!0;Pb=a;}};function Tb(a,b,c,d,e,f,g,h,k){Ob=!1;Pb=null;Nb.apply(Sb,arguments);}
function Ub(a,b,c,d,e,f,g,h,k){Tb.apply(this,arguments);if(Ob){if(Ob){var l=Pb;Ob=!1;Pb=null;}else throw Error(p$5(198));Qb||(Qb=!0,Rb=l);}}function Vb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else {a=b;do b=a,0!==(b.flags&4098)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function Wb(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function Xb(a){if(Vb(a)!==a)throw Error(p$5(188));}
function Yb(a){var b=a.alternate;if(!b){b=Vb(a);if(null===b)throw Error(p$5(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return Xb(e),a;if(f===d)return Xb(e),b;f=f.sibling;}throw Error(p$5(188));}if(c.return!==d.return)c=e,d=f;else {for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling;}if(!g){for(h=f.child;h;){if(h===
c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling;}if(!g)throw Error(p$5(189));}}if(c.alternate!==d)throw Error(p$5(190));}if(3!==c.tag)throw Error(p$5(188));return c.stateNode.current===c?a:b}function Zb(a){a=Yb(a);return null!==a?$b(a):null}function $b(a){if(5===a.tag||6===a.tag)return a;for(a=a.child;null!==a;){var b=$b(a);if(null!==b)return b;a=a.sibling;}return null}
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
function ge$1(a,b){switch(a){case "keyup":return -1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return !0;default:return !1}}function he$1(a){a=a.detail;return "object"===typeof a&&"data"in a?a.data:null}var ie$1=!1;function je$1(a,b){switch(a){case "compositionend":return he$1(b);case "keypress":if(32!==b.which)return null;fe$1=!0;return ee$1;case "textInput":return a=b.data,a===ee$1&&fe$1?null:a;default:return null}}
function ke$1(a,b){if(ie$1)return "compositionend"===a||!ae$1&&ge$1(a,b)?(a=nd(),md=ld=kd=null,ie$1=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de$1&&"ko"!==b.locale?null:b.data;default:return null}}
var le$1={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function me$1(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return "input"===b?!!le$1[a.type]:"textarea"===b?!0:!1}function ne$1(a,b,c,d){Eb(d);b=oe$1(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}));}var pe$1=null,qe=null;function re$1(a){se(a,0);}function te$2(a){var b=ue$1(a);if(Wa(b))return a}
function ve$1(a,b){if("change"===a)return b}var we$1=!1;if(ia){var xe$1;if(ia){var ye$1="oninput"in document;if(!ye$1){var ze$1=document.createElement("div");ze$1.setAttribute("oninput","return;");ye$1="function"===typeof ze$1.oninput;}xe$1=ye$1;}else xe$1=!1;we$1=xe$1&&(!document.documentMode||9<document.documentMode);}function Ae$1(){pe$1&&(pe$1.detachEvent("onpropertychange",Be$1),qe=pe$1=null);}function Be$1(a){if("value"===a.propertyName&&te$2(qe)){var b=[];ne$1(b,qe,a,xb(a));Jb(re$1,b);}}
function Ce$1(a,b,c){"focusin"===a?(Ae$1(),pe$1=b,qe=c,pe$1.attachEvent("onpropertychange",Be$1)):"focusout"===a&&Ae$1();}function De$1(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te$2(qe)}function Ee$1(a,b){if("click"===a)return te$2(b)}function Fe$1(a,b){if("input"===a||"change"===a)return te$2(b)}function Ge$1(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He$1="function"===typeof Object.is?Object.is:Ge$1;
function Ie$1(a,b){if(He$1(a,b))return !0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return !1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return !1;for(d=0;d<c.length;d++){var e=c[d];if(!ja.call(b,e)||!He$1(a[e],b[e]))return !1}return !0}function Je$1(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
function Ke$1(a,b){var c=Je$1(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return {node:c,offset:b-a};a=d;}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode;}c=void 0;}c=Je$1(c);}}function Le$1(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Le$1(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
function Me$1(){for(var a=window,b=Xa();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href;}catch(d){c=!1;}if(c)a=b.contentWindow;else break;b=Xa(a.document);}return b}function Ne$1(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
function Oe$1(a){var b=Me$1(),c=a.focusedElem,d=a.selectionRange;if(b!==c&&c&&c.ownerDocument&&Le$1(c.ownerDocument.documentElement,c)){if(null!==d&&Ne$1(c))if(b=d.start,a=d.end,void 0===a&&(a=b),"selectionStart"in c)c.selectionStart=b,c.selectionEnd=Math.min(a,c.value.length);else if(a=(b=c.ownerDocument||document)&&b.defaultView||window,a.getSelection){a=a.getSelection();var e=c.textContent.length,f=Math.min(d.start,e);d=void 0===d.end?f:Math.min(d.end,e);!a.extend&&f>d&&(e=d,d=f,f=e);e=Ke$1(c,f);var g=Ke$1(c,
d);e&&g&&(1!==a.rangeCount||a.anchorNode!==e.node||a.anchorOffset!==e.offset||a.focusNode!==g.node||a.focusOffset!==g.offset)&&(b=b.createRange(),b.setStart(e.node,e.offset),a.removeAllRanges(),f>d?(a.addRange(b),a.extend(g.node,g.offset)):(b.setEnd(g.node,g.offset),a.addRange(b)));}b=[];for(a=c;a=a.parentNode;)1===a.nodeType&&b.push({element:a,left:a.scrollLeft,top:a.scrollTop});"function"===typeof c.focus&&c.focus();for(c=0;c<b.length;c++)a=b[c],a.element.scrollLeft=a.left,a.element.scrollTop=a.top;}}
var Pe$1=ia&&"documentMode"in document&&11>=document.documentMode,Qe$1=null,Re$1=null,Se$1=null,Te$1=!1;
function Ue$1(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te$1||null==Qe$1||Qe$1!==Xa(d)||(d=Qe$1,"selectionStart"in d&&Ne$1(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se$1&&Ie$1(Se$1,d)||(Se$1=d,d=oe$1(Re$1,"onSelect"),0<d.length&&(b=new td("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe$1)));}
function Ve$1(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var We$1={animationend:Ve$1("Animation","AnimationEnd"),animationiteration:Ve$1("Animation","AnimationIteration"),animationstart:Ve$1("Animation","AnimationStart"),transitionend:Ve$1("Transition","TransitionEnd")},Xe$1={},Ye$1={};
ia&&(Ye$1=document.createElement("div").style,"AnimationEvent"in window||(delete We$1.animationend.animation,delete We$1.animationiteration.animation,delete We$1.animationstart.animation),"TransitionEvent"in window||delete We$1.transitionend.transition);function Ze$1(a){if(Xe$1[a])return Xe$1[a];if(!We$1[a])return a;var b=We$1[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Ye$1)return Xe$1[a]=b[c];return a}var $e$1=Ze$1("animationend"),af=Ze$1("animationiteration"),bf=Ze$1("animationstart"),cf=Ze$1("transitionend"),df=new Map,ef="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a,b){df.set(a,b);fa(b,[a]);}for(var gf=0;gf<ef.length;gf++){var hf=ef[gf],jf=hf.toLowerCase(),kf=hf[0].toUpperCase()+hf.slice(1);ff(jf,"on"+kf);}ff($e$1,"onAnimationEnd");ff(af,"onAnimationIteration");ff(bf,"onAnimationStart");ff("dblclick","onDoubleClick");ff("focusin","onFocus");ff("focusout","onBlur");ff(cf,"onTransitionEnd");ha("onMouseEnter",["mouseout","mouseover"]);ha("onMouseLeave",["mouseout","mouseover"]);ha("onPointerEnter",["pointerout","pointerover"]);
ha("onPointerLeave",["pointerout","pointerover"]);fa("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));fa("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));fa("onBeforeInput",["compositionend","keypress","textInput","paste"]);fa("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));fa("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var lf$1="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),mf=new Set("cancel close invalid load scroll toggle".split(" ").concat(lf$1));
function nf(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Ub(d,b,void 0,a);a.currentTarget=null;}
function se(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k;}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k;}}}if(Qb)throw a=Rb,Qb=!1,Rb=null,a;}
function D$2(a,b){var c=b[of];void 0===c&&(c=b[of]=new Set);var d=a+"__bubble";c.has(d)||(pf(b,a,2,!1),c.add(d));}function qf(a,b,c){var d=0;b&&(d|=4);pf(c,a,d,b);}var rf="_reactListening"+Math.random().toString(36).slice(2);function sf(a){if(!a[rf]){a[rf]=!0;da.forEach(function(b){"selectionchange"!==b&&(mf.has(b)||qf(b,!1,a),qf(b,!0,a));});var b=9===a.nodeType?a:a.ownerDocument;null===b||b[rf]||(b[rf]=!0,qf("selectionchange",!1,b));}}
function pf(a,b,c,d){switch(jd(b)){case 1:var e=ed;break;case 4:e=gd;break;default:e=fd;}c=e.bind(null,b,c,a);e=void 0;!Lb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=!0);d?void 0!==e?a.addEventListener(b,c,{capture:!0,passive:e}):a.addEventListener(b,c,!0):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,!1);}
function hd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return;}for(;null!==h;){g=Wc(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode;}}d=d.return;}Jb(function(){var d=f,e=xb(c),g=[];
a:{var h=df.get(a);if(void 0!==h){var k=td,n=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":n="focus";k=Fd;break;case "focusout":n="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case $e$1:case af:case bf:k=Hd;break;case cf:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td;}var t=0!==(b&4),J=!t&&"scroll"===a,x=t?null!==h?h+"Capture":null:h;t=[];for(var w=d,u;null!==
w;){u=w;var F=u.stateNode;5===u.tag&&null!==F&&(u=F,null!==x&&(F=Kb(w,x),null!=F&&t.push(tf(w,F,u))));if(J)break;w=w.return;}0<t.length&&(h=new k(h,n,null,c,e),g.push({event:h,listeners:t}));}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&c!==wb&&(n=c.relatedTarget||c.fromElement)&&(Wc(n)||n[uf]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(n=c.relatedTarget||c.toElement,k=d,n=n?Wc(n):null,null!==
n&&(J=Vb(n),n!==J||5!==n.tag&&6!==n.tag))n=null;}else k=null,n=d;if(k!==n){t=Bd;F="onMouseLeave";x="onMouseEnter";w="mouse";if("pointerout"===a||"pointerover"===a)t=Td,F="onPointerLeave",x="onPointerEnter",w="pointer";J=null==k?h:ue$1(k);u=null==n?h:ue$1(n);h=new t(F,w+"leave",k,c,e);h.target=J;h.relatedTarget=u;F=null;Wc(e)===d&&(t=new t(x,w+"enter",n,c,e),t.target=u,t.relatedTarget=J,F=t);J=F;if(k&&n)b:{t=k;x=n;w=0;for(u=t;u;u=vf(u))w++;u=0;for(F=x;F;F=vf(F))u++;for(;0<w-u;)t=vf(t),w--;for(;0<u-w;)x=
vf(x),u--;for(;w--;){if(t===x||null!==x&&t===x.alternate)break b;t=vf(t);x=vf(x);}t=null;}else t=null;null!==k&&wf(g,h,k,t,!1);null!==n&&null!==J&&wf(g,J,n,t,!0);}}}a:{h=d?ue$1(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var na=ve$1;else if(me$1(h))if(we$1)na=Fe$1;else {na=De$1;var xa=Ce$1;}else (k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(na=Ee$1);if(na&&(na=na(a,d))){ne$1(g,na,c,e);break a}xa&&xa(a,h,d);"focusout"===a&&(xa=h._wrapperState)&&
xa.controlled&&"number"===h.type&&cb(h,"number",h.value);}xa=d?ue$1(d):window;switch(a){case "focusin":if(me$1(xa)||"true"===xa.contentEditable)Qe$1=xa,Re$1=d,Se$1=null;break;case "focusout":Se$1=Re$1=Qe$1=null;break;case "mousedown":Te$1=!0;break;case "contextmenu":case "mouseup":case "dragend":Te$1=!1;Ue$1(g,c,e);break;case "selectionchange":if(Pe$1)break;case "keydown":case "keyup":Ue$1(g,c,e);}var $a;if(ae$1)b:{switch(a){case "compositionstart":var ba="onCompositionStart";break b;case "compositionend":ba="onCompositionEnd";
break b;case "compositionupdate":ba="onCompositionUpdate";break b}ba=void 0;}else ie$1?ge$1(a,c)&&(ba="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(ba="onCompositionStart");ba&&(de$1&&"ko"!==c.locale&&(ie$1||"onCompositionStart"!==ba?"onCompositionEnd"===ba&&ie$1&&($a=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie$1=!0)),xa=oe$1(d,ba),0<xa.length&&(ba=new Ld(ba,a,null,c,e),g.push({event:ba,listeners:xa}),$a?ba.data=$a:($a=he$1(c),null!==$a&&(ba.data=$a))));if($a=ce$1?je$1(a,c):ke$1(a,c))d=oe$1(d,"onBeforeInput"),
0<d.length&&(e=new Ld("onBeforeInput","beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=$a);}se(g,b);});}function tf(a,b,c){return {instance:a,listener:b,currentTarget:c}}function oe$1(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Kb(a,c),null!=f&&d.unshift(tf(a,f,e)),f=Kb(a,b),null!=f&&d.push(tf(a,f,e)));a=a.return;}return d}function vf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
function wf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Kb(c,f),null!=k&&g.unshift(tf(c,k,h))):e||(k=Kb(c,f),null!=k&&g.push(tf(c,k,h))));c=c.return;}0!==g.length&&a.push({event:b,listeners:g});}var xf=/\r\n?/g,yf=/\u0000|\uFFFD/g;function zf(a){return ("string"===typeof a?a:""+a).replace(xf,"\n").replace(yf,"")}function Af(a,b,c){b=zf(b);if(zf(a)!==b&&c)throw Error(p$5(425));}function Bf(){}
var Cf=null,Df=null;function Ef(a,b){return "textarea"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}
var Ff="function"===typeof setTimeout?setTimeout:void 0,Gf="function"===typeof clearTimeout?clearTimeout:void 0,Hf="function"===typeof Promise?Promise:void 0,Jf="function"===typeof queueMicrotask?queueMicrotask:"undefined"!==typeof Hf?function(a){return Hf.resolve(null).then(a).catch(If)}:Ff;function If(a){setTimeout(function(){throw a;});}
function Kf(a,b){var c=b,d=0;do{var e=c.nextSibling;a.removeChild(c);if(e&&8===e.nodeType)if(c=e.data,"/$"===c){if(0===d){a.removeChild(e);bd(b);return}d--;}else "$"!==c&&"$?"!==c&&"$!"!==c||d++;c=e;}while(c);bd(b);}function Lf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break;if(8===b){b=a.data;if("$"===b||"$!"===b||"$?"===b)break;if("/$"===b)return null}}return a}
function Mf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--;}else "/$"===c&&b++;}a=a.previousSibling;}return null}var Nf=Math.random().toString(36).slice(2),Of="__reactFiber$"+Nf,Pf="__reactProps$"+Nf,uf="__reactContainer$"+Nf,of="__reactEvents$"+Nf,Qf="__reactListeners$"+Nf,Rf="__reactHandles$"+Nf;
function Wc(a){var b=a[Of];if(b)return b;for(var c=a.parentNode;c;){if(b=c[uf]||c[Of]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=Mf(a);null!==a;){if(c=a[Of])return c;a=Mf(a);}return b}a=c;c=a.parentNode;}return null}function Cb(a){a=a[Of]||a[uf];return !a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue$1(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(p$5(33));}function Db(a){return a[Pf]||null}var Sf=[],Tf=-1;function Uf(a){return {current:a}}
function E$1(a){0>Tf||(a.current=Sf[Tf],Sf[Tf]=null,Tf--);}function G$1(a,b){Tf++;Sf[Tf]=a.current;a.current=b;}var Vf={},H$1=Uf(Vf),Wf=Uf(!1),Xf=Vf;function Yf(a,b){var c=a.type.contextTypes;if(!c)return Vf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}
function Zf(a){a=a.childContextTypes;return null!==a&&void 0!==a}function $f(){E$1(Wf);E$1(H$1);}function ag(a,b,c){if(H$1.current!==Vf)throw Error(p$5(168));G$1(H$1,b);G$1(Wf,c);}function bg(a,b,c){var d=a.stateNode;b=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in b))throw Error(p$5(108,Ra(a)||"Unknown",e));return A$1({},c,d)}
function cg(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Vf;Xf=H$1.current;G$1(H$1,a);G$1(Wf,Wf.current);return !0}function dg(a,b,c){var d=a.stateNode;if(!d)throw Error(p$5(169));c?(a=bg(a,b,Xf),d.__reactInternalMemoizedMergedChildContext=a,E$1(Wf),E$1(H$1),G$1(H$1,a)):E$1(Wf);G$1(Wf,c);}var eg=null,fg=!1,gg=!1;function hg(a){null===eg?eg=[a]:eg.push(a);}function ig(a){fg=!0;hg(a);}
function jg(){if(!gg&&null!==eg){gg=!0;var a=0,b=C$2;try{var c=eg;for(C$2=1;a<c.length;a++){var d=c[a];do d=d(!0);while(null!==d)}eg=null;fg=!1;}catch(e){throw null!==eg&&(eg=eg.slice(a+1)),ac(fc,jg),e;}finally{C$2=b,gg=!1;}}return null}var kg=[],lg=0,mg=null,ng=0,og=[],pg=0,qg=null,rg=1,sg="";function tg(a,b){kg[lg++]=ng;kg[lg++]=mg;mg=a;ng=b;}
function ug(a,b,c){og[pg++]=rg;og[pg++]=sg;og[pg++]=qg;qg=a;var d=rg;a=sg;var e=32-oc(d)-1;d&=~(1<<e);c+=1;var f=32-oc(b)+e;if(30<f){var g=e-e%5;f=(d&(1<<g)-1).toString(32);d>>=g;e-=g;rg=1<<32-oc(b)+e|c<<e|d;sg=f+a;}else rg=1<<f|c<<e|d,sg=a;}function vg(a){null!==a.return&&(tg(a,1),ug(a,1,0));}function wg(a){for(;a===mg;)mg=kg[--lg],kg[lg]=null,ng=kg[--lg],kg[lg]=null;for(;a===qg;)qg=og[--pg],og[pg]=null,sg=og[--pg],og[pg]=null,rg=og[--pg],og[pg]=null;}var xg=null,yg=null,I$1=!1,zg=null;
function Ag(a,b){var c=Bg(5,null,null,0);c.elementType="DELETED";c.stateNode=b;c.return=a;b=a.deletions;null===b?(a.deletions=[c],a.flags|=16):b.push(c);}
function Cg(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,xg=a,yg=Lf(b.firstChild),!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,xg=a,yg=null,!0):!1;case 13:return b=8!==b.nodeType?null:b,null!==b?(c=null!==qg?{id:rg,overflow:sg}:null,a.memoizedState={dehydrated:b,treeContext:c,retryLane:1073741824},c=Bg(18,null,null,0),c.stateNode=b,c.return=a,a.child=c,xg=a,yg=
null,!0):!1;default:return !1}}function Dg(a){return 0!==(a.mode&1)&&0===(a.flags&128)}function Eg(a){if(I$1){var b=yg;if(b){var c=b;if(!Cg(a,b)){if(Dg(a))throw Error(p$5(418));b=Lf(c.nextSibling);var d=xg;b&&Cg(a,b)?Ag(d,c):(a.flags=a.flags&-4097|2,I$1=!1,xg=a);}}else {if(Dg(a))throw Error(p$5(418));a.flags=a.flags&-4097|2;I$1=!1;xg=a;}}}function Fg(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;xg=a;}
function Gg(a){if(a!==xg)return !1;if(!I$1)return Fg(a),I$1=!0,!1;var b;(b=3!==a.tag)&&!(b=5!==a.tag)&&(b=a.type,b="head"!==b&&"body"!==b&&!Ef(a.type,a.memoizedProps));if(b&&(b=yg)){if(Dg(a))throw Hg(),Error(p$5(418));for(;b;)Ag(a,b),b=Lf(b.nextSibling);}Fg(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(p$5(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){yg=Lf(a.nextSibling);break a}b--;}else "$"!==c&&"$!"!==c&&"$?"!==c||b++;}a=a.nextSibling;}yg=
null;}}else yg=xg?Lf(a.stateNode.nextSibling):null;return !0}function Hg(){for(var a=yg;a;)a=Lf(a.nextSibling);}function Ig(){yg=xg=null;I$1=!1;}function Jg(a){null===zg?zg=[a]:zg.push(a);}var Kg=ua.ReactCurrentBatchConfig;
function Lg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(p$5(309));var d=c.stateNode;}if(!d)throw Error(p$5(147,a));var e=d,f=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===f)return b.ref;b=function(a){var b=e.refs;null===a?delete b[f]:b[f]=a;};b._stringRef=f;return b}if("string"!==typeof a)throw Error(p$5(284));if(!c._owner)throw Error(p$5(290,a));}return a}
function Mg(a,b){a=Object.prototype.toString.call(b);throw Error(p$5(31,"[object Object]"===a?"object with keys {"+Object.keys(b).join(", ")+"}":a));}function Ng(a){var b=a._init;return b(a._payload)}
function Og(a){function b(b,c){if(a){var d=b.deletions;null===d?(b.deletions=[c],b.flags|=16):d.push(c);}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Pg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return b.flags|=1048576,c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags|=2,c):d;b.flags|=2;return c}function g(b){a&&
null===b.alternate&&(b.flags|=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Qg(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){var f=c.type;if(f===ya)return m(a,b,c.props.children,d,c.key);if(null!==b&&(b.elementType===f||"object"===typeof f&&null!==f&&f.$$typeof===Ha&&Ng(f)===b.type))return d=e(b,c.props),d.ref=Lg(a,b,c),d.return=a,d;d=Rg(c.type,c.key,c.props,null,a.mode,d);d.ref=Lg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||
b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=Sg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function m(a,b,c,d,f){if(null===b||7!==b.tag)return b=Tg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function q(a,b,c){if("string"===typeof b&&""!==b||"number"===typeof b)return b=Qg(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case va:return c=Rg(b.type,b.key,b.props,null,a.mode,c),
c.ref=Lg(a,null,b),c.return=a,c;case wa:return b=Sg(b,a.mode,c),b.return=a,b;case Ha:var d=b._init;return q(a,d(b._payload),c)}if(eb(b)||Ka(b))return b=Tg(b,a.mode,c,null),b.return=a,b;Mg(a,b);}return null}function r(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c&&""!==c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case va:return c.key===e?k(a,b,c,d):null;case wa:return c.key===e?l(a,b,c,d):null;case Ha:return e=c._init,r(a,
b,e(c._payload),d)}if(eb(c)||Ka(c))return null!==e?null:m(a,b,c,d,null);Mg(a,c);}return null}function y(a,b,c,d,e){if("string"===typeof d&&""!==d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case va:return a=a.get(null===d.key?c:d.key)||null,k(b,a,d,e);case wa:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e);case Ha:var f=d._init;return y(a,b,c,f(d._payload),e)}if(eb(d)||Ka(d))return a=a.get(c)||null,m(b,a,d,e,null);Mg(b,d);}return null}
function n(e,g,h,k){for(var l=null,m=null,u=g,w=g=0,x=null;null!==u&&w<h.length;w++){u.index>w?(x=u,u=null):x=u.sibling;var n=r(e,u,h[w],k);if(null===n){null===u&&(u=x);break}a&&u&&null===n.alternate&&b(e,u);g=f(n,g,w);null===m?l=n:m.sibling=n;m=n;u=x;}if(w===h.length)return c(e,u),I$1&&tg(e,w),l;if(null===u){for(;w<h.length;w++)u=q(e,h[w],k),null!==u&&(g=f(u,g,w),null===m?l=u:m.sibling=u,m=u);I$1&&tg(e,w);return l}for(u=d(e,u);w<h.length;w++)x=y(u,e,w,h[w],k),null!==x&&(a&&null!==x.alternate&&u.delete(null===
x.key?w:x.key),g=f(x,g,w),null===m?l=x:m.sibling=x,m=x);a&&u.forEach(function(a){return b(e,a)});I$1&&tg(e,w);return l}function t(e,g,h,k){var l=Ka(h);if("function"!==typeof l)throw Error(p$5(150));h=l.call(h);if(null==h)throw Error(p$5(151));for(var u=l=null,m=g,w=g=0,x=null,n=h.next();null!==m&&!n.done;w++,n=h.next()){m.index>w?(x=m,m=null):x=m.sibling;var t=r(e,m,n.value,k);if(null===t){null===m&&(m=x);break}a&&m&&null===t.alternate&&b(e,m);g=f(t,g,w);null===u?l=t:u.sibling=t;u=t;m=x;}if(n.done)return c(e,
m),I$1&&tg(e,w),l;if(null===m){for(;!n.done;w++,n=h.next())n=q(e,n.value,k),null!==n&&(g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);I$1&&tg(e,w);return l}for(m=d(e,m);!n.done;w++,n=h.next())n=y(m,e,w,n.value,k),null!==n&&(a&&null!==n.alternate&&m.delete(null===n.key?w:n.key),g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);a&&m.forEach(function(a){return b(e,a)});I$1&&tg(e,w);return l}function J(a,d,f,h){"object"===typeof f&&null!==f&&f.type===ya&&null===f.key&&(f=f.props.children);if("object"===typeof f&&null!==f){switch(f.$$typeof){case va:a:{for(var k=
f.key,l=d;null!==l;){if(l.key===k){k=f.type;if(k===ya){if(7===l.tag){c(a,l.sibling);d=e(l,f.props.children);d.return=a;a=d;break a}}else if(l.elementType===k||"object"===typeof k&&null!==k&&k.$$typeof===Ha&&Ng(k)===l.type){c(a,l.sibling);d=e(l,f.props);d.ref=Lg(a,l,f);d.return=a;a=d;break a}c(a,l);break}else b(a,l);l=l.sibling;}f.type===ya?(d=Tg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Rg(f.type,f.key,f.props,null,a.mode,h),h.ref=Lg(a,d,f),h.return=a,a=h);}return g(a);case wa:a:{for(l=f.key;null!==
d;){if(d.key===l)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else {c(a,d);break}else b(a,d);d=d.sibling;}d=Sg(f,a.mode,h);d.return=a;a=d;}return g(a);case Ha:return l=f._init,J(a,d,l(f._payload),h)}if(eb(f))return n(a,d,f,h);if(Ka(f))return t(a,d,f,h);Mg(a,f);}return "string"===typeof f&&""!==f||"number"===typeof f?(f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):
(c(a,d),d=Qg(f,a.mode,h),d.return=a,a=d),g(a)):c(a,d)}return J}var Ug=Og(!0),Vg=Og(!1),Wg=Uf(null),Xg=null,Yg=null,Zg=null;function $g(){Zg=Yg=Xg=null;}function ah(a){var b=Wg.current;E$1(Wg);a._currentValue=b;}function bh(a,b,c){for(;null!==a;){var d=a.alternate;(a.childLanes&b)!==b?(a.childLanes|=b,null!==d&&(d.childLanes|=b)):null!==d&&(d.childLanes&b)!==b&&(d.childLanes|=b);if(a===c)break;a=a.return;}}
function ch(a,b){Xg=a;Zg=Yg=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(dh=!0),a.firstContext=null);}function eh(a){var b=a._currentValue;if(Zg!==a)if(a={context:a,memoizedValue:b,next:null},null===Yg){if(null===Xg)throw Error(p$5(308));Yg=a;Xg.dependencies={lanes:0,firstContext:a};}else Yg=Yg.next=a;return b}var fh=null;function gh(a){null===fh?fh=[a]:fh.push(a);}
function hh(a,b,c,d){var e=b.interleaved;null===e?(c.next=c,gh(b)):(c.next=e.next,e.next=c);b.interleaved=c;return ih(a,d)}function ih(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}var jh=!1;function kh(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null};}
function lh(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects});}function mh(a,b){return {eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}
function nh(a,b,c){var d=a.updateQueue;if(null===d)return null;d=d.shared;if(0!==(K$1&2)){var e=d.pending;null===e?b.next=b:(b.next=e.next,e.next=b);d.pending=b;return ih(a,c)}e=d.interleaved;null===e?(b.next=b,gh(d)):(b.next=e.next,e.next=b);d.interleaved=b;return ih(a,c)}function oh(a,b,c){b=b.updateQueue;if(null!==b&&(b=b.shared,0!==(c&4194240))){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c);}}
function ph(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next;}while(null!==c);null===f?e=f=b:f=f.next=b;}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
b;c.lastBaseUpdate=b;}
function qh(a,b,c,d){var e=a.updateQueue;jh=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var m=a.alternate;null!==m&&(m=m.updateQueue,h=m.lastBaseUpdate,h!==g&&(null===h?m.firstBaseUpdate=l:h.next=l,m.lastBaseUpdate=k));}if(null!==f){var q=e.baseState;g=0;m=l=k=null;h=f;do{var r=h.lane,y=h.eventTime;if((d&r)===r){null!==m&&(m=m.next={eventTime:y,lane:0,tag:h.tag,payload:h.payload,callback:h.callback,
next:null});a:{var n=a,t=h;r=b;y=c;switch(t.tag){case 1:n=t.payload;if("function"===typeof n){q=n.call(y,q,r);break a}q=n;break a;case 3:n.flags=n.flags&-65537|128;case 0:n=t.payload;r="function"===typeof n?n.call(y,q,r):n;if(null===r||void 0===r)break a;q=A$1({},q,r);break a;case 2:jh=!0;}}null!==h.callback&&0!==h.lane&&(a.flags|=64,r=e.effects,null===r?e.effects=[h]:r.push(h));}else y={eventTime:y,lane:r,tag:h.tag,payload:h.payload,callback:h.callback,next:null},null===m?(l=m=y,k=q):m=m.next=y,g|=r;
h=h.next;if(null===h)if(h=e.shared.pending,null===h)break;else r=h,h=r.next,r.next=null,e.lastBaseUpdate=r,e.shared.pending=null;}while(1);null===m&&(k=q);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=m;b=e.shared.interleaved;if(null!==b){e=b;do g|=e.lane,e=e.next;while(e!==b)}else null===f&&(e.shared.lanes=0);rh|=g;a.lanes=g;a.memoizedState=q;}}
function sh(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(p$5(191,e));e.call(d);}}}var th={},uh=Uf(th),vh=Uf(th),wh=Uf(th);function xh(a){if(a===th)throw Error(p$5(174));return a}
function yh(a,b){G$1(wh,b);G$1(vh,a);G$1(uh,th);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:lb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=lb(b,a);}E$1(uh);G$1(uh,b);}function zh(){E$1(uh);E$1(vh);E$1(wh);}function Ah(a){xh(wh.current);var b=xh(uh.current);var c=lb(b,a.type);b!==c&&(G$1(vh,a),G$1(uh,c));}function Bh(a){vh.current===a&&(E$1(uh),E$1(vh));}var L$2=Uf(0);
function Ch(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&128))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}return null}var Dh=[];
function Eh(){for(var a=0;a<Dh.length;a++)Dh[a]._workInProgressVersionPrimary=null;Dh.length=0;}var Fh=ua.ReactCurrentDispatcher,Gh=ua.ReactCurrentBatchConfig,Hh=0,M$3=null,N$1=null,O$1=null,Ih=!1,Jh=!1,Kh=0,Lh=0;function P(){throw Error(p$5(321));}function Mh(a,b){if(null===b)return !1;for(var c=0;c<b.length&&c<a.length;c++)if(!He$1(a[c],b[c]))return !1;return !0}
function Nh(a,b,c,d,e,f){Hh=f;M$3=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;Fh.current=null===a||null===a.memoizedState?Oh:Ph;a=c(d,e);if(Jh){f=0;do{Jh=!1;Kh=0;if(25<=f)throw Error(p$5(301));f+=1;O$1=N$1=null;b.updateQueue=null;Fh.current=Qh;a=c(d,e);}while(Jh)}Fh.current=Rh;b=null!==N$1&&null!==N$1.next;Hh=0;O$1=N$1=M$3=null;Ih=!1;if(b)throw Error(p$5(300));return a}function Sh(){var a=0!==Kh;Kh=0;return a}
function Th(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===O$1?M$3.memoizedState=O$1=a:O$1=O$1.next=a;return O$1}function Uh(){if(null===N$1){var a=M$3.alternate;a=null!==a?a.memoizedState:null;}else a=N$1.next;var b=null===O$1?M$3.memoizedState:O$1.next;if(null!==b)O$1=b,N$1=a;else {if(null===a)throw Error(p$5(310));N$1=a;a={memoizedState:N$1.memoizedState,baseState:N$1.baseState,baseQueue:N$1.baseQueue,queue:N$1.queue,next:null};null===O$1?M$3.memoizedState=O$1=a:O$1=O$1.next=a;}return O$1}
function Vh(a,b){return "function"===typeof b?b(a):b}
function Wh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p$5(311));c.lastRenderedReducer=a;var d=N$1,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g;}d.baseQueue=e=f;c.pending=null;}if(null!==e){f=e.next;d=d.baseState;var h=g=null,k=null,l=f;do{var m=l.lane;if((Hh&m)===m)null!==k&&(k=k.next={lane:0,action:l.action,hasEagerState:l.hasEagerState,eagerState:l.eagerState,next:null}),d=l.hasEagerState?l.eagerState:a(d,l.action);else {var q={lane:m,action:l.action,hasEagerState:l.hasEagerState,
eagerState:l.eagerState,next:null};null===k?(h=k=q,g=d):k=k.next=q;M$3.lanes|=m;rh|=m;}l=l.next;}while(null!==l&&l!==f);null===k?g=d:k.next=h;He$1(d,b.memoizedState)||(dh=!0);b.memoizedState=d;b.baseState=g;b.baseQueue=k;c.lastRenderedState=d;}a=c.interleaved;if(null!==a){e=a;do f=e.lane,M$3.lanes|=f,rh|=f,e=e.next;while(e!==a)}else null===e&&(c.lanes=0);return [b.memoizedState,c.dispatch]}
function Xh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p$5(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He$1(f,b.memoizedState)||(dh=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f;}return [f,d]}function Yh(){}
function Zh(a,b){var c=M$3,d=Uh(),e=b(),f=!He$1(d.memoizedState,e);f&&(d.memoizedState=e,dh=!0);d=d.queue;$h(ai$1.bind(null,c,d,a),[a]);if(d.getSnapshot!==b||f||null!==O$1&&O$1.memoizedState.tag&1){c.flags|=2048;bi$1(9,ci$1.bind(null,c,d,e,b),void 0,null);if(null===Q$1)throw Error(p$5(349));0!==(Hh&30)||di$1(c,b,e);}return e}function di$1(a,b,c){a.flags|=16384;a={getSnapshot:b,value:c};b=M$3.updateQueue;null===b?(b={lastEffect:null,stores:null},M$3.updateQueue=b,b.stores=[a]):(c=b.stores,null===c?b.stores=[a]:c.push(a));}
function ci$1(a,b,c,d){b.value=c;b.getSnapshot=d;ei$1(b)&&fi$1(a);}function ai$1(a,b,c){return c(function(){ei$1(b)&&fi$1(a);})}function ei$1(a){var b=a.getSnapshot;a=a.value;try{var c=b();return !He$1(a,c)}catch(d){return !0}}function fi$1(a){var b=ih(a,1);null!==b&&gi$1(b,a,1,-1);}
function hi$1(a){var b=Th();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Vh,lastRenderedState:a};b.queue=a;a=a.dispatch=ii$1.bind(null,M$3,a);return [b.memoizedState,a]}
function bi$1(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=M$3.updateQueue;null===b?(b={lastEffect:null,stores:null},M$3.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function ji(){return Uh().memoizedState}function ki$1(a,b,c,d){var e=Th();M$3.flags|=a;e.memoizedState=bi$1(1|b,c,void 0,void 0===d?null:d);}
function li(a,b,c,d){var e=Uh();d=void 0===d?null:d;var f=void 0;if(null!==N$1){var g=N$1.memoizedState;f=g.destroy;if(null!==d&&Mh(d,g.deps)){e.memoizedState=bi$1(b,c,f,d);return}}M$3.flags|=a;e.memoizedState=bi$1(1|b,c,f,d);}function mi$1(a,b){return ki$1(8390656,8,a,b)}function $h(a,b){return li(2048,8,a,b)}function ni$1(a,b){return li(4,2,a,b)}function oi$1(a,b){return li(4,4,a,b)}
function pi$1(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null);};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null;}}function qi(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return li(4,4,pi$1.bind(null,b,a),c)}function ri$1(){}function si$1(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}
function ti$1(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}function ui$1(a,b,c){if(0===(Hh&21))return a.baseState&&(a.baseState=!1,dh=!0),a.memoizedState=c;He$1(c,b)||(c=yc(),M$3.lanes|=c,rh|=c,a.baseState=!0);return b}function vi$1(a,b){var c=C$2;C$2=0!==c&&4>c?c:4;a(!0);var d=Gh.transition;Gh.transition={};try{a(!1),b();}finally{C$2=c,Gh.transition=d;}}function wi$1(){return Uh().memoizedState}
function xi$1(a,b,c){var d=yi$1(a);c={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(zi$1(a))Ai(b,c);else if(c=hh(a,b,c,d),null!==c){var e=R$1();gi$1(c,a,d,e);Bi(c,b,d);}}
function ii$1(a,b,c){var d=yi$1(a),e={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(zi$1(a))Ai(b,e);else {var f=a.alternate;if(0===a.lanes&&(null===f||0===f.lanes)&&(f=b.lastRenderedReducer,null!==f))try{var g=b.lastRenderedState,h=f(g,c);e.hasEagerState=!0;e.eagerState=h;if(He$1(h,g)){var k=b.interleaved;null===k?(e.next=e,gh(b)):(e.next=k.next,k.next=e);b.interleaved=e;return}}catch(l){}finally{}c=hh(a,b,e,d);null!==c&&(e=R$1(),gi$1(c,a,d,e),Bi(c,b,d));}}
function zi$1(a){var b=a.alternate;return a===M$3||null!==b&&b===M$3}function Ai(a,b){Jh=Ih=!0;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b;}function Bi(a,b,c){if(0!==(c&4194240)){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c);}}
var Rh={readContext:eh,useCallback:P,useContext:P,useEffect:P,useImperativeHandle:P,useInsertionEffect:P,useLayoutEffect:P,useMemo:P,useReducer:P,useRef:P,useState:P,useDebugValue:P,useDeferredValue:P,useTransition:P,useMutableSource:P,useSyncExternalStore:P,useId:P,unstable_isNewReconciler:!1},Oh={readContext:eh,useCallback:function(a,b){Th().memoizedState=[a,void 0===b?null:b];return a},useContext:eh,useEffect:mi$1,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return ki$1(4194308,
4,pi$1.bind(null,b,a),c)},useLayoutEffect:function(a,b){return ki$1(4194308,4,a,b)},useInsertionEffect:function(a,b){return ki$1(4,2,a,b)},useMemo:function(a,b){var c=Th();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Th();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};d.queue=a;a=a.dispatch=xi$1.bind(null,M$3,a);return [d.memoizedState,a]},useRef:function(a){var b=
Th();a={current:a};return b.memoizedState=a},useState:hi$1,useDebugValue:ri$1,useDeferredValue:function(a){return Th().memoizedState=a},useTransition:function(){var a=hi$1(!1),b=a[0];a=vi$1.bind(null,a[1]);Th().memoizedState=a;return [b,a]},useMutableSource:function(){},useSyncExternalStore:function(a,b,c){var d=M$3,e=Th();if(I$1){if(void 0===c)throw Error(p$5(407));c=c();}else {c=b();if(null===Q$1)throw Error(p$5(349));0!==(Hh&30)||di$1(d,b,c);}e.memoizedState=c;var f={value:c,getSnapshot:b};e.queue=f;mi$1(ai$1.bind(null,d,
f,a),[a]);d.flags|=2048;bi$1(9,ci$1.bind(null,d,f,c,b),void 0,null);return c},useId:function(){var a=Th(),b=Q$1.identifierPrefix;if(I$1){var c=sg;var d=rg;c=(d&~(1<<32-oc(d)-1)).toString(32)+c;b=":"+b+"R"+c;c=Kh++;0<c&&(b+="H"+c.toString(32));b+=":";}else c=Lh++,b=":"+b+"r"+c.toString(32)+":";return a.memoizedState=b},unstable_isNewReconciler:!1},Ph={readContext:eh,useCallback:si$1,useContext:eh,useEffect:$h,useImperativeHandle:qi,useInsertionEffect:ni$1,useLayoutEffect:oi$1,useMemo:ti$1,useReducer:Wh,useRef:ji,useState:function(){return Wh(Vh)},
useDebugValue:ri$1,useDeferredValue:function(a){var b=Uh();return ui$1(b,N$1.memoizedState,a)},useTransition:function(){var a=Wh(Vh)[0],b=Uh().memoizedState;return [a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi$1,unstable_isNewReconciler:!1},Qh={readContext:eh,useCallback:si$1,useContext:eh,useEffect:$h,useImperativeHandle:qi,useInsertionEffect:ni$1,useLayoutEffect:oi$1,useMemo:ti$1,useReducer:Xh,useRef:ji,useState:function(){return Xh(Vh)},useDebugValue:ri$1,useDeferredValue:function(a){var b=Uh();return null===
N$1?b.memoizedState=a:ui$1(b,N$1.memoizedState,a)},useTransition:function(){var a=Xh(Vh)[0],b=Uh().memoizedState;return [a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi$1,unstable_isNewReconciler:!1};function Ci$1(a,b){if(a&&a.defaultProps){b=A$1({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}function Di$1(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:A$1({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c);}
var Ei$1={isMounted:function(a){return (a=a._reactInternals)?Vb(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=R$1(),e=yi$1(a),f=mh(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi$1(b,a,e,d),oh(b,a,e));},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=R$1(),e=yi$1(a),f=mh(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi$1(b,a,e,d),oh(b,a,e));},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=R$1(),d=
yi$1(a),e=mh(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=b);b=nh(a,e,d);null!==b&&(gi$1(b,a,d,c),oh(b,a,d));}};function Fi$1(a,b,c,d,e,f,g){a=a.stateNode;return "function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Ie$1(c,d)||!Ie$1(e,f):!0}
function Gi(a,b,c){var d=!1,e=Vf;var f=b.contextType;"object"===typeof f&&null!==f?f=eh(f):(e=Zf(b)?Xf:H$1.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Yf(a,e):Vf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Ei$1;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function Hi(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Ei$1.enqueueReplaceState(b,b.state,null);}
function Ii(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs={};kh(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=eh(f):(f=Zf(b)?Xf:H$1.current,e.context=Yf(a,f));e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Di$1(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||(b=e.state,
"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Ei$1.enqueueReplaceState(e,e.state,null),qh(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4194308);}function Ji(a,b){try{var c="",d=b;do c+=Pa(d),d=d.return;while(d);var e=c;}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack;}return {value:a,source:b,stack:e,digest:null}}
function Ki(a,b,c){return {value:a,source:null,stack:null!=c?c:null,digest:null!=b?b:null}}function Li(a,b){try{console.error(b.value);}catch(c){setTimeout(function(){throw c;});}}var Mi$1="function"===typeof WeakMap?WeakMap:Map;function Ni$1(a,b,c){c=mh(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Oi||(Oi=!0,Pi$1=d);Li(a,b);};return c}
function Qi(a,b,c){c=mh(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){return d(e)};c.callback=function(){Li(a,b);};}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){Li(a,b);"function"!==typeof d&&(null===Ri?Ri=new Set([this]):Ri.add(this));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""});});return c}
function Si$1(a,b,c){var d=a.pingCache;if(null===d){d=a.pingCache=new Mi$1;var e=new Set;d.set(b,e);}else e=d.get(b),void 0===e&&(e=new Set,d.set(b,e));e.has(c)||(e.add(c),a=Ti$1.bind(null,a,b,c),b.then(a,a));}function Ui(a){do{var b;if(b=13===a.tag)b=a.memoizedState,b=null!==b?null!==b.dehydrated?!0:!1:!0;if(b)return a;a=a.return;}while(null!==a);return null}
function Vi(a,b,c,d,e){if(0===(a.mode&1))return a===b?a.flags|=65536:(a.flags|=128,c.flags|=131072,c.flags&=-52805,1===c.tag&&(null===c.alternate?c.tag=17:(b=mh(-1,1),b.tag=2,nh(c,b,1))),c.lanes|=1),a;a.flags|=65536;a.lanes=e;return a}var Wi$1=ua.ReactCurrentOwner,dh=!1;function Xi(a,b,c,d){b.child=null===a?Vg(b,null,c,d):Ug(b,a.child,c,d);}
function Yi(a,b,c,d,e){c=c.render;var f=b.ref;ch(b,e);d=Nh(a,b,c,d,f,e);c=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi(a,b,e);I$1&&c&&vg(b);b.flags|=1;Xi(a,b,d,e);return b.child}
function $i(a,b,c,d,e){if(null===a){var f=c.type;if("function"===typeof f&&!aj(f)&&void 0===f.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=f,bj(a,b,f,d,e);a=Rg(c.type,null,d,b,b.mode,e);a.ref=b.ref;a.return=b;return b.child=a}f=a.child;if(0===(a.lanes&e)){var g=f.memoizedProps;c=c.compare;c=null!==c?c:Ie$1;if(c(g,d)&&a.ref===b.ref)return Zi(a,b,e)}b.flags|=1;a=Pg(f,d);a.ref=b.ref;a.return=b;return b.child=a}
function bj(a,b,c,d,e){if(null!==a){var f=a.memoizedProps;if(Ie$1(f,d)&&a.ref===b.ref)if(dh=!1,b.pendingProps=d=f,0!==(a.lanes&e))0!==(a.flags&131072)&&(dh=!0);else return b.lanes=a.lanes,Zi(a,b,e)}return cj(a,b,c,d,e)}
function dj(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode)if(0===(b.mode&1))b.memoizedState={baseLanes:0,cachePool:null,transitions:null},G$1(ej,fj),fj|=c;else {if(0===(c&1073741824))return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a,cachePool:null,transitions:null},b.updateQueue=null,G$1(ej,fj),fj|=a,null;b.memoizedState={baseLanes:0,cachePool:null,transitions:null};d=null!==f?f.baseLanes:c;G$1(ej,fj);fj|=d;}else null!==
f?(d=f.baseLanes|c,b.memoizedState=null):d=c,G$1(ej,fj),fj|=d;Xi(a,b,e,c);return b.child}function gj(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=512,b.flags|=2097152;}function cj(a,b,c,d,e){var f=Zf(c)?Xf:H$1.current;f=Yf(b,f);ch(b,e);c=Nh(a,b,c,d,f,e);d=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi(a,b,e);I$1&&d&&vg(b);b.flags|=1;Xi(a,b,c,e);return b.child}
function hj(a,b,c,d,e){if(Zf(c)){var f=!0;cg(b);}else f=!1;ch(b,e);if(null===b.stateNode)ij(a,b),Gi(b,c,d),Ii(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=eh(l):(l=Zf(c)?Xf:H$1.current,l=Yf(b,l));var m=c.getDerivedStateFromProps,q="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;q||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||
(h!==d||k!==l)&&Hi(b,g,d,l);jh=!1;var r=b.memoizedState;g.state=r;qh(b,d,g,e);k=b.memoizedState;h!==d||r!==k||Wf.current||jh?("function"===typeof m&&(Di$1(b,c,m,d),k=b.memoizedState),(h=jh||Fi$1(b,c,h,d,r,k,l))?(q||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.flags|=4194308)):
("function"===typeof g.componentDidMount&&(b.flags|=4194308),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4194308),d=!1);}else {g=b.stateNode;lh(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:Ci$1(b.type,h);g.props=l;q=b.pendingProps;r=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=eh(k):(k=Zf(c)?Xf:H$1.current,k=Yf(b,k));var y=c.getDerivedStateFromProps;(m="function"===typeof y||"function"===typeof g.getSnapshotBeforeUpdate)||
"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==q||r!==k)&&Hi(b,g,d,k);jh=!1;r=b.memoizedState;g.state=r;qh(b,d,g,e);var n=b.memoizedState;h!==q||r!==n||Wf.current||jh?("function"===typeof y&&(Di$1(b,c,y,d),n=b.memoizedState),(l=jh||Fi$1(b,c,l,d,r,n,k)||!1)?(m||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,n,k),"function"===typeof g.UNSAFE_componentWillUpdate&&
g.UNSAFE_componentWillUpdate(d,n,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=1024)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),b.memoizedProps=d,b.memoizedState=n),g.props=d,g.state=n,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===
a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),d=!1);}return jj(a,b,c,d,f,e)}
function jj(a,b,c,d,e,f){gj(a,b);var g=0!==(b.flags&128);if(!d&&!g)return e&&dg(b,c,!1),Zi(a,b,f);d=b.stateNode;Wi$1.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Ug(b,a.child,null,f),b.child=Ug(b,null,h,f)):Xi(a,b,h,f);b.memoizedState=d.state;e&&dg(b,c,!0);return b.child}function kj(a){var b=a.stateNode;b.pendingContext?ag(a,b.pendingContext,b.pendingContext!==b.context):b.context&&ag(a,b.context,!1);yh(a,b.containerInfo);}
function lj(a,b,c,d,e){Ig();Jg(e);b.flags|=256;Xi(a,b,c,d);return b.child}var mj={dehydrated:null,treeContext:null,retryLane:0};function nj(a){return {baseLanes:a,cachePool:null,transitions:null}}
function oj(a,b,c){var d=b.pendingProps,e=L$2.current,f=!1,g=0!==(b.flags&128),h;(h=g)||(h=null!==a&&null===a.memoizedState?!1:0!==(e&2));if(h)f=!0,b.flags&=-129;else if(null===a||null!==a.memoizedState)e|=1;G$1(L$2,e&1);if(null===a){Eg(b);a=b.memoizedState;if(null!==a&&(a=a.dehydrated,null!==a))return 0===(b.mode&1)?b.lanes=1:"$!"===a.data?b.lanes=8:b.lanes=1073741824,null;g=d.children;a=d.fallback;return f?(d=b.mode,f=b.child,g={mode:"hidden",children:g},0===(d&1)&&null!==f?(f.childLanes=0,f.pendingProps=
g):f=pj(g,d,0,null),a=Tg(a,d,c,null),f.return=b,a.return=b,f.sibling=a,b.child=f,b.child.memoizedState=nj(c),b.memoizedState=mj,a):qj(b,g)}e=a.memoizedState;if(null!==e&&(h=e.dehydrated,null!==h))return rj(a,b,g,d,h,e,c);if(f){f=d.fallback;g=b.mode;e=a.child;h=e.sibling;var k={mode:"hidden",children:d.children};0===(g&1)&&b.child!==e?(d=b.child,d.childLanes=0,d.pendingProps=k,b.deletions=null):(d=Pg(e,k),d.subtreeFlags=e.subtreeFlags&14680064);null!==h?f=Pg(h,f):(f=Tg(f,g,c,null),f.flags|=2);f.return=
b;d.return=b;d.sibling=f;b.child=d;d=f;f=b.child;g=a.child.memoizedState;g=null===g?nj(c):{baseLanes:g.baseLanes|c,cachePool:null,transitions:g.transitions};f.memoizedState=g;f.childLanes=a.childLanes&~c;b.memoizedState=mj;return d}f=a.child;a=f.sibling;d=Pg(f,{mode:"visible",children:d.children});0===(b.mode&1)&&(d.lanes=c);d.return=b;d.sibling=null;null!==a&&(c=b.deletions,null===c?(b.deletions=[a],b.flags|=16):c.push(a));b.child=d;b.memoizedState=null;return d}
function qj(a,b){b=pj({mode:"visible",children:b},a.mode,0,null);b.return=a;return a.child=b}function sj(a,b,c,d){null!==d&&Jg(d);Ug(b,a.child,null,c);a=qj(b,b.pendingProps.children);a.flags|=2;b.memoizedState=null;return a}
function rj(a,b,c,d,e,f,g){if(c){if(b.flags&256)return b.flags&=-257,d=Ki(Error(p$5(422))),sj(a,b,g,d);if(null!==b.memoizedState)return b.child=a.child,b.flags|=128,null;f=d.fallback;e=b.mode;d=pj({mode:"visible",children:d.children},e,0,null);f=Tg(f,e,g,null);f.flags|=2;d.return=b;f.return=b;d.sibling=f;b.child=d;0!==(b.mode&1)&&Ug(b,a.child,null,g);b.child.memoizedState=nj(g);b.memoizedState=mj;return f}if(0===(b.mode&1))return sj(a,b,g,null);if("$!"===e.data){d=e.nextSibling&&e.nextSibling.dataset;
if(d)var h=d.dgst;d=h;f=Error(p$5(419));d=Ki(f,d,void 0);return sj(a,b,g,d)}h=0!==(g&a.childLanes);if(dh||h){d=Q$1;if(null!==d){switch(g&-g){case 4:e=2;break;case 16:e=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:e=32;break;case 536870912:e=268435456;break;default:e=0;}e=0!==(e&(d.suspendedLanes|g))?0:e;
0!==e&&e!==f.retryLane&&(f.retryLane=e,ih(a,e),gi$1(d,a,e,-1));}tj();d=Ki(Error(p$5(421)));return sj(a,b,g,d)}if("$?"===e.data)return b.flags|=128,b.child=a.child,b=uj.bind(null,a),e._reactRetry=b,null;a=f.treeContext;yg=Lf(e.nextSibling);xg=b;I$1=!0;zg=null;null!==a&&(og[pg++]=rg,og[pg++]=sg,og[pg++]=qg,rg=a.id,sg=a.overflow,qg=b);b=qj(b,d.children);b.flags|=4096;return b}function vj(a,b,c){a.lanes|=b;var d=a.alternate;null!==d&&(d.lanes|=b);bh(a.return,b,c);}
function wj(a,b,c,d,e){var f=a.memoizedState;null===f?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e}:(f.isBackwards=b,f.rendering=null,f.renderingStartTime=0,f.last=d,f.tail=c,f.tailMode=e);}
function xj(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;Xi(a,b,d.children,c);d=L$2.current;if(0!==(d&2))d=d&1|2,b.flags|=128;else {if(null!==a&&0!==(a.flags&128))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&vj(a,c,b);else if(19===a.tag)vj(a,c,b);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return;}a.sibling.return=a.return;a=a.sibling;}d&=1;}G$1(L$2,d);if(0===(b.mode&1))b.memoizedState=
null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===Ch(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);wj(b,!1,e,c,f);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===Ch(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a;}wj(b,!0,c,null,f);break;case "together":wj(b,!1,null,null,void 0);break;default:b.memoizedState=null;}return b.child}
function ij(a,b){0===(b.mode&1)&&null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);}function Zi(a,b,c){null!==a&&(b.dependencies=a.dependencies);rh|=b.lanes;if(0===(c&b.childLanes))return null;if(null!==a&&b.child!==a.child)throw Error(p$5(153));if(null!==b.child){a=b.child;c=Pg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Pg(a,a.pendingProps),c.return=b;c.sibling=null;}return b.child}
function yj(a,b,c){switch(b.tag){case 3:kj(b);Ig();break;case 5:Ah(b);break;case 1:Zf(b.type)&&cg(b);break;case 4:yh(b,b.stateNode.containerInfo);break;case 10:var d=b.type._context,e=b.memoizedProps.value;G$1(Wg,d._currentValue);d._currentValue=e;break;case 13:d=b.memoizedState;if(null!==d){if(null!==d.dehydrated)return G$1(L$2,L$2.current&1),b.flags|=128,null;if(0!==(c&b.child.childLanes))return oj(a,b,c);G$1(L$2,L$2.current&1);a=Zi(a,b,c);return null!==a?a.sibling:null}G$1(L$2,L$2.current&1);break;case 19:d=0!==(c&
b.childLanes);if(0!==(a.flags&128)){if(d)return xj(a,b,c);b.flags|=128;}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);G$1(L$2,L$2.current);if(d)break;else return null;case 22:case 23:return b.lanes=0,dj(a,b,c)}return Zi(a,b,c)}var zj,Aj,Bj,Cj;
zj=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;}c.sibling.return=c.return;c=c.sibling;}};Aj=function(){};
Bj=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;xh(uh.current);var f=null;switch(c){case "input":e=Ya(a,e);d=Ya(a,d);f=[];break;case "select":e=A$1({},e,{value:void 0});d=A$1({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=Bf);}ub(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&
(c||(c={}),c[g]="");}else "dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ea.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||(c={}),c[g]=k[g]);}else c||(f||(f=[]),f.push(l,
c)),c=k;else "dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ea.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&D$2("scroll",a),f||h===k||(f=[])):(f=f||[]).push(l,k));}c&&(f=f||[]).push("style",c);var l=f;if(b.updateQueue=l)b.flags|=4;}};Cj=function(a,b,c,d){c!==d&&(b.flags|=4);};
function Dj(a,b){if(!I$1)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null;}}
function S$2(a){var b=null!==a.alternate&&a.alternate.child===a.child,c=0,d=0;if(b)for(var e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags&14680064,d|=e.flags&14680064,e.return=a,e=e.sibling;else for(e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags,d|=e.flags,e.return=a,e=e.sibling;a.subtreeFlags|=d;a.childLanes=c;return b}
function Ej(a,b,c){var d=b.pendingProps;wg(b);switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return S$2(b),null;case 1:return Zf(b.type)&&$f(),S$2(b),null;case 3:d=b.stateNode;zh();E$1(Wf);E$1(H$1);Eh();d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)Gg(b)?b.flags|=4:null===a||a.memoizedState.isDehydrated&&0===(b.flags&256)||(b.flags|=1024,null!==zg&&(Fj(zg),zg=null));Aj(a,b);S$2(b);return null;case 5:Bh(b);var e=xh(wh.current);
c=b.type;if(null!==a&&null!=b.stateNode)Bj(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=512,b.flags|=2097152);else {if(!d){if(null===b.stateNode)throw Error(p$5(166));S$2(b);return null}a=xh(uh.current);if(Gg(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[Of]=b;d[Pf]=f;a=0!==(b.mode&1);switch(c){case "dialog":D$2("cancel",d);D$2("close",d);break;case "iframe":case "object":case "embed":D$2("load",d);break;case "video":case "audio":for(e=0;e<lf$1.length;e++)D$2(lf$1[e],d);break;case "source":D$2("error",d);break;case "img":case "image":case "link":D$2("error",
d);D$2("load",d);break;case "details":D$2("toggle",d);break;case "input":Za(d,f);D$2("invalid",d);break;case "select":d._wrapperState={wasMultiple:!!f.multiple};D$2("invalid",d);break;case "textarea":hb(d,f),D$2("invalid",d);}ub(c,f);e=null;for(var g in f)if(f.hasOwnProperty(g)){var h=f[g];"children"===g?"string"===typeof h?d.textContent!==h&&(!0!==f.suppressHydrationWarning&&Af(d.textContent,h,a),e=["children",h]):"number"===typeof h&&d.textContent!==""+h&&(!0!==f.suppressHydrationWarning&&Af(d.textContent,
h,a),e=["children",""+h]):ea.hasOwnProperty(g)&&null!=h&&"onScroll"===g&&D$2("scroll",d);}switch(c){case "input":Va(d);db(d,f,!0);break;case "textarea":Va(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=Bf);}d=e;b.updateQueue=d;null!==d&&(b.flags|=4);}else {g=9===e.nodeType?e:e.ownerDocument;"http://www.w3.org/1999/xhtml"===a&&(a=kb(c));"http://www.w3.org/1999/xhtml"===a?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):
"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=!0:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[Of]=b;a[Pf]=d;zj(a,b,!1,!1);b.stateNode=a;a:{g=vb(c,d);switch(c){case "dialog":D$2("cancel",a);D$2("close",a);e=d;break;case "iframe":case "object":case "embed":D$2("load",a);e=d;break;case "video":case "audio":for(e=0;e<lf$1.length;e++)D$2(lf$1[e],a);e=d;break;case "source":D$2("error",a);e=d;break;case "img":case "image":case "link":D$2("error",
a);D$2("load",a);e=d;break;case "details":D$2("toggle",a);e=d;break;case "input":Za(a,d);e=Ya(a,d);D$2("invalid",a);break;case "option":e=d;break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=A$1({},d,{value:void 0});D$2("invalid",a);break;case "textarea":hb(a,d);e=gb(a,d);D$2("invalid",a);break;default:e=d;}ub(c,e);h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?sb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&nb(a,k)):"children"===f?"string"===typeof k?("textarea"!==
c||""!==k)&&ob(a,k):"number"===typeof k&&ob(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ea.hasOwnProperty(f)?null!=k&&"onScroll"===f&&D$2("scroll",a):null!=k&&ta(a,f,k,g));}switch(c){case "input":Va(a);db(a,d,!1);break;case "textarea":Va(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,!1):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,
!0);break;default:"function"===typeof e.onClick&&(a.onclick=Bf);}switch(c){case "button":case "input":case "select":case "textarea":d=!!d.autoFocus;break a;case "img":d=!0;break a;default:d=!1;}}d&&(b.flags|=4);}null!==b.ref&&(b.flags|=512,b.flags|=2097152);}S$2(b);return null;case 6:if(a&&null!=b.stateNode)Cj(a,b,a.memoizedProps,d);else {if("string"!==typeof d&&null===b.stateNode)throw Error(p$5(166));c=xh(wh.current);xh(uh.current);if(Gg(b)){d=b.stateNode;c=b.memoizedProps;d[Of]=b;if(f=d.nodeValue!==c)if(a=
xg,null!==a)switch(a.tag){case 3:Af(d.nodeValue,c,0!==(a.mode&1));break;case 5:!0!==a.memoizedProps.suppressHydrationWarning&&Af(d.nodeValue,c,0!==(a.mode&1));}f&&(b.flags|=4);}else d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[Of]=b,b.stateNode=d;}S$2(b);return null;case 13:E$1(L$2);d=b.memoizedState;if(null===a||null!==a.memoizedState&&null!==a.memoizedState.dehydrated){if(I$1&&null!==yg&&0!==(b.mode&1)&&0===(b.flags&128))Hg(),Ig(),b.flags|=98560,f=!1;else if(f=Gg(b),null!==d&&null!==d.dehydrated){if(null===
a){if(!f)throw Error(p$5(318));f=b.memoizedState;f=null!==f?f.dehydrated:null;if(!f)throw Error(p$5(317));f[Of]=b;}else Ig(),0===(b.flags&128)&&(b.memoizedState=null),b.flags|=4;S$2(b);f=!1;}else null!==zg&&(Fj(zg),zg=null),f=!0;if(!f)return b.flags&65536?b:null}if(0!==(b.flags&128))return b.lanes=c,b;d=null!==d;d!==(null!==a&&null!==a.memoizedState)&&d&&(b.child.flags|=8192,0!==(b.mode&1)&&(null===a||0!==(L$2.current&1)?0===T$2&&(T$2=3):tj()));null!==b.updateQueue&&(b.flags|=4);S$2(b);return null;case 4:return zh(),
Aj(a,b),null===a&&sf(b.stateNode.containerInfo),S$2(b),null;case 10:return ah(b.type._context),S$2(b),null;case 17:return Zf(b.type)&&$f(),S$2(b),null;case 19:E$1(L$2);f=b.memoizedState;if(null===f)return S$2(b),null;d=0!==(b.flags&128);g=f.rendering;if(null===g)if(d)Dj(f,!1);else {if(0!==T$2||null!==a&&0!==(a.flags&128))for(a=b.child;null!==a;){g=Ch(a);if(null!==g){b.flags|=128;Dj(f,!1);d=g.updateQueue;null!==d&&(b.updateQueue=d,b.flags|=4);b.subtreeFlags=0;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=14680066,
g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.subtreeFlags=0,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.subtreeFlags=0,f.deletions=null,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;G$1(L$2,L$2.current&1|2);return b.child}a=
a.sibling;}null!==f.tail&&B$1()>Gj&&(b.flags|=128,d=!0,Dj(f,!1),b.lanes=4194304);}else {if(!d)if(a=Ch(g),null!==a){if(b.flags|=128,d=!0,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Dj(f,!0),null===f.tail&&"hidden"===f.tailMode&&!g.alternate&&!I$1)return S$2(b),null}else 2*B$1()-f.renderingStartTime>Gj&&1073741824!==c&&(b.flags|=128,d=!0,Dj(f,!1),b.lanes=4194304);f.isBackwards?(g.sibling=b.child,b.child=g):(c=f.last,null!==c?c.sibling=g:b.child=g,f.last=g);}if(null!==f.tail)return b=f.tail,f.rendering=
b,f.tail=b.sibling,f.renderingStartTime=B$1(),b.sibling=null,c=L$2.current,G$1(L$2,d?c&1|2:c&1),b;S$2(b);return null;case 22:case 23:return Hj(),d=null!==b.memoizedState,null!==a&&null!==a.memoizedState!==d&&(b.flags|=8192),d&&0!==(b.mode&1)?0!==(fj&1073741824)&&(S$2(b),b.subtreeFlags&6&&(b.flags|=8192)):S$2(b),null;case 24:return null;case 25:return null}throw Error(p$5(156,b.tag));}
function Ij(a,b){wg(b);switch(b.tag){case 1:return Zf(b.type)&&$f(),a=b.flags,a&65536?(b.flags=a&-65537|128,b):null;case 3:return zh(),E$1(Wf),E$1(H$1),Eh(),a=b.flags,0!==(a&65536)&&0===(a&128)?(b.flags=a&-65537|128,b):null;case 5:return Bh(b),null;case 13:E$1(L$2);a=b.memoizedState;if(null!==a&&null!==a.dehydrated){if(null===b.alternate)throw Error(p$5(340));Ig();}a=b.flags;return a&65536?(b.flags=a&-65537|128,b):null;case 19:return E$1(L$2),null;case 4:return zh(),null;case 10:return ah(b.type._context),null;case 22:case 23:return Hj(),
null;case 24:return null;default:return null}}var Jj=!1,U$1=!1,Kj="function"===typeof WeakSet?WeakSet:Set,V$1=null;function Lj(a,b){var c=a.ref;if(null!==c)if("function"===typeof c)try{c(null);}catch(d){W$1(a,b,d);}else c.current=null;}function Mj(a,b,c){try{c();}catch(d){W$1(a,b,d);}}var Nj=!1;
function Oj(a,b){Cf=dd;a=Me$1();if(Ne$1(a)){if("selectionStart"in a)var c={start:a.selectionStart,end:a.selectionEnd};else a:{c=(c=a.ownerDocument)&&c.defaultView||window;var d=c.getSelection&&c.getSelection();if(d&&0!==d.rangeCount){c=d.anchorNode;var e=d.anchorOffset,f=d.focusNode;d=d.focusOffset;try{c.nodeType,f.nodeType;}catch(F){c=null;break a}var g=0,h=-1,k=-1,l=0,m=0,q=a,r=null;b:for(;;){for(var y;;){q!==c||0!==e&&3!==q.nodeType||(h=g+e);q!==f||0!==d&&3!==q.nodeType||(k=g+d);3===q.nodeType&&(g+=
q.nodeValue.length);if(null===(y=q.firstChild))break;r=q;q=y;}for(;;){if(q===a)break b;r===c&&++l===e&&(h=g);r===f&&++m===d&&(k=g);if(null!==(y=q.nextSibling))break;q=r;r=q.parentNode;}q=y;}c=-1===h||-1===k?null:{start:h,end:k};}else c=null;}c=c||{start:0,end:0};}else c=null;Df={focusedElem:a,selectionRange:c};dd=!1;for(V$1=b;null!==V$1;)if(b=V$1,a=b.child,0!==(b.subtreeFlags&1028)&&null!==a)a.return=b,V$1=a;else for(;null!==V$1;){b=V$1;try{var n=b.alternate;if(0!==(b.flags&1024))switch(b.tag){case 0:case 11:case 15:break;
case 1:if(null!==n){var t=n.memoizedProps,J=n.memoizedState,x=b.stateNode,w=x.getSnapshotBeforeUpdate(b.elementType===b.type?t:Ci$1(b.type,t),J);x.__reactInternalSnapshotBeforeUpdate=w;}break;case 3:var u=b.stateNode.containerInfo;1===u.nodeType?u.textContent="":9===u.nodeType&&u.documentElement&&u.removeChild(u.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(p$5(163));}}catch(F){W$1(b,b.return,F);}a=b.sibling;if(null!==a){a.return=b.return;V$1=a;break}V$1=b.return;}n=Nj;Nj=!1;return n}
function Pj(a,b,c){var d=b.updateQueue;d=null!==d?d.lastEffect:null;if(null!==d){var e=d=d.next;do{if((e.tag&a)===a){var f=e.destroy;e.destroy=void 0;void 0!==f&&Mj(b,c,f);}e=e.next;}while(e!==d)}}function Qj(a,b){b=b.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){var c=b=b.next;do{if((c.tag&a)===a){var d=c.create;c.destroy=d();}c=c.next;}while(c!==b)}}function Rj(a){var b=a.ref;if(null!==b){var c=a.stateNode;switch(a.tag){case 5:a=c;break;default:a=c;}"function"===typeof b?b(a):b.current=a;}}
function Sj(a){var b=a.alternate;null!==b&&(a.alternate=null,Sj(b));a.child=null;a.deletions=null;a.sibling=null;5===a.tag&&(b=a.stateNode,null!==b&&(delete b[Of],delete b[Pf],delete b[of],delete b[Qf],delete b[Rf]));a.stateNode=null;a.return=null;a.dependencies=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.stateNode=null;a.updateQueue=null;}function Tj(a){return 5===a.tag||3===a.tag||4===a.tag}
function Uj(a){a:for(;;){for(;null===a.sibling;){if(null===a.return||Tj(a.return))return null;a=a.return;}a.sibling.return=a.return;for(a=a.sibling;5!==a.tag&&6!==a.tag&&18!==a.tag;){if(a.flags&2)continue a;if(null===a.child||4===a.tag)continue a;else a.child.return=a,a=a.child;}if(!(a.flags&2))return a.stateNode}}
function Vj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=Bf));else if(4!==d&&(a=a.child,null!==a))for(Vj(a,b,c),a=a.sibling;null!==a;)Vj(a,b,c),a=a.sibling;}
function Wj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(Wj(a,b,c),a=a.sibling;null!==a;)Wj(a,b,c),a=a.sibling;}var X$1=null,Xj=!1;function Yj(a,b,c){for(c=c.child;null!==c;)Zj(a,b,c),c=c.sibling;}
function Zj(a,b,c){if(lc&&"function"===typeof lc.onCommitFiberUnmount)try{lc.onCommitFiberUnmount(kc,c);}catch(h){}switch(c.tag){case 5:U$1||Lj(c,b);case 6:var d=X$1,e=Xj;X$1=null;Yj(a,b,c);X$1=d;Xj=e;null!==X$1&&(Xj?(a=X$1,c=c.stateNode,8===a.nodeType?a.parentNode.removeChild(c):a.removeChild(c)):X$1.removeChild(c.stateNode));break;case 18:null!==X$1&&(Xj?(a=X$1,c=c.stateNode,8===a.nodeType?Kf(a.parentNode,c):1===a.nodeType&&Kf(a,c),bd(a)):Kf(X$1,c.stateNode));break;case 4:d=X$1;e=Xj;X$1=c.stateNode.containerInfo;Xj=!0;
Yj(a,b,c);X$1=d;Xj=e;break;case 0:case 11:case 14:case 15:if(!U$1&&(d=c.updateQueue,null!==d&&(d=d.lastEffect,null!==d))){e=d=d.next;do{var f=e,g=f.destroy;f=f.tag;void 0!==g&&(0!==(f&2)?Mj(c,b,g):0!==(f&4)&&Mj(c,b,g));e=e.next;}while(e!==d)}Yj(a,b,c);break;case 1:if(!U$1&&(Lj(c,b),d=c.stateNode,"function"===typeof d.componentWillUnmount))try{d.props=c.memoizedProps,d.state=c.memoizedState,d.componentWillUnmount();}catch(h){W$1(c,b,h);}Yj(a,b,c);break;case 21:Yj(a,b,c);break;case 22:c.mode&1?(U$1=(d=U$1)||null!==
c.memoizedState,Yj(a,b,c),U$1=d):Yj(a,b,c);break;default:Yj(a,b,c);}}function ak(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Kj);b.forEach(function(b){var d=bk.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d));});}}
function ck(a,b){var c=b.deletions;if(null!==c)for(var d=0;d<c.length;d++){var e=c[d];try{var f=a,g=b,h=g;a:for(;null!==h;){switch(h.tag){case 5:X$1=h.stateNode;Xj=!1;break a;case 3:X$1=h.stateNode.containerInfo;Xj=!0;break a;case 4:X$1=h.stateNode.containerInfo;Xj=!0;break a}h=h.return;}if(null===X$1)throw Error(p$5(160));Zj(f,g,e);X$1=null;Xj=!1;var k=e.alternate;null!==k&&(k.return=null);e.return=null;}catch(l){W$1(e,b,l);}}if(b.subtreeFlags&12854)for(b=b.child;null!==b;)dk(b,a),b=b.sibling;}
function dk(a,b){var c=a.alternate,d=a.flags;switch(a.tag){case 0:case 11:case 14:case 15:ck(b,a);ek(a);if(d&4){try{Pj(3,a,a.return),Qj(3,a);}catch(t){W$1(a,a.return,t);}try{Pj(5,a,a.return);}catch(t){W$1(a,a.return,t);}}break;case 1:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);break;case 5:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);if(a.flags&32){var e=a.stateNode;try{ob(e,"");}catch(t){W$1(a,a.return,t);}}if(d&4&&(e=a.stateNode,null!=e)){var f=a.memoizedProps,g=null!==c?c.memoizedProps:f,h=a.type,k=a.updateQueue;
a.updateQueue=null;if(null!==k)try{"input"===h&&"radio"===f.type&&null!=f.name&&ab(e,f);vb(h,g);var l=vb(h,f);for(g=0;g<k.length;g+=2){var m=k[g],q=k[g+1];"style"===m?sb(e,q):"dangerouslySetInnerHTML"===m?nb(e,q):"children"===m?ob(e,q):ta(e,m,q,l);}switch(h){case "input":bb(e,f);break;case "textarea":ib(e,f);break;case "select":var r=e._wrapperState.wasMultiple;e._wrapperState.wasMultiple=!!f.multiple;var y=f.value;null!=y?fb(e,!!f.multiple,y,!1):r!==!!f.multiple&&(null!=f.defaultValue?fb(e,!!f.multiple,
f.defaultValue,!0):fb(e,!!f.multiple,f.multiple?[]:"",!1));}e[Pf]=f;}catch(t){W$1(a,a.return,t);}}break;case 6:ck(b,a);ek(a);if(d&4){if(null===a.stateNode)throw Error(p$5(162));e=a.stateNode;f=a.memoizedProps;try{e.nodeValue=f;}catch(t){W$1(a,a.return,t);}}break;case 3:ck(b,a);ek(a);if(d&4&&null!==c&&c.memoizedState.isDehydrated)try{bd(b.containerInfo);}catch(t){W$1(a,a.return,t);}break;case 4:ck(b,a);ek(a);break;case 13:ck(b,a);ek(a);e=a.child;e.flags&8192&&(f=null!==e.memoizedState,e.stateNode.isHidden=f,!f||
null!==e.alternate&&null!==e.alternate.memoizedState||(fk=B$1()));d&4&&ak(a);break;case 22:m=null!==c&&null!==c.memoizedState;a.mode&1?(U$1=(l=U$1)||m,ck(b,a),U$1=l):ck(b,a);ek(a);if(d&8192){l=null!==a.memoizedState;if((a.stateNode.isHidden=l)&&!m&&0!==(a.mode&1))for(V$1=a,m=a.child;null!==m;){for(q=V$1=m;null!==V$1;){r=V$1;y=r.child;switch(r.tag){case 0:case 11:case 14:case 15:Pj(4,r,r.return);break;case 1:Lj(r,r.return);var n=r.stateNode;if("function"===typeof n.componentWillUnmount){d=r;c=r.return;try{b=d,n.props=
b.memoizedProps,n.state=b.memoizedState,n.componentWillUnmount();}catch(t){W$1(d,c,t);}}break;case 5:Lj(r,r.return);break;case 22:if(null!==r.memoizedState){gk(q);continue}}null!==y?(y.return=r,V$1=y):gk(q);}m=m.sibling;}a:for(m=null,q=a;;){if(5===q.tag){if(null===m){m=q;try{e=q.stateNode,l?(f=e.style,"function"===typeof f.setProperty?f.setProperty("display","none","important"):f.display="none"):(h=q.stateNode,k=q.memoizedProps.style,g=void 0!==k&&null!==k&&k.hasOwnProperty("display")?k.display:null,h.style.display=
rb("display",g));}catch(t){W$1(a,a.return,t);}}}else if(6===q.tag){if(null===m)try{q.stateNode.nodeValue=l?"":q.memoizedProps;}catch(t){W$1(a,a.return,t);}}else if((22!==q.tag&&23!==q.tag||null===q.memoizedState||q===a)&&null!==q.child){q.child.return=q;q=q.child;continue}if(q===a)break a;for(;null===q.sibling;){if(null===q.return||q.return===a)break a;m===q&&(m=null);q=q.return;}m===q&&(m=null);q.sibling.return=q.return;q=q.sibling;}}break;case 19:ck(b,a);ek(a);d&4&&ak(a);break;case 21:break;default:ck(b,
a),ek(a);}}function ek(a){var b=a.flags;if(b&2){try{a:{for(var c=a.return;null!==c;){if(Tj(c)){var d=c;break a}c=c.return;}throw Error(p$5(160));}switch(d.tag){case 5:var e=d.stateNode;d.flags&32&&(ob(e,""),d.flags&=-33);var f=Uj(a);Wj(a,f,e);break;case 3:case 4:var g=d.stateNode.containerInfo,h=Uj(a);Vj(a,h,g);break;default:throw Error(p$5(161));}}catch(k){W$1(a,a.return,k);}a.flags&=-3;}b&4096&&(a.flags&=-4097);}function hk(a,b,c){V$1=a;ik(a);}
function ik(a,b,c){for(var d=0!==(a.mode&1);null!==V$1;){var e=V$1,f=e.child;if(22===e.tag&&d){var g=null!==e.memoizedState||Jj;if(!g){var h=e.alternate,k=null!==h&&null!==h.memoizedState||U$1;h=Jj;var l=U$1;Jj=g;if((U$1=k)&&!l)for(V$1=e;null!==V$1;)g=V$1,k=g.child,22===g.tag&&null!==g.memoizedState?jk(e):null!==k?(k.return=g,V$1=k):jk(e);for(;null!==f;)V$1=f,ik(f),f=f.sibling;V$1=e;Jj=h;U$1=l;}kk(a);}else 0!==(e.subtreeFlags&8772)&&null!==f?(f.return=e,V$1=f):kk(a);}}
function kk(a){for(;null!==V$1;){var b=V$1;if(0!==(b.flags&8772)){var c=b.alternate;try{if(0!==(b.flags&8772))switch(b.tag){case 0:case 11:case 15:U$1||Qj(5,b);break;case 1:var d=b.stateNode;if(b.flags&4&&!U$1)if(null===c)d.componentDidMount();else {var e=b.elementType===b.type?c.memoizedProps:Ci$1(b.type,c.memoizedProps);d.componentDidUpdate(e,c.memoizedState,d.__reactInternalSnapshotBeforeUpdate);}var f=b.updateQueue;null!==f&&sh(b,f,d);break;case 3:var g=b.updateQueue;if(null!==g){c=null;if(null!==b.child)switch(b.child.tag){case 5:c=
b.child.stateNode;break;case 1:c=b.child.stateNode;}sh(b,g,c);}break;case 5:var h=b.stateNode;if(null===c&&b.flags&4){c=h;var k=b.memoizedProps;switch(b.type){case "button":case "input":case "select":case "textarea":k.autoFocus&&c.focus();break;case "img":k.src&&(c.src=k.src);}}break;case 6:break;case 4:break;case 12:break;case 13:if(null===b.memoizedState){var l=b.alternate;if(null!==l){var m=l.memoizedState;if(null!==m){var q=m.dehydrated;null!==q&&bd(q);}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;
default:throw Error(p$5(163));}U$1||b.flags&512&&Rj(b);}catch(r){W$1(b,b.return,r);}}if(b===a){V$1=null;break}c=b.sibling;if(null!==c){c.return=b.return;V$1=c;break}V$1=b.return;}}function gk(a){for(;null!==V$1;){var b=V$1;if(b===a){V$1=null;break}var c=b.sibling;if(null!==c){c.return=b.return;V$1=c;break}V$1=b.return;}}
function jk(a){for(;null!==V$1;){var b=V$1;try{switch(b.tag){case 0:case 11:case 15:var c=b.return;try{Qj(4,b);}catch(k){W$1(b,c,k);}break;case 1:var d=b.stateNode;if("function"===typeof d.componentDidMount){var e=b.return;try{d.componentDidMount();}catch(k){W$1(b,e,k);}}var f=b.return;try{Rj(b);}catch(k){W$1(b,f,k);}break;case 5:var g=b.return;try{Rj(b);}catch(k){W$1(b,g,k);}}}catch(k){W$1(b,b.return,k);}if(b===a){V$1=null;break}var h=b.sibling;if(null!==h){h.return=b.return;V$1=h;break}V$1=b.return;}}
var lk=Math.ceil,mk=ua.ReactCurrentDispatcher,nk=ua.ReactCurrentOwner,ok=ua.ReactCurrentBatchConfig,K$1=0,Q$1=null,Y$1=null,Z$1=0,fj=0,ej=Uf(0),T$2=0,pk=null,rh=0,qk=0,rk=0,sk=null,tk=null,fk=0,Gj=Infinity,uk=null,Oi=!1,Pi$1=null,Ri=null,vk=!1,wk=null,xk=0,yk=0,zk=null,Ak=-1,Bk=0;function R$1(){return 0!==(K$1&6)?B$1():-1!==Ak?Ak:Ak=B$1()}
function yi$1(a){if(0===(a.mode&1))return 1;if(0!==(K$1&2)&&0!==Z$1)return Z$1&-Z$1;if(null!==Kg.transition)return 0===Bk&&(Bk=yc()),Bk;a=C$2;if(0!==a)return a;a=window.event;a=void 0===a?16:jd(a.type);return a}function gi$1(a,b,c,d){if(50<yk)throw yk=0,zk=null,Error(p$5(185));Ac(a,c,d);if(0===(K$1&2)||a!==Q$1)a===Q$1&&(0===(K$1&2)&&(qk|=c),4===T$2&&Ck(a,Z$1)),Dk(a,d),1===c&&0===K$1&&0===(b.mode&1)&&(Gj=B$1()+500,fg&&jg());}
function Dk(a,b){var c=a.callbackNode;wc(a,b);var d=uc(a,a===Q$1?Z$1:0);if(0===d)null!==c&&bc(c),a.callbackNode=null,a.callbackPriority=0;else if(b=d&-d,a.callbackPriority!==b){null!=c&&bc(c);if(1===b)0===a.tag?ig(Ek.bind(null,a)):hg(Ek.bind(null,a)),Jf(function(){0===(K$1&6)&&jg();}),c=null;else {switch(Dc(d)){case 1:c=fc;break;case 4:c=gc;break;case 16:c=hc;break;case 536870912:c=jc;break;default:c=hc;}c=Fk(c,Gk.bind(null,a));}a.callbackPriority=b;a.callbackNode=c;}}
function Gk(a,b){Ak=-1;Bk=0;if(0!==(K$1&6))throw Error(p$5(327));var c=a.callbackNode;if(Hk()&&a.callbackNode!==c)return null;var d=uc(a,a===Q$1?Z$1:0);if(0===d)return null;if(0!==(d&30)||0!==(d&a.expiredLanes)||b)b=Ik(a,d);else {b=d;var e=K$1;K$1|=2;var f=Jk();if(Q$1!==a||Z$1!==b)uk=null,Gj=B$1()+500,Kk(a,b);do try{Lk();break}catch(h){Mk(a,h);}while(1);$g();mk.current=f;K$1=e;null!==Y$1?b=0:(Q$1=null,Z$1=0,b=T$2);}if(0!==b){2===b&&(e=xc(a),0!==e&&(d=e,b=Nk(a,e)));if(1===b)throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B$1()),c;if(6===b)Ck(a,d);
else {e=a.current.alternate;if(0===(d&30)&&!Ok(e)&&(b=Ik(a,d),2===b&&(f=xc(a),0!==f&&(d=f,b=Nk(a,f))),1===b))throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B$1()),c;a.finishedWork=e;a.finishedLanes=d;switch(b){case 0:case 1:throw Error(p$5(345));case 2:Pk(a,tk,uk);break;case 3:Ck(a,d);if((d&130023424)===d&&(b=fk+500-B$1(),10<b)){if(0!==uc(a,0))break;e=a.suspendedLanes;if((e&d)!==d){R$1();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=Ff(Pk.bind(null,a,tk,uk),b);break}Pk(a,tk,uk);break;case 4:Ck(a,d);if((d&4194240)===
d)break;b=a.eventTimes;for(e=-1;0<d;){var g=31-oc(d);f=1<<g;g=b[g];g>e&&(e=g);d&=~f;}d=e;d=B$1()-d;d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3E3>d?3E3:4320>d?4320:1960*lk(d/1960))-d;if(10<d){a.timeoutHandle=Ff(Pk.bind(null,a,tk,uk),d);break}Pk(a,tk,uk);break;case 5:Pk(a,tk,uk);break;default:throw Error(p$5(329));}}}Dk(a,B$1());return a.callbackNode===c?Gk.bind(null,a):null}
function Nk(a,b){var c=sk;a.current.memoizedState.isDehydrated&&(Kk(a,b).flags|=256);a=Ik(a,b);2!==a&&(b=tk,tk=c,null!==b&&Fj(b));return a}function Fj(a){null===tk?tk=a:tk.push.apply(tk,a);}
function Ok(a){for(var b=a;;){if(b.flags&16384){var c=b.updateQueue;if(null!==c&&(c=c.stores,null!==c))for(var d=0;d<c.length;d++){var e=c[d],f=e.getSnapshot;e=e.value;try{if(!He$1(f(),e))return !1}catch(g){return !1}}}c=b.child;if(b.subtreeFlags&16384&&null!==c)c.return=b,b=c;else {if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return !0;b=b.return;}b.sibling.return=b.return;b=b.sibling;}}return !0}
function Ck(a,b){b&=~rk;b&=~qk;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-oc(b),d=1<<c;a[c]=-1;b&=~d;}}function Ek(a){if(0!==(K$1&6))throw Error(p$5(327));Hk();var b=uc(a,0);if(0===(b&1))return Dk(a,B$1()),null;var c=Ik(a,b);if(0!==a.tag&&2===c){var d=xc(a);0!==d&&(b=d,c=Nk(a,d));}if(1===c)throw c=pk,Kk(a,0),Ck(a,b),Dk(a,B$1()),c;if(6===c)throw Error(p$5(345));a.finishedWork=a.current.alternate;a.finishedLanes=b;Pk(a,tk,uk);Dk(a,B$1());return null}
function Qk(a,b){var c=K$1;K$1|=1;try{return a(b)}finally{K$1=c,0===K$1&&(Gj=B$1()+500,fg&&jg());}}function Rk(a){null!==wk&&0===wk.tag&&0===(K$1&6)&&Hk();var b=K$1;K$1|=1;var c=ok.transition,d=C$2;try{if(ok.transition=null,C$2=1,a)return a()}finally{C$2=d,ok.transition=c,K$1=b,0===(K$1&6)&&jg();}}function Hj(){fj=ej.current;E$1(ej);}
function Kk(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,Gf(c));if(null!==Y$1)for(c=Y$1.return;null!==c;){var d=c;wg(d);switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&$f();break;case 3:zh();E$1(Wf);E$1(H$1);Eh();break;case 5:Bh(d);break;case 4:zh();break;case 13:E$1(L$2);break;case 19:E$1(L$2);break;case 10:ah(d.type._context);break;case 22:case 23:Hj();}c=c.return;}Q$1=a;Y$1=a=Pg(a.current,null);Z$1=fj=b;T$2=0;pk=null;rk=qk=rh=0;tk=sk=null;if(null!==fh){for(b=
0;b<fh.length;b++)if(c=fh[b],d=c.interleaved,null!==d){c.interleaved=null;var e=d.next,f=c.pending;if(null!==f){var g=f.next;f.next=e;d.next=g;}c.pending=d;}fh=null;}return a}
function Mk(a,b){do{var c=Y$1;try{$g();Fh.current=Rh;if(Ih){for(var d=M$3.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next;}Ih=!1;}Hh=0;O$1=N$1=M$3=null;Jh=!1;Kh=0;nk.current=null;if(null===c||null===c.return){T$2=1;pk=b;Y$1=null;break}a:{var f=a,g=c.return,h=c,k=b;b=Z$1;h.flags|=32768;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k,m=h,q=m.tag;if(0===(m.mode&1)&&(0===q||11===q||15===q)){var r=m.alternate;r?(m.updateQueue=r.updateQueue,m.memoizedState=r.memoizedState,
m.lanes=r.lanes):(m.updateQueue=null,m.memoizedState=null);}var y=Ui(g);if(null!==y){y.flags&=-257;Vi(y,g,h,f,b);y.mode&1&&Si$1(f,l,b);b=y;k=l;var n=b.updateQueue;if(null===n){var t=new Set;t.add(k);b.updateQueue=t;}else n.add(k);break a}else {if(0===(b&1)){Si$1(f,l,b);tj();break a}k=Error(p$5(426));}}else if(I$1&&h.mode&1){var J=Ui(g);if(null!==J){0===(J.flags&65536)&&(J.flags|=256);Vi(J,g,h,f,b);Jg(Ji(k,h));break a}}f=k=Ji(k,h);4!==T$2&&(T$2=2);null===sk?sk=[f]:sk.push(f);f=g;do{switch(f.tag){case 3:f.flags|=65536;
b&=-b;f.lanes|=b;var x=Ni$1(f,k,b);ph(f,x);break a;case 1:h=k;var w=f.type,u=f.stateNode;if(0===(f.flags&128)&&("function"===typeof w.getDerivedStateFromError||null!==u&&"function"===typeof u.componentDidCatch&&(null===Ri||!Ri.has(u)))){f.flags|=65536;b&=-b;f.lanes|=b;var F=Qi(f,h,b);ph(f,F);break a}}f=f.return;}while(null!==f)}Sk(c);}catch(na){b=na;Y$1===c&&null!==c&&(Y$1=c=c.return);continue}break}while(1)}function Jk(){var a=mk.current;mk.current=Rh;return null===a?Rh:a}
function tj(){if(0===T$2||3===T$2||2===T$2)T$2=4;null===Q$1||0===(rh&268435455)&&0===(qk&268435455)||Ck(Q$1,Z$1);}function Ik(a,b){var c=K$1;K$1|=2;var d=Jk();if(Q$1!==a||Z$1!==b)uk=null,Kk(a,b);do try{Tk();break}catch(e){Mk(a,e);}while(1);$g();K$1=c;mk.current=d;if(null!==Y$1)throw Error(p$5(261));Q$1=null;Z$1=0;return T$2}function Tk(){for(;null!==Y$1;)Uk(Y$1);}function Lk(){for(;null!==Y$1&&!cc();)Uk(Y$1);}function Uk(a){var b=Vk(a.alternate,a,fj);a.memoizedProps=a.pendingProps;null===b?Sk(a):Y$1=b;nk.current=null;}
function Sk(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&32768)){if(c=Ej(c,b,fj),null!==c){Y$1=c;return}}else {c=Ij(c,b);if(null!==c){c.flags&=32767;Y$1=c;return}if(null!==a)a.flags|=32768,a.subtreeFlags=0,a.deletions=null;else {T$2=6;Y$1=null;return}}b=b.sibling;if(null!==b){Y$1=b;return}Y$1=b=a;}while(null!==b);0===T$2&&(T$2=5);}function Pk(a,b,c){var d=C$2,e=ok.transition;try{ok.transition=null,C$2=1,Wk(a,b,c,d);}finally{ok.transition=e,C$2=d;}return null}
function Wk(a,b,c,d){do Hk();while(null!==wk);if(0!==(K$1&6))throw Error(p$5(327));c=a.finishedWork;var e=a.finishedLanes;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(p$5(177));a.callbackNode=null;a.callbackPriority=0;var f=c.lanes|c.childLanes;Bc(a,f);a===Q$1&&(Y$1=Q$1=null,Z$1=0);0===(c.subtreeFlags&2064)&&0===(c.flags&2064)||vk||(vk=!0,Fk(hc,function(){Hk();return null}));f=0!==(c.flags&15990);if(0!==(c.subtreeFlags&15990)||f){f=ok.transition;ok.transition=null;
var g=C$2;C$2=1;var h=K$1;K$1|=4;nk.current=null;Oj(a,c);dk(c,a);Oe$1(Df);dd=!!Cf;Df=Cf=null;a.current=c;hk(c);dc();K$1=h;C$2=g;ok.transition=f;}else a.current=c;vk&&(vk=!1,wk=a,xk=e);f=a.pendingLanes;0===f&&(Ri=null);mc(c.stateNode);Dk(a,B$1());if(null!==b)for(d=a.onRecoverableError,c=0;c<b.length;c++)e=b[c],d(e.value,{componentStack:e.stack,digest:e.digest});if(Oi)throw Oi=!1,a=Pi$1,Pi$1=null,a;0!==(xk&1)&&0!==a.tag&&Hk();f=a.pendingLanes;0!==(f&1)?a===zk?yk++:(yk=0,zk=a):yk=0;jg();return null}
function Hk(){if(null!==wk){var a=Dc(xk),b=ok.transition,c=C$2;try{ok.transition=null;C$2=16>a?16:a;if(null===wk)var d=!1;else {a=wk;wk=null;xk=0;if(0!==(K$1&6))throw Error(p$5(331));var e=K$1;K$1|=4;for(V$1=a.current;null!==V$1;){var f=V$1,g=f.child;if(0!==(V$1.flags&16)){var h=f.deletions;if(null!==h){for(var k=0;k<h.length;k++){var l=h[k];for(V$1=l;null!==V$1;){var m=V$1;switch(m.tag){case 0:case 11:case 15:Pj(8,m,f);}var q=m.child;if(null!==q)q.return=m,V$1=q;else for(;null!==V$1;){m=V$1;var r=m.sibling,y=m.return;Sj(m);if(m===
l){V$1=null;break}if(null!==r){r.return=y;V$1=r;break}V$1=y;}}}var n=f.alternate;if(null!==n){var t=n.child;if(null!==t){n.child=null;do{var J=t.sibling;t.sibling=null;t=J;}while(null!==t)}}V$1=f;}}if(0!==(f.subtreeFlags&2064)&&null!==g)g.return=f,V$1=g;else b:for(;null!==V$1;){f=V$1;if(0!==(f.flags&2048))switch(f.tag){case 0:case 11:case 15:Pj(9,f,f.return);}var x=f.sibling;if(null!==x){x.return=f.return;V$1=x;break b}V$1=f.return;}}var w=a.current;for(V$1=w;null!==V$1;){g=V$1;var u=g.child;if(0!==(g.subtreeFlags&2064)&&null!==
u)u.return=g,V$1=u;else b:for(g=w;null!==V$1;){h=V$1;if(0!==(h.flags&2048))try{switch(h.tag){case 0:case 11:case 15:Qj(9,h);}}catch(na){W$1(h,h.return,na);}if(h===g){V$1=null;break b}var F=h.sibling;if(null!==F){F.return=h.return;V$1=F;break b}V$1=h.return;}}K$1=e;jg();if(lc&&"function"===typeof lc.onPostCommitFiberRoot)try{lc.onPostCommitFiberRoot(kc,a);}catch(na){}d=!0;}return d}finally{C$2=c,ok.transition=b;}}return !1}function Xk(a,b,c){b=Ji(c,b);b=Ni$1(a,b,1);a=nh(a,b,1);b=R$1();null!==a&&(Ac(a,1,b),Dk(a,b));}
function W$1(a,b,c){if(3===a.tag)Xk(a,a,c);else for(;null!==b;){if(3===b.tag){Xk(b,a,c);break}else if(1===b.tag){var d=b.stateNode;if("function"===typeof b.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ri||!Ri.has(d))){a=Ji(c,a);a=Qi(b,a,1);b=nh(b,a,1);a=R$1();null!==b&&(Ac(b,1,a),Dk(b,a));break}}b=b.return;}}
function Ti$1(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=R$1();a.pingedLanes|=a.suspendedLanes&c;Q$1===a&&(Z$1&c)===c&&(4===T$2||3===T$2&&(Z$1&130023424)===Z$1&&500>B$1()-fk?Kk(a,0):rk|=c);Dk(a,b);}function Yk(a,b){0===b&&(0===(a.mode&1)?b=1:(b=sc,sc<<=1,0===(sc&130023424)&&(sc=4194304)));var c=R$1();a=ih(a,b);null!==a&&(Ac(a,b,c),Dk(a,c));}function uj(a){var b=a.memoizedState,c=0;null!==b&&(c=b.retryLane);Yk(a,c);}
function bk(a,b){var c=0;switch(a.tag){case 13:var d=a.stateNode;var e=a.memoizedState;null!==e&&(c=e.retryLane);break;case 19:d=a.stateNode;break;default:throw Error(p$5(314));}null!==d&&d.delete(b);Yk(a,c);}var Vk;
Vk=function(a,b,c){if(null!==a)if(a.memoizedProps!==b.pendingProps||Wf.current)dh=!0;else {if(0===(a.lanes&c)&&0===(b.flags&128))return dh=!1,yj(a,b,c);dh=0!==(a.flags&131072)?!0:!1;}else dh=!1,I$1&&0!==(b.flags&1048576)&&ug(b,ng,b.index);b.lanes=0;switch(b.tag){case 2:var d=b.type;ij(a,b);a=b.pendingProps;var e=Yf(b,H$1.current);ch(b,c);e=Nh(null,b,d,a,e,c);var f=Sh();b.flags|=1;"object"===typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof?(b.tag=1,b.memoizedState=null,b.updateQueue=
null,Zf(d)?(f=!0,cg(b)):f=!1,b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null,kh(b),e.updater=Ei$1,b.stateNode=e,e._reactInternals=b,Ii(b,d,a,c),b=jj(null,b,d,!0,f,c)):(b.tag=0,I$1&&f&&vg(b),Xi(null,b,e,c),b=b.child);return b;case 16:d=b.elementType;a:{ij(a,b);a=b.pendingProps;e=d._init;d=e(d._payload);b.type=d;e=b.tag=Zk(d);a=Ci$1(d,a);switch(e){case 0:b=cj(null,b,d,a,c);break a;case 1:b=hj(null,b,d,a,c);break a;case 11:b=Yi(null,b,d,a,c);break a;case 14:b=$i(null,b,d,Ci$1(d.type,a),c);break a}throw Error(p$5(306,
d,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),cj(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),hj(a,b,d,e,c);case 3:a:{kj(b);if(null===a)throw Error(p$5(387));d=b.pendingProps;f=b.memoizedState;e=f.element;lh(a,b);qh(b,d,null,c);var g=b.memoizedState;d=g.element;if(f.isDehydrated)if(f={element:d,isDehydrated:!1,cache:g.cache,pendingSuspenseBoundaries:g.pendingSuspenseBoundaries,transitions:g.transitions},b.updateQueue.baseState=
f,b.memoizedState=f,b.flags&256){e=Ji(Error(p$5(423)),b);b=lj(a,b,d,c,e);break a}else if(d!==e){e=Ji(Error(p$5(424)),b);b=lj(a,b,d,c,e);break a}else for(yg=Lf(b.stateNode.containerInfo.firstChild),xg=b,I$1=!0,zg=null,c=Vg(b,null,d,c),b.child=c;c;)c.flags=c.flags&-3|4096,c=c.sibling;else {Ig();if(d===e){b=Zi(a,b,c);break a}Xi(a,b,d,c);}b=b.child;}return b;case 5:return Ah(b),null===a&&Eg(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,Ef(d,e)?g=null:null!==f&&Ef(d,f)&&(b.flags|=32),
gj(a,b),Xi(a,b,g,c),b.child;case 6:return null===a&&Eg(b),null;case 13:return oj(a,b,c);case 4:return yh(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Ug(b,null,d,c):Xi(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),Yi(a,b,d,e,c);case 7:return Xi(a,b,b.pendingProps,c),b.child;case 8:return Xi(a,b,b.pendingProps.children,c),b.child;case 12:return Xi(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;f=b.memoizedProps;
g=e.value;G$1(Wg,d._currentValue);d._currentValue=g;if(null!==f)if(He$1(f.value,g)){if(f.children===e.children&&!Wf.current){b=Zi(a,b,c);break a}}else for(f=b.child,null!==f&&(f.return=b);null!==f;){var h=f.dependencies;if(null!==h){g=f.child;for(var k=h.firstContext;null!==k;){if(k.context===d){if(1===f.tag){k=mh(-1,c&-c);k.tag=2;var l=f.updateQueue;if(null!==l){l=l.shared;var m=l.pending;null===m?k.next=k:(k.next=m.next,m.next=k);l.pending=k;}}f.lanes|=c;k=f.alternate;null!==k&&(k.lanes|=c);bh(f.return,
c,b);h.lanes|=c;break}k=k.next;}}else if(10===f.tag)g=f.type===b.type?null:f.child;else if(18===f.tag){g=f.return;if(null===g)throw Error(p$5(341));g.lanes|=c;h=g.alternate;null!==h&&(h.lanes|=c);bh(g,c,b);g=f.sibling;}else g=f.child;if(null!==g)g.return=f;else for(g=f;null!==g;){if(g===b){g=null;break}f=g.sibling;if(null!==f){f.return=g.return;g=f;break}g=g.return;}f=g;}Xi(a,b,e.children,c);b=b.child;}return b;case 9:return e=b.type,d=b.pendingProps.children,ch(b,c),e=eh(e),d=d(e),b.flags|=1,Xi(a,b,d,c),
b.child;case 14:return d=b.type,e=Ci$1(d,b.pendingProps),e=Ci$1(d.type,e),$i(a,b,d,e,c);case 15:return bj(a,b,b.type,b.pendingProps,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),ij(a,b),b.tag=1,Zf(d)?(a=!0,cg(b)):a=!1,ch(b,c),Gi(b,d,e),Ii(b,d,e,c),jj(null,b,d,!0,a,c);case 19:return xj(a,b,c);case 22:return dj(a,b,c)}throw Error(p$5(156,b.tag));};function Fk(a,b){return ac(a,b)}
function $k(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.subtreeFlags=this.flags=0;this.deletions=null;this.childLanes=this.lanes=0;this.alternate=null;}function Bg(a,b,c,d){return new $k(a,b,c,d)}function aj(a){a=a.prototype;return !(!a||!a.isReactComponent)}
function Zk(a){if("function"===typeof a)return aj(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Da)return 11;if(a===Ga)return 14}return 2}
function Pg(a,b){var c=a.alternate;null===c?(c=Bg(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.subtreeFlags=0,c.deletions=null);c.flags=a.flags&14680064;c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
function Rg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)aj(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ya:return Tg(c.children,e,f,b);case za:g=8;e|=8;break;case Aa:return a=Bg(12,c,b,e|2),a.elementType=Aa,a.lanes=f,a;case Ea:return a=Bg(13,c,b,e),a.elementType=Ea,a.lanes=f,a;case Fa:return a=Bg(19,c,b,e),a.elementType=Fa,a.lanes=f,a;case Ia:return pj(c,e,f,b);default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case Ba:g=10;break a;case Ca:g=9;break a;case Da:g=11;
break a;case Ga:g=14;break a;case Ha:g=16;d=null;break a}throw Error(p$5(130,null==a?a:typeof a,""));}b=Bg(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Tg(a,b,c,d){a=Bg(7,a,d,b);a.lanes=c;return a}function pj(a,b,c,d){a=Bg(22,a,d,b);a.elementType=Ia;a.lanes=c;a.stateNode={isHidden:!1};return a}function Qg(a,b,c){a=Bg(6,a,null,b);a.lanes=c;return a}
function Sg(a,b,c){b=Bg(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function al(a,b,c,d,e){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.callbackNode=this.pendingContext=this.context=null;this.callbackPriority=0;this.eventTimes=zc(0);this.expirationTimes=zc(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=zc(0);this.identifierPrefix=d;this.onRecoverableError=e;this.mutableSourceEagerHydrationData=
null;}function bl(a,b,c,d,e,f,g,h,k){a=new al(a,b,c,h,k);1===b?(b=1,!0===f&&(b|=8)):b=0;f=Bg(3,null,null,b);a.current=f;f.stateNode=a;f.memoizedState={element:d,isDehydrated:c,cache:null,transitions:null,pendingSuspenseBoundaries:null};kh(f);return a}function cl(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return {$$typeof:wa,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
function dl(a){if(!a)return Vf;a=a._reactInternals;a:{if(Vb(a)!==a||1!==a.tag)throw Error(p$5(170));var b=a;do{switch(b.tag){case 3:b=b.stateNode.context;break a;case 1:if(Zf(b.type)){b=b.stateNode.__reactInternalMemoizedMergedChildContext;break a}}b=b.return;}while(null!==b);throw Error(p$5(171));}if(1===a.tag){var c=a.type;if(Zf(c))return bg(a,c,b)}return b}
function el(a,b,c,d,e,f,g,h,k){a=bl(c,d,!0,a,e,f,g,h,k);a.context=dl(null);c=a.current;d=R$1();e=yi$1(c);f=mh(d,e);f.callback=void 0!==b&&null!==b?b:null;nh(c,f,e);a.current.lanes=e;Ac(a,e,d);Dk(a,d);return a}function fl(a,b,c,d){var e=b.current,f=R$1(),g=yi$1(e);c=dl(c);null===b.context?b.context=c:b.pendingContext=c;b=mh(f,g);b.payload={element:a};d=void 0===d?null:d;null!==d&&(b.callback=d);a=nh(e,b,g);null!==a&&(gi$1(a,e,g,f),oh(a,e,g));return g}
function gl(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function hl(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b;}}function il(a,b){hl(a,b);(a=a.alternate)&&hl(a,b);}function jl(){return null}var kl="function"===typeof reportError?reportError:function(a){console.error(a);};function ll(a){this._internalRoot=a;}
ml.prototype.render=ll.prototype.render=function(a){var b=this._internalRoot;if(null===b)throw Error(p$5(409));fl(a,b,null,null);};ml.prototype.unmount=ll.prototype.unmount=function(){var a=this._internalRoot;if(null!==a){this._internalRoot=null;var b=a.containerInfo;Rk(function(){fl(null,a,null,null);});b[uf]=null;}};function ml(a){this._internalRoot=a;}
ml.prototype.unstable_scheduleHydration=function(a){if(a){var b=Hc();a={blockedOn:null,target:a,priority:b};for(var c=0;c<Qc.length&&0!==b&&b<Qc[c].priority;c++);Qc.splice(c,0,a);0===c&&Vc(a);}};function nl(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType)}function ol(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}function pl(){}
function ql(a,b,c,d,e){if(e){if("function"===typeof d){var f=d;d=function(){var a=gl(g);f.call(a);};}var g=el(b,d,a,0,null,!1,!1,"",pl);a._reactRootContainer=g;a[uf]=g.current;sf(8===a.nodeType?a.parentNode:a);Rk();return g}for(;e=a.lastChild;)a.removeChild(e);if("function"===typeof d){var h=d;d=function(){var a=gl(k);h.call(a);};}var k=bl(a,0,!1,null,null,!1,!1,"",pl);a._reactRootContainer=k;a[uf]=k.current;sf(8===a.nodeType?a.parentNode:a);Rk(function(){fl(b,k,c,d);});return k}
function rl(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f;if("function"===typeof e){var h=e;e=function(){var a=gl(g);h.call(a);};}fl(b,g,a,e);}else g=ql(c,b,a,e,d);return gl(g)}Ec=function(a){switch(a.tag){case 3:var b=a.stateNode;if(b.current.memoizedState.isDehydrated){var c=tc(b.pendingLanes);0!==c&&(Cc(b,c|1),Dk(b,B$1()),0===(K$1&6)&&(Gj=B$1()+500,jg()));}break;case 13:Rk(function(){var b=ih(a,1);if(null!==b){var c=R$1();gi$1(b,a,1,c);}}),il(a,1);}};
Fc=function(a){if(13===a.tag){var b=ih(a,134217728);if(null!==b){var c=R$1();gi$1(b,a,134217728,c);}il(a,134217728);}};Gc=function(a){if(13===a.tag){var b=yi$1(a),c=ih(a,b);if(null!==c){var d=R$1();gi$1(c,a,b,d);}il(a,b);}};Hc=function(){return C$2};Ic=function(a,b){var c=C$2;try{return C$2=a,b()}finally{C$2=c;}};
yb=function(a,b,c){switch(b){case "input":bb(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(p$5(90));Wa(d);bb(d,e);}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,!1);}};Gb=Qk;Hb=Rk;
var sl={usingClientEntryPoint:!1,Events:[Cb,ue$1,Db,Eb,Fb,Qk]},tl={findFiberByHostInstance:Wc,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"};
var ul={bundleType:tl.bundleType,version:tl.version,rendererPackageName:tl.rendererPackageName,rendererConfig:tl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ua.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=Zb(a);return null===a?null:a.stateNode},findFiberByHostInstance:tl.findFiberByHostInstance||
jl,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var vl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!vl.isDisabled&&vl.supportsFiber)try{kc=vl.inject(ul),lc=vl;}catch(a){}}reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sl;
reactDom_production_min.createPortal=function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!nl(b))throw Error(p$5(200));return cl(a,b,null,c)};reactDom_production_min.createRoot=function(a,b){if(!nl(a))throw Error(p$5(299));var c=!1,d="",e=kl;null!==b&&void 0!==b&&(!0===b.unstable_strictMode&&(c=!0),void 0!==b.identifierPrefix&&(d=b.identifierPrefix),void 0!==b.onRecoverableError&&(e=b.onRecoverableError));b=bl(a,1,!1,null,null,c,!1,d,e);a[uf]=b.current;sf(8===a.nodeType?a.parentNode:a);return new ll(b)};
reactDom_production_min.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(p$5(188));a=Object.keys(a).join(",");throw Error(p$5(268,a));}a=Zb(b);a=null===a?null:a.stateNode;return a};reactDom_production_min.flushSync=function(a){return Rk(a)};reactDom_production_min.hydrate=function(a,b,c){if(!ol(b))throw Error(p$5(200));return rl(null,a,b,!0,c)};
reactDom_production_min.hydrateRoot=function(a,b,c){if(!nl(a))throw Error(p$5(405));var d=null!=c&&c.hydratedSources||null,e=!1,f="",g=kl;null!==c&&void 0!==c&&(!0===c.unstable_strictMode&&(e=!0),void 0!==c.identifierPrefix&&(f=c.identifierPrefix),void 0!==c.onRecoverableError&&(g=c.onRecoverableError));b=el(b,null,a,1,null!=c?c:null,e,!1,f,g);a[uf]=b.current;sf(a);if(d)for(a=0;a<d.length;a++)c=d[a],e=c._getVersion,e=e(c._source),null==b.mutableSourceEagerHydrationData?b.mutableSourceEagerHydrationData=[c,e]:b.mutableSourceEagerHydrationData.push(c,
e);return new ml(b)};reactDom_production_min.render=function(a,b,c){if(!ol(b))throw Error(p$5(200));return rl(null,a,b,!1,c)};reactDom_production_min.unmountComponentAtNode=function(a){if(!ol(a))throw Error(p$5(40));return a._reactRootContainer?(Rk(function(){rl(null,null,a,!1,function(){a._reactRootContainer=null;a[uf]=null;});}),!0):!1};reactDom_production_min.unstable_batchedUpdates=Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!ol(c))throw Error(p$5(200));if(null==a||void 0===a._reactInternals)throw Error(p$5(38));return rl(a,b,c,!1,d)};reactDom_production_min.version="18.3.1-next-f1338f8080-20240426";

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
var m$6 = reactDomExports;
{
  createRoot = m$6.createRoot;
  m$6.hydrateRoot;
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
 * @remix-run/router v1.19.2
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
    let treePath = [...parentPath, String(index)];
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
  return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
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
    matches = matchRouteBranch(branches[i], decoded, allowPartial);
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
function matchRouteBranch(branch, pathname, allowPartial) {
  if (allowPartial === void 0) {
    allowPartial = false;
  }
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
    let route = meta.route;
    if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
      match = matchPath({
        path: meta.relativePath,
        caseSensitive: meta.caseSensitive,
        end: false
      }, remainingPathname);
    }
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
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
    return pathMatches.map((match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase);
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
  let patchRoutesOnNavigationImpl = init.unstable_patchRoutesOnNavigation;
  // Config driven behavior flags
  let future = _extends$2({
    v7_fetcherPersist: false,
    v7_normalizeFormMethod: false,
    v7_partialHydration: false,
    v7_prependBasename: false,
    v7_relativeSplatPath: false,
    v7_skipActionErrorRevalidation: false
  }, init.future);
  // Cleanup function for history
  let unlistenHistory = null;
  // Externally-provided functions to call on all state changes
  let subscribers = new Set();
  // FIFO queue of previously discovered routes to prevent re-calling on
  // subsequent navigations to the same path
  let discoveredRoutesMaxSize = 1000;
  let discoveredRoutes = new Set();
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
  if (initialMatches == null && !patchRoutesOnNavigationImpl) {
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
  // In SPA apps, if the user provided a patchRoutesOnNavigation implementation and
  // our initial match is a splat route, clear them out so we run through lazy
  // discovery on hydration in case there's a more accurate lazy route match.
  // In SSR apps (with `hydrationData`), we expect that the server will send
  // up the proper matched routes so we don't want to run lazy discovery on
  // initial hydration and want to hydrate into the splat route.
  if (initialMatches && !init.hydrationData) {
    let fogOfWar = checkFogOfWar(initialMatches, dataRoutes, init.history.location.pathname);
    if (fogOfWar.active) {
      initialMatches = null;
    }
  }
  let initialized;
  if (!initialMatches) {
    initialized = false;
    initialMatches = [];
    // If partial hydration and fog of war is enabled, we will be running
    // `patchRoutesOnNavigation` during hydration so include any partial matches as
    // the initial matches so we can properly render `HydrateFallback`'s
    if (future.v7_partialHydration) {
      let fogOfWar = checkFogOfWar(null, dataRoutes, init.history.location.pathname);
      if (fogOfWar.active && fogOfWar.matches) {
        initialMatches = fogOfWar.matches;
      }
    }
  } else if (initialMatches.some(m => m.route.lazy)) {
    // All initialMatches need to be loaded before we're ready.  If we have lazy
    // functions around still then we'll need to run them in initialize()
    initialized = false;
  } else if (!initialMatches.some(m => m.route.loader)) {
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
  let cancelledFetcherLoads = new Set();
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
  // Map of pending patchRoutesOnNavigation() promises (keyed by path/matches) so
  // that we only kick them off once for a given combo
  let pendingPatchRoutes = new Map();
  // Flag to ignore the next history update, so we can revert the URL change on
  // a POP navigation that was blocked by the user without touching router state
  let unblockBlockerHistoryUpdate = undefined;
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
      if (unblockBlockerHistoryUpdate) {
        unblockBlockerHistoryUpdate();
        unblockBlockerHistoryUpdate = undefined;
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
        let nextHistoryUpdatePromise = new Promise(resolve => {
          unblockBlockerHistoryUpdate = resolve;
        });
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
            // Re-do the same POP navigation we just blocked, after the url
            // restoration is also complete.  See:
            // https://github.com/remix-run/react-router/issues/11613
            nextHistoryUpdatePromise.then(() => init.history.go(delta));
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
    // Commit any in-flight routes at the end of the HMR revalidation "navigation"
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
      overrideNavigation: state.navigation,
      // Proxy through any rending view transition
      enableViewTransition: pendingViewTransitionEnabled === true
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
    let fogOfWar = checkFogOfWar(matches, routesToUse, location.pathname);
    if (fogOfWar.active && fogOfWar.matches) {
      matches = fogOfWar.matches;
    }
    // Short circuit with a 404 on the root error boundary if we match nothing
    if (!matches) {
      let {
        error,
        notFoundMatches,
        route
      } = handleNavigational404(location.pathname);
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
      let actionResult = await handleAction(request, location, opts.submission, matches, fogOfWar.active, {
        replace: opts.replace,
        flushSync
      });
      if (actionResult.shortCircuited) {
        return;
      }
      // If we received a 404 from handleAction, it's because we couldn't lazily
      // discover the destination route so we don't want to call loaders
      if (actionResult.pendingActionResult) {
        let [routeId, result] = actionResult.pendingActionResult;
        if (isErrorResult(result) && isRouteErrorResponse(result.error) && result.error.status === 404) {
          pendingNavigationController = null;
          completeNavigation(location, {
            matches: actionResult.matches,
            loaderData: {},
            errors: {
              [routeId]: result.error
            }
          });
          return;
        }
      }
      matches = actionResult.matches || matches;
      pendingActionResult = actionResult.pendingActionResult;
      loadingNavigation = getLoadingNavigation(location, opts.submission);
      flushSync = false;
      // No need to do fog of war matching again on loader execution
      fogOfWar.active = false;
      // Create a GET request for the loaders
      request = createClientSideRequest(init.history, request.url, request.signal);
    }
    // Call loaders
    let {
      shortCircuited,
      matches: updatedMatches,
      loaderData,
      errors
    } = await handleLoaders(request, location, matches, fogOfWar.active, loadingNavigation, opts && opts.submission, opts && opts.fetcherSubmission, opts && opts.replace, opts && opts.initialHydration === true, flushSync, pendingActionResult);
    if (shortCircuited) {
      return;
    }
    // Clean up now that the action/loaders have completed.  Don't clean up if
    // we short circuited because pendingNavigationController will have already
    // been assigned to a new controller for the next navigation
    pendingNavigationController = null;
    completeNavigation(location, _extends$2({
      matches: updatedMatches || matches
    }, getActionDataForCommit(pendingActionResult), {
      loaderData,
      errors
    }));
  }
  // Call the action matched by the leaf route for this navigation and handle
  // redirects/errors
  async function handleAction(request, location, submission, matches, isFogOfWar, opts) {
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
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(matches, location.pathname, request.signal);
      if (discoverResult.type === "aborted") {
        return {
          shortCircuited: true
        };
      } else if (discoverResult.type === "error") {
        let {
          boundaryId,
          error
        } = handleDiscoverRouteError(location.pathname, discoverResult);
        return {
          matches: discoverResult.partialMatches,
          pendingActionResult: [boundaryId, {
            type: ResultType.error,
            error
          }]
        };
      } else if (!discoverResult.matches) {
        let {
          notFoundMatches,
          error,
          route
        } = handleNavigational404(location.pathname);
        return {
          matches: notFoundMatches,
          pendingActionResult: [route.id, {
            type: ResultType.error,
            error
          }]
        };
      } else {
        matches = discoverResult.matches;
      }
    }
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
      let results = await callDataStrategy("action", state, request, [actionMatch], matches, null);
      result = results[actionMatch.route.id];
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
      await startRedirectNavigation(request, result, true, {
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
      // By default, all submissions to the current location are REPLACE
      // navigations, but if the action threw an error that'll be rendered in
      // an errorElement, we fall back to PUSH so that the user can use the
      // back button to get back to the pre-submission form location to try
      // again
      if ((opts && opts.replace) !== true) {
        pendingAction = Action.Push;
      }
      return {
        matches,
        pendingActionResult: [boundaryMatch.route.id, result]
      };
    }
    return {
      matches,
      pendingActionResult: [actionMatch.route.id, result]
    };
  }
  // Call all applicable loaders for the given matches, handling redirects,
  // errors, etc.
  async function handleLoaders(request, location, matches, isFogOfWar, overrideNavigation, submission, fetcherSubmission, replace, initialHydration, flushSync, pendingActionResult) {
    // Figure out the right navigation we want to use for data loading
    let loadingNavigation = overrideNavigation || getLoadingNavigation(location, submission);
    // If this was a redirect from an action we don't have a "submission" but
    // we have it on the loading navigation so use that if available
    let activeSubmission = submission || fetcherSubmission || getSubmissionFromNavigation(loadingNavigation);
    // If this is an uninterrupted revalidation, we remain in our current idle
    // state.  If not, we need to switch to our loading state and load data,
    // preserving any new action data or existing action data (in the case of
    // a revalidation interrupting an actionReload)
    // If we have partialHydration enabled, then don't update the state for the
    // initial data load since it's not a "navigation"
    let shouldUpdateNavigationState = !isUninterruptedRevalidation && (!future.v7_partialHydration || !initialHydration);
    // When fog of war is enabled, we enter our `loading` state earlier so we
    // can discover new routes during the `loading` state.  We skip this if
    // we've already run actions since we would have done our matching already.
    // If the children() function threw then, we want to proceed with the
    // partial matches it discovered.
    if (isFogOfWar) {
      if (shouldUpdateNavigationState) {
        let actionData = getUpdatedActionData(pendingActionResult);
        updateState(_extends$2({
          navigation: loadingNavigation
        }, actionData !== undefined ? {
          actionData
        } : {}), {
          flushSync
        });
      }
      let discoverResult = await discoverRoutes(matches, location.pathname, request.signal);
      if (discoverResult.type === "aborted") {
        return {
          shortCircuited: true
        };
      } else if (discoverResult.type === "error") {
        let {
          boundaryId,
          error
        } = handleDiscoverRouteError(location.pathname, discoverResult);
        return {
          matches: discoverResult.partialMatches,
          loaderData: {},
          errors: {
            [boundaryId]: error
          }
        };
      } else if (!discoverResult.matches) {
        let {
          error,
          notFoundMatches,
          route
        } = handleNavigational404(location.pathname);
        return {
          matches: notFoundMatches,
          loaderData: {},
          errors: {
            [route.id]: error
          }
        };
      } else {
        matches = discoverResult.matches;
      }
    }
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, activeSubmission, location, future.v7_partialHydration && initialHydration === true, future.v7_skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionResult);
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
    if (shouldUpdateNavigationState) {
      let updates = {};
      if (!isFogOfWar) {
        // Only update navigation/actionNData if we didn't already do it above
        updates.navigation = loadingNavigation;
        let actionData = getUpdatedActionData(pendingActionResult);
        if (actionData !== undefined) {
          updates.actionData = actionData;
        }
      }
      if (revalidatingFetchers.length > 0) {
        updates.fetchers = getUpdatedRevalidatingFetchers(revalidatingFetchers);
      }
      updateState(updates, {
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
    } = await callLoadersAndMaybeResolveData(state, matches, matchesToLoad, revalidatingFetchers, request);
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
    let redirect = findRedirect(loaderResults);
    if (redirect) {
      await startRedirectNavigation(request, redirect.result, true, {
        replace
      });
      return {
        shortCircuited: true
      };
    }
    redirect = findRedirect(fetcherResults);
    if (redirect) {
      // If this redirect came from a fetcher make sure we mark it in
      // fetchRedirectIds so it doesn't get revalidated on the next set of
      // loader executions
      fetchRedirectIds.add(redirect.key);
      await startRedirectNavigation(request, redirect.result, true, {
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
      matches,
      loaderData,
      errors
    }, shouldUpdateFetchers ? {
      fetchers: new Map(state.fetchers)
    } : {});
  }
  function getUpdatedActionData(pendingActionResult) {
    if (pendingActionResult && !isErrorResult(pendingActionResult[1])) {
      // This is cast to `any` currently because `RouteData`uses any and it
      // would be a breaking change to use any.
      // TODO: v7 - change `RouteData` to use `unknown` instead of `any`
      return {
        [pendingActionResult[0]]: pendingActionResult[1].data
      };
    } else if (state.actionData) {
      if (Object.keys(state.actionData).length === 0) {
        return null;
      } else {
        return state.actionData;
      }
    }
  }
  function getUpdatedRevalidatingFetchers(revalidatingFetchers) {
    revalidatingFetchers.forEach(rf => {
      let fetcher = state.fetchers.get(rf.key);
      let revalidatingFetcher = getLoadingFetcher(undefined, fetcher ? fetcher.data : undefined);
      state.fetchers.set(rf.key, revalidatingFetcher);
    });
    return new Map(state.fetchers);
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
    let fogOfWar = checkFogOfWar(matches, routesToUse, normalizedPath);
    if (fogOfWar.active && fogOfWar.matches) {
      matches = fogOfWar.matches;
    }
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
      handleFetcherAction(key, routeId, path, match, matches, fogOfWar.active, flushSync, submission);
      return;
    }
    // Store off the match so we can call it's shouldRevalidate on subsequent
    // revalidations
    fetchLoadMatches.set(key, {
      routeId,
      path
    });
    handleFetcherLoader(key, routeId, path, match, matches, fogOfWar.active, flushSync, submission);
  }
  // Call the action for the matched fetcher.submit(), and then handle redirects,
  // errors, and revalidation
  async function handleFetcherAction(key, routeId, path, match, requestMatches, isFogOfWar, flushSync, submission) {
    interruptActiveLoads();
    fetchLoadMatches.delete(key);
    function detectAndHandle405Error(m) {
      if (!m.route.action && !m.route.lazy) {
        let error = getInternalRouterError(405, {
          method: submission.formMethod,
          pathname: path,
          routeId: routeId
        });
        setFetcherError(key, routeId, error, {
          flushSync
        });
        return true;
      }
      return false;
    }
    if (!isFogOfWar && detectAndHandle405Error(match)) {
      return;
    }
    // Put this fetcher into it's submitting state
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getSubmittingFetcher(submission, existingFetcher), {
      flushSync
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal, submission);
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(requestMatches, path, fetchRequest.signal);
      if (discoverResult.type === "aborted") {
        return;
      } else if (discoverResult.type === "error") {
        let {
          error
        } = handleDiscoverRouteError(path, discoverResult);
        setFetcherError(key, routeId, error, {
          flushSync
        });
        return;
      } else if (!discoverResult.matches) {
        setFetcherError(key, routeId, getInternalRouterError(404, {
          pathname: path
        }), {
          flushSync
        });
        return;
      } else {
        requestMatches = discoverResult.matches;
        match = getTargetMatch(requestMatches, path);
        if (detectAndHandle405Error(match)) {
          return;
        }
      }
    }
    // Call the action for the fetcher
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let actionResults = await callDataStrategy("action", state, fetchRequest, [match], requestMatches, key);
    let actionResult = actionResults[match.route.id];
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
          return startRedirectNavigation(fetchRequest, actionResult, false, {
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
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, submission, nextLocation, false, future.v7_skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, [match.route.id, actionResult]);
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
    } = await callLoadersAndMaybeResolveData(state, matches, matchesToLoad, revalidatingFetchers, revalidationRequest);
    if (abortController.signal.aborted) {
      return;
    }
    abortController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
    fetchReloadIds.delete(key);
    fetchControllers.delete(key);
    revalidatingFetchers.forEach(r => fetchControllers.delete(r.key));
    let redirect = findRedirect(loaderResults);
    if (redirect) {
      return startRedirectNavigation(revalidationRequest, redirect.result, false);
    }
    redirect = findRedirect(fetcherResults);
    if (redirect) {
      // If this redirect came from a fetcher make sure we mark it in
      // fetchRedirectIds so it doesn't get revalidated on the next set of
      // loader executions
      fetchRedirectIds.add(redirect.key);
      return startRedirectNavigation(revalidationRequest, redirect.result, false);
    }
    // Process and commit output from loaders
    let {
      loaderData,
      errors
    } = processLoaderData(state, matches, matchesToLoad, loaderResults, undefined, revalidatingFetchers, fetcherResults, activeDeferreds);
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
  async function handleFetcherLoader(key, routeId, path, match, matches, isFogOfWar, flushSync, submission) {
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getLoadingFetcher(submission, existingFetcher ? existingFetcher.data : undefined), {
      flushSync
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal);
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(matches, path, fetchRequest.signal);
      if (discoverResult.type === "aborted") {
        return;
      } else if (discoverResult.type === "error") {
        let {
          error
        } = handleDiscoverRouteError(path, discoverResult);
        setFetcherError(key, routeId, error, {
          flushSync
        });
        return;
      } else if (!discoverResult.matches) {
        setFetcherError(key, routeId, getInternalRouterError(404, {
          pathname: path
        }), {
          flushSync
        });
        return;
      } else {
        matches = discoverResult.matches;
        match = getTargetMatch(matches, path);
      }
    }
    // Call the loader for this fetcher route match
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let results = await callDataStrategy("loader", state, fetchRequest, [match], matches, key);
    let result = results[match.route.id];
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
        await startRedirectNavigation(fetchRequest, result, false);
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
  async function startRedirectNavigation(request, redirect, isNavigation, _temp2) {
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
    let redirectHistoryAction = replace === true || redirect.response.headers.has("X-Remix-Replace") ? Action.Replace : Action.Push;
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
        // Preserve these flags across redirects
        preventScrollReset: pendingPreventScrollReset,
        enableViewTransition: isNavigation ? pendingViewTransitionEnabled : undefined
      });
    } else {
      // If we have a navigation submission, we will preserve it through the
      // redirect navigation
      let overrideNavigation = getLoadingNavigation(redirectLocation, submission);
      await startNavigation(redirectHistoryAction, redirectLocation, {
        overrideNavigation,
        // Send fetcher submissions through for shouldRevalidate
        fetcherSubmission,
        // Preserve these flags across redirects
        preventScrollReset: pendingPreventScrollReset,
        enableViewTransition: isNavigation ? pendingViewTransitionEnabled : undefined
      });
    }
  }
  // Utility wrapper for calling dataStrategy client-side without having to
  // pass around the manifest, mapRouteProperties, etc.
  async function callDataStrategy(type, state, request, matchesToLoad, matches, fetcherKey) {
    let results;
    let dataResults = {};
    try {
      results = await callDataStrategyImpl(dataStrategyImpl, type, state, request, matchesToLoad, matches, fetcherKey, manifest, mapRouteProperties);
    } catch (e) {
      // If the outer dataStrategy method throws, just return the error for all
      // matches - and it'll naturally bubble to the root
      matchesToLoad.forEach(m => {
        dataResults[m.route.id] = {
          type: ResultType.error,
          error: e
        };
      });
      return dataResults;
    }
    for (let [routeId, result] of Object.entries(results)) {
      if (isRedirectDataStrategyResultResult(result)) {
        let response = result.result;
        dataResults[routeId] = {
          type: ResultType.redirect,
          response: normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename, future.v7_relativeSplatPath)
        };
      } else {
        dataResults[routeId] = await convertDataStrategyResultToDataResult(result);
      }
    }
    return dataResults;
  }
  async function callLoadersAndMaybeResolveData(state, matches, matchesToLoad, fetchersToLoad, request) {
    let currentMatches = state.matches;
    // Kick off loaders and fetchers in parallel
    let loaderResultsPromise = callDataStrategy("loader", state, request, matchesToLoad, matches, null);
    let fetcherResultsPromise = Promise.all(fetchersToLoad.map(async f => {
      if (f.matches && f.match && f.controller) {
        let results = await callDataStrategy("loader", state, createClientSideRequest(init.history, f.path, f.controller.signal), [f.match], f.matches, f.key);
        let result = results[f.match.route.id];
        // Fetcher results are keyed by fetcher key from here on out, not routeId
        return {
          [f.key]: result
        };
      } else {
        return Promise.resolve({
          [f.key]: {
            type: ResultType.error,
            error: getInternalRouterError(404, {
              pathname: f.path
            })
          }
        });
      }
    }));
    let loaderResults = await loaderResultsPromise;
    let fetcherResults = (await fetcherResultsPromise).reduce((acc, r) => Object.assign(acc, r), {});
    await Promise.all([resolveNavigationDeferredResults(matches, loaderResults, request.signal, currentMatches, state.loaderData), resolveFetcherDeferredResults(matches, fetcherResults, fetchersToLoad)]);
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
        cancelledFetcherLoads.add(key);
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
    cancelledFetcherLoads.delete(key);
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
  function handleNavigational404(pathname) {
    let error = getInternalRouterError(404, {
      pathname
    });
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let {
      matches,
      route
    } = getShortCircuitMatches(routesToUse);
    // Cancel all pending deferred on 404s since we don't keep any routes
    cancelActiveDeferreds();
    return {
      notFoundMatches: matches,
      route,
      error
    };
  }
  function handleDiscoverRouteError(pathname, discoverResult) {
    return {
      boundaryId: findNearestBoundary(discoverResult.partialMatches).route.id,
      error: getInternalRouterError(400, {
        type: "route-discovery",
        pathname,
        message: discoverResult.error != null && "message" in discoverResult.error ? discoverResult.error : String(discoverResult.error)
      })
    };
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
  function checkFogOfWar(matches, routesToUse, pathname) {
    if (patchRoutesOnNavigationImpl) {
      // Don't bother re-calling patchRouteOnMiss for a path we've already
      // processed.  the last execution would have patched the route tree
      // accordingly so `matches` here are already accurate.
      if (discoveredRoutes.has(pathname)) {
        return {
          active: false,
          matches
        };
      }
      if (!matches) {
        let fogMatches = matchRoutesImpl(routesToUse, pathname, basename, true);
        return {
          active: true,
          matches: fogMatches || []
        };
      } else {
        if (Object.keys(matches[0].params).length > 0) {
          // If we matched a dynamic param or a splat, it might only be because
          // we haven't yet discovered other routes that would match with a
          // higher score.  Call patchRoutesOnNavigation just to be sure
          let partialMatches = matchRoutesImpl(routesToUse, pathname, basename, true);
          return {
            active: true,
            matches: partialMatches
          };
        }
      }
    }
    return {
      active: false,
      matches: null
    };
  }
  async function discoverRoutes(matches, pathname, signal) {
    let partialMatches = matches;
    while (true) {
      let isNonHMR = inFlightDataRoutes == null;
      let routesToUse = inFlightDataRoutes || dataRoutes;
      try {
        await loadLazyRouteChildren(patchRoutesOnNavigationImpl, pathname, partialMatches, routesToUse, manifest, mapRouteProperties, pendingPatchRoutes, signal);
      } catch (e) {
        return {
          type: "error",
          error: e,
          partialMatches
        };
      } finally {
        // If we are not in the middle of an HMR revalidation and we changed the
        // routes, provide a new identity so when we `updateState` at the end of
        // this navigation/fetch `router.routes` will be a new identity and
        // trigger a re-run of memoized `router.routes` dependencies.
        // HMR will already update the identity and reflow when it lands
        // `inFlightDataRoutes` in `completeNavigation`
        if (isNonHMR) {
          dataRoutes = [...dataRoutes];
        }
      }
      if (signal.aborted) {
        return {
          type: "aborted"
        };
      }
      let newMatches = matchRoutes(routesToUse, pathname, basename);
      if (newMatches) {
        addToFifoQueue(pathname, discoveredRoutes);
        return {
          type: "success",
          matches: newMatches
        };
      }
      let newPartialMatches = matchRoutesImpl(routesToUse, pathname, basename, true);
      // Avoid loops if the second pass results in the same partial matches
      if (!newPartialMatches || partialMatches.length === newPartialMatches.length && partialMatches.every((m, i) => m.route.id === newPartialMatches[i].route.id)) {
        addToFifoQueue(pathname, discoveredRoutes);
        return {
          type: "success",
          matches: null
        };
      }
      partialMatches = newPartialMatches;
    }
  }
  function addToFifoQueue(path, queue) {
    if (queue.size >= discoveredRoutesMaxSize) {
      let first = queue.values().next().value;
      queue.delete(first);
    }
    queue.add(path);
  }
  function _internalSetRoutes(newRoutes) {
    manifest = {};
    inFlightDataRoutes = convertRoutesToDataRoutes(newRoutes, mapRouteProperties, undefined, manifest);
  }
  function patchRoutes(routeId, children) {
    let isNonHMR = inFlightDataRoutes == null;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    patchRoutesImpl(routeId, children, routesToUse, manifest, mapRouteProperties);
    // If we are not in the middle of an HMR revalidation and we changed the
    // routes, provide a new identity and trigger a reflow via `updateState`
    // to re-run memoized `router.routes` dependencies.
    // HMR will already update the identity and reflow when it lands
    // `inFlightDataRoutes` in `completeNavigation`
    if (isNonHMR) {
      dataRoutes = [...dataRoutes];
      updateState({});
    }
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
    patchRoutes,
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
      actionStatus,
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
    } else if (cancelledFetcherLoads.has(key)) {
      // Always mark for revalidation if the fetcher was cancelled
      cancelledFetcherLoads.delete(key);
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
        actionStatus,
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
 * Idempotent utility to execute patchRoutesOnNavigation() to lazily load route
 * definitions and update the routes/routeManifest
 */
async function loadLazyRouteChildren(patchRoutesOnNavigationImpl, path, matches, routes, manifest, mapRouteProperties, pendingRouteChildren, signal) {
  let key = [path, ...matches.map(m => m.route.id)].join("-");
  try {
    let pending = pendingRouteChildren.get(key);
    if (!pending) {
      pending = patchRoutesOnNavigationImpl({
        path,
        matches,
        patch: (routeId, children) => {
          if (!signal.aborted) {
            patchRoutesImpl(routeId, children, routes, manifest, mapRouteProperties);
          }
        }
      });
      pendingRouteChildren.set(key, pending);
    }
    if (pending && isPromise(pending)) {
      await pending;
    }
  } finally {
    pendingRouteChildren.delete(key);
  }
}
function patchRoutesImpl(routeId, children, routesToUse, manifest, mapRouteProperties) {
  if (routeId) {
    var _route$children;
    let route = manifest[routeId];
    invariant(route, "No route found to patch children into: routeId = " + routeId);
    let dataChildren = convertRoutesToDataRoutes(children, mapRouteProperties, [routeId, "patch", String(((_route$children = route.children) == null ? void 0 : _route$children.length) || "0")], manifest);
    if (route.children) {
      route.children.push(...dataChildren);
    } else {
      route.children = dataChildren;
    }
  } else {
    let dataChildren = convertRoutesToDataRoutes(children, mapRouteProperties, ["patch", String(routesToUse.length || "0")], manifest);
    routesToUse.push(...dataChildren);
  }
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
async function defaultDataStrategy(_ref6) {
  let {
    matches
  } = _ref6;
  let matchesToLoad = matches.filter(m => m.shouldLoad);
  let results = await Promise.all(matchesToLoad.map(m => m.resolve()));
  return results.reduce((acc, result, i) => Object.assign(acc, {
    [matchesToLoad[i].route.id]: result
  }), {});
}
async function callDataStrategyImpl(dataStrategyImpl, type, state, request, matchesToLoad, matches, fetcherKey, manifest, mapRouteProperties, requestContext) {
  let loadRouteDefinitionsPromises = matches.map(m => m.route.lazy ? loadLazyRouteModule(m.route, mapRouteProperties, manifest) : undefined);
  let dsMatches = matches.map((match, i) => {
    let loadRoutePromise = loadRouteDefinitionsPromises[i];
    let shouldLoad = matchesToLoad.some(m => m.route.id === match.route.id);
    // `resolve` encapsulates route.lazy(), executing the loader/action,
    // and mapping return values/thrown errors to a `DataStrategyResult`.  Users
    // can pass a callback to take fine-grained control over the execution
    // of the loader/action
    let resolve = async handlerOverride => {
      if (handlerOverride && request.method === "GET" && (match.route.lazy || match.route.loader)) {
        shouldLoad = true;
      }
      return shouldLoad ? callLoaderOrAction(type, request, match, loadRoutePromise, handlerOverride, requestContext) : Promise.resolve({
        type: ResultType.data,
        result: undefined
      });
    };
    return _extends$2({}, match, {
      shouldLoad,
      resolve
    });
  });
  // Send all matches here to allow for a middleware-type implementation.
  // handler will be a no-op for unneeded routes and we filter those results
  // back out below.
  let results = await dataStrategyImpl({
    matches: dsMatches,
    request,
    params: matches[0].params,
    fetcherKey,
    context: requestContext
  });
  // Wait for all routes to load here but 'swallow the error since we want
  // it to bubble up from the `await loadRoutePromise` in `callLoaderOrAction` -
  // called from `match.resolve()`
  try {
    await Promise.all(loadRouteDefinitionsPromises);
  } catch (e) {
    // No-op
  }
  return results;
}
// Default logic for calling a loader/action is the user has no specified a dataStrategy
async function callLoaderOrAction(type, request, match, loadRoutePromise, handlerOverride, staticContext) {
  let result;
  let onReject;
  let runHandler = handler => {
    // Setup a promise we can race against so that abort signals short circuit
    let reject;
    // This will never resolve so safe to type it as Promise<DataStrategyResult> to
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
    let handlerPromise = (async () => {
      try {
        let val = await (handlerOverride ? handlerOverride(ctx => actualHandler(ctx)) : actualHandler());
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
    return Promise.race([handlerPromise, abortPromise]);
  };
  try {
    let handler = match.route[type];
    // If we have a route.lazy promise, await that first
    if (loadRoutePromise) {
      if (handler) {
        // Run statically defined handler in parallel with lazy()
        let handlerError;
        let [value] = await Promise.all([
        // If the handler throws, don't let it immediately bubble out,
        // since we need to let the lazy() execution finish so we know if this
        // route has a boundary that can handle the error
        runHandler(handler).catch(e => {
          handlerError = e;
        }), loadRoutePromise]);
        if (handlerError !== undefined) {
          throw handlerError;
        }
        result = value;
      } else {
        // Load lazy route module, then run any returned handler
        await loadRoutePromise;
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
    // DataStrategyResults and returning them, so anything that throws here is an
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
async function convertDataStrategyResultToDataResult(dataStrategyResult) {
  let {
    result,
    type
  } = dataStrategyResult;
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
    if (isDataWithResponseInit(result)) {
      var _result$init2;
      if (result.data instanceof Error) {
        var _result$init;
        return {
          type: ResultType.error,
          error: result.data,
          statusCode: (_result$init = result.init) == null ? void 0 : _result$init.status
        };
      }
      // Convert thrown unstable_data() to ErrorResponse instances
      result = new ErrorResponseImpl(((_result$init2 = result.init) == null ? void 0 : _result$init2.status) || 500, undefined, result.data);
    }
    return {
      type: ResultType.error,
      error: result,
      statusCode: isRouteErrorResponse(result) ? result.status : undefined
    };
  }
  if (isDeferredData(result)) {
    var _result$init3, _result$init4;
    return {
      type: ResultType.deferred,
      deferredData: result,
      statusCode: (_result$init3 = result.init) == null ? void 0 : _result$init3.status,
      headers: ((_result$init4 = result.init) == null ? void 0 : _result$init4.headers) && new Headers(result.init.headers)
    };
  }
  if (isDataWithResponseInit(result)) {
    var _result$init5, _result$init6;
    return {
      type: ResultType.data,
      data: result.data,
      statusCode: (_result$init5 = result.init) == null ? void 0 : _result$init5.status,
      headers: (_result$init6 = result.init) != null && _result$init6.headers ? new Headers(result.init.headers) : undefined
    };
  }
  return {
    type: ResultType.data,
    data: result
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
function processRouteLoaderData(matches, results, pendingActionResult, activeDeferreds, skipLoaderErrorBubbling) {
  // Fill in loaderData/errors from our loaders
  let loaderData = {};
  let errors = null;
  let statusCode;
  let foundError = false;
  let loaderHeaders = {};
  let pendingError = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : undefined;
  // Process loader results into state.loaderData/state.errors
  matches.forEach(match => {
    if (!(match.route.id in results)) {
      return;
    }
    let id = match.route.id;
    let result = results[id];
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
  } = processRouteLoaderData(matches, results, pendingActionResult, activeDeferreds);
  // Process results from our revalidating fetchers
  revalidatingFetchers.forEach(rf => {
    let {
      key,
      match,
      controller
    } = rf;
    let result = fetcherResults[key];
    invariant(result, "Did not find corresponding fetcher result");
    // Process fetcher non-redirect errors
    if (controller && controller.signal.aborted) {
      // Nothing to do for aborted fetchers
      return;
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
  });
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
    type,
    message
  } = _temp5 === void 0 ? {} : _temp5;
  let statusText = "Unknown Server Error";
  let errorMessage = "Unknown @remix-run/router error";
  if (status === 400) {
    statusText = "Bad Request";
    if (type === "route-discovery") {
      errorMessage = "Unable to match URL \"" + pathname + "\" - the `unstable_patchRoutesOnNavigation()` " + ("function threw the following error:\n" + message);
    } else if (method && pathname && routeId) {
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
  let entries = Object.entries(results);
  for (let i = entries.length - 1; i >= 0; i--) {
    let [key, result] = entries[i];
    if (isRedirectResult(result)) {
      return {
        key,
        result
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
function isPromise(val) {
  return typeof val === "object" && val != null && "then" in val;
}
function isRedirectDataStrategyResultResult(result) {
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
function isDataWithResponseInit(value) {
  return typeof value === "object" && value != null && "type" in value && "data" in value && "init" in value && value.type === "DataWithResponseInit";
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
async function resolveNavigationDeferredResults(matches, results, signal, currentMatches, currentLoaderData) {
  let entries = Object.entries(results);
  for (let index = 0; index < entries.length; index++) {
    let [routeId, result] = entries[index];
    let match = matches.find(m => (m == null ? void 0 : m.route.id) === routeId);
    // If we don't have a match, then we can have a deferred result to do
    // anything with.  This is for revalidating fetchers where the route was
    // removed during HMR
    if (!match) {
      continue;
    }
    let currentMatch = currentMatches.find(m => m.route.id === match.route.id);
    let isRevalidatingLoader = currentMatch != null && !isNewRouteInstance(currentMatch, match) && (currentLoaderData && currentLoaderData[match.route.id]) !== undefined;
    if (isDeferredResult(result) && isRevalidatingLoader) {
      // Note: we do not have to touch activeDeferreds here since we race them
      // against the signal in resolveDeferredData and they'll get aborted
      // there if needed
      await resolveDeferredData(result, signal, false).then(result => {
        if (result) {
          results[routeId] = result;
        }
      });
    }
  }
}
async function resolveFetcherDeferredResults(matches, results, revalidatingFetchers) {
  for (let index = 0; index < revalidatingFetchers.length; index++) {
    let {
      key,
      routeId,
      controller
    } = revalidatingFetchers[index];
    let result = results[key];
    let match = matches.find(m => (m == null ? void 0 : m.route.id) === routeId);
    // If we don't have a match, then we can have a deferred result to do
    // anything with.  This is for revalidating fetchers where the route was
    // removed during HMR
    if (!match) {
      continue;
    }
    if (isDeferredResult(result)) {
      // Note: we do not have to touch activeDeferreds here since we race them
      // against the signal in resolveDeferredData and they'll get aborted
      // there if needed
      invariant(controller, "Expected an AbortController for revalidating fetcher deferred result");
      await resolveDeferredData(result, controller.signal, true).then(result => {
        if (result) {
          results[key] = result;
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
 * React Router v6.26.2
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
  var _dataRouterState;
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
    var _future;
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if ((_future = future) != null && _future.v7_partialHydration && parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = (_dataRouterState = dataRouterState) == null ? void 0 : _dataRouterState.errors;
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
    replace: replace2,
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
    replace: replace2,
    state,
    relative
  }), [navigate, jsonPath, relative, replace2, state]);
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
 * React Router DOM v6.26.2
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
    unstable_patchRoutesOnNavigation: opts == null ? void 0 : opts.unstable_patchRoutesOnNavigation,
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
  let routerFuture = reactExports.useMemo(() => ({
    v7_relativeSplatPath: router.future.v7_relativeSplatPath
  }), [router.future.v7_relativeSplatPath]);
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
    future: routerFuture
  }, state.initialized || router.future.v7_partialHydration ? /* @__PURE__ */ reactExports.createElement(MemoizedDataRoutes, {
    routes: router.routes,
    future: router.future,
    state
  }) : fallbackElement))))), null);
}
const MemoizedDataRoutes = /* @__PURE__ */ reactExports.memo(DataRoutes);
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
    replace: replace2,
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
    replace: replace2,
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
      let replace2 = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
      navigate(to, {
        replace: replace2,
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
    promise = Promise.allSettled(
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
        }
        link.crossOrigin = "";
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
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
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
const langFile = (await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../intl/de-DE.json": () => __vitePreload(() => import('./de-DE-DYdUaP8z.js'),true?[]:void 0),"../intl/en-US.json": () => __vitePreload(() => import('./en-US-Bgb18xZ7.js'),true?[]:void 0)})), `../intl/${lang}.json`, 3)).default;
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
const VERSION = "9.0.0";

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

var SpanType = /* @__PURE__ */ ((SpanType2) => {
  SpanType2["NORMAL_TEXT"] = "NORMAL_TEXT";
  SpanType2["HYPERLINK"] = "HYPERLINK";
  SpanType2["SLASHLINK"] = "SLASHLINK";
  SpanType2["WIKILINK"] = "WIKILINK";
  return SpanType2;
})(SpanType || {});

var MediaType = /* @__PURE__ */ ((MediaType2) => {
  MediaType2["IMAGE"] = "image";
  MediaType2["PDF"] = "pdf";
  MediaType2["AUDIO"] = "audio";
  MediaType2["VIDEO"] = "video";
  MediaType2["TEXT"] = "text";
  MediaType2["OTHER"] = "other";
  return MediaType2;
})(MediaType || {});

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
const getArbitraryFilePath = (fileInfo) => {
  const slug = fileInfo.slug;
  const lastSlashPos = slug.lastIndexOf("/");
  return lastSlashPos > -1 ? slug.substring(0, lastSlashPos + 1) + fileInfo.filename : fileInfo.filename;
};

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
    const charsUntilDelimiter = stringToAnalyse.slice(0, delimiterIndex);
    return charsUntilDelimiter;
  }
}

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
    } else if ((typeof lastChar !== "string" || isWhiteSpace$1(lastChar)) && char === "/" && currentSpanType !== SpanType.WIKILINK && /^[\p{L}\d_]$/u.test(iterator.peek(1).join("")) && (typeof iterator.charsUntil(" ") === "string" && /^[\p{L}\d_]$/u.test(iterator.charsUntil(" ").slice(-1)) || iterator.charsUntil(" ") === null && /^[\p{L}\d_]$/u.test(iterator.getRest().slice(-1)))) {
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

const parseGraphFileHeaders = (note) => {
  const headerContentDelimiter = "\n\n";
  const headerContentDelimiterPos = note.indexOf(headerContentDelimiter);
  const headerSection = headerContentDelimiterPos > -1 ? note.substring(0, headerContentDelimiterPos) : note;
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
const parseSerializedExistingGraphFile = (serializedNote, slug) => {
  const serializedNoteCleaned = cleanSerializedNote(serializedNote);
  const headers = parseGraphFileHeaders(serializedNoteCleaned);
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
  const headers = parseGraphFileHeaders(serializedNoteCleaned);
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
const getFileSlugsReferencedInNote = (graph, noteSlug) => {
  const blocks = graph.indexes.blocks.get(noteSlug);
  const allInlineSpans = getAllInlineSpans(blocks);
  const allUsedSlugs = getSlugsFromInlineText(allInlineSpans);
  return allUsedSlugs.filter((s) => graph.files.has(s));
};
const getFileInfosForFilesLinkedInNote = (graph, slugOfNote) => {
  return getFileSlugsReferencedInNote(graph, slugOfNote).map((fileSlug) => graph.files.get(fileSlug));
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
    files: getFileInfosForFilesLinkedInNote(graph, existingNote.meta.slug),
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
  const fileInfos = getFileInfosForFilesLinkedInNote(graph, note.meta.slug);
  fileInfos.forEach((fileInfo) => {
    const mediaType = getMediaTypeFromFilename(fileInfo.filename);
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
  return getFileSlugsReferencedInNote(graph, noteSlug).length;
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
    if (graph.files.has(noteSaveRequest.changeSlugTo)) {
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
    let flushPins = false;
    for (let i = 0; i < graph.pinnedNotes.length; i++) {
      if (graph.pinnedNotes[i] === oldSlug) {
        graph.pinnedNotes[i] = newSlug;
        flushPins = true;
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
      flushPins,
      /* @__PURE__ */ new Set([oldSlug]),
      aliasesToUpdate2,
      /* @__PURE__ */ new Set()
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
          flushPins,
          /* @__PURE__ */ new Set([thatNote.meta.slug]),
          /* @__PURE__ */ new Set(),
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
    false,
    /* @__PURE__ */ new Set([existingNote.meta.slug]),
    aliasesToUpdate,
    /* @__PURE__ */ new Set()
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
    if (graph.files.has(noteSaveRequest.changeSlugTo)) {
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
    false,
    /* @__PURE__ */ new Set([newNote.meta.slug]),
    aliasesToUpdate,
    /* @__PURE__ */ new Set()
  );
  const noteToTransmit = await createNoteToTransmit(newNote, graph);
  return noteToTransmit;
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
  return slug.length > 0 && slug.length <= 200 && slug.match(
    // eslint-disable-next-line @stylistic/max-len
    /^[\p{L}\p{M}\d_][\p{L}\p{M}\d\-._]*((?<!\.)\/[\p{L}\p{M}\d\-_][\p{L}\p{M}\d\-._]*)*$/u
  ) !== null && !slug.includes("..") && !slug.endsWith(".");
};
const isValidNoteSlug = (slug) => {
  return isValidSlug(slug) && !slug.includes(".");
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
const getSlugAndNameForNewArbitraryFile = (namespace, originalFilename, existingSlugs) => {
  const extension = getExtensionFromFilename(originalFilename);
  const originalFilenameWithoutExtension = removeExtensionFromFilename(
    originalFilename
  );
  const sluggifiedFileStem = sluggifyFilename(originalFilenameWithoutExtension);
  let n = 1;
  while (true) {
    const showIntegerSuffix = n > 1;
    const stemWithOptionalIntegerSuffix = showIntegerSuffix ? `${sluggifiedFileStem}-${n}` : sluggifiedFileStem;
    const filename = stemWithOptionalIntegerSuffix + (extension ? (stemWithOptionalIntegerSuffix ? "." : "") + extension.trim().toLowerCase() : "");
    const slug = `${namespace}/${filename}`;
    if (!existingSlugs.has(slug)) {
      return { slug, filename };
    }
    n++;
  }
};
const getAllUsedSlugsInGraph = (graph) => {
  return new Set(graph.files.keys()).union(new Set(graph.notes.keys())).union(new Set(graph.aliases.keys()));
};
const getLastSlugSegment = (slug) => {
  const posOfLastSlash = slug.lastIndexOf("/");
  if (posOfLastSlash > -1) {
    return slug.substring(posOfLastSlash + 1);
  } else {
    return slug;
  }
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
  #MAX_OPEN_FILES = 512;
  #directoryHandle;
  #descendantFolderHandles = /* @__PURE__ */ new Map();
  #jobsInProgress = 0;
  #jobPromiseQueue = [];
  /*
    Ensures that there are no more than #MAX_OPEN_FILES files opened in
    parallel, as the OS might have an upper limit (e.g. 1024 on Fedora).
    Every function that opens a file descriptor should call this
    function before starting with the main logic.
    Exceptions are functions that are not closing the file descriptor before the
    function is finished, e.g. when it is returning a Readable that can be
    read after the function is finished. We currently cannot track them.
  */
  async #scheduleJob() {
    if (this.#jobsInProgress < this.#MAX_OPEN_FILES) {
      this.#jobsInProgress++;
    } else {
      const promiseWithResolvers = Promise.withResolvers();
      this.#jobPromiseQueue.push(promiseWithResolvers);
      await promiseWithResolvers.promise;
    }
  }
  /*
    Every function that reads from or writes to a file should call this
    function after it is finished reading, or after an error occured.
  */
  #declareJobDone() {
    if (this.#jobPromiseQueue.length > 0) {
      const jobPromise = this.#jobPromiseQueue.shift();
      jobPromise.resolve();
    } else {
      this.#jobsInProgress--;
    }
  }
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
    await this.#scheduleJob();
    try {
      const fileHandle = await this.#getFileHandle(requestPath, true);
      const writable = await fileHandle.createWritable();
      await writable.write(data);
      await writable.close();
    } finally {
      this.#declareJobDone();
    }
  }
  async renameObject(oldRequestPath, newRequestPath) {
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
    await this.#scheduleJob();
    try {
      const fileHandle = await this.#getFileHandle(requestPath, true);
      const writable = await fileHandle.createWritable();
      await readableStream.pipeTo(writable);
      const size = await this.getObjectSize(requestPath);
      return size;
    } finally {
      this.#declareJobDone();
    }
  }
  async readObjectAsString(requestPath) {
    await this.#scheduleJob();
    try {
      const fileHandle = await this.#getFileHandle(requestPath, false);
      const file = await fileHandle.getFile();
      const string = await file.text();
      return string;
    } finally {
      this.#declareJobDone();
    }
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

const subwaytextWorkerUrl = "/neno/assets/index-CO0F65B1.js";

const createPinsFile = async (pinnedNotes, storageProvider) => {
  await storageProvider.writeObject(".pins.neno", pinnedNotes.join("\n"));
};
const getFilenameFromSlug = (slug) => {
  const posOfLastSlash = slug.lastIndexOf("/");
  return posOfLastSlash > -1 ? slug.substring(posOfLastSlash + 1) : slug;
};
const getSidecarFileContent = (fileInfo) => {
  const headers = /* @__PURE__ */ new Map([
    ["size", fileInfo.size.toString()],
    ["file", getFilenameFromSlug(fileInfo.slug)]
  ]);
  if (fileInfo.createdAt) {
    headers.set(CanonicalNoteHeader.CREATED_AT, fileInfo.createdAt);
  }
  return serializeNoteHeaders(headers);
};
const createSidecarFiles = async (fileInfos, storageProvider) => {
  for (const fileInfo of fileInfos) {
    const sidecarFileContent = getSidecarFileContent(fileInfo);
    await storageProvider.writeObject(
      fileInfo.slug + ".subtext",
      sidecarFileContent
    );
  }
};
const migrateToSpecV01 = async (storageProvider) => {
  const METADATA_FILENAME = ".graph.json";
  try {
    const metadataFile = await storageProvider.readObjectAsString(
      METADATA_FILENAME
    );
    const metadata = JSON.parse(metadataFile);
    if (metadata.version === "5") {
      await createPinsFile(metadata.pinnedNotes, storageProvider);
      await createSidecarFiles(metadata.files, storageProvider);
      await storageProvider.removeObject(METADATA_FILENAME);
    }
  } catch (_e) {
  }
};

class DatabaseIO {
  #storageProvider;
  #loadedGraph = null;
  #graphRetrievalInProgress = null;
  #finishedObtainingGraph = () => {
  };
  static #PINS_FILENAME = ".pins.neno";
  static #GRAPH_FILE_EXTENSION = ".subtext";
  static #ALIAS_HEADER_KEY = "alias-of";
  static #ARBITRARY_FILE_HEADER_KEY = "file";
  static #ARBITRARY_FILE_SIZE_HEADER_KEY = "size";
  // Block parsing is CPU intensive, so we use a web worker pool to parse
  // multiple notes in parallel.
  static #workerPool = [];
  // Returns the filename for a graph file with the given slug.
  static getSubtextGraphFilenameForSlug(slug) {
    if (slug.length === 0) {
      throw new Error("Cannot get filename for empty slug");
    }
    return `${slug}${DatabaseIO.#GRAPH_FILE_EXTENSION}`;
  }
  static getSlugFromGraphFilename(filename) {
    if (!filename.endsWith(DatabaseIO.#GRAPH_FILE_EXTENSION)) {
      throw new Error(
        "Filename does not end with default note filename extension"
      );
    }
    return filename.slice(0, -DatabaseIO.#GRAPH_FILE_EXTENSION.length);
  }
  static getArbitraryGraphFilepath(slug, filename) {
    const lastSlashPos = slug.lastIndexOf("/");
    return lastSlashPos > -1 ? slug.substring(0, lastSlashPos + 1) + filename : filename;
  }
  static parsePinsFile(pinsSerialized) {
    if (pinsSerialized.length === 0) {
      return [];
    }
    return pinsSerialized.split("\n");
  }
  async getGraphFilenamesFromStorageProvider() {
    const objectNames = await this.#storageProvider.getAllObjectNames();
    return objectNames.filter(
      (filename) => {
        return filename.endsWith(DatabaseIO.#GRAPH_FILE_EXTENSION) && isValidSlug(DatabaseIO.getSlugFromGraphFilename(filename));
      }
    );
  }
  async parseGraph(serializedGraphFiles, pinsSerialized) {
    const parsedNotes = /* @__PURE__ */ new Map();
    const aliases = /* @__PURE__ */ new Map();
    const files = /* @__PURE__ */ new Map();
    for (const [slug, serializedGraphFile] of serializedGraphFiles) {
      try {
        const serializedGraphFileCleaned = cleanSerializedNote(
          serializedGraphFile
        );
        const headers = parseGraphFileHeaders(serializedGraphFileCleaned);
        if (headers.has(DatabaseIO.#ALIAS_HEADER_KEY)) {
          const targetSlug = headers.get(DatabaseIO.#ALIAS_HEADER_KEY);
          aliases.set(slug, targetSlug);
        } else if (headers.has(DatabaseIO.#ARBITRARY_FILE_HEADER_KEY) && headers.has(DatabaseIO.#ARBITRARY_FILE_SIZE_HEADER_KEY)) {
          const fileInfo = {
            slug,
            size: parseInt(
              headers.get(DatabaseIO.#ARBITRARY_FILE_SIZE_HEADER_KEY)
            ),
            filename: headers.get(DatabaseIO.#ARBITRARY_FILE_HEADER_KEY),
            createdAt: headers.get("created-at")
          };
          files.set(slug, fileInfo);
        } else {
          const parsedNote = parseSerializedExistingGraphFile(
            serializedGraphFile,
            slug
          );
          parsedNotes.set(slug, parsedNote);
        }
      } catch (_e) {
        continue;
      }
    }
    let pinnedNotes;
    if (typeof pinsSerialized === "string") {
      pinnedNotes = DatabaseIO.parsePinsFile(pinsSerialized);
    } else {
      pinnedNotes = [];
      await this.writePinsFile(pinnedNotes);
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
      files,
      pinnedNotes,
      indexes: {
        blocks: blockIndex,
        outgoingLinks: outgoingLinkIndex,
        backlinks: backlinkIndex
      }
    };
    return parsedGraphObject;
  }
  async readAndParseGraphFromDisk() {
    await migrateToSpecV01(this.#storageProvider);
    let pinsSerialized;
    try {
      pinsSerialized = await this.#storageProvider.readObjectAsString(
        DatabaseIO.#PINS_FILENAME
      );
    } catch (_e) {
      pinsSerialized = void 0;
    }
    const noteFilenames = await this.getGraphFilenamesFromStorageProvider();
    const serializedNotes = new Map(
      await Promise.all(
        noteFilenames.map(
          async (filename) => {
            const slug = DatabaseIO.getSlugFromGraphFilename(filename);
            const serializedNote = await this.#storageProvider.readObjectAsString(
              filename
            );
            return [slug, serializedNote];
          }
        )
      )
    );
    return this.parseGraph(serializedNotes, pinsSerialized);
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
  async writePinsFile(pins) {
    await this.#storageProvider.writeObject(
      DatabaseIO.#PINS_FILENAME,
      pins.join("\n")
    );
  }
  /**
    PUBLIC
  **/
  constructor(config) {
    this.#storageProvider = config.storageProvider;
  }
  async getRawNote(slug) {
    const rawNote = await this.#storageProvider.readObjectAsString(
      DatabaseIO.getSubtextGraphFilenameForSlug(slug)
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
  // Beware that "all" won't delete abandoned graph files. So if a note is to
  // be deleted, its slug must be provided explicitly.
  async flushChanges(graph, flushPins, canonicalNoteSlugsToFlush, aliasesToFlush, arbitraryFilesToFlush) {
    this.#loadedGraph = graph;
    if (canonicalNoteSlugsToFlush instanceof Set) {
      await Promise.all(
        Array.from(canonicalNoteSlugsToFlush).map(async (slug) => {
          const filename = DatabaseIO.getSubtextGraphFilenameForSlug(slug);
          if (!graph.notes.has(slug)) {
            await this.#storageProvider.removeObject(filename);
          } else {
            await this.#storageProvider.writeObject(
              filename,
              serializeNote(graph.notes.get(slug))
            );
          }
        })
      );
    } else {
      for (const [slug, note] of graph.notes) {
        const filename = DatabaseIO.getSubtextGraphFilenameForSlug(slug);
        await this.#storageProvider.writeObject(
          filename,
          serializeNote(note)
        );
      }
    }
    if (aliasesToFlush instanceof Set) {
      await Promise.all(Array.from(aliasesToFlush).map(async (alias) => {
        const filename = DatabaseIO.getSubtextGraphFilenameForSlug(alias);
        if (!graph.aliases.has(alias)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          const canonicalSlug = graph.aliases.get(alias);
          await this.#storageProvider.writeObject(
            filename,
            `${DatabaseIO.#ALIAS_HEADER_KEY}${canonicalSlug}`
          );
        }
      }));
    } else {
      for (const [alias, canonicalSlug] of graph.aliases) {
        const filename = DatabaseIO.getSubtextGraphFilenameForSlug(alias);
        await this.#storageProvider.writeObject(
          filename,
          `${DatabaseIO.#ALIAS_HEADER_KEY}${canonicalSlug}`
        );
      }
    }
    if (arbitraryFilesToFlush instanceof Set) {
      await Promise.all(Array.from(arbitraryFilesToFlush).map(async (slug) => {
        const sgfFilepath = DatabaseIO.getSubtextGraphFilenameForSlug(slug);
        if (!graph.files.has(slug)) {
          await this.#storageProvider.removeObject(sgfFilepath);
        } else {
          const fileInfo = graph.files.get(slug);
          const sizeHeaderValue = fileInfo.size.toString();
          const noteHeaders = /* @__PURE__ */ new Map([
            [DatabaseIO.#ARBITRARY_FILE_HEADER_KEY, fileInfo.filename],
            [DatabaseIO.#ARBITRARY_FILE_SIZE_HEADER_KEY, sizeHeaderValue]
          ]);
          if (fileInfo.createdAt) {
            noteHeaders.set(
              CanonicalNoteHeader.CREATED_AT,
              fileInfo.createdAt?.toString()
            );
          }
          if (fileInfo.updatedAt) {
            noteHeaders.set(
              CanonicalNoteHeader.UPDATED_AT,
              fileInfo.updatedAt?.toString()
            );
          }
          const data = serializeNoteHeaders(noteHeaders);
          await this.#storageProvider.writeObject(
            sgfFilepath,
            data
          );
        }
      }));
    } else {
      for (const [slug, fileInfo] of graph.files) {
        const filename = DatabaseIO.getSubtextGraphFilenameForSlug(slug);
        const size = fileInfo.size;
        const data = serializeNoteHeaders(/* @__PURE__ */ new Map([
          [DatabaseIO.#ARBITRARY_FILE_HEADER_KEY, fileInfo.filename],
          [DatabaseIO.#ARBITRARY_FILE_SIZE_HEADER_KEY, size.toString()]
        ]));
        await this.#storageProvider.writeObject(
          filename,
          data
        );
      }
    }
    if (flushPins) {
      await this.writePinsFile(graph.pinnedNotes);
    }
  }
  async addFile(slug, source) {
    if (!isValidSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    const size = await this.#storageProvider.writeObjectFromReadable(
      slug,
      source
    );
    return size;
  }
  async moveArbitraryGraphFile(oldSlug, newSlug) {
    if (oldSlug !== newSlug) {
      await this.#storageProvider.renameObject(
        oldSlug,
        newSlug
      );
    }
  }
  async deleteArbitraryGraphFile(relativeFilePath) {
    await this.#storageProvider.removeObject(relativeFilePath);
  }
  async getReadableArbitraryGraphFileStream(slug, filename, range) {
    const filepath = DatabaseIO.getArbitraryGraphFilepath(slug, filename);
    const stream = await this.#storageProvider.getReadableStream(
      filepath,
      range
    );
    return stream;
  }
  async getFileSize(slug) {
    if (!isValidSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    const fileSize = await this.#storageProvider.getObjectSize(slug);
    return fileSize;
  }
  async getSizeOfNotes() {
    const noteFilenames = await this.getGraphFilenamesFromStorageProvider();
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
    const noteFilenamesInStorage = await this.getGraphFilenamesFromStorageProvider();
    return noteFilenamesInStorage.length > 0;
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
    })
  );
};
const getGraphUpdateTimestamp = (graph) => {
  return getLatestISOTimestamp(
    ...Array.from(graph.notes.values()).map((note) => note.meta.updatedAt).filter((createdAt) => {
      return typeof createdAt === "string";
    })
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
    const fileSlugs = getFileSlugsReferencedInNote(graph, note.meta.slug);
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
    const files = getFileInfosForFilesLinkedInNote(graph, note.meta.slug);
    const includedMediaTypes = new Set(
      files.map((file) => getMediaTypeFromFilename(file.filename))
    );
    return setsAreEqual(requiredMediaTypes, includedMediaTypes);
  }) : notes.filter((note) => {
    const files = getFileInfosForFilesLinkedInNote(graph, note.meta.slug);
    const includedMediaTypes = new Set(
      files.map((file) => getMediaTypeFromFilename(file.filename))
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
  /*
    Returns the unparsed note as saved in the file system.
  */
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
      numberOfFiles: graph.files.size,
      numberOfPins: graph.pinnedNotes.length,
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
          files: Array.from(graph.files.values()).reduce((a, b) => {
            return a + b.size;
          }, 0)
        }
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
    let flushPins = false;
    graph.pinnedNotes = graph.pinnedNotes.filter((s) => {
      if (s === slug) {
        flushPins = true;
      }
      return s !== slug;
    });
    removeSlugFromIndexes(graph, slug);
    await this.#io.flushChanges(
      graph,
      flushPins,
      /* @__PURE__ */ new Set([slug]),
      aliasesToRemove,
      /* @__PURE__ */ new Set()
    );
  }
  async addFile(readable, namespace, originalFilename) {
    const graph = await this.#io.getGraph();
    const { slug, filename } = getSlugAndNameForNewArbitraryFile(
      namespace,
      originalFilename,
      getAllUsedSlugsInGraph(graph)
    );
    const size = await this.#io.addFile(slug, readable);
    const fileInfo = {
      slug,
      filename,
      size,
      createdAt: getCurrentISODateTime(),
      updatedAt: getCurrentISODateTime()
    };
    graph.files.set(slug, fileInfo);
    await this.#io.flushChanges(
      graph,
      false,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set([slug])
    );
    return fileInfo;
  }
  async updateFile(readable, slug) {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.files.get(slug);
    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    const size = await this.#io.addFile(slug, readable);
    fileInfo.size = size;
    await this.#io.flushChanges(
      graph,
      false,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set([slug])
    );
    return fileInfo;
  }
  async renameFileSlug(oldSlug, newSlug, updateReferences) {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.files.get(oldSlug);
    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    if (!isValidSlug(newSlug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    const extension = getExtensionFromFilename(fileInfo.filename);
    if (typeof extension === "string" && !newSlug.endsWith(`.${extension}`)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (graph.notes.has(newSlug) || graph.aliases.has(newSlug) || graph.files.has(newSlug)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    await this.#io.moveArbitraryGraphFile(
      oldSlug,
      newSlug
    );
    fileInfo.updatedAt = getCurrentISODateTime();
    fileInfo.slug = newSlug;
    fileInfo.filename = getLastSlugSegment(newSlug);
    graph.files.delete(oldSlug);
    graph.files.set(newSlug, fileInfo);
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
      false,
      notesThatNeedUpdate,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set([oldSlug, newSlug])
    );
    return fileInfo;
  }
  async deleteFile(slug) {
    const graph = await this.#io.getGraph();
    if (!graph.files.has(slug)) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    const fileInfo = graph.files.get(slug);
    const agfPath = getArbitraryFilePath(fileInfo);
    await this.#io.deleteArbitraryGraphFile(agfPath);
    graph.files.delete(slug);
    await this.#io.flushChanges(
      graph,
      false,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set([slug])
    );
  }
  async getFiles() {
    const graph = await this.#io.getGraph();
    return Array.from(graph.files.values());
  }
  // get files not used in any note
  async getSlugsOfDanglingFiles() {
    const graph = await this.#io.getGraph();
    const allBlocks = Array.from(graph.indexes.blocks.values()).flat();
    const allInlineSpans = getAllInlineSpans(allBlocks);
    const allUsedSlugs = getSlugsFromInlineText(allInlineSpans);
    const allUsedFileSlugs = allUsedSlugs.filter(isValidSlug);
    return Array.from(graph.files.keys()).filter((slug) => {
      return !allUsedFileSlugs.includes(slug);
    });
  }
  async getReadableArbitraryGraphFileStream(slug, range) {
    const graph = await this.#io.getGraph();
    if (!graph.files.has(slug)) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    const filename = graph.files.get(slug).filename;
    const stream = await this.#io.getReadableArbitraryGraphFileStream(
      slug,
      filename,
      range
    );
    return stream;
  }
  async getFileInfo(slug) {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.files.get(slug);
    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    return fileInfo;
  }
  async getPins() {
    const graph = await this.#io.getGraph();
    const pinnedNotes = (await Promise.allSettled(
      graph.pinnedNotes.map((slug) => {
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
    const oldLength = graph.pinnedNotes.length;
    graph.pinnedNotes = Array.from(
      /* @__PURE__ */ new Set([...graph.pinnedNotes, slug])
    );
    const newLength = graph.pinnedNotes.length;
    const updatePins = oldLength !== newLength;
    await this.#io.flushChanges(
      graph,
      updatePins,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set()
    );
    return this.getPins();
  }
  async movePinPosition(slug, offset) {
    const graph = await this.#io.getGraph();
    const oldPins = graph.pinnedNotes;
    if (!oldPins.includes(slug)) {
      throw new Error(ErrorMessage.PINNED_NOTE_NOT_FOUND);
    }
    const oldIndex = oldPins.indexOf(slug);
    const newIndex = oldIndex + offset;
    const newPins = oldPins.toSpliced(oldIndex, 1).toSpliced(newIndex, 0, slug);
    graph.pinnedNotes = newPins;
    const updatePins = offset !== 0;
    await this.#io.flushChanges(
      graph,
      updatePins,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set()
    );
    return this.getPins();
  }
  async unpin(slugToRemove) {
    const graph = await this.#io.getGraph();
    let updatePins = false;
    graph.pinnedNotes = graph.pinnedNotes.filter((s) => {
      if (s === slugToRemove) {
        updatePins = true;
      }
      return s !== slugToRemove;
    });
    await this.#io.flushChanges(
      graph,
      updatePins,
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set(),
      /* @__PURE__ */ new Set()
    );
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
const createOPFSNotesProvider = async (createDummyNotes) => {
  const opfsDirectory = await navigator.storage.getDirectory();
  const memoryStorageProvider = new FileSystemAccessAPIStorageProvider(
    opfsDirectory
  );
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
    return createOPFSNotesProvider(createDummyNotes ?? false);
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
const getObjectUrlForArbitraryGraphFile = async (fileInfo) => {
  if (!notesProvider) {
    throw new Error("Notes provider not initialized");
  }
  const readable = await notesProvider.getReadableArbitraryGraphFileStream(fileInfo.slug);
  const extension = NotesProvider.getExtensionFromFilename(fileInfo.filename);
  const mimeType = extension && MimeTypes.has(extension) ? MimeTypes.get(extension) : "application/neno-filestream";
  const blob = await streamToBlob(readable, mimeType);
  const url = URL.createObjectURL(blob);
  return url;
};
const saveFile = async (slug) => {
  if (!notesProvider) {
    throw new Error("Notes provider not initialized");
  }
  const fileInfo = await notesProvider.getFileInfo(slug);
  const readable = await notesProvider.getReadableArbitraryGraphFileStream(
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
    suggestedName: fileInfo.filename
  });
  await readable.pipeTo(writable);
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
            } catch (_e) {
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
          } catch (_e) {
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
          className: "browser-storage-providers",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "default-button default-action",
                id: "browser-storage-load-button",
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
                children: "Browser Storage"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "default-button browser-storage",
                id: "browser-storage-dummy-notes-load-button",
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
                children: "Browser storage with dummy notes"
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

const AppHeaderStats = ({
  stats
}) => {
  let percentageOfUnlinkedNotes = NaN;
  if (stats.numberOfAllNotes > 0) {
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stats-container", children: stats ? /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeaderStats, { stats }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BusyIndicator, { alt: l$4("app.loading"), height: 28 }) })
  ] });
};

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const e={},r$2={},s$2={},i$3={},o$3={},l$3={},c$2={},a$3={},u$3={},f$3={},d$2={},h$3={},g$4={},_$2={},p$4={},y$1={},m$5={},x$3={},v$1={},S$1={},T$1={},C$1={},k$1={},b$2={},w$1={},N={},D$1={},O={},I={},A={},M$2={},W={},z={},B={},R={},K={},$$2={},J={},U={},V={},j="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement,H=j&&"documentMode"in document?document.documentMode:null,q=j&&/Mac|iPod|iPhone|iPad/.test(navigator.platform),Q=j&&/^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent),X=!(!j||!("InputEvent"in window)||H)&&"getTargetRanges"in new window.InputEvent("input"),Y=j&&/Version\/[\d.]+.*Safari/.test(navigator.userAgent),Z=j&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,G=j&&/Android/.test(navigator.userAgent),tt=j&&/^(?=.*Chrome).*/i.test(navigator.userAgent),et=j&&G&&tt,nt=j&&/AppleWebKit\/[\d.]+/.test(navigator.userAgent)&&!tt,rt=1,st=3,it=0,ot=1,lt=2,ct=0,at=1,ut=2,ht=4,gt=8,mt=128,xt=112|(3|ht|gt)|mt,vt=1,St=2,Tt=3,Ct=4,kt=5,bt=6,wt=Y||Z||nt?" ":"​",Nt="\n\n",Et=Q?" ":wt,Pt="֑-߿יִ-﷽ﹰ-ﻼ",Ft="A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿",Dt=new RegExp("^[^"+Ft+"]*["+Pt+"]"),Lt=new RegExp("^[^"+Pt+"]*["+Ft+"]"),Ot={bold:1,code:16,highlight:mt,italic:2,strikethrough:ht,subscript:32,superscript:64,underline:gt},It={directionless:1,unmergeable:2},At={center:St,end:bt,justify:Ct,left:vt,right:Tt,start:kt},Mt={[St]:"center",[bt]:"end",[Ct]:"justify",[vt]:"left",[Tt]:"right",[kt]:"start"},Wt={normal:0,segmented:2,token:1},zt={[ct]:"normal",[ut]:"segmented",[at]:"token"};function Bt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Rt=Bt((function(t){const e=new URLSearchParams;e.append("code",t);for(let t=1;t<arguments.length;t++)e.append("v",arguments[t]);throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));function Kt(...t){const e=[];for(const n of t)if(n&&"string"==typeof n)for(const[t]of n.matchAll(/\S+/g))e.push(t);return e}const $t=100;let Jt=!1,Ut=0;function Vt(t){Ut=t.timeStamp;}function jt(t,e,n){return e.__lexicalLineBreak===t||void 0!==t[`__lexicalKey_${n._key}`]}function Ht(t,e,n){const r=yn(n._window);let s=null,i=null;null!==r&&r.anchorNode===t&&(s=r.anchorOffset,i=r.focusOffset);const o=t.nodeValue;null!==o&&Me(e,o,s,i,!1);}function qt(t,e,n){if(ms(t)){const e=t.anchor.getNode();if(e.is(n)&&t.format!==e.getFormat())return !1}return e.nodeType===st&&n.isAttached()}function Qt(t,e,n){Jt=!0;const r=performance.now()-Ut>$t;try{_i(t,(()=>{const s=Is()||function(t){return t.getEditorState().read((()=>{const t=Is();return null!==t?t.clone():null}))}(t),i=new Map,o=t.getRootElement(),l=t._editorState,c=t._blockCursorElement;let a=!1,u="";for(let n=0;n<e.length;n++){const f=e[n],d=f.type,h=f.target;let g=Ce(h,l);if(!(null===g&&h!==o||vi(g)))if("characterData"===d)r&&ls(g)&&qt(s,h,g)&&Ht(h,g,t);else if("childList"===d){a=!0;const e=f.addedNodes;for(let n=0;n<e.length;n++){const r=e[n],s=Te(r),i=r.parentNode;if(null!=i&&r!==c&&null===s&&("BR"!==r.nodeName||!jt(r,i,t))){if(Q){const t=r.innerText||r.nodeValue;t&&(u+=t);}i.removeChild(r);}}const n=f.removedNodes,r=n.length;if(r>0){let e=0;for(let s=0;s<r;s++){const r=n[s];("BR"===r.nodeName&&jt(r,h,t)||c===r)&&(h.appendChild(r),e++);}r!==e&&(h===o&&(g=Ne(l)),i.set(h,g));}}}if(i.size>0)for(const[e,n]of i)if(yi(n)){const r=n.getChildrenKeys();let s=e.firstChild;for(let n=0;n<r.length;n++){const i=r[n],o=t.getElementByKey(i);null!==o&&(null==s?(e.appendChild(o),s=o):s!==o&&e.replaceChild(o,s),s=s.nextSibling);}}else ls(n)&&n.markDirty();const f=n.takeRecords();if(f.length>0){for(let e=0;e<f.length;e++){const n=f[e],r=n.addedNodes,s=n.target;for(let e=0;e<r.length;e++){const n=r[e],i=n.parentNode;null==i||"BR"!==n.nodeName||jt(n,s,t)||i.removeChild(n);}}n.takeRecords();}null!==s&&(a&&(s.dirty=!0,Ee(s)),Q&&Ye(t)&&s.insertRawText(u));}));}finally{Jt=!1;}}function Xt(t){const e=t._observer;if(null!==e){Qt(t,e.takeRecords(),e);}}function Yt(t){!function(t){0===Ut&&on(t).addEventListener("textInput",Vt,!0);}(t),t._observer=new MutationObserver(((e,n)=>{Qt(t,e,n);}));}function Zt(t,e){const n=t.__mode,r=t.__format,s=t.__style,i=e.__mode,o=e.__format,l=e.__style;return !(null!==n&&n!==i||null!==r&&r!==o||null!==s&&s!==l)}function Gt(t,e){const n=t.mergeWithSibling(e),r=ei()._normalizedNodes;return r.add(t.__key),r.add(e.__key),n}function te$1(t){let e,n,r=t;if(""!==r.__text||!r.isSimpleText()||r.isUnmergeable()){for(;null!==(e=r.getPreviousSibling())&&ls(e)&&e.isSimpleText()&&!e.isUnmergeable();){if(""!==e.__text){if(Zt(e,r)){r=Gt(e,r);break}break}e.remove();}for(;null!==(n=r.getNextSibling())&&ls(n)&&n.isSimpleText()&&!n.isUnmergeable();){if(""!==n.__text){if(Zt(r,n)){r=Gt(r,n);break}break}n.remove();}}else r.remove();}function ee(t){return ne(t.anchor),ne(t.focus),t}function ne(t){for(;"element"===t.type;){const e=t.getNode(),n=t.offset;let r,s;if(n===e.getChildrenSize()?(r=e.getChildAtIndex(n-1),s=!0):(r=e.getChildAtIndex(n),s=!1),ls(r)){t.set(r.__key,s?r.getTextContentSize():0,"text");break}if(!yi(r))break;t.set(r.__key,s?r.getChildrenSize():0,"element");}}let re=1;const ie="function"==typeof queueMicrotask?queueMicrotask:t=>{Promise.resolve().then(t);};function oe(t){const e=document.activeElement;if(null===e)return !1;const n=e.nodeName;return vi(Ce(t))&&("INPUT"===n||"TEXTAREA"===n||"true"===e.contentEditable&&null==ue(e))}function le(t,e,n){const r=t.getRootElement();try{return null!==r&&r.contains(e)&&r.contains(n)&&null!==e&&!oe(e)&&ae(e)===t}catch(t){return !1}}function ce(t){return t instanceof zi}function ae(t){let e=t;for(;null!=e;){const t=ue(e);if(ce(t))return t;e=en(e);}return null}function ue(t){return t?t.__lexicalEditor:null}function fe(t){return t.isToken()||t.isSegmented()}function de(t){return t.nodeType===st}function he(t){let e=t;for(;null!=e;){if(de(e))return e;e=e.firstChild;}return null}function ge(t,e,n){const r=Ot[e];if(null!==n&&(t&r)==(n&r))return t;let s=t^r;return "subscript"===e?s&=~Ot.superscript:"superscript"===e&&(s&=~Ot.subscript),s}function pe(t,e){if(null!=e)return void(t.__key=e);Zs(),Gs();const n=ei(),r=ti(),s=""+re++;r._nodeMap.set(s,t),yi(t)?n._dirtyElements.set(s,!0):n._dirtyLeaves.add(s),n._cloneNotNeeded.add(s),n._dirtyType=ot,t.__key=s;}function ye(t){const e=t.getParent();if(null!==e){const n=t.getWritable(),r=e.getWritable(),s=t.getPreviousSibling(),i=t.getNextSibling();if(null===s)if(null!==i){const t=i.getWritable();r.__first=i.__key,t.__prev=null;}else r.__first=null;else {const t=s.getWritable();if(null!==i){const e=i.getWritable();e.__prev=t.__key,t.__next=e.__key;}else t.__next=null;n.__prev=null;}if(null===i)if(null!==s){const t=s.getWritable();r.__last=s.__key,t.__next=null;}else r.__last=null;else {const t=i.getWritable();if(null!==s){const e=s.getWritable();e.__next=t.__key,t.__prev=e.__key;}else t.__prev=null;n.__next=null;}r.__size--,n.__parent=null;}}function me(t){Gs();const e=t.getLatest(),n=e.__parent,r=ti(),s=ei(),i=r._nodeMap,o=s._dirtyElements;null!==n&&function(t,e,n){let r=t;for(;null!==r;){if(n.has(r))return;const t=e.get(r);if(void 0===t)break;n.set(r,!1),r=t.__parent;}}(n,i,o);const l=e.__key;s._dirtyType=ot,yi(t)?o.set(l,!0):s._dirtyLeaves.add(l);}function xe(t){Zs();const e=ei(),n=e._compositionKey;if(t!==n){if(e._compositionKey=t,null!==n){const t=Se(n);null!==t&&t.getWritable();}if(null!==t){const e=Se(t);null!==e&&e.getWritable();}}}function ve(){if(Ys())return null;return ei()._compositionKey}function Se(t,e){const n=(e||ti())._nodeMap.get(t);return void 0===n?null:n}function Te(t,e){const n=t[`__lexicalKey_${ei()._key}`];return void 0!==n?Se(n,e):null}function Ce(t,e){let n=t;for(;null!=n;){const t=Te(n,e);if(null!==t)return t;n=en(n);}return null}function ke(t){const e=t._decorators,n=Object.assign({},e);return t._pendingDecorators=n,n}function be(t){return t.read((()=>we().getTextContent()))}function we(){return Ne(ti())}function Ne(t){return t._nodeMap.get("root")}function Ee(t){Zs();const e=ti();null!==t&&(t.dirty=!0,t.setCachedNodes(null)),e._selection=t;}function Pe(t){const e=ei(),n=function(t,e){let n=t;for(;null!=n;){const t=n[`__lexicalKey_${e._key}`];if(void 0!==t)return t;n=en(n);}return null}(t,e);if(null===n){return t===e.getRootElement()?Se("root"):null}return Se(n)}function Fe(t,e){return e?t.getTextContentSize():0}function De(t){return /[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(t)}function Le(t){const e=[];let n=t;for(;null!==n;)e.push(n),n=n._parentEditor;return e}function Oe(){return Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,5)}function Ie(t){return t.nodeType===st?t.nodeValue:null}function Ae(t,e,n){const r=yn(e._window);if(null===r)return;const s=r.anchorNode;let{anchorOffset:i,focusOffset:o}=r;if(null!==s){let e=Ie(s);const r=Ce(s);if(null!==e&&ls(r)){if(e===wt&&n){const t=n.length;e=n,i=t,o=t;}null!==e&&Me(r,e,i,o,t);}}}function Me(t,e,n,r,s){let i=t;if(i.isAttached()&&(s||!i.isDirty())){const o=i.isComposing();let l=e;(o||s)&&e[e.length-1]===wt&&(l=e.slice(0,-1));const c=i.getTextContent();if(s||l!==c){if(""===l){if(xe(null),Y||Z||nt)i.remove();else {const t=ei();setTimeout((()=>{t.update((()=>{i.isAttached()&&i.remove();}));}),20);}return}const e=i.getParent(),s=As(),c=i.getTextContentSize(),a=ve(),u=i.getKey();if(i.isToken()||null!==a&&u===a&&!o||ms(s)&&(null!==e&&!e.canInsertTextBefore()&&0===s.anchor.offset||s.anchor.key===t.__key&&0===s.anchor.offset&&!i.canInsertTextBefore()&&!o||s.focus.key===t.__key&&s.focus.offset===c&&!i.canInsertTextAfter()&&!o))return void i.markDirty();const f=Is();if(!ms(f)||null===n||null===r)return void i.setTextContent(l);if(f.setTextNodeRange(i,n,i,r),i.isSegmented()){const t=os(i.getTextContent());i.replace(t),i=t;}i.setTextContent(l);}}}function We(t,e){if(e.isSegmented())return !0;if(!t.isCollapsed())return !1;const n=t.anchor.offset,r=e.getParentOrThrow(),s=e.isToken();return 0===n?!e.canInsertTextBefore()||!r.canInsertTextBefore()&&!e.isComposing()||s||function(t){const e=t.getPreviousSibling();return (ls(e)||yi(e)&&e.isInline())&&!e.canInsertTextAfter()}(e):n===e.getTextContentSize()&&(!e.canInsertTextAfter()||!r.canInsertTextAfter()&&!e.isComposing()||s)}function ze(t){return "ArrowLeft"===t}function Be(t){return "ArrowRight"===t}function Re(t,e){return q?t:e}function Ke(t){return "Enter"===t}function $e(t){return "Backspace"===t}function Je(t){return "Delete"===t}function Ue(t,e,n){return "a"===t.toLowerCase()&&Re(e,n)}function Ve(){const t=we();Ee(ee(t.select(0,t.getChildrenSize())));}function je(t,e){void 0===t.__lexicalClassNameCache&&(t.__lexicalClassNameCache={});const n=t.__lexicalClassNameCache,r=n[e];if(void 0!==r)return r;const s=t[e];if("string"==typeof s){const t=Kt(s);return n[e]=t,t}return s}function He(t,e,n,r,s){if(0===n.size)return;const i=r.__type,o=r.__key,l=e.get(i);void 0===l&&Rt(33,i);const c=l.klass;let a=t.get(c);void 0===a&&(a=new Map,t.set(c,a));const u=a.get(o),f="destroyed"===u&&"created"===s;(void 0===u||f)&&a.set(o,f?"updated":s);}function Qe(t,e,n){const r=t.getParent();let s=n,i=t;return null!==r&&(e&&0===n?(s=i.getIndexWithinParent(),i=r):e||n!==i.getChildrenSize()||(s=i.getIndexWithinParent()+1,i=r)),i.getChildAtIndex(e?s-1:s)}function Xe(t,e){const n=t.offset;if("element"===t.type){return Qe(t.getNode(),e,n)}{const r=t.getNode();if(e&&0===n||!e&&n===r.getTextContentSize()){const t=e?r.getPreviousSibling():r.getNextSibling();return null===t?Qe(r.getParentOrThrow(),e,r.getIndexWithinParent()+(e?0:1)):t}}return null}function Ye(t){const e=on(t).event,n=e&&e.inputType;return "insertFromPaste"===n||"insertFromPasteAsQuotation"===n}function Ze(t,e,n){return di(t,e,n)}function Ge(t){return !Ti(t)&&!t.isLastChild()&&!t.isInline()}function tn(t,e){const n=t._keyToDOMMap.get(e);return void 0===n&&Rt(75,e),n}function en(t){const e=t.assignedSlot||t.parentElement;return null!==e&&11===e.nodeType?e.host:e}function sn(t,e){let n=t.getParent();for(;null!==n;){if(n.is(e))return !0;n=n.getParent();}return !1}function on(t){const e=t._window;return null===e&&Rt(78),e}function cn(t){let e=t.getParentOrThrow();for(;null!==e;){if(an(e))return e;e=e.getParentOrThrow();}return e}function an(t){return Ti(t)||yi(t)&&t.isShadowRoot()}function fn(t){const e=ei(),n=t.constructor.getType(),r=e._nodes.get(n);void 0===r&&Rt(200,t.constructor.name,n);const{replace:s,replaceWithKlass:i}=r;if(null!==s){const e=s(t),r=e.constructor;return null!==i?e instanceof i||Rt(201,i.name,i.getType(),r.name,r.getType(),t.constructor.name,n):e instanceof t.constructor&&r!==t.constructor||Rt(202,r.name,r.getType(),t.constructor.name,n),e.__key===t.__key&&Rt(203,t.constructor.name,n,r.name,r.getType()),e}return t}function dn(t,e){!Ti(t.getParent())||yi(e)||vi(e)||Rt(99);}function gn(t){return (vi(t)||yi(t)&&!t.canBeEmpty())&&!t.isInline()}function _n(t,e,n){n.style.removeProperty("caret-color"),e._blockCursorElement=null;const r=t.parentElement;null!==r&&r.removeChild(t);}function pn(t,e,n){let r=t._blockCursorElement;if(ms(n)&&n.isCollapsed()&&"element"===n.anchor.type&&e.contains(document.activeElement)){const s=n.anchor,i=s.getNode(),o=s.offset;let l=!1,c=null;if(o===i.getChildrenSize()){gn(i.getChildAtIndex(o-1))&&(l=!0);}else {const e=i.getChildAtIndex(o);if(gn(e)){const n=e.getPreviousSibling();(null===n||gn(n))&&(l=!0,c=t.getElementByKey(e.__key));}}if(l){const n=t.getElementByKey(i.__key);return null===r&&(t._blockCursorElement=r=function(t){const e=t.theme,n=document.createElement("div");n.contentEditable="false",n.setAttribute("data-lexical-cursor","true");let r=e.blockCursor;if(void 0!==r){if("string"==typeof r){const t=Kt(r);r=e.blockCursor=t;}void 0!==r&&n.classList.add(...r);}return n}(t._config)),e.style.caretColor="transparent",void(null===c?n.appendChild(r):n.insertBefore(r,c))}}null!==r&&_n(r,t,e);}function yn(t){return j?(t||window).getSelection():null}function xn(t){return vn(t)&&"A"===t.tagName}function vn(t){return 1===t.nodeType}function Tn(t){const e=new RegExp(/^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var|#text)$/,"i");return null!==t.nodeName.match(e)}function Cn(t){const e=new RegExp(/^(address|article|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hr|li|main|nav|noscript|ol|p|pre|section|table|td|tfoot|ul|video)$/,"i");return null!==t.nodeName.match(e)}function kn(t){if(vi(t)&&!t.isInline())return !0;if(!yi(t)||an(t))return !1;const e=t.getFirstChild(),n=null===e||Jr(e)||ls(e)||e.isInline();return !t.isInline()&&!1!==t.canBeEmpty()&&n}function bn(t,e){let n=t;for(;null!==n&&null!==n.getParent()&&!e(n);)n=n.getParentOrThrow();return e(n)?n:null}const Nn=new WeakMap,En=new Map;function Pn(t){if(!t._readOnly&&t.isEmpty())return En;t._readOnly||Rt(192);let e=Nn.get(t);if(!e){e=new Map,Nn.set(t,e);for(const[n,r]of t._nodeMap){const t=r.__type;let s=e.get(t);s||(s=new Map,e.set(t,s)),s.set(n,r);}}return e}function Fn(t){const e=t.constructor.clone(t);return e.afterCloneFrom(t),e}function Dn(t,e,n,r,s,i){let o=t.getFirstChild();for(;null!==o;){const t=o.__key;o.__parent===e&&(yi(o)&&Dn(o,t,n,r,s,i),n.has(t)||i.delete(t),s.push(t)),o=o.getNextSibling();}}let Ln,On,In,An,Mn,Wn,zn,Bn,Rn,Kn,$n="",Jn="",Un=null,Vn="",jn="",Hn=!1,qn=!1,Qn=null;function Xn(t,e){const n=zn.get(t);if(null!==e){const n=hr(t);n.parentNode===e&&e.removeChild(n);}if(Bn.has(t)||On._keyToDOMMap.delete(t),yi(n)){const t=cr(n,zn);Yn(t,0,t.length-1,null);}void 0!==n&&He(Kn,In,An,n,"destroyed");}function Yn(t,e,n,r){let s=e;for(;s<=n;++s){const e=t[s];void 0!==e&&Xn(e,r);}}function Zn(t,e){t.setProperty("text-align",e);}const Gn="40px";function tr(t,e){const n=Ln.theme.indent;if("string"==typeof n){const r=t.classList.contains(n);e>0&&!r?t.classList.add(n):e<1&&r&&t.classList.remove(n);}const r=getComputedStyle(t).getPropertyValue("--lexical-indent-base-value")||Gn;t.style.setProperty("padding-inline-start",0===e?"":`calc(${e} * ${r})`);}function er(t,e){const n=t.style;0===e?Zn(n,""):e===vt?Zn(n,"left"):e===St?Zn(n,"center"):e===Tt?Zn(n,"right"):e===Ct?Zn(n,"justify"):e===kt?Zn(n,"start"):e===bt&&Zn(n,"end");}function nr(t,e,n){const r=Bn.get(t);void 0===r&&Rt(60);const s=r.createDOM(Ln,On);if(function(t,e,n){const r=n._keyToDOMMap;e["__lexicalKey_"+n._key]=t,r.set(t,e);}(t,s,On),ls(r)?s.setAttribute("data-lexical-text","true"):vi(r)&&s.setAttribute("data-lexical-decorator","true"),yi(r)){const t=r.__indent,e=r.__size;if(0!==t&&tr(s,t),0!==e){const t=e-1;!function(t,e,n,r){const s=Jn;Jn="",rr(t,n,0,e,r,null),or(n,r),Jn=s;}(cr(r,Bn),t,r,s);}const n=r.__format;0!==n&&er(s,n),r.isInline()||ir(null,r,s),Ge(r)&&($n+=Nt,jn+=Nt);}else {const e=r.getTextContent();if(vi(r)){const e=r.decorate(On,Ln);null!==e&&ur(t,e),s.contentEditable="false";}else ls(r)&&(r.isDirectionless()||(Jn+=e));$n+=e,jn+=e;}if(null!==e)if(null!=n)e.insertBefore(s,n);else {const t=e.__lexicalLineBreak;null!=t?e.insertBefore(s,t):e.appendChild(s);}return He(Kn,In,An,r,"created"),s}function rr(t,e,n,r,s,i){const o=$n;$n="";let l=n;for(;l<=r;++l){nr(t[l],s,i);const e=Bn.get(t[l]);null!==e&&ls(e)&&(null===Un&&(Un=e.getFormat()),""===Vn&&(Vn=e.getStyle()));}Ge(e)&&($n+=Nt),s.__lexicalTextContent=$n,$n=o+$n;}function sr(t,e){const n=e.get(t);return Jr(n)||vi(n)&&n.isInline()}function ir(t,e,n){const r=null!==t&&(0===t.__size||sr(t.__last,zn)),s=0===e.__size||sr(e.__last,Bn);if(r){if(!s){const t=n.__lexicalLineBreak;if(null!=t)try{n.removeChild(t);}catch(e){if("object"==typeof e&&null!=e){const r=`${e.toString()} Parent: ${n.tagName}, child: ${t.tagName}.`;throw new Error(r)}throw e}n.__lexicalLineBreak=null;}}else if(s){const t=document.createElement("br");n.__lexicalLineBreak=t,n.appendChild(t);}}function or(t,e){const n=e.__lexicalDirTextContent,r=e.__lexicalDir;if(n!==Jn||r!==Qn){const n=""===Jn,i=n?Qn:(s=Jn,Dt.test(s)?"rtl":Lt.test(s)?"ltr":null);if(i!==r){const s=e.classList,o=Ln.theme;let l=null!==r?o[r]:void 0,c=null!==i?o[i]:void 0;if(void 0!==l){if("string"==typeof l){const t=Kt(l);l=o[r]=t;}s.remove(...l);}if(null===i||n&&"ltr"===i)e.removeAttribute("dir");else {if(void 0!==c){if("string"==typeof c){const t=Kt(c);c=o[i]=t;}void 0!==c&&s.add(...c);}e.dir=i;}if(!qn){t.getWritable().__dir=i;}}Qn=i,e.__lexicalDirTextContent=Jn,e.__lexicalDir=i;}var s;}function lr(t,e,n){const r=Jn;var s;Jn="",Un=null,Vn="",function(t,e,n){const r=$n,s=t.__size,i=e.__size;if($n="",1===s&&1===i){const r=t.__first,s=e.__first;if(r===s)ar(r,n);else {const t=hr(r),e=nr(s,null,null);try{n.replaceChild(e,t);}catch(i){if("object"==typeof i&&null!=i){const o=`${i.toString()} Parent: ${n.tagName}, new child: {tag: ${e.tagName} key: ${s}}, old child: {tag: ${t.tagName}, key: ${r}}.`;throw new Error(o)}throw i}Xn(r,null);}const i=Bn.get(s);ls(i)&&(null===Un&&(Un=i.getFormat()),""===Vn&&(Vn=i.getStyle()));}else {const r=cr(t,zn),o=cr(e,Bn);if(0===s)0!==i&&rr(o,e,0,i-1,n,null);else if(0===i){if(0!==s){const t=null==n.__lexicalLineBreak;Yn(r,0,s-1,t?null:n),t&&(n.textContent="");}}else !function(t,e,n,r,s,i){const o=r-1,l=s-1;let c,a,u=(h=i,h.firstChild),f=0,d=0;var h;for(;f<=o&&d<=l;){const t=e[f],r=n[d];if(t===r)u=fr(ar(r,i)),f++,d++;else {void 0===c&&(c=new Set(e)),void 0===a&&(a=new Set(n));const s=a.has(t),o=c.has(r);if(s)if(o){const t=tn(On,r);t===u?u=fr(ar(r,i)):(null!=u?i.insertBefore(t,u):i.appendChild(t),ar(r,i)),f++,d++;}else nr(r,i,u),d++;else u=fr(hr(t)),Xn(t,i),f++;}const s=Bn.get(r);null!==s&&ls(s)&&(null===Un&&(Un=s.getFormat()),""===Vn&&(Vn=s.getStyle()));}const g=f>o,_=d>l;if(g&&!_){const e=n[l+1];rr(n,t,d,l,i,void 0===e?null:On.getElementByKey(e));}else _&&!g&&Yn(e,f,o,i);}(e,r,o,s,i,n);}Ge(e)&&($n+=Nt);n.__lexicalTextContent=$n,$n=r+$n;}(t,e,n),or(e,n),Fi(s=e)&&null!=Un&&Un!==s.__textFormat&&!qn&&(s.setTextFormat(Un),s.setTextStyle(Vn)),function(t){Fi(t)&&""!==Vn&&Vn!==t.__textStyle&&!qn&&t.setTextStyle(Vn);}(e),Jn=r;}function cr(t,e){const n=[];let r=t.__first;for(;null!==r;){const t=e.get(r);void 0===t&&Rt(101),n.push(r),r=t.__next;}return n}function ar(t,e){const n=zn.get(t);let r=Bn.get(t);void 0!==n&&void 0!==r||Rt(61);const s=Hn||Wn.has(t)||Mn.has(t),i=tn(On,t);if(n===r&&!s){if(yi(n)){const t=i.__lexicalTextContent;void 0!==t&&($n+=t,jn+=t);const e=i.__lexicalDirTextContent;void 0!==e&&(Jn+=e);}else {const t=n.getTextContent();ls(n)&&!n.isDirectionless()&&(Jn+=t),jn+=t,$n+=t;}return i}if(n!==r&&s&&He(Kn,In,An,r,"updated"),r.updateDOM(n,i,Ln)){const n=nr(t,null,null);return null===e&&Rt(62),e.replaceChild(n,i),Xn(t,null),n}if(yi(n)&&yi(r)){const t=r.__indent;t!==n.__indent&&tr(i,t);const e=r.__format;e!==n.__format&&er(i,e),s&&(lr(n,r,i),Ti(r)||r.isInline()||ir(n,r,i)),Ge(r)&&($n+=Nt,jn+=Nt);}else {const e=r.getTextContent();if(vi(r)){const e=r.decorate(On,Ln);null!==e&&ur(t,e);}else ls(r)&&!r.isDirectionless()&&(Jn+=e);$n+=e,jn+=e;}if(!qn&&Ti(r)&&r.__cachedText!==jn){const t=r.getWritable();t.__cachedText=jn,r=t;}return i}function ur(t,e){let n=On._pendingDecorators;const r=On._decorators;if(null===n){if(r[t]===e)return;n=ke(On);}n[t]=e;}function fr(t){let e=t.nextSibling;return null!==e&&e===On._blockCursorElement&&(e=e.nextSibling),e}function dr(t,e,n,r,s,i){$n="",jn="",Jn="",Hn=r===lt,Qn=null,On=n,Ln=n._config,In=n._nodes,An=On._listeners.mutation,Mn=s,Wn=i,zn=t._nodeMap,Bn=e._nodeMap,qn=e._readOnly,Rn=new Map(n._keyToDOMMap);const o=new Map;return Kn=o,ar("root",null),On=void 0,In=void 0,Mn=void 0,Wn=void 0,zn=void 0,Bn=void 0,Ln=void 0,Rn=void 0,Kn=void 0,o}function hr(t){const e=Rn.get(t);return void 0===e&&Rt(75,t),e}const gr=Object.freeze({}),_r=30,pr=[["keydown",function(t,e){if(yr=t.timeStamp,mr=t.key,e.isComposing())return;const{key:n,shiftKey:r,ctrlKey:o,metaKey:l,altKey:c}=t;if(Ze(e,_$2,t))return;if(null==n)return;if(function(t,e,n,r){return Be(t)&&!e&&!r&&!n}(n,o,c,l))Ze(e,p$4,t);else if(function(t,e,n,r,s){return Be(t)&&!r&&!n&&(e||s)}(n,o,r,c,l))Ze(e,y$1,t);else if(function(t,e,n,r){return ze(t)&&!e&&!r&&!n}(n,o,c,l))Ze(e,m$5,t);else if(function(t,e,n,r,s){return ze(t)&&!r&&!n&&(e||s)}(n,o,r,c,l))Ze(e,x$3,t);else if(function(t,e,n){return function(t){return "ArrowUp"===t}(t)&&!e&&!n}(n,o,l))Ze(e,v$1,t);else if(function(t,e,n){return function(t){return "ArrowDown"===t}(t)&&!e&&!n}(n,o,l))Ze(e,S$1,t);else if(function(t,e){return Ke(t)&&e}(n,r))kr=!0,Ze(e,T$1,t);else if(function(t){return " "===t}(n))Ze(e,C$1,t);else if(function(t,e){return q&&e&&"o"===t.toLowerCase()}(n,o))t.preventDefault(),kr=!0,Ze(e,i$3,!0);else if(function(t,e){return Ke(t)&&!e}(n,r))kr=!1,Ze(e,T$1,t);else if(function(t,e,n,r){return q?!e&&!n&&($e(t)||"h"===t.toLowerCase()&&r):!(r||e||n)&&$e(t)}(n,c,l,o))$e(n)?Ze(e,k$1,t):(t.preventDefault(),Ze(e,s$2,!0));else if(function(t){return "Escape"===t}(n))Ze(e,b$2,t);else if(function(t,e,n,r,s){return q?!(n||r||s)&&(Je(t)||"d"===t.toLowerCase()&&e):!(e||r||s)&&Je(t)}(n,o,r,c,l))Je(n)?Ze(e,w$1,t):(t.preventDefault(),Ze(e,s$2,!1));else if(function(t,e,n){return $e(t)&&(q?e:n)}(n,c,o))t.preventDefault(),Ze(e,u$3,!0);else if(function(t,e,n){return Je(t)&&(q?e:n)}(n,c,o))t.preventDefault(),Ze(e,u$3,!1);else if(function(t,e){return q&&e&&$e(t)}(n,l))t.preventDefault(),Ze(e,f$3,!0);else if(function(t,e){return q&&e&&Je(t)}(n,l))t.preventDefault(),Ze(e,f$3,!1);else if(function(t,e,n,r){return "b"===t.toLowerCase()&&!e&&Re(n,r)}(n,c,l,o))t.preventDefault(),Ze(e,d$2,"bold");else if(function(t,e,n,r){return "u"===t.toLowerCase()&&!e&&Re(n,r)}(n,c,l,o))t.preventDefault(),Ze(e,d$2,"underline");else if(function(t,e,n,r){return "i"===t.toLowerCase()&&!e&&Re(n,r)}(n,c,l,o))t.preventDefault(),Ze(e,d$2,"italic");else if(function(t,e,n,r){return "Tab"===t&&!e&&!n&&!r}(n,c,o,l))Ze(e,N,t);else if(function(t,e,n,r){return "z"===t.toLowerCase()&&!e&&Re(n,r)}(n,r,l,o))t.preventDefault(),Ze(e,h$3,void 0);else if(function(t,e,n,r){return q?"z"===t.toLowerCase()&&n&&e:"y"===t.toLowerCase()&&r||"z"===t.toLowerCase()&&r&&e}(n,r,l,o))t.preventDefault(),Ze(e,g$4,void 0);else {vs(e._editorState._selection)?!function(t,e,n,r){return !e&&"c"===t.toLowerCase()&&(q?n:r)}(n,r,l,o)?!function(t,e,n,r){return !e&&"x"===t.toLowerCase()&&(q?n:r)}(n,r,l,o)?Ue(n,l,o)&&(t.preventDefault(),Ze(e,z,t)):(t.preventDefault(),Ze(e,W,t)):(t.preventDefault(),Ze(e,M$2,t)):!Q&&Ue(n,l,o)&&(t.preventDefault(),Ze(e,z,t));}(function(t,e,n,r){return t||e||n||r})(o,r,c,l)&&Ze(e,V,t);}],["pointerdown",function(t,e){const n=t.target,r=t.pointerType;n instanceof Node&&"touch"!==r&&_i(e,(()=>{vi(Ce(n))||(Cr=!0);}));}],["compositionstart",function(t,e){_i(e,(()=>{const n=Is();if(ms(n)&&!e.isComposing()){const r=n.anchor,s=n.anchor.getNode();xe(r.key),(t.timeStamp<yr+_r||"element"===r.type||!n.isCollapsed()||s.getFormat()!==n.format||ls(s)&&s.getStyle()!==n.style)&&Ze(e,l$3,Et);}}));}],["compositionend",function(t,e){Q?br=!0:_i(e,(()=>{Dr(e,t.data);}));}],["input",function(t,e){t.stopPropagation(),_i(e,(()=>{const n=Is(),r=t.data,s=Fr(t);if(null!=r&&ms(n)&&Nr(n,s,r,t.timeStamp,!1)){br&&(Dr(e,r),br=!1);const s=n.anchor.getNode(),i=yn(e._window);if(null===i)return;const o=n.isBackward(),c=o?n.anchor.offset:n.focus.offset,a=o?n.focus.offset:n.anchor.offset;X&&!n.isCollapsed()&&ls(s)&&null!==i.anchorNode&&s.getTextContent().slice(0,c)+r+s.getTextContent().slice(c+a)===Ie(i.anchorNode)||Ze(e,l$3,r);const u=r.length;Q&&u>1&&"insertCompositionText"===t.inputType&&!e.isComposing()&&(n.anchor.offset-=u),Y||Z||nt||!e.isComposing()||(yr=0,xe(null));}else {Ae(!1,e,null!==r?r:void 0),br&&(Dr(e,r||void 0),br=!1);}Zs(),Xt(ei());})),vr=null;}],["click",function(t,e){_i(e,(()=>{const n=Is(),s=yn(e._window),i=As();if(s)if(ms(n)){const e=n.anchor,r=e.getNode();if("element"===e.type&&0===e.offset&&n.isCollapsed()&&!Ti(r)&&1===we().getChildrenSize()&&r.getTopLevelElementOrThrow().isEmpty()&&null!==i&&n.is(i))s.removeAllRanges(),n.dirty=!0;else if(3===t.detail&&!n.isCollapsed()){r!==n.focus.getNode()&&(yi(r)?r.select(0):r.getParentOrThrow().select(0));}}else if("touch"===t.pointerType){const n=s.anchorNode;if(null!==n){const r=n.nodeType;if(r===rt||r===st){Ee(Os(i,s,e,t));}}}Ze(e,r$2,t);}));}],["cut",gr],["copy",gr],["dragstart",gr],["dragover",gr],["dragend",gr],["paste",gr],["focus",gr],["blur",gr],["drop",gr]];X&&pr.push(["beforeinput",(t,e)=>function(t,e){const n=t.inputType,r=Fr(t);if("deleteCompositionText"===n||Q&&Ye(e))return;if("insertCompositionText"===n)return;_i(e,(()=>{const _=Is();if("deleteContentBackward"===n){if(null===_){const t=As();if(!ms(t))return;Ee(t.clone());}if(ms(_)){const n=_.anchor.key===_.focus.key;if(p=t.timeStamp,"MediaLast"===mr&&p<yr+_r&&e.isComposing()&&n){if(xe(null),yr=0,setTimeout((()=>{_i(e,(()=>{xe(null);}));}),_r),ms(_)){const t=_.anchor.getNode();t.markDirty(),_.format=t.getFormat(),ls(t)||Rt(142),_.style=t.getStyle();}}else {xe(null),t.preventDefault();const r=_.anchor.getNode().getTextContent(),i=0===_.anchor.offset&&_.focus.offset===r.length;et&&n&&!i||Ze(e,s$2,!0);}return}}var p;if(!ms(_))return;const y=t.data;null!==vr&&Ae(!1,e,vr),_.dirty&&null===vr||!_.isCollapsed()||Ti(_.anchor.getNode())||null===r||_.applyDOMRange(r),vr=null;const m=_.anchor,x=_.focus,v=m.getNode(),S=x.getNode();if("insertText"!==n&&"insertTranspose"!==n)switch(t.preventDefault(),n){case"insertFromYank":case"insertFromDrop":case"insertReplacementText":Ze(e,l$3,t);break;case"insertFromComposition":xe(null),Ze(e,l$3,t);break;case"insertLineBreak":xe(null),Ze(e,i$3,!1);break;case"insertParagraph":xe(null),kr&&!Z?(kr=!1,Ze(e,i$3,!1)):Ze(e,o$3,void 0);break;case"insertFromPaste":case"insertFromPasteAsQuotation":Ze(e,c$2,t);break;case"deleteByComposition":(function(t,e){return t!==e||yi(t)||yi(e)||!t.isToken()||!e.isToken()})(v,S)&&Ze(e,a$3,t);break;case"deleteByDrag":case"deleteByCut":Ze(e,a$3,t);break;case"deleteContent":Ze(e,s$2,!1);break;case"deleteWordBackward":Ze(e,u$3,!0);break;case"deleteWordForward":Ze(e,u$3,!1);break;case"deleteHardLineBackward":case"deleteSoftLineBackward":Ze(e,f$3,!0);break;case"deleteContentForward":case"deleteHardLineForward":case"deleteSoftLineForward":Ze(e,f$3,!1);break;case"formatStrikeThrough":Ze(e,d$2,"strikethrough");break;case"formatBold":Ze(e,d$2,"bold");break;case"formatItalic":Ze(e,d$2,"italic");break;case"formatUnderline":Ze(e,d$2,"underline");break;case"historyUndo":Ze(e,h$3,void 0);break;case"historyRedo":Ze(e,g$4,void 0);}else {if("\n"===y)t.preventDefault(),Ze(e,i$3,!1);else if(y===Nt)t.preventDefault(),Ze(e,o$3,void 0);else if(null==y&&t.dataTransfer){const e=t.dataTransfer.getData("text/plain");t.preventDefault(),_.insertRawText(e);}else null!=y&&Nr(_,r,y,t.timeStamp,!0)?(t.preventDefault(),Ze(e,l$3,y)):vr=y;xr=t.timeStamp;}}));}(t,e)]);let yr=0,mr=null,xr=0,vr=null;const Sr=new WeakMap;let Tr=!1,Cr=!1,kr=!1,br=!1,wr=[0,"",0,"root",0];function Nr(t,e,n,r,s){const i=t.anchor,o=t.focus,l=i.getNode(),c=ei(),a=yn(c._window),u=null!==a?a.anchorNode:null,f=i.key,d=c.getElementByKey(f),h=n.length;return f!==o.key||!ls(l)||(!s&&(!X||xr<r+50)||l.isDirty()&&h<2||De(n))&&i.offset!==o.offset&&!l.isComposing()||fe(l)||l.isDirty()&&h>1||(s||!X)&&null!==d&&!l.isComposing()&&u!==he(d)||null!==a&&null!==e&&(!e.collapsed||e.startContainer!==a.anchorNode||e.startOffset!==a.anchorOffset)||l.getFormat()!==t.format||l.getStyle()!==t.style||We(t,l)}function Er(t,e){return null!==t&&null!==t.nodeValue&&t.nodeType===st&&0!==e&&e!==t.nodeValue.length}function Pr(t,n,r){const{anchorNode:s,anchorOffset:i,focusNode:o,focusOffset:l}=t;Tr&&(Tr=!1,Er(s,i)&&Er(o,l))||_i(n,(()=>{if(!r)return void Ee(null);if(!le(n,s,o))return;const c=Is();if(ms(c)){const e=c.anchor,r=e.getNode();if(c.isCollapsed()){"Range"===t.type&&t.anchorNode===t.focusNode&&(c.dirty=!0);const s=on(n).event,i=s?s.timeStamp:performance.now(),[o,l,a,u,f]=wr,d=we(),h=!1===n.isComposing()&&""===d.getTextContent();if(i<f+200&&e.offset===a&&e.key===u)c.format=o,c.style=l;else if("text"===e.type)ls(r)||Rt(141),c.format=r.getFormat(),c.style=r.getStyle();else if("element"===e.type&&!h){const t=e.getNode();c.style="",t instanceof Ni&&0===t.getChildrenSize()?(c.format=t.getTextFormat(),c.style=t.getTextStyle()):c.format=0;}}else {const t=e.key,n=c.focus.key,r=c.getNodes(),s=r.length,o=c.isBackward(),a=o?l:i,u=o?i:l,f=o?n:t,d=o?t:n;let h=xt,g=!1;for(let t=0;t<s;t++){const e=r[t],n=e.getTextContentSize();if(ls(e)&&0!==n&&!(0===t&&e.__key===f&&a===n||t===s-1&&e.__key===d&&0===u)&&(g=!0,h&=e.getFormat(),0===h))break}c.format=g?h:0;}}Ze(n,e,void 0);}));}function Fr(t){if(!t.getTargetRanges)return null;const e=t.getTargetRanges();return 0===e.length?null:e[0]}function Dr(t,e){const n=t._compositionKey;if(xe(null),null!==n&&null!=e){if(""===e){const e=Se(n),r=he(t.getElementByKey(n));return void(null!==r&&null!==r.nodeValue&&ls(e)&&Me(e,r.nodeValue,null,null,!0))}if("\n"===e[e.length-1]){const e=Is();if(ms(e)){const n=e.focus;return e.anchor.set(n.key,n.offset,n.type),void Ze(t,T$1,null)}}}Ae(!0,t,e);}function Lr(t){let e=t.__lexicalEventHandles;return void 0===e&&(e=[],t.__lexicalEventHandles=e),e}const Or=new Map;function Ir(t){const e=t.target,n=yn(null==e?null:9===e.nodeType?e.defaultView:e.ownerDocument.defaultView);if(null===n)return;const r=ae(n.anchorNode);if(null===r)return;Cr&&(Cr=!1,_i(r,(()=>{const e=As(),s=n.anchorNode;if(null===s)return;const i=s.nodeType;if(i!==rt&&i!==st)return;Ee(Os(e,n,r,t));})));const s=Le(r),i=s[s.length-1],o=i._key,l=Or.get(o),c=l||i;c!==r&&Pr(n,c,!1),Pr(n,r,!0),r!==i?Or.set(o,r):l&&Or.delete(o);}function Ar(t){t._lexicalHandled=!0;}function Mr(t){return !0===t._lexicalHandled}function Wr(t){const e=t.ownerDocument,n=Sr.get(e);void 0===n&&Rt(162);const r=n-1;r>=0||Rt(164),Sr.set(e,r),0===r&&e.removeEventListener("selectionchange",Ir);const s=ue(t);ce(s)?(!function(t){if(null!==t._parentEditor){const e=Le(t),n=e[e.length-1]._key;Or.get(n)===t&&Or.delete(n);}else Or.delete(t._key);}(s),t.__lexicalEditor=null):s&&Rt(198);const i=Lr(t);for(let t=0;t<i.length;t++)i[t]();t.__lexicalEventHandles=[];}function zr(t,e,n){Zs();const r=t.__key,s=t.getParent();if(null===s)return;const i=function(t){const e=Is();if(!ms(e)||!yi(t))return e;const{anchor:n,focus:r}=e,s=n.getNode(),i=r.getNode();return sn(s,t)&&n.set(t.__key,0,"element"),sn(i,t)&&r.set(t.__key,0,"element"),e}(t);let o=!1;if(ms(i)&&e){const e=i.anchor,n=i.focus;e.key===r&&(zs(e,t,s,t.getPreviousSibling(),t.getNextSibling()),o=!0),n.key===r&&(zs(n,t,s,t.getPreviousSibling(),t.getNextSibling()),o=!0);}else vs(i)&&e&&t.isSelected()&&t.selectPrevious();if(ms(i)&&e&&!o){const e=t.getIndexWithinParent();ye(t),Ms(i,s,e,-1);}else ye(t);n||an(s)||s.canBeEmpty()||!s.isEmpty()||zr(s,e),e&&Ti(s)&&s.isEmpty()&&s.selectEnd();}class Br{static getType(){Rt(64,this.name);}static clone(t){Rt(65,this.name);}afterCloneFrom(t){this.__parent=t.__parent,this.__next=t.__next,this.__prev=t.__prev;}constructor(t){this.__type=this.constructor.getType(),this.__parent=null,this.__prev=null,this.__next=null,pe(this,t);}getType(){return this.__type}isInline(){Rt(137,this.constructor.name);}isAttached(){let t=this.__key;for(;null!==t;){if("root"===t)return !0;const e=Se(t);if(null===e)break;t=e.__parent;}return !1}isSelected(t){const e=t||Is();if(null==e)return !1;const n=e.getNodes().some((t=>t.__key===this.__key));if(ls(this))return n;if(ms(e)&&"element"===e.anchor.type&&"element"===e.focus.type){if(e.isCollapsed())return !1;const t=this.getParent();if(vi(this)&&this.isInline()&&t){const n=e.isBackward()?e.focus:e.anchor,r=n.getNode();if(n.offset===r.getChildrenSize()&&r.is(t)&&r.getLastChildOrThrow().is(this))return !1}}return n}getKey(){return this.__key}getIndexWithinParent(){const t=this.getParent();if(null===t)return -1;let e=t.getFirstChild(),n=0;for(;null!==e;){if(this.is(e))return n;n++,e=e.getNextSibling();}return -1}getParent(){const t=this.getLatest().__parent;return null===t?null:Se(t)}getParentOrThrow(){const t=this.getParent();return null===t&&Rt(66,this.__key),t}getTopLevelElement(){let t=this;for(;null!==t;){const e=t.getParent();if(an(e))return yi(t)||t===this&&vi(t)||Rt(194),t;t=e;}return null}getTopLevelElementOrThrow(){const t=this.getTopLevelElement();return null===t&&Rt(67,this.__key),t}getParents(){const t=[];let e=this.getParent();for(;null!==e;)t.push(e),e=e.getParent();return t}getParentKeys(){const t=[];let e=this.getParent();for(;null!==e;)t.push(e.__key),e=e.getParent();return t}getPreviousSibling(){const t=this.getLatest().__prev;return null===t?null:Se(t)}getPreviousSiblings(){const t=[],e=this.getParent();if(null===e)return t;let n=e.getFirstChild();for(;null!==n&&!n.is(this);)t.push(n),n=n.getNextSibling();return t}getNextSibling(){const t=this.getLatest().__next;return null===t?null:Se(t)}getNextSiblings(){const t=[];let e=this.getNextSibling();for(;null!==e;)t.push(e),e=e.getNextSibling();return t}getCommonAncestor(t){const e=this.getParents(),n=t.getParents();yi(this)&&e.unshift(this),yi(t)&&n.unshift(t);const r=e.length,s=n.length;if(0===r||0===s||e[r-1]!==n[s-1])return null;const i=new Set(n);for(let t=0;t<r;t++){const n=e[t];if(i.has(n))return n}return null}is(t){return null!=t&&this.__key===t.__key}isBefore(t){if(this===t)return !1;if(t.isParentOf(this))return !0;if(this.isParentOf(t))return !1;const e=this.getCommonAncestor(t);let n=0,r=0,s=this;for(;;){const t=s.getParentOrThrow();if(t===e){n=s.getIndexWithinParent();break}s=t;}for(s=t;;){const t=s.getParentOrThrow();if(t===e){r=s.getIndexWithinParent();break}s=t;}return n<r}isParentOf(t){const e=this.__key;if(e===t.__key)return !1;let n=t;for(;null!==n;){if(n.__key===e)return !0;n=n.getParent();}return !1}getNodesBetween(t){const e=this.isBefore(t),n=[],r=new Set;let s=this;for(;null!==s;){const i=s.__key;if(r.has(i)||(r.add(i),n.push(s)),s===t)break;const o=yi(s)?e?s.getFirstChild():s.getLastChild():null;if(null!==o){s=o;continue}const l=e?s.getNextSibling():s.getPreviousSibling();if(null!==l){s=l;continue}const c=s.getParentOrThrow();if(r.has(c.__key)||n.push(c),c===t)break;let a=null,u=c;do{if(null===u&&Rt(68),a=e?u.getNextSibling():u.getPreviousSibling(),u=u.getParent(),null===u)break;null!==a||r.has(u.__key)||n.push(u);}while(null===a);s=a;}return e||n.reverse(),n}isDirty(){const t=ei()._dirtyLeaves;return null!==t&&t.has(this.__key)}getLatest(){const t=Se(this.__key);return null===t&&Rt(113),t}getWritable(){Zs();const t=ti(),e=ei(),n=t._nodeMap,r=this.__key,s=this.getLatest(),i=e._cloneNotNeeded,o=Is();if(null!==o&&o.setCachedNodes(null),i.has(r))return me(s),s;const l=Fn(s);return i.add(r),me(l),n.set(r,l),l}getTextContent(){return ""}getTextContentSize(){return this.getTextContent().length}createDOM(t,e){Rt(70);}updateDOM(t,e,n){Rt(71);}exportDOM(t){return {element:this.createDOM(t._config,t)}}exportJSON(){Rt(72);}static importJSON(t){Rt(18,this.name);}static transform(){return null}remove(t){zr(this,!0,t);}replace(t,e){Zs();let n=Is();null!==n&&(n=n.clone()),dn(this,t);const r=this.getLatest(),s=this.__key,i=t.__key,o=t.getWritable(),l=this.getParentOrThrow().getWritable(),c=l.__size;ye(o);const a=r.getPreviousSibling(),u=r.getNextSibling(),f=r.__prev,d=r.__next,h=r.__parent;if(zr(r,!1,!0),null===a)l.__first=i;else {a.getWritable().__next=i;}if(o.__prev=f,null===u)l.__last=i;else {u.getWritable().__prev=i;}if(o.__next=d,o.__parent=h,l.__size=c,e&&(yi(this)&&yi(o)||Rt(139),this.getChildren().forEach((t=>{o.append(t);}))),ms(n)){Ee(n);const t=n.anchor,e=n.focus;t.key===s&&_s(t,o),e.key===s&&_s(e,o);}return ve()===s&&xe(i),o}insertAfter(t,e=!0){Zs(),dn(this,t);const n=this.getWritable(),r=t.getWritable(),s=r.getParent(),i=Is();let o=!1,l=!1;if(null!==s){const e=t.getIndexWithinParent();if(ye(r),ms(i)){const t=s.__key,n=i.anchor,r=i.focus;o="element"===n.type&&n.key===t&&n.offset===e+1,l="element"===r.type&&r.key===t&&r.offset===e+1;}}const c=this.getNextSibling(),a=this.getParentOrThrow().getWritable(),u=r.__key,f=n.__next;if(null===c)a.__last=u;else {c.getWritable().__prev=u;}if(a.__size++,n.__next=u,r.__next=f,r.__prev=n.__key,r.__parent=n.__parent,e&&ms(i)){const t=this.getIndexWithinParent();Ms(i,a,t+1);const e=a.__key;o&&i.anchor.set(e,t+2,"element"),l&&i.focus.set(e,t+2,"element");}return t}insertBefore(t,e=!0){Zs(),dn(this,t);const n=this.getWritable(),r=t.getWritable(),s=r.__key;ye(r);const i=this.getPreviousSibling(),o=this.getParentOrThrow().getWritable(),l=n.__prev,c=this.getIndexWithinParent();if(null===i)o.__first=s;else {i.getWritable().__next=s;}o.__size++,n.__prev=s,r.__prev=l,r.__next=n.__key,r.__parent=n.__parent;const a=Is();if(e&&ms(a)){Ms(a,this.getParentOrThrow(),c);}return t}isParentRequired(){return !1}createParentElementNode(){return Pi()}selectStart(){return this.selectPrevious()}selectEnd(){return this.selectNext(0,0)}selectPrevious(t,e){Zs();const n=this.getPreviousSibling(),r=this.getParentOrThrow();if(null===n)return r.select(0,0);if(yi(n))return n.select();if(!ls(n)){const t=n.getIndexWithinParent()+1;return r.select(t,t)}return n.select(t,e)}selectNext(t,e){Zs();const n=this.getNextSibling(),r=this.getParentOrThrow();if(null===n)return r.select();if(yi(n))return n.select(0,0);if(!ls(n)){const t=n.getIndexWithinParent();return r.select(t,t)}return n.select(t,e)}markDirty(){this.getWritable();}}class Rr extends Br{static getType(){return "linebreak"}static clone(t){return new Rr(t.__key)}constructor(t){super(t);}getTextContent(){return "\n"}createDOM(){return document.createElement("br")}updateDOM(){return !1}static importDOM(){return {br:t=>function(t){const e=t.parentElement;if(null!==e&&Cn(e)){const n=e.firstChild;if(n===t||n.nextSibling===t&&Ur(n)){const n=e.lastChild;if(n===t||n.previousSibling===t&&Ur(n))return !0}}return !1}(t)||function(t){const e=t.parentElement;if(null!==e&&Cn(e)){const n=e.firstChild;if(n===t||n.nextSibling===t&&Ur(n))return !1;const r=e.lastChild;if(r===t||r.previousSibling===t&&Ur(r))return !0}return !1}(t)?null:{conversion:Kr,priority:0}}}static importJSON(t){return $r()}exportJSON(){return {type:"linebreak",version:1}}}function Kr(t){return {node:$r()}}function $r(){return fn(new Rr)}function Jr(t){return t instanceof Rr}function Ur(t){return t.nodeType===st&&/^( |\t|\r?\n)+$/.test(t.textContent||"")}function Vr(t,e){return 16&e?"code":e&mt?"mark":32&e?"sub":64&e?"sup":null}function jr(t,e){return 1&e?"strong":2&e?"em":"span"}function Hr(t,e,n,r,s){const i=r.classList;let o=je(s,"base");void 0!==o&&i.add(...o),o=je(s,"underlineStrikethrough");let l=!1;const c=e&gt&&e&ht;void 0!==o&&(n&gt&&n&ht?(l=!0,c||i.add(...o)):c&&i.remove(...o));for(const t in Ot){const r=Ot[t];if(o=je(s,t),void 0!==o)if(n&r){if(l&&("underline"===t||"strikethrough"===t)){e&r&&i.remove(...o);continue}e&r&&(!c||"underline"!==t)&&"strikethrough"!==t||i.add(...o);}else e&r&&i.remove(...o);}}function qr(t,e,n){const r=e.firstChild,s=n.isComposing(),i=t+(s?wt:"");if(null==r)e.textContent=i;else {const t=r.nodeValue;if(t!==i)if(s||Q){const[e,n,s]=function(t,e){const n=t.length,r=e.length;let s=0,i=0;for(;s<n&&s<r&&t[s]===e[s];)s++;for(;i+s<n&&i+s<r&&t[n-i-1]===e[r-i-1];)i++;return [s,n-s-i,e.slice(s,r-i)]}(t,i);0!==n&&r.deleteData(e,n),r.insertData(e,s);}else r.nodeValue=i;}}function Qr(t,e,n,r,s,i){qr(s,t,e);const o=i.theme.text;void 0!==o&&Hr(0,0,r,t,o);}function Xr(t,e){const n=document.createElement(e);return n.appendChild(t),n}class Yr extends Br{static getType(){return "text"}static clone(t){return new Yr(t.__text,t.__key)}afterCloneFrom(t){super.afterCloneFrom(t),this.__format=t.__format,this.__style=t.__style,this.__mode=t.__mode,this.__detail=t.__detail;}constructor(t,e){super(e),this.__text=t,this.__format=0,this.__style="",this.__mode=0,this.__detail=0;}getFormat(){return this.getLatest().__format}getDetail(){return this.getLatest().__detail}getMode(){const t=this.getLatest();return zt[t.__mode]}getStyle(){return this.getLatest().__style}isToken(){return 1===this.getLatest().__mode}isComposing(){return this.__key===ve()}isSegmented(){return 2===this.getLatest().__mode}isDirectionless(){return !!(1&this.getLatest().__detail)}isUnmergeable(){return !!(2&this.getLatest().__detail)}hasFormat(t){const e=Ot[t];return !!(this.getFormat()&e)}isSimpleText(){return "text"===this.__type&&0===this.__mode}getTextContent(){return this.getLatest().__text}getFormatFlags(t,e){return ge(this.getLatest().__format,t,e)}canHaveFormat(){return !0}createDOM(t,e){const n=this.__format,r=Vr(0,n),s=jr(0,n),i=null===r?s:r,o=document.createElement(i);let l=o;this.hasFormat("code")&&o.setAttribute("spellcheck","false"),null!==r&&(l=document.createElement(s),o.appendChild(l));Qr(l,this,0,n,this.__text,t);const c=this.__style;return ""!==c&&(o.style.cssText=c),o}updateDOM(t,e,n){const r=this.__text,s=t.__format,i=this.__format,o=Vr(0,s),l=Vr(0,i),c=jr(0,s),a=jr(0,i);if((null===o?c:o)!==(null===l?a:l))return !0;if(o===l&&c!==a){const t=e.firstChild;null==t&&Rt(48);const s=document.createElement(a);return Qr(s,this,0,i,r,n),e.replaceChild(s,t),!1}let u=e;null!==l&&null!==o&&(u=e.firstChild,null==u&&Rt(49)),qr(r,u,this);const f=n.theme.text;void 0!==f&&s!==i&&Hr(0,s,i,u,f);const d=t.__style,h=this.__style;return d!==h&&(e.style.cssText=h),!1}static importDOM(){return {"#text":()=>({conversion:ns,priority:0}),b:()=>({conversion:Gr,priority:0}),code:()=>({conversion:is,priority:0}),em:()=>({conversion:is,priority:0}),i:()=>({conversion:is,priority:0}),s:()=>({conversion:is,priority:0}),span:()=>({conversion:Zr,priority:0}),strong:()=>({conversion:is,priority:0}),sub:()=>({conversion:is,priority:0}),sup:()=>({conversion:is,priority:0}),u:()=>({conversion:is,priority:0})}}static importJSON(t){const e=os(t.text);return e.setFormat(t.format),e.setDetail(t.detail),e.setMode(t.mode),e.setStyle(t.style),e}exportDOM(t){let{element:e}=super.exportDOM(t);return null!==e&&vn(e)||Rt(132),e.style.whiteSpace="pre-wrap",this.hasFormat("bold")&&(e=Xr(e,"b")),this.hasFormat("italic")&&(e=Xr(e,"i")),this.hasFormat("strikethrough")&&(e=Xr(e,"s")),this.hasFormat("underline")&&(e=Xr(e,"u")),{element:e}}exportJSON(){return {detail:this.getDetail(),format:this.getFormat(),mode:this.getMode(),style:this.getStyle(),text:this.getTextContent(),type:"text",version:1}}selectionTransform(t,e){}setFormat(t){const e=this.getWritable();return e.__format="string"==typeof t?Ot[t]:t,e}setDetail(t){const e=this.getWritable();return e.__detail="string"==typeof t?It[t]:t,e}setStyle(t){const e=this.getWritable();return e.__style=t,e}toggleFormat(t){const e=ge(this.getFormat(),t,null);return this.setFormat(e)}toggleDirectionless(){const t=this.getWritable();return t.__detail^=1,t}toggleUnmergeable(){const t=this.getWritable();return t.__detail^=2,t}setMode(t){const e=Wt[t];if(this.__mode===e)return this;const n=this.getWritable();return n.__mode=e,n}setTextContent(t){if(this.__text===t)return this;const e=this.getWritable();return e.__text=t,e}select(t,e){Zs();let n=t,r=e;const s=Is(),i=this.getTextContent(),o=this.__key;if("string"==typeof i){const t=i.length;void 0===n&&(n=t),void 0===r&&(r=t);}else n=0,r=0;if(!ms(s))return Ps(o,n,o,r,"text","text");{const t=ve();t!==s.anchor.key&&t!==s.focus.key||xe(o),s.setTextNodeRange(this,n,this,r);}return s}selectStart(){return this.select(0,0)}selectEnd(){const t=this.getTextContentSize();return this.select(t,t)}spliceText(t,e,n,r){const s=this.getWritable(),i=s.__text,o=n.length;let l=t;l<0&&(l=o+l,l<0&&(l=0));const c=Is();if(r&&ms(c)){const e=t+o;c.setTextNodeRange(s,e,s,e);}const a=i.slice(0,l)+n+i.slice(l+e);return s.__text=a,s}canInsertTextBefore(){return !0}canInsertTextAfter(){return !0}splitText(...t){Zs();const e=this.getLatest(),n=e.getTextContent(),r=e.__key,s=ve(),i=new Set(t),o=[],l=n.length;let c="";for(let t=0;t<l;t++)""!==c&&i.has(t)&&(o.push(c),c=""),c+=n[t];""!==c&&o.push(c);const a=o.length;if(0===a)return [];if(o[0]===n)return [e];const u=o[0],f=e.getParent();let d;const h=e.getFormat(),g=e.getStyle(),_=e.__detail;let p=!1;e.isSegmented()?(d=os(u),d.__format=h,d.__style=g,d.__detail=_,p=!0):(d=e.getWritable(),d.__text=u);const y=Is(),m=[d];let x=u.length;for(let t=1;t<a;t++){const e=o[t],n=e.length,i=os(e).getWritable();i.__format=h,i.__style=g,i.__detail=_;const l=i.__key,c=x+n;if(ms(y)){const t=y.anchor,e=y.focus;t.key===r&&"text"===t.type&&t.offset>x&&t.offset<=c&&(t.key=l,t.offset-=x,y.dirty=!0),e.key===r&&"text"===e.type&&e.offset>x&&e.offset<=c&&(e.key=l,e.offset-=x,y.dirty=!0);}s===r&&xe(l),x=c,m.push(i);}if(null!==f){!function(t){const e=t.getPreviousSibling(),n=t.getNextSibling();null!==e&&me(e),null!==n&&me(n);}(this);const t=f.getWritable(),e=this.getIndexWithinParent();p?(t.splice(e,0,m),this.remove()):t.splice(e,1,m),ms(y)&&Ms(y,f,e,a-1);}return m}mergeWithSibling(t){const e=t===this.getPreviousSibling();e||t===this.getNextSibling()||Rt(50);const n=this.__key,r=t.__key,s=this.__text,i=s.length;ve()===r&&xe(n);const o=Is();if(ms(o)){const s=o.anchor,l=o.focus;null!==s&&s.key===r&&(Bs(s,e,n,t,i),o.dirty=!0),null!==l&&l.key===r&&(Bs(l,e,n,t,i),o.dirty=!0);}const l=t.__text,c=e?l+s:s+l;this.setTextContent(c);const a=this.getWritable();return t.remove(),a}isTextEntity(){return !1}}function Zr(t){return {forChild:cs(t.style),node:null}}function Gr(t){const e=t,n="normal"===e.style.fontWeight;return {forChild:cs(e.style,n?void 0:"bold"),node:null}}const ts=new WeakMap;function es(t){return "PRE"===t.nodeName||t.nodeType===rt&&void 0!==t.style&&void 0!==t.style.whiteSpace&&t.style.whiteSpace.startsWith("pre")}function ns(t){const e=t;null===t.parentElement&&Rt(129);let n=e.textContent||"";if(null!==function(t){let e,n=t.parentNode;const r=[t];for(;null!==n&&void 0===(e=ts.get(n))&&!es(n);)r.push(n),n=n.parentNode;const s=void 0===e?n:e;for(let t=0;t<r.length;t++)ts.set(r[t],s);return s}(e)){const t=n.split(/(\r?\n|\t)/),e=[],r=t.length;for(let n=0;n<r;n++){const r=t[n];"\n"===r||"\r\n"===r?e.push($r()):"\t"===r?e.push(us()):""!==r&&e.push(os(r));}return {node:e}}if(n=n.replace(/\r/g,"").replace(/[ \t\n]+/g," "),""===n)return {node:null};if(" "===n[0]){let t=e,r=!0;for(;null!==t&&null!==(t=rs(t,!1));){const e=t.textContent||"";if(e.length>0){/[ \t\n]$/.test(e)&&(n=n.slice(1)),r=!1;break}}r&&(n=n.slice(1));}if(" "===n[n.length-1]){let t=e,r=!0;for(;null!==t&&null!==(t=rs(t,!0));){if((t.textContent||"").replace(/^( |\t|\r?\n)+/,"").length>0){r=!1;break}}r&&(n=n.slice(0,n.length-1));}return ""===n?{node:null}:{node:os(n)}}function rs(t,e){let n=t;for(;;){let t;for(;null===(t=e?n.nextSibling:n.previousSibling);){const t=n.parentElement;if(null===t)return null;n=t;}if(n=t,n.nodeType===rt){const t=n.style.display;if(""===t&&!Tn(n)||""!==t&&!t.startsWith("inline"))return null}let r=n;for(;null!==(r=e?n.firstChild:n.lastChild);)n=r;if(n.nodeType===st)return n;if("BR"===n.nodeName)return null}}const ss={code:"code",em:"italic",i:"italic",s:"strikethrough",strong:"bold",sub:"subscript",sup:"superscript",u:"underline"};function is(t){const e=ss[t.nodeName.toLowerCase()];return void 0===e?{node:null}:{forChild:cs(t.style,e),node:null}}function os(t=""){return fn(new Yr(t))}function ls(t){return t instanceof Yr}function cs(t,e){const n=t.fontWeight,r=t.textDecoration.split(" "),s="700"===n||"bold"===n,i=r.includes("line-through"),o="italic"===t.fontStyle,l=r.includes("underline"),c=t.verticalAlign;return t=>ls(t)?(s&&!t.hasFormat("bold")&&t.toggleFormat("bold"),i&&!t.hasFormat("strikethrough")&&t.toggleFormat("strikethrough"),o&&!t.hasFormat("italic")&&t.toggleFormat("italic"),l&&!t.hasFormat("underline")&&t.toggleFormat("underline"),"sub"!==c||t.hasFormat("subscript")||t.toggleFormat("subscript"),"super"!==c||t.hasFormat("superscript")||t.toggleFormat("superscript"),e&&!t.hasFormat(e)&&t.toggleFormat(e),t):t}class as extends Yr{static getType(){return "tab"}static clone(t){return new as(t.__key)}afterCloneFrom(t){super.afterCloneFrom(t),this.__text=t.__text;}constructor(t){super("\t",t),this.__detail=2;}static importDOM(){return null}static importJSON(t){const e=us();return e.setFormat(t.format),e.setStyle(t.style),e}exportJSON(){return {...super.exportJSON(),type:"tab",version:1}}setTextContent(t){Rt(126);}setDetail(t){Rt(127);}setMode(t){Rt(128);}canInsertTextBefore(){return !1}canInsertTextAfter(){return !1}}function us(){return fn(new as)}function fs(t){return t instanceof as}class ds{constructor(t,e,n){this._selection=null,this.key=t,this.offset=e,this.type=n;}is(t){return this.key===t.key&&this.offset===t.offset&&this.type===t.type}isBefore(t){let e=this.getNode(),n=t.getNode();const r=this.offset,s=t.offset;if(yi(e)){const t=e.getDescendantByIndex(r);e=null!=t?t:e;}if(yi(n)){const t=n.getDescendantByIndex(s);n=null!=t?t:n;}return e===n?r<s:e.isBefore(n)}getNode(){const t=Se(this.key);return null===t&&Rt(20),t}set(t,e,n){const r=this._selection,s=this.key;this.key=t,this.offset=e,this.type=n,Ys()||(ve()===s&&xe(t),null!==r&&(r.setCachedNodes(null),r.dirty=!0));}}function hs(t,e,n){return new ds(t,e,n)}function gs(t,e){let n=e.__key,r=t.offset,s="element";if(ls(e)){s="text";const t=e.getTextContentSize();r>t&&(r=t);}else if(!yi(e)){const t=e.getNextSibling();if(ls(t))n=t.__key,r=0,s="text";else {const t=e.getParent();t&&(n=t.__key,r=e.getIndexWithinParent()+1);}}t.set(n,r,s);}function _s(t,e){if(yi(e)){const n=e.getLastDescendant();yi(n)||ls(n)?gs(t,n):gs(t,e);}else gs(t,e);}function ps(t,e,n,r){t.key=e,t.offset=n,t.type=r;}class ys{constructor(t){this._cachedNodes=null,this._nodes=t,this.dirty=!1;}getCachedNodes(){return this._cachedNodes}setCachedNodes(t){this._cachedNodes=t;}is(t){if(!vs(t))return !1;const e=this._nodes,n=t._nodes;return e.size===n.size&&Array.from(e).every((t=>n.has(t)))}isCollapsed(){return !1}isBackward(){return !1}getStartEndPoints(){return null}add(t){this.dirty=!0,this._nodes.add(t),this._cachedNodes=null;}delete(t){this.dirty=!0,this._nodes.delete(t),this._cachedNodes=null;}clear(){this.dirty=!0,this._nodes.clear(),this._cachedNodes=null;}has(t){return this._nodes.has(t)}clone(){return new ys(new Set(this._nodes))}extract(){return this.getNodes()}insertRawText(t){}insertText(){}insertNodes(t){const e=this.getNodes(),n=e.length,r=e[n-1];let s;if(ls(r))s=r.select();else {const t=r.getIndexWithinParent()+1;s=r.getParentOrThrow().select(t,t);}s.insertNodes(t);for(let t=0;t<n;t++)e[t].remove();}getNodes(){const t=this._cachedNodes;if(null!==t)return t;const e=this._nodes,n=[];for(const t of e){const e=Se(t);null!==e&&n.push(e);}return Ys()||(this._cachedNodes=n),n}getTextContent(){const t=this.getNodes();let e="";for(let n=0;n<t.length;n++)e+=t[n].getTextContent();return e}}function ms(t){return t instanceof xs}class xs{constructor(t,e,n,r){this.anchor=t,this.focus=e,t._selection=this,e._selection=this,this._cachedNodes=null,this.format=n,this.style=r,this.dirty=!1;}getCachedNodes(){return this._cachedNodes}setCachedNodes(t){this._cachedNodes=t;}is(t){return !!ms(t)&&(this.anchor.is(t.anchor)&&this.focus.is(t.focus)&&this.format===t.format&&this.style===t.style)}isCollapsed(){return this.anchor.is(this.focus)}getNodes(){const t=this._cachedNodes;if(null!==t)return t;const e=this.anchor,n=this.focus,r=e.isBefore(n),s=r?e:n,i=r?n:e;let o=s.getNode(),l=i.getNode();const c=s.offset,a=i.offset;if(yi(o)){const t=o.getDescendantByIndex(c);o=null!=t?t:o;}if(yi(l)){let t=l.getDescendantByIndex(a);null!==t&&t!==o&&l.getChildAtIndex(a)===t&&(t=t.getPreviousSibling()),l=null!=t?t:l;}let u;return u=o.is(l)?yi(o)&&o.getChildrenSize()>0?[]:[o]:o.getNodesBetween(l),Ys()||(this._cachedNodes=u),u}setTextNodeRange(t,e,n,r){ps(this.anchor,t.__key,e,"text"),ps(this.focus,n.__key,r,"text"),this._cachedNodes=null,this.dirty=!0;}getTextContent(){const t=this.getNodes();if(0===t.length)return "";const e=t[0],n=t[t.length-1],r=this.anchor,s=this.focus,i=r.isBefore(s),[o,l]=Ts(this);let c="",a=!0;for(let u=0;u<t.length;u++){const f=t[u];if(yi(f)&&!f.isInline())a||(c+="\n"),a=!f.isEmpty();else if(a=!1,ls(f)){let t=f.getTextContent();f===e?f===n?"element"===r.type&&"element"===s.type&&s.offset!==r.offset||(t=o<l?t.slice(o,l):t.slice(l,o)):t=i?t.slice(o):t.slice(l):f===n&&(t=i?t.slice(0,l):t.slice(0,o)),c+=t;}else !vi(f)&&!Jr(f)||f===n&&this.isCollapsed()||(c+=f.getTextContent());}return c}applyDOMRange(t){const e=ei(),n=e.getEditorState()._selection,r=Ns(t.startContainer,t.startOffset,t.endContainer,t.endOffset,e,n);if(null===r)return;const[s,i]=r;ps(this.anchor,s.key,s.offset,s.type),ps(this.focus,i.key,i.offset,i.type),this._cachedNodes=null;}clone(){const t=this.anchor,e=this.focus;return new xs(hs(t.key,t.offset,t.type),hs(e.key,e.offset,e.type),this.format,this.style)}toggleFormat(t){this.format=ge(this.format,t,null),this.dirty=!0;}setStyle(t){this.style=t,this.dirty=!0;}hasFormat(t){const e=Ot[t];return !!(this.format&e)}insertRawText(t){const e=t.split(/(\r?\n|\t)/),n=[],r=e.length;for(let t=0;t<r;t++){const r=e[t];"\n"===r||"\r\n"===r?n.push($r()):"\t"===r?n.push(us()):n.push(os(r));}this.insertNodes(n);}insertText(t){const e=this.anchor,n=this.focus,r=this.format,s=this.style;let i=e,o=n;!this.isCollapsed()&&n.isBefore(e)&&(i=n,o=e),"element"===i.type&&function(t,e,n,r){const s=t.getNode(),i=s.getChildAtIndex(t.offset),o=os(),l=Ti(s)?Pi().append(o):o;o.setFormat(n),o.setStyle(r),null===i?s.append(l):i.insertBefore(l),t.is(e)&&e.set(o.__key,0,"text"),t.set(o.__key,0,"text");}(i,o,r,s);const l=i.offset;let c=o.offset;const a=this.getNodes(),u=a.length;let f=a[0];ls(f)||Rt(26);const d=f.getTextContent().length,h=f.getParentOrThrow();let g=a[u-1];if(1===u&&"element"===o.type&&(c=d,o.set(i.key,c,"text")),this.isCollapsed()&&l===d&&(f.isSegmented()||f.isToken()||!f.canInsertTextAfter()||!h.canInsertTextAfter()&&null===f.getNextSibling())){let e=f.getNextSibling();if(ls(e)&&e.canInsertTextBefore()&&!fe(e)||(e=os(),e.setFormat(r),e.setStyle(s),h.canInsertTextAfter()?f.insertAfter(e):h.insertAfter(e)),e.select(0,0),f=e,""!==t)return void this.insertText(t)}else if(this.isCollapsed()&&0===l&&(f.isSegmented()||f.isToken()||!f.canInsertTextBefore()||!h.canInsertTextBefore()&&null===f.getPreviousSibling())){let e=f.getPreviousSibling();if(ls(e)&&!fe(e)||(e=os(),e.setFormat(r),h.canInsertTextBefore()?f.insertBefore(e):h.insertBefore(e)),e.select(),f=e,""!==t)return void this.insertText(t)}else if(f.isSegmented()&&l!==d){const t=os(f.getTextContent());t.setFormat(r),f.replace(t),f=t;}else if(!this.isCollapsed()&&""!==t){const e=g.getParent();if(!h.canInsertTextBefore()||!h.canInsertTextAfter()||yi(e)&&(!e.canInsertTextBefore()||!e.canInsertTextAfter()))return this.insertText(""),ws(this.anchor,this.focus,null),void this.insertText(t)}if(1===u){if(f.isToken()){const e=os(t);return e.select(),void f.replace(e)}const e=f.getFormat(),n=f.getStyle();if(l!==c||e===r&&n===s){if(fs(f)){const e=os(t);return e.setFormat(r),e.setStyle(s),e.select(),void f.replace(e)}}else {if(""!==f.getTextContent()){const e=os(t);if(e.setFormat(r),e.setStyle(s),e.select(),0===l)f.insertBefore(e,!1);else {const[t]=f.splitText(l);t.insertAfter(e,!1);}return void(e.isComposing()&&"text"===this.anchor.type&&(this.anchor.offset-=t.length))}f.setFormat(r),f.setStyle(s);}const i=c-l;f=f.spliceText(l,i,t,!0),""===f.getTextContent()?f.remove():"text"===this.anchor.type&&(f.isComposing()?this.anchor.offset-=t.length:(this.format=e,this.style=n));}else {const e=new Set([...f.getParentKeys(),...g.getParentKeys()]),n=yi(f)?f:f.getParentOrThrow();let r=yi(g)?g:g.getParentOrThrow(),s=g;if(!n.is(r)&&r.isInline())do{s=r,r=r.getParentOrThrow();}while(r.isInline());if("text"===o.type&&(0!==c||""===g.getTextContent())||"element"===o.type&&g.getIndexWithinParent()<c)if(ls(g)&&!g.isToken()&&c!==g.getTextContentSize()){if(g.isSegmented()){const t=os(g.getTextContent());g.replace(t),g=t;}Ti(o.getNode())||"text"!==o.type||(g=g.spliceText(0,c,"")),e.add(g.__key);}else {const t=g.getParentOrThrow();t.canBeEmpty()||1!==t.getChildrenSize()?g.remove():t.remove();}else e.add(g.__key);const i=r.getChildren(),h=new Set(a),_=n.is(r),p=n.isInline()&&null===f.getNextSibling()?n:f;for(let t=i.length-1;t>=0;t--){const e=i[t];if(e.is(f)||yi(e)&&e.isParentOf(f))break;e.isAttached()&&(!h.has(e)||e.is(s)?_||p.insertAfter(e,!1):e.remove());}if(!_){let t=r,n=null;for(;null!==t;){const r=t.getChildren(),s=r.length;(0===s||r[s-1].is(n))&&(e.delete(t.__key),n=t),t=t.getParent();}}if(f.isToken())if(l===d)f.select();else {const e=os(t);e.select(),f.replace(e);}else f=f.spliceText(l,d-l,t,!0),""===f.getTextContent()?f.remove():f.isComposing()&&"text"===this.anchor.type&&(this.anchor.offset-=t.length);for(let t=1;t<u;t++){const n=a[t],r=n.__key;e.has(r)||n.remove();}}}removeText(){if(this.isCollapsed())return;const{anchor:t,focus:e}=this,n=this.getNodes(),r=this.isBackward()?e:t,s=this.isBackward()?t:e;let i=r.getNode(),o=s.getNode();const l=bn(i,kn),c=bn(o,kn);n.forEach((t=>{sn(i,t)||sn(o,t)||t.getKey()===i.getKey()||t.getKey()===o.getKey()||t.remove();}));const a=(t,e)=>{if(""===t.getTextContent())t.remove();else if(0!==e&&fe(t)){const e=os(t.getTextContent());return e.setFormat(t.getFormat()),e.setStyle(t.getStyle()),t.replace(e)}};if(i===o&&ls(i)){const n=Math.abs(e.offset-t.offset);return i.spliceText(r.offset,n,"",!0),void a(i,n)}if(ls(i)){const t=i.getTextContentSize()-r.offset;i.spliceText(r.offset,t,""),i=a(i,t)||i;}ls(o)&&(o.spliceText(0,s.offset,""),o=a(o,s.offset)||o),i.isAttached()&&ls(i)?i.selectEnd():o.isAttached()&&ls(o)&&o.selectStart();yi(l)&&yi(c)&&l!==c&&(l.append(...c.getChildren()),c.remove(),s.set(r.key,r.offset,r.type));}formatText(t,e=null){if(this.isCollapsed())return this.toggleFormat(t),void xe(null);const n=this.getNodes(),r=[];for(const t of n)ls(t)&&r.push(t);const s=r.length;if(0===s)return this.toggleFormat(t),void xe(null);const i=this.anchor,o=this.focus,l=this.isBackward(),c=l?o:i,a=l?i:o;let u=0,f=r[0],d="element"===c.type?0:c.offset;if("text"===c.type&&d===f.getTextContentSize()&&(u=1,f=r[1],d=0),null==f)return;const h=f.getFormatFlags(t,e);n.forEach((e=>{if(Fi(e)){const n=e.getFormatFlags(t,h);e.setTextFormat(n);}}));const g=s-1;let _=r[g];const p="text"===a.type?a.offset:_.getTextContentSize();if(f.is(_)){if(d===p)return;if(fe(f)||0===d&&p===f.getTextContentSize())f.setFormat(h);else {const t=f.splitText(d,p),e=0===d?t[0]:t[1];e.setFormat(h),"text"===c.type&&c.set(e.__key,0,"text"),"text"===a.type&&a.set(e.__key,p-d,"text");}return void(this.format=h)}0===d||fe(f)||([,f]=f.splitText(d),d=0),f.setFormat(h);const y=_.getFormatFlags(t,h);p>0&&(p===_.getTextContentSize()||fe(_)||([_]=_.splitText(p)),_.setFormat(y));for(let e=u+1;e<g;e++){const n=r[e],s=n.getFormatFlags(t,y);n.setFormat(s);}"text"===c.type&&c.set(f.__key,d,"text"),"text"===a.type&&a.set(_.__key,p,"text"),this.format=h|y;}insertNodes(t){if(0===t.length)return;if("root"===this.anchor.key){this.insertParagraph();const e=Is();return ms(e)||Rt(134),e.insertNodes(t)}const e=bn((this.isBackward()?this.focus:this.anchor).getNode(),kn),n=t[t.length-1];if("__language"in e&&yi(e)){if("__language"in t[0])this.insertText(t[0].getTextContent());else {const r=Js(this);e.splice(r,0,t),n.selectEnd();}return}if(!t.some((t=>(yi(t)||vi(t))&&!t.isInline()))){yi(e)||Rt(135);const r=Js(this);return e.splice(r,0,t),void n.selectEnd()}const r=function(t){const e=Pi();let n=null;for(let r=0;r<t.length;r++){const s=t[r],i=Jr(s);if(i||vi(s)&&s.isInline()||yi(s)&&s.isInline()||ls(s)||s.isParentRequired()){if(null===n&&(n=s.createParentElementNode(),e.append(n),i))continue;null!==n&&n.append(s);}else e.append(s),n=null;}return e}(t),s=r.getLastDescendant(),i=r.getChildren(),o=!yi(e)||!e.isEmpty()?this.insertParagraph():null,l=i[i.length-1];let c=i[0];var a;yi(a=c)&&kn(a)&&!a.isEmpty()&&yi(e)&&(!e.isEmpty()||e.canMergeWhenEmpty())&&(yi(e)||Rt(135),e.append(...c.getChildren()),c=i[1]),c&&function(t,e,n){const r=e.getParentOrThrow().getLastChild();let s=e;const i=[e];for(;s!==r;)s.getNextSibling()||Rt(140),s=s.getNextSibling(),i.push(s);let o=t;for(const t of i)o=o.insertAfter(t);}(e,c);const u=bn(s,kn);o&&yi(u)&&(o.canMergeWhenEmpty()||kn(l))&&(u.append(...o.getChildren()),o.remove()),yi(e)&&e.isEmpty()&&e.remove(),s.selectEnd();const f=yi(e)?e.getLastChild():null;Jr(f)&&u!==e&&f.remove();}insertParagraph(){if("root"===this.anchor.key){const t=Pi();return we().splice(this.anchor.offset,0,[t]),t.select(),t}const t=Js(this),e=bn(this.anchor.getNode(),kn);yi(e)||Rt(136);const n=e.getChildAtIndex(t),r=n?[n,...n.getNextSiblings()]:[],s=e.insertNewAfter(this,!1);return s?(s.append(...r),s.selectStart(),s):null}insertLineBreak(t){const e=$r();if(this.insertNodes([e]),t){const t=e.getParentOrThrow(),n=e.getIndexWithinParent();t.select(n,n);}}extract(){const t=this.getNodes(),e=t.length,n=e-1,r=this.anchor,s=this.focus;let i=t[0],o=t[n];const[l,c]=Ts(this);if(0===e)return [];if(1===e){if(ls(i)&&!this.isCollapsed()){const t=l>c?c:l,e=l>c?l:c,n=i.splitText(t,e),r=0===t?n[0]:n[1];return null!=r?[r]:[]}return [i]}const a=r.isBefore(s);if(ls(i)){const e=a?l:c;e===i.getTextContentSize()?t.shift():0!==e&&([,i]=i.splitText(e),t[0]=i);}if(ls(o)){const e=o.getTextContent().length,r=a?c:l;0===r?t.pop():r!==e&&([o]=o.splitText(r),t[n]=o);}return t}modify(t,e,n){const r=this.focus,s=this.anchor,i="move"===t,o=Xe(r,e);if(vi(o)&&!o.isIsolated()){if(i&&o.isKeyboardSelectable()){const t=Ds();return t.add(o.__key),void Ee(t)}const t=e?o.getPreviousSibling():o.getNextSibling();if(ls(t)){const n=t.__key,o=e?t.getTextContent().length:0;return r.set(n,o,"text"),void(i&&s.set(n,o,"text"))}{const n=o.getParentOrThrow();let l,c;return yi(t)?(c=t.__key,l=e?t.getChildrenSize():0):(l=o.getIndexWithinParent(),c=n.__key,e||l++),r.set(c,l,"element"),void(i&&s.set(c,l,"element"))}}const l=ei(),c=yn(l._window);if(!c)return;const a=l._blockCursorElement,u=l._rootElement;if(null===u||null===a||!yi(o)||o.isInline()||o.canBeEmpty()||_n(a,l,u),function(t,e,n,r){t.modify(e,n,r);}(c,t,e?"backward":"forward",n),c.rangeCount>0){const t=c.getRangeAt(0),n=this.anchor.getNode(),r=Ti(n)?n:cn(n);if(this.applyDOMRange(t),this.dirty=!0,!i){const n=this.getNodes(),s=[];let i=!1;for(let t=0;t<n.length;t++){const e=n[t];sn(e,r)?s.push(e):i=!0;}if(i&&s.length>0)if(e){const t=s[0];yi(t)?t.selectStart():t.getParentOrThrow().selectStart();}else {const t=s[s.length-1];yi(t)?t.selectEnd():t.getParentOrThrow().selectEnd();}c.anchorNode===t.startContainer&&c.anchorOffset===t.startOffset||function(t){const e=t.focus,n=t.anchor,r=n.key,s=n.offset,i=n.type;ps(n,e.key,e.offset,e.type),ps(e,r,s,i),t._cachedNodes=null;}(this);}}}forwardDeletion(t,e,n){if(!n&&("element"===t.type&&yi(e)&&t.offset===e.getChildrenSize()||"text"===t.type&&t.offset===e.getTextContentSize())){const t=e.getParent(),n=e.getNextSibling()||(null===t?null:t.getNextSibling());if(yi(n)&&n.isShadowRoot())return !0}return !1}deleteCharacter(t){const n=this.isCollapsed();if(this.isCollapsed()){const n=this.anchor;let r=n.getNode();if(this.forwardDeletion(n,r,t))return;const s=this.focus,i=Xe(s,t);if(vi(i)&&!i.isIsolated()){if(i.isKeyboardSelectable()&&yi(r)&&0===r.getChildrenSize()){r.remove();const t=Ds();t.add(i.__key),Ee(t);}else {i.remove();ei().dispatchCommand(e,void 0);}return}if(!t&&yi(i)&&yi(r)&&r.isEmpty())return r.remove(),void i.selectStart();if(this.modify("extend",t,"character"),this.isCollapsed()){if(t&&0===n.offset){if(("element"===n.type?n.getNode():n.getNode().getParentOrThrow()).collapseAtStart(this))return}}else {const e="text"===s.type?s.getNode():null;if(r="text"===n.type?n.getNode():null,null!==e&&e.isSegmented()){const n=s.offset,i=e.getTextContentSize();if(e.is(r)||t&&n!==i||!t&&0!==n)return void Cs(e,t,n)}else if(null!==r&&r.isSegmented()){const s=n.offset,i=r.getTextContentSize();if(r.is(e)||t&&0!==s||!t&&s!==i)return void Cs(r,t,s)}!function(t,e){const n=t.anchor,r=t.focus,s=n.getNode(),i=r.getNode();if(s===i&&"text"===n.type&&"text"===r.type){const t=n.offset,i=r.offset,o=t<i,l=o?t:i,c=o?i:t,a=c-1;if(l!==a){De(s.getTextContent().slice(l,c))||(e?r.offset=a:n.offset=a);}}}(this,t);}}if(this.removeText(),t&&!n&&this.isCollapsed()&&"element"===this.anchor.type&&0===this.anchor.offset){const t=this.anchor.getNode();t.isEmpty()&&Ti(t.getParent())&&0===t.getIndexWithinParent()&&t.collapseAtStart(this);}}deleteLine(t){if(this.isCollapsed()){const e="element"===this.anchor.type;e&&this.insertText(" "),this.modify("extend",t,"lineboundary");if(0===(t?this.focus:this.anchor).offset&&this.modify("extend",t,"character"),e){const e=t?this.anchor:this.focus;e.set(e.key,e.offset+1,e.type);}}this.removeText();}deleteWord(t){if(this.isCollapsed()){const e=this.anchor,n=e.getNode();if(this.forwardDeletion(e,n,t))return;this.modify("extend",t,"word");}this.removeText();}isBackward(){return this.focus.isBefore(this.anchor)}getStartEndPoints(){return [this.anchor,this.focus]}}function vs(t){return t instanceof ys}function Ss(t){const e=t.offset;if("text"===t.type)return e;const n=t.getNode();return e===n.getChildrenSize()?n.getTextContent().length:0}function Ts(t){const e=t.getStartEndPoints();if(null===e)return [0,0];const[n,r]=e;return "element"===n.type&&"element"===r.type&&n.key===r.key&&n.offset===r.offset?[0,0]:[Ss(n),Ss(r)]}function Cs(t,e,n){const r=t,s=r.getTextContent().split(/(?=\s)/g),i=s.length;let o=0,l=0;for(let t=0;t<i;t++){const r=t===i-1;if(l=o,o+=s[t].length,e&&o===n||o>n||r){s.splice(t,1),r&&(l=void 0);break}}const c=s.join("").trim();""===c?r.remove():(r.setTextContent(c),r.select(l,l));}function ks(t,e,n,r){let s,i=e;if(t.nodeType===rt){let o=!1;const l=t.childNodes,c=l.length,a=r._blockCursorElement;i===c&&(o=!0,i=c-1);let u=l[i],f=!1;if(u===a)u=l[i+1],f=!0;else if(null!==a){const n=a.parentNode;if(t===n){e>Array.prototype.indexOf.call(n.children,a)&&i--;}}if(s=Pe(u),ls(s))i=Fe(s,o);else {let r=Pe(t);if(null===r)return null;if(yi(r)){i=Math.min(r.getChildrenSize(),i);let t=r.getChildAtIndex(i);if(yi(t)&&function(t,e,n){const r=t.getParent();return null===n||null===r||!r.canBeEmpty()||r!==n.getNode()}(t,0,n)){const e=o?t.getLastDescendant():t.getFirstDescendant();null===e?r=t:(t=e,r=yi(t)?t:t.getParentOrThrow()),i=0;}ls(t)?(s=t,r=null,i=Fe(t,o)):t!==r&&o&&!f&&i++;}else {const n=r.getIndexWithinParent();i=0===e&&vi(r)&&Pe(t)===r?n:n+1,r=r.getParentOrThrow();}if(yi(r))return hs(r.__key,i,"element")}}else s=Pe(t);return ls(s)?hs(s.__key,i,"text"):null}function bs(t,e,n){const r=t.offset,s=t.getNode();if(0===r){const r=s.getPreviousSibling(),i=s.getParent();if(e){if((n||!e)&&null===r&&yi(i)&&i.isInline()){const e=i.getPreviousSibling();ls(e)&&(t.key=e.__key,t.offset=e.getTextContent().length);}}else yi(r)&&!n&&r.isInline()?(t.key=r.__key,t.offset=r.getChildrenSize(),t.type="element"):ls(r)&&(t.key=r.__key,t.offset=r.getTextContent().length);}else if(r===s.getTextContent().length){const r=s.getNextSibling(),i=s.getParent();if(e&&yi(r)&&r.isInline())t.key=r.__key,t.offset=0,t.type="element";else if((n||e)&&null===r&&yi(i)&&i.isInline()&&!i.canInsertTextAfter()){const e=i.getNextSibling();ls(e)&&(t.key=e.__key,t.offset=0);}}}function ws(t,e,n){if("text"===t.type&&"text"===e.type){const r=t.isBefore(e),s=t.is(e);bs(t,r,s),bs(e,!r,s),s&&(e.key=t.key,e.offset=t.offset,e.type=t.type);const i=ei();if(i.isComposing()&&i._compositionKey!==t.key&&ms(n)){const r=n.anchor,s=n.focus;ps(t,r.key,r.offset,r.type),ps(e,s.key,s.offset,s.type);}}}function Ns(t,e,n,r,s,i){if(null===t||null===n||!le(s,t,n))return null;const o=ks(t,e,ms(i)?i.anchor:null,s);if(null===o)return null;const l=ks(n,r,ms(i)?i.focus:null,s);if(null===l)return null;if("element"===o.type&&"element"===l.type){const e=Pe(t),r=Pe(n);if(vi(e)&&vi(r))return null}return ws(o,l,i),[o,l]}function Ps(t,e,n,r,s,i){const o=ti(),l=new xs(hs(t,e,s),hs(n,r,i),0,"");return l.dirty=!0,o._selection=l,l}function Ds(){return new ys(new Set)}function Os(t,e,n,r){const s=n._window;if(null===s)return null;const i=r||s.event,o=i?i.type:void 0,l="selectionchange"===o,c=!Jt&&(l||"beforeinput"===o||"compositionstart"===o||"compositionend"===o||"click"===o&&i&&3===i.detail||"drop"===o||void 0===o);let a,u,f,d;if(ms(t)&&!c)return t.clone();if(null===e)return null;if(a=e.anchorNode,u=e.focusNode,f=e.anchorOffset,d=e.focusOffset,l&&ms(t)&&!le(n,a,u))return t.clone();const h=Ns(a,f,u,d,n,t);if(null===h)return null;const[g,_]=h;return new xs(g,_,ms(t)?t.format:0,ms(t)?t.style:"")}function Is(){return ti()._selection}function As(){return ei()._editorState._selection}function Ms(t,e,n,r=1){const s=t.anchor,i=t.focus,o=s.getNode(),l=i.getNode();if(!e.is(o)&&!e.is(l))return;const c=e.__key;if(t.isCollapsed()){const e=s.offset;if(n<=e&&r>0||n<e&&r<0){const n=Math.max(0,e+r);s.set(c,n,"element"),i.set(c,n,"element"),Ws(t);}}else {const o=t.isBackward(),l=o?i:s,a=l.getNode(),u=o?s:i,f=u.getNode();if(e.is(a)){const t=l.offset;(n<=t&&r>0||n<t&&r<0)&&l.set(c,Math.max(0,t+r),"element");}if(e.is(f)){const t=u.offset;(n<=t&&r>0||n<t&&r<0)&&u.set(c,Math.max(0,t+r),"element");}}Ws(t);}function Ws(t){const e=t.anchor,n=e.offset,r=t.focus,s=r.offset,i=e.getNode(),o=r.getNode();if(t.isCollapsed()){if(!yi(i))return;const t=i.getChildrenSize(),s=n>=t,o=s?i.getChildAtIndex(t-1):i.getChildAtIndex(n);if(ls(o)){let t=0;s&&(t=o.getTextContentSize()),e.set(o.__key,t,"text"),r.set(o.__key,t,"text");}}else {if(yi(i)){const t=i.getChildrenSize(),r=n>=t,s=r?i.getChildAtIndex(t-1):i.getChildAtIndex(n);if(ls(s)){let t=0;r&&(t=s.getTextContentSize()),e.set(s.__key,t,"text");}}if(yi(o)){const t=o.getChildrenSize(),e=s>=t,n=e?o.getChildAtIndex(t-1):o.getChildAtIndex(s);if(ls(n)){let t=0;e&&(t=n.getTextContentSize()),r.set(n.__key,t,"text");}}}}function zs(t,e,n,r,s){let i=null,o=0,l=null;null!==r?(i=r.__key,ls(r)?(o=r.getTextContentSize(),l="text"):yi(r)&&(o=r.getChildrenSize(),l="element")):null!==s&&(i=s.__key,ls(s)?l="text":yi(s)&&(l="element")),null!==i&&null!==l?t.set(i,o,l):(o=e.getIndexWithinParent(),-1===o&&(o=n.getChildrenSize()),t.set(n.__key,o,"element"));}function Bs(t,e,n,r,s){"text"===t.type?(t.key=n,e||(t.offset+=s)):t.offset>r.getIndexWithinParent()&&(t.offset-=1);}function Rs(t,e,n,r,s,i,o){const l=r.anchorNode,c=r.focusNode,a=r.anchorOffset,u=r.focusOffset,f=document.activeElement;if(s.has("collaboration")&&f!==i||null!==f&&oe(f))return;if(!ms(e))return void(null!==t&&le(n,l,c)&&r.removeAllRanges());const d=e.anchor,h=e.focus,g=d.key,_=h.key,p=tn(n,g),y=tn(n,_),m=d.offset,x=h.offset,v=e.format,S=e.style,T=e.isCollapsed();let C=p,k=y,b=!1;if("text"===d.type){C=he(p);const t=d.getNode();b=t.getFormat()!==v||t.getStyle()!==S;}else ms(t)&&"text"===t.anchor.type&&(b=!0);var w,N,E,P,F;if(("text"===h.type&&(k=he(y)),null!==C&&null!==k)&&(T&&(null===t||b||ms(t)&&(t.format!==v||t.style!==S))&&(w=v,N=S,E=m,P=g,F=performance.now(),wr=[w,N,E,P,F]),a!==m||u!==x||l!==C||c!==k||"Range"===r.type&&T||(null!==f&&i.contains(f)||i.focus({preventScroll:!0}),"element"===d.type))){try{r.setBaseAndExtent(C,m,k,x);}catch(t){}if(!s.has("skip-scroll-into-view")&&e.isCollapsed()&&null!==i&&i===document.activeElement){const t=e instanceof xs&&"element"===e.anchor.type?C.childNodes[m]||null:r.rangeCount>0?r.getRangeAt(0):null;if(null!==t){let e;if(t instanceof Text){const n=document.createRange();n.selectNode(t),e=n.getBoundingClientRect();}else e=t.getBoundingClientRect();!function(t,e,n){const r=n.ownerDocument,s=r.defaultView;if(null===s)return;let{top:i,bottom:o}=e,l=0,c=0,a=n;for(;null!==a;){const e=a===r.body;if(e)l=0,c=on(t).innerHeight;else {const t=a.getBoundingClientRect();l=t.top,c=t.bottom;}let n=0;if(i<l?n=-(l-i):o>c&&(n=o-c),0!==n)if(e)s.scrollBy(0,n);else {const t=a.scrollTop;a.scrollTop+=n;const e=a.scrollTop-t;i-=e,o-=e;}if(e)break;a=en(a);}}(n,e,i);}}Tr=!0;}}function Js(t){let e=t;t.isCollapsed()||e.removeText();const n=Is();ms(n)&&(e=n),ms(e)||Rt(161);const r=e.anchor;let s=r.getNode(),i=r.offset;for(;!kn(s);)[s,i]=Us(s,i);return i}function Us(t,e){const n=t.getParent();if(!n){const t=Pi();return we().append(t),t.select(),[we(),0]}if(ls(t)){const r=t.splitText(e);if(0===r.length)return [n,t.getIndexWithinParent()];const s=0===e?0:1;return [n,r[0].getIndexWithinParent()+s]}if(!yi(t)||0===e)return [n,t.getIndexWithinParent()];const r=t.getChildAtIndex(e);if(r){const n=new xs(hs(t.__key,e,"element"),hs(t.__key,e,"element"),0,""),s=t.insertNewAfter(n);s&&s.append(r,...r.getNextSiblings());}return [n,t.getIndexWithinParent()+1]}let Vs=null,js=null,Hs=!1,qs=!1,Qs=0;const Xs={characterData:!0,childList:!0,subtree:!0};function Ys(){return Hs||null!==Vs&&Vs._readOnly}function Zs(){Hs&&Rt(13);}function Gs(){Qs>99&&Rt(14);}function ti(){return null===Vs&&Rt(195,ni()),Vs}function ei(){return null===js&&Rt(196,ni()),js}function ni(){let t=0;const e=new Set,n=zi.version;if("undefined"!=typeof window)for(const r of document.querySelectorAll("[contenteditable]")){const s=ue(r);if(ce(s))t++;else if(s){let t=String(s.constructor.version||"<0.17.1");t===n&&(t+=" (separately built, likely a bundler configuration issue)"),e.add(t);}}let r=` Detected on the page: ${t} compatible editor(s) with version ${n}`;return e.size&&(r+=` and incompatible editors with versions ${Array.from(e).join(", ")}`),r}function ri(){return js}function si(t,e,n){const r=e.__type,s=function(t,e){const n=t._nodes.get(e);return void 0===n&&Rt(30,e),n}(t,r);let i=n.get(r);void 0===i&&(i=Array.from(s.transforms),n.set(r,i));const o=i.length;for(let t=0;t<o&&(i[t](e),e.isAttached());t++);}function ii(t,e){return void 0!==t&&t.__key!==e&&t.isAttached()}function oi(t,e){if(!e)return;const n=t._updateTags;let r=e;Array.isArray(e)||(r=[e]);for(const t of r)n.add(t);}function ci(t,e){const n=t.type,r=e.get(n);void 0===r&&Rt(17,n);const s=r.klass;t.type!==s.getType()&&Rt(18,s.name);const i=s.importJSON(t),o=t.children;if(yi(i)&&Array.isArray(o))for(let t=0;t<o.length;t++){const n=ci(o[t],e);i.append(n);}return i}function ai(t,e,n){const r=Vs,s=Hs,i=js;Vs=e,Hs=!0,js=t;try{return n()}finally{Vs=r,Hs=s,js=i;}}function ui(t,n){const r=t._pendingEditorState,s=t._rootElement,i=t._headless||null===s;if(null===r)return;const o=t._editorState,l=o._selection,c=r._selection,a=t._dirtyType!==it,u=Vs,f=Hs,d=js,h=t._updating,g=t._observer;let _=null;if(t._pendingEditorState=null,t._editorState=r,!i&&a&&null!==g){js=t,Vs=r,Hs=!1,t._updating=!0;try{const e=t._dirtyType,n=t._dirtyElements,s=t._dirtyLeaves;g.disconnect(),_=dr(o,r,t,e,n,s);}catch(e){if(e instanceof Error&&t._onError(e),qs)throw e;return Mi(t,null,s,r),Yt(t),t._dirtyType=lt,qs=!0,ui(t,o),void(qs=!1)}finally{g.observe(s,Xs),t._updating=h,Vs=u,Hs=f,js=d;}}r._readOnly||(r._readOnly=!0);const p=t._dirtyLeaves,y=t._dirtyElements,m=t._normalizedNodes,x=t._updateTags,v=t._deferred;a&&(t._dirtyType=it,t._cloneNotNeeded.clear(),t._dirtyLeaves=new Set,t._dirtyElements=new Map,t._normalizedNodes=new Set,t._updateTags=new Set),function(t,e){const n=t._decorators;let r=t._pendingDecorators||n;const s=e._nodeMap;let i;for(i in r)s.has(i)||(r===n&&(r=ke(t)),delete r[i]);}(t,r);const S=i?null:yn(t._window);if(t._editable&&null!==S&&(a||null===c||c.dirty)){js=t,Vs=r;try{if(null!==g&&g.disconnect(),a||null===c||c.dirty){const e=t._blockCursorElement;null!==e&&_n(e,t,s),Rs(l,c,t,S,x,s);}pn(t,s,c),null!==g&&g.observe(s,Xs);}finally{js=d,Vs=u;}}null!==_&&function(t,e,n,r,s){const i=Array.from(t._listeners.mutation),o=i.length;for(let t=0;t<o;t++){const[o,l]=i[t],c=e.get(l);void 0!==c&&o(c,{dirtyLeaves:r,prevEditorState:s,updateTags:n});}}(t,_,x,p,o),ms(c)||null===c||null!==l&&l.is(c)||t.dispatchCommand(e,void 0);const T=t._pendingDecorators;null!==T&&(t._decorators=T,t._pendingDecorators=null,fi("decorator",t,!0,T)),function(t,e,n){const r=be(e),s=be(n);r!==s&&fi("textcontent",t,!0,s);}(t,n||o,r),fi("update",t,!0,{dirtyElements:y,dirtyLeaves:p,editorState:r,normalizedNodes:m,prevEditorState:n||o,tags:x}),function(t,e){if(t._deferred=[],0!==e.length){const n=t._updating;t._updating=!0;try{for(let t=0;t<e.length;t++)e[t]();}finally{t._updating=n;}}}(t,v),function(t){const e=t._updates;if(0!==e.length){const n=e.shift();if(n){const[e,r]=n;gi(t,e,r);}}}(t);}function fi(t,e,n,...r){const s=e._updating;e._updating=n;try{const n=Array.from(e._listeners[t]);for(let t=0;t<n.length;t++)n[t].apply(null,r);}finally{e._updating=s;}}function di(t,e,n){if(!1===t._updating||js!==t){let r=!1;return t.update((()=>{r=di(t,e,n);})),r}const r=Le(t);for(let s=4;s>=0;s--)for(let i=0;i<r.length;i++){const o=r[i]._commands.get(e);if(void 0!==o){const e=o[s];if(void 0!==e){const r=Array.from(e),s=r.length;for(let e=0;e<s;e++)if(!0===r[e](n,t))return !0}}}return !1}function hi(t,e){const n=t._updates;let r=e||!1;for(;0!==n.length;){const e=n.shift();if(e){const[n,s]=e;let i;if(void 0!==s){if(i=s.onUpdate,s.skipTransforms&&(r=!0),s.discrete){const e=t._pendingEditorState;null===e&&Rt(191),e._flushSync=!0;}i&&t._deferred.push(i),oi(t,s.tag);}n();}}return r}function gi(t,e,n){const r=t._updateTags;let s,i=!1,o=!1;void 0!==n&&(s=n.onUpdate,oi(t,n.tag),i=n.skipTransforms||!1,o=n.discrete||!1),s&&t._deferred.push(s);const l=t._editorState;let c=t._pendingEditorState,a=!1;(null===c||c._readOnly)&&(c=t._pendingEditorState=new bi(new Map((c||l)._nodeMap)),a=!0),c._flushSync=o;const u=Vs,f=Hs,d=js,h=t._updating;Vs=c,Hs=!1,t._updating=!0,js=t;try{a&&(t._headless?null!==l._selection&&(c._selection=l._selection.clone()):c._selection=function(t){const e=t.getEditorState()._selection,n=yn(t._window);return ms(e)||null==e?Os(e,n,t,null):e.clone()}(t));const n=t._compositionKey;e(),i=hi(t,i),function(t,e){const n=e.getEditorState()._selection,r=t._selection;if(ms(r)){const t=r.anchor,e=r.focus;let s;if("text"===t.type&&(s=t.getNode(),s.selectionTransform(n,r)),"text"===e.type){const t=e.getNode();s!==t&&t.selectionTransform(n,r);}}}(c,t),t._dirtyType!==it&&(i?function(t,e){const n=e._dirtyLeaves,r=t._nodeMap;for(const t of n){const e=r.get(t);ls(e)&&e.isAttached()&&e.isSimpleText()&&!e.isUnmergeable()&&te$1(e);}}(c,t):function(t,e){const n=e._dirtyLeaves,r=e._dirtyElements,s=t._nodeMap,i=ve(),o=new Map;let l=n,c=l.size,a=r,u=a.size;for(;c>0||u>0;){if(c>0){e._dirtyLeaves=new Set;for(const t of l){const r=s.get(t);ls(r)&&r.isAttached()&&r.isSimpleText()&&!r.isUnmergeable()&&te$1(r),void 0!==r&&ii(r,i)&&si(e,r,o),n.add(t);}if(l=e._dirtyLeaves,c=l.size,c>0){Qs++;continue}}e._dirtyLeaves=new Set,e._dirtyElements=new Map;for(const t of a){const n=t[0],l=t[1];if("root"!==n&&!l)continue;const c=s.get(n);void 0!==c&&ii(c,i)&&si(e,c,o),r.set(n,l);}l=e._dirtyLeaves,c=l.size,a=e._dirtyElements,u=a.size,Qs++;}e._dirtyLeaves=n,e._dirtyElements=r;}(c,t),hi(t),function(t,e,n,r){const s=t._nodeMap,i=e._nodeMap,o=[];for(const[t]of r){const e=i.get(t);void 0!==e&&(e.isAttached()||(yi(e)&&Dn(e,t,s,i,o,r),s.has(t)||r.delete(t),o.push(t)));}for(const t of o)i.delete(t);for(const t of n){const e=i.get(t);void 0===e||e.isAttached()||(s.has(t)||n.delete(t),i.delete(t));}}(l,c,t._dirtyLeaves,t._dirtyElements));n!==t._compositionKey&&(c._flushSync=!0);const r=c._selection;if(ms(r)){const t=c._nodeMap,e=r.anchor.key,n=r.focus.key;void 0!==t.get(e)&&void 0!==t.get(n)||Rt(19);}else vs(r)&&0===r._nodes.size&&(c._selection=null);}catch(e){return e instanceof Error&&t._onError(e),t._pendingEditorState=l,t._dirtyType=lt,t._cloneNotNeeded.clear(),t._dirtyLeaves=new Set,t._dirtyElements.clear(),void ui(t)}finally{Vs=u,Hs=f,js=d,t._updating=h,Qs=0;}const g=t._dirtyType!==it||function(t,e){const n=e.getEditorState()._selection,r=t._selection;if(null!==r){if(r.dirty||!r.is(n))return !0}else if(null!==n)return !0;return !1}(c,t);g?c._flushSync?(c._flushSync=!1,ui(t)):a&&ie((()=>{ui(t);})):(c._flushSync=!1,a&&(r.clear(),t._deferred=[],t._pendingEditorState=null));}function _i(t,e,n){t._updating?t._updates.push([e,n]):gi(t,e,n);}class pi extends Br{constructor(t){super(t),this.__first=null,this.__last=null,this.__size=0,this.__format=0,this.__style="",this.__indent=0,this.__dir=null;}afterCloneFrom(t){super.afterCloneFrom(t),this.__first=t.__first,this.__last=t.__last,this.__size=t.__size,this.__indent=t.__indent,this.__format=t.__format,this.__style=t.__style,this.__dir=t.__dir;}getFormat(){return this.getLatest().__format}getFormatType(){const t=this.getFormat();return Mt[t]||""}getStyle(){return this.getLatest().__style}getIndent(){return this.getLatest().__indent}getChildren(){const t=[];let e=this.getFirstChild();for(;null!==e;)t.push(e),e=e.getNextSibling();return t}getChildrenKeys(){const t=[];let e=this.getFirstChild();for(;null!==e;)t.push(e.__key),e=e.getNextSibling();return t}getChildrenSize(){return this.getLatest().__size}isEmpty(){return 0===this.getChildrenSize()}isDirty(){const t=ei()._dirtyElements;return null!==t&&t.has(this.__key)}isLastChild(){const t=this.getLatest(),e=this.getParentOrThrow().getLastChild();return null!==e&&e.is(t)}getAllTextNodes(){const t=[];let e=this.getFirstChild();for(;null!==e;){if(ls(e)&&t.push(e),yi(e)){const n=e.getAllTextNodes();t.push(...n);}e=e.getNextSibling();}return t}getFirstDescendant(){let t=this.getFirstChild();for(;yi(t);){const e=t.getFirstChild();if(null===e)break;t=e;}return t}getLastDescendant(){let t=this.getLastChild();for(;yi(t);){const e=t.getLastChild();if(null===e)break;t=e;}return t}getDescendantByIndex(t){const e=this.getChildren(),n=e.length;if(t>=n){const t=e[n-1];return yi(t)&&t.getLastDescendant()||t||null}const r=e[t];return yi(r)&&r.getFirstDescendant()||r||null}getFirstChild(){const t=this.getLatest().__first;return null===t?null:Se(t)}getFirstChildOrThrow(){const t=this.getFirstChild();return null===t&&Rt(45,this.__key),t}getLastChild(){const t=this.getLatest().__last;return null===t?null:Se(t)}getLastChildOrThrow(){const t=this.getLastChild();return null===t&&Rt(96,this.__key),t}getChildAtIndex(t){const e=this.getChildrenSize();let n,r;if(t<e/2){for(n=this.getFirstChild(),r=0;null!==n&&r<=t;){if(r===t)return n;n=n.getNextSibling(),r++;}return null}for(n=this.getLastChild(),r=e-1;null!==n&&r>=t;){if(r===t)return n;n=n.getPreviousSibling(),r--;}return null}getTextContent(){let t="";const e=this.getChildren(),n=e.length;for(let r=0;r<n;r++){const s=e[r];t+=s.getTextContent(),yi(s)&&r!==n-1&&!s.isInline()&&(t+=Nt);}return t}getTextContentSize(){let t=0;const e=this.getChildren(),n=e.length;for(let r=0;r<n;r++){const s=e[r];t+=s.getTextContentSize(),yi(s)&&r!==n-1&&!s.isInline()&&(t+=Nt.length);}return t}getDirection(){return this.getLatest().__dir}hasFormat(t){if(""!==t){const e=At[t];return !!(this.getFormat()&e)}return !1}select(t,e){Zs();const n=Is();let r=t,s=e;const i=this.getChildrenSize();if(!this.canBeEmpty())if(0===t&&0===e){const t=this.getFirstChild();if(ls(t)||yi(t))return t.select(0,0)}else if(!(void 0!==t&&t!==i||void 0!==e&&e!==i)){const t=this.getLastChild();if(ls(t)||yi(t))return t.select()}void 0===r&&(r=i),void 0===s&&(s=i);const o=this.__key;return ms(n)?(n.anchor.set(o,r,"element"),n.focus.set(o,s,"element"),n.dirty=!0,n):Ps(o,r,o,s,"element","element")}selectStart(){const t=this.getFirstDescendant();return t?t.selectStart():this.select()}selectEnd(){const t=this.getLastDescendant();return t?t.selectEnd():this.select()}clear(){const t=this.getWritable();return this.getChildren().forEach((t=>t.remove())),t}append(...t){return this.splice(this.getChildrenSize(),0,t)}setDirection(t){const e=this.getWritable();return e.__dir=t,e}setFormat(t){return this.getWritable().__format=""!==t?At[t]:0,this}setStyle(t){return this.getWritable().__style=t||"",this}setIndent(t){return this.getWritable().__indent=t,this}splice(t,e,n){const r=n.length,s=this.getChildrenSize(),i=this.getWritable(),o=i.__key,l=[],c=[],a=this.getChildAtIndex(t+e);let u=null,f=s-e+r;if(0!==t)if(t===s)u=this.getLastChild();else {const e=this.getChildAtIndex(t);null!==e&&(u=e.getPreviousSibling());}if(e>0){let t=null===u?this.getFirstChild():u.getNextSibling();for(let n=0;n<e;n++){null===t&&Rt(100);const e=t.getNextSibling(),n=t.__key;ye(t.getWritable()),c.push(n),t=e;}}let d=u;for(let t=0;t<r;t++){const e=n[t];null!==d&&e.is(d)&&(u=d=d.getPreviousSibling());const r=e.getWritable();r.__parent===o&&f--,ye(r);const s=e.__key;if(null===d)i.__first=s,r.__prev=null;else {const t=d.getWritable();t.__next=s,r.__prev=t.__key;}e.__key===o&&Rt(76),r.__parent=o,l.push(s),d=e;}if(t+e===s){if(null!==d){d.getWritable().__next=null,i.__last=d.__key;}}else if(null!==a){const t=a.getWritable();if(null!==d){const e=d.getWritable();t.__prev=d.__key,e.__next=a.__key;}else t.__prev=null;}if(i.__size=f,c.length){const t=Is();if(ms(t)){const e=new Set(c),n=new Set(l),{anchor:r,focus:s}=t;mi(r,e,n)&&zs(r,r.getNode(),this,u,a),mi(s,e,n)&&zs(s,s.getNode(),this,u,a),0!==f||this.canBeEmpty()||an(this)||this.remove();}}return i}exportJSON(){return {children:[],direction:this.getDirection(),format:this.getFormatType(),indent:this.getIndent(),type:"element",version:1}}insertNewAfter(t,e){return null}canIndent(){return !0}collapseAtStart(t){return !1}excludeFromCopy(t){return !1}canReplaceWith(t){return !0}canInsertAfter(t){return !0}canBeEmpty(){return !0}canInsertTextBefore(){return !0}canInsertTextAfter(){return !0}isInline(){return !1}isShadowRoot(){return !1}canMergeWith(t){return !1}extractWithChild(t,e,n){return !1}canMergeWhenEmpty(){return !1}}function yi(t){return t instanceof pi}function mi(t,e,n){let r=t.getNode();for(;r;){const t=r.__key;if(e.has(t)&&!n.has(t))return !0;r=r.getParent();}return !1}class xi extends Br{constructor(t){super(t);}decorate(t,e){Rt(47);}isIsolated(){return !1}isInline(){return !0}isKeyboardSelectable(){return !0}}function vi(t){return t instanceof xi}class Si extends pi{static getType(){return "root"}static clone(){return new Si}constructor(){super("root"),this.__cachedText=null;}getTopLevelElementOrThrow(){Rt(51);}getTextContent(){const t=this.__cachedText;return !Ys()&&ei()._dirtyType!==it||null===t?super.getTextContent():t}remove(){Rt(52);}replace(t){Rt(53);}insertBefore(t){Rt(54);}insertAfter(t){Rt(55);}updateDOM(t,e){return !1}append(...t){for(let e=0;e<t.length;e++){const n=t[e];yi(n)||vi(n)||Rt(56);}return super.append(...t)}static importJSON(t){const e=we();return e.setFormat(t.format),e.setIndent(t.indent),e.setDirection(t.direction),e}exportJSON(){return {children:[],direction:this.getDirection(),format:this.getFormatType(),indent:this.getIndent(),type:"root",version:1}}collapseAtStart(){return !0}}function Ti(t){return t instanceof Si}function Ci(){return new bi(new Map([["root",new Si]]))}function ki(t){const e=t.exportJSON(),n=t.constructor;if(e.type!==n.getType()&&Rt(130,n.name),yi(t)){const r=e.children;Array.isArray(r)||Rt(59,n.name);const s=t.getChildren();for(let t=0;t<s.length;t++){const e=ki(s[t]);r.push(e);}}return e}class bi{constructor(t,e){this._nodeMap=t,this._selection=e||null,this._flushSync=!1,this._readOnly=!1;}isEmpty(){return 1===this._nodeMap.size&&null===this._selection}read(t,e){return ai(e&&e.editor||null,this,t)}clone(t){const e=new bi(this._nodeMap,void 0===t?this._selection:t);return e._readOnly=!0,e}toJSON(){return ai(null,this,(()=>({root:ki(we())})))}}class wi extends pi{static getType(){return "artificial"}createDOM(t){return document.createElement("div")}}class Ni extends pi{constructor(t){super(t),this.__textFormat=0,this.__textStyle="";}static getType(){return "paragraph"}getTextFormat(){return this.getLatest().__textFormat}setTextFormat(t){const e=this.getWritable();return e.__textFormat=t,e}hasTextFormat(t){const e=Ot[t];return !!(this.getTextFormat()&e)}getFormatFlags(t,e){return ge(this.getLatest().__textFormat,t,e)}getTextStyle(){return this.getLatest().__textStyle}setTextStyle(t){const e=this.getWritable();return e.__textStyle=t,e}static clone(t){return new Ni(t.__key)}afterCloneFrom(t){super.afterCloneFrom(t),this.__textFormat=t.__textFormat,this.__textStyle=t.__textStyle;}createDOM(t){const e=document.createElement("p"),n=je(t.theme,"paragraph");if(void 0!==n){e.classList.add(...n);}return e}updateDOM(t,e,n){return !1}static importDOM(){return {p:t=>({conversion:Ei,priority:0})}}exportDOM(t){const{element:e}=super.exportDOM(t);if(e&&vn(e)){this.isEmpty()&&e.append(document.createElement("br"));const t=this.getFormatType();e.style.textAlign=t;const n=this.getDirection();n&&(e.dir=n);const r=this.getIndent();r>0&&(e.style.textIndent=20*r+"px");}return {element:e}}static importJSON(t){const e=Pi();return e.setFormat(t.format),e.setIndent(t.indent),e.setDirection(t.direction),e.setTextFormat(t.textFormat),e}exportJSON(){return {...super.exportJSON(),textFormat:this.getTextFormat(),textStyle:this.getTextStyle(),type:"paragraph",version:1}}insertNewAfter(t,e){const n=Pi();n.setTextFormat(t.format),n.setTextStyle(t.style);const r=this.getDirection();return n.setDirection(r),n.setFormat(this.getFormatType()),n.setStyle(this.getTextStyle()),this.insertAfter(n,e),n}collapseAtStart(){const t=this.getChildren();if(0===t.length||ls(t[0])&&""===t[0].getTextContent().trim()){if(null!==this.getNextSibling())return this.selectNext(),this.remove(),!0;if(null!==this.getPreviousSibling())return this.selectPrevious(),this.remove(),!0}return !1}}function Ei(t){const e=Pi();if(t.style){e.setFormat(t.style.textAlign);const n=parseInt(t.style.textIndent,10)/20;n>0&&e.setIndent(n);}return {node:e}}function Pi(){return fn(new Ni)}function Fi(t){return t instanceof Ni}const Di=0;function Mi(t,e,n,r){const s=t._keyToDOMMap;s.clear(),t._editorState=Ci(),t._pendingEditorState=r,t._compositionKey=null,t._dirtyType=it,t._cloneNotNeeded.clear(),t._dirtyLeaves=new Set,t._dirtyElements.clear(),t._normalizedNodes=new Set,t._updateTags=new Set,t._updates=[],t._blockCursorElement=null;const i=t._observer;null!==i&&(i.disconnect(),t._observer=null),null!==e&&(e.textContent=""),null!==n&&(n.textContent="",s.set("root",n));}function Wi(t){const e=t||{},n=ri(),r=e.theme||{},s=void 0===t?n:e.parentEditor||null,i=e.disableEvents||!1,o=Ci(),l=e.namespace||(null!==s?s._config.namespace:Oe()),c=e.editorState,a=[Si,Yr,Rr,as,Ni,wi,...e.nodes||[]],{onError:u,html:f}=e,d=void 0===e.editable||e.editable;let h;if(void 0===t&&null!==n)h=n._nodes;else {h=new Map;for(let t=0;t<a.length;t++){let e=a[t],n=null,r=null;if("function"!=typeof e){const t=e;e=t.replace,n=t.with,r=t.withKlass||null;}const s=e.getType(),i=e.transform(),o=new Set;null!==i&&o.add(i),h.set(s,{exportDOM:f&&f.export?f.export.get(e):void 0,klass:e,replace:n,replaceWithKlass:r,transforms:o});}}const g=new zi(o,s,h,{disableEvents:i,namespace:l,theme:r},u||console.error,function(t,e){const n=new Map,r=new Set,s=t=>{Object.keys(t).forEach((e=>{let r=n.get(e);void 0===r&&(r=[],n.set(e,r)),r.push(t[e]);}));};return t.forEach((t=>{const e=t.klass.importDOM;if(null==e||r.has(e))return;r.add(e);const n=e.call(t.klass);null!==n&&s(n);})),e&&s(e),n}(h,f?f.import:void 0),d);return void 0!==c&&(g._pendingEditorState=c,g._dirtyType=lt),g}class zi{constructor(t,e,n,r,s,i,o){this._parentEditor=e,this._rootElement=null,this._editorState=t,this._pendingEditorState=null,this._compositionKey=null,this._deferred=[],this._keyToDOMMap=new Map,this._updates=[],this._updating=!1,this._listeners={decorator:new Set,editable:new Set,mutation:new Map,root:new Set,textcontent:new Set,update:new Set},this._commands=new Map,this._config=r,this._nodes=n,this._decorators={},this._pendingDecorators=null,this._dirtyType=it,this._cloneNotNeeded=new Set,this._dirtyLeaves=new Set,this._dirtyElements=new Map,this._normalizedNodes=new Set,this._updateTags=new Set,this._observer=null,this._key=Oe(),this._onError=s,this._htmlConversions=i,this._editable=o,this._headless=null!==e&&e._headless,this._window=null,this._blockCursorElement=null;}isComposing(){return null!=this._compositionKey}registerUpdateListener(t){const e=this._listeners.update;return e.add(t),()=>{e.delete(t);}}registerEditableListener(t){const e=this._listeners.editable;return e.add(t),()=>{e.delete(t);}}registerDecoratorListener(t){const e=this._listeners.decorator;return e.add(t),()=>{e.delete(t);}}registerTextContentListener(t){const e=this._listeners.textcontent;return e.add(t),()=>{e.delete(t);}}registerRootListener(t){const e=this._listeners.root;return t(this._rootElement,null),e.add(t),()=>{t(null,this._rootElement),e.delete(t);}}registerCommand(t,e,n){void 0===n&&Rt(35);const r=this._commands;r.has(t)||r.set(t,[new Set,new Set,new Set,new Set,new Set]);const s=r.get(t);void 0===s&&Rt(36,String(t));const i=s[n];return i.add(e),()=>{i.delete(e),s.every((t=>0===t.size))&&r.delete(t);}}registerMutationListener(t,e,n){const r=this.resolveRegisteredNodeAfterReplacements(this.getRegisteredNode(t)).klass,s=this._listeners.mutation;s.set(e,r);const i=n&&n.skipInitialization;return void 0===i||i||this.initializeMutationListener(e,r),()=>{s.delete(e);}}getRegisteredNode(t){const e=this._nodes.get(t.getType());return void 0===e&&Rt(37,t.name),e}resolveRegisteredNodeAfterReplacements(t){for(;t.replaceWithKlass;)t=this.getRegisteredNode(t.replaceWithKlass);return t}initializeMutationListener(t,e){const n=this._editorState,r=Pn(n).get(e.getType());if(!r)return;const s=new Map;for(const t of r.keys())s.set(t,"created");s.size>0&&t(s,{dirtyLeaves:new Set,prevEditorState:n,updateTags:new Set(["registerMutationListener"])});}registerNodeTransformToKlass(t,e){const n=this.getRegisteredNode(t);return n.transforms.add(e),n}registerNodeTransform(t,e){const n=this.registerNodeTransformToKlass(t,e),r=[n],s=n.replaceWithKlass;if(null!=s){const t=this.registerNodeTransformToKlass(s,e);r.push(t);}var i,o;return i=this,o=t.getType(),_i(i,(()=>{const t=ti();if(t.isEmpty())return;if("root"===o)return void we().markDirty();const e=t._nodeMap;for(const[,t]of e)t.markDirty();}),null===i._pendingEditorState?{tag:"history-merge"}:void 0),()=>{r.forEach((t=>t.transforms.delete(e)));}}hasNode(t){return this._nodes.has(t.getType())}hasNodes(t){return t.every(this.hasNode.bind(this))}dispatchCommand(t,e){return Ze(this,t,e)}getDecorators(){return this._decorators}getRootElement(){return this._rootElement}getKey(){return this._key}setRootElement(t){const e=this._rootElement;if(t!==e){const n=je(this._config.theme,"root"),r=this._pendingEditorState||this._editorState;if(this._rootElement=t,Mi(this,e,t,r),null!==e&&(this._config.disableEvents||Wr(e),null!=n&&e.classList.remove(...n)),null!==t){const e=function(t){const e=t.ownerDocument;return e&&e.defaultView||null}(t),r=t.style;r.userSelect="text",r.whiteSpace="pre-wrap",r.wordBreak="break-word",t.setAttribute("data-lexical-editor","true"),this._window=e,this._dirtyType=lt,Yt(this),this._updateTags.add("history-merge"),ui(this),this._config.disableEvents||function(t,e){const n=t.ownerDocument,r=Sr.get(n);(void 0===r||r<1)&&n.addEventListener("selectionchange",Ir),Sr.set(n,(r||0)+1),t.__lexicalEditor=e;const s=Lr(t);for(let n=0;n<pr.length;n++){const[r,i]=pr[n],o="function"==typeof i?t=>{Mr(t)||(Ar(t),(e.isEditable()||"click"===r)&&i(t,e));}:t=>{if(Mr(t))return;Ar(t);const n=e.isEditable();switch(r){case"cut":return n&&Ze(e,W,t);case"copy":return Ze(e,M$2,t);case"paste":return n&&Ze(e,c$2,t);case"dragstart":return n&&Ze(e,O,t);case"dragover":return n&&Ze(e,I,t);case"dragend":return n&&Ze(e,A,t);case"focus":return n&&Ze(e,J,t);case"blur":return n&&Ze(e,U,t);case"drop":return n&&Ze(e,D$1,t)}};t.addEventListener(r,o),s.push((()=>{t.removeEventListener(r,o);}));}}(t,this),null!=n&&t.classList.add(...n);}else this._editorState=r,this._pendingEditorState=null,this._window=null;fi("root",this,!1,t,e);}}getElementByKey(t){return this._keyToDOMMap.get(t)||null}getEditorState(){return this._editorState}setEditorState(t,e){t.isEmpty()&&Rt(38),Xt(this);const n=this._pendingEditorState,r=this._updateTags,s=void 0!==e?e.tag:null;null===n||n.isEmpty()||(null!=s&&r.add(s),ui(this)),this._pendingEditorState=t,this._dirtyType=lt,this._dirtyElements.set("root",!1),this._compositionKey=null,null!=s&&r.add(s),ui(this);}parseEditorState(t,e){return function(t,e,n){const r=Ci(),s=Vs,i=Hs,o=js,l=e._dirtyElements,c=e._dirtyLeaves,a=e._cloneNotNeeded,u=e._dirtyType;e._dirtyElements=new Map,e._dirtyLeaves=new Set,e._cloneNotNeeded=new Set,e._dirtyType=0,Vs=r,Hs=!1,js=e;try{const s=e._nodes;ci(t.root,s),n&&n(),r._readOnly=!0;}catch(t){t instanceof Error&&e._onError(t);}finally{e._dirtyElements=l,e._dirtyLeaves=c,e._cloneNotNeeded=a,e._dirtyType=u,Vs=s,Hs=i,js=o;}return r}("string"==typeof t?JSON.parse(t):t,this,e)}read(t){return ui(this),this.getEditorState().read(t,{editor:this})}update(t,e){_i(this,t,e);}focus(t,e={}){const n=this._rootElement;null!==n&&(n.setAttribute("autocapitalize","off"),_i(this,(()=>{const t=Is(),n=we();null!==t?t.dirty=!0:0!==n.getChildrenSize()&&("rootStart"===e.defaultSelection?n.selectStart():n.selectEnd());}),{onUpdate:()=>{n.removeAttribute("autocapitalize"),t&&t();},tag:"focus"}),null===this._pendingEditorState&&n.removeAttribute("autocapitalize"));}blur(){const t=this._rootElement;null!==t&&t.blur();const e=yn(this._window);null!==e&&e.removeAllRanges();}isEditable(){return this._editable}setEditable(t){this._editable!==t&&(this._editable=t,fi("editable",this,!0,t));}toJSON(){return {editorState:this._editorState.toJSON()}}}zi.version="0.18.0+prod.esm";

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function r$1(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var t$1=r$1((function(e){const n=new URLSearchParams;n.append("code",e);for(let e=1;e<arguments.length;e++)n.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${n} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));const l$2=reactExports.createContext(null);function o$2(e,n){let r=null;return {getTheme:function(){return null!=n?n:null!=r?r.getTheme():null}}}function u$2(){const e=reactExports.useContext(l$2);return null==e&&t$1(8),e}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const s$1="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement,m$4=s$1?reactExports.useLayoutEffect:reactExports.useEffect,u$1={tag:"history-merge"};function p$3({initialConfig:a,children:c}){const p=reactExports.useMemo((()=>{const{theme:t,namespace:c,nodes:l,onError:d,editorState:m,html:p}=a,f=o$2(null,t),E=Wi({editable:a.editable,html:p,namespace:c,nodes:l,onError:e=>d(e,E),theme:t});return function(e,t){if(null===t)return;if(void 0===t)e.update((()=>{const t=we();if(t.isEmpty()){const o=Pi();t.append(o);const n=s$1?document.activeElement:null;(null!==Is()||null!==n&&n===e.getRootElement())&&o.select();}}),u$1);else if(null!==t)switch(typeof t){case"string":{const o=e.parseEditorState(t);e.setEditorState(o,u$1);break}case"object":e.setEditorState(t,u$1);break;case"function":e.update((()=>{we().isEmpty()&&t(e);}),u$1);}}(E,m),[E,f]}),[]);return m$4((()=>{const e=a.editable,[t]=p;t.setEditable(void 0===e||e);}),[]),jsxRuntimeExports.jsx(l$2.Provider,{value:p,children:c})}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function s(){return we().getTextContent()}function u(t,e=!0){if(t)return !1;let n=s();return e&&(n=n.trim()),""===n}function c$1(o){if(!u(o,!1))return !1;const l=we().getChildren(),s=l.length;if(s>1)return !1;for(let t=0;t<s;t++){const o=l[t];if(vi(o))return !1;if(yi(o)){if(!Fi(o))return !1;if(0!==o.__indent)return !1;const e=o.getChildren(),n=e.length;for(let r=0;r<n;r++){const n=e[t];if(!ls(n))return !1}}}return !0}function g$3(t){return ()=>c$1(t)}function d$1(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var x$2=d$1((function(t){const e=new URLSearchParams;e.append("code",t);for(let t=1;t<arguments.length;t++)e.append("v",arguments[t]);throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));function T(t,e,n,r){const s=t=>t instanceof n,u=t=>{const e=os(t.getTextContent());e.setFormat(t.getFormat()),t.replace(e);};return [t.registerNodeTransform(Yr,(t=>{if(!t.isSimpleText())return;let n,o=t.getPreviousSibling(),l=t.getTextContent(),f=t;if(ls(o)){const n=o.getTextContent(),r=e(n+l);if(s(o)){if(null===r||0!==(t=>t.getLatest().__mode)(o))return void u(o);{const e=r.end-n.length;if(e>0){const r=n+l.slice(0,e);if(o.select(),o.setTextContent(r),e===l.length)t.remove();else {const n=l.slice(e);t.setTextContent(n);}return}}}else if(null===r||r.start<n.length)return}let c=0;for(;;){n=e(l);let t,g=null===n?"":l.slice(n.end);if(l=g,""===g){const t=f.getNextSibling();if(ls(t)){g=f.getTextContent()+t.getTextContent();const n=e(g);if(null===n)return void(s(t)?u(t):t.markDirty());if(0!==n.start)return}}if(null===n)return;if(0===n.start&&ls(o)&&o.isTextEntity()){c+=n.end;continue}0===n.start?[t,f]=f.splitText(n.end):[,t,f]=f.splitText(n.start+c,n.end+c),void 0===t&&x$2(165,"nodeToReplace");const a=r(t);if(a.setFormat(t.getFormat()),t.replace(a),null==f)return;c=0,o=a;}})),t.registerNodeTransform(n,(t=>{const n=t.getTextContent(),r=e(n);if(null===r||0!==r.start)return void u(t);if(n.length>r.end)return void t.splitText(r.end);const o=t.getPreviousSibling();ls(o)&&o.isTextEntity()&&(u(o),u(t));const l=t.getNextSibling();ls(l)&&l.isTextEntity()&&(u(l),s(t)&&u(t));}))]}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function m$3(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}m$3((function(e){const t=new URLSearchParams;t.append("code",e);for(let e=1;e<arguments.length;e++)t.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${t} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));function L$1(e,t){const l=Xe(e.focus,t);return vi(l)&&!l.isIsolated()||yi(l)&&!l.isInline()&&!l.canBeEmpty()}function D(e,t,n,l){e.modify(t?"extend":"move",n,l);}function M$1(e){const t=e.anchor.getNode();return "rtl"===(Ti(t)?t:t.getParentOrThrow()).getDirection()}function $$1(e,t,n){const l=M$1(e);D(e,t,n?!l:l,"character");}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function g$2(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}g$2((function(e){const t=new URLSearchParams;t.append("code",e);for(let e=1;e<arguments.length;e++)t.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${t} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));const h$2="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement,m$2=h$2&&"documentMode"in document?document.documentMode:null;!(!h$2||!("InputEvent"in window)||m$2)&&"getTargetRanges"in new window.InputEvent("input");function b$1(...e){const t=[];for(const n of e)if(n&&"string"==typeof n)for(const[e]of n.matchAll(/\S+/g))t.push(e);return t}function L(...e){return ()=>{for(let t=e.length-1;t>=0;t--)e[t]();e.length=0;}}function $(e,...t){const n=b$1(...t);n.length>0&&e.classList.add(...n);}const te=(e,t)=>{let n=e;for(;n!==we()&&null!=n;){if(t(n))return n;n=n.getParent();}return null};

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const m$1="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement?reactExports.useLayoutEffect:reactExports.useEffect;function f$2({editor:e,ariaActiveDescendant:t,ariaAutoComplete:i,ariaControls:a,ariaDescribedBy:d,ariaExpanded:c,ariaLabel:s,ariaLabelledBy:u,ariaMultiline:f,ariaOwns:b,ariaRequired:p,autoCapitalize:x,className:E,id:v,role:w="textbox",spellCheck:y=!0,style:C,tabIndex:h,"data-testid":L,...g},D){const[R,k]=reactExports.useState(e.isEditable()),q=reactExports.useCallback((t=>{t&&t.ownerDocument&&t.ownerDocument.defaultView?e.setRootElement(t):e.setRootElement(null);}),[e]),z=reactExports.useMemo((()=>function(...e){return t=>{e.forEach((e=>{"function"==typeof e?e(t):null!=e&&(e.current=t);}));}}(D,q)),[q,D]);return m$1((()=>(k(e.isEditable()),e.registerEditableListener((e=>{k(e);})))),[e]),jsxRuntimeExports.jsx("div",{...g,"aria-activedescendant":R?t:void 0,"aria-autocomplete":R?i:"none","aria-controls":R?a:void 0,"aria-describedby":d,"aria-expanded":R&&"combobox"===w?!!c:void 0,"aria-label":s,"aria-labelledby":u,"aria-multiline":f,"aria-owns":R?b:void 0,"aria-readonly":!R||void 0,"aria-required":p,autoCapitalize:x,className:E,contentEditable:R,"data-testid":L,id:v,ref:z,role:R?w:void 0,spellCheck:y,style:C,tabIndex:h})}const b=reactExports.forwardRef(f$2);function p$2(e){return e.getEditorState().read(g$3(e.isComposing()))}const x$1=reactExports.forwardRef(E);function E(t,i){const{placeholder:a,...r}=t,[n]=u$2();return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(b,{editor:n,...r,ref:i}),null!=a&&jsxRuntimeExports.jsx(v,{editor:n,content:a})]})}function v({content:e,editor:i}){const a=function(e){const[t,i]=reactExports.useState((()=>p$2(e)));return m$1((()=>{function t(){const t=p$2(e);i(t);}return t(),L(e.registerUpdateListener((()=>{t();})),e.registerEditableListener((()=>{t();})))}),[e]),t}(i),[n,o]=reactExports.useState(i.isEditable());if(reactExports.useLayoutEffect((()=>(o(i.isEditable()),i.registerEditableListener((e=>{o(e);})))),[i]),!a)return null;let d=null;return "function"==typeof e?d=e(n):null!==e&&(d=e),null===d?null:jsxRuntimeExports.jsx("div",{"aria-hidden":!0,children:d})}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const i$2=new Set(["mouseenter","mouseleave"]);function l$1({nodeType:l,eventType:s,eventListener:c}){const[u]=u$2(),a=reactExports.useRef(c);return a.current=c,reactExports.useEffect((()=>{const e=i$2.has(s),r=r=>{u.update((()=>{const o=Ce(r.target);if(null!==o){const n=e?o instanceof l?o:null:te(o,(e=>e instanceof l));if(null!==n)return void a.current(r,u,n.getKey())}}));};return u.registerRootListener(((t,n)=>{t&&t.addEventListener(s,r,e),n&&n.removeEventListener(s,r,e);}))}),[u,l]),null}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const l=0,f$1=1,p$1=2,h$1=0,m=1,g$1=2,_$1=3,S=4;function y(t,e,n,r,o){if(null===t||0===n.size&&0===r.size&&!o)return h$1;const i=e._selection,s=t._selection;if(o)return m;if(!(ms(i)&&ms(s)&&s.isCollapsed()&&i.isCollapsed()))return h$1;const c=function(t,e,n){const r=t._nodeMap,o=[];for(const t of e){const e=r.get(t);void 0!==e&&o.push(e);}for(const[t,e]of n){if(!e)continue;const n=r.get(t);void 0===n||Ti(n)||o.push(n);}return o}(e,n,r);if(0===c.length)return h$1;if(c.length>1){const n=e._nodeMap,r=n.get(i.anchor.key),o=n.get(s.anchor.key);return r&&o&&!t._nodeMap.has(r.__key)&&ls(r)&&1===r.__text.length&&1===i.anchor.offset?g$1:h$1}const l=c[0],f=t._nodeMap.get(l.__key);if(!ls(f)||!ls(l)||f.__mode!==l.__mode)return h$1;const p=f.__text,y=l.__text;if(p===y)return h$1;const k=i.anchor,C=s.anchor;if(k.key!==C.key||"text"!==k.type)return h$1;const x=k.offset,M=C.offset,z=y.length-p.length;return 1===z&&M===x-1?g$1:-1===z&&M===x+1?_$1:-1===z&&M===x?S:h$1}function k(t,e){let n=Date.now(),r=h$1;return (o,i,s,c,d,m)=>{const g=Date.now();if(m.has("historic"))return r=h$1,n=g,p$1;const _=y(o,i,c,d,t.isComposing()),S=(()=>{const S=null===s||s.editor===t,y=m.has("history-push");if(!y&&S&&m.has("history-merge"))return l;if(null===o)return f$1;const k=i._selection;if(!(c.size>0||d.size>0))return null!==k?l:p$1;if(!1===y&&_!==h$1&&_===r&&g<n+e&&S)return l;if(1===c.size){if(function(t,e,n){const r=e._nodeMap.get(t),o=n._nodeMap.get(t),i=e._selection,s=n._selection;return !(ms(i)&&ms(s)&&"element"===i.anchor.type&&"element"===i.focus.type&&"text"===s.anchor.type&&"text"===s.focus.type||!ls(r)||!ls(o)||r.__parent!==o.__parent)&&JSON.stringify(e.read((()=>r.exportJSON())))===JSON.stringify(n.read((()=>o.exportJSON())))}(Array.from(c)[0],o,i))return l}return f$1})();return n=g,r=_,S}}function C(t){t.undoStack=[],t.redoStack=[],t.current=null;}function x(a,u,d){const l=k(a,d),h=L(a.registerCommand(h$3,(()=>(function(t,e){const n=e.redoStack,r=e.undoStack;if(0!==r.length){const o=e.current,i=r.pop();null!==o&&(n.push(o),t.dispatchCommand(K,!0)),0===r.length&&t.dispatchCommand($$2,!1),e.current=i||null,i&&i.editor.setEditorState(i.editorState,{tag:"historic"});}}(a,u),!0)),Di),a.registerCommand(g$4,(()=>(function(t,e){const n=e.redoStack,r=e.undoStack;if(0!==n.length){const o=e.current;null!==o&&(r.push(o),t.dispatchCommand($$2,!0));const i=n.pop();0===n.length&&t.dispatchCommand(K,!1),e.current=i||null,i&&i.editor.setEditorState(i.editorState,{tag:"historic"});}}(a,u),!0)),Di),a.registerCommand(B,(()=>(C(u),!1)),Di),a.registerCommand(R,(()=>(C(u),a.dispatchCommand(K,!1),a.dispatchCommand($$2,!1),!0)),Di),a.registerUpdateListener((({editorState:t,prevEditorState:e,dirtyLeaves:n,dirtyElements:r,tags:o})=>{const i=u.current,d=u.redoStack,h=u.undoStack,m=null===i?null:i.editorState;if(null!==i&&t===m)return;const g=l(e,t,i,n,r,o);if(g===f$1)0!==d.length&&(u.redoStack=[],a.dispatchCommand(K,!1)),null!==i&&(h.push({...i}),a.dispatchCommand($$2,!0));else if(g===p$1)return;u.current={editor:a,editorState:t};})));return h}function M(){return {current:null,redoStack:[],undoStack:[]}}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function a$2({delay:a,externalHistoryState:c}){const[l]=u$2();return function(t,a,c=1e3){const l=reactExports.useMemo((()=>a||M()),[a]);reactExports.useEffect((()=>x(t,l,c)),[c,t,l]);}(l,c,a),null}

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

function t(r,e){return t=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,e){return r.__proto__=e,r},t(r,e)}var o$1={error:null},n=function(e){var n,a;function s(){for(var r,t=arguments.length,n=new Array(t),a=0;a<t;a++)n[a]=arguments[a];return (r=e.call.apply(e,[this].concat(n))||this).state=o$1,r.resetErrorBoundary=function(){for(var e,t=arguments.length,o=new Array(t),n=0;n<t;n++)o[n]=arguments[n];null==r.props.onReset||(e=r.props).onReset.apply(e,o),r.reset();},r}a=e,(n=s).prototype=Object.create(a.prototype),n.prototype.constructor=n,t(n,a),s.getDerivedStateFromError=function(r){return {error:r}};var l=s.prototype;return l.reset=function(){this.setState(o$1);},l.componentDidCatch=function(r,e){var t,o;null==(t=(o=this.props).onError)||t.call(o,r,e);},l.componentDidUpdate=function(r,e){var t,o,n,a,s=this.state.error,l=this.props.resetKeys;null!==s&&null!==e.error&&(void 0===(n=r.resetKeys)&&(n=[]),void 0===(a=l)&&(a=[]),n.length!==a.length||n.some((function(r,e){return !Object.is(r,a[e])})))&&(null==(t=(o=this.props).onResetKeysChange)||t.call(o,r.resetKeys,l),this.reset());},l.render=function(){var e=this.state.error,t=this.props,o=t.fallbackRender,n=t.FallbackComponent,a=t.fallback;if(null!==e){var s={error:e,resetErrorBoundary:this.resetErrorBoundary};if(reactExports.isValidElement(a))return a;if("function"==typeof o)return o(s);if(n)return reactExports.createElement(n,s);throw new Error("react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop")}return this.props.children},s}(reactExports.Component);function a$1({children:r,onError:t}){return jsxRuntimeExports.jsx(n,{fallback:jsxRuntimeExports.jsx("div",{style:{border:"1px solid #f00",color:"#f00",padding:"8px"},children:"An error was thrown."}),onError:t,children:r})}

var ElementNodeType = /* @__PURE__ */ ((ElementNodeType2) => {
  ElementNodeType2["CODE"] = "code";
  ElementNodeType2["PARAGRAPH"] = "paragraph";
  ElementNodeType2["QUOTE"] = "quote";
  ElementNodeType2["HEADING"] = "heading";
  ElementNodeType2["LIST_ITEM"] = "list-item";
  ElementNodeType2["KEY_VALUE_NODE"] = "key-value";
  return ElementNodeType2;
})(ElementNodeType || {});

class HeadingNode extends Ni {
  static getType() {
    return ElementNodeType.HEADING;
  }
  static clone(node) {
    return new HeadingNode(node.__key);
  }
  constructor(key) {
    super(key);
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
  return fn(new HeadingNode());
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const o=new Set(["http:","https:","mailto:","sms:","tel:"]);class a extends pi{static getType(){return "link"}static clone(t){return new a(t.__url,{rel:t.__rel,target:t.__target,title:t.__title},t.__key)}constructor(t,e={},r){super(r);const{target:i=null,rel:n=null,title:l=null}=e;this.__url=t,this.__target=i,this.__rel=n,this.__title=l;}createDOM(e){const r=document.createElement("a");return r.href=this.sanitizeUrl(this.__url),null!==this.__target&&(r.target=this.__target),null!==this.__rel&&(r.rel=this.__rel),null!==this.__title&&(r.title=this.__title),$(r,e.theme.link),r}updateDOM(t,e,r){if(e instanceof HTMLAnchorElement){const r=this.__url,i=this.__target,n=this.__rel,l=this.__title;r!==t.__url&&(e.href=r),i!==t.__target&&(i?e.target=i:e.removeAttribute("target")),n!==t.__rel&&(n?e.rel=n:e.removeAttribute("rel")),l!==t.__title&&(l?e.title=l:e.removeAttribute("title"));}return !1}static importDOM(){return {a:t=>({conversion:h,priority:1})}}static importJSON(t){const e=c(t.url,{rel:t.rel,target:t.target,title:t.title});return e.setFormat(t.format),e.setIndent(t.indent),e.setDirection(t.direction),e}sanitizeUrl(t){try{const e=new URL(t);if(!o.has(e.protocol))return "about:blank"}catch(e){return t}return t}exportJSON(){return {...super.exportJSON(),rel:this.getRel(),target:this.getTarget(),title:this.getTitle(),type:"link",url:this.getURL(),version:1}}getURL(){return this.getLatest().__url}setURL(t){this.getWritable().__url=t;}getTarget(){return this.getLatest().__target}setTarget(t){this.getWritable().__target=t;}getRel(){return this.getLatest().__rel}setRel(t){this.getWritable().__rel=t;}getTitle(){return this.getLatest().__title}setTitle(t){this.getWritable().__title=t;}insertNewAfter(t,e=!0){const r=c(this.__url,{rel:this.__rel,target:this.__target,title:this.__title});return this.insertAfter(r,e),r}canInsertTextBefore(){return !1}canInsertTextAfter(){return !1}canBeEmpty(){return !1}isInline(){return !0}extractWithChild(t,e,r){if(!ms(e))return !1;const i=e.anchor.getNode(),n=e.focus.getNode();return this.isParentOf(i)&&this.isParentOf(n)&&e.getTextContent().length>0}isEmailURI(){return this.__url.startsWith("mailto:")}isWebSiteURI(){return this.__url.startsWith("https://")||this.__url.startsWith("http://")}}function h(t){let r=null;if(xn(t)){const e=t.textContent;(null!==e&&""!==e||t.children.length>0)&&(r=c(t.getAttribute("href")||"",{rel:t.getAttribute("rel"),target:t.getAttribute("target"),title:t.getAttribute("title")}));}return {node:r}}function c(t,e){return fn(new a(t,e))}function g(t){return t instanceof a}class f extends a{constructor(t,e={},r){super(t,e,r),this.__isUnlinked=void 0!==e.isUnlinked&&null!==e.isUnlinked&&e.isUnlinked;}static getType(){return "autolink"}static clone(t){return new f(t.__url,{isUnlinked:t.__isUnlinked,rel:t.__rel,target:t.__target,title:t.__title},t.__key)}getIsUnlinked(){return this.__isUnlinked}setIsUnlinked(t){const e=this.getWritable();return e.__isUnlinked=t,e}createDOM(t){return this.__isUnlinked?document.createElement("span"):super.createDOM(t)}updateDOM(t,e,r){return super.updateDOM(t,e,r)||t.__isUnlinked!==this.__isUnlinked}static importJSON(t){const e=d(t.url,{isUnlinked:t.isUnlinked,rel:t.rel,target:t.target,title:t.title});return e.setFormat(t.format),e.setIndent(t.indent),e.setDirection(t.direction),e}static importDOM(){return null}exportJSON(){return {...super.exportJSON(),isUnlinked:this.__isUnlinked,type:"autolink",version:1}}insertNewAfter(t,e=!0){const r=this.getParentOrThrow().insertNewAfter(t,e);if(yi(r)){const t=d(this.__url,{isUnlinked:this.__isUnlinked,rel:this.__rel,target:this.__target,title:this.__title});return r.append(t),t}return null}}function d(t,e){return fn(new f(t,e))}function p(t){return t instanceof f}

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
class TransclusionNode extends xi {
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
  if (yi(previousNode)) {
    previousNode = previousNode.getLastDescendant();
  }
  return previousNode === null || Jr(previousNode) || ls(previousNode) && endsWithSeparator(previousNode.getTextContent());
}
function isNextNodeValid(node) {
  let nextNode = node.getNextSibling();
  if (yi(nextNode)) {
    nextNode = nextNode.getFirstDescendant();
  }
  return nextNode === null || Jr(nextNode) || ls(nextNode) && startsWithSeparator(nextNode.getTextContent()) || $isTransclusionNode(nextNode);
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
      const linkNode = d(match.url, match.attributes);
      const textNode = os(match.text);
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
    if (!ls(child) || !child.isSimpleText()) {
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
    if (!editor.hasNodes([f])) {
      throw new Error(
        "LexicalAutoLinkPlugin: AutoLinkNode not registered on editor"
      );
    }
    const onChangeWrapped = (url, prevUrl) => {
      if (onChange) {
        onChange(url, prevUrl);
      }
    };
    return L(
      editor.registerNodeTransform(Yr, (textNode) => {
        const parent = textNode.getParentOrThrow();
        const previous = textNode.getPreviousSibling();
        if (p(parent)) {
          handleLinkEdit(parent, matchers, onChangeWrapped);
        } else if (!g(parent)) {
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
      editor.registerNodeTransform(Ni, (paragraphNode) => {
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

const URL_REGEX = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}(\.[a-zA-Z0-9()]{1,13})?\b([-a-zA-Z0-9()@:%_+.~#!?&//=,;'{}[\]]*)/;
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

class WikiLinkContentNode extends Yr {
  constructor(text, getLinkAvailability, key) {
    super(text, key);
    this.getLinkAvailability = getLinkAvailability;
  }
  static getType() {
    return "wikiLinkContent";
  }
  static clone(node) {
    return new WikiLinkContentNode(
      node.__text,
      node.getLinkAvailability,
      node.__key
    );
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
  return fn(
    new WikiLinkContentNode(text, getLinkAvailability)
  );
}
function $isWikiLinkContentNode(node) {
  return node instanceof WikiLinkContentNode;
}

class WikiLinkPunctuationNode extends Yr {
  static getType() {
    return "wikiLinkPunctuation";
  }
  static clone(node) {
    return new WikiLinkPunctuationNode(node.__isClosing, node.__key);
  }
  __isClosing = false;
  constructor(isClosing, key) {
    super(isClosing ? "]]" : "[[", key);
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
  return fn(new WikiLinkPunctuationNode(isClosing));
}
function $isWikiLinkPunctuationNode(node) {
  return node instanceof WikiLinkPunctuationNode;
}

class KeyValuePairKeyNode extends Yr {
  static getType() {
    return "keyValuePairKey";
  }
  static clone(node) {
    return new KeyValuePairKeyNode(node.__text, node.__key);
  }
  constructor(text, key) {
    super(text, key);
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
  return fn(
    new KeyValuePairKeyNode(text)
  );
}
function $isKeyValuePairKeyNode(node) {
  return node instanceof KeyValuePairKeyNode;
}

class CodeBlockNode extends Ni {
  static getType() {
    return ElementNodeType.CODE;
  }
  static clone(node) {
    return new CodeBlockNode(node.__key);
  }
  constructor(key) {
    super(key);
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
  return fn(new CodeBlockNode());
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
    const textNode = os(node.getTextContent());
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
      const selection = Is();
      let selectionOffset = NaN;
      if (ms(selection) && selection.focus.key === nodeToReplace.getKey()) {
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
      if ($isWikiLinkPunctuationNode(prevSibling)) {
        replaceWithSimpleText(prevSibling);
      }
      if ($isWikiLinkPunctuationNode(nextSibling)) {
        replaceWithSimpleText(nextSibling);
      }
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
    Yr,
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
    return L(
      ...registerWikilinkTransforms(
        editor,
        getLinkAvailability
      )
    );
  }, [editor]);
  return null;
}

class BoldNode extends Yr {
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
  return fn(new BoldNode(text));
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function i(i,m,c){const[l]=u$2();reactExports.useEffect((()=>L(...T(l,i,m,c))),[c,l,i,m]);}

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
  const selection = Is();
  let cursor = node;
  let startOffset = 0;
  let endOffset;
  node.getTextContent().split("\n").forEach((line, i) => {
    const paragraphNode = Pi();
    const textNode = os(line);
    paragraphNode.append(textNode);
    cursor.insertAfter(paragraphNode);
    cursor = paragraphNode;
    endOffset = startOffset + line.length;
    if (ms(selection) && selection.focus.offset >= startOffset && selection.focus.offset <= endOffset) {
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

class ListItemNode extends Ni {
  static getType() {
    return ElementNodeType.LIST_ITEM;
  }
  static clone(node) {
    return new ListItemNode(node.__key);
  }
  constructor(key) {
    super(key);
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
  return fn(new ListItemNode());
}

const registerBlockNodeTransform = (editor, getTransclusionContent) => {
  editor.registerNodeTransform(Ni, (node) => {
    refreshTransclusionsForBlock(node, getTransclusionContent);
  });
  editor.registerNodeTransform(ListItemNode, (node) => {
    refreshTransclusionsForBlock(node, getTransclusionContent);
  });
  editor.registerNodeTransform(HeadingNode, (node) => {
    refreshTransclusionsForBlock(node, getTransclusionContent);
  });
  editor.registerNodeTransform(f, (node) => {
    let currentNode = node.getParent();
    while (currentNode && !Fi(currentNode)) {
      currentNode = currentNode.getParent();
    }
    if (currentNode) {
      refreshTransclusionsForBlock(currentNode, getTransclusionContent);
    }
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

function w(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}w((function(t){const e=new URLSearchParams;e.append("code",t);for(let t=1;t<arguments.length;t++)e.append("v",arguments[t]);throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));function _(t,e){const n=t.getData("text/plain")||t.getData("text/uri-list");null!=n&&e.insertRawText(n);}

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
    const selection = Is();
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
      const selection = Is();
      const clipboardData = event instanceof InputEvent || event instanceof KeyboardEvent ? null : event.clipboardData;
      if (clipboardData !== null && ms(selection)) {
        _(clipboardData, selection);
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
    const selection = Is();
    if (ms(selection)) {
      selection.removeText();
    }
  });
}
function registerSubtext(editor) {
  const removeListener = L(
    editor.registerCommand(
      s$2,
      (isBackward) => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        selection.deleteCharacter(isBackward);
        return true;
      },
      Di
    ),
    editor.registerCommand(
      u$3,
      (isBackward) => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        selection.deleteWord(isBackward);
        return true;
      },
      Di
    ),
    editor.registerCommand(
      f$3,
      (isBackward) => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        selection.deleteLine(isBackward);
        return true;
      },
      Di
    ),
    editor.registerCommand(
      l$3,
      (eventOrText) => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        if (typeof eventOrText === "string") {
          selection.insertText(eventOrText);
        } else {
          const dataTransfer = eventOrText.dataTransfer;
          if (dataTransfer !== null) {
            _(dataTransfer, selection);
          } else {
            const data = eventOrText.data;
            if (data) {
              selection.insertText(data);
            }
          }
        }
        return true;
      },
      Di
    ),
    editor.registerCommand(
      a$3,
      () => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        selection.removeText();
        return true;
      },
      Di
    ),
    editor.registerCommand(
      i$3,
      () => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        selection.insertParagraph();
        return true;
      },
      Di
    ),
    editor.registerCommand(
      z,
      () => {
        Ve();
        return true;
      },
      Di
    ),
    editor.registerCommand(
      o$3,
      () => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        selection.insertParagraph();
        return true;
      },
      Di
    ),
    editor.registerCommand(
      m$5,
      (payload) => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        const event = payload;
        const isHoldingShift = event.shiftKey;
        if (L$1(selection, true)) {
          event.preventDefault();
          $$1(selection, isHoldingShift, true);
          return true;
        }
        return false;
      },
      Di
    ),
    editor.registerCommand(
      p$4,
      (payload) => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        const event = payload;
        const isHoldingShift = event.shiftKey;
        if (L$1(selection, false)) {
          event.preventDefault();
          $$1(selection, isHoldingShift, false);
          return true;
        }
        return false;
      },
      Di
    ),
    editor.registerCommand(
      k$1,
      (event) => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        event.preventDefault();
        return editor.dispatchCommand(s$2, true);
      },
      Di
    ),
    editor.registerCommand(
      w$1,
      (event) => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        event.preventDefault();
        return editor.dispatchCommand(s$2, false);
      },
      Di
    ),
    editor.registerCommand(
      T$1,
      (event) => {
        const selection = Is();
        if (!ms(selection)) {
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
      Di
    ),
    editor.registerCommand(
      M$2,
      (event) => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        onCopyForPlainText(event, editor);
        return true;
      },
      Di
    ),
    editor.registerCommand(
      W,
      (event) => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        onCutForPlainText(event, editor);
        return true;
      },
      Di
    ),
    editor.registerCommand(
      c$2,
      (event) => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        onPasteForPlainText(event, editor);
        return true;
      },
      Di
    ),
    editor.registerCommand(
      D$1,
      (event) => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        event.preventDefault();
        return true;
      },
      Di
    ),
    editor.registerCommand(
      O,
      (event) => {
        const selection = Is();
        if (!ms(selection)) {
          return false;
        }
        event.preventDefault();
        return true;
      },
      Di
    )
  );
  return removeListener;
}

function useSubtextSetup(editor) {
  reactExports.useLayoutEffect(() => {
    return L(
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

class InlineCodeNode extends Yr {
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
  return fn(new InlineCodeNode(text));
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

class QuoteBlockNode extends Ni {
  static getType() {
    return ElementNodeType.QUOTE;
  }
  static clone(node) {
    return new QuoteBlockNode(node.__key);
  }
  constructor(key) {
    super(key);
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
  return fn(new QuoteBlockNode());
}

class KeyValueNode extends Ni {
  static getType() {
    return ElementNodeType.KEY_VALUE_NODE;
  }
  static clone(node) {
    return new KeyValueNode(node.__key);
  }
  constructor(key) {
    super(key);
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
  return fn(new KeyValueNode());
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
        elementNode.replace(Pi(), true);
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
    editor.registerNodeTransform(Si, (root) => {
      assignCorrectElementNodes(root.getChildren());
      xe(null);
    });
    editor.registerNodeTransform(Rr, (node) => {
      const element = node.getParent();
      if (Ti(element)) {
        return;
      }
      const prevSiblings = node.getPreviousSiblings();
      const nextSiblings = node.getNextSiblings();
      const n1 = Pi();
      n1.append(...prevSiblings);
      const n2 = Pi();
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
    const blockNode = Pi();
    const textNode = os(blockText);
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
      const root = we();
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
    const textNode = os(node.getTextContent());
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
      const selection = Is();
      let selectionOffset = NaN;
      if (ms(selection) && selection.focus.key === rightNode.getKey()) {
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
    Yr,
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
    return L(
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(x$1, {}),
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
        const root = we();
        onChange(getSubtextFromEditor(root));
      });
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(a$2, {}),
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
        nodeType: f,
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
      f,
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(p$3, { initialConfig, children });
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
              const fileType = getMediaTypeFromFilename(file.filename);
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
    getObjectUrlForArbitraryGraphFile(file).then((url2) => {
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
    getObjectUrlForArbitraryGraphFile(file).then((url2) => {
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
    getObjectUrlForArbitraryGraphFile(file).then((url2) => {
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
    getObjectUrlForArbitraryGraphFile(file).then((url) => {
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
  let file;
  try {
    file = await notesProvider.getFileInfo(slug);
  } catch (_e) {
    file = null;
  }
  if (file) {
    const mediaType = getMediaTypeFromFilename(file.filename);
    if (mediaType === MediaType.AUDIO) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockAudio,
        {
          file,
          notesProvider
        },
        file.slug
      );
    } else if (mediaType === MediaType.VIDEO) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockVideo,
        {
          file,
          notesProvider
        },
        file.slug
      );
    } else if (mediaType === MediaType.IMAGE) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockImage,
        {
          file,
          notesProvider
        },
        file.slug
      );
    } else if (mediaType === MediaType.TEXT) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockTextFile,
        {
          file,
          notesProvider
        },
        file.slug
      );
    } else {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        NoteContentBlockDocument,
        {
          file
        },
        file.slug
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
    const selection = Is();
    if (ms(selection)) {
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
    const selection = Is();
    if (ms(selection)) {
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
    const selection = Is();
    if (ms(selection)) {
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
    } catch (_e) {
      try {
        await notesProvider.get(slug);
        return true;
      } catch (_e2) {
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
                  } catch (_e) {
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
    if (!pageProp && value) {
      setPageState(value);
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
  numberOfResults
}) => {
  let label = "";
  if (numberOfResults) {
    if (searchValue === "") {
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
      if (container) {
        setScrollTop(container.scrollTop);
      }
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
            numberOfResults
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

const useRunOnce = (fn) => {
  const hasRun = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!hasRun.current) {
      fn();
      hasRun.current = true;
    }
  }, []);
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
    await controlledNoteList.refresh();
    await refreshPinnedNotes();
    requestIdleCallback(async () => {
      await refreshHeaderStats();
    });
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
  useRunOnce(() => {
    refreshContentViews();
    if (getValidNoteSlug(slug) === null) {
      goToNote("new", {
        contentIfNewNote: location.state?.contentIfNewNote || ""
      });
      setCanonicalNewNotePath();
    }
  });
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
  const [headerStats, refreshHeaderStats] = useHeaderStats(
    notesProvider
  );
  const {
    pinnedNotes,
    refreshPinnedNotes,
    move
  } = usePinnedNotes(notesProvider);
  reactExports.useEffect(() => {
    refreshPinnedNotes();
    requestIdleCallback(async () => {
      await refreshHeaderStats();
    });
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
  const type = getMediaTypeFromFilename(file.filename) || "unknown";
  const isNenoScript = file.slug.endsWith(NENO_SCRIPT_FILE_SUFFIX);
  const [thumbnailImageSrc, setThumbnailImageSrc] = reactExports.useState(null);
  reactExports.useEffect(() => {
    getObjectUrlForArbitraryGraphFile(file).then((src) => {
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
          disabled: existingFiles.map((s) => s.slug).includes(newSlug) || !isValidSlug(newSlug) || newScriptName.length === 0,
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
    const slugsOfDanglingFiles = await notesProvider.getSlugsOfDanglingFiles();
    setDanglingFileSlugs(slugsOfDanglingFiles);
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

const FileView = () => {
  const notesProvider = useNotesProvider();
  const [fileInfo, setFileInfo] = reactExports.useState(null);
  const [objectUrl, setObjectUrl] = reactExports.useState(null);
  const [notes, setNotes] = reactExports.useState(null);
  const [text, setText] = reactExports.useState("");
  const { slug } = useParams();
  const [slugRenameInput, setSlugRenameInput] = reactExports.useState(
    slug ? removeExtensionFromFilename(slug) : ""
  );
  const extension = fileInfo ? getExtensionFromFilename(fileInfo.filename) : "";
  const potentialNewSlug = slugRenameInput + (typeof extension === "string" ? `.${extension}` : "");
  const [updateReferences, setUpdateReferences] = reactExports.useState(true);
  const navigate = useNavigate();
  const type = fileInfo ? getMediaTypeFromFilename(fileInfo.filename) : null;
  const confirm = useConfirm();
  const canShowTextPreview = type === MediaType.TEXT;
  const isNenoScript = slug?.endsWith(NENO_SCRIPT_FILE_SUFFIX) ?? false;
  reactExports.useEffect(() => {
    if (typeof slug !== "string") return;
    const getFileInfo = async () => {
      const fileInfo2 = await notesProvider.getFileInfo(slug);
      setFileInfo(fileInfo2);
      const objectUrl2 = await getObjectUrlForArbitraryGraphFile(fileInfo2);
      setObjectUrl(objectUrl2);
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
  reactExports.useEffect(() => {
    if (canShowTextPreview && typeof objectUrl === "string") {
      fetch(objectUrl).then((response) => response.text()).then((text2) => setText(text2));
    }
  }, [objectUrl, canShowTextPreview]);
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
      canShowPreview && type && objectUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        FileViewPreview,
        {
          type,
          src: objectUrl,
          text
        }
      ) : "",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        fileInfo ? humanFileSize(fileInfo.size) : "",
        fileInfo?.createdAt ? SPAN_SEPARATOR : "",
        fileInfo?.createdAt ? l$4("stats.metadata.created-at") + ": " + ISOTimestampToLocaleString(fileInfo.createdAt) : ""
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
                  // they are used to create a full letter with modifier via a
                  // composition session. They are not valid slug characters on
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
            disabled: slugRenameInput === removeExtensionFromFilename(slug ?? "") || !isValidSlug(potentialNewSlug),
            className: "default-button-small dangerous-action",
            onClick: async () => {
              if (!slug || slugRenameInput === slug || !isValidSlug(potentialNewSlug)) return;
              const newFileInfo = await notesProvider.renameFileSlug(
                slug,
                potentialNewSlug,
                updateReferences
              );
              const objectUrl2 = await getObjectUrlForArbitraryGraphFile(
                newFileInfo
              );
              setFileInfo(newFileInfo);
              setObjectUrl(objectUrl2);
              navigate(getAppPath(
                PathTemplate.FILE,
                /* @__PURE__ */ new Map([
                  ["GRAPH_ID", LOCAL_GRAPH_ID],
                  ["FILE_SLUG", potentialNewSlug]
                ])
              ), {
                replace: true
              });
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

const noteWorkerUrl = "/neno/assets/index-C4o_i9B0.js";

function WorkerWrapper(options) {
          return new Worker(
            "/neno/assets/ts.worker-Ch6tm_1p.js",
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
      const readable = await notesProvider.getReadableArbitraryGraphFileStream(
        slug
      );
      const value = await new Response(readable).text();
      setActiveScript({
        slug,
        value
      });
      setScriptInput(value);
    } catch (_e) {
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
    __vitePreload(() => import('./editor.main-DMJQtP5i.js').then(n => n.e),true?__vite__mapDeps([0,1]):void 0).then((module) => {
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
