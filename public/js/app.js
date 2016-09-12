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
    terminals: {}
  };

  this.init = function (nodes) {
    this.nodes = [];
    this.links = [];
    this.extras = {};

    this.index = {
      prmname: {},
      hobbesId: {},
      origins: {},
      terminals: {}
    };

    nodes.forEach(node => {
      this.index.prmname[node.properties.prmname] = node;
      this.index.hobbesId[node.properties.hobbes.id] = node;

      if (node.properties.hobbes.type === 'link') {
        this.links.push(node);
        this.setLinkIndexes(node);
      } else {
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
    hobbesId: {}
  };

  this.data = [], this.aggregate = {};

  this.init = function (regions) {
    this.index = {
      name: {},
      hobbesId: {}
    };
    this.aggregate = {};

    regions.forEach(region => {
      this.index.name[region.properties.name] = region;
      this.index.hobbesId[region.properties.hobbes.id] = region;
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
      this._addStateNodes(region.properties.hobbes.nodes, state);

      if (!region.properties.hobbes.subregions) return;

      for (var i = 0; i < region.properties.hobbes.subregions.length; i++) {
        this._updateRenderState(region.properties.hobbes.subregions[i]);
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

    for (var id in nodes) {
      var node = collections.nodes.getById(id);
      if (!node) node = collections.nodes.getByPrmname(id);
      if (!node) continue;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1Y2UtY29tcG9uZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL2NsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi9pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9saWIvcmVxdWVzdC1iYXNlLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL3JlcXVlc3QuanMiLCJwdWJsaWMvbGliL2NoYXJ0cy5qcyIsInB1YmxpYy9saWIvY29sbGVjdGlvbnMvaW5kZXguanMiLCJwdWJsaWMvbGliL2NvbGxlY3Rpb25zL25vZGVzLmpzIiwicHVibGljL2xpYi9jb2xsZWN0aW9ucy9yZWdpb25zLmpzIiwicHVibGljL2xpYi9jb250cm9sbGVycy9pbmRleC5qcyIsInB1YmxpYy9saWIvY29udHJvbGxlcnMvbmV0d29yay5qcyIsInB1YmxpYy9saWIvaW5kZXguanMiLCJwdWJsaWMvbGliL21hcC9jYW52YXMtbGF5ZXItZXZlbnRzLmpzIiwicHVibGljL2xpYi9tYXAvZmlsdGVyLmpzIiwicHVibGljL2xpYi9tYXAvaW5kZXguanMiLCJwdWJsaWMvbGliL21hcC9yZW5kZXItc3RhdGUuanMiLCJwdWJsaWMvbGliL21hcC9yZW5kZXJlci9pbmRleC5qcyIsInB1YmxpYy9saWIvbWFwL3JlbmRlcmVyL2xlZ2VuZC5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvYWdyaWN1bHR1cmFsLWRlbWFuZC5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvY29sb3JzLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci9ncm91bmR3YXRlci1zdG9yYWdlLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci9pY29uLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci9pbmRleC5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvanVuY3Rpb24uanMiLCJwdWJsaWMvbGliL3JlbmRlcmVyL2xpbmUtbWFya2Vycy5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvbm9uc3RhbmRhcmQtZGVtYW5kLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci9wb3dlci1wbGFudC5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvcHVtcC1wbGFudC5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvc2luay5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvc3VyZmFjZS1zdG9yYWdlLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci91cmJhbi1kZW1hbmQuanMiLCJwdWJsaWMvbGliL3JlbmRlcmVyL3V0aWxzLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci93YXRlci10cmVhdG1lbnQuanMiLCJwdWJsaWMvbGliL3JlbmRlcmVyL3dldGxhbmQuanMiLCJwdWJsaWMvbGliL3Jlc3QvaW5kZXguanMiLCJwdWJsaWMvbGliL3NpZ21hLWN3bi1wbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmpDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QWtEO0FBQ3JELGNBQVEsU0FBUyxNQUFULENBQWdCLEtBQXhCO0FBQ0gsS0FGTSxNQUVBLElBQUksS0FBSyxNQUFMLENBQVksVUFBWixDQUF1QixJQUF2QixJQUErQixtQkFBbkMsRUFBeUQ7QUFDNUQsY0FBUSxTQUFTLE1BQVQsQ0FBZ0IsTUFBeEI7QUFDSDtBQUNKOztBQUVELFVBQVEsV0FBUixHQUFzQixLQUF0QjtBQUNBLFVBQVEsU0FBUixHQUFvQixJQUFwQjtBQUNBLFVBQVEsU0FBUjtBQUNBLFVBQVEsTUFBUixDQUFlLEVBQWYsRUFBbUIsRUFBbkI7QUFDQSxVQUFRLE1BQVIsQ0FDRSxFQURGLEVBRUUsRUFGRjtBQUlBLFVBQVEsTUFBUjs7QUFFQSxVQUFRLFNBQVIsR0FBb0IsS0FBcEI7QUFDQSxVQUFRLFNBQVI7QUFDQSxVQUFRLE1BQVIsQ0FBZSxLQUFLLEVBQXBCLEVBQXdCLEtBQUssRUFBN0I7QUFDQSxVQUFRLE1BQVIsQ0FBZSxLQUFLLEtBQUssR0FBekIsRUFBOEIsS0FBSyxLQUFLLEdBQXhDO0FBQ0EsVUFBUSxNQUFSLENBQWUsS0FBSyxLQUFLLEdBQXpCLEVBQThCLEtBQUssS0FBSyxHQUF4QztBQUNBLFVBQVEsTUFBUixDQUFlLEtBQUssRUFBcEIsRUFBd0IsS0FBSyxFQUE3QjtBQUNBLFVBQVEsU0FBUjtBQUNBLFVBQVEsSUFBUjtBQUVELENBcEREIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxyXG4vKipcclxuICogRXhwb3NlIGBFbWl0dGVyYC5cclxuICovXHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICBtb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cclxuICpcclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xyXG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKiBAYXBpIHByaXZhdGVcclxuICovXHJcblxyXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcclxuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcclxuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcclxuICB9XHJcbiAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuLyoqXHJcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cclxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG4gICh0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXSlcclxuICAgIC5wdXNoKGZuKTtcclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcclxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgZnVuY3Rpb24gb24oKSB7XHJcbiAgICB0aGlzLm9mZihldmVudCwgb24pO1xyXG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB9XHJcblxyXG4gIG9uLmZuID0gZm47XHJcbiAgdGhpcy5vbihldmVudCwgb24pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXHJcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuXHJcbiAgLy8gYWxsXHJcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHNwZWNpZmljIGV2ZW50XHJcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xyXG5cclxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXHJcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXHJcbiAgdmFyIGNiO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcclxuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XHJcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXHJcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcblxyXG4gIGlmIChjYWxsYmFja3MpIHtcclxuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEByZXR1cm4ge0FycmF5fVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gfHwgW107XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XHJcbn07XHJcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIlxuLyoqXG4gKiBSZWR1Y2UgYGFycmAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7TWl4ZWR9IGluaXRpYWxcbiAqXG4gKiBUT0RPOiBjb21iYXRpYmxlIGVycm9yIGhhbmRsaW5nP1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXJyLCBmbiwgaW5pdGlhbCl7ICBcbiAgdmFyIGlkeCA9IDA7XG4gIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xuICB2YXIgY3VyciA9IGFyZ3VtZW50cy5sZW5ndGggPT0gM1xuICAgID8gaW5pdGlhbFxuICAgIDogYXJyW2lkeCsrXTtcblxuICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgY3VyciA9IGZuLmNhbGwobnVsbCwgY3VyciwgYXJyW2lkeF0sICsraWR4LCBhcnIpO1xuICB9XG4gIFxuICByZXR1cm4gY3Vycjtcbn07IiwiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnZW1pdHRlcicpO1xudmFyIHJlZHVjZSA9IHJlcXVpcmUoJ3JlZHVjZScpO1xudmFyIHJlcXVlc3RCYXNlID0gcmVxdWlyZSgnLi9yZXF1ZXN0LWJhc2UnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXMtb2JqZWN0Jyk7XG5cbi8qKlxuICogUm9vdCByZWZlcmVuY2UgZm9yIGlmcmFtZXMuXG4gKi9cblxudmFyIHJvb3Q7XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHsgLy8gQnJvd3NlciB3aW5kb3dcbiAgcm9vdCA9IHdpbmRvdztcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7IC8vIFdlYiBXb3JrZXJcbiAgcm9vdCA9IHNlbGY7XG59IGVsc2UgeyAvLyBPdGhlciBlbnZpcm9ubWVudHNcbiAgcm9vdCA9IHRoaXM7XG59XG5cbi8qKlxuICogTm9vcC5cbiAqL1xuXG5mdW5jdGlvbiBub29wKCl7fTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhIGhvc3Qgb2JqZWN0LFxuICogd2UgZG9uJ3Qgd2FudCB0byBzZXJpYWxpemUgdGhlc2UgOilcbiAqXG4gKiBUT0RPOiBmdXR1cmUgcHJvb2YsIG1vdmUgdG8gY29tcG9lbnQgbGFuZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpc0hvc3Qob2JqKSB7XG4gIHZhciBzdHIgPSB7fS50b1N0cmluZy5jYWxsKG9iaik7XG5cbiAgc3dpdGNoIChzdHIpIHtcbiAgICBjYXNlICdbb2JqZWN0IEZpbGVdJzpcbiAgICBjYXNlICdbb2JqZWN0IEJsb2JdJzpcbiAgICBjYXNlICdbb2JqZWN0IEZvcm1EYXRhXSc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogRXhwb3NlIGByZXF1ZXN0YC5cbiAqL1xuXG52YXIgcmVxdWVzdCA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9yZXF1ZXN0JykuYmluZChudWxsLCBSZXF1ZXN0KTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgWEhSLlxuICovXG5cbnJlcXVlc3QuZ2V0WEhSID0gZnVuY3Rpb24gKCkge1xuICBpZiAocm9vdC5YTUxIdHRwUmVxdWVzdFxuICAgICAgJiYgKCFyb290LmxvY2F0aW9uIHx8ICdmaWxlOicgIT0gcm9vdC5sb2NhdGlvbi5wcm90b2NvbFxuICAgICAgICAgIHx8ICFyb290LkFjdGl2ZVhPYmplY3QpKSB7XG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdDtcbiAgfSBlbHNlIHtcbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjYuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC4zLjAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLCBhZGRlZCB0byBzdXBwb3J0IElFLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG52YXIgdHJpbSA9ICcnLnRyaW1cbiAgPyBmdW5jdGlvbihzKSB7IHJldHVybiBzLnRyaW0oKTsgfVxuICA6IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMucmVwbGFjZSgvKF5cXHMqfFxccyokKS9nLCAnJyk7IH07XG5cbi8qKlxuICogU2VyaWFsaXplIHRoZSBnaXZlbiBgb2JqYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZXJpYWxpemUob2JqKSB7XG4gIGlmICghaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgdmFyIHBhaXJzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAobnVsbCAhPSBvYmpba2V5XSkge1xuICAgICAgcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSwgb2JqW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gIHJldHVybiBwYWlycy5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogSGVscHMgJ3NlcmlhbGl6ZScgd2l0aCBzZXJpYWxpemluZyBhcnJheXMuXG4gKiBNdXRhdGVzIHRoZSBwYWlycyBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYWlyc1xuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKi9cblxuZnVuY3Rpb24gcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSwgdmFsKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICByZXR1cm4gdmFsLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgICAgcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSwgdik7XG4gICAgfSk7XG4gIH1cbiAgcGFpcnMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KVxuICAgICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkpO1xufVxuXG4vKipcbiAqIEV4cG9zZSBzZXJpYWxpemF0aW9uIG1ldGhvZC5cbiAqL1xuXG4gcmVxdWVzdC5zZXJpYWxpemVPYmplY3QgPSBzZXJpYWxpemU7XG5cbiAvKipcbiAgKiBQYXJzZSB0aGUgZ2l2ZW4geC13d3ctZm9ybS11cmxlbmNvZGVkIGBzdHJgLlxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAqIEByZXR1cm4ge09iamVjdH1cbiAgKiBAYXBpIHByaXZhdGVcbiAgKi9cblxuZnVuY3Rpb24gcGFyc2VTdHJpbmcoc3RyKSB7XG4gIHZhciBvYmogPSB7fTtcbiAgdmFyIHBhaXJzID0gc3RyLnNwbGl0KCcmJyk7XG4gIHZhciBwYXJ0cztcbiAgdmFyIHBhaXI7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhaXJzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgcGFpciA9IHBhaXJzW2ldO1xuICAgIHBhcnRzID0gcGFpci5zcGxpdCgnPScpO1xuICAgIG9ialtkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pXSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIEV4cG9zZSBwYXJzZXIuXG4gKi9cblxucmVxdWVzdC5wYXJzZVN0cmluZyA9IHBhcnNlU3RyaW5nO1xuXG4vKipcbiAqIERlZmF1bHQgTUlNRSB0eXBlIG1hcC5cbiAqXG4gKiAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKi9cblxucmVxdWVzdC50eXBlcyA9IHtcbiAgaHRtbDogJ3RleHQvaHRtbCcsXG4gIGpzb246ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgeG1sOiAnYXBwbGljYXRpb24veG1sJyxcbiAgdXJsZW5jb2RlZDogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICdmb3JtJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICdmb3JtLWRhdGEnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuLyoqXG4gKiBEZWZhdWx0IHNlcmlhbGl6YXRpb24gbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnNlcmlhbGl6ZVsnYXBwbGljYXRpb24veG1sJ10gPSBmdW5jdGlvbihvYmope1xuICogICAgICAgcmV0dXJuICdnZW5lcmF0ZWQgeG1sIGhlcmUnO1xuICogICAgIH07XG4gKlxuICovXG5cbiByZXF1ZXN0LnNlcmlhbGl6ZSA9IHtcbiAgICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiBzZXJpYWxpemUsXG4gICAnYXBwbGljYXRpb24vanNvbic6IEpTT04uc3RyaW5naWZ5XG4gfTtcblxuIC8qKlxuICAqIERlZmF1bHQgcGFyc2Vycy5cbiAgKlxuICAqICAgICBzdXBlcmFnZW50LnBhcnNlWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKHN0cil7XG4gICogICAgICAgcmV0dXJuIHsgb2JqZWN0IHBhcnNlZCBmcm9tIHN0ciB9O1xuICAqICAgICB9O1xuICAqXG4gICovXG5cbnJlcXVlc3QucGFyc2UgPSB7XG4gICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiBwYXJzZVN0cmluZyxcbiAgJ2FwcGxpY2F0aW9uL2pzb24nOiBKU09OLnBhcnNlXG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBoZWFkZXIgYHN0cmAgaW50b1xuICogYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG1hcHBlZCBmaWVsZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXIoc3RyKSB7XG4gIHZhciBsaW5lcyA9IHN0ci5zcGxpdCgvXFxyP1xcbi8pO1xuICB2YXIgZmllbGRzID0ge307XG4gIHZhciBpbmRleDtcbiAgdmFyIGxpbmU7XG4gIHZhciBmaWVsZDtcbiAgdmFyIHZhbDtcblxuICBsaW5lcy5wb3AoKTsgLy8gdHJhaWxpbmcgQ1JMRlxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGxpbmUgPSBsaW5lc1tpXTtcbiAgICBpbmRleCA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGZpZWxkID0gbGluZS5zbGljZSgwLCBpbmRleCkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB0cmltKGxpbmUuc2xpY2UoaW5kZXggKyAxKSk7XG4gICAgZmllbGRzW2ZpZWxkXSA9IHZhbDtcbiAgfVxuXG4gIHJldHVybiBmaWVsZHM7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYG1pbWVgIGlzIGpzb24gb3IgaGFzICtqc29uIHN0cnVjdHVyZWQgc3ludGF4IHN1ZmZpeC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWltZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzSlNPTihtaW1lKSB7XG4gIHJldHVybiAvW1xcLytdanNvblxcYi8udGVzdChtaW1lKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIG1pbWUgdHlwZSBmb3IgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHR5cGUoc3RyKXtcbiAgcmV0dXJuIHN0ci5zcGxpdCgvICo7ICovKS5zaGlmdCgpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaGVhZGVyIGZpZWxkIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyYW1zKHN0cil7XG4gIHJldHVybiByZWR1Y2Uoc3RyLnNwbGl0KC8gKjsgKi8pLCBmdW5jdGlvbihvYmosIHN0cil7XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KC8gKj0gKi8pXG4gICAgICAsIGtleSA9IHBhcnRzLnNoaWZ0KClcbiAgICAgICwgdmFsID0gcGFydHMuc2hpZnQoKTtcblxuICAgIGlmIChrZXkgJiYgdmFsKSBvYmpba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlYCB3aXRoIHRoZSBnaXZlbiBgeGhyYC5cbiAqXG4gKiAgLSBzZXQgZmxhZ3MgKC5vaywgLmVycm9yLCBldGMpXG4gKiAgLSBwYXJzZSBoZWFkZXJcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgQWxpYXNpbmcgYHN1cGVyYWdlbnRgIGFzIGByZXF1ZXN0YCBpcyBuaWNlOlxuICpcbiAqICAgICAgcmVxdWVzdCA9IHN1cGVyYWdlbnQ7XG4gKlxuICogIFdlIGNhbiB1c2UgdGhlIHByb21pc2UtbGlrZSBBUEksIG9yIHBhc3MgY2FsbGJhY2tzOlxuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nKS5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nLCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBTZW5kaW5nIGRhdGEgY2FuIGJlIGNoYWluZWQ6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnNlbmQoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAucG9zdCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogT3IgZnVydGhlciByZWR1Y2VkIHRvIGEgc2luZ2xlIGNhbGwgZm9yIHNpbXBsZSBjYXNlczpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBAcGFyYW0ge1hNTEhUVFBSZXF1ZXN0fSB4aHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBSZXNwb25zZShyZXEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMucmVxID0gcmVxO1xuICB0aGlzLnhociA9IHRoaXMucmVxLnhocjtcbiAgLy8gcmVzcG9uc2VUZXh0IGlzIGFjY2Vzc2libGUgb25seSBpZiByZXNwb25zZVR5cGUgaXMgJycgb3IgJ3RleHQnIGFuZCBvbiBvbGRlciBicm93c2Vyc1xuICB0aGlzLnRleHQgPSAoKHRoaXMucmVxLm1ldGhvZCAhPSdIRUFEJyAmJiAodGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAnJyB8fCB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JykpIHx8IHR5cGVvZiB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd1bmRlZmluZWQnKVxuICAgICA/IHRoaXMueGhyLnJlc3BvbnNlVGV4dFxuICAgICA6IG51bGw7XG4gIHRoaXMuc3RhdHVzVGV4dCA9IHRoaXMucmVxLnhoci5zdGF0dXNUZXh0O1xuICB0aGlzLnNldFN0YXR1c1Byb3BlcnRpZXModGhpcy54aHIuc3RhdHVzKTtcbiAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlcnMgPSBwYXJzZUhlYWRlcih0aGlzLnhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gIC8vIGdldEFsbFJlc3BvbnNlSGVhZGVycyBzb21ldGltZXMgZmFsc2VseSByZXR1cm5zIFwiXCIgZm9yIENPUlMgcmVxdWVzdHMsIGJ1dFxuICAvLyBnZXRSZXNwb25zZUhlYWRlciBzdGlsbCB3b3Jrcy4gc28gd2UgZ2V0IGNvbnRlbnQtdHlwZSBldmVuIGlmIGdldHRpbmdcbiAgLy8gb3RoZXIgaGVhZGVycyBmYWlscy5cbiAgdGhpcy5oZWFkZXJbJ2NvbnRlbnQtdHlwZSddID0gdGhpcy54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICB0aGlzLnNldEhlYWRlclByb3BlcnRpZXModGhpcy5oZWFkZXIpO1xuICB0aGlzLmJvZHkgPSB0aGlzLnJlcS5tZXRob2QgIT0gJ0hFQUQnXG4gICAgPyB0aGlzLnBhcnNlQm9keSh0aGlzLnRleHQgPyB0aGlzLnRleHQgOiB0aGlzLnhoci5yZXNwb25zZSlcbiAgICA6IG51bGw7XG59XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuaGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIHJlbGF0ZWQgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gYC50eXBlYCB0aGUgY29udGVudCB0eXBlIHdpdGhvdXQgcGFyYW1zXG4gKlxuICogQSByZXNwb25zZSBvZiBcIkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOFwiXG4gKiB3aWxsIHByb3ZpZGUgeW91IHdpdGggYSBgLnR5cGVgIG9mIFwidGV4dC9wbGFpblwiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRIZWFkZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24oaGVhZGVyKXtcbiAgLy8gY29udGVudC10eXBlXG4gIHZhciBjdCA9IHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSB8fCAnJztcbiAgdGhpcy50eXBlID0gdHlwZShjdCk7XG5cbiAgLy8gcGFyYW1zXG4gIHZhciBvYmogPSBwYXJhbXMoY3QpO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB0aGlzW2tleV0gPSBvYmpba2V5XTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGJvZHkgYHN0cmAuXG4gKlxuICogVXNlZCBmb3IgYXV0by1wYXJzaW5nIG9mIGJvZGllcy4gUGFyc2Vyc1xuICogYXJlIGRlZmluZWQgb24gdGhlIGBzdXBlcmFnZW50LnBhcnNlYCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUucGFyc2VCb2R5ID0gZnVuY3Rpb24oc3RyKXtcbiAgdmFyIHBhcnNlID0gcmVxdWVzdC5wYXJzZVt0aGlzLnR5cGVdO1xuICBpZiAoIXBhcnNlICYmIGlzSlNPTih0aGlzLnR5cGUpKSB7XG4gICAgcGFyc2UgPSByZXF1ZXN0LnBhcnNlWydhcHBsaWNhdGlvbi9qc29uJ107XG4gIH1cbiAgcmV0dXJuIHBhcnNlICYmIHN0ciAmJiAoc3RyLmxlbmd0aCB8fCBzdHIgaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgPyBwYXJzZShzdHIpXG4gICAgOiBudWxsO1xufTtcblxuLyoqXG4gKiBTZXQgZmxhZ3Mgc3VjaCBhcyBgLm9rYCBiYXNlZCBvbiBgc3RhdHVzYC5cbiAqXG4gKiBGb3IgZXhhbXBsZSBhIDJ4eCByZXNwb25zZSB3aWxsIGdpdmUgeW91IGEgYC5va2Agb2YgX190cnVlX19cbiAqIHdoZXJlYXMgNXh4IHdpbGwgYmUgX19mYWxzZV9fIGFuZCBgLmVycm9yYCB3aWxsIGJlIF9fdHJ1ZV9fLiBUaGVcbiAqIGAuY2xpZW50RXJyb3JgIGFuZCBgLnNlcnZlckVycm9yYCBhcmUgYWxzbyBhdmFpbGFibGUgdG8gYmUgbW9yZVxuICogc3BlY2lmaWMsIGFuZCBgLnN0YXR1c1R5cGVgIGlzIHRoZSBjbGFzcyBvZiBlcnJvciByYW5naW5nIGZyb20gMS4uNVxuICogc29tZXRpbWVzIHVzZWZ1bCBmb3IgbWFwcGluZyByZXNwb25kIGNvbG9ycyBldGMuXG4gKlxuICogXCJzdWdhclwiIHByb3BlcnRpZXMgYXJlIGFsc28gZGVmaW5lZCBmb3IgY29tbW9uIGNhc2VzLiBDdXJyZW50bHkgcHJvdmlkaW5nOlxuICpcbiAqICAgLSAubm9Db250ZW50XG4gKiAgIC0gLmJhZFJlcXVlc3RcbiAqICAgLSAudW5hdXRob3JpemVkXG4gKiAgIC0gLm5vdEFjY2VwdGFibGVcbiAqICAgLSAubm90Rm91bmRcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuc2V0U3RhdHVzUHJvcGVydGllcyA9IGZ1bmN0aW9uKHN0YXR1cyl7XG4gIC8vIGhhbmRsZSBJRTkgYnVnOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMDQ2OTcyL21zaWUtcmV0dXJucy1zdGF0dXMtY29kZS1vZi0xMjIzLWZvci1hamF4LXJlcXVlc3RcbiAgaWYgKHN0YXR1cyA9PT0gMTIyMykge1xuICAgIHN0YXR1cyA9IDIwNDtcbiAgfVxuXG4gIHZhciB0eXBlID0gc3RhdHVzIC8gMTAwIHwgMDtcblxuICAvLyBzdGF0dXMgLyBjbGFzc1xuICB0aGlzLnN0YXR1cyA9IHRoaXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgdGhpcy5zdGF0dXNUeXBlID0gdHlwZTtcblxuICAvLyBiYXNpY3NcbiAgdGhpcy5pbmZvID0gMSA9PSB0eXBlO1xuICB0aGlzLm9rID0gMiA9PSB0eXBlO1xuICB0aGlzLmNsaWVudEVycm9yID0gNCA9PSB0eXBlO1xuICB0aGlzLnNlcnZlckVycm9yID0gNSA9PSB0eXBlO1xuICB0aGlzLmVycm9yID0gKDQgPT0gdHlwZSB8fCA1ID09IHR5cGUpXG4gICAgPyB0aGlzLnRvRXJyb3IoKVxuICAgIDogZmFsc2U7XG5cbiAgLy8gc3VnYXJcbiAgdGhpcy5hY2NlcHRlZCA9IDIwMiA9PSBzdGF0dXM7XG4gIHRoaXMubm9Db250ZW50ID0gMjA0ID09IHN0YXR1cztcbiAgdGhpcy5iYWRSZXF1ZXN0ID0gNDAwID09IHN0YXR1cztcbiAgdGhpcy51bmF1dGhvcml6ZWQgPSA0MDEgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEFjY2VwdGFibGUgPSA0MDYgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEZvdW5kID0gNDA0ID09IHN0YXR1cztcbiAgdGhpcy5mb3JiaWRkZW4gPSA0MDMgPT0gc3RhdHVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYW4gYEVycm9yYCByZXByZXNlbnRhdGl2ZSBvZiB0aGlzIHJlc3BvbnNlLlxuICpcbiAqIEByZXR1cm4ge0Vycm9yfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUudG9FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciByZXEgPSB0aGlzLnJlcTtcbiAgdmFyIG1ldGhvZCA9IHJlcS5tZXRob2Q7XG4gIHZhciB1cmwgPSByZXEudXJsO1xuXG4gIHZhciBtc2cgPSAnY2Fubm90ICcgKyBtZXRob2QgKyAnICcgKyB1cmwgKyAnICgnICsgdGhpcy5zdGF0dXMgKyAnKSc7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IobXNnKTtcbiAgZXJyLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICBlcnIubWV0aG9kID0gbWV0aG9kO1xuICBlcnIudXJsID0gdXJsO1xuXG4gIHJldHVybiBlcnI7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgUmVzcG9uc2VgLlxuICovXG5cbnJlcXVlc3QuUmVzcG9uc2UgPSBSZXNwb25zZTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXF1ZXN0YCB3aXRoIHRoZSBnaXZlbiBgbWV0aG9kYCBhbmQgYHVybGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBSZXF1ZXN0KG1ldGhvZCwgdXJsKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fcXVlcnkgPSB0aGlzLl9xdWVyeSB8fCBbXTtcbiAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gIHRoaXMudXJsID0gdXJsO1xuICB0aGlzLmhlYWRlciA9IHt9OyAvLyBwcmVzZXJ2ZXMgaGVhZGVyIG5hbWUgY2FzZVxuICB0aGlzLl9oZWFkZXIgPSB7fTsgLy8gY29lcmNlcyBoZWFkZXIgbmFtZXMgdG8gbG93ZXJjYXNlXG4gIHRoaXMub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGVyciA9IG51bGw7XG4gICAgdmFyIHJlcyA9IG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgcmVzID0gbmV3IFJlc3BvbnNlKHNlbGYpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKCdQYXJzZXIgaXMgdW5hYmxlIHRvIHBhcnNlIHRoZSByZXNwb25zZScpO1xuICAgICAgZXJyLnBhcnNlID0gdHJ1ZTtcbiAgICAgIGVyci5vcmlnaW5hbCA9IGU7XG4gICAgICAvLyBpc3N1ZSAjNjc1OiByZXR1cm4gdGhlIHJhdyByZXNwb25zZSBpZiB0aGUgcmVzcG9uc2UgcGFyc2luZyBmYWlsc1xuICAgICAgZXJyLnJhd1Jlc3BvbnNlID0gc2VsZi54aHIgJiYgc2VsZi54aHIucmVzcG9uc2VUZXh0ID8gc2VsZi54aHIucmVzcG9uc2VUZXh0IDogbnVsbDtcbiAgICAgIC8vIGlzc3VlICM4NzY6IHJldHVybiB0aGUgaHR0cCBzdGF0dXMgY29kZSBpZiB0aGUgcmVzcG9uc2UgcGFyc2luZyBmYWlsc1xuICAgICAgZXJyLnN0YXR1c0NvZGUgPSBzZWxmLnhociAmJiBzZWxmLnhoci5zdGF0dXMgPyBzZWxmLnhoci5zdGF0dXMgOiBudWxsO1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyKTtcbiAgICB9XG5cbiAgICBzZWxmLmVtaXQoJ3Jlc3BvbnNlJywgcmVzKTtcblxuICAgIGlmIChlcnIpIHtcbiAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGVyciwgcmVzKTtcbiAgICB9XG5cbiAgICBpZiAocmVzLnN0YXR1cyA+PSAyMDAgJiYgcmVzLnN0YXR1cyA8IDMwMCkge1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyLCByZXMpO1xuICAgIH1cblxuICAgIHZhciBuZXdfZXJyID0gbmV3IEVycm9yKHJlcy5zdGF0dXNUZXh0IHx8ICdVbnN1Y2Nlc3NmdWwgSFRUUCByZXNwb25zZScpO1xuICAgIG5ld19lcnIub3JpZ2luYWwgPSBlcnI7XG4gICAgbmV3X2Vyci5yZXNwb25zZSA9IHJlcztcbiAgICBuZXdfZXJyLnN0YXR1cyA9IHJlcy5zdGF0dXM7XG5cbiAgICBzZWxmLmNhbGxiYWNrKG5ld19lcnIsIHJlcyk7XG4gIH0pO1xufVxuXG4vKipcbiAqIE1peGluIGBFbWl0dGVyYCBhbmQgYHJlcXVlc3RCYXNlYC5cbiAqL1xuXG5FbWl0dGVyKFJlcXVlc3QucHJvdG90eXBlKTtcbmZvciAodmFyIGtleSBpbiByZXF1ZXN0QmFzZSkge1xuICBSZXF1ZXN0LnByb3RvdHlwZVtrZXldID0gcmVxdWVzdEJhc2Vba2V5XTtcbn1cblxuLyoqXG4gKiBBYm9ydCB0aGUgcmVxdWVzdCwgYW5kIGNsZWFyIHBvdGVudGlhbCB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24oKXtcbiAgaWYgKHRoaXMuYWJvcnRlZCkgcmV0dXJuO1xuICB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICB0aGlzLnhociAmJiB0aGlzLnhoci5hYm9ydCgpO1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICB0aGlzLmVtaXQoJ2Fib3J0Jyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgQ29udGVudC1UeXBlIHRvIGB0eXBlYCwgbWFwcGluZyB2YWx1ZXMgZnJvbSBgcmVxdWVzdC50eXBlc2AuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgneG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCdhcHBsaWNhdGlvbi94bWwnKVxuICogICAgICAgIC5zZW5kKHhtbHN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnR5cGUgPSBmdW5jdGlvbih0eXBlKXtcbiAgdGhpcy5zZXQoJ0NvbnRlbnQtVHlwZScsIHJlcXVlc3QudHlwZXNbdHlwZV0gfHwgdHlwZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgcmVzcG9uc2VUeXBlIHRvIGB2YWxgLiBQcmVzZW50bHkgdmFsaWQgcmVzcG9uc2VUeXBlcyBhcmUgJ2Jsb2InIGFuZCBcbiAqICdhcnJheWJ1ZmZlcicuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAucmVzcG9uc2VUeXBlKCdibG9iJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUucmVzcG9uc2VUeXBlID0gZnVuY3Rpb24odmFsKXtcbiAgdGhpcy5fcmVzcG9uc2VUeXBlID0gdmFsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEFjY2VwdCB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy5qc29uID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWNjZXB0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYWNjZXB0ID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdBY2NlcHQnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEF1dGhvcml6YXRpb24gZmllbGQgdmFsdWUgd2l0aCBgdXNlcmAgYW5kIGBwYXNzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlclxuICogQHBhcmFtIHtTdHJpbmd9IHBhc3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIHdpdGggJ3R5cGUnIHByb3BlcnR5ICdhdXRvJyBvciAnYmFzaWMnIChkZWZhdWx0ICdiYXNpYycpXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXV0aCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3MsIG9wdGlvbnMpe1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge1xuICAgICAgdHlwZTogJ2Jhc2ljJ1xuICAgIH1cbiAgfVxuXG4gIHN3aXRjaCAob3B0aW9ucy50eXBlKSB7XG4gICAgY2FzZSAnYmFzaWMnOlxuICAgICAgdmFyIHN0ciA9IGJ0b2EodXNlciArICc6JyArIHBhc3MpO1xuICAgICAgdGhpcy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmFzaWMgJyArIHN0cik7XG4gICAgYnJlYWs7XG5cbiAgICBjYXNlICdhdXRvJzpcbiAgICAgIHRoaXMudXNlcm5hbWUgPSB1c2VyO1xuICAgICAgdGhpcy5wYXNzd29yZCA9IHBhc3M7XG4gICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiogQWRkIHF1ZXJ5LXN0cmluZyBgdmFsYC5cbipcbiogRXhhbXBsZXM6XG4qXG4qICAgcmVxdWVzdC5nZXQoJy9zaG9lcycpXG4qICAgICAucXVlcnkoJ3NpemU9MTAnKVxuKiAgICAgLnF1ZXJ5KHsgY29sb3I6ICdibHVlJyB9KVxuKlxuKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IHZhbFxuKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiogQGFwaSBwdWJsaWNcbiovXG5cblJlcXVlc3QucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24odmFsKXtcbiAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHZhbCA9IHNlcmlhbGl6ZSh2YWwpO1xuICBpZiAodmFsKSB0aGlzLl9xdWVyeS5wdXNoKHZhbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBRdWV1ZSB0aGUgZ2l2ZW4gYGZpbGVgIGFzIGFuIGF0dGFjaG1lbnQgdG8gdGhlIHNwZWNpZmllZCBgZmllbGRgLFxuICogd2l0aCBvcHRpb25hbCBgZmlsZW5hbWVgLlxuICpcbiAqIGBgYCBqc1xuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmF0dGFjaChuZXcgQmxvYihbJzxhIGlkPVwiYVwiPjxiIGlkPVwiYlwiPmhleSE8L2I+PC9hPiddLCB7IHR5cGU6IFwidGV4dC9odG1sXCJ9KSlcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEBwYXJhbSB7QmxvYnxGaWxlfSBmaWxlXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbihmaWVsZCwgZmlsZSwgZmlsZW5hbWUpe1xuICB0aGlzLl9nZXRGb3JtRGF0YSgpLmFwcGVuZChmaWVsZCwgZmlsZSwgZmlsZW5hbWUgfHwgZmlsZS5uYW1lKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5fZ2V0Rm9ybURhdGEgPSBmdW5jdGlvbigpe1xuICBpZiAoIXRoaXMuX2Zvcm1EYXRhKSB7XG4gICAgdGhpcy5fZm9ybURhdGEgPSBuZXcgcm9vdC5Gb3JtRGF0YSgpO1xuICB9XG4gIHJldHVybiB0aGlzLl9mb3JtRGF0YTtcbn07XG5cbi8qKlxuICogU2VuZCBgZGF0YWAgYXMgdGhlIHJlcXVlc3QgYm9keSwgZGVmYXVsdGluZyB0aGUgYC50eXBlKClgIHRvIFwianNvblwiIHdoZW5cbiAqIGFuIG9iamVjdCBpcyBnaXZlbi5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgICAvLyBtYW51YWwganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdqc29uJylcbiAqICAgICAgICAgLnNlbmQoJ3tcIm5hbWVcIjpcInRqXCJ9JylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtYW51YWwgeC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCgnbmFtZT10aicpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGRlZmF1bHRzIHRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICAqICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gICogICAgICAgIC5zZW5kKCduYW1lPXRvYmknKVxuICAqICAgICAgICAuc2VuZCgnc3BlY2llcz1mZXJyZXQnKVxuICAqICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZGF0YVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihkYXRhKXtcbiAgdmFyIG9iaiA9IGlzT2JqZWN0KGRhdGEpO1xuICB2YXIgdHlwZSA9IHRoaXMuX2hlYWRlclsnY29udGVudC10eXBlJ107XG5cbiAgLy8gbWVyZ2VcbiAgaWYgKG9iaiAmJiBpc09iamVjdCh0aGlzLl9kYXRhKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICB0aGlzLl9kYXRhW2tleV0gPSBkYXRhW2tleV07XG4gICAgfVxuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBkYXRhKSB7XG4gICAgaWYgKCF0eXBlKSB0aGlzLnR5cGUoJ2Zvcm0nKTtcbiAgICB0eXBlID0gdGhpcy5faGVhZGVyWydjb250ZW50LXR5cGUnXTtcbiAgICBpZiAoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgPT0gdHlwZSkge1xuICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGFcbiAgICAgICAgPyB0aGlzLl9kYXRhICsgJyYnICsgZGF0YVxuICAgICAgICA6IGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RhdGEgPSAodGhpcy5fZGF0YSB8fCAnJykgKyBkYXRhO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfVxuXG4gIGlmICghb2JqIHx8IGlzSG9zdChkYXRhKSkgcmV0dXJuIHRoaXM7XG4gIGlmICghdHlwZSkgdGhpcy50eXBlKCdqc29uJyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICovXG5SZXNwb25zZS5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbiBzZXJpYWxpemUoZm4pe1xuICBpZiAocm9vdC5jb25zb2xlKSB7XG4gICAgY29uc29sZS53YXJuKFwiQ2xpZW50LXNpZGUgcGFyc2UoKSBtZXRob2QgaGFzIGJlZW4gcmVuYW1lZCB0byBzZXJpYWxpemUoKS4gVGhpcyBtZXRob2QgaXMgbm90IGNvbXBhdGlibGUgd2l0aCBzdXBlcmFnZW50IHYyLjBcIik7XG4gIH1cbiAgdGhpcy5zZXJpYWxpemUoZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbiBzZXJpYWxpemUoZm4pe1xuICB0aGlzLl9wYXJzZXIgPSBmbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEludm9rZSB0aGUgY2FsbGJhY2sgd2l0aCBgZXJyYCBhbmQgYHJlc2BcbiAqIGFuZCBoYW5kbGUgYXJpdHkgY2hlY2suXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNhbGxiYWNrID0gZnVuY3Rpb24oZXJyLCByZXMpe1xuICB2YXIgZm4gPSB0aGlzLl9jYWxsYmFjaztcbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcbiAgZm4oZXJyLCByZXMpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB4LWRvbWFpbiBlcnJvci5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jcm9zc0RvbWFpbkVycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcignUmVxdWVzdCBoYXMgYmVlbiB0ZXJtaW5hdGVkXFxuUG9zc2libGUgY2F1c2VzOiB0aGUgbmV0d29yayBpcyBvZmZsaW5lLCBPcmlnaW4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luLCB0aGUgcGFnZSBpcyBiZWluZyB1bmxvYWRlZCwgZXRjLicpO1xuICBlcnIuY3Jvc3NEb21haW4gPSB0cnVlO1xuXG4gIGVyci5zdGF0dXMgPSB0aGlzLnN0YXR1cztcbiAgZXJyLm1ldGhvZCA9IHRoaXMubWV0aG9kO1xuICBlcnIudXJsID0gdGhpcy51cmw7XG5cbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB0aW1lb3V0IGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnRpbWVvdXRFcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dDtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcigndGltZW91dCBvZiAnICsgdGltZW91dCArICdtcyBleGNlZWRlZCcpO1xuICBlcnIudGltZW91dCA9IHRpbWVvdXQ7XG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8qKlxuICogRW5hYmxlIHRyYW5zbWlzc2lvbiBvZiBjb29raWVzIHdpdGggeC1kb21haW4gcmVxdWVzdHMuXG4gKlxuICogTm90ZSB0aGF0IGZvciB0aGlzIHRvIHdvcmsgdGhlIG9yaWdpbiBtdXN0IG5vdCBiZVxuICogdXNpbmcgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiB3aXRoIGEgd2lsZGNhcmQsXG4gKiBhbmQgYWxzbyBtdXN0IHNldCBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXCJcbiAqIHRvIFwidHJ1ZVwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUud2l0aENyZWRlbnRpYWxzID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5fd2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEluaXRpYXRlIHJlcXVlc3QsIGludm9raW5nIGNhbGxiYWNrIGBmbihyZXMpYFxuICogd2l0aCBhbiBpbnN0YW5jZW9mIGBSZXNwb25zZWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHhociA9IHRoaXMueGhyID0gcmVxdWVzdC5nZXRYSFIoKTtcbiAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcnkuam9pbignJicpO1xuICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXQ7XG4gIHZhciBkYXRhID0gdGhpcy5fZm9ybURhdGEgfHwgdGhpcy5fZGF0YTtcblxuICAvLyBzdG9yZSBjYWxsYmFja1xuICB0aGlzLl9jYWxsYmFjayA9IGZuIHx8IG5vb3A7XG5cbiAgLy8gc3RhdGUgY2hhbmdlXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuICAgIGlmICg0ICE9IHhoci5yZWFkeVN0YXRlKSByZXR1cm47XG5cbiAgICAvLyBJbiBJRTksIHJlYWRzIHRvIGFueSBwcm9wZXJ0eSAoZS5nLiBzdGF0dXMpIG9mZiBvZiBhbiBhYm9ydGVkIFhIUiB3aWxsXG4gICAgLy8gcmVzdWx0IGluIHRoZSBlcnJvciBcIkNvdWxkIG5vdCBjb21wbGV0ZSB0aGUgb3BlcmF0aW9uIGR1ZSB0byBlcnJvciBjMDBjMDIzZlwiXG4gICAgdmFyIHN0YXR1cztcbiAgICB0cnkgeyBzdGF0dXMgPSB4aHIuc3RhdHVzIH0gY2F0Y2goZSkgeyBzdGF0dXMgPSAwOyB9XG5cbiAgICBpZiAoMCA9PSBzdGF0dXMpIHtcbiAgICAgIGlmIChzZWxmLnRpbWVkb3V0KSByZXR1cm4gc2VsZi50aW1lb3V0RXJyb3IoKTtcbiAgICAgIGlmIChzZWxmLmFib3J0ZWQpIHJldHVybjtcbiAgICAgIHJldHVybiBzZWxmLmNyb3NzRG9tYWluRXJyb3IoKTtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdlbmQnKTtcbiAgfTtcblxuICAvLyBwcm9ncmVzc1xuICB2YXIgaGFuZGxlUHJvZ3Jlc3MgPSBmdW5jdGlvbihlKXtcbiAgICBpZiAoZS50b3RhbCA+IDApIHtcbiAgICAgIGUucGVyY2VudCA9IGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMDtcbiAgICB9XG4gICAgZS5kaXJlY3Rpb24gPSAnZG93bmxvYWQnO1xuICAgIHNlbGYuZW1pdCgncHJvZ3Jlc3MnLCBlKTtcbiAgfTtcbiAgaWYgKHRoaXMuaGFzTGlzdGVuZXJzKCdwcm9ncmVzcycpKSB7XG4gICAgeGhyLm9ucHJvZ3Jlc3MgPSBoYW5kbGVQcm9ncmVzcztcbiAgfVxuICB0cnkge1xuICAgIGlmICh4aHIudXBsb2FkICYmIHRoaXMuaGFzTGlzdGVuZXJzKCdwcm9ncmVzcycpKSB7XG4gICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBoYW5kbGVQcm9ncmVzcztcbiAgICB9XG4gIH0gY2F0Y2goZSkge1xuICAgIC8vIEFjY2Vzc2luZyB4aHIudXBsb2FkIGZhaWxzIGluIElFIGZyb20gYSB3ZWIgd29ya2VyLCBzbyBqdXN0IHByZXRlbmQgaXQgZG9lc24ndCBleGlzdC5cbiAgICAvLyBSZXBvcnRlZCBoZXJlOlxuICAgIC8vIGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvODM3MjQ1L3htbGh0dHByZXF1ZXN0LXVwbG9hZC10aHJvd3MtaW52YWxpZC1hcmd1bWVudC13aGVuLXVzZWQtZnJvbS13ZWItd29ya2VyLWNvbnRleHRcbiAgfVxuXG4gIC8vIHRpbWVvdXRcbiAgaWYgKHRpbWVvdXQgJiYgIXRoaXMuX3RpbWVyKSB7XG4gICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBzZWxmLnRpbWVkb3V0ID0gdHJ1ZTtcbiAgICAgIHNlbGYuYWJvcnQoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIC8vIHF1ZXJ5c3RyaW5nXG4gIGlmIChxdWVyeSkge1xuICAgIHF1ZXJ5ID0gcmVxdWVzdC5zZXJpYWxpemVPYmplY3QocXVlcnkpO1xuICAgIHRoaXMudXJsICs9IH50aGlzLnVybC5pbmRleE9mKCc/JylcbiAgICAgID8gJyYnICsgcXVlcnlcbiAgICAgIDogJz8nICsgcXVlcnk7XG4gIH1cblxuICAvLyBpbml0aWF0ZSByZXF1ZXN0XG4gIGlmICh0aGlzLnVzZXJuYW1lICYmIHRoaXMucGFzc3dvcmQpIHtcbiAgICB4aHIub3Blbih0aGlzLm1ldGhvZCwgdGhpcy51cmwsIHRydWUsIHRoaXMudXNlcm5hbWUsIHRoaXMucGFzc3dvcmQpO1xuICB9IGVsc2Uge1xuICAgIHhoci5vcGVuKHRoaXMubWV0aG9kLCB0aGlzLnVybCwgdHJ1ZSk7XG4gIH1cblxuICAvLyBDT1JTXG4gIGlmICh0aGlzLl93aXRoQ3JlZGVudGlhbHMpIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXG4gIC8vIGJvZHlcbiAgaWYgKCdHRVQnICE9IHRoaXMubWV0aG9kICYmICdIRUFEJyAhPSB0aGlzLm1ldGhvZCAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgZGF0YSAmJiAhaXNIb3N0KGRhdGEpKSB7XG4gICAgLy8gc2VyaWFsaXplIHN0dWZmXG4gICAgdmFyIGNvbnRlbnRUeXBlID0gdGhpcy5faGVhZGVyWydjb250ZW50LXR5cGUnXTtcbiAgICB2YXIgc2VyaWFsaXplID0gdGhpcy5fcGFyc2VyIHx8IHJlcXVlc3Quc2VyaWFsaXplW2NvbnRlbnRUeXBlID8gY29udGVudFR5cGUuc3BsaXQoJzsnKVswXSA6ICcnXTtcbiAgICBpZiAoIXNlcmlhbGl6ZSAmJiBpc0pTT04oY29udGVudFR5cGUpKSBzZXJpYWxpemUgPSByZXF1ZXN0LnNlcmlhbGl6ZVsnYXBwbGljYXRpb24vanNvbiddO1xuICAgIGlmIChzZXJpYWxpemUpIGRhdGEgPSBzZXJpYWxpemUoZGF0YSk7XG4gIH1cblxuICAvLyBzZXQgaGVhZGVyIGZpZWxkc1xuICBmb3IgKHZhciBmaWVsZCBpbiB0aGlzLmhlYWRlcikge1xuICAgIGlmIChudWxsID09IHRoaXMuaGVhZGVyW2ZpZWxkXSkgY29udGludWU7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoZmllbGQsIHRoaXMuaGVhZGVyW2ZpZWxkXSk7XG4gIH1cblxuICBpZiAodGhpcy5fcmVzcG9uc2VUeXBlKSB7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX3Jlc3BvbnNlVHlwZTtcbiAgfVxuXG4gIC8vIHNlbmQgc3R1ZmZcbiAgdGhpcy5lbWl0KCdyZXF1ZXN0JywgdGhpcyk7XG5cbiAgLy8gSUUxMSB4aHIuc2VuZCh1bmRlZmluZWQpIHNlbmRzICd1bmRlZmluZWQnIHN0cmluZyBhcyBQT1NUIHBheWxvYWQgKGluc3RlYWQgb2Ygbm90aGluZylcbiAgLy8gV2UgbmVlZCBudWxsIGhlcmUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgeGhyLnNlbmQodHlwZW9mIGRhdGEgIT09ICd1bmRlZmluZWQnID8gZGF0YSA6IG51bGwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBFeHBvc2UgYFJlcXVlc3RgLlxuICovXG5cbnJlcXVlc3QuUmVxdWVzdCA9IFJlcXVlc3Q7XG5cbi8qKlxuICogR0VUIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IGRhdGEgb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmdldCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnR0VUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEucXVlcnkoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIEhFQUQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuaGVhZCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnSEVBRCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIERFTEVURSBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGVsKHVybCwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnREVMRVRFJywgdXJsKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbnJlcXVlc3RbJ2RlbCddID0gZGVsO1xucmVxdWVzdFsnZGVsZXRlJ10gPSBkZWw7XG5cbi8qKlxuICogUEFUQ0ggYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBkYXRhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wYXRjaCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUEFUQ0gnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQT1NUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gZGF0YVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucG9zdCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUE9TVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBVVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IGRhdGEgb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnB1dCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUFVUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG4iLCIvKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gIHJldHVybiBudWxsICE9IG9iaiAmJiAnb2JqZWN0JyA9PSB0eXBlb2Ygb2JqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBNb2R1bGUgb2YgbWl4ZWQtaW4gZnVuY3Rpb25zIHNoYXJlZCBiZXR3ZWVuIG5vZGUgYW5kIGNsaWVudCBjb2RlXG4gKi9cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXMtb2JqZWN0Jyk7XG5cbi8qKlxuICogQ2xlYXIgcHJldmlvdXMgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5jbGVhclRpbWVvdXQgPSBmdW5jdGlvbiBfY2xlYXJUaW1lb3V0KCl7XG4gIHRoaXMuX3RpbWVvdXQgPSAwO1xuICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRm9yY2UgZ2l2ZW4gcGFyc2VyXG4gKlxuICogU2V0cyB0aGUgYm9keSBwYXJzZXIgbm8gbWF0dGVyIHR5cGUuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlKGZuKXtcbiAgdGhpcy5fcGFyc2VyID0gZm47XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgdGltZW91dCB0byBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMudGltZW91dCA9IGZ1bmN0aW9uIHRpbWVvdXQobXMpe1xuICB0aGlzLl90aW1lb3V0ID0gbXM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBGYXV4IHByb21pc2Ugc3VwcG9ydFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdFxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqL1xuXG5leHBvcnRzLnRoZW4gPSBmdW5jdGlvbiB0aGVuKGZ1bGZpbGwsIHJlamVjdCkge1xuICByZXR1cm4gdGhpcy5lbmQoZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBlcnIgPyByZWplY3QoZXJyKSA6IGZ1bGZpbGwocmVzKTtcbiAgfSk7XG59XG5cbi8qKlxuICogQWxsb3cgZm9yIGV4dGVuc2lvblxuICovXG5cbmV4cG9ydHMudXNlID0gZnVuY3Rpb24gdXNlKGZuKSB7XG4gIGZuKHRoaXMpO1xuICByZXR1cm4gdGhpcztcbn1cblxuXG4vKipcbiAqIEdldCByZXF1ZXN0IGhlYWRlciBgZmllbGRgLlxuICogQ2FzZS1pbnNlbnNpdGl2ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIHJldHVybiB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG59O1xuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGhlYWRlciBgZmllbGRgIHZhbHVlLlxuICogVGhpcyBpcyBhIGRlcHJlY2F0ZWQgaW50ZXJuYWwgQVBJLiBVc2UgYC5nZXQoZmllbGQpYCBpbnN0ZWFkLlxuICpcbiAqIChnZXRIZWFkZXIgaXMgbm8gbG9uZ2VyIHVzZWQgaW50ZXJuYWxseSBieSB0aGUgc3VwZXJhZ2VudCBjb2RlIGJhc2UpXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqIEBkZXByZWNhdGVkXG4gKi9cblxuZXhwb3J0cy5nZXRIZWFkZXIgPSBleHBvcnRzLmdldDtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIGBmaWVsZGAgdG8gYHZhbGAsIG9yIG11bHRpcGxlIGZpZWxkcyB3aXRoIG9uZSBvYmplY3QuXG4gKiBDYXNlLWluc2Vuc2l0aXZlLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCgnQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5zZXQoJ1gtQVBJLUtleScsICdmb29iYXInKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCh7IEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLCAnWC1BUEktS2V5JzogJ2Zvb2JhcicgfSlcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGZpZWxkXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5zZXQgPSBmdW5jdGlvbihmaWVsZCwgdmFsKXtcbiAgaWYgKGlzT2JqZWN0KGZpZWxkKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBmaWVsZCkge1xuICAgICAgdGhpcy5zZXQoa2V5LCBmaWVsZFtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldID0gdmFsO1xuICB0aGlzLmhlYWRlcltmaWVsZF0gPSB2YWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgaGVhZGVyIGBmaWVsZGAuXG4gKiBDYXNlLWluc2Vuc2l0aXZlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAudW5zZXQoJ1VzZXItQWdlbnQnKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICovXG5leHBvcnRzLnVuc2V0ID0gZnVuY3Rpb24oZmllbGQpe1xuICBkZWxldGUgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xuICBkZWxldGUgdGhpcy5oZWFkZXJbZmllbGRdO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogV3JpdGUgdGhlIGZpZWxkIGBuYW1lYCBhbmQgYHZhbGAgZm9yIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiXG4gKiByZXF1ZXN0IGJvZGllcy5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5maWVsZCgnZm9vJywgJ2JhcicpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfEJsb2J8RmlsZXxCdWZmZXJ8ZnMuUmVhZFN0cmVhbX0gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydHMuZmllbGQgPSBmdW5jdGlvbihuYW1lLCB2YWwpIHtcbiAgdGhpcy5fZ2V0Rm9ybURhdGEoKS5hcHBlbmQobmFtZSwgdmFsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuIiwiLy8gVGhlIG5vZGUgYW5kIGJyb3dzZXIgbW9kdWxlcyBleHBvc2UgdmVyc2lvbnMgb2YgdGhpcyB3aXRoIHRoZVxuLy8gYXBwcm9wcmlhdGUgY29uc3RydWN0b3IgZnVuY3Rpb24gYm91bmQgYXMgZmlyc3QgYXJndW1lbnRcbi8qKlxuICogSXNzdWUgYSByZXF1ZXN0OlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgIHJlcXVlc3QoJ0dFVCcsICcvdXNlcnMnKS5lbmQoY2FsbGJhY2spXG4gKiAgICByZXF1ZXN0KCcvdXNlcnMnKS5lbmQoY2FsbGJhY2spXG4gKiAgICByZXF1ZXN0KCcvdXNlcnMnLCBjYWxsYmFjaylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gdXJsIG9yIGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiByZXF1ZXN0KFJlcXVlc3RDb25zdHJ1Y3RvciwgbWV0aG9kLCB1cmwpIHtcbiAgLy8gY2FsbGJhY2tcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHVybCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdENvbnN0cnVjdG9yKCdHRVQnLCBtZXRob2QpLmVuZCh1cmwpO1xuICB9XG5cbiAgLy8gdXJsIGZpcnN0XG4gIGlmICgyID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3RDb25zdHJ1Y3RvcignR0VUJywgbWV0aG9kKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVxdWVzdENvbnN0cnVjdG9yKG1ldGhvZCwgdXJsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1ZXN0O1xuIiwiLy8gZWxlbWVudHMgdGhhdCBuZWVkIGNoYXJ0cyBjYW4gcHVzaCB0byB0aGlzIGFycmF5IGNhbGxiYWNrcyBmb3Igd2hlbiBjaGFydHMgYXJlIGxvYWRlZFxudmFyIGNoYXJ0TG9hZEhhbmRsZXJzID0gW107XG5cbmdvb2dsZS5sb2FkKFwidmlzdWFsaXphdGlvblwiLCAnMScsIHtcbiAgICBwYWNrYWdlczpbJ2NvcmVjaGFydCcsICdsaW5lJ10sXG4gICAgY2FsbGJhY2sgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBjaGFydExvYWRIYW5kbGVycy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIGNoYXJ0TG9hZEhhbmRsZXJzW2ldKCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjaGFydExvYWRIYW5kbGVyczsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgbm9kZXMgOiByZXF1aXJlKCcuL25vZGVzJyksXG4gIHJlZ2lvbnMgOiByZXF1aXJlKCcuL3JlZ2lvbnMnKVxufSIsInZhciByZXN0ID0gcmVxdWlyZSgnLi4vcmVzdCcpO1xuXG5mdW5jdGlvbiBOb2RlQ29sbGVjdGlvbigpe1xuXG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgIHRoaXMubGlua3MgPSBbXTtcbiAgICB0aGlzLmV4dHJhcyA9IHt9OyAvLyBleHRyYSBkYXRhIGZvciBub2RlXG5cbiAgICB0aGlzLmluZGV4ID0ge1xuICAgICAgcHJtbmFtZSA6IHt9LFxuICAgICAgaG9iYmVzSWQgOiB7fSxcbiAgICAgIG9yaWdpbnMgOiB7fSxcbiAgICAgIHRlcm1pbmFscyA6IHt9XG4gICAgfTtcblxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKG5vZGVzKSB7XG4gICAgICB0aGlzLm5vZGVzID0gW107XG4gICAgICB0aGlzLmxpbmtzID0gW107XG4gICAgICB0aGlzLmV4dHJhcyA9IHt9O1xuXG4gICAgICB0aGlzLmluZGV4ID0ge1xuICAgICAgICBwcm1uYW1lIDoge30sXG4gICAgICAgIGhvYmJlc0lkIDoge30sXG4gICAgICAgIG9yaWdpbnMgOiB7fSxcbiAgICAgICAgdGVybWluYWxzIDoge31cbiAgICAgIH07XG5cbiAgICAgIG5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgdGhpcy5pbmRleC5wcm1uYW1lW25vZGUucHJvcGVydGllcy5wcm1uYW1lXSA9IG5vZGU7XG4gICAgICAgIHRoaXMuaW5kZXguaG9iYmVzSWRbbm9kZS5wcm9wZXJ0aWVzLmhvYmJlcy5pZF0gPSBub2RlO1xuXG4gICAgICAgIGlmKCBub2RlLnByb3BlcnRpZXMuaG9iYmVzLnR5cGUgPT09ICdsaW5rJyApIHtcbiAgICAgICAgICB0aGlzLmxpbmtzLnB1c2gobm9kZSk7XG4gICAgICAgICAgdGhpcy5zZXRMaW5rSW5kZXhlcyhub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuc2V0TGlua0luZGV4ZXMgPSBmdW5jdGlvbihsaW5rKSB7XG4gICAgICAgIGlmKCAhdGhpcy5pbmRleC5vcmlnaW5zW2xpbmsucHJvcGVydGllcy5vcmlnaW5dICkge1xuICAgICAgICAgICAgdGhpcy5pbmRleC5vcmlnaW5zW2xpbmsucHJvcGVydGllcy5vcmlnaW5dID0gW2xpbmtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbmRleC5vcmlnaW5zW2xpbmsucHJvcGVydGllcy5vcmlnaW5dLnB1c2gobGluayk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggIXRoaXMuaW5kZXgudGVybWluYWxzW2xpbmsucHJvcGVydGllcy50ZXJtaW51c10gKSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4LnRlcm1pbmFsc1tsaW5rLnByb3BlcnRpZXMudGVybWludXNdID0gW2xpbmtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbmRleC50ZXJtaW5hbHNbbGluay5wcm9wZXJ0aWVzLnRlcm1pbnVzXS5wdXNoKGxpbmspO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5nZXRFeHRyYXMgPSBmdW5jdGlvbihwcm1uYW1lLCBjYWxsYmFjaykge1xuICAgICAgaWYoIHRoaXMuZXh0cmFzW3BybW5hbWVdICkge1xuICAgICAgICBpZiggdGhpcy5leHRyYXNbcHJtbmFtZV0uX19sb2FkaW5nX18gKSB7XG4gICAgICAgICAgdGhpcy5leHRyYXNbcHJtbmFtZV0uaGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2sodGhpcy5leHRyYXNbcHJtbmFtZV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5leHRyYXNbcHJtbmFtZV0gPSB7XG4gICAgICAgIF9fbG9hZGluZ19fIDogdHJ1ZSxcbiAgICAgICAgaGFuZGxlcnMgOiBbY2FsbGJhY2tdXG4gICAgICB9O1xuXG4gICAgICByZXN0LmdldEV4dHJhcyhwcm1uYW1lLCAocmVzcCkgPT4ge1xuICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMuZXh0cmFzW3BybW5hbWVdLmhhbmRsZXJzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgIHRoaXMuZXh0cmFzW3BybW5hbWVdLmhhbmRsZXJzW2ldKHJlc3ApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXh0cmFzW3BybW5hbWVdID0gcmVzcDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0QnlQcm1uYW1lID0gZnVuY3Rpb24ocHJtbmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXgucHJtbmFtZVtwcm1uYW1lXTtcbiAgICB9XG5cbiAgICB0aGlzLmdldEJ5SWQgPSBmdW5jdGlvbihpZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXguaG9iYmVzSWRbaWRdO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0T3JpZ2lucyA9IGZ1bmN0aW9uKHBybW5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmluZGV4Lm9yaWdpbnNbcHJtbmFtZV07XG4gICAgfVxuXG4gICAgdGhpcy5nZXRUZXJtaW5hbHMgPSBmdW5jdGlvbihwcm1uYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRleC50ZXJtaW5hbHNbcHJtbmFtZV07XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBOb2RlQ29sbGVjdGlvbigpOyIsInZhciByZXN0ID0gcmVxdWlyZSgnLi4vcmVzdCcpO1xuXG5mdW5jdGlvbiBSZWdpb25Db2xsZWN0aW9uKCl7XG4gICAgdGhpcy5pbmRleCA9IHtcbiAgICAgIG5hbWUgOiB7fSxcbiAgICAgIGhvYmJlc0lkIDoge30sXG4gICAgfTtcblxuICAgIHRoaXMuZGF0YSA9IFtdLFxuICAgIHRoaXMuYWdncmVnYXRlID0ge307XG5cbiAgICB0aGlzLmluaXQgPSBmdW5jdGlvbihyZWdpb25zKSB7XG4gICAgICB0aGlzLmluZGV4ID0ge1xuICAgICAgICBuYW1lIDoge30sXG4gICAgICAgIGhvYmJlc0lkIDoge31cbiAgICAgIH07XG4gICAgICB0aGlzLmFnZ3JlZ2F0ZSA9IHt9O1xuXG4gICAgICByZWdpb25zLmZvckVhY2goKHJlZ2lvbikgPT4ge1xuICAgICAgICB0aGlzLmluZGV4Lm5hbWVbcmVnaW9uLnByb3BlcnRpZXMubmFtZV0gPSByZWdpb247XG4gICAgICAgIHRoaXMuaW5kZXguaG9iYmVzSWRbcmVnaW9uLnByb3BlcnRpZXMuaG9iYmVzLmlkXSA9IHJlZ2lvbjtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmRhdGEgPSByZWdpb25zO1xuICAgIH1cblxuICAgIHRoaXMubG9hZEFnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKHR5cGUsIG9yaWdpbiwgdGVybWludXMsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgcHJtbmFtZSA9IG9yaWdpbjtcbiAgICAgIGlmKCB0eXBlb2YgdGVybWludXMgPT09ICdzdHJpbmcnICkge1xuICAgICAgICBwcm1uYW1lID0gcHJtbmFtZSsnLS0nK3Rlcm1pbnVzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sgPSB0ZXJtaW51cztcbiAgICAgIH1cblxuXG4gICAgICBpZiggIXRoaXMuYWdncmVnYXRlW3R5cGVdICkge1xuICAgICAgICB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXSA9IHt9O1xuICAgICAgfVxuXG4gICAgICBpZiggdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0gKSB7XG4gICAgICAgIGlmKCB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXS5fX2xvYWRpbmdfXyApIHtcbiAgICAgICAgICB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXS5oYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayh0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXSA9IHtcbiAgICAgICAgX19sb2FkaW5nX18gOiB0cnVlLFxuICAgICAgICBoYW5kbGVycyA6IFtjYWxsYmFja11cbiAgICAgIH07XG5cbiAgICAgIGlmKCB0eXBlb2YgdGVybWludXMgIT09ICdzdHJpbmcnICkge1xuICAgICAgICByZXN0LmdldEFnZ3JlZ2F0ZSh7dHlwZTogdHlwZSwgcmVnaW9uOiBvcmlnaW59LCAocmVzcCkgPT4ge1xuICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0uaGFuZGxlcnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXS5oYW5kbGVyc1tpXShyZXNwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0gPSByZXNwO1xuICAgICAgICB9KTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdC5nZXRBZ2dyZWdhdGUoe3R5cGU6ICdmbG93Jywgb3JpZ2luOiBvcmlnaW4sIHRlcm1pbnVzOiB0ZXJtaW51c30sIChyZXNwMSkgPT4ge1xuICAgICAgICAgIHJlc3QuZ2V0QWdncmVnYXRlKHt0eXBlOiAnZmxvdycsIG9yaWdpbjogdGVybWludXMsIHRlcm1pbnVzOiBvcmlnaW59LCAocmVzcDIpID0+IHtcbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICBvcmlnaW4gOiByZXNwMSxcbiAgICAgICAgICAgICAgdGVybWludXMgOiByZXNwMlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXS5oYW5kbGVycy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0uaGFuZGxlcnNbaV0oZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXSA9IGRhdGE7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZ2V0QnlOYW1lID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXgubmFtZVtuYW1lXTtcbiAgICB9XG5cbiAgICB0aGlzLmdldEJ5SWQgPSBmdW5jdGlvbihpZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXguaG9iYmVzSWRbaWRdO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUmVnaW9uQ29sbGVjdGlvbigpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBuZXR3b3JrIDogcmVxdWlyZSgnLi9uZXR3b3JrJylcbn0iLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG52YXIgZXZlbnRzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG52YXIgbm9kZUNvbGxlY3Rpb24gPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9ub2RlcycpO1xudmFyIHJlZ2lvbnNDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvcmVnaW9ucycpO1xudmFyIHJlc3QgPSByZXF1aXJlKCcuLi9yZXN0Jyk7XG5cbmZ1bmN0aW9uIGxvYWROZXR3b3JrKGNhbGxiYWNrKSB7XG4gIGFwaS5sb2FkaW5nID0gdHJ1ZTtcbiAgZXZlbnRzLmVtaXQoJ2xvYWRpbmcnKTtcblxuICByZXN0LmxvYWROZXR3b3JrKChkYXRhKSA9PiB7XG4gICAgbm9kZUNvbGxlY3Rpb24uaW5pdChkYXRhLm5ldHdvcmspO1xuICAgIHByb2Nlc3NOb2Rlc0xpbmtzKGRhdGEubmV0d29yayk7XG5cbiAgICByZWdpb25zQ29sbGVjdGlvbi5pbml0KGRhdGEucmVnaW9ucyk7XG4gICAgZGF0YS5yZWdpb25zLmZvckVhY2gocHJvY2Vzc1JlZ2lvbik7XG5cbiAgICBhcGkubG9hZGluZyA9IGZhbHNlO1xuICAgIGV2ZW50cy5lbWl0KCdsb2FkaW5nLWNvbXBsZXRlJyk7XG4gICAgaWYoIGNhbGxiYWNrICkgY2FsbGJhY2soKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NOb2Rlc0xpbmtzKG5vZGVzKSB7XG4gIGZvciggdmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgaWYoICFub2Rlc1tpXS5wcm9wZXJ0aWVzLmRlc2NyaXB0aW9uICkge1xuICAgICAgICBub2Rlc1tpXS5wcm9wZXJ0aWVzLmRlc2NyaXB0aW9uID0gJyc7XG4gICAgfVxuICAgIFxuICAgIG1hcmtDYWxpYnJhdGlvbk5vZGUobm9kZXNbaV0pO1xuXG4gICAgaWYoIG5vZGVzW2ldLnByb3BlcnRpZXMuaG9iYmVzLnR5cGUgPT09ICdsaW5rJyApIHtcbiAgICAgIG1hcmtMaW5rVHlwZXMobm9kZXNbaV0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXJrQ2FsaWJyYXRpb25Ob2RlKG5vZGUpIHtcbiAgICBpZiggbm9kZS5wcm9wZXJ0aWVzLnBybW5hbWUuaW5kZXhPZignXycpID4gLTEgKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IG5vZGUucHJvcGVydGllcy5wcm1uYW1lLnNwbGl0KCdfJyk7XG4gICAgICAgIGlmKCAhKHBhcnRzWzBdLm1hdGNoKC9eQ04uKi8pIHx8IHBhcnRzWzFdLm1hdGNoKC9eQ04uKi8pKSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiggIW5vZGUucHJvcGVydGllcy5wcm1uYW1lLm1hdGNoKC9eQ04uKi8pICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGhhc0luID0gZmFsc2U7XG4gICAgdmFyIGhhc091dCA9IGZhbHNlO1xuXG4gICAgaWYoIG5vZGUucHJvcGVydGllcy50ZXJtaW5hbHMgKSB7XG4gICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgbm9kZS5wcm9wZXJ0aWVzLnRlcm1pbmFscy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIGlmKCBub2RlLnByb3BlcnRpZXMudGVybWluYWxzW2ldICE9IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgaGFzT3V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiggbm9kZS5wcm9wZXJ0aWVzLm9yaWdpbnMgKSB7XG4gICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgbm9kZS5wcm9wZXJ0aWVzLm9yaWdpbnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBpZiggbm9kZS5wcm9wZXJ0aWVzLm9yaWdpbnNbaV0gIT0gbnVsbCApIHtcbiAgICAgICAgICAgICAgICBoYXNJbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlLnByb3BlcnRpZXMuY2FsaWJyYXRpb25Ob2RlID0gdHJ1ZTtcbiAgICBpZiggIWhhc0luICYmICFoYXNPdXQgKSByZXR1cm47XG5cbiAgICBpZiggaGFzSW4gJiYgaGFzT3V0ICkgbm9kZS5wcm9wZXJ0aWVzLmNhbGlicmF0aW9uTW9kZSA9ICdib3RoJztcbiAgICBlbHNlIGlmICggaGFzSW4gKSBub2RlLnByb3BlcnRpZXMuY2FsaWJyYXRpb25Nb2RlID0gJ2luJztcbiAgICBlbHNlIGlmICggaGFzT3V0ICkgbm9kZS5wcm9wZXJ0aWVzLmNhbGlicmF0aW9uTW9kZSA9ICdvdXQnO1xufVxuXG5mdW5jdGlvbiBtYXJrTGlua1R5cGVzKGxpbmspIHtcbiAgbGluay5wcm9wZXJ0aWVzLnJlbmRlckluZm8gPSB7XG4gICAgICBjb3N0IDogbGluay5wcm9wZXJ0aWVzLmhhc0Nvc3RzID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgYW1wbGl0dWRlIDogbGluay5wcm9wZXJ0aWVzLmFtcGxpdHVkZSA/IHRydWUgOiBmYWxzZSxcbiAgICAgIC8vIFRPRE86IHBhcnNlciBuZWVkcyB0byBzaGVldCBzaG9ydGN1dCBmb3IgY29udHJhaW50IHR5cGVcbiAgICAgIC8vIGRhdGEgd2lsbCBzdGlsbCBuZWVkIHRvIGJlIGxvYWRlZCBvbiBzZWNvbmQgY2FsbFxuICAgICAgY29uc3RyYWludHMgOiBsaW5rLnByb3BlcnRpZXMuaGFzQ29uc3RyYWludHMgPyB0cnVlIDogZmFsc2UsXG4gICAgICBlbnZpcm9ubWVudGFsIDogbGluay5wcm9wZXJ0aWVzLmhhc0NsaW1hdGUgPyB0cnVlIDogZmFsc2VcbiAgfTtcblxuICB0cnkge1xuXG4gICAgICAvLyBGbG93IHRvIGEgc2lua1xuICAgICAgaWYoIG5vZGVDb2xsZWN0aW9uLmdldEJ5UHJtbmFtZShsaW5rLnByb3BlcnRpZXMudGVybWludXMpICYmXG4gICAgICAgICAgbm9kZUNvbGxlY3Rpb24uZ2V0QnlQcm1uYW1lKGxpbmsucHJvcGVydGllcy50ZXJtaW51cykucHJvcGVydGllcy50eXBlID09ICdTaW5rJyApIHtcbiAgICAgICAgICBsaW5rLnByb3BlcnRpZXMucmVuZGVySW5mby50eXBlID0gJ2Zsb3dUb1NpbmsnO1xuXG4gICAgICB9IGVsc2UgaWYoIGxpbmsucHJvcGVydGllcy50eXBlID09ICdSZXR1cm4gRmxvdycgKSB7XG4gICAgICAgICAgbGluay5wcm9wZXJ0aWVzLnJlbmRlckluZm8udHlwZSA9ICdyZXR1cm5GbG93RnJvbURlbWFuZCc7XG5cbiAgICAgIH0gZWxzZSBpZiAoIGlzR1dUb0RlbWFuZChsaW5rKSApIHtcbiAgICAgICAgICBsaW5rLnByb3BlcnRpZXMucmVuZGVySW5mby50eXBlID0gJ2d3VG9EZW1hbmQnO1xuXG4gICAgICB9IGVsc2UgaWYoIG5vZGVDb2xsZWN0aW9uLmdldEJ5UHJtbmFtZShsaW5rLnByb3BlcnRpZXMub3JpZ2luKSAmJlxuICAgICAgICAgIChub2RlQ29sbGVjdGlvbi5nZXRCeVBybW5hbWUobGluay5wcm9wZXJ0aWVzLm9yaWdpbikucHJvcGVydGllcy5jYWxpYnJhdGlvbk1vZGUgPT0gJ2luJyB8fFxuICAgICAgICAgIG5vZGVDb2xsZWN0aW9uLmdldEJ5UHJtbmFtZShsaW5rLnByb3BlcnRpZXMub3JpZ2luKS5wcm9wZXJ0aWVzLmNhbGlicmF0aW9uTW9kZSA9PSAnYm90aCcpICkge1xuXG4gICAgICAgICAgbGluay5wcm9wZXJ0aWVzLnJlbmRlckluZm8udHlwZSA9ICdhcnRpZmljYWxSZWNoYXJnZSc7XG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgbGluay5wcm9wZXJ0aWVzLnJlbmRlckluZm8udHlwZSA9ICd1bmtub3duJztcbiAgICAgIH1cblxuICB9IGNhdGNoKGUpIHtcbiAgICAgIGRlYnVnZ2VyO1xuICB9XG5cbiAgaWYoICFsaW5rLmdlb21ldHJ5ICkgcmV0dXJuO1xuICBlbHNlIGlmKCAhbGluay5nZW9tZXRyeS5jb29yZGluYXRlcyApIHJldHVybjtcblxuICAvLyBmaW5hbGx5LCBtYXJrIHRoZSBhbmdsZSBvZiB0aGUgbGluZSwgc28gd2UgY2FuIHJvdGF0ZSB0aGUgaWNvbiBvbiB0aGVcbiAgLy8gbWFwIGFjY29yZGluZ2x5XG4gIHZhciB3aWR0aCA9IGxpbmsuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV1bMF0gLSBsaW5rLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdWzBdO1xuICB2YXIgaGVpZ2h0ID0gbGluay5nZW9tZXRyeS5jb29yZGluYXRlc1sxXVsxXSAtIGxpbmsuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF1bMV07XG4gIGxpbmsucHJvcGVydGllcy5yZW5kZXJJbmZvLnJvdGF0ZSA9ICBNYXRoLmF0YW4od2lkdGggLyBoZWlnaHQpICogKDE4MCAvIE1hdGguUEkpO1xufVxuXG5mdW5jdGlvbiBpc0dXVG9EZW1hbmQobGluaykge1xuICAgIHZhciBvcmlnaW4gPSBub2RlQ29sbGVjdGlvbi5nZXRCeVBybW5hbWUobGluay5wcm9wZXJ0aWVzLm9yaWdpbik7XG4gICAgdmFyIHRlcm1pbmFsID0gbm9kZUNvbGxlY3Rpb24uZ2V0QnlQcm1uYW1lKGxpbmsucHJvcGVydGllcy50ZXJtaW5hbCk7XG5cbiAgICBpZiggIW9yaWdpbiB8fCAhdGVybWluYWwgKSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZiggb3JpZ2luLnByb3BlcnRpZXMudHlwZSAhPSAnR3JvdW5kd2F0ZXIgU3RvcmFnZScgKSByZXR1cm4gZmFsc2U7XG4gICAgaWYoIHRlcm1pbmFsLnByb3BlcnRpZXMudHlwZSA9PSAnTm9uLVN0YW5kYXJkIERlbWFuZCcgfHxcbiAgICAgICAgdGVybWluYWwucHJvcGVydGllcy50eXBlID09ICdBZ3JpY3VsdHVyYWwgRGVtYW5kJyB8fFxuICAgICAgICB0ZXJtaW5hbC5wcm9wZXJ0aWVzLnR5cGUgPT0gJ1VyYmFuIERlbWFuZCcgKSByZXR1cm4gdHJ1ZTtcblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc1JlZ2lvbihyZWdpb24pIHtcbiAgICBpZiggcmVnaW9uLnByb3BlcnRpZXMuc3VicmVnaW9ucyApIHtcbiAgICAgIHJlZ2lvbi5wcm9wZXJ0aWVzLnN1YnJlZ2lvbnMuc29ydCgpO1xuICAgIH1cblxuICAgIGlmKCAhcmVnaW9uLmdlb21ldHJ5ICkgcmV0dXJuO1xuXG4gICAgdmFyIHBvbHlzID0gZ2V0WFlQb2x5Z29ucyhyZWdpb24pO1xuXG4gICAgcmVnaW9uLnByb3BlcnRpZXMuc2ltcGxpZmllZCA9IFtdO1xuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgcG9seXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiggcG9seXNbaV0ubGVuZ3RoID4gMTAwICkge1xuICAgICAgICByZWdpb24ucHJvcGVydGllcy5zaW1wbGlmaWVkLnB1c2goTC5MaW5lVXRpbC5zaW1wbGlmeShwb2x5c1tpXSwgMC4wMDEpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZ2lvbi5wcm9wZXJ0aWVzLnNpbXBsaWZpZWQucHVzaChwb2x5c1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVnaW9uLnByb3BlcnRpZXMuY2VudGVyID0gZ2V0Q2VudGVyKHJlZ2lvbi5wcm9wZXJ0aWVzLnNpbXBsaWZpZWRbMF0pO1xuXG4gICAgLy8gdG9kbyBjYWxjIGJib3ggc28gd2Uga25vdyBpZiB3ZSBuZWVkIHRvIHJlbmRlciBnZW9tZXRyeSBvciBub3RcbiAgICBmb3IoIHZhciBpID0gMDsgaSA8IHJlZ2lvbi5wcm9wZXJ0aWVzLnNpbXBsaWZpZWQubGVuZ3RoOyBpKysgKSB7XG4gICAgICBmb3IoIHZhciBqID0gMDsgaiA8IHJlZ2lvbi5wcm9wZXJ0aWVzLnNpbXBsaWZpZWRbaV0ubGVuZ3RoOyBqKysgKSB7XG4gICAgICAgIHJlZ2lvbi5wcm9wZXJ0aWVzLnNpbXBsaWZpZWRbaV1bal0gPSBbcmVnaW9uLnByb3BlcnRpZXMuc2ltcGxpZmllZFtpXVtqXS54LCByZWdpb24ucHJvcGVydGllcy5zaW1wbGlmaWVkW2ldW2pdLnldXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSEFDS1xuICAgIGlmKCBpc05hTihyZWdpb24ucHJvcGVydGllcy5jZW50ZXJbMF0pICkgcmVnaW9uLnByb3BlcnRpZXMuY2VudGVyID0gcmVnaW9uLnByb3BlcnRpZXMuc2ltcGxpZmllZFswXVswXTtcbn1cblxuZnVuY3Rpb24gZ2V0WFlQb2x5Z29ucyhnZW9qc29uKSB7XG4gIHZhciBwb2x5cyA9IFtdLCB0bXAgPSBbXSwgaSwgaiwgcDtcbiAgaWYoIGdlb2pzb24uZ2VvbWV0cnkudHlwZSA9PSAnUG9seWdvbicgKSB7XG4gICAgLy8gd2Ugb25seSBjYXJlIGFib3V0IHRoZSBvdXRlciByaW5nLiAgbm8gaG9sZXMgYWxsb3dlZC5cbiAgICBmb3IoIGkgPSAwOyBpIDwgZ2VvanNvbi5nZW9tZXRyeS5jb29yZGluYXRlc1swXS5sZW5ndGg7IGkrKyApIHtcbiAgICAgIHRtcC5wdXNoKHtcbiAgICAgICAgeCA6IGdlb2pzb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF1baV1bMF0sXG4gICAgICAgIHkgOiBnZW9qc29uLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdW2ldWzFdXG4gICAgICB9KTtcbiAgICB9XG4gICAgcG9seXMucHVzaCh0bXApO1xuXG4gIH0gZWxzZSBpZiggZ2VvanNvbi5nZW9tZXRyeS50eXBlID09ICdNdWx0aVBvbHlnb24nICkge1xuICAgIC8vIHdlIG9ubHkgY2FyZSBhYm91dCB0aGUgb3V0ZXIgcmluZy4gIG5vIGhvbGVzIGFsbG93ZWQuXG4gICAgZm9yKCBpID0gMDsgaSA8IGdlb2pzb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICB0bXAgPSBbXTtcbiAgICAgIHAgPSBnZW9qc29uLmdlb21ldHJ5LmNvb3JkaW5hdGVzW2ldWzBdO1xuXG4gICAgICBmb3IoIGogPSAwOyBqIDwgcC5sZW5ndGg7IGorKyApIHtcbiAgICAgICAgdG1wLnB1c2goe1xuICAgICAgICAgIHggOiBwW2pdWzBdLFxuICAgICAgICAgIHkgOiBwW2pdWzFdXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBwb2x5cy5wdXNoKHRtcCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwb2x5cztcbn1cblxuZnVuY3Rpb24gZ2V0Q2VudGVyKHBvaW50cykge1xuICAgIHZhciBpLCBqLCBsZW4sIHAxLCBwMiwgZiwgYXJlYSwgeCwgeSxcbiAgICAvLyBwb2x5Z29uIGNlbnRyb2lkIGFsZ29yaXRobTsgdXNlcyBhbGwgdGhlIHJpbmdzLCBtYXkgd29ya3MgYmV0dGVyIGZvciBiYW5hbmEgdHlwZSBwb2x5Z29uc1xuXG4gICAgYXJlYSA9IHggPSB5ID0gMDtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHBvaW50cy5sZW5ndGgsIGogPSBsZW4gLSAxOyBpIDwgbGVuOyBqID0gaSsrKSB7XG4gICAgICBwMSA9IHBvaW50c1tpXTtcbiAgICAgIHAyID0gcG9pbnRzW2pdO1xuXG4gICAgICBmID0gcDEueSAqIHAyLnggLSBwMi55ICogcDEueDtcbiAgICAgIHggKz0gKHAxLnggKyBwMi54KSAqIGY7XG4gICAgICB5ICs9IChwMS55ICsgcDIueSkgKiBmO1xuICAgIH1cblxuICAgIGYgPSBnZXRBcmVhKHBvaW50cykgKiA2O1xuICAgIHJldHVybiBbLTEgKiAoeCAvIGYpLCAtMSAqICh5IC8gZildO1xufVxuXG4vKiogaGVscGVyIGZvciBwcm9jZXNzaW5nIHJlZ2lvbiBjZW50ZXIgKiovXG5mdW5jdGlvbiBnZXRBcmVhKHBvaW50cyl7XG4gICAgdmFyIGFyZWEgPSAwO1xuICAgIHZhciBsZW5ndGhQb2ludHMgPSBwb2ludHMubGVuZ3RoO1xuICAgIHZhciBqID0gbGVuZ3RoUG9pbnRzIC0gMTtcbiAgICB2YXIgcDE7IHZhciBwMjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aFBvaW50czsgaiA9IGkrKykge1xuICAgICAgICBwMSA9IHBvaW50c1tpXTsgcDIgPSBwb2ludHNbal07XG4gICAgICAgIGFyZWEgKz0gcDEueCAqIHAyLnk7XG4gICAgICAgIGFyZWEgLT0gcDEueSAqIHAyLng7XG4gICAgfVxuICAgIGFyZWEgLz0gMjtcbiAgICByZXR1cm4gYXJlYTtcbn1cblxudmFyIGFwaSA9IHtcbiAgbG9hZGluZyA6IHRydWUsXG4gIGxvYWQ6IGxvYWROZXR3b3JrLFxuICBvbiA6IGZ1bmN0aW9uKGV2dCwgZm4pIHtcbiAgICAgIGV2ZW50cy5vbihldnQsIGZuKTtcbiAgfSxcbiAgb25Mb2FkIDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHRoaXMub24oJ2xvYWRpbmctY29tcGxldGUnLCBjYWxsYmFjayk7XG5cbiAgICAgIGlmKCB0aGlzLmxvYWRpbmcgKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjYWxsYmFjaygpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBpOyIsIlxucmVxdWlyZSgnLi9zaWdtYS1jd24tcGx1Z2luJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb2xsZWN0aW9ucyA6IHJlcXVpcmUoJy4vY29sbGVjdGlvbnMnKSxcbiAgY29udHJvbGxlcnMgOiByZXF1aXJlKCcuL2NvbnRyb2xsZXJzJyksXG4gIG1hcCA6IHJlcXVpcmUoJy4vbWFwJyksXG4gIHJlbmRlcmVyIDogcmVxdWlyZSgnLi9yZW5kZXJlcicpLFxuICBjaGFydExvYWRIYW5kbGVycyA6IHJlcXVpcmUoJy4vY2hhcnRzJylcbn0iLCJ2YXIgYmVoYXZpb3IgPSB7XG4gIG9uTGF5ZXJDbGljayA6IGZ1bmN0aW9uKGZlYXR1cmVzLCBlKSB7XG4gICAgaWYoIGZlYXR1cmVzLmxlbmd0aCA9PSAwICkgcmV0dXJuO1xuXG4gICAgdmFyIHR5cGUgPSBmZWF0dXJlc1swXS5nZW9qc29uLmdlb21ldHJ5LnR5cGU7XG5cbiAgICBpZiggZmVhdHVyZXMubGVuZ3RoID09IDEgJiYgdHlwZSA9PSAnUG9seWdvbicgfHwgdHlwZSA9PSAnTXVsdGlQb2x5Z29uJyApIHtcbiAgICAgIGlmKCB0aGlzLnNoaWZ0UGVzc2VkICkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcjaW5mby8nICsgZmVhdHVyZXNbMF0uZ2VvanNvbi5wcm9wZXJ0aWVzLm5hbWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYoICFmZWF0dXJlc1swXS5nZW9qc29uLnByb3BlcnRpZXMuX3JlbmRlciApIGZlYXR1cmVzWzBdLmdlb2pzb24ucHJvcGVydGllcy5fcmVuZGVyID0ge307XG4gICAgICBmZWF0dXJlc1swXS5nZW9qc29uLnByb3BlcnRpZXMuX3JlbmRlci5ob3ZlciA9IHRydWU7XG4gICAgICB0aGlzLm1hcmtlckxheWVyLnJlbmRlcigpO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMub25SZWdpb25DbGljayhmZWF0dXJlc1swXS5nZW9qc29uLnByb3BlcnRpZXMuaG9iYmVzLmlkKTtcblxuICAgICAgICBmZWF0dXJlc1swXS5nZW9qc29uLnByb3BlcnRpZXMuX3JlbmRlci5ob3ZlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1hcmtlckxheWVyLnJlbmRlcigpO1xuXG4gICAgICB9LmJpbmQodGhpcyksIDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKCBmZWF0dXJlcy5sZW5ndGggPT0gMSAmJiBmZWF0dXJlc1swXS5nZW9qc29uLnByb3BlcnRpZXMucHJtbmFtZSApIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJyNpbmZvLycgKyBmZWF0dXJlc1swXS5nZW9qc29uLnByb3BlcnRpZXMucHJtbmFtZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdG9yLm9uQ2xpY2soZmVhdHVyZXMpO1xuICB9LFxuXG4gIG9uTGF5ZXJNb3VzZU1vdmUgOiBmdW5jdGlvbihmZWF0dXJlcywgZSkge1xuICAgIHZhciBsYWJlbCA9IFtdLCBsaW5rTGFiZWwgPSAnJywgcmVnaW9uTGFiZWwgPSAnJztcbiAgICB2YXIgaSwgZjtcblxuICAgIGZvciggaSA9IDA7IGkgPCBmZWF0dXJlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGYgPSBmZWF0dXJlc1tpXS5nZW9qc29uLnByb3BlcnRpZXM7XG5cbiAgICAgIGlmKCBmLnR5cGUgPT0gJ0RpdmVyc2lvbicgfHwgZi50eXBlID09ICdSZXR1cm4gRmxvdycgKSBsYWJlbC5wdXNoKGYudHlwZSsnIDxiPicrZi5wcm1uYW1lKyc8L2I+Jyk7XG4gICAgICBlbHNlIGlmKCBmLnR5cGUgPT0gJ0xpbmsgR3JvdXAnICkgbGFiZWwucHVzaChmLnR5cGUrJyA8Yj5Db3VudDogJytmLmxpbmVzLmxlbmd0aCsnPC9iPicpO1xuICAgICAgZWxzZSBpZiAoIGYudHlwZSA9PSAnUmVnaW9uJyApIGxhYmVsLnB1c2goZi50eXBlKycgPGI+JytmLm5hbWUrJzwvYj4nKTtcbiAgICAgIGVsc2UgbGFiZWwucHVzaChmLnR5cGUrJyA8Yj4nK2YucHJtbmFtZSsnPC9iPicpO1xuICAgIH1cblxuICAgIGlmKCBmZWF0dXJlcy5sZW5ndGggPiAwICkge1xuICAgICAgdGhpcy5zaG93SG92ZXJMYWJlbCh0cnVlLCBsYWJlbC5qb2luKCc8YnIgLz4nKSwgZS5jb250YWluZXJQb2ludCk7XG4gICAgICB0aGlzLiQubGVhZmxldC5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvd0hvdmVyTGFiZWwoZmFsc2UpO1xuICAgICAgdGhpcy4kLmxlYWZsZXQuc3R5bGUuY3Vyc29yID0gJy13ZWJraXQtZ3JhYic7XG4gICAgfVxuICB9LFxuXG4gIG9uTGF5ZXJNb3VzZU92ZXIgOiBmdW5jdGlvbihmZWF0dXJlcywgZSkge1xuICAgIHZhciBpLCBmO1xuXG4gICAgZm9yKCBpID0gMDsgaSA8IGZlYXR1cmVzLmxlbmd0aDsgaSsrICkge1xuICAgICAgZiA9IGZlYXR1cmVzW2ldLmdlb2pzb24ucHJvcGVydGllcztcblxuICAgICAgaWYoICFmLl9yZW5kZXIgKSBmLl9yZW5kZXIgPSB7fTtcbiAgICAgIGYuX3JlbmRlci5ob3ZlciA9IHRydWU7XG4gICAgfVxuICB9LFxuXG4gIG9uTGF5ZXJNb3VzZU91dCA6IGZ1bmN0aW9uKGZlYXR1cmVzKSB7XG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBmZWF0dXJlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGlmKCAhZmVhdHVyZXNbaV0uZ2VvanNvbi5wcm9wZXJ0aWVzLl9yZW5kZXIgKSBmZWF0dXJlc1tpXS5nZW9qc29uLnByb3BlcnRpZXMuX3JlbmRlciA9IHt9O1xuICAgICAgZmVhdHVyZXNbaV0uZ2VvanNvbi5wcm9wZXJ0aWVzLl9yZW5kZXIuaG92ZXIgPSBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgc2hvd0hvdmVyTGFiZWwgOiBmdW5jdGlvbihzaG93LCBsYWJlbCwgcG9zKSB7XG4gICAgaWYoIHNob3cgKSB7XG4gICAgICB0aGlzLiQuaG92ZXJMYWJlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHRoaXMuJC5ob3ZlckxhYmVsLnN0eWxlLmxlZnQgPSAocG9zLngrMTApKydweCc7XG4gICAgICB0aGlzLiQuaG92ZXJMYWJlbC5zdHlsZS50b3AgPSAocG9zLnkrMTApKydweCc7XG4gICAgICB0aGlzLiQuaG92ZXJMYWJlbC5pbm5lckhUTUwgPSBsYWJlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kLmhvdmVyTGFiZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcjsiLCJ2YXIgY29sbGVjdGlvbiA9IHJlcXVpcmUoJy4uL2NvbGxlY3Rpb25zL25vZGVzJyk7XG5cbi8vIG1hcmtlciBub2RlcyB0aGF0IGFyZSBsaW5rZWQgdG8gYSB2aXNpYmxlIG5vZGUgd2l0aCB0aGUgJ25vZGVTdGVwJyBhdHRyaWJ1dGVcbnZhciBiZWhhdmlvciA9IHtcbiAgICBmaWx0ZXIgOiBmdW5jdGlvbihtYXBGaWx0ZXJzKSB7XG4gICAgICAgIHZhciByZSwgaSwgZCwgZDIsIGQzLCBpZDtcbiAgICAgICAgLy8gdGhyZWUgbG9vcHMsIGZpcnN0IG1hcmsgbm9kZXMgdGhhdCBtYXRjaCwgdGhlbiBtYXJrIG9uZSBzdGVwIG5vZGVzXG4gICAgICAgIC8vIGZpbmFsbHkgbWFyayBsaW5rcyB0byBoaWRlIGFuZCBzaG93XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZSA9IG5ldyBSZWdFeHAoJy4qJyttYXBGaWx0ZXJzLnRleHQudG9Mb3dlckNhc2UoKSsnLionKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgZm9yKCBpID0gMDsgaSA8IGNvbGxlY3Rpb24ubm9kZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBkID0gY29sbGVjdGlvbi5ub2Rlc1tpXTtcblxuICAgICAgICAgICAgaWYoICFkLnByb3BlcnRpZXMuX3JlbmRlciApIHtcbiAgICAgICAgICAgICAgICBkLnByb3BlcnRpZXMuX3JlbmRlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyX2lkIDogZC5wcm9wZXJ0aWVzLnR5cGUucmVwbGFjZSgnICcsJ18nKS5yZXBsYWNlKCctJywnXycpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiggbWFwRmlsdGVyc1tkLnByb3BlcnRpZXMuX3JlbmRlci5maWx0ZXJfaWRdICYmIGlzVGV4dE1hdGNoKHJlLCBkLnByb3BlcnRpZXMsIG1hcEZpbHRlcnMpICkge1xuICAgICAgICAgICAgICAgIGlmKCAhY2hlY2tTaW5rTW9kZShtYXBGaWx0ZXJzLmluZmxvd1NpbmtNb2RlLCAgZC5wcm9wZXJ0aWVzKSApIHtcbiAgICAgICAgICAgICAgICAgICAgZC5wcm9wZXJ0aWVzLl9yZW5kZXIuc2hvdyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGQucHJvcGVydGllcy5fcmVuZGVyLnNob3cgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZC5wcm9wZXJ0aWVzLl9yZW5kZXIuc2hvdyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm93IG1hcmsgbGlua3MgdGhhdCBzaG91bGQgYmUgc2hvd1xuICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IGNvbGxlY3Rpb24ubGlua3MubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBkID0gY29sbGVjdGlvbi5saW5rc1tpXTtcbiAgICAgICAgICAgIGQyID0gY29sbGVjdGlvbi5nZXRCeVBybW5hbWUoZC5wcm9wZXJ0aWVzLm9yaWdpbik7XG4gICAgICAgICAgICBkMyA9IGNvbGxlY3Rpb24uZ2V0QnlQcm1uYW1lKGQucHJvcGVydGllcy50ZXJtaW51cyk7XG5cbiAgICAgICAgICAgIGNoZWNrUmVuZGVyTnMoZCk7XG4gICAgICAgICAgICBjaGVja1JlbmRlck5zKGQyKTtcbiAgICAgICAgICAgIGNoZWNrUmVuZGVyTnMoZDMpO1xuXG4gICAgICAgICAgICBpZiggZDIgJiYgZDMgJiZcbiAgICAgICAgICAgICAgICAoZDIucHJvcGVydGllcy5fcmVuZGVyLnNob3cgfHwgKG1hcEZpbHRlcnMub25lU3RlcE1vZGUgJiYgZDIucHJvcGVydGllcy5fcmVuZGVyLm9uZVN0ZXApICkgJiZcbiAgICAgICAgICAgICAgICAoZDMucHJvcGVydGllcy5fcmVuZGVyLnNob3cgfHwgKG1hcEZpbHRlcnMub25lU3RlcE1vZGUgJiYgZDMucHJvcGVydGllcy5fcmVuZGVyLm9uZVN0ZXApICkgJiZcbiAgICAgICAgICAgICAgICAhKGQyLnByb3BlcnRpZXMuX3JlbmRlci5vbmVTdGVwICYmIGQzLnByb3BlcnRpZXMuX3JlbmRlci5vbmVTdGVwICkgKSB7XG4gICAgICAgICAgICAgICAgZC5wcm9wZXJ0aWVzLl9yZW5kZXIuc2hvdyA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGQucHJvcGVydGllcy5fcmVuZGVyLnNob3cgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tSZW5kZXJOcyhub2RlKSB7XG4gIGlmKCAhbm9kZSApIHJldHVybjtcbiAgaWYoICFub2RlLnByb3BlcnRpZXMuX3JlbmRlciApIHtcbiAgICBub2RlLnByb3BlcnRpZXMuX3JlbmRlciA9IHt9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzVGV4dE1hdGNoKHJlLCBwcm9wcywgbWFwRmlsdGVycykge1xuICAgIGlmKCBtYXBGaWx0ZXJzLnRleHQgPT0gJycgfHwgIXJlICkgcmV0dXJuIHRydWU7XG5cbiAgICBpZiggcmUudGVzdChwcm9wcy5wcm1uYW1lLnRvTG93ZXJDYXNlKCkpICkgcmV0dXJuIHRydWU7XG4gICAgaWYoIHByb3BzLmRlc2NyaXB0aW9uICYmIHJlLnRlc3QocHJvcHMuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKSkgKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNoZWNrU2lua01vZGUoaW5mbG93U2lua01vZGUsICBwcm9wZXJ0aWVzKSB7XG4gIGlmKCAhaW5mbG93U2lua01vZGUgKSB7XG4gICAgcHJvcGVydGllcy5fcmVuZGVyLnN0cm9rZSA9IG51bGw7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiggcHJvcGVydGllcy5leHRyYXMgKSB7XG4gICAgaWYoIHByb3BlcnRpZXMuZXh0cmFzLmluZmxvd3MgKSB7XG4gICAgICBwcm9wZXJ0aWVzLl9yZW5kZXIuc3Ryb2tlID0gJ2dyZWVuJztcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiggcHJvcGVydGllcy5leHRyYXMuc2lua3MgKSB7XG4gICAgICBwcm9wZXJ0aWVzLl9yZW5kZXIuc3Ryb2tlID0gJ3JlZCc7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwcm9wZXJ0aWVzLl9yZW5kZXIuc3Ryb2tlID0gbnVsbDtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICByZW5kZXJlciA6IHJlcXVpcmUoJy4vcmVuZGVyZXInKSxcbiAgbGVnZW5kIDogcmVxdWlyZSgnLi9yZW5kZXJlci9sZWdlbmQnKSxcbiAgRmlsdGVyQmVoYXZpb3IgOiByZXF1aXJlKCcuL2ZpbHRlcicpLFxuICBSZW5kZXJTdGF0ZUJlaGF2aW9yIDogcmVxdWlyZSgnLi9yZW5kZXItc3RhdGUnKSxcbiAgQ2FudmFzTGF5ZXJCZWhhdmlvciA6IHJlcXVpcmUoJy4vY2FudmFzLWxheWVyLWV2ZW50cycpXG59IiwidmFyIGNvbGxlY3Rpb25zID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMnKTtcbnZhciByZW5kZXJlciA9IHJlcXVpcmUoJy4vcmVuZGVyZXInKTtcblxudmFyIGJlaGF2aW9yID0ge1xuICB1cGRhdGVSZW5kZXJTdGF0ZSA6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVuZGVyU3RhdGUgPSB7XG4gICAgICBwb2ludHMgOiBbXSxcbiAgICAgIGxpbmVzIDogW10sXG4gICAgICBwb2x5Z29ucyA6IFtdXG4gICAgfVxuICAgIHRoaXMuY2xlYXJSZWdpb25MaW5rcygpO1xuXG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyU3RhdGUoJ0NhbGlmb3JuaWEnKTtcblxuICAgIHZhciBmID0gbnVsbCwgcmVuZGVyO1xuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGhpcy5tYXJrZXJMYXllci5mZWF0dXJlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGYgPSB0aGlzLm1hcmtlckxheWVyLmZlYXR1cmVzW2ldO1xuICAgICAgciA9IGYuZ2VvanNvbi5wcm9wZXJ0aWVzLl9yZW5kZXIgfHwge307XG5cbiAgICAgIGlmKCAodGhpcy5yZW5kZXJTdGF0ZS5wb2ludHMuaW5kZXhPZihmLmlkKSA+IC0xIHx8XG4gICAgICAgIHRoaXMucmVuZGVyU3RhdGUubGluZXMuaW5kZXhPZihmLmlkKSA+IC0xIHx8XG4gICAgICAgIHRoaXMucmVuZGVyU3RhdGUucG9seWdvbnMuaW5kZXhPZihmLmlkKSA+IC0xKSAmJlxuICAgICAgICByLnNob3cgIT09IGZhbHNlICkge1xuXG4gICAgICAgICAgZi52aXNpYmxlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGYudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubWFya2VyTGF5ZXIucmVuZGVyKCk7XG4gIH0sXG5cbiAgX3VwZGF0ZVJlbmRlclN0YXRlIDogZnVuY3Rpb24oaWQpIHtcbiAgICB2YXIgcmVnaW9uID0gY29sbGVjdGlvbnMucmVnaW9ucy5nZXRCeUlkKGlkKTtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLm1lbnUuc3RhdGU7XG5cbiAgICBpZiggc3RhdGUuZW5hYmxlZC5pbmRleE9mKGlkKSA+IC0xICkge1xuICAgICAgdGhpcy5fYWRkU3RhdGVOb2RlcyhyZWdpb24ucHJvcGVydGllcy5ob2JiZXMubm9kZXMsIHN0YXRlKTtcblxuICAgICAgaWYoICFyZWdpb24ucHJvcGVydGllcy5ob2JiZXMuc3VicmVnaW9ucyApIHJldHVybjtcblxuICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCByZWdpb24ucHJvcGVydGllcy5ob2JiZXMuc3VicmVnaW9ucy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlUmVuZGVyU3RhdGUocmVnaW9uLnByb3BlcnRpZXMuaG9iYmVzLnN1YnJlZ2lvbnNbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGlmKCBuYW1lICE9ICdDYWxpZm9ybmlhJyApIHRoaXMucmVuZGVyU3RhdGUucG9seWdvbnMucHVzaChyZWdpb24ucHJvcGVydGllcy5ob2JiZXMuaWQpO1xuICAgIH1cbiAgfSxcblxuICBfYWRkU3RhdGVOb2RlcyA6IGZ1bmN0aW9uKG5vZGVzLCBzdGF0ZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIGZpbmQgZmlyc3QgcmVnaW9uIGFuZCBpbnNlcnQgYWZ0ZXJcbiAgICB2YXIgaW5kZXggPSAwLCB0eXBlO1xuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGhpcy5tYXJrZXJMYXllci5mZWF0dXJlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIHR5cGUgPSB0aGlzLm1hcmtlckxheWVyLmZlYXR1cmVzW2ldLmdlb2pzb24uZ2VvbWV0cnkudHlwZTtcbiAgICAgIGlmKCB0eXBlICE9ICdQb2x5Z29uJyAmJiB0eXBlICE9ICdNdWx0aVBvbHlnb24nICkge1xuICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciggdmFyIGlkIGluIG5vZGVzICkge1xuICAgICAgdmFyIG5vZGUgPSBjb2xsZWN0aW9ucy5ub2Rlcy5nZXRCeUlkKGlkKTtcbiAgICAgIGlmKCAhbm9kZSApIG5vZGUgPSBjb2xsZWN0aW9ucy5ub2Rlcy5nZXRCeVBybW5hbWUoaWQpO1xuICAgICAgaWYoICFub2RlICkgY29udGludWU7XG5cbiAgICAgIHZhciByZW5kZXIgPSBub2RlLnByb3BlcnRpZXMuX3JlbmRlciB8fCB7fTtcbiAgICAgIGlmKCByZW5kZXIuc2hvdyA9PT0gZmFsc2UgKSBjb250aW51ZTtcblxuICAgICAgaWYoIG5vZGUucHJvcGVydGllcy5ob2JiZXMudHlwZSA9PT0gJ2xpbmsnICkge1xuICAgICAgICB2YXIgdGVybWluYWwgPSB0aGlzLl9nZXRTdGF0ZU5vZGVMb2NhdGlvbihub2RlLnByb3BlcnRpZXMudGVybWludXMsIHN0YXRlKTtcbiAgICAgICAgdmFyIG9yaWdpbiA9IHRoaXMuX2dldFN0YXRlTm9kZUxvY2F0aW9uKG5vZGUucHJvcGVydGllcy5vcmlnaW4sIHN0YXRlKTtcblxuICAgICAgICBpZiggIXRlcm1pbmFsIHx8ICFvcmlnaW4gKSBjb250aW51ZTtcblxuICAgICAgICB2YXIgbGluZUZlYXR1cmU7XG4gICAgICAgIGlmKCB0ZXJtaW5hbC5pc05vZGUgJiYgb3JpZ2luLmlzTm9kZSApIHtcbiAgICAgICAgICBsaW5lRmVhdHVyZSA9IHRoaXMuY3JlYXRlTm9kZUxpbmsob3JpZ2luLmNlbnRlciwgdGVybWluYWwuY2VudGVyLCBub2RlLCBpbmRleCk7XG4gICAgICAgICAgdGhpcy5jdXN0b21MaW5lc1tub2RlLnByb3BlcnRpZXMub3JpZ2luKydfJytub2RlLnByb3BlcnRpZXMudGVybWludXNdID0gbGluZUZlYXR1cmU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gaWYgdGhpcyBsaW5lIGFscmVhZHkgZXhpc3RzLCBhIG51bGwgdmFsdWUgd2lsbCBiZSByZXR1cm5lZFxuICAgICAgICAgIGxpbmVGZWF0dXJlID0gdGhpcy5jcmVhdGVSZWdpb25MaW5rKG9yaWdpbiwgdGVybWluYWwsIG5vZGUsIGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBsaW5lRmVhdHVyZSApIHtcbiAgICAgICAgICB0aGlzLnJlbmRlclN0YXRlLmxpbmVzLnB1c2gobGluZUZlYXR1cmUuZ2VvanNvbi5wcm9wZXJ0aWVzLmhvYmJlcy5pZCk7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW5kZXJTdGF0ZS5wb2ludHMucHVzaChub2RlLnByb3BlcnRpZXMuaG9iYmVzLmlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgY3JlYXRlTm9kZUxpbmsgOiBmdW5jdGlvbihvcmlnaW4sIHRlcm1pbmFsLCBub2RlLCBpbmRleCkge1xuICAgIHZhciBsaW5rID0ge1xuICAgICAgZ2VvanNvbiA6IHtcbiAgICAgICAgXCJ0eXBlXCIgOiBcIkZlYXR1cmVcIixcbiAgICAgICAgXCJnZW9tZXRyeVwiIDoge1xuICAgICAgICAgIFwidHlwZVwiIDogXCJMaW5lU3RyaW5nXCIsXG4gICAgICAgICAgY29vcmRpbmF0ZXMgOiBbb3JpZ2luLCB0ZXJtaW5hbF1cbiAgICAgICAgfSxcbiAgICAgICAgcHJvcGVydGllcyA6ICQuZXh0ZW5kKHRydWUsIHt9LCBub2RlLnByb3BlcnRpZXMpXG4gICAgICB9LFxuICAgICAgcmVuZGVyZXIgOiByZW5kZXJlclxuICAgIH07XG4gICAgXG4gICAgdGhpcy5tYXJrZXJMYXllci5hZGRDYW52YXNGZWF0dXJlKG5ldyBMLkNhbnZhc0ZlYXR1cmUobGluaywgbGluay5nZW9qc29uLnByb3BlcnRpZXMuaG9iYmVzLmlkKSwgaW5kZXgpO1xuXG4gICAgcmV0dXJuIGxpbms7XG4gIH0sXG5cbiAgY3JlYXRlUmVnaW9uTGluayA6IGZ1bmN0aW9uKG9yaWdpbiwgdGVybWluYWwsIG5vZGUsIGluZGV4KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBmZWF0dXJlID0gbnVsbDtcbiAgICBpZiggdGhpcy5jdXN0b21MaW5lc1tvcmlnaW4ubmFtZSsnXycrdGVybWluYWwubmFtZV0gKSB7XG4gICAgICBmZWF0dXJlID0gdGhpcy5jdXN0b21MaW5lc1tvcmlnaW4ubmFtZSsnXycrdGVybWluYWwubmFtZV07XG4gICAgfSBlbHNlIGlmICggdGhpcy5jdXN0b21MaW5lc1t0ZXJtaW5hbC5uYW1lKydfJytvcmlnaW4ubmFtZV0gKSB7XG4gICAgICBmZWF0dXJlID0gdGhpcy5jdXN0b21MaW5lc1t0ZXJtaW5hbC5uYW1lKydfJytvcmlnaW4ubmFtZV07XG4gICAgfVxuXG4gICAgaWYoICFmZWF0dXJlICkge1xuICAgICAgZmVhdHVyZSA9IHtcbiAgICAgICAgZ2VvanNvbiA6IHtcbiAgICAgICAgICBcInR5cGVcIiA6IFwiRmVhdHVyZVwiLFxuICAgICAgICAgIFwiZ2VvbWV0cnlcIiA6IHtcbiAgICAgICAgICAgIFwidHlwZVwiIDogXCJMaW5lU3RyaW5nXCIsXG4gICAgICAgICAgICBjb29yZGluYXRlcyA6IFtvcmlnaW4uY2VudGVyLCB0ZXJtaW5hbC5jZW50ZXJdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwcm9wZXJ0aWVzIDoge1xuICAgICAgICAgICAgaG9iYmVzIDoge1xuICAgICAgICAgICAgICBpZCA6IG9yaWdpbi5uYW1lKyctLScrdGVybWluYWwubmFtZSxcbiAgICAgICAgICAgICAgdHlwZSA6ICdsaW5rJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBybW5hbWUgOiBvcmlnaW4ubmFtZSsnLS0nK3Rlcm1pbmFsLm5hbWUsXG4gICAgICAgICAgICB0eXBlIDogJ1JlZ2lvbiBMaW5rJyxcbiAgICAgICAgICAgIGxpbmVzIDogWyQuZXh0ZW5kKHRydWUsIHt9LCBub2RlLnByb3BlcnRpZXMpXSxcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcmVyIDogcmVuZGVyZXJcbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXN0b21MaW5lc1tvcmlnaW4ubmFtZSsnXycrdGVybWluYWwubmFtZV0gPSBmZWF0dXJlO1xuICAgICAgdGhpcy5tYXJrZXJMYXllci5hZGRDYW52YXNGZWF0dXJlKG5ldyBMLkNhbnZhc0ZlYXR1cmUoZmVhdHVyZSwgZmVhdHVyZS5nZW9qc29uLnByb3BlcnRpZXMuaG9iYmVzLmlkKSwgaW5kZXgpO1xuXG4gICAgICByZXR1cm4gZmVhdHVyZTtcbiAgICB9XG5cbiAgICBmZWF0dXJlLmdlb2pzb24ucHJvcGVydGllcy5saW5lcy5wdXNoKCQuZXh0ZW5kKHRydWUsIHt9LCBub2RlLnByb3BlcnRpZXMpKTtcbiAgfSxcblxuICBjbGVhclJlZ2lvbkxpbmtzIDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHByb3BlcnRpZXM7XG4gICAgZm9yKCB2YXIgaSA9IHRoaXMubWFya2VyTGF5ZXIuZmVhdHVyZXMubGVuZ3RoLTE7IGkgPj0gMDsgaS0tICkge1xuICAgICAgcHJvcGVydGllcyA9IHRoaXMubWFya2VyTGF5ZXIuZmVhdHVyZXNbaV0uZ2VvanNvbi5wcm9wZXJ0aWVzO1xuICAgICAgaWYoIHByb3BlcnRpZXMuaG9iYmVzLnR5cGUgPT09ICdsaW5rJyApIHtcbiAgICAgICAgdGhpcy5tYXJrZXJMYXllci5mZWF0dXJlcy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5tYXJrZXJMYXllci5yZWJ1aWxkSW5kZXgodGhpcy5tYXJrZXJMYXllci5mZWF0dXJlcyk7XG4gICAgdGhpcy5jdXN0b21MaW5lcyA9IHt9O1xuICB9LFxuXG4gIF9nZXRTdGF0ZU5vZGVMb2NhdGlvbiA6IGZ1bmN0aW9uKG5hbWUsIHN0YXRlKSB7XG4gICAgdmFyIG5vZGUgPSBjb2xsZWN0aW9ucy5ub2Rlcy5nZXRCeVBybW5hbWUobmFtZSk7XG5cbiAgICBpZiggIW5vZGUgKSByZXR1cm4gbnVsbDtcblxuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgbm9kZS5wcm9wZXJ0aWVzLmhvYmJlcy5yZWdpb25zLmxlbmd0aDsgaSsrICkge1xuICAgICAgaWYoIHN0YXRlLmRpc2FibGVkLmluZGV4T2Yobm9kZS5wcm9wZXJ0aWVzLmhvYmJlcy5yZWdpb25zW2ldKSA+IC0xICkge1xuICAgICAgICBpZiggY29sbGVjdGlvbnMucmVnaW9ucy5nZXRCeUlkKG5vZGUucHJvcGVydGllcy5ob2JiZXMucmVnaW9uc1tpXSkucHJvcGVydGllcy5jZW50ZXIgKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNlbnRlcjogY29sbGVjdGlvbnMucmVnaW9ucy5nZXRCeUlkKG5vZGUucHJvcGVydGllcy5ob2JiZXMucmVnaW9uc1tpXSkucHJvcGVydGllcy5jZW50ZXIsXG4gICAgICAgICAgICBuYW1lOiBub2RlLnByb3BlcnRpZXMuaG9iYmVzLnJlZ2lvbnNbaV0sXG4gICAgICAgICAgICBpc1JlZ2lvbiA6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNlbnRlciA6IG5vZGUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMgfHwgWzAsMF0sXG4gICAgICBuYW1lIDogbmFtZSxcbiAgICAgIGlzTm9kZSA6IHRydWVcbiAgICB9XG4gIH0sXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3I7IiwidmFyIHJlbmRlclV0aWxzID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyZXInKTtcbnZhciBjb2xsZWN0aW9uID0gcmVxdWlyZSgnLi4vLi4vY29sbGVjdGlvbnMvbm9kZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHgsIHh5UG9pbnRzLCBtYXAsIGZlYXR1cmUpIHtcbiAgdmFyIHJlbmRlciA9IGZlYXR1cmUuZ2VvanNvbi5wcm9wZXJ0aWVzLl9yZW5kZXIgfHwge307XG5cbiAgaWYoIGZlYXR1cmUuZ2VvanNvbi5nZW9tZXRyeS50eXBlID09ICdQb2ludCcgKSB7XG4gICAgcmVuZGVyQmFzaWNQb2ludChjdHgsIHh5UG9pbnRzLCBtYXAsIGZlYXR1cmUsIHJlbmRlcik7XG4gIH0gZWxzZSBpZiAoIGZlYXR1cmUuZ2VvanNvbi5nZW9tZXRyeS50eXBlID09ICdMaW5lU3RyaW5nJyApIHtcbiAgICBpZiggZmVhdHVyZS5nZW9qc29uLnByb3BlcnRpZXMudHlwZSA9PT0gJ1JlZ2lvbiBMaW5rJyApIHtcbiAgICAgIHJlbmRlclJlZ2lvbkxpbmUoY3R4LCB4eVBvaW50cywgbWFwLCBmZWF0dXJlLCByZW5kZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZW5kZXJCYXNpY0xpbmUoY3R4LCB4eVBvaW50cywgbWFwLCBmZWF0dXJlLCByZW5kZXIpO1xuICAgIH1cbiAgfSBlbHNlIGlmICggZmVhdHVyZS5nZW9qc29uLmdlb21ldHJ5LnR5cGUgPT0gJ1BvbHlnb24nICkge1xuICAgIHJlbmRlckJhc2ljUG9seWdvbihjdHgsIHh5UG9pbnRzLCBtYXAsIGZlYXR1cmUsIHJlbmRlcik7XG4gIH0gZWxzZSBpZiAoIGZlYXR1cmUuZ2VvanNvbi5nZW9tZXRyeS50eXBlID09ICdNdWx0aVBvbHlnb24nICkge1xuICAgIC8vZGVidWdnZXI7XG4gICAgeHlQb2ludHMuZm9yRWFjaChmdW5jdGlvbihwb2ludHMpe1xuICAgICAgcmVuZGVyQmFzaWNQb2x5Z29uKGN0eCwgcG9pbnRzLCBtYXAsIGZlYXR1cmUsIHJlbmRlcik7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyUmVnaW9uTGluZShjdHgsIHh5UG9pbnRzLCBtYXAsIGZlYXR1cmUsIHJlbmRlcikge1xuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5zdHJva2VTdHlsZSA9IHJlbmRlclV0aWxzLmNvbG9ycy5vcmFuZ2U7XG4gIGN0eC5saW5lV2lkdGggPSAyO1xuICBjdHgubW92ZVRvKHh5UG9pbnRzWzBdLngsIHh5UG9pbnRzWzBdLnkpO1xuICBjdHgubGluZVRvKHh5UG9pbnRzWzFdLngsIHh5UG9pbnRzWzFdLnkpO1xuICBjdHguc3Ryb2tlKCk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlckJhc2ljUG9pbnQoY3R4LCB4eVBvaW50cywgbWFwLCBmZWF0dXJlLCByZW5kZXIpIHtcbiAgbyA9IHJlbmRlci5vbmVTdGVwID8gLjMgOiAuNztcblxuICByZW5kZXIucG9pbnQgPSB4eVBvaW50cztcbiAgbXMgPSAoZmVhdHVyZS5zaXplIHx8IDIwKSAqIChyZW5kZXIubXVsdGlwaWVyIHx8IDEpO1xuICBidWZmZXIgPSBtcyAvIDI7XG5cbiAgLy8gVE9ETzogc2V0IGZlYXR1cmUuc2l6ZSBhbmQgeW91IHdhbnQgaGF2ZSB0byB3b3JyeSBhYm91dCAtMTAgb2Zmc2V0IGhlcmVcbiAgcmVuZGVyVXRpbHNbZmVhdHVyZS5nZW9qc29uLnByb3BlcnRpZXMudHlwZV0oY3R4LCB7XG4gICAgICB4OiB4eVBvaW50cy54IC0gMTAsXG4gICAgICB5OiB4eVBvaW50cy55IC0gMTAsXG4gICAgICB3aWR0aDogbXMsXG4gICAgICBoZWlnaHQ6IG1zLFxuICAgICAgb3BhY2l0eTogbyxcbiAgICAgIGZpbGwgOiByZW5kZXIuZmlsbCxcbiAgICAgIHN0cm9rZSA6IHJlbmRlci5zdHJva2UsXG4gICAgICBsaW5lV2lkdGggOiByZW5kZXIubGluZVdpZHRoLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQmFzaWNMaW5lKGN0eCwgeHlQb2ludHMsIG1hcCwgZmVhdHVyZSwgcmVuZGVyKSB7XG4gIGNvbG9yID0gJ3doaXRlJztcbiAgaWYoIHJlbmRlci5oaWdobGlnaHQgKSB7XG4gICAgICBpZiggcmVuZGVyLmhpZ2hsaWdodCA9PSAnb3JpZ2luJyApIGNvbG9yID0gJ2dyZWVuJztcbiAgICAgIGVsc2UgY29sb3IgPSAncmVkJztcbiAgfVxuXG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gIGN0eC5saW5lV2lkdGggPSA0O1xuICBjdHgubW92ZVRvKHh5UG9pbnRzWzBdLngsIHh5UG9pbnRzWzBdLnkpO1xuICBjdHgubGluZVRvKHh5UG9pbnRzWzFdLngsIHh5UG9pbnRzWzFdLnkpO1xuICBjdHguc3Ryb2tlKCk7XG5cbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHguc3Ryb2tlU3R5bGUgPSBnZXRMaW5lQ29sb3IoZmVhdHVyZS5nZW9qc29uKTtcbiAgY3R4LmxpbmVXaWR0aCA9IDI7XG4gIGN0eC5tb3ZlVG8oeHlQb2ludHNbMF0ueCwgeHlQb2ludHNbMF0ueSk7XG4gIGN0eC5saW5lVG8oeHlQb2ludHNbMV0ueCwgeHlQb2ludHNbMV0ueSk7XG4gIGN0eC5zdHJva2UoKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQmFzaWNQb2x5Z29uKGN0eCwgeHlQb2ludHMsIG1hcCwgZmVhdHVyZSwgcmVuZGVyKSB7XG4gIHZhciBwb2ludDtcbiAgaWYoIHh5UG9pbnRzLmxlbmd0aCA8PSAxICkgcmV0dXJuO1xuXG4gIGN0eC5iZWdpblBhdGgoKTtcblxuICBwb2ludCA9IHh5UG9pbnRzWzBdO1xuICBjdHgubW92ZVRvKHBvaW50LngsIHBvaW50LnkpO1xuICBmb3IoIHZhciBpID0gMTsgaSA8IHh5UG9pbnRzLmxlbmd0aDsgaSsrICkge1xuICAgIGN0eC5saW5lVG8oeHlQb2ludHNbaV0ueCwgeHlQb2ludHNbaV0ueSk7XG4gIH1cbiAgY3R4LmxpbmVUbyh4eVBvaW50c1swXS54LCB4eVBvaW50c1swXS55KTtcblxuICBjdHguc3Ryb2tlU3R5bGUgPSByZW5kZXIuaG92ZXIgPyAncmVkJyA6ICdyZ2JhKCcrcmVuZGVyVXRpbHMuY29sb3JzLnJnYi5ibHVlLmpvaW4oJywnKSsnLC42KSc7XG4gIGN0eC5maWxsU3R5bGUgPSByZW5kZXIuZmlsbFN0eWxlID8gcmVuZGVyLmZpbGxTdHlsZSA6ICdyZ2JhKCcrcmVuZGVyVXRpbHMuY29sb3JzLnJnYi5saWdodEJsdWUuam9pbignLCcpKycsLjYpJztcbiAgY3R4LmxpbmVXaWR0aCA9IDQ7XG5cbiAgY3R4LnN0cm9rZSgpO1xuICBjdHguZmlsbCgpO1xufVxuXG5mdW5jdGlvbiBnZXRMaW5lQ29sb3IoZmVhdHVyZSkge1xuICAgIHZhciBjb2xvciA9ICd3aGl0ZSc7XG5cbiAgICB2YXIgb3JpZ2luID0gY29sbGVjdGlvbi5nZXRCeVBybW5hbWUoZmVhdHVyZS5wcm9wZXJ0aWVzLm9yaWdpbik7XG4gICAgdmFyIHRlcm1pbnVzID0gY29sbGVjdGlvbi5nZXRCeVBybW5hbWUoZmVhdHVyZS5wcm9wZXJ0aWVzLnRlcm1pbnVzKTtcblxuICAgIGlmKCBmZWF0dXJlLnByb3BlcnRpZXMucmVuZGVySW5mbyApIHtcbiAgICAgICAgaWYoIHRlcm1pbnVzICYmIHRlcm1pbnVzLnByb3BlcnRpZXMudHlwZSA9PSAnU2luaycgKSB7XG4gICAgICAgICAgY29sb3IgPSByZW5kZXJVdGlscy5jb2xvcnMuZGFya0N5YW47XG4gICAgICAgIH0gZWxzZSBpZiggb3JpZ2luICYmIG9yaWdpbi5wcm9wZXJ0aWVzLnR5cGUubWF0Y2goL2RlbWFuZC9pKSApIHtcbiAgICAgICAgICAgIGNvbG9yID0gcmVuZGVyVXRpbHMuY29sb3JzLnJlZDtcbiAgICAgICAgfSBlbHNlIGlmKCBvcmlnaW4gJiYgdGVybWludXMgJiYgdGVybWludXMucHJvcGVydGllcy50eXBlLm1hdGNoKC9kZW1hbmQvaSkgJiYgb3JpZ2luLnByb3BlcnRpZXMudHlwZSA9PSAnR3JvdW5kd2F0ZXIgU3RvcmFnZScgKSB7XG4gICAgICAgICAgICBjb2xvciA9IHJlbmRlclV0aWxzLmNvbG9ycy5saWdodEdyZXk7XG4gICAgICAgIH0gZWxzZSBpZiggZmVhdHVyZS5wcm9wZXJ0aWVzLmRlc2NyaXB0aW9uLm1hdGNoKC9yZWNoYXJnZS9pLCAnJykgKSB7XG4gICAgICAgICAgICBjb2xvciA9IHJlbmRlclV0aWxzLmNvbG9ycy5ncmVlbjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaW5lID0ge1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIHdlaWdodDogMyxcbiAgICAgICAgb3BhY2l0eTogMC40LFxuICAgICAgICBzbW9vdGhGYWN0b3I6IDFcbiAgICB9XG5cbiAgICAvL2lmKCBmZWF0dXJlLnByb3BlcnRpZXMuY2FsaWJyYXRpb25Ob2RlICYmIHRoaXMubWFwRmlsdGVycy5jYWxpYnJhdGlvbk1vZGUgKSB7XG4gICAgaWYoIGZlYXR1cmUucHJvcGVydGllcy5jYWxpYnJhdGlvbk5vZGUgKSB7XG4gICAgICAgIGxpbmUuY29sb3IgPSAnYmx1ZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbG9yO1xufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAnUG93ZXIgUGxhbnQnICAgICAgICAgOiB7XG4gICAgY29sb3IgOiAnIzMzNjZjYycsXG4gICAgZ29vZ2xlIDogJ3NtYWxsX3JlZCdcbiAgfSxcbiAgJ0FncmljdWx0dXJhbCBEZW1hbmQnIDoge1xuICAgICAgY29sb3IgOiAnI2ZmOTkwMCcsXG4gICAgICBnb29nbGUgOiAnc21hbGxfeWVsbG93J1xuICB9LFxuICAnSnVuY3Rpb24nICAgICAgICAgICAgOiB7XG4gICAgICBjb2xvciA6ICcjMTA5NjE4JyxcbiAgICAgIGdvb2dsZSA6ICdzbWFsbF9ncmVlbidcbiAgfSxcbiAgJ1B1bXAgUGxhbnQnICAgICAgICAgIDoge1xuICAgICAgY29sb3IgOiAnIzk5MDA5OScsXG4gICAgICBnb29nbGUgOiAnc21hbGxfYmx1ZSdcbiAgfSxcbiAgJ1dhdGVyIFRyZWF0bWVudCcgICAgIDoge1xuICAgICAgY29sb3IgOiAnIzAwOTljNicsXG4gICAgICBnb29nbGUgOiAnc21hbGxfcHVycGxlJ1xuICB9LFxuICAnU3VyZmFjZSBTdG9yYWdlJyAgICAgOiB7XG4gICAgICBjb2xvciA6ICcjZGQ0NDc3JyxcbiAgICAgIGdvb2dsZSA6ICdtZWFzbGVfYnJvd24nLFxuICB9LFxuICAnVXJiYW4gRGVtYW5kJyAgICAgICAgOiB7XG4gICAgICBjb2xvciA6ICcjNjZhYTAwJyxcbiAgICAgIGdvb2dsZSA6ICdtZWFzbGVfZ3JleSdcbiAgfSxcbiAgJ1NpbmsnICAgICAgICAgICAgICAgIDoge1xuICAgICAgY29sb3IgOiAnI2I4MmUyZScsXG4gICAgICBnb29nbGUgOiAnbWVhc2xlX3doaXRlJ1xuICB9LFxuICAnR3JvdW5kd2F0ZXIgU3RvcmFnZScgOiB7XG4gICAgICBjb2xvciA6ICcjMzE2Mzk1JyxcbiAgICAgIGdvb2dsZSA6ICdtZWFzbGVfdHVycXVvaXNlJ1xuICB9LFxuICAnTm9uLVN0YW5kYXJkIERlbWFuZCcgOiB7XG4gICAgICBjb2xvciA6ICcjMjJhYTk5JyxcbiAgICAgIGdvb2dsZSA6ICdzaGFkZWRfZG90J1xuICB9XG59OyIsInZhciBjb2xvcnMgPSByZXF1aXJlKCcuL2NvbG9ycycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0eCwgY29uZmlnKSB7XG4gICAgaWYoICFjb25maWcuc3Ryb2tlICkgY29uZmlnLnN0cm9rZSA9IGNvbG9ycy5nZXRDb2xvcignYmxhY2snLCBjb25maWcub3BhY2l0eSk7XG4gICAgaWYoICFjb25maWcuZmlsbCApIGNvbmZpZy5maWxsID0gY29sb3JzLmdldENvbG9yKCdsaWdodEJsdWUnLCBjb25maWcub3BhY2l0eSk7XG5cbiAgICB1dGlscy5vdmFsKGN0eCwgY29uZmlnKTtcbn0iLCJ2YXIgY29sb3JzID0ge1xuICBiYXNlIDogJyMxOTc2RDInLFxuICBsaWdodEJsdWUgOiAnI0JCREVGQicsXG4gIGJsdWUgOiAnIzE5NzZEMicsXG4gIGxpZ2h0R3JleSA6ICcjNzI3MjcyJyxcbiAgb3JhbmdlIDogJyNGRjU3MjInLFxuICByZWQgOiAnI0QzMkYyRicsXG4gIGdyZWVuIDogJyM0Q0FGNTAnLFxuICB5ZWxsb3cgOiAnI0ZGRUIzQicsXG4gIGJsYWNrIDogJyMyMTIxMjEnLFxuICBjeWFuIDogJyMwMEJDRDQnLFxuICBkYXJrQ3lhbiA6ICcjMDA5N0E3JyxcbiAgaW5kaWdvIDogJyMzRjUxQjUnXG59O1xuXG5jb2xvcnMucmdiID0ge1xuICBiYXNlIDogWzI1LCAxMTgsIDIxMF0sXG4gIGxpZ2h0Qmx1ZSA6IFsxODcsIDIyMiwgMjUxXSxcbiAgYmx1ZSA6IFsyNSwgMTE4LCAyMTBdLFxuICBsaWdodEdyZXkgOiBbMTE0LCAxMTQsIDExNF0sXG4gIG9yYW5nZSA6IFsyNTUsIDg3LCAzNF0sXG4gIGdyZWVuIDogWzc2LCAxNzUsIDgwXSxcbiAgcmVkIDogWzIxMSwgNDcsIDQ3XSxcbiAgeWVsbG93IDogWzI1NSwgMjM1LCA1OV0sXG4gIGN5YW4gOiBbMCwgMTg4LCAyMTJdLFxuICBkYXJrQ3lhbiA6IFswLCAxNTEsIDE2N10sXG4gIGJsYWNrOlsyMSwyMSwyMV0sXG4gIGluZGlnbyA6IFs2MywgODEsIDE4MV1cbn07XG5cbmNvbG9ycy5nZXRDb2xvciA9IGZ1bmN0aW9uKG5hbWUsIG9wYWNpdHkpIHtcbiAgaWYoIG9wYWNpdHkgPT09IHVuZGVmaW5lZCApIG9wYWNpdHkgPSAxO1xuICByZXR1cm4gJ3JnYmEoJytjb2xvcnMucmdiW25hbWVdLmpvaW4oJywnKSsnLCcrb3BhY2l0eSsnKSc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29sb3JzO1xuIiwidmFyIGNvbG9ycyA9IHJlcXVpcmUoJy4vY29sb3JzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCBjb25maWcpIHtcbiAgICB2YXIgciA9IGNvbmZpZy53aWR0aCAvIDI7XG5cbiAgICB2YXIgZ3JkID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KGNvbmZpZy54K3IsIGNvbmZpZy55LCBjb25maWcueCtyLCBjb25maWcueStjb25maWcuaGVpZ2h0LSguMjUqY29uZmlnLmhlaWdodCkpO1xuICAgIGdyZC5hZGRDb2xvclN0b3AoMCwgY29uZmlnLnN0cm9rZSB8fCBjb2xvcnMuZ2V0Q29sb3IoJ2JsdWUnLCBjb25maWcub3BhY2l0eSkpO1xuICAgIGdyZC5hZGRDb2xvclN0b3AoMSwgY29uZmlnLmZpbGwgfHwgY29sb3JzLmdldENvbG9yKCdncmVlbicsIGNvbmZpZy5vcGFjaXR5KSk7XG4gICAgY3R4LmZpbGxTdHlsZT1ncmQ7XG5cbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb25maWcuc3Ryb2tlIHx8IGNvbG9ycy5nZXRDb2xvcignYmxhY2snLCBjb25maWcub3BhY2l0eSk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IGNvbmZpZy5saW5lV2lkdGggfHwgMjtcblxuICAgIHV0aWxzLm5TaWRlZFBhdGgoY3R4LCBjb25maWcueCwgY29uZmlnLnksIHIsIDMsIDkwKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0eXBlLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgY2FudmFzLndpZHRoID0gd2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgaWYoICFDV04ucmVuZGVyW3R5cGVdICkgcmV0dXJuIGNhbnZhcztcblxuICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIENXTi5yZW5kZXJbdHlwZV0oY3R4LCAyLCAyLCB3aWR0aC00LCBoZWlnaHQtNCk7XG5cbiAgcmV0dXJuIGNhbnZhcztcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29sb3JzIDogcmVxdWlyZSgnLi9jb2xvcnMnKSxcbiAgaWNvbiA6IHJlcXVpcmUoJy4vaWNvbicpLFxuICBKdW5jdGlvbiA6IHJlcXVpcmUoJy4vanVuY3Rpb24nKSxcbiAgJ1Bvd2VyIFBsYW50JyA6IHJlcXVpcmUoJy4vcG93ZXItcGxhbnQnKSxcbiAgJ1B1bXAgUGxhbnQnIDogcmVxdWlyZSgnLi9wdW1wLXBsYW50JyksXG4gICdXYXRlciBUcmVhdG1lbnQnIDogcmVxdWlyZSgnLi93YXRlci10cmVhdG1lbnQnKSxcbiAgJ1N1cmZhY2UgU3RvcmFnZScgOiByZXF1aXJlKCcuL3N1cmZhY2Utc3RvcmFnZScpLFxuICAnR3JvdW5kd2F0ZXIgU3RvcmFnZScgOiByZXF1aXJlKCcuL2dyb3VuZHdhdGVyLXN0b3JhZ2UnKSxcbiAgU2luayA6IHJlcXVpcmUoJy4vc2luaycpLFxuICAnTm9uLVN0YW5kYXJkIERlbWFuZCcgOiByZXF1aXJlKCcuL25vbnN0YW5kYXJkLWRlbWFuZCcpLFxuICAnQWdyaWN1bHR1cmFsIERlbWFuZCcgOiByZXF1aXJlKCcuL2FncmljdWx0dXJhbC1kZW1hbmQnKSxcbiAgJ1VyYmFuIERlbWFuZCcgOiByZXF1aXJlKCcuL3VyYmFuLWRlbWFuZCcpLFxuICBXZXRsYW5kIDogcmVxdWlyZSgnLi93ZXRsYW5kJyksXG4gIGxpbmVNYXJrZXJzIDogcmVxdWlyZSgnLi9saW5lLW1hcmtlcnMnKVxufSIsInZhciBjb2xvcnMgPSByZXF1aXJlKCcuL2NvbG9ycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0eCwgY29uZmlnKSB7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbmZpZy5maWxsIHx8ICBjb2xvcnMuZ2V0Q29sb3IoJ2JsdWUnLCBjb25maWcub3BhY2l0eSk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29uZmlnLnN0cm9rZSB8fCBjb2xvcnMuZ2V0Q29sb3IoJ2JsYWNrJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGN0eC5saW5lV2lkdGggPSBjb25maWcubGluZVdpZHRoIHx8IDI7XG5cbiAgICB2YXIgciA9IGNvbmZpZy53aWR0aCAvIDI7XG5cbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmFyYyhjb25maWcueCtyLCBjb25maWcueStyLCByLCAwLCBNYXRoLlBJKjIsIHRydWUpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbn0iLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9jb2xvcnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29zdCA6IGZ1bmN0aW9uKGN4dCwgeCwgeSwgcyl7XG4gICAgICBjeHQuYmVnaW5QYXRoKCk7XG4gICAgICBjeHQuYXJjKHgsIHksIHMsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICBjeHQuZmlsbFN0eWxlID0gY29sb3JzLmdyZWVuO1xuICAgICAgY3h0LmZpbGwoKTtcbiAgICAgIGN4dC5jbG9zZVBhdGgoKTtcbiAgICB9LFxuICAgIGFtcGxpdHVkZSA6IGZ1bmN0aW9uKGN4dCwgeCwgeSwgcyl7XG4gICAgICBjeHQuYmVnaW5QYXRoKCk7XG4gICAgICBjeHQuYXJjKHgsIHksIHMsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICBjeHQubGluZVdpZHRoID0gMjtcbiAgICAgIGN4dC5zdHJva2VTdHlsZSA9IGNvbG9ycy5ibGFjaztcbiAgICAgIGN4dC5zdHJva2UoKTtcbiAgICAgIGN4dC5jbG9zZVBhdGgoKTtcbiAgICB9LFxuICAgIGNvbnN0cmFpbnRzIDogZnVuY3Rpb24oY3h0LCB4LCB5LCBzLCB2WCwgdlkpe1xuICAgICAgY3h0LmJlZ2luUGF0aCgpO1xuICAgICAgdmFyIGR4ID0gdlggKiAuNDtcbiAgICAgIHZhciBkeSA9IHZZICogLjQ7XG5cbiAgICAgIGN4dC5iZWdpblBhdGgoKTtcbiAgICAgIGN4dC5tb3ZlVG8oeCt2WStkeCwgeS12WCtkeSk7XG4gICAgICBjeHQubGluZVRvKHgrdlktZHgsIHktdlgtZHkpO1xuXG4gICAgICBjeHQubGluZVRvKHgtdlktZHgsIHkrdlgtZHkpO1xuICAgICAgY3h0LmxpbmVUbyh4LXZZK2R4LCB5K3ZYK2R5KTtcbiAgICAgIGN4dC5saW5lVG8oeCt2WStkeCwgeS12WCtkeSk7XG4gICAgICBjeHQuc3Ryb2tlU3R5bGUgPSBjb2xvcnMuYmxhY2s7XG4gICAgICBjeHQuc3Ryb2tlKCk7XG4gICAgICBjeHQuY2xvc2VQYXRoKCk7XG4gICAgfSxcbiAgICBlbnZpcm9ubWVudGFsIDogZnVuY3Rpb24oY3h0LCB4LCB5LCBzKXtcbiAgICAgIGN4dC5iZWdpblBhdGgoKTtcbiAgICAgIGN4dC5hcmMoeCwgeSwgcywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgIGN4dC5saW5lV2lkdGggPSAyO1xuICAgICAgY3h0LnN0cm9rZVN0eWxlID0gY29sb3JzLmdyZWVuO1xuICAgICAgY3h0LnN0cm9rZSgpO1xuICAgICAgY3h0LmNsb3NlUGF0aCgpO1xuICAgIH1cbn07IiwidmFyIGNvbG9ycyA9IHJlcXVpcmUoJy4vY29sb3JzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCBjb25maWcpIHtcbiAgICBjdHguZmlsbFN0eWxlID0gY29uZmlnLmZpbGwgfHwgY29sb3JzLmdldENvbG9yKCdyZWQnLCBjb25maWcub3BhY2l0eSk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29uZmlnLnN0cm9rZSB8fCBjb2xvcnMuZ2V0Q29sb3IoJ2JsYWNrJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGN0eC5saW5lV2lkdGggPSBjb25maWcubGluZVdpZHRoIHx8IDI7XG5cbiAgICB1dGlscy5uU2lkZWRQYXRoKGN0eCwgY29uZmlnLngsIGNvbmZpZy55LCBjb25maWcud2lkdGgvMiwgNCwgNDUpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbn0iLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9jb2xvcnMnKTtcbnZhciBqdW5jdGlvbiA9IHJlcXVpcmUoJy4vanVuY3Rpb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHgsIGNvbmZpZykge1xuICBjb25maWcuZmlsbCA9IGNvbG9ycy5nZXRDb2xvcignZGFya0N5YW4nLCBjb25maWcub3BhY2l0eSk7XG5cbiAganVuY3Rpb24oY3R4LCBjb25maWcpO1xuICB2YXIgciA9IGNvbmZpZy53aWR0aCAvIDI7XG5cbiAgLy8gaG9yaXpvbnRhbCBsaW5lXG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4Lm1vdmVUbyhjb25maWcueCwgY29uZmlnLnkrcik7XG4gIGN0eC5saW5lVG8oY29uZmlnLngrY29uZmlnLndpZHRoLCBjb25maWcueStyKTtcbiAgY3R4LnN0cm9rZSgpO1xuICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgLy8gdmVydGljYWwgbGluZVxuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5tb3ZlVG8oY29uZmlnLngrciwgY29uZmlnLnkpO1xuICBjdHgubGluZVRvKGNvbmZpZy54K3IsIGNvbmZpZy55K2NvbmZpZy53aWR0aCk7XG4gIGN0eC5zdHJva2UoKTtcbiAgY3R4LmNsb3NlUGF0aCgpO1xufSIsInZhciBjb2xvcnMgPSByZXF1aXJlKCcuL2NvbG9ycycpO1xudmFyIGp1bmN0aW9uID0gcmVxdWlyZSgnLi9qdW5jdGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0eCwgY29uZmlnKSB7XG4gICAgY29uZmlnLmZpbGwgPSBjb2xvcnMuZ2V0Q29sb3IoJ2luZGlnbycsIGNvbmZpZy5vcGFjaXR5KTtcblxuICAgIGp1bmN0aW9uKGN0eCwgY29uZmlnKTtcblxuICAgIHZhciByID0gY29uZmlnLndpZHRoIC8gMjtcbiAgICB2YXIgY3ggPSBjb25maWcueCArIHI7XG4gICAgdmFyIGN5ID0gY29uZmlnLnkgKyByO1xuXG4gICAgdmFyIHgxID0gY3ggKyByICogTWF0aC5jb3MoTWF0aC5QSS80KTtcbiAgICB2YXIgeTEgPSBjeSArIHIgKiBNYXRoLnNpbihNYXRoLlBJLzQpO1xuICAgIHZhciB4MiA9IGN4ICsgciAqIE1hdGguY29zKE1hdGguUEkgKiAoNS80KSk7XG4gICAgdmFyIHkyID0gY3kgKyByICogTWF0aC5zaW4oTWF0aC5QSSAqICg1LzQpKTtcblxuICAgIC8vIGxpbmUgMVxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKHgxLCB5MSk7XG4gICAgY3R4LmxpbmVUbyh4MiwgeTIpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgICB4MSA9IGN4ICsgciAqIE1hdGguY29zKE1hdGguUEkgKiAoMy80KSk7XG4gICAgeTEgPSBjeSArIHIgKiBNYXRoLnNpbihNYXRoLlBJICogKDMvNCkpO1xuICAgIHgyID0gY3ggKyByICogTWF0aC5jb3MoTWF0aC5QSSAqICg3LzQpKTtcbiAgICB5MiA9IGN5ICsgciAqIE1hdGguc2luKE1hdGguUEkgKiAoNy80KSk7XG5cbiAgICAvLyBsaW5lIDJcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbyh4MSwgeTEpO1xuICAgIGN0eC5saW5lVG8oeDIsIHkyKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xufVxuIiwidmFyIGNvbG9ycyA9IHJlcXVpcmUoJy4vY29sb3JzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCBjb25maWcpIHtcbiAgICBjdHguZmlsbFN0eWxlID0gY29uZmlnLmZpbGwgfHwgY29sb3JzLmdldENvbG9yKCdiYXNlJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbmZpZy5zdHJva2UgfHwgY29sb3JzLmdldENvbG9yKCdibGFjaycsIGNvbmZpZy5vcGFjaXR5KTtcbiAgICBjdHgubGluZVdpZHRoID0gY29uZmlnLmxpbmVXaWR0aCB8fCAyO1xuXG4gICAgdXRpbHMublNpZGVkUGF0aChjdHgsIGNvbmZpZy54LCBjb25maWcueSwgY29uZmlnLndpZHRoLzIsIDQsIDQ1KTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG59IiwidmFyIGNvbG9ycyA9IHJlcXVpcmUoJy4vY29sb3JzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCBjb25maWcpIHtcbiAgICBjdHguZmlsbFN0eWxlID0gY29uZmlnLmZpbGwgfHwgY29sb3JzLmdldENvbG9yKCd5ZWxsb3cnLCBjb25maWcub3BhY2l0eSk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29uZmlnLnN0cm9rZSB8fCBjb2xvcnMuZ2V0Q29sb3IoJ2JsYWNrJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGN0eC5saW5lV2lkdGggPSBjb25maWcubGluZVdpZHRoIHx8IDI7XG5cbiAgICB1dGlscy5uU2lkZWRQYXRoKGN0eCwgY29uZmlnLngsIGNvbmZpZy55LCBjb25maWcud2lkdGgvMiwgMywgOTApO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbn0iLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9jb2xvcnMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHgsIGNvbmZpZykge1xuICAgIGlmKCAhY29uZmlnLnN0cm9rZSApIGNvbmZpZy5zdHJva2UgPSBjb2xvcnMuZ2V0Q29sb3IoJ2JsYWNrJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGlmKCAhY29uZmlnLmZpbGwgKSBjb25maWcuZmlsbCA9IGNvbG9ycy5nZXRDb2xvcignb3JhbmdlJywgY29uZmlnLm9wYWNpdHkpO1xuXG4gICAgdXRpbHMub3ZhbChjdHgsIGNvbmZpZyk7XG59IiwiZnVuY3Rpb24gb3ZhbChjdHgsIGNvbmZpZykge1xuICAgIGN0eC5maWxsU3R5bGUgPSBjb25maWcuZmlsbDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb25maWcuc3Ryb2tlO1xuICAgIGN0eC5saW5lV2lkdGggPSBjb25maWcubGluZVdpZHRoIHx8IDI7XG5cbiAgICBjb25maWcuaGVpZ2h0IC09IGNvbmZpZy53aWR0aCAqIC41O1xuICAgIGNvbmZpZy55ICs9IGNvbmZpZy5oZWlnaHQgLyAyO1xuXG4gICAgdmFyIGthcHBhID0gLjU1MjI4NDgsXG4gICAgICBveCA9IChjb25maWcud2lkdGggLyAyKSAqIGthcHBhLCAvLyBjb250cm9sIHBvaW50IG9mZnNldCBob3Jpem9udGFsXG4gICAgICBveSA9IChjb25maWcuaGVpZ2h0IC8gMikgKiBrYXBwYSwgLy8gY29udHJvbCBwb2ludCBvZmZzZXQgdmVydGljYWxcbiAgICAgIHhlID0gY29uZmlnLnggKyBjb25maWcud2lkdGgsICAgICAgICAgICAvLyB4LWVuZFxuICAgICAgeWUgPSBjb25maWcueSArIGNvbmZpZy5oZWlnaHQsICAgICAgICAgICAvLyB5LWVuZFxuICAgICAgeG0gPSBjb25maWcueCArIGNvbmZpZy53aWR0aCAvIDIsICAgICAgIC8vIHgtbWlkZGxlXG4gICAgICB5bSA9IGNvbmZpZy55ICsgY29uZmlnLmhlaWdodCAvIDI7ICAgICAgIC8vIHktbWlkZGxlXG5cbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbyhjb25maWcueCwgeW0pO1xuICAgIGN0eC5iZXppZXJDdXJ2ZVRvKGNvbmZpZy54LCB5bSAtIG95LCB4bSAtIG94LCBjb25maWcueSwgeG0sIGNvbmZpZy55KTtcbiAgICBjdHguYmV6aWVyQ3VydmVUbyh4bSArIG94LCBjb25maWcueSwgeGUsIHltIC0gb3ksIHhlLCB5bSk7XG4gICAgY3R4LmJlemllckN1cnZlVG8oeGUsIHltICsgb3ksIHhtICsgb3gsIHllLCB4bSwgeWUpO1xuICAgIGN0eC5iZXppZXJDdXJ2ZVRvKHhtIC0gb3gsIHllLCBjb25maWcueCwgeW0gKyBveSwgY29uZmlnLngsIHltKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbn1cblxuLyoqIGhlbHBlciBmb3IgdHJlYXRtZW50LCBzdXJmYWNlIHN0b3JhZ2UgYW5kIGdyb3VuZCB3YXRlciAqKi9cbmZ1bmN0aW9uIG5TaWRlZFBhdGgoY3R4LCBsZWZ0LCB0b3AsIHJhZGl1cywgc2lkZXMsIHN0YXJ0QW5nbGUpIHtcbiAgICAvLyB0aGlzIGlzIGRyYXdpbmcgZnJvbSBjZW50ZXJcbiAgICBsZWZ0ICs9IHJhZGl1cztcbiAgICB0b3AgKz0gcmFkaXVzO1xuXG4gICAgdmFyIGEgPSAoKE1hdGguUEkgKiAyKS9zaWRlcyk7XG4gICAgdmFyIHIgPSBzdGFydEFuZ2xlICogKE1hdGguUEkgLyAxODApLCB4LCB5O1xuXG4gICAgLy8gdGhpbmsgeW91IG5lZWQgdG8gYWRqdXN0IGJ5IHgsIHlcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgdmFyIHhzID0gbGVmdCArIChyYWRpdXMgKiBNYXRoLmNvcygtMSAqIHIpKTtcbiAgICB2YXIgeXMgPSB0b3AgKyAocmFkaXVzICogTWF0aC5zaW4oLTEgKiByKSk7XG4gICAgY3R4Lm1vdmVUbyh4cywgeXMpO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgc2lkZXM7IGkrKykge1xuICAgICAgICB4ID0gbGVmdCArIChyYWRpdXMgKiBNYXRoLmNvcyhhKmktcikpO1xuICAgICAgICB5ID0gdG9wICsgKHJhZGl1cyAqIE1hdGguc2luKGEqaS1yKSk7XG4gICAgICAgIGN0eC5saW5lVG8oeCwgeSk7XG4gICAgfVxuICAgIGN0eC5saW5lVG8oeHMsIHlzKTtcblxuICAgIC8vIG5vdCBwYWludGluZywgbGVhdmUgdGhpcyB0byB0aGUgZHJhdyBmdW5jdGlvblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgb3ZhbCA6IG92YWwsXG4gIG5TaWRlZFBhdGggOiBuU2lkZWRQYXRoXG59IiwidmFyIGNvbG9ycyA9IHJlcXVpcmUoJy4vY29sb3JzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCBjb25maWcpIHtcbiAgICBjdHguZmlsbFN0eWxlID0gY29uZmlnLmZpbGwgfHwgY29sb3JzLmdldENvbG9yKCdjeWFuJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbmZpZy5zdHJva2UgfHwgY29sb3JzLmdldENvbG9yKCdibGFjaycsIGNvbmZpZy5vcGFjaXR5KTtcbiAgICBjdHgubGluZVdpZHRoID0gY29uZmlnLmxpbmVXaWR0aCB8fCAyO1xuXG4gICAgdXRpbHMublNpZGVkUGF0aChjdHgsIGNvbmZpZy54LCBjb25maWcueSwgY29uZmlnLndpZHRoLzIsIDgsIDIyLjUpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbn0iLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9jb2xvcnMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHgsIGNvbmZpZykge1xuICAgIGlmKCAhY29uZmlnLnN0cm9rZSApIGNvbmZpZy5zdHJva2UgPSBjb2xvcnMuZ2V0Q29sb3IoJ2JsYWNrJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGlmKCAhY29uZmlnLmZpbGwgKSBjb25maWcuZmlsbCA9IGNvbG9ycy5nZXRDb2xvcignZ3JlZW4nLCBjb25maWcub3BhY2l0eSk7XG5cbiAgICB1dGlscy5vdmFsKGN0eCwgY29uZmlnKTtcbn0iLCJ2YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcblxuZnVuY3Rpb24gbG9hZE5ldHdvcmsoY2FsbGJhY2spIHtcbiAgdmFyIG5ldHdvcmssIHJlZ2lvbnM7XG4gIHZhciByZWdpb25zID0gZmFsc2U7XG4gIFxuICBmdW5jdGlvbiBkb25lKCkge1xuICAgIGlmKCBuZXR3b3JrICYmIHJlZ2lvbnMgKSB7XG4gICAgICBjYWxsYmFjayh7XG4gICAgICAgIG5ldHdvcmsgOiBuZXR3b3JrLFxuICAgICAgICByZWdpb25zIDogcmVnaW9uc1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHJlcXVlc3RcbiAgICAuZ2V0KCcvbmV0d29yay9nZXQnKVxuICAgIC5lbmQoZnVuY3Rpb24oZXJyLCByZXNwKXtcbiAgICAgIG5ldHdvcmtMb2FkZWQgPSB0cnVlO1xuXG4gICAgICBpZiggZXJyIHx8IHJlc3AuZXJyb3IgKSB7XG4gICAgICAgICAgYWxlcnQoJ1NlcnZlciBlcnJvciBsb2FkaW5nIG5ldHdvcmsgOignKTtcbiAgICAgICAgICByZXR1cm4gZG9uZSgpO1xuICAgICAgfVxuXG4gICAgICBuZXR3b3JrID0gcmVzcC5ib2R5IHx8IFtdXG5cbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcblxuICByZXF1ZXN0XG4gICAgLmdldCgnL3JlZ2lvbnMvZ2V0JylcbiAgICAuZW5kKGZ1bmN0aW9uKGVyciwgcmVzcCl7XG4gICAgICBuZXR3b3JrTG9hZGVkID0gdHJ1ZTtcblxuICAgICAgaWYoIGVyciB8fCByZXNwLmVycm9yICkge1xuICAgICAgICAgIGFsZXJ0KCdTZXJ2ZXIgZXJyb3IgbG9hZGluZyByZWdpb25zIDooJyk7XG4gICAgICAgICAgcmV0dXJuIGRvbmUoKTtcbiAgICAgIH1cblxuICAgICAgcmVnaW9ucyA9IHJlc3AuYm9keSB8fCBbXVxuXG4gICAgICBkb25lKCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEV4dHJhcyhwcm1uYW1lLCBjYWxsYmFjaykge1xuICByZXF1ZXN0XG4gICAgLmdldCgnL25ldHdvcmsvZXh0cmFzJylcbiAgICAucXVlcnkoe3BybW5hbWU6IHBybW5hbWV9KVxuICAgIC5lbmQoKGVyciwgcmVzcCkgPT4ge1xuICAgICAgY2FsbGJhY2socmVzcC5ib2R5KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0QWdncmVnYXRlKHF1ZXJ5LCBjYWxsYmFjaykge1xuICByZXF1ZXN0XG4gICAgLmdldCgnL3JlZ2lvbnMvYWdncmVnYXRlJylcbiAgICAucXVlcnkocXVlcnkpXG4gICAgLmVuZCgoZXJyLCByZXNwKSA9PiB7XG4gICAgICBjYWxsYmFjayhyZXNwLmJvZHkpO1xuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbG9hZE5ldHdvcmsgOiBsb2FkTmV0d29yayxcbiAgZ2V0RXh0cmFzIDogZ2V0RXh0cmFzLFxuICBnZXRBZ2dyZWdhdGUgOiBnZXRBZ2dyZWdhdGVcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZW5kZXJlciA9IHJlcXVpcmUoJy4vcmVuZGVyZXInKTtcblxuc2lnbWEudXRpbHMucGtnKCdzaWdtYS5jYW52YXMubm9kZXMnKTtcblxuLyoqXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSAgICAgICAgICAgICAgICAgICBub2RlICAgICBUaGUgbm9kZSBvYmplY3QuXG4gKiBAcGFyYW0gIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGNvbnRleHQgIFRoZSBjYW52YXMgY29udGV4dC5cbiAqIEBwYXJhbSAge2NvbmZpZ3VyYWJsZX0gICAgICAgICAgICAgc2V0dGluZ3MgVGhlIHNldHRpbmdzIGZ1bmN0aW9uLlxuICovXG5zaWdtYS5jYW52YXMubm9kZXMuSnVuY3Rpb24gPSBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnO1xuXG4gIHZhciBzID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddKjI7XG5cbiAgcmVuZGVyZXIuSnVuY3Rpb24oY29udGV4dCwge1xuICAgIHg6IG5vZGVbcHJlZml4ICsgJ3gnXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgeTogbm9kZVtwcmVmaXggKyAneSddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB3aWR0aDogcyxcbiAgICBoZWlnaHQ6IHNcbiAgfSk7XG59O1xuXG5zaWdtYS5jYW52YXMubm9kZXNbJ1Bvd2VyIFBsYW50J10gPSBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnO1xuXG4gIHZhciBzID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddKjI7XG5cbiAgcmVuZGVyZXJbJ1Bvd2VyIFBsYW50J10oY29udGV4dCwge1xuICAgIHg6IG5vZGVbcHJlZml4ICsgJ3gnXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgeTogbm9kZVtwcmVmaXggKyAneSddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB3aWR0aDogcyxcbiAgICBoZWlnaHQ6IHNcbiAgfSk7XG59O1xuXG5zaWdtYS5jYW52YXMubm9kZXNbJ1B1bXAgUGxhbnQnXSA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG5cbiAgdmFyIHMgPSBub2RlW3ByZWZpeCArICdzaXplJ10qMjtcblxuICByZW5kZXJlclsnUHVtcCBQbGFudCddKGNvbnRleHQsIHtcbiAgICB4OiBub2RlW3ByZWZpeCArICd4J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHk6IG5vZGVbcHJlZml4ICsgJ3knXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgd2lkdGg6IHMsXG4gICAgaGVpZ2h0OiBzXG4gIH0pO1xufTtcblxuc2lnbWEuY2FudmFzLm5vZGVzWydXYXRlciBUcmVhdG1lbnQnXSA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG5cbiAgdmFyIHMgPSBub2RlW3ByZWZpeCArICdzaXplJ10qMjtcblxuICByZW5kZXJlclsnV2F0ZXIgVHJlYXRtZW50J10oY29udGV4dCwge1xuICAgIHg6IG5vZGVbcHJlZml4ICsgJ3gnXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgeTogbm9kZVtwcmVmaXggKyAneSddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB3aWR0aDogcyxcbiAgICBoZWlnaHQ6IHNcbiAgfSk7XG59O1xuXG5zaWdtYS5jYW52YXMubm9kZXNbJ1N1cmZhY2UgU3RvcmFnZSddID0gZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJztcblxuICB2YXIgcyA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXSoyO1xuXG4gIHJlbmRlcmVyWydTdXJmYWNlIFN0b3JhZ2UnXShjb250ZXh0LCB7XG4gICAgeDogbm9kZVtwcmVmaXggKyAneCddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB5OiBub2RlW3ByZWZpeCArICd5J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHdpZHRoOiBzLFxuICAgIGhlaWdodDogc1xuICB9KTtcbn07XG5cbnNpZ21hLmNhbnZhcy5ub2Rlc1snR3JvdW5kd2F0ZXIgU3RvcmFnZSddID0gZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJztcblxuICB2YXIgcyA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXSoyO1xuXG4gIHJlbmRlcmVyWydHcm91bmR3YXRlciBTdG9yYWdlJ10oY29udGV4dCwge1xuICAgIHg6IG5vZGVbcHJlZml4ICsgJ3gnXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgeTogbm9kZVtwcmVmaXggKyAneSddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB3aWR0aDogcyxcbiAgICBoZWlnaHQ6IHNcbiAgfSk7XG59O1xuXG5zaWdtYS5jYW52YXMubm9kZXNbJ0FncmljdWx0dXJhbCBEZW1hbmQnXSA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG5cbiAgdmFyIHMgPSBub2RlW3ByZWZpeCArICdzaXplJ10qMjtcblxuICByZW5kZXJlclsnQWdyaWN1bHR1cmFsIERlbWFuZCddKGNvbnRleHQsIHtcbiAgICB4OiBub2RlW3ByZWZpeCArICd4J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHk6IG5vZGVbcHJlZml4ICsgJ3knXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgd2lkdGg6IHMsXG4gICAgaGVpZ2h0OiBzXG4gIH0pO1xufTtcblxuc2lnbWEuY2FudmFzLm5vZGVzWydVcmJhbiBEZW1hbmQnXSA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG5cbiAgdmFyIHMgPSBub2RlW3ByZWZpeCArICdzaXplJ10qMjtcblxuICByZW5kZXJlclsnVXJiYW4gRGVtYW5kJ10oY29udGV4dCwge1xuICAgIHg6IG5vZGVbcHJlZml4ICsgJ3gnXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgeTogbm9kZVtwcmVmaXggKyAneSddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB3aWR0aDogcyxcbiAgICBoZWlnaHQ6IHNcbiAgfSk7XG59O1xuXG5zaWdtYS5jYW52YXMubm9kZXMuU2luayA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG5cbiAgdmFyIHMgPSBub2RlW3ByZWZpeCArICdzaXplJ10qMjtcblxuICByZW5kZXJlci5TaW5rKGNvbnRleHQsIHtcbiAgICB4OiBub2RlW3ByZWZpeCArICd4J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHk6IG5vZGVbcHJlZml4ICsgJ3knXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgd2lkdGg6IHMsXG4gICAgaGVpZ2h0OiBzXG4gIH0pO1xufTtcblxuc2lnbWEuY2FudmFzLm5vZGVzWydOb24tU3RhbmRhcmQgRGVtYW5kJ10gPSBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnO1xuXG4gIHZhciBzID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddKjI7XG5cbiAgcmVuZGVyZXJbJ05vbi1TdGFuZGFyZCBEZW1hbmQnXShjb250ZXh0LCB7XG4gICAgeDogbm9kZVtwcmVmaXggKyAneCddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB5OiBub2RlW3ByZWZpeCArICd5J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHdpZHRoOiBzLFxuICAgIGhlaWdodDogc1xuICB9KTtcbn07XG5cbnNpZ21hLmNhbnZhcy5ub2Rlcy5XZXRsYW5kID0gZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJztcblxuICB2YXIgcyA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXSoyO1xuXG5cbiAgcmVuZGVyZXIuV2V0bGFuZChjb250ZXh0LCB7XG4gICAgeDogbm9kZVtwcmVmaXggKyAneCddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB5OiBub2RlW3ByZWZpeCArICd5J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHdpZHRoOiBzLFxuICAgIGhlaWdodDogc1xuICB9KTtcbn07XG5cblxuXG5zaWdtYS51dGlscy5wa2coJ3NpZ21hLmNhbnZhcy5lZGdlcycpO1xuXG4vKipcbiAqIFRoaXMgZWRnZSByZW5kZXJlciB3aWxsIGRpc3BsYXkgZWRnZXMgYXMgYXJyb3dzIGdvaW5nIGZyb20gdGhlIHNvdXJjZSBub2RlXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSAgICAgICAgICAgICAgICAgICBlZGdlICAgICAgICAgVGhlIGVkZ2Ugb2JqZWN0LlxuICogQHBhcmFtICB7b2JqZWN0fSAgICAgICAgICAgICAgICAgICBzb3VyY2Ugbm9kZSAgVGhlIGVkZ2Ugc291cmNlIG5vZGUuXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgICAgICAgICAgICAgICAgIHRhcmdldCBub2RlICBUaGUgZWRnZSB0YXJnZXQgbm9kZS5cbiAqIEBwYXJhbSAge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY29udGV4dCAgICAgIFRoZSBjYW52YXMgY29udGV4dC5cbiAqIEBwYXJhbSAge2NvbmZpZ3VyYWJsZX0gICAgICAgICAgICAgc2V0dGluZ3MgICAgIFRoZSBzZXR0aW5ncyBmdW5jdGlvbi5cbiAqL1xuc2lnbWEuY2FudmFzLmVkZ2VzLmN3biA9IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xuXG4gIHZhciBjb2xvciA9IGVkZ2UuY29sb3IsXG4gICAgICBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICBlZGdlQ29sb3IgPSBzZXR0aW5ncygnZWRnZUNvbG9yJyksXG4gICAgICBkZWZhdWx0Tm9kZUNvbG9yID0gc2V0dGluZ3MoJ2RlZmF1bHROb2RlQ29sb3InKSxcbiAgICAgIGRlZmF1bHRFZGdlQ29sb3IgPSBzZXR0aW5ncygnZGVmYXVsdEVkZ2VDb2xvcicpLFxuICAgICAgc2l6ZSA9IGVkZ2VbcHJlZml4ICsgJ3NpemUnXSB8fCAxLFxuICAgICAgdFNpemUgPSB0YXJnZXRbcHJlZml4ICsgJ3NpemUnXSxcbiAgICAgIHNYID0gc291cmNlW3ByZWZpeCArICd4J10sXG4gICAgICBzWSA9IHNvdXJjZVtwcmVmaXggKyAneSddLFxuICAgICAgdFggPSB0YXJnZXRbcHJlZml4ICsgJ3gnXSxcbiAgICAgIHRZID0gdGFyZ2V0W3ByZWZpeCArICd5J10sXG4gICAgICBhU2l6ZSA9IE1hdGgubWF4KHNpemUgKiAyLjUsIHNldHRpbmdzKCdtaW5BcnJvd1NpemUnKSksXG4gICAgICBkID0gTWF0aC5zcXJ0KE1hdGgucG93KHRYIC0gc1gsIDIpICsgTWF0aC5wb3codFkgLSBzWSwgMikpLFxuICAgICAgYVggPSBzWCArICh0WCAtIHNYKSAqIChkIC0gYVNpemUgLSB0U2l6ZSkgLyBkLFxuICAgICAgYVkgPSBzWSArICh0WSAtIHNZKSAqIChkIC0gYVNpemUgLSB0U2l6ZSkgLyBkLFxuICAgICAgdlggPSAodFggLSBzWCkgKiBhU2l6ZSAvIGQsXG4gICAgICB2WSA9ICh0WSAtIHNZKSAqIGFTaXplIC8gZDtcblxuICB2YXIgY29sb3IgPSByZW5kZXJlci5jb2xvcnMuc2FsbW9uO1xuICBpZiggZWRnZS5jYWx2aW4ucmVuZGVySW5mbyApIHtcbiAgICAgIGlmKCBlZGdlLmNhbHZpbi5yZW5kZXJJbmZvLnR5cGUgPT0gJ2Zsb3dUb1NpbmsnICkge1xuICAgICAgICBjb2xvciA9IHJlbmRlcmVyLmNvbG9ycy5saWdodEdyZXk7XG4gICAgICB9IGVsc2UgaWYoIGVkZ2UuY2FsdmluLnJlbmRlckluZm8udHlwZSA9PSAncmV0dXJuRmxvd0Zyb21EZW1hbmQnICkge1xuICAgICAgICAgIGNvbG9yID0gcmVuZGVyZXIuY29sb3JzLnJlZDtcbiAgICAgIH0gZWxzZSBpZiggZWRnZS5jYWx2aW4ucmVuZGVySW5mby50eXBlID09ICdnd1RvRGVtYW5kJyApIHtcbiAgICAgICAgICBjb2xvciA9IHJlbmRlcmVyLmNvbG9ycy5ibGFjaztcbiAgICAgIH0gZWxzZSBpZiggZWRnZS5jYWx2aW4ucmVuZGVySW5mby50eXBlID09ICdhcnRpZmljYWxSZWNoYXJnZScgKSB7XG4gICAgICAgICAgY29sb3IgPSByZW5kZXJlci5jb2xvcnMucHVycGxlO1xuICAgICAgfVxuICB9XG5cbiAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICBjb250ZXh0LmxpbmVXaWR0aCA9IHNpemU7XG4gIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gIGNvbnRleHQubW92ZVRvKHNYLCBzWSk7XG4gIGNvbnRleHQubGluZVRvKFxuICAgIGFYLFxuICAgIGFZXG4gICk7XG4gIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgY29udGV4dC5tb3ZlVG8oYVggKyB2WCwgYVkgKyB2WSk7XG4gIGNvbnRleHQubGluZVRvKGFYICsgdlkgKiAwLjgsIGFZIC0gdlggKiAwLjgpO1xuICBjb250ZXh0LmxpbmVUbyhhWCAtIHZZICogMC44LCBhWSArIHZYICogMC44KTtcbiAgY29udGV4dC5saW5lVG8oYVggKyB2WCwgYVkgKyB2WSk7XG4gIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gIGNvbnRleHQuZmlsbCgpO1xuXG59O1xuXG4iXX0=
