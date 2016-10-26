(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CWN = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(require,module,exports){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
},{}],4:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var reduce = require('reduce');
var requestBase = require('./request-base');
var isObject = require('./is-object');

/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  root = this;
}

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Expose `request`.
 */

var request = module.exports = require('./request').bind(null, Request);

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pushEncodedKeyValuePair(pairs, key, obj[key]);
        }
      }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (Array.isArray(val)) {
    return val.forEach(function(v) {
      pushEncodedKeyValuePair(pairs, key, v);
    });
  }
  pairs.push(encodeURIComponent(key)
    + '=' + encodeURIComponent(val));
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text ? this.text : this.xhr.response)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }

  var type = status / 100 | 0;

  // status / class
  this.status = this.statusCode = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
      // issue #876: return the http status code if the response parsing fails
      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
      return self.callback(err);
    }

    self.emit('response', res);

    if (err) {
      return self.callback(err, res);
    }

    if (res.status >= 200 && res.status < 300) {
      return self.callback(err, res);
    }

    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
    new_err.original = err;
    new_err.response = res;
    new_err.status = res.status;

    self.callback(new_err, res);
  });
}

/**
 * Mixin `Emitter` and `requestBase`.
 */

Emitter(Request.prototype);
for (var key in requestBase) {
  Request.prototype[key] = requestBase[key];
}

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr && this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set responseType to `val`. Presently valid responseTypes are 'blob' and 
 * 'arraybuffer'.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (!options) {
    options = {
      type: 'basic'
    }
  }

  switch (options.type) {
    case 'basic':
      var str = btoa(user + ':' + pass);
      this.set('Authorization', 'Basic ' + str);
    break;

    case 'auto':
      this.username = user;
      this.password = pass;
    break;
  }
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  this._getFormData().append(field, file, filename || file.name);
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this._header['content-type'];

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj || isHost(data)) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * @deprecated
 */
Response.prototype.parse = function serialize(fn){
  if (root.console) {
    console.warn("Client-side parse() method has been renamed to serialize(). This method is not compatible with superagent v2.0");
  }
  this.serialize(fn);
  return this;
};

