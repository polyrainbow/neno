var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			var isInstance = false;
      try {
        isInstance = this instanceof a;
      } catch {}
			if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var buffer = {};

var base64Js = {};

var hasRequiredBase64Js;

function requireBase64Js () {
	if (hasRequiredBase64Js) return base64Js;
	hasRequiredBase64Js = 1;

	base64Js.byteLength = byteLength;
	base64Js.toByteArray = toByteArray;
	base64Js.fromByteArray = fromByteArray;

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i];
	  revLookup[code.charCodeAt(i)] = i;
	}

	// Support decoding URL-safe base64 strings, as Node.js does.
	// See: https://en.wikipedia.org/wiki/Base64#URL_applications
	revLookup['-'.charCodeAt(0)] = 62;
	revLookup['_'.charCodeAt(0)] = 63;

	function getLens (b64) {
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // Trim off extra bytes after placeholder bytes are found
	  // See: https://github.com/beatgammit/base64-js/issues/42
	  var validLen = b64.indexOf('=');
	  if (validLen === -1) validLen = len;

	  var placeHoldersLen = validLen === len
	    ? 0
	    : 4 - (validLen % 4);

	  return [validLen, placeHoldersLen]
	}

	// base64 is 4/3 + up to two characters of the original data
	function byteLength (b64) {
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}

	function _byteLength (b64, validLen, placeHoldersLen) {
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}

	function toByteArray (b64) {
	  var tmp;
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];

	  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

	  var curByte = 0;

	  // if there are placeholders, only get up to the last complete 4 chars
	  var len = placeHoldersLen > 0
	    ? validLen - 4
	    : validLen;

	  var i;
	  for (i = 0; i < len; i += 4) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 18) |
	      (revLookup[b64.charCodeAt(i + 1)] << 12) |
	      (revLookup[b64.charCodeAt(i + 2)] << 6) |
	      revLookup[b64.charCodeAt(i + 3)];
	    arr[curByte++] = (tmp >> 16) & 0xFF;
	    arr[curByte++] = (tmp >> 8) & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 2) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 2) |
	      (revLookup[b64.charCodeAt(i + 1)] >> 4);
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 1) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 10) |
	      (revLookup[b64.charCodeAt(i + 1)] << 4) |
	      (revLookup[b64.charCodeAt(i + 2)] >> 2);
	    arr[curByte++] = (tmp >> 8) & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] +
	    lookup[num >> 12 & 0x3F] +
	    lookup[num >> 6 & 0x3F] +
	    lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp =
	      ((uint8[i] << 16) & 0xFF0000) +
	      ((uint8[i + 1] << 8) & 0xFF00) +
	      (uint8[i + 2] & 0xFF);
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    parts.push(
	      lookup[tmp >> 2] +
	      lookup[(tmp << 4) & 0x3F] +
	      '=='
	    );
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
	    parts.push(
	      lookup[tmp >> 10] +
	      lookup[(tmp >> 4) & 0x3F] +
	      lookup[(tmp << 2) & 0x3F] +
	      '='
	    );
	  }

	  return parts.join('')
	}
	return base64Js;
}

var ieee754 = {};

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */

var hasRequiredIeee754;

function requireIeee754 () {
	if (hasRequiredIeee754) return ieee754;
	hasRequiredIeee754 = 1;
	ieee754.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = (nBytes * 8) - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	};

	ieee754.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = (nBytes * 8) - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = ((value * c) - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	};
	return ieee754;
}

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

var hasRequiredBuffer;

function requireBuffer () {
	if (hasRequiredBuffer) return buffer;
	hasRequiredBuffer = 1;
	(function (exports$1) {

		const base64 = requireBase64Js();
		const ieee754 = requireIeee754();
		const customInspectSymbol =
		  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
		    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
		    : null;

		exports$1.Buffer = Buffer;
		exports$1.SlowBuffer = SlowBuffer;
		exports$1.INSPECT_MAX_BYTES = 50;

		const K_MAX_LENGTH = 0x7fffffff;
		exports$1.kMaxLength = K_MAX_LENGTH;

		/**
		 * If `Buffer.TYPED_ARRAY_SUPPORT`:
		 *   === true    Use Uint8Array implementation (fastest)
		 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
		 *               implementation (most compatible, even IE6)
		 *
		 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
		 * Opera 11.6+, iOS 4.2+.
		 *
		 * We report that the browser does not support typed arrays if the are not subclassable
		 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
		 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
		 * for __proto__ and has a buggy typed array implementation.
		 */
		Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

		if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
		    typeof console.error === 'function') {
		  console.error(
		    'This browser lacks typed array (Uint8Array) support which is required by ' +
		    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
		  );
		}

		function typedArraySupport () {
		  // Can typed array instances can be augmented?
		  try {
		    const arr = new Uint8Array(1);
		    const proto = { foo: function () { return 42 } };
		    Object.setPrototypeOf(proto, Uint8Array.prototype);
		    Object.setPrototypeOf(arr, proto);
		    return arr.foo() === 42
		  } catch (e) {
		    return false
		  }
		}

		Object.defineProperty(Buffer.prototype, 'parent', {
		  enumerable: true,
		  get: function () {
		    if (!Buffer.isBuffer(this)) return undefined
		    return this.buffer
		  }
		});

		Object.defineProperty(Buffer.prototype, 'offset', {
		  enumerable: true,
		  get: function () {
		    if (!Buffer.isBuffer(this)) return undefined
		    return this.byteOffset
		  }
		});

		function createBuffer (length) {
		  if (length > K_MAX_LENGTH) {
		    throw new RangeError('The value "' + length + '" is invalid for option "size"')
		  }
		  // Return an augmented `Uint8Array` instance
		  const buf = new Uint8Array(length);
		  Object.setPrototypeOf(buf, Buffer.prototype);
		  return buf
		}

		/**
		 * The Buffer constructor returns instances of `Uint8Array` that have their
		 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
		 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
		 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
		 * returns a single octet.
		 *
		 * The `Uint8Array` prototype remains unmodified.
		 */

		function Buffer (arg, encodingOrOffset, length) {
		  // Common case.
		  if (typeof arg === 'number') {
		    if (typeof encodingOrOffset === 'string') {
		      throw new TypeError(
		        'The "string" argument must be of type string. Received type number'
		      )
		    }
		    return allocUnsafe(arg)
		  }
		  return from(arg, encodingOrOffset, length)
		}

		Buffer.poolSize = 8192; // not used by this implementation

		function from (value, encodingOrOffset, length) {
		  if (typeof value === 'string') {
		    return fromString(value, encodingOrOffset)
		  }

		  if (ArrayBuffer.isView(value)) {
		    return fromArrayView(value)
		  }

		  if (value == null) {
		    throw new TypeError(
		      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
		      'or Array-like Object. Received type ' + (typeof value)
		    )
		  }

		  if (isInstance(value, ArrayBuffer) ||
		      (value && isInstance(value.buffer, ArrayBuffer))) {
		    return fromArrayBuffer(value, encodingOrOffset, length)
		  }

		  if (typeof SharedArrayBuffer !== 'undefined' &&
		      (isInstance(value, SharedArrayBuffer) ||
		      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
		    return fromArrayBuffer(value, encodingOrOffset, length)
		  }

		  if (typeof value === 'number') {
		    throw new TypeError(
		      'The "value" argument must not be of type number. Received type number'
		    )
		  }

		  const valueOf = value.valueOf && value.valueOf();
		  if (valueOf != null && valueOf !== value) {
		    return Buffer.from(valueOf, encodingOrOffset, length)
		  }

		  const b = fromObject(value);
		  if (b) return b

		  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
		      typeof value[Symbol.toPrimitive] === 'function') {
		    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
		  }

		  throw new TypeError(
		    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
		    'or Array-like Object. Received type ' + (typeof value)
		  )
		}

		/**
		 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
		 * if value is a number.
		 * Buffer.from(str[, encoding])
		 * Buffer.from(array)
		 * Buffer.from(buffer)
		 * Buffer.from(arrayBuffer[, byteOffset[, length]])
		 **/
		Buffer.from = function (value, encodingOrOffset, length) {
		  return from(value, encodingOrOffset, length)
		};

		// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
		// https://github.com/feross/buffer/pull/148
		Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
		Object.setPrototypeOf(Buffer, Uint8Array);

		function assertSize (size) {
		  if (typeof size !== 'number') {
		    throw new TypeError('"size" argument must be of type number')
		  } else if (size < 0) {
		    throw new RangeError('The value "' + size + '" is invalid for option "size"')
		  }
		}

		function alloc (size, fill, encoding) {
		  assertSize(size);
		  if (size <= 0) {
		    return createBuffer(size)
		  }
		  if (fill !== undefined) {
		    // Only pay attention to encoding if it's a string. This
		    // prevents accidentally sending in a number that would
		    // be interpreted as a start offset.
		    return typeof encoding === 'string'
		      ? createBuffer(size).fill(fill, encoding)
		      : createBuffer(size).fill(fill)
		  }
		  return createBuffer(size)
		}

		/**
		 * Creates a new filled Buffer instance.
		 * alloc(size[, fill[, encoding]])
		 **/
		Buffer.alloc = function (size, fill, encoding) {
		  return alloc(size, fill, encoding)
		};

		function allocUnsafe (size) {
		  assertSize(size);
		  return createBuffer(size < 0 ? 0 : checked(size) | 0)
		}

		/**
		 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
		 * */
		Buffer.allocUnsafe = function (size) {
		  return allocUnsafe(size)
		};
		/**
		 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
		 */
		Buffer.allocUnsafeSlow = function (size) {
		  return allocUnsafe(size)
		};

		function fromString (string, encoding) {
		  if (typeof encoding !== 'string' || encoding === '') {
		    encoding = 'utf8';
		  }

		  if (!Buffer.isEncoding(encoding)) {
		    throw new TypeError('Unknown encoding: ' + encoding)
		  }

		  const length = byteLength(string, encoding) | 0;
		  let buf = createBuffer(length);

		  const actual = buf.write(string, encoding);

		  if (actual !== length) {
		    // Writing a hex string, for example, that contains invalid characters will
		    // cause everything after the first invalid character to be ignored. (e.g.
		    // 'abxxcd' will be treated as 'ab')
		    buf = buf.slice(0, actual);
		  }

		  return buf
		}

		function fromArrayLike (array) {
		  const length = array.length < 0 ? 0 : checked(array.length) | 0;
		  const buf = createBuffer(length);
		  for (let i = 0; i < length; i += 1) {
		    buf[i] = array[i] & 255;
		  }
		  return buf
		}

		function fromArrayView (arrayView) {
		  if (isInstance(arrayView, Uint8Array)) {
		    const copy = new Uint8Array(arrayView);
		    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
		  }
		  return fromArrayLike(arrayView)
		}

		function fromArrayBuffer (array, byteOffset, length) {
		  if (byteOffset < 0 || array.byteLength < byteOffset) {
		    throw new RangeError('"offset" is outside of buffer bounds')
		  }

		  if (array.byteLength < byteOffset + (length || 0)) {
		    throw new RangeError('"length" is outside of buffer bounds')
		  }

		  let buf;
		  if (byteOffset === undefined && length === undefined) {
		    buf = new Uint8Array(array);
		  } else if (length === undefined) {
		    buf = new Uint8Array(array, byteOffset);
		  } else {
		    buf = new Uint8Array(array, byteOffset, length);
		  }

		  // Return an augmented `Uint8Array` instance
		  Object.setPrototypeOf(buf, Buffer.prototype);

		  return buf
		}

		function fromObject (obj) {
		  if (Buffer.isBuffer(obj)) {
		    const len = checked(obj.length) | 0;
		    const buf = createBuffer(len);

		    if (buf.length === 0) {
		      return buf
		    }

		    obj.copy(buf, 0, 0, len);
		    return buf
		  }

		  if (obj.length !== undefined) {
		    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
		      return createBuffer(0)
		    }
		    return fromArrayLike(obj)
		  }

		  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
		    return fromArrayLike(obj.data)
		  }
		}

		function checked (length) {
		  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
		  // length is NaN (which is otherwise coerced to zero.)
		  if (length >= K_MAX_LENGTH) {
		    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
		                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
		  }
		  return length | 0
		}

		function SlowBuffer (length) {
		  if (+length != length) { // eslint-disable-line eqeqeq
		    length = 0;
		  }
		  return Buffer.alloc(+length)
		}

		Buffer.isBuffer = function isBuffer (b) {
		  return b != null && b._isBuffer === true &&
		    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
		};

		Buffer.compare = function compare (a, b) {
		  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
		  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
		  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
		    throw new TypeError(
		      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
		    )
		  }

		  if (a === b) return 0

		  let x = a.length;
		  let y = b.length;

		  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
		    if (a[i] !== b[i]) {
		      x = a[i];
		      y = b[i];
		      break
		    }
		  }

		  if (x < y) return -1
		  if (y < x) return 1
		  return 0
		};

		Buffer.isEncoding = function isEncoding (encoding) {
		  switch (String(encoding).toLowerCase()) {
		    case 'hex':
		    case 'utf8':
		    case 'utf-8':
		    case 'ascii':
		    case 'latin1':
		    case 'binary':
		    case 'base64':
		    case 'ucs2':
		    case 'ucs-2':
		    case 'utf16le':
		    case 'utf-16le':
		      return true
		    default:
		      return false
		  }
		};

		Buffer.concat = function concat (list, length) {
		  if (!Array.isArray(list)) {
		    throw new TypeError('"list" argument must be an Array of Buffers')
		  }

		  if (list.length === 0) {
		    return Buffer.alloc(0)
		  }

		  let i;
		  if (length === undefined) {
		    length = 0;
		    for (i = 0; i < list.length; ++i) {
		      length += list[i].length;
		    }
		  }

		  const buffer = Buffer.allocUnsafe(length);
		  let pos = 0;
		  for (i = 0; i < list.length; ++i) {
		    let buf = list[i];
		    if (isInstance(buf, Uint8Array)) {
		      if (pos + buf.length > buffer.length) {
		        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
		        buf.copy(buffer, pos);
		      } else {
		        Uint8Array.prototype.set.call(
		          buffer,
		          buf,
		          pos
		        );
		      }
		    } else if (!Buffer.isBuffer(buf)) {
		      throw new TypeError('"list" argument must be an Array of Buffers')
		    } else {
		      buf.copy(buffer, pos);
		    }
		    pos += buf.length;
		  }
		  return buffer
		};

		function byteLength (string, encoding) {
		  if (Buffer.isBuffer(string)) {
		    return string.length
		  }
		  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
		    return string.byteLength
		  }
		  if (typeof string !== 'string') {
		    throw new TypeError(
		      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
		      'Received type ' + typeof string
		    )
		  }

		  const len = string.length;
		  const mustMatch = (arguments.length > 2 && arguments[2] === true);
		  if (!mustMatch && len === 0) return 0

		  // Use a for loop to avoid recursion
		  let loweredCase = false;
		  for (;;) {
		    switch (encoding) {
		      case 'ascii':
		      case 'latin1':
		      case 'binary':
		        return len
		      case 'utf8':
		      case 'utf-8':
		        return utf8ToBytes(string).length
		      case 'ucs2':
		      case 'ucs-2':
		      case 'utf16le':
		      case 'utf-16le':
		        return len * 2
		      case 'hex':
		        return len >>> 1
		      case 'base64':
		        return base64ToBytes(string).length
		      default:
		        if (loweredCase) {
		          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
		        }
		        encoding = ('' + encoding).toLowerCase();
		        loweredCase = true;
		    }
		  }
		}
		Buffer.byteLength = byteLength;

		function slowToString (encoding, start, end) {
		  let loweredCase = false;

		  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
		  // property of a typed array.

		  // This behaves neither like String nor Uint8Array in that we set start/end
		  // to their upper/lower bounds if the value passed is out of range.
		  // undefined is handled specially as per ECMA-262 6th Edition,
		  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
		  if (start === undefined || start < 0) {
		    start = 0;
		  }
		  // Return early if start > this.length. Done here to prevent potential uint32
		  // coercion fail below.
		  if (start > this.length) {
		    return ''
		  }

		  if (end === undefined || end > this.length) {
		    end = this.length;
		  }

		  if (end <= 0) {
		    return ''
		  }

		  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
		  end >>>= 0;
		  start >>>= 0;

		  if (end <= start) {
		    return ''
		  }

		  if (!encoding) encoding = 'utf8';

		  while (true) {
		    switch (encoding) {
		      case 'hex':
		        return hexSlice(this, start, end)

		      case 'utf8':
		      case 'utf-8':
		        return utf8Slice(this, start, end)

		      case 'ascii':
		        return asciiSlice(this, start, end)

		      case 'latin1':
		      case 'binary':
		        return latin1Slice(this, start, end)

		      case 'base64':
		        return base64Slice(this, start, end)

		      case 'ucs2':
		      case 'ucs-2':
		      case 'utf16le':
		      case 'utf-16le':
		        return utf16leSlice(this, start, end)

		      default:
		        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
		        encoding = (encoding + '').toLowerCase();
		        loweredCase = true;
		    }
		  }
		}

		// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
		// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
		// reliably in a browserify context because there could be multiple different
		// copies of the 'buffer' package in use. This method works even for Buffer
		// instances that were created from another copy of the `buffer` package.
		// See: https://github.com/feross/buffer/issues/154
		Buffer.prototype._isBuffer = true;

		function swap (b, n, m) {
		  const i = b[n];
		  b[n] = b[m];
		  b[m] = i;
		}

		Buffer.prototype.swap16 = function swap16 () {
		  const len = this.length;
		  if (len % 2 !== 0) {
		    throw new RangeError('Buffer size must be a multiple of 16-bits')
		  }
		  for (let i = 0; i < len; i += 2) {
		    swap(this, i, i + 1);
		  }
		  return this
		};

		Buffer.prototype.swap32 = function swap32 () {
		  const len = this.length;
		  if (len % 4 !== 0) {
		    throw new RangeError('Buffer size must be a multiple of 32-bits')
		  }
		  for (let i = 0; i < len; i += 4) {
		    swap(this, i, i + 3);
		    swap(this, i + 1, i + 2);
		  }
		  return this
		};

		Buffer.prototype.swap64 = function swap64 () {
		  const len = this.length;
		  if (len % 8 !== 0) {
		    throw new RangeError('Buffer size must be a multiple of 64-bits')
		  }
		  for (let i = 0; i < len; i += 8) {
		    swap(this, i, i + 7);
		    swap(this, i + 1, i + 6);
		    swap(this, i + 2, i + 5);
		    swap(this, i + 3, i + 4);
		  }
		  return this
		};

		Buffer.prototype.toString = function toString () {
		  const length = this.length;
		  if (length === 0) return ''
		  if (arguments.length === 0) return utf8Slice(this, 0, length)
		  return slowToString.apply(this, arguments)
		};

		Buffer.prototype.toLocaleString = Buffer.prototype.toString;

		Buffer.prototype.equals = function equals (b) {
		  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
		  if (this === b) return true
		  return Buffer.compare(this, b) === 0
		};

		Buffer.prototype.inspect = function inspect () {
		  let str = '';
		  const max = exports$1.INSPECT_MAX_BYTES;
		  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
		  if (this.length > max) str += ' ... ';
		  return '<Buffer ' + str + '>'
		};
		if (customInspectSymbol) {
		  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
		}

		Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
		  if (isInstance(target, Uint8Array)) {
		    target = Buffer.from(target, target.offset, target.byteLength);
		  }
		  if (!Buffer.isBuffer(target)) {
		    throw new TypeError(
		      'The "target" argument must be one of type Buffer or Uint8Array. ' +
		      'Received type ' + (typeof target)
		    )
		  }

		  if (start === undefined) {
		    start = 0;
		  }
		  if (end === undefined) {
		    end = target ? target.length : 0;
		  }
		  if (thisStart === undefined) {
		    thisStart = 0;
		  }
		  if (thisEnd === undefined) {
		    thisEnd = this.length;
		  }

		  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
		    throw new RangeError('out of range index')
		  }

		  if (thisStart >= thisEnd && start >= end) {
		    return 0
		  }
		  if (thisStart >= thisEnd) {
		    return -1
		  }
		  if (start >= end) {
		    return 1
		  }

		  start >>>= 0;
		  end >>>= 0;
		  thisStart >>>= 0;
		  thisEnd >>>= 0;

		  if (this === target) return 0

		  let x = thisEnd - thisStart;
		  let y = end - start;
		  const len = Math.min(x, y);

		  const thisCopy = this.slice(thisStart, thisEnd);
		  const targetCopy = target.slice(start, end);

		  for (let i = 0; i < len; ++i) {
		    if (thisCopy[i] !== targetCopy[i]) {
		      x = thisCopy[i];
		      y = targetCopy[i];
		      break
		    }
		  }

		  if (x < y) return -1
		  if (y < x) return 1
		  return 0
		};

		// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
		// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
		//
		// Arguments:
		// - buffer - a Buffer to search
		// - val - a string, Buffer, or number
		// - byteOffset - an index into `buffer`; will be clamped to an int32
		// - encoding - an optional encoding, relevant is val is a string
		// - dir - true for indexOf, false for lastIndexOf
		function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
		  // Empty buffer means no match
		  if (buffer.length === 0) return -1

		  // Normalize byteOffset
		  if (typeof byteOffset === 'string') {
		    encoding = byteOffset;
		    byteOffset = 0;
		  } else if (byteOffset > 0x7fffffff) {
		    byteOffset = 0x7fffffff;
		  } else if (byteOffset < -2147483648) {
		    byteOffset = -2147483648;
		  }
		  byteOffset = +byteOffset; // Coerce to Number.
		  if (numberIsNaN(byteOffset)) {
		    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
		    byteOffset = dir ? 0 : (buffer.length - 1);
		  }

		  // Normalize byteOffset: negative offsets start from the end of the buffer
		  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
		  if (byteOffset >= buffer.length) {
		    if (dir) return -1
		    else byteOffset = buffer.length - 1;
		  } else if (byteOffset < 0) {
		    if (dir) byteOffset = 0;
		    else return -1
		  }

		  // Normalize val
		  if (typeof val === 'string') {
		    val = Buffer.from(val, encoding);
		  }

		  // Finally, search either indexOf (if dir is true) or lastIndexOf
		  if (Buffer.isBuffer(val)) {
		    // Special case: looking for empty string/buffer always fails
		    if (val.length === 0) {
		      return -1
		    }
		    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
		  } else if (typeof val === 'number') {
		    val = val & 0xFF; // Search for a byte value [0-255]
		    if (typeof Uint8Array.prototype.indexOf === 'function') {
		      if (dir) {
		        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
		      } else {
		        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
		      }
		    }
		    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
		  }

		  throw new TypeError('val must be string, number or Buffer')
		}

		function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
		  let indexSize = 1;
		  let arrLength = arr.length;
		  let valLength = val.length;

		  if (encoding !== undefined) {
		    encoding = String(encoding).toLowerCase();
		    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
		        encoding === 'utf16le' || encoding === 'utf-16le') {
		      if (arr.length < 2 || val.length < 2) {
		        return -1
		      }
		      indexSize = 2;
		      arrLength /= 2;
		      valLength /= 2;
		      byteOffset /= 2;
		    }
		  }

		  function read (buf, i) {
		    if (indexSize === 1) {
		      return buf[i]
		    } else {
		      return buf.readUInt16BE(i * indexSize)
		    }
		  }

		  let i;
		  if (dir) {
		    let foundIndex = -1;
		    for (i = byteOffset; i < arrLength; i++) {
		      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
		        if (foundIndex === -1) foundIndex = i;
		        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
		      } else {
		        if (foundIndex !== -1) i -= i - foundIndex;
		        foundIndex = -1;
		      }
		    }
		  } else {
		    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
		    for (i = byteOffset; i >= 0; i--) {
		      let found = true;
		      for (let j = 0; j < valLength; j++) {
		        if (read(arr, i + j) !== read(val, j)) {
		          found = false;
		          break
		        }
		      }
		      if (found) return i
		    }
		  }

		  return -1
		}

		Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
		  return this.indexOf(val, byteOffset, encoding) !== -1
		};

		Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
		  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
		};

		Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
		  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
		};

		function hexWrite (buf, string, offset, length) {
		  offset = Number(offset) || 0;
		  const remaining = buf.length - offset;
		  if (!length) {
		    length = remaining;
		  } else {
		    length = Number(length);
		    if (length > remaining) {
		      length = remaining;
		    }
		  }

		  const strLen = string.length;

		  if (length > strLen / 2) {
		    length = strLen / 2;
		  }
		  let i;
		  for (i = 0; i < length; ++i) {
		    const parsed = parseInt(string.substr(i * 2, 2), 16);
		    if (numberIsNaN(parsed)) return i
		    buf[offset + i] = parsed;
		  }
		  return i
		}

		function utf8Write (buf, string, offset, length) {
		  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
		}

		function asciiWrite (buf, string, offset, length) {
		  return blitBuffer(asciiToBytes(string), buf, offset, length)
		}

		function base64Write (buf, string, offset, length) {
		  return blitBuffer(base64ToBytes(string), buf, offset, length)
		}

		function ucs2Write (buf, string, offset, length) {
		  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
		}

		Buffer.prototype.write = function write (string, offset, length, encoding) {
		  // Buffer#write(string)
		  if (offset === undefined) {
		    encoding = 'utf8';
		    length = this.length;
		    offset = 0;
		  // Buffer#write(string, encoding)
		  } else if (length === undefined && typeof offset === 'string') {
		    encoding = offset;
		    length = this.length;
		    offset = 0;
		  // Buffer#write(string, offset[, length][, encoding])
		  } else if (isFinite(offset)) {
		    offset = offset >>> 0;
		    if (isFinite(length)) {
		      length = length >>> 0;
		      if (encoding === undefined) encoding = 'utf8';
		    } else {
		      encoding = length;
		      length = undefined;
		    }
		  } else {
		    throw new Error(
		      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
		    )
		  }

		  const remaining = this.length - offset;
		  if (length === undefined || length > remaining) length = remaining;

		  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
		    throw new RangeError('Attempt to write outside buffer bounds')
		  }

		  if (!encoding) encoding = 'utf8';

		  let loweredCase = false;
		  for (;;) {
		    switch (encoding) {
		      case 'hex':
		        return hexWrite(this, string, offset, length)

		      case 'utf8':
		      case 'utf-8':
		        return utf8Write(this, string, offset, length)

		      case 'ascii':
		      case 'latin1':
		      case 'binary':
		        return asciiWrite(this, string, offset, length)

		      case 'base64':
		        // Warning: maxLength not taken into account in base64Write
		        return base64Write(this, string, offset, length)

		      case 'ucs2':
		      case 'ucs-2':
		      case 'utf16le':
		      case 'utf-16le':
		        return ucs2Write(this, string, offset, length)

		      default:
		        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
		        encoding = ('' + encoding).toLowerCase();
		        loweredCase = true;
		    }
		  }
		};

		Buffer.prototype.toJSON = function toJSON () {
		  return {
		    type: 'Buffer',
		    data: Array.prototype.slice.call(this._arr || this, 0)
		  }
		};

		function base64Slice (buf, start, end) {
		  if (start === 0 && end === buf.length) {
		    return base64.fromByteArray(buf)
		  } else {
		    return base64.fromByteArray(buf.slice(start, end))
		  }
		}

		function utf8Slice (buf, start, end) {
		  end = Math.min(buf.length, end);
		  const res = [];

		  let i = start;
		  while (i < end) {
		    const firstByte = buf[i];
		    let codePoint = null;
		    let bytesPerSequence = (firstByte > 0xEF)
		      ? 4
		      : (firstByte > 0xDF)
		          ? 3
		          : (firstByte > 0xBF)
		              ? 2
		              : 1;

		    if (i + bytesPerSequence <= end) {
		      let secondByte, thirdByte, fourthByte, tempCodePoint;

		      switch (bytesPerSequence) {
		        case 1:
		          if (firstByte < 0x80) {
		            codePoint = firstByte;
		          }
		          break
		        case 2:
		          secondByte = buf[i + 1];
		          if ((secondByte & 0xC0) === 0x80) {
		            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
		            if (tempCodePoint > 0x7F) {
		              codePoint = tempCodePoint;
		            }
		          }
		          break
		        case 3:
		          secondByte = buf[i + 1];
		          thirdByte = buf[i + 2];
		          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
		            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
		            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
		              codePoint = tempCodePoint;
		            }
		          }
		          break
		        case 4:
		          secondByte = buf[i + 1];
		          thirdByte = buf[i + 2];
		          fourthByte = buf[i + 3];
		          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
		            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
		            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
		              codePoint = tempCodePoint;
		            }
		          }
		      }
		    }

		    if (codePoint === null) {
		      // we did not generate a valid codePoint so insert a
		      // replacement char (U+FFFD) and advance only 1 byte
		      codePoint = 0xFFFD;
		      bytesPerSequence = 1;
		    } else if (codePoint > 0xFFFF) {
		      // encode to utf16 (surrogate pair dance)
		      codePoint -= 0x10000;
		      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
		      codePoint = 0xDC00 | codePoint & 0x3FF;
		    }

		    res.push(codePoint);
		    i += bytesPerSequence;
		  }

		  return decodeCodePointsArray(res)
		}

		// Based on http://stackoverflow.com/a/22747272/680742, the browser with
		// the lowest limit is Chrome, with 0x10000 args.
		// We go 1 magnitude less, for safety
		const MAX_ARGUMENTS_LENGTH = 0x1000;

		function decodeCodePointsArray (codePoints) {
		  const len = codePoints.length;
		  if (len <= MAX_ARGUMENTS_LENGTH) {
		    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
		  }

		  // Decode in chunks to avoid "call stack size exceeded".
		  let res = '';
		  let i = 0;
		  while (i < len) {
		    res += String.fromCharCode.apply(
		      String,
		      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
		    );
		  }
		  return res
		}

		function asciiSlice (buf, start, end) {
		  let ret = '';
		  end = Math.min(buf.length, end);

		  for (let i = start; i < end; ++i) {
		    ret += String.fromCharCode(buf[i] & 0x7F);
		  }
		  return ret
		}

		function latin1Slice (buf, start, end) {
		  let ret = '';
		  end = Math.min(buf.length, end);

		  for (let i = start; i < end; ++i) {
		    ret += String.fromCharCode(buf[i]);
		  }
		  return ret
		}

		function hexSlice (buf, start, end) {
		  const len = buf.length;

		  if (!start || start < 0) start = 0;
		  if (!end || end < 0 || end > len) end = len;

		  let out = '';
		  for (let i = start; i < end; ++i) {
		    out += hexSliceLookupTable[buf[i]];
		  }
		  return out
		}

		function utf16leSlice (buf, start, end) {
		  const bytes = buf.slice(start, end);
		  let res = '';
		  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
		  for (let i = 0; i < bytes.length - 1; i += 2) {
		    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256));
		  }
		  return res
		}

		Buffer.prototype.slice = function slice (start, end) {
		  const len = this.length;
		  start = ~~start;
		  end = end === undefined ? len : ~~end;

		  if (start < 0) {
		    start += len;
		    if (start < 0) start = 0;
		  } else if (start > len) {
		    start = len;
		  }

		  if (end < 0) {
		    end += len;
		    if (end < 0) end = 0;
		  } else if (end > len) {
		    end = len;
		  }

		  if (end < start) end = start;

		  const newBuf = this.subarray(start, end);
		  // Return an augmented `Uint8Array` instance
		  Object.setPrototypeOf(newBuf, Buffer.prototype);

		  return newBuf
		};

		/*
		 * Need to make sure that buffer isn't trying to write out of bounds.
		 */
		function checkOffset (offset, ext, length) {
		  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
		  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
		}

		Buffer.prototype.readUintLE =
		Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
		  offset = offset >>> 0;
		  byteLength = byteLength >>> 0;
		  if (!noAssert) checkOffset(offset, byteLength, this.length);

		  let val = this[offset];
		  let mul = 1;
		  let i = 0;
		  while (++i < byteLength && (mul *= 0x100)) {
		    val += this[offset + i] * mul;
		  }

		  return val
		};

		Buffer.prototype.readUintBE =
		Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
		  offset = offset >>> 0;
		  byteLength = byteLength >>> 0;
		  if (!noAssert) {
		    checkOffset(offset, byteLength, this.length);
		  }

		  let val = this[offset + --byteLength];
		  let mul = 1;
		  while (byteLength > 0 && (mul *= 0x100)) {
		    val += this[offset + --byteLength] * mul;
		  }

		  return val
		};

		Buffer.prototype.readUint8 =
		Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 1, this.length);
		  return this[offset]
		};

		Buffer.prototype.readUint16LE =
		Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 2, this.length);
		  return this[offset] | (this[offset + 1] << 8)
		};

		Buffer.prototype.readUint16BE =
		Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 2, this.length);
		  return (this[offset] << 8) | this[offset + 1]
		};

		Buffer.prototype.readUint32LE =
		Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 4, this.length);

		  return ((this[offset]) |
		      (this[offset + 1] << 8) |
		      (this[offset + 2] << 16)) +
		      (this[offset + 3] * 0x1000000)
		};

		Buffer.prototype.readUint32BE =
		Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 4, this.length);

		  return (this[offset] * 0x1000000) +
		    ((this[offset + 1] << 16) |
		    (this[offset + 2] << 8) |
		    this[offset + 3])
		};

		Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
		  offset = offset >>> 0;
		  validateNumber(offset, 'offset');
		  const first = this[offset];
		  const last = this[offset + 7];
		  if (first === undefined || last === undefined) {
		    boundsError(offset, this.length - 8);
		  }

		  const lo = first +
		    this[++offset] * 2 ** 8 +
		    this[++offset] * 2 ** 16 +
		    this[++offset] * 2 ** 24;

		  const hi = this[++offset] +
		    this[++offset] * 2 ** 8 +
		    this[++offset] * 2 ** 16 +
		    last * 2 ** 24;

		  return BigInt(lo) + (BigInt(hi) << BigInt(32))
		});

		Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
		  offset = offset >>> 0;
		  validateNumber(offset, 'offset');
		  const first = this[offset];
		  const last = this[offset + 7];
		  if (first === undefined || last === undefined) {
		    boundsError(offset, this.length - 8);
		  }

		  const hi = first * 2 ** 24 +
		    this[++offset] * 2 ** 16 +
		    this[++offset] * 2 ** 8 +
		    this[++offset];

		  const lo = this[++offset] * 2 ** 24 +
		    this[++offset] * 2 ** 16 +
		    this[++offset] * 2 ** 8 +
		    last;

		  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
		});

		Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
		  offset = offset >>> 0;
		  byteLength = byteLength >>> 0;
		  if (!noAssert) checkOffset(offset, byteLength, this.length);

		  let val = this[offset];
		  let mul = 1;
		  let i = 0;
		  while (++i < byteLength && (mul *= 0x100)) {
		    val += this[offset + i] * mul;
		  }
		  mul *= 0x80;

		  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

		  return val
		};

		Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
		  offset = offset >>> 0;
		  byteLength = byteLength >>> 0;
		  if (!noAssert) checkOffset(offset, byteLength, this.length);

		  let i = byteLength;
		  let mul = 1;
		  let val = this[offset + --i];
		  while (i > 0 && (mul *= 0x100)) {
		    val += this[offset + --i] * mul;
		  }
		  mul *= 0x80;

		  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

		  return val
		};

		Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 1, this.length);
		  if (!(this[offset] & 0x80)) return (this[offset])
		  return ((0xff - this[offset] + 1) * -1)
		};

		Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 2, this.length);
		  const val = this[offset] | (this[offset + 1] << 8);
		  return (val & 0x8000) ? val | 0xFFFF0000 : val
		};

		Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 2, this.length);
		  const val = this[offset + 1] | (this[offset] << 8);
		  return (val & 0x8000) ? val | 0xFFFF0000 : val
		};

		Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 4, this.length);

		  return (this[offset]) |
		    (this[offset + 1] << 8) |
		    (this[offset + 2] << 16) |
		    (this[offset + 3] << 24)
		};

		Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 4, this.length);

		  return (this[offset] << 24) |
		    (this[offset + 1] << 16) |
		    (this[offset + 2] << 8) |
		    (this[offset + 3])
		};

		Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
		  offset = offset >>> 0;
		  validateNumber(offset, 'offset');
		  const first = this[offset];
		  const last = this[offset + 7];
		  if (first === undefined || last === undefined) {
		    boundsError(offset, this.length - 8);
		  }

		  const val = this[offset + 4] +
		    this[offset + 5] * 2 ** 8 +
		    this[offset + 6] * 2 ** 16 +
		    (last << 24); // Overflow

		  return (BigInt(val) << BigInt(32)) +
		    BigInt(first +
		    this[++offset] * 2 ** 8 +
		    this[++offset] * 2 ** 16 +
		    this[++offset] * 2 ** 24)
		});

		Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
		  offset = offset >>> 0;
		  validateNumber(offset, 'offset');
		  const first = this[offset];
		  const last = this[offset + 7];
		  if (first === undefined || last === undefined) {
		    boundsError(offset, this.length - 8);
		  }

		  const val = (first << 24) + // Overflow
		    this[++offset] * 2 ** 16 +
		    this[++offset] * 2 ** 8 +
		    this[++offset];

		  return (BigInt(val) << BigInt(32)) +
		    BigInt(this[++offset] * 2 ** 24 +
		    this[++offset] * 2 ** 16 +
		    this[++offset] * 2 ** 8 +
		    last)
		});

		Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 4, this.length);
		  return ieee754.read(this, offset, true, 23, 4)
		};

		Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 4, this.length);
		  return ieee754.read(this, offset, false, 23, 4)
		};

		Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 8, this.length);
		  return ieee754.read(this, offset, true, 52, 8)
		};

		Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
		  offset = offset >>> 0;
		  if (!noAssert) checkOffset(offset, 8, this.length);
		  return ieee754.read(this, offset, false, 52, 8)
		};

		function checkInt (buf, value, offset, ext, max, min) {
		  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
		  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
		  if (offset + ext > buf.length) throw new RangeError('Index out of range')
		}

		Buffer.prototype.writeUintLE =
		Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  byteLength = byteLength >>> 0;
		  if (!noAssert) {
		    const maxBytes = Math.pow(2, 8 * byteLength) - 1;
		    checkInt(this, value, offset, byteLength, maxBytes, 0);
		  }

		  let mul = 1;
		  let i = 0;
		  this[offset] = value & 0xFF;
		  while (++i < byteLength && (mul *= 0x100)) {
		    this[offset + i] = (value / mul) & 0xFF;
		  }

		  return offset + byteLength
		};

		Buffer.prototype.writeUintBE =
		Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  byteLength = byteLength >>> 0;
		  if (!noAssert) {
		    const maxBytes = Math.pow(2, 8 * byteLength) - 1;
		    checkInt(this, value, offset, byteLength, maxBytes, 0);
		  }

		  let i = byteLength - 1;
		  let mul = 1;
		  this[offset + i] = value & 0xFF;
		  while (--i >= 0 && (mul *= 0x100)) {
		    this[offset + i] = (value / mul) & 0xFF;
		  }

		  return offset + byteLength
		};

		Buffer.prototype.writeUint8 =
		Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
		  this[offset] = (value & 0xff);
		  return offset + 1
		};

		Buffer.prototype.writeUint16LE =
		Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
		  this[offset] = (value & 0xff);
		  this[offset + 1] = (value >>> 8);
		  return offset + 2
		};

		Buffer.prototype.writeUint16BE =
		Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
		  this[offset] = (value >>> 8);
		  this[offset + 1] = (value & 0xff);
		  return offset + 2
		};

		Buffer.prototype.writeUint32LE =
		Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
		  this[offset + 3] = (value >>> 24);
		  this[offset + 2] = (value >>> 16);
		  this[offset + 1] = (value >>> 8);
		  this[offset] = (value & 0xff);
		  return offset + 4
		};

		Buffer.prototype.writeUint32BE =
		Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
		  this[offset] = (value >>> 24);
		  this[offset + 1] = (value >>> 16);
		  this[offset + 2] = (value >>> 8);
		  this[offset + 3] = (value & 0xff);
		  return offset + 4
		};

		function wrtBigUInt64LE (buf, value, offset, min, max) {
		  checkIntBI(value, min, max, buf, offset, 7);

		  let lo = Number(value & BigInt(0xffffffff));
		  buf[offset++] = lo;
		  lo = lo >> 8;
		  buf[offset++] = lo;
		  lo = lo >> 8;
		  buf[offset++] = lo;
		  lo = lo >> 8;
		  buf[offset++] = lo;
		  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
		  buf[offset++] = hi;
		  hi = hi >> 8;
		  buf[offset++] = hi;
		  hi = hi >> 8;
		  buf[offset++] = hi;
		  hi = hi >> 8;
		  buf[offset++] = hi;
		  return offset
		}

		function wrtBigUInt64BE (buf, value, offset, min, max) {
		  checkIntBI(value, min, max, buf, offset, 7);

		  let lo = Number(value & BigInt(0xffffffff));
		  buf[offset + 7] = lo;
		  lo = lo >> 8;
		  buf[offset + 6] = lo;
		  lo = lo >> 8;
		  buf[offset + 5] = lo;
		  lo = lo >> 8;
		  buf[offset + 4] = lo;
		  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
		  buf[offset + 3] = hi;
		  hi = hi >> 8;
		  buf[offset + 2] = hi;
		  hi = hi >> 8;
		  buf[offset + 1] = hi;
		  hi = hi >> 8;
		  buf[offset] = hi;
		  return offset + 8
		}

		Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
		  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
		});

		Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
		  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
		});

		Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) {
		    const limit = Math.pow(2, (8 * byteLength) - 1);

		    checkInt(this, value, offset, byteLength, limit - 1, -limit);
		  }

		  let i = 0;
		  let mul = 1;
		  let sub = 0;
		  this[offset] = value & 0xFF;
		  while (++i < byteLength && (mul *= 0x100)) {
		    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
		      sub = 1;
		    }
		    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
		  }

		  return offset + byteLength
		};

		Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) {
		    const limit = Math.pow(2, (8 * byteLength) - 1);

		    checkInt(this, value, offset, byteLength, limit - 1, -limit);
		  }

		  let i = byteLength - 1;
		  let mul = 1;
		  let sub = 0;
		  this[offset + i] = value & 0xFF;
		  while (--i >= 0 && (mul *= 0x100)) {
		    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
		      sub = 1;
		    }
		    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
		  }

		  return offset + byteLength
		};

		Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -128);
		  if (value < 0) value = 0xff + value + 1;
		  this[offset] = (value & 0xff);
		  return offset + 1
		};

		Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
		  this[offset] = (value & 0xff);
		  this[offset + 1] = (value >>> 8);
		  return offset + 2
		};

		Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
		  this[offset] = (value >>> 8);
		  this[offset + 1] = (value & 0xff);
		  return offset + 2
		};

		Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
		  this[offset] = (value & 0xff);
		  this[offset + 1] = (value >>> 8);
		  this[offset + 2] = (value >>> 16);
		  this[offset + 3] = (value >>> 24);
		  return offset + 4
		};

		Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
		  if (value < 0) value = 0xffffffff + value + 1;
		  this[offset] = (value >>> 24);
		  this[offset + 1] = (value >>> 16);
		  this[offset + 2] = (value >>> 8);
		  this[offset + 3] = (value & 0xff);
		  return offset + 4
		};

		Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
		  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
		});

		Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
		  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
		});

		function checkIEEE754 (buf, value, offset, ext, max, min) {
		  if (offset + ext > buf.length) throw new RangeError('Index out of range')
		  if (offset < 0) throw new RangeError('Index out of range')
		}

		function writeFloat (buf, value, offset, littleEndian, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) {
		    checkIEEE754(buf, value, offset, 4);
		  }
		  ieee754.write(buf, value, offset, littleEndian, 23, 4);
		  return offset + 4
		}

		Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
		  return writeFloat(this, value, offset, true, noAssert)
		};

		Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
		  return writeFloat(this, value, offset, false, noAssert)
		};

		function writeDouble (buf, value, offset, littleEndian, noAssert) {
		  value = +value;
		  offset = offset >>> 0;
		  if (!noAssert) {
		    checkIEEE754(buf, value, offset, 8);
		  }
		  ieee754.write(buf, value, offset, littleEndian, 52, 8);
		  return offset + 8
		}

		Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
		  return writeDouble(this, value, offset, true, noAssert)
		};

		Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
		  return writeDouble(this, value, offset, false, noAssert)
		};

		// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
		Buffer.prototype.copy = function copy (target, targetStart, start, end) {
		  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
		  if (!start) start = 0;
		  if (!end && end !== 0) end = this.length;
		  if (targetStart >= target.length) targetStart = target.length;
		  if (!targetStart) targetStart = 0;
		  if (end > 0 && end < start) end = start;

		  // Copy 0 bytes; we're done
		  if (end === start) return 0
		  if (target.length === 0 || this.length === 0) return 0

		  // Fatal error conditions
		  if (targetStart < 0) {
		    throw new RangeError('targetStart out of bounds')
		  }
		  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
		  if (end < 0) throw new RangeError('sourceEnd out of bounds')

		  // Are we oob?
		  if (end > this.length) end = this.length;
		  if (target.length - targetStart < end - start) {
		    end = target.length - targetStart + start;
		  }

		  const len = end - start;

		  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
		    // Use built-in when available, missing from IE11
		    this.copyWithin(targetStart, start, end);
		  } else {
		    Uint8Array.prototype.set.call(
		      target,
		      this.subarray(start, end),
		      targetStart
		    );
		  }

		  return len
		};

		// Usage:
		//    buffer.fill(number[, offset[, end]])
		//    buffer.fill(buffer[, offset[, end]])
		//    buffer.fill(string[, offset[, end]][, encoding])
		Buffer.prototype.fill = function fill (val, start, end, encoding) {
		  // Handle string cases:
		  if (typeof val === 'string') {
		    if (typeof start === 'string') {
		      encoding = start;
		      start = 0;
		      end = this.length;
		    } else if (typeof end === 'string') {
		      encoding = end;
		      end = this.length;
		    }
		    if (encoding !== undefined && typeof encoding !== 'string') {
		      throw new TypeError('encoding must be a string')
		    }
		    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
		      throw new TypeError('Unknown encoding: ' + encoding)
		    }
		    if (val.length === 1) {
		      const code = val.charCodeAt(0);
		      if ((encoding === 'utf8' && code < 128) ||
		          encoding === 'latin1') {
		        // Fast path: If `val` fits into a single byte, use that numeric value.
		        val = code;
		      }
		    }
		  } else if (typeof val === 'number') {
		    val = val & 255;
		  } else if (typeof val === 'boolean') {
		    val = Number(val);
		  }

		  // Invalid ranges are not set to a default, so can range check early.
		  if (start < 0 || this.length < start || this.length < end) {
		    throw new RangeError('Out of range index')
		  }

		  if (end <= start) {
		    return this
		  }

		  start = start >>> 0;
		  end = end === undefined ? this.length : end >>> 0;

		  if (!val) val = 0;

		  let i;
		  if (typeof val === 'number') {
		    for (i = start; i < end; ++i) {
		      this[i] = val;
		    }
		  } else {
		    const bytes = Buffer.isBuffer(val)
		      ? val
		      : Buffer.from(val, encoding);
		    const len = bytes.length;
		    if (len === 0) {
		      throw new TypeError('The value "' + val +
		        '" is invalid for argument "value"')
		    }
		    for (i = 0; i < end - start; ++i) {
		      this[i + start] = bytes[i % len];
		    }
		  }

		  return this
		};

		// CUSTOM ERRORS
		// =============

		// Simplified versions from Node, changed for Buffer-only usage
		const errors = {};
		function E (sym, getMessage, Base) {
		  errors[sym] = class NodeError extends Base {
		    constructor () {
		      super();

		      Object.defineProperty(this, 'message', {
		        value: getMessage.apply(this, arguments),
		        writable: true,
		        configurable: true
		      });

		      // Add the error code to the name to include it in the stack trace.
		      this.name = `${this.name} [${sym}]`;
		      // Access the stack to generate the error message including the error code
		      // from the name.
		      this.stack; // eslint-disable-line no-unused-expressions
		      // Reset the name to the actual name.
		      delete this.name;
		    }

		    get code () {
		      return sym
		    }

		    set code (value) {
		      Object.defineProperty(this, 'code', {
		        configurable: true,
		        enumerable: true,
		        value,
		        writable: true
		      });
		    }

		    toString () {
		      return `${this.name} [${sym}]: ${this.message}`
		    }
		  };
		}

		E('ERR_BUFFER_OUT_OF_BOUNDS',
		  function (name) {
		    if (name) {
		      return `${name} is outside of buffer bounds`
		    }

		    return 'Attempt to access memory outside buffer bounds'
		  }, RangeError);
		E('ERR_INVALID_ARG_TYPE',
		  function (name, actual) {
		    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
		  }, TypeError);
		E('ERR_OUT_OF_RANGE',
		  function (str, range, input) {
		    let msg = `The value of "${str}" is out of range.`;
		    let received = input;
		    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
		      received = addNumericalSeparator(String(input));
		    } else if (typeof input === 'bigint') {
		      received = String(input);
		      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
		        received = addNumericalSeparator(received);
		      }
		      received += 'n';
		    }
		    msg += ` It must be ${range}. Received ${received}`;
		    return msg
		  }, RangeError);

		function addNumericalSeparator (val) {
		  let res = '';
		  let i = val.length;
		  const start = val[0] === '-' ? 1 : 0;
		  for (; i >= start + 4; i -= 3) {
		    res = `_${val.slice(i - 3, i)}${res}`;
		  }
		  return `${val.slice(0, i)}${res}`
		}

		// CHECK FUNCTIONS
		// ===============

		function checkBounds (buf, offset, byteLength) {
		  validateNumber(offset, 'offset');
		  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
		    boundsError(offset, buf.length - (byteLength + 1));
		  }
		}

		function checkIntBI (value, min, max, buf, offset, byteLength) {
		  if (value > max || value < min) {
		    const n = typeof min === 'bigint' ? 'n' : '';
		    let range;
		    {
		      if (min === 0 || min === BigInt(0)) {
		        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`;
		      } else {
		        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
		                `${(byteLength + 1) * 8 - 1}${n}`;
		      }
		    }
		    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
		  }
		  checkBounds(buf, offset, byteLength);
		}

		function validateNumber (value, name) {
		  if (typeof value !== 'number') {
		    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
		  }
		}

		function boundsError (value, length, type) {
		  if (Math.floor(value) !== value) {
		    validateNumber(value, type);
		    throw new errors.ERR_OUT_OF_RANGE('offset', 'an integer', value)
		  }

		  if (length < 0) {
		    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
		  }

		  throw new errors.ERR_OUT_OF_RANGE('offset',
		                                    `>= ${0} and <= ${length}`,
		                                    value)
		}

		// HELPER FUNCTIONS
		// ================

		const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

		function base64clean (str) {
		  // Node takes equal signs as end of the Base64 encoding
		  str = str.split('=')[0];
		  // Node strips out invalid characters like \n and \t from the string, base64-js does not
		  str = str.trim().replace(INVALID_BASE64_RE, '');
		  // Node converts strings with length < 2 to ''
		  if (str.length < 2) return ''
		  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
		  while (str.length % 4 !== 0) {
		    str = str + '=';
		  }
		  return str
		}

		function utf8ToBytes (string, units) {
		  units = units || Infinity;
		  let codePoint;
		  const length = string.length;
		  let leadSurrogate = null;
		  const bytes = [];

		  for (let i = 0; i < length; ++i) {
		    codePoint = string.charCodeAt(i);

		    // is surrogate component
		    if (codePoint > 0xD7FF && codePoint < 0xE000) {
		      // last char was a lead
		      if (!leadSurrogate) {
		        // no lead yet
		        if (codePoint > 0xDBFF) {
		          // unexpected trail
		          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
		          continue
		        } else if (i + 1 === length) {
		          // unpaired lead
		          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
		          continue
		        }

		        // valid lead
		        leadSurrogate = codePoint;

		        continue
		      }

		      // 2 leads in a row
		      if (codePoint < 0xDC00) {
		        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
		        leadSurrogate = codePoint;
		        continue
		      }

		      // valid surrogate pair
		      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
		    } else if (leadSurrogate) {
		      // valid bmp char, but last char was a lead
		      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
		    }

		    leadSurrogate = null;

		    // encode utf8
		    if (codePoint < 0x80) {
		      if ((units -= 1) < 0) break
		      bytes.push(codePoint);
		    } else if (codePoint < 0x800) {
		      if ((units -= 2) < 0) break
		      bytes.push(
		        codePoint >> 0x6 | 0xC0,
		        codePoint & 0x3F | 0x80
		      );
		    } else if (codePoint < 0x10000) {
		      if ((units -= 3) < 0) break
		      bytes.push(
		        codePoint >> 0xC | 0xE0,
		        codePoint >> 0x6 & 0x3F | 0x80,
		        codePoint & 0x3F | 0x80
		      );
		    } else if (codePoint < 0x110000) {
		      if ((units -= 4) < 0) break
		      bytes.push(
		        codePoint >> 0x12 | 0xF0,
		        codePoint >> 0xC & 0x3F | 0x80,
		        codePoint >> 0x6 & 0x3F | 0x80,
		        codePoint & 0x3F | 0x80
		      );
		    } else {
		      throw new Error('Invalid code point')
		    }
		  }

		  return bytes
		}

		function asciiToBytes (str) {
		  const byteArray = [];
		  for (let i = 0; i < str.length; ++i) {
		    // Node's code seems to be doing this and not & 0x7F..
		    byteArray.push(str.charCodeAt(i) & 0xFF);
		  }
		  return byteArray
		}

		function utf16leToBytes (str, units) {
		  let c, hi, lo;
		  const byteArray = [];
		  for (let i = 0; i < str.length; ++i) {
		    if ((units -= 2) < 0) break

		    c = str.charCodeAt(i);
		    hi = c >> 8;
		    lo = c % 256;
		    byteArray.push(lo);
		    byteArray.push(hi);
		  }

		  return byteArray
		}

		function base64ToBytes (str) {
		  return base64.toByteArray(base64clean(str))
		}

		function blitBuffer (src, dst, offset, length) {
		  let i;
		  for (i = 0; i < length; ++i) {
		    if ((i + offset >= dst.length) || (i >= src.length)) break
		    dst[i + offset] = src[i];
		  }
		  return i
		}

		// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
		// the `instanceof` check but they should be treated as of that type.
		// See: https://github.com/feross/buffer/issues/166
		function isInstance (obj, type) {
		  return obj instanceof type ||
		    (obj != null && obj.constructor != null && obj.constructor.name != null &&
		      obj.constructor.name === type.name)
		}
		function numberIsNaN (obj) {
		  // For IE11 support
		  return obj !== obj // eslint-disable-line no-self-compare
		}

		// Create lookup table for `toString('hex')`
		// See: https://github.com/feross/buffer/issues/219
		const hexSliceLookupTable = (function () {
		  const alphabet = '0123456789abcdef';
		  const table = new Array(256);
		  for (let i = 0; i < 16; ++i) {
		    const i16 = i * 16;
		    for (let j = 0; j < 16; ++j) {
		      table[i16 + j] = alphabet[i] + alphabet[j];
		    }
		  }
		  return table
		})();

		// Return not function with Error if BigInt not supported
		function defineBigIntMethod (fn) {
		  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
		}

		function BufferBigIntNotDefined () {
		  throw new Error('BigInt not supported')
		} 
	} (buffer));
	return buffer;
}

var bufferExports = requireBuffer();

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
    const directoryNames = values.filter((value) => value.kind === "directory").map((dirHandle2) => dirHandle2.name.normalize("NFC"));
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
        filenames.push(handle.name.normalize("NFC"));
      } else {
        const normalizedDirName = handle.name.normalize("NFC");
        const filesInSubFolder = await this.#getFilenamesInFolder(
          this.#joinPath(folderPath, normalizedDirName)
        );
        const requestPaths = filesInSubFolder.map((filename) => {
          return this.#joinPath(normalizedDirName, filename);
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
          this.#joinPath(folderPath, handle.name.normalize("NFC"))
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

var CanonicalNoteHeader = /* @__PURE__ */ ((CanonicalNoteHeader2) => {
  CanonicalNoteHeader2["CREATED_AT"] = "created-at";
  CanonicalNoteHeader2["UPDATED_AT"] = "updated-at";
  CanonicalNoteHeader2["FLAGS"] = "neno-flags";
  return CanonicalNoteHeader2;
})(CanonicalNoteHeader || {});

const cleanSerializedNote = (serializedNote) => {
  return serializedNote.replace(/\r/g, "");
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
const splitHeadersAndContent = (serializedNote) => {
  const cleaned = cleanSerializedNote(serializedNote);
  const headers = parseGraphFileHeaders(cleaned);
  const canonicalMeta = {};
  const additionalHeaders = {};
  for (const [key, value] of headers.entries()) {
    const modifier = canonicalHeaderKeys.get(key);
    if (modifier) {
      modifier(canonicalMeta, value);
    } else {
      additionalHeaders[key] = value;
    }
  }
  const content = headers.size > 0 ? cleaned.substring(cleaned.indexOf("\n\n") + 2) : cleaned;
  return { canonicalMeta, additionalHeaders, content };
};
const parseSerializedExistingGraphFile = (serializedNote, slug) => {
  const { canonicalMeta, additionalHeaders, content } = splitHeadersAndContent(serializedNote);
  return {
    content,
    meta: {
      slug,
      createdAt: canonicalMeta.createdAt,
      updatedAt: canonicalMeta.updatedAt,
      flags: canonicalMeta.flags ?? [],
      additionalHeaders
    }
  };
};
const parseSerializedNewNote = (serializedNote) => {
  const { canonicalMeta, additionalHeaders, content } = splitHeadersAndContent(serializedNote);
  const meta = {
    flags: canonicalMeta.flags ?? [],
    additionalHeaders
  };
  return { content, meta };
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
    const charsUntilDelimiter = stringToAnalyse.slice(0, delimiterIndex);
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
const KEY_VALUE_PAIR_REGEX = /^\$[\p{L}\p{M}\d\-_]+(\s(.*)?)?$/u;
const ORDERED_LIST_ITEM_REGEX = /^\d+\./;
const parseHeading = (line) => ({
  type: BlockType.HEADING,
  data: {
    whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
    text: parseText(line.substring(1).trimStart())
  }
});
const parseKeyValuePair = (line) => ({
  type: BlockType.KEY_VALUE_PAIR,
  data: {
    key: line.substring(1).match(/^[^\s]+/)?.[0] ?? "",
    whitespace: line.substring(1).match(/\s+/g)?.[0] ?? "",
    value: parseText(
      Array.from(line.matchAll(/^[^\s]+\s*(.*)$/g))[0][1] ?? ""
    )
  }
});
const parseUnorderedListItem = (line) => ({
  type: BlockType.UNORDERED_LIST_ITEM,
  data: {
    whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
    text: parseText(line.substring(1).trimStart())
  }
});
const parseQuote = (line) => ({
  type: BlockType.QUOTE,
  data: {
    whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
    text: parseText(line.substring(1).trimStart())
  }
});
const parseOrderedListItem = (line) => ({
  type: BlockType.ORDERED_LIST_ITEM,
  data: {
    index: line.match(/^\d+/)?.[0] ?? "0",
    whitespace: line.match(/^\d+\.(\s*)/)?.[1] ?? "",
    text: parseText(line.match(/^\d+\.\s*(.*)/)?.[1] ?? "")
  }
});
const parseCode = (line) => ({
  type: BlockType.CODE,
  data: {
    code: "",
    contentType: line.substring(CODE_SIGIL.length).trim(),
    whitespace: line.substring(3).match(/^\s*/g)?.[0] ?? ""
  }
});
const parseEmpty = (line) => ({
  type: BlockType.EMPTY,
  data: { whitespace: line }
});
const parseParagraph = (line) => ({
  type: BlockType.PARAGRAPH,
  data: { text: parseText(line) }
});
const BLOCK_MATCHERS = [
  { match: (l) => l.startsWith(HEADING_SIGIL), parse: parseHeading },
  { match: (l) => KEY_VALUE_PAIR_REGEX.test(l), parse: parseKeyValuePair },
  { match: (l) => l.startsWith("- "), parse: parseUnorderedListItem },
  { match: (l) => l.startsWith(QUOTE_SIGIL), parse: parseQuote },
  {
    match: (l) => ORDERED_LIST_ITEM_REGEX.test(l),
    parse: parseOrderedListItem
  },
  { match: (l) => l.startsWith(CODE_SIGIL), parse: parseCode },
  { match: (l) => l.trim().length === 0, parse: parseEmpty }
];
const parse = (input) => {
  const lines = input.replaceAll("\r", "").split("\n");
  let withinBlock = false;
  let codeBlockJustStarted = false;
  return lines.reduce((blocks, line) => {
    if (withinBlock) {
      const currentBlock = blocks[blocks.length - 1];
      if (currentBlock.type !== BlockType.CODE) {
        throw new Error(
          "Subwaytext parser: Within unknown block: " + currentBlock.type
        );
      }
      if (line.trimEnd() === CODE_SIGIL) {
        withinBlock = false;
        return blocks;
      }
      const lineValue = line.trimEnd() === "\\" + CODE_SIGIL ? line.substring(1) : line;
      if (codeBlockJustStarted) {
        currentBlock.data.code += lineValue;
        codeBlockJustStarted = false;
      } else {
        currentBlock.data.code += "\n" + lineValue;
      }
      return blocks;
    }
    const matched = BLOCK_MATCHERS.find((m) => m.match(line));
    const newBlock = matched ? matched.parse(line) : parseParagraph(line);
    blocks.push(newBlock);
    if (newBlock.type === BlockType.CODE) {
      withinBlock = true;
      codeBlockJustStarted = true;
    }
    return blocks;
  }, []);
};
if (
  // @ts-ignore
  typeof DedicatedWorkerGlobalScope !== "undefined" && self instanceof DedicatedWorkerGlobalScope
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
    "m4a": MediaType.AUDIO,
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
const shortenText = (text, maxLength) => {
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

const trimSlug = (slug) => {
  return slug.replace(/^-+/, "").replace(/-+$/, "");
};
const INVALID_SLUG_CHARS = /[^\p{L}\p{M}\d\-_]+/gu;
const INVALID_SLUG_CHARS_KEEP_DOTS = /[^\p{L}\p{M}\d\-._]+/gu;
const INVALID_SLUG_CHARS_KEEP_SLASHES = /[^\p{L}\p{M}\d\-_/]+/gu;
const normalizeSlugBase = (text, options = {}) => {
  const invalidChars = options.keepSlashes ? INVALID_SLUG_CHARS_KEEP_SLASHES : options.keepDots ? INVALID_SLUG_CHARS_KEEP_DOTS : INVALID_SLUG_CHARS;
  return text.normalize("NFC").trim().replace(/['’]+/g, "").replace(invalidChars, "-");
};
const collapseDashesAndLowercase = (s) => {
  return trimSlug(s.replace(/-+/g, "-").toLowerCase());
};
const sluggifyWikilinkText = (text) => {
  const withSlashes = normalizeSlugBase(text, { keepSlashes: true }).replace(/(?<!\/)\/(?!\/)/g, "-").replace(/\/\/+/g, "/");
  return collapseDashesAndLowercase(withSlashes);
};
const sluggifyFilename = (text) => {
  const normalized = normalizeSlugBase(text, { keepDots: true }).replace(/-+/g, "-").replace(/^\./, "").toLowerCase();
  return trimSlug(normalized);
};
const sluggifyNoteText = (text) => {
  return collapseDashesAndLowercase(normalizeSlugBase(text)).substring(0, 200);
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
      return span.text.substring(1).normalize("NFC");
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
  const titleShortened = shortenText(textNormalized, maxLength).trim();
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
const getInlineSpans = (block) => {
  switch (block.type) {
    case BlockType.PARAGRAPH:
    case BlockType.HEADING:
    case BlockType.QUOTE:
    case BlockType.ORDERED_LIST_ITEM:
    case BlockType.UNORDERED_LIST_ITEM:
      return block.data.text;
    case BlockType.KEY_VALUE_PAIR:
      return block.data.value;
    default:
      return null;
  }
};
const setInlineSpans = (block, spans) => {
  switch (block.type) {
    case BlockType.PARAGRAPH:
    case BlockType.HEADING:
    case BlockType.QUOTE:
    case BlockType.ORDERED_LIST_ITEM:
    case BlockType.UNORDERED_LIST_ITEM:
      block.data.text = spans;
      return;
    case BlockType.KEY_VALUE_PAIR:
      block.data.value = spans;
      return;
  }
};
const getAllInlineSpans = (blocks) => {
  const spans = [];
  for (const block of blocks) {
    const blockSpans = getInlineSpans(block);
    if (blockSpans) spans.push(...blockSpans);
  }
  return spans;
};
const getFileSlugsReferencedInNote = (graph, noteSlug) => {
  const outgoingLinks = graph.indexes.outgoingLinks.get(noteSlug) ?? /* @__PURE__ */ new Set();
  const fileSlugs = /* @__PURE__ */ new Set();
  for (const slug of outgoingLinks) {
    if (graph.files.has(slug)) {
      fileSlugs.add(slug);
    }
  }
  return fileSlugs;
};
const getFileInfosForFilesLinkedInNote = (graph, slugOfNote) => {
  const fileSlugs = getFileSlugsReferencedInNote(graph, slugOfNote);
  return new Set(
    fileSlugs.values().map((fileSlug) => graph.files.get(fileSlug))
  );
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
const getKeyValuesFromBlocks = (blocks) => {
  const keyValues = /* @__PURE__ */ new Map();
  for (const block of blocks) {
    if (block.type === BlockType.KEY_VALUE_PAIR) {
      keyValues.set(block.data.key, serializeInlineText(block.data.value));
    }
  }
  return keyValues;
};
const createNoteToTransmit = async (existingNote, graph, includeParsedContent) => {
  const blocks = getBlocks(existingNote, graph.indexes.blocks);
  const noteToTransmit = {
    content: existingNote.content,
    meta: existingNote.meta,
    outgoingLinks: Array.from(
      getOutgoingLinksToOtherNotes(graph, existingNote.meta.slug)
    ).map((slug) => {
      const notePreview = getNotePreview(graph, slug);
      return notePreview;
    }),
    unresolvedOutgoingLinkAvailability: new Map(
      Array.from(
        graph.indexes.outgoingLinks.get(existingNote.meta.slug) ?? []
      ).map((slug) => {
        const isAvailable = graph.notes.has(slug) || graph.aliases.has(slug) || graph.files.has(slug);
        return [slug, isAvailable];
      })
    ),
    backlinks: getBacklinks(graph, existingNote.meta.slug),
    numberOfCharacters: getNumberOfCharacters(existingNote),
    numberOfBlocks: blocks.length,
    files: getFileInfosForFilesLinkedInNote(graph, existingNote.meta.slug),
    aliases: getAliasesOfSlug(graph, existingNote.meta.slug),
    keyValues: getKeyValuesFromBlocks(blocks)
  };
  if (includeParsedContent) {
    noteToTransmit.parsedContent = blocks;
  }
  return noteToTransmit;
};
const mapInlineSpans = (blocks, mapper) => {
  return blocks.map((block) => {
    const spans = getInlineSpans(block);
    if (spans) setInlineSpans(block, spans.map(mapper));
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
  return getFileSlugsReferencedInNote(graph, noteSlug).size;
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
const getSlugsFromParsedNote = (note) => {
  const inlineSpans = getAllInlineSpans(note);
  const slugs = getSlugsFromInlineText(inlineSpans);
  return slugs;
};

var subwaytextWorkerUrl = "/neno/assets/index-hOpOqyz9.js";

class DatabaseIO {
  #storageProvider;
  #loadedGraph = null;
  #graphRetrievalInProgress = null;
  #finishedObtainingGraph = () => {
  };
  #onFlush = null;
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
    if (typeof Worker === "undefined") {
      const blockIndex = /* @__PURE__ */ new Map();
      for (const note of notes) {
        blockIndex.set(note.meta.slug, parse(note.content));
      }
      return Promise.resolve(blockIndex);
    }
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
    this.#onFlush = config.onFlush ?? null;
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
  /*
    Retrieves the graph object. If forceDiskRead is true, the graph will be
    read from disk even if it is already loaded in memory.
    This is useful when you want to make sure you have the latest data from
    disk, e.g., after an external modification.
  */
  async getGraph(forceDiskRead = false) {
    if (this.#graphRetrievalInProgress) {
      await this.#graphRetrievalInProgress;
    }
    this.#graphRetrievalInProgress = new Promise((resolve) => {
      this.#finishedObtainingGraph = () => {
        this.#graphRetrievalInProgress = null;
        resolve();
      };
    });
    if (this.#loadedGraph && !forceDiskRead) {
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
            serializeNoteHeaders(/* @__PURE__ */ new Map([[
              DatabaseIO.#ALIAS_HEADER_KEY,
              canonicalSlug
            ]]))
          );
        }
      }));
    } else {
      for (const [alias, canonicalSlug] of graph.aliases) {
        const filename = DatabaseIO.getSubtextGraphFilenameForSlug(alias);
        await this.#storageProvider.writeObject(
          filename,
          serializeNoteHeaders(/* @__PURE__ */ new Map([[
            DatabaseIO.#ALIAS_HEADER_KEY,
            canonicalSlug
          ]]))
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
    if (this.#onFlush) {
      await this.#onFlush({
        canonicalNoteSlugs: canonicalNoteSlugsToFlush,
        aliases: aliasesToFlush,
        arbitraryFiles: arbitraryFilesToFlush,
        flushPins
      });
    }
  }
  /*
    Caution: We don't do any overwrite checks here. Last write wins.
  */
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
        const updateAliasOnDisk = !("changeSlugTo" in noteSaveRequest && typeof noteSaveRequest.changeSlugTo === "string" && noteSaveRequest.changeSlugTo === alias);
        if (updateAliasOnDisk) {
          aliasesToUpdate.add(alias);
        }
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
    return fileSlugs.has(fileSlug);
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
      files.values().map((file) => getMediaTypeFromFilename(file.filename))
    );
    return setsAreEqual(requiredMediaTypes, includedMediaTypes);
  }) : notes.filter((note) => {
    const files = getFileInfosForFilesLinkedInNote(graph, note.meta.slug);
    const includedMediaTypes = new Set(
      files.values().map((file) => getMediaTypeFromFilename(file.filename))
    );
    return Array.from(requiredMediaTypes).some((requiredMediaType) => {
      return includedMediaTypes.has(requiredMediaType);
    });
  });
};
const getNotesWithLinkToSlug = (notes, graph, fileSlug) => {
  if (!graph.indexes.backlinks.has(fileSlug)) {
    return [];
  }
  return notes.filter((note) => {
    return graph.indexes.backlinks.get(fileSlug).has(note.meta.slug);
  });
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
    } else if (key === "links-to") {
      matchingNotes = getNotesWithLinkToSlug(matchingNotes, graph, value);
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
  constructor(storageProvider, options) {
    this.#io = new DatabaseIO({
      storageProvider,
      onFlush: options?.onFlush
    });
  }
  /*
    Forces re-indexing of the entire graph. This is useful when you suspect
    that the indexes are out of sync with the actual notes, e.g., after an
    external modification of the note files.
  */
  async reIndexGraph() {
    await this.#io.getGraph(true);
  }
  async get(slug, options) {
    slug = slug.normalize("NFC");
    const graph = await this.#io.getGraph();
    const canonicalSlug = graph.aliases.get(slug) || slug;
    if (!graph.notes.has(canonicalSlug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }
    const noteFromDB = graph.notes.get(canonicalSlug);
    const noteToTransmit = await createNoteToTransmit(
      noteFromDB,
      graph,
      options?.includeParsedContent
    );
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
    slug = slug.normalize("NFC");
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
    slug = slug.normalize("NFC");
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
  #fileAdditionInProgress = null;
  #finishedAddingFile = () => {
  };
  async addFile(readable, namespace, originalFilename) {
    if (this.#fileAdditionInProgress) {
      await this.#fileAdditionInProgress;
    }
    this.#fileAdditionInProgress = new Promise((resolve) => {
      this.#finishedAddingFile = () => {
        this.#fileAdditionInProgress = null;
        resolve();
      };
    });
    try {
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
    } finally {
      this.#finishedAddingFile();
    }
  }
  async updateFile(readable, slug) {
    slug = slug.normalize("NFC");
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
    oldSlug = oldSlug.normalize("NFC");
    newSlug = newSlug.normalize("NFC");
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
    slug = slug.normalize("NFC");
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
    const allUsedFileSlugs = /* @__PURE__ */ new Set();
    for (const outgoingLinks of graph.indexes.outgoingLinks.values()) {
      for (const slug of outgoingLinks) {
        if (isValidSlug(slug)) {
          allUsedFileSlugs.add(slug);
        }
      }
    }
    return Array.from(graph.files.keys()).filter((slug) => !allUsedFileSlugs.has(slug));
  }
  async getReadableArbitraryGraphFileStream(slug, range) {
    slug = slug.normalize("NFC");
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
    slug = slug.normalize("NFC");
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
    slug = slug.normalize("NFC");
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
    slug = slug.normalize("NFC");
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
    slugToRemove = slugToRemove.normalize("NFC");
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

const TEXT_DECODER = new TextDecoder();
const FILE_MODE = 33188;
const DIR_MODE = 16877;
function normalizePath(path) {
  return path.replace(/\\/g, "/");
}
function splitPath(path) {
  const normalized = normalizePath(path);
  const allSegments = normalized.split("/").filter((s) => s.length > 0 && s !== ".");
  const basename = allSegments.length > 0 ? allSegments[allSegments.length - 1] : "";
  return {
    segments: allSegments,
    basename
  };
}
function hashPath(path) {
  let hash = 0;
  for (let i = 0; i < path.length; i++) {
    hash = (hash << 5) - hash + path.charCodeAt(i) | 0;
  }
  return Math.abs(hash) || 1;
}
function isNotFoundError(e) {
  if (e instanceof DOMException) {
    return e.name === "NotFoundError" || e.name === "TypeMismatchError";
  }
  return false;
}
function makeEnoent(path) {
  const err = new Error(`ENOENT: no such file or directory, '${path}'`);
  err.code = "ENOENT";
  return err;
}
function makeEexist(path) {
  const err = new Error(`EEXIST: file already exists, '${path}'`);
  err.code = "EEXIST";
  return err;
}
async function getDirectoryHandleByPath(root, segments, create) {
  let handle = root;
  for (const segment of segments) {
    handle = await handle.getDirectoryHandle(segment, { create });
  }
  return handle;
}
async function getParentAndName(root, path, createParents) {
  const { segments, basename } = splitPath(path);
  if (segments.length === 0) {
    throw makeEnoent(path);
  }
  const parentSegments = segments.slice(0, segments.length - 1);
  const parent = await getDirectoryHandleByPath(
    root,
    parentSegments,
    createParents
  );
  return { parent, name: basename };
}
function makeStat(args) {
  const { type, size, mtimeMs, path } = args;
  const mode = type === "dir" ? DIR_MODE : FILE_MODE;
  return {
    type,
    mode,
    size,
    ino: hashPath(path),
    mtimeMs,
    ctimeMs: mtimeMs,
    uid: 1,
    gid: 1,
    dev: 1,
    isFile: () => type === "file",
    isDirectory: () => type === "dir",
    isSymbolicLink: () => type === "symlink"
  };
}
async function getEntry(root, path) {
  const { segments } = splitPath(path);
  if (segments.length === 0) {
    return root;
  }
  const { parent, name } = await getParentAndName(root, path, false);
  try {
    return await parent.getFileHandle(name);
  } catch (e) {
    if (!isNotFoundError(e) && !(e instanceof TypeError)) {
      throw e;
    }
  }
  return await parent.getDirectoryHandle(name);
}
class FileSystemAccessFs {
  #root;
  promises;
  constructor(root) {
    this.#root = root;
    this.promises = this;
  }
  async readFile(path, options) {
    const encoding = typeof options === "string" ? options : options?.encoding;
    let fileHandle;
    try {
      const { parent, name } = await getParentAndName(
        this.#root,
        path,
        false
      );
      fileHandle = await parent.getFileHandle(name);
    } catch (e) {
      if (isNotFoundError(e)) throw makeEnoent(path);
      throw e;
    }
    const file = await fileHandle.getFile();
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (encoding === "utf8" || encoding === "utf-8") {
      return TEXT_DECODER.decode(bytes);
    }
    return bytes;
  }
  async writeFile(path, data, _options) {
    const { parent, name } = await getParentAndName(
      this.#root,
      path,
      true
    );
    const fileHandle = await parent.getFileHandle(name, { create: true });
    const writable = await fileHandle.createWritable();
    if (typeof data === "string") {
      await writable.write(data);
    } else {
      const exact = data.buffer.slice(
        data.byteOffset,
        data.byteOffset + data.byteLength
      );
      await writable.write(exact);
    }
    await writable.close();
  }
  async unlink(path) {
    try {
      const { parent, name } = await getParentAndName(
        this.#root,
        path,
        false
      );
      await parent.removeEntry(name);
    } catch (e) {
      if (isNotFoundError(e)) throw makeEnoent(path);
      throw e;
    }
  }
  async readdir(path) {
    let dir;
    try {
      const { segments } = splitPath(path);
      dir = await getDirectoryHandleByPath(this.#root, segments, false);
    } catch (e) {
      if (isNotFoundError(e)) throw makeEnoent(path);
      throw e;
    }
    const names = [];
    for await (const entry of dir.values()) {
      names.push(entry.name);
    }
    return names;
  }
  async mkdir(path, _options) {
    const { segments, basename } = splitPath(path);
    if (segments.length === 0) return;
    const parentSegments = segments.slice(0, segments.length - 1);
    const parent = await getDirectoryHandleByPath(
      this.#root,
      parentSegments,
      true
    );
    try {
      await parent.getDirectoryHandle(basename, { create: false });
      throw makeEexist(path);
    } catch (e) {
      if (!isNotFoundError(e)) {
        if (e.code === "EEXIST") throw e;
      }
    }
    await parent.getDirectoryHandle(basename, { create: true });
  }
  async rmdir(path) {
    try {
      const { parent, name } = await getParentAndName(
        this.#root,
        path,
        false
      );
      await parent.removeEntry(name);
    } catch (e) {
      if (isNotFoundError(e)) throw makeEnoent(path);
      throw e;
    }
  }
  async stat(path) {
    let entry;
    try {
      entry = await getEntry(this.#root, path);
    } catch (e) {
      if (isNotFoundError(e)) throw makeEnoent(path);
      throw e;
    }
    if (entry.kind === "file") {
      const file = await entry.getFile();
      return makeStat({
        type: "file",
        size: file.size,
        mtimeMs: file.lastModified,
        path
      });
    }
    return makeStat({
      type: "dir",
      size: 0,
      mtimeMs: 0,
      path
    });
  }
  async lstat(path) {
    return this.stat(path);
  }
  async readlink(_path) {
    const err = new Error("ENOSYS: symlinks not supported");
    err.code = "ENOSYS";
    throw err;
  }
  async symlink(_target, _path) {
    const err = new Error("ENOSYS: symlinks not supported");
    err.code = "ENOSYS";
    throw err;
  }
  async chmod(_path, _mode) {
  }
}

var isomorphicGit = {};

var lib$1;
var hasRequiredLib$1;

function requireLib$1 () {
	if (hasRequiredLib$1) return lib$1;
	hasRequiredLib$1 = 1;

	var AsyncLock = function (opts) {
		opts = opts || {};

		this.Promise = opts.Promise || Promise;

		// format: {key : [fn, fn]}
		// queues[key] = null indicates no job running for key
		this.queues = Object.create(null);

		// lock is reentrant for same domain
		this.domainReentrant = opts.domainReentrant || false;
		if (this.domainReentrant) {
			if (typeof process === 'undefined' || typeof process.domain === 'undefined') {
				throw new Error(
					'Domain-reentrant locks require `process.domain` to exist. Please flip `opts.domainReentrant = false`, ' +
					'use a NodeJS version that still implements Domain, or install a browser polyfill.');
			}
			// domain of current running func {key : fn}
			this.domains = Object.create(null);
		}

		this.timeout = opts.timeout || AsyncLock.DEFAULT_TIMEOUT;
		this.maxOccupationTime = opts.maxOccupationTime || AsyncLock.DEFAULT_MAX_OCCUPATION_TIME;
		this.maxExecutionTime = opts.maxExecutionTime || AsyncLock.DEFAULT_MAX_EXECUTION_TIME;
		if (opts.maxPending === Infinity || (Number.isInteger(opts.maxPending) && opts.maxPending >= 0)) {
			this.maxPending = opts.maxPending;
		} else {
			this.maxPending = AsyncLock.DEFAULT_MAX_PENDING;
		}
	};

	AsyncLock.DEFAULT_TIMEOUT = 0; //Never
	AsyncLock.DEFAULT_MAX_OCCUPATION_TIME = 0; //Never
	AsyncLock.DEFAULT_MAX_EXECUTION_TIME = 0; //Never
	AsyncLock.DEFAULT_MAX_PENDING = 1000;

	/**
	 * Acquire Locks
	 *
	 * @param {String|Array} key 	resource key or keys to lock
	 * @param {function} fn 	async function
	 * @param {function} cb 	callback function, otherwise will return a promise
	 * @param {Object} opts 	options
	 */
	AsyncLock.prototype.acquire = function (key, fn, cb, opts) {
		if (Array.isArray(key)) {
			return this._acquireBatch(key, fn, cb, opts);
		}

		if (typeof (fn) !== 'function') {
			throw new Error('You must pass a function to execute');
		}

		// faux-deferred promise using new Promise() (as Promise.defer is deprecated)
		var deferredResolve = null;
		var deferredReject = null;
		var deferred = null;

		if (typeof (cb) !== 'function') {
			opts = cb;
			cb = null;

			// will return a promise
			deferred = new this.Promise(function(resolve, reject) {
				deferredResolve = resolve;
				deferredReject = reject;
			});
		}

		opts = opts || {};

		var resolved = false;
		var timer = null;
		var occupationTimer = null;
		var executionTimer = null;
		var self = this;

		var done = function (locked, err, ret) {

			if (occupationTimer) {
				clearTimeout(occupationTimer);
				occupationTimer = null;
			}

			if (executionTimer) {
				clearTimeout(executionTimer);
				executionTimer = null;
			}

			if (locked) {
				if (!!self.queues[key] && self.queues[key].length === 0) {
					delete self.queues[key];
				}
				if (self.domainReentrant) {
					delete self.domains[key];
				}
			}

			if (!resolved) {
				if (!deferred) {
					if (typeof (cb) === 'function') {
						cb(err, ret);
					}
				}
				else {
					//promise mode
					if (err) {
						deferredReject(err);
					}
					else {
						deferredResolve(ret);
					}
				}
				resolved = true;
			}

			if (locked) {
				//run next func
				if (!!self.queues[key] && self.queues[key].length > 0) {
					self.queues[key].shift()();
				}
			}
		};

		var exec = function (locked) {
			if (resolved) { // may due to timed out
				return done(locked);
			}

			if (timer) {
				clearTimeout(timer);
				timer = null;
			}

			if (self.domainReentrant && locked) {
				self.domains[key] = process.domain;
			}

			var maxExecutionTime = opts.maxExecutionTime || self.maxExecutionTime;
			if (maxExecutionTime) {
				executionTimer = setTimeout(function () {
					if (!!self.queues[key]) {
						done(locked, new Error('Maximum execution time is exceeded ' + key));
					}
				}, maxExecutionTime);
			}

			// Callback mode
			if (fn.length === 1) {
				var called = false;
				try {
					fn(function (err, ret) {
						if (!called) {
							called = true;
							done(locked, err, ret);
						}
					});
				} catch (err) {
					// catching error thrown in user function fn
					if (!called) {
						called = true;
						done(locked, err);
					}
				}
			}
			else {
				// Promise mode
				self._promiseTry(function () {
					return fn();
				})
				.then(function(ret){
					done(locked, undefined, ret);
				}, function(error){
					done(locked, error);
				});
			}
		};

		if (self.domainReentrant && !!process.domain) {
			exec = process.domain.bind(exec);
		}

		var maxPending = opts.maxPending || self.maxPending;

		if (!self.queues[key]) {
			self.queues[key] = [];
			exec(true);
		}
		else if (self.domainReentrant && !!process.domain && process.domain === self.domains[key]) {
			// If code is in the same domain of current running task, run it directly
			// Since lock is re-enterable
			exec(false);
		}
		else if (self.queues[key].length >= maxPending) {
			done(false, new Error('Too many pending tasks in queue ' + key));
		}
		else {
			var taskFn = function () {
				exec(true);
			};
			if (opts.skipQueue) {
				self.queues[key].unshift(taskFn);
			} else {
				self.queues[key].push(taskFn);
			}

			var timeout = opts.timeout || self.timeout;
			if (timeout) {
				timer = setTimeout(function () {
					timer = null;
					done(false, new Error('async-lock timed out in queue ' + key));
				}, timeout);
			}
		}

		var maxOccupationTime = opts.maxOccupationTime || self.maxOccupationTime;
			if (maxOccupationTime) {
				occupationTimer = setTimeout(function () {
					if (!!self.queues[key]) {
						done(false, new Error('Maximum occupation time is exceeded in queue ' + key));
					}
				}, maxOccupationTime);
			}

		if (deferred) {
			return deferred;
		}
	};

	/*
	 * Below is how this function works:
	 *
	 * Equivalent code:
	 * self.acquire(key1, function(cb){
	 *     self.acquire(key2, function(cb){
	 *         self.acquire(key3, fn, cb);
	 *     }, cb);
	 * }, cb);
	 *
	 * Equivalent code:
	 * var fn3 = getFn(key3, fn);
	 * var fn2 = getFn(key2, fn3);
	 * var fn1 = getFn(key1, fn2);
	 * fn1(cb);
	 */
	AsyncLock.prototype._acquireBatch = function (keys, fn, cb, opts) {
		if (typeof (cb) !== 'function') {
			opts = cb;
			cb = null;
		}

		var self = this;
		var getFn = function (key, fn) {
			return function (cb) {
				self.acquire(key, fn, cb, opts);
			};
		};

		var fnx = keys.reduceRight(function (prev, key) {
			return getFn(key, prev);
		}, fn);

		if (typeof (cb) === 'function') {
			fnx(cb);
		}
		else {
			return new this.Promise(function (resolve, reject) {
				// check for promise mode in case keys is empty array
				if (fnx.length === 1) {
					fnx(function (err, ret) {
						if (err) {
							reject(err);
						}
						else {
							resolve(ret);
						}
					});
				} else {
					resolve(fnx());
				}
			});
		}
	};

	/*
	 *	Whether there is any running or pending asyncFunc
	 *
	 *	@param {String} key
	 */
	AsyncLock.prototype.isBusy = function (key) {
		if (!key) {
			return Object.keys(this.queues).length > 0;
		}
		else {
			return !!this.queues[key];
		}
	};

	/**
	 * Promise.try() implementation to become independent of Q-specific methods
	 */
	AsyncLock.prototype._promiseTry = function(fn) {
		try {
			return this.Promise.resolve(fn());
		} catch (e) {
			return this.Promise.reject(e);
		}
	};

	lib$1 = AsyncLock;
	return lib$1;
}

var asyncLock;
var hasRequiredAsyncLock;

function requireAsyncLock () {
	if (hasRequiredAsyncLock) return asyncLock;
	hasRequiredAsyncLock = 1;
	asyncLock = requireLib$1();
	return asyncLock;
}

var inherits_browser = {exports: {}};

var hasRequiredInherits_browser;

function requireInherits_browser () {
	if (hasRequiredInherits_browser) return inherits_browser.exports;
	hasRequiredInherits_browser = 1;
	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  inherits_browser.exports = function inherits(ctor, superCtor) {
	    if (superCtor) {
	      ctor.super_ = superCtor;
	      ctor.prototype = Object.create(superCtor.prototype, {
	        constructor: {
	          value: ctor,
	          enumerable: false,
	          writable: true,
	          configurable: true
	        }
	      });
	    }
	  };
	} else {
	  // old school shim for old browsers
	  inherits_browser.exports = function inherits(ctor, superCtor) {
	    if (superCtor) {
	      ctor.super_ = superCtor;
	      var TempCtor = function () {};
	      TempCtor.prototype = superCtor.prototype;
	      ctor.prototype = new TempCtor();
	      ctor.prototype.constructor = ctor;
	    }
	  };
	}
	return inherits_browser.exports;
}

var safeBuffer = {exports: {}};

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

var hasRequiredSafeBuffer;

function requireSafeBuffer () {
	if (hasRequiredSafeBuffer) return safeBuffer.exports;
	hasRequiredSafeBuffer = 1;
	(function (module, exports$1) {
		/* eslint-disable node/no-deprecated-api */
		var buffer = requireBuffer();
		var Buffer = buffer.Buffer;

		// alternative to using Object.keys for old browsers
		function copyProps (src, dst) {
		  for (var key in src) {
		    dst[key] = src[key];
		  }
		}
		if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
		  module.exports = buffer;
		} else {
		  // Copy properties from require('buffer')
		  copyProps(buffer, exports$1);
		  exports$1.Buffer = SafeBuffer;
		}

		function SafeBuffer (arg, encodingOrOffset, length) {
		  return Buffer(arg, encodingOrOffset, length)
		}

		SafeBuffer.prototype = Object.create(Buffer.prototype);

		// Copy static methods from Buffer
		copyProps(Buffer, SafeBuffer);

		SafeBuffer.from = function (arg, encodingOrOffset, length) {
		  if (typeof arg === 'number') {
		    throw new TypeError('Argument must not be a number')
		  }
		  return Buffer(arg, encodingOrOffset, length)
		};

		SafeBuffer.alloc = function (size, fill, encoding) {
		  if (typeof size !== 'number') {
		    throw new TypeError('Argument must be a number')
		  }
		  var buf = Buffer(size);
		  if (fill !== undefined) {
		    if (typeof encoding === 'string') {
		      buf.fill(fill, encoding);
		    } else {
		      buf.fill(fill);
		    }
		  } else {
		    buf.fill(0);
		  }
		  return buf
		};

		SafeBuffer.allocUnsafe = function (size) {
		  if (typeof size !== 'number') {
		    throw new TypeError('Argument must be a number')
		  }
		  return Buffer(size)
		};

		SafeBuffer.allocUnsafeSlow = function (size) {
		  if (typeof size !== 'number') {
		    throw new TypeError('Argument must be a number')
		  }
		  return buffer.SlowBuffer(size)
		}; 
	} (safeBuffer, safeBuffer.exports));
	return safeBuffer.exports;
}

var isarray;
var hasRequiredIsarray;

function requireIsarray () {
	if (hasRequiredIsarray) return isarray;
	hasRequiredIsarray = 1;
	var toString = {}.toString;

	isarray = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};
	return isarray;
}

var type;
var hasRequiredType;

function requireType () {
	if (hasRequiredType) return type;
	hasRequiredType = 1;

	/** @type {import('./type')} */
	type = TypeError;
	return type;
}

var esObjectAtoms;
var hasRequiredEsObjectAtoms;

function requireEsObjectAtoms () {
	if (hasRequiredEsObjectAtoms) return esObjectAtoms;
	hasRequiredEsObjectAtoms = 1;

	/** @type {import('.')} */
	esObjectAtoms = Object;
	return esObjectAtoms;
}

var esErrors;
var hasRequiredEsErrors;

function requireEsErrors () {
	if (hasRequiredEsErrors) return esErrors;
	hasRequiredEsErrors = 1;

	/** @type {import('.')} */
	esErrors = Error;
	return esErrors;
}

var _eval;
var hasRequired_eval;

function require_eval () {
	if (hasRequired_eval) return _eval;
	hasRequired_eval = 1;

	/** @type {import('./eval')} */
	_eval = EvalError;
	return _eval;
}

var range;
var hasRequiredRange;

function requireRange () {
	if (hasRequiredRange) return range;
	hasRequiredRange = 1;

	/** @type {import('./range')} */
	range = RangeError;
	return range;
}

var ref;
var hasRequiredRef;

function requireRef () {
	if (hasRequiredRef) return ref;
	hasRequiredRef = 1;

	/** @type {import('./ref')} */
	ref = ReferenceError;
	return ref;
}

var syntax;
var hasRequiredSyntax;

function requireSyntax () {
	if (hasRequiredSyntax) return syntax;
	hasRequiredSyntax = 1;

	/** @type {import('./syntax')} */
	syntax = SyntaxError;
	return syntax;
}

var uri;
var hasRequiredUri;

function requireUri () {
	if (hasRequiredUri) return uri;
	hasRequiredUri = 1;

	/** @type {import('./uri')} */
	uri = URIError;
	return uri;
}

var abs;
var hasRequiredAbs;

function requireAbs () {
	if (hasRequiredAbs) return abs;
	hasRequiredAbs = 1;

	/** @type {import('./abs')} */
	abs = Math.abs;
	return abs;
}

var floor;
var hasRequiredFloor;

function requireFloor () {
	if (hasRequiredFloor) return floor;
	hasRequiredFloor = 1;

	/** @type {import('./floor')} */
	floor = Math.floor;
	return floor;
}

var max;
var hasRequiredMax;

function requireMax () {
	if (hasRequiredMax) return max;
	hasRequiredMax = 1;

	/** @type {import('./max')} */
	max = Math.max;
	return max;
}

var min;
var hasRequiredMin;

function requireMin () {
	if (hasRequiredMin) return min;
	hasRequiredMin = 1;

	/** @type {import('./min')} */
	min = Math.min;
	return min;
}

var pow;
var hasRequiredPow;

function requirePow () {
	if (hasRequiredPow) return pow;
	hasRequiredPow = 1;

	/** @type {import('./pow')} */
	pow = Math.pow;
	return pow;
}

var round;
var hasRequiredRound;

function requireRound () {
	if (hasRequiredRound) return round;
	hasRequiredRound = 1;

	/** @type {import('./round')} */
	round = Math.round;
	return round;
}

var _isNaN;
var hasRequired_isNaN;

function require_isNaN () {
	if (hasRequired_isNaN) return _isNaN;
	hasRequired_isNaN = 1;

	/** @type {import('./isNaN')} */
	_isNaN = Number.isNaN || function isNaN(a) {
		return a !== a;
	};
	return _isNaN;
}

var sign;
var hasRequiredSign;

function requireSign () {
	if (hasRequiredSign) return sign;
	hasRequiredSign = 1;

	var $isNaN = /*@__PURE__*/ require_isNaN();

	/** @type {import('./sign')} */
	sign = function sign(number) {
		if ($isNaN(number) || number === 0) {
			return number;
		}
		return number < 0 ? -1 : 1;
	};
	return sign;
}

var gOPD;
var hasRequiredGOPD;

function requireGOPD () {
	if (hasRequiredGOPD) return gOPD;
	hasRequiredGOPD = 1;

	/** @type {import('./gOPD')} */
	gOPD = Object.getOwnPropertyDescriptor;
	return gOPD;
}

var gopd;
var hasRequiredGopd;

function requireGopd () {
	if (hasRequiredGopd) return gopd;
	hasRequiredGopd = 1;

	/** @type {import('.')} */
	var $gOPD = /*@__PURE__*/ requireGOPD();

	if ($gOPD) {
		try {
			$gOPD([], 'length');
		} catch (e) {
			// IE 8 has a broken gOPD
			$gOPD = null;
		}
	}

	gopd = $gOPD;
	return gopd;
}

var esDefineProperty;
var hasRequiredEsDefineProperty;

function requireEsDefineProperty () {
	if (hasRequiredEsDefineProperty) return esDefineProperty;
	hasRequiredEsDefineProperty = 1;

	/** @type {import('.')} */
	var $defineProperty = Object.defineProperty || false;
	if ($defineProperty) {
		try {
			$defineProperty({}, 'a', { value: 1 });
		} catch (e) {
			// IE 8 has a broken defineProperty
			$defineProperty = false;
		}
	}

	esDefineProperty = $defineProperty;
	return esDefineProperty;
}

var shams$1;
var hasRequiredShams$1;

function requireShams$1 () {
	if (hasRequiredShams$1) return shams$1;
	hasRequiredShams$1 = 1;

	/** @type {import('./shams')} */
	/* eslint complexity: [2, 18], max-statements: [2, 33] */
	shams$1 = function hasSymbols() {
		if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
		if (typeof Symbol.iterator === 'symbol') { return true; }

		/** @type {{ [k in symbol]?: unknown }} */
		var obj = {};
		var sym = Symbol('test');
		var symObj = Object(sym);
		if (typeof sym === 'string') { return false; }

		if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
		if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

		// temp disabled per https://github.com/ljharb/object.assign/issues/17
		// if (sym instanceof Symbol) { return false; }
		// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
		// if (!(symObj instanceof Symbol)) { return false; }

		// if (typeof Symbol.prototype.toString !== 'function') { return false; }
		// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

		var symVal = 42;
		obj[sym] = symVal;
		for (var _ in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
		if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

		if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

		var syms = Object.getOwnPropertySymbols(obj);
		if (syms.length !== 1 || syms[0] !== sym) { return false; }

		if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

		if (typeof Object.getOwnPropertyDescriptor === 'function') {
			// eslint-disable-next-line no-extra-parens
			var descriptor = /** @type {PropertyDescriptor} */ (Object.getOwnPropertyDescriptor(obj, sym));
			if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
		}

		return true;
	};
	return shams$1;
}

var hasSymbols;
var hasRequiredHasSymbols;

function requireHasSymbols () {
	if (hasRequiredHasSymbols) return hasSymbols;
	hasRequiredHasSymbols = 1;

	var origSymbol = typeof Symbol !== 'undefined' && Symbol;
	var hasSymbolSham = requireShams$1();

	/** @type {import('.')} */
	hasSymbols = function hasNativeSymbols() {
		if (typeof origSymbol !== 'function') { return false; }
		if (typeof Symbol !== 'function') { return false; }
		if (typeof origSymbol('foo') !== 'symbol') { return false; }
		if (typeof Symbol('bar') !== 'symbol') { return false; }

		return hasSymbolSham();
	};
	return hasSymbols;
}

var Reflect_getPrototypeOf;
var hasRequiredReflect_getPrototypeOf;

function requireReflect_getPrototypeOf () {
	if (hasRequiredReflect_getPrototypeOf) return Reflect_getPrototypeOf;
	hasRequiredReflect_getPrototypeOf = 1;

	/** @type {import('./Reflect.getPrototypeOf')} */
	Reflect_getPrototypeOf = (typeof Reflect !== 'undefined' && Reflect.getPrototypeOf) || null;
	return Reflect_getPrototypeOf;
}

var Object_getPrototypeOf;
var hasRequiredObject_getPrototypeOf;

function requireObject_getPrototypeOf () {
	if (hasRequiredObject_getPrototypeOf) return Object_getPrototypeOf;
	hasRequiredObject_getPrototypeOf = 1;

	var $Object = /*@__PURE__*/ requireEsObjectAtoms();

	/** @type {import('./Object.getPrototypeOf')} */
	Object_getPrototypeOf = $Object.getPrototypeOf || null;
	return Object_getPrototypeOf;
}

var implementation;
var hasRequiredImplementation;

function requireImplementation () {
	if (hasRequiredImplementation) return implementation;
	hasRequiredImplementation = 1;

	/* eslint no-invalid-this: 1 */

	var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
	var toStr = Object.prototype.toString;
	var max = Math.max;
	var funcType = '[object Function]';

	var concatty = function concatty(a, b) {
	    var arr = [];

	    for (var i = 0; i < a.length; i += 1) {
	        arr[i] = a[i];
	    }
	    for (var j = 0; j < b.length; j += 1) {
	        arr[j + a.length] = b[j];
	    }

	    return arr;
	};

	var slicy = function slicy(arrLike, offset) {
	    var arr = [];
	    for (var i = offset, j = 0; i < arrLike.length; i += 1, j += 1) {
	        arr[j] = arrLike[i];
	    }
	    return arr;
	};

	var joiny = function (arr, joiner) {
	    var str = '';
	    for (var i = 0; i < arr.length; i += 1) {
	        str += arr[i];
	        if (i + 1 < arr.length) {
	            str += joiner;
	        }
	    }
	    return str;
	};

	implementation = function bind(that) {
	    var target = this;
	    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
	        throw new TypeError(ERROR_MESSAGE + target);
	    }
	    var args = slicy(arguments, 1);

	    var bound;
	    var binder = function () {
	        if (this instanceof bound) {
	            var result = target.apply(
	                this,
	                concatty(args, arguments)
	            );
	            if (Object(result) === result) {
	                return result;
	            }
	            return this;
	        }
	        return target.apply(
	            that,
	            concatty(args, arguments)
	        );

	    };

	    var boundLength = max(0, target.length - args.length);
	    var boundArgs = [];
	    for (var i = 0; i < boundLength; i++) {
	        boundArgs[i] = '$' + i;
	    }

	    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

	    if (target.prototype) {
	        var Empty = function Empty() {};
	        Empty.prototype = target.prototype;
	        bound.prototype = new Empty();
	        Empty.prototype = null;
	    }

	    return bound;
	};
	return implementation;
}

var functionBind;
var hasRequiredFunctionBind;

function requireFunctionBind () {
	if (hasRequiredFunctionBind) return functionBind;
	hasRequiredFunctionBind = 1;

	var implementation = requireImplementation();

	functionBind = Function.prototype.bind || implementation;
	return functionBind;
}

var functionCall;
var hasRequiredFunctionCall;

function requireFunctionCall () {
	if (hasRequiredFunctionCall) return functionCall;
	hasRequiredFunctionCall = 1;

	/** @type {import('./functionCall')} */
	functionCall = Function.prototype.call;
	return functionCall;
}

var functionApply;
var hasRequiredFunctionApply;

function requireFunctionApply () {
	if (hasRequiredFunctionApply) return functionApply;
	hasRequiredFunctionApply = 1;

	/** @type {import('./functionApply')} */
	functionApply = Function.prototype.apply;
	return functionApply;
}

var reflectApply;
var hasRequiredReflectApply;

function requireReflectApply () {
	if (hasRequiredReflectApply) return reflectApply;
	hasRequiredReflectApply = 1;

	/** @type {import('./reflectApply')} */
	reflectApply = typeof Reflect !== 'undefined' && Reflect && Reflect.apply;
	return reflectApply;
}

var actualApply;
var hasRequiredActualApply;

function requireActualApply () {
	if (hasRequiredActualApply) return actualApply;
	hasRequiredActualApply = 1;

	var bind = requireFunctionBind();

	var $apply = requireFunctionApply();
	var $call = requireFunctionCall();
	var $reflectApply = requireReflectApply();

	/** @type {import('./actualApply')} */
	actualApply = $reflectApply || bind.call($call, $apply);
	return actualApply;
}

var callBindApplyHelpers;
var hasRequiredCallBindApplyHelpers;

function requireCallBindApplyHelpers () {
	if (hasRequiredCallBindApplyHelpers) return callBindApplyHelpers;
	hasRequiredCallBindApplyHelpers = 1;

	var bind = requireFunctionBind();
	var $TypeError = /*@__PURE__*/ requireType();

	var $call = requireFunctionCall();
	var $actualApply = requireActualApply();

	/** @type {(args: [Function, thisArg?: unknown, ...args: unknown[]]) => Function} TODO FIXME, find a way to use import('.') */
	callBindApplyHelpers = function callBindBasic(args) {
		if (args.length < 1 || typeof args[0] !== 'function') {
			throw new $TypeError('a function is required');
		}
		return $actualApply(bind, $call, args);
	};
	return callBindApplyHelpers;
}

var get;
var hasRequiredGet;

function requireGet () {
	if (hasRequiredGet) return get;
	hasRequiredGet = 1;

	var callBind = requireCallBindApplyHelpers();
	var gOPD = /*@__PURE__*/ requireGopd();

	var hasProtoAccessor;
	try {
		// eslint-disable-next-line no-extra-parens, no-proto
		hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */ ([]).__proto__ === Array.prototype;
	} catch (e) {
		if (!e || typeof e !== 'object' || !('code' in e) || e.code !== 'ERR_PROTO_ACCESS') {
			throw e;
		}
	}

	// eslint-disable-next-line no-extra-parens
	var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, /** @type {keyof typeof Object.prototype} */ ('__proto__'));

	var $Object = Object;
	var $getPrototypeOf = $Object.getPrototypeOf;

	/** @type {import('./get')} */
	get = desc && typeof desc.get === 'function'
		? callBind([desc.get])
		: typeof $getPrototypeOf === 'function'
			? /** @type {import('./get')} */ function getDunder(value) {
				// eslint-disable-next-line eqeqeq
				return $getPrototypeOf(value == null ? value : $Object(value));
			}
			: false;
	return get;
}

var getProto;
var hasRequiredGetProto;

function requireGetProto () {
	if (hasRequiredGetProto) return getProto;
	hasRequiredGetProto = 1;

	var reflectGetProto = requireReflect_getPrototypeOf();
	var originalGetProto = requireObject_getPrototypeOf();

	var getDunderProto = /*@__PURE__*/ requireGet();

	/** @type {import('.')} */
	getProto = reflectGetProto
		? function getProto(O) {
			// @ts-expect-error TS can't narrow inside a closure, for some reason
			return reflectGetProto(O);
		}
		: originalGetProto
			? function getProto(O) {
				if (!O || (typeof O !== 'object' && typeof O !== 'function')) {
					throw new TypeError('getProto: not an object');
				}
				// @ts-expect-error TS can't narrow inside a closure, for some reason
				return originalGetProto(O);
			}
			: getDunderProto
				? function getProto(O) {
					// @ts-expect-error TS can't narrow inside a closure, for some reason
					return getDunderProto(O);
				}
				: null;
	return getProto;
}

var hasown;
var hasRequiredHasown;

function requireHasown () {
	if (hasRequiredHasown) return hasown;
	hasRequiredHasown = 1;

	var call = Function.prototype.call;
	var $hasOwn = Object.prototype.hasOwnProperty;
	var bind = requireFunctionBind();

	/** @type {import('.')} */
	hasown = bind.call(call, $hasOwn);
	return hasown;
}

var getIntrinsic;
var hasRequiredGetIntrinsic;

function requireGetIntrinsic () {
	if (hasRequiredGetIntrinsic) return getIntrinsic;
	hasRequiredGetIntrinsic = 1;

	var undefined$1;

	var $Object = /*@__PURE__*/ requireEsObjectAtoms();

	var $Error = /*@__PURE__*/ requireEsErrors();
	var $EvalError = /*@__PURE__*/ require_eval();
	var $RangeError = /*@__PURE__*/ requireRange();
	var $ReferenceError = /*@__PURE__*/ requireRef();
	var $SyntaxError = /*@__PURE__*/ requireSyntax();
	var $TypeError = /*@__PURE__*/ requireType();
	var $URIError = /*@__PURE__*/ requireUri();

	var abs = /*@__PURE__*/ requireAbs();
	var floor = /*@__PURE__*/ requireFloor();
	var max = /*@__PURE__*/ requireMax();
	var min = /*@__PURE__*/ requireMin();
	var pow = /*@__PURE__*/ requirePow();
	var round = /*@__PURE__*/ requireRound();
	var sign = /*@__PURE__*/ requireSign();

	var $Function = Function;

	// eslint-disable-next-line consistent-return
	var getEvalledConstructor = function (expressionSyntax) {
		try {
			return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
		} catch (e) {}
	};

	var $gOPD = /*@__PURE__*/ requireGopd();
	var $defineProperty = /*@__PURE__*/ requireEsDefineProperty();

	var throwTypeError = function () {
		throw new $TypeError();
	};
	var ThrowTypeError = $gOPD
		? (function () {
			try {
				// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
				arguments.callee; // IE 8 does not throw here
				return throwTypeError;
			} catch (calleeThrows) {
				try {
					// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
					return $gOPD(arguments, 'callee').get;
				} catch (gOPDthrows) {
					return throwTypeError;
				}
			}
		}())
		: throwTypeError;

	var hasSymbols = requireHasSymbols()();

	var getProto = requireGetProto();
	var $ObjectGPO = requireObject_getPrototypeOf();
	var $ReflectGPO = requireReflect_getPrototypeOf();

	var $apply = requireFunctionApply();
	var $call = requireFunctionCall();

	var needsEval = {};

	var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined$1 : getProto(Uint8Array);

	var INTRINSICS = {
		__proto__: null,
		'%AggregateError%': typeof AggregateError === 'undefined' ? undefined$1 : AggregateError,
		'%Array%': Array,
		'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
		'%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined$1,
		'%AsyncFromSyncIteratorPrototype%': undefined$1,
		'%AsyncFunction%': needsEval,
		'%AsyncGenerator%': needsEval,
		'%AsyncGeneratorFunction%': needsEval,
		'%AsyncIteratorPrototype%': needsEval,
		'%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
		'%BigInt%': typeof BigInt === 'undefined' ? undefined$1 : BigInt,
		'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined$1 : BigInt64Array,
		'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined$1 : BigUint64Array,
		'%Boolean%': Boolean,
		'%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
		'%Date%': Date,
		'%decodeURI%': decodeURI,
		'%decodeURIComponent%': decodeURIComponent,
		'%encodeURI%': encodeURI,
		'%encodeURIComponent%': encodeURIComponent,
		'%Error%': $Error,
		'%eval%': eval, // eslint-disable-line no-eval
		'%EvalError%': $EvalError,
		'%Float16Array%': typeof Float16Array === 'undefined' ? undefined$1 : Float16Array,
		'%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
		'%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
		'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined$1 : FinalizationRegistry,
		'%Function%': $Function,
		'%GeneratorFunction%': needsEval,
		'%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
		'%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
		'%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
		'%isFinite%': isFinite,
		'%isNaN%': isNaN,
		'%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
		'%JSON%': typeof JSON === 'object' ? JSON : undefined$1,
		'%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
		'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined$1 : getProto(new Map()[Symbol.iterator]()),
		'%Math%': Math,
		'%Number%': Number,
		'%Object%': $Object,
		'%Object.getOwnPropertyDescriptor%': $gOPD,
		'%parseFloat%': parseFloat,
		'%parseInt%': parseInt,
		'%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
		'%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
		'%RangeError%': $RangeError,
		'%ReferenceError%': $ReferenceError,
		'%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
		'%RegExp%': RegExp,
		'%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
		'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined$1 : getProto(new Set()[Symbol.iterator]()),
		'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
		'%String%': String,
		'%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined$1,
		'%Symbol%': hasSymbols ? Symbol : undefined$1,
		'%SyntaxError%': $SyntaxError,
		'%ThrowTypeError%': ThrowTypeError,
		'%TypedArray%': TypedArray,
		'%TypeError%': $TypeError,
		'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
		'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
		'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
		'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
		'%URIError%': $URIError,
		'%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
		'%WeakRef%': typeof WeakRef === 'undefined' ? undefined$1 : WeakRef,
		'%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet,

		'%Function.prototype.call%': $call,
		'%Function.prototype.apply%': $apply,
		'%Object.defineProperty%': $defineProperty,
		'%Object.getPrototypeOf%': $ObjectGPO,
		'%Math.abs%': abs,
		'%Math.floor%': floor,
		'%Math.max%': max,
		'%Math.min%': min,
		'%Math.pow%': pow,
		'%Math.round%': round,
		'%Math.sign%': sign,
		'%Reflect.getPrototypeOf%': $ReflectGPO
	};

	if (getProto) {
		try {
			null.error; // eslint-disable-line no-unused-expressions
		} catch (e) {
			// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
			var errorProto = getProto(getProto(e));
			INTRINSICS['%Error.prototype%'] = errorProto;
		}
	}

	var doEval = function doEval(name) {
		var value;
		if (name === '%AsyncFunction%') {
			value = getEvalledConstructor('async function () {}');
		} else if (name === '%GeneratorFunction%') {
			value = getEvalledConstructor('function* () {}');
		} else if (name === '%AsyncGeneratorFunction%') {
			value = getEvalledConstructor('async function* () {}');
		} else if (name === '%AsyncGenerator%') {
			var fn = doEval('%AsyncGeneratorFunction%');
			if (fn) {
				value = fn.prototype;
			}
		} else if (name === '%AsyncIteratorPrototype%') {
			var gen = doEval('%AsyncGenerator%');
			if (gen && getProto) {
				value = getProto(gen.prototype);
			}
		}

		INTRINSICS[name] = value;

		return value;
	};

	var LEGACY_ALIASES = {
		__proto__: null,
		'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
		'%ArrayPrototype%': ['Array', 'prototype'],
		'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
		'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
		'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
		'%ArrayProto_values%': ['Array', 'prototype', 'values'],
		'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
		'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
		'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
		'%BooleanPrototype%': ['Boolean', 'prototype'],
		'%DataViewPrototype%': ['DataView', 'prototype'],
		'%DatePrototype%': ['Date', 'prototype'],
		'%ErrorPrototype%': ['Error', 'prototype'],
		'%EvalErrorPrototype%': ['EvalError', 'prototype'],
		'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
		'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
		'%FunctionPrototype%': ['Function', 'prototype'],
		'%Generator%': ['GeneratorFunction', 'prototype'],
		'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
		'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
		'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
		'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
		'%JSONParse%': ['JSON', 'parse'],
		'%JSONStringify%': ['JSON', 'stringify'],
		'%MapPrototype%': ['Map', 'prototype'],
		'%NumberPrototype%': ['Number', 'prototype'],
		'%ObjectPrototype%': ['Object', 'prototype'],
		'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
		'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
		'%PromisePrototype%': ['Promise', 'prototype'],
		'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
		'%Promise_all%': ['Promise', 'all'],
		'%Promise_reject%': ['Promise', 'reject'],
		'%Promise_resolve%': ['Promise', 'resolve'],
		'%RangeErrorPrototype%': ['RangeError', 'prototype'],
		'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
		'%RegExpPrototype%': ['RegExp', 'prototype'],
		'%SetPrototype%': ['Set', 'prototype'],
		'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
		'%StringPrototype%': ['String', 'prototype'],
		'%SymbolPrototype%': ['Symbol', 'prototype'],
		'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
		'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
		'%TypeErrorPrototype%': ['TypeError', 'prototype'],
		'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
		'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
		'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
		'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
		'%URIErrorPrototype%': ['URIError', 'prototype'],
		'%WeakMapPrototype%': ['WeakMap', 'prototype'],
		'%WeakSetPrototype%': ['WeakSet', 'prototype']
	};

	var bind = requireFunctionBind();
	var hasOwn = /*@__PURE__*/ requireHasown();
	var $concat = bind.call($call, Array.prototype.concat);
	var $spliceApply = bind.call($apply, Array.prototype.splice);
	var $replace = bind.call($call, String.prototype.replace);
	var $strSlice = bind.call($call, String.prototype.slice);
	var $exec = bind.call($call, RegExp.prototype.exec);

	/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
	var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
	var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
	var stringToPath = function stringToPath(string) {
		var first = $strSlice(string, 0, 1);
		var last = $strSlice(string, -1);
		if (first === '%' && last !== '%') {
			throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
		} else if (last === '%' && first !== '%') {
			throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
		}
		var result = [];
		$replace(string, rePropName, function (match, number, quote, subString) {
			result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
		});
		return result;
	};
	/* end adaptation */

	var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
		var intrinsicName = name;
		var alias;
		if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
			alias = LEGACY_ALIASES[intrinsicName];
			intrinsicName = '%' + alias[0] + '%';
		}

		if (hasOwn(INTRINSICS, intrinsicName)) {
			var value = INTRINSICS[intrinsicName];
			if (value === needsEval) {
				value = doEval(intrinsicName);
			}
			if (typeof value === 'undefined' && !allowMissing) {
				throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
			}

			return {
				alias: alias,
				name: intrinsicName,
				value: value
			};
		}

		throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
	};

	getIntrinsic = function GetIntrinsic(name, allowMissing) {
		if (typeof name !== 'string' || name.length === 0) {
			throw new $TypeError('intrinsic name must be a non-empty string');
		}
		if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
			throw new $TypeError('"allowMissing" argument must be a boolean');
		}

		if ($exec(/^%?[^%]*%?$/, name) === null) {
			throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
		}
		var parts = stringToPath(name);
		var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

		var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
		var intrinsicRealName = intrinsic.name;
		var value = intrinsic.value;
		var skipFurtherCaching = false;

		var alias = intrinsic.alias;
		if (alias) {
			intrinsicBaseName = alias[0];
			$spliceApply(parts, $concat([0, 1], alias));
		}

		for (var i = 1, isOwn = true; i < parts.length; i += 1) {
			var part = parts[i];
			var first = $strSlice(part, 0, 1);
			var last = $strSlice(part, -1);
			if (
				(
					(first === '"' || first === "'" || first === '`')
					|| (last === '"' || last === "'" || last === '`')
				)
				&& first !== last
			) {
				throw new $SyntaxError('property names with quotes must have matching quotes');
			}
			if (part === 'constructor' || !isOwn) {
				skipFurtherCaching = true;
			}

			intrinsicBaseName += '.' + part;
			intrinsicRealName = '%' + intrinsicBaseName + '%';

			if (hasOwn(INTRINSICS, intrinsicRealName)) {
				value = INTRINSICS[intrinsicRealName];
			} else if (value != null) {
				if (!(part in value)) {
					if (!allowMissing) {
						throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
					}
					return void undefined$1;
				}
				if ($gOPD && (i + 1) >= parts.length) {
					var desc = $gOPD(value, part);
					isOwn = !!desc;

					// By convention, when a data property is converted to an accessor
					// property to emulate a data property that does not suffer from
					// the override mistake, that accessor's getter is marked with
					// an `originalValue` property. Here, when we detect this, we
					// uphold the illusion by pretending to see that original data
					// property, i.e., returning the value rather than the getter
					// itself.
					if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
						value = desc.get;
					} else {
						value = value[part];
					}
				} else {
					isOwn = hasOwn(value, part);
					value = value[part];
				}

				if (isOwn && !skipFurtherCaching) {
					INTRINSICS[intrinsicRealName] = value;
				}
			}
		}
		return value;
	};
	return getIntrinsic;
}

var callBound;
var hasRequiredCallBound;

function requireCallBound () {
	if (hasRequiredCallBound) return callBound;
	hasRequiredCallBound = 1;

	var GetIntrinsic = /*@__PURE__*/ requireGetIntrinsic();

	var callBindBasic = requireCallBindApplyHelpers();

	/** @type {(thisArg: string, searchString: string, position?: number) => number} */
	var $indexOf = callBindBasic([GetIntrinsic('%String.prototype.indexOf%')]);

	/** @type {import('.')} */
	callBound = function callBoundIntrinsic(name, allowMissing) {
		/* eslint no-extra-parens: 0 */

		var intrinsic = /** @type {(this: unknown, ...args: unknown[]) => unknown} */ (GetIntrinsic(name, !!allowMissing));
		if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
			return callBindBasic(/** @type {const} */ ([intrinsic]));
		}
		return intrinsic;
	};
	return callBound;
}

var isCallable;
var hasRequiredIsCallable;

function requireIsCallable () {
	if (hasRequiredIsCallable) return isCallable;
	hasRequiredIsCallable = 1;

	var fnToStr = Function.prototype.toString;
	var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply;
	var badArrayLike;
	var isCallableMarker;
	if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
		try {
			badArrayLike = Object.defineProperty({}, 'length', {
				get: function () {
					throw isCallableMarker;
				}
			});
			isCallableMarker = {};
			// eslint-disable-next-line no-throw-literal
			reflectApply(function () { throw 42; }, null, badArrayLike);
		} catch (_) {
			if (_ !== isCallableMarker) {
				reflectApply = null;
			}
		}
	} else {
		reflectApply = null;
	}

	var constructorRegex = /^\s*class\b/;
	var isES6ClassFn = function isES6ClassFunction(value) {
		try {
			var fnStr = fnToStr.call(value);
			return constructorRegex.test(fnStr);
		} catch (e) {
			return false; // not a function
		}
	};

	var tryFunctionObject = function tryFunctionToStr(value) {
		try {
			if (isES6ClassFn(value)) { return false; }
			fnToStr.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var toStr = Object.prototype.toString;
	var objectClass = '[object Object]';
	var fnClass = '[object Function]';
	var genClass = '[object GeneratorFunction]';
	var ddaClass = '[object HTMLAllCollection]'; // IE 11
	var ddaClass2 = '[object HTML document.all class]';
	var ddaClass3 = '[object HTMLCollection]'; // IE 9-10
	var hasToStringTag = typeof Symbol === 'function' && !!Symbol.toStringTag; // better: use `has-tostringtag`

	var isIE68 = !(0 in [,]); // eslint-disable-line no-sparse-arrays, comma-spacing

	var isDDA = function isDocumentDotAll() { return false; };
	if (typeof document === 'object') {
		// Firefox 3 canonicalizes DDA to undefined when it's not accessed directly
		var all = document.all;
		if (toStr.call(all) === toStr.call(document.all)) {
			isDDA = function isDocumentDotAll(value) {
				/* globals document: false */
				// in IE 6-8, typeof document.all is "object" and it's truthy
				if ((isIE68 || !value) && (typeof value === 'undefined' || typeof value === 'object')) {
					try {
						var str = toStr.call(value);
						return (
							str === ddaClass
							|| str === ddaClass2
							|| str === ddaClass3 // opera 12.16
							|| str === objectClass // IE 6-8
						) && value('') == null; // eslint-disable-line eqeqeq
					} catch (e) { /**/ }
				}
				return false;
			};
		}
	}

	isCallable = reflectApply
		? function isCallable(value) {
			if (isDDA(value)) { return true; }
			if (!value) { return false; }
			if (typeof value !== 'function' && typeof value !== 'object') { return false; }
			try {
				reflectApply(value, null, badArrayLike);
			} catch (e) {
				if (e !== isCallableMarker) { return false; }
			}
			return !isES6ClassFn(value) && tryFunctionObject(value);
		}
		: function isCallable(value) {
			if (isDDA(value)) { return true; }
			if (!value) { return false; }
			if (typeof value !== 'function' && typeof value !== 'object') { return false; }
			if (hasToStringTag) { return tryFunctionObject(value); }
			if (isES6ClassFn(value)) { return false; }
			var strClass = toStr.call(value);
			if (strClass !== fnClass && strClass !== genClass && !(/^\[object HTML/).test(strClass)) { return false; }
			return tryFunctionObject(value);
		};
	return isCallable;
}

var forEach;
var hasRequiredForEach;

function requireForEach () {
	if (hasRequiredForEach) return forEach;
	hasRequiredForEach = 1;

	var isCallable = requireIsCallable();

	var toStr = Object.prototype.toString;
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/** @type {<This, A extends readonly unknown[]>(arr: A, iterator: (this: This | void, value: A[number], index: number, arr: A) => void, receiver: This | undefined) => void} */
	var forEachArray = function forEachArray(array, iterator, receiver) {
	    for (var i = 0, len = array.length; i < len; i++) {
	        if (hasOwnProperty.call(array, i)) {
	            if (receiver == null) {
	                iterator(array[i], i, array);
	            } else {
	                iterator.call(receiver, array[i], i, array);
	            }
	        }
	    }
	};

	/** @type {<This, S extends string>(string: S, iterator: (this: This | void, value: S[number], index: number, string: S) => void, receiver: This | undefined) => void} */
	var forEachString = function forEachString(string, iterator, receiver) {
	    for (var i = 0, len = string.length; i < len; i++) {
	        // no such thing as a sparse string.
	        if (receiver == null) {
	            iterator(string.charAt(i), i, string);
	        } else {
	            iterator.call(receiver, string.charAt(i), i, string);
	        }
	    }
	};

	/** @type {<This, O>(obj: O, iterator: (this: This | void, value: O[keyof O], index: keyof O, obj: O) => void, receiver: This | undefined) => void} */
	var forEachObject = function forEachObject(object, iterator, receiver) {
	    for (var k in object) {
	        if (hasOwnProperty.call(object, k)) {
	            if (receiver == null) {
	                iterator(object[k], k, object);
	            } else {
	                iterator.call(receiver, object[k], k, object);
	            }
	        }
	    }
	};

	/** @type {(x: unknown) => x is readonly unknown[]} */
	function isArray(x) {
	    return toStr.call(x) === '[object Array]';
	}

	/** @type {import('.')._internal} */
	forEach = function forEach(list, iterator, thisArg) {
	    if (!isCallable(iterator)) {
	        throw new TypeError('iterator must be a function');
	    }

	    var receiver;
	    if (arguments.length >= 3) {
	        receiver = thisArg;
	    }

	    if (isArray(list)) {
	        forEachArray(list, iterator, receiver);
	    } else if (typeof list === 'string') {
	        forEachString(list, iterator, receiver);
	    } else {
	        forEachObject(list, iterator, receiver);
	    }
	};
	return forEach;
}

var possibleTypedArrayNames;
var hasRequiredPossibleTypedArrayNames;

function requirePossibleTypedArrayNames () {
	if (hasRequiredPossibleTypedArrayNames) return possibleTypedArrayNames;
	hasRequiredPossibleTypedArrayNames = 1;

	/** @type {import('.')} */
	possibleTypedArrayNames = [
		'Float16Array',
		'Float32Array',
		'Float64Array',
		'Int8Array',
		'Int16Array',
		'Int32Array',
		'Uint8Array',
		'Uint8ClampedArray',
		'Uint16Array',
		'Uint32Array',
		'BigInt64Array',
		'BigUint64Array'
	];
	return possibleTypedArrayNames;
}

var availableTypedArrays;
var hasRequiredAvailableTypedArrays;

function requireAvailableTypedArrays () {
	if (hasRequiredAvailableTypedArrays) return availableTypedArrays;
	hasRequiredAvailableTypedArrays = 1;

	var possibleNames = /*@__PURE__*/ requirePossibleTypedArrayNames();

	var g = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;

	/** @type {import('.')} */
	availableTypedArrays = function availableTypedArrays() {
		var /** @type {ReturnType<typeof availableTypedArrays>} */ out = [];
		for (var i = 0; i < possibleNames.length; i++) {
			if (typeof g[possibleNames[i]] === 'function') {
				// @ts-expect-error
				out[out.length] = possibleNames[i];
			}
		}
		return out;
	};
	return availableTypedArrays;
}

var callBind = {exports: {}};

var defineDataProperty;
var hasRequiredDefineDataProperty;

function requireDefineDataProperty () {
	if (hasRequiredDefineDataProperty) return defineDataProperty;
	hasRequiredDefineDataProperty = 1;

	var $defineProperty = /*@__PURE__*/ requireEsDefineProperty();

	var $SyntaxError = /*@__PURE__*/ requireSyntax();
	var $TypeError = /*@__PURE__*/ requireType();

	var gopd = /*@__PURE__*/ requireGopd();

	/** @type {import('.')} */
	defineDataProperty = function defineDataProperty(
		obj,
		property,
		value
	) {
		if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
			throw new $TypeError('`obj` must be an object or a function`');
		}
		if (typeof property !== 'string' && typeof property !== 'symbol') {
			throw new $TypeError('`property` must be a string or a symbol`');
		}
		if (arguments.length > 3 && typeof arguments[3] !== 'boolean' && arguments[3] !== null) {
			throw new $TypeError('`nonEnumerable`, if provided, must be a boolean or null');
		}
		if (arguments.length > 4 && typeof arguments[4] !== 'boolean' && arguments[4] !== null) {
			throw new $TypeError('`nonWritable`, if provided, must be a boolean or null');
		}
		if (arguments.length > 5 && typeof arguments[5] !== 'boolean' && arguments[5] !== null) {
			throw new $TypeError('`nonConfigurable`, if provided, must be a boolean or null');
		}
		if (arguments.length > 6 && typeof arguments[6] !== 'boolean') {
			throw new $TypeError('`loose`, if provided, must be a boolean');
		}

		var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
		var nonWritable = arguments.length > 4 ? arguments[4] : null;
		var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
		var loose = arguments.length > 6 ? arguments[6] : false;

		/* @type {false | TypedPropertyDescriptor<unknown>} */
		var desc = !!gopd && gopd(obj, property);

		if ($defineProperty) {
			$defineProperty(obj, property, {
				configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
				enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
				value: value,
				writable: nonWritable === null && desc ? desc.writable : !nonWritable
			});
		} else if (loose || (!nonEnumerable && !nonWritable && !nonConfigurable)) {
			// must fall back to [[Set]], and was not explicitly asked to make non-enumerable, non-writable, or non-configurable
			obj[property] = value; // eslint-disable-line no-param-reassign
		} else {
			throw new $SyntaxError('This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.');
		}
	};
	return defineDataProperty;
}

var hasPropertyDescriptors_1;
var hasRequiredHasPropertyDescriptors;

function requireHasPropertyDescriptors () {
	if (hasRequiredHasPropertyDescriptors) return hasPropertyDescriptors_1;
	hasRequiredHasPropertyDescriptors = 1;

	var $defineProperty = /*@__PURE__*/ requireEsDefineProperty();

	var hasPropertyDescriptors = function hasPropertyDescriptors() {
		return !!$defineProperty;
	};

	hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
		// node v0.6 has a bug where array lengths can be Set but not Defined
		if (!$defineProperty) {
			return null;
		}
		try {
			return $defineProperty([], 'length', { value: 1 }).length !== 1;
		} catch (e) {
			// In Firefox 4-22, defining length on an array throws an exception.
			return true;
		}
	};

	hasPropertyDescriptors_1 = hasPropertyDescriptors;
	return hasPropertyDescriptors_1;
}

var setFunctionLength;
var hasRequiredSetFunctionLength;

function requireSetFunctionLength () {
	if (hasRequiredSetFunctionLength) return setFunctionLength;
	hasRequiredSetFunctionLength = 1;

	var GetIntrinsic = /*@__PURE__*/ requireGetIntrinsic();
	var define = /*@__PURE__*/ requireDefineDataProperty();
	var hasDescriptors = /*@__PURE__*/ requireHasPropertyDescriptors()();
	var gOPD = /*@__PURE__*/ requireGopd();

	var $TypeError = /*@__PURE__*/ requireType();
	var $floor = GetIntrinsic('%Math.floor%');

	/** @type {import('.')} */
	setFunctionLength = function setFunctionLength(fn, length) {
		if (typeof fn !== 'function') {
			throw new $TypeError('`fn` is not a function');
		}
		if (typeof length !== 'number' || length < 0 || length > 0xFFFFFFFF || $floor(length) !== length) {
			throw new $TypeError('`length` must be a positive 32-bit integer');
		}

		var loose = arguments.length > 2 && !!arguments[2];

		var functionLengthIsConfigurable = true;
		var functionLengthIsWritable = true;
		if ('length' in fn && gOPD) {
			var desc = gOPD(fn, 'length');
			if (desc && !desc.configurable) {
				functionLengthIsConfigurable = false;
			}
			if (desc && !desc.writable) {
				functionLengthIsWritable = false;
			}
		}

		if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
			if (hasDescriptors) {
				define(/** @type {Parameters<define>[0]} */ (fn), 'length', length, true, true);
			} else {
				define(/** @type {Parameters<define>[0]} */ (fn), 'length', length);
			}
		}
		return fn;
	};
	return setFunctionLength;
}

var applyBind;
var hasRequiredApplyBind;

function requireApplyBind () {
	if (hasRequiredApplyBind) return applyBind;
	hasRequiredApplyBind = 1;

	var bind = requireFunctionBind();
	var $apply = requireFunctionApply();
	var actualApply = requireActualApply();

	/** @type {import('./applyBind')} */
	applyBind = function applyBind() {
		return actualApply(bind, $apply, arguments);
	};
	return applyBind;
}

var hasRequiredCallBind;

function requireCallBind () {
	if (hasRequiredCallBind) return callBind.exports;
	hasRequiredCallBind = 1;
	(function (module) {

		var setFunctionLength = /*@__PURE__*/ requireSetFunctionLength();

		var $defineProperty = /*@__PURE__*/ requireEsDefineProperty();

		var callBindBasic = requireCallBindApplyHelpers();
		var applyBind = requireApplyBind();

		module.exports = function callBind(originalFunction) {
			var func = callBindBasic(arguments);
			var adjustedLength = originalFunction.length - (arguments.length - 1);
			return setFunctionLength(
				func,
				1 + (adjustedLength > 0 ? adjustedLength : 0),
				true
			);
		};

		if ($defineProperty) {
			$defineProperty(module.exports, 'apply', { value: applyBind });
		} else {
			module.exports.apply = applyBind;
		} 
	} (callBind));
	return callBind.exports;
}

var shams;
var hasRequiredShams;

function requireShams () {
	if (hasRequiredShams) return shams;
	hasRequiredShams = 1;

	var hasSymbols = requireShams$1();

	/** @type {import('.')} */
	shams = function hasToStringTagShams() {
		return hasSymbols() && !!Symbol.toStringTag;
	};
	return shams;
}

var whichTypedArray;
var hasRequiredWhichTypedArray;

function requireWhichTypedArray () {
	if (hasRequiredWhichTypedArray) return whichTypedArray;
	hasRequiredWhichTypedArray = 1;

	var forEach = requireForEach();
	var availableTypedArrays = /*@__PURE__*/ requireAvailableTypedArrays();
	var callBind = requireCallBind();
	var callBound = /*@__PURE__*/ requireCallBound();
	var gOPD = /*@__PURE__*/ requireGopd();
	var getProto = requireGetProto();

	var $toString = callBound('Object.prototype.toString');
	var hasToStringTag = requireShams()();

	var g = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;
	var typedArrays = availableTypedArrays();

	var $slice = callBound('String.prototype.slice');

	/** @type {<T = unknown>(array: readonly T[], value: unknown) => number} */
	var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
		for (var i = 0; i < array.length; i += 1) {
			if (array[i] === value) {
				return i;
			}
		}
		return -1;
	};

	/** @typedef {import('./types').Getter} Getter */
	/** @type {import('./types').Cache} */
	var cache = { __proto__: null };
	if (hasToStringTag && gOPD && getProto) {
		forEach(typedArrays, function (typedArray) {
			var arr = new g[typedArray]();
			if (Symbol.toStringTag in arr && getProto) {
				var proto = getProto(arr);
				// @ts-expect-error TS won't narrow inside a closure
				var descriptor = gOPD(proto, Symbol.toStringTag);
				if (!descriptor && proto) {
					var superProto = getProto(proto);
					// @ts-expect-error TS won't narrow inside a closure
					descriptor = gOPD(superProto, Symbol.toStringTag);
				}
				if (descriptor && descriptor.get) {
					var bound = callBind(descriptor.get);
					cache[
						/** @type {`$${import('.').TypedArrayName}`} */ ('$' + typedArray)
					] = bound;
				}
			}
		});
	} else {
		forEach(typedArrays, function (typedArray) {
			var arr = new g[typedArray]();
			var fn = arr.slice || arr.set;
			if (fn) {
				var bound = /** @type {import('./types').BoundSlice | import('./types').BoundSet} */ (
					// @ts-expect-error TODO FIXME
					callBind(fn)
				);
				cache[
					/** @type {`$${import('.').TypedArrayName}`} */ ('$' + typedArray)
				] = bound;
			}
		});
	}

	/** @type {(value: object) => false | import('.').TypedArrayName} */
	var tryTypedArrays = function tryAllTypedArrays(value) {
		/** @type {ReturnType<typeof tryAllTypedArrays>} */ var found = false;
		forEach(
			/** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */ (cache),
			/** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
			function (getter, typedArray) {
				if (!found) {
					try {
						// @ts-expect-error a throw is fine here
						if ('$' + getter(value) === typedArray) {
							found = /** @type {import('.').TypedArrayName} */ ($slice(typedArray, 1));
						}
					} catch (e) { /**/ }
				}
			}
		);
		return found;
	};

	/** @type {(value: object) => false | import('.').TypedArrayName} */
	var trySlices = function tryAllSlices(value) {
		/** @type {ReturnType<typeof tryAllSlices>} */ var found = false;
		forEach(
			/** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */(cache),
			/** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */ function (getter, name) {
				if (!found) {
					try {
						// @ts-expect-error a throw is fine here
						getter(value);
						found = /** @type {import('.').TypedArrayName} */ ($slice(name, 1));
					} catch (e) { /**/ }
				}
			}
		);
		return found;
	};

	/** @type {import('.')} */
	whichTypedArray = function whichTypedArray(value) {
		if (!value || typeof value !== 'object') { return false; }
		if (!hasToStringTag) {
			/** @type {string} */
			var tag = $slice($toString(value), 8, -1);
			if ($indexOf(typedArrays, tag) > -1) {
				return tag;
			}
			if (tag !== 'Object') {
				return false;
			}
			// node < 0.6 hits here on real Typed Arrays
			return trySlices(value);
		}
		if (!gOPD) { return null; } // unknown engine
		return tryTypedArrays(value);
	};
	return whichTypedArray;
}

var isTypedArray;
var hasRequiredIsTypedArray;

function requireIsTypedArray () {
	if (hasRequiredIsTypedArray) return isTypedArray;
	hasRequiredIsTypedArray = 1;

	var whichTypedArray = /*@__PURE__*/ requireWhichTypedArray();

	/** @type {import('.')} */
	isTypedArray = function isTypedArray(value) {
		return !!whichTypedArray(value);
	};
	return isTypedArray;
}

var typedArrayBuffer;
var hasRequiredTypedArrayBuffer;

function requireTypedArrayBuffer () {
	if (hasRequiredTypedArrayBuffer) return typedArrayBuffer;
	hasRequiredTypedArrayBuffer = 1;

	var $TypeError = /*@__PURE__*/ requireType();

	var callBound = /*@__PURE__*/ requireCallBound();

	/** @type {undefined | ((thisArg: import('.').TypedArray) => Buffer<ArrayBufferLike>)} */
	var $typedArrayBuffer = callBound('TypedArray.prototype.buffer', true);

	var isTypedArray = /*@__PURE__*/ requireIsTypedArray();

	/** @type {import('.')} */
	// node <= 0.10, < 0.11.4 has a nonconfigurable own property instead of a prototype getter
	typedArrayBuffer = $typedArrayBuffer || function typedArrayBuffer(x) {
		if (!isTypedArray(x)) {
			throw new $TypeError('Not a Typed Array');
		}
		return x.buffer;
	};
	return typedArrayBuffer;
}

var toBuffer;
var hasRequiredToBuffer;

function requireToBuffer () {
	if (hasRequiredToBuffer) return toBuffer;
	hasRequiredToBuffer = 1;

	var Buffer = requireSafeBuffer().Buffer;
	var isArray = requireIsarray();
	var typedArrayBuffer = /*@__PURE__*/ requireTypedArrayBuffer();

	var isView = ArrayBuffer.isView || function isView(obj) {
		try {
			typedArrayBuffer(obj);
			return true;
		} catch (e) {
			return false;
		}
	};

	var useUint8Array = typeof Uint8Array !== 'undefined';
	var useArrayBuffer = typeof ArrayBuffer !== 'undefined'
		&& typeof Uint8Array !== 'undefined';
	var useFromArrayBuffer = useArrayBuffer && (Buffer.prototype instanceof Uint8Array || Buffer.TYPED_ARRAY_SUPPORT);

	toBuffer = function toBuffer(data, encoding) {
		if (Buffer.isBuffer(data)) {
			if (data.constructor && !('isBuffer' in data)) {
				// probably a SlowBuffer
				return Buffer.from(data);
			}
			return data;
		}

		if (typeof data === 'string') {
			return Buffer.from(data, encoding);
		}

		/*
		 * Wrap any TypedArray instances and DataViews
		 * Makes sense only on engines with full TypedArray support -- let Buffer detect that
		 */
		if (useArrayBuffer && isView(data)) {
			// Bug in Node.js <6.3.1, which treats this as out-of-bounds
			if (data.byteLength === 0) {
				return Buffer.alloc(0);
			}

			// When Buffer is based on Uint8Array, we can just construct it from ArrayBuffer
			if (useFromArrayBuffer) {
				var res = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
				/*
				 * Recheck result size, as offset/length doesn't work on Node.js <5.10
				 * We just go to Uint8Array case if this fails
				 */
				if (res.byteLength === data.byteLength) {
					return res;
				}
			}

			// Convert to Uint8Array bytes and then to Buffer
			var uint8 = data instanceof Uint8Array ? data : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
			var result = Buffer.from(uint8);

			/*
			 * Let's recheck that conversion succeeded
			 * We have .length but not .byteLength when useFromArrayBuffer is false
			 */
			if (result.length === data.byteLength) {
				return result;
			}
		}

		/*
		 * Uint8Array in engines where Buffer.from might not work with ArrayBuffer, just copy over
		 * Doesn't make sense with other TypedArray instances
		 */
		if (useUint8Array && data instanceof Uint8Array) {
			return Buffer.from(data);
		}

		var isArr = isArray(data);
		if (isArr) {
			for (var i = 0; i < data.length; i += 1) {
				var x = data[i];
				if (
					typeof x !== 'number'
					|| x < 0
					|| x > 255
					|| ~~x !== x // NaN and integer check
				) {
					throw new RangeError('Array items must be numbers in the range 0-255.');
				}
			}
		}

		/*
		 * Old Buffer polyfill on an engine that doesn't have TypedArray support
		 * Also, this is from a different Buffer polyfill implementation then we have, as instanceof check failed
		 * Convert to our current Buffer implementation
		 */
		if (
			isArr || (
				Buffer.isBuffer(data)
				&& data.constructor
				&& typeof data.constructor.isBuffer === 'function'
				&& data.constructor.isBuffer(data)
			)
		) {
			return Buffer.from(data);
		}

		throw new TypeError('The "data" argument must be a string, an Array, a Buffer, a Uint8Array, or a DataView.');
	};
	return toBuffer;
}

var hash;
var hasRequiredHash;

function requireHash () {
	if (hasRequiredHash) return hash;
	hasRequiredHash = 1;

	var Buffer = requireSafeBuffer().Buffer;
	var toBuffer = /*@__PURE__*/ requireToBuffer();

	// prototype class for hash functions
	function Hash(blockSize, finalSize) {
		this._block = Buffer.alloc(blockSize);
		this._finalSize = finalSize;
		this._blockSize = blockSize;
		this._len = 0;
	}

	Hash.prototype.update = function (data, enc) {
		/* eslint no-param-reassign: 0 */
		data = toBuffer(data, enc || 'utf8');

		var block = this._block;
		var blockSize = this._blockSize;
		var length = data.length;
		var accum = this._len;

		for (var offset = 0; offset < length;) {
			var assigned = accum % blockSize;
			var remainder = Math.min(length - offset, blockSize - assigned);

			for (var i = 0; i < remainder; i++) {
				block[assigned + i] = data[offset + i];
			}

			accum += remainder;
			offset += remainder;

			if ((accum % blockSize) === 0) {
				this._update(block);
			}
		}

		this._len += length;
		return this;
	};

	Hash.prototype.digest = function (enc) {
		var rem = this._len % this._blockSize;

		this._block[rem] = 0x80;

		/*
		 * zero (rem + 1) trailing bits, where (rem + 1) is the smallest
		 * non-negative solution to the equation (length + 1 + (rem + 1)) === finalSize mod blockSize
		 */
		this._block.fill(0, rem + 1);

		if (rem >= this._finalSize) {
			this._update(this._block);
			this._block.fill(0);
		}

		var bits = this._len * 8;

		// uint32
		if (bits <= 0xffffffff) {
			this._block.writeUInt32BE(bits, this._blockSize - 4);

			// uint64
		} else {
			var lowBits = (bits & 0xffffffff) >>> 0;
			var highBits = (bits - lowBits) / 0x100000000;

			this._block.writeUInt32BE(highBits, this._blockSize - 8);
			this._block.writeUInt32BE(lowBits, this._blockSize - 4);
		}

		this._update(this._block);
		var hash = this._hash();

		return enc ? hash.toString(enc) : hash;
	};

	Hash.prototype._update = function () {
		throw new Error('_update must be implemented by subclass');
	};

	hash = Hash;
	return hash;
}

var sha1;
var hasRequiredSha1;

function requireSha1 () {
	if (hasRequiredSha1) return sha1;
	hasRequiredSha1 = 1;

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS PUB 180-1
	 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for details.
	 */

	var inherits = requireInherits_browser();
	var Hash = requireHash();
	var Buffer = requireSafeBuffer().Buffer;

	var K = [
		0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
	];

	var W = new Array(80);

	function Sha1() {
		this.init();
		this._w = W;

		Hash.call(this, 64, 56);
	}

	inherits(Sha1, Hash);

	Sha1.prototype.init = function () {
		this._a = 0x67452301;
		this._b = 0xefcdab89;
		this._c = 0x98badcfe;
		this._d = 0x10325476;
		this._e = 0xc3d2e1f0;

		return this;
	};

	function rotl1(num) {
		return (num << 1) | (num >>> 31);
	}

	function rotl5(num) {
		return (num << 5) | (num >>> 27);
	}

	function rotl30(num) {
		return (num << 30) | (num >>> 2);
	}

	function ft(s, b, c, d) {
		if (s === 0) {
			return (b & c) | (~b & d);
		}
		if (s === 2) {
			return (b & c) | (b & d) | (c & d);
		}
		return b ^ c ^ d;
	}

	Sha1.prototype._update = function (M) {
		var w = this._w;

		var a = this._a | 0;
		var b = this._b | 0;
		var c = this._c | 0;
		var d = this._d | 0;
		var e = this._e | 0;

		for (var i = 0; i < 16; ++i) {
			w[i] = M.readInt32BE(i * 4);
		}
		for (; i < 80; ++i) {
			w[i] = rotl1(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]);
		}

		for (var j = 0; j < 80; ++j) {
			var s = ~~(j / 20);
			var t = (rotl5(a) + ft(s, b, c, d) + e + w[j] + K[s]) | 0;

			e = d;
			d = c;
			c = rotl30(b);
			b = a;
			a = t;
		}

		this._a = (a + this._a) | 0;
		this._b = (b + this._b) | 0;
		this._c = (c + this._c) | 0;
		this._d = (d + this._d) | 0;
		this._e = (e + this._e) | 0;
	};

	Sha1.prototype._hash = function () {
		var H = Buffer.allocUnsafe(20);

		H.writeInt32BE(this._a | 0, 0);
		H.writeInt32BE(this._b | 0, 4);
		H.writeInt32BE(this._c | 0, 8);
		H.writeInt32BE(this._d | 0, 12);
		H.writeInt32BE(this._e | 0, 16);

		return H;
	};

	sha1 = Sha1;
	return sha1;
}

var crc32 = {};

/*! crc32.js (C) 2014-present SheetJS -- http://sheetjs.com */

var hasRequiredCrc32$1;

function requireCrc32$1 () {
	if (hasRequiredCrc32$1) return crc32;
	hasRequiredCrc32$1 = 1;
	(function (exports$1) {
		(function (factory) {
			/*jshint ignore:start */
			/*eslint-disable */
			if(typeof DO_NOT_EXPORT_CRC === 'undefined') {
				{
					factory(exports$1);
				}
			} else {
				factory({});
			}
			/*eslint-enable */
			/*jshint ignore:end */
		}(function(CRC32) {
		CRC32.version = '1.2.2';
		/*global Int32Array */
		function signed_crc_table() {
			var c = 0, table = new Array(256);

			for(var n =0; n != 256; ++n){
				c = n;
				c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
				c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
				c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
				c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
				c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
				c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
				c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
				c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
				table[n] = c;
			}

			return typeof Int32Array !== 'undefined' ? new Int32Array(table) : table;
		}

		var T0 = signed_crc_table();
		function slice_by_16_tables(T) {
			var c = 0, v = 0, n = 0, table = typeof Int32Array !== 'undefined' ? new Int32Array(4096) : new Array(4096) ;

			for(n = 0; n != 256; ++n) table[n] = T[n];
			for(n = 0; n != 256; ++n) {
				v = T[n];
				for(c = 256 + n; c < 4096; c += 256) v = table[c] = (v >>> 8) ^ T[v & 0xFF];
			}
			var out = [];
			for(n = 1; n != 16; ++n) out[n - 1] = typeof Int32Array !== 'undefined' ? table.subarray(n * 256, n * 256 + 256) : table.slice(n * 256, n * 256 + 256);
			return out;
		}
		var TT = slice_by_16_tables(T0);
		var T1 = TT[0],  T2 = TT[1],  T3 = TT[2],  T4 = TT[3],  T5 = TT[4];
		var T6 = TT[5],  T7 = TT[6],  T8 = TT[7],  T9 = TT[8],  Ta = TT[9];
		var Tb = TT[10], Tc = TT[11], Td = TT[12], Te = TT[13], Tf = TT[14];
		function crc32_bstr(bstr, seed) {
			var C = seed ^ -1;
			for(var i = 0, L = bstr.length; i < L;) C = (C>>>8) ^ T0[(C^bstr.charCodeAt(i++))&0xFF];
			return ~C;
		}

		function crc32_buf(B, seed) {
			var C = seed ^ -1, L = B.length - 15, i = 0;
			for(; i < L;) C =
				Tf[B[i++] ^ (C & 255)] ^
				Te[B[i++] ^ ((C >> 8) & 255)] ^
				Td[B[i++] ^ ((C >> 16) & 255)] ^
				Tc[B[i++] ^ (C >>> 24)] ^
				Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^
				T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^
				T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
			L += 15;
			while(i < L) C = (C>>>8) ^ T0[(C^B[i++])&0xFF];
			return ~C;
		}

		function crc32_str(str, seed) {
			var C = seed ^ -1;
			for(var i = 0, L = str.length, c = 0, d = 0; i < L;) {
				c = str.charCodeAt(i++);
				if(c < 0x80) {
					C = (C>>>8) ^ T0[(C^c)&0xFF];
				} else if(c < 0x800) {
					C = (C>>>8) ^ T0[(C ^ (192|((c>>6)&31)))&0xFF];
					C = (C>>>8) ^ T0[(C ^ (128|(c&63)))&0xFF];
				} else if(c >= 0xD800 && c < 0xE000) {
					c = (c&1023)+64; d = str.charCodeAt(i++)&1023;
					C = (C>>>8) ^ T0[(C ^ (240|((c>>8)&7)))&0xFF];
					C = (C>>>8) ^ T0[(C ^ (128|((c>>2)&63)))&0xFF];
					C = (C>>>8) ^ T0[(C ^ (128|((d>>6)&15)|((c&3)<<4)))&0xFF];
					C = (C>>>8) ^ T0[(C ^ (128|(d&63)))&0xFF];
				} else {
					C = (C>>>8) ^ T0[(C ^ (224|((c>>12)&15)))&0xFF];
					C = (C>>>8) ^ T0[(C ^ (128|((c>>6)&63)))&0xFF];
					C = (C>>>8) ^ T0[(C ^ (128|(c&63)))&0xFF];
				}
			}
			return ~C;
		}
		CRC32.table = T0;
		// $FlowIgnore
		CRC32.bstr = crc32_bstr;
		// $FlowIgnore
		CRC32.buf = crc32_buf;
		// $FlowIgnore
		CRC32.str = crc32_str;
		})); 
	} (crc32));
	return crc32;
}

var common = {};

var hasRequiredCommon;

function requireCommon () {
	if (hasRequiredCommon) return common;
	hasRequiredCommon = 1;
	(function (exports$1) {


		var TYPED_OK =  (typeof Uint8Array !== 'undefined') &&
		                (typeof Uint16Array !== 'undefined') &&
		                (typeof Int32Array !== 'undefined');

		function _has(obj, key) {
		  return Object.prototype.hasOwnProperty.call(obj, key);
		}

		exports$1.assign = function (obj /*from1, from2, from3, ...*/) {
		  var sources = Array.prototype.slice.call(arguments, 1);
		  while (sources.length) {
		    var source = sources.shift();
		    if (!source) { continue; }

		    if (typeof source !== 'object') {
		      throw new TypeError(source + 'must be non-object');
		    }

		    for (var p in source) {
		      if (_has(source, p)) {
		        obj[p] = source[p];
		      }
		    }
		  }

		  return obj;
		};


		// reduce buffer size, avoiding mem copy
		exports$1.shrinkBuf = function (buf, size) {
		  if (buf.length === size) { return buf; }
		  if (buf.subarray) { return buf.subarray(0, size); }
		  buf.length = size;
		  return buf;
		};


		var fnTyped = {
		  arraySet: function (dest, src, src_offs, len, dest_offs) {
		    if (src.subarray && dest.subarray) {
		      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
		      return;
		    }
		    // Fallback to ordinary array
		    for (var i = 0; i < len; i++) {
		      dest[dest_offs + i] = src[src_offs + i];
		    }
		  },
		  // Join array of chunks to single array.
		  flattenChunks: function (chunks) {
		    var i, l, len, pos, chunk, result;

		    // calculate data length
		    len = 0;
		    for (i = 0, l = chunks.length; i < l; i++) {
		      len += chunks[i].length;
		    }

		    // join chunks
		    result = new Uint8Array(len);
		    pos = 0;
		    for (i = 0, l = chunks.length; i < l; i++) {
		      chunk = chunks[i];
		      result.set(chunk, pos);
		      pos += chunk.length;
		    }

		    return result;
		  }
		};

		var fnUntyped = {
		  arraySet: function (dest, src, src_offs, len, dest_offs) {
		    for (var i = 0; i < len; i++) {
		      dest[dest_offs + i] = src[src_offs + i];
		    }
		  },
		  // Join array of chunks to single array.
		  flattenChunks: function (chunks) {
		    return [].concat.apply([], chunks);
		  }
		};


		// Enable/Disable typed arrays use, for testing
		//
		exports$1.setTyped = function (on) {
		  if (on) {
		    exports$1.Buf8  = Uint8Array;
		    exports$1.Buf16 = Uint16Array;
		    exports$1.Buf32 = Int32Array;
		    exports$1.assign(exports$1, fnTyped);
		  } else {
		    exports$1.Buf8  = Array;
		    exports$1.Buf16 = Array;
		    exports$1.Buf32 = Array;
		    exports$1.assign(exports$1, fnUntyped);
		  }
		};

		exports$1.setTyped(TYPED_OK); 
	} (common));
	return common;
}

var deflate$1 = {};

var deflate = {};

var trees = {};

var hasRequiredTrees;

function requireTrees () {
	if (hasRequiredTrees) return trees;
	hasRequiredTrees = 1;

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	/* eslint-disable space-unary-ops */

	var utils = requireCommon();

	/* Public constants ==========================================================*/
	/* ===========================================================================*/


	//var Z_FILTERED          = 1;
	//var Z_HUFFMAN_ONLY      = 2;
	//var Z_RLE               = 3;
	var Z_FIXED               = 4;
	//var Z_DEFAULT_STRATEGY  = 0;

	/* Possible values of the data_type field (though see inflate()) */
	var Z_BINARY              = 0;
	var Z_TEXT                = 1;
	//var Z_ASCII             = 1; // = Z_TEXT
	var Z_UNKNOWN             = 2;

	/*============================================================================*/


	function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }

	// From zutil.h

	var STORED_BLOCK = 0;
	var STATIC_TREES = 1;
	var DYN_TREES    = 2;
	/* The three kinds of block type */

	var MIN_MATCH    = 3;
	var MAX_MATCH    = 258;
	/* The minimum and maximum match lengths */

	// From deflate.h
	/* ===========================================================================
	 * Internal compression state.
	 */

	var LENGTH_CODES  = 29;
	/* number of length codes, not counting the special END_BLOCK code */

	var LITERALS      = 256;
	/* number of literal bytes 0..255 */

	var L_CODES       = LITERALS + 1 + LENGTH_CODES;
	/* number of Literal or Length codes, including the END_BLOCK code */

	var D_CODES       = 30;
	/* number of distance codes */

	var BL_CODES      = 19;
	/* number of codes used to transfer the bit lengths */

	var HEAP_SIZE     = 2 * L_CODES + 1;
	/* maximum heap size */

	var MAX_BITS      = 15;
	/* All codes must not exceed MAX_BITS bits */

	var Buf_size      = 16;
	/* size of bit buffer in bi_buf */


	/* ===========================================================================
	 * Constants
	 */

	var MAX_BL_BITS = 7;
	/* Bit length codes must not exceed MAX_BL_BITS bits */

	var END_BLOCK   = 256;
	/* end of block literal code */

	var REP_3_6     = 16;
	/* repeat previous bit length 3-6 times (2 bits of repeat count) */

	var REPZ_3_10   = 17;
	/* repeat a zero length 3-10 times  (3 bits of repeat count) */

	var REPZ_11_138 = 18;
	/* repeat a zero length 11-138 times  (7 bits of repeat count) */

	/* eslint-disable comma-spacing,array-bracket-spacing */
	var extra_lbits =   /* extra bits for each length code */
	  [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];

	var extra_dbits =   /* extra bits for each distance code */
	  [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];

	var extra_blbits =  /* extra bits for each bit length code */
	  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7];

	var bl_order =
	  [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
	/* eslint-enable comma-spacing,array-bracket-spacing */

	/* The lengths of the bit length codes are sent in order of decreasing
	 * probability, to avoid transmitting the lengths for unused bit length codes.
	 */

	/* ===========================================================================
	 * Local data. These are initialized only once.
	 */

	// We pre-fill arrays with 0 to avoid uninitialized gaps

	var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

	// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
	var static_ltree  = new Array((L_CODES + 2) * 2);
	zero(static_ltree);
	/* The static literal tree. Since the bit lengths are imposed, there is no
	 * need for the L_CODES extra codes used during heap construction. However
	 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
	 * below).
	 */

	var static_dtree  = new Array(D_CODES * 2);
	zero(static_dtree);
	/* The static distance tree. (Actually a trivial tree since all codes use
	 * 5 bits.)
	 */

	var _dist_code    = new Array(DIST_CODE_LEN);
	zero(_dist_code);
	/* Distance codes. The first 256 values correspond to the distances
	 * 3 .. 258, the last 256 values correspond to the top 8 bits of
	 * the 15 bit distances.
	 */

	var _length_code  = new Array(MAX_MATCH - MIN_MATCH + 1);
	zero(_length_code);
	/* length code for each normalized match length (0 == MIN_MATCH) */

	var base_length   = new Array(LENGTH_CODES);
	zero(base_length);
	/* First normalized length for each code (0 = MIN_MATCH) */

	var base_dist     = new Array(D_CODES);
	zero(base_dist);
	/* First normalized distance for each code (0 = distance of 1) */


	function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

	  this.static_tree  = static_tree;  /* static tree or NULL */
	  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
	  this.extra_base   = extra_base;   /* base index for extra_bits */
	  this.elems        = elems;        /* max number of elements in the tree */
	  this.max_length   = max_length;   /* max bit length for the codes */

	  // show if `static_tree` has data or dummy - needed for monomorphic objects
	  this.has_stree    = static_tree && static_tree.length;
	}


	var static_l_desc;
	var static_d_desc;
	var static_bl_desc;


	function TreeDesc(dyn_tree, stat_desc) {
	  this.dyn_tree = dyn_tree;     /* the dynamic tree */
	  this.max_code = 0;            /* largest code with non zero frequency */
	  this.stat_desc = stat_desc;   /* the corresponding static tree */
	}



	function d_code(dist) {
	  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
	}


	/* ===========================================================================
	 * Output a short LSB first on the stream.
	 * IN assertion: there is enough room in pendingBuf.
	 */
	function put_short(s, w) {
	//    put_byte(s, (uch)((w) & 0xff));
	//    put_byte(s, (uch)((ush)(w) >> 8));
	  s.pending_buf[s.pending++] = (w) & 0xff;
	  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
	}


	/* ===========================================================================
	 * Send a value on a given number of bits.
	 * IN assertion: length <= 16 and value fits in length bits.
	 */
	function send_bits(s, value, length) {
	  if (s.bi_valid > (Buf_size - length)) {
	    s.bi_buf |= (value << s.bi_valid) & 0xffff;
	    put_short(s, s.bi_buf);
	    s.bi_buf = value >> (Buf_size - s.bi_valid);
	    s.bi_valid += length - Buf_size;
	  } else {
	    s.bi_buf |= (value << s.bi_valid) & 0xffff;
	    s.bi_valid += length;
	  }
	}


	function send_code(s, c, tree) {
	  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
	}


	/* ===========================================================================
	 * Reverse the first len bits of a code, using straightforward code (a faster
	 * method would use a table)
	 * IN assertion: 1 <= len <= 15
	 */
	function bi_reverse(code, len) {
	  var res = 0;
	  do {
	    res |= code & 1;
	    code >>>= 1;
	    res <<= 1;
	  } while (--len > 0);
	  return res >>> 1;
	}


	/* ===========================================================================
	 * Flush the bit buffer, keeping at most 7 bits in it.
	 */
	function bi_flush(s) {
	  if (s.bi_valid === 16) {
	    put_short(s, s.bi_buf);
	    s.bi_buf = 0;
	    s.bi_valid = 0;

	  } else if (s.bi_valid >= 8) {
	    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
	    s.bi_buf >>= 8;
	    s.bi_valid -= 8;
	  }
	}


	/* ===========================================================================
	 * Compute the optimal bit lengths for a tree and update the total bit length
	 * for the current block.
	 * IN assertion: the fields freq and dad are set, heap[heap_max] and
	 *    above are the tree nodes sorted by increasing frequency.
	 * OUT assertions: the field len is set to the optimal bit length, the
	 *     array bl_count contains the frequencies for each bit length.
	 *     The length opt_len is updated; static_len is also updated if stree is
	 *     not null.
	 */
	function gen_bitlen(s, desc)
	//    deflate_state *s;
	//    tree_desc *desc;    /* the tree descriptor */
	{
	  var tree            = desc.dyn_tree;
	  var max_code        = desc.max_code;
	  var stree           = desc.stat_desc.static_tree;
	  var has_stree       = desc.stat_desc.has_stree;
	  var extra           = desc.stat_desc.extra_bits;
	  var base            = desc.stat_desc.extra_base;
	  var max_length      = desc.stat_desc.max_length;
	  var h;              /* heap index */
	  var n, m;           /* iterate over the tree elements */
	  var bits;           /* bit length */
	  var xbits;          /* extra bits */
	  var f;              /* frequency */
	  var overflow = 0;   /* number of elements with bit length too large */

	  for (bits = 0; bits <= MAX_BITS; bits++) {
	    s.bl_count[bits] = 0;
	  }

	  /* In a first pass, compute the optimal bit lengths (which may
	   * overflow in the case of the bit length tree).
	   */
	  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

	  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
	    n = s.heap[h];
	    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
	    if (bits > max_length) {
	      bits = max_length;
	      overflow++;
	    }
	    tree[n * 2 + 1]/*.Len*/ = bits;
	    /* We overwrite tree[n].Dad which is no longer needed */

	    if (n > max_code) { continue; } /* not a leaf node */

	    s.bl_count[bits]++;
	    xbits = 0;
	    if (n >= base) {
	      xbits = extra[n - base];
	    }
	    f = tree[n * 2]/*.Freq*/;
	    s.opt_len += f * (bits + xbits);
	    if (has_stree) {
	      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
	    }
	  }
	  if (overflow === 0) { return; }

	  // Trace((stderr,"\nbit length overflow\n"));
	  /* This happens for example on obj2 and pic of the Calgary corpus */

	  /* Find the first bit length which could increase: */
	  do {
	    bits = max_length - 1;
	    while (s.bl_count[bits] === 0) { bits--; }
	    s.bl_count[bits]--;      /* move one leaf down the tree */
	    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
	    s.bl_count[max_length]--;
	    /* The brother of the overflow item also moves one step up,
	     * but this does not affect bl_count[max_length]
	     */
	    overflow -= 2;
	  } while (overflow > 0);

	  /* Now recompute all bit lengths, scanning in increasing frequency.
	   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
	   * lengths instead of fixing only the wrong ones. This idea is taken
	   * from 'ar' written by Haruhiko Okumura.)
	   */
	  for (bits = max_length; bits !== 0; bits--) {
	    n = s.bl_count[bits];
	    while (n !== 0) {
	      m = s.heap[--h];
	      if (m > max_code) { continue; }
	      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
	        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
	        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
	        tree[m * 2 + 1]/*.Len*/ = bits;
	      }
	      n--;
	    }
	  }
	}


	/* ===========================================================================
	 * Generate the codes for a given tree and bit counts (which need not be
	 * optimal).
	 * IN assertion: the array bl_count contains the bit length statistics for
	 * the given tree and the field len is set for all tree elements.
	 * OUT assertion: the field code is set for all tree elements of non
	 *     zero code length.
	 */
	function gen_codes(tree, max_code, bl_count)
	//    ct_data *tree;             /* the tree to decorate */
	//    int max_code;              /* largest code with non zero frequency */
	//    ushf *bl_count;            /* number of codes at each bit length */
	{
	  var next_code = new Array(MAX_BITS + 1); /* next code value for each bit length */
	  var code = 0;              /* running code value */
	  var bits;                  /* bit index */
	  var n;                     /* code index */

	  /* The distribution counts are first used to generate the code values
	   * without bit reversal.
	   */
	  for (bits = 1; bits <= MAX_BITS; bits++) {
	    next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
	  }
	  /* Check that the bit counts in bl_count are consistent. The last code
	   * must be all ones.
	   */
	  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
	  //        "inconsistent bit counts");
	  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

	  for (n = 0;  n <= max_code; n++) {
	    var len = tree[n * 2 + 1]/*.Len*/;
	    if (len === 0) { continue; }
	    /* Now reverse the bits */
	    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

	    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
	    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
	  }
	}


	/* ===========================================================================
	 * Initialize the various 'constant' tables.
	 */
	function tr_static_init() {
	  var n;        /* iterates over tree elements */
	  var bits;     /* bit counter */
	  var length;   /* length value */
	  var code;     /* code value */
	  var dist;     /* distance index */
	  var bl_count = new Array(MAX_BITS + 1);
	  /* number of codes at each bit length for an optimal tree */

	  // do check in _tr_init()
	  //if (static_init_done) return;

	  /* For some embedded targets, global variables are not initialized: */
	/*#ifdef NO_INIT_GLOBAL_POINTERS
	  static_l_desc.static_tree = static_ltree;
	  static_l_desc.extra_bits = extra_lbits;
	  static_d_desc.static_tree = static_dtree;
	  static_d_desc.extra_bits = extra_dbits;
	  static_bl_desc.extra_bits = extra_blbits;
	#endif*/

	  /* Initialize the mapping length (0..255) -> length code (0..28) */
	  length = 0;
	  for (code = 0; code < LENGTH_CODES - 1; code++) {
	    base_length[code] = length;
	    for (n = 0; n < (1 << extra_lbits[code]); n++) {
	      _length_code[length++] = code;
	    }
	  }
	  //Assert (length == 256, "tr_static_init: length != 256");
	  /* Note that the length 255 (match length 258) can be represented
	   * in two different ways: code 284 + 5 bits or code 285, so we
	   * overwrite length_code[255] to use the best encoding:
	   */
	  _length_code[length - 1] = code;

	  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
	  dist = 0;
	  for (code = 0; code < 16; code++) {
	    base_dist[code] = dist;
	    for (n = 0; n < (1 << extra_dbits[code]); n++) {
	      _dist_code[dist++] = code;
	    }
	  }
	  //Assert (dist == 256, "tr_static_init: dist != 256");
	  dist >>= 7; /* from now on, all distances are divided by 128 */
	  for (; code < D_CODES; code++) {
	    base_dist[code] = dist << 7;
	    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
	      _dist_code[256 + dist++] = code;
	    }
	  }
	  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

	  /* Construct the codes of the static literal tree */
	  for (bits = 0; bits <= MAX_BITS; bits++) {
	    bl_count[bits] = 0;
	  }

	  n = 0;
	  while (n <= 143) {
	    static_ltree[n * 2 + 1]/*.Len*/ = 8;
	    n++;
	    bl_count[8]++;
	  }
	  while (n <= 255) {
	    static_ltree[n * 2 + 1]/*.Len*/ = 9;
	    n++;
	    bl_count[9]++;
	  }
	  while (n <= 279) {
	    static_ltree[n * 2 + 1]/*.Len*/ = 7;
	    n++;
	    bl_count[7]++;
	  }
	  while (n <= 287) {
	    static_ltree[n * 2 + 1]/*.Len*/ = 8;
	    n++;
	    bl_count[8]++;
	  }
	  /* Codes 286 and 287 do not exist, but we must include them in the
	   * tree construction to get a canonical Huffman tree (longest code
	   * all ones)
	   */
	  gen_codes(static_ltree, L_CODES + 1, bl_count);

	  /* The static distance tree is trivial: */
	  for (n = 0; n < D_CODES; n++) {
	    static_dtree[n * 2 + 1]/*.Len*/ = 5;
	    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
	  }

	  // Now data ready and we can init static trees
	  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
	  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES, MAX_BITS);
	  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES, MAX_BL_BITS);

	  //static_init_done = true;
	}


	/* ===========================================================================
	 * Initialize a new block.
	 */
	function init_block(s) {
	  var n; /* iterates over tree elements */

	  /* Initialize the trees. */
	  for (n = 0; n < L_CODES;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
	  for (n = 0; n < D_CODES;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
	  for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

	  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
	  s.opt_len = s.static_len = 0;
	  s.last_lit = s.matches = 0;
	}


	/* ===========================================================================
	 * Flush the bit buffer and align the output on a byte boundary
	 */
	function bi_windup(s)
	{
	  if (s.bi_valid > 8) {
	    put_short(s, s.bi_buf);
	  } else if (s.bi_valid > 0) {
	    //put_byte(s, (Byte)s->bi_buf);
	    s.pending_buf[s.pending++] = s.bi_buf;
	  }
	  s.bi_buf = 0;
	  s.bi_valid = 0;
	}

	/* ===========================================================================
	 * Copy a stored block, storing first the length and its
	 * one's complement if requested.
	 */
	function copy_block(s, buf, len, header)
	//DeflateState *s;
	//charf    *buf;    /* the input data */
	//unsigned len;     /* its length */
	//int      header;  /* true if block header must be written */
	{
	  bi_windup(s);        /* align on byte boundary */

	  {
	    put_short(s, len);
	    put_short(s, ~len);
	  }
	//  while (len--) {
	//    put_byte(s, *buf++);
	//  }
	  utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
	  s.pending += len;
	}

	/* ===========================================================================
	 * Compares to subtrees, using the tree depth as tie breaker when
	 * the subtrees have equal frequency. This minimizes the worst case length.
	 */
	function smaller(tree, n, m, depth) {
	  var _n2 = n * 2;
	  var _m2 = m * 2;
	  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
	         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
	}

	/* ===========================================================================
	 * Restore the heap property by moving down the tree starting at node k,
	 * exchanging a node with the smallest of its two sons if necessary, stopping
	 * when the heap property is re-established (each father smaller than its
	 * two sons).
	 */
	function pqdownheap(s, tree, k)
	//    deflate_state *s;
	//    ct_data *tree;  /* the tree to restore */
	//    int k;               /* node to move down */
	{
	  var v = s.heap[k];
	  var j = k << 1;  /* left son of k */
	  while (j <= s.heap_len) {
	    /* Set j to the smallest of the two sons: */
	    if (j < s.heap_len &&
	      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
	      j++;
	    }
	    /* Exit if v is smaller than both sons */
	    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

	    /* Exchange v with the smallest son */
	    s.heap[k] = s.heap[j];
	    k = j;

	    /* And continue down the tree, setting j to the left son of k */
	    j <<= 1;
	  }
	  s.heap[k] = v;
	}


	// inlined manually
	// var SMALLEST = 1;

	/* ===========================================================================
	 * Send the block data compressed using the given Huffman trees
	 */
	function compress_block(s, ltree, dtree)
	//    deflate_state *s;
	//    const ct_data *ltree; /* literal tree */
	//    const ct_data *dtree; /* distance tree */
	{
	  var dist;           /* distance of matched string */
	  var lc;             /* match length or unmatched char (if dist == 0) */
	  var lx = 0;         /* running index in l_buf */
	  var code;           /* the code to send */
	  var extra;          /* number of extra bits to send */

	  if (s.last_lit !== 0) {
	    do {
	      dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1]);
	      lc = s.pending_buf[s.l_buf + lx];
	      lx++;

	      if (dist === 0) {
	        send_code(s, lc, ltree); /* send a literal byte */
	        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
	      } else {
	        /* Here, lc is the match length - MIN_MATCH */
	        code = _length_code[lc];
	        send_code(s, code + LITERALS + 1, ltree); /* send the length code */
	        extra = extra_lbits[code];
	        if (extra !== 0) {
	          lc -= base_length[code];
	          send_bits(s, lc, extra);       /* send the extra length bits */
	        }
	        dist--; /* dist is now the match distance - 1 */
	        code = d_code(dist);
	        //Assert (code < D_CODES, "bad d_code");

	        send_code(s, code, dtree);       /* send the distance code */
	        extra = extra_dbits[code];
	        if (extra !== 0) {
	          dist -= base_dist[code];
	          send_bits(s, dist, extra);   /* send the extra distance bits */
	        }
	      } /* literal or match pair ? */

	      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
	      //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
	      //       "pendingBuf overflow");

	    } while (lx < s.last_lit);
	  }

	  send_code(s, END_BLOCK, ltree);
	}


	/* ===========================================================================
	 * Construct one Huffman tree and assigns the code bit strings and lengths.
	 * Update the total bit length for the current block.
	 * IN assertion: the field freq is set for all tree elements.
	 * OUT assertions: the fields len and code are set to the optimal bit length
	 *     and corresponding code. The length opt_len is updated; static_len is
	 *     also updated if stree is not null. The field max_code is set.
	 */
	function build_tree(s, desc)
	//    deflate_state *s;
	//    tree_desc *desc; /* the tree descriptor */
	{
	  var tree     = desc.dyn_tree;
	  var stree    = desc.stat_desc.static_tree;
	  var has_stree = desc.stat_desc.has_stree;
	  var elems    = desc.stat_desc.elems;
	  var n, m;          /* iterate over heap elements */
	  var max_code = -1; /* largest code with non zero frequency */
	  var node;          /* new node being created */

	  /* Construct the initial heap, with least frequent element in
	   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
	   * heap[0] is not used.
	   */
	  s.heap_len = 0;
	  s.heap_max = HEAP_SIZE;

	  for (n = 0; n < elems; n++) {
	    if (tree[n * 2]/*.Freq*/ !== 0) {
	      s.heap[++s.heap_len] = max_code = n;
	      s.depth[n] = 0;

	    } else {
	      tree[n * 2 + 1]/*.Len*/ = 0;
	    }
	  }

	  /* The pkzip format requires that at least one distance code exists,
	   * and that at least one bit should be sent even if there is only one
	   * possible code. So to avoid special checks later on we force at least
	   * two codes of non zero frequency.
	   */
	  while (s.heap_len < 2) {
	    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
	    tree[node * 2]/*.Freq*/ = 1;
	    s.depth[node] = 0;
	    s.opt_len--;

	    if (has_stree) {
	      s.static_len -= stree[node * 2 + 1]/*.Len*/;
	    }
	    /* node is 0 or 1 so it does not have extra bits */
	  }
	  desc.max_code = max_code;

	  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
	   * establish sub-heaps of increasing lengths:
	   */
	  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

	  /* Construct the Huffman tree by repeatedly combining the least two
	   * frequent nodes.
	   */
	  node = elems;              /* next internal node of the tree */
	  do {
	    //pqremove(s, tree, n);  /* n = node of least frequency */
	    /*** pqremove ***/
	    n = s.heap[1/*SMALLEST*/];
	    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
	    pqdownheap(s, tree, 1/*SMALLEST*/);
	    /***/

	    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

	    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
	    s.heap[--s.heap_max] = m;

	    /* Create a new node father of n and m */
	    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
	    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
	    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

	    /* and insert the new node in the heap */
	    s.heap[1/*SMALLEST*/] = node++;
	    pqdownheap(s, tree, 1/*SMALLEST*/);

	  } while (s.heap_len >= 2);

	  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

	  /* At this point, the fields freq and dad are set. We can now
	   * generate the bit lengths.
	   */
	  gen_bitlen(s, desc);

	  /* The field len is now set, we can generate the bit codes */
	  gen_codes(tree, max_code, s.bl_count);
	}


	/* ===========================================================================
	 * Scan a literal or distance tree to determine the frequencies of the codes
	 * in the bit length tree.
	 */
	function scan_tree(s, tree, max_code)
	//    deflate_state *s;
	//    ct_data *tree;   /* the tree to be scanned */
	//    int max_code;    /* and its largest code of non zero frequency */
	{
	  var n;                     /* iterates over all tree elements */
	  var prevlen = -1;          /* last emitted length */
	  var curlen;                /* length of current code */

	  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

	  var count = 0;             /* repeat count of the current code */
	  var max_count = 7;         /* max repeat count */
	  var min_count = 4;         /* min repeat count */

	  if (nextlen === 0) {
	    max_count = 138;
	    min_count = 3;
	  }
	  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

	  for (n = 0; n <= max_code; n++) {
	    curlen = nextlen;
	    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

	    if (++count < max_count && curlen === nextlen) {
	      continue;

	    } else if (count < min_count) {
	      s.bl_tree[curlen * 2]/*.Freq*/ += count;

	    } else if (curlen !== 0) {

	      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
	      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

	    } else if (count <= 10) {
	      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

	    } else {
	      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
	    }

	    count = 0;
	    prevlen = curlen;

	    if (nextlen === 0) {
	      max_count = 138;
	      min_count = 3;

	    } else if (curlen === nextlen) {
	      max_count = 6;
	      min_count = 3;

	    } else {
	      max_count = 7;
	      min_count = 4;
	    }
	  }
	}


	/* ===========================================================================
	 * Send a literal or distance tree in compressed form, using the codes in
	 * bl_tree.
	 */
	function send_tree(s, tree, max_code)
	//    deflate_state *s;
	//    ct_data *tree; /* the tree to be scanned */
	//    int max_code;       /* and its largest code of non zero frequency */
	{
	  var n;                     /* iterates over all tree elements */
	  var prevlen = -1;          /* last emitted length */
	  var curlen;                /* length of current code */

	  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

	  var count = 0;             /* repeat count of the current code */
	  var max_count = 7;         /* max repeat count */
	  var min_count = 4;         /* min repeat count */

	  /* tree[max_code+1].Len = -1; */  /* guard already set */
	  if (nextlen === 0) {
	    max_count = 138;
	    min_count = 3;
	  }

	  for (n = 0; n <= max_code; n++) {
	    curlen = nextlen;
	    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

	    if (++count < max_count && curlen === nextlen) {
	      continue;

	    } else if (count < min_count) {
	      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

	    } else if (curlen !== 0) {
	      if (curlen !== prevlen) {
	        send_code(s, curlen, s.bl_tree);
	        count--;
	      }
	      //Assert(count >= 3 && count <= 6, " 3_6?");
	      send_code(s, REP_3_6, s.bl_tree);
	      send_bits(s, count - 3, 2);

	    } else if (count <= 10) {
	      send_code(s, REPZ_3_10, s.bl_tree);
	      send_bits(s, count - 3, 3);

	    } else {
	      send_code(s, REPZ_11_138, s.bl_tree);
	      send_bits(s, count - 11, 7);
	    }

	    count = 0;
	    prevlen = curlen;
	    if (nextlen === 0) {
	      max_count = 138;
	      min_count = 3;

	    } else if (curlen === nextlen) {
	      max_count = 6;
	      min_count = 3;

	    } else {
	      max_count = 7;
	      min_count = 4;
	    }
	  }
	}


	/* ===========================================================================
	 * Construct the Huffman tree for the bit lengths and return the index in
	 * bl_order of the last bit length code to send.
	 */
	function build_bl_tree(s) {
	  var max_blindex;  /* index of last bit length code of non zero freq */

	  /* Determine the bit length frequencies for literal and distance trees */
	  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
	  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

	  /* Build the bit length tree: */
	  build_tree(s, s.bl_desc);
	  /* opt_len now includes the length of the tree representations, except
	   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
	   */

	  /* Determine the number of bit length codes to send. The pkzip format
	   * requires that at least 4 bit length codes be sent. (appnote.txt says
	   * 3 but the actual value used is 4.)
	   */
	  for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
	    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
	      break;
	    }
	  }
	  /* Update opt_len to include the bit length tree and counts */
	  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
	  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
	  //        s->opt_len, s->static_len));

	  return max_blindex;
	}


	/* ===========================================================================
	 * Send the header for a block using dynamic Huffman trees: the counts, the
	 * lengths of the bit length codes, the literal tree and the distance tree.
	 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
	 */
	function send_all_trees(s, lcodes, dcodes, blcodes)
	//    deflate_state *s;
	//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
	{
	  var rank;                    /* index in bl_order */

	  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
	  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
	  //        "too many codes");
	  //Tracev((stderr, "\nbl counts: "));
	  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
	  send_bits(s, dcodes - 1,   5);
	  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
	  for (rank = 0; rank < blcodes; rank++) {
	    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
	    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
	  }
	  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

	  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
	  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

	  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
	  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
	}


	/* ===========================================================================
	 * Check if the data type is TEXT or BINARY, using the following algorithm:
	 * - TEXT if the two conditions below are satisfied:
	 *    a) There are no non-portable control characters belonging to the
	 *       "black list" (0..6, 14..25, 28..31).
	 *    b) There is at least one printable character belonging to the
	 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
	 * - BINARY otherwise.
	 * - The following partially-portable control characters form a
	 *   "gray list" that is ignored in this detection algorithm:
	 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
	 * IN assertion: the fields Freq of dyn_ltree are set.
	 */
	function detect_data_type(s) {
	  /* black_mask is the bit mask of black-listed bytes
	   * set bits 0..6, 14..25, and 28..31
	   * 0xf3ffc07f = binary 11110011111111111100000001111111
	   */
	  var black_mask = 0xf3ffc07f;
	  var n;

	  /* Check for non-textual ("black-listed") bytes. */
	  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
	    if ((black_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
	      return Z_BINARY;
	    }
	  }

	  /* Check for textual ("white-listed") bytes. */
	  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
	      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
	    return Z_TEXT;
	  }
	  for (n = 32; n < LITERALS; n++) {
	    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
	      return Z_TEXT;
	    }
	  }

	  /* There are no "black-listed" or "white-listed" bytes:
	   * this stream either is empty or has tolerated ("gray-listed") bytes only.
	   */
	  return Z_BINARY;
	}


	var static_init_done = false;

	/* ===========================================================================
	 * Initialize the tree data structures for a new zlib stream.
	 */
	function _tr_init(s)
	{

	  if (!static_init_done) {
	    tr_static_init();
	    static_init_done = true;
	  }

	  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
	  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
	  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

	  s.bi_buf = 0;
	  s.bi_valid = 0;

	  /* Initialize the first block of the first file: */
	  init_block(s);
	}


	/* ===========================================================================
	 * Send a stored block
	 */
	function _tr_stored_block(s, buf, stored_len, last)
	//DeflateState *s;
	//charf *buf;       /* input block */
	//ulg stored_len;   /* length of input block */
	//int last;         /* one if this is the last block for a file */
	{
	  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
	  copy_block(s, buf, stored_len); /* with header */
	}


	/* ===========================================================================
	 * Send one empty static block to give enough lookahead for inflate.
	 * This takes 10 bits, of which 7 may remain in the bit buffer.
	 */
	function _tr_align(s) {
	  send_bits(s, STATIC_TREES << 1, 3);
	  send_code(s, END_BLOCK, static_ltree);
	  bi_flush(s);
	}


	/* ===========================================================================
	 * Determine the best encoding for the current block: dynamic trees, static
	 * trees or store, and output the encoded block to the zip file.
	 */
	function _tr_flush_block(s, buf, stored_len, last)
	//DeflateState *s;
	//charf *buf;       /* input block, or NULL if too old */
	//ulg stored_len;   /* length of input block */
	//int last;         /* one if this is the last block for a file */
	{
	  var opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
	  var max_blindex = 0;        /* index of last bit length code of non zero freq */

	  /* Build the Huffman trees unless a stored block is forced */
	  if (s.level > 0) {

	    /* Check if the file is binary or text */
	    if (s.strm.data_type === Z_UNKNOWN) {
	      s.strm.data_type = detect_data_type(s);
	    }

	    /* Construct the literal and distance trees */
	    build_tree(s, s.l_desc);
	    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
	    //        s->static_len));

	    build_tree(s, s.d_desc);
	    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
	    //        s->static_len));
	    /* At this point, opt_len and static_len are the total bit lengths of
	     * the compressed block data, excluding the tree representations.
	     */

	    /* Build the bit length tree for the above two trees, and get the index
	     * in bl_order of the last bit length code to send.
	     */
	    max_blindex = build_bl_tree(s);

	    /* Determine the best encoding. Compute the block lengths in bytes. */
	    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
	    static_lenb = (s.static_len + 3 + 7) >>> 3;

	    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
	    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
	    //        s->last_lit));

	    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

	  } else {
	    // Assert(buf != (char*)0, "lost buf");
	    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
	  }

	  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
	    /* 4: two words for the lengths */

	    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
	     * Otherwise we can't have processed more than WSIZE input bytes since
	     * the last block flush, because compression would have been
	     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
	     * transform a block into a stored block.
	     */
	    _tr_stored_block(s, buf, stored_len, last);

	  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {

	    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
	    compress_block(s, static_ltree, static_dtree);

	  } else {
	    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
	    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
	    compress_block(s, s.dyn_ltree, s.dyn_dtree);
	  }
	  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
	  /* The above check is made mod 2^32, for files larger than 512 MB
	   * and uLong implemented on 32 bits.
	   */
	  init_block(s);

	  if (last) {
	    bi_windup(s);
	  }
	  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
	  //       s->compressed_len-7*last));
	}

	/* ===========================================================================
	 * Save the match info and tally the frequency counts. Return true if
	 * the current block must be flushed.
	 */
	function _tr_tally(s, dist, lc)
	//    deflate_state *s;
	//    unsigned dist;  /* distance of matched string */
	//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
	{
	  //var out_length, in_length, dcode;

	  s.pending_buf[s.d_buf + s.last_lit * 2]     = (dist >>> 8) & 0xff;
	  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

	  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
	  s.last_lit++;

	  if (dist === 0) {
	    /* lc is the unmatched char */
	    s.dyn_ltree[lc * 2]/*.Freq*/++;
	  } else {
	    s.matches++;
	    /* Here, lc is the match length - MIN_MATCH */
	    dist--;             /* dist = match distance - 1 */
	    //Assert((ush)dist < (ush)MAX_DIST(s) &&
	    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
	    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

	    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/*.Freq*/++;
	    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
	  }

	// (!) This block is disabled in zlib defaults,
	// don't enable it for binary compatibility

	//#ifdef TRUNCATE_BLOCK
	//  /* Try to guess if it is profitable to stop the current block here */
	//  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
	//    /* Compute an upper bound for the compressed length */
	//    out_length = s.last_lit*8;
	//    in_length = s.strstart - s.block_start;
	//
	//    for (dcode = 0; dcode < D_CODES; dcode++) {
	//      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
	//    }
	//    out_length >>>= 3;
	//    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
	//    //       s->last_lit, in_length, out_length,
	//    //       100L - out_length*100L/in_length));
	//    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
	//      return true;
	//    }
	//  }
	//#endif

	  return (s.last_lit === s.lit_bufsize - 1);
	  /* We avoid equality with lit_bufsize because of wraparound at 64K
	   * on 16 bit machines and because stored blocks are restricted to
	   * 64K-1 bytes.
	   */
	}

	trees._tr_init  = _tr_init;
	trees._tr_stored_block = _tr_stored_block;
	trees._tr_flush_block  = _tr_flush_block;
	trees._tr_tally = _tr_tally;
	trees._tr_align = _tr_align;
	return trees;
}

var adler32_1;
var hasRequiredAdler32;

function requireAdler32 () {
	if (hasRequiredAdler32) return adler32_1;
	hasRequiredAdler32 = 1;

	// Note: adler32 takes 12% for level 0 and 2% for level 6.
	// It isn't worth it to make additional optimizations as in original.
	// Small size is preferable.

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	function adler32(adler, buf, len, pos) {
	  var s1 = (adler & 0xffff) |0,
	      s2 = ((adler >>> 16) & 0xffff) |0,
	      n = 0;

	  while (len !== 0) {
	    // Set limit ~ twice less than 5552, to keep
	    // s2 in 31-bits, because we force signed ints.
	    // in other case %= will fail.
	    n = len > 2000 ? 2000 : len;
	    len -= n;

	    do {
	      s1 = (s1 + buf[pos++]) |0;
	      s2 = (s2 + s1) |0;
	    } while (--n);

	    s1 %= 65521;
	    s2 %= 65521;
	  }

	  return (s1 | (s2 << 16)) |0;
	}


	adler32_1 = adler32;
	return adler32_1;
}

var crc32_1;
var hasRequiredCrc32;

function requireCrc32 () {
	if (hasRequiredCrc32) return crc32_1;
	hasRequiredCrc32 = 1;

	// Note: we can't get significant speed boost here.
	// So write code to minimize size - no pregenerated tables
	// and array tools dependencies.

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	// Use ordinary array, since untyped makes no boost here
	function makeTable() {
	  var c, table = [];

	  for (var n = 0; n < 256; n++) {
	    c = n;
	    for (var k = 0; k < 8; k++) {
	      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
	    }
	    table[n] = c;
	  }

	  return table;
	}

	// Create table on load. Just 255 signed longs. Not a problem.
	var crcTable = makeTable();


	function crc32(crc, buf, len, pos) {
	  var t = crcTable,
	      end = pos + len;

	  crc ^= -1;

	  for (var i = pos; i < end; i++) {
	    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
	  }

	  return (crc ^ (-1)); // >>> 0;
	}


	crc32_1 = crc32;
	return crc32_1;
}

var messages;
var hasRequiredMessages;

function requireMessages () {
	if (hasRequiredMessages) return messages;
	hasRequiredMessages = 1;

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	messages = {
	  2:      'need dictionary',     /* Z_NEED_DICT       2  */
	  1:      'stream end',          /* Z_STREAM_END      1  */
	  0:      '',                    /* Z_OK              0  */
	  '-1':   'file error',          /* Z_ERRNO         (-1) */
	  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
	  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
	  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
	  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
	  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
	};
	return messages;
}

var hasRequiredDeflate$1;

function requireDeflate$1 () {
	if (hasRequiredDeflate$1) return deflate;
	hasRequiredDeflate$1 = 1;

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	var utils   = requireCommon();
	var trees   = requireTrees();
	var adler32 = requireAdler32();
	var crc32   = requireCrc32();
	var msg     = requireMessages();

	/* Public constants ==========================================================*/
	/* ===========================================================================*/


	/* Allowed flush values; see deflate() and inflate() below for details */
	var Z_NO_FLUSH      = 0;
	var Z_PARTIAL_FLUSH = 1;
	//var Z_SYNC_FLUSH    = 2;
	var Z_FULL_FLUSH    = 3;
	var Z_FINISH        = 4;
	var Z_BLOCK         = 5;
	//var Z_TREES         = 6;


	/* Return codes for the compression/decompression functions. Negative values
	 * are errors, positive values are used for special but normal events.
	 */
	var Z_OK            = 0;
	var Z_STREAM_END    = 1;
	//var Z_NEED_DICT     = 2;
	//var Z_ERRNO         = -1;
	var Z_STREAM_ERROR  = -2;
	var Z_DATA_ERROR    = -3;
	//var Z_MEM_ERROR     = -4;
	var Z_BUF_ERROR     = -5;
	//var Z_VERSION_ERROR = -6;


	/* compression levels */
	//var Z_NO_COMPRESSION      = 0;
	//var Z_BEST_SPEED          = 1;
	//var Z_BEST_COMPRESSION    = 9;
	var Z_DEFAULT_COMPRESSION = -1;


	var Z_FILTERED            = 1;
	var Z_HUFFMAN_ONLY        = 2;
	var Z_RLE                 = 3;
	var Z_FIXED               = 4;
	var Z_DEFAULT_STRATEGY    = 0;

	/* Possible values of the data_type field (though see inflate()) */
	//var Z_BINARY              = 0;
	//var Z_TEXT                = 1;
	//var Z_ASCII               = 1; // = Z_TEXT
	var Z_UNKNOWN             = 2;


	/* The deflate compression method */
	var Z_DEFLATED  = 8;

	/*============================================================================*/


	var MAX_MEM_LEVEL = 9;
	/* Maximum value for memLevel in deflateInit2 */
	var MAX_WBITS = 15;
	/* 32K LZ77 window */
	var DEF_MEM_LEVEL = 8;


	var LENGTH_CODES  = 29;
	/* number of length codes, not counting the special END_BLOCK code */
	var LITERALS      = 256;
	/* number of literal bytes 0..255 */
	var L_CODES       = LITERALS + 1 + LENGTH_CODES;
	/* number of Literal or Length codes, including the END_BLOCK code */
	var D_CODES       = 30;
	/* number of distance codes */
	var BL_CODES      = 19;
	/* number of codes used to transfer the bit lengths */
	var HEAP_SIZE     = 2 * L_CODES + 1;
	/* maximum heap size */
	var MAX_BITS  = 15;
	/* All codes must not exceed MAX_BITS bits */

	var MIN_MATCH = 3;
	var MAX_MATCH = 258;
	var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

	var PRESET_DICT = 0x20;

	var INIT_STATE = 42;
	var EXTRA_STATE = 69;
	var NAME_STATE = 73;
	var COMMENT_STATE = 91;
	var HCRC_STATE = 103;
	var BUSY_STATE = 113;
	var FINISH_STATE = 666;

	var BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
	var BS_BLOCK_DONE     = 2; /* block flush performed */
	var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
	var BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

	var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

	function err(strm, errorCode) {
	  strm.msg = msg[errorCode];
	  return errorCode;
	}

	function rank(f) {
	  return ((f) << 1) - ((f) > 4 ? 9 : 0);
	}

	function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }


	/* =========================================================================
	 * Flush as much pending output as possible. All deflate() output goes
	 * through this function so some applications may wish to modify it
	 * to avoid allocating a large strm->output buffer and copying into it.
	 * (See also read_buf()).
	 */
	function flush_pending(strm) {
	  var s = strm.state;

	  //_tr_flush_bits(s);
	  var len = s.pending;
	  if (len > strm.avail_out) {
	    len = strm.avail_out;
	  }
	  if (len === 0) { return; }

	  utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
	  strm.next_out += len;
	  s.pending_out += len;
	  strm.total_out += len;
	  strm.avail_out -= len;
	  s.pending -= len;
	  if (s.pending === 0) {
	    s.pending_out = 0;
	  }
	}


	function flush_block_only(s, last) {
	  trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
	  s.block_start = s.strstart;
	  flush_pending(s.strm);
	}


	function put_byte(s, b) {
	  s.pending_buf[s.pending++] = b;
	}


	/* =========================================================================
	 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
	 * IN assertion: the stream state is correct and there is enough room in
	 * pending_buf.
	 */
	function putShortMSB(s, b) {
	//  put_byte(s, (Byte)(b >> 8));
	//  put_byte(s, (Byte)(b & 0xff));
	  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
	  s.pending_buf[s.pending++] = b & 0xff;
	}


	/* ===========================================================================
	 * Read a new buffer from the current input stream, update the adler32
	 * and total number of bytes read.  All deflate() input goes through
	 * this function so some applications may wish to modify it to avoid
	 * allocating a large strm->input buffer and copying from it.
	 * (See also flush_pending()).
	 */
	function read_buf(strm, buf, start, size) {
	  var len = strm.avail_in;

	  if (len > size) { len = size; }
	  if (len === 0) { return 0; }

	  strm.avail_in -= len;

	  // zmemcpy(buf, strm->next_in, len);
	  utils.arraySet(buf, strm.input, strm.next_in, len, start);
	  if (strm.state.wrap === 1) {
	    strm.adler = adler32(strm.adler, buf, len, start);
	  }

	  else if (strm.state.wrap === 2) {
	    strm.adler = crc32(strm.adler, buf, len, start);
	  }

	  strm.next_in += len;
	  strm.total_in += len;

	  return len;
	}


	/* ===========================================================================
	 * Set match_start to the longest match starting at the given string and
	 * return its length. Matches shorter or equal to prev_length are discarded,
	 * in which case the result is equal to prev_length and match_start is
	 * garbage.
	 * IN assertions: cur_match is the head of the hash chain for the current
	 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
	 * OUT assertion: the match length is not greater than s->lookahead.
	 */
	function longest_match(s, cur_match) {
	  var chain_length = s.max_chain_length;      /* max hash chain length */
	  var scan = s.strstart; /* current string */
	  var match;                       /* matched string */
	  var len;                           /* length of current match */
	  var best_len = s.prev_length;              /* best match length so far */
	  var nice_match = s.nice_match;             /* stop if match long enough */
	  var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
	      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

	  var _win = s.window; // shortcut

	  var wmask = s.w_mask;
	  var prev  = s.prev;

	  /* Stop when cur_match becomes <= limit. To simplify the code,
	   * we prevent matches with the string of window index 0.
	   */

	  var strend = s.strstart + MAX_MATCH;
	  var scan_end1  = _win[scan + best_len - 1];
	  var scan_end   = _win[scan + best_len];

	  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
	   * It is easy to get rid of this optimization if necessary.
	   */
	  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

	  /* Do not waste too much time if we already have a good match: */
	  if (s.prev_length >= s.good_match) {
	    chain_length >>= 2;
	  }
	  /* Do not look for matches beyond the end of the input. This is necessary
	   * to make deflate deterministic.
	   */
	  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

	  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

	  do {
	    // Assert(cur_match < s->strstart, "no future");
	    match = cur_match;

	    /* Skip to next match if the match length cannot increase
	     * or if the match length is less than 2.  Note that the checks below
	     * for insufficient lookahead only occur occasionally for performance
	     * reasons.  Therefore uninitialized memory will be accessed, and
	     * conditional jumps will be made that depend on those values.
	     * However the length of the match is limited to the lookahead, so
	     * the output of deflate is not affected by the uninitialized values.
	     */

	    if (_win[match + best_len]     !== scan_end  ||
	        _win[match + best_len - 1] !== scan_end1 ||
	        _win[match]                !== _win[scan] ||
	        _win[++match]              !== _win[scan + 1]) {
	      continue;
	    }

	    /* The check at best_len-1 can be removed because it will be made
	     * again later. (This heuristic is not always a win.)
	     * It is not necessary to compare scan[2] and match[2] since they
	     * are always equal when the other bytes match, given that
	     * the hash keys are equal and that HASH_BITS >= 8.
	     */
	    scan += 2;
	    match++;
	    // Assert(*scan == *match, "match[2]?");

	    /* We check for insufficient lookahead only every 8th comparison;
	     * the 256th check will be made at strstart+258.
	     */
	    do {
	      /*jshint noempty:false*/
	    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
	             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
	             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
	             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
	             scan < strend);

	    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

	    len = MAX_MATCH - (strend - scan);
	    scan = strend - MAX_MATCH;

	    if (len > best_len) {
	      s.match_start = cur_match;
	      best_len = len;
	      if (len >= nice_match) {
	        break;
	      }
	      scan_end1  = _win[scan + best_len - 1];
	      scan_end   = _win[scan + best_len];
	    }
	  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

	  if (best_len <= s.lookahead) {
	    return best_len;
	  }
	  return s.lookahead;
	}


	/* ===========================================================================
	 * Fill the window when the lookahead becomes insufficient.
	 * Updates strstart and lookahead.
	 *
	 * IN assertion: lookahead < MIN_LOOKAHEAD
	 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
	 *    At least one byte has been read, or avail_in == 0; reads are
	 *    performed for at least two bytes (required for the zip translate_eol
	 *    option -- not supported here).
	 */
	function fill_window(s) {
	  var _w_size = s.w_size;
	  var p, n, m, more, str;

	  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

	  do {
	    more = s.window_size - s.lookahead - s.strstart;

	    // JS ints have 32 bit, block below not needed
	    /* Deal with !@#$% 64K limit: */
	    //if (sizeof(int) <= 2) {
	    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
	    //        more = wsize;
	    //
	    //  } else if (more == (unsigned)(-1)) {
	    //        /* Very unlikely, but possible on 16 bit machine if
	    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
	    //         */
	    //        more--;
	    //    }
	    //}


	    /* If the window is almost full and there is insufficient lookahead,
	     * move the upper half to the lower one to make room in the upper half.
	     */
	    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

	      utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
	      s.match_start -= _w_size;
	      s.strstart -= _w_size;
	      /* we now have strstart >= MAX_DIST */
	      s.block_start -= _w_size;

	      /* Slide the hash table (could be avoided with 32 bit values
	       at the expense of memory usage). We slide even when level == 0
	       to keep the hash table consistent if we switch back to level > 0
	       later. (Using level 0 permanently is not an optimal usage of
	       zlib, so we don't care about this pathological case.)
	       */

	      n = s.hash_size;
	      p = n;
	      do {
	        m = s.head[--p];
	        s.head[p] = (m >= _w_size ? m - _w_size : 0);
	      } while (--n);

	      n = _w_size;
	      p = n;
	      do {
	        m = s.prev[--p];
	        s.prev[p] = (m >= _w_size ? m - _w_size : 0);
	        /* If n is not on any hash chain, prev[n] is garbage but
	         * its value will never be used.
	         */
	      } while (--n);

	      more += _w_size;
	    }
	    if (s.strm.avail_in === 0) {
	      break;
	    }

	    /* If there was no sliding:
	     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
	     *    more == window_size - lookahead - strstart
	     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
	     * => more >= window_size - 2*WSIZE + 2
	     * In the BIG_MEM or MMAP case (not yet supported),
	     *   window_size == input_size + MIN_LOOKAHEAD  &&
	     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
	     * Otherwise, window_size == 2*WSIZE so more >= 2.
	     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
	     */
	    //Assert(more >= 2, "more < 2");
	    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
	    s.lookahead += n;

	    /* Initialize the hash value now that we have some input: */
	    if (s.lookahead + s.insert >= MIN_MATCH) {
	      str = s.strstart - s.insert;
	      s.ins_h = s.window[str];

	      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
	      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
	//#if MIN_MATCH != 3
	//        Call update_hash() MIN_MATCH-3 more times
	//#endif
	      while (s.insert) {
	        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
	        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

	        s.prev[str & s.w_mask] = s.head[s.ins_h];
	        s.head[s.ins_h] = str;
	        str++;
	        s.insert--;
	        if (s.lookahead + s.insert < MIN_MATCH) {
	          break;
	        }
	      }
	    }
	    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
	     * but this is not important since only literal bytes will be emitted.
	     */

	  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

	  /* If the WIN_INIT bytes after the end of the current data have never been
	   * written, then zero those bytes in order to avoid memory check reports of
	   * the use of uninitialized (or uninitialised as Julian writes) bytes by
	   * the longest match routines.  Update the high water mark for the next
	   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
	   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
	   */
	//  if (s.high_water < s.window_size) {
	//    var curr = s.strstart + s.lookahead;
	//    var init = 0;
	//
	//    if (s.high_water < curr) {
	//      /* Previous high water mark below current data -- zero WIN_INIT
	//       * bytes or up to end of window, whichever is less.
	//       */
	//      init = s.window_size - curr;
	//      if (init > WIN_INIT)
	//        init = WIN_INIT;
	//      zmemzero(s->window + curr, (unsigned)init);
	//      s->high_water = curr + init;
	//    }
	//    else if (s->high_water < (ulg)curr + WIN_INIT) {
	//      /* High water mark at or above current data, but below current data
	//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
	//       * to end of window, whichever is less.
	//       */
	//      init = (ulg)curr + WIN_INIT - s->high_water;
	//      if (init > s->window_size - s->high_water)
	//        init = s->window_size - s->high_water;
	//      zmemzero(s->window + s->high_water, (unsigned)init);
	//      s->high_water += init;
	//    }
	//  }
	//
	//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
	//    "not enough room for search");
	}

	/* ===========================================================================
	 * Copy without compression as much as possible from the input stream, return
	 * the current block state.
	 * This function does not insert new strings in the dictionary since
	 * uncompressible data is probably not useful. This function is used
	 * only for the level=0 compression option.
	 * NOTE: this function should be optimized to avoid extra copying from
	 * window to pending_buf.
	 */
	function deflate_stored(s, flush) {
	  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
	   * to pending_buf_size, and each stored block has a 5 byte header:
	   */
	  var max_block_size = 0xffff;

	  if (max_block_size > s.pending_buf_size - 5) {
	    max_block_size = s.pending_buf_size - 5;
	  }

	  /* Copy as much as possible from input to output: */
	  for (;;) {
	    /* Fill the window as much as possible: */
	    if (s.lookahead <= 1) {

	      //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
	      //  s->block_start >= (long)s->w_size, "slide too late");
	//      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
	//        s.block_start >= s.w_size)) {
	//        throw  new Error("slide too late");
	//      }

	      fill_window(s);
	      if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
	        return BS_NEED_MORE;
	      }

	      if (s.lookahead === 0) {
	        break;
	      }
	      /* flush the current block */
	    }
	    //Assert(s->block_start >= 0L, "block gone");
	//    if (s.block_start < 0) throw new Error("block gone");

	    s.strstart += s.lookahead;
	    s.lookahead = 0;

	    /* Emit a stored block if pending_buf will be full: */
	    var max_start = s.block_start + max_block_size;

	    if (s.strstart === 0 || s.strstart >= max_start) {
	      /* strstart == 0 is possible when wraparound on 16-bit machine */
	      s.lookahead = s.strstart - max_start;
	      s.strstart = max_start;
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/


	    }
	    /* Flush if we may have to slide, otherwise block_start may become
	     * negative and the data will be gone:
	     */
	    if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/
	    }
	  }

	  s.insert = 0;

	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }

	  if (s.strstart > s.block_start) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }

	  return BS_NEED_MORE;
	}

	/* ===========================================================================
	 * Compress as much as possible from the input stream, return the current
	 * block state.
	 * This function does not perform lazy evaluation of matches and inserts
	 * new strings in the dictionary only for unmatched strings or for short
	 * matches. It is used only for the fast compression options.
	 */
	function deflate_fast(s, flush) {
	  var hash_head;        /* head of the hash chain */
	  var bflush;           /* set if current block must be flushed */

	  for (;;) {
	    /* Make sure that we always have enough lookahead, except
	     * at the end of the input file. We need MAX_MATCH bytes
	     * for the next match, plus MIN_MATCH bytes to insert the
	     * string following the next match.
	     */
	    if (s.lookahead < MIN_LOOKAHEAD) {
	      fill_window(s);
	      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
	        return BS_NEED_MORE;
	      }
	      if (s.lookahead === 0) {
	        break; /* flush the current block */
	      }
	    }

	    /* Insert the string window[strstart .. strstart+2] in the
	     * dictionary, and set hash_head to the head of the hash chain:
	     */
	    hash_head = 0/*NIL*/;
	    if (s.lookahead >= MIN_MATCH) {
	      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
	      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
	      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
	      s.head[s.ins_h] = s.strstart;
	      /***/
	    }

	    /* Find the longest match, discarding those <= prev_length.
	     * At this point we have always match_length < MIN_MATCH
	     */
	    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
	      /* To simplify the code, we prevent matches with the string
	       * of window index 0 (in particular we have to avoid a match
	       * of the string with itself at the start of the input file).
	       */
	      s.match_length = longest_match(s, hash_head);
	      /* longest_match() sets match_start */
	    }
	    if (s.match_length >= MIN_MATCH) {
	      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

	      /*** _tr_tally_dist(s, s.strstart - s.match_start,
	                     s.match_length - MIN_MATCH, bflush); ***/
	      bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

	      s.lookahead -= s.match_length;

	      /* Insert new strings in the hash table only if the match length
	       * is not too large. This saves time but degrades compression.
	       */
	      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
	        s.match_length--; /* string at strstart already in table */
	        do {
	          s.strstart++;
	          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
	          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
	          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
	          s.head[s.ins_h] = s.strstart;
	          /***/
	          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
	           * always MIN_MATCH bytes ahead.
	           */
	        } while (--s.match_length !== 0);
	        s.strstart++;
	      } else
	      {
	        s.strstart += s.match_length;
	        s.match_length = 0;
	        s.ins_h = s.window[s.strstart];
	        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
	        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;

	//#if MIN_MATCH != 3
	//                Call UPDATE_HASH() MIN_MATCH-3 more times
	//#endif
	        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
	         * matter since it will be recomputed at next deflate call.
	         */
	      }
	    } else {
	      /* No match, output a literal byte */
	      //Tracevv((stderr,"%c", s.window[s.strstart]));
	      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
	      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

	      s.lookahead--;
	      s.strstart++;
	    }
	    if (bflush) {
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/
	    }
	  }
	  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }
	  if (s.last_lit) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }
	  return BS_BLOCK_DONE;
	}

	/* ===========================================================================
	 * Same as above, but achieves better compression. We use a lazy
	 * evaluation for matches: a match is finally adopted only if there is
	 * no better match at the next window position.
	 */
	function deflate_slow(s, flush) {
	  var hash_head;          /* head of hash chain */
	  var bflush;              /* set if current block must be flushed */

	  var max_insert;

	  /* Process the input block. */
	  for (;;) {
	    /* Make sure that we always have enough lookahead, except
	     * at the end of the input file. We need MAX_MATCH bytes
	     * for the next match, plus MIN_MATCH bytes to insert the
	     * string following the next match.
	     */
	    if (s.lookahead < MIN_LOOKAHEAD) {
	      fill_window(s);
	      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
	        return BS_NEED_MORE;
	      }
	      if (s.lookahead === 0) { break; } /* flush the current block */
	    }

	    /* Insert the string window[strstart .. strstart+2] in the
	     * dictionary, and set hash_head to the head of the hash chain:
	     */
	    hash_head = 0/*NIL*/;
	    if (s.lookahead >= MIN_MATCH) {
	      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
	      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
	      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
	      s.head[s.ins_h] = s.strstart;
	      /***/
	    }

	    /* Find the longest match, discarding those <= prev_length.
	     */
	    s.prev_length = s.match_length;
	    s.prev_match = s.match_start;
	    s.match_length = MIN_MATCH - 1;

	    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
	        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
	      /* To simplify the code, we prevent matches with the string
	       * of window index 0 (in particular we have to avoid a match
	       * of the string with itself at the start of the input file).
	       */
	      s.match_length = longest_match(s, hash_head);
	      /* longest_match() sets match_start */

	      if (s.match_length <= 5 &&
	         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

	        /* If prev_match is also MIN_MATCH, match_start is garbage
	         * but we will ignore the current match anyway.
	         */
	        s.match_length = MIN_MATCH - 1;
	      }
	    }
	    /* If there was a match at the previous step and the current
	     * match is not better, output the previous match:
	     */
	    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
	      max_insert = s.strstart + s.lookahead - MIN_MATCH;
	      /* Do not insert strings in hash table beyond this. */

	      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

	      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
	                     s.prev_length - MIN_MATCH, bflush);***/
	      bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
	      /* Insert in hash table all strings up to the end of the match.
	       * strstart-1 and strstart are already inserted. If there is not
	       * enough lookahead, the last two strings are not inserted in
	       * the hash table.
	       */
	      s.lookahead -= s.prev_length - 1;
	      s.prev_length -= 2;
	      do {
	        if (++s.strstart <= max_insert) {
	          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
	          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
	          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
	          s.head[s.ins_h] = s.strstart;
	          /***/
	        }
	      } while (--s.prev_length !== 0);
	      s.match_available = 0;
	      s.match_length = MIN_MATCH - 1;
	      s.strstart++;

	      if (bflush) {
	        /*** FLUSH_BLOCK(s, 0); ***/
	        flush_block_only(s, false);
	        if (s.strm.avail_out === 0) {
	          return BS_NEED_MORE;
	        }
	        /***/
	      }

	    } else if (s.match_available) {
	      /* If there was no match at the previous position, output a
	       * single literal. If there was a match but the current match
	       * is longer, truncate the previous match to a single literal.
	       */
	      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
	      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
	      bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

	      if (bflush) {
	        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
	        flush_block_only(s, false);
	        /***/
	      }
	      s.strstart++;
	      s.lookahead--;
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	    } else {
	      /* There is no previous match to compare with, wait for
	       * the next step to decide.
	       */
	      s.match_available = 1;
	      s.strstart++;
	      s.lookahead--;
	    }
	  }
	  //Assert (flush != Z_NO_FLUSH, "no flush?");
	  if (s.match_available) {
	    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
	    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
	    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

	    s.match_available = 0;
	  }
	  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }
	  if (s.last_lit) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }

	  return BS_BLOCK_DONE;
	}


	/* ===========================================================================
	 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
	 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
	 * deflate switches away from Z_RLE.)
	 */
	function deflate_rle(s, flush) {
	  var bflush;            /* set if current block must be flushed */
	  var prev;              /* byte at distance one to match */
	  var scan, strend;      /* scan goes up to strend for length of run */

	  var _win = s.window;

	  for (;;) {
	    /* Make sure that we always have enough lookahead, except
	     * at the end of the input file. We need MAX_MATCH bytes
	     * for the longest run, plus one for the unrolled loop.
	     */
	    if (s.lookahead <= MAX_MATCH) {
	      fill_window(s);
	      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
	        return BS_NEED_MORE;
	      }
	      if (s.lookahead === 0) { break; } /* flush the current block */
	    }

	    /* See how many times the previous byte repeats */
	    s.match_length = 0;
	    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
	      scan = s.strstart - 1;
	      prev = _win[scan];
	      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
	        strend = s.strstart + MAX_MATCH;
	        do {
	          /*jshint noempty:false*/
	        } while (prev === _win[++scan] && prev === _win[++scan] &&
	                 prev === _win[++scan] && prev === _win[++scan] &&
	                 prev === _win[++scan] && prev === _win[++scan] &&
	                 prev === _win[++scan] && prev === _win[++scan] &&
	                 scan < strend);
	        s.match_length = MAX_MATCH - (strend - scan);
	        if (s.match_length > s.lookahead) {
	          s.match_length = s.lookahead;
	        }
	      }
	      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
	    }

	    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
	    if (s.match_length >= MIN_MATCH) {
	      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

	      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
	      bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);

	      s.lookahead -= s.match_length;
	      s.strstart += s.match_length;
	      s.match_length = 0;
	    } else {
	      /* No match, output a literal byte */
	      //Tracevv((stderr,"%c", s->window[s->strstart]));
	      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
	      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

	      s.lookahead--;
	      s.strstart++;
	    }
	    if (bflush) {
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/
	    }
	  }
	  s.insert = 0;
	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }
	  if (s.last_lit) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }
	  return BS_BLOCK_DONE;
	}

	/* ===========================================================================
	 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
	 * (It will be regenerated if this run of deflate switches away from Huffman.)
	 */
	function deflate_huff(s, flush) {
	  var bflush;             /* set if current block must be flushed */

	  for (;;) {
	    /* Make sure that we have a literal to write. */
	    if (s.lookahead === 0) {
	      fill_window(s);
	      if (s.lookahead === 0) {
	        if (flush === Z_NO_FLUSH) {
	          return BS_NEED_MORE;
	        }
	        break;      /* flush the current block */
	      }
	    }

	    /* Output a literal byte */
	    s.match_length = 0;
	    //Tracevv((stderr,"%c", s->window[s->strstart]));
	    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
	    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
	    s.lookahead--;
	    s.strstart++;
	    if (bflush) {
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/
	    }
	  }
	  s.insert = 0;
	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }
	  if (s.last_lit) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }
	  return BS_BLOCK_DONE;
	}

	/* Values for max_lazy_match, good_match and max_chain_length, depending on
	 * the desired pack level (0..9). The values given below have been tuned to
	 * exclude worst case performance for pathological files. Better values may be
	 * found for specific files.
	 */
	function Config(good_length, max_lazy, nice_length, max_chain, func) {
	  this.good_length = good_length;
	  this.max_lazy = max_lazy;
	  this.nice_length = nice_length;
	  this.max_chain = max_chain;
	  this.func = func;
	}

	var configuration_table;

	configuration_table = [
	  /*      good lazy nice chain */
	  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
	  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
	  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
	  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

	  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
	  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
	  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
	  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
	  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
	  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
	];


	/* ===========================================================================
	 * Initialize the "longest match" routines for a new zlib stream
	 */
	function lm_init(s) {
	  s.window_size = 2 * s.w_size;

	  /*** CLEAR_HASH(s); ***/
	  zero(s.head); // Fill with NIL (= 0);

	  /* Set the default configuration parameters:
	   */
	  s.max_lazy_match = configuration_table[s.level].max_lazy;
	  s.good_match = configuration_table[s.level].good_length;
	  s.nice_match = configuration_table[s.level].nice_length;
	  s.max_chain_length = configuration_table[s.level].max_chain;

	  s.strstart = 0;
	  s.block_start = 0;
	  s.lookahead = 0;
	  s.insert = 0;
	  s.match_length = s.prev_length = MIN_MATCH - 1;
	  s.match_available = 0;
	  s.ins_h = 0;
	}


	function DeflateState() {
	  this.strm = null;            /* pointer back to this zlib stream */
	  this.status = 0;            /* as the name implies */
	  this.pending_buf = null;      /* output still pending */
	  this.pending_buf_size = 0;  /* size of pending_buf */
	  this.pending_out = 0;       /* next pending byte to output to the stream */
	  this.pending = 0;           /* nb of bytes in the pending buffer */
	  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
	  this.gzhead = null;         /* gzip header information to write */
	  this.gzindex = 0;           /* where in extra, name, or comment */
	  this.method = Z_DEFLATED; /* can only be DEFLATED */
	  this.last_flush = -1;   /* value of flush param for previous deflate call */

	  this.w_size = 0;  /* LZ77 window size (32K by default) */
	  this.w_bits = 0;  /* log2(w_size)  (8..16) */
	  this.w_mask = 0;  /* w_size - 1 */

	  this.window = null;
	  /* Sliding window. Input bytes are read into the second half of the window,
	   * and move to the first half later to keep a dictionary of at least wSize
	   * bytes. With this organization, matches are limited to a distance of
	   * wSize-MAX_MATCH bytes, but this ensures that IO is always
	   * performed with a length multiple of the block size.
	   */

	  this.window_size = 0;
	  /* Actual size of window: 2*wSize, except when the user input buffer
	   * is directly used as sliding window.
	   */

	  this.prev = null;
	  /* Link to older string with same hash index. To limit the size of this
	   * array to 64K, this link is maintained only for the last 32K strings.
	   * An index in this array is thus a window index modulo 32K.
	   */

	  this.head = null;   /* Heads of the hash chains or NIL. */

	  this.ins_h = 0;       /* hash index of string to be inserted */
	  this.hash_size = 0;   /* number of elements in hash table */
	  this.hash_bits = 0;   /* log2(hash_size) */
	  this.hash_mask = 0;   /* hash_size-1 */

	  this.hash_shift = 0;
	  /* Number of bits by which ins_h must be shifted at each input
	   * step. It must be such that after MIN_MATCH steps, the oldest
	   * byte no longer takes part in the hash key, that is:
	   *   hash_shift * MIN_MATCH >= hash_bits
	   */

	  this.block_start = 0;
	  /* Window position at the beginning of the current output block. Gets
	   * negative when the window is moved backwards.
	   */

	  this.match_length = 0;      /* length of best match */
	  this.prev_match = 0;        /* previous match */
	  this.match_available = 0;   /* set if previous match exists */
	  this.strstart = 0;          /* start of string to insert */
	  this.match_start = 0;       /* start of matching string */
	  this.lookahead = 0;         /* number of valid bytes ahead in window */

	  this.prev_length = 0;
	  /* Length of the best match at previous step. Matches not greater than this
	   * are discarded. This is used in the lazy match evaluation.
	   */

	  this.max_chain_length = 0;
	  /* To speed up deflation, hash chains are never searched beyond this
	   * length.  A higher limit improves compression ratio but degrades the
	   * speed.
	   */

	  this.max_lazy_match = 0;
	  /* Attempt to find a better match only when the current match is strictly
	   * smaller than this value. This mechanism is used only for compression
	   * levels >= 4.
	   */
	  // That's alias to max_lazy_match, don't use directly
	  //this.max_insert_length = 0;
	  /* Insert new strings in the hash table only if the match length is not
	   * greater than this length. This saves time but degrades compression.
	   * max_insert_length is used only for compression levels <= 3.
	   */

	  this.level = 0;     /* compression level (1..9) */
	  this.strategy = 0;  /* favor or force Huffman coding*/

	  this.good_match = 0;
	  /* Use a faster search when the previous match is longer than this */

	  this.nice_match = 0; /* Stop searching when current match exceeds this */

	              /* used by trees.c: */

	  /* Didn't use ct_data typedef below to suppress compiler warning */

	  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
	  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
	  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

	  // Use flat array of DOUBLE size, with interleaved fata,
	  // because JS does not support effective
	  this.dyn_ltree  = new utils.Buf16(HEAP_SIZE * 2);
	  this.dyn_dtree  = new utils.Buf16((2 * D_CODES + 1) * 2);
	  this.bl_tree    = new utils.Buf16((2 * BL_CODES + 1) * 2);
	  zero(this.dyn_ltree);
	  zero(this.dyn_dtree);
	  zero(this.bl_tree);

	  this.l_desc   = null;         /* desc. for literal tree */
	  this.d_desc   = null;         /* desc. for distance tree */
	  this.bl_desc  = null;         /* desc. for bit length tree */

	  //ush bl_count[MAX_BITS+1];
	  this.bl_count = new utils.Buf16(MAX_BITS + 1);
	  /* number of codes at each bit length for an optimal tree */

	  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
	  this.heap = new utils.Buf16(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
	  zero(this.heap);

	  this.heap_len = 0;               /* number of elements in the heap */
	  this.heap_max = 0;               /* element of largest frequency */
	  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
	   * The same heap array is used to build all trees.
	   */

	  this.depth = new utils.Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
	  zero(this.depth);
	  /* Depth of each subtree used as tie breaker for trees of equal frequency
	   */

	  this.l_buf = 0;          /* buffer index for literals or lengths */

	  this.lit_bufsize = 0;
	  /* Size of match buffer for literals/lengths.  There are 4 reasons for
	   * limiting lit_bufsize to 64K:
	   *   - frequencies can be kept in 16 bit counters
	   *   - if compression is not successful for the first block, all input
	   *     data is still in the window so we can still emit a stored block even
	   *     when input comes from standard input.  (This can also be done for
	   *     all blocks if lit_bufsize is not greater than 32K.)
	   *   - if compression is not successful for a file smaller than 64K, we can
	   *     even emit a stored file instead of a stored block (saving 5 bytes).
	   *     This is applicable only for zip (not gzip or zlib).
	   *   - creating new Huffman trees less frequently may not provide fast
	   *     adaptation to changes in the input data statistics. (Take for
	   *     example a binary file with poorly compressible code followed by
	   *     a highly compressible string table.) Smaller buffer sizes give
	   *     fast adaptation but have of course the overhead of transmitting
	   *     trees more frequently.
	   *   - I can't count above 4
	   */

	  this.last_lit = 0;      /* running index in l_buf */

	  this.d_buf = 0;
	  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
	   * the same number of elements. To use different lengths, an extra flag
	   * array would be necessary.
	   */

	  this.opt_len = 0;       /* bit length of current block with optimal trees */
	  this.static_len = 0;    /* bit length of current block with static trees */
	  this.matches = 0;       /* number of string matches in current block */
	  this.insert = 0;        /* bytes at end of window left to insert */


	  this.bi_buf = 0;
	  /* Output buffer. bits are inserted starting at the bottom (least
	   * significant bits).
	   */
	  this.bi_valid = 0;
	  /* Number of valid bits in bi_buf.  All bits above the last valid bit
	   * are always zero.
	   */

	  // Used for window memory init. We safely ignore it for JS. That makes
	  // sense only for pointers and memory check tools.
	  //this.high_water = 0;
	  /* High water mark offset in window for initialized bytes -- bytes above
	   * this are set to zero in order to avoid memory check warnings when
	   * longest match routines access bytes past the input.  This is then
	   * updated to the new high water mark.
	   */
	}


	function deflateResetKeep(strm) {
	  var s;

	  if (!strm || !strm.state) {
	    return err(strm, Z_STREAM_ERROR);
	  }

	  strm.total_in = strm.total_out = 0;
	  strm.data_type = Z_UNKNOWN;

	  s = strm.state;
	  s.pending = 0;
	  s.pending_out = 0;

	  if (s.wrap < 0) {
	    s.wrap = -s.wrap;
	    /* was made negative by deflate(..., Z_FINISH); */
	  }
	  s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
	  strm.adler = (s.wrap === 2) ?
	    0  // crc32(0, Z_NULL, 0)
	  :
	    1; // adler32(0, Z_NULL, 0)
	  s.last_flush = Z_NO_FLUSH;
	  trees._tr_init(s);
	  return Z_OK;
	}


	function deflateReset(strm) {
	  var ret = deflateResetKeep(strm);
	  if (ret === Z_OK) {
	    lm_init(strm.state);
	  }
	  return ret;
	}


	function deflateSetHeader(strm, head) {
	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  if (strm.state.wrap !== 2) { return Z_STREAM_ERROR; }
	  strm.state.gzhead = head;
	  return Z_OK;
	}


	function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
	  if (!strm) { // === Z_NULL
	    return Z_STREAM_ERROR;
	  }
	  var wrap = 1;

	  if (level === Z_DEFAULT_COMPRESSION) {
	    level = 6;
	  }

	  if (windowBits < 0) { /* suppress zlib wrapper */
	    wrap = 0;
	    windowBits = -windowBits;
	  }

	  else if (windowBits > 15) {
	    wrap = 2;           /* write gzip wrapper instead */
	    windowBits -= 16;
	  }


	  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
	    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
	    strategy < 0 || strategy > Z_FIXED) {
	    return err(strm, Z_STREAM_ERROR);
	  }


	  if (windowBits === 8) {
	    windowBits = 9;
	  }
	  /* until 256-byte window bug fixed */

	  var s = new DeflateState();

	  strm.state = s;
	  s.strm = strm;

	  s.wrap = wrap;
	  s.gzhead = null;
	  s.w_bits = windowBits;
	  s.w_size = 1 << s.w_bits;
	  s.w_mask = s.w_size - 1;

	  s.hash_bits = memLevel + 7;
	  s.hash_size = 1 << s.hash_bits;
	  s.hash_mask = s.hash_size - 1;
	  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

	  s.window = new utils.Buf8(s.w_size * 2);
	  s.head = new utils.Buf16(s.hash_size);
	  s.prev = new utils.Buf16(s.w_size);

	  // Don't need mem init magic for JS.
	  //s.high_water = 0;  /* nothing written to s->window yet */

	  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

	  s.pending_buf_size = s.lit_bufsize * 4;

	  //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
	  //s->pending_buf = (uchf *) overlay;
	  s.pending_buf = new utils.Buf8(s.pending_buf_size);

	  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
	  //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
	  s.d_buf = 1 * s.lit_bufsize;

	  //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
	  s.l_buf = (1 + 2) * s.lit_bufsize;

	  s.level = level;
	  s.strategy = strategy;
	  s.method = method;

	  return deflateReset(strm);
	}

	function deflateInit(strm, level) {
	  return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
	}


	function deflate$1(strm, flush) {
	  var old_flush, s;
	  var beg, val; // for gzip header write only

	  if (!strm || !strm.state ||
	    flush > Z_BLOCK || flush < 0) {
	    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
	  }

	  s = strm.state;

	  if (!strm.output ||
	      (!strm.input && strm.avail_in !== 0) ||
	      (s.status === FINISH_STATE && flush !== Z_FINISH)) {
	    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
	  }

	  s.strm = strm; /* just in case */
	  old_flush = s.last_flush;
	  s.last_flush = flush;

	  /* Write the header */
	  if (s.status === INIT_STATE) {

	    if (s.wrap === 2) { // GZIP header
	      strm.adler = 0;  //crc32(0L, Z_NULL, 0);
	      put_byte(s, 31);
	      put_byte(s, 139);
	      put_byte(s, 8);
	      if (!s.gzhead) { // s->gzhead == Z_NULL
	        put_byte(s, 0);
	        put_byte(s, 0);
	        put_byte(s, 0);
	        put_byte(s, 0);
	        put_byte(s, 0);
	        put_byte(s, s.level === 9 ? 2 :
	                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
	                     4 : 0));
	        put_byte(s, OS_CODE);
	        s.status = BUSY_STATE;
	      }
	      else {
	        put_byte(s, (s.gzhead.text ? 1 : 0) +
	                    (s.gzhead.hcrc ? 2 : 0) +
	                    (!s.gzhead.extra ? 0 : 4) +
	                    (!s.gzhead.name ? 0 : 8) +
	                    (!s.gzhead.comment ? 0 : 16)
	        );
	        put_byte(s, s.gzhead.time & 0xff);
	        put_byte(s, (s.gzhead.time >> 8) & 0xff);
	        put_byte(s, (s.gzhead.time >> 16) & 0xff);
	        put_byte(s, (s.gzhead.time >> 24) & 0xff);
	        put_byte(s, s.level === 9 ? 2 :
	                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
	                     4 : 0));
	        put_byte(s, s.gzhead.os & 0xff);
	        if (s.gzhead.extra && s.gzhead.extra.length) {
	          put_byte(s, s.gzhead.extra.length & 0xff);
	          put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
	        }
	        if (s.gzhead.hcrc) {
	          strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
	        }
	        s.gzindex = 0;
	        s.status = EXTRA_STATE;
	      }
	    }
	    else // DEFLATE header
	    {
	      var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
	      var level_flags = -1;

	      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
	        level_flags = 0;
	      } else if (s.level < 6) {
	        level_flags = 1;
	      } else if (s.level === 6) {
	        level_flags = 2;
	      } else {
	        level_flags = 3;
	      }
	      header |= (level_flags << 6);
	      if (s.strstart !== 0) { header |= PRESET_DICT; }
	      header += 31 - (header % 31);

	      s.status = BUSY_STATE;
	      putShortMSB(s, header);

	      /* Save the adler32 of the preset dictionary: */
	      if (s.strstart !== 0) {
	        putShortMSB(s, strm.adler >>> 16);
	        putShortMSB(s, strm.adler & 0xffff);
	      }
	      strm.adler = 1; // adler32(0L, Z_NULL, 0);
	    }
	  }

	//#ifdef GZIP
	  if (s.status === EXTRA_STATE) {
	    if (s.gzhead.extra/* != Z_NULL*/) {
	      beg = s.pending;  /* start of bytes to update crc */

	      while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
	        if (s.pending === s.pending_buf_size) {
	          if (s.gzhead.hcrc && s.pending > beg) {
	            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	          }
	          flush_pending(strm);
	          beg = s.pending;
	          if (s.pending === s.pending_buf_size) {
	            break;
	          }
	        }
	        put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
	        s.gzindex++;
	      }
	      if (s.gzhead.hcrc && s.pending > beg) {
	        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	      }
	      if (s.gzindex === s.gzhead.extra.length) {
	        s.gzindex = 0;
	        s.status = NAME_STATE;
	      }
	    }
	    else {
	      s.status = NAME_STATE;
	    }
	  }
	  if (s.status === NAME_STATE) {
	    if (s.gzhead.name/* != Z_NULL*/) {
	      beg = s.pending;  /* start of bytes to update crc */
	      //int val;

	      do {
	        if (s.pending === s.pending_buf_size) {
	          if (s.gzhead.hcrc && s.pending > beg) {
	            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	          }
	          flush_pending(strm);
	          beg = s.pending;
	          if (s.pending === s.pending_buf_size) {
	            val = 1;
	            break;
	          }
	        }
	        // JS specific: little magic to add zero terminator to end of string
	        if (s.gzindex < s.gzhead.name.length) {
	          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
	        } else {
	          val = 0;
	        }
	        put_byte(s, val);
	      } while (val !== 0);

	      if (s.gzhead.hcrc && s.pending > beg) {
	        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	      }
	      if (val === 0) {
	        s.gzindex = 0;
	        s.status = COMMENT_STATE;
	      }
	    }
	    else {
	      s.status = COMMENT_STATE;
	    }
	  }
	  if (s.status === COMMENT_STATE) {
	    if (s.gzhead.comment/* != Z_NULL*/) {
	      beg = s.pending;  /* start of bytes to update crc */
	      //int val;

	      do {
	        if (s.pending === s.pending_buf_size) {
	          if (s.gzhead.hcrc && s.pending > beg) {
	            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	          }
	          flush_pending(strm);
	          beg = s.pending;
	          if (s.pending === s.pending_buf_size) {
	            val = 1;
	            break;
	          }
	        }
	        // JS specific: little magic to add zero terminator to end of string
	        if (s.gzindex < s.gzhead.comment.length) {
	          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
	        } else {
	          val = 0;
	        }
	        put_byte(s, val);
	      } while (val !== 0);

	      if (s.gzhead.hcrc && s.pending > beg) {
	        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	      }
	      if (val === 0) {
	        s.status = HCRC_STATE;
	      }
	    }
	    else {
	      s.status = HCRC_STATE;
	    }
	  }
	  if (s.status === HCRC_STATE) {
	    if (s.gzhead.hcrc) {
	      if (s.pending + 2 > s.pending_buf_size) {
	        flush_pending(strm);
	      }
	      if (s.pending + 2 <= s.pending_buf_size) {
	        put_byte(s, strm.adler & 0xff);
	        put_byte(s, (strm.adler >> 8) & 0xff);
	        strm.adler = 0; //crc32(0L, Z_NULL, 0);
	        s.status = BUSY_STATE;
	      }
	    }
	    else {
	      s.status = BUSY_STATE;
	    }
	  }
	//#endif

	  /* Flush as much pending output as possible */
	  if (s.pending !== 0) {
	    flush_pending(strm);
	    if (strm.avail_out === 0) {
	      /* Since avail_out is 0, deflate will be called again with
	       * more output space, but possibly with both pending and
	       * avail_in equal to zero. There won't be anything to do,
	       * but this is not an error situation so make sure we
	       * return OK instead of BUF_ERROR at next call of deflate:
	       */
	      s.last_flush = -1;
	      return Z_OK;
	    }

	    /* Make sure there is something to do and avoid duplicate consecutive
	     * flushes. For repeated and useless calls with Z_FINISH, we keep
	     * returning Z_STREAM_END instead of Z_BUF_ERROR.
	     */
	  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
	    flush !== Z_FINISH) {
	    return err(strm, Z_BUF_ERROR);
	  }

	  /* User must not provide more input after the first FINISH: */
	  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
	    return err(strm, Z_BUF_ERROR);
	  }

	  /* Start a new block or continue the current one.
	   */
	  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
	    (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
	    var bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
	      (s.strategy === Z_RLE ? deflate_rle(s, flush) :
	        configuration_table[s.level].func(s, flush));

	    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
	      s.status = FINISH_STATE;
	    }
	    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
	      if (strm.avail_out === 0) {
	        s.last_flush = -1;
	        /* avoid BUF_ERROR next call, see above */
	      }
	      return Z_OK;
	      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
	       * of deflate should use the same flush parameter to make sure
	       * that the flush is complete. So we don't have to output an
	       * empty block here, this will be done at next call. This also
	       * ensures that for a very small output buffer, we emit at most
	       * one empty block.
	       */
	    }
	    if (bstate === BS_BLOCK_DONE) {
	      if (flush === Z_PARTIAL_FLUSH) {
	        trees._tr_align(s);
	      }
	      else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

	        trees._tr_stored_block(s, 0, 0, false);
	        /* For a full flush, this empty block will be recognized
	         * as a special marker by inflate_sync().
	         */
	        if (flush === Z_FULL_FLUSH) {
	          /*** CLEAR_HASH(s); ***/             /* forget history */
	          zero(s.head); // Fill with NIL (= 0);

	          if (s.lookahead === 0) {
	            s.strstart = 0;
	            s.block_start = 0;
	            s.insert = 0;
	          }
	        }
	      }
	      flush_pending(strm);
	      if (strm.avail_out === 0) {
	        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
	        return Z_OK;
	      }
	    }
	  }
	  //Assert(strm->avail_out > 0, "bug2");
	  //if (strm.avail_out <= 0) { throw new Error("bug2");}

	  if (flush !== Z_FINISH) { return Z_OK; }
	  if (s.wrap <= 0) { return Z_STREAM_END; }

	  /* Write the trailer */
	  if (s.wrap === 2) {
	    put_byte(s, strm.adler & 0xff);
	    put_byte(s, (strm.adler >> 8) & 0xff);
	    put_byte(s, (strm.adler >> 16) & 0xff);
	    put_byte(s, (strm.adler >> 24) & 0xff);
	    put_byte(s, strm.total_in & 0xff);
	    put_byte(s, (strm.total_in >> 8) & 0xff);
	    put_byte(s, (strm.total_in >> 16) & 0xff);
	    put_byte(s, (strm.total_in >> 24) & 0xff);
	  }
	  else
	  {
	    putShortMSB(s, strm.adler >>> 16);
	    putShortMSB(s, strm.adler & 0xffff);
	  }

	  flush_pending(strm);
	  /* If avail_out is zero, the application will call deflate again
	   * to flush the rest.
	   */
	  if (s.wrap > 0) { s.wrap = -s.wrap; }
	  /* write the trailer only once! */
	  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
	}

	function deflateEnd(strm) {
	  var status;

	  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
	    return Z_STREAM_ERROR;
	  }

	  status = strm.state.status;
	  if (status !== INIT_STATE &&
	    status !== EXTRA_STATE &&
	    status !== NAME_STATE &&
	    status !== COMMENT_STATE &&
	    status !== HCRC_STATE &&
	    status !== BUSY_STATE &&
	    status !== FINISH_STATE
	  ) {
	    return err(strm, Z_STREAM_ERROR);
	  }

	  strm.state = null;

	  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
	}


	/* =========================================================================
	 * Initializes the compression dictionary from the given byte
	 * sequence without producing any compressed output.
	 */
	function deflateSetDictionary(strm, dictionary) {
	  var dictLength = dictionary.length;

	  var s;
	  var str, n;
	  var wrap;
	  var avail;
	  var next;
	  var input;
	  var tmpDict;

	  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
	    return Z_STREAM_ERROR;
	  }

	  s = strm.state;
	  wrap = s.wrap;

	  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
	    return Z_STREAM_ERROR;
	  }

	  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
	  if (wrap === 1) {
	    /* adler32(strm->adler, dictionary, dictLength); */
	    strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
	  }

	  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

	  /* if dictionary would fill window, just replace the history */
	  if (dictLength >= s.w_size) {
	    if (wrap === 0) {            /* already empty otherwise */
	      /*** CLEAR_HASH(s); ***/
	      zero(s.head); // Fill with NIL (= 0);
	      s.strstart = 0;
	      s.block_start = 0;
	      s.insert = 0;
	    }
	    /* use the tail */
	    // dictionary = dictionary.slice(dictLength - s.w_size);
	    tmpDict = new utils.Buf8(s.w_size);
	    utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
	    dictionary = tmpDict;
	    dictLength = s.w_size;
	  }
	  /* insert dictionary into window and hash */
	  avail = strm.avail_in;
	  next = strm.next_in;
	  input = strm.input;
	  strm.avail_in = dictLength;
	  strm.next_in = 0;
	  strm.input = dictionary;
	  fill_window(s);
	  while (s.lookahead >= MIN_MATCH) {
	    str = s.strstart;
	    n = s.lookahead - (MIN_MATCH - 1);
	    do {
	      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
	      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

	      s.prev[str & s.w_mask] = s.head[s.ins_h];

	      s.head[s.ins_h] = str;
	      str++;
	    } while (--n);
	    s.strstart = str;
	    s.lookahead = MIN_MATCH - 1;
	    fill_window(s);
	  }
	  s.strstart += s.lookahead;
	  s.block_start = s.strstart;
	  s.insert = s.lookahead;
	  s.lookahead = 0;
	  s.match_length = s.prev_length = MIN_MATCH - 1;
	  s.match_available = 0;
	  strm.next_in = next;
	  strm.input = input;
	  strm.avail_in = avail;
	  s.wrap = wrap;
	  return Z_OK;
	}


	deflate.deflateInit = deflateInit;
	deflate.deflateInit2 = deflateInit2;
	deflate.deflateReset = deflateReset;
	deflate.deflateResetKeep = deflateResetKeep;
	deflate.deflateSetHeader = deflateSetHeader;
	deflate.deflate = deflate$1;
	deflate.deflateEnd = deflateEnd;
	deflate.deflateSetDictionary = deflateSetDictionary;
	deflate.deflateInfo = 'pako deflate (from Nodeca project)';

	/* Not implemented
	exports.deflateBound = deflateBound;
	exports.deflateCopy = deflateCopy;
	exports.deflateParams = deflateParams;
	exports.deflatePending = deflatePending;
	exports.deflatePrime = deflatePrime;
	exports.deflateTune = deflateTune;
	*/
	return deflate;
}

var strings = {};

var hasRequiredStrings;

function requireStrings () {
	if (hasRequiredStrings) return strings;
	hasRequiredStrings = 1;


	var utils = requireCommon();


	// Quick check if we can use fast array to bin string conversion
	//
	// - apply(Array) can fail on Android 2.2
	// - apply(Uint8Array) can fail on iOS 5.1 Safari
	//
	var STR_APPLY_OK = true;
	var STR_APPLY_UIA_OK = true;

	try { String.fromCharCode.apply(null, [ 0 ]); } catch (__) { STR_APPLY_OK = false; }
	try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


	// Table with utf8 lengths (calculated by first byte of sequence)
	// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
	// because max possible codepoint is 0x10ffff
	var _utf8len = new utils.Buf8(256);
	for (var q = 0; q < 256; q++) {
	  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
	}
	_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


	// convert string to array (typed, when possible)
	strings.string2buf = function (str) {
	  var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

	  // count binary size
	  for (m_pos = 0; m_pos < str_len; m_pos++) {
	    c = str.charCodeAt(m_pos);
	    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
	      c2 = str.charCodeAt(m_pos + 1);
	      if ((c2 & 0xfc00) === 0xdc00) {
	        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
	        m_pos++;
	      }
	    }
	    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
	  }

	  // allocate buffer
	  buf = new utils.Buf8(buf_len);

	  // convert
	  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
	    c = str.charCodeAt(m_pos);
	    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
	      c2 = str.charCodeAt(m_pos + 1);
	      if ((c2 & 0xfc00) === 0xdc00) {
	        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
	        m_pos++;
	      }
	    }
	    if (c < 0x80) {
	      /* one byte */
	      buf[i++] = c;
	    } else if (c < 0x800) {
	      /* two bytes */
	      buf[i++] = 0xC0 | (c >>> 6);
	      buf[i++] = 0x80 | (c & 0x3f);
	    } else if (c < 0x10000) {
	      /* three bytes */
	      buf[i++] = 0xE0 | (c >>> 12);
	      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
	      buf[i++] = 0x80 | (c & 0x3f);
	    } else {
	      /* four bytes */
	      buf[i++] = 0xf0 | (c >>> 18);
	      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
	      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
	      buf[i++] = 0x80 | (c & 0x3f);
	    }
	  }

	  return buf;
	};

	// Helper (used in 2 places)
	function buf2binstring(buf, len) {
	  // On Chrome, the arguments in a function call that are allowed is `65534`.
	  // If the length of the buffer is smaller than that, we can use this optimization,
	  // otherwise we will take a slower path.
	  if (len < 65534) {
	    if ((buf.subarray && STR_APPLY_UIA_OK) || (!buf.subarray && STR_APPLY_OK)) {
	      return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
	    }
	  }

	  var result = '';
	  for (var i = 0; i < len; i++) {
	    result += String.fromCharCode(buf[i]);
	  }
	  return result;
	}


	// Convert byte array to binary string
	strings.buf2binstring = function (buf) {
	  return buf2binstring(buf, buf.length);
	};


	// Convert binary string (typed, when possible)
	strings.binstring2buf = function (str) {
	  var buf = new utils.Buf8(str.length);
	  for (var i = 0, len = buf.length; i < len; i++) {
	    buf[i] = str.charCodeAt(i);
	  }
	  return buf;
	};


	// convert array to string
	strings.buf2string = function (buf, max) {
	  var i, out, c, c_len;
	  var len = max || buf.length;

	  // Reserve max possible length (2 words per char)
	  // NB: by unknown reasons, Array is significantly faster for
	  //     String.fromCharCode.apply than Uint16Array.
	  var utf16buf = new Array(len * 2);

	  for (out = 0, i = 0; i < len;) {
	    c = buf[i++];
	    // quick process ascii
	    if (c < 0x80) { utf16buf[out++] = c; continue; }

	    c_len = _utf8len[c];
	    // skip 5 & 6 byte codes
	    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

	    // apply mask on first byte
	    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
	    // join the rest
	    while (c_len > 1 && i < len) {
	      c = (c << 6) | (buf[i++] & 0x3f);
	      c_len--;
	    }

	    // terminated by end of string?
	    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

	    if (c < 0x10000) {
	      utf16buf[out++] = c;
	    } else {
	      c -= 0x10000;
	      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
	      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
	    }
	  }

	  return buf2binstring(utf16buf, out);
	};


	// Calculate max possible position in utf8 buffer,
	// that will not break sequence. If that's not possible
	// - (very small limits) return max size as is.
	//
	// buf[] - utf8 bytes array
	// max   - length limit (mandatory);
	strings.utf8border = function (buf, max) {
	  var pos;

	  max = max || buf.length;
	  if (max > buf.length) { max = buf.length; }

	  // go back from last position, until start of sequence found
	  pos = max - 1;
	  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

	  // Very small and broken sequence,
	  // return max, because we should return something anyway.
	  if (pos < 0) { return max; }

	  // If we came to start of buffer - that means buffer is too small,
	  // return max too.
	  if (pos === 0) { return max; }

	  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
	};
	return strings;
}

var zstream;
var hasRequiredZstream;

function requireZstream () {
	if (hasRequiredZstream) return zstream;
	hasRequiredZstream = 1;

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	function ZStream() {
	  /* next input byte */
	  this.input = null; // JS specific, because we have no pointers
	  this.next_in = 0;
	  /* number of bytes available at input */
	  this.avail_in = 0;
	  /* total number of input bytes read so far */
	  this.total_in = 0;
	  /* next output byte should be put there */
	  this.output = null; // JS specific, because we have no pointers
	  this.next_out = 0;
	  /* remaining free space at output */
	  this.avail_out = 0;
	  /* total number of bytes output so far */
	  this.total_out = 0;
	  /* last error message, NULL if no error */
	  this.msg = ''/*Z_NULL*/;
	  /* not visible by applications */
	  this.state = null;
	  /* best guess about the data type: binary or text */
	  this.data_type = 2/*Z_UNKNOWN*/;
	  /* adler32 value of the uncompressed data */
	  this.adler = 0;
	}

	zstream = ZStream;
	return zstream;
}

var hasRequiredDeflate;

function requireDeflate () {
	if (hasRequiredDeflate) return deflate$1;
	hasRequiredDeflate = 1;


	var zlib_deflate = requireDeflate$1();
	var utils        = requireCommon();
	var strings      = requireStrings();
	var msg          = requireMessages();
	var ZStream      = requireZstream();

	var toString = Object.prototype.toString;

	/* Public constants ==========================================================*/
	/* ===========================================================================*/

	var Z_NO_FLUSH      = 0;
	var Z_FINISH        = 4;

	var Z_OK            = 0;
	var Z_STREAM_END    = 1;
	var Z_SYNC_FLUSH    = 2;

	var Z_DEFAULT_COMPRESSION = -1;

	var Z_DEFAULT_STRATEGY    = 0;

	var Z_DEFLATED  = 8;

	/* ===========================================================================*/


	/**
	 * class Deflate
	 *
	 * Generic JS-style wrapper for zlib calls. If you don't need
	 * streaming behaviour - use more simple functions: [[deflate]],
	 * [[deflateRaw]] and [[gzip]].
	 **/

	/* internal
	 * Deflate.chunks -> Array
	 *
	 * Chunks of output data, if [[Deflate#onData]] not overridden.
	 **/

	/**
	 * Deflate.result -> Uint8Array|Array
	 *
	 * Compressed result, generated by default [[Deflate#onData]]
	 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
	 * (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
	 * push a chunk with explicit flush (call [[Deflate#push]] with
	 * `Z_SYNC_FLUSH` param).
	 **/

	/**
	 * Deflate.err -> Number
	 *
	 * Error code after deflate finished. 0 (Z_OK) on success.
	 * You will not need it in real life, because deflate errors
	 * are possible only on wrong options or bad `onData` / `onEnd`
	 * custom handlers.
	 **/

	/**
	 * Deflate.msg -> String
	 *
	 * Error message, if [[Deflate.err]] != 0
	 **/


	/**
	 * new Deflate(options)
	 * - options (Object): zlib deflate options.
	 *
	 * Creates new deflator instance with specified params. Throws exception
	 * on bad params. Supported options:
	 *
	 * - `level`
	 * - `windowBits`
	 * - `memLevel`
	 * - `strategy`
	 * - `dictionary`
	 *
	 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	 * for more information on these.
	 *
	 * Additional options, for internal needs:
	 *
	 * - `chunkSize` - size of generated data chunks (16K by default)
	 * - `raw` (Boolean) - do raw deflate
	 * - `gzip` (Boolean) - create gzip wrapper
	 * - `to` (String) - if equal to 'string', then result will be "binary string"
	 *    (each char code [0..255])
	 * - `header` (Object) - custom header for gzip
	 *   - `text` (Boolean) - true if compressed data believed to be text
	 *   - `time` (Number) - modification time, unix timestamp
	 *   - `os` (Number) - operation system code
	 *   - `extra` (Array) - array of bytes with extra data (max 65536)
	 *   - `name` (String) - file name (binary string)
	 *   - `comment` (String) - comment (binary string)
	 *   - `hcrc` (Boolean) - true if header crc should be added
	 *
	 * ##### Example:
	 *
	 * ```javascript
	 * var pako = require('pako')
	 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
	 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
	 *
	 * var deflate = new pako.Deflate({ level: 3});
	 *
	 * deflate.push(chunk1, false);
	 * deflate.push(chunk2, true);  // true -> last chunk
	 *
	 * if (deflate.err) { throw new Error(deflate.err); }
	 *
	 * console.log(deflate.result);
	 * ```
	 **/
	function Deflate(options) {
	  if (!(this instanceof Deflate)) return new Deflate(options);

	  this.options = utils.assign({
	    level: Z_DEFAULT_COMPRESSION,
	    method: Z_DEFLATED,
	    chunkSize: 16384,
	    windowBits: 15,
	    memLevel: 8,
	    strategy: Z_DEFAULT_STRATEGY,
	    to: ''
	  }, options || {});

	  var opt = this.options;

	  if (opt.raw && (opt.windowBits > 0)) {
	    opt.windowBits = -opt.windowBits;
	  }

	  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
	    opt.windowBits += 16;
	  }

	  this.err    = 0;      // error code, if happens (0 = Z_OK)
	  this.msg    = '';     // error message
	  this.ended  = false;  // used to avoid multiple onEnd() calls
	  this.chunks = [];     // chunks of compressed data

	  this.strm = new ZStream();
	  this.strm.avail_out = 0;

	  var status = zlib_deflate.deflateInit2(
	    this.strm,
	    opt.level,
	    opt.method,
	    opt.windowBits,
	    opt.memLevel,
	    opt.strategy
	  );

	  if (status !== Z_OK) {
	    throw new Error(msg[status]);
	  }

	  if (opt.header) {
	    zlib_deflate.deflateSetHeader(this.strm, opt.header);
	  }

	  if (opt.dictionary) {
	    var dict;
	    // Convert data if needed
	    if (typeof opt.dictionary === 'string') {
	      // If we need to compress text, change encoding to utf8.
	      dict = strings.string2buf(opt.dictionary);
	    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
	      dict = new Uint8Array(opt.dictionary);
	    } else {
	      dict = opt.dictionary;
	    }

	    status = zlib_deflate.deflateSetDictionary(this.strm, dict);

	    if (status !== Z_OK) {
	      throw new Error(msg[status]);
	    }

	    this._dict_set = true;
	  }
	}

	/**
	 * Deflate#push(data[, mode]) -> Boolean
	 * - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
	 *   converted to utf8 byte sequence.
	 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
	 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
	 *
	 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
	 * new compressed chunks. Returns `true` on success. The last data block must have
	 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
	 * [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
	 * can use mode Z_SYNC_FLUSH, keeping the compression context.
	 *
	 * On fail call [[Deflate#onEnd]] with error code and return false.
	 *
	 * We strongly recommend to use `Uint8Array` on input for best speed (output
	 * array format is detected automatically). Also, don't skip last param and always
	 * use the same type in your code (boolean or number). That will improve JS speed.
	 *
	 * For regular `Array`-s make sure all elements are [0..255].
	 *
	 * ##### Example
	 *
	 * ```javascript
	 * push(chunk, false); // push one of data chunks
	 * ...
	 * push(chunk, true);  // push last chunk
	 * ```
	 **/
	Deflate.prototype.push = function (data, mode) {
	  var strm = this.strm;
	  var chunkSize = this.options.chunkSize;
	  var status, _mode;

	  if (this.ended) { return false; }

	  _mode = (mode === ~~mode) ? mode : ((mode === true) ? Z_FINISH : Z_NO_FLUSH);

	  // Convert data if needed
	  if (typeof data === 'string') {
	    // If we need to compress text, change encoding to utf8.
	    strm.input = strings.string2buf(data);
	  } else if (toString.call(data) === '[object ArrayBuffer]') {
	    strm.input = new Uint8Array(data);
	  } else {
	    strm.input = data;
	  }

	  strm.next_in = 0;
	  strm.avail_in = strm.input.length;

	  do {
	    if (strm.avail_out === 0) {
	      strm.output = new utils.Buf8(chunkSize);
	      strm.next_out = 0;
	      strm.avail_out = chunkSize;
	    }
	    status = zlib_deflate.deflate(strm, _mode);    /* no bad return value */

	    if (status !== Z_STREAM_END && status !== Z_OK) {
	      this.onEnd(status);
	      this.ended = true;
	      return false;
	    }
	    if (strm.avail_out === 0 || (strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH))) {
	      if (this.options.to === 'string') {
	        this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
	      } else {
	        this.onData(utils.shrinkBuf(strm.output, strm.next_out));
	      }
	    }
	  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);

	  // Finalize on the last chunk.
	  if (_mode === Z_FINISH) {
	    status = zlib_deflate.deflateEnd(this.strm);
	    this.onEnd(status);
	    this.ended = true;
	    return status === Z_OK;
	  }

	  // callback interim results if Z_SYNC_FLUSH.
	  if (_mode === Z_SYNC_FLUSH) {
	    this.onEnd(Z_OK);
	    strm.avail_out = 0;
	    return true;
	  }

	  return true;
	};


	/**
	 * Deflate#onData(chunk) -> Void
	 * - chunk (Uint8Array|Array|String): output data. Type of array depends
	 *   on js engine support. When string output requested, each chunk
	 *   will be string.
	 *
	 * By default, stores data blocks in `chunks[]` property and glue
	 * those in `onEnd`. Override this handler, if you need another behaviour.
	 **/
	Deflate.prototype.onData = function (chunk) {
	  this.chunks.push(chunk);
	};


	/**
	 * Deflate#onEnd(status) -> Void
	 * - status (Number): deflate status. 0 (Z_OK) on success,
	 *   other if not.
	 *
	 * Called once after you tell deflate that the input stream is
	 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
	 * or if an error happened. By default - join collected chunks,
	 * free memory and fill `results` / `err` properties.
	 **/
	Deflate.prototype.onEnd = function (status) {
	  // On success - join
	  if (status === Z_OK) {
	    if (this.options.to === 'string') {
	      this.result = this.chunks.join('');
	    } else {
	      this.result = utils.flattenChunks(this.chunks);
	    }
	  }
	  this.chunks = [];
	  this.err = status;
	  this.msg = this.strm.msg;
	};


	/**
	 * deflate(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to compress.
	 * - options (Object): zlib deflate options.
	 *
	 * Compress `data` with deflate algorithm and `options`.
	 *
	 * Supported options are:
	 *
	 * - level
	 * - windowBits
	 * - memLevel
	 * - strategy
	 * - dictionary
	 *
	 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	 * for more information on these.
	 *
	 * Sugar (options):
	 *
	 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
	 *   negative windowBits implicitly.
	 * - `to` (String) - if equal to 'string', then result will be "binary string"
	 *    (each char code [0..255])
	 *
	 * ##### Example:
	 *
	 * ```javascript
	 * var pako = require('pako')
	 *   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
	 *
	 * console.log(pako.deflate(data));
	 * ```
	 **/
	function deflate(input, options) {
	  var deflator = new Deflate(options);

	  deflator.push(input, true);

	  // That will never happens, if you don't cheat with options :)
	  if (deflator.err) { throw deflator.msg || msg[deflator.err]; }

	  return deflator.result;
	}


	/**
	 * deflateRaw(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to compress.
	 * - options (Object): zlib deflate options.
	 *
	 * The same as [[deflate]], but creates raw data, without wrapper
	 * (header and adler32 crc).
	 **/
	function deflateRaw(input, options) {
	  options = options || {};
	  options.raw = true;
	  return deflate(input, options);
	}


	/**
	 * gzip(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to compress.
	 * - options (Object): zlib deflate options.
	 *
	 * The same as [[deflate]], but create gzip wrapper instead of
	 * deflate one.
	 **/
	function gzip(input, options) {
	  options = options || {};
	  options.gzip = true;
	  return deflate(input, options);
	}


	deflate$1.Deflate = Deflate;
	deflate$1.deflate = deflate;
	deflate$1.deflateRaw = deflateRaw;
	deflate$1.gzip = gzip;
	return deflate$1;
}

var inflate$1 = {};

var inflate = {};

var inffast;
var hasRequiredInffast;

function requireInffast () {
	if (hasRequiredInffast) return inffast;
	hasRequiredInffast = 1;

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	// See state defs from inflate.js
	var BAD = 30;       /* got a data error -- remain here until reset */
	var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */

	/*
	   Decode literal, length, and distance codes and write out the resulting
	   literal and match bytes until either not enough input or output is
	   available, an end-of-block is encountered, or a data error is encountered.
	   When large enough input and output buffers are supplied to inflate(), for
	   example, a 16K input buffer and a 64K output buffer, more than 95% of the
	   inflate execution time is spent in this routine.

	   Entry assumptions:

	        state.mode === LEN
	        strm.avail_in >= 6
	        strm.avail_out >= 258
	        start >= strm.avail_out
	        state.bits < 8

	   On return, state.mode is one of:

	        LEN -- ran out of enough output space or enough available input
	        TYPE -- reached end of block code, inflate() to interpret next block
	        BAD -- error in block data

	   Notes:

	    - The maximum input bits used by a length/distance pair is 15 bits for the
	      length code, 5 bits for the length extra, 15 bits for the distance code,
	      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
	      Therefore if strm.avail_in >= 6, then there is enough input to avoid
	      checking for available input while decoding.

	    - The maximum bytes that a single length/distance pair can output is 258
	      bytes, which is the maximum length that can be coded.  inflate_fast()
	      requires strm.avail_out >= 258 for each loop to avoid checking for
	      output space.
	 */
	inffast = function inflate_fast(strm, start) {
	  var state;
	  var _in;                    /* local strm.input */
	  var last;                   /* have enough input while in < last */
	  var _out;                   /* local strm.output */
	  var beg;                    /* inflate()'s initial strm.output */
	  var end;                    /* while out < end, enough space available */
	//#ifdef INFLATE_STRICT
	  var dmax;                   /* maximum distance from zlib header */
	//#endif
	  var wsize;                  /* window size or zero if not using window */
	  var whave;                  /* valid bytes in the window */
	  var wnext;                  /* window write index */
	  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
	  var s_window;               /* allocated sliding window, if wsize != 0 */
	  var hold;                   /* local strm.hold */
	  var bits;                   /* local strm.bits */
	  var lcode;                  /* local strm.lencode */
	  var dcode;                  /* local strm.distcode */
	  var lmask;                  /* mask for first level of length codes */
	  var dmask;                  /* mask for first level of distance codes */
	  var here;                   /* retrieved table entry */
	  var op;                     /* code bits, operation, extra bits, or */
	                              /*  window position, window bytes to copy */
	  var len;                    /* match length, unused bytes */
	  var dist;                   /* match distance */
	  var from;                   /* where to copy match from */
	  var from_source;


	  var input, output; // JS specific, because we have no pointers

	  /* copy state to local variables */
	  state = strm.state;
	  //here = state.here;
	  _in = strm.next_in;
	  input = strm.input;
	  last = _in + (strm.avail_in - 5);
	  _out = strm.next_out;
	  output = strm.output;
	  beg = _out - (start - strm.avail_out);
	  end = _out + (strm.avail_out - 257);
	//#ifdef INFLATE_STRICT
	  dmax = state.dmax;
	//#endif
	  wsize = state.wsize;
	  whave = state.whave;
	  wnext = state.wnext;
	  s_window = state.window;
	  hold = state.hold;
	  bits = state.bits;
	  lcode = state.lencode;
	  dcode = state.distcode;
	  lmask = (1 << state.lenbits) - 1;
	  dmask = (1 << state.distbits) - 1;


	  /* decode literals and length/distances until end-of-block or not enough
	     input data or output space */

	  top:
	  do {
	    if (bits < 15) {
	      hold += input[_in++] << bits;
	      bits += 8;
	      hold += input[_in++] << bits;
	      bits += 8;
	    }

	    here = lcode[hold & lmask];

	    dolen:
	    for (;;) { // Goto emulation
	      op = here >>> 24/*here.bits*/;
	      hold >>>= op;
	      bits -= op;
	      op = (here >>> 16) & 0xff/*here.op*/;
	      if (op === 0) {                          /* literal */
	        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
	        //        "inflate:         literal '%c'\n" :
	        //        "inflate:         literal 0x%02x\n", here.val));
	        output[_out++] = here & 0xffff/*here.val*/;
	      }
	      else if (op & 16) {                     /* length base */
	        len = here & 0xffff/*here.val*/;
	        op &= 15;                           /* number of extra bits */
	        if (op) {
	          if (bits < op) {
	            hold += input[_in++] << bits;
	            bits += 8;
	          }
	          len += hold & ((1 << op) - 1);
	          hold >>>= op;
	          bits -= op;
	        }
	        //Tracevv((stderr, "inflate:         length %u\n", len));
	        if (bits < 15) {
	          hold += input[_in++] << bits;
	          bits += 8;
	          hold += input[_in++] << bits;
	          bits += 8;
	        }
	        here = dcode[hold & dmask];

	        dodist:
	        for (;;) { // goto emulation
	          op = here >>> 24/*here.bits*/;
	          hold >>>= op;
	          bits -= op;
	          op = (here >>> 16) & 0xff/*here.op*/;

	          if (op & 16) {                      /* distance base */
	            dist = here & 0xffff/*here.val*/;
	            op &= 15;                       /* number of extra bits */
	            if (bits < op) {
	              hold += input[_in++] << bits;
	              bits += 8;
	              if (bits < op) {
	                hold += input[_in++] << bits;
	                bits += 8;
	              }
	            }
	            dist += hold & ((1 << op) - 1);
	//#ifdef INFLATE_STRICT
	            if (dist > dmax) {
	              strm.msg = 'invalid distance too far back';
	              state.mode = BAD;
	              break top;
	            }
	//#endif
	            hold >>>= op;
	            bits -= op;
	            //Tracevv((stderr, "inflate:         distance %u\n", dist));
	            op = _out - beg;                /* max distance in output */
	            if (dist > op) {                /* see if copy from window */
	              op = dist - op;               /* distance back in window */
	              if (op > whave) {
	                if (state.sane) {
	                  strm.msg = 'invalid distance too far back';
	                  state.mode = BAD;
	                  break top;
	                }

	// (!) This block is disabled in zlib defaults,
	// don't enable it for binary compatibility
	//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
	//                if (len <= op - whave) {
	//                  do {
	//                    output[_out++] = 0;
	//                  } while (--len);
	//                  continue top;
	//                }
	//                len -= op - whave;
	//                do {
	//                  output[_out++] = 0;
	//                } while (--op > whave);
	//                if (op === 0) {
	//                  from = _out - dist;
	//                  do {
	//                    output[_out++] = output[from++];
	//                  } while (--len);
	//                  continue top;
	//                }
	//#endif
	              }
	              from = 0; // window index
	              from_source = s_window;
	              if (wnext === 0) {           /* very common case */
	                from += wsize - op;
	                if (op < len) {         /* some from window */
	                  len -= op;
	                  do {
	                    output[_out++] = s_window[from++];
	                  } while (--op);
	                  from = _out - dist;  /* rest from output */
	                  from_source = output;
	                }
	              }
	              else if (wnext < op) {      /* wrap around window */
	                from += wsize + wnext - op;
	                op -= wnext;
	                if (op < len) {         /* some from end of window */
	                  len -= op;
	                  do {
	                    output[_out++] = s_window[from++];
	                  } while (--op);
	                  from = 0;
	                  if (wnext < len) {  /* some from start of window */
	                    op = wnext;
	                    len -= op;
	                    do {
	                      output[_out++] = s_window[from++];
	                    } while (--op);
	                    from = _out - dist;      /* rest from output */
	                    from_source = output;
	                  }
	                }
	              }
	              else {                      /* contiguous in window */
	                from += wnext - op;
	                if (op < len) {         /* some from window */
	                  len -= op;
	                  do {
	                    output[_out++] = s_window[from++];
	                  } while (--op);
	                  from = _out - dist;  /* rest from output */
	                  from_source = output;
	                }
	              }
	              while (len > 2) {
	                output[_out++] = from_source[from++];
	                output[_out++] = from_source[from++];
	                output[_out++] = from_source[from++];
	                len -= 3;
	              }
	              if (len) {
	                output[_out++] = from_source[from++];
	                if (len > 1) {
	                  output[_out++] = from_source[from++];
	                }
	              }
	            }
	            else {
	              from = _out - dist;          /* copy direct from output */
	              do {                        /* minimum length is three */
	                output[_out++] = output[from++];
	                output[_out++] = output[from++];
	                output[_out++] = output[from++];
	                len -= 3;
	              } while (len > 2);
	              if (len) {
	                output[_out++] = output[from++];
	                if (len > 1) {
	                  output[_out++] = output[from++];
	                }
	              }
	            }
	          }
	          else if ((op & 64) === 0) {          /* 2nd level distance code */
	            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
	            continue dodist;
	          }
	          else {
	            strm.msg = 'invalid distance code';
	            state.mode = BAD;
	            break top;
	          }

	          break; // need to emulate goto via "continue"
	        }
	      }
	      else if ((op & 64) === 0) {              /* 2nd level length code */
	        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
	        continue dolen;
	      }
	      else if (op & 32) {                     /* end-of-block */
	        //Tracevv((stderr, "inflate:         end of block\n"));
	        state.mode = TYPE;
	        break top;
	      }
	      else {
	        strm.msg = 'invalid literal/length code';
	        state.mode = BAD;
	        break top;
	      }

	      break; // need to emulate goto via "continue"
	    }
	  } while (_in < last && _out < end);

	  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
	  len = bits >> 3;
	  _in -= len;
	  bits -= len << 3;
	  hold &= (1 << bits) - 1;

	  /* update state and return */
	  strm.next_in = _in;
	  strm.next_out = _out;
	  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
	  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
	  state.hold = hold;
	  state.bits = bits;
	  return;
	};
	return inffast;
}

var inftrees;
var hasRequiredInftrees;

function requireInftrees () {
	if (hasRequiredInftrees) return inftrees;
	hasRequiredInftrees = 1;

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	var utils = requireCommon();

	var MAXBITS = 15;
	var ENOUGH_LENS = 852;
	var ENOUGH_DISTS = 592;
	//var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

	var CODES = 0;
	var LENS = 1;
	var DISTS = 2;

	var lbase = [ /* Length codes 257..285 base */
	  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
	  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
	];

	var lext = [ /* Length codes 257..285 extra */
	  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
	  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
	];

	var dbase = [ /* Distance codes 0..29 base */
	  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
	  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
	  8193, 12289, 16385, 24577, 0, 0
	];

	var dext = [ /* Distance codes 0..29 extra */
	  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
	  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
	  28, 28, 29, 29, 64, 64
	];

	inftrees = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts)
	{
	  var bits = opts.bits;
	      //here = opts.here; /* table entry for duplication */

	  var len = 0;               /* a code's length in bits */
	  var sym = 0;               /* index of code symbols */
	  var min = 0, max = 0;          /* minimum and maximum code lengths */
	  var root = 0;              /* number of index bits for root table */
	  var curr = 0;              /* number of index bits for current table */
	  var drop = 0;              /* code bits to drop for sub-table */
	  var left = 0;                   /* number of prefix codes available */
	  var used = 0;              /* code entries in table used */
	  var huff = 0;              /* Huffman code */
	  var incr;              /* for incrementing code, index */
	  var fill;              /* index for replicating entries */
	  var low;               /* low bits for current root entry */
	  var mask;              /* mask for low root bits */
	  var next;             /* next available space in table */
	  var base = null;     /* base value table to use */
	  var base_index = 0;
	//  var shoextra;    /* extra bits table to use */
	  var end;                    /* use base and extra for symbol > end */
	  var count = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
	  var offs = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
	  var extra = null;
	  var extra_index = 0;

	  var here_bits, here_op, here_val;

	  /*
	   Process a set of code lengths to create a canonical Huffman code.  The
	   code lengths are lens[0..codes-1].  Each length corresponds to the
	   symbols 0..codes-1.  The Huffman code is generated by first sorting the
	   symbols by length from short to long, and retaining the symbol order
	   for codes with equal lengths.  Then the code starts with all zero bits
	   for the first code of the shortest length, and the codes are integer
	   increments for the same length, and zeros are appended as the length
	   increases.  For the deflate format, these bits are stored backwards
	   from their more natural integer increment ordering, and so when the
	   decoding tables are built in the large loop below, the integer codes
	   are incremented backwards.

	   This routine assumes, but does not check, that all of the entries in
	   lens[] are in the range 0..MAXBITS.  The caller must assure this.
	   1..MAXBITS is interpreted as that code length.  zero means that that
	   symbol does not occur in this code.

	   The codes are sorted by computing a count of codes for each length,
	   creating from that a table of starting indices for each length in the
	   sorted table, and then entering the symbols in order in the sorted
	   table.  The sorted table is work[], with that space being provided by
	   the caller.

	   The length counts are used for other purposes as well, i.e. finding
	   the minimum and maximum length codes, determining if there are any
	   codes at all, checking for a valid set of lengths, and looking ahead
	   at length counts to determine sub-table sizes when building the
	   decoding tables.
	   */

	  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
	  for (len = 0; len <= MAXBITS; len++) {
	    count[len] = 0;
	  }
	  for (sym = 0; sym < codes; sym++) {
	    count[lens[lens_index + sym]]++;
	  }

	  /* bound code lengths, force root to be within code lengths */
	  root = bits;
	  for (max = MAXBITS; max >= 1; max--) {
	    if (count[max] !== 0) { break; }
	  }
	  if (root > max) {
	    root = max;
	  }
	  if (max === 0) {                     /* no symbols to code at all */
	    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
	    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
	    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
	    table[table_index++] = (1 << 24) | (64 << 16) | 0;


	    //table.op[opts.table_index] = 64;
	    //table.bits[opts.table_index] = 1;
	    //table.val[opts.table_index++] = 0;
	    table[table_index++] = (1 << 24) | (64 << 16) | 0;

	    opts.bits = 1;
	    return 0;     /* no symbols, but wait for decoding to report error */
	  }
	  for (min = 1; min < max; min++) {
	    if (count[min] !== 0) { break; }
	  }
	  if (root < min) {
	    root = min;
	  }

	  /* check for an over-subscribed or incomplete set of lengths */
	  left = 1;
	  for (len = 1; len <= MAXBITS; len++) {
	    left <<= 1;
	    left -= count[len];
	    if (left < 0) {
	      return -1;
	    }        /* over-subscribed */
	  }
	  if (left > 0 && (type === CODES || max !== 1)) {
	    return -1;                      /* incomplete set */
	  }

	  /* generate offsets into symbol table for each length for sorting */
	  offs[1] = 0;
	  for (len = 1; len < MAXBITS; len++) {
	    offs[len + 1] = offs[len] + count[len];
	  }

	  /* sort symbols by length, by symbol order within each length */
	  for (sym = 0; sym < codes; sym++) {
	    if (lens[lens_index + sym] !== 0) {
	      work[offs[lens[lens_index + sym]]++] = sym;
	    }
	  }

	  /*
	   Create and fill in decoding tables.  In this loop, the table being
	   filled is at next and has curr index bits.  The code being used is huff
	   with length len.  That code is converted to an index by dropping drop
	   bits off of the bottom.  For codes where len is less than drop + curr,
	   those top drop + curr - len bits are incremented through all values to
	   fill the table with replicated entries.

	   root is the number of index bits for the root table.  When len exceeds
	   root, sub-tables are created pointed to by the root entry with an index
	   of the low root bits of huff.  This is saved in low to check for when a
	   new sub-table should be started.  drop is zero when the root table is
	   being filled, and drop is root when sub-tables are being filled.

	   When a new sub-table is needed, it is necessary to look ahead in the
	   code lengths to determine what size sub-table is needed.  The length
	   counts are used for this, and so count[] is decremented as codes are
	   entered in the tables.

	   used keeps track of how many table entries have been allocated from the
	   provided *table space.  It is checked for LENS and DIST tables against
	   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
	   the initial root table size constants.  See the comments in inftrees.h
	   for more information.

	   sym increments through all symbols, and the loop terminates when
	   all codes of length max, i.e. all codes, have been processed.  This
	   routine permits incomplete codes, so another loop after this one fills
	   in the rest of the decoding tables with invalid code markers.
	   */

	  /* set up for code type */
	  // poor man optimization - use if-else instead of switch,
	  // to avoid deopts in old v8
	  if (type === CODES) {
	    base = extra = work;    /* dummy value--not used */
	    end = 19;

	  } else if (type === LENS) {
	    base = lbase;
	    base_index -= 257;
	    extra = lext;
	    extra_index -= 257;
	    end = 256;

	  } else {                    /* DISTS */
	    base = dbase;
	    extra = dext;
	    end = -1;
	  }

	  /* initialize opts for loop */
	  huff = 0;                   /* starting code */
	  sym = 0;                    /* starting code symbol */
	  len = min;                  /* starting code length */
	  next = table_index;              /* current table to fill in */
	  curr = root;                /* current table index bits */
	  drop = 0;                   /* current bits to drop from code for index */
	  low = -1;                   /* trigger new sub-table when len > root */
	  used = 1 << root;          /* use root table entries */
	  mask = used - 1;            /* mask for comparing low */

	  /* check available table space */
	  if ((type === LENS && used > ENOUGH_LENS) ||
	    (type === DISTS && used > ENOUGH_DISTS)) {
	    return 1;
	  }

	  /* process all codes and make table entries */
	  for (;;) {
	    /* create table entry */
	    here_bits = len - drop;
	    if (work[sym] < end) {
	      here_op = 0;
	      here_val = work[sym];
	    }
	    else if (work[sym] > end) {
	      here_op = extra[extra_index + work[sym]];
	      here_val = base[base_index + work[sym]];
	    }
	    else {
	      here_op = 32 + 64;         /* end of block */
	      here_val = 0;
	    }

	    /* replicate for those indices with low len bits equal to huff */
	    incr = 1 << (len - drop);
	    fill = 1 << curr;
	    min = fill;                 /* save offset to next table */
	    do {
	      fill -= incr;
	      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
	    } while (fill !== 0);

	    /* backwards increment the len-bit code huff */
	    incr = 1 << (len - 1);
	    while (huff & incr) {
	      incr >>= 1;
	    }
	    if (incr !== 0) {
	      huff &= incr - 1;
	      huff += incr;
	    } else {
	      huff = 0;
	    }

	    /* go to next symbol, update count, len */
	    sym++;
	    if (--count[len] === 0) {
	      if (len === max) { break; }
	      len = lens[lens_index + work[sym]];
	    }

	    /* create new sub-table if needed */
	    if (len > root && (huff & mask) !== low) {
	      /* if first time, transition to sub-tables */
	      if (drop === 0) {
	        drop = root;
	      }

	      /* increment past last table */
	      next += min;            /* here min is 1 << curr */

	      /* determine length of next table */
	      curr = len - drop;
	      left = 1 << curr;
	      while (curr + drop < max) {
	        left -= count[curr + drop];
	        if (left <= 0) { break; }
	        curr++;
	        left <<= 1;
	      }

	      /* check for enough space */
	      used += 1 << curr;
	      if ((type === LENS && used > ENOUGH_LENS) ||
	        (type === DISTS && used > ENOUGH_DISTS)) {
	        return 1;
	      }

	      /* point entry in root table to sub-table */
	      low = huff & mask;
	      /*table.op[low] = curr;
	      table.bits[low] = root;
	      table.val[low] = next - opts.table_index;*/
	      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
	    }
	  }

	  /* fill in remaining table entry if code is incomplete (guaranteed to have
	   at most one remaining entry, since if the code is incomplete, the
	   maximum code length that was allowed to get this far is one bit) */
	  if (huff !== 0) {
	    //table.op[next + huff] = 64;            /* invalid code marker */
	    //table.bits[next + huff] = len - drop;
	    //table.val[next + huff] = 0;
	    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
	  }

	  /* set return parameters */
	  //opts.table_index += used;
	  opts.bits = root;
	  return 0;
	};
	return inftrees;
}

var hasRequiredInflate$1;

function requireInflate$1 () {
	if (hasRequiredInflate$1) return inflate;
	hasRequiredInflate$1 = 1;

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	var utils         = requireCommon();
	var adler32       = requireAdler32();
	var crc32         = requireCrc32();
	var inflate_fast  = requireInffast();
	var inflate_table = requireInftrees();

	var CODES = 0;
	var LENS = 1;
	var DISTS = 2;

	/* Public constants ==========================================================*/
	/* ===========================================================================*/


	/* Allowed flush values; see deflate() and inflate() below for details */
	//var Z_NO_FLUSH      = 0;
	//var Z_PARTIAL_FLUSH = 1;
	//var Z_SYNC_FLUSH    = 2;
	//var Z_FULL_FLUSH    = 3;
	var Z_FINISH        = 4;
	var Z_BLOCK         = 5;
	var Z_TREES         = 6;


	/* Return codes for the compression/decompression functions. Negative values
	 * are errors, positive values are used for special but normal events.
	 */
	var Z_OK            = 0;
	var Z_STREAM_END    = 1;
	var Z_NEED_DICT     = 2;
	//var Z_ERRNO         = -1;
	var Z_STREAM_ERROR  = -2;
	var Z_DATA_ERROR    = -3;
	var Z_MEM_ERROR     = -4;
	var Z_BUF_ERROR     = -5;
	//var Z_VERSION_ERROR = -6;

	/* The deflate compression method */
	var Z_DEFLATED  = 8;


	/* STATES ====================================================================*/
	/* ===========================================================================*/


	var    HEAD = 1;       /* i: waiting for magic header */
	var    FLAGS = 2;      /* i: waiting for method and flags (gzip) */
	var    TIME = 3;       /* i: waiting for modification time (gzip) */
	var    OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
	var    EXLEN = 5;      /* i: waiting for extra length (gzip) */
	var    EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
	var    NAME = 7;       /* i: waiting for end of file name (gzip) */
	var    COMMENT = 8;    /* i: waiting for end of comment (gzip) */
	var    HCRC = 9;       /* i: waiting for header crc (gzip) */
	var    DICTID = 10;    /* i: waiting for dictionary check value */
	var    DICT = 11;      /* waiting for inflateSetDictionary() call */
	var        TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
	var        TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
	var        STORED = 14;    /* i: waiting for stored size (length and complement) */
	var        COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
	var        COPY = 16;      /* i/o: waiting for input or output to copy stored block */
	var        TABLE = 17;     /* i: waiting for dynamic block table lengths */
	var        LENLENS = 18;   /* i: waiting for code length code lengths */
	var        CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
	var            LEN_ = 20;      /* i: same as LEN below, but only first time in */
	var            LEN = 21;       /* i: waiting for length/lit/eob code */
	var            LENEXT = 22;    /* i: waiting for length extra bits */
	var            DIST = 23;      /* i: waiting for distance code */
	var            DISTEXT = 24;   /* i: waiting for distance extra bits */
	var            MATCH = 25;     /* o: waiting for output space to copy string */
	var            LIT = 26;       /* o: waiting for output space to write literal */
	var    CHECK = 27;     /* i: waiting for 32-bit check value */
	var    LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
	var    DONE = 29;      /* finished check, done -- remain here until reset */
	var    BAD = 30;       /* got a data error -- remain here until reset */
	var    MEM = 31;       /* got an inflate() memory error -- remain here until reset */
	var    SYNC = 32;      /* looking for synchronization bytes to restart inflate() */

	/* ===========================================================================*/



	var ENOUGH_LENS = 852;
	var ENOUGH_DISTS = 592;
	//var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

	var MAX_WBITS = 15;
	/* 32K LZ77 window */
	var DEF_WBITS = MAX_WBITS;


	function zswap32(q) {
	  return  (((q >>> 24) & 0xff) +
	          ((q >>> 8) & 0xff00) +
	          ((q & 0xff00) << 8) +
	          ((q & 0xff) << 24));
	}


	function InflateState() {
	  this.mode = 0;             /* current inflate mode */
	  this.last = false;          /* true if processing last block */
	  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
	  this.havedict = false;      /* true if dictionary provided */
	  this.flags = 0;             /* gzip header method and flags (0 if zlib) */
	  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
	  this.check = 0;             /* protected copy of check value */
	  this.total = 0;             /* protected copy of output count */
	  // TODO: may be {}
	  this.head = null;           /* where to save gzip header information */

	  /* sliding window */
	  this.wbits = 0;             /* log base 2 of requested window size */
	  this.wsize = 0;             /* window size or zero if not using window */
	  this.whave = 0;             /* valid bytes in the window */
	  this.wnext = 0;             /* window write index */
	  this.window = null;         /* allocated sliding window, if needed */

	  /* bit accumulator */
	  this.hold = 0;              /* input bit accumulator */
	  this.bits = 0;              /* number of bits in "in" */

	  /* for string and stored block copying */
	  this.length = 0;            /* literal or length of data to copy */
	  this.offset = 0;            /* distance back to copy string from */

	  /* for table and code decoding */
	  this.extra = 0;             /* extra bits needed */

	  /* fixed and dynamic code tables */
	  this.lencode = null;          /* starting table for length/literal codes */
	  this.distcode = null;         /* starting table for distance codes */
	  this.lenbits = 0;           /* index bits for lencode */
	  this.distbits = 0;          /* index bits for distcode */

	  /* dynamic table building */
	  this.ncode = 0;             /* number of code length code lengths */
	  this.nlen = 0;              /* number of length code lengths */
	  this.ndist = 0;             /* number of distance code lengths */
	  this.have = 0;              /* number of code lengths in lens[] */
	  this.next = null;              /* next available space in codes[] */

	  this.lens = new utils.Buf16(320); /* temporary storage for code lengths */
	  this.work = new utils.Buf16(288); /* work area for code table building */

	  /*
	   because we don't have pointers in js, we use lencode and distcode directly
	   as buffers so we don't need codes
	  */
	  //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
	  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
	  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
	  this.sane = 0;                   /* if false, allow invalid distance too far */
	  this.back = 0;                   /* bits back of last unprocessed length/lit */
	  this.was = 0;                    /* initial length of match */
	}

	function inflateResetKeep(strm) {
	  var state;

	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  state = strm.state;
	  strm.total_in = strm.total_out = state.total = 0;
	  strm.msg = ''; /*Z_NULL*/
	  if (state.wrap) {       /* to support ill-conceived Java test suite */
	    strm.adler = state.wrap & 1;
	  }
	  state.mode = HEAD;
	  state.last = 0;
	  state.havedict = 0;
	  state.dmax = 32768;
	  state.head = null/*Z_NULL*/;
	  state.hold = 0;
	  state.bits = 0;
	  //state.lencode = state.distcode = state.next = state.codes;
	  state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
	  state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);

	  state.sane = 1;
	  state.back = -1;
	  //Tracev((stderr, "inflate: reset\n"));
	  return Z_OK;
	}

	function inflateReset(strm) {
	  var state;

	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  state = strm.state;
	  state.wsize = 0;
	  state.whave = 0;
	  state.wnext = 0;
	  return inflateResetKeep(strm);

	}

	function inflateReset2(strm, windowBits) {
	  var wrap;
	  var state;

	  /* get the state */
	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  state = strm.state;

	  /* extract wrap request from windowBits parameter */
	  if (windowBits < 0) {
	    wrap = 0;
	    windowBits = -windowBits;
	  }
	  else {
	    wrap = (windowBits >> 4) + 1;
	    if (windowBits < 48) {
	      windowBits &= 15;
	    }
	  }

	  /* set number of window bits, free window if different */
	  if (windowBits && (windowBits < 8 || windowBits > 15)) {
	    return Z_STREAM_ERROR;
	  }
	  if (state.window !== null && state.wbits !== windowBits) {
	    state.window = null;
	  }

	  /* update state and reset the rest of it */
	  state.wrap = wrap;
	  state.wbits = windowBits;
	  return inflateReset(strm);
	}

	function inflateInit2(strm, windowBits) {
	  var ret;
	  var state;

	  if (!strm) { return Z_STREAM_ERROR; }
	  //strm.msg = Z_NULL;                 /* in case we return an error */

	  state = new InflateState();

	  //if (state === Z_NULL) return Z_MEM_ERROR;
	  //Tracev((stderr, "inflate: allocated\n"));
	  strm.state = state;
	  state.window = null/*Z_NULL*/;
	  ret = inflateReset2(strm, windowBits);
	  if (ret !== Z_OK) {
	    strm.state = null/*Z_NULL*/;
	  }
	  return ret;
	}

	function inflateInit(strm) {
	  return inflateInit2(strm, DEF_WBITS);
	}


	/*
	 Return state with length and distance decoding tables and index sizes set to
	 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
	 If BUILDFIXED is defined, then instead this routine builds the tables the
	 first time it's called, and returns those tables the first time and
	 thereafter.  This reduces the size of the code by about 2K bytes, in
	 exchange for a little execution time.  However, BUILDFIXED should not be
	 used for threaded applications, since the rewriting of the tables and virgin
	 may not be thread-safe.
	 */
	var virgin = true;

	var lenfix, distfix; // We have no pointers in JS, so keep tables separate

	function fixedtables(state) {
	  /* build fixed huffman tables if first call (may not be thread safe) */
	  if (virgin) {
	    var sym;

	    lenfix = new utils.Buf32(512);
	    distfix = new utils.Buf32(32);

	    /* literal/length table */
	    sym = 0;
	    while (sym < 144) { state.lens[sym++] = 8; }
	    while (sym < 256) { state.lens[sym++] = 9; }
	    while (sym < 280) { state.lens[sym++] = 7; }
	    while (sym < 288) { state.lens[sym++] = 8; }

	    inflate_table(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

	    /* distance table */
	    sym = 0;
	    while (sym < 32) { state.lens[sym++] = 5; }

	    inflate_table(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

	    /* do this just once */
	    virgin = false;
	  }

	  state.lencode = lenfix;
	  state.lenbits = 9;
	  state.distcode = distfix;
	  state.distbits = 5;
	}


	/*
	 Update the window with the last wsize (normally 32K) bytes written before
	 returning.  If window does not exist yet, create it.  This is only called
	 when a window is already in use, or when output has been written during this
	 inflate call, but the end of the deflate stream has not been reached yet.
	 It is also called to create a window for dictionary data when a dictionary
	 is loaded.

	 Providing output buffers larger than 32K to inflate() should provide a speed
	 advantage, since only the last 32K of output is copied to the sliding window
	 upon return from inflate(), and since all distances after the first 32K of
	 output will fall in the output data, making match copies simpler and faster.
	 The advantage may be dependent on the size of the processor's data caches.
	 */
	function updatewindow(strm, src, end, copy) {
	  var dist;
	  var state = strm.state;

	  /* if it hasn't been done already, allocate space for the window */
	  if (state.window === null) {
	    state.wsize = 1 << state.wbits;
	    state.wnext = 0;
	    state.whave = 0;

	    state.window = new utils.Buf8(state.wsize);
	  }

	  /* copy state->wsize or less output bytes into the circular window */
	  if (copy >= state.wsize) {
	    utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
	    state.wnext = 0;
	    state.whave = state.wsize;
	  }
	  else {
	    dist = state.wsize - state.wnext;
	    if (dist > copy) {
	      dist = copy;
	    }
	    //zmemcpy(state->window + state->wnext, end - copy, dist);
	    utils.arraySet(state.window, src, end - copy, dist, state.wnext);
	    copy -= dist;
	    if (copy) {
	      //zmemcpy(state->window, end - copy, copy);
	      utils.arraySet(state.window, src, end - copy, copy, 0);
	      state.wnext = copy;
	      state.whave = state.wsize;
	    }
	    else {
	      state.wnext += dist;
	      if (state.wnext === state.wsize) { state.wnext = 0; }
	      if (state.whave < state.wsize) { state.whave += dist; }
	    }
	  }
	  return 0;
	}

	function inflate$1(strm, flush) {
	  var state;
	  var input, output;          // input/output buffers
	  var next;                   /* next input INDEX */
	  var put;                    /* next output INDEX */
	  var have, left;             /* available input and output */
	  var hold;                   /* bit buffer */
	  var bits;                   /* bits in bit buffer */
	  var _in, _out;              /* save starting available input and output */
	  var copy;                   /* number of stored or match bytes to copy */
	  var from;                   /* where to copy match bytes from */
	  var from_source;
	  var here = 0;               /* current decoding table entry */
	  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
	  //var last;                   /* parent table entry */
	  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
	  var len;                    /* length to copy for repeats, bits to drop */
	  var ret;                    /* return code */
	  var hbuf = new utils.Buf8(4);    /* buffer for gzip header crc calculation */
	  var opts;

	  var n; // temporary var for NEED_BITS

	  var order = /* permutation of code lengths */
	    [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];


	  if (!strm || !strm.state || !strm.output ||
	      (!strm.input && strm.avail_in !== 0)) {
	    return Z_STREAM_ERROR;
	  }

	  state = strm.state;
	  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


	  //--- LOAD() ---
	  put = strm.next_out;
	  output = strm.output;
	  left = strm.avail_out;
	  next = strm.next_in;
	  input = strm.input;
	  have = strm.avail_in;
	  hold = state.hold;
	  bits = state.bits;
	  //---

	  _in = have;
	  _out = left;
	  ret = Z_OK;

	  inf_leave: // goto emulation
	  for (;;) {
	    switch (state.mode) {
	      case HEAD:
	        if (state.wrap === 0) {
	          state.mode = TYPEDO;
	          break;
	        }
	        //=== NEEDBITS(16);
	        while (bits < 16) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
	          state.check = 0/*crc32(0L, Z_NULL, 0)*/;
	          //=== CRC2(state.check, hold);
	          hbuf[0] = hold & 0xff;
	          hbuf[1] = (hold >>> 8) & 0xff;
	          state.check = crc32(state.check, hbuf, 2, 0);
	          //===//

	          //=== INITBITS();
	          hold = 0;
	          bits = 0;
	          //===//
	          state.mode = FLAGS;
	          break;
	        }
	        state.flags = 0;           /* expect zlib header */
	        if (state.head) {
	          state.head.done = false;
	        }
	        if (!(state.wrap & 1) ||   /* check if zlib header allowed */
	          (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
	          strm.msg = 'incorrect header check';
	          state.mode = BAD;
	          break;
	        }
	        if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
	          strm.msg = 'unknown compression method';
	          state.mode = BAD;
	          break;
	        }
	        //--- DROPBITS(4) ---//
	        hold >>>= 4;
	        bits -= 4;
	        //---//
	        len = (hold & 0x0f)/*BITS(4)*/ + 8;
	        if (state.wbits === 0) {
	          state.wbits = len;
	        }
	        else if (len > state.wbits) {
	          strm.msg = 'invalid window size';
	          state.mode = BAD;
	          break;
	        }
	        state.dmax = 1 << len;
	        //Tracev((stderr, "inflate:   zlib header ok\n"));
	        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
	        state.mode = hold & 0x200 ? DICTID : TYPE;
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	        break;
	      case FLAGS:
	        //=== NEEDBITS(16); */
	        while (bits < 16) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        state.flags = hold;
	        if ((state.flags & 0xff) !== Z_DEFLATED) {
	          strm.msg = 'unknown compression method';
	          state.mode = BAD;
	          break;
	        }
	        if (state.flags & 0xe000) {
	          strm.msg = 'unknown header flags set';
	          state.mode = BAD;
	          break;
	        }
	        if (state.head) {
	          state.head.text = ((hold >> 8) & 1);
	        }
	        if (state.flags & 0x0200) {
	          //=== CRC2(state.check, hold);
	          hbuf[0] = hold & 0xff;
	          hbuf[1] = (hold >>> 8) & 0xff;
	          state.check = crc32(state.check, hbuf, 2, 0);
	          //===//
	        }
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	        state.mode = TIME;
	        /* falls through */
	      case TIME:
	        //=== NEEDBITS(32); */
	        while (bits < 32) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        if (state.head) {
	          state.head.time = hold;
	        }
	        if (state.flags & 0x0200) {
	          //=== CRC4(state.check, hold)
	          hbuf[0] = hold & 0xff;
	          hbuf[1] = (hold >>> 8) & 0xff;
	          hbuf[2] = (hold >>> 16) & 0xff;
	          hbuf[3] = (hold >>> 24) & 0xff;
	          state.check = crc32(state.check, hbuf, 4, 0);
	          //===
	        }
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	        state.mode = OS;
	        /* falls through */
	      case OS:
	        //=== NEEDBITS(16); */
	        while (bits < 16) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        if (state.head) {
	          state.head.xflags = (hold & 0xff);
	          state.head.os = (hold >> 8);
	        }
	        if (state.flags & 0x0200) {
	          //=== CRC2(state.check, hold);
	          hbuf[0] = hold & 0xff;
	          hbuf[1] = (hold >>> 8) & 0xff;
	          state.check = crc32(state.check, hbuf, 2, 0);
	          //===//
	        }
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	        state.mode = EXLEN;
	        /* falls through */
	      case EXLEN:
	        if (state.flags & 0x0400) {
	          //=== NEEDBITS(16); */
	          while (bits < 16) {
	            if (have === 0) { break inf_leave; }
	            have--;
	            hold += input[next++] << bits;
	            bits += 8;
	          }
	          //===//
	          state.length = hold;
	          if (state.head) {
	            state.head.extra_len = hold;
	          }
	          if (state.flags & 0x0200) {
	            //=== CRC2(state.check, hold);
	            hbuf[0] = hold & 0xff;
	            hbuf[1] = (hold >>> 8) & 0xff;
	            state.check = crc32(state.check, hbuf, 2, 0);
	            //===//
	          }
	          //=== INITBITS();
	          hold = 0;
	          bits = 0;
	          //===//
	        }
	        else if (state.head) {
	          state.head.extra = null/*Z_NULL*/;
	        }
	        state.mode = EXTRA;
	        /* falls through */
	      case EXTRA:
	        if (state.flags & 0x0400) {
	          copy = state.length;
	          if (copy > have) { copy = have; }
	          if (copy) {
	            if (state.head) {
	              len = state.head.extra_len - state.length;
	              if (!state.head.extra) {
	                // Use untyped array for more convenient processing later
	                state.head.extra = new Array(state.head.extra_len);
	              }
	              utils.arraySet(
	                state.head.extra,
	                input,
	                next,
	                // extra field is limited to 65536 bytes
	                // - no need for additional size check
	                copy,
	                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
	                len
	              );
	              //zmemcpy(state.head.extra + len, next,
	              //        len + copy > state.head.extra_max ?
	              //        state.head.extra_max - len : copy);
	            }
	            if (state.flags & 0x0200) {
	              state.check = crc32(state.check, input, copy, next);
	            }
	            have -= copy;
	            next += copy;
	            state.length -= copy;
	          }
	          if (state.length) { break inf_leave; }
	        }
	        state.length = 0;
	        state.mode = NAME;
	        /* falls through */
	      case NAME:
	        if (state.flags & 0x0800) {
	          if (have === 0) { break inf_leave; }
	          copy = 0;
	          do {
	            // TODO: 2 or 1 bytes?
	            len = input[next + copy++];
	            /* use constant limit because in js we should not preallocate memory */
	            if (state.head && len &&
	                (state.length < 65536 /*state.head.name_max*/)) {
	              state.head.name += String.fromCharCode(len);
	            }
	          } while (len && copy < have);

	          if (state.flags & 0x0200) {
	            state.check = crc32(state.check, input, copy, next);
	          }
	          have -= copy;
	          next += copy;
	          if (len) { break inf_leave; }
	        }
	        else if (state.head) {
	          state.head.name = null;
	        }
	        state.length = 0;
	        state.mode = COMMENT;
	        /* falls through */
	      case COMMENT:
	        if (state.flags & 0x1000) {
	          if (have === 0) { break inf_leave; }
	          copy = 0;
	          do {
	            len = input[next + copy++];
	            /* use constant limit because in js we should not preallocate memory */
	            if (state.head && len &&
	                (state.length < 65536 /*state.head.comm_max*/)) {
	              state.head.comment += String.fromCharCode(len);
	            }
	          } while (len && copy < have);
	          if (state.flags & 0x0200) {
	            state.check = crc32(state.check, input, copy, next);
	          }
	          have -= copy;
	          next += copy;
	          if (len) { break inf_leave; }
	        }
	        else if (state.head) {
	          state.head.comment = null;
	        }
	        state.mode = HCRC;
	        /* falls through */
	      case HCRC:
	        if (state.flags & 0x0200) {
	          //=== NEEDBITS(16); */
	          while (bits < 16) {
	            if (have === 0) { break inf_leave; }
	            have--;
	            hold += input[next++] << bits;
	            bits += 8;
	          }
	          //===//
	          if (hold !== (state.check & 0xffff)) {
	            strm.msg = 'header crc mismatch';
	            state.mode = BAD;
	            break;
	          }
	          //=== INITBITS();
	          hold = 0;
	          bits = 0;
	          //===//
	        }
	        if (state.head) {
	          state.head.hcrc = ((state.flags >> 9) & 1);
	          state.head.done = true;
	        }
	        strm.adler = state.check = 0;
	        state.mode = TYPE;
	        break;
	      case DICTID:
	        //=== NEEDBITS(32); */
	        while (bits < 32) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        strm.adler = state.check = zswap32(hold);
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	        state.mode = DICT;
	        /* falls through */
	      case DICT:
	        if (state.havedict === 0) {
	          //--- RESTORE() ---
	          strm.next_out = put;
	          strm.avail_out = left;
	          strm.next_in = next;
	          strm.avail_in = have;
	          state.hold = hold;
	          state.bits = bits;
	          //---
	          return Z_NEED_DICT;
	        }
	        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
	        state.mode = TYPE;
	        /* falls through */
	      case TYPE:
	        if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
	        /* falls through */
	      case TYPEDO:
	        if (state.last) {
	          //--- BYTEBITS() ---//
	          hold >>>= bits & 7;
	          bits -= bits & 7;
	          //---//
	          state.mode = CHECK;
	          break;
	        }
	        //=== NEEDBITS(3); */
	        while (bits < 3) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        state.last = (hold & 0x01)/*BITS(1)*/;
	        //--- DROPBITS(1) ---//
	        hold >>>= 1;
	        bits -= 1;
	        //---//

	        switch ((hold & 0x03)/*BITS(2)*/) {
	          case 0:                             /* stored block */
	            //Tracev((stderr, "inflate:     stored block%s\n",
	            //        state.last ? " (last)" : ""));
	            state.mode = STORED;
	            break;
	          case 1:                             /* fixed block */
	            fixedtables(state);
	            //Tracev((stderr, "inflate:     fixed codes block%s\n",
	            //        state.last ? " (last)" : ""));
	            state.mode = LEN_;             /* decode codes */
	            if (flush === Z_TREES) {
	              //--- DROPBITS(2) ---//
	              hold >>>= 2;
	              bits -= 2;
	              //---//
	              break inf_leave;
	            }
	            break;
	          case 2:                             /* dynamic block */
	            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
	            //        state.last ? " (last)" : ""));
	            state.mode = TABLE;
	            break;
	          case 3:
	            strm.msg = 'invalid block type';
	            state.mode = BAD;
	        }
	        //--- DROPBITS(2) ---//
	        hold >>>= 2;
	        bits -= 2;
	        //---//
	        break;
	      case STORED:
	        //--- BYTEBITS() ---// /* go to byte boundary */
	        hold >>>= bits & 7;
	        bits -= bits & 7;
	        //---//
	        //=== NEEDBITS(32); */
	        while (bits < 32) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
	          strm.msg = 'invalid stored block lengths';
	          state.mode = BAD;
	          break;
	        }
	        state.length = hold & 0xffff;
	        //Tracev((stderr, "inflate:       stored length %u\n",
	        //        state.length));
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	        state.mode = COPY_;
	        if (flush === Z_TREES) { break inf_leave; }
	        /* falls through */
	      case COPY_:
	        state.mode = COPY;
	        /* falls through */
	      case COPY:
	        copy = state.length;
	        if (copy) {
	          if (copy > have) { copy = have; }
	          if (copy > left) { copy = left; }
	          if (copy === 0) { break inf_leave; }
	          //--- zmemcpy(put, next, copy); ---
	          utils.arraySet(output, input, next, copy, put);
	          //---//
	          have -= copy;
	          next += copy;
	          left -= copy;
	          put += copy;
	          state.length -= copy;
	          break;
	        }
	        //Tracev((stderr, "inflate:       stored end\n"));
	        state.mode = TYPE;
	        break;
	      case TABLE:
	        //=== NEEDBITS(14); */
	        while (bits < 14) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
	        //--- DROPBITS(5) ---//
	        hold >>>= 5;
	        bits -= 5;
	        //---//
	        state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
	        //--- DROPBITS(5) ---//
	        hold >>>= 5;
	        bits -= 5;
	        //---//
	        state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
	        //--- DROPBITS(4) ---//
	        hold >>>= 4;
	        bits -= 4;
	        //---//
	//#ifndef PKZIP_BUG_WORKAROUND
	        if (state.nlen > 286 || state.ndist > 30) {
	          strm.msg = 'too many length or distance symbols';
	          state.mode = BAD;
	          break;
	        }
	//#endif
	        //Tracev((stderr, "inflate:       table sizes ok\n"));
	        state.have = 0;
	        state.mode = LENLENS;
	        /* falls through */
	      case LENLENS:
	        while (state.have < state.ncode) {
	          //=== NEEDBITS(3);
	          while (bits < 3) {
	            if (have === 0) { break inf_leave; }
	            have--;
	            hold += input[next++] << bits;
	            bits += 8;
	          }
	          //===//
	          state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
	          //--- DROPBITS(3) ---//
	          hold >>>= 3;
	          bits -= 3;
	          //---//
	        }
	        while (state.have < 19) {
	          state.lens[order[state.have++]] = 0;
	        }
	        // We have separate tables & no pointers. 2 commented lines below not needed.
	        //state.next = state.codes;
	        //state.lencode = state.next;
	        // Switch to use dynamic table
	        state.lencode = state.lendyn;
	        state.lenbits = 7;

	        opts = { bits: state.lenbits };
	        ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
	        state.lenbits = opts.bits;

	        if (ret) {
	          strm.msg = 'invalid code lengths set';
	          state.mode = BAD;
	          break;
	        }
	        //Tracev((stderr, "inflate:       code lengths ok\n"));
	        state.have = 0;
	        state.mode = CODELENS;
	        /* falls through */
	      case CODELENS:
	        while (state.have < state.nlen + state.ndist) {
	          for (;;) {
	            here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
	            here_bits = here >>> 24;
	            here_op = (here >>> 16) & 0xff;
	            here_val = here & 0xffff;

	            if ((here_bits) <= bits) { break; }
	            //--- PULLBYTE() ---//
	            if (have === 0) { break inf_leave; }
	            have--;
	            hold += input[next++] << bits;
	            bits += 8;
	            //---//
	          }
	          if (here_val < 16) {
	            //--- DROPBITS(here.bits) ---//
	            hold >>>= here_bits;
	            bits -= here_bits;
	            //---//
	            state.lens[state.have++] = here_val;
	          }
	          else {
	            if (here_val === 16) {
	              //=== NEEDBITS(here.bits + 2);
	              n = here_bits + 2;
	              while (bits < n) {
	                if (have === 0) { break inf_leave; }
	                have--;
	                hold += input[next++] << bits;
	                bits += 8;
	              }
	              //===//
	              //--- DROPBITS(here.bits) ---//
	              hold >>>= here_bits;
	              bits -= here_bits;
	              //---//
	              if (state.have === 0) {
	                strm.msg = 'invalid bit length repeat';
	                state.mode = BAD;
	                break;
	              }
	              len = state.lens[state.have - 1];
	              copy = 3 + (hold & 0x03);//BITS(2);
	              //--- DROPBITS(2) ---//
	              hold >>>= 2;
	              bits -= 2;
	              //---//
	            }
	            else if (here_val === 17) {
	              //=== NEEDBITS(here.bits + 3);
	              n = here_bits + 3;
	              while (bits < n) {
	                if (have === 0) { break inf_leave; }
	                have--;
	                hold += input[next++] << bits;
	                bits += 8;
	              }
	              //===//
	              //--- DROPBITS(here.bits) ---//
	              hold >>>= here_bits;
	              bits -= here_bits;
	              //---//
	              len = 0;
	              copy = 3 + (hold & 0x07);//BITS(3);
	              //--- DROPBITS(3) ---//
	              hold >>>= 3;
	              bits -= 3;
	              //---//
	            }
	            else {
	              //=== NEEDBITS(here.bits + 7);
	              n = here_bits + 7;
	              while (bits < n) {
	                if (have === 0) { break inf_leave; }
	                have--;
	                hold += input[next++] << bits;
	                bits += 8;
	              }
	              //===//
	              //--- DROPBITS(here.bits) ---//
	              hold >>>= here_bits;
	              bits -= here_bits;
	              //---//
	              len = 0;
	              copy = 11 + (hold & 0x7f);//BITS(7);
	              //--- DROPBITS(7) ---//
	              hold >>>= 7;
	              bits -= 7;
	              //---//
	            }
	            if (state.have + copy > state.nlen + state.ndist) {
	              strm.msg = 'invalid bit length repeat';
	              state.mode = BAD;
	              break;
	            }
	            while (copy--) {
	              state.lens[state.have++] = len;
	            }
	          }
	        }

	        /* handle error breaks in while */
	        if (state.mode === BAD) { break; }

	        /* check for end-of-block code (better have one) */
	        if (state.lens[256] === 0) {
	          strm.msg = 'invalid code -- missing end-of-block';
	          state.mode = BAD;
	          break;
	        }

	        /* build code tables -- note: do not change the lenbits or distbits
	           values here (9 and 6) without reading the comments in inftrees.h
	           concerning the ENOUGH constants, which depend on those values */
	        state.lenbits = 9;

	        opts = { bits: state.lenbits };
	        ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
	        // We have separate tables & no pointers. 2 commented lines below not needed.
	        // state.next_index = opts.table_index;
	        state.lenbits = opts.bits;
	        // state.lencode = state.next;

	        if (ret) {
	          strm.msg = 'invalid literal/lengths set';
	          state.mode = BAD;
	          break;
	        }

	        state.distbits = 6;
	        //state.distcode.copy(state.codes);
	        // Switch to use dynamic table
	        state.distcode = state.distdyn;
	        opts = { bits: state.distbits };
	        ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
	        // We have separate tables & no pointers. 2 commented lines below not needed.
	        // state.next_index = opts.table_index;
	        state.distbits = opts.bits;
	        // state.distcode = state.next;

	        if (ret) {
	          strm.msg = 'invalid distances set';
	          state.mode = BAD;
	          break;
	        }
	        //Tracev((stderr, 'inflate:       codes ok\n'));
	        state.mode = LEN_;
	        if (flush === Z_TREES) { break inf_leave; }
	        /* falls through */
	      case LEN_:
	        state.mode = LEN;
	        /* falls through */
	      case LEN:
	        if (have >= 6 && left >= 258) {
	          //--- RESTORE() ---
	          strm.next_out = put;
	          strm.avail_out = left;
	          strm.next_in = next;
	          strm.avail_in = have;
	          state.hold = hold;
	          state.bits = bits;
	          //---
	          inflate_fast(strm, _out);
	          //--- LOAD() ---
	          put = strm.next_out;
	          output = strm.output;
	          left = strm.avail_out;
	          next = strm.next_in;
	          input = strm.input;
	          have = strm.avail_in;
	          hold = state.hold;
	          bits = state.bits;
	          //---

	          if (state.mode === TYPE) {
	            state.back = -1;
	          }
	          break;
	        }
	        state.back = 0;
	        for (;;) {
	          here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
	          here_bits = here >>> 24;
	          here_op = (here >>> 16) & 0xff;
	          here_val = here & 0xffff;

	          if (here_bits <= bits) { break; }
	          //--- PULLBYTE() ---//
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	          //---//
	        }
	        if (here_op && (here_op & 0xf0) === 0) {
	          last_bits = here_bits;
	          last_op = here_op;
	          last_val = here_val;
	          for (;;) {
	            here = state.lencode[last_val +
	                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
	            here_bits = here >>> 24;
	            here_op = (here >>> 16) & 0xff;
	            here_val = here & 0xffff;

	            if ((last_bits + here_bits) <= bits) { break; }
	            //--- PULLBYTE() ---//
	            if (have === 0) { break inf_leave; }
	            have--;
	            hold += input[next++] << bits;
	            bits += 8;
	            //---//
	          }
	          //--- DROPBITS(last.bits) ---//
	          hold >>>= last_bits;
	          bits -= last_bits;
	          //---//
	          state.back += last_bits;
	        }
	        //--- DROPBITS(here.bits) ---//
	        hold >>>= here_bits;
	        bits -= here_bits;
	        //---//
	        state.back += here_bits;
	        state.length = here_val;
	        if (here_op === 0) {
	          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
	          //        "inflate:         literal '%c'\n" :
	          //        "inflate:         literal 0x%02x\n", here.val));
	          state.mode = LIT;
	          break;
	        }
	        if (here_op & 32) {
	          //Tracevv((stderr, "inflate:         end of block\n"));
	          state.back = -1;
	          state.mode = TYPE;
	          break;
	        }
	        if (here_op & 64) {
	          strm.msg = 'invalid literal/length code';
	          state.mode = BAD;
	          break;
	        }
	        state.extra = here_op & 15;
	        state.mode = LENEXT;
	        /* falls through */
	      case LENEXT:
	        if (state.extra) {
	          //=== NEEDBITS(state.extra);
	          n = state.extra;
	          while (bits < n) {
	            if (have === 0) { break inf_leave; }
	            have--;
	            hold += input[next++] << bits;
	            bits += 8;
	          }
	          //===//
	          state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
	          //--- DROPBITS(state.extra) ---//
	          hold >>>= state.extra;
	          bits -= state.extra;
	          //---//
	          state.back += state.extra;
	        }
	        //Tracevv((stderr, "inflate:         length %u\n", state.length));
	        state.was = state.length;
	        state.mode = DIST;
	        /* falls through */
	      case DIST:
	        for (;;) {
	          here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
	          here_bits = here >>> 24;
	          here_op = (here >>> 16) & 0xff;
	          here_val = here & 0xffff;

	          if ((here_bits) <= bits) { break; }
	          //--- PULLBYTE() ---//
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	          //---//
	        }
	        if ((here_op & 0xf0) === 0) {
	          last_bits = here_bits;
	          last_op = here_op;
	          last_val = here_val;
	          for (;;) {
	            here = state.distcode[last_val +
	                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
	            here_bits = here >>> 24;
	            here_op = (here >>> 16) & 0xff;
	            here_val = here & 0xffff;

	            if ((last_bits + here_bits) <= bits) { break; }
	            //--- PULLBYTE() ---//
	            if (have === 0) { break inf_leave; }
	            have--;
	            hold += input[next++] << bits;
	            bits += 8;
	            //---//
	          }
	          //--- DROPBITS(last.bits) ---//
	          hold >>>= last_bits;
	          bits -= last_bits;
	          //---//
	          state.back += last_bits;
	        }
	        //--- DROPBITS(here.bits) ---//
	        hold >>>= here_bits;
	        bits -= here_bits;
	        //---//
	        state.back += here_bits;
	        if (here_op & 64) {
	          strm.msg = 'invalid distance code';
	          state.mode = BAD;
	          break;
	        }
	        state.offset = here_val;
	        state.extra = (here_op) & 15;
	        state.mode = DISTEXT;
	        /* falls through */
	      case DISTEXT:
	        if (state.extra) {
	          //=== NEEDBITS(state.extra);
	          n = state.extra;
	          while (bits < n) {
	            if (have === 0) { break inf_leave; }
	            have--;
	            hold += input[next++] << bits;
	            bits += 8;
	          }
	          //===//
	          state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
	          //--- DROPBITS(state.extra) ---//
	          hold >>>= state.extra;
	          bits -= state.extra;
	          //---//
	          state.back += state.extra;
	        }
	//#ifdef INFLATE_STRICT
	        if (state.offset > state.dmax) {
	          strm.msg = 'invalid distance too far back';
	          state.mode = BAD;
	          break;
	        }
	//#endif
	        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
	        state.mode = MATCH;
	        /* falls through */
	      case MATCH:
	        if (left === 0) { break inf_leave; }
	        copy = _out - left;
	        if (state.offset > copy) {         /* copy from window */
	          copy = state.offset - copy;
	          if (copy > state.whave) {
	            if (state.sane) {
	              strm.msg = 'invalid distance too far back';
	              state.mode = BAD;
	              break;
	            }
	// (!) This block is disabled in zlib defaults,
	// don't enable it for binary compatibility
	//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
	//          Trace((stderr, "inflate.c too far\n"));
	//          copy -= state.whave;
	//          if (copy > state.length) { copy = state.length; }
	//          if (copy > left) { copy = left; }
	//          left -= copy;
	//          state.length -= copy;
	//          do {
	//            output[put++] = 0;
	//          } while (--copy);
	//          if (state.length === 0) { state.mode = LEN; }
	//          break;
	//#endif
	          }
	          if (copy > state.wnext) {
	            copy -= state.wnext;
	            from = state.wsize - copy;
	          }
	          else {
	            from = state.wnext - copy;
	          }
	          if (copy > state.length) { copy = state.length; }
	          from_source = state.window;
	        }
	        else {                              /* copy from output */
	          from_source = output;
	          from = put - state.offset;
	          copy = state.length;
	        }
	        if (copy > left) { copy = left; }
	        left -= copy;
	        state.length -= copy;
	        do {
	          output[put++] = from_source[from++];
	        } while (--copy);
	        if (state.length === 0) { state.mode = LEN; }
	        break;
	      case LIT:
	        if (left === 0) { break inf_leave; }
	        output[put++] = state.length;
	        left--;
	        state.mode = LEN;
	        break;
	      case CHECK:
	        if (state.wrap) {
	          //=== NEEDBITS(32);
	          while (bits < 32) {
	            if (have === 0) { break inf_leave; }
	            have--;
	            // Use '|' instead of '+' to make sure that result is signed
	            hold |= input[next++] << bits;
	            bits += 8;
	          }
	          //===//
	          _out -= left;
	          strm.total_out += _out;
	          state.total += _out;
	          if (_out) {
	            strm.adler = state.check =
	                /*UPDATE(state.check, put - _out, _out);*/
	                (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out));

	          }
	          _out = left;
	          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
	          if ((state.flags ? hold : zswap32(hold)) !== state.check) {
	            strm.msg = 'incorrect data check';
	            state.mode = BAD;
	            break;
	          }
	          //=== INITBITS();
	          hold = 0;
	          bits = 0;
	          //===//
	          //Tracev((stderr, "inflate:   check matches trailer\n"));
	        }
	        state.mode = LENGTH;
	        /* falls through */
	      case LENGTH:
	        if (state.wrap && state.flags) {
	          //=== NEEDBITS(32);
	          while (bits < 32) {
	            if (have === 0) { break inf_leave; }
	            have--;
	            hold += input[next++] << bits;
	            bits += 8;
	          }
	          //===//
	          if (hold !== (state.total & 0xffffffff)) {
	            strm.msg = 'incorrect length check';
	            state.mode = BAD;
	            break;
	          }
	          //=== INITBITS();
	          hold = 0;
	          bits = 0;
	          //===//
	          //Tracev((stderr, "inflate:   length matches trailer\n"));
	        }
	        state.mode = DONE;
	        /* falls through */
	      case DONE:
	        ret = Z_STREAM_END;
	        break inf_leave;
	      case BAD:
	        ret = Z_DATA_ERROR;
	        break inf_leave;
	      case MEM:
	        return Z_MEM_ERROR;
	      case SYNC:
	        /* falls through */
	      default:
	        return Z_STREAM_ERROR;
	    }
	  }

	  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

	  /*
	     Return from inflate(), updating the total counts and the check value.
	     If there was no progress during the inflate() call, return a buffer
	     error.  Call updatewindow() to create and/or update the window state.
	     Note: a memory error from inflate() is non-recoverable.
	   */

	  //--- RESTORE() ---
	  strm.next_out = put;
	  strm.avail_out = left;
	  strm.next_in = next;
	  strm.avail_in = have;
	  state.hold = hold;
	  state.bits = bits;
	  //---

	  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
	                      (state.mode < CHECK || flush !== Z_FINISH))) {
	    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
	  }
	  _in -= strm.avail_in;
	  _out -= strm.avail_out;
	  strm.total_in += _in;
	  strm.total_out += _out;
	  state.total += _out;
	  if (state.wrap && _out) {
	    strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
	      (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out));
	  }
	  strm.data_type = state.bits + (state.last ? 64 : 0) +
	                    (state.mode === TYPE ? 128 : 0) +
	                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
	  if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
	    ret = Z_BUF_ERROR;
	  }
	  return ret;
	}

	function inflateEnd(strm) {

	  if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
	    return Z_STREAM_ERROR;
	  }

	  var state = strm.state;
	  if (state.window) {
	    state.window = null;
	  }
	  strm.state = null;
	  return Z_OK;
	}

	function inflateGetHeader(strm, head) {
	  var state;

	  /* check state */
	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  state = strm.state;
	  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR; }

	  /* save header structure */
	  state.head = head;
	  head.done = false;
	  return Z_OK;
	}

	function inflateSetDictionary(strm, dictionary) {
	  var dictLength = dictionary.length;

	  var state;
	  var dictid;
	  var ret;

	  /* check state */
	  if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) { return Z_STREAM_ERROR; }
	  state = strm.state;

	  if (state.wrap !== 0 && state.mode !== DICT) {
	    return Z_STREAM_ERROR;
	  }

	  /* check for correct dictionary identifier */
	  if (state.mode === DICT) {
	    dictid = 1; /* adler32(0, null, 0)*/
	    /* dictid = adler32(dictid, dictionary, dictLength); */
	    dictid = adler32(dictid, dictionary, dictLength, 0);
	    if (dictid !== state.check) {
	      return Z_DATA_ERROR;
	    }
	  }
	  /* copy dictionary to window using updatewindow(), which will amend the
	   existing dictionary if appropriate */
	  ret = updatewindow(strm, dictionary, dictLength, dictLength);
	  if (ret) {
	    state.mode = MEM;
	    return Z_MEM_ERROR;
	  }
	  state.havedict = 1;
	  // Tracev((stderr, "inflate:   dictionary set\n"));
	  return Z_OK;
	}

	inflate.inflateReset = inflateReset;
	inflate.inflateReset2 = inflateReset2;
	inflate.inflateResetKeep = inflateResetKeep;
	inflate.inflateInit = inflateInit;
	inflate.inflateInit2 = inflateInit2;
	inflate.inflate = inflate$1;
	inflate.inflateEnd = inflateEnd;
	inflate.inflateGetHeader = inflateGetHeader;
	inflate.inflateSetDictionary = inflateSetDictionary;
	inflate.inflateInfo = 'pako inflate (from Nodeca project)';

	/* Not implemented
	exports.inflateCopy = inflateCopy;
	exports.inflateGetDictionary = inflateGetDictionary;
	exports.inflateMark = inflateMark;
	exports.inflatePrime = inflatePrime;
	exports.inflateSync = inflateSync;
	exports.inflateSyncPoint = inflateSyncPoint;
	exports.inflateUndermine = inflateUndermine;
	*/
	return inflate;
}

var constants;
var hasRequiredConstants;

function requireConstants () {
	if (hasRequiredConstants) return constants;
	hasRequiredConstants = 1;

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	constants = {

	  /* Allowed flush values; see deflate() and inflate() below for details */
	  Z_NO_FLUSH:         0,
	  Z_PARTIAL_FLUSH:    1,
	  Z_SYNC_FLUSH:       2,
	  Z_FULL_FLUSH:       3,
	  Z_FINISH:           4,
	  Z_BLOCK:            5,
	  Z_TREES:            6,

	  /* Return codes for the compression/decompression functions. Negative values
	  * are errors, positive values are used for special but normal events.
	  */
	  Z_OK:               0,
	  Z_STREAM_END:       1,
	  Z_NEED_DICT:        2,
	  Z_ERRNO:           -1,
	  Z_STREAM_ERROR:    -2,
	  Z_DATA_ERROR:      -3,
	  //Z_MEM_ERROR:     -4,
	  Z_BUF_ERROR:       -5,
	  //Z_VERSION_ERROR: -6,

	  /* compression levels */
	  Z_NO_COMPRESSION:         0,
	  Z_BEST_SPEED:             1,
	  Z_BEST_COMPRESSION:       9,
	  Z_DEFAULT_COMPRESSION:   -1,


	  Z_FILTERED:               1,
	  Z_HUFFMAN_ONLY:           2,
	  Z_RLE:                    3,
	  Z_FIXED:                  4,
	  Z_DEFAULT_STRATEGY:       0,

	  /* Possible values of the data_type field (though see inflate()) */
	  Z_BINARY:                 0,
	  Z_TEXT:                   1,
	  //Z_ASCII:                1, // = Z_TEXT (deprecated)
	  Z_UNKNOWN:                2,

	  /* The deflate compression method */
	  Z_DEFLATED:               8
	  //Z_NULL:                 null // Use -1 or null inline, depending on var type
	};
	return constants;
}

var gzheader;
var hasRequiredGzheader;

function requireGzheader () {
	if (hasRequiredGzheader) return gzheader;
	hasRequiredGzheader = 1;

	// (C) 1995-2013 Jean-loup Gailly and Mark Adler
	// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
	//
	// This software is provided 'as-is', without any express or implied
	// warranty. In no event will the authors be held liable for any damages
	// arising from the use of this software.
	//
	// Permission is granted to anyone to use this software for any purpose,
	// including commercial applications, and to alter it and redistribute it
	// freely, subject to the following restrictions:
	//
	// 1. The origin of this software must not be misrepresented; you must not
	//   claim that you wrote the original software. If you use this software
	//   in a product, an acknowledgment in the product documentation would be
	//   appreciated but is not required.
	// 2. Altered source versions must be plainly marked as such, and must not be
	//   misrepresented as being the original software.
	// 3. This notice may not be removed or altered from any source distribution.

	function GZheader() {
	  /* true if compressed data believed to be text */
	  this.text       = 0;
	  /* modification time */
	  this.time       = 0;
	  /* extra flags (not used when writing a gzip file) */
	  this.xflags     = 0;
	  /* operating system */
	  this.os         = 0;
	  /* pointer to extra field or Z_NULL if none */
	  this.extra      = null;
	  /* extra field length (valid if extra != Z_NULL) */
	  this.extra_len  = 0; // Actually, we don't need it in JS,
	                       // but leave for few code modifications

	  //
	  // Setup limits is not necessary because in js we should not preallocate memory
	  // for inflate use constant limit in 65536 bytes
	  //

	  /* space at extra (only when reading header) */
	  // this.extra_max  = 0;
	  /* pointer to zero-terminated file name or Z_NULL */
	  this.name       = '';
	  /* space at name (only when reading header) */
	  // this.name_max   = 0;
	  /* pointer to zero-terminated comment or Z_NULL */
	  this.comment    = '';
	  /* space at comment (only when reading header) */
	  // this.comm_max   = 0;
	  /* true if there was or will be a header crc */
	  this.hcrc       = 0;
	  /* true when done reading gzip header (not used when writing a gzip file) */
	  this.done       = false;
	}

	gzheader = GZheader;
	return gzheader;
}

var hasRequiredInflate;

function requireInflate () {
	if (hasRequiredInflate) return inflate$1;
	hasRequiredInflate = 1;


	var zlib_inflate = requireInflate$1();
	var utils        = requireCommon();
	var strings      = requireStrings();
	var c            = requireConstants();
	var msg          = requireMessages();
	var ZStream      = requireZstream();
	var GZheader     = requireGzheader();

	var toString = Object.prototype.toString;

	/**
	 * class Inflate
	 *
	 * Generic JS-style wrapper for zlib calls. If you don't need
	 * streaming behaviour - use more simple functions: [[inflate]]
	 * and [[inflateRaw]].
	 **/

	/* internal
	 * inflate.chunks -> Array
	 *
	 * Chunks of output data, if [[Inflate#onData]] not overridden.
	 **/

	/**
	 * Inflate.result -> Uint8Array|Array|String
	 *
	 * Uncompressed result, generated by default [[Inflate#onData]]
	 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
	 * (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
	 * push a chunk with explicit flush (call [[Inflate#push]] with
	 * `Z_SYNC_FLUSH` param).
	 **/

	/**
	 * Inflate.err -> Number
	 *
	 * Error code after inflate finished. 0 (Z_OK) on success.
	 * Should be checked if broken data possible.
	 **/

	/**
	 * Inflate.msg -> String
	 *
	 * Error message, if [[Inflate.err]] != 0
	 **/


	/**
	 * new Inflate(options)
	 * - options (Object): zlib inflate options.
	 *
	 * Creates new inflator instance with specified params. Throws exception
	 * on bad params. Supported options:
	 *
	 * - `windowBits`
	 * - `dictionary`
	 *
	 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	 * for more information on these.
	 *
	 * Additional options, for internal needs:
	 *
	 * - `chunkSize` - size of generated data chunks (16K by default)
	 * - `raw` (Boolean) - do raw inflate
	 * - `to` (String) - if equal to 'string', then result will be converted
	 *   from utf8 to utf16 (javascript) string. When string output requested,
	 *   chunk length can differ from `chunkSize`, depending on content.
	 *
	 * By default, when no options set, autodetect deflate/gzip data format via
	 * wrapper header.
	 *
	 * ##### Example:
	 *
	 * ```javascript
	 * var pako = require('pako')
	 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
	 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
	 *
	 * var inflate = new pako.Inflate({ level: 3});
	 *
	 * inflate.push(chunk1, false);
	 * inflate.push(chunk2, true);  // true -> last chunk
	 *
	 * if (inflate.err) { throw new Error(inflate.err); }
	 *
	 * console.log(inflate.result);
	 * ```
	 **/
	function Inflate(options) {
	  if (!(this instanceof Inflate)) return new Inflate(options);

	  this.options = utils.assign({
	    chunkSize: 16384,
	    windowBits: 0,
	    to: ''
	  }, options || {});

	  var opt = this.options;

	  // Force window size for `raw` data, if not set directly,
	  // because we have no header for autodetect.
	  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
	    opt.windowBits = -opt.windowBits;
	    if (opt.windowBits === 0) { opt.windowBits = -15; }
	  }

	  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
	  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
	      !(options && options.windowBits)) {
	    opt.windowBits += 32;
	  }

	  // Gzip header has no info about windows size, we can do autodetect only
	  // for deflate. So, if window size not set, force it to max when gzip possible
	  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
	    // bit 3 (16) -> gzipped data
	    // bit 4 (32) -> autodetect gzip/deflate
	    if ((opt.windowBits & 15) === 0) {
	      opt.windowBits |= 15;
	    }
	  }

	  this.err    = 0;      // error code, if happens (0 = Z_OK)
	  this.msg    = '';     // error message
	  this.ended  = false;  // used to avoid multiple onEnd() calls
	  this.chunks = [];     // chunks of compressed data

	  this.strm   = new ZStream();
	  this.strm.avail_out = 0;

	  var status  = zlib_inflate.inflateInit2(
	    this.strm,
	    opt.windowBits
	  );

	  if (status !== c.Z_OK) {
	    throw new Error(msg[status]);
	  }

	  this.header = new GZheader();

	  zlib_inflate.inflateGetHeader(this.strm, this.header);

	  // Setup dictionary
	  if (opt.dictionary) {
	    // Convert data if needed
	    if (typeof opt.dictionary === 'string') {
	      opt.dictionary = strings.string2buf(opt.dictionary);
	    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
	      opt.dictionary = new Uint8Array(opt.dictionary);
	    }
	    if (opt.raw) { //In raw mode we need to set the dictionary early
	      status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
	      if (status !== c.Z_OK) {
	        throw new Error(msg[status]);
	      }
	    }
	  }
	}

	/**
	 * Inflate#push(data[, mode]) -> Boolean
	 * - data (Uint8Array|Array|ArrayBuffer|String): input data
	 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
	 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
	 *
	 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
	 * new output chunks. Returns `true` on success. The last data block must have
	 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
	 * [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
	 * can use mode Z_SYNC_FLUSH, keeping the decompression context.
	 *
	 * On fail call [[Inflate#onEnd]] with error code and return false.
	 *
	 * We strongly recommend to use `Uint8Array` on input for best speed (output
	 * format is detected automatically). Also, don't skip last param and always
	 * use the same type in your code (boolean or number). That will improve JS speed.
	 *
	 * For regular `Array`-s make sure all elements are [0..255].
	 *
	 * ##### Example
	 *
	 * ```javascript
	 * push(chunk, false); // push one of data chunks
	 * ...
	 * push(chunk, true);  // push last chunk
	 * ```
	 **/
	Inflate.prototype.push = function (data, mode) {
	  var strm = this.strm;
	  var chunkSize = this.options.chunkSize;
	  var dictionary = this.options.dictionary;
	  var status, _mode;
	  var next_out_utf8, tail, utf8str;

	  // Flag to properly process Z_BUF_ERROR on testing inflate call
	  // when we check that all output data was flushed.
	  var allowBufError = false;

	  if (this.ended) { return false; }
	  _mode = (mode === ~~mode) ? mode : ((mode === true) ? c.Z_FINISH : c.Z_NO_FLUSH);

	  // Convert data if needed
	  if (typeof data === 'string') {
	    // Only binary strings can be decompressed on practice
	    strm.input = strings.binstring2buf(data);
	  } else if (toString.call(data) === '[object ArrayBuffer]') {
	    strm.input = new Uint8Array(data);
	  } else {
	    strm.input = data;
	  }

	  strm.next_in = 0;
	  strm.avail_in = strm.input.length;

	  do {
	    if (strm.avail_out === 0) {
	      strm.output = new utils.Buf8(chunkSize);
	      strm.next_out = 0;
	      strm.avail_out = chunkSize;
	    }

	    status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);    /* no bad return value */

	    if (status === c.Z_NEED_DICT && dictionary) {
	      status = zlib_inflate.inflateSetDictionary(this.strm, dictionary);
	    }

	    if (status === c.Z_BUF_ERROR && allowBufError === true) {
	      status = c.Z_OK;
	      allowBufError = false;
	    }

	    if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
	      this.onEnd(status);
	      this.ended = true;
	      return false;
	    }

	    if (strm.next_out) {
	      if (strm.avail_out === 0 || status === c.Z_STREAM_END || (strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH))) {

	        if (this.options.to === 'string') {

	          next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

	          tail = strm.next_out - next_out_utf8;
	          utf8str = strings.buf2string(strm.output, next_out_utf8);

	          // move tail
	          strm.next_out = tail;
	          strm.avail_out = chunkSize - tail;
	          if (tail) { utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0); }

	          this.onData(utf8str);

	        } else {
	          this.onData(utils.shrinkBuf(strm.output, strm.next_out));
	        }
	      }
	    }

	    // When no more input data, we should check that internal inflate buffers
	    // are flushed. The only way to do it when avail_out = 0 - run one more
	    // inflate pass. But if output data not exists, inflate return Z_BUF_ERROR.
	    // Here we set flag to process this error properly.
	    //
	    // NOTE. Deflate does not return error in this case and does not needs such
	    // logic.
	    if (strm.avail_in === 0 && strm.avail_out === 0) {
	      allowBufError = true;
	    }

	  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);

	  if (status === c.Z_STREAM_END) {
	    _mode = c.Z_FINISH;
	  }

	  // Finalize on the last chunk.
	  if (_mode === c.Z_FINISH) {
	    status = zlib_inflate.inflateEnd(this.strm);
	    this.onEnd(status);
	    this.ended = true;
	    return status === c.Z_OK;
	  }

	  // callback interim results if Z_SYNC_FLUSH.
	  if (_mode === c.Z_SYNC_FLUSH) {
	    this.onEnd(c.Z_OK);
	    strm.avail_out = 0;
	    return true;
	  }

	  return true;
	};


	/**
	 * Inflate#onData(chunk) -> Void
	 * - chunk (Uint8Array|Array|String): output data. Type of array depends
	 *   on js engine support. When string output requested, each chunk
	 *   will be string.
	 *
	 * By default, stores data blocks in `chunks[]` property and glue
	 * those in `onEnd`. Override this handler, if you need another behaviour.
	 **/
	Inflate.prototype.onData = function (chunk) {
	  this.chunks.push(chunk);
	};


	/**
	 * Inflate#onEnd(status) -> Void
	 * - status (Number): inflate status. 0 (Z_OK) on success,
	 *   other if not.
	 *
	 * Called either after you tell inflate that the input stream is
	 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
	 * or if an error happened. By default - join collected chunks,
	 * free memory and fill `results` / `err` properties.
	 **/
	Inflate.prototype.onEnd = function (status) {
	  // On success - join
	  if (status === c.Z_OK) {
	    if (this.options.to === 'string') {
	      // Glue & convert here, until we teach pako to send
	      // utf8 aligned strings to onData
	      this.result = this.chunks.join('');
	    } else {
	      this.result = utils.flattenChunks(this.chunks);
	    }
	  }
	  this.chunks = [];
	  this.err = status;
	  this.msg = this.strm.msg;
	};


	/**
	 * inflate(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to decompress.
	 * - options (Object): zlib inflate options.
	 *
	 * Decompress `data` with inflate/ungzip and `options`. Autodetect
	 * format via wrapper header by default. That's why we don't provide
	 * separate `ungzip` method.
	 *
	 * Supported options are:
	 *
	 * - windowBits
	 *
	 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	 * for more information.
	 *
	 * Sugar (options):
	 *
	 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
	 *   negative windowBits implicitly.
	 * - `to` (String) - if equal to 'string', then result will be converted
	 *   from utf8 to utf16 (javascript) string. When string output requested,
	 *   chunk length can differ from `chunkSize`, depending on content.
	 *
	 *
	 * ##### Example:
	 *
	 * ```javascript
	 * var pako = require('pako')
	 *   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
	 *   , output;
	 *
	 * try {
	 *   output = pako.inflate(input);
	 * } catch (err)
	 *   console.log(err);
	 * }
	 * ```
	 **/
	function inflate(input, options) {
	  var inflator = new Inflate(options);

	  inflator.push(input, true);

	  // That will never happens, if you don't cheat with options :)
	  if (inflator.err) { throw inflator.msg || msg[inflator.err]; }

	  return inflator.result;
	}


	/**
	 * inflateRaw(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to decompress.
	 * - options (Object): zlib inflate options.
	 *
	 * The same as [[inflate]], but creates raw data, without wrapper
	 * (header and adler32 crc).
	 **/
	function inflateRaw(input, options) {
	  options = options || {};
	  options.raw = true;
	  return inflate(input, options);
	}


	/**
	 * ungzip(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to decompress.
	 * - options (Object): zlib inflate options.
	 *
	 * Just shortcut to [[inflate]], because it autodetects format
	 * by header.content. Done for convenience.
	 **/


	inflate$1.Inflate = Inflate;
	inflate$1.inflate = inflate;
	inflate$1.inflateRaw = inflateRaw;
	inflate$1.ungzip  = inflate;
	return inflate$1;
}

var pako_1;
var hasRequiredPako;

function requirePako () {
	if (hasRequiredPako) return pako_1;
	hasRequiredPako = 1;

	var assign    = requireCommon().assign;

	var deflate   = requireDeflate();
	var inflate   = requireInflate();
	var constants = requireConstants();

	var pako = {};

	assign(pako, deflate, inflate, constants);

	pako_1 = pako;
	return pako_1;
}

var __viteBrowserExternal = {};

var __viteBrowserExternal$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	default: __viteBrowserExternal
});

var require$$4 = /*@__PURE__*/getAugmentedNamespace(__viteBrowserExternal$1);

var pify;
var hasRequiredPify;

function requirePify () {
	if (hasRequiredPify) return pify;
	hasRequiredPify = 1;

	const processFn = (fn, options) => function (...args) {
		const P = options.promiseModule;

		return new P((resolve, reject) => {
			if (options.multiArgs) {
				args.push((...result) => {
					if (options.errorFirst) {
						if (result[0]) {
							reject(result);
						} else {
							result.shift();
							resolve(result);
						}
					} else {
						resolve(result);
					}
				});
			} else if (options.errorFirst) {
				args.push((error, result) => {
					if (error) {
						reject(error);
					} else {
						resolve(result);
					}
				});
			} else {
				args.push(resolve);
			}

			fn.apply(this, args);
		});
	};

	pify = (input, options) => {
		options = Object.assign({
			exclude: [/.+(Sync|Stream)$/],
			errorFirst: true,
			promiseModule: Promise
		}, options);

		const objType = typeof input;
		if (!(input !== null && (objType === 'object' || objType === 'function'))) {
			throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${input === null ? 'null' : objType}\``);
		}

		const filter = key => {
			const match = pattern => typeof pattern === 'string' ? key === pattern : pattern.test(key);
			return options.include ? options.include.some(match) : !options.exclude.some(match);
		};

		let ret;
		if (objType === 'function') {
			ret = function (...args) {
				return options.excludeMain ? input(...args) : processFn(input, options).apply(this, args);
			};
		} else {
			ret = Object.create(Object.getPrototypeOf(input));
		}

		for (const key in input) { // eslint-disable-line guard-for-in
			const property = input[key];
			ret[key] = typeof property === 'function' && filter(key) ? processFn(property, options) : property;
		}

		return ret;
	};
	return pify;
}

var ignore;
var hasRequiredIgnore;

function requireIgnore () {
	if (hasRequiredIgnore) return ignore;
	hasRequiredIgnore = 1;
	var define_process_env_default = {};
	function makeArray(subject) {
	  return Array.isArray(subject) ? subject : [subject];
	}
	const EMPTY = "";
	const SPACE = " ";
	const ESCAPE = "\\";
	const REGEX_TEST_BLANK_LINE = /^\s+$/;
	const REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/;
	const REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
	const REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
	const REGEX_SPLITALL_CRLF = /\r?\n/g;
	const REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/;
	const SLASH = "/";
	let TMP_KEY_IGNORE = "node-ignore";
	if (typeof Symbol !== "undefined") {
	  TMP_KEY_IGNORE = /* @__PURE__ */ Symbol.for("node-ignore");
	}
	const KEY_IGNORE = TMP_KEY_IGNORE;
	const define = (object, key, value) => Object.defineProperty(object, key, { value });
	const REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g;
	const RETURN_FALSE = () => false;
	const sanitizeRange = (range) => range.replace(
	  REGEX_REGEXP_RANGE,
	  (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match : EMPTY
	);
	const cleanRangeBackSlash = (slashes) => {
	  const { length } = slashes;
	  return slashes.slice(0, length - length % 2);
	};
	const REPLACERS = [
	  [
	    // remove BOM
	    // TODO:
	    // Other similar zero-width characters?
	    /^\uFEFF/,
	    () => EMPTY
	  ],
	  // > Trailing spaces are ignored unless they are quoted with backslash ("\")
	  [
	    // (a\ ) -> (a )
	    // (a  ) -> (a)
	    // (a ) -> (a)
	    // (a \ ) -> (a  )
	    /((?:\\\\)*?)(\\?\s+)$/,
	    (_, m1, m2) => m1 + (m2.indexOf("\\") === 0 ? SPACE : EMPTY)
	  ],
	  // replace (\ ) with ' '
	  // (\ ) -> ' '
	  // (\\ ) -> '\\ '
	  // (\\\ ) -> '\\ '
	  [
	    /(\\+?)\s/g,
	    (_, m1) => {
	      const { length } = m1;
	      return m1.slice(0, length - length % 2) + SPACE;
	    }
	  ],
	  // Escape metacharacters
	  // which is written down by users but means special for regular expressions.
	  // > There are 12 characters with special meanings:
	  // > - the backslash \,
	  // > - the caret ^,
	  // > - the dollar sign $,
	  // > - the period or dot .,
	  // > - the vertical bar or pipe symbol |,
	  // > - the question mark ?,
	  // > - the asterisk or star *,
	  // > - the plus sign +,
	  // > - the opening parenthesis (,
	  // > - the closing parenthesis ),
	  // > - and the opening square bracket [,
	  // > - the opening curly brace {,
	  // > These special characters are often called "metacharacters".
	  [
	    /[\\$.|*+(){^]/g,
	    (match) => `\\${match}`
	  ],
	  [
	    // > a question mark (?) matches a single character
	    /(?!\\)\?/g,
	    () => "[^/]"
	  ],
	  // leading slash
	  [
	    // > A leading slash matches the beginning of the pathname.
	    // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
	    // A leading slash matches the beginning of the pathname
	    /^\//,
	    () => "^"
	  ],
	  // replace special metacharacter slash after the leading slash
	  [
	    /\//g,
	    () => "\\/"
	  ],
	  [
	    // > A leading "**" followed by a slash means match in all directories.
	    // > For example, "**/foo" matches file or directory "foo" anywhere,
	    // > the same as pattern "foo".
	    // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
	    // >   under directory "foo".
	    // Notice that the '*'s have been replaced as '\\*'
	    /^\^*\\\*\\\*\\\//,
	    // '**/foo' <-> 'foo'
	    () => "^(?:.*\\/)?"
	  ],
	  // starting
	  [
	    // there will be no leading '/'
	    //   (which has been replaced by section "leading slash")
	    // If starts with '**', adding a '^' to the regular expression also works
	    /^(?=[^^])/,
	    function startingReplacer() {
	      return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^";
	    }
	  ],
	  // two globstars
	  [
	    // Use lookahead assertions so that we could match more than one `'/**'`
	    /\\\/\\\*\\\*(?=\\\/|$)/g,
	    // Zero, one or several directories
	    // should not use '*', or it will be replaced by the next replacer
	    // Check if it is not the last `'/**'`
	    (_, index, str) => index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+"
	  ],
	  // normal intermediate wildcards
	  [
	    // Never replace escaped '*'
	    // ignore rule '\*' will match the path '*'
	    // 'abc.*/' -> go
	    // 'abc.*'  -> skip this rule,
	    //    coz trailing single wildcard will be handed by [trailing wildcard]
	    /(^|[^\\]+)(\\\*)+(?=.+)/g,
	    // '*.js' matches '.js'
	    // '*.js' doesn't match 'abc'
	    (_, p1, p2) => {
	      const unescaped = p2.replace(/\\\*/g, "[^\\/]*");
	      return p1 + unescaped;
	    }
	  ],
	  [
	    // unescape, revert step 3 except for back slash
	    // For example, if a user escape a '\\*',
	    // after step 3, the result will be '\\\\\\*'
	    /\\\\\\(?=[$.|*+(){^])/g,
	    () => ESCAPE
	  ],
	  [
	    // '\\\\' -> '\\'
	    /\\\\/g,
	    () => ESCAPE
	  ],
	  [
	    // > The range notation, e.g. [a-zA-Z],
	    // > can be used to match one of the characters in a range.
	    // `\` is escaped by step 3
	    /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
	    (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}` : close === "]" ? endEscape.length % 2 === 0 ? `[${sanitizeRange(range)}${endEscape}]` : "[]" : "[]"
	  ],
	  // ending
	  [
	    // 'js' will not match 'js.'
	    // 'ab' will not match 'abc'
	    /(?:[^*])$/,
	    // WTF!
	    // https://git-scm.com/docs/gitignore
	    // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
	    // which re-fixes #24, #38
	    // > If there is a separator at the end of the pattern then the pattern
	    // > will only match directories, otherwise the pattern can match both
	    // > files and directories.
	    // 'js*' will not match 'a.js'
	    // 'js/' will not match 'a.js'
	    // 'js' will match 'a.js' and 'a.js/'
	    (match) => /\/$/.test(match) ? `${match}$` : `${match}(?=$|\\/$)`
	  ],
	  // trailing wildcard
	  [
	    /(\^|\\\/)?\\\*$/,
	    (_, p1) => {
	      const prefix = p1 ? `${p1}[^/]+` : "[^/]*";
	      return `${prefix}(?=$|\\/$)`;
	    }
	  ]
	];
	const regexCache = /* @__PURE__ */ Object.create(null);
	const makeRegex = (pattern, ignoreCase) => {
	  let source = regexCache[pattern];
	  if (!source) {
	    source = REPLACERS.reduce(
	      (prev, [matcher, replacer]) => prev.replace(matcher, replacer.bind(pattern)),
	      pattern
	    );
	    regexCache[pattern] = source;
	  }
	  return ignoreCase ? new RegExp(source, "i") : new RegExp(source);
	};
	const isString = (subject) => typeof subject === "string";
	const checkPattern = (pattern) => pattern && isString(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern) && pattern.indexOf("#") !== 0;
	const splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF);
	class IgnoreRule {
	  constructor(origin, pattern, negative, regex) {
	    this.origin = origin;
	    this.pattern = pattern;
	    this.negative = negative;
	    this.regex = regex;
	  }
	}
	const createRule = (pattern, ignoreCase) => {
	  const origin = pattern;
	  let negative = false;
	  if (pattern.indexOf("!") === 0) {
	    negative = true;
	    pattern = pattern.substr(1);
	  }
	  pattern = pattern.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
	  const regex = makeRegex(pattern, ignoreCase);
	  return new IgnoreRule(
	    origin,
	    pattern,
	    negative,
	    regex
	  );
	};
	const throwError = (message, Ctor) => {
	  throw new Ctor(message);
	};
	const checkPath = (path, originalPath, doThrow) => {
	  if (!isString(path)) {
	    return doThrow(
	      `path must be a string, but got \`${originalPath}\``,
	      TypeError
	    );
	  }
	  if (!path) {
	    return doThrow(`path must not be empty`, TypeError);
	  }
	  if (checkPath.isNotRelative(path)) {
	    const r = "`path.relative()`d";
	    return doThrow(
	      `path should be a ${r} string, but got "${originalPath}"`,
	      RangeError
	    );
	  }
	  return true;
	};
	const isNotRelative = (path) => REGEX_TEST_INVALID_PATH.test(path);
	checkPath.isNotRelative = isNotRelative;
	checkPath.convert = (p) => p;
	class Ignore {
	  constructor({
	    ignorecase = true,
	    ignoreCase = ignorecase,
	    allowRelativePaths = false
	  } = {}) {
	    define(this, KEY_IGNORE, true);
	    this._rules = [];
	    this._ignoreCase = ignoreCase;
	    this._allowRelativePaths = allowRelativePaths;
	    this._initCache();
	  }
	  _initCache() {
	    this._ignoreCache = /* @__PURE__ */ Object.create(null);
	    this._testCache = /* @__PURE__ */ Object.create(null);
	  }
	  _addPattern(pattern) {
	    if (pattern && pattern[KEY_IGNORE]) {
	      this._rules = this._rules.concat(pattern._rules);
	      this._added = true;
	      return;
	    }
	    if (checkPattern(pattern)) {
	      const rule = createRule(pattern, this._ignoreCase);
	      this._added = true;
	      this._rules.push(rule);
	    }
	  }
	  // @param {Array<string> | string | Ignore} pattern
	  add(pattern) {
	    this._added = false;
	    makeArray(
	      isString(pattern) ? splitPattern(pattern) : pattern
	    ).forEach(this._addPattern, this);
	    if (this._added) {
	      this._initCache();
	    }
	    return this;
	  }
	  // legacy
	  addPattern(pattern) {
	    return this.add(pattern);
	  }
	  //          |           ignored : unignored
	  // negative |   0:0   |   0:1   |   1:0   |   1:1
	  // -------- | ------- | ------- | ------- | --------
	  //     0    |  TEST   |  TEST   |  SKIP   |    X
	  //     1    |  TESTIF |  SKIP   |  TEST   |    X
	  // - SKIP: always skip
	  // - TEST: always test
	  // - TESTIF: only test if checkUnignored
	  // - X: that never happen
	  // @param {boolean} whether should check if the path is unignored,
	  //   setting `checkUnignored` to `false` could reduce additional
	  //   path matching.
	  // @returns {TestResult} true if a file is ignored
	  _testOne(path, checkUnignored) {
	    let ignored = false;
	    let unignored = false;
	    this._rules.forEach((rule) => {
	      const { negative } = rule;
	      if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) {
	        return;
	      }
	      const matched = rule.regex.test(path);
	      if (matched) {
	        ignored = !negative;
	        unignored = negative;
	      }
	    });
	    return {
	      ignored,
	      unignored
	    };
	  }
	  // @returns {TestResult}
	  _test(originalPath, cache, checkUnignored, slices) {
	    const path = originalPath && checkPath.convert(originalPath);
	    checkPath(
	      path,
	      originalPath,
	      this._allowRelativePaths ? RETURN_FALSE : throwError
	    );
	    return this._t(path, cache, checkUnignored, slices);
	  }
	  _t(path, cache, checkUnignored, slices) {
	    if (path in cache) {
	      return cache[path];
	    }
	    if (!slices) {
	      slices = path.split(SLASH);
	    }
	    slices.pop();
	    if (!slices.length) {
	      return cache[path] = this._testOne(path, checkUnignored);
	    }
	    const parent = this._t(
	      slices.join(SLASH) + SLASH,
	      cache,
	      checkUnignored,
	      slices
	    );
	    return cache[path] = parent.ignored ? parent : this._testOne(path, checkUnignored);
	  }
	  ignores(path) {
	    return this._test(path, this._ignoreCache, false).ignored;
	  }
	  createFilter() {
	    return (path) => !this.ignores(path);
	  }
	  filter(paths) {
	    return makeArray(paths).filter(this.createFilter());
	  }
	  // @returns {TestResult}
	  test(path) {
	    return this._test(path, this._testCache, true);
	  }
	}
	const factory = (options) => new Ignore(options);
	const isPathValid = (path) => checkPath(path && checkPath.convert(path), path, RETURN_FALSE);
	factory.isPathValid = isPathValid;
	factory.default = factory;
	ignore = factory;
	if (
	  // Detect `process` so that it can run in browsers.
	  typeof process !== "undefined" && (define_process_env_default && define_process_env_default.IGNORE_TEST_WIN32 || process.platform === "win32")
	) {
	  const makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
	  checkPath.convert = makePosix;
	  const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
	  checkPath.isNotRelative = (path) => REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path) || isNotRelative(path);
	}
	return ignore;
}

var lib;
var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib;
	hasRequiredLib = 1;

	function escapeRegExp(string) {
	  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}

	function replaceAll(str, search, replacement) {
	  search = search instanceof RegExp ? search : new RegExp(escapeRegExp(search), 'g');

	  return str.replace(search, replacement);
	}

	var CleanGitRef = {
	  clean: function clean(value) {
	    if (typeof value !== 'string') {
	      throw new Error('Expected a string, received: ' + value);
	    }

	    value = replaceAll(value, './', '/');
	    value = replaceAll(value, '..', '.');
	    value = replaceAll(value, ' ', '-');
	    value = replaceAll(value, /^[~^:?*\\\-]/g, '');
	    value = replaceAll(value, /[~^:?*\\]/g, '-');
	    value = replaceAll(value, /[~^:?*\\\-]$/g, '');
	    value = replaceAll(value, '@{', '-');
	    value = replaceAll(value, /\.$/g, '');
	    value = replaceAll(value, /\/$/g, '');
	    value = replaceAll(value, /\.lock$/g, '');
	    return value;
	  }
	};

	lib = CleanGitRef;
	return lib;
}

/*
 * URL: https://github.com/cubicdaiya/onp
 *
 * Copyright (c) 2013 Tatsuhiko Kubo <cubicdaiya@gmail.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

var onp;
var hasRequiredOnp;

function requireOnp () {
	if (hasRequiredOnp) return onp;
	hasRequiredOnp = 1;
	/**
	 * The algorithm implemented here is based on "An O(NP) Sequence Comparison Algorithm"
	 * by described by Sun Wu, Udi Manber and Gene Myers
	*/
	onp = function (a_, b_) {
	    var a          = a_,
	        b          = b_,
	        m          = a.length,
	        n          = b.length,
	        reverse    = false,
	        ed         = null,
	        offset     = m + 1,
	        path       = [],
	        pathposi   = [],
	        ses        = [],
	        lcs        = "",
	        SES_DELETE = -1,
	        SES_COMMON = 0,
	        SES_ADD    = 1;

	    var tmp1,
	        tmp2;

	    var init = function () {
	        if (m >= n) {
	            tmp1    = a;
	            tmp2    = m;
	            a       = b;
	            b       = tmp1;
	            m       = n;
	            n       = tmp2;
	            reverse = true;
	            offset = m + 1;
	        }
	    };

	    var P = function (x, y, k) {
	        return {
	            'x' : x,
	            'y' : y,
	            'k' : k,
	        };
	    };

	    var seselem = function (elem, t) {
	        return {
	            'elem' : elem,
	            't'    : t,
	        };
	    };

	    var snake = function (k, p, pp) {
	        var r, x, y;
	        if (p > pp) {
	            r = path[k-1+offset];
	        } else {
	            r = path[k+1+offset];
	        }

	        y = Math.max(p, pp);
	        x = y - k;
	        while (x < m && y < n && a[x] === b[y]) {
	            ++x;
	            ++y;
	        }

	        path[k+offset] = pathposi.length;
	        pathposi[pathposi.length] = new P(x, y, r);
	        return y;
	    };

	    var recordseq = function (epc) {
	        var px_idx, py_idx, i;
	        px_idx = py_idx = 0;
	        for (i=epc.length-1;i>=0;--i) {
	            while(px_idx < epc[i].x || py_idx < epc[i].y) {
	                if (epc[i].y - epc[i].x > py_idx - px_idx) {
	                    if (reverse) {
	                        ses[ses.length] = new seselem(b[py_idx], SES_DELETE);
	                    } else {
	                        ses[ses.length] = new seselem(b[py_idx], SES_ADD);
	                    }
	                    ++py_idx;
	                } else if (epc[i].y - epc[i].x < py_idx - px_idx) {
	                    if (reverse) {
	                        ses[ses.length] = new seselem(a[px_idx], SES_ADD);
	                    } else {
	                        ses[ses.length] = new seselem(a[px_idx], SES_DELETE);
	                    }
	                    ++px_idx;
	                } else {
	                    ses[ses.length] = new seselem(a[px_idx], SES_COMMON);
	                    lcs += a[px_idx];
	                    ++px_idx;
	                    ++py_idx;
	                }
	            }
	        }
	    };

	    init();

	    return {
	        SES_DELETE : -1,
	        SES_COMMON :  0,
	        SES_ADD    :  1,
	        editdistance : function () {
	            return ed;
	        },
	        getlcs : function () {
	            return lcs;
	        },
	        getses : function () {
	            return ses;
	        },
	        compose : function () {
	            var delta, size, fp, p, r, epc, i, k;
	            delta  = n - m;
	            size   = m + n + 3;
	            fp     = {};
	            for (i=0;i<size;++i) {
	                fp[i] = -1;
	                path[i] = -1;
	            }
	            p = -1;
	            do {
	                ++p;
	                for (k=-p;k<=delta-1;++k) {
	                    fp[k+offset] = snake(k, fp[k-1+offset]+1, fp[k+1+offset]);
	                }
	                for (k=delta+p;k>=delta+1;--k) {
	                    fp[k+offset] = snake(k, fp[k-1+offset]+1, fp[k+1+offset]);
	                }
	                fp[delta+offset] = snake(delta, fp[delta-1+offset]+1, fp[delta+1+offset]);
	            } while (fp[delta+offset] !== n);

	            ed = delta + 2 * p;

	            r = path[delta+offset];

	            epc  = [];
	            while (r !== -1) {
	                epc[epc.length] = new P(pathposi[r].x, pathposi[r].y, null);
	                r = pathposi[r].k;
	            }
	            recordseq(epc);
	        }
	    };
	};
	return onp;
}

var diff3;
var hasRequiredDiff3;

function requireDiff3 () {
	if (hasRequiredDiff3) return diff3;
	hasRequiredDiff3 = 1;
	// Copyright (c) 2006, 2008 Tony Garnock-Jones <tonyg@lshift.net>
	// Copyright (c) 2006, 2008 LShift Ltd. <query@lshift.net>
	//
	// Permission is hereby granted, free of charge, to any person
	// obtaining a copy of this software and associated documentation files
	// (the "Software"), to deal in the Software without restriction,
	// including without limitation the rights to use, copy, modify, merge,
	// publish, distribute, sublicense, and/or sell copies of the Software,
	// and to permit persons to whom the Software is furnished to do so,
	// subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be
	// included in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
	// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	// SOFTWARE.

	var onp = requireOnp();

	function longestCommonSubsequence(file1, file2) {
	  var diff = new onp(file1, file2);
	  diff.compose();
	  var ses = diff.getses();

	  var root;
	  var prev;
	  var file1RevIdx = file1.length - 1,
	      file2RevIdx = file2.length - 1;
	  for (var i = ses.length - 1; i >= 0; --i) {
	      if (ses[i].t === diff.SES_COMMON) {
	        if (prev) {
	          prev.chain = {
	            file1index: file1RevIdx,
	            file2index: file2RevIdx,
	            chain: null
	          };
	          prev = prev.chain;
	        } else {
	          root = {
	            file1index: file1RevIdx,
	            file2index: file2RevIdx,
	            chain: null
	          };
	          prev = root;
	        }
	        file1RevIdx--;
	        file2RevIdx--;
	      } else if (ses[i].t === diff.SES_DELETE) {
	        file1RevIdx--;
	      } else if (ses[i].t === diff.SES_ADD) {
	        file2RevIdx--;
	      }
	  }

	  var tail = {
	    file1index: -1,
	    file2index: -1,
	    chain: null
	  };

	  if (!prev) {
	    return tail;
	  }

	  prev.chain = tail;

	  return root;
	}

	function diffIndices(file1, file2) {
	  // We apply the LCS to give a simple representation of the
	  // offsets and lengths of mismatched chunks in the input
	  // files. This is used by diff3_merge_indices below.

	  var result = [];
	  var tail1 = file1.length;
	  var tail2 = file2.length;

	  for (var candidate = longestCommonSubsequence(file1, file2); candidate !== null; candidate = candidate.chain) {
	    var mismatchLength1 = tail1 - candidate.file1index - 1;
	    var mismatchLength2 = tail2 - candidate.file2index - 1;
	    tail1 = candidate.file1index;
	    tail2 = candidate.file2index;

	    if (mismatchLength1 || mismatchLength2) {
	      result.push({
	        file1: [tail1 + 1, mismatchLength1],
	        file2: [tail2 + 1, mismatchLength2]
	      });
	    }
	  }

	  result.reverse();
	  return result;
	}

	function diff3MergeIndices(a, o, b) {
	  // Given three files, A, O, and B, where both A and B are
	  // independently derived from O, returns a fairly complicated
	  // internal representation of merge decisions it's taken. The
	  // interested reader may wish to consult
	  //
	  // Sanjeev Khanna, Keshav Kunal, and Benjamin C. Pierce. "A
	  // Formal Investigation of Diff3." In Arvind and Prasad,
	  // editors, Foundations of Software Technology and Theoretical
	  // Computer Science (FSTTCS), December 2007.
	  //
	  // (http://www.cis.upenn.edu/~bcpierce/papers/diff3-short.pdf)
	  var i;

	  var m1 = diffIndices(o, a);
	  var m2 = diffIndices(o, b);

	  var hunks = [];

	  function addHunk(h, side) {
	    hunks.push([h.file1[0], side, h.file1[1], h.file2[0], h.file2[1]]);
	  }
	  for (i = 0; i < m1.length; i++) {
	    addHunk(m1[i], 0);
	  }
	  for (i = 0; i < m2.length; i++) {
	    addHunk(m2[i], 2);
	  }
	  hunks.sort(function(x, y) {
	    return x[0] - y[0]
	  });

	  var result = [];
	  var commonOffset = 0;

	  function copyCommon(targetOffset) {
	    if (targetOffset > commonOffset) {
	      result.push([1, commonOffset, targetOffset - commonOffset]);
	      commonOffset = targetOffset;
	    }
	  }

	  for (var hunkIndex = 0; hunkIndex < hunks.length; hunkIndex++) {
	    var firstHunkIndex = hunkIndex;
	    var hunk = hunks[hunkIndex];
	    var regionLhs = hunk[0];
	    var regionRhs = regionLhs + hunk[2];
	    while (hunkIndex < hunks.length - 1) {
	      var maybeOverlapping = hunks[hunkIndex + 1];
	      var maybeLhs = maybeOverlapping[0];
	      if (maybeLhs > regionRhs) break;
	      regionRhs = Math.max(regionRhs, maybeLhs + maybeOverlapping[2]);
	      hunkIndex++;
	    }

	    copyCommon(regionLhs);
	    if (firstHunkIndex == hunkIndex) {
	      // The "overlap" was only one hunk long, meaning that
	      // there's no conflict here. Either a and o were the
	      // same, or b and o were the same.
	      if (hunk[4] > 0) {
	        result.push([hunk[1], hunk[3], hunk[4]]);
	      }
	    } else {
	      // A proper conflict. Determine the extents of the
	      // regions involved from a, o and b. Effectively merge
	      // all the hunks on the left into one giant hunk, and
	      // do the same for the right; then, correct for skew
	      // in the regions of o that each side changed, and
	      // report appropriate spans for the three sides.
	      var regions = {
	        0: [a.length, -1, o.length, -1],
	        2: [b.length, -1, o.length, -1]
	      };
	      for (i = firstHunkIndex; i <= hunkIndex; i++) {
	        hunk = hunks[i];
	        var side = hunk[1];
	        var r = regions[side];
	        var oLhs = hunk[0];
	        var oRhs = oLhs + hunk[2];
	        var abLhs = hunk[3];
	        var abRhs = abLhs + hunk[4];
	        r[0] = Math.min(abLhs, r[0]);
	        r[1] = Math.max(abRhs, r[1]);
	        r[2] = Math.min(oLhs, r[2]);
	        r[3] = Math.max(oRhs, r[3]);
	      }
	      var aLhs = regions[0][0] + (regionLhs - regions[0][2]);
	      var aRhs = regions[0][1] + (regionRhs - regions[0][3]);
	      var bLhs = regions[2][0] + (regionLhs - regions[2][2]);
	      var bRhs = regions[2][1] + (regionRhs - regions[2][3]);
	      result.push([-1,
	        aLhs, aRhs - aLhs,
	        regionLhs, regionRhs - regionLhs,
	        bLhs, bRhs - bLhs
	      ]);
	    }
	    commonOffset = regionRhs;
	  }

	  copyCommon(o.length);
	  return result;
	}

	function diff3Merge(a, o, b) {
	  // Applies the output of Diff.diff3_merge_indices to actually
	  // construct the merged file; the returned result alternates
	  // between "ok" and "conflict" blocks.

	  var result = [];
	  var files = [a, o, b];
	  var indices = diff3MergeIndices(a, o, b);

	  var okLines = [];

	  function flushOk() {
	    if (okLines.length) {
	      result.push({
	        ok: okLines
	      });
	    }
	    okLines = [];
	  }

	  function pushOk(xs) {
	    for (var j = 0; j < xs.length; j++) {
	      okLines.push(xs[j]);
	    }
	  }

	  function isTrueConflict(rec) {
	    if (rec[2] != rec[6]) return true;
	    var aoff = rec[1];
	    var boff = rec[5];
	    for (var j = 0; j < rec[2]; j++) {
	      if (a[j + aoff] != b[j + boff]) return true;
	    }
	    return false;
	  }

	  for (var i = 0; i < indices.length; i++) {
	    var x = indices[i];
	    var side = x[0];
	    if (side == -1) {
	      if (!isTrueConflict(x)) {
	        pushOk(files[0].slice(x[1], x[1] + x[2]));
	      } else {
	        flushOk();
	        result.push({
	          conflict: {
	            a: a.slice(x[1], x[1] + x[2]),
	            aIndex: x[1],
	            o: o.slice(x[3], x[3] + x[4]),
	            oIndex: x[3],
	            b: b.slice(x[5], x[5] + x[6]),
	            bIndex: x[5]
	          }
	        });
	      }
	    } else {
	      pushOk(files[side].slice(x[1], x[1] + x[2]));
	    }
	  }

	  flushOk();
	  return result;
	}

	diff3 = diff3Merge;
	return diff3;
}

var hasRequiredIsomorphicGit;

function requireIsomorphicGit () {
	if (hasRequiredIsomorphicGit) return isomorphicGit;
	hasRequiredIsomorphicGit = 1;
	Object.defineProperty(isomorphicGit, "__esModule", { value: true });
	function _interopDefault(ex) {
	  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
	}
	var AsyncLock = _interopDefault(requireAsyncLock());
	var Hash = _interopDefault(requireSha1());
	var crc32 = _interopDefault(requireCrc32$1());
	var pako = _interopDefault(requirePako());
	var crypto$1 = require$$4;
	var pify = _interopDefault(requirePify());
	var ignore = _interopDefault(requireIgnore());
	var cleanGitRef = _interopDefault(requireLib());
	var diff3Merge = _interopDefault(requireDiff3());
	class BaseError extends Error {
	  constructor(message) {
	    super(message);
	    this.caller = "";
	  }
	  toJSON() {
	    return {
	      code: this.code,
	      data: this.data,
	      caller: this.caller,
	      message: this.message,
	      stack: this.stack
	    };
	  }
	  fromJSON(json) {
	    const e = new BaseError(json.message);
	    e.code = json.code;
	    e.data = json.data;
	    e.caller = json.caller;
	    e.stack = json.stack;
	    return e;
	  }
	  get isIsomorphicGitError() {
	    return true;
	  }
	}
	class UnmergedPathsError extends BaseError {
	  /**
	   * @param {Array<string>} filepaths
	   */
	  constructor(filepaths) {
	    super(
	      `Modifying the index is not possible because you have unmerged files: ${filepaths.toString}. Fix them up in the work tree, and then use 'git add/rm as appropriate to mark resolution and make a commit.`
	    );
	    this.code = this.name = UnmergedPathsError.code;
	    this.data = { filepaths };
	  }
	}
	UnmergedPathsError.code = "UnmergedPathsError";
	class InternalError extends BaseError {
	  /**
	   * @param {string} message
	   */
	  constructor(message) {
	    super(
	      `An internal error caused this command to fail.

If you're not a developer, report the bug to the developers of the application you're using. If this is a bug in isomorphic-git then you should create a proper bug yourselves. The bug should include a minimal reproduction and details about the version and environment.

Please file a bug report at https://github.com/isomorphic-git/isomorphic-git/issues with this error message: ${message}`
	    );
	    this.code = this.name = InternalError.code;
	    this.data = { message };
	  }
	}
	InternalError.code = "InternalError";
	class UnsafeFilepathError extends BaseError {
	  /**
	   * @param {string} filepath
	   */
	  constructor(filepath) {
	    super(`The filepath "${filepath}" contains unsafe character sequences`);
	    this.code = this.name = UnsafeFilepathError.code;
	    this.data = { filepath };
	  }
	}
	UnsafeFilepathError.code = "UnsafeFilepathError";
	class BufferCursor {
	  constructor(buffer) {
	    this.buffer = buffer;
	    this._start = 0;
	  }
	  eof() {
	    return this._start >= this.buffer.length;
	  }
	  tell() {
	    return this._start;
	  }
	  seek(n) {
	    this._start = n;
	  }
	  slice(n) {
	    const r = this.buffer.slice(this._start, this._start + n);
	    this._start += n;
	    return r;
	  }
	  toString(enc, length) {
	    const r = this.buffer.toString(enc, this._start, this._start + length);
	    this._start += length;
	    return r;
	  }
	  write(value, length, enc) {
	    const r = this.buffer.write(value, this._start, length, enc);
	    this._start += length;
	    return r;
	  }
	  copy(source, start, end) {
	    const r = source.copy(this.buffer, this._start, start, end);
	    this._start += r;
	    return r;
	  }
	  readUInt8() {
	    const r = this.buffer.readUInt8(this._start);
	    this._start += 1;
	    return r;
	  }
	  writeUInt8(value) {
	    const r = this.buffer.writeUInt8(value, this._start);
	    this._start += 1;
	    return r;
	  }
	  readUInt16BE() {
	    const r = this.buffer.readUInt16BE(this._start);
	    this._start += 2;
	    return r;
	  }
	  writeUInt16BE(value) {
	    const r = this.buffer.writeUInt16BE(value, this._start);
	    this._start += 2;
	    return r;
	  }
	  readUInt32BE() {
	    const r = this.buffer.readUInt32BE(this._start);
	    this._start += 4;
	    return r;
	  }
	  writeUInt32BE(value) {
	    const r = this.buffer.writeUInt32BE(value, this._start);
	    this._start += 4;
	    return r;
	  }
	}
	function compareStrings(a, b) {
	  return -(a < b) || +(a > b);
	}
	function comparePath(a, b) {
	  return compareStrings(a.path, b.path);
	}
	function normalizeMode(mode) {
	  let type = mode > 0 ? mode >> 12 : 0;
	  if (type !== 4 && type !== 8 && type !== 10 && type !== 14) {
	    type = 8;
	  }
	  let permissions = mode & 511;
	  if (permissions & 73) {
	    permissions = 493;
	  } else {
	    permissions = 420;
	  }
	  if (type !== 8) permissions = 0;
	  return (type << 12) + permissions;
	}
	const MAX_UINT32 = 2 ** 32;
	function SecondsNanoseconds(givenSeconds, givenNanoseconds, milliseconds, date) {
	  if (givenSeconds !== void 0 && givenNanoseconds !== void 0) {
	    return [givenSeconds, givenNanoseconds];
	  }
	  if (milliseconds === void 0) {
	    milliseconds = date.valueOf();
	  }
	  const seconds = Math.floor(milliseconds / 1e3);
	  const nanoseconds = (milliseconds - seconds * 1e3) * 1e6;
	  return [seconds, nanoseconds];
	}
	function normalizeStats(e) {
	  const [ctimeSeconds, ctimeNanoseconds] = SecondsNanoseconds(
	    e.ctimeSeconds,
	    e.ctimeNanoseconds,
	    e.ctimeMs,
	    e.ctime
	  );
	  const [mtimeSeconds, mtimeNanoseconds] = SecondsNanoseconds(
	    e.mtimeSeconds,
	    e.mtimeNanoseconds,
	    e.mtimeMs,
	    e.mtime
	  );
	  return {
	    ctimeSeconds: ctimeSeconds % MAX_UINT32,
	    ctimeNanoseconds: ctimeNanoseconds % MAX_UINT32,
	    mtimeSeconds: mtimeSeconds % MAX_UINT32,
	    mtimeNanoseconds: mtimeNanoseconds % MAX_UINT32,
	    dev: e.dev % MAX_UINT32,
	    ino: e.ino % MAX_UINT32,
	    mode: normalizeMode(e.mode % MAX_UINT32),
	    uid: e.uid % MAX_UINT32,
	    gid: e.gid % MAX_UINT32,
	    // size of -1 happens over a BrowserFS HTTP Backend that doesn't serve Content-Length headers
	    // (like the Karma webserver) because BrowserFS HTTP Backend uses HTTP HEAD requests to do fs.stat
	    size: e.size > -1 ? e.size % MAX_UINT32 : 0
	  };
	}
	function toHex(buffer) {
	  let hex = "";
	  for (const byte of new Uint8Array(buffer)) {
	    if (byte < 16) hex += "0";
	    hex += byte.toString(16);
	  }
	  return hex;
	}
	let supportsSubtleSHA1 = null;
	async function shasum(buffer) {
	  if (supportsSubtleSHA1 === null) {
	    supportsSubtleSHA1 = await testSubtleSHA1();
	  }
	  return supportsSubtleSHA1 ? subtleSHA1(buffer) : shasumSync(buffer);
	}
	function shasumSync(buffer) {
	  return new Hash().update(buffer).digest("hex");
	}
	async function subtleSHA1(buffer) {
	  const hash = await crypto.subtle.digest("SHA-1", buffer);
	  return toHex(hash);
	}
	async function testSubtleSHA1() {
	  try {
	    const hash = await subtleSHA1(new Uint8Array([]));
	    return hash === "da39a3ee5e6b4b0d3255bfef95601890afd80709";
	  } catch (_) {
	  }
	  return false;
	}
	function parseCacheEntryFlags(bits) {
	  return {
	    assumeValid: Boolean(bits & 32768),
	    extended: Boolean(bits & 16384),
	    stage: (bits & 12288) >> 12,
	    nameLength: bits & 4095
	  };
	}
	function renderCacheEntryFlags(entry) {
	  const flags = entry.flags;
	  flags.extended = false;
	  flags.nameLength = Math.min(Buffer.from(entry.path).length, 4095);
	  return (flags.assumeValid ? 32768 : 0) + (flags.extended ? 16384 : 0) + ((flags.stage & 3) << 12) + (flags.nameLength & 4095);
	}
	class GitIndex {
	  /*::
	   _entries: Map<string, CacheEntry>
	   _dirty: boolean // Used to determine if index needs to be saved to filesystem
	   */
	  constructor(entries, unmergedPaths) {
	    this._dirty = false;
	    this._unmergedPaths = unmergedPaths || /* @__PURE__ */ new Set();
	    this._entries = entries || /* @__PURE__ */ new Map();
	  }
	  _addEntry(entry) {
	    if (entry.flags.stage === 0) {
	      entry.stages = [entry];
	      this._entries.set(entry.path, entry);
	      this._unmergedPaths.delete(entry.path);
	    } else {
	      let existingEntry = this._entries.get(entry.path);
	      if (!existingEntry) {
	        this._entries.set(entry.path, entry);
	        existingEntry = entry;
	      }
	      existingEntry.stages[entry.flags.stage] = entry;
	      this._unmergedPaths.add(entry.path);
	    }
	  }
	  static async from(buffer) {
	    if (Buffer.isBuffer(buffer)) {
	      return GitIndex.fromBuffer(buffer);
	    } else if (buffer === null) {
	      return new GitIndex(null);
	    } else {
	      throw new InternalError("invalid type passed to GitIndex.from");
	    }
	  }
	  static async fromBuffer(buffer) {
	    if (buffer.length === 0) {
	      throw new InternalError("Index file is empty (.git/index)");
	    }
	    const index2 = new GitIndex();
	    const reader = new BufferCursor(buffer);
	    const magic = reader.toString("utf8", 4);
	    if (magic !== "DIRC") {
	      throw new InternalError(`Invalid dircache magic file number: ${magic}`);
	    }
	    const shaComputed = await shasum(buffer.slice(0, -20));
	    const shaClaimed = buffer.slice(-20).toString("hex");
	    if (shaClaimed !== shaComputed) {
	      throw new InternalError(
	        `Invalid checksum in GitIndex buffer: expected ${shaClaimed} but saw ${shaComputed}`
	      );
	    }
	    const version2 = reader.readUInt32BE();
	    if (version2 !== 2) {
	      throw new InternalError(`Unsupported dircache version: ${version2}`);
	    }
	    const numEntries = reader.readUInt32BE();
	    let i = 0;
	    while (!reader.eof() && i < numEntries) {
	      const entry = {};
	      entry.ctimeSeconds = reader.readUInt32BE();
	      entry.ctimeNanoseconds = reader.readUInt32BE();
	      entry.mtimeSeconds = reader.readUInt32BE();
	      entry.mtimeNanoseconds = reader.readUInt32BE();
	      entry.dev = reader.readUInt32BE();
	      entry.ino = reader.readUInt32BE();
	      entry.mode = reader.readUInt32BE();
	      entry.uid = reader.readUInt32BE();
	      entry.gid = reader.readUInt32BE();
	      entry.size = reader.readUInt32BE();
	      entry.oid = reader.slice(20).toString("hex");
	      const flags = reader.readUInt16BE();
	      entry.flags = parseCacheEntryFlags(flags);
	      const pathlength = buffer.indexOf(0, reader.tell() + 1) - reader.tell();
	      if (pathlength < 1) {
	        throw new InternalError(`Got a path length of: ${pathlength}`);
	      }
	      entry.path = reader.toString("utf8", pathlength);
	      if (entry.path.includes("..\\") || entry.path.includes("../")) {
	        throw new UnsafeFilepathError(entry.path);
	      }
	      let padding = 8 - (reader.tell() - 12) % 8;
	      if (padding === 0) padding = 8;
	      while (padding--) {
	        const tmp = reader.readUInt8();
	        if (tmp !== 0) {
	          throw new InternalError(
	            `Expected 1-8 null characters but got '${tmp}' after ${entry.path}`
	          );
	        } else if (reader.eof()) {
	          throw new InternalError("Unexpected end of file");
	        }
	      }
	      entry.stages = [];
	      index2._addEntry(entry);
	      i++;
	    }
	    return index2;
	  }
	  get unmergedPaths() {
	    return [...this._unmergedPaths];
	  }
	  get entries() {
	    return [...this._entries.values()].sort(comparePath);
	  }
	  get entriesMap() {
	    return this._entries;
	  }
	  get entriesFlat() {
	    return [...this.entries].flatMap((entry) => {
	      return entry.stages.length > 1 ? entry.stages.filter((x) => x) : entry;
	    });
	  }
	  *[Symbol.iterator]() {
	    for (const entry of this.entries) {
	      yield entry;
	    }
	  }
	  insert({ filepath, stats, oid, stage = 0 }) {
	    if (!stats) {
	      stats = {
	        ctimeSeconds: 0,
	        ctimeNanoseconds: 0,
	        mtimeSeconds: 0,
	        mtimeNanoseconds: 0,
	        dev: 0,
	        ino: 0,
	        mode: 0,
	        uid: 0,
	        gid: 0,
	        size: 0
	      };
	    }
	    stats = normalizeStats(stats);
	    const bfilepath = Buffer.from(filepath);
	    const entry = {
	      ctimeSeconds: stats.ctimeSeconds,
	      ctimeNanoseconds: stats.ctimeNanoseconds,
	      mtimeSeconds: stats.mtimeSeconds,
	      mtimeNanoseconds: stats.mtimeNanoseconds,
	      dev: stats.dev,
	      ino: stats.ino,
	      // We provide a fallback value for `mode` here because not all fs
	      // implementations assign it, but we use it in GitTree.
	      // '100644' is for a "regular non-executable file"
	      mode: stats.mode || 33188,
	      uid: stats.uid,
	      gid: stats.gid,
	      size: stats.size,
	      path: filepath,
	      oid,
	      flags: {
	        assumeValid: false,
	        extended: false,
	        stage,
	        nameLength: bfilepath.length < 4095 ? bfilepath.length : 4095
	      },
	      stages: []
	    };
	    this._addEntry(entry);
	    this._dirty = true;
	  }
	  delete({ filepath }) {
	    if (this._entries.has(filepath)) {
	      this._entries.delete(filepath);
	    } else {
	      for (const key of this._entries.keys()) {
	        if (key.startsWith(filepath + "/")) {
	          this._entries.delete(key);
	        }
	      }
	    }
	    if (this._unmergedPaths.has(filepath)) {
	      this._unmergedPaths.delete(filepath);
	    }
	    this._dirty = true;
	  }
	  clear() {
	    this._entries.clear();
	    this._dirty = true;
	  }
	  has({ filepath }) {
	    return this._entries.has(filepath);
	  }
	  render() {
	    return this.entries.map((entry) => `${entry.mode.toString(8)} ${entry.oid}    ${entry.path}`).join("\n");
	  }
	  static async _entryToBuffer(entry) {
	    const bpath = Buffer.from(entry.path);
	    const length = Math.ceil((62 + bpath.length + 1) / 8) * 8;
	    const written = Buffer.alloc(length);
	    const writer = new BufferCursor(written);
	    const stat = normalizeStats(entry);
	    writer.writeUInt32BE(stat.ctimeSeconds);
	    writer.writeUInt32BE(stat.ctimeNanoseconds);
	    writer.writeUInt32BE(stat.mtimeSeconds);
	    writer.writeUInt32BE(stat.mtimeNanoseconds);
	    writer.writeUInt32BE(stat.dev);
	    writer.writeUInt32BE(stat.ino);
	    writer.writeUInt32BE(stat.mode);
	    writer.writeUInt32BE(stat.uid);
	    writer.writeUInt32BE(stat.gid);
	    writer.writeUInt32BE(stat.size);
	    writer.write(entry.oid, 20, "hex");
	    writer.writeUInt16BE(renderCacheEntryFlags(entry));
	    writer.write(entry.path, bpath.length, "utf8");
	    return written;
	  }
	  async toObject() {
	    const header = Buffer.alloc(12);
	    const writer = new BufferCursor(header);
	    writer.write("DIRC", 4, "utf8");
	    writer.writeUInt32BE(2);
	    writer.writeUInt32BE(this.entriesFlat.length);
	    let entryBuffers = [];
	    for (const entry of this.entries) {
	      entryBuffers.push(GitIndex._entryToBuffer(entry));
	      if (entry.stages.length > 1) {
	        for (const stage of entry.stages) {
	          if (stage && stage !== entry) {
	            entryBuffers.push(GitIndex._entryToBuffer(stage));
	          }
	        }
	      }
	    }
	    entryBuffers = await Promise.all(entryBuffers);
	    const body = Buffer.concat(entryBuffers);
	    const main = Buffer.concat([header, body]);
	    const sum = await shasum(main);
	    return Buffer.concat([main, Buffer.from(sum, "hex")]);
	  }
	}
	function compareStats(entry, stats, filemode = true, trustino = true) {
	  const e = normalizeStats(entry);
	  const s = normalizeStats(stats);
	  const staleness = filemode && e.mode !== s.mode || e.mtimeSeconds !== s.mtimeSeconds || e.ctimeSeconds !== s.ctimeSeconds || e.uid !== s.uid || e.gid !== s.gid || trustino && e.ino !== s.ino || e.size !== s.size;
	  return staleness;
	}
	let lock = null;
	const IndexCache = /* @__PURE__ */ Symbol("IndexCache");
	function createCache() {
	  return {
	    map: /* @__PURE__ */ new Map(),
	    stats: /* @__PURE__ */ new Map()
	  };
	}
	async function updateCachedIndexFile(fs, filepath, cache) {
	  const [stat, rawIndexFile] = await Promise.all([
	    fs.lstat(filepath),
	    fs.read(filepath)
	  ]);
	  const index2 = await GitIndex.from(rawIndexFile);
	  cache.map.set(filepath, index2);
	  cache.stats.set(filepath, stat);
	}
	async function isIndexStale(fs, filepath, cache) {
	  const savedStats = cache.stats.get(filepath);
	  if (savedStats === void 0) return true;
	  if (savedStats === null) return false;
	  const currStats = await fs.lstat(filepath);
	  if (currStats === null) return false;
	  return compareStats(savedStats, currStats);
	}
	class GitIndexManager {
	  /**
	   * Manages access to the Git index file, ensuring thread-safe operations and caching.
	   *
	   * @param {object} opts - Options for acquiring the Git index.
	   * @param {FSClient} opts.fs - A file system implementation.
	   * @param {string} opts.gitdir - The path to the `.git` directory.
	   * @param {object} opts.cache - A shared cache object for storing index data.
	   * @param {boolean} [opts.allowUnmerged=true] - Whether to allow unmerged paths in the index.
	   * @param {function(GitIndex): any} closure - A function to execute with the Git index.
	   * @returns {Promise<any>} The result of the closure function.
	   * @throws {UnmergedPathsError} If unmerged paths exist and `allowUnmerged` is `false`.
	   */
	  static async acquire({ fs, gitdir, cache, allowUnmerged = true }, closure) {
	    if (!cache[IndexCache]) {
	      cache[IndexCache] = createCache();
	    }
	    const filepath = `${gitdir}/index`;
	    if (lock === null) lock = new AsyncLock({ maxPending: Infinity });
	    let result;
	    let unmergedPaths = [];
	    await lock.acquire(filepath, async () => {
	      const theIndexCache = cache[IndexCache];
	      if (await isIndexStale(fs, filepath, theIndexCache)) {
	        await updateCachedIndexFile(fs, filepath, theIndexCache);
	      }
	      const index2 = theIndexCache.map.get(filepath);
	      unmergedPaths = index2.unmergedPaths;
	      if (unmergedPaths.length && !allowUnmerged)
	        throw new UnmergedPathsError(unmergedPaths);
	      result = await closure(index2);
	      if (index2._dirty) {
	        const buffer = await index2.toObject();
	        await fs.write(filepath, buffer);
	        theIndexCache.stats.set(filepath, await fs.lstat(filepath));
	        index2._dirty = false;
	      }
	    });
	    return result;
	  }
	}
	function basename(path) {
	  const last = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
	  if (last > -1) {
	    path = path.slice(last + 1);
	  }
	  return path;
	}
	function dirname(path) {
	  const last = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
	  if (last === -1) return ".";
	  if (last === 0) return "/";
	  return path.slice(0, last);
	}
	function flatFileListToDirectoryStructure(files) {
	  const inodes = /* @__PURE__ */ new Map();
	  const mkdir = function(name) {
	    if (!inodes.has(name)) {
	      const dir = {
	        type: "tree",
	        fullpath: name,
	        basename: basename(name),
	        metadata: {},
	        children: []
	      };
	      inodes.set(name, dir);
	      dir.parent = mkdir(dirname(name));
	      if (dir.parent && dir.parent !== dir) dir.parent.children.push(dir);
	    }
	    return inodes.get(name);
	  };
	  const mkfile = function(name, metadata) {
	    if (!inodes.has(name)) {
	      const file = {
	        type: "blob",
	        fullpath: name,
	        basename: basename(name),
	        metadata,
	        // This recursively generates any missing parent folders.
	        parent: mkdir(dirname(name)),
	        children: []
	      };
	      if (file.parent) file.parent.children.push(file);
	      inodes.set(name, file);
	    }
	    return inodes.get(name);
	  };
	  mkdir(".");
	  for (const file of files) {
	    mkfile(file.path, file);
	  }
	  return inodes;
	}
	function mode2type(mode) {
	  switch (mode) {
	    case 16384:
	      return "tree";
	    case 33188:
	      return "blob";
	    case 33261:
	      return "blob";
	    case 40960:
	      return "blob";
	    case 57344:
	      return "commit";
	  }
	  throw new InternalError(`Unexpected GitTree entry mode: ${mode.toString(8)}`);
	}
	class GitWalkerIndex {
	  constructor({ fs, gitdir, cache }) {
	    this.treePromise = GitIndexManager.acquire(
	      { fs, gitdir, cache },
	      async function(index2) {
	        return flatFileListToDirectoryStructure(index2.entries);
	      }
	    );
	    const walker = this;
	    this.ConstructEntry = class StageEntry {
	      constructor(fullpath) {
	        this._fullpath = fullpath;
	        this._type = false;
	        this._mode = false;
	        this._stat = false;
	        this._oid = false;
	      }
	      async type() {
	        return walker.type(this);
	      }
	      async mode() {
	        return walker.mode(this);
	      }
	      async stat() {
	        return walker.stat(this);
	      }
	      async content() {
	        return walker.content(this);
	      }
	      async oid() {
	        return walker.oid(this);
	      }
	    };
	  }
	  async readdir(entry) {
	    const filepath = entry._fullpath;
	    const tree = await this.treePromise;
	    const inode = tree.get(filepath);
	    if (!inode) return null;
	    if (inode.type === "blob") return null;
	    if (inode.type !== "tree") {
	      throw new Error(`ENOTDIR: not a directory, scandir '${filepath}'`);
	    }
	    const names = inode.children.map((inode2) => inode2.fullpath);
	    names.sort(compareStrings);
	    return names;
	  }
	  async type(entry) {
	    if (entry._type === false) {
	      await entry.stat();
	    }
	    return entry._type;
	  }
	  async mode(entry) {
	    if (entry._mode === false) {
	      await entry.stat();
	    }
	    return entry._mode;
	  }
	  async stat(entry) {
	    if (entry._stat === false) {
	      const tree = await this.treePromise;
	      const inode = tree.get(entry._fullpath);
	      if (!inode) {
	        throw new Error(
	          `ENOENT: no such file or directory, lstat '${entry._fullpath}'`
	        );
	      }
	      const stats = inode.type === "tree" ? {} : normalizeStats(inode.metadata);
	      entry._type = inode.type === "tree" ? "tree" : mode2type(stats.mode);
	      entry._mode = stats.mode;
	      if (inode.type === "tree") {
	        entry._stat = void 0;
	      } else {
	        entry._stat = stats;
	      }
	    }
	    return entry._stat;
	  }
	  async content(_entry) {
	  }
	  async oid(entry) {
	    if (entry._oid === false) {
	      const tree = await this.treePromise;
	      const inode = tree.get(entry._fullpath);
	      entry._oid = inode.metadata.oid;
	    }
	    return entry._oid;
	  }
	}
	const GitWalkSymbol = /* @__PURE__ */ Symbol("GitWalkSymbol");
	function STAGE() {
	  const o = /* @__PURE__ */ Object.create(null);
	  Object.defineProperty(o, GitWalkSymbol, {
	    value: function({ fs, gitdir, cache }) {
	      return new GitWalkerIndex({ fs, gitdir, cache });
	    }
	  });
	  Object.freeze(o);
	  return o;
	}
	class NotFoundError extends BaseError {
	  /**
	   * @param {string} what
	   */
	  constructor(what) {
	    super(`Could not find ${what}.`);
	    this.code = this.name = NotFoundError.code;
	    this.data = { what };
	  }
	}
	NotFoundError.code = "NotFoundError";
	class ObjectTypeError extends BaseError {
	  /**
	   * @param {string} oid
	   * @param {'blob'|'commit'|'tag'|'tree'} actual
	   * @param {'blob'|'commit'|'tag'|'tree'} expected
	   * @param {string} [filepath]
	   */
	  constructor(oid, actual, expected, filepath) {
	    super(
	      `Object ${oid} ${filepath ? `at ${filepath}` : ""}was anticipated to be a ${expected} but it is a ${actual}.`
	    );
	    this.code = this.name = ObjectTypeError.code;
	    this.data = { oid, actual, expected, filepath };
	  }
	}
	ObjectTypeError.code = "ObjectTypeError";
	class InvalidOidError extends BaseError {
	  /**
	   * @param {string} value
	   */
	  constructor(value) {
	    super(`Expected a 40-char hex object id but saw "${value}".`);
	    this.code = this.name = InvalidOidError.code;
	    this.data = { value };
	  }
	}
	InvalidOidError.code = "InvalidOidError";
	class NoRefspecError extends BaseError {
	  /**
	   * @param {string} remote
	   */
	  constructor(remote) {
	    super(`Could not find a fetch refspec for remote "${remote}". Make sure the config file has an entry like the following:
[remote "${remote}"]
	fetch = +refs/heads/*:refs/remotes/origin/*
`);
	    this.code = this.name = NoRefspecError.code;
	    this.data = { remote };
	  }
	}
	NoRefspecError.code = "NoRefspecError";
	class GitPackedRefs {
	  constructor(text) {
	    this.refs = /* @__PURE__ */ new Map();
	    this.parsedConfig = [];
	    if (text) {
	      let key = null;
	      this.parsedConfig = text.trim().split("\n").map((line) => {
	        if (/^\s*#/.test(line)) {
	          return { line, comment: true };
	        }
	        const i = line.indexOf(" ");
	        if (line.startsWith("^")) {
	          const value = line.slice(1);
	          this.refs.set(key + "^{}", value);
	          return { line, ref: key, peeled: value };
	        } else {
	          const value = line.slice(0, i);
	          key = line.slice(i + 1);
	          this.refs.set(key, value);
	          return { line, ref: key, oid: value };
	        }
	      });
	    }
	    return this;
	  }
	  static from(text) {
	    return new GitPackedRefs(text);
	  }
	  delete(ref) {
	    this.parsedConfig = this.parsedConfig.filter((entry) => entry.ref !== ref);
	    this.refs.delete(ref);
	  }
	  toString() {
	    return this.parsedConfig.map(({ line }) => line).join("\n") + "\n";
	  }
	}
	class GitRefSpec {
	  constructor({ remotePath, localPath, force, matchPrefix }) {
	    Object.assign(this, {
	      remotePath,
	      localPath,
	      force,
	      matchPrefix
	    });
	  }
	  static from(refspec) {
	    const [forceMatch, remotePath, remoteGlobMatch, localPath, localGlobMatch] = refspec.match(/^(\+?)(.*?)(\*?):(.*?)(\*?)$/).slice(1);
	    const force = forceMatch === "+";
	    const remoteIsGlob = remoteGlobMatch === "*";
	    const localIsGlob = localGlobMatch === "*";
	    if (remoteIsGlob !== localIsGlob) {
	      throw new InternalError("Invalid refspec");
	    }
	    return new GitRefSpec({
	      remotePath,
	      localPath,
	      force,
	      matchPrefix: remoteIsGlob
	    });
	  }
	  translate(remoteBranch) {
	    if (this.matchPrefix) {
	      if (remoteBranch.startsWith(this.remotePath)) {
	        return this.localPath + remoteBranch.replace(this.remotePath, "");
	      }
	    } else {
	      if (remoteBranch === this.remotePath) return this.localPath;
	    }
	    return null;
	  }
	  reverseTranslate(localBranch) {
	    if (this.matchPrefix) {
	      if (localBranch.startsWith(this.localPath)) {
	        return this.remotePath + localBranch.replace(this.localPath, "");
	      }
	    } else {
	      if (localBranch === this.localPath) return this.remotePath;
	    }
	    return null;
	  }
	}
	class GitRefSpecSet {
	  constructor(rules = []) {
	    this.rules = rules;
	  }
	  static from(refspecs) {
	    const rules = [];
	    for (const refspec of refspecs) {
	      rules.push(GitRefSpec.from(refspec));
	    }
	    return new GitRefSpecSet(rules);
	  }
	  add(refspec) {
	    const rule = GitRefSpec.from(refspec);
	    this.rules.push(rule);
	  }
	  translate(remoteRefs) {
	    const result = [];
	    for (const rule of this.rules) {
	      for (const remoteRef of remoteRefs) {
	        const localRef = rule.translate(remoteRef);
	        if (localRef) {
	          result.push([remoteRef, localRef]);
	        }
	      }
	    }
	    return result;
	  }
	  translateOne(remoteRef) {
	    let result = null;
	    for (const rule of this.rules) {
	      const localRef = rule.translate(remoteRef);
	      if (localRef) {
	        result = localRef;
	      }
	    }
	    return result;
	  }
	  localNamespaces() {
	    return this.rules.filter((rule) => rule.matchPrefix).map((rule) => rule.localPath.replace(/\/$/, ""));
	  }
	}
	function compareRefNames(a, b) {
	  const _a = a.replace(/\^\{\}$/, "");
	  const _b = b.replace(/\^\{\}$/, "");
	  const tmp = -(_a < _b) || +(_a > _b);
	  if (tmp === 0) {
	    return a.endsWith("^{}") ? 1 : -1;
	  }
	  return tmp;
	}
	/*!
	 * This code for `path.join` is directly copied from @zenfs/core/path for bundle size improvements.
	 * SPDX-License-Identifier: LGPL-3.0-or-later
	 * Copyright (c) James Prevett and other ZenFS contributors.
	 */
	function normalizeString(path, aar) {
	  let res = "";
	  let lastSegmentLength = 0;
	  let lastSlash = -1;
	  let dots = 0;
	  let char = "\0";
	  for (let i = 0; i <= path.length; ++i) {
	    if (i < path.length) char = path[i];
	    else if (char === "/") break;
	    else char = "/";
	    if (char === "/") {
	      if (lastSlash === i - 1 || dots === 1) ; else if (dots === 2) {
	        if (res.length < 2 || lastSegmentLength !== 2 || res.at(-1) !== "." || res.at(-2) !== ".") {
	          if (res.length > 2) {
	            const lastSlashIndex = res.lastIndexOf("/");
	            if (lastSlashIndex === -1) {
	              res = "";
	              lastSegmentLength = 0;
	            } else {
	              res = res.slice(0, lastSlashIndex);
	              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
	            }
	            lastSlash = i;
	            dots = 0;
	            continue;
	          } else if (res.length !== 0) {
	            res = "";
	            lastSegmentLength = 0;
	            lastSlash = i;
	            dots = 0;
	            continue;
	          }
	        }
	        if (aar) {
	          res += res.length > 0 ? "/.." : "..";
	          lastSegmentLength = 2;
	        }
	      } else {
	        if (res.length > 0) res += "/" + path.slice(lastSlash + 1, i);
	        else res = path.slice(lastSlash + 1, i);
	        lastSegmentLength = i - lastSlash - 1;
	      }
	      lastSlash = i;
	      dots = 0;
	    } else if (char === "." && dots !== -1) {
	      ++dots;
	    } else {
	      dots = -1;
	    }
	  }
	  return res;
	}
	function normalize(path) {
	  if (!path.length) return ".";
	  const isAbsolute2 = path[0] === "/";
	  const trailingSeparator = path.at(-1) === "/";
	  path = normalizeString(path, !isAbsolute2);
	  if (!path.length) {
	    if (isAbsolute2) return "/";
	    return trailingSeparator ? "./" : ".";
	  }
	  if (trailingSeparator) path += "/";
	  return isAbsolute2 ? `/${path}` : path;
	}
	function join(...args) {
	  if (args.length === 0) return ".";
	  let joined;
	  for (let i = 0; i < args.length; ++i) {
	    const arg = args[i];
	    if (arg.length > 0) {
	      if (joined === void 0) joined = arg;
	      else joined += "/" + arg;
	    }
	  }
	  if (joined === void 0) return ".";
	  return normalize(joined);
	}
	const num = (val) => {
	  if (typeof val === "number") {
	    return val;
	  }
	  val = val.toLowerCase();
	  let n = parseInt(val);
	  if (val.endsWith("k")) n *= 1024;
	  if (val.endsWith("m")) n *= 1024 * 1024;
	  if (val.endsWith("g")) n *= 1024 * 1024 * 1024;
	  return n;
	};
	const bool = (val) => {
	  if (typeof val === "boolean") {
	    return val;
	  }
	  val = val.trim().toLowerCase();
	  if (val === "true" || val === "yes" || val === "on") return true;
	  if (val === "false" || val === "no" || val === "off") return false;
	  throw Error(
	    `Expected 'true', 'false', 'yes', 'no', 'on', or 'off', but got ${val}`
	  );
	};
	const schema = {
	  core: {
	    filemode: bool,
	    bare: bool,
	    logallrefupdates: bool,
	    symlinks: bool,
	    ignorecase: bool,
	    bigFileThreshold: num
	  }
	};
	const SECTION_LINE_REGEX = /^\[([A-Za-z0-9-.]+)(?: "(.*)")?\]$/;
	const SECTION_REGEX = /^[A-Za-z0-9-.]+$/;
	const VARIABLE_LINE_REGEX = /^([A-Za-z][A-Za-z-]*)(?: *= *(.*))?$/;
	const VARIABLE_NAME_REGEX = /^[A-Za-z][A-Za-z-]*$/;
	const VARIABLE_VALUE_COMMENT_REGEX = /^(.*?)( *[#;].*)$/;
	const extractSectionLine = (line) => {
	  const matches = SECTION_LINE_REGEX.exec(line);
	  if (matches != null) {
	    const [section, subsection] = matches.slice(1);
	    return [section, subsection];
	  }
	  return null;
	};
	const extractVariableLine = (line) => {
	  const matches = VARIABLE_LINE_REGEX.exec(line);
	  if (matches != null) {
	    const [name, rawValue = "true"] = matches.slice(1);
	    const valueWithoutComments = removeComments(rawValue);
	    const valueWithoutQuotes = removeQuotes(valueWithoutComments);
	    return [name, valueWithoutQuotes];
	  }
	  return null;
	};
	const removeComments = (rawValue) => {
	  const commentMatches = VARIABLE_VALUE_COMMENT_REGEX.exec(rawValue);
	  if (commentMatches == null) {
	    return rawValue;
	  }
	  const [valueWithoutComment, comment] = commentMatches.slice(1);
	  if (hasOddNumberOfQuotes(valueWithoutComment) && hasOddNumberOfQuotes(comment)) {
	    return `${valueWithoutComment}${comment}`;
	  }
	  return valueWithoutComment;
	};
	const hasOddNumberOfQuotes = (text) => {
	  const numberOfQuotes = (text.match(/(?:^|[^\\])"/g) || []).length;
	  return numberOfQuotes % 2 !== 0;
	};
	const removeQuotes = (text) => {
	  return text.split("").reduce((newText, c, idx, text2) => {
	    const isQuote = c === '"' && text2[idx - 1] !== "\\";
	    const isEscapeForQuote = c === "\\" && text2[idx + 1] === '"';
	    if (isQuote || isEscapeForQuote) {
	      return newText;
	    }
	    return newText + c;
	  }, "");
	};
	const lower = (text) => {
	  return text != null ? text.toLowerCase() : null;
	};
	const getPath = (section, subsection, name) => {
	  return [lower(section), subsection, lower(name)].filter((a) => a != null).join(".");
	};
	const normalizePath = (path) => {
	  const pathSegments = path.split(".");
	  const section = pathSegments.shift();
	  const name = pathSegments.pop();
	  const subsection = pathSegments.length ? pathSegments.join(".") : void 0;
	  return {
	    section,
	    subsection,
	    name,
	    path: getPath(section, subsection, name),
	    sectionPath: getPath(section, subsection, null),
	    isSection: !!section
	  };
	};
	const findLastIndex = (array, callback) => {
	  return array.reduce((lastIndex, item, index2) => {
	    return callback(item) ? index2 : lastIndex;
	  }, -1);
	};
	class GitConfig {
	  constructor(text) {
	    let section = null;
	    let subsection = null;
	    this.parsedConfig = text ? text.split("\n").map((line) => {
	      let name = null;
	      let value = null;
	      const trimmedLine = line.trim();
	      const extractedSection = extractSectionLine(trimmedLine);
	      const isSection = extractedSection != null;
	      if (isSection) {
	        [section, subsection] = extractedSection;
	      } else {
	        const extractedVariable = extractVariableLine(trimmedLine);
	        const isVariable = extractedVariable != null;
	        if (isVariable) {
	          [name, value] = extractedVariable;
	        }
	      }
	      const path = getPath(section, subsection, name);
	      return { line, isSection, section, subsection, name, value, path };
	    }) : [];
	  }
	  static from(text) {
	    return new GitConfig(text);
	  }
	  async get(path, getall = false) {
	    const normalizedPath = normalizePath(path).path;
	    const allValues = this.parsedConfig.filter((config) => config.path === normalizedPath).map(({ section, name, value }) => {
	      const fn = schema[section] && schema[section][name];
	      return fn ? fn(value) : value;
	    });
	    return getall ? allValues : allValues.pop();
	  }
	  async getall(path) {
	    return this.get(path, true);
	  }
	  async getSubsections(section) {
	    return this.parsedConfig.filter((config) => config.isSection && config.section === section).map((config) => config.subsection);
	  }
	  async deleteSection(section, subsection) {
	    this.parsedConfig = this.parsedConfig.filter(
	      (config) => !(config.section === section && config.subsection === subsection)
	    );
	  }
	  async append(path, value) {
	    return this.set(path, value, true);
	  }
	  async set(path, value, append = false) {
	    const {
	      section,
	      subsection,
	      name,
	      path: normalizedPath,
	      sectionPath,
	      isSection
	    } = normalizePath(path);
	    const configIndex = findLastIndex(
	      this.parsedConfig,
	      (config) => config.path === normalizedPath
	    );
	    if (value == null) {
	      if (configIndex !== -1) {
	        this.parsedConfig.splice(configIndex, 1);
	      }
	    } else {
	      if (configIndex !== -1) {
	        const config = this.parsedConfig[configIndex];
	        const modifiedConfig = Object.assign({}, config, {
	          name,
	          value,
	          modified: true
	        });
	        if (append) {
	          this.parsedConfig.splice(configIndex + 1, 0, modifiedConfig);
	        } else {
	          this.parsedConfig[configIndex] = modifiedConfig;
	        }
	      } else {
	        const sectionIndex = this.parsedConfig.findIndex(
	          (config) => config.path === sectionPath
	        );
	        const newConfig = {
	          section,
	          subsection,
	          name,
	          value,
	          modified: true,
	          path: normalizedPath
	        };
	        if (SECTION_REGEX.test(section) && VARIABLE_NAME_REGEX.test(name)) {
	          if (sectionIndex >= 0) {
	            this.parsedConfig.splice(sectionIndex + 1, 0, newConfig);
	          } else {
	            const newSection = {
	              isSection,
	              section,
	              subsection,
	              modified: true,
	              path: sectionPath
	            };
	            this.parsedConfig.push(newSection, newConfig);
	          }
	        }
	      }
	    }
	  }
	  toString() {
	    return this.parsedConfig.map(({ line, section, subsection, name, value, modified: modified2 = false }) => {
	      if (!modified2) {
	        return line;
	      }
	      if (name != null && value != null) {
	        if (typeof value === "string" && /[#;]/.test(value)) {
	          return `	${name} = "${value}"`;
	        }
	        return `	${name} = ${value}`;
	      }
	      if (subsection != null) {
	        return `[${section} "${subsection}"]`;
	      }
	      return `[${section}]`;
	    }).join("\n");
	  }
	}
	class GitConfigManager {
	  /**
	   * Reads the Git configuration file from the specified `.git` directory.
	   *
	   * @param {object} opts - Options for reading the Git configuration.
	   * @param {FSClient} opts.fs - A file system implementation.
	   * @param {string} opts.gitdir - The path to the `.git` directory.
	   * @returns {Promise<GitConfig>} A `GitConfig` object representing the parsed configuration.
	   */
	  static async get({ fs, gitdir }) {
	    const text = await fs.read(`${gitdir}/config`, { encoding: "utf8" });
	    return GitConfig.from(text);
	  }
	  /**
	   * Saves the provided Git configuration to the specified `.git` directory.
	   *
	   * @param {object} opts - Options for saving the Git configuration.
	   * @param {FSClient} opts.fs - A file system implementation.
	   * @param {string} opts.gitdir - The path to the `.git` directory.
	   * @param {GitConfig} opts.config - The `GitConfig` object to save.
	   * @returns {Promise<void>} Resolves when the configuration has been successfully saved.
	   */
	  static async save({ fs, gitdir, config }) {
	    await fs.write(`${gitdir}/config`, config.toString(), {
	      encoding: "utf8"
	    });
	  }
	}
	const refpaths = (ref) => [
	  `${ref}`,
	  `refs/${ref}`,
	  `refs/tags/${ref}`,
	  `refs/heads/${ref}`,
	  `refs/remotes/${ref}`,
	  `refs/remotes/${ref}/HEAD`
	];
	const GIT_FILES = ["config", "description", "index", "shallow", "commondir"];
	let lock$1;
	async function acquireLock(ref, callback) {
	  if (lock$1 === void 0) lock$1 = new AsyncLock();
	  return lock$1.acquire(ref, callback);
	}
	class GitRefManager {
	  /**
	   * Updates remote refs based on the provided refspecs and options.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @param {string} args.remote - The name of the remote.
	   * @param {Map<string, string>} args.refs - A map of refs to their object IDs.
	   * @param {Map<string, string>} args.symrefs - A map of symbolic refs.
	   * @param {boolean} args.tags - Whether to fetch tags.
	   * @param {string[]} [args.refspecs = undefined] - The refspecs to use.
	   * @param {boolean} [args.prune = false] - Whether to prune stale refs.
	   * @param {boolean} [args.pruneTags = false] - Whether to prune tags.
	   * @returns {Promise<Object>} - An object containing pruned refs.
	   */
	  static async updateRemoteRefs({
	    fs,
	    gitdir,
	    remote,
	    refs,
	    symrefs,
	    tags,
	    refspecs = void 0,
	    prune = false,
	    pruneTags = false
	  }) {
	    for (const value of refs.values()) {
	      if (!value.match(/[0-9a-f]{40}/)) {
	        throw new InvalidOidError(value);
	      }
	    }
	    const config = await GitConfigManager.get({ fs, gitdir });
	    if (!refspecs) {
	      refspecs = await config.getall(`remote.${remote}.fetch`);
	      if (refspecs.length === 0) {
	        throw new NoRefspecError(remote);
	      }
	      refspecs.unshift(`+HEAD:refs/remotes/${remote}/HEAD`);
	    }
	    const refspec = GitRefSpecSet.from(refspecs);
	    const actualRefsToWrite = /* @__PURE__ */ new Map();
	    if (pruneTags) {
	      const tags2 = await GitRefManager.listRefs({
	        fs,
	        gitdir,
	        filepath: "refs/tags"
	      });
	      await GitRefManager.deleteRefs({
	        fs,
	        gitdir,
	        refs: tags2.map((tag2) => `refs/tags/${tag2}`)
	      });
	    }
	    if (tags) {
	      for (const serverRef of refs.keys()) {
	        if (serverRef.startsWith("refs/tags") && !serverRef.endsWith("^{}")) {
	          if (!await GitRefManager.exists({ fs, gitdir, ref: serverRef })) {
	            const oid = refs.get(serverRef);
	            actualRefsToWrite.set(serverRef, oid);
	          }
	        }
	      }
	    }
	    const refTranslations = refspec.translate([...refs.keys()]);
	    for (const [serverRef, translatedRef] of refTranslations) {
	      const value = refs.get(serverRef);
	      actualRefsToWrite.set(translatedRef, value);
	    }
	    const symrefTranslations = refspec.translate([...symrefs.keys()]);
	    for (const [serverRef, translatedRef] of symrefTranslations) {
	      const value = symrefs.get(serverRef);
	      const symtarget = refspec.translateOne(value);
	      if (symtarget) {
	        actualRefsToWrite.set(translatedRef, `ref: ${symtarget}`);
	      }
	    }
	    const pruned = [];
	    if (prune) {
	      for (const filepath of refspec.localNamespaces()) {
	        const refs2 = (await GitRefManager.listRefs({
	          fs,
	          gitdir,
	          filepath
	        })).map((file) => `${filepath}/${file}`);
	        for (const ref of refs2) {
	          if (!actualRefsToWrite.has(ref)) {
	            pruned.push(ref);
	          }
	        }
	      }
	      if (pruned.length > 0) {
	        await GitRefManager.deleteRefs({ fs, gitdir, refs: pruned });
	      }
	    }
	    for (const [key, value] of actualRefsToWrite) {
	      await acquireLock(
	        key,
	        async () => fs.write(join(gitdir, key), `${value.trim()}
`, "utf8")
	      );
	    }
	    return { pruned };
	  }
	  /**
	   * Writes a ref to the file system.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @param {string} args.ref - The ref to write.
	   * @param {string} args.value - The object ID to write.
	   * @returns {Promise<void>}
	   */
	  // TODO: make this less crude?
	  static async writeRef({ fs, gitdir, ref, value }) {
	    if (!value.match(/[0-9a-f]{40}/)) {
	      throw new InvalidOidError(value);
	    }
	    await acquireLock(
	      ref,
	      async () => fs.write(join(gitdir, ref), `${value.trim()}
`, "utf8")
	    );
	  }
	  /**
	   * Writes a symbolic ref to the file system.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @param {string} args.ref - The ref to write.
	   * @param {string} args.value - The target ref.
	   * @returns {Promise<void>}
	   */
	  static async writeSymbolicRef({ fs, gitdir, ref, value }) {
	    await acquireLock(
	      ref,
	      async () => fs.write(join(gitdir, ref), `ref: ${value.trim()}
`, "utf8")
	    );
	  }
	  /**
	   * Deletes a single ref.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @param {string} args.ref - The ref to delete.
	   * @returns {Promise<void>}
	   */
	  static async deleteRef({ fs, gitdir, ref }) {
	    return GitRefManager.deleteRefs({ fs, gitdir, refs: [ref] });
	  }
	  /**
	   * Deletes multiple refs.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @param {string[]} args.refs - The refs to delete.
	   * @returns {Promise<void>}
	   */
	  static async deleteRefs({ fs, gitdir, refs }) {
	    await Promise.all(refs.map((ref) => fs.rm(join(gitdir, ref))));
	    let text = await acquireLock(
	      "packed-refs",
	      async () => fs.read(`${gitdir}/packed-refs`, { encoding: "utf8" })
	    );
	    const packed = GitPackedRefs.from(text);
	    const beforeSize = packed.refs.size;
	    for (const ref of refs) {
	      if (packed.refs.has(ref)) {
	        packed.delete(ref);
	      }
	    }
	    if (packed.refs.size < beforeSize) {
	      text = packed.toString();
	      await acquireLock(
	        "packed-refs",
	        async () => fs.write(`${gitdir}/packed-refs`, text, { encoding: "utf8" })
	      );
	    }
	  }
	  /**
	   * Resolves a ref to its object ID.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @param {string} args.ref - The ref to resolve.
	   * @param {number} [args.depth = undefined] - The maximum depth to resolve symbolic refs.
	   * @returns {Promise<string>} - The resolved object ID.
	   */
	  static async resolve({ fs, gitdir, ref, depth = void 0 }) {
	    if (depth !== void 0) {
	      depth--;
	      if (depth === -1) {
	        return ref;
	      }
	    }
	    if (ref.startsWith("ref: ")) {
	      ref = ref.slice("ref: ".length);
	      return GitRefManager.resolve({ fs, gitdir, ref, depth });
	    }
	    if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
	      return ref;
	    }
	    const packedMap = await GitRefManager.packedRefs({ fs, gitdir });
	    const allpaths = refpaths(ref).filter((p) => !GIT_FILES.includes(p));
	    for (const ref2 of allpaths) {
	      const sha = await acquireLock(
	        ref2,
	        async () => await fs.read(`${gitdir}/${ref2}`, { encoding: "utf8" }) || packedMap.get(ref2)
	      );
	      if (sha) {
	        return GitRefManager.resolve({ fs, gitdir, ref: sha.trim(), depth });
	      }
	    }
	    throw new NotFoundError(ref);
	  }
	  /**
	   * Checks if a ref exists.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @param {string} args.ref - The ref to check.
	   * @returns {Promise<boolean>} - True if the ref exists, false otherwise.
	   */
	  static async exists({ fs, gitdir, ref }) {
	    try {
	      await GitRefManager.expand({ fs, gitdir, ref });
	      return true;
	    } catch (err) {
	      return false;
	    }
	  }
	  /**
	   * Expands a ref to its full name.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @param {string} args.ref - The ref to expand.
	   * @returns {Promise<string>} - The full ref name.
	   */
	  static async expand({ fs, gitdir, ref }) {
	    if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
	      return ref;
	    }
	    const packedMap = await GitRefManager.packedRefs({ fs, gitdir });
	    const allpaths = refpaths(ref);
	    for (const ref2 of allpaths) {
	      const refExists = await acquireLock(
	        ref2,
	        async () => fs.exists(`${gitdir}/${ref2}`)
	      );
	      if (refExists) return ref2;
	      if (packedMap.has(ref2)) return ref2;
	    }
	    throw new NotFoundError(ref);
	  }
	  /**
	   * Expands a ref against a provided map.
	   *
	   * @param {Object} args
	   * @param {string} args.ref - The ref to expand.
	   * @param {Map<string, string>} args.map - The map of refs.
	   * @returns {Promise<string>} - The expanded ref.
	   */
	  static async expandAgainstMap({ ref, map }) {
	    const allpaths = refpaths(ref);
	    for (const ref2 of allpaths) {
	      if (await map.has(ref2)) return ref2;
	    }
	    throw new NotFoundError(ref);
	  }
	  /**
	   * Resolves a ref against a provided map.
	   *
	   * @param {Object} args
	   * @param {string} args.ref - The ref to resolve.
	   * @param {string} [args.fullref = args.ref] - The full ref name.
	   * @param {number} [args.depth = undefined] - The maximum depth to resolve symbolic refs.
	   * @param {Map<string, string>} args.map - The map of refs.
	   * @returns {Object} - An object containing the full ref and its object ID.
	   */
	  static resolveAgainstMap({ ref, fullref = ref, depth = void 0, map }) {
	    if (depth !== void 0) {
	      depth--;
	      if (depth === -1) {
	        return { fullref, oid: ref };
	      }
	    }
	    if (ref.startsWith("ref: ")) {
	      ref = ref.slice("ref: ".length);
	      return GitRefManager.resolveAgainstMap({ ref, fullref, depth, map });
	    }
	    if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
	      return { fullref, oid: ref };
	    }
	    const allpaths = refpaths(ref);
	    for (const ref2 of allpaths) {
	      const sha = map.get(ref2);
	      if (sha) {
	        return GitRefManager.resolveAgainstMap({
	          ref: sha.trim(),
	          fullref: ref2,
	          depth,
	          map
	        });
	      }
	    }
	    throw new NotFoundError(ref);
	  }
	  /**
	   * Reads the packed refs file and returns a map of refs.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @returns {Promise<Map<string, string>>} - A map of packed refs.
	   */
	  static async packedRefs({ fs, gitdir }) {
	    const text = await acquireLock(
	      "packed-refs",
	      async () => fs.read(`${gitdir}/packed-refs`, { encoding: "utf8" })
	    );
	    const packed = GitPackedRefs.from(text);
	    return packed.refs;
	  }
	  /**
	   * Lists all refs matching a given filepath prefix.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @param {string} args.filepath - The filepath prefix to match.
	   * @returns {Promise<string[]>} - A sorted list of refs.
	   */
	  static async listRefs({ fs, gitdir, filepath }) {
	    const packedMap = GitRefManager.packedRefs({ fs, gitdir });
	    let files = null;
	    try {
	      files = await fs.readdirDeep(`${gitdir}/${filepath}`);
	      files = files.map((x) => x.replace(`${gitdir}/${filepath}/`, ""));
	    } catch (err) {
	      files = [];
	    }
	    for (let key of (await packedMap).keys()) {
	      if (key.startsWith(filepath)) {
	        key = key.replace(filepath + "/", "");
	        if (!files.includes(key)) {
	          files.push(key);
	        }
	      }
	    }
	    files.sort(compareRefNames);
	    return files;
	  }
	  /**
	   * Lists all branches, optionally filtered by remote.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @param {string} [args.remote] - The remote to filter branches by.
	   * @returns {Promise<string[]>} - A list of branch names.
	   */
	  static async listBranches({ fs, gitdir, remote }) {
	    if (remote) {
	      return GitRefManager.listRefs({
	        fs,
	        gitdir,
	        filepath: `refs/remotes/${remote}`
	      });
	    } else {
	      return GitRefManager.listRefs({ fs, gitdir, filepath: `refs/heads` });
	    }
	  }
	  /**
	   * Lists all tags.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @returns {Promise<string[]>} - A list of tag names.
	   */
	  static async listTags({ fs, gitdir }) {
	    const tags = await GitRefManager.listRefs({
	      fs,
	      gitdir,
	      filepath: `refs/tags`
	    });
	    return tags.filter((x) => !x.endsWith("^{}"));
	  }
	}
	function compareTreeEntryPath(a, b) {
	  return compareStrings(appendSlashIfDir(a), appendSlashIfDir(b));
	}
	function appendSlashIfDir(entry) {
	  return entry.mode === "040000" ? entry.path + "/" : entry.path;
	}
	function mode2type$1(mode) {
	  switch (mode) {
	    case "040000":
	      return "tree";
	    case "100644":
	      return "blob";
	    case "100755":
	      return "blob";
	    case "120000":
	      return "blob";
	    case "160000":
	      return "commit";
	  }
	  throw new InternalError(`Unexpected GitTree entry mode: ${mode}`);
	}
	function parseBuffer(buffer) {
	  const _entries = [];
	  let cursor = 0;
	  while (cursor < buffer.length) {
	    const space = buffer.indexOf(32, cursor);
	    if (space === -1) {
	      throw new InternalError(
	        `GitTree: Error parsing buffer at byte location ${cursor}: Could not find the next space character.`
	      );
	    }
	    const nullchar = buffer.indexOf(0, cursor);
	    if (nullchar === -1) {
	      throw new InternalError(
	        `GitTree: Error parsing buffer at byte location ${cursor}: Could not find the next null character.`
	      );
	    }
	    let mode = buffer.slice(cursor, space).toString("utf8");
	    if (mode === "40000") mode = "040000";
	    const type = mode2type$1(mode);
	    const path = buffer.slice(space + 1, nullchar).toString("utf8");
	    if (path.includes("\\") || path.includes("/")) {
	      throw new UnsafeFilepathError(path);
	    }
	    const oid = buffer.slice(nullchar + 1, nullchar + 21).toString("hex");
	    cursor = nullchar + 21;
	    _entries.push({ mode, path, oid, type });
	  }
	  return _entries;
	}
	function limitModeToAllowed(mode) {
	  if (typeof mode === "number") {
	    mode = mode.toString(8);
	  }
	  if (mode.match(/^0?4.*/)) return "040000";
	  if (mode.match(/^1006.*/)) return "100644";
	  if (mode.match(/^1007.*/)) return "100755";
	  if (mode.match(/^120.*/)) return "120000";
	  if (mode.match(/^160.*/)) return "160000";
	  throw new InternalError(`Could not understand file mode: ${mode}`);
	}
	function nudgeIntoShape(entry) {
	  if (!entry.oid && entry.sha) {
	    entry.oid = entry.sha;
	  }
	  entry.mode = limitModeToAllowed(entry.mode);
	  if (!entry.type) {
	    entry.type = mode2type$1(entry.mode);
	  }
	  return entry;
	}
	class GitTree {
	  constructor(entries) {
	    if (Buffer.isBuffer(entries)) {
	      this._entries = parseBuffer(entries);
	    } else if (Array.isArray(entries)) {
	      this._entries = entries.map(nudgeIntoShape);
	    } else {
	      throw new InternalError("invalid type passed to GitTree constructor");
	    }
	    this._entries.sort(comparePath);
	  }
	  static from(tree) {
	    return new GitTree(tree);
	  }
	  render() {
	    return this._entries.map((entry) => `${entry.mode} ${entry.type} ${entry.oid}    ${entry.path}`).join("\n");
	  }
	  toObject() {
	    const entries = [...this._entries];
	    entries.sort(compareTreeEntryPath);
	    return Buffer.concat(
	      entries.map((entry) => {
	        const mode = Buffer.from(entry.mode.replace(/^0/, ""));
	        const space = Buffer.from(" ");
	        const path = Buffer.from(entry.path, "utf8");
	        const nullchar = Buffer.from([0]);
	        const oid = Buffer.from(entry.oid, "hex");
	        return Buffer.concat([mode, space, path, nullchar, oid]);
	      })
	    );
	  }
	  /**
	   * @returns {TreeEntry[]}
	   */
	  entries() {
	    return this._entries;
	  }
	  *[Symbol.iterator]() {
	    for (const entry of this._entries) {
	      yield entry;
	    }
	  }
	}
	class GitObject {
	  /**
	   * Wraps a raw object with a Git header.
	   *
	   * @param {Object} params - The parameters for wrapping.
	   * @param {string} params.type - The type of the Git object (e.g., 'blob', 'tree', 'commit').
	   * @param {Uint8Array} params.object - The raw object data to wrap.
	   * @returns {Uint8Array} The wrapped Git object as a single buffer.
	   */
	  static wrap({ type, object }) {
	    const header = `${type} ${object.length}\0`;
	    const headerLen = header.length;
	    const totalLength = headerLen + object.length;
	    const wrappedObject = new Uint8Array(totalLength);
	    for (let i = 0; i < headerLen; i++) {
	      wrappedObject[i] = header.charCodeAt(i);
	    }
	    wrappedObject.set(object, headerLen);
	    return wrappedObject;
	  }
	  /**
	   * Unwraps a Git object buffer into its type and raw object data.
	   *
	   * @param {Buffer|Uint8Array} buffer - The buffer containing the wrapped Git object.
	   * @returns {{ type: string, object: Buffer }} An object containing the type and the raw object data.
	   * @throws {InternalError} If the length specified in the header does not match the actual object length.
	   */
	  static unwrap(buffer) {
	    const s = buffer.indexOf(32);
	    const i = buffer.indexOf(0);
	    const type = buffer.slice(0, s).toString("utf8");
	    const length = buffer.slice(s + 1, i).toString("utf8");
	    const actualLength = buffer.length - (i + 1);
	    if (parseInt(length) !== actualLength) {
	      throw new InternalError(
	        `Length mismatch: expected ${length} bytes but got ${actualLength} instead.`
	      );
	    }
	    return {
	      type,
	      object: Buffer.from(buffer.slice(i + 1))
	    };
	  }
	}
	async function readObjectLoose({ fs, gitdir, oid }) {
	  const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
	  const file = await fs.read(`${gitdir}/${source}`);
	  if (!file) {
	    return null;
	  }
	  return { object: file, format: "deflated", source };
	}
	function applyDelta(delta, source) {
	  const reader = new BufferCursor(delta);
	  const sourceSize = readVarIntLE(reader);
	  if (sourceSize !== source.byteLength) {
	    throw new InternalError(
	      `applyDelta expected source buffer to be ${sourceSize} bytes but the provided buffer was ${source.length} bytes`
	    );
	  }
	  const targetSize = readVarIntLE(reader);
	  let target;
	  const firstOp = readOp(reader, source);
	  if (firstOp.byteLength === targetSize) {
	    target = firstOp;
	  } else {
	    target = Buffer.alloc(targetSize);
	    const writer = new BufferCursor(target);
	    writer.copy(firstOp);
	    while (!reader.eof()) {
	      writer.copy(readOp(reader, source));
	    }
	    const tell = writer.tell();
	    if (targetSize !== tell) {
	      throw new InternalError(
	        `applyDelta expected target buffer to be ${targetSize} bytes but the resulting buffer was ${tell} bytes`
	      );
	    }
	  }
	  return target;
	}
	function readVarIntLE(reader) {
	  let result = 0;
	  let shift = 0;
	  let byte = null;
	  do {
	    byte = reader.readUInt8();
	    result |= (byte & 127) << shift;
	    shift += 7;
	  } while (byte & 128);
	  return result;
	}
	function readCompactLE(reader, flags, size) {
	  let result = 0;
	  let shift = 0;
	  while (size--) {
	    if (flags & 1) {
	      result |= reader.readUInt8() << shift;
	    }
	    flags >>= 1;
	    shift += 8;
	  }
	  return result;
	}
	function readOp(reader, source) {
	  const byte = reader.readUInt8();
	  const COPY = 128;
	  const OFFS = 15;
	  const SIZE = 112;
	  if (byte & COPY) {
	    const offset = readCompactLE(reader, byte & OFFS, 4);
	    let size = readCompactLE(reader, (byte & SIZE) >> 4, 3);
	    if (size === 0) size = 65536;
	    return source.slice(offset, offset + size);
	  } else {
	    return reader.slice(byte);
	  }
	}
	function fromValue(value) {
	  let queue = [value];
	  return {
	    next() {
	      return Promise.resolve({ done: queue.length === 0, value: queue.pop() });
	    },
	    return() {
	      queue = [];
	      return {};
	    },
	    [Symbol.asyncIterator]() {
	      return this;
	    }
	  };
	}
	function getIterator(iterable) {
	  if (iterable[Symbol.asyncIterator]) {
	    return iterable[Symbol.asyncIterator]();
	  }
	  if (iterable[Symbol.iterator]) {
	    return iterable[Symbol.iterator]();
	  }
	  if (iterable.next) {
	    return iterable;
	  }
	  return fromValue(iterable);
	}
	class StreamReader {
	  constructor(stream) {
	    if (typeof Buffer === "undefined") {
	      throw new Error("Missing Buffer dependency");
	    }
	    this.stream = getIterator(stream);
	    this.buffer = null;
	    this.cursor = 0;
	    this.undoCursor = 0;
	    this.started = false;
	    this._ended = false;
	    this._discardedBytes = 0;
	  }
	  eof() {
	    return this._ended && this.cursor === this.buffer.length;
	  }
	  tell() {
	    return this._discardedBytes + this.cursor;
	  }
	  async byte() {
	    if (this.eof()) return;
	    if (!this.started) await this._init();
	    if (this.cursor === this.buffer.length) {
	      await this._loadnext();
	      if (this._ended) return;
	    }
	    this._moveCursor(1);
	    return this.buffer[this.undoCursor];
	  }
	  async chunk() {
	    if (this.eof()) return;
	    if (!this.started) await this._init();
	    if (this.cursor === this.buffer.length) {
	      await this._loadnext();
	      if (this._ended) return;
	    }
	    this._moveCursor(this.buffer.length);
	    return this.buffer.slice(this.undoCursor, this.cursor);
	  }
	  async read(n) {
	    if (this.eof()) return;
	    if (!this.started) await this._init();
	    if (this.cursor + n > this.buffer.length) {
	      this._trim();
	      await this._accumulate(n);
	    }
	    this._moveCursor(n);
	    return this.buffer.slice(this.undoCursor, this.cursor);
	  }
	  async skip(n) {
	    if (this.eof()) return;
	    if (!this.started) await this._init();
	    if (this.cursor + n > this.buffer.length) {
	      this._trim();
	      await this._accumulate(n);
	    }
	    this._moveCursor(n);
	  }
	  async undo() {
	    this.cursor = this.undoCursor;
	  }
	  async _next() {
	    this.started = true;
	    let { done, value } = await this.stream.next();
	    if (done) {
	      this._ended = true;
	      if (!value) return Buffer.alloc(0);
	    }
	    if (value) {
	      value = Buffer.from(value);
	    }
	    return value;
	  }
	  _trim() {
	    this.buffer = this.buffer.slice(this.undoCursor);
	    this.cursor -= this.undoCursor;
	    this._discardedBytes += this.undoCursor;
	    this.undoCursor = 0;
	  }
	  _moveCursor(n) {
	    this.undoCursor = this.cursor;
	    this.cursor += n;
	    if (this.cursor > this.buffer.length) {
	      this.cursor = this.buffer.length;
	    }
	  }
	  async _accumulate(n) {
	    if (this._ended) return;
	    const buffers = [this.buffer];
	    while (this.cursor + n > lengthBuffers(buffers)) {
	      const nextbuffer = await this._next();
	      if (this._ended) break;
	      buffers.push(nextbuffer);
	    }
	    this.buffer = Buffer.concat(buffers);
	  }
	  async _loadnext() {
	    this._discardedBytes += this.buffer.length;
	    this.undoCursor = 0;
	    this.cursor = 0;
	    this.buffer = await this._next();
	  }
	  async _init() {
	    this.buffer = await this._next();
	  }
	}
	function lengthBuffers(buffers) {
	  return buffers.reduce((acc, buffer) => acc + buffer.length, 0);
	}
	async function listpack(stream, onData) {
	  const reader = new StreamReader(stream);
	  let PACK = await reader.read(4);
	  PACK = PACK.toString("utf8");
	  if (PACK !== "PACK") {
	    throw new InternalError(`Invalid PACK header '${PACK}'`);
	  }
	  let version2 = await reader.read(4);
	  version2 = version2.readUInt32BE(0);
	  if (version2 !== 2) {
	    throw new InternalError(`Invalid packfile version: ${version2}`);
	  }
	  let numObjects = await reader.read(4);
	  numObjects = numObjects.readUInt32BE(0);
	  if (numObjects < 1) return;
	  while (!reader.eof() && numObjects--) {
	    const offset = reader.tell();
	    const { type, length, ofs, reference } = await parseHeader(reader);
	    const inflator = new pako.Inflate();
	    while (!inflator.result) {
	      const chunk = await reader.chunk();
	      if (!chunk) break;
	      inflator.push(chunk, false);
	      if (inflator.err) {
	        throw new InternalError(`Pako error: ${inflator.msg}`);
	      }
	      if (inflator.result) {
	        if (inflator.result.length !== length) {
	          throw new InternalError(
	            `Inflated object size is different from that stated in packfile.`
	          );
	        }
	        await reader.undo();
	        await reader.read(chunk.length - inflator.strm.avail_in);
	        const end = reader.tell();
	        await onData({
	          data: inflator.result,
	          type,
	          num: numObjects,
	          offset,
	          end,
	          reference,
	          ofs
	        });
	      }
	    }
	  }
	}
	async function parseHeader(reader) {
	  let byte = await reader.byte();
	  const type = byte >> 4 & 7;
	  let length = byte & 15;
	  if (byte & 128) {
	    let shift = 4;
	    do {
	      byte = await reader.byte();
	      length |= (byte & 127) << shift;
	      shift += 7;
	    } while (byte & 128);
	  }
	  let ofs;
	  let reference;
	  if (type === 6) {
	    let shift = 0;
	    ofs = 0;
	    const bytes = [];
	    do {
	      byte = await reader.byte();
	      ofs |= (byte & 127) << shift;
	      shift += 7;
	      bytes.push(byte);
	    } while (byte & 128);
	    reference = Buffer.from(bytes);
	  }
	  if (type === 7) {
	    const buf = await reader.read(20);
	    reference = buf;
	  }
	  return { type, length, ofs, reference };
	}
	async function inflate(buffer) {
	  return pako.inflate(buffer);
	}
	function decodeVarInt(reader) {
	  const bytes = [];
	  let byte = 0;
	  let multibyte = 0;
	  do {
	    byte = reader.readUInt8();
	    const lastSeven = byte & 127;
	    bytes.push(lastSeven);
	    multibyte = byte & 128;
	  } while (multibyte);
	  return bytes.reduce((a, b) => a + 1 << 7 | b, -1);
	}
	function otherVarIntDecode(reader, startWith) {
	  let result = startWith;
	  let shift = 4;
	  let byte = null;
	  do {
	    byte = reader.readUInt8();
	    result |= (byte & 127) << shift;
	    shift += 7;
	  } while (byte & 128);
	  return result;
	}
	class GitPackIndex {
	  constructor(stuff) {
	    Object.assign(this, stuff);
	    this.offsetCache = {};
	  }
	  static async fromIdx({ idx, getExternalRefDelta }) {
	    const reader = new BufferCursor(idx);
	    const magic = reader.slice(4).toString("hex");
	    if (magic !== "ff744f63") {
	      return;
	    }
	    const version2 = reader.readUInt32BE();
	    if (version2 !== 2) {
	      throw new InternalError(
	        `Unable to read version ${version2} packfile IDX. (Only version 2 supported)`
	      );
	    }
	    if (idx.byteLength > 2048 * 1024 * 1024) {
	      throw new InternalError(
	        `To keep implementation simple, I haven't implemented the layer 5 feature needed to support packfiles > 2GB in size.`
	      );
	    }
	    reader.seek(reader.tell() + 4 * 255);
	    const size = reader.readUInt32BE();
	    const hashes = [];
	    for (let i = 0; i < size; i++) {
	      const hash = reader.slice(20).toString("hex");
	      hashes[i] = hash;
	    }
	    reader.seek(reader.tell() + 4 * size);
	    const offsets = /* @__PURE__ */ new Map();
	    for (let i = 0; i < size; i++) {
	      offsets.set(hashes[i], reader.readUInt32BE());
	    }
	    const packfileSha = reader.slice(20).toString("hex");
	    return new GitPackIndex({
	      hashes,
	      crcs: {},
	      offsets,
	      packfileSha,
	      getExternalRefDelta
	    });
	  }
	  static async fromPack({ pack, getExternalRefDelta, onProgress }) {
	    const listpackTypes = {
	      1: "commit",
	      2: "tree",
	      3: "blob",
	      4: "tag",
	      6: "ofs-delta",
	      7: "ref-delta"
	    };
	    const offsetToObject = {};
	    const packfileSha = pack.slice(-20).toString("hex");
	    const hashes = [];
	    const crcs = {};
	    const offsets = /* @__PURE__ */ new Map();
	    let totalObjectCount = null;
	    let lastPercent = null;
	    await listpack([pack], async ({ data, type, reference, offset, num: num2 }) => {
	      if (totalObjectCount === null) totalObjectCount = num2;
	      const percent = Math.floor(
	        (totalObjectCount - num2) * 100 / totalObjectCount
	      );
	      if (percent !== lastPercent) {
	        if (onProgress) {
	          await onProgress({
	            phase: "Receiving objects",
	            loaded: totalObjectCount - num2,
	            total: totalObjectCount
	          });
	        }
	      }
	      lastPercent = percent;
	      type = listpackTypes[type];
	      if (["commit", "tree", "blob", "tag"].includes(type)) {
	        offsetToObject[offset] = {
	          type,
	          offset
	        };
	      } else if (type === "ofs-delta") {
	        offsetToObject[offset] = {
	          type,
	          offset
	        };
	      } else if (type === "ref-delta") {
	        offsetToObject[offset] = {
	          type,
	          offset
	        };
	      }
	    });
	    const offsetArray = Object.keys(offsetToObject).map(Number);
	    for (const [i, start] of offsetArray.entries()) {
	      const end = i + 1 === offsetArray.length ? pack.byteLength - 20 : offsetArray[i + 1];
	      const o = offsetToObject[start];
	      const crc = crc32.buf(pack.slice(start, end)) >>> 0;
	      o.end = end;
	      o.crc = crc;
	    }
	    const p = new GitPackIndex({
	      pack: Promise.resolve(pack),
	      packfileSha,
	      crcs,
	      hashes,
	      offsets,
	      getExternalRefDelta
	    });
	    lastPercent = null;
	    let count = 0;
	    const objectsByDepth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	    for (let offset in offsetToObject) {
	      offset = Number(offset);
	      const percent = Math.floor(count * 100 / totalObjectCount);
	      if (percent !== lastPercent) {
	        if (onProgress) {
	          await onProgress({
	            phase: "Resolving deltas",
	            loaded: count,
	            total: totalObjectCount
	          });
	        }
	      }
	      count++;
	      lastPercent = percent;
	      const o = offsetToObject[offset];
	      if (o.oid) continue;
	      try {
	        p.readDepth = 0;
	        p.externalReadDepth = 0;
	        const { type, object } = await p.readSlice({ start: offset });
	        objectsByDepth[p.readDepth] += 1;
	        const oid = await shasum(GitObject.wrap({ type, object }));
	        o.oid = oid;
	        hashes.push(oid);
	        offsets.set(oid, offset);
	        crcs[oid] = o.crc;
	      } catch (err) {
	        continue;
	      }
	    }
	    hashes.sort();
	    return p;
	  }
	  async toBuffer() {
	    const buffers = [];
	    const write = (str, encoding) => {
	      buffers.push(Buffer.from(str, encoding));
	    };
	    write("ff744f63", "hex");
	    write("00000002", "hex");
	    const fanoutBuffer = new BufferCursor(Buffer.alloc(256 * 4));
	    for (let i = 0; i < 256; i++) {
	      let count = 0;
	      for (const hash of this.hashes) {
	        if (parseInt(hash.slice(0, 2), 16) <= i) count++;
	      }
	      fanoutBuffer.writeUInt32BE(count);
	    }
	    buffers.push(fanoutBuffer.buffer);
	    for (const hash of this.hashes) {
	      write(hash, "hex");
	    }
	    const crcsBuffer = new BufferCursor(Buffer.alloc(this.hashes.length * 4));
	    for (const hash of this.hashes) {
	      crcsBuffer.writeUInt32BE(this.crcs[hash]);
	    }
	    buffers.push(crcsBuffer.buffer);
	    const offsetsBuffer = new BufferCursor(Buffer.alloc(this.hashes.length * 4));
	    for (const hash of this.hashes) {
	      offsetsBuffer.writeUInt32BE(this.offsets.get(hash));
	    }
	    buffers.push(offsetsBuffer.buffer);
	    write(this.packfileSha, "hex");
	    const totalBuffer = Buffer.concat(buffers);
	    const sha = await shasum(totalBuffer);
	    const shaBuffer = Buffer.alloc(20);
	    shaBuffer.write(sha, "hex");
	    return Buffer.concat([totalBuffer, shaBuffer]);
	  }
	  async load({ pack }) {
	    this.pack = pack;
	  }
	  async unload() {
	    this.pack = null;
	  }
	  async read({ oid }) {
	    if (!this.offsets.get(oid)) {
	      if (this.getExternalRefDelta) {
	        this.externalReadDepth++;
	        return this.getExternalRefDelta(oid);
	      } else {
	        throw new InternalError(`Could not read object ${oid} from packfile`);
	      }
	    }
	    const start = this.offsets.get(oid);
	    return this.readSlice({ start });
	  }
	  async readSlice({ start }) {
	    if (this.offsetCache[start]) {
	      return Object.assign({}, this.offsetCache[start]);
	    }
	    this.readDepth++;
	    const types2 = {
	      16: "commit",
	      32: "tree",
	      48: "blob",
	      64: "tag",
	      96: "ofs_delta",
	      112: "ref_delta"
	    };
	    const pack = await this.pack;
	    if (!pack) {
	      throw new InternalError(
	        "Could not read packfile data. The packfile may be missing, corrupted, or too large to read into memory."
	      );
	    }
	    const raw = pack.slice(start);
	    const reader = new BufferCursor(raw);
	    const byte = reader.readUInt8();
	    const btype = byte & 112;
	    let type = types2[btype];
	    if (type === void 0) {
	      throw new InternalError("Unrecognized type: 0b" + btype.toString(2));
	    }
	    const lastFour = byte & 15;
	    let length = lastFour;
	    const multibyte = byte & 128;
	    if (multibyte) {
	      length = otherVarIntDecode(reader, lastFour);
	    }
	    let base = null;
	    let object = null;
	    if (type === "ofs_delta") {
	      const offset = decodeVarInt(reader);
	      const baseOffset = start - offset;
	      ({ object: base, type } = await this.readSlice({ start: baseOffset }));
	    }
	    if (type === "ref_delta") {
	      const oid = reader.slice(20).toString("hex");
	      ({ object: base, type } = await this.read({ oid }));
	    }
	    const buffer = raw.slice(reader.tell());
	    object = Buffer.from(await inflate(buffer));
	    if (object.byteLength !== length) {
	      throw new InternalError(
	        `Packfile told us object would have length ${length} but it had length ${object.byteLength}`
	      );
	    }
	    if (base) {
	      object = Buffer.from(applyDelta(object, base));
	    }
	    if (this.readDepth > 3) {
	      this.offsetCache[start] = { type, object };
	    }
	    return { type, format: "content", object };
	  }
	}
	const PackfileCache = /* @__PURE__ */ Symbol("PackfileCache");
	async function loadPackIndex({
	  fs,
	  filename,
	  getExternalRefDelta,
	  emitter,
	  emitterPrefix
	}) {
	  const idx = await fs.read(filename);
	  return GitPackIndex.fromIdx({ idx, getExternalRefDelta });
	}
	function readPackIndex({
	  fs,
	  cache,
	  filename,
	  getExternalRefDelta,
	  emitter,
	  emitterPrefix
	}) {
	  if (!cache[PackfileCache]) cache[PackfileCache] = /* @__PURE__ */ new Map();
	  let p = cache[PackfileCache].get(filename);
	  if (!p) {
	    p = loadPackIndex({
	      fs,
	      filename,
	      getExternalRefDelta,
	      emitter,
	      emitterPrefix
	    });
	    cache[PackfileCache].set(filename, p);
	  }
	  return p;
	}
	const SHA1_CHUNK_SIZE = 8 * 1024 * 1024;
	async function shasumRange(buffer, { start = 0, end = buffer.length } = {}) {
	  const hash = crypto$1.createHash("sha1");
	  for (let i = start; i < end; i += SHA1_CHUNK_SIZE) {
	    hash.update(buffer.subarray(i, Math.min(i + SHA1_CHUNK_SIZE, end)));
	  }
	  return hash.digest("hex");
	}
	async function readObjectPacked({
	  fs,
	  cache,
	  gitdir,
	  oid,
	  format = "content",
	  getExternalRefDelta
	}) {
	  let list = await fs.readdir(join(gitdir, "objects/pack"));
	  list = list.filter((x) => x.endsWith(".idx"));
	  for (const filename of list) {
	    const indexFile = `${gitdir}/objects/pack/${filename}`;
	    const p = await readPackIndex({
	      fs,
	      cache,
	      filename: indexFile,
	      getExternalRefDelta
	    });
	    if (p.error) throw new InternalError(p.error);
	    if (p.offsets.has(oid)) {
	      const packFile = indexFile.replace(/idx$/, "pack");
	      if (!p.pack) {
	        p.pack = fs.read(packFile);
	      }
	      const pack = await p.pack;
	      if (!pack) {
	        p.pack = null;
	        throw new InternalError(
	          `Could not read packfile at ${packFile}. The file may be missing, corrupted, or too large to read into memory.`
	        );
	      }
	      if (!p._checksumVerified) {
	        const expectedShaFromIndex = p.packfileSha;
	        const packTrailer = pack.subarray(-20);
	        const packTrailerSha = Array.from(packTrailer).map((b) => b.toString(16).padStart(2, "0")).join("");
	        if (packTrailerSha !== expectedShaFromIndex) {
	          throw new InternalError(
	            `Packfile trailer mismatch: expected ${expectedShaFromIndex}, got ${packTrailerSha}. The packfile may be corrupted.`
	          );
	        }
	        const actualPayloadSha = await shasumRange(pack, {
	          start: 0,
	          end: pack.length - 20
	        });
	        if (actualPayloadSha !== expectedShaFromIndex) {
	          throw new InternalError(
	            `Packfile payload corrupted: calculated ${actualPayloadSha} but expected ${expectedShaFromIndex}. The packfile may have been tampered with.`
	          );
	        }
	        p._checksumVerified = true;
	      }
	      const result = await p.read({ oid, getExternalRefDelta });
	      result.format = "content";
	      result.source = `objects/pack/${filename.replace(/idx$/, "pack")}`;
	      return result;
	    }
	  }
	  return null;
	}
	async function _readObject({
	  fs,
	  cache,
	  gitdir,
	  oid,
	  format = "content"
	}) {
	  const getExternalRefDelta = (oid2) => _readObject({ fs, cache, gitdir, oid: oid2 });
	  let result;
	  if (oid === "4b825dc642cb6eb9a060e54bf8d69288fbee4904") {
	    result = { format: "wrapped", object: Buffer.from(`tree 0\0`) };
	  }
	  if (!result) {
	    result = await readObjectLoose({ fs, gitdir, oid });
	  }
	  if (!result) {
	    result = await readObjectPacked({
	      fs,
	      cache,
	      gitdir,
	      oid,
	      getExternalRefDelta
	    });
	    if (!result) {
	      throw new NotFoundError(oid);
	    }
	    return result;
	  }
	  if (format === "deflated") {
	    return result;
	  }
	  if (result.format === "deflated") {
	    result.object = Buffer.from(await inflate(result.object));
	    result.format = "wrapped";
	  }
	  if (format === "wrapped") {
	    return result;
	  }
	  const sha = await shasum(result.object);
	  if (sha !== oid) {
	    throw new InternalError(
	      `SHA check failed! Expected ${oid}, computed ${sha}`
	    );
	  }
	  const { object, type } = GitObject.unwrap(result.object);
	  result.type = type;
	  result.object = object;
	  result.format = "content";
	  if (format === "content") {
	    return result;
	  }
	  throw new InternalError(`invalid requested format "${format}"`);
	}
	class AlreadyExistsError extends BaseError {
	  /**
	   * @param {'note'|'remote'|'tag'|'branch'} noun
	   * @param {string} where
	   * @param {boolean} canForce
	   */
	  constructor(noun, where, canForce = true) {
	    super(
	      `Failed to create ${noun} at ${where} because it already exists.${canForce ? ` (Hint: use 'force: true' parameter to overwrite existing ${noun}.)` : ""}`
	    );
	    this.code = this.name = AlreadyExistsError.code;
	    this.data = { noun, where, canForce };
	  }
	}
	AlreadyExistsError.code = "AlreadyExistsError";
	class AmbiguousError extends BaseError {
	  /**
	   * @param {'oids'|'refs'} nouns
	   * @param {string} short
	   * @param {string[]} matches
	   */
	  constructor(nouns, short, matches) {
	    super(
	      `Found multiple ${nouns} matching "${short}" (${matches.join(
	        ", "
	      )}). Use a longer abbreviation length to disambiguate them.`
	    );
	    this.code = this.name = AmbiguousError.code;
	    this.data = { nouns, short, matches };
	  }
	}
	AmbiguousError.code = "AmbiguousError";
	class CheckoutConflictError extends BaseError {
	  /**
	   * @param {string[]} filepaths
	   */
	  constructor(filepaths) {
	    super(
	      `Your local changes to the following files would be overwritten by checkout: ${filepaths.join(
	        ", "
	      )}`
	    );
	    this.code = this.name = CheckoutConflictError.code;
	    this.data = { filepaths };
	  }
	}
	CheckoutConflictError.code = "CheckoutConflictError";
	class CherryPickMergeCommitError extends BaseError {
	  /**
	   * @param {string} oid
	   * @param {number} parentCount
	   */
	  constructor(oid, parentCount) {
	    super(
	      `Cannot cherry-pick merge commit ${oid}. Merge commits have ${parentCount} parents and require specifying which parent to use as the base.`
	    );
	    this.code = this.name = CherryPickMergeCommitError.code;
	    this.data = { oid, parentCount };
	  }
	}
	CherryPickMergeCommitError.code = "CherryPickMergeCommitError";
	class CherryPickRootCommitError extends BaseError {
	  /**
	   * @param {string} oid
	   */
	  constructor(oid) {
	    super(
	      `Cannot cherry-pick root commit ${oid}. Root commits have no parents.`
	    );
	    this.code = this.name = CherryPickRootCommitError.code;
	    this.data = { oid };
	  }
	}
	CherryPickRootCommitError.code = "CherryPickRootCommitError";
	class CommitNotFetchedError extends BaseError {
	  /**
	   * @param {string} ref
	   * @param {string} oid
	   */
	  constructor(ref, oid) {
	    super(
	      `Failed to checkout "${ref}" because commit ${oid} is not available locally. Do a git fetch to make the branch available locally.`
	    );
	    this.code = this.name = CommitNotFetchedError.code;
	    this.data = { ref, oid };
	  }
	}
	CommitNotFetchedError.code = "CommitNotFetchedError";
	class EmptyServerResponseError extends BaseError {
	  constructor() {
	    super(`Empty response from git server.`);
	    this.code = this.name = EmptyServerResponseError.code;
	    this.data = {};
	  }
	}
	EmptyServerResponseError.code = "EmptyServerResponseError";
	class FastForwardError extends BaseError {
	  constructor() {
	    super(`A simple fast-forward merge was not possible.`);
	    this.code = this.name = FastForwardError.code;
	    this.data = {};
	  }
	}
	FastForwardError.code = "FastForwardError";
	class GitPushError extends BaseError {
	  /**
	   * @param {string} prettyDetails
	   * @param {PushResult} result
	   */
	  constructor(prettyDetails, result) {
	    super(`One or more branches were not updated: ${prettyDetails}`);
	    this.code = this.name = GitPushError.code;
	    this.data = { prettyDetails, result };
	  }
	}
	GitPushError.code = "GitPushError";
	class HttpError extends BaseError {
	  /**
	   * @param {number} statusCode
	   * @param {string} statusMessage
	   * @param {string} response
	   */
	  constructor(statusCode, statusMessage, response) {
	    super(`HTTP Error: ${statusCode} ${statusMessage}`);
	    this.code = this.name = HttpError.code;
	    this.data = { statusCode, statusMessage, response };
	  }
	}
	HttpError.code = "HttpError";
	class InvalidFilepathError extends BaseError {
	  /**
	   * @param {'leading-slash'|'trailing-slash'|'directory'} [reason]
	   */
	  constructor(reason) {
	    let message = "invalid filepath";
	    if (reason === "leading-slash" || reason === "trailing-slash") {
	      message = `"filepath" parameter should not include leading or trailing directory separators because these can cause problems on some platforms.`;
	    } else if (reason === "directory") {
	      message = `"filepath" should not be a directory.`;
	    }
	    super(message);
	    this.code = this.name = InvalidFilepathError.code;
	    this.data = { reason };
	  }
	}
	InvalidFilepathError.code = "InvalidFilepathError";
	class InvalidRefNameError extends BaseError {
	  /**
	   * @param {string} ref
	   * @param {string} suggestion
	   * @param {boolean} canForce
	   */
	  constructor(ref, suggestion) {
	    super(
	      `"${ref}" would be an invalid git reference. (Hint: a valid alternative would be "${suggestion}".)`
	    );
	    this.code = this.name = InvalidRefNameError.code;
	    this.data = { ref, suggestion };
	  }
	}
	InvalidRefNameError.code = "InvalidRefNameError";
	class MaxDepthError extends BaseError {
	  /**
	   * @param {number} depth
	   */
	  constructor(depth) {
	    super(`Maximum search depth of ${depth} exceeded.`);
	    this.code = this.name = MaxDepthError.code;
	    this.data = { depth };
	  }
	}
	MaxDepthError.code = "MaxDepthError";
	class MergeNotSupportedError extends BaseError {
	  constructor() {
	    super(`Merges with conflicts are not supported yet.`);
	    this.code = this.name = MergeNotSupportedError.code;
	    this.data = {};
	  }
	}
	MergeNotSupportedError.code = "MergeNotSupportedError";
	class MergeConflictError extends BaseError {
	  /**
	   * @param {Array<string>} filepaths
	   * @param {Array<string>} bothModified
	   * @param {Array<string>} deleteByUs
	   * @param {Array<string>} deleteByTheirs
	   */
	  constructor(filepaths, bothModified, deleteByUs, deleteByTheirs) {
	    super(
	      `Automatic merge failed with one or more merge conflicts in the following files: ${filepaths.toString()}. Fix conflicts then commit the result.`
	    );
	    this.code = this.name = MergeConflictError.code;
	    this.data = { filepaths, bothModified, deleteByUs, deleteByTheirs };
	  }
	}
	MergeConflictError.code = "MergeConflictError";
	class MissingNameError extends BaseError {
	  /**
	   * @param {'author'|'committer'|'tagger'} role
	   */
	  constructor(role) {
	    super(
	      `No name was provided for ${role} in the argument or in the .git/config file.`
	    );
	    this.code = this.name = MissingNameError.code;
	    this.data = { role };
	  }
	}
	MissingNameError.code = "MissingNameError";
	class MissingParameterError extends BaseError {
	  /**
	   * @param {string} parameter
	   */
	  constructor(parameter) {
	    super(
	      `The function requires a "${parameter}" parameter but none was provided.`
	    );
	    this.code = this.name = MissingParameterError.code;
	    this.data = { parameter };
	  }
	}
	MissingParameterError.code = "MissingParameterError";
	class MultipleGitError extends BaseError {
	  /**
	   * @param {Error[]} errors
	   * @param {string} message
	   */
	  constructor(errors) {
	    super(
	      `There are multiple errors that were thrown by the method. Please refer to the "errors" property to see more`
	    );
	    this.code = this.name = MultipleGitError.code;
	    this.data = { errors };
	    this.errors = errors;
	  }
	}
	MultipleGitError.code = "MultipleGitError";
	class ParseError extends BaseError {
	  /**
	   * @param {string} expected
	   * @param {string} actual
	   */
	  constructor(expected, actual) {
	    super(`Expected "${expected}" but received "${actual}".`);
	    this.code = this.name = ParseError.code;
	    this.data = { expected, actual };
	  }
	}
	ParseError.code = "ParseError";
	class PushRejectedError extends BaseError {
	  /**
	   * @param {'not-fast-forward'|'tag-exists'} reason
	   */
	  constructor(reason) {
	    let message = "";
	    if (reason === "not-fast-forward") {
	      message = " because it was not a simple fast-forward";
	    } else if (reason === "tag-exists") {
	      message = " because tag already exists";
	    }
	    super(`Push rejected${message}. Use "force: true" to override.`);
	    this.code = this.name = PushRejectedError.code;
	    this.data = { reason };
	  }
	}
	PushRejectedError.code = "PushRejectedError";
	class RemoteCapabilityError extends BaseError {
	  /**
	   * @param {'shallow'|'deepen-since'|'deepen-not'|'deepen-relative'} capability
	   * @param {'depth'|'since'|'exclude'|'relative'} parameter
	   */
	  constructor(capability, parameter) {
	    super(
	      `Remote does not support the "${capability}" so the "${parameter}" parameter cannot be used.`
	    );
	    this.code = this.name = RemoteCapabilityError.code;
	    this.data = { capability, parameter };
	  }
	}
	RemoteCapabilityError.code = "RemoteCapabilityError";
	class SmartHttpError extends BaseError {
	  /**
	   * @param {string} preview
	   * @param {string} response
	   */
	  constructor(preview, response) {
	    super(
	      `Remote did not reply using the "smart" HTTP protocol. Expected "001e# service=git-upload-pack" but received: ${preview}`
	    );
	    this.code = this.name = SmartHttpError.code;
	    this.data = { preview, response };
	  }
	}
	SmartHttpError.code = "SmartHttpError";
	class UnknownTransportError extends BaseError {
	  /**
	   * @param {string} url
	   * @param {string} transport
	   * @param {string} [suggestion]
	   */
	  constructor(url, transport, suggestion) {
	    super(
	      `Git remote "${url}" uses an unrecognized transport protocol: "${transport}"`
	    );
	    this.code = this.name = UnknownTransportError.code;
	    this.data = { url, transport, suggestion };
	  }
	}
	UnknownTransportError.code = "UnknownTransportError";
	class UrlParseError extends BaseError {
	  /**
	   * @param {string} url
	   */
	  constructor(url) {
	    super(`Cannot parse remote URL: "${url}"`);
	    this.code = this.name = UrlParseError.code;
	    this.data = { url };
	  }
	}
	UrlParseError.code = "UrlParseError";
	class UserCanceledError extends BaseError {
	  constructor() {
	    super(`The operation was canceled.`);
	    this.code = this.name = UserCanceledError.code;
	    this.data = {};
	  }
	}
	UserCanceledError.code = "UserCanceledError";
	class IndexResetError extends BaseError {
	  /**
	   * @param {Array<string>} filepaths
	   */
	  constructor(filepath) {
	    super(
	      `Could not merge index: Entry for '${filepath}' is not up to date. Either reset the index entry to HEAD, or stage your unstaged changes.`
	    );
	    this.code = this.name = IndexResetError.code;
	    this.data = { filepath };
	  }
	}
	IndexResetError.code = "IndexResetError";
	class NoCommitError extends BaseError {
	  /**
	   * @param {string} ref
	   */
	  constructor(ref) {
	    super(
	      `"${ref}" does not point to any commit. You're maybe working on a repository with no commits yet. `
	    );
	    this.code = this.name = NoCommitError.code;
	    this.data = { ref };
	  }
	}
	NoCommitError.code = "NoCommitError";
	var Errors = /* @__PURE__ */ Object.freeze({
	  __proto__: null,
	  AlreadyExistsError,
	  AmbiguousError,
	  CheckoutConflictError,
	  CherryPickMergeCommitError,
	  CherryPickRootCommitError,
	  CommitNotFetchedError,
	  EmptyServerResponseError,
	  FastForwardError,
	  GitPushError,
	  HttpError,
	  InternalError,
	  InvalidFilepathError,
	  InvalidOidError,
	  InvalidRefNameError,
	  MaxDepthError,
	  MergeNotSupportedError,
	  MergeConflictError,
	  MissingNameError,
	  MissingParameterError,
	  MultipleGitError,
	  NoRefspecError,
	  NotFoundError,
	  ObjectTypeError,
	  ParseError,
	  PushRejectedError,
	  RemoteCapabilityError,
	  SmartHttpError,
	  UnknownTransportError,
	  UnsafeFilepathError,
	  UrlParseError,
	  UserCanceledError,
	  UnmergedPathsError,
	  IndexResetError,
	  NoCommitError
	});
	function formatAuthor({ name, email, timestamp, timezoneOffset }) {
	  timezoneOffset = formatTimezoneOffset(timezoneOffset);
	  return `${name} <${email}> ${timestamp} ${timezoneOffset}`;
	}
	function formatTimezoneOffset(minutes) {
	  const sign = simpleSign(negateExceptForZero(minutes));
	  minutes = Math.abs(minutes);
	  const hours = Math.floor(minutes / 60);
	  minutes -= hours * 60;
	  let strHours = String(hours);
	  let strMinutes = String(minutes);
	  if (strHours.length < 2) strHours = "0" + strHours;
	  if (strMinutes.length < 2) strMinutes = "0" + strMinutes;
	  return (sign === -1 ? "-" : "+") + strHours + strMinutes;
	}
	function simpleSign(n) {
	  return Math.sign(n) || (Object.is(n, -0) ? -1 : 1);
	}
	function negateExceptForZero(n) {
	  return n === 0 ? n : -n;
	}
	function normalizeNewlines(str) {
	  str = str.replace(/\r/g, "");
	  str = str.replace(/^\n+/, "");
	  str = str.replace(/\n+$/, "") + "\n";
	  return str;
	}
	function parseAuthor(author) {
	  const [, name, email, timestamp, offset] = author.match(
	    /^(.*) <(.*)> (.*) (.*)$/
	  );
	  return {
	    name,
	    email,
	    timestamp: Number(timestamp),
	    timezoneOffset: parseTimezoneOffset(offset)
	  };
	}
	function parseTimezoneOffset(offset) {
	  let [, sign, hours, minutes] = offset.match(/(\+|-)(\d\d)(\d\d)/);
	  minutes = (sign === "+" ? 1 : -1) * (Number(hours) * 60 + Number(minutes));
	  return negateExceptForZero$1(minutes);
	}
	function negateExceptForZero$1(n) {
	  return n === 0 ? n : -n;
	}
	class GitAnnotatedTag {
	  constructor(tag2) {
	    if (typeof tag2 === "string") {
	      this._tag = tag2;
	    } else if (Buffer.isBuffer(tag2)) {
	      this._tag = tag2.toString("utf8");
	    } else if (typeof tag2 === "object") {
	      this._tag = GitAnnotatedTag.render(tag2);
	    } else {
	      throw new InternalError(
	        "invalid type passed to GitAnnotatedTag constructor"
	      );
	    }
	  }
	  static from(tag2) {
	    return new GitAnnotatedTag(tag2);
	  }
	  static render(obj) {
	    return `object ${obj.object}
type ${obj.type}
tag ${obj.tag}
tagger ${formatAuthor(obj.tagger)}

${obj.message}
${obj.gpgsig ? obj.gpgsig : ""}`;
	  }
	  justHeaders() {
	    return this._tag.slice(0, this._tag.indexOf("\n\n"));
	  }
	  message() {
	    const tag2 = this.withoutSignature();
	    return tag2.slice(tag2.indexOf("\n\n") + 2);
	  }
	  parse() {
	    return Object.assign(this.headers(), {
	      message: this.message(),
	      gpgsig: this.gpgsig()
	    });
	  }
	  render() {
	    return this._tag;
	  }
	  headers() {
	    const headers = this.justHeaders().split("\n");
	    const hs = [];
	    for (const h of headers) {
	      if (h[0] === " ") {
	        hs[hs.length - 1] += "\n" + h.slice(1);
	      } else {
	        hs.push(h);
	      }
	    }
	    const obj = {};
	    for (const h of hs) {
	      const key = h.slice(0, h.indexOf(" "));
	      const value = h.slice(h.indexOf(" ") + 1);
	      if (Array.isArray(obj[key])) {
	        obj[key].push(value);
	      } else {
	        obj[key] = value;
	      }
	    }
	    if (obj.tagger) {
	      obj.tagger = parseAuthor(obj.tagger);
	    }
	    if (obj.committer) {
	      obj.committer = parseAuthor(obj.committer);
	    }
	    return obj;
	  }
	  withoutSignature() {
	    const tag2 = normalizeNewlines(this._tag);
	    if (tag2.indexOf("\n-----BEGIN PGP SIGNATURE-----") === -1) return tag2;
	    return tag2.slice(0, tag2.lastIndexOf("\n-----BEGIN PGP SIGNATURE-----"));
	  }
	  gpgsig() {
	    if (this._tag.indexOf("\n-----BEGIN PGP SIGNATURE-----") === -1) return;
	    const signature = this._tag.slice(
	      this._tag.indexOf("-----BEGIN PGP SIGNATURE-----"),
	      this._tag.indexOf("-----END PGP SIGNATURE-----") + "-----END PGP SIGNATURE-----".length
	    );
	    return normalizeNewlines(signature);
	  }
	  payload() {
	    return this.withoutSignature() + "\n";
	  }
	  toObject() {
	    return Buffer.from(this._tag, "utf8");
	  }
	  static async sign(tag2, sign, secretKey) {
	    const payload = tag2.payload();
	    let { signature } = await sign({ payload, secretKey });
	    signature = normalizeNewlines(signature);
	    const signedTag = payload + signature;
	    return GitAnnotatedTag.from(signedTag);
	  }
	}
	function indent(str) {
	  return str.trim().split("\n").map((x) => " " + x).join("\n") + "\n";
	}
	function outdent(str) {
	  return str.split("\n").map((x) => x.replace(/^ /, "")).join("\n");
	}
	class GitCommit {
	  constructor(commit2) {
	    if (typeof commit2 === "string") {
	      this._commit = commit2;
	    } else if (Buffer.isBuffer(commit2)) {
	      this._commit = commit2.toString("utf8");
	    } else if (typeof commit2 === "object") {
	      this._commit = GitCommit.render(commit2);
	    } else {
	      throw new InternalError("invalid type passed to GitCommit constructor");
	    }
	  }
	  static fromPayloadSignature({ payload, signature }) {
	    const headers = GitCommit.justHeaders(payload);
	    const message = GitCommit.justMessage(payload);
	    const commit2 = normalizeNewlines(
	      headers + "\ngpgsig" + indent(signature) + "\n" + message
	    );
	    return new GitCommit(commit2);
	  }
	  static from(commit2) {
	    return new GitCommit(commit2);
	  }
	  toObject() {
	    return Buffer.from(this._commit, "utf8");
	  }
	  // Todo: allow setting the headers and message
	  headers() {
	    return this.parseHeaders();
	  }
	  // Todo: allow setting the headers and message
	  message() {
	    return GitCommit.justMessage(this._commit);
	  }
	  parse() {
	    return Object.assign({ message: this.message() }, this.headers());
	  }
	  static justMessage(commit2) {
	    return normalizeNewlines(commit2.slice(commit2.indexOf("\n\n") + 2));
	  }
	  static justHeaders(commit2) {
	    return commit2.slice(0, commit2.indexOf("\n\n"));
	  }
	  parseHeaders() {
	    const headers = GitCommit.justHeaders(this._commit).split("\n");
	    const hs = [];
	    for (const h of headers) {
	      if (h[0] === " ") {
	        hs[hs.length - 1] += "\n" + h.slice(1);
	      } else {
	        hs.push(h);
	      }
	    }
	    const obj = {
	      parent: []
	    };
	    for (const h of hs) {
	      const key = h.slice(0, h.indexOf(" "));
	      const value = h.slice(h.indexOf(" ") + 1);
	      if (Array.isArray(obj[key])) {
	        obj[key].push(value);
	      } else {
	        obj[key] = value;
	      }
	    }
	    if (obj.author) {
	      obj.author = parseAuthor(obj.author);
	    }
	    if (obj.committer) {
	      obj.committer = parseAuthor(obj.committer);
	    }
	    return obj;
	  }
	  static renderHeaders(obj) {
	    let headers = "";
	    if (obj.tree) {
	      headers += `tree ${obj.tree}
`;
	    } else {
	      headers += `tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
`;
	    }
	    if (obj.parent) {
	      if (obj.parent.length === void 0) {
	        throw new InternalError(`commit 'parent' property should be an array`);
	      }
	      for (const p of obj.parent) {
	        headers += `parent ${p}
`;
	      }
	    }
	    const author = obj.author;
	    headers += `author ${formatAuthor(author)}
`;
	    const committer = obj.committer || obj.author;
	    headers += `committer ${formatAuthor(committer)}
`;
	    if (obj.gpgsig) {
	      headers += "gpgsig" + indent(obj.gpgsig);
	    }
	    return headers;
	  }
	  static render(obj) {
	    return GitCommit.renderHeaders(obj) + "\n" + normalizeNewlines(obj.message);
	  }
	  render() {
	    return this._commit;
	  }
	  withoutSignature() {
	    const commit2 = normalizeNewlines(this._commit);
	    if (commit2.indexOf("\ngpgsig") === -1) return commit2;
	    const headers = commit2.slice(0, commit2.indexOf("\ngpgsig"));
	    const message = commit2.slice(
	      commit2.indexOf("-----END PGP SIGNATURE-----\n") + "-----END PGP SIGNATURE-----\n".length
	    );
	    return normalizeNewlines(headers + "\n" + message);
	  }
	  isolateSignature() {
	    const signature = this._commit.slice(
	      this._commit.indexOf("-----BEGIN PGP SIGNATURE-----"),
	      this._commit.indexOf("-----END PGP SIGNATURE-----") + "-----END PGP SIGNATURE-----".length
	    );
	    return outdent(signature);
	  }
	  static async sign(commit2, sign, secretKey) {
	    const payload = commit2.withoutSignature();
	    const message = GitCommit.justMessage(commit2._commit);
	    let { signature } = await sign({ payload, secretKey });
	    signature = normalizeNewlines(signature);
	    const headers = GitCommit.justHeaders(commit2._commit);
	    const signedCommit = headers + "\ngpgsig" + indent(signature) + "\n" + message;
	    return GitCommit.from(signedCommit);
	  }
	}
	async function resolveTree({ fs, cache, gitdir, oid }) {
	  if (oid === "4b825dc642cb6eb9a060e54bf8d69288fbee4904") {
	    return { tree: GitTree.from([]), oid };
	  }
	  const { type, object } = await _readObject({ fs, cache, gitdir, oid });
	  if (type === "tag") {
	    oid = GitAnnotatedTag.from(object).parse().object;
	    return resolveTree({ fs, cache, gitdir, oid });
	  }
	  if (type === "commit") {
	    oid = GitCommit.from(object).parse().tree;
	    return resolveTree({ fs, cache, gitdir, oid });
	  }
	  if (type !== "tree") {
	    throw new ObjectTypeError(oid, type, "tree");
	  }
	  return { tree: GitTree.from(object), oid };
	}
	class GitWalkerRepo {
	  constructor({ fs, gitdir, ref, cache }) {
	    this.fs = fs;
	    this.cache = cache;
	    this.gitdir = gitdir;
	    this.mapPromise = (async () => {
	      const map = /* @__PURE__ */ new Map();
	      let oid;
	      try {
	        oid = await GitRefManager.resolve({ fs, gitdir, ref });
	      } catch (e) {
	        if (e instanceof NotFoundError) {
	          oid = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";
	        }
	      }
	      const tree = await resolveTree({ fs, cache: this.cache, gitdir, oid });
	      tree.type = "tree";
	      tree.mode = "40000";
	      map.set(".", tree);
	      return map;
	    })();
	    const walker = this;
	    this.ConstructEntry = class TreeEntry {
	      constructor(fullpath) {
	        this._fullpath = fullpath;
	        this._type = false;
	        this._mode = false;
	        this._stat = false;
	        this._content = false;
	        this._oid = false;
	      }
	      async type() {
	        return walker.type(this);
	      }
	      async mode() {
	        return walker.mode(this);
	      }
	      async stat() {
	        return walker.stat(this);
	      }
	      async content() {
	        return walker.content(this);
	      }
	      async oid() {
	        return walker.oid(this);
	      }
	    };
	  }
	  async readdir(entry) {
	    const filepath = entry._fullpath;
	    const { fs, cache, gitdir } = this;
	    const map = await this.mapPromise;
	    const obj = map.get(filepath);
	    if (!obj) throw new Error(`No obj for ${filepath}`);
	    const oid = obj.oid;
	    if (!oid) throw new Error(`No oid for obj ${JSON.stringify(obj)}`);
	    if (obj.type !== "tree") {
	      return null;
	    }
	    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
	    if (type !== obj.type) {
	      throw new ObjectTypeError(oid, type, obj.type);
	    }
	    const tree = GitTree.from(object);
	    for (const entry2 of tree) {
	      map.set(join(filepath, entry2.path), entry2);
	    }
	    return tree.entries().map((entry2) => join(filepath, entry2.path));
	  }
	  async type(entry) {
	    if (entry._type === false) {
	      const map = await this.mapPromise;
	      const { type } = map.get(entry._fullpath);
	      entry._type = type;
	    }
	    return entry._type;
	  }
	  async mode(entry) {
	    if (entry._mode === false) {
	      const map = await this.mapPromise;
	      const { mode } = map.get(entry._fullpath);
	      entry._mode = normalizeMode(parseInt(mode, 8));
	    }
	    return entry._mode;
	  }
	  async stat(_entry) {
	  }
	  async content(entry) {
	    if (entry._content === false) {
	      const map = await this.mapPromise;
	      const { fs, cache, gitdir } = this;
	      const obj = map.get(entry._fullpath);
	      const oid = obj.oid;
	      const { type, object } = await _readObject({ fs, cache, gitdir, oid });
	      if (type !== "blob") {
	        entry._content = void 0;
	      } else {
	        entry._content = new Uint8Array(object);
	      }
	    }
	    return entry._content;
	  }
	  async oid(entry) {
	    if (entry._oid === false) {
	      const map = await this.mapPromise;
	      const obj = map.get(entry._fullpath);
	      entry._oid = obj.oid;
	    }
	    return entry._oid;
	  }
	}
	function TREE({ ref = "HEAD" } = {}) {
	  const o = /* @__PURE__ */ Object.create(null);
	  Object.defineProperty(o, GitWalkSymbol, {
	    value: function({ fs, gitdir, cache }) {
	      return new GitWalkerRepo({ fs, gitdir, ref, cache });
	    }
	  });
	  Object.freeze(o);
	  return o;
	}
	class GitWalkerFs {
	  constructor({ fs, dir, gitdir, cache }) {
	    this.fs = fs;
	    this.cache = cache;
	    this.dir = dir;
	    this.gitdir = gitdir;
	    this.config = null;
	    const walker = this;
	    this.ConstructEntry = class WorkdirEntry {
	      constructor(fullpath) {
	        this._fullpath = fullpath;
	        this._type = false;
	        this._mode = false;
	        this._stat = false;
	        this._content = false;
	        this._oid = false;
	      }
	      async type() {
	        return walker.type(this);
	      }
	      async mode() {
	        return walker.mode(this);
	      }
	      async stat() {
	        return walker.stat(this);
	      }
	      async content() {
	        return walker.content(this);
	      }
	      async oid() {
	        return walker.oid(this);
	      }
	    };
	  }
	  async readdir(entry) {
	    const filepath = entry._fullpath;
	    const { fs, dir } = this;
	    const names = await fs.readdir(join(dir, filepath));
	    if (names === null) return null;
	    return names.map((name) => join(filepath, name));
	  }
	  async type(entry) {
	    if (entry._type === false) {
	      await entry.stat();
	    }
	    return entry._type;
	  }
	  async mode(entry) {
	    if (entry._mode === false) {
	      await entry.stat();
	    }
	    return entry._mode;
	  }
	  async stat(entry) {
	    if (entry._stat === false) {
	      const { fs, dir } = this;
	      let stat = await fs.lstat(`${dir}/${entry._fullpath}`);
	      if (!stat) {
	        throw new Error(
	          `ENOENT: no such file or directory, lstat '${entry._fullpath}'`
	        );
	      }
	      let type = stat.isDirectory() ? "tree" : "blob";
	      if (type === "blob" && !stat.isFile() && !stat.isSymbolicLink()) {
	        type = "special";
	      }
	      entry._type = type;
	      stat = normalizeStats(stat);
	      entry._mode = stat.mode;
	      if (stat.size === -1 && entry._actualSize) {
	        stat.size = entry._actualSize;
	      }
	      entry._stat = stat;
	    }
	    return entry._stat;
	  }
	  async content(entry) {
	    if (entry._content === false) {
	      const { fs, dir, gitdir } = this;
	      if (await entry.type() === "tree") {
	        entry._content = void 0;
	      } else {
	        let content;
	        if (await entry.mode() >> 12 === 10) {
	          content = await fs.readlink(`${dir}/${entry._fullpath}`);
	        } else {
	          const config = await this._getGitConfig(fs, gitdir);
	          const autocrlf = await config.get("core.autocrlf");
	          content = await fs.read(`${dir}/${entry._fullpath}`, { autocrlf });
	        }
	        entry._actualSize = content.length;
	        if (entry._stat && entry._stat.size === -1) {
	          entry._stat.size = entry._actualSize;
	        }
	        entry._content = new Uint8Array(content);
	      }
	    }
	    return entry._content;
	  }
	  async oid(entry) {
	    if (entry._oid === false) {
	      const self = this;
	      const { fs, gitdir, cache } = this;
	      let oid;
	      await GitIndexManager.acquire(
	        { fs, gitdir, cache },
	        async function(index2) {
	          const stage = index2.entriesMap.get(entry._fullpath);
	          const stats = await entry.stat();
	          const config = await self._getGitConfig(fs, gitdir);
	          const filemode = await config.get("core.filemode");
	          const trustino = typeof process !== "undefined" ? !(process.platform === "win32") : true;
	          if (!stage || compareStats(stats, stage, filemode, trustino)) {
	            const content = await entry.content();
	            if (content === void 0) {
	              oid = void 0;
	            } else {
	              oid = await shasum(
	                GitObject.wrap({ type: "blob", object: content })
	              );
	              if (stage && oid === stage.oid && (!filemode || stats.mode === stage.mode) && compareStats(stats, stage, filemode, trustino)) {
	                index2.insert({
	                  filepath: entry._fullpath,
	                  stats,
	                  oid
	                });
	              }
	            }
	          } else {
	            oid = stage.oid;
	          }
	        }
	      );
	      entry._oid = oid;
	    }
	    return entry._oid;
	  }
	  async _getGitConfig(fs, gitdir) {
	    if (this.config) {
	      return this.config;
	    }
	    this.config = await GitConfigManager.get({ fs, gitdir });
	    return this.config;
	  }
	}
	function WORKDIR() {
	  const o = /* @__PURE__ */ Object.create(null);
	  Object.defineProperty(o, GitWalkSymbol, {
	    value: function({ fs, dir, gitdir, cache }) {
	      return new GitWalkerFs({ fs, dir, gitdir, cache });
	    }
	  });
	  Object.freeze(o);
	  return o;
	}
	function arrayRange(start, end) {
	  const length = end - start;
	  return Array.from({ length }, (_, i) => start + i);
	}
	const flat = typeof Array.prototype.flat === "undefined" ? (entries) => entries.reduce((acc, x) => acc.concat(x), []) : (entries) => entries.flat();
	class RunningMinimum {
	  constructor() {
	    this.value = null;
	  }
	  consider(value) {
	    if (value === null || value === void 0) return;
	    if (this.value === null) {
	      this.value = value;
	    } else if (value < this.value) {
	      this.value = value;
	    }
	  }
	  reset() {
	    this.value = null;
	  }
	}
	function* unionOfIterators(sets) {
	  const min = new RunningMinimum();
	  let minimum;
	  const heads = [];
	  const numsets = sets.length;
	  for (let i = 0; i < numsets; i++) {
	    heads[i] = sets[i].next().value;
	    if (heads[i] !== void 0) {
	      min.consider(heads[i]);
	    }
	  }
	  if (min.value === null) return;
	  while (true) {
	    const result = [];
	    minimum = min.value;
	    min.reset();
	    for (let i = 0; i < numsets; i++) {
	      if (heads[i] !== void 0 && heads[i] === minimum) {
	        result[i] = heads[i];
	        heads[i] = sets[i].next().value;
	      } else {
	        result[i] = null;
	      }
	      if (heads[i] !== void 0) {
	        min.consider(heads[i]);
	      }
	    }
	    yield result;
	    if (min.value === null) return;
	  }
	}
	async function _walk({
	  fs,
	  cache,
	  dir,
	  gitdir,
	  trees,
	  // @ts-ignore
	  map = async (_, entry) => entry,
	  // The default reducer is a flatmap that filters out undefineds.
	  reduce = async (parent, children) => {
	    const flatten = flat(children);
	    if (parent !== void 0) flatten.unshift(parent);
	    return flatten;
	  },
	  // The default iterate function walks all children concurrently
	  iterate = (walk2, children) => Promise.all([...children].map(walk2))
	}) {
	  const walkers = trees.map(
	    (proxy) => proxy[GitWalkSymbol]({ fs, dir, gitdir, cache })
	  );
	  const root = new Array(walkers.length).fill(".");
	  const range = arrayRange(0, walkers.length);
	  const unionWalkerFromReaddir = async (entries) => {
	    range.forEach((i) => {
	      const entry = entries[i];
	      entries[i] = entry && new walkers[i].ConstructEntry(entry);
	    });
	    const subdirs = await Promise.all(
	      range.map((i) => {
	        const entry = entries[i];
	        return entry ? walkers[i].readdir(entry) : [];
	      })
	    );
	    const iterators = subdirs.map((array) => {
	      return (array === null ? [] : array)[Symbol.iterator]();
	    });
	    return {
	      entries,
	      children: unionOfIterators(iterators)
	    };
	  };
	  const walk2 = async (root2) => {
	    const { entries, children } = await unionWalkerFromReaddir(root2);
	    const fullpath = entries.find((entry) => entry && entry._fullpath)._fullpath;
	    const parent = await map(fullpath, entries);
	    if (parent !== null) {
	      let walkedChildren = await iterate(walk2, children);
	      walkedChildren = walkedChildren.filter((x) => x !== void 0);
	      return reduce(parent, walkedChildren);
	    }
	  };
	  return walk2(root);
	}
	async function rmRecursive(fs, filepath) {
	  const entries = await fs.readdir(filepath);
	  if (entries == null) {
	    await fs.rm(filepath);
	  } else if (entries.length) {
	    await Promise.all(
	      entries.map((entry) => {
	        const subpath = join(filepath, entry);
	        return fs.lstat(subpath).then((stat) => {
	          if (!stat) return;
	          return stat.isDirectory() ? rmRecursive(fs, subpath) : fs.rm(subpath);
	        });
	      })
	    ).then(() => fs.rmdir(filepath));
	  } else {
	    await fs.rmdir(filepath);
	  }
	}
	function isPromiseLike(obj) {
	  return isObject(obj) && isFunction(obj.then) && isFunction(obj.catch);
	}
	function isObject(obj) {
	  return obj && typeof obj === "object";
	}
	function isFunction(obj) {
	  return typeof obj === "function";
	}
	function isPromiseFs(fs) {
	  const test = (targetFs) => {
	    try {
	      return targetFs.readFile().catch((e) => e);
	    } catch (e) {
	      return e;
	    }
	  };
	  return isPromiseLike(test(fs));
	}
	const commands = [
	  "readFile",
	  "writeFile",
	  "mkdir",
	  "rmdir",
	  "unlink",
	  "stat",
	  "lstat",
	  "readdir",
	  "readlink",
	  "symlink"
	];
	function bindFs(target, fs) {
	  if (isPromiseFs(fs)) {
	    for (const command of commands) {
	      target[`_${command}`] = fs[command].bind(fs);
	    }
	  } else {
	    for (const command of commands) {
	      target[`_${command}`] = pify(fs[command].bind(fs));
	    }
	  }
	  if (isPromiseFs(fs)) {
	    if (fs.cp) target._cp = fs.cp.bind(fs);
	    if (fs.rm) target._rm = fs.rm.bind(fs);
	    else if (fs.rmdir.length > 1) target._rm = fs.rmdir.bind(fs);
	    else target._rm = rmRecursive.bind(null, target);
	  } else {
	    if (fs.cp) target._cp = pify(fs.cp.bind(fs));
	    if (fs.rm) target._rm = pify(fs.rm.bind(fs));
	    else if (fs.rmdir.length > 2) target._rm = pify(fs.rmdir.bind(fs));
	    else target._rm = rmRecursive.bind(null, target);
	  }
	}
	class FileSystem {
	  /**
	   * Creates an instance of FileSystem.
	   *
	   * @param {Object} fs - A file system implementation to wrap.
	   */
	  constructor(fs) {
	    if (typeof fs._original_unwrapped_fs !== "undefined") return fs;
	    const promises = Object.getOwnPropertyDescriptor(fs, "promises");
	    if (promises && promises.enumerable) {
	      bindFs(this, fs.promises);
	    } else {
	      bindFs(this, fs);
	    }
	    this._original_unwrapped_fs = fs;
	  }
	  /**
	   * Return true if a file exists, false if it doesn't exist.
	   * Rethrows errors that aren't related to file existence.
	   *
	   * @param {string} filepath - The path to the file.
	   * @param {Object} [options] - Additional options.
	   * @returns {Promise<boolean>} - `true` if the file exists, `false` otherwise.
	   */
	  async exists(filepath, options = {}) {
	    try {
	      await this._stat(filepath);
	      return true;
	    } catch (err) {
	      if (err.code === "ENOENT" || err.code === "ENOTDIR" || (err.code || "").includes("ENS")) {
	        return false;
	      } else {
	        console.log('Unhandled error in "FileSystem.exists()" function', err);
	        throw err;
	      }
	    }
	  }
	  /**
	   * Return the contents of a file if it exists, otherwise returns null.
	   *
	   * @param {string} filepath - The path to the file.
	   * @param {Object} [options] - Options for reading the file.
	   * @returns {Promise<Buffer|string|null>} - The file contents, or `null` if the file doesn't exist.
	   */
	  async read(filepath, options = {}) {
	    try {
	      let buffer = await this._readFile(filepath, options);
	      if (options.autocrlf === "true") {
	        try {
	          buffer = new TextDecoder("utf8", { fatal: true }).decode(buffer);
	          buffer = buffer.replace(/\r\n/g, "\n");
	          buffer = new TextEncoder().encode(buffer);
	        } catch (error) {
	        }
	      }
	      if (typeof buffer !== "string") {
	        buffer = Buffer.from(buffer);
	      }
	      return buffer;
	    } catch (err) {
	      return null;
	    }
	  }
	  /**
	   * Write a file (creating missing directories if need be) without throwing errors.
	   *
	   * @param {string} filepath - The path to the file.
	   * @param {Buffer|Uint8Array|string} contents - The data to write.
	   * @param {Object|string} [options] - Options for writing the file.
	   * @returns {Promise<void>}
	   */
	  async write(filepath, contents, options = {}) {
	    try {
	      await this._writeFile(filepath, contents, options);
	    } catch (err) {
	      await this.mkdir(dirname(filepath));
	      await this._writeFile(filepath, contents, options);
	    }
	  }
	  /**
	   * Make a directory (or series of nested directories) without throwing an error if it already exists.
	   *
	   * @param {string} filepath - The path to the directory.
	   * @param {boolean} [_selfCall=false] - Internal flag to prevent infinite recursion.
	   * @returns {Promise<void>}
	   */
	  async mkdir(filepath, _selfCall = false) {
	    try {
	      await this._mkdir(filepath);
	    } catch (err) {
	      if (err === null) return;
	      if (err.code === "EEXIST") return;
	      if (_selfCall) throw err;
	      if (err.code === "ENOENT") {
	        const parent = dirname(filepath);
	        if (parent === "." || parent === "/" || parent === filepath) throw err;
	        await this.mkdir(parent);
	        await this.mkdir(filepath, true);
	      }
	    }
	  }
	  /**
	   * Delete a file without throwing an error if it is already deleted.
	   *
	   * @param {string} filepath - The path to the file.
	   * @returns {Promise<void>}
	   */
	  async rm(filepath) {
	    try {
	      await this._unlink(filepath);
	    } catch (err) {
	      if (err.code !== "ENOENT") throw err;
	    }
	  }
	  /**
	   * Delete a directory without throwing an error if it is already deleted.
	   *
	   * @param {string} filepath - The path to the directory.
	   * @param {Object} [opts] - Options for deleting the directory.
	   * @returns {Promise<void>}
	   */
	  async rmdir(filepath, opts) {
	    try {
	      if (opts && opts.recursive) {
	        await this._rm(filepath, opts);
	      } else {
	        await this._rmdir(filepath);
	      }
	    } catch (err) {
	      if (err.code !== "ENOENT") throw err;
	    }
	  }
	  /**
	   * Read a directory without throwing an error is the directory doesn't exist
	   *
	   * @param {string} filepath - The path to the directory.
	   * @returns {Promise<string[]|null>} - An array of file names, or `null` if the path is not a directory.
	   */
	  async readdir(filepath) {
	    try {
	      const names = await this._readdir(filepath);
	      names.sort(compareStrings);
	      return names;
	    } catch (err) {
	      if (err.code === "ENOTDIR") return null;
	      return [];
	    }
	  }
	  /**
	   * Return a flat list of all the files nested inside a directory
	   *
	   * Based on an elegant concurrent recursive solution from SO
	   * https://stackoverflow.com/a/45130990/2168416
	   *
	   * @param {string} dir - The directory to read.
	   * @returns {Promise<string[]>} - A flat list of all files in the directory.
	   */
	  async readdirDeep(dir) {
	    const subdirs = await this._readdir(dir);
	    const files = await Promise.all(
	      subdirs.map(async (subdir) => {
	        const res = dir + "/" + subdir;
	        return (await this._stat(res)).isDirectory() ? this.readdirDeep(res) : res;
	      })
	    );
	    return files.reduce((a, f) => a.concat(f), []);
	  }
	  /**
	   * Return the Stats of a file/symlink if it exists, otherwise returns null.
	   * Rethrows errors that aren't related to file existence.
	   *
	   * @param {string} filename - The path to the file or symlink.
	   * @returns {Promise<Object|null>} - The stats object, or `null` if the file doesn't exist.
	   */
	  async lstat(filename) {
	    try {
	      const stats = await this._lstat(filename);
	      return stats;
	    } catch (err) {
	      if (err.code === "ENOENT" || (err.code || "").includes("ENS")) {
	        return null;
	      }
	      throw err;
	    }
	  }
	  /**
	   * Reads the contents of a symlink if it exists, otherwise returns null.
	   * Rethrows errors that aren't related to file existence.
	   *
	   * @param {string} filename - The path to the symlink.
	   * @param {Object} [opts={ encoding: 'buffer' }] - Options for reading the symlink.
	   * @returns {Promise<Buffer|null>} - The symlink target, or `null` if it doesn't exist.
	   */
	  async readlink(filename, opts = { encoding: "buffer" }) {
	    try {
	      const link = await this._readlink(filename, opts);
	      return Buffer.isBuffer(link) ? link : Buffer.from(link);
	    } catch (err) {
	      if (err.code === "ENOENT" || (err.code || "").includes("ENS")) {
	        return null;
	      }
	      throw err;
	    }
	  }
	  /**
	   * Write the contents of buffer to a symlink.
	   *
	   * @param {string} filename - The path to the symlink.
	   * @param {Buffer} buffer - The symlink target.
	   * @returns {Promise<void>}
	   */
	  async writelink(filename, buffer) {
	    return this._symlink(buffer.toString("utf8"), filename);
	  }
	}
	function assertParameter(name, value) {
	  if (value === void 0) {
	    throw new MissingParameterError(name);
	  }
	}
	function isAbsolute(filepath) {
	  return filepath.startsWith("/") || /^[a-zA-Z]:[\\/]/.test(filepath);
	}
	async function discoverGitdir({ fsp, dotgit }) {
	  assertParameter("fsp", fsp);
	  assertParameter("dotgit", dotgit);
	  const dotgitStat = await fsp._stat(dotgit).catch(() => ({ isFile: () => false, isDirectory: () => false }));
	  if (dotgitStat.isDirectory()) {
	    return dotgit;
	  } else if (dotgitStat.isFile()) {
	    return fsp._readFile(dotgit, "utf8").then((contents) => contents.trimRight().substr(8)).then((submoduleGitdir) => {
	      if (isAbsolute(submoduleGitdir)) {
	        return submoduleGitdir;
	      }
	      const gitdir = join(dirname(dotgit), submoduleGitdir);
	      return gitdir;
	    });
	  } else {
	    return dotgit;
	  }
	}
	async function modified(entry, base) {
	  if (!entry && !base) return false;
	  if (entry && !base) return true;
	  if (!entry && base) return true;
	  if (await entry.type() === "tree" && await base.type() === "tree") {
	    return false;
	  }
	  if (await entry.type() === await base.type() && await entry.mode() === await base.mode() && await entry.oid() === await base.oid()) {
	    return false;
	  }
	  return true;
	}
	async function abortMerge({
	  fs: _fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  commit: commit2 = "HEAD",
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("dir", dir);
	    assertParameter("gitdir", gitdir);
	    const fs = new FileSystem(_fs);
	    const trees = [TREE({ ref: commit2 }), WORKDIR(), STAGE()];
	    let unmergedPaths = [];
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    await GitIndexManager.acquire(
	      { fs, gitdir: updatedGitdir, cache },
	      async function(index2) {
	        unmergedPaths = index2.unmergedPaths;
	      }
	    );
	    const results = await _walk({
	      fs,
	      cache,
	      dir,
	      gitdir: updatedGitdir,
	      trees,
	      map: async function(path, [head, workdir, index2]) {
	        const staged = !await modified(workdir, index2);
	        const unmerged = unmergedPaths.includes(path);
	        const unmodified = !await modified(index2, head);
	        if (staged || unmerged) {
	          return head ? {
	            path,
	            mode: await head.mode(),
	            oid: await head.oid(),
	            type: await head.type(),
	            content: await head.content()
	          } : void 0;
	        }
	        if (unmodified) return false;
	        else throw new IndexResetError(path);
	      }
	    });
	    await GitIndexManager.acquire(
	      { fs, gitdir: updatedGitdir, cache },
	      async function(index2) {
	        for (const entry of results) {
	          if (entry === false) continue;
	          if (!entry) {
	            await fs.rmdir(`${dir}/${entry.path}`, { recursive: true });
	            index2.delete({ filepath: entry.path });
	            continue;
	          }
	          if (entry.type === "blob") {
	            const content = new TextDecoder().decode(entry.content);
	            await fs.write(`${dir}/${entry.path}`, content, {
	              mode: entry.mode
	            });
	            index2.insert({
	              filepath: entry.path,
	              oid: entry.oid,
	              stage: 0
	            });
	          }
	        }
	      }
	    );
	  } catch (err) {
	    err.caller = "git.abortMerge";
	    throw err;
	  }
	}
	class GitIgnoreManager {
	  /**
	   * Determines whether a given file is ignored based on `.gitignore` rules and exclusion files.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} args.dir - The working directory.
	   * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @param {string} args.filepath - The path of the file to check.
	   * @returns {Promise<boolean>} - `true` if the file is ignored, `false` otherwise.
	   */
	  static async isIgnored({ fs, dir, gitdir = join(dir, ".git"), filepath }) {
	    if (basename(filepath) === ".git") return true;
	    if (filepath === ".") return false;
	    let excludes = "";
	    const excludesFile = join(gitdir, "info", "exclude");
	    if (await fs.exists(excludesFile)) {
	      excludes = await fs.read(excludesFile, "utf8");
	    }
	    const pairs = [
	      {
	        gitignore: join(dir, ".gitignore"),
	        filepath
	      }
	    ];
	    const pieces = filepath.split("/").filter(Boolean);
	    for (let i = 1; i < pieces.length; i++) {
	      const folder = pieces.slice(0, i).join("/");
	      const file = pieces.slice(i).join("/");
	      pairs.push({
	        gitignore: join(dir, folder, ".gitignore"),
	        filepath: file
	      });
	    }
	    let ignoredStatus = false;
	    for (const p of pairs) {
	      let file;
	      try {
	        file = await fs.read(p.gitignore, "utf8");
	      } catch (err) {
	        if (err.code === "NOENT") continue;
	      }
	      const ign = ignore().add(excludes);
	      ign.add(file);
	      const parentdir = dirname(p.filepath);
	      if (parentdir !== "." && ign.ignores(parentdir)) return true;
	      if (ignoredStatus) {
	        ignoredStatus = !ign.test(p.filepath).unignored;
	      } else {
	        ignoredStatus = ign.test(p.filepath).ignored;
	      }
	    }
	    return ignoredStatus;
	  }
	}
	async function writeObjectLoose({ fs, gitdir, object, format, oid }) {
	  const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
	  const filepath = `${gitdir}/${source}`;
	  if (!await fs.exists(filepath)) await fs.write(filepath, object);
	}
	let supportsCompressionStream = null;
	async function deflate(buffer) {
	  if (supportsCompressionStream === null) {
	    supportsCompressionStream = testCompressionStream();
	  }
	  return supportsCompressionStream ? browserDeflate(buffer) : pako.deflate(buffer);
	}
	async function browserDeflate(buffer) {
	  const cs = new CompressionStream("deflate");
	  const c = new Blob([buffer]).stream().pipeThrough(cs);
	  return new Uint8Array(await new Response(c).arrayBuffer());
	}
	function testCompressionStream() {
	  try {
	    const cs = new CompressionStream("deflate");
	    cs.writable.close();
	    const stream = new Blob([]).stream();
	    stream.cancel();
	    return true;
	  } catch (_) {
	    return false;
	  }
	}
	async function _writeObject({
	  fs,
	  gitdir,
	  type,
	  object,
	  format = "content",
	  oid = void 0,
	  dryRun = false
	}) {
	  if (format !== "deflated") {
	    if (format !== "wrapped") {
	      object = GitObject.wrap({ type, object });
	    }
	    oid = await shasum(object);
	    object = Buffer.from(await deflate(object));
	  }
	  if (!dryRun) {
	    await writeObjectLoose({ fs, gitdir, object, format: "deflated", oid });
	  }
	  return oid;
	}
	function posixifyPathBuffer(buffer) {
	  let idx;
	  while (~(idx = buffer.indexOf(92))) buffer[idx] = 47;
	  return buffer;
	}
	async function add({
	  fs: _fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  filepath,
	  cache = {},
	  force = false,
	  parallel = true
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("dir", dir);
	    assertParameter("gitdir", gitdir);
	    assertParameter("filepath", filepath);
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    await GitIndexManager.acquire(
	      { fs, gitdir: updatedGitdir, cache },
	      async (index2) => {
	        const config = await GitConfigManager.get({ fs, gitdir: updatedGitdir });
	        const autocrlf = await config.get("core.autocrlf");
	        return addToIndex({
	          dir,
	          gitdir: updatedGitdir,
	          fs,
	          filepath,
	          index: index2,
	          force,
	          parallel,
	          autocrlf
	        });
	      }
	    );
	  } catch (err) {
	    err.caller = "git.add";
	    throw err;
	  }
	}
	async function addToIndex({
	  dir,
	  gitdir,
	  fs,
	  filepath,
	  index: index2,
	  force,
	  parallel,
	  autocrlf
	}) {
	  filepath = Array.isArray(filepath) ? filepath : [filepath];
	  const promises = filepath.map(async (currentFilepath) => {
	    if (!force) {
	      const ignored = await GitIgnoreManager.isIgnored({
	        fs,
	        dir,
	        gitdir,
	        filepath: currentFilepath
	      });
	      if (ignored) return;
	    }
	    const stats = await fs.lstat(join(dir, currentFilepath));
	    if (!stats) throw new NotFoundError(currentFilepath);
	    if (stats.isDirectory()) {
	      const children = await fs.readdir(join(dir, currentFilepath));
	      if (parallel) {
	        const promises2 = children.map(
	          (child) => addToIndex({
	            dir,
	            gitdir,
	            fs,
	            filepath: [join(currentFilepath, child)],
	            index: index2,
	            force,
	            parallel,
	            autocrlf
	          })
	        );
	        await Promise.all(promises2);
	      } else {
	        for (const child of children) {
	          await addToIndex({
	            dir,
	            gitdir,
	            fs,
	            filepath: [join(currentFilepath, child)],
	            index: index2,
	            force,
	            parallel,
	            autocrlf
	          });
	        }
	      }
	    } else {
	      const object = stats.isSymbolicLink() ? await fs.readlink(join(dir, currentFilepath)).then(posixifyPathBuffer) : await fs.read(join(dir, currentFilepath), { autocrlf });
	      if (object === null) throw new NotFoundError(currentFilepath);
	      const oid = await _writeObject({ fs, gitdir, type: "blob", object });
	      index2.insert({ filepath: currentFilepath, stats, oid });
	    }
	  });
	  const settledPromises = await Promise.allSettled(promises);
	  const rejectedPromises = settledPromises.filter((settle) => settle.status === "rejected").map((settle) => settle.reason);
	  if (rejectedPromises.length > 1) {
	    throw new MultipleGitError(rejectedPromises);
	  }
	  if (rejectedPromises.length === 1) {
	    throw rejectedPromises[0];
	  }
	  const fulfilledPromises = settledPromises.filter((settle) => settle.status === "fulfilled" && settle.value).map((settle) => settle.value);
	  return fulfilledPromises;
	}
	async function _getConfig({ fs, gitdir, path }) {
	  const config = await GitConfigManager.get({ fs, gitdir });
	  return config.get(path);
	}
	function assignDefined(target, ...sources) {
	  for (const source of sources) {
	    if (source) {
	      for (const key of Object.keys(source)) {
	        const val = source[key];
	        if (val !== void 0) {
	          target[key] = val;
	        }
	      }
	    }
	  }
	  return target;
	}
	async function normalizeAuthorObject({ fs, gitdir, author, commit: commit2 }) {
	  const timestamp = Math.floor(Date.now() / 1e3);
	  const defaultAuthor = {
	    name: await _getConfig({ fs, gitdir, path: "user.name" }),
	    email: await _getConfig({ fs, gitdir, path: "user.email" }) || "",
	    // author.email is allowed to be empty string
	    timestamp,
	    timezoneOffset: new Date(timestamp * 1e3).getTimezoneOffset()
	  };
	  const normalizedAuthor = assignDefined(
	    {},
	    defaultAuthor,
	    commit2 ? commit2.author : void 0,
	    author
	  );
	  if (normalizedAuthor.name === void 0) {
	    return void 0;
	  }
	  return normalizedAuthor;
	}
	async function normalizeCommitterObject({
	  fs,
	  gitdir,
	  author,
	  committer,
	  commit: commit2
	}) {
	  const timestamp = Math.floor(Date.now() / 1e3);
	  const defaultCommitter = {
	    name: await _getConfig({ fs, gitdir, path: "user.name" }),
	    email: await _getConfig({ fs, gitdir, path: "user.email" }) || "",
	    // committer.email is allowed to be empty string
	    timestamp,
	    timezoneOffset: new Date(timestamp * 1e3).getTimezoneOffset()
	  };
	  const normalizedCommitter = assignDefined(
	    {},
	    defaultCommitter,
	    commit2 ? commit2.committer : void 0,
	    author,
	    committer
	  );
	  if (normalizedCommitter.name === void 0) {
	    return void 0;
	  }
	  return normalizedCommitter;
	}
	async function resolveCommit({ fs, cache, gitdir, oid }) {
	  const { type, object } = await _readObject({ fs, cache, gitdir, oid });
	  if (type === "tag") {
	    oid = GitAnnotatedTag.from(object).parse().object;
	    return resolveCommit({ fs, cache, gitdir, oid });
	  }
	  if (type !== "commit") {
	    throw new ObjectTypeError(oid, type, "commit");
	  }
	  return { commit: GitCommit.from(object), oid };
	}
	async function _readCommit({ fs, cache, gitdir, oid }) {
	  const { commit: commit2, oid: commitOid } = await resolveCommit({
	    fs,
	    cache,
	    gitdir,
	    oid
	  });
	  const result = {
	    oid: commitOid,
	    commit: commit2.parse(),
	    payload: commit2.withoutSignature()
	  };
	  return result;
	}
	async function _commit({
	  fs,
	  cache,
	  onSign,
	  gitdir,
	  message,
	  author: _author,
	  committer: _committer,
	  signingKey,
	  amend = false,
	  dryRun = false,
	  noUpdateBranch = false,
	  ref,
	  parent,
	  tree
	}) {
	  let initialCommit = false;
	  let detachedHead = false;
	  if (!ref) {
	    const headContent = await fs.read(`${gitdir}/HEAD`, { encoding: "utf8" });
	    detachedHead = !headContent.startsWith("ref:");
	    ref = await GitRefManager.resolve({
	      fs,
	      gitdir,
	      ref: "HEAD",
	      depth: 2
	    });
	  }
	  let refOid, refCommit;
	  try {
	    refOid = await GitRefManager.resolve({
	      fs,
	      gitdir,
	      ref
	    });
	    refCommit = await _readCommit({ fs, gitdir, oid: refOid, cache: {} });
	  } catch {
	    initialCommit = true;
	  }
	  if (amend && initialCommit) {
	    throw new NoCommitError(ref);
	  }
	  const author = !amend ? await normalizeAuthorObject({ fs, gitdir, author: _author }) : await normalizeAuthorObject({
	    fs,
	    gitdir,
	    author: _author,
	    commit: refCommit.commit
	  });
	  if (!author) throw new MissingNameError("author");
	  const committer = !amend ? await normalizeCommitterObject({
	    fs,
	    gitdir,
	    author,
	    committer: _committer
	  }) : await normalizeCommitterObject({
	    fs,
	    gitdir,
	    author,
	    committer: _committer,
	    commit: refCommit.commit
	  });
	  if (!committer) throw new MissingNameError("committer");
	  return GitIndexManager.acquire(
	    { fs, gitdir, cache, allowUnmerged: false },
	    async function(index2) {
	      const inodes = flatFileListToDirectoryStructure(index2.entries);
	      const inode = inodes.get(".");
	      if (!tree) {
	        tree = await constructTree({ fs, gitdir, inode, dryRun });
	      }
	      if (!parent) {
	        if (!amend) {
	          parent = refOid ? [refOid] : [];
	        } else {
	          parent = refCommit.commit.parent;
	        }
	      } else {
	        parent = await Promise.all(
	          parent.map((p) => {
	            return GitRefManager.resolve({ fs, gitdir, ref: p });
	          })
	        );
	      }
	      if (!message) {
	        if (!amend) {
	          throw new MissingParameterError("message");
	        } else {
	          message = refCommit.commit.message;
	        }
	      }
	      let comm = GitCommit.from({
	        tree,
	        parent,
	        author,
	        committer,
	        message
	      });
	      if (signingKey) {
	        comm = await GitCommit.sign(comm, onSign, signingKey);
	      }
	      const oid = await _writeObject({
	        fs,
	        gitdir,
	        type: "commit",
	        object: comm.toObject(),
	        dryRun
	      });
	      if (!noUpdateBranch && !dryRun) {
	        await GitRefManager.writeRef({
	          fs,
	          gitdir,
	          ref: detachedHead ? "HEAD" : ref,
	          value: oid
	        });
	      }
	      return oid;
	    }
	  );
	}
	async function constructTree({ fs, gitdir, inode, dryRun }) {
	  const children = inode.children;
	  for (const inode2 of children) {
	    if (inode2.type === "tree") {
	      inode2.metadata.mode = "040000";
	      inode2.metadata.oid = await constructTree({ fs, gitdir, inode: inode2, dryRun });
	    }
	  }
	  const entries = children.map((inode2) => ({
	    mode: inode2.metadata.mode,
	    path: inode2.basename,
	    oid: inode2.metadata.oid,
	    type: inode2.type
	  }));
	  const tree = GitTree.from(entries);
	  const oid = await _writeObject({
	    fs,
	    gitdir,
	    type: "tree",
	    object: tree.toObject(),
	    dryRun
	  });
	  return oid;
	}
	async function resolveFilepath({ fs, cache, gitdir, oid, filepath }) {
	  if (filepath.startsWith("/")) {
	    throw new InvalidFilepathError("leading-slash");
	  } else if (filepath.endsWith("/")) {
	    throw new InvalidFilepathError("trailing-slash");
	  }
	  const _oid = oid;
	  const result = await resolveTree({ fs, cache, gitdir, oid });
	  const tree = result.tree;
	  if (filepath === "") {
	    oid = result.oid;
	  } else {
	    const pathArray = filepath.split("/");
	    oid = await _resolveFilepath({
	      fs,
	      cache,
	      gitdir,
	      tree,
	      pathArray,
	      oid: _oid,
	      filepath
	    });
	  }
	  return oid;
	}
	async function _resolveFilepath({
	  fs,
	  cache,
	  gitdir,
	  tree,
	  pathArray,
	  oid,
	  filepath
	}) {
	  const name = pathArray.shift();
	  for (const entry of tree) {
	    if (entry.path === name) {
	      if (pathArray.length === 0) {
	        return entry.oid;
	      } else {
	        const { type, object } = await _readObject({
	          fs,
	          cache,
	          gitdir,
	          oid: entry.oid
	        });
	        if (type !== "tree") {
	          throw new ObjectTypeError(oid, type, "tree", filepath);
	        }
	        tree = GitTree.from(object);
	        return _resolveFilepath({
	          fs,
	          cache,
	          gitdir,
	          tree,
	          pathArray,
	          oid,
	          filepath
	        });
	      }
	    }
	  }
	  throw new NotFoundError(`file or directory found at "${oid}:${filepath}"`);
	}
	async function _readTree({
	  fs,
	  cache,
	  gitdir,
	  oid,
	  filepath = void 0
	}) {
	  if (filepath !== void 0) {
	    oid = await resolveFilepath({ fs, cache, gitdir, oid, filepath });
	  }
	  const { tree, oid: treeOid } = await resolveTree({ fs, cache, gitdir, oid });
	  const result = {
	    oid: treeOid,
	    tree: tree.entries()
	  };
	  return result;
	}
	async function _writeTree({ fs, gitdir, tree }) {
	  const object = GitTree.from(tree).toObject();
	  const oid = await _writeObject({
	    fs,
	    gitdir,
	    type: "tree",
	    object,
	    format: "content"
	  });
	  return oid;
	}
	async function _addNote({
	  fs,
	  cache,
	  onSign,
	  gitdir,
	  ref,
	  oid,
	  note,
	  force,
	  author,
	  committer,
	  signingKey
	}) {
	  let parent;
	  try {
	    parent = await GitRefManager.resolve({ gitdir, fs, ref });
	  } catch (err) {
	    if (!(err instanceof NotFoundError)) {
	      throw err;
	    }
	  }
	  const result = await _readTree({
	    fs,
	    cache,
	    gitdir,
	    oid: parent || "4b825dc642cb6eb9a060e54bf8d69288fbee4904"
	  });
	  let tree = result.tree;
	  if (force) {
	    tree = tree.filter((entry) => entry.path !== oid);
	  } else {
	    for (const entry of tree) {
	      if (entry.path === oid) {
	        throw new AlreadyExistsError("note", oid);
	      }
	    }
	  }
	  if (typeof note === "string") {
	    note = Buffer.from(note, "utf8");
	  }
	  const noteOid = await _writeObject({
	    fs,
	    gitdir,
	    type: "blob",
	    object: note,
	    format: "content"
	  });
	  tree.push({ mode: "100644", path: oid, oid: noteOid, type: "blob" });
	  const treeOid = await _writeTree({
	    fs,
	    gitdir,
	    tree
	  });
	  const commitOid = await _commit({
	    fs,
	    cache,
	    onSign,
	    gitdir,
	    ref,
	    tree: treeOid,
	    parent: parent && [parent],
	    message: `Note added by 'isomorphic-git addNote'
`,
	    author,
	    committer,
	    signingKey
	  });
	  return commitOid;
	}
	async function addNote({
	  fs: _fs,
	  onSign,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref = "refs/notes/commits",
	  oid,
	  note,
	  force,
	  author: _author,
	  committer: _committer,
	  signingKey,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("oid", oid);
	    assertParameter("note", note);
	    if (signingKey) {
	      assertParameter("onSign", onSign);
	    }
	    const fs = new FileSystem(_fs);
	    const author = await normalizeAuthorObject({ fs, gitdir, author: _author });
	    if (!author) throw new MissingNameError("author");
	    const committer = await normalizeCommitterObject({
	      fs,
	      gitdir,
	      author,
	      committer: _committer
	    });
	    if (!committer) throw new MissingNameError("committer");
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    return await _addNote({
	      fs,
	      cache,
	      onSign,
	      gitdir: updatedGitdir,
	      ref,
	      oid,
	      note,
	      force,
	      author,
	      committer,
	      signingKey
	    });
	  } catch (err) {
	    err.caller = "git.addNote";
	    throw err;
	  }
	}
	const bad = /(^|[/.])([/.]|$)|^@$|@{|[\x00-\x20\x7f~^:?*[\\]|\.lock(\/|$)/;
	function isValidRef(name, onelevel) {
	  if (typeof name !== "string")
	    throw new TypeError("Reference name must be a string");
	  return !bad.test(name) && (true);
	}
	async function _addRemote({ fs, gitdir, remote, url, force }) {
	  if (!isValidRef(remote)) {
	    throw new InvalidRefNameError(remote, cleanGitRef.clean(remote));
	  }
	  const config = await GitConfigManager.get({ fs, gitdir });
	  if (!force) {
	    const remoteNames = await config.getSubsections("remote");
	    if (remoteNames.includes(remote)) {
	      if (url !== await config.get(`remote.${remote}.url`)) {
	        throw new AlreadyExistsError("remote", remote);
	      }
	    }
	  }
	  await config.set(`remote.${remote}.url`, url);
	  await config.set(
	    `remote.${remote}.fetch`,
	    `+refs/heads/*:refs/remotes/${remote}/*`
	  );
	  await GitConfigManager.save({ fs, gitdir, config });
	}
	async function addRemote({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  remote,
	  url,
	  force = false
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("remote", remote);
	    assertParameter("url", url);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _addRemote({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      remote,
	      url,
	      force
	    });
	  } catch (err) {
	    err.caller = "git.addRemote";
	    throw err;
	  }
	}
	async function _annotatedTag({
	  fs,
	  cache,
	  onSign,
	  gitdir,
	  ref,
	  tagger,
	  message = ref,
	  gpgsig,
	  object,
	  signingKey,
	  force = false
	}) {
	  ref = ref.startsWith("refs/tags/") ? ref : `refs/tags/${ref}`;
	  if (!force && await GitRefManager.exists({ fs, gitdir, ref })) {
	    throw new AlreadyExistsError("tag", ref);
	  }
	  const oid = await GitRefManager.resolve({
	    fs,
	    gitdir,
	    ref: object || "HEAD"
	  });
	  const { type } = await _readObject({ fs, cache, gitdir, oid });
	  let tagObject = GitAnnotatedTag.from({
	    object: oid,
	    type,
	    tag: ref.replace("refs/tags/", ""),
	    tagger,
	    message,
	    gpgsig
	  });
	  if (signingKey) {
	    tagObject = await GitAnnotatedTag.sign(tagObject, onSign, signingKey);
	  }
	  const value = await _writeObject({
	    fs,
	    gitdir,
	    type: "tag",
	    object: tagObject.toObject()
	  });
	  await GitRefManager.writeRef({ fs, gitdir, ref, value });
	}
	async function annotatedTag({
	  fs: _fs,
	  onSign,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref,
	  tagger: _tagger,
	  message = ref,
	  gpgsig,
	  object,
	  signingKey,
	  force = false,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("ref", ref);
	    if (signingKey) {
	      assertParameter("onSign", onSign);
	    }
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    const tagger = await normalizeAuthorObject({
	      fs,
	      gitdir: updatedGitdir,
	      author: _tagger
	    });
	    if (!tagger) throw new MissingNameError("tagger");
	    return await _annotatedTag({
	      fs,
	      cache,
	      onSign,
	      gitdir: updatedGitdir,
	      ref,
	      tagger,
	      message,
	      gpgsig,
	      object,
	      signingKey,
	      force
	    });
	  } catch (err) {
	    err.caller = "git.annotatedTag";
	    throw err;
	  }
	}
	async function _branch({
	  fs,
	  gitdir,
	  ref,
	  object,
	  checkout: checkout2 = false,
	  force = false
	}) {
	  if (!isValidRef(ref)) {
	    throw new InvalidRefNameError(ref, cleanGitRef.clean(ref));
	  }
	  const fullref = `refs/heads/${ref}`;
	  if (!force) {
	    const exist = await GitRefManager.exists({ fs, gitdir, ref: fullref });
	    if (exist) {
	      throw new AlreadyExistsError("branch", ref, false);
	    }
	  }
	  let oid;
	  try {
	    oid = await GitRefManager.resolve({ fs, gitdir, ref: object || "HEAD" });
	  } catch (e) {
	  }
	  if (oid) {
	    await GitRefManager.writeRef({ fs, gitdir, ref: fullref, value: oid });
	  }
	  if (checkout2) {
	    await GitRefManager.writeSymbolicRef({
	      fs,
	      gitdir,
	      ref: "HEAD",
	      value: fullref
	    });
	  }
	}
	async function branch({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref,
	  object,
	  checkout: checkout2 = false,
	  force = false
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("ref", ref);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _branch({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      ref,
	      object,
	      checkout: checkout2,
	      force
	    });
	  } catch (err) {
	    err.caller = "git.branch";
	    throw err;
	  }
	}
	const worthWalking = (filepath, root) => {
	  if (filepath === "." || root == null || root.length === 0 || root === ".") {
	    return true;
	  }
	  if (root.length >= filepath.length) {
	    return root.startsWith(filepath);
	  } else {
	    return filepath.startsWith(root);
	  }
	};
	async function _checkout({
	  fs,
	  cache,
	  onProgress,
	  onPostCheckout,
	  dir,
	  gitdir,
	  remote,
	  ref,
	  filepaths,
	  noCheckout,
	  noUpdateHead,
	  dryRun,
	  force,
	  track = true,
	  nonBlocking = false,
	  batchSize = 100
	}) {
	  let oldOid;
	  if (onPostCheckout) {
	    try {
	      oldOid = await GitRefManager.resolve({ fs, gitdir, ref: "HEAD" });
	    } catch (err) {
	      oldOid = "0000000000000000000000000000000000000000";
	    }
	  }
	  let oid;
	  try {
	    oid = await GitRefManager.resolve({ fs, gitdir, ref });
	  } catch (err) {
	    if (ref === "HEAD") throw err;
	    const remoteRef = `${remote}/${ref}`;
	    oid = await GitRefManager.resolve({
	      fs,
	      gitdir,
	      ref: remoteRef
	    });
	    if (track) {
	      const config = await GitConfigManager.get({ fs, gitdir });
	      await config.set(`branch.${ref}.remote`, remote);
	      await config.set(`branch.${ref}.merge`, `refs/heads/${ref}`);
	      await GitConfigManager.save({ fs, gitdir, config });
	    }
	    await GitRefManager.writeRef({
	      fs,
	      gitdir,
	      ref: `refs/heads/${ref}`,
	      value: oid
	    });
	  }
	  if (!noCheckout) {
	    let ops;
	    try {
	      ops = await analyze({
	        fs,
	        cache,
	        onProgress,
	        dir,
	        gitdir,
	        ref,
	        force,
	        filepaths
	      });
	    } catch (err) {
	      if (err instanceof NotFoundError && err.data.what === oid) {
	        throw new CommitNotFetchedError(ref, oid);
	      } else {
	        throw err;
	      }
	    }
	    const conflicts = ops.filter(([method]) => method === "conflict").map(([method, fullpath]) => fullpath);
	    if (conflicts.length > 0) {
	      throw new CheckoutConflictError(conflicts);
	    }
	    const errors = ops.filter(([method]) => method === "error").map(([method, fullpath]) => fullpath);
	    if (errors.length > 0) {
	      throw new InternalError(errors.join(", "));
	    }
	    if (dryRun) {
	      if (onPostCheckout) {
	        await onPostCheckout({
	          previousHead: oldOid,
	          newHead: oid,
	          type: filepaths != null && filepaths.length > 0 ? "file" : "branch"
	        });
	      }
	      return;
	    }
	    let count = 0;
	    const total = ops.length;
	    await GitIndexManager.acquire(
	      { fs, gitdir, cache },
	      async function(index2) {
	        await Promise.all(
	          ops.filter(
	            ([method]) => method === "delete" || method === "delete-index"
	          ).map(async function([method, fullpath]) {
	            const filepath = `${dir}/${fullpath}`;
	            if (method === "delete") {
	              await fs.rm(filepath);
	            }
	            index2.delete({ filepath: fullpath });
	            if (onProgress) {
	              await onProgress({
	                phase: "Updating workdir",
	                loaded: ++count,
	                total
	              });
	            }
	          })
	        );
	      }
	    );
	    await GitIndexManager.acquire(
	      { fs, gitdir, cache },
	      async function(index2) {
	        for (const [method, fullpath] of ops) {
	          if (method === "rmdir" || method === "rmdir-index") {
	            const filepath = `${dir}/${fullpath}`;
	            try {
	              if (method === "rmdir") {
	                await fs.rmdir(filepath);
	              }
	              index2.delete({ filepath: fullpath });
	              if (onProgress) {
	                await onProgress({
	                  phase: "Updating workdir",
	                  loaded: ++count,
	                  total
	                });
	              }
	            } catch (e) {
	              if (e.code === "ENOTEMPTY") {
	                console.log(
	                  `Did not delete ${fullpath} because directory is not empty`
	                );
	              } else {
	                throw e;
	              }
	            }
	          }
	        }
	      }
	    );
	    await Promise.all(
	      ops.filter(([method]) => method === "mkdir" || method === "mkdir-index").map(async function([_, fullpath]) {
	        const filepath = `${dir}/${fullpath}`;
	        await fs.mkdir(filepath);
	        if (onProgress) {
	          await onProgress({
	            phase: "Updating workdir",
	            loaded: ++count,
	            total
	          });
	        }
	      })
	    );
	    if (nonBlocking) {
	      const eligibleOps = ops.filter(
	        ([method]) => method === "create" || method === "create-index" || method === "update" || method === "mkdir-index"
	      );
	      const updateWorkingDirResults = await batchAllSettled(
	        "Update Working Dir",
	        eligibleOps.map(
	          ([method, fullpath, oid2, mode, chmod]) => () => updateWorkingDir({ fs, cache, gitdir, dir }, [
	            method,
	            fullpath,
	            oid2,
	            mode,
	            chmod
	          ])
	        ),
	        onProgress,
	        batchSize
	      );
	      await GitIndexManager.acquire(
	        { fs, gitdir, cache, allowUnmerged: true },
	        async function(index2) {
	          await batchAllSettled(
	            "Update Index",
	            updateWorkingDirResults.map(
	              ([fullpath, oid2, stats]) => () => updateIndex({ index: index2, fullpath, oid: oid2, stats })
	            ),
	            onProgress,
	            batchSize
	          );
	        }
	      );
	    } else {
	      await GitIndexManager.acquire(
	        { fs, gitdir, cache, allowUnmerged: true },
	        async function(index2) {
	          await Promise.all(
	            ops.filter(
	              ([method]) => method === "create" || method === "create-index" || method === "update" || method === "mkdir-index"
	            ).map(async function([method, fullpath, oid2, mode, chmod]) {
	              const filepath = `${dir}/${fullpath}`;
	              try {
	                if (method !== "create-index" && method !== "mkdir-index") {
	                  const { object } = await _readObject({
	                    fs,
	                    cache,
	                    gitdir,
	                    oid: oid2
	                  });
	                  if (chmod) {
	                    await fs.rm(filepath);
	                  }
	                  if (mode === 33188) {
	                    await fs.write(filepath, object);
	                  } else if (mode === 33261) {
	                    await fs.write(filepath, object, { mode: 511 });
	                  } else if (mode === 40960) {
	                    await fs.writelink(filepath, object);
	                  } else {
	                    throw new InternalError(
	                      `Invalid mode 0o${mode.toString(
	                        8
	                      )} detected in blob ${oid2}`
	                    );
	                  }
	                }
	                const stats = await fs.lstat(filepath);
	                if (mode === 33261) {
	                  stats.mode = 493;
	                }
	                if (method === "mkdir-index") {
	                  stats.mode = 57344;
	                }
	                index2.insert({
	                  filepath: fullpath,
	                  stats,
	                  oid: oid2
	                });
	                if (onProgress) {
	                  await onProgress({
	                    phase: "Updating workdir",
	                    loaded: ++count,
	                    total
	                  });
	                }
	              } catch (e) {
	                console.log(e);
	              }
	            })
	          );
	        }
	      );
	    }
	    if (onPostCheckout) {
	      await onPostCheckout({
	        previousHead: oldOid,
	        newHead: oid,
	        type: filepaths != null && filepaths.length > 0 ? "file" : "branch"
	      });
	    }
	  }
	  if (!noUpdateHead) {
	    const fullRef = await GitRefManager.expand({ fs, gitdir, ref });
	    if (fullRef.startsWith("refs/heads")) {
	      await GitRefManager.writeSymbolicRef({
	        fs,
	        gitdir,
	        ref: "HEAD",
	        value: fullRef
	      });
	    } else {
	      await GitRefManager.writeRef({ fs, gitdir, ref: "HEAD", value: oid });
	    }
	  }
	}
	async function analyze({
	  fs,
	  cache,
	  onProgress,
	  dir,
	  gitdir,
	  ref,
	  force,
	  filepaths
	}) {
	  let count = 0;
	  return _walk({
	    fs,
	    cache,
	    dir,
	    gitdir,
	    trees: [TREE({ ref }), WORKDIR(), STAGE()],
	    map: async function(fullpath, [commit2, workdir, stage]) {
	      if (fullpath === ".") return;
	      if (filepaths && !filepaths.some((base) => worthWalking(fullpath, base))) {
	        return null;
	      }
	      if (onProgress) {
	        await onProgress({ phase: "Analyzing workdir", loaded: ++count });
	      }
	      const key = [!!stage, !!commit2, !!workdir].map(Number).join("");
	      switch (key) {
	        // Impossible case.
	        case "000":
	          return;
	        // Ignore workdir files that are not tracked and not part of the new commit.
	        case "001":
	          if (force && filepaths && filepaths.includes(fullpath)) {
	            return ["delete", fullpath];
	          }
	          return;
	        // New entries
	        case "010": {
	          switch (await commit2.type()) {
	            case "tree": {
	              return ["mkdir", fullpath];
	            }
	            case "blob": {
	              return [
	                "create",
	                fullpath,
	                await commit2.oid(),
	                await commit2.mode()
	              ];
	            }
	            case "commit": {
	              return [
	                "mkdir-index",
	                fullpath,
	                await commit2.oid(),
	                await commit2.mode()
	              ];
	            }
	            default: {
	              return [
	                "error",
	                `new entry Unhandled type ${await commit2.type()}`
	              ];
	            }
	          }
	        }
	        // New entries but there is already something in the workdir there.
	        case "011": {
	          switch (`${await commit2.type()}-${await workdir.type()}`) {
	            case "tree-tree": {
	              return;
	            }
	            case "tree-blob":
	            case "blob-tree": {
	              return ["conflict", fullpath];
	            }
	            case "blob-blob": {
	              if (await commit2.oid() !== await workdir.oid()) {
	                if (force) {
	                  return [
	                    "update",
	                    fullpath,
	                    await commit2.oid(),
	                    await commit2.mode(),
	                    await commit2.mode() !== await workdir.mode()
	                  ];
	                } else {
	                  return ["conflict", fullpath];
	                }
	              } else {
	                if (await commit2.mode() !== await workdir.mode()) {
	                  if (force) {
	                    return [
	                      "update",
	                      fullpath,
	                      await commit2.oid(),
	                      await commit2.mode(),
	                      true
	                    ];
	                  } else {
	                    return ["conflict", fullpath];
	                  }
	                } else {
	                  return [
	                    "create-index",
	                    fullpath,
	                    await commit2.oid(),
	                    await commit2.mode()
	                  ];
	                }
	              }
	            }
	            case "commit-tree": {
	              return;
	            }
	            case "commit-blob": {
	              return ["conflict", fullpath];
	            }
	            default: {
	              return ["error", `new entry Unhandled type ${commit2.type}`];
	            }
	          }
	        }
	        // Something in stage but not in the commit OR the workdir.
	        // Note: I verified this behavior against canonical git.
	        case "100": {
	          return ["delete-index", fullpath];
	        }
	        // Deleted entries
	        // TODO: How to handle if stage type and workdir type mismatch?
	        case "101": {
	          switch (await stage.type()) {
	            case "tree": {
	              return ["rmdir-index", fullpath];
	            }
	            case "blob": {
	              if (await stage.oid() !== await workdir.oid()) {
	                if (force) {
	                  return ["delete", fullpath];
	                } else {
	                  return ["conflict", fullpath];
	                }
	              } else {
	                return ["delete", fullpath];
	              }
	            }
	            case "commit": {
	              return ["rmdir-index", fullpath];
	            }
	            default: {
	              return [
	                "error",
	                `delete entry Unhandled type ${await stage.type()}`
	              ];
	            }
	          }
	        }
	        /* eslint-disable no-fallthrough */
	        // File missing from workdir
	        case "110":
	        // Possibly modified entries
	        case "111": {
	          switch (`${await stage.type()}-${await commit2.type()}`) {
	            case "tree-tree": {
	              return;
	            }
	            case "blob-blob": {
	              if (await stage.oid() === await commit2.oid() && await stage.mode() === await commit2.mode() && !force) {
	                return;
	              }
	              if (workdir) {
	                if (await workdir.oid() !== await stage.oid() && await workdir.oid() !== await commit2.oid()) {
	                  if (force) {
	                    return [
	                      "update",
	                      fullpath,
	                      await commit2.oid(),
	                      await commit2.mode(),
	                      await commit2.mode() !== await workdir.mode()
	                    ];
	                  } else {
	                    return ["conflict", fullpath];
	                  }
	                }
	              } else if (force) {
	                return [
	                  "update",
	                  fullpath,
	                  await commit2.oid(),
	                  await commit2.mode(),
	                  await commit2.mode() !== await stage.mode()
	                ];
	              }
	              if (await commit2.mode() !== await stage.mode()) {
	                return [
	                  "update",
	                  fullpath,
	                  await commit2.oid(),
	                  await commit2.mode(),
	                  true
	                ];
	              }
	              if (await commit2.oid() !== await stage.oid()) {
	                return [
	                  "update",
	                  fullpath,
	                  await commit2.oid(),
	                  await commit2.mode(),
	                  false
	                ];
	              } else {
	                return;
	              }
	            }
	            case "tree-blob": {
	              return ["update-dir-to-blob", fullpath, await commit2.oid()];
	            }
	            case "blob-tree": {
	              return ["update-blob-to-tree", fullpath];
	            }
	            case "commit-commit": {
	              return [
	                "mkdir-index",
	                fullpath,
	                await commit2.oid(),
	                await commit2.mode()
	              ];
	            }
	            default: {
	              return [
	                "error",
	                `update entry Unhandled type ${await stage.type()}-${await commit2.type()}`
	              ];
	            }
	          }
	        }
	      }
	    },
	    // Modify the default flat mapping
	    reduce: async function(parent, children) {
	      children = flat(children);
	      if (!parent) {
	        return children;
	      } else if (parent && parent[0] === "rmdir") {
	        children.push(parent);
	        return children;
	      } else {
	        children.unshift(parent);
	        return children;
	      }
	    }
	  });
	}
	async function updateIndex({ index: index2, fullpath, stats, oid }) {
	  try {
	    index2.insert({
	      filepath: fullpath,
	      stats,
	      oid
	    });
	  } catch (e) {
	    console.warn(`Error inserting ${fullpath} into index:`, e);
	  }
	}
	async function updateWorkingDir({ fs, cache, gitdir, dir }, [method, fullpath, oid, mode, chmod]) {
	  const filepath = `${dir}/${fullpath}`;
	  if (method !== "create-index" && method !== "mkdir-index") {
	    const { object } = await _readObject({ fs, cache, gitdir, oid });
	    if (chmod) {
	      await fs.rm(filepath);
	    }
	    if (mode === 33188) {
	      await fs.write(filepath, object);
	    } else if (mode === 33261) {
	      await fs.write(filepath, object, { mode: 511 });
	    } else if (mode === 40960) {
	      await fs.writelink(filepath, object);
	    } else {
	      throw new InternalError(
	        `Invalid mode 0o${mode.toString(8)} detected in blob ${oid}`
	      );
	    }
	  }
	  const stats = await fs.lstat(filepath);
	  if (mode === 33261) {
	    stats.mode = 493;
	  }
	  if (method === "mkdir-index") {
	    stats.mode = 57344;
	  }
	  return [fullpath, oid, stats];
	}
	async function batchAllSettled(operationName, tasks, onProgress, batchSize) {
	  const results = [];
	  try {
	    for (let i = 0; i < tasks.length; i += batchSize) {
	      const batch = tasks.slice(i, i + batchSize).map((task) => task());
	      const batchResults = await Promise.allSettled(batch);
	      batchResults.forEach((result) => {
	        if (result.status === "fulfilled") results.push(result.value);
	      });
	      if (onProgress) {
	        await onProgress({
	          phase: "Updating workdir",
	          loaded: i + batch.length,
	          total: tasks.length
	        });
	      }
	    }
	    return results;
	  } catch (error) {
	    console.error(`Error during ${operationName}: ${error}`);
	  }
	  return results;
	}
	async function checkout({
	  fs,
	  onProgress,
	  onPostCheckout,
	  dir,
	  gitdir = join(dir, ".git"),
	  remote = "origin",
	  ref: _ref,
	  filepaths,
	  noCheckout = false,
	  noUpdateHead = _ref === void 0,
	  dryRun = false,
	  force = false,
	  track = true,
	  cache = {},
	  nonBlocking = false,
	  batchSize = 100
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("dir", dir);
	    assertParameter("gitdir", gitdir);
	    const ref = _ref || "HEAD";
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _checkout({
	      fs: fsp,
	      cache,
	      onProgress,
	      onPostCheckout,
	      dir,
	      gitdir: updatedGitdir,
	      remote,
	      ref,
	      filepaths,
	      noCheckout,
	      noUpdateHead,
	      dryRun,
	      force,
	      track,
	      nonBlocking,
	      batchSize
	    });
	  } catch (err) {
	    err.caller = "git.checkout";
	    throw err;
	  }
	}
	const LINEBREAKS = /^.*(\r?\n|$)/gm;
	function mergeFile({ branches, contents }) {
	  const ourName = branches[1];
	  const theirName = branches[2];
	  const baseContent = contents[0];
	  const ourContent = contents[1];
	  const theirContent = contents[2];
	  const ours = ourContent.match(LINEBREAKS);
	  const base = baseContent.match(LINEBREAKS);
	  const theirs = theirContent.match(LINEBREAKS);
	  const result = diff3Merge(ours, base, theirs);
	  const markerSize = 7;
	  let mergedText = "";
	  let cleanMerge = true;
	  for (const item of result) {
	    if (item.ok) {
	      mergedText += item.ok.join("");
	    }
	    if (item.conflict) {
	      cleanMerge = false;
	      mergedText += `${"<".repeat(markerSize)} ${ourName}
`;
	      mergedText += item.conflict.a.join("");
	      mergedText += `${"=".repeat(markerSize)}
`;
	      mergedText += item.conflict.b.join("");
	      mergedText += `${">".repeat(markerSize)} ${theirName}
`;
	    }
	  }
	  return { cleanMerge, mergedText };
	}
	async function mergeTree({
	  fs,
	  cache,
	  dir,
	  gitdir = join(dir, ".git"),
	  index: index2,
	  ourOid,
	  baseOid,
	  theirOid,
	  ourName = "ours",
	  baseName = "base",
	  theirName = "theirs",
	  dryRun = false,
	  abortOnConflict = true,
	  mergeDriver
	}) {
	  const ourTree = TREE({ ref: ourOid });
	  const baseTree = TREE({ ref: baseOid });
	  const theirTree = TREE({ ref: theirOid });
	  const unmergedFiles = [];
	  const bothModified = [];
	  const deleteByUs = [];
	  const deleteByTheirs = [];
	  const results = await _walk({
	    fs,
	    cache,
	    dir,
	    gitdir,
	    trees: [ourTree, baseTree, theirTree],
	    map: async function(filepath, [ours, base, theirs]) {
	      const path = basename(filepath);
	      const ourChange = await modified(ours, base);
	      const theirChange = await modified(theirs, base);
	      switch (`${ourChange}-${theirChange}`) {
	        case "false-false": {
	          return {
	            mode: await base.mode(),
	            path,
	            oid: await base.oid(),
	            type: await base.type()
	          };
	        }
	        case "false-true": {
	          if (!theirs && await ours.type() === "tree") {
	            return {
	              mode: await ours.mode(),
	              path,
	              oid: await ours.oid(),
	              type: await ours.type()
	            };
	          }
	          return theirs ? {
	            mode: await theirs.mode(),
	            path,
	            oid: await theirs.oid(),
	            type: await theirs.type()
	          } : void 0;
	        }
	        case "true-false": {
	          if (!ours && await theirs.type() === "tree") {
	            return {
	              mode: await theirs.mode(),
	              path,
	              oid: await theirs.oid(),
	              type: await theirs.type()
	            };
	          }
	          return ours ? {
	            mode: await ours.mode(),
	            path,
	            oid: await ours.oid(),
	            type: await ours.type()
	          } : void 0;
	        }
	        case "true-true": {
	          if (ours && theirs && await ours.type() === "tree" && await theirs.type() === "tree") {
	            return {
	              mode: await ours.mode(),
	              path,
	              oid: await ours.oid(),
	              type: "tree"
	            };
	          }
	          if (ours && theirs && await ours.type() === "blob" && await theirs.type() === "blob") {
	            return mergeBlobs({
	              fs,
	              gitdir,
	              path,
	              ours,
	              base,
	              theirs,
	              ourName,
	              baseName,
	              theirName,
	              mergeDriver
	            }).then(async (r) => {
	              if (!r.cleanMerge) {
	                unmergedFiles.push(filepath);
	                bothModified.push(filepath);
	                if (!abortOnConflict) {
	                  let baseOid2 = "";
	                  if (base && await base.type() === "blob") {
	                    baseOid2 = await base.oid();
	                  }
	                  const ourOid2 = await ours.oid();
	                  const theirOid2 = await theirs.oid();
	                  index2.delete({ filepath });
	                  if (baseOid2) {
	                    index2.insert({ filepath, oid: baseOid2, stage: 1 });
	                  }
	                  index2.insert({ filepath, oid: ourOid2, stage: 2 });
	                  index2.insert({ filepath, oid: theirOid2, stage: 3 });
	                }
	              } else if (!abortOnConflict) {
	                index2.insert({ filepath, oid: r.mergeResult.oid, stage: 0 });
	              }
	              return r.mergeResult;
	            });
	          }
	          if (base && !ours && theirs && await base.type() === "blob" && await theirs.type() === "blob") {
	            unmergedFiles.push(filepath);
	            deleteByUs.push(filepath);
	            if (!abortOnConflict) {
	              const baseOid2 = await base.oid();
	              const theirOid2 = await theirs.oid();
	              index2.delete({ filepath });
	              index2.insert({ filepath, oid: baseOid2, stage: 1 });
	              index2.insert({ filepath, oid: theirOid2, stage: 3 });
	            }
	            return {
	              mode: await theirs.mode(),
	              oid: await theirs.oid(),
	              type: "blob",
	              path
	            };
	          }
	          if (base && ours && !theirs && await base.type() === "blob" && await ours.type() === "blob") {
	            unmergedFiles.push(filepath);
	            deleteByTheirs.push(filepath);
	            if (!abortOnConflict) {
	              const baseOid2 = await base.oid();
	              const ourOid2 = await ours.oid();
	              index2.delete({ filepath });
	              index2.insert({ filepath, oid: baseOid2, stage: 1 });
	              index2.insert({ filepath, oid: ourOid2, stage: 2 });
	            }
	            return {
	              mode: await ours.mode(),
	              oid: await ours.oid(),
	              type: "blob",
	              path
	            };
	          }
	          if (base && !ours && !theirs && (await base.type() === "blob" || await base.type() === "tree")) {
	            return void 0;
	          }
	          throw new MergeNotSupportedError();
	        }
	      }
	    },
	    /**
	     * @param {TreeEntry} [parent]
	     * @param {Array<TreeEntry>} children
	     */
	    reduce: unmergedFiles.length !== 0 && (!dir || abortOnConflict) ? void 0 : async (parent, children) => {
	      const entries = children.filter(Boolean);
	      if (!parent) return;
	      if (parent && parent.type === "tree" && entries.length === 0 && parent.path !== ".")
	        return;
	      if (entries.length > 0 || parent.path === "." && entries.length === 0) {
	        const tree = new GitTree(entries);
	        const object = tree.toObject();
	        const oid = await _writeObject({
	          fs,
	          gitdir,
	          type: "tree",
	          object,
	          dryRun
	        });
	        parent.oid = oid;
	      }
	      return parent;
	    }
	  });
	  if (unmergedFiles.length !== 0) {
	    if (dir && !abortOnConflict) {
	      await _walk({
	        fs,
	        cache,
	        dir,
	        gitdir,
	        trees: [TREE({ ref: results.oid })],
	        map: async function(filepath, [entry]) {
	          const path = `${dir}/${filepath}`;
	          if (await entry.type() === "blob") {
	            const mode = await entry.mode();
	            const content = new TextDecoder().decode(await entry.content());
	            await fs.write(path, content, { mode });
	          }
	          return true;
	        }
	      });
	    }
	    return new MergeConflictError(
	      unmergedFiles,
	      bothModified,
	      deleteByUs,
	      deleteByTheirs
	    );
	  }
	  return results.oid;
	}
	async function mergeBlobs({
	  fs,
	  gitdir,
	  path,
	  ours,
	  base,
	  theirs,
	  ourName,
	  theirName,
	  baseName,
	  dryRun,
	  mergeDriver = mergeFile
	}) {
	  const type = "blob";
	  let baseMode = "100755";
	  let baseOid = "";
	  let baseContent = "";
	  if (base && await base.type() === "blob") {
	    baseMode = await base.mode();
	    baseOid = await base.oid();
	    baseContent = Buffer.from(await base.content()).toString("utf8");
	  }
	  const mode = baseMode === await ours.mode() ? await theirs.mode() : await ours.mode();
	  if (await ours.oid() === await theirs.oid()) {
	    return {
	      cleanMerge: true,
	      mergeResult: { mode, path, oid: await ours.oid(), type }
	    };
	  }
	  if (await ours.oid() === baseOid) {
	    return {
	      cleanMerge: true,
	      mergeResult: { mode, path, oid: await theirs.oid(), type }
	    };
	  }
	  if (await theirs.oid() === baseOid) {
	    return {
	      cleanMerge: true,
	      mergeResult: { mode, path, oid: await ours.oid(), type }
	    };
	  }
	  const ourContent = Buffer.from(await ours.content()).toString("utf8");
	  const theirContent = Buffer.from(await theirs.content()).toString("utf8");
	  const { mergedText, cleanMerge } = await mergeDriver({
	    branches: [baseName, ourName, theirName],
	    contents: [baseContent, ourContent, theirContent],
	    path
	  });
	  const oid = await _writeObject({
	    fs,
	    gitdir,
	    type: "blob",
	    object: Buffer.from(mergedText, "utf8"),
	    dryRun
	  });
	  return { cleanMerge, mergeResult: { mode, path, oid, type } };
	}
	const _TreeMap = {
	  stage: STAGE,
	  workdir: WORKDIR
	};
	let lock$2;
	async function acquireLock$1(ref, callback) {
	  if (lock$2 === void 0) lock$2 = new AsyncLock();
	  return lock$2.acquire(ref, callback);
	}
	async function checkAndWriteBlob(fs, gitdir, dir, filepath, oid = null) {
	  const currentFilepath = join(dir, filepath);
	  const stats = await fs.lstat(currentFilepath);
	  if (!stats) throw new NotFoundError(currentFilepath);
	  if (stats.isDirectory())
	    throw new InternalError(
	      `${currentFilepath}: file expected, but found directory`
	    );
	  const objContent = oid ? await readObjectLoose({ fs, gitdir, oid }) : void 0;
	  let retOid = objContent ? oid : void 0;
	  if (!objContent) {
	    await acquireLock$1({ fs, gitdir, currentFilepath }, async () => {
	      const object = stats.isSymbolicLink() ? await fs.readlink(currentFilepath).then(posixifyPathBuffer) : await fs.read(currentFilepath);
	      if (object === null) throw new NotFoundError(currentFilepath);
	      retOid = await _writeObject({ fs, gitdir, type: "blob", object });
	    });
	  }
	  return retOid;
	}
	async function processTreeEntries({ fs, dir, gitdir, entries }) {
	  async function processTreeEntry(entry) {
	    if (entry.type === "tree") {
	      if (!entry.oid) {
	        const children = await Promise.all(entry.children.map(processTreeEntry));
	        entry.oid = await _writeTree({
	          fs,
	          gitdir,
	          tree: children
	        });
	        entry.mode = 16384;
	      }
	    } else if (entry.type === "blob") {
	      entry.oid = await checkAndWriteBlob(
	        fs,
	        gitdir,
	        dir,
	        entry.path,
	        entry.oid
	      );
	      entry.mode = 33188;
	    }
	    entry.path = entry.path.split("/").pop();
	    return entry;
	  }
	  return Promise.all(entries.map(processTreeEntry));
	}
	async function writeTreeChanges({
	  fs,
	  dir,
	  gitdir,
	  treePair
	  // [TREE({ ref: 'HEAD' }), 'STAGE'] would be the equivalent of `git write-tree`
	}) {
	  const isStage = treePair[1] === "stage";
	  const trees = treePair.map((t) => typeof t === "string" ? _TreeMap[t]() : t);
	  const changedEntries = [];
	  const map = async (filepath, [head, stage]) => {
	    if (filepath === "." || await GitIgnoreManager.isIgnored({ fs, dir, gitdir, filepath })) {
	      return;
	    }
	    if (stage) {
	      if (!head || await head.oid() !== await stage.oid() && await stage.oid() !== void 0) {
	        changedEntries.push([head, stage]);
	      }
	      return {
	        mode: await stage.mode(),
	        path: filepath,
	        oid: await stage.oid(),
	        type: await stage.type()
	      };
	    }
	  };
	  const reduce = async (parent, children) => {
	    children = children.filter(Boolean);
	    if (!parent) {
	      return children.length > 0 ? children : void 0;
	    } else {
	      parent.children = children;
	      return parent;
	    }
	  };
	  const iterate = async (walk2, children) => {
	    const filtered = [];
	    for (const child of children) {
	      const [head, stage] = child;
	      if (isStage) {
	        if (stage) {
	          if (await fs.exists(`${dir}/${stage.toString()}`)) {
	            filtered.push(child);
	          } else {
	            changedEntries.push([null, stage]);
	          }
	        }
	      } else if (head) {
	        if (!stage) {
	          changedEntries.push([head, null]);
	        } else {
	          filtered.push(child);
	        }
	      }
	    }
	    return filtered.length ? Promise.all(filtered.map(walk2)) : [];
	  };
	  const entries = await _walk({
	    fs,
	    cache: {},
	    dir,
	    gitdir,
	    trees,
	    map,
	    reduce,
	    iterate
	  });
	  if (changedEntries.length === 0 || entries.length === 0) {
	    return null;
	  }
	  const processedEntries = await processTreeEntries({
	    fs,
	    dir,
	    gitdir,
	    entries
	  });
	  const treeEntries = processedEntries.filter(Boolean).map((entry) => ({
	    mode: entry.mode,
	    path: entry.path,
	    oid: entry.oid,
	    type: entry.type
	  }));
	  return _writeTree({ fs, gitdir, tree: treeEntries });
	}
	async function applyTreeChanges({
	  fs,
	  dir,
	  gitdir,
	  stashCommit,
	  parentCommit,
	  wasStaged
	}) {
	  const dirRemoved = [];
	  const stageUpdated = [];
	  const ops = await _walk({
	    fs,
	    cache: {},
	    dir,
	    gitdir,
	    trees: [TREE({ ref: parentCommit }), TREE({ ref: stashCommit })],
	    map: async (filepath, [parent, stash2]) => {
	      if (filepath === "." || await GitIgnoreManager.isIgnored({ fs, dir, gitdir, filepath })) {
	        return;
	      }
	      const type = stash2 ? await stash2.type() : await parent.type();
	      if (type !== "tree" && type !== "blob") {
	        return;
	      }
	      if (!stash2 && parent) {
	        const method = type === "tree" ? "rmdir" : "rm";
	        if (type === "tree") dirRemoved.push(filepath);
	        if (type === "blob" && wasStaged)
	          stageUpdated.push({ filepath, oid: await parent.oid() });
	        return { method, filepath };
	      }
	      const oid = await stash2.oid();
	      if (!parent || await parent.oid() !== oid) {
	        if (type === "tree") {
	          return { method: "mkdir", filepath };
	        } else {
	          if (wasStaged)
	            stageUpdated.push({
	              filepath,
	              oid,
	              stats: await fs.lstat(join(dir, filepath))
	            });
	          return {
	            method: "write",
	            filepath,
	            oid
	          };
	        }
	      }
	    }
	  });
	  await acquireLock$1({ fs, gitdir, dirRemoved, ops }, async () => {
	    for (const op of ops) {
	      const currentFilepath = join(dir, op.filepath);
	      switch (op.method) {
	        case "rmdir":
	          await fs.rmdir(currentFilepath);
	          break;
	        case "mkdir":
	          await fs.mkdir(currentFilepath);
	          break;
	        case "rm":
	          await fs.rm(currentFilepath);
	          break;
	        case "write":
	          if (!dirRemoved.some(
	            (removedDir) => currentFilepath.startsWith(removedDir)
	          )) {
	            const { object } = await _readObject({
	              fs,
	              cache: {},
	              gitdir,
	              oid: op.oid
	            });
	            if (await fs.exists(currentFilepath)) {
	              await fs.rm(currentFilepath);
	            }
	            await fs.write(currentFilepath, object);
	          }
	          break;
	      }
	    }
	  });
	  await GitIndexManager.acquire({ fs, gitdir, cache: {} }, async (index2) => {
	    stageUpdated.forEach(({ filepath, stats, oid }) => {
	      index2.insert({ filepath, stats, oid });
	    });
	  });
	}
	async function _cherryPick({
	  fs,
	  cache,
	  dir,
	  gitdir,
	  oid,
	  dryRun = false,
	  noUpdateBranch = false,
	  abortOnConflict = true,
	  committer,
	  mergeDriver
	}) {
	  const { commit: cherryCommit, oid: cherryOid } = await _readCommit({
	    fs,
	    cache,
	    gitdir,
	    oid
	  });
	  if (cherryCommit.parent.length > 1) {
	    throw new CherryPickMergeCommitError(cherryOid, cherryCommit.parent.length);
	  }
	  if (cherryCommit.parent.length === 0) {
	    throw new CherryPickRootCommitError(cherryOid);
	  }
	  const currentOid = await GitRefManager.resolve({
	    fs,
	    gitdir,
	    ref: "HEAD"
	  });
	  const { commit: currentCommit } = await _readCommit({
	    fs,
	    cache,
	    gitdir,
	    oid: currentOid
	  });
	  const cherryParentOid = cherryCommit.parent[0];
	  const { commit: cherryParent } = await _readCommit({
	    fs,
	    cache,
	    gitdir,
	    oid: cherryParentOid
	  });
	  const mergedTreeOid = await GitIndexManager.acquire(
	    { fs, gitdir, cache, allowUnmerged: false },
	    async (index2) => {
	      return mergeTree({
	        fs,
	        cache,
	        dir,
	        gitdir,
	        index: index2,
	        ourOid: currentCommit.tree,
	        baseOid: cherryParent.tree,
	        theirOid: cherryCommit.tree,
	        ourName: "HEAD",
	        baseName: `parent of ${cherryOid.slice(0, 7)}`,
	        theirName: cherryOid.slice(0, 7),
	        dryRun,
	        abortOnConflict,
	        mergeDriver
	      });
	    }
	  );
	  if (mergedTreeOid instanceof MergeConflictError) {
	    throw mergedTreeOid;
	  }
	  const newOid = await _commit({
	    fs,
	    cache,
	    gitdir,
	    message: cherryCommit.message,
	    tree: mergedTreeOid,
	    parent: [currentOid],
	    // Single parent: current HEAD
	    author: cherryCommit.author,
	    // Preserve original author
	    committer,
	    // New committer
	    dryRun,
	    noUpdateBranch
	  });
	  if (dir && !dryRun && !noUpdateBranch) {
	    await applyTreeChanges({
	      fs,
	      dir,
	      gitdir,
	      stashCommit: newOid,
	      parentCommit: currentOid,
	      wasStaged: true
	    });
	  }
	  return newOid;
	}
	async function cherryPick({
	  fs: _fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  oid,
	  cache = {},
	  committer,
	  dryRun = false,
	  noUpdateBranch = false,
	  abortOnConflict = true,
	  mergeDriver
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("oid", oid);
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    const { commit: cherryCommit } = await _readCommit({
	      fs,
	      cache,
	      gitdir: updatedGitdir,
	      oid
	    });
	    if (cherryCommit.parent && cherryCommit.parent.length > 1) {
	      return await _cherryPick({
	        fs,
	        cache,
	        dir,
	        gitdir: updatedGitdir,
	        oid,
	        dryRun,
	        noUpdateBranch,
	        abortOnConflict,
	        committer: void 0,
	        mergeDriver
	      });
	    }
	    const normalizedCommitter = await normalizeCommitterObject({
	      fs,
	      gitdir: updatedGitdir,
	      committer
	    });
	    if (!normalizedCommitter) {
	      throw new MissingNameError("committer");
	    }
	    return await _cherryPick({
	      fs,
	      cache,
	      dir,
	      gitdir: updatedGitdir,
	      oid,
	      dryRun,
	      noUpdateBranch,
	      abortOnConflict,
	      committer: normalizedCommitter,
	      mergeDriver
	    });
	  } catch (err) {
	    err.caller = "git.cherryPick";
	    throw err;
	  }
	}
	const abbreviateRx = /^refs\/(heads\/|tags\/|remotes\/)?(.*)/;
	function abbreviateRef(ref) {
	  const match = abbreviateRx.exec(ref);
	  if (match) {
	    if (match[1] === "remotes/" && ref.endsWith("/HEAD")) {
	      return match[2].slice(0, -5);
	    } else {
	      return match[2];
	    }
	  }
	  return ref;
	}
	async function _currentBranch({
	  fs,
	  gitdir,
	  fullname = false,
	  test = false
	}) {
	  const ref = await GitRefManager.resolve({
	    fs,
	    gitdir,
	    ref: "HEAD",
	    depth: 2
	  });
	  if (test) {
	    try {
	      await GitRefManager.resolve({ fs, gitdir, ref });
	    } catch (_) {
	      return;
	    }
	  }
	  if (!ref.startsWith("refs/")) return;
	  return fullname ? ref : abbreviateRef(ref);
	}
	function translateSSHtoHTTP(url) {
	  url = url.replace(/^git@([^:]+):/, "https://$1/");
	  url = url.replace(/^ssh:\/\//, "https://");
	  return url;
	}
	function calculateBasicAuthHeader({ username = "", password = "" }) {
	  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
	}
	async function forAwait(iterable, cb) {
	  const iter = getIterator(iterable);
	  while (true) {
	    const { value, done } = await iter.next();
	    if (value) await cb(value);
	    if (done) break;
	  }
	  if (iter.return) iter.return();
	}
	async function collect(iterable) {
	  let size = 0;
	  const buffers = [];
	  await forAwait(iterable, (value) => {
	    buffers.push(value);
	    size += value.byteLength;
	  });
	  const result = new Uint8Array(size);
	  let nextIndex = 0;
	  for (const buffer of buffers) {
	    result.set(buffer, nextIndex);
	    nextIndex += buffer.byteLength;
	  }
	  return result;
	}
	function extractAuthFromUrl(url) {
	  let userpass = url.match(/^https?:\/\/([^/]+)@/);
	  if (userpass == null) return { url, auth: {} };
	  userpass = userpass[1];
	  const [username, password] = userpass.split(":");
	  url = url.replace(`${userpass}@`, "");
	  return { url, auth: { username, password } };
	}
	function padHex(b, n) {
	  const s = n.toString(16);
	  return "0".repeat(b - s.length) + s;
	}
	class GitPktLine {
	  static flush() {
	    return Buffer.from("0000", "utf8");
	  }
	  static delim() {
	    return Buffer.from("0001", "utf8");
	  }
	  static encode(line) {
	    if (typeof line === "string") {
	      line = Buffer.from(line);
	    }
	    const length = line.length + 4;
	    const hexlength = padHex(4, length);
	    return Buffer.concat([Buffer.from(hexlength, "utf8"), line]);
	  }
	  static streamReader(stream) {
	    const reader = new StreamReader(stream);
	    return async function read() {
	      try {
	        let length = await reader.read(4);
	        if (length == null) return true;
	        length = parseInt(length.toString("utf8"), 16);
	        if (length === 0) return null;
	        if (length === 1) return null;
	        const buffer = await reader.read(length - 4);
	        if (buffer == null) return true;
	        return buffer;
	      } catch (err) {
	        stream.error = err;
	        return true;
	      }
	    };
	  }
	}
	async function parseCapabilitiesV2(read) {
	  const capabilities2 = {};
	  let line;
	  while (true) {
	    line = await read();
	    if (line === true) break;
	    if (line === null) continue;
	    line = line.toString("utf8").replace(/\n$/, "");
	    const i = line.indexOf("=");
	    if (i > -1) {
	      const key = line.slice(0, i);
	      const value = line.slice(i + 1);
	      capabilities2[key] = value;
	    } else {
	      capabilities2[line] = true;
	    }
	  }
	  return { protocolVersion: 2, capabilities2 };
	}
	async function parseRefsAdResponse(stream, { service }) {
	  const capabilities = /* @__PURE__ */ new Set();
	  const refs = /* @__PURE__ */ new Map();
	  const symrefs = /* @__PURE__ */ new Map();
	  const read = GitPktLine.streamReader(stream);
	  let lineOne = await read();
	  while (lineOne === null) lineOne = await read();
	  if (lineOne === true) throw new EmptyServerResponseError();
	  if (lineOne.includes("version 2")) {
	    return parseCapabilitiesV2(read);
	  }
	  if (lineOne.toString("utf8").replace(/\n$/, "") !== `# service=${service}`) {
	    throw new ParseError(`# service=${service}\\n`, lineOne.toString("utf8"));
	  }
	  let lineTwo = await read();
	  while (lineTwo === null) lineTwo = await read();
	  if (lineTwo === true) return { capabilities, refs, symrefs };
	  lineTwo = lineTwo.toString("utf8");
	  if (lineTwo.includes("version 2")) {
	    return parseCapabilitiesV2(read);
	  }
	  const [firstRef, capabilitiesLine] = splitAndAssert(lineTwo, "\0", "\\x00");
	  capabilitiesLine.split(" ").map((x) => capabilities.add(x));
	  if (firstRef !== "0000000000000000000000000000000000000000 capabilities^{}") {
	    const [ref, name] = splitAndAssert(firstRef, " ", " ");
	    refs.set(name, ref);
	    while (true) {
	      const line = await read();
	      if (line === true) break;
	      if (line !== null) {
	        const [ref2, name2] = splitAndAssert(line.toString("utf8"), " ", " ");
	        refs.set(name2, ref2);
	      }
	    }
	  }
	  for (const cap of capabilities) {
	    if (cap.startsWith("symref=")) {
	      const m = cap.match(/symref=([^:]+):(.*)/);
	      if (m.length === 3) {
	        symrefs.set(m[1], m[2]);
	      }
	    }
	  }
	  return { protocolVersion: 1, capabilities, refs, symrefs };
	}
	function splitAndAssert(line, sep, expected) {
	  const split = line.trim().split(sep);
	  if (split.length !== 2) {
	    throw new ParseError(
	      `Two strings separated by '${expected}'`,
	      line.toString("utf8")
	    );
	  }
	  return split;
	}
	const corsProxify = (corsProxy, url) => corsProxy.endsWith("?") ? `${corsProxy}${url}` : `${corsProxy}/${url.replace(/^https?:\/\//, "")}`;
	const updateHeaders = (headers, auth) => {
	  if (auth.username || auth.password) {
	    headers.Authorization = calculateBasicAuthHeader(auth);
	  }
	  if (auth.headers) {
	    Object.assign(headers, auth.headers);
	  }
	};
	const stringifyBody = async (res) => {
	  try {
	    const data = Buffer.from(await collect(res.body));
	    const response = data.toString("utf8");
	    const preview = response.length < 256 ? response : response.slice(0, 256) + "...";
	    return { preview, response, data };
	  } catch (e) {
	    return {};
	  }
	};
	class GitRemoteHTTP {
	  /**
	   * Returns the capabilities of the GitRemoteHTTP class.
	   *
	   * @returns {Promise<string[]>} - An array of supported capabilities.
	   */
	  static async capabilities() {
	    return ["discover", "connect"];
	  }
	  /**
	   * Discovers references from a remote Git repository.
	   *
	   * @param {Object} args
	   * @param {HttpClient} args.http - The HTTP client to use for requests.
	   * @param {ProgressCallback} [args.onProgress] - Callback for progress updates.
	   * @param {AuthCallback} [args.onAuth] - Callback for providing authentication credentials.
	   * @param {AuthFailureCallback} [args.onAuthFailure] - Callback for handling authentication failures.
	   * @param {AuthSuccessCallback} [args.onAuthSuccess] - Callback for handling successful authentication.
	   * @param {string} [args.corsProxy] - Optional CORS proxy URL.
	   * @param {string} args.service - The Git service (e.g., "git-upload-pack").
	   * @param {string} args.url - The URL of the remote repository.
	   * @param {Object<string, string>} args.headers - HTTP headers to include in the request.
	   * @param {1 | 2} args.protocolVersion - The Git protocol version to use.
	   * @returns {Promise<Object>} - The parsed response from the remote repository.
	   * @throws {HttpError} - If the HTTP request fails.
	   * @throws {SmartHttpError} - If the response cannot be parsed.
	   * @throws {UserCanceledError} - If the user cancels the operation.
	   */
	  static async discover({
	    http,
	    onProgress,
	    onAuth,
	    onAuthSuccess,
	    onAuthFailure,
	    corsProxy,
	    service,
	    url: _origUrl,
	    headers,
	    protocolVersion
	  }) {
	    let { url, auth } = extractAuthFromUrl(_origUrl);
	    const proxifiedURL = corsProxy ? corsProxify(corsProxy, url) : url;
	    if (auth.username || auth.password) {
	      headers.Authorization = calculateBasicAuthHeader(auth);
	    }
	    if (protocolVersion === 2) {
	      headers["Git-Protocol"] = "version=2";
	    }
	    let res;
	    let tryAgain;
	    let providedAuthBefore = false;
	    do {
	      res = await http.request({
	        onProgress,
	        method: "GET",
	        url: `${proxifiedURL}/info/refs?service=${service}`,
	        headers
	      });
	      tryAgain = false;
	      if (res.statusCode === 401 || res.statusCode === 203) {
	        const getAuth = providedAuthBefore ? onAuthFailure : onAuth;
	        if (getAuth) {
	          auth = await getAuth(url, {
	            ...auth,
	            headers: { ...headers }
	          });
	          if (auth && auth.cancel) {
	            throw new UserCanceledError();
	          } else if (auth) {
	            updateHeaders(headers, auth);
	            providedAuthBefore = true;
	            tryAgain = true;
	          }
	        }
	      } else if (res.statusCode === 200 && providedAuthBefore && onAuthSuccess) {
	        await onAuthSuccess(url, auth);
	      }
	    } while (tryAgain);
	    if (res.statusCode !== 200) {
	      const { response } = await stringifyBody(res);
	      throw new HttpError(res.statusCode, res.statusMessage, response);
	    }
	    if (res.headers["content-type"] === `application/x-${service}-advertisement`) {
	      const remoteHTTP = await parseRefsAdResponse(res.body, { service });
	      remoteHTTP.auth = auth;
	      return remoteHTTP;
	    } else {
	      const { preview, response, data } = await stringifyBody(res);
	      try {
	        const remoteHTTP = await parseRefsAdResponse([data], { service });
	        remoteHTTP.auth = auth;
	        return remoteHTTP;
	      } catch (e) {
	        throw new SmartHttpError(preview, response);
	      }
	    }
	  }
	  /**
	   * Connects to a remote Git repository and sends a request.
	   *
	   * @param {Object} args
	   * @param {HttpClient} args.http - The HTTP client to use for requests.
	   * @param {ProgressCallback} [args.onProgress] - Callback for progress updates.
	   * @param {string} [args.corsProxy] - Optional CORS proxy URL.
	   * @param {string} args.service - The Git service (e.g., "git-upload-pack").
	   * @param {string} args.url - The URL of the remote repository.
	   * @param {Object<string, string>} [args.headers] - HTTP headers to include in the request.
	   * @param {any} args.body - The request body to send.
	   * @param {any} args.auth - Authentication credentials.
	   * @returns {Promise<GitHttpResponse>} - The HTTP response from the remote repository.
	   * @throws {HttpError} - If the HTTP request fails.
	   */
	  static async connect({
	    http,
	    onProgress,
	    corsProxy,
	    service,
	    url,
	    auth,
	    body,
	    headers
	  }) {
	    const urlAuth = extractAuthFromUrl(url);
	    if (urlAuth) url = urlAuth.url;
	    if (corsProxy) url = corsProxify(corsProxy, url);
	    headers["content-type"] = `application/x-${service}-request`;
	    headers.accept = `application/x-${service}-result`;
	    updateHeaders(headers, auth);
	    const res = await http.request({
	      onProgress,
	      method: "POST",
	      url: `${url}/${service}`,
	      body,
	      headers
	    });
	    if (res.statusCode !== 200) {
	      const { response } = stringifyBody(res);
	      throw new HttpError(res.statusCode, res.statusMessage, response);
	    }
	    return res;
	  }
	}
	class GitRemoteManager {
	  /**
	   * Determines the appropriate remote helper for the given URL.
	   *
	   * @param {Object} args
	   * @param {string} args.url - The URL of the remote repository.
	   * @returns {Object} - The remote helper class for the specified transport.
	   * @throws {UrlParseError} - If the URL cannot be parsed.
	   * @throws {UnknownTransportError} - If the transport is not supported.
	   */
	  static getRemoteHelperFor({ url }) {
	    const remoteHelpers = /* @__PURE__ */ new Map();
	    remoteHelpers.set("http", GitRemoteHTTP);
	    remoteHelpers.set("https", GitRemoteHTTP);
	    const parts = parseRemoteUrl({ url });
	    if (!parts) {
	      throw new UrlParseError(url);
	    }
	    if (remoteHelpers.has(parts.transport)) {
	      return remoteHelpers.get(parts.transport);
	    }
	    throw new UnknownTransportError(
	      url,
	      parts.transport,
	      parts.transport === "ssh" ? translateSSHtoHTTP(url) : void 0
	    );
	  }
	}
	function parseRemoteUrl({ url }) {
	  if (url.startsWith("git@")) {
	    return {
	      transport: "ssh",
	      address: url
	    };
	  }
	  const matches = url.match(/(\w+)(:\/\/|::)(.*)/);
	  if (matches === null) return;
	  if (matches[2] === "://") {
	    return {
	      transport: matches[1],
	      address: matches[0]
	    };
	  }
	  if (matches[2] === "::") {
	    return {
	      transport: matches[1],
	      address: matches[3]
	    };
	  }
	}
	let lock$3 = null;
	class GitShallowManager {
	  /**
	   * Reads the `shallow` file in the Git repository and returns a set of object IDs (OIDs).
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @returns {Promise<Set<string>>} - A set of shallow object IDs.
	   */
	  static async read({ fs, gitdir }) {
	    if (lock$3 === null) lock$3 = new AsyncLock();
	    const filepath = join(gitdir, "shallow");
	    const oids = /* @__PURE__ */ new Set();
	    await lock$3.acquire(filepath, async function() {
	      const text = await fs.read(filepath, { encoding: "utf8" });
	      if (text === null) return oids;
	      if (text.trim() === "") return oids;
	      text.trim().split("\n").map((oid) => oids.add(oid));
	    });
	    return oids;
	  }
	  /**
	   * Writes a set of object IDs (OIDs) to the `shallow` file in the Git repository.
	   * If the set is empty, the `shallow` file is removed.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} [args.gitdir] - [required] The [git directory](dir-vs-gitdir.md) path
	   * @param {Set<string>} args.oids - A set of shallow object IDs to write.
	   * @returns {Promise<void>}
	   */
	  static async write({ fs, gitdir, oids }) {
	    if (lock$3 === null) lock$3 = new AsyncLock();
	    const filepath = join(gitdir, "shallow");
	    if (oids.size > 0) {
	      const text = [...oids].join("\n") + "\n";
	      await lock$3.acquire(filepath, async function() {
	        await fs.write(filepath, text, {
	          encoding: "utf8"
	        });
	      });
	    } else {
	      await lock$3.acquire(filepath, async function() {
	        await fs.rm(filepath);
	      });
	    }
	  }
	}
	async function hasObjectLoose({ fs, gitdir, oid }) {
	  const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
	  return fs.exists(`${gitdir}/${source}`);
	}
	async function hasObjectPacked({
	  fs,
	  cache,
	  gitdir,
	  oid,
	  getExternalRefDelta
	}) {
	  let list = await fs.readdir(join(gitdir, "objects/pack"));
	  list = list.filter((x) => x.endsWith(".idx"));
	  for (const filename of list) {
	    const indexFile = `${gitdir}/objects/pack/${filename}`;
	    const p = await readPackIndex({
	      fs,
	      cache,
	      filename: indexFile,
	      getExternalRefDelta
	    });
	    if (p.error) throw new InternalError(p.error);
	    if (p.offsets.has(oid)) {
	      return true;
	    }
	  }
	  return false;
	}
	async function hasObject({
	  fs,
	  cache,
	  gitdir,
	  oid,
	  format = "content"
	}) {
	  const getExternalRefDelta = (oid2) => _readObject({ fs, cache, gitdir, oid: oid2 });
	  let result = await hasObjectLoose({ fs, gitdir, oid });
	  if (!result) {
	    result = await hasObjectPacked({
	      fs,
	      cache,
	      gitdir,
	      oid,
	      getExternalRefDelta
	    });
	  }
	  return result;
	}
	function emptyPackfile(pack) {
	  const pheader = "5041434b";
	  const version2 = "00000002";
	  const obCount = "00000000";
	  const header = pheader + version2 + obCount;
	  return pack.slice(0, 12).toString("hex") === header;
	}
	function filterCapabilities(server, client) {
	  const serverNames = server.map((cap) => cap.split("=", 1)[0]);
	  return client.filter((cap) => {
	    const name = cap.split("=", 1)[0];
	    return serverNames.includes(name);
	  });
	}
	const pkg = {
	  name: "isomorphic-git",
	  version: "1.37.5",
	  agent: "git/isomorphic-git@1.37.5"
	};
	class FIFO {
	  constructor() {
	    this._queue = [];
	  }
	  write(chunk) {
	    if (this._ended) {
	      throw Error("You cannot write to a FIFO that has already been ended!");
	    }
	    if (this._waiting) {
	      const resolve = this._waiting;
	      this._waiting = null;
	      resolve({ value: chunk });
	    } else {
	      this._queue.push(chunk);
	    }
	  }
	  end() {
	    this._ended = true;
	    if (this._waiting) {
	      const resolve = this._waiting;
	      this._waiting = null;
	      resolve({ done: true });
	    }
	  }
	  destroy(err) {
	    this.error = err;
	    this.end();
	  }
	  async next() {
	    if (this._queue.length > 0) {
	      return { value: this._queue.shift() };
	    }
	    if (this._ended) {
	      return { done: true };
	    }
	    if (this._waiting) {
	      throw Error(
	        "You cannot call read until the previous call to read has returned!"
	      );
	    }
	    return new Promise((resolve) => {
	      this._waiting = resolve;
	    });
	  }
	}
	function findSplit(str) {
	  const r = str.indexOf("\r");
	  const n = str.indexOf("\n");
	  if (r === -1 && n === -1) return -1;
	  if (r === -1) return n + 1;
	  if (n === -1) return r + 1;
	  if (n === r + 1) return n + 1;
	  return Math.min(r, n) + 1;
	}
	function splitLines(input) {
	  const output = new FIFO();
	  let tmp = "";
	  (async () => {
	    await forAwait(input, (chunk) => {
	      chunk = chunk.toString("utf8");
	      tmp += chunk;
	      while (true) {
	        const i = findSplit(tmp);
	        if (i === -1) break;
	        output.write(tmp.slice(0, i));
	        tmp = tmp.slice(i);
	      }
	    });
	    if (tmp.length > 0) {
	      output.write(tmp);
	    }
	    output.end();
	  })();
	  return output;
	}
	class GitSideBand {
	  static demux(input) {
	    const read = GitPktLine.streamReader(input);
	    const packetlines = new FIFO();
	    const packfile = new FIFO();
	    const progress = new FIFO();
	    const nextBit = async function() {
	      const line = await read();
	      if (line === null) return nextBit();
	      if (line === true) {
	        packetlines.end();
	        progress.end();
	        input.error ? packfile.destroy(input.error) : packfile.end();
	        return;
	      }
	      switch (line[0]) {
	        case 1: {
	          packfile.write(line.slice(1));
	          break;
	        }
	        case 2: {
	          progress.write(line.slice(1));
	          break;
	        }
	        case 3: {
	          const error = line.slice(1);
	          progress.write(error);
	          packetlines.end();
	          progress.end();
	          packfile.destroy(new Error(error.toString("utf8")));
	          return;
	        }
	        default: {
	          packetlines.write(line);
	        }
	      }
	      nextBit();
	    };
	    nextBit();
	    return {
	      packetlines,
	      packfile,
	      progress
	    };
	  }
	  // static mux ({
	  //   protocol, // 'side-band' or 'side-band-64k'
	  //   packetlines,
	  //   packfile,
	  //   progress,
	  //   error
	  // }) {
	  //   const MAX_PACKET_LENGTH = protocol === 'side-band-64k' ? 999 : 65519
	  //   let output = new PassThrough()
	  //   packetlines.on('data', data => {
	  //     if (data === null) {
	  //       output.write(GitPktLine.flush())
	  //     } else {
	  //       output.write(GitPktLine.encode(data))
	  //     }
	  //   })
	  //   let packfileWasEmpty = true
	  //   let packfileEnded = false
	  //   let progressEnded = false
	  //   let errorEnded = false
	  //   let goodbye = Buffer.concat([
	  //     GitPktLine.encode(Buffer.from('010A', 'hex')),
	  //     GitPktLine.flush()
	  //   ])
	  //   packfile
	  //     .on('data', data => {
	  //       packfileWasEmpty = false
	  //       const buffers = splitBuffer(data, MAX_PACKET_LENGTH)
	  //       for (const buffer of buffers) {
	  //         output.write(
	  //           GitPktLine.encode(Buffer.concat([Buffer.from('01', 'hex'), buffer]))
	  //         )
	  //       }
	  //     })
	  //     .on('end', () => {
	  //       packfileEnded = true
	  //       if (!packfileWasEmpty) output.write(goodbye)
	  //       if (progressEnded && errorEnded) output.end()
	  //     })
	  //   progress
	  //     .on('data', data => {
	  //       const buffers = splitBuffer(data, MAX_PACKET_LENGTH)
	  //       for (const buffer of buffers) {
	  //         output.write(
	  //           GitPktLine.encode(Buffer.concat([Buffer.from('02', 'hex'), buffer]))
	  //         )
	  //       }
	  //     })
	  //     .on('end', () => {
	  //       progressEnded = true
	  //       if (packfileEnded && errorEnded) output.end()
	  //     })
	  //   error
	  //     .on('data', data => {
	  //       const buffers = splitBuffer(data, MAX_PACKET_LENGTH)
	  //       for (const buffer of buffers) {
	  //         output.write(
	  //           GitPktLine.encode(Buffer.concat([Buffer.from('03', 'hex'), buffer]))
	  //         )
	  //       }
	  //     })
	  //     .on('end', () => {
	  //       errorEnded = true
	  //       if (progressEnded && packfileEnded) output.end()
	  //     })
	  //   return output
	  // }
	}
	async function parseUploadPackResponse(stream) {
	  const { packetlines, packfile, progress } = GitSideBand.demux(stream);
	  const shallows = [];
	  const unshallows = [];
	  const acks = [];
	  let nak = false;
	  let done = false;
	  return new Promise((resolve, reject) => {
	    forAwait(packetlines, (data) => {
	      const line = data.toString("utf8").trim();
	      if (line.startsWith("shallow")) {
	        const oid = line.slice(-41).trim();
	        if (oid.length !== 40) {
	          reject(new InvalidOidError(oid));
	        }
	        shallows.push(oid);
	      } else if (line.startsWith("unshallow")) {
	        const oid = line.slice(-41).trim();
	        if (oid.length !== 40) {
	          reject(new InvalidOidError(oid));
	        }
	        unshallows.push(oid);
	      } else if (line.startsWith("ACK")) {
	        const [, oid, status2] = line.split(" ");
	        acks.push({ oid, status: status2 });
	        if (!status2) done = true;
	      } else if (line.startsWith("NAK")) {
	        nak = true;
	        done = true;
	      } else {
	        done = true;
	        nak = true;
	      }
	      if (done) {
	        stream.error ? reject(stream.error) : resolve({ shallows, unshallows, acks, nak, packfile, progress });
	      }
	    }).finally(() => {
	      if (!done) {
	        stream.error ? reject(stream.error) : resolve({ shallows, unshallows, acks, nak, packfile, progress });
	      }
	    });
	  });
	}
	function writeUploadPackRequest({
	  capabilities = [],
	  wants = [],
	  haves = [],
	  shallows = [],
	  depth = null,
	  since = null,
	  exclude = []
	}) {
	  const packstream = [];
	  wants = [...new Set(wants)];
	  let firstLineCapabilities = ` ${capabilities.join(" ")}`;
	  for (const oid of wants) {
	    packstream.push(GitPktLine.encode(`want ${oid}${firstLineCapabilities}
`));
	    firstLineCapabilities = "";
	  }
	  for (const oid of shallows) {
	    packstream.push(GitPktLine.encode(`shallow ${oid}
`));
	  }
	  if (depth !== null) {
	    packstream.push(GitPktLine.encode(`deepen ${depth}
`));
	  }
	  if (since !== null) {
	    packstream.push(
	      GitPktLine.encode(`deepen-since ${Math.floor(since.valueOf() / 1e3)}
`)
	    );
	  }
	  for (const oid of exclude) {
	    packstream.push(GitPktLine.encode(`deepen-not ${oid}
`));
	  }
	  packstream.push(GitPktLine.flush());
	  for (const oid of haves) {
	    packstream.push(GitPktLine.encode(`have ${oid}
`));
	  }
	  packstream.push(GitPktLine.encode(`done
`));
	  return packstream;
	}
	async function _fetch({
	  fs,
	  cache,
	  http,
	  onProgress,
	  onMessage,
	  onAuth,
	  onAuthSuccess,
	  onAuthFailure,
	  gitdir,
	  ref: _ref,
	  remoteRef: _remoteRef,
	  remote: _remote,
	  url: _url,
	  corsProxy,
	  depth = null,
	  since = null,
	  exclude = [],
	  relative = false,
	  tags = false,
	  singleBranch = false,
	  headers = {},
	  prune = false,
	  pruneTags = false
	}) {
	  const ref = _ref || await _currentBranch({ fs, gitdir, test: true });
	  const config = await GitConfigManager.get({ fs, gitdir });
	  const remote = _remote || ref && await config.get(`branch.${ref}.remote`) || "origin";
	  const url = _url || await config.get(`remote.${remote}.url`);
	  if (typeof url === "undefined") {
	    throw new MissingParameterError("remote OR url");
	  }
	  const remoteRef = _remoteRef || ref && await config.get(`branch.${ref}.merge`) || _ref || "HEAD";
	  if (corsProxy === void 0) {
	    corsProxy = await config.get("http.corsProxy");
	  }
	  const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
	  const remoteHTTP = await GitRemoteHTTP2.discover({
	    http,
	    onAuth,
	    onAuthSuccess,
	    onAuthFailure,
	    corsProxy,
	    service: "git-upload-pack",
	    url,
	    headers,
	    protocolVersion: 1
	  });
	  const auth = remoteHTTP.auth;
	  const remoteRefs = remoteHTTP.refs;
	  if (remoteRefs.size === 0) {
	    return {
	      defaultBranch: null,
	      fetchHead: null,
	      fetchHeadDescription: null
	    };
	  }
	  if (depth !== null && !remoteHTTP.capabilities.has("shallow")) {
	    throw new RemoteCapabilityError("shallow", "depth");
	  }
	  if (since !== null && !remoteHTTP.capabilities.has("deepen-since")) {
	    throw new RemoteCapabilityError("deepen-since", "since");
	  }
	  if (exclude.length > 0 && !remoteHTTP.capabilities.has("deepen-not")) {
	    throw new RemoteCapabilityError("deepen-not", "exclude");
	  }
	  if (relative === true && !remoteHTTP.capabilities.has("deepen-relative")) {
	    throw new RemoteCapabilityError("deepen-relative", "relative");
	  }
	  const { oid, fullref } = GitRefManager.resolveAgainstMap({
	    ref: remoteRef,
	    map: remoteRefs
	  });
	  for (const remoteRef2 of remoteRefs.keys()) {
	    if (remoteRef2 === fullref || remoteRef2 === "HEAD" || remoteRef2.startsWith("refs/heads/") || tags && remoteRef2.startsWith("refs/tags/")) {
	      continue;
	    }
	    remoteRefs.delete(remoteRef2);
	  }
	  const capabilities = filterCapabilities(
	    [...remoteHTTP.capabilities],
	    [
	      "multi_ack_detailed",
	      "no-done",
	      "side-band-64k",
	      // Note: I removed 'thin-pack' option since our code doesn't "fatten" packfiles,
	      // which is necessary for compatibility with git. It was the cause of mysterious
	      // 'fatal: pack has [x] unresolved deltas' errors that plagued us for some time.
	      // isomorphic-git is perfectly happy with thin packfiles in .git/objects/pack but
	      // canonical git it turns out is NOT.
	      "ofs-delta",
	      `agent=${pkg.agent}`
	    ]
	  );
	  if (relative) capabilities.push("deepen-relative");
	  const wants = singleBranch ? [oid] : remoteRefs.values();
	  const haveRefs = singleBranch ? [ref] : await GitRefManager.listRefs({
	    fs,
	    gitdir,
	    filepath: `refs`
	  });
	  let haves = [];
	  for (let ref2 of haveRefs) {
	    try {
	      ref2 = await GitRefManager.expand({ fs, gitdir, ref: ref2 });
	      const oid2 = await GitRefManager.resolve({ fs, gitdir, ref: ref2 });
	      if (await hasObject({ fs, cache, gitdir, oid: oid2 })) {
	        haves.push(oid2);
	      }
	    } catch (err) {
	    }
	  }
	  haves = [...new Set(haves)];
	  const oids = await GitShallowManager.read({ fs, gitdir });
	  const shallows = remoteHTTP.capabilities.has("shallow") ? [...oids] : [];
	  const packstream = writeUploadPackRequest({
	    capabilities,
	    wants,
	    haves,
	    shallows,
	    depth,
	    since,
	    exclude
	  });
	  const packbuffer = Buffer.from(await collect(packstream));
	  const raw = await GitRemoteHTTP2.connect({
	    http,
	    onProgress,
	    corsProxy,
	    service: "git-upload-pack",
	    url,
	    auth,
	    body: [packbuffer],
	    headers
	  });
	  const response = await parseUploadPackResponse(raw.body);
	  if (raw.headers) {
	    response.headers = raw.headers;
	  }
	  for (const oid2 of response.shallows) {
	    if (!oids.has(oid2)) {
	      try {
	        const { object } = await _readObject({ fs, cache, gitdir, oid: oid2 });
	        const commit2 = new GitCommit(object);
	        const hasParents = await Promise.all(
	          commit2.headers().parent.map((oid3) => hasObject({ fs, cache, gitdir, oid: oid3 }))
	        );
	        const haveAllParents = hasParents.length === 0 || hasParents.every((has) => has);
	        if (!haveAllParents) {
	          oids.add(oid2);
	        }
	      } catch (err) {
	        oids.add(oid2);
	      }
	    }
	  }
	  for (const oid2 of response.unshallows) {
	    oids.delete(oid2);
	  }
	  await GitShallowManager.write({ fs, gitdir, oids });
	  if (singleBranch) {
	    const refs = /* @__PURE__ */ new Map([[fullref, oid]]);
	    const symrefs = /* @__PURE__ */ new Map();
	    let bail = 10;
	    let key = fullref;
	    while (bail--) {
	      const value = remoteHTTP.symrefs.get(key);
	      if (value === void 0) break;
	      symrefs.set(key, value);
	      key = value;
	    }
	    const realRef = remoteRefs.get(key);
	    if (realRef) {
	      refs.set(key, realRef);
	    }
	    const { pruned } = await GitRefManager.updateRemoteRefs({
	      fs,
	      gitdir,
	      remote,
	      refs,
	      symrefs,
	      tags,
	      prune
	    });
	    if (prune) {
	      response.pruned = pruned;
	    }
	  } else {
	    const { pruned } = await GitRefManager.updateRemoteRefs({
	      fs,
	      gitdir,
	      remote,
	      refs: remoteRefs,
	      symrefs: remoteHTTP.symrefs,
	      tags,
	      prune,
	      pruneTags
	    });
	    if (prune) {
	      response.pruned = pruned;
	    }
	  }
	  response.HEAD = remoteHTTP.symrefs.get("HEAD");
	  if (response.HEAD === void 0) {
	    const { oid: oid2 } = GitRefManager.resolveAgainstMap({
	      ref: "HEAD",
	      map: remoteRefs
	    });
	    for (const [key, value] of remoteRefs.entries()) {
	      if (key !== "HEAD" && value === oid2) {
	        response.HEAD = key;
	        break;
	      }
	    }
	  }
	  const noun = fullref.startsWith("refs/tags") ? "tag" : "branch";
	  response.FETCH_HEAD = {
	    oid,
	    description: `${noun} '${abbreviateRef(fullref)}' of ${url}`
	  };
	  if (onProgress || onMessage) {
	    const lines = splitLines(response.progress);
	    forAwait(lines, async (line) => {
	      if (onMessage) await onMessage(line);
	      if (onProgress) {
	        const matches = line.match(/([^:]*).*\((\d+?)\/(\d+?)\)/);
	        if (matches) {
	          await onProgress({
	            phase: matches[1].trim(),
	            loaded: parseInt(matches[2], 10),
	            total: parseInt(matches[3], 10)
	          });
	        }
	      }
	    });
	  }
	  const packfile = Buffer.from(await collect(response.packfile));
	  if (raw.body.error) throw raw.body.error;
	  const packfileSha = packfile.slice(-20).toString("hex");
	  const res = {
	    defaultBranch: response.HEAD,
	    fetchHead: response.FETCH_HEAD.oid,
	    fetchHeadDescription: response.FETCH_HEAD.description
	  };
	  if (response.headers) {
	    res.headers = response.headers;
	  }
	  if (prune) {
	    res.pruned = response.pruned;
	  }
	  if (packfileSha !== "" && !emptyPackfile(packfile)) {
	    res.packfile = `objects/pack/pack-${packfileSha}.pack`;
	    const fullpath = join(gitdir, res.packfile);
	    await fs.write(fullpath, packfile);
	    const getExternalRefDelta = (oid2) => _readObject({ fs, cache, gitdir, oid: oid2 });
	    const idx = await GitPackIndex.fromPack({
	      pack: packfile,
	      getExternalRefDelta,
	      onProgress
	    });
	    await fs.write(fullpath.replace(/\.pack$/, ".idx"), await idx.toBuffer());
	  }
	  return res;
	}
	async function _init({
	  fs,
	  bare = false,
	  dir,
	  gitdir = bare ? dir : join(dir, ".git"),
	  defaultBranch = "master"
	}) {
	  if (await fs.exists(gitdir + "/config")) return;
	  let folders = [
	    "hooks",
	    "info",
	    "objects/info",
	    "objects/pack",
	    "refs/heads",
	    "refs/tags"
	  ];
	  folders = folders.map((dir2) => gitdir + "/" + dir2);
	  for (const folder of folders) {
	    await fs.mkdir(folder);
	  }
	  await fs.write(
	    gitdir + "/config",
	    `[core]
	repositoryformatversion = 0
	filemode = false
	bare = ${bare}
` + (bare ? "" : "	logallrefupdates = true\n") + "	symlinks = false\n	ignorecase = true\n"
	  );
	  await fs.write(gitdir + "/HEAD", `ref: refs/heads/${defaultBranch}
`);
	}
	async function _clone({
	  fs,
	  cache,
	  http,
	  onProgress,
	  onMessage,
	  onAuth,
	  onAuthSuccess,
	  onAuthFailure,
	  onPostCheckout,
	  dir,
	  gitdir,
	  url,
	  corsProxy,
	  ref,
	  remote,
	  depth,
	  since,
	  exclude,
	  relative,
	  singleBranch,
	  noCheckout,
	  noTags,
	  headers,
	  nonBlocking,
	  batchSize = 100
	}) {
	  try {
	    await _init({ fs, gitdir });
	    await _addRemote({ fs, gitdir, remote, url, force: false });
	    if (corsProxy) {
	      const config = await GitConfigManager.get({ fs, gitdir });
	      await config.set(`http.corsProxy`, corsProxy);
	      await GitConfigManager.save({ fs, gitdir, config });
	    }
	    const { defaultBranch, fetchHead } = await _fetch({
	      fs,
	      cache,
	      http,
	      onProgress,
	      onMessage,
	      onAuth,
	      onAuthSuccess,
	      onAuthFailure,
	      gitdir,
	      ref,
	      remote,
	      corsProxy,
	      depth,
	      since,
	      exclude,
	      relative,
	      singleBranch,
	      headers,
	      tags: !noTags
	    });
	    if (fetchHead === null) return;
	    ref = ref || defaultBranch;
	    ref = ref.replace("refs/heads/", "");
	    await _checkout({
	      fs,
	      cache,
	      onProgress,
	      onPostCheckout,
	      dir,
	      gitdir,
	      ref,
	      remote,
	      noCheckout,
	      nonBlocking,
	      batchSize
	    });
	  } catch (err) {
	    await fs.rmdir(gitdir, { recursive: true, maxRetries: 10 }).catch(() => void 0);
	    throw err;
	  }
	}
	async function clone({
	  fs,
	  http,
	  onProgress,
	  onMessage,
	  onAuth,
	  onAuthSuccess,
	  onAuthFailure,
	  onPostCheckout,
	  dir,
	  gitdir = join(dir, ".git"),
	  url,
	  corsProxy = void 0,
	  ref = void 0,
	  remote = "origin",
	  depth = void 0,
	  since = void 0,
	  exclude = [],
	  relative = false,
	  singleBranch = false,
	  noCheckout = false,
	  noTags = false,
	  headers = {},
	  cache = {},
	  nonBlocking = false,
	  batchSize = 100
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("http", http);
	    assertParameter("gitdir", gitdir);
	    if (!noCheckout) {
	      assertParameter("dir", dir);
	    }
	    assertParameter("url", url);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _clone({
	      fs: fsp,
	      cache,
	      http,
	      onProgress,
	      onMessage,
	      onAuth,
	      onAuthSuccess,
	      onAuthFailure,
	      onPostCheckout,
	      dir,
	      gitdir: updatedGitdir,
	      url,
	      corsProxy,
	      ref,
	      remote,
	      depth,
	      since,
	      exclude,
	      relative,
	      singleBranch,
	      noCheckout,
	      noTags,
	      headers,
	      nonBlocking,
	      batchSize
	    });
	  } catch (err) {
	    err.caller = "git.clone";
	    throw err;
	  }
	}
	async function commit({
	  fs: _fs,
	  onSign,
	  dir,
	  gitdir = join(dir, ".git"),
	  message,
	  author,
	  committer,
	  signingKey,
	  amend = false,
	  dryRun = false,
	  noUpdateBranch = false,
	  ref,
	  parent,
	  tree,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", _fs);
	    if (!amend) {
	      assertParameter("message", message);
	    }
	    if (signingKey) {
	      assertParameter("onSign", onSign);
	    }
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    return await _commit({
	      fs,
	      cache,
	      onSign,
	      gitdir: updatedGitdir,
	      message,
	      author,
	      committer,
	      signingKey,
	      amend,
	      dryRun,
	      noUpdateBranch,
	      ref,
	      parent,
	      tree
	    });
	  } catch (err) {
	    err.caller = "git.commit";
	    throw err;
	  }
	}
	async function currentBranch({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  fullname = false,
	  test = false
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _currentBranch({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      fullname,
	      test
	    });
	  } catch (err) {
	    err.caller = "git.currentBranch";
	    throw err;
	  }
	}
	async function _deleteBranch({ fs, gitdir, ref }) {
	  ref = ref.startsWith("refs/heads/") ? ref : `refs/heads/${ref}`;
	  const exist = await GitRefManager.exists({ fs, gitdir, ref });
	  if (!exist) {
	    throw new NotFoundError(ref);
	  }
	  const fullRef = await GitRefManager.expand({ fs, gitdir, ref });
	  const currentRef = await _currentBranch({ fs, gitdir, fullname: true });
	  if (fullRef === currentRef) {
	    const value = await GitRefManager.resolve({ fs, gitdir, ref: fullRef });
	    await GitRefManager.writeRef({ fs, gitdir, ref: "HEAD", value });
	  }
	  await GitRefManager.deleteRef({ fs, gitdir, ref: fullRef });
	  const abbrevRef = abbreviateRef(ref);
	  const config = await GitConfigManager.get({ fs, gitdir });
	  await config.deleteSection("branch", abbrevRef);
	  await GitConfigManager.save({ fs, gitdir, config });
	}
	async function deleteBranch({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("ref", ref);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _deleteBranch({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      ref
	    });
	  } catch (err) {
	    err.caller = "git.deleteBranch";
	    throw err;
	  }
	}
	async function deleteRef({ fs, dir, gitdir = join(dir, ".git"), ref }) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("ref", ref);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    await GitRefManager.deleteRef({ fs: fsp, gitdir: updatedGitdir, ref });
	  } catch (err) {
	    err.caller = "git.deleteRef";
	    throw err;
	  }
	}
	async function _deleteRemote({ fs, gitdir, remote }) {
	  const config = await GitConfigManager.get({ fs, gitdir });
	  await config.deleteSection("remote", remote);
	  await GitConfigManager.save({ fs, gitdir, config });
	}
	async function deleteRemote({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  remote
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("remote", remote);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _deleteRemote({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      remote
	    });
	  } catch (err) {
	    err.caller = "git.deleteRemote";
	    throw err;
	  }
	}
	async function _deleteTag({ fs, gitdir, ref }) {
	  ref = ref.startsWith("refs/tags/") ? ref : `refs/tags/${ref}`;
	  await GitRefManager.deleteRef({ fs, gitdir, ref });
	}
	async function deleteTag({ fs, dir, gitdir = join(dir, ".git"), ref }) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("ref", ref);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _deleteTag({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      ref
	    });
	  } catch (err) {
	    err.caller = "git.deleteTag";
	    throw err;
	  }
	}
	async function expandOidLoose({ fs, gitdir, oid: short }) {
	  const prefix = short.slice(0, 2);
	  const objectsSuffixes = await fs.readdir(`${gitdir}/objects/${prefix}`);
	  return objectsSuffixes.map((suffix) => `${prefix}${suffix}`).filter((_oid) => _oid.startsWith(short));
	}
	async function expandOidPacked({
	  fs,
	  cache,
	  gitdir,
	  oid: short,
	  getExternalRefDelta
	}) {
	  const results = [];
	  let list = await fs.readdir(join(gitdir, "objects/pack"));
	  list = list.filter((x) => x.endsWith(".idx"));
	  for (const filename of list) {
	    const indexFile = `${gitdir}/objects/pack/${filename}`;
	    const p = await readPackIndex({
	      fs,
	      cache,
	      filename: indexFile,
	      getExternalRefDelta
	    });
	    if (p.error) throw new InternalError(p.error);
	    for (const oid of p.offsets.keys()) {
	      if (oid.startsWith(short)) results.push(oid);
	    }
	  }
	  return results;
	}
	async function _expandOid({ fs, cache, gitdir, oid: short }) {
	  const getExternalRefDelta = (oid) => _readObject({ fs, cache, gitdir, oid });
	  const results = await expandOidLoose({ fs, gitdir, oid: short });
	  const packedOids = await expandOidPacked({
	    fs,
	    cache,
	    gitdir,
	    oid: short,
	    getExternalRefDelta
	  });
	  for (const packedOid of packedOids) {
	    if (results.indexOf(packedOid) === -1) {
	      results.push(packedOid);
	    }
	  }
	  if (results.length === 1) {
	    return results[0];
	  }
	  if (results.length > 1) {
	    throw new AmbiguousError("oids", short, results);
	  }
	  throw new NotFoundError(`an object matching "${short}"`);
	}
	async function expandOid({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  oid,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("oid", oid);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _expandOid({
	      fs: fsp,
	      cache,
	      gitdir: updatedGitdir,
	      oid
	    });
	  } catch (err) {
	    err.caller = "git.expandOid";
	    throw err;
	  }
	}
	async function expandRef({ fs, dir, gitdir = join(dir, ".git"), ref }) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("ref", ref);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await GitRefManager.expand({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      ref
	    });
	  } catch (err) {
	    err.caller = "git.expandRef";
	    throw err;
	  }
	}
	async function _findMergeBase({ fs, cache, gitdir, oids }) {
	  const visits = {};
	  const passes = oids.length;
	  let heads = oids.map((oid, index2) => ({ index: index2, oid }));
	  while (heads.length) {
	    const result = /* @__PURE__ */ new Set();
	    for (const { oid, index: index2 } of heads) {
	      if (!visits[oid]) visits[oid] = /* @__PURE__ */ new Set();
	      visits[oid].add(index2);
	      if (visits[oid].size === passes) {
	        result.add(oid);
	      }
	    }
	    if (result.size > 0) {
	      return [...result];
	    }
	    const newheads = /* @__PURE__ */ new Map();
	    for (const { oid, index: index2 } of heads) {
	      try {
	        const { object } = await _readObject({ fs, cache, gitdir, oid });
	        const commit2 = GitCommit.from(object);
	        const { parent } = commit2.parseHeaders();
	        for (const oid2 of parent) {
	          if (!visits[oid2] || !visits[oid2].has(index2)) {
	            newheads.set(oid2 + ":" + index2, { oid: oid2, index: index2 });
	          }
	        }
	      } catch (err) {
	      }
	    }
	    heads = Array.from(newheads.values());
	  }
	  return [];
	}
	async function _merge({
	  fs,
	  cache,
	  dir,
	  gitdir,
	  ours,
	  theirs,
	  fastForward: fastForward2 = true,
	  fastForwardOnly = false,
	  dryRun = false,
	  noUpdateBranch = false,
	  abortOnConflict = true,
	  message,
	  author,
	  committer,
	  signingKey,
	  onSign,
	  mergeDriver,
	  allowUnrelatedHistories = false
	}) {
	  if (ours === void 0) {
	    ours = await _currentBranch({ fs, gitdir, fullname: true });
	  }
	  ours = await GitRefManager.expand({
	    fs,
	    gitdir,
	    ref: ours
	  });
	  theirs = await GitRefManager.expand({
	    fs,
	    gitdir,
	    ref: theirs
	  });
	  const ourOid = await GitRefManager.resolve({
	    fs,
	    gitdir,
	    ref: ours
	  });
	  const theirOid = await GitRefManager.resolve({
	    fs,
	    gitdir,
	    ref: theirs
	  });
	  const baseOids = await _findMergeBase({
	    fs,
	    cache,
	    gitdir,
	    oids: [ourOid, theirOid]
	  });
	  if (baseOids.length !== 1) {
	    if (baseOids.length === 0 && allowUnrelatedHistories) {
	      baseOids.push("4b825dc642cb6eb9a060e54bf8d69288fbee4904");
	    } else {
	      throw new MergeNotSupportedError();
	    }
	  }
	  const baseOid = baseOids[0];
	  if (baseOid === theirOid) {
	    return {
	      oid: ourOid,
	      alreadyMerged: true
	    };
	  }
	  if (fastForward2 && baseOid === ourOid) {
	    if (!dryRun && !noUpdateBranch) {
	      await GitRefManager.writeRef({ fs, gitdir, ref: ours, value: theirOid });
	    }
	    return {
	      oid: theirOid,
	      fastForward: true
	    };
	  } else {
	    if (fastForwardOnly) {
	      throw new FastForwardError();
	    }
	    const tree = await GitIndexManager.acquire(
	      { fs, gitdir, cache, allowUnmerged: false },
	      async (index2) => {
	        return mergeTree({
	          fs,
	          cache,
	          dir,
	          gitdir,
	          index: index2,
	          ourOid,
	          theirOid,
	          baseOid,
	          ourName: abbreviateRef(ours),
	          baseName: "base",
	          theirName: abbreviateRef(theirs),
	          dryRun,
	          abortOnConflict,
	          mergeDriver
	        });
	      }
	    );
	    if (tree instanceof MergeConflictError) throw tree;
	    if (!message) {
	      message = `Merge branch '${abbreviateRef(theirs)}' into ${abbreviateRef(
	        ours
	      )}`;
	    }
	    const oid = await _commit({
	      fs,
	      cache,
	      gitdir,
	      message,
	      ref: ours,
	      tree,
	      parent: [ourOid, theirOid],
	      author,
	      committer,
	      signingKey,
	      onSign,
	      dryRun,
	      noUpdateBranch
	    });
	    return {
	      oid,
	      tree,
	      mergeCommit: true
	    };
	  }
	}
	async function _pull({
	  fs,
	  cache,
	  http,
	  onProgress,
	  onMessage,
	  onAuth,
	  onAuthSuccess,
	  onAuthFailure,
	  dir,
	  gitdir,
	  ref,
	  url,
	  remote,
	  remoteRef,
	  prune,
	  pruneTags,
	  fastForward: fastForward2,
	  fastForwardOnly,
	  corsProxy,
	  singleBranch,
	  headers,
	  author,
	  committer,
	  signingKey
	}) {
	  try {
	    if (!ref) {
	      const head = await _currentBranch({ fs, gitdir });
	      if (!head) {
	        throw new MissingParameterError("ref");
	      }
	      ref = head;
	    }
	    const { fetchHead, fetchHeadDescription } = await _fetch({
	      fs,
	      cache,
	      http,
	      onProgress,
	      onMessage,
	      onAuth,
	      onAuthSuccess,
	      onAuthFailure,
	      gitdir,
	      corsProxy,
	      ref,
	      url,
	      remote,
	      remoteRef,
	      singleBranch,
	      headers,
	      prune,
	      pruneTags
	    });
	    await _merge({
	      fs,
	      cache,
	      gitdir,
	      ours: ref,
	      theirs: fetchHead,
	      fastForward: fastForward2,
	      fastForwardOnly,
	      message: `Merge ${fetchHeadDescription}`,
	      author,
	      committer,
	      signingKey,
	      dryRun: false,
	      noUpdateBranch: false
	    });
	    await _checkout({
	      fs,
	      cache,
	      onProgress,
	      dir,
	      gitdir,
	      ref,
	      remote,
	      noCheckout: false
	    });
	  } catch (err) {
	    err.caller = "git.pull";
	    throw err;
	  }
	}
	async function fastForward({
	  fs,
	  http,
	  onProgress,
	  onMessage,
	  onAuth,
	  onAuthSuccess,
	  onAuthFailure,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref,
	  url,
	  remote,
	  remoteRef,
	  corsProxy,
	  singleBranch,
	  headers = {},
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("http", http);
	    assertParameter("gitdir", gitdir);
	    const thisWillNotBeUsed = {
	      name: "",
	      email: "",
	      timestamp: Date.now(),
	      timezoneOffset: 0
	    };
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _pull({
	      fs: fsp,
	      cache,
	      http,
	      onProgress,
	      onMessage,
	      onAuth,
	      onAuthSuccess,
	      onAuthFailure,
	      dir,
	      gitdir: updatedGitdir,
	      ref,
	      url,
	      remote,
	      remoteRef,
	      fastForwardOnly: true,
	      corsProxy,
	      singleBranch,
	      headers,
	      author: thisWillNotBeUsed,
	      committer: thisWillNotBeUsed
	    });
	  } catch (err) {
	    err.caller = "git.fastForward";
	    throw err;
	  }
	}
	async function fetch({
	  fs,
	  http,
	  onProgress,
	  onMessage,
	  onAuth,
	  onAuthSuccess,
	  onAuthFailure,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref,
	  remote,
	  remoteRef,
	  url,
	  corsProxy,
	  depth = null,
	  since = null,
	  exclude = [],
	  relative = false,
	  tags = false,
	  singleBranch = false,
	  headers = {},
	  prune = false,
	  pruneTags = false,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("http", http);
	    assertParameter("gitdir", gitdir);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _fetch({
	      fs: fsp,
	      cache,
	      http,
	      onProgress,
	      onMessage,
	      onAuth,
	      onAuthSuccess,
	      onAuthFailure,
	      gitdir: updatedGitdir,
	      ref,
	      remote,
	      remoteRef,
	      url,
	      corsProxy,
	      depth,
	      since,
	      exclude,
	      relative,
	      tags,
	      singleBranch,
	      headers,
	      prune,
	      pruneTags
	    });
	  } catch (err) {
	    err.caller = "git.fetch";
	    throw err;
	  }
	}
	async function findMergeBase({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  oids,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("oids", oids);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _findMergeBase({
	      fs: fsp,
	      cache,
	      gitdir: updatedGitdir,
	      oids
	    });
	  } catch (err) {
	    err.caller = "git.findMergeBase";
	    throw err;
	  }
	}
	async function _findRoot({ fs, filepath }) {
	  if (await fs.exists(join(filepath, ".git"))) {
	    return filepath;
	  } else {
	    const parent = dirname(filepath);
	    if (parent === filepath) {
	      throw new NotFoundError(`git root for ${filepath}`);
	    }
	    return _findRoot({ fs, filepath: parent });
	  }
	}
	async function findRoot({ fs, filepath }) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("filepath", filepath);
	    return await _findRoot({ fs: new FileSystem(fs), filepath });
	  } catch (err) {
	    err.caller = "git.findRoot";
	    throw err;
	  }
	}
	async function getConfig({ fs, dir, gitdir = join(dir, ".git"), path }) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("path", path);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _getConfig({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      path
	    });
	  } catch (err) {
	    err.caller = "git.getConfig";
	    throw err;
	  }
	}
	async function _getConfigAll({ fs, gitdir, path }) {
	  const config = await GitConfigManager.get({ fs, gitdir });
	  return config.getall(path);
	}
	async function getConfigAll({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  path
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("path", path);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _getConfigAll({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      path
	    });
	  } catch (err) {
	    err.caller = "git.getConfigAll";
	    throw err;
	  }
	}
	async function getRemoteInfo({
	  http,
	  onAuth,
	  onAuthSuccess,
	  onAuthFailure,
	  corsProxy,
	  url,
	  headers = {},
	  forPush = false
	}) {
	  try {
	    assertParameter("http", http);
	    assertParameter("url", url);
	    const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
	    const remote = await GitRemoteHTTP2.discover({
	      http,
	      onAuth,
	      onAuthSuccess,
	      onAuthFailure,
	      corsProxy,
	      service: forPush ? "git-receive-pack" : "git-upload-pack",
	      url,
	      headers,
	      protocolVersion: 1
	    });
	    const result = {
	      capabilities: [...remote.capabilities]
	    };
	    for (const [ref, oid] of remote.refs) {
	      const parts = ref.split("/");
	      const last = parts.pop();
	      let o = result;
	      for (const part of parts) {
	        o[part] = o[part] || {};
	        o = o[part];
	      }
	      o[last] = oid;
	    }
	    for (const [symref, ref] of remote.symrefs) {
	      const parts = symref.split("/");
	      const last = parts.pop();
	      let o = result;
	      for (const part of parts) {
	        o[part] = o[part] || {};
	        o = o[part];
	      }
	      o[last] = ref;
	    }
	    return result;
	  } catch (err) {
	    err.caller = "git.getRemoteInfo";
	    throw err;
	  }
	}
	function formatInfoRefs(remote, prefix, symrefs, peelTags) {
	  const refs = [];
	  for (const [key, value] of remote.refs) {
	    if (prefix && !key.startsWith(prefix)) continue;
	    if (key.endsWith("^{}")) {
	      if (peelTags) {
	        const _key = key.replace("^{}", "");
	        const last = refs[refs.length - 1];
	        const r = last.ref === _key ? last : refs.find((x) => x.ref === _key);
	        if (r === void 0) {
	          throw new Error("I did not expect this to happen");
	        }
	        r.peeled = value;
	      }
	      continue;
	    }
	    const ref = { ref: key, oid: value };
	    if (symrefs) {
	      if (remote.symrefs.has(key)) {
	        ref.target = remote.symrefs.get(key);
	      }
	    }
	    refs.push(ref);
	  }
	  return refs;
	}
	async function getRemoteInfo2({
	  http,
	  onAuth,
	  onAuthSuccess,
	  onAuthFailure,
	  corsProxy,
	  url,
	  headers = {},
	  forPush = false,
	  protocolVersion = 2
	}) {
	  try {
	    assertParameter("http", http);
	    assertParameter("url", url);
	    const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
	    const remote = await GitRemoteHTTP2.discover({
	      http,
	      onAuth,
	      onAuthSuccess,
	      onAuthFailure,
	      corsProxy,
	      service: forPush ? "git-receive-pack" : "git-upload-pack",
	      url,
	      headers,
	      protocolVersion
	    });
	    if (remote.protocolVersion === 2) {
	      return {
	        protocolVersion: remote.protocolVersion,
	        capabilities: remote.capabilities2
	      };
	    }
	    const capabilities = {};
	    for (const cap of remote.capabilities) {
	      const [key, value] = cap.split("=");
	      if (value) {
	        capabilities[key] = value;
	      } else {
	        capabilities[key] = true;
	      }
	    }
	    return {
	      protocolVersion: 1,
	      capabilities,
	      refs: formatInfoRefs(remote, void 0, true, true)
	    };
	  } catch (err) {
	    err.caller = "git.getRemoteInfo2";
	    throw err;
	  }
	}
	async function hashObject({
	  type,
	  object,
	  format = "content",
	  oid = void 0
	}) {
	  if (format !== "deflated") {
	    if (format !== "wrapped") {
	      object = GitObject.wrap({ type, object });
	    }
	    oid = await shasum(object);
	  }
	  return { oid, object };
	}
	async function hashBlob({ object }) {
	  try {
	    assertParameter("object", object);
	    if (typeof object === "string") {
	      object = Buffer.from(object, "utf8");
	    } else if (!(object instanceof Uint8Array)) {
	      object = new Uint8Array(object);
	    }
	    const type = "blob";
	    const { oid, object: _object } = await hashObject({
	      type,
	      format: "content",
	      object
	    });
	    return { oid, type, object: _object, format: "wrapped" };
	  } catch (err) {
	    err.caller = "git.hashBlob";
	    throw err;
	  }
	}
	async function _indexPack({
	  fs,
	  cache,
	  onProgress,
	  dir,
	  gitdir,
	  filepath
	}) {
	  try {
	    filepath = join(dir, filepath);
	    const pack = await fs.read(filepath);
	    const getExternalRefDelta = (oid) => _readObject({ fs, cache, gitdir, oid });
	    const idx = await GitPackIndex.fromPack({
	      pack,
	      getExternalRefDelta,
	      onProgress
	    });
	    await fs.write(filepath.replace(/\.pack$/, ".idx"), await idx.toBuffer());
	    return {
	      oids: [...idx.hashes]
	    };
	  } catch (err) {
	    err.caller = "git.indexPack";
	    throw err;
	  }
	}
	async function indexPack({
	  fs,
	  onProgress,
	  dir,
	  gitdir = join(dir, ".git"),
	  filepath,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("dir", dir);
	    assertParameter("gitdir", dir);
	    assertParameter("filepath", filepath);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _indexPack({
	      fs: fsp,
	      cache,
	      onProgress,
	      dir,
	      gitdir: updatedGitdir,
	      filepath
	    });
	  } catch (err) {
	    err.caller = "git.indexPack";
	    throw err;
	  }
	}
	async function init({
	  fs,
	  bare = false,
	  dir,
	  gitdir = bare ? dir : join(dir, ".git"),
	  defaultBranch = "master"
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    if (!bare) {
	      assertParameter("dir", dir);
	    }
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _init({
	      fs: fsp,
	      bare,
	      dir,
	      gitdir: updatedGitdir,
	      defaultBranch
	    });
	  } catch (err) {
	    err.caller = "git.init";
	    throw err;
	  }
	}
	async function _isDescendent({
	  fs,
	  cache,
	  gitdir,
	  oid,
	  ancestor,
	  depth
	}) {
	  const shallows = await GitShallowManager.read({ fs, gitdir });
	  if (!oid) {
	    throw new MissingParameterError("oid");
	  }
	  if (!ancestor) {
	    throw new MissingParameterError("ancestor");
	  }
	  if (oid === ancestor) return false;
	  const queue = [oid];
	  const visited = /* @__PURE__ */ new Set();
	  let searchdepth = 0;
	  while (queue.length) {
	    if (searchdepth++ === depth) {
	      throw new MaxDepthError(depth);
	    }
	    const oid2 = queue.shift();
	    const { type, object } = await _readObject({
	      fs,
	      cache,
	      gitdir,
	      oid: oid2
	    });
	    if (type !== "commit") {
	      throw new ObjectTypeError(oid2, type, "commit");
	    }
	    const commit2 = GitCommit.from(object).parse();
	    for (const parent of commit2.parent) {
	      if (parent === ancestor) return true;
	    }
	    if (!shallows.has(oid2)) {
	      for (const parent of commit2.parent) {
	        if (!visited.has(parent)) {
	          queue.push(parent);
	          visited.add(parent);
	        }
	      }
	    }
	  }
	  return false;
	}
	async function isDescendent({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  oid,
	  ancestor,
	  depth = -1,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("oid", oid);
	    assertParameter("ancestor", ancestor);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _isDescendent({
	      fs: fsp,
	      cache,
	      gitdir: updatedGitdir,
	      oid,
	      ancestor,
	      depth
	    });
	  } catch (err) {
	    err.caller = "git.isDescendent";
	    throw err;
	  }
	}
	async function isIgnored({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  filepath
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("dir", dir);
	    assertParameter("gitdir", gitdir);
	    assertParameter("filepath", filepath);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return GitIgnoreManager.isIgnored({
	      fs: fsp,
	      dir,
	      gitdir: updatedGitdir,
	      filepath
	    });
	  } catch (err) {
	    err.caller = "git.isIgnored";
	    throw err;
	  }
	}
	async function listBranches({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  remote
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return GitRefManager.listBranches({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      remote
	    });
	  } catch (err) {
	    err.caller = "git.listBranches";
	    throw err;
	  }
	}
	async function _listFiles({ fs, gitdir, ref, cache }) {
	  if (ref) {
	    const oid = await GitRefManager.resolve({ gitdir, fs, ref });
	    const filenames = [];
	    await accumulateFilesFromOid({
	      fs,
	      cache,
	      gitdir,
	      oid,
	      filenames,
	      prefix: ""
	    });
	    return filenames;
	  } else {
	    return GitIndexManager.acquire(
	      { fs, gitdir, cache },
	      async function(index2) {
	        return index2.entries.map((x) => x.path);
	      }
	    );
	  }
	}
	async function accumulateFilesFromOid({
	  fs,
	  cache,
	  gitdir,
	  oid,
	  filenames,
	  prefix
	}) {
	  const { tree } = await _readTree({ fs, cache, gitdir, oid });
	  for (const entry of tree) {
	    if (entry.type === "tree") {
	      await accumulateFilesFromOid({
	        fs,
	        cache,
	        gitdir,
	        oid: entry.oid,
	        filenames,
	        prefix: join(prefix, entry.path)
	      });
	    } else {
	      filenames.push(join(prefix, entry.path));
	    }
	  }
	}
	async function listFiles({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _listFiles({
	      fs: fsp,
	      cache,
	      gitdir: updatedGitdir,
	      ref
	    });
	  } catch (err) {
	    err.caller = "git.listFiles";
	    throw err;
	  }
	}
	async function _listNotes({ fs, cache, gitdir, ref }) {
	  let parent;
	  try {
	    parent = await GitRefManager.resolve({ gitdir, fs, ref });
	  } catch (err) {
	    if (err instanceof NotFoundError) {
	      return [];
	    }
	  }
	  const result = await _readTree({
	    fs,
	    cache,
	    gitdir,
	    oid: parent
	  });
	  const notes = result.tree.map((entry) => ({
	    target: entry.path,
	    note: entry.oid
	  }));
	  return notes;
	}
	async function listNotes({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref = "refs/notes/commits",
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("ref", ref);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _listNotes({
	      fs: fsp,
	      cache,
	      gitdir: updatedGitdir,
	      ref
	    });
	  } catch (err) {
	    err.caller = "git.listNotes";
	    throw err;
	  }
	}
	async function listRefs({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  filepath
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return GitRefManager.listRefs({ fs: fsp, gitdir: updatedGitdir, filepath });
	  } catch (err) {
	    err.caller = "git.listRefs";
	    throw err;
	  }
	}
	async function _listRemotes({ fs, gitdir }) {
	  const config = await GitConfigManager.get({ fs, gitdir });
	  const remoteNames = await config.getSubsections("remote");
	  const remotes = Promise.all(
	    remoteNames.map(async (remote) => {
	      const url = await config.get(`remote.${remote}.url`);
	      return { remote, url };
	    })
	  );
	  return remotes;
	}
	async function listRemotes({ fs, dir, gitdir = join(dir, ".git") }) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _listRemotes({
	      fs: fsp,
	      gitdir: updatedGitdir
	    });
	  } catch (err) {
	    err.caller = "git.listRemotes";
	    throw err;
	  }
	}
	async function parseListRefsResponse(stream) {
	  const read = GitPktLine.streamReader(stream);
	  const refs = [];
	  let line;
	  while (true) {
	    line = await read();
	    if (line === true) break;
	    if (line === null) continue;
	    line = line.toString("utf8").replace(/\n$/, "");
	    const [oid, ref, ...attrs] = line.split(" ");
	    const r = { ref, oid };
	    for (const attr of attrs) {
	      const [name, value] = attr.split(":");
	      if (name === "symref-target") {
	        r.target = value;
	      } else if (name === "peeled") {
	        r.peeled = value;
	      }
	    }
	    refs.push(r);
	  }
	  return refs;
	}
	async function writeListRefsRequest({ prefix, symrefs, peelTags }) {
	  const packstream = [];
	  packstream.push(GitPktLine.encode("command=ls-refs\n"));
	  packstream.push(GitPktLine.encode(`agent=${pkg.agent}
`));
	  if (peelTags || symrefs || prefix) {
	    packstream.push(GitPktLine.delim());
	  }
	  if (peelTags) packstream.push(GitPktLine.encode("peel"));
	  if (symrefs) packstream.push(GitPktLine.encode("symrefs"));
	  if (prefix) packstream.push(GitPktLine.encode(`ref-prefix ${prefix}`));
	  packstream.push(GitPktLine.flush());
	  return packstream;
	}
	async function listServerRefs({
	  http,
	  onAuth,
	  onAuthSuccess,
	  onAuthFailure,
	  corsProxy,
	  url,
	  headers = {},
	  forPush = false,
	  protocolVersion = 2,
	  prefix,
	  symrefs,
	  peelTags
	}) {
	  try {
	    assertParameter("http", http);
	    assertParameter("url", url);
	    const remote = await GitRemoteHTTP.discover({
	      http,
	      onAuth,
	      onAuthSuccess,
	      onAuthFailure,
	      corsProxy,
	      service: forPush ? "git-receive-pack" : "git-upload-pack",
	      url,
	      headers,
	      protocolVersion
	    });
	    if (remote.protocolVersion === 1) {
	      return formatInfoRefs(remote, prefix, symrefs, peelTags);
	    }
	    const body = await writeListRefsRequest({ prefix, symrefs, peelTags });
	    const res = await GitRemoteHTTP.connect({
	      http,
	      auth: remote.auth,
	      headers,
	      corsProxy,
	      service: forPush ? "git-receive-pack" : "git-upload-pack",
	      url,
	      body
	    });
	    return parseListRefsResponse(res.body);
	  } catch (err) {
	    err.caller = "git.listServerRefs";
	    throw err;
	  }
	}
	async function listTags({ fs, dir, gitdir = join(dir, ".git") }) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return GitRefManager.listTags({ fs: fsp, gitdir: updatedGitdir });
	  } catch (err) {
	    err.caller = "git.listTags";
	    throw err;
	  }
	}
	function compareAge(a, b) {
	  return a.committer.timestamp - b.committer.timestamp;
	}
	const EMPTY_OID = "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391";
	async function resolveFileIdInTree({ fs, cache, gitdir, oid, fileId }) {
	  if (fileId === EMPTY_OID) return;
	  const _oid = oid;
	  let filepath;
	  const result = await resolveTree({ fs, cache, gitdir, oid });
	  const tree = result.tree;
	  if (fileId === result.oid) {
	    filepath = result.path;
	  } else {
	    filepath = await _resolveFileId({
	      fs,
	      cache,
	      gitdir,
	      tree,
	      fileId,
	      oid: _oid
	    });
	    if (Array.isArray(filepath)) {
	      if (filepath.length === 0) filepath = void 0;
	      else if (filepath.length === 1) filepath = filepath[0];
	    }
	  }
	  return filepath;
	}
	async function _resolveFileId({
	  fs,
	  cache,
	  gitdir,
	  tree,
	  fileId,
	  oid,
	  filepaths = [],
	  parentPath = ""
	}) {
	  const walks = tree.entries().map(function(entry) {
	    let result;
	    if (entry.oid === fileId) {
	      result = join(parentPath, entry.path);
	      filepaths.push(result);
	    } else if (entry.type === "tree") {
	      result = _readObject({
	        fs,
	        cache,
	        gitdir,
	        oid: entry.oid
	      }).then(function({ object }) {
	        return _resolveFileId({
	          fs,
	          cache,
	          gitdir,
	          tree: GitTree.from(object),
	          fileId,
	          oid,
	          filepaths,
	          parentPath: join(parentPath, entry.path)
	        });
	      });
	    }
	    return result;
	  });
	  await Promise.all(walks);
	  return filepaths;
	}
	async function _log({
	  fs,
	  cache,
	  gitdir,
	  filepath,
	  ref,
	  depth,
	  since,
	  force,
	  follow
	}) {
	  const sinceTimestamp = typeof since === "undefined" ? void 0 : Math.floor(since.valueOf() / 1e3);
	  const commits = [];
	  const shallowCommits = await GitShallowManager.read({ fs, gitdir });
	  const oid = await GitRefManager.resolve({ fs, gitdir, ref });
	  const tips = [await _readCommit({ fs, cache, gitdir, oid })];
	  let lastFileOid;
	  let lastCommit;
	  let isOk;
	  function endCommit(commit2) {
	    if (isOk && filepath) commits.push(commit2);
	  }
	  while (tips.length > 0) {
	    const commit2 = tips.pop();
	    if (sinceTimestamp !== void 0 && commit2.commit.committer.timestamp <= sinceTimestamp) {
	      break;
	    }
	    if (filepath) {
	      let vFileOid;
	      try {
	        vFileOid = await resolveFilepath({
	          fs,
	          cache,
	          gitdir,
	          oid: commit2.commit.tree,
	          filepath
	        });
	        if (lastCommit && lastFileOid !== vFileOid) {
	          commits.push(lastCommit);
	        }
	        lastFileOid = vFileOid;
	        lastCommit = commit2;
	        isOk = true;
	      } catch (e) {
	        if (e instanceof NotFoundError) {
	          let found = follow && lastFileOid;
	          if (found) {
	            found = await resolveFileIdInTree({
	              fs,
	              cache,
	              gitdir,
	              oid: commit2.commit.tree,
	              fileId: lastFileOid
	            });
	            if (found) {
	              if (Array.isArray(found)) {
	                if (lastCommit) {
	                  const lastFound = await resolveFileIdInTree({
	                    fs,
	                    cache,
	                    gitdir,
	                    oid: lastCommit.commit.tree,
	                    fileId: lastFileOid
	                  });
	                  if (Array.isArray(lastFound)) {
	                    found = found.filter((p) => lastFound.indexOf(p) === -1);
	                    if (found.length === 1) {
	                      found = found[0];
	                      filepath = found;
	                      if (lastCommit) commits.push(lastCommit);
	                    } else {
	                      found = false;
	                      if (lastCommit) commits.push(lastCommit);
	                      break;
	                    }
	                  }
	                }
	              } else {
	                filepath = found;
	                if (lastCommit) commits.push(lastCommit);
	              }
	            }
	          }
	          if (!found) {
	            if (isOk && lastFileOid) {
	              commits.push(lastCommit);
	              if (!force) break;
	            }
	            if (!force && !follow) throw e;
	          }
	          lastCommit = commit2;
	          isOk = false;
	        } else throw e;
	      }
	    } else {
	      commits.push(commit2);
	    }
	    if (depth !== void 0 && commits.length === depth) {
	      endCommit(commit2);
	      break;
	    }
	    if (!shallowCommits.has(commit2.oid)) {
	      for (const oid2 of commit2.commit.parent) {
	        const commit3 = await _readCommit({ fs, cache, gitdir, oid: oid2 });
	        if (!tips.map((commit4) => commit4.oid).includes(commit3.oid)) {
	          tips.push(commit3);
	        }
	      }
	    }
	    if (tips.length === 0) {
	      endCommit(commit2);
	    }
	    tips.sort((a, b) => compareAge(a.commit, b.commit));
	  }
	  return commits;
	}
	async function log({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  filepath,
	  ref = "HEAD",
	  depth,
	  since,
	  // Date
	  force,
	  follow,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("ref", ref);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _log({
	      fs: fsp,
	      cache,
	      gitdir: updatedGitdir,
	      filepath,
	      ref,
	      depth,
	      since,
	      force,
	      follow
	    });
	  } catch (err) {
	    err.caller = "git.log";
	    throw err;
	  }
	}
	async function merge({
	  fs: _fs,
	  onSign,
	  dir,
	  gitdir = join(dir, ".git"),
	  ours,
	  theirs,
	  fastForward: fastForward2 = true,
	  fastForwardOnly = false,
	  dryRun = false,
	  noUpdateBranch = false,
	  abortOnConflict = true,
	  message,
	  author: _author,
	  committer: _committer,
	  signingKey,
	  cache = {},
	  mergeDriver,
	  allowUnrelatedHistories = false
	}) {
	  try {
	    assertParameter("fs", _fs);
	    if (signingKey) {
	      assertParameter("onSign", onSign);
	    }
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    const author = await normalizeAuthorObject({
	      fs,
	      gitdir: updatedGitdir,
	      author: _author
	    });
	    if (!author && (!fastForwardOnly || !fastForward2)) {
	      throw new MissingNameError("author");
	    }
	    const committer = await normalizeCommitterObject({
	      fs,
	      gitdir: updatedGitdir,
	      author,
	      committer: _committer
	    });
	    if (!committer && (!fastForwardOnly || !fastForward2)) {
	      throw new MissingNameError("committer");
	    }
	    return await _merge({
	      fs,
	      cache,
	      dir,
	      gitdir: updatedGitdir,
	      ours,
	      theirs,
	      fastForward: fastForward2,
	      fastForwardOnly,
	      dryRun,
	      noUpdateBranch,
	      abortOnConflict,
	      message,
	      author,
	      committer,
	      signingKey,
	      onSign,
	      mergeDriver,
	      allowUnrelatedHistories
	    });
	  } catch (err) {
	    err.caller = "git.merge";
	    throw err;
	  }
	}
	const types = {
	  commit: 16,
	  tree: 32,
	  blob: 48,
	  tag: 64,
	  ofs_delta: 96,
	  ref_delta: 112
	};
	async function _pack({
	  fs,
	  cache,
	  dir,
	  gitdir = join(dir, ".git"),
	  oids
	}) {
	  const hash = new Hash();
	  const outputStream = [];
	  function write(chunk, enc) {
	    const buff = Buffer.from(chunk, enc);
	    outputStream.push(buff);
	    hash.update(buff);
	  }
	  async function writeObject2({ stype, object }) {
	    const type = types[stype];
	    let length = object.length;
	    let multibyte = length > 15 ? 128 : 0;
	    const lastFour = length & 15;
	    length = length >>> 4;
	    let byte = (multibyte | type | lastFour).toString(16);
	    write(byte, "hex");
	    while (multibyte) {
	      multibyte = length > 127 ? 128 : 0;
	      byte = multibyte | length & 127;
	      write(padHex(2, byte), "hex");
	      length = length >>> 7;
	    }
	    write(Buffer.from(await deflate(object)));
	  }
	  write("PACK");
	  write("00000002", "hex");
	  write(padHex(8, oids.length), "hex");
	  for (const oid of oids) {
	    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
	    await writeObject2({ object, stype: type });
	  }
	  const digest = hash.digest();
	  outputStream.push(digest);
	  return outputStream;
	}
	async function _packObjects({ fs, cache, gitdir, oids, write }) {
	  const buffers = await _pack({ fs, cache, gitdir, oids });
	  const packfile = Buffer.from(await collect(buffers));
	  const packfileSha = packfile.slice(-20).toString("hex");
	  const filename = `pack-${packfileSha}.pack`;
	  if (write) {
	    await fs.write(join(gitdir, `objects/pack/${filename}`), packfile);
	    return { filename };
	  }
	  return {
	    filename,
	    packfile: new Uint8Array(packfile)
	  };
	}
	async function packObjects({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  oids,
	  write = false,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("oids", oids);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _packObjects({
	      fs: fsp,
	      cache,
	      gitdir: updatedGitdir,
	      oids,
	      write
	    });
	  } catch (err) {
	    err.caller = "git.packObjects";
	    throw err;
	  }
	}
	async function pull({
	  fs: _fs,
	  http,
	  onProgress,
	  onMessage,
	  onAuth,
	  onAuthSuccess,
	  onAuthFailure,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref,
	  url,
	  remote,
	  remoteRef,
	  prune = false,
	  pruneTags = false,
	  fastForward: fastForward2 = true,
	  fastForwardOnly = false,
	  corsProxy,
	  singleBranch,
	  headers = {},
	  author: _author,
	  committer: _committer,
	  signingKey,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    const author = await normalizeAuthorObject({
	      fs,
	      gitdir: updatedGitdir,
	      author: _author
	    });
	    if (!author) throw new MissingNameError("author");
	    const committer = await normalizeCommitterObject({
	      fs,
	      gitdir: updatedGitdir,
	      author,
	      committer: _committer
	    });
	    if (!committer) throw new MissingNameError("committer");
	    return await _pull({
	      fs,
	      cache,
	      http,
	      onProgress,
	      onMessage,
	      onAuth,
	      onAuthSuccess,
	      onAuthFailure,
	      dir,
	      gitdir: updatedGitdir,
	      ref,
	      url,
	      remote,
	      remoteRef,
	      fastForward: fastForward2,
	      fastForwardOnly,
	      corsProxy,
	      singleBranch,
	      headers,
	      author,
	      committer,
	      signingKey,
	      prune,
	      pruneTags
	    });
	  } catch (err) {
	    err.caller = "git.pull";
	    throw err;
	  }
	}
	async function listCommitsAndTags({
	  fs,
	  cache,
	  dir,
	  gitdir = join(dir, ".git"),
	  start,
	  finish
	}) {
	  const shallows = await GitShallowManager.read({ fs, gitdir });
	  const startingSet = /* @__PURE__ */ new Set();
	  const finishingSet = /* @__PURE__ */ new Set();
	  for (const ref of start) {
	    startingSet.add(await GitRefManager.resolve({ fs, gitdir, ref }));
	  }
	  for (const ref of finish) {
	    try {
	      const oid = await GitRefManager.resolve({ fs, gitdir, ref });
	      finishingSet.add(oid);
	    } catch (err) {
	    }
	  }
	  const visited = /* @__PURE__ */ new Set();
	  async function walk2(oid) {
	    visited.add(oid);
	    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
	    if (type === "tag") {
	      const tag2 = GitAnnotatedTag.from(object);
	      const commit2 = tag2.headers().object;
	      return walk2(commit2);
	    }
	    if (type !== "commit") {
	      throw new ObjectTypeError(oid, type, "commit");
	    }
	    if (!shallows.has(oid)) {
	      const commit2 = GitCommit.from(object);
	      const parents = commit2.headers().parent;
	      for (oid of parents) {
	        if (!finishingSet.has(oid) && !visited.has(oid)) {
	          await walk2(oid);
	        }
	      }
	    }
	  }
	  for (const oid of startingSet) {
	    await walk2(oid);
	  }
	  return visited;
	}
	async function listObjects({
	  fs,
	  cache,
	  dir,
	  gitdir = join(dir, ".git"),
	  oids
	}) {
	  const visited = /* @__PURE__ */ new Set();
	  async function walk2(oid) {
	    if (visited.has(oid)) return;
	    visited.add(oid);
	    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
	    if (type === "tag") {
	      const tag2 = GitAnnotatedTag.from(object);
	      const obj = tag2.headers().object;
	      await walk2(obj);
	    } else if (type === "commit") {
	      const commit2 = GitCommit.from(object);
	      const tree = commit2.headers().tree;
	      await walk2(tree);
	    } else if (type === "tree") {
	      const tree = GitTree.from(object);
	      for (const entry of tree) {
	        if (entry.type === "blob") {
	          visited.add(entry.oid);
	        }
	        if (entry.type === "tree") {
	          await walk2(entry.oid);
	        }
	      }
	    }
	  }
	  for (const oid of oids) {
	    await walk2(oid);
	  }
	  return visited;
	}
	async function parseReceivePackResponse(packfile) {
	  const result = {};
	  let response = "";
	  const read = GitPktLine.streamReader(packfile);
	  let line = await read();
	  while (line !== true) {
	    if (line !== null) response += line.toString("utf8") + "\n";
	    line = await read();
	  }
	  const lines = response.toString("utf8").split("\n");
	  line = lines.shift();
	  if (!line.startsWith("unpack ")) {
	    throw new ParseError('unpack ok" or "unpack [error message]', line);
	  }
	  result.ok = line === "unpack ok";
	  if (!result.ok) {
	    result.error = line.slice("unpack ".length);
	  }
	  result.refs = {};
	  for (const line2 of lines) {
	    if (line2.trim() === "") continue;
	    const status2 = line2.slice(0, 2);
	    const refAndMessage = line2.slice(3);
	    let space = refAndMessage.indexOf(" ");
	    if (space === -1) space = refAndMessage.length;
	    const ref = refAndMessage.slice(0, space);
	    const error = refAndMessage.slice(space + 1);
	    result.refs[ref] = {
	      ok: status2 === "ok",
	      error
	    };
	  }
	  return result;
	}
	async function writeReceivePackRequest({
	  capabilities = [],
	  triplets = []
	}) {
	  const packstream = [];
	  let capsFirstLine = `\0 ${capabilities.join(" ")}`;
	  for (const trip of triplets) {
	    packstream.push(
	      GitPktLine.encode(
	        `${trip.oldoid} ${trip.oid} ${trip.fullRef}${capsFirstLine}
`
	      )
	    );
	    capsFirstLine = "";
	  }
	  packstream.push(GitPktLine.flush());
	  return packstream;
	}
	async function _push({
	  fs,
	  cache,
	  http,
	  onProgress,
	  onMessage,
	  onAuth,
	  onAuthSuccess,
	  onAuthFailure,
	  onPrePush,
	  gitdir,
	  ref: _ref,
	  remoteRef: _remoteRef,
	  remote,
	  url: _url,
	  force = false,
	  delete: _delete = false,
	  corsProxy,
	  headers = {}
	}) {
	  const ref = _ref || await _currentBranch({ fs, gitdir });
	  if (typeof ref === "undefined") {
	    throw new MissingParameterError("ref");
	  }
	  const config = await GitConfigManager.get({ fs, gitdir });
	  remote = remote || await config.get(`branch.${ref}.pushRemote`) || await config.get("remote.pushDefault") || await config.get(`branch.${ref}.remote`) || "origin";
	  const url = _url || await config.get(`remote.${remote}.pushurl`) || await config.get(`remote.${remote}.url`);
	  if (typeof url === "undefined") {
	    throw new MissingParameterError("remote OR url");
	  }
	  const remoteRef = _remoteRef || await config.get(`branch.${ref}.merge`);
	  if (typeof url === "undefined") {
	    throw new MissingParameterError("remoteRef");
	  }
	  if (corsProxy === void 0) {
	    corsProxy = await config.get("http.corsProxy");
	  }
	  const fullRef = await GitRefManager.expand({ fs, gitdir, ref });
	  const oid = _delete ? "0000000000000000000000000000000000000000" : await GitRefManager.resolve({ fs, gitdir, ref: fullRef });
	  const GitRemoteHTTP2 = GitRemoteManager.getRemoteHelperFor({ url });
	  const httpRemote = await GitRemoteHTTP2.discover({
	    http,
	    onAuth,
	    onAuthSuccess,
	    onAuthFailure,
	    corsProxy,
	    service: "git-receive-pack",
	    url,
	    headers,
	    protocolVersion: 1
	  });
	  const auth = httpRemote.auth;
	  let fullRemoteRef;
	  if (!remoteRef) {
	    fullRemoteRef = fullRef;
	  } else {
	    try {
	      fullRemoteRef = await GitRefManager.expandAgainstMap({
	        ref: remoteRef,
	        map: httpRemote.refs
	      });
	    } catch (err) {
	      if (err instanceof NotFoundError) {
	        fullRemoteRef = remoteRef.startsWith("refs/") ? remoteRef : `refs/heads/${remoteRef}`;
	      } else {
	        throw err;
	      }
	    }
	  }
	  const oldoid = httpRemote.refs.get(fullRemoteRef) || "0000000000000000000000000000000000000000";
	  if (onPrePush) {
	    const hookCancel = await onPrePush({
	      remote,
	      url,
	      localRef: { ref: _delete ? "(delete)" : fullRef, oid },
	      remoteRef: { ref: fullRemoteRef, oid: oldoid }
	    });
	    if (!hookCancel) throw new UserCanceledError();
	  }
	  const thinPack = !httpRemote.capabilities.has("no-thin");
	  let objects = /* @__PURE__ */ new Set();
	  if (!_delete) {
	    const finish = [...httpRemote.refs.values()];
	    let skipObjects = /* @__PURE__ */ new Set();
	    if (oldoid !== "0000000000000000000000000000000000000000") {
	      const mergebase = await _findMergeBase({
	        fs,
	        cache,
	        gitdir,
	        oids: [oid, oldoid]
	      });
	      for (const oid2 of mergebase) finish.push(oid2);
	      if (thinPack) {
	        skipObjects = await listObjects({ fs, cache, gitdir, oids: mergebase });
	      }
	    }
	    if (!finish.includes(oid)) {
	      const commits = await listCommitsAndTags({
	        fs,
	        cache,
	        gitdir,
	        start: [oid],
	        finish
	      });
	      objects = await listObjects({ fs, cache, gitdir, oids: commits });
	    }
	    if (thinPack) {
	      try {
	        const ref2 = await GitRefManager.resolve({
	          fs,
	          gitdir,
	          ref: `refs/remotes/${remote}/HEAD`,
	          depth: 2
	        });
	        const { oid: oid2 } = await GitRefManager.resolveAgainstMap({
	          ref: ref2.replace(`refs/remotes/${remote}/`, ""),
	          fullref: ref2,
	          map: httpRemote.refs
	        });
	        const oids = [oid2];
	        for (const oid3 of await listObjects({ fs, cache, gitdir, oids })) {
	          skipObjects.add(oid3);
	        }
	      } catch (e) {
	      }
	      for (const oid2 of skipObjects) {
	        objects.delete(oid2);
	      }
	    }
	    if (oid === oldoid) force = true;
	    if (!force) {
	      if (fullRef.startsWith("refs/tags") && oldoid !== "0000000000000000000000000000000000000000") {
	        throw new PushRejectedError("tag-exists");
	      }
	      if (oid !== "0000000000000000000000000000000000000000" && oldoid !== "0000000000000000000000000000000000000000" && !await _isDescendent({
	        fs,
	        cache,
	        gitdir,
	        oid,
	        ancestor: oldoid,
	        depth: -1
	      })) {
	        throw new PushRejectedError("not-fast-forward");
	      }
	    }
	  }
	  const capabilities = filterCapabilities(
	    [...httpRemote.capabilities],
	    ["report-status", "side-band-64k", `agent=${pkg.agent}`]
	  );
	  const packstream1 = await writeReceivePackRequest({
	    capabilities,
	    triplets: [{ oldoid, oid, fullRef: fullRemoteRef }]
	  });
	  const packstream2 = _delete ? [] : await _pack({
	    fs,
	    cache,
	    gitdir,
	    oids: [...objects]
	  });
	  const res = await GitRemoteHTTP2.connect({
	    http,
	    onProgress,
	    corsProxy,
	    service: "git-receive-pack",
	    url,
	    auth,
	    headers,
	    body: [...packstream1, ...packstream2]
	  });
	  const { packfile, progress } = await GitSideBand.demux(res.body);
	  if (onMessage) {
	    const lines = splitLines(progress);
	    forAwait(lines, async (line) => {
	      await onMessage(line);
	    });
	  }
	  const result = await parseReceivePackResponse(packfile);
	  if (res.headers) {
	    result.headers = res.headers;
	  }
	  if (remote && result.ok && result.refs[fullRemoteRef].ok && !fullRef.startsWith("refs/tags")) {
	    const ref2 = `refs/remotes/${remote}/${fullRemoteRef.replace(
	      "refs/heads",
	      ""
	    )}`;
	    if (_delete) {
	      await GitRefManager.deleteRef({ fs, gitdir, ref: ref2 });
	    } else {
	      await GitRefManager.writeRef({ fs, gitdir, ref: ref2, value: oid });
	    }
	  }
	  if (result.ok && Object.values(result.refs).every((result2) => result2.ok)) {
	    return result;
	  } else {
	    const prettyDetails = Object.entries(result.refs).filter(([k, v]) => !v.ok).map(([k, v]) => `
  - ${k}: ${v.error}`).join("");
	    throw new GitPushError(prettyDetails, result);
	  }
	}
	async function push({
	  fs,
	  http,
	  onProgress,
	  onMessage,
	  onAuth,
	  onAuthSuccess,
	  onAuthFailure,
	  onPrePush,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref,
	  remoteRef,
	  remote = "origin",
	  url,
	  force = false,
	  delete: _delete = false,
	  corsProxy,
	  headers = {},
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("http", http);
	    assertParameter("gitdir", gitdir);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _push({
	      fs: fsp,
	      cache,
	      http,
	      onProgress,
	      onMessage,
	      onAuth,
	      onAuthSuccess,
	      onAuthFailure,
	      onPrePush,
	      gitdir: updatedGitdir,
	      ref,
	      remoteRef,
	      remote,
	      url,
	      force,
	      delete: _delete,
	      corsProxy,
	      headers
	    });
	  } catch (err) {
	    err.caller = "git.push";
	    throw err;
	  }
	}
	async function resolveBlob({ fs, cache, gitdir, oid }) {
	  const { type, object } = await _readObject({ fs, cache, gitdir, oid });
	  if (type === "tag") {
	    oid = GitAnnotatedTag.from(object).parse().object;
	    return resolveBlob({ fs, cache, gitdir, oid });
	  }
	  if (type !== "blob") {
	    throw new ObjectTypeError(oid, type, "blob");
	  }
	  return { oid, blob: new Uint8Array(object) };
	}
	async function _readBlob({
	  fs,
	  cache,
	  gitdir,
	  oid,
	  filepath = void 0
	}) {
	  if (filepath !== void 0) {
	    oid = await resolveFilepath({ fs, cache, gitdir, oid, filepath });
	  }
	  const blob = await resolveBlob({
	    fs,
	    cache,
	    gitdir,
	    oid
	  });
	  return blob;
	}
	async function readBlob({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  oid,
	  filepath,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("oid", oid);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _readBlob({
	      fs: fsp,
	      cache,
	      gitdir: updatedGitdir,
	      oid,
	      filepath
	    });
	  } catch (err) {
	    err.caller = "git.readBlob";
	    throw err;
	  }
	}
	async function readCommit({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  oid,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("oid", oid);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _readCommit({
	      fs: fsp,
	      cache,
	      gitdir: updatedGitdir,
	      oid
	    });
	  } catch (err) {
	    err.caller = "git.readCommit";
	    throw err;
	  }
	}
	async function _readNote({
	  fs,
	  cache,
	  gitdir,
	  ref = "refs/notes/commits",
	  oid
	}) {
	  const parent = await GitRefManager.resolve({ gitdir, fs, ref });
	  const { blob } = await _readBlob({
	    fs,
	    cache,
	    gitdir,
	    oid: parent,
	    filepath: oid
	  });
	  return blob;
	}
	async function readNote({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref = "refs/notes/commits",
	  oid,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("ref", ref);
	    assertParameter("oid", oid);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _readNote({
	      fs: fsp,
	      cache,
	      gitdir: updatedGitdir,
	      ref,
	      oid
	    });
	  } catch (err) {
	    err.caller = "git.readNote";
	    throw err;
	  }
	}
	async function readObject({
	  fs: _fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  oid,
	  format = "parsed",
	  filepath = void 0,
	  encoding = void 0,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("oid", oid);
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    if (filepath !== void 0) {
	      oid = await resolveFilepath({
	        fs,
	        cache,
	        gitdir: updatedGitdir,
	        oid,
	        filepath
	      });
	    }
	    const _format = format === "parsed" ? "content" : format;
	    const result = await _readObject({
	      fs,
	      cache,
	      gitdir: updatedGitdir,
	      oid,
	      format: _format
	    });
	    result.oid = oid;
	    if (format === "parsed") {
	      result.format = "parsed";
	      switch (result.type) {
	        case "commit":
	          result.object = GitCommit.from(result.object).parse();
	          break;
	        case "tree":
	          result.object = GitTree.from(result.object).entries();
	          break;
	        case "blob":
	          if (encoding) {
	            result.object = result.object.toString(encoding);
	          } else {
	            result.object = new Uint8Array(result.object);
	            result.format = "content";
	          }
	          break;
	        case "tag":
	          result.object = GitAnnotatedTag.from(result.object).parse();
	          break;
	        default:
	          throw new ObjectTypeError(
	            result.oid,
	            result.type,
	            "blob|commit|tag|tree"
	          );
	      }
	    } else if (result.format === "deflated" || result.format === "wrapped") {
	      result.type = result.format;
	    }
	    return result;
	  } catch (err) {
	    err.caller = "git.readObject";
	    throw err;
	  }
	}
	async function _readTag({ fs, cache, gitdir, oid }) {
	  const { type, object } = await _readObject({
	    fs,
	    cache,
	    gitdir,
	    oid,
	    format: "content"
	  });
	  if (type !== "tag") {
	    throw new ObjectTypeError(oid, type, "tag");
	  }
	  const tag2 = GitAnnotatedTag.from(object);
	  const result = {
	    oid,
	    tag: tag2.parse(),
	    payload: tag2.payload()
	  };
	  return result;
	}
	async function readTag({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  oid,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("oid", oid);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _readTag({
	      fs: fsp,
	      cache,
	      gitdir: updatedGitdir,
	      oid
	    });
	  } catch (err) {
	    err.caller = "git.readTag";
	    throw err;
	  }
	}
	async function readTree({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  oid,
	  filepath = void 0,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("oid", oid);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _readTree({
	      fs: fsp,
	      cache,
	      gitdir: updatedGitdir,
	      oid,
	      filepath
	    });
	  } catch (err) {
	    err.caller = "git.readTree";
	    throw err;
	  }
	}
	async function remove({
	  fs: _fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  filepath,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("filepath", filepath);
	    const fsp = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    await GitIndexManager.acquire(
	      { fs: fsp, gitdir: updatedGitdir, cache },
	      async function(index2) {
	        index2.delete({ filepath });
	      }
	    );
	  } catch (err) {
	    err.caller = "git.remove";
	    throw err;
	  }
	}
	async function _removeNote({
	  fs,
	  cache,
	  onSign,
	  gitdir,
	  ref = "refs/notes/commits",
	  oid,
	  author,
	  committer,
	  signingKey
	}) {
	  let parent;
	  try {
	    parent = await GitRefManager.resolve({ gitdir, fs, ref });
	  } catch (err) {
	    if (!(err instanceof NotFoundError)) {
	      throw err;
	    }
	  }
	  const result = await _readTree({
	    fs,
	    cache,
	    gitdir,
	    oid: parent || "4b825dc642cb6eb9a060e54bf8d69288fbee4904"
	  });
	  let tree = result.tree;
	  tree = tree.filter((entry) => entry.path !== oid);
	  const treeOid = await _writeTree({
	    fs,
	    gitdir,
	    tree
	  });
	  const commitOid = await _commit({
	    fs,
	    cache,
	    onSign,
	    gitdir,
	    ref,
	    tree: treeOid,
	    parent: parent && [parent],
	    message: `Note removed by 'isomorphic-git removeNote'
`,
	    author,
	    committer,
	    signingKey
	  });
	  return commitOid;
	}
	async function removeNote({
	  fs: _fs,
	  onSign,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref = "refs/notes/commits",
	  oid,
	  author: _author,
	  committer: _committer,
	  signingKey,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("oid", oid);
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    const author = await normalizeAuthorObject({
	      fs,
	      gitdir: updatedGitdir,
	      author: _author
	    });
	    if (!author) throw new MissingNameError("author");
	    const committer = await normalizeCommitterObject({
	      fs,
	      gitdir: updatedGitdir,
	      author,
	      committer: _committer
	    });
	    if (!committer) throw new MissingNameError("committer");
	    return await _removeNote({
	      fs,
	      cache,
	      onSign,
	      gitdir: updatedGitdir,
	      ref,
	      oid,
	      author,
	      committer,
	      signingKey
	    });
	  } catch (err) {
	    err.caller = "git.removeNote";
	    throw err;
	  }
	}
	async function _renameBranch({
	  fs,
	  gitdir,
	  oldref,
	  ref,
	  checkout: checkout2 = false
	}) {
	  if (!isValidRef(ref)) {
	    throw new InvalidRefNameError(ref, cleanGitRef.clean(ref));
	  }
	  if (!isValidRef(oldref)) {
	    throw new InvalidRefNameError(oldref, cleanGitRef.clean(oldref));
	  }
	  const fulloldref = `refs/heads/${oldref}`;
	  const fullnewref = `refs/heads/${ref}`;
	  const newexist = await GitRefManager.exists({ fs, gitdir, ref: fullnewref });
	  if (newexist) {
	    throw new AlreadyExistsError("branch", ref, false);
	  }
	  const value = await GitRefManager.resolve({
	    fs,
	    gitdir,
	    ref: fulloldref,
	    depth: 1
	  });
	  await GitRefManager.writeRef({ fs, gitdir, ref: fullnewref, value });
	  await GitRefManager.deleteRef({ fs, gitdir, ref: fulloldref });
	  const fullCurrentBranchRef = await _currentBranch({
	    fs,
	    gitdir,
	    fullname: true
	  });
	  const isCurrentBranch = fullCurrentBranchRef === fulloldref;
	  if (checkout2 || isCurrentBranch) {
	    await GitRefManager.writeSymbolicRef({
	      fs,
	      gitdir,
	      ref: "HEAD",
	      value: fullnewref
	    });
	  }
	}
	async function renameBranch({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref,
	  oldref,
	  checkout: checkout2 = false
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("ref", ref);
	    assertParameter("oldref", oldref);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _renameBranch({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      ref,
	      oldref,
	      checkout: checkout2
	    });
	  } catch (err) {
	    err.caller = "git.renameBranch";
	    throw err;
	  }
	}
	async function hashObject$1({ gitdir, type, object }) {
	  return shasum(GitObject.wrap({ type, object }));
	}
	async function resetIndex({
	  fs: _fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  filepath,
	  ref,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("filepath", filepath);
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    let oid;
	    let workdirOid;
	    try {
	      oid = await GitRefManager.resolve({
	        fs,
	        gitdir: updatedGitdir,
	        ref: ref || "HEAD"
	      });
	    } catch (e) {
	      if (ref) {
	        throw e;
	      }
	    }
	    if (oid) {
	      try {
	        oid = await resolveFilepath({
	          fs,
	          cache,
	          gitdir: updatedGitdir,
	          oid,
	          filepath
	        });
	      } catch (e) {
	        oid = null;
	      }
	    }
	    let stats = {
	      ctime: /* @__PURE__ */ new Date(0),
	      mtime: /* @__PURE__ */ new Date(0),
	      dev: 0,
	      ino: 0,
	      mode: 0,
	      uid: 0,
	      gid: 0,
	      size: 0
	    };
	    const object = dir && await fs.read(join(dir, filepath));
	    if (object) {
	      workdirOid = await hashObject$1({
	        gitdir: updatedGitdir,
	        type: "blob",
	        object
	      });
	      if (oid === workdirOid) {
	        stats = await fs.lstat(join(dir, filepath));
	      }
	    }
	    await GitIndexManager.acquire(
	      { fs, gitdir: updatedGitdir, cache },
	      async function(index2) {
	        index2.delete({ filepath });
	        if (oid) {
	          index2.insert({ filepath, stats, oid });
	        }
	      }
	    );
	  } catch (err) {
	    err.caller = "git.reset";
	    throw err;
	  }
	}
	async function resolveRef({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref,
	  depth
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("ref", ref);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    const oid = await GitRefManager.resolve({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      ref,
	      depth
	    });
	    return oid;
	  } catch (err) {
	    err.caller = "git.resolveRef";
	    throw err;
	  }
	}
	async function setConfig({
	  fs: _fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  path,
	  value,
	  append = false
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("path", path);
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    const config = await GitConfigManager.get({ fs, gitdir: updatedGitdir });
	    if (append) {
	      await config.append(path, value);
	    } else {
	      await config.set(path, value);
	    }
	    await GitConfigManager.save({ fs, gitdir: updatedGitdir, config });
	  } catch (err) {
	    err.caller = "git.setConfig";
	    throw err;
	  }
	}
	async function _writeCommit({ fs, gitdir, commit: commit2 }) {
	  const object = GitCommit.from(commit2).toObject();
	  const oid = await _writeObject({
	    fs,
	    gitdir,
	    type: "commit",
	    object,
	    format: "content"
	  });
	  return oid;
	}
	class GitRefStash {
	  // constructor removed
	  static get timezoneOffsetForRefLogEntry() {
	    const offsetMinutes = (/* @__PURE__ */ new Date()).getTimezoneOffset();
	    const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
	    const offsetMinutesFormatted = Math.abs(offsetMinutes % 60).toString().padStart(2, "0");
	    const sign = offsetMinutes > 0 ? "-" : "+";
	    return `${sign}${offsetHours.toString().padStart(2, "0")}${offsetMinutesFormatted}`;
	  }
	  static createStashReflogEntry(author, stashCommit, message) {
	    const nameNoSpace = author.name.replace(/\s/g, "");
	    const z40 = "0000000000000000000000000000000000000000";
	    const timestamp = Math.floor(Date.now() / 1e3);
	    const timezoneOffset = GitRefStash.timezoneOffsetForRefLogEntry;
	    return `${z40} ${stashCommit} ${nameNoSpace} ${author.email} ${timestamp} ${timezoneOffset}	${message}
`;
	  }
	  static getStashReflogEntry(reflogString, parsed = false) {
	    const reflogLines = reflogString.split("\n");
	    const entries = reflogLines.filter((l) => l).reverse().map(
	      (line, idx) => parsed ? `stash@{${idx}}: ${line.split("	")[1]}` : line
	    );
	    return entries;
	  }
	}
	class GitStashManager {
	  /**
	   * Creates an instance of GitStashManager.
	   *
	   * @param {Object} args
	   * @param {FSClient} args.fs - A file system implementation.
	   * @param {string} args.dir - The working directory.
	   * @param {string}[args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
	   */
	  constructor({ fs, dir, gitdir = join(dir, ".git") }) {
	    Object.assign(this, {
	      fs,
	      dir,
	      gitdir,
	      _author: null
	    });
	  }
	  /**
	   * Gets the reference name for the stash.
	   *
	   * @returns {string} - The stash reference name.
	   */
	  static get refStash() {
	    return "refs/stash";
	  }
	  /**
	   * Gets the reference name for the stash reflogs.
	   *
	   * @returns {string} - The stash reflogs reference name.
	   */
	  static get refLogsStash() {
	    return "logs/refs/stash";
	  }
	  /**
	   * Gets the file path for the stash reference.
	   *
	   * @returns {string} - The file path for the stash reference.
	   */
	  get refStashPath() {
	    return join(this.gitdir, GitStashManager.refStash);
	  }
	  /**
	   * Gets the file path for the stash reflogs.
	   *
	   * @returns {string} - The file path for the stash reflogs.
	   */
	  get refLogsStashPath() {
	    return join(this.gitdir, GitStashManager.refLogsStash);
	  }
	  /**
	   * Retrieves the author information for the stash.
	   *
	   * @returns {Promise<Object>} - The author object.
	   * @throws {MissingNameError} - If the author name is missing.
	   */
	  async getAuthor() {
	    if (!this._author) {
	      this._author = await normalizeAuthorObject({
	        fs: this.fs,
	        gitdir: this.gitdir,
	        author: {}
	      });
	      if (!this._author) throw new MissingNameError("author");
	    }
	    return this._author;
	  }
	  /**
	   * Gets the SHA of a stash entry by its index.
	   *
	   * @param {number} refIdx - The index of the stash entry.
	   * @param {string[]} [stashEntries] - Optional preloaded stash entries.
	   * @returns {Promise<string|null>} - The SHA of the stash entry or `null` if not found.
	   */
	  async getStashSHA(refIdx, stashEntries) {
	    if (!await this.fs.exists(this.refStashPath)) {
	      return null;
	    }
	    const entries = stashEntries || await this.readStashReflogs({ parsed: false });
	    return entries[refIdx].split(" ")[1];
	  }
	  /**
	   * Writes a stash commit to the repository.
	   *
	   * @param {Object} args
	   * @param {string} args.message - The commit message.
	   * @param {string} args.tree - The tree object ID.
	   * @param {string[]} args.parent - The parent commit object IDs.
	   * @returns {Promise<string>} - The object ID of the written commit.
	   */
	  async writeStashCommit({ message, tree, parent }) {
	    return _writeCommit({
	      fs: this.fs,
	      gitdir: this.gitdir,
	      commit: {
	        message,
	        tree,
	        parent,
	        author: await this.getAuthor(),
	        committer: await this.getAuthor()
	      }
	    });
	  }
	  /**
	   * Reads a stash commit by its index.
	   *
	   * @param {number} refIdx - The index of the stash entry.
	   * @returns {Promise<Object>} - The stash commit object.
	   * @throws {InvalidRefNameError} - If the index is invalid.
	   */
	  async readStashCommit(refIdx) {
	    const stashEntries = await this.readStashReflogs({ parsed: false });
	    if (refIdx !== 0) {
	      if (refIdx < 0 || refIdx > stashEntries.length - 1) {
	        throw new InvalidRefNameError(
	          `stash@${refIdx}`,
	          "number that is in range of [0, num of stash pushed]"
	        );
	      }
	    }
	    const stashSHA = await this.getStashSHA(refIdx, stashEntries);
	    if (!stashSHA) {
	      return {};
	    }
	    return _readCommit({
	      fs: this.fs,
	      cache: {},
	      gitdir: this.gitdir,
	      oid: stashSHA
	    });
	  }
	  /**
	   * Writes a stash reference to the repository.
	   *
	   * @param {string} stashCommit - The object ID of the stash commit.
	   * @returns {Promise<void>}
	   */
	  async writeStashRef(stashCommit) {
	    return GitRefManager.writeRef({
	      fs: this.fs,
	      gitdir: this.gitdir,
	      ref: GitStashManager.refStash,
	      value: stashCommit
	    });
	  }
	  /**
	   * Writes a reflog entry for a stash commit.
	   *
	   * @param {Object} args
	   * @param {string} args.stashCommit - The object ID of the stash commit.
	   * @param {string} args.message - The reflog message.
	   * @returns {Promise<void>}
	   */
	  async writeStashReflogEntry({ stashCommit, message }) {
	    const author = await this.getAuthor();
	    const entry = GitRefStash.createStashReflogEntry(
	      author,
	      stashCommit,
	      message
	    );
	    const filepath = this.refLogsStashPath;
	    await acquireLock$1({ filepath, entry }, async () => {
	      const appendTo = await this.fs.exists(filepath) ? await this.fs.read(filepath, "utf8") : "";
	      await this.fs.write(filepath, appendTo + entry, "utf8");
	    });
	  }
	  /**
	   * Reads the stash reflogs.
	   *
	   * @param {Object} args
	   * @param {boolean} [args.parsed=false] - Whether to parse the reflog entries.
	   * @returns {Promise<string[]|Object[]>} - The reflog entries as strings or parsed objects.
	   */
	  async readStashReflogs({ parsed = false }) {
	    if (!await this.fs.exists(this.refLogsStashPath)) {
	      return [];
	    }
	    const reflogString = await this.fs.read(this.refLogsStashPath, "utf8");
	    return GitRefStash.getStashReflogEntry(reflogString, parsed);
	  }
	}
	async function _createStashCommit({ fs, dir, gitdir, message = "" }) {
	  const stashMgr = new GitStashManager({ fs, dir, gitdir });
	  await stashMgr.getAuthor();
	  const branch2 = await _currentBranch({
	    fs,
	    gitdir,
	    fullname: false
	  });
	  const headCommit = await GitRefManager.resolve({
	    fs,
	    gitdir,
	    ref: "HEAD"
	  });
	  const headCommitObj = await readCommit({ fs, dir, gitdir, oid: headCommit });
	  const headMsg = headCommitObj.commit.message;
	  const stashCommitParents = [headCommit];
	  let stashCommitTree = null;
	  let workDirCompareBase = TREE({ ref: "HEAD" });
	  const indexTree = await writeTreeChanges({
	    fs,
	    dir,
	    gitdir,
	    treePair: [TREE({ ref: "HEAD" }), "stage"]
	  });
	  if (indexTree) {
	    const stashCommitOne = await stashMgr.writeStashCommit({
	      message: `stash-Index: WIP on ${branch2} - ${(/* @__PURE__ */ new Date()).toISOString()}`,
	      tree: indexTree,
	      parent: stashCommitParents
	    });
	    stashCommitParents.push(stashCommitOne);
	    stashCommitTree = indexTree;
	    workDirCompareBase = STAGE();
	  }
	  const workingTree = await writeTreeChanges({
	    fs,
	    dir,
	    gitdir,
	    treePair: [workDirCompareBase, "workdir"]
	  });
	  if (workingTree) {
	    const workingHeadCommit = await stashMgr.writeStashCommit({
	      message: `stash-WorkDir: WIP on ${branch2} - ${(/* @__PURE__ */ new Date()).toISOString()}`,
	      tree: workingTree,
	      parent: [stashCommitParents[stashCommitParents.length - 1]]
	    });
	    stashCommitParents.push(workingHeadCommit);
	    stashCommitTree = workingTree;
	  }
	  if (!stashCommitTree || !indexTree && !workingTree) {
	    throw new NotFoundError("changes, nothing to stash");
	  }
	  const stashMsg = (message.trim() || `WIP on ${branch2}`) + `: ${headCommit.substring(0, 7)} ${headMsg}`;
	  const stashCommit = await stashMgr.writeStashCommit({
	    message: stashMsg,
	    tree: stashCommitTree,
	    parent: stashCommitParents
	  });
	  return { stashCommit, stashMsg, branch: branch2, stashMgr };
	}
	async function _stashPush({ fs, dir, gitdir, message = "" }) {
	  const { stashCommit, stashMsg, branch: branch2, stashMgr } = await _createStashCommit({
	    fs,
	    dir,
	    gitdir,
	    message
	  });
	  await stashMgr.writeStashRef(stashCommit);
	  await stashMgr.writeStashReflogEntry({
	    stashCommit,
	    message: stashMsg
	  });
	  await checkout({
	    fs,
	    dir,
	    gitdir,
	    ref: branch2,
	    track: false,
	    force: true
	    // force checkout to discard changes
	  });
	  return stashCommit;
	}
	async function _stashCreate({ fs, dir, gitdir, message = "" }) {
	  const { stashCommit } = await _createStashCommit({
	    fs,
	    dir,
	    gitdir,
	    message
	  });
	  return stashCommit;
	}
	async function _stashApply({ fs, dir, gitdir, refIdx = 0 }) {
	  const stashMgr = new GitStashManager({ fs, dir, gitdir });
	  const stashCommit = await stashMgr.readStashCommit(refIdx);
	  const { parent: stashParents = null } = stashCommit.commit ? stashCommit.commit : {};
	  if (!stashParents || !Array.isArray(stashParents)) {
	    return;
	  }
	  for (let i = 0; i < stashParents.length - 1; i++) {
	    const applyingCommit = await _readCommit({
	      fs,
	      cache: {},
	      gitdir,
	      oid: stashParents[i + 1]
	    });
	    const wasStaged = applyingCommit.commit.message.startsWith("stash-Index");
	    await applyTreeChanges({
	      fs,
	      dir,
	      gitdir,
	      stashCommit: stashParents[i + 1],
	      parentCommit: stashParents[i],
	      wasStaged
	    });
	  }
	}
	async function _stashDrop({ fs, dir, gitdir, refIdx = 0 }) {
	  const stashMgr = new GitStashManager({ fs, dir, gitdir });
	  const stashCommit = await stashMgr.readStashCommit(refIdx);
	  if (!stashCommit.commit) {
	    return;
	  }
	  const stashRefPath = stashMgr.refStashPath;
	  await acquireLock$1(stashRefPath, async () => {
	    if (await fs.exists(stashRefPath)) {
	      await fs.rm(stashRefPath);
	    }
	  });
	  const reflogEntries = await stashMgr.readStashReflogs({ parsed: false });
	  if (!reflogEntries.length) {
	    return;
	  }
	  reflogEntries.splice(refIdx, 1);
	  const stashReflogPath = stashMgr.refLogsStashPath;
	  await acquireLock$1({ reflogEntries, stashReflogPath, stashMgr }, async () => {
	    if (reflogEntries.length) {
	      await fs.write(
	        stashReflogPath,
	        reflogEntries.reverse().join("\n") + "\n",
	        "utf8"
	      );
	      const lastStashCommit = reflogEntries[reflogEntries.length - 1].split(" ")[1];
	      await stashMgr.writeStashRef(lastStashCommit);
	    } else {
	      await fs.rm(stashReflogPath);
	    }
	  });
	}
	async function _stashList({ fs, dir, gitdir }) {
	  const stashMgr = new GitStashManager({ fs, dir, gitdir });
	  return stashMgr.readStashReflogs({ parsed: true });
	}
	async function _stashClear({ fs, dir, gitdir }) {
	  const stashMgr = new GitStashManager({ fs, dir, gitdir });
	  const stashRefPath = [stashMgr.refStashPath, stashMgr.refLogsStashPath];
	  await acquireLock$1(stashRefPath, async () => {
	    await Promise.all(
	      stashRefPath.map(async (path) => {
	        if (await fs.exists(path)) {
	          return fs.rm(path);
	        }
	      })
	    );
	  });
	}
	async function _stashPop({ fs, dir, gitdir, refIdx = 0 }) {
	  await _stashApply({ fs, dir, gitdir, refIdx });
	  await _stashDrop({ fs, dir, gitdir, refIdx });
	}
	async function stash({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  op = "push",
	  message = "",
	  refIdx = 0
	}) {
	  assertParameter("fs", fs);
	  assertParameter("dir", dir);
	  assertParameter("gitdir", gitdir);
	  assertParameter("op", op);
	  const stashMap = {
	    push: _stashPush,
	    apply: _stashApply,
	    drop: _stashDrop,
	    list: _stashList,
	    clear: _stashClear,
	    pop: _stashPop,
	    create: _stashCreate
	  };
	  const opsNeedRefIdx = ["apply", "drop", "pop"];
	  try {
	    const _fs = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp: _fs, dotgit: gitdir });
	    const folders = ["refs", "logs", "logs/refs"];
	    folders.map((f) => join(updatedGitdir, f)).forEach(async (folder) => {
	      if (!await _fs.exists(folder)) {
	        await _fs.mkdir(folder);
	      }
	    });
	    const opFunc = stashMap[op];
	    if (opFunc) {
	      if (opsNeedRefIdx.includes(op) && refIdx < 0) {
	        throw new InvalidRefNameError(
	          `stash@${refIdx}`,
	          "number that is in range of [0, num of stash pushed]"
	        );
	      }
	      return await opFunc({
	        fs: _fs,
	        dir,
	        gitdir: updatedGitdir,
	        message,
	        refIdx
	      });
	    }
	    throw new Error(`To be implemented: ${op}`);
	  } catch (err) {
	    err.caller = "git.stash";
	    throw err;
	  }
	}
	async function status({
	  fs: _fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  filepath,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("filepath", filepath);
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    const ignored = await GitIgnoreManager.isIgnored({
	      fs,
	      gitdir: updatedGitdir,
	      dir,
	      filepath
	    });
	    if (ignored) {
	      return "ignored";
	    }
	    const headTree = await getHeadTree({ fs, cache, gitdir: updatedGitdir });
	    const treeOid = await getOidAtPath({
	      fs,
	      cache,
	      gitdir: updatedGitdir,
	      tree: headTree,
	      path: filepath
	    });
	    const indexEntry = await GitIndexManager.acquire(
	      { fs, gitdir: updatedGitdir, cache },
	      async function(index2) {
	        for (const entry of index2) {
	          if (entry.path === filepath) return entry;
	        }
	        return null;
	      }
	    );
	    const stats = await fs.lstat(join(dir, filepath));
	    const H = treeOid !== null;
	    const I = indexEntry !== null;
	    const W = stats !== null;
	    const getWorkdirOid = async () => {
	      if (I && !compareStats(indexEntry, stats)) {
	        return indexEntry.oid;
	      } else {
	        const object = await fs.read(join(dir, filepath));
	        const workdirOid = await hashObject$1({
	          gitdir: updatedGitdir,
	          type: "blob",
	          object
	        });
	        if (I && indexEntry.oid === workdirOid) {
	          if (stats.size !== -1) {
	            GitIndexManager.acquire(
	              { fs, gitdir: updatedGitdir, cache },
	              async function(index2) {
	                index2.insert({ filepath, stats, oid: workdirOid });
	              }
	            );
	          }
	        }
	        return workdirOid;
	      }
	    };
	    if (!H && !W && !I) return "absent";
	    if (!H && !W && I) return "*absent";
	    if (!H && W && !I) return "*added";
	    if (!H && W && I) {
	      const workdirOid = await getWorkdirOid();
	      return workdirOid === indexEntry.oid ? "added" : "*added";
	    }
	    if (H && !W && !I) return "deleted";
	    if (H && !W && I) {
	      return treeOid === indexEntry.oid ? "*deleted" : "*deleted";
	    }
	    if (H && W && !I) {
	      const workdirOid = await getWorkdirOid();
	      return workdirOid === treeOid ? "*undeleted" : "*undeletemodified";
	    }
	    if (H && W && I) {
	      const workdirOid = await getWorkdirOid();
	      if (workdirOid === treeOid) {
	        return workdirOid === indexEntry.oid ? "unmodified" : "*unmodified";
	      } else {
	        return workdirOid === indexEntry.oid ? "modified" : "*modified";
	      }
	    }
	  } catch (err) {
	    err.caller = "git.status";
	    throw err;
	  }
	}
	async function getOidAtPath({ fs, cache, gitdir: updatedGitdir, tree, path }) {
	  if (typeof path === "string") path = path.split("/");
	  const dirname2 = path.shift();
	  for (const entry of tree) {
	    if (entry.path === dirname2) {
	      if (path.length === 0) {
	        return entry.oid;
	      }
	      const { type, object } = await _readObject({
	        fs,
	        cache,
	        gitdir: updatedGitdir,
	        oid: entry.oid
	      });
	      if (type === "tree") {
	        const tree2 = GitTree.from(object);
	        return getOidAtPath({ fs, cache, gitdir: updatedGitdir, tree: tree2, path });
	      }
	      if (type === "blob") {
	        throw new ObjectTypeError(entry.oid, type, "blob", path.join("/"));
	      }
	    }
	  }
	  return null;
	}
	async function getHeadTree({ fs, cache, gitdir: updatedGitdir }) {
	  let oid;
	  try {
	    oid = await GitRefManager.resolve({
	      fs,
	      gitdir: updatedGitdir,
	      ref: "HEAD"
	    });
	  } catch (e) {
	    if (e instanceof NotFoundError) {
	      return [];
	    }
	  }
	  const { tree } = await _readTree({ fs, cache, gitdir: updatedGitdir, oid });
	  return tree;
	}
	async function statusMatrix({
	  fs: _fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref = "HEAD",
	  filepaths = ["."],
	  filter,
	  cache = {},
	  ignored: shouldIgnore = false
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("ref", ref);
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    return await _walk({
	      fs,
	      cache,
	      dir,
	      gitdir: updatedGitdir,
	      trees: [TREE({ ref }), WORKDIR(), STAGE()],
	      map: async function(filepath, [head, workdir, stage]) {
	        if (!head && !stage && workdir) {
	          if (!shouldIgnore) {
	            const isIgnored2 = await GitIgnoreManager.isIgnored({
	              fs,
	              dir,
	              filepath
	            });
	            if (isIgnored2) {
	              return null;
	            }
	          }
	        }
	        if (!filepaths.some((base) => worthWalking(filepath, base))) {
	          return null;
	        }
	        if (filter) {
	          if (!filter(filepath)) return;
	        }
	        const [headType, workdirType, stageType] = await Promise.all([
	          head && head.type(),
	          workdir && workdir.type(),
	          stage && stage.type()
	        ]);
	        const isBlob = [headType, workdirType, stageType].includes("blob");
	        if ((headType === "tree" || headType === "special") && !isBlob) return;
	        if (headType === "commit") return null;
	        if ((workdirType === "tree" || workdirType === "special") && !isBlob)
	          return;
	        if (stageType === "commit") return null;
	        if ((stageType === "tree" || stageType === "special") && !isBlob) return;
	        const headOid = headType === "blob" ? await head.oid() : void 0;
	        const stageOid = stageType === "blob" ? await stage.oid() : void 0;
	        let workdirOid;
	        if (headType !== "blob" && workdirType === "blob" && stageType !== "blob") {
	          workdirOid = "42";
	        } else if (workdirType === "blob") {
	          workdirOid = await workdir.oid();
	        }
	        const entry = [void 0, headOid, workdirOid, stageOid];
	        const result = entry.map((value) => entry.indexOf(value));
	        result.shift();
	        return [filepath, ...result];
	      }
	    });
	  } catch (err) {
	    err.caller = "git.statusMatrix";
	    throw err;
	  }
	}
	async function tag({
	  fs: _fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref,
	  object,
	  force = false
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("ref", ref);
	    const fs = new FileSystem(_fs);
	    if (ref === void 0) {
	      throw new MissingParameterError("ref");
	    }
	    ref = ref.startsWith("refs/tags/") ? ref : `refs/tags/${ref}`;
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    const value = await GitRefManager.resolve({
	      fs,
	      gitdir: updatedGitdir,
	      ref: object || "HEAD"
	    });
	    if (!force && await GitRefManager.exists({ fs, gitdir: updatedGitdir, ref })) {
	      throw new AlreadyExistsError("tag", ref);
	    }
	    await GitRefManager.writeRef({ fs, gitdir: updatedGitdir, ref, value });
	  } catch (err) {
	    err.caller = "git.tag";
	    throw err;
	  }
	}
	async function updateIndex$1({
	  fs: _fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  cache = {},
	  filepath,
	  oid,
	  mode,
	  add: add2,
	  remove: remove2,
	  force
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("filepath", filepath);
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    if (remove2) {
	      return await GitIndexManager.acquire(
	        { fs, gitdir: updatedGitdir, cache },
	        async function(index2) {
	          if (!force) {
	            const fileStats2 = await fs.lstat(join(dir, filepath));
	            if (fileStats2) {
	              if (fileStats2.isDirectory()) {
	                throw new InvalidFilepathError("directory");
	              }
	              return;
	            }
	          }
	          if (index2.has({ filepath })) {
	            index2.delete({
	              filepath
	            });
	          }
	        }
	      );
	    }
	    let fileStats;
	    if (!oid) {
	      fileStats = await fs.lstat(join(dir, filepath));
	      if (!fileStats) {
	        throw new NotFoundError(
	          `file at "${filepath}" on disk and "remove" not set`
	        );
	      }
	      if (fileStats.isDirectory()) {
	        throw new InvalidFilepathError("directory");
	      }
	    }
	    return await GitIndexManager.acquire(
	      { fs, gitdir: updatedGitdir, cache },
	      async function(index2) {
	        if (!add2 && !index2.has({ filepath })) {
	          throw new NotFoundError(
	            `file at "${filepath}" in index and "add" not set`
	          );
	        }
	        let stats;
	        if (!oid) {
	          stats = fileStats;
	          const object = stats.isSymbolicLink() ? await fs.readlink(join(dir, filepath)) : await fs.read(join(dir, filepath));
	          oid = await _writeObject({
	            fs,
	            gitdir: updatedGitdir,
	            type: "blob",
	            format: "content",
	            object
	          });
	        } else {
	          stats = {
	            ctime: /* @__PURE__ */ new Date(0),
	            mtime: /* @__PURE__ */ new Date(0),
	            dev: 0,
	            ino: 0,
	            mode,
	            uid: 0,
	            gid: 0,
	            size: 0
	          };
	        }
	        index2.insert({
	          filepath,
	          oid,
	          stats
	        });
	        return oid;
	      }
	    );
	  } catch (err) {
	    err.caller = "git.updateIndex";
	    throw err;
	  }
	}
	function version() {
	  try {
	    return pkg.version;
	  } catch (err) {
	    err.caller = "git.version";
	    throw err;
	  }
	}
	async function walk({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  trees,
	  map,
	  reduce,
	  iterate,
	  cache = {}
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("trees", trees);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _walk({
	      fs: fsp,
	      cache,
	      dir,
	      gitdir: updatedGitdir,
	      trees,
	      map,
	      reduce,
	      iterate
	    });
	  } catch (err) {
	    err.caller = "git.walk";
	    throw err;
	  }
	}
	async function writeBlob({ fs, dir, gitdir = join(dir, ".git"), blob }) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("blob", blob);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _writeObject({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      type: "blob",
	      object: blob,
	      format: "content"
	    });
	  } catch (err) {
	    err.caller = "git.writeBlob";
	    throw err;
	  }
	}
	async function writeCommit({
	  fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  commit: commit2
	}) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("commit", commit2);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _writeCommit({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      commit: commit2
	    });
	  } catch (err) {
	    err.caller = "git.writeCommit";
	    throw err;
	  }
	}
	async function writeObject({
	  fs: _fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  type,
	  object,
	  format = "parsed",
	  oid,
	  encoding = void 0
	}) {
	  try {
	    const fs = new FileSystem(_fs);
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    if (format === "parsed") {
	      switch (type) {
	        case "commit":
	          object = GitCommit.from(object).toObject();
	          break;
	        case "tree":
	          object = GitTree.from(object).toObject();
	          break;
	        case "blob":
	          object = Buffer.from(object, encoding);
	          break;
	        case "tag":
	          object = GitAnnotatedTag.from(object).toObject();
	          break;
	        default:
	          throw new ObjectTypeError(oid || "", type, "blob|commit|tag|tree");
	      }
	      format = "content";
	    }
	    oid = await _writeObject({
	      fs,
	      gitdir: updatedGitdir,
	      type,
	      object,
	      oid,
	      format
	    });
	    return oid;
	  } catch (err) {
	    err.caller = "git.writeObject";
	    throw err;
	  }
	}
	async function writeRef({
	  fs: _fs,
	  dir,
	  gitdir = join(dir, ".git"),
	  ref,
	  value,
	  force = false,
	  symbolic = false
	}) {
	  try {
	    assertParameter("fs", _fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("ref", ref);
	    assertParameter("value", value);
	    const fs = new FileSystem(_fs);
	    if (!isValidRef(ref, true)) {
	      throw new InvalidRefNameError(ref, cleanGitRef.clean(ref));
	    }
	    const updatedGitdir = await discoverGitdir({ fsp: fs, dotgit: gitdir });
	    if (!force && await GitRefManager.exists({ fs, gitdir: updatedGitdir, ref })) {
	      throw new AlreadyExistsError("ref", ref);
	    }
	    if (symbolic) {
	      await GitRefManager.writeSymbolicRef({
	        fs,
	        gitdir: updatedGitdir,
	        ref,
	        value
	      });
	    } else {
	      value = await GitRefManager.resolve({
	        fs,
	        gitdir: updatedGitdir,
	        ref: value
	      });
	      await GitRefManager.writeRef({
	        fs,
	        gitdir: updatedGitdir,
	        ref,
	        value
	      });
	    }
	  } catch (err) {
	    err.caller = "git.writeRef";
	    throw err;
	  }
	}
	async function _writeTag({ fs, gitdir, tag: tag2 }) {
	  const object = GitAnnotatedTag.from(tag2).toObject();
	  const oid = await _writeObject({
	    fs,
	    gitdir,
	    type: "tag",
	    object,
	    format: "content"
	  });
	  return oid;
	}
	async function writeTag({ fs, dir, gitdir = join(dir, ".git"), tag: tag2 }) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("tag", tag2);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _writeTag({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      tag: tag2
	    });
	  } catch (err) {
	    err.caller = "git.writeTag";
	    throw err;
	  }
	}
	async function writeTree({ fs, dir, gitdir = join(dir, ".git"), tree }) {
	  try {
	    assertParameter("fs", fs);
	    assertParameter("gitdir", gitdir);
	    assertParameter("tree", tree);
	    const fsp = new FileSystem(fs);
	    const updatedGitdir = await discoverGitdir({ fsp, dotgit: gitdir });
	    return await _writeTree({
	      fs: fsp,
	      gitdir: updatedGitdir,
	      tree
	    });
	  } catch (err) {
	    err.caller = "git.writeTree";
	    throw err;
	  }
	}
	var index = {
	  Errors,
	  STAGE,
	  TREE,
	  WORKDIR,
	  add,
	  abortMerge,
	  addNote,
	  addRemote,
	  annotatedTag,
	  branch,
	  cherryPick,
	  checkout,
	  clone,
	  commit,
	  getConfig,
	  getConfigAll,
	  setConfig,
	  currentBranch,
	  deleteBranch,
	  deleteRef,
	  deleteRemote,
	  deleteTag,
	  expandOid,
	  expandRef,
	  fastForward,
	  fetch,
	  findMergeBase,
	  findRoot,
	  getRemoteInfo,
	  getRemoteInfo2,
	  hashBlob,
	  indexPack,
	  init,
	  isDescendent,
	  isIgnored,
	  listBranches,
	  listFiles,
	  listNotes,
	  listRefs,
	  listRemotes,
	  listServerRefs,
	  listTags,
	  log,
	  merge,
	  packObjects,
	  pull,
	  push,
	  readBlob,
	  readCommit,
	  readNote,
	  readObject,
	  readTag,
	  readTree,
	  remove,
	  removeNote,
	  renameBranch,
	  resetIndex,
	  updateIndex: updateIndex$1,
	  resolveRef,
	  status,
	  statusMatrix,
	  tag,
	  version,
	  walk,
	  writeBlob,
	  writeCommit,
	  writeObject,
	  writeRef,
	  writeTag,
	  writeTree,
	  stash
	};
	isomorphicGit.Errors = Errors;
	isomorphicGit.STAGE = STAGE;
	isomorphicGit.TREE = TREE;
	isomorphicGit.WORKDIR = WORKDIR;
	isomorphicGit.abortMerge = abortMerge;
	isomorphicGit.add = add;
	isomorphicGit.addNote = addNote;
	isomorphicGit.addRemote = addRemote;
	isomorphicGit.annotatedTag = annotatedTag;
	isomorphicGit.branch = branch;
	isomorphicGit.checkout = checkout;
	isomorphicGit.cherryPick = cherryPick;
	isomorphicGit.clone = clone;
	isomorphicGit.commit = commit;
	isomorphicGit.currentBranch = currentBranch;
	isomorphicGit.default = index;
	isomorphicGit.deleteBranch = deleteBranch;
	isomorphicGit.deleteRef = deleteRef;
	isomorphicGit.deleteRemote = deleteRemote;
	isomorphicGit.deleteTag = deleteTag;
	isomorphicGit.expandOid = expandOid;
	isomorphicGit.expandRef = expandRef;
	isomorphicGit.fastForward = fastForward;
	isomorphicGit.fetch = fetch;
	isomorphicGit.findMergeBase = findMergeBase;
	isomorphicGit.findRoot = findRoot;
	isomorphicGit.getConfig = getConfig;
	isomorphicGit.getConfigAll = getConfigAll;
	isomorphicGit.getRemoteInfo = getRemoteInfo;
	isomorphicGit.getRemoteInfo2 = getRemoteInfo2;
	isomorphicGit.hashBlob = hashBlob;
	isomorphicGit.indexPack = indexPack;
	isomorphicGit.init = init;
	isomorphicGit.isDescendent = isDescendent;
	isomorphicGit.isIgnored = isIgnored;
	isomorphicGit.listBranches = listBranches;
	isomorphicGit.listFiles = listFiles;
	isomorphicGit.listNotes = listNotes;
	isomorphicGit.listRefs = listRefs;
	isomorphicGit.listRemotes = listRemotes;
	isomorphicGit.listServerRefs = listServerRefs;
	isomorphicGit.listTags = listTags;
	isomorphicGit.log = log;
	isomorphicGit.merge = merge;
	isomorphicGit.packObjects = packObjects;
	isomorphicGit.pull = pull;
	isomorphicGit.push = push;
	isomorphicGit.readBlob = readBlob;
	isomorphicGit.readCommit = readCommit;
	isomorphicGit.readNote = readNote;
	isomorphicGit.readObject = readObject;
	isomorphicGit.readTag = readTag;
	isomorphicGit.readTree = readTree;
	isomorphicGit.remove = remove;
	isomorphicGit.removeNote = removeNote;
	isomorphicGit.renameBranch = renameBranch;
	isomorphicGit.resetIndex = resetIndex;
	isomorphicGit.resolveRef = resolveRef;
	isomorphicGit.setConfig = setConfig;
	isomorphicGit.stash = stash;
	isomorphicGit.status = status;
	isomorphicGit.statusMatrix = statusMatrix;
	isomorphicGit.tag = tag;
	isomorphicGit.updateIndex = updateIndex$1;
	isomorphicGit.version = version;
	isomorphicGit.walk = walk;
	isomorphicGit.writeBlob = writeBlob;
	isomorphicGit.writeCommit = writeCommit;
	isomorphicGit.writeObject = writeObject;
	isomorphicGit.writeRef = writeRef;
	isomorphicGit.writeTag = writeTag;
	isomorphicGit.writeTree = writeTree;
	return isomorphicGit;
}

var isomorphicGitExports = /*@__PURE__*/ requireIsomorphicGit();
var git = /*@__PURE__*/getDefaultExportFromCjs(isomorphicGitExports);

const GITIGNORE_DEFAULT = ".DS_Store\n";
const GRAPH_FILE_EXTENSION = ".subtext";
const PINS_FILENAME = ".pins.neno";
const MAX_DIFF_BYTES = 2e5;
function getFilenameForSlug(slug) {
  return `${slug}${GRAPH_FILE_EXTENSION}`;
}
async function fileExists(fs, path) {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}
function getHeadPath(dir) {
  return dir.endsWith("/") ? `${dir}.git/HEAD` : `${dir}/.git/HEAD`;
}
async function hasExistingRepo(fs, dir) {
  return fileExists(fs, getHeadPath(dir));
}
async function ensureRepo(fs, dir, author) {
  if (await hasExistingRepo(fs, dir)) {
    return;
  }
  await git.init({ fs, dir, defaultBranch: "main" });
  await fs.writeFile(
    dir.endsWith("/") ? `${dir}.gitignore` : `${dir}/.gitignore`,
    GITIGNORE_DEFAULT
  );
  const matrix = await git.statusMatrix({ fs, dir });
  for (const [filepath, , workdir] of matrix) {
    if (workdir === 0) continue;
    await git.add({ fs, dir, filepath });
  }
  await git.commit({
    fs,
    dir,
    author,
    message: "initial commit"
  });
}
function pathToSlug(path) {
  return path.endsWith(GRAPH_FILE_EXTENSION) ? path.slice(0, -GRAPH_FILE_EXTENSION.length) : path;
}
function formatMessage(creates, modifies, removes) {
  const total = creates.length + modifies.length + removes.length;
  if (total === 0) {
    return "update";
  }
  if (total === 1) {
    if (creates.length === 1) {
      const path2 = creates[0];
      if (path2.endsWith(GRAPH_FILE_EXTENSION)) {
        return `create: ${pathToSlug(path2)}`;
      }
      return `create file: ${path2}`;
    }
    if (modifies.length === 1) {
      const path2 = modifies[0];
      if (path2.endsWith(GRAPH_FILE_EXTENSION)) {
        return `update: ${pathToSlug(path2)}`;
      }
      return `update file: ${path2}`;
    }
    const path = removes[0];
    if (path.endsWith(GRAPH_FILE_EXTENSION)) {
      return `delete: ${pathToSlug(path)}`;
    }
    return `delete file: ${path}`;
  }
  const all = [...creates, ...modifies, ...removes];
  const noteCount = all.filter(
    (p) => p.endsWith(GRAPH_FILE_EXTENSION)
  ).length;
  const fileCount = total - noteCount;
  const header = [
    noteCount > 0 ? `${noteCount} note${noteCount === 1 ? "" : "s"}` : null,
    fileCount > 0 ? `${fileCount} file${fileCount === 1 ? "" : "s"}` : null
  ].filter((s) => s !== null).join(", ");
  const verb = modifies.length === 0 && removes.length === 0 ? "create" : creates.length === 0 && modifies.length === 0 ? "delete" : "update";
  const body = [
    ...creates.map((p) => `+ ${p}`),
    ...modifies.map((p) => `~ ${p}`),
    ...removes.map((p) => `- ${p}`)
  ].join("\n");
  return `${verb}: ${header}

${body}`;
}
async function stagePath(fs, dir, relPath, headOid, creates, modifies, removes) {
  const absPath = dir.endsWith("/") ? `${dir}${relPath}` : `${dir}/${relPath}`;
  if (await fileExists(fs, absPath)) {
    let inHead = false;
    if (headOid) {
      try {
        await git.readBlob({ fs, dir, oid: headOid, filepath: relPath });
        inHead = true;
      } catch {
        inHead = false;
      }
    }
    await git.add({ fs, dir, filepath: relPath });
    if (inHead) {
      modifies.push(relPath);
    } else {
      creates.push(relPath);
    }
  } else {
    try {
      await git.remove({ fs, dir, filepath: relPath });
      removes.push(relPath);
    } catch {
    }
  }
}
async function stageAll(fs, dir, creates, modifies, removes) {
  const matrix = await git.statusMatrix({ fs, dir });
  for (const row of matrix) {
    const [filepath, head, workdir, stage] = row;
    if (workdir === head && stage === head) {
      continue;
    }
    if (workdir === 0) {
      try {
        await git.remove({ fs, dir, filepath });
        removes.push(filepath);
      } catch {
      }
    } else {
      await git.add({ fs, dir, filepath });
      if (head === 0) {
        creates.push(filepath);
      } else {
        modifies.push(filepath);
      }
    }
  }
}
async function commitChanged(fs, dir, changes, author) {
  const creates = [];
  const modifies = [];
  const removes = [];
  let headOid = null;
  try {
    headOid = await git.resolveRef({ fs, dir, ref: "HEAD" });
  } catch {
    headOid = null;
  }
  const allSetsAreSets = changes.canonicalNoteSlugs instanceof Set && changes.aliases instanceof Set && changes.arbitraryFiles instanceof Set;
  if (!allSetsAreSets) {
    await stageAll(fs, dir, creates, modifies, removes);
  } else {
    const noteSlugs = changes.canonicalNoteSlugs;
    const aliasSlugs = changes.aliases;
    const fileSlugs = changes.arbitraryFiles;
    for (const slug of noteSlugs) {
      await stagePath(
        fs,
        dir,
        getFilenameForSlug(slug),
        headOid,
        creates,
        modifies,
        removes
      );
    }
    for (const slug of aliasSlugs) {
      await stagePath(
        fs,
        dir,
        getFilenameForSlug(slug),
        headOid,
        creates,
        modifies,
        removes
      );
    }
    for (const slug of fileSlugs) {
      await stagePath(
        fs,
        dir,
        getFilenameForSlug(slug),
        headOid,
        creates,
        modifies,
        removes
      );
      await stagePath(
        fs,
        dir,
        slug,
        headOid,
        creates,
        modifies,
        removes
      );
    }
  }
  if (changes.flushPins) {
    await stagePath(
      fs,
      dir,
      PINS_FILENAME,
      headOid,
      creates,
      modifies,
      removes
    );
  }
  if (creates.length === 0 && modifies.length === 0 && removes.length === 0) {
    return;
  }
  await git.commit({
    fs,
    dir,
    author,
    message: formatMessage(creates, modifies, removes)
  });
}
async function getChangedPaths(fs, dir, oid, parentOid) {
  const trees = parentOid ? [git.TREE({ ref: oid }), git.TREE({ ref: parentOid })] : [git.TREE({ ref: oid })];
  const changes = [];
  await git.walk({
    fs,
    dir,
    trees,
    map: async (filepath, entries) => {
      if (filepath === ".") return;
      if (!entries) return;
      const A = entries[0];
      const B = entries.length > 1 ? entries[1] : null;
      const aType = A ? await A.type() : null;
      const bType = B ? await B.type() : null;
      if (aType === "tree" || bType === "tree") return;
      const aOid = A ? await A.oid() : null;
      const bOid = B ? await B.oid() : null;
      if (parentOid) {
        if (aOid === bOid) return;
        if (!A) {
          changes.push({ path: filepath, change: "delete" });
        } else if (!B) {
          changes.push({ path: filepath, change: "add" });
        } else {
          changes.push({ path: filepath, change: "modify" });
        }
      } else if (A) {
        changes.push({ path: filepath, change: "add" });
      }
    }
  });
  changes.sort((a, b) => a.path.localeCompare(b.path));
  return changes;
}
async function getCommitHistory(fs, dir, options) {
  const { limit, offset } = options;
  const allCommits = await git.log({
    fs,
    dir,
    depth: offset + limit
  });
  const page = allCommits.slice(offset, offset + limit);
  const result = [];
  for (const entry of page) {
    const parentOid = entry.commit.parent[0];
    const changes = await getChangedPaths(fs, dir, entry.oid, parentOid);
    result.push({
      oid: entry.oid,
      message: entry.commit.message,
      author: {
        name: entry.commit.author.name,
        email: entry.commit.author.email
      },
      timestamp: entry.commit.author.timestamp,
      timezoneOffset: entry.commit.author.timezoneOffset,
      changes
    });
  }
  return result;
}
function isBinary(bytes) {
  const limit = Math.min(bytes.length, 8e3);
  for (let i = 0; i < limit; i++) {
    if (bytes[i] === 0) return true;
  }
  return false;
}
function decode(bytes) {
  return new TextDecoder("utf-8").decode(bytes);
}
function tokenize(text) {
  return text.match(/\w+|\s+|[^\s\w]/gu) ?? [];
}
function pushSegment(arr, text, emphasized) {
  const last = arr[arr.length - 1];
  if (last && last.emphasized === emphasized) {
    last.text += text;
  } else {
    arr.push({ text, emphasized });
  }
}
function diffTokens(oldText, newText) {
  const a = tokenize(oldText);
  const b = tokenize(newText);
  const m = a.length;
  const n = b.length;
  const lcs = Array.from(
    { length: m + 1 },
    () => new Array(n + 1).fill(0)
  );
  for (let i2 = 1; i2 <= m; i2++) {
    for (let j2 = 1; j2 <= n; j2++) {
      if (a[i2 - 1] === b[j2 - 1]) {
        lcs[i2][j2] = lcs[i2 - 1][j2 - 1] + 1;
      } else {
        lcs[i2][j2] = Math.max(lcs[i2 - 1][j2], lcs[i2][j2 - 1]);
      }
    }
  }
  const ops = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      ops.unshift({ type: "context", text: a[i - 1] });
      i--;
      j--;
    } else if (lcs[i - 1][j] >= lcs[i][j - 1]) {
      ops.unshift({ type: "remove", text: a[i - 1] });
      i--;
    } else {
      ops.unshift({ type: "add", text: b[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    i--;
    ops.unshift({ type: "remove", text: a[i] });
  }
  while (j > 0) {
    j--;
    ops.unshift({ type: "add", text: b[j] });
  }
  const removeSegments = [];
  const addSegments = [];
  for (const op of ops) {
    if (op.type === "context") {
      pushSegment(removeSegments, op.text, false);
      pushSegment(addSegments, op.text, false);
    } else if (op.type === "remove") {
      pushSegment(removeSegments, op.text, true);
    } else {
      pushSegment(addSegments, op.text, true);
    }
  }
  return { removeSegments, addSegments };
}
function pairLines(lines) {
  const result = [...lines];
  let i = 0;
  while (i < result.length) {
    if (result[i].type === "context") {
      i++;
      continue;
    }
    const runStart = i;
    while (i < result.length && result[i].type !== "context") i++;
    const runEnd = i;
    const removeIndexes = [];
    const addIndexes = [];
    for (let k = runStart; k < runEnd; k++) {
      if (result[k].type === "remove") {
        removeIndexes.push(k);
      } else {
        addIndexes.push(k);
      }
    }
    const pairCount = Math.min(removeIndexes.length, addIndexes.length);
    for (let p = 0; p < pairCount; p++) {
      const removeIdx = removeIndexes[p];
      const addIdx = addIndexes[p];
      const { removeSegments, addSegments } = diffTokens(
        result[removeIdx].text,
        result[addIdx].text
      );
      result[removeIdx] = { ...result[removeIdx], segments: removeSegments };
      result[addIdx] = { ...result[addIdx], segments: addSegments };
    }
  }
  return result;
}
function diffLines(oldText, newText) {
  const a = oldText.length === 0 ? [] : oldText.split("\n");
  const b = newText.length === 0 ? [] : newText.split("\n");
  const m = a.length;
  const n = b.length;
  const lcs = Array.from(
    { length: m + 1 },
    () => new Array(n + 1).fill(0)
  );
  for (let i2 = 1; i2 <= m; i2++) {
    for (let j2 = 1; j2 <= n; j2++) {
      if (a[i2 - 1] === b[j2 - 1]) {
        lcs[i2][j2] = lcs[i2 - 1][j2 - 1] + 1;
      } else {
        lcs[i2][j2] = Math.max(lcs[i2 - 1][j2], lcs[i2][j2 - 1]);
      }
    }
  }
  const result = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift({ type: "context", text: a[i - 1] });
      i--;
      j--;
    } else if (lcs[i - 1][j] >= lcs[i][j - 1]) {
      result.unshift({ type: "remove", text: a[i - 1] });
      i--;
    } else {
      result.unshift({ type: "add", text: b[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    i--;
    result.unshift({ type: "remove", text: a[i] });
  }
  while (j > 0) {
    j--;
    result.unshift({ type: "add", text: b[j] });
  }
  return result;
}
async function getCommitDiff(fs, dir, oid) {
  const { commit } = await git.readCommit({ fs, dir, oid });
  const parentOid = commit.parent[0];
  const changedPaths = await getChangedPaths(fs, dir, oid, parentOid);
  const result = [];
  for (const cp of changedPaths) {
    const fileDiff = { path: cp.path, change: cp.change };
    let oldBytes = null;
    let newBytes = null;
    try {
      if (cp.change !== "add" && parentOid) {
        const { blob } = await git.readBlob({
          fs,
          dir,
          oid: parentOid,
          filepath: cp.path
        });
        oldBytes = blob;
      }
      if (cp.change !== "delete") {
        const { blob } = await git.readBlob({
          fs,
          dir,
          oid,
          filepath: cp.path
        });
        newBytes = blob;
      }
    } catch {
      result.push(fileDiff);
      continue;
    }
    if (oldBytes && isBinary(oldBytes) || newBytes && isBinary(newBytes)) {
      fileDiff.binary = true;
      result.push(fileDiff);
      continue;
    }
    const oldSize = oldBytes ? oldBytes.length : 0;
    const newSize = newBytes ? newBytes.length : 0;
    if (oldSize > MAX_DIFF_BYTES || newSize > MAX_DIFF_BYTES) {
      fileDiff.tooLarge = true;
      result.push(fileDiff);
      continue;
    }
    const oldText = oldBytes ? decode(oldBytes) : "";
    const newText = newBytes ? decode(newBytes) : "";
    fileDiff.lines = pairLines(diffLines(oldText, newText));
    result.push(fileDiff);
  }
  return result;
}

globalThis.Buffer = bufferExports.Buffer;
let notesProvider = null;
let gitFs = null;
let dirHandleForGit = null;
let folderName = null;
let usingOPFS = false;
let gitAuthor = {
  name: "NENO",
  email: "noreply@neno.local"
};
let initPromise = null;
const tabPorts = /* @__PURE__ */ new Set();
const subPorts = /* @__PURE__ */ new Set();
const MUTATING_METHODS = /* @__PURE__ */ new Set([
  "put",
  "remove",
  "addFile",
  "updateFile",
  "renameFileSlug",
  "deleteFile",
  "pin",
  "unpin",
  "movePinPosition",
  "reIndexGraph"
]);
function getTransferables(value) {
  if (value instanceof ReadableStream) {
    return [value];
  }
  return [];
}
function broadcast(message, except) {
  for (const port of tabPorts) {
    if (port === except) continue;
    try {
      port.postMessage(message);
    } catch {
      tabPorts.delete(port);
    }
  }
}
async function runInitialize(opts) {
  let dirHandle;
  if (opts.useOPFS) {
    dirHandle = await navigator.storage.getDirectory();
    usingOPFS = true;
  } else if (opts.folderHandle) {
    dirHandle = opts.folderHandle;
    usingOPFS = false;
  } else {
    throw new Error("No folder handle or OPFS flag provided");
  }
  const storageProvider = new FileSystemAccessAPIStorageProvider(dirHandle);
  if (opts.createDummyNotes) {
    for (let i = 1; i <= 1e3; i++) {
      await storageProvider.writeObject(
        "note-" + i + ".subtext",
        "Test note " + i
      );
    }
  }
  if (opts.gitAuthor) {
    gitAuthor = opts.gitAuthor;
  }
  dirHandleForGit = dirHandle;
  const candidateGitFs = new FileSystemAccessFs(dirHandle);
  if (await hasExistingRepo(candidateGitFs, "/")) {
    await ensureRepo(candidateGitFs, "/", gitAuthor);
    gitFs = candidateGitFs;
  }
  notesProvider = new NotesProvider(storageProvider, {
    onFlush: async (change) => {
      if (!gitFs) return;
      await commitChanged(gitFs, "/", change, gitAuthor);
    }
  });
  folderName = dirHandle.name;
}
async function ensureInitialized(opts) {
  if (notesProvider) return;
  if (!initPromise) {
    initPromise = runInitialize(opts).catch((e) => {
      initPromise = null;
      throw e;
    });
  }
  await initPromise;
}
function tearDown() {
  notesProvider = null;
  gitFs = null;
  dirHandleForGit = null;
  folderName = null;
  usingOPFS = false;
  initPromise = null;
}
async function handleRPCCall(msg, port) {
  const { id, method, args } = msg;
  const respond = (data, transfer) => {
    port.postMessage(data, transfer ?? []);
  };
  if (method === "getCommitHistory") {
    if (!gitFs) {
      respond({ id, error: "Git not initialized" });
      return;
    }
    try {
      const [options] = args;
      const result = await getCommitHistory(gitFs, "/", options);
      respond({ id, result });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      respond({ id, error: message });
    }
    return;
  }
  if (method === "getCommitDiff") {
    if (!gitFs) {
      respond({ id, error: "Git not initialized" });
      return;
    }
    try {
      const [oid] = args;
      const result = await getCommitDiff(gitFs, "/", oid);
      respond({ id, result });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      respond({ id, error: message });
    }
    return;
  }
  if (!notesProvider) {
    respond({ id, error: "NotesProvider not initialized" });
    return;
  }
  try {
    const fn = notesProvider[method];
    if (typeof fn !== "function") {
      respond({ id, error: `Unknown method: ${method}` });
      return;
    }
    const result = await fn.apply(notesProvider, args);
    const transferables = getTransferables(result);
    respond({ id, result }, transferables);
    if (MUTATING_METHODS.has(method)) {
      broadcast({ event: "mutation" }, port);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    respond({ id, error: message });
  }
}
function attachDispatch(port) {
  port.addEventListener("message", (event) => {
    const data = event.data;
    if (data && typeof data === "object" && "action" in data) {
      handleAction(
        data,
        port,
        event.ports
      );
      return;
    }
    if (data && typeof data === "object" && "id" in data) {
      handleRPCCall(data, port);
    }
  });
  port.start();
}
function registerSubPort(port) {
  subPorts.add(port);
  attachDispatch(port);
}
function registerTabPort(port) {
  tabPorts.add(port);
  attachDispatch(port);
}
async function handleAction(action, port, ports) {
  if (action.action === "hello") {
    port.postMessage({
      action: "helloAck",
      initialized: notesProvider !== null,
      gitEnabled: gitFs !== null,
      folderName,
      usingOPFS,
      connectedTabCount: tabPorts.size
    });
    return;
  }
  if (action.action === "initialize") {
    try {
      await ensureInitialized({
        folderHandle: action.folderHandle,
        useOPFS: action.useOPFS,
        createDummyNotes: action.createDummyNotes,
        gitAuthor: action.gitAuthor
      });
      port.postMessage({
        action: "initialized",
        gitEnabled: gitFs !== null,
        folderName,
        usingOPFS
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      port.postMessage({ action: "initError", error: message });
    }
    return;
  }
  if (action.action === "addPort") {
    const newPort = ports[0];
    if (newPort) {
      registerSubPort(newPort);
    }
    return;
  }
  if (action.action === "setGitAuthor") {
    gitAuthor = action.author;
    return;
  }
  if (action.action === "enableGit") {
    if (gitFs) {
      port.postMessage({ action: "gitEnabled" });
      return;
    }
    if (!dirHandleForGit) {
      port.postMessage({
        action: "gitEnableFailed",
        error: "Worker not initialized"
      });
      return;
    }
    const candidateGitFs = new FileSystemAccessFs(dirHandleForGit);
    try {
      await ensureRepo(candidateGitFs, "/", gitAuthor);
      gitFs = candidateGitFs;
      port.postMessage({ action: "gitEnabled" });
      broadcast({ event: "gitEnabled" }, port);
    } catch (e) {
      port.postMessage({
        action: "gitEnableFailed",
        error: e instanceof Error ? e.message : String(e)
      });
    }
    return;
  }
  if (action.action === "reset") {
    const otherTabs = tabPorts.size - (tabPorts.has(port) ? 1 : 0);
    if (otherTabs > 0) {
      port.postMessage({
        action: "resetDenied",
        connectedTabCount: tabPorts.size
      });
      return;
    }
    tearDown();
    port.postMessage({ action: "resetOk" });
    return;
  }
  if (action.action === "goodbye") {
    tabPorts.delete(port);
    return;
  }
}
globalThis.onconnect = (event) => {
  const port = event.ports[0];
  registerTabPort(port);
};
