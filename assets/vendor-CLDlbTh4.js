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
var l$6=Symbol.for("react.element"),n$4=Symbol.for("react.portal"),p$6=Symbol.for("react.fragment"),q$2=Symbol.for("react.strict_mode"),r$2=Symbol.for("react.profiler"),t$3=Symbol.for("react.provider"),u$4=Symbol.for("react.context"),v$5=Symbol.for("react.forward_ref"),w$4=Symbol.for("react.suspense"),x$5=Symbol.for("react.memo"),y$5=Symbol.for("react.lazy"),z$3=Symbol.iterator;function A$5(a){if(null===a||"object"!==typeof a)return null;a=z$3&&a[z$3]||a["@@iterator"];return "function"===typeof a?a:null}
var B$4={isMounted:function(){return !1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C$6=Object.assign,D$4={};function E$5(a,b,e){this.props=a;this.context=b;this.refs=D$4;this.updater=e||B$4;}E$5.prototype.isReactComponent={};
E$5.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,b,"setState");};E$5.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};function F$2(){}F$2.prototype=E$5.prototype;function G$2(a,b,e){this.props=a;this.context=b;this.refs=D$4;this.updater=e||B$4;}var H$3=G$2.prototype=new F$2;
H$3.constructor=G$2;C$6(H$3,E$5.prototype);H$3.isPureReactComponent=!0;var I$3=Array.isArray,J$1=Object.prototype.hasOwnProperty,K$4={current:null},L$4={key:!0,ref:!0,__self:!0,__source:!0};
function M$5(a,b,e){var d,c={},k=null,h=null;if(null!=b)for(d in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)J$1.call(b,d)&&!L$4.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(1===g)c.children=e;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];c.children=f;}if(a&&a.defaultProps)for(d in g=a.defaultProps,g)void 0===c[d]&&(c[d]=g[d]);return {$$typeof:l$6,type:a,key:k,ref:h,props:c,_owner:K$4.current}}
function N$5(a,b){return {$$typeof:l$6,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function O$4(a){return "object"===typeof a&&null!==a&&a.$$typeof===l$6}function escape(a){var b={"=":"=0",":":"=2"};return "$"+a.replace(/[=:]/g,function(a){return b[a]})}var P$5=/\/+/g;function Q$2(a,b){return "object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function R$4(a,b,e,d,c){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case l$6:case n$4:h=!0;}}if(h)return h=a,c=c(h),a=""===d?"."+Q$2(h,0):d,I$3(c)?(e="",null!=a&&(e=a.replace(P$5,"$&/")+"/"),R$4(c,b,e,"",function(a){return a})):null!=c&&(O$4(c)&&(c=N$5(c,e+(!c.key||h&&h.key===c.key?"":(""+c.key).replace(P$5,"$&/")+"/")+a)),b.push(c)),1;h=0;d=""===d?".":d+":";if(I$3(a))for(var g=0;g<a.length;g++){k=
a[g];var f=d+Q$2(k,g);h+=R$4(k,b,e,f,c);}else if(f=A$5(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=d+Q$2(k,g++),h+=R$4(k,b,e,f,c);else if("object"===k)throw b=String(a),Error("Objects are not valid as a React child (found: "+("[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}
function S$6(a,b,e){if(null==a)return a;var d=[],c=0;R$4(a,d,"","",function(a){return b.call(e,a,c++)});return d}function T$5(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b;},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b;});-1===a._status&&(a._status=0,a._result=b);}if(1===a._status)return a._result.default;throw a._result;}
var U$2={current:null},V$2={transition:null},W$2={ReactCurrentDispatcher:U$2,ReactCurrentBatchConfig:V$2,ReactCurrentOwner:K$4};react_production_min.Children={map:S$6,forEach:function(a,b,e){S$6(a,function(){b.apply(this,arguments);},e);},count:function(a){var b=0;S$6(a,function(){b++;});return b},toArray:function(a){return S$6(a,function(a){return a})||[]},only:function(a){if(!O$4(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};react_production_min.Component=E$5;react_production_min.Fragment=p$6;
react_production_min.Profiler=r$2;react_production_min.PureComponent=G$2;react_production_min.StrictMode=q$2;react_production_min.Suspense=w$4;react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W$2;
react_production_min.cloneElement=function(a,b,e){if(null===a||void 0===a)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var d=C$6({},a.props),c=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=K$4.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)J$1.call(b,f)&&!L$4.hasOwnProperty(f)&&(d[f]=void 0===b[f]&&void 0!==g?g[f]:b[f]);}var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){g=Array(f);
for(var m=0;m<f;m++)g[m]=arguments[m+2];d.children=g;}return {$$typeof:l$6,type:a.type,key:c,ref:k,props:d,_owner:h}};react_production_min.createContext=function(a){a={$$typeof:u$4,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};a.Provider={$$typeof:t$3,_context:a};return a.Consumer=a};react_production_min.createElement=M$5;react_production_min.createFactory=function(a){var b=M$5.bind(null,a);b.type=a;return b};react_production_min.createRef=function(){return {current:null}};
react_production_min.forwardRef=function(a){return {$$typeof:v$5,render:a}};react_production_min.isValidElement=O$4;react_production_min.lazy=function(a){return {$$typeof:y$5,_payload:{_status:-1,_result:a},_init:T$5}};react_production_min.memo=function(a,b){return {$$typeof:x$5,type:a,compare:void 0===b?null:b}};react_production_min.startTransition=function(a){var b=V$2.transition;V$2.transition={};try{a();}finally{V$2.transition=b;}};react_production_min.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.");};
react_production_min.useCallback=function(a,b){return U$2.current.useCallback(a,b)};react_production_min.useContext=function(a){return U$2.current.useContext(a)};react_production_min.useDebugValue=function(){};react_production_min.useDeferredValue=function(a){return U$2.current.useDeferredValue(a)};react_production_min.useEffect=function(a,b){return U$2.current.useEffect(a,b)};react_production_min.useId=function(){return U$2.current.useId()};react_production_min.useImperativeHandle=function(a,b,e){return U$2.current.useImperativeHandle(a,b,e)};
react_production_min.useInsertionEffect=function(a,b){return U$2.current.useInsertionEffect(a,b)};react_production_min.useLayoutEffect=function(a,b){return U$2.current.useLayoutEffect(a,b)};react_production_min.useMemo=function(a,b){return U$2.current.useMemo(a,b)};react_production_min.useReducer=function(a,b,e){return U$2.current.useReducer(a,b,e)};react_production_min.useRef=function(a){return U$2.current.useRef(a)};react_production_min.useState=function(a){return U$2.current.useState(a)};react_production_min.useSyncExternalStore=function(a,b,e){return U$2.current.useSyncExternalStore(a,b,e)};
react_production_min.useTransition=function(){return U$2.current.useTransition()};react_production_min.version="18.2.0";

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
var f$5=reactExports,k$3=Symbol.for("react.element"),l$5=Symbol.for("react.fragment"),m$7=Object.prototype.hasOwnProperty,n$3=f$5.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p$5={key:!0,ref:!0,__self:!0,__source:!0};
function q$1(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m$7.call(a,b)&&!p$5.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k$3,type:c,key:e,ref:h,props:d,_owner:n$3.current}}reactJsxRuntime_production_min.Fragment=l$5;reactJsxRuntime_production_min.jsx=q$1;reactJsxRuntime_production_min.jsxs=q$1;

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
function qa(a,b,c,d){if(null===b||"undefined"===typeof b||pa(a,b,c,d))return !0;if(d)return !1;if(null!==c)switch(c.type){case 3:return !b;case 4:return !1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return !1}function v$4(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g;}var z$2={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){z$2[a]=new v$4(a,0,!1,a,null,!1,!1);});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];z$2[b]=new v$4(b,1,!1,a[1],null,!1,!1);});["contentEditable","draggable","spellCheck","value"].forEach(function(a){z$2[a]=new v$4(a,2,!1,a.toLowerCase(),null,!1,!1);});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){z$2[a]=new v$4(a,2,!1,a,null,!1,!1);});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){z$2[a]=new v$4(a,3,!1,a.toLowerCase(),null,!1,!1);});
["checked","multiple","muted","selected"].forEach(function(a){z$2[a]=new v$4(a,3,!0,a,null,!1,!1);});["capture","download"].forEach(function(a){z$2[a]=new v$4(a,4,!1,a,null,!1,!1);});["cols","rows","size","span"].forEach(function(a){z$2[a]=new v$4(a,6,!1,a,null,!1,!1);});["rowSpan","start"].forEach(function(a){z$2[a]=new v$4(a,5,!1,a.toLowerCase(),null,!1,!1);});var ra=/[\-:]([a-z])/g;function sa(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(ra,
sa);z$2[b]=new v$4(b,1,!1,a,null,!1,!1);});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(ra,sa);z$2[b]=new v$4(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1);});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(ra,sa);z$2[b]=new v$4(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1);});["tabIndex","crossOrigin"].forEach(function(a){z$2[a]=new v$4(a,1,!1,a.toLowerCase(),null,!1,!1);});
z$2.xlinkHref=new v$4("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){z$2[a]=new v$4(a,1,!1,a.toLowerCase(),null,!0,!0);});
function ta(a,b,c,d){var e=z$2.hasOwnProperty(b)?z$2[b]:null;if(null!==e?0!==e.type:d||!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1])qa(b,c,e,d)&&(c=null),d||null===e?oa(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c)));}
var ua=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,va=Symbol.for("react.element"),wa=Symbol.for("react.portal"),ya=Symbol.for("react.fragment"),za=Symbol.for("react.strict_mode"),Aa=Symbol.for("react.profiler"),Ba=Symbol.for("react.provider"),Ca=Symbol.for("react.context"),Da=Symbol.for("react.forward_ref"),Ea=Symbol.for("react.suspense"),Fa=Symbol.for("react.suspense_list"),Ga=Symbol.for("react.memo"),Ha=Symbol.for("react.lazy");var Ia=Symbol.for("react.offscreen");var Ja=Symbol.iterator;function Ka(a){if(null===a||"object"!==typeof a)return null;a=Ja&&a[Ja]||a["@@iterator"];return "function"===typeof a?a:null}var A$4=Object.assign,La;function Ma(a){if(void 0===La)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);La=b&&b[1]||"";}return "\n"+La+a}var Na=!1;
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
function Ya(a,b){var c=b.checked;return A$4({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value};}function ab(a,b){b=b.checked;null!=b&&ta(a,"checked",b,!1);}
function bb(a,b){ab(a,b);var c=Sa(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c;}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?cb(a,b.type,c):b.hasOwnProperty("defaultValue")&&cb(a,b.type,Sa(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked);}
function db(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b;}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c);}
function cb(a,b,c){if("number"!==b||Xa(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c);}var eb=Array.isArray;
function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0);}else {c=""+Sa(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e]);}null!==b&&(b.selected=!0);}}
function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(p$4(91));return A$4({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(p$4(92));if(eb(c)){if(1<c.length)throw Error(p$4(93));c=c[0];}b=c;}null==b&&(b="");c=b;}a._wrapperState={initialValue:Sa(c)};}
function ib(a,b){var c=Sa(b.value),d=Sa(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d);}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b);}function kb(a){switch(a){case "svg":return "http://www.w3.org/2000/svg";case "math":return "http://www.w3.org/1998/Math/MathML";default:return "http://www.w3.org/1999/xhtml"}}
function lb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?kb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
var mb,nb=function(a){return "undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)});}:a}(function(a,b){if("http://www.w3.org/2000/svg"!==a.namespaceURI||"innerHTML"in a)a.innerHTML=b;else {mb=mb||document.createElement("div");mb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=mb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild);}});
function ob(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b;}
var pb={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,
zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},qb=["Webkit","ms","Moz","O"];Object.keys(pb).forEach(function(a){qb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);pb[b]=pb[a];});});function rb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||pb.hasOwnProperty(a)&&pb[a]?(""+b).trim():b+"px"}
function sb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=rb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e;}}var tb=A$4({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
function ub(a,b){if(b){if(tb[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(p$4(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(p$4(60));if("object"!==typeof b.dangerouslySetInnerHTML||!("__html"in b.dangerouslySetInnerHTML))throw Error(p$4(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(p$4(62));}}
function vb(a,b){if(-1===a.indexOf("-"))return "string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return !1;default:return !0}}var wb=null;function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(p$4(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b));}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a;}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a]);}}function Gb(a,b){return a(b)}function Hb(){}var Ib=!1;function Jb(a,b,c){if(Ib)return a(b,c);Ib=!0;try{return Gb(a,b,c)}finally{if(Ib=!1,null!==zb||null!==Ab)Hb(),Fb();}}
function Kb(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1;}if(a)return null;if(c&&"function"!==
typeof c)throw Error(p$4(231,b,typeof c));return c}var Lb=!1;if(ia)try{var Mb={};Object.defineProperty(Mb,"passive",{get:function(){Lb=!0;}});window.addEventListener("test",Mb,Mb);window.removeEventListener("test",Mb,Mb);}catch(a){Lb=!1;}function Nb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l);}catch(m){this.onError(m);}}var Ob=!1,Pb=null,Qb=!1,Rb=null,Sb={onError:function(a){Ob=!0;Pb=a;}};function Tb(a,b,c,d,e,f,g,h,k){Ob=!1;Pb=null;Nb.apply(Sb,arguments);}
function Ub(a,b,c,d,e,f,g,h,k){Tb.apply(this,arguments);if(Ob){if(Ob){var l=Pb;Ob=!1;Pb=null;}else throw Error(p$4(198));Qb||(Qb=!0,Rb=l);}}function Vb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else {a=b;do b=a,0!==(b.flags&4098)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function Wb(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function Xb(a){if(Vb(a)!==a)throw Error(p$4(188));}
function Yb(a){var b=a.alternate;if(!b){b=Vb(a);if(null===b)throw Error(p$4(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return Xb(e),a;if(f===d)return Xb(e),b;f=f.sibling;}throw Error(p$4(188));}if(c.return!==d.return)c=e,d=f;else {for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling;}if(!g){for(h=f.child;h;){if(h===
c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling;}if(!g)throw Error(p$4(189));}}if(c.alternate!==d)throw Error(p$4(190));}if(3!==c.tag)throw Error(p$4(188));return c.stateNode.current===c?a:b}function Zb(a){a=Yb(a);return null!==a?$b(a):null}function $b(a){if(5===a.tag||6===a.tag)return a;for(a=a.child;null!==a;){var b=$b(a);if(null!==b)return b;a=a.sibling;}return null}
var ac=ca.unstable_scheduleCallback,bc=ca.unstable_cancelCallback,cc=ca.unstable_shouldYield,dc=ca.unstable_requestPaint,B$3=ca.unstable_now,ec=ca.unstable_getCurrentPriorityLevel,fc=ca.unstable_ImmediatePriority,gc=ca.unstable_UserBlockingPriority,hc=ca.unstable_NormalPriority,ic=ca.unstable_LowPriority,jc=ca.unstable_IdlePriority,kc=null,lc=null;function mc(a){if(lc&&"function"===typeof lc.onCommitFiberRoot)try{lc.onCommitFiberRoot(kc,a,void 0,128===(a.current.flags&128));}catch(b){}}
var oc=Math.clz32?Math.clz32:nc,pc=Math.log,qc=Math.LN2;function nc(a){a>>>=0;return 0===a?32:31-(pc(a)/qc|0)|0}var rc=64,sc=4194304;
function tc(a){switch(a&-a){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return a&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;
default:return a}}function uc(a,b){var c=a.pendingLanes;if(0===c)return 0;var d=0,e=a.suspendedLanes,f=a.pingedLanes,g=c&268435455;if(0!==g){var h=g&~e;0!==h?d=tc(h):(f&=g,0!==f&&(d=tc(f)));}else g=c&~e,0!==g?d=tc(g):0!==f&&(d=tc(f));if(0===d)return 0;if(0!==b&&b!==d&&0===(b&e)&&(e=d&-d,f=b&-b,e>=f||16===e&&0!==(f&4194240)))return b;0!==(d&4)&&(d|=c&16);b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-oc(b),e=1<<c,d|=a[c],b&=~e;return d}
function vc(a,b){switch(a){case 1:case 2:case 4:return b+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return b+5E3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return -1;case 134217728:case 268435456:case 536870912:case 1073741824:return -1;default:return -1}}
function wc(a,b){for(var c=a.suspendedLanes,d=a.pingedLanes,e=a.expirationTimes,f=a.pendingLanes;0<f;){var g=31-oc(f),h=1<<g,k=e[g];if(-1===k){if(0===(h&c)||0!==(h&d))e[g]=vc(h,b);}else k<=b&&(a.expiredLanes|=h);f&=~h;}}function xc(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function yc(){var a=rc;rc<<=1;0===(rc&4194240)&&(rc=64);return a}function zc(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
function Ac(a,b,c){a.pendingLanes|=b;536870912!==b&&(a.suspendedLanes=0,a.pingedLanes=0);a=a.eventTimes;b=31-oc(b);a[b]=c;}function Bc(a,b){var c=a.pendingLanes&~b;a.pendingLanes=b;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=b;a.mutableReadLanes&=b;a.entangledLanes&=b;b=a.entanglements;var d=a.eventTimes;for(a=a.expirationTimes;0<c;){var e=31-oc(c),f=1<<e;b[e]=0;d[e]=-1;a[e]=-1;c&=~f;}}
function Cc(a,b){var c=a.entangledLanes|=b;for(a=a.entanglements;c;){var d=31-oc(c),e=1<<d;e&b|a[d]&b&&(a[d]|=b);c&=~e;}}var C$5=0;function Dc(a){a&=-a;return 1<a?4<a?0!==(a&268435455)?16:536870912:4:1}var Ec,Fc,Gc,Hc,Ic,Jc=!1,Kc=[],Lc=null,Mc=null,Nc=null,Oc=new Map,Pc=new Map,Qc=[],Rc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a,b){switch(a){case "focusin":case "focusout":Lc=null;break;case "dragenter":case "dragleave":Mc=null;break;case "mouseover":case "mouseout":Nc=null;break;case "pointerover":case "pointerout":Oc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":Pc.delete(b.pointerId);}}
function Tc(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a={blockedOn:b,domEventName:c,eventSystemFlags:d,nativeEvent:f,targetContainers:[e]},null!==b&&(b=Cb(b),null!==b&&Fc(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
function Uc(a,b,c,d,e){switch(b){case "focusin":return Lc=Tc(Lc,a,b,c,d,e),!0;case "dragenter":return Mc=Tc(Mc,a,b,c,d,e),!0;case "mouseover":return Nc=Tc(Nc,a,b,c,d,e),!0;case "pointerover":var f=e.pointerId;Oc.set(f,Tc(Oc.get(f)||null,a,b,c,d,e));return !0;case "gotpointercapture":return f=e.pointerId,Pc.set(f,Tc(Pc.get(f)||null,a,b,c,d,e)),!0}return !1}
function Vc(a){var b=Wc(a.target);if(null!==b){var c=Vb(b);if(null!==c)if(b=c.tag,13===b){if(b=Wb(c),null!==b){a.blockedOn=b;Ic(a.priority,function(){Gc(c);});return}}else if(3===b&&c.stateNode.current.memoizedState.isDehydrated){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null;}
function Xc(a){if(null!==a.blockedOn)return !1;for(var b=a.targetContainers;0<b.length;){var c=Yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null===c){c=a.nativeEvent;var d=new c.constructor(c.type,c);wb=d;c.target.dispatchEvent(d);wb=null;}else return b=Cb(c),null!==b&&Fc(b),a.blockedOn=c,!1;b.shift();}return !0}function Zc(a,b,c){Xc(a)&&c.delete(b);}function $c(){Jc=!1;null!==Lc&&Xc(Lc)&&(Lc=null);null!==Mc&&Xc(Mc)&&(Mc=null);null!==Nc&&Xc(Nc)&&(Nc=null);Oc.forEach(Zc);Pc.forEach(Zc);}
function ad(a,b){a.blockedOn===b&&(a.blockedOn=null,Jc||(Jc=!0,ca.unstable_scheduleCallback(ca.unstable_NormalPriority,$c)));}
function bd(a){function b(b){return ad(b,a)}if(0<Kc.length){ad(Kc[0],a);for(var c=1;c<Kc.length;c++){var d=Kc[c];d.blockedOn===a&&(d.blockedOn=null);}}null!==Lc&&ad(Lc,a);null!==Mc&&ad(Mc,a);null!==Nc&&ad(Nc,a);Oc.forEach(b);Pc.forEach(b);for(c=0;c<Qc.length;c++)d=Qc[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<Qc.length&&(c=Qc[0],null===c.blockedOn);)Vc(c),null===c.blockedOn&&Qc.shift();}var cd=ua.ReactCurrentBatchConfig,dd=!0;
function ed(a,b,c,d){var e=C$5,f=cd.transition;cd.transition=null;try{C$5=1,fd(a,b,c,d);}finally{C$5=e,cd.transition=f;}}function gd(a,b,c,d){var e=C$5,f=cd.transition;cd.transition=null;try{C$5=4,fd(a,b,c,d);}finally{C$5=e,cd.transition=f;}}
function fd(a,b,c,d){if(dd){var e=Yc(a,b,c,d);if(null===e)hd(a,b,d,id,c),Sc(a,d);else if(Uc(e,a,b,c,d))d.stopPropagation();else if(Sc(a,d),b&4&&-1<Rc.indexOf(a)){for(;null!==e;){var f=Cb(e);null!==f&&Ec(f);f=Yc(a,b,c,d);null===f&&hd(a,b,d,id,c);if(f===e)break;e=f;}null!==e&&d.stopPropagation();}else hd(a,b,d,null,c);}}var id=null;
function Yc(a,b,c,d){id=null;a=xb(d);a=Wc(a);if(null!==a)if(b=Vb(a),null===b)a=null;else if(c=b.tag,13===c){a=Wb(b);if(null!==a)return a;a=null;}else if(3===c){if(b.stateNode.current.memoizedState.isDehydrated)return 3===b.tag?b.stateNode.containerInfo:null;a=null;}else b!==a&&(a=null);id=a;return null}
function jd(a){switch(a){case "cancel":case "click":case "close":case "contextmenu":case "copy":case "cut":case "auxclick":case "dblclick":case "dragend":case "dragstart":case "drop":case "focusin":case "focusout":case "input":case "invalid":case "keydown":case "keypress":case "keyup":case "mousedown":case "mouseup":case "paste":case "pause":case "play":case "pointercancel":case "pointerdown":case "pointerup":case "ratechange":case "reset":case "resize":case "seeked":case "submit":case "touchcancel":case "touchend":case "touchstart":case "volumechange":case "change":case "selectionchange":case "textInput":case "compositionstart":case "compositionend":case "compositionupdate":case "beforeblur":case "afterblur":case "beforeinput":case "blur":case "fullscreenchange":case "focus":case "hashchange":case "popstate":case "select":case "selectstart":return 1;case "drag":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "mousemove":case "mouseout":case "mouseover":case "pointermove":case "pointerout":case "pointerover":case "scroll":case "toggle":case "touchmove":case "wheel":case "mouseenter":case "mouseleave":case "pointerenter":case "pointerleave":return 4;
case "message":switch(ec()){case fc:return 1;case gc:return 4;case hc:case ic:return 16;case jc:return 536870912;default:return 16}default:return 16}}var kd=null,ld=null,md=null;function nd(){if(md)return md;var a,b=ld,c=b.length,d,e="value"in kd?kd.value:kd.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md=e.slice(a,1<d?1-d:void 0)}
function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd(){return !0}function qd(){return !1}
function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:!1===f.returnValue)?pd:qd;this.isPropagationStopped=qd;return this}A$4(b.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
(a.returnValue=!1),this.isDefaultPrevented=pd);},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=pd);},persist:function(){},isPersistent:pd});return b}
var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td=rd(sd),ud=A$4({},sd,{view:0,detail:0}),vd=rd(ud),wd,xd,yd,Ad=A$4({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
a)return a.movementX;a!==yd&&(yd&&"mousemove"===a.type?(wd=a.screenX-yd.screenX,xd=a.screenY-yd.screenY):xd=wd=0,yd=a);return wd},movementY:function(a){return "movementY"in a?a.movementY:xd}}),Bd=rd(Ad),Cd=A$4({},Ad,{dataTransfer:0}),Dd=rd(Cd),Ed=A$4({},ud,{relatedTarget:0}),Fd=rd(Ed),Gd=A$4({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd),Id=A$4({},sd,{clipboardData:function(a){return "clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd=rd(Id),Kd=A$4({},sd,{data:0}),Ld=rd(Kd),Md={Esc:"Escape",
Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od[a])?!!b[a]:!1}function zd(){return Pd}
var Qd=A$4({},ud,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return "keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return "keypress"===a.type?od(a):0},keyCode:function(a){return "keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return "keypress"===
a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd),Sd=A$4({},Ad,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=rd(Sd),Ud=A$4({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud),Wd=A$4({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd),Yd=A$4({},Ad,{deltaX:function(a){return "deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
deltaY:function(a){return "deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae$1=ia&&"CompositionEvent"in window,be$1=null;ia&&"documentMode"in document&&(be$1=document.documentMode);var ce$1=ia&&"TextEvent"in window&&!be$1,de$1=ia&&(!ae$1||be$1&&8<be$1&&11>=be$1),ee$1=String.fromCharCode(32),fe$1=!1;
function ge$1(a,b){switch(a){case "keyup":return -1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return !0;default:return !1}}function he$1(a){a=a.detail;return "object"===typeof a&&"data"in a?a.data:null}var ie$1=!1;function je$1(a,b){switch(a){case "compositionend":return he$1(b);case "keypress":if(32!==b.which)return null;fe$1=!0;return ee$1;case "textInput":return a=b.data,a===ee$1&&fe$1?null:a;default:return null}}
function ke$1(a,b){if(ie$1)return "compositionend"===a||!ae$1&&ge$1(a,b)?(a=nd(),md=ld=kd=null,ie$1=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de$1&&"ko"!==b.locale?null:b.data;default:return null}}
var le$1={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function me$1(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return "input"===b?!!le$1[a.type]:"textarea"===b?!0:!1}function ne$1(a,b,c,d){Eb(d);b=oe$1(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}));}var pe$1=null,qe$1=null;function re$1(a){se$1(a,0);}function te$1(a){var b=ue$1(a);if(Wa(b))return a}
function ve$1(a,b){if("change"===a)return b}var we$1=!1;if(ia){var xe$1;if(ia){var ye$1="oninput"in document;if(!ye$1){var ze$1=document.createElement("div");ze$1.setAttribute("oninput","return;");ye$1="function"===typeof ze$1.oninput;}xe$1=ye$1;}else xe$1=!1;we$1=xe$1&&(!document.documentMode||9<document.documentMode);}function Ae$1(){pe$1&&(pe$1.detachEvent("onpropertychange",Be$1),qe$1=pe$1=null);}function Be$1(a){if("value"===a.propertyName&&te$1(qe$1)){var b=[];ne$1(b,qe$1,a,xb(a));Jb(re$1,b);}}
function Ce$1(a,b,c){"focusin"===a?(Ae$1(),pe$1=b,qe$1=c,pe$1.attachEvent("onpropertychange",Be$1)):"focusout"===a&&Ae$1();}function De$1(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te$1(qe$1)}function Ee$1(a,b){if("click"===a)return te$1(b)}function Fe$1(a,b){if("input"===a||"change"===a)return te$1(b)}function Ge$1(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He$1="function"===typeof Object.is?Object.is:Ge$1;
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
fa("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var lf="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),mf=new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Ub(d,b,void 0,a);a.currentTarget=null;}
function se$1(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k;}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k;}}}if(Qb)throw a=Rb,Qb=!1,Rb=null,a;}
function D$3(a,b){var c=b[of];void 0===c&&(c=b[of]=new Set);var d=a+"__bubble";c.has(d)||(pf(b,a,2,!1),c.add(d));}function qf(a,b,c){var d=0;b&&(d|=4);pf(c,a,d,b);}var rf="_reactListening"+Math.random().toString(36).slice(2);function sf(a){if(!a[rf]){a[rf]=!0;da.forEach(function(b){"selectionchange"!==b&&(mf.has(b)||qf(b,!1,a),qf(b,!0,a));});var b=9===a.nodeType?a:a.ownerDocument;null===b||b[rf]||(b[rf]=!0,qf("selectionchange",!1,b));}}
function pf(a,b,c,d){switch(jd(b)){case 1:var e=ed;break;case 4:e=gd;break;default:e=fd;}c=e.bind(null,b,c,a);e=void 0;!Lb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=!0);d?void 0!==e?a.addEventListener(b,c,{capture:!0,passive:e}):a.addEventListener(b,c,!0):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,!1);}
function hd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return;}for(;null!==h;){g=Wc(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode;}}d=d.return;}Jb(function(){var d=f,e=xb(c),g=[];
a:{var h=df.get(a);if(void 0!==h){var k=td,n=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":n="focus";k=Fd;break;case "focusout":n="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case $e$1:case af:case bf:k=Hd;break;case cf:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td;}var t=0!==(b&4),J=!t&&"scroll"===a,x=t?null!==h?h+"Capture":null:h;t=[];for(var w=d,u;null!==
w;){u=w;var F=u.stateNode;5===u.tag&&null!==F&&(u=F,null!==x&&(F=Kb(w,x),null!=F&&t.push(tf(w,F,u))));if(J)break;w=w.return;}0<t.length&&(h=new k(h,n,null,c,e),g.push({event:h,listeners:t}));}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&c!==wb&&(n=c.relatedTarget||c.fromElement)&&(Wc(n)||n[uf]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(n=c.relatedTarget||c.toElement,k=d,n=n?Wc(n):null,null!==
n&&(J=Vb(n),n!==J||5!==n.tag&&6!==n.tag))n=null;}else k=null,n=d;if(k!==n){t=Bd;F="onMouseLeave";x="onMouseEnter";w="mouse";if("pointerout"===a||"pointerover"===a)t=Td,F="onPointerLeave",x="onPointerEnter",w="pointer";J=null==k?h:ue$1(k);u=null==n?h:ue$1(n);h=new t(F,w+"leave",k,c,e);h.target=J;h.relatedTarget=u;F=null;Wc(e)===d&&(t=new t(x,w+"enter",n,c,e),t.target=u,t.relatedTarget=J,F=t);J=F;if(k&&n)b:{t=k;x=n;w=0;for(u=t;u;u=vf(u))w++;u=0;for(F=x;F;F=vf(F))u++;for(;0<w-u;)t=vf(t),w--;for(;0<u-w;)x=
vf(x),u--;for(;w--;){if(t===x||null!==x&&t===x.alternate)break b;t=vf(t);x=vf(x);}t=null;}else t=null;null!==k&&wf(g,h,k,t,!1);null!==n&&null!==J&&wf(g,J,n,t,!0);}}}a:{h=d?ue$1(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var na=ve$1;else if(me$1(h))if(we$1)na=Fe$1;else {na=De$1;var xa=Ce$1;}else (k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(na=Ee$1);if(na&&(na=na(a,d))){ne$1(g,na,c,e);break a}xa&&xa(a,h,d);"focusout"===a&&(xa=h._wrapperState)&&
xa.controlled&&"number"===h.type&&cb(h,"number",h.value);}xa=d?ue$1(d):window;switch(a){case "focusin":if(me$1(xa)||"true"===xa.contentEditable)Qe$1=xa,Re$1=d,Se$1=null;break;case "focusout":Se$1=Re$1=Qe$1=null;break;case "mousedown":Te$1=!0;break;case "contextmenu":case "mouseup":case "dragend":Te$1=!1;Ue$1(g,c,e);break;case "selectionchange":if(Pe$1)break;case "keydown":case "keyup":Ue$1(g,c,e);}var $a;if(ae$1)b:{switch(a){case "compositionstart":var ba="onCompositionStart";break b;case "compositionend":ba="onCompositionEnd";
break b;case "compositionupdate":ba="onCompositionUpdate";break b}ba=void 0;}else ie$1?ge$1(a,c)&&(ba="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(ba="onCompositionStart");ba&&(de$1&&"ko"!==c.locale&&(ie$1||"onCompositionStart"!==ba?"onCompositionEnd"===ba&&ie$1&&($a=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie$1=!0)),xa=oe$1(d,ba),0<xa.length&&(ba=new Ld(ba,a,null,c,e),g.push({event:ba,listeners:xa}),$a?ba.data=$a:($a=he$1(c),null!==$a&&(ba.data=$a))));if($a=ce$1?je$1(a,c):ke$1(a,c))d=oe$1(d,"onBeforeInput"),
0<d.length&&(e=new Ld("onBeforeInput","beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=$a);}se$1(g,b);});}function tf(a,b,c){return {instance:a,listener:b,currentTarget:c}}function oe$1(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Kb(a,c),null!=f&&d.unshift(tf(a,f,e)),f=Kb(a,b),null!=f&&d.push(tf(a,f,e)));a=a.return;}return d}function vf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
function wf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Kb(c,f),null!=k&&g.unshift(tf(c,k,h))):e||(k=Kb(c,f),null!=k&&g.push(tf(c,k,h))));c=c.return;}0!==g.length&&a.push({event:b,listeners:g});}var xf=/\r\n?/g,yf=/\u0000|\uFFFD/g;function zf(a){return ("string"===typeof a?a:""+a).replace(xf,"\n").replace(yf,"")}function Af(a,b,c){b=zf(b);if(zf(a)!==b&&c)throw Error(p$4(425));}function Bf(){}
var Cf=null,Df=null;function Ef(a,b){return "textarea"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}
var Ff="function"===typeof setTimeout?setTimeout:void 0,Gf="function"===typeof clearTimeout?clearTimeout:void 0,Hf="function"===typeof Promise?Promise:void 0,Jf="function"===typeof queueMicrotask?queueMicrotask:"undefined"!==typeof Hf?function(a){return Hf.resolve(null).then(a).catch(If)}:Ff;function If(a){setTimeout(function(){throw a;});}
function Kf(a,b){var c=b,d=0;do{var e=c.nextSibling;a.removeChild(c);if(e&&8===e.nodeType)if(c=e.data,"/$"===c){if(0===d){a.removeChild(e);bd(b);return}d--;}else "$"!==c&&"$?"!==c&&"$!"!==c||d++;c=e;}while(c);bd(b);}function Lf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break;if(8===b){b=a.data;if("$"===b||"$!"===b||"$?"===b)break;if("/$"===b)return null}}return a}
function Mf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--;}else "/$"===c&&b++;}a=a.previousSibling;}return null}var Nf=Math.random().toString(36).slice(2),Of="__reactFiber$"+Nf,Pf="__reactProps$"+Nf,uf="__reactContainer$"+Nf,of="__reactEvents$"+Nf,Qf="__reactListeners$"+Nf,Rf="__reactHandles$"+Nf;
function Wc(a){var b=a[Of];if(b)return b;for(var c=a.parentNode;c;){if(b=c[uf]||c[Of]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=Mf(a);null!==a;){if(c=a[Of])return c;a=Mf(a);}return b}a=c;c=a.parentNode;}return null}function Cb(a){a=a[Of]||a[uf];return !a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue$1(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(p$4(33));}function Db(a){return a[Pf]||null}var Sf=[],Tf=-1;function Uf(a){return {current:a}}
function E$4(a){0>Tf||(a.current=Sf[Tf],Sf[Tf]=null,Tf--);}function G$1(a,b){Tf++;Sf[Tf]=a.current;a.current=b;}var Vf={},H$2=Uf(Vf),Wf=Uf(!1),Xf=Vf;function Yf(a,b){var c=a.type.contextTypes;if(!c)return Vf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}
function Zf(a){a=a.childContextTypes;return null!==a&&void 0!==a}function $f(){E$4(Wf);E$4(H$2);}function ag(a,b,c){if(H$2.current!==Vf)throw Error(p$4(168));G$1(H$2,b);G$1(Wf,c);}function bg(a,b,c){var d=a.stateNode;b=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in b))throw Error(p$4(108,Ra(a)||"Unknown",e));return A$4({},c,d)}
function cg(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Vf;Xf=H$2.current;G$1(H$2,a);G$1(Wf,Wf.current);return !0}function dg(a,b,c){var d=a.stateNode;if(!d)throw Error(p$4(169));c?(a=bg(a,b,Xf),d.__reactInternalMemoizedMergedChildContext=a,E$4(Wf),E$4(H$2),G$1(H$2,a)):E$4(Wf);G$1(Wf,c);}var eg=null,fg=!1,gg=!1;function hg(a){null===eg?eg=[a]:eg.push(a);}function ig(a){fg=!0;hg(a);}
function jg(){if(!gg&&null!==eg){gg=!0;var a=0,b=C$5;try{var c=eg;for(C$5=1;a<c.length;a++){var d=c[a];do d=d(!0);while(null!==d)}eg=null;fg=!1;}catch(e){throw null!==eg&&(eg=eg.slice(a+1)),ac(fc,jg),e;}finally{C$5=b,gg=!1;}}return null}var kg=[],lg=0,mg=null,ng=0,og=[],pg=0,qg=null,rg=1,sg="";function tg(a,b){kg[lg++]=ng;kg[lg++]=mg;mg=a;ng=b;}
function ug(a,b,c){og[pg++]=rg;og[pg++]=sg;og[pg++]=qg;qg=a;var d=rg;a=sg;var e=32-oc(d)-1;d&=~(1<<e);c+=1;var f=32-oc(b)+e;if(30<f){var g=e-e%5;f=(d&(1<<g)-1).toString(32);d>>=g;e-=g;rg=1<<32-oc(b)+e|c<<e|d;sg=f+a;}else rg=1<<f|c<<e|d,sg=a;}function vg(a){null!==a.return&&(tg(a,1),ug(a,1,0));}function wg(a){for(;a===mg;)mg=kg[--lg],kg[lg]=null,ng=kg[--lg],kg[lg]=null;for(;a===qg;)qg=og[--pg],og[pg]=null,sg=og[--pg],og[pg]=null,rg=og[--pg],og[pg]=null;}var xg=null,yg=null,I$2=!1,zg=null;
function Ag(a,b){var c=Bg(5,null,null,0);c.elementType="DELETED";c.stateNode=b;c.return=a;b=a.deletions;null===b?(a.deletions=[c],a.flags|=16):b.push(c);}
function Cg(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,xg=a,yg=Lf(b.firstChild),!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,xg=a,yg=null,!0):!1;case 13:return b=8!==b.nodeType?null:b,null!==b?(c=null!==qg?{id:rg,overflow:sg}:null,a.memoizedState={dehydrated:b,treeContext:c,retryLane:1073741824},c=Bg(18,null,null,0),c.stateNode=b,c.return=a,a.child=c,xg=a,yg=
null,!0):!1;default:return !1}}function Dg(a){return 0!==(a.mode&1)&&0===(a.flags&128)}function Eg(a){if(I$2){var b=yg;if(b){var c=b;if(!Cg(a,b)){if(Dg(a))throw Error(p$4(418));b=Lf(c.nextSibling);var d=xg;b&&Cg(a,b)?Ag(d,c):(a.flags=a.flags&-4097|2,I$2=!1,xg=a);}}else {if(Dg(a))throw Error(p$4(418));a.flags=a.flags&-4097|2;I$2=!1;xg=a;}}}function Fg(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;xg=a;}
function Gg(a){if(a!==xg)return !1;if(!I$2)return Fg(a),I$2=!0,!1;var b;(b=3!==a.tag)&&!(b=5!==a.tag)&&(b=a.type,b="head"!==b&&"body"!==b&&!Ef(a.type,a.memoizedProps));if(b&&(b=yg)){if(Dg(a))throw Hg(),Error(p$4(418));for(;b;)Ag(a,b),b=Lf(b.nextSibling);}Fg(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(p$4(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){yg=Lf(a.nextSibling);break a}b--;}else "$"!==c&&"$!"!==c&&"$?"!==c||b++;}a=a.nextSibling;}yg=
null;}}else yg=xg?Lf(a.stateNode.nextSibling):null;return !0}function Hg(){for(var a=yg;a;)a=Lf(a.nextSibling);}function Ig(){yg=xg=null;I$2=!1;}function Jg(a){null===zg?zg=[a]:zg.push(a);}var Kg=ua.ReactCurrentBatchConfig;function Lg(a,b){if(a&&a.defaultProps){b=A$4({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}var Mg=Uf(null),Ng=null,Og=null,Pg=null;function Qg(){Pg=Og=Ng=null;}function Rg(a){var b=Mg.current;E$4(Mg);a._currentValue=b;}
function Sg(a,b,c){for(;null!==a;){var d=a.alternate;(a.childLanes&b)!==b?(a.childLanes|=b,null!==d&&(d.childLanes|=b)):null!==d&&(d.childLanes&b)!==b&&(d.childLanes|=b);if(a===c)break;a=a.return;}}function Tg(a,b){Ng=a;Pg=Og=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(Ug=!0),a.firstContext=null);}
function Vg(a){var b=a._currentValue;if(Pg!==a)if(a={context:a,memoizedValue:b,next:null},null===Og){if(null===Ng)throw Error(p$4(308));Og=a;Ng.dependencies={lanes:0,firstContext:a};}else Og=Og.next=a;return b}var Wg=null;function Xg(a){null===Wg?Wg=[a]:Wg.push(a);}function Yg(a,b,c,d){var e=b.interleaved;null===e?(c.next=c,Xg(b)):(c.next=e.next,e.next=c);b.interleaved=c;return Zg(a,d)}
function Zg(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}var $g=!1;function ah(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null};}
function bh(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects});}function ch(a,b){return {eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}
function dh(a,b,c){var d=a.updateQueue;if(null===d)return null;d=d.shared;if(0!==(K$3&2)){var e=d.pending;null===e?b.next=b:(b.next=e.next,e.next=b);d.pending=b;return Zg(a,c)}e=d.interleaved;null===e?(b.next=b,Xg(d)):(b.next=e.next,e.next=b);d.interleaved=b;return Zg(a,c)}function eh(a,b,c){b=b.updateQueue;if(null!==b&&(b=b.shared,0!==(c&4194240))){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c);}}
function fh(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next;}while(null!==c);null===f?e=f=b:f=f.next=b;}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
b;c.lastBaseUpdate=b;}
function gh(a,b,c,d){var e=a.updateQueue;$g=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var m=a.alternate;null!==m&&(m=m.updateQueue,h=m.lastBaseUpdate,h!==g&&(null===h?m.firstBaseUpdate=l:h.next=l,m.lastBaseUpdate=k));}if(null!==f){var q=e.baseState;g=0;m=l=k=null;h=f;do{var r=h.lane,y=h.eventTime;if((d&r)===r){null!==m&&(m=m.next={eventTime:y,lane:0,tag:h.tag,payload:h.payload,callback:h.callback,
next:null});a:{var n=a,t=h;r=b;y=c;switch(t.tag){case 1:n=t.payload;if("function"===typeof n){q=n.call(y,q,r);break a}q=n;break a;case 3:n.flags=n.flags&-65537|128;case 0:n=t.payload;r="function"===typeof n?n.call(y,q,r):n;if(null===r||void 0===r)break a;q=A$4({},q,r);break a;case 2:$g=!0;}}null!==h.callback&&0!==h.lane&&(a.flags|=64,r=e.effects,null===r?e.effects=[h]:r.push(h));}else y={eventTime:y,lane:r,tag:h.tag,payload:h.payload,callback:h.callback,next:null},null===m?(l=m=y,k=q):m=m.next=y,g|=r;
h=h.next;if(null===h)if(h=e.shared.pending,null===h)break;else r=h,h=r.next,r.next=null,e.lastBaseUpdate=r,e.shared.pending=null;}while(1);null===m&&(k=q);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=m;b=e.shared.interleaved;if(null!==b){e=b;do g|=e.lane,e=e.next;while(e!==b)}else null===f&&(e.shared.lanes=0);hh|=g;a.lanes=g;a.memoizedState=q;}}
function ih(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(p$4(191,e));e.call(d);}}}var jh=(new aa.Component).refs;function kh(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:A$4({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c);}
var nh={isMounted:function(a){return (a=a._reactInternals)?Vb(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=L$3(),e=lh(a),f=ch(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=dh(a,f,e);null!==b&&(mh(b,a,e,d),eh(b,a,e));},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=L$3(),e=lh(a),f=ch(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=dh(a,f,e);null!==b&&(mh(b,a,e,d),eh(b,a,e));},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=L$3(),d=
lh(a),e=ch(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=b);b=dh(a,e,d);null!==b&&(mh(b,a,d,c),eh(b,a,d));}};function oh(a,b,c,d,e,f,g){a=a.stateNode;return "function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Ie$1(c,d)||!Ie$1(e,f):!0}
function ph(a,b,c){var d=!1,e=Vf;var f=b.contextType;"object"===typeof f&&null!==f?f=Vg(f):(e=Zf(b)?Xf:H$2.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Yf(a,e):Vf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=nh;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function qh(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&nh.enqueueReplaceState(b,b.state,null);}
function rh(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs=jh;ah(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=Vg(f):(f=Zf(b)?Xf:H$2.current,e.context=Yf(a,f));e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(kh(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||(b=e.state,
"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&nh.enqueueReplaceState(e,e.state,null),gh(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4194308);}
function sh(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(p$4(309));var d=c.stateNode;}if(!d)throw Error(p$4(147,a));var e=d,f=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===f)return b.ref;b=function(a){var b=e.refs;b===jh&&(b=e.refs={});null===a?delete b[f]:b[f]=a;};b._stringRef=f;return b}if("string"!==typeof a)throw Error(p$4(284));if(!c._owner)throw Error(p$4(290,a));}return a}
function th(a,b){a=Object.prototype.toString.call(b);throw Error(p$4(31,"[object Object]"===a?"object with keys {"+Object.keys(b).join(", ")+"}":a));}function uh(a){var b=a._init;return b(a._payload)}
function vh(a){function b(b,c){if(a){var d=b.deletions;null===d?(b.deletions=[c],b.flags|=16):d.push(c);}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=wh(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return b.flags|=1048576,c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags|=2,c):d;b.flags|=2;return c}function g(b){a&&
null===b.alternate&&(b.flags|=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=xh(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){var f=c.type;if(f===ya)return m(a,b,c.props.children,d,c.key);if(null!==b&&(b.elementType===f||"object"===typeof f&&null!==f&&f.$$typeof===Ha&&uh(f)===b.type))return d=e(b,c.props),d.ref=sh(a,b,c),d.return=a,d;d=yh(c.type,c.key,c.props,null,a.mode,d);d.ref=sh(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||
b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=zh(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function m(a,b,c,d,f){if(null===b||7!==b.tag)return b=Ah(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function q(a,b,c){if("string"===typeof b&&""!==b||"number"===typeof b)return b=xh(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case va:return c=yh(b.type,b.key,b.props,null,a.mode,c),
c.ref=sh(a,null,b),c.return=a,c;case wa:return b=zh(b,a.mode,c),b.return=a,b;case Ha:var d=b._init;return q(a,d(b._payload),c)}if(eb(b)||Ka(b))return b=Ah(b,a.mode,c,null),b.return=a,b;th(a,b);}return null}function r(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c&&""!==c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case va:return c.key===e?k(a,b,c,d):null;case wa:return c.key===e?l(a,b,c,d):null;case Ha:return e=c._init,r(a,
b,e(c._payload),d)}if(eb(c)||Ka(c))return null!==e?null:m(a,b,c,d,null);th(a,c);}return null}function y(a,b,c,d,e){if("string"===typeof d&&""!==d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case va:return a=a.get(null===d.key?c:d.key)||null,k(b,a,d,e);case wa:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e);case Ha:var f=d._init;return y(a,b,c,f(d._payload),e)}if(eb(d)||Ka(d))return a=a.get(c)||null,m(b,a,d,e,null);th(b,d);}return null}
function n(e,g,h,k){for(var l=null,m=null,u=g,w=g=0,x=null;null!==u&&w<h.length;w++){u.index>w?(x=u,u=null):x=u.sibling;var n=r(e,u,h[w],k);if(null===n){null===u&&(u=x);break}a&&u&&null===n.alternate&&b(e,u);g=f(n,g,w);null===m?l=n:m.sibling=n;m=n;u=x;}if(w===h.length)return c(e,u),I$2&&tg(e,w),l;if(null===u){for(;w<h.length;w++)u=q(e,h[w],k),null!==u&&(g=f(u,g,w),null===m?l=u:m.sibling=u,m=u);I$2&&tg(e,w);return l}for(u=d(e,u);w<h.length;w++)x=y(u,e,w,h[w],k),null!==x&&(a&&null!==x.alternate&&u.delete(null===
x.key?w:x.key),g=f(x,g,w),null===m?l=x:m.sibling=x,m=x);a&&u.forEach(function(a){return b(e,a)});I$2&&tg(e,w);return l}function t(e,g,h,k){var l=Ka(h);if("function"!==typeof l)throw Error(p$4(150));h=l.call(h);if(null==h)throw Error(p$4(151));for(var u=l=null,m=g,w=g=0,x=null,n=h.next();null!==m&&!n.done;w++,n=h.next()){m.index>w?(x=m,m=null):x=m.sibling;var t=r(e,m,n.value,k);if(null===t){null===m&&(m=x);break}a&&m&&null===t.alternate&&b(e,m);g=f(t,g,w);null===u?l=t:u.sibling=t;u=t;m=x;}if(n.done)return c(e,
m),I$2&&tg(e,w),l;if(null===m){for(;!n.done;w++,n=h.next())n=q(e,n.value,k),null!==n&&(g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);I$2&&tg(e,w);return l}for(m=d(e,m);!n.done;w++,n=h.next())n=y(m,e,w,n.value,k),null!==n&&(a&&null!==n.alternate&&m.delete(null===n.key?w:n.key),g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);a&&m.forEach(function(a){return b(e,a)});I$2&&tg(e,w);return l}function J(a,d,f,h){"object"===typeof f&&null!==f&&f.type===ya&&null===f.key&&(f=f.props.children);if("object"===typeof f&&null!==f){switch(f.$$typeof){case va:a:{for(var k=
f.key,l=d;null!==l;){if(l.key===k){k=f.type;if(k===ya){if(7===l.tag){c(a,l.sibling);d=e(l,f.props.children);d.return=a;a=d;break a}}else if(l.elementType===k||"object"===typeof k&&null!==k&&k.$$typeof===Ha&&uh(k)===l.type){c(a,l.sibling);d=e(l,f.props);d.ref=sh(a,l,f);d.return=a;a=d;break a}c(a,l);break}else b(a,l);l=l.sibling;}f.type===ya?(d=Ah(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=yh(f.type,f.key,f.props,null,a.mode,h),h.ref=sh(a,d,f),h.return=a,a=h);}return g(a);case wa:a:{for(l=f.key;null!==
d;){if(d.key===l)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else {c(a,d);break}else b(a,d);d=d.sibling;}d=zh(f,a.mode,h);d.return=a;a=d;}return g(a);case Ha:return l=f._init,J(a,d,l(f._payload),h)}if(eb(f))return n(a,d,f,h);if(Ka(f))return t(a,d,f,h);th(a,f);}return "string"===typeof f&&""!==f||"number"===typeof f?(f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):
(c(a,d),d=xh(f,a.mode,h),d.return=a,a=d),g(a)):c(a,d)}return J}var Bh=vh(!0),Ch=vh(!1),Dh={},Eh=Uf(Dh),Fh=Uf(Dh),Gh=Uf(Dh);function Hh(a){if(a===Dh)throw Error(p$4(174));return a}function Ih(a,b){G$1(Gh,b);G$1(Fh,a);G$1(Eh,Dh);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:lb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=lb(b,a);}E$4(Eh);G$1(Eh,b);}function Jh(){E$4(Eh);E$4(Fh);E$4(Gh);}
function Kh(a){Hh(Gh.current);var b=Hh(Eh.current);var c=lb(b,a.type);b!==c&&(G$1(Fh,a),G$1(Eh,c));}function Lh(a){Fh.current===a&&(E$4(Eh),E$4(Fh));}var M$4=Uf(0);
function Mh(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&128))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}return null}var Nh=[];
function Oh(){for(var a=0;a<Nh.length;a++)Nh[a]._workInProgressVersionPrimary=null;Nh.length=0;}var Ph=ua.ReactCurrentDispatcher,Qh=ua.ReactCurrentBatchConfig,Rh=0,N$4=null,O$3=null,P$4=null,Sh=!1,Th=!1,Uh=0,Vh=0;function Q$1(){throw Error(p$4(321));}function Wh(a,b){if(null===b)return !1;for(var c=0;c<b.length&&c<a.length;c++)if(!He$1(a[c],b[c]))return !1;return !0}
function Xh(a,b,c,d,e,f){Rh=f;N$4=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;Ph.current=null===a||null===a.memoizedState?Yh:Zh;a=c(d,e);if(Th){f=0;do{Th=!1;Uh=0;if(25<=f)throw Error(p$4(301));f+=1;P$4=O$3=null;b.updateQueue=null;Ph.current=$h;a=c(d,e);}while(Th)}Ph.current=ai$1;b=null!==O$3&&null!==O$3.next;Rh=0;P$4=O$3=N$4=null;Sh=!1;if(b)throw Error(p$4(300));return a}function bi$1(){var a=0!==Uh;Uh=0;return a}
function ci$1(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===P$4?N$4.memoizedState=P$4=a:P$4=P$4.next=a;return P$4}function di$1(){if(null===O$3){var a=N$4.alternate;a=null!==a?a.memoizedState:null;}else a=O$3.next;var b=null===P$4?N$4.memoizedState:P$4.next;if(null!==b)P$4=b,O$3=a;else {if(null===a)throw Error(p$4(310));O$3=a;a={memoizedState:O$3.memoizedState,baseState:O$3.baseState,baseQueue:O$3.baseQueue,queue:O$3.queue,next:null};null===P$4?N$4.memoizedState=P$4=a:P$4=P$4.next=a;}return P$4}
function ei$1(a,b){return "function"===typeof b?b(a):b}
function fi$1(a){var b=di$1(),c=b.queue;if(null===c)throw Error(p$4(311));c.lastRenderedReducer=a;var d=O$3,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g;}d.baseQueue=e=f;c.pending=null;}if(null!==e){f=e.next;d=d.baseState;var h=g=null,k=null,l=f;do{var m=l.lane;if((Rh&m)===m)null!==k&&(k=k.next={lane:0,action:l.action,hasEagerState:l.hasEagerState,eagerState:l.eagerState,next:null}),d=l.hasEagerState?l.eagerState:a(d,l.action);else {var q={lane:m,action:l.action,hasEagerState:l.hasEagerState,
eagerState:l.eagerState,next:null};null===k?(h=k=q,g=d):k=k.next=q;N$4.lanes|=m;hh|=m;}l=l.next;}while(null!==l&&l!==f);null===k?g=d:k.next=h;He$1(d,b.memoizedState)||(Ug=!0);b.memoizedState=d;b.baseState=g;b.baseQueue=k;c.lastRenderedState=d;}a=c.interleaved;if(null!==a){e=a;do f=e.lane,N$4.lanes|=f,hh|=f,e=e.next;while(e!==a)}else null===e&&(c.lanes=0);return [b.memoizedState,c.dispatch]}
function gi$1(a){var b=di$1(),c=b.queue;if(null===c)throw Error(p$4(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He$1(f,b.memoizedState)||(Ug=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f;}return [f,d]}function hi$1(){}
function ii$1(a,b){var c=N$4,d=di$1(),e=b(),f=!He$1(d.memoizedState,e);f&&(d.memoizedState=e,Ug=!0);d=d.queue;ji$1(ki$1.bind(null,c,d,a),[a]);if(d.getSnapshot!==b||f||null!==P$4&&P$4.memoizedState.tag&1){c.flags|=2048;li$1(9,mi$1.bind(null,c,d,e,b),void 0,null);if(null===R$3)throw Error(p$4(349));0!==(Rh&30)||ni$1(c,b,e);}return e}function ni$1(a,b,c){a.flags|=16384;a={getSnapshot:b,value:c};b=N$4.updateQueue;null===b?(b={lastEffect:null,stores:null},N$4.updateQueue=b,b.stores=[a]):(c=b.stores,null===c?b.stores=[a]:c.push(a));}
function mi$1(a,b,c,d){b.value=c;b.getSnapshot=d;oi$1(b)&&pi$1(a);}function ki$1(a,b,c){return c(function(){oi$1(b)&&pi$1(a);})}function oi$1(a){var b=a.getSnapshot;a=a.value;try{var c=b();return !He$1(a,c)}catch(d){return !0}}function pi$1(a){var b=Zg(a,1);null!==b&&mh(b,a,1,-1);}
function qi$1(a){var b=ci$1();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ei$1,lastRenderedState:a};b.queue=a;a=a.dispatch=ri$1.bind(null,N$4,a);return [b.memoizedState,a]}
function li$1(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=N$4.updateQueue;null===b?(b={lastEffect:null,stores:null},N$4.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function si$1(){return di$1().memoizedState}function ti$1(a,b,c,d){var e=ci$1();N$4.flags|=a;e.memoizedState=li$1(1|b,c,void 0,void 0===d?null:d);}
function ui$1(a,b,c,d){var e=di$1();d=void 0===d?null:d;var f=void 0;if(null!==O$3){var g=O$3.memoizedState;f=g.destroy;if(null!==d&&Wh(d,g.deps)){e.memoizedState=li$1(b,c,f,d);return}}N$4.flags|=a;e.memoizedState=li$1(1|b,c,f,d);}function vi$1(a,b){return ti$1(8390656,8,a,b)}function ji$1(a,b){return ui$1(2048,8,a,b)}function wi$1(a,b){return ui$1(4,2,a,b)}function xi$1(a,b){return ui$1(4,4,a,b)}
function yi$1(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null);};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null;}}function zi$1(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return ui$1(4,4,yi$1.bind(null,b,a),c)}function Ai$1(){}function Bi$1(a,b){var c=di$1();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Wh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}
function Ci$1(a,b){var c=di$1();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Wh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}function Di$1(a,b,c){if(0===(Rh&21))return a.baseState&&(a.baseState=!1,Ug=!0),a.memoizedState=c;He$1(c,b)||(c=yc(),N$4.lanes|=c,hh|=c,a.baseState=!0);return b}function Ei$1(a,b){var c=C$5;C$5=0!==c&&4>c?c:4;a(!0);var d=Qh.transition;Qh.transition={};try{a(!1),b();}finally{C$5=c,Qh.transition=d;}}function Fi$1(){return di$1().memoizedState}
function Gi$1(a,b,c){var d=lh(a);c={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(Hi$1(a))Ii$1(b,c);else if(c=Yg(a,b,c,d),null!==c){var e=L$3();mh(c,a,d,e);Ji$1(c,b,d);}}
function ri$1(a,b,c){var d=lh(a),e={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(Hi$1(a))Ii$1(b,e);else {var f=a.alternate;if(0===a.lanes&&(null===f||0===f.lanes)&&(f=b.lastRenderedReducer,null!==f))try{var g=b.lastRenderedState,h=f(g,c);e.hasEagerState=!0;e.eagerState=h;if(He$1(h,g)){var k=b.interleaved;null===k?(e.next=e,Xg(b)):(e.next=k.next,k.next=e);b.interleaved=e;return}}catch(l){}finally{}c=Yg(a,b,e,d);null!==c&&(e=L$3(),mh(c,a,d,e),Ji$1(c,b,d));}}
function Hi$1(a){var b=a.alternate;return a===N$4||null!==b&&b===N$4}function Ii$1(a,b){Th=Sh=!0;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b;}function Ji$1(a,b,c){if(0!==(c&4194240)){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c);}}
var ai$1={readContext:Vg,useCallback:Q$1,useContext:Q$1,useEffect:Q$1,useImperativeHandle:Q$1,useInsertionEffect:Q$1,useLayoutEffect:Q$1,useMemo:Q$1,useReducer:Q$1,useRef:Q$1,useState:Q$1,useDebugValue:Q$1,useDeferredValue:Q$1,useTransition:Q$1,useMutableSource:Q$1,useSyncExternalStore:Q$1,useId:Q$1,unstable_isNewReconciler:!1},Yh={readContext:Vg,useCallback:function(a,b){ci$1().memoizedState=[a,void 0===b?null:b];return a},useContext:Vg,useEffect:vi$1,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return ti$1(4194308,
4,yi$1.bind(null,b,a),c)},useLayoutEffect:function(a,b){return ti$1(4194308,4,a,b)},useInsertionEffect:function(a,b){return ti$1(4,2,a,b)},useMemo:function(a,b){var c=ci$1();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=ci$1();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};d.queue=a;a=a.dispatch=Gi$1.bind(null,N$4,a);return [d.memoizedState,a]},useRef:function(a){var b=
ci$1();a={current:a};return b.memoizedState=a},useState:qi$1,useDebugValue:Ai$1,useDeferredValue:function(a){return ci$1().memoizedState=a},useTransition:function(){var a=qi$1(!1),b=a[0];a=Ei$1.bind(null,a[1]);ci$1().memoizedState=a;return [b,a]},useMutableSource:function(){},useSyncExternalStore:function(a,b,c){var d=N$4,e=ci$1();if(I$2){if(void 0===c)throw Error(p$4(407));c=c();}else {c=b();if(null===R$3)throw Error(p$4(349));0!==(Rh&30)||ni$1(d,b,c);}e.memoizedState=c;var f={value:c,getSnapshot:b};e.queue=f;vi$1(ki$1.bind(null,d,
f,a),[a]);d.flags|=2048;li$1(9,mi$1.bind(null,d,f,c,b),void 0,null);return c},useId:function(){var a=ci$1(),b=R$3.identifierPrefix;if(I$2){var c=sg;var d=rg;c=(d&~(1<<32-oc(d)-1)).toString(32)+c;b=":"+b+"R"+c;c=Uh++;0<c&&(b+="H"+c.toString(32));b+=":";}else c=Vh++,b=":"+b+"r"+c.toString(32)+":";return a.memoizedState=b},unstable_isNewReconciler:!1},Zh={readContext:Vg,useCallback:Bi$1,useContext:Vg,useEffect:ji$1,useImperativeHandle:zi$1,useInsertionEffect:wi$1,useLayoutEffect:xi$1,useMemo:Ci$1,useReducer:fi$1,useRef:si$1,useState:function(){return fi$1(ei$1)},
useDebugValue:Ai$1,useDeferredValue:function(a){var b=di$1();return Di$1(b,O$3.memoizedState,a)},useTransition:function(){var a=fi$1(ei$1)[0],b=di$1().memoizedState;return [a,b]},useMutableSource:hi$1,useSyncExternalStore:ii$1,useId:Fi$1,unstable_isNewReconciler:!1},$h={readContext:Vg,useCallback:Bi$1,useContext:Vg,useEffect:ji$1,useImperativeHandle:zi$1,useInsertionEffect:wi$1,useLayoutEffect:xi$1,useMemo:Ci$1,useReducer:gi$1,useRef:si$1,useState:function(){return gi$1(ei$1)},useDebugValue:Ai$1,useDeferredValue:function(a){var b=di$1();return null===
O$3?b.memoizedState=a:Di$1(b,O$3.memoizedState,a)},useTransition:function(){var a=gi$1(ei$1)[0],b=di$1().memoizedState;return [a,b]},useMutableSource:hi$1,useSyncExternalStore:ii$1,useId:Fi$1,unstable_isNewReconciler:!1};function Ki$1(a,b){try{var c="",d=b;do c+=Pa(d),d=d.return;while(d);var e=c;}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack;}return {value:a,source:b,stack:e,digest:null}}function Li$1(a,b,c){return {value:a,source:null,stack:null!=c?c:null,digest:null!=b?b:null}}
function Mi$1(a,b){try{console.error(b.value);}catch(c){setTimeout(function(){throw c;});}}var Ni$1="function"===typeof WeakMap?WeakMap:Map;function Oi$1(a,b,c){c=ch(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Pi$1||(Pi$1=!0,Qi$1=d);Mi$1(a,b);};return c}
function Ri$1(a,b,c){c=ch(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){return d(e)};c.callback=function(){Mi$1(a,b);};}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){Mi$1(a,b);"function"!==typeof d&&(null===Si$1?Si$1=new Set([this]):Si$1.add(this));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""});});return c}
function Ti$1(a,b,c){var d=a.pingCache;if(null===d){d=a.pingCache=new Ni$1;var e=new Set;d.set(b,e);}else e=d.get(b),void 0===e&&(e=new Set,d.set(b,e));e.has(c)||(e.add(c),a=Ui$1.bind(null,a,b,c),b.then(a,a));}function Vi$1(a){do{var b;if(b=13===a.tag)b=a.memoizedState,b=null!==b?null!==b.dehydrated?!0:!1:!0;if(b)return a;a=a.return;}while(null!==a);return null}
function Wi$1(a,b,c,d,e){if(0===(a.mode&1))return a===b?a.flags|=65536:(a.flags|=128,c.flags|=131072,c.flags&=-52805,1===c.tag&&(null===c.alternate?c.tag=17:(b=ch(-1,1),b.tag=2,dh(c,b,1))),c.lanes|=1),a;a.flags|=65536;a.lanes=e;return a}var Xi$1=ua.ReactCurrentOwner,Ug=!1;function Yi$1(a,b,c,d){b.child=null===a?Ch(b,null,c,d):Bh(b,a.child,c,d);}
function Zi$1(a,b,c,d,e){c=c.render;var f=b.ref;Tg(b,e);d=Xh(a,b,c,d,f,e);c=bi$1();if(null!==a&&!Ug)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,$i$1(a,b,e);I$2&&c&&vg(b);b.flags|=1;Yi$1(a,b,d,e);return b.child}
function aj(a,b,c,d,e){if(null===a){var f=c.type;if("function"===typeof f&&!bj(f)&&void 0===f.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=f,cj(a,b,f,d,e);a=yh(c.type,null,d,b,b.mode,e);a.ref=b.ref;a.return=b;return b.child=a}f=a.child;if(0===(a.lanes&e)){var g=f.memoizedProps;c=c.compare;c=null!==c?c:Ie$1;if(c(g,d)&&a.ref===b.ref)return $i$1(a,b,e)}b.flags|=1;a=wh(f,d);a.ref=b.ref;a.return=b;return b.child=a}
function cj(a,b,c,d,e){if(null!==a){var f=a.memoizedProps;if(Ie$1(f,d)&&a.ref===b.ref)if(Ug=!1,b.pendingProps=d=f,0!==(a.lanes&e))0!==(a.flags&131072)&&(Ug=!0);else return b.lanes=a.lanes,$i$1(a,b,e)}return dj(a,b,c,d,e)}
function ej(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode)if(0===(b.mode&1))b.memoizedState={baseLanes:0,cachePool:null,transitions:null},G$1(fj,gj),gj|=c;else {if(0===(c&1073741824))return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a,cachePool:null,transitions:null},b.updateQueue=null,G$1(fj,gj),gj|=a,null;b.memoizedState={baseLanes:0,cachePool:null,transitions:null};d=null!==f?f.baseLanes:c;G$1(fj,gj);gj|=d;}else null!==
f?(d=f.baseLanes|c,b.memoizedState=null):d=c,G$1(fj,gj),gj|=d;Yi$1(a,b,e,c);return b.child}function hj(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=512,b.flags|=2097152;}function dj(a,b,c,d,e){var f=Zf(c)?Xf:H$2.current;f=Yf(b,f);Tg(b,e);c=Xh(a,b,c,d,f,e);d=bi$1();if(null!==a&&!Ug)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,$i$1(a,b,e);I$2&&d&&vg(b);b.flags|=1;Yi$1(a,b,c,e);return b.child}
function ij(a,b,c,d,e){if(Zf(c)){var f=!0;cg(b);}else f=!1;Tg(b,e);if(null===b.stateNode)jj(a,b),ph(b,c,d),rh(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=Vg(l):(l=Zf(c)?Xf:H$2.current,l=Yf(b,l));var m=c.getDerivedStateFromProps,q="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;q||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||
(h!==d||k!==l)&&qh(b,g,d,l);$g=!1;var r=b.memoizedState;g.state=r;gh(b,d,g,e);k=b.memoizedState;h!==d||r!==k||Wf.current||$g?("function"===typeof m&&(kh(b,c,m,d),k=b.memoizedState),(h=$g||oh(b,c,h,d,r,k,l))?(q||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.flags|=4194308)):
("function"===typeof g.componentDidMount&&(b.flags|=4194308),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4194308),d=!1);}else {g=b.stateNode;bh(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:Lg(b.type,h);g.props=l;q=b.pendingProps;r=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=Vg(k):(k=Zf(c)?Xf:H$2.current,k=Yf(b,k));var y=c.getDerivedStateFromProps;(m="function"===typeof y||"function"===typeof g.getSnapshotBeforeUpdate)||
"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==q||r!==k)&&qh(b,g,d,k);$g=!1;r=b.memoizedState;g.state=r;gh(b,d,g,e);var n=b.memoizedState;h!==q||r!==n||Wf.current||$g?("function"===typeof y&&(kh(b,c,y,d),n=b.memoizedState),(l=$g||oh(b,c,l,d,r,n,k)||!1)?(m||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,n,k),"function"===typeof g.UNSAFE_componentWillUpdate&&
g.UNSAFE_componentWillUpdate(d,n,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=1024)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),b.memoizedProps=d,b.memoizedState=n),g.props=d,g.state=n,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===
a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),d=!1);}return kj(a,b,c,d,f,e)}
function kj(a,b,c,d,e,f){hj(a,b);var g=0!==(b.flags&128);if(!d&&!g)return e&&dg(b,c,!1),$i$1(a,b,f);d=b.stateNode;Xi$1.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Bh(b,a.child,null,f),b.child=Bh(b,null,h,f)):Yi$1(a,b,h,f);b.memoizedState=d.state;e&&dg(b,c,!0);return b.child}function lj(a){var b=a.stateNode;b.pendingContext?ag(a,b.pendingContext,b.pendingContext!==b.context):b.context&&ag(a,b.context,!1);Ih(a,b.containerInfo);}
function mj(a,b,c,d,e){Ig();Jg(e);b.flags|=256;Yi$1(a,b,c,d);return b.child}var nj={dehydrated:null,treeContext:null,retryLane:0};function oj(a){return {baseLanes:a,cachePool:null,transitions:null}}
function pj(a,b,c){var d=b.pendingProps,e=M$4.current,f=!1,g=0!==(b.flags&128),h;(h=g)||(h=null!==a&&null===a.memoizedState?!1:0!==(e&2));if(h)f=!0,b.flags&=-129;else if(null===a||null!==a.memoizedState)e|=1;G$1(M$4,e&1);if(null===a){Eg(b);a=b.memoizedState;if(null!==a&&(a=a.dehydrated,null!==a))return 0===(b.mode&1)?b.lanes=1:"$!"===a.data?b.lanes=8:b.lanes=1073741824,null;g=d.children;a=d.fallback;return f?(d=b.mode,f=b.child,g={mode:"hidden",children:g},0===(d&1)&&null!==f?(f.childLanes=0,f.pendingProps=
g):f=qj(g,d,0,null),a=Ah(a,d,c,null),f.return=b,a.return=b,f.sibling=a,b.child=f,b.child.memoizedState=oj(c),b.memoizedState=nj,a):rj(b,g)}e=a.memoizedState;if(null!==e&&(h=e.dehydrated,null!==h))return sj(a,b,g,d,h,e,c);if(f){f=d.fallback;g=b.mode;e=a.child;h=e.sibling;var k={mode:"hidden",children:d.children};0===(g&1)&&b.child!==e?(d=b.child,d.childLanes=0,d.pendingProps=k,b.deletions=null):(d=wh(e,k),d.subtreeFlags=e.subtreeFlags&14680064);null!==h?f=wh(h,f):(f=Ah(f,g,c,null),f.flags|=2);f.return=
b;d.return=b;d.sibling=f;b.child=d;d=f;f=b.child;g=a.child.memoizedState;g=null===g?oj(c):{baseLanes:g.baseLanes|c,cachePool:null,transitions:g.transitions};f.memoizedState=g;f.childLanes=a.childLanes&~c;b.memoizedState=nj;return d}f=a.child;a=f.sibling;d=wh(f,{mode:"visible",children:d.children});0===(b.mode&1)&&(d.lanes=c);d.return=b;d.sibling=null;null!==a&&(c=b.deletions,null===c?(b.deletions=[a],b.flags|=16):c.push(a));b.child=d;b.memoizedState=null;return d}
function rj(a,b){b=qj({mode:"visible",children:b},a.mode,0,null);b.return=a;return a.child=b}function tj(a,b,c,d){null!==d&&Jg(d);Bh(b,a.child,null,c);a=rj(b,b.pendingProps.children);a.flags|=2;b.memoizedState=null;return a}
function sj(a,b,c,d,e,f,g){if(c){if(b.flags&256)return b.flags&=-257,d=Li$1(Error(p$4(422))),tj(a,b,g,d);if(null!==b.memoizedState)return b.child=a.child,b.flags|=128,null;f=d.fallback;e=b.mode;d=qj({mode:"visible",children:d.children},e,0,null);f=Ah(f,e,g,null);f.flags|=2;d.return=b;f.return=b;d.sibling=f;b.child=d;0!==(b.mode&1)&&Bh(b,a.child,null,g);b.child.memoizedState=oj(g);b.memoizedState=nj;return f}if(0===(b.mode&1))return tj(a,b,g,null);if("$!"===e.data){d=e.nextSibling&&e.nextSibling.dataset;
if(d)var h=d.dgst;d=h;f=Error(p$4(419));d=Li$1(f,d,void 0);return tj(a,b,g,d)}h=0!==(g&a.childLanes);if(Ug||h){d=R$3;if(null!==d){switch(g&-g){case 4:e=2;break;case 16:e=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:e=32;break;case 536870912:e=268435456;break;default:e=0;}e=0!==(e&(d.suspendedLanes|g))?0:e;
0!==e&&e!==f.retryLane&&(f.retryLane=e,Zg(a,e),mh(d,a,e,-1));}uj();d=Li$1(Error(p$4(421)));return tj(a,b,g,d)}if("$?"===e.data)return b.flags|=128,b.child=a.child,b=vj.bind(null,a),e._reactRetry=b,null;a=f.treeContext;yg=Lf(e.nextSibling);xg=b;I$2=!0;zg=null;null!==a&&(og[pg++]=rg,og[pg++]=sg,og[pg++]=qg,rg=a.id,sg=a.overflow,qg=b);b=rj(b,d.children);b.flags|=4096;return b}function wj(a,b,c){a.lanes|=b;var d=a.alternate;null!==d&&(d.lanes|=b);Sg(a.return,b,c);}
function xj(a,b,c,d,e){var f=a.memoizedState;null===f?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e}:(f.isBackwards=b,f.rendering=null,f.renderingStartTime=0,f.last=d,f.tail=c,f.tailMode=e);}
function yj(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;Yi$1(a,b,d.children,c);d=M$4.current;if(0!==(d&2))d=d&1|2,b.flags|=128;else {if(null!==a&&0!==(a.flags&128))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&wj(a,c,b);else if(19===a.tag)wj(a,c,b);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return;}a.sibling.return=a.return;a=a.sibling;}d&=1;}G$1(M$4,d);if(0===(b.mode&1))b.memoizedState=
null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===Mh(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);xj(b,!1,e,c,f);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===Mh(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a;}xj(b,!0,c,null,f);break;case "together":xj(b,!1,null,null,void 0);break;default:b.memoizedState=null;}return b.child}
function jj(a,b){0===(b.mode&1)&&null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);}function $i$1(a,b,c){null!==a&&(b.dependencies=a.dependencies);hh|=b.lanes;if(0===(c&b.childLanes))return null;if(null!==a&&b.child!==a.child)throw Error(p$4(153));if(null!==b.child){a=b.child;c=wh(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=wh(a,a.pendingProps),c.return=b;c.sibling=null;}return b.child}
function zj(a,b,c){switch(b.tag){case 3:lj(b);Ig();break;case 5:Kh(b);break;case 1:Zf(b.type)&&cg(b);break;case 4:Ih(b,b.stateNode.containerInfo);break;case 10:var d=b.type._context,e=b.memoizedProps.value;G$1(Mg,d._currentValue);d._currentValue=e;break;case 13:d=b.memoizedState;if(null!==d){if(null!==d.dehydrated)return G$1(M$4,M$4.current&1),b.flags|=128,null;if(0!==(c&b.child.childLanes))return pj(a,b,c);G$1(M$4,M$4.current&1);a=$i$1(a,b,c);return null!==a?a.sibling:null}G$1(M$4,M$4.current&1);break;case 19:d=0!==(c&
b.childLanes);if(0!==(a.flags&128)){if(d)return yj(a,b,c);b.flags|=128;}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);G$1(M$4,M$4.current);if(d)break;else return null;case 22:case 23:return b.lanes=0,ej(a,b,c)}return $i$1(a,b,c)}var Aj,Bj,Cj,Dj;
Aj=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;}c.sibling.return=c.return;c=c.sibling;}};Bj=function(){};
Cj=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;Hh(Eh.current);var f=null;switch(c){case "input":e=Ya(a,e);d=Ya(a,d);f=[];break;case "select":e=A$4({},e,{value:void 0});d=A$4({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=Bf);}ub(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&
(c||(c={}),c[g]="");}else "dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ea.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||(c={}),c[g]=k[g]);}else c||(f||(f=[]),f.push(l,
c)),c=k;else "dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ea.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&D$3("scroll",a),f||h===k||(f=[])):(f=f||[]).push(l,k));}c&&(f=f||[]).push("style",c);var l=f;if(b.updateQueue=l)b.flags|=4;}};Dj=function(a,b,c,d){c!==d&&(b.flags|=4);};
function Ej(a,b){if(!I$2)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null;}}
function S$5(a){var b=null!==a.alternate&&a.alternate.child===a.child,c=0,d=0;if(b)for(var e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags&14680064,d|=e.flags&14680064,e.return=a,e=e.sibling;else for(e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags,d|=e.flags,e.return=a,e=e.sibling;a.subtreeFlags|=d;a.childLanes=c;return b}
function Fj(a,b,c){var d=b.pendingProps;wg(b);switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return S$5(b),null;case 1:return Zf(b.type)&&$f(),S$5(b),null;case 3:d=b.stateNode;Jh();E$4(Wf);E$4(H$2);Oh();d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)Gg(b)?b.flags|=4:null===a||a.memoizedState.isDehydrated&&0===(b.flags&256)||(b.flags|=1024,null!==zg&&(Gj(zg),zg=null));Bj(a,b);S$5(b);return null;case 5:Lh(b);var e=Hh(Gh.current);
c=b.type;if(null!==a&&null!=b.stateNode)Cj(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=512,b.flags|=2097152);else {if(!d){if(null===b.stateNode)throw Error(p$4(166));S$5(b);return null}a=Hh(Eh.current);if(Gg(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[Of]=b;d[Pf]=f;a=0!==(b.mode&1);switch(c){case "dialog":D$3("cancel",d);D$3("close",d);break;case "iframe":case "object":case "embed":D$3("load",d);break;case "video":case "audio":for(e=0;e<lf.length;e++)D$3(lf[e],d);break;case "source":D$3("error",d);break;case "img":case "image":case "link":D$3("error",
d);D$3("load",d);break;case "details":D$3("toggle",d);break;case "input":Za(d,f);D$3("invalid",d);break;case "select":d._wrapperState={wasMultiple:!!f.multiple};D$3("invalid",d);break;case "textarea":hb(d,f),D$3("invalid",d);}ub(c,f);e=null;for(var g in f)if(f.hasOwnProperty(g)){var h=f[g];"children"===g?"string"===typeof h?d.textContent!==h&&(!0!==f.suppressHydrationWarning&&Af(d.textContent,h,a),e=["children",h]):"number"===typeof h&&d.textContent!==""+h&&(!0!==f.suppressHydrationWarning&&Af(d.textContent,
h,a),e=["children",""+h]):ea.hasOwnProperty(g)&&null!=h&&"onScroll"===g&&D$3("scroll",d);}switch(c){case "input":Va(d);db(d,f,!0);break;case "textarea":Va(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=Bf);}d=e;b.updateQueue=d;null!==d&&(b.flags|=4);}else {g=9===e.nodeType?e:e.ownerDocument;"http://www.w3.org/1999/xhtml"===a&&(a=kb(c));"http://www.w3.org/1999/xhtml"===a?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):
"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=!0:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[Of]=b;a[Pf]=d;Aj(a,b,!1,!1);b.stateNode=a;a:{g=vb(c,d);switch(c){case "dialog":D$3("cancel",a);D$3("close",a);e=d;break;case "iframe":case "object":case "embed":D$3("load",a);e=d;break;case "video":case "audio":for(e=0;e<lf.length;e++)D$3(lf[e],a);e=d;break;case "source":D$3("error",a);e=d;break;case "img":case "image":case "link":D$3("error",
a);D$3("load",a);e=d;break;case "details":D$3("toggle",a);e=d;break;case "input":Za(a,d);e=Ya(a,d);D$3("invalid",a);break;case "option":e=d;break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=A$4({},d,{value:void 0});D$3("invalid",a);break;case "textarea":hb(a,d);e=gb(a,d);D$3("invalid",a);break;default:e=d;}ub(c,e);h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?sb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&nb(a,k)):"children"===f?"string"===typeof k?("textarea"!==
c||""!==k)&&ob(a,k):"number"===typeof k&&ob(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ea.hasOwnProperty(f)?null!=k&&"onScroll"===f&&D$3("scroll",a):null!=k&&ta(a,f,k,g));}switch(c){case "input":Va(a);db(a,d,!1);break;case "textarea":Va(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,!1):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,
!0);break;default:"function"===typeof e.onClick&&(a.onclick=Bf);}switch(c){case "button":case "input":case "select":case "textarea":d=!!d.autoFocus;break a;case "img":d=!0;break a;default:d=!1;}}d&&(b.flags|=4);}null!==b.ref&&(b.flags|=512,b.flags|=2097152);}S$5(b);return null;case 6:if(a&&null!=b.stateNode)Dj(a,b,a.memoizedProps,d);else {if("string"!==typeof d&&null===b.stateNode)throw Error(p$4(166));c=Hh(Gh.current);Hh(Eh.current);if(Gg(b)){d=b.stateNode;c=b.memoizedProps;d[Of]=b;if(f=d.nodeValue!==c)if(a=
xg,null!==a)switch(a.tag){case 3:Af(d.nodeValue,c,0!==(a.mode&1));break;case 5:!0!==a.memoizedProps.suppressHydrationWarning&&Af(d.nodeValue,c,0!==(a.mode&1));}f&&(b.flags|=4);}else d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[Of]=b,b.stateNode=d;}S$5(b);return null;case 13:E$4(M$4);d=b.memoizedState;if(null===a||null!==a.memoizedState&&null!==a.memoizedState.dehydrated){if(I$2&&null!==yg&&0!==(b.mode&1)&&0===(b.flags&128))Hg(),Ig(),b.flags|=98560,f=!1;else if(f=Gg(b),null!==d&&null!==d.dehydrated){if(null===
a){if(!f)throw Error(p$4(318));f=b.memoizedState;f=null!==f?f.dehydrated:null;if(!f)throw Error(p$4(317));f[Of]=b;}else Ig(),0===(b.flags&128)&&(b.memoizedState=null),b.flags|=4;S$5(b);f=!1;}else null!==zg&&(Gj(zg),zg=null),f=!0;if(!f)return b.flags&65536?b:null}if(0!==(b.flags&128))return b.lanes=c,b;d=null!==d;d!==(null!==a&&null!==a.memoizedState)&&d&&(b.child.flags|=8192,0!==(b.mode&1)&&(null===a||0!==(M$4.current&1)?0===T$4&&(T$4=3):uj()));null!==b.updateQueue&&(b.flags|=4);S$5(b);return null;case 4:return Jh(),
Bj(a,b),null===a&&sf(b.stateNode.containerInfo),S$5(b),null;case 10:return Rg(b.type._context),S$5(b),null;case 17:return Zf(b.type)&&$f(),S$5(b),null;case 19:E$4(M$4);f=b.memoizedState;if(null===f)return S$5(b),null;d=0!==(b.flags&128);g=f.rendering;if(null===g)if(d)Ej(f,!1);else {if(0!==T$4||null!==a&&0!==(a.flags&128))for(a=b.child;null!==a;){g=Mh(a);if(null!==g){b.flags|=128;Ej(f,!1);d=g.updateQueue;null!==d&&(b.updateQueue=d,b.flags|=4);b.subtreeFlags=0;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=14680066,
g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.subtreeFlags=0,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.subtreeFlags=0,f.deletions=null,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;G$1(M$4,M$4.current&1|2);return b.child}a=
a.sibling;}null!==f.tail&&B$3()>Hj&&(b.flags|=128,d=!0,Ej(f,!1),b.lanes=4194304);}else {if(!d)if(a=Mh(g),null!==a){if(b.flags|=128,d=!0,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Ej(f,!0),null===f.tail&&"hidden"===f.tailMode&&!g.alternate&&!I$2)return S$5(b),null}else 2*B$3()-f.renderingStartTime>Hj&&1073741824!==c&&(b.flags|=128,d=!0,Ej(f,!1),b.lanes=4194304);f.isBackwards?(g.sibling=b.child,b.child=g):(c=f.last,null!==c?c.sibling=g:b.child=g,f.last=g);}if(null!==f.tail)return b=f.tail,f.rendering=
b,f.tail=b.sibling,f.renderingStartTime=B$3(),b.sibling=null,c=M$4.current,G$1(M$4,d?c&1|2:c&1),b;S$5(b);return null;case 22:case 23:return Ij(),d=null!==b.memoizedState,null!==a&&null!==a.memoizedState!==d&&(b.flags|=8192),d&&0!==(b.mode&1)?0!==(gj&1073741824)&&(S$5(b),b.subtreeFlags&6&&(b.flags|=8192)):S$5(b),null;case 24:return null;case 25:return null}throw Error(p$4(156,b.tag));}
function Jj(a,b){wg(b);switch(b.tag){case 1:return Zf(b.type)&&$f(),a=b.flags,a&65536?(b.flags=a&-65537|128,b):null;case 3:return Jh(),E$4(Wf),E$4(H$2),Oh(),a=b.flags,0!==(a&65536)&&0===(a&128)?(b.flags=a&-65537|128,b):null;case 5:return Lh(b),null;case 13:E$4(M$4);a=b.memoizedState;if(null!==a&&null!==a.dehydrated){if(null===b.alternate)throw Error(p$4(340));Ig();}a=b.flags;return a&65536?(b.flags=a&-65537|128,b):null;case 19:return E$4(M$4),null;case 4:return Jh(),null;case 10:return Rg(b.type._context),null;case 22:case 23:return Ij(),
null;case 24:return null;default:return null}}var Kj=!1,U$1=!1,Lj="function"===typeof WeakSet?WeakSet:Set,V$1=null;function Mj(a,b){var c=a.ref;if(null!==c)if("function"===typeof c)try{c(null);}catch(d){W$1(a,b,d);}else c.current=null;}function Nj(a,b,c){try{c();}catch(d){W$1(a,b,d);}}var Oj=!1;
function Pj(a,b){Cf=dd;a=Me$1();if(Ne$1(a)){if("selectionStart"in a)var c={start:a.selectionStart,end:a.selectionEnd};else a:{c=(c=a.ownerDocument)&&c.defaultView||window;var d=c.getSelection&&c.getSelection();if(d&&0!==d.rangeCount){c=d.anchorNode;var e=d.anchorOffset,f=d.focusNode;d=d.focusOffset;try{c.nodeType,f.nodeType;}catch(F){c=null;break a}var g=0,h=-1,k=-1,l=0,m=0,q=a,r=null;b:for(;;){for(var y;;){q!==c||0!==e&&3!==q.nodeType||(h=g+e);q!==f||0!==d&&3!==q.nodeType||(k=g+d);3===q.nodeType&&(g+=
q.nodeValue.length);if(null===(y=q.firstChild))break;r=q;q=y;}for(;;){if(q===a)break b;r===c&&++l===e&&(h=g);r===f&&++m===d&&(k=g);if(null!==(y=q.nextSibling))break;q=r;r=q.parentNode;}q=y;}c=-1===h||-1===k?null:{start:h,end:k};}else c=null;}c=c||{start:0,end:0};}else c=null;Df={focusedElem:a,selectionRange:c};dd=!1;for(V$1=b;null!==V$1;)if(b=V$1,a=b.child,0!==(b.subtreeFlags&1028)&&null!==a)a.return=b,V$1=a;else for(;null!==V$1;){b=V$1;try{var n=b.alternate;if(0!==(b.flags&1024))switch(b.tag){case 0:case 11:case 15:break;
case 1:if(null!==n){var t=n.memoizedProps,J=n.memoizedState,x=b.stateNode,w=x.getSnapshotBeforeUpdate(b.elementType===b.type?t:Lg(b.type,t),J);x.__reactInternalSnapshotBeforeUpdate=w;}break;case 3:var u=b.stateNode.containerInfo;1===u.nodeType?u.textContent="":9===u.nodeType&&u.documentElement&&u.removeChild(u.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(p$4(163));}}catch(F){W$1(b,b.return,F);}a=b.sibling;if(null!==a){a.return=b.return;V$1=a;break}V$1=b.return;}n=Oj;Oj=!1;return n}
function Qj(a,b,c){var d=b.updateQueue;d=null!==d?d.lastEffect:null;if(null!==d){var e=d=d.next;do{if((e.tag&a)===a){var f=e.destroy;e.destroy=void 0;void 0!==f&&Nj(b,c,f);}e=e.next;}while(e!==d)}}function Rj(a,b){b=b.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){var c=b=b.next;do{if((c.tag&a)===a){var d=c.create;c.destroy=d();}c=c.next;}while(c!==b)}}function Sj(a){var b=a.ref;if(null!==b){var c=a.stateNode;switch(a.tag){case 5:a=c;break;default:a=c;}"function"===typeof b?b(a):b.current=a;}}
function Tj(a){var b=a.alternate;null!==b&&(a.alternate=null,Tj(b));a.child=null;a.deletions=null;a.sibling=null;5===a.tag&&(b=a.stateNode,null!==b&&(delete b[Of],delete b[Pf],delete b[of],delete b[Qf],delete b[Rf]));a.stateNode=null;a.return=null;a.dependencies=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.stateNode=null;a.updateQueue=null;}function Uj(a){return 5===a.tag||3===a.tag||4===a.tag}
function Vj(a){a:for(;;){for(;null===a.sibling;){if(null===a.return||Uj(a.return))return null;a=a.return;}a.sibling.return=a.return;for(a=a.sibling;5!==a.tag&&6!==a.tag&&18!==a.tag;){if(a.flags&2)continue a;if(null===a.child||4===a.tag)continue a;else a.child.return=a,a=a.child;}if(!(a.flags&2))return a.stateNode}}
function Wj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=Bf));else if(4!==d&&(a=a.child,null!==a))for(Wj(a,b,c),a=a.sibling;null!==a;)Wj(a,b,c),a=a.sibling;}
function Xj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(Xj(a,b,c),a=a.sibling;null!==a;)Xj(a,b,c),a=a.sibling;}var X$1=null,Yj=!1;function Zj(a,b,c){for(c=c.child;null!==c;)ak(a,b,c),c=c.sibling;}
function ak(a,b,c){if(lc&&"function"===typeof lc.onCommitFiberUnmount)try{lc.onCommitFiberUnmount(kc,c);}catch(h){}switch(c.tag){case 5:U$1||Mj(c,b);case 6:var d=X$1,e=Yj;X$1=null;Zj(a,b,c);X$1=d;Yj=e;null!==X$1&&(Yj?(a=X$1,c=c.stateNode,8===a.nodeType?a.parentNode.removeChild(c):a.removeChild(c)):X$1.removeChild(c.stateNode));break;case 18:null!==X$1&&(Yj?(a=X$1,c=c.stateNode,8===a.nodeType?Kf(a.parentNode,c):1===a.nodeType&&Kf(a,c),bd(a)):Kf(X$1,c.stateNode));break;case 4:d=X$1;e=Yj;X$1=c.stateNode.containerInfo;Yj=!0;
Zj(a,b,c);X$1=d;Yj=e;break;case 0:case 11:case 14:case 15:if(!U$1&&(d=c.updateQueue,null!==d&&(d=d.lastEffect,null!==d))){e=d=d.next;do{var f=e,g=f.destroy;f=f.tag;void 0!==g&&(0!==(f&2)?Nj(c,b,g):0!==(f&4)&&Nj(c,b,g));e=e.next;}while(e!==d)}Zj(a,b,c);break;case 1:if(!U$1&&(Mj(c,b),d=c.stateNode,"function"===typeof d.componentWillUnmount))try{d.props=c.memoizedProps,d.state=c.memoizedState,d.componentWillUnmount();}catch(h){W$1(c,b,h);}Zj(a,b,c);break;case 21:Zj(a,b,c);break;case 22:c.mode&1?(U$1=(d=U$1)||null!==
c.memoizedState,Zj(a,b,c),U$1=d):Zj(a,b,c);break;default:Zj(a,b,c);}}function bk(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Lj);b.forEach(function(b){var d=ck.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d));});}}
function dk(a,b){var c=b.deletions;if(null!==c)for(var d=0;d<c.length;d++){var e=c[d];try{var f=a,g=b,h=g;a:for(;null!==h;){switch(h.tag){case 5:X$1=h.stateNode;Yj=!1;break a;case 3:X$1=h.stateNode.containerInfo;Yj=!0;break a;case 4:X$1=h.stateNode.containerInfo;Yj=!0;break a}h=h.return;}if(null===X$1)throw Error(p$4(160));ak(f,g,e);X$1=null;Yj=!1;var k=e.alternate;null!==k&&(k.return=null);e.return=null;}catch(l){W$1(e,b,l);}}if(b.subtreeFlags&12854)for(b=b.child;null!==b;)ek(b,a),b=b.sibling;}
function ek(a,b){var c=a.alternate,d=a.flags;switch(a.tag){case 0:case 11:case 14:case 15:dk(b,a);fk(a);if(d&4){try{Qj(3,a,a.return),Rj(3,a);}catch(t){W$1(a,a.return,t);}try{Qj(5,a,a.return);}catch(t){W$1(a,a.return,t);}}break;case 1:dk(b,a);fk(a);d&512&&null!==c&&Mj(c,c.return);break;case 5:dk(b,a);fk(a);d&512&&null!==c&&Mj(c,c.return);if(a.flags&32){var e=a.stateNode;try{ob(e,"");}catch(t){W$1(a,a.return,t);}}if(d&4&&(e=a.stateNode,null!=e)){var f=a.memoizedProps,g=null!==c?c.memoizedProps:f,h=a.type,k=a.updateQueue;
a.updateQueue=null;if(null!==k)try{"input"===h&&"radio"===f.type&&null!=f.name&&ab(e,f);vb(h,g);var l=vb(h,f);for(g=0;g<k.length;g+=2){var m=k[g],q=k[g+1];"style"===m?sb(e,q):"dangerouslySetInnerHTML"===m?nb(e,q):"children"===m?ob(e,q):ta(e,m,q,l);}switch(h){case "input":bb(e,f);break;case "textarea":ib(e,f);break;case "select":var r=e._wrapperState.wasMultiple;e._wrapperState.wasMultiple=!!f.multiple;var y=f.value;null!=y?fb(e,!!f.multiple,y,!1):r!==!!f.multiple&&(null!=f.defaultValue?fb(e,!!f.multiple,
f.defaultValue,!0):fb(e,!!f.multiple,f.multiple?[]:"",!1));}e[Pf]=f;}catch(t){W$1(a,a.return,t);}}break;case 6:dk(b,a);fk(a);if(d&4){if(null===a.stateNode)throw Error(p$4(162));e=a.stateNode;f=a.memoizedProps;try{e.nodeValue=f;}catch(t){W$1(a,a.return,t);}}break;case 3:dk(b,a);fk(a);if(d&4&&null!==c&&c.memoizedState.isDehydrated)try{bd(b.containerInfo);}catch(t){W$1(a,a.return,t);}break;case 4:dk(b,a);fk(a);break;case 13:dk(b,a);fk(a);e=a.child;e.flags&8192&&(f=null!==e.memoizedState,e.stateNode.isHidden=f,!f||
null!==e.alternate&&null!==e.alternate.memoizedState||(gk=B$3()));d&4&&bk(a);break;case 22:m=null!==c&&null!==c.memoizedState;a.mode&1?(U$1=(l=U$1)||m,dk(b,a),U$1=l):dk(b,a);fk(a);if(d&8192){l=null!==a.memoizedState;if((a.stateNode.isHidden=l)&&!m&&0!==(a.mode&1))for(V$1=a,m=a.child;null!==m;){for(q=V$1=m;null!==V$1;){r=V$1;y=r.child;switch(r.tag){case 0:case 11:case 14:case 15:Qj(4,r,r.return);break;case 1:Mj(r,r.return);var n=r.stateNode;if("function"===typeof n.componentWillUnmount){d=r;c=r.return;try{b=d,n.props=
b.memoizedProps,n.state=b.memoizedState,n.componentWillUnmount();}catch(t){W$1(d,c,t);}}break;case 5:Mj(r,r.return);break;case 22:if(null!==r.memoizedState){hk(q);continue}}null!==y?(y.return=r,V$1=y):hk(q);}m=m.sibling;}a:for(m=null,q=a;;){if(5===q.tag){if(null===m){m=q;try{e=q.stateNode,l?(f=e.style,"function"===typeof f.setProperty?f.setProperty("display","none","important"):f.display="none"):(h=q.stateNode,k=q.memoizedProps.style,g=void 0!==k&&null!==k&&k.hasOwnProperty("display")?k.display:null,h.style.display=
rb("display",g));}catch(t){W$1(a,a.return,t);}}}else if(6===q.tag){if(null===m)try{q.stateNode.nodeValue=l?"":q.memoizedProps;}catch(t){W$1(a,a.return,t);}}else if((22!==q.tag&&23!==q.tag||null===q.memoizedState||q===a)&&null!==q.child){q.child.return=q;q=q.child;continue}if(q===a)break a;for(;null===q.sibling;){if(null===q.return||q.return===a)break a;m===q&&(m=null);q=q.return;}m===q&&(m=null);q.sibling.return=q.return;q=q.sibling;}}break;case 19:dk(b,a);fk(a);d&4&&bk(a);break;case 21:break;default:dk(b,
a),fk(a);}}function fk(a){var b=a.flags;if(b&2){try{a:{for(var c=a.return;null!==c;){if(Uj(c)){var d=c;break a}c=c.return;}throw Error(p$4(160));}switch(d.tag){case 5:var e=d.stateNode;d.flags&32&&(ob(e,""),d.flags&=-33);var f=Vj(a);Xj(a,f,e);break;case 3:case 4:var g=d.stateNode.containerInfo,h=Vj(a);Wj(a,h,g);break;default:throw Error(p$4(161));}}catch(k){W$1(a,a.return,k);}a.flags&=-3;}b&4096&&(a.flags&=-4097);}function ik(a,b,c){V$1=a;jk(a);}
function jk(a,b,c){for(var d=0!==(a.mode&1);null!==V$1;){var e=V$1,f=e.child;if(22===e.tag&&d){var g=null!==e.memoizedState||Kj;if(!g){var h=e.alternate,k=null!==h&&null!==h.memoizedState||U$1;h=Kj;var l=U$1;Kj=g;if((U$1=k)&&!l)for(V$1=e;null!==V$1;)g=V$1,k=g.child,22===g.tag&&null!==g.memoizedState?kk(e):null!==k?(k.return=g,V$1=k):kk(e);for(;null!==f;)V$1=f,jk(f),f=f.sibling;V$1=e;Kj=h;U$1=l;}lk(a);}else 0!==(e.subtreeFlags&8772)&&null!==f?(f.return=e,V$1=f):lk(a);}}
function lk(a){for(;null!==V$1;){var b=V$1;if(0!==(b.flags&8772)){var c=b.alternate;try{if(0!==(b.flags&8772))switch(b.tag){case 0:case 11:case 15:U$1||Rj(5,b);break;case 1:var d=b.stateNode;if(b.flags&4&&!U$1)if(null===c)d.componentDidMount();else {var e=b.elementType===b.type?c.memoizedProps:Lg(b.type,c.memoizedProps);d.componentDidUpdate(e,c.memoizedState,d.__reactInternalSnapshotBeforeUpdate);}var f=b.updateQueue;null!==f&&ih(b,f,d);break;case 3:var g=b.updateQueue;if(null!==g){c=null;if(null!==b.child)switch(b.child.tag){case 5:c=
b.child.stateNode;break;case 1:c=b.child.stateNode;}ih(b,g,c);}break;case 5:var h=b.stateNode;if(null===c&&b.flags&4){c=h;var k=b.memoizedProps;switch(b.type){case "button":case "input":case "select":case "textarea":k.autoFocus&&c.focus();break;case "img":k.src&&(c.src=k.src);}}break;case 6:break;case 4:break;case 12:break;case 13:if(null===b.memoizedState){var l=b.alternate;if(null!==l){var m=l.memoizedState;if(null!==m){var q=m.dehydrated;null!==q&&bd(q);}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;
default:throw Error(p$4(163));}U$1||b.flags&512&&Sj(b);}catch(r){W$1(b,b.return,r);}}if(b===a){V$1=null;break}c=b.sibling;if(null!==c){c.return=b.return;V$1=c;break}V$1=b.return;}}function hk(a){for(;null!==V$1;){var b=V$1;if(b===a){V$1=null;break}var c=b.sibling;if(null!==c){c.return=b.return;V$1=c;break}V$1=b.return;}}
function kk(a){for(;null!==V$1;){var b=V$1;try{switch(b.tag){case 0:case 11:case 15:var c=b.return;try{Rj(4,b);}catch(k){W$1(b,c,k);}break;case 1:var d=b.stateNode;if("function"===typeof d.componentDidMount){var e=b.return;try{d.componentDidMount();}catch(k){W$1(b,e,k);}}var f=b.return;try{Sj(b);}catch(k){W$1(b,f,k);}break;case 5:var g=b.return;try{Sj(b);}catch(k){W$1(b,g,k);}}}catch(k){W$1(b,b.return,k);}if(b===a){V$1=null;break}var h=b.sibling;if(null!==h){h.return=b.return;V$1=h;break}V$1=b.return;}}
var mk=Math.ceil,nk=ua.ReactCurrentDispatcher,ok=ua.ReactCurrentOwner,pk=ua.ReactCurrentBatchConfig,K$3=0,R$3=null,Y$1=null,Z$1=0,gj=0,fj=Uf(0),T$4=0,qk=null,hh=0,rk=0,sk=0,tk=null,uk=null,gk=0,Hj=Infinity,vk=null,Pi$1=!1,Qi$1=null,Si$1=null,wk=!1,xk=null,yk=0,zk=0,Ak=null,Bk=-1,Ck=0;function L$3(){return 0!==(K$3&6)?B$3():-1!==Bk?Bk:Bk=B$3()}
function lh(a){if(0===(a.mode&1))return 1;if(0!==(K$3&2)&&0!==Z$1)return Z$1&-Z$1;if(null!==Kg.transition)return 0===Ck&&(Ck=yc()),Ck;a=C$5;if(0!==a)return a;a=window.event;a=void 0===a?16:jd(a.type);return a}function mh(a,b,c,d){if(50<zk)throw zk=0,Ak=null,Error(p$4(185));Ac(a,c,d);if(0===(K$3&2)||a!==R$3)a===R$3&&(0===(K$3&2)&&(rk|=c),4===T$4&&Dk(a,Z$1)),Ek(a,d),1===c&&0===K$3&&0===(b.mode&1)&&(Hj=B$3()+500,fg&&jg());}
function Ek(a,b){var c=a.callbackNode;wc(a,b);var d=uc(a,a===R$3?Z$1:0);if(0===d)null!==c&&bc(c),a.callbackNode=null,a.callbackPriority=0;else if(b=d&-d,a.callbackPriority!==b){null!=c&&bc(c);if(1===b)0===a.tag?ig(Fk.bind(null,a)):hg(Fk.bind(null,a)),Jf(function(){0===(K$3&6)&&jg();}),c=null;else {switch(Dc(d)){case 1:c=fc;break;case 4:c=gc;break;case 16:c=hc;break;case 536870912:c=jc;break;default:c=hc;}c=Gk(c,Hk.bind(null,a));}a.callbackPriority=b;a.callbackNode=c;}}
function Hk(a,b){Bk=-1;Ck=0;if(0!==(K$3&6))throw Error(p$4(327));var c=a.callbackNode;if(Ik()&&a.callbackNode!==c)return null;var d=uc(a,a===R$3?Z$1:0);if(0===d)return null;if(0!==(d&30)||0!==(d&a.expiredLanes)||b)b=Jk(a,d);else {b=d;var e=K$3;K$3|=2;var f=Kk();if(R$3!==a||Z$1!==b)vk=null,Hj=B$3()+500,Lk(a,b);do try{Mk();break}catch(h){Nk(a,h);}while(1);Qg();nk.current=f;K$3=e;null!==Y$1?b=0:(R$3=null,Z$1=0,b=T$4);}if(0!==b){2===b&&(e=xc(a),0!==e&&(d=e,b=Ok(a,e)));if(1===b)throw c=qk,Lk(a,0),Dk(a,d),Ek(a,B$3()),c;if(6===b)Dk(a,d);
else {e=a.current.alternate;if(0===(d&30)&&!Pk(e)&&(b=Jk(a,d),2===b&&(f=xc(a),0!==f&&(d=f,b=Ok(a,f))),1===b))throw c=qk,Lk(a,0),Dk(a,d),Ek(a,B$3()),c;a.finishedWork=e;a.finishedLanes=d;switch(b){case 0:case 1:throw Error(p$4(345));case 2:Qk(a,uk,vk);break;case 3:Dk(a,d);if((d&130023424)===d&&(b=gk+500-B$3(),10<b)){if(0!==uc(a,0))break;e=a.suspendedLanes;if((e&d)!==d){L$3();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=Ff(Qk.bind(null,a,uk,vk),b);break}Qk(a,uk,vk);break;case 4:Dk(a,d);if((d&4194240)===
d)break;b=a.eventTimes;for(e=-1;0<d;){var g=31-oc(d);f=1<<g;g=b[g];g>e&&(e=g);d&=~f;}d=e;d=B$3()-d;d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3E3>d?3E3:4320>d?4320:1960*mk(d/1960))-d;if(10<d){a.timeoutHandle=Ff(Qk.bind(null,a,uk,vk),d);break}Qk(a,uk,vk);break;case 5:Qk(a,uk,vk);break;default:throw Error(p$4(329));}}}Ek(a,B$3());return a.callbackNode===c?Hk.bind(null,a):null}
function Ok(a,b){var c=tk;a.current.memoizedState.isDehydrated&&(Lk(a,b).flags|=256);a=Jk(a,b);2!==a&&(b=uk,uk=c,null!==b&&Gj(b));return a}function Gj(a){null===uk?uk=a:uk.push.apply(uk,a);}
function Pk(a){for(var b=a;;){if(b.flags&16384){var c=b.updateQueue;if(null!==c&&(c=c.stores,null!==c))for(var d=0;d<c.length;d++){var e=c[d],f=e.getSnapshot;e=e.value;try{if(!He$1(f(),e))return !1}catch(g){return !1}}}c=b.child;if(b.subtreeFlags&16384&&null!==c)c.return=b,b=c;else {if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return !0;b=b.return;}b.sibling.return=b.return;b=b.sibling;}}return !0}
function Dk(a,b){b&=~sk;b&=~rk;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-oc(b),d=1<<c;a[c]=-1;b&=~d;}}function Fk(a){if(0!==(K$3&6))throw Error(p$4(327));Ik();var b=uc(a,0);if(0===(b&1))return Ek(a,B$3()),null;var c=Jk(a,b);if(0!==a.tag&&2===c){var d=xc(a);0!==d&&(b=d,c=Ok(a,d));}if(1===c)throw c=qk,Lk(a,0),Dk(a,b),Ek(a,B$3()),c;if(6===c)throw Error(p$4(345));a.finishedWork=a.current.alternate;a.finishedLanes=b;Qk(a,uk,vk);Ek(a,B$3());return null}
function Rk(a,b){var c=K$3;K$3|=1;try{return a(b)}finally{K$3=c,0===K$3&&(Hj=B$3()+500,fg&&jg());}}function Sk(a){null!==xk&&0===xk.tag&&0===(K$3&6)&&Ik();var b=K$3;K$3|=1;var c=pk.transition,d=C$5;try{if(pk.transition=null,C$5=1,a)return a()}finally{C$5=d,pk.transition=c,K$3=b,0===(K$3&6)&&jg();}}function Ij(){gj=fj.current;E$4(fj);}
function Lk(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,Gf(c));if(null!==Y$1)for(c=Y$1.return;null!==c;){var d=c;wg(d);switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&$f();break;case 3:Jh();E$4(Wf);E$4(H$2);Oh();break;case 5:Lh(d);break;case 4:Jh();break;case 13:E$4(M$4);break;case 19:E$4(M$4);break;case 10:Rg(d.type._context);break;case 22:case 23:Ij();}c=c.return;}R$3=a;Y$1=a=wh(a.current,null);Z$1=gj=b;T$4=0;qk=null;sk=rk=hh=0;uk=tk=null;if(null!==Wg){for(b=
0;b<Wg.length;b++)if(c=Wg[b],d=c.interleaved,null!==d){c.interleaved=null;var e=d.next,f=c.pending;if(null!==f){var g=f.next;f.next=e;d.next=g;}c.pending=d;}Wg=null;}return a}
function Nk(a,b){do{var c=Y$1;try{Qg();Ph.current=ai$1;if(Sh){for(var d=N$4.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next;}Sh=!1;}Rh=0;P$4=O$3=N$4=null;Th=!1;Uh=0;ok.current=null;if(null===c||null===c.return){T$4=1;qk=b;Y$1=null;break}a:{var f=a,g=c.return,h=c,k=b;b=Z$1;h.flags|=32768;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k,m=h,q=m.tag;if(0===(m.mode&1)&&(0===q||11===q||15===q)){var r=m.alternate;r?(m.updateQueue=r.updateQueue,m.memoizedState=r.memoizedState,
m.lanes=r.lanes):(m.updateQueue=null,m.memoizedState=null);}var y=Vi$1(g);if(null!==y){y.flags&=-257;Wi$1(y,g,h,f,b);y.mode&1&&Ti$1(f,l,b);b=y;k=l;var n=b.updateQueue;if(null===n){var t=new Set;t.add(k);b.updateQueue=t;}else n.add(k);break a}else {if(0===(b&1)){Ti$1(f,l,b);uj();break a}k=Error(p$4(426));}}else if(I$2&&h.mode&1){var J=Vi$1(g);if(null!==J){0===(J.flags&65536)&&(J.flags|=256);Wi$1(J,g,h,f,b);Jg(Ki$1(k,h));break a}}f=k=Ki$1(k,h);4!==T$4&&(T$4=2);null===tk?tk=[f]:tk.push(f);f=g;do{switch(f.tag){case 3:f.flags|=65536;
b&=-b;f.lanes|=b;var x=Oi$1(f,k,b);fh(f,x);break a;case 1:h=k;var w=f.type,u=f.stateNode;if(0===(f.flags&128)&&("function"===typeof w.getDerivedStateFromError||null!==u&&"function"===typeof u.componentDidCatch&&(null===Si$1||!Si$1.has(u)))){f.flags|=65536;b&=-b;f.lanes|=b;var F=Ri$1(f,h,b);fh(f,F);break a}}f=f.return;}while(null!==f)}Tk(c);}catch(na){b=na;Y$1===c&&null!==c&&(Y$1=c=c.return);continue}break}while(1)}function Kk(){var a=nk.current;nk.current=ai$1;return null===a?ai$1:a}
function uj(){if(0===T$4||3===T$4||2===T$4)T$4=4;null===R$3||0===(hh&268435455)&&0===(rk&268435455)||Dk(R$3,Z$1);}function Jk(a,b){var c=K$3;K$3|=2;var d=Kk();if(R$3!==a||Z$1!==b)vk=null,Lk(a,b);do try{Uk();break}catch(e){Nk(a,e);}while(1);Qg();K$3=c;nk.current=d;if(null!==Y$1)throw Error(p$4(261));R$3=null;Z$1=0;return T$4}function Uk(){for(;null!==Y$1;)Vk(Y$1);}function Mk(){for(;null!==Y$1&&!cc();)Vk(Y$1);}function Vk(a){var b=Wk(a.alternate,a,gj);a.memoizedProps=a.pendingProps;null===b?Tk(a):Y$1=b;ok.current=null;}
function Tk(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&32768)){if(c=Fj(c,b,gj),null!==c){Y$1=c;return}}else {c=Jj(c,b);if(null!==c){c.flags&=32767;Y$1=c;return}if(null!==a)a.flags|=32768,a.subtreeFlags=0,a.deletions=null;else {T$4=6;Y$1=null;return}}b=b.sibling;if(null!==b){Y$1=b;return}Y$1=b=a;}while(null!==b);0===T$4&&(T$4=5);}function Qk(a,b,c){var d=C$5,e=pk.transition;try{pk.transition=null,C$5=1,Xk(a,b,c,d);}finally{pk.transition=e,C$5=d;}return null}
function Xk(a,b,c,d){do Ik();while(null!==xk);if(0!==(K$3&6))throw Error(p$4(327));c=a.finishedWork;var e=a.finishedLanes;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(p$4(177));a.callbackNode=null;a.callbackPriority=0;var f=c.lanes|c.childLanes;Bc(a,f);a===R$3&&(Y$1=R$3=null,Z$1=0);0===(c.subtreeFlags&2064)&&0===(c.flags&2064)||wk||(wk=!0,Gk(hc,function(){Ik();return null}));f=0!==(c.flags&15990);if(0!==(c.subtreeFlags&15990)||f){f=pk.transition;pk.transition=null;
var g=C$5;C$5=1;var h=K$3;K$3|=4;ok.current=null;Pj(a,c);ek(c,a);Oe$1(Df);dd=!!Cf;Df=Cf=null;a.current=c;ik(c);dc();K$3=h;C$5=g;pk.transition=f;}else a.current=c;wk&&(wk=!1,xk=a,yk=e);f=a.pendingLanes;0===f&&(Si$1=null);mc(c.stateNode);Ek(a,B$3());if(null!==b)for(d=a.onRecoverableError,c=0;c<b.length;c++)e=b[c],d(e.value,{componentStack:e.stack,digest:e.digest});if(Pi$1)throw Pi$1=!1,a=Qi$1,Qi$1=null,a;0!==(yk&1)&&0!==a.tag&&Ik();f=a.pendingLanes;0!==(f&1)?a===Ak?zk++:(zk=0,Ak=a):zk=0;jg();return null}
function Ik(){if(null!==xk){var a=Dc(yk),b=pk.transition,c=C$5;try{pk.transition=null;C$5=16>a?16:a;if(null===xk)var d=!1;else {a=xk;xk=null;yk=0;if(0!==(K$3&6))throw Error(p$4(331));var e=K$3;K$3|=4;for(V$1=a.current;null!==V$1;){var f=V$1,g=f.child;if(0!==(V$1.flags&16)){var h=f.deletions;if(null!==h){for(var k=0;k<h.length;k++){var l=h[k];for(V$1=l;null!==V$1;){var m=V$1;switch(m.tag){case 0:case 11:case 15:Qj(8,m,f);}var q=m.child;if(null!==q)q.return=m,V$1=q;else for(;null!==V$1;){m=V$1;var r=m.sibling,y=m.return;Tj(m);if(m===
l){V$1=null;break}if(null!==r){r.return=y;V$1=r;break}V$1=y;}}}var n=f.alternate;if(null!==n){var t=n.child;if(null!==t){n.child=null;do{var J=t.sibling;t.sibling=null;t=J;}while(null!==t)}}V$1=f;}}if(0!==(f.subtreeFlags&2064)&&null!==g)g.return=f,V$1=g;else b:for(;null!==V$1;){f=V$1;if(0!==(f.flags&2048))switch(f.tag){case 0:case 11:case 15:Qj(9,f,f.return);}var x=f.sibling;if(null!==x){x.return=f.return;V$1=x;break b}V$1=f.return;}}var w=a.current;for(V$1=w;null!==V$1;){g=V$1;var u=g.child;if(0!==(g.subtreeFlags&2064)&&null!==
u)u.return=g,V$1=u;else b:for(g=w;null!==V$1;){h=V$1;if(0!==(h.flags&2048))try{switch(h.tag){case 0:case 11:case 15:Rj(9,h);}}catch(na){W$1(h,h.return,na);}if(h===g){V$1=null;break b}var F=h.sibling;if(null!==F){F.return=h.return;V$1=F;break b}V$1=h.return;}}K$3=e;jg();if(lc&&"function"===typeof lc.onPostCommitFiberRoot)try{lc.onPostCommitFiberRoot(kc,a);}catch(na){}d=!0;}return d}finally{C$5=c,pk.transition=b;}}return !1}function Yk(a,b,c){b=Ki$1(c,b);b=Oi$1(a,b,1);a=dh(a,b,1);b=L$3();null!==a&&(Ac(a,1,b),Ek(a,b));}
function W$1(a,b,c){if(3===a.tag)Yk(a,a,c);else for(;null!==b;){if(3===b.tag){Yk(b,a,c);break}else if(1===b.tag){var d=b.stateNode;if("function"===typeof b.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Si$1||!Si$1.has(d))){a=Ki$1(c,a);a=Ri$1(b,a,1);b=dh(b,a,1);a=L$3();null!==b&&(Ac(b,1,a),Ek(b,a));break}}b=b.return;}}
function Ui$1(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=L$3();a.pingedLanes|=a.suspendedLanes&c;R$3===a&&(Z$1&c)===c&&(4===T$4||3===T$4&&(Z$1&130023424)===Z$1&&500>B$3()-gk?Lk(a,0):sk|=c);Ek(a,b);}function Zk(a,b){0===b&&(0===(a.mode&1)?b=1:(b=sc,sc<<=1,0===(sc&130023424)&&(sc=4194304)));var c=L$3();a=Zg(a,b);null!==a&&(Ac(a,b,c),Ek(a,c));}function vj(a){var b=a.memoizedState,c=0;null!==b&&(c=b.retryLane);Zk(a,c);}
function ck(a,b){var c=0;switch(a.tag){case 13:var d=a.stateNode;var e=a.memoizedState;null!==e&&(c=e.retryLane);break;case 19:d=a.stateNode;break;default:throw Error(p$4(314));}null!==d&&d.delete(b);Zk(a,c);}var Wk;
Wk=function(a,b,c){if(null!==a)if(a.memoizedProps!==b.pendingProps||Wf.current)Ug=!0;else {if(0===(a.lanes&c)&&0===(b.flags&128))return Ug=!1,zj(a,b,c);Ug=0!==(a.flags&131072)?!0:!1;}else Ug=!1,I$2&&0!==(b.flags&1048576)&&ug(b,ng,b.index);b.lanes=0;switch(b.tag){case 2:var d=b.type;jj(a,b);a=b.pendingProps;var e=Yf(b,H$2.current);Tg(b,c);e=Xh(null,b,d,a,e,c);var f=bi$1();b.flags|=1;"object"===typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof?(b.tag=1,b.memoizedState=null,b.updateQueue=
null,Zf(d)?(f=!0,cg(b)):f=!1,b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null,ah(b),e.updater=nh,b.stateNode=e,e._reactInternals=b,rh(b,d,a,c),b=kj(null,b,d,!0,f,c)):(b.tag=0,I$2&&f&&vg(b),Yi$1(null,b,e,c),b=b.child);return b;case 16:d=b.elementType;a:{jj(a,b);a=b.pendingProps;e=d._init;d=e(d._payload);b.type=d;e=b.tag=$k(d);a=Lg(d,a);switch(e){case 0:b=dj(null,b,d,a,c);break a;case 1:b=ij(null,b,d,a,c);break a;case 11:b=Zi$1(null,b,d,a,c);break a;case 14:b=aj(null,b,d,Lg(d.type,a),c);break a}throw Error(p$4(306,
d,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Lg(d,e),dj(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Lg(d,e),ij(a,b,d,e,c);case 3:a:{lj(b);if(null===a)throw Error(p$4(387));d=b.pendingProps;f=b.memoizedState;e=f.element;bh(a,b);gh(b,d,null,c);var g=b.memoizedState;d=g.element;if(f.isDehydrated)if(f={element:d,isDehydrated:!1,cache:g.cache,pendingSuspenseBoundaries:g.pendingSuspenseBoundaries,transitions:g.transitions},b.updateQueue.baseState=
f,b.memoizedState=f,b.flags&256){e=Ki$1(Error(p$4(423)),b);b=mj(a,b,d,c,e);break a}else if(d!==e){e=Ki$1(Error(p$4(424)),b);b=mj(a,b,d,c,e);break a}else for(yg=Lf(b.stateNode.containerInfo.firstChild),xg=b,I$2=!0,zg=null,c=Ch(b,null,d,c),b.child=c;c;)c.flags=c.flags&-3|4096,c=c.sibling;else {Ig();if(d===e){b=$i$1(a,b,c);break a}Yi$1(a,b,d,c);}b=b.child;}return b;case 5:return Kh(b),null===a&&Eg(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,Ef(d,e)?g=null:null!==f&&Ef(d,f)&&(b.flags|=32),
hj(a,b),Yi$1(a,b,g,c),b.child;case 6:return null===a&&Eg(b),null;case 13:return pj(a,b,c);case 4:return Ih(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Bh(b,null,d,c):Yi$1(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Lg(d,e),Zi$1(a,b,d,e,c);case 7:return Yi$1(a,b,b.pendingProps,c),b.child;case 8:return Yi$1(a,b,b.pendingProps.children,c),b.child;case 12:return Yi$1(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;f=b.memoizedProps;
g=e.value;G$1(Mg,d._currentValue);d._currentValue=g;if(null!==f)if(He$1(f.value,g)){if(f.children===e.children&&!Wf.current){b=$i$1(a,b,c);break a}}else for(f=b.child,null!==f&&(f.return=b);null!==f;){var h=f.dependencies;if(null!==h){g=f.child;for(var k=h.firstContext;null!==k;){if(k.context===d){if(1===f.tag){k=ch(-1,c&-c);k.tag=2;var l=f.updateQueue;if(null!==l){l=l.shared;var m=l.pending;null===m?k.next=k:(k.next=m.next,m.next=k);l.pending=k;}}f.lanes|=c;k=f.alternate;null!==k&&(k.lanes|=c);Sg(f.return,
c,b);h.lanes|=c;break}k=k.next;}}else if(10===f.tag)g=f.type===b.type?null:f.child;else if(18===f.tag){g=f.return;if(null===g)throw Error(p$4(341));g.lanes|=c;h=g.alternate;null!==h&&(h.lanes|=c);Sg(g,c,b);g=f.sibling;}else g=f.child;if(null!==g)g.return=f;else for(g=f;null!==g;){if(g===b){g=null;break}f=g.sibling;if(null!==f){f.return=g.return;g=f;break}g=g.return;}f=g;}Yi$1(a,b,e.children,c);b=b.child;}return b;case 9:return e=b.type,d=b.pendingProps.children,Tg(b,c),e=Vg(e),d=d(e),b.flags|=1,Yi$1(a,b,d,c),
b.child;case 14:return d=b.type,e=Lg(d,b.pendingProps),e=Lg(d.type,e),aj(a,b,d,e,c);case 15:return cj(a,b,b.type,b.pendingProps,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Lg(d,e),jj(a,b),b.tag=1,Zf(d)?(a=!0,cg(b)):a=!1,Tg(b,c),ph(b,d,e),rh(b,d,e,c),kj(null,b,d,!0,a,c);case 19:return yj(a,b,c);case 22:return ej(a,b,c)}throw Error(p$4(156,b.tag));};function Gk(a,b){return ac(a,b)}
function al(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.subtreeFlags=this.flags=0;this.deletions=null;this.childLanes=this.lanes=0;this.alternate=null;}function Bg(a,b,c,d){return new al(a,b,c,d)}function bj(a){a=a.prototype;return !(!a||!a.isReactComponent)}
function $k(a){if("function"===typeof a)return bj(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Da)return 11;if(a===Ga)return 14}return 2}
function wh(a,b){var c=a.alternate;null===c?(c=Bg(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.subtreeFlags=0,c.deletions=null);c.flags=a.flags&14680064;c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
function yh(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)bj(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ya:return Ah(c.children,e,f,b);case za:g=8;e|=8;break;case Aa:return a=Bg(12,c,b,e|2),a.elementType=Aa,a.lanes=f,a;case Ea:return a=Bg(13,c,b,e),a.elementType=Ea,a.lanes=f,a;case Fa:return a=Bg(19,c,b,e),a.elementType=Fa,a.lanes=f,a;case Ia:return qj(c,e,f,b);default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case Ba:g=10;break a;case Ca:g=9;break a;case Da:g=11;
break a;case Ga:g=14;break a;case Ha:g=16;d=null;break a}throw Error(p$4(130,null==a?a:typeof a,""));}b=Bg(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Ah(a,b,c,d){a=Bg(7,a,d,b);a.lanes=c;return a}function qj(a,b,c,d){a=Bg(22,a,d,b);a.elementType=Ia;a.lanes=c;a.stateNode={isHidden:!1};return a}function xh(a,b,c){a=Bg(6,a,null,b);a.lanes=c;return a}
function zh(a,b,c){b=Bg(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function bl(a,b,c,d,e){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.callbackNode=this.pendingContext=this.context=null;this.callbackPriority=0;this.eventTimes=zc(0);this.expirationTimes=zc(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=zc(0);this.identifierPrefix=d;this.onRecoverableError=e;this.mutableSourceEagerHydrationData=
null;}function cl(a,b,c,d,e,f,g,h,k){a=new bl(a,b,c,h,k);1===b?(b=1,!0===f&&(b|=8)):b=0;f=Bg(3,null,null,b);a.current=f;f.stateNode=a;f.memoizedState={element:d,isDehydrated:c,cache:null,transitions:null,pendingSuspenseBoundaries:null};ah(f);return a}function dl(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return {$$typeof:wa,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
function el(a){if(!a)return Vf;a=a._reactInternals;a:{if(Vb(a)!==a||1!==a.tag)throw Error(p$4(170));var b=a;do{switch(b.tag){case 3:b=b.stateNode.context;break a;case 1:if(Zf(b.type)){b=b.stateNode.__reactInternalMemoizedMergedChildContext;break a}}b=b.return;}while(null!==b);throw Error(p$4(171));}if(1===a.tag){var c=a.type;if(Zf(c))return bg(a,c,b)}return b}
function fl(a,b,c,d,e,f,g,h,k){a=cl(c,d,!0,a,e,f,g,h,k);a.context=el(null);c=a.current;d=L$3();e=lh(c);f=ch(d,e);f.callback=void 0!==b&&null!==b?b:null;dh(c,f,e);a.current.lanes=e;Ac(a,e,d);Ek(a,d);return a}function gl(a,b,c,d){var e=b.current,f=L$3(),g=lh(e);c=el(c);null===b.context?b.context=c:b.pendingContext=c;b=ch(f,g);b.payload={element:a};d=void 0===d?null:d;null!==d&&(b.callback=d);a=dh(e,b,g);null!==a&&(mh(a,e,g,f),eh(a,e,g));return g}
function hl(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function il(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b;}}function jl(a,b){il(a,b);(a=a.alternate)&&il(a,b);}function kl(){return null}var ll="function"===typeof reportError?reportError:function(a){console.error(a);};function ml(a){this._internalRoot=a;}
nl.prototype.render=ml.prototype.render=function(a){var b=this._internalRoot;if(null===b)throw Error(p$4(409));gl(a,b,null,null);};nl.prototype.unmount=ml.prototype.unmount=function(){var a=this._internalRoot;if(null!==a){this._internalRoot=null;var b=a.containerInfo;Sk(function(){gl(null,a,null,null);});b[uf]=null;}};function nl(a){this._internalRoot=a;}
nl.prototype.unstable_scheduleHydration=function(a){if(a){var b=Hc();a={blockedOn:null,target:a,priority:b};for(var c=0;c<Qc.length&&0!==b&&b<Qc[c].priority;c++);Qc.splice(c,0,a);0===c&&Vc(a);}};function ol(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType)}function pl(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}function ql(){}
function rl(a,b,c,d,e){if(e){if("function"===typeof d){var f=d;d=function(){var a=hl(g);f.call(a);};}var g=fl(b,d,a,0,null,!1,!1,"",ql);a._reactRootContainer=g;a[uf]=g.current;sf(8===a.nodeType?a.parentNode:a);Sk();return g}for(;e=a.lastChild;)a.removeChild(e);if("function"===typeof d){var h=d;d=function(){var a=hl(k);h.call(a);};}var k=cl(a,0,!1,null,null,!1,!1,"",ql);a._reactRootContainer=k;a[uf]=k.current;sf(8===a.nodeType?a.parentNode:a);Sk(function(){gl(b,k,c,d);});return k}
function sl(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f;if("function"===typeof e){var h=e;e=function(){var a=hl(g);h.call(a);};}gl(b,g,a,e);}else g=rl(c,b,a,e,d);return hl(g)}Ec=function(a){switch(a.tag){case 3:var b=a.stateNode;if(b.current.memoizedState.isDehydrated){var c=tc(b.pendingLanes);0!==c&&(Cc(b,c|1),Ek(b,B$3()),0===(K$3&6)&&(Hj=B$3()+500,jg()));}break;case 13:Sk(function(){var b=Zg(a,1);if(null!==b){var c=L$3();mh(b,a,1,c);}}),jl(a,1);}};
Fc=function(a){if(13===a.tag){var b=Zg(a,134217728);if(null!==b){var c=L$3();mh(b,a,134217728,c);}jl(a,134217728);}};Gc=function(a){if(13===a.tag){var b=lh(a),c=Zg(a,b);if(null!==c){var d=L$3();mh(c,a,b,d);}jl(a,b);}};Hc=function(){return C$5};Ic=function(a,b){var c=C$5;try{return C$5=a,b()}finally{C$5=c;}};
yb=function(a,b,c){switch(b){case "input":bb(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(p$4(90));Wa(d);bb(d,e);}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,!1);}};Gb=Rk;Hb=Sk;
var tl={usingClientEntryPoint:!1,Events:[Cb,ue$1,Db,Eb,Fb,Rk]},ul={findFiberByHostInstance:Wc,bundleType:0,version:"18.2.0",rendererPackageName:"react-dom"};
var vl={bundleType:ul.bundleType,version:ul.version,rendererPackageName:ul.rendererPackageName,rendererConfig:ul.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ua.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=Zb(a);return null===a?null:a.stateNode},findFiberByHostInstance:ul.findFiberByHostInstance||
kl,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.2.0-next-9e3b772b8-20220608"};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var wl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!wl.isDisabled&&wl.supportsFiber)try{kc=wl.inject(vl),lc=wl;}catch(a){}}reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=tl;
reactDom_production_min.createPortal=function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!ol(b))throw Error(p$4(200));return dl(a,b,null,c)};reactDom_production_min.createRoot=function(a,b){if(!ol(a))throw Error(p$4(299));var c=!1,d="",e=ll;null!==b&&void 0!==b&&(!0===b.unstable_strictMode&&(c=!0),void 0!==b.identifierPrefix&&(d=b.identifierPrefix),void 0!==b.onRecoverableError&&(e=b.onRecoverableError));b=cl(a,1,!1,null,null,c,!1,d,e);a[uf]=b.current;sf(8===a.nodeType?a.parentNode:a);return new ml(b)};
reactDom_production_min.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(p$4(188));a=Object.keys(a).join(",");throw Error(p$4(268,a));}a=Zb(b);a=null===a?null:a.stateNode;return a};reactDom_production_min.flushSync=function(a){return Sk(a)};reactDom_production_min.hydrate=function(a,b,c){if(!pl(b))throw Error(p$4(200));return sl(null,a,b,!0,c)};
reactDom_production_min.hydrateRoot=function(a,b,c){if(!ol(a))throw Error(p$4(405));var d=null!=c&&c.hydratedSources||null,e=!1,f="",g=ll;null!==c&&void 0!==c&&(!0===c.unstable_strictMode&&(e=!0),void 0!==c.identifierPrefix&&(f=c.identifierPrefix),void 0!==c.onRecoverableError&&(g=c.onRecoverableError));b=fl(b,null,a,1,null!=c?c:null,e,!1,f,g);a[uf]=b.current;sf(a);if(d)for(a=0;a<d.length;a++)c=d[a],e=c._getVersion,e=e(c._source),null==b.mutableSourceEagerHydrationData?b.mutableSourceEagerHydrationData=[c,e]:b.mutableSourceEagerHydrationData.push(c,
e);return new nl(b)};reactDom_production_min.render=function(a,b,c){if(!pl(b))throw Error(p$4(200));return sl(null,a,b,!1,c)};reactDom_production_min.unmountComponentAtNode=function(a){if(!pl(a))throw Error(p$4(40));return a._reactRootContainer?(Sk(function(){sl(null,null,a,!1,function(){a._reactRootContainer=null;a[uf]=null;});}),!0):!1};reactDom_production_min.unstable_batchedUpdates=Rk;
reactDom_production_min.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!pl(c))throw Error(p$4(200));if(null==a||void 0===a._reactInternals)throw Error(p$4(38));return sl(a,b,c,!1,d)};reactDom_production_min.version="18.2.0-next-9e3b772b8-20220608";

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

/**
 * @remix-run/router v1.15.3
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
    if (validateLocation) validateLocation(location, to);
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
    if (validateLocation) validateLocation(location, to);
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
  // Config driven behavior flags
  let future = _extends$2({
    v7_fetcherPersist: false,
    v7_normalizeFormMethod: false,
    v7_partialHydration: false,
    v7_prependBasename: false,
    v7_relativeSplatPath: false
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
      if (!m.route.loader) return true;
      // Explicitly opting-in to running on hydration
      if (m.route.loader.hydrate === true) return false;
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
    let pendingActionData;
    let pendingError;
    if (opts && opts.pendingError) {
      // If we have a pendingError, it means the user attempted a GET submission
      // with binary FormData so assign here and skip to handleLoaders.  That
      // way we handle calling loaders above the boundary etc.  It's not really
      // different from an actionError in that sense.
      pendingError = {
        [findNearestBoundary(matches).route.id]: opts.pendingError
      };
    } else if (opts && opts.submission && isMutationMethod(opts.submission.formMethod)) {
      // Call action if we received an action submission
      let actionOutput = await handleAction(request, location, opts.submission, matches, {
        replace: opts.replace,
        flushSync
      });
      if (actionOutput.shortCircuited) {
        return;
      }
      pendingActionData = actionOutput.pendingActionData;
      pendingError = actionOutput.pendingActionError;
      loadingNavigation = getLoadingNavigation(location, opts.submission);
      flushSync = false;
      // Create a GET request for the loaders
      request = new Request(request.url, {
        signal: request.signal
      });
    }
    // Call loaders
    let {
      shortCircuited,
      loaderData,
      errors
    } = await handleLoaders(request, location, matches, loadingNavigation, opts && opts.submission, opts && opts.fetcherSubmission, opts && opts.replace, opts && opts.initialHydration === true, flushSync, pendingActionData, pendingError);
    if (shortCircuited) {
      return;
    }
    // Clean up now that the action/loaders have completed.  Don't clean up if
    // we short circuited because pendingNavigationController will have already
    // been assigned to a new controller for the next navigation
    pendingNavigationController = null;
    completeNavigation(location, _extends$2({
      matches
    }, pendingActionData ? {
      actionData: pendingActionData
    } : {}, {
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
      result = await callLoaderOrAction("action", request, actionMatch, matches, manifest, mapRouteProperties, basename, future.v7_relativeSplatPath);
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
        replace = result.location === state.location.pathname + state.location.search;
      }
      await startRedirectNavigation(state, result, {
        submission,
        replace
      });
      return {
        shortCircuited: true
      };
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
        // Send back an empty object we can use to clear out any prior actionData
        pendingActionData: {},
        pendingActionError: {
          [boundaryMatch.route.id]: result.error
        }
      };
    }
    if (isDeferredResult(result)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    return {
      pendingActionData: {
        [actionMatch.route.id]: result.data
      }
    };
  }
  // Call all applicable loaders for the given matches, handling redirects,
  // errors, etc.
  async function handleLoaders(request, location, matches, overrideNavigation, submission, fetcherSubmission, replace, initialHydration, flushSync, pendingActionData, pendingError) {
    // Figure out the right navigation we want to use for data loading
    let loadingNavigation = overrideNavigation || getLoadingNavigation(location, submission);
    // If this was a redirect from an action we don't have a "submission" but
    // we have it on the loading navigation so use that if available
    let activeSubmission = submission || fetcherSubmission || getSubmissionFromNavigation(loadingNavigation);
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, activeSubmission, location, future.v7_partialHydration && initialHydration === true, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionData, pendingError);
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
        errors: pendingError || null
      }, pendingActionData ? {
        actionData: pendingActionData
      } : {}, updatedFetchers ? {
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
      let actionData = pendingActionData || state.actionData;
      updateState(_extends$2({
        navigation: loadingNavigation
      }, actionData ? Object.keys(actionData).length === 0 ? {
        actionData: null
      } : {
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
      results,
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
    let redirect = findRedirect(results);
    if (redirect) {
      if (redirect.idx >= matchesToLoad.length) {
        // If this redirect came from a fetcher make sure we mark it in
        // fetchRedirectIds so it doesn't get revalidated on the next set of
        // loader executions
        let fetcherKey = revalidatingFetchers[redirect.idx - matchesToLoad.length].key;
        fetchRedirectIds.add(fetcherKey);
      }
      await startRedirectNavigation(state, redirect.result, {
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
    } = processLoaderData(state, matches, matchesToLoad, loaderResults, pendingError, revalidatingFetchers, fetcherResults, activeDeferreds);
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
    let actionResult = await callLoaderOrAction("action", fetchRequest, match, requestMatches, manifest, mapRouteProperties, basename, future.v7_relativeSplatPath);
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
          return startRedirectNavigation(state, actionResult, {
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
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, submission, nextLocation, false, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, {
      [match.route.id]: actionResult.data
    }, undefined // No need to send through errors since we short circuit above
    );
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
      results,
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
    let redirect = findRedirect(results);
    if (redirect) {
      if (redirect.idx >= matchesToLoad.length) {
        // If this redirect came from a fetcher make sure we mark it in
        // fetchRedirectIds so it doesn't get revalidated on the next set of
        // loader executions
        let fetcherKey = revalidatingFetchers[redirect.idx - matchesToLoad.length].key;
        fetchRedirectIds.add(fetcherKey);
      }
      return startRedirectNavigation(state, redirect.result);
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
    let result = await callLoaderOrAction("loader", fetchRequest, match, matches, manifest, mapRouteProperties, basename, future.v7_relativeSplatPath);
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
        await startRedirectNavigation(state, result);
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
  async function startRedirectNavigation(state, redirect, _temp2) {
    let {
      submission,
      fetcherSubmission,
      replace
    } = _temp2 === void 0 ? {} : _temp2;
    if (redirect.revalidate) {
      isRevalidationRequired = true;
    }
    let redirectLocation = createLocation(state.location, redirect.location, {
      _isRedirect: true
    });
    invariant(redirectLocation, "Expected a location on the redirect navigation");
    if (isBrowser) {
      let isDocumentReload = false;
      if (redirect.reloadDocument) {
        // Hard reload if the response contained X-Remix-Reload-Document
        isDocumentReload = true;
      } else if (ABSOLUTE_URL_REGEX$1.test(redirect.location)) {
        const url = init.history.createURL(redirect.location);
        isDocumentReload =
        // Hard reload if it's an absolute URL to a new origin
        url.origin !== routerWindow.location.origin ||
        // Hard reload if it's an absolute URL that does not match our basename
        stripBasename(url.pathname, basename) == null;
      }
      if (isDocumentReload) {
        if (replace) {
          routerWindow.location.replace(redirect.location);
        } else {
          routerWindow.location.assign(redirect.location);
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
    if (redirectPreserveMethodStatusCodes.has(redirect.status) && activeSubmission && isMutationMethod(activeSubmission.formMethod)) {
      await startNavigation(redirectHistoryAction, redirectLocation, {
        submission: _extends$2({}, activeSubmission, {
          formAction: redirect.location
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
  async function callLoadersAndMaybeResolveData(currentMatches, matches, matchesToLoad, fetchersToLoad, request) {
    // Call all navigation loaders and revalidating fetcher loaders in parallel,
    // then slice off the results into separate arrays so we can handle them
    // accordingly
    let results = await Promise.all([...matchesToLoad.map(match => callLoaderOrAction("loader", request, match, matches, manifest, mapRouteProperties, basename, future.v7_relativeSplatPath)), ...fetchersToLoad.map(f => {
      if (f.matches && f.match && f.controller) {
        return callLoaderOrAction("loader", createClientSideRequest(init.history, f.path, f.controller.signal), f.match, f.matches, manifest, mapRouteProperties, basename, future.v7_relativeSplatPath);
      } else {
        let error = {
          type: ResultType.error,
          error: getInternalRouterError(404, {
            pathname: f.path
          })
        };
        return error;
      }
    })]);
    let loaderResults = results.slice(0, matchesToLoad.length);
    let fetcherResults = results.slice(matchesToLoad.length);
    await Promise.all([resolveDeferredResults(currentMatches, matchesToLoad, loaderResults, loaderResults.map(() => request.signal), false, state.loaderData), resolveDeferredResults(currentMatches, fetchersToLoad.map(f => f.match), fetcherResults, fetchersToLoad.map(f => f.controller ? f.controller.signal : null), true)]);
    return {
      results,
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
function getMatchesToLoad(history, state, matches, submission, location, isInitialLoad, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionData, pendingError) {
  let actionResult = pendingError ? Object.values(pendingError)[0] : pendingActionData ? Object.values(pendingActionData)[0] : undefined;
  let currentUrl = history.createURL(state.location);
  let nextUrl = history.createURL(location);
  // Pick navigation matches that are net-new or qualify for revalidation
  let boundaryId = pendingError ? Object.keys(pendingError)[0] : undefined;
  let boundaryMatches = getLoaderMatchesUntilBoundary(matches, boundaryId);
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
      if (route.loader.hydrate) {
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
      defaultShouldRevalidate:
      // Forced revalidation due to submission, useRevalidator, or X-Remix-Revalidate
      isRevalidationRequired ||
      // Clicked the same link, resubmitted a GET form
      currentUrl.pathname + currentUrl.search === nextUrl.pathname + nextUrl.search ||
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
        defaultShouldRevalidate: isRevalidationRequired
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
async function callLoaderOrAction(type, request, match, matches, manifest, mapRouteProperties, basename, v7_relativeSplatPath, opts) {
  if (opts === void 0) {
    opts = {};
  }
  let resultType;
  let result;
  let onReject;
  let runHandler = handler => {
    // Setup a promise we can race against so that abort signals short circuit
    let reject;
    let abortPromise = new Promise((_, r) => reject = r);
    onReject = () => reject();
    request.signal.addEventListener("abort", onReject);
    return Promise.race([handler({
      request,
      params: match.params,
      context: opts.requestContext
    }), abortPromise]);
  };
  try {
    let handler = match.route[type];
    if (match.route.lazy) {
      if (handler) {
        // Run statically defined handler in parallel with lazy()
        let handlerError;
        let values = await Promise.all([
        // If the handler throws, don't let it immediately bubble out,
        // since we need to let the lazy() execution finish so we know if this
        // route has a boundary that can handle the error
        runHandler(handler).catch(e => {
          handlerError = e;
        }), loadLazyRouteModule(match.route, mapRouteProperties, manifest)]);
        if (handlerError) {
          throw handlerError;
        }
        result = values[0];
      } else {
        // Load lazy route module, then run any returned handler
        await loadLazyRouteModule(match.route, mapRouteProperties, manifest);
        handler = match.route[type];
        if (handler) {
          // Handler still run even if we got interrupted to maintain consistency
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
            data: undefined
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
    invariant(result !== undefined, "You defined " + (type === "action" ? "an action" : "a loader") + " for route " + ("\"" + match.route.id + "\" but didn't return anything from your `" + type + "` ") + "function. Please return a value or `null`.");
  } catch (e) {
    resultType = ResultType.error;
    result = e;
  } finally {
    if (onReject) {
      request.signal.removeEventListener("abort", onReject);
    }
  }
  if (isResponse(result)) {
    let status = result.status;
    // Process redirects
    if (redirectStatusCodes.has(status)) {
      let location = result.headers.get("Location");
      invariant(location, "Redirects returned/thrown from loaders/actions must have a Location header");
      // Support relative routing in internal redirects
      if (!ABSOLUTE_URL_REGEX$1.test(location)) {
        location = normalizeTo(new URL(request.url), matches.slice(0, matches.indexOf(match) + 1), basename, true, location, v7_relativeSplatPath);
      } else if (!opts.isStaticRequest) {
        // Strip off the protocol+origin for same-origin + same-basename absolute
        // redirects. If this is a static request, we can let it go back to the
        // browser as-is
        let currentUrl = new URL(request.url);
        let url = location.startsWith("//") ? new URL(currentUrl.protocol + location) : new URL(location);
        let isSameBasename = stripBasename(url.pathname, basename) != null;
        if (url.origin === currentUrl.origin && isSameBasename) {
          location = url.pathname + url.search + url.hash;
        }
      }
      // Don't process redirects in the router during static requests requests.
      // Instead, throw the Response and let the server handle it with an HTTP
      // redirect.  We also update the Location header in place in this flow so
      // basename and relative routing is taken into account
      if (opts.isStaticRequest) {
        result.headers.set("Location", location);
        throw result;
      }
      return {
        type: ResultType.redirect,
        status,
        location,
        revalidate: result.headers.get("X-Remix-Revalidate") !== null,
        reloadDocument: result.headers.get("X-Remix-Reload-Document") !== null
      };
    }
    // For SSR single-route requests, we want to hand Responses back directly
    // without unwrapping.  We do this with the QueryRouteResponse wrapper
    // interface so we can know whether it was returned or thrown
    if (opts.isRouteRequest) {
      let queryRouteResponse = {
        type: resultType === ResultType.error ? ResultType.error : ResultType.data,
        response: result
      };
      throw queryRouteResponse;
    }
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
    if (resultType === ResultType.error) {
      return {
        type: resultType,
        error: new ErrorResponseImpl(status, result.statusText, data),
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
  if (resultType === ResultType.error) {
    return {
      type: resultType,
      error: result
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
    data: result
  };
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
function processRouteLoaderData(matches, matchesToLoad, results, pendingError, activeDeferreds) {
  // Fill in loaderData/errors from our loaders
  let loaderData = {};
  let errors = null;
  let statusCode;
  let foundError = false;
  let loaderHeaders = {};
  // Process loader results into state.loaderData/state.errors
  results.forEach((result, index) => {
    let id = matchesToLoad[index].route.id;
    invariant(!isRedirectResult(result), "Cannot handle redirect results in processLoaderData");
    if (isErrorResult(result)) {
      // Look upwards from the matched route for the closest ancestor
      // error boundary, defaulting to the root match
      let boundaryMatch = findNearestBoundary(matches, id);
      let error = result.error;
      // If we have a pending action error, we report it at the highest-route
      // that throws a loader error, and then clear it out to indicate that
      // it was consumed
      if (pendingError) {
        error = Object.values(pendingError)[0];
        pendingError = undefined;
      }
      errors = errors || {};
      // Prefer higher error values if lower errors bubble to the same boundary
      if (errors[boundaryMatch.route.id] == null) {
        errors[boundaryMatch.route.id] = error;
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
      } else {
        loaderData[id] = result.data;
      }
      // Error status codes always override success status codes, but if all
      // loaders are successful we take the deepest status code.
      if (result.statusCode != null && result.statusCode !== 200 && !foundError) {
        statusCode = result.statusCode;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    }
  });
  // If we didn't consume the pending action error (i.e., all loaders
  // resolved), then consume it here.  Also clear out any loaderData for the
  // throwing route
  if (pendingError) {
    errors = pendingError;
    loaderData[Object.keys(pendingError)[0]] = undefined;
  }
  return {
    loaderData,
    errors,
    statusCode: statusCode || 200,
    loaderHeaders
  };
}
function processLoaderData(state, matches, matchesToLoad, results, pendingError, revalidatingFetchers, fetcherResults, activeDeferreds) {
  let {
    loaderData,
    errors
  } = processRouteLoaderData(matches, matchesToLoad, results, pendingError, activeDeferreds);
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
 * React Router v6.22.3
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
    if (!activeRef.current)
      return;
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
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant(false) : void 0;
    location = parsedLocationArg;
  } else {
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
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
      value: {
        location: _extends$1({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: Action.Pop
      }
    }, renderedMatches);
  }
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
    let errorIndex = renderedMatches.findIndex((m) => m.route.id && (errors == null ? void 0 : errors[m.route.id]));
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
          warningOnce("route-fallback", false);
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
    if (!activeRef.current)
      return;
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
const alreadyWarned = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
  }
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
 * React Router DOM v6.22.3
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
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
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
function createSearchParams(init) {
  if (init === void 0) {
    init = "";
  }
  return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo, key) => {
    let value = init[key];
    return memo.concat(Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]);
  }, []));
}
function getSearchParamsForLocation(locationSearch, defaultSearchParams) {
  let searchParams = createSearchParams(locationSearch);
  if (defaultSearchParams) {
    defaultSearchParams.forEach((_, key) => {
      if (!searchParams.has(key)) {
        defaultSearchParams.getAll(key).forEach((value) => {
          searchParams.append(key, value);
        });
      }
    });
  }
  return searchParams;
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
  if (!errors)
    return null;
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
    let isViewTransitionUnavailable = router.window == null || typeof router.window.document.startViewTransition !== "function";
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
    if (onClick)
      onClick(event);
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
function useSearchParams(defaultInit) {
  let defaultSearchParamsRef = reactExports.useRef(createSearchParams(defaultInit));
  let hasSetSearchParamsRef = reactExports.useRef(false);
  let location = useLocation();
  let searchParams = reactExports.useMemo(() => (
    // Only merge in the defaults if we haven't yet called setSearchParams.
    // Once we call that we want those to take precedence, otherwise you can't
    // remove a param with setSearchParams({}) if it has an initial value
    getSearchParamsForLocation(location.search, hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current)
  ), [location.search]);
  let navigate = useNavigate();
  let setSearchParams = reactExports.useCallback((nextInit, navigateOptions) => {
    const newSearchParams = createSearchParams(typeof nextInit === "function" ? nextInit(searchParams) : nextInit);
    hasSetSearchParamsRef.current = true;
    navigate("?" + newSearchParams, navigateOptions);
  }, [navigate, searchParams]);
  return [searchParams, setSearchParams];
}

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

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function e$1(e){return {}}const t$2={},n$2={},r$1={},i$4={},s$2={},o$4={},l$4={},c$4={},u$3={},a$3={},f$4={},d$3={},h$3={},g$5={},_$5={},p$3={},y$4={},m$5={},x$4={},v$3={},T$3={},S$4={},k$2={},C$4={},b$2={},N$3={},w$3={},E$3={},P$3={},D$2={},I$1={},O$2={},A$3={},L$2={},F$1={},M$3={},W={},z$1={},B$2={},R$2={},K$2={},J={},U={},V={},$$1={};var H$1=function(e){const t=new URLSearchParams;t.append("code",e);for(let e=1;e<arguments.length;e++)t.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${t} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)};const j="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement,q=j&&"documentMode"in document?document.documentMode:null,Q=j&&/Mac|iPod|iPhone|iPad/.test(navigator.platform),X=j&&/^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent),Y=!(!j||!("InputEvent"in window)||q)&&"getTargetRanges"in new window.InputEvent("input"),Z=j&&/Version\/[\d.]+.*Safari/.test(navigator.userAgent),G=j&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,ee=j&&/Android/.test(navigator.userAgent),te=j&&/^(?=.*Chrome).*/i.test(navigator.userAgent),ne=j&&ee&&te,re=j&&/AppleWebKit\/[\d.]+/.test(navigator.userAgent)&&!te,ie=1,se=3,oe=0,le=1,ce=2,ue=4,ae=8,fe=240|(3|ue|ae),de=1,he=2,ge=3,_e=4,pe=5,ye=6,me=Z||G||re?" ":"​",xe="\n\n",ve=X?" ":me,Te="֑-߿יִ-﷽ﹰ-ﻼ",Se="A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿",ke=new RegExp("^[^"+Se+"]*["+Te+"]"),Ce=new RegExp("^[^"+Te+"]*["+Se+"]"),be={bold:1,code:16,highlight:128,italic:2,strikethrough:ue,subscript:32,superscript:64,underline:ae},Ne={directionless:1,unmergeable:2},we={center:he,end:ye,justify:_e,left:de,right:ge,start:pe},Ee={[he]:"center",[ye]:"end",[_e]:"justify",[de]:"left",[ge]:"right",[pe]:"start"},Pe={normal:0,segmented:2,token:1},De={0:"normal",2:"segmented",1:"token"};function Ie(...e){const t=[];for(const n of e)if(n&&"string"==typeof n)for(const[e]of n.matchAll(/\S+/g))t.push(e);return t}const Oe=100;let Ae=!1,Le=0;function Fe(e){Le=e.timeStamp;}function Me(e,t,n){return t.__lexicalLineBreak===e||void 0!==e[`__lexicalKey_${n._key}`]}function We(e,t,n){const r=nn(n._window);let i=null,s=null;null!==r&&r.anchorNode===e&&(i=r.anchorOffset,s=r.focusOffset);const o=e.nodeValue;null!==o&&kt(t,o,i,s,!1);}function ze(e,t,n){if(Xr(e)){const t=e.anchor.getNode();if(t.is(n)&&e.format!==t.getFormat())return !1}return t.nodeType===se&&n.isAttached()}function Be(e,t,n){Ae=!0;const r=performance.now()-Le>Oe;try{Vi(e,(()=>{const i=fi()||function(e){return e.getEditorState().read((()=>{const e=fi();return null!==e?e.clone():null}))}(e),s=new Map,o=e.getRootElement(),l=e._editorState,c=e._blockCursorElement;let u=!1,a="";for(let n=0;n<t.length;n++){const f=t[n],d=f.type,h=f.target;let g=at(h,l);if(!(null===g&&h!==o||Hi(g)))if("characterData"===d)r&&Br(g)&&ze(i,h,g)&&We(h,g,e);else if("childList"===d){u=!0;const t=f.addedNodes;for(let n=0;n<t.length;n++){const r=t[n],i=ut(r),s=r.parentNode;if(null!=s&&r!==c&&null===i&&("BR"!==r.nodeName||!Me(r,s,e))){if(X){const e=r.innerText||r.nodeValue;e&&(a+=e);}s.removeChild(r);}}const n=f.removedNodes,r=n.length;if(r>0){let t=0;for(let i=0;i<r;i++){const r=n[i];("BR"===r.nodeName&&Me(r,h,e)||c===r)&&(h.appendChild(r),t++);}r!==t&&(h===o&&(g=gt(l)),s.set(h,g));}}}if(s.size>0)for(const[t,n]of s)if(qi(n)){const r=n.getChildrenKeys();let i=t.firstChild;for(let n=0;n<r.length;n++){const s=r[n],o=e.getElementByKey(s);null!==o&&(null==i?(t.appendChild(o),i=o):i!==o&&t.replaceChild(o,i),i=i.nextSibling);}}else Br(n)&&n.markDirty();const f=n.takeRecords();if(f.length>0){for(let t=0;t<f.length;t++){const n=f[t],r=n.addedNodes,i=n.target;for(let t=0;t<r.length;t++){const n=r[t],s=n.parentNode;null==s||"BR"!==n.nodeName||Me(n,i,e)||s.removeChild(n);}}n.takeRecords();}null!==i&&(u&&(i.dirty=!0,_t(i)),X&&zt(e)&&i.insertRawText(a));}));}finally{Ae=!1;}}function Re(e){const t=e._observer;if(null!==t){Be(e,t.takeRecords(),t);}}function Ke(e){!function(e){0===Le&&Ht(e).addEventListener("textInput",Fe,!0);}(e),e._observer=new MutationObserver(((t,n)=>{Be(e,t,n);}));}function Je(e,t){const n=e.__mode,r=e.__format,i=e.__style,s=t.__mode,o=t.__format,l=t.__style;return !(null!==n&&n!==s||null!==r&&r!==o||null!==i&&i!==l)}function Ue(e,t){const n=e.mergeWithSibling(t),r=Oi()._normalizedNodes;return r.add(e.__key),r.add(t.__key),n}function Ve(e){let t,n,r=e;if(""!==r.__text||!r.isSimpleText()||r.isUnmergeable()){for(;null!==(t=r.getPreviousSibling())&&Br(t)&&t.isSimpleText()&&!t.isUnmergeable();){if(""!==t.__text){if(Je(t,r)){r=Ue(t,r);break}break}t.remove();}for(;null!==(n=r.getNextSibling())&&Br(n)&&n.isSimpleText()&&!n.isUnmergeable();){if(""!==n.__text){if(Je(r,n)){r=Ue(r,n);break}break}n.remove();}}else r.remove();}function $e(e){return He(e.anchor),He(e.focus),e}function He(e){for(;"element"===e.type;){const t=e.getNode(),n=e.offset;let r,i;if(n===t.getChildrenSize()?(r=t.getChildAtIndex(n-1),i=!0):(r=t.getChildAtIndex(n),i=!1),Br(r)){e.set(r.__key,i?r.getTextContentSize():0,"text");break}if(!qi(r))break;e.set(r.__key,i?r.getChildrenSize():0,"element");}}let je=1;const qe="function"==typeof queueMicrotask?queueMicrotask:e=>{Promise.resolve().then(e);};function Qe(e){const t=document.activeElement;if(null===t)return !1;const n=t.nodeName;return Hi(at(e))&&("INPUT"===n||"TEXTAREA"===n||"true"===t.contentEditable&&null==t.__lexicalEditor)}function Xe(e,t,n){const r=e.getRootElement();try{return null!==r&&r.contains(t)&&r.contains(n)&&null!==t&&!Qe(t)&&Ye(t)===e}catch(e){return !1}}function Ye(e){let t=e;for(;null!=t;){const e=t.__lexicalEditor;if(null!=e)return e;t=Jt(t);}return null}function Ze(e){return e.isToken()||e.isSegmented()}function Ge(e){return e.nodeType===se}function et(e){let t=e;for(;null!=t;){if(Ge(t))return t;t=t.firstChild;}return null}function tt(e,t,n){const r=be[t];if(null!==n&&(e&r)==(n&r))return e;let i=e^r;return "subscript"===t?i&=~be.superscript:"superscript"===t&&(i&=~be.subscript),i}function nt(e){return Br(e)||vr(e)||Hi(e)}function rt(e,t){if(null!=t)return void(e.__key=t);Pi(),Di();const n=Oi(),r=Ii(),i=""+je++;r._nodeMap.set(i,e),qi(e)?n._dirtyElements.set(i,!0):n._dirtyLeaves.add(i),n._cloneNotNeeded.add(i),n._dirtyType=le,e.__key=i;}function it(e){const t=e.getParent();if(null!==t){const n=e.getWritable(),r=t.getWritable(),i=e.getPreviousSibling(),s=e.getNextSibling();if(null===i)if(null!==s){const e=s.getWritable();r.__first=s.__key,e.__prev=null;}else r.__first=null;else {const e=i.getWritable();if(null!==s){const t=s.getWritable();t.__prev=e.__key,e.__next=t.__key;}else e.__next=null;n.__prev=null;}if(null===s)if(null!==i){const e=i.getWritable();r.__last=i.__key,e.__next=null;}else r.__last=null;else {const e=s.getWritable();if(null!==i){const t=i.getWritable();t.__next=e.__key,e.__prev=t.__key;}else e.__prev=null;n.__next=null;}r.__size--,n.__parent=null;}}function st(e){Di();const t=e.getLatest(),n=t.__parent,r=Ii(),i=Oi(),s=r._nodeMap,o=i._dirtyElements;null!==n&&function(e,t,n){let r=e;for(;null!==r;){if(n.has(r))return;const e=t.get(r);if(void 0===e)break;n.set(r,!1),r=e.__parent;}}(n,s,o);const l=t.__key;i._dirtyType=le,qi(e)?o.set(l,!0):i._dirtyLeaves.add(l);}function ot(e){Pi();const t=Oi(),n=t._compositionKey;if(e!==n){if(t._compositionKey=e,null!==n){const e=ct(n);null!==e&&e.getWritable();}if(null!==e){const t=ct(e);null!==t&&t.getWritable();}}}function lt(){if(Ei())return null;return Oi()._compositionKey}function ct(e,t){const n=(t||Ii())._nodeMap.get(e);return void 0===n?null:n}function ut(e,t){const n=e[`__lexicalKey_${Oi()._key}`];return void 0!==n?ct(n,t):null}function at(e,t){let n=e;for(;null!=n;){const e=ut(n,t);if(null!==e)return e;n=Jt(n);}return null}function ft(e){const t=e._decorators,n=Object.assign({},t);return e._pendingDecorators=n,n}function dt(e){return e.read((()=>ht().getTextContent()))}function ht(){return gt(Ii())}function gt(e){return e._nodeMap.get("root")}function _t(e){Pi();const t=Ii();null!==e&&(e.dirty=!0,e.setCachedNodes(null)),t._selection=e;}function pt(e){const t=Oi(),n=function(e,t){let n=e;for(;null!=n;){const e=n[`__lexicalKey_${t._key}`];if(void 0!==e)return e;n=Jt(n);}return null}(e,t);if(null===n){return e===t.getRootElement()?ct("root"):null}return ct(n)}function yt(e,t){return t?e.getTextContentSize():0}function mt(e){return /[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(e)}function xt(e){const t=[];let n=e;for(;null!==n;)t.push(n),n=n._parentEditor;return t}function vt(){return Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,5)}function Tt(e){return e.nodeType===se?e.nodeValue:null}function St(e,t,n){const r=nn(t._window);if(null===r)return;const i=r.anchorNode;let{anchorOffset:s,focusOffset:o}=r;if(null!==i){let t=Tt(i);const r=at(i);if(null!==t&&Br(r)){if(t===me&&n){const e=n.length;t=n,s=e,o=e;}null!==t&&kt(r,t,s,o,e);}}}function kt(e,t,n,r,i){let s=e;if(s.isAttached()&&(i||!s.isDirty())){const o=s.isComposing();let l=t;(o||i)&&t[t.length-1]===me&&(l=t.slice(0,-1));const c=s.getTextContent();if(i||l!==c){if(""===l){if(ot(null),Z||G||re)s.remove();else {const e=Oi();setTimeout((()=>{e.update((()=>{s.isAttached()&&s.remove();}));}),20);}return}const t=s.getParent(),i=di(),c=s.getTextContentSize(),u=lt(),a=s.getKey();if(s.isToken()||null!==u&&a===u&&!o||Xr(i)&&(null!==t&&!t.canInsertTextBefore()&&0===i.anchor.offset||i.anchor.key===e.__key&&0===i.anchor.offset&&!s.canInsertTextBefore()&&!o||i.focus.key===e.__key&&i.focus.offset===c&&!s.canInsertTextAfter()&&!o))return void s.markDirty();const f=fi();if(!Xr(f)||null===n||null===r)return void s.setTextContent(l);if(f.setTextNodeRange(s,n,s,r),s.isSegmented()){const e=zr(s.getTextContent());s.replace(e),s=e;}s.setTextContent(l);}}}function Ct(e,t){if(t.isSegmented())return !0;if(!e.isCollapsed())return !1;const n=e.anchor.offset,r=t.getParentOrThrow(),i=t.isToken();return 0===n?!t.canInsertTextBefore()||!r.canInsertTextBefore()||i||function(e){const t=e.getPreviousSibling();return (Br(t)||qi(t)&&t.isInline())&&!t.canInsertTextAfter()}(t):n===t.getTextContentSize()&&(!t.canInsertTextAfter()||!r.canInsertTextAfter()||i)}function bt(e){return 37===e}function Nt(e){return 39===e}function wt(e,t){return Q?e:t}function Et(e){return 13===e}function Pt(e){return 8===e}function Dt(e){return 46===e}function It(e,t,n){return 65===e&&wt(t,n)}function Ot(){const e=ht();_t($e(e.select(0,e.getChildrenSize())));}function At(e,t){void 0===e.__lexicalClassNameCache&&(e.__lexicalClassNameCache={});const n=e.__lexicalClassNameCache,r=n[t];if(void 0!==r)return r;const i=e[t];if("string"==typeof i){const e=Ie(i);return n[t]=e,e}return i}function Lt(e,t,n,r,i){if(0===n.size)return;const s=r.__type,o=r.__key,l=t.get(s);void 0===l&&H$1(33,s);const c=l.klass;let u=e.get(c);void 0===u&&(u=new Map,e.set(c,u));const a=u.get(o),f="destroyed"===a&&"created"===i;(void 0===a||f)&&u.set(o,f?"updated":i);}function Ft(e){const t=Ii(),n=t._readOnly,r=e.getType(),i=t._nodeMap,s=[];for(const[,t]of i)t instanceof e&&t.__type===r&&(n||t.isAttached())&&s.push(t);return s}function Mt(e,t,n){const r=e.getParent();let i=n,s=e;return null!==r&&(t&&0===n?(i=s.getIndexWithinParent(),s=r):t||n!==s.getChildrenSize()||(i=s.getIndexWithinParent()+1,s=r)),s.getChildAtIndex(t?i-1:i)}function Wt(e,t){const n=e.offset;if("element"===e.type){return Mt(e.getNode(),t,n)}{const r=e.getNode();if(t&&0===n||!t&&n===r.getTextContentSize()){const e=t?r.getPreviousSibling():r.getNextSibling();return null===e?Mt(r.getParentOrThrow(),t,r.getIndexWithinParent()+(t?0:1)):e}}return null}function zt(e){const t=Ht(e).event,n=t&&t.inputType;return "insertFromPaste"===n||"insertFromPasteAsQuotation"===n}function Bt(e,t,n){return Ki(e,t,n)}function Rt(e){return !Yi(e)&&!e.isLastChild()&&!e.isInline()}function Kt(e,t){const n=e._keyToDOMMap.get(t);return void 0===n&&H$1(75,t),n}function Jt(e){const t=e.assignedSlot||e.parentElement;return null!==t&&11===t.nodeType?t.host:t}function Ut(e){return Oi()._updateTags.has(e)}function Vt(e){Pi();Oi()._updateTags.add(e);}function $t(e,t){let n=e.getParent();for(;null!==n;){if(n.is(t))return !0;n=n.getParent();}return !1}function Ht(e){const t=e._window;return null===t&&H$1(78),t}function jt(e){return qi(e)&&e.isInline()||Hi(e)&&e.isInline()}function qt(e){let t=e.getParentOrThrow();for(;null!==t;){if(Qt(t))return t;t=t.getParentOrThrow();}return t}function Qt(e){return Yi(e)||qi(e)&&e.isShadowRoot()}function Xt(e){const t=e.constructor.clone(e);return rt(t,null),t}function Yt(e){const t=Oi(),n=e.constructor.getType(),r=t._nodes.get(n);void 0===r&&H$1(97);const i=r.replace;if(null!==i){const t=i(e);return t instanceof e.constructor||H$1(98),t}return e}function Zt(e,t){!Yi(e.getParent())||qi(t)||Hi(t)||H$1(99);}function Gt(e){return (Hi(e)||qi(e)&&!e.canBeEmpty())&&!e.isInline()}function en(e,t,n){n.style.removeProperty("caret-color"),t._blockCursorElement=null;const r=e.parentElement;null!==r&&r.removeChild(e);}function tn(e,t,n){let r=e._blockCursorElement;if(Xr(n)&&n.isCollapsed()&&"element"===n.anchor.type&&t.contains(document.activeElement)){const i=n.anchor,s=i.getNode(),o=i.offset;let l=!1,c=null;if(o===s.getChildrenSize()){Gt(s.getChildAtIndex(o-1))&&(l=!0);}else {const t=s.getChildAtIndex(o);if(Gt(t)){const n=t.getPreviousSibling();(null===n||Gt(n))&&(l=!0,c=e.getElementByKey(t.__key));}}if(l){const n=e.getElementByKey(s.__key);return null===r&&(e._blockCursorElement=r=function(e){const t=e.theme,n=document.createElement("div");n.contentEditable="false",n.setAttribute("data-lexical-cursor","true");let r=t.blockCursor;if(void 0!==r){if("string"==typeof r){const e=Ie(r);r=t.blockCursor=e;}void 0!==r&&n.classList.add(...r);}return n}(e._config)),t.style.caretColor="transparent",void(null===c?n.appendChild(r):n.insertBefore(r,c))}}null!==r&&en(r,e,t);}function nn(e){return j?(e||window).getSelection():null}function rn(e,t){let n=e.getChildAtIndex(t);null==n&&(n=e),Qt(e)&&H$1(102);const r=e=>{const t=e.getParentOrThrow(),i=Qt(t),s=e!==n||i?Xt(e):e;if(i)return qi(e)&&qi(s)||H$1(133),e.insertAfter(s),[e,s,s];{const[n,i,o]=r(t),l=e.getNextSiblings();return o.append(s,...l),[n,i,s]}},[i,s]=r(n);return [i,s]}function sn(e){return on(e)&&"A"===e.tagName}function on(e){return 1===e.nodeType}function ln(e){if(Hi(e)&&!e.isInline())return !0;if(!qi(e)||Qt(e))return !1;const t=e.getFirstChild(),n=null===t||vr(t)||Br(t)||t.isInline();return !e.isInline()&&!1!==e.canBeEmpty()&&n}function cn(e,t){let n=e;for(;null!==n&&null!==n.getParent()&&!t(n);)n=n.getParentOrThrow();return t(n)?n:null}function un(){return Oi()}function an(e,t,n,r,i,s){let o=e.getFirstChild();for(;null!==o;){const e=o.__key;o.__parent===t&&(qi(o)&&an(o,e,n,r,i,s),n.has(e)||s.delete(e),i.push(e)),o=o.getNextSibling();}}let fn,dn,hn,gn,_n,pn,yn,mn,xn,vn,Tn="",Sn="",kn="",Cn=!1,bn=!1,Nn=null;function wn(e,t){const n=yn.get(e);if(null!==t){const n=Vn(e);n.parentNode===t&&t.removeChild(n);}if(mn.has(e)||dn._keyToDOMMap.delete(e),qi(n)){const e=Bn(n,yn);En(e,0,e.length-1,null);}void 0!==n&&Lt(vn,hn,gn,n,"destroyed");}function En(e,t,n,r){let i=t;for(;i<=n;++i){const t=e[i];void 0!==t&&wn(t,r);}}function Pn(e,t){e.setProperty("text-align",t);}const Dn="40px";function In(e,t){const n=fn.theme.indent;if("string"==typeof n){const r=e.classList.contains(n);t>0&&!r?e.classList.add(n):t<1&&r&&e.classList.remove(n);}const r=getComputedStyle(e).getPropertyValue("--lexical-indent-base-value")||Dn;e.style.setProperty("padding-inline-start",0===t?"":`calc(${t} * ${r})`);}function On(e,t){const n=e.style;0===t?Pn(n,""):t===de?Pn(n,"left"):t===he?Pn(n,"center"):t===ge?Pn(n,"right"):t===_e?Pn(n,"justify"):t===pe?Pn(n,"start"):t===ye&&Pn(n,"end");}function An(e,t,n){const r=mn.get(e);void 0===r&&H$1(60);const i=r.createDOM(fn,dn);if(function(e,t,n){const r=n._keyToDOMMap;t["__lexicalKey_"+n._key]=e,r.set(e,t);}(e,i,dn),Br(r)?i.setAttribute("data-lexical-text","true"):Hi(r)&&i.setAttribute("data-lexical-decorator","true"),qi(r)){const e=r.__indent,t=r.__size;if(0!==e&&In(i,e),0!==t){const e=t-1;!function(e,t,n,r){const i=Sn;Sn="",Ln(e,n,0,t,r,null),Wn(n,r),Sn=i;}(Bn(r,mn),e,r,i);}const n=r.__format;0!==n&&On(i,n),r.isInline()||Mn(null,r,i),Rt(r)&&(Tn+=xe,kn+=xe);}else {const t=r.getTextContent();if(Hi(r)){const t=r.decorate(dn,fn);null!==t&&Kn(e,t),i.contentEditable="false";}else Br(r)&&(r.isDirectionless()||(Sn+=t));Tn+=t,kn+=t;}if(null!==t)if(null!=n)t.insertBefore(i,n);else {const e=t.__lexicalLineBreak;null!=e?t.insertBefore(i,e):t.appendChild(i);}return Lt(vn,hn,gn,r,"created"),i}function Ln(e,t,n,r,i,s){const o=Tn;Tn="";let l=n;for(;l<=r;++l)An(e[l],i,s);Rt(t)&&(Tn+=xe),i.__lexicalTextContent=Tn,Tn=o+Tn;}function Fn(e,t){const n=t.get(e);return vr(n)||Hi(n)&&n.isInline()}function Mn(e,t,n){const r=null!==e&&(0===e.__size||Fn(e.__last,yn)),i=0===t.__size||Fn(t.__last,mn);if(r){if(!i){const e=n.__lexicalLineBreak;null!=e&&n.removeChild(e),n.__lexicalLineBreak=null;}}else if(i){const e=document.createElement("br");n.__lexicalLineBreak=e,n.appendChild(e);}}function Wn(e,t){const n=t.__lexicalDirTextContent,r=t.__lexicalDir;if(n!==Sn||r!==Nn){const n=""===Sn,s=n?Nn:(i=Sn,ke.test(i)?"rtl":Ce.test(i)?"ltr":null);if(s!==r){const i=t.classList,o=fn.theme;let l=null!==r?o[r]:void 0,c=null!==s?o[s]:void 0;if(void 0!==l){if("string"==typeof l){const e=Ie(l);l=o[r]=e;}i.remove(...l);}if(null===s||n&&"ltr"===s)t.removeAttribute("dir");else {if(void 0!==c){if("string"==typeof c){const e=Ie(c);c=o[s]=e;}void 0!==c&&i.add(...c);}t.dir=s;}if(!bn){e.getWritable().__dir=s;}}Nn=s,t.__lexicalDirTextContent=Sn,t.__lexicalDir=s;}var i;}function zn(e,t,n){const r=Sn;Sn="",function(e,t,n){const r=Tn,i=e.__size,s=t.__size;if(Tn="",1===i&&1===s){const r=e.__first,i=t.__first;if(r===i)Rn(r,n);else {const e=Vn(r),t=An(i,null,null);n.replaceChild(t,e),wn(r,null);}}else {const r=Bn(e,yn),o=Bn(t,mn);if(0===i)0!==s&&Ln(o,t,0,s-1,n,null);else if(0===s){if(0!==i){const e=null==n.__lexicalLineBreak;En(r,0,i-1,e?null:n),e&&(n.textContent="");}}else !function(e,t,n,r,i,s){const o=r-1,l=i-1;let c,u,a=(h=s,h.firstChild),f=0,d=0;var h;for(;f<=o&&d<=l;){const e=t[f],r=n[d];if(e===r)a=Jn(Rn(r,s)),f++,d++;else {void 0===c&&(c=new Set(t)),void 0===u&&(u=new Set(n));const i=u.has(e),o=c.has(r);if(i)if(o){const e=Kt(dn,r);e===a?a=Jn(Rn(r,s)):(null!=a?s.insertBefore(e,a):s.appendChild(e),Rn(r,s)),f++,d++;}else An(r,s,a),d++;else a=Jn(Vn(e)),wn(e,s),f++;}}const g=f>o,_=d>l;if(g&&!_){const t=n[l+1];Ln(n,e,d,l,s,void 0===t?null:dn.getElementByKey(t));}else _&&!g&&En(t,f,o,s);}(t,r,o,i,s,n);}Rt(t)&&(Tn+=xe);n.__lexicalTextContent=Tn,Tn=r+Tn;}(e,t,n),Wn(t,n),Sn=r;}function Bn(e,t){const n=[];let r=e.__first;for(;null!==r;){const e=t.get(r);void 0===e&&H$1(101),n.push(r),r=e.__next;}return n}function Rn(e,t){const n=yn.get(e);let r=mn.get(e);void 0!==n&&void 0!==r||H$1(61);const i=Cn||pn.has(e)||_n.has(e),s=Kt(dn,e);if(n===r&&!i){if(qi(n)){const e=s.__lexicalTextContent;void 0!==e&&(Tn+=e,kn+=e);const t=s.__lexicalDirTextContent;void 0!==t&&(Sn+=t);}else {const e=n.getTextContent();Br(n)&&!n.isDirectionless()&&(Sn+=e),kn+=e,Tn+=e;}return s}if(n!==r&&i&&Lt(vn,hn,gn,r,"updated"),r.updateDOM(n,s,fn)){const n=An(e,null,null);return null===t&&H$1(62),t.replaceChild(n,s),wn(e,null),n}if(qi(n)&&qi(r)){const e=r.__indent;e!==n.__indent&&In(s,e);const t=r.__format;t!==n.__format&&On(s,t),i&&(zn(n,r,s),Yi(r)||r.isInline()||Mn(n,r,s)),Rt(r)&&(Tn+=xe,kn+=xe);}else {const t=r.getTextContent();if(Hi(r)){const t=r.decorate(dn,fn);null!==t&&Kn(e,t);}else Br(r)&&!r.isDirectionless()&&(Sn+=t);Tn+=t,kn+=t;}if(!bn&&Yi(r)&&r.__cachedText!==kn){const e=r.getWritable();e.__cachedText=kn,r=e;}return s}function Kn(e,t){let n=dn._pendingDecorators;const r=dn._decorators;if(null===n){if(r[e]===t)return;n=ft(dn);}n[e]=t;}function Jn(e){let t=e.nextSibling;return null!==t&&t===dn._blockCursorElement&&(t=t.nextSibling),t}function Un(e,t,n,r,i,s){Tn="",kn="",Sn="",Cn=r===ce,Nn=null,dn=n,fn=n._config,hn=n._nodes,gn=dn._listeners.mutation,_n=i,pn=s,yn=e._nodeMap,mn=t._nodeMap,bn=t._readOnly,xn=new Map(n._keyToDOMMap);const o=new Map;return vn=o,Rn("root",null),dn=void 0,hn=void 0,_n=void 0,pn=void 0,yn=void 0,mn=void 0,fn=void 0,xn=void 0,vn=void 0,o}function Vn(e){const t=xn.get(e);return void 0===t&&H$1(75,e),t}const $n=Object.freeze({}),Hn=30,jn=[["keydown",function(e,t){if(qn=e.timeStamp,Qn=e.keyCode,t.isComposing())return;const{keyCode:n,shiftKey:r,ctrlKey:o,metaKey:l,altKey:c}=e;if(Bt(t,_$5,e))return;if(function(e,t,n,r){return Nt(e)&&!t&&!r&&!n}(n,o,c,l))Bt(t,p$3,e);else if(function(e,t,n,r,i){return Nt(e)&&!r&&!n&&(t||i)}(n,o,r,c,l))Bt(t,y$4,e);else if(function(e,t,n,r){return bt(e)&&!t&&!r&&!n}(n,o,c,l))Bt(t,m$5,e);else if(function(e,t,n,r,i){return bt(e)&&!r&&!n&&(t||i)}(n,o,r,c,l))Bt(t,x$4,e);else if(function(e,t,n){return function(e){return 38===e}(e)&&!t&&!n}(n,o,l))Bt(t,v$3,e);else if(function(e,t,n){return function(e){return 40===e}(e)&&!t&&!n}(n,o,l))Bt(t,T$3,e);else if(function(e,t){return Et(e)&&t}(n,r))tr=!0,Bt(t,S$4,e);else if(function(e){return 32===e}(n))Bt(t,k$2,e);else if(function(e,t){return Q&&t&&79===e}(n,o))e.preventDefault(),tr=!0,Bt(t,s$2,!0);else if(function(e,t){return Et(e)&&!t}(n,r))tr=!1,Bt(t,S$4,e);else if(function(e,t,n,r){return Q?!t&&!n&&(Pt(e)||72===e&&r):!(r||t||n)&&Pt(e)}(n,c,l,o))Pt(n)?Bt(t,C$4,e):(e.preventDefault(),Bt(t,i$4,!0));else if(function(e){return 27===e}(n))Bt(t,b$2,e);else if(function(e,t,n,r,i){return Q?!(n||r||i)&&(Dt(e)||68===e&&t):!(t||r||i)&&Dt(e)}(n,o,r,c,l))Dt(n)?Bt(t,N$3,e):(e.preventDefault(),Bt(t,i$4,!1));else if(function(e,t,n){return Pt(e)&&(Q?t:n)}(n,c,o))e.preventDefault(),Bt(t,a$3,!0);else if(function(e,t,n){return Dt(e)&&(Q?t:n)}(n,c,o))e.preventDefault(),Bt(t,a$3,!1);else if(function(e,t){return Q&&t&&Pt(e)}(n,l))e.preventDefault(),Bt(t,f$4,!0);else if(function(e,t){return Q&&t&&Dt(e)}(n,l))e.preventDefault(),Bt(t,f$4,!1);else if(function(e,t,n,r){return 66===e&&!t&&wt(n,r)}(n,c,l,o))e.preventDefault(),Bt(t,d$3,"bold");else if(function(e,t,n,r){return 85===e&&!t&&wt(n,r)}(n,c,l,o))e.preventDefault(),Bt(t,d$3,"underline");else if(function(e,t,n,r){return 73===e&&!t&&wt(n,r)}(n,c,l,o))e.preventDefault(),Bt(t,d$3,"italic");else if(function(e,t,n,r){return 9===e&&!t&&!n&&!r}(n,c,o,l))Bt(t,w$3,e);else if(function(e,t,n,r){return 90===e&&!t&&wt(n,r)}(n,r,l,o))e.preventDefault(),Bt(t,h$3,void 0);else if(function(e,t,n,r){return Q?90===e&&n&&t:89===e&&r||90===e&&r&&t}(n,r,l,o))e.preventDefault(),Bt(t,g$5,void 0);else {Zr(t._editorState._selection)?!function(e,t,n,r){return !t&&67===e&&(Q?n:r)}(n,r,l,o)?!function(e,t,n,r){return !t&&88===e&&(Q?n:r)}(n,r,l,o)?It(n,l,o)&&(e.preventDefault(),Bt(t,z$1,e)):(e.preventDefault(),Bt(t,W,e)):(e.preventDefault(),Bt(t,M$3,e)):!X&&It(n,l,o)&&(e.preventDefault(),Bt(t,z$1,e));}(function(e,t,n,r){return e||t||n||r})(o,r,c,l)&&Bt(t,$$1,e);}],["pointerdown",function(e,t){const n=e.target,r=e.pointerType;n instanceof Node&&"touch"!==r&&Vi(t,(()=>{Hi(at(n))||(er=!0);}));}],["compositionstart",function(e,t){Vi(t,(()=>{const n=fi();if(Xr(n)&&!t.isComposing()){const r=n.anchor,i=n.anchor.getNode();ot(r.key),(e.timeStamp<qn+Hn||"element"===r.type||!n.isCollapsed()||i.getFormat()!==n.format||Br(i)&&i.getStyle()!==n.style)&&Bt(t,l$4,ve);}}));}],["compositionend",function(e,t){X?nr=!0:Vi(t,(()=>{cr(t,e.data);}));}],["input",function(e,t){e.stopPropagation(),Vi(t,(()=>{const n=fi(),r=e.data,i=lr(e);if(null!=r&&Xr(n)&&ir(n,i,r,e.timeStamp,!1)){nr&&(cr(t,r),nr=!1);const i=n.anchor,s=i.getNode(),o=nn(t._window);if(null===o)return;const c=i.offset;Y&&!n.isCollapsed()&&Br(s)&&null!==o.anchorNode&&s.getTextContent().slice(0,c)+r+s.getTextContent().slice(c+n.focus.offset)===Tt(o.anchorNode)||Bt(t,l$4,r);const u=r.length;X&&u>1&&"insertCompositionText"===e.inputType&&!t.isComposing()&&(n.anchor.offset-=u),Z||G||re||!t.isComposing()||(qn=0,ot(null));}else {St(!1,t,null!==r?r:void 0),nr&&(cr(t,r||void 0),nr=!1);}Pi(),Re(Oi());})),Yn=null;}],["click",function(e,t){Vi(t,(()=>{const n=fi(),i=nn(t._window),s=di();if(i)if(Xr(n)){const t=n.anchor,r=t.getNode();if("element"===t.type&&0===t.offset&&n.isCollapsed()&&!Yi(r)&&1===ht().getChildrenSize()&&r.getTopLevelElementOrThrow().isEmpty()&&null!==s&&n.is(s))i.removeAllRanges(),n.dirty=!0;else if(3===e.detail&&!n.isCollapsed()){r!==n.focus.getNode()&&(qi(r)?r.select(0):r.getParentOrThrow().select(0));}}else if("touch"===e.pointerType){const n=i.anchorNode;if(null!==n){const r=n.nodeType;if(r===ie||r===se){_t(ai(s,i,t,e));}}}Bt(t,r$1,e);}));}],["cut",$n],["copy",$n],["dragstart",$n],["dragover",$n],["dragend",$n],["paste",$n],["focus",$n],["blur",$n],["drop",$n]];Y&&jn.push(["beforeinput",(e,t)=>function(e,t){const n=e.inputType,r=lr(e);if("deleteCompositionText"===n||X&&zt(t))return;if("insertCompositionText"===n)return;Vi(t,(()=>{const _=fi();if("deleteContentBackward"===n){if(null===_){const e=di();if(!Xr(e))return;_t(e.clone());}if(Xr(_)){const n=_.anchor.key===_.focus.key;if(p=e.timeStamp,229===Qn&&p<qn+Hn&&t.isComposing()&&n){if(ot(null),qn=0,setTimeout((()=>{Vi(t,(()=>{ot(null);}));}),Hn),Xr(_)){const e=_.anchor.getNode();e.markDirty(),_.format=e.getFormat(),Br(e)||H$1(142),_.style=e.getStyle();}}else {ot(null),e.preventDefault();const r=_.anchor.getNode().getTextContent(),s=0===_.anchor.offset&&_.focus.offset===r.length;ne&&n&&!s||Bt(t,i$4,!0);}return}}var p;if(!Xr(_))return;const y=e.data;null!==Yn&&St(!1,t,Yn),_.dirty&&null===Yn||!_.isCollapsed()||Yi(_.anchor.getNode())||null===r||_.applyDOMRange(r),Yn=null;const m=_.anchor,x=_.focus,v=m.getNode(),T=x.getNode();if("insertText"!==n&&"insertTranspose"!==n)switch(e.preventDefault(),n){case"insertFromYank":case"insertFromDrop":case"insertReplacementText":Bt(t,l$4,e);break;case"insertFromComposition":ot(null),Bt(t,l$4,e);break;case"insertLineBreak":ot(null),Bt(t,s$2,!1);break;case"insertParagraph":ot(null),tr&&!G?(tr=!1,Bt(t,s$2,!1)):Bt(t,o$4,void 0);break;case"insertFromPaste":case"insertFromPasteAsQuotation":Bt(t,c$4,e);break;case"deleteByComposition":(function(e,t){return e!==t||qi(e)||qi(t)||!e.isToken()||!t.isToken()})(v,T)&&Bt(t,u$3,e);break;case"deleteByDrag":case"deleteByCut":Bt(t,u$3,e);break;case"deleteContent":Bt(t,i$4,!1);break;case"deleteWordBackward":Bt(t,a$3,!0);break;case"deleteWordForward":Bt(t,a$3,!1);break;case"deleteHardLineBackward":case"deleteSoftLineBackward":Bt(t,f$4,!0);break;case"deleteContentForward":case"deleteHardLineForward":case"deleteSoftLineForward":Bt(t,f$4,!1);break;case"formatStrikeThrough":Bt(t,d$3,"strikethrough");break;case"formatBold":Bt(t,d$3,"bold");break;case"formatItalic":Bt(t,d$3,"italic");break;case"formatUnderline":Bt(t,d$3,"underline");break;case"historyUndo":Bt(t,h$3,void 0);break;case"historyRedo":Bt(t,g$5,void 0);}else {if("\n"===y)e.preventDefault(),Bt(t,s$2,!1);else if(y===xe)e.preventDefault(),Bt(t,o$4,void 0);else if(null==y&&e.dataTransfer){const t=e.dataTransfer.getData("text/plain");e.preventDefault(),_.insertRawText(t);}else null!=y&&ir(_,r,y,e.timeStamp,!0)?(e.preventDefault(),Bt(t,l$4,y)):Yn=y;Xn=e.timeStamp;}}));}(e,t)]);let qn=0,Qn=0,Xn=0,Yn=null;const Zn=new WeakMap;let Gn=!1,er=!1,tr=!1,nr=!1,rr=[0,"",0,"root",0];function ir(e,t,n,r,i){const s=e.anchor,o=e.focus,l=s.getNode(),c=Oi(),u=nn(c._window),a=null!==u?u.anchorNode:null,f=s.key,d=c.getElementByKey(f),h=n.length;return f!==o.key||!Br(l)||(!i&&(!Y||Xn<r+50)||l.isDirty()&&h<2||mt(n))&&s.offset!==o.offset&&!l.isComposing()||Ze(l)||l.isDirty()&&h>1||(i||!Y)&&null!==d&&!l.isComposing()&&a!==et(d)||null!==u&&null!==t&&(!t.collapsed||t.startContainer!==u.anchorNode||t.startOffset!==u.anchorOffset)||l.getFormat()!==e.format||l.getStyle()!==e.style||Ct(e,l)}function sr(e,t){return null!==e&&null!==e.nodeValue&&e.nodeType===se&&0!==t&&t!==e.nodeValue.length}function or(e,n,r){const{anchorNode:i,anchorOffset:s,focusNode:o,focusOffset:l}=e;Gn&&(Gn=!1,sr(i,s)&&sr(o,l))||Vi(n,(()=>{if(!r)return void _t(null);if(!Xe(n,i,o))return;const c=fi();if(Xr(c)){const t=c.anchor,r=t.getNode();if(c.isCollapsed()){"Range"===e.type&&e.anchorNode===e.focusNode&&(c.dirty=!0);const i=Ht(n).event,s=i?i.timeStamp:performance.now(),[o,l,u,a,f]=rr,d=ht(),h=!1===n.isComposing()&&""===d.getTextContent();s<f+200&&t.offset===u&&t.key===a?(c.format=o,c.style=l):"text"===t.type?(Br(r)||H$1(141),c.format=r.getFormat(),c.style=r.getStyle()):"element"!==t.type||h||(c.format=0,c.style="");}else {const e=t.key,n=c.focus.key,r=c.getNodes(),i=r.length,o=c.isBackward(),u=o?l:s,a=o?s:l,f=o?n:e,d=o?e:n;let h=fe,g=!1;for(let e=0;e<i;e++){const t=r[e],n=t.getTextContentSize();if(Br(t)&&0!==n&&!(0===e&&t.__key===f&&u===n||e===i-1&&t.__key===d&&0===a)&&(g=!0,h&=t.getFormat(),0===h))break}c.format=g?h:0;}}Bt(n,t$2,void 0);}));}function lr(e){if(!e.getTargetRanges)return null;const t=e.getTargetRanges();return 0===t.length?null:t[0]}function cr(e,t){const n=e._compositionKey;if(ot(null),null!==n&&null!=t){if(""===t){const t=ct(n),r=et(e.getElementByKey(n));return void(null!==r&&null!==r.nodeValue&&Br(t)&&kt(t,r.nodeValue,null,null,!0))}if("\n"===t[t.length-1]){const t=fi();if(Xr(t)){const n=t.focus;return t.anchor.set(n.key,n.offset,n.type),void Bt(e,S$4,null)}}}St(!0,e,t);}function ur(e){let t=e.__lexicalEventHandles;return void 0===t&&(t=[],e.__lexicalEventHandles=t),t}const ar=new Map;function fr(e){const t=e.target,n=nn(null==t?null:9===t.nodeType?t.defaultView:t.ownerDocument.defaultView);if(null===n)return;const r=Ye(n.anchorNode);if(null===r)return;er&&(er=!1,Vi(r,(()=>{const t=di(),i=n.anchorNode;if(null===i)return;const s=i.nodeType;if(s!==ie&&s!==se)return;_t(ai(t,n,r,e));})));const i=xt(r),s=i[i.length-1],o=s._key,l=ar.get(o),c=l||s;c!==r&&or(n,c,!1),or(n,r,!0),r!==s?ar.set(o,r):l&&ar.delete(o);}function dr(e){e._lexicalHandled=!0;}function hr(e){return !0===e._lexicalHandled}function gr(e){const t=e.ownerDocument,n=Zn.get(t);if(void 0===n)throw Error("Root element not registered");Zn.set(t,n-1),1===n&&t.removeEventListener("selectionchange",fr);const r=e.__lexicalEditor;null!=r&&(!function(e){if(null!==e._parentEditor){const t=xt(e),n=t[t.length-1]._key;ar.get(n)===e&&ar.delete(n);}else ar.delete(e._key);}(r),e.__lexicalEditor=null);const i=ur(e);for(let e=0;e<i.length;e++)i[e]();e.__lexicalEventHandles=[];}function _r(e,t,n){Pi();const r=e.__key,i=e.getParent();if(null===i)return;const s=function(e){const t=fi();if(!Xr(t)||!qi(e))return t;const{anchor:n,focus:r}=t,i=n.getNode(),s=r.getNode();return $t(i,e)&&n.set(e.__key,0,"element"),$t(s,e)&&r.set(e.__key,0,"element"),t}(e);let o=!1;if(Xr(s)&&t){const t=s.anchor,n=s.focus;t.key===r&&(_i(t,e,i,e.getPreviousSibling(),e.getNextSibling()),o=!0),n.key===r&&(_i(n,e,i,e.getPreviousSibling(),e.getNextSibling()),o=!0);}else Zr(s)&&t&&e.isSelected()&&e.selectPrevious();if(Xr(s)&&t&&!o){const t=e.getIndexWithinParent();it(e),hi(s,i,t,-1);}else it(e);n||Qt(i)||i.canBeEmpty()||!i.isEmpty()||_r(i,t),t&&Yi(i)&&i.isEmpty()&&i.selectEnd();}class pr{static getType(){H$1(64,this.name);}static clone(e){H$1(65,this.name);}constructor(e){this.__type=this.constructor.getType(),this.__parent=null,this.__prev=null,this.__next=null,rt(this,e);}getType(){return this.__type}isInline(){H$1(137,this.constructor.name);}isAttached(){let e=this.__key;for(;null!==e;){if("root"===e)return !0;const t=ct(e);if(null===t)break;e=t.__parent;}return !1}isSelected(e){const t=e||fi();if(null==t)return !1;const n=t.getNodes().some((e=>e.__key===this.__key));return (Br(this)||!Xr(t)||"element"!==t.anchor.type||"element"!==t.focus.type||t.anchor.key!==t.focus.key||t.anchor.offset!==t.focus.offset)&&n}getKey(){return this.__key}getIndexWithinParent(){const e=this.getParent();if(null===e)return -1;let t=e.getFirstChild(),n=0;for(;null!==t;){if(this.is(t))return n;n++,t=t.getNextSibling();}return -1}getParent(){const e=this.getLatest().__parent;return null===e?null:ct(e)}getParentOrThrow(){const e=this.getParent();return null===e&&H$1(66,this.__key),e}getTopLevelElement(){let e=this;for(;null!==e;){const t=e.getParent();if(Qt(t))return qi(e)||H$1(138),e;e=t;}return null}getTopLevelElementOrThrow(){const e=this.getTopLevelElement();return null===e&&H$1(67,this.__key),e}getParents(){const e=[];let t=this.getParent();for(;null!==t;)e.push(t),t=t.getParent();return e}getParentKeys(){const e=[];let t=this.getParent();for(;null!==t;)e.push(t.__key),t=t.getParent();return e}getPreviousSibling(){const e=this.getLatest().__prev;return null===e?null:ct(e)}getPreviousSiblings(){const e=[],t=this.getParent();if(null===t)return e;let n=t.getFirstChild();for(;null!==n&&!n.is(this);)e.push(n),n=n.getNextSibling();return e}getNextSibling(){const e=this.getLatest().__next;return null===e?null:ct(e)}getNextSiblings(){const e=[];let t=this.getNextSibling();for(;null!==t;)e.push(t),t=t.getNextSibling();return e}getCommonAncestor(e){const t=this.getParents(),n=e.getParents();qi(this)&&t.unshift(this),qi(e)&&n.unshift(e);const r=t.length,i=n.length;if(0===r||0===i||t[r-1]!==n[i-1])return null;const s=new Set(n);for(let e=0;e<r;e++){const n=t[e];if(s.has(n))return n}return null}is(e){return null!=e&&this.__key===e.__key}isBefore(e){if(this===e)return !1;if(e.isParentOf(this))return !0;if(this.isParentOf(e))return !1;const t=this.getCommonAncestor(e);let n=0,r=0,i=this;for(;;){const e=i.getParentOrThrow();if(e===t){n=i.getIndexWithinParent();break}i=e;}for(i=e;;){const e=i.getParentOrThrow();if(e===t){r=i.getIndexWithinParent();break}i=e;}return n<r}isParentOf(e){const t=this.__key;if(t===e.__key)return !1;let n=e;for(;null!==n;){if(n.__key===t)return !0;n=n.getParent();}return !1}getNodesBetween(e){const t=this.isBefore(e),n=[],r=new Set;let i=this;for(;null!==i;){const s=i.__key;if(r.has(s)||(r.add(s),n.push(i)),i===e)break;const o=qi(i)?t?i.getFirstChild():i.getLastChild():null;if(null!==o){i=o;continue}const l=t?i.getNextSibling():i.getPreviousSibling();if(null!==l){i=l;continue}const c=i.getParentOrThrow();if(r.has(c.__key)||n.push(c),c===e)break;let u=null,a=c;do{if(null===a&&H$1(68),u=t?a.getNextSibling():a.getPreviousSibling(),a=a.getParent(),null===a)break;null!==u||r.has(a.__key)||n.push(a);}while(null===u);i=u;}return t||n.reverse(),n}isDirty(){const e=Oi()._dirtyLeaves;return null!==e&&e.has(this.__key)}getLatest(){const e=ct(this.__key);return null===e&&H$1(113),e}getWritable(){Pi();const e=Ii(),t=Oi(),n=e._nodeMap,r=this.__key,i=this.getLatest(),s=i.__parent,o=t._cloneNotNeeded,l=fi();if(null!==l&&l.setCachedNodes(null),o.has(r))return st(i),i;const c=i.constructor.clone(i);return c.__parent=s,c.__next=i.__next,c.__prev=i.__prev,qi(i)&&qi(c)?(c.__first=i.__first,c.__last=i.__last,c.__size=i.__size,c.__indent=i.__indent,c.__format=i.__format,c.__dir=i.__dir):Br(i)&&Br(c)&&(c.__format=i.__format,c.__style=i.__style,c.__mode=i.__mode,c.__detail=i.__detail),o.add(r),c.__key=r,st(c),n.set(r,c),c}getTextContent(){return ""}getTextContentSize(){return this.getTextContent().length}createDOM(e,t){H$1(70);}updateDOM(e,t,n){H$1(71);}exportDOM(e){return {element:this.createDOM(e._config,e)}}exportJSON(){H$1(72);}static importJSON(e){H$1(18,this.name);}static transform(){return null}remove(e){_r(this,!0,e);}replace(e,t){Pi();let n=fi();null!==n&&(n=n.clone()),Zt(this,e);const r=this.getLatest(),i=this.__key,s=e.__key,o=e.getWritable(),l=this.getParentOrThrow().getWritable(),c=l.__size;it(o);const u=r.getPreviousSibling(),a=r.getNextSibling(),f=r.__prev,d=r.__next,h=r.__parent;if(_r(r,!1,!0),null===u)l.__first=s;else {u.getWritable().__next=s;}if(o.__prev=f,null===a)l.__last=s;else {a.getWritable().__prev=s;}if(o.__next=d,o.__parent=h,l.__size=c,t&&(qi(this)&&qi(o)||H$1(139),this.getChildren().forEach((e=>{o.append(e);}))),Xr(n)){_t(n);const e=n.anchor,t=n.focus;e.key===i&&Hr(e,o),t.key===i&&Hr(t,o);}return lt()===i&&ot(s),o}insertAfter(e,t=!0){Pi(),Zt(this,e);const n=this.getWritable(),r=e.getWritable(),i=r.getParent(),s=fi();let o=!1,l=!1;if(null!==i){const t=e.getIndexWithinParent();if(it(r),Xr(s)){const e=i.__key,n=s.anchor,r=s.focus;o="element"===n.type&&n.key===e&&n.offset===t+1,l="element"===r.type&&r.key===e&&r.offset===t+1;}}const c=this.getNextSibling(),u=this.getParentOrThrow().getWritable(),a=r.__key,f=n.__next;if(null===c)u.__last=a;else {c.getWritable().__prev=a;}if(u.__size++,n.__next=a,r.__next=f,r.__prev=n.__key,r.__parent=n.__parent,t&&Xr(s)){const e=this.getIndexWithinParent();hi(s,u,e+1);const t=u.__key;o&&s.anchor.set(t,e+2,"element"),l&&s.focus.set(t,e+2,"element");}return e}insertBefore(e,t=!0){Pi(),Zt(this,e);const n=this.getWritable(),r=e.getWritable(),i=r.__key;it(r);const s=this.getPreviousSibling(),o=this.getParentOrThrow().getWritable(),l=n.__prev,c=this.getIndexWithinParent();if(null===s)o.__first=i;else {s.getWritable().__next=i;}o.__size++,n.__prev=i,r.__prev=l,r.__next=n.__key,r.__parent=n.__parent;const u=fi();if(t&&Xr(u)){hi(u,this.getParentOrThrow(),c);}return e}isParentRequired(){return !1}createParentElementNode(){return rs()}selectStart(){return this.selectPrevious()}selectEnd(){return this.selectNext(0,0)}selectPrevious(e,t){Pi();const n=this.getPreviousSibling(),r=this.getParentOrThrow();if(null===n)return r.select(0,0);if(qi(n))return n.select();if(!Br(n)){const e=n.getIndexWithinParent()+1;return r.select(e,e)}return n.select(e,t)}selectNext(e,t){Pi();const n=this.getNextSibling(),r=this.getParentOrThrow();if(null===n)return r.select();if(qi(n))return n.select(0,0);if(!Br(n)){const e=n.getIndexWithinParent();return r.select(e,e)}return n.select(e,t)}markDirty(){this.getWritable();}}class yr extends pr{static getType(){return "linebreak"}static clone(e){return new yr(e.__key)}constructor(e){super(e);}getTextContent(){return "\n"}createDOM(){return document.createElement("br")}updateDOM(){return !1}static importDOM(){return {br:e=>function(e){const t=e.parentElement;if(null!==t){const n=t.firstChild;if(n===e||n.nextSibling===e&&Tr(n)){const n=t.lastChild;if(n===e||n.previousSibling===e&&Tr(n))return !0}}return !1}(e)?null:{conversion:mr,priority:0}}}static importJSON(e){return xr()}exportJSON(){return {type:"linebreak",version:1}}}function mr(e){return {node:xr()}}function xr(){return Yt(new yr)}function vr(e){return e instanceof yr}function Tr(e){return e.nodeType===se&&/^( |\t|\r?\n)+$/.test(e.textContent||"")}function Sr(e,t){return 16&t?"code":128&t?"mark":32&t?"sub":64&t?"sup":null}function kr(e,t){return 1&t?"strong":2&t?"em":"span"}function Cr(e,t,n,r,i){const s=r.classList;let o=At(i,"base");void 0!==o&&s.add(...o),o=At(i,"underlineStrikethrough");let l=!1;const c=t&ae&&t&ue;void 0!==o&&(n&ae&&n&ue?(l=!0,c||s.add(...o)):c&&s.remove(...o));for(const e in be){const r=be[e];if(o=At(i,e),void 0!==o)if(n&r){if(l&&("underline"===e||"strikethrough"===e)){t&r&&s.remove(...o);continue}(0==(t&r)||c&&"underline"===e||"strikethrough"===e)&&s.add(...o);}else t&r&&s.remove(...o);}}function br(e,t,n){const r=t.firstChild,i=n.isComposing(),s=e+(i?me:"");if(null==r)t.textContent=s;else {const e=r.nodeValue;if(e!==s)if(i||X){const[t,n,i]=function(e,t){const n=e.length,r=t.length;let i=0,s=0;for(;i<n&&i<r&&e[i]===t[i];)i++;for(;s+i<n&&s+i<r&&e[n-s-1]===t[r-s-1];)s++;return [i,n-i-s,t.slice(i,r-s)]}(e,s);0!==n&&r.deleteData(t,n),r.insertData(t,i);}else r.nodeValue=s;}}function Nr(e,t,n,r,i,s){br(i,e,t);const o=s.theme.text;void 0!==o&&Cr(0,0,r,e,o);}function wr(e,t){const n=document.createElement(t);return n.appendChild(e),n}class Er extends pr{static getType(){return "text"}static clone(e){return new Er(e.__text,e.__key)}constructor(e,t){super(t),this.__text=e,this.__format=0,this.__style="",this.__mode=0,this.__detail=0;}getFormat(){return this.getLatest().__format}getDetail(){return this.getLatest().__detail}getMode(){const e=this.getLatest();return De[e.__mode]}getStyle(){return this.getLatest().__style}isToken(){return 1===this.getLatest().__mode}isComposing(){return this.__key===lt()}isSegmented(){return 2===this.getLatest().__mode}isDirectionless(){return 0!=(1&this.getLatest().__detail)}isUnmergeable(){return 0!=(2&this.getLatest().__detail)}hasFormat(e){const t=be[e];return 0!=(this.getFormat()&t)}isSimpleText(){return "text"===this.__type&&0===this.__mode}getTextContent(){return this.getLatest().__text}getFormatFlags(e,t){return tt(this.getLatest().__format,e,t)}canHaveFormat(){return !0}createDOM(e,t){const n=this.__format,r=Sr(0,n),i=kr(0,n),s=null===r?i:r,o=document.createElement(s);let l=o;this.hasFormat("code")&&o.setAttribute("spellcheck","false"),null!==r&&(l=document.createElement(i),o.appendChild(l));Nr(l,this,0,n,this.__text,e);const c=this.__style;return ""!==c&&(o.style.cssText=c),o}updateDOM(e,t,n){const r=this.__text,i=e.__format,s=this.__format,o=Sr(0,i),l=Sr(0,s),c=kr(0,i),u=kr(0,s);if((null===o?c:o)!==(null===l?u:l))return !0;if(o===l&&c!==u){const e=t.firstChild;null==e&&H$1(48);const i=document.createElement(u);return Nr(i,this,0,s,r,n),t.replaceChild(i,e),!1}let a=t;null!==l&&null!==o&&(a=t.firstChild,null==a&&H$1(49)),br(r,a,this);const f=n.theme.text;void 0!==f&&i!==s&&Cr(0,i,s,a,f);const d=e.__style,h=this.__style;return d!==h&&(t.style.cssText=h),!1}static importDOM(){return {"#text":()=>({conversion:Ar,priority:0}),b:()=>({conversion:Dr,priority:0}),code:()=>({conversion:Wr,priority:0}),em:()=>({conversion:Wr,priority:0}),i:()=>({conversion:Wr,priority:0}),s:()=>({conversion:Wr,priority:0}),span:()=>({conversion:Pr,priority:0}),strong:()=>({conversion:Wr,priority:0}),sub:()=>({conversion:Wr,priority:0}),sup:()=>({conversion:Wr,priority:0}),u:()=>({conversion:Wr,priority:0})}}static importJSON(e){const t=zr(e.text);return t.setFormat(e.format),t.setDetail(e.detail),t.setMode(e.mode),t.setStyle(e.style),t}exportDOM(e){let{element:t}=super.exportDOM(e);return null!==t&&on(t)||H$1(132),t.style.whiteSpace="pre-wrap",this.hasFormat("bold")&&(t=wr(t,"b")),this.hasFormat("italic")&&(t=wr(t,"i")),this.hasFormat("strikethrough")&&(t=wr(t,"s")),this.hasFormat("underline")&&(t=wr(t,"u")),{element:t}}exportJSON(){return {detail:this.getDetail(),format:this.getFormat(),mode:this.getMode(),style:this.getStyle(),text:this.getTextContent(),type:"text",version:1}}selectionTransform(e,t){}setFormat(e){const t=this.getWritable();return t.__format="string"==typeof e?be[e]:e,t}setDetail(e){const t=this.getWritable();return t.__detail="string"==typeof e?Ne[e]:e,t}setStyle(e){const t=this.getWritable();return t.__style=e,t}toggleFormat(e){const t=tt(this.getFormat(),e,null);return this.setFormat(t)}toggleDirectionless(){const e=this.getWritable();return e.__detail^=1,e}toggleUnmergeable(){const e=this.getWritable();return e.__detail^=2,e}setMode(e){const t=Pe[e];if(this.__mode===t)return this;const n=this.getWritable();return n.__mode=t,n}setTextContent(e){if(this.__text===e)return this;const t=this.getWritable();return t.__text=e,t}select(e,t){Pi();let n=e,r=t;const i=fi(),s=this.getTextContent(),o=this.__key;if("string"==typeof s){const e=s.length;void 0===n&&(n=e),void 0===r&&(r=e);}else n=0,r=0;if(!Xr(i))return li(o,n,o,r,"text","text");{const e=lt();e!==i.anchor.key&&e!==i.focus.key||ot(o),i.setTextNodeRange(this,n,this,r);}return i}selectStart(){return this.select(0,0)}selectEnd(){const e=this.getTextContentSize();return this.select(e,e)}spliceText(e,t,n,r){const i=this.getWritable(),s=i.__text,o=n.length;let l=e;l<0&&(l=o+l,l<0&&(l=0));const c=fi();if(r&&Xr(c)){const t=e+o;c.setTextNodeRange(i,t,i,t);}const u=s.slice(0,l)+n+s.slice(l+t);return i.__text=u,i}canInsertTextBefore(){return !0}canInsertTextAfter(){return !0}splitText(...e){Pi();const t=this.getLatest(),n=t.getTextContent(),r=t.__key,i=lt(),s=new Set(e),o=[],l=n.length;let c="";for(let e=0;e<l;e++)""!==c&&s.has(e)&&(o.push(c),c=""),c+=n[e];""!==c&&o.push(c);const u=o.length;if(0===u)return [];if(o[0]===n)return [t];const a=o[0],f=t.getParentOrThrow();let d;const h=t.getFormat(),g=t.getStyle(),_=t.__detail;let p=!1;t.isSegmented()?(d=zr(a),d.__format=h,d.__style=g,d.__detail=_,p=!0):(d=t.getWritable(),d.__text=a);const y=fi(),m=[d];let x=a.length;for(let e=1;e<u;e++){const t=o[e],n=t.length,s=zr(t).getWritable();s.__format=h,s.__style=g,s.__detail=_;const l=s.__key,c=x+n;if(Xr(y)){const e=y.anchor,t=y.focus;e.key===r&&"text"===e.type&&e.offset>x&&e.offset<=c&&(e.key=l,e.offset-=x,y.dirty=!0),t.key===r&&"text"===t.type&&t.offset>x&&t.offset<=c&&(t.key=l,t.offset-=x,y.dirty=!0);}i===r&&ot(l),x=c,m.push(s);}!function(e){const t=e.getPreviousSibling(),n=e.getNextSibling();null!==t&&st(t),null!==n&&st(n);}(this);const v=f.getWritable(),T=this.getIndexWithinParent();return p?(v.splice(T,0,m),this.remove()):v.splice(T,1,m),Xr(y)&&hi(y,f,T,u-1),m}mergeWithSibling(e){const t=e===this.getPreviousSibling();t||e===this.getNextSibling()||H$1(50);const n=this.__key,r=e.__key,i=this.__text,s=i.length;lt()===r&&ot(n);const o=fi();if(Xr(o)){const i=o.anchor,l=o.focus;null!==i&&i.key===r&&(pi(i,t,n,e,s),o.dirty=!0),null!==l&&l.key===r&&(pi(l,t,n,e,s),o.dirty=!0);}const l=e.__text,c=t?l+i:i+l;this.setTextContent(c);const u=this.getWritable();return e.remove(),u}isTextEntity(){return !1}}function Pr(e){const t=e,n="700"===t.style.fontWeight,r="line-through"===t.style.textDecoration,i="italic"===t.style.fontStyle,s="underline"===t.style.textDecoration,o=t.style.verticalAlign;return {forChild:e=>Br(e)?(n&&e.toggleFormat("bold"),r&&e.toggleFormat("strikethrough"),i&&e.toggleFormat("italic"),s&&e.toggleFormat("underline"),"sub"===o&&e.toggleFormat("subscript"),"super"===o&&e.toggleFormat("superscript"),e):e,node:null}}function Dr(e){const t="normal"===e.style.fontWeight;return {forChild:e=>(Br(e)&&!t&&e.toggleFormat("bold"),e),node:null}}const Ir=new WeakMap;function Or(e){return "PRE"===e.nodeName||e.nodeType===ie&&void 0!==e.style&&void 0!==e.style.whiteSpace&&e.style.whiteSpace.startsWith("pre")}function Ar(e){const t=e;null===e.parentElement&&H$1(129);let n=t.textContent||"";if(null!==function(e){let t,n=e.parentNode;const r=[e];for(;null!==n&&void 0===(t=Ir.get(n))&&!Or(n);)r.push(n),n=n.parentNode;const i=void 0===t?n:t;for(let e=0;e<r.length;e++)Ir.set(r[e],i);return i}(t)){const e=n.split(/(\r?\n|\t)/),t=[],r=e.length;for(let n=0;n<r;n++){const r=e[n];"\n"===r||"\r\n"===r?t.push(xr()):"\t"===r?t.push(Kr()):""!==r&&t.push(zr(r));}return {node:t}}if(n=n.replace(/\r/g,"").replace(/[ \t\n]+/g," "),""===n)return {node:null};if(" "===n[0]){let e=t,r=!0;for(;null!==e&&null!==(e=Fr(e,!1));){const t=e.textContent||"";if(t.length>0){/[ \t\n]$/.test(t)&&(n=n.slice(1)),r=!1;break}}r&&(n=n.slice(1));}if(" "===n[n.length-1]){let e=t,r=!0;for(;null!==e&&null!==(e=Fr(e,!0));){if((e.textContent||"").replace(/^( |\t|\r?\n)+/,"").length>0){r=!1;break}}r&&(n=n.slice(0,n.length-1));}return ""===n?{node:null}:{node:zr(n)}}const Lr=new RegExp(/^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/,"i");function Fr(e,t){let n=e;for(;;){let e;for(;null===(e=t?n.nextSibling:n.previousSibling);){const e=n.parentElement;if(null===e)return null;n=e;}if(n=e,n.nodeType===ie){const e=n.style.display;if(""===e&&null===n.nodeName.match(Lr)||""!==e&&!e.startsWith("inline"))return null}let r=n;for(;null!==(r=t?n.firstChild:n.lastChild);)n=r;if(n.nodeType===se)return n;if("BR"===n.nodeName)return null}}const Mr={code:"code",em:"italic",i:"italic",s:"strikethrough",strong:"bold",sub:"subscript",sup:"superscript",u:"underline"};function Wr(e){const t=Mr[e.nodeName.toLowerCase()];return void 0===t?{node:null}:{forChild:e=>(Br(e)&&!e.hasFormat(t)&&e.toggleFormat(t),e),node:null}}function zr(e=""){return Yt(new Er(e))}function Br(e){return e instanceof Er}class Rr extends Er{static getType(){return "tab"}static clone(e){const t=new Rr(e.__key);return t.__text=e.__text,t.__format=e.__format,t.__style=e.__style,t}constructor(e){super("\t",e),this.__detail=2;}static importDOM(){return null}static importJSON(e){const t=Kr();return t.setFormat(e.format),t.setStyle(e.style),t}exportJSON(){return {...super.exportJSON(),type:"tab",version:1}}setTextContent(e){H$1(126);}setDetail(e){H$1(127);}setMode(e){H$1(128);}canInsertTextBefore(){return !1}canInsertTextAfter(){return !1}}function Kr(){return Yt(new Rr)}function Jr(e){return e instanceof Rr}class Ur{constructor(e,t,n){this._selection=null,this.key=e,this.offset=t,this.type=n;}is(e){return this.key===e.key&&this.offset===e.offset&&this.type===e.type}isBefore(e){let t=this.getNode(),n=e.getNode();const r=this.offset,i=e.offset;if(qi(t)){const e=t.getDescendantByIndex(r);t=null!=e?e:t;}if(qi(n)){const e=n.getDescendantByIndex(i);n=null!=e?e:n;}return t===n?r<i:t.isBefore(n)}getNode(){const e=ct(this.key);return null===e&&H$1(20),e}set(e,t,n){const r=this._selection,i=this.key;this.key=e,this.offset=t,this.type=n,Ei()||(lt()===i&&ot(e),null!==r&&(r.setCachedNodes(null),r.dirty=!0));}}function Vr(e,t,n){return new Ur(e,t,n)}function $r(e,t){let n=t.__key,r=e.offset,i="element";if(Br(t)){i="text";const e=t.getTextContentSize();r>e&&(r=e);}else if(!qi(t)){const e=t.getNextSibling();if(Br(e))n=e.__key,r=0,i="text";else {const e=t.getParent();e&&(n=e.__key,r=t.getIndexWithinParent()+1);}}e.set(n,r,i);}function Hr(e,t){if(qi(t)){const n=t.getLastDescendant();qi(n)||Br(n)?$r(e,n):$r(e,t);}else $r(e,t);}function jr(e,t,n,r){const i=e.getNode(),s=i.getChildAtIndex(e.offset),o=zr(),l=Yi(i)?rs().append(o):o;o.setFormat(n),o.setStyle(r),null===s?i.append(l):s.insertBefore(l),e.is(t)&&t.set(o.__key,0,"text"),e.set(o.__key,0,"text");}function qr(e,t,n,r){e.key=t,e.offset=n,e.type=r;}class Qr{constructor(e){this._cachedNodes=null,this._nodes=e,this.dirty=!1;}getCachedNodes(){return this._cachedNodes}setCachedNodes(e){this._cachedNodes=e;}is(e){if(!Zr(e))return !1;const t=this._nodes,n=e._nodes;return t.size===n.size&&Array.from(t).every((e=>n.has(e)))}isCollapsed(){return !1}isBackward(){return !1}getStartEndPoints(){return null}add(e){this.dirty=!0,this._nodes.add(e),this._cachedNodes=null;}delete(e){this.dirty=!0,this._nodes.delete(e),this._cachedNodes=null;}clear(){this.dirty=!0,this._nodes.clear(),this._cachedNodes=null;}has(e){return this._nodes.has(e)}clone(){return new Qr(new Set(this._nodes))}extract(){return this.getNodes()}insertRawText(e){}insertText(){}insertNodes(e){const t=this.getNodes(),n=t.length,r=t[n-1];let i;if(Br(r))i=r.select();else {const e=r.getIndexWithinParent()+1;i=r.getParentOrThrow().select(e,e);}i.insertNodes(e);for(let e=0;e<n;e++)t[e].remove();}getNodes(){const e=this._cachedNodes;if(null!==e)return e;const t=this._nodes,n=[];for(const e of t){const t=ct(e);null!==t&&n.push(t);}return Ei()||(this._cachedNodes=n),n}getTextContent(){const e=this.getNodes();let t="";for(let n=0;n<e.length;n++)t+=e[n].getTextContent();return t}}function Xr(e){return e instanceof Yr}class Yr{constructor(e,t,n,r){this.anchor=e,this.focus=t,e._selection=this,t._selection=this,this._cachedNodes=null,this.format=n,this.style=r,this.dirty=!1;}getCachedNodes(){return this._cachedNodes}setCachedNodes(e){this._cachedNodes=e;}is(e){return !!Xr(e)&&(this.anchor.is(e.anchor)&&this.focus.is(e.focus)&&this.format===e.format&&this.style===e.style)}isCollapsed(){return this.anchor.is(this.focus)}getNodes(){const e=this._cachedNodes;if(null!==e)return e;const t=this.anchor,n=this.focus,r=t.isBefore(n),i=r?t:n,s=r?n:t;let o=i.getNode(),l=s.getNode();const c=i.offset,u=s.offset;if(qi(o)){const e=o.getDescendantByIndex(c);o=null!=e?e:o;}if(qi(l)){let e=l.getDescendantByIndex(u);null!==e&&e!==o&&l.getChildAtIndex(u)===e&&(e=e.getPreviousSibling()),l=null!=e?e:l;}let a;return a=o.is(l)?qi(o)&&o.getChildrenSize()>0?[]:[o]:o.getNodesBetween(l),Ei()||(this._cachedNodes=a),a}setTextNodeRange(e,t,n,r){qr(this.anchor,e.__key,t,"text"),qr(this.focus,n.__key,r,"text"),this._cachedNodes=null,this.dirty=!0;}getTextContent(){const e=this.getNodes();if(0===e.length)return "";const t=e[0],n=e[e.length-1],r=this.anchor,i=this.focus,s=r.isBefore(i),[o,l]=ei(this);let c="",u=!0;for(let a=0;a<e.length;a++){const f=e[a];if(qi(f)&&!f.isInline())u||(c+="\n"),u=!f.isEmpty();else if(u=!1,Br(f)){let e=f.getTextContent();f===t?f===n?"element"===r.type&&"element"===i.type&&i.offset!==r.offset||(e=o<l?e.slice(o,l):e.slice(l,o)):e=s?e.slice(o):e.slice(l):f===n&&(e=s?e.slice(0,l):e.slice(0,o)),c+=e;}else !Hi(f)&&!vr(f)||f===n&&this.isCollapsed()||(c+=f.getTextContent());}return c}applyDOMRange(e){const t=Oi(),n=t.getEditorState()._selection,r=si(e.startContainer,e.startOffset,e.endContainer,e.endOffset,t,n);if(null===r)return;const[i,s]=r;qr(this.anchor,i.key,i.offset,i.type),qr(this.focus,s.key,s.offset,s.type),this._cachedNodes=null;}clone(){const e=this.anchor,t=this.focus;return new Yr(Vr(e.key,e.offset,e.type),Vr(t.key,t.offset,t.type),this.format,this.style)}toggleFormat(e){this.format=tt(this.format,e,null),this.dirty=!0;}setStyle(e){this.style=e,this.dirty=!0;}hasFormat(e){const t=be[e];return 0!=(this.format&t)}insertRawText(e){const t=e.split(/(\r?\n|\t)/),n=[],r=t.length;for(let e=0;e<r;e++){const r=t[e];"\n"===r||"\r\n"===r?n.push(xr()):"\t"===r?n.push(Kr()):n.push(zr(r));}this.insertNodes(n);}insertText(e){const t=this.anchor,n=this.focus,r=this.isCollapsed()||t.isBefore(n),i=this.format,s=this.style;r&&"element"===t.type?jr(t,n,i,s):r||"element"!==n.type||jr(n,t,i,s);const o=this.getNodes(),l=o.length,c=r?n:t,u=(r?t:n).offset,a=c.offset;let f=o[0];Br(f)||H$1(26);const d=f.getTextContent().length,h=f.getParentOrThrow();let g=o[l-1];if(this.isCollapsed()&&u===d&&(f.isSegmented()||f.isToken()||!f.canInsertTextAfter()||!h.canInsertTextAfter()&&null===f.getNextSibling())){let t=f.getNextSibling();if(Br(t)&&t.canInsertTextBefore()&&!Ze(t)||(t=zr(),t.setFormat(i),h.canInsertTextAfter()?f.insertAfter(t):h.insertAfter(t)),t.select(0,0),f=t,""!==e)return void this.insertText(e)}else if(this.isCollapsed()&&0===u&&(f.isSegmented()||f.isToken()||!f.canInsertTextBefore()||!h.canInsertTextBefore()&&null===f.getPreviousSibling())){let t=f.getPreviousSibling();if(Br(t)&&!Ze(t)||(t=zr(),t.setFormat(i),h.canInsertTextBefore()?f.insertBefore(t):h.insertBefore(t)),t.select(),f=t,""!==e)return void this.insertText(e)}else if(f.isSegmented()&&u!==d){const e=zr(f.getTextContent());e.setFormat(i),f.replace(e),f=e;}else if(!this.isCollapsed()&&""!==e){const t=g.getParent();if(!h.canInsertTextBefore()||!h.canInsertTextAfter()||qi(t)&&(!t.canInsertTextBefore()||!t.canInsertTextAfter()))return this.insertText(""),ii(this.anchor,this.focus,null),void this.insertText(e)}if(1===l){if(f.isToken()){const t=zr(e);return t.select(),void f.replace(t)}const t=f.getFormat(),n=f.getStyle();if(u!==a||t===i&&n===s){if(Jr(f)){const t=zr(e);return t.setFormat(i),t.setStyle(s),t.select(),void f.replace(t)}}else {if(""!==f.getTextContent()){const t=zr(e);if(t.setFormat(i),t.setStyle(s),t.select(),0===u)f.insertBefore(t,!1);else {const[e]=f.splitText(u);e.insertAfter(t,!1);}return void(t.isComposing()&&"text"===this.anchor.type&&(this.anchor.offset-=e.length))}f.setFormat(i),f.setStyle(s);}const r=a-u;f=f.spliceText(u,r,e,!0),""===f.getTextContent()?f.remove():"text"===this.anchor.type&&(f.isComposing()?this.anchor.offset-=e.length:(this.format=t,this.style=n));}else {const t=new Set([...f.getParentKeys(),...g.getParentKeys()]),n=qi(f)?f:f.getParentOrThrow();let r=qi(g)?g:g.getParentOrThrow(),i=g;if(!n.is(r)&&r.isInline())do{i=r,r=r.getParentOrThrow();}while(r.isInline());if("text"===c.type&&(0!==a||""===g.getTextContent())||"element"===c.type&&g.getIndexWithinParent()<a)if(Br(g)&&!g.isToken()&&a!==g.getTextContentSize()){if(g.isSegmented()){const e=zr(g.getTextContent());g.replace(e),g=e;}Yi(c.getNode())||"text"!==c.type||(g=g.spliceText(0,a,"")),t.add(g.__key);}else {const e=g.getParentOrThrow();e.canBeEmpty()||1!==e.getChildrenSize()?g.remove():e.remove();}else t.add(g.__key);const s=r.getChildren(),h=new Set(o),_=n.is(r),p=n.isInline()&&null===f.getNextSibling()?n:f;for(let e=s.length-1;e>=0;e--){const t=s[e];if(t.is(f)||qi(t)&&t.isParentOf(f))break;t.isAttached()&&(!h.has(t)||t.is(i)?_||p.insertAfter(t,!1):t.remove());}if(!_){let e=r,n=null;for(;null!==e;){const r=e.getChildren(),i=r.length;(0===i||r[i-1].is(n))&&(t.delete(e.__key),n=e),e=e.getParent();}}if(f.isToken())if(u===d)f.select();else {const t=zr(e);t.select(),f.replace(t);}else f=f.spliceText(u,d-u,e,!0),""===f.getTextContent()?f.remove():f.isComposing()&&"text"===this.anchor.type&&(this.anchor.offset-=e.length);for(let e=1;e<l;e++){const n=o[e],r=n.__key;t.has(r)||n.remove();}}}removeText(){this.insertText("");}formatText(e){if(this.isCollapsed())return this.toggleFormat(e),void ot(null);const t=this.getNodes(),n=[];for(const e of t)Br(e)&&n.push(e);const r=n.length;if(0===r)return this.toggleFormat(e),void ot(null);const i=this.anchor,s=this.focus,o=this.isBackward(),l=o?s:i,c=o?i:s;let u=0,a=n[0],f="element"===l.type?0:l.offset;if("text"===l.type&&f===a.getTextContentSize()&&(u=1,a=n[1],f=0),null==a)return;const d=a.getFormatFlags(e,null),h=r-1;let g=n[h];const _="text"===c.type?c.offset:g.getTextContentSize();if(a.is(g)){if(f===_)return;if(0===f&&_===a.getTextContentSize())a.setFormat(d);else {const e=a.splitText(f,_),t=0===f?e[0]:e[1];t.setFormat(d),"text"===l.type&&l.set(t.__key,0,"text"),"text"===c.type&&c.set(t.__key,_-f,"text");}return void(this.format=d)}0!==f&&([,a]=a.splitText(f),f=0),a.setFormat(d);const p=g.getFormatFlags(e,d);_>0&&(_!==g.getTextContentSize()&&([g]=g.splitText(_)),g.setFormat(p));for(let t=u+1;t<h;t++){const r=n[t];if(!r.isToken()){const t=r.getFormatFlags(e,p);r.setFormat(t);}}"text"===l.type&&l.set(a.__key,f,"text"),"text"===c.type&&c.set(g.__key,_,"text"),this.format=d|p;}insertNodes(e){if(0===e.length)return;if("root"===this.anchor.key){this.insertParagraph();const t=fi();return Xr(t)||H$1(134),t.insertNodes(e)}const t=cn((this.isBackward()?this.focus:this.anchor).getNode(),ln),n=e[e.length-1];if("__language"in t&&qi(t)){if("__language"in e[0])this.insertText(e[0].getTextContent());else {const r=vi(this);t.splice(r,0,e),n.selectEnd();}return}if(!e.some((e=>(qi(e)||Hi(e))&&!e.isInline()))){qi(t)||H$1(135);const r=vi(this);return t.splice(r,0,e),void n.selectEnd()}const r=function(e){const t=rs();let n=null;for(let r=0;r<e.length;r++){const i=e[r],s=vr(i);if(s||Hi(i)&&i.isInline()||qi(i)&&i.isInline()||Br(i)||i.isParentRequired()){if(null===n&&(n=i.createParentElementNode(),t.append(n),s))continue;null!==n&&n.append(i);}else t.append(i),n=null;}return t}(e),i=r.getLastDescendant(),s=r.getChildren(),o=e=>"__value"in e&&"__checked"in e,l=!qi(t)||!t.isEmpty()?this.insertParagraph():null,c=s[s.length-1];let u=s[0];var a;qi(a=u)&&ln(a)&&!a.isEmpty()&&qi(t)&&(!t.isEmpty()||o(t))&&(qi(t)||H$1(135),t.append(...u.getChildren()),u=s[1]),u&&function(e,t,n){const r=n||t.getParentOrThrow().getLastChild();let i=t;const s=[t];for(;i!==r;)i.getNextSibling()||H$1(140),i=i.getNextSibling(),s.push(i);let o=e;for(const e of s)o=o.insertAfter(e);}(t,u);const f=cn(i,ln);l&&qi(f)&&(o(l)||ln(c))&&(f.append(...l.getChildren()),l.remove()),qi(t)&&t.isEmpty()&&t.remove(),i.selectEnd();const d=qi(t)?t.getLastChild():null;vr(d)&&f!==t&&d.remove();}insertParagraph(){if("root"===this.anchor.key){const e=rs();return ht().splice(this.anchor.offset,0,[e]),e.select(),e}const e=vi(this),t=cn(this.anchor.getNode(),ln);qi(t)||H$1(136);const n=t.getChildAtIndex(e),r=n?[n,...n.getNextSiblings()]:[],i=t.insertNewAfter(this,!1);return i?(i.append(...r),i.selectStart(),i):null}insertLineBreak(e){const t=xr();if(this.insertNodes([t]),e){const e=t.getParentOrThrow(),n=t.getIndexWithinParent();e.select(n,n);}}extract(){const e=this.getNodes(),t=e.length,n=t-1,r=this.anchor,i=this.focus;let s=e[0],o=e[n];const[l,c]=ei(this);if(0===t)return [];if(1===t){if(Br(s)&&!this.isCollapsed()){const e=l>c?c:l,t=l>c?l:c,n=s.splitText(e,t),r=0===e?n[0]:n[1];return null!=r?[r]:[]}return [s]}const u=r.isBefore(i);if(Br(s)){const t=u?l:c;t===s.getTextContentSize()?e.shift():0!==t&&([,s]=s.splitText(t),e[0]=s);}if(Br(o)){const t=o.getTextContent().length,r=u?c:l;0===r?e.pop():r!==t&&([o]=o.splitText(r),e[n]=o);}return e}modify(e,t,n){const r=this.focus,i=this.anchor,s="move"===e,o=Wt(r,t);if(Hi(o)&&!o.isIsolated()){if(s&&o.isKeyboardSelectable()){const e=ui();return e.add(o.__key),void _t(e)}const e=t?o.getPreviousSibling():o.getNextSibling();if(Br(e)){const n=e.__key,o=t?e.getTextContent().length:0;return r.set(n,o,"text"),void(s&&i.set(n,o,"text"))}{const n=o.getParentOrThrow();let l,c;return qi(e)?(c=e.__key,l=t?e.getChildrenSize():0):(l=o.getIndexWithinParent(),c=n.__key,t||l++),r.set(c,l,"element"),void(s&&i.set(c,l,"element"))}}const l=Oi(),c=nn(l._window);if(!c)return;const u=l._blockCursorElement,a=l._rootElement;if(null===a||null===u||!qi(o)||o.isInline()||o.canBeEmpty()||en(u,l,a),function(e,t,n,r){e.modify(t,n,r);}(c,e,t?"backward":"forward",n),c.rangeCount>0){const e=c.getRangeAt(0),n=this.anchor.getNode(),r=Yi(n)?n:qt(n);if(this.applyDOMRange(e),this.dirty=!0,!s){const n=this.getNodes(),i=[];let s=!1;for(let e=0;e<n.length;e++){const t=n[e];$t(t,r)?i.push(t):s=!0;}if(s&&i.length>0)if(t){const e=i[0];qi(e)?e.selectStart():e.getParentOrThrow().selectStart();}else {const e=i[i.length-1];qi(e)?e.selectEnd():e.getParentOrThrow().selectEnd();}c.anchorNode===e.startContainer&&c.anchorOffset===e.startOffset||function(e){const t=e.focus,n=e.anchor,r=n.key,i=n.offset,s=n.type;qr(n,t.key,t.offset,t.type),qr(t,r,i,s),e._cachedNodes=null;}(this);}}}forwardDeletion(e,t,n){if(!n&&("element"===e.type&&qi(t)&&e.offset===t.getChildrenSize()||"text"===e.type&&e.offset===t.getTextContentSize())){const e=t.getParent(),n=t.getNextSibling()||(null===e?null:e.getNextSibling());if(qi(n)&&n.isShadowRoot())return !0}return !1}deleteCharacter(e){const n=this.isCollapsed();if(this.isCollapsed()){const n=this.anchor;let r=n.getNode();if(this.forwardDeletion(n,r,e))return;const i=this.focus,s=Wt(i,e);if(Hi(s)&&!s.isIsolated()){if(s.isKeyboardSelectable()&&qi(r)&&0===r.getChildrenSize()){r.remove();const e=ui();e.add(s.__key),_t(e);}else {s.remove();Oi().dispatchCommand(t$2,void 0);}return}if(!e&&qi(s)&&qi(r)&&r.isEmpty())return r.remove(),void s.selectStart();if(this.modify("extend",e,"character"),this.isCollapsed()){if(e&&0===n.offset){if(("element"===n.type?n.getNode():n.getNode().getParentOrThrow()).collapseAtStart(this))return}}else {const t="text"===i.type?i.getNode():null;if(r="text"===n.type?n.getNode():null,null!==t&&t.isSegmented()){const n=i.offset,s=t.getTextContentSize();if(t.is(r)||e&&n!==s||!e&&0!==n)return void ti(t,e,n)}else if(null!==r&&r.isSegmented()){const i=n.offset,s=r.getTextContentSize();if(r.is(t)||e&&0!==i||!e&&i!==s)return void ti(r,e,i)}!function(e,t){const n=e.anchor,r=e.focus,i=n.getNode(),s=r.getNode();if(i===s&&"text"===n.type&&"text"===r.type){const e=n.offset,s=r.offset,o=e<s,l=o?e:s,c=o?s:e,u=c-1;if(l!==u){mt(i.getTextContent().slice(l,c))||(t?r.offset=u:n.offset=u);}}}(this,e);}}if(this.removeText(),e&&!n&&this.isCollapsed()&&"element"===this.anchor.type&&0===this.anchor.offset){const e=this.anchor.getNode();e.isEmpty()&&Yi(e.getParent())&&0===e.getIndexWithinParent()&&e.collapseAtStart(this);}}deleteLine(e){if(this.isCollapsed()){"text"===this.anchor.type&&this.modify("extend",e,"lineboundary");0===(e?this.focus:this.anchor).offset&&this.modify("extend",e,"character");}this.removeText();}deleteWord(e){if(this.isCollapsed()){const t=this.anchor,n=t.getNode();if(this.forwardDeletion(t,n,e))return;this.modify("extend",e,"word");}this.removeText();}isBackward(){return this.focus.isBefore(this.anchor)}getStartEndPoints(){return [this.anchor,this.focus]}}function Zr(e){return e instanceof Qr}function Gr(e){const t=e.offset;if("text"===e.type)return t;const n=e.getNode();return t===n.getChildrenSize()?n.getTextContent().length:0}function ei(e){const t=e.getStartEndPoints();if(null===t)return [0,0];const[n,r]=t;return "element"===n.type&&"element"===r.type&&n.key===r.key&&n.offset===r.offset?[0,0]:[Gr(n),Gr(r)]}function ti(e,t,n){const r=e,i=r.getTextContent().split(/(?=\s)/g),s=i.length;let o=0,l=0;for(let e=0;e<s;e++){const r=e===s-1;if(l=o,o+=i[e].length,t&&o===n||o>n||r){i.splice(e,1),r&&(l=void 0);break}}const c=i.join("").trim();""===c?r.remove():(r.setTextContent(c),r.select(l,l));}function ni(e,t,n,r){let i,s=t;if(e.nodeType===ie){let o=!1;const l=e.childNodes,c=l.length;s===c&&(o=!0,s=c-1);let u=l[s],a=!1;if(u===r._blockCursorElement?(u=l[s+1],a=!0):null!==r._blockCursorElement&&s--,i=pt(u),Br(i))s=yt(i,o);else {let r=pt(e);if(null===r)return null;if(qi(r)){let e=r.getChildAtIndex(s);if(qi(e)&&function(e,t,n){const r=e.getParent();return null===n||null===r||!r.canBeEmpty()||r!==n.getNode()}(e,0,n)){const t=o?e.getLastDescendant():e.getFirstDescendant();null===t?(r=e,s=0):(e=t,r=qi(e)?e:e.getParentOrThrow());}Br(e)?(i=e,r=null,s=yt(e,o)):e!==r&&o&&!a&&s++;}else {const n=r.getIndexWithinParent();s=0===t&&Hi(r)&&pt(e)===r?n:n+1,r=r.getParentOrThrow();}if(qi(r))return Vr(r.__key,s,"element")}}else i=pt(e);return Br(i)?Vr(i.__key,s,"text"):null}function ri(e,t,n){const r=e.offset,i=e.getNode();if(0===r){const r=i.getPreviousSibling(),s=i.getParent();if(t){if((n||!t)&&null===r&&qi(s)&&s.isInline()){const t=s.getPreviousSibling();Br(t)&&(e.key=t.__key,e.offset=t.getTextContent().length);}}else qi(r)&&!n&&r.isInline()?(e.key=r.__key,e.offset=r.getChildrenSize(),e.type="element"):Br(r)&&(e.key=r.__key,e.offset=r.getTextContent().length);}else if(r===i.getTextContent().length){const r=i.getNextSibling(),s=i.getParent();if(t&&qi(r)&&r.isInline())e.key=r.__key,e.offset=0,e.type="element";else if((n||t)&&null===r&&qi(s)&&s.isInline()&&!s.canInsertTextAfter()){const t=s.getNextSibling();Br(t)&&(e.key=t.__key,e.offset=0);}}}function ii(e,t,n){if("text"===e.type&&"text"===t.type){const r=e.isBefore(t),i=e.is(t);ri(e,r,i),ri(t,!r,i),i&&(t.key=e.key,t.offset=e.offset,t.type=e.type);const s=Oi();if(s.isComposing()&&s._compositionKey!==e.key&&Xr(n)){const r=n.anchor,i=n.focus;qr(e,r.key,r.offset,r.type),qr(t,i.key,i.offset,i.type);}}}function si(e,t,n,r,i,s){if(null===e||null===n||!Xe(i,e,n))return null;const o=ni(e,t,Xr(s)?s.anchor:null,i);if(null===o)return null;const l=ni(n,r,Xr(s)?s.focus:null,i);if(null===l)return null;if("element"===o.type&&"element"===l.type){const t=pt(e),r=pt(n);if(Hi(t)&&Hi(r))return null}return ii(o,l,s),[o,l]}function oi(e){return qi(e)&&!e.isInline()}function li(e,t,n,r,i,s){const o=Ii(),l=new Yr(Vr(e,t,i),Vr(n,r,s),0,"");return l.dirty=!0,o._selection=l,l}function ci(){const e=Vr("root",0,"element"),t=Vr("root",0,"element");return new Yr(e,t,0,"")}function ui(){return new Qr(new Set)}function ai(e,t,n,r){const i=n._window;if(null===i)return null;const s=r||i.event,o=s?s.type:void 0,l="selectionchange"===o,c=!Ae&&(l||"beforeinput"===o||"compositionstart"===o||"compositionend"===o||"click"===o&&s&&3===s.detail||"drop"===o||void 0===o);let u,a,f,d;if(Xr(e)&&!c)return e.clone();if(null===t)return null;if(u=t.anchorNode,a=t.focusNode,f=t.anchorOffset,d=t.focusOffset,l&&Xr(e)&&!Xe(n,u,a))return e.clone();const h=si(u,f,a,d,n,e);if(null===h)return null;const[g,_]=h;return new Yr(g,_,Xr(e)?e.format:0,Xr(e)?e.style:"")}function fi(){return Ii()._selection}function di(){return Oi()._editorState._selection}function hi(e,t,n,r=1){const i=e.anchor,s=e.focus,o=i.getNode(),l=s.getNode();if(!t.is(o)&&!t.is(l))return;const c=t.__key;if(e.isCollapsed()){const t=i.offset;if(n<=t&&r>0||n<t&&r<0){const n=Math.max(0,t+r);i.set(c,n,"element"),s.set(c,n,"element"),gi(e);}}else {const o=e.isBackward(),l=o?s:i,u=l.getNode(),a=o?i:s,f=a.getNode();if(t.is(u)){const e=l.offset;(n<=e&&r>0||n<e&&r<0)&&l.set(c,Math.max(0,e+r),"element");}if(t.is(f)){const e=a.offset;(n<=e&&r>0||n<e&&r<0)&&a.set(c,Math.max(0,e+r),"element");}}gi(e);}function gi(e){const t=e.anchor,n=t.offset,r=e.focus,i=r.offset,s=t.getNode(),o=r.getNode();if(e.isCollapsed()){if(!qi(s))return;const e=s.getChildrenSize(),i=n>=e,o=i?s.getChildAtIndex(e-1):s.getChildAtIndex(n);if(Br(o)){let e=0;i&&(e=o.getTextContentSize()),t.set(o.__key,e,"text"),r.set(o.__key,e,"text");}}else {if(qi(s)){const e=s.getChildrenSize(),r=n>=e,i=r?s.getChildAtIndex(e-1):s.getChildAtIndex(n);if(Br(i)){let e=0;r&&(e=i.getTextContentSize()),t.set(i.__key,e,"text");}}if(qi(o)){const e=o.getChildrenSize(),t=i>=e,n=t?o.getChildAtIndex(e-1):o.getChildAtIndex(i);if(Br(n)){let e=0;t&&(e=n.getTextContentSize()),r.set(n.__key,e,"text");}}}}function _i(e,t,n,r,i){let s=null,o=0,l=null;null!==r?(s=r.__key,Br(r)?(o=r.getTextContentSize(),l="text"):qi(r)&&(o=r.getChildrenSize(),l="element")):null!==i&&(s=i.__key,Br(i)?l="text":qi(i)&&(l="element")),null!==s&&null!==l?e.set(s,o,l):(o=t.getIndexWithinParent(),-1===o&&(o=n.getChildrenSize()),e.set(n.__key,o,"element"));}function pi(e,t,n,r,i){"text"===e.type?(e.key=n,t||(e.offset+=i)):e.offset>r.getIndexWithinParent()&&(e.offset-=1);}function yi(e,t,n,r,i,s,o){const l=r.anchorNode,c=r.focusNode,u=r.anchorOffset,a=r.focusOffset,f=document.activeElement;if(i.has("collaboration")&&f!==s||null!==f&&Qe(f))return;if(!Xr(t))return void(null!==e&&Xe(n,l,c)&&r.removeAllRanges());const d=t.anchor,h=t.focus,g=d.key,_=h.key,p=Kt(n,g),y=Kt(n,_),m=d.offset,x=h.offset,v=t.format,T=t.style,S=t.isCollapsed();let k=p,C=y,b=!1;if("text"===d.type){k=et(p);const e=d.getNode();b=e.getFormat()!==v||e.getStyle()!==T;}else Xr(e)&&"text"===e.anchor.type&&(b=!0);var N,w,E,P,D;if(("text"===h.type&&(C=et(y)),null!==k&&null!==C)&&(S&&(null===e||b||Xr(e)&&(e.format!==v||e.style!==T))&&(N=v,w=T,E=m,P=g,D=performance.now(),rr=[N,w,E,P,D]),u!==m||a!==x||l!==k||c!==C||"Range"===r.type&&S||(null!==f&&s.contains(f)||s.focus({preventScroll:!0}),"element"===d.type))){try{r.setBaseAndExtent(k,m,C,x);}catch(e){}if(!i.has("skip-scroll-into-view")&&t.isCollapsed()&&null!==s&&s===document.activeElement){const e=t instanceof Yr&&"element"===t.anchor.type?k.childNodes[m]||null:r.rangeCount>0?r.getRangeAt(0):null;if(null!==e){let t;if(e instanceof Text){const n=document.createRange();n.selectNode(e),t=n.getBoundingClientRect();}else t=e.getBoundingClientRect();!function(e,t,n){const r=n.ownerDocument,i=r.defaultView;if(null===i)return;let{top:s,bottom:o}=t,l=0,c=0,u=n;for(;null!==u;){const t=u===r.body;if(t)l=0,c=Ht(e).innerHeight;else {const e=u.getBoundingClientRect();l=e.top,c=e.bottom;}let n=0;if(s<l?n=-(l-s):o>c&&(n=o-c),0!==n)if(t)i.scrollBy(0,n);else {const e=u.scrollTop;u.scrollTop+=n;const t=u.scrollTop-e;s-=t,o-=t;}if(t)break;u=Jt(u);}}(n,t,s);}}Gn=!0;}}function mi(e){let t=fi()||di();null===t&&(t=ht().selectEnd()),t.insertNodes(e);}function xi(){const e=fi();return null===e?"":e.getTextContent()}function vi(e){e.isCollapsed()||e.removeText();const t=e.anchor;let n=t.getNode(),r=t.offset;for(;!ln(n);)[n,r]=Ti(n,r);return r}function Ti(e,t){const n=e.getParent();if(!n){const e=rs();return ht().append(e),e.select(),[ht(),0]}if(Br(e)){const r=e.splitText(t);if(0===r.length)return [n,e.getIndexWithinParent()];const i=0===t?0:1;return [n,r[0].getIndexWithinParent()+i]}if(!qi(e)||0===t)return [n,e.getIndexWithinParent()];const r=e.getChildAtIndex(t);if(r){const n=new Yr(Vr(e.__key,t,"element"),Vr(e.__key,t,"element"),0,""),i=e.insertNewAfter(n);i&&i.append(r,...r.getNextSiblings());}return [n,e.getIndexWithinParent()+1]}let Si=null,ki=null,Ci=!1,bi=!1,Ni=0;const wi={characterData:!0,childList:!0,subtree:!0};function Ei(){return Ci||null!==Si&&Si._readOnly}function Pi(){Ci&&H$1(13);}function Di(){Ni>99&&H$1(14);}function Ii(){return null===Si&&H$1(15),Si}function Oi(){return null===ki&&H$1(16),ki}function Ai(){return ki}function Li(e,t,n){const r=t.__type,i=function(e,t){const n=e._nodes.get(t);return void 0===n&&H$1(30,t),n}(e,r);let s=n.get(r);void 0===s&&(s=Array.from(i.transforms),n.set(r,s));const o=s.length;for(let e=0;e<o&&(s[e](t),t.isAttached());e++);}function Fi(e,t){return void 0!==e&&e.__key!==t&&e.isAttached()}function Mi(e){return Wi(e,Oi()._nodes)}function Wi(e,t){const n=e.type,r=t.get(n);void 0===r&&H$1(17,n);const i=r.klass;e.type!==i.getType()&&H$1(18,i.name);const s=i.importJSON(e),o=e.children;if(qi(s)&&Array.isArray(o))for(let e=0;e<o.length;e++){const n=Wi(o[e],t);s.append(n);}return s}function zi(e,t){const n=Si,r=Ci,i=ki;Si=e,Ci=!0,ki=null;try{return t()}finally{Si=n,Ci=r,ki=i;}}function Bi(e,n){const r=e._pendingEditorState,i=e._rootElement,s=e._headless||null===i;if(null===r)return;const o=e._editorState,l=o._selection,c=r._selection,u=e._dirtyType!==oe,a=Si,f=Ci,d=ki,h=e._updating,g=e._observer;let _=null;if(e._pendingEditorState=null,e._editorState=r,!s&&u&&null!==g){ki=e,Si=r,Ci=!1,e._updating=!0;try{const t=e._dirtyType,n=e._dirtyElements,i=e._dirtyLeaves;g.disconnect(),_=Un(o,r,e,t,n,i);}catch(t){if(t instanceof Error&&e._onError(t),bi)throw t;return as(e,null,i,r),Ke(e),e._dirtyType=ce,bi=!0,Bi(e,o),void(bi=!1)}finally{g.observe(i,wi),e._updating=h,Si=a,Ci=f,ki=d;}}r._readOnly||(r._readOnly=!0);const p=e._dirtyLeaves,y=e._dirtyElements,m=e._normalizedNodes,x=e._updateTags,v=e._deferred;u&&(e._dirtyType=oe,e._cloneNotNeeded.clear(),e._dirtyLeaves=new Set,e._dirtyElements=new Map,e._normalizedNodes=new Set,e._updateTags=new Set),function(e,t){const n=e._decorators;let r=e._pendingDecorators||n;const i=t._nodeMap;let s;for(s in r)i.has(s)||(r===n&&(r=ft(e)),delete r[s]);}(e,r);const T=s?null:nn(e._window);if(e._editable&&null!==T&&(u||null===c||c.dirty)){ki=e,Si=r;try{if(null!==g&&g.disconnect(),u||null===c||c.dirty){const t=e._blockCursorElement;null!==t&&en(t,e,i),yi(l,c,e,T,x,i);}tn(e,i,c),null!==g&&g.observe(i,wi);}finally{ki=d,Si=a;}}null!==_&&function(e,t,n,r,i){const s=Array.from(e._listeners.mutation),o=s.length;for(let e=0;e<o;e++){const[o,l]=s[e],c=t.get(l);void 0!==c&&o(c,{dirtyLeaves:r,prevEditorState:i,updateTags:n});}}(e,_,x,p,o),Xr(c)||null===c||null!==l&&l.is(c)||e.dispatchCommand(t$2,void 0);const S=e._pendingDecorators;null!==S&&(e._decorators=S,e._pendingDecorators=null,Ri("decorator",e,!0,S)),function(e,t,n){const r=dt(t),i=dt(n);r!==i&&Ri("textcontent",e,!0,i);}(e,n||o,r),Ri("update",e,!0,{dirtyElements:y,dirtyLeaves:p,editorState:r,normalizedNodes:m,prevEditorState:n||o,tags:x}),function(e,t){if(e._deferred=[],0!==t.length){const n=e._updating;e._updating=!0;try{for(let e=0;e<t.length;e++)t[e]();}finally{e._updating=n;}}}(e,v),function(e){const t=e._updates;if(0!==t.length){const n=t.shift();if(n){const[t,r]=n;Ui(e,t,r);}}}(e);}function Ri(e,t,n,...r){const i=t._updating;t._updating=n;try{const n=Array.from(t._listeners[e]);for(let e=0;e<n.length;e++)n[e].apply(null,r);}finally{t._updating=i;}}function Ki(e,t,n){if(!1===e._updating||ki!==e){let r=!1;return e.update((()=>{r=Ki(e,t,n);})),r}const r=xt(e);for(let i=4;i>=0;i--)for(let s=0;s<r.length;s++){const o=r[s]._commands.get(t);if(void 0!==o){const t=o[i];if(void 0!==t){const r=Array.from(t),i=r.length;for(let t=0;t<i;t++)if(!0===r[t](n,e))return !0}}}return !1}function Ji(e,t){const n=e._updates;let r=t||!1;for(;0!==n.length;){const t=n.shift();if(t){const[n,i]=t;let s,o;void 0!==i&&(s=i.onUpdate,o=i.tag,i.skipTransforms&&(r=!0),s&&e._deferred.push(s),o&&e._updateTags.add(o)),n();}}return r}function Ui(e,t,n){const r=e._updateTags;let i,s,o=!1,l=!1;void 0!==n&&(i=n.onUpdate,s=n.tag,null!=s&&r.add(s),o=n.skipTransforms||!1,l=n.discrete||!1),i&&e._deferred.push(i);const c=e._editorState;let u=e._pendingEditorState,a=!1;(null===u||u._readOnly)&&(u=e._pendingEditorState=new es(new Map((u||c)._nodeMap)),a=!0),u._flushSync=l;const f=Si,d=Ci,h=ki,g=e._updating;Si=u,Ci=!1,e._updating=!0,ki=e;try{a&&(e._headless?null!==c._selection&&(u._selection=c._selection.clone()):u._selection=function(e){const t=e.getEditorState()._selection,n=nn(e._window);return Xr(t)||null==t?ai(t,n,e,null):t.clone()}(e));const n=e._compositionKey;t(),o=Ji(e,o),function(e,t){const n=t.getEditorState()._selection,r=e._selection;if(Xr(r)){const e=r.anchor,t=r.focus;let i;if("text"===e.type&&(i=e.getNode(),i.selectionTransform(n,r)),"text"===t.type){const e=t.getNode();i!==e&&e.selectionTransform(n,r);}}}(u,e),e._dirtyType!==oe&&(o?function(e,t){const n=t._dirtyLeaves,r=e._nodeMap;for(const e of n){const t=r.get(e);Br(t)&&t.isAttached()&&t.isSimpleText()&&!t.isUnmergeable()&&Ve(t);}}(u,e):function(e,t){const n=t._dirtyLeaves,r=t._dirtyElements,i=e._nodeMap,s=lt(),o=new Map;let l=n,c=l.size,u=r,a=u.size;for(;c>0||a>0;){if(c>0){t._dirtyLeaves=new Set;for(const e of l){const r=i.get(e);Br(r)&&r.isAttached()&&r.isSimpleText()&&!r.isUnmergeable()&&Ve(r),void 0!==r&&Fi(r,s)&&Li(t,r,o),n.add(e);}if(l=t._dirtyLeaves,c=l.size,c>0){Ni++;continue}}t._dirtyLeaves=new Set,t._dirtyElements=new Map;for(const e of u){const n=e[0],l=e[1];if("root"!==n&&!l)continue;const c=i.get(n);void 0!==c&&Fi(c,s)&&Li(t,c,o),r.set(n,l);}l=t._dirtyLeaves,c=l.size,u=t._dirtyElements,a=u.size,Ni++;}t._dirtyLeaves=n,t._dirtyElements=r;}(u,e),Ji(e),function(e,t,n,r){const i=e._nodeMap,s=t._nodeMap,o=[];for(const[e]of r){const t=s.get(e);void 0!==t&&(t.isAttached()||(qi(t)&&an(t,e,i,s,o,r),i.has(e)||r.delete(e),o.push(e)));}for(const e of o)s.delete(e);for(const e of n){const t=s.get(e);void 0===t||t.isAttached()||(i.has(e)||n.delete(e),s.delete(e));}}(c,u,e._dirtyLeaves,e._dirtyElements));n!==e._compositionKey&&(u._flushSync=!0);const r=u._selection;if(Xr(r)){const e=u._nodeMap,t=r.anchor.key,n=r.focus.key;void 0!==e.get(t)&&void 0!==e.get(n)||H$1(19);}else Zr(r)&&0===r._nodes.size&&(u._selection=null);}catch(t){return t instanceof Error&&e._onError(t),e._pendingEditorState=c,e._dirtyType=ce,e._cloneNotNeeded.clear(),e._dirtyLeaves=new Set,e._dirtyElements.clear(),void Bi(e)}finally{Si=f,Ci=d,ki=h,e._updating=g,Ni=0;}const _=e._dirtyType!==oe||function(e,t){const n=t.getEditorState()._selection,r=e._selection;if(null!==r){if(r.dirty||!r.is(n))return !0}else if(null!==n)return !0;return !1}(u,e);_?u._flushSync?(u._flushSync=!1,Bi(e)):a&&qe((()=>{Bi(e);})):(u._flushSync=!1,a&&(r.clear(),e._deferred=[],e._pendingEditorState=null));}function Vi(e,t,n){e._updating?e._updates.push([t,n]):Ui(e,t,n);}class $i extends pr{constructor(e){super(e);}decorate(e,t){H$1(47);}isIsolated(){return !1}isInline(){return !0}isKeyboardSelectable(){return !0}}function Hi(e){return e instanceof $i}class ji extends pr{constructor(e){super(e),this.__first=null,this.__last=null,this.__size=0,this.__format=0,this.__indent=0,this.__dir=null;}getFormat(){return this.getLatest().__format}getFormatType(){const e=this.getFormat();return Ee[e]||""}getIndent(){return this.getLatest().__indent}getChildren(){const e=[];let t=this.getFirstChild();for(;null!==t;)e.push(t),t=t.getNextSibling();return e}getChildrenKeys(){const e=[];let t=this.getFirstChild();for(;null!==t;)e.push(t.__key),t=t.getNextSibling();return e}getChildrenSize(){return this.getLatest().__size}isEmpty(){return 0===this.getChildrenSize()}isDirty(){const e=Oi()._dirtyElements;return null!==e&&e.has(this.__key)}isLastChild(){const e=this.getLatest(),t=this.getParentOrThrow().getLastChild();return null!==t&&t.is(e)}getAllTextNodes(){const e=[];let t=this.getFirstChild();for(;null!==t;){if(Br(t)&&e.push(t),qi(t)){const n=t.getAllTextNodes();e.push(...n);}t=t.getNextSibling();}return e}getFirstDescendant(){let e=this.getFirstChild();for(;qi(e);){const t=e.getFirstChild();if(null===t)break;e=t;}return e}getLastDescendant(){let e=this.getLastChild();for(;qi(e);){const t=e.getLastChild();if(null===t)break;e=t;}return e}getDescendantByIndex(e){const t=this.getChildren(),n=t.length;if(e>=n){const e=t[n-1];return qi(e)&&e.getLastDescendant()||e||null}const r=t[e];return qi(r)&&r.getFirstDescendant()||r||null}getFirstChild(){const e=this.getLatest().__first;return null===e?null:ct(e)}getFirstChildOrThrow(){const e=this.getFirstChild();return null===e&&H$1(45,this.__key),e}getLastChild(){const e=this.getLatest().__last;return null===e?null:ct(e)}getLastChildOrThrow(){const e=this.getLastChild();return null===e&&H$1(96,this.__key),e}getChildAtIndex(e){const t=this.getChildrenSize();let n,r;if(e<t/2){for(n=this.getFirstChild(),r=0;null!==n&&r<=e;){if(r===e)return n;n=n.getNextSibling(),r++;}return null}for(n=this.getLastChild(),r=t-1;null!==n&&r>=e;){if(r===e)return n;n=n.getPreviousSibling(),r--;}return null}getTextContent(){let e="";const t=this.getChildren(),n=t.length;for(let r=0;r<n;r++){const i=t[r];e+=i.getTextContent(),qi(i)&&r!==n-1&&!i.isInline()&&(e+=xe);}return e}getTextContentSize(){let e=0;const t=this.getChildren(),n=t.length;for(let r=0;r<n;r++){const i=t[r];e+=i.getTextContentSize(),qi(i)&&r!==n-1&&!i.isInline()&&(e+=xe.length);}return e}getDirection(){return this.getLatest().__dir}hasFormat(e){if(""!==e){const t=we[e];return 0!=(this.getFormat()&t)}return !1}select(e,t){Pi();const n=fi();let r=e,i=t;const s=this.getChildrenSize();if(!this.canBeEmpty())if(0===e&&0===t){const e=this.getFirstChild();if(Br(e)||qi(e))return e.select(0,0)}else if(!(void 0!==e&&e!==s||void 0!==t&&t!==s)){const e=this.getLastChild();if(Br(e)||qi(e))return e.select()}void 0===r&&(r=s),void 0===i&&(i=s);const o=this.__key;return Xr(n)?(n.anchor.set(o,r,"element"),n.focus.set(o,i,"element"),n.dirty=!0,n):li(o,r,o,i,"element","element")}selectStart(){const e=this.getFirstDescendant();return e?e.selectStart():this.select()}selectEnd(){const e=this.getLastDescendant();return e?e.selectEnd():this.select()}clear(){const e=this.getWritable();return this.getChildren().forEach((e=>e.remove())),e}append(...e){return this.splice(this.getChildrenSize(),0,e)}setDirection(e){const t=this.getWritable();return t.__dir=e,t}setFormat(e){return this.getWritable().__format=""!==e?we[e]:0,this}setIndent(e){return this.getWritable().__indent=e,this}splice(e,t,n){const r=n.length,i=this.getChildrenSize(),s=this.getWritable(),o=s.__key,l=[],c=[],u=this.getChildAtIndex(e+t);let a=null,f=i-t+r;if(0!==e)if(e===i)a=this.getLastChild();else {const t=this.getChildAtIndex(e);null!==t&&(a=t.getPreviousSibling());}if(t>0){let e=null===a?this.getFirstChild():a.getNextSibling();for(let n=0;n<t;n++){null===e&&H$1(100);const t=e.getNextSibling(),n=e.__key;it(e.getWritable()),c.push(n),e=t;}}let d=a;for(let e=0;e<r;e++){const t=n[e];null!==d&&t.is(d)&&(a=d=d.getPreviousSibling());const r=t.getWritable();r.__parent===o&&f--,it(r);const i=t.__key;if(null===d)s.__first=i,r.__prev=null;else {const e=d.getWritable();e.__next=i,r.__prev=e.__key;}t.__key===o&&H$1(76),r.__parent=o,l.push(i),d=t;}if(e+t===i){if(null!==d){d.getWritable().__next=null,s.__last=d.__key;}}else if(null!==u){const e=u.getWritable();if(null!==d){const t=d.getWritable();e.__prev=d.__key,t.__next=u.__key;}else e.__prev=null;}if(s.__size=f,c.length){const e=fi();if(Xr(e)){const t=new Set(c),n=new Set(l),{anchor:r,focus:i}=e;Qi(r,t,n)&&_i(r,r.getNode(),this,a,u),Qi(i,t,n)&&_i(i,i.getNode(),this,a,u),0!==f||this.canBeEmpty()||Qt(this)||this.remove();}}return s}exportJSON(){return {children:[],direction:this.getDirection(),format:this.getFormatType(),indent:this.getIndent(),type:"element",version:1}}insertNewAfter(e,t){return null}canIndent(){return !0}collapseAtStart(e){return !1}excludeFromCopy(e){return !1}canReplaceWith(e){return !0}canInsertAfter(e){return !0}canBeEmpty(){return !0}canInsertTextBefore(){return !0}canInsertTextAfter(){return !0}isInline(){return !1}isShadowRoot(){return !1}canMergeWith(e){return !1}extractWithChild(e,t,n){return !1}}function qi(e){return e instanceof ji}function Qi(e,t,n){let r=e.getNode();for(;r;){const e=r.__key;if(t.has(e)&&!n.has(e))return !0;r=r.getParent();}return !1}class Xi extends ji{static getType(){return "root"}static clone(){return new Xi}constructor(){super("root"),this.__cachedText=null;}getTopLevelElementOrThrow(){H$1(51);}getTextContent(){const e=this.__cachedText;return !Ei()&&Oi()._dirtyType!==oe||null===e?super.getTextContent():e}remove(){H$1(52);}replace(e){H$1(53);}insertBefore(e){H$1(54);}insertAfter(e){H$1(55);}updateDOM(e,t){return !1}append(...e){for(let t=0;t<e.length;t++){const n=e[t];qi(n)||Hi(n)||H$1(56);}return super.append(...e)}static importJSON(e){const t=ht();return t.setFormat(e.format),t.setIndent(e.indent),t.setDirection(e.direction),t}exportJSON(){return {children:[],direction:this.getDirection(),format:this.getFormatType(),indent:this.getIndent(),type:"root",version:1}}collapseAtStart(){return !0}}function Yi(e){return e instanceof Xi}function Zi(){return new es(new Map([["root",new Xi]]))}function Gi(e){const t=e.exportJSON(),n=e.constructor;if(t.type!==n.getType()&&H$1(130,n.name),qi(e)){const r=t.children;Array.isArray(r)||H$1(59,n.name);const i=e.getChildren();for(let e=0;e<i.length;e++){const t=Gi(i[e]);r.push(t);}}return t}class es{constructor(e,t){this._nodeMap=e,this._selection=t||null,this._flushSync=!1,this._readOnly=!1;}isEmpty(){return 1===this._nodeMap.size&&null===this._selection}read(e){return zi(this,e)}clone(e){const t=new es(this._nodeMap,void 0===e?this._selection:e);return t._readOnly=!0,t}toJSON(){return zi(this,(()=>({root:Gi(ht())})))}}class ts extends ji{static getType(){return "paragraph"}static clone(e){return new ts(e.__key)}createDOM(e){const t=document.createElement("p"),n=At(e.theme,"paragraph");if(void 0!==n){t.classList.add(...n);}return t}updateDOM(e,t,n){return !1}static importDOM(){return {p:e=>({conversion:ns,priority:0})}}exportDOM(e){const{element:t}=super.exportDOM(e);if(t&&on(t)){this.isEmpty()&&t.append(document.createElement("br"));const e=this.getFormatType();t.style.textAlign=e;const n=this.getDirection();n&&(t.dir=n);const r=this.getIndent();r>0&&(t.style.textIndent=20*r+"px");}return {element:t}}static importJSON(e){const t=rs();return t.setFormat(e.format),t.setIndent(e.indent),t.setDirection(e.direction),t}exportJSON(){return {...super.exportJSON(),type:"paragraph",version:1}}insertNewAfter(e,t){const n=rs(),r=this.getDirection();return n.setDirection(r),this.insertAfter(n,t),n}collapseAtStart(){const e=this.getChildren();if(0===e.length||Br(e[0])&&""===e[0].getTextContent().trim()){if(null!==this.getNextSibling())return this.selectNext(),this.remove(),!0;if(null!==this.getPreviousSibling())return this.selectPrevious(),this.remove(),!0}return !1}}function ns(e){const t=rs();if(e.style){t.setFormat(e.style.textAlign);const n=parseInt(e.style.textIndent,10)/20;n>0&&t.setIndent(n);}return {node:t}}function rs(){return Yt(new ts)}function is(e){return e instanceof ts}const ss=0,os=1,ls=2,cs=3,us=4;function as(e,t,n,r){const i=e._keyToDOMMap;i.clear(),e._editorState=Zi(),e._pendingEditorState=r,e._compositionKey=null,e._dirtyType=oe,e._cloneNotNeeded.clear(),e._dirtyLeaves=new Set,e._dirtyElements.clear(),e._normalizedNodes=new Set,e._updateTags=new Set,e._updates=[],e._blockCursorElement=null;const s=e._observer;null!==s&&(s.disconnect(),e._observer=null),null!==t&&(t.textContent=""),null!==n&&(n.textContent="",i.set("root",n));}function fs(e){const t=e||{},n=Ai(),r=t.theme||{},i=void 0===e?n:t.parentEditor||null,s=t.disableEvents||!1,o=Zi(),l=t.namespace||(null!==i?i._config.namespace:vt()),c=t.editorState,u=[Xi,Er,yr,Rr,ts,...t.nodes||[]],{onError:a,html:f}=t,d=void 0===t.editable||t.editable;let h;if(void 0===e&&null!==n)h=n._nodes;else {h=new Map;for(let e=0;e<u.length;e++){let t=u[e],n=null,r=null;if("function"!=typeof t){const e=t;t=e.replace,n=e.with,r=e.withKlass||null;}const i=t.getType(),s=t.transform(),o=new Set;null!==s&&o.add(s),h.set(i,{exportDOM:f&&f.export?f.export.get(t):void 0,klass:t,replace:n,replaceWithKlass:r,transforms:o});}}const g=new ds(o,i,h,{disableEvents:s,namespace:l,theme:r},a||console.error,function(e,t){const n=new Map,r=new Set,i=e=>{Object.keys(e).forEach((t=>{let r=n.get(t);void 0===r&&(r=[],n.set(t,r)),r.push(e[t]);}));};return e.forEach((e=>{const t=e.klass.importDOM;if(null==t||r.has(t))return;r.add(t);const n=t.call(e.klass);null!==n&&i(n);})),t&&i(t),n}(h,f?f.import:void 0),d);return void 0!==c&&(g._pendingEditorState=c,g._dirtyType=ce),g}class ds{constructor(e,t,n,r,i,s,o){this._parentEditor=t,this._rootElement=null,this._editorState=e,this._pendingEditorState=null,this._compositionKey=null,this._deferred=[],this._keyToDOMMap=new Map,this._updates=[],this._updating=!1,this._listeners={decorator:new Set,editable:new Set,mutation:new Map,root:new Set,textcontent:new Set,update:new Set},this._commands=new Map,this._config=r,this._nodes=n,this._decorators={},this._pendingDecorators=null,this._dirtyType=oe,this._cloneNotNeeded=new Set,this._dirtyLeaves=new Set,this._dirtyElements=new Map,this._normalizedNodes=new Set,this._updateTags=new Set,this._observer=null,this._key=vt(),this._onError=i,this._htmlConversions=s,this._editable=o,this._headless=null!==t&&t._headless,this._window=null,this._blockCursorElement=null;}isComposing(){return null!=this._compositionKey}registerUpdateListener(e){const t=this._listeners.update;return t.add(e),()=>{t.delete(e);}}registerEditableListener(e){const t=this._listeners.editable;return t.add(e),()=>{t.delete(e);}}registerDecoratorListener(e){const t=this._listeners.decorator;return t.add(e),()=>{t.delete(e);}}registerTextContentListener(e){const t=this._listeners.textcontent;return t.add(e),()=>{t.delete(e);}}registerRootListener(e){const t=this._listeners.root;return e(this._rootElement,null),t.add(e),()=>{e(null,this._rootElement),t.delete(e);}}registerCommand(e,t,n){void 0===n&&H$1(35);const r=this._commands;r.has(e)||r.set(e,[new Set,new Set,new Set,new Set,new Set]);const i=r.get(e);void 0===i&&H$1(36,String(e));const s=i[n];return s.add(t),()=>{s.delete(t),i.every((e=>0===e.size))&&r.delete(e);}}registerMutationListener(e,t){void 0===this._nodes.get(e.getType())&&H$1(37,e.name);const n=this._listeners.mutation;return n.set(t,e),()=>{n.delete(t);}}registerNodeTransformToKlass(e,t){const n=e.getType(),r=this._nodes.get(n);void 0===r&&H$1(37,e.name);return r.transforms.add(t),r}registerNodeTransform(e,t){const n=this.registerNodeTransformToKlass(e,t),r=[n],i=n.replaceWithKlass;if(null!=i){const e=this.registerNodeTransformToKlass(i,t);r.push(e);}var s,o;return s=this,o=e.getType(),Vi(s,(()=>{const e=Ii();if(e.isEmpty())return;if("root"===o)return void ht().markDirty();const t=e._nodeMap;for(const[,e]of t)e.markDirty();}),null===s._pendingEditorState?{tag:"history-merge"}:void 0),()=>{r.forEach((e=>e.transforms.delete(t)));}}hasNode(e){return this._nodes.has(e.getType())}hasNodes(e){return e.every(this.hasNode.bind(this))}dispatchCommand(e,t){return Bt(this,e,t)}getDecorators(){return this._decorators}getRootElement(){return this._rootElement}getKey(){return this._key}setRootElement(e){const t=this._rootElement;if(e!==t){const n=At(this._config.theme,"root"),r=this._pendingEditorState||this._editorState;if(this._rootElement=e,as(this,t,e,r),null!==t&&(this._config.disableEvents||gr(t),null!=n&&t.classList.remove(...n)),null!==e){const t=function(e){const t=e.ownerDocument;return t&&t.defaultView||null}(e),r=e.style;r.userSelect="text",r.whiteSpace="pre-wrap",r.wordBreak="break-word",e.setAttribute("data-lexical-editor","true"),this._window=t,this._dirtyType=ce,Ke(this),this._updateTags.add("history-merge"),Bi(this),this._config.disableEvents||function(e,t){const n=e.ownerDocument,r=Zn.get(n);void 0===r&&n.addEventListener("selectionchange",fr),Zn.set(n,r||1),e.__lexicalEditor=t;const i=ur(e);for(let n=0;n<jn.length;n++){const[r,s]=jn[n],o="function"==typeof s?e=>{hr(e)||(dr(e),(t.isEditable()||"click"===r)&&s(e,t));}:e=>{if(!hr(e)&&(dr(e),t.isEditable()))switch(r){case"cut":return Bt(t,W,e);case"copy":return Bt(t,M$3,e);case"paste":return Bt(t,c$4,e);case"dragstart":return Bt(t,A$3,e);case"dragover":return Bt(t,L$2,e);case"dragend":return Bt(t,F$1,e);case"focus":return Bt(t,U,e);case"blur":return Bt(t,V,e);case"drop":return Bt(t,I$1,e)}};e.addEventListener(r,o),i.push((()=>{e.removeEventListener(r,o);}));}}(e,this),null!=n&&e.classList.add(...n);}else this._editorState=r,this._pendingEditorState=null,this._window=null;Ri("root",this,!1,e,t);}}getElementByKey(e){return this._keyToDOMMap.get(e)||null}getEditorState(){return this._editorState}setEditorState(e,t){e.isEmpty()&&H$1(38),Re(this);const n=this._pendingEditorState,r=this._updateTags,i=void 0!==t?t.tag:null;null===n||n.isEmpty()||(null!=i&&r.add(i),Bi(this)),this._pendingEditorState=e,this._dirtyType=ce,this._dirtyElements.set("root",!1),this._compositionKey=null,null!=i&&r.add(i),Bi(this);}parseEditorState(e,t){return function(e,t,n){const r=Zi(),i=Si,s=Ci,o=ki,l=t._dirtyElements,c=t._dirtyLeaves,u=t._cloneNotNeeded,a=t._dirtyType;t._dirtyElements=new Map,t._dirtyLeaves=new Set,t._cloneNotNeeded=new Set,t._dirtyType=0,Si=r,Ci=!1,ki=t;try{const i=t._nodes;Wi(e.root,i),n&&n(),r._readOnly=!0;}catch(e){e instanceof Error&&t._onError(e);}finally{t._dirtyElements=l,t._dirtyLeaves=c,t._cloneNotNeeded=u,t._dirtyType=a,Si=i,Ci=s,ki=o;}return r}("string"==typeof e?JSON.parse(e):e,this,t)}update(e,t){Vi(this,e,t);}focus(e,t={}){const n=this._rootElement;null!==n&&(n.setAttribute("autocapitalize","off"),Vi(this,(()=>{const e=fi(),n=ht();null!==e?e.dirty=!0:0!==n.getChildrenSize()&&("rootStart"===t.defaultSelection?n.selectStart():n.selectEnd());}),{onUpdate:()=>{n.removeAttribute("autocapitalize"),e&&e();},tag:"focus"}),null===this._pendingEditorState&&n.removeAttribute("autocapitalize"));}blur(){const e=this._rootElement;null!==e&&e.blur();const t=nn(this._window);null!==t&&t.removeAllRanges();}isEditable(){return this._editable}setEditable(e){this._editable!==e&&(this._editable=e,Ri("editable",this,!0,e));}toJSON(){return {editorState:this._editorState.toJSON()}}}

const modProd$f = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$addUpdateTag: Vt,
	$applyNodeReplacement: Yt,
	$copyNode: Xt,
	$createLineBreakNode: xr,
	$createNodeSelection: ui,
	$createParagraphNode: rs,
	$createPoint: Vr,
	$createRangeSelection: ci,
	$createTabNode: Kr,
	$createTextNode: zr,
	$getAdjacentNode: Wt,
	$getCharacterOffsets: ei,
	$getEditor: un,
	$getNearestNodeFromDOMNode: at,
	$getNearestRootOrShadowRoot: qt,
	$getNodeByKey: ct,
	$getPreviousSelection: di,
	$getRoot: ht,
	$getSelection: fi,
	$getTextContent: xi,
	$hasAncestor: $t,
	$hasUpdateTag: Ut,
	$insertNodes: mi,
	$isBlockElementNode: oi,
	$isDecoratorNode: Hi,
	$isElementNode: qi,
	$isInlineElementOrDecoratorNode: jt,
	$isLeafNode: nt,
	$isLineBreakNode: vr,
	$isNodeSelection: Zr,
	$isParagraphNode: is,
	$isRangeSelection: Xr,
	$isRootNode: Yi,
	$isRootOrShadowRoot: Qt,
	$isTabNode: Jr,
	$isTextNode: Br,
	$nodesOfType: Ft,
	$normalizeSelection__EXPERIMENTAL: $e,
	$parseSerializedNode: Mi,
	$selectAll: Ot,
	$setCompositionKey: ot,
	$setSelection: _t,
	$splitNode: rn,
	BLUR_COMMAND: V,
	CAN_REDO_COMMAND: K$2,
	CAN_UNDO_COMMAND: J,
	CLEAR_EDITOR_COMMAND: B$2,
	CLEAR_HISTORY_COMMAND: R$2,
	CLICK_COMMAND: r$1,
	COMMAND_PRIORITY_CRITICAL: us,
	COMMAND_PRIORITY_EDITOR: ss,
	COMMAND_PRIORITY_HIGH: cs,
	COMMAND_PRIORITY_LOW: os,
	COMMAND_PRIORITY_NORMAL: ls,
	CONTROLLED_TEXT_INSERTION_COMMAND: l$4,
	COPY_COMMAND: M$3,
	CUT_COMMAND: W,
	DELETE_CHARACTER_COMMAND: i$4,
	DELETE_LINE_COMMAND: f$4,
	DELETE_WORD_COMMAND: a$3,
	DRAGEND_COMMAND: F$1,
	DRAGOVER_COMMAND: L$2,
	DRAGSTART_COMMAND: A$3,
	DROP_COMMAND: I$1,
	DecoratorNode: $i,
	ElementNode: ji,
	FOCUS_COMMAND: U,
	FORMAT_ELEMENT_COMMAND: O$2,
	FORMAT_TEXT_COMMAND: d$3,
	INDENT_CONTENT_COMMAND: P$3,
	INSERT_LINE_BREAK_COMMAND: s$2,
	INSERT_PARAGRAPH_COMMAND: o$4,
	INSERT_TAB_COMMAND: E$3,
	KEY_ARROW_DOWN_COMMAND: T$3,
	KEY_ARROW_LEFT_COMMAND: m$5,
	KEY_ARROW_RIGHT_COMMAND: p$3,
	KEY_ARROW_UP_COMMAND: v$3,
	KEY_BACKSPACE_COMMAND: C$4,
	KEY_DELETE_COMMAND: N$3,
	KEY_DOWN_COMMAND: _$5,
	KEY_ENTER_COMMAND: S$4,
	KEY_ESCAPE_COMMAND: b$2,
	KEY_MODIFIER_COMMAND: $$1,
	KEY_SPACE_COMMAND: k$2,
	KEY_TAB_COMMAND: w$3,
	LineBreakNode: yr,
	MOVE_TO_END: y$4,
	MOVE_TO_START: x$4,
	OUTDENT_CONTENT_COMMAND: D$2,
	PASTE_COMMAND: c$4,
	ParagraphNode: ts,
	REDO_COMMAND: g$5,
	REMOVE_TEXT_COMMAND: u$3,
	RootNode: Xi,
	SELECTION_CHANGE_COMMAND: t$2,
	SELECTION_INSERT_CLIPBOARD_NODES_COMMAND: n$2,
	SELECT_ALL_COMMAND: z$1,
	TabNode: Rr,
	TextNode: Er,
	UNDO_COMMAND: h$3,
	createCommand: e$1,
	createEditor: fs,
	getNearestEditorFromDOMNode: Ye,
	isCurrentlyReadOnlyMode: Ei,
	isHTMLAnchorElement: sn,
	isHTMLElement: on,
	isSelectionCapturedInDecoratorInput: Qe,
	isSelectionWithinEditor: Xe
}, Symbol.toStringTag, { value: 'Module' }));

const mod$f = modProd$f;
const $applyNodeReplacement = mod$f.$applyNodeReplacement;
const $createParagraphNode = mod$f.$createParagraphNode;
const $createTabNode = mod$f.$createTabNode;
const $createTextNode = mod$f.$createTextNode;
const $getAdjacentNode = mod$f.$getAdjacentNode;
const $getCharacterOffsets = mod$f.$getCharacterOffsets;
const $getNearestNodeFromDOMNode = mod$f.$getNearestNodeFromDOMNode;
const $getNodeByKey = mod$f.$getNodeByKey;
const $getPreviousSelection = mod$f.$getPreviousSelection;
const $getRoot = mod$f.$getRoot;
const $getSelection = mod$f.$getSelection;
const $hasAncestor = mod$f.$hasAncestor;
const $isDecoratorNode = mod$f.$isDecoratorNode;
const $isElementNode = mod$f.$isElementNode;
const $isLeafNode = mod$f.$isLeafNode;
const $isLineBreakNode = mod$f.$isLineBreakNode;
const $isParagraphNode = mod$f.$isParagraphNode;
const $isRangeSelection = mod$f.$isRangeSelection;
const $isRootNode = mod$f.$isRootNode;
const $isRootOrShadowRoot = mod$f.$isRootOrShadowRoot;
const $isTextNode = mod$f.$isTextNode;
const $parseSerializedNode = mod$f.$parseSerializedNode;
const $selectAll = mod$f.$selectAll;
const $setCompositionKey = mod$f.$setCompositionKey;
const $setSelection = mod$f.$setSelection;
const $splitNode = mod$f.$splitNode;
const CAN_REDO_COMMAND = mod$f.CAN_REDO_COMMAND;
const CAN_UNDO_COMMAND = mod$f.CAN_UNDO_COMMAND;
const CLEAR_EDITOR_COMMAND = mod$f.CLEAR_EDITOR_COMMAND;
const CLEAR_HISTORY_COMMAND = mod$f.CLEAR_HISTORY_COMMAND;
const COMMAND_PRIORITY_CRITICAL = mod$f.COMMAND_PRIORITY_CRITICAL;
const COMMAND_PRIORITY_EDITOR = mod$f.COMMAND_PRIORITY_EDITOR;
const CONTROLLED_TEXT_INSERTION_COMMAND = mod$f.CONTROLLED_TEXT_INSERTION_COMMAND;
const COPY_COMMAND = mod$f.COPY_COMMAND;
const CUT_COMMAND = mod$f.CUT_COMMAND;
const DELETE_CHARACTER_COMMAND = mod$f.DELETE_CHARACTER_COMMAND;
const DELETE_LINE_COMMAND = mod$f.DELETE_LINE_COMMAND;
const DELETE_WORD_COMMAND = mod$f.DELETE_WORD_COMMAND;
const DRAGSTART_COMMAND = mod$f.DRAGSTART_COMMAND;
const DROP_COMMAND = mod$f.DROP_COMMAND;
const DecoratorNode = mod$f.DecoratorNode;
const ElementNode = mod$f.ElementNode;
const INSERT_LINE_BREAK_COMMAND = mod$f.INSERT_LINE_BREAK_COMMAND;
const INSERT_PARAGRAPH_COMMAND = mod$f.INSERT_PARAGRAPH_COMMAND;
const KEY_ARROW_LEFT_COMMAND = mod$f.KEY_ARROW_LEFT_COMMAND;
const KEY_ARROW_RIGHT_COMMAND = mod$f.KEY_ARROW_RIGHT_COMMAND;
const KEY_BACKSPACE_COMMAND = mod$f.KEY_BACKSPACE_COMMAND;
const KEY_DELETE_COMMAND = mod$f.KEY_DELETE_COMMAND;
const KEY_ENTER_COMMAND = mod$f.KEY_ENTER_COMMAND;
const LineBreakNode = mod$f.LineBreakNode;
const PASTE_COMMAND = mod$f.PASTE_COMMAND;
const ParagraphNode = mod$f.ParagraphNode;
const REDO_COMMAND = mod$f.REDO_COMMAND;
const REMOVE_TEXT_COMMAND = mod$f.REMOVE_TEXT_COMMAND;
const RootNode = mod$f.RootNode;
const SELECTION_INSERT_CLIPBOARD_NODES_COMMAND = mod$f.SELECTION_INSERT_CLIPBOARD_NODES_COMMAND;
const SELECT_ALL_COMMAND = mod$f.SELECT_ALL_COMMAND;
const TextNode = mod$f.TextNode;
const UNDO_COMMAND = mod$f.UNDO_COMMAND;
const createCommand = mod$f.createCommand;
const createEditor = mod$f.createEditor;
const isHTMLAnchorElement$1 = mod$f.isHTMLAnchorElement;
const isHTMLElement$1 = mod$f.isHTMLElement;
const isSelectionWithinEditor = mod$f.isSelectionWithinEditor;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var r=function(e){const n=new URLSearchParams;n.append("code",e);for(let e=1;e<arguments.length;e++)n.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${n} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)};const l$3=reactExports.createContext(null);function t$1(e,n){let r=null;return null!=e&&(r=e[1]),{getTheme:function(){return null!=n?n:null!=r?r.getTheme():null}}}function o$3(){const e=reactExports.useContext(l$3);return null==e&&r(8),e}

const modProd$e = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	LexicalComposerContext: l$3,
	createLexicalComposerContext: t$1,
	useLexicalComposerContext: o$3
}, Symbol.toStringTag, { value: 'Module' }));

const mod$e = modProd$e;
const LexicalComposerContext = mod$e.LexicalComposerContext;
const createLexicalComposerContext = mod$e.createLexicalComposerContext;
const useLexicalComposerContext = mod$e.useLexicalComposerContext;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const d$2="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement;var m$4=d$2?reactExports.useLayoutEffect:reactExports.useEffect;const u$2={tag:"history-merge"};function f$3({initialConfig:l,children:c}){const f=reactExports.useMemo((()=>{const{theme:t,namespace:a,editor__DEPRECATED:c,nodes:s,onError:m,editorState:f,html:p}=l,E=createLexicalComposerContext(null,t);let v=c||null;if(null===v){const e=createEditor({editable:l.editable,html:p,namespace:a,nodes:s,onError:t=>m(t,e),theme:t});!function(e,t){if(null===t)return;if(void 0===t)e.update((()=>{const t=$getRoot();if(t.isEmpty()){const o=$createParagraphNode();t.append(o);const n=d$2?document.activeElement:null;(null!==$getSelection()||null!==n&&n===e.getRootElement())&&o.select();}}),u$2);else if(null!==t)switch(typeof t){case"string":{const o=e.parseEditorState(t);e.setEditorState(o,u$2);break}case"object":e.setEditorState(t,u$2);break;case"function":e.update((()=>{$getRoot().isEmpty()&&t(e);}),u$2);}}(e,f),v=e;}return [v,E]}),[]);return m$4((()=>{const e=l.editable,[t]=f;t.setEditable(void 0===e||e);}),[]),reactExports.createElement(LexicalComposerContext.Provider,{value:f},c)}

const modProd$d = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	LexicalComposer: f$3
}, Symbol.toStringTag, { value: 'Module' }));

const mod$d = modProd$d;
const LexicalComposer = mod$d.LexicalComposer;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function n$1(){return n$1=Object.assign?Object.assign.bind():function(e){for(var a=1;a<arguments.length;a++){var t=arguments[a];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);}return e},n$1.apply(this,arguments)}var d$1="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement?reactExports.useLayoutEffect:reactExports.useEffect;function l$2({ariaActiveDescendant:t,ariaAutoComplete:i,ariaControls:l,ariaDescribedBy:c,ariaExpanded:s,ariaLabel:u,ariaLabelledBy:b,ariaMultiline:m,ariaOwns:p,ariaRequired:f,autoCapitalize:v,className:w,id:y,role:x="textbox",spellCheck:C=!0,style:E,tabIndex:h,"data-testid":L,...O}){const[g]=useLexicalComposerContext(),[D,j]=reactExports.useState(!1),k=reactExports.useCallback((e=>{e&&e.ownerDocument&&e.ownerDocument.defaultView&&g.setRootElement(e);}),[g]);return d$1((()=>(j(g.isEditable()),g.registerEditableListener((e=>{j(e);})))),[g]),reactExports.createElement("div",n$1({},O,{"aria-activedescendant":D?t:void 0,"aria-autocomplete":D?i:"none","aria-controls":D?l:void 0,"aria-describedby":c,"aria-expanded":D&&"combobox"===x?!!s:void 0,"aria-label":u,"aria-labelledby":b,"aria-multiline":m,"aria-owns":D?p:void 0,"aria-readonly":!D||void 0,"aria-required":f,autoCapitalize:v,className:w,contentEditable:D,"data-testid":L,id:y,ref:k,role:x,spellCheck:C,style:E,tabIndex:h}))}

const modProd$c = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	ContentEditable: l$2
}, Symbol.toStringTag, { value: 'Module' }));

const mod$c = modProd$c;
const ContentEditable = mod$c.ContentEditable;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const m$3=new Map;function _$4(e){let t=e;for(;null!=t;){if(t.nodeType===Node.TEXT_NODE)return t;t=t.firstChild;}return null}function y$3(e){const t=e.parentNode;if(null==t)throw new Error("Should never happen");return [t,Array.from(t.childNodes).indexOf(e)]}function T$2(t,n,o,l,r){const s=n.getKey(),i=l.getKey(),c=document.createRange();let f=t.getElementByKey(s),u=t.getElementByKey(i),g=o,a=r;if($isTextNode(n)&&(f=_$4(f)),$isTextNode(l)&&(u=_$4(u)),void 0===n||void 0===l||null===f||null===u)return null;"BR"===f.nodeName&&([f,g]=y$3(f)),"BR"===u.nodeName&&([u,a]=y$3(u));const d=f.firstChild;f===u&&null!=d&&"BR"===d.nodeName&&0===g&&0===a&&(a=1);try{c.setStart(f,g),c.setEnd(u,a);}catch(e){return null}return !c.collapsed||g===a&&s===i||(c.setStart(u,a),c.setEnd(f,g)),c}function x$3(e,t){const n=e.getRootElement();if(null===n)return [];const o=n.getBoundingClientRect(),l=getComputedStyle(n),r=parseFloat(l.paddingLeft)+parseFloat(l.paddingRight),s=Array.from(t.getClientRects());let i,c=s.length;s.sort(((e,t)=>{const n=e.top-t.top;return Math.abs(n)<=3?e.left-t.left:n}));for(let e=0;e<c;e++){const t=s[e],n=i&&i.top<=t.top&&i.top+i.height>t.top&&i.left+i.width>t.left,l=t.width+r===o.width;n||l?(s.splice(e--,1),c--):i=t;}return s}function S$3(e){const t={},n=e.split(";");for(const e of n)if(""!==e){const[n,o]=e.split(/:([^]+)/);n&&o&&(t[n.trim()]=o.trim());}return t}function N$2(e){let t=m$3.get(e);return void 0===t&&(t=S$3(e),m$3.set(e,t)),t}function E$2(n){const o=n.constructor.clone(n);return o.__parent=n.__parent,o.__next=n.__next,o.__prev=n.__prev,$isElementNode(n)&&$isElementNode(o)?(r=n,(l=o).__first=r.__first,l.__last=r.__last,l.__size=r.__size,l.__format=r.__format,l.__indent=r.__indent,l.__dir=r.__dir,l):$isTextNode(n)&&$isTextNode(o)?function(e,t){return e.__format=t.__format,e.__style=t.__style,e.__mode=t.__mode,e.__detail=t.__detail,e}(o,n):o;var l,r;}function v$2(e,t){const o=e.getStartEndPoints();if(t.isSelected(e)&&!t.isSegmented()&&!t.isToken()&&null!==o){const[l,r]=o,s=e.isBackward(),i=l.getNode(),c=r.getNode(),f=t.is(i),u=t.is(c);if(f||u){const[o,l]=$getCharacterOffsets(e),r=i.is(c),f=t.is(s?c:i),u=t.is(s?i:c);let g,a=0;if(r)a=o>l?l:o,g=o>l?o:l;else if(f){a=s?l:o,g=void 0;}else if(u){a=0,g=s?o:l;}return t.__text=t.__text.slice(a,g),t}}return t}function C$3(e){if("text"===e.type)return e.offset===e.getNode().getTextContentSize();const n=e.getNode();if(!$isElementNode(n))throw Error("isAtNodeEnd: node must be a TextNode or ElementNode");return e.offset===n.getChildrenSize()}function w$2(n,c,f){let u=c.getNode(),g=f;if($isElementNode(u)){const e=u.getDescendantByIndex(c.offset);null!==e&&(u=e);}for(;g>0&&null!==u;){if($isElementNode(u)){const e=u.getLastDescendant();null!==e&&(u=e);}let f=u.getPreviousSibling(),a=0;if(null===f){let e=u.getParentOrThrow(),t=e.getPreviousSibling();for(;null===t;){if(e=e.getParent(),null===e){f=null;break}t=e.getPreviousSibling();}null!==e&&(a=e.isInline()?0:2,f=t);}let d=u.getTextContent();""===d&&$isElementNode(u)&&!u.isInline()&&(d="\n\n");const p=d.length;if(!$isTextNode(u)||g>=p){const e=u.getParent();u.remove(),null==e||0!==e.getChildrenSize()||$isRootNode(e)||e.remove(),g-=p+a,u=f;}else {const t=u.getKey(),o=n.getEditorState().read((()=>{const n=$getNodeByKey(t);return $isTextNode(n)&&n.isSimpleText()?n.getTextContent():null})),f=p-g,a=d.slice(0,f);if(null!==o&&o!==d){const e=$getPreviousSelection();let t=u;if(u.isSimpleText())u.setTextContent(o);else {const e=$createTextNode(o);u.replace(e),t=e;}if($isRangeSelection(e)&&e.isCollapsed()){const n=e.anchor.offset;t.select(n,n);}}else if(u.isSimpleText()){const e=c.key===t;let n=c.offset;n<g&&(n=p);const o=e?n-g:0,l=e?n:f;if(e&&0===o){const[e]=u.splitText(o,l);e.remove();}else {const[,e]=u.splitText(o,l);e.remove();}}else {const e=$createTextNode(a);u.replace(e);}g=0;}}}function P$2(e){const t=e.getStyle(),n=S$3(t);m$3.set(t,n);}function F(e,t){const n=N$2("getStyle"in e?e.getStyle():e.style),o=Object.entries(t).reduce(((e,[t,o])=>(o instanceof Function?e[t]=o(n[t]):null===o?delete e[t]:e[t]=o,e)),{...n}||{}),l=function(e){let t="";for(const n in e)n&&(t+=`${n}: ${e[n]};`);return t}(o);e.setStyle(l),m$3.set(l,o);}function I(t,n){const o=t.getNodes(),l=o.length,r=t.getStartEndPoints();if(null===r)return;const[s,c]=r,f=l-1;let u=o[0],g=o[f];if(t.isCollapsed()&&$isRangeSelection(t))return void F(t,n);const a=u.getTextContent().length,d=c.offset;let p=s.offset;const h=s.isBefore(c);let m=h?p:d,_=h?d:p;const y=h?s.type:c.type,T=h?c.type:s.type,x=h?c.key:s.key;if($isTextNode(u)&&m===a){const t=u.getNextSibling();$isTextNode(t)&&(p=0,m=0,u=t);}if(1===o.length){if($isTextNode(u)&&u.canHaveFormat()){if(m="element"===y?0:p>d?d:p,_="element"===T?a:p>d?p:d,m===_)return;if(0===m&&_===a)F(u,n),u.select(m,_);else {const e=u.splitText(m,_),t=0===m?e[0]:e[1];F(t,n),t.select(0,_-m);}}}else {if($isTextNode(u)&&m<u.getTextContentSize()&&u.canHaveFormat()&&(0!==m&&(u=u.splitText(m)[1],m=0,s.set(u.getKey(),m,"text")),F(u,n)),$isTextNode(g)&&g.canHaveFormat()){const e=g.getTextContent().length;g.__key!==x&&0!==_&&(_=e),_!==e&&([g]=g.splitText(_)),0===_&&"element"!==T||F(g,n);}for(let t=1;t<f;t++){const l=o[t],r=l.getKey();$isTextNode(l)&&l.canHaveFormat()&&r!==u.getKey()&&r!==g.getKey()&&!l.isToken()&&F(l,n);}}}function K$1(e,n){if(null===e)return;const o=e.getStartEndPoints(),l=o?o[0]:null;if(null!==l&&"root"===l.key){const e=n(),t=$getRoot(),o=t.getFirstChild();return void(o?o.replace(e,!0):t.append(e))}const r=e.getNodes(),s=null!==l&&function(e,t){let n=e;for(;null!==n&&null!==n.getParent()&&!t(n);)n=n.getParentOrThrow();return t(n)?n:null}(l.getNode(),$);s&&-1===r.indexOf(s)&&r.push(s);for(let e=0;e<r.length;e++){const o=r[e];if(!$(o))continue;if(!$isElementNode(o))throw Error("Expected block node to be an ElementNode");const l=n();l.setFormat(o.getFormatType()),l.setIndent(o.getIndent()),o.replace(l,!0);}}function b$1(e){return e.getNode().isAttached()}function O$1(e){let t=e;for(;null!==t&&!$isRootOrShadowRoot(t);){const e=t.getLatest(),n=t.getParent();0===e.getChildrenSize()&&t.remove(!0),t=n;}}function k$1(e,t,n=null){const o=e.getStartEndPoints(),l=o?o[0]:null,r=e.getNodes(),s=r.length;if(null!==l&&(0===s||1===s&&"element"===l.type&&0===l.getNode().getChildrenSize())){const e="text"===l.type?l.getNode().getParentOrThrow():l.getNode(),o=e.getChildren();let r=t();return r.setFormat(e.getFormatType()),r.setIndent(e.getIndent()),o.forEach((e=>r.append(e))),n&&(r=n.append(r)),void e.replace(r)}let i=null,c=[];for(let o=0;o<s;o++){const l=r[o];$isRootOrShadowRoot(l)?(B$1(e,c,c.length,t,n),c=[],i=l):null===i||null!==i&&$hasAncestor(l,i)?c.push(l):(B$1(e,c,c.length,t,n),c=[l]);}B$1(e,c,c.length,t,n);}function B$1(e,n,o,l,s=null){if(0===n.length)return;const c=n[0],u=new Map,d=[];let p=$isElementNode(c)?c:c.getParentOrThrow();p.isInline()&&(p=p.getParentOrThrow());let h=!1;for(;null!==p;){const e=p.getPreviousSibling();if(null!==e){p=e,h=!0;break}if(p=p.getParentOrThrow(),$isRootOrShadowRoot(p))break}const m=new Set;for(let e=0;e<o;e++){const o=n[e];$isElementNode(o)&&0===o.getChildrenSize()&&m.add(o.getKey());}const _=new Set;for(let e=0;e<o;e++){const o=n[e];let r=o.getParent();if(null!==r&&r.isInline()&&(r=r.getParent()),null!==r&&$isLeafNode(o)&&!_.has(o.getKey())){const e=r.getKey();if(void 0===u.get(e)){const n=l();n.setFormat(r.getFormatType()),n.setIndent(r.getIndent()),d.push(n),u.set(e,n),r.getChildren().forEach((e=>{n.append(e),_.add(e.getKey()),$isElementNode(e)&&e.getChildrenKeys().forEach((e=>_.add(e)));})),O$1(r);}}else if(m.has(o.getKey())){if(!$isElementNode(o))throw Error("Expected node in emptyElements to be an ElementNode");const e=l();e.setFormat(o.getFormatType()),e.setIndent(o.getIndent()),d.push(e),o.remove(!0);}}if(null!==s)for(let e=0;e<d.length;e++){const t=d[e];s.append(t);}let y=null;if($isRootOrShadowRoot(p))if(h)if(null!==s)p.insertAfter(s);else for(let e=d.length-1;e>=0;e--){const t=d[e];p.insertAfter(t);}else {const e=p.getFirstChild();if($isElementNode(e)&&(p=e),null===e)if(s)p.append(s);else for(let e=0;e<d.length;e++){const t=d[e];p.append(t),y=t;}else if(null!==s)e.insertBefore(s);else for(let t=0;t<d.length;t++){const n=d[t];e.insertBefore(n),y=n;}}else if(s)p.insertAfter(s);else for(let e=d.length-1;e>=0;e--){const t=d[e];p.insertAfter(t),y=t;}const T=$getPreviousSelection();$isRangeSelection(T)&&b$1(T.anchor)&&b$1(T.focus)?$setSelection(T.clone()):null!==y?y.selectEnd():e.dirty=!0;}function z(e,n){const o=$getAdjacentNode(e.focus,n);return $isDecoratorNode(o)&&!o.isIsolated()||$isElementNode(o)&&!o.isInline()&&!o.canBeEmpty()}function A$2(e,t,n,o){e.modify(t?"extend":"move",n,o);}function R$1(e){const t=e.anchor.getNode();return "rtl"===($isRootNode(t)?t:t.getParentOrThrow()).getDirection()}function D$1(e,t,n){const o=R$1(e);A$2(e,t,n?!o:o,"character");}function L$1(n){const o=n.anchor,l=n.focus,r=o.getNode().getTopLevelElementOrThrow().getParentOrThrow();let s=r.getFirstDescendant(),i=r.getLastDescendant(),c="element",f="element",u=0;$isTextNode(s)?c="text":$isElementNode(s)||null===s||(s=s.getParentOrThrow()),$isTextNode(i)?(f="text",u=i.getTextContentSize()):$isElementNode(i)||null===i||(i=i.getParentOrThrow()),s&&i&&(o.set(s.getKey(),0,c),l.set(i.getKey(),u,f));}function H(e,t,n){const o=N$2(e.getStyle());return null!==o&&o[t]||n}function M$2(t,n,o=""){let l=null;const r=t.getNodes(),s=t.anchor,i=t.focus,c=t.isBackward(),f=c?i.offset:s.offset,u=c?i.getNode():s.getNode();if(t.isCollapsed()&&""!==t.style){const e=N$2(t.style);if(null!==e&&n in e)return e[n]}for(let t=0;t<r.length;t++){const s=r[t];if((0===t||0!==f||!s.is(u))&&$isTextNode(s)){const e=H(s,n,o);if(null===l)l=e;else if(l!==e){l="";break}}}return null===l?o:l}function $(n){if($isDecoratorNode(n))return !1;if(!$isElementNode(n)||$isRootOrShadowRoot(n))return !1;const o=n.getFirstChild(),l=null===o||$isLineBreakNode(o)||$isTextNode(o)||o.isInline();return !n.isInline()&&!1!==n.canBeEmpty()&&l}

const modProd$b = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$addNodeStyle: P$2,
	$cloneWithProperties: E$2,
	$getSelectionStyleValueForProperty: M$2,
	$isAtNodeEnd: C$3,
	$isParentElementRTL: R$1,
	$moveCaretSelection: A$2,
	$moveCharacter: D$1,
	$patchStyleText: I,
	$selectAll: L$1,
	$setBlocksType: K$1,
	$shouldOverrideDefaultCharacterSelection: z,
	$sliceSelectedTextNodeContent: v$2,
	$wrapNodes: k$1,
	createDOMRange: T$2,
	createRectsFromDOMRange: x$3,
	getStyleObjectFromCSS: N$2,
	trimTextContentFromAnchor: w$2
}, Symbol.toStringTag, { value: 'Module' }));

const mod$b = modProd$b;
const $addNodeStyle = mod$b.$addNodeStyle;
const $cloneWithProperties = mod$b.$cloneWithProperties;
const $moveCharacter = mod$b.$moveCharacter;
const $shouldOverrideDefaultCharacterSelection = mod$b.$shouldOverrideDefaultCharacterSelection;
const $sliceSelectedTextNodeContent = mod$b.$sliceSelectedTextNodeContent;
const createRectsFromDOMRange = mod$b.createRectsFromDOMRange;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var g$4=function(t){const e=new URLSearchParams;e.append("code",t);for(let t=1;t<arguments.length;t++)e.append("v",arguments[t]);throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)};function p$2(...t){const e=[];for(const n of t)if(n&&"string"==typeof n)for(const[t]of n.matchAll(/\S+/g))e.push(t);return e}function h$2(...t){return ()=>{t.forEach((t=>t()));}}function m$2(t){return `${t}px`}const E$1={attributes:!0,characterData:!0,childList:!0,subtree:!0};function x$2(e,n,o){let r=null,l=null,i=null,s=[];const c=document.createElement("div");function f(){if(null===r)throw Error("Unexpected null rootDOMNode");if(null===l)throw Error("Unexpected null parentDOMNode");const{left:i,top:f}=r.getBoundingClientRect(),u=l,a=createRectsFromDOMRange(e,n);c.isConnected||u.append(c);let d=!1;for(let t=0;t<a.length;t++){const e=a[t],n=s[t]||document.createElement("div"),o=n.style;"absolute"!==o.position&&(o.position="absolute",d=!0);const r=m$2(e.left-i);o.left!==r&&(o.left=r,d=!0);const l=m$2(e.top-f);o.top!==l&&(n.style.top=l,d=!0);const u=m$2(e.width);o.width!==u&&(n.style.width=u,d=!0);const g=m$2(e.height);o.height!==g&&(n.style.height=g,d=!0),n.parentNode!==c&&(c.append(n),d=!0),s[t]=n;}for(;s.length>a.length;)s.pop();d&&o(s);}function u(){l=null,r=null,null!==i&&i.disconnect(),i=null,c.remove();for(const t of s)t.remove();s=[];}const a=e.registerRootListener((function t(){const n=e.getRootElement();if(null===n)return u();const o=n.parentElement;if(!(o instanceof HTMLElement))return u();u(),r=n,l=o,i=new MutationObserver((n=>{const o=e.getRootElement(),i=o&&o.parentElement;if(o!==r||i!==l)return t();for(const t of n)if(!c.contains(t.target))return f()})),i.observe(o,E$1),f();}));return ()=>{a(),u();}}function y$2(t,e){let l=null,i=null,s=null,c=null,f=()=>{};function u(u){u.read((()=>{const u=$getSelection();if(!$isRangeSelection(u))return l=null,i=null,s=null,c=null,f(),void(f=()=>{});const{anchor:a,focus:d}=u,g=a.getNode(),p=g.getKey(),h=a.offset,E=d.getNode(),y=E.getKey(),v=d.offset,N=t.getElementByKey(p),w=t.getElementByKey(y),L=null===l||null===N||h!==i||p!==l.getKey()||g!==l&&(!(l instanceof TextNode)||g.updateDOM(l,N,t._config)),T=null===s||null===w||v!==c||y!==s.getKey()||E!==s&&(!(s instanceof TextNode)||E.updateDOM(s,w,t._config));if(L||T){const n=t.getElementByKey(a.getNode().getKey()),o=t.getElementByKey(d.getNode().getKey());if(null!==n&&null!==o&&"SPAN"===n.tagName&&"SPAN"===o.tagName){const r=document.createRange();let l,i,s,c;d.isBefore(a)?(l=o,i=d.offset,s=n,c=a.offset):(l=n,i=a.offset,s=o,c=d.offset);const u=l.firstChild;if(null===u)throw Error("Expected text node to be first child of span");const g=s.firstChild;if(null===g)throw Error("Expected text node to be first child of span");r.setStart(u,i),r.setEnd(g,c),f(),f=x$2(t,r,(t=>{for(const e of t){const t=e.style;"Highlight"!==t.background&&(t.background="Highlight"),"HighlightText"!==t.color&&(t.color="HighlightText"),"-1"!==t.zIndex&&(t.zIndex="-1"),"none"!==t.pointerEvents&&(t.pointerEvents="none"),t.marginTop!==m$2(-1.5)&&(t.marginTop=m$2(-1.5)),t.paddingTop!==m$2(4)&&(t.paddingTop=m$2(4)),t.paddingBottom!==m$2(0)&&(t.paddingBottom=m$2(0));}void 0!==e&&e(t);}));}}l=g,i=h,s=E,c=v;}));}return u(t.getEditorState()),h$2(t.registerUpdateListener((({editorState:t})=>u(t))),f,(()=>{f();}))}function v$1(t,...e){const n=p$2(...e);n.length>0&&t.classList.add(...n);}function N$1(t,...e){const n=p$2(...e);n.length>0&&t.classList.remove(...n);}function w$1(t,e){for(const n of e)if(t.type.startsWith(n))return !0;return !1}function L(t,e){const n=t[Symbol.iterator]();return new Promise(((t,o)=>{const r=[],l=()=>{const{done:i,value:s}=n.next();if(i)return t(r);const c=new FileReader;c.addEventListener("error",o),c.addEventListener("load",(()=>{const t=c.result;"string"==typeof t&&r.push({file:s,result:t}),l();})),w$1(s,e)?c.readAsDataURL(s):l();};l();}))}function T$1(t,e){const n=[],o=(t||$getRoot()).getLatest(),r=e||($isElementNode(o)?o.getLastDescendant():o);let s=o,c=function(t){let e=t,n=0;for(;null!==(e=e.getParent());)n++;return n}(s);for(;null!==s&&!s.is(r);)if(n.push({depth:c,node:s}),$isElementNode(s)&&s.getChildrenSize()>0)s=s.getFirstChild(),c++;else {let t=null;for(;null===t&&null!==s;)t=s.getNextSibling(),null===t?(s=s.getParent(),c--):s=t;}return null!==s&&s.is(r)&&n.push({depth:c,node:s}),n}function b(t,e){let n=t;for(;null!=n;){if(n instanceof e)return n;n=n.getParent();}return null}function S$2(t){const e=_$3(t,(t=>$isElementNode(t)&&!t.isInline()));return $isElementNode(e)||g$4(4,t.__key),e}const _$3=(t,e)=>{let n=t;for(;n!==$getRoot()&&null!=n;){if(e(n))return n;n=n.getParent();}return null};function B(t,e,n,o){const r=t=>t instanceof e;return t.registerNodeTransform(e,(t=>{const e=(t=>{const e=t.getChildren();for(let t=0;t<e.length;t++){const n=e[t];if(r(n))return null}let n=t,o=t;for(;null!==n;)if(o=n,n=n.getParent(),r(n))return {child:o,parent:n};return null})(t);if(null!==e){const{child:r,parent:l}=e;if(r.is(t)){o(l,t);const e=r.getNextSiblings(),i=e.length;if(l.insertAfter(r),0!==i){const t=n(l);r.insertAfter(t);for(let n=0;n<i;n++)t.append(e[n]);}l.canBeEmpty()||0!==l.getChildrenSize()||l.remove();}}}))}function M$1(t,n){const o=new Map,r=t._pendingEditorState;for(const[t,r]of n._nodeMap){const n=$cloneWithProperties(r);if($isTextNode(n)){if(!$isTextNode(r))throw Error("Expected node be a TextNode");n.__text=r.__text;}o.set(t,n);}r&&(r._nodeMap=o),t._dirtyType=2;const l=n._selection;$setSelection(null===l?null:l.clone());}function P$1(t){const e=$getSelection()||$getPreviousSelection();if($isRangeSelection(e)){const{focus:n}=e,o=n.getNode(),r=n.offset;if($isRootOrShadowRoot(o)){const e=o.getChildAtIndex(r);null==e?o.append(t):e.insertBefore(t),t.selectNext();}else {let e,n;$isTextNode(o)?(e=o.getParentOrThrow(),n=o.getIndexWithinParent(),r>0&&(n+=1,o.splitText(r))):(e=o,n=r);const[,l]=$splitNode(e,n);l.insertBefore(t),l.selectStart();}}else {if(null!=e){const n=e.getNodes();n[n.length-1].getTopLevelElementOrThrow().insertAfter(t);}else {$getRoot().append(t);}const n=$createParagraphNode();t.insertAfter(n),n.select();}return t.getLatest()}function A$1(t,e){const n=e();return t.replace(n),n.append(t),n}function C$2(t,e){return null!==t&&Object.getPrototypeOf(t).constructor.name===e.name}function K(t,e){const n=[];for(let o=0;o<t.length;o++){const r=e(t[o]);null!==r&&n.push(r);}return n}function O(t,e){const n=t.getFirstChild();null!==n?n.insertBefore(e):t.append(e);}

const modProd$a = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$dfs: T$1,
	$filter: K,
	$findMatchingParent: _$3,
	$getNearestBlockElementAncestorOrThrow: S$2,
	$getNearestNodeOfType: b,
	$insertFirst: O,
	$insertNodeToNearestRoot: P$1,
	$restoreEditorState: M$1,
	$splitNode,
	$wrapNodeInElement: A$1,
	addClassNamesToElement: v$1,
	isHTMLAnchorElement: isHTMLAnchorElement$1,
	isHTMLElement: isHTMLElement$1,
	isMimeType: w$1,
	markSelection: y$2,
	mediaFileReader: L,
	mergeRegister: h$2,
	objectKlassEquals: C$2,
	positionNodeOnRange: x$2,
	registerNestedElementResolver: B,
	removeClassNamesFromElement: N$1
}, Symbol.toStringTag, { value: 'Module' }));

const mod$a = modProd$a;
const $findMatchingParent = mod$a.$findMatchingParent;
const addClassNamesToElement = mod$a.addClassNamesToElement;
const isHTMLAnchorElement = mod$a.isHTMLAnchorElement;
const isHTMLElement = mod$a.isHTMLElement;
const mergeRegister = mod$a.mergeRegister;
const objectKlassEquals = mod$a.objectKlassEquals;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const i$3=new Set(["mouseenter","mouseleave"]);function l$1({nodeType:l,eventType:s,eventListener:c}){const[u]=useLexicalComposerContext(),a=reactExports.useRef(c);return a.current=c,reactExports.useEffect((()=>{const e=i$3.has(s),r=r=>{u.update((()=>{const o=$getNearestNodeFromDOMNode(r.target);if(null!==o){const n=e?o instanceof l?o:null:$findMatchingParent(o,(e=>e instanceof l));if(null!==n)return void a.current(r,u,n.getKey())}}));};return u.registerRootListener(((t,n)=>{t&&t.addEventListener(s,r,e),n&&n.removeEventListener(s,r,e);}))}),[u,l]),null}

const modProd$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	NodeEventPlugin: l$1
}, Symbol.toStringTag, { value: 'Module' }));

const mod$9 = modProd$9;
const NodeEventPlugin = mod$9.NodeEventPlugin;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const l=0,_$2=1,f$2=2,p$1=0,h$1=1,m$1=2,g$3=3,y$1=4;function S$1(t,e,n,r,o){if(null===t||0===n.size&&0===r.size&&!o)return p$1;const i=e._selection,s=t._selection;if(o)return h$1;if(!($isRangeSelection(i)&&$isRangeSelection(s)&&s.isCollapsed()&&i.isCollapsed()))return p$1;const c=function(t,e,n){const r=t._nodeMap,o=[];for(const t of e){const e=r.get(t);void 0!==e&&o.push(e);}for(const[t,e]of n){if(!e)continue;const n=r.get(t);void 0===n||$isRootNode(n)||o.push(n);}return o}(e,n,r);if(0===c.length)return p$1;if(c.length>1){const n=e._nodeMap,r=n.get(i.anchor.key),o=n.get(s.anchor.key);return r&&o&&!t._nodeMap.has(r.__key)&&$isTextNode(r)&&1===r.__text.length&&1===i.anchor.offset?m$1:p$1}const l=c[0],_=t._nodeMap.get(l.__key);if(!$isTextNode(_)||!$isTextNode(l)||_.__mode!==l.__mode)return p$1;const f=_.__text,S=l.__text;if(f===S)return p$1;const k=i.anchor,C=s.anchor;if(k.key!==C.key||"text"!==k.type)return p$1;const x=k.offset,M=C.offset,z=S.length-f.length;return 1===z&&M===x-1?m$1:-1===z&&M===x+1?g$3:-1===z&&M===x?y$1:p$1}function k(t,e){let n=Date.now(),r=p$1;return (o,i,s,c,d,h)=>{const m=Date.now();if(h.has("historic"))return r=p$1,n=m,f$2;const g=S$1(o,i,c,d,t.isComposing()),y=(()=>{const y=null===s||s.editor===t,S=h.has("history-push");if(!S&&y&&h.has("history-merge"))return l;if(null===o)return _$2;const k=i._selection;if(!(c.size>0||d.size>0))return null!==k?l:f$2;if(!1===S&&g!==p$1&&g===r&&m<n+e&&y)return l;if(1===c.size){if(function(t,e,n){const r=e._nodeMap.get(t),o=n._nodeMap.get(t),i=e._selection,s=n._selection;let c=!1;return $isRangeSelection(i)&&$isRangeSelection(s)&&(c="element"===i.anchor.type&&"element"===i.focus.type&&"text"===s.anchor.type&&"text"===s.focus.type),!(c||!$isTextNode(r)||!$isTextNode(o))&&r.__type===o.__type&&r.__text===o.__text&&r.__mode===o.__mode&&r.__detail===o.__detail&&r.__style===o.__style&&r.__format===o.__format&&r.__parent===o.__parent}(Array.from(c)[0],o,i))return l}return _$2})();return n=m,r=g,y}}function C$1(t){t.undoStack=[],t.redoStack=[],t.current=null;}function x$1(a,u,d){const l=k(a,d),p=({editorState:t,prevEditorState:e,dirtyLeaves:n,dirtyElements:r,tags:o})=>{const i=u.current,d=u.redoStack,p=u.undoStack,h=null===i?null:i.editorState;if(null!==i&&t===h)return;const m=l(e,t,i,n,r,o);if(m===_$2)0!==d.length&&(u.redoStack=[],a.dispatchCommand(CAN_REDO_COMMAND,!1)),null!==i&&(p.push({...i}),a.dispatchCommand(CAN_UNDO_COMMAND,!0));else if(m===f$2)return;u.current={editor:a,editorState:t};},h=mergeRegister(a.registerCommand(UNDO_COMMAND,(()=>(function(t,e){const n=e.redoStack,r=e.undoStack;if(0!==r.length){const o=e.current,i=r.pop();null!==o&&(n.push(o),t.dispatchCommand(CAN_REDO_COMMAND,!0)),0===r.length&&t.dispatchCommand(CAN_UNDO_COMMAND,!1),e.current=i||null,i&&i.editor.setEditorState(i.editorState,{tag:"historic"});}}(a,u),!0)),COMMAND_PRIORITY_EDITOR),a.registerCommand(REDO_COMMAND,(()=>(function(t,e){const n=e.redoStack,r=e.undoStack;if(0!==n.length){const o=e.current;null!==o&&(r.push(o),t.dispatchCommand(CAN_UNDO_COMMAND,!0));const i=n.pop();0===n.length&&t.dispatchCommand(CAN_REDO_COMMAND,!1),e.current=i||null,i&&i.editor.setEditorState(i.editorState,{tag:"historic"});}}(a,u),!0)),COMMAND_PRIORITY_EDITOR),a.registerCommand(CLEAR_EDITOR_COMMAND,(()=>(C$1(u),!1)),COMMAND_PRIORITY_EDITOR),a.registerCommand(CLEAR_HISTORY_COMMAND,(()=>(C$1(u),a.dispatchCommand(CAN_REDO_COMMAND,!1),a.dispatchCommand(CAN_UNDO_COMMAND,!1),!0)),COMMAND_PRIORITY_EDITOR),a.registerUpdateListener(p)),m=a.registerUpdateListener(p);return ()=>{h(),m();}}function M(){return {current:null,redoStack:[],undoStack:[]}}

const modProd$8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	createEmptyHistoryState: M,
	registerHistory: x$1
}, Symbol.toStringTag, { value: 'Module' }));

const mod$8 = modProd$8;
const createEmptyHistoryState = mod$8.createEmptyHistoryState;
const registerHistory = mod$8.registerHistory;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function c$3({externalHistoryState:c}){const[a]=useLexicalComposerContext();return function(t,c,a=1e3){const l=reactExports.useMemo((()=>c||createEmptyHistoryState()),[c]);reactExports.useEffect((()=>registerHistory(t,l,a)),[a,t,l]);}(a,c),null}

const modProd$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	HistoryPlugin: c$3,
	createEmptyHistoryState
}, Symbol.toStringTag, { value: 'Module' }));

const mod$7 = modProd$7;
const HistoryPlugin = mod$7.HistoryPlugin;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var o$2="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement?reactExports.useLayoutEffect:reactExports.useEffect;function i$2({ignoreHistoryMergeTagChange:t=!0,ignoreSelectionChange:r=!1,onChange:i}){const[n]=useLexicalComposerContext();return o$2((()=>{if(i)return n.registerUpdateListener((({editorState:e,dirtyElements:o,dirtyLeaves:a,prevEditorState:s,tags:d})=>{r&&0===o.size&&0===a.size||t&&d.has("history-merge")||s.isEmpty()||i(e,n,d);}))}),[n,t,r,i]),null}

const modProd$6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	OnChangePlugin: i$2
}, Symbol.toStringTag, { value: 'Module' }));

const mod$6 = modProd$6;
const OnChangePlugin = mod$6.OnChangePlugin;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function e(r,t){return e=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,e){return r.__proto__=e,r},e(r,t)}var t={error:null},o$1=function(o){var n,a;function l(){for(var r,e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];return (r=o.call.apply(o,[this].concat(n))||this).state=t,r.resetErrorBoundary=function(){for(var e,t=arguments.length,o=new Array(t),n=0;n<t;n++)o[n]=arguments[n];null==r.props.onReset||(e=r.props).onReset.apply(e,o),r.reset();},r}a=o,(n=l).prototype=Object.create(a.prototype),n.prototype.constructor=n,e(n,a),l.getDerivedStateFromError=function(r){return {error:r}};var s=l.prototype;return s.reset=function(){this.setState(t);},s.componentDidCatch=function(r,e){var t,o;null==(t=(o=this.props).onError)||t.call(o,r,e);},s.componentDidUpdate=function(r,e){var t,o,n,a,l=this.state.error,s=this.props.resetKeys;null!==l&&null!==e.error&&(void 0===(n=r.resetKeys)&&(n=[]),void 0===(a=s)&&(a=[]),n.length!==a.length||n.some((function(r,e){return !Object.is(r,a[e])})))&&(null==(t=(o=this.props).onResetKeysChange)||t.call(o,r.resetKeys,s),this.reset());},s.render=function(){var e=this.state.error,t=this.props,o=t.fallbackRender,n=t.FallbackComponent,a=t.fallback;if(null!==e){var l={error:e,resetErrorBoundary:this.resetErrorBoundary};if(reactExports.isValidElement(a))return a;if("function"==typeof o)return o(l);if(n)return reactExports.createElement(n,l);throw new Error("react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop")}return this.props.children},l}(reactExports.Component);function n({children:e,onError:t}){return reactExports.createElement(o$1,{fallback:reactExports.createElement("div",{style:{border:"1px solid #f00",color:"#f00",padding:"8px"}},"An error was thrown."),onError:t},e)}

const modProd$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: n
}, Symbol.toStringTag, { value: 'Module' }));

const mod$5 = modProd$5;
const LexicalErrorBoundary = mod$5.default;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const o=new Set(["http:","https:","mailto:","sms:","tel:"]);let _$1 = class _ extends ElementNode{static getType(){return "link"}static clone(t){return new _(t.__url,{rel:t.__rel,target:t.__target,title:t.__title},t.__key)}constructor(t,e={},r){super(r);const{target:i=null,rel:n=null,title:l=null}=e;this.__url=t,this.__target=i,this.__rel=n,this.__title=l;}createDOM(e){const r=document.createElement("a");return r.href=this.sanitizeUrl(this.__url),null!==this.__target&&(r.target=this.__target),null!==this.__rel&&(r.rel=this.__rel),null!==this.__title&&(r.title=this.__title),addClassNamesToElement(r,e.theme.link),r}updateDOM(t,e,r){const i=this.__url,n=this.__target,l=this.__rel,s=this.__title;return i!==t.__url&&(e.href=i),n!==t.__target&&(n?e.target=n:e.removeAttribute("target")),l!==t.__rel&&(l?e.rel=l:e.removeAttribute("rel")),s!==t.__title&&(s?e.title=s:e.removeAttribute("title")),!1}static importDOM(){return {a:t=>({conversion:a$2,priority:1})}}static importJSON(t){const e=g$2(t.url,{rel:t.rel,target:t.target,title:t.title});return e.setFormat(t.format),e.setIndent(t.indent),e.setDirection(t.direction),e}sanitizeUrl(t){try{const e=new URL(t);if(!o.has(e.protocol))return "about:blank"}catch(e){return t}return t}exportJSON(){return {...super.exportJSON(),rel:this.getRel(),target:this.getTarget(),title:this.getTitle(),type:"link",url:this.getURL(),version:1}}getURL(){return this.getLatest().__url}setURL(t){this.getWritable().__url=t;}getTarget(){return this.getLatest().__target}setTarget(t){this.getWritable().__target=t;}getRel(){return this.getLatest().__rel}setRel(t){this.getWritable().__rel=t;}getTitle(){return this.getLatest().__title}setTitle(t){this.getWritable().__title=t;}insertNewAfter(t,e=!0){const r=g$2(this.__url,{rel:this.__rel,target:this.__target,title:this.__title});return this.insertAfter(r,e),r}canInsertTextBefore(){return !1}canInsertTextAfter(){return !1}canBeEmpty(){return !1}isInline(){return !0}extractWithChild(t,e,r){if(!$isRangeSelection(e))return !1;const i=e.anchor.getNode(),n=e.focus.getNode();return this.isParentOf(i)&&this.isParentOf(n)&&e.getTextContent().length>0}};function a$2(t){let r=null;if(isHTMLAnchorElement(t)){const e=t.textContent;(null!==e&&""!==e||t.children.length>0)&&(r=g$2(t.getAttribute("href")||"",{rel:t.getAttribute("rel"),target:t.getAttribute("target"),title:t.getAttribute("title")}));}return {node:r}}function g$2(t,e){return $applyNodeReplacement(new _$1(t,e))}function c$2(t){return t instanceof _$1}class h extends _$1{static getType(){return "autolink"}static clone(t){return new h(t.__url,{rel:t.__rel,target:t.__target,title:t.__title},t.__key)}static importJSON(t){const e=f$1(t.url,{rel:t.rel,target:t.target,title:t.title});return e.setFormat(t.format),e.setIndent(t.indent),e.setDirection(t.direction),e}static importDOM(){return null}exportJSON(){return {...super.exportJSON(),type:"autolink",version:1}}insertNewAfter(t,e=!0){const r=this.getParentOrThrow().insertNewAfter(t,e);if($isElementNode(r)){const t=f$1(this.__url,{rel:this.__rel,target:this.__target,title:this.__title});return r.append(t),t}return null}}function f$1(t,e){return $applyNodeReplacement(new h(t,e))}function p(t){return t instanceof h}const d=createCommand("TOGGLE_LINK_COMMAND");function m(t,e={}){const{target:r,title:i}=e,n=void 0===e.rel?"noreferrer":e.rel,o=$getSelection();if(!$isRangeSelection(o))return;const _=o.extract();if(null===t)_.forEach((t=>{const e=t.getParent();if(c$2(e)){const t=e.getChildren();for(let r=0;r<t.length;r++)e.insertBefore(t[r]);e.remove();}}));else {if(1===_.length){const e=function(t,e){let r=t;for(;null!==r&&null!==r.getParent()&&!e(r);)r=r.getParentOrThrow();return e(r)?r:null}(_[0],c$2);if(null!==e)return e.setURL(t),void 0!==r&&e.setTarget(r),null!==n&&e.setRel(n),void(void 0!==i&&e.setTitle(i))}let e=null,l=null;_.forEach((u=>{const o=u.getParent();if(o!==l&&null!==o&&(!$isElementNode(u)||u.isInline())){if(c$2(o))return l=o,o.setURL(t),void 0!==r&&o.setTarget(r),null!==n&&l.setRel(n),void(void 0!==i&&l.setTitle(i));if(o.is(e)||(e=o,l=g$2(t,{rel:n,target:r,title:i}),c$2(o)?null===u.getPreviousSibling()?o.insertBefore(l):o.insertAfter(l):u.insertBefore(l)),c$2(u)){if(u.is(l))return;if(null!==l){const t=u.getChildren();for(let e=0;e<t.length;e++)l.append(t[e]);}u.remove();}else null!==l&&l.append(u);}}));}}

const modProd$4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$createAutoLinkNode: f$1,
	$createLinkNode: g$2,
	$isAutoLinkNode: p,
	$isLinkNode: c$2,
	AutoLinkNode: h,
	LinkNode: _$1,
	TOGGLE_LINK_COMMAND: d,
	toggleLink: m
}, Symbol.toStringTag, { value: 'Module' }));

const mod$4 = modProd$4;
const $createAutoLinkNode = mod$4.$createAutoLinkNode;
const $isAutoLinkNode = mod$4.$isAutoLinkNode;
const $isLinkNode = mod$4.$isLinkNode;
const AutoLinkNode = mod$4.AutoLinkNode;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function s$1(n,r){let i=n.getFirstChild(),o=0;t:for(;null!==i;){if($isElementNode(i)){const t=i.getFirstChild();if(null!==t){i=t;continue}}else if($isTextNode(i)){const t=i.getTextContentSize();if(o+t>r)return {node:i,offset:r-o};o+=t;}const n=i.getNextSibling();if(null!==n){i=n;continue}let l=i.getParent();for(;null!==l;){const t=l.getNextSibling();if(null!==t){i=t;continue t}l=l.getParent();}break}return null}function u$1(t,e=!0){if(t)return !1;let n=c$1();return e&&(n=n.trim()),""===n}function f(t,e){return ()=>u$1(t,e)}function c$1(){return $getRoot().getTextContent()}function g$1(o){if(!u$1(o,!1))return !1;const l=$getRoot().getChildren(),s=l.length;if(s>1)return !1;for(let n=0;n<s;n++){const o=l[n];if($isDecoratorNode(o))return !1;if($isElementNode(o)){if(!$isParagraphNode(o))return !1;if(0!==o.__indent)return !1;const t=o.getChildren(),r=t.length;for(let i=0;i<r;i++){const r=t[n];if(!$isTextNode(r))return !1}}}return !0}function x(t){return ()=>g$1(t)}function a$1(t,n,r,i){const s=t=>t instanceof r,u=t=>{const e=$createTextNode(t.getTextContent());e.setFormat(t.getFormat()),t.replace(e);};return [t.registerNodeTransform(TextNode,(t=>{if(!t.isSimpleText())return;const r=t.getPreviousSibling();let o,l=t.getTextContent(),f=t;if($isTextNode(r)){const e=r.getTextContent(),i=n(e+l);if(s(r)){if(null===i||0!==(t=>t.getLatest().__mode)(r))return void u(r);{const n=i.end-e.length;if(n>0){const i=e+l.slice(0,n);if(r.select(),r.setTextContent(i),n===l.length)t.remove();else {const e=l.slice(n);t.setTextContent(e);}return}}}else if(null===i||i.start<e.length)return}for(;;){o=n(l);let t,c=null===o?"":l.slice(o.end);if(l=c,""===c){const t=f.getNextSibling();if($isTextNode(t)){c=f.getTextContent()+t.getTextContent();const e=n(c);if(null===e)return void(s(t)?u(t):t.markDirty());if(0!==e.start)return}}else {const t=n(c);if(null!==t&&0===t.start)return}if(null===o)return;if(0===o.start&&$isTextNode(r)&&r.isTextEntity())continue;0===o.start?[t,f]=f.splitText(o.end):[,t,f]=f.splitText(o.start,o.end);const g=i(t);if(g.setFormat(t.getFormat()),t.replace(g),null==f)return}})),t.registerNodeTransform(r,(t=>{const r=t.getTextContent(),i=n(r);if(null===i||0!==i.start)return void u(t);if(r.length>i.end)return void t.splitText(i.end);const o=t.getPreviousSibling();$isTextNode(o)&&o.isTextEntity()&&(u(o),u(t));const l=t.getNextSibling();$isTextNode(l)&&l.isTextEntity()&&(u(l),s(t)&&u(t));}))]}

const modProd$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$canShowPlaceholder: g$1,
	$canShowPlaceholderCurry: x,
	$findTextIntersectionFromCharacters: s$1,
	$isRootTextContentEmpty: u$1,
	$isRootTextContentEmptyCurry: f,
	$rootTextContent: c$1,
	registerLexicalTextEntity: a$1
}, Symbol.toStringTag, { value: 'Module' }));

const mod$3 = modProd$3;
const registerLexicalTextEntity = mod$3.registerLexicalTextEntity;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function i$1(i,m,c){const[l]=useLexicalComposerContext();reactExports.useEffect((()=>mergeRegister(...registerLexicalTextEntity(l,i,m,c))),[c,l,i,m]);}

const modProd$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	useLexicalTextEntity: i$1
}, Symbol.toStringTag, { value: 'Module' }));

const mod$2 = modProd$2;
const useLexicalTextEntity = mod$2.useLexicalTextEntity;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function i(e,n){const t=n.body?n.body.childNodes:[];let l=[];for(let n=0;n<t.length;n++){const o=t[n];if(!u.has(o.nodeName)){const n=a(o,e);null!==n&&(l=l.concat(n));}}return l}function c(e,n){if("undefined"==typeof document||"undefined"==typeof window&&void 0===global.window)throw new Error("To use $generateHtmlFromNodes in headless mode please initialize a headless browser implementation such as JSDom before calling this function.");const t=document.createElement("div"),o=$getRoot().getChildren();for(let l=0;l<o.length;l++){s(e,o[l],t,n);}return t.innerHTML}function s(l,i,c,u=null){let a=null===u||i.isSelected(u);const d=$isElementNode(i)&&i.excludeFromCopy("html");let f=i;if(null!==u){let t=$cloneWithProperties(i);t=$isTextNode(t)&&null!==u?$sliceSelectedTextNodeContent(u,t):t,f=t;}const p=$isElementNode(f)?f.getChildren():[],m=l._nodes.get(f.getType());let h;h=m&&void 0!==m.exportDOM?m.exportDOM(l,f):f.exportDOM(l);const{element:g,after:y}=h;if(!g)return !1;const w=document.createDocumentFragment();for(let e=0;e<p.length;e++){const n=p[e],t=s(l,n,w,u);!a&&$isElementNode(i)&&t&&i.extractWithChild(n,u,"html")&&(a=!0);}if(a&&!d){if(isHTMLElement(g)&&g.append(w),c.append(g),y){const e=y.call(f,g);e&&g.replaceWith(e);}}else c.append(w);return a}const u=new Set(["STYLE","SCRIPT"]);function a(e,n,t=new Map,l){let r=[];if(u.has(e.nodeName))return r;let i=null;const c=function(e,n){const{nodeName:t}=e,l=n._htmlConversions.get(t.toLowerCase());let o=null;if(void 0!==l)for(const n of l){const t=n(e);null!==t&&(null===o||(o.priority||0)<(t.priority||0))&&(o=t);}return null!==o?o.conversion:null}(e,n),s=c?c(e):null;let d=null;if(null!==s){d=s.after;const n=s.node;if(i=Array.isArray(n)?n[n.length-1]:n,null!==i){for(const[,e]of t)if(i=e(i,l),!i)break;i&&r.push(...Array.isArray(n)?n:[i]);}null!=s.forChild&&t.set(e.nodeName,s.forChild);}const f=e.childNodes;let p=[];for(let e=0;e<f.length;e++)p.push(...a(f[e],n,new Map(t),i));return null!=d&&(p=d(p)),null==i?r=r.concat(p):$isElementNode(i)&&i.append(...p),r}

const modProd$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$generateHtmlFromNodes: c,
	$generateNodesFromDOM: i
}, Symbol.toStringTag, { value: 'Module' }));

const mod$1 = modProd$1;
const $generateHtmlFromNodes = mod$1.$generateHtmlFromNodes;
const $generateNodesFromDOM = mod$1.$generateNodesFromDOM;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var g=function(e){const t=new URLSearchParams;t.append("code",e);for(let e=1;e<arguments.length;e++)t.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${t} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)};const w="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement,y=e=>w?(e||window).getSelection():null;function v(t){const n=$getSelection();if(null==n)throw Error("Expected valid LexicalSelection");return $isRangeSelection(n)&&n.isCollapsed()||0===n.getNodes().length?"":$generateHtmlFromNodes(t,n)}function D(e){const t=$getSelection();if(null==t)throw Error("Expected valid LexicalSelection");return $isRangeSelection(t)&&t.isCollapsed()||0===t.getNodes().length?null:JSON.stringify(T(e,t))}function C(e,t){const n=e.getData("text/plain")||e.getData("text/uri-list");null!=n&&t.insertRawText(n);}function E(e,n,o){const l=e.getData("application/x-lexical-editor");if(l)try{const e=JSON.parse(l);if(e.namespace===o._config.namespace&&Array.isArray(e.nodes)){return N(o,_(e.nodes),n)}}catch(e){}const r=e.getData("text/html");if(r)try{const e=(new DOMParser).parseFromString(r,"text/html");return N(o,$generateNodesFromDOM(o,e),n)}catch(e){}const i=e.getData("text/plain")||e.getData("text/uri-list");if(null!=i)if($isRangeSelection(n)){const e=i.split(/(\r?\n|\t)/);""===e[e.length-1]&&e.pop();for(let t=0;t<e.length;t++){const o=e[t];"\n"===o||"\r\n"===o?n.insertParagraph():"\t"===o?n.insertNodes([$createTabNode()]):n.insertText(o);}}else n.insertRawText(i);}function N(e,t,n){e.dispatchCommand(SELECTION_INSERT_CLIPBOARD_NODES_COMMAND,{nodes:t,selection:n})||n.insertNodes(t);}function S(e,t,n,r=[]){let i=null===t||n.isSelected(t);const a=$isElementNode(n)&&n.excludeFromCopy("html");let c=n;if(null!==t){let e=$cloneWithProperties(n);e=$isTextNode(e)&&null!==t?$sliceSelectedTextNodeContent(t,e):e,c=e;}const s=$isElementNode(c)?c.getChildren():[],u=function(e){const t=e.exportJSON(),n=e.constructor;if(t.type!==n.getType()&&g(58,n.name),$isElementNode(e)){const e=t.children;Array.isArray(e)||g(59,n.name);}return t}(c);if($isTextNode(c)){const e=c.__text;e.length>0?u.text=e:i=!1;}for(let o=0;o<s.length;o++){const l=s[o],r=S(e,t,l,u.children);!i&&$isElementNode(n)&&r&&n.extractWithChild(l,t,"clone")&&(i=!0);}if(i&&!a)r.push(u);else if(Array.isArray(u.children))for(let e=0;e<u.children.length;e++){const t=u.children[e];r.push(t);}return i}function T(e,t){const n=[],o=$getRoot().getChildren();for(let l=0;l<o.length;l++){S(e,t,o[l],n);}return {namespace:e._config.namespace,nodes:n}}function _(e){const t=[];for(let o=0;o<e.length;o++){const l=e[o],r=$parseSerializedNode(l);$isTextNode(r)&&$addNodeStyle(r),t.push(r);}return t}let A=null;async function R(e,t){if(null!==A)return !1;if(null!==t)return new Promise(((n,o)=>{e.update((()=>{n(P(e,t));}));}));const n=e.getRootElement(),o=null==e._window?window.document:e._window.document,l=y(e._window);if(null===n||null===l)return !1;const i=o.createElement("span");i.style.cssText="position: fixed; top: -1000px;",i.append(o.createTextNode("#")),n.append(i);const a=new Range;return a.setStart(i,0),a.setEnd(i,1),l.removeAllRanges(),l.addRange(a),new Promise(((t,n)=>{const l=e.registerCommand(COPY_COMMAND,(n=>(objectKlassEquals(n,ClipboardEvent)&&(l(),null!==A&&(window.clearTimeout(A),A=null),t(P(e,n))),!0)),COMMAND_PRIORITY_CRITICAL);A=window.setTimeout((()=>{l(),A=null,t(!1);}),50),o.execCommand("copy"),i.remove();}))}function P(e,t){const n=y(e._window);if(!n)return !1;const o=n.anchorNode,l=n.focusNode;if(null!==o&&null!==l&&!isSelectionWithinEditor(e,o,l))return !1;t.preventDefault();const r=t.clipboardData,a=$getSelection();if(null===r||null===a)return !1;const c=v(e),s=D(e);let u="";return null!==a&&(u=a.getTextContent()),null!==c&&r.setData("text/html",c),null!==s&&r.setData("application/x-lexical-editor",s),r.setData("text/plain",u),!0}

const modProd = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$generateJSONFromSelectedNodes: T,
	$generateNodesFromSerializedNodes: _,
	$getHtmlContent: v,
	$getLexicalContent: D,
	$insertDataTransferForPlainText: C,
	$insertDataTransferForRichText: E,
	$insertGeneratedNodes: N,
	copyToClipboard: R
}, Symbol.toStringTag, { value: 'Module' }));

const mod = modProd;
const $insertDataTransferForPlainText = mod.$insertDataTransferForPlainText;

export { $applyNodeReplacement as $, AutoLinkNode as A, REMOVE_TEXT_COMMAND as B, COMMAND_PRIORITY_EDITOR as C, DecoratorNode as D, $selectAll as E, INSERT_PARAGRAPH_COMMAND as F, $shouldOverrideDefaultCharacterSelection as G, $moveCharacter as H, INSERT_LINE_BREAK_COMMAND as I, KEY_ARROW_RIGHT_COMMAND as J, KEY_ARROW_LEFT_COMMAND as K, KEY_BACKSPACE_COMMAND as L, KEY_DELETE_COMMAND as M, KEY_ENTER_COMMAND as N, COPY_COMMAND as O, ParagraphNode as P, CUT_COMMAND as Q, React as R, SELECT_ALL_COMMAND as S, TextNode as T, PASTE_COMMAND as U, DROP_COMMAND as V, DRAGSTART_COMMAND as W, reactDomExports as X, RootNode as Y, $setCompositionKey as Z, LineBreakNode as _, useLocation as a, $isRootNode as a0, $getRoot as a1, CLEAR_HISTORY_COMMAND as a2, LexicalComposer as a3, ContentEditable as a4, LexicalErrorBoundary as a5, OnChangePlugin as a6, HistoryPlugin as a7, NodeEventPlugin as a8, Link as a9, useParams as aa, useSearchParams as ab, createBrowserRouter as ac, Navigate as ad, RouterProvider as ae, createRoot as af, addClassNamesToElement as b, useLexicalComposerContext as c, $isAutoLinkNode as d, $isLinkNode as e, $createAutoLinkNode as f, get as g, $createTextNode as h, $isTextNode as i, jsxRuntimeExports as j, $isElementNode as k, $isLineBreakNode as l, mergeRegister as m, $getSelection as n, $isRangeSelection as o, useLexicalTextEntity as p, $createParagraphNode as q, reactExports as r, set as s, $isParagraphNode as t, useNavigate as u, DELETE_CHARACTER_COMMAND as v, DELETE_WORD_COMMAND as w, DELETE_LINE_COMMAND as x, CONTROLLED_TEXT_INSERTION_COMMAND as y, $insertDataTransferForPlainText as z };