Response.prototype.serialize = function serialize(fn){
  this._parser = fn;
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  this.clearTimeout();
  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (0 == status) {
      if (self.timedout) return self.timeoutError();
      if (self.aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(e){
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = 'download';
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    xhr.onprogress = handleProgress;
  }
  try {
    if (xhr.upload && this.hasListeners('progress')) {
      xhr.upload.onprogress = handleProgress;
    }
  } catch(e) {
    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
    // Reported here:
    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.timedout = true;
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  if (this.username && this.password) {
    xhr.open(this.method, this.url, true, this.username, this.password);
  } else {
    xhr.open(this.method, this.url, true);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._parser || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};


/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

function del(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

},{"./is-object":5,"./request":7,"./request-base":6,"emitter":1,"reduce":3}],5:[function(require,module,exports){
/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null != obj && 'object' == typeof obj;
}

module.exports = isObject;

},{}],6:[function(require,module,exports){
/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = require('./is-object');

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

exports.clearTimeout = function _clearTimeout(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Force given parser
 *
 * Sets the body parser no matter type.
 *
 * @param {Function}
 * @api public
 */

exports.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

exports.timeout = function timeout(ms){
  this._timeout = ms;
  return this;
};

/**
 * Faux promise support
 *
 * @param {Function} fulfill
 * @param {Function} reject
 * @return {Request}
 */

exports.then = function then(fulfill, reject) {
  return this.end(function(err, res) {
    err ? reject(err) : fulfill(res);
  });
}

/**
 * Allow for extension
 */

exports.use = function use(fn) {
  fn(this);
  return this;
}


/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

exports.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

exports.getHeader = exports.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

exports.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
exports.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val` for "multipart/form-data"
 * request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 * ```
 *
 * @param {String} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
exports.field = function(name, val) {
  this._getFormData().append(name, val);
  return this;
};

},{"./is-object":5}],7:[function(require,module,exports){
// The node and browser modules expose versions of this with the
// appropriate constructor function bound as first argument
/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(RequestConstructor, method, url) {
  // callback
  if ('function' == typeof url) {
    return new RequestConstructor('GET', method).end(url);
  }

  // url first
  if (2 == arguments.length) {
    return new RequestConstructor('GET', method);
  }

  return new RequestConstructor(method, url);
}

module.exports = request;

},{}],8:[function(require,module,exports){
// elements that need charts can push to this array callbacks for when charts are loaded
var chartLoadHandlers = [];

google.load("visualization", '1', {
    packages: ['corechart', 'line'],
    callback: function () {
        for (var i = 0; i < chartLoadHandlers.length; i++) {
            chartLoadHandlers[i]();
        }
    }
});

module.exports = chartLoadHandlers;

},{}],9:[function(require,module,exports){
module.exports = {
  nodes: require('./nodes'),
  regions: require('./regions')
};

},{"./nodes":10,"./regions":11}],10:[function(require,module,exports){
var rest = require('../rest');

function NodeCollection() {

  this.nodes = [];
  this.links = [];
  this.extras = {}; // extra data for node

  this.index = {
    prmname: {},
    hobbesId: {},
    origins: {},
    terminals: {},
    regions: {}
  };

  this.init = function (nodes) {
    this.nodes = [];
    this.links = [];
    this.extras = {};

    this.index = {
      prmname: {},
      hobbesId: {},
      origins: {},
      terminals: {},
      regions: {}
    };

    nodes.forEach(node => {
      this.index.prmname[node.properties.prmname] = node;
      this.index.hobbesId[node.properties.hobbes.id] = node;

      if (node.properties.hobbes.type === 'link') {
        this.links.push(node);
        this.setLinkIndexes(node);
      } else {
        if (!node.properties.hobbes.region) {
          node.properties.hobbes.region = 'California';
        }

        if (!this.index.regions[node.properties.hobbes.region]) {
          this.index.regions[node.properties.hobbes.region] = [];
        }
        this.index.regions[node.properties.hobbes.region].push(node);
        this.nodes.push(node);
      }
    });
  };

  this.setLinkIndexes = function (link) {
    if (!this.index.origins[link.properties.origin]) {
      this.index.origins[link.properties.origin] = [link];
    } else {
      this.index.origins[link.properties.origin].push(link);
    }

    if (!this.index.terminals[link.properties.terminus]) {
      this.index.terminals[link.properties.terminus] = [link];
    } else {
      this.index.terminals[link.properties.terminus].push(link);
    }
  };

  this.getExtras = function (prmname, callback) {
    if (this.extras[prmname]) {
      if (this.extras[prmname].__loading__) {
        this.extras[prmname].handlers.push(callback);
      } else {
        callback(this.extras[prmname]);
      }
      return;
    }

    this.extras[prmname] = {
      __loading__: true,
      handlers: [callback]
    };

    rest.getExtras(prmname, resp => {
      for (var i = 0; i < this.extras[prmname].handlers.length; i++) {
        this.extras[prmname].handlers[i](resp);
      }
      this.extras[prmname] = resp;
    });
  };

  this.getByRegion = function (id) {
    return this.index.regions[id] || [];
  };

  this.getByPrmname = function (prmname) {
    return this.index.prmname[prmname];
  };

  this.getById = function (id) {
    return this.index.hobbesId[id];
  };

  this.getOrigins = function (prmname) {
    return this.index.origins[prmname];
  };

  this.getTerminals = function (prmname) {
    return this.index.terminals[prmname];
  };
}

module.exports = new NodeCollection();

},{"../rest":37}],11:[function(require,module,exports){
var rest = require('../rest');

function RegionCollection() {
  this.index = {
    name: {},
    hobbesId: {},
    regions: {}
  };

  this.data = [], this.aggregate = {};

  this.init = function (regions) {
    this.index = {
      name: {},
      hobbesId: {},
      regions: {}
    };
    this.aggregate = {};

    regions.forEach(region => {
      this.index.name[region.properties.name] = region;
      this.index.hobbesId[region.properties.hobbes.id] = region;

      if (!region.properties.hobbes.region && region.properties.hobbes.id !== 'California') {
        region.properties.hobbes.region = 'California';
      }

      if (!this.index.regions[region.properties.hobbes.region]) {
        this.index.regions[region.properties.hobbes.region] = [];
      }
      this.index.regions[region.properties.hobbes.region].push(region);
    });

    this.data = regions;
  };

  this.loadAggregate = function (type, origin, terminus, callback) {
    var prmname = origin;
    if (typeof terminus === 'string') {
      prmname = prmname + '--' + terminus;
    } else {
      callback = terminus;
    }

    if (!this.aggregate[type]) {
      this.aggregate[type] = {};
    }

    if (this.aggregate[type][prmname]) {
      if (this.aggregate[type][prmname].__loading__) {
        this.aggregate[type][prmname].handlers.push(callback);
      } else {
        callback(this.aggregate[type][prmname]);
      }
      return;
    }

    this.aggregate[type][prmname] = {
      __loading__: true,
      handlers: [callback]
    };

    if (typeof terminus !== 'string') {
      rest.getAggregate({ type: type, region: origin }, resp => {
        for (var i = 0; i < this.aggregate[type][prmname].handlers.length; i++) {
          this.aggregate[type][prmname].handlers[i](resp);
        }
        this.aggregate[type][prmname] = resp;
      });
    } else {
      rest.getAggregate({ type: 'flow', origin: origin, terminus: terminus }, resp1 => {
        rest.getAggregate({ type: 'flow', origin: terminus, terminus: origin }, resp2 => {
          var data = {
            origin: resp1,
            terminus: resp2
          };

          for (var i = 0; i < this.aggregate[type][prmname].handlers.length; i++) {
            this.aggregate[type][prmname].handlers[i](data);
          }
          this.aggregate[type][prmname] = data;
        });
      });
    }
  };

  this.getByRegion = function (id) {
    return this.index.regions[id] || [];
  };

  this.getByName = function (name) {
    return this.index.name[name];
  };

  this.getById = function (id) {
    return this.index.hobbesId[id];
  };
}

module.exports = new RegionCollection();

},{"../rest":37}],12:[function(require,module,exports){
module.exports = {
  network: require('./network')
};

},{"./network":13}],13:[function(require,module,exports){
var EventEmitter = require('events');
var events = new EventEmitter();

var nodeCollection = require('../collections/nodes');
var regionsCollection = require('../collections/regions');
var rest = require('../rest');

function loadNetwork(callback) {
    api.loading = true;
    events.emit('loading');

    rest.loadNetwork(data => {
        nodeCollection.init(data.network);
        processNodesLinks(data.network);

        regionsCollection.init(data.regions);
        data.regions.forEach(processRegion);

        api.loading = false;
        events.emit('loading-complete');
        if (callback) callback();
    });
}

function processNodesLinks(nodes) {
    for (var i = 0; i < nodes.length; i++) {
        if (!nodes[i].properties.description) {
            nodes[i].properties.description = '';
        }

        markCalibrationNode(nodes[i]);

        if (nodes[i].properties.hobbes.type === 'link') {
            markLinkTypes(nodes[i]);
        }
    }
}

function markCalibrationNode(node) {
    if (node.properties.prmname.indexOf('_') > -1) {
        var parts = node.properties.prmname.split('_');
        if (!(parts[0].match(/^CN.*/) || parts[1].match(/^CN.*/))) {
            return;
        }
    } else if (!node.properties.prmname.match(/^CN.*/)) {
        return;
    }

    var hasIn = false;
    var hasOut = false;

    if (node.properties.terminals) {
        for (var i = 0; i < node.properties.terminals.length; i++) {
            if (node.properties.terminals[i] != null) {
                hasOut = true;
                break;
            }
        }
    }
    if (node.properties.origins) {
        for (var i = 0; i < node.properties.origins.length; i++) {
            if (node.properties.origins[i] != null) {
                hasIn = true;
                break;
            }
        }
    }

    node.properties.calibrationNode = true;
    if (!hasIn && !hasOut) return;

    if (hasIn && hasOut) node.properties.calibrationMode = 'both';else if (hasIn) node.properties.calibrationMode = 'in';else if (hasOut) node.properties.calibrationMode = 'out';
}

function markLinkTypes(link) {
    link.properties.renderInfo = {
        cost: link.properties.hasCosts ? true : false,
        amplitude: link.properties.amplitude ? true : false,
        // TODO: parser needs to sheet shortcut for contraint type
        // data will still need to be loaded on second call
        constraints: link.properties.hasConstraints ? true : false,
        environmental: link.properties.hasClimate ? true : false
    };

    try {

        // Flow to a sink
        if (nodeCollection.getByPrmname(link.properties.terminus) && nodeCollection.getByPrmname(link.properties.terminus).properties.type == 'Sink') {
            link.properties.renderInfo.type = 'flowToSink';
        } else if (link.properties.type == 'Return Flow') {
            link.properties.renderInfo.type = 'returnFlowFromDemand';
        } else if (isGWToDemand(link)) {
            link.properties.renderInfo.type = 'gwToDemand';
        } else if (nodeCollection.getByPrmname(link.properties.origin) && (nodeCollection.getByPrmname(link.properties.origin).properties.calibrationMode == 'in' || nodeCollection.getByPrmname(link.properties.origin).properties.calibrationMode == 'both')) {

            link.properties.renderInfo.type = 'artificalRecharge';
        } else {

            link.properties.renderInfo.type = 'unknown';
        }
    } catch (e) {
        debugger;
    }

    if (!link.geometry) return;else if (!link.geometry.coordinates) return;

    // finally, mark the angle of the line, so we can rotate the icon on the
    // map accordingly
    var width = link.geometry.coordinates[1][0] - link.geometry.coordinates[0][0];
    var height = link.geometry.coordinates[1][1] - link.geometry.coordinates[0][1];
    link.properties.renderInfo.rotate = Math.atan(width / height) * (180 / Math.PI);
}

function isGWToDemand(link) {
    var origin = nodeCollection.getByPrmname(link.properties.origin);
    var terminal = nodeCollection.getByPrmname(link.properties.terminal);

    if (!origin || !terminal) return false;

    if (origin.properties.type != 'Groundwater Storage') return false;
    if (terminal.properties.type == 'Non-Standard Demand' || terminal.properties.type == 'Agricultural Demand' || terminal.properties.type == 'Urban Demand') return true;

    return false;
}

function processRegion(region) {
    if (region.properties.subregions) {
        region.properties.subregions.sort();
    }

    if (!region.geometry) return;

    var polys = getXYPolygons(region);

    region.properties.simplified = [];
    for (var i = 0; i < polys.length; i++) {
        if (polys[i].length > 100) {
            region.properties.simplified.push(L.LineUtil.simplify(polys[i], 0.001));
        } else {
            region.properties.simplified.push(polys[i]);
        }
    }

    region.properties.center = getCenter(region.properties.simplified[0]);

    // todo calc bbox so we know if we need to render geometry or not
    for (var i = 0; i < region.properties.simplified.length; i++) {
        for (var j = 0; j < region.properties.simplified[i].length; j++) {
            region.properties.simplified[i][j] = [region.properties.simplified[i][j].x, region.properties.simplified[i][j].y];
        }
    }

    // HACK
    if (isNaN(region.properties.center[0])) region.properties.center = region.properties.simplified[0][0];
}

function getXYPolygons(geojson) {
    var polys = [],
        tmp = [],
        i,
        j,
        p;
    if (geojson.geometry.type == 'Polygon') {
        // we only care about the outer ring.  no holes allowed.
        for (i = 0; i < geojson.geometry.coordinates[0].length; i++) {
            tmp.push({
                x: geojson.geometry.coordinates[0][i][0],
                y: geojson.geometry.coordinates[0][i][1]
            });
        }
        polys.push(tmp);
    } else if (geojson.geometry.type == 'MultiPolygon') {
        // we only care about the outer ring.  no holes allowed.
        for (i = 0; i < geojson.geometry.coordinates.length; i++) {
            tmp = [];
            p = geojson.geometry.coordinates[i][0];

            for (j = 0; j < p.length; j++) {
                tmp.push({
                    x: p[j][0],
                    y: p[j][1]
                });
            }

            polys.push(tmp);
        }
    }
    return polys;
}

function getCenter(points) {
    var i,
        j,
        len,
        p1,
        p2,
        f,
        area,
        x,
        y,

    // polygon centroid algorithm; uses all the rings, may works better for banana type polygons

    area = x = y = 0;

    for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
        p1 = points[i];
        p2 = points[j];

        f = p1.y * p2.x - p2.y * p1.x;
        x += (p1.x + p2.x) * f;
        y += (p1.y + p2.y) * f;
    }

    f = getArea(points) * 6;
    return [-1 * (x / f), -1 * (y / f)];
}

/** helper for processing region center **/
function getArea(points) {
    var area = 0;
    var lengthPoints = points.length;
    var j = lengthPoints - 1;
    var p1;var p2;
    for (var i = 0; i < lengthPoints; j = i++) {
        p1 = points[i];p2 = points[j];
        area += p1.x * p2.y;
        area -= p1.y * p2.x;
    }
    area /= 2;
    return area;
}

var api = {
    loading: true,
    load: loadNetwork,
    on: function (evt, fn) {
        events.on(evt, fn);
    },
    onLoad: function (callback) {
        this.on('loading-complete', callback);

        if (this.loading) {
            return;
        }

        callback();
    }
};

module.exports = api;

},{"../collections/nodes":10,"../collections/regions":11,"../rest":37,"events":2}],14:[function(require,module,exports){

require('./sigma-cwn-plugin');

module.exports = {
  collections: require('./collections'),
  controllers: require('./controllers'),
  map: require('./map'),
  renderer: require('./renderer'),
  chartLoadHandlers: require('./charts')
};

},{"./charts":8,"./collections":9,"./controllers":12,"./map":17,"./renderer":25,"./sigma-cwn-plugin":38}],15:[function(require,module,exports){
var behavior = {
  onLayerClick: function (features, e) {
    if (features.length == 0) return;

    var type = features[0].geojson.geometry.type;

    if (features.length == 1 && type == 'Polygon' || type == 'MultiPolygon') {
      if (this.shiftPessed) {
        window.location.href = '#info/' + features[0].geojson.properties.name;
        return;
      }

      if (!features[0].geojson.properties._render) features[0].geojson.properties._render = {};
      features[0].geojson.properties._render.hover = true;
      this.markerLayer.render();

      setTimeout(function () {
        this.onRegionClick(features[0].geojson.properties.hobbes.id);

        features[0].geojson.properties._render.hover = false;
        this.markerLayer.render();
      }.bind(this), 0);
      return;
    }

    if (features.length == 1 && features[0].geojson.properties.prmname) {
      window.location.href = '#info/' + features[0].geojson.properties.prmname;
      return;
    }

    this.selector.onClick(features);
  },

  onLayerMouseMove: function (features, e) {
    var label = [],
        linkLabel = '',
        regionLabel = '';
    var i, f;

    for (i = 0; i < features.length; i++) {
      f = features[i].geojson.properties;

      if (f.type == 'Diversion' || f.type == 'Return Flow') label.push(f.type + ' <b>' + f.prmname + '</b>');else if (f.type == 'Link Group') label.push(f.type + ' <b>Count: ' + f.lines.length + '</b>');else if (f.type == 'Region') label.push(f.type + ' <b>' + f.name + '</b>');else label.push(f.type + ' <b>' + f.prmname + '</b>');
    }

    if (features.length > 0) {
      this.showHoverLabel(true, label.join('<br />'), e.containerPoint);
      this.$.leaflet.style.cursor = 'pointer';
    } else {
      this.showHoverLabel(false);
      this.$.leaflet.style.cursor = '-webkit-grab';
    }
  },

  onLayerMouseOver: function (features, e) {
    var i, f;

    for (i = 0; i < features.length; i++) {
      f = features[i].geojson.properties;

      if (!f._render) f._render = {};
      f._render.hover = true;
    }
  },

  onLayerMouseOut: function (features) {
    for (var i = 0; i < features.length; i++) {
      if (!features[i].geojson.properties._render) features[i].geojson.properties._render = {};
      features[i].geojson.properties._render.hover = false;
    }
  },

  showHoverLabel: function (show, label, pos) {
    if (show) {
      this.$.hoverLabel.style.display = 'block';
      this.$.hoverLabel.style.left = pos.x + 10 + 'px';
      this.$.hoverLabel.style.top = pos.y + 10 + 'px';
      this.$.hoverLabel.innerHTML = label;
    } else {
      this.$.hoverLabel.style.display = 'none';
    }
  }
};

module.exports = behavior;

},{}],16:[function(require,module,exports){
var collection = require('../collections/nodes');

// marker nodes that are linked to a visible node with the 'nodeStep' attribute
var behavior = {
    filter: function (mapFilters) {
        var re, i, d, d2, d3, id;
        // three loops, first mark nodes that match, then mark one step nodes
        // finally mark links to hide and show
        try {
            re = new RegExp('.*' + mapFilters.text.toLowerCase() + '.*');
        } catch (e) {}
        for (i = 0; i < collection.nodes.length; i++) {
            d = collection.nodes[i];

            if (!d.properties._render) {
                d.properties._render = {
                    filter_id: d.properties.type.replace(' ', '_').replace('-', '_')
                };
            }

            if (mapFilters[d.properties._render.filter_id] && isTextMatch(re, d.properties, mapFilters)) {
                if (!checkSinkMode(mapFilters.inflowSinkMode, d.properties)) {
                    d.properties._render.show = false;
                } else {
                    d.properties._render.show = true;
                }
            } else {
                d.properties._render.show = false;
            }
        }

        // now mark links that should be show
        for (var i = 0; i < collection.links.length; i++) {
            d = collection.links[i];
            d2 = collection.getByPrmname(d.properties.origin);
            d3 = collection.getByPrmname(d.properties.terminus);

            checkRenderNs(d);
            checkRenderNs(d2);
            checkRenderNs(d3);

            if (d2 && d3 && (d2.properties._render.show || mapFilters.oneStepMode && d2.properties._render.oneStep) && (d3.properties._render.show || mapFilters.oneStepMode && d3.properties._render.oneStep) && !(d2.properties._render.oneStep && d3.properties._render.oneStep)) {
                d.properties._render.show = true;
            } else {
                d.properties._render.show = false;
            }
        }
    }
};

function checkRenderNs(node) {
    if (!node) return;
    if (!node.properties._render) {
        node.properties._render = {};
    }
}

function isTextMatch(re, props, mapFilters) {
    if (mapFilters.text == '' || !re) return true;

    if (re.test(props.prmname.toLowerCase())) return true;
    if (props.description && re.test(props.description.toLowerCase())) return true;
    return false;
}

function checkSinkMode(inflowSinkMode, properties) {
    if (!inflowSinkMode) {
        properties._render.stroke = null;
        return true;
    }

    if (properties.extras) {
        if (properties.extras.inflows) {
            properties._render.stroke = 'green';
            return true;
        } else if (properties.extras.sinks) {
            properties._render.stroke = 'red';
            return true;
        }
    }

    properties._render.stroke = null;
    return false;
}

module.exports = behavior;

},{"../collections/nodes":10}],17:[function(require,module,exports){
module.exports = {
  renderer: require('./renderer'),
  legend: require('./renderer/legend'),
  FilterBehavior: require('./filter'),
  RenderStateBehavior: require('./render-state'),
  CanvasLayerBehavior: require('./canvas-layer-events')
};

},{"./canvas-layer-events":15,"./filter":16,"./render-state":18,"./renderer":19,"./renderer/legend":20}],18:[function(require,module,exports){
var collections = require('../collections');
var renderer = require('./renderer');

var behavior = {
  updateRenderState: function () {
    this.renderState = {
      points: [],
      lines: [],
      polygons: []
    };
    this.clearRegionLinks();

    this._updateRenderState('California');

    var f = null,
        render;
    for (var i = 0; i < this.markerLayer.features.length; i++) {
      f = this.markerLayer.features[i];
      r = f.geojson.properties._render || {};

      if ((this.renderState.points.indexOf(f.id) > -1 || this.renderState.lines.indexOf(f.id) > -1 || this.renderState.polygons.indexOf(f.id) > -1) && r.show !== false) {

        f.visible = true;
      } else {
        f.visible = false;
      }
    }

    this.markerLayer.render();
  },

  _updateRenderState: function (id) {
    var region = collections.regions.getById(id);
    var state = this.menu.state;

    if (state.enabled.indexOf(id) > -1) {
      var childNodes = collections.nodes.getByRegion(region.properties.hobbes.id);
      this._addStateNodes(childNodes, state);

      var children = collections.regions.getByRegion(region.properties.hobbes.id);
      if (children.length === 0) return;

      for (var i = 0; i < children.length; i++) {
        this._updateRenderState(children[i].properties.hobbes.id);
      }
    } else {

      if (name != 'California') this.renderState.polygons.push(region.properties.hobbes.id);
    }
  },

  _addStateNodes: function (nodes, state) {
    var self = this;

    // find first region and insert after
    var index = 0,
        type;
    for (var i = 0; i < this.markerLayer.features.length; i++) {
      type = this.markerLayer.features[i].geojson.geometry.type;
      if (type != 'Polygon' && type != 'MultiPolygon') {
        index = i;
        break;
      }
    }

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];

      var render = node.properties._render || {};
      if (render.show === false) continue;

      if (node.properties.hobbes.type === 'link') {
        var terminal = this._getStateNodeLocation(node.properties.terminus, state);
        var origin = this._getStateNodeLocation(node.properties.origin, state);

        if (!terminal || !origin) continue;

        var lineFeature;
        if (terminal.isNode && origin.isNode) {
          lineFeature = this.createNodeLink(origin.center, terminal.center, node, index);
          this.customLines[node.properties.origin + '_' + node.properties.terminus] = lineFeature;
        } else {
          // if this line already exists, a null value will be returned
          lineFeature = this.createRegionLink(origin, terminal, node, index);
        }

        if (lineFeature) {
          this.renderState.lines.push(lineFeature.geojson.properties.hobbes.id);
        }
      } else {
        this.renderState.points.push(node.properties.hobbes.id);
      }
    }
  },

  createNodeLink: function (origin, terminal, node, index) {
    var link = {
      geojson: {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          coordinates: [origin, terminal]
        },
        properties: $.extend(true, {}, node.properties)
      },
      renderer: renderer
    };

    this.markerLayer.addCanvasFeature(new L.CanvasFeature(link, link.geojson.properties.hobbes.id), index);

    return link;
  },

  createRegionLink: function (origin, terminal, node, index) {
    var self = this;
    var feature = null;
    if (this.customLines[origin.name + '_' + terminal.name]) {
      feature = this.customLines[origin.name + '_' + terminal.name];
    } else if (this.customLines[terminal.name + '_' + origin.name]) {
      feature = this.customLines[terminal.name + '_' + origin.name];
    }

    if (!feature) {
      feature = {
        geojson: {
          "type": "Feature",
          "geometry": {
            "type": "LineString",
            coordinates: [origin.center, terminal.center]
          },
          properties: {
            hobbes: {
              id: origin.name + '--' + terminal.name,
              type: 'link'
            },
            prmname: origin.name + '--' + terminal.name,
            type: 'Region Link',
            lines: [$.extend(true, {}, node.properties)]
          }
        },
        renderer: renderer
      };

      this.customLines[origin.name + '_' + terminal.name] = feature;
      this.markerLayer.addCanvasFeature(new L.CanvasFeature(feature, feature.geojson.properties.hobbes.id), index);

      return feature;
    }

    feature.geojson.properties.lines.push($.extend(true, {}, node.properties));
  },

  clearRegionLinks: function () {
    var properties;
    for (var i = this.markerLayer.features.length - 1; i >= 0; i--) {
      properties = this.markerLayer.features[i].geojson.properties;
      if (properties.hobbes.type === 'link') {
        this.markerLayer.features.splice(i, 1);
      }
    }

    this.markerLayer.rebuildIndex(this.markerLayer.features);
    this.customLines = {};
  },

  _getStateNodeLocation: function (name, state) {
    var node = collections.nodes.getByPrmname(name);

    if (!node) return null;

    for (var i = 0; i < node.properties.hobbes.regions.length; i++) {
      if (state.disabled.indexOf(node.properties.hobbes.regions[i]) > -1) {
        if (collections.regions.getById(node.properties.hobbes.regions[i]).properties.center) {
          return {
            center: collections.regions.getById(node.properties.hobbes.regions[i]).properties.center,
            name: node.properties.hobbes.regions[i],
            isRegion: true
          };
        }
      }
    }

    return {
      center: node.geometry.coordinates || [0, 0],
      name: name,
      isNode: true
    };
  }
};

module.exports = behavior;

},{"../collections":9,"./renderer":19}],19:[function(require,module,exports){
var renderUtils = require('../../renderer');
var collection = require('../../collections/nodes');

module.exports = function (ctx, xyPoints, map, feature) {
  var render = feature.geojson.properties._render || {};

  if (feature.geojson.geometry.type == 'Point') {
    renderBasicPoint(ctx, xyPoints, map, feature, render);
  } else if (feature.geojson.geometry.type == 'LineString') {
    if (feature.geojson.properties.type === 'Region Link') {
      renderRegionLine(ctx, xyPoints, map, feature, render);
    } else {
      renderBasicLine(ctx, xyPoints, map, feature, render);
    }
  } else if (feature.geojson.geometry.type == 'Polygon') {
    renderBasicPolygon(ctx, xyPoints, map, feature, render);
  } else if (feature.geojson.geometry.type == 'MultiPolygon') {
    //debugger;
    xyPoints.forEach(function (points) {
      renderBasicPolygon(ctx, points, map, feature, render);
    });
  }
};

function renderRegionLine(ctx, xyPoints, map, feature, render) {
  ctx.beginPath();
  ctx.strokeStyle = renderUtils.colors.orange;
  ctx.lineWidth = 2;
  ctx.moveTo(xyPoints[0].x, xyPoints[0].y);
  ctx.lineTo(xyPoints[1].x, xyPoints[1].y);
  ctx.stroke();
}

function renderBasicPoint(ctx, xyPoints, map, feature, render) {
  o = render.oneStep ? .3 : .7;

  render.point = xyPoints;
  ms = (feature.size || 20) * (render.multipier || 1);
  buffer = ms / 2;

  // TODO: set feature.size and you want have to worry about -10 offset here
  renderUtils[feature.geojson.properties.type](ctx, {
    x: xyPoints.x - 10,
    y: xyPoints.y - 10,
    width: ms,
    height: ms,
    opacity: o,
    fill: render.fill,
    stroke: render.stroke,
    lineWidth: render.lineWidth
  });
}

function renderBasicLine(ctx, xyPoints, map, feature, render) {
  color = 'white';
  if (render.highlight) {
    if (render.highlight == 'origin') color = 'green';else color = 'red';
  }

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.moveTo(xyPoints[0].x, xyPoints[0].y);
  ctx.lineTo(xyPoints[1].x, xyPoints[1].y);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = getLineColor(feature.geojson);
  ctx.lineWidth = 2;
  ctx.moveTo(xyPoints[0].x, xyPoints[0].y);
  ctx.lineTo(xyPoints[1].x, xyPoints[1].y);
  ctx.stroke();
}

function renderBasicPolygon(ctx, xyPoints, map, feature, render) {
  var point;
  if (xyPoints.length <= 1) return;

  ctx.beginPath();

  point = xyPoints[0];
  ctx.moveTo(point.x, point.y);
  for (var i = 1; i < xyPoints.length; i++) {
    ctx.lineTo(xyPoints[i].x, xyPoints[i].y);
  }
  ctx.lineTo(xyPoints[0].x, xyPoints[0].y);

  ctx.strokeStyle = render.hover ? 'red' : 'rgba(' + renderUtils.colors.rgb.blue.join(',') + ',.6)';
  ctx.fillStyle = render.fillStyle ? render.fillStyle : 'rgba(' + renderUtils.colors.rgb.lightBlue.join(',') + ',.6)';
  ctx.lineWidth = 4;

  ctx.stroke();
  ctx.fill();
}

function getLineColor(feature) {
  var color = 'white';

  var origin = collection.getByPrmname(feature.properties.origin);
  var terminus = collection.getByPrmname(feature.properties.terminus);

  if (feature.properties.renderInfo) {
    if (terminus && terminus.properties.type == 'Sink') {
      color = renderUtils.colors.darkCyan;
    } else if (origin && origin.properties.type.match(/demand/i)) {
      color = renderUtils.colors.red;
    } else if (origin && terminus && terminus.properties.type.match(/demand/i) && origin.properties.type == 'Groundwater Storage') {
      color = renderUtils.colors.lightGrey;
    } else if (feature.properties.description.match(/recharge/i, '')) {
      color = renderUtils.colors.green;
    }
  }

  var line = {
    color: color,
    weight: 3,
    opacity: 0.4,
    smoothFactor: 1
  };

  //if( feature.properties.calibrationNode && this.mapFilters.calibrationMode ) {
  if (feature.properties.calibrationNode) {
    line.color = 'blue';
  }

  return color;
}

},{"../../collections/nodes":10,"../../renderer":25}],20:[function(require,module,exports){
module.exports = {
    'Power Plant': {
        color: '#3366cc',
        google: 'small_red'
    },
    'Agricultural Demand': {
        color: '#ff9900',
        google: 'small_yellow'
    },
    'Junction': {
        color: '#109618',
        google: 'small_green'
    },
    'Pump Plant': {
        color: '#990099',
        google: 'small_blue'
    },
    'Water Treatment': {
        color: '#0099c6',
        google: 'small_purple'
    },
    'Surface Storage': {
        color: '#dd4477',
        google: 'measle_brown'
    },
    'Urban Demand': {
        color: '#66aa00',
        google: 'measle_grey'
    },
    'Sink': {
        color: '#b82e2e',
        google: 'measle_white'
    },
    'Groundwater Storage': {
        color: '#316395',
        google: 'measle_turquoise'
    },
    'Non-Standard Demand': {
        color: '#22aa99',
        google: 'shaded_dot'
    }
};

},{}],21:[function(require,module,exports){
var colors = require('./colors');
var utils = require('./utils');

module.exports = function (ctx, config) {
    if (!config.stroke) config.stroke = colors.getColor('black', config.opacity);
    if (!config.fill) config.fill = colors.getColor('lightBlue', config.opacity);

    utils.oval(ctx, config);
};

},{"./colors":22,"./utils":34}],22:[function(require,module,exports){
var colors = {
  base: '#1976D2',
  lightBlue: '#BBDEFB',
  blue: '#1976D2',
  lightGrey: '#727272',
  orange: '#FF5722',
  red: '#D32F2F',
  green: '#4CAF50',
  yellow: '#FFEB3B',
  black: '#212121',
  cyan: '#00BCD4',
  darkCyan: '#0097A7',
  indigo: '#3F51B5'
};

colors.rgb = {
  base: [25, 118, 210],
  lightBlue: [187, 222, 251],
  blue: [25, 118, 210],
  lightGrey: [114, 114, 114],
  orange: [255, 87, 34],
  green: [76, 175, 80],
  red: [211, 47, 47],
  yellow: [255, 235, 59],
  cyan: [0, 188, 212],
  darkCyan: [0, 151, 167],
  black: [21, 21, 21],
  indigo: [63, 81, 181]
};

colors.getColor = function (name, opacity) {
  if (opacity === undefined) opacity = 1;
  return 'rgba(' + colors.rgb[name].join(',') + ',' + opacity + ')';
};

module.exports = colors;

},{}],23:[function(require,module,exports){
var colors = require('./colors');
var utils = require('./utils');

module.exports = function (ctx, config) {
    var r = config.width / 2;

    var grd = ctx.createLinearGradient(config.x + r, config.y, config.x + r, config.y + config.height - .25 * config.height);
    grd.addColorStop(0, config.stroke || colors.getColor('blue', config.opacity));
    grd.addColorStop(1, config.fill || colors.getColor('green', config.opacity));
    ctx.fillStyle = grd;

    ctx.strokeStyle = config.stroke || colors.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    utils.nSidedPath(ctx, config.x, config.y, r, 3, 90);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
};

},{"./colors":22,"./utils":34}],24:[function(require,module,exports){
module.exports = function (type, width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  if (!CWN.render[type]) return canvas;

  var ctx = canvas.getContext('2d');
  CWN.render[type](ctx, 2, 2, width - 4, height - 4);

  return canvas;
};

},{}],25:[function(require,module,exports){
module.exports = {
  colors: require('./colors'),
  icon: require('./icon'),
  Junction: require('./junction'),
  'Power Plant': require('./power-plant'),
  'Pump Plant': require('./pump-plant'),
  'Water Treatment': require('./water-treatment'),
  'Surface Storage': require('./surface-storage'),
  'Groundwater Storage': require('./groundwater-storage'),
  Sink: require('./sink'),
  'Non-Standard Demand': require('./nonstandard-demand'),
  'Agricultural Demand': require('./agricultural-demand'),
  'Urban Demand': require('./urban-demand'),
  Wetland: require('./wetland'),
  lineMarkers: require('./line-markers')
};

},{"./agricultural-demand":21,"./colors":22,"./groundwater-storage":23,"./icon":24,"./junction":26,"./line-markers":27,"./nonstandard-demand":28,"./power-plant":29,"./pump-plant":30,"./sink":31,"./surface-storage":32,"./urban-demand":33,"./water-treatment":35,"./wetland":36}],26:[function(require,module,exports){
var colors = require('./colors');

module.exports = function (ctx, config) {
    ctx.fillStyle = config.fill || colors.getColor('blue', config.opacity);
    ctx.strokeStyle = config.stroke || colors.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    var r = config.width / 2;

    ctx.beginPath();
    ctx.arc(config.x + r, config.y + r, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
};

},{"./colors":22}],27:[function(require,module,exports){
var colors = require('./colors');

module.exports = {
  cost: function (cxt, x, y, s) {
    cxt.beginPath();
    cxt.arc(x, y, s, 0, 2 * Math.PI, false);
    cxt.fillStyle = colors.green;
    cxt.fill();
    cxt.closePath();
  },
  amplitude: function (cxt, x, y, s) {
    cxt.beginPath();
    cxt.arc(x, y, s, 0, 2 * Math.PI, false);
    cxt.lineWidth = 2;
    cxt.strokeStyle = colors.black;
    cxt.stroke();
    cxt.closePath();
  },
  constraints: function (cxt, x, y, s, vX, vY) {
    cxt.beginPath();
    var dx = vX * .4;
    var dy = vY * .4;

    cxt.beginPath();
    cxt.moveTo(x + vY + dx, y - vX + dy);
    cxt.lineTo(x + vY - dx, y - vX - dy);

    cxt.lineTo(x - vY - dx, y + vX - dy);
    cxt.lineTo(x - vY + dx, y + vX + dy);
    cxt.lineTo(x + vY + dx, y - vX + dy);
    cxt.strokeStyle = colors.black;
    cxt.stroke();
    cxt.closePath();
  },
  environmental: function (cxt, x, y, s) {
    cxt.beginPath();
    cxt.arc(x, y, s, 0, 2 * Math.PI, false);
    cxt.lineWidth = 2;
    cxt.strokeStyle = colors.green;
    cxt.stroke();
    cxt.closePath();
  }
};

},{"./colors":22}],28:[function(require,module,exports){
var colors = require('./colors');
var utils = require('./utils');

module.exports = function (ctx, config) {
    ctx.fillStyle = config.fill || colors.getColor('red', config.opacity);
    ctx.strokeStyle = config.stroke || colors.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    utils.nSidedPath(ctx, config.x, config.y, config.width / 2, 4, 45);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
};

},{"./colors":22,"./utils":34}],29:[function(require,module,exports){
var colors = require('./colors');
var junction = require('./junction');

module.exports = function (ctx, config) {
  config.fill = colors.getColor('darkCyan', config.opacity);

  junction(ctx, config);
  var r = config.width / 2;

  // horizontal line
  ctx.beginPath();
  ctx.moveTo(config.x, config.y + r);
  ctx.lineTo(config.x + config.width, config.y + r);
  ctx.stroke();
  ctx.closePath();

  // vertical line
  ctx.beginPath();
  ctx.moveTo(config.x + r, config.y);
  ctx.lineTo(config.x + r, config.y + config.width);
  ctx.stroke();
  ctx.closePath();
};

},{"./colors":22,"./junction":26}],30:[function(require,module,exports){
var colors = require('./colors');
var junction = require('./junction');

module.exports = function (ctx, config) {
    config.fill = colors.getColor('indigo', config.opacity);

    junction(ctx, config);

    var r = config.width / 2;
    var cx = config.x + r;
    var cy = config.y + r;

    var x1 = cx + r * Math.cos(Math.PI / 4);
    var y1 = cy + r * Math.sin(Math.PI / 4);
    var x2 = cx + r * Math.cos(Math.PI * (5 / 4));
    var y2 = cy + r * Math.sin(Math.PI * (5 / 4));

    // line 1
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

    x1 = cx + r * Math.cos(Math.PI * (3 / 4));
    y1 = cy + r * Math.sin(Math.PI * (3 / 4));
    x2 = cx + r * Math.cos(Math.PI * (7 / 4));
    y2 = cy + r * Math.sin(Math.PI * (7 / 4));

    // line 2
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
};

},{"./colors":22,"./junction":26}],31:[function(require,module,exports){
var colors = require('./colors');
var utils = require('./utils');

module.exports = function (ctx, config) {
    ctx.fillStyle = config.fill || colors.getColor('base', config.opacity);
    ctx.strokeStyle = config.stroke || colors.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    utils.nSidedPath(ctx, config.x, config.y, config.width / 2, 4, 45);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
};

},{"./colors":22,"./utils":34}],32:[function(require,module,exports){
var colors = require('./colors');
var utils = require('./utils');

module.exports = function (ctx, config) {
    ctx.fillStyle = config.fill || colors.getColor('yellow', config.opacity);
    ctx.strokeStyle = config.stroke || colors.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    utils.nSidedPath(ctx, config.x, config.y, config.width / 2, 3, 90);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
};

},{"./colors":22,"./utils":34}],33:[function(require,module,exports){
var colors = require('./colors');
var utils = require('./utils');

module.exports = function (ctx, config) {
    if (!config.stroke) config.stroke = colors.getColor('black', config.opacity);
    if (!config.fill) config.fill = colors.getColor('orange', config.opacity);

    utils.oval(ctx, config);
};

},{"./colors":22,"./utils":34}],34:[function(require,module,exports){
function oval(ctx, config) {
    ctx.fillStyle = config.fill;
    ctx.strokeStyle = config.stroke;
    ctx.lineWidth = config.lineWidth || 2;

    config.height -= config.width * .5;
    config.y += config.height / 2;

    var kappa = .5522848,
        ox = config.width / 2 * kappa,
        // control point offset horizontal
    oy = config.height / 2 * kappa,
        // control point offset vertical
    xe = config.x + config.width,
        // x-end
    ye = config.y + config.height,
        // y-end
    xm = config.x + config.width / 2,
        // x-middle
    ym = config.y + config.height / 2; // y-middle

    ctx.beginPath();
    ctx.moveTo(config.x, ym);
    ctx.bezierCurveTo(config.x, ym - oy, xm - ox, config.y, xm, config.y);
    ctx.bezierCurveTo(xm + ox, config.y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, config.x, ym + oy, config.x, ym);
    ctx.fill();
    ctx.stroke();
}

/** helper for treatment, surface storage and ground water **/
function nSidedPath(ctx, left, top, radius, sides, startAngle) {
    // this is drawing from center
    left += radius;
    top += radius;

    var a = Math.PI * 2 / sides;
    var r = startAngle * (Math.PI / 180),
        x,
        y;

    // think you need to adjust by x, y
    ctx.beginPath();
    var xs = left + radius * Math.cos(-1 * r);
    var ys = top + radius * Math.sin(-1 * r);
    ctx.moveTo(xs, ys);
    for (var i = 1; i < sides; i++) {
        x = left + radius * Math.cos(a * i - r);
        y = top + radius * Math.sin(a * i - r);
        ctx.lineTo(x, y);
    }
    ctx.lineTo(xs, ys);

    // not painting, leave this to the draw function
}

module.exports = {
    oval: oval,
    nSidedPath: nSidedPath
};

},{}],35:[function(require,module,exports){
var colors = require('./colors');
var utils = require('./utils');

module.exports = function (ctx, config) {
    ctx.fillStyle = config.fill || colors.getColor('cyan', config.opacity);
    ctx.strokeStyle = config.stroke || colors.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    utils.nSidedPath(ctx, config.x, config.y, config.width / 2, 8, 22.5);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
};

},{"./colors":22,"./utils":34}],36:[function(require,module,exports){
var colors = require('./colors');
var utils = require('./utils');

module.exports = function (ctx, config) {
    if (!config.stroke) config.stroke = colors.getColor('black', config.opacity);
    if (!config.fill) config.fill = colors.getColor('green', config.opacity);

    utils.oval(ctx, config);
};

},{"./colors":22,"./utils":34}],37:[function(require,module,exports){
var request = require('superagent');

function loadNetwork(callback) {
  var network, regions;
  var regions = false;

  function done() {
    if (network && regions) {
      callback({
        network: network,
        regions: regions
      });
    }
  };

  request.get('/network/get').end(function (err, resp) {
    networkLoaded = true;

    if (err || resp.error) {
      alert('Server error loading network :(');
      return done();
    }

    network = resp.body || [];

    done();
  });

  request.get('/regions/get').end(function (err, resp) {
    networkLoaded = true;

    if (err || resp.error) {
      alert('Server error loading regions :(');
      return done();
    }

    regions = resp.body || [];

    done();
  });
}

function getExtras(prmname, callback) {
  request.get('/network/extras').query({ prmname: prmname }).end((err, resp) => {
    callback(resp.body);
  });
}

function getAggregate(query, callback) {
  request.get('/regions/aggregate').query(query).end((err, resp) => {
    callback(resp.body);
  });
}

module.exports = {
  loadNetwork: loadNetwork,
  getExtras: getExtras,
  getAggregate: getAggregate
};

},{"superagent":4}],38:[function(require,module,exports){
'use strict';

var renderer = require('./renderer');

sigma.utils.pkg('sigma.canvas.nodes');

/**
 *
 * @param  {object}                   node     The node object.
 * @param  {CanvasRenderingContext2D} context  The canvas context.
 * @param  {configurable}             settings The settings function.
 */
sigma.canvas.nodes.Junction = function (node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size'] * 2;

  renderer.Junction(context, {
    x: node[prefix + 'x'] - node[prefix + 'size'],
    y: node[prefix + 'y'] - node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Power Plant'] = function (node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size'] * 2;

  renderer['Power Plant'](context, {
    x: node[prefix + 'x'] - node[prefix + 'size'],
    y: node[prefix + 'y'] - node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Pump Plant'] = function (node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size'] * 2;

  renderer['Pump Plant'](context, {
    x: node[prefix + 'x'] - node[prefix + 'size'],
    y: node[prefix + 'y'] - node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Water Treatment'] = function (node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size'] * 2;

  renderer['Water Treatment'](context, {
    x: node[prefix + 'x'] - node[prefix + 'size'],
    y: node[prefix + 'y'] - node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Surface Storage'] = function (node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size'] * 2;

  renderer['Surface Storage'](context, {
    x: node[prefix + 'x'] - node[prefix + 'size'],
    y: node[prefix + 'y'] - node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Groundwater Storage'] = function (node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size'] * 2;

  renderer['Groundwater Storage'](context, {
    x: node[prefix + 'x'] - node[prefix + 'size'],
    y: node[prefix + 'y'] - node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Agricultural Demand'] = function (node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size'] * 2;

  renderer['Agricultural Demand'](context, {
    x: node[prefix + 'x'] - node[prefix + 'size'],
    y: node[prefix + 'y'] - node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Urban Demand'] = function (node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size'] * 2;

  renderer['Urban Demand'](context, {
    x: node[prefix + 'x'] - node[prefix + 'size'],
    y: node[prefix + 'y'] - node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes.Sink = function (node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size'] * 2;

  renderer.Sink(context, {
    x: node[prefix + 'x'] - node[prefix + 'size'],
    y: node[prefix + 'y'] - node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Non-Standard Demand'] = function (node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size'] * 2;

  renderer['Non-Standard Demand'](context, {
    x: node[prefix + 'x'] - node[prefix + 'size'],
    y: node[prefix + 'y'] - node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes.Wetland = function (node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size'] * 2;

  renderer.Wetland(context, {
    x: node[prefix + 'x'] - node[prefix + 'size'],
    y: node[prefix + 'y'] - node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.utils.pkg('sigma.canvas.edges');

/**
 * This edge renderer will display edges as arrows going from the source node
 *
 * @param  {object}                   edge         The edge object.
 * @param  {object}                   source node  The edge source node.
 * @param  {object}                   target node  The edge target node.
 * @param  {CanvasRenderingContext2D} context      The canvas context.
 * @param  {configurable}             settings     The settings function.
 */
sigma.canvas.edges.cwn = function (edge, source, target, context, settings) {

  var color = edge.color,
      prefix = settings('prefix') || '',
      edgeColor = settings('edgeColor'),
      defaultNodeColor = settings('defaultNodeColor'),
      defaultEdgeColor = settings('defaultEdgeColor'),
      size = edge[prefix + 'size'] || 1,
      tSize = target[prefix + 'size'],
      sX = source[prefix + 'x'],
      sY = source[prefix + 'y'],
      tX = target[prefix + 'x'],
      tY = target[prefix + 'y'],
      aSize = Math.max(size * 2.5, settings('minArrowSize')),
      d = Math.sqrt(Math.pow(tX - sX, 2) + Math.pow(tY - sY, 2)),
      aX = sX + (tX - sX) * (d - aSize - tSize) / d,
      aY = sY + (tY - sY) * (d - aSize - tSize) / d,
      vX = (tX - sX) * aSize / d,
      vY = (tY - sY) * aSize / d;

  var color = renderer.colors.salmon;
  if (edge.calvin.renderInfo) {
    if (edge.calvin.renderInfo.type == 'flowToSink') {
      color = renderer.colors.lightGrey;
    } else if (edge.calvin.renderInfo.type == 'returnFlowFromDemand') {
      color = renderer.colors.red;
    } else if (edge.calvin.renderInfo.type == 'gwToDemand') {
      color = renderer.colors.black;
    } else if (edge.calvin.renderInfo.type == 'artificalRecharge') {
      color = renderer.colors.purple;
    }
  }

  context.strokeStyle = color;
  context.lineWidth = size;
  context.beginPath();
  context.moveTo(sX, sY);
  context.lineTo(aX, aY);
  context.stroke();

  context.fillStyle = color;
  context.beginPath();
  context.moveTo(aX + vX, aY + vY);
  context.lineTo(aX + vY * 0.8, aY - vX * 0.8);
  context.lineTo(aX - vY * 0.8, aY + vX * 0.8);
  context.lineTo(aX + vX, aY + vY);
  context.closePath();
  context.fill();
};

},{"./renderer":25}]},{},[14])(14)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1Y2UtY29tcG9uZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL2NsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi9pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9saWIvcmVxdWVzdC1iYXNlLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL3JlcXVlc3QuanMiLCJwdWJsaWMvbGliL2NoYXJ0cy5qcyIsInB1YmxpYy9saWIvY29sbGVjdGlvbnMvaW5kZXguanMiLCJwdWJsaWMvbGliL2NvbGxlY3Rpb25zL25vZGVzLmpzIiwicHVibGljL2xpYi9jb2xsZWN0aW9ucy9yZWdpb25zLmpzIiwicHVibGljL2xpYi9jb250cm9sbGVycy9pbmRleC5qcyIsInB1YmxpYy9saWIvY29udHJvbGxlcnMvbmV0d29yay5qcyIsInB1YmxpYy9saWIvaW5kZXguanMiLCJwdWJsaWMvbGliL21hcC9jYW52YXMtbGF5ZXItZXZlbnRzLmpzIiwicHVibGljL2xpYi9tYXAvZmlsdGVyLmpzIiwicHVibGljL2xpYi9tYXAvaW5kZXguanMiLCJwdWJsaWMvbGliL21hcC9yZW5kZXItc3RhdGUuanMiLCJwdWJsaWMvbGliL21hcC9yZW5kZXJlci9pbmRleC5qcyIsInB1YmxpYy9saWIvbWFwL3JlbmRlcmVyL2xlZ2VuZC5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvYWdyaWN1bHR1cmFsLWRlbWFuZC5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvY29sb3JzLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci9ncm91bmR3YXRlci1zdG9yYWdlLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci9pY29uLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci9pbmRleC5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvanVuY3Rpb24uanMiLCJwdWJsaWMvbGliL3JlbmRlcmVyL2xpbmUtbWFya2Vycy5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvbm9uc3RhbmRhcmQtZGVtYW5kLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci9wb3dlci1wbGFudC5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvcHVtcC1wbGFudC5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvc2luay5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvc3VyZmFjZS1zdG9yYWdlLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci91cmJhbi1kZW1hbmQuanMiLCJwdWJsaWMvbGliL3JlbmRlcmVyL3V0aWxzLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci93YXRlci10cmVhdG1lbnQuanMiLCJwdWJsaWMvbGliL3JlbmRlcmVyL3dldGxhbmQuanMiLCJwdWJsaWMvbGliL3Jlc3QvaW5kZXguanMiLCJwdWJsaWMvbGliL3NpZ21hLWN3bi1wbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmpDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsSUFBdkIsSUFBK0Isc0JBQW5DLEVBQTREO0FBQy9ELGNBQVEsU0FBUyxNQUFULENBQWdCLEdBQXhCO0FBQ0gsS0FGTSxNQUVBLElBQUksS0FBSyxNQUFMLENBQVksVUFBWixDQUF1QixJQUF2QixJQUErQixZQUFuQyxFQUFrRDtBQUNyRCxjQUFRLFNBQVMsTUFBVCxDQUFnQixLQUF4QjtBQUNILEtBRk0sTUFFQSxJQUFJLEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsSUFBdkIsSUFBK0IsbUJBQW5DLEVBQXlEO0FBQzVELGNBQVEsU0FBUyxNQUFULENBQWdCLE1BQXhCO0FBQ0g7QUFDSjs7QUFFRCxVQUFRLFdBQVIsR0FBc0IsS0FBdEI7QUFDQSxVQUFRLFNBQVIsR0FBb0IsSUFBcEI7QUFDQSxVQUFRLFNBQVI7QUFDQSxVQUFRLE1BQVIsQ0FBZSxFQUFmLEVBQW1CLEVBQW5CO0FBQ0EsVUFBUSxNQUFSLENBQ0UsRUFERixFQUVFLEVBRkY7QUFJQSxVQUFRLE1BQVI7O0FBRUEsVUFBUSxTQUFSLEdBQW9CLEtBQXBCO0FBQ0EsVUFBUSxTQUFSO0FBQ0EsVUFBUSxNQUFSLENBQWUsS0FBSyxFQUFwQixFQUF3QixLQUFLLEVBQTdCO0FBQ0EsVUFBUSxNQUFSLENBQWUsS0FBSyxLQUFLLEdBQXpCLEVBQThCLEtBQUssS0FBSyxHQUF4QztBQUNBLFVBQVEsTUFBUixDQUFlLEtBQUssS0FBSyxHQUF6QixFQUE4QixLQUFLLEtBQUssR0FBeEM7QUFDQSxVQUFRLE1BQVIsQ0FBZSxLQUFLLEVBQXBCLEVBQXdCLEtBQUssRUFBN0I7QUFDQSxVQUFRLFNBQVI7QUFDQSxVQUFRLElBQVI7QUFFRCxDQXBERCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcclxuLyoqXHJcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXHJcbiAqL1xyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgbW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xyXG59XHJcblxyXG4vKipcclxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXHJcbiAqXHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcclxuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXHJcbiAqIEByZXR1cm4ge09iamVjdH1cclxuICogQGFwaSBwcml2YXRlXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XHJcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XHJcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XHJcbiAgfVxyXG4gIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuICAodGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gfHwgW10pXHJcbiAgICAucHVzaChmbik7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXHJcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xyXG4gIGZ1bmN0aW9uIG9uKCkge1xyXG4gICAgdGhpcy5vZmYoZXZlbnQsIG9uKTtcclxuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgfVxyXG5cclxuICBvbi5mbiA9IGZuO1xyXG4gIHRoaXMub24oZXZlbnQsIG9uKTtcclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxyXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcblxyXG4gIC8vIGFsbFxyXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyBzcGVjaWZpYyBldmVudFxyXG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xyXG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcclxuXHJcbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xyXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxyXG4gIHZhciBjYjtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgY2IgPSBjYWxsYmFja3NbaV07XHJcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xyXG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge01peGVkfSAuLi5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxyXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xyXG5cclxuICBpZiAoY2FsbGJhY2tzKSB7XHJcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcmV0dXJuIHtBcnJheX1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xyXG59O1xyXG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJcbi8qKlxuICogUmVkdWNlIGBhcnJgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge01peGVkfSBpbml0aWFsXG4gKlxuICogVE9ETzogY29tYmF0aWJsZSBlcnJvciBoYW5kbGluZz9cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFyciwgZm4sIGluaXRpYWwpeyAgXG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcbiAgdmFyIGN1cnIgPSBhcmd1bWVudHMubGVuZ3RoID09IDNcbiAgICA/IGluaXRpYWxcbiAgICA6IGFycltpZHgrK107XG5cbiAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgIGN1cnIgPSBmbi5jYWxsKG51bGwsIGN1cnIsIGFycltpZHhdLCArK2lkeCwgYXJyKTtcbiAgfVxuICBcbiAgcmV0dXJuIGN1cnI7XG59OyIsIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJ2VtaXR0ZXInKTtcbnZhciByZWR1Y2UgPSByZXF1aXJlKCdyZWR1Y2UnKTtcbnZhciByZXF1ZXN0QmFzZSA9IHJlcXVpcmUoJy4vcmVxdWVzdC1iYXNlJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzLW9iamVjdCcpO1xuXG4vKipcbiAqIFJvb3QgcmVmZXJlbmNlIGZvciBpZnJhbWVzLlxuICovXG5cbnZhciByb290O1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7IC8vIEJyb3dzZXIgd2luZG93XG4gIHJvb3QgPSB3aW5kb3c7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykgeyAvLyBXZWIgV29ya2VyXG4gIHJvb3QgPSBzZWxmO1xufSBlbHNlIHsgLy8gT3RoZXIgZW52aXJvbm1lbnRzXG4gIHJvb3QgPSB0aGlzO1xufVxuXG4vKipcbiAqIE5vb3AuXG4gKi9cblxuZnVuY3Rpb24gbm9vcCgpe307XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYSBob3N0IG9iamVjdCxcbiAqIHdlIGRvbid0IHdhbnQgdG8gc2VyaWFsaXplIHRoZXNlIDopXG4gKlxuICogVE9ETzogZnV0dXJlIHByb29mLCBtb3ZlIHRvIGNvbXBvZW50IGxhbmRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNIb3N0KG9iaikge1xuICB2YXIgc3RyID0ge30udG9TdHJpbmcuY2FsbChvYmopO1xuXG4gIHN3aXRjaCAoc3RyKSB7XG4gICAgY2FzZSAnW29iamVjdCBGaWxlXSc6XG4gICAgY2FzZSAnW29iamVjdCBCbG9iXSc6XG4gICAgY2FzZSAnW29iamVjdCBGb3JtRGF0YV0nOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIEV4cG9zZSBgcmVxdWVzdGAuXG4gKi9cblxudmFyIHJlcXVlc3QgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpLmJpbmQobnVsbCwgUmVxdWVzdCk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIFhIUi5cbiAqL1xuXG5yZXF1ZXN0LmdldFhIUiA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHJvb3QuWE1MSHR0cFJlcXVlc3RcbiAgICAgICYmICghcm9vdC5sb2NhdGlvbiB8fCAnZmlsZTonICE9IHJvb3QubG9jYXRpb24ucHJvdG9jb2xcbiAgICAgICAgICB8fCAhcm9vdC5BY3RpdmVYT2JqZWN0KSkge1xuICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3Q7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC42LjAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAuMy4wJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQJyk7IH0gY2F0Y2goZSkge31cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZSwgYWRkZWQgdG8gc3VwcG9ydCBJRS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxudmFyIHRyaW0gPSAnJy50cmltXG4gID8gZnVuY3Rpb24ocykgeyByZXR1cm4gcy50cmltKCk7IH1cbiAgOiBmdW5jdGlvbihzKSB7IHJldHVybiBzLnJlcGxhY2UoLyheXFxzKnxcXHMqJCkvZywgJycpOyB9O1xuXG4vKipcbiAqIFNlcmlhbGl6ZSB0aGUgZ2l2ZW4gYG9iamAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2VyaWFsaXplKG9iaikge1xuICBpZiAoIWlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gIHZhciBwYWlycyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKG51bGwgIT0gb2JqW2tleV0pIHtcbiAgICAgIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICByZXR1cm4gcGFpcnMuam9pbignJicpO1xufVxuXG4vKipcbiAqIEhlbHBzICdzZXJpYWxpemUnIHdpdGggc2VyaWFsaXppbmcgYXJyYXlzLlxuICogTXV0YXRlcyB0aGUgcGFpcnMgYXJyYXkuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcGFpcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICovXG5cbmZ1bmN0aW9uIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXksIHZhbCkge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgcmV0dXJuIHZhbC5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICAgIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXksIHYpO1xuICAgIH0pO1xuICB9XG4gIHBhaXJzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSlcbiAgICArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpKTtcbn1cblxuLyoqXG4gKiBFeHBvc2Ugc2VyaWFsaXphdGlvbiBtZXRob2QuXG4gKi9cblxuIHJlcXVlc3Quc2VyaWFsaXplT2JqZWN0ID0gc2VyaWFsaXplO1xuXG4gLyoqXG4gICogUGFyc2UgdGhlIGdpdmVuIHgtd3d3LWZvcm0tdXJsZW5jb2RlZCBgc3RyYC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICogQGFwaSBwcml2YXRlXG4gICovXG5cbmZ1bmN0aW9uIHBhcnNlU3RyaW5nKHN0cikge1xuICB2YXIgb2JqID0ge307XG4gIHZhciBwYWlycyA9IHN0ci5zcGxpdCgnJicpO1xuICB2YXIgcGFydHM7XG4gIHZhciBwYWlyO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYWlycy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIHBhaXIgPSBwYWlyc1tpXTtcbiAgICBwYXJ0cyA9IHBhaXIuc3BsaXQoJz0nKTtcbiAgICBvYmpbZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdKV0gPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBFeHBvc2UgcGFyc2VyLlxuICovXG5cbnJlcXVlc3QucGFyc2VTdHJpbmcgPSBwYXJzZVN0cmluZztcblxuLyoqXG4gKiBEZWZhdWx0IE1JTUUgdHlwZSBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQudHlwZXMueG1sID0gJ2FwcGxpY2F0aW9uL3htbCc7XG4gKlxuICovXG5cbnJlcXVlc3QudHlwZXMgPSB7XG4gIGh0bWw6ICd0ZXh0L2h0bWwnLFxuICBqc29uOiAnYXBwbGljYXRpb24vanNvbicsXG4gIHhtbDogJ2FwcGxpY2F0aW9uL3htbCcsXG4gIHVybGVuY29kZWQ6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAnZm9ybSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAnZm9ybS1kYXRhJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbi8qKlxuICogRGVmYXVsdCBzZXJpYWxpemF0aW9uIG1hcC5cbiAqXG4gKiAgICAgc3VwZXJhZ2VudC5zZXJpYWxpemVbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24ob2JqKXtcbiAqICAgICAgIHJldHVybiAnZ2VuZXJhdGVkIHhtbCBoZXJlJztcbiAqICAgICB9O1xuICpcbiAqL1xuXG4gcmVxdWVzdC5zZXJpYWxpemUgPSB7XG4gICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJzogc2VyaWFsaXplLFxuICAgJ2FwcGxpY2F0aW9uL2pzb24nOiBKU09OLnN0cmluZ2lmeVxuIH07XG5cbiAvKipcbiAgKiBEZWZhdWx0IHBhcnNlcnMuXG4gICpcbiAgKiAgICAgc3VwZXJhZ2VudC5wYXJzZVsnYXBwbGljYXRpb24veG1sJ10gPSBmdW5jdGlvbihzdHIpe1xuICAqICAgICAgIHJldHVybiB7IG9iamVjdCBwYXJzZWQgZnJvbSBzdHIgfTtcbiAgKiAgICAgfTtcbiAgKlxuICAqL1xuXG5yZXF1ZXN0LnBhcnNlID0ge1xuICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJzogcGFyc2VTdHJpbmcsXG4gICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5wYXJzZVxufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gaGVhZGVyIGBzdHJgIGludG9cbiAqIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBtYXBwZWQgZmllbGRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlSGVhZGVyKHN0cikge1xuICB2YXIgbGluZXMgPSBzdHIuc3BsaXQoL1xccj9cXG4vKTtcbiAgdmFyIGZpZWxkcyA9IHt9O1xuICB2YXIgaW5kZXg7XG4gIHZhciBsaW5lO1xuICB2YXIgZmllbGQ7XG4gIHZhciB2YWw7XG5cbiAgbGluZXMucG9wKCk7IC8vIHRyYWlsaW5nIENSTEZcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBsaW5lID0gbGluZXNbaV07XG4gICAgaW5kZXggPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBmaWVsZCA9IGxpbmUuc2xpY2UoMCwgaW5kZXgpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdHJpbShsaW5lLnNsaWNlKGluZGV4ICsgMSkpO1xuICAgIGZpZWxkc1tmaWVsZF0gPSB2YWw7XG4gIH1cblxuICByZXR1cm4gZmllbGRzO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGBtaW1lYCBpcyBqc29uIG9yIGhhcyAranNvbiBzdHJ1Y3R1cmVkIHN5bnRheCBzdWZmaXguXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1pbWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpc0pTT04obWltZSkge1xuICByZXR1cm4gL1tcXC8rXWpzb25cXGIvLnRlc3QobWltZSk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBtaW1lIHR5cGUgZm9yIHRoZSBnaXZlbiBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiB0eXBlKHN0cil7XG4gIHJldHVybiBzdHIuc3BsaXQoLyAqOyAqLykuc2hpZnQoKTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGhlYWRlciBmaWVsZCBwYXJhbWV0ZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcmFtcyhzdHIpe1xuICByZXR1cm4gcmVkdWNlKHN0ci5zcGxpdCgvICo7ICovKSwgZnVuY3Rpb24ob2JqLCBzdHIpe1xuICAgIHZhciBwYXJ0cyA9IHN0ci5zcGxpdCgvICo9ICovKVxuICAgICAgLCBrZXkgPSBwYXJ0cy5zaGlmdCgpXG4gICAgICAsIHZhbCA9IHBhcnRzLnNoaWZ0KCk7XG5cbiAgICBpZiAoa2V5ICYmIHZhbCkgb2JqW2tleV0gPSB2YWw7XG4gICAgcmV0dXJuIG9iajtcbiAgfSwge30pO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXNwb25zZWAgd2l0aCB0aGUgZ2l2ZW4gYHhocmAuXG4gKlxuICogIC0gc2V0IGZsYWdzICgub2ssIC5lcnJvciwgZXRjKVxuICogIC0gcGFyc2UgaGVhZGVyXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogIEFsaWFzaW5nIGBzdXBlcmFnZW50YCBhcyBgcmVxdWVzdGAgaXMgbmljZTpcbiAqXG4gKiAgICAgIHJlcXVlc3QgPSBzdXBlcmFnZW50O1xuICpcbiAqICBXZSBjYW4gdXNlIHRoZSBwcm9taXNlLWxpa2UgQVBJLCBvciBwYXNzIGNhbGxiYWNrczpcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvJykuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvJywgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgU2VuZGluZyBkYXRhIGNhbiBiZSBjaGFpbmVkOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBPciBwYXNzZWQgdG8gYC5zZW5kKClgOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0sIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnBvc3QoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJywgeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqIE9yIGZ1cnRoZXIgcmVkdWNlZCB0byBhIHNpbmdsZSBjYWxsIGZvciBzaW1wbGUgY2FzZXM6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJywgeyBuYW1lOiAndGonIH0sIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogQHBhcmFtIHtYTUxIVFRQUmVxdWVzdH0geGhyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gUmVzcG9uc2UocmVxLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB0aGlzLnJlcSA9IHJlcTtcbiAgdGhpcy54aHIgPSB0aGlzLnJlcS54aHI7XG4gIC8vIHJlc3BvbnNlVGV4dCBpcyBhY2Nlc3NpYmxlIG9ubHkgaWYgcmVzcG9uc2VUeXBlIGlzICcnIG9yICd0ZXh0JyBhbmQgb24gb2xkZXIgYnJvd3NlcnNcbiAgdGhpcy50ZXh0ID0gKCh0aGlzLnJlcS5tZXRob2QgIT0nSEVBRCcgJiYgKHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9PT0gJycgfHwgdGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAndGV4dCcpKSB8fCB0eXBlb2YgdGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAndW5kZWZpbmVkJylcbiAgICAgPyB0aGlzLnhoci5yZXNwb25zZVRleHRcbiAgICAgOiBudWxsO1xuICB0aGlzLnN0YXR1c1RleHQgPSB0aGlzLnJlcS54aHIuc3RhdHVzVGV4dDtcbiAgdGhpcy5zZXRTdGF0dXNQcm9wZXJ0aWVzKHRoaXMueGhyLnN0YXR1cyk7XG4gIHRoaXMuaGVhZGVyID0gdGhpcy5oZWFkZXJzID0gcGFyc2VIZWFkZXIodGhpcy54aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAvLyBnZXRBbGxSZXNwb25zZUhlYWRlcnMgc29tZXRpbWVzIGZhbHNlbHkgcmV0dXJucyBcIlwiIGZvciBDT1JTIHJlcXVlc3RzLCBidXRcbiAgLy8gZ2V0UmVzcG9uc2VIZWFkZXIgc3RpbGwgd29ya3MuIHNvIHdlIGdldCBjb250ZW50LXR5cGUgZXZlbiBpZiBnZXR0aW5nXG4gIC8vIG90aGVyIGhlYWRlcnMgZmFpbHMuXG4gIHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSA9IHRoaXMueGhyLmdldFJlc3BvbnNlSGVhZGVyKCdjb250ZW50LXR5cGUnKTtcbiAgdGhpcy5zZXRIZWFkZXJQcm9wZXJ0aWVzKHRoaXMuaGVhZGVyKTtcbiAgdGhpcy5ib2R5ID0gdGhpcy5yZXEubWV0aG9kICE9ICdIRUFEJ1xuICAgID8gdGhpcy5wYXJzZUJvZHkodGhpcy50ZXh0ID8gdGhpcy50ZXh0IDogdGhpcy54aHIucmVzcG9uc2UpXG4gICAgOiBudWxsO1xufVxuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGBmaWVsZGAgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIHJldHVybiB0aGlzLmhlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogU2V0IGhlYWRlciByZWxhdGVkIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGAudHlwZWAgdGhlIGNvbnRlbnQgdHlwZSB3aXRob3V0IHBhcmFtc1xuICpcbiAqIEEgcmVzcG9uc2Ugb2YgXCJDb250ZW50LVR5cGU6IHRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLThcIlxuICogd2lsbCBwcm92aWRlIHlvdSB3aXRoIGEgYC50eXBlYCBvZiBcInRleHQvcGxhaW5cIi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuc2V0SGVhZGVyUHJvcGVydGllcyA9IGZ1bmN0aW9uKGhlYWRlcil7XG4gIC8vIGNvbnRlbnQtdHlwZVxuICB2YXIgY3QgPSB0aGlzLmhlYWRlclsnY29udGVudC10eXBlJ10gfHwgJyc7XG4gIHRoaXMudHlwZSA9IHR5cGUoY3QpO1xuXG4gIC8vIHBhcmFtc1xuICB2YXIgb2JqID0gcGFyYW1zKGN0KTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgdGhpc1trZXldID0gb2JqW2tleV07XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBib2R5IGBzdHJgLlxuICpcbiAqIFVzZWQgZm9yIGF1dG8tcGFyc2luZyBvZiBib2RpZXMuIFBhcnNlcnNcbiAqIGFyZSBkZWZpbmVkIG9uIHRoZSBgc3VwZXJhZ2VudC5wYXJzZWAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnBhcnNlQm9keSA9IGZ1bmN0aW9uKHN0cil7XG4gIHZhciBwYXJzZSA9IHJlcXVlc3QucGFyc2VbdGhpcy50eXBlXTtcbiAgaWYgKCFwYXJzZSAmJiBpc0pTT04odGhpcy50eXBlKSkge1xuICAgIHBhcnNlID0gcmVxdWVzdC5wYXJzZVsnYXBwbGljYXRpb24vanNvbiddO1xuICB9XG4gIHJldHVybiBwYXJzZSAmJiBzdHIgJiYgKHN0ci5sZW5ndGggfHwgc3RyIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgID8gcGFyc2Uoc3RyKVxuICAgIDogbnVsbDtcbn07XG5cbi8qKlxuICogU2V0IGZsYWdzIHN1Y2ggYXMgYC5va2AgYmFzZWQgb24gYHN0YXR1c2AuXG4gKlxuICogRm9yIGV4YW1wbGUgYSAyeHggcmVzcG9uc2Ugd2lsbCBnaXZlIHlvdSBhIGAub2tgIG9mIF9fdHJ1ZV9fXG4gKiB3aGVyZWFzIDV4eCB3aWxsIGJlIF9fZmFsc2VfXyBhbmQgYC5lcnJvcmAgd2lsbCBiZSBfX3RydWVfXy4gVGhlXG4gKiBgLmNsaWVudEVycm9yYCBhbmQgYC5zZXJ2ZXJFcnJvcmAgYXJlIGFsc28gYXZhaWxhYmxlIHRvIGJlIG1vcmVcbiAqIHNwZWNpZmljLCBhbmQgYC5zdGF0dXNUeXBlYCBpcyB0aGUgY2xhc3Mgb2YgZXJyb3IgcmFuZ2luZyBmcm9tIDEuLjVcbiAqIHNvbWV0aW1lcyB1c2VmdWwgZm9yIG1hcHBpbmcgcmVzcG9uZCBjb2xvcnMgZXRjLlxuICpcbiAqIFwic3VnYXJcIiBwcm9wZXJ0aWVzIGFyZSBhbHNvIGRlZmluZWQgZm9yIGNvbW1vbiBjYXNlcy4gQ3VycmVudGx5IHByb3ZpZGluZzpcbiAqXG4gKiAgIC0gLm5vQ29udGVudFxuICogICAtIC5iYWRSZXF1ZXN0XG4gKiAgIC0gLnVuYXV0aG9yaXplZFxuICogICAtIC5ub3RBY2NlcHRhYmxlXG4gKiAgIC0gLm5vdEZvdW5kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnNldFN0YXR1c1Byb3BlcnRpZXMgPSBmdW5jdGlvbihzdGF0dXMpe1xuICAvLyBoYW5kbGUgSUU5IGJ1ZzogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDA0Njk3Mi9tc2llLXJldHVybnMtc3RhdHVzLWNvZGUtb2YtMTIyMy1mb3ItYWpheC1yZXF1ZXN0XG4gIGlmIChzdGF0dXMgPT09IDEyMjMpIHtcbiAgICBzdGF0dXMgPSAyMDQ7XG4gIH1cblxuICB2YXIgdHlwZSA9IHN0YXR1cyAvIDEwMCB8IDA7XG5cbiAgLy8gc3RhdHVzIC8gY2xhc3NcbiAgdGhpcy5zdGF0dXMgPSB0aGlzLnN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gIHRoaXMuc3RhdHVzVHlwZSA9IHR5cGU7XG5cbiAgLy8gYmFzaWNzXG4gIHRoaXMuaW5mbyA9IDEgPT0gdHlwZTtcbiAgdGhpcy5vayA9IDIgPT0gdHlwZTtcbiAgdGhpcy5jbGllbnRFcnJvciA9IDQgPT0gdHlwZTtcbiAgdGhpcy5zZXJ2ZXJFcnJvciA9IDUgPT0gdHlwZTtcbiAgdGhpcy5lcnJvciA9ICg0ID09IHR5cGUgfHwgNSA9PSB0eXBlKVxuICAgID8gdGhpcy50b0Vycm9yKClcbiAgICA6IGZhbHNlO1xuXG4gIC8vIHN1Z2FyXG4gIHRoaXMuYWNjZXB0ZWQgPSAyMDIgPT0gc3RhdHVzO1xuICB0aGlzLm5vQ29udGVudCA9IDIwNCA9PSBzdGF0dXM7XG4gIHRoaXMuYmFkUmVxdWVzdCA9IDQwMCA9PSBzdGF0dXM7XG4gIHRoaXMudW5hdXRob3JpemVkID0gNDAxID09IHN0YXR1cztcbiAgdGhpcy5ub3RBY2NlcHRhYmxlID0gNDA2ID09IHN0YXR1cztcbiAgdGhpcy5ub3RGb3VuZCA9IDQwNCA9PSBzdGF0dXM7XG4gIHRoaXMuZm9yYmlkZGVuID0gNDAzID09IHN0YXR1cztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFuIGBFcnJvcmAgcmVwcmVzZW50YXRpdmUgb2YgdGhpcyByZXNwb25zZS5cbiAqXG4gKiBAcmV0dXJuIHtFcnJvcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnRvRXJyb3IgPSBmdW5jdGlvbigpe1xuICB2YXIgcmVxID0gdGhpcy5yZXE7XG4gIHZhciBtZXRob2QgPSByZXEubWV0aG9kO1xuICB2YXIgdXJsID0gcmVxLnVybDtcblxuICB2YXIgbXNnID0gJ2Nhbm5vdCAnICsgbWV0aG9kICsgJyAnICsgdXJsICsgJyAoJyArIHRoaXMuc3RhdHVzICsgJyknO1xuICB2YXIgZXJyID0gbmV3IEVycm9yKG1zZyk7XG4gIGVyci5zdGF0dXMgPSB0aGlzLnN0YXR1cztcbiAgZXJyLm1ldGhvZCA9IG1ldGhvZDtcbiAgZXJyLnVybCA9IHVybDtcblxuICByZXR1cm4gZXJyO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgYFJlc3BvbnNlYC5cbiAqL1xuXG5yZXF1ZXN0LlJlc3BvbnNlID0gUmVzcG9uc2U7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUmVxdWVzdGAgd2l0aCB0aGUgZ2l2ZW4gYG1ldGhvZGAgYW5kIGB1cmxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gUmVxdWVzdChtZXRob2QsIHVybCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX3F1ZXJ5ID0gdGhpcy5fcXVlcnkgfHwgW107XG4gIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICB0aGlzLnVybCA9IHVybDtcbiAgdGhpcy5oZWFkZXIgPSB7fTsgLy8gcHJlc2VydmVzIGhlYWRlciBuYW1lIGNhc2VcbiAgdGhpcy5faGVhZGVyID0ge307IC8vIGNvZXJjZXMgaGVhZGVyIG5hbWVzIHRvIGxvd2VyY2FzZVxuICB0aGlzLm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuICAgIHZhciBlcnIgPSBudWxsO1xuICAgIHZhciByZXMgPSBudWxsO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJlcyA9IG5ldyBSZXNwb25zZShzZWxmKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGVyciA9IG5ldyBFcnJvcignUGFyc2VyIGlzIHVuYWJsZSB0byBwYXJzZSB0aGUgcmVzcG9uc2UnKTtcbiAgICAgIGVyci5wYXJzZSA9IHRydWU7XG4gICAgICBlcnIub3JpZ2luYWwgPSBlO1xuICAgICAgLy8gaXNzdWUgIzY3NTogcmV0dXJuIHRoZSByYXcgcmVzcG9uc2UgaWYgdGhlIHJlc3BvbnNlIHBhcnNpbmcgZmFpbHNcbiAgICAgIGVyci5yYXdSZXNwb25zZSA9IHNlbGYueGhyICYmIHNlbGYueGhyLnJlc3BvbnNlVGV4dCA/IHNlbGYueGhyLnJlc3BvbnNlVGV4dCA6IG51bGw7XG4gICAgICAvLyBpc3N1ZSAjODc2OiByZXR1cm4gdGhlIGh0dHAgc3RhdHVzIGNvZGUgaWYgdGhlIHJlc3BvbnNlIHBhcnNpbmcgZmFpbHNcbiAgICAgIGVyci5zdGF0dXNDb2RlID0gc2VsZi54aHIgJiYgc2VsZi54aHIuc3RhdHVzID8gc2VsZi54aHIuc3RhdHVzIDogbnVsbDtcbiAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGVycik7XG4gICAgfVxuXG4gICAgc2VsZi5lbWl0KCdyZXNwb25zZScsIHJlcyk7XG5cbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgfVxuXG4gICAgaWYgKHJlcy5zdGF0dXMgPj0gMjAwICYmIHJlcy5zdGF0dXMgPCAzMDApIHtcbiAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGVyciwgcmVzKTtcbiAgICB9XG5cbiAgICB2YXIgbmV3X2VyciA9IG5ldyBFcnJvcihyZXMuc3RhdHVzVGV4dCB8fCAnVW5zdWNjZXNzZnVsIEhUVFAgcmVzcG9uc2UnKTtcbiAgICBuZXdfZXJyLm9yaWdpbmFsID0gZXJyO1xuICAgIG5ld19lcnIucmVzcG9uc2UgPSByZXM7XG4gICAgbmV3X2Vyci5zdGF0dXMgPSByZXMuc3RhdHVzO1xuXG4gICAgc2VsZi5jYWxsYmFjayhuZXdfZXJyLCByZXMpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBNaXhpbiBgRW1pdHRlcmAgYW5kIGByZXF1ZXN0QmFzZWAuXG4gKi9cblxuRW1pdHRlcihSZXF1ZXN0LnByb3RvdHlwZSk7XG5mb3IgKHZhciBrZXkgaW4gcmVxdWVzdEJhc2UpIHtcbiAgUmVxdWVzdC5wcm90b3R5cGVba2V5XSA9IHJlcXVlc3RCYXNlW2tleV07XG59XG5cbi8qKlxuICogQWJvcnQgdGhlIHJlcXVlc3QsIGFuZCBjbGVhciBwb3RlbnRpYWwgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uKCl7XG4gIGlmICh0aGlzLmFib3J0ZWQpIHJldHVybjtcbiAgdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgdGhpcy54aHIgJiYgdGhpcy54aHIuYWJvcnQoKTtcbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcbiAgdGhpcy5lbWl0KCdhYm9ydCcpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IENvbnRlbnQtVHlwZSB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgnYXBwbGljYXRpb24veG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50eXBlID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdDb250ZW50LVR5cGUnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHJlc3BvbnNlVHlwZSB0byBgdmFsYC4gUHJlc2VudGx5IHZhbGlkIHJlc3BvbnNlVHlwZXMgYXJlICdibG9iJyBhbmQgXG4gKiAnYXJyYXlidWZmZXInLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnJlc3BvbnNlVHlwZSgnYmxvYicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnJlc3BvbnNlVHlwZSA9IGZ1bmN0aW9uKHZhbCl7XG4gIHRoaXMuX3Jlc3BvbnNlVHlwZSA9IHZhbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBY2NlcHQgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMuanNvbiA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFjY2VwdFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFjY2VwdCA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQWNjZXB0JywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBdXRob3JpemF0aW9uIGZpZWxkIHZhbHVlIHdpdGggYHVzZXJgIGFuZCBgcGFzc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyB3aXRoICd0eXBlJyBwcm9wZXJ0eSAnYXV0bycgb3IgJ2Jhc2ljJyAoZGVmYXVsdCAnYmFzaWMnKVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF1dGggPSBmdW5jdGlvbih1c2VyLCBwYXNzLCBvcHRpb25zKXtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIHR5cGU6ICdiYXNpYydcbiAgICB9XG4gIH1cblxuICBzd2l0Y2ggKG9wdGlvbnMudHlwZSkge1xuICAgIGNhc2UgJ2Jhc2ljJzpcbiAgICAgIHZhciBzdHIgPSBidG9hKHVzZXIgKyAnOicgKyBwYXNzKTtcbiAgICAgIHRoaXMuc2V0KCdBdXRob3JpemF0aW9uJywgJ0Jhc2ljICcgKyBzdHIpO1xuICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnYXV0byc6XG4gICAgICB0aGlzLnVzZXJuYW1lID0gdXNlcjtcbiAgICAgIHRoaXMucGFzc3dvcmQgPSBwYXNzO1xuICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4qIEFkZCBxdWVyeS1zdHJpbmcgYHZhbGAuXG4qXG4qIEV4YW1wbGVzOlxuKlxuKiAgIHJlcXVlc3QuZ2V0KCcvc2hvZXMnKVxuKiAgICAgLnF1ZXJ5KCdzaXplPTEwJylcbiogICAgIC5xdWVyeSh7IGNvbG9yOiAnYmx1ZScgfSlcbipcbiogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSB2YWxcbiogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4qIEBhcGkgcHVibGljXG4qL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uKHZhbCl7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB2YWwgPSBzZXJpYWxpemUodmFsKTtcbiAgaWYgKHZhbCkgdGhpcy5fcXVlcnkucHVzaCh2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUXVldWUgdGhlIGdpdmVuIGBmaWxlYCBhcyBhbiBhdHRhY2htZW50IHRvIHRoZSBzcGVjaWZpZWQgYGZpZWxkYCxcbiAqIHdpdGggb3B0aW9uYWwgYGZpbGVuYW1lYC5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5hdHRhY2gobmV3IEJsb2IoWyc8YSBpZD1cImFcIj48YiBpZD1cImJcIj5oZXkhPC9iPjwvYT4nXSwgeyB0eXBlOiBcInRleHQvaHRtbFwifSkpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcGFyYW0ge0Jsb2J8RmlsZX0gZmlsZVxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXR0YWNoID0gZnVuY3Rpb24oZmllbGQsIGZpbGUsIGZpbGVuYW1lKXtcbiAgdGhpcy5fZ2V0Rm9ybURhdGEoKS5hcHBlbmQoZmllbGQsIGZpbGUsIGZpbGVuYW1lIHx8IGZpbGUubmFtZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUmVxdWVzdC5wcm90b3R5cGUuX2dldEZvcm1EYXRhID0gZnVuY3Rpb24oKXtcbiAgaWYgKCF0aGlzLl9mb3JtRGF0YSkge1xuICAgIHRoaXMuX2Zvcm1EYXRhID0gbmV3IHJvb3QuRm9ybURhdGEoKTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZm9ybURhdGE7XG59O1xuXG4vKipcbiAqIFNlbmQgYGRhdGFgIGFzIHRoZSByZXF1ZXN0IGJvZHksIGRlZmF1bHRpbmcgdGhlIGAudHlwZSgpYCB0byBcImpzb25cIiB3aGVuXG4gKiBhbiBvYmplY3QgaXMgZ2l2ZW4uXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICAgLy8gbWFudWFsIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnanNvbicpXG4gKiAgICAgICAgIC5zZW5kKCd7XCJuYW1lXCI6XCJ0alwifScpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byBqc29uXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbWFudWFsIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoJ25hbWU9dGonKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBkZWZhdWx0cyB0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAgKiAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICAqICAgICAgICAuc2VuZCgnbmFtZT10b2JpJylcbiAgKiAgICAgICAgLnNlbmQoJ3NwZWNpZXM9ZmVycmV0JylcbiAgKiAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24oZGF0YSl7XG4gIHZhciBvYmogPSBpc09iamVjdChkYXRhKTtcbiAgdmFyIHR5cGUgPSB0aGlzLl9oZWFkZXJbJ2NvbnRlbnQtdHlwZSddO1xuXG4gIC8vIG1lcmdlXG4gIGlmIChvYmogJiYgaXNPYmplY3QodGhpcy5fZGF0YSkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgdGhpcy5fZGF0YVtrZXldID0gZGF0YVtrZXldO1xuICAgIH1cbiAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgZGF0YSkge1xuICAgIGlmICghdHlwZSkgdGhpcy50eXBlKCdmb3JtJyk7XG4gICAgdHlwZSA9IHRoaXMuX2hlYWRlclsnY29udGVudC10eXBlJ107XG4gICAgaWYgKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnID09IHR5cGUpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhXG4gICAgICAgID8gdGhpcy5fZGF0YSArICcmJyArIGRhdGFcbiAgICAgICAgOiBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kYXRhID0gKHRoaXMuX2RhdGEgfHwgJycpICsgZGF0YTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH1cblxuICBpZiAoIW9iaiB8fCBpc0hvc3QoZGF0YSkpIHJldHVybiB0aGlzO1xuICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnanNvbicpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQGRlcHJlY2F0ZWRcbiAqL1xuUmVzcG9uc2UucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gc2VyaWFsaXplKGZuKXtcbiAgaWYgKHJvb3QuY29uc29sZSkge1xuICAgIGNvbnNvbGUud2FybihcIkNsaWVudC1zaWRlIHBhcnNlKCkgbWV0aG9kIGhhcyBiZWVuIHJlbmFtZWQgdG8gc2VyaWFsaXplKCkuIFRoaXMgbWV0aG9kIGlzIG5vdCBjb21wYXRpYmxlIHdpdGggc3VwZXJhZ2VudCB2Mi4wXCIpO1xuICB9XG4gIHRoaXMuc2VyaWFsaXplKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5SZXNwb25zZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24gc2VyaWFsaXplKGZuKXtcbiAgdGhpcy5fcGFyc2VyID0gZm47XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJbnZva2UgdGhlIGNhbGxiYWNrIHdpdGggYGVycmAgYW5kIGByZXNgXG4gKiBhbmQgaGFuZGxlIGFyaXR5IGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jYWxsYmFjayA9IGZ1bmN0aW9uKGVyciwgcmVzKXtcbiAgdmFyIGZuID0gdGhpcy5fY2FsbGJhY2s7XG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIGZuKGVyciwgcmVzKTtcbn07XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggeC1kb21haW4gZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY3Jvc3NEb21haW5FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1JlcXVlc3QgaGFzIGJlZW4gdGVybWluYXRlZFxcblBvc3NpYmxlIGNhdXNlczogdGhlIG5ldHdvcmsgaXMgb2ZmbGluZSwgT3JpZ2luIGlzIG5vdCBhbGxvd2VkIGJ5IEFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbiwgdGhlIHBhZ2UgaXMgYmVpbmcgdW5sb2FkZWQsIGV0Yy4nKTtcbiAgZXJyLmNyb3NzRG9tYWluID0gdHJ1ZTtcblxuICBlcnIuc3RhdHVzID0gdGhpcy5zdGF0dXM7XG4gIGVyci5tZXRob2QgPSB0aGlzLm1ldGhvZDtcbiAgZXJyLnVybCA9IHRoaXMudXJsO1xuXG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggdGltZW91dCBlcnJvci5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50aW1lb3V0RXJyb3IgPSBmdW5jdGlvbigpe1xuICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXQ7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoJ3RpbWVvdXQgb2YgJyArIHRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnKTtcbiAgZXJyLnRpbWVvdXQgPSB0aW1lb3V0O1xuICB0aGlzLmNhbGxiYWNrKGVycik7XG59O1xuXG4vKipcbiAqIEVuYWJsZSB0cmFuc21pc3Npb24gb2YgY29va2llcyB3aXRoIHgtZG9tYWluIHJlcXVlc3RzLlxuICpcbiAqIE5vdGUgdGhhdCBmb3IgdGhpcyB0byB3b3JrIHRoZSBvcmlnaW4gbXVzdCBub3QgYmVcbiAqIHVzaW5nIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCIgd2l0aCBhIHdpbGRjYXJkLFxuICogYW5kIGFsc28gbXVzdCBzZXQgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFsc1wiXG4gKiB0byBcInRydWVcIi5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLndpdGhDcmVkZW50aWFscyA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuX3dpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJbml0aWF0ZSByZXF1ZXN0LCBpbnZva2luZyBjYWxsYmFjayBgZm4ocmVzKWBcbiAqIHdpdGggYW4gaW5zdGFuY2VvZiBgUmVzcG9uc2VgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB4aHIgPSB0aGlzLnhociA9IHJlcXVlc3QuZ2V0WEhSKCk7XG4gIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJ5LmpvaW4oJyYnKTtcbiAgdmFyIHRpbWVvdXQgPSB0aGlzLl90aW1lb3V0O1xuICB2YXIgZGF0YSA9IHRoaXMuX2Zvcm1EYXRhIHx8IHRoaXMuX2RhdGE7XG5cbiAgLy8gc3RvcmUgY2FsbGJhY2tcbiAgdGhpcy5fY2FsbGJhY2sgPSBmbiB8fCBub29wO1xuXG4gIC8vIHN0YXRlIGNoYW5nZVxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcbiAgICBpZiAoNCAhPSB4aHIucmVhZHlTdGF0ZSkgcmV0dXJuO1xuXG4gICAgLy8gSW4gSUU5LCByZWFkcyB0byBhbnkgcHJvcGVydHkgKGUuZy4gc3RhdHVzKSBvZmYgb2YgYW4gYWJvcnRlZCBYSFIgd2lsbFxuICAgIC8vIHJlc3VsdCBpbiB0aGUgZXJyb3IgXCJDb3VsZCBub3QgY29tcGxldGUgdGhlIG9wZXJhdGlvbiBkdWUgdG8gZXJyb3IgYzAwYzAyM2ZcIlxuICAgIHZhciBzdGF0dXM7XG4gICAgdHJ5IHsgc3RhdHVzID0geGhyLnN0YXR1cyB9IGNhdGNoKGUpIHsgc3RhdHVzID0gMDsgfVxuXG4gICAgaWYgKDAgPT0gc3RhdHVzKSB7XG4gICAgICBpZiAoc2VsZi50aW1lZG91dCkgcmV0dXJuIHNlbGYudGltZW91dEVycm9yKCk7XG4gICAgICBpZiAoc2VsZi5hYm9ydGVkKSByZXR1cm47XG4gICAgICByZXR1cm4gc2VsZi5jcm9zc0RvbWFpbkVycm9yKCk7XG4gICAgfVxuICAgIHNlbGYuZW1pdCgnZW5kJyk7XG4gIH07XG5cbiAgLy8gcHJvZ3Jlc3NcbiAgdmFyIGhhbmRsZVByb2dyZXNzID0gZnVuY3Rpb24oZSl7XG4gICAgaWYgKGUudG90YWwgPiAwKSB7XG4gICAgICBlLnBlcmNlbnQgPSBlLmxvYWRlZCAvIGUudG90YWwgKiAxMDA7XG4gICAgfVxuICAgIGUuZGlyZWN0aW9uID0gJ2Rvd25sb2FkJztcbiAgICBzZWxmLmVtaXQoJ3Byb2dyZXNzJywgZSk7XG4gIH07XG4gIGlmICh0aGlzLmhhc0xpc3RlbmVycygncHJvZ3Jlc3MnKSkge1xuICAgIHhoci5vbnByb2dyZXNzID0gaGFuZGxlUHJvZ3Jlc3M7XG4gIH1cbiAgdHJ5IHtcbiAgICBpZiAoeGhyLnVwbG9hZCAmJiB0aGlzLmhhc0xpc3RlbmVycygncHJvZ3Jlc3MnKSkge1xuICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gaGFuZGxlUHJvZ3Jlc3M7XG4gICAgfVxuICB9IGNhdGNoKGUpIHtcbiAgICAvLyBBY2Nlc3NpbmcgeGhyLnVwbG9hZCBmYWlscyBpbiBJRSBmcm9tIGEgd2ViIHdvcmtlciwgc28ganVzdCBwcmV0ZW5kIGl0IGRvZXNuJ3QgZXhpc3QuXG4gICAgLy8gUmVwb3J0ZWQgaGVyZTpcbiAgICAvLyBodHRwczovL2Nvbm5lY3QubWljcm9zb2Z0LmNvbS9JRS9mZWVkYmFjay9kZXRhaWxzLzgzNzI0NS94bWxodHRwcmVxdWVzdC11cGxvYWQtdGhyb3dzLWludmFsaWQtYXJndW1lbnQtd2hlbi11c2VkLWZyb20td2ViLXdvcmtlci1jb250ZXh0XG4gIH1cblxuICAvLyB0aW1lb3V0XG4gIGlmICh0aW1lb3V0ICYmICF0aGlzLl90aW1lcikge1xuICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgc2VsZi50aW1lZG91dCA9IHRydWU7XG4gICAgICBzZWxmLmFib3J0KCk7XG4gICAgfSwgdGltZW91dCk7XG4gIH1cblxuICAvLyBxdWVyeXN0cmluZ1xuICBpZiAocXVlcnkpIHtcbiAgICBxdWVyeSA9IHJlcXVlc3Quc2VyaWFsaXplT2JqZWN0KHF1ZXJ5KTtcbiAgICB0aGlzLnVybCArPSB+dGhpcy51cmwuaW5kZXhPZignPycpXG4gICAgICA/ICcmJyArIHF1ZXJ5XG4gICAgICA6ICc/JyArIHF1ZXJ5O1xuICB9XG5cbiAgLy8gaW5pdGlhdGUgcmVxdWVzdFxuICBpZiAodGhpcy51c2VybmFtZSAmJiB0aGlzLnBhc3N3b3JkKSB7XG4gICAgeGhyLm9wZW4odGhpcy5tZXRob2QsIHRoaXMudXJsLCB0cnVlLCB0aGlzLnVzZXJuYW1lLCB0aGlzLnBhc3N3b3JkKTtcbiAgfSBlbHNlIHtcbiAgICB4aHIub3Blbih0aGlzLm1ldGhvZCwgdGhpcy51cmwsIHRydWUpO1xuICB9XG5cbiAgLy8gQ09SU1xuICBpZiAodGhpcy5fd2l0aENyZWRlbnRpYWxzKSB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblxuICAvLyBib2R5XG4gIGlmICgnR0VUJyAhPSB0aGlzLm1ldGhvZCAmJiAnSEVBRCcgIT0gdGhpcy5tZXRob2QgJiYgJ3N0cmluZycgIT0gdHlwZW9mIGRhdGEgJiYgIWlzSG9zdChkYXRhKSkge1xuICAgIC8vIHNlcmlhbGl6ZSBzdHVmZlxuICAgIHZhciBjb250ZW50VHlwZSA9IHRoaXMuX2hlYWRlclsnY29udGVudC10eXBlJ107XG4gICAgdmFyIHNlcmlhbGl6ZSA9IHRoaXMuX3BhcnNlciB8fCByZXF1ZXN0LnNlcmlhbGl6ZVtjb250ZW50VHlwZSA/IGNvbnRlbnRUeXBlLnNwbGl0KCc7JylbMF0gOiAnJ107XG4gICAgaWYgKCFzZXJpYWxpemUgJiYgaXNKU09OKGNvbnRlbnRUeXBlKSkgc2VyaWFsaXplID0gcmVxdWVzdC5zZXJpYWxpemVbJ2FwcGxpY2F0aW9uL2pzb24nXTtcbiAgICBpZiAoc2VyaWFsaXplKSBkYXRhID0gc2VyaWFsaXplKGRhdGEpO1xuICB9XG5cbiAgLy8gc2V0IGhlYWRlciBmaWVsZHNcbiAgZm9yICh2YXIgZmllbGQgaW4gdGhpcy5oZWFkZXIpIHtcbiAgICBpZiAobnVsbCA9PSB0aGlzLmhlYWRlcltmaWVsZF0pIGNvbnRpbnVlO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGZpZWxkLCB0aGlzLmhlYWRlcltmaWVsZF0pO1xuICB9XG5cbiAgaWYgKHRoaXMuX3Jlc3BvbnNlVHlwZSkge1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSB0aGlzLl9yZXNwb25zZVR5cGU7XG4gIH1cblxuICAvLyBzZW5kIHN0dWZmXG4gIHRoaXMuZW1pdCgncmVxdWVzdCcsIHRoaXMpO1xuXG4gIC8vIElFMTEgeGhyLnNlbmQodW5kZWZpbmVkKSBzZW5kcyAndW5kZWZpbmVkJyBzdHJpbmcgYXMgUE9TVCBwYXlsb2FkIChpbnN0ZWFkIG9mIG5vdGhpbmcpXG4gIC8vIFdlIG5lZWQgbnVsbCBoZXJlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gIHhoci5zZW5kKHR5cGVvZiBkYXRhICE9PSAndW5kZWZpbmVkJyA/IGRhdGEgOiBudWxsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogRXhwb3NlIGBSZXF1ZXN0YC5cbiAqL1xuXG5yZXF1ZXN0LlJlcXVlc3QgPSBSZXF1ZXN0O1xuXG4vKipcbiAqIEdFVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5nZXQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0dFVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnF1ZXJ5KGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBIRUFEIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IGRhdGEgb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmhlYWQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0hFQUQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBERUxFVEUgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGRlbCh1cmwsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0RFTEVURScsIHVybCk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG5yZXF1ZXN0WydkZWwnXSA9IGRlbDtcbnJlcXVlc3RbJ2RlbGV0ZSddID0gZGVsO1xuXG4vKipcbiAqIFBBVENIIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gZGF0YVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucGF0Y2ggPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BBVENIJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUE9TVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IGRhdGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnBvc3QgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BPU1QnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQVVQgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wdXQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BVVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuIiwiLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gbnVsbCAhPSBvYmogJiYgJ29iamVjdCcgPT0gdHlwZW9mIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogTW9kdWxlIG9mIG1peGVkLWluIGZ1bmN0aW9ucyBzaGFyZWQgYmV0d2VlbiBub2RlIGFuZCBjbGllbnQgY29kZVxuICovXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzLW9iamVjdCcpO1xuXG4vKipcbiAqIENsZWFyIHByZXZpb3VzIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24gX2NsZWFyVGltZW91dCgpe1xuICB0aGlzLl90aW1lb3V0ID0gMDtcbiAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEZvcmNlIGdpdmVuIHBhcnNlclxuICpcbiAqIFNldHMgdGhlIGJvZHkgcGFyc2VyIG5vIG1hdHRlciB0eXBlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiBwYXJzZShmbil7XG4gIHRoaXMuX3BhcnNlciA9IGZuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRpbWVvdXQgdG8gYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnRpbWVvdXQgPSBmdW5jdGlvbiB0aW1lb3V0KG1zKXtcbiAgdGhpcy5fdGltZW91dCA9IG1zO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRmF1eCBwcm9taXNlIHN1cHBvcnRcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKi9cblxuZXhwb3J0cy50aGVuID0gZnVuY3Rpb24gdGhlbihmdWxmaWxsLCByZWplY3QpIHtcbiAgcmV0dXJuIHRoaXMuZW5kKGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgZXJyID8gcmVqZWN0KGVycikgOiBmdWxmaWxsKHJlcyk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEFsbG93IGZvciBleHRlbnNpb25cbiAqL1xuXG5leHBvcnRzLnVzZSA9IGZ1bmN0aW9uIHVzZShmbikge1xuICBmbih0aGlzKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cblxuLyoqXG4gKiBHZXQgcmVxdWVzdCBoZWFkZXIgYGZpZWxkYC5cbiAqIENhc2UtaW5zZW5zaXRpdmUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuZ2V0ID0gZnVuY3Rpb24oZmllbGQpe1xuICByZXR1cm4gdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBHZXQgY2FzZS1pbnNlbnNpdGl2ZSBoZWFkZXIgYGZpZWxkYCB2YWx1ZS5cbiAqIFRoaXMgaXMgYSBkZXByZWNhdGVkIGludGVybmFsIEFQSS4gVXNlIGAuZ2V0KGZpZWxkKWAgaW5zdGVhZC5cbiAqXG4gKiAoZ2V0SGVhZGVyIGlzIG5vIGxvbmdlciB1c2VkIGludGVybmFsbHkgYnkgdGhlIHN1cGVyYWdlbnQgY29kZSBiYXNlKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKiBAZGVwcmVjYXRlZFxuICovXG5cbmV4cG9ydHMuZ2V0SGVhZGVyID0gZXhwb3J0cy5nZXQ7XG5cbi8qKlxuICogU2V0IGhlYWRlciBgZmllbGRgIHRvIGB2YWxgLCBvciBtdWx0aXBsZSBmaWVsZHMgd2l0aCBvbmUgb2JqZWN0LlxuICogQ2FzZS1pbnNlbnNpdGl2ZS5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuc2V0KCdYLUFQSS1LZXknLCAnZm9vYmFyJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoeyBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJywgJ1gtQVBJLUtleSc6ICdmb29iYXInIH0pXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBmaWVsZFxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuc2V0ID0gZnVuY3Rpb24oZmllbGQsIHZhbCl7XG4gIGlmIChpc09iamVjdChmaWVsZCkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZmllbGQpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgZmllbGRba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXSA9IHZhbDtcbiAgdGhpcy5oZWFkZXJbZmllbGRdID0gdmFsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGhlYWRlciBgZmllbGRgLlxuICogQ2FzZS1pbnNlbnNpdGl2ZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnVuc2V0KCdVc2VyLUFnZW50JylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqL1xuZXhwb3J0cy51bnNldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgZGVsZXRlIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbiAgZGVsZXRlIHRoaXMuaGVhZGVyW2ZpZWxkXTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFdyaXRlIHRoZSBmaWVsZCBgbmFtZWAgYW5kIGB2YWxgIGZvciBcIm11bHRpcGFydC9mb3JtLWRhdGFcIlxuICogcmVxdWVzdCBib2RpZXMuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuZmllbGQoJ2ZvbycsICdiYXInKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ3xCbG9ifEZpbGV8QnVmZmVyfGZzLlJlYWRTdHJlYW19IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnRzLmZpZWxkID0gZnVuY3Rpb24obmFtZSwgdmFsKSB7XG4gIHRoaXMuX2dldEZvcm1EYXRhKCkuYXBwZW5kKG5hbWUsIHZhbCk7XG4gIHJldHVybiB0aGlzO1xufTtcbiIsIi8vIFRoZSBub2RlIGFuZCBicm93c2VyIG1vZHVsZXMgZXhwb3NlIHZlcnNpb25zIG9mIHRoaXMgd2l0aCB0aGVcbi8vIGFwcHJvcHJpYXRlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGJvdW5kIGFzIGZpcnN0IGFyZ3VtZW50XG4vKipcbiAqIElzc3VlIGEgcmVxdWVzdDpcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICByZXF1ZXN0KCdHRVQnLCAnL3VzZXJzJykuZW5kKGNhbGxiYWNrKVxuICogICAgcmVxdWVzdCgnL3VzZXJzJykuZW5kKGNhbGxiYWNrKVxuICogICAgcmVxdWVzdCgnL3VzZXJzJywgY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHVybCBvciBjYWxsYmFja1xuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gcmVxdWVzdChSZXF1ZXN0Q29uc3RydWN0b3IsIG1ldGhvZCwgdXJsKSB7XG4gIC8vIGNhbGxiYWNrXG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiB1cmwpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3RDb25zdHJ1Y3RvcignR0VUJywgbWV0aG9kKS5lbmQodXJsKTtcbiAgfVxuXG4gIC8vIHVybCBmaXJzdFxuICBpZiAoMiA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0Q29uc3RydWN0b3IoJ0dFVCcsIG1ldGhvZCk7XG4gIH1cblxuICByZXR1cm4gbmV3IFJlcXVlc3RDb25zdHJ1Y3RvcihtZXRob2QsIHVybCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWVzdDtcbiIsIi8vIGVsZW1lbnRzIHRoYXQgbmVlZCBjaGFydHMgY2FuIHB1c2ggdG8gdGhpcyBhcnJheSBjYWxsYmFja3MgZm9yIHdoZW4gY2hhcnRzIGFyZSBsb2FkZWRcbnZhciBjaGFydExvYWRIYW5kbGVycyA9IFtdO1xuXG5nb29nbGUubG9hZChcInZpc3VhbGl6YXRpb25cIiwgJzEnLCB7XG4gICAgcGFja2FnZXM6Wydjb3JlY2hhcnQnLCAnbGluZSddLFxuICAgIGNhbGxiYWNrIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgY2hhcnRMb2FkSGFuZGxlcnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBjaGFydExvYWRIYW5kbGVyc1tpXSgpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2hhcnRMb2FkSGFuZGxlcnM7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIG5vZGVzIDogcmVxdWlyZSgnLi9ub2RlcycpLFxuICByZWdpb25zIDogcmVxdWlyZSgnLi9yZWdpb25zJylcbn0iLCJ2YXIgcmVzdCA9IHJlcXVpcmUoJy4uL3Jlc3QnKTtcblxuZnVuY3Rpb24gTm9kZUNvbGxlY3Rpb24oKXtcblxuICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICB0aGlzLmxpbmtzID0gW107XG4gICAgdGhpcy5leHRyYXMgPSB7fTsgLy8gZXh0cmEgZGF0YSBmb3Igbm9kZVxuXG4gICAgdGhpcy5pbmRleCA9IHtcbiAgICAgIHBybW5hbWUgOiB7fSxcbiAgICAgIGhvYmJlc0lkIDoge30sXG4gICAgICBvcmlnaW5zIDoge30sXG4gICAgICB0ZXJtaW5hbHMgOiB7fSxcbiAgICAgIHJlZ2lvbnMgOiB7fVxuICAgIH07XG5cbiAgICB0aGlzLmluaXQgPSBmdW5jdGlvbihub2Rlcykge1xuICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgdGhpcy5saW5rcyA9IFtdO1xuICAgICAgdGhpcy5leHRyYXMgPSB7fTtcblxuICAgICAgdGhpcy5pbmRleCA9IHtcbiAgICAgICAgcHJtbmFtZSA6IHt9LFxuICAgICAgICBob2JiZXNJZCA6IHt9LFxuICAgICAgICBvcmlnaW5zIDoge30sXG4gICAgICAgIHRlcm1pbmFscyA6IHt9LFxuICAgICAgICByZWdpb25zIDoge31cbiAgICAgIH07XG5cbiAgICAgIG5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgdGhpcy5pbmRleC5wcm1uYW1lW25vZGUucHJvcGVydGllcy5wcm1uYW1lXSA9IG5vZGU7XG4gICAgICAgIHRoaXMuaW5kZXguaG9iYmVzSWRbbm9kZS5wcm9wZXJ0aWVzLmhvYmJlcy5pZF0gPSBub2RlO1xuXG4gICAgICAgIGlmKCBub2RlLnByb3BlcnRpZXMuaG9iYmVzLnR5cGUgPT09ICdsaW5rJyApIHtcbiAgICAgICAgICB0aGlzLmxpbmtzLnB1c2gobm9kZSk7XG4gICAgICAgICAgdGhpcy5zZXRMaW5rSW5kZXhlcyhub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiggIW5vZGUucHJvcGVydGllcy5ob2JiZXMucmVnaW9uKSB7XG4gICAgICAgICAgICBub2RlLnByb3BlcnRpZXMuaG9iYmVzLnJlZ2lvbiA9ICdDYWxpZm9ybmlhJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiggIXRoaXMuaW5kZXgucmVnaW9uc1tub2RlLnByb3BlcnRpZXMuaG9iYmVzLnJlZ2lvbl0gKSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4LnJlZ2lvbnNbbm9kZS5wcm9wZXJ0aWVzLmhvYmJlcy5yZWdpb25dID0gW107XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuaW5kZXgucmVnaW9uc1tub2RlLnByb3BlcnRpZXMuaG9iYmVzLnJlZ2lvbl0ucHVzaChub2RlKTtcbiAgICAgICAgICB0aGlzLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuc2V0TGlua0luZGV4ZXMgPSBmdW5jdGlvbihsaW5rKSB7XG4gICAgICAgIGlmKCAhdGhpcy5pbmRleC5vcmlnaW5zW2xpbmsucHJvcGVydGllcy5vcmlnaW5dICkge1xuICAgICAgICAgICAgdGhpcy5pbmRleC5vcmlnaW5zW2xpbmsucHJvcGVydGllcy5vcmlnaW5dID0gW2xpbmtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbmRleC5vcmlnaW5zW2xpbmsucHJvcGVydGllcy5vcmlnaW5dLnB1c2gobGluayk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggIXRoaXMuaW5kZXgudGVybWluYWxzW2xpbmsucHJvcGVydGllcy50ZXJtaW51c10gKSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4LnRlcm1pbmFsc1tsaW5rLnByb3BlcnRpZXMudGVybWludXNdID0gW2xpbmtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbmRleC50ZXJtaW5hbHNbbGluay5wcm9wZXJ0aWVzLnRlcm1pbnVzXS5wdXNoKGxpbmspO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5nZXRFeHRyYXMgPSBmdW5jdGlvbihwcm1uYW1lLCBjYWxsYmFjaykge1xuICAgICAgaWYoIHRoaXMuZXh0cmFzW3BybW5hbWVdICkge1xuICAgICAgICBpZiggdGhpcy5leHRyYXNbcHJtbmFtZV0uX19sb2FkaW5nX18gKSB7XG4gICAgICAgICAgdGhpcy5leHRyYXNbcHJtbmFtZV0uaGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2sodGhpcy5leHRyYXNbcHJtbmFtZV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5leHRyYXNbcHJtbmFtZV0gPSB7XG4gICAgICAgIF9fbG9hZGluZ19fIDogdHJ1ZSxcbiAgICAgICAgaGFuZGxlcnMgOiBbY2FsbGJhY2tdXG4gICAgICB9O1xuXG4gICAgICByZXN0LmdldEV4dHJhcyhwcm1uYW1lLCAocmVzcCkgPT4ge1xuICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMuZXh0cmFzW3BybW5hbWVdLmhhbmRsZXJzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgIHRoaXMuZXh0cmFzW3BybW5hbWVdLmhhbmRsZXJzW2ldKHJlc3ApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXh0cmFzW3BybW5hbWVdID0gcmVzcDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0QnlSZWdpb24gPSBmdW5jdGlvbihpZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXgucmVnaW9uc1tpZF0gfHwgW107XG4gICAgfVxuXG4gICAgdGhpcy5nZXRCeVBybW5hbWUgPSBmdW5jdGlvbihwcm1uYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRleC5wcm1uYW1lW3BybW5hbWVdO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0QnlJZCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRleC5ob2JiZXNJZFtpZF07XG4gICAgfVxuXG4gICAgdGhpcy5nZXRPcmlnaW5zID0gZnVuY3Rpb24ocHJtbmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXgub3JpZ2luc1twcm1uYW1lXTtcbiAgICB9XG5cbiAgICB0aGlzLmdldFRlcm1pbmFscyA9IGZ1bmN0aW9uKHBybW5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmluZGV4LnRlcm1pbmFsc1twcm1uYW1lXTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IE5vZGVDb2xsZWN0aW9uKCk7IiwidmFyIHJlc3QgPSByZXF1aXJlKCcuLi9yZXN0Jyk7XG5cbmZ1bmN0aW9uIFJlZ2lvbkNvbGxlY3Rpb24oKXtcbiAgICB0aGlzLmluZGV4ID0ge1xuICAgICAgbmFtZSA6IHt9LFxuICAgICAgaG9iYmVzSWQgOiB7fSxcbiAgICAgIHJlZ2lvbnMgOiB7fVxuICAgIH07XG5cbiAgICB0aGlzLmRhdGEgPSBbXSxcbiAgICB0aGlzLmFnZ3JlZ2F0ZSA9IHt9O1xuXG4gICAgdGhpcy5pbml0ID0gZnVuY3Rpb24ocmVnaW9ucykge1xuICAgICAgdGhpcy5pbmRleCA9IHtcbiAgICAgICAgbmFtZSA6IHt9LFxuICAgICAgICBob2JiZXNJZCA6IHt9LFxuICAgICAgICByZWdpb25zIDoge31cbiAgICAgIH07XG4gICAgICB0aGlzLmFnZ3JlZ2F0ZSA9IHt9O1xuXG4gICAgICByZWdpb25zLmZvckVhY2goKHJlZ2lvbikgPT4ge1xuICAgICAgICB0aGlzLmluZGV4Lm5hbWVbcmVnaW9uLnByb3BlcnRpZXMubmFtZV0gPSByZWdpb247XG4gICAgICAgIHRoaXMuaW5kZXguaG9iYmVzSWRbcmVnaW9uLnByb3BlcnRpZXMuaG9iYmVzLmlkXSA9IHJlZ2lvbjtcblxuICAgICAgICBpZiggIXJlZ2lvbi5wcm9wZXJ0aWVzLmhvYmJlcy5yZWdpb24gJiYgcmVnaW9uLnByb3BlcnRpZXMuaG9iYmVzLmlkICE9PSAnQ2FsaWZvcm5pYScgKSB7XG4gICAgICAgICAgcmVnaW9uLnByb3BlcnRpZXMuaG9iYmVzLnJlZ2lvbiA9ICdDYWxpZm9ybmlhJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCAhdGhpcy5pbmRleC5yZWdpb25zW3JlZ2lvbi5wcm9wZXJ0aWVzLmhvYmJlcy5yZWdpb25dICkge1xuICAgICAgICAgIHRoaXMuaW5kZXgucmVnaW9uc1tyZWdpb24ucHJvcGVydGllcy5ob2JiZXMucmVnaW9uXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5kZXgucmVnaW9uc1tyZWdpb24ucHJvcGVydGllcy5ob2JiZXMucmVnaW9uXS5wdXNoKHJlZ2lvbik7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5kYXRhID0gcmVnaW9ucztcbiAgICB9XG5cbiAgICB0aGlzLmxvYWRBZ2dyZWdhdGUgPSBmdW5jdGlvbih0eXBlLCBvcmlnaW4sIHRlcm1pbnVzLCBjYWxsYmFjaykge1xuICAgICAgdmFyIHBybW5hbWUgPSBvcmlnaW47XG4gICAgICBpZiggdHlwZW9mIHRlcm1pbnVzID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcHJtbmFtZSA9IHBybW5hbWUrJy0tJyt0ZXJtaW51cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrID0gdGVybWludXM7XG4gICAgICB9XG5cblxuICAgICAgaWYoICF0aGlzLmFnZ3JlZ2F0ZVt0eXBlXSApIHtcbiAgICAgICAgdGhpcy5hZ2dyZWdhdGVbdHlwZV0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgaWYoIHRoaXMuYWdncmVnYXRlW3R5cGVdW3BybW5hbWVdICkge1xuICAgICAgICBpZiggdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0uX19sb2FkaW5nX18gKSB7XG4gICAgICAgICAgdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0uaGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2sodGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0gPSB7XG4gICAgICAgIF9fbG9hZGluZ19fIDogdHJ1ZSxcbiAgICAgICAgaGFuZGxlcnMgOiBbY2FsbGJhY2tdXG4gICAgICB9O1xuXG4gICAgICBpZiggdHlwZW9mIHRlcm1pbnVzICE9PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcmVzdC5nZXRBZ2dyZWdhdGUoe3R5cGU6IHR5cGUsIHJlZ2lvbjogb3JpZ2lufSwgKHJlc3ApID0+IHtcbiAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMuYWdncmVnYXRlW3R5cGVdW3BybW5hbWVdLmhhbmRsZXJzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0uaGFuZGxlcnNbaV0ocmVzcCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYWdncmVnYXRlW3R5cGVdW3BybW5hbWVdID0gcmVzcDtcbiAgICAgICAgfSk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3QuZ2V0QWdncmVnYXRlKHt0eXBlOiAnZmxvdycsIG9yaWdpbjogb3JpZ2luLCB0ZXJtaW51czogdGVybWludXN9LCAocmVzcDEpID0+IHtcbiAgICAgICAgICByZXN0LmdldEFnZ3JlZ2F0ZSh7dHlwZTogJ2Zsb3cnLCBvcmlnaW46IHRlcm1pbnVzLCB0ZXJtaW51czogb3JpZ2lufSwgKHJlc3AyKSA9PiB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgb3JpZ2luIDogcmVzcDEsXG4gICAgICAgICAgICAgIHRlcm1pbnVzIDogcmVzcDJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0uaGFuZGxlcnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgIHRoaXMuYWdncmVnYXRlW3R5cGVdW3BybW5hbWVdLmhhbmRsZXJzW2ldKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0gPSBkYXRhO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmdldEJ5UmVnaW9uID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmluZGV4LnJlZ2lvbnNbaWRdIHx8IFtdO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0QnlOYW1lID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXgubmFtZVtuYW1lXTtcbiAgICB9XG5cbiAgICB0aGlzLmdldEJ5SWQgPSBmdW5jdGlvbihpZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXguaG9iYmVzSWRbaWRdO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUmVnaW9uQ29sbGVjdGlvbigpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBuZXR3b3JrIDogcmVxdWlyZSgnLi9uZXR3b3JrJylcbn0iLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG52YXIgZXZlbnRzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG52YXIgbm9kZUNvbGxlY3Rpb24gPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9ub2RlcycpO1xudmFyIHJlZ2lvbnNDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvcmVnaW9ucycpO1xudmFyIHJlc3QgPSByZXF1aXJlKCcuLi9yZXN0Jyk7XG5cbmZ1bmN0aW9uIGxvYWROZXR3b3JrKGNhbGxiYWNrKSB7XG4gIGFwaS5sb2FkaW5nID0gdHJ1ZTtcbiAgZXZlbnRzLmVtaXQoJ2xvYWRpbmcnKTtcblxuICByZXN0LmxvYWROZXR3b3JrKChkYXRhKSA9PiB7XG4gICAgbm9kZUNvbGxlY3Rpb24uaW5pdChkYXRhLm5ldHdvcmspO1xuICAgIHByb2Nlc3NOb2Rlc0xpbmtzKGRhdGEubmV0d29yayk7XG5cbiAgICByZWdpb25zQ29sbGVjdGlvbi5pbml0KGRhdGEucmVnaW9ucyk7XG4gICAgZGF0YS5yZWdpb25zLmZvckVhY2gocHJvY2Vzc1JlZ2lvbik7XG5cbiAgICBhcGkubG9hZGluZyA9IGZhbHNlO1xuICAgIGV2ZW50cy5lbWl0KCdsb2FkaW5nLWNvbXBsZXRlJyk7XG4gICAgaWYoIGNhbGxiYWNrICkgY2FsbGJhY2soKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NOb2Rlc0xpbmtzKG5vZGVzKSB7XG4gIGZvciggdmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgaWYoICFub2Rlc1tpXS5wcm9wZXJ0aWVzLmRlc2NyaXB0aW9uICkge1xuICAgICAgICBub2Rlc1tpXS5wcm9wZXJ0aWVzLmRlc2NyaXB0aW9uID0gJyc7XG4gICAgfVxuICAgIFxuICAgIG1hcmtDYWxpYnJhdGlvbk5vZGUobm9kZXNbaV0pO1xuXG4gICAgaWYoIG5vZGVzW2ldLnByb3BlcnRpZXMuaG9iYmVzLnR5cGUgPT09ICdsaW5rJyApIHtcbiAgICAgIG1hcmtMaW5rVHlwZXMobm9kZXNbaV0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXJrQ2FsaWJyYXRpb25Ob2RlKG5vZGUpIHtcbiAgICBpZiggbm9kZS5wcm9wZXJ0aWVzLnBybW5hbWUuaW5kZXhPZignXycpID4gLTEgKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IG5vZGUucHJvcGVydGllcy5wcm1uYW1lLnNwbGl0KCdfJyk7XG4gICAgICAgIGlmKCAhKHBhcnRzWzBdLm1hdGNoKC9eQ04uKi8pIHx8IHBhcnRzWzFdLm1hdGNoKC9eQ04uKi8pKSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiggIW5vZGUucHJvcGVydGllcy5wcm1uYW1lLm1hdGNoKC9eQ04uKi8pICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGhhc0luID0gZmFsc2U7XG4gICAgdmFyIGhhc091dCA9IGZhbHNlO1xuXG4gICAgaWYoIG5vZGUucHJvcGVydGllcy50ZXJtaW5hbHMgKSB7XG4gICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgbm9kZS5wcm9wZXJ0aWVzLnRlcm1pbmFscy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIGlmKCBub2RlLnByb3BlcnRpZXMudGVybWluYWxzW2ldICE9IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgaGFzT3V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiggbm9kZS5wcm9wZXJ0aWVzLm9yaWdpbnMgKSB7XG4gICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgbm9kZS5wcm9wZXJ0aWVzLm9yaWdpbnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBpZiggbm9kZS5wcm9wZXJ0aWVzLm9yaWdpbnNbaV0gIT0gbnVsbCApIHtcbiAgICAgICAgICAgICAgICBoYXNJbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlLnByb3BlcnRpZXMuY2FsaWJyYXRpb25Ob2RlID0gdHJ1ZTtcbiAgICBpZiggIWhhc0luICYmICFoYXNPdXQgKSByZXR1cm47XG5cbiAgICBpZiggaGFzSW4gJiYgaGFzT3V0ICkgbm9kZS5wcm9wZXJ0aWVzLmNhbGlicmF0aW9uTW9kZSA9ICdib3RoJztcbiAgICBlbHNlIGlmICggaGFzSW4gKSBub2RlLnByb3BlcnRpZXMuY2FsaWJyYXRpb25Nb2RlID0gJ2luJztcbiAgICBlbHNlIGlmICggaGFzT3V0ICkgbm9kZS5wcm9wZXJ0aWVzLmNhbGlicmF0aW9uTW9kZSA9ICdvdXQnO1xufVxuXG5mdW5jdGlvbiBtYXJrTGlua1R5cGVzKGxpbmspIHtcbiAgbGluay5wcm9wZXJ0aWVzLnJlbmRlckluZm8gPSB7XG4gICAgICBjb3N0IDogbGluay5wcm9wZXJ0aWVzLmhhc0Nvc3RzID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgYW1wbGl0dWRlIDogbGluay5wcm9wZXJ0aWVzLmFtcGxpdHVkZSA/IHRydWUgOiBmYWxzZSxcbiAgICAgIC8vIFRPRE86IHBhcnNlciBuZWVkcyB0byBzaGVldCBzaG9ydGN1dCBmb3IgY29udHJhaW50IHR5cGVcbiAgICAgIC8vIGRhdGEgd2lsbCBzdGlsbCBuZWVkIHRvIGJlIGxvYWRlZCBvbiBzZWNvbmQgY2FsbFxuICAgICAgY29uc3RyYWludHMgOiBsaW5rLnByb3BlcnRpZXMuaGFzQ29uc3RyYWludHMgPyB0cnVlIDogZmFsc2UsXG4gICAgICBlbnZpcm9ubWVudGFsIDogbGluay5wcm9wZXJ0aWVzLmhhc0NsaW1hdGUgPyB0cnVlIDogZmFsc2VcbiAgfTtcblxuICB0cnkge1xuXG4gICAgICAvLyBGbG93IHRvIGEgc2lua1xuICAgICAgaWYoIG5vZGVDb2xsZWN0aW9uLmdldEJ5UHJtbmFtZShsaW5rLnByb3BlcnRpZXMudGVybWludXMpICYmXG4gICAgICAgICAgbm9kZUNvbGxlY3Rpb24uZ2V0QnlQcm1uYW1lKGxpbmsucHJvcGVydGllcy50ZXJtaW51cykucHJvcGVydGllcy50eXBlID09ICdTaW5rJyApIHtcbiAgICAgICAgICBsaW5rLnByb3BlcnRpZXMucmVuZGVySW5mby50eXBlID0gJ2Zsb3dUb1NpbmsnO1xuXG4gICAgICB9IGVsc2UgaWYoIGxpbmsucHJvcGVydGllcy50eXBlID09ICdSZXR1cm4gRmxvdycgKSB7XG4gICAgICAgICAgbGluay5wcm9wZXJ0aWVzLnJlbmRlckluZm8udHlwZSA9ICdyZXR1cm5GbG93RnJvbURlbWFuZCc7XG5cbiAgICAgIH0gZWxzZSBpZiAoIGlzR1dUb0RlbWFuZChsaW5rKSApIHtcbiAgICAgICAgICBsaW5rLnByb3BlcnRpZXMucmVuZGVySW5mby50eXBlID0gJ2d3VG9EZW1hbmQnO1xuXG4gICAgICB9IGVsc2UgaWYoIG5vZGVDb2xsZWN0aW9uLmdldEJ5UHJtbmFtZShsaW5rLnByb3BlcnRpZXMub3JpZ2luKSAmJlxuICAgICAgICAgIChub2RlQ29sbGVjdGlvbi5nZXRCeVBybW5hbWUobGluay5wcm9wZXJ0aWVzLm9yaWdpbikucHJvcGVydGllcy5jYWxpYnJhdGlvbk1vZGUgPT0gJ2luJyB8fFxuICAgICAgICAgIG5vZGVDb2xsZWN0aW9uLmdldEJ5UHJtbmFtZShsaW5rLnByb3BlcnRpZXMub3JpZ2luKS5wcm9wZXJ0aWVzLmNhbGlicmF0aW9uTW9kZSA9PSAnYm90aCcpICkge1xuXG4gICAgICAgICAgbGluay5wcm9wZXJ0aWVzLnJlbmRlckluZm8udHlwZSA9ICdhcnRpZmljYWxSZWNoYXJnZSc7XG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgbGluay5wcm9wZXJ0aWVzLnJlbmRlckluZm8udHlwZSA9ICd1bmtub3duJztcbiAgICAgIH1cblxuICB9IGNhdGNoKGUpIHtcbiAgICAgIGRlYnVnZ2VyO1xuICB9XG5cbiAgaWYoICFsaW5rLmdlb21ldHJ5ICkgcmV0dXJuO1xuICBlbHNlIGlmKCAhbGluay5nZW9tZXRyeS5jb29yZGluYXRlcyApIHJldHVybjtcblxuICAvLyBmaW5hbGx5LCBtYXJrIHRoZSBhbmdsZSBvZiB0aGUgbGluZSwgc28gd2UgY2FuIHJvdGF0ZSB0aGUgaWNvbiBvbiB0aGVcbiAgLy8gbWFwIGFjY29yZGluZ2x5XG4gIHZhciB3aWR0aCA9IGxpbmsuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV1bMF0gLSBsaW5rLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdWzBdO1xuICB2YXIgaGVpZ2h0ID0gbGluay5nZW9tZXRyeS5jb29yZGluYXRlc1sxXVsxXSAtIGxpbmsuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF1bMV07XG4gIGxpbmsucHJvcGVydGllcy5yZW5kZXJJbmZvLnJvdGF0ZSA9ICBNYXRoLmF0YW4od2lkdGggLyBoZWlnaHQpICogKDE4MCAvIE1hdGguUEkpO1xufVxuXG5mdW5jdGlvbiBpc0dXVG9EZW1hbmQobGluaykge1xuICAgIHZhciBvcmlnaW4gPSBub2RlQ29sbGVjdGlvbi5nZXRCeVBybW5hbWUobGluay5wcm9wZXJ0aWVzLm9yaWdpbik7XG4gICAgdmFyIHRlcm1pbmFsID0gbm9kZUNvbGxlY3Rpb24uZ2V0QnlQcm1uYW1lKGxpbmsucHJvcGVydGllcy50ZXJtaW5hbCk7XG5cbiAgICBpZiggIW9yaWdpbiB8fCAhdGVybWluYWwgKSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZiggb3JpZ2luLnByb3BlcnRpZXMudHlwZSAhPSAnR3JvdW5kd2F0ZXIgU3RvcmFnZScgKSByZXR1cm4gZmFsc2U7XG4gICAgaWYoIHRlcm1pbmFsLnByb3BlcnRpZXMudHlwZSA9PSAnTm9uLVN0YW5kYXJkIERlbWFuZCcgfHxcbiAgICAgICAgdGVybWluYWwucHJvcGVydGllcy50eXBlID09ICdBZ3JpY3VsdHVyYWwgRGVtYW5kJyB8fFxuICAgICAgICB0ZXJtaW5hbC5wcm9wZXJ0aWVzLnR5cGUgPT0gJ1VyYmFuIERlbWFuZCcgKSByZXR1cm4gdHJ1ZTtcblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc1JlZ2lvbihyZWdpb24pIHtcbiAgICBpZiggcmVnaW9uLnByb3BlcnRpZXMuc3VicmVnaW9ucyApIHtcbiAgICAgIHJlZ2lvbi5wcm9wZXJ0aWVzLnN1YnJlZ2lvbnMuc29ydCgpO1xuICAgIH1cblxuICAgIGlmKCAhcmVnaW9uLmdlb21ldHJ5ICkgcmV0dXJuO1xuXG4gICAgdmFyIHBvbHlzID0gZ2V0WFlQb2x5Z29ucyhyZWdpb24pO1xuXG4gICAgcmVnaW9uLnByb3BlcnRpZXMuc2ltcGxpZmllZCA9IFtdO1xuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgcG9seXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiggcG9seXNbaV0ubGVuZ3RoID4gMTAwICkge1xuICAgICAgICByZWdpb24ucHJvcGVydGllcy5zaW1wbGlmaWVkLnB1c2goTC5MaW5lVXRpbC5zaW1wbGlmeShwb2x5c1tpXSwgMC4wMDEpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZ2lvbi5wcm9wZXJ0aWVzLnNpbXBsaWZpZWQucHVzaChwb2x5c1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVnaW9uLnByb3BlcnRpZXMuY2VudGVyID0gZ2V0Q2VudGVyKHJlZ2lvbi5wcm9wZXJ0aWVzLnNpbXBsaWZpZWRbMF0pO1xuXG4gICAgLy8gdG9kbyBjYWxjIGJib3ggc28gd2Uga25vdyBpZiB3ZSBuZWVkIHRvIHJlbmRlciBnZW9tZXRyeSBvciBub3RcbiAgICBmb3IoIHZhciBpID0gMDsgaSA8IHJlZ2lvbi5wcm9wZXJ0aWVzLnNpbXBsaWZpZWQubGVuZ3RoOyBpKysgKSB7XG4gICAgICBmb3IoIHZhciBqID0gMDsgaiA8IHJlZ2lvbi5wcm9wZXJ0aWVzLnNpbXBsaWZpZWRbaV0ubGVuZ3RoOyBqKysgKSB7XG4gICAgICAgIHJlZ2lvbi5wcm9wZXJ0aWVzLnNpbXBsaWZpZWRbaV1bal0gPSBbcmVnaW9uLnByb3BlcnRpZXMuc2ltcGxpZmllZFtpXVtqXS54LCByZWdpb24ucHJvcGVydGllcy5zaW1wbGlmaWVkW2ldW2pdLnldXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSEFDS1xuICAgIGlmKCBpc05hTihyZWdpb24ucHJvcGVydGllcy5jZW50ZXJbMF0pICkgcmVnaW9uLnByb3BlcnRpZXMuY2VudGVyID0gcmVnaW9uLnByb3BlcnRpZXMuc2ltcGxpZmllZFswXVswXTtcbn1cblxuZnVuY3Rpb24gZ2V0WFlQb2x5Z29ucyhnZW9qc29uKSB7XG4gIHZhciBwb2x5cyA9IFtdLCB0bXAgPSBbXSwgaSwgaiwgcDtcbiAgaWYoIGdlb2pzb24uZ2VvbWV0cnkudHlwZSA9PSAnUG9seWdvbicgKSB7XG4gICAgLy8gd2Ugb25seSBjYXJlIGFib3V0IHRoZSBvdXRlciByaW5nLiAgbm8gaG9sZXMgYWxsb3dlZC5cbiAgICBmb3IoIGkgPSAwOyBpIDwgZ2VvanNvbi5nZW9tZXRyeS5jb29yZGluYXRlc1swXS5sZW5ndGg7IGkrKyApIHtcbiAgICAgIHRtcC5wdXNoKHtcbiAgICAgICAgeCA6IGdlb2pzb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF1baV1bMF0sXG4gICAgICAgIHkgOiBnZW9qc29uLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdW2ldWzFdXG4gICAgICB9KTtcbiAgICB9XG4gICAgcG9seXMucHVzaCh0bXApO1xuXG4gIH0gZWxzZSBpZiggZ2VvanNvbi5nZW9tZXRyeS50eXBlID09ICdNdWx0aVBvbHlnb24nICkge1xuICAgIC8vIHdlIG9ubHkgY2FyZSBhYm91dCB0aGUgb3V0ZXIgcmluZy4gIG5vIGhvbGVzIGFsbG93ZWQuXG4gICAgZm9yKCBpID0gMDsgaSA8IGdlb2pzb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICB0bXAgPSBbXTtcbiAgICAgIHAgPSBnZW9qc29uLmdlb21ldHJ5LmNvb3JkaW5hdGVzW2ldWzBdO1xuXG4gICAgICBmb3IoIGogPSAwOyBqIDwgcC5sZW5ndGg7IGorKyApIHtcbiAgICAgICAgdG1wLnB1c2goe1xuICAgICAgICAgIHggOiBwW2pdWzBdLFxuICAgICAgICAgIHkgOiBwW2pdWzFdXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBwb2x5cy5wdXNoKHRtcCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwb2x5cztcbn1cblxuZnVuY3Rpb24gZ2V0Q2VudGVyKHBvaW50cykge1xuICAgIHZhciBpLCBqLCBsZW4sIHAxLCBwMiwgZiwgYXJlYSwgeCwgeSxcbiAgICAvLyBwb2x5Z29uIGNlbnRyb2lkIGFsZ29yaXRobTsgdXNlcyBhbGwgdGhlIHJpbmdzLCBtYXkgd29ya3MgYmV0dGVyIGZvciBiYW5hbmEgdHlwZSBwb2x5Z29uc1xuXG4gICAgYXJlYSA9IHggPSB5ID0gMDtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHBvaW50cy5sZW5ndGgsIGogPSBsZW4gLSAxOyBpIDwgbGVuOyBqID0gaSsrKSB7XG4gICAgICBwMSA9IHBvaW50c1tpXTtcbiAgICAgIHAyID0gcG9pbnRzW2pdO1xuXG4gICAgICBmID0gcDEueSAqIHAyLnggLSBwMi55ICogcDEueDtcbiAgICAgIHggKz0gKHAxLnggKyBwMi54KSAqIGY7XG4gICAgICB5ICs9IChwMS55ICsgcDIueSkgKiBmO1xuICAgIH1cblxuICAgIGYgPSBnZXRBcmVhKHBvaW50cykgKiA2O1xuICAgIHJldHVybiBbLTEgKiAoeCAvIGYpLCAtMSAqICh5IC8gZildO1xufVxuXG4vKiogaGVscGVyIGZvciBwcm9jZXNzaW5nIHJlZ2lvbiBjZW50ZXIgKiovXG5mdW5jdGlvbiBnZXRBcmVhKHBvaW50cyl7XG4gICAgdmFyIGFyZWEgPSAwO1xuICAgIHZhciBsZW5ndGhQb2ludHMgPSBwb2ludHMubGVuZ3RoO1xuICAgIHZhciBqID0gbGVuZ3RoUG9pbnRzIC0gMTtcbiAgICB2YXIgcDE7IHZhciBwMjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aFBvaW50czsgaiA9IGkrKykge1xuICAgICAgICBwMSA9IHBvaW50c1tpXTsgcDIgPSBwb2ludHNbal07XG4gICAgICAgIGFyZWEgKz0gcDEueCAqIHAyLnk7XG4gICAgICAgIGFyZWEgLT0gcDEueSAqIHAyLng7XG4gICAgfVxuICAgIGFyZWEgLz0gMjtcbiAgICByZXR1cm4gYXJlYTtcbn1cblxudmFyIGFwaSA9IHtcbiAgbG9hZGluZyA6IHRydWUsXG4gIGxvYWQ6IGxvYWROZXR3b3JrLFxuICBvbiA6IGZ1bmN0aW9uKGV2dCwgZm4pIHtcbiAgICAgIGV2ZW50cy5vbihldnQsIGZuKTtcbiAgfSxcbiAgb25Mb2FkIDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHRoaXMub24oJ2xvYWRpbmctY29tcGxldGUnLCBjYWxsYmFjayk7XG5cbiAgICAgIGlmKCB0aGlzLmxvYWRpbmcgKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjYWxsYmFjaygpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBpOyIsIlxucmVxdWlyZSgnLi9zaWdtYS1jd24tcGx1Z2luJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb2xsZWN0aW9ucyA6IHJlcXVpcmUoJy4vY29sbGVjdGlvbnMnKSxcbiAgY29udHJvbGxlcnMgOiByZXF1aXJlKCcuL2NvbnRyb2xsZXJzJyksXG4gIG1hcCA6IHJlcXVpcmUoJy4vbWFwJyksXG4gIHJlbmRlcmVyIDogcmVxdWlyZSgnLi9yZW5kZXJlcicpLFxuICBjaGFydExvYWRIYW5kbGVycyA6IHJlcXVpcmUoJy4vY2hhcnRzJylcbn0iLCJ2YXIgYmVoYXZpb3IgPSB7XG4gIG9uTGF5ZXJDbGljayA6IGZ1bmN0aW9uKGZlYXR1cmVzLCBlKSB7XG4gICAgaWYoIGZlYXR1cmVzLmxlbmd0aCA9PSAwICkgcmV0dXJuO1xuXG4gICAgdmFyIHR5cGUgPSBmZWF0dXJlc1swXS5nZW9qc29uLmdlb21ldHJ5LnR5cGU7XG5cbiAgICBpZiggZmVhdHVyZXMubGVuZ3RoID09IDEgJiYgdHlwZSA9PSAnUG9seWdvbicgfHwgdHlwZSA9PSAnTXVsdGlQb2x5Z29uJyApIHtcbiAgICAgIGlmKCB0aGlzLnNoaWZ0UGVzc2VkICkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcjaW5mby8nICsgZmVhdHVyZXNbMF0uZ2VvanNvbi5wcm9wZXJ0aWVzLm5hbWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYoICFmZWF0dXJlc1swXS5nZW9qc29uLnByb3BlcnRpZXMuX3JlbmRlciApIGZlYXR1cmVzWzBdLmdlb2pzb24ucHJvcGVydGllcy5fcmVuZGVyID0ge307XG4gICAgICBmZWF0dXJlc1swXS5nZW9qc29uLnByb3BlcnRpZXMuX3JlbmRlci5ob3ZlciA9IHRydWU7XG4gICAgICB0aGlzLm1hcmtlckxheWVyLnJlbmRlcigpO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMub25SZWdpb25DbGljayhmZWF0dXJlc1swXS5nZW9qc29uLnByb3BlcnRpZXMuaG9iYmVzLmlkKTtcblxuICAgICAgICBmZWF0dXJlc1swXS5nZW9qc29uLnByb3BlcnRpZXMuX3JlbmRlci5ob3ZlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1hcmtlckxheWVyLnJlbmRlcigpO1xuXG4gICAgICB9LmJpbmQodGhpcyksIDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKCBmZWF0dXJlcy5sZW5ndGggPT0gMSAmJiBmZWF0dXJlc1swXS5nZW9qc29uLnByb3BlcnRpZXMucHJtbmFtZSApIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJyNpbmZvLycgKyBmZWF0dXJlc1swXS5nZW9qc29uLnByb3BlcnRpZXMucHJtbmFtZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdG9yLm9uQ2xpY2soZmVhdHVyZXMpO1xuICB9LFxuXG4gIG9uTGF5ZXJNb3VzZU1vdmUgOiBmdW5jdGlvbihmZWF0dXJlcywgZSkge1xuICAgIHZhciBsYWJlbCA9IFtdLCBsaW5rTGFiZWwgPSAnJywgcmVnaW9uTGFiZWwgPSAnJztcbiAgICB2YXIgaSwgZjtcblxuICAgIGZvciggaSA9IDA7IGkgPCBmZWF0dXJlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGYgPSBmZWF0dXJlc1tpXS5nZW9qc29uLnByb3BlcnRpZXM7XG5cbiAgICAgIGlmKCBmLnR5cGUgPT0gJ0RpdmVyc2lvbicgfHwgZi50eXBlID09ICdSZXR1cm4gRmxvdycgKSBsYWJlbC5wdXNoKGYudHlwZSsnIDxiPicrZi5wcm1uYW1lKyc8L2I+Jyk7XG4gICAgICBlbHNlIGlmKCBmLnR5cGUgPT0gJ0xpbmsgR3JvdXAnICkgbGFiZWwucHVzaChmLnR5cGUrJyA8Yj5Db3VudDogJytmLmxpbmVzLmxlbmd0aCsnPC9iPicpO1xuICAgICAgZWxzZSBpZiAoIGYudHlwZSA9PSAnUmVnaW9uJyApIGxhYmVsLnB1c2goZi50eXBlKycgPGI+JytmLm5hbWUrJzwvYj4nKTtcbiAgICAgIGVsc2UgbGFiZWwucHVzaChmLnR5cGUrJyA8Yj4nK2YucHJtbmFtZSsnPC9iPicpO1xuICAgIH1cblxuICAgIGlmKCBmZWF0dXJlcy5sZW5ndGggPiAwICkge1xuICAgICAgdGhpcy5zaG93SG92ZXJMYWJlbCh0cnVlLCBsYWJlbC5qb2luKCc8YnIgLz4nKSwgZS5jb250YWluZXJQb2ludCk7XG4gICAgICB0aGlzLiQubGVhZmxldC5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvd0hvdmVyTGFiZWwoZmFsc2UpO1xuICAgICAgdGhpcy4kLmxlYWZsZXQuc3R5bGUuY3Vyc29yID0gJy13ZWJraXQtZ3JhYic7XG4gICAgfVxuICB9LFxuXG4gIG9uTGF5ZXJNb3VzZU92ZXIgOiBmdW5jdGlvbihmZWF0dXJlcywgZSkge1xuICAgIHZhciBpLCBmO1xuXG4gICAgZm9yKCBpID0gMDsgaSA8IGZlYXR1cmVzLmxlbmd0aDsgaSsrICkge1xuICAgICAgZiA9IGZlYXR1cmVzW2ldLmdlb2pzb24ucHJvcGVydGllcztcblxuICAgICAgaWYoICFmLl9yZW5kZXIgKSBmLl9yZW5kZXIgPSB7fTtcbiAgICAgIGYuX3JlbmRlci5ob3ZlciA9IHRydWU7XG4gICAgfVxuICB9LFxuXG4gIG9uTGF5ZXJNb3VzZU91dCA6IGZ1bmN0aW9uKGZlYXR1cmVzKSB7XG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBmZWF0dXJlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGlmKCAhZmVhdHVyZXNbaV0uZ2VvanNvbi5wcm9wZXJ0aWVzLl9yZW5kZXIgKSBmZWF0dXJlc1tpXS5nZW9qc29uLnByb3BlcnRpZXMuX3JlbmRlciA9IHt9O1xuICAgICAgZmVhdHVyZXNbaV0uZ2VvanNvbi5wcm9wZXJ0aWVzLl9yZW5kZXIuaG92ZXIgPSBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgc2hvd0hvdmVyTGFiZWwgOiBmdW5jdGlvbihzaG93LCBsYWJlbCwgcG9zKSB7XG4gICAgaWYoIHNob3cgKSB7XG4gICAgICB0aGlzLiQuaG92ZXJMYWJlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHRoaXMuJC5ob3ZlckxhYmVsLnN0eWxlLmxlZnQgPSAocG9zLngrMTApKydweCc7XG4gICAgICB0aGlzLiQuaG92ZXJMYWJlbC5zdHlsZS50b3AgPSAocG9zLnkrMTApKydweCc7XG4gICAgICB0aGlzLiQuaG92ZXJMYWJlbC5pbm5lckhUTUwgPSBsYWJlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kLmhvdmVyTGFiZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcjsiLCJ2YXIgY29sbGVjdGlvbiA9IHJlcXVpcmUoJy4uL2NvbGxlY3Rpb25zL25vZGVzJyk7XG5cbi8vIG1hcmtlciBub2RlcyB0aGF0IGFyZSBsaW5rZWQgdG8gYSB2aXNpYmxlIG5vZGUgd2l0aCB0aGUgJ25vZGVTdGVwJyBhdHRyaWJ1dGVcbnZhciBiZWhhdmlvciA9IHtcbiAgICBmaWx0ZXIgOiBmdW5jdGlvbihtYXBGaWx0ZXJzKSB7XG4gICAgICAgIHZhciByZSwgaSwgZCwgZDIsIGQzLCBpZDtcbiAgICAgICAgLy8gdGhyZWUgbG9vcHMsIGZpcnN0IG1hcmsgbm9kZXMgdGhhdCBtYXRjaCwgdGhlbiBtYXJrIG9uZSBzdGVwIG5vZGVzXG4gICAgICAgIC8vIGZpbmFsbHkgbWFyayBsaW5rcyB0byBoaWRlIGFuZCBzaG93XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZSA9IG5ldyBSZWdFeHAoJy4qJyttYXBGaWx0ZXJzLnRleHQudG9Mb3dlckNhc2UoKSsnLionKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgZm9yKCBpID0gMDsgaSA8IGNvbGxlY3Rpb24ubm9kZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBkID0gY29sbGVjdGlvbi5ub2Rlc1tpXTtcblxuICAgICAgICAgICAgaWYoICFkLnByb3BlcnRpZXMuX3JlbmRlciApIHtcbiAgICAgICAgICAgICAgICBkLnByb3BlcnRpZXMuX3JlbmRlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyX2lkIDogZC5wcm9wZXJ0aWVzLnR5cGUucmVwbGFjZSgnICcsJ18nKS5yZXBsYWNlKCctJywnXycpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiggbWFwRmlsdGVyc1tkLnByb3BlcnRpZXMuX3JlbmRlci5maWx0ZXJfaWRdICYmIGlzVGV4dE1hdGNoKHJlLCBkLnByb3BlcnRpZXMsIG1hcEZpbHRlcnMpICkge1xuICAgICAgICAgICAgICAgIGlmKCAhY2hlY2tTaW5rTW9kZShtYXBGaWx0ZXJzLmluZmxvd1NpbmtNb2RlLCAgZC5wcm9wZXJ0aWVzKSApIHtcbiAgICAgICAgICAgICAgICAgICAgZC5wcm9wZXJ0aWVzLl9yZW5kZXIuc2hvdyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGQucHJvcGVydGllcy5fcmVuZGVyLnNob3cgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZC5wcm9wZXJ0aWVzLl9yZW5kZXIuc2hvdyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm93IG1hcmsgbGlua3MgdGhhdCBzaG91bGQgYmUgc2hvd1xuICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IGNvbGxlY3Rpb24ubGlua3MubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBkID0gY29sbGVjdGlvbi5saW5rc1tpXTtcbiAgICAgICAgICAgIGQyID0gY29sbGVjdGlvbi5nZXRCeVBybW5hbWUoZC5wcm9wZXJ0aWVzLm9yaWdpbik7XG4gICAgICAgICAgICBkMyA9IGNvbGxlY3Rpb24uZ2V0QnlQcm1uYW1lKGQucHJvcGVydGllcy50ZXJtaW51cyk7XG5cbiAgICAgICAgICAgIGNoZWNrUmVuZGVyTnMoZCk7XG4gICAgICAgICAgICBjaGVja1JlbmRlck5zKGQyKTtcbiAgICAgICAgICAgIGNoZWNrUmVuZGVyTnMoZDMpO1xuXG4gICAgICAgICAgICBpZiggZDIgJiYgZDMgJiZcbiAgICAgICAgICAgICAgICAoZDIucHJvcGVydGllcy5fcmVuZGVyLnNob3cgfHwgKG1hcEZpbHRlcnMub25lU3RlcE1vZGUgJiYgZDIucHJvcGVydGllcy5fcmVuZGVyLm9uZVN0ZXApICkgJiZcbiAgICAgICAgICAgICAgICAoZDMucHJvcGVydGllcy5fcmVuZGVyLnNob3cgfHwgKG1hcEZpbHRlcnMub25lU3RlcE1vZGUgJiYgZDMucHJvcGVydGllcy5fcmVuZGVyLm9uZVN0ZXApICkgJiZcbiAgICAgICAgICAgICAgICAhKGQyLnByb3BlcnRpZXMuX3JlbmRlci5vbmVTdGVwICYmIGQzLnByb3BlcnRpZXMuX3JlbmRlci5vbmVTdGVwICkgKSB7XG4gICAgICAgICAgICAgICAgZC5wcm9wZXJ0aWVzLl9yZW5kZXIuc2hvdyA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGQucHJvcGVydGllcy5fcmVuZGVyLnNob3cgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tSZW5kZXJOcyhub2RlKSB7XG4gIGlmKCAhbm9kZSApIHJldHVybjtcbiAgaWYoICFub2RlLnByb3BlcnRpZXMuX3JlbmRlciApIHtcbiAgICBub2RlLnByb3BlcnRpZXMuX3JlbmRlciA9IHt9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzVGV4dE1hdGNoKHJlLCBwcm9wcywgbWFwRmlsdGVycykge1xuICAgIGlmKCBtYXBGaWx0ZXJzLnRleHQgPT0gJycgfHwgIXJlICkgcmV0dXJuIHRydWU7XG5cbiAgICBpZiggcmUudGVzdChwcm9wcy5wcm1uYW1lLnRvTG93ZXJDYXNlKCkpICkgcmV0dXJuIHRydWU7XG4gICAgaWYoIHByb3BzLmRlc2NyaXB0aW9uICYmIHJlLnRlc3QocHJvcHMuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKSkgKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNoZWNrU2lua01vZGUoaW5mbG93U2lua01vZGUsICBwcm9wZXJ0aWVzKSB7XG4gIGlmKCAhaW5mbG93U2lua01vZGUgKSB7XG4gICAgcHJvcGVydGllcy5fcmVuZGVyLnN0cm9rZSA9IG51bGw7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiggcHJvcGVydGllcy5leHRyYXMgKSB7XG4gICAgaWYoIHByb3BlcnRpZXMuZXh0cmFzLmluZmxvd3MgKSB7XG4gICAgICBwcm9wZXJ0aWVzLl9yZW5kZXIuc3Ryb2tlID0gJ2dyZWVuJztcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiggcHJvcGVydGllcy5leHRyYXMuc2lua3MgKSB7XG4gICAgICBwcm9wZXJ0aWVzLl9yZW5kZXIuc3Ryb2tlID0gJ3JlZCc7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwcm9wZXJ0aWVzLl9yZW5kZXIuc3Ryb2tlID0gbnVsbDtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICByZW5kZXJlciA6IHJlcXVpcmUoJy4vcmVuZGVyZXInKSxcbiAgbGVnZW5kIDogcmVxdWlyZSgnLi9yZW5kZXJlci9sZWdlbmQnKSxcbiAgRmlsdGVyQmVoYXZpb3IgOiByZXF1aXJlKCcuL2ZpbHRlcicpLFxuICBSZW5kZXJTdGF0ZUJlaGF2aW9yIDogcmVxdWlyZSgnLi9yZW5kZXItc3RhdGUnKSxcbiAgQ2FudmFzTGF5ZXJCZWhhdmlvciA6IHJlcXVpcmUoJy4vY2FudmFzLWxheWVyLWV2ZW50cycpXG59IiwidmFyIGNvbGxlY3Rpb25zID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMnKTtcbnZhciByZW5kZXJlciA9IHJlcXVpcmUoJy4vcmVuZGVyZXInKTtcblxudmFyIGJlaGF2aW9yID0ge1xuICB1cGRhdGVSZW5kZXJTdGF0ZSA6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVuZGVyU3RhdGUgPSB7XG4gICAgICBwb2ludHMgOiBbXSxcbiAgICAgIGxpbmVzIDogW10sXG4gICAgICBwb2x5Z29ucyA6IFtdXG4gICAgfVxuICAgIHRoaXMuY2xlYXJSZWdpb25MaW5rcygpO1xuXG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyU3RhdGUoJ0NhbGlmb3JuaWEnKTtcblxuICAgIHZhciBmID0gbnVsbCwgcmVuZGVyO1xuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGhpcy5tYXJrZXJMYXllci5mZWF0dXJlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGYgPSB0aGlzLm1hcmtlckxheWVyLmZlYXR1cmVzW2ldO1xuICAgICAgciA9IGYuZ2VvanNvbi5wcm9wZXJ0aWVzLl9yZW5kZXIgfHwge307XG5cbiAgICAgIGlmKCAodGhpcy5yZW5kZXJTdGF0ZS5wb2ludHMuaW5kZXhPZihmLmlkKSA+IC0xIHx8XG4gICAgICAgIHRoaXMucmVuZGVyU3RhdGUubGluZXMuaW5kZXhPZihmLmlkKSA+IC0xIHx8XG4gICAgICAgIHRoaXMucmVuZGVyU3RhdGUucG9seWdvbnMuaW5kZXhPZihmLmlkKSA+IC0xKSAmJlxuICAgICAgICByLnNob3cgIT09IGZhbHNlICkge1xuXG4gICAgICAgICAgZi52aXNpYmxlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGYudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubWFya2VyTGF5ZXIucmVuZGVyKCk7XG4gIH0sXG5cbiAgX3VwZGF0ZVJlbmRlclN0YXRlIDogZnVuY3Rpb24oaWQpIHtcbiAgICB2YXIgcmVnaW9uID0gY29sbGVjdGlvbnMucmVnaW9ucy5nZXRCeUlkKGlkKTtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLm1lbnUuc3RhdGU7XG5cbiAgICBpZiggc3RhdGUuZW5hYmxlZC5pbmRleE9mKGlkKSA+IC0xICkge1xuICAgICAgdmFyIGNoaWxkTm9kZXMgPSBjb2xsZWN0aW9ucy5ub2Rlcy5nZXRCeVJlZ2lvbihyZWdpb24ucHJvcGVydGllcy5ob2JiZXMuaWQpO1xuICAgICAgdGhpcy5fYWRkU3RhdGVOb2RlcyhjaGlsZE5vZGVzLCBzdGF0ZSk7XG5cbiAgICAgIHZhciBjaGlsZHJlbiA9IGNvbGxlY3Rpb25zLnJlZ2lvbnMuZ2V0QnlSZWdpb24ocmVnaW9uLnByb3BlcnRpZXMuaG9iYmVzLmlkKTtcbiAgICAgIGlmKCBjaGlsZHJlbi5sZW5ndGggPT09IDAgKSByZXR1cm47XG5cbiAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVJlbmRlclN0YXRlKGNoaWxkcmVuW2ldLnByb3BlcnRpZXMuaG9iYmVzLmlkKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuXG4gICAgICBpZiggbmFtZSAhPSAnQ2FsaWZvcm5pYScgKSB0aGlzLnJlbmRlclN0YXRlLnBvbHlnb25zLnB1c2gocmVnaW9uLnByb3BlcnRpZXMuaG9iYmVzLmlkKTtcbiAgICB9XG4gIH0sXG5cbiAgX2FkZFN0YXRlTm9kZXMgOiBmdW5jdGlvbihub2Rlcywgc3RhdGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBmaW5kIGZpcnN0IHJlZ2lvbiBhbmQgaW5zZXJ0IGFmdGVyXG4gICAgdmFyIGluZGV4ID0gMCwgdHlwZTtcbiAgICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMubWFya2VyTGF5ZXIuZmVhdHVyZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICB0eXBlID0gdGhpcy5tYXJrZXJMYXllci5mZWF0dXJlc1tpXS5nZW9qc29uLmdlb21ldHJ5LnR5cGU7XG4gICAgICBpZiggdHlwZSAhPSAnUG9seWdvbicgJiYgdHlwZSAhPSAnTXVsdGlQb2x5Z29uJyApIHtcbiAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IoIHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrICkge1xuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcblxuICAgICAgdmFyIHJlbmRlciA9IG5vZGUucHJvcGVydGllcy5fcmVuZGVyIHx8IHt9O1xuICAgICAgaWYoIHJlbmRlci5zaG93ID09PSBmYWxzZSApIGNvbnRpbnVlO1xuXG4gICAgICBpZiggbm9kZS5wcm9wZXJ0aWVzLmhvYmJlcy50eXBlID09PSAnbGluaycgKSB7XG4gICAgICAgIHZhciB0ZXJtaW5hbCA9IHRoaXMuX2dldFN0YXRlTm9kZUxvY2F0aW9uKG5vZGUucHJvcGVydGllcy50ZXJtaW51cywgc3RhdGUpO1xuICAgICAgICB2YXIgb3JpZ2luID0gdGhpcy5fZ2V0U3RhdGVOb2RlTG9jYXRpb24obm9kZS5wcm9wZXJ0aWVzLm9yaWdpbiwgc3RhdGUpO1xuXG4gICAgICAgIGlmKCAhdGVybWluYWwgfHwgIW9yaWdpbiApIGNvbnRpbnVlO1xuXG4gICAgICAgIHZhciBsaW5lRmVhdHVyZTtcbiAgICAgICAgaWYoIHRlcm1pbmFsLmlzTm9kZSAmJiBvcmlnaW4uaXNOb2RlICkge1xuICAgICAgICAgIGxpbmVGZWF0dXJlID0gdGhpcy5jcmVhdGVOb2RlTGluayhvcmlnaW4uY2VudGVyLCB0ZXJtaW5hbC5jZW50ZXIsIG5vZGUsIGluZGV4KTtcbiAgICAgICAgICB0aGlzLmN1c3RvbUxpbmVzW25vZGUucHJvcGVydGllcy5vcmlnaW4rJ18nK25vZGUucHJvcGVydGllcy50ZXJtaW51c10gPSBsaW5lRmVhdHVyZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBpZiB0aGlzIGxpbmUgYWxyZWFkeSBleGlzdHMsIGEgbnVsbCB2YWx1ZSB3aWxsIGJlIHJldHVybmVkXG4gICAgICAgICAgbGluZUZlYXR1cmUgPSB0aGlzLmNyZWF0ZVJlZ2lvbkxpbmsob3JpZ2luLCB0ZXJtaW5hbCwgbm9kZSwgaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIGxpbmVGZWF0dXJlICkge1xuICAgICAgICAgIHRoaXMucmVuZGVyU3RhdGUubGluZXMucHVzaChsaW5lRmVhdHVyZS5nZW9qc29uLnByb3BlcnRpZXMuaG9iYmVzLmlkKTtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbmRlclN0YXRlLnBvaW50cy5wdXNoKG5vZGUucHJvcGVydGllcy5ob2JiZXMuaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBjcmVhdGVOb2RlTGluayA6IGZ1bmN0aW9uKG9yaWdpbiwgdGVybWluYWwsIG5vZGUsIGluZGV4KSB7XG4gICAgdmFyIGxpbmsgPSB7XG4gICAgICBnZW9qc29uIDoge1xuICAgICAgICBcInR5cGVcIiA6IFwiRmVhdHVyZVwiLFxuICAgICAgICBcImdlb21ldHJ5XCIgOiB7XG4gICAgICAgICAgXCJ0eXBlXCIgOiBcIkxpbmVTdHJpbmdcIixcbiAgICAgICAgICBjb29yZGluYXRlcyA6IFtvcmlnaW4sIHRlcm1pbmFsXVxuICAgICAgICB9LFxuICAgICAgICBwcm9wZXJ0aWVzIDogJC5leHRlbmQodHJ1ZSwge30sIG5vZGUucHJvcGVydGllcylcbiAgICAgIH0sXG4gICAgICByZW5kZXJlciA6IHJlbmRlcmVyXG4gICAgfTtcbiAgICBcbiAgICB0aGlzLm1hcmtlckxheWVyLmFkZENhbnZhc0ZlYXR1cmUobmV3IEwuQ2FudmFzRmVhdHVyZShsaW5rLCBsaW5rLmdlb2pzb24ucHJvcGVydGllcy5ob2JiZXMuaWQpLCBpbmRleCk7XG5cbiAgICByZXR1cm4gbGluaztcbiAgfSxcblxuICBjcmVhdGVSZWdpb25MaW5rIDogZnVuY3Rpb24ob3JpZ2luLCB0ZXJtaW5hbCwgbm9kZSwgaW5kZXgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGZlYXR1cmUgPSBudWxsO1xuICAgIGlmKCB0aGlzLmN1c3RvbUxpbmVzW29yaWdpbi5uYW1lKydfJyt0ZXJtaW5hbC5uYW1lXSApIHtcbiAgICAgIGZlYXR1cmUgPSB0aGlzLmN1c3RvbUxpbmVzW29yaWdpbi5uYW1lKydfJyt0ZXJtaW5hbC5uYW1lXTtcbiAgICB9IGVsc2UgaWYgKCB0aGlzLmN1c3RvbUxpbmVzW3Rlcm1pbmFsLm5hbWUrJ18nK29yaWdpbi5uYW1lXSApIHtcbiAgICAgIGZlYXR1cmUgPSB0aGlzLmN1c3RvbUxpbmVzW3Rlcm1pbmFsLm5hbWUrJ18nK29yaWdpbi5uYW1lXTtcbiAgICB9XG5cbiAgICBpZiggIWZlYXR1cmUgKSB7XG4gICAgICBmZWF0dXJlID0ge1xuICAgICAgICBnZW9qc29uIDoge1xuICAgICAgICAgIFwidHlwZVwiIDogXCJGZWF0dXJlXCIsXG4gICAgICAgICAgXCJnZW9tZXRyeVwiIDoge1xuICAgICAgICAgICAgXCJ0eXBlXCIgOiBcIkxpbmVTdHJpbmdcIixcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzIDogW29yaWdpbi5jZW50ZXIsIHRlcm1pbmFsLmNlbnRlcl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHByb3BlcnRpZXMgOiB7XG4gICAgICAgICAgICBob2JiZXMgOiB7XG4gICAgICAgICAgICAgIGlkIDogb3JpZ2luLm5hbWUrJy0tJyt0ZXJtaW5hbC5uYW1lLFxuICAgICAgICAgICAgICB0eXBlIDogJ2xpbmsnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJtbmFtZSA6IG9yaWdpbi5uYW1lKyctLScrdGVybWluYWwubmFtZSxcbiAgICAgICAgICAgIHR5cGUgOiAnUmVnaW9uIExpbmsnLFxuICAgICAgICAgICAgbGluZXMgOiBbJC5leHRlbmQodHJ1ZSwge30sIG5vZGUucHJvcGVydGllcyldLFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyZXIgOiByZW5kZXJlclxuICAgICAgfVxuXG4gICAgICB0aGlzLmN1c3RvbUxpbmVzW29yaWdpbi5uYW1lKydfJyt0ZXJtaW5hbC5uYW1lXSA9IGZlYXR1cmU7XG4gICAgICB0aGlzLm1hcmtlckxheWVyLmFkZENhbnZhc0ZlYXR1cmUobmV3IEwuQ2FudmFzRmVhdHVyZShmZWF0dXJlLCBmZWF0dXJlLmdlb2pzb24ucHJvcGVydGllcy5ob2JiZXMuaWQpLCBpbmRleCk7XG5cbiAgICAgIHJldHVybiBmZWF0dXJlO1xuICAgIH1cblxuICAgIGZlYXR1cmUuZ2VvanNvbi5wcm9wZXJ0aWVzLmxpbmVzLnB1c2goJC5leHRlbmQodHJ1ZSwge30sIG5vZGUucHJvcGVydGllcykpO1xuICB9LFxuXG4gIGNsZWFyUmVnaW9uTGlua3MgOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcHJvcGVydGllcztcbiAgICBmb3IoIHZhciBpID0gdGhpcy5tYXJrZXJMYXllci5mZWF0dXJlcy5sZW5ndGgtMTsgaSA+PSAwOyBpLS0gKSB7XG4gICAgICBwcm9wZXJ0aWVzID0gdGhpcy5tYXJrZXJMYXllci5mZWF0dXJlc1tpXS5nZW9qc29uLnByb3BlcnRpZXM7XG4gICAgICBpZiggcHJvcGVydGllcy5ob2JiZXMudHlwZSA9PT0gJ2xpbmsnICkge1xuICAgICAgICB0aGlzLm1hcmtlckxheWVyLmZlYXR1cmVzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm1hcmtlckxheWVyLnJlYnVpbGRJbmRleCh0aGlzLm1hcmtlckxheWVyLmZlYXR1cmVzKTtcbiAgICB0aGlzLmN1c3RvbUxpbmVzID0ge307XG4gIH0sXG5cbiAgX2dldFN0YXRlTm9kZUxvY2F0aW9uIDogZnVuY3Rpb24obmFtZSwgc3RhdGUpIHtcbiAgICB2YXIgbm9kZSA9IGNvbGxlY3Rpb25zLm5vZGVzLmdldEJ5UHJtbmFtZShuYW1lKTtcblxuICAgIGlmKCAhbm9kZSApIHJldHVybiBudWxsO1xuXG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBub2RlLnByb3BlcnRpZXMuaG9iYmVzLnJlZ2lvbnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiggc3RhdGUuZGlzYWJsZWQuaW5kZXhPZihub2RlLnByb3BlcnRpZXMuaG9iYmVzLnJlZ2lvbnNbaV0pID4gLTEgKSB7XG4gICAgICAgIGlmKCBjb2xsZWN0aW9ucy5yZWdpb25zLmdldEJ5SWQobm9kZS5wcm9wZXJ0aWVzLmhvYmJlcy5yZWdpb25zW2ldKS5wcm9wZXJ0aWVzLmNlbnRlciApIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2VudGVyOiBjb2xsZWN0aW9ucy5yZWdpb25zLmdldEJ5SWQobm9kZS5wcm9wZXJ0aWVzLmhvYmJlcy5yZWdpb25zW2ldKS5wcm9wZXJ0aWVzLmNlbnRlcixcbiAgICAgICAgICAgIG5hbWU6IG5vZGUucHJvcGVydGllcy5ob2JiZXMucmVnaW9uc1tpXSxcbiAgICAgICAgICAgIGlzUmVnaW9uIDogdHJ1ZVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY2VudGVyIDogbm9kZS5nZW9tZXRyeS5jb29yZGluYXRlcyB8fCBbMCwwXSxcbiAgICAgIG5hbWUgOiBuYW1lLFxuICAgICAgaXNOb2RlIDogdHJ1ZVxuICAgIH1cbiAgfSxcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcjsiLCJ2YXIgcmVuZGVyVXRpbHMgPSByZXF1aXJlKCcuLi8uLi9yZW5kZXJlcicpO1xudmFyIGNvbGxlY3Rpb24gPSByZXF1aXJlKCcuLi8uLi9jb2xsZWN0aW9ucy9ub2RlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0eCwgeHlQb2ludHMsIG1hcCwgZmVhdHVyZSkge1xuICB2YXIgcmVuZGVyID0gZmVhdHVyZS5nZW9qc29uLnByb3BlcnRpZXMuX3JlbmRlciB8fCB7fTtcblxuICBpZiggZmVhdHVyZS5nZW9qc29uLmdlb21ldHJ5LnR5cGUgPT0gJ1BvaW50JyApIHtcbiAgICByZW5kZXJCYXNpY1BvaW50KGN0eCwgeHlQb2ludHMsIG1hcCwgZmVhdHVyZSwgcmVuZGVyKTtcbiAgfSBlbHNlIGlmICggZmVhdHVyZS5nZW9qc29uLmdlb21ldHJ5LnR5cGUgPT0gJ0xpbmVTdHJpbmcnICkge1xuICAgIGlmKCBmZWF0dXJlLmdlb2pzb24ucHJvcGVydGllcy50eXBlID09PSAnUmVnaW9uIExpbmsnICkge1xuICAgICAgcmVuZGVyUmVnaW9uTGluZShjdHgsIHh5UG9pbnRzLCBtYXAsIGZlYXR1cmUsIHJlbmRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlbmRlckJhc2ljTGluZShjdHgsIHh5UG9pbnRzLCBtYXAsIGZlYXR1cmUsIHJlbmRlcik7XG4gICAgfVxuICB9IGVsc2UgaWYgKCBmZWF0dXJlLmdlb2pzb24uZ2VvbWV0cnkudHlwZSA9PSAnUG9seWdvbicgKSB7XG4gICAgcmVuZGVyQmFzaWNQb2x5Z29uKGN0eCwgeHlQb2ludHMsIG1hcCwgZmVhdHVyZSwgcmVuZGVyKTtcbiAgfSBlbHNlIGlmICggZmVhdHVyZS5nZW9qc29uLmdlb21ldHJ5LnR5cGUgPT0gJ011bHRpUG9seWdvbicgKSB7XG4gICAgLy9kZWJ1Z2dlcjtcbiAgICB4eVBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uKHBvaW50cyl7XG4gICAgICByZW5kZXJCYXNpY1BvbHlnb24oY3R4LCBwb2ludHMsIG1hcCwgZmVhdHVyZSwgcmVuZGVyKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJSZWdpb25MaW5lKGN0eCwgeHlQb2ludHMsIG1hcCwgZmVhdHVyZSwgcmVuZGVyKSB7XG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4LnN0cm9rZVN0eWxlID0gcmVuZGVyVXRpbHMuY29sb3JzLm9yYW5nZTtcbiAgY3R4LmxpbmVXaWR0aCA9IDI7XG4gIGN0eC5tb3ZlVG8oeHlQb2ludHNbMF0ueCwgeHlQb2ludHNbMF0ueSk7XG4gIGN0eC5saW5lVG8oeHlQb2ludHNbMV0ueCwgeHlQb2ludHNbMV0ueSk7XG4gIGN0eC5zdHJva2UoKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQmFzaWNQb2ludChjdHgsIHh5UG9pbnRzLCBtYXAsIGZlYXR1cmUsIHJlbmRlcikge1xuICBvID0gcmVuZGVyLm9uZVN0ZXAgPyAuMyA6IC43O1xuXG4gIHJlbmRlci5wb2ludCA9IHh5UG9pbnRzO1xuICBtcyA9IChmZWF0dXJlLnNpemUgfHwgMjApICogKHJlbmRlci5tdWx0aXBpZXIgfHwgMSk7XG4gIGJ1ZmZlciA9IG1zIC8gMjtcblxuICAvLyBUT0RPOiBzZXQgZmVhdHVyZS5zaXplIGFuZCB5b3Ugd2FudCBoYXZlIHRvIHdvcnJ5IGFib3V0IC0xMCBvZmZzZXQgaGVyZVxuICByZW5kZXJVdGlsc1tmZWF0dXJlLmdlb2pzb24ucHJvcGVydGllcy50eXBlXShjdHgsIHtcbiAgICAgIHg6IHh5UG9pbnRzLnggLSAxMCxcbiAgICAgIHk6IHh5UG9pbnRzLnkgLSAxMCxcbiAgICAgIHdpZHRoOiBtcyxcbiAgICAgIGhlaWdodDogbXMsXG4gICAgICBvcGFjaXR5OiBvLFxuICAgICAgZmlsbCA6IHJlbmRlci5maWxsLFxuICAgICAgc3Ryb2tlIDogcmVuZGVyLnN0cm9rZSxcbiAgICAgIGxpbmVXaWR0aCA6IHJlbmRlci5saW5lV2lkdGgsXG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZW5kZXJCYXNpY0xpbmUoY3R4LCB4eVBvaW50cywgbWFwLCBmZWF0dXJlLCByZW5kZXIpIHtcbiAgY29sb3IgPSAnd2hpdGUnO1xuICBpZiggcmVuZGVyLmhpZ2hsaWdodCApIHtcbiAgICAgIGlmKCByZW5kZXIuaGlnaGxpZ2h0ID09ICdvcmlnaW4nICkgY29sb3IgPSAnZ3JlZW4nO1xuICAgICAgZWxzZSBjb2xvciA9ICdyZWQnO1xuICB9XG5cbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgY3R4LmxpbmVXaWR0aCA9IDQ7XG4gIGN0eC5tb3ZlVG8oeHlQb2ludHNbMF0ueCwgeHlQb2ludHNbMF0ueSk7XG4gIGN0eC5saW5lVG8oeHlQb2ludHNbMV0ueCwgeHlQb2ludHNbMV0ueSk7XG4gIGN0eC5zdHJva2UoKTtcblxuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5zdHJva2VTdHlsZSA9IGdldExpbmVDb2xvcihmZWF0dXJlLmdlb2pzb24pO1xuICBjdHgubGluZVdpZHRoID0gMjtcbiAgY3R4Lm1vdmVUbyh4eVBvaW50c1swXS54LCB4eVBvaW50c1swXS55KTtcbiAgY3R4LmxpbmVUbyh4eVBvaW50c1sxXS54LCB4eVBvaW50c1sxXS55KTtcbiAgY3R4LnN0cm9rZSgpO1xufVxuXG5mdW5jdGlvbiByZW5kZXJCYXNpY1BvbHlnb24oY3R4LCB4eVBvaW50cywgbWFwLCBmZWF0dXJlLCByZW5kZXIpIHtcbiAgdmFyIHBvaW50O1xuICBpZiggeHlQb2ludHMubGVuZ3RoIDw9IDEgKSByZXR1cm47XG5cbiAgY3R4LmJlZ2luUGF0aCgpO1xuXG4gIHBvaW50ID0geHlQb2ludHNbMF07XG4gIGN0eC5tb3ZlVG8ocG9pbnQueCwgcG9pbnQueSk7XG4gIGZvciggdmFyIGkgPSAxOyBpIDwgeHlQb2ludHMubGVuZ3RoOyBpKysgKSB7XG4gICAgY3R4LmxpbmVUbyh4eVBvaW50c1tpXS54LCB4eVBvaW50c1tpXS55KTtcbiAgfVxuICBjdHgubGluZVRvKHh5UG9pbnRzWzBdLngsIHh5UG9pbnRzWzBdLnkpO1xuXG4gIGN0eC5zdHJva2VTdHlsZSA9IHJlbmRlci5ob3ZlciA/ICdyZWQnIDogJ3JnYmEoJytyZW5kZXJVdGlscy5jb2xvcnMucmdiLmJsdWUuam9pbignLCcpKycsLjYpJztcbiAgY3R4LmZpbGxTdHlsZSA9IHJlbmRlci5maWxsU3R5bGUgPyByZW5kZXIuZmlsbFN0eWxlIDogJ3JnYmEoJytyZW5kZXJVdGlscy5jb2xvcnMucmdiLmxpZ2h0Qmx1ZS5qb2luKCcsJykrJywuNiknO1xuICBjdHgubGluZVdpZHRoID0gNDtcblxuICBjdHguc3Ryb2tlKCk7XG4gIGN0eC5maWxsKCk7XG59XG5cbmZ1bmN0aW9uIGdldExpbmVDb2xvcihmZWF0dXJlKSB7XG4gICAgdmFyIGNvbG9yID0gJ3doaXRlJztcblxuICAgIHZhciBvcmlnaW4gPSBjb2xsZWN0aW9uLmdldEJ5UHJtbmFtZShmZWF0dXJlLnByb3BlcnRpZXMub3JpZ2luKTtcbiAgICB2YXIgdGVybWludXMgPSBjb2xsZWN0aW9uLmdldEJ5UHJtbmFtZShmZWF0dXJlLnByb3BlcnRpZXMudGVybWludXMpO1xuXG4gICAgaWYoIGZlYXR1cmUucHJvcGVydGllcy5yZW5kZXJJbmZvICkge1xuICAgICAgICBpZiggdGVybWludXMgJiYgdGVybWludXMucHJvcGVydGllcy50eXBlID09ICdTaW5rJyApIHtcbiAgICAgICAgICBjb2xvciA9IHJlbmRlclV0aWxzLmNvbG9ycy5kYXJrQ3lhbjtcbiAgICAgICAgfSBlbHNlIGlmKCBvcmlnaW4gJiYgb3JpZ2luLnByb3BlcnRpZXMudHlwZS5tYXRjaCgvZGVtYW5kL2kpICkge1xuICAgICAgICAgICAgY29sb3IgPSByZW5kZXJVdGlscy5jb2xvcnMucmVkO1xuICAgICAgICB9IGVsc2UgaWYoIG9yaWdpbiAmJiB0ZXJtaW51cyAmJiB0ZXJtaW51cy5wcm9wZXJ0aWVzLnR5cGUubWF0Y2goL2RlbWFuZC9pKSAmJiBvcmlnaW4ucHJvcGVydGllcy50eXBlID09ICdHcm91bmR3YXRlciBTdG9yYWdlJyApIHtcbiAgICAgICAgICAgIGNvbG9yID0gcmVuZGVyVXRpbHMuY29sb3JzLmxpZ2h0R3JleTtcbiAgICAgICAgfSBlbHNlIGlmKCBmZWF0dXJlLnByb3BlcnRpZXMuZGVzY3JpcHRpb24ubWF0Y2goL3JlY2hhcmdlL2ksICcnKSApIHtcbiAgICAgICAgICAgIGNvbG9yID0gcmVuZGVyVXRpbHMuY29sb3JzLmdyZWVuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpbmUgPSB7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgd2VpZ2h0OiAzLFxuICAgICAgICBvcGFjaXR5OiAwLjQsXG4gICAgICAgIHNtb290aEZhY3RvcjogMVxuICAgIH1cblxuICAgIC8vaWYoIGZlYXR1cmUucHJvcGVydGllcy5jYWxpYnJhdGlvbk5vZGUgJiYgdGhpcy5tYXBGaWx0ZXJzLmNhbGlicmF0aW9uTW9kZSApIHtcbiAgICBpZiggZmVhdHVyZS5wcm9wZXJ0aWVzLmNhbGlicmF0aW9uTm9kZSApIHtcbiAgICAgICAgbGluZS5jb2xvciA9ICdibHVlJztcbiAgICB9XG5cbiAgICByZXR1cm4gY29sb3I7XG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICdQb3dlciBQbGFudCcgICAgICAgICA6IHtcbiAgICBjb2xvciA6ICcjMzM2NmNjJyxcbiAgICBnb29nbGUgOiAnc21hbGxfcmVkJ1xuICB9LFxuICAnQWdyaWN1bHR1cmFsIERlbWFuZCcgOiB7XG4gICAgICBjb2xvciA6ICcjZmY5OTAwJyxcbiAgICAgIGdvb2dsZSA6ICdzbWFsbF95ZWxsb3cnXG4gIH0sXG4gICdKdW5jdGlvbicgICAgICAgICAgICA6IHtcbiAgICAgIGNvbG9yIDogJyMxMDk2MTgnLFxuICAgICAgZ29vZ2xlIDogJ3NtYWxsX2dyZWVuJ1xuICB9LFxuICAnUHVtcCBQbGFudCcgICAgICAgICAgOiB7XG4gICAgICBjb2xvciA6ICcjOTkwMDk5JyxcbiAgICAgIGdvb2dsZSA6ICdzbWFsbF9ibHVlJ1xuICB9LFxuICAnV2F0ZXIgVHJlYXRtZW50JyAgICAgOiB7XG4gICAgICBjb2xvciA6ICcjMDA5OWM2JyxcbiAgICAgIGdvb2dsZSA6ICdzbWFsbF9wdXJwbGUnXG4gIH0sXG4gICdTdXJmYWNlIFN0b3JhZ2UnICAgICA6IHtcbiAgICAgIGNvbG9yIDogJyNkZDQ0NzcnLFxuICAgICAgZ29vZ2xlIDogJ21lYXNsZV9icm93bicsXG4gIH0sXG4gICdVcmJhbiBEZW1hbmQnICAgICAgICA6IHtcbiAgICAgIGNvbG9yIDogJyM2NmFhMDAnLFxuICAgICAgZ29vZ2xlIDogJ21lYXNsZV9ncmV5J1xuICB9LFxuICAnU2luaycgICAgICAgICAgICAgICAgOiB7XG4gICAgICBjb2xvciA6ICcjYjgyZTJlJyxcbiAgICAgIGdvb2dsZSA6ICdtZWFzbGVfd2hpdGUnXG4gIH0sXG4gICdHcm91bmR3YXRlciBTdG9yYWdlJyA6IHtcbiAgICAgIGNvbG9yIDogJyMzMTYzOTUnLFxuICAgICAgZ29vZ2xlIDogJ21lYXNsZV90dXJxdW9pc2UnXG4gIH0sXG4gICdOb24tU3RhbmRhcmQgRGVtYW5kJyA6IHtcbiAgICAgIGNvbG9yIDogJyMyMmFhOTknLFxuICAgICAgZ29vZ2xlIDogJ3NoYWRlZF9kb3QnXG4gIH1cbn07IiwidmFyIGNvbG9ycyA9IHJlcXVpcmUoJy4vY29sb3JzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCBjb25maWcpIHtcbiAgICBpZiggIWNvbmZpZy5zdHJva2UgKSBjb25maWcuc3Ryb2tlID0gY29sb3JzLmdldENvbG9yKCdibGFjaycsIGNvbmZpZy5vcGFjaXR5KTtcbiAgICBpZiggIWNvbmZpZy5maWxsICkgY29uZmlnLmZpbGwgPSBjb2xvcnMuZ2V0Q29sb3IoJ2xpZ2h0Qmx1ZScsIGNvbmZpZy5vcGFjaXR5KTtcblxuICAgIHV0aWxzLm92YWwoY3R4LCBjb25maWcpO1xufSIsInZhciBjb2xvcnMgPSB7XG4gIGJhc2UgOiAnIzE5NzZEMicsXG4gIGxpZ2h0Qmx1ZSA6ICcjQkJERUZCJyxcbiAgYmx1ZSA6ICcjMTk3NkQyJyxcbiAgbGlnaHRHcmV5IDogJyM3MjcyNzInLFxuICBvcmFuZ2UgOiAnI0ZGNTcyMicsXG4gIHJlZCA6ICcjRDMyRjJGJyxcbiAgZ3JlZW4gOiAnIzRDQUY1MCcsXG4gIHllbGxvdyA6ICcjRkZFQjNCJyxcbiAgYmxhY2sgOiAnIzIxMjEyMScsXG4gIGN5YW4gOiAnIzAwQkNENCcsXG4gIGRhcmtDeWFuIDogJyMwMDk3QTcnLFxuICBpbmRpZ28gOiAnIzNGNTFCNSdcbn07XG5cbmNvbG9ycy5yZ2IgPSB7XG4gIGJhc2UgOiBbMjUsIDExOCwgMjEwXSxcbiAgbGlnaHRCbHVlIDogWzE4NywgMjIyLCAyNTFdLFxuICBibHVlIDogWzI1LCAxMTgsIDIxMF0sXG4gIGxpZ2h0R3JleSA6IFsxMTQsIDExNCwgMTE0XSxcbiAgb3JhbmdlIDogWzI1NSwgODcsIDM0XSxcbiAgZ3JlZW4gOiBbNzYsIDE3NSwgODBdLFxuICByZWQgOiBbMjExLCA0NywgNDddLFxuICB5ZWxsb3cgOiBbMjU1LCAyMzUsIDU5XSxcbiAgY3lhbiA6IFswLCAxODgsIDIxMl0sXG4gIGRhcmtDeWFuIDogWzAsIDE1MSwgMTY3XSxcbiAgYmxhY2s6WzIxLDIxLDIxXSxcbiAgaW5kaWdvIDogWzYzLCA4MSwgMTgxXVxufTtcblxuY29sb3JzLmdldENvbG9yID0gZnVuY3Rpb24obmFtZSwgb3BhY2l0eSkge1xuICBpZiggb3BhY2l0eSA9PT0gdW5kZWZpbmVkICkgb3BhY2l0eSA9IDE7XG4gIHJldHVybiAncmdiYSgnK2NvbG9ycy5yZ2JbbmFtZV0uam9pbignLCcpKycsJytvcGFjaXR5KycpJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb2xvcnM7XG4iLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9jb2xvcnMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHgsIGNvbmZpZykge1xuICAgIHZhciByID0gY29uZmlnLndpZHRoIC8gMjtcblxuICAgIHZhciBncmQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoY29uZmlnLngrciwgY29uZmlnLnksIGNvbmZpZy54K3IsIGNvbmZpZy55K2NvbmZpZy5oZWlnaHQtKC4yNSpjb25maWcuaGVpZ2h0KSk7XG4gICAgZ3JkLmFkZENvbG9yU3RvcCgwLCBjb25maWcuc3Ryb2tlIHx8IGNvbG9ycy5nZXRDb2xvcignYmx1ZScsIGNvbmZpZy5vcGFjaXR5KSk7XG4gICAgZ3JkLmFkZENvbG9yU3RvcCgxLCBjb25maWcuZmlsbCB8fCBjb2xvcnMuZ2V0Q29sb3IoJ2dyZWVuJywgY29uZmlnLm9wYWNpdHkpKTtcbiAgICBjdHguZmlsbFN0eWxlPWdyZDtcblxuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbmZpZy5zdHJva2UgfHwgY29sb3JzLmdldENvbG9yKCdibGFjaycsIGNvbmZpZy5vcGFjaXR5KTtcbiAgICBjdHgubGluZVdpZHRoID0gY29uZmlnLmxpbmVXaWR0aCB8fCAyO1xuXG4gICAgdXRpbHMublNpZGVkUGF0aChjdHgsIGNvbmZpZy54LCBjb25maWcueSwgciwgMywgOTApO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHR5cGUsIHdpZHRoLCBoZWlnaHQpIHtcbiAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcblxuICBpZiggIUNXTi5yZW5kZXJbdHlwZV0gKSByZXR1cm4gY2FudmFzO1xuXG4gIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgQ1dOLnJlbmRlclt0eXBlXShjdHgsIDIsIDIsIHdpZHRoLTQsIGhlaWdodC00KTtcblxuICByZXR1cm4gY2FudmFzO1xufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBjb2xvcnMgOiByZXF1aXJlKCcuL2NvbG9ycycpLFxuICBpY29uIDogcmVxdWlyZSgnLi9pY29uJyksXG4gIEp1bmN0aW9uIDogcmVxdWlyZSgnLi9qdW5jdGlvbicpLFxuICAnUG93ZXIgUGxhbnQnIDogcmVxdWlyZSgnLi9wb3dlci1wbGFudCcpLFxuICAnUHVtcCBQbGFudCcgOiByZXF1aXJlKCcuL3B1bXAtcGxhbnQnKSxcbiAgJ1dhdGVyIFRyZWF0bWVudCcgOiByZXF1aXJlKCcuL3dhdGVyLXRyZWF0bWVudCcpLFxuICAnU3VyZmFjZSBTdG9yYWdlJyA6IHJlcXVpcmUoJy4vc3VyZmFjZS1zdG9yYWdlJyksXG4gICdHcm91bmR3YXRlciBTdG9yYWdlJyA6IHJlcXVpcmUoJy4vZ3JvdW5kd2F0ZXItc3RvcmFnZScpLFxuICBTaW5rIDogcmVxdWlyZSgnLi9zaW5rJyksXG4gICdOb24tU3RhbmRhcmQgRGVtYW5kJyA6IHJlcXVpcmUoJy4vbm9uc3RhbmRhcmQtZGVtYW5kJyksXG4gICdBZ3JpY3VsdHVyYWwgRGVtYW5kJyA6IHJlcXVpcmUoJy4vYWdyaWN1bHR1cmFsLWRlbWFuZCcpLFxuICAnVXJiYW4gRGVtYW5kJyA6IHJlcXVpcmUoJy4vdXJiYW4tZGVtYW5kJyksXG4gIFdldGxhbmQgOiByZXF1aXJlKCcuL3dldGxhbmQnKSxcbiAgbGluZU1hcmtlcnMgOiByZXF1aXJlKCcuL2xpbmUtbWFya2VycycpXG59IiwidmFyIGNvbG9ycyA9IHJlcXVpcmUoJy4vY29sb3JzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCBjb25maWcpIHtcbiAgICBjdHguZmlsbFN0eWxlID0gY29uZmlnLmZpbGwgfHwgIGNvbG9ycy5nZXRDb2xvcignYmx1ZScsIGNvbmZpZy5vcGFjaXR5KTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb25maWcuc3Ryb2tlIHx8IGNvbG9ycy5nZXRDb2xvcignYmxhY2snLCBjb25maWcub3BhY2l0eSk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IGNvbmZpZy5saW5lV2lkdGggfHwgMjtcblxuICAgIHZhciByID0gY29uZmlnLndpZHRoIC8gMjtcblxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguYXJjKGNvbmZpZy54K3IsIGNvbmZpZy55K3IsIHIsIDAsIE1hdGguUEkqMiwgdHJ1ZSk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xufSIsInZhciBjb2xvcnMgPSByZXF1aXJlKCcuL2NvbG9ycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjb3N0IDogZnVuY3Rpb24oY3h0LCB4LCB5LCBzKXtcbiAgICAgIGN4dC5iZWdpblBhdGgoKTtcbiAgICAgIGN4dC5hcmMoeCwgeSwgcywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgIGN4dC5maWxsU3R5bGUgPSBjb2xvcnMuZ3JlZW47XG4gICAgICBjeHQuZmlsbCgpO1xuICAgICAgY3h0LmNsb3NlUGF0aCgpO1xuICAgIH0sXG4gICAgYW1wbGl0dWRlIDogZnVuY3Rpb24oY3h0LCB4LCB5LCBzKXtcbiAgICAgIGN4dC5iZWdpblBhdGgoKTtcbiAgICAgIGN4dC5hcmMoeCwgeSwgcywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgIGN4dC5saW5lV2lkdGggPSAyO1xuICAgICAgY3h0LnN0cm9rZVN0eWxlID0gY29sb3JzLmJsYWNrO1xuICAgICAgY3h0LnN0cm9rZSgpO1xuICAgICAgY3h0LmNsb3NlUGF0aCgpO1xuICAgIH0sXG4gICAgY29uc3RyYWludHMgOiBmdW5jdGlvbihjeHQsIHgsIHksIHMsIHZYLCB2WSl7XG4gICAgICBjeHQuYmVnaW5QYXRoKCk7XG4gICAgICB2YXIgZHggPSB2WCAqIC40O1xuICAgICAgdmFyIGR5ID0gdlkgKiAuNDtcblxuICAgICAgY3h0LmJlZ2luUGF0aCgpO1xuICAgICAgY3h0Lm1vdmVUbyh4K3ZZK2R4LCB5LXZYK2R5KTtcbiAgICAgIGN4dC5saW5lVG8oeCt2WS1keCwgeS12WC1keSk7XG5cbiAgICAgIGN4dC5saW5lVG8oeC12WS1keCwgeSt2WC1keSk7XG4gICAgICBjeHQubGluZVRvKHgtdlkrZHgsIHkrdlgrZHkpO1xuICAgICAgY3h0LmxpbmVUbyh4K3ZZK2R4LCB5LXZYK2R5KTtcbiAgICAgIGN4dC5zdHJva2VTdHlsZSA9IGNvbG9ycy5ibGFjaztcbiAgICAgIGN4dC5zdHJva2UoKTtcbiAgICAgIGN4dC5jbG9zZVBhdGgoKTtcbiAgICB9LFxuICAgIGVudmlyb25tZW50YWwgOiBmdW5jdGlvbihjeHQsIHgsIHksIHMpe1xuICAgICAgY3h0LmJlZ2luUGF0aCgpO1xuICAgICAgY3h0LmFyYyh4LCB5LCBzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgICAgY3h0LmxpbmVXaWR0aCA9IDI7XG4gICAgICBjeHQuc3Ryb2tlU3R5bGUgPSBjb2xvcnMuZ3JlZW47XG4gICAgICBjeHQuc3Ryb2tlKCk7XG4gICAgICBjeHQuY2xvc2VQYXRoKCk7XG4gICAgfVxufTsiLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9jb2xvcnMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHgsIGNvbmZpZykge1xuICAgIGN0eC5maWxsU3R5bGUgPSBjb25maWcuZmlsbCB8fCBjb2xvcnMuZ2V0Q29sb3IoJ3JlZCcsIGNvbmZpZy5vcGFjaXR5KTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb25maWcuc3Ryb2tlIHx8IGNvbG9ycy5nZXRDb2xvcignYmxhY2snLCBjb25maWcub3BhY2l0eSk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IGNvbmZpZy5saW5lV2lkdGggfHwgMjtcblxuICAgIHV0aWxzLm5TaWRlZFBhdGgoY3R4LCBjb25maWcueCwgY29uZmlnLnksIGNvbmZpZy53aWR0aC8yLCA0LCA0NSk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xufSIsInZhciBjb2xvcnMgPSByZXF1aXJlKCcuL2NvbG9ycycpO1xudmFyIGp1bmN0aW9uID0gcmVxdWlyZSgnLi9qdW5jdGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0eCwgY29uZmlnKSB7XG4gIGNvbmZpZy5maWxsID0gY29sb3JzLmdldENvbG9yKCdkYXJrQ3lhbicsIGNvbmZpZy5vcGFjaXR5KTtcblxuICBqdW5jdGlvbihjdHgsIGNvbmZpZyk7XG4gIHZhciByID0gY29uZmlnLndpZHRoIC8gMjtcblxuICAvLyBob3Jpem9udGFsIGxpbmVcbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHgubW92ZVRvKGNvbmZpZy54LCBjb25maWcueStyKTtcbiAgY3R4LmxpbmVUbyhjb25maWcueCtjb25maWcud2lkdGgsIGNvbmZpZy55K3IpO1xuICBjdHguc3Ryb2tlKCk7XG4gIGN0eC5jbG9zZVBhdGgoKTtcblxuICAvLyB2ZXJ0aWNhbCBsaW5lXG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4Lm1vdmVUbyhjb25maWcueCtyLCBjb25maWcueSk7XG4gIGN0eC5saW5lVG8oY29uZmlnLngrciwgY29uZmlnLnkrY29uZmlnLndpZHRoKTtcbiAgY3R4LnN0cm9rZSgpO1xuICBjdHguY2xvc2VQYXRoKCk7XG59IiwidmFyIGNvbG9ycyA9IHJlcXVpcmUoJy4vY29sb3JzJyk7XG52YXIganVuY3Rpb24gPSByZXF1aXJlKCcuL2p1bmN0aW9uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCBjb25maWcpIHtcbiAgICBjb25maWcuZmlsbCA9IGNvbG9ycy5nZXRDb2xvcignaW5kaWdvJywgY29uZmlnLm9wYWNpdHkpO1xuXG4gICAganVuY3Rpb24oY3R4LCBjb25maWcpO1xuXG4gICAgdmFyIHIgPSBjb25maWcud2lkdGggLyAyO1xuICAgIHZhciBjeCA9IGNvbmZpZy54ICsgcjtcbiAgICB2YXIgY3kgPSBjb25maWcueSArIHI7XG5cbiAgICB2YXIgeDEgPSBjeCArIHIgKiBNYXRoLmNvcyhNYXRoLlBJLzQpO1xuICAgIHZhciB5MSA9IGN5ICsgciAqIE1hdGguc2luKE1hdGguUEkvNCk7XG4gICAgdmFyIHgyID0gY3ggKyByICogTWF0aC5jb3MoTWF0aC5QSSAqICg1LzQpKTtcbiAgICB2YXIgeTIgPSBjeSArIHIgKiBNYXRoLnNpbihNYXRoLlBJICogKDUvNCkpO1xuXG4gICAgLy8gbGluZSAxXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8oeDEsIHkxKTtcbiAgICBjdHgubGluZVRvKHgyLCB5Mik7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgIHgxID0gY3ggKyByICogTWF0aC5jb3MoTWF0aC5QSSAqICgzLzQpKTtcbiAgICB5MSA9IGN5ICsgciAqIE1hdGguc2luKE1hdGguUEkgKiAoMy80KSk7XG4gICAgeDIgPSBjeCArIHIgKiBNYXRoLmNvcyhNYXRoLlBJICogKDcvNCkpO1xuICAgIHkyID0gY3kgKyByICogTWF0aC5zaW4oTWF0aC5QSSAqICg3LzQpKTtcblxuICAgIC8vIGxpbmUgMlxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKHgxLCB5MSk7XG4gICAgY3R4LmxpbmVUbyh4MiwgeTIpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG59XG4iLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9jb2xvcnMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHgsIGNvbmZpZykge1xuICAgIGN0eC5maWxsU3R5bGUgPSBjb25maWcuZmlsbCB8fCBjb2xvcnMuZ2V0Q29sb3IoJ2Jhc2UnLCBjb25maWcub3BhY2l0eSk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29uZmlnLnN0cm9rZSB8fCBjb2xvcnMuZ2V0Q29sb3IoJ2JsYWNrJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGN0eC5saW5lV2lkdGggPSBjb25maWcubGluZVdpZHRoIHx8IDI7XG5cbiAgICB1dGlscy5uU2lkZWRQYXRoKGN0eCwgY29uZmlnLngsIGNvbmZpZy55LCBjb25maWcud2lkdGgvMiwgNCwgNDUpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbn0iLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9jb2xvcnMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHgsIGNvbmZpZykge1xuICAgIGN0eC5maWxsU3R5bGUgPSBjb25maWcuZmlsbCB8fCBjb2xvcnMuZ2V0Q29sb3IoJ3llbGxvdycsIGNvbmZpZy5vcGFjaXR5KTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb25maWcuc3Ryb2tlIHx8IGNvbG9ycy5nZXRDb2xvcignYmxhY2snLCBjb25maWcub3BhY2l0eSk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IGNvbmZpZy5saW5lV2lkdGggfHwgMjtcblxuICAgIHV0aWxzLm5TaWRlZFBhdGgoY3R4LCBjb25maWcueCwgY29uZmlnLnksIGNvbmZpZy53aWR0aC8yLCAzLCA5MCk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xufSIsInZhciBjb2xvcnMgPSByZXF1aXJlKCcuL2NvbG9ycycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0eCwgY29uZmlnKSB7XG4gICAgaWYoICFjb25maWcuc3Ryb2tlICkgY29uZmlnLnN0cm9rZSA9IGNvbG9ycy5nZXRDb2xvcignYmxhY2snLCBjb25maWcub3BhY2l0eSk7XG4gICAgaWYoICFjb25maWcuZmlsbCApIGNvbmZpZy5maWxsID0gY29sb3JzLmdldENvbG9yKCdvcmFuZ2UnLCBjb25maWcub3BhY2l0eSk7XG5cbiAgICB1dGlscy5vdmFsKGN0eCwgY29uZmlnKTtcbn0iLCJmdW5jdGlvbiBvdmFsKGN0eCwgY29uZmlnKSB7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbmZpZy5maWxsO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbmZpZy5zdHJva2U7XG4gICAgY3R4LmxpbmVXaWR0aCA9IGNvbmZpZy5saW5lV2lkdGggfHwgMjtcblxuICAgIGNvbmZpZy5oZWlnaHQgLT0gY29uZmlnLndpZHRoICogLjU7XG4gICAgY29uZmlnLnkgKz0gY29uZmlnLmhlaWdodCAvIDI7XG5cbiAgICB2YXIga2FwcGEgPSAuNTUyMjg0OCxcbiAgICAgIG94ID0gKGNvbmZpZy53aWR0aCAvIDIpICoga2FwcGEsIC8vIGNvbnRyb2wgcG9pbnQgb2Zmc2V0IGhvcml6b250YWxcbiAgICAgIG95ID0gKGNvbmZpZy5oZWlnaHQgLyAyKSAqIGthcHBhLCAvLyBjb250cm9sIHBvaW50IG9mZnNldCB2ZXJ0aWNhbFxuICAgICAgeGUgPSBjb25maWcueCArIGNvbmZpZy53aWR0aCwgICAgICAgICAgIC8vIHgtZW5kXG4gICAgICB5ZSA9IGNvbmZpZy55ICsgY29uZmlnLmhlaWdodCwgICAgICAgICAgIC8vIHktZW5kXG4gICAgICB4bSA9IGNvbmZpZy54ICsgY29uZmlnLndpZHRoIC8gMiwgICAgICAgLy8geC1taWRkbGVcbiAgICAgIHltID0gY29uZmlnLnkgKyBjb25maWcuaGVpZ2h0IC8gMjsgICAgICAgLy8geS1taWRkbGVcblxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKGNvbmZpZy54LCB5bSk7XG4gICAgY3R4LmJlemllckN1cnZlVG8oY29uZmlnLngsIHltIC0gb3ksIHhtIC0gb3gsIGNvbmZpZy55LCB4bSwgY29uZmlnLnkpO1xuICAgIGN0eC5iZXppZXJDdXJ2ZVRvKHhtICsgb3gsIGNvbmZpZy55LCB4ZSwgeW0gLSBveSwgeGUsIHltKTtcbiAgICBjdHguYmV6aWVyQ3VydmVUbyh4ZSwgeW0gKyBveSwgeG0gKyBveCwgeWUsIHhtLCB5ZSk7XG4gICAgY3R4LmJlemllckN1cnZlVG8oeG0gLSBveCwgeWUsIGNvbmZpZy54LCB5bSArIG95LCBjb25maWcueCwgeW0pO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xufVxuXG4vKiogaGVscGVyIGZvciB0cmVhdG1lbnQsIHN1cmZhY2Ugc3RvcmFnZSBhbmQgZ3JvdW5kIHdhdGVyICoqL1xuZnVuY3Rpb24gblNpZGVkUGF0aChjdHgsIGxlZnQsIHRvcCwgcmFkaXVzLCBzaWRlcywgc3RhcnRBbmdsZSkge1xuICAgIC8vIHRoaXMgaXMgZHJhd2luZyBmcm9tIGNlbnRlclxuICAgIGxlZnQgKz0gcmFkaXVzO1xuICAgIHRvcCArPSByYWRpdXM7XG5cbiAgICB2YXIgYSA9ICgoTWF0aC5QSSAqIDIpL3NpZGVzKTtcbiAgICB2YXIgciA9IHN0YXJ0QW5nbGUgKiAoTWF0aC5QSSAvIDE4MCksIHgsIHk7XG5cbiAgICAvLyB0aGluayB5b3UgbmVlZCB0byBhZGp1c3QgYnkgeCwgeVxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICB2YXIgeHMgPSBsZWZ0ICsgKHJhZGl1cyAqIE1hdGguY29zKC0xICogcikpO1xuICAgIHZhciB5cyA9IHRvcCArIChyYWRpdXMgKiBNYXRoLnNpbigtMSAqIHIpKTtcbiAgICBjdHgubW92ZVRvKHhzLCB5cyk7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBzaWRlczsgaSsrKSB7XG4gICAgICAgIHggPSBsZWZ0ICsgKHJhZGl1cyAqIE1hdGguY29zKGEqaS1yKSk7XG4gICAgICAgIHkgPSB0b3AgKyAocmFkaXVzICogTWF0aC5zaW4oYSppLXIpKTtcbiAgICAgICAgY3R4LmxpbmVUbyh4LCB5KTtcbiAgICB9XG4gICAgY3R4LmxpbmVUbyh4cywgeXMpO1xuXG4gICAgLy8gbm90IHBhaW50aW5nLCBsZWF2ZSB0aGlzIHRvIHRoZSBkcmF3IGZ1bmN0aW9uXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBvdmFsIDogb3ZhbCxcbiAgblNpZGVkUGF0aCA6IG5TaWRlZFBhdGhcbn0iLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9jb2xvcnMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHgsIGNvbmZpZykge1xuICAgIGN0eC5maWxsU3R5bGUgPSBjb25maWcuZmlsbCB8fCBjb2xvcnMuZ2V0Q29sb3IoJ2N5YW4nLCBjb25maWcub3BhY2l0eSk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29uZmlnLnN0cm9rZSB8fCBjb2xvcnMuZ2V0Q29sb3IoJ2JsYWNrJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGN0eC5saW5lV2lkdGggPSBjb25maWcubGluZVdpZHRoIHx8IDI7XG5cbiAgICB1dGlscy5uU2lkZWRQYXRoKGN0eCwgY29uZmlnLngsIGNvbmZpZy55LCBjb25maWcud2lkdGgvMiwgOCwgMjIuNSk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xufSIsInZhciBjb2xvcnMgPSByZXF1aXJlKCcuL2NvbG9ycycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0eCwgY29uZmlnKSB7XG4gICAgaWYoICFjb25maWcuc3Ryb2tlICkgY29uZmlnLnN0cm9rZSA9IGNvbG9ycy5nZXRDb2xvcignYmxhY2snLCBjb25maWcub3BhY2l0eSk7XG4gICAgaWYoICFjb25maWcuZmlsbCApIGNvbmZpZy5maWxsID0gY29sb3JzLmdldENvbG9yKCdncmVlbicsIGNvbmZpZy5vcGFjaXR5KTtcblxuICAgIHV0aWxzLm92YWwoY3R4LCBjb25maWcpO1xufSIsInZhciByZXF1ZXN0ID0gcmVxdWlyZSgnc3VwZXJhZ2VudCcpO1xuXG5mdW5jdGlvbiBsb2FkTmV0d29yayhjYWxsYmFjaykge1xuICB2YXIgbmV0d29yaywgcmVnaW9ucztcbiAgdmFyIHJlZ2lvbnMgPSBmYWxzZTtcbiAgXG4gIGZ1bmN0aW9uIGRvbmUoKSB7XG4gICAgaWYoIG5ldHdvcmsgJiYgcmVnaW9ucyApIHtcbiAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgbmV0d29yayA6IG5ldHdvcmssXG4gICAgICAgIHJlZ2lvbnMgOiByZWdpb25zXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmVxdWVzdFxuICAgIC5nZXQoJy9uZXR3b3JrL2dldCcpXG4gICAgLmVuZChmdW5jdGlvbihlcnIsIHJlc3Ape1xuICAgICAgbmV0d29ya0xvYWRlZCA9IHRydWU7XG5cbiAgICAgIGlmKCBlcnIgfHwgcmVzcC5lcnJvciApIHtcbiAgICAgICAgICBhbGVydCgnU2VydmVyIGVycm9yIGxvYWRpbmcgbmV0d29yayA6KCcpO1xuICAgICAgICAgIHJldHVybiBkb25lKCk7XG4gICAgICB9XG5cbiAgICAgIG5ldHdvcmsgPSByZXNwLmJvZHkgfHwgW11cblxuICAgICAgZG9uZSgpO1xuICAgIH0pO1xuXG4gIHJlcXVlc3RcbiAgICAuZ2V0KCcvcmVnaW9ucy9nZXQnKVxuICAgIC5lbmQoZnVuY3Rpb24oZXJyLCByZXNwKXtcbiAgICAgIG5ldHdvcmtMb2FkZWQgPSB0cnVlO1xuXG4gICAgICBpZiggZXJyIHx8IHJlc3AuZXJyb3IgKSB7XG4gICAgICAgICAgYWxlcnQoJ1NlcnZlciBlcnJvciBsb2FkaW5nIHJlZ2lvbnMgOignKTtcbiAgICAgICAgICByZXR1cm4gZG9uZSgpO1xuICAgICAgfVxuXG4gICAgICByZWdpb25zID0gcmVzcC5ib2R5IHx8IFtdXG5cbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0RXh0cmFzKHBybW5hbWUsIGNhbGxiYWNrKSB7XG4gIHJlcXVlc3RcbiAgICAuZ2V0KCcvbmV0d29yay9leHRyYXMnKVxuICAgIC5xdWVyeSh7cHJtbmFtZTogcHJtbmFtZX0pXG4gICAgLmVuZCgoZXJyLCByZXNwKSA9PiB7XG4gICAgICBjYWxsYmFjayhyZXNwLmJvZHkpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRBZ2dyZWdhdGUocXVlcnksIGNhbGxiYWNrKSB7XG4gIHJlcXVlc3RcbiAgICAuZ2V0KCcvcmVnaW9ucy9hZ2dyZWdhdGUnKVxuICAgIC5xdWVyeShxdWVyeSlcbiAgICAuZW5kKChlcnIsIHJlc3ApID0+IHtcbiAgICAgIGNhbGxiYWNrKHJlc3AuYm9keSk7XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBsb2FkTmV0d29yayA6IGxvYWROZXR3b3JrLFxuICBnZXRFeHRyYXMgOiBnZXRFeHRyYXMsXG4gIGdldEFnZ3JlZ2F0ZSA6IGdldEFnZ3JlZ2F0ZVxufSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlbmRlcmVyID0gcmVxdWlyZSgnLi9yZW5kZXJlcicpO1xuXG5zaWdtYS51dGlscy5wa2coJ3NpZ21hLmNhbnZhcy5ub2RlcycpO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgICAgICAgICAgICAgICAgIG5vZGUgICAgIFRoZSBub2RlIG9iamVjdC5cbiAqIEBwYXJhbSAge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY29udGV4dCAgVGhlIGNhbnZhcyBjb250ZXh0LlxuICogQHBhcmFtICB7Y29uZmlndXJhYmxlfSAgICAgICAgICAgICBzZXR0aW5ncyBUaGUgc2V0dGluZ3MgZnVuY3Rpb24uXG4gKi9cbnNpZ21hLmNhbnZhcy5ub2Rlcy5KdW5jdGlvbiA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG5cbiAgdmFyIHMgPSBub2RlW3ByZWZpeCArICdzaXplJ10qMjtcblxuICByZW5kZXJlci5KdW5jdGlvbihjb250ZXh0LCB7XG4gICAgeDogbm9kZVtwcmVmaXggKyAneCddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB5OiBub2RlW3ByZWZpeCArICd5J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHdpZHRoOiBzLFxuICAgIGhlaWdodDogc1xuICB9KTtcbn07XG5cbnNpZ21hLmNhbnZhcy5ub2Rlc1snUG93ZXIgUGxhbnQnXSA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG5cbiAgdmFyIHMgPSBub2RlW3ByZWZpeCArICdzaXplJ10qMjtcblxuICByZW5kZXJlclsnUG93ZXIgUGxhbnQnXShjb250ZXh0LCB7XG4gICAgeDogbm9kZVtwcmVmaXggKyAneCddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB5OiBub2RlW3ByZWZpeCArICd5J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHdpZHRoOiBzLFxuICAgIGhlaWdodDogc1xuICB9KTtcbn07XG5cbnNpZ21hLmNhbnZhcy5ub2Rlc1snUHVtcCBQbGFudCddID0gZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJztcblxuICB2YXIgcyA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXSoyO1xuXG4gIHJlbmRlcmVyWydQdW1wIFBsYW50J10oY29udGV4dCwge1xuICAgIHg6IG5vZGVbcHJlZml4ICsgJ3gnXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgeTogbm9kZVtwcmVmaXggKyAneSddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB3aWR0aDogcyxcbiAgICBoZWlnaHQ6IHNcbiAgfSk7XG59O1xuXG5zaWdtYS5jYW52YXMubm9kZXNbJ1dhdGVyIFRyZWF0bWVudCddID0gZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJztcblxuICB2YXIgcyA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXSoyO1xuXG4gIHJlbmRlcmVyWydXYXRlciBUcmVhdG1lbnQnXShjb250ZXh0LCB7XG4gICAgeDogbm9kZVtwcmVmaXggKyAneCddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB5OiBub2RlW3ByZWZpeCArICd5J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHdpZHRoOiBzLFxuICAgIGhlaWdodDogc1xuICB9KTtcbn07XG5cbnNpZ21hLmNhbnZhcy5ub2Rlc1snU3VyZmFjZSBTdG9yYWdlJ10gPSBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnO1xuXG4gIHZhciBzID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddKjI7XG5cbiAgcmVuZGVyZXJbJ1N1cmZhY2UgU3RvcmFnZSddKGNvbnRleHQsIHtcbiAgICB4OiBub2RlW3ByZWZpeCArICd4J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHk6IG5vZGVbcHJlZml4ICsgJ3knXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgd2lkdGg6IHMsXG4gICAgaGVpZ2h0OiBzXG4gIH0pO1xufTtcblxuc2lnbWEuY2FudmFzLm5vZGVzWydHcm91bmR3YXRlciBTdG9yYWdlJ10gPSBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnO1xuXG4gIHZhciBzID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddKjI7XG5cbiAgcmVuZGVyZXJbJ0dyb3VuZHdhdGVyIFN0b3JhZ2UnXShjb250ZXh0LCB7XG4gICAgeDogbm9kZVtwcmVmaXggKyAneCddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB5OiBub2RlW3ByZWZpeCArICd5J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHdpZHRoOiBzLFxuICAgIGhlaWdodDogc1xuICB9KTtcbn07XG5cbnNpZ21hLmNhbnZhcy5ub2Rlc1snQWdyaWN1bHR1cmFsIERlbWFuZCddID0gZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJztcblxuICB2YXIgcyA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXSoyO1xuXG4gIHJlbmRlcmVyWydBZ3JpY3VsdHVyYWwgRGVtYW5kJ10oY29udGV4dCwge1xuICAgIHg6IG5vZGVbcHJlZml4ICsgJ3gnXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgeTogbm9kZVtwcmVmaXggKyAneSddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB3aWR0aDogcyxcbiAgICBoZWlnaHQ6IHNcbiAgfSk7XG59O1xuXG5zaWdtYS5jYW52YXMubm9kZXNbJ1VyYmFuIERlbWFuZCddID0gZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJztcblxuICB2YXIgcyA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXSoyO1xuXG4gIHJlbmRlcmVyWydVcmJhbiBEZW1hbmQnXShjb250ZXh0LCB7XG4gICAgeDogbm9kZVtwcmVmaXggKyAneCddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB5OiBub2RlW3ByZWZpeCArICd5J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHdpZHRoOiBzLFxuICAgIGhlaWdodDogc1xuICB9KTtcbn07XG5cbnNpZ21hLmNhbnZhcy5ub2Rlcy5TaW5rID0gZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJztcblxuICB2YXIgcyA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXSoyO1xuXG4gIHJlbmRlcmVyLlNpbmsoY29udGV4dCwge1xuICAgIHg6IG5vZGVbcHJlZml4ICsgJ3gnXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgeTogbm9kZVtwcmVmaXggKyAneSddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB3aWR0aDogcyxcbiAgICBoZWlnaHQ6IHNcbiAgfSk7XG59O1xuXG5zaWdtYS5jYW52YXMubm9kZXNbJ05vbi1TdGFuZGFyZCBEZW1hbmQnXSA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG5cbiAgdmFyIHMgPSBub2RlW3ByZWZpeCArICdzaXplJ10qMjtcblxuICByZW5kZXJlclsnTm9uLVN0YW5kYXJkIERlbWFuZCddKGNvbnRleHQsIHtcbiAgICB4OiBub2RlW3ByZWZpeCArICd4J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHk6IG5vZGVbcHJlZml4ICsgJ3knXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgd2lkdGg6IHMsXG4gICAgaGVpZ2h0OiBzXG4gIH0pO1xufTtcblxuc2lnbWEuY2FudmFzLm5vZGVzLldldGxhbmQgPSBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnO1xuXG4gIHZhciBzID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddKjI7XG5cblxuICByZW5kZXJlci5XZXRsYW5kKGNvbnRleHQsIHtcbiAgICB4OiBub2RlW3ByZWZpeCArICd4J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHk6IG5vZGVbcHJlZml4ICsgJ3knXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgd2lkdGg6IHMsXG4gICAgaGVpZ2h0OiBzXG4gIH0pO1xufTtcblxuXG5cbnNpZ21hLnV0aWxzLnBrZygnc2lnbWEuY2FudmFzLmVkZ2VzJyk7XG5cbi8qKlxuICogVGhpcyBlZGdlIHJlbmRlcmVyIHdpbGwgZGlzcGxheSBlZGdlcyBhcyBhcnJvd3MgZ29pbmcgZnJvbSB0aGUgc291cmNlIG5vZGVcbiAqXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgICAgICAgICAgICAgICAgIGVkZ2UgICAgICAgICBUaGUgZWRnZSBvYmplY3QuXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgICAgICAgICAgICAgICAgIHNvdXJjZSBub2RlICBUaGUgZWRnZSBzb3VyY2Ugbm9kZS5cbiAqIEBwYXJhbSAge29iamVjdH0gICAgICAgICAgICAgICAgICAgdGFyZ2V0IG5vZGUgIFRoZSBlZGdlIHRhcmdldCBub2RlLlxuICogQHBhcmFtICB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjb250ZXh0ICAgICAgVGhlIGNhbnZhcyBjb250ZXh0LlxuICogQHBhcmFtICB7Y29uZmlndXJhYmxlfSAgICAgICAgICAgICBzZXR0aW5ncyAgICAgVGhlIHNldHRpbmdzIGZ1bmN0aW9uLlxuICovXG5zaWdtYS5jYW52YXMuZWRnZXMuY3duID0gZnVuY3Rpb24oZWRnZSwgc291cmNlLCB0YXJnZXQsIGNvbnRleHQsIHNldHRpbmdzKSB7XG5cbiAgdmFyIGNvbG9yID0gZWRnZS5jb2xvcixcbiAgICAgIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJyxcbiAgICAgIGVkZ2VDb2xvciA9IHNldHRpbmdzKCdlZGdlQ29sb3InKSxcbiAgICAgIGRlZmF1bHROb2RlQ29sb3IgPSBzZXR0aW5ncygnZGVmYXVsdE5vZGVDb2xvcicpLFxuICAgICAgZGVmYXVsdEVkZ2VDb2xvciA9IHNldHRpbmdzKCdkZWZhdWx0RWRnZUNvbG9yJyksXG4gICAgICBzaXplID0gZWRnZVtwcmVmaXggKyAnc2l6ZSddIHx8IDEsXG4gICAgICB0U2l6ZSA9IHRhcmdldFtwcmVmaXggKyAnc2l6ZSddLFxuICAgICAgc1ggPSBzb3VyY2VbcHJlZml4ICsgJ3gnXSxcbiAgICAgIHNZID0gc291cmNlW3ByZWZpeCArICd5J10sXG4gICAgICB0WCA9IHRhcmdldFtwcmVmaXggKyAneCddLFxuICAgICAgdFkgPSB0YXJnZXRbcHJlZml4ICsgJ3knXSxcbiAgICAgIGFTaXplID0gTWF0aC5tYXgoc2l6ZSAqIDIuNSwgc2V0dGluZ3MoJ21pbkFycm93U2l6ZScpKSxcbiAgICAgIGQgPSBNYXRoLnNxcnQoTWF0aC5wb3codFggLSBzWCwgMikgKyBNYXRoLnBvdyh0WSAtIHNZLCAyKSksXG4gICAgICBhWCA9IHNYICsgKHRYIC0gc1gpICogKGQgLSBhU2l6ZSAtIHRTaXplKSAvIGQsXG4gICAgICBhWSA9IHNZICsgKHRZIC0gc1kpICogKGQgLSBhU2l6ZSAtIHRTaXplKSAvIGQsXG4gICAgICB2WCA9ICh0WCAtIHNYKSAqIGFTaXplIC8gZCxcbiAgICAgIHZZID0gKHRZIC0gc1kpICogYVNpemUgLyBkO1xuXG4gIHZhciBjb2xvciA9IHJlbmRlcmVyLmNvbG9ycy5zYWxtb247XG4gIGlmKCBlZGdlLmNhbHZpbi5yZW5kZXJJbmZvICkge1xuICAgICAgaWYoIGVkZ2UuY2FsdmluLnJlbmRlckluZm8udHlwZSA9PSAnZmxvd1RvU2luaycgKSB7XG4gICAgICAgIGNvbG9yID0gcmVuZGVyZXIuY29sb3JzLmxpZ2h0R3JleTtcbiAgICAgIH0gZWxzZSBpZiggZWRnZS5jYWx2aW4ucmVuZGVySW5mby50eXBlID09ICdyZXR1cm5GbG93RnJvbURlbWFuZCcgKSB7XG4gICAgICAgICAgY29sb3IgPSByZW5kZXJlci5jb2xvcnMucmVkO1xuICAgICAgfSBlbHNlIGlmKCBlZGdlLmNhbHZpbi5yZW5kZXJJbmZvLnR5cGUgPT0gJ2d3VG9EZW1hbmQnICkge1xuICAgICAgICAgIGNvbG9yID0gcmVuZGVyZXIuY29sb3JzLmJsYWNrO1xuICAgICAgfSBlbHNlIGlmKCBlZGdlLmNhbHZpbi5yZW5kZXJJbmZvLnR5cGUgPT0gJ2FydGlmaWNhbFJlY2hhcmdlJyApIHtcbiAgICAgICAgICBjb2xvciA9IHJlbmRlcmVyLmNvbG9ycy5wdXJwbGU7XG4gICAgICB9XG4gIH1cblxuICBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gIGNvbnRleHQubGluZVdpZHRoID0gc2l6ZTtcbiAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgY29udGV4dC5tb3ZlVG8oc1gsIHNZKTtcbiAgY29udGV4dC5saW5lVG8oXG4gICAgYVgsXG4gICAgYVlcbiAgKTtcbiAgY29udGV4dC5zdHJva2UoKTtcblxuICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICBjb250ZXh0Lm1vdmVUbyhhWCArIHZYLCBhWSArIHZZKTtcbiAgY29udGV4dC5saW5lVG8oYVggKyB2WSAqIDAuOCwgYVkgLSB2WCAqIDAuOCk7XG4gIGNvbnRleHQubGluZVRvKGFYIC0gdlkgKiAwLjgsIGFZICsgdlggKiAwLjgpO1xuICBjb250ZXh0LmxpbmVUbyhhWCArIHZYLCBhWSArIHZZKTtcbiAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgY29udGV4dC5maWxsKCk7XG5cbn07XG5cbiJdfQ==
