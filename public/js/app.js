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
module.exports = {
  nodes: require('./nodes'),
  regions: require('./regions')
};

},{"./nodes":9,"./regions":10}],9:[function(require,module,exports){
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

},{"../rest":36}],10:[function(require,module,exports){
var rest = require('../rest');

function RegionCollection() {
  this.index = {
    name: {},
    hobbesId: {}
  };

  this.aggregate = {};

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

},{"../rest":36}],11:[function(require,module,exports){
module.exports = {
  network: require('./network')
};

},{"./network":12}],12:[function(require,module,exports){
var EventEmitter = require('events');
var events = new EventEmitter();

var nodeCollection = require('../collections/nodes');
var regionsCollection = require('../collections/regions');
var rest = require('../rest');

function loadNetwork(callback) {
    api.loading = true;
    events.emit('loading');

    rest.loadNetwork(data => {
        nodeCollection.init(data.nodes);
        processNodesLinks(data.nodes);

        regionsCollection.init(data.regions);
        data.regions.forEach(processRegion);

        api.loading = false;
        events.emit('loading-complete');
        callback();
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
        } else if (this.isGWToDemand(link)) {
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
        if (this.loading) {
            this.on('loading-complete', callback);
            return;
        }
        callback();
    }
};

module.exports = api;

},{"../collections/nodes":9,"../collections/regions":10,"../rest":36,"events":2}],13:[function(require,module,exports){

require('./sigma-cwn-plugin');

module.exports = {
  collections: require('./collections'),
  controllers: require('./controllers'),
  map: require('./map'),
  renderer: require('./renderer')
};

},{"./collections":8,"./controllers":11,"./map":16,"./renderer":24,"./sigma-cwn-plugin":37}],14:[function(require,module,exports){
var behavior = {
  onLayerClick: function (features, e) {
    if (features.length == 0) return;

    var type = features[0].geometry.type;

    if (features.length == 1 && type == 'Polygon' || type == 'MultiPolygon') {
      if (this.shiftPessed) {
        window.location.href = '#info/' + features[0].properties.id;
        return;
      }

      if (!features[0].properties._render) features[0].properties._render = {};
      features[0].properties._render.hover = true;
      this.markerLayer.render();

      setTimeout(function () {
        ref.onRegionClick(features[0].properties.hobbes.id);

        features[0].properties._render.hover = false;
        this.markerLayer.render();
      }.bind(this), 0);
      return;
    }

    if (features.length == 1 && features[0].properties.prmname) {
      window.location.href = '#info/' + features[0].properties.prmname;
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
      f = features[i].properties;

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
      f = features[i].properties;

      if (!f._render) f._render = {};
      f._render.hover = true;
    }
  },

  onLayerMouseOut: function (features) {
    for (var i = 0; i < features.length; i++) {
      if (!features[i].properties._render) features[i].properties._render = {};
      features[i].properties._render.hover = false;
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

},{}],15:[function(require,module,exports){
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

},{"../collections/nodes":9}],16:[function(require,module,exports){
module.exports = {
  renderer: require('./renderer'),
  legend: require('./renderer/legend'),
  FilterBehavior: require('./filter'),
  RenderStateBehavior: require('./render-state'),
  CanvasLayerBehavior: require('./canvas-layer-events')
};

},{"./canvas-layer-events":14,"./filter":15,"./render-state":17,"./renderer":18,"./renderer/legend":19}],17:[function(require,module,exports){
var collections = require('../collections');

var behavior = {
  updateRenderState: function () {
    this.renderState = {
      points: [],
      lines: [],
      polygons: []
    };
    this.clearCustomLines();

    this._updateRenderState('California');

    var f = null,
        render;
    for (var i = 0; i < this.markerLayer.features.length; i++) {
      f = this.markerLayer.features[i];
      r = f.geojson.properties._render || {};

      if ((this.renderState.points.indexOf(f.geojson) > -1 || this.renderState.lines.indexOf(f.geojson) > -1 || this.renderState.polygons.indexOf(f.geojson) > -1) && r.show !== false) {

        f.visible = true;
      } else {
        f.visible = false;
      }
    }

    this.markerLayer.render();
  },

  _updateRenderState: function (name) {
    var region = collections.regions.getByName(name);
    var state = this.menu.state;

    if (state.enabled.indexOf(name) > -1) {
      this._addStateNodes(region.properties.hobbes.nodes, state);

      if (!region.properties.hobbes.subregions) return;

      for (var i = 0; i < region.properties.hobbes.subregions.length; i++) {
        this._updateRenderState(region.properties.hobbes.subregions[i]);
      }
    } else {

      if (name != 'California') this.renderState.polygons.push(region);
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

      if (node.properties.type == 'Diversion' || node.properties.type == 'Return Flow') {
        var terminal = this._getStateNodeLocation(node.properties.terminus, state);
        var origin = this._getStateNodeLocation(node.properties.origin, state);

        if (!terminal || !origin) continue;

        var lineFeature;
        if (terminal.isNode && origin.isNode) {
          lineFeature = this.createNodeLink(origin.center, terminal.center, node);
          this.customLines[node.properties.origin + '_' + node.properties.terminus] = lineFeature;
        } else {
          // if this line already exists, a null value will be returned
          lineFeature = this.createCustomLink(origin, terminal, node);
        }

        if (lineFeature) {
          this.renderState.lines.push(lineFeature.geojson);
          this.markerLayer.addFeature(lineFeature, index);
        }
      } else {
        this.renderState.points.push(node);
      }
    }
  },

  createNodeLink: function (origin, terminal, node) {
    return {
      geojson: {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          coordinates: [origin, terminal]
        },
        properties: $.extend(true, {}, node.properties)
      },
      render: CWN.map.renderer.basic
    };
  },

  createCustomLink: function (origin, terminal, node) {
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
            prmname: origin.name + '--' + terminal.name,
            type: 'Region Link',
            lines: [$.extend(true, {}, node.properties)]
          }
        },
        render: CWN.map.renderer.basic
      };

      this.customLines[origin.name + '_' + terminal.name] = feature;

      return feature;
    }

    feature.geojson.properties.lines.push($.extend(true, {}, node.properties));
  },

  clearCustomLines: function () {
    for (var key in this.customLines) {
      var index = this.markerLayer.features.indexOf(this.customLines[key]);
      if (index > -1) this.markerLayer.features.splice(index, 1);
    }
    this.customLines = {};
  },

  _getStateNodeLocation: function (name, state) {
    var node = CWN.ds.lookupMap[name];

    if (!node) return null;

    for (var i = 0; i < node.properties.hobbes.regions.length; i++) {
      if (state.disabled.indexOf(node.properties.hobbes.regions[i]) > -1) {
        if (CWN.ds.regionLookupMap[node.properties.hobbes.regions[i]].properties.center) {
          return {
            center: CWN.ds.regionLookupMap[node.properties.hobbes.regions[i]].properties.center,
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

},{"../collections":8}],18:[function(require,module,exports){
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
      color = renderUtilsCWN.colors.green;
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

},{"../../collections/nodes":9,"../../renderer":24}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
var colors = require('./colors');
var utils = require('./utils');

module.exports = function (ctx, config) {
    if (!config.stroke) config.stroke = colors.getColor('black', config.opacity);
    if (!config.fill) config.fill = colors.getColor('lightBlue', config.opacity);

    utils.oval(ctx, config);
};

},{"./colors":21,"./utils":33}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"./colors":21,"./utils":33}],23:[function(require,module,exports){
module.exports = function (type, width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  if (!CWN.render[type]) return canvas;

  var ctx = canvas.getContext('2d');
  CWN.render[type](ctx, 2, 2, width - 4, height - 4);

  return canvas;
};

},{}],24:[function(require,module,exports){
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

},{"./agricultural-demand":20,"./colors":21,"./groundwater-storage":22,"./icon":23,"./junction":25,"./line-markers":26,"./nonstandard-demand":27,"./power-plant":28,"./pump-plant":29,"./sink":30,"./surface-storage":31,"./urban-demand":32,"./water-treatment":34,"./wetland":35}],25:[function(require,module,exports){
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

},{"./colors":21}],26:[function(require,module,exports){
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

},{"./colors":21}],27:[function(require,module,exports){
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

},{"./colors":21,"./utils":33}],28:[function(require,module,exports){
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

},{"./colors":21,"./junction":25}],29:[function(require,module,exports){
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

},{"./colors":21,"./junction":25}],30:[function(require,module,exports){
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

},{"./colors":21,"./utils":33}],31:[function(require,module,exports){
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

},{"./colors":21,"./utils":33}],32:[function(require,module,exports){
var colors = require('./colors');
var utils = require('./utils');

module.exports = function (ctx, config) {
    if (!config.stroke) config.stroke = colors.getColor('black', config.opacity);
    if (!config.fill) config.fill = colors.getColor('orange', config.opacity);

    utils.oval(ctx, config);
};

},{"./colors":21,"./utils":33}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{"./colors":21,"./utils":33}],35:[function(require,module,exports){
var colors = require('./colors');
var utils = require('./utils');

module.exports = function (ctx, config) {
    if (!config.stroke) config.stroke = colors.getColor('black', config.opacity);
    if (!config.fill) config.fill = colors.getColor('green', config.opacity);

    utils.oval(ctx, config);
};

},{"./colors":21,"./utils":33}],36:[function(require,module,exports){
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

},{"superagent":4}],37:[function(require,module,exports){
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

},{"./renderer":24}]},{},[13])(13)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9yZWR1Y2UtY29tcG9uZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL2NsaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi9pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9saWIvcmVxdWVzdC1iYXNlLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL3JlcXVlc3QuanMiLCJwdWJsaWMvbGliL2NvbGxlY3Rpb25zL2luZGV4LmpzIiwicHVibGljL2xpYi9jb2xsZWN0aW9ucy9ub2Rlcy5qcyIsInB1YmxpYy9saWIvY29sbGVjdGlvbnMvcmVnaW9ucy5qcyIsInB1YmxpYy9saWIvY29udHJvbGxlcnMvaW5kZXguanMiLCJwdWJsaWMvbGliL2NvbnRyb2xsZXJzL25ldHdvcmsuanMiLCJwdWJsaWMvbGliL2luZGV4LmpzIiwicHVibGljL2xpYi9tYXAvY2FudmFzLWxheWVyLWV2ZW50cy5qcyIsInB1YmxpYy9saWIvbWFwL2ZpbHRlci5qcyIsInB1YmxpYy9saWIvbWFwL2luZGV4LmpzIiwicHVibGljL2xpYi9tYXAvcmVuZGVyLXN0YXRlLmpzIiwicHVibGljL2xpYi9tYXAvcmVuZGVyZXIvaW5kZXguanMiLCJwdWJsaWMvbGliL21hcC9yZW5kZXJlci9sZWdlbmQuanMiLCJwdWJsaWMvbGliL3JlbmRlcmVyL2FncmljdWx0dXJhbC1kZW1hbmQuanMiLCJwdWJsaWMvbGliL3JlbmRlcmVyL2NvbG9ycy5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvZ3JvdW5kd2F0ZXItc3RvcmFnZS5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvaWNvbi5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvaW5kZXguanMiLCJwdWJsaWMvbGliL3JlbmRlcmVyL2p1bmN0aW9uLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci9saW5lLW1hcmtlcnMuanMiLCJwdWJsaWMvbGliL3JlbmRlcmVyL25vbnN0YW5kYXJkLWRlbWFuZC5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvcG93ZXItcGxhbnQuanMiLCJwdWJsaWMvbGliL3JlbmRlcmVyL3B1bXAtcGxhbnQuanMiLCJwdWJsaWMvbGliL3JlbmRlcmVyL3NpbmsuanMiLCJwdWJsaWMvbGliL3JlbmRlcmVyL3N1cmZhY2Utc3RvcmFnZS5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvdXJiYW4tZGVtYW5kLmpzIiwicHVibGljL2xpYi9yZW5kZXJlci91dGlscy5qcyIsInB1YmxpYy9saWIvcmVuZGVyZXIvd2F0ZXItdHJlYXRtZW50LmpzIiwicHVibGljL2xpYi9yZW5kZXJlci93ZXRsYW5kLmpzIiwicHVibGljL2xpYi9yZXN0L2luZGV4LmpzIiwicHVibGljL2xpYi9zaWdtYS1jd24tcGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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VUFBUSxTQUFSLEdBQW9CLElBQXBCO0FBQ0EsVUFBUSxTQUFSO0FBQ0EsVUFBUSxNQUFSLENBQWUsRUFBZixFQUFtQixFQUFuQjtBQUNBLFVBQVEsTUFBUixDQUNFLEVBREYsRUFFRSxFQUZGO0FBSUEsVUFBUSxNQUFSOztBQUVBLFVBQVEsU0FBUixHQUFvQixLQUFwQjtBQUNBLFVBQVEsU0FBUjtBQUNBLFVBQVEsTUFBUixDQUFlLEtBQUssRUFBcEIsRUFBd0IsS0FBSyxFQUE3QjtBQUNBLFVBQVEsTUFBUixDQUFlLEtBQUssS0FBSyxHQUF6QixFQUE4QixLQUFLLEtBQUssR0FBeEM7QUFDQSxVQUFRLE1BQVIsQ0FBZSxLQUFLLEtBQUssR0FBekIsRUFBOEIsS0FBSyxLQUFLLEdBQXhDO0FBQ0EsVUFBUSxNQUFSLENBQWUsS0FBSyxFQUFwQixFQUF3QixLQUFLLEVBQTdCO0FBQ0EsVUFBUSxTQUFSO0FBQ0EsVUFBUSxJQUFSO0FBRUQsQ0FwREQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXHJcbi8qKlxyXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxyXG4gKi9cclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xyXG4gIG1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxyXG4gKlxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XHJcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XHJcbn07XHJcblxyXG4vKipcclxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxyXG4gKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAqIEBhcGkgcHJpdmF0ZVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1peGluKG9iaikge1xyXG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xyXG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xyXG4gIH1cclxuICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG4vKipcclxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub24gPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgKHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdKVxyXG4gICAgLnB1c2goZm4pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxyXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICBmdW5jdGlvbiBvbigpIHtcclxuICAgIHRoaXMub2ZmKGV2ZW50LCBvbik7XHJcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gIH1cclxuXHJcbiAgb24uZm4gPSBmbjtcclxuICB0aGlzLm9uKGV2ZW50LCBvbik7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcclxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG5cclxuICAvLyBhbGxcclxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gc3BlY2lmaWMgZXZlbnRcclxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XHJcblxyXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcclxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcclxuICB2YXIgY2I7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcclxuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtNaXhlZH0gLi4uXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcclxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuXHJcbiAgaWYgKGNhbGxiYWNrcykge1xyXG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHJldHVybiB7QXJyYXl9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcclxufTtcclxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiXG4vKipcbiAqIFJlZHVjZSBgYXJyYCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtNaXhlZH0gaW5pdGlhbFxuICpcbiAqIFRPRE86IGNvbWJhdGlibGUgZXJyb3IgaGFuZGxpbmc/XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcnIsIGZuLCBpbml0aWFsKXsgIFxuICB2YXIgaWR4ID0gMDtcbiAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XG4gIHZhciBjdXJyID0gYXJndW1lbnRzLmxlbmd0aCA9PSAzXG4gICAgPyBpbml0aWFsXG4gICAgOiBhcnJbaWR4KytdO1xuXG4gIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICBjdXJyID0gZm4uY2FsbChudWxsLCBjdXJyLCBhcnJbaWR4XSwgKytpZHgsIGFycik7XG4gIH1cbiAgXG4gIHJldHVybiBjdXJyO1xufTsiLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCdlbWl0dGVyJyk7XG52YXIgcmVkdWNlID0gcmVxdWlyZSgncmVkdWNlJyk7XG52YXIgcmVxdWVzdEJhc2UgPSByZXF1aXJlKCcuL3JlcXVlc3QtYmFzZScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pcy1vYmplY3QnKTtcblxuLyoqXG4gKiBSb290IHJlZmVyZW5jZSBmb3IgaWZyYW1lcy5cbiAqL1xuXG52YXIgcm9vdDtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgeyAvLyBCcm93c2VyIHdpbmRvd1xuICByb290ID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHsgLy8gV2ViIFdvcmtlclxuICByb290ID0gc2VsZjtcbn0gZWxzZSB7IC8vIE90aGVyIGVudmlyb25tZW50c1xuICByb290ID0gdGhpcztcbn1cblxuLyoqXG4gKiBOb29wLlxuICovXG5cbmZ1bmN0aW9uIG5vb3AoKXt9O1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGEgaG9zdCBvYmplY3QsXG4gKiB3ZSBkb24ndCB3YW50IHRvIHNlcmlhbGl6ZSB0aGVzZSA6KVxuICpcbiAqIFRPRE86IGZ1dHVyZSBwcm9vZiwgbW92ZSB0byBjb21wb2VudCBsYW5kXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzSG9zdChvYmopIHtcbiAgdmFyIHN0ciA9IHt9LnRvU3RyaW5nLmNhbGwob2JqKTtcblxuICBzd2l0Y2ggKHN0cikge1xuICAgIGNhc2UgJ1tvYmplY3QgRmlsZV0nOlxuICAgIGNhc2UgJ1tvYmplY3QgQmxvYl0nOlxuICAgIGNhc2UgJ1tvYmplY3QgRm9ybURhdGFdJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBFeHBvc2UgYHJlcXVlc3RgLlxuICovXG5cbnZhciByZXF1ZXN0ID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3JlcXVlc3QnKS5iaW5kKG51bGwsIFJlcXVlc3QpO1xuXG4vKipcbiAqIERldGVybWluZSBYSFIuXG4gKi9cblxucmVxdWVzdC5nZXRYSFIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChyb290LlhNTEh0dHBSZXF1ZXN0XG4gICAgICAmJiAoIXJvb3QubG9jYXRpb24gfHwgJ2ZpbGU6JyAhPSByb290LmxvY2F0aW9uLnByb3RvY29sXG4gICAgICAgICAgfHwgIXJvb3QuQWN0aXZlWE9iamVjdCkpIHtcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuICB9IGVsc2Uge1xuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAuNi4wJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjMuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUCcpOyB9IGNhdGNoKGUpIHt9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGFkZGVkIHRvIHN1cHBvcnQgSUUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciB0cmltID0gJycudHJpbVxuICA/IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMudHJpbSgpOyB9XG4gIDogZnVuY3Rpb24ocykgeyByZXR1cm4gcy5yZXBsYWNlKC8oXlxccyp8XFxzKiQpL2csICcnKTsgfTtcblxuLyoqXG4gKiBTZXJpYWxpemUgdGhlIGdpdmVuIGBvYmpgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShvYmopIHtcbiAgaWYgKCFpc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICB2YXIgcGFpcnMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChudWxsICE9IG9ialtrZXldKSB7XG4gICAgICBwdXNoRW5jb2RlZEtleVZhbHVlUGFpcihwYWlycywga2V5LCBvYmpba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgcmV0dXJuIHBhaXJzLmpvaW4oJyYnKTtcbn1cblxuLyoqXG4gKiBIZWxwcyAnc2VyaWFsaXplJyB3aXRoIHNlcmlhbGl6aW5nIGFycmF5cy5cbiAqIE11dGF0ZXMgdGhlIHBhaXJzIGFycmF5LlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHBhaXJzXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqL1xuXG5mdW5jdGlvbiBwdXNoRW5jb2RlZEtleVZhbHVlUGFpcihwYWlycywga2V5LCB2YWwpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgIHJldHVybiB2YWwuZm9yRWFjaChmdW5jdGlvbih2KSB7XG4gICAgICBwdXNoRW5jb2RlZEtleVZhbHVlUGFpcihwYWlycywga2V5LCB2KTtcbiAgICB9KTtcbiAgfVxuICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpXG4gICAgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsKSk7XG59XG5cbi8qKlxuICogRXhwb3NlIHNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5cbiByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdCA9IHNlcmlhbGl6ZTtcblxuIC8qKlxuICAqIFBhcnNlIHRoZSBnaXZlbiB4LXd3dy1mb3JtLXVybGVuY29kZWQgYHN0cmAuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICogQHJldHVybiB7T2JqZWN0fVxuICAqIEBhcGkgcHJpdmF0ZVxuICAqL1xuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICB2YXIgcGFpcnMgPSBzdHIuc3BsaXQoJyYnKTtcbiAgdmFyIHBhcnRzO1xuICB2YXIgcGFpcjtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGFpcnMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBwYWlyID0gcGFpcnNbaV07XG4gICAgcGFydHMgPSBwYWlyLnNwbGl0KCc9Jyk7XG4gICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSldID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogRXhwb3NlIHBhcnNlci5cbiAqL1xuXG5yZXF1ZXN0LnBhcnNlU3RyaW5nID0gcGFyc2VTdHJpbmc7XG5cbi8qKlxuICogRGVmYXVsdCBNSU1FIHR5cGUgbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqL1xuXG5yZXF1ZXN0LnR5cGVzID0ge1xuICBodG1sOiAndGV4dC9odG1sJyxcbiAganNvbjogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICB4bWw6ICdhcHBsaWNhdGlvbi94bWwnLFxuICB1cmxlbmNvZGVkOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0nOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0tZGF0YSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc2VyaWFsaXphdGlvbiBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQuc2VyaWFsaXplWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKG9iail7XG4gKiAgICAgICByZXR1cm4gJ2dlbmVyYXRlZCB4bWwgaGVyZSc7XG4gKiAgICAgfTtcbiAqXG4gKi9cblxuIHJlcXVlc3Quc2VyaWFsaXplID0ge1xuICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHNlcmlhbGl6ZSxcbiAgICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5zdHJpbmdpZnlcbiB9O1xuXG4gLyoqXG4gICogRGVmYXVsdCBwYXJzZXJzLlxuICAqXG4gICogICAgIHN1cGVyYWdlbnQucGFyc2VbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24oc3RyKXtcbiAgKiAgICAgICByZXR1cm4geyBvYmplY3QgcGFyc2VkIGZyb20gc3RyIH07XG4gICogICAgIH07XG4gICpcbiAgKi9cblxucmVxdWVzdC5wYXJzZSA9IHtcbiAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHBhcnNlU3RyaW5nLFxuICAnYXBwbGljYXRpb24vanNvbic6IEpTT04ucGFyc2Vcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGhlYWRlciBgc3RyYCBpbnRvXG4gKiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWFwcGVkIGZpZWxkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcihzdHIpIHtcbiAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KC9cXHI/XFxuLyk7XG4gIHZhciBmaWVsZHMgPSB7fTtcbiAgdmFyIGluZGV4O1xuICB2YXIgbGluZTtcbiAgdmFyIGZpZWxkO1xuICB2YXIgdmFsO1xuXG4gIGxpbmVzLnBvcCgpOyAvLyB0cmFpbGluZyBDUkxGXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbGluZSA9IGxpbmVzW2ldO1xuICAgIGluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgZmllbGQgPSBsaW5lLnNsaWNlKDAsIGluZGV4KS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHRyaW0obGluZS5zbGljZShpbmRleCArIDEpKTtcbiAgICBmaWVsZHNbZmllbGRdID0gdmFsO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkcztcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBgbWltZWAgaXMganNvbiBvciBoYXMgK2pzb24gc3RydWN0dXJlZCBzeW50YXggc3VmZml4LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtaW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNKU09OKG1pbWUpIHtcbiAgcmV0dXJuIC9bXFwvK11qc29uXFxiLy50ZXN0KG1pbWUpO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbWltZSB0eXBlIGZvciB0aGUgZ2l2ZW4gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gdHlwZShzdHIpe1xuICByZXR1cm4gc3RyLnNwbGl0KC8gKjsgKi8pLnNoaWZ0KCk7XG59O1xuXG4vKipcbiAqIFJldHVybiBoZWFkZXIgZmllbGQgcGFyYW1ldGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJhbXMoc3RyKXtcbiAgcmV0dXJuIHJlZHVjZShzdHIuc3BsaXQoLyAqOyAqLyksIGZ1bmN0aW9uKG9iaiwgc3RyKXtcbiAgICB2YXIgcGFydHMgPSBzdHIuc3BsaXQoLyAqPSAqLylcbiAgICAgICwga2V5ID0gcGFydHMuc2hpZnQoKVxuICAgICAgLCB2YWwgPSBwYXJ0cy5zaGlmdCgpO1xuXG4gICAgaWYgKGtleSAmJiB2YWwpIG9ialtrZXldID0gdmFsO1xuICAgIHJldHVybiBvYmo7XG4gIH0sIHt9KTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUmVzcG9uc2VgIHdpdGggdGhlIGdpdmVuIGB4aHJgLlxuICpcbiAqICAtIHNldCBmbGFncyAoLm9rLCAuZXJyb3IsIGV0YylcbiAqICAtIHBhcnNlIGhlYWRlclxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICBBbGlhc2luZyBgc3VwZXJhZ2VudGAgYXMgYHJlcXVlc3RgIGlzIG5pY2U6XG4gKlxuICogICAgICByZXF1ZXN0ID0gc3VwZXJhZ2VudDtcbiAqXG4gKiAgV2UgY2FuIHVzZSB0aGUgcHJvbWlzZS1saWtlIEFQSSwgb3IgcGFzcyBjYWxsYmFja3M6XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnLycpLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICogICAgICByZXF1ZXN0LmdldCgnLycsIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIFNlbmRpbmcgZGF0YSBjYW4gYmUgY2hhaW5lZDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgIC5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAuc2VuZCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9LCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBPciBwYXNzZWQgdG8gYC5wb3N0KClgOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicsIHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgIC5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBPciBmdXJ0aGVyIHJlZHVjZWQgdG8gYSBzaW5nbGUgY2FsbCBmb3Igc2ltcGxlIGNhc2VzOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicsIHsgbmFtZTogJ3RqJyB9LCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqIEBwYXJhbSB7WE1MSFRUUFJlcXVlc3R9IHhoclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIFJlc3BvbnNlKHJlcSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdGhpcy5yZXEgPSByZXE7XG4gIHRoaXMueGhyID0gdGhpcy5yZXEueGhyO1xuICAvLyByZXNwb25zZVRleHQgaXMgYWNjZXNzaWJsZSBvbmx5IGlmIHJlc3BvbnNlVHlwZSBpcyAnJyBvciAndGV4dCcgYW5kIG9uIG9sZGVyIGJyb3dzZXJzXG4gIHRoaXMudGV4dCA9ICgodGhpcy5yZXEubWV0aG9kICE9J0hFQUQnICYmICh0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICcnIHx8IHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnKSkgfHwgdHlwZW9mIHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgID8gdGhpcy54aHIucmVzcG9uc2VUZXh0XG4gICAgIDogbnVsbDtcbiAgdGhpcy5zdGF0dXNUZXh0ID0gdGhpcy5yZXEueGhyLnN0YXR1c1RleHQ7XG4gIHRoaXMuc2V0U3RhdHVzUHJvcGVydGllcyh0aGlzLnhoci5zdGF0dXMpO1xuICB0aGlzLmhlYWRlciA9IHRoaXMuaGVhZGVycyA9IHBhcnNlSGVhZGVyKHRoaXMueGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcbiAgLy8gZ2V0QWxsUmVzcG9uc2VIZWFkZXJzIHNvbWV0aW1lcyBmYWxzZWx5IHJldHVybnMgXCJcIiBmb3IgQ09SUyByZXF1ZXN0cywgYnV0XG4gIC8vIGdldFJlc3BvbnNlSGVhZGVyIHN0aWxsIHdvcmtzLiBzbyB3ZSBnZXQgY29udGVudC10eXBlIGV2ZW4gaWYgZ2V0dGluZ1xuICAvLyBvdGhlciBoZWFkZXJzIGZhaWxzLlxuICB0aGlzLmhlYWRlclsnY29udGVudC10eXBlJ10gPSB0aGlzLnhoci5nZXRSZXNwb25zZUhlYWRlcignY29udGVudC10eXBlJyk7XG4gIHRoaXMuc2V0SGVhZGVyUHJvcGVydGllcyh0aGlzLmhlYWRlcik7XG4gIHRoaXMuYm9keSA9IHRoaXMucmVxLm1ldGhvZCAhPSAnSEVBRCdcbiAgICA/IHRoaXMucGFyc2VCb2R5KHRoaXMudGV4dCA/IHRoaXMudGV4dCA6IHRoaXMueGhyLnJlc3BvbnNlKVxuICAgIDogbnVsbDtcbn1cblxuLyoqXG4gKiBHZXQgY2FzZS1pbnNlbnNpdGl2ZSBgZmllbGRgIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oZmllbGQpe1xuICByZXR1cm4gdGhpcy5oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG59O1xuXG4vKipcbiAqIFNldCBoZWFkZXIgcmVsYXRlZCBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBgLnR5cGVgIHRoZSBjb250ZW50IHR5cGUgd2l0aG91dCBwYXJhbXNcbiAqXG4gKiBBIHJlc3BvbnNlIG9mIFwiQ29udGVudC1UeXBlOiB0ZXh0L3BsYWluOyBjaGFyc2V0PXV0Zi04XCJcbiAqIHdpbGwgcHJvdmlkZSB5b3Ugd2l0aCBhIGAudHlwZWAgb2YgXCJ0ZXh0L3BsYWluXCIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGhlYWRlclxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnNldEhlYWRlclByb3BlcnRpZXMgPSBmdW5jdGlvbihoZWFkZXIpe1xuICAvLyBjb250ZW50LXR5cGVcbiAgdmFyIGN0ID0gdGhpcy5oZWFkZXJbJ2NvbnRlbnQtdHlwZSddIHx8ICcnO1xuICB0aGlzLnR5cGUgPSB0eXBlKGN0KTtcblxuICAvLyBwYXJhbXNcbiAgdmFyIG9iaiA9IHBhcmFtcyhjdCk7XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHRoaXNba2V5XSA9IG9ialtrZXldO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYm9keSBgc3RyYC5cbiAqXG4gKiBVc2VkIGZvciBhdXRvLXBhcnNpbmcgb2YgYm9kaWVzLiBQYXJzZXJzXG4gKiBhcmUgZGVmaW5lZCBvbiB0aGUgYHN1cGVyYWdlbnQucGFyc2VgIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtNaXhlZH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5wYXJzZUJvZHkgPSBmdW5jdGlvbihzdHIpe1xuICB2YXIgcGFyc2UgPSByZXF1ZXN0LnBhcnNlW3RoaXMudHlwZV07XG4gIGlmICghcGFyc2UgJiYgaXNKU09OKHRoaXMudHlwZSkpIHtcbiAgICBwYXJzZSA9IHJlcXVlc3QucGFyc2VbJ2FwcGxpY2F0aW9uL2pzb24nXTtcbiAgfVxuICByZXR1cm4gcGFyc2UgJiYgc3RyICYmIChzdHIubGVuZ3RoIHx8IHN0ciBpbnN0YW5jZW9mIE9iamVjdClcbiAgICA/IHBhcnNlKHN0cilcbiAgICA6IG51bGw7XG59O1xuXG4vKipcbiAqIFNldCBmbGFncyBzdWNoIGFzIGAub2tgIGJhc2VkIG9uIGBzdGF0dXNgLlxuICpcbiAqIEZvciBleGFtcGxlIGEgMnh4IHJlc3BvbnNlIHdpbGwgZ2l2ZSB5b3UgYSBgLm9rYCBvZiBfX3RydWVfX1xuICogd2hlcmVhcyA1eHggd2lsbCBiZSBfX2ZhbHNlX18gYW5kIGAuZXJyb3JgIHdpbGwgYmUgX190cnVlX18uIFRoZVxuICogYC5jbGllbnRFcnJvcmAgYW5kIGAuc2VydmVyRXJyb3JgIGFyZSBhbHNvIGF2YWlsYWJsZSB0byBiZSBtb3JlXG4gKiBzcGVjaWZpYywgYW5kIGAuc3RhdHVzVHlwZWAgaXMgdGhlIGNsYXNzIG9mIGVycm9yIHJhbmdpbmcgZnJvbSAxLi41XG4gKiBzb21ldGltZXMgdXNlZnVsIGZvciBtYXBwaW5nIHJlc3BvbmQgY29sb3JzIGV0Yy5cbiAqXG4gKiBcInN1Z2FyXCIgcHJvcGVydGllcyBhcmUgYWxzbyBkZWZpbmVkIGZvciBjb21tb24gY2FzZXMuIEN1cnJlbnRseSBwcm92aWRpbmc6XG4gKlxuICogICAtIC5ub0NvbnRlbnRcbiAqICAgLSAuYmFkUmVxdWVzdFxuICogICAtIC51bmF1dGhvcml6ZWRcbiAqICAgLSAubm90QWNjZXB0YWJsZVxuICogICAtIC5ub3RGb3VuZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRTdGF0dXNQcm9wZXJ0aWVzID0gZnVuY3Rpb24oc3RhdHVzKXtcbiAgLy8gaGFuZGxlIElFOSBidWc6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAwNDY5NzIvbXNpZS1yZXR1cm5zLXN0YXR1cy1jb2RlLW9mLTEyMjMtZm9yLWFqYXgtcmVxdWVzdFxuICBpZiAoc3RhdHVzID09PSAxMjIzKSB7XG4gICAgc3RhdHVzID0gMjA0O1xuICB9XG5cbiAgdmFyIHR5cGUgPSBzdGF0dXMgLyAxMDAgfCAwO1xuXG4gIC8vIHN0YXR1cyAvIGNsYXNzXG4gIHRoaXMuc3RhdHVzID0gdGhpcy5zdGF0dXNDb2RlID0gc3RhdHVzO1xuICB0aGlzLnN0YXR1c1R5cGUgPSB0eXBlO1xuXG4gIC8vIGJhc2ljc1xuICB0aGlzLmluZm8gPSAxID09IHR5cGU7XG4gIHRoaXMub2sgPSAyID09IHR5cGU7XG4gIHRoaXMuY2xpZW50RXJyb3IgPSA0ID09IHR5cGU7XG4gIHRoaXMuc2VydmVyRXJyb3IgPSA1ID09IHR5cGU7XG4gIHRoaXMuZXJyb3IgPSAoNCA9PSB0eXBlIHx8IDUgPT0gdHlwZSlcbiAgICA/IHRoaXMudG9FcnJvcigpXG4gICAgOiBmYWxzZTtcblxuICAvLyBzdWdhclxuICB0aGlzLmFjY2VwdGVkID0gMjAyID09IHN0YXR1cztcbiAgdGhpcy5ub0NvbnRlbnQgPSAyMDQgPT0gc3RhdHVzO1xuICB0aGlzLmJhZFJlcXVlc3QgPSA0MDAgPT0gc3RhdHVzO1xuICB0aGlzLnVuYXV0aG9yaXplZCA9IDQwMSA9PSBzdGF0dXM7XG4gIHRoaXMubm90QWNjZXB0YWJsZSA9IDQwNiA9PSBzdGF0dXM7XG4gIHRoaXMubm90Rm91bmQgPSA0MDQgPT0gc3RhdHVzO1xuICB0aGlzLmZvcmJpZGRlbiA9IDQwMyA9PSBzdGF0dXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBgRXJyb3JgIHJlcHJlc2VudGF0aXZlIG9mIHRoaXMgcmVzcG9uc2UuXG4gKlxuICogQHJldHVybiB7RXJyb3J9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS50b0Vycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHJlcSA9IHRoaXMucmVxO1xuICB2YXIgbWV0aG9kID0gcmVxLm1ldGhvZDtcbiAgdmFyIHVybCA9IHJlcS51cmw7XG5cbiAgdmFyIG1zZyA9ICdjYW5ub3QgJyArIG1ldGhvZCArICcgJyArIHVybCArICcgKCcgKyB0aGlzLnN0YXR1cyArICcpJztcbiAgdmFyIGVyciA9IG5ldyBFcnJvcihtc2cpO1xuICBlcnIuc3RhdHVzID0gdGhpcy5zdGF0dXM7XG4gIGVyci5tZXRob2QgPSBtZXRob2Q7XG4gIGVyci51cmwgPSB1cmw7XG5cbiAgcmV0dXJuIGVycjtcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZWAuXG4gKi9cblxucmVxdWVzdC5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlcXVlc3RgIHdpdGggdGhlIGdpdmVuIGBtZXRob2RgIGFuZCBgdXJsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9xdWVyeSA9IHRoaXMuX3F1ZXJ5IHx8IFtdO1xuICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgdGhpcy51cmwgPSB1cmw7XG4gIHRoaXMuaGVhZGVyID0ge307IC8vIHByZXNlcnZlcyBoZWFkZXIgbmFtZSBjYXNlXG4gIHRoaXMuX2hlYWRlciA9IHt9OyAvLyBjb2VyY2VzIGhlYWRlciBuYW1lcyB0byBsb3dlcmNhc2VcbiAgdGhpcy5vbignZW5kJywgZnVuY3Rpb24oKXtcbiAgICB2YXIgZXJyID0gbnVsbDtcbiAgICB2YXIgcmVzID0gbnVsbDtcblxuICAgIHRyeSB7XG4gICAgICByZXMgPSBuZXcgUmVzcG9uc2Uoc2VsZik7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoJ1BhcnNlciBpcyB1bmFibGUgdG8gcGFyc2UgdGhlIHJlc3BvbnNlJyk7XG4gICAgICBlcnIucGFyc2UgPSB0cnVlO1xuICAgICAgZXJyLm9yaWdpbmFsID0gZTtcbiAgICAgIC8vIGlzc3VlICM2NzU6IHJldHVybiB0aGUgcmF3IHJlc3BvbnNlIGlmIHRoZSByZXNwb25zZSBwYXJzaW5nIGZhaWxzXG4gICAgICBlcnIucmF3UmVzcG9uc2UgPSBzZWxmLnhociAmJiBzZWxmLnhoci5yZXNwb25zZVRleHQgPyBzZWxmLnhoci5yZXNwb25zZVRleHQgOiBudWxsO1xuICAgICAgLy8gaXNzdWUgIzg3NjogcmV0dXJuIHRoZSBodHRwIHN0YXR1cyBjb2RlIGlmIHRoZSByZXNwb25zZSBwYXJzaW5nIGZhaWxzXG4gICAgICBlcnIuc3RhdHVzQ29kZSA9IHNlbGYueGhyICYmIHNlbGYueGhyLnN0YXR1cyA/IHNlbGYueGhyLnN0YXR1cyA6IG51bGw7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIpO1xuICAgIH1cblxuICAgIHNlbGYuZW1pdCgncmVzcG9uc2UnLCByZXMpO1xuXG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyLCByZXMpO1xuICAgIH1cblxuICAgIGlmIChyZXMuc3RhdHVzID49IDIwMCAmJiByZXMuc3RhdHVzIDwgMzAwKSB7XG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgfVxuXG4gICAgdmFyIG5ld19lcnIgPSBuZXcgRXJyb3IocmVzLnN0YXR1c1RleHQgfHwgJ1Vuc3VjY2Vzc2Z1bCBIVFRQIHJlc3BvbnNlJyk7XG4gICAgbmV3X2Vyci5vcmlnaW5hbCA9IGVycjtcbiAgICBuZXdfZXJyLnJlc3BvbnNlID0gcmVzO1xuICAgIG5ld19lcnIuc3RhdHVzID0gcmVzLnN0YXR1cztcblxuICAgIHNlbGYuY2FsbGJhY2sobmV3X2VyciwgcmVzKTtcbiAgfSk7XG59XG5cbi8qKlxuICogTWl4aW4gYEVtaXR0ZXJgIGFuZCBgcmVxdWVzdEJhc2VgLlxuICovXG5cbkVtaXR0ZXIoUmVxdWVzdC5wcm90b3R5cGUpO1xuZm9yICh2YXIga2V5IGluIHJlcXVlc3RCYXNlKSB7XG4gIFJlcXVlc3QucHJvdG90eXBlW2tleV0gPSByZXF1ZXN0QmFzZVtrZXldO1xufVxuXG4vKipcbiAqIEFib3J0IHRoZSByZXF1ZXN0LCBhbmQgY2xlYXIgcG90ZW50aWFsIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbigpe1xuICBpZiAodGhpcy5hYm9ydGVkKSByZXR1cm47XG4gIHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gIHRoaXMueGhyICYmIHRoaXMueGhyLmFib3J0KCk7XG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIHRoaXMuZW1pdCgnYWJvcnQnKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBDb250ZW50LVR5cGUgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMueG1sID0gJ2FwcGxpY2F0aW9uL3htbCc7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCd4bWwnKVxuICogICAgICAgIC5zZW5kKHhtbHN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ2FwcGxpY2F0aW9uL3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudHlwZSA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQ29udGVudC1UeXBlJywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCByZXNwb25zZVR5cGUgdG8gYHZhbGAuIFByZXNlbnRseSB2YWxpZCByZXNwb25zZVR5cGVzIGFyZSAnYmxvYicgYW5kIFxuICogJ2FycmF5YnVmZmVyJy5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5yZXNwb25zZVR5cGUoJ2Jsb2InKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5yZXNwb25zZVR5cGUgPSBmdW5jdGlvbih2YWwpe1xuICB0aGlzLl9yZXNwb25zZVR5cGUgPSB2YWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgQWNjZXB0IHRvIGB0eXBlYCwgbWFwcGluZyB2YWx1ZXMgZnJvbSBgcmVxdWVzdC50eXBlc2AuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBzdXBlcmFnZW50LnR5cGVzLmpzb24gPSAnYXBwbGljYXRpb24vanNvbic7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdqc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhY2NlcHRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hY2NlcHQgPSBmdW5jdGlvbih0eXBlKXtcbiAgdGhpcy5zZXQoJ0FjY2VwdCcsIHJlcXVlc3QudHlwZXNbdHlwZV0gfHwgdHlwZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgQXV0aG9yaXphdGlvbiBmaWVsZCB2YWx1ZSB3aXRoIGB1c2VyYCBhbmQgYHBhc3NgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VyXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFzc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgd2l0aCAndHlwZScgcHJvcGVydHkgJ2F1dG8nIG9yICdiYXNpYycgKGRlZmF1bHQgJ2Jhc2ljJylcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdXRoID0gZnVuY3Rpb24odXNlciwgcGFzcywgb3B0aW9ucyl7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICB0eXBlOiAnYmFzaWMnXG4gICAgfVxuICB9XG5cbiAgc3dpdGNoIChvcHRpb25zLnR5cGUpIHtcbiAgICBjYXNlICdiYXNpYyc6XG4gICAgICB2YXIgc3RyID0gYnRvYSh1c2VyICsgJzonICsgcGFzcyk7XG4gICAgICB0aGlzLnNldCgnQXV0aG9yaXphdGlvbicsICdCYXNpYyAnICsgc3RyKTtcbiAgICBicmVhaztcblxuICAgIGNhc2UgJ2F1dG8nOlxuICAgICAgdGhpcy51c2VybmFtZSA9IHVzZXI7XG4gICAgICB0aGlzLnBhc3N3b3JkID0gcGFzcztcbiAgICBicmVhaztcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuKiBBZGQgcXVlcnktc3RyaW5nIGB2YWxgLlxuKlxuKiBFeGFtcGxlczpcbipcbiogICByZXF1ZXN0LmdldCgnL3Nob2VzJylcbiogICAgIC5xdWVyeSgnc2l6ZT0xMCcpXG4qICAgICAucXVlcnkoeyBjb2xvcjogJ2JsdWUnIH0pXG4qXG4qIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gdmFsXG4qIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuKiBAYXBpIHB1YmxpY1xuKi9cblxuUmVxdWVzdC5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbih2YWwpe1xuICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIHZhbCkgdmFsID0gc2VyaWFsaXplKHZhbCk7XG4gIGlmICh2YWwpIHRoaXMuX3F1ZXJ5LnB1c2godmFsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFF1ZXVlIHRoZSBnaXZlbiBgZmlsZWAgYXMgYW4gYXR0YWNobWVudCB0byB0aGUgc3BlY2lmaWVkIGBmaWVsZGAsXG4gKiB3aXRoIG9wdGlvbmFsIGBmaWxlbmFtZWAuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuYXR0YWNoKG5ldyBCbG9iKFsnPGEgaWQ9XCJhXCI+PGIgaWQ9XCJiXCI+aGV5ITwvYj48L2E+J10sIHsgdHlwZTogXCJ0ZXh0L2h0bWxcIn0pKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHBhcmFtIHtCbG9ifEZpbGV9IGZpbGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uKGZpZWxkLCBmaWxlLCBmaWxlbmFtZSl7XG4gIHRoaXMuX2dldEZvcm1EYXRhKCkuYXBwZW5kKGZpZWxkLCBmaWxlLCBmaWxlbmFtZSB8fCBmaWxlLm5hbWUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLl9nZXRGb3JtRGF0YSA9IGZ1bmN0aW9uKCl7XG4gIGlmICghdGhpcy5fZm9ybURhdGEpIHtcbiAgICB0aGlzLl9mb3JtRGF0YSA9IG5ldyByb290LkZvcm1EYXRhKCk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2Zvcm1EYXRhO1xufTtcblxuLyoqXG4gKiBTZW5kIGBkYXRhYCBhcyB0aGUgcmVxdWVzdCBib2R5LCBkZWZhdWx0aW5nIHRoZSBgLnR5cGUoKWAgdG8gXCJqc29uXCIgd2hlblxuICogYW4gb2JqZWN0IGlzIGdpdmVuLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgIC8vIG1hbnVhbCBqc29uXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2pzb24nKVxuICogICAgICAgICAuc2VuZCgne1wibmFtZVwiOlwidGpcIn0nKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8ganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG1hbnVhbCB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKCduYW1lPXRqJylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gZGVmYXVsdHMgdG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICogICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAgKiAgICAgICAgLnNlbmQoJ25hbWU9dG9iaScpXG4gICogICAgICAgIC5zZW5kKCdzcGVjaWVzPWZlcnJldCcpXG4gICogICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKGRhdGEpe1xuICB2YXIgb2JqID0gaXNPYmplY3QoZGF0YSk7XG4gIHZhciB0eXBlID0gdGhpcy5faGVhZGVyWydjb250ZW50LXR5cGUnXTtcblxuICAvLyBtZXJnZVxuICBpZiAob2JqICYmIGlzT2JqZWN0KHRoaXMuX2RhdGEpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgIHRoaXMuX2RhdGFba2V5XSA9IGRhdGFba2V5XTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIGRhdGEpIHtcbiAgICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnZm9ybScpO1xuICAgIHR5cGUgPSB0aGlzLl9oZWFkZXJbJ2NvbnRlbnQtdHlwZSddO1xuICAgIGlmICgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyA9PSB0eXBlKSB7XG4gICAgICB0aGlzLl9kYXRhID0gdGhpcy5fZGF0YVxuICAgICAgICA/IHRoaXMuX2RhdGEgKyAnJicgKyBkYXRhXG4gICAgICAgIDogZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGF0YSA9ICh0aGlzLl9kYXRhIHx8ICcnKSArIGRhdGE7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICB9XG5cbiAgaWYgKCFvYmogfHwgaXNIb3N0KGRhdGEpKSByZXR1cm4gdGhpcztcbiAgaWYgKCF0eXBlKSB0aGlzLnR5cGUoJ2pzb24nKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEBkZXByZWNhdGVkXG4gKi9cblJlc3BvbnNlLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIHNlcmlhbGl6ZShmbil7XG4gIGlmIChyb290LmNvbnNvbGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCJDbGllbnQtc2lkZSBwYXJzZSgpIG1ldGhvZCBoYXMgYmVlbiByZW5hbWVkIHRvIHNlcmlhbGl6ZSgpLiBUaGlzIG1ldGhvZCBpcyBub3QgY29tcGF0aWJsZSB3aXRoIHN1cGVyYWdlbnQgdjIuMFwiKTtcbiAgfVxuICB0aGlzLnNlcmlhbGl6ZShmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUmVzcG9uc2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uIHNlcmlhbGl6ZShmbil7XG4gIHRoaXMuX3BhcnNlciA9IGZuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogSW52b2tlIHRoZSBjYWxsYmFjayB3aXRoIGBlcnJgIGFuZCBgcmVzYFxuICogYW5kIGhhbmRsZSBhcml0eSBjaGVjay5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2FsbGJhY2sgPSBmdW5jdGlvbihlcnIsIHJlcyl7XG4gIHZhciBmbiA9IHRoaXMuX2NhbGxiYWNrO1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICBmbihlcnIsIHJlcyk7XG59O1xuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHgtZG9tYWluIGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNyb3NzRG9tYWluRXJyb3IgPSBmdW5jdGlvbigpe1xuICB2YXIgZXJyID0gbmV3IEVycm9yKCdSZXF1ZXN0IGhhcyBiZWVuIHRlcm1pbmF0ZWRcXG5Qb3NzaWJsZSBjYXVzZXM6IHRoZSBuZXR3b3JrIGlzIG9mZmxpbmUsIE9yaWdpbiBpcyBub3QgYWxsb3dlZCBieSBBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4sIHRoZSBwYWdlIGlzIGJlaW5nIHVubG9hZGVkLCBldGMuJyk7XG4gIGVyci5jcm9zc0RvbWFpbiA9IHRydWU7XG5cbiAgZXJyLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICBlcnIubWV0aG9kID0gdGhpcy5tZXRob2Q7XG4gIGVyci51cmwgPSB0aGlzLnVybDtcblxuICB0aGlzLmNhbGxiYWNrKGVycik7XG59O1xuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHRpbWVvdXQgZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudGltZW91dEVycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHRpbWVvdXQgPSB0aGlzLl90aW1lb3V0O1xuICB2YXIgZXJyID0gbmV3IEVycm9yKCd0aW1lb3V0IG9mICcgKyB0aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyk7XG4gIGVyci50aW1lb3V0ID0gdGltZW91dDtcbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuLyoqXG4gKiBFbmFibGUgdHJhbnNtaXNzaW9uIG9mIGNvb2tpZXMgd2l0aCB4LWRvbWFpbiByZXF1ZXN0cy5cbiAqXG4gKiBOb3RlIHRoYXQgZm9yIHRoaXMgdG8gd29yayB0aGUgb3JpZ2luIG11c3Qgbm90IGJlXG4gKiB1c2luZyBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiIHdpdGggYSB3aWxkY2FyZCxcbiAqIGFuZCBhbHNvIG11c3Qgc2V0IFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHNcIlxuICogdG8gXCJ0cnVlXCIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS53aXRoQ3JlZGVudGlhbHMgPSBmdW5jdGlvbigpe1xuICB0aGlzLl93aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogSW5pdGlhdGUgcmVxdWVzdCwgaW52b2tpbmcgY2FsbGJhY2sgYGZuKHJlcylgXG4gKiB3aXRoIGFuIGluc3RhbmNlb2YgYFJlc3BvbnNlYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgeGhyID0gdGhpcy54aHIgPSByZXF1ZXN0LmdldFhIUigpO1xuICB2YXIgcXVlcnkgPSB0aGlzLl9xdWVyeS5qb2luKCcmJyk7XG4gIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dDtcbiAgdmFyIGRhdGEgPSB0aGlzLl9mb3JtRGF0YSB8fCB0aGlzLl9kYXRhO1xuXG4gIC8vIHN0b3JlIGNhbGxiYWNrXG4gIHRoaXMuX2NhbGxiYWNrID0gZm4gfHwgbm9vcDtcblxuICAvLyBzdGF0ZSBjaGFuZ2VcbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCl7XG4gICAgaWYgKDQgIT0geGhyLnJlYWR5U3RhdGUpIHJldHVybjtcblxuICAgIC8vIEluIElFOSwgcmVhZHMgdG8gYW55IHByb3BlcnR5IChlLmcuIHN0YXR1cykgb2ZmIG9mIGFuIGFib3J0ZWQgWEhSIHdpbGxcbiAgICAvLyByZXN1bHQgaW4gdGhlIGVycm9yIFwiQ291bGQgbm90IGNvbXBsZXRlIHRoZSBvcGVyYXRpb24gZHVlIHRvIGVycm9yIGMwMGMwMjNmXCJcbiAgICB2YXIgc3RhdHVzO1xuICAgIHRyeSB7IHN0YXR1cyA9IHhoci5zdGF0dXMgfSBjYXRjaChlKSB7IHN0YXR1cyA9IDA7IH1cblxuICAgIGlmICgwID09IHN0YXR1cykge1xuICAgICAgaWYgKHNlbGYudGltZWRvdXQpIHJldHVybiBzZWxmLnRpbWVvdXRFcnJvcigpO1xuICAgICAgaWYgKHNlbGYuYWJvcnRlZCkgcmV0dXJuO1xuICAgICAgcmV0dXJuIHNlbGYuY3Jvc3NEb21haW5FcnJvcigpO1xuICAgIH1cbiAgICBzZWxmLmVtaXQoJ2VuZCcpO1xuICB9O1xuXG4gIC8vIHByb2dyZXNzXG4gIHZhciBoYW5kbGVQcm9ncmVzcyA9IGZ1bmN0aW9uKGUpe1xuICAgIGlmIChlLnRvdGFsID4gMCkge1xuICAgICAgZS5wZXJjZW50ID0gZS5sb2FkZWQgLyBlLnRvdGFsICogMTAwO1xuICAgIH1cbiAgICBlLmRpcmVjdGlvbiA9ICdkb3dubG9hZCc7XG4gICAgc2VsZi5lbWl0KCdwcm9ncmVzcycsIGUpO1xuICB9O1xuICBpZiAodGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICB4aHIub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzO1xuICB9XG4gIHRyeSB7XG4gICAgaWYgKHhoci51cGxvYWQgJiYgdGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzO1xuICAgIH1cbiAgfSBjYXRjaChlKSB7XG4gICAgLy8gQWNjZXNzaW5nIHhoci51cGxvYWQgZmFpbHMgaW4gSUUgZnJvbSBhIHdlYiB3b3JrZXIsIHNvIGp1c3QgcHJldGVuZCBpdCBkb2Vzbid0IGV4aXN0LlxuICAgIC8vIFJlcG9ydGVkIGhlcmU6XG4gICAgLy8gaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84MzcyNDUveG1saHR0cHJlcXVlc3QtdXBsb2FkLXRocm93cy1pbnZhbGlkLWFyZ3VtZW50LXdoZW4tdXNlZC1mcm9tLXdlYi13b3JrZXItY29udGV4dFxuICB9XG5cbiAgLy8gdGltZW91dFxuICBpZiAodGltZW91dCAmJiAhdGhpcy5fdGltZXIpIHtcbiAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYudGltZWRvdXQgPSB0cnVlO1xuICAgICAgc2VsZi5hYm9ydCgpO1xuICAgIH0sIHRpbWVvdXQpO1xuICB9XG5cbiAgLy8gcXVlcnlzdHJpbmdcbiAgaWYgKHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdChxdWVyeSk7XG4gICAgdGhpcy51cmwgKz0gfnRoaXMudXJsLmluZGV4T2YoJz8nKVxuICAgICAgPyAnJicgKyBxdWVyeVxuICAgICAgOiAnPycgKyBxdWVyeTtcbiAgfVxuXG4gIC8vIGluaXRpYXRlIHJlcXVlc3RcbiAgaWYgKHRoaXMudXNlcm5hbWUgJiYgdGhpcy5wYXNzd29yZCkge1xuICAgIHhoci5vcGVuKHRoaXMubWV0aG9kLCB0aGlzLnVybCwgdHJ1ZSwgdGhpcy51c2VybmFtZSwgdGhpcy5wYXNzd29yZCk7XG4gIH0gZWxzZSB7XG4gICAgeGhyLm9wZW4odGhpcy5tZXRob2QsIHRoaXMudXJsLCB0cnVlKTtcbiAgfVxuXG4gIC8vIENPUlNcbiAgaWYgKHRoaXMuX3dpdGhDcmVkZW50aWFscykgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG5cbiAgLy8gYm9keVxuICBpZiAoJ0dFVCcgIT0gdGhpcy5tZXRob2QgJiYgJ0hFQUQnICE9IHRoaXMubWV0aG9kICYmICdzdHJpbmcnICE9IHR5cGVvZiBkYXRhICYmICFpc0hvc3QoZGF0YSkpIHtcbiAgICAvLyBzZXJpYWxpemUgc3R1ZmZcbiAgICB2YXIgY29udGVudFR5cGUgPSB0aGlzLl9oZWFkZXJbJ2NvbnRlbnQtdHlwZSddO1xuICAgIHZhciBzZXJpYWxpemUgPSB0aGlzLl9wYXJzZXIgfHwgcmVxdWVzdC5zZXJpYWxpemVbY29udGVudFR5cGUgPyBjb250ZW50VHlwZS5zcGxpdCgnOycpWzBdIDogJyddO1xuICAgIGlmICghc2VyaWFsaXplICYmIGlzSlNPTihjb250ZW50VHlwZSkpIHNlcmlhbGl6ZSA9IHJlcXVlc3Quc2VyaWFsaXplWydhcHBsaWNhdGlvbi9qc29uJ107XG4gICAgaWYgKHNlcmlhbGl6ZSkgZGF0YSA9IHNlcmlhbGl6ZShkYXRhKTtcbiAgfVxuXG4gIC8vIHNldCBoZWFkZXIgZmllbGRzXG4gIGZvciAodmFyIGZpZWxkIGluIHRoaXMuaGVhZGVyKSB7XG4gICAgaWYgKG51bGwgPT0gdGhpcy5oZWFkZXJbZmllbGRdKSBjb250aW51ZTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgdGhpcy5oZWFkZXJbZmllbGRdKTtcbiAgfVxuXG4gIGlmICh0aGlzLl9yZXNwb25zZVR5cGUpIHtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlO1xuICB9XG5cbiAgLy8gc2VuZCBzdHVmZlxuICB0aGlzLmVtaXQoJ3JlcXVlc3QnLCB0aGlzKTtcblxuICAvLyBJRTExIHhoci5zZW5kKHVuZGVmaW5lZCkgc2VuZHMgJ3VuZGVmaW5lZCcgc3RyaW5nIGFzIFBPU1QgcGF5bG9hZCAoaW5zdGVhZCBvZiBub3RoaW5nKVxuICAvLyBXZSBuZWVkIG51bGwgaGVyZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICB4aHIuc2VuZCh0eXBlb2YgZGF0YSAhPT0gJ3VuZGVmaW5lZCcgPyBkYXRhIDogbnVsbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEV4cG9zZSBgUmVxdWVzdGAuXG4gKi9cblxucmVxdWVzdC5SZXF1ZXN0ID0gUmVxdWVzdDtcblxuLyoqXG4gKiBHRVQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuZ2V0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdHRVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5xdWVyeShkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogSEVBRCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5oZWFkID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdIRUFEJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogREVMRVRFIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkZWwodXJsLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdERUxFVEUnLCB1cmwpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxucmVxdWVzdFsnZGVsJ10gPSBkZWw7XG5yZXF1ZXN0WydkZWxldGUnXSA9IGRlbDtcblxuLyoqXG4gKiBQQVRDSCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IGRhdGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnBhdGNoID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQQVRDSCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBPU1QgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBkYXRhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wb3N0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQT1NUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUFVUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucHV0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQVVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcbiIsIi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgcmV0dXJuIG51bGwgIT0gb2JqICYmICdvYmplY3QnID09IHR5cGVvZiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKipcbiAqIE1vZHVsZSBvZiBtaXhlZC1pbiBmdW5jdGlvbnMgc2hhcmVkIGJldHdlZW4gbm9kZSBhbmQgY2xpZW50IGNvZGVcbiAqL1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pcy1vYmplY3QnKTtcblxuLyoqXG4gKiBDbGVhciBwcmV2aW91cyB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmNsZWFyVGltZW91dCA9IGZ1bmN0aW9uIF9jbGVhclRpbWVvdXQoKXtcbiAgdGhpcy5fdGltZW91dCA9IDA7XG4gIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBGb3JjZSBnaXZlbiBwYXJzZXJcbiAqXG4gKiBTZXRzIHRoZSBib2R5IHBhcnNlciBubyBtYXR0ZXIgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gcGFyc2UoZm4pe1xuICB0aGlzLl9wYXJzZXIgPSBmbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCB0aW1lb3V0IHRvIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy50aW1lb3V0ID0gZnVuY3Rpb24gdGltZW91dChtcyl7XG4gIHRoaXMuX3RpbWVvdXQgPSBtcztcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEZhdXggcHJvbWlzZSBzdXBwb3J0XG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICovXG5cbmV4cG9ydHMudGhlbiA9IGZ1bmN0aW9uIHRoZW4oZnVsZmlsbCwgcmVqZWN0KSB7XG4gIHJldHVybiB0aGlzLmVuZChmdW5jdGlvbihlcnIsIHJlcykge1xuICAgIGVyciA/IHJlamVjdChlcnIpIDogZnVsZmlsbChyZXMpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBBbGxvdyBmb3IgZXh0ZW5zaW9uXG4gKi9cblxuZXhwb3J0cy51c2UgPSBmdW5jdGlvbiB1c2UoZm4pIHtcbiAgZm4odGhpcyk7XG4gIHJldHVybiB0aGlzO1xufVxuXG5cbi8qKlxuICogR2V0IHJlcXVlc3QgaGVhZGVyIGBmaWVsZGAuXG4gKiBDYXNlLWluc2Vuc2l0aXZlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmdldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgaGVhZGVyIGBmaWVsZGAgdmFsdWUuXG4gKiBUaGlzIGlzIGEgZGVwcmVjYXRlZCBpbnRlcm5hbCBBUEkuIFVzZSBgLmdldChmaWVsZClgIGluc3RlYWQuXG4gKlxuICogKGdldEhlYWRlciBpcyBubyBsb25nZXIgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBzdXBlcmFnZW50IGNvZGUgYmFzZSlcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICogQGRlcHJlY2F0ZWRcbiAqL1xuXG5leHBvcnRzLmdldEhlYWRlciA9IGV4cG9ydHMuZ2V0O1xuXG4vKipcbiAqIFNldCBoZWFkZXIgYGZpZWxkYCB0byBgdmFsYCwgb3IgbXVsdGlwbGUgZmllbGRzIHdpdGggb25lIG9iamVjdC5cbiAqIENhc2UtaW5zZW5zaXRpdmUuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLnNldCgnWC1BUEktS2V5JywgJ2Zvb2JhcicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KHsgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsICdYLUFQSS1LZXknOiAnZm9vYmFyJyB9KVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZmllbGRcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnNldCA9IGZ1bmN0aW9uKGZpZWxkLCB2YWwpe1xuICBpZiAoaXNPYmplY3QoZmllbGQpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGZpZWxkKSB7XG4gICAgICB0aGlzLnNldChrZXksIGZpZWxkW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV0gPSB2YWw7XG4gIHRoaXMuaGVhZGVyW2ZpZWxkXSA9IHZhbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBoZWFkZXIgYGZpZWxkYC5cbiAqIENhc2UtaW5zZW5zaXRpdmUuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC51bnNldCgnVXNlci1BZ2VudCcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKi9cbmV4cG9ydHMudW5zZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIGRlbGV0ZSB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG4gIGRlbGV0ZSB0aGlzLmhlYWRlcltmaWVsZF07XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBXcml0ZSB0aGUgZmllbGQgYG5hbWVgIGFuZCBgdmFsYCBmb3IgXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCJcbiAqIHJlcXVlc3QgYm9kaWVzLlxuICpcbiAqIGBgYCBqc1xuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmZpZWxkKCdmb28nLCAnYmFyJylcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd8QmxvYnxGaWxlfEJ1ZmZlcnxmcy5SZWFkU3RyZWFtfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0cy5maWVsZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbCkge1xuICB0aGlzLl9nZXRGb3JtRGF0YSgpLmFwcGVuZChuYW1lLCB2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG4iLCIvLyBUaGUgbm9kZSBhbmQgYnJvd3NlciBtb2R1bGVzIGV4cG9zZSB2ZXJzaW9ucyBvZiB0aGlzIHdpdGggdGhlXG4vLyBhcHByb3ByaWF0ZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBib3VuZCBhcyBmaXJzdCBhcmd1bWVudFxuLyoqXG4gKiBJc3N1ZSBhIHJlcXVlc3Q6XG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgcmVxdWVzdCgnR0VUJywgJy91c2VycycpLmVuZChjYWxsYmFjaylcbiAqICAgIHJlcXVlc3QoJy91c2VycycpLmVuZChjYWxsYmFjaylcbiAqICAgIHJlcXVlc3QoJy91c2VycycsIGNhbGxiYWNrKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSB1cmwgb3IgY2FsbGJhY2tcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHJlcXVlc3QoUmVxdWVzdENvbnN0cnVjdG9yLCBtZXRob2QsIHVybCkge1xuICAvLyBjYWxsYmFja1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgdXJsKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0Q29uc3RydWN0b3IoJ0dFVCcsIG1ldGhvZCkuZW5kKHVybCk7XG4gIH1cblxuICAvLyB1cmwgZmlyc3RcbiAgaWYgKDIgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdENvbnN0cnVjdG9yKCdHRVQnLCBtZXRob2QpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXF1ZXN0Q29uc3RydWN0b3IobWV0aG9kLCB1cmwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVlc3Q7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgbm9kZXMgOiByZXF1aXJlKCcuL25vZGVzJyksXG4gIHJlZ2lvbnMgOiByZXF1aXJlKCcuL3JlZ2lvbnMnKVxufSIsInZhciByZXN0ID0gcmVxdWlyZSgnLi4vcmVzdCcpO1xuXG5mdW5jdGlvbiBOb2RlQ29sbGVjdGlvbigpe1xuXG4gICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgIHRoaXMubGlua3MgPSBbXTtcbiAgICB0aGlzLmV4dHJhcyA9IHt9OyAvLyBleHRyYSBkYXRhIGZvciBub2RlXG5cbiAgICB0aGlzLmluZGV4ID0ge1xuICAgICAgcHJtbmFtZSA6IHt9LFxuICAgICAgaG9iYmVzSWQgOiB7fSxcbiAgICAgIG9yaWdpbnMgOiB7fSxcbiAgICAgIHRlcm1pbmFscyA6IHt9XG4gICAgfTtcblxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKG5vZGVzKSB7XG4gICAgICB0aGlzLm5vZGVzID0gW107XG4gICAgICB0aGlzLmxpbmtzID0gW107XG4gICAgICB0aGlzLmV4dHJhcyA9IHt9O1xuXG4gICAgICB0aGlzLmluZGV4ID0ge1xuICAgICAgICBwcm1uYW1lIDoge30sXG4gICAgICAgIGhvYmJlc0lkIDoge30sXG4gICAgICAgIG9yaWdpbnMgOiB7fSxcbiAgICAgICAgdGVybWluYWxzIDoge31cbiAgICAgIH07XG5cbiAgICAgIG5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgdGhpcy5pbmRleC5wcm1uYW1lW25vZGUucHJvcGVydGllcy5wcm1uYW1lXSA9IG5vZGU7XG4gICAgICAgIHRoaXMuaW5kZXguaG9iYmVzSWRbbm9kZS5wcm9wZXJ0aWVzLmhvYmJlcy5pZF0gPSBub2RlO1xuXG4gICAgICAgIGlmKCBub2RlLnByb3BlcnRpZXMuaG9iYmVzLnR5cGUgPT09ICdsaW5rJyApIHtcbiAgICAgICAgICB0aGlzLmxpbmtzLnB1c2gobm9kZSk7XG4gICAgICAgICAgdGhpcy5zZXRMaW5rSW5kZXhlcyhub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuc2V0TGlua0luZGV4ZXMgPSBmdW5jdGlvbihsaW5rKSB7XG4gICAgICAgIGlmKCAhdGhpcy5pbmRleC5vcmlnaW5zW2xpbmsucHJvcGVydGllcy5vcmlnaW5dICkge1xuICAgICAgICAgICAgdGhpcy5pbmRleC5vcmlnaW5zW2xpbmsucHJvcGVydGllcy5vcmlnaW5dID0gW2xpbmtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbmRleC5vcmlnaW5zW2xpbmsucHJvcGVydGllcy5vcmlnaW5dLnB1c2gobGluayk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggIXRoaXMuaW5kZXgudGVybWluYWxzW2xpbmsucHJvcGVydGllcy50ZXJtaW51c10gKSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4LnRlcm1pbmFsc1tsaW5rLnByb3BlcnRpZXMudGVybWludXNdID0gW2xpbmtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbmRleC50ZXJtaW5hbHNbbGluay5wcm9wZXJ0aWVzLnRlcm1pbnVzXS5wdXNoKGxpbmspO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5nZXRFeHRyYXMgPSBmdW5jdGlvbihwcm1uYW1lLCBjYWxsYmFjaykge1xuICAgICAgaWYoIHRoaXMuZXh0cmFzW3BybW5hbWVdICkge1xuICAgICAgICBpZiggdGhpcy5leHRyYXNbcHJtbmFtZV0uX19sb2FkaW5nX18gKSB7XG4gICAgICAgICAgdGhpcy5leHRyYXNbcHJtbmFtZV0uaGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2sodGhpcy5leHRyYXNbcHJtbmFtZV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5leHRyYXNbcHJtbmFtZV0gPSB7XG4gICAgICAgIF9fbG9hZGluZ19fIDogdHJ1ZSxcbiAgICAgICAgaGFuZGxlcnMgOiBbY2FsbGJhY2tdXG4gICAgICB9O1xuXG4gICAgICByZXN0LmdldEV4dHJhcyhwcm1uYW1lLCAocmVzcCkgPT4ge1xuICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMuZXh0cmFzW3BybW5hbWVdLmhhbmRsZXJzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgIHRoaXMuZXh0cmFzW3BybW5hbWVdLmhhbmRsZXJzW2ldKHJlc3ApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXh0cmFzW3BybW5hbWVdID0gcmVzcDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0QnlQcm1uYW1lID0gZnVuY3Rpb24ocHJtbmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXgucHJtbmFtZVtwcm1uYW1lXTtcbiAgICB9XG5cbiAgICB0aGlzLmdldEJ5SWQgPSBmdW5jdGlvbihpZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXguaG9iYmVzSWRbaWRdO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0T3JpZ2lucyA9IGZ1bmN0aW9uKHBybW5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmluZGV4Lm9yaWdpbnNbcHJtbmFtZV07XG4gICAgfVxuXG4gICAgdGhpcy5nZXRUZXJtaW5hbHMgPSBmdW5jdGlvbihwcm1uYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRleC50ZXJtaW5hbHNbcHJtbmFtZV07XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBOb2RlQ29sbGVjdGlvbigpOyIsInZhciByZXN0ID0gcmVxdWlyZSgnLi4vcmVzdCcpO1xuXG5mdW5jdGlvbiBSZWdpb25Db2xsZWN0aW9uKCl7XG4gICAgdGhpcy5pbmRleCA9IHtcbiAgICAgIG5hbWUgOiB7fSxcbiAgICAgIGhvYmJlc0lkIDoge30sXG4gICAgfTtcblxuICAgIHRoaXMuYWdncmVnYXRlID0ge307XG5cbiAgICB0aGlzLmluaXQgPSBmdW5jdGlvbihyZWdpb25zKSB7XG4gICAgICB0aGlzLmluZGV4ID0ge1xuICAgICAgICBuYW1lIDoge30sXG4gICAgICAgIGhvYmJlc0lkIDoge31cbiAgICAgIH07XG4gICAgICB0aGlzLmFnZ3JlZ2F0ZSA9IHt9O1xuXG4gICAgICByZWdpb25zLmZvckVhY2goKHJlZ2lvbikgPT4ge1xuICAgICAgICB0aGlzLmluZGV4Lm5hbWVbcmVnaW9uLnByb3BlcnRpZXMubmFtZV0gPSByZWdpb247XG4gICAgICAgIHRoaXMuaW5kZXguaG9iYmVzSWRbcmVnaW9uLnByb3BlcnRpZXMuaG9iYmVzLmlkXSA9IHJlZ2lvbjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMubG9hZEFnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKHR5cGUsIG9yaWdpbiwgdGVybWludXMsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgcHJtbmFtZSA9IG9yaWdpbjtcbiAgICAgIGlmKCB0eXBlb2YgdGVybWludXMgPT09ICdzdHJpbmcnICkge1xuICAgICAgICBwcm1uYW1lID0gcHJtbmFtZSsnLS0nK3Rlcm1pbnVzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sgPSB0ZXJtaW51cztcbiAgICAgIH1cblxuXG4gICAgICBpZiggIXRoaXMuYWdncmVnYXRlW3R5cGVdICkge1xuICAgICAgICB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXSA9IHt9O1xuICAgICAgfVxuXG4gICAgICBpZiggdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0gKSB7XG4gICAgICAgIGlmKCB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXS5fX2xvYWRpbmdfXyApIHtcbiAgICAgICAgICB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXS5oYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayh0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXSA9IHtcbiAgICAgICAgX19sb2FkaW5nX18gOiB0cnVlLFxuICAgICAgICBoYW5kbGVycyA6IFtjYWxsYmFja11cbiAgICAgIH07XG5cbiAgICAgIGlmKCB0eXBlb2YgdGVybWludXMgIT09ICdzdHJpbmcnICkge1xuICAgICAgICByZXN0LmdldEFnZ3JlZ2F0ZSh7dHlwZTogdHlwZSwgcmVnaW9uOiBvcmlnaW59LCAocmVzcCkgPT4ge1xuICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0uaGFuZGxlcnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXS5oYW5kbGVyc1tpXShyZXNwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0gPSByZXNwO1xuICAgICAgICB9KTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdC5nZXRBZ2dyZWdhdGUoe3R5cGU6ICdmbG93Jywgb3JpZ2luOiBvcmlnaW4sIHRlcm1pbnVzOiB0ZXJtaW51c30sIChyZXNwMSkgPT4ge1xuICAgICAgICAgIHJlc3QuZ2V0QWdncmVnYXRlKHt0eXBlOiAnZmxvdycsIG9yaWdpbjogdGVybWludXMsIHRlcm1pbnVzOiBvcmlnaW59LCAocmVzcDIpID0+IHtcbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICBvcmlnaW4gOiByZXNwMSxcbiAgICAgICAgICAgICAgdGVybWludXMgOiByZXNwMlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXS5oYW5kbGVycy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgdGhpcy5hZ2dyZWdhdGVbdHlwZV1bcHJtbmFtZV0uaGFuZGxlcnNbaV0oZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFnZ3JlZ2F0ZVt0eXBlXVtwcm1uYW1lXSA9IGRhdGE7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZ2V0QnlOYW1lID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXgubmFtZVtuYW1lXTtcbiAgICB9XG5cbiAgICB0aGlzLmdldEJ5SWQgPSBmdW5jdGlvbihpZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXguaG9iYmVzSWRbaWRdO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUmVnaW9uQ29sbGVjdGlvbigpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBuZXR3b3JrIDogcmVxdWlyZSgnLi9uZXR3b3JrJylcbn0iLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG52YXIgZXZlbnRzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG52YXIgbm9kZUNvbGxlY3Rpb24gPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9ub2RlcycpO1xudmFyIHJlZ2lvbnNDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMvcmVnaW9ucycpO1xudmFyIHJlc3QgPSByZXF1aXJlKCcuLi9yZXN0Jyk7XG5cbmZ1bmN0aW9uIGxvYWROZXR3b3JrKGNhbGxiYWNrKSB7XG4gIGFwaS5sb2FkaW5nID0gdHJ1ZTtcbiAgZXZlbnRzLmVtaXQoJ2xvYWRpbmcnKTtcblxuICByZXN0LmxvYWROZXR3b3JrKChkYXRhKSA9PiB7XG4gICAgbm9kZUNvbGxlY3Rpb24uaW5pdChkYXRhLm5vZGVzKTtcbiAgICBwcm9jZXNzTm9kZXNMaW5rcyhkYXRhLm5vZGVzKTtcblxuICAgIHJlZ2lvbnNDb2xsZWN0aW9uLmluaXQoZGF0YS5yZWdpb25zKTtcbiAgICBkYXRhLnJlZ2lvbnMuZm9yRWFjaChwcm9jZXNzUmVnaW9uKTtcblxuICAgIGFwaS5sb2FkaW5nID0gZmFsc2U7XG4gICAgZXZlbnRzLmVtaXQoJ2xvYWRpbmctY29tcGxldGUnKTtcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc05vZGVzTGlua3Mobm9kZXMpIHtcbiAgZm9yKCB2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKyApIHtcbiAgICBpZiggIW5vZGVzW2ldLnByb3BlcnRpZXMuZGVzY3JpcHRpb24gKSB7XG4gICAgICAgIG5vZGVzW2ldLnByb3BlcnRpZXMuZGVzY3JpcHRpb24gPSAnJztcbiAgICB9XG4gICAgXG4gICAgbWFya0NhbGlicmF0aW9uTm9kZShub2Rlc1tpXSk7XG5cbiAgICBpZiggbm9kZXNbaV0ucHJvcGVydGllcy5ob2JiZXMudHlwZSA9PT0gJ2xpbmsnICkge1xuICAgICAgbWFya0xpbmtUeXBlcyhub2Rlc1tpXSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcmtDYWxpYnJhdGlvbk5vZGUobm9kZSkge1xuICAgIGlmKCBub2RlLnByb3BlcnRpZXMucHJtbmFtZS5pbmRleE9mKCdfJykgPiAtMSApIHtcbiAgICAgICAgdmFyIHBhcnRzID0gbm9kZS5wcm9wZXJ0aWVzLnBybW5hbWUuc3BsaXQoJ18nKTtcbiAgICAgICAgaWYoICEocGFydHNbMF0ubWF0Y2goL15DTi4qLykgfHwgcGFydHNbMV0ubWF0Y2goL15DTi4qLykpICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmKCAhbm9kZS5wcm9wZXJ0aWVzLnBybW5hbWUubWF0Y2goL15DTi4qLykgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaGFzSW4gPSBmYWxzZTtcbiAgICB2YXIgaGFzT3V0ID0gZmFsc2U7XG5cbiAgICBpZiggbm9kZS5wcm9wZXJ0aWVzLnRlcm1pbmFscyApIHtcbiAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBub2RlLnByb3BlcnRpZXMudGVybWluYWxzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgaWYoIG5vZGUucHJvcGVydGllcy50ZXJtaW5hbHNbaV0gIT0gbnVsbCApIHtcbiAgICAgICAgICAgICAgICBoYXNPdXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmKCBub2RlLnByb3BlcnRpZXMub3JpZ2lucyApIHtcbiAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBub2RlLnByb3BlcnRpZXMub3JpZ2lucy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIGlmKCBub2RlLnByb3BlcnRpZXMub3JpZ2luc1tpXSAhPSBudWxsICkge1xuICAgICAgICAgICAgICAgIGhhc0luID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUucHJvcGVydGllcy5jYWxpYnJhdGlvbk5vZGUgPSB0cnVlO1xuICAgIGlmKCAhaGFzSW4gJiYgIWhhc091dCApIHJldHVybjtcblxuICAgIGlmKCBoYXNJbiAmJiBoYXNPdXQgKSBub2RlLnByb3BlcnRpZXMuY2FsaWJyYXRpb25Nb2RlID0gJ2JvdGgnO1xuICAgIGVsc2UgaWYgKCBoYXNJbiApIG5vZGUucHJvcGVydGllcy5jYWxpYnJhdGlvbk1vZGUgPSAnaW4nO1xuICAgIGVsc2UgaWYgKCBoYXNPdXQgKSBub2RlLnByb3BlcnRpZXMuY2FsaWJyYXRpb25Nb2RlID0gJ291dCc7XG59XG5cbmZ1bmN0aW9uIG1hcmtMaW5rVHlwZXMobGluaykge1xuICBsaW5rLnByb3BlcnRpZXMucmVuZGVySW5mbyA9IHtcbiAgICAgIGNvc3QgOiBsaW5rLnByb3BlcnRpZXMuaGFzQ29zdHMgPyB0cnVlIDogZmFsc2UsXG4gICAgICBhbXBsaXR1ZGUgOiBsaW5rLnByb3BlcnRpZXMuYW1wbGl0dWRlID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgLy8gVE9ETzogcGFyc2VyIG5lZWRzIHRvIHNoZWV0IHNob3J0Y3V0IGZvciBjb250cmFpbnQgdHlwZVxuICAgICAgLy8gZGF0YSB3aWxsIHN0aWxsIG5lZWQgdG8gYmUgbG9hZGVkIG9uIHNlY29uZCBjYWxsXG4gICAgICBjb25zdHJhaW50cyA6IGxpbmsucHJvcGVydGllcy5oYXNDb25zdHJhaW50cyA/IHRydWUgOiBmYWxzZSxcbiAgICAgIGVudmlyb25tZW50YWwgOiBsaW5rLnByb3BlcnRpZXMuaGFzQ2xpbWF0ZSA/IHRydWUgOiBmYWxzZVxuICB9O1xuXG4gIHRyeSB7XG5cbiAgICAgIC8vIEZsb3cgdG8gYSBzaW5rXG4gICAgICBpZiggbm9kZUNvbGxlY3Rpb24uZ2V0QnlQcm1uYW1lKGxpbmsucHJvcGVydGllcy50ZXJtaW51cykgJiZcbiAgICAgICAgICBub2RlQ29sbGVjdGlvbi5nZXRCeVBybW5hbWUobGluay5wcm9wZXJ0aWVzLnRlcm1pbnVzKS5wcm9wZXJ0aWVzLnR5cGUgPT0gJ1NpbmsnICkge1xuICAgICAgICAgIGxpbmsucHJvcGVydGllcy5yZW5kZXJJbmZvLnR5cGUgPSAnZmxvd1RvU2luayc7XG5cbiAgICAgIH0gZWxzZSBpZiggbGluay5wcm9wZXJ0aWVzLnR5cGUgPT0gJ1JldHVybiBGbG93JyApIHtcbiAgICAgICAgICBsaW5rLnByb3BlcnRpZXMucmVuZGVySW5mby50eXBlID0gJ3JldHVybkZsb3dGcm9tRGVtYW5kJztcblxuICAgICAgfSBlbHNlIGlmICggdGhpcy5pc0dXVG9EZW1hbmQobGluaykgKSB7XG4gICAgICAgICAgbGluay5wcm9wZXJ0aWVzLnJlbmRlckluZm8udHlwZSA9ICdnd1RvRGVtYW5kJztcblxuICAgICAgfSBlbHNlIGlmKCBub2RlQ29sbGVjdGlvbi5nZXRCeVBybW5hbWUobGluay5wcm9wZXJ0aWVzLm9yaWdpbikgJiZcbiAgICAgICAgICAobm9kZUNvbGxlY3Rpb24uZ2V0QnlQcm1uYW1lKGxpbmsucHJvcGVydGllcy5vcmlnaW4pLnByb3BlcnRpZXMuY2FsaWJyYXRpb25Nb2RlID09ICdpbicgfHxcbiAgICAgICAgICBub2RlQ29sbGVjdGlvbi5nZXRCeVBybW5hbWUobGluay5wcm9wZXJ0aWVzLm9yaWdpbikucHJvcGVydGllcy5jYWxpYnJhdGlvbk1vZGUgPT0gJ2JvdGgnKSApIHtcblxuICAgICAgICAgIGxpbmsucHJvcGVydGllcy5yZW5kZXJJbmZvLnR5cGUgPSAnYXJ0aWZpY2FsUmVjaGFyZ2UnO1xuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIGxpbmsucHJvcGVydGllcy5yZW5kZXJJbmZvLnR5cGUgPSAndW5rbm93bic7XG4gICAgICB9XG5cbiAgfSBjYXRjaChlKSB7XG4gICAgICBkZWJ1Z2dlcjtcbiAgfVxuXG4gIGlmKCAhbGluay5nZW9tZXRyeSApIHJldHVybjtcbiAgZWxzZSBpZiggIWxpbmsuZ2VvbWV0cnkuY29vcmRpbmF0ZXMgKSByZXR1cm47XG5cbiAgLy8gZmluYWxseSwgbWFyayB0aGUgYW5nbGUgb2YgdGhlIGxpbmUsIHNvIHdlIGNhbiByb3RhdGUgdGhlIGljb24gb24gdGhlXG4gIC8vIG1hcCBhY2NvcmRpbmdseVxuICB2YXIgd2lkdGggPSBsaW5rLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdWzBdIC0gbGluay5nZW9tZXRyeS5jb29yZGluYXRlc1swXVswXTtcbiAgdmFyIGhlaWdodCA9IGxpbmsuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV1bMV0gLSBsaW5rLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdWzFdO1xuICBsaW5rLnByb3BlcnRpZXMucmVuZGVySW5mby5yb3RhdGUgPSAgTWF0aC5hdGFuKHdpZHRoIC8gaGVpZ2h0KSAqICgxODAgLyBNYXRoLlBJKTtcbn1cblxuZnVuY3Rpb24gaXNHV1RvRGVtYW5kKGxpbmspIHtcbiAgICB2YXIgb3JpZ2luID0gbm9kZUNvbGxlY3Rpb24uZ2V0QnlQcm1uYW1lKGxpbmsucHJvcGVydGllcy5vcmlnaW4pO1xuICAgIHZhciB0ZXJtaW5hbCA9IG5vZGVDb2xsZWN0aW9uLmdldEJ5UHJtbmFtZShsaW5rLnByb3BlcnRpZXMudGVybWluYWwpO1xuXG4gICAgaWYoICFvcmlnaW4gfHwgIXRlcm1pbmFsICkgcmV0dXJuIGZhbHNlO1xuXG4gICAgaWYoIG9yaWdpbi5wcm9wZXJ0aWVzLnR5cGUgIT0gJ0dyb3VuZHdhdGVyIFN0b3JhZ2UnICkgcmV0dXJuIGZhbHNlO1xuICAgIGlmKCB0ZXJtaW5hbC5wcm9wZXJ0aWVzLnR5cGUgPT0gJ05vbi1TdGFuZGFyZCBEZW1hbmQnIHx8XG4gICAgICAgIHRlcm1pbmFsLnByb3BlcnRpZXMudHlwZSA9PSAnQWdyaWN1bHR1cmFsIERlbWFuZCcgfHxcbiAgICAgICAgdGVybWluYWwucHJvcGVydGllcy50eXBlID09ICdVcmJhbiBEZW1hbmQnICkgcmV0dXJuIHRydWU7XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NSZWdpb24ocmVnaW9uKSB7XG4gICAgaWYoIHJlZ2lvbi5wcm9wZXJ0aWVzLnN1YnJlZ2lvbnMgKSB7XG4gICAgICByZWdpb24ucHJvcGVydGllcy5zdWJyZWdpb25zLnNvcnQoKTtcbiAgICB9XG5cbiAgICBpZiggIXJlZ2lvbi5nZW9tZXRyeSApIHJldHVybjtcblxuICAgIHZhciBwb2x5cyA9IGdldFhZUG9seWdvbnMocmVnaW9uKTtcblxuICAgIHJlZ2lvbi5wcm9wZXJ0aWVzLnNpbXBsaWZpZWQgPSBbXTtcbiAgICBmb3IoIHZhciBpID0gMDsgaSA8IHBvbHlzLmxlbmd0aDsgaSsrICkge1xuICAgICAgaWYoIHBvbHlzW2ldLmxlbmd0aCA+IDEwMCApIHtcbiAgICAgICAgcmVnaW9uLnByb3BlcnRpZXMuc2ltcGxpZmllZC5wdXNoKEwuTGluZVV0aWwuc2ltcGxpZnkocG9seXNbaV0sIDAuMDAxKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWdpb24ucHJvcGVydGllcy5zaW1wbGlmaWVkLnB1c2gocG9seXNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlZ2lvbi5wcm9wZXJ0aWVzLmNlbnRlciA9IGdldENlbnRlcihyZWdpb24ucHJvcGVydGllcy5zaW1wbGlmaWVkWzBdKTtcblxuICAgIC8vIHRvZG8gY2FsYyBiYm94IHNvIHdlIGtub3cgaWYgd2UgbmVlZCB0byByZW5kZXIgZ2VvbWV0cnkgb3Igbm90XG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCByZWdpb24ucHJvcGVydGllcy5zaW1wbGlmaWVkLmxlbmd0aDsgaSsrICkge1xuICAgICAgZm9yKCB2YXIgaiA9IDA7IGogPCByZWdpb24ucHJvcGVydGllcy5zaW1wbGlmaWVkW2ldLmxlbmd0aDsgaisrICkge1xuICAgICAgICByZWdpb24ucHJvcGVydGllcy5zaW1wbGlmaWVkW2ldW2pdID0gW3JlZ2lvbi5wcm9wZXJ0aWVzLnNpbXBsaWZpZWRbaV1bal0ueCwgcmVnaW9uLnByb3BlcnRpZXMuc2ltcGxpZmllZFtpXVtqXS55XVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhBQ0tcbiAgICBpZiggaXNOYU4ocmVnaW9uLnByb3BlcnRpZXMuY2VudGVyWzBdKSApIHJlZ2lvbi5wcm9wZXJ0aWVzLmNlbnRlciA9IHJlZ2lvbi5wcm9wZXJ0aWVzLnNpbXBsaWZpZWRbMF1bMF07XG59XG5cbmZ1bmN0aW9uIGdldFhZUG9seWdvbnMoZ2VvanNvbikge1xuICB2YXIgcG9seXMgPSBbXSwgdG1wID0gW10sIGksIGosIHA7XG4gIGlmKCBnZW9qc29uLmdlb21ldHJ5LnR5cGUgPT0gJ1BvbHlnb24nICkge1xuICAgIC8vIHdlIG9ubHkgY2FyZSBhYm91dCB0aGUgb3V0ZXIgcmluZy4gIG5vIGhvbGVzIGFsbG93ZWQuXG4gICAgZm9yKCBpID0gMDsgaSA8IGdlb2pzb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0ubGVuZ3RoOyBpKysgKSB7XG4gICAgICB0bXAucHVzaCh7XG4gICAgICAgIHggOiBnZW9qc29uLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdW2ldWzBdLFxuICAgICAgICB5IDogZ2VvanNvbi5nZW9tZXRyeS5jb29yZGluYXRlc1swXVtpXVsxXVxuICAgICAgfSk7XG4gICAgfVxuICAgIHBvbHlzLnB1c2godG1wKTtcblxuICB9IGVsc2UgaWYoIGdlb2pzb24uZ2VvbWV0cnkudHlwZSA9PSAnTXVsdGlQb2x5Z29uJyApIHtcbiAgICAvLyB3ZSBvbmx5IGNhcmUgYWJvdXQgdGhlIG91dGVyIHJpbmcuICBubyBob2xlcyBhbGxvd2VkLlxuICAgIGZvciggaSA9IDA7IGkgPCBnZW9qc29uLmdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aDsgaSsrICkge1xuICAgICAgdG1wID0gW107XG4gICAgICBwID0gZ2VvanNvbi5nZW9tZXRyeS5jb29yZGluYXRlc1tpXVswXTtcblxuICAgICAgZm9yKCBqID0gMDsgaiA8IHAubGVuZ3RoOyBqKysgKSB7XG4gICAgICAgIHRtcC5wdXNoKHtcbiAgICAgICAgICB4IDogcFtqXVswXSxcbiAgICAgICAgICB5IDogcFtqXVsxXVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcG9seXMucHVzaCh0bXApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcG9seXM7XG59XG5cbmZ1bmN0aW9uIGdldENlbnRlcihwb2ludHMpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBwMSwgcDIsIGYsIGFyZWEsIHgsIHksXG4gICAgLy8gcG9seWdvbiBjZW50cm9pZCBhbGdvcml0aG07IHVzZXMgYWxsIHRoZSByaW5ncywgbWF5IHdvcmtzIGJldHRlciBmb3IgYmFuYW5hIHR5cGUgcG9seWdvbnNcblxuICAgIGFyZWEgPSB4ID0geSA9IDA7XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBwb2ludHMubGVuZ3RoLCBqID0gbGVuIC0gMTsgaSA8IGxlbjsgaiA9IGkrKykge1xuICAgICAgcDEgPSBwb2ludHNbaV07XG4gICAgICBwMiA9IHBvaW50c1tqXTtcblxuICAgICAgZiA9IHAxLnkgKiBwMi54IC0gcDIueSAqIHAxLng7XG4gICAgICB4ICs9IChwMS54ICsgcDIueCkgKiBmO1xuICAgICAgeSArPSAocDEueSArIHAyLnkpICogZjtcbiAgICB9XG5cbiAgICBmID0gZ2V0QXJlYShwb2ludHMpICogNjtcbiAgICByZXR1cm4gWy0xICogKHggLyBmKSwgLTEgKiAoeSAvIGYpXTtcbn1cblxuLyoqIGhlbHBlciBmb3IgcHJvY2Vzc2luZyByZWdpb24gY2VudGVyICoqL1xuZnVuY3Rpb24gZ2V0QXJlYShwb2ludHMpe1xuICAgIHZhciBhcmVhID0gMDtcbiAgICB2YXIgbGVuZ3RoUG9pbnRzID0gcG9pbnRzLmxlbmd0aDtcbiAgICB2YXIgaiA9IGxlbmd0aFBvaW50cyAtIDE7XG4gICAgdmFyIHAxOyB2YXIgcDI7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGhQb2ludHM7IGogPSBpKyspIHtcbiAgICAgICAgcDEgPSBwb2ludHNbaV07IHAyID0gcG9pbnRzW2pdO1xuICAgICAgICBhcmVhICs9IHAxLnggKiBwMi55O1xuICAgICAgICBhcmVhIC09IHAxLnkgKiBwMi54O1xuICAgIH1cbiAgICBhcmVhIC89IDI7XG4gICAgcmV0dXJuIGFyZWE7XG59XG5cbnZhciBhcGkgPSB7XG4gIGxvYWRpbmcgOiB0cnVlLFxuICBsb2FkOiBsb2FkTmV0d29yayxcbiAgb24gOiBmdW5jdGlvbihldnQsIGZuKSB7XG4gICAgICBldmVudHMub24oZXZ0LCBmbik7XG4gIH0sXG4gIG9uTG9hZCA6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICBpZiggdGhpcy5sb2FkaW5nICkge1xuICAgICAgICAgIHRoaXMub24oJ2xvYWRpbmctY29tcGxldGUnLCBjYWxsYmFjayk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2soKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwaTsiLCJcbnJlcXVpcmUoJy4vc2lnbWEtY3duLXBsdWdpbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29sbGVjdGlvbnMgOiByZXF1aXJlKCcuL2NvbGxlY3Rpb25zJyksXG4gIGNvbnRyb2xsZXJzIDogcmVxdWlyZSgnLi9jb250cm9sbGVycycpLFxuICBtYXAgOiByZXF1aXJlKCcuL21hcCcpLFxuICByZW5kZXJlciA6IHJlcXVpcmUoJy4vcmVuZGVyZXInKVxufSIsInZhciBiZWhhdmlvciA9IHtcbiAgb25MYXllckNsaWNrIDogZnVuY3Rpb24oZmVhdHVyZXMsIGUpIHtcbiAgICBpZiggZmVhdHVyZXMubGVuZ3RoID09IDAgKSByZXR1cm47XG5cbiAgICB2YXIgdHlwZSA9IGZlYXR1cmVzWzBdLmdlb21ldHJ5LnR5cGU7XG5cbiAgICBpZiggZmVhdHVyZXMubGVuZ3RoID09IDEgJiYgdHlwZSA9PSAnUG9seWdvbicgfHwgdHlwZSA9PSAnTXVsdGlQb2x5Z29uJyApIHtcbiAgICAgIGlmKCB0aGlzLnNoaWZ0UGVzc2VkICkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcjaW5mby8nICsgZmVhdHVyZXNbMF0ucHJvcGVydGllcy5pZDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiggIWZlYXR1cmVzWzBdLnByb3BlcnRpZXMuX3JlbmRlciApIGZlYXR1cmVzWzBdLnByb3BlcnRpZXMuX3JlbmRlciA9IHt9O1xuICAgICAgZmVhdHVyZXNbMF0ucHJvcGVydGllcy5fcmVuZGVyLmhvdmVyID0gdHJ1ZTtcbiAgICAgIHRoaXMubWFya2VyTGF5ZXIucmVuZGVyKCk7XG5cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgcmVmLm9uUmVnaW9uQ2xpY2soZmVhdHVyZXNbMF0ucHJvcGVydGllcy5ob2JiZXMuaWQpO1xuXG4gICAgICAgIGZlYXR1cmVzWzBdLnByb3BlcnRpZXMuX3JlbmRlci5ob3ZlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1hcmtlckxheWVyLnJlbmRlcigpO1xuXG4gICAgICB9LmJpbmQodGhpcyksIDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKCBmZWF0dXJlcy5sZW5ndGggPT0gMSAmJiBmZWF0dXJlc1swXS5wcm9wZXJ0aWVzLnBybW5hbWUgKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcjaW5mby8nICsgZmVhdHVyZXNbMF0ucHJvcGVydGllcy5wcm1uYW1lO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0b3Iub25DbGljayhmZWF0dXJlcyk7XG4gIH0sXG5cbiAgb25MYXllck1vdXNlTW92ZSA6IGZ1bmN0aW9uKGZlYXR1cmVzLCBlKSB7XG4gICAgdmFyIGxhYmVsID0gW10sIGxpbmtMYWJlbCA9ICcnLCByZWdpb25MYWJlbCA9ICcnO1xuICAgIHZhciBpLCBmO1xuXG4gICAgZm9yKCBpID0gMDsgaSA8IGZlYXR1cmVzLmxlbmd0aDsgaSsrICkge1xuICAgICAgZiA9IGZlYXR1cmVzW2ldLnByb3BlcnRpZXM7XG5cbiAgICAgIGlmKCBmLnR5cGUgPT0gJ0RpdmVyc2lvbicgfHwgZi50eXBlID09ICdSZXR1cm4gRmxvdycgKSBsYWJlbC5wdXNoKGYudHlwZSsnIDxiPicrZi5wcm1uYW1lKyc8L2I+Jyk7XG4gICAgICBlbHNlIGlmKCBmLnR5cGUgPT0gJ0xpbmsgR3JvdXAnICkgbGFiZWwucHVzaChmLnR5cGUrJyA8Yj5Db3VudDogJytmLmxpbmVzLmxlbmd0aCsnPC9iPicpO1xuICAgICAgZWxzZSBpZiAoIGYudHlwZSA9PSAnUmVnaW9uJyApIGxhYmVsLnB1c2goZi50eXBlKycgPGI+JytmLm5hbWUrJzwvYj4nKTtcbiAgICAgIGVsc2UgbGFiZWwucHVzaChmLnR5cGUrJyA8Yj4nK2YucHJtbmFtZSsnPC9iPicpO1xuICAgIH1cblxuICAgIGlmKCBmZWF0dXJlcy5sZW5ndGggPiAwICkge1xuICAgICAgdGhpcy5zaG93SG92ZXJMYWJlbCh0cnVlLCBsYWJlbC5qb2luKCc8YnIgLz4nKSwgZS5jb250YWluZXJQb2ludCk7XG4gICAgICB0aGlzLiQubGVhZmxldC5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvd0hvdmVyTGFiZWwoZmFsc2UpO1xuICAgICAgdGhpcy4kLmxlYWZsZXQuc3R5bGUuY3Vyc29yID0gJy13ZWJraXQtZ3JhYic7XG4gICAgfVxuICB9LFxuXG4gIG9uTGF5ZXJNb3VzZU92ZXIgOiBmdW5jdGlvbihmZWF0dXJlcywgZSkge1xuICAgIHZhciBpLCBmO1xuXG4gICAgZm9yKCBpID0gMDsgaSA8IGZlYXR1cmVzLmxlbmd0aDsgaSsrICkge1xuICAgICAgZiA9IGZlYXR1cmVzW2ldLnByb3BlcnRpZXM7XG5cbiAgICAgIGlmKCAhZi5fcmVuZGVyICkgZi5fcmVuZGVyID0ge307XG4gICAgICBmLl9yZW5kZXIuaG92ZXIgPSB0cnVlO1xuICAgIH1cbiAgfSxcblxuICBvbkxheWVyTW91c2VPdXQgOiBmdW5jdGlvbihmZWF0dXJlcykge1xuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgZmVhdHVyZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiggIWZlYXR1cmVzW2ldLnByb3BlcnRpZXMuX3JlbmRlciApIGZlYXR1cmVzW2ldLnByb3BlcnRpZXMuX3JlbmRlciA9IHt9O1xuICAgICAgZmVhdHVyZXNbaV0ucHJvcGVydGllcy5fcmVuZGVyLmhvdmVyID0gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIHNob3dIb3ZlckxhYmVsIDogZnVuY3Rpb24oc2hvdywgbGFiZWwsIHBvcykge1xuICAgIGlmKCBzaG93ICkge1xuICAgICAgdGhpcy4kLmhvdmVyTGFiZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB0aGlzLiQuaG92ZXJMYWJlbC5zdHlsZS5sZWZ0ID0gKHBvcy54KzEwKSsncHgnO1xuICAgICAgdGhpcy4kLmhvdmVyTGFiZWwuc3R5bGUudG9wID0gKHBvcy55KzEwKSsncHgnO1xuICAgICAgdGhpcy4kLmhvdmVyTGFiZWwuaW5uZXJIVE1MID0gbGFiZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJC5ob3ZlckxhYmVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3I7IiwidmFyIGNvbGxlY3Rpb24gPSByZXF1aXJlKCcuLi9jb2xsZWN0aW9ucy9ub2RlcycpO1xuXG4vLyBtYXJrZXIgbm9kZXMgdGhhdCBhcmUgbGlua2VkIHRvIGEgdmlzaWJsZSBub2RlIHdpdGggdGhlICdub2RlU3RlcCcgYXR0cmlidXRlXG52YXIgYmVoYXZpb3IgPSB7XG4gICAgZmlsdGVyIDogZnVuY3Rpb24obWFwRmlsdGVycykge1xuICAgICAgICB2YXIgcmUsIGksIGQsIGQyLCBkMywgaWQ7XG4gICAgICAgIC8vIHRocmVlIGxvb3BzLCBmaXJzdCBtYXJrIG5vZGVzIHRoYXQgbWF0Y2gsIHRoZW4gbWFyayBvbmUgc3RlcCBub2Rlc1xuICAgICAgICAvLyBmaW5hbGx5IG1hcmsgbGlua3MgdG8gaGlkZSBhbmQgc2hvd1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmUgPSBuZXcgUmVnRXhwKCcuKicrbWFwRmlsdGVycy50ZXh0LnRvTG93ZXJDYXNlKCkrJy4qJyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgIGZvciggaSA9IDA7IGkgPCBjb2xsZWN0aW9uLm5vZGVzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgZCA9IGNvbGxlY3Rpb24ubm9kZXNbaV07XG5cbiAgICAgICAgICAgIGlmKCAhZC5wcm9wZXJ0aWVzLl9yZW5kZXIgKSB7XG4gICAgICAgICAgICAgICAgZC5wcm9wZXJ0aWVzLl9yZW5kZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcl9pZCA6IGQucHJvcGVydGllcy50eXBlLnJlcGxhY2UoJyAnLCdfJykucmVwbGFjZSgnLScsJ18nKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYoIG1hcEZpbHRlcnNbZC5wcm9wZXJ0aWVzLl9yZW5kZXIuZmlsdGVyX2lkXSAmJiBpc1RleHRNYXRjaChyZSwgZC5wcm9wZXJ0aWVzLCBtYXBGaWx0ZXJzKSApIHtcbiAgICAgICAgICAgICAgICBpZiggIWNoZWNrU2lua01vZGUobWFwRmlsdGVycy5pbmZsb3dTaW5rTW9kZSwgIGQucHJvcGVydGllcykgKSB7XG4gICAgICAgICAgICAgICAgICAgIGQucHJvcGVydGllcy5fcmVuZGVyLnNob3cgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkLnByb3BlcnRpZXMuX3JlbmRlci5zaG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGQucHJvcGVydGllcy5fcmVuZGVyLnNob3cgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vdyBtYXJrIGxpbmtzIHRoYXQgc2hvdWxkIGJlIHNob3dcbiAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBjb2xsZWN0aW9uLmxpbmtzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgZCA9IGNvbGxlY3Rpb24ubGlua3NbaV07XG4gICAgICAgICAgICBkMiA9IGNvbGxlY3Rpb24uZ2V0QnlQcm1uYW1lKGQucHJvcGVydGllcy5vcmlnaW4pO1xuICAgICAgICAgICAgZDMgPSBjb2xsZWN0aW9uLmdldEJ5UHJtbmFtZShkLnByb3BlcnRpZXMudGVybWludXMpO1xuXG4gICAgICAgICAgICBjaGVja1JlbmRlck5zKGQpO1xuICAgICAgICAgICAgY2hlY2tSZW5kZXJOcyhkMik7XG4gICAgICAgICAgICBjaGVja1JlbmRlck5zKGQzKTtcblxuICAgICAgICAgICAgaWYoIGQyICYmIGQzICYmXG4gICAgICAgICAgICAgICAgKGQyLnByb3BlcnRpZXMuX3JlbmRlci5zaG93IHx8IChtYXBGaWx0ZXJzLm9uZVN0ZXBNb2RlICYmIGQyLnByb3BlcnRpZXMuX3JlbmRlci5vbmVTdGVwKSApICYmXG4gICAgICAgICAgICAgICAgKGQzLnByb3BlcnRpZXMuX3JlbmRlci5zaG93IHx8IChtYXBGaWx0ZXJzLm9uZVN0ZXBNb2RlICYmIGQzLnByb3BlcnRpZXMuX3JlbmRlci5vbmVTdGVwKSApICYmXG4gICAgICAgICAgICAgICAgIShkMi5wcm9wZXJ0aWVzLl9yZW5kZXIub25lU3RlcCAmJiBkMy5wcm9wZXJ0aWVzLl9yZW5kZXIub25lU3RlcCApICkge1xuICAgICAgICAgICAgICAgIGQucHJvcGVydGllcy5fcmVuZGVyLnNob3cgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkLnByb3BlcnRpZXMuX3JlbmRlci5zaG93ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrUmVuZGVyTnMobm9kZSkge1xuICBpZiggIW5vZGUgKSByZXR1cm47XG4gIGlmKCAhbm9kZS5wcm9wZXJ0aWVzLl9yZW5kZXIgKSB7XG4gICAgbm9kZS5wcm9wZXJ0aWVzLl9yZW5kZXIgPSB7fTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1RleHRNYXRjaChyZSwgcHJvcHMsIG1hcEZpbHRlcnMpIHtcbiAgICBpZiggbWFwRmlsdGVycy50ZXh0ID09ICcnIHx8ICFyZSApIHJldHVybiB0cnVlO1xuXG4gICAgaWYoIHJlLnRlc3QocHJvcHMucHJtbmFtZS50b0xvd2VyQ2FzZSgpKSApIHJldHVybiB0cnVlO1xuICAgIGlmKCBwcm9wcy5kZXNjcmlwdGlvbiAmJiByZS50ZXN0KHByb3BzLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkpICkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjaGVja1NpbmtNb2RlKGluZmxvd1NpbmtNb2RlLCAgcHJvcGVydGllcykge1xuICBpZiggIWluZmxvd1NpbmtNb2RlICkge1xuICAgIHByb3BlcnRpZXMuX3JlbmRlci5zdHJva2UgPSBudWxsO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYoIHByb3BlcnRpZXMuZXh0cmFzICkge1xuICAgIGlmKCBwcm9wZXJ0aWVzLmV4dHJhcy5pbmZsb3dzICkge1xuICAgICAgcHJvcGVydGllcy5fcmVuZGVyLnN0cm9rZSA9ICdncmVlbic7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYoIHByb3BlcnRpZXMuZXh0cmFzLnNpbmtzICkge1xuICAgICAgcHJvcGVydGllcy5fcmVuZGVyLnN0cm9rZSA9ICdyZWQnO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHJvcGVydGllcy5fcmVuZGVyLnN0cm9rZSA9IG51bGw7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcjsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVuZGVyZXIgOiByZXF1aXJlKCcuL3JlbmRlcmVyJyksXG4gIGxlZ2VuZCA6IHJlcXVpcmUoJy4vcmVuZGVyZXIvbGVnZW5kJyksXG4gIEZpbHRlckJlaGF2aW9yIDogcmVxdWlyZSgnLi9maWx0ZXInKSxcbiAgUmVuZGVyU3RhdGVCZWhhdmlvciA6IHJlcXVpcmUoJy4vcmVuZGVyLXN0YXRlJyksXG4gIENhbnZhc0xheWVyQmVoYXZpb3IgOiByZXF1aXJlKCcuL2NhbnZhcy1sYXllci1ldmVudHMnKVxufSIsInZhciBjb2xsZWN0aW9ucyA9IHJlcXVpcmUoJy4uL2NvbGxlY3Rpb25zJyk7XG5cbnZhciBiZWhhdmlvciA9IHtcbiAgdXBkYXRlUmVuZGVyU3RhdGUgOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbmRlclN0YXRlID0ge1xuICAgICAgcG9pbnRzIDogW10sXG4gICAgICBsaW5lcyA6IFtdLFxuICAgICAgcG9seWdvbnMgOiBbXVxuICAgIH1cbiAgICB0aGlzLmNsZWFyQ3VzdG9tTGluZXMoKTtcblxuICAgIHRoaXMuX3VwZGF0ZVJlbmRlclN0YXRlKCdDYWxpZm9ybmlhJyk7XG5cbiAgICB2YXIgZiA9IG51bGwsIHJlbmRlcjtcbiAgICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMubWFya2VyTGF5ZXIuZmVhdHVyZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBmID0gdGhpcy5tYXJrZXJMYXllci5mZWF0dXJlc1tpXTtcbiAgICAgIHIgPSBmLmdlb2pzb24ucHJvcGVydGllcy5fcmVuZGVyIHx8IHt9O1xuXG4gICAgICBpZiggKHRoaXMucmVuZGVyU3RhdGUucG9pbnRzLmluZGV4T2YoZi5nZW9qc29uKSA+IC0xIHx8XG4gICAgICAgIHRoaXMucmVuZGVyU3RhdGUubGluZXMuaW5kZXhPZihmLmdlb2pzb24pID4gLTEgfHxcbiAgICAgICAgdGhpcy5yZW5kZXJTdGF0ZS5wb2x5Z29ucy5pbmRleE9mKGYuZ2VvanNvbikgPiAtMSkgJiZcbiAgICAgICAgci5zaG93ICE9PSBmYWxzZSApIHtcblxuICAgICAgICAgIGYudmlzaWJsZSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm1hcmtlckxheWVyLnJlbmRlcigpO1xuICB9LFxuXG4gIF91cGRhdGVSZW5kZXJTdGF0ZSA6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgcmVnaW9uID0gY29sbGVjdGlvbnMucmVnaW9ucy5nZXRCeU5hbWUobmFtZSk7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5tZW51LnN0YXRlO1xuXG4gICAgaWYoIHN0YXRlLmVuYWJsZWQuaW5kZXhPZihuYW1lKSA+IC0xICkge1xuICAgICAgdGhpcy5fYWRkU3RhdGVOb2RlcyhyZWdpb24ucHJvcGVydGllcy5ob2JiZXMubm9kZXMsIHN0YXRlKTtcblxuICAgICAgaWYoICFyZWdpb24ucHJvcGVydGllcy5ob2JiZXMuc3VicmVnaW9ucyApIHJldHVybjtcblxuICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCByZWdpb24ucHJvcGVydGllcy5ob2JiZXMuc3VicmVnaW9ucy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlUmVuZGVyU3RhdGUocmVnaW9uLnByb3BlcnRpZXMuaG9iYmVzLnN1YnJlZ2lvbnNbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGlmKCBuYW1lICE9ICdDYWxpZm9ybmlhJyApIHRoaXMucmVuZGVyU3RhdGUucG9seWdvbnMucHVzaChyZWdpb24pO1xuICAgIH1cbiAgfSxcblxuICBfYWRkU3RhdGVOb2RlcyA6IGZ1bmN0aW9uKG5vZGVzLCBzdGF0ZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIGZpbmQgZmlyc3QgcmVnaW9uIGFuZCBpbnNlcnQgYWZ0ZXJcbiAgICB2YXIgaW5kZXggPSAwLCB0eXBlO1xuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGhpcy5tYXJrZXJMYXllci5mZWF0dXJlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIHR5cGUgPSB0aGlzLm1hcmtlckxheWVyLmZlYXR1cmVzW2ldLmdlb2pzb24uZ2VvbWV0cnkudHlwZTtcbiAgICAgIGlmKCB0eXBlICE9ICdQb2x5Z29uJyAmJiB0eXBlICE9ICdNdWx0aVBvbHlnb24nICkge1xuICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciggdmFyIGlkIGluIG5vZGVzICkge1xuICAgICAgdmFyIG5vZGUgPSBjb2xsZWN0aW9ucy5ub2Rlcy5nZXRCeUlkKGlkKTtcbiAgICAgIGlmKCAhbm9kZSApIG5vZGUgPSBjb2xsZWN0aW9ucy5ub2Rlcy5nZXRCeVBybW5hbWUoaWQpO1xuICAgICAgaWYoICFub2RlICkgY29udGludWU7XG5cbiAgICAgIHZhciByZW5kZXIgPSBub2RlLnByb3BlcnRpZXMuX3JlbmRlciB8fCB7fTtcbiAgICAgIGlmKCByZW5kZXIuc2hvdyA9PT0gZmFsc2UgKSBjb250aW51ZTtcblxuICAgICAgaWYoIG5vZGUucHJvcGVydGllcy50eXBlID09ICdEaXZlcnNpb24nIHx8IG5vZGUucHJvcGVydGllcy50eXBlID09ICdSZXR1cm4gRmxvdycgKSB7XG4gICAgICAgIHZhciB0ZXJtaW5hbCA9IHRoaXMuX2dldFN0YXRlTm9kZUxvY2F0aW9uKG5vZGUucHJvcGVydGllcy50ZXJtaW51cywgc3RhdGUpO1xuICAgICAgICB2YXIgb3JpZ2luID0gdGhpcy5fZ2V0U3RhdGVOb2RlTG9jYXRpb24obm9kZS5wcm9wZXJ0aWVzLm9yaWdpbiwgc3RhdGUpO1xuXG4gICAgICAgIGlmKCAhdGVybWluYWwgfHwgIW9yaWdpbiApIGNvbnRpbnVlO1xuXG4gICAgICAgIHZhciBsaW5lRmVhdHVyZTtcbiAgICAgICAgaWYoIHRlcm1pbmFsLmlzTm9kZSAmJiBvcmlnaW4uaXNOb2RlICkge1xuICAgICAgICAgIGxpbmVGZWF0dXJlID0gdGhpcy5jcmVhdGVOb2RlTGluayhvcmlnaW4uY2VudGVyLCB0ZXJtaW5hbC5jZW50ZXIsIG5vZGUpO1xuICAgICAgICAgIHRoaXMuY3VzdG9tTGluZXNbbm9kZS5wcm9wZXJ0aWVzLm9yaWdpbisnXycrbm9kZS5wcm9wZXJ0aWVzLnRlcm1pbnVzXSA9IGxpbmVGZWF0dXJlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlmIHRoaXMgbGluZSBhbHJlYWR5IGV4aXN0cywgYSBudWxsIHZhbHVlIHdpbGwgYmUgcmV0dXJuZWRcbiAgICAgICAgICBsaW5lRmVhdHVyZSA9IHRoaXMuY3JlYXRlQ3VzdG9tTGluayhvcmlnaW4sIHRlcm1pbmFsLCBub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBsaW5lRmVhdHVyZSApIHtcbiAgICAgICAgICB0aGlzLnJlbmRlclN0YXRlLmxpbmVzLnB1c2gobGluZUZlYXR1cmUuZ2VvanNvbik7XG4gICAgICAgICAgdGhpcy5tYXJrZXJMYXllci5hZGRGZWF0dXJlKGxpbmVGZWF0dXJlLCBpbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW5kZXJTdGF0ZS5wb2ludHMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgY3JlYXRlTm9kZUxpbmsgOiBmdW5jdGlvbihvcmlnaW4sIHRlcm1pbmFsLCBub2RlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdlb2pzb24gOiB7XG4gICAgICAgIFwidHlwZVwiIDogXCJGZWF0dXJlXCIsXG4gICAgICAgIFwiZ2VvbWV0cnlcIiA6IHtcbiAgICAgICAgICBcInR5cGVcIiA6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICAgIGNvb3JkaW5hdGVzIDogW29yaWdpbiwgdGVybWluYWxdXG4gICAgICAgIH0sXG4gICAgICAgIHByb3BlcnRpZXMgOiAkLmV4dGVuZCh0cnVlLCB7fSwgbm9kZS5wcm9wZXJ0aWVzKVxuICAgICAgfSxcbiAgICAgIHJlbmRlciA6IENXTi5tYXAucmVuZGVyZXIuYmFzaWNcbiAgICB9O1xuICB9LFxuXG4gIGNyZWF0ZUN1c3RvbUxpbmsgOiBmdW5jdGlvbihvcmlnaW4sIHRlcm1pbmFsLCBub2RlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBmZWF0dXJlID0gbnVsbDtcbiAgICBpZiggdGhpcy5jdXN0b21MaW5lc1tvcmlnaW4ubmFtZSsnXycrdGVybWluYWwubmFtZV0gKSB7XG4gICAgICBmZWF0dXJlID0gdGhpcy5jdXN0b21MaW5lc1tvcmlnaW4ubmFtZSsnXycrdGVybWluYWwubmFtZV07XG4gICAgfSBlbHNlIGlmICggdGhpcy5jdXN0b21MaW5lc1t0ZXJtaW5hbC5uYW1lKydfJytvcmlnaW4ubmFtZV0gKSB7XG4gICAgICBmZWF0dXJlID0gdGhpcy5jdXN0b21MaW5lc1t0ZXJtaW5hbC5uYW1lKydfJytvcmlnaW4ubmFtZV07XG4gICAgfVxuXG4gICAgaWYoICFmZWF0dXJlICkge1xuICAgICAgZmVhdHVyZSA9IHtcbiAgICAgICAgZ2VvanNvbiA6IHtcbiAgICAgICAgICBcInR5cGVcIiA6IFwiRmVhdHVyZVwiLFxuICAgICAgICAgIFwiZ2VvbWV0cnlcIiA6IHtcbiAgICAgICAgICAgIFwidHlwZVwiIDogXCJMaW5lU3RyaW5nXCIsXG4gICAgICAgICAgICBjb29yZGluYXRlcyA6IFtvcmlnaW4uY2VudGVyLCB0ZXJtaW5hbC5jZW50ZXJdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwcm9wZXJ0aWVzIDoge1xuICAgICAgICAgICAgcHJtbmFtZSA6IG9yaWdpbi5uYW1lKyctLScrdGVybWluYWwubmFtZSxcbiAgICAgICAgICAgIHR5cGUgOiAnUmVnaW9uIExpbmsnLFxuICAgICAgICAgICAgbGluZXMgOiBbJC5leHRlbmQodHJ1ZSwge30sIG5vZGUucHJvcGVydGllcyldLFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyIDogQ1dOLm1hcC5yZW5kZXJlci5iYXNpY1xuICAgICAgfVxuXG4gICAgICB0aGlzLmN1c3RvbUxpbmVzW29yaWdpbi5uYW1lKydfJyt0ZXJtaW5hbC5uYW1lXSA9IGZlYXR1cmU7XG5cbiAgICAgIHJldHVybiBmZWF0dXJlO1xuICAgIH1cblxuICAgIGZlYXR1cmUuZ2VvanNvbi5wcm9wZXJ0aWVzLmxpbmVzLnB1c2goJC5leHRlbmQodHJ1ZSwge30sIG5vZGUucHJvcGVydGllcykpO1xuICB9LFxuXG4gIGNsZWFyQ3VzdG9tTGluZXMgOiBmdW5jdGlvbigpIHtcbiAgICBmb3IoIHZhciBrZXkgaW4gdGhpcy5jdXN0b21MaW5lcyApIHtcbiAgICAgIHZhciBpbmRleCA9IHRoaXMubWFya2VyTGF5ZXIuZmVhdHVyZXMuaW5kZXhPZih0aGlzLmN1c3RvbUxpbmVzW2tleV0pO1xuICAgICAgaWYoIGluZGV4ID4gLTEgKSB0aGlzLm1hcmtlckxheWVyLmZlYXR1cmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICAgIHRoaXMuY3VzdG9tTGluZXMgPSB7fTtcbiAgfSxcblxuICBfZ2V0U3RhdGVOb2RlTG9jYXRpb24gOiBmdW5jdGlvbihuYW1lLCBzdGF0ZSkge1xuICAgIHZhciBub2RlID0gQ1dOLmRzLmxvb2t1cE1hcFtuYW1lXTtcblxuICAgIGlmKCAhbm9kZSApIHJldHVybiBudWxsO1xuXG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBub2RlLnByb3BlcnRpZXMuaG9iYmVzLnJlZ2lvbnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiggc3RhdGUuZGlzYWJsZWQuaW5kZXhPZihub2RlLnByb3BlcnRpZXMuaG9iYmVzLnJlZ2lvbnNbaV0pID4gLTEgKSB7XG4gICAgICAgIGlmKCBDV04uZHMucmVnaW9uTG9va3VwTWFwW25vZGUucHJvcGVydGllcy5ob2JiZXMucmVnaW9uc1tpXV0ucHJvcGVydGllcy5jZW50ZXIgKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNlbnRlcjogQ1dOLmRzLnJlZ2lvbkxvb2t1cE1hcFtub2RlLnByb3BlcnRpZXMuaG9iYmVzLnJlZ2lvbnNbaV1dLnByb3BlcnRpZXMuY2VudGVyLFxuICAgICAgICAgICAgbmFtZTogbm9kZS5wcm9wZXJ0aWVzLmhvYmJlcy5yZWdpb25zW2ldLFxuICAgICAgICAgICAgaXNSZWdpb24gOiB0cnVlXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjZW50ZXIgOiBub2RlLmdlb21ldHJ5LmNvb3JkaW5hdGVzIHx8IFswLDBdLFxuICAgICAgbmFtZSA6IG5hbWUsXG4gICAgICBpc05vZGUgOiB0cnVlXG4gICAgfVxuICB9LFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yOyIsInZhciByZW5kZXJVdGlscyA9IHJlcXVpcmUoJy4uLy4uL3JlbmRlcmVyJyk7XG52YXIgY29sbGVjdGlvbiA9IHJlcXVpcmUoJy4uLy4uL2NvbGxlY3Rpb25zL25vZGVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCB4eVBvaW50cywgbWFwLCBmZWF0dXJlKSB7XG4gIHZhciByZW5kZXIgPSBmZWF0dXJlLmdlb2pzb24ucHJvcGVydGllcy5fcmVuZGVyIHx8IHt9O1xuXG4gIGlmKCBmZWF0dXJlLmdlb2pzb24uZ2VvbWV0cnkudHlwZSA9PSAnUG9pbnQnICkge1xuICAgIHJlbmRlckJhc2ljUG9pbnQoY3R4LCB4eVBvaW50cywgbWFwLCBmZWF0dXJlLCByZW5kZXIpO1xuICB9IGVsc2UgaWYgKCBmZWF0dXJlLmdlb2pzb24uZ2VvbWV0cnkudHlwZSA9PSAnTGluZVN0cmluZycgKSB7XG4gICAgaWYoIGZlYXR1cmUuZ2VvanNvbi5wcm9wZXJ0aWVzLnR5cGUgPT09ICdSZWdpb24gTGluaycgKSB7XG4gICAgICByZW5kZXJSZWdpb25MaW5lKGN0eCwgeHlQb2ludHMsIG1hcCwgZmVhdHVyZSwgcmVuZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVuZGVyQmFzaWNMaW5lKGN0eCwgeHlQb2ludHMsIG1hcCwgZmVhdHVyZSwgcmVuZGVyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoIGZlYXR1cmUuZ2VvanNvbi5nZW9tZXRyeS50eXBlID09ICdQb2x5Z29uJyApIHtcbiAgICByZW5kZXJCYXNpY1BvbHlnb24oY3R4LCB4eVBvaW50cywgbWFwLCBmZWF0dXJlLCByZW5kZXIpO1xuICB9IGVsc2UgaWYgKCBmZWF0dXJlLmdlb2pzb24uZ2VvbWV0cnkudHlwZSA9PSAnTXVsdGlQb2x5Z29uJyApIHtcbiAgICAvL2RlYnVnZ2VyO1xuICAgIHh5UG9pbnRzLmZvckVhY2goZnVuY3Rpb24ocG9pbnRzKXtcbiAgICAgIHJlbmRlckJhc2ljUG9seWdvbihjdHgsIHBvaW50cywgbWFwLCBmZWF0dXJlLCByZW5kZXIpO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlclJlZ2lvbkxpbmUoY3R4LCB4eVBvaW50cywgbWFwLCBmZWF0dXJlLCByZW5kZXIpIHtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHguc3Ryb2tlU3R5bGUgPSByZW5kZXJVdGlscy5jb2xvcnMub3JhbmdlO1xuICBjdHgubGluZVdpZHRoID0gMjtcbiAgY3R4Lm1vdmVUbyh4eVBvaW50c1swXS54LCB4eVBvaW50c1swXS55KTtcbiAgY3R4LmxpbmVUbyh4eVBvaW50c1sxXS54LCB4eVBvaW50c1sxXS55KTtcbiAgY3R4LnN0cm9rZSgpO1xufVxuXG5mdW5jdGlvbiByZW5kZXJCYXNpY1BvaW50KGN0eCwgeHlQb2ludHMsIG1hcCwgZmVhdHVyZSwgcmVuZGVyKSB7XG4gIG8gPSByZW5kZXIub25lU3RlcCA/IC4zIDogLjc7XG5cbiAgcmVuZGVyLnBvaW50ID0geHlQb2ludHM7XG4gIG1zID0gKGZlYXR1cmUuc2l6ZSB8fCAyMCkgKiAocmVuZGVyLm11bHRpcGllciB8fCAxKTtcbiAgYnVmZmVyID0gbXMgLyAyO1xuXG4gIC8vIFRPRE86IHNldCBmZWF0dXJlLnNpemUgYW5kIHlvdSB3YW50IGhhdmUgdG8gd29ycnkgYWJvdXQgLTEwIG9mZnNldCBoZXJlXG4gIHJlbmRlclV0aWxzW2ZlYXR1cmUuZ2VvanNvbi5wcm9wZXJ0aWVzLnR5cGVdKGN0eCwge1xuICAgICAgeDogeHlQb2ludHMueCAtIDEwLFxuICAgICAgeTogeHlQb2ludHMueSAtIDEwLFxuICAgICAgd2lkdGg6IG1zLFxuICAgICAgaGVpZ2h0OiBtcyxcbiAgICAgIG9wYWNpdHk6IG8sXG4gICAgICBmaWxsIDogcmVuZGVyLmZpbGwsXG4gICAgICBzdHJva2UgOiByZW5kZXIuc3Ryb2tlLFxuICAgICAgbGluZVdpZHRoIDogcmVuZGVyLmxpbmVXaWR0aCxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlckJhc2ljTGluZShjdHgsIHh5UG9pbnRzLCBtYXAsIGZlYXR1cmUsIHJlbmRlcikge1xuICBjb2xvciA9ICd3aGl0ZSc7XG4gIGlmKCByZW5kZXIuaGlnaGxpZ2h0ICkge1xuICAgICAgaWYoIHJlbmRlci5oaWdobGlnaHQgPT0gJ29yaWdpbicgKSBjb2xvciA9ICdncmVlbic7XG4gICAgICBlbHNlIGNvbG9yID0gJ3JlZCc7XG4gIH1cblxuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICBjdHgubGluZVdpZHRoID0gNDtcbiAgY3R4Lm1vdmVUbyh4eVBvaW50c1swXS54LCB4eVBvaW50c1swXS55KTtcbiAgY3R4LmxpbmVUbyh4eVBvaW50c1sxXS54LCB4eVBvaW50c1sxXS55KTtcbiAgY3R4LnN0cm9rZSgpO1xuXG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4LnN0cm9rZVN0eWxlID0gZ2V0TGluZUNvbG9yKGZlYXR1cmUuZ2VvanNvbik7XG4gIGN0eC5saW5lV2lkdGggPSAyO1xuICBjdHgubW92ZVRvKHh5UG9pbnRzWzBdLngsIHh5UG9pbnRzWzBdLnkpO1xuICBjdHgubGluZVRvKHh5UG9pbnRzWzFdLngsIHh5UG9pbnRzWzFdLnkpO1xuICBjdHguc3Ryb2tlKCk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlckJhc2ljUG9seWdvbihjdHgsIHh5UG9pbnRzLCBtYXAsIGZlYXR1cmUsIHJlbmRlcikge1xuICB2YXIgcG9pbnQ7XG4gIGlmKCB4eVBvaW50cy5sZW5ndGggPD0gMSApIHJldHVybjtcblxuICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgcG9pbnQgPSB4eVBvaW50c1swXTtcbiAgY3R4Lm1vdmVUbyhwb2ludC54LCBwb2ludC55KTtcbiAgZm9yKCB2YXIgaSA9IDE7IGkgPCB4eVBvaW50cy5sZW5ndGg7IGkrKyApIHtcbiAgICBjdHgubGluZVRvKHh5UG9pbnRzW2ldLngsIHh5UG9pbnRzW2ldLnkpO1xuICB9XG4gIGN0eC5saW5lVG8oeHlQb2ludHNbMF0ueCwgeHlQb2ludHNbMF0ueSk7XG5cbiAgY3R4LnN0cm9rZVN0eWxlID0gcmVuZGVyLmhvdmVyID8gJ3JlZCcgOiAncmdiYSgnK3JlbmRlclV0aWxzLmNvbG9ycy5yZ2IuYmx1ZS5qb2luKCcsJykrJywuNiknO1xuICBjdHguZmlsbFN0eWxlID0gcmVuZGVyLmZpbGxTdHlsZSA/IHJlbmRlci5maWxsU3R5bGUgOiAncmdiYSgnK3JlbmRlclV0aWxzLmNvbG9ycy5yZ2IubGlnaHRCbHVlLmpvaW4oJywnKSsnLC42KSc7XG4gIGN0eC5saW5lV2lkdGggPSA0O1xuXG4gIGN0eC5zdHJva2UoKTtcbiAgY3R4LmZpbGwoKTtcbn1cblxuZnVuY3Rpb24gZ2V0TGluZUNvbG9yKGZlYXR1cmUpIHtcbiAgICB2YXIgY29sb3IgPSAnd2hpdGUnO1xuXG4gICAgdmFyIG9yaWdpbiA9IGNvbGxlY3Rpb24uZ2V0QnlQcm1uYW1lKGZlYXR1cmUucHJvcGVydGllcy5vcmlnaW4pO1xuICAgIHZhciB0ZXJtaW51cyA9IGNvbGxlY3Rpb24uZ2V0QnlQcm1uYW1lKGZlYXR1cmUucHJvcGVydGllcy50ZXJtaW51cyk7XG5cbiAgICBpZiggZmVhdHVyZS5wcm9wZXJ0aWVzLnJlbmRlckluZm8gKSB7XG4gICAgICAgIGlmKCB0ZXJtaW51cyAmJiB0ZXJtaW51cy5wcm9wZXJ0aWVzLnR5cGUgPT0gJ1NpbmsnICkge1xuICAgICAgICAgIGNvbG9yID0gcmVuZGVyVXRpbHMuY29sb3JzLmRhcmtDeWFuO1xuICAgICAgICB9IGVsc2UgaWYoIG9yaWdpbiAmJiBvcmlnaW4ucHJvcGVydGllcy50eXBlLm1hdGNoKC9kZW1hbmQvaSkgKSB7XG4gICAgICAgICAgICBjb2xvciA9IHJlbmRlclV0aWxzLmNvbG9ycy5yZWQ7XG4gICAgICAgIH0gZWxzZSBpZiggb3JpZ2luICYmIHRlcm1pbnVzICYmIHRlcm1pbnVzLnByb3BlcnRpZXMudHlwZS5tYXRjaCgvZGVtYW5kL2kpICYmIG9yaWdpbi5wcm9wZXJ0aWVzLnR5cGUgPT0gJ0dyb3VuZHdhdGVyIFN0b3JhZ2UnICkge1xuICAgICAgICAgICAgY29sb3IgPSByZW5kZXJVdGlscy5jb2xvcnMubGlnaHRHcmV5O1xuICAgICAgICB9IGVsc2UgaWYoIGZlYXR1cmUucHJvcGVydGllcy5kZXNjcmlwdGlvbi5tYXRjaCgvcmVjaGFyZ2UvaSwgJycpICkge1xuICAgICAgICAgICAgY29sb3IgPXJlbmRlclV0aWxzQ1dOLmNvbG9ycy5ncmVlbjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaW5lID0ge1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIHdlaWdodDogMyxcbiAgICAgICAgb3BhY2l0eTogMC40LFxuICAgICAgICBzbW9vdGhGYWN0b3I6IDFcbiAgICB9XG5cbiAgICAvL2lmKCBmZWF0dXJlLnByb3BlcnRpZXMuY2FsaWJyYXRpb25Ob2RlICYmIHRoaXMubWFwRmlsdGVycy5jYWxpYnJhdGlvbk1vZGUgKSB7XG4gICAgaWYoIGZlYXR1cmUucHJvcGVydGllcy5jYWxpYnJhdGlvbk5vZGUgKSB7XG4gICAgICAgIGxpbmUuY29sb3IgPSAnYmx1ZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbG9yO1xufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAnUG93ZXIgUGxhbnQnICAgICAgICAgOiB7XG4gICAgY29sb3IgOiAnIzMzNjZjYycsXG4gICAgZ29vZ2xlIDogJ3NtYWxsX3JlZCdcbiAgfSxcbiAgJ0FncmljdWx0dXJhbCBEZW1hbmQnIDoge1xuICAgICAgY29sb3IgOiAnI2ZmOTkwMCcsXG4gICAgICBnb29nbGUgOiAnc21hbGxfeWVsbG93J1xuICB9LFxuICAnSnVuY3Rpb24nICAgICAgICAgICAgOiB7XG4gICAgICBjb2xvciA6ICcjMTA5NjE4JyxcbiAgICAgIGdvb2dsZSA6ICdzbWFsbF9ncmVlbidcbiAgfSxcbiAgJ1B1bXAgUGxhbnQnICAgICAgICAgIDoge1xuICAgICAgY29sb3IgOiAnIzk5MDA5OScsXG4gICAgICBnb29nbGUgOiAnc21hbGxfYmx1ZSdcbiAgfSxcbiAgJ1dhdGVyIFRyZWF0bWVudCcgICAgIDoge1xuICAgICAgY29sb3IgOiAnIzAwOTljNicsXG4gICAgICBnb29nbGUgOiAnc21hbGxfcHVycGxlJ1xuICB9LFxuICAnU3VyZmFjZSBTdG9yYWdlJyAgICAgOiB7XG4gICAgICBjb2xvciA6ICcjZGQ0NDc3JyxcbiAgICAgIGdvb2dsZSA6ICdtZWFzbGVfYnJvd24nLFxuICB9LFxuICAnVXJiYW4gRGVtYW5kJyAgICAgICAgOiB7XG4gICAgICBjb2xvciA6ICcjNjZhYTAwJyxcbiAgICAgIGdvb2dsZSA6ICdtZWFzbGVfZ3JleSdcbiAgfSxcbiAgJ1NpbmsnICAgICAgICAgICAgICAgIDoge1xuICAgICAgY29sb3IgOiAnI2I4MmUyZScsXG4gICAgICBnb29nbGUgOiAnbWVhc2xlX3doaXRlJ1xuICB9LFxuICAnR3JvdW5kd2F0ZXIgU3RvcmFnZScgOiB7XG4gICAgICBjb2xvciA6ICcjMzE2Mzk1JyxcbiAgICAgIGdvb2dsZSA6ICdtZWFzbGVfdHVycXVvaXNlJ1xuICB9LFxuICAnTm9uLVN0YW5kYXJkIERlbWFuZCcgOiB7XG4gICAgICBjb2xvciA6ICcjMjJhYTk5JyxcbiAgICAgIGdvb2dsZSA6ICdzaGFkZWRfZG90J1xuICB9XG59OyIsInZhciBjb2xvcnMgPSByZXF1aXJlKCcuL2NvbG9ycycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0eCwgY29uZmlnKSB7XG4gICAgaWYoICFjb25maWcuc3Ryb2tlICkgY29uZmlnLnN0cm9rZSA9IGNvbG9ycy5nZXRDb2xvcignYmxhY2snLCBjb25maWcub3BhY2l0eSk7XG4gICAgaWYoICFjb25maWcuZmlsbCApIGNvbmZpZy5maWxsID0gY29sb3JzLmdldENvbG9yKCdsaWdodEJsdWUnLCBjb25maWcub3BhY2l0eSk7XG5cbiAgICB1dGlscy5vdmFsKGN0eCwgY29uZmlnKTtcbn0iLCJ2YXIgY29sb3JzID0ge1xuICBiYXNlIDogJyMxOTc2RDInLFxuICBsaWdodEJsdWUgOiAnI0JCREVGQicsXG4gIGJsdWUgOiAnIzE5NzZEMicsXG4gIGxpZ2h0R3JleSA6ICcjNzI3MjcyJyxcbiAgb3JhbmdlIDogJyNGRjU3MjInLFxuICByZWQgOiAnI0QzMkYyRicsXG4gIGdyZWVuIDogJyM0Q0FGNTAnLFxuICB5ZWxsb3cgOiAnI0ZGRUIzQicsXG4gIGJsYWNrIDogJyMyMTIxMjEnLFxuICBjeWFuIDogJyMwMEJDRDQnLFxuICBkYXJrQ3lhbiA6ICcjMDA5N0E3JyxcbiAgaW5kaWdvIDogJyMzRjUxQjUnXG59O1xuXG5jb2xvcnMucmdiID0ge1xuICBiYXNlIDogWzI1LCAxMTgsIDIxMF0sXG4gIGxpZ2h0Qmx1ZSA6IFsxODcsIDIyMiwgMjUxXSxcbiAgYmx1ZSA6IFsyNSwgMTE4LCAyMTBdLFxuICBsaWdodEdyZXkgOiBbMTE0LCAxMTQsIDExNF0sXG4gIG9yYW5nZSA6IFsyNTUsIDg3LCAzNF0sXG4gIGdyZWVuIDogWzc2LCAxNzUsIDgwXSxcbiAgcmVkIDogWzIxMSwgNDcsIDQ3XSxcbiAgeWVsbG93IDogWzI1NSwgMjM1LCA1OV0sXG4gIGN5YW4gOiBbMCwgMTg4LCAyMTJdLFxuICBkYXJrQ3lhbiA6IFswLCAxNTEsIDE2N10sXG4gIGJsYWNrOlsyMSwyMSwyMV0sXG4gIGluZGlnbyA6IFs2MywgODEsIDE4MV1cbn07XG5cbmNvbG9ycy5nZXRDb2xvciA9IGZ1bmN0aW9uKG5hbWUsIG9wYWNpdHkpIHtcbiAgaWYoIG9wYWNpdHkgPT09IHVuZGVmaW5lZCApIG9wYWNpdHkgPSAxO1xuICByZXR1cm4gJ3JnYmEoJytjb2xvcnMucmdiW25hbWVdLmpvaW4oJywnKSsnLCcrb3BhY2l0eSsnKSc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29sb3JzO1xuIiwidmFyIGNvbG9ycyA9IHJlcXVpcmUoJy4vY29sb3JzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCBjb25maWcpIHtcbiAgICB2YXIgciA9IGNvbmZpZy53aWR0aCAvIDI7XG5cbiAgICB2YXIgZ3JkID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KGNvbmZpZy54K3IsIGNvbmZpZy55LCBjb25maWcueCtyLCBjb25maWcueStjb25maWcuaGVpZ2h0LSguMjUqY29uZmlnLmhlaWdodCkpO1xuICAgIGdyZC5hZGRDb2xvclN0b3AoMCwgY29uZmlnLnN0cm9rZSB8fCBjb2xvcnMuZ2V0Q29sb3IoJ2JsdWUnLCBjb25maWcub3BhY2l0eSkpO1xuICAgIGdyZC5hZGRDb2xvclN0b3AoMSwgY29uZmlnLmZpbGwgfHwgY29sb3JzLmdldENvbG9yKCdncmVlbicsIGNvbmZpZy5vcGFjaXR5KSk7XG4gICAgY3R4LmZpbGxTdHlsZT1ncmQ7XG5cbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb25maWcuc3Ryb2tlIHx8IGNvbG9ycy5nZXRDb2xvcignYmxhY2snLCBjb25maWcub3BhY2l0eSk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IGNvbmZpZy5saW5lV2lkdGggfHwgMjtcblxuICAgIHV0aWxzLm5TaWRlZFBhdGgoY3R4LCBjb25maWcueCwgY29uZmlnLnksIHIsIDMsIDkwKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0eXBlLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgY2FudmFzLndpZHRoID0gd2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgaWYoICFDV04ucmVuZGVyW3R5cGVdICkgcmV0dXJuIGNhbnZhcztcblxuICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIENXTi5yZW5kZXJbdHlwZV0oY3R4LCAyLCAyLCB3aWR0aC00LCBoZWlnaHQtNCk7XG5cbiAgcmV0dXJuIGNhbnZhcztcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29sb3JzIDogcmVxdWlyZSgnLi9jb2xvcnMnKSxcbiAgaWNvbiA6IHJlcXVpcmUoJy4vaWNvbicpLFxuICBKdW5jdGlvbiA6IHJlcXVpcmUoJy4vanVuY3Rpb24nKSxcbiAgJ1Bvd2VyIFBsYW50JyA6IHJlcXVpcmUoJy4vcG93ZXItcGxhbnQnKSxcbiAgJ1B1bXAgUGxhbnQnIDogcmVxdWlyZSgnLi9wdW1wLXBsYW50JyksXG4gICdXYXRlciBUcmVhdG1lbnQnIDogcmVxdWlyZSgnLi93YXRlci10cmVhdG1lbnQnKSxcbiAgJ1N1cmZhY2UgU3RvcmFnZScgOiByZXF1aXJlKCcuL3N1cmZhY2Utc3RvcmFnZScpLFxuICAnR3JvdW5kd2F0ZXIgU3RvcmFnZScgOiByZXF1aXJlKCcuL2dyb3VuZHdhdGVyLXN0b3JhZ2UnKSxcbiAgU2luayA6IHJlcXVpcmUoJy4vc2luaycpLFxuICAnTm9uLVN0YW5kYXJkIERlbWFuZCcgOiByZXF1aXJlKCcuL25vbnN0YW5kYXJkLWRlbWFuZCcpLFxuICAnQWdyaWN1bHR1cmFsIERlbWFuZCcgOiByZXF1aXJlKCcuL2FncmljdWx0dXJhbC1kZW1hbmQnKSxcbiAgJ1VyYmFuIERlbWFuZCcgOiByZXF1aXJlKCcuL3VyYmFuLWRlbWFuZCcpLFxuICBXZXRsYW5kIDogcmVxdWlyZSgnLi93ZXRsYW5kJyksXG4gIGxpbmVNYXJrZXJzIDogcmVxdWlyZSgnLi9saW5lLW1hcmtlcnMnKVxufSIsInZhciBjb2xvcnMgPSByZXF1aXJlKCcuL2NvbG9ycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0eCwgY29uZmlnKSB7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbmZpZy5maWxsIHx8ICBjb2xvcnMuZ2V0Q29sb3IoJ2JsdWUnLCBjb25maWcub3BhY2l0eSk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29uZmlnLnN0cm9rZSB8fCBjb2xvcnMuZ2V0Q29sb3IoJ2JsYWNrJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGN0eC5saW5lV2lkdGggPSBjb25maWcubGluZVdpZHRoIHx8IDI7XG5cbiAgICB2YXIgciA9IGNvbmZpZy53aWR0aCAvIDI7XG5cbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmFyYyhjb25maWcueCtyLCBjb25maWcueStyLCByLCAwLCBNYXRoLlBJKjIsIHRydWUpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbn0iLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9jb2xvcnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29zdCA6IGZ1bmN0aW9uKGN4dCwgeCwgeSwgcyl7XG4gICAgICBjeHQuYmVnaW5QYXRoKCk7XG4gICAgICBjeHQuYXJjKHgsIHksIHMsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICBjeHQuZmlsbFN0eWxlID0gY29sb3JzLmdyZWVuO1xuICAgICAgY3h0LmZpbGwoKTtcbiAgICAgIGN4dC5jbG9zZVBhdGgoKTtcbiAgICB9LFxuICAgIGFtcGxpdHVkZSA6IGZ1bmN0aW9uKGN4dCwgeCwgeSwgcyl7XG4gICAgICBjeHQuYmVnaW5QYXRoKCk7XG4gICAgICBjeHQuYXJjKHgsIHksIHMsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICBjeHQubGluZVdpZHRoID0gMjtcbiAgICAgIGN4dC5zdHJva2VTdHlsZSA9IGNvbG9ycy5ibGFjaztcbiAgICAgIGN4dC5zdHJva2UoKTtcbiAgICAgIGN4dC5jbG9zZVBhdGgoKTtcbiAgICB9LFxuICAgIGNvbnN0cmFpbnRzIDogZnVuY3Rpb24oY3h0LCB4LCB5LCBzLCB2WCwgdlkpe1xuICAgICAgY3h0LmJlZ2luUGF0aCgpO1xuICAgICAgdmFyIGR4ID0gdlggKiAuNDtcbiAgICAgIHZhciBkeSA9IHZZICogLjQ7XG5cbiAgICAgIGN4dC5iZWdpblBhdGgoKTtcbiAgICAgIGN4dC5tb3ZlVG8oeCt2WStkeCwgeS12WCtkeSk7XG4gICAgICBjeHQubGluZVRvKHgrdlktZHgsIHktdlgtZHkpO1xuXG4gICAgICBjeHQubGluZVRvKHgtdlktZHgsIHkrdlgtZHkpO1xuICAgICAgY3h0LmxpbmVUbyh4LXZZK2R4LCB5K3ZYK2R5KTtcbiAgICAgIGN4dC5saW5lVG8oeCt2WStkeCwgeS12WCtkeSk7XG4gICAgICBjeHQuc3Ryb2tlU3R5bGUgPSBjb2xvcnMuYmxhY2s7XG4gICAgICBjeHQuc3Ryb2tlKCk7XG4gICAgICBjeHQuY2xvc2VQYXRoKCk7XG4gICAgfSxcbiAgICBlbnZpcm9ubWVudGFsIDogZnVuY3Rpb24oY3h0LCB4LCB5LCBzKXtcbiAgICAgIGN4dC5iZWdpblBhdGgoKTtcbiAgICAgIGN4dC5hcmMoeCwgeSwgcywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgIGN4dC5saW5lV2lkdGggPSAyO1xuICAgICAgY3h0LnN0cm9rZVN0eWxlID0gY29sb3JzLmdyZWVuO1xuICAgICAgY3h0LnN0cm9rZSgpO1xuICAgICAgY3h0LmNsb3NlUGF0aCgpO1xuICAgIH1cbn07IiwidmFyIGNvbG9ycyA9IHJlcXVpcmUoJy4vY29sb3JzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCBjb25maWcpIHtcbiAgICBjdHguZmlsbFN0eWxlID0gY29uZmlnLmZpbGwgfHwgY29sb3JzLmdldENvbG9yKCdyZWQnLCBjb25maWcub3BhY2l0eSk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29uZmlnLnN0cm9rZSB8fCBjb2xvcnMuZ2V0Q29sb3IoJ2JsYWNrJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGN0eC5saW5lV2lkdGggPSBjb25maWcubGluZVdpZHRoIHx8IDI7XG5cbiAgICB1dGlscy5uU2lkZWRQYXRoKGN0eCwgY29uZmlnLngsIGNvbmZpZy55LCBjb25maWcud2lkdGgvMiwgNCwgNDUpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbn0iLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9jb2xvcnMnKTtcbnZhciBqdW5jdGlvbiA9IHJlcXVpcmUoJy4vanVuY3Rpb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHgsIGNvbmZpZykge1xuICBjb25maWcuZmlsbCA9IGNvbG9ycy5nZXRDb2xvcignZGFya0N5YW4nLCBjb25maWcub3BhY2l0eSk7XG5cbiAganVuY3Rpb24oY3R4LCBjb25maWcpO1xuICB2YXIgciA9IGNvbmZpZy53aWR0aCAvIDI7XG5cbiAgLy8gaG9yaXpvbnRhbCBsaW5lXG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4Lm1vdmVUbyhjb25maWcueCwgY29uZmlnLnkrcik7XG4gIGN0eC5saW5lVG8oY29uZmlnLngrY29uZmlnLndpZHRoLCBjb25maWcueStyKTtcbiAgY3R4LnN0cm9rZSgpO1xuICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgLy8gdmVydGljYWwgbGluZVxuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5tb3ZlVG8oY29uZmlnLngrciwgY29uZmlnLnkpO1xuICBjdHgubGluZVRvKGNvbmZpZy54K3IsIGNvbmZpZy55K2NvbmZpZy53aWR0aCk7XG4gIGN0eC5zdHJva2UoKTtcbiAgY3R4LmNsb3NlUGF0aCgpO1xufSIsInZhciBjb2xvcnMgPSByZXF1aXJlKCcuL2NvbG9ycycpO1xudmFyIGp1bmN0aW9uID0gcmVxdWlyZSgnLi9qdW5jdGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0eCwgY29uZmlnKSB7XG4gICAgY29uZmlnLmZpbGwgPSBjb2xvcnMuZ2V0Q29sb3IoJ2luZGlnbycsIGNvbmZpZy5vcGFjaXR5KTtcblxuICAgIGp1bmN0aW9uKGN0eCwgY29uZmlnKTtcblxuICAgIHZhciByID0gY29uZmlnLndpZHRoIC8gMjtcbiAgICB2YXIgY3ggPSBjb25maWcueCArIHI7XG4gICAgdmFyIGN5ID0gY29uZmlnLnkgKyByO1xuXG4gICAgdmFyIHgxID0gY3ggKyByICogTWF0aC5jb3MoTWF0aC5QSS80KTtcbiAgICB2YXIgeTEgPSBjeSArIHIgKiBNYXRoLnNpbihNYXRoLlBJLzQpO1xuICAgIHZhciB4MiA9IGN4ICsgciAqIE1hdGguY29zKE1hdGguUEkgKiAoNS80KSk7XG4gICAgdmFyIHkyID0gY3kgKyByICogTWF0aC5zaW4oTWF0aC5QSSAqICg1LzQpKTtcblxuICAgIC8vIGxpbmUgMVxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKHgxLCB5MSk7XG4gICAgY3R4LmxpbmVUbyh4MiwgeTIpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgICB4MSA9IGN4ICsgciAqIE1hdGguY29zKE1hdGguUEkgKiAoMy80KSk7XG4gICAgeTEgPSBjeSArIHIgKiBNYXRoLnNpbihNYXRoLlBJICogKDMvNCkpO1xuICAgIHgyID0gY3ggKyByICogTWF0aC5jb3MoTWF0aC5QSSAqICg3LzQpKTtcbiAgICB5MiA9IGN5ICsgciAqIE1hdGguc2luKE1hdGguUEkgKiAoNy80KSk7XG5cbiAgICAvLyBsaW5lIDJcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbyh4MSwgeTEpO1xuICAgIGN0eC5saW5lVG8oeDIsIHkyKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xufVxuIiwidmFyIGNvbG9ycyA9IHJlcXVpcmUoJy4vY29sb3JzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCBjb25maWcpIHtcbiAgICBjdHguZmlsbFN0eWxlID0gY29uZmlnLmZpbGwgfHwgY29sb3JzLmdldENvbG9yKCdiYXNlJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbmZpZy5zdHJva2UgfHwgY29sb3JzLmdldENvbG9yKCdibGFjaycsIGNvbmZpZy5vcGFjaXR5KTtcbiAgICBjdHgubGluZVdpZHRoID0gY29uZmlnLmxpbmVXaWR0aCB8fCAyO1xuXG4gICAgdXRpbHMublNpZGVkUGF0aChjdHgsIGNvbmZpZy54LCBjb25maWcueSwgY29uZmlnLndpZHRoLzIsIDQsIDQ1KTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG59IiwidmFyIGNvbG9ycyA9IHJlcXVpcmUoJy4vY29sb3JzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCBjb25maWcpIHtcbiAgICBjdHguZmlsbFN0eWxlID0gY29uZmlnLmZpbGwgfHwgY29sb3JzLmdldENvbG9yKCd5ZWxsb3cnLCBjb25maWcub3BhY2l0eSk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29uZmlnLnN0cm9rZSB8fCBjb2xvcnMuZ2V0Q29sb3IoJ2JsYWNrJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGN0eC5saW5lV2lkdGggPSBjb25maWcubGluZVdpZHRoIHx8IDI7XG5cbiAgICB1dGlscy5uU2lkZWRQYXRoKGN0eCwgY29uZmlnLngsIGNvbmZpZy55LCBjb25maWcud2lkdGgvMiwgMywgOTApO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbn0iLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9jb2xvcnMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHgsIGNvbmZpZykge1xuICAgIGlmKCAhY29uZmlnLnN0cm9rZSApIGNvbmZpZy5zdHJva2UgPSBjb2xvcnMuZ2V0Q29sb3IoJ2JsYWNrJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGlmKCAhY29uZmlnLmZpbGwgKSBjb25maWcuZmlsbCA9IGNvbG9ycy5nZXRDb2xvcignb3JhbmdlJywgY29uZmlnLm9wYWNpdHkpO1xuXG4gICAgdXRpbHMub3ZhbChjdHgsIGNvbmZpZyk7XG59IiwiZnVuY3Rpb24gb3ZhbChjdHgsIGNvbmZpZykge1xuICAgIGN0eC5maWxsU3R5bGUgPSBjb25maWcuZmlsbDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb25maWcuc3Ryb2tlO1xuICAgIGN0eC5saW5lV2lkdGggPSBjb25maWcubGluZVdpZHRoIHx8IDI7XG5cbiAgICBjb25maWcuaGVpZ2h0IC09IGNvbmZpZy53aWR0aCAqIC41O1xuICAgIGNvbmZpZy55ICs9IGNvbmZpZy5oZWlnaHQgLyAyO1xuXG4gICAgdmFyIGthcHBhID0gLjU1MjI4NDgsXG4gICAgICBveCA9IChjb25maWcud2lkdGggLyAyKSAqIGthcHBhLCAvLyBjb250cm9sIHBvaW50IG9mZnNldCBob3Jpem9udGFsXG4gICAgICBveSA9IChjb25maWcuaGVpZ2h0IC8gMikgKiBrYXBwYSwgLy8gY29udHJvbCBwb2ludCBvZmZzZXQgdmVydGljYWxcbiAgICAgIHhlID0gY29uZmlnLnggKyBjb25maWcud2lkdGgsICAgICAgICAgICAvLyB4LWVuZFxuICAgICAgeWUgPSBjb25maWcueSArIGNvbmZpZy5oZWlnaHQsICAgICAgICAgICAvLyB5LWVuZFxuICAgICAgeG0gPSBjb25maWcueCArIGNvbmZpZy53aWR0aCAvIDIsICAgICAgIC8vIHgtbWlkZGxlXG4gICAgICB5bSA9IGNvbmZpZy55ICsgY29uZmlnLmhlaWdodCAvIDI7ICAgICAgIC8vIHktbWlkZGxlXG5cbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbyhjb25maWcueCwgeW0pO1xuICAgIGN0eC5iZXppZXJDdXJ2ZVRvKGNvbmZpZy54LCB5bSAtIG95LCB4bSAtIG94LCBjb25maWcueSwgeG0sIGNvbmZpZy55KTtcbiAgICBjdHguYmV6aWVyQ3VydmVUbyh4bSArIG94LCBjb25maWcueSwgeGUsIHltIC0gb3ksIHhlLCB5bSk7XG4gICAgY3R4LmJlemllckN1cnZlVG8oeGUsIHltICsgb3ksIHhtICsgb3gsIHllLCB4bSwgeWUpO1xuICAgIGN0eC5iZXppZXJDdXJ2ZVRvKHhtIC0gb3gsIHllLCBjb25maWcueCwgeW0gKyBveSwgY29uZmlnLngsIHltKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbn1cblxuLyoqIGhlbHBlciBmb3IgdHJlYXRtZW50LCBzdXJmYWNlIHN0b3JhZ2UgYW5kIGdyb3VuZCB3YXRlciAqKi9cbmZ1bmN0aW9uIG5TaWRlZFBhdGgoY3R4LCBsZWZ0LCB0b3AsIHJhZGl1cywgc2lkZXMsIHN0YXJ0QW5nbGUpIHtcbiAgICAvLyB0aGlzIGlzIGRyYXdpbmcgZnJvbSBjZW50ZXJcbiAgICBsZWZ0ICs9IHJhZGl1cztcbiAgICB0b3AgKz0gcmFkaXVzO1xuXG4gICAgdmFyIGEgPSAoKE1hdGguUEkgKiAyKS9zaWRlcyk7XG4gICAgdmFyIHIgPSBzdGFydEFuZ2xlICogKE1hdGguUEkgLyAxODApLCB4LCB5O1xuXG4gICAgLy8gdGhpbmsgeW91IG5lZWQgdG8gYWRqdXN0IGJ5IHgsIHlcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgdmFyIHhzID0gbGVmdCArIChyYWRpdXMgKiBNYXRoLmNvcygtMSAqIHIpKTtcbiAgICB2YXIgeXMgPSB0b3AgKyAocmFkaXVzICogTWF0aC5zaW4oLTEgKiByKSk7XG4gICAgY3R4Lm1vdmVUbyh4cywgeXMpO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgc2lkZXM7IGkrKykge1xuICAgICAgICB4ID0gbGVmdCArIChyYWRpdXMgKiBNYXRoLmNvcyhhKmktcikpO1xuICAgICAgICB5ID0gdG9wICsgKHJhZGl1cyAqIE1hdGguc2luKGEqaS1yKSk7XG4gICAgICAgIGN0eC5saW5lVG8oeCwgeSk7XG4gICAgfVxuICAgIGN0eC5saW5lVG8oeHMsIHlzKTtcblxuICAgIC8vIG5vdCBwYWludGluZywgbGVhdmUgdGhpcyB0byB0aGUgZHJhdyBmdW5jdGlvblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgb3ZhbCA6IG92YWwsXG4gIG5TaWRlZFBhdGggOiBuU2lkZWRQYXRoXG59IiwidmFyIGNvbG9ycyA9IHJlcXVpcmUoJy4vY29sb3JzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3R4LCBjb25maWcpIHtcbiAgICBjdHguZmlsbFN0eWxlID0gY29uZmlnLmZpbGwgfHwgY29sb3JzLmdldENvbG9yKCdjeWFuJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbmZpZy5zdHJva2UgfHwgY29sb3JzLmdldENvbG9yKCdibGFjaycsIGNvbmZpZy5vcGFjaXR5KTtcbiAgICBjdHgubGluZVdpZHRoID0gY29uZmlnLmxpbmVXaWR0aCB8fCAyO1xuXG4gICAgdXRpbHMublNpZGVkUGF0aChjdHgsIGNvbmZpZy54LCBjb25maWcueSwgY29uZmlnLndpZHRoLzIsIDgsIDIyLjUpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5zdHJva2UoKTtcbn0iLCJ2YXIgY29sb3JzID0gcmVxdWlyZSgnLi9jb2xvcnMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHgsIGNvbmZpZykge1xuICAgIGlmKCAhY29uZmlnLnN0cm9rZSApIGNvbmZpZy5zdHJva2UgPSBjb2xvcnMuZ2V0Q29sb3IoJ2JsYWNrJywgY29uZmlnLm9wYWNpdHkpO1xuICAgIGlmKCAhY29uZmlnLmZpbGwgKSBjb25maWcuZmlsbCA9IGNvbG9ycy5nZXRDb2xvcignZ3JlZW4nLCBjb25maWcub3BhY2l0eSk7XG5cbiAgICB1dGlscy5vdmFsKGN0eCwgY29uZmlnKTtcbn0iLCJ2YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcblxuZnVuY3Rpb24gbG9hZE5ldHdvcmsoY2FsbGJhY2spIHtcbiAgdmFyIG5ldHdvcmssIHJlZ2lvbnM7XG4gIHZhciByZWdpb25zID0gZmFsc2U7XG4gIFxuICBmdW5jdGlvbiBkb25lKCkge1xuICAgIGlmKCBuZXR3b3JrICYmIHJlZ2lvbnMgKSB7XG4gICAgICBjYWxsYmFjayh7XG4gICAgICAgIG5ldHdvcmsgOiBuZXR3b3JrLFxuICAgICAgICByZWdpb25zIDogcmVnaW9uc1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHJlcXVlc3RcbiAgICAuZ2V0KCcvbmV0d29yay9nZXQnKVxuICAgIC5lbmQoZnVuY3Rpb24oZXJyLCByZXNwKXtcbiAgICAgIG5ldHdvcmtMb2FkZWQgPSB0cnVlO1xuXG4gICAgICBpZiggZXJyIHx8IHJlc3AuZXJyb3IgKSB7XG4gICAgICAgICAgYWxlcnQoJ1NlcnZlciBlcnJvciBsb2FkaW5nIG5ldHdvcmsgOignKTtcbiAgICAgICAgICByZXR1cm4gZG9uZSgpO1xuICAgICAgfVxuXG4gICAgICBuZXR3b3JrID0gcmVzcC5ib2R5IHx8IFtdXG5cbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcblxuICByZXF1ZXN0XG4gICAgLmdldCgnL3JlZ2lvbnMvZ2V0JylcbiAgICAuZW5kKGZ1bmN0aW9uKGVyciwgcmVzcCl7XG4gICAgICBuZXR3b3JrTG9hZGVkID0gdHJ1ZTtcblxuICAgICAgaWYoIGVyciB8fCByZXNwLmVycm9yICkge1xuICAgICAgICAgIGFsZXJ0KCdTZXJ2ZXIgZXJyb3IgbG9hZGluZyByZWdpb25zIDooJyk7XG4gICAgICAgICAgcmV0dXJuIGRvbmUoKTtcbiAgICAgIH1cblxuICAgICAgcmVnaW9ucyA9IHJlc3AuYm9keSB8fCBbXVxuXG4gICAgICBkb25lKCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEV4dHJhcyhwcm1uYW1lLCBjYWxsYmFjaykge1xuICByZXF1ZXN0XG4gICAgLmdldCgnL25ldHdvcmsvZXh0cmFzJylcbiAgICAucXVlcnkoe3BybW5hbWU6IHBybW5hbWV9KVxuICAgIC5lbmQoKGVyciwgcmVzcCkgPT4ge1xuICAgICAgY2FsbGJhY2socmVzcC5ib2R5KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0QWdncmVnYXRlKHF1ZXJ5LCBjYWxsYmFjaykge1xuICByZXF1ZXN0XG4gICAgLmdldCgnL3JlZ2lvbnMvYWdncmVnYXRlJylcbiAgICAucXVlcnkocXVlcnkpXG4gICAgLmVuZCgoZXJyLCByZXNwKSA9PiB7XG4gICAgICBjYWxsYmFjayhyZXNwLmJvZHkpO1xuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbG9hZE5ldHdvcmsgOiBsb2FkTmV0d29yayxcbiAgZ2V0RXh0cmFzIDogZ2V0RXh0cmFzLFxuICBnZXRBZ2dyZWdhdGUgOiBnZXRBZ2dyZWdhdGVcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZW5kZXJlciA9IHJlcXVpcmUoJy4vcmVuZGVyZXInKTtcblxuc2lnbWEudXRpbHMucGtnKCdzaWdtYS5jYW52YXMubm9kZXMnKTtcblxuLyoqXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSAgICAgICAgICAgICAgICAgICBub2RlICAgICBUaGUgbm9kZSBvYmplY3QuXG4gKiBAcGFyYW0gIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGNvbnRleHQgIFRoZSBjYW52YXMgY29udGV4dC5cbiAqIEBwYXJhbSAge2NvbmZpZ3VyYWJsZX0gICAgICAgICAgICAgc2V0dGluZ3MgVGhlIHNldHRpbmdzIGZ1bmN0aW9uLlxuICovXG5zaWdtYS5jYW52YXMubm9kZXMuSnVuY3Rpb24gPSBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnO1xuXG4gIHZhciBzID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddKjI7XG5cbiAgcmVuZGVyZXIuSnVuY3Rpb24oY29udGV4dCwge1xuICAgIHg6IG5vZGVbcHJlZml4ICsgJ3gnXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgeTogbm9kZVtwcmVmaXggKyAneSddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB3aWR0aDogcyxcbiAgICBoZWlnaHQ6IHNcbiAgfSk7XG59O1xuXG5zaWdtYS5jYW52YXMubm9kZXNbJ1Bvd2VyIFBsYW50J10gPSBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnO1xuXG4gIHZhciBzID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddKjI7XG5cbiAgcmVuZGVyZXJbJ1Bvd2VyIFBsYW50J10oY29udGV4dCwge1xuICAgIHg6IG5vZGVbcHJlZml4ICsgJ3gnXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgeTogbm9kZVtwcmVmaXggKyAneSddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB3aWR0aDogcyxcbiAgICBoZWlnaHQ6IHNcbiAgfSk7XG59O1xuXG5zaWdtYS5jYW52YXMubm9kZXNbJ1B1bXAgUGxhbnQnXSA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG5cbiAgdmFyIHMgPSBub2RlW3ByZWZpeCArICdzaXplJ10qMjtcblxuICByZW5kZXJlclsnUHVtcCBQbGFudCddKGNvbnRleHQsIHtcbiAgICB4OiBub2RlW3ByZWZpeCArICd4J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHk6IG5vZGVbcHJlZml4ICsgJ3knXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgd2lkdGg6IHMsXG4gICAgaGVpZ2h0OiBzXG4gIH0pO1xufTtcblxuc2lnbWEuY2FudmFzLm5vZGVzWydXYXRlciBUcmVhdG1lbnQnXSA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG5cbiAgdmFyIHMgPSBub2RlW3ByZWZpeCArICdzaXplJ10qMjtcblxuICByZW5kZXJlclsnV2F0ZXIgVHJlYXRtZW50J10oY29udGV4dCwge1xuICAgIHg6IG5vZGVbcHJlZml4ICsgJ3gnXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgeTogbm9kZVtwcmVmaXggKyAneSddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB3aWR0aDogcyxcbiAgICBoZWlnaHQ6IHNcbiAgfSk7XG59O1xuXG5zaWdtYS5jYW52YXMubm9kZXNbJ1N1cmZhY2UgU3RvcmFnZSddID0gZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJztcblxuICB2YXIgcyA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXSoyO1xuXG4gIHJlbmRlcmVyWydTdXJmYWNlIFN0b3JhZ2UnXShjb250ZXh0LCB7XG4gICAgeDogbm9kZVtwcmVmaXggKyAneCddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB5OiBub2RlW3ByZWZpeCArICd5J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHdpZHRoOiBzLFxuICAgIGhlaWdodDogc1xuICB9KTtcbn07XG5cbnNpZ21hLmNhbnZhcy5ub2Rlc1snR3JvdW5kd2F0ZXIgU3RvcmFnZSddID0gZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJztcblxuICB2YXIgcyA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXSoyO1xuXG4gIHJlbmRlcmVyWydHcm91bmR3YXRlciBTdG9yYWdlJ10oY29udGV4dCwge1xuICAgIHg6IG5vZGVbcHJlZml4ICsgJ3gnXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgeTogbm9kZVtwcmVmaXggKyAneSddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB3aWR0aDogcyxcbiAgICBoZWlnaHQ6IHNcbiAgfSk7XG59O1xuXG5zaWdtYS5jYW52YXMubm9kZXNbJ0FncmljdWx0dXJhbCBEZW1hbmQnXSA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG5cbiAgdmFyIHMgPSBub2RlW3ByZWZpeCArICdzaXplJ10qMjtcblxuICByZW5kZXJlclsnQWdyaWN1bHR1cmFsIERlbWFuZCddKGNvbnRleHQsIHtcbiAgICB4OiBub2RlW3ByZWZpeCArICd4J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHk6IG5vZGVbcHJlZml4ICsgJ3knXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgd2lkdGg6IHMsXG4gICAgaGVpZ2h0OiBzXG4gIH0pO1xufTtcblxuc2lnbWEuY2FudmFzLm5vZGVzWydVcmJhbiBEZW1hbmQnXSA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG5cbiAgdmFyIHMgPSBub2RlW3ByZWZpeCArICdzaXplJ10qMjtcblxuICByZW5kZXJlclsnVXJiYW4gRGVtYW5kJ10oY29udGV4dCwge1xuICAgIHg6IG5vZGVbcHJlZml4ICsgJ3gnXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgeTogbm9kZVtwcmVmaXggKyAneSddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB3aWR0aDogcyxcbiAgICBoZWlnaHQ6IHNcbiAgfSk7XG59O1xuXG5zaWdtYS5jYW52YXMubm9kZXMuU2luayA9IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQsIHNldHRpbmdzKSB7XG4gIHZhciBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJyc7XG5cbiAgdmFyIHMgPSBub2RlW3ByZWZpeCArICdzaXplJ10qMjtcblxuICByZW5kZXJlci5TaW5rKGNvbnRleHQsIHtcbiAgICB4OiBub2RlW3ByZWZpeCArICd4J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHk6IG5vZGVbcHJlZml4ICsgJ3knXS1ub2RlW3ByZWZpeCArICdzaXplJ10sXG4gICAgd2lkdGg6IHMsXG4gICAgaGVpZ2h0OiBzXG4gIH0pO1xufTtcblxuc2lnbWEuY2FudmFzLm5vZGVzWydOb24tU3RhbmRhcmQgRGVtYW5kJ10gPSBmdW5jdGlvbihub2RlLCBjb250ZXh0LCBzZXR0aW5ncykge1xuICB2YXIgcHJlZml4ID0gc2V0dGluZ3MoJ3ByZWZpeCcpIHx8ICcnO1xuXG4gIHZhciBzID0gbm9kZVtwcmVmaXggKyAnc2l6ZSddKjI7XG5cbiAgcmVuZGVyZXJbJ05vbi1TdGFuZGFyZCBEZW1hbmQnXShjb250ZXh0LCB7XG4gICAgeDogbm9kZVtwcmVmaXggKyAneCddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB5OiBub2RlW3ByZWZpeCArICd5J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHdpZHRoOiBzLFxuICAgIGhlaWdodDogc1xuICB9KTtcbn07XG5cbnNpZ21hLmNhbnZhcy5ub2Rlcy5XZXRsYW5kID0gZnVuY3Rpb24obm9kZSwgY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgdmFyIHByZWZpeCA9IHNldHRpbmdzKCdwcmVmaXgnKSB8fCAnJztcblxuICB2YXIgcyA9IG5vZGVbcHJlZml4ICsgJ3NpemUnXSoyO1xuXG5cbiAgcmVuZGVyZXIuV2V0bGFuZChjb250ZXh0LCB7XG4gICAgeDogbm9kZVtwcmVmaXggKyAneCddLW5vZGVbcHJlZml4ICsgJ3NpemUnXSxcbiAgICB5OiBub2RlW3ByZWZpeCArICd5J10tbm9kZVtwcmVmaXggKyAnc2l6ZSddLFxuICAgIHdpZHRoOiBzLFxuICAgIGhlaWdodDogc1xuICB9KTtcbn07XG5cblxuXG5zaWdtYS51dGlscy5wa2coJ3NpZ21hLmNhbnZhcy5lZGdlcycpO1xuXG4vKipcbiAqIFRoaXMgZWRnZSByZW5kZXJlciB3aWxsIGRpc3BsYXkgZWRnZXMgYXMgYXJyb3dzIGdvaW5nIGZyb20gdGhlIHNvdXJjZSBub2RlXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSAgICAgICAgICAgICAgICAgICBlZGdlICAgICAgICAgVGhlIGVkZ2Ugb2JqZWN0LlxuICogQHBhcmFtICB7b2JqZWN0fSAgICAgICAgICAgICAgICAgICBzb3VyY2Ugbm9kZSAgVGhlIGVkZ2Ugc291cmNlIG5vZGUuXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgICAgICAgICAgICAgICAgIHRhcmdldCBub2RlICBUaGUgZWRnZSB0YXJnZXQgbm9kZS5cbiAqIEBwYXJhbSAge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY29udGV4dCAgICAgIFRoZSBjYW52YXMgY29udGV4dC5cbiAqIEBwYXJhbSAge2NvbmZpZ3VyYWJsZX0gICAgICAgICAgICAgc2V0dGluZ3MgICAgIFRoZSBzZXR0aW5ncyBmdW5jdGlvbi5cbiAqL1xuc2lnbWEuY2FudmFzLmVkZ2VzLmN3biA9IGZ1bmN0aW9uKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0LCBjb250ZXh0LCBzZXR0aW5ncykge1xuXG4gIHZhciBjb2xvciA9IGVkZ2UuY29sb3IsXG4gICAgICBwcmVmaXggPSBzZXR0aW5ncygncHJlZml4JykgfHwgJycsXG4gICAgICBlZGdlQ29sb3IgPSBzZXR0aW5ncygnZWRnZUNvbG9yJyksXG4gICAgICBkZWZhdWx0Tm9kZUNvbG9yID0gc2V0dGluZ3MoJ2RlZmF1bHROb2RlQ29sb3InKSxcbiAgICAgIGRlZmF1bHRFZGdlQ29sb3IgPSBzZXR0aW5ncygnZGVmYXVsdEVkZ2VDb2xvcicpLFxuICAgICAgc2l6ZSA9IGVkZ2VbcHJlZml4ICsgJ3NpemUnXSB8fCAxLFxuICAgICAgdFNpemUgPSB0YXJnZXRbcHJlZml4ICsgJ3NpemUnXSxcbiAgICAgIHNYID0gc291cmNlW3ByZWZpeCArICd4J10sXG4gICAgICBzWSA9IHNvdXJjZVtwcmVmaXggKyAneSddLFxuICAgICAgdFggPSB0YXJnZXRbcHJlZml4ICsgJ3gnXSxcbiAgICAgIHRZID0gdGFyZ2V0W3ByZWZpeCArICd5J10sXG4gICAgICBhU2l6ZSA9IE1hdGgubWF4KHNpemUgKiAyLjUsIHNldHRpbmdzKCdtaW5BcnJvd1NpemUnKSksXG4gICAgICBkID0gTWF0aC5zcXJ0KE1hdGgucG93KHRYIC0gc1gsIDIpICsgTWF0aC5wb3codFkgLSBzWSwgMikpLFxuICAgICAgYVggPSBzWCArICh0WCAtIHNYKSAqIChkIC0gYVNpemUgLSB0U2l6ZSkgLyBkLFxuICAgICAgYVkgPSBzWSArICh0WSAtIHNZKSAqIChkIC0gYVNpemUgLSB0U2l6ZSkgLyBkLFxuICAgICAgdlggPSAodFggLSBzWCkgKiBhU2l6ZSAvIGQsXG4gICAgICB2WSA9ICh0WSAtIHNZKSAqIGFTaXplIC8gZDtcblxuICB2YXIgY29sb3IgPSByZW5kZXJlci5jb2xvcnMuc2FsbW9uO1xuICBpZiggZWRnZS5jYWx2aW4ucmVuZGVySW5mbyApIHtcbiAgICAgIGlmKCBlZGdlLmNhbHZpbi5yZW5kZXJJbmZvLnR5cGUgPT0gJ2Zsb3dUb1NpbmsnICkge1xuICAgICAgICBjb2xvciA9IHJlbmRlcmVyLmNvbG9ycy5saWdodEdyZXk7XG4gICAgICB9IGVsc2UgaWYoIGVkZ2UuY2FsdmluLnJlbmRlckluZm8udHlwZSA9PSAncmV0dXJuRmxvd0Zyb21EZW1hbmQnICkge1xuICAgICAgICAgIGNvbG9yID0gcmVuZGVyZXIuY29sb3JzLnJlZDtcbiAgICAgIH0gZWxzZSBpZiggZWRnZS5jYWx2aW4ucmVuZGVySW5mby50eXBlID09ICdnd1RvRGVtYW5kJyApIHtcbiAgICAgICAgICBjb2xvciA9IHJlbmRlcmVyLmNvbG9ycy5ibGFjaztcbiAgICAgIH0gZWxzZSBpZiggZWRnZS5jYWx2aW4ucmVuZGVySW5mby50eXBlID09ICdhcnRpZmljYWxSZWNoYXJnZScgKSB7XG4gICAgICAgICAgY29sb3IgPSByZW5kZXJlci5jb2xvcnMucHVycGxlO1xuICAgICAgfVxuICB9XG5cbiAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICBjb250ZXh0LmxpbmVXaWR0aCA9IHNpemU7XG4gIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gIGNvbnRleHQubW92ZVRvKHNYLCBzWSk7XG4gIGNvbnRleHQubGluZVRvKFxuICAgIGFYLFxuICAgIGFZXG4gICk7XG4gIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgY29udGV4dC5tb3ZlVG8oYVggKyB2WCwgYVkgKyB2WSk7XG4gIGNvbnRleHQubGluZVRvKGFYICsgdlkgKiAwLjgsIGFZIC0gdlggKiAwLjgpO1xuICBjb250ZXh0LmxpbmVUbyhhWCAtIHZZICogMC44LCBhWSArIHZYICogMC44KTtcbiAgY29udGV4dC5saW5lVG8oYVggKyB2WCwgYVkgKyB2WSk7XG4gIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gIGNvbnRleHQuZmlsbCgpO1xuXG59O1xuXG4iXX0=
