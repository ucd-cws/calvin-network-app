!function(a,b,c){var d=a.L,e={};e.version="0.7.3","object"==typeof module&&"object"==typeof module.exports?module.exports=e:"function"==typeof define&&define.amd&&define(e),e.noConflict=function(){return a.L=d,this},a.L=e,e.Util={extend:function(a){var b,c,d,e,f=Array.prototype.slice.call(arguments,1);for(c=0,d=f.length;d>c;c++){e=f[c]||{};for(b in e)e.hasOwnProperty(b)&&(a[b]=e[b])}return a},bind:function(a,b){var c=arguments.length>2?Array.prototype.slice.call(arguments,2):null;return function(){return a.apply(b,c||arguments)}},stamp:function(){var a=0,b="_leaflet_id";return function(c){return c[b]=c[b]||++a,c[b]}}(),invokeEach:function(a,b,c){var d,e;if("object"==typeof a){e=Array.prototype.slice.call(arguments,3);for(d in a)b.apply(c,[d,a[d]].concat(e));return!0}return!1},limitExecByInterval:function(a,b,c){var d,e;return function f(){var g=arguments;return d?void(e=!0):(d=!0,setTimeout(function(){d=!1,e&&(f.apply(c,g),e=!1)},b),void a.apply(c,g))}},falseFn:function(){return!1},formatNum:function(a,b){var c=Math.pow(10,b||5);return Math.round(a*c)/c},trim:function(a){return a.trim?a.trim():a.replace(/^\s+|\s+$/g,"")},splitWords:function(a){return e.Util.trim(a).split(/\s+/)},setOptions:function(a,b){return a.options=e.extend({},a.options,b),a.options},getParamString:function(a,b,c){var d=[];for(var e in a)d.push(encodeURIComponent(c?e.toUpperCase():e)+"="+encodeURIComponent(a[e]));return(b&&-1!==b.indexOf("?")?"&":"?")+d.join("&")},template:function(a,b){return a.replace(/\{ *([\w_]+) *\}/g,function(a,d){var e=b[d];if(e===c)throw new Error("No value provided for variable "+a);return"function"==typeof e&&(e=e(b)),e})},isArray:Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},emptyImageUrl:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="},function(){function b(b){var c,d,e=["webkit","moz","o","ms"];for(c=0;c<e.length&&!d;c++)d=a[e[c]+b];return d}function c(b){var c=+new Date,e=Math.max(0,16-(c-d));return d=c+e,a.setTimeout(b,e)}var d=0,f=a.requestAnimationFrame||b("RequestAnimationFrame")||c,g=a.cancelAnimationFrame||b("CancelAnimationFrame")||b("CancelRequestAnimationFrame")||function(b){a.clearTimeout(b)};e.Util.requestAnimFrame=function(b,d,g,h){return b=e.bind(b,d),g&&f===c?void b():f.call(a,b,h)},e.Util.cancelAnimFrame=function(b){b&&g.call(a,b)}}(),e.extend=e.Util.extend,e.bind=e.Util.bind,e.stamp=e.Util.stamp,e.setOptions=e.Util.setOptions,e.Class=function(){},e.Class.extend=function(a){var b=function(){this.initialize&&this.initialize.apply(this,arguments),this._initHooks&&this.callInitHooks()},c=function(){};c.prototype=this.prototype;var d=new c;d.constructor=b,b.prototype=d;for(var f in this)this.hasOwnProperty(f)&&"prototype"!==f&&(b[f]=this[f]);a.statics&&(e.extend(b,a.statics),delete a.statics),a.includes&&(e.Util.extend.apply(null,[d].concat(a.includes)),delete a.includes),a.options&&d.options&&(a.options=e.extend({},d.options,a.options)),e.extend(d,a),d._initHooks=[];var g=this;return b.__super__=g.prototype,d.callInitHooks=function(){if(!this._initHooksCalled){g.prototype.callInitHooks&&g.prototype.callInitHooks.call(this),this._initHooksCalled=!0;for(var a=0,b=d._initHooks.length;b>a;a++)d._initHooks[a].call(this)}},b},e.Class.include=function(a){e.extend(this.prototype,a)},e.Class.mergeOptions=function(a){e.extend(this.prototype.options,a)},e.Class.addInitHook=function(a){var b=Array.prototype.slice.call(arguments,1),c="function"==typeof a?a:function(){this[a].apply(this,b)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(c)};var f="_leaflet_events";e.Mixin={},e.Mixin.Events={addEventListener:function(a,b,c){if(e.Util.invokeEach(a,this.addEventListener,this,b,c))return this;var d,g,h,i,j,k,l,m=this[f]=this[f]||{},n=c&&c!==this&&e.stamp(c);for(a=e.Util.splitWords(a),d=0,g=a.length;g>d;d++)h={action:b,context:c||this},i=a[d],n?(j=i+"_idx",k=j+"_len",l=m[j]=m[j]||{},l[n]||(l[n]=[],m[k]=(m[k]||0)+1),l[n].push(h)):(m[i]=m[i]||[],m[i].push(h));return this},hasEventListeners:function(a){var b=this[f];return!!b&&(a in b&&b[a].length>0||a+"_idx"in b&&b[a+"_idx_len"]>0)},removeEventListener:function(a,b,c){if(!this[f])return this;if(!a)return this.clearAllEventListeners();if(e.Util.invokeEach(a,this.removeEventListener,this,b,c))return this;var d,g,h,i,j,k,l,m,n,o=this[f],p=c&&c!==this&&e.stamp(c);for(a=e.Util.splitWords(a),d=0,g=a.length;g>d;d++)if(h=a[d],k=h+"_idx",l=k+"_len",m=o[k],b){if(i=p&&m?m[p]:o[h]){for(j=i.length-1;j>=0;j--)i[j].action!==b||c&&i[j].context!==c||(n=i.splice(j,1),n[0].action=e.Util.falseFn);c&&m&&0===i.length&&(delete m[p],o[l]--)}}else delete o[h],delete o[k],delete o[l];return this},clearAllEventListeners:function(){return delete this[f],this},fireEvent:function(a,b){if(!this.hasEventListeners(a))return this;var c,d,g,h,i,j=e.Util.extend({},b,{type:a,target:this}),k=this[f];if(k[a])for(c=k[a].slice(),d=0,g=c.length;g>d;d++)c[d].action.call(c[d].context,j);h=k[a+"_idx"];for(i in h)if(c=h[i].slice())for(d=0,g=c.length;g>d;d++)c[d].action.call(c[d].context,j);return this},addOneTimeEventListener:function(a,b,c){if(e.Util.invokeEach(a,this.addOneTimeEventListener,this,b,c))return this;var d=e.bind(function(){this.removeEventListener(a,b,c).removeEventListener(a,d,c)},this);return this.addEventListener(a,b,c).addEventListener(a,d,c)}},e.Mixin.Events.on=e.Mixin.Events.addEventListener,e.Mixin.Events.off=e.Mixin.Events.removeEventListener,e.Mixin.Events.once=e.Mixin.Events.addOneTimeEventListener,e.Mixin.Events.fire=e.Mixin.Events.fireEvent,function(){var d="ActiveXObject"in a,f=d&&!b.addEventListener,g=navigator.userAgent.toLowerCase(),h=-1!==g.indexOf("webkit"),i=-1!==g.indexOf("chrome"),j=-1!==g.indexOf("phantom"),k=-1!==g.indexOf("android"),l=-1!==g.search("android [23]"),m=-1!==g.indexOf("gecko"),n=typeof orientation!=c+"",o=a.navigator&&a.navigator.msPointerEnabled&&a.navigator.msMaxTouchPoints&&!a.PointerEvent,p=a.PointerEvent&&a.navigator.pointerEnabled&&a.navigator.maxTouchPoints||o,q="devicePixelRatio"in a&&a.devicePixelRatio>1||"matchMedia"in a&&a.matchMedia("(min-resolution:144dpi)")&&a.matchMedia("(min-resolution:144dpi)").matches,r=b.documentElement,s=d&&"transition"in r.style,t="WebKitCSSMatrix"in a&&"m11"in new a.WebKitCSSMatrix&&!l,u="MozPerspective"in r.style,v="OTransition"in r.style,w=!a.L_DISABLE_3D&&(s||t||u||v)&&!j,x=!a.L_NO_TOUCH&&!j&&function(){var a="ontouchstart";if(p||a in r)return!0;var c=b.createElement("div"),d=!1;return c.setAttribute?(c.setAttribute(a,"return;"),"function"==typeof c[a]&&(d=!0),c.removeAttribute(a),c=null,d):!1}();e.Browser={ie:d,ielt9:f,webkit:h,gecko:m&&!h&&!a.opera&&!d,android:k,android23:l,chrome:i,ie3d:s,webkit3d:t,gecko3d:u,opera3d:v,any3d:w,mobile:n,mobileWebkit:n&&h,mobileWebkit3d:n&&t,mobileOpera:n&&a.opera,touch:x,msPointer:o,pointer:p,retina:q}}(),e.Point=function(a,b,c){this.x=c?Math.round(a):a,this.y=c?Math.round(b):b},e.Point.prototype={clone:function(){return new e.Point(this.x,this.y)},add:function(a){return this.clone()._add(e.point(a))},_add:function(a){return this.x+=a.x,this.y+=a.y,this},subtract:function(a){return this.clone()._subtract(e.point(a))},_subtract:function(a){return this.x-=a.x,this.y-=a.y,this},divideBy:function(a){return this.clone()._divideBy(a)},_divideBy:function(a){return this.x/=a,this.y/=a,this},multiplyBy:function(a){return this.clone()._multiplyBy(a)},_multiplyBy:function(a){return this.x*=a,this.y*=a,this},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},distanceTo:function(a){a=e.point(a);var b=a.x-this.x,c=a.y-this.y;return Math.sqrt(b*b+c*c)},equals:function(a){return a=e.point(a),a.x===this.x&&a.y===this.y},contains:function(a){return a=e.point(a),Math.abs(a.x)<=Math.abs(this.x)&&Math.abs(a.y)<=Math.abs(this.y)},toString:function(){return"Point("+e.Util.formatNum(this.x)+", "+e.Util.formatNum(this.y)+")"}},e.point=function(a,b,d){return a instanceof e.Point?a:e.Util.isArray(a)?new e.Point(a[0],a[1]):a===c||null===a?a:new e.Point(a,b,d)},e.Bounds=function(a,b){if(a)for(var c=b?[a,b]:a,d=0,e=c.length;e>d;d++)this.extend(c[d])},e.Bounds.prototype={extend:function(a){return a=e.point(a),this.min||this.max?(this.min.x=Math.min(a.x,this.min.x),this.max.x=Math.max(a.x,this.max.x),this.min.y=Math.min(a.y,this.min.y),this.max.y=Math.max(a.y,this.max.y)):(this.min=a.clone(),this.max=a.clone()),this},getCenter:function(a){return new e.Point((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,a)},getBottomLeft:function(){return new e.Point(this.min.x,this.max.y)},getTopRight:function(){return new e.Point(this.max.x,this.min.y)},getSize:function(){return this.max.subtract(this.min)},contains:function(a){var b,c;return a="number"==typeof a[0]||a instanceof e.Point?e.point(a):e.bounds(a),a instanceof e.Bounds?(b=a.min,c=a.max):b=c=a,b.x>=this.min.x&&c.x<=this.max.x&&b.y>=this.min.y&&c.y<=this.max.y},intersects:function(a){a=e.bounds(a);var b=this.min,c=this.max,d=a.min,f=a.max,g=f.x>=b.x&&d.x<=c.x,h=f.y>=b.y&&d.y<=c.y;return g&&h},isValid:function(){return!(!this.min||!this.max)}},e.bounds=function(a,b){return!a||a instanceof e.Bounds?a:new e.Bounds(a,b)},e.Transformation=function(a,b,c,d){this._a=a,this._b=b,this._c=c,this._d=d},e.Transformation.prototype={transform:function(a,b){return this._transform(a.clone(),b)},_transform:function(a,b){return b=b||1,a.x=b*(this._a*a.x+this._b),a.y=b*(this._c*a.y+this._d),a},untransform:function(a,b){return b=b||1,new e.Point((a.x/b-this._b)/this._a,(a.y/b-this._d)/this._c)}},e.DomUtil={get:function(a){return"string"==typeof a?b.getElementById(a):a},getStyle:function(a,c){var d=a.style[c];if(!d&&a.currentStyle&&(d=a.currentStyle[c]),(!d||"auto"===d)&&b.defaultView){var e=b.defaultView.getComputedStyle(a,null);d=e?e[c]:null}return"auto"===d?null:d},getViewportOffset:function(a){var c,d=0,f=0,g=a,h=b.body,i=b.documentElement;do{if(d+=g.offsetTop||0,f+=g.offsetLeft||0,d+=parseInt(e.DomUtil.getStyle(g,"borderTopWidth"),10)||0,f+=parseInt(e.DomUtil.getStyle(g,"borderLeftWidth"),10)||0,c=e.DomUtil.getStyle(g,"position"),g.offsetParent===h&&"absolute"===c)break;if("fixed"===c){d+=h.scrollTop||i.scrollTop||0,f+=h.scrollLeft||i.scrollLeft||0;break}if("relative"===c&&!g.offsetLeft){var j=e.DomUtil.getStyle(g,"width"),k=e.DomUtil.getStyle(g,"max-width"),l=g.getBoundingClientRect();("none"!==j||"none"!==k)&&(f+=l.left+g.clientLeft),d+=l.top+(h.scrollTop||i.scrollTop||0);break}g=g.offsetParent}while(g);g=a;do{if(g===h)break;d-=g.scrollTop||0,f-=g.scrollLeft||0,g=g.parentNode}while(g);return new e.Point(f,d)},documentIsLtr:function(){return e.DomUtil._docIsLtrCached||(e.DomUtil._docIsLtrCached=!0,e.DomUtil._docIsLtr="ltr"===e.DomUtil.getStyle(b.body,"direction")),e.DomUtil._docIsLtr},create:function(a,c,d){var e=b.createElement(a);return e.className=c,d&&d.appendChild(e),e},hasClass:function(a,b){if(a.classList!==c)return a.classList.contains(b);var d=e.DomUtil._getClass(a);return d.length>0&&new RegExp("(^|\\s)"+b+"(\\s|$)").test(d)},addClass:function(a,b){if(a.classList!==c)for(var d=e.Util.splitWords(b),f=0,g=d.length;g>f;f++)a.classList.add(d[f]);else if(!e.DomUtil.hasClass(a,b)){var h=e.DomUtil._getClass(a);e.DomUtil._setClass(a,(h?h+" ":"")+b)}},removeClass:function(a,b){a.classList!==c?a.classList.remove(b):e.DomUtil._setClass(a,e.Util.trim((" "+e.DomUtil._getClass(a)+" ").replace(" "+b+" "," ")))},_setClass:function(a,b){a.className.baseVal===c?a.className=b:a.className.baseVal=b},_getClass:function(a){return a.className.baseVal===c?a.className:a.className.baseVal},setOpacity:function(a,b){if("opacity"in a.style)a.style.opacity=b;else if("filter"in a.style){var c=!1,d="DXImageTransform.Microsoft.Alpha";try{c=a.filters.item(d)}catch(e){if(1===b)return}b=Math.round(100*b),c?(c.Enabled=100!==b,c.Opacity=b):a.style.filter+=" progid:"+d+"(opacity="+b+")"}},testProp:function(a){for(var c=b.documentElement.style,d=0;d<a.length;d++)if(a[d]in c)return a[d];return!1},getTranslateString:function(a){var b=e.Browser.webkit3d,c="translate"+(b?"3d":"")+"(",d=(b?",0":"")+")";return c+a.x+"px,"+a.y+"px"+d},getScaleString:function(a,b){var c=e.DomUtil.getTranslateString(b.add(b.multiplyBy(-1*a))),d=" scale("+a+") ";return c+d},setPosition:function(a,b,c){a._leaflet_pos=b,!c&&e.Browser.any3d?a.style[e.DomUtil.TRANSFORM]=e.DomUtil.getTranslateString(b):(a.style.left=b.x+"px",a.style.top=b.y+"px")},getPosition:function(a){return a._leaflet_pos}},e.DomUtil.TRANSFORM=e.DomUtil.testProp(["transform","WebkitTransform","OTransform","MozTransform","msTransform"]),e.DomUtil.TRANSITION=e.DomUtil.testProp(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),e.DomUtil.TRANSITION_END="webkitTransition"===e.DomUtil.TRANSITION||"OTransition"===e.DomUtil.TRANSITION?e.DomUtil.TRANSITION+"End":"transitionend",function(){if("onselectstart"in b)e.extend(e.DomUtil,{disableTextSelection:function(){e.DomEvent.on(a,"selectstart",e.DomEvent.preventDefault)},enableTextSelection:function(){e.DomEvent.off(a,"selectstart",e.DomEvent.preventDefault)}});else{var c=e.DomUtil.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);e.extend(e.DomUtil,{disableTextSelection:function(){if(c){var a=b.documentElement.style;this._userSelect=a[c],a[c]="none"}},enableTextSelection:function(){c&&(b.documentElement.style[c]=this._userSelect,delete this._userSelect)}})}e.extend(e.DomUtil,{disableImageDrag:function(){e.DomEvent.on(a,"dragstart",e.DomEvent.preventDefault)},enableImageDrag:function(){e.DomEvent.off(a,"dragstart",e.DomEvent.preventDefault)}})}(),e.LatLng=function(a,b,d){if(a=parseFloat(a),b=parseFloat(b),isNaN(a)||isNaN(b))throw new Error("Invalid LatLng object: ("+a+", "+b+")");this.lat=a,this.lng=b,d!==c&&(this.alt=parseFloat(d))},e.extend(e.LatLng,{DEG_TO_RAD:Math.PI/180,RAD_TO_DEG:180/Math.PI,MAX_MARGIN:1e-9}),e.LatLng.prototype={equals:function(a){if(!a)return!1;a=e.latLng(a);var b=Math.max(Math.abs(this.lat-a.lat),Math.abs(this.lng-a.lng));return b<=e.LatLng.MAX_MARGIN},toString:function(a){return"LatLng("+e.Util.formatNum(this.lat,a)+", "+e.Util.formatNum(this.lng,a)+")"},distanceTo:function(a){a=e.latLng(a);var b=6378137,c=e.LatLng.DEG_TO_RAD,d=(a.lat-this.lat)*c,f=(a.lng-this.lng)*c,g=this.lat*c,h=a.lat*c,i=Math.sin(d/2),j=Math.sin(f/2),k=i*i+j*j*Math.cos(g)*Math.cos(h);return 2*b*Math.atan2(Math.sqrt(k),Math.sqrt(1-k))},wrap:function(a,b){var c=this.lng;return a=a||-180,b=b||180,c=(c+b)%(b-a)+(a>c||c===b?b:a),new e.LatLng(this.lat,c)}},e.latLng=function(a,b){return a instanceof e.LatLng?a:e.Util.isArray(a)?"number"==typeof a[0]||"string"==typeof a[0]?new e.LatLng(a[0],a[1],a[2]):null:a===c||null===a?a:"object"==typeof a&&"lat"in a?new e.LatLng(a.lat,"lng"in a?a.lng:a.lon):b===c?null:new e.LatLng(a,b)},e.LatLngBounds=function(a,b){if(a)for(var c=b?[a,b]:a,d=0,e=c.length;e>d;d++)this.extend(c[d])},e.LatLngBounds.prototype={extend:function(a){if(!a)return this;var b=e.latLng(a);return a=null!==b?b:e.latLngBounds(a),a instanceof e.LatLng?this._southWest||this._northEast?(this._southWest.lat=Math.min(a.lat,this._southWest.lat),this._southWest.lng=Math.min(a.lng,this._southWest.lng),this._northEast.lat=Math.max(a.lat,this._northEast.lat),this._northEast.lng=Math.max(a.lng,this._northEast.lng)):(this._southWest=new e.LatLng(a.lat,a.lng),this._northEast=new e.LatLng(a.lat,a.lng)):a instanceof e.LatLngBounds&&(this.extend(a._southWest),this.extend(a._northEast)),this},pad:function(a){var b=this._southWest,c=this._northEast,d=Math.abs(b.lat-c.lat)*a,f=Math.abs(b.lng-c.lng)*a;return new e.LatLngBounds(new e.LatLng(b.lat-d,b.lng-f),new e.LatLng(c.lat+d,c.lng+f))},getCenter:function(){return new e.LatLng((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new e.LatLng(this.getNorth(),this.getWest())},getSouthEast:function(){return new e.LatLng(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(a){a="number"==typeof a[0]||a instanceof e.LatLng?e.latLng(a):e.latLngBounds(a);var b,c,d=this._southWest,f=this._northEast;return a instanceof e.LatLngBounds?(b=a.getSouthWest(),c=a.getNorthEast()):b=c=a,b.lat>=d.lat&&c.lat<=f.lat&&b.lng>=d.lng&&c.lng<=f.lng},intersects:function(a){a=e.latLngBounds(a);var b=this._southWest,c=this._northEast,d=a.getSouthWest(),f=a.getNorthEast(),g=f.lat>=b.lat&&d.lat<=c.lat,h=f.lng>=b.lng&&d.lng<=c.lng;return g&&h},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(a){return a?(a=e.latLngBounds(a),this._southWest.equals(a.getSouthWest())&&this._northEast.equals(a.getNorthEast())):!1},isValid:function(){return!(!this._southWest||!this._northEast)}},e.latLngBounds=function(a,b){return!a||a instanceof e.LatLngBounds?a:new e.LatLngBounds(a,b)},e.Projection={},e.Projection.SphericalMercator={MAX_LATITUDE:85.0511287798,project:function(a){var b=e.LatLng.DEG_TO_RAD,c=this.MAX_LATITUDE,d=Math.max(Math.min(c,a.lat),-c),f=a.lng*b,g=d*b;return g=Math.log(Math.tan(Math.PI/4+g/2)),new e.Point(f,g)},unproject:function(a){var b=e.LatLng.RAD_TO_DEG,c=a.x*b,d=(2*Math.atan(Math.exp(a.y))-Math.PI/2)*b;return new e.LatLng(d,c)}},e.Projection.LonLat={project:function(a){return new e.Point(a.lng,a.lat)},unproject:function(a){return new e.LatLng(a.y,a.x)}},e.CRS={latLngToPoint:function(a,b){var c=this.projection.project(a),d=this.scale(b);return this.transformation._transform(c,d)},pointToLatLng:function(a,b){var c=this.scale(b),d=this.transformation.untransform(a,c);return this.projection.unproject(d)},project:function(a){return this.projection.project(a)},scale:function(a){return 256*Math.pow(2,a)},getSize:function(a){var b=this.scale(a);return e.point(b,b)}},e.CRS.Simple=e.extend({},e.CRS,{projection:e.Projection.LonLat,transformation:new e.Transformation(1,0,-1,0),scale:function(a){return Math.pow(2,a)}}),e.CRS.EPSG3857=e.extend({},e.CRS,{code:"EPSG:3857",projection:e.Projection.SphericalMercator,transformation:new e.Transformation(.5/Math.PI,.5,-.5/Math.PI,.5),project:function(a){var b=this.projection.project(a),c=6378137;return b.multiplyBy(c)}}),e.CRS.EPSG900913=e.extend({},e.CRS.EPSG3857,{code:"EPSG:900913"}),e.CRS.EPSG4326=e.extend({},e.CRS,{code:"EPSG:4326",projection:e.Projection.LonLat,transformation:new e.Transformation(1/360,.5,-1/360,.5)}),e.Map=e.Class.extend({includes:e.Mixin.Events,options:{crs:e.CRS.EPSG3857,fadeAnimation:e.DomUtil.TRANSITION&&!e.Browser.android23,trackResize:!0,markerZoomAnimation:e.DomUtil.TRANSITION&&e.Browser.any3d},initialize:function(a,b){b=e.setOptions(this,b),this._initContainer(a),this._initLayout(),this._onResize=e.bind(this._onResize,this),this._initEvents(),b.maxBounds&&this.setMaxBounds(b.maxBounds),b.center&&b.zoom!==c&&this.setView(e.latLng(b.center),b.zoom,{reset:!0}),this._handlers=[],this._layers={},this._zoomBoundLayers={},this._tileLayersNum=0,this.callInitHooks(),this._addLayers(b.layers)},setView:function(a,b){return b=b===c?this.getZoom():b,this._resetView(e.latLng(a),this._limitZoom(b)),this},setZoom:function(a,b){return this._loaded?this.setView(this.getCenter(),a,{zoom:b}):(this._zoom=this._limitZoom(a),this)},zoomIn:function(a,b){return this.setZoom(this._zoom+(a||1),b)},zoomOut:function(a,b){return this.setZoom(this._zoom-(a||1),b)},setZoomAround:function(a,b,c){var d=this.getZoomScale(b),f=this.getSize().divideBy(2),g=a instanceof e.Point?a:this.latLngToContainerPoint(a),h=g.subtract(f).multiplyBy(1-1/d),i=this.containerPointToLatLng(f.add(h));return this.setView(i,b,{zoom:c})},fitBounds:function(a,b){b=b||{},a=a.getBounds?a.getBounds():e.latLngBounds(a);var c=e.point(b.paddingTopLeft||b.padding||[0,0]),d=e.point(b.paddingBottomRight||b.padding||[0,0]),f=this.getBoundsZoom(a,!1,c.add(d)),g=d.subtract(c).divideBy(2),h=this.project(a.getSouthWest(),f),i=this.project(a.getNorthEast(),f),j=this.unproject(h.add(i).divideBy(2).add(g),f);return f=b&&b.maxZoom?Math.min(b.maxZoom,f):f,this.setView(j,f,b)},fitWorld:function(a){return this.fitBounds([[-90,-180],[90,180]],a)},panTo:function(a,b){return this.setView(a,this._zoom,{pan:b})},panBy:function(a){return this.fire("movestart"),this._rawPanBy(e.point(a)),this.fire("move"),this.fire("moveend")},setMaxBounds:function(a){return a=e.latLngBounds(a),this.options.maxBounds=a,a?(this._loaded&&this._panInsideMaxBounds(),this.on("moveend",this._panInsideMaxBounds,this)):this.off("moveend",this._panInsideMaxBounds,this)},panInsideBounds:function(a,b){var c=this.getCenter(),d=this._limitCenter(c,this._zoom,a);return c.equals(d)?this:this.panTo(d,b)},addLayer:function(a){var b=e.stamp(a);return this._layers[b]?this:(this._layers[b]=a,!a.options||isNaN(a.options.maxZoom)&&isNaN(a.options.minZoom)||(this._zoomBoundLayers[b]=a,this._updateZoomLevels()),this.options.zoomAnimation&&e.TileLayer&&a instanceof e.TileLayer&&(this._tileLayersNum++,this._tileLayersToLoad++,a.on("load",this._onTileLayerLoad,this)),this._loaded&&this._layerAdd(a),this)},removeLayer:function(a){var b=e.stamp(a);return this._layers[b]?(this._loaded&&a.onRemove(this),delete this._layers[b],this._loaded&&this.fire("layerremove",{layer:a}),this._zoomBoundLayers[b]&&(delete this._zoomBoundLayers[b],this._updateZoomLevels()),this.options.zoomAnimation&&e.TileLayer&&a instanceof e.TileLayer&&(this._tileLayersNum--,this._tileLayersToLoad--,a.off("load",this._onTileLayerLoad,this)),this):this},hasLayer:function(a){return a?e.stamp(a)in this._layers:!1},eachLayer:function(a,b){for(var c in this._layers)a.call(b,this._layers[c]);return this},invalidateSize:function(a){if(!this._loaded)return this;a=e.extend({animate:!1,pan:!0},a===!0?{animate:!0}:a);var b=this.getSize();this._sizeChanged=!0,this._initialCenter=null;var c=this.getSize(),d=b.divideBy(2).round(),f=c.divideBy(2).round(),g=d.subtract(f);return g.x||g.y?(a.animate&&a.pan?this.panBy(g):(a.pan&&this._rawPanBy(g),this.fire("move"),a.debounceMoveend?(clearTimeout(this._sizeTimer),this._sizeTimer=setTimeout(e.bind(this.fire,this,"moveend"),200)):this.fire("moveend")),this.fire("resize",{oldSize:b,newSize:c})):this},addHandler:function(a,b){if(!b)return this;var c=this[a]=new b(this);return this._handlers.push(c),this.options[a]&&c.enable(),this},remove:function(){this._loaded&&this.fire("unload"),this._initEvents("off");try{delete this._container._leaflet}catch(a){this._container._leaflet=c}return this._clearPanes(),this._clearControlPos&&this._clearControlPos(),this._clearHandlers(),this},getCenter:function(){return this._checkIfLoaded(),this._initialCenter&&!this._moved()?this._initialCenter:this.layerPointToLatLng(this._getCenterLayerPoint())},getZoom:function(){return this._zoom},getBounds:function(){var a=this.getPixelBounds(),b=this.unproject(a.getBottomLeft()),c=this.unproject(a.getTopRight());return new e.LatLngBounds(b,c)},getMinZoom:function(){return this.options.minZoom===c?this._layersMinZoom===c?0:this._layersMinZoom:this.options.minZoom},getMaxZoom:function(){return this.options.maxZoom===c?this._layersMaxZoom===c?1/0:this._layersMaxZoom:this.options.maxZoom},getBoundsZoom:function(a,b,c){a=e.latLngBounds(a);var d,f=this.getMinZoom()-(b?1:0),g=this.getMaxZoom(),h=this.getSize(),i=a.getNorthWest(),j=a.getSouthEast(),k=!0;c=e.point(c||[0,0]);do f++,d=this.project(j,f).subtract(this.project(i,f)).add(c),k=b?d.x<h.x||d.y<h.y:h.contains(d);while(k&&g>=f);return k&&b?null:b?f:f-1},getSize:function(){return(!this._size||this._sizeChanged)&&(this._size=new e.Point(this._container.clientWidth,this._container.clientHeight),this._sizeChanged=!1),this._size.clone()},getPixelBounds:function(){var a=this._getTopLeftPoint();return new e.Bounds(a,a.add(this.getSize()))},getPixelOrigin:function(){return this._checkIfLoaded(),this._initialTopLeftPoint},getPanes:function(){return this._panes},getContainer:function(){return this._container},getZoomScale:function(a){var b=this.options.crs;return b.scale(a)/b.scale(this._zoom)},getScaleZoom:function(a){return this._zoom+Math.log(a)/Math.LN2},project:function(a,b){return b=b===c?this._zoom:b,this.options.crs.latLngToPoint(e.latLng(a),b)},unproject:function(a,b){return b=b===c?this._zoom:b,this.options.crs.pointToLatLng(e.point(a),b)},layerPointToLatLng:function(a){var b=e.point(a).add(this.getPixelOrigin());return this.unproject(b)},latLngToLayerPoint:function(a){var b=this.project(e.latLng(a))._round();return b._subtract(this.getPixelOrigin())},containerPointToLayerPoint:function(a){return e.point(a).subtract(this._getMapPanePos())},layerPointToContainerPoint:function(a){return e.point(a).add(this._getMapPanePos())},containerPointToLatLng:function(a){var b=this.containerPointToLayerPoint(e.point(a));return this.layerPointToLatLng(b)},latLngToContainerPoint:function(a){return this.layerPointToContainerPoint(this.latLngToLayerPoint(e.latLng(a)))},mouseEventToContainerPoint:function(a){return e.DomEvent.getMousePosition(a,this._container)},mouseEventToLayerPoint:function(a){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(a))},mouseEventToLatLng:function(a){return this.layerPointToLatLng(this.mouseEventToLayerPoint(a))},_initContainer:function(a){var b=this._container=e.DomUtil.get(a);if(!b)throw new Error("Map container not found.");if(b._leaflet)throw new Error("Map container is already initialized.");b._leaflet=!0},_initLayout:function(){var a=this._container;e.DomUtil.addClass(a,"leaflet-container"+(e.Browser.touch?" leaflet-touch":"")+(e.Browser.retina?" leaflet-retina":"")+(e.Browser.ielt9?" leaflet-oldie":"")+(this.options.fadeAnimation?" leaflet-fade-anim":""));var b=e.DomUtil.getStyle(a,"position");"absolute"!==b&&"relative"!==b&&"fixed"!==b&&(a.style.position="relative"),this._initPanes(),this._initControlPos&&this._initControlPos()},_initPanes:function(){var a=this._panes={};this._mapPane=a.mapPane=this._createPane("leaflet-map-pane",this._container),this._tilePane=a.tilePane=this._createPane("leaflet-tile-pane",this._mapPane),a.objectsPane=this._createPane("leaflet-objects-pane",this._mapPane),a.shadowPane=this._createPane("leaflet-shadow-pane"),a.overlayPane=this._createPane("leaflet-overlay-pane"),a.markerPane=this._createPane("leaflet-marker-pane"),a.popupPane=this._createPane("leaflet-popup-pane");var b=" leaflet-zoom-hide";this.options.markerZoomAnimation||(e.DomUtil.addClass(a.markerPane,b),e.DomUtil.addClass(a.shadowPane,b),e.DomUtil.addClass(a.popupPane,b))},_createPane:function(a,b){return e.DomUtil.create("div",a,b||this._panes.objectsPane)},_clearPanes:function(){this._container.removeChild(this._mapPane)},_addLayers:function(a){a=a?e.Util.isArray(a)?a:[a]:[];for(var b=0,c=a.length;c>b;b++)this.addLayer(a[b])},_resetView:function(a,b,c,d){var f=this._zoom!==b;d||(this.fire("movestart"),f&&this.fire("zoomstart")),this._zoom=b,this._initialCenter=a,this._initialTopLeftPoint=this._getNewTopLeftPoint(a),c?this._initialTopLeftPoint._add(this._getMapPanePos()):e.DomUtil.setPosition(this._mapPane,new e.Point(0,0)),this._tileLayersToLoad=this._tileLayersNum;var g=!this._loaded;this._loaded=!0,this.fire("viewreset",{hard:!c}),g&&(this.fire("load"),this.eachLayer(this._layerAdd,this)),this.fire("move"),(f||d)&&this.fire("zoomend"),this.fire("moveend",{hard:!c})},_rawPanBy:function(a){e.DomUtil.setPosition(this._mapPane,this._getMapPanePos().subtract(a))},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom()},_updateZoomLevels:function(){var a,b=1/0,d=-1/0,e=this._getZoomSpan();for(a in this._zoomBoundLayers){var f=this._zoomBoundLayers[a];isNaN(f.options.minZoom)||(b=Math.min(b,f.options.minZoom)),isNaN(f.options.maxZoom)||(d=Math.max(d,f.options.maxZoom))}a===c?this._layersMaxZoom=this._layersMinZoom=c:(this._layersMaxZoom=d,this._layersMinZoom=b),e!==this._getZoomSpan()&&this.fire("zoomlevelschange")},_panInsideMaxBounds:function(){this.panInsideBounds(this.options.maxBounds)},_checkIfLoaded:function(){if(!this._loaded)throw new Error("Set map center and zoom first.")},_initEvents:function(b){if(e.DomEvent){b=b||"on",e.DomEvent[b](this._container,"click",this._onMouseClick,this);var c,d,f=["dblclick","mousedown","mouseup","mouseenter","mouseleave","mousemove","contextmenu"];for(c=0,d=f.length;d>c;c++)e.DomEvent[b](this._container,f[c],this._fireMouseEvent,this);this.options.trackResize&&e.DomEvent[b](a,"resize",this._onResize,this)}},_onResize:function(){e.Util.cancelAnimFrame(this._resizeRequest),this._resizeRequest=e.Util.requestAnimFrame(function(){this.invalidateSize({debounceMoveend:!0})},this,!1,this._container)},_onMouseClick:function(a){!this._loaded||!a._simulated&&(this.dragging&&this.dragging.moved()||this.boxZoom&&this.boxZoom.moved())||e.DomEvent._skipped(a)||(this.fire("preclick"),this._fireMouseEvent(a))},_fireMouseEvent:function(a){if(this._loaded&&!e.DomEvent._skipped(a)){var b=a.type;if(b="mouseenter"===b?"mouseover":"mouseleave"===b?"mouseout":b,this.hasEventListeners(b)){"contextmenu"===b&&e.DomEvent.preventDefault(a);var c=this.mouseEventToContainerPoint(a),d=this.containerPointToLayerPoint(c),f=this.layerPointToLatLng(d);this.fire(b,{latlng:f,layerPoint:d,containerPoint:c,originalEvent:a})}}},_onTileLayerLoad:function(){this._tileLayersToLoad--,this._tileLayersNum&&!this._tileLayersToLoad&&this.fire("tilelayersload")},_clearHandlers:function(){for(var a=0,b=this._handlers.length;b>a;a++)this._handlers[a].disable()},whenReady:function(a,b){return this._loaded?a.call(b||this,this):this.on("load",a,b),this},_layerAdd:function(a){a.onAdd(this),this.fire("layeradd",{layer:a})},_getMapPanePos:function(){return e.DomUtil.getPosition(this._mapPane)},_moved:function(){var a=this._getMapPanePos();return a&&!a.equals([0,0])},_getTopLeftPoint:function(){return this.getPixelOrigin().subtract(this._getMapPanePos())},_getNewTopLeftPoint:function(a,b){var c=this.getSize()._divideBy(2);return this.project(a,b)._subtract(c)._round()},_latLngToNewLayerPoint:function(a,b,c){var d=this._getNewTopLeftPoint(c,b).add(this._getMapPanePos());return this.project(a,b)._subtract(d)},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2))},_getCenterOffset:function(a){return this.latLngToLayerPoint(a).subtract(this._getCenterLayerPoint())},_limitCenter:function(a,b,c){if(!c)return a;var d=this.project(a,b),f=this.getSize().divideBy(2),g=new e.Bounds(d.subtract(f),d.add(f)),h=this._getBoundsOffset(g,c,b);return this.unproject(d.add(h),b)},_limitOffset:function(a,b){if(!b)return a;var c=this.getPixelBounds(),d=new e.Bounds(c.min.add(a),c.max.add(a));return a.add(this._getBoundsOffset(d,b))},_getBoundsOffset:function(a,b,c){var d=this.project(b.getNorthWest(),c).subtract(a.min),f=this.project(b.getSouthEast(),c).subtract(a.max),g=this._rebound(d.x,-f.x),h=this._rebound(d.y,-f.y);return new e.Point(g,h)},_rebound:function(a,b){return a+b>0?Math.round(a-b)/2:Math.max(0,Math.ceil(a))-Math.max(0,Math.floor(b))},_limitZoom:function(a){var b=this.getMinZoom(),c=this.getMaxZoom();return Math.max(b,Math.min(c,a))}}),e.map=function(a,b){return new e.Map(a,b)},e.Projection.Mercator={MAX_LATITUDE:85.0840591556,R_MINOR:6356752.314245179,R_MAJOR:6378137,project:function(a){var b=e.LatLng.DEG_TO_RAD,c=this.MAX_LATITUDE,d=Math.max(Math.min(c,a.lat),-c),f=this.R_MAJOR,g=this.R_MINOR,h=a.lng*b*f,i=d*b,j=g/f,k=Math.sqrt(1-j*j),l=k*Math.sin(i);l=Math.pow((1-l)/(1+l),.5*k);var m=Math.tan(.5*(.5*Math.PI-i))/l;return i=-f*Math.log(m),new e.Point(h,i)},unproject:function(a){for(var b,c=e.LatLng.RAD_TO_DEG,d=this.R_MAJOR,f=this.R_MINOR,g=a.x*c/d,h=f/d,i=Math.sqrt(1-h*h),j=Math.exp(-a.y/d),k=Math.PI/2-2*Math.atan(j),l=15,m=1e-7,n=l,o=.1;Math.abs(o)>m&&--n>0;)b=i*Math.sin(k),o=Math.PI/2-2*Math.atan(j*Math.pow((1-b)/(1+b),.5*i))-k,k+=o;
return new e.LatLng(k*c,g)}},e.CRS.EPSG3395=e.extend({},e.CRS,{code:"EPSG:3395",projection:e.Projection.Mercator,transformation:function(){var a=e.Projection.Mercator,b=a.R_MAJOR,c=.5/(Math.PI*b);return new e.Transformation(c,.5,-c,.5)}()}),e.TileLayer=e.Class.extend({includes:e.Mixin.Events,options:{minZoom:0,maxZoom:18,tileSize:256,subdomains:"abc",errorTileUrl:"",attribution:"",zoomOffset:0,opacity:1,unloadInvisibleTiles:e.Browser.mobile,updateWhenIdle:e.Browser.mobile},initialize:function(a,b){b=e.setOptions(this,b),b.detectRetina&&e.Browser.retina&&b.maxZoom>0&&(b.tileSize=Math.floor(b.tileSize/2),b.zoomOffset++,b.minZoom>0&&b.minZoom--,this.options.maxZoom--),b.bounds&&(b.bounds=e.latLngBounds(b.bounds)),this._url=a;var c=this.options.subdomains;"string"==typeof c&&(this.options.subdomains=c.split(""))},onAdd:function(a){this._map=a,this._animated=a._zoomAnimated,this._initContainer(),a.on({viewreset:this._reset,moveend:this._update},this),this._animated&&a.on({zoomanim:this._animateZoom,zoomend:this._endZoomAnim},this),this.options.updateWhenIdle||(this._limitedUpdate=e.Util.limitExecByInterval(this._update,150,this),a.on("move",this._limitedUpdate,this)),this._reset(),this._update()},addTo:function(a){return a.addLayer(this),this},onRemove:function(a){this._container.parentNode.removeChild(this._container),a.off({viewreset:this._reset,moveend:this._update},this),this._animated&&a.off({zoomanim:this._animateZoom,zoomend:this._endZoomAnim},this),this.options.updateWhenIdle||a.off("move",this._limitedUpdate,this),this._container=null,this._map=null},bringToFront:function(){var a=this._map._panes.tilePane;return this._container&&(a.appendChild(this._container),this._setAutoZIndex(a,Math.max)),this},bringToBack:function(){var a=this._map._panes.tilePane;return this._container&&(a.insertBefore(this._container,a.firstChild),this._setAutoZIndex(a,Math.min)),this},getAttribution:function(){return this.options.attribution},getContainer:function(){return this._container},setOpacity:function(a){return this.options.opacity=a,this._map&&this._updateOpacity(),this},setZIndex:function(a){return this.options.zIndex=a,this._updateZIndex(),this},setUrl:function(a,b){return this._url=a,b||this.redraw(),this},redraw:function(){return this._map&&(this._reset({hard:!0}),this._update()),this},_updateZIndex:function(){this._container&&this.options.zIndex!==c&&(this._container.style.zIndex=this.options.zIndex)},_setAutoZIndex:function(a,b){var c,d,e,f=a.children,g=-b(1/0,-1/0);for(d=0,e=f.length;e>d;d++)f[d]!==this._container&&(c=parseInt(f[d].style.zIndex,10),isNaN(c)||(g=b(g,c)));this.options.zIndex=this._container.style.zIndex=(isFinite(g)?g:0)+b(1,-1)},_updateOpacity:function(){var a,b=this._tiles;if(e.Browser.ielt9)for(a in b)e.DomUtil.setOpacity(b[a],this.options.opacity);else e.DomUtil.setOpacity(this._container,this.options.opacity)},_initContainer:function(){var a=this._map._panes.tilePane;if(!this._container){if(this._container=e.DomUtil.create("div","leaflet-layer"),this._updateZIndex(),this._animated){var b="leaflet-tile-container";this._bgBuffer=e.DomUtil.create("div",b,this._container),this._tileContainer=e.DomUtil.create("div",b,this._container)}else this._tileContainer=this._container;a.appendChild(this._container),this.options.opacity<1&&this._updateOpacity()}},_reset:function(a){for(var b in this._tiles)this.fire("tileunload",{tile:this._tiles[b]});this._tiles={},this._tilesToLoad=0,this.options.reuseTiles&&(this._unusedTiles=[]),this._tileContainer.innerHTML="",this._animated&&a&&a.hard&&this._clearBgBuffer(),this._initContainer()},_getTileSize:function(){var a=this._map,b=a.getZoom()+this.options.zoomOffset,c=this.options.maxNativeZoom,d=this.options.tileSize;return c&&b>c&&(d=Math.round(a.getZoomScale(b)/a.getZoomScale(c)*d)),d},_update:function(){if(this._map){var a=this._map,b=a.getPixelBounds(),c=a.getZoom(),d=this._getTileSize();if(!(c>this.options.maxZoom||c<this.options.minZoom)){var f=e.bounds(b.min.divideBy(d)._floor(),b.max.divideBy(d)._floor());this._addTilesFromCenterOut(f),(this.options.unloadInvisibleTiles||this.options.reuseTiles)&&this._removeOtherTiles(f)}}},_addTilesFromCenterOut:function(a){var c,d,f,g=[],h=a.getCenter();for(c=a.min.y;c<=a.max.y;c++)for(d=a.min.x;d<=a.max.x;d++)f=new e.Point(d,c),this._tileShouldBeLoaded(f)&&g.push(f);var i=g.length;if(0!==i){g.sort(function(a,b){return a.distanceTo(h)-b.distanceTo(h)});var j=b.createDocumentFragment();for(this._tilesToLoad||this.fire("loading"),this._tilesToLoad+=i,d=0;i>d;d++)this._addTile(g[d],j);this._tileContainer.appendChild(j)}},_tileShouldBeLoaded:function(a){if(a.x+":"+a.y in this._tiles)return!1;var b=this.options;if(!b.continuousWorld){var c=this._getWrapTileNum();if(b.noWrap&&(a.x<0||a.x>=c.x)||a.y<0||a.y>=c.y)return!1}if(b.bounds){var d=b.tileSize,e=a.multiplyBy(d),f=e.add([d,d]),g=this._map.unproject(e),h=this._map.unproject(f);if(b.continuousWorld||b.noWrap||(g=g.wrap(),h=h.wrap()),!b.bounds.intersects([g,h]))return!1}return!0},_removeOtherTiles:function(a){var b,c,d,e;for(e in this._tiles)b=e.split(":"),c=parseInt(b[0],10),d=parseInt(b[1],10),(c<a.min.x||c>a.max.x||d<a.min.y||d>a.max.y)&&this._removeTile(e)},_removeTile:function(a){var b=this._tiles[a];this.fire("tileunload",{tile:b,url:b.src}),this.options.reuseTiles?(e.DomUtil.removeClass(b,"leaflet-tile-loaded"),this._unusedTiles.push(b)):b.parentNode===this._tileContainer&&this._tileContainer.removeChild(b),e.Browser.android||(b.onload=null,b.src=e.Util.emptyImageUrl),delete this._tiles[a]},_addTile:function(a,b){var c=this._getTilePos(a),d=this._getTile();e.DomUtil.setPosition(d,c,e.Browser.chrome),this._tiles[a.x+":"+a.y]=d,this._loadTile(d,a),d.parentNode!==this._tileContainer&&b.appendChild(d)},_getZoomForUrl:function(){var a=this.options,b=this._map.getZoom();return a.zoomReverse&&(b=a.maxZoom-b),b+=a.zoomOffset,a.maxNativeZoom?Math.min(b,a.maxNativeZoom):b},_getTilePos:function(a){var b=this._map.getPixelOrigin(),c=this._getTileSize();return a.multiplyBy(c).subtract(b)},getTileUrl:function(a){return e.Util.template(this._url,e.extend({s:this._getSubdomain(a),z:a.z,x:a.x,y:a.y},this.options))},_getWrapTileNum:function(){var a=this._map.options.crs,b=a.getSize(this._map.getZoom());return b.divideBy(this._getTileSize())._floor()},_adjustTilePoint:function(a){var b=this._getWrapTileNum();this.options.continuousWorld||this.options.noWrap||(a.x=(a.x%b.x+b.x)%b.x),this.options.tms&&(a.y=b.y-a.y-1),a.z=this._getZoomForUrl()},_getSubdomain:function(a){var b=Math.abs(a.x+a.y)%this.options.subdomains.length;return this.options.subdomains[b]},_getTile:function(){if(this.options.reuseTiles&&this._unusedTiles.length>0){var a=this._unusedTiles.pop();return this._resetTile(a),a}return this._createTile()},_resetTile:function(){},_createTile:function(){var a=e.DomUtil.create("img","leaflet-tile");return a.style.width=a.style.height=this._getTileSize()+"px",a.galleryimg="no",a.onselectstart=a.onmousemove=e.Util.falseFn,e.Browser.ielt9&&this.options.opacity!==c&&e.DomUtil.setOpacity(a,this.options.opacity),e.Browser.mobileWebkit3d&&(a.style.WebkitBackfaceVisibility="hidden"),a},_loadTile:function(a,b){a._layer=this,a.onload=this._tileOnLoad,a.onerror=this._tileOnError,this._adjustTilePoint(b),a.src=this.getTileUrl(b),this.fire("tileloadstart",{tile:a,url:a.src})},_tileLoaded:function(){this._tilesToLoad--,this._animated&&e.DomUtil.addClass(this._tileContainer,"leaflet-zoom-animated"),this._tilesToLoad||(this.fire("load"),this._animated&&(clearTimeout(this._clearBgBufferTimer),this._clearBgBufferTimer=setTimeout(e.bind(this._clearBgBuffer,this),500)))},_tileOnLoad:function(){var a=this._layer;this.src!==e.Util.emptyImageUrl&&(e.DomUtil.addClass(this,"leaflet-tile-loaded"),a.fire("tileload",{tile:this,url:this.src})),a._tileLoaded()},_tileOnError:function(){var a=this._layer;a.fire("tileerror",{tile:this,url:this.src});var b=a.options.errorTileUrl;b&&(this.src=b),a._tileLoaded()}}),e.tileLayer=function(a,b){return new e.TileLayer(a,b)},e.TileLayer.WMS=e.TileLayer.extend({defaultWmsParams:{service:"WMS",request:"GetMap",version:"1.1.1",layers:"",styles:"",format:"image/jpeg",transparent:!1},initialize:function(a,b){this._url=a;var c=e.extend({},this.defaultWmsParams),d=b.tileSize||this.options.tileSize;c.width=c.height=b.detectRetina&&e.Browser.retina?2*d:d;for(var f in b)this.options.hasOwnProperty(f)||"crs"===f||(c[f]=b[f]);this.wmsParams=c,e.setOptions(this,b)},onAdd:function(a){this._crs=this.options.crs||a.options.crs,this._wmsVersion=parseFloat(this.wmsParams.version);var b=this._wmsVersion>=1.3?"crs":"srs";this.wmsParams[b]=this._crs.code,e.TileLayer.prototype.onAdd.call(this,a)},getTileUrl:function(a){var b=this._map,c=this.options.tileSize,d=a.multiplyBy(c),f=d.add([c,c]),g=this._crs.project(b.unproject(d,a.z)),h=this._crs.project(b.unproject(f,a.z)),i=this._wmsVersion>=1.3&&this._crs===e.CRS.EPSG4326?[h.y,g.x,g.y,h.x].join(","):[g.x,h.y,h.x,g.y].join(","),j=e.Util.template(this._url,{s:this._getSubdomain(a)});return j+e.Util.getParamString(this.wmsParams,j,!0)+"&BBOX="+i},setParams:function(a,b){return e.extend(this.wmsParams,a),b||this.redraw(),this}}),e.tileLayer.wms=function(a,b){return new e.TileLayer.WMS(a,b)},e.TileLayer.Canvas=e.TileLayer.extend({options:{async:!1},initialize:function(a){e.setOptions(this,a)},redraw:function(){this._map&&(this._reset({hard:!0}),this._update());for(var a in this._tiles)this._redrawTile(this._tiles[a]);return this},_redrawTile:function(a){this.drawTile(a,a._tilePoint,this._map._zoom)},_createTile:function(){var a=e.DomUtil.create("canvas","leaflet-tile");return a.width=a.height=this.options.tileSize,a.onselectstart=a.onmousemove=e.Util.falseFn,a},_loadTile:function(a,b){a._layer=this,a._tilePoint=b,this._redrawTile(a),this.options.async||this.tileDrawn(a)},drawTile:function(){},tileDrawn:function(a){this._tileOnLoad.call(a)}}),e.tileLayer.canvas=function(a){return new e.TileLayer.Canvas(a)},e.ImageOverlay=e.Class.extend({includes:e.Mixin.Events,options:{opacity:1},initialize:function(a,b,c){this._url=a,this._bounds=e.latLngBounds(b),e.setOptions(this,c)},onAdd:function(a){this._map=a,this._image||this._initImage(),a._panes.overlayPane.appendChild(this._image),a.on("viewreset",this._reset,this),a.options.zoomAnimation&&e.Browser.any3d&&a.on("zoomanim",this._animateZoom,this),this._reset()},onRemove:function(a){a.getPanes().overlayPane.removeChild(this._image),a.off("viewreset",this._reset,this),a.options.zoomAnimation&&a.off("zoomanim",this._animateZoom,this)},addTo:function(a){return a.addLayer(this),this},setOpacity:function(a){return this.options.opacity=a,this._updateOpacity(),this},bringToFront:function(){return this._image&&this._map._panes.overlayPane.appendChild(this._image),this},bringToBack:function(){var a=this._map._panes.overlayPane;return this._image&&a.insertBefore(this._image,a.firstChild),this},setUrl:function(a){this._url=a,this._image.src=this._url},getAttribution:function(){return this.options.attribution},_initImage:function(){this._image=e.DomUtil.create("img","leaflet-image-layer"),this._map.options.zoomAnimation&&e.Browser.any3d?e.DomUtil.addClass(this._image,"leaflet-zoom-animated"):e.DomUtil.addClass(this._image,"leaflet-zoom-hide"),this._updateOpacity(),e.extend(this._image,{galleryimg:"no",onselectstart:e.Util.falseFn,onmousemove:e.Util.falseFn,onload:e.bind(this._onImageLoad,this),src:this._url})},_animateZoom:function(a){var b=this._map,c=this._image,d=b.getZoomScale(a.zoom),f=this._bounds.getNorthWest(),g=this._bounds.getSouthEast(),h=b._latLngToNewLayerPoint(f,a.zoom,a.center),i=b._latLngToNewLayerPoint(g,a.zoom,a.center)._subtract(h),j=h._add(i._multiplyBy(.5*(1-1/d)));c.style[e.DomUtil.TRANSFORM]=e.DomUtil.getTranslateString(j)+" scale("+d+") "},_reset:function(){var a=this._image,b=this._map.latLngToLayerPoint(this._bounds.getNorthWest()),c=this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(b);e.DomUtil.setPosition(a,b),a.style.width=c.x+"px",a.style.height=c.y+"px"},_onImageLoad:function(){this.fire("load")},_updateOpacity:function(){e.DomUtil.setOpacity(this._image,this.options.opacity)}}),e.imageOverlay=function(a,b,c){return new e.ImageOverlay(a,b,c)},e.Icon=e.Class.extend({options:{className:""},initialize:function(a){e.setOptions(this,a)},createIcon:function(a){return this._createIcon("icon",a)},createShadow:function(a){return this._createIcon("shadow",a)},_createIcon:function(a,b){var c=this._getIconUrl(a);if(!c){if("icon"===a)throw new Error("iconUrl not set in Icon options (see the docs).");return null}var d;return d=b&&"IMG"===b.tagName?this._createImg(c,b):this._createImg(c),this._setIconStyles(d,a),d},_setIconStyles:function(a,b){var c,d=this.options,f=e.point(d[b+"Size"]);c=e.point("shadow"===b?d.shadowAnchor||d.iconAnchor:d.iconAnchor),!c&&f&&(c=f.divideBy(2,!0)),a.className="leaflet-marker-"+b+" "+d.className,c&&(a.style.marginLeft=-c.x+"px",a.style.marginTop=-c.y+"px"),f&&(a.style.width=f.x+"px",a.style.height=f.y+"px")},_createImg:function(a,c){return c=c||b.createElement("img"),c.src=a,c},_getIconUrl:function(a){return e.Browser.retina&&this.options[a+"RetinaUrl"]?this.options[a+"RetinaUrl"]:this.options[a+"Url"]}}),e.icon=function(a){return new e.Icon(a)},e.Icon.Default=e.Icon.extend({options:{iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]},_getIconUrl:function(a){var b=a+"Url";if(this.options[b])return this.options[b];e.Browser.retina&&"icon"===a&&(a+="-2x");var c=e.Icon.Default.imagePath;if(!c)throw new Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");return c+"/marker-"+a+".png"}}),e.Icon.Default.imagePath=function(){var a,c,d,e,f,g=b.getElementsByTagName("script"),h=/[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;for(a=0,c=g.length;c>a;a++)if(d=g[a].src,e=d.match(h))return f=d.split(h)[0],(f?f+"/":"")+"images"}(),e.Marker=e.Class.extend({includes:e.Mixin.Events,options:{icon:new e.Icon.Default,title:"",alt:"",clickable:!0,draggable:!1,keyboard:!0,zIndexOffset:0,opacity:1,riseOnHover:!1,riseOffset:250},initialize:function(a,b){e.setOptions(this,b),this._latlng=e.latLng(a)},onAdd:function(a){this._map=a,a.on("viewreset",this.update,this),this._initIcon(),this.update(),this.fire("add"),a.options.zoomAnimation&&a.options.markerZoomAnimation&&a.on("zoomanim",this._animateZoom,this)},addTo:function(a){return a.addLayer(this),this},onRemove:function(a){this.dragging&&this.dragging.disable(),this._removeIcon(),this._removeShadow(),this.fire("remove"),a.off({viewreset:this.update,zoomanim:this._animateZoom},this),this._map=null},getLatLng:function(){return this._latlng},setLatLng:function(a){return this._latlng=e.latLng(a),this.update(),this.fire("move",{latlng:this._latlng})},setZIndexOffset:function(a){return this.options.zIndexOffset=a,this.update(),this},setIcon:function(a){return this.options.icon=a,this._map&&(this._initIcon(),this.update()),this._popup&&this.bindPopup(this._popup),this},update:function(){if(this._icon){var a=this._map.latLngToLayerPoint(this._latlng).round();this._setPos(a)}return this},_initIcon:function(){var a=this.options,b=this._map,c=b.options.zoomAnimation&&b.options.markerZoomAnimation,d=c?"leaflet-zoom-animated":"leaflet-zoom-hide",f=a.icon.createIcon(this._icon),g=!1;f!==this._icon&&(this._icon&&this._removeIcon(),g=!0,a.title&&(f.title=a.title),a.alt&&(f.alt=a.alt)),e.DomUtil.addClass(f,d),a.keyboard&&(f.tabIndex="0"),this._icon=f,this._initInteraction(),a.riseOnHover&&e.DomEvent.on(f,"mouseover",this._bringToFront,this).on(f,"mouseout",this._resetZIndex,this);var h=a.icon.createShadow(this._shadow),i=!1;h!==this._shadow&&(this._removeShadow(),i=!0),h&&e.DomUtil.addClass(h,d),this._shadow=h,a.opacity<1&&this._updateOpacity();var j=this._map._panes;g&&j.markerPane.appendChild(this._icon),h&&i&&j.shadowPane.appendChild(this._shadow)},_removeIcon:function(){this.options.riseOnHover&&e.DomEvent.off(this._icon,"mouseover",this._bringToFront).off(this._icon,"mouseout",this._resetZIndex),this._map._panes.markerPane.removeChild(this._icon),this._icon=null},_removeShadow:function(){this._shadow&&this._map._panes.shadowPane.removeChild(this._shadow),this._shadow=null},_setPos:function(a){e.DomUtil.setPosition(this._icon,a),this._shadow&&e.DomUtil.setPosition(this._shadow,a),this._zIndex=a.y+this.options.zIndexOffset,this._resetZIndex()},_updateZIndex:function(a){this._icon.style.zIndex=this._zIndex+a},_animateZoom:function(a){var b=this._map._latLngToNewLayerPoint(this._latlng,a.zoom,a.center).round();this._setPos(b)},_initInteraction:function(){if(this.options.clickable){var a=this._icon,b=["dblclick","mousedown","mouseover","mouseout","contextmenu"];e.DomUtil.addClass(a,"leaflet-clickable"),e.DomEvent.on(a,"click",this._onMouseClick,this),e.DomEvent.on(a,"keypress",this._onKeyPress,this);for(var c=0;c<b.length;c++)e.DomEvent.on(a,b[c],this._fireMouseEvent,this);e.Handler.MarkerDrag&&(this.dragging=new e.Handler.MarkerDrag(this),this.options.draggable&&this.dragging.enable())}},_onMouseClick:function(a){var b=this.dragging&&this.dragging.moved();(this.hasEventListeners(a.type)||b)&&e.DomEvent.stopPropagation(a),b||(this.dragging&&this.dragging._enabled||!this._map.dragging||!this._map.dragging.moved())&&this.fire(a.type,{originalEvent:a,latlng:this._latlng})},_onKeyPress:function(a){13===a.keyCode&&this.fire("click",{originalEvent:a,latlng:this._latlng})},_fireMouseEvent:function(a){this.fire(a.type,{originalEvent:a,latlng:this._latlng}),"contextmenu"===a.type&&this.hasEventListeners(a.type)&&e.DomEvent.preventDefault(a),"mousedown"!==a.type?e.DomEvent.stopPropagation(a):e.DomEvent.preventDefault(a)},setOpacity:function(a){return this.options.opacity=a,this._map&&this._updateOpacity(),this},_updateOpacity:function(){e.DomUtil.setOpacity(this._icon,this.options.opacity),this._shadow&&e.DomUtil.setOpacity(this._shadow,this.options.opacity)},_bringToFront:function(){this._updateZIndex(this.options.riseOffset)},_resetZIndex:function(){this._updateZIndex(0)}}),e.marker=function(a,b){return new e.Marker(a,b)},e.DivIcon=e.Icon.extend({options:{iconSize:[12,12],className:"leaflet-div-icon",html:!1},createIcon:function(a){var c=a&&"DIV"===a.tagName?a:b.createElement("div"),d=this.options;return c.innerHTML=d.html!==!1?d.html:"",d.bgPos&&(c.style.backgroundPosition=-d.bgPos.x+"px "+-d.bgPos.y+"px"),this._setIconStyles(c,"icon"),c},createShadow:function(){return null}}),e.divIcon=function(a){return new e.DivIcon(a)},e.Map.mergeOptions({closePopupOnClick:!0}),e.Popup=e.Class.extend({includes:e.Mixin.Events,options:{minWidth:50,maxWidth:300,autoPan:!0,closeButton:!0,offset:[0,7],autoPanPadding:[5,5],keepInView:!1,className:"",zoomAnimation:!0},initialize:function(a,b){e.setOptions(this,a),this._source=b,this._animated=e.Browser.any3d&&this.options.zoomAnimation,this._isOpen=!1},onAdd:function(a){this._map=a,this._container||this._initLayout();var b=a.options.fadeAnimation;b&&e.DomUtil.setOpacity(this._container,0),a._panes.popupPane.appendChild(this._container),a.on(this._getEvents(),this),this.update(),b&&e.DomUtil.setOpacity(this._container,1),this.fire("open"),a.fire("popupopen",{popup:this}),this._source&&this._source.fire("popupopen",{popup:this})},addTo:function(a){return a.addLayer(this),this},openOn:function(a){return a.openPopup(this),this},onRemove:function(a){a._panes.popupPane.removeChild(this._container),e.Util.falseFn(this._container.offsetWidth),a.off(this._getEvents(),this),a.options.fadeAnimation&&e.DomUtil.setOpacity(this._container,0),this._map=null,this.fire("close"),a.fire("popupclose",{popup:this}),this._source&&this._source.fire("popupclose",{popup:this})},getLatLng:function(){return this._latlng},setLatLng:function(a){return this._latlng=e.latLng(a),this._map&&(this._updatePosition(),this._adjustPan()),this},getContent:function(){return this._content},setContent:function(a){return this._content=a,this.update(),this},update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updateLayout(),this._updatePosition(),this._container.style.visibility="",this._adjustPan())},_getEvents:function(){var a={viewreset:this._updatePosition};return this._animated&&(a.zoomanim=this._zoomAnimation),("closeOnClick"in this.options?this.options.closeOnClick:this._map.options.closePopupOnClick)&&(a.preclick=this._close),this.options.keepInView&&(a.moveend=this._adjustPan),a},_close:function(){this._map&&this._map.closePopup(this)},_initLayout:function(){var a,b="leaflet-popup",c=b+" "+this.options.className+" leaflet-zoom-"+(this._animated?"animated":"hide"),d=this._container=e.DomUtil.create("div",c);this.options.closeButton&&(a=this._closeButton=e.DomUtil.create("a",b+"-close-button",d),a.href="#close",a.innerHTML="&#215;",e.DomEvent.disableClickPropagation(a),e.DomEvent.on(a,"click",this._onCloseButtonClick,this));var f=this._wrapper=e.DomUtil.create("div",b+"-content-wrapper",d);e.DomEvent.disableClickPropagation(f),this._contentNode=e.DomUtil.create("div",b+"-content",f),e.DomEvent.disableScrollPropagation(this._contentNode),e.DomEvent.on(f,"contextmenu",e.DomEvent.stopPropagation),this._tipContainer=e.DomUtil.create("div",b+"-tip-container",d),this._tip=e.DomUtil.create("div",b+"-tip",this._tipContainer)},_updateContent:function(){if(this._content){if("string"==typeof this._content)this._contentNode.innerHTML=this._content;else{for(;this._contentNode.hasChildNodes();)this._contentNode.removeChild(this._contentNode.firstChild);this._contentNode.appendChild(this._content)}this.fire("contentupdate")}},_updateLayout:function(){var a=this._contentNode,b=a.style;b.width="",b.whiteSpace="nowrap";var c=a.offsetWidth;c=Math.min(c,this.options.maxWidth),c=Math.max(c,this.options.minWidth),b.width=c+1+"px",b.whiteSpace="",b.height="";var d=a.offsetHeight,f=this.options.maxHeight,g="leaflet-popup-scrolled";f&&d>f?(b.height=f+"px",e.DomUtil.addClass(a,g)):e.DomUtil.removeClass(a,g),this._containerWidth=this._container.offsetWidth},_updatePosition:function(){if(this._map){var a=this._map.latLngToLayerPoint(this._latlng),b=this._animated,c=e.point(this.options.offset);b&&e.DomUtil.setPosition(this._container,a),this._containerBottom=-c.y-(b?0:a.y),this._containerLeft=-Math.round(this._containerWidth/2)+c.x+(b?0:a.x),this._container.style.bottom=this._containerBottom+"px",this._container.style.left=this._containerLeft+"px"}},_zoomAnimation:function(a){var b=this._map._latLngToNewLayerPoint(this._latlng,a.zoom,a.center);e.DomUtil.setPosition(this._container,b)},_adjustPan:function(){if(this.options.autoPan){var a=this._map,b=this._container.offsetHeight,c=this._containerWidth,d=new e.Point(this._containerLeft,-b-this._containerBottom);this._animated&&d._add(e.DomUtil.getPosition(this._container));var f=a.layerPointToContainerPoint(d),g=e.point(this.options.autoPanPadding),h=e.point(this.options.autoPanPaddingTopLeft||g),i=e.point(this.options.autoPanPaddingBottomRight||g),j=a.getSize(),k=0,l=0;f.x+c+i.x>j.x&&(k=f.x+c-j.x+i.x),f.x-k-h.x<0&&(k=f.x-h.x),f.y+b+i.y>j.y&&(l=f.y+b-j.y+i.y),f.y-l-h.y<0&&(l=f.y-h.y),(k||l)&&a.fire("autopanstart").panBy([k,l])}},_onCloseButtonClick:function(a){this._close(),e.DomEvent.stop(a)}}),e.popup=function(a,b){return new e.Popup(a,b)},e.Map.include({openPopup:function(a,b,c){if(this.closePopup(),!(a instanceof e.Popup)){var d=a;a=new e.Popup(c).setLatLng(b).setContent(d)}return a._isOpen=!0,this._popup=a,this.addLayer(a)},closePopup:function(a){return a&&a!==this._popup||(a=this._popup,this._popup=null),a&&(this.removeLayer(a),a._isOpen=!1),this}}),e.Marker.include({openPopup:function(){return this._popup&&this._map&&!this._map.hasLayer(this._popup)&&(this._popup.setLatLng(this._latlng),this._map.openPopup(this._popup)),this},closePopup:function(){return this._popup&&this._popup._close(),this},togglePopup:function(){return this._popup&&(this._popup._isOpen?this.closePopup():this.openPopup()),this},bindPopup:function(a,b){var c=e.point(this.options.icon.options.popupAnchor||[0,0]);return c=c.add(e.Popup.prototype.options.offset),b&&b.offset&&(c=c.add(b.offset)),b=e.extend({offset:c},b),this._popupHandlersAdded||(this.on("click",this.togglePopup,this).on("remove",this.closePopup,this).on("move",this._movePopup,this),this._popupHandlersAdded=!0),a instanceof e.Popup?(e.setOptions(a,b),this._popup=a):this._popup=new e.Popup(b,this).setContent(a),this},setPopupContent:function(a){return this._popup&&this._popup.setContent(a),this},unbindPopup:function(){return this._popup&&(this._popup=null,this.off("click",this.togglePopup,this).off("remove",this.closePopup,this).off("move",this._movePopup,this),this._popupHandlersAdded=!1),this},getPopup:function(){return this._popup},_movePopup:function(a){this._popup.setLatLng(a.latlng)}}),e.LayerGroup=e.Class.extend({initialize:function(a){this._layers={};var b,c;if(a)for(b=0,c=a.length;c>b;b++)this.addLayer(a[b])},addLayer:function(a){var b=this.getLayerId(a);return this._layers[b]=a,this._map&&this._map.addLayer(a),this},removeLayer:function(a){var b=a in this._layers?a:this.getLayerId(a);return this._map&&this._layers[b]&&this._map.removeLayer(this._layers[b]),delete this._layers[b],this},hasLayer:function(a){return a?a in this._layers||this.getLayerId(a)in this._layers:!1},clearLayers:function(){return this.eachLayer(this.removeLayer,this),this},invoke:function(a){var b,c,d=Array.prototype.slice.call(arguments,1);for(b in this._layers)c=this._layers[b],c[a]&&c[a].apply(c,d);return this},onAdd:function(a){this._map=a,this.eachLayer(a.addLayer,a)},onRemove:function(a){this.eachLayer(a.removeLayer,a),this._map=null},addTo:function(a){return a.addLayer(this),this},eachLayer:function(a,b){for(var c in this._layers)a.call(b,this._layers[c]);return this},getLayer:function(a){return this._layers[a]},getLayers:function(){var a=[];for(var b in this._layers)a.push(this._layers[b]);return a},setZIndex:function(a){return this.invoke("setZIndex",a)},getLayerId:function(a){return e.stamp(a)}}),e.layerGroup=function(a){return new e.LayerGroup(a)},e.FeatureGroup=e.LayerGroup.extend({includes:e.Mixin.Events,statics:{EVENTS:"click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose"},addLayer:function(a){return this.hasLayer(a)?this:("on"in a&&a.on(e.FeatureGroup.EVENTS,this._propagateEvent,this),e.LayerGroup.prototype.addLayer.call(this,a),this._popupContent&&a.bindPopup&&a.bindPopup(this._popupContent,this._popupOptions),this.fire("layeradd",{layer:a}))},removeLayer:function(a){return this.hasLayer(a)?(a in this._layers&&(a=this._layers[a]),a.off(e.FeatureGroup.EVENTS,this._propagateEvent,this),e.LayerGroup.prototype.removeLayer.call(this,a),this._popupContent&&this.invoke("unbindPopup"),this.fire("layerremove",{layer:a})):this},bindPopup:function(a,b){return this._popupContent=a,this._popupOptions=b,this.invoke("bindPopup",a,b)},openPopup:function(a){for(var b in this._layers){this._layers[b].openPopup(a);break}return this},setStyle:function(a){return this.invoke("setStyle",a)},bringToFront:function(){return this.invoke("bringToFront")},bringToBack:function(){return this.invoke("bringToBack")},getBounds:function(){var a=new e.LatLngBounds;return this.eachLayer(function(b){a.extend(b instanceof e.Marker?b.getLatLng():b.getBounds())}),a},_propagateEvent:function(a){a=e.extend({layer:a.target,target:this},a),this.fire(a.type,a)}}),e.featureGroup=function(a){return new e.FeatureGroup(a)},e.Path=e.Class.extend({includes:[e.Mixin.Events],statics:{CLIP_PADDING:function(){var b=e.Browser.mobile?1280:2e3,c=(b/Math.max(a.outerWidth,a.outerHeight)-1)/2;return Math.max(0,Math.min(.5,c))}()},options:{stroke:!0,color:"#0033ff",dashArray:null,lineCap:null,lineJoin:null,weight:5,opacity:.5,fill:!1,fillColor:null,fillOpacity:.2,clickable:!0},initialize:function(a){e.setOptions(this,a)},onAdd:function(a){this._map=a,this._container||(this._initElements(),this._initEvents()),this.projectLatlngs(),this._updatePath(),this._container&&this._map._pathRoot.appendChild(this._container),this.fire("add"),a.on({viewreset:this.projectLatlngs,moveend:this._updatePath},this)},addTo:function(a){return a.addLayer(this),this},onRemove:function(a){a._pathRoot.removeChild(this._container),this.fire("remove"),this._map=null,e.Browser.vml&&(this._container=null,this._stroke=null,this._fill=null),a.off({viewreset:this.projectLatlngs,moveend:this._updatePath},this)},projectLatlngs:function(){},setStyle:function(a){return e.setOptions(this,a),this._container&&this._updateStyle(),this},redraw:function(){return this._map&&(this.projectLatlngs(),this._updatePath()),this}}),e.Map.include({_updatePathViewport:function(){var a=e.Path.CLIP_PADDING,b=this.getSize(),c=e.DomUtil.getPosition(this._mapPane),d=c.multiplyBy(-1)._subtract(b.multiplyBy(a)._round()),f=d.add(b.multiplyBy(1+2*a)._round());this._pathViewport=new e.Bounds(d,f)}}),e.Path.SVG_NS="http://www.w3.org/2000/svg",e.Browser.svg=!(!b.createElementNS||!b.createElementNS(e.Path.SVG_NS,"svg").createSVGRect),e.Path=e.Path.extend({statics:{SVG:e.Browser.svg},bringToFront:function(){var a=this._map._pathRoot,b=this._container;return b&&a.lastChild!==b&&a.appendChild(b),this},bringToBack:function(){var a=this._map._pathRoot,b=this._container,c=a.firstChild;return b&&c!==b&&a.insertBefore(b,c),this},getPathString:function(){},_createElement:function(a){return b.createElementNS(e.Path.SVG_NS,a)},_initElements:function(){this._map._initPathRoot(),this._initPath(),this._initStyle()},_initPath:function(){this._container=this._createElement("g"),this._path=this._createElement("path"),this.options.className&&e.DomUtil.addClass(this._path,this.options.className),this._container.appendChild(this._path)},_initStyle:function(){this.options.stroke&&(this._path.setAttribute("stroke-linejoin","round"),this._path.setAttribute("stroke-linecap","round")),this.options.fill&&this._path.setAttribute("fill-rule","evenodd"),this.options.pointerEvents&&this._path.setAttribute("pointer-events",this.options.pointerEvents),this.options.clickable||this.options.pointerEvents||this._path.setAttribute("pointer-events","none"),this._updateStyle()},_updateStyle:function(){this.options.stroke?(this._path.setAttribute("stroke",this.options.color),this._path.setAttribute("stroke-opacity",this.options.opacity),this._path.setAttribute("stroke-width",this.options.weight),this.options.dashArray?this._path.setAttribute("stroke-dasharray",this.options.dashArray):this._path.removeAttribute("stroke-dasharray"),this.options.lineCap&&this._path.setAttribute("stroke-linecap",this.options.lineCap),this.options.lineJoin&&this._path.setAttribute("stroke-linejoin",this.options.lineJoin)):this._path.setAttribute("stroke","none"),this.options.fill?(this._path.setAttribute("fill",this.options.fillColor||this.options.color),this._path.setAttribute("fill-opacity",this.options.fillOpacity)):this._path.setAttribute("fill","none")},_updatePath:function(){var a=this.getPathString();a||(a="M0 0"),this._path.setAttribute("d",a)},_initEvents:function(){if(this.options.clickable){(e.Browser.svg||!e.Browser.vml)&&e.DomUtil.addClass(this._path,"leaflet-clickable"),e.DomEvent.on(this._container,"click",this._onMouseClick,this);for(var a=["dblclick","mousedown","mouseover","mouseout","mousemove","contextmenu"],b=0;b<a.length;b++)e.DomEvent.on(this._container,a[b],this._fireMouseEvent,this)}},_onMouseClick:function(a){this._map.dragging&&this._map.dragging.moved()||this._fireMouseEvent(a)},_fireMouseEvent:function(a){if(this.hasEventListeners(a.type)){var b=this._map,c=b.mouseEventToContainerPoint(a),d=b.containerPointToLayerPoint(c),f=b.layerPointToLatLng(d);this.fire(a.type,{latlng:f,layerPoint:d,containerPoint:c,originalEvent:a}),"contextmenu"===a.type&&e.DomEvent.preventDefault(a),"mousemove"!==a.type&&e.DomEvent.stopPropagation(a)}}}),e.Map.include({_initPathRoot:function(){this._pathRoot||(this._pathRoot=e.Path.prototype._createElement("svg"),this._panes.overlayPane.appendChild(this._pathRoot),this.options.zoomAnimation&&e.Browser.any3d?(e.DomUtil.addClass(this._pathRoot,"leaflet-zoom-animated"),this.on({zoomanim:this._animatePathZoom,zoomend:this._endPathZoom})):e.DomUtil.addClass(this._pathRoot,"leaflet-zoom-hide"),this.on("moveend",this._updateSvgViewport),this._updateSvgViewport())
},_animatePathZoom:function(a){var b=this.getZoomScale(a.zoom),c=this._getCenterOffset(a.center)._multiplyBy(-b)._add(this._pathViewport.min);this._pathRoot.style[e.DomUtil.TRANSFORM]=e.DomUtil.getTranslateString(c)+" scale("+b+") ",this._pathZooming=!0},_endPathZoom:function(){this._pathZooming=!1},_updateSvgViewport:function(){if(!this._pathZooming){this._updatePathViewport();var a=this._pathViewport,b=a.min,c=a.max,d=c.x-b.x,f=c.y-b.y,g=this._pathRoot,h=this._panes.overlayPane;e.Browser.mobileWebkit&&h.removeChild(g),e.DomUtil.setPosition(g,b),g.setAttribute("width",d),g.setAttribute("height",f),g.setAttribute("viewBox",[b.x,b.y,d,f].join(" ")),e.Browser.mobileWebkit&&h.appendChild(g)}}}),e.Path.include({bindPopup:function(a,b){return a instanceof e.Popup?this._popup=a:((!this._popup||b)&&(this._popup=new e.Popup(b,this)),this._popup.setContent(a)),this._popupHandlersAdded||(this.on("click",this._openPopup,this).on("remove",this.closePopup,this),this._popupHandlersAdded=!0),this},unbindPopup:function(){return this._popup&&(this._popup=null,this.off("click",this._openPopup).off("remove",this.closePopup),this._popupHandlersAdded=!1),this},openPopup:function(a){return this._popup&&(a=a||this._latlng||this._latlngs[Math.floor(this._latlngs.length/2)],this._openPopup({latlng:a})),this},closePopup:function(){return this._popup&&this._popup._close(),this},_openPopup:function(a){this._popup.setLatLng(a.latlng),this._map.openPopup(this._popup)}}),e.Browser.vml=!e.Browser.svg&&function(){try{var a=b.createElement("div");a.innerHTML='<v:shape adj="1"/>';var c=a.firstChild;return c.style.behavior="url(#default#VML)",c&&"object"==typeof c.adj}catch(d){return!1}}(),e.Path=e.Browser.svg||!e.Browser.vml?e.Path:e.Path.extend({statics:{VML:!0,CLIP_PADDING:.02},_createElement:function(){try{return b.namespaces.add("lvml","urn:schemas-microsoft-com:vml"),function(a){return b.createElement("<lvml:"+a+' class="lvml">')}}catch(a){return function(a){return b.createElement("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')}}}(),_initPath:function(){var a=this._container=this._createElement("shape");e.DomUtil.addClass(a,"leaflet-vml-shape"+(this.options.className?" "+this.options.className:"")),this.options.clickable&&e.DomUtil.addClass(a,"leaflet-clickable"),a.coordsize="1 1",this._path=this._createElement("path"),a.appendChild(this._path),this._map._pathRoot.appendChild(a)},_initStyle:function(){this._updateStyle()},_updateStyle:function(){var a=this._stroke,b=this._fill,c=this.options,d=this._container;d.stroked=c.stroke,d.filled=c.fill,c.stroke?(a||(a=this._stroke=this._createElement("stroke"),a.endcap="round",d.appendChild(a)),a.weight=c.weight+"px",a.color=c.color,a.opacity=c.opacity,a.dashStyle=c.dashArray?e.Util.isArray(c.dashArray)?c.dashArray.join(" "):c.dashArray.replace(/( *, *)/g," "):"",c.lineCap&&(a.endcap=c.lineCap.replace("butt","flat")),c.lineJoin&&(a.joinstyle=c.lineJoin)):a&&(d.removeChild(a),this._stroke=null),c.fill?(b||(b=this._fill=this._createElement("fill"),d.appendChild(b)),b.color=c.fillColor||c.color,b.opacity=c.fillOpacity):b&&(d.removeChild(b),this._fill=null)},_updatePath:function(){var a=this._container.style;a.display="none",this._path.v=this.getPathString()+" ",a.display=""}}),e.Map.include(e.Browser.svg||!e.Browser.vml?{}:{_initPathRoot:function(){if(!this._pathRoot){var a=this._pathRoot=b.createElement("div");a.className="leaflet-vml-container",this._panes.overlayPane.appendChild(a),this.on("moveend",this._updatePathViewport),this._updatePathViewport()}}}),e.Browser.canvas=function(){return!!b.createElement("canvas").getContext}(),e.Path=e.Path.SVG&&!a.L_PREFER_CANVAS||!e.Browser.canvas?e.Path:e.Path.extend({statics:{CANVAS:!0,SVG:!1},redraw:function(){return this._map&&(this.projectLatlngs(),this._requestUpdate()),this},setStyle:function(a){return e.setOptions(this,a),this._map&&(this._updateStyle(),this._requestUpdate()),this},onRemove:function(a){a.off("viewreset",this.projectLatlngs,this).off("moveend",this._updatePath,this),this.options.clickable&&(this._map.off("click",this._onClick,this),this._map.off("mousemove",this._onMouseMove,this)),this._requestUpdate(),this.fire("remove"),this._map=null},_requestUpdate:function(){this._map&&!e.Path._updateRequest&&(e.Path._updateRequest=e.Util.requestAnimFrame(this._fireMapMoveEnd,this._map))},_fireMapMoveEnd:function(){e.Path._updateRequest=null,this.fire("moveend")},_initElements:function(){this._map._initPathRoot(),this._ctx=this._map._canvasCtx},_updateStyle:function(){var a=this.options;a.stroke&&(this._ctx.lineWidth=a.weight,this._ctx.strokeStyle=a.color),a.fill&&(this._ctx.fillStyle=a.fillColor||a.color)},_drawPath:function(){var a,b,c,d,f,g;for(this._ctx.beginPath(),a=0,c=this._parts.length;c>a;a++){for(b=0,d=this._parts[a].length;d>b;b++)f=this._parts[a][b],g=(0===b?"move":"line")+"To",this._ctx[g](f.x,f.y);this instanceof e.Polygon&&this._ctx.closePath()}},_checkIfEmpty:function(){return!this._parts.length},_updatePath:function(){if(!this._checkIfEmpty()){var a=this._ctx,b=this.options;this._drawPath(),a.save(),this._updateStyle(),b.fill&&(a.globalAlpha=b.fillOpacity,a.fill()),b.stroke&&(a.globalAlpha=b.opacity,a.stroke()),a.restore()}},_initEvents:function(){this.options.clickable&&(this._map.on("mousemove",this._onMouseMove,this),this._map.on("click",this._onClick,this))},_onClick:function(a){this._containsPoint(a.layerPoint)&&this.fire("click",a)},_onMouseMove:function(a){this._map&&!this._map._animatingZoom&&(this._containsPoint(a.layerPoint)?(this._ctx.canvas.style.cursor="pointer",this._mouseInside=!0,this.fire("mouseover",a)):this._mouseInside&&(this._ctx.canvas.style.cursor="",this._mouseInside=!1,this.fire("mouseout",a)))}}),e.Map.include(e.Path.SVG&&!a.L_PREFER_CANVAS||!e.Browser.canvas?{}:{_initPathRoot:function(){var a,c=this._pathRoot;c||(c=this._pathRoot=b.createElement("canvas"),c.style.position="absolute",a=this._canvasCtx=c.getContext("2d"),a.lineCap="round",a.lineJoin="round",this._panes.overlayPane.appendChild(c),this.options.zoomAnimation&&(this._pathRoot.className="leaflet-zoom-animated",this.on("zoomanim",this._animatePathZoom),this.on("zoomend",this._endPathZoom)),this.on("moveend",this._updateCanvasViewport),this._updateCanvasViewport())},_updateCanvasViewport:function(){if(!this._pathZooming){this._updatePathViewport();var a=this._pathViewport,b=a.min,c=a.max.subtract(b),d=this._pathRoot;e.DomUtil.setPosition(d,b),d.width=c.x,d.height=c.y,d.getContext("2d").translate(-b.x,-b.y)}}}),e.LineUtil={simplify:function(a,b){if(!b||!a.length)return a.slice();var c=b*b;return a=this._reducePoints(a,c),a=this._simplifyDP(a,c)},pointToSegmentDistance:function(a,b,c){return Math.sqrt(this._sqClosestPointOnSegment(a,b,c,!0))},closestPointOnSegment:function(a,b,c){return this._sqClosestPointOnSegment(a,b,c)},_simplifyDP:function(a,b){var d=a.length,e=typeof Uint8Array!=c+""?Uint8Array:Array,f=new e(d);f[0]=f[d-1]=1,this._simplifyDPStep(a,f,b,0,d-1);var g,h=[];for(g=0;d>g;g++)f[g]&&h.push(a[g]);return h},_simplifyDPStep:function(a,b,c,d,e){var f,g,h,i=0;for(g=d+1;e-1>=g;g++)h=this._sqClosestPointOnSegment(a[g],a[d],a[e],!0),h>i&&(f=g,i=h);i>c&&(b[f]=1,this._simplifyDPStep(a,b,c,d,f),this._simplifyDPStep(a,b,c,f,e))},_reducePoints:function(a,b){for(var c=[a[0]],d=1,e=0,f=a.length;f>d;d++)this._sqDist(a[d],a[e])>b&&(c.push(a[d]),e=d);return f-1>e&&c.push(a[f-1]),c},clipSegment:function(a,b,c,d){var e,f,g,h=d?this._lastCode:this._getBitCode(a,c),i=this._getBitCode(b,c);for(this._lastCode=i;;){if(!(h|i))return[a,b];if(h&i)return!1;e=h||i,f=this._getEdgeIntersection(a,b,e,c),g=this._getBitCode(f,c),e===h?(a=f,h=g):(b=f,i=g)}},_getEdgeIntersection:function(a,b,c,d){var f=b.x-a.x,g=b.y-a.y,h=d.min,i=d.max;return 8&c?new e.Point(a.x+f*(i.y-a.y)/g,i.y):4&c?new e.Point(a.x+f*(h.y-a.y)/g,h.y):2&c?new e.Point(i.x,a.y+g*(i.x-a.x)/f):1&c?new e.Point(h.x,a.y+g*(h.x-a.x)/f):void 0},_getBitCode:function(a,b){var c=0;return a.x<b.min.x?c|=1:a.x>b.max.x&&(c|=2),a.y<b.min.y?c|=4:a.y>b.max.y&&(c|=8),c},_sqDist:function(a,b){var c=b.x-a.x,d=b.y-a.y;return c*c+d*d},_sqClosestPointOnSegment:function(a,b,c,d){var f,g=b.x,h=b.y,i=c.x-g,j=c.y-h,k=i*i+j*j;return k>0&&(f=((a.x-g)*i+(a.y-h)*j)/k,f>1?(g=c.x,h=c.y):f>0&&(g+=i*f,h+=j*f)),i=a.x-g,j=a.y-h,d?i*i+j*j:new e.Point(g,h)}},e.Polyline=e.Path.extend({initialize:function(a,b){e.Path.prototype.initialize.call(this,b),this._latlngs=this._convertLatLngs(a)},options:{smoothFactor:1,noClip:!1},projectLatlngs:function(){this._originalPoints=[];for(var a=0,b=this._latlngs.length;b>a;a++)this._originalPoints[a]=this._map.latLngToLayerPoint(this._latlngs[a])},getPathString:function(){for(var a=0,b=this._parts.length,c="";b>a;a++)c+=this._getPathPartStr(this._parts[a]);return c},getLatLngs:function(){return this._latlngs},setLatLngs:function(a){return this._latlngs=this._convertLatLngs(a),this.redraw()},addLatLng:function(a){return this._latlngs.push(e.latLng(a)),this.redraw()},spliceLatLngs:function(){var a=[].splice.apply(this._latlngs,arguments);return this._convertLatLngs(this._latlngs,!0),this.redraw(),a},closestLayerPoint:function(a){for(var b,c,d=1/0,f=this._parts,g=null,h=0,i=f.length;i>h;h++)for(var j=f[h],k=1,l=j.length;l>k;k++){b=j[k-1],c=j[k];var m=e.LineUtil._sqClosestPointOnSegment(a,b,c,!0);d>m&&(d=m,g=e.LineUtil._sqClosestPointOnSegment(a,b,c))}return g&&(g.distance=Math.sqrt(d)),g},getBounds:function(){return new e.LatLngBounds(this.getLatLngs())},_convertLatLngs:function(a,b){var c,d,f=b?a:[];for(c=0,d=a.length;d>c;c++){if(e.Util.isArray(a[c])&&"number"!=typeof a[c][0])return;f[c]=e.latLng(a[c])}return f},_initEvents:function(){e.Path.prototype._initEvents.call(this)},_getPathPartStr:function(a){for(var b,c=e.Path.VML,d=0,f=a.length,g="";f>d;d++)b=a[d],c&&b._round(),g+=(d?"L":"M")+b.x+" "+b.y;return g},_clipPoints:function(){var a,b,c,d=this._originalPoints,f=d.length;if(this.options.noClip)return void(this._parts=[d]);this._parts=[];var g=this._parts,h=this._map._pathViewport,i=e.LineUtil;for(a=0,b=0;f-1>a;a++)c=i.clipSegment(d[a],d[a+1],h,a),c&&(g[b]=g[b]||[],g[b].push(c[0]),(c[1]!==d[a+1]||a===f-2)&&(g[b].push(c[1]),b++))},_simplifyPoints:function(){for(var a=this._parts,b=e.LineUtil,c=0,d=a.length;d>c;c++)a[c]=b.simplify(a[c],this.options.smoothFactor)},_updatePath:function(){this._map&&(this._clipPoints(),this._simplifyPoints(),e.Path.prototype._updatePath.call(this))}}),e.polyline=function(a,b){return new e.Polyline(a,b)},e.PolyUtil={},e.PolyUtil.clipPolygon=function(a,b){var c,d,f,g,h,i,j,k,l,m=[1,4,2,8],n=e.LineUtil;for(d=0,j=a.length;j>d;d++)a[d]._code=n._getBitCode(a[d],b);for(g=0;4>g;g++){for(k=m[g],c=[],d=0,j=a.length,f=j-1;j>d;f=d++)h=a[d],i=a[f],h._code&k?i._code&k||(l=n._getEdgeIntersection(i,h,k,b),l._code=n._getBitCode(l,b),c.push(l)):(i._code&k&&(l=n._getEdgeIntersection(i,h,k,b),l._code=n._getBitCode(l,b),c.push(l)),c.push(h));a=c}return a},e.Polygon=e.Polyline.extend({options:{fill:!0},initialize:function(a,b){e.Polyline.prototype.initialize.call(this,a,b),this._initWithHoles(a)},_initWithHoles:function(a){var b,c,d;if(a&&e.Util.isArray(a[0])&&"number"!=typeof a[0][0])for(this._latlngs=this._convertLatLngs(a[0]),this._holes=a.slice(1),b=0,c=this._holes.length;c>b;b++)d=this._holes[b]=this._convertLatLngs(this._holes[b]),d[0].equals(d[d.length-1])&&d.pop();a=this._latlngs,a.length>=2&&a[0].equals(a[a.length-1])&&a.pop()},projectLatlngs:function(){if(e.Polyline.prototype.projectLatlngs.call(this),this._holePoints=[],this._holes){var a,b,c,d;for(a=0,c=this._holes.length;c>a;a++)for(this._holePoints[a]=[],b=0,d=this._holes[a].length;d>b;b++)this._holePoints[a][b]=this._map.latLngToLayerPoint(this._holes[a][b])}},setLatLngs:function(a){return a&&e.Util.isArray(a[0])&&"number"!=typeof a[0][0]?(this._initWithHoles(a),this.redraw()):e.Polyline.prototype.setLatLngs.call(this,a)},_clipPoints:function(){var a=this._originalPoints,b=[];if(this._parts=[a].concat(this._holePoints),!this.options.noClip){for(var c=0,d=this._parts.length;d>c;c++){var f=e.PolyUtil.clipPolygon(this._parts[c],this._map._pathViewport);f.length&&b.push(f)}this._parts=b}},_getPathPartStr:function(a){var b=e.Polyline.prototype._getPathPartStr.call(this,a);return b+(e.Browser.svg?"z":"x")}}),e.polygon=function(a,b){return new e.Polygon(a,b)},function(){function a(a){return e.FeatureGroup.extend({initialize:function(a,b){this._layers={},this._options=b,this.setLatLngs(a)},setLatLngs:function(b){var c=0,d=b.length;for(this.eachLayer(function(a){d>c?a.setLatLngs(b[c++]):this.removeLayer(a)},this);d>c;)this.addLayer(new a(b[c++],this._options));return this},getLatLngs:function(){var a=[];return this.eachLayer(function(b){a.push(b.getLatLngs())}),a}})}e.MultiPolyline=a(e.Polyline),e.MultiPolygon=a(e.Polygon),e.multiPolyline=function(a,b){return new e.MultiPolyline(a,b)},e.multiPolygon=function(a,b){return new e.MultiPolygon(a,b)}}(),e.Rectangle=e.Polygon.extend({initialize:function(a,b){e.Polygon.prototype.initialize.call(this,this._boundsToLatLngs(a),b)},setBounds:function(a){this.setLatLngs(this._boundsToLatLngs(a))},_boundsToLatLngs:function(a){return a=e.latLngBounds(a),[a.getSouthWest(),a.getNorthWest(),a.getNorthEast(),a.getSouthEast()]}}),e.rectangle=function(a,b){return new e.Rectangle(a,b)},e.Circle=e.Path.extend({initialize:function(a,b,c){e.Path.prototype.initialize.call(this,c),this._latlng=e.latLng(a),this._mRadius=b},options:{fill:!0},setLatLng:function(a){return this._latlng=e.latLng(a),this.redraw()},setRadius:function(a){return this._mRadius=a,this.redraw()},projectLatlngs:function(){var a=this._getLngRadius(),b=this._latlng,c=this._map.latLngToLayerPoint([b.lat,b.lng-a]);this._point=this._map.latLngToLayerPoint(b),this._radius=Math.max(this._point.x-c.x,1)},getBounds:function(){var a=this._getLngRadius(),b=this._mRadius/40075017*360,c=this._latlng;return new e.LatLngBounds([c.lat-b,c.lng-a],[c.lat+b,c.lng+a])},getLatLng:function(){return this._latlng},getPathString:function(){var a=this._point,b=this._radius;return this._checkIfEmpty()?"":e.Browser.svg?"M"+a.x+","+(a.y-b)+"A"+b+","+b+",0,1,1,"+(a.x-.1)+","+(a.y-b)+" z":(a._round(),b=Math.round(b),"AL "+a.x+","+a.y+" "+b+","+b+" 0,23592600")},getRadius:function(){return this._mRadius},_getLatRadius:function(){return this._mRadius/40075017*360},_getLngRadius:function(){return this._getLatRadius()/Math.cos(e.LatLng.DEG_TO_RAD*this._latlng.lat)},_checkIfEmpty:function(){if(!this._map)return!1;var a=this._map._pathViewport,b=this._radius,c=this._point;return c.x-b>a.max.x||c.y-b>a.max.y||c.x+b<a.min.x||c.y+b<a.min.y}}),e.circle=function(a,b,c){return new e.Circle(a,b,c)},e.CircleMarker=e.Circle.extend({options:{radius:10,weight:2},initialize:function(a,b){e.Circle.prototype.initialize.call(this,a,null,b),this._radius=this.options.radius},projectLatlngs:function(){this._point=this._map.latLngToLayerPoint(this._latlng)},_updateStyle:function(){e.Circle.prototype._updateStyle.call(this),this.setRadius(this.options.radius)},setLatLng:function(a){return e.Circle.prototype.setLatLng.call(this,a),this._popup&&this._popup._isOpen&&this._popup.setLatLng(a),this},setRadius:function(a){return this.options.radius=this._radius=a,this.redraw()},getRadius:function(){return this._radius}}),e.circleMarker=function(a,b){return new e.CircleMarker(a,b)},e.Polyline.include(e.Path.CANVAS?{_containsPoint:function(a,b){var c,d,f,g,h,i,j,k=this.options.weight/2;for(e.Browser.touch&&(k+=10),c=0,g=this._parts.length;g>c;c++)for(j=this._parts[c],d=0,h=j.length,f=h-1;h>d;f=d++)if((b||0!==d)&&(i=e.LineUtil.pointToSegmentDistance(a,j[f],j[d]),k>=i))return!0;return!1}}:{}),e.Polygon.include(e.Path.CANVAS?{_containsPoint:function(a){var b,c,d,f,g,h,i,j,k=!1;if(e.Polyline.prototype._containsPoint.call(this,a,!0))return!0;for(f=0,i=this._parts.length;i>f;f++)for(b=this._parts[f],g=0,j=b.length,h=j-1;j>g;h=g++)c=b[g],d=b[h],c.y>a.y!=d.y>a.y&&a.x<(d.x-c.x)*(a.y-c.y)/(d.y-c.y)+c.x&&(k=!k);return k}}:{}),e.Circle.include(e.Path.CANVAS?{_drawPath:function(){var a=this._point;this._ctx.beginPath(),this._ctx.arc(a.x,a.y,this._radius,0,2*Math.PI,!1)},_containsPoint:function(a){var b=this._point,c=this.options.stroke?this.options.weight/2:0;return a.distanceTo(b)<=this._radius+c}}:{}),e.CircleMarker.include(e.Path.CANVAS?{_updateStyle:function(){e.Path.prototype._updateStyle.call(this)}}:{}),e.GeoJSON=e.FeatureGroup.extend({initialize:function(a,b){e.setOptions(this,b),this._layers={},a&&this.addData(a)},addData:function(a){var b,c,d,f=e.Util.isArray(a)?a:a.features;if(f){for(b=0,c=f.length;c>b;b++)d=f[b],(d.geometries||d.geometry||d.features||d.coordinates)&&this.addData(f[b]);return this}var g=this.options;if(!g.filter||g.filter(a)){var h=e.GeoJSON.geometryToLayer(a,g.pointToLayer,g.coordsToLatLng,g);return h.feature=e.GeoJSON.asFeature(a),h.defaultOptions=h.options,this.resetStyle(h),g.onEachFeature&&g.onEachFeature(a,h),this.addLayer(h)}},resetStyle:function(a){var b=this.options.style;b&&(e.Util.extend(a.options,a.defaultOptions),this._setLayerStyle(a,b))},setStyle:function(a){this.eachLayer(function(b){this._setLayerStyle(b,a)},this)},_setLayerStyle:function(a,b){"function"==typeof b&&(b=b(a.feature)),a.setStyle&&a.setStyle(b)}}),e.extend(e.GeoJSON,{geometryToLayer:function(a,b,c,d){var f,g,h,i,j="Feature"===a.type?a.geometry:a,k=j.coordinates,l=[];switch(c=c||this.coordsToLatLng,j.type){case"Point":return f=c(k),b?b(a,f):new e.Marker(f);case"MultiPoint":for(h=0,i=k.length;i>h;h++)f=c(k[h]),l.push(b?b(a,f):new e.Marker(f));return new e.FeatureGroup(l);case"LineString":return g=this.coordsToLatLngs(k,0,c),new e.Polyline(g,d);case"Polygon":if(2===k.length&&!k[1].length)throw new Error("Invalid GeoJSON object.");return g=this.coordsToLatLngs(k,1,c),new e.Polygon(g,d);case"MultiLineString":return g=this.coordsToLatLngs(k,1,c),new e.MultiPolyline(g,d);case"MultiPolygon":return g=this.coordsToLatLngs(k,2,c),new e.MultiPolygon(g,d);case"GeometryCollection":for(h=0,i=j.geometries.length;i>h;h++)l.push(this.geometryToLayer({geometry:j.geometries[h],type:"Feature",properties:a.properties},b,c,d));return new e.FeatureGroup(l);default:throw new Error("Invalid GeoJSON object.")}},coordsToLatLng:function(a){return new e.LatLng(a[1],a[0],a[2])},coordsToLatLngs:function(a,b,c){var d,e,f,g=[];for(e=0,f=a.length;f>e;e++)d=b?this.coordsToLatLngs(a[e],b-1,c):(c||this.coordsToLatLng)(a[e]),g.push(d);return g},latLngToCoords:function(a){var b=[a.lng,a.lat];return a.alt!==c&&b.push(a.alt),b},latLngsToCoords:function(a){for(var b=[],c=0,d=a.length;d>c;c++)b.push(e.GeoJSON.latLngToCoords(a[c]));return b},getFeature:function(a,b){return a.feature?e.extend({},a.feature,{geometry:b}):e.GeoJSON.asFeature(b)},asFeature:function(a){return"Feature"===a.type?a:{type:"Feature",properties:{},geometry:a}}});var g={toGeoJSON:function(){return e.GeoJSON.getFeature(this,{type:"Point",coordinates:e.GeoJSON.latLngToCoords(this.getLatLng())})}};e.Marker.include(g),e.Circle.include(g),e.CircleMarker.include(g),e.Polyline.include({toGeoJSON:function(){return e.GeoJSON.getFeature(this,{type:"LineString",coordinates:e.GeoJSON.latLngsToCoords(this.getLatLngs())})}}),e.Polygon.include({toGeoJSON:function(){var a,b,c,d=[e.GeoJSON.latLngsToCoords(this.getLatLngs())];if(d[0].push(d[0][0]),this._holes)for(a=0,b=this._holes.length;b>a;a++)c=e.GeoJSON.latLngsToCoords(this._holes[a]),c.push(c[0]),d.push(c);return e.GeoJSON.getFeature(this,{type:"Polygon",coordinates:d})}}),function(){function a(a){return function(){var b=[];return this.eachLayer(function(a){b.push(a.toGeoJSON().geometry.coordinates)}),e.GeoJSON.getFeature(this,{type:a,coordinates:b})}}e.MultiPolyline.include({toGeoJSON:a("MultiLineString")}),e.MultiPolygon.include({toGeoJSON:a("MultiPolygon")}),e.LayerGroup.include({toGeoJSON:function(){var b,c=this.feature&&this.feature.geometry,d=[];if(c&&"MultiPoint"===c.type)return a("MultiPoint").call(this);var f=c&&"GeometryCollection"===c.type;return this.eachLayer(function(a){a.toGeoJSON&&(b=a.toGeoJSON(),d.push(f?b.geometry:e.GeoJSON.asFeature(b)))}),f?e.GeoJSON.getFeature(this,{geometries:d,type:"GeometryCollection"}):{type:"FeatureCollection",features:d}}})}(),e.geoJson=function(a,b){return new e.GeoJSON(a,b)},e.DomEvent={addListener:function(a,b,c,d){var f,g,h,i=e.stamp(c),j="_leaflet_"+b+i;return a[j]?this:(f=function(b){return c.call(d||a,b||e.DomEvent._getEvent())},e.Browser.pointer&&0===b.indexOf("touch")?this.addPointerListener(a,b,f,i):(e.Browser.touch&&"dblclick"===b&&this.addDoubleTapListener&&this.addDoubleTapListener(a,f,i),"addEventListener"in a?"mousewheel"===b?(a.addEventListener("DOMMouseScroll",f,!1),a.addEventListener(b,f,!1)):"mouseenter"===b||"mouseleave"===b?(g=f,h="mouseenter"===b?"mouseover":"mouseout",f=function(b){return e.DomEvent._checkMouse(a,b)?g(b):void 0},a.addEventListener(h,f,!1)):"click"===b&&e.Browser.android?(g=f,f=function(a){return e.DomEvent._filterClick(a,g)},a.addEventListener(b,f,!1)):a.addEventListener(b,f,!1):"attachEvent"in a&&a.attachEvent("on"+b,f),a[j]=f,this))},removeListener:function(a,b,c){var d=e.stamp(c),f="_leaflet_"+b+d,g=a[f];return g?(e.Browser.pointer&&0===b.indexOf("touch")?this.removePointerListener(a,b,d):e.Browser.touch&&"dblclick"===b&&this.removeDoubleTapListener?this.removeDoubleTapListener(a,d):"removeEventListener"in a?"mousewheel"===b?(a.removeEventListener("DOMMouseScroll",g,!1),a.removeEventListener(b,g,!1)):"mouseenter"===b||"mouseleave"===b?a.removeEventListener("mouseenter"===b?"mouseover":"mouseout",g,!1):a.removeEventListener(b,g,!1):"detachEvent"in a&&a.detachEvent("on"+b,g),a[f]=null,this):this},stopPropagation:function(a){return a.stopPropagation?a.stopPropagation():a.cancelBubble=!0,e.DomEvent._skipped(a),this},disableScrollPropagation:function(a){var b=e.DomEvent.stopPropagation;return e.DomEvent.on(a,"mousewheel",b).on(a,"MozMousePixelScroll",b)},disableClickPropagation:function(a){for(var b=e.DomEvent.stopPropagation,c=e.Draggable.START.length-1;c>=0;c--)e.DomEvent.on(a,e.Draggable.START[c],b);return e.DomEvent.on(a,"click",e.DomEvent._fakeStop).on(a,"dblclick",b)},preventDefault:function(a){return a.preventDefault?a.preventDefault():a.returnValue=!1,this},stop:function(a){return e.DomEvent.preventDefault(a).stopPropagation(a)},getMousePosition:function(a,b){if(!b)return new e.Point(a.clientX,a.clientY);var c=b.getBoundingClientRect();return new e.Point(a.clientX-c.left-b.clientLeft,a.clientY-c.top-b.clientTop)},getWheelDelta:function(a){var b=0;return a.wheelDelta&&(b=a.wheelDelta/120),a.detail&&(b=-a.detail/3),b},_skipEvents:{},_fakeStop:function(a){e.DomEvent._skipEvents[a.type]=!0},_skipped:function(a){var b=this._skipEvents[a.type];return this._skipEvents[a.type]=!1,b},_checkMouse:function(a,b){var c=b.relatedTarget;if(!c)return!0;try{for(;c&&c!==a;)c=c.parentNode}catch(d){return!1}return c!==a},_getEvent:function(){var b=a.event;if(!b)for(var c=arguments.callee.caller;c&&(b=c.arguments[0],!b||a.Event!==b.constructor);)c=c.caller;return b},_filterClick:function(a,b){var c=a.timeStamp||a.originalEvent.timeStamp,d=e.DomEvent._lastClick&&c-e.DomEvent._lastClick;return d&&d>100&&500>d||a.target._simulatedClick&&!a._simulated?void e.DomEvent.stop(a):(e.DomEvent._lastClick=c,b(a))}},e.DomEvent.on=e.DomEvent.addListener,e.DomEvent.off=e.DomEvent.removeListener,e.Draggable=e.Class.extend({includes:e.Mixin.Events,statics:{START:e.Browser.touch?["touchstart","mousedown"]:["mousedown"],END:{mousedown:"mouseup",touchstart:"touchend",pointerdown:"touchend",MSPointerDown:"touchend"},MOVE:{mousedown:"mousemove",touchstart:"touchmove",pointerdown:"touchmove",MSPointerDown:"touchmove"}},initialize:function(a,b){this._element=a,this._dragStartTarget=b||a},enable:function(){if(!this._enabled){for(var a=e.Draggable.START.length-1;a>=0;a--)e.DomEvent.on(this._dragStartTarget,e.Draggable.START[a],this._onDown,this);this._enabled=!0}},disable:function(){if(this._enabled){for(var a=e.Draggable.START.length-1;a>=0;a--)e.DomEvent.off(this._dragStartTarget,e.Draggable.START[a],this._onDown,this);this._enabled=!1,this._moved=!1}},_onDown:function(a){if(this._moved=!1,!(a.shiftKey||1!==a.which&&1!==a.button&&!a.touches||(e.DomEvent.stopPropagation(a),e.Draggable._disabled||(e.DomUtil.disableImageDrag(),e.DomUtil.disableTextSelection(),this._moving)))){var c=a.touches?a.touches[0]:a;this._startPoint=new e.Point(c.clientX,c.clientY),this._startPos=this._newPos=e.DomUtil.getPosition(this._element),e.DomEvent.on(b,e.Draggable.MOVE[a.type],this._onMove,this).on(b,e.Draggable.END[a.type],this._onUp,this)}},_onMove:function(a){if(a.touches&&a.touches.length>1)return void(this._moved=!0);var c=a.touches&&1===a.touches.length?a.touches[0]:a,d=new e.Point(c.clientX,c.clientY),f=d.subtract(this._startPoint);(f.x||f.y)&&(e.Browser.touch&&Math.abs(f.x)+Math.abs(f.y)<3||(e.DomEvent.preventDefault(a),this._moved||(this.fire("dragstart"),this._moved=!0,this._startPos=e.DomUtil.getPosition(this._element).subtract(f),e.DomUtil.addClass(b.body,"leaflet-dragging"),this._lastTarget=a.target||a.srcElement,e.DomUtil.addClass(this._lastTarget,"leaflet-drag-target")),this._newPos=this._startPos.add(f),this._moving=!0,e.Util.cancelAnimFrame(this._animRequest),this._animRequest=e.Util.requestAnimFrame(this._updatePosition,this,!0,this._dragStartTarget)))},_updatePosition:function(){this.fire("predrag"),e.DomUtil.setPosition(this._element,this._newPos),this.fire("drag")},_onUp:function(){e.DomUtil.removeClass(b.body,"leaflet-dragging"),this._lastTarget&&(e.DomUtil.removeClass(this._lastTarget,"leaflet-drag-target"),this._lastTarget=null);for(var a in e.Draggable.MOVE)e.DomEvent.off(b,e.Draggable.MOVE[a],this._onMove).off(b,e.Draggable.END[a],this._onUp);e.DomUtil.enableImageDrag(),e.DomUtil.enableTextSelection(),this._moved&&this._moving&&(e.Util.cancelAnimFrame(this._animRequest),this.fire("dragend",{distance:this._newPos.distanceTo(this._startPos)})),this._moving=!1}}),e.Handler=e.Class.extend({initialize:function(a){this._map=a},enable:function(){this._enabled||(this._enabled=!0,this.addHooks())},disable:function(){this._enabled&&(this._enabled=!1,this.removeHooks())},enabled:function(){return!!this._enabled}}),e.Map.mergeOptions({dragging:!0,inertia:!e.Browser.android23,inertiaDeceleration:3400,inertiaMaxSpeed:1/0,inertiaThreshold:e.Browser.touch?32:18,easeLinearity:.25,worldCopyJump:!1}),e.Map.Drag=e.Handler.extend({addHooks:function(){if(!this._draggable){var a=this._map;this._draggable=new e.Draggable(a._mapPane,a._container),this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this),a.options.worldCopyJump&&(this._draggable.on("predrag",this._onPreDrag,this),a.on("viewreset",this._onViewReset,this),a.whenReady(this._onViewReset,this))}this._draggable.enable()},removeHooks:function(){this._draggable.disable()},moved:function(){return this._draggable&&this._draggable._moved},_onDragStart:function(){var a=this._map;a._panAnim&&a._panAnim.stop(),a.fire("movestart").fire("dragstart"),a.options.inertia&&(this._positions=[],this._times=[])},_onDrag:function(){if(this._map.options.inertia){var a=this._lastTime=+new Date,b=this._lastPos=this._draggable._newPos;this._positions.push(b),this._times.push(a),a-this._times[0]>200&&(this._positions.shift(),this._times.shift())}this._map.fire("move").fire("drag")},_onViewReset:function(){var a=this._map.getSize()._divideBy(2),b=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=b.subtract(a).x,this._worldWidth=this._map.project([0,180]).x},_onPreDrag:function(){var a=this._worldWidth,b=Math.round(a/2),c=this._initialWorldOffset,d=this._draggable._newPos.x,e=(d-b+c)%a+b-c,f=(d+b+c)%a-b-c,g=Math.abs(e+c)<Math.abs(f+c)?e:f;this._draggable._newPos.x=g},_onDragEnd:function(a){var b=this._map,c=b.options,d=+new Date-this._lastTime,f=!c.inertia||d>c.inertiaThreshold||!this._positions[0];if(b.fire("dragend",a),f)b.fire("moveend");else{var g=this._lastPos.subtract(this._positions[0]),h=(this._lastTime+d-this._times[0])/1e3,i=c.easeLinearity,j=g.multiplyBy(i/h),k=j.distanceTo([0,0]),l=Math.min(c.inertiaMaxSpeed,k),m=j.multiplyBy(l/k),n=l/(c.inertiaDeceleration*i),o=m.multiplyBy(-n/2).round();o.x&&o.y?(o=b._limitOffset(o,b.options.maxBounds),e.Util.requestAnimFrame(function(){b.panBy(o,{duration:n,easeLinearity:i,noMoveStart:!0})})):b.fire("moveend")}}}),e.Map.addInitHook("addHandler","dragging",e.Map.Drag),e.Map.mergeOptions({doubleClickZoom:!0}),e.Map.DoubleClickZoom=e.Handler.extend({addHooks:function(){this._map.on("dblclick",this._onDoubleClick,this)},removeHooks:function(){this._map.off("dblclick",this._onDoubleClick,this)},_onDoubleClick:function(a){var b=this._map,c=b.getZoom()+(a.originalEvent.shiftKey?-1:1);"center"===b.options.doubleClickZoom?b.setZoom(c):b.setZoomAround(a.containerPoint,c)}}),e.Map.addInitHook("addHandler","doubleClickZoom",e.Map.DoubleClickZoom),e.Map.mergeOptions({scrollWheelZoom:!0}),e.Map.ScrollWheelZoom=e.Handler.extend({addHooks:function(){e.DomEvent.on(this._map._container,"mousewheel",this._onWheelScroll,this),e.DomEvent.on(this._map._container,"MozMousePixelScroll",e.DomEvent.preventDefault),this._delta=0},removeHooks:function(){e.DomEvent.off(this._map._container,"mousewheel",this._onWheelScroll),e.DomEvent.off(this._map._container,"MozMousePixelScroll",e.DomEvent.preventDefault)},_onWheelScroll:function(a){var b=e.DomEvent.getWheelDelta(a);this._delta+=b,this._lastMousePos=this._map.mouseEventToContainerPoint(a),this._startTime||(this._startTime=+new Date);var c=Math.max(40-(+new Date-this._startTime),0);clearTimeout(this._timer),this._timer=setTimeout(e.bind(this._performZoom,this),c),e.DomEvent.preventDefault(a),e.DomEvent.stopPropagation(a)},_performZoom:function(){var a=this._map,b=this._delta,c=a.getZoom();b=b>0?Math.ceil(b):Math.floor(b),b=Math.max(Math.min(b,4),-4),b=a._limitZoom(c+b)-c,this._delta=0,this._startTime=null,b&&("center"===a.options.scrollWheelZoom?a.setZoom(c+b):a.setZoomAround(this._lastMousePos,c+b))}}),e.Map.addInitHook("addHandler","scrollWheelZoom",e.Map.ScrollWheelZoom),e.extend(e.DomEvent,{_touchstart:e.Browser.msPointer?"MSPointerDown":e.Browser.pointer?"pointerdown":"touchstart",_touchend:e.Browser.msPointer?"MSPointerUp":e.Browser.pointer?"pointerup":"touchend",addDoubleTapListener:function(a,c,d){function f(a){var b;if(e.Browser.pointer?(o.push(a.pointerId),b=o.length):b=a.touches.length,!(b>1)){var c=Date.now(),d=c-(h||c);i=a.touches?a.touches[0]:a,j=d>0&&k>=d,h=c}}function g(a){if(e.Browser.pointer){var b=o.indexOf(a.pointerId);if(-1===b)return;o.splice(b,1)}if(j){if(e.Browser.pointer){var d,f={};for(var g in i)d=i[g],f[g]="function"==typeof d?d.bind(i):d;i=f}i.type="dblclick",c(i),h=null}}var h,i,j=!1,k=250,l="_leaflet_",m=this._touchstart,n=this._touchend,o=[];a[l+m+d]=f,a[l+n+d]=g;var p=e.Browser.pointer?b.documentElement:a;return a.addEventListener(m,f,!1),p.addEventListener(n,g,!1),e.Browser.pointer&&p.addEventListener(e.DomEvent.POINTER_CANCEL,g,!1),this},removeDoubleTapListener:function(a,c){var d="_leaflet_";return a.removeEventListener(this._touchstart,a[d+this._touchstart+c],!1),(e.Browser.pointer?b.documentElement:a).removeEventListener(this._touchend,a[d+this._touchend+c],!1),e.Browser.pointer&&b.documentElement.removeEventListener(e.DomEvent.POINTER_CANCEL,a[d+this._touchend+c],!1),this}}),e.extend(e.DomEvent,{POINTER_DOWN:e.Browser.msPointer?"MSPointerDown":"pointerdown",POINTER_MOVE:e.Browser.msPointer?"MSPointerMove":"pointermove",POINTER_UP:e.Browser.msPointer?"MSPointerUp":"pointerup",POINTER_CANCEL:e.Browser.msPointer?"MSPointerCancel":"pointercancel",_pointers:[],_pointerDocumentListener:!1,addPointerListener:function(a,b,c,d){switch(b){case"touchstart":return this.addPointerListenerStart(a,b,c,d);case"touchend":return this.addPointerListenerEnd(a,b,c,d);case"touchmove":return this.addPointerListenerMove(a,b,c,d);default:throw"Unknown touch event type"}},addPointerListenerStart:function(a,c,d,f){var g="_leaflet_",h=this._pointers,i=function(a){e.DomEvent.preventDefault(a);for(var b=!1,c=0;c<h.length;c++)if(h[c].pointerId===a.pointerId){b=!0;
break}b||h.push(a),a.touches=h.slice(),a.changedTouches=[a],d(a)};if(a[g+"touchstart"+f]=i,a.addEventListener(this.POINTER_DOWN,i,!1),!this._pointerDocumentListener){var j=function(a){for(var b=0;b<h.length;b++)if(h[b].pointerId===a.pointerId){h.splice(b,1);break}};b.documentElement.addEventListener(this.POINTER_UP,j,!1),b.documentElement.addEventListener(this.POINTER_CANCEL,j,!1),this._pointerDocumentListener=!0}return this},addPointerListenerMove:function(a,b,c,d){function e(a){if(a.pointerType!==a.MSPOINTER_TYPE_MOUSE&&"mouse"!==a.pointerType||0!==a.buttons){for(var b=0;b<g.length;b++)if(g[b].pointerId===a.pointerId){g[b]=a;break}a.touches=g.slice(),a.changedTouches=[a],c(a)}}var f="_leaflet_",g=this._pointers;return a[f+"touchmove"+d]=e,a.addEventListener(this.POINTER_MOVE,e,!1),this},addPointerListenerEnd:function(a,b,c,d){var e="_leaflet_",f=this._pointers,g=function(a){for(var b=0;b<f.length;b++)if(f[b].pointerId===a.pointerId){f.splice(b,1);break}a.touches=f.slice(),a.changedTouches=[a],c(a)};return a[e+"touchend"+d]=g,a.addEventListener(this.POINTER_UP,g,!1),a.addEventListener(this.POINTER_CANCEL,g,!1),this},removePointerListener:function(a,b,c){var d="_leaflet_",e=a[d+b+c];switch(b){case"touchstart":a.removeEventListener(this.POINTER_DOWN,e,!1);break;case"touchmove":a.removeEventListener(this.POINTER_MOVE,e,!1);break;case"touchend":a.removeEventListener(this.POINTER_UP,e,!1),a.removeEventListener(this.POINTER_CANCEL,e,!1)}return this}}),e.Map.mergeOptions({touchZoom:e.Browser.touch&&!e.Browser.android23,bounceAtZoomLimits:!0}),e.Map.TouchZoom=e.Handler.extend({addHooks:function(){e.DomEvent.on(this._map._container,"touchstart",this._onTouchStart,this)},removeHooks:function(){e.DomEvent.off(this._map._container,"touchstart",this._onTouchStart,this)},_onTouchStart:function(a){var c=this._map;if(a.touches&&2===a.touches.length&&!c._animatingZoom&&!this._zooming){var d=c.mouseEventToLayerPoint(a.touches[0]),f=c.mouseEventToLayerPoint(a.touches[1]),g=c._getCenterLayerPoint();this._startCenter=d.add(f)._divideBy(2),this._startDist=d.distanceTo(f),this._moved=!1,this._zooming=!0,this._centerOffset=g.subtract(this._startCenter),c._panAnim&&c._panAnim.stop(),e.DomEvent.on(b,"touchmove",this._onTouchMove,this).on(b,"touchend",this._onTouchEnd,this),e.DomEvent.preventDefault(a)}},_onTouchMove:function(a){var b=this._map;if(a.touches&&2===a.touches.length&&this._zooming){var c=b.mouseEventToLayerPoint(a.touches[0]),d=b.mouseEventToLayerPoint(a.touches[1]);this._scale=c.distanceTo(d)/this._startDist,this._delta=c._add(d)._divideBy(2)._subtract(this._startCenter),1!==this._scale&&(b.options.bounceAtZoomLimits||!(b.getZoom()===b.getMinZoom()&&this._scale<1||b.getZoom()===b.getMaxZoom()&&this._scale>1))&&(this._moved||(e.DomUtil.addClass(b._mapPane,"leaflet-touching"),b.fire("movestart").fire("zoomstart"),this._moved=!0),e.Util.cancelAnimFrame(this._animRequest),this._animRequest=e.Util.requestAnimFrame(this._updateOnMove,this,!0,this._map._container),e.DomEvent.preventDefault(a))}},_updateOnMove:function(){var a=this._map,b=this._getScaleOrigin(),c=a.layerPointToLatLng(b),d=a.getScaleZoom(this._scale);a._animateZoom(c,d,this._startCenter,this._scale,this._delta,!1,!0)},_onTouchEnd:function(){if(!this._moved||!this._zooming)return void(this._zooming=!1);var a=this._map;this._zooming=!1,e.DomUtil.removeClass(a._mapPane,"leaflet-touching"),e.Util.cancelAnimFrame(this._animRequest),e.DomEvent.off(b,"touchmove",this._onTouchMove).off(b,"touchend",this._onTouchEnd);var c=this._getScaleOrigin(),d=a.layerPointToLatLng(c),f=a.getZoom(),g=a.getScaleZoom(this._scale)-f,h=g>0?Math.ceil(g):Math.floor(g),i=a._limitZoom(f+h),j=a.getZoomScale(i)/this._scale;a._animateZoom(d,i,c,j)},_getScaleOrigin:function(){var a=this._centerOffset.subtract(this._delta).divideBy(this._scale);return this._startCenter.add(a)}}),e.Map.addInitHook("addHandler","touchZoom",e.Map.TouchZoom),e.Map.mergeOptions({tap:!0,tapTolerance:15}),e.Map.Tap=e.Handler.extend({addHooks:function(){e.DomEvent.on(this._map._container,"touchstart",this._onDown,this)},removeHooks:function(){e.DomEvent.off(this._map._container,"touchstart",this._onDown,this)},_onDown:function(a){if(a.touches){if(e.DomEvent.preventDefault(a),this._fireClick=!0,a.touches.length>1)return this._fireClick=!1,void clearTimeout(this._holdTimeout);var c=a.touches[0],d=c.target;this._startPos=this._newPos=new e.Point(c.clientX,c.clientY),d.tagName&&"a"===d.tagName.toLowerCase()&&e.DomUtil.addClass(d,"leaflet-active"),this._holdTimeout=setTimeout(e.bind(function(){this._isTapValid()&&(this._fireClick=!1,this._onUp(),this._simulateEvent("contextmenu",c))},this),1e3),e.DomEvent.on(b,"touchmove",this._onMove,this).on(b,"touchend",this._onUp,this)}},_onUp:function(a){if(clearTimeout(this._holdTimeout),e.DomEvent.off(b,"touchmove",this._onMove,this).off(b,"touchend",this._onUp,this),this._fireClick&&a&&a.changedTouches){var c=a.changedTouches[0],d=c.target;d&&d.tagName&&"a"===d.tagName.toLowerCase()&&e.DomUtil.removeClass(d,"leaflet-active"),this._isTapValid()&&this._simulateEvent("click",c)}},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance},_onMove:function(a){var b=a.touches[0];this._newPos=new e.Point(b.clientX,b.clientY)},_simulateEvent:function(c,d){var e=b.createEvent("MouseEvents");e._simulated=!0,d.target._simulatedClick=!0,e.initMouseEvent(c,!0,!0,a,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null),d.target.dispatchEvent(e)}}),e.Browser.touch&&!e.Browser.pointer&&e.Map.addInitHook("addHandler","tap",e.Map.Tap),e.Map.mergeOptions({boxZoom:!0}),e.Map.BoxZoom=e.Handler.extend({initialize:function(a){this._map=a,this._container=a._container,this._pane=a._panes.overlayPane,this._moved=!1},addHooks:function(){e.DomEvent.on(this._container,"mousedown",this._onMouseDown,this)},removeHooks:function(){e.DomEvent.off(this._container,"mousedown",this._onMouseDown),this._moved=!1},moved:function(){return this._moved},_onMouseDown:function(a){return this._moved=!1,!a.shiftKey||1!==a.which&&1!==a.button?!1:(e.DomUtil.disableTextSelection(),e.DomUtil.disableImageDrag(),this._startLayerPoint=this._map.mouseEventToLayerPoint(a),void e.DomEvent.on(b,"mousemove",this._onMouseMove,this).on(b,"mouseup",this._onMouseUp,this).on(b,"keydown",this._onKeyDown,this))},_onMouseMove:function(a){this._moved||(this._box=e.DomUtil.create("div","leaflet-zoom-box",this._pane),e.DomUtil.setPosition(this._box,this._startLayerPoint),this._container.style.cursor="crosshair",this._map.fire("boxzoomstart"));var b=this._startLayerPoint,c=this._box,d=this._map.mouseEventToLayerPoint(a),f=d.subtract(b),g=new e.Point(Math.min(d.x,b.x),Math.min(d.y,b.y));e.DomUtil.setPosition(c,g),this._moved=!0,c.style.width=Math.max(0,Math.abs(f.x)-4)+"px",c.style.height=Math.max(0,Math.abs(f.y)-4)+"px"},_finish:function(){this._moved&&(this._pane.removeChild(this._box),this._container.style.cursor=""),e.DomUtil.enableTextSelection(),e.DomUtil.enableImageDrag(),e.DomEvent.off(b,"mousemove",this._onMouseMove).off(b,"mouseup",this._onMouseUp).off(b,"keydown",this._onKeyDown)},_onMouseUp:function(a){this._finish();var b=this._map,c=b.mouseEventToLayerPoint(a);if(!this._startLayerPoint.equals(c)){var d=new e.LatLngBounds(b.layerPointToLatLng(this._startLayerPoint),b.layerPointToLatLng(c));b.fitBounds(d),b.fire("boxzoomend",{boxZoomBounds:d})}},_onKeyDown:function(a){27===a.keyCode&&this._finish()}}),e.Map.addInitHook("addHandler","boxZoom",e.Map.BoxZoom),e.Map.mergeOptions({keyboard:!0,keyboardPanOffset:80,keyboardZoomOffset:1}),e.Map.Keyboard=e.Handler.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,173]},initialize:function(a){this._map=a,this._setPanOffset(a.options.keyboardPanOffset),this._setZoomOffset(a.options.keyboardZoomOffset)},addHooks:function(){var a=this._map._container;-1===a.tabIndex&&(a.tabIndex="0"),e.DomEvent.on(a,"focus",this._onFocus,this).on(a,"blur",this._onBlur,this).on(a,"mousedown",this._onMouseDown,this),this._map.on("focus",this._addHooks,this).on("blur",this._removeHooks,this)},removeHooks:function(){this._removeHooks();var a=this._map._container;e.DomEvent.off(a,"focus",this._onFocus,this).off(a,"blur",this._onBlur,this).off(a,"mousedown",this._onMouseDown,this),this._map.off("focus",this._addHooks,this).off("blur",this._removeHooks,this)},_onMouseDown:function(){if(!this._focused){var c=b.body,d=b.documentElement,e=c.scrollTop||d.scrollTop,f=c.scrollLeft||d.scrollLeft;this._map._container.focus(),a.scrollTo(f,e)}},_onFocus:function(){this._focused=!0,this._map.fire("focus")},_onBlur:function(){this._focused=!1,this._map.fire("blur")},_setPanOffset:function(a){var b,c,d=this._panKeys={},e=this.keyCodes;for(b=0,c=e.left.length;c>b;b++)d[e.left[b]]=[-1*a,0];for(b=0,c=e.right.length;c>b;b++)d[e.right[b]]=[a,0];for(b=0,c=e.down.length;c>b;b++)d[e.down[b]]=[0,a];for(b=0,c=e.up.length;c>b;b++)d[e.up[b]]=[0,-1*a]},_setZoomOffset:function(a){var b,c,d=this._zoomKeys={},e=this.keyCodes;for(b=0,c=e.zoomIn.length;c>b;b++)d[e.zoomIn[b]]=a;for(b=0,c=e.zoomOut.length;c>b;b++)d[e.zoomOut[b]]=-a},_addHooks:function(){e.DomEvent.on(b,"keydown",this._onKeyDown,this)},_removeHooks:function(){e.DomEvent.off(b,"keydown",this._onKeyDown,this)},_onKeyDown:function(a){var b=a.keyCode,c=this._map;if(b in this._panKeys){if(c._panAnim&&c._panAnim._inProgress)return;c.panBy(this._panKeys[b]),c.options.maxBounds&&c.panInsideBounds(c.options.maxBounds)}else{if(!(b in this._zoomKeys))return;c.setZoom(c.getZoom()+this._zoomKeys[b])}e.DomEvent.stop(a)}}),e.Map.addInitHook("addHandler","keyboard",e.Map.Keyboard),e.Handler.MarkerDrag=e.Handler.extend({initialize:function(a){this._marker=a},addHooks:function(){var a=this._marker._icon;this._draggable||(this._draggable=new e.Draggable(a,a)),this._draggable.on("dragstart",this._onDragStart,this).on("drag",this._onDrag,this).on("dragend",this._onDragEnd,this),this._draggable.enable(),e.DomUtil.addClass(this._marker._icon,"leaflet-marker-draggable")},removeHooks:function(){this._draggable.off("dragstart",this._onDragStart,this).off("drag",this._onDrag,this).off("dragend",this._onDragEnd,this),this._draggable.disable(),e.DomUtil.removeClass(this._marker._icon,"leaflet-marker-draggable")},moved:function(){return this._draggable&&this._draggable._moved},_onDragStart:function(){this._marker.closePopup().fire("movestart").fire("dragstart")},_onDrag:function(){var a=this._marker,b=a._shadow,c=e.DomUtil.getPosition(a._icon),d=a._map.layerPointToLatLng(c);b&&e.DomUtil.setPosition(b,c),a._latlng=d,a.fire("move",{latlng:d}).fire("drag")},_onDragEnd:function(a){this._marker.fire("moveend").fire("dragend",a)}}),e.Control=e.Class.extend({options:{position:"topright"},initialize:function(a){e.setOptions(this,a)},getPosition:function(){return this.options.position},setPosition:function(a){var b=this._map;return b&&b.removeControl(this),this.options.position=a,b&&b.addControl(this),this},getContainer:function(){return this._container},addTo:function(a){this._map=a;var b=this._container=this.onAdd(a),c=this.getPosition(),d=a._controlCorners[c];return e.DomUtil.addClass(b,"leaflet-control"),-1!==c.indexOf("bottom")?d.insertBefore(b,d.firstChild):d.appendChild(b),this},removeFrom:function(a){var b=this.getPosition(),c=a._controlCorners[b];return c.removeChild(this._container),this._map=null,this.onRemove&&this.onRemove(a),this},_refocusOnMap:function(){this._map&&this._map.getContainer().focus()}}),e.control=function(a){return new e.Control(a)},e.Map.include({addControl:function(a){return a.addTo(this),this},removeControl:function(a){return a.removeFrom(this),this},_initControlPos:function(){function a(a,f){var g=c+a+" "+c+f;b[a+f]=e.DomUtil.create("div",g,d)}var b=this._controlCorners={},c="leaflet-",d=this._controlContainer=e.DomUtil.create("div",c+"control-container",this._container);a("top","left"),a("top","right"),a("bottom","left"),a("bottom","right")},_clearControlPos:function(){this._container.removeChild(this._controlContainer)}}),e.Control.Zoom=e.Control.extend({options:{position:"topleft",zoomInText:"+",zoomInTitle:"Zoom in",zoomOutText:"-",zoomOutTitle:"Zoom out"},onAdd:function(a){var b="leaflet-control-zoom",c=e.DomUtil.create("div",b+" leaflet-bar");return this._map=a,this._zoomInButton=this._createButton(this.options.zoomInText,this.options.zoomInTitle,b+"-in",c,this._zoomIn,this),this._zoomOutButton=this._createButton(this.options.zoomOutText,this.options.zoomOutTitle,b+"-out",c,this._zoomOut,this),this._updateDisabled(),a.on("zoomend zoomlevelschange",this._updateDisabled,this),c},onRemove:function(a){a.off("zoomend zoomlevelschange",this._updateDisabled,this)},_zoomIn:function(a){this._map.zoomIn(a.shiftKey?3:1)},_zoomOut:function(a){this._map.zoomOut(a.shiftKey?3:1)},_createButton:function(a,b,c,d,f,g){var h=e.DomUtil.create("a",c,d);h.innerHTML=a,h.href="#",h.title=b;var i=e.DomEvent.stopPropagation;return e.DomEvent.on(h,"click",i).on(h,"mousedown",i).on(h,"dblclick",i).on(h,"click",e.DomEvent.preventDefault).on(h,"click",f,g).on(h,"click",this._refocusOnMap,g),h},_updateDisabled:function(){var a=this._map,b="leaflet-disabled";e.DomUtil.removeClass(this._zoomInButton,b),e.DomUtil.removeClass(this._zoomOutButton,b),a._zoom===a.getMinZoom()&&e.DomUtil.addClass(this._zoomOutButton,b),a._zoom===a.getMaxZoom()&&e.DomUtil.addClass(this._zoomInButton,b)}}),e.Map.mergeOptions({zoomControl:!0}),e.Map.addInitHook(function(){this.options.zoomControl&&(this.zoomControl=new e.Control.Zoom,this.addControl(this.zoomControl))}),e.control.zoom=function(a){return new e.Control.Zoom(a)},e.Control.Attribution=e.Control.extend({options:{position:"bottomright",prefix:'<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'},initialize:function(a){e.setOptions(this,a),this._attributions={}},onAdd:function(a){this._container=e.DomUtil.create("div","leaflet-control-attribution"),e.DomEvent.disableClickPropagation(this._container);for(var b in a._layers)a._layers[b].getAttribution&&this.addAttribution(a._layers[b].getAttribution());return a.on("layeradd",this._onLayerAdd,this).on("layerremove",this._onLayerRemove,this),this._update(),this._container},onRemove:function(a){a.off("layeradd",this._onLayerAdd).off("layerremove",this._onLayerRemove)},setPrefix:function(a){return this.options.prefix=a,this._update(),this},addAttribution:function(a){return a?(this._attributions[a]||(this._attributions[a]=0),this._attributions[a]++,this._update(),this):void 0},removeAttribution:function(a){return a?(this._attributions[a]&&(this._attributions[a]--,this._update()),this):void 0},_update:function(){if(this._map){var a=[];for(var b in this._attributions)this._attributions[b]&&a.push(b);var c=[];this.options.prefix&&c.push(this.options.prefix),a.length&&c.push(a.join(", ")),this._container.innerHTML=c.join(" | ")}},_onLayerAdd:function(a){a.layer.getAttribution&&this.addAttribution(a.layer.getAttribution())},_onLayerRemove:function(a){a.layer.getAttribution&&this.removeAttribution(a.layer.getAttribution())}}),e.Map.mergeOptions({attributionControl:!0}),e.Map.addInitHook(function(){this.options.attributionControl&&(this.attributionControl=(new e.Control.Attribution).addTo(this))}),e.control.attribution=function(a){return new e.Control.Attribution(a)},e.Control.Scale=e.Control.extend({options:{position:"bottomleft",maxWidth:100,metric:!0,imperial:!0,updateWhenIdle:!1},onAdd:function(a){this._map=a;var b="leaflet-control-scale",c=e.DomUtil.create("div",b),d=this.options;return this._addScales(d,b,c),a.on(d.updateWhenIdle?"moveend":"move",this._update,this),a.whenReady(this._update,this),c},onRemove:function(a){a.off(this.options.updateWhenIdle?"moveend":"move",this._update,this)},_addScales:function(a,b,c){a.metric&&(this._mScale=e.DomUtil.create("div",b+"-line",c)),a.imperial&&(this._iScale=e.DomUtil.create("div",b+"-line",c))},_update:function(){var a=this._map.getBounds(),b=a.getCenter().lat,c=6378137*Math.PI*Math.cos(b*Math.PI/180),d=c*(a.getNorthEast().lng-a.getSouthWest().lng)/180,e=this._map.getSize(),f=this.options,g=0;e.x>0&&(g=d*(f.maxWidth/e.x)),this._updateScales(f,g)},_updateScales:function(a,b){a.metric&&b&&this._updateMetric(b),a.imperial&&b&&this._updateImperial(b)},_updateMetric:function(a){var b=this._getRoundNum(a);this._mScale.style.width=this._getScaleWidth(b/a)+"px",this._mScale.innerHTML=1e3>b?b+" m":b/1e3+" km"},_updateImperial:function(a){var b,c,d,e=3.2808399*a,f=this._iScale;e>5280?(b=e/5280,c=this._getRoundNum(b),f.style.width=this._getScaleWidth(c/b)+"px",f.innerHTML=c+" mi"):(d=this._getRoundNum(e),f.style.width=this._getScaleWidth(d/e)+"px",f.innerHTML=d+" ft")},_getScaleWidth:function(a){return Math.round(this.options.maxWidth*a)-10},_getRoundNum:function(a){var b=Math.pow(10,(Math.floor(a)+"").length-1),c=a/b;return c=c>=10?10:c>=5?5:c>=3?3:c>=2?2:1,b*c}}),e.control.scale=function(a){return new e.Control.Scale(a)},e.Control.Layers=e.Control.extend({options:{collapsed:!0,position:"topright",autoZIndex:!0},initialize:function(a,b,c){e.setOptions(this,c),this._layers={},this._lastZIndex=0,this._handlingClick=!1;for(var d in a)this._addLayer(a[d],d);for(d in b)this._addLayer(b[d],d,!0)},onAdd:function(a){return this._initLayout(),this._update(),a.on("layeradd",this._onLayerChange,this).on("layerremove",this._onLayerChange,this),this._container},onRemove:function(a){a.off("layeradd",this._onLayerChange,this).off("layerremove",this._onLayerChange,this)},addBaseLayer:function(a,b){return this._addLayer(a,b),this._update(),this},addOverlay:function(a,b){return this._addLayer(a,b,!0),this._update(),this},removeLayer:function(a){var b=e.stamp(a);return delete this._layers[b],this._update(),this},_initLayout:function(){var a="leaflet-control-layers",b=this._container=e.DomUtil.create("div",a);b.setAttribute("aria-haspopup",!0),e.Browser.touch?e.DomEvent.on(b,"click",e.DomEvent.stopPropagation):e.DomEvent.disableClickPropagation(b).disableScrollPropagation(b);var c=this._form=e.DomUtil.create("form",a+"-list");if(this.options.collapsed){e.Browser.android||e.DomEvent.on(b,"mouseover",this._expand,this).on(b,"mouseout",this._collapse,this);var d=this._layersLink=e.DomUtil.create("a",a+"-toggle",b);d.href="#",d.title="Layers",e.Browser.touch?e.DomEvent.on(d,"click",e.DomEvent.stop).on(d,"click",this._expand,this):e.DomEvent.on(d,"focus",this._expand,this),e.DomEvent.on(c,"click",function(){setTimeout(e.bind(this._onInputClick,this),0)},this),this._map.on("click",this._collapse,this)}else this._expand();this._baseLayersList=e.DomUtil.create("div",a+"-base",c),this._separator=e.DomUtil.create("div",a+"-separator",c),this._overlaysList=e.DomUtil.create("div",a+"-overlays",c),b.appendChild(c)},_addLayer:function(a,b,c){var d=e.stamp(a);this._layers[d]={layer:a,name:b,overlay:c},this.options.autoZIndex&&a.setZIndex&&(this._lastZIndex++,a.setZIndex(this._lastZIndex))},_update:function(){if(this._container){this._baseLayersList.innerHTML="",this._overlaysList.innerHTML="";var a,b,c=!1,d=!1;for(a in this._layers)b=this._layers[a],this._addItem(b),d=d||b.overlay,c=c||!b.overlay;this._separator.style.display=d&&c?"":"none"}},_onLayerChange:function(a){var b=this._layers[e.stamp(a.layer)];if(b){this._handlingClick||this._update();var c=b.overlay?"layeradd"===a.type?"overlayadd":"overlayremove":"layeradd"===a.type?"baselayerchange":null;c&&this._map.fire(c,b)}},_createRadioElement:function(a,c){var d='<input type="radio" class="leaflet-control-layers-selector" name="'+a+'"';c&&(d+=' checked="checked"'),d+="/>";var e=b.createElement("div");return e.innerHTML=d,e.firstChild},_addItem:function(a){var c,d=b.createElement("label"),f=this._map.hasLayer(a.layer);a.overlay?(c=b.createElement("input"),c.type="checkbox",c.className="leaflet-control-layers-selector",c.defaultChecked=f):c=this._createRadioElement("leaflet-base-layers",f),c.layerId=e.stamp(a.layer),e.DomEvent.on(c,"click",this._onInputClick,this);var g=b.createElement("span");g.innerHTML=" "+a.name,d.appendChild(c),d.appendChild(g);var h=a.overlay?this._overlaysList:this._baseLayersList;return h.appendChild(d),d},_onInputClick:function(){var a,b,c,d=this._form.getElementsByTagName("input"),e=d.length;for(this._handlingClick=!0,a=0;e>a;a++)b=d[a],c=this._layers[b.layerId],b.checked&&!this._map.hasLayer(c.layer)?this._map.addLayer(c.layer):!b.checked&&this._map.hasLayer(c.layer)&&this._map.removeLayer(c.layer);this._handlingClick=!1,this._refocusOnMap()},_expand:function(){e.DomUtil.addClass(this._container,"leaflet-control-layers-expanded")},_collapse:function(){this._container.className=this._container.className.replace(" leaflet-control-layers-expanded","")}}),e.control.layers=function(a,b,c){return new e.Control.Layers(a,b,c)},e.PosAnimation=e.Class.extend({includes:e.Mixin.Events,run:function(a,b,c,d){this.stop(),this._el=a,this._inProgress=!0,this._newPos=b,this.fire("start"),a.style[e.DomUtil.TRANSITION]="all "+(c||.25)+"s cubic-bezier(0,0,"+(d||.5)+",1)",e.DomEvent.on(a,e.DomUtil.TRANSITION_END,this._onTransitionEnd,this),e.DomUtil.setPosition(a,b),e.Util.falseFn(a.offsetWidth),this._stepTimer=setInterval(e.bind(this._onStep,this),50)},stop:function(){this._inProgress&&(e.DomUtil.setPosition(this._el,this._getPos()),this._onTransitionEnd(),e.Util.falseFn(this._el.offsetWidth))},_onStep:function(){var a=this._getPos();return a?(this._el._leaflet_pos=a,void this.fire("step")):void this._onTransitionEnd()},_transformRe:/([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,_getPos:function(){var b,c,d,f=this._el,g=a.getComputedStyle(f);if(e.Browser.any3d){if(d=g[e.DomUtil.TRANSFORM].match(this._transformRe),!d)return;b=parseFloat(d[1]),c=parseFloat(d[2])}else b=parseFloat(g.left),c=parseFloat(g.top);return new e.Point(b,c,!0)},_onTransitionEnd:function(){e.DomEvent.off(this._el,e.DomUtil.TRANSITION_END,this._onTransitionEnd,this),this._inProgress&&(this._inProgress=!1,this._el.style[e.DomUtil.TRANSITION]="",this._el._leaflet_pos=this._newPos,clearInterval(this._stepTimer),this.fire("step").fire("end"))}}),e.Map.include({setView:function(a,b,d){if(b=b===c?this._zoom:this._limitZoom(b),a=this._limitCenter(e.latLng(a),b,this.options.maxBounds),d=d||{},this._panAnim&&this._panAnim.stop(),this._loaded&&!d.reset&&d!==!0){d.animate!==c&&(d.zoom=e.extend({animate:d.animate},d.zoom),d.pan=e.extend({animate:d.animate},d.pan));var f=this._zoom!==b?this._tryAnimatedZoom&&this._tryAnimatedZoom(a,b,d.zoom):this._tryAnimatedPan(a,d.pan);if(f)return clearTimeout(this._sizeTimer),this}return this._resetView(a,b),this},panBy:function(a,b){if(a=e.point(a).round(),b=b||{},!a.x&&!a.y)return this;if(this._panAnim||(this._panAnim=new e.PosAnimation,this._panAnim.on({step:this._onPanTransitionStep,end:this._onPanTransitionEnd},this)),b.noMoveStart||this.fire("movestart"),b.animate!==!1){e.DomUtil.addClass(this._mapPane,"leaflet-pan-anim");var c=this._getMapPanePos().subtract(a);this._panAnim.run(this._mapPane,c,b.duration||.25,b.easeLinearity)}else this._rawPanBy(a),this.fire("move").fire("moveend");return this},_onPanTransitionStep:function(){this.fire("move")},_onPanTransitionEnd:function(){e.DomUtil.removeClass(this._mapPane,"leaflet-pan-anim"),this.fire("moveend")},_tryAnimatedPan:function(a,b){var c=this._getCenterOffset(a)._floor();return(b&&b.animate)===!0||this.getSize().contains(c)?(this.panBy(c,b),!0):!1}}),e.PosAnimation=e.DomUtil.TRANSITION?e.PosAnimation:e.PosAnimation.extend({run:function(a,b,c,d){this.stop(),this._el=a,this._inProgress=!0,this._duration=c||.25,this._easeOutPower=1/Math.max(d||.5,.2),this._startPos=e.DomUtil.getPosition(a),this._offset=b.subtract(this._startPos),this._startTime=+new Date,this.fire("start"),this._animate()},stop:function(){this._inProgress&&(this._step(),this._complete())},_animate:function(){this._animId=e.Util.requestAnimFrame(this._animate,this),this._step()},_step:function(){var a=+new Date-this._startTime,b=1e3*this._duration;b>a?this._runFrame(this._easeOut(a/b)):(this._runFrame(1),this._complete())},_runFrame:function(a){var b=this._startPos.add(this._offset.multiplyBy(a));e.DomUtil.setPosition(this._el,b),this.fire("step")},_complete:function(){e.Util.cancelAnimFrame(this._animId),this._inProgress=!1,this.fire("end")},_easeOut:function(a){return 1-Math.pow(1-a,this._easeOutPower)}}),e.Map.mergeOptions({zoomAnimation:!0,zoomAnimationThreshold:4}),e.DomUtil.TRANSITION&&e.Map.addInitHook(function(){this._zoomAnimated=this.options.zoomAnimation&&e.DomUtil.TRANSITION&&e.Browser.any3d&&!e.Browser.android23&&!e.Browser.mobileOpera,this._zoomAnimated&&e.DomEvent.on(this._mapPane,e.DomUtil.TRANSITION_END,this._catchTransitionEnd,this)}),e.Map.include(e.DomUtil.TRANSITION?{_catchTransitionEnd:function(a){this._animatingZoom&&a.propertyName.indexOf("transform")>=0&&this._onZoomTransitionEnd()},_nothingToAnimate:function(){return!this._container.getElementsByClassName("leaflet-zoom-animated").length},_tryAnimatedZoom:function(a,b,c){if(this._animatingZoom)return!0;if(c=c||{},!this._zoomAnimated||c.animate===!1||this._nothingToAnimate()||Math.abs(b-this._zoom)>this.options.zoomAnimationThreshold)return!1;var d=this.getZoomScale(b),e=this._getCenterOffset(a)._divideBy(1-1/d),f=this._getCenterLayerPoint()._add(e);return c.animate===!0||this.getSize().contains(e)?(this.fire("movestart").fire("zoomstart"),this._animateZoom(a,b,f,d,null,!0),!0):!1},_animateZoom:function(a,b,c,d,f,g,h){h||(this._animatingZoom=!0),e.DomUtil.addClass(this._mapPane,"leaflet-zoom-anim"),this._animateToCenter=a,this._animateToZoom=b,e.Draggable&&(e.Draggable._disabled=!0),e.Util.requestAnimFrame(function(){this.fire("zoomanim",{center:a,zoom:b,origin:c,scale:d,delta:f,backwards:g})},this)},_onZoomTransitionEnd:function(){this._animatingZoom=!1,e.DomUtil.removeClass(this._mapPane,"leaflet-zoom-anim"),this._resetView(this._animateToCenter,this._animateToZoom,!0,!0),e.Draggable&&(e.Draggable._disabled=!1)}}:{}),e.TileLayer.include({_animateZoom:function(a){this._animating||(this._animating=!0,this._prepareBgBuffer());var b=this._bgBuffer,c=e.DomUtil.TRANSFORM,d=a.delta?e.DomUtil.getTranslateString(a.delta):b.style[c],f=e.DomUtil.getScaleString(a.scale,a.origin);b.style[c]=a.backwards?f+" "+d:d+" "+f},_endZoomAnim:function(){var a=this._tileContainer,b=this._bgBuffer;a.style.visibility="",a.parentNode.appendChild(a),e.Util.falseFn(b.offsetWidth),this._animating=!1},_clearBgBuffer:function(){var a=this._map;!a||a._animatingZoom||a.touchZoom._zooming||(this._bgBuffer.innerHTML="",this._bgBuffer.style[e.DomUtil.TRANSFORM]="")},_prepareBgBuffer:function(){var a=this._tileContainer,b=this._bgBuffer,c=this._getLoadedTilesPercentage(b),d=this._getLoadedTilesPercentage(a);return b&&c>.5&&.5>d?(a.style.visibility="hidden",void this._stopLoadingImages(a)):(b.style.visibility="hidden",b.style[e.DomUtil.TRANSFORM]="",this._tileContainer=b,b=this._bgBuffer=a,this._stopLoadingImages(b),void clearTimeout(this._clearBgBufferTimer))},_getLoadedTilesPercentage:function(a){var b,c,d=a.getElementsByTagName("img"),e=0;for(b=0,c=d.length;c>b;b++)d[b].complete&&e++;return e/c},_stopLoadingImages:function(a){var b,c,d,f=Array.prototype.slice.call(a.getElementsByTagName("img"));for(b=0,c=f.length;c>b;b++)d=f[b],d.complete||(d.onload=e.Util.falseFn,d.onerror=e.Util.falseFn,d.src=e.Util.emptyImageUrl,d.parentNode.removeChild(d))}}),e.Map.include({_defaultLocateOptions:{watch:!1,setView:!1,maxZoom:1/0,timeout:1e4,maximumAge:0,enableHighAccuracy:!1},locate:function(a){if(a=this._locateOptions=e.extend(this._defaultLocateOptions,a),!navigator.geolocation)return this._handleGeolocationError({code:0,message:"Geolocation not supported."}),this;var b=e.bind(this._handleGeolocationResponse,this),c=e.bind(this._handleGeolocationError,this);return a.watch?this._locationWatchId=navigator.geolocation.watchPosition(b,c,a):navigator.geolocation.getCurrentPosition(b,c,a),this},stopLocate:function(){return navigator.geolocation&&navigator.geolocation.clearWatch(this._locationWatchId),this._locateOptions&&(this._locateOptions.setView=!1),this},_handleGeolocationError:function(a){var b=a.code,c=a.message||(1===b?"permission denied":2===b?"position unavailable":"timeout");this._locateOptions.setView&&!this._loaded&&this.fitWorld(),this.fire("locationerror",{code:b,message:"Geolocation error: "+c+"."})},_handleGeolocationResponse:function(a){var b=a.coords.latitude,c=a.coords.longitude,d=new e.LatLng(b,c),f=180*a.coords.accuracy/40075017,g=f/Math.cos(e.LatLng.DEG_TO_RAD*b),h=e.latLngBounds([b-f,c-g],[b+f,c+g]),i=this._locateOptions;if(i.setView){var j=Math.min(this.getBoundsZoom(h),i.maxZoom);this.setView(d,j)}var k={latlng:d,bounds:h,timestamp:a.timestamp};for(var l in a.coords)"number"==typeof a.coords[l]&&(k[l]=a.coords[l]);this.fire("locationfound",k)}})}(window,document),L.LineUtil.PolylineDecorator={computeAngle:function(a,b){return 180*Math.atan2(b.y-a.y,b.x-a.x)/Math.PI+90},getPointPathPixelLength:function(a){var b=a.length;if(2>b)return 0;for(var c,d=0,e=a[0],f=1;b>f;f++)d+=e.distanceTo(c=a[f]),e=c;return d},getPixelLength:function(a,b){var c=a instanceof L.Polyline?a.getLatLngs():a,d=c.length;if(2>d)return 0;for(var e,f=0,g=b.project(c[0]),h=1;d>h;h++)f+=g.distanceTo(e=b.project(c[h])),g=e;return f},projectPatternOnPath:function(a,b,c,d){var e,f=[];for(e=0,l=a.length;l>e;e++)f[e]=d.project(a[e]);var g=this.projectPatternOnPointPath(f,b,c);for(e=0,l=g.length;l>e;e++)g[e].latLng=d.unproject(g[e].pt);return g},projectPatternOnPointPath:function(a,b,c){var d=[],e=this.getPointPathPixelLength(a)*c,f=this.interpolateOnPointPath(a,b);if(d.push(f),c>0){var g=a;g=g.slice(f.predecessor),g[0]=f.pt;for(var h=this.getPointPathPixelLength(g);h>=e;)f=this.interpolateOnPointPath(g,e/h),d.push(f),g=g.slice(f.predecessor),g[0]=f.pt,h=this.getPointPathPixelLength(g)}return d},interpolateOnPointPath:function(a,b){var c=a.length;if(2>c)return null;if(0>=b)return{pt:a[0],predecessor:0,heading:this.computeAngle(a[0],a[1])};if(b>=1)return{pt:a[c-1],predecessor:c-1,heading:this.computeAngle(a[c-2],a[c-1])};if(2==c)return{pt:this.interpolateBetweenPoints(a[0],a[1],b),predecessor:0,heading:this.computeAngle(a[0],a[1])};for(var d=this.getPointPathPixelLength(a),e=a[0],f=e,g=0,h=0,i=0,j=1;c>j&&b>h;j++)e=f,g=h,f=a[j],i+=e.distanceTo(f),h=i/d;var k=(b-g)/(h-g);return{pt:this.interpolateBetweenPoints(e,f,k),predecessor:j-2,heading:this.computeAngle(e,f)}},interpolateBetweenPoints:function(a,b,c){return b.x!=a.x?new L.Point(a.x*(1-c)+c*b.x,a.y*(1-c)+c*b.y):new L.Point(a.x,a.y+(b.y-a.y)*c)}},L.RotatedMarker=L.Marker.extend({options:{angle:0},_setPos:function(a){if(L.Marker.prototype._setPos.call(this,a),L.DomUtil.TRANSFORM)this._icon.style[L.DomUtil.TRANSFORM]+=" rotate("+this.options.angle+"deg)";else if(L.Browser.ie){var b=this.options.angle*L.LatLng.DEG_TO_RAD,c=Math.cos(b),d=Math.sin(b);this._icon.style.filter+=" progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11="+c+", M12="+-d+", M21="+d+", M22="+c+")"}}}),L.rotatedMarker=function(a,b){return new L.RotatedMarker(a,b)},L.Symbol=L.Symbol||{},L.Symbol.Dash=L.Class.extend({isZoomDependant:!0,options:{pixelSize:10,pathOptions:{}},initialize:function(a){L.Util.setOptions(this,a),this.options.pathOptions.clickable=!1},buildSymbol:function(a,b,c){var d=this.options;if(d.pixelSize<=1)return new L.Polyline([a.latLng,a.latLng],d.pathOptions);var e=c.project(a.latLng),f=-(a.heading-90)*L.LatLng.DEG_TO_RAD,g=new L.Point(e.x+d.pixelSize*Math.cos(f+Math.PI)/2,e.y+d.pixelSize*Math.sin(f)/2),h=e.add(e.subtract(g));return new L.Polyline([c.unproject(g),c.unproject(h)],d.pathOptions)}}),L.Symbol.dash=function(a){return new L.Symbol.Dash(a)},L.Symbol.ArrowHead=L.Class.extend({isZoomDependant:!0,options:{polygon:!0,pixelSize:10,headAngle:60,pathOptions:{stroke:!1,weight:2}},initialize:function(a){L.Util.setOptions(this,a),this.options.pathOptions.clickable=!1},buildSymbol:function(a,b,c){var d,e=this.options;return d=e.polygon?new L.Polygon(this._buildArrowPath(a,c),e.pathOptions):new L.Polyline(this._buildArrowPath(a,c),e.pathOptions)
},_buildArrowPath:function(a,b){var c=b.project(a.latLng),d=-(a.heading-90)*L.LatLng.DEG_TO_RAD,e=this.options.headAngle/2*L.LatLng.DEG_TO_RAD,f=d+e,g=d-e,h=new L.Point(c.x-this.options.pixelSize*Math.cos(f),c.y+this.options.pixelSize*Math.sin(f)),i=new L.Point(c.x-this.options.pixelSize*Math.cos(g),c.y+this.options.pixelSize*Math.sin(g));return[b.unproject(h),a.latLng,b.unproject(i)]}}),L.Symbol.arrowHead=function(a){return new L.Symbol.ArrowHead(a)},L.Symbol.Marker=L.Class.extend({isZoomDependant:!1,options:{markerOptions:{},rotate:!1},initialize:function(a){L.Util.setOptions(this,a),this.options.markerOptions.clickable=!1,this.options.markerOptions.draggable=!1,this.isZoomDependant=L.Browser.ie&&this.options.rotate},buildSymbol:function(a){return this.options.rotate?(this.options.markerOptions.angle=a.heading,new L.RotatedMarker(a.latLng,this.options.markerOptions)):new L.Marker(a.latLng,this.options.markerOptions)}}),L.Symbol.marker=function(a){return new L.Symbol.Marker(a)},L.PolylineDecorator=L.LayerGroup.extend({options:{patterns:[]},initialize:function(a,b){L.LayerGroup.prototype.initialize.call(this),L.Util.setOptions(this,b),this._map=null,this._initPaths(a),this._initPatterns()},_initPaths:function(a){this._paths=[];var b=!1;if(a instanceof L.MultiPolyline||(b=a instanceof L.MultiPolygon))for(var c=a.getLatLngs(),d=0;d<c.length;d++)this._initPath(c[d],b);else if(a instanceof L.Polyline)this._initPath(a.getLatLngs(),a instanceof L.Polygon);else if(L.Util.isArray(a)&&a.length>0)if(a[0]instanceof L.Polyline)for(var d=0;d<a.length;d++)this._initPath(a[d].getLatLngs(),a[d]instanceof L.Polygon);else this._initPath(a)},_isCoordArray:function(a){return L.Util.isArray(a)&&a.length>0&&(a[0]instanceof L.LatLng||L.Util.isArray(a[0])&&2==a[0].length&&"number"==typeof a[0][0])},_initPath:function(a,b){var c;c=this._isCoordArray(a)?[a]:a;for(var d=0;d<c.length;d++)b&&c[d].push(c[d][0]),this._paths.push(c[d])},_initPatterns:function(){this._isZoomDependant=!1,this._patterns=[];for(var a,b=0;b<this.options.patterns.length;b++)a=this._parsePatternDef(this.options.patterns[b]),this._patterns.push(a),this._isZoomDependant=this._isZoomDependant||a.isOffsetInPixels||a.isRepeatInPixels||a.symbolFactory.isZoomDependant},setPatterns:function(a){this.options.patterns=a,this._initPatterns(),this._softRedraw()},setPaths:function(a){this._initPaths(a),this.redraw()},_parsePatternDef:function(a){var b={cache:[],symbolFactory:a.symbol,isOffsetInPixels:!1,isRepeatInPixels:!1};return"string"==typeof a.offset&&-1!=a.offset.indexOf("%")?b.offset=parseFloat(a.offset)/100:(b.offset=parseFloat(a.offset),b.isOffsetInPixels=b.offset>0),"string"==typeof a.repeat&&-1!=a.repeat.indexOf("%")?b.repeat=parseFloat(a.repeat)/100:(b.repeat=parseFloat(a.repeat),b.isRepeatInPixels=b.repeat>0),b},onAdd:function(a){this._map=a,this._draw(),this._isZoomDependant&&this._map.on("zoomend",this._softRedraw,this)},onRemove:function(a){this._map.off("zoomend",this._softRedraw,this),this._map=null,L.LayerGroup.prototype.onRemove.call(this,a)},_buildSymbols:function(a,b,c){for(var d=[],e=0,f=c.length;f>e;e++)d.push(b.buildSymbol(c[e],a,this._map,e,f));return d},_getCache:function(a,b,c){var d=a.cache[b];return"undefined"==typeof d?(a.cache[b]=[],null):d[c]},_getDirectionPoints:function(a,b){var c=this._map.getZoom(),d=this._getCache(b,c,a);if(d)return d;var e,f,g=null,h=this._paths[a];return b.isOffsetInPixels?(g=L.LineUtil.PolylineDecorator.getPixelLength(h,this._map),e=b.offset/g):e=b.offset,b.isRepeatInPixels?(g=null!==g?g:L.LineUtil.PolylineDecorator.getPixelLength(h,this._map),f=b.repeat/g):f=b.repeat,d=L.LineUtil.PolylineDecorator.projectPatternOnPath(h,e,f,this._map),b.cache[c][a]=d,d},redraw:function(){this._redraw(!0)},_softRedraw:function(){this._redraw(!1)},_redraw:function(a){if(null!==this._map){if(this.clearLayers(),a)for(var b=0;b<this._patterns.length;b++)this._patterns[b].cache=[];this._draw()}},_drawPattern:function(a){for(var b,c,d=0;d<this._paths.length;d++){b=this._getDirectionPoints(d,a),c=this._buildSymbols(this._paths[d],a.symbolFactory,b);for(var e=0;e<c.length;e++)this.addLayer(c[e])}},_draw:function(){for(var a=0;a<this._patterns.length;a++)this._drawPattern(this._patterns[a])}}),L.polylineDecorator=function(a,b){return new L.PolylineDecorator(a,b)},function(a){"use strict";var b={},c=function(a){var d,e,f,g,h;c.classes.dispatcher.extend(this);var i=this,j=a||{};if("string"==typeof j||j instanceof HTMLElement?j={renderers:[j]}:"[object Array]"===Object.prototype.toString.call(j)&&(j={renderers:j}),g=j.renderers||j.renderer||j.container,j.renderers&&0!==j.renderers.length||("string"==typeof g||g instanceof HTMLElement||"object"==typeof g&&"container"in g)&&(j.renderers=[g]),j.id){if(b[j.id])throw'sigma: Instance "'+j.id+'" already exists.';Object.defineProperty(this,"id",{value:j.id})}else{for(h=0;b[h];)h++;Object.defineProperty(this,"id",{value:""+h})}for(b[this.id]=this,this.settings=new c.classes.configurable(c.settings,j.settings||{}),Object.defineProperty(this,"graph",{value:new c.classes.graph(this.settings),configurable:!0}),Object.defineProperty(this,"middlewares",{value:[],configurable:!0}),Object.defineProperty(this,"cameras",{value:{},configurable:!0}),Object.defineProperty(this,"renderers",{value:{},configurable:!0}),Object.defineProperty(this,"renderersPerCamera",{value:{},configurable:!0}),Object.defineProperty(this,"cameraFrames",{value:{},configurable:!0}),Object.defineProperty(this,"camera",{get:function(){return this.cameras[0]}}),this._handler=function(a){var b,c={};for(b in a.data)c[b]=a.data[b];c.renderer=a.target,this.dispatchEvent(a.type,c)}.bind(this),f=j.renderers||[],d=0,e=f.length;e>d;d++)this.addRenderer(f[d]);for(f=j.middlewares||[],d=0,e=f.length;e>d;d++)this.middlewares.push("string"==typeof f[d]?c.middlewares[f[d]]:f[d]);"object"==typeof j.graph&&j.graph&&(this.graph.read(j.graph),this.refresh()),window.addEventListener("resize",function(){i.settings&&i.refresh()})};if(c.prototype.addCamera=function(b){var d,e=this;if(!arguments.length){for(b=0;this.cameras[""+b];)b++;b=""+b}if(this.cameras[b])throw'sigma.addCamera: The camera "'+b+'" already exists.';return d=new c.classes.camera(b,this.graph,this.settings),this.cameras[b]=d,d.quadtree=new c.classes.quad,c.classes.edgequad!==a&&(d.edgequadtree=new c.classes.edgequad),d.bind("coordinatesUpdated",function(){e.renderCamera(d,d.isAnimated)}),this.renderersPerCamera[b]=[],d},c.prototype.killCamera=function(a){if(a="string"==typeof a?this.cameras[a]:a,!a)throw"sigma.killCamera: The camera is undefined.";var b,c,d=this.renderersPerCamera[a.id];for(c=d.length,b=c-1;b>=0;b--)this.killRenderer(d[b]);return delete this.renderersPerCamera[a.id],delete this.cameraFrames[a.id],delete this.cameras[a.id],a.kill&&a.kill(),this},c.prototype.addRenderer=function(a){var b,d,e,f,g=a||{};if("string"==typeof g?g={container:document.getElementById(g)}:g instanceof HTMLElement&&(g={container:g}),"string"==typeof g.container&&(g.container=document.getElementById(g.container)),"id"in g)b=g.id;else{for(b=0;this.renderers[""+b];)b++;b=""+b}if(this.renderers[b])throw'sigma.addRenderer: The renderer "'+b+'" already exists.';if(d="function"==typeof g.type?g.type:c.renderers[g.type],d=d||c.renderers.def,e="camera"in g?g.camera instanceof c.classes.camera?g.camera:this.cameras[g.camera]||this.addCamera(g.camera):this.addCamera(),this.cameras[e.id]!==e)throw"sigma.addRenderer: The camera is not properly referenced.";return f=new d(this.graph,e,this.settings,g),this.renderers[b]=f,Object.defineProperty(f,"id",{value:b}),f.bind&&f.bind(["click","rightClick","clickStage","doubleClickStage","rightClickStage","clickNode","clickNodes","clickEdge","clickEdges","doubleClickNode","doubleClickNodes","doubleClickEdge","doubleClickEdges","rightClickNode","rightClickNodes","rightClickEdge","rightClickEdges","overNode","overNodes","overEdge","overEdges","outNode","outNodes","outEdge","outEdges","downNode","downNodes","downEdge","downEdges","upNode","upNodes","upEdge","upEdges"],this._handler),this.renderersPerCamera[e.id].push(f),f},c.prototype.killRenderer=function(a){if(a="string"==typeof a?this.renderers[a]:a,!a)throw"sigma.killRenderer: The renderer is undefined.";var b=this.renderersPerCamera[a.camera.id],c=b.indexOf(a);return c>=0&&b.splice(c,1),a.kill&&a.kill(),delete this.renderers[a.id],this},c.prototype.refresh=function(b){var d,e,f,g,h,i,j=0;for(b=b||{},g=this.middlewares||[],d=0,e=g.length;e>d;d++)g[d].call(this,0===d?"":"tmp"+j+":",d===e-1?"ready:":"tmp"+ ++j+":");for(f in this.cameras)h=this.cameras[f],h.settings("autoRescale")&&this.renderersPerCamera[h.id]&&this.renderersPerCamera[h.id].length?c.middlewares.rescale.call(this,g.length?"ready:":"",h.readPrefix,{width:this.renderersPerCamera[h.id][0].width,height:this.renderersPerCamera[h.id][0].height}):c.middlewares.copy.call(this,g.length?"ready:":"",h.readPrefix),b.skipIndexation||(i=c.utils.getBoundaries(this.graph,h.readPrefix),h.quadtree.index(this.graph.nodes(),{prefix:h.readPrefix,bounds:{x:i.minX,y:i.minY,width:i.maxX-i.minX,height:i.maxY-i.minY}}),h.edgequadtree!==a&&h.settings("drawEdges")&&h.settings("enableEdgeHovering")&&h.edgequadtree.index(this.graph,{prefix:h.readPrefix,bounds:{x:i.minX,y:i.minY,width:i.maxX-i.minX,height:i.maxY-i.minY}}));for(g=Object.keys(this.renderers),d=0,e=g.length;e>d;d++)if(this.renderers[g[d]].process)if(this.settings("skipErrors"))try{this.renderers[g[d]].process()}catch(k){console.log('Warning: The renderer "'+g[d]+'" crashed on ".process()"')}else this.renderers[g[d]].process();return this.render(),this},c.prototype.render=function(){var a,b,c;for(c=Object.keys(this.renderers),a=0,b=c.length;b>a;a++)if(this.settings("skipErrors"))try{this.renderers[c[a]].render()}catch(d){this.settings("verbose")&&console.log('Warning: The renderer "'+c[a]+'" crashed on ".render()"')}else this.renderers[c[a]].render();return this},c.prototype.renderCamera=function(a,b){var c,d,e,f=this;if(b)for(e=this.renderersPerCamera[a.id],c=0,d=e.length;d>c;c++)if(this.settings("skipErrors"))try{e[c].render()}catch(g){this.settings("verbose")&&console.log('Warning: The renderer "'+e[c].id+'" crashed on ".render()"')}else e[c].render();else if(!this.cameraFrames[a.id]){for(e=this.renderersPerCamera[a.id],c=0,d=e.length;d>c;c++)if(this.settings("skipErrors"))try{e[c].render()}catch(g){this.settings("verbose")&&console.log('Warning: The renderer "'+e[c].id+'" crashed on ".render()"')}else e[c].render();this.cameraFrames[a.id]=requestAnimationFrame(function(){delete f.cameraFrames[a.id]})}return this},c.prototype.kill=function(){var a;this.dispatchEvent("kill"),this.graph.kill(),delete this.middlewares;for(a in this.renderers)this.killRenderer(this.renderers[a]);for(a in this.cameras)this.killCamera(this.cameras[a]);delete this.renderers,delete this.cameras;for(a in this)this.hasOwnProperty(a)&&delete this[a];delete b[this.id]},c.instances=function(a){return arguments.length?b[a]:c.utils.extend({},b)},c.version="1.0.3","undefined"!=typeof this.sigma)throw"An object called sigma is already in the global scope.";this.sigma=c}.call(this),function(a){"use strict";function b(a,c){var d,e,f,g;if(arguments.length)if(1===arguments.length&&Object(arguments[0])===arguments[0])for(a in arguments[0])b(a,arguments[0][a]);else if(arguments.length>1)for(g=Array.isArray(a)?a:a.split(/ /),d=0,e=g.length;d!==e;d+=1)f=g[d],C[f]||(C[f]=[]),C[f].push({handler:c})}function c(a,b){var c,d,e,f,g,h,i=Array.isArray(a)?a:a.split(/ /);if(arguments.length)if(b)for(c=0,d=i.length;c!==d;c+=1){if(h=i[c],C[h]){for(g=[],e=0,f=C[h].length;e!==f;e+=1)C[h][e].handler!==b&&g.push(C[h][e]);C[h]=g}C[h]&&0===C[h].length&&delete C[h]}else for(c=0,d=i.length;c!==d;c+=1)delete C[i[c]];else C=Object.create(null)}function d(a,b){var c,d,e,f,g,h,i=Array.isArray(a)?a:a.split(/ /);for(b=void 0===b?{}:b,c=0,e=i.length;c!==e;c+=1)if(h=i[c],C[h])for(g={type:h,data:b||{}},d=0,f=C[h].length;d!==f;d+=1)try{C[h][d].handler(g)}catch(j){}}function e(){var a,b,c,d,e=!1,f=s(),g=x.shift();if(c=g.job(),f=s()-f,g.done++,g.time+=f,g.currentTime+=f,g.weightTime=g.currentTime/(g.weight||1),g.averageTime=g.time/g.done,d=g.count?g.count<=g.done:!c,!d){for(a=0,b=x.length;b>a;a++)if(x[a].weightTime>g.weightTime){x.splice(a,0,g),e=!0;break}e||x.push(g)}return d?g:null}function f(a){var b=x.length;w[a.id]=a,a.status="running",b&&(a.weightTime=x[b-1].weightTime,a.currentTime=a.weightTime*(a.weight||1)),a.startTime=s(),d("jobStarted",q(a)),x.push(a)}function g(){var a,b,c;for(a in v)b=v[a],b.after?y[a]=b:f(b),delete v[a];for(u=!!x.length;x.length&&s()-t<B.frameDuration;)if(c=e()){i(c.id);for(a in y)y[a].after===c.id&&(f(y[a]),delete y[a])}u?(t=s(),d("enterFrame"),setTimeout(g,0)):d("stop")}function h(a,b){var c,e,f;if(Array.isArray(a)){for(A=!0,c=0,e=a.length;e>c;c++)h(a[c].id,p(a[c],b));A=!1,u||(t=s(),d("start"),g())}else if("object"==typeof a)if("string"==typeof a.id)h(a.id,a);else{A=!0;for(c in a)"function"==typeof a[c]?h(c,p({job:a[c]},b)):h(c,p(a[c],b));A=!1,u||(t=s(),d("start"),g())}else{if("string"!=typeof a)throw new Error("[conrad.addJob] Wrong arguments.");if(k(a))throw new Error('[conrad.addJob] Job with id "'+a+'" already exists.');if("function"==typeof b)f={id:a,done:0,time:0,status:"waiting",currentTime:0,averageTime:0,weightTime:0,job:b};else{if("object"!=typeof b)throw new Error("[conrad.addJob] Wrong arguments.");f=p({id:a,done:0,time:0,status:"waiting",currentTime:0,averageTime:0,weightTime:0},b)}v[a]=f,d("jobAdded",q(f)),u||A||(t=s(),d("start"),g())}return this}function i(a){var b,c,e,f,g=!1;if(Array.isArray(a))for(b=0,c=a.length;c>b;b++)i(a[b]);else{if("string"!=typeof a)throw new Error("[conrad.killJob] Wrong arguments.");for(e=[w,y,v],b=0,c=e.length;c>b;b++)a in e[b]&&(f=e[b][a],B.history&&(f.status="done",z.push(f)),d("jobEnded",q(f)),delete e[b][a],"function"==typeof f.end&&f.end(),g=!0);for(e=x,b=0,c=e.length;c>b;b++)if(e[b].id===a){e.splice(b,1);break}if(!g)throw new Error('[conrad.killJob] Job "'+a+'" not found.')}return this}function j(){var a,b=p(v,w,y);if(B.history)for(a in b)b[a].status="done",z.push(b[a]),"function"==typeof b[a].end&&b[a].end();return v={},y={},w={},x=[],u=!1,this}function k(a){var b=v[a]||w[a]||y[a];return b?p(b):null}function l(){var a;if("string"==typeof a1&&1===arguments.length)return B[a1];a="object"==typeof a1&&1===arguments.length?a1||{}:{},"string"==typeof a1&&(a[a1]=a2);for(var b in a)void 0!==a[b]?B[b]=a[b]:delete B[b];return this}function m(){return u}function n(){return z=[],this}function o(a,b){var c,d,e,f,g,h,i;if(!arguments.length){g=[];for(d in v)g.push(v[d]);for(d in y)g.push(y[d]);for(d in w)g.push(w[d]);g=g.concat(z)}if("string"==typeof a)switch(a){case"waiting":g=r(y);break;case"running":g=r(w);break;case"done":g=z;break;default:h=a}if(a instanceof RegExp&&(h=a),!h&&("string"==typeof b||b instanceof RegExp)&&(h=b),h){if(i="string"==typeof h,g instanceof Array)c=g;else if("object"==typeof g){c=[];for(d in g)c=c.concat(g[d])}else{c=[];for(d in v)c.push(v[d]);for(d in y)c.push(y[d]);for(d in w)c.push(w[d]);c=c.concat(z)}for(g=[],e=0,f=c.length;f>e;e++)(i?c[e].id===h:c[e].id.match(h))&&g.push(c[e])}return q(g)}function p(){var a,b,c={},d=arguments.length;for(a=d-1;a>=0;a--)for(b in arguments[a])c[b]=arguments[a][b];return c}function q(a){var b,c,d;if(!a)return a;if(Array.isArray(a))for(b=[],c=0,d=a.length;d>c;c++)b.push(q(a[c]));else if("object"==typeof a){b={};for(c in a)b[c]=q(a[c])}else b=a;return b}function r(a){var b,c=[];for(b in a)c.push(a[b]);return c}function s(){return Date.now?Date.now():(new Date).getTime()}if(a.conrad)throw new Error("conrad already exists");var t,u=!1,v={},w={},x=[],y={},z=[],A=!1,B={frameDuration:20,history:!0},C=Object.create(null);Array.isArray||(Array.isArray=function(a){return"[object Array]"===Object.prototype.toString.call(a)});var D={hasJob:k,addJob:h,killJob:i,killAll:j,settings:l,getStats:o,isRunning:m,clearHistory:n,bind:b,unbind:c,version:"0.1.0"};"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(exports=module.exports=D),exports.conrad=D),a.conrad=D}(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";var b=this;sigma.utils=sigma.utils||{},sigma.utils.extend=function(){var a,b,c={},d=arguments.length;for(a=d-1;a>=0;a--)for(b in arguments[a])c[b]=arguments[a][b];return c},sigma.utils.dateNow=function(){return Date.now?Date.now():(new Date).getTime()},sigma.utils.pkg=function(a){return(a||"").split(".").reduce(function(a,b){return b in a?a[b]:a[b]={}},b)},sigma.utils.id=function(){var a=0;return function(){return++a}}(),sigma.utils.floatColor=function(a){var b=[0,0,0];return a.match(/^#/)?(a=(a||"").replace(/^#/,""),b=3===a.length?[parseInt(a.charAt(0)+a.charAt(0),16),parseInt(a.charAt(1)+a.charAt(1),16),parseInt(a.charAt(2)+a.charAt(2),16)]:[parseInt(a.charAt(0)+a.charAt(1),16),parseInt(a.charAt(2)+a.charAt(3),16),parseInt(a.charAt(4)+a.charAt(5),16)]):a.match(/^ *rgba? *\(/)&&(a=a.match(/^ *rgba? *\( *([0-9]*) *, *([0-9]*) *, *([0-9]*) *(,.*)?\) *$/),b=[+a[1],+a[2],+a[3]]),256*b[0]*256+256*b[1]+b[2]},sigma.utils.zoomTo=function(a,b,c,d,e){var f,g,h,i=a.settings;g=Math.max(i("zoomMin"),Math.min(i("zoomMax"),a.ratio*d)),g!==a.ratio&&(d=g/a.ratio,h={x:b*(1-d)+a.x,y:c*(1-d)+a.y,ratio:g},e&&e.duration?(f=sigma.misc.animation.killAll(a),e=sigma.utils.extend(e,{easing:f?"quadraticOut":"quadraticInOut"}),sigma.misc.animation.camera(a,h,e)):(a.goTo(h),e&&e.onComplete&&e.onComplete()))},sigma.utils.getQuadraticControlPoint=function(a,b,c,d){return{x:(a+c)/2+(d-b)/4,y:(b+d)/2+(a-c)/4}},sigma.utils.getPointOnQuadraticCurve=function(a,b,c,d,e,f,g){return{x:Math.pow(1-a,2)*b+2*(1-a)*a*f+Math.pow(a,2)*d,y:Math.pow(1-a,2)*c+2*(1-a)*a*g+Math.pow(a,2)*e}},sigma.utils.getPointOnBezierCurve=function(a,b,c,d,e,f,g,h,i){var j=Math.pow(1-a,3),k=3*a*Math.pow(1-a,2),l=3*Math.pow(a,2)*(1-a),m=Math.pow(a,3);return{x:j*b+k*f+l*h+m*d,y:j*c+k*g+l*i+m*e}},sigma.utils.getSelfLoopControlPoints=function(a,b,c){return{x1:a-7*c,y1:b,x2:a,y2:b+7*c}},sigma.utils.getDistance=function(a,b,c,d){return Math.sqrt(Math.pow(c-a,2)+Math.pow(d-b,2))},sigma.utils.getCircleIntersection=function(a,b,c,d,e,f){var g,h,i,j,k,l,m,n,o;if(h=d-a,i=e-b,j=Math.sqrt(i*i+h*h),j>c+f)return!1;if(j<Math.abs(c-f))return!1;g=(c*c-f*f+j*j)/(2*j),n=a+h*g/j,o=b+i*g/j,k=Math.sqrt(c*c-g*g),l=-i*(k/j),m=h*(k/j);var p=n+l,q=n-l,r=o+m,s=o-m;return{xi:p,xi_prime:q,yi:r,yi_prime:s}},sigma.utils.isPointOnSegment=function(a,b,c,d,e,f,g){var h=Math.abs((b-d)*(e-c)-(a-c)*(f-d)),i=sigma.utils.getDistance(c,d,e,f),j=h/i;return g>j&&Math.min(c,e)<=a&&a<=Math.max(c,e)&&Math.min(d,f)<=b&&b<=Math.max(d,f)},sigma.utils.isPointOnQuadraticCurve=function(a,b,c,d,e,f,g,h,i){var j=sigma.utils.getDistance(c,d,e,f);if(Math.abs(a-c)>j||Math.abs(b-d)>j)return!1;for(var k,l=sigma.utils.getDistance(a,b,c,d),m=sigma.utils.getDistance(a,b,e,f),n=.5,o=m>l?-.01:.01,p=.001,q=100,r=sigma.utils.getPointOnQuadraticCurve(n,c,d,e,f,g,h),s=sigma.utils.getDistance(a,b,r.x,r.y);q-->0&&n>=0&&1>=n&&s>i&&(o>p||-p>o);)k=s,r=sigma.utils.getPointOnQuadraticCurve(n,c,d,e,f,g,h),s=sigma.utils.getDistance(a,b,r.x,r.y),s>k?(o=-o/2,n+=o):0>n+o||n+o>1?(o/=2,s=k):n+=o;return i>s},sigma.utils.isPointOnBezierCurve=function(a,b,c,d,e,f,g,h,i,j,k){var l=sigma.utils.getDistance(c,d,g,h);if(Math.abs(a-c)>l||Math.abs(b-d)>l)return!1;for(var m,n=sigma.utils.getDistance(a,b,c,d),o=sigma.utils.getDistance(a,b,e,f),p=.5,q=o>n?-.01:.01,r=.001,s=100,t=sigma.utils.getPointOnBezierCurve(p,c,d,e,f,g,h,i,j),u=sigma.utils.getDistance(a,b,t.x,t.y);s-->0&&p>=0&&1>=p&&u>k&&(q>r||-r>q);)m=u,t=sigma.utils.getPointOnBezierCurve(p,c,d,e,f,g,h,i,j),u=sigma.utils.getDistance(a,b,t.x,t.y),u>m?(q=-q/2,p+=q):0>p+q||p+q>1?(q/=2,u=m):p+=q;return k>u},sigma.utils.getX=function(b){return b.offsetX!==a&&b.offsetX||b.layerX!==a&&b.layerX||b.clientX!==a&&b.clientX},sigma.utils.getY=function(b){return b.offsetY!==a&&b.offsetY||b.layerY!==a&&b.layerY||b.clientY!==a&&b.clientY},sigma.utils.getDelta=function(b){return b.wheelDelta!==a&&b.wheelDelta||b.detail!==a&&-b.detail},sigma.utils.getOffset=function(a){for(var b=0,c=0;a;)c+=parseInt(a.offsetTop),b+=parseInt(a.offsetLeft),a=a.offsetParent;return{top:c,left:b}},sigma.utils.doubleClick=function(a,b,c){var d,e=0;a._doubleClickHandler=a._doubleClickHandler||{},a._doubleClickHandler[b]=a._doubleClickHandler[b]||[],d=a._doubleClickHandler[b],d.push(function(a){return e++,2===e?(e=0,c(a)):void(1===e&&setTimeout(function(){e=0},sigma.settings.doubleClickTimeout))}),a.addEventListener(b,d[d.length-1],!1)},sigma.utils.unbindDoubleClick=function(a,b){for(var c,d=(a._doubleClickHandler||{})[b]||[];c=d.pop();)a.removeEventListener(b,c);delete(a._doubleClickHandler||{})[b]},sigma.utils.easings=sigma.utils.easings||{},sigma.utils.easings.linearNone=function(a){return a},sigma.utils.easings.quadraticIn=function(a){return a*a},sigma.utils.easings.quadraticOut=function(a){return a*(2-a)},sigma.utils.easings.quadraticInOut=function(a){return(a*=2)<1?.5*a*a:-.5*(--a*(a-2)-1)},sigma.utils.easings.cubicIn=function(a){return a*a*a},sigma.utils.easings.cubicOut=function(a){return--a*a*a+1},sigma.utils.easings.cubicInOut=function(a){return(a*=2)<1?.5*a*a*a:.5*((a-=2)*a*a+2)},sigma.utils.loadShader=function(a,b,c,d){var e,f=a.createShader(c);return a.shaderSource(f,b),a.compileShader(f),e=a.getShaderParameter(f,a.COMPILE_STATUS),e?f:(d&&d('Error compiling shader "'+f+'":'+a.getShaderInfoLog(f)),a.deleteShader(f),null)},sigma.utils.loadProgram=function(a,b,c,d,e){var f,g,h=a.createProgram();for(f=0;f<b.length;++f)a.attachShader(h,b[f]);if(c)for(f=0;f<c.length;++f)a.bindAttribLocation(h,locations?locations[f]:f,opt_attribs[f]);return a.linkProgram(h),g=a.getProgramParameter(h,a.LINK_STATUS),g?h:(e&&e("Error in program linking: "+a.getProgramInfoLog(h)),a.deleteProgram(h),null)},sigma.utils.pkg("sigma.utils.matrices"),sigma.utils.matrices.translation=function(a,b){return[1,0,0,0,1,0,a,b,1]},sigma.utils.matrices.rotation=function(a,b){var c=Math.cos(a),d=Math.sin(a);return b?[c,-d,d,c]:[c,-d,0,d,c,0,0,0,1]},sigma.utils.matrices.scale=function(a,b){return b?[a,0,0,a]:[a,0,0,0,a,0,0,0,1]},sigma.utils.matrices.multiply=function(a,b,c){var d=c?2:3,e=a[0*d+0],f=a[0*d+1],g=a[0*d+2],h=a[1*d+0],i=a[1*d+1],j=a[1*d+2],k=a[2*d+0],l=a[2*d+1],m=a[2*d+2],n=b[0*d+0],o=b[0*d+1],p=b[0*d+2],q=b[1*d+0],r=b[1*d+1],s=b[1*d+2],t=b[2*d+0],u=b[2*d+1],v=b[2*d+2];return c?[e*n+f*q,e*o+f*r,h*n+i*q,h*o+i*r]:[e*n+f*q+g*t,e*o+f*r+g*u,e*p+f*s+g*v,h*n+i*q+j*t,h*o+i*r+j*u,h*p+i*s+j*v,k*n+l*q+m*t,k*o+l*r+m*u,k*p+l*s+m*v]}}.call(this),function(a){"use strict";var b,c=0,d=["ms","moz","webkit","o"];for(b=0;b<d.length&&!a.requestAnimationFrame;b++)a.requestAnimationFrame=a[d[b]+"RequestAnimationFrame"],a.cancelAnimationFrame=a[d[b]+"CancelAnimationFrame"]||a[d[b]+"CancelRequestAnimationFrame"];a.requestAnimationFrame||(a.requestAnimationFrame=function(b){var d=(new Date).getTime(),e=Math.max(0,16-(d-c)),f=a.setTimeout(function(){b(d+e)},e);return c=d+e,f}),a.cancelAnimationFrame||(a.cancelAnimationFrame=function(a){clearTimeout(a)}),Function.prototype.bind||(Function.prototype.bind=function(a){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b,c,d=Array.prototype.slice.call(arguments,1),e=this;return b=function(){},c=function(){return e.apply(this instanceof b&&a?this:a,d.concat(Array.prototype.slice.call(arguments)))},b.prototype=this.prototype,c.prototype=new b,c})}(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.settings");var a={clone:!0,immutable:!0,verbose:!1,defaultNodeType:"def",defaultEdgeType:"def",defaultLabelColor:"#000",defaultEdgeColor:"#000",defaultNodeColor:"#000",defaultLabelSize:14,edgeColor:"source",minArrowSize:0,font:"arial",fontStyle:"",labelColor:"default",labelSize:"fixed",labelSizeRatio:1,labelThreshold:8,webglOversamplingRatio:2,borderSize:0,defaultNodeBorderColor:"#000",hoverFont:"",singleHover:!1,hoverFontStyle:"",labelHoverShadow:"default",labelHoverShadowColor:"#000",nodeHoverColor:"node",defaultNodeHoverColor:"#000",labelHoverBGColor:"default",defaultHoverLabelBGColor:"#fff",labelHoverColor:"default",defaultLabelHoverColor:"#000",edgeHoverColor:"edge",edgeHoverSizeRatio:1,defaultEdgeHoverColor:"#000",edgeHoverExtremities:!1,drawEdges:!0,drawNodes:!0,drawLabels:!0,drawEdgeLabels:!1,batchEdgesDrawing:!1,hideEdgesOnMove:!1,canvasEdgesBatchSize:500,webglEdgesBatchSize:1e3,scalingMode:"inside",sideMargin:0,minEdgeSize:.5,maxEdgeSize:1,minNodeSize:1,maxNodeSize:8,touchEnabled:!0,mouseEnabled:!0,mouseWheelEnabled:!0,doubleClickEnabled:!0,eventsEnabled:!0,zoomingRatio:1.7,doubleClickZoomingRatio:2.2,zoomMin:.0625,zoomMax:2,mouseZoomDuration:200,doubleClickZoomDuration:200,mouseInertiaDuration:200,mouseInertiaRatio:3,touchInertiaDuration:200,touchInertiaRatio:3,doubleClickTimeout:300,doubleTapTimeout:300,dragTimeout:200,autoResize:!0,autoRescale:!0,enableCamera:!0,enableHovering:!0,enableEdgeHovering:!1,edgeHoverPrecision:5,rescaleIgnoreSize:!1,skipErrors:!1,nodesPowRatio:.5,edgesPowRatio:.5,animationsTime:200};sigma.settings=sigma.utils.extend(sigma.settings||{},a)}.call(this),function(){"use strict";var a=function(){Object.defineProperty(this,"_handlers",{value:{}})};a.prototype.bind=function(a,b){var c,d,e,f;if(1===arguments.length&&"object"==typeof arguments[0])for(a in arguments[0])this.bind(a,arguments[0][a]);else{if(2!==arguments.length||"function"!=typeof arguments[1])throw"bind: Wrong arguments.";for(f="string"==typeof a?a.split(" "):a,c=0,d=f.length;c!==d;c+=1)e=f[c],e&&(this._handlers[e]||(this._handlers[e]=[]),this._handlers[e].push({handler:b}))}return this},a.prototype.unbind=function(a,b){var c,d,e,f,g,h,i,j="string"==typeof a?a.split(" "):a;if(!arguments.length){for(g in this._handlers)delete this._handlers[g];return this}if(b)for(c=0,d=j.length;c!==d;c+=1){if(i=j[c],this._handlers[i]){for(h=[],e=0,f=this._handlers[i].length;e!==f;e+=1)this._handlers[i][e].handler!==b&&h.push(this._handlers[i][e]);this._handlers[i]=h}this._handlers[i]&&0===this._handlers[i].length&&delete this._handlers[i]}else for(c=0,d=j.length;c!==d;c+=1)delete this._handlers[j[c]];return this},a.prototype.dispatchEvent=function(a,b){var c,d,e,f,g,h,i,j=this,k="string"==typeof a?a.split(" "):a;for(b=void 0===b?{}:b,c=0,d=k.length;c!==d;c+=1)if(i=k[c],this._handlers[i]){for(h=j.getEvent(i,b),g=[],e=0,f=this._handlers[i].length;e!==f;e+=1)this._handlers[i][e].handler(h),this._handlers[i][e].one||g.push(this._handlers[i][e]);this._handlers[i]=g}return this},a.prototype.getEvent=function(a,b){return{type:a,data:b||{},target:this}},a.extend=function(b,c){var d;for(d in a.prototype)a.prototype.hasOwnProperty(d)&&(b[d]=a.prototype[d]);a.apply(b,c)},"undefined"!=typeof this.sigma?(this.sigma.classes=this.sigma.classes||{},this.sigma.classes.dispatcher=a):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=a),exports.dispatcher=a):this.dispatcher=a}.call(this),function(){"use strict";var a=function(){var b,c,d={},e=Array.prototype.slice.call(arguments,0),f=function(a,g){var h,i;if(1===arguments.length&&"string"==typeof a){if(a in d&&void 0!==d[a])return d[a];for(b=0,c=e.length;c>b;b++)if(a in e[b]&&void 0!==e[b][a])return e[b][a];return void 0}if("object"==typeof a&&"string"==typeof g)return g in(a||{})?a[g]:f(g);h="object"==typeof a&&void 0===g?a:{},"string"==typeof a&&(h[a]=g);for(i in h)d[i]=h[i];return this};for(f.embedObjects=function(){var b=e.concat(d).concat(Array.prototype.splice.call(arguments,0));return a.apply({},b)},b=0,c=arguments.length;c>b;b++)f(arguments[b]);return f};"undefined"!=typeof this.sigma?(this.sigma.classes=this.sigma.classes||{},this.sigma.classes.configurable=a):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=a),exports.configurable=a):this.configurable=a}.call(this),function(){"use strict";function a(a,b,c){var d=function(){var d,e;for(d in g[a])g[a][d].apply(b,arguments);e=c.apply(b,arguments);for(d in f[a])f[a][d].apply(b,arguments);return e};return d}function b(a){var b;for(b in a)"hasOwnProperty"in a&&!a.hasOwnProperty(b)||delete a[b];return a}var c=Object.create(null),d=Object.create(null),e=Object.create(null),f=Object.create(null),g=Object.create(null),h={immutable:!0,clone:!0},i=function(a){return h[a]},j=function(b){var d,f,g;g={settings:b||i,nodesArray:[],edgesArray:[],nodesIndex:Object.create(null),edgesIndex:Object.create(null),inNeighborsIndex:Object.create(null),outNeighborsIndex:Object.create(null),allNeighborsIndex:Object.create(null),inNeighborsCount:Object.create(null),outNeighborsCount:Object.create(null),allNeighborsCount:Object.create(null)};for(d in e)e[d].call(g);for(d in c)f=a(d,g,c[d]),this[d]=f,g[d]=f};j.addMethod=function(a,b){if("string"!=typeof a||"function"!=typeof b||2!==arguments.length)throw"addMethod: Wrong arguments.";if(c[a]||j[a])throw'The method "'+a+'" already exists.';return c[a]=b,f[a]=Object.create(null),g[a]=Object.create(null),this},j.hasMethod=function(a){return!(!c[a]&&!j[a])},j.attach=function(a,b,c,d){if("string"!=typeof a||"string"!=typeof b||"function"!=typeof c||arguments.length<3||arguments.length>4)throw"attach: Wrong arguments.";var h;if("constructor"===a)h=e;else if(d){if(!g[a])throw'The method "'+a+'" does not exist.';h=g[a]}else{if(!f[a])throw'The method "'+a+'" does not exist.';h=f[a]}if(h[b])throw'A function "'+b+'" is already attached to the method "'+a+'".';return h[b]=c,this},j.attachBefore=function(a,b,c){return this.attach(a,b,c,!0)},j.addIndex=function(a,b){if("string"!=typeof a||Object(b)!==b||2!==arguments.length)throw"addIndex: Wrong arguments.";if(d[a])throw'The index "'+a+'" already exists.';var c;d[a]=b;for(c in b){if("function"!=typeof b[c])throw"The bindings must be functions.";j.attach(c,a,b[c])}return this},j.addMethod("addNode",function(a){if(Object(a)!==a||1!==arguments.length)throw"addNode: Wrong arguments.";if("string"!=typeof a.id&&"number"!=typeof a.id)throw"The node must have a string or number id.";if(this.nodesIndex[a.id])throw'The node "'+a.id+'" already exists.';var b,c=a.id,d=Object.create(null);if(this.settings("clone"))for(b in a)"id"!==b&&(d[b]=a[b]);else d=a;return this.settings("immutable")?Object.defineProperty(d,"id",{value:c,enumerable:!0}):d.id=c,this.inNeighborsIndex[c]=Object.create(null),this.outNeighborsIndex[c]=Object.create(null),this.allNeighborsIndex[c]=Object.create(null),this.inNeighborsCount[c]=0,this.outNeighborsCount[c]=0,this.allNeighborsCount[c]=0,this.nodesArray.push(d),this.nodesIndex[d.id]=d,this}),j.addMethod("addEdge",function(a){if(Object(a)!==a||1!==arguments.length)throw"addEdge: Wrong arguments.";if("string"!=typeof a.id&&"number"!=typeof a.id)throw"The edge must have a string or number id.";if("string"!=typeof a.source&&"number"!=typeof a.source||!this.nodesIndex[a.source])throw"The edge source must have an existing node id.";if("string"!=typeof a.target&&"number"!=typeof a.target||!this.nodesIndex[a.target])throw"The edge target must have an existing node id.";if(this.edgesIndex[a.id])throw'The edge "'+a.id+'" already exists.';var b,c=Object.create(null);if(this.settings("clone"))for(b in a)"id"!==b&&"source"!==b&&"target"!==b&&(c[b]=a[b]);else c=a;return this.settings("immutable")?(Object.defineProperty(c,"id",{value:a.id,enumerable:!0}),Object.defineProperty(c,"source",{value:a.source,enumerable:!0}),Object.defineProperty(c,"target",{value:a.target,enumerable:!0})):(c.id=a.id,c.source=a.source,c.target=a.target),this.edgesArray.push(c),this.edgesIndex[c.id]=c,this.inNeighborsIndex[c.target][c.source]||(this.inNeighborsIndex[c.target][c.source]=Object.create(null)),this.inNeighborsIndex[c.target][c.source][c.id]=c,this.outNeighborsIndex[c.source][c.target]||(this.outNeighborsIndex[c.source][c.target]=Object.create(null)),this.outNeighborsIndex[c.source][c.target][c.id]=c,this.allNeighborsIndex[c.source][c.target]||(this.allNeighborsIndex[c.source][c.target]=Object.create(null)),this.allNeighborsIndex[c.source][c.target][c.id]=c,c.target!==c.source&&(this.allNeighborsIndex[c.target][c.source]||(this.allNeighborsIndex[c.target][c.source]=Object.create(null)),this.allNeighborsIndex[c.target][c.source][c.id]=c),this.inNeighborsCount[c.target]++,this.outNeighborsCount[c.source]++,this.allNeighborsCount[c.target]++,this.allNeighborsCount[c.source]++,this
}),j.addMethod("dropNode",function(a){if("string"!=typeof a&&"number"!=typeof a||1!==arguments.length)throw"dropNode: Wrong arguments.";if(!this.nodesIndex[a])throw'The node "'+a+'" does not exist.';var b,c,d;for(delete this.nodesIndex[a],b=0,d=this.nodesArray.length;d>b;b++)if(this.nodesArray[b].id===a){this.nodesArray.splice(b,1);break}for(b=this.edgesArray.length-1;b>=0;b--)(this.edgesArray[b].source===a||this.edgesArray[b].target===a)&&this.dropEdge(this.edgesArray[b].id);delete this.inNeighborsIndex[a],delete this.outNeighborsIndex[a],delete this.allNeighborsIndex[a],delete this.inNeighborsCount[a],delete this.outNeighborsCount[a],delete this.allNeighborsCount[a];for(c in this.nodesIndex)delete this.inNeighborsIndex[c][a],delete this.outNeighborsIndex[c][a],delete this.allNeighborsIndex[c][a];return this}),j.addMethod("dropEdge",function(a){if("string"!=typeof a&&"number"!=typeof a||1!==arguments.length)throw"dropEdge: Wrong arguments.";if(!this.edgesIndex[a])throw'The edge "'+a+'" does not exist.';var b,c,d;for(d=this.edgesIndex[a],delete this.edgesIndex[a],b=0,c=this.edgesArray.length;c>b;b++)if(this.edgesArray[b].id===a){this.edgesArray.splice(b,1);break}return delete this.inNeighborsIndex[d.target][d.source][d.id],Object.keys(this.inNeighborsIndex[d.target][d.source]).length||delete this.inNeighborsIndex[d.target][d.source],delete this.outNeighborsIndex[d.source][d.target][d.id],Object.keys(this.outNeighborsIndex[d.source][d.target]).length||delete this.outNeighborsIndex[d.source][d.target],delete this.allNeighborsIndex[d.source][d.target][d.id],Object.keys(this.allNeighborsIndex[d.source][d.target]).length||delete this.allNeighborsIndex[d.source][d.target],d.target!==d.source&&(delete this.allNeighborsIndex[d.target][d.source][d.id],Object.keys(this.allNeighborsIndex[d.target][d.source]).length||delete this.allNeighborsIndex[d.target][d.source]),this.inNeighborsCount[d.target]--,this.outNeighborsCount[d.source]--,this.allNeighborsCount[d.source]--,this.allNeighborsCount[d.target]--,this}),j.addMethod("kill",function(){this.nodesArray.length=0,this.edgesArray.length=0,delete this.nodesArray,delete this.edgesArray,delete this.nodesIndex,delete this.edgesIndex,delete this.inNeighborsIndex,delete this.outNeighborsIndex,delete this.allNeighborsIndex,delete this.inNeighborsCount,delete this.outNeighborsCount,delete this.allNeighborsCount}),j.addMethod("clear",function(){return this.nodesArray.length=0,this.edgesArray.length=0,b(this.nodesIndex),b(this.edgesIndex),b(this.nodesIndex),b(this.inNeighborsIndex),b(this.outNeighborsIndex),b(this.allNeighborsIndex),b(this.inNeighborsCount),b(this.outNeighborsCount),b(this.allNeighborsCount),this}),j.addMethod("read",function(a){var b,c,d;for(c=a.nodes||[],b=0,d=c.length;d>b;b++)this.addNode(c[b]);for(c=a.edges||[],b=0,d=c.length;d>b;b++)this.addEdge(c[b]);return this}),j.addMethod("nodes",function(a){if(!arguments.length)return this.nodesArray.slice(0);if(1===arguments.length&&("string"==typeof a||"number"==typeof a))return this.nodesIndex[a];if(1===arguments.length&&"[object Array]"===Object.prototype.toString.call(a)){var b,c,d=[];for(b=0,c=a.length;c>b;b++){if("string"!=typeof a[b]&&"number"!=typeof a[b])throw"nodes: Wrong arguments.";d.push(this.nodesIndex[a[b]])}return d}throw"nodes: Wrong arguments."}),j.addMethod("degree",function(a,b){if(b={"in":this.inNeighborsCount,out:this.outNeighborsCount}[b||""]||this.allNeighborsCount,"string"==typeof a||"number"==typeof a)return b[a];if("[object Array]"===Object.prototype.toString.call(a)){var c,d,e=[];for(c=0,d=a.length;d>c;c++){if("string"!=typeof a[c]&&"number"!=typeof a[c])throw"degree: Wrong arguments.";e.push(b[a[c]])}return e}throw"degree: Wrong arguments."}),j.addMethod("edges",function(a){if(!arguments.length)return this.edgesArray.slice(0);if(1===arguments.length&&("string"==typeof a||"number"==typeof a))return this.edgesIndex[a];if(1===arguments.length&&"[object Array]"===Object.prototype.toString.call(a)){var b,c,d=[];for(b=0,c=a.length;c>b;b++){if("string"!=typeof a[b]&&"number"!=typeof a[b])throw"edges: Wrong arguments.";d.push(this.edgesIndex[a[b]])}return d}throw"edges: Wrong arguments."}),"undefined"!=typeof sigma?(sigma.classes=sigma.classes||Object.create(null),sigma.classes.graph=j):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports.graph=j):this.graph=j}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.classes"),sigma.classes.camera=function(a,b,c,d){sigma.classes.dispatcher.extend(this),Object.defineProperty(this,"graph",{value:b}),Object.defineProperty(this,"id",{value:a}),Object.defineProperty(this,"readPrefix",{value:"read_cam"+a+":"}),Object.defineProperty(this,"prefix",{value:"cam"+a+":"}),this.x=0,this.y=0,this.ratio=1,this.angle=0,this.isAnimated=!1,this.settings="object"==typeof d&&d?c.embedObject(d):c},sigma.classes.camera.prototype.goTo=function(b){if(!this.settings("enableCamera"))return this;var c,d,e=b||{},f=["x","y","ratio","angle"];for(c=0,d=f.length;d>c;c++)if(e[f[c]]!==a){if("number"!=typeof e[f[c]]||isNaN(e[f[c]]))throw'Value for "'+f[c]+'" is not a number.';this[f[c]]=e[f[c]]}return this.dispatchEvent("coordinatesUpdated"),this},sigma.classes.camera.prototype.applyView=function(b,c,d){d=d||{},c=c!==a?c:this.prefix,b=b!==a?b:this.readPrefix;var e,f,g,h=d.nodes||this.graph.nodes(),i=d.edges||this.graph.edges(),j=Math.cos(this.angle),k=Math.sin(this.angle);for(e=0,f=h.length;f>e;e++)g=h[e],g[c+"x"]=(((g[b+"x"]||0)-this.x)*j+((g[b+"y"]||0)-this.y)*k)/this.ratio+(d.width||0)/2,g[c+"y"]=(((g[b+"y"]||0)-this.y)*j-((g[b+"x"]||0)-this.x)*k)/this.ratio+(d.height||0)/2,g[c+"size"]=(g[b+"size"]||0)/Math.pow(this.ratio,this.settings("nodesPowRatio"));for(e=0,f=i.length;f>e;e++)i[e][c+"size"]=(i[e][b+"size"]||0)/Math.pow(this.ratio,this.settings("edgesPowRatio"));return this},sigma.classes.camera.prototype.graphPosition=function(a,b,c){var d=0,e=0,f=Math.cos(this.angle),g=Math.sin(this.angle);return c||(d=-(this.x*f+this.y*g)/this.ratio,e=-(this.y*f-this.x*g)/this.ratio),{x:(a*f+b*g)/this.ratio+d,y:(b*f-a*g)/this.ratio+e}},sigma.classes.camera.prototype.cameraPosition=function(a,b,c){var d=0,e=0,f=Math.cos(this.angle),g=Math.sin(this.angle);return c||(d=-(this.x*f+this.y*g)/this.ratio,e=-(this.y*f-this.x*g)/this.ratio),{x:((a-d)*f-(b-e)*g)*this.ratio,y:((b-e)*f+(a-d)*g)*this.ratio}},sigma.classes.camera.prototype.getMatrix=function(){var a=sigma.utils.matrices.scale(1/this.ratio),b=sigma.utils.matrices.rotation(this.angle),c=sigma.utils.matrices.translation(-this.x,-this.y),d=sigma.utils.matrices.multiply(c,sigma.utils.matrices.multiply(b,a));return d},sigma.classes.camera.prototype.getRectangle=function(a,b){var c=this.cameraPosition(a,0,!0),d=this.cameraPosition(0,b,!0),e=this.cameraPosition(a/2,b/2,!0),f=this.cameraPosition(a/4,0,!0).x,g=this.cameraPosition(0,b/4,!0).y;return{x1:this.x-e.x-f,y1:this.y-e.y-g,x2:this.x-e.x+f+c.x,y2:this.y-e.y-g+c.y,height:Math.sqrt(Math.pow(d.x,2)+Math.pow(d.y+2*g,2))}}}.call(this),function(a){"use strict";function b(a,b){var c=b.x+b.width/2,d=b.y+b.height/2,e=a.y<d,f=a.x<c;return e?f?0:1:f?2:3}function c(a,b){for(var c=[],d=0;4>d;d++)a.x2>=b[d][0].x&&a.x1<=b[d][1].x&&a.y1+a.height>=b[d][0].y&&a.y1<=b[d][2].y&&c.push(d);return c}function d(a,b){for(var c=[],d=0;4>d;d++)j.collision(a,b[d])&&c.push(d);return c}function e(a,b){var c,d,e=b.level+1,f=Math.round(b.bounds.width/2),g=Math.round(b.bounds.height/2),h=Math.round(b.bounds.x),j=Math.round(b.bounds.y);switch(a){case 0:c=h,d=j;break;case 1:c=h+f,d=j;break;case 2:c=h,d=j+g;break;case 3:c=h+f,d=j+g}return i({x:c,y:d,width:f,height:g},e,b.maxElements,b.maxLevel)}function f(b,d,g){if(g.level<g.maxLevel)for(var h=c(d,g.corners),i=0,j=h.length;j>i;i++)g.nodes[h[i]]===a&&(g.nodes[h[i]]=e(h[i],g)),f(b,d,g.nodes[h[i]]);else g.elements.push(b)}function g(c,d){if(d.level<d.maxLevel){var e=b(c,d.bounds);return d.nodes[e]!==a?g(c,d.nodes[e]):[]}return d.elements}function h(b,c,d,e){if(e=e||{},c.level<c.maxLevel)for(var f=d(b,c.corners),g=0,i=f.length;i>g;g++)c.nodes[f[g]]!==a&&h(b,c.nodes[f[g]],d,e);else for(var j=0,k=c.elements.length;k>j;j++)e[c.elements[j].id]===a&&(e[c.elements[j].id]=c.elements[j]);return e}function i(a,b,c,d){return{level:b||0,bounds:a,corners:j.splitSquare(a),maxElements:c||20,maxLevel:d||4,elements:[],nodes:[]}}var j={pointToSquare:function(a){return{x1:a.x-a.size,y1:a.y-a.size,x2:a.x+a.size,y2:a.y-a.size,height:2*a.size}},isAxisAligned:function(a){return a.x1===a.x2||a.y1===a.y2},axisAlignedTopPoints:function(a){return a.y1===a.y2&&a.x1<a.x2?a:a.x1===a.x2&&a.y2>a.y1?{x1:a.x1-a.height,y1:a.y1,x2:a.x1,y2:a.y1,height:a.height}:a.x1===a.x2&&a.y2<a.y1?{x1:a.x1,y1:a.y2,x2:a.x2+a.height,y2:a.y2,height:a.height}:{x1:a.x2,y1:a.y1-a.height,x2:a.x1,y2:a.y1-a.height,height:a.height}},lowerLeftCoor:function(a){var b=Math.sqrt(Math.pow(a.x2-a.x1,2)+Math.pow(a.y2-a.y1,2));return{x:a.x1-(a.y2-a.y1)*a.height/b,y:a.y1+(a.x2-a.x1)*a.height/b}},lowerRightCoor:function(a,b){return{x:b.x-a.x1+a.x2,y:b.y-a.y1+a.y2}},rectangleCorners:function(a){var b=this.lowerLeftCoor(a),c=this.lowerRightCoor(a,b);return[{x:a.x1,y:a.y1},{x:a.x2,y:a.y2},{x:b.x,y:b.y},{x:c.x,y:c.y}]},splitSquare:function(a){return[[{x:a.x,y:a.y},{x:a.x+a.width/2,y:a.y},{x:a.x,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height/2}],[{x:a.x+a.width/2,y:a.y},{x:a.x+a.width,y:a.y},{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x+a.width,y:a.y+a.height/2}],[{x:a.x,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x,y:a.y+a.height},{x:a.x+a.width/2,y:a.y+a.height}],[{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x+a.width,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height},{x:a.x+a.width,y:a.y+a.height}]]},axis:function(a,b){return[{x:a[1].x-a[0].x,y:a[1].y-a[0].y},{x:a[1].x-a[3].x,y:a[1].y-a[3].y},{x:b[0].x-b[2].x,y:b[0].y-b[2].y},{x:b[0].x-b[1].x,y:b[0].y-b[1].y}]},projection:function(a,b){var c=(a.x*b.x+a.y*b.y)/(Math.pow(b.x,2)+Math.pow(b.y,2));return{x:c*b.x,y:c*b.y}},axisCollision:function(a,b,c){for(var d=[],e=[],f=0;4>f;f++){var g=this.projection(b[f],a),h=this.projection(c[f],a);d.push(g.x*a.x+g.y*a.y),e.push(h.x*a.x+h.y*a.y)}var i=Math.max.apply(Math,d),j=Math.max.apply(Math,e),k=Math.min.apply(Math,d),l=Math.min.apply(Math,e);return i>=l&&j>=k},collision:function(a,b){for(var c=this.axis(a,b),d=!0,e=0;4>e;e++)d*=this.axisCollision(c[e],a,b);return!!d}},k=function(){this._geom=j,this._tree=null,this._cache={query:!1,result:!1}};k.prototype.index=function(a,b){if(!b.bounds)throw"sigma.classes.quad.index: bounds information not given.";var c=b.prefix||"";this._tree=i(b.bounds,0,b.maxElements,b.maxLevel);for(var d=0,e=a.length;e>d;d++)f(a[d],j.pointToSquare({x:a[d][c+"x"],y:a[d][c+"y"],size:a[d][c+"size"]}),this._tree);return this._cache={query:!1,result:!1},this._tree},k.prototype.point=function(a,b){return this._tree?g({x:a,y:b},this._tree)||[]:[]},k.prototype.area=function(a){var b,e,f=JSON.stringify(a);if(this._cache.query===f)return this._cache.result;j.isAxisAligned(a)?(b=c,e=j.axisAlignedTopPoints(a)):(b=d,e=j.rectangleCorners(a));var g=this._tree?h(e,this._tree,b):[],i=[];for(var k in g)i.push(g[k]);return this._cache.query=f,this._cache.result=i,i},"undefined"!=typeof this.sigma?(this.sigma.classes=this.sigma.classes||{},this.sigma.classes.quad=k):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=k),exports.quad=k):this.quad=k}.call(this),function(a){"use strict";function b(a,b){var c=b.x+b.width/2,d=b.y+b.height/2,e=a.y<d,f=a.x<c;return e?f?0:1:f?2:3}function c(a,b){for(var c=[],d=0;4>d;d++)a.x2>=b[d][0].x&&a.x1<=b[d][1].x&&a.y1+a.height>=b[d][0].y&&a.y1<=b[d][2].y&&c.push(d);return c}function d(a,b){for(var c=[],d=0;4>d;d++)j.collision(a,b[d])&&c.push(d);return c}function e(a,b){var c,d,e=b.level+1,f=Math.round(b.bounds.width/2),g=Math.round(b.bounds.height/2),h=Math.round(b.bounds.x),j=Math.round(b.bounds.y);switch(a){case 0:c=h,d=j;break;case 1:c=h+f,d=j;break;case 2:c=h,d=j+g;break;case 3:c=h+f,d=j+g}return i({x:c,y:d,width:f,height:g},e,b.maxElements,b.maxLevel)}function f(b,d,g){if(g.level<g.maxLevel)for(var h=c(d,g.corners),i=0,j=h.length;j>i;i++)g.nodes[h[i]]===a&&(g.nodes[h[i]]=e(h[i],g)),f(b,d,g.nodes[h[i]]);else g.elements.push(b)}function g(c,d){if(d.level<d.maxLevel){var e=b(c,d.bounds);return d.nodes[e]!==a?g(c,d.nodes[e]):[]}return d.elements}function h(b,c,d,e){if(e=e||{},c.level<c.maxLevel)for(var f=d(b,c.corners),g=0,i=f.length;i>g;g++)c.nodes[f[g]]!==a&&h(b,c.nodes[f[g]],d,e);else for(var j=0,k=c.elements.length;k>j;j++)e[c.elements[j].id]===a&&(e[c.elements[j].id]=c.elements[j]);return e}function i(a,b,c,d){return{level:b||0,bounds:a,corners:j.splitSquare(a),maxElements:c||40,maxLevel:d||8,elements:[],nodes:[]}}var j={pointToSquare:function(a){return{x1:a.x-a.size,y1:a.y-a.size,x2:a.x+a.size,y2:a.y-a.size,height:2*a.size}},lineToSquare:function(a){return a.y1<a.y2?a.x1<a.x2?{x1:a.x1-a.size,y1:a.y1-a.size,x2:a.x2+a.size,y2:a.y1-a.size,height:a.y2-a.y1+2*a.size}:{x1:a.x2-a.size,y1:a.y1-a.size,x2:a.x1+a.size,y2:a.y1-a.size,height:a.y2-a.y1+2*a.size}:a.x1<a.x2?{x1:a.x1-a.size,y1:a.y2-a.size,x2:a.x2+a.size,y2:a.y2-a.size,height:a.y1-a.y2+2*a.size}:{x1:a.x2-a.size,y1:a.y2-a.size,x2:a.x1+a.size,y2:a.y2-a.size,height:a.y1-a.y2+2*a.size}},quadraticCurveToSquare:function(a,b){var c=sigma.utils.getPointOnQuadraticCurve(.5,a.x1,a.y1,a.x2,a.y2,b.x,b.y),d=Math.min(a.x1,a.x2,c.x),e=Math.max(a.x1,a.x2,c.x),f=Math.min(a.y1,a.y2,c.y),g=Math.max(a.y1,a.y2,c.y);return{x1:d-a.size,y1:f-a.size,x2:e+a.size,y2:f-a.size,height:g-f+2*a.size}},selfLoopToSquare:function(a){var b=sigma.utils.getSelfLoopControlPoints(a.x,a.y,a.size),c=Math.min(a.x,b.x1,b.x2),d=Math.max(a.x,b.x1,b.x2),e=Math.min(a.y,b.y1,b.y2),f=Math.max(a.y,b.y1,b.y2);return{x1:c-a.size,y1:e-a.size,x2:d+a.size,y2:e-a.size,height:f-e+2*a.size}},isAxisAligned:function(a){return a.x1===a.x2||a.y1===a.y2},axisAlignedTopPoints:function(a){return a.y1===a.y2&&a.x1<a.x2?a:a.x1===a.x2&&a.y2>a.y1?{x1:a.x1-a.height,y1:a.y1,x2:a.x1,y2:a.y1,height:a.height}:a.x1===a.x2&&a.y2<a.y1?{x1:a.x1,y1:a.y2,x2:a.x2+a.height,y2:a.y2,height:a.height}:{x1:a.x2,y1:a.y1-a.height,x2:a.x1,y2:a.y1-a.height,height:a.height}},lowerLeftCoor:function(a){var b=Math.sqrt(Math.pow(a.x2-a.x1,2)+Math.pow(a.y2-a.y1,2));return{x:a.x1-(a.y2-a.y1)*a.height/b,y:a.y1+(a.x2-a.x1)*a.height/b}},lowerRightCoor:function(a,b){return{x:b.x-a.x1+a.x2,y:b.y-a.y1+a.y2}},rectangleCorners:function(a){var b=this.lowerLeftCoor(a),c=this.lowerRightCoor(a,b);return[{x:a.x1,y:a.y1},{x:a.x2,y:a.y2},{x:b.x,y:b.y},{x:c.x,y:c.y}]},splitSquare:function(a){return[[{x:a.x,y:a.y},{x:a.x+a.width/2,y:a.y},{x:a.x,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height/2}],[{x:a.x+a.width/2,y:a.y},{x:a.x+a.width,y:a.y},{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x+a.width,y:a.y+a.height/2}],[{x:a.x,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x,y:a.y+a.height},{x:a.x+a.width/2,y:a.y+a.height}],[{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x+a.width,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height},{x:a.x+a.width,y:a.y+a.height}]]},axis:function(a,b){return[{x:a[1].x-a[0].x,y:a[1].y-a[0].y},{x:a[1].x-a[3].x,y:a[1].y-a[3].y},{x:b[0].x-b[2].x,y:b[0].y-b[2].y},{x:b[0].x-b[1].x,y:b[0].y-b[1].y}]},projection:function(a,b){var c=(a.x*b.x+a.y*b.y)/(Math.pow(b.x,2)+Math.pow(b.y,2));return{x:c*b.x,y:c*b.y}},axisCollision:function(a,b,c){for(var d=[],e=[],f=0;4>f;f++){var g=this.projection(b[f],a),h=this.projection(c[f],a);d.push(g.x*a.x+g.y*a.y),e.push(h.x*a.x+h.y*a.y)}var i=Math.max.apply(Math,d),j=Math.max.apply(Math,e),k=Math.min.apply(Math,d),l=Math.min.apply(Math,e);return i>=l&&j>=k},collision:function(a,b){for(var c=this.axis(a,b),d=!0,e=0;4>e;e++)d*=this.axisCollision(c[e],a,b);return!!d}},k=function(){this._geom=j,this._tree=null,this._cache={query:!1,result:!1},this._enabled=!0};k.prototype.index=function(a,b){if(!this._enabled)return this._tree;if(!b.bounds)throw"sigma.classes.edgequad.index: bounds information not given.";var c,d,e,g,h,k=b.prefix||"";this._tree=i(b.bounds,0,b.maxElements,b.maxLevel);for(var l=a.edges(),m=0,n=l.length;n>m;m++)d=a.nodes(l[m].source),e=a.nodes(l[m].target),h={x1:d[k+"x"],y1:d[k+"y"],x2:e[k+"x"],y2:e[k+"y"],size:l[m][k+"size"]||0},"curve"===l[m].type||"curvedArrow"===l[m].type?d.id===e.id?(g={x:d[k+"x"],y:d[k+"y"],size:d[k+"size"]||0},f(l[m],j.selfLoopToSquare(g),this._tree)):(c=sigma.utils.getQuadraticControlPoint(h.x1,h.y1,h.x2,h.y2),f(l[m],j.quadraticCurveToSquare(h,c),this._tree)):f(l[m],j.lineToSquare(h),this._tree);return this._cache={query:!1,result:!1},this._tree},k.prototype.point=function(a,b){return this._enabled&&this._tree?g({x:a,y:b},this._tree)||[]:[]},k.prototype.area=function(a){if(!this._enabled)return[];var b,e,f=JSON.stringify(a);if(this._cache.query===f)return this._cache.result;j.isAxisAligned(a)?(b=c,e=j.axisAlignedTopPoints(a)):(b=d,e=j.rectangleCorners(a));var g=this._tree?h(e,this._tree,b):[],i=[];for(var k in g)i.push(g[k]);return this._cache.query=f,this._cache.result=i,i},"undefined"!=typeof this.sigma?(this.sigma.classes=this.sigma.classes||{},this.sigma.classes.edgequad=k):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=k),exports.edgequad=k):this.edgequad=k}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.captors"),sigma.captors.mouse=function(a,b,c){function d(a){var b,c,d;return y("mouseEnabled")&&v.dispatchEvent("mousemove",{x:sigma.utils.getX(a)-a.target.width/2,y:sigma.utils.getY(a)-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),y("mouseEnabled")&&q?(r=!0,s=!0,u&&clearTimeout(u),u=setTimeout(function(){r=!1},y("dragTimeout")),sigma.misc.animation.killAll(x),x.isMoving=!0,d=x.cameraPosition(sigma.utils.getX(a)-o,sigma.utils.getY(a)-p,!0),b=k-d.x,c=l-d.y,(b!==x.x||c!==x.y)&&(m=x.x,n=x.y,x.goTo({x:b,y:c})),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1):void 0}function e(a){if(y("mouseEnabled")&&q){q=!1,u&&clearTimeout(u),x.isMoving=!1;var b=sigma.utils.getX(a),c=sigma.utils.getY(a);r?(sigma.misc.animation.killAll(x),sigma.misc.animation.camera(x,{x:x.x+y("mouseInertiaRatio")*(x.x-m),y:x.y+y("mouseInertiaRatio")*(x.y-n)},{easing:"quadraticOut",duration:y("mouseInertiaDuration")})):(o!==b||p!==c)&&x.goTo({x:x.x,y:x.y}),v.dispatchEvent("mouseup",{x:b-a.target.width/2,y:c-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),r=!1}}function f(a){if(y("mouseEnabled"))switch(k=x.x,l=x.y,m=x.x,n=x.y,o=sigma.utils.getX(a),p=sigma.utils.getY(a),s=!1,t=(new Date).getTime(),a.which){case 2:break;case 3:v.dispatchEvent("rightclick",{x:o-a.target.width/2,y:p-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey});break;default:q=!0,v.dispatchEvent("mousedown",{x:o-a.target.width/2,y:p-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey})}}function g(){y("mouseEnabled")&&v.dispatchEvent("mouseout")}function h(a){return y("mouseEnabled")&&v.dispatchEvent("click",{x:sigma.utils.getX(a)-a.target.width/2,y:sigma.utils.getY(a)-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey,isDragging:(new Date).getTime()-t>100&&s}),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1}function i(a){var b,c,d;return y("mouseEnabled")?(c=1/y("doubleClickZoomingRatio"),v.dispatchEvent("doubleclick",{x:o-a.target.width/2,y:p-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),y("doubleClickEnabled")&&(b=x.cameraPosition(sigma.utils.getX(a)-a.target.width/2,sigma.utils.getY(a)-a.target.height/2,!0),d={duration:y("doubleClickZoomDuration")},sigma.utils.zoomTo(x,b.x,b.y,c,d)),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1):void 0}function j(a){var b,c,d;return y("mouseEnabled")&&y("mouseWheelEnabled")?(c=sigma.utils.getDelta(a)>0?1/y("zoomingRatio"):y("zoomingRatio"),b=x.cameraPosition(sigma.utils.getX(a)-a.target.width/2,sigma.utils.getY(a)-a.target.height/2,!0),d={duration:y("mouseZoomDuration")},sigma.utils.zoomTo(x,b.x,b.y,c,d),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1):void 0}var k,l,m,n,o,p,q,r,s,t,u,v=this,w=a,x=b,y=c;sigma.classes.dispatcher.extend(this),sigma.utils.doubleClick(w,"click",i),w.addEventListener("DOMMouseScroll",j,!1),w.addEventListener("mousewheel",j,!1),w.addEventListener("mousemove",d,!1),w.addEventListener("mousedown",f,!1),w.addEventListener("click",h,!1),w.addEventListener("mouseout",g,!1),document.addEventListener("mouseup",e,!1),this.kill=function(){sigma.utils.unbindDoubleClick(w,"click"),w.removeEventListener("DOMMouseScroll",j),w.removeEventListener("mousewheel",j),w.removeEventListener("mousemove",d),w.removeEventListener("mousedown",f),w.removeEventListener("click",h),w.removeEventListener("mouseout",g),document.removeEventListener("mouseup",e)}}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.captors"),sigma.captors.touch=function(a,b,c){function d(a){var b=sigma.utils.getOffset(B);return{x:a.pageX-b.left,y:a.pageY-b.top}}function e(a){if(D("touchEnabled")){var b,c,e,f,g,h;switch(E=a.touches,E.length){case 1:C.isMoving=!0,w=1,i=C.x,j=C.y,m=C.x,n=C.y,g=d(E[0]),q=g.x,r=g.y;break;case 2:return C.isMoving=!0,w=2,g=d(E[0]),h=d(E[1]),b=g.x,e=g.y,c=h.x,f=h.y,m=C.x,n=C.y,k=C.angle,l=C.ratio,i=C.x,j=C.y,q=b,r=e,s=c,t=f,u=Math.atan2(t-r,s-q),v=Math.sqrt(Math.pow(t-r,2)+Math.pow(s-q,2)),a.preventDefault(),!1}}}function f(a){if(D("touchEnabled")){E=a.touches;var b=D("touchInertiaRatio");switch(z&&(x=!1,clearTimeout(z)),w){case 2:if(1===a.touches.length){e(a),a.preventDefault();break}case 1:C.isMoving=!1,A.dispatchEvent("stopDrag"),x&&(y=!1,sigma.misc.animation.camera(C,{x:C.x+b*(C.x-m),y:C.y+b*(C.y-n)},{easing:"quadraticOut",duration:D("touchInertiaDuration")})),x=!1,w=0}}}function g(a){if(!y&&D("touchEnabled")){var b,c,e,f,g,h,B,F,G,H,I,J,K,L,M,N,O;switch(E=a.touches,x=!0,z&&clearTimeout(z),z=setTimeout(function(){x=!1},D("dragTimeout")),w){case 1:F=d(E[0]),b=F.x,e=F.y,H=C.cameraPosition(b-q,e-r,!0),L=i-H.x,M=j-H.y,(L!==C.x||M!==C.y)&&(m=C.x,n=C.y,C.goTo({x:L,y:M}),A.dispatchEvent("mousemove",{x:F.x-a.target.width/2,y:F.y-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),A.dispatchEvent("drag"));break;case 2:F=d(E[0]),G=d(E[1]),b=F.x,e=F.y,c=G.x,f=G.y,I=C.cameraPosition((q+s)/2-a.target.width/2,(r+t)/2-a.target.height/2,!0),B=C.cameraPosition((b+c)/2-a.target.width/2,(e+f)/2-a.target.height/2,!0),J=Math.atan2(f-e,c-b)-u,K=Math.sqrt(Math.pow(f-e,2)+Math.pow(c-b,2))/v,b=I.x,e=I.y,N=l/K,b*=K,e*=K,O=k-J,g=Math.cos(-J),h=Math.sin(-J),c=b*g+e*h,f=e*g-b*h,b=c,e=f,L=b-B.x+i,M=e-B.y+j,(N!==C.ratio||O!==C.angle||L!==C.x||M!==C.y)&&(m=C.x,n=C.y,o=C.angle,p=C.ratio,C.goTo({x:L,y:M,angle:O,ratio:N}),A.dispatchEvent("drag"))}return a.preventDefault(),!1}}function h(a){var b,c,e;return a.touches&&1===a.touches.length&&D("touchEnabled")?(y=!0,c=1/D("doubleClickZoomingRatio"),b=d(a.touches[0]),A.dispatchEvent("doubleclick",{x:b.x-a.target.width/2,y:b.y-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),D("doubleClickEnabled")&&(b=C.cameraPosition(b.x-a.target.width/2,b.y-a.target.height/2,!0),e={duration:D("doubleClickZoomDuration"),onComplete:function(){y=!1}},sigma.utils.zoomTo(C,b.x,b.y,c,e)),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1):void 0}var i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A=this,B=a,C=b,D=c,E=[];sigma.classes.dispatcher.extend(this),sigma.utils.doubleClick(B,"touchstart",h),B.addEventListener("touchstart",e,!1),B.addEventListener("touchend",f,!1),B.addEventListener("touchcancel",f,!1),B.addEventListener("touchleave",f,!1),B.addEventListener("touchmove",g,!1),this.kill=function(){sigma.utils.unbindDoubleClick(B,"touchstart"),B.addEventListener("touchstart",e),B.addEventListener("touchend",f),B.addEventListener("touchcancel",f),B.addEventListener("touchleave",f),B.addEventListener("touchmove",g)}}}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";if("undefined"==typeof conrad)throw"conrad is not declared";sigma.utils.pkg("sigma.renderers"),sigma.renderers.canvas=function(a,b,c,d){if("object"!=typeof d)throw"sigma.renderers.canvas: Wrong arguments.";if(!(d.container instanceof HTMLElement))throw"Container not found.";var e,f,g,h;for(sigma.classes.dispatcher.extend(this),Object.defineProperty(this,"conradId",{value:sigma.utils.id()}),this.graph=a,this.camera=b,this.contexts={},this.domElements={},this.options=d,this.container=this.options.container,this.settings="object"==typeof d.settings&&d.settings?c.embedObjects(d.settings):c,this.nodesOnScreen=[],this.edgesOnScreen=[],this.jobs={},this.options.prefix="renderer"+this.conradId+":",this.settings("batchEdgesDrawing")?(this.initDOM("canvas","edges"),this.initDOM("canvas","scene"),this.contexts.nodes=this.contexts.scene,this.contexts.labels=this.contexts.scene):(this.initDOM("canvas","scene"),this.contexts.edges=this.contexts.scene,this.contexts.nodes=this.contexts.scene,this.contexts.labels=this.contexts.scene),this.initDOM("canvas","mouse"),this.contexts.hover=this.contexts.mouse,this.captors=[],g=this.options.captors||[sigma.captors.mouse,sigma.captors.touch],e=0,f=g.length;f>e;e++)h="function"==typeof g[e]?g[e]:sigma.captors[g[e]],this.captors.push(new h(this.domElements.mouse,this.camera,this.settings));sigma.misc.bindEvents.call(this,this.options.prefix),sigma.misc.drawHovers.call(this,this.options.prefix),this.resize(!1)},sigma.renderers.canvas.prototype.render=function(b){b=b||{};var c,d,e,f,g,h,i,j,k,l,m,n,o,p={},q=this.graph,r=this.graph.nodes,s=(this.options.prefix||"",this.settings(b,"drawEdges")),t=this.settings(b,"drawNodes"),u=this.settings(b,"drawLabels"),v=this.settings(b,"drawEdgeLabels"),w=this.settings.embedObjects(b,{prefix:this.options.prefix});this.resize(!1),this.settings(b,"hideEdgesOnMove")&&(this.camera.isAnimated||this.camera.isMoving)&&(s=!1),this.camera.applyView(a,this.options.prefix,{width:this.width,height:this.height}),this.clear();for(e in this.jobs)conrad.hasJob(e)&&conrad.killJob(e);for(this.edgesOnScreen=[],this.nodesOnScreen=this.camera.quadtree.area(this.camera.getRectangle(this.width,this.height)),c=this.nodesOnScreen,d=0,f=c.length;f>d;d++)p[c[d].id]=c[d];if(s){for(c=q.edges(),d=0,f=c.length;f>d;d++)g=c[d],!p[g.source]&&!p[g.target]||g.hidden||r(g.source).hidden||r(g.target).hidden||this.edgesOnScreen.push(g);if(this.settings(b,"batchEdgesDrawing"))h="edges_"+this.conradId,n=w("canvasEdgesBatchSize"),l=this.edgesOnScreen,f=l.length,k=0,i=Math.min(l.length,k+n),j=function(){for(o=this.contexts.edges.globalCompositeOperation,this.contexts.edges.globalCompositeOperation="destination-over",m=sigma.canvas.edges,d=k;i>d;d++)g=l[d],(m[g.type||this.settings(b,"defaultEdgeType")]||m.def)(g,q.nodes(g.source),q.nodes(g.target),this.contexts.edges,w);if(v)for(m=sigma.canvas.edges.labels,d=k;i>d;d++)g=l[d],g.hidden||(m[g.type||this.settings(b,"defaultEdgeType")]||m.def)(g,q.nodes(g.source),q.nodes(g.target),this.contexts.labels,w);return this.contexts.edges.globalCompositeOperation=o,i===l.length?(delete this.jobs[h],!1):(k=i+1,i=Math.min(l.length,k+n),!0)},this.jobs[h]=j,conrad.addJob(h,j.bind(this));else{for(m=sigma.canvas.edges,c=this.edgesOnScreen,d=0,f=c.length;f>d;d++)g=c[d],(m[g.type||this.settings(b,"defaultEdgeType")]||m.def)(g,q.nodes(g.source),q.nodes(g.target),this.contexts.edges,w);if(v)for(m=sigma.canvas.edges.labels,c=this.edgesOnScreen,d=0,f=c.length;f>d;d++)c[d].hidden||(m[c[d].type||this.settings(b,"defaultEdgeType")]||m.def)(c[d],q.nodes(c[d].source),q.nodes(c[d].target),this.contexts.labels,w)}}if(t)for(m=sigma.canvas.nodes,c=this.nodesOnScreen,d=0,f=c.length;f>d;d++)c[d].hidden||(m[c[d].type||this.settings(b,"defaultNodeType")]||m.def)(c[d],this.contexts.nodes,w);if(u)for(m=sigma.canvas.labels,c=this.nodesOnScreen,d=0,f=c.length;f>d;d++)c[d].hidden||(m[c[d].type||this.settings(b,"defaultNodeType")]||m.def)(c[d],this.contexts.labels,w);return this.dispatchEvent("render"),this},sigma.renderers.canvas.prototype.initDOM=function(a,b){var c=document.createElement(a);c.style.position="absolute",c.setAttribute("class","sigma-"+b),this.domElements[b]=c,this.container.appendChild(c),"canvas"===a.toLowerCase()&&(this.contexts[b]=c.getContext("2d"))},sigma.renderers.canvas.prototype.resize=function(b,c){var d,e=this.width,f=this.height,g=1;if(b!==a&&c!==a?(this.width=b,this.height=c):(this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,b=this.width,c=this.height),e!==this.width||f!==this.height)for(d in this.domElements)this.domElements[d].style.width=b+"px",this.domElements[d].style.height=c+"px","canvas"===this.domElements[d].tagName.toLowerCase()&&(this.domElements[d].setAttribute("width",b*g+"px"),this.domElements[d].setAttribute("height",c*g+"px"),1!==g&&this.contexts[d].scale(g,g));return this},sigma.renderers.canvas.prototype.clear=function(){var a;for(a in this.domElements)"CANVAS"===this.domElements[a].tagName&&(this.domElements[a].width=this.domElements[a].width);return this},sigma.renderers.canvas.prototype.kill=function(){for(var a,b;b=this.captors.pop();)b.kill();delete this.captors;for(a in this.domElements)this.domElements[a].parentNode.removeChild(this.domElements[a]),delete this.domElements[a],delete this.contexts[a];delete this.domElements,delete this.contexts},sigma.utils.pkg("sigma.canvas.nodes"),sigma.utils.pkg("sigma.canvas.edges"),sigma.utils.pkg("sigma.canvas.labels")}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.renderers"),sigma.renderers.webgl=function(a,b,c,d){if("object"!=typeof d)throw"sigma.renderers.webgl: Wrong arguments.";if(!(d.container instanceof HTMLElement))throw"Container not found.";var e,f,g,h;for(sigma.classes.dispatcher.extend(this),this.jobs={},Object.defineProperty(this,"conradId",{value:sigma.utils.id()}),this.graph=a,this.camera=b,this.contexts={},this.domElements={},this.options=d,this.container=this.options.container,this.settings="object"==typeof d.settings&&d.settings?c.embedObjects(d.settings):c,this.options.prefix=this.camera.readPrefix,Object.defineProperty(this,"nodePrograms",{value:{}}),Object.defineProperty(this,"edgePrograms",{value:{}}),Object.defineProperty(this,"nodeFloatArrays",{value:{}}),Object.defineProperty(this,"edgeFloatArrays",{value:{}}),this.settings(d,"batchEdgesDrawing")?(this.initDOM("canvas","edges",!0),this.initDOM("canvas","nodes",!0)):(this.initDOM("canvas","scene",!0),this.contexts.nodes=this.contexts.scene,this.contexts.edges=this.contexts.scene),this.initDOM("canvas","labels"),this.initDOM("canvas","mouse"),this.contexts.hover=this.contexts.mouse,this.captors=[],g=this.options.captors||[sigma.captors.mouse,sigma.captors.touch],e=0,f=g.length;f>e;e++)h="function"==typeof g[e]?g[e]:sigma.captors[g[e]],this.captors.push(new h(this.domElements.mouse,this.camera,this.settings));sigma.misc.bindEvents.call(this,this.camera.prefix),sigma.misc.drawHovers.call(this,this.camera.prefix),this.resize()},sigma.renderers.webgl.prototype.process=function(){var a,b,c,d,e,f,g=this.graph,h=sigma.utils.extend(h,this.options);for(d in this.nodeFloatArrays)delete this.nodeFloatArrays[d];for(d in this.edgeFloatArrays)delete this.edgeFloatArrays[d];for(a=g.edges(),b=0,c=a.length;c>b;b++)e=a[b].type||this.settings(h,"defaultEdgeType"),d=e&&sigma.webgl.edges[e]?e:"def",this.edgeFloatArrays[d]||(this.edgeFloatArrays[d]={edges:[]}),this.edgeFloatArrays[d].edges.push(a[b]);
for(a=g.nodes(),b=0,c=a.length;c>b;b++)e=a[b].type||this.settings(h,"defaultNodeType"),d=e&&sigma.webgl.nodes[e]?e:"def",this.nodeFloatArrays[d]||(this.nodeFloatArrays[d]={nodes:[]}),this.nodeFloatArrays[d].nodes.push(a[b]);for(d in this.edgeFloatArrays)for(f=sigma.webgl.edges[d],a=this.edgeFloatArrays[d].edges,b=0,c=a.length;c>b;b++)this.edgeFloatArrays[d].array||(this.edgeFloatArrays[d].array=new Float32Array(a.length*f.POINTS*f.ATTRIBUTES)),a[b].hidden||g.nodes(a[b].source).hidden||g.nodes(a[b].target).hidden||f.addEdge(a[b],g.nodes(a[b].source),g.nodes(a[b].target),this.edgeFloatArrays[d].array,b*f.POINTS*f.ATTRIBUTES,h.prefix,this.settings);for(d in this.nodeFloatArrays)for(f=sigma.webgl.nodes[d],a=this.nodeFloatArrays[d].nodes,b=0,c=a.length;c>b;b++)this.nodeFloatArrays[d].array||(this.nodeFloatArrays[d].array=new Float32Array(a.length*f.POINTS*f.ATTRIBUTES)),a[b].hidden||f.addNode(a[b],this.nodeFloatArrays[d].array,b*f.POINTS*f.ATTRIBUTES,h.prefix,this.settings);return this},sigma.renderers.webgl.prototype.render=function(b){var c,d,e,f,g,h,i=this,j=(this.graph,this.contexts.nodes),k=this.contexts.edges,l=this.camera.getMatrix(),m=sigma.utils.extend(b,this.options),n=this.settings(m,"drawLabels"),o=this.settings(m,"drawEdges"),p=this.settings(m,"drawNodes");this.resize(!1),this.settings(m,"hideEdgesOnMove")&&(this.camera.isAnimated||this.camera.isMoving)&&(o=!1),this.clear(),l=sigma.utils.matrices.multiply(l,sigma.utils.matrices.translation(this.width/2,this.height/2));for(f in this.jobs)conrad.hasJob(f)&&conrad.killJob(f);if(o)if(this.settings(m,"batchEdgesDrawing"))(function(){var a,b,c,d,e,f,g,h,i;c="edges_"+this.conradId,i=this.settings(m,"webglEdgesBatchSize"),a=Object.keys(this.edgeFloatArrays),a.length&&(b=0,h=sigma.webgl.edges[a[b]],e=this.edgeFloatArrays[a[b]].array,g=0,f=Math.min(g+i*h.POINTS,e.length/h.ATTRIBUTES),d=function(){return this.edgePrograms[a[b]]||(this.edgePrograms[a[b]]=h.initProgram(k)),f>g&&(k.useProgram(this.edgePrograms[a[b]]),h.render(k,this.edgePrograms[a[b]],e,{settings:this.settings,matrix:l,width:this.width,height:this.height,ratio:this.camera.ratio,scalingRatio:this.settings(m,"webglOversamplingRatio"),start:g,count:f-g})),f>=e.length/h.ATTRIBUTES&&b===a.length-1?(delete this.jobs[c],!1):(f>=e.length/h.ATTRIBUTES?(b++,e=this.edgeFloatArrays[a[b]].array,h=sigma.webgl.edges[a[b]],g=0,f=Math.min(g+i*h.POINTS,e.length/h.ATTRIBUTES)):(g=f,f=Math.min(g+i*h.POINTS,e.length/h.ATTRIBUTES)),!0)},this.jobs[c]=d,conrad.addJob(c,d.bind(this)))}).call(this);else for(f in this.edgeFloatArrays)h=sigma.webgl.edges[f],this.edgePrograms[f]||(this.edgePrograms[f]=h.initProgram(k)),this.edgeFloatArrays[f]&&(k.useProgram(this.edgePrograms[f]),h.render(k,this.edgePrograms[f],this.edgeFloatArrays[f].array,{settings:this.settings,matrix:l,width:this.width,height:this.height,ratio:this.camera.ratio,scalingRatio:this.settings(m,"webglOversamplingRatio")}));if(p){j.blendFunc(j.SRC_ALPHA,j.ONE_MINUS_SRC_ALPHA),j.enable(j.BLEND);for(f in this.nodeFloatArrays)h=sigma.webgl.nodes[f],this.nodePrograms[f]||(this.nodePrograms[f]=h.initProgram(j)),this.nodeFloatArrays[f]&&(j.useProgram(this.nodePrograms[f]),h.render(j,this.nodePrograms[f],this.nodeFloatArrays[f].array,{settings:this.settings,matrix:l,width:this.width,height:this.height,ratio:this.camera.ratio,scalingRatio:this.settings(m,"webglOversamplingRatio")}))}if(n)for(c=this.camera.quadtree.area(this.camera.getRectangle(this.width,this.height)),this.camera.applyView(a,a,{nodes:c,edges:[],width:this.width,height:this.height}),g=function(a){return i.settings({prefix:i.camera.prefix},a)},d=0,e=c.length;e>d;d++)c[d].hidden||(sigma.canvas.labels[c[d].type||this.settings(m,"defaultNodeType")]||sigma.canvas.labels.def)(c[d],this.contexts.labels,g);return this.dispatchEvent("render"),this},sigma.renderers.webgl.prototype.initDOM=function(a,b,c){var d=document.createElement(a),e=this;d.style.position="absolute",d.setAttribute("class","sigma-"+b),this.domElements[b]=d,this.container.appendChild(d),"canvas"===a.toLowerCase()&&(this.contexts[b]=d.getContext(c?"experimental-webgl":"2d",{preserveDrawingBuffer:!0}),c&&(d.addEventListener("webglcontextlost",function(a){a.preventDefault()},!1),d.addEventListener("webglcontextrestored",function(){e.render()},!1)))},sigma.renderers.webgl.prototype.resize=function(b,c){var d,e=this.width,f=this.height;if(b!==a&&c!==a?(this.width=b,this.height=c):(this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,b=this.width,c=this.height),e!==this.width||f!==this.height)for(d in this.domElements)this.domElements[d].style.width=b+"px",this.domElements[d].style.height=c+"px","canvas"===this.domElements[d].tagName.toLowerCase()&&(this.contexts[d]&&this.contexts[d].scale?(this.domElements[d].setAttribute("width",b+"px"),this.domElements[d].setAttribute("height",c+"px")):(this.domElements[d].setAttribute("width",b*this.settings("webglOversamplingRatio")+"px"),this.domElements[d].setAttribute("height",c*this.settings("webglOversamplingRatio")+"px")));for(d in this.contexts)this.contexts[d]&&this.contexts[d].viewport&&this.contexts[d].viewport(0,0,this.width*this.settings("webglOversamplingRatio"),this.height*this.settings("webglOversamplingRatio"));return this},sigma.renderers.webgl.prototype.clear=function(){var a;for(a in this.domElements)"CANVAS"===this.domElements[a].tagName&&(this.domElements[a].width=this.domElements[a].width);return this.contexts.nodes.clear(this.contexts.nodes.COLOR_BUFFER_BIT),this.contexts.edges.clear(this.contexts.edges.COLOR_BUFFER_BIT),this},sigma.renderers.webgl.prototype.kill=function(){for(var a,b;b=this.captors.pop();)b.kill();delete this.captors;for(a in this.domElements)this.domElements[a].parentNode.removeChild(this.domElements[a]),delete this.domElements[a],delete this.contexts[a];delete this.domElements,delete this.contexts},sigma.utils.pkg("sigma.webgl.nodes"),sigma.utils.pkg("sigma.webgl.edges"),sigma.utils.pkg("sigma.canvas.labels")}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.renderers");var b,c=!!a.WebGLRenderingContext;if(c){b=document.createElement("canvas");try{c=!(!b.getContext("webgl")&&!b.getContext("experimental-webgl"))}catch(d){c=!1}}sigma.renderers.def=c?sigma.renderers.webgl:sigma.renderers.canvas}(this),function(){"use strict";sigma.utils.pkg("sigma.webgl.nodes"),sigma.webgl.nodes.def={POINTS:3,ATTRIBUTES:5,addNode:function(a,b,c,d,e){var f=sigma.utils.floatColor(a.color||e("defaultNodeColor"));b[c++]=a[d+"x"],b[c++]=a[d+"y"],b[c++]=a[d+"size"],b[c++]=f,b[c++]=0,b[c++]=a[d+"x"],b[c++]=a[d+"y"],b[c++]=a[d+"size"],b[c++]=f,b[c++]=2*Math.PI/3,b[c++]=a[d+"x"],b[c++]=a[d+"y"],b[c++]=a[d+"size"],b[c++]=f,b[c++]=4*Math.PI/3},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_position"),g=a.getAttribLocation(b,"a_size"),h=a.getAttribLocation(b,"a_color"),i=a.getAttribLocation(b,"a_angle"),j=a.getUniformLocation(b,"u_resolution"),k=a.getUniformLocation(b,"u_matrix"),l=a.getUniformLocation(b,"u_ratio"),m=a.getUniformLocation(b,"u_scale");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.DYNAMIC_DRAW),a.uniform2f(j,d.width,d.height),a.uniform1f(l,1/Math.pow(d.ratio,d.settings("nodesPowRatio"))),a.uniform1f(m,d.scalingRatio),a.uniformMatrix3fv(k,!1,d.matrix),a.enableVertexAttribArray(f),a.enableVertexAttribArray(g),a.enableVertexAttribArray(h),a.enableVertexAttribArray(i),a.vertexAttribPointer(f,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(g,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.vertexAttribPointer(h,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,12),a.vertexAttribPointer(i,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,16),a.drawArrays(a.TRIANGLES,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_position;","attribute float a_size;","attribute float a_color;","attribute float a_angle;","uniform vec2 u_resolution;","uniform float u_ratio;","uniform float u_scale;","uniform mat3 u_matrix;","varying vec4 color;","varying vec2 center;","varying float radius;","void main() {","radius = a_size * u_ratio;","vec2 position = (u_matrix * vec3(a_position, 1)).xy;","center = position * u_scale;","center = vec2(center.x, u_scale * u_resolution.y - center.y);","position = position +","2.0 * radius * vec2(cos(a_angle), sin(a_angle));","position = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);","radius = radius * u_scale;","gl_Position = vec4(position, 0, 1);","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","varying vec2 center;","varying float radius;","void main(void) {","vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);","vec2 m = gl_FragCoord.xy - center;","float diff = radius - sqrt(m.x * m.x + m.y * m.y);","if (diff > 0.0)","gl_FragColor = color;","else","gl_FragColor = color0;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";sigma.utils.pkg("sigma.webgl.nodes"),sigma.webgl.nodes.fast={POINTS:1,ATTRIBUTES:4,addNode:function(a,b,c,d,e){b[c++]=a[d+"x"],b[c++]=a[d+"y"],b[c++]=a[d+"size"],b[c++]=sigma.utils.floatColor(a.color||e("defaultNodeColor"))},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_position"),g=a.getAttribLocation(b,"a_size"),h=a.getAttribLocation(b,"a_color"),i=a.getUniformLocation(b,"u_resolution"),j=a.getUniformLocation(b,"u_matrix"),k=a.getUniformLocation(b,"u_ratio"),l=a.getUniformLocation(b,"u_scale");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.DYNAMIC_DRAW),a.uniform2f(i,d.width,d.height),a.uniform1f(k,1/Math.pow(d.ratio,d.settings("nodesPowRatio"))),a.uniform1f(l,d.scalingRatio),a.uniformMatrix3fv(j,!1,d.matrix),a.enableVertexAttribArray(f),a.enableVertexAttribArray(g),a.enableVertexAttribArray(h),a.vertexAttribPointer(f,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(g,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.vertexAttribPointer(h,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,12),a.drawArrays(a.POINTS,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_position;","attribute float a_size;","attribute float a_color;","uniform vec2 u_resolution;","uniform float u_ratio;","uniform float u_scale;","uniform mat3 u_matrix;","varying vec4 color;","void main() {","gl_Position = vec4(","((u_matrix * vec3(a_position, 1)).xy /","u_resolution * 2.0 - 1.0) * vec2(1, -1),","0,","1",");","gl_PointSize = a_size * u_ratio * u_scale * 2.0;","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","void main(void) {","gl_FragColor = color;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";sigma.utils.pkg("sigma.webgl.edges"),sigma.webgl.edges.def={POINTS:6,ATTRIBUTES:7,addEdge:function(a,b,c,d,e,f,g){var h=(a[f+"size"]||1)/2,i=b[f+"x"],j=b[f+"y"],k=c[f+"x"],l=c[f+"y"],m=a.color;if(!m)switch(g("edgeColor")){case"source":m=b.color||g("defaultNodeColor");break;case"target":m=c.color||g("defaultNodeColor");break;default:m=g("defaultEdgeColor")}m=sigma.utils.floatColor(m),d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=0,d[e++]=m,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=1,d[e++]=m,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=0,d[e++]=m,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=0,d[e++]=m,d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=1,d[e++]=m,d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=0,d[e++]=m},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_color"),g=a.getAttribLocation(b,"a_position1"),h=a.getAttribLocation(b,"a_position2"),i=a.getAttribLocation(b,"a_thickness"),j=a.getAttribLocation(b,"a_minus"),k=a.getUniformLocation(b,"u_resolution"),l=a.getUniformLocation(b,"u_matrix"),m=a.getUniformLocation(b,"u_matrixHalfPi"),n=a.getUniformLocation(b,"u_matrixHalfPiMinus"),o=a.getUniformLocation(b,"u_ratio"),p=a.getUniformLocation(b,"u_scale");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.STATIC_DRAW),a.uniform2f(k,d.width,d.height),a.uniform1f(o,d.ratio/Math.pow(d.ratio,d.settings("edgesPowRatio"))),a.uniform1f(p,d.scalingRatio),a.uniformMatrix3fv(l,!1,d.matrix),a.uniformMatrix2fv(m,!1,sigma.utils.matrices.rotation(Math.PI/2,!0)),a.uniformMatrix2fv(n,!1,sigma.utils.matrices.rotation(-Math.PI/2,!0)),a.enableVertexAttribArray(f),a.enableVertexAttribArray(g),a.enableVertexAttribArray(h),a.enableVertexAttribArray(i),a.enableVertexAttribArray(j),a.vertexAttribPointer(g,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(h,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.vertexAttribPointer(i,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,16),a.vertexAttribPointer(j,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,20),a.vertexAttribPointer(f,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,24),a.drawArrays(a.TRIANGLES,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_position1;","attribute vec2 a_position2;","attribute float a_thickness;","attribute float a_minus;","attribute float a_color;","uniform vec2 u_resolution;","uniform float u_ratio;","uniform float u_scale;","uniform mat3 u_matrix;","uniform mat2 u_matrixHalfPi;","uniform mat2 u_matrixHalfPiMinus;","varying vec4 color;","void main() {","vec2 position = a_thickness * u_ratio *","normalize(a_position2 - a_position1);","mat2 matrix = a_minus * u_matrixHalfPiMinus +","(1.0 - a_minus) * u_matrixHalfPi;","position = matrix * position + a_position1;","gl_Position = vec4(","((u_matrix * vec3(position, 1)).xy /","u_resolution * 2.0 - 1.0) * vec2(1, -1),","0,","1",");","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","void main(void) {","gl_FragColor = color;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";sigma.utils.pkg("sigma.webgl.edges"),sigma.webgl.edges.fast={POINTS:2,ATTRIBUTES:3,addEdge:function(a,b,c,d,e,f,g){var h=((a[f+"size"]||1)/2,b[f+"x"]),i=b[f+"y"],j=c[f+"x"],k=c[f+"y"],l=a.color;if(!l)switch(g("edgeColor")){case"source":l=b.color||g("defaultNodeColor");break;case"target":l=c.color||g("defaultNodeColor");break;default:l=g("defaultEdgeColor")}l=sigma.utils.floatColor(l),d[e++]=h,d[e++]=i,d[e++]=l,d[e++]=j,d[e++]=k,d[e++]=l},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_color"),g=a.getAttribLocation(b,"a_position"),h=a.getUniformLocation(b,"u_resolution"),i=a.getUniformLocation(b,"u_matrix");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.DYNAMIC_DRAW),a.uniform2f(h,d.width,d.height),a.uniformMatrix3fv(i,!1,d.matrix),a.enableVertexAttribArray(g),a.enableVertexAttribArray(f),a.vertexAttribPointer(g,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(f,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.lineWidth(3),a.drawArrays(a.LINES,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_position;","attribute float a_color;","uniform vec2 u_resolution;","uniform mat3 u_matrix;","varying vec4 color;","void main() {","gl_Position = vec4(","((u_matrix * vec3(a_position, 1)).xy /","u_resolution * 2.0 - 1.0) * vec2(1, -1),","0,","1",");","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","void main(void) {","gl_FragColor = color;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";sigma.utils.pkg("sigma.webgl.edges"),sigma.webgl.edges.arrow={POINTS:9,ATTRIBUTES:11,addEdge:function(a,b,c,d,e,f,g){var h=(a[f+"size"]||1)/2,i=b[f+"x"],j=b[f+"y"],k=c[f+"x"],l=c[f+"y"],m=c[f+"size"],n=a.color;if(!n)switch(g("edgeColor")){case"source":n=b.color||g("defaultNodeColor");break;case"target":n=c.color||g("defaultNodeColor");break;default:n=g("defaultEdgeColor")}n=sigma.utils.floatColor(n),d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=m,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=1,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=m,d[e++]=0,d[e++]=1,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=m,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=1,d[e++]=-1,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=1,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=1,d[e++]=1,d[e++]=n},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_pos1"),g=a.getAttribLocation(b,"a_pos2"),h=a.getAttribLocation(b,"a_thickness"),i=a.getAttribLocation(b,"a_tSize"),j=a.getAttribLocation(b,"a_delay"),k=a.getAttribLocation(b,"a_minus"),l=a.getAttribLocation(b,"a_head"),m=a.getAttribLocation(b,"a_headPosition"),n=a.getAttribLocation(b,"a_color"),o=a.getUniformLocation(b,"u_resolution"),p=a.getUniformLocation(b,"u_matrix"),q=a.getUniformLocation(b,"u_matrixHalfPi"),r=a.getUniformLocation(b,"u_matrixHalfPiMinus"),s=a.getUniformLocation(b,"u_ratio"),t=a.getUniformLocation(b,"u_nodeRatio"),u=a.getUniformLocation(b,"u_arrowHead"),v=a.getUniformLocation(b,"u_scale");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.STATIC_DRAW),a.uniform2f(o,d.width,d.height),a.uniform1f(s,d.ratio/Math.pow(d.ratio,d.settings("edgesPowRatio"))),a.uniform1f(t,Math.pow(d.ratio,d.settings("nodesPowRatio"))/d.ratio),a.uniform1f(u,5),a.uniform1f(v,d.scalingRatio),a.uniformMatrix3fv(p,!1,d.matrix),a.uniformMatrix2fv(q,!1,sigma.utils.matrices.rotation(Math.PI/2,!0)),a.uniformMatrix2fv(r,!1,sigma.utils.matrices.rotation(-Math.PI/2,!0)),a.enableVertexAttribArray(f),a.enableVertexAttribArray(g),a.enableVertexAttribArray(h),a.enableVertexAttribArray(i),a.enableVertexAttribArray(j),a.enableVertexAttribArray(k),a.enableVertexAttribArray(l),a.enableVertexAttribArray(m),a.enableVertexAttribArray(n),a.vertexAttribPointer(f,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(g,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.vertexAttribPointer(h,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,16),a.vertexAttribPointer(i,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,20),a.vertexAttribPointer(j,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,24),a.vertexAttribPointer(k,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,28),a.vertexAttribPointer(l,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,32),a.vertexAttribPointer(m,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,36),a.vertexAttribPointer(n,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,40),a.drawArrays(a.TRIANGLES,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_pos1;","attribute vec2 a_pos2;","attribute float a_thickness;","attribute float a_tSize;","attribute float a_delay;","attribute float a_minus;","attribute float a_head;","attribute float a_headPosition;","attribute float a_color;","uniform vec2 u_resolution;","uniform float u_ratio;","uniform float u_nodeRatio;","uniform float u_arrowHead;","uniform float u_scale;","uniform mat3 u_matrix;","uniform mat2 u_matrixHalfPi;","uniform mat2 u_matrixHalfPiMinus;","varying vec4 color;","void main() {","vec2 pos = normalize(a_pos2 - a_pos1);","mat2 matrix = (1.0 - a_head) *","(","a_minus * u_matrixHalfPiMinus +","(1.0 - a_minus) * u_matrixHalfPi",") + a_head * (","a_headPosition * u_matrixHalfPiMinus * 0.6 +","(a_headPosition * a_headPosition - 1.0) * mat2(1.0)",");","pos = a_pos1 + (","(1.0 - a_head) * a_thickness * u_ratio * matrix * pos +","a_head * u_arrowHead * a_thickness * u_ratio * matrix * pos +","a_delay * pos * (","a_tSize / u_nodeRatio +","u_arrowHead * a_thickness * u_ratio",")",");","gl_Position = vec4(","((u_matrix * vec3(pos, 1)).xy /","u_resolution * 2.0 - 1.0) * vec2(1, -1),","0,","1",");","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","void main(void) {","gl_FragColor = color;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.canvas.labels"),sigma.canvas.labels.def=function(a,b,c){var d,e=c("prefix")||"",f=a[e+"size"];f<c("labelThreshold")||"string"==typeof a.label&&(d="fixed"===c("labelSize")?c("defaultLabelSize"):c("labelSizeRatio")*f,b.font=(c("fontStyle")?c("fontStyle")+" ":"")+d+"px "+c("font"),b.fillStyle="node"===c("labelColor")?a.color||c("defaultNodeColor"):c("defaultLabelColor"),b.fillText(a.label,Math.round(a[e+"x"]+f+3),Math.round(a[e+"y"]+d/3)))}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.canvas.hovers"),sigma.canvas.hovers.def=function(a,b,c){var d,e,f,g,h,i=c("hoverFontStyle")||c("fontStyle"),j=c("prefix")||"",k=a[j+"size"],l="fixed"===c("labelSize")?c("defaultLabelSize"):c("labelSizeRatio")*k;b.font=(i?i+" ":"")+l+"px "+(c("hoverFont")||c("font")),b.beginPath(),b.fillStyle="node"===c("labelHoverBGColor")?a.color||c("defaultNodeColor"):c("defaultHoverLabelBGColor"),a.label&&c("labelHoverShadow")&&(b.shadowOffsetX=0,b.shadowOffsetY=0,b.shadowBlur=8,b.shadowColor=c("labelHoverShadowColor")),a.label&&"string"==typeof a.label&&(d=Math.round(a[j+"x"]-l/2-2),e=Math.round(a[j+"y"]-l/2-2),f=Math.round(b.measureText(a.label).width+l/2+k+7),g=Math.round(l+4),h=Math.round(l/2+2),b.moveTo(d,e+h),b.arcTo(d,e,d+h,e,h),b.lineTo(d+f,e),b.lineTo(d+f,e+g),b.lineTo(d+h,e+g),b.arcTo(d,e+g,d,e+g-h,h),b.lineTo(d,e+h),b.closePath(),b.fill(),b.shadowOffsetX=0,b.shadowOffsetY=0,b.shadowBlur=0),c("borderSize")>0&&(b.beginPath(),b.fillStyle="node"===c("nodeBorderColor")?a.color||c("defaultNodeColor"):c("defaultNodeBorderColor"),b.arc(a[j+"x"],a[j+"y"],k+c("borderSize"),0,2*Math.PI,!0),b.closePath(),b.fill());var m=sigma.canvas.nodes[a.type]||sigma.canvas.nodes.def;m(a,b,c),"string"==typeof a.label&&(b.fillStyle="node"===c("labelHoverColor")?a.color||c("defaultNodeColor"):c("defaultLabelHoverColor"),b.fillText(a.label,Math.round(a[j+"x"]+k+3),Math.round(a[j+"y"]+l/3)))}}.call(this),function(){"use strict";sigma.utils.pkg("sigma.canvas.nodes"),sigma.canvas.nodes.def=function(a,b,c){var d=c("prefix")||"";b.fillStyle=a.color||c("defaultNodeColor"),b.beginPath(),b.arc(a[d+"x"],a[d+"y"],a[d+"size"],0,2*Math.PI,!0),b.closePath(),b.fill()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.def=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.curve=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor"),l={},m=b[g+"size"],n=b[g+"x"],o=b[g+"y"],p=c[g+"x"],q=c[g+"y"];if(l=b.id===c.id?sigma.utils.getSelfLoopControlPoints(n,o,m):sigma.utils.getQuadraticControlPoint(n,o,p,q),!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(n,o),b.id===c.id?d.bezierCurveTo(l.x1,l.y1,l.x2,l.y2,p,q):d.quadraticCurveTo(l.x,l.y,p,q),d.stroke()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.arrow=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=e("edgeColor"),i=e("defaultNodeColor"),j=e("defaultEdgeColor"),k=a[g+"size"]||1,l=c[g+"size"],m=b[g+"x"],n=b[g+"y"],o=c[g+"x"],p=c[g+"y"],q=Math.max(2.5*k,e("minArrowSize")),r=Math.sqrt(Math.pow(o-m,2)+Math.pow(p-n,2)),s=m+(o-m)*(r-q-l)/r,t=n+(p-n)*(r-q-l)/r,u=(o-m)*q/r,v=(p-n)*q/r;if(!f)switch(h){case"source":f=b.color||i;break;case"target":f=c.color||i;break;default:f=j}d.strokeStyle=f,d.lineWidth=k,d.beginPath(),d.moveTo(m,n),d.lineTo(s,t),d.stroke(),d.fillStyle=f,d.beginPath(),d.moveTo(s+u,t+v),d.lineTo(s+.6*v,t-.6*u),d.lineTo(s-.6*v,t+.6*u),d.lineTo(s+u,t+v),d.closePath(),d.fill()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.curvedArrow=function(a,b,c,d,e){var f,g,h,i,j,k=a.color,l=e("prefix")||"",m=e("edgeColor"),n=e("defaultNodeColor"),o=e("defaultEdgeColor"),p={},q=a[l+"size"]||1,r=c[l+"size"],s=b[l+"x"],t=b[l+"y"],u=c[l+"x"],v=c[l+"y"],w=Math.max(2.5*q,e("minArrowSize"));if(p=b.id===c.id?sigma.utils.getSelfLoopControlPoints(s,t,r):sigma.utils.getQuadraticControlPoint(s,t,u,v),b.id===c.id?(f=Math.sqrt(Math.pow(u-p.x1,2)+Math.pow(v-p.y1,2)),g=p.x1+(u-p.x1)*(f-w-r)/f,h=p.y1+(v-p.y1)*(f-w-r)/f,i=(u-p.x1)*w/f,j=(v-p.y1)*w/f):(f=Math.sqrt(Math.pow(u-p.x,2)+Math.pow(v-p.y,2)),g=p.x+(u-p.x)*(f-w-r)/f,h=p.y+(v-p.y)*(f-w-r)/f,i=(u-p.x)*w/f,j=(v-p.y)*w/f),!k)switch(m){case"source":k=b.color||n;break;case"target":k=c.color||n;break;default:k=o}d.strokeStyle=k,d.lineWidth=q,d.beginPath(),d.moveTo(s,t),b.id===c.id?d.bezierCurveTo(p.x2,p.y2,p.x1,p.y1,g,h):d.quadraticCurveTo(p.x,p.y,g,h),d.stroke(),d.fillStyle=k,d.beginPath(),d.moveTo(g+i,h+j),d.lineTo(g+.6*j,h-.6*i),d.lineTo(g-.6*j,h+.6*i),d.lineTo(g+i,h+j),d.closePath(),d.fill()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.def=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,h*=e("edgeHoverSizeRatio"),d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.curve=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=e("edgeHoverSizeRatio")*(a[g+"size"]||1),i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor"),l={},m=b[g+"size"],n=b[g+"x"],o=b[g+"y"],p=c[g+"x"],q=c[g+"y"];if(l=b.id===c.id?sigma.utils.getSelfLoopControlPoints(n,o,m):sigma.utils.getQuadraticControlPoint(n,o,p,q),!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(n,o),b.id===c.id?d.bezierCurveTo(l.x1,l.y1,l.x2,l.y2,p,q):d.quadraticCurveTo(l.x,l.y,p,q),d.stroke()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.arrow=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=e("edgeColor"),i=e("defaultNodeColor"),j=e("defaultEdgeColor"),k=a[g+"size"]||1,l=c[g+"size"],m=b[g+"x"],n=b[g+"y"],o=c[g+"x"],p=c[g+"y"];k=a.hover?e("edgeHoverSizeRatio")*k:k;var q=2.5*k,r=Math.sqrt(Math.pow(o-m,2)+Math.pow(p-n,2)),s=m+(o-m)*(r-q-l)/r,t=n+(p-n)*(r-q-l)/r,u=(o-m)*q/r,v=(p-n)*q/r;if(!f)switch(h){case"source":f=b.color||i;break;case"target":f=c.color||i;break;default:f=j}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,d.strokeStyle=f,d.lineWidth=k,d.beginPath(),d.moveTo(m,n),d.lineTo(s,t),d.stroke(),d.fillStyle=f,d.beginPath(),d.moveTo(s+u,t+v),d.lineTo(s+.6*v,t-.6*u),d.lineTo(s-.6*v,t+.6*u),d.lineTo(s+u,t+v),d.closePath(),d.fill()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.curvedArrow=function(a,b,c,d,e){var f,g,h,i,j,k,l=a.color,m=e("prefix")||"",n=e("edgeColor"),o=e("defaultNodeColor"),p=e("defaultEdgeColor"),q={},r=e("edgeHoverSizeRatio")*(a[m+"size"]||1),s=c[m+"size"],t=b[m+"x"],u=b[m+"y"],v=c[m+"x"],w=c[m+"y"];if(q=b.id===c.id?sigma.utils.getSelfLoopControlPoints(t,u,s):sigma.utils.getQuadraticControlPoint(t,u,v,w),b.id===c.id?(f=Math.sqrt(Math.pow(v-q.x1,2)+Math.pow(w-q.y1,2)),g=2.5*r,h=q.x1+(v-q.x1)*(f-g-s)/f,i=q.y1+(w-q.y1)*(f-g-s)/f,j=(v-q.x1)*g/f,k=(w-q.y1)*g/f):(f=Math.sqrt(Math.pow(v-q.x,2)+Math.pow(w-q.y,2)),g=2.5*r,h=q.x+(v-q.x)*(f-g-s)/f,i=q.y+(w-q.y)*(f-g-s)/f,j=(v-q.x)*g/f,k=(w-q.y)*g/f),!l)switch(n){case"source":l=b.color||o;break;case"target":l=c.color||o;break;default:l=p}l="edge"===e("edgeHoverColor")?a.hover_color||l:a.hover_color||e("defaultEdgeHoverColor")||l,d.strokeStyle=l,d.lineWidth=r,d.beginPath(),d.moveTo(t,u),b.id===c.id?d.bezierCurveTo(q.x2,q.y2,q.x1,q.y1,h,i):d.quadraticCurveTo(q.x,q.y,h,i),d.stroke(),d.fillStyle=l,d.beginPath(),d.moveTo(h+j,i+k),d.lineTo(h+.6*k,i-.6*j),d.lineTo(h-.6*k,i+.6*j),d.lineTo(h+j,i+k),d.closePath(),d.fill()}}(),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.canvas.extremities"),sigma.canvas.extremities.def=function(a,b,c,d,e){(sigma.canvas.hovers[b.type]||sigma.canvas.hovers.def)(b,d,e),(sigma.canvas.hovers[c.type]||sigma.canvas.hovers.def)(c,d,e)}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.middlewares"),sigma.utils.pkg("sigma.utils"),sigma.middlewares.rescale=function(a,b,c){var d,e,f,g,h,i,j,k,l=this.graph.nodes(),m=this.graph.edges(),n=this.settings.embedObjects(c||{}),o=n("bounds")||sigma.utils.getBoundaries(this.graph,a,!0),p=o.minX,q=o.minY,r=o.maxX,s=o.maxY,t=o.sizeMax,u=o.weightMax,v=n("width")||1,w=n("height")||1,x=n("autoRescale"),y={nodePosition:1,nodeSize:1,edgeSize:1};for(x instanceof Array||(x=["nodePosition","nodeSize","edgeSize"]),d=0,e=x.length;e>d;d++)if(!y[x[d]])throw new Error('The rescale setting "'+x[d]+'" is not recognized.');var z=~x.indexOf("nodePosition"),A=~x.indexOf("nodeSize"),B=~x.indexOf("edgeSize");for(j="outside"===n("scalingMode")?Math.max(v/Math.max(r-p,1),w/Math.max(s-q,1)):Math.min(v/Math.max(r-p,1),w/Math.max(s-q,1)),k=(n("rescaleIgnoreSize")?0:(n("maxNodeSize")||t)/j)+(n("sideMargin")||0),r+=k,p-=k,s+=k,q-=k,j="outside"===n("scalingMode")?Math.max(v/Math.max(r-p,1),w/Math.max(s-q,1)):Math.min(v/Math.max(r-p,1),w/Math.max(s-q,1)),n("maxNodeSize")||n("minNodeSize")?n("maxNodeSize")===n("minNodeSize")?(f=0,g=+n("maxNodeSize")):(f=(n("maxNodeSize")-n("minNodeSize"))/t,g=+n("minNodeSize")):(f=1,g=0),n("maxEdgeSize")||n("minEdgeSize")?n("maxEdgeSize")===n("minEdgeSize")?(h=0,i=+n("minEdgeSize")):(h=(n("maxEdgeSize")-n("minEdgeSize"))/u,i=+n("minEdgeSize")):(h=1,i=0),d=0,e=m.length;e>d;d++)m[d][b+"size"]=m[d][a+"size"]*(B?h:1)+(B?i:0);
for(d=0,e=l.length;e>d;d++)l[d][b+"size"]=l[d][a+"size"]*(A?f:1)+(A?g:0),l[d][b+"x"]=(l[d][a+"x"]-(r+p)/2)*(z?j:1),l[d][b+"y"]=(l[d][a+"y"]-(s+q)/2)*(z?j:1)},sigma.utils.getBoundaries=function(a,b,c){var d,e,f=a.edges(),g=a.nodes(),h=-1/0,i=-1/0,j=1/0,k=1/0,l=-1/0,m=-1/0;if(c)for(d=0,e=f.length;e>d;d++)h=Math.max(f[d][b+"size"],h);for(d=0,e=g.length;e>d;d++)i=Math.max(g[d][b+"size"],i),l=Math.max(g[d][b+"x"],l),j=Math.min(g[d][b+"x"],j),m=Math.max(g[d][b+"y"],m),k=Math.min(g[d][b+"y"],k);return h=h||1,i=i||1,{weightMax:h,sizeMax:i,minX:j,minY:k,maxX:l,maxY:m}}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.middlewares"),sigma.middlewares.copy=function(a,b){var c,d,e;if(b+""!=a+""){for(e=this.graph.nodes(),c=0,d=e.length;d>c;c++)e[c][b+"x"]=e[c][a+"x"],e[c][b+"y"]=e[c][a+"y"],e[c][b+"size"]=e[c][a+"size"];for(e=this.graph.edges(),c=0,d=e.length;d>c;c++)e[c][b+"size"]=e[c][a+"size"]}}}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.misc.animation.running");var b=function(){var a=0;return function(){return""+ ++a}}();sigma.misc.animation.camera=function(c,d,e){if(!(c instanceof sigma.classes.camera&&"object"==typeof d&&d))throw"animation.camera: Wrong arguments.";if("number"!=typeof d.x&&"number"!=typeof d.y&&"number"!=typeof d.ratio&&"number"!=typeof d.angle)throw"There must be at least one valid coordinate in the given val.";var f,g,h,i,j,k,l=e||{},m=sigma.utils.dateNow();return k={x:c.x,y:c.y,ratio:c.ratio,angle:c.angle},j=l.duration,i="function"!=typeof l.easing?sigma.utils.easings[l.easing||"quadraticInOut"]:l.easing,f=function(){var b,e=l.duration?(sigma.utils.dateNow()-m)/l.duration:1;e>=1?(c.isAnimated=!1,c.goTo({x:d.x!==a?d.x:k.x,y:d.y!==a?d.y:k.y,ratio:d.ratio!==a?d.ratio:k.ratio,angle:d.angle!==a?d.angle:k.angle}),cancelAnimationFrame(g),delete sigma.misc.animation.running[g],"function"==typeof l.onComplete&&l.onComplete()):(b=i(e),c.isAnimated=!0,c.goTo({x:d.x!==a?k.x+(d.x-k.x)*b:k.x,y:d.y!==a?k.y+(d.y-k.y)*b:k.y,ratio:d.ratio!==a?k.ratio+(d.ratio-k.ratio)*b:k.ratio,angle:d.angle!==a?k.angle+(d.angle-k.angle)*b:k.angle}),"function"==typeof l.onNewFrame&&l.onNewFrame(),h.frameId=requestAnimationFrame(f))},g=b(),h={frameId:requestAnimationFrame(f),target:c,type:"camera",options:l,fn:f},sigma.misc.animation.running[g]=h,g},sigma.misc.animation.kill=function(a){if(1!==arguments.length||"number"!=typeof a)throw"animation.kill: Wrong arguments.";var b=sigma.misc.animation.running[a];return b&&(cancelAnimationFrame(a),delete sigma.misc.animation.running[b.frameId],"camera"===b.type&&(b.target.isAnimated=!1),"function"==typeof(b.options||{}).onComplete&&b.options.onComplete()),this},sigma.misc.animation.killAll=function(a){var b,c,d=0,e="string"==typeof a?a:null,f="object"==typeof a?a:null,g=sigma.misc.animation.running;for(c in g)e&&g[c].type!==e||f&&g[c].target!==f||(b=sigma.misc.animation.running[c],cancelAnimationFrame(b.frameId),delete sigma.misc.animation.running[c],"camera"===b.type&&(b.target.isAnimated=!1),d++,"function"==typeof(b.options||{}).onComplete&&b.options.onComplete());return d},sigma.misc.animation.has=function(a){var b,c="string"==typeof a?a:null,d="object"==typeof a?a:null,e=sigma.misc.animation.running;for(b in e)if(!(c&&e[b].type!==c||d&&e[b].target!==d))return!0;return!1}}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.misc"),sigma.misc.bindEvents=function(b){function c(a){a&&(h="x"in a.data?a.data.x:h,i="y"in a.data?a.data.y:i);var c,d,e,f,g,k,l,m,n=[],o=h+j.width/2,p=i+j.height/2,q=j.camera.cameraPosition(h,i),r=j.camera.quadtree.point(q.x,q.y);if(r.length)for(c=0,e=r.length;e>c;c++)if(f=r[c],g=f[b+"x"],k=f[b+"y"],l=f[b+"size"],!f.hidden&&o>g-l&&g+l>o&&p>k-l&&k+l>p&&Math.sqrt(Math.pow(o-g,2)+Math.pow(p-k,2))<l){for(m=!1,d=0;d<n.length;d++)if(f.size>n[d].size){n.splice(d,0,f),m=!0;break}m||n.push(f)}return n}function d(c){function d(a,b){for(r=!1,g=0;g<a.length;g++)if(b.size>a[g].size){a.splice(g,0,b),r=!0;break}r||a.push(b)}if(!j.settings("enableEdgeHovering"))return[];var e=sigma.renderers.canvas&&j instanceof sigma.renderers.canvas;if(!e)throw new Error("The edge events feature is not compatible with the WebGL renderer");c&&(h="x"in c.data?c.data.x:h,i="y"in c.data?c.data.y:i);var f,g,k,l,m,n,o,p,q,r,s=j.settings("edgeHoverPrecision"),t={},u=[],v=h+j.width/2,w=i+j.height/2,x=j.camera.cameraPosition(h,i),y=[];if(e){var z=j.camera.quadtree.area(j.camera.getRectangle(j.width,j.height));for(l=z,f=0,k=l.length;k>f;f++)t[l[f].id]=l[f]}if(j.camera.edgequadtree!==a&&(y=j.camera.edgequadtree.point(x.x,x.y)),y.length)for(f=0,k=y.length;k>f;f++)m=y[f],o=j.graph.nodes(m.source),p=j.graph.nodes(m.target),n=m[b+"size"]||m["read_"+b+"size"],!m.hidden&&!o.hidden&&!p.hidden&&(!e||t[m.source]||t[m.target])&&sigma.utils.getDistance(o[b+"x"],o[b+"y"],v,w)>o[b+"size"]&&sigma.utils.getDistance(p[b+"x"],p[b+"y"],v,w)>p[b+"size"]&&("curve"==m.type||"curvedArrow"==m.type?o.id===p.id?(q=sigma.utils.getSelfLoopControlPoints(o[b+"x"],o[b+"y"],o[b+"size"]),sigma.utils.isPointOnBezierCurve(v,w,o[b+"x"],o[b+"y"],p[b+"x"],p[b+"y"],q.x1,q.y1,q.x2,q.y2,Math.max(n,s))&&d(u,m)):(q=sigma.utils.getQuadraticControlPoint(o[b+"x"],o[b+"y"],p[b+"x"],p[b+"y"]),sigma.utils.isPointOnQuadraticCurve(v,w,o[b+"x"],o[b+"y"],p[b+"x"],p[b+"y"],q.x,q.y,Math.max(n,s))&&d(u,m)):sigma.utils.isPointOnSegment(v,w,o[b+"x"],o[b+"y"],p[b+"x"],p[b+"y"],Math.max(n,s))&&d(u,m));return u}function e(a){function b(a){j.settings("eventsEnabled")&&(j.dispatchEvent("click",a.data),i=c(a),k=d(a),i.length?(j.dispatchEvent("clickNode",{node:i[0],captor:a.data}),j.dispatchEvent("clickNodes",{node:i,captor:a.data})):k.length?(j.dispatchEvent("clickEdge",{edge:k[0],captor:a.data}),j.dispatchEvent("clickEdges",{edge:k,captor:a.data})):j.dispatchEvent("clickStage",{captor:a.data}))}function e(a){j.settings("eventsEnabled")&&(j.dispatchEvent("doubleClick",a.data),i=c(a),k=d(a),i.length?(j.dispatchEvent("doubleClickNode",{node:i[0],captor:a.data}),j.dispatchEvent("doubleClickNodes",{node:i,captor:a.data})):k.length?(j.dispatchEvent("doubleClickEdge",{edge:k[0],captor:a.data}),j.dispatchEvent("doubleClickEdges",{edge:k,captor:a.data})):j.dispatchEvent("doubleClickStage",{captor:a.data}))}function f(a){j.settings("eventsEnabled")&&(j.dispatchEvent("rightClick",a.data),i.length?(j.dispatchEvent("rightClickNode",{node:i[0],captor:a.data}),j.dispatchEvent("rightClickNodes",{node:i,captor:a.data})):k.length?(j.dispatchEvent("rightClickEdge",{edge:k[0],captor:a.data}),j.dispatchEvent("rightClickEdges",{edge:k,captor:a.data})):j.dispatchEvent("rightClickStage",{captor:a.data}))}function g(a){if(j.settings("eventsEnabled")){var b,c,d,e,f=[],g=[];for(b in l)f.push(l[b]);for(l={},c=0,d=f.length;d>c;c++)j.dispatchEvent("outNode",{node:f[c],captor:a.data});for(f.length&&j.dispatchEvent("outNodes",{nodes:f,captor:a.data}),m={},c=0,d=g.length;e>c;c++)j.dispatchEvent("outEdge",{edge:g[c],captor:a.data});f.length&&j.dispatchEvent("outEdges",{edges:g,captor:a.data})}}function h(a){if(j.settings("eventsEnabled")){i=c(a),k=d(a);var b,e,f,g,h=[],n=[],o={},p=i.length,q=[],r=[],s={},t=k.length;for(b=0;p>b;b++)f=i[b],o[f.id]=f,l[f.id]||(n.push(f),l[f.id]=f);for(e in l)o[e]||(h.push(l[e]),delete l[e]);for(b=0,p=n.length;p>b;b++)j.dispatchEvent("overNode",{node:n[b],captor:a.data});for(b=0,p=h.length;p>b;b++)j.dispatchEvent("outNode",{node:h[b],captor:a.data});for(n.length&&j.dispatchEvent("overNodes",{nodes:n,captor:a.data}),h.length&&j.dispatchEvent("outNodes",{nodes:h,captor:a.data}),b=0;t>b;b++)g=k[b],s[g.id]=g,m[g.id]||(r.push(g),m[g.id]=g);for(e in m)s[e]||(q.push(m[e]),delete m[e]);for(b=0,t=r.length;t>b;b++)j.dispatchEvent("overEdge",{edge:r[b],captor:a.data});for(b=0,t=q.length;t>b;b++)j.dispatchEvent("outEdge",{edge:q[b],captor:a.data});r.length&&j.dispatchEvent("overEdges",{edges:r,captor:a.data}),q.length&&j.dispatchEvent("outEdges",{edges:q,captor:a.data})}}var i,k,l={},m={};a.bind("click",b),a.bind("mousedown",h),a.bind("mouseup",h),a.bind("mousemove",h),a.bind("mouseout",g),a.bind("doubleclick",e),a.bind("rightclick",f),j.bind("render",h)}var f,g,h,i,j=this;for(f=0,g=this.captors.length;g>f;f++)e(this.captors[f])}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.misc"),sigma.misc.drawHovers=function(a){function b(){c.contexts.hover.canvas.width=c.contexts.hover.canvas.width;var b,f,g,h,i,j=c.settings("defaultNodeType"),k=c.settings("defaultEdgeType"),l=sigma.canvas.hovers,m=sigma.canvas.edgehovers,n=sigma.canvas.extremities,o=c.settings.embedObjects({prefix:a});if(o("enableHovering")&&o("singleHover")&&Object.keys(d).length&&(h=d[Object.keys(d)[0]],(l[h.type]||l[j]||l.def)(h,c.contexts.hover,o)),o("enableHovering")&&!o("singleHover"))for(b in d)(l[d[b].type]||l[j]||l.def)(d[b],c.contexts.hover,o);if(o("enableEdgeHovering")&&o("singleHover")&&Object.keys(e).length&&(i=e[Object.keys(e)[0]],f=c.graph.nodes(i.source),g=c.graph.nodes(i.target),i.hidden||((m[i.type]||m[k]||m.def)(i,f,g,c.contexts.hover,o),o("edgeHoverExtremities")?(n[i.type]||n.def)(i,f,g,c.contexts.hover,o):((sigma.canvas.nodes[f.type]||sigma.canvas.nodes.def)(f,c.contexts.hover,o),(sigma.canvas.nodes[g.type]||sigma.canvas.nodes.def)(g,c.contexts.hover,o)))),o("enableEdgeHovering")&&!o("singleHover"))for(b in e)i=e[b],f=c.graph.nodes(i.source),g=c.graph.nodes(i.target),i.hidden||((m[i.type]||m[k]||m.def)(i,f,g,c.contexts.hover,o),o("edgeHoverExtremities")?(n[i.type]||n.def)(i,f,g,c.contexts.hover,o):((sigma.canvas.nodes[f.type]||sigma.canvas.nodes.def)(f,c.contexts.hover,o),(sigma.canvas.nodes[g.type]||sigma.canvas.nodes.def)(g,c.contexts.hover,o)))}var c=this,d={},e={};this.bind("overNode",function(a){var c=a.data.node;c.hidden||(d[c.id]=c,b())}),this.bind("outNode",function(a){delete d[a.data.node.id],b()}),this.bind("overEdge",function(a){var c=a.data.edge;c.hidden||(e[c.id]=c,b())}),this.bind("outEdge",function(a){delete e[a.data.edge.id],b()}),this.bind("render",function(){b()})}}.call(this),!function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.dashed=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,h*=e("edgeHoverSizeRatio"),d.save(),d.setLineDash([8,3]),d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.dotted=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,h*=e("edgeHoverSizeRatio"),d.save(),d.setLineDash([2]),d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.parallel=function(a,b,c,d,e){var f,g,h=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,i=e("prefix")||"",j=a[i+"size"]||1,k=e("edgeColor"),l=e("defaultNodeColor"),m=e("defaultEdgeColor"),n=b[i+"x"],o=b[i+"y"],p=c[i+"x"],q=c[i+"y"],r=sigma.utils.getDistance(n,o,p,q);if(!h)switch(k){case"source":h=b.color||l;break;case"target":h=c.color||l;break;default:h=m}h="edge"===e("edgeHoverColor")?a.hover_color||h:a.hover_color||e("defaultEdgeHoverColor")||h,j*=e("edgeHoverSizeRatio"),f=sigma.utils.getCircleIntersection(n,o,j,p,q,r),g=sigma.utils.getCircleIntersection(p,q,j,n,o,r),d.save(),d.strokeStyle=h,d.lineWidth=j,d.beginPath(),d.moveTo(f.xi,f.yi),d.lineTo(g.xi_prime,g.yi_prime),d.closePath(),d.stroke(),d.beginPath(),d.moveTo(f.xi_prime,f.yi_prime),d.lineTo(g.xi,g.yi),d.closePath(),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.tapered=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),g=e("prefix")||"",j=e("defaultNodeColor"),k=e("defaultEdgeColor"),l=b[g+"x"],m=b[g+"y"],n=c[g+"x"],o=c[g+"y"],p=sigma.utils.getDistance(l,m,n,o);if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,h*=e("edgeHoverSizeRatio");var q=sigma.utils.getCircleIntersection(l,m,h,n,o,p);d.save(),d.globalAlpha=.65,d.fillStyle=f,d.beginPath(),d.moveTo(n,o),d.lineTo(q.xi,q.yi),d.lineTo(q.xi_prime,q.yi_prime),d.closePath(),d.fill(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.dashed=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}d.save(),d.strokeStyle=a.active?"edge"===e("edgeActiveColor")?f||k:e("defaultEdgeActiveColor"):f,d.setLineDash([8,3]),d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.dotted=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}d.save(),d.strokeStyle=a.active?"edge"===e("edgeActiveColor")?f||k:e("defaultEdgeActiveColor"):f,d.setLineDash([2]),d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.parallel=function(a,b,c,d,e){var f,g,h=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,i=e("prefix")||"",j=a[i+"size"]||1,k=e("edgeColor"),l=e("defaultNodeColor"),m=e("defaultEdgeColor"),n=b[i+"x"],o=b[i+"y"],p=c[i+"x"],q=c[i+"y"],r=sigma.utils.getDistance(n,o,p,q);if(!h)switch(k){case"source":h=b.color||l;break;case"target":h=c.color||l;break;default:h=m}f=sigma.utils.getCircleIntersection(n,o,j,p,q,r),g=sigma.utils.getCircleIntersection(p,q,j,n,o,r),d.save(),d.strokeStyle=a.active?"edge"===e("edgeActiveColor")?h||m:e("defaultEdgeActiveColor"):h,d.lineWidth=j,d.beginPath(),d.moveTo(f.xi,f.yi),d.lineTo(g.xi_prime,g.yi_prime),d.closePath(),d.stroke(),d.beginPath(),d.moveTo(f.xi_prime,f.yi_prime),d.lineTo(g.xi,g.yi),d.closePath(),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.tapered=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),g=e("prefix")||"",j=e("defaultNodeColor"),k=e("defaultEdgeColor"),l=b[g+"x"],m=b[g+"y"],n=c[g+"x"],o=c[g+"y"],p=sigma.utils.getDistance(l,m,n,o);if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}var q=sigma.utils.getCircleIntersection(l,m,h,n,o,p);d.save(),d.fillStyle=a.active?"edge"===e("edgeActiveColor")?f||k:e("defaultEdgeActiveColor"):f,d.globalAlpha=.65,d.beginPath(),d.moveTo(n,o),d.lineTo(q.xi,q.yi),d.lineTo(q.xi_prime,q.yi_prime),d.closePath(),d.fill(),d.restore()}}(),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.parsers"),sigma.utils.pkg("sigma.utils"),sigma.utils.xhr=function(){if(window.XMLHttpRequest)return new XMLHttpRequest;var a,b;if(window.ActiveXObject){a=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];for(b in a)try{return new ActiveXObject(a[b])}catch(c){}}return null},sigma.parsers.json=function(a,b,c){var d,e=sigma.utils.xhr();if(!e)throw"XMLHttpRequest not supported, cannot load the file.";e.open("GET",a,!0),e.onreadystatechange=function(){4===e.readyState&&(d=JSON.parse(e.responseText),b instanceof sigma?(b.graph.clear(),b.graph.read(d)):"object"==typeof b?(b.graph=d,b=new sigma(b)):"function"==typeof b&&(c=b,b=null),c&&c(b||d))},e.send()}}.call(this),window.CWN||(window.CWN={}),CWN.colors={base:"#ffffca",lightGrey:"#7b7b79",green:"#8fd248",salmon:"#ffcd96",lightBlue:"#91cbdd",red:"#ff0800",blue:"#4f7fbf",purple:"#7228a2",black:"#000000"},CWN.render={},CWN.icon=function(a,b,c){var d=document.createElement("canvas");if(d.width=b,d.height=c,!CWN.render[a])return d;var e=d.getContext("2d");return CWN.render[a](e,2,2,b-4,c-4),d},CWN.render.Junction=function(a,b,c,d){a.fillStyle=CWN.colors.base,a.strokeStyle=CWN.colors.lightGrey,a.lineWidth=1;var e=d/2;a.beginPath(),a.arc(b+e,c+e,e,0,2*Math.PI,!0),a.closePath(),a.fill(),a.stroke()},CWN.render["Power Plant"]=function(a,b,c,d,e){CWN.render.Junction(a,b,c,d,e);var f=d/2;a.beginPath(),a.moveTo(b,c+f),a.lineTo(b+d,c+f),a.stroke(),a.closePath(),a.beginPath(),a.moveTo(b+f,c),a.lineTo(b+f,c+d),a.stroke(),a.closePath()},CWN.render["Pump Plant"]=function(a,b,c,d,e){CWN.render.Junction(a,b,c,d,e);var f=d/2,g=b+f,h=c+f,i=g+f*Math.cos(Math.PI/4),j=h+f*Math.sin(Math.PI/4),k=g+f*Math.cos(Math.PI*(5/4)),l=h+f*Math.sin(Math.PI*(5/4));a.beginPath(),a.moveTo(i,j),a.lineTo(k,l),a.stroke(),a.closePath(),i=g+f*Math.cos(.75*Math.PI),j=h+f*Math.sin(.75*Math.PI),k=g+f*Math.cos(Math.PI*(7/4)),l=h+f*Math.sin(Math.PI*(7/4)),a.beginPath(),a.moveTo(i,j),a.lineTo(k,l),a.stroke(),a.closePath()},CWN.render["Water Treatment"]=function(a,b,c,d){a.fillStyle=CWN.colors.base,a.strokeStyle=CWN.colors.lightGrey,a.lineWidth=1,CWN.render._nSidedPath(a,b,c,d/2,8,22.5),a.fill(),a.closePath(),a.stroke()},CWN.render["Surface Storage"]=function(a,b,c,d){a.fillStyle=CWN.colors.base,a.strokeStyle=CWN.colors.lightGrey,a.lineWidth=1,CWN.render._nSidedPath(a,b,c,d/2,3,90),a.fill(),a.closePath(),a.stroke()},CWN.render["Groundwater Storage"]=function(a,b,c,d,e){var f=d/2,g=a.createLinearGradient(b+f,c,b+f,c+e-.25*e);g.addColorStop(0,CWN.colors.lightGrey),g.addColorStop(1,CWN.colors.base),a.fillStyle=g,a.strokeStyle=CWN.colors.lightGrey,a.lineWidth=1,CWN.render._nSidedPath(a,b,c,f,3,90),a.fill(),a.closePath(),a.stroke()},CWN.render.Sink=function(a,b,c,d){a.fillStyle=CWN.colors.base,a.strokeStyle=CWN.colors.lightGrey,a.lineWidth=1,CWN.render._nSidedPath(a,b,c,d/2,4,45),a.fill(),a.closePath(),a.stroke()},CWN.render["Non-Standard Demand"]=function(a,b,c,d){a.fillStyle=CWN.colors.red,a.strokeStyle=CWN.colors.lightGrey,a.lineWidth=1,CWN.render._nSidedPath(a,b,c,d/2,4,45),a.fill(),a.closePath(),a.stroke()},CWN.render["Agricultural Demand"]=function(a,b,c,d,e){CWN.render._oval(a,b,c,d,e,CWN.colors.lightBlue)},CWN.render["Urban Demand"]=function(a,b,c,d,e){CWN.render._oval(a,b,c,d,e,CWN.colors.salmon)},CWN.render.Wetland=function(a,b,c,d,e){CWN.render._oval(a,b,c,d,e,CWN.colors.green)},CWN.render._oval=function(a,b,c,d,e,f){a.fillStyle=f,e-=.5*d,c+=e/2;var g=.5522848,h=d/2*g,i=e/2*g,j=b+d,k=c+e,l=b+d/2,m=c+e/2;a.beginPath(),a.moveTo(b,m),a.bezierCurveTo(b,m-i,l-h,c,l,c),a.bezierCurveTo(l+h,c,j,m-i,j,m),a.bezierCurveTo(j,m+i,l+h,k,l,k),a.bezierCurveTo(l-h,k,b,m+i,b,m),a.fill(),a.stroke()},CWN.render._nSidedPath=function(a,b,c,d,e,f){b+=d,c+=d;var g,h,i=2*Math.PI/e,j=f*(Math.PI/180);a.beginPath();var k=b+d*Math.cos(-1*j),l=c+d*Math.sin(-1*j);a.moveTo(k,l);for(var m=1;e>m;m++)g=b+d*Math.cos(i*m-j),h=c+d*Math.sin(i*m-j),a.lineTo(g,h);a.lineTo(k,l)},CWN.render.lineMarkers={cost:function(a,b,c,d){a.beginPath(),a.arc(b,c,d,0,2*Math.PI,!1),a.fillStyle=CWN.colors.green,a.fill(),a.closePath()},amplitude:function(a,b,c,d){a.beginPath(),a.arc(b,c,d,0,2*Math.PI,!1),a.lineWidth=2,a.strokeStyle=CWN.colors.black,a.stroke(),a.closePath()},constraints:function(a,b,c,d,e,f){a.beginPath();var g=.4*e,h=.4*f;a.beginPath(),a.moveTo(b+f+g,c-e+h),a.lineTo(b+f-g,c-e-h),a.lineTo(b-f-g,c+e-h),a.lineTo(b-f+g,c+e+h),a.lineTo(b+f+g,c-e+h),a.strokeStyle=CWN.colors.black,a.stroke(),a.closePath()},environmental:function(a,b,c,d){a.beginPath(),a.arc(b,c,d,0,2*Math.PI,!1),a.lineWidth=2,a.strokeStyle=CWN.colors.green,a.stroke(),a.closePath()}},function(){"use strict";sigma.utils.pkg("sigma.canvas.nodes"),sigma.canvas.nodes.Junction=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render.Junction(b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Power Plant"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Power Plant"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Pump Plant"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Pump Plant"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Water Treatment"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Water Treatment"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Surface Storage"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Surface Storage"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Groundwater Storage"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Groundwater Storage"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Agricultural Demand"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Agricultural Demand"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Urban Demand"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Urban Demand"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes.Sink=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render.Sink(b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Non-Standard Demand"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Non-Standard Demand"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes.Wetland=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render.Wetland(b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.cwn=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=(e("edgeColor"),e("defaultNodeColor"),e("defaultEdgeColor"),a[g+"size"]||1),i=c[g+"size"],j=b[g+"x"],k=b[g+"y"],l=c[g+"x"],m=c[g+"y"],n=Math.max(2.5*h,e("minArrowSize")),o=Math.sqrt(Math.pow(l-j,2)+Math.pow(m-k,2)),p=j+(l-j)*(o-n-i)/o,q=k+(m-k)*(o-n-i)/o,r=(l-j)*n/o,s=(m-k)*n/o,f=CWN.colors.salmon;a.calvin.renderInfo&&("flowToSink"==a.calvin.renderInfo.type?f=CWN.colors.lightGrey:"returnFlowFromDemand"==a.calvin.renderInfo.type?f=CWN.colors.red:"gwToDemand"==a.calvin.renderInfo.type?f=CWN.colors.black:"artificalRecharge"==a.calvin.renderInfo.type&&(f=CWN.colors.purple)),d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(j,k),d.lineTo(p,q),d.stroke(),d.fillStyle=f,d.beginPath(),d.moveTo(p+r,q+s),d.lineTo(p+.6*s,q-.6*r),d.lineTo(p-.6*s,q+.6*r),d.lineTo(p+r,q+s),d.closePath(),d.fill();var t=j+3*r,u=k+3*s;if(a.calvin.renderInfo)for(var v in CWN.render.lineMarkers)a.calvin.renderInfo[v]&&(CWN.render.lineMarkers[v](d,t,u,4,r,s),t+=1.75*r,u+=1.75*s)}}();;
/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// @version 0.5.4
window.PolymerGestures = {};

(function(scope) {
  var hasFullPath = false;

  // test for full event path support
  var pathTest = document.createElement('meta');
  if (pathTest.createShadowRoot) {
    var sr = pathTest.createShadowRoot();
    var s = document.createElement('span');
    sr.appendChild(s);
    pathTest.addEventListener('testpath', function(ev) {
      if (ev.path) {
        // if the span is in the event path, then path[0] is the real source for all events
        hasFullPath = ev.path[0] === s;
      }
      ev.stopPropagation();
    });
    var ev = new CustomEvent('testpath', {bubbles: true});
    // must add node to DOM to trigger event listener
    document.head.appendChild(pathTest);
    s.dispatchEvent(ev);
    pathTest.parentNode.removeChild(pathTest);
    sr = s = null;
  }
  pathTest = null;

  var target = {
    shadow: function(inEl) {
      if (inEl) {
        return inEl.shadowRoot || inEl.webkitShadowRoot;
      }
    },
    canTarget: function(shadow) {
      return shadow && Boolean(shadow.elementFromPoint);
    },
    targetingShadow: function(inEl) {
      var s = this.shadow(inEl);
      if (this.canTarget(s)) {
        return s;
      }
    },
    olderShadow: function(shadow) {
      var os = shadow.olderShadowRoot;
      if (!os) {
        var se = shadow.querySelector('shadow');
        if (se) {
          os = se.olderShadowRoot;
        }
      }
      return os;
    },
    allShadows: function(element) {
      var shadows = [], s = this.shadow(element);
      while(s) {
        shadows.push(s);
        s = this.olderShadow(s);
      }
      return shadows;
    },
    searchRoot: function(inRoot, x, y) {
      var t, st, sr, os;
      if (inRoot) {
        t = inRoot.elementFromPoint(x, y);
        if (t) {
          // found element, check if it has a ShadowRoot
          sr = this.targetingShadow(t);
        } else if (inRoot !== document) {
          // check for sibling roots
          sr = this.olderShadow(inRoot);
        }
        // search other roots, fall back to light dom element
        return this.searchRoot(sr, x, y) || t;
      }
    },
    owner: function(element) {
      if (!element) {
        return document;
      }
      var s = element;
      // walk up until you hit the shadow root or document
      while (s.parentNode) {
        s = s.parentNode;
      }
      // the owner element is expected to be a Document or ShadowRoot
      if (s.nodeType != Node.DOCUMENT_NODE && s.nodeType != Node.DOCUMENT_FRAGMENT_NODE) {
        s = document;
      }
      return s;
    },
    findTarget: function(inEvent) {
      if (hasFullPath && inEvent.path && inEvent.path.length) {
        return inEvent.path[0];
      }
      var x = inEvent.clientX, y = inEvent.clientY;
      // if the listener is in the shadow root, it is much faster to start there
      var s = this.owner(inEvent.target);
      // if x, y is not in this root, fall back to document search
      if (!s.elementFromPoint(x, y)) {
        s = document;
      }
      return this.searchRoot(s, x, y);
    },
    findTouchAction: function(inEvent) {
      var n;
      if (hasFullPath && inEvent.path && inEvent.path.length) {
        var path = inEvent.path;
        for (var i = 0; i < path.length; i++) {
          n = path[i];
          if (n.nodeType === Node.ELEMENT_NODE && n.hasAttribute('touch-action')) {
            return n.getAttribute('touch-action');
          }
        }
      } else {
        n = inEvent.target;
        while(n) {
          if (n.nodeType === Node.ELEMENT_NODE && n.hasAttribute('touch-action')) {
            return n.getAttribute('touch-action');
          }
          n = n.parentNode || n.host;
        }
      }
      // auto is default
      return "auto";
    },
    LCA: function(a, b) {
      if (a === b) {
        return a;
      }
      if (a && !b) {
        return a;
      }
      if (b && !a) {
        return b;
      }
      if (!b && !a) {
        return document;
      }
      // fast case, a is a direct descendant of b or vice versa
      if (a.contains && a.contains(b)) {
        return a;
      }
      if (b.contains && b.contains(a)) {
        return b;
      }
      var adepth = this.depth(a);
      var bdepth = this.depth(b);
      var d = adepth - bdepth;
      if (d >= 0) {
        a = this.walk(a, d);
      } else {
        b = this.walk(b, -d);
      }
      while (a && b && a !== b) {
        a = a.parentNode || a.host;
        b = b.parentNode || b.host;
      }
      return a;
    },
    walk: function(n, u) {
      for (var i = 0; n && (i < u); i++) {
        n = n.parentNode || n.host;
      }
      return n;
    },
    depth: function(n) {
      var d = 0;
      while(n) {
        d++;
        n = n.parentNode || n.host;
      }
      return d;
    },
    deepContains: function(a, b) {
      var common = this.LCA(a, b);
      // if a is the common ancestor, it must "deeply" contain b
      return common === a;
    },
    insideNode: function(node, x, y) {
      var rect = node.getBoundingClientRect();
      return (rect.left <= x) && (x <= rect.right) && (rect.top <= y) && (y <= rect.bottom);
    },
    path: function(event) {
      var p;
      if (hasFullPath && event.path && event.path.length) {
        p = event.path;
      } else {
        p = [];
        var n = this.findTarget(event);
        while (n) {
          p.push(n);
          n = n.parentNode || n.host;
        }
      }
      return p;
    }
  };
  scope.targetFinding = target;
  /**
   * Given an event, finds the "deepest" node that could have been the original target before ShadowDOM retargetting
   *
   * @param {Event} Event An event object with clientX and clientY properties
   * @return {Element} The probable event origninator
   */
  scope.findTarget = target.findTarget.bind(target);
  /**
   * Determines if the "container" node deeply contains the "containee" node, including situations where the "containee" is contained by one or more ShadowDOM
   * roots.
   *
   * @param {Node} container
   * @param {Node} containee
   * @return {Boolean}
   */
  scope.deepContains = target.deepContains.bind(target);

  /**
   * Determines if the x/y position is inside the given node.
   *
   * Example:
   *
   *     function upHandler(event) {
   *       var innode = PolymerGestures.insideNode(event.target, event.clientX, event.clientY);
   *       if (innode) {
   *         // wait for tap?
   *       } else {
   *         // tap will never happen
   *       }
   *     }
   *
   * @param {Node} node
   * @param {Number} x Screen X position
   * @param {Number} y screen Y position
   * @return {Boolean}
   */
  scope.insideNode = target.insideNode;

})(window.PolymerGestures);

(function() {
  function shadowSelector(v) {
    return 'html /deep/ ' + selector(v);
  }
  function selector(v) {
    return '[touch-action="' + v + '"]';
  }
  function rule(v) {
    return '{ -ms-touch-action: ' + v + '; touch-action: ' + v + ';}';
  }
  var attrib2css = [
    'none',
    'auto',
    'pan-x',
    'pan-y',
    {
      rule: 'pan-x pan-y',
      selectors: [
        'pan-x pan-y',
        'pan-y pan-x'
      ]
    },
    'manipulation'
  ];
  var styles = '';
  // only install stylesheet if the browser has touch action support
  var hasTouchAction = typeof document.head.style.touchAction === 'string';
  // only add shadow selectors if shadowdom is supported
  var hasShadowRoot = !window.ShadowDOMPolyfill && document.head.createShadowRoot;

  if (hasTouchAction) {
    attrib2css.forEach(function(r) {
      if (String(r) === r) {
        styles += selector(r) + rule(r) + '\n';
        if (hasShadowRoot) {
          styles += shadowSelector(r) + rule(r) + '\n';
        }
      } else {
        styles += r.selectors.map(selector) + rule(r.rule) + '\n';
        if (hasShadowRoot) {
          styles += r.selectors.map(shadowSelector) + rule(r.rule) + '\n';
        }
      }
    });

    var el = document.createElement('style');
    el.textContent = styles;
    document.head.appendChild(el);
  }
})();

/**
 * This is the constructor for new PointerEvents.
 *
 * New Pointer Events must be given a type, and an optional dictionary of
 * initialization properties.
 *
 * Due to certain platform requirements, events returned from the constructor
 * identify as MouseEvents.
 *
 * @constructor
 * @param {String} inType The type of the event to create.
 * @param {Object} [inDict] An optional dictionary of initial event properties.
 * @return {Event} A new PointerEvent of type `inType` and initialized with properties from `inDict`.
 */
(function(scope) {

  var MOUSE_PROPS = [
    'bubbles',
    'cancelable',
    'view',
    'detail',
    'screenX',
    'screenY',
    'clientX',
    'clientY',
    'ctrlKey',
    'altKey',
    'shiftKey',
    'metaKey',
    'button',
    'relatedTarget',
    'pageX',
    'pageY'
  ];

  var MOUSE_DEFAULTS = [
    false,
    false,
    null,
    null,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null,
    0,
    0
  ];

  var NOP_FACTORY = function(){ return function(){}; };

  var eventFactory = {
    // TODO(dfreedm): this is overridden by tap recognizer, needs review
    preventTap: NOP_FACTORY,
    makeBaseEvent: function(inType, inDict) {
      var e = document.createEvent('Event');
      e.initEvent(inType, inDict.bubbles || false, inDict.cancelable || false);
      e.preventTap = eventFactory.preventTap(e);
      return e;
    },
    makeGestureEvent: function(inType, inDict) {
      inDict = inDict || Object.create(null);

      var e = this.makeBaseEvent(inType, inDict);
      for (var i = 0, keys = Object.keys(inDict), k; i < keys.length; i++) {
        k = keys[i];
        e[k] = inDict[k];
      }
      return e;
    },
    makePointerEvent: function(inType, inDict) {
      inDict = inDict || Object.create(null);

      var e = this.makeBaseEvent(inType, inDict);
      // define inherited MouseEvent properties
      for(var i = 0, p; i < MOUSE_PROPS.length; i++) {
        p = MOUSE_PROPS[i];
        e[p] = inDict[p] || MOUSE_DEFAULTS[i];
      }
      e.buttons = inDict.buttons || 0;

      // Spec requires that pointers without pressure specified use 0.5 for down
      // state and 0 for up state.
      var pressure = 0;
      if (inDict.pressure) {
        pressure = inDict.pressure;
      } else {
        pressure = e.buttons ? 0.5 : 0;
      }

      // add x/y properties aliased to clientX/Y
      e.x = e.clientX;
      e.y = e.clientY;

      // define the properties of the PointerEvent interface
      e.pointerId = inDict.pointerId || 0;
      e.width = inDict.width || 0;
      e.height = inDict.height || 0;
      e.pressure = pressure;
      e.tiltX = inDict.tiltX || 0;
      e.tiltY = inDict.tiltY || 0;
      e.pointerType = inDict.pointerType || '';
      e.hwTimestamp = inDict.hwTimestamp || 0;
      e.isPrimary = inDict.isPrimary || false;
      e._source = inDict._source || '';
      return e;
    }
  };

  scope.eventFactory = eventFactory;
})(window.PolymerGestures);

/**
 * This module implements an map of pointer states
 */
(function(scope) {
  var USE_MAP = window.Map && window.Map.prototype.forEach;
  var POINTERS_FN = function(){ return this.size; };
  function PointerMap() {
    if (USE_MAP) {
      var m = new Map();
      m.pointers = POINTERS_FN;
      return m;
    } else {
      this.keys = [];
      this.values = [];
    }
  }

  PointerMap.prototype = {
    set: function(inId, inEvent) {
      var i = this.keys.indexOf(inId);
      if (i > -1) {
        this.values[i] = inEvent;
      } else {
        this.keys.push(inId);
        this.values.push(inEvent);
      }
    },
    has: function(inId) {
      return this.keys.indexOf(inId) > -1;
    },
    'delete': function(inId) {
      var i = this.keys.indexOf(inId);
      if (i > -1) {
        this.keys.splice(i, 1);
        this.values.splice(i, 1);
      }
    },
    get: function(inId) {
      var i = this.keys.indexOf(inId);
      return this.values[i];
    },
    clear: function() {
      this.keys.length = 0;
      this.values.length = 0;
    },
    // return value, key, map
    forEach: function(callback, thisArg) {
      this.values.forEach(function(v, i) {
        callback.call(thisArg, v, this.keys[i], this);
      }, this);
    },
    pointers: function() {
      return this.keys.length;
    }
  };

  scope.PointerMap = PointerMap;
})(window.PolymerGestures);

(function(scope) {
  var CLONE_PROPS = [
    // MouseEvent
    'bubbles',
    'cancelable',
    'view',
    'detail',
    'screenX',
    'screenY',
    'clientX',
    'clientY',
    'ctrlKey',
    'altKey',
    'shiftKey',
    'metaKey',
    'button',
    'relatedTarget',
    // DOM Level 3
    'buttons',
    // PointerEvent
    'pointerId',
    'width',
    'height',
    'pressure',
    'tiltX',
    'tiltY',
    'pointerType',
    'hwTimestamp',
    'isPrimary',
    // event instance
    'type',
    'target',
    'currentTarget',
    'which',
    'pageX',
    'pageY',
    'timeStamp',
    // gesture addons
    'preventTap',
    'tapPrevented',
    '_source'
  ];

  var CLONE_DEFAULTS = [
    // MouseEvent
    false,
    false,
    null,
    null,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null,
    // DOM Level 3
    0,
    // PointerEvent
    0,
    0,
    0,
    0,
    0,
    0,
    '',
    0,
    false,
    // event instance
    '',
    null,
    null,
    0,
    0,
    0,
    0,
    function(){},
    false
  ];

  var HAS_SVG_INSTANCE = (typeof SVGElementInstance !== 'undefined');

  var eventFactory = scope.eventFactory;

  // set of recognizers to run for the currently handled event
  var currentGestures;

  /**
   * This module is for normalizing events. Mouse and Touch events will be
   * collected here, and fire PointerEvents that have the same semantics, no
   * matter the source.
   * Events fired:
   *   - pointerdown: a pointing is added
   *   - pointerup: a pointer is removed
   *   - pointermove: a pointer is moved
   *   - pointerover: a pointer crosses into an element
   *   - pointerout: a pointer leaves an element
   *   - pointercancel: a pointer will no longer generate events
   */
  var dispatcher = {
    IS_IOS: false,
    pointermap: new scope.PointerMap(),
    requiredGestures: new scope.PointerMap(),
    eventMap: Object.create(null),
    // Scope objects for native events.
    // This exists for ease of testing.
    eventSources: Object.create(null),
    eventSourceList: [],
    gestures: [],
    // map gesture event -> {listeners: int, index: gestures[int]}
    dependencyMap: {
      // make sure down and up are in the map to trigger "register"
      down: {listeners: 0, index: -1},
      up: {listeners: 0, index: -1}
    },
    gestureQueue: [],
    /**
     * Add a new event source that will generate pointer events.
     *
     * `inSource` must contain an array of event names named `events`, and
     * functions with the names specified in the `events` array.
     * @param {string} name A name for the event source
     * @param {Object} source A new source of platform events.
     */
    registerSource: function(name, source) {
      var s = source;
      var newEvents = s.events;
      if (newEvents) {
        newEvents.forEach(function(e) {
          if (s[e]) {
            this.eventMap[e] = s[e].bind(s);
          }
        }, this);
        this.eventSources[name] = s;
        this.eventSourceList.push(s);
      }
    },
    registerGesture: function(name, source) {
      var obj = Object.create(null);
      obj.listeners = 0;
      obj.index = this.gestures.length;
      for (var i = 0, g; i < source.exposes.length; i++) {
        g = source.exposes[i].toLowerCase();
        this.dependencyMap[g] = obj;
      }
      this.gestures.push(source);
    },
    register: function(element, initial) {
      var l = this.eventSourceList.length;
      for (var i = 0, es; (i < l) && (es = this.eventSourceList[i]); i++) {
        // call eventsource register
        es.register.call(es, element, initial);
      }
    },
    unregister: function(element) {
      var l = this.eventSourceList.length;
      for (var i = 0, es; (i < l) && (es = this.eventSourceList[i]); i++) {
        // call eventsource register
        es.unregister.call(es, element);
      }
    },
    // EVENTS
    down: function(inEvent) {
      this.requiredGestures.set(inEvent.pointerId, currentGestures);
      this.fireEvent('down', inEvent);
    },
    move: function(inEvent) {
      // pipe move events into gesture queue directly
      inEvent.type = 'move';
      this.fillGestureQueue(inEvent);
    },
    up: function(inEvent) {
      this.fireEvent('up', inEvent);
      this.requiredGestures.delete(inEvent.pointerId);
    },
    cancel: function(inEvent) {
      inEvent.tapPrevented = true;
      this.fireEvent('up', inEvent);
      this.requiredGestures.delete(inEvent.pointerId);
    },
    addGestureDependency: function(node, currentGestures) {
      var gesturesWanted = node._pgEvents;
      if (gesturesWanted && currentGestures) {
        var gk = Object.keys(gesturesWanted);
        for (var i = 0, r, ri, g; i < gk.length; i++) {
          // gesture
          g = gk[i];
          if (gesturesWanted[g] > 0) {
            // lookup gesture recognizer
            r = this.dependencyMap[g];
            // recognizer index
            ri = r ? r.index : -1;
            currentGestures[ri] = true;
          }
        }
      }
    },
    // LISTENER LOGIC
    eventHandler: function(inEvent) {
      // This is used to prevent multiple dispatch of events from
      // platform events. This can happen when two elements in different scopes
      // are set up to create pointer events, which is relevant to Shadow DOM.

      var type = inEvent.type;

      // only generate the list of desired events on "down"
      if (type === 'touchstart' || type === 'mousedown' || type === 'pointerdown' || type === 'MSPointerDown') {
        if (!inEvent._handledByPG) {
          currentGestures = {};
        }

        // in IOS mode, there is only a listener on the document, so this is not re-entrant
        if (this.IS_IOS) {
          var ev = inEvent;
          if (type === 'touchstart') {
            var ct = inEvent.changedTouches[0];
            // set up a fake event to give to the path builder
            ev = {target: inEvent.target, clientX: ct.clientX, clientY: ct.clientY, path: inEvent.path};
          }
          // use event path if available, otherwise build a path from target finding
          var nodes = inEvent.path || scope.targetFinding.path(ev);
          for (var i = 0, n; i < nodes.length; i++) {
            n = nodes[i];
            this.addGestureDependency(n, currentGestures);
          }
        } else {
          this.addGestureDependency(inEvent.currentTarget, currentGestures);
        }
      }

      if (inEvent._handledByPG) {
        return;
      }
      var fn = this.eventMap && this.eventMap[type];
      if (fn) {
        fn(inEvent);
      }
      inEvent._handledByPG = true;
    },
    // set up event listeners
    listen: function(target, events) {
      for (var i = 0, l = events.length, e; (i < l) && (e = events[i]); i++) {
        this.addEvent(target, e);
      }
    },
    // remove event listeners
    unlisten: function(target, events) {
      for (var i = 0, l = events.length, e; (i < l) && (e = events[i]); i++) {
        this.removeEvent(target, e);
      }
    },
    addEvent: function(target, eventName) {
      target.addEventListener(eventName, this.boundHandler);
    },
    removeEvent: function(target, eventName) {
      target.removeEventListener(eventName, this.boundHandler);
    },
    // EVENT CREATION AND TRACKING
    /**
     * Creates a new Event of type `inType`, based on the information in
     * `inEvent`.
     *
     * @param {string} inType A string representing the type of event to create
     * @param {Event} inEvent A platform event with a target
     * @return {Event} A PointerEvent of type `inType`
     */
    makeEvent: function(inType, inEvent) {
      var e = eventFactory.makePointerEvent(inType, inEvent);
      e.preventDefault = inEvent.preventDefault;
      e.tapPrevented = inEvent.tapPrevented;
      e._target = e._target || inEvent.target;
      return e;
    },
    // make and dispatch an event in one call
    fireEvent: function(inType, inEvent) {
      var e = this.makeEvent(inType, inEvent);
      return this.dispatchEvent(e);
    },
    /**
     * Returns a snapshot of inEvent, with writable properties.
     *
     * @param {Event} inEvent An event that contains properties to copy.
     * @return {Object} An object containing shallow copies of `inEvent`'s
     *    properties.
     */
    cloneEvent: function(inEvent) {
      var eventCopy = Object.create(null), p;
      for (var i = 0; i < CLONE_PROPS.length; i++) {
        p = CLONE_PROPS[i];
        eventCopy[p] = inEvent[p] || CLONE_DEFAULTS[i];
        // Work around SVGInstanceElement shadow tree
        // Return the <use> element that is represented by the instance for Safari, Chrome, IE.
        // This is the behavior implemented by Firefox.
        if (p === 'target' || p === 'relatedTarget') {
          if (HAS_SVG_INSTANCE && eventCopy[p] instanceof SVGElementInstance) {
            eventCopy[p] = eventCopy[p].correspondingUseElement;
          }
        }
      }
      // keep the semantics of preventDefault
      eventCopy.preventDefault = function() {
        inEvent.preventDefault();
      };
      return eventCopy;
    },
    /**
     * Dispatches the event to its target.
     *
     * @param {Event} inEvent The event to be dispatched.
     * @return {Boolean} True if an event handler returns true, false otherwise.
     */
    dispatchEvent: function(inEvent) {
      var t = inEvent._target;
      if (t) {
        t.dispatchEvent(inEvent);
        // clone the event for the gesture system to process
        // clone after dispatch to pick up gesture prevention code
        var clone = this.cloneEvent(inEvent);
        clone.target = t;
        this.fillGestureQueue(clone);
      }
    },
    gestureTrigger: function() {
      // process the gesture queue
      for (var i = 0, e, rg; i < this.gestureQueue.length; i++) {
        e = this.gestureQueue[i];
        rg = e._requiredGestures;
        if (rg) {
          for (var j = 0, g, fn; j < this.gestures.length; j++) {
            // only run recognizer if an element in the source event's path is listening for those gestures
            if (rg[j]) {
              g = this.gestures[j];
              fn = g[e.type];
              if (fn) {
                fn.call(g, e);
              }
            }
          }
        }
      }
      this.gestureQueue.length = 0;
    },
    fillGestureQueue: function(ev) {
      // only trigger the gesture queue once
      if (!this.gestureQueue.length) {
        requestAnimationFrame(this.boundGestureTrigger);
      }
      ev._requiredGestures = this.requiredGestures.get(ev.pointerId);
      this.gestureQueue.push(ev);
    }
  };
  dispatcher.boundHandler = dispatcher.eventHandler.bind(dispatcher);
  dispatcher.boundGestureTrigger = dispatcher.gestureTrigger.bind(dispatcher);
  scope.dispatcher = dispatcher;

  /**
   * Listen for `gesture` on `node` with the `handler` function
   *
   * If `handler` is the first listener for `gesture`, the underlying gesture recognizer is then enabled.
   *
   * @param {Element} node
   * @param {string} gesture
   * @return Boolean `gesture` is a valid gesture
   */
  scope.activateGesture = function(node, gesture) {
    var g = gesture.toLowerCase();
    var dep = dispatcher.dependencyMap[g];
    if (dep) {
      var recognizer = dispatcher.gestures[dep.index];
      if (!node._pgListeners) {
        dispatcher.register(node);
        node._pgListeners = 0;
      }
      // TODO(dfreedm): re-evaluate bookkeeping to avoid using attributes
      if (recognizer) {
        var touchAction = recognizer.defaultActions && recognizer.defaultActions[g];
        var actionNode;
        switch(node.nodeType) {
          case Node.ELEMENT_NODE:
            actionNode = node;
          break;
          case Node.DOCUMENT_FRAGMENT_NODE:
            actionNode = node.host;
          break;
          default:
            actionNode = null;
          break;
        }
        if (touchAction && actionNode && !actionNode.hasAttribute('touch-action')) {
          actionNode.setAttribute('touch-action', touchAction);
        }
      }
      if (!node._pgEvents) {
        node._pgEvents = {};
      }
      node._pgEvents[g] = (node._pgEvents[g] || 0) + 1;
      node._pgListeners++;
    }
    return Boolean(dep);
  };

  /**
   *
   * Listen for `gesture` from `node` with `handler` function.
   *
   * @param {Element} node
   * @param {string} gesture
   * @param {Function} handler
   * @param {Boolean} capture
   */
  scope.addEventListener = function(node, gesture, handler, capture) {
    if (handler) {
      scope.activateGesture(node, gesture);
      node.addEventListener(gesture, handler, capture);
    }
  };

  /**
   * Tears down the gesture configuration for `node`
   *
   * If `handler` is the last listener for `gesture`, the underlying gesture recognizer is disabled.
   *
   * @param {Element} node
   * @param {string} gesture
   * @return Boolean `gesture` is a valid gesture
   */
  scope.deactivateGesture = function(node, gesture) {
    var g = gesture.toLowerCase();
    var dep = dispatcher.dependencyMap[g];
    if (dep) {
      if (node._pgListeners > 0) {
        node._pgListeners--;
      }
      if (node._pgListeners === 0) {
        dispatcher.unregister(node);
      }
      if (node._pgEvents) {
        if (node._pgEvents[g] > 0) {
          node._pgEvents[g]--;
        } else {
          node._pgEvents[g] = 0;
        }
      }
    }
    return Boolean(dep);
  };

  /**
   * Stop listening for `gesture` from `node` with `handler` function.
   *
   * @param {Element} node
   * @param {string} gesture
   * @param {Function} handler
   * @param {Boolean} capture
   */
  scope.removeEventListener = function(node, gesture, handler, capture) {
    if (handler) {
      scope.deactivateGesture(node, gesture);
      node.removeEventListener(gesture, handler, capture);
    }
  };
})(window.PolymerGestures);

(function(scope) {
  var dispatcher = scope.dispatcher;
  var pointermap = dispatcher.pointermap;
  // radius around touchend that swallows mouse events
  var DEDUP_DIST = 25;

  var WHICH_TO_BUTTONS = [0, 1, 4, 2];

  var currentButtons = 0;

  var FIREFOX_LINUX = /Linux.*Firefox\//i;

  var HAS_BUTTONS = (function() {
    // firefox on linux returns spec-incorrect values for mouseup.buttons
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.buttons#See_also
    // https://codereview.chromium.org/727593003/#msg16
    if (FIREFOX_LINUX.test(navigator.userAgent)) {
      return false;
    }
    try {
      return new MouseEvent('test', {buttons: 1}).buttons === 1;
    } catch (e) {
      return false;
    }
  })();

  // handler block for native mouse events
  var mouseEvents = {
    POINTER_ID: 1,
    POINTER_TYPE: 'mouse',
    events: [
      'mousedown',
      'mousemove',
      'mouseup'
    ],
    exposes: [
      'down',
      'up',
      'move'
    ],
    register: function(target) {
      dispatcher.listen(target, this.events);
    },
    unregister: function(target) {
      if (target === document) {
        return;
      }
      dispatcher.unlisten(target, this.events);
    },
    lastTouches: [],
    // collide with the global mouse listener
    isEventSimulatedFromTouch: function(inEvent) {
      var lts = this.lastTouches;
      var x = inEvent.clientX, y = inEvent.clientY;
      for (var i = 0, l = lts.length, t; i < l && (t = lts[i]); i++) {
        // simulated mouse events will be swallowed near a primary touchend
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DIST && dy <= DEDUP_DIST) {
          return true;
        }
      }
    },
    prepareEvent: function(inEvent) {
      var e = dispatcher.cloneEvent(inEvent);
      e.pointerId = this.POINTER_ID;
      e.isPrimary = true;
      e.pointerType = this.POINTER_TYPE;
      e._source = 'mouse';
      if (!HAS_BUTTONS) {
        var type = inEvent.type;
        var bit = WHICH_TO_BUTTONS[inEvent.which] || 0;
        if (type === 'mousedown') {
          currentButtons |= bit;
        } else if (type === 'mouseup') {
          currentButtons &= ~bit;
        }
        e.buttons = currentButtons;
      }
      return e;
    },
    mousedown: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var p = pointermap.has(this.POINTER_ID);
        var e = this.prepareEvent(inEvent);
        e.target = scope.findTarget(inEvent);
        pointermap.set(this.POINTER_ID, e.target);
        dispatcher.down(e);
      }
    },
    mousemove: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var target = pointermap.get(this.POINTER_ID);
        if (target) {
          var e = this.prepareEvent(inEvent);
          e.target = target;
          // handle case where we missed a mouseup
          if ((HAS_BUTTONS ? e.buttons : e.which) === 0) {
            if (!HAS_BUTTONS) {
              currentButtons = e.buttons = 0;
            }
            dispatcher.cancel(e);
            this.cleanupMouse(e.buttons);
          } else {
            dispatcher.move(e);
          }
        }
      }
    },
    mouseup: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var e = this.prepareEvent(inEvent);
        e.relatedTarget = scope.findTarget(inEvent);
        e.target = pointermap.get(this.POINTER_ID);
        dispatcher.up(e);
        this.cleanupMouse(e.buttons);
      }
    },
    cleanupMouse: function(buttons) {
      if (buttons === 0) {
        pointermap.delete(this.POINTER_ID);
      }
    }
  };

  scope.mouseEvents = mouseEvents;
})(window.PolymerGestures);

(function(scope) {
  var dispatcher = scope.dispatcher;
  var allShadows = scope.targetFinding.allShadows.bind(scope.targetFinding);
  var pointermap = dispatcher.pointermap;
  var touchMap = Array.prototype.map.call.bind(Array.prototype.map);
  // This should be long enough to ignore compat mouse events made by touch
  var DEDUP_TIMEOUT = 2500;
  var DEDUP_DIST = 25;
  var CLICK_COUNT_TIMEOUT = 200;
  var HYSTERESIS = 20;
  var ATTRIB = 'touch-action';
  // TODO(dfreedm): disable until http://crbug.com/399765 is resolved
  // var HAS_TOUCH_ACTION = ATTRIB in document.head.style;
  var HAS_TOUCH_ACTION = false;

  // handler block for native touch events
  var touchEvents = {
    IS_IOS: false,
    events: [
      'touchstart',
      'touchmove',
      'touchend',
      'touchcancel'
    ],
    exposes: [
      'down',
      'up',
      'move'
    ],
    register: function(target, initial) {
      if (this.IS_IOS ? initial : !initial) {
        dispatcher.listen(target, this.events);
      }
    },
    unregister: function(target) {
      if (!this.IS_IOS) {
        dispatcher.unlisten(target, this.events);
      }
    },
    scrollTypes: {
      EMITTER: 'none',
      XSCROLLER: 'pan-x',
      YSCROLLER: 'pan-y',
    },
    touchActionToScrollType: function(touchAction) {
      var t = touchAction;
      var st = this.scrollTypes;
      if (t === st.EMITTER) {
        return 'none';
      } else if (t === st.XSCROLLER) {
        return 'X';
      } else if (t === st.YSCROLLER) {
        return 'Y';
      } else {
        return 'XY';
      }
    },
    POINTER_TYPE: 'touch',
    firstTouch: null,
    isPrimaryTouch: function(inTouch) {
      return this.firstTouch === inTouch.identifier;
    },
    setPrimaryTouch: function(inTouch) {
      // set primary touch if there no pointers, or the only pointer is the mouse
      if (pointermap.pointers() === 0 || (pointermap.pointers() === 1 && pointermap.has(1))) {
        this.firstTouch = inTouch.identifier;
        this.firstXY = {X: inTouch.clientX, Y: inTouch.clientY};
        this.firstTarget = inTouch.target;
        this.scrolling = null;
        this.cancelResetClickCount();
      }
    },
    removePrimaryPointer: function(inPointer) {
      if (inPointer.isPrimary) {
        this.firstTouch = null;
        this.firstXY = null;
        this.resetClickCount();
      }
    },
    clickCount: 0,
    resetId: null,
    resetClickCount: function() {
      var fn = function() {
        this.clickCount = 0;
        this.resetId = null;
      }.bind(this);
      this.resetId = setTimeout(fn, CLICK_COUNT_TIMEOUT);
    },
    cancelResetClickCount: function() {
      if (this.resetId) {
        clearTimeout(this.resetId);
      }
    },
    typeToButtons: function(type) {
      var ret = 0;
      if (type === 'touchstart' || type === 'touchmove') {
        ret = 1;
      }
      return ret;
    },
    findTarget: function(touch, id) {
      if (this.currentTouchEvent.type === 'touchstart') {
        if (this.isPrimaryTouch(touch)) {
          var fastPath = {
            clientX: touch.clientX,
            clientY: touch.clientY,
            path: this.currentTouchEvent.path,
            target: this.currentTouchEvent.target
          };
          return scope.findTarget(fastPath);
        } else {
          return scope.findTarget(touch);
        }
      }
      // reuse target we found in touchstart
      return pointermap.get(id);
    },
    touchToPointer: function(inTouch) {
      var cte = this.currentTouchEvent;
      var e = dispatcher.cloneEvent(inTouch);
      // Spec specifies that pointerId 1 is reserved for Mouse.
      // Touch identifiers can start at 0.
      // Add 2 to the touch identifier for compatibility.
      var id = e.pointerId = inTouch.identifier + 2;
      e.target = this.findTarget(inTouch, id);
      e.bubbles = true;
      e.cancelable = true;
      e.detail = this.clickCount;
      e.buttons = this.typeToButtons(cte.type);
      e.width = inTouch.webkitRadiusX || inTouch.radiusX || 0;
      e.height = inTouch.webkitRadiusY || inTouch.radiusY || 0;
      e.pressure = inTouch.webkitForce || inTouch.force || 0.5;
      e.isPrimary = this.isPrimaryTouch(inTouch);
      e.pointerType = this.POINTER_TYPE;
      e._source = 'touch';
      // forward touch preventDefaults
      var self = this;
      e.preventDefault = function() {
        self.scrolling = false;
        self.firstXY = null;
        cte.preventDefault();
      };
      return e;
    },
    processTouches: function(inEvent, inFunction) {
      var tl = inEvent.changedTouches;
      this.currentTouchEvent = inEvent;
      for (var i = 0, t, p; i < tl.length; i++) {
        t = tl[i];
        p = this.touchToPointer(t);
        if (inEvent.type === 'touchstart') {
          pointermap.set(p.pointerId, p.target);
        }
        if (pointermap.has(p.pointerId)) {
          inFunction.call(this, p);
        }
        if (inEvent.type === 'touchend' || inEvent._cancel) {
          this.cleanUpPointer(p);
        }
      }
    },
    // For single axis scrollers, determines whether the element should emit
    // pointer events or behave as a scroller
    shouldScroll: function(inEvent) {
      if (this.firstXY) {
        var ret;
        var touchAction = scope.targetFinding.findTouchAction(inEvent);
        var scrollAxis = this.touchActionToScrollType(touchAction);
        if (scrollAxis === 'none') {
          // this element is a touch-action: none, should never scroll
          ret = false;
        } else if (scrollAxis === 'XY') {
          // this element should always scroll
          ret = true;
        } else {
          var t = inEvent.changedTouches[0];
          // check the intended scroll axis, and other axis
          var a = scrollAxis;
          var oa = scrollAxis === 'Y' ? 'X' : 'Y';
          var da = Math.abs(t['client' + a] - this.firstXY[a]);
          var doa = Math.abs(t['client' + oa] - this.firstXY[oa]);
          // if delta in the scroll axis > delta other axis, scroll instead of
          // making events
          ret = da >= doa;
        }
        return ret;
      }
    },
    findTouch: function(inTL, inId) {
      for (var i = 0, l = inTL.length, t; i < l && (t = inTL[i]); i++) {
        if (t.identifier === inId) {
          return true;
        }
      }
    },
    // In some instances, a touchstart can happen without a touchend. This
    // leaves the pointermap in a broken state.
    // Therefore, on every touchstart, we remove the touches that did not fire a
    // touchend event.
    // To keep state globally consistent, we fire a
    // pointercancel for this "abandoned" touch
    vacuumTouches: function(inEvent) {
      var tl = inEvent.touches;
      // pointermap.pointers() should be < tl.length here, as the touchstart has not
      // been processed yet.
      if (pointermap.pointers() >= tl.length) {
        var d = [];
        pointermap.forEach(function(value, key) {
          // Never remove pointerId == 1, which is mouse.
          // Touch identifiers are 2 smaller than their pointerId, which is the
          // index in pointermap.
          if (key !== 1 && !this.findTouch(tl, key - 2)) {
            var p = value;
            d.push(p);
          }
        }, this);
        d.forEach(function(p) {
          this.cancel(p);
          pointermap.delete(p.pointerId);
        }, this);
      }
    },
    touchstart: function(inEvent) {
      this.vacuumTouches(inEvent);
      this.setPrimaryTouch(inEvent.changedTouches[0]);
      this.dedupSynthMouse(inEvent);
      if (!this.scrolling) {
        this.clickCount++;
        this.processTouches(inEvent, this.down);
      }
    },
    down: function(inPointer) {
      dispatcher.down(inPointer);
    },
    touchmove: function(inEvent) {
      if (HAS_TOUCH_ACTION) {
        // touchevent.cancelable == false is sent when the page is scrolling under native Touch Action in Chrome 36
        // https://groups.google.com/a/chromium.org/d/msg/input-dev/wHnyukcYBcA/b9kmtwM1jJQJ
        if (inEvent.cancelable) {
          this.processTouches(inEvent, this.move);
        }
      } else {
        if (!this.scrolling) {
          if (this.scrolling === null && this.shouldScroll(inEvent)) {
            this.scrolling = true;
          } else {
            this.scrolling = false;
            inEvent.preventDefault();
            this.processTouches(inEvent, this.move);
          }
        } else if (this.firstXY) {
          var t = inEvent.changedTouches[0];
          var dx = t.clientX - this.firstXY.X;
          var dy = t.clientY - this.firstXY.Y;
          var dd = Math.sqrt(dx * dx + dy * dy);
          if (dd >= HYSTERESIS) {
            this.touchcancel(inEvent);
            this.scrolling = true;
            this.firstXY = null;
          }
        }
      }
    },
    move: function(inPointer) {
      dispatcher.move(inPointer);
    },
    touchend: function(inEvent) {
      this.dedupSynthMouse(inEvent);
      this.processTouches(inEvent, this.up);
    },
    up: function(inPointer) {
      inPointer.relatedTarget = scope.findTarget(inPointer);
      dispatcher.up(inPointer);
    },
    cancel: function(inPointer) {
      dispatcher.cancel(inPointer);
    },
    touchcancel: function(inEvent) {
      inEvent._cancel = true;
      this.processTouches(inEvent, this.cancel);
    },
    cleanUpPointer: function(inPointer) {
      pointermap['delete'](inPointer.pointerId);
      this.removePrimaryPointer(inPointer);
    },
    // prevent synth mouse events from creating pointer events
    dedupSynthMouse: function(inEvent) {
      var lts = scope.mouseEvents.lastTouches;
      var t = inEvent.changedTouches[0];
      // only the primary finger will synth mouse events
      if (this.isPrimaryTouch(t)) {
        // remember x/y of last touch
        var lt = {x: t.clientX, y: t.clientY};
        lts.push(lt);
        var fn = (function(lts, lt){
          var i = lts.indexOf(lt);
          if (i > -1) {
            lts.splice(i, 1);
          }
        }).bind(null, lts, lt);
        setTimeout(fn, DEDUP_TIMEOUT);
      }
    }
  };

  // prevent "ghost clicks" that come from elements that were removed in a touch handler
  var STOP_PROP_FN = Event.prototype.stopImmediatePropagation || Event.prototype.stopPropagation;
  document.addEventListener('click', function(ev) {
    var x = ev.clientX, y = ev.clientY;
    // check if a click is within DEDUP_DIST px radius of the touchstart
    var closeTo = function(touch) {
      var dx = Math.abs(x - touch.x), dy = Math.abs(y - touch.y);
      return (dx <= DEDUP_DIST && dy <= DEDUP_DIST);
    };
    // if click coordinates are close to touch coordinates, assume the click came from a touch
    var wasTouched = scope.mouseEvents.lastTouches.some(closeTo);
    // if the click came from touch, and the touchstart target is not in the path of the click event,
    // then the touchstart target was probably removed, and the click should be "busted"
    var path = scope.targetFinding.path(ev);
    if (wasTouched) {
      for (var i = 0; i < path.length; i++) {
        if (path[i] === touchEvents.firstTarget) {
          return;
        }
      }
      ev.preventDefault();
      STOP_PROP_FN.call(ev);
    }
  }, true);

  scope.touchEvents = touchEvents;
})(window.PolymerGestures);

(function(scope) {
  var dispatcher = scope.dispatcher;
  var pointermap = dispatcher.pointermap;
  var HAS_BITMAP_TYPE = window.MSPointerEvent && typeof window.MSPointerEvent.MSPOINTER_TYPE_MOUSE === 'number';
  var msEvents = {
    events: [
      'MSPointerDown',
      'MSPointerMove',
      'MSPointerUp',
      'MSPointerCancel',
    ],
    register: function(target) {
      dispatcher.listen(target, this.events);
    },
    unregister: function(target) {
      if (target === document) {
        return;
      }
      dispatcher.unlisten(target, this.events);
    },
    POINTER_TYPES: [
      '',
      'unavailable',
      'touch',
      'pen',
      'mouse'
    ],
    prepareEvent: function(inEvent) {
      var e = inEvent;
      e = dispatcher.cloneEvent(inEvent);
      if (HAS_BITMAP_TYPE) {
        e.pointerType = this.POINTER_TYPES[inEvent.pointerType];
      }
      e._source = 'ms';
      return e;
    },
    cleanup: function(id) {
      pointermap['delete'](id);
    },
    MSPointerDown: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      e.target = scope.findTarget(inEvent);
      pointermap.set(inEvent.pointerId, e.target);
      dispatcher.down(e);
    },
    MSPointerMove: function(inEvent) {
      var target = pointermap.get(inEvent.pointerId);
      if (target) {
        var e = this.prepareEvent(inEvent);
        e.target = target;
        dispatcher.move(e);
      }
    },
    MSPointerUp: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      e.relatedTarget = scope.findTarget(inEvent);
      e.target = pointermap.get(e.pointerId);
      dispatcher.up(e);
      this.cleanup(inEvent.pointerId);
    },
    MSPointerCancel: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      e.relatedTarget = scope.findTarget(inEvent);
      e.target = pointermap.get(e.pointerId);
      dispatcher.cancel(e);
      this.cleanup(inEvent.pointerId);
    }
  };

  scope.msEvents = msEvents;
})(window.PolymerGestures);

(function(scope) {
  var dispatcher = scope.dispatcher;
  var pointermap = dispatcher.pointermap;
  var pointerEvents = {
    events: [
      'pointerdown',
      'pointermove',
      'pointerup',
      'pointercancel'
    ],
    prepareEvent: function(inEvent) {
      var e = dispatcher.cloneEvent(inEvent);
      e._source = 'pointer';
      return e;
    },
    register: function(target) {
      dispatcher.listen(target, this.events);
    },
    unregister: function(target) {
      if (target === document) {
        return;
      }
      dispatcher.unlisten(target, this.events);
    },
    cleanup: function(id) {
      pointermap['delete'](id);
    },
    pointerdown: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      e.target = scope.findTarget(inEvent);
      pointermap.set(e.pointerId, e.target);
      dispatcher.down(e);
    },
    pointermove: function(inEvent) {
      var target = pointermap.get(inEvent.pointerId);
      if (target) {
        var e = this.prepareEvent(inEvent);
        e.target = target;
        dispatcher.move(e);
      }
    },
    pointerup: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      e.relatedTarget = scope.findTarget(inEvent);
      e.target = pointermap.get(e.pointerId);
      dispatcher.up(e);
      this.cleanup(inEvent.pointerId);
    },
    pointercancel: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      e.relatedTarget = scope.findTarget(inEvent);
      e.target = pointermap.get(e.pointerId);
      dispatcher.cancel(e);
      this.cleanup(inEvent.pointerId);
    }
  };

  scope.pointerEvents = pointerEvents;
})(window.PolymerGestures);

/**
 * This module contains the handlers for native platform events.
 * From here, the dispatcher is called to create unified pointer events.
 * Included are touch events (v1), mouse events, and MSPointerEvents.
 */
(function(scope) {

  var dispatcher = scope.dispatcher;
  var nav = window.navigator;

  if (window.PointerEvent) {
    dispatcher.registerSource('pointer', scope.pointerEvents);
  } else if (nav.msPointerEnabled) {
    dispatcher.registerSource('ms', scope.msEvents);
  } else {
    dispatcher.registerSource('mouse', scope.mouseEvents);
    if (window.ontouchstart !== undefined) {
      dispatcher.registerSource('touch', scope.touchEvents);
    }
  }

  // Work around iOS bugs https://bugs.webkit.org/show_bug.cgi?id=135628 and https://bugs.webkit.org/show_bug.cgi?id=136506
  var ua = navigator.userAgent;
  var IS_IOS = ua.match(/iPad|iPhone|iPod/) && 'ontouchstart' in window;

  dispatcher.IS_IOS = IS_IOS;
  scope.touchEvents.IS_IOS = IS_IOS;

  dispatcher.register(document, true);
})(window.PolymerGestures);

/**
 * This event denotes the beginning of a series of tracking events.
 *
 * @module PointerGestures
 * @submodule Events
 * @class trackstart
 */
/**
 * Pixels moved in the x direction since trackstart.
 * @type Number
 * @property dx
 */
/**
 * Pixes moved in the y direction since trackstart.
 * @type Number
 * @property dy
 */
/**
 * Pixels moved in the x direction since the last track.
 * @type Number
 * @property ddx
 */
/**
 * Pixles moved in the y direction since the last track.
 * @type Number
 * @property ddy
 */
/**
 * The clientX position of the track gesture.
 * @type Number
 * @property clientX
 */
/**
 * The clientY position of the track gesture.
 * @type Number
 * @property clientY
 */
/**
 * The pageX position of the track gesture.
 * @type Number
 * @property pageX
 */
/**
 * The pageY position of the track gesture.
 * @type Number
 * @property pageY
 */
/**
 * The screenX position of the track gesture.
 * @type Number
 * @property screenX
 */
/**
 * The screenY position of the track gesture.
 * @type Number
 * @property screenY
 */
/**
 * The last x axis direction of the pointer.
 * @type Number
 * @property xDirection
 */
/**
 * The last y axis direction of the pointer.
 * @type Number
 * @property yDirection
 */
/**
 * A shared object between all tracking events.
 * @type Object
 * @property trackInfo
 */
/**
 * The element currently under the pointer.
 * @type Element
 * @property relatedTarget
 */
/**
 * The type of pointer that make the track gesture.
 * @type String
 * @property pointerType
 */
/**
 *
 * This event fires for all pointer movement being tracked.
 *
 * @class track
 * @extends trackstart
 */
/**
 * This event fires when the pointer is no longer being tracked.
 *
 * @class trackend
 * @extends trackstart
 */

 (function(scope) {
   var dispatcher = scope.dispatcher;
   var eventFactory = scope.eventFactory;
   var pointermap = new scope.PointerMap();
   var track = {
     events: [
       'down',
       'move',
       'up',
     ],
     exposes: [
      'trackstart',
      'track',
      'trackx',
      'tracky',
      'trackend'
     ],
     defaultActions: {
       'track': 'none',
       'trackx': 'pan-y',
       'tracky': 'pan-x'
     },
     WIGGLE_THRESHOLD: 4,
     clampDir: function(inDelta) {
       return inDelta > 0 ? 1 : -1;
     },
     calcPositionDelta: function(inA, inB) {
       var x = 0, y = 0;
       if (inA && inB) {
         x = inB.pageX - inA.pageX;
         y = inB.pageY - inA.pageY;
       }
       return {x: x, y: y};
     },
     fireTrack: function(inType, inEvent, inTrackingData) {
       var t = inTrackingData;
       var d = this.calcPositionDelta(t.downEvent, inEvent);
       var dd = this.calcPositionDelta(t.lastMoveEvent, inEvent);
       if (dd.x) {
         t.xDirection = this.clampDir(dd.x);
       } else if (inType === 'trackx') {
         return;
       }
       if (dd.y) {
         t.yDirection = this.clampDir(dd.y);
       } else if (inType === 'tracky') {
         return;
       }
       var gestureProto = {
         bubbles: true,
         cancelable: true,
         trackInfo: t.trackInfo,
         relatedTarget: inEvent.relatedTarget,
         pointerType: inEvent.pointerType,
         pointerId: inEvent.pointerId,
         _source: 'track'
       };
       if (inType !== 'tracky') {
         gestureProto.x = inEvent.x;
         gestureProto.dx = d.x;
         gestureProto.ddx = dd.x;
         gestureProto.clientX = inEvent.clientX;
         gestureProto.pageX = inEvent.pageX;
         gestureProto.screenX = inEvent.screenX;
         gestureProto.xDirection = t.xDirection;
       }
       if (inType !== 'trackx') {
         gestureProto.dy = d.y;
         gestureProto.ddy = dd.y;
         gestureProto.y = inEvent.y;
         gestureProto.clientY = inEvent.clientY;
         gestureProto.pageY = inEvent.pageY;
         gestureProto.screenY = inEvent.screenY;
         gestureProto.yDirection = t.yDirection;
       }
       var e = eventFactory.makeGestureEvent(inType, gestureProto);
       t.downTarget.dispatchEvent(e);
     },
     down: function(inEvent) {
       if (inEvent.isPrimary && (inEvent.pointerType === 'mouse' ? inEvent.buttons === 1 : true)) {
         var p = {
           downEvent: inEvent,
           downTarget: inEvent.target,
           trackInfo: {},
           lastMoveEvent: null,
           xDirection: 0,
           yDirection: 0,
           tracking: false
         };
         pointermap.set(inEvent.pointerId, p);
       }
     },
     move: function(inEvent) {
       var p = pointermap.get(inEvent.pointerId);
       if (p) {
         if (!p.tracking) {
           var d = this.calcPositionDelta(p.downEvent, inEvent);
           var move = d.x * d.x + d.y * d.y;
           // start tracking only if finger moves more than WIGGLE_THRESHOLD
           if (move > this.WIGGLE_THRESHOLD) {
             p.tracking = true;
             p.lastMoveEvent = p.downEvent;
             this.fireTrack('trackstart', inEvent, p);
           }
         }
         if (p.tracking) {
           this.fireTrack('track', inEvent, p);
           this.fireTrack('trackx', inEvent, p);
           this.fireTrack('tracky', inEvent, p);
         }
         p.lastMoveEvent = inEvent;
       }
     },
     up: function(inEvent) {
       var p = pointermap.get(inEvent.pointerId);
       if (p) {
         if (p.tracking) {
           this.fireTrack('trackend', inEvent, p);
         }
         pointermap.delete(inEvent.pointerId);
       }
     }
   };
   dispatcher.registerGesture('track', track);
 })(window.PolymerGestures);

/**
 * This event is fired when a pointer is held down for 200ms.
 *
 * @module PointerGestures
 * @submodule Events
 * @class hold
 */
/**
 * Type of pointer that made the holding event.
 * @type String
 * @property pointerType
 */
/**
 * Screen X axis position of the held pointer
 * @type Number
 * @property clientX
 */
/**
 * Screen Y axis position of the held pointer
 * @type Number
 * @property clientY
 */
/**
 * Type of pointer that made the holding event.
 * @type String
 * @property pointerType
 */
/**
 * This event is fired every 200ms while a pointer is held down.
 *
 * @class holdpulse
 * @extends hold
 */
/**
 * Milliseconds pointer has been held down.
 * @type Number
 * @property holdTime
 */
/**
 * This event is fired when a held pointer is released or moved.
 *
 * @class release
 */

(function(scope) {
  var dispatcher = scope.dispatcher;
  var eventFactory = scope.eventFactory;
  var hold = {
    // wait at least HOLD_DELAY ms between hold and pulse events
    HOLD_DELAY: 200,
    // pointer can move WIGGLE_THRESHOLD pixels before not counting as a hold
    WIGGLE_THRESHOLD: 16,
    events: [
      'down',
      'move',
      'up',
    ],
    exposes: [
      'hold',
      'holdpulse',
      'release'
    ],
    heldPointer: null,
    holdJob: null,
    pulse: function() {
      var hold = Date.now() - this.heldPointer.timeStamp;
      var type = this.held ? 'holdpulse' : 'hold';
      this.fireHold(type, hold);
      this.held = true;
    },
    cancel: function() {
      clearInterval(this.holdJob);
      if (this.held) {
        this.fireHold('release');
      }
      this.held = false;
      this.heldPointer = null;
      this.target = null;
      this.holdJob = null;
    },
    down: function(inEvent) {
      if (inEvent.isPrimary && !this.heldPointer) {
        this.heldPointer = inEvent;
        this.target = inEvent.target;
        this.holdJob = setInterval(this.pulse.bind(this), this.HOLD_DELAY);
      }
    },
    up: function(inEvent) {
      if (this.heldPointer && this.heldPointer.pointerId === inEvent.pointerId) {
        this.cancel();
      }
    },
    move: function(inEvent) {
      if (this.heldPointer && this.heldPointer.pointerId === inEvent.pointerId) {
        var x = inEvent.clientX - this.heldPointer.clientX;
        var y = inEvent.clientY - this.heldPointer.clientY;
        if ((x * x + y * y) > this.WIGGLE_THRESHOLD) {
          this.cancel();
        }
      }
    },
    fireHold: function(inType, inHoldTime) {
      var p = {
        bubbles: true,
        cancelable: true,
        pointerType: this.heldPointer.pointerType,
        pointerId: this.heldPointer.pointerId,
        x: this.heldPointer.clientX,
        y: this.heldPointer.clientY,
        _source: 'hold'
      };
      if (inHoldTime) {
        p.holdTime = inHoldTime;
      }
      var e = eventFactory.makeGestureEvent(inType, p);
      this.target.dispatchEvent(e);
    }
  };
  dispatcher.registerGesture('hold', hold);
})(window.PolymerGestures);

/**
 * This event is fired when a pointer quickly goes down and up, and is used to
 * denote activation.
 *
 * Any gesture event can prevent the tap event from being created by calling
 * `event.preventTap`.
 *
 * Any pointer event can prevent the tap by setting the `tapPrevented` property
 * on itself.
 *
 * @module PointerGestures
 * @submodule Events
 * @class tap
 */
/**
 * X axis position of the tap.
 * @property x
 * @type Number
 */
/**
 * Y axis position of the tap.
 * @property y
 * @type Number
 */
/**
 * Type of the pointer that made the tap.
 * @property pointerType
 * @type String
 */
(function(scope) {
  var dispatcher = scope.dispatcher;
  var eventFactory = scope.eventFactory;
  var pointermap = new scope.PointerMap();
  var tap = {
    events: [
      'down',
      'up'
    ],
    exposes: [
      'tap'
    ],
    down: function(inEvent) {
      if (inEvent.isPrimary && !inEvent.tapPrevented) {
        pointermap.set(inEvent.pointerId, {
          target: inEvent.target,
          buttons: inEvent.buttons,
          x: inEvent.clientX,
          y: inEvent.clientY
        });
      }
    },
    shouldTap: function(e, downState) {
      var tap = true;
      if (e.pointerType === 'mouse') {
        // only allow left click to tap for mouse
        tap = (e.buttons ^ 1) && (downState.buttons & 1);
      }
      return tap && !e.tapPrevented;
    },
    up: function(inEvent) {
      var start = pointermap.get(inEvent.pointerId);
      if (start && this.shouldTap(inEvent, start)) {
        // up.relatedTarget is target currently under finger
        var t = scope.targetFinding.LCA(start.target, inEvent.relatedTarget);
        if (t) {
          var e = eventFactory.makeGestureEvent('tap', {
            bubbles: true,
            cancelable: true,
            x: inEvent.clientX,
            y: inEvent.clientY,
            detail: inEvent.detail,
            pointerType: inEvent.pointerType,
            pointerId: inEvent.pointerId,
            altKey: inEvent.altKey,
            ctrlKey: inEvent.ctrlKey,
            metaKey: inEvent.metaKey,
            shiftKey: inEvent.shiftKey,
            _source: 'tap'
          });
          t.dispatchEvent(e);
        }
      }
      pointermap.delete(inEvent.pointerId);
    }
  };
  // patch eventFactory to remove id from tap's pointermap for preventTap calls
  eventFactory.preventTap = function(e) {
    return function() {
      e.tapPrevented = true;
      pointermap.delete(e.pointerId);
    };
  };
  dispatcher.registerGesture('tap', tap);
})(window.PolymerGestures);

/*
 * Basic strategy: find the farthest apart points, use as diameter of circle
 * react to size change and rotation of the chord
 */

/**
 * @module pointer-gestures
 * @submodule Events
 * @class pinch
 */
/**
 * Scale of the pinch zoom gesture
 * @property scale
 * @type Number
 */
/**
 * Center X position of pointers causing pinch
 * @property centerX
 * @type Number
 */
/**
 * Center Y position of pointers causing pinch
 * @property centerY
 * @type Number
 */

/**
 * @module pointer-gestures
 * @submodule Events
 * @class rotate
 */
/**
 * Angle (in degrees) of rotation. Measured from starting positions of pointers.
 * @property angle
 * @type Number
 */
/**
 * Center X position of pointers causing rotation
 * @property centerX
 * @type Number
 */
/**
 * Center Y position of pointers causing rotation
 * @property centerY
 * @type Number
 */
(function(scope) {
  var dispatcher = scope.dispatcher;
  var eventFactory = scope.eventFactory;
  var pointermap = new scope.PointerMap();
  var RAD_TO_DEG = 180 / Math.PI;
  var pinch = {
    events: [
      'down',
      'up',
      'move',
      'cancel'
    ],
    exposes: [
      'pinchstart',
      'pinch',
      'pinchend',
      'rotate'
    ],
    defaultActions: {
      'pinch': 'none',
      'rotate': 'none'
    },
    reference: {},
    down: function(inEvent) {
      pointermap.set(inEvent.pointerId, inEvent);
      if (pointermap.pointers() == 2) {
        var points = this.calcChord();
        var angle = this.calcAngle(points);
        this.reference = {
          angle: angle,
          diameter: points.diameter,
          target: scope.targetFinding.LCA(points.a.target, points.b.target)
        };

        this.firePinch('pinchstart', points.diameter, points);
      }
    },
    up: function(inEvent) {
      var p = pointermap.get(inEvent.pointerId);
      var num = pointermap.pointers();
      if (p) {
        if (num === 2) {
          // fire 'pinchend' before deleting pointer
          var points = this.calcChord();
          this.firePinch('pinchend', points.diameter, points);
        }
        pointermap.delete(inEvent.pointerId);
      }
    },
    move: function(inEvent) {
      if (pointermap.has(inEvent.pointerId)) {
        pointermap.set(inEvent.pointerId, inEvent);
        if (pointermap.pointers() > 1) {
          this.calcPinchRotate();
        }
      }
    },
    cancel: function(inEvent) {
        this.up(inEvent);
    },
    firePinch: function(type, diameter, points) {
      var zoom = diameter / this.reference.diameter;
      var e = eventFactory.makeGestureEvent(type, {
        bubbles: true,
        cancelable: true,
        scale: zoom,
        centerX: points.center.x,
        centerY: points.center.y,
        _source: 'pinch'
      });
      this.reference.target.dispatchEvent(e);
    },
    fireRotate: function(angle, points) {
      var diff = Math.round((angle - this.reference.angle) % 360);
      var e = eventFactory.makeGestureEvent('rotate', {
        bubbles: true,
        cancelable: true,
        angle: diff,
        centerX: points.center.x,
        centerY: points.center.y,
        _source: 'pinch'
      });
      this.reference.target.dispatchEvent(e);
    },
    calcPinchRotate: function() {
      var points = this.calcChord();
      var diameter = points.diameter;
      var angle = this.calcAngle(points);
      if (diameter != this.reference.diameter) {
        this.firePinch('pinch', diameter, points);
      }
      if (angle != this.reference.angle) {
        this.fireRotate(angle, points);
      }
    },
    calcChord: function() {
      var pointers = [];
      pointermap.forEach(function(p) {
        pointers.push(p);
      });
      var dist = 0;
      // start with at least two pointers
      var points = {a: pointers[0], b: pointers[1]};
      var x, y, d;
      for (var i = 0; i < pointers.length; i++) {
        var a = pointers[i];
        for (var j = i + 1; j < pointers.length; j++) {
          var b = pointers[j];
          x = Math.abs(a.clientX - b.clientX);
          y = Math.abs(a.clientY - b.clientY);
          d = x + y;
          if (d > dist) {
            dist = d;
            points = {a: a, b: b};
          }
        }
      }
      x = Math.abs(points.a.clientX + points.b.clientX) / 2;
      y = Math.abs(points.a.clientY + points.b.clientY) / 2;
      points.center = { x: x, y: y };
      points.diameter = dist;
      return points;
    },
    calcAngle: function(points) {
      var x = points.a.clientX - points.b.clientX;
      var y = points.a.clientY - points.b.clientY;
      return (360 + Math.atan2(y, x) * RAD_TO_DEG) % 360;
    }
  };
  dispatcher.registerGesture('pinch', pinch);
})(window.PolymerGestures);

(function (global) {
    'use strict';

    var Token,
        TokenName,
        Syntax,
        Messages,
        source,
        index,
        length,
        delegate,
        lookahead,
        state;

    Token = {
        BooleanLiteral: 1,
        EOF: 2,
        Identifier: 3,
        Keyword: 4,
        NullLiteral: 5,
        NumericLiteral: 6,
        Punctuator: 7,
        StringLiteral: 8
    };

    TokenName = {};
    TokenName[Token.BooleanLiteral] = 'Boolean';
    TokenName[Token.EOF] = '<end>';
    TokenName[Token.Identifier] = 'Identifier';
    TokenName[Token.Keyword] = 'Keyword';
    TokenName[Token.NullLiteral] = 'Null';
    TokenName[Token.NumericLiteral] = 'Numeric';
    TokenName[Token.Punctuator] = 'Punctuator';
    TokenName[Token.StringLiteral] = 'String';

    Syntax = {
        ArrayExpression: 'ArrayExpression',
        BinaryExpression: 'BinaryExpression',
        CallExpression: 'CallExpression',
        ConditionalExpression: 'ConditionalExpression',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        Identifier: 'Identifier',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        ObjectExpression: 'ObjectExpression',
        Program: 'Program',
        Property: 'Property',
        ThisExpression: 'ThisExpression',
        UnaryExpression: 'UnaryExpression'
    };

    // Error messages should be identical to V8.
    Messages = {
        UnexpectedToken:  'Unexpected token %0',
        UnknownLabel: 'Undefined label \'%0\'',
        Redeclaration: '%0 \'%1\' has already been declared'
    };

    // Ensure the condition is true, otherwise throw an error.
    // This is only to have a better contract semantic, i.e. another safety net
    // to catch a logic error. The condition shall be fulfilled in normal case.
    // Do NOT use this to enforce a certain condition on any user input.

    function assert(condition, message) {
        if (!condition) {
            throw new Error('ASSERT: ' + message);
        }
    }

    function isDecimalDigit(ch) {
        return (ch >= 48 && ch <= 57);   // 0..9
    }


    // 7.2 White Space

    function isWhiteSpace(ch) {
        return (ch === 32) ||  // space
            (ch === 9) ||      // tab
            (ch === 0xB) ||
            (ch === 0xC) ||
            (ch === 0xA0) ||
            (ch >= 0x1680 && '\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\uFEFF'.indexOf(String.fromCharCode(ch)) > 0);
    }

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return (ch === 10) || (ch === 13) || (ch === 0x2028) || (ch === 0x2029);
    }

    // 7.6 Identifier Names and Identifiers

    function isIdentifierStart(ch) {
        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
            (ch >= 65 && ch <= 90) ||         // A..Z
            (ch >= 97 && ch <= 122);          // a..z
    }

    function isIdentifierPart(ch) {
        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
            (ch >= 65 && ch <= 90) ||         // A..Z
            (ch >= 97 && ch <= 122) ||        // a..z
            (ch >= 48 && ch <= 57);           // 0..9
    }

    // 7.6.1.1 Keywords

    function isKeyword(id) {
        return (id === 'this')
    }

    // 7.4 Comments

    function skipWhitespace() {
        while (index < length && isWhiteSpace(source.charCodeAt(index))) {
           ++index;
        }
    }

    function getIdentifier() {
        var start, ch;

        start = index++;
        while (index < length) {
            ch = source.charCodeAt(index);
            if (isIdentifierPart(ch)) {
                ++index;
            } else {
                break;
            }
        }

        return source.slice(start, index);
    }

    function scanIdentifier() {
        var start, id, type;

        start = index;

        id = getIdentifier();

        // There is no keyword or literal with only one character.
        // Thus, it must be an identifier.
        if (id.length === 1) {
            type = Token.Identifier;
        } else if (isKeyword(id)) {
            type = Token.Keyword;
        } else if (id === 'null') {
            type = Token.NullLiteral;
        } else if (id === 'true' || id === 'false') {
            type = Token.BooleanLiteral;
        } else {
            type = Token.Identifier;
        }

        return {
            type: type,
            value: id,
            range: [start, index]
        };
    }


    // 7.7 Punctuators

    function scanPunctuator() {
        var start = index,
            code = source.charCodeAt(index),
            code2,
            ch1 = source[index],
            ch2;

        switch (code) {

        // Check for most common single-character punctuators.
        case 46:   // . dot
        case 40:   // ( open bracket
        case 41:   // ) close bracket
        case 59:   // ; semicolon
        case 44:   // , comma
        case 123:  // { open curly brace
        case 125:  // } close curly brace
        case 91:   // [
        case 93:   // ]
        case 58:   // :
        case 63:   // ?
            ++index;
            return {
                type: Token.Punctuator,
                value: String.fromCharCode(code),
                range: [start, index]
            };

        default:
            code2 = source.charCodeAt(index + 1);

            // '=' (char #61) marks an assignment or comparison operator.
            if (code2 === 61) {
                switch (code) {
                case 37:  // %
                case 38:  // &
                case 42:  // *:
                case 43:  // +
                case 45:  // -
                case 47:  // /
                case 60:  // <
                case 62:  // >
                case 124: // |
                    index += 2;
                    return {
                        type: Token.Punctuator,
                        value: String.fromCharCode(code) + String.fromCharCode(code2),
                        range: [start, index]
                    };

                case 33: // !
                case 61: // =
                    index += 2;

                    // !== and ===
                    if (source.charCodeAt(index) === 61) {
                        ++index;
                    }
                    return {
                        type: Token.Punctuator,
                        value: source.slice(start, index),
                        range: [start, index]
                    };
                default:
                    break;
                }
            }
            break;
        }

        // Peek more characters.

        ch2 = source[index + 1];

        // Other 2-character punctuators: && ||

        if (ch1 === ch2 && ('&|'.indexOf(ch1) >= 0)) {
            index += 2;
            return {
                type: Token.Punctuator,
                value: ch1 + ch2,
                range: [start, index]
            };
        }

        if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
            ++index;
            return {
                type: Token.Punctuator,
                value: ch1,
                range: [start, index]
            };
        }

        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
    }

    // 7.8.3 Numeric Literals
    function scanNumericLiteral() {
        var number, start, ch;

        ch = source[index];
        assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
            'Numeric literal must start with a decimal digit or a decimal point');

        start = index;
        number = '';
        if (ch !== '.') {
            number = source[index++];
            ch = source[index];

            // Hex number starts with '0x'.
            // Octal number starts with '0'.
            if (number === '0') {
                // decimal number starts with '0' such as '09' is illegal.
                if (ch && isDecimalDigit(ch.charCodeAt(0))) {
                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
            }

            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === '.') {
            number += source[index++];
            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === 'e' || ch === 'E') {
            number += source[index++];

            ch = source[index];
            if (ch === '+' || ch === '-') {
                number += source[index++];
            }
            if (isDecimalDigit(source.charCodeAt(index))) {
                while (isDecimalDigit(source.charCodeAt(index))) {
                    number += source[index++];
                }
            } else {
                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
        }

        if (isIdentifierStart(source.charCodeAt(index))) {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        return {
            type: Token.NumericLiteral,
            value: parseFloat(number),
            range: [start, index]
        };
    }

    // 7.8.4 String Literals

    function scanStringLiteral() {
        var str = '', quote, start, ch, octal = false;

        quote = source[index];
        assert((quote === '\'' || quote === '"'),
            'String literal must starts with a quote');

        start = index;
        ++index;

        while (index < length) {
            ch = source[index++];

            if (ch === quote) {
                quote = '';
                break;
            } else if (ch === '\\') {
                ch = source[index++];
                if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
                    switch (ch) {
                    case 'n':
                        str += '\n';
                        break;
                    case 'r':
                        str += '\r';
                        break;
                    case 't':
                        str += '\t';
                        break;
                    case 'b':
                        str += '\b';
                        break;
                    case 'f':
                        str += '\f';
                        break;
                    case 'v':
                        str += '\x0B';
                        break;

                    default:
                        str += ch;
                        break;
                    }
                } else {
                    if (ch ===  '\r' && source[index] === '\n') {
                        ++index;
                    }
                }
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                break;
            } else {
                str += ch;
            }
        }

        if (quote !== '') {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        return {
            type: Token.StringLiteral,
            value: str,
            octal: octal,
            range: [start, index]
        };
    }

    function isIdentifierName(token) {
        return token.type === Token.Identifier ||
            token.type === Token.Keyword ||
            token.type === Token.BooleanLiteral ||
            token.type === Token.NullLiteral;
    }

    function advance() {
        var ch;

        skipWhitespace();

        if (index >= length) {
            return {
                type: Token.EOF,
                range: [index, index]
            };
        }

        ch = source.charCodeAt(index);

        // Very common: ( and ) and ;
        if (ch === 40 || ch === 41 || ch === 58) {
            return scanPunctuator();
        }

        // String literal starts with single quote (#39) or double quote (#34).
        if (ch === 39 || ch === 34) {
            return scanStringLiteral();
        }

        if (isIdentifierStart(ch)) {
            return scanIdentifier();
        }

        // Dot (.) char #46 can also start a floating-point number, hence the need
        // to check the next character.
        if (ch === 46) {
            if (isDecimalDigit(source.charCodeAt(index + 1))) {
                return scanNumericLiteral();
            }
            return scanPunctuator();
        }

        if (isDecimalDigit(ch)) {
            return scanNumericLiteral();
        }

        return scanPunctuator();
    }

    function lex() {
        var token;

        token = lookahead;
        index = token.range[1];

        lookahead = advance();

        index = token.range[1];

        return token;
    }

    function peek() {
        var pos;

        pos = index;
        lookahead = advance();
        index = pos;
    }

    // Throw an exception

    function throwError(token, messageFormat) {
        var error,
            args = Array.prototype.slice.call(arguments, 2),
            msg = messageFormat.replace(
                /%(\d)/g,
                function (whole, index) {
                    assert(index < args.length, 'Message reference must be in range');
                    return args[index];
                }
            );

        error = new Error(msg);
        error.index = index;
        error.description = msg;
        throw error;
    }

    // Throw an exception because of the token.

    function throwUnexpected(token) {
        throwError(token, Messages.UnexpectedToken, token.value);
    }

    // Expect the next token to match the specified punctuator.
    // If not, an exception will be thrown.

    function expect(value) {
        var token = lex();
        if (token.type !== Token.Punctuator || token.value !== value) {
            throwUnexpected(token);
        }
    }

    // Return true if the next token matches the specified punctuator.

    function match(value) {
        return lookahead.type === Token.Punctuator && lookahead.value === value;
    }

    // Return true if the next token matches the specified keyword

    function matchKeyword(keyword) {
        return lookahead.type === Token.Keyword && lookahead.value === keyword;
    }

    function consumeSemicolon() {
        // Catch the very common case first: immediately a semicolon (char #59).
        if (source.charCodeAt(index) === 59) {
            lex();
            return;
        }

        skipWhitespace();

        if (match(';')) {
            lex();
            return;
        }

        if (lookahead.type !== Token.EOF && !match('}')) {
            throwUnexpected(lookahead);
        }
    }

    // 11.1.4 Array Initialiser

    function parseArrayInitialiser() {
        var elements = [];

        expect('[');

        while (!match(']')) {
            if (match(',')) {
                lex();
                elements.push(null);
            } else {
                elements.push(parseExpression());

                if (!match(']')) {
                    expect(',');
                }
            }
        }

        expect(']');

        return delegate.createArrayExpression(elements);
    }

    // 11.1.5 Object Initialiser

    function parseObjectPropertyKey() {
        var token;

        skipWhitespace();
        token = lex();

        // Note: This function is called only from parseObjectProperty(), where
        // EOF and Punctuator tokens are already filtered out.
        if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
            return delegate.createLiteral(token);
        }

        return delegate.createIdentifier(token.value);
    }

    function parseObjectProperty() {
        var token, key;

        token = lookahead;
        skipWhitespace();

        if (token.type === Token.EOF || token.type === Token.Punctuator) {
            throwUnexpected(token);
        }

        key = parseObjectPropertyKey();
        expect(':');
        return delegate.createProperty('init', key, parseExpression());
    }

    function parseObjectInitialiser() {
        var properties = [];

        expect('{');

        while (!match('}')) {
            properties.push(parseObjectProperty());

            if (!match('}')) {
                expect(',');
            }
        }

        expect('}');

        return delegate.createObjectExpression(properties);
    }

    // 11.1.6 The Grouping Operator

    function parseGroupExpression() {
        var expr;

        expect('(');

        expr = parseExpression();

        expect(')');

        return expr;
    }


    // 11.1 Primary Expressions

    function parsePrimaryExpression() {
        var type, token, expr;

        if (match('(')) {
            return parseGroupExpression();
        }

        type = lookahead.type;

        if (type === Token.Identifier) {
            expr = delegate.createIdentifier(lex().value);
        } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
            expr = delegate.createLiteral(lex());
        } else if (type === Token.Keyword) {
            if (matchKeyword('this')) {
                lex();
                expr = delegate.createThisExpression();
            }
        } else if (type === Token.BooleanLiteral) {
            token = lex();
            token.value = (token.value === 'true');
            expr = delegate.createLiteral(token);
        } else if (type === Token.NullLiteral) {
            token = lex();
            token.value = null;
            expr = delegate.createLiteral(token);
        } else if (match('[')) {
            expr = parseArrayInitialiser();
        } else if (match('{')) {
            expr = parseObjectInitialiser();
        }

        if (expr) {
            return expr;
        }

        throwUnexpected(lex());
    }

    // 11.2 Left-Hand-Side Expressions

    function parseArguments() {
        var args = [];

        expect('(');

        if (!match(')')) {
            while (index < length) {
                args.push(parseExpression());
                if (match(')')) {
                    break;
                }
                expect(',');
            }
        }

        expect(')');

        return args;
    }

    function parseNonComputedProperty() {
        var token;

        token = lex();

        if (!isIdentifierName(token)) {
            throwUnexpected(token);
        }

        return delegate.createIdentifier(token.value);
    }

    function parseNonComputedMember() {
        expect('.');

        return parseNonComputedProperty();
    }

    function parseComputedMember() {
        var expr;

        expect('[');

        expr = parseExpression();

        expect(']');

        return expr;
    }

    function parseLeftHandSideExpression() {
        var expr, args, property;

        expr = parsePrimaryExpression();

        while (true) {
            if (match('[')) {
                property = parseComputedMember();
                expr = delegate.createMemberExpression('[', expr, property);
            } else if (match('.')) {
                property = parseNonComputedMember();
                expr = delegate.createMemberExpression('.', expr, property);
            } else if (match('(')) {
                args = parseArguments();
                expr = delegate.createCallExpression(expr, args);
            } else {
                break;
            }
        }

        return expr;
    }

    // 11.3 Postfix Expressions

    var parsePostfixExpression = parseLeftHandSideExpression;

    // 11.4 Unary Operators

    function parseUnaryExpression() {
        var token, expr;

        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
            expr = parsePostfixExpression();
        } else if (match('+') || match('-') || match('!')) {
            token = lex();
            expr = parseUnaryExpression();
            expr = delegate.createUnaryExpression(token.value, expr);
        } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
            throwError({}, Messages.UnexpectedToken);
        } else {
            expr = parsePostfixExpression();
        }

        return expr;
    }

    function binaryPrecedence(token) {
        var prec = 0;

        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
            return 0;
        }

        switch (token.value) {
        case '||':
            prec = 1;
            break;

        case '&&':
            prec = 2;
            break;

        case '==':
        case '!=':
        case '===':
        case '!==':
            prec = 6;
            break;

        case '<':
        case '>':
        case '<=':
        case '>=':
        case 'instanceof':
            prec = 7;
            break;

        case 'in':
            prec = 7;
            break;

        case '+':
        case '-':
            prec = 9;
            break;

        case '*':
        case '/':
        case '%':
            prec = 11;
            break;

        default:
            break;
        }

        return prec;
    }

    // 11.5 Multiplicative Operators
    // 11.6 Additive Operators
    // 11.7 Bitwise Shift Operators
    // 11.8 Relational Operators
    // 11.9 Equality Operators
    // 11.10 Binary Bitwise Operators
    // 11.11 Binary Logical Operators

    function parseBinaryExpression() {
        var expr, token, prec, stack, right, operator, left, i;

        left = parseUnaryExpression();

        token = lookahead;
        prec = binaryPrecedence(token);
        if (prec === 0) {
            return left;
        }
        token.prec = prec;
        lex();

        right = parseUnaryExpression();

        stack = [left, token, right];

        while ((prec = binaryPrecedence(lookahead)) > 0) {

            // Reduce: make a binary expression from the three topmost entries.
            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
                right = stack.pop();
                operator = stack.pop().value;
                left = stack.pop();
                expr = delegate.createBinaryExpression(operator, left, right);
                stack.push(expr);
            }

            // Shift.
            token = lex();
            token.prec = prec;
            stack.push(token);
            expr = parseUnaryExpression();
            stack.push(expr);
        }

        // Final reduce to clean-up the stack.
        i = stack.length - 1;
        expr = stack[i];
        while (i > 1) {
            expr = delegate.createBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
            i -= 2;
        }

        return expr;
    }


    // 11.12 Conditional Operator

    function parseConditionalExpression() {
        var expr, consequent, alternate;

        expr = parseBinaryExpression();

        if (match('?')) {
            lex();
            consequent = parseConditionalExpression();
            expect(':');
            alternate = parseConditionalExpression();

            expr = delegate.createConditionalExpression(expr, consequent, alternate);
        }

        return expr;
    }

    // Simplification since we do not support AssignmentExpression.
    var parseExpression = parseConditionalExpression;

    // Polymer Syntax extensions

    // Filter ::
    //   Identifier
    //   Identifier "(" ")"
    //   Identifier "(" FilterArguments ")"

    function parseFilter() {
        var identifier, args;

        identifier = lex();

        if (identifier.type !== Token.Identifier) {
            throwUnexpected(identifier);
        }

        args = match('(') ? parseArguments() : [];

        return delegate.createFilter(identifier.value, args);
    }

    // Filters ::
    //   "|" Filter
    //   Filters "|" Filter

    function parseFilters() {
        while (match('|')) {
            lex();
            parseFilter();
        }
    }

    // TopLevel ::
    //   LabelledExpressions
    //   AsExpression
    //   InExpression
    //   FilterExpression

    // AsExpression ::
    //   FilterExpression as Identifier

    // InExpression ::
    //   Identifier, Identifier in FilterExpression
    //   Identifier in FilterExpression

    // FilterExpression ::
    //   Expression
    //   Expression Filters

    function parseTopLevel() {
        skipWhitespace();
        peek();

        var expr = parseExpression();
        if (expr) {
            if (lookahead.value === ',' || lookahead.value == 'in' &&
                       expr.type === Syntax.Identifier) {
                parseInExpression(expr);
            } else {
                parseFilters();
                if (lookahead.value === 'as') {
                    parseAsExpression(expr);
                } else {
                    delegate.createTopLevel(expr);
                }
            }
        }

        if (lookahead.type !== Token.EOF) {
            throwUnexpected(lookahead);
        }
    }

    function parseAsExpression(expr) {
        lex();  // as
        var identifier = lex().value;
        delegate.createAsExpression(expr, identifier);
    }

    function parseInExpression(identifier) {
        var indexName;
        if (lookahead.value === ',') {
            lex();
            if (lookahead.type !== Token.Identifier)
                throwUnexpected(lookahead);
            indexName = lex().value;
        }

        lex();  // in
        var expr = parseExpression();
        parseFilters();
        delegate.createInExpression(identifier.name, indexName, expr);
    }

    function parse(code, inDelegate) {
        delegate = inDelegate;
        source = code;
        index = 0;
        length = source.length;
        lookahead = null;
        state = {
            labelSet: {}
        };

        return parseTopLevel();
    }

    global.esprima = {
        parse: parse
    };
})(this);

// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
// This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
// The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also
// subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt

(function (global) {
  'use strict';

  function prepareBinding(expressionText, name, node, filterRegistry) {
    var expression;
    try {
      expression = getExpression(expressionText);
      if (expression.scopeIdent &&
          (node.nodeType !== Node.ELEMENT_NODE ||
           node.tagName !== 'TEMPLATE' ||
           (name !== 'bind' && name !== 'repeat'))) {
        throw Error('as and in can only be used within <template bind/repeat>');
      }
    } catch (ex) {
      console.error('Invalid expression syntax: ' + expressionText, ex);
      return;
    }

    return function(model, node, oneTime) {
      var binding = expression.getBinding(model, filterRegistry, oneTime);
      if (expression.scopeIdent && binding) {
        node.polymerExpressionScopeIdent_ = expression.scopeIdent;
        if (expression.indexIdent)
          node.polymerExpressionIndexIdent_ = expression.indexIdent;
      }

      return binding;
    }
  }

  // TODO(rafaelw): Implement simple LRU.
  var expressionParseCache = Object.create(null);

  function getExpression(expressionText) {
    var expression = expressionParseCache[expressionText];
    if (!expression) {
      var delegate = new ASTDelegate();
      esprima.parse(expressionText, delegate);
      expression = new Expression(delegate);
      expressionParseCache[expressionText] = expression;
    }
    return expression;
  }

  function Literal(value) {
    this.value = value;
    this.valueFn_ = undefined;
  }

  Literal.prototype = {
    valueFn: function() {
      if (!this.valueFn_) {
        var value = this.value;
        this.valueFn_ = function() {
          return value;
        }
      }

      return this.valueFn_;
    }
  }

  function IdentPath(name) {
    this.name = name;
    this.path = Path.get(name);
  }

  IdentPath.prototype = {
    valueFn: function() {
      if (!this.valueFn_) {
        var name = this.name;
        var path = this.path;
        this.valueFn_ = function(model, observer) {
          if (observer)
            observer.addPath(model, path);

          return path.getValueFrom(model);
        }
      }

      return this.valueFn_;
    },

    setValue: function(model, newValue) {
      if (this.path.length == 1)
        model = findScope(model, this.path[0]);

      return this.path.setValueFrom(model, newValue);
    }
  };

  function MemberExpression(object, property, accessor) {
    this.computed = accessor == '[';

    this.dynamicDeps = typeof object == 'function' ||
                       object.dynamicDeps ||
                       (this.computed && !(property instanceof Literal));

    this.simplePath =
        !this.dynamicDeps &&
        (property instanceof IdentPath || property instanceof Literal) &&
        (object instanceof MemberExpression || object instanceof IdentPath);

    this.object = this.simplePath ? object : getFn(object);
    this.property = !this.computed || this.simplePath ?
        property : getFn(property);
  }

  MemberExpression.prototype = {
    get fullPath() {
      if (!this.fullPath_) {

        var parts = this.object instanceof MemberExpression ?
            this.object.fullPath.slice() : [this.object.name];
        parts.push(this.property instanceof IdentPath ?
            this.property.name : this.property.value);
        this.fullPath_ = Path.get(parts);
      }

      return this.fullPath_;
    },

    valueFn: function() {
      if (!this.valueFn_) {
        var object = this.object;

        if (this.simplePath) {
          var path = this.fullPath;

          this.valueFn_ = function(model, observer) {
            if (observer)
              observer.addPath(model, path);

            return path.getValueFrom(model);
          };
        } else if (!this.computed) {
          var path = Path.get(this.property.name);

          this.valueFn_ = function(model, observer, filterRegistry) {
            var context = object(model, observer, filterRegistry);

            if (observer)
              observer.addPath(context, path);

            return path.getValueFrom(context);
          }
        } else {
          // Computed property.
          var property = this.property;

          this.valueFn_ = function(model, observer, filterRegistry) {
            var context = object(model, observer, filterRegistry);
            var propName = property(model, observer, filterRegistry);
            if (observer)
              observer.addPath(context, [propName]);

            return context ? context[propName] : undefined;
          };
        }
      }
      return this.valueFn_;
    },

    setValue: function(model, newValue) {
      if (this.simplePath) {
        this.fullPath.setValueFrom(model, newValue);
        return newValue;
      }

      var object = this.object(model);
      var propName = this.property instanceof IdentPath ? this.property.name :
          this.property(model);
      return object[propName] = newValue;
    }
  };

  function Filter(name, args) {
    this.name = name;
    this.args = [];
    for (var i = 0; i < args.length; i++) {
      this.args[i] = getFn(args[i]);
    }
  }

  Filter.prototype = {
    transform: function(model, observer, filterRegistry, toModelDirection,
                        initialArgs) {
      var fn = filterRegistry[this.name];
      var context = model;
      if (fn) {
        context = undefined;
      } else {
        fn = context[this.name];
        if (!fn) {
          console.error('Cannot find function or filter: ' + this.name);
          return;
        }
      }

      // If toModelDirection is falsey, then the "normal" (dom-bound) direction
      // is used. Otherwise, it looks for a 'toModel' property function on the
      // object.
      if (toModelDirection) {
        fn = fn.toModel;
      } else if (typeof fn.toDOM == 'function') {
        fn = fn.toDOM;
      }

      if (typeof fn != 'function') {
        console.error('Cannot find function or filter: ' + this.name);
        return;
      }

      var args = initialArgs || [];
      for (var i = 0; i < this.args.length; i++) {
        args.push(getFn(this.args[i])(model, observer, filterRegistry));
      }

      return fn.apply(context, args);
    }
  };

  function notImplemented() { throw Error('Not Implemented'); }

  var unaryOperators = {
    '+': function(v) { return +v; },
    '-': function(v) { return -v; },
    '!': function(v) { return !v; }
  };

  var binaryOperators = {
    '+': function(l, r) { return l+r; },
    '-': function(l, r) { return l-r; },
    '*': function(l, r) { return l*r; },
    '/': function(l, r) { return l/r; },
    '%': function(l, r) { return l%r; },
    '<': function(l, r) { return l<r; },
    '>': function(l, r) { return l>r; },
    '<=': function(l, r) { return l<=r; },
    '>=': function(l, r) { return l>=r; },
    '==': function(l, r) { return l==r; },
    '!=': function(l, r) { return l!=r; },
    '===': function(l, r) { return l===r; },
    '!==': function(l, r) { return l!==r; },
    '&&': function(l, r) { return l&&r; },
    '||': function(l, r) { return l||r; },
  };

  function getFn(arg) {
    return typeof arg == 'function' ? arg : arg.valueFn();
  }

  function ASTDelegate() {
    this.expression = null;
    this.filters = [];
    this.deps = {};
    this.currentPath = undefined;
    this.scopeIdent = undefined;
    this.indexIdent = undefined;
    this.dynamicDeps = false;
  }

  ASTDelegate.prototype = {
    createUnaryExpression: function(op, argument) {
      if (!unaryOperators[op])
        throw Error('Disallowed operator: ' + op);

      argument = getFn(argument);

      return function(model, observer, filterRegistry) {
        return unaryOperators[op](argument(model, observer, filterRegistry));
      };
    },

    createBinaryExpression: function(op, left, right) {
      if (!binaryOperators[op])
        throw Error('Disallowed operator: ' + op);

      left = getFn(left);
      right = getFn(right);

      switch (op) {
        case '||':
          this.dynamicDeps = true;
          return function(model, observer, filterRegistry) {
            return left(model, observer, filterRegistry) ||
                right(model, observer, filterRegistry);
          };
        case '&&':
          this.dynamicDeps = true;
          return function(model, observer, filterRegistry) {
            return left(model, observer, filterRegistry) &&
                right(model, observer, filterRegistry);
          };
      }

      return function(model, observer, filterRegistry) {
        return binaryOperators[op](left(model, observer, filterRegistry),
                                   right(model, observer, filterRegistry));
      };
    },

    createConditionalExpression: function(test, consequent, alternate) {
      test = getFn(test);
      consequent = getFn(consequent);
      alternate = getFn(alternate);

      this.dynamicDeps = true;

      return function(model, observer, filterRegistry) {
        return test(model, observer, filterRegistry) ?
            consequent(model, observer, filterRegistry) :
            alternate(model, observer, filterRegistry);
      }
    },

    createIdentifier: function(name) {
      var ident = new IdentPath(name);
      ident.type = 'Identifier';
      return ident;
    },

    createMemberExpression: function(accessor, object, property) {
      var ex = new MemberExpression(object, property, accessor);
      if (ex.dynamicDeps)
        this.dynamicDeps = true;
      return ex;
    },

    createCallExpression: function(expression, args) {
      if (!(expression instanceof IdentPath))
        throw Error('Only identifier function invocations are allowed');

      var filter = new Filter(expression.name, args);

      return function(model, observer, filterRegistry) {
        return filter.transform(model, observer, filterRegistry, false);
      };
    },

    createLiteral: function(token) {
      return new Literal(token.value);
    },

    createArrayExpression: function(elements) {
      for (var i = 0; i < elements.length; i++)
        elements[i] = getFn(elements[i]);

      return function(model, observer, filterRegistry) {
        var arr = []
        for (var i = 0; i < elements.length; i++)
          arr.push(elements[i](model, observer, filterRegistry));
        return arr;
      }
    },

    createProperty: function(kind, key, value) {
      return {
        key: key instanceof IdentPath ? key.name : key.value,
        value: value
      };
    },

    createObjectExpression: function(properties) {
      for (var i = 0; i < properties.length; i++)
        properties[i].value = getFn(properties[i].value);

      return function(model, observer, filterRegistry) {
        var obj = {};
        for (var i = 0; i < properties.length; i++)
          obj[properties[i].key] =
              properties[i].value(model, observer, filterRegistry);
        return obj;
      }
    },

    createFilter: function(name, args) {
      this.filters.push(new Filter(name, args));
    },

    createAsExpression: function(expression, scopeIdent) {
      this.expression = expression;
      this.scopeIdent = scopeIdent;
    },

    createInExpression: function(scopeIdent, indexIdent, expression) {
      this.expression = expression;
      this.scopeIdent = scopeIdent;
      this.indexIdent = indexIdent;
    },

    createTopLevel: function(expression) {
      this.expression = expression;
    },

    createThisExpression: notImplemented
  }

  function ConstantObservable(value) {
    this.value_ = value;
  }

  ConstantObservable.prototype = {
    open: function() { return this.value_; },
    discardChanges: function() { return this.value_; },
    deliver: function() {},
    close: function() {},
  }

  function Expression(delegate) {
    this.scopeIdent = delegate.scopeIdent;
    this.indexIdent = delegate.indexIdent;

    if (!delegate.expression)
      throw Error('No expression found.');

    this.expression = delegate.expression;
    getFn(this.expression); // forces enumeration of path dependencies

    this.filters = delegate.filters;
    this.dynamicDeps = delegate.dynamicDeps;
  }

  Expression.prototype = {
    getBinding: function(model, filterRegistry, oneTime) {
      if (oneTime)
        return this.getValue(model, undefined, filterRegistry);

      var observer = new CompoundObserver();
      // captures deps.
      var firstValue = this.getValue(model, observer, filterRegistry);
      var firstTime = true;
      var self = this;

      function valueFn() {
        // deps cannot have changed on first value retrieval.
        if (firstTime) {
          firstTime = false;
          return firstValue;
        }

        if (self.dynamicDeps)
          observer.startReset();

        var value = self.getValue(model,
                                  self.dynamicDeps ? observer : undefined,
                                  filterRegistry);
        if (self.dynamicDeps)
          observer.finishReset();

        return value;
      }

      function setValueFn(newValue) {
        self.setValue(model, newValue, filterRegistry);
        return newValue;
      }

      return new ObserverTransform(observer, valueFn, setValueFn, true);
    },

    getValue: function(model, observer, filterRegistry) {
      var value = getFn(this.expression)(model, observer, filterRegistry);
      for (var i = 0; i < this.filters.length; i++) {
        value = this.filters[i].transform(model, observer, filterRegistry,
            false, [value]);
      }

      return value;
    },

    setValue: function(model, newValue, filterRegistry) {
      var count = this.filters ? this.filters.length : 0;
      while (count-- > 0) {
        newValue = this.filters[count].transform(model, undefined,
            filterRegistry, true, [newValue]);
      }

      if (this.expression.setValue)
        return this.expression.setValue(model, newValue);
    }
  }

  /**
   * Converts a style property name to a css property name. For example:
   * "WebkitUserSelect" to "-webkit-user-select"
   */
  function convertStylePropertyName(name) {
    return String(name).replace(/[A-Z]/g, function(c) {
      return '-' + c.toLowerCase();
    });
  }

  var parentScopeName = '@' + Math.random().toString(36).slice(2);

  // Single ident paths must bind directly to the appropriate scope object.
  // I.e. Pushed values in two-bindings need to be assigned to the actual model
  // object.
  function findScope(model, prop) {
    while (model[parentScopeName] &&
           !Object.prototype.hasOwnProperty.call(model, prop)) {
      model = model[parentScopeName];
    }

    return model;
  }

  function isLiteralExpression(pathString) {
    switch (pathString) {
      case '':
        return false;

      case 'false':
      case 'null':
      case 'true':
        return true;
    }

    if (!isNaN(Number(pathString)))
      return true;

    return false;
  };

  function PolymerExpressions() {}

  PolymerExpressions.prototype = {
    // "built-in" filters
    styleObject: function(value) {
      var parts = [];
      for (var key in value) {
        parts.push(convertStylePropertyName(key) + ': ' + value[key]);
      }
      return parts.join('; ');
    },

    tokenList: function(value) {
      var tokens = [];
      for (var key in value) {
        if (value[key])
          tokens.push(key);
      }
      return tokens.join(' ');
    },

    // binding delegate API
    prepareInstancePositionChanged: function(template) {
      var indexIdent = template.polymerExpressionIndexIdent_;
      if (!indexIdent)
        return;

      return function(templateInstance, index) {
        templateInstance.model[indexIdent] = index;
      };
    },

    prepareBinding: function(pathString, name, node) {
      var path = Path.get(pathString);

      if (!isLiteralExpression(pathString) && path.valid) {
        if (path.length == 1) {
          return function(model, node, oneTime) {
            if (oneTime)
              return path.getValueFrom(model);

            var scope = findScope(model, path[0]);
            return new PathObserver(scope, path);
          };
        }
        return; // bail out early if pathString is simple path.
      }

      return prepareBinding(pathString, name, node, this);
    },

    prepareInstanceModel: function(template) {
      var scopeName = template.polymerExpressionScopeIdent_;
      if (!scopeName)
        return;

      var parentScope = template.templateInstance ?
          template.templateInstance.model :
          template.model;

      var indexName = template.polymerExpressionIndexIdent_;

      return function(model) {
        return createScopeObject(parentScope, model, scopeName, indexName);
      };
    }
  };

  var createScopeObject = ('__proto__' in {}) ?
    function(parentScope, model, scopeName, indexName) {
      var scope = {};
      scope[scopeName] = model;
      scope[indexName] = undefined;
      scope[parentScopeName] = parentScope;
      scope.__proto__ = parentScope;
      return scope;
    } :
    function(parentScope, model, scopeName, indexName) {
      var scope = Object.create(parentScope);
      Object.defineProperty(scope, scopeName,
          { value: model, configurable: true, writable: true });
      Object.defineProperty(scope, indexName,
          { value: undefined, configurable: true, writable: true });
      Object.defineProperty(scope, parentScopeName,
          { value: parentScope, configurable: true, writable: true });
      return scope;
    };

  global.PolymerExpressions = PolymerExpressions;
  PolymerExpressions.getExpression = getExpression;
})(this);

Polymer = {
  version: '0.5.4'
};

// TODO(sorvell): this ensures Polymer is an object and not a function
// Platform is currently defining it as a function to allow for async loading
// of polymer; once we refine the loading process this likely goes away.
if (typeof window.Polymer === 'function') {
  Polymer = {};
}


(function(scope) {

  function withDependencies(task, depends) {
    depends = depends || [];
    if (!depends.map) {
      depends = [depends];
    }
    return task.apply(this, depends.map(marshal));
  }

  function module(name, dependsOrFactory, moduleFactory) {
    var module;
    switch (arguments.length) {
      case 0:
        return;
      case 1:
        module = null;
        break;
      case 2:
        // dependsOrFactory is `factory` in this case
        module = dependsOrFactory.apply(this);
        break;
      default:
        // dependsOrFactory is `depends` in this case
        module = withDependencies(moduleFactory, dependsOrFactory);
        break;
    }
    modules[name] = module;
  };

  function marshal(name) {
    return modules[name];
  }

  var modules = {};

  function using(depends, task) {
    HTMLImports.whenImportsReady(function() {
      withDependencies(task, depends);
    });
  };

  // exports

  scope.marshal = marshal;
  // `module` confuses commonjs detectors
  scope.modularize = module;
  scope.using = using;

})(window);

/*
	Build only script.

  Ensures scripts needed for basic x-platform compatibility
  will be run when platform.js is not loaded.
 */
if (!window.WebComponents) {

/*
	On supported platforms, platform.js is not needed. To retain compatibility
	with the polyfills, we stub out minimal functionality.
 */
if (!window.WebComponents) {

  WebComponents = {
  	flush: function() {},
    flags: {log: {}}
  };

  Platform = WebComponents;

  CustomElements = {
  	useNative: true,
    ready: true,
    takeRecords: function() {},
    instanceof: function(obj, base) {
      return obj instanceof base;
    }
  };
  
  HTMLImports = {
  	useNative: true
  };

  
  addEventListener('HTMLImportsLoaded', function() {
    document.dispatchEvent(
      new CustomEvent('WebComponentsReady', {bubbles: true})
    );
  });


  // ShadowDOM
  ShadowDOMPolyfill = null;
  wrap = unwrap = function(n){
    return n;
  };

}

/*
  Create polyfill scope and feature detect native support.
*/
window.HTMLImports = window.HTMLImports || {flags:{}};

(function(scope) {

/**
  Basic setup and simple module executer. We collect modules and then execute
  the code later, only if it's necessary for polyfilling.
*/
var IMPORT_LINK_TYPE = 'import';
var useNative = Boolean(IMPORT_LINK_TYPE in document.createElement('link'));

/**
  Support `currentScript` on all browsers as `document._currentScript.`

  NOTE: We cannot polyfill `document.currentScript` because it's not possible
  both to override and maintain the ability to capture the native value.
  Therefore we choose to expose `_currentScript` both when native imports
  and the polyfill are in use.
*/
// NOTE: ShadowDOMPolyfill intrusion.
var hasShadowDOMPolyfill = Boolean(window.ShadowDOMPolyfill);
var wrap = function(node) {
  return hasShadowDOMPolyfill ? ShadowDOMPolyfill.wrapIfNeeded(node) : node;
};
var rootDocument = wrap(document);

var currentScriptDescriptor = {
  get: function() {
    var script = HTMLImports.currentScript || document.currentScript ||
        // NOTE: only works when called in synchronously executing code.
        // readyState should check if `loading` but IE10 is
        // interactive when scripts run so we cheat.
        (document.readyState !== 'complete' ?
        document.scripts[document.scripts.length - 1] : null);
    return wrap(script);
  },
  configurable: true
};

Object.defineProperty(document, '_currentScript', currentScriptDescriptor);
Object.defineProperty(rootDocument, '_currentScript', currentScriptDescriptor);

/**
  Add support for the `HTMLImportsLoaded` event and the `HTMLImports.whenReady`
  method. This api is necessary because unlike the native implementation,
  script elements do not force imports to resolve. Instead, users should wrap
  code in either an `HTMLImportsLoaded` hander or after load time in an
  `HTMLImports.whenReady(callback)` call.

  NOTE: This module also supports these apis under the native implementation.
  Therefore, if this file is loaded, the same code can be used under both
  the polyfill and native implementation.
 */

var isIE = /Trident/.test(navigator.userAgent);

// call a callback when all HTMLImports in the document at call time
// (or at least document ready) have loaded.
// 1. ensure the document is in a ready state (has dom), then
// 2. watch for loading of imports and call callback when done
function whenReady(callback, doc) {
  doc = doc || rootDocument;
  // if document is loading, wait and try again
  whenDocumentReady(function() {
    watchImportsLoad(callback, doc);
  }, doc);
}

// call the callback when the document is in a ready state (has dom)
var requiredReadyState = isIE ? 'complete' : 'interactive';
var READY_EVENT = 'readystatechange';
function isDocumentReady(doc) {
  return (doc.readyState === 'complete' ||
      doc.readyState === requiredReadyState);
}

// call <callback> when we ensure the document is in a ready state
function whenDocumentReady(callback, doc) {
  if (!isDocumentReady(doc)) {
    var checkReady = function() {
      if (doc.readyState === 'complete' ||
          doc.readyState === requiredReadyState) {
        doc.removeEventListener(READY_EVENT, checkReady);
        whenDocumentReady(callback, doc);
      }
    };
    doc.addEventListener(READY_EVENT, checkReady);
  } else if (callback) {
    callback();
  }
}

function markTargetLoaded(event) {
  event.target.__loaded = true;
}

// call <callback> when we ensure all imports have loaded
function watchImportsLoad(callback, doc) {
  var imports = doc.querySelectorAll('link[rel=import]');
  var loaded = 0, l = imports.length;
  function checkDone(d) {
    if ((loaded == l) && callback) {
       callback();
    }
  }
  function loadedImport(e) {
    markTargetLoaded(e);
    loaded++;
    checkDone();
  }
  if (l) {
    for (var i=0, imp; (i<l) && (imp=imports[i]); i++) {
      if (isImportLoaded(imp)) {
        loadedImport.call(imp, {target: imp});
      } else {
        imp.addEventListener('load', loadedImport);
        imp.addEventListener('error', loadedImport);
      }
    }
  } else {
    checkDone();
  }
}

// NOTE: test for native imports loading is based on explicitly watching
// all imports (see below).
// However, we cannot rely on this entirely without watching the entire document
// for import links. For perf reasons, currently only head is watched.
// Instead, we fallback to checking if the import property is available
// and the document is not itself loading.
function isImportLoaded(link) {
  return useNative ? link.__loaded ||
      (link.import && link.import.readyState !== 'loading') :
      link.__importParsed;
}

// TODO(sorvell): Workaround for
// https://www.w3.org/Bugs/Public/show_bug.cgi?id=25007, should be removed when
// this bug is addressed.
// (1) Install a mutation observer to see when HTMLImports have loaded
// (2) if this script is run during document load it will watch any existing
// imports for loading.
//
// NOTE: The workaround has restricted functionality: (1) it's only compatible
// with imports that are added to document.head since the mutation observer
// watches only head for perf reasons, (2) it requires this script
// to run before any imports have completed loading.
if (useNative) {
  new MutationObserver(function(mxns) {
    for (var i=0, l=mxns.length, m; (i < l) && (m=mxns[i]); i++) {
      if (m.addedNodes) {
        handleImports(m.addedNodes);
      }
    }
  }).observe(document.head, {childList: true});

  function handleImports(nodes) {
    for (var i=0, l=nodes.length, n; (i<l) && (n=nodes[i]); i++) {
      if (isImport(n)) {
        handleImport(n);
      }
    }
  }

  function isImport(element) {
    return element.localName === 'link' && element.rel === 'import';
  }

  function handleImport(element) {
    var loaded = element.import;
    if (loaded) {
      markTargetLoaded({target: element});
    } else {
      element.addEventListener('load', markTargetLoaded);
      element.addEventListener('error', markTargetLoaded);
    }
  }

  // make sure to catch any imports that are in the process of loading
  // when this script is run.
  (function() {
    if (document.readyState === 'loading') {
      var imports = document.querySelectorAll('link[rel=import]');
      for (var i=0, l=imports.length, imp; (i<l) && (imp=imports[i]); i++) {
        handleImport(imp);
      }
    }
  })();

}

// Fire the 'HTMLImportsLoaded' event when imports in document at load time
// have loaded. This event is required to simulate the script blocking
// behavior of native imports. A main document script that needs to be sure
// imports have loaded should wait for this event.
whenReady(function() {
  HTMLImports.ready = true;
  HTMLImports.readyTime = new Date().getTime();
  rootDocument.dispatchEvent(
    new CustomEvent('HTMLImportsLoaded', {bubbles: true})
  );
});

// exports
scope.IMPORT_LINK_TYPE = IMPORT_LINK_TYPE;
scope.useNative = useNative;
scope.rootDocument = rootDocument;
scope.whenReady = whenReady;
scope.isIE = isIE;

})(HTMLImports);

(function(scope) {

  // TODO(sorvell): It's desireable to provide a default stylesheet 
  // that's convenient for styling unresolved elements, but
  // it's cumbersome to have to include this manually in every page.
  // It would make sense to put inside some HTMLImport but 
  // the HTMLImports polyfill does not allow loading of stylesheets 
  // that block rendering. Therefore this injection is tolerated here.
  var style = document.createElement('style');
  style.textContent = ''
      + 'body {'
      + 'transition: opacity ease-in 0.2s;' 
      + ' } \n'
      + 'body[unresolved] {'
      + 'opacity: 0; display: block; overflow: hidden;' 
      + ' } \n'
      ;
  var head = document.querySelector('head');
  head.insertBefore(style, head.firstChild);

})(Platform);

/*
	Build only script.

  Ensures scripts needed for basic x-platform compatibility
  will be run when platform.js is not loaded.
 */
}
(function(global) {
  'use strict';

  var testingExposeCycleCount = global.testingExposeCycleCount;

  // Detect and do basic sanity checking on Object/Array.observe.
  function detectObjectObserve() {
    if (typeof Object.observe !== 'function' ||
        typeof Array.observe !== 'function') {
      return false;
    }

    var records = [];

    function callback(recs) {
      records = recs;
    }

    var test = {};
    var arr = [];
    Object.observe(test, callback);
    Array.observe(arr, callback);
    test.id = 1;
    test.id = 2;
    delete test.id;
    arr.push(1, 2);
    arr.length = 0;

    Object.deliverChangeRecords(callback);
    if (records.length !== 5)
      return false;

    if (records[0].type != 'add' ||
        records[1].type != 'update' ||
        records[2].type != 'delete' ||
        records[3].type != 'splice' ||
        records[4].type != 'splice') {
      return false;
    }

    Object.unobserve(test, callback);
    Array.unobserve(arr, callback);

    return true;
  }

  var hasObserve = detectObjectObserve();

  function detectEval() {
    // Don't test for eval if we're running in a Chrome App environment.
    // We check for APIs set that only exist in a Chrome App context.
    if (typeof chrome !== 'undefined' && chrome.app && chrome.app.runtime) {
      return false;
    }

    // Firefox OS Apps do not allow eval. This feature detection is very hacky
    // but even if some other platform adds support for this function this code
    // will continue to work.
    if (typeof navigator != 'undefined' && navigator.getDeviceStorage) {
      return false;
    }

    try {
      var f = new Function('', 'return true;');
      return f();
    } catch (ex) {
      return false;
    }
  }

  var hasEval = detectEval();

  function isIndex(s) {
    return +s === s >>> 0 && s !== '';
  }

  function toNumber(s) {
    return +s;
  }

  function isObject(obj) {
    return obj === Object(obj);
  }

  var numberIsNaN = global.Number.isNaN || function(value) {
    return typeof value === 'number' && global.isNaN(value);
  }

  function areSameValue(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    if (numberIsNaN(left) && numberIsNaN(right))
      return true;

    return left !== left && right !== right;
  }

  var createObject = ('__proto__' in {}) ?
    function(obj) { return obj; } :
    function(obj) {
      var proto = obj.__proto__;
      if (!proto)
        return obj;
      var newObject = Object.create(proto);
      Object.getOwnPropertyNames(obj).forEach(function(name) {
        Object.defineProperty(newObject, name,
                             Object.getOwnPropertyDescriptor(obj, name));
      });
      return newObject;
    };

  var identStart = '[\$_a-zA-Z]';
  var identPart = '[\$_a-zA-Z0-9]';
  var identRegExp = new RegExp('^' + identStart + '+' + identPart + '*' + '$');

  function getPathCharType(char) {
    if (char === undefined)
      return 'eof';

    var code = char.charCodeAt(0);

    switch(code) {
      case 0x5B: // [
      case 0x5D: // ]
      case 0x2E: // .
      case 0x22: // "
      case 0x27: // '
      case 0x30: // 0
        return char;

      case 0x5F: // _
      case 0x24: // $
        return 'ident';

      case 0x20: // Space
      case 0x09: // Tab
      case 0x0A: // Newline
      case 0x0D: // Return
      case 0xA0:  // No-break space
      case 0xFEFF:  // Byte Order Mark
      case 0x2028:  // Line Separator
      case 0x2029:  // Paragraph Separator
        return 'ws';
    }

    // a-z, A-Z
    if ((0x61 <= code && code <= 0x7A) || (0x41 <= code && code <= 0x5A))
      return 'ident';

    // 1-9
    if (0x31 <= code && code <= 0x39)
      return 'number';

    return 'else';
  }

  var pathStateMachine = {
    'beforePath': {
      'ws': ['beforePath'],
      'ident': ['inIdent', 'append'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },

    'inPath': {
      'ws': ['inPath'],
      '.': ['beforeIdent'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },

    'beforeIdent': {
      'ws': ['beforeIdent'],
      'ident': ['inIdent', 'append']
    },

    'inIdent': {
      'ident': ['inIdent', 'append'],
      '0': ['inIdent', 'append'],
      'number': ['inIdent', 'append'],
      'ws': ['inPath', 'push'],
      '.': ['beforeIdent', 'push'],
      '[': ['beforeElement', 'push'],
      'eof': ['afterPath', 'push']
    },

    'beforeElement': {
      'ws': ['beforeElement'],
      '0': ['afterZero', 'append'],
      'number': ['inIndex', 'append'],
      "'": ['inSingleQuote', 'append', ''],
      '"': ['inDoubleQuote', 'append', '']
    },

    'afterZero': {
      'ws': ['afterElement', 'push'],
      ']': ['inPath', 'push']
    },

    'inIndex': {
      '0': ['inIndex', 'append'],
      'number': ['inIndex', 'append'],
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    },

    'inSingleQuote': {
      "'": ['afterElement'],
      'eof': ['error'],
      'else': ['inSingleQuote', 'append']
    },

    'inDoubleQuote': {
      '"': ['afterElement'],
      'eof': ['error'],
      'else': ['inDoubleQuote', 'append']
    },

    'afterElement': {
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    }
  }

  function noop() {}

  function parsePath(path) {
    var keys = [];
    var index = -1;
    var c, newChar, key, type, transition, action, typeMap, mode = 'beforePath';

    var actions = {
      push: function() {
        if (key === undefined)
          return;

        keys.push(key);
        key = undefined;
      },

      append: function() {
        if (key === undefined)
          key = newChar
        else
          key += newChar;
      }
    };

    function maybeUnescapeQuote() {
      if (index >= path.length)
        return;

      var nextChar = path[index + 1];
      if ((mode == 'inSingleQuote' && nextChar == "'") ||
          (mode == 'inDoubleQuote' && nextChar == '"')) {
        index++;
        newChar = nextChar;
        actions.append();
        return true;
      }
    }

    while (mode) {
      index++;
      c = path[index];

      if (c == '\\' && maybeUnescapeQuote(mode))
        continue;

      type = getPathCharType(c);
      typeMap = pathStateMachine[mode];
      transition = typeMap[type] || typeMap['else'] || 'error';

      if (transition == 'error')
        return; // parse error;

      mode = transition[0];
      action = actions[transition[1]] || noop;
      newChar = transition[2] === undefined ? c : transition[2];
      action();

      if (mode === 'afterPath') {
        return keys;
      }
    }

    return; // parse error
  }

  function isIdent(s) {
    return identRegExp.test(s);
  }

  var constructorIsPrivate = {};

  function Path(parts, privateToken) {
    if (privateToken !== constructorIsPrivate)
      throw Error('Use Path.get to retrieve path objects');

    for (var i = 0; i < parts.length; i++) {
      this.push(String(parts[i]));
    }

    if (hasEval && this.length) {
      this.getValueFrom = this.compiledGetValueFromFn();
    }
  }

  // TODO(rafaelw): Make simple LRU cache
  var pathCache = {};

  function getPath(pathString) {
    if (pathString instanceof Path)
      return pathString;

    if (pathString == null || pathString.length == 0)
      pathString = '';

    if (typeof pathString != 'string') {
      if (isIndex(pathString.length)) {
        // Constructed with array-like (pre-parsed) keys
        return new Path(pathString, constructorIsPrivate);
      }

      pathString = String(pathString);
    }

    var path = pathCache[pathString];
    if (path)
      return path;

    var parts = parsePath(pathString);
    if (!parts)
      return invalidPath;

    var path = new Path(parts, constructorIsPrivate);
    pathCache[pathString] = path;
    return path;
  }

  Path.get = getPath;

  function formatAccessor(key) {
    if (isIndex(key)) {
      return '[' + key + ']';
    } else {
      return '["' + key.replace(/"/g, '\\"') + '"]';
    }
  }

  Path.prototype = createObject({
    __proto__: [],
    valid: true,

    toString: function() {
      var pathString = '';
      for (var i = 0; i < this.length; i++) {
        var key = this[i];
        if (isIdent(key)) {
          pathString += i ? '.' + key : key;
        } else {
          pathString += formatAccessor(key);
        }
      }

      return pathString;
    },

    getValueFrom: function(obj, directObserver) {
      for (var i = 0; i < this.length; i++) {
        if (obj == null)
          return;
        obj = obj[this[i]];
      }
      return obj;
    },

    iterateObjects: function(obj, observe) {
      for (var i = 0; i < this.length; i++) {
        if (i)
          obj = obj[this[i - 1]];
        if (!isObject(obj))
          return;
        observe(obj, this[i]);
      }
    },

    compiledGetValueFromFn: function() {
      var str = '';
      var pathString = 'obj';
      str += 'if (obj != null';
      var i = 0;
      var key;
      for (; i < (this.length - 1); i++) {
        key = this[i];
        pathString += isIdent(key) ? '.' + key : formatAccessor(key);
        str += ' &&\n     ' + pathString + ' != null';
      }
      str += ')\n';

      var key = this[i];
      pathString += isIdent(key) ? '.' + key : formatAccessor(key);

      str += '  return ' + pathString + ';\nelse\n  return undefined;';
      return new Function('obj', str);
    },

    setValueFrom: function(obj, value) {
      if (!this.length)
        return false;

      for (var i = 0; i < this.length - 1; i++) {
        if (!isObject(obj))
          return false;
        obj = obj[this[i]];
      }

      if (!isObject(obj))
        return false;

      obj[this[i]] = value;
      return true;
    }
  });

  var invalidPath = new Path('', constructorIsPrivate);
  invalidPath.valid = false;
  invalidPath.getValueFrom = invalidPath.setValueFrom = function() {};

  var MAX_DIRTY_CHECK_CYCLES = 1000;

  function dirtyCheck(observer) {
    var cycles = 0;
    while (cycles < MAX_DIRTY_CHECK_CYCLES && observer.check_()) {
      cycles++;
    }
    if (testingExposeCycleCount)
      global.dirtyCheckCycleCount = cycles;

    return cycles > 0;
  }

  function objectIsEmpty(object) {
    for (var prop in object)
      return false;
    return true;
  }

  function diffIsEmpty(diff) {
    return objectIsEmpty(diff.added) &&
           objectIsEmpty(diff.removed) &&
           objectIsEmpty(diff.changed);
  }

  function diffObjectFromOldObject(object, oldObject) {
    var added = {};
    var removed = {};
    var changed = {};

    for (var prop in oldObject) {
      var newValue = object[prop];

      if (newValue !== undefined && newValue === oldObject[prop])
        continue;

      if (!(prop in object)) {
        removed[prop] = undefined;
        continue;
      }

      if (newValue !== oldObject[prop])
        changed[prop] = newValue;
    }

    for (var prop in object) {
      if (prop in oldObject)
        continue;

      added[prop] = object[prop];
    }

    if (Array.isArray(object) && object.length !== oldObject.length)
      changed.length = object.length;

    return {
      added: added,
      removed: removed,
      changed: changed
    };
  }

  var eomTasks = [];
  function runEOMTasks() {
    if (!eomTasks.length)
      return false;

    for (var i = 0; i < eomTasks.length; i++) {
      eomTasks[i]();
    }
    eomTasks.length = 0;
    return true;
  }

  var runEOM = hasObserve ? (function(){
    return function(fn) {
      return Promise.resolve().then(fn);
    }
  })() :
  (function() {
    return function(fn) {
      eomTasks.push(fn);
    };
  })();

  var observedObjectCache = [];

  function newObservedObject() {
    var observer;
    var object;
    var discardRecords = false;
    var first = true;

    function callback(records) {
      if (observer && observer.state_ === OPENED && !discardRecords)
        observer.check_(records);
    }

    return {
      open: function(obs) {
        if (observer)
          throw Error('ObservedObject in use');

        if (!first)
          Object.deliverChangeRecords(callback);

        observer = obs;
        first = false;
      },
      observe: function(obj, arrayObserve) {
        object = obj;
        if (arrayObserve)
          Array.observe(object, callback);
        else
          Object.observe(object, callback);
      },
      deliver: function(discard) {
        discardRecords = discard;
        Object.deliverChangeRecords(callback);
        discardRecords = false;
      },
      close: function() {
        observer = undefined;
        Object.unobserve(object, callback);
        observedObjectCache.push(this);
      }
    };
  }

  /*
   * The observedSet abstraction is a perf optimization which reduces the total
   * number of Object.observe observations of a set of objects. The idea is that
   * groups of Observers will have some object dependencies in common and this
   * observed set ensures that each object in the transitive closure of
   * dependencies is only observed once. The observedSet acts as a write barrier
   * such that whenever any change comes through, all Observers are checked for
   * changed values.
   *
   * Note that this optimization is explicitly moving work from setup-time to
   * change-time.
   *
   * TODO(rafaelw): Implement "garbage collection". In order to move work off
   * the critical path, when Observers are closed, their observed objects are
   * not Object.unobserve(d). As a result, it's possible that if the observedSet
   * is kept open, but some Observers have been closed, it could cause "leaks"
   * (prevent otherwise collectable objects from being collected). At some
   * point, we should implement incremental "gc" which keeps a list of
   * observedSets which may need clean-up and does small amounts of cleanup on a
   * timeout until all is clean.
   */

  function getObservedObject(observer, object, arrayObserve) {
    var dir = observedObjectCache.pop() || newObservedObject();
    dir.open(observer);
    dir.observe(object, arrayObserve);
    return dir;
  }

  var observedSetCache = [];

  function newObservedSet() {
    var observerCount = 0;
    var observers = [];
    var objects = [];
    var rootObj;
    var rootObjProps;

    function observe(obj, prop) {
      if (!obj)
        return;

      if (obj === rootObj)
        rootObjProps[prop] = true;

      if (objects.indexOf(obj) < 0) {
        objects.push(obj);
        Object.observe(obj, callback);
      }

      observe(Object.getPrototypeOf(obj), prop);
    }

    function allRootObjNonObservedProps(recs) {
      for (var i = 0; i < recs.length; i++) {
        var rec = recs[i];
        if (rec.object !== rootObj ||
            rootObjProps[rec.name] ||
            rec.type === 'setPrototype') {
          return false;
        }
      }
      return true;
    }

    function callback(recs) {
      if (allRootObjNonObservedProps(recs))
        return;

      var observer;
      for (var i = 0; i < observers.length; i++) {
        observer = observers[i];
        if (observer.state_ == OPENED) {
          observer.iterateObjects_(observe);
        }
      }

      for (var i = 0; i < observers.length; i++) {
        observer = observers[i];
        if (observer.state_ == OPENED) {
          observer.check_();
        }
      }
    }

    var record = {
      objects: objects,
      get rootObject() { return rootObj; },
      set rootObject(value) {
        rootObj = value;
        rootObjProps = {};
      },
      open: function(obs, object) {
        observers.push(obs);
        observerCount++;
        obs.iterateObjects_(observe);
      },
      close: function(obs) {
        observerCount--;
        if (observerCount > 0) {
          return;
        }

        for (var i = 0; i < objects.length; i++) {
          Object.unobserve(objects[i], callback);
          Observer.unobservedCount++;
        }

        observers.length = 0;
        objects.length = 0;
        rootObj = undefined;
        rootObjProps = undefined;
        observedSetCache.push(this);
        if (lastObservedSet === this)
          lastObservedSet = null;
      },
    };

    return record;
  }

  var lastObservedSet;

  function getObservedSet(observer, obj) {
    if (!lastObservedSet || lastObservedSet.rootObject !== obj) {
      lastObservedSet = observedSetCache.pop() || newObservedSet();
      lastObservedSet.rootObject = obj;
    }
    lastObservedSet.open(observer, obj);
    return lastObservedSet;
  }

  var UNOPENED = 0;
  var OPENED = 1;
  var CLOSED = 2;
  var RESETTING = 3;

  var nextObserverId = 1;

  function Observer() {
    this.state_ = UNOPENED;
    this.callback_ = undefined;
    this.target_ = undefined; // TODO(rafaelw): Should be WeakRef
    this.directObserver_ = undefined;
    this.value_ = undefined;
    this.id_ = nextObserverId++;
  }

  Observer.prototype = {
    open: function(callback, target) {
      if (this.state_ != UNOPENED)
        throw Error('Observer has already been opened.');

      addToAll(this);
      this.callback_ = callback;
      this.target_ = target;
      this.connect_();
      this.state_ = OPENED;
      return this.value_;
    },

    close: function() {
      if (this.state_ != OPENED)
        return;

      removeFromAll(this);
      this.disconnect_();
      this.value_ = undefined;
      this.callback_ = undefined;
      this.target_ = undefined;
      this.state_ = CLOSED;
    },

    deliver: function() {
      if (this.state_ != OPENED)
        return;

      dirtyCheck(this);
    },

    report_: function(changes) {
      try {
        this.callback_.apply(this.target_, changes);
      } catch (ex) {
        Observer._errorThrownDuringCallback = true;
        console.error('Exception caught during observer callback: ' +
                       (ex.stack || ex));
      }
    },

    discardChanges: function() {
      this.check_(undefined, true);
      return this.value_;
    }
  }

  var collectObservers = !hasObserve;
  var allObservers;
  Observer._allObserversCount = 0;

  if (collectObservers) {
    allObservers = [];
  }

  function addToAll(observer) {
    Observer._allObserversCount++;
    if (!collectObservers)
      return;

    allObservers.push(observer);
  }

  function removeFromAll(observer) {
    Observer._allObserversCount--;
  }

  var runningMicrotaskCheckpoint = false;

  global.Platform = global.Platform || {};

  global.Platform.performMicrotaskCheckpoint = function() {
    if (runningMicrotaskCheckpoint)
      return;

    if (!collectObservers)
      return;

    runningMicrotaskCheckpoint = true;

    var cycles = 0;
    var anyChanged, toCheck;

    do {
      cycles++;
      toCheck = allObservers;
      allObservers = [];
      anyChanged = false;

      for (var i = 0; i < toCheck.length; i++) {
        var observer = toCheck[i];
        if (observer.state_ != OPENED)
          continue;

        if (observer.check_())
          anyChanged = true;

        allObservers.push(observer);
      }
      if (runEOMTasks())
        anyChanged = true;
    } while (cycles < MAX_DIRTY_CHECK_CYCLES && anyChanged);

    if (testingExposeCycleCount)
      global.dirtyCheckCycleCount = cycles;

    runningMicrotaskCheckpoint = false;
  };

  if (collectObservers) {
    global.Platform.clearObservers = function() {
      allObservers = [];
    };
  }

  function ObjectObserver(object) {
    Observer.call(this);
    this.value_ = object;
    this.oldObject_ = undefined;
  }

  ObjectObserver.prototype = createObject({
    __proto__: Observer.prototype,

    arrayObserve: false,

    connect_: function(callback, target) {
      if (hasObserve) {
        this.directObserver_ = getObservedObject(this, this.value_,
                                                 this.arrayObserve);
      } else {
        this.oldObject_ = this.copyObject(this.value_);
      }

    },

    copyObject: function(object) {
      var copy = Array.isArray(object) ? [] : {};
      for (var prop in object) {
        copy[prop] = object[prop];
      };
      if (Array.isArray(object))
        copy.length = object.length;
      return copy;
    },

    check_: function(changeRecords, skipChanges) {
      var diff;
      var oldValues;
      if (hasObserve) {
        if (!changeRecords)
          return false;

        oldValues = {};
        diff = diffObjectFromChangeRecords(this.value_, changeRecords,
                                           oldValues);
      } else {
        oldValues = this.oldObject_;
        diff = diffObjectFromOldObject(this.value_, this.oldObject_);
      }

      if (diffIsEmpty(diff))
        return false;

      if (!hasObserve)
        this.oldObject_ = this.copyObject(this.value_);

      this.report_([
        diff.added || {},
        diff.removed || {},
        diff.changed || {},
        function(property) {
          return oldValues[property];
        }
      ]);

      return true;
    },

    disconnect_: function() {
      if (hasObserve) {
        this.directObserver_.close();
        this.directObserver_ = undefined;
      } else {
        this.oldObject_ = undefined;
      }
    },

    deliver: function() {
      if (this.state_ != OPENED)
        return;

      if (hasObserve)
        this.directObserver_.deliver(false);
      else
        dirtyCheck(this);
    },

    discardChanges: function() {
      if (this.directObserver_)
        this.directObserver_.deliver(true);
      else
        this.oldObject_ = this.copyObject(this.value_);

      return this.value_;
    }
  });

  function ArrayObserver(array) {
    if (!Array.isArray(array))
      throw Error('Provided object is not an Array');
    ObjectObserver.call(this, array);
  }

  ArrayObserver.prototype = createObject({

    __proto__: ObjectObserver.prototype,

    arrayObserve: true,

    copyObject: function(arr) {
      return arr.slice();
    },

    check_: function(changeRecords) {
      var splices;
      if (hasObserve) {
        if (!changeRecords)
          return false;
        splices = projectArraySplices(this.value_, changeRecords);
      } else {
        splices = calcSplices(this.value_, 0, this.value_.length,
                              this.oldObject_, 0, this.oldObject_.length);
      }

      if (!splices || !splices.length)
        return false;

      if (!hasObserve)
        this.oldObject_ = this.copyObject(this.value_);

      this.report_([splices]);
      return true;
    }
  });

  ArrayObserver.applySplices = function(previous, current, splices) {
    splices.forEach(function(splice) {
      var spliceArgs = [splice.index, splice.removed.length];
      var addIndex = splice.index;
      while (addIndex < splice.index + splice.addedCount) {
        spliceArgs.push(current[addIndex]);
        addIndex++;
      }

      Array.prototype.splice.apply(previous, spliceArgs);
    });
  };

  function PathObserver(object, path) {
    Observer.call(this);

    this.object_ = object;
    this.path_ = getPath(path);
    this.directObserver_ = undefined;
  }

  PathObserver.prototype = createObject({
    __proto__: Observer.prototype,

    get path() {
      return this.path_;
    },

    connect_: function() {
      if (hasObserve)
        this.directObserver_ = getObservedSet(this, this.object_);

      this.check_(undefined, true);
    },

    disconnect_: function() {
      this.value_ = undefined;

      if (this.directObserver_) {
        this.directObserver_.close(this);
        this.directObserver_ = undefined;
      }
    },

    iterateObjects_: function(observe) {
      this.path_.iterateObjects(this.object_, observe);
    },

    check_: function(changeRecords, skipChanges) {
      var oldValue = this.value_;
      this.value_ = this.path_.getValueFrom(this.object_);
      if (skipChanges || areSameValue(this.value_, oldValue))
        return false;

      this.report_([this.value_, oldValue, this]);
      return true;
    },

    setValue: function(newValue) {
      if (this.path_)
        this.path_.setValueFrom(this.object_, newValue);
    }
  });

  function CompoundObserver(reportChangesOnOpen) {
    Observer.call(this);

    this.reportChangesOnOpen_ = reportChangesOnOpen;
    this.value_ = [];
    this.directObserver_ = undefined;
    this.observed_ = [];
  }

  var observerSentinel = {};

  CompoundObserver.prototype = createObject({
    __proto__: Observer.prototype,

    connect_: function() {
      if (hasObserve) {
        var object;
        var needsDirectObserver = false;
        for (var i = 0; i < this.observed_.length; i += 2) {
          object = this.observed_[i]
          if (object !== observerSentinel) {
            needsDirectObserver = true;
            break;
          }
        }

        if (needsDirectObserver)
          this.directObserver_ = getObservedSet(this, object);
      }

      this.check_(undefined, !this.reportChangesOnOpen_);
    },

    disconnect_: function() {
      for (var i = 0; i < this.observed_.length; i += 2) {
        if (this.observed_[i] === observerSentinel)
          this.observed_[i + 1].close();
      }
      this.observed_.length = 0;
      this.value_.length = 0;

      if (this.directObserver_) {
        this.directObserver_.close(this);
        this.directObserver_ = undefined;
      }
    },

    addPath: function(object, path) {
      if (this.state_ != UNOPENED && this.state_ != RESETTING)
        throw Error('Cannot add paths once started.');

      var path = getPath(path);
      this.observed_.push(object, path);
      if (!this.reportChangesOnOpen_)
        return;
      var index = this.observed_.length / 2 - 1;
      this.value_[index] = path.getValueFrom(object);
    },

    addObserver: function(observer) {
      if (this.state_ != UNOPENED && this.state_ != RESETTING)
        throw Error('Cannot add observers once started.');

      this.observed_.push(observerSentinel, observer);
      if (!this.reportChangesOnOpen_)
        return;
      var index = this.observed_.length / 2 - 1;
      this.value_[index] = observer.open(this.deliver, this);
    },

    startReset: function() {
      if (this.state_ != OPENED)
        throw Error('Can only reset while open');

      this.state_ = RESETTING;
      this.disconnect_();
    },

    finishReset: function() {
      if (this.state_ != RESETTING)
        throw Error('Can only finishReset after startReset');
      this.state_ = OPENED;
      this.connect_();

      return this.value_;
    },

    iterateObjects_: function(observe) {
      var object;
      for (var i = 0; i < this.observed_.length; i += 2) {
        object = this.observed_[i]
        if (object !== observerSentinel)
          this.observed_[i + 1].iterateObjects(object, observe)
      }
    },

    check_: function(changeRecords, skipChanges) {
      var oldValues;
      for (var i = 0; i < this.observed_.length; i += 2) {
        var object = this.observed_[i];
        var path = this.observed_[i+1];
        var value;
        if (object === observerSentinel) {
          var observable = path;
          value = this.state_ === UNOPENED ?
              observable.open(this.deliver, this) :
              observable.discardChanges();
        } else {
          value = path.getValueFrom(object);
        }

        if (skipChanges) {
          this.value_[i / 2] = value;
          continue;
        }

        if (areSameValue(value, this.value_[i / 2]))
          continue;

        oldValues = oldValues || [];
        oldValues[i / 2] = this.value_[i / 2];
        this.value_[i / 2] = value;
      }

      if (!oldValues)
        return false;

      // TODO(rafaelw): Having observed_ as the third callback arg here is
      // pretty lame API. Fix.
      this.report_([this.value_, oldValues, this.observed_]);
      return true;
    }
  });

  function identFn(value) { return value; }

  function ObserverTransform(observable, getValueFn, setValueFn,
                             dontPassThroughSet) {
    this.callback_ = undefined;
    this.target_ = undefined;
    this.value_ = undefined;
    this.observable_ = observable;
    this.getValueFn_ = getValueFn || identFn;
    this.setValueFn_ = setValueFn || identFn;
    // TODO(rafaelw): This is a temporary hack. PolymerExpressions needs this
    // at the moment because of a bug in it's dependency tracking.
    this.dontPassThroughSet_ = dontPassThroughSet;
  }

  ObserverTransform.prototype = {
    open: function(callback, target) {
      this.callback_ = callback;
      this.target_ = target;
      this.value_ =
          this.getValueFn_(this.observable_.open(this.observedCallback_, this));
      return this.value_;
    },

    observedCallback_: function(value) {
      value = this.getValueFn_(value);
      if (areSameValue(value, this.value_))
        return;
      var oldValue = this.value_;
      this.value_ = value;
      this.callback_.call(this.target_, this.value_, oldValue);
    },

    discardChanges: function() {
      this.value_ = this.getValueFn_(this.observable_.discardChanges());
      return this.value_;
    },

    deliver: function() {
      return this.observable_.deliver();
    },

    setValue: function(value) {
      value = this.setValueFn_(value);
      if (!this.dontPassThroughSet_ && this.observable_.setValue)
        return this.observable_.setValue(value);
    },

    close: function() {
      if (this.observable_)
        this.observable_.close();
      this.callback_ = undefined;
      this.target_ = undefined;
      this.observable_ = undefined;
      this.value_ = undefined;
      this.getValueFn_ = undefined;
      this.setValueFn_ = undefined;
    }
  }

  var expectedRecordTypes = {
    add: true,
    update: true,
    delete: true
  };

  function diffObjectFromChangeRecords(object, changeRecords, oldValues) {
    var added = {};
    var removed = {};

    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      if (!expectedRecordTypes[record.type]) {
        console.error('Unknown changeRecord type: ' + record.type);
        console.error(record);
        continue;
      }

      if (!(record.name in oldValues))
        oldValues[record.name] = record.oldValue;

      if (record.type == 'update')
        continue;

      if (record.type == 'add') {
        if (record.name in removed)
          delete removed[record.name];
        else
          added[record.name] = true;

        continue;
      }

      // type = 'delete'
      if (record.name in added) {
        delete added[record.name];
        delete oldValues[record.name];
      } else {
        removed[record.name] = true;
      }
    }

    for (var prop in added)
      added[prop] = object[prop];

    for (var prop in removed)
      removed[prop] = undefined;

    var changed = {};
    for (var prop in oldValues) {
      if (prop in added || prop in removed)
        continue;

      var newValue = object[prop];
      if (oldValues[prop] !== newValue)
        changed[prop] = newValue;
    }

    return {
      added: added,
      removed: removed,
      changed: changed
    };
  }

  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }

  var EDIT_LEAVE = 0;
  var EDIT_UPDATE = 1;
  var EDIT_ADD = 2;
  var EDIT_DELETE = 3;

  function ArraySplice() {}

  ArraySplice.prototype = {

    // Note: This function is *based* on the computation of the Levenshtein
    // "edit" distance. The one change is that "updates" are treated as two
    // edits - not one. With Array splices, an update is really a delete
    // followed by an add. By retaining this, we optimize for "keeping" the
    // maximum array items in the original array. For example:
    //
    //   'xxxx123' -> '123yyyy'
    //
    // With 1-edit updates, the shortest path would be just to update all seven
    // characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
    // leaves the substring '123' intact.
    calcEditDistances: function(current, currentStart, currentEnd,
                                old, oldStart, oldEnd) {
      // "Deletion" columns
      var rowCount = oldEnd - oldStart + 1;
      var columnCount = currentEnd - currentStart + 1;
      var distances = new Array(rowCount);

      // "Addition" rows. Initialize null column.
      for (var i = 0; i < rowCount; i++) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
      }

      // Initialize null row
      for (var j = 0; j < columnCount; j++)
        distances[0][j] = j;

      for (var i = 1; i < rowCount; i++) {
        for (var j = 1; j < columnCount; j++) {
          if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1]))
            distances[i][j] = distances[i - 1][j - 1];
          else {
            var north = distances[i - 1][j] + 1;
            var west = distances[i][j - 1] + 1;
            distances[i][j] = north < west ? north : west;
          }
        }
      }

      return distances;
    },

    // This starts at the final weight, and walks "backward" by finding
    // the minimum previous weight recursively until the origin of the weight
    // matrix.
    spliceOperationsFromEditDistances: function(distances) {
      var i = distances.length - 1;
      var j = distances[0].length - 1;
      var current = distances[i][j];
      var edits = [];
      while (i > 0 || j > 0) {
        if (i == 0) {
          edits.push(EDIT_ADD);
          j--;
          continue;
        }
        if (j == 0) {
          edits.push(EDIT_DELETE);
          i--;
          continue;
        }
        var northWest = distances[i - 1][j - 1];
        var west = distances[i - 1][j];
        var north = distances[i][j - 1];

        var min;
        if (west < north)
          min = west < northWest ? west : northWest;
        else
          min = north < northWest ? north : northWest;

        if (min == northWest) {
          if (northWest == current) {
            edits.push(EDIT_LEAVE);
          } else {
            edits.push(EDIT_UPDATE);
            current = northWest;
          }
          i--;
          j--;
        } else if (min == west) {
          edits.push(EDIT_DELETE);
          i--;
          current = west;
        } else {
          edits.push(EDIT_ADD);
          j--;
          current = north;
        }
      }

      edits.reverse();
      return edits;
    },

    /**
     * Splice Projection functions:
     *
     * A splice map is a representation of how a previous array of items
     * was transformed into a new array of items. Conceptually it is a list of
     * tuples of
     *
     *   <index, removed, addedCount>
     *
     * which are kept in ascending index order of. The tuple represents that at
     * the |index|, |removed| sequence of items were removed, and counting forward
     * from |index|, |addedCount| items were added.
     */

    /**
     * Lacking individual splice mutation information, the minimal set of
     * splices can be synthesized given the previous state and final state of an
     * array. The basic approach is to calculate the edit distance matrix and
     * choose the shortest path through it.
     *
     * Complexity: O(l * p)
     *   l: The length of the current array
     *   p: The length of the old array
     */
    calcSplices: function(current, currentStart, currentEnd,
                          old, oldStart, oldEnd) {
      var prefixCount = 0;
      var suffixCount = 0;

      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
      if (currentStart == 0 && oldStart == 0)
        prefixCount = this.sharedPrefix(current, old, minLength);

      if (currentEnd == current.length && oldEnd == old.length)
        suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);

      currentStart += prefixCount;
      oldStart += prefixCount;
      currentEnd -= suffixCount;
      oldEnd -= suffixCount;

      if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)
        return [];

      if (currentStart == currentEnd) {
        var splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd)
          splice.removed.push(old[oldStart++]);

        return [ splice ];
      } else if (oldStart == oldEnd)
        return [ newSplice(currentStart, [], currentEnd - currentStart) ];

      var ops = this.spliceOperationsFromEditDistances(
          this.calcEditDistances(current, currentStart, currentEnd,
                                 old, oldStart, oldEnd));

      var splice = undefined;
      var splices = [];
      var index = currentStart;
      var oldIndex = oldStart;
      for (var i = 0; i < ops.length; i++) {
        switch(ops[i]) {
          case EDIT_LEAVE:
            if (splice) {
              splices.push(splice);
              splice = undefined;
            }

            index++;
            oldIndex++;
            break;
          case EDIT_UPDATE:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
          case EDIT_ADD:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;
            break;
          case EDIT_DELETE:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
        }
      }

      if (splice) {
        splices.push(splice);
      }
      return splices;
    },

    sharedPrefix: function(current, old, searchLength) {
      for (var i = 0; i < searchLength; i++)
        if (!this.equals(current[i], old[i]))
          return i;
      return searchLength;
    },

    sharedSuffix: function(current, old, searchLength) {
      var index1 = current.length;
      var index2 = old.length;
      var count = 0;
      while (count < searchLength && this.equals(current[--index1], old[--index2]))
        count++;

      return count;
    },

    calculateSplices: function(current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0,
                              previous.length);
    },

    equals: function(currentValue, previousValue) {
      return currentValue === previousValue;
    }
  };

  var arraySplice = new ArraySplice();

  function calcSplices(current, currentStart, currentEnd,
                       old, oldStart, oldEnd) {
    return arraySplice.calcSplices(current, currentStart, currentEnd,
                                   old, oldStart, oldEnd);
  }

  function intersect(start1, end1, start2, end2) {
    // Disjoint
    if (end1 < start2 || end2 < start1)
      return -1;

    // Adjacent
    if (end1 == start2 || end2 == start1)
      return 0;

    // Non-zero intersect, span1 first
    if (start1 < start2) {
      if (end1 < end2)
        return end1 - start2; // Overlap
      else
        return end2 - start2; // Contained
    } else {
      // Non-zero intersect, span2 first
      if (end2 < end1)
        return end2 - start1; // Overlap
      else
        return end1 - start1; // Contained
    }
  }

  function mergeSplice(splices, index, removed, addedCount) {

    var splice = newSplice(index, removed, addedCount);

    var inserted = false;
    var insertionOffset = 0;

    for (var i = 0; i < splices.length; i++) {
      var current = splices[i];
      current.index += insertionOffset;

      if (inserted)
        continue;

      var intersectCount = intersect(splice.index,
                                     splice.index + splice.removed.length,
                                     current.index,
                                     current.index + current.addedCount);

      if (intersectCount >= 0) {
        // Merge the two splices

        splices.splice(i, 1);
        i--;

        insertionOffset -= current.addedCount - current.removed.length;

        splice.addedCount += current.addedCount - intersectCount;
        var deleteCount = splice.removed.length +
                          current.removed.length - intersectCount;

        if (!splice.addedCount && !deleteCount) {
          // merged splice is a noop. discard.
          inserted = true;
        } else {
          var removed = current.removed;

          if (splice.index < current.index) {
            // some prefix of splice.removed is prepended to current.removed.
            var prepend = splice.removed.slice(0, current.index - splice.index);
            Array.prototype.push.apply(prepend, removed);
            removed = prepend;
          }

          if (splice.index + splice.removed.length > current.index + current.addedCount) {
            // some suffix of splice.removed is appended to current.removed.
            var append = splice.removed.slice(current.index + current.addedCount - splice.index);
            Array.prototype.push.apply(removed, append);
          }

          splice.removed = removed;
          if (current.index < splice.index) {
            splice.index = current.index;
          }
        }
      } else if (splice.index < current.index) {
        // Insert splice here.

        inserted = true;

        splices.splice(i, 0, splice);
        i++;

        var offset = splice.addedCount - splice.removed.length
        current.index += offset;
        insertionOffset += offset;
      }
    }

    if (!inserted)
      splices.push(splice);
  }

  function createInitialSplices(array, changeRecords) {
    var splices = [];

    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      switch(record.type) {
        case 'splice':
          mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
          break;
        case 'add':
        case 'update':
        case 'delete':
          if (!isIndex(record.name))
            continue;
          var index = toNumber(record.name);
          if (index < 0)
            continue;
          mergeSplice(splices, index, [record.oldValue], 1);
          break;
        default:
          console.error('Unexpected record type: ' + JSON.stringify(record));
          break;
      }
    }

    return splices;
  }

  function projectArraySplices(array, changeRecords) {
    var splices = [];

    createInitialSplices(array, changeRecords).forEach(function(splice) {
      if (splice.addedCount == 1 && splice.removed.length == 1) {
        if (splice.removed[0] !== array[splice.index])
          splices.push(splice);

        return
      };

      splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount,
                                           splice.removed, 0, splice.removed.length));
    });

    return splices;
  }

  // Export the observe-js object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, export as a global object.

  var expose = global;

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      expose = exports = module.exports;
    }
    expose = exports;
  } 

  expose.Observer = Observer;
  expose.Observer.runEOM_ = runEOM;
  expose.Observer.observerSentinel_ = observerSentinel; // for testing.
  expose.Observer.hasObjectObserve = hasObserve;
  expose.ArrayObserver = ArrayObserver;
  expose.ArrayObserver.calculateSplices = function(current, previous) {
    return arraySplice.calculateSplices(current, previous);
  };

  expose.ArraySplice = ArraySplice;
  expose.ObjectObserver = ObjectObserver;
  expose.PathObserver = PathObserver;
  expose.CompoundObserver = CompoundObserver;
  expose.Path = Path;
  expose.ObserverTransform = ObserverTransform;
  
})(typeof global !== 'undefined' && global && typeof module !== 'undefined' && module ? global : this || window);

// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
// This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
// The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also
// subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt

(function(global) {
  'use strict';

  var filter = Array.prototype.filter.call.bind(Array.prototype.filter);

  function getTreeScope(node) {
    while (node.parentNode) {
      node = node.parentNode;
    }

    return typeof node.getElementById === 'function' ? node : null;
  }

  Node.prototype.bind = function(name, observable) {
    console.error('Unhandled binding to Node: ', this, name, observable);
  };

  Node.prototype.bindFinished = function() {};

  function updateBindings(node, name, binding) {
    var bindings = node.bindings_;
    if (!bindings)
      bindings = node.bindings_ = {};

    if (bindings[name])
      binding[name].close();

    return bindings[name] = binding;
  }

  function returnBinding(node, name, binding) {
    return binding;
  }

  function sanitizeValue(value) {
    return value == null ? '' : value;
  }

  function updateText(node, value) {
    node.data = sanitizeValue(value);
  }

  function textBinding(node) {
    return function(value) {
      return updateText(node, value);
    };
  }

  var maybeUpdateBindings = returnBinding;

  Object.defineProperty(Platform, 'enableBindingsReflection', {
    get: function() {
      return maybeUpdateBindings === updateBindings;
    },
    set: function(enable) {
      maybeUpdateBindings = enable ? updateBindings : returnBinding;
      return enable;
    },
    configurable: true
  });

  Text.prototype.bind = function(name, value, oneTime) {
    if (name !== 'textContent')
      return Node.prototype.bind.call(this, name, value, oneTime);

    if (oneTime)
      return updateText(this, value);

    var observable = value;
    updateText(this, observable.open(textBinding(this)));
    return maybeUpdateBindings(this, name, observable);
  }

  function updateAttribute(el, name, conditional, value) {
    if (conditional) {
      if (value)
        el.setAttribute(name, '');
      else
        el.removeAttribute(name);
      return;
    }

    el.setAttribute(name, sanitizeValue(value));
  }

  function attributeBinding(el, name, conditional) {
    return function(value) {
      updateAttribute(el, name, conditional, value);
    };
  }

  Element.prototype.bind = function(name, value, oneTime) {
    var conditional = name[name.length - 1] == '?';
    if (conditional) {
      this.removeAttribute(name);
      name = name.slice(0, -1);
    }

    if (oneTime)
      return updateAttribute(this, name, conditional, value);


    var observable = value;
    updateAttribute(this, name, conditional,
        observable.open(attributeBinding(this, name, conditional)));

    return maybeUpdateBindings(this, name, observable);
  };

  var checkboxEventType;
  (function() {
    // Attempt to feature-detect which event (change or click) is fired first
    // for checkboxes.
    var div = document.createElement('div');
    var checkbox = div.appendChild(document.createElement('input'));
    checkbox.setAttribute('type', 'checkbox');
    var first;
    var count = 0;
    checkbox.addEventListener('click', function(e) {
      count++;
      first = first || 'click';
    });
    checkbox.addEventListener('change', function() {
      count++;
      first = first || 'change';
    });

    var event = document.createEvent('MouseEvent');
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false,
        false, false, false, 0, null);
    checkbox.dispatchEvent(event);
    // WebKit/Blink don't fire the change event if the element is outside the
    // document, so assume 'change' for that case.
    checkboxEventType = count == 1 ? 'change' : first;
  })();

  function getEventForInputType(element) {
    switch (element.type) {
      case 'checkbox':
        return checkboxEventType;
      case 'radio':
      case 'select-multiple':
      case 'select-one':
        return 'change';
      case 'range':
        if (/Trident|MSIE/.test(navigator.userAgent))
          return 'change';
      default:
        return 'input';
    }
  }

  function updateInput(input, property, value, santizeFn) {
    input[property] = (santizeFn || sanitizeValue)(value);
  }

  function inputBinding(input, property, santizeFn) {
    return function(value) {
      return updateInput(input, property, value, santizeFn);
    }
  }

  function noop() {}

  function bindInputEvent(input, property, observable, postEventFn) {
    var eventType = getEventForInputType(input);

    function eventHandler() {
      observable.setValue(input[property]);
      observable.discardChanges();
      (postEventFn || noop)(input);
      Platform.performMicrotaskCheckpoint();
    }
    input.addEventListener(eventType, eventHandler);

    return {
      close: function() {
        input.removeEventListener(eventType, eventHandler);
        observable.close();
      },

      observable_: observable
    }
  }

  function booleanSanitize(value) {
    return Boolean(value);
  }

  // |element| is assumed to be an HTMLInputElement with |type| == 'radio'.
  // Returns an array containing all radio buttons other than |element| that
  // have the same |name|, either in the form that |element| belongs to or,
  // if no form, in the document tree to which |element| belongs.
  //
  // This implementation is based upon the HTML spec definition of a
  // "radio button group":
  //   http://www.whatwg.org/specs/web-apps/current-work/multipage/number-state.html#radio-button-group
  //
  function getAssociatedRadioButtons(element) {
    if (element.form) {
      return filter(element.form.elements, function(el) {
        return el != element &&
            el.tagName == 'INPUT' &&
            el.type == 'radio' &&
            el.name == element.name;
      });
    } else {
      var treeScope = getTreeScope(element);
      if (!treeScope)
        return [];
      var radios = treeScope.querySelectorAll(
          'input[type="radio"][name="' + element.name + '"]');
      return filter(radios, function(el) {
        return el != element && !el.form;
      });
    }
  }

  function checkedPostEvent(input) {
    // Only the radio button that is getting checked gets an event. We
    // therefore find all the associated radio buttons and update their
    // check binding manually.
    if (input.tagName === 'INPUT' &&
        input.type === 'radio') {
      getAssociatedRadioButtons(input).forEach(function(radio) {
        var checkedBinding = radio.bindings_.checked;
        if (checkedBinding) {
          // Set the value directly to avoid an infinite call stack.
          checkedBinding.observable_.setValue(false);
        }
      });
    }
  }

  HTMLInputElement.prototype.bind = function(name, value, oneTime) {
    if (name !== 'value' && name !== 'checked')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute(name);
    var sanitizeFn = name == 'checked' ? booleanSanitize : sanitizeValue;
    var postEventFn = name == 'checked' ? checkedPostEvent : noop;

    if (oneTime)
      return updateInput(this, name, value, sanitizeFn);


    var observable = value;
    var binding = bindInputEvent(this, name, observable, postEventFn);
    updateInput(this, name,
                observable.open(inputBinding(this, name, sanitizeFn)),
                sanitizeFn);

    // Checkboxes may need to update bindings of other checkboxes.
    return updateBindings(this, name, binding);
  }

  HTMLTextAreaElement.prototype.bind = function(name, value, oneTime) {
    if (name !== 'value')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute('value');

    if (oneTime)
      return updateInput(this, 'value', value);

    var observable = value;
    var binding = bindInputEvent(this, 'value', observable);
    updateInput(this, 'value',
                observable.open(inputBinding(this, 'value', sanitizeValue)));
    return maybeUpdateBindings(this, name, binding);
  }

  function updateOption(option, value) {
    var parentNode = option.parentNode;;
    var select;
    var selectBinding;
    var oldValue;
    if (parentNode instanceof HTMLSelectElement &&
        parentNode.bindings_ &&
        parentNode.bindings_.value) {
      select = parentNode;
      selectBinding = select.bindings_.value;
      oldValue = select.value;
    }

    option.value = sanitizeValue(value);

    if (select && select.value != oldValue) {
      selectBinding.observable_.setValue(select.value);
      selectBinding.observable_.discardChanges();
      Platform.performMicrotaskCheckpoint();
    }
  }

  function optionBinding(option) {
    return function(value) {
      updateOption(option, value);
    }
  }

  HTMLOptionElement.prototype.bind = function(name, value, oneTime) {
    if (name !== 'value')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute('value');

    if (oneTime)
      return updateOption(this, value);

    var observable = value;
    var binding = bindInputEvent(this, 'value', observable);
    updateOption(this, observable.open(optionBinding(this)));
    return maybeUpdateBindings(this, name, binding);
  }

  HTMLSelectElement.prototype.bind = function(name, value, oneTime) {
    if (name === 'selectedindex')
      name = 'selectedIndex';

    if (name !== 'selectedIndex' && name !== 'value')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute(name);

    if (oneTime)
      return updateInput(this, name, value);

    var observable = value;
    var binding = bindInputEvent(this, name, observable);
    updateInput(this, name,
                observable.open(inputBinding(this, name)));

    // Option update events may need to access select bindings.
    return updateBindings(this, name, binding);
  }
})(this);

// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
// This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
// The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also
// subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt

(function(global) {
  'use strict';

  function assert(v) {
    if (!v)
      throw new Error('Assertion failed');
  }

  var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

  function getFragmentRoot(node) {
    var p;
    while (p = node.parentNode) {
      node = p;
    }

    return node;
  }

  function searchRefId(node, id) {
    if (!id)
      return;

    var ref;
    var selector = '#' + id;
    while (!ref) {
      node = getFragmentRoot(node);

      if (node.protoContent_)
        ref = node.protoContent_.querySelector(selector);
      else if (node.getElementById)
        ref = node.getElementById(id);

      if (ref || !node.templateCreator_)
        break

      node = node.templateCreator_;
    }

    return ref;
  }

  function getInstanceRoot(node) {
    while (node.parentNode) {
      node = node.parentNode;
    }
    return node.templateCreator_ ? node : null;
  }

  var Map;
  if (global.Map && typeof global.Map.prototype.forEach === 'function') {
    Map = global.Map;
  } else {
    Map = function() {
      this.keys = [];
      this.values = [];
    };

    Map.prototype = {
      set: function(key, value) {
        var index = this.keys.indexOf(key);
        if (index < 0) {
          this.keys.push(key);
          this.values.push(value);
        } else {
          this.values[index] = value;
        }
      },

      get: function(key) {
        var index = this.keys.indexOf(key);
        if (index < 0)
          return;

        return this.values[index];
      },

      delete: function(key, value) {
        var index = this.keys.indexOf(key);
        if (index < 0)
          return false;

        this.keys.splice(index, 1);
        this.values.splice(index, 1);
        return true;
      },

      forEach: function(f, opt_this) {
        for (var i = 0; i < this.keys.length; i++)
          f.call(opt_this || this, this.values[i], this.keys[i], this);
      }
    };
  }

  // JScript does not have __proto__. We wrap all object literals with
  // createObject which uses Object.create, Object.defineProperty and
  // Object.getOwnPropertyDescriptor to create a new object that does the exact
  // same thing. The main downside to this solution is that we have to extract
  // all those property descriptors for IE.
  var createObject = ('__proto__' in {}) ?
      function(obj) { return obj; } :
      function(obj) {
        var proto = obj.__proto__;
        if (!proto)
          return obj;
        var newObject = Object.create(proto);
        Object.getOwnPropertyNames(obj).forEach(function(name) {
          Object.defineProperty(newObject, name,
                               Object.getOwnPropertyDescriptor(obj, name));
        });
        return newObject;
      };

  // IE does not support have Document.prototype.contains.
  if (typeof document.contains != 'function') {
    Document.prototype.contains = function(node) {
      if (node === this || node.parentNode === this)
        return true;
      return this.documentElement.contains(node);
    }
  }

  var BIND = 'bind';
  var REPEAT = 'repeat';
  var IF = 'if';

  var templateAttributeDirectives = {
    'template': true,
    'repeat': true,
    'bind': true,
    'ref': true,
    'if': true
  };

  var semanticTemplateElements = {
    'THEAD': true,
    'TBODY': true,
    'TFOOT': true,
    'TH': true,
    'TR': true,
    'TD': true,
    'COLGROUP': true,
    'COL': true,
    'CAPTION': true,
    'OPTION': true,
    'OPTGROUP': true
  };

  var hasTemplateElement = typeof HTMLTemplateElement !== 'undefined';
  if (hasTemplateElement) {
    // TODO(rafaelw): Remove when fix for
    // https://codereview.chromium.org/164803002/
    // makes it to Chrome release.
    (function() {
      var t = document.createElement('template');
      var d = t.content.ownerDocument;
      var html = d.appendChild(d.createElement('html'));
      var head = html.appendChild(d.createElement('head'));
      var base = d.createElement('base');
      base.href = document.baseURI;
      head.appendChild(base);
    })();
  }

  var allTemplatesSelectors = 'template, ' +
      Object.keys(semanticTemplateElements).map(function(tagName) {
        return tagName.toLowerCase() + '[template]';
      }).join(', ');

  function isSVGTemplate(el) {
    return el.tagName == 'template' &&
           el.namespaceURI == 'http://www.w3.org/2000/svg';
  }

  function isHTMLTemplate(el) {
    return el.tagName == 'TEMPLATE' &&
           el.namespaceURI == 'http://www.w3.org/1999/xhtml';
  }

  function isAttributeTemplate(el) {
    return Boolean(semanticTemplateElements[el.tagName] &&
                   el.hasAttribute('template'));
  }

  function isTemplate(el) {
    if (el.isTemplate_ === undefined)
      el.isTemplate_ = el.tagName == 'TEMPLATE' || isAttributeTemplate(el);

    return el.isTemplate_;
  }

  // FIXME: Observe templates being added/removed from documents
  // FIXME: Expose imperative API to decorate and observe templates in
  // "disconnected tress" (e.g. ShadowRoot)
  document.addEventListener('DOMContentLoaded', function(e) {
    bootstrapTemplatesRecursivelyFrom(document);
    // FIXME: Is this needed? Seems like it shouldn't be.
    Platform.performMicrotaskCheckpoint();
  }, false);

  function forAllTemplatesFrom(node, fn) {
    var subTemplates = node.querySelectorAll(allTemplatesSelectors);

    if (isTemplate(node))
      fn(node)
    forEach(subTemplates, fn);
  }

  function bootstrapTemplatesRecursivelyFrom(node) {
    function bootstrap(template) {
      if (!HTMLTemplateElement.decorate(template))
        bootstrapTemplatesRecursivelyFrom(template.content);
    }

    forAllTemplatesFrom(node, bootstrap);
  }

  if (!hasTemplateElement) {
    /**
     * This represents a <template> element.
     * @constructor
     * @extends {HTMLElement}
     */
    global.HTMLTemplateElement = function() {
      throw TypeError('Illegal constructor');
    };
  }

  var hasProto = '__proto__' in {};

  function mixin(to, from) {
    Object.getOwnPropertyNames(from).forEach(function(name) {
      Object.defineProperty(to, name,
                            Object.getOwnPropertyDescriptor(from, name));
    });
  }

  // http://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/templates/index.html#dfn-template-contents-owner
  function getOrCreateTemplateContentsOwner(template) {
    var doc = template.ownerDocument
    if (!doc.defaultView)
      return doc;
    var d = doc.templateContentsOwner_;
    if (!d) {
      // TODO(arv): This should either be a Document or HTMLDocument depending
      // on doc.
      d = doc.implementation.createHTMLDocument('');
      while (d.lastChild) {
        d.removeChild(d.lastChild);
      }
      doc.templateContentsOwner_ = d;
    }
    return d;
  }

  function getTemplateStagingDocument(template) {
    if (!template.stagingDocument_) {
      var owner = template.ownerDocument;
      if (!owner.stagingDocument_) {
        owner.stagingDocument_ = owner.implementation.createHTMLDocument('');
        owner.stagingDocument_.isStagingDocument = true;
        // TODO(rafaelw): Remove when fix for
        // https://codereview.chromium.org/164803002/
        // makes it to Chrome release.
        var base = owner.stagingDocument_.createElement('base');
        base.href = document.baseURI;
        owner.stagingDocument_.head.appendChild(base);

        owner.stagingDocument_.stagingDocument_ = owner.stagingDocument_;
      }

      template.stagingDocument_ = owner.stagingDocument_;
    }

    return template.stagingDocument_;
  }

  // For non-template browsers, the parser will disallow <template> in certain
  // locations, so we allow "attribute templates" which combine the template
  // element with the top-level container node of the content, e.g.
  //
  //   <tr template repeat="{{ foo }}"" class="bar"><td>Bar</td></tr>
  //
  // becomes
  //
  //   <template repeat="{{ foo }}">
  //   + #document-fragment
  //     + <tr class="bar">
  //       + <td>Bar</td>
  //
  function extractTemplateFromAttributeTemplate(el) {
    var template = el.ownerDocument.createElement('template');
    el.parentNode.insertBefore(template, el);

    var attribs = el.attributes;
    var count = attribs.length;
    while (count-- > 0) {
      var attrib = attribs[count];
      if (templateAttributeDirectives[attrib.name]) {
        if (attrib.name !== 'template')
          template.setAttribute(attrib.name, attrib.value);
        el.removeAttribute(attrib.name);
      }
    }

    return template;
  }

  function extractTemplateFromSVGTemplate(el) {
    var template = el.ownerDocument.createElement('template');
    el.parentNode.insertBefore(template, el);

    var attribs = el.attributes;
    var count = attribs.length;
    while (count-- > 0) {
      var attrib = attribs[count];
      template.setAttribute(attrib.name, attrib.value);
      el.removeAttribute(attrib.name);
    }

    el.parentNode.removeChild(el);
    return template;
  }

  function liftNonNativeTemplateChildrenIntoContent(template, el, useRoot) {
    var content = template.content;
    if (useRoot) {
      content.appendChild(el);
      return;
    }

    var child;
    while (child = el.firstChild) {
      content.appendChild(child);
    }
  }

  var templateObserver;
  if (typeof MutationObserver == 'function') {
    templateObserver = new MutationObserver(function(records) {
      for (var i = 0; i < records.length; i++) {
        records[i].target.refChanged_();
      }
    });
  }

  /**
   * Ensures proper API and content model for template elements.
   * @param {HTMLTemplateElement} opt_instanceRef The template element which
   *     |el| template element will return as the value of its ref(), and whose
   *     content will be used as source when createInstance() is invoked.
   */
  HTMLTemplateElement.decorate = function(el, opt_instanceRef) {
    if (el.templateIsDecorated_)
      return false;

    var templateElement = el;
    templateElement.templateIsDecorated_ = true;

    var isNativeHTMLTemplate = isHTMLTemplate(templateElement) &&
                               hasTemplateElement;
    var bootstrapContents = isNativeHTMLTemplate;
    var liftContents = !isNativeHTMLTemplate;
    var liftRoot = false;

    if (!isNativeHTMLTemplate) {
      if (isAttributeTemplate(templateElement)) {
        assert(!opt_instanceRef);
        templateElement = extractTemplateFromAttributeTemplate(el);
        templateElement.templateIsDecorated_ = true;
        isNativeHTMLTemplate = hasTemplateElement;
        liftRoot = true;
      } else if (isSVGTemplate(templateElement)) {
        templateElement = extractTemplateFromSVGTemplate(el);
        templateElement.templateIsDecorated_ = true;
        isNativeHTMLTemplate = hasTemplateElement;
      }
    }

    if (!isNativeHTMLTemplate) {
      fixTemplateElementPrototype(templateElement);
      var doc = getOrCreateTemplateContentsOwner(templateElement);
      templateElement.content_ = doc.createDocumentFragment();
    }

    if (opt_instanceRef) {
      // template is contained within an instance, its direct content must be
      // empty
      templateElement.instanceRef_ = opt_instanceRef;
    } else if (liftContents) {
      liftNonNativeTemplateChildrenIntoContent(templateElement,
                                               el,
                                               liftRoot);
    } else if (bootstrapContents) {
      bootstrapTemplatesRecursivelyFrom(templateElement.content);
    }

    return true;
  };

  // TODO(rafaelw): This used to decorate recursively all templates from a given
  // node. This happens by default on 'DOMContentLoaded', but may be needed
  // in subtrees not descendent from document (e.g. ShadowRoot).
  // Review whether this is the right public API.
  HTMLTemplateElement.bootstrap = bootstrapTemplatesRecursivelyFrom;

  var htmlElement = global.HTMLUnknownElement || HTMLElement;

  var contentDescriptor = {
    get: function() {
      return this.content_;
    },
    enumerable: true,
    configurable: true
  };

  if (!hasTemplateElement) {
    // Gecko is more picky with the prototype than WebKit. Make sure to use the
    // same prototype as created in the constructor.
    HTMLTemplateElement.prototype = Object.create(htmlElement.prototype);

    Object.defineProperty(HTMLTemplateElement.prototype, 'content',
                          contentDescriptor);
  }

  function fixTemplateElementPrototype(el) {
    if (hasProto)
      el.__proto__ = HTMLTemplateElement.prototype;
    else
      mixin(el, HTMLTemplateElement.prototype);
  }

  function ensureSetModelScheduled(template) {
    if (!template.setModelFn_) {
      template.setModelFn_ = function() {
        template.setModelFnScheduled_ = false;
        var map = getBindings(template,
            template.delegate_ && template.delegate_.prepareBinding);
        processBindings(template, map, template.model_);
      };
    }

    if (!template.setModelFnScheduled_) {
      template.setModelFnScheduled_ = true;
      Observer.runEOM_(template.setModelFn_);
    }
  }

  mixin(HTMLTemplateElement.prototype, {
    bind: function(name, value, oneTime) {
      if (name != 'ref')
        return Element.prototype.bind.call(this, name, value, oneTime);

      var self = this;
      var ref = oneTime ? value : value.open(function(ref) {
        self.setAttribute('ref', ref);
        self.refChanged_();
      });

      this.setAttribute('ref', ref);
      this.refChanged_();
      if (oneTime)
        return;

      if (!this.bindings_) {
        this.bindings_ = { ref: value };
      } else {
        this.bindings_.ref = value;
      }

      return value;
    },

    processBindingDirectives_: function(directives) {
      if (this.iterator_)
        this.iterator_.closeDeps();

      if (!directives.if && !directives.bind && !directives.repeat) {
        if (this.iterator_) {
          this.iterator_.close();
          this.iterator_ = undefined;
        }

        return;
      }

      if (!this.iterator_) {
        this.iterator_ = new TemplateIterator(this);
      }

      this.iterator_.updateDependencies(directives, this.model_);

      if (templateObserver) {
        templateObserver.observe(this, { attributes: true,
                                         attributeFilter: ['ref'] });
      }

      return this.iterator_;
    },

    createInstance: function(model, bindingDelegate, delegate_) {
      if (bindingDelegate)
        delegate_ = this.newDelegate_(bindingDelegate);
      else if (!delegate_)
        delegate_ = this.delegate_;

      if (!this.refContent_)
        this.refContent_ = this.ref_.content;
      var content = this.refContent_;
      if (content.firstChild === null)
        return emptyInstance;

      var map = getInstanceBindingMap(content, delegate_);
      var stagingDocument = getTemplateStagingDocument(this);
      var instance = stagingDocument.createDocumentFragment();
      instance.templateCreator_ = this;
      instance.protoContent_ = content;
      instance.bindings_ = [];
      instance.terminator_ = null;
      var instanceRecord = instance.templateInstance_ = {
        firstNode: null,
        lastNode: null,
        model: model
      };

      var i = 0;
      var collectTerminator = false;
      for (var child = content.firstChild; child; child = child.nextSibling) {
        // The terminator of the instance is the clone of the last child of the
        // content. If the last child is an active template, it may produce
        // instances as a result of production, so simply collecting the last
        // child of the instance after it has finished producing may be wrong.
        if (child.nextSibling === null)
          collectTerminator = true;

        var clone = cloneAndBindInstance(child, instance, stagingDocument,
                                         map.children[i++],
                                         model,
                                         delegate_,
                                         instance.bindings_);
        clone.templateInstance_ = instanceRecord;
        if (collectTerminator)
          instance.terminator_ = clone;
      }

      instanceRecord.firstNode = instance.firstChild;
      instanceRecord.lastNode = instance.lastChild;
      instance.templateCreator_ = undefined;
      instance.protoContent_ = undefined;
      return instance;
    },

    get model() {
      return this.model_;
    },

    set model(model) {
      this.model_ = model;
      ensureSetModelScheduled(this);
    },

    get bindingDelegate() {
      return this.delegate_ && this.delegate_.raw;
    },

    refChanged_: function() {
      if (!this.iterator_ || this.refContent_ === this.ref_.content)
        return;

      this.refContent_ = undefined;
      this.iterator_.valueChanged();
      this.iterator_.updateIteratedValue(this.iterator_.getUpdatedValue());
    },

    clear: function() {
      this.model_ = undefined;
      this.delegate_ = undefined;
      if (this.bindings_ && this.bindings_.ref)
        this.bindings_.ref.close()
      this.refContent_ = undefined;
      if (!this.iterator_)
        return;
      this.iterator_.valueChanged();
      this.iterator_.close()
      this.iterator_ = undefined;
    },

    setDelegate_: function(delegate) {
      this.delegate_ = delegate;
      this.bindingMap_ = undefined;
      if (this.iterator_) {
        this.iterator_.instancePositionChangedFn_ = undefined;
        this.iterator_.instanceModelFn_ = undefined;
      }
    },

    newDelegate_: function(bindingDelegate) {
      if (!bindingDelegate)
        return;

      function delegateFn(name) {
        var fn = bindingDelegate && bindingDelegate[name];
        if (typeof fn != 'function')
          return;

        return function() {
          return fn.apply(bindingDelegate, arguments);
        };
      }

      return {
        bindingMaps: {},
        raw: bindingDelegate,
        prepareBinding: delegateFn('prepareBinding'),
        prepareInstanceModel: delegateFn('prepareInstanceModel'),
        prepareInstancePositionChanged:
            delegateFn('prepareInstancePositionChanged')
      };
    },

    set bindingDelegate(bindingDelegate) {
      if (this.delegate_) {
        throw Error('Template must be cleared before a new bindingDelegate ' +
                    'can be assigned');
      }

      this.setDelegate_(this.newDelegate_(bindingDelegate));
    },

    get ref_() {
      var ref = searchRefId(this, this.getAttribute('ref'));
      if (!ref)
        ref = this.instanceRef_;

      if (!ref)
        return this;

      var nextRef = ref.ref_;
      return nextRef ? nextRef : ref;
    }
  });

  // Returns
  //   a) undefined if there are no mustaches.
  //   b) [TEXT, (ONE_TIME?, PATH, DELEGATE_FN, TEXT)+] if there is at least one mustache.
  function parseMustaches(s, name, node, prepareBindingFn) {
    if (!s || !s.length)
      return;

    var tokens;
    var length = s.length;
    var startIndex = 0, lastIndex = 0, endIndex = 0;
    var onlyOneTime = true;
    while (lastIndex < length) {
      var startIndex = s.indexOf('{{', lastIndex);
      var oneTimeStart = s.indexOf('[[', lastIndex);
      var oneTime = false;
      var terminator = '}}';

      if (oneTimeStart >= 0 &&
          (startIndex < 0 || oneTimeStart < startIndex)) {
        startIndex = oneTimeStart;
        oneTime = true;
        terminator = ']]';
      }

      endIndex = startIndex < 0 ? -1 : s.indexOf(terminator, startIndex + 2);

      if (endIndex < 0) {
        if (!tokens)
          return;

        tokens.push(s.slice(lastIndex)); // TEXT
        break;
      }

      tokens = tokens || [];
      tokens.push(s.slice(lastIndex, startIndex)); // TEXT
      var pathString = s.slice(startIndex + 2, endIndex).trim();
      tokens.push(oneTime); // ONE_TIME?
      onlyOneTime = onlyOneTime && oneTime;
      var delegateFn = prepareBindingFn &&
                       prepareBindingFn(pathString, name, node);
      // Don't try to parse the expression if there's a prepareBinding function
      if (delegateFn == null) {
        tokens.push(Path.get(pathString)); // PATH
      } else {
        tokens.push(null);
      }
      tokens.push(delegateFn); // DELEGATE_FN
      lastIndex = endIndex + 2;
    }

    if (lastIndex === length)
      tokens.push(''); // TEXT

    tokens.hasOnePath = tokens.length === 5;
    tokens.isSimplePath = tokens.hasOnePath &&
                          tokens[0] == '' &&
                          tokens[4] == '';
    tokens.onlyOneTime = onlyOneTime;

    tokens.combinator = function(values) {
      var newValue = tokens[0];

      for (var i = 1; i < tokens.length; i += 4) {
        var value = tokens.hasOnePath ? values : values[(i - 1) / 4];
        if (value !== undefined)
          newValue += value;
        newValue += tokens[i + 3];
      }

      return newValue;
    }

    return tokens;
  };

  function processOneTimeBinding(name, tokens, node, model) {
    if (tokens.hasOnePath) {
      var delegateFn = tokens[3];
      var value = delegateFn ? delegateFn(model, node, true) :
                               tokens[2].getValueFrom(model);
      return tokens.isSimplePath ? value : tokens.combinator(value);
    }

    var values = [];
    for (var i = 1; i < tokens.length; i += 4) {
      var delegateFn = tokens[i + 2];
      values[(i - 1) / 4] = delegateFn ? delegateFn(model, node) :
          tokens[i + 1].getValueFrom(model);
    }

    return tokens.combinator(values);
  }

  function processSinglePathBinding(name, tokens, node, model) {
    var delegateFn = tokens[3];
    var observer = delegateFn ? delegateFn(model, node, false) :
        new PathObserver(model, tokens[2]);

    return tokens.isSimplePath ? observer :
        new ObserverTransform(observer, tokens.combinator);
  }

  function processBinding(name, tokens, node, model) {
    if (tokens.onlyOneTime)
      return processOneTimeBinding(name, tokens, node, model);

    if (tokens.hasOnePath)
      return processSinglePathBinding(name, tokens, node, model);

    var observer = new CompoundObserver();

    for (var i = 1; i < tokens.length; i += 4) {
      var oneTime = tokens[i];
      var delegateFn = tokens[i + 2];

      if (delegateFn) {
        var value = delegateFn(model, node, oneTime);
        if (oneTime)
          observer.addPath(value)
        else
          observer.addObserver(value);
        continue;
      }

      var path = tokens[i + 1];
      if (oneTime)
        observer.addPath(path.getValueFrom(model))
      else
        observer.addPath(model, path);
    }

    return new ObserverTransform(observer, tokens.combinator);
  }

  function processBindings(node, bindings, model, instanceBindings) {
    for (var i = 0; i < bindings.length; i += 2) {
      var name = bindings[i]
      var tokens = bindings[i + 1];
      var value = processBinding(name, tokens, node, model);
      var binding = node.bind(name, value, tokens.onlyOneTime);
      if (binding && instanceBindings)
        instanceBindings.push(binding);
    }

    node.bindFinished();
    if (!bindings.isTemplate)
      return;

    node.model_ = model;
    var iter = node.processBindingDirectives_(bindings);
    if (instanceBindings && iter)
      instanceBindings.push(iter);
  }

  function parseWithDefault(el, name, prepareBindingFn) {
    var v = el.getAttribute(name);
    return parseMustaches(v == '' ? '{{}}' : v, name, el, prepareBindingFn);
  }

  function parseAttributeBindings(element, prepareBindingFn) {
    assert(element);

    var bindings = [];
    var ifFound = false;
    var bindFound = false;

    for (var i = 0; i < element.attributes.length; i++) {
      var attr = element.attributes[i];
      var name = attr.name;
      var value = attr.value;

      // Allow bindings expressed in attributes to be prefixed with underbars.
      // We do this to allow correct semantics for browsers that don't implement
      // <template> where certain attributes might trigger side-effects -- and
      // for IE which sanitizes certain attributes, disallowing mustache
      // replacements in their text.
      while (name[0] === '_') {
        name = name.substring(1);
      }

      if (isTemplate(element) &&
          (name === IF || name === BIND || name === REPEAT)) {
        continue;
      }

      var tokens = parseMustaches(value, name, element,
                                  prepareBindingFn);
      if (!tokens)
        continue;

      bindings.push(name, tokens);
    }

    if (isTemplate(element)) {
      bindings.isTemplate = true;
      bindings.if = parseWithDefault(element, IF, prepareBindingFn);
      bindings.bind = parseWithDefault(element, BIND, prepareBindingFn);
      bindings.repeat = parseWithDefault(element, REPEAT, prepareBindingFn);

      if (bindings.if && !bindings.bind && !bindings.repeat)
        bindings.bind = parseMustaches('{{}}', BIND, element, prepareBindingFn);
    }

    return bindings;
  }

  function getBindings(node, prepareBindingFn) {
    if (node.nodeType === Node.ELEMENT_NODE)
      return parseAttributeBindings(node, prepareBindingFn);

    if (node.nodeType === Node.TEXT_NODE) {
      var tokens = parseMustaches(node.data, 'textContent', node,
                                  prepareBindingFn);
      if (tokens)
        return ['textContent', tokens];
    }

    return [];
  }

  function cloneAndBindInstance(node, parent, stagingDocument, bindings, model,
                                delegate,
                                instanceBindings,
                                instanceRecord) {
    var clone = parent.appendChild(stagingDocument.importNode(node, false));

    var i = 0;
    for (var child = node.firstChild; child; child = child.nextSibling) {
      cloneAndBindInstance(child, clone, stagingDocument,
                            bindings.children[i++],
                            model,
                            delegate,
                            instanceBindings);
    }

    if (bindings.isTemplate) {
      HTMLTemplateElement.decorate(clone, node);
      if (delegate)
        clone.setDelegate_(delegate);
    }

    processBindings(clone, bindings, model, instanceBindings);
    return clone;
  }

  function createInstanceBindingMap(node, prepareBindingFn) {
    var map = getBindings(node, prepareBindingFn);
    map.children = {};
    var index = 0;
    for (var child = node.firstChild; child; child = child.nextSibling) {
      map.children[index++] = createInstanceBindingMap(child, prepareBindingFn);
    }

    return map;
  }

  var contentUidCounter = 1;

  // TODO(rafaelw): Setup a MutationObserver on content which clears the id
  // so that bindingMaps regenerate when the template.content changes.
  function getContentUid(content) {
    var id = content.id_;
    if (!id)
      id = content.id_ = contentUidCounter++;
    return id;
  }

  // Each delegate is associated with a set of bindingMaps, one for each
  // content which may be used by a template. The intent is that each binding
  // delegate gets the opportunity to prepare the instance (via the prepare*
  // delegate calls) once across all uses.
  // TODO(rafaelw): Separate out the parse map from the binding map. In the
  // current implementation, if two delegates need a binding map for the same
  // content, the second will have to reparse.
  function getInstanceBindingMap(content, delegate_) {
    var contentId = getContentUid(content);
    if (delegate_) {
      var map = delegate_.bindingMaps[contentId];
      if (!map) {
        map = delegate_.bindingMaps[contentId] =
            createInstanceBindingMap(content, delegate_.prepareBinding) || [];
      }
      return map;
    }

    var map = content.bindingMap_;
    if (!map) {
      map = content.bindingMap_ =
          createInstanceBindingMap(content, undefined) || [];
    }
    return map;
  }

  Object.defineProperty(Node.prototype, 'templateInstance', {
    get: function() {
      var instance = this.templateInstance_;
      return instance ? instance :
          (this.parentNode ? this.parentNode.templateInstance : undefined);
    }
  });

  var emptyInstance = document.createDocumentFragment();
  emptyInstance.bindings_ = [];
  emptyInstance.terminator_ = null;

  function TemplateIterator(templateElement) {
    this.closed = false;
    this.templateElement_ = templateElement;
    this.instances = [];
    this.deps = undefined;
    this.iteratedValue = [];
    this.presentValue = undefined;
    this.arrayObserver = undefined;
  }

  TemplateIterator.prototype = {
    closeDeps: function() {
      var deps = this.deps;
      if (deps) {
        if (deps.ifOneTime === false)
          deps.ifValue.close();
        if (deps.oneTime === false)
          deps.value.close();
      }
    },

    updateDependencies: function(directives, model) {
      this.closeDeps();

      var deps = this.deps = {};
      var template = this.templateElement_;

      var ifValue = true;
      if (directives.if) {
        deps.hasIf = true;
        deps.ifOneTime = directives.if.onlyOneTime;
        deps.ifValue = processBinding(IF, directives.if, template, model);

        ifValue = deps.ifValue;

        // oneTime if & predicate is false. nothing else to do.
        if (deps.ifOneTime && !ifValue) {
          this.valueChanged();
          return;
        }

        if (!deps.ifOneTime)
          ifValue = ifValue.open(this.updateIfValue, this);
      }

      if (directives.repeat) {
        deps.repeat = true;
        deps.oneTime = directives.repeat.onlyOneTime;
        deps.value = processBinding(REPEAT, directives.repeat, template, model);
      } else {
        deps.repeat = false;
        deps.oneTime = directives.bind.onlyOneTime;
        deps.value = processBinding(BIND, directives.bind, template, model);
      }

      var value = deps.value;
      if (!deps.oneTime)
        value = value.open(this.updateIteratedValue, this);

      if (!ifValue) {
        this.valueChanged();
        return;
      }

      this.updateValue(value);
    },

    /**
     * Gets the updated value of the bind/repeat. This can potentially call
     * user code (if a bindingDelegate is set up) so we try to avoid it if we
     * already have the value in hand (from Observer.open).
     */
    getUpdatedValue: function() {
      var value = this.deps.value;
      if (!this.deps.oneTime)
        value = value.discardChanges();
      return value;
    },

    updateIfValue: function(ifValue) {
      if (!ifValue) {
        this.valueChanged();
        return;
      }

      this.updateValue(this.getUpdatedValue());
    },

    updateIteratedValue: function(value) {
      if (this.deps.hasIf) {
        var ifValue = this.deps.ifValue;
        if (!this.deps.ifOneTime)
          ifValue = ifValue.discardChanges();
        if (!ifValue) {
          this.valueChanged();
          return;
        }
      }

      this.updateValue(value);
    },

    updateValue: function(value) {
      if (!this.deps.repeat)
        value = [value];
      var observe = this.deps.repeat &&
                    !this.deps.oneTime &&
                    Array.isArray(value);
      this.valueChanged(value, observe);
    },

    valueChanged: function(value, observeValue) {
      if (!Array.isArray(value))
        value = [];

      if (value === this.iteratedValue)
        return;

      this.unobserve();
      this.presentValue = value;
      if (observeValue) {
        this.arrayObserver = new ArrayObserver(this.presentValue);
        this.arrayObserver.open(this.handleSplices, this);
      }

      this.handleSplices(ArrayObserver.calculateSplices(this.presentValue,
                                                        this.iteratedValue));
    },

    getLastInstanceNode: function(index) {
      if (index == -1)
        return this.templateElement_;
      var instance = this.instances[index];
      var terminator = instance.terminator_;
      if (!terminator)
        return this.getLastInstanceNode(index - 1);

      if (terminator.nodeType !== Node.ELEMENT_NODE ||
          this.templateElement_ === terminator) {
        return terminator;
      }

      var subtemplateIterator = terminator.iterator_;
      if (!subtemplateIterator)
        return terminator;

      return subtemplateIterator.getLastTemplateNode();
    },

    getLastTemplateNode: function() {
      return this.getLastInstanceNode(this.instances.length - 1);
    },

    insertInstanceAt: function(index, fragment) {
      var previousInstanceLast = this.getLastInstanceNode(index - 1);
      var parent = this.templateElement_.parentNode;
      this.instances.splice(index, 0, fragment);

      parent.insertBefore(fragment, previousInstanceLast.nextSibling);
    },

    extractInstanceAt: function(index) {
      var previousInstanceLast = this.getLastInstanceNode(index - 1);
      var lastNode = this.getLastInstanceNode(index);
      var parent = this.templateElement_.parentNode;
      var instance = this.instances.splice(index, 1)[0];

      while (lastNode !== previousInstanceLast) {
        var node = previousInstanceLast.nextSibling;
        if (node == lastNode)
          lastNode = previousInstanceLast;

        instance.appendChild(parent.removeChild(node));
      }

      return instance;
    },

    getDelegateFn: function(fn) {
      fn = fn && fn(this.templateElement_);
      return typeof fn === 'function' ? fn : null;
    },

    handleSplices: function(splices) {
      if (this.closed || !splices.length)
        return;

      var template = this.templateElement_;

      if (!template.parentNode) {
        this.close();
        return;
      }

      ArrayObserver.applySplices(this.iteratedValue, this.presentValue,
                                 splices);

      var delegate = template.delegate_;
      if (this.instanceModelFn_ === undefined) {
        this.instanceModelFn_ =
            this.getDelegateFn(delegate && delegate.prepareInstanceModel);
      }

      if (this.instancePositionChangedFn_ === undefined) {
        this.instancePositionChangedFn_ =
            this.getDelegateFn(delegate &&
                               delegate.prepareInstancePositionChanged);
      }

      // Instance Removals
      var instanceCache = new Map;
      var removeDelta = 0;
      for (var i = 0; i < splices.length; i++) {
        var splice = splices[i];
        var removed = splice.removed;
        for (var j = 0; j < removed.length; j++) {
          var model = removed[j];
          var instance = this.extractInstanceAt(splice.index + removeDelta);
          if (instance !== emptyInstance) {
            instanceCache.set(model, instance);
          }
        }

        removeDelta -= splice.addedCount;
      }

      // Instance Insertions
      for (var i = 0; i < splices.length; i++) {
        var splice = splices[i];
        var addIndex = splice.index;
        for (; addIndex < splice.index + splice.addedCount; addIndex++) {
          var model = this.iteratedValue[addIndex];
          var instance = instanceCache.get(model);
          if (instance) {
            instanceCache.delete(model);
          } else {
            if (this.instanceModelFn_) {
              model = this.instanceModelFn_(model);
            }

            if (model === undefined) {
              instance = emptyInstance;
            } else {
              instance = template.createInstance(model, undefined, delegate);
            }
          }

          this.insertInstanceAt(addIndex, instance);
        }
      }

      instanceCache.forEach(function(instance) {
        this.closeInstanceBindings(instance);
      }, this);

      if (this.instancePositionChangedFn_)
        this.reportInstancesMoved(splices);
    },

    reportInstanceMoved: function(index) {
      var instance = this.instances[index];
      if (instance === emptyInstance)
        return;

      this.instancePositionChangedFn_(instance.templateInstance_, index);
    },

    reportInstancesMoved: function(splices) {
      var index = 0;
      var offset = 0;
      for (var i = 0; i < splices.length; i++) {
        var splice = splices[i];
        if (offset != 0) {
          while (index < splice.index) {
            this.reportInstanceMoved(index);
            index++;
          }
        } else {
          index = splice.index;
        }

        while (index < splice.index + splice.addedCount) {
          this.reportInstanceMoved(index);
          index++;
        }

        offset += splice.addedCount - splice.removed.length;
      }

      if (offset == 0)
        return;

      var length = this.instances.length;
      while (index < length) {
        this.reportInstanceMoved(index);
        index++;
      }
    },

    closeInstanceBindings: function(instance) {
      var bindings = instance.bindings_;
      for (var i = 0; i < bindings.length; i++) {
        bindings[i].close();
      }
    },

    unobserve: function() {
      if (!this.arrayObserver)
        return;

      this.arrayObserver.close();
      this.arrayObserver = undefined;
    },

    close: function() {
      if (this.closed)
        return;
      this.unobserve();
      for (var i = 0; i < this.instances.length; i++) {
        this.closeInstanceBindings(this.instances[i]);
      }

      this.instances.length = 0;
      this.closeDeps();
      this.templateElement_.iterator_ = undefined;
      this.closed = true;
    }
  };

  // Polyfill-specific API.
  HTMLTemplateElement.forAllTemplatesFrom_ = forAllTemplatesFrom;
})(this);

(function(scope) {
  'use strict';

  // feature detect for URL constructor
  var hasWorkingUrl = false;
  if (!scope.forceJURL) {
    try {
      var u = new URL('b', 'http://a');
      u.pathname = 'c%20d';
      hasWorkingUrl = u.href === 'http://a/c%20d';
    } catch(e) {}
  }

  if (hasWorkingUrl)
    return;

  var relative = Object.create(null);
  relative['ftp'] = 21;
  relative['file'] = 0;
  relative['gopher'] = 70;
  relative['http'] = 80;
  relative['https'] = 443;
  relative['ws'] = 80;
  relative['wss'] = 443;

  var relativePathDotMapping = Object.create(null);
  relativePathDotMapping['%2e'] = '.';
  relativePathDotMapping['.%2e'] = '..';
  relativePathDotMapping['%2e.'] = '..';
  relativePathDotMapping['%2e%2e'] = '..';

  function isRelativeScheme(scheme) {
    return relative[scheme] !== undefined;
  }

  function invalid() {
    clear.call(this);
    this._isInvalid = true;
  }

  function IDNAToASCII(h) {
    if ('' == h) {
      invalid.call(this)
    }
    // XXX
    return h.toLowerCase()
  }

  function percentEscape(c) {
    var unicode = c.charCodeAt(0);
    if (unicode > 0x20 &&
       unicode < 0x7F &&
       // " # < > ? `
       [0x22, 0x23, 0x3C, 0x3E, 0x3F, 0x60].indexOf(unicode) == -1
      ) {
      return c;
    }
    return encodeURIComponent(c);
  }

  function percentEscapeQuery(c) {
    // XXX This actually needs to encode c using encoding and then
    // convert the bytes one-by-one.

    var unicode = c.charCodeAt(0);
    if (unicode > 0x20 &&
       unicode < 0x7F &&
       // " # < > ` (do not escape '?')
       [0x22, 0x23, 0x3C, 0x3E, 0x60].indexOf(unicode) == -1
      ) {
      return c;
    }
    return encodeURIComponent(c);
  }

  var EOF = undefined,
      ALPHA = /[a-zA-Z]/,
      ALPHANUMERIC = /[a-zA-Z0-9\+\-\.]/;

  function parse(input, stateOverride, base) {
    function err(message) {
      errors.push(message)
    }

    var state = stateOverride || 'scheme start',
        cursor = 0,
        buffer = '',
        seenAt = false,
        seenBracket = false,
        errors = [];

    loop: while ((input[cursor - 1] != EOF || cursor == 0) && !this._isInvalid) {
      var c = input[cursor];
      switch (state) {
        case 'scheme start':
          if (c && ALPHA.test(c)) {
            buffer += c.toLowerCase(); // ASCII-safe
            state = 'scheme';
          } else if (!stateOverride) {
            buffer = '';
            state = 'no scheme';
            continue;
          } else {
            err('Invalid scheme.');
            break loop;
          }
          break;

        case 'scheme':
          if (c && ALPHANUMERIC.test(c)) {
            buffer += c.toLowerCase(); // ASCII-safe
          } else if (':' == c) {
            this._scheme = buffer;
            buffer = '';
            if (stateOverride) {
              break loop;
            }
            if (isRelativeScheme(this._scheme)) {
              this._isRelative = true;
            }
            if ('file' == this._scheme) {
              state = 'relative';
            } else if (this._isRelative && base && base._scheme == this._scheme) {
              state = 'relative or authority';
            } else if (this._isRelative) {
              state = 'authority first slash';
            } else {
              state = 'scheme data';
            }
          } else if (!stateOverride) {
            buffer = '';
            cursor = 0;
            state = 'no scheme';
            continue;
          } else if (EOF == c) {
            break loop;
          } else {
            err('Code point not allowed in scheme: ' + c)
            break loop;
          }
          break;

        case 'scheme data':
          if ('?' == c) {
            query = '?';
            state = 'query';
          } else if ('#' == c) {
            this._fragment = '#';
            state = 'fragment';
          } else {
            // XXX error handling
            if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
              this._schemeData += percentEscape(c);
            }
          }
          break;

        case 'no scheme':
          if (!base || !(isRelativeScheme(base._scheme))) {
            err('Missing scheme.');
            invalid.call(this);
          } else {
            state = 'relative';
            continue;
          }
          break;

        case 'relative or authority':
          if ('/' == c && '/' == input[cursor+1]) {
            state = 'authority ignore slashes';
          } else {
            err('Expected /, got: ' + c);
            state = 'relative';
            continue
          }
          break;

        case 'relative':
          this._isRelative = true;
          if ('file' != this._scheme)
            this._scheme = base._scheme;
          if (EOF == c) {
            this._host = base._host;
            this._port = base._port;
            this._path = base._path.slice();
            this._query = base._query;
            break loop;
          } else if ('/' == c || '\\' == c) {
            if ('\\' == c)
              err('\\ is an invalid code point.');
            state = 'relative slash';
          } else if ('?' == c) {
            this._host = base._host;
            this._port = base._port;
            this._path = base._path.slice();
            this._query = '?';
            state = 'query';
          } else if ('#' == c) {
            this._host = base._host;
            this._port = base._port;
            this._path = base._path.slice();
            this._query = base._query;
            this._fragment = '#';
            state = 'fragment';
          } else {
            var nextC = input[cursor+1]
            var nextNextC = input[cursor+2]
            if (
              'file' != this._scheme || !ALPHA.test(c) ||
              (nextC != ':' && nextC != '|') ||
              (EOF != nextNextC && '/' != nextNextC && '\\' != nextNextC && '?' != nextNextC && '#' != nextNextC)) {
              this._host = base._host;
              this._port = base._port;
              this._path = base._path.slice();
              this._path.pop();
            }
            state = 'relative path';
            continue;
          }
          break;

        case 'relative slash':
          if ('/' == c || '\\' == c) {
            if ('\\' == c) {
              err('\\ is an invalid code point.');
            }
            if ('file' == this._scheme) {
              state = 'file host';
            } else {
              state = 'authority ignore slashes';
            }
          } else {
            if ('file' != this._scheme) {
              this._host = base._host;
              this._port = base._port;
            }
            state = 'relative path';
            continue;
          }
          break;

        case 'authority first slash':
          if ('/' == c) {
            state = 'authority second slash';
          } else {
            err("Expected '/', got: " + c);
            state = 'authority ignore slashes';
            continue;
          }
          break;

        case 'authority second slash':
          state = 'authority ignore slashes';
          if ('/' != c) {
            err("Expected '/', got: " + c);
            continue;
          }
          break;

        case 'authority ignore slashes':
          if ('/' != c && '\\' != c) {
            state = 'authority';
            continue;
          } else {
            err('Expected authority, got: ' + c);
          }
          break;

        case 'authority':
          if ('@' == c) {
            if (seenAt) {
              err('@ already seen.');
              buffer += '%40';
            }
            seenAt = true;
            for (var i = 0; i < buffer.length; i++) {
              var cp = buffer[i];
              if ('\t' == cp || '\n' == cp || '\r' == cp) {
                err('Invalid whitespace in authority.');
                continue;
              }
              // XXX check URL code points
              if (':' == cp && null === this._password) {
                this._password = '';
                continue;
              }
              var tempC = percentEscape(cp);
              (null !== this._password) ? this._password += tempC : this._username += tempC;
            }
            buffer = '';
          } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
            cursor -= buffer.length;
            buffer = '';
            state = 'host';
            continue;
          } else {
            buffer += c;
          }
          break;

        case 'file host':
          if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
            if (buffer.length == 2 && ALPHA.test(buffer[0]) && (buffer[1] == ':' || buffer[1] == '|')) {
              state = 'relative path';
            } else if (buffer.length == 0) {
              state = 'relative path start';
            } else {
              this._host = IDNAToASCII.call(this, buffer);
              buffer = '';
              state = 'relative path start';
            }
            continue;
          } else if ('\t' == c || '\n' == c || '\r' == c) {
            err('Invalid whitespace in file host.');
          } else {
            buffer += c;
          }
          break;

        case 'host':
        case 'hostname':
          if (':' == c && !seenBracket) {
            // XXX host parsing
            this._host = IDNAToASCII.call(this, buffer);
            buffer = '';
            state = 'port';
            if ('hostname' == stateOverride) {
              break loop;
            }
          } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
            this._host = IDNAToASCII.call(this, buffer);
            buffer = '';
            state = 'relative path start';
            if (stateOverride) {
              break loop;
            }
            continue;
          } else if ('\t' != c && '\n' != c && '\r' != c) {
            if ('[' == c) {
              seenBracket = true;
            } else if (']' == c) {
              seenBracket = false;
            }
            buffer += c;
          } else {
            err('Invalid code point in host/hostname: ' + c);
          }
          break;

        case 'port':
          if (/[0-9]/.test(c)) {
            buffer += c;
          } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c || stateOverride) {
            if ('' != buffer) {
              var temp = parseInt(buffer, 10);
              if (temp != relative[this._scheme]) {
                this._port = temp + '';
              }
              buffer = '';
            }
            if (stateOverride) {
              break loop;
            }
            state = 'relative path start';
            continue;
          } else if ('\t' == c || '\n' == c || '\r' == c) {
            err('Invalid code point in port: ' + c);
          } else {
            invalid.call(this);
          }
          break;

        case 'relative path start':
          if ('\\' == c)
            err("'\\' not allowed in path.");
          state = 'relative path';
          if ('/' != c && '\\' != c) {
            continue;
          }
          break;

        case 'relative path':
          if (EOF == c || '/' == c || '\\' == c || (!stateOverride && ('?' == c || '#' == c))) {
            if ('\\' == c) {
              err('\\ not allowed in relative path.');
            }
            var tmp;
            if (tmp = relativePathDotMapping[buffer.toLowerCase()]) {
              buffer = tmp;
            }
            if ('..' == buffer) {
              this._path.pop();
              if ('/' != c && '\\' != c) {
                this._path.push('');
              }
            } else if ('.' == buffer && '/' != c && '\\' != c) {
              this._path.push('');
            } else if ('.' != buffer) {
              if ('file' == this._scheme && this._path.length == 0 && buffer.length == 2 && ALPHA.test(buffer[0]) && buffer[1] == '|') {
                buffer = buffer[0] + ':';
              }
              this._path.push(buffer);
            }
            buffer = '';
            if ('?' == c) {
              this._query = '?';
              state = 'query';
            } else if ('#' == c) {
              this._fragment = '#';
              state = 'fragment';
            }
          } else if ('\t' != c && '\n' != c && '\r' != c) {
            buffer += percentEscape(c);
          }
          break;

        case 'query':
          if (!stateOverride && '#' == c) {
            this._fragment = '#';
            state = 'fragment';
          } else if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
            this._query += percentEscapeQuery(c);
          }
          break;

        case 'fragment':
          if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
            this._fragment += c;
          }
          break;
      }

      cursor++;
    }
  }

  function clear() {
    this._scheme = '';
    this._schemeData = '';
    this._username = '';
    this._password = null;
    this._host = '';
    this._port = '';
    this._path = [];
    this._query = '';
    this._fragment = '';
    this._isInvalid = false;
    this._isRelative = false;
  }

  // Does not process domain names or IP addresses.
  // Does not handle encoding for the query parameter.
  function jURL(url, base /* , encoding */) {
    if (base !== undefined && !(base instanceof jURL))
      base = new jURL(String(base));

    this._url = url;
    clear.call(this);

    var input = url.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, '');
    // encoding = encoding || 'utf-8'

    parse.call(this, input, null, base);
  }

  jURL.prototype = {
    get href() {
      if (this._isInvalid)
        return this._url;

      var authority = '';
      if ('' != this._username || null != this._password) {
        authority = this._username +
            (null != this._password ? ':' + this._password : '') + '@';
      }

      return this.protocol +
          (this._isRelative ? '//' + authority + this.host : '') +
          this.pathname + this._query + this._fragment;
    },
    set href(href) {
      clear.call(this);
      parse.call(this, href);
    },

    get protocol() {
      return this._scheme + ':';
    },
    set protocol(protocol) {
      if (this._isInvalid)
        return;
      parse.call(this, protocol + ':', 'scheme start');
    },

    get host() {
      return this._isInvalid ? '' : this._port ?
          this._host + ':' + this._port : this._host;
    },
    set host(host) {
      if (this._isInvalid || !this._isRelative)
        return;
      parse.call(this, host, 'host');
    },

    get hostname() {
      return this._host;
    },
    set hostname(hostname) {
      if (this._isInvalid || !this._isRelative)
        return;
      parse.call(this, hostname, 'hostname');
    },

    get port() {
      return this._port;
    },
    set port(port) {
      if (this._isInvalid || !this._isRelative)
        return;
      parse.call(this, port, 'port');
    },

    get pathname() {
      return this._isInvalid ? '' : this._isRelative ?
          '/' + this._path.join('/') : this._schemeData;
    },
    set pathname(pathname) {
      if (this._isInvalid || !this._isRelative)
        return;
      this._path = [];
      parse.call(this, pathname, 'relative path start');
    },

    get search() {
      return this._isInvalid || !this._query || '?' == this._query ?
          '' : this._query;
    },
    set search(search) {
      if (this._isInvalid || !this._isRelative)
        return;
      this._query = '?';
      if ('?' == search[0])
        search = search.slice(1);
      parse.call(this, search, 'query');
    },

    get hash() {
      return this._isInvalid || !this._fragment || '#' == this._fragment ?
          '' : this._fragment;
    },
    set hash(hash) {
      if (this._isInvalid)
        return;
      this._fragment = '#';
      if ('#' == hash[0])
        hash = hash.slice(1);
      parse.call(this, hash, 'fragment');
    },

    get origin() {
      var host;
      if (this._isInvalid || !this._scheme) {
        return '';
      }
      // javascript: Gecko returns String(""), WebKit/Blink String("null")
      // Gecko throws error for "data://"
      // data: Gecko returns "", Blink returns "data://", WebKit returns "null"
      // Gecko returns String("") for file: mailto:
      // WebKit/Blink returns String("SCHEME://") for file: mailto:
      switch (this._scheme) {
        case 'data':
        case 'file':
        case 'javascript':
        case 'mailto':
          return 'null';
      }
      host = this.host;
      if (!host) {
        return '';
      }
      return this._scheme + '://' + host;
    }
  };

  // Copy over the static methods
  var OriginalURL = scope.URL;
  if (OriginalURL) {
    jURL.createObjectURL = function(blob) {
      // IE extension allows a second optional options argument.
      // http://msdn.microsoft.com/en-us/library/ie/hh772302(v=vs.85).aspx
      return OriginalURL.createObjectURL.apply(OriginalURL, arguments);
    };
    jURL.revokeObjectURL = function(url) {
      OriginalURL.revokeObjectURL(url);
    };
  }

  scope.URL = jURL;

})(this);

(function(scope) {

var iterations = 0;
var callbacks = [];
var twiddle = document.createTextNode('');

function endOfMicrotask(callback) {
  twiddle.textContent = iterations++;
  callbacks.push(callback);
}

function atEndOfMicrotask() {
  while (callbacks.length) {
    callbacks.shift()();
  }
}

new (window.MutationObserver || JsMutationObserver)(atEndOfMicrotask)
  .observe(twiddle, {characterData: true})
  ;

// exports
scope.endOfMicrotask = endOfMicrotask;
// bc 
Platform.endOfMicrotask = endOfMicrotask;

})(Polymer);


(function(scope) {

/**
 * @class Polymer
 */

// imports
var endOfMicrotask = scope.endOfMicrotask;

// logging
var log = window.WebComponents ? WebComponents.flags.log : {};

// inject style sheet
var style = document.createElement('style');
style.textContent = 'template {display: none !important;} /* injected by platform.js */';
var head = document.querySelector('head');
head.insertBefore(style, head.firstChild);


/**
 * Force any pending data changes to be observed before 
 * the next task. Data changes are processed asynchronously but are guaranteed
 * to be processed, for example, before painting. This method should rarely be 
 * needed. It does nothing when Object.observe is available; 
 * when Object.observe is not available, Polymer automatically flushes data 
 * changes approximately every 1/10 second. 
 * Therefore, `flush` should only be used when a data mutation should be 
 * observed sooner than this.
 * 
 * @method flush
 */
// flush (with logging)
var flushing;
function flush() {
  if (!flushing) {
    flushing = true;
    endOfMicrotask(function() {
      flushing = false;
      log.data && console.group('flush');
      Platform.performMicrotaskCheckpoint();
      log.data && console.groupEnd();
    });
  }
};

// polling dirty checker
// flush periodically if platform does not have object observe.
if (!Observer.hasObjectObserve) {
  var FLUSH_POLL_INTERVAL = 125;
  window.addEventListener('WebComponentsReady', function() {
    flush();
    // watch document visiblity to toggle dirty-checking
    var visibilityHandler = function() {
      // only flush if the page is visibile
      if (document.visibilityState === 'hidden') {
        if (scope.flushPoll) {
          clearInterval(scope.flushPoll);
        }
      } else {
        scope.flushPoll = setInterval(flush, FLUSH_POLL_INTERVAL);
      }
    };
    if (typeof document.visibilityState === 'string') {
      document.addEventListener('visibilitychange', visibilityHandler);
    }
    visibilityHandler();
  });
} else {
  // make flush a no-op when we have Object.observe
  flush = function() {};
}

if (window.CustomElements && !CustomElements.useNative) {
  var originalImportNode = Document.prototype.importNode;
  Document.prototype.importNode = function(node, deep) {
    var imported = originalImportNode.call(this, node, deep);
    CustomElements.upgradeAll(imported);
    return imported;
  };
}

// exports
scope.flush = flush;
// bc
Platform.flush = flush;

})(window.Polymer);


(function(scope) {

var urlResolver = {
  resolveDom: function(root, url) {
    url = url || baseUrl(root);
    this.resolveAttributes(root, url);
    this.resolveStyles(root, url);
    // handle template.content
    var templates = root.querySelectorAll('template');
    if (templates) {
      for (var i = 0, l = templates.length, t; (i < l) && (t = templates[i]); i++) {
        if (t.content) {
          this.resolveDom(t.content, url);
        }
      }
    }
  },
  resolveTemplate: function(template) {
    this.resolveDom(template.content, baseUrl(template));
  },
  resolveStyles: function(root, url) {
    var styles = root.querySelectorAll('style');
    if (styles) {
      for (var i = 0, l = styles.length, s; (i < l) && (s = styles[i]); i++) {
        this.resolveStyle(s, url);
      }
    }
  },
  resolveStyle: function(style, url) {
    url = url || baseUrl(style);
    style.textContent = this.resolveCssText(style.textContent, url);
  },
  resolveCssText: function(cssText, baseUrl, keepAbsolute) {
    cssText = replaceUrlsInCssText(cssText, baseUrl, keepAbsolute, CSS_URL_REGEXP);
    return replaceUrlsInCssText(cssText, baseUrl, keepAbsolute, CSS_IMPORT_REGEXP);
  },
  resolveAttributes: function(root, url) {
    if (root.hasAttributes && root.hasAttributes()) {
      this.resolveElementAttributes(root, url);
    }
    // search for attributes that host urls
    var nodes = root && root.querySelectorAll(URL_ATTRS_SELECTOR);
    if (nodes) {
      for (var i = 0, l = nodes.length, n; (i < l) && (n = nodes[i]); i++) {
        this.resolveElementAttributes(n, url);
      }
    }
  },
  resolveElementAttributes: function(node, url) {
    url = url || baseUrl(node);
    URL_ATTRS.forEach(function(v) {
      var attr = node.attributes[v];
      var value = attr && attr.value;
      var replacement;
      if (value && value.search(URL_TEMPLATE_SEARCH) < 0) {
        if (v === 'style') {
          replacement = replaceUrlsInCssText(value, url, false, CSS_URL_REGEXP);
        } else {
          replacement = resolveRelativeUrl(url, value);
        }
        attr.value = replacement;
      }
    });
  }
};

var CSS_URL_REGEXP = /(url\()([^)]*)(\))/g;
var CSS_IMPORT_REGEXP = /(@import[\s]+(?!url\())([^;]*)(;)/g;
var URL_ATTRS = ['href', 'src', 'action', 'style', 'url'];
var URL_ATTRS_SELECTOR = '[' + URL_ATTRS.join('],[') + ']';
var URL_TEMPLATE_SEARCH = '{{.*}}';
var URL_HASH = '#';

function baseUrl(node) {
  var u = new URL(node.ownerDocument.baseURI);
  u.search = '';
  u.hash = '';
  return u;
}

function replaceUrlsInCssText(cssText, baseUrl, keepAbsolute, regexp) {
  return cssText.replace(regexp, function(m, pre, url, post) {
    var urlPath = url.replace(/["']/g, '');
    urlPath = resolveRelativeUrl(baseUrl, urlPath, keepAbsolute);
    return pre + '\'' + urlPath + '\'' + post;
  });
}

function resolveRelativeUrl(baseUrl, url, keepAbsolute) {
  // do not resolve '/' absolute urls
  if (url && url[0] === '/') {
    return url;
  }
  // do not resolve '#' links, they are used for routing
  if (url && url[0] === '#') {
    return url;
  }
  var u = new URL(url, baseUrl);
  return keepAbsolute ? u.href : makeDocumentRelPath(u.href);
}

function makeDocumentRelPath(url) {
  var root = baseUrl(document.documentElement);
  var u = new URL(url, root);
  if (u.host === root.host && u.port === root.port &&
      u.protocol === root.protocol) {
    return makeRelPath(root, u);
  } else {
    return url;
  }
}

// make a relative path from source to target
function makeRelPath(sourceUrl, targetUrl) {
  var source = sourceUrl.pathname;
  var target = targetUrl.pathname;
  var s = source.split('/');
  var t = target.split('/');
  while (s.length && s[0] === t[0]){
    s.shift();
    t.shift();
  }
  for (var i = 0, l = s.length - 1; i < l; i++) {
    t.unshift('..');
  }
  // empty '#' is discarded but we need to preserve it.
  var hash = (targetUrl.href.slice(-1) === URL_HASH) ? URL_HASH : targetUrl.hash;
  return t.join('/') + targetUrl.search + hash;
}

// exports
scope.urlResolver = urlResolver;

})(Polymer);

(function(scope) {
  var endOfMicrotask = Polymer.endOfMicrotask;

  // Generic url loader
  function Loader(regex) {
    this.cache = Object.create(null);
    this.map = Object.create(null);
    this.requests = 0;
    this.regex = regex;
  }
  Loader.prototype = {

    // TODO(dfreedm): there may be a better factoring here
    // extract absolute urls from the text (full of relative urls)
    extractUrls: function(text, base) {
      var matches = [];
      var matched, u;
      while ((matched = this.regex.exec(text))) {
        u = new URL(matched[1], base);
        matches.push({matched: matched[0], url: u.href});
      }
      return matches;
    },
    // take a text blob, a root url, and a callback and load all the urls found within the text
    // returns a map of absolute url to text
    process: function(text, root, callback) {
      var matches = this.extractUrls(text, root);

      // every call to process returns all the text this loader has ever received
      var done = callback.bind(null, this.map);
      this.fetch(matches, done);
    },
    // build a mapping of url -> text from matches
    fetch: function(matches, callback) {
      var inflight = matches.length;

      // return early if there is no fetching to be done
      if (!inflight) {
        return callback();
      }

      // wait for all subrequests to return
      var done = function() {
        if (--inflight === 0) {
          callback();
        }
      };

      // start fetching all subrequests
      var m, req, url;
      for (var i = 0; i < inflight; i++) {
        m = matches[i];
        url = m.url;
        req = this.cache[url];
        // if this url has already been requested, skip requesting it again
        if (!req) {
          req = this.xhr(url);
          req.match = m;
          this.cache[url] = req;
        }
        // wait for the request to process its subrequests
        req.wait(done);
      }
    },
    handleXhr: function(request) {
      var match = request.match;
      var url = match.url;

      // handle errors with an empty string
      var response = request.response || request.responseText || '';
      this.map[url] = response;
      this.fetch(this.extractUrls(response, url), request.resolve);
    },
    xhr: function(url) {
      this.requests++;
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.send();
      request.onerror = request.onload = this.handleXhr.bind(this, request);

      // queue of tasks to run after XHR returns
      request.pending = [];
      request.resolve = function() {
        var pending = request.pending;
        for(var i = 0; i < pending.length; i++) {
          pending[i]();
        }
        request.pending = null;
      };

      // if we have already resolved, pending is null, async call the callback
      request.wait = function(fn) {
        if (request.pending) {
          request.pending.push(fn);
        } else {
          endOfMicrotask(fn);
        }
      };

      return request;
    }
  };

  scope.Loader = Loader;
})(Polymer);

(function(scope) {

var urlResolver = scope.urlResolver;
var Loader = scope.Loader;

function StyleResolver() {
  this.loader = new Loader(this.regex);
}
StyleResolver.prototype = {
  regex: /@import\s+(?:url)?["'\(]*([^'"\)]*)['"\)]*;/g,
  // Recursively replace @imports with the text at that url
  resolve: function(text, url, callback) {
    var done = function(map) {
      callback(this.flatten(text, url, map));
    }.bind(this);
    this.loader.process(text, url, done);
  },
  // resolve the textContent of a style node
  resolveNode: function(style, url, callback) {
    var text = style.textContent;
    var done = function(text) {
      style.textContent = text;
      callback(style);
    };
    this.resolve(text, url, done);
  },
  // flatten all the @imports to text
  flatten: function(text, base, map) {
    var matches = this.loader.extractUrls(text, base);
    var match, url, intermediate;
    for (var i = 0; i < matches.length; i++) {
      match = matches[i];
      url = match.url;
      // resolve any css text to be relative to the importer, keep absolute url
      intermediate = urlResolver.resolveCssText(map[url], url, true);
      // flatten intermediate @imports
      intermediate = this.flatten(intermediate, base, map);
      text = text.replace(match.matched, intermediate);
    }
    return text;
  },
  loadStyles: function(styles, base, callback) {
    var loaded=0, l = styles.length;
    // called in the context of the style
    function loadedStyle(style) {
      loaded++;
      if (loaded === l && callback) {
        callback();
      }
    }
    for (var i=0, s; (i<l) && (s=styles[i]); i++) {
      this.resolveNode(s, base, loadedStyle);
    }
  }
};

var styleResolver = new StyleResolver();

// exports
scope.styleResolver = styleResolver;

})(Polymer);

(function(scope) {

  // copy own properties from 'api' to 'prototype, with name hinting for 'super'
  function extend(prototype, api) {
    if (prototype && api) {
      // use only own properties of 'api'
      Object.getOwnPropertyNames(api).forEach(function(n) {
        // acquire property descriptor
        var pd = Object.getOwnPropertyDescriptor(api, n);
        if (pd) {
          // clone property via descriptor
          Object.defineProperty(prototype, n, pd);
          // cache name-of-method for 'super' engine
          if (typeof pd.value == 'function') {
            // hint the 'super' engine
            pd.value.nom = n;
          }
        }
      });
    }
    return prototype;
  }


  // mixin

  // copy all properties from inProps (et al) to inObj
  function mixin(inObj/*, inProps, inMoreProps, ...*/) {
    var obj = inObj || {};
    for (var i = 1; i < arguments.length; i++) {
      var p = arguments[i];
      try {
        for (var n in p) {
          copyProperty(n, p, obj);
        }
      } catch(x) {
      }
    }
    return obj;
  }

  // copy property inName from inSource object to inTarget object
  function copyProperty(inName, inSource, inTarget) {
    var pd = getPropertyDescriptor(inSource, inName);
    Object.defineProperty(inTarget, inName, pd);
  }

  // get property descriptor for inName on inObject, even if
  // inName exists on some link in inObject's prototype chain
  function getPropertyDescriptor(inObject, inName) {
    if (inObject) {
      var pd = Object.getOwnPropertyDescriptor(inObject, inName);
      return pd || getPropertyDescriptor(Object.getPrototypeOf(inObject), inName);
    }
  }

  // exports

  scope.extend = extend;
  scope.mixin = mixin;

  // for bc
  Platform.mixin = mixin;

})(Polymer);

(function(scope) {
  
  // usage
  
  // invoke cb.call(this) in 100ms, unless the job is re-registered,
  // which resets the timer
  // 
  // this.myJob = this.job(this.myJob, cb, 100)
  //
  // returns a job handle which can be used to re-register a job

  var Job = function(inContext) {
    this.context = inContext;
    this.boundComplete = this.complete.bind(this)
  };
  Job.prototype = {
    go: function(callback, wait) {
      this.callback = callback;
      var h;
      if (!wait) {
        h = requestAnimationFrame(this.boundComplete);
        this.handle = function() {
          cancelAnimationFrame(h);
        }
      } else {
        h = setTimeout(this.boundComplete, wait);
        this.handle = function() {
          clearTimeout(h);
        }
      }
    },
    stop: function() {
      if (this.handle) {
        this.handle();
        this.handle = null;
      }
    },
    complete: function() {
      if (this.handle) {
        this.stop();
        this.callback.call(this.context);
      }
    }
  };
  
  function job(job, callback, wait) {
    if (job) {
      job.stop();
    } else {
      job = new Job(this);
    }
    job.go(callback, wait);
    return job;
  }
  
  // exports 

  scope.job = job;
  
})(Polymer);

(function(scope) {

  // dom polyfill, additions, and utility methods

  var registry = {};

  HTMLElement.register = function(tag, prototype) {
    registry[tag] = prototype;
  };

  // get prototype mapped to node <tag>
  HTMLElement.getPrototypeForTag = function(tag) {
    var prototype = !tag ? HTMLElement.prototype : registry[tag];
    // TODO(sjmiles): creating <tag> is likely to have wasteful side-effects
    return prototype || Object.getPrototypeOf(document.createElement(tag));
  };

  // we have to flag propagation stoppage for the event dispatcher
  var originalStopPropagation = Event.prototype.stopPropagation;
  Event.prototype.stopPropagation = function() {
    this.cancelBubble = true;
    originalStopPropagation.apply(this, arguments);
  };
  
  
  // polyfill DOMTokenList
  // * add/remove: allow these methods to take multiple classNames
  // * toggle: add a 2nd argument which forces the given state rather
  //  than toggling.

  var add = DOMTokenList.prototype.add;
  var remove = DOMTokenList.prototype.remove;
  DOMTokenList.prototype.add = function() {
    for (var i = 0; i < arguments.length; i++) {
      add.call(this, arguments[i]);
    }
  };
  DOMTokenList.prototype.remove = function() {
    for (var i = 0; i < arguments.length; i++) {
      remove.call(this, arguments[i]);
    }
  };
  DOMTokenList.prototype.toggle = function(name, bool) {
    if (arguments.length == 1) {
      bool = !this.contains(name);
    }
    bool ? this.add(name) : this.remove(name);
  };
  DOMTokenList.prototype.switch = function(oldName, newName) {
    oldName && this.remove(oldName);
    newName && this.add(newName);
  };

  // add array() to NodeList, NamedNodeMap, HTMLCollection

  var ArraySlice = function() {
    return Array.prototype.slice.call(this);
  };

  var namedNodeMap = (window.NamedNodeMap || window.MozNamedAttrMap || {});

  NodeList.prototype.array = ArraySlice;
  namedNodeMap.prototype.array = ArraySlice;
  HTMLCollection.prototype.array = ArraySlice;

  // utility

  function createDOM(inTagOrNode, inHTML, inAttrs) {
    var dom = typeof inTagOrNode == 'string' ?
        document.createElement(inTagOrNode) : inTagOrNode.cloneNode(true);
    dom.innerHTML = inHTML;
    if (inAttrs) {
      for (var n in inAttrs) {
        dom.setAttribute(n, inAttrs[n]);
      }
    }
    return dom;
  }

  // exports

  scope.createDOM = createDOM;

})(Polymer);

(function(scope) {
    // super

    // `arrayOfArgs` is an optional array of args like one might pass
    // to `Function.apply`

    // TODO(sjmiles):
    //    $super must be installed on an instance or prototype chain
    //    as `super`, and invoked via `this`, e.g.
    //      `this.super();`

    //    will not work if function objects are not unique, for example,
    //    when using mixins.
    //    The memoization strategy assumes each function exists on only one 
    //    prototype chain i.e. we use the function object for memoizing)
    //    perhaps we can bookkeep on the prototype itself instead
    function $super(arrayOfArgs) {
      // since we are thunking a method call, performance is important here: 
      // memoize all lookups, once memoized the fast path calls no other 
      // functions
      //
      // find the caller (cannot be `strict` because of 'caller')
      var caller = $super.caller;
      // memoized 'name of method' 
      var nom = caller.nom;
      // memoized next implementation prototype
      var _super = caller._super;
      if (!_super) {
        if (!nom) {
          nom = caller.nom = nameInThis.call(this, caller);
        }
        if (!nom) {
          console.warn('called super() on a method not installed declaratively (has no .nom property)');
        }
        // super prototype is either cached or we have to find it
        // by searching __proto__ (at the 'top')
        // invariant: because we cache _super on fn below, we never reach 
        // here from inside a series of calls to super(), so it's ok to 
        // start searching from the prototype of 'this' (at the 'top')
        // we must never memoize a null super for this reason
        _super = memoizeSuper(caller, nom, getPrototypeOf(this));
      }
      // our super function
      var fn = _super[nom];
      if (fn) {
        // memoize information so 'fn' can call 'super'
        if (!fn._super) {
          // must not memoize null, or we lose our invariant above
          memoizeSuper(fn, nom, _super);
        }
        // invoke the inherited method
        // if 'fn' is not function valued, this will throw
        return fn.apply(this, arrayOfArgs || []);
      }
    }

    function nameInThis(value) {
      var p = this.__proto__;
      while (p && p !== HTMLElement.prototype) {
        // TODO(sjmiles): getOwnPropertyNames is absurdly expensive
        var n$ = Object.getOwnPropertyNames(p);
        for (var i=0, l=n$.length, n; i<l && (n=n$[i]); i++) {
          var d = Object.getOwnPropertyDescriptor(p, n);
          if (typeof d.value === 'function' && d.value === value) {
            return n;
          }
        }
        p = p.__proto__;
      }
    }

    function memoizeSuper(method, name, proto) {
      // find and cache next prototype containing `name`
      // we need the prototype so we can do another lookup
      // from here
      var s = nextSuper(proto, name, method);
      if (s[name]) {
        // `s` is a prototype, the actual method is `s[name]`
        // tag super method with it's name for quicker lookups
        s[name].nom = name;
      }
      return method._super = s;
    }

    function nextSuper(proto, name, caller) {
      // look for an inherited prototype that implements name
      while (proto) {
        if ((proto[name] !== caller) && proto[name]) {
          return proto;
        }
        proto = getPrototypeOf(proto);
      }
      // must not return null, or we lose our invariant above
      // in this case, a super() call was invoked where no superclass
      // method exists
      // TODO(sjmiles): thow an exception?
      return Object;
    }

    // NOTE: In some platforms (IE10) the prototype chain is faked via 
    // __proto__. Therefore, always get prototype via __proto__ instead of
    // the more standard Object.getPrototypeOf.
    function getPrototypeOf(prototype) {
      return prototype.__proto__;
    }

    // utility function to precompute name tags for functions
    // in a (unchained) prototype
    function hintSuper(prototype) {
      // tag functions with their prototype name to optimize
      // super call invocations
      for (var n in prototype) {
        var pd = Object.getOwnPropertyDescriptor(prototype, n);
        if (pd && typeof pd.value === 'function') {
          pd.value.nom = n;
        }
      }
    }

    // exports

    scope.super = $super;

})(Polymer);

(function(scope) {

  function noopHandler(value) {
    return value;
  }

  // helper for deserializing properties of various types to strings
  var typeHandlers = {
    string: noopHandler,
    'undefined': noopHandler,
    date: function(value) {
      return new Date(Date.parse(value) || Date.now());
    },
    boolean: function(value) {
      if (value === '') {
        return true;
      }
      return value === 'false' ? false : !!value;
    },
    number: function(value) {
      var n = parseFloat(value);
      // hex values like "0xFFFF" parseFloat as 0
      if (n === 0) {
        n = parseInt(value);
      }
      return isNaN(n) ? value : n;
      // this code disabled because encoded values (like "0xFFFF")
      // do not round trip to their original format
      //return (String(floatVal) === value) ? floatVal : value;
    },
    object: function(value, currentValue) {
      if (currentValue === null) {
        return value;
      }
      try {
        // If the string is an object, we can parse is with the JSON library.
        // include convenience replace for single-quotes. If the author omits
        // quotes altogether, parse will fail.
        return JSON.parse(value.replace(/'/g, '"'));
      } catch(e) {
        // The object isn't valid JSON, return the raw value
        return value;
      }
    },
    // avoid deserialization of functions
    'function': function(value, currentValue) {
      return currentValue;
    }
  };

  function deserializeValue(value, currentValue) {
    // attempt to infer type from default value
    var inferredType = typeof currentValue;
    // invent 'date' type value for Date
    if (currentValue instanceof Date) {
      inferredType = 'date';
    }
    // delegate deserialization via type string
    return typeHandlers[inferredType](value, currentValue);
  }

  // exports

  scope.deserializeValue = deserializeValue;

})(Polymer);

(function(scope) {

  // imports

  var extend = scope.extend;

  // module

  var api = {};

  api.declaration = {};
  api.instance = {};

  api.publish = function(apis, prototype) {
    for (var n in apis) {
      extend(prototype, apis[n]);
    }
  };

  // exports

  scope.api = api;

})(Polymer);

(function(scope) {

  /**
   * @class polymer-base
   */

  var utils = {

    /**
      * Invokes a function asynchronously. The context of the callback
      * function is bound to 'this' automatically. Returns a handle which may 
      * be passed to <a href="#cancelAsync">cancelAsync</a> to cancel the 
      * asynchronous call.
      *
      * @method async
      * @param {Function|String} method
      * @param {any|Array} args
      * @param {number} timeout
      */
    async: function(method, args, timeout) {
      // when polyfilling Object.observe, ensure changes 
      // propagate before executing the async method
      Polymer.flush();
      // second argument to `apply` must be an array
      args = (args && args.length) ? args : [args];
      // function to invoke
      var fn = function() {
        (this[method] || method).apply(this, args);
      }.bind(this);
      // execute `fn` sooner or later
      var handle = timeout ? setTimeout(fn, timeout) :
          requestAnimationFrame(fn);
      // NOTE: switch on inverting handle to determine which time is used.
      return timeout ? handle : ~handle;
    },

    /**
      * Cancels a pending callback that was scheduled via 
      * <a href="#async">async</a>. 
      *
      * @method cancelAsync
      * @param {handle} handle Handle of the `async` to cancel.
      */
    cancelAsync: function(handle) {
      if (handle < 0) {
        cancelAnimationFrame(~handle);
      } else {
        clearTimeout(handle);
      }
    },

    /**
      * Fire an event.
      *
      * @method fire
      * @returns {Object} event
      * @param {string} type An event name.
      * @param {any} detail
      * @param {Node} onNode Target node.
      * @param {Boolean} bubbles Set false to prevent bubbling, defaults to true
      * @param {Boolean} cancelable Set false to prevent cancellation, defaults to true
      */
    fire: function(type, detail, onNode, bubbles, cancelable) {
      var node = onNode || this;
      var detail = detail === null || detail === undefined ? {} : detail;
      var event = new CustomEvent(type, {
        bubbles: bubbles !== undefined ? bubbles : true,
        cancelable: cancelable !== undefined ? cancelable : true,
        detail: detail
      });
      node.dispatchEvent(event);
      return event;
    },

    /**
      * Fire an event asynchronously.
      *
      * @method asyncFire
      * @param {string} type An event name.
      * @param detail
      * @param {Node} toNode Target node.
      */
    asyncFire: function(/*inType, inDetail*/) {
      this.async("fire", arguments);
    },

    /**
      * Remove class from old, add class to anew, if they exist.
      *
      * @param classFollows
      * @param anew A node.
      * @param old A node
      * @param className
      */
    classFollows: function(anew, old, className) {
      if (old) {
        old.classList.remove(className);
      }
      if (anew) {
        anew.classList.add(className);
      }
    },

    /**
      * Inject HTML which contains markup bound to this element into
      * a target element (replacing target element content).
      *
      * @param String html to inject
      * @param Element target element
      */
    injectBoundHTML: function(html, element) {
      var template = document.createElement('template');
      template.innerHTML = html;
      var fragment = this.instanceTemplate(template);
      if (element) {
        element.textContent = '';
        element.appendChild(fragment);
      }
      return fragment;
    }
  };

  // no-operation function for handy stubs
  var nop = function() {};

  // null-object for handy stubs
  var nob = {};

  // deprecated

  utils.asyncMethod = utils.async;

  // exports

  scope.api.instance.utils = utils;
  scope.nop = nop;
  scope.nob = nob;

})(Polymer);

(function(scope) {

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};
  var EVENT_PREFIX = 'on-';

  // instance events api
  var events = {
    // read-only
    EVENT_PREFIX: EVENT_PREFIX,
    // event listeners on host
    addHostListeners: function() {
      var events = this.eventDelegates;
      log.events && (Object.keys(events).length > 0) && console.log('[%s] addHostListeners:', this.localName, events);
      // NOTE: host events look like bindings but really are not;
      // (1) we don't want the attribute to be set and (2) we want to support
      // multiple event listeners ('host' and 'instance') and Node.bind
      // by default supports 1 thing being bound.
      for (var type in events) {
        var methodName = events[type];
        PolymerGestures.addEventListener(this, type, this.element.getEventHandler(this, this, methodName));
      }
    },
    // call 'method' or function method on 'obj' with 'args', if the method exists
    dispatchMethod: function(obj, method, args) {
      if (obj) {
        log.events && console.group('[%s] dispatch [%s]', obj.localName, method);
        var fn = typeof method === 'function' ? method : obj[method];
        if (fn) {
          fn[args ? 'apply' : 'call'](obj, args);
        }
        log.events && console.groupEnd();
        // NOTE: dirty check right after calling method to ensure 
        // changes apply quickly; in a very complicated app using high 
        // frequency events, this can be a perf concern; in this case,
        // imperative handlers can be used to avoid flushing.
        Polymer.flush();
      }
    }
  };

  // exports

  scope.api.instance.events = events;

  /**
   * @class Polymer
   */

  /**
   * Add a gesture aware event handler to the given `node`. Can be used 
   * in place of `element.addEventListener` and ensures gestures will function
   * as expected on mobile platforms. Please note that Polymer's declarative
   * event handlers include this functionality by default.
   * 
   * @method addEventListener
   * @param {Node} node node on which to listen
   * @param {String} eventType name of the event
   * @param {Function} handlerFn event handler function
   * @param {Boolean} capture set to true to invoke event capturing
   * @type Function
   */
  // alias PolymerGestures event listener logic
  scope.addEventListener = function(node, eventType, handlerFn, capture) {
    PolymerGestures.addEventListener(wrap(node), eventType, handlerFn, capture);
  };

  /**
   * Remove a gesture aware event handler on the given `node`. To remove an
   * event listener, the exact same arguments are required that were passed
   * to `Polymer.addEventListener`.
   * 
   * @method removeEventListener
   * @param {Node} node node on which to listen
   * @param {String} eventType name of the event
   * @param {Function} handlerFn event handler function
   * @param {Boolean} capture set to true to invoke event capturing
   * @type Function
   */
  scope.removeEventListener = function(node, eventType, handlerFn, capture) {
    PolymerGestures.removeEventListener(wrap(node), eventType, handlerFn, capture);
  };

})(Polymer);

(function(scope) {

  // instance api for attributes

  var attributes = {
    // copy attributes defined in the element declaration to the instance
    // e.g. <polymer-element name="x-foo" tabIndex="0"> tabIndex is copied
    // to the element instance here.
    copyInstanceAttributes: function () {
      var a$ = this._instanceAttributes;
      for (var k in a$) {
        if (!this.hasAttribute(k)) {
          this.setAttribute(k, a$[k]);
        }
      }
    },
    // for each attribute on this, deserialize value to property as needed
    takeAttributes: function() {
      // if we have no publish lookup table, we have no attributes to take
      // TODO(sjmiles): ad hoc
      if (this._publishLC) {
        for (var i=0, a$=this.attributes, l=a$.length, a; (a=a$[i]) && i<l; i++) {
          this.attributeToProperty(a.name, a.value);
        }
      }
    },
    // if attribute 'name' is mapped to a property, deserialize
    // 'value' into that property
    attributeToProperty: function(name, value) {
      // try to match this attribute to a property (attributes are
      // all lower-case, so this is case-insensitive search)
      var name = this.propertyForAttribute(name);
      if (name) {
        // filter out 'mustached' values, these are to be
        // replaced with bound-data and are not yet values
        // themselves
        if (value && value.search(scope.bindPattern) >= 0) {
          return;
        }
        // get original value
        var currentValue = this[name];
        // deserialize Boolean or Number values from attribute
        var value = this.deserializeValue(value, currentValue);
        // only act if the value has changed
        if (value !== currentValue) {
          // install new value (has side-effects)
          this[name] = value;
        }
      }
    },
    // return the published property matching name, or undefined
    propertyForAttribute: function(name) {
      var match = this._publishLC && this._publishLC[name];
      return match;
    },
    // convert representation of `stringValue` based on type of `currentValue`
    deserializeValue: function(stringValue, currentValue) {
      return scope.deserializeValue(stringValue, currentValue);
    },
    // convert to a string value based on the type of `inferredType`
    serializeValue: function(value, inferredType) {
      if (inferredType === 'boolean') {
        return value ? '' : undefined;
      } else if (inferredType !== 'object' && inferredType !== 'function'
          && value !== undefined) {
        return value;
      }
    },
    // serializes `name` property value and updates the corresponding attribute
    // note that reflection is opt-in.
    reflectPropertyToAttribute: function(name) {
      var inferredType = typeof this[name];
      // try to intelligently serialize property value
      var serializedValue = this.serializeValue(this[name], inferredType);
      // boolean properties must reflect as boolean attributes
      if (serializedValue !== undefined) {
        this.setAttribute(name, serializedValue);
        // TODO(sorvell): we should remove attr for all properties
        // that have undefined serialization; however, we will need to
        // refine the attr reflection system to achieve this; pica, for example,
        // relies on having inferredType object properties not removed as
        // attrs.
      } else if (inferredType === 'boolean') {
        this.removeAttribute(name);
      }
    }
  };

  // exports

  scope.api.instance.attributes = attributes;

})(Polymer);

(function(scope) {

  /**
   * @class polymer-base
   */

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};

  // magic words

  var OBSERVE_SUFFIX = 'Changed';

  // element api

  var empty = [];

  var updateRecord = {
    object: undefined,
    type: 'update',
    name: undefined,
    oldValue: undefined
  };

  var numberIsNaN = Number.isNaN || function(value) {
    return typeof value === 'number' && isNaN(value);
  };

  function areSameValue(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    if (numberIsNaN(left) && numberIsNaN(right))
      return true;
    return left !== left && right !== right;
  }

  // capture A's value if B's value is null or undefined,
  // otherwise use B's value
  function resolveBindingValue(oldValue, value) {
    if (value === undefined && oldValue === null) {
      return value;
    }
    return (value === null || value === undefined) ? oldValue : value;
  }

  var properties = {

    // creates a CompoundObserver to observe property changes
    // NOTE, this is only done there are any properties in the `observe` object
    createPropertyObserver: function() {
      var n$ = this._observeNames;
      if (n$ && n$.length) {
        var o = this._propertyObserver = new CompoundObserver(true);
        this.registerObserver(o);
        // TODO(sorvell): may not be kosher to access the value here (this[n]);
        // previously we looked at the descriptor on the prototype
        // this doesn't work for inheritance and not for accessors without
        // a value property
        for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
          o.addPath(this, n);
          this.observeArrayValue(n, this[n], null);
        }
      }
    },

    // start observing property changes
    openPropertyObserver: function() {
      if (this._propertyObserver) {
        this._propertyObserver.open(this.notifyPropertyChanges, this);
      }
    },

    // handler for property changes; routes changes to observing methods
    // note: array valued properties are observed for array splices
    notifyPropertyChanges: function(newValues, oldValues, paths) {
      var name, method, called = {};
      for (var i in oldValues) {
        // note: paths is of form [object, path, object, path]
        name = paths[2 * i + 1];
        method = this.observe[name];
        if (method) {
          var ov = oldValues[i], nv = newValues[i];
          // observes the value if it is an array
          this.observeArrayValue(name, nv, ov);
          if (!called[method]) {
            // only invoke change method if one of ov or nv is not (undefined | null)
            if ((ov !== undefined && ov !== null) || (nv !== undefined && nv !== null)) {
              called[method] = true;
              // TODO(sorvell): call method with the set of values it's expecting;
              // e.g. 'foo bar': 'invalidate' expects the new and old values for
              // foo and bar. Currently we give only one of these and then
              // deliver all the arguments.
              this.invokeMethod(method, [ov, nv, arguments]);
            }
          }
        }
      }
    },

    // call method iff it exists.
    invokeMethod: function(method, args) {
      var fn = this[method] || method;
      if (typeof fn === 'function') {
        fn.apply(this, args);
      }
    },

    /**
     * Force any pending property changes to synchronously deliver to
     * handlers specified in the `observe` object.
     * Note, normally changes are processed at microtask time.
     *
     * @method deliverChanges
     */
    deliverChanges: function() {
      if (this._propertyObserver) {
        this._propertyObserver.deliver();
      }
    },

    observeArrayValue: function(name, value, old) {
      // we only care if there are registered side-effects
      var callbackName = this.observe[name];
      if (callbackName) {
        // if we are observing the previous value, stop
        if (Array.isArray(old)) {
          log.observe && console.log('[%s] observeArrayValue: unregister observer [%s]', this.localName, name);
          this.closeNamedObserver(name + '__array');
        }
        // if the new value is an array, being observing it
        if (Array.isArray(value)) {
          log.observe && console.log('[%s] observeArrayValue: register observer [%s]', this.localName, name, value);
          var observer = new ArrayObserver(value);
          observer.open(function(splices) {
            this.invokeMethod(callbackName, [splices]);
          }, this);
          this.registerNamedObserver(name + '__array', observer);
        }
      }
    },

    emitPropertyChangeRecord: function(name, value, oldValue) {
      var object = this;
      if (areSameValue(value, oldValue)) {
        return;
      }
      // invoke property change side effects
      this._propertyChanged(name, value, oldValue);
      // emit change record
      if (!Observer.hasObjectObserve) {
        return;
      }
      var notifier = this._objectNotifier;
      if (!notifier) {
        notifier = this._objectNotifier = Object.getNotifier(this);
      }
      updateRecord.object = this;
      updateRecord.name = name;
      updateRecord.oldValue = oldValue;
      notifier.notify(updateRecord);
    },

    _propertyChanged: function(name, value, oldValue) {
      if (this.reflect[name]) {
        this.reflectPropertyToAttribute(name);
      }
    },

    // creates a property binding (called via bind) to a published property.
    bindProperty: function(property, observable, oneTime) {
      if (oneTime) {
        this[property] = observable;
        return;
      }
      var computed = this.element.prototype.computed;
      // Binding an "out-only" value to a computed property. Note that
      // since this observer isn't opened, it doesn't need to be closed on
      // cleanup.
      if (computed && computed[property]) {
        var privateComputedBoundValue = property + 'ComputedBoundObservable_';
        this[privateComputedBoundValue] = observable;
        return;
      }
      return this.bindToAccessor(property, observable, resolveBindingValue);
    },

    // NOTE property `name` must be published. This makes it an accessor.
    bindToAccessor: function(name, observable, resolveFn) {
      var privateName = name + '_';
      var privateObservable  = name + 'Observable_';
      // Present for properties which are computed and published and have a
      // bound value.
      var privateComputedBoundValue = name + 'ComputedBoundObservable_';
      this[privateObservable] = observable;
      var oldValue = this[privateName];
      // observable callback
      var self = this;
      function updateValue(value, oldValue) {
        self[privateName] = value;
        var setObserveable = self[privateComputedBoundValue];
        if (setObserveable && typeof setObserveable.setValue == 'function') {
          setObserveable.setValue(value);
        }
        self.emitPropertyChangeRecord(name, value, oldValue);
      }
      // resolve initial value
      var value = observable.open(updateValue);
      if (resolveFn && !areSameValue(oldValue, value)) {
        var resolvedValue = resolveFn(oldValue, value);
        if (!areSameValue(value, resolvedValue)) {
          value = resolvedValue;
          if (observable.setValue) {
            observable.setValue(value);
          }
        }
      }
      updateValue(value, oldValue);
      // register and return observable
      var observer = {
        close: function() {
          observable.close();
          self[privateObservable] = undefined;
          self[privateComputedBoundValue] = undefined;
        }
      };
      this.registerObserver(observer);
      return observer;
    },

    createComputedProperties: function() {
      if (!this._computedNames) {
        return;
      }
      for (var i = 0; i < this._computedNames.length; i++) {
        var name = this._computedNames[i];
        var expressionText = this.computed[name];
        try {
          var expression = PolymerExpressions.getExpression(expressionText);
          var observable = expression.getBinding(this, this.element.syntax);
          this.bindToAccessor(name, observable);
        } catch (ex) {
          console.error('Failed to create computed property', ex);
        }
      }
    },

    // property bookkeeping
    registerObserver: function(observer) {
      if (!this._observers) {
        this._observers = [observer];
        return;
      }
      this._observers.push(observer);
    },

    closeObservers: function() {
      if (!this._observers) {
        return;
      }
      // observer array items are arrays of observers.
      var observers = this._observers;
      for (var i = 0; i < observers.length; i++) {
        var observer = observers[i];
        if (observer && typeof observer.close == 'function') {
          observer.close();
        }
      }
      this._observers = [];
    },

    // bookkeeping observers for memory management
    registerNamedObserver: function(name, observer) {
      var o$ = this._namedObservers || (this._namedObservers = {});
      o$[name] = observer;
    },

    closeNamedObserver: function(name) {
      var o$ = this._namedObservers;
      if (o$ && o$[name]) {
        o$[name].close();
        o$[name] = null;
        return true;
      }
    },

    closeNamedObservers: function() {
      if (this._namedObservers) {
        for (var i in this._namedObservers) {
          this.closeNamedObserver(i);
        }
        this._namedObservers = {};
      }
    }

  };

  // logging
  var LOG_OBSERVE = '[%s] watching [%s]';
  var LOG_OBSERVED = '[%s#%s] watch: [%s] now [%s] was [%s]';
  var LOG_CHANGED = '[%s#%s] propertyChanged: [%s] now [%s] was [%s]';

  // exports

  scope.api.instance.properties = properties;

})(Polymer);

(function(scope) {

  /**
   * @class polymer-base
   */

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};

  // element api supporting mdv
  var mdv = {

    /**
     * Creates dom cloned from the given template, instantiating bindings
     * with this element as the template model and `PolymerExpressions` as the
     * binding delegate.
     *
     * @method instanceTemplate
     * @param {Template} template source template from which to create dom.
     */
    instanceTemplate: function(template) {
      // ensure template is decorated (lets' things like <tr template ...> work)
      HTMLTemplateElement.decorate(template);
      // ensure a default bindingDelegate
      var syntax = this.syntax || (!template.bindingDelegate &&
          this.element.syntax);
      var dom = template.createInstance(this, syntax);
      var observers = dom.bindings_;
      for (var i = 0; i < observers.length; i++) {
        this.registerObserver(observers[i]);
      }
      return dom;
    },

    // Called by TemplateBinding/NodeBind to setup a binding to the given
    // property. It's overridden here to support property bindings
    // in addition to attribute bindings that are supported by default.
    bind: function(name, observable, oneTime) {
      var property = this.propertyForAttribute(name);
      if (!property) {
        // TODO(sjmiles): this mixin method must use the special form
        // of `super` installed by `mixinMethod` in declaration/prototype.js
        return this.mixinSuper(arguments);
      } else {
        // use n-way Polymer binding
        var observer = this.bindProperty(property, observable, oneTime);
        // NOTE: reflecting binding information is typically required only for
        // tooling. It has a performance cost so it's opt-in in Node.bind.
        if (Platform.enableBindingsReflection && observer) {
          observer.path = observable.path_;
          this._recordBinding(property, observer);
        }
        if (this.reflect[property]) {
          this.reflectPropertyToAttribute(property);
        }
        return observer;
      }
    },

    _recordBinding: function(name, observer) {
      this.bindings_ = this.bindings_ || {};
      this.bindings_[name] = observer;
    },

    // Called by TemplateBinding when all bindings on an element have been 
    // executed. This signals that all element inputs have been gathered
    // and it's safe to ready the element, create shadow-root and start
    // data-observation.
    bindFinished: function() {
      this.makeElementReady();
    },

    // called at detached time to signal that an element's bindings should be
    // cleaned up. This is done asynchronously so that users have the chance
    // to call `cancelUnbindAll` to prevent unbinding.
    asyncUnbindAll: function() {
      if (!this._unbound) {
        log.unbind && console.log('[%s] asyncUnbindAll', this.localName);
        this._unbindAllJob = this.job(this._unbindAllJob, this.unbindAll, 0);
      }
    },
    
    /**
     * This method should rarely be used and only if 
     * <a href="#cancelUnbindAll">`cancelUnbindAll`</a> has been called to 
     * prevent element unbinding. In this case, the element's bindings will 
     * not be automatically cleaned up and it cannot be garbage collected 
     * by the system. If memory pressure is a concern or a 
     * large amount of elements need to be managed in this way, `unbindAll`
     * can be called to deactivate the element's bindings and allow its 
     * memory to be reclaimed.
     *
     * @method unbindAll
     */
    unbindAll: function() {
      if (!this._unbound) {
        this.closeObservers();
        this.closeNamedObservers();
        this._unbound = true;
      }
    },

    /**
     * Call in `detached` to prevent the element from unbinding when it is 
     * detached from the dom. The element is unbound as a cleanup step that 
     * allows its memory to be reclaimed. 
     * If `cancelUnbindAll` is used, consider calling 
     * <a href="#unbindAll">`unbindAll`</a> when the element is no longer
     * needed. This will allow its memory to be reclaimed.
     * 
     * @method cancelUnbindAll
     */
    cancelUnbindAll: function() {
      if (this._unbound) {
        log.unbind && console.warn('[%s] already unbound, cannot cancel unbindAll', this.localName);
        return;
      }
      log.unbind && console.log('[%s] cancelUnbindAll', this.localName);
      if (this._unbindAllJob) {
        this._unbindAllJob = this._unbindAllJob.stop();
      }
    }

  };

  function unbindNodeTree(node) {
    forNodeTree(node, _nodeUnbindAll);
  }

  function _nodeUnbindAll(node) {
    node.unbindAll();
  }

  function forNodeTree(node, callback) {
    if (node) {
      callback(node);
      for (var child = node.firstChild; child; child = child.nextSibling) {
        forNodeTree(child, callback);
      }
    }
  }

  var mustachePattern = /\{\{([^{}]*)}}/;

  // exports

  scope.bindPattern = mustachePattern;
  scope.api.instance.mdv = mdv;

})(Polymer);

(function(scope) {

  /**
   * Common prototype for all Polymer Elements.
   * 
   * @class polymer-base
   * @homepage polymer.github.io
   */
  var base = {
    /**
     * Tags this object as the canonical Base prototype.
     *
     * @property PolymerBase
     * @type boolean
     * @default true
     */
    PolymerBase: true,

    /**
     * Debounce signals. 
     * 
     * Call `job` to defer a named signal, and all subsequent matching signals, 
     * until a wait time has elapsed with no new signal.
     * 
     *     debouncedClickAction: function(e) {
     *       // processClick only when it's been 100ms since the last click
     *       this.job('click', function() {
     *        this.processClick;
     *       }, 100);
     *     }
     *
     * @method job
     * @param String {String} job A string identifier for the job to debounce.
     * @param Function {Function} callback A function that is called (with `this` context) when the wait time elapses.
     * @param Number {Number} wait Time in milliseconds (ms) after the last signal that must elapse before invoking `callback`
     * @type Handle
     */
    job: function(job, callback, wait) {
      if (typeof job === 'string') {
        var n = '___' + job;
        this[n] = Polymer.job.call(this, this[n], callback, wait);
      } else {
        // TODO(sjmiles): suggest we deprecate this call signature
        return Polymer.job.call(this, job, callback, wait);
      }
    },

    /**
     * Invoke a superclass method. 
     * 
     * Use `super()` to invoke the most recently overridden call to the 
     * currently executing function. 
     * 
     * To pass arguments through, use the literal `arguments` as the parameter 
     * to `super()`.
     *
     *     nextPageAction: function(e) {
     *       // invoke the superclass version of `nextPageAction`
     *       this.super(arguments); 
     *     }
     *
     * To pass custom arguments, arrange them in an array.
     *
     *     appendSerialNo: function(value, serial) {
     *       // prefix the superclass serial number with our lot # before
     *       // invoking the superlcass
     *       return this.super([value, this.lotNo + serial])
     *     }
     *
     * @method super
     * @type Any
     * @param {args) An array of arguments to use when calling the superclass method, or null.
     */
    super: Polymer.super,

    /**
     * Lifecycle method called when the element is instantiated.
     * 
     * Override `created` to perform custom create-time tasks. No need to call 
     * super-class `created` unless you are extending another Polymer element.
     * Created is called before the element creates `shadowRoot` or prepares
     * data-observation.
     * 
     * @method created
     * @type void
     */
    created: function() {
    },

    /**
     * Lifecycle method called when the element has populated it's `shadowRoot`,
     * prepared data-observation, and made itself ready for API interaction.
     * 
     * @method ready
     * @type void
     */
    ready: function() {
    },

    /**
     * Low-level lifecycle method called as part of standard Custom Elements
     * operation. Polymer implements this method to provide basic default 
     * functionality. For custom create-time tasks, implement `created` 
     * instead, which is called immediately after `createdCallback`. 
     * 
     * @method createdCallback
     */
    createdCallback: function() {
      if (this.templateInstance && this.templateInstance.model) {
        console.warn('Attributes on ' + this.localName + ' were data bound ' +
            'prior to Polymer upgrading the element. This may result in ' +
            'incorrect binding types.');
      }
      this.created();
      this.prepareElement();
      if (!this.ownerDocument.isStagingDocument) {
        this.makeElementReady();
      }
    },

    // system entry point, do not override
    prepareElement: function() {
      if (this._elementPrepared) {
        console.warn('Element already prepared', this.localName);
        return;
      }
      this._elementPrepared = true;
      // storage for shadowRoots info
      this.shadowRoots = {};
      // install property observers
      this.createPropertyObserver();
      this.openPropertyObserver();
      // install boilerplate attributes
      this.copyInstanceAttributes();
      // process input attributes
      this.takeAttributes();
      // add event listeners
      this.addHostListeners();
    },

    // system entry point, do not override
    makeElementReady: function() {
      if (this._readied) {
        return;
      }
      this._readied = true;
      this.createComputedProperties();
      this.parseDeclarations(this.__proto__);
      // NOTE: Support use of the `unresolved` attribute to help polyfill
      // custom elements' `:unresolved` feature.
      this.removeAttribute('unresolved');
      // user entry point
      this.ready();
    },

    /**
     * Low-level lifecycle method called as part of standard Custom Elements
     * operation. Polymer implements this method to provide basic default 
     * functionality. For custom tasks in your element, implement `attributeChanged` 
     * instead, which is called immediately after `attributeChangedCallback`. 
     * 
     * @method attributeChangedCallback
     */
    attributeChangedCallback: function(name, oldValue) {
      // TODO(sjmiles): adhoc filter
      if (name !== 'class' && name !== 'style') {
        this.attributeToProperty(name, this.getAttribute(name));
      }
      if (this.attributeChanged) {
        this.attributeChanged.apply(this, arguments);
      }
    },

    /**
     * Low-level lifecycle method called as part of standard Custom Elements
     * operation. Polymer implements this method to provide basic default 
     * functionality. For custom create-time tasks, implement `attached` 
     * instead, which is called immediately after `attachedCallback`. 
     * 
     * @method attachedCallback
     */
     attachedCallback: function() {
      // when the element is attached, prevent it from unbinding.
      this.cancelUnbindAll();
      // invoke user action
      if (this.attached) {
        this.attached();
      }
      if (!this.hasBeenAttached) {
        this.hasBeenAttached = true;
        if (this.domReady) {
          this.async('domReady');
        }
      }
    },

     /**
     * Implement to access custom elements in dom descendants, ancestors, 
     * or siblings. Because custom elements upgrade in document order, 
     * elements accessed in `ready` or `attached` may not be upgraded. When
     * `domReady` is called, all registered custom elements are guaranteed
     * to have been upgraded.
     * 
     * @method domReady
     */

    /**
     * Low-level lifecycle method called as part of standard Custom Elements
     * operation. Polymer implements this method to provide basic default 
     * functionality. For custom create-time tasks, implement `detached` 
     * instead, which is called immediately after `detachedCallback`. 
     * 
     * @method detachedCallback
     */
    detachedCallback: function() {
      if (!this.preventDispose) {
        this.asyncUnbindAll();
      }
      // invoke user action
      if (this.detached) {
        this.detached();
      }
      // TODO(sorvell): bc
      if (this.leftView) {
        this.leftView();
      }
    },

    /**
     * Walks the prototype-chain of this element and allows specific
     * classes a chance to process static declarations.
     * 
     * In particular, each polymer-element has it's own `template`.
     * `parseDeclarations` is used to accumulate all element `template`s
     * from an inheritance chain.
     *
     * `parseDeclaration` static methods implemented in the chain are called
     * recursively, oldest first, with the `<polymer-element>` associated
     * with the current prototype passed as an argument.
     * 
     * An element may override this method to customize shadow-root generation. 
     * 
     * @method parseDeclarations
     */
    parseDeclarations: function(p) {
      if (p && p.element) {
        this.parseDeclarations(p.__proto__);
        p.parseDeclaration.call(this, p.element);
      }
    },

    /**
     * Perform init-time actions based on static information in the
     * `<polymer-element>` instance argument.
     *
     * For example, the standard implementation locates the template associated
     * with the given `<polymer-element>` and stamps it into a shadow-root to
     * implement shadow inheritance.
     *  
     * An element may override this method for custom behavior. 
     * 
     * @method parseDeclaration
     */
    parseDeclaration: function(elementElement) {
      var template = this.fetchTemplate(elementElement);
      if (template) {
        var root = this.shadowFromTemplate(template);
        this.shadowRoots[elementElement.name] = root;
      }
    },

    /**
     * Given a `<polymer-element>`, find an associated template (if any) to be
     * used for shadow-root generation.
     *
     * An element may override this method for custom behavior. 
     * 
     * @method fetchTemplate
     */
    fetchTemplate: function(elementElement) {
      return elementElement.querySelector('template');
    },

    /**
     * Create a shadow-root in this host and stamp `template` as it's 
     * content. 
     *
     * An element may override this method for custom behavior. 
     * 
     * @method shadowFromTemplate
     */
    shadowFromTemplate: function(template) {
      if (template) {
        // make a shadow root
        var root = this.createShadowRoot();
        // stamp template
        // which includes parsing and applying MDV bindings before being
        // inserted (to avoid {{}} in attribute values)
        // e.g. to prevent <img src="images/{{icon}}"> from generating a 404.
        var dom = this.instanceTemplate(template);
        // append to shadow dom
        root.appendChild(dom);
        // perform post-construction initialization tasks on shadow root
        this.shadowRootReady(root, template);
        // return the created shadow root
        return root;
      }
    },

    // utility function that stamps a <template> into light-dom
    lightFromTemplate: function(template, refNode) {
      if (template) {
        // TODO(sorvell): mark this element as an eventController so that
        // event listeners on bound nodes inside it will be called on it.
        // Note, the expectation here is that events on all descendants
        // should be handled by this element.
        this.eventController = this;
        // stamp template
        // which includes parsing and applying MDV bindings before being
        // inserted (to avoid {{}} in attribute values)
        // e.g. to prevent <img src="images/{{icon}}"> from generating a 404.
        var dom = this.instanceTemplate(template);
        // append to shadow dom
        if (refNode) {
          this.insertBefore(dom, refNode);
        } else {
          this.appendChild(dom);
        }
        // perform post-construction initialization tasks on ahem, light root
        this.shadowRootReady(this);
        // return the created shadow root
        return dom;
      }
    },

    shadowRootReady: function(root) {
      // locate nodes with id and store references to them in this.$ hash
      this.marshalNodeReferences(root);
    },

    // locate nodes with id and store references to them in this.$ hash
    marshalNodeReferences: function(root) {
      // establish $ instance variable
      var $ = this.$ = this.$ || {};
      // populate $ from nodes with ID from the LOCAL tree
      if (root) {
        var n$ = root.querySelectorAll("[id]");
        for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
          $[n.id] = n;
        };
      }
    },

    /**
     * Register a one-time callback when a child-list or sub-tree mutation
     * occurs on node. 
     *
     * For persistent callbacks, call onMutation from your listener. 
     * 
     * @method onMutation
     * @param Node {Node} node Node to watch for mutations.
     * @param Function {Function} listener Function to call on mutation. The function is invoked as `listener.call(this, observer, mutations);` where `observer` is the MutationObserver that triggered the notification, and `mutations` is the native mutation list.
     */
    onMutation: function(node, listener) {
      var observer = new MutationObserver(function(mutations) {
        listener.call(this, observer, mutations);
        observer.disconnect();
      }.bind(this));
      observer.observe(node, {childList: true, subtree: true});
    }
  };

  /**
   * @class Polymer
   */
  
  /**
   * Returns true if the object includes <a href="#polymer-base">polymer-base</a> in it's prototype chain.
   * 
   * @method isBase
   * @param Object {Object} object Object to test.
   * @type Boolean
   */
  function isBase(object) {
    return object.hasOwnProperty('PolymerBase')
  }

  // name a base constructor for dev tools

  /**
   * The Polymer base-class constructor.
   * 
   * @property Base
   * @type Function
   */
  function PolymerBase() {};
  PolymerBase.prototype = base;
  base.constructor = PolymerBase;

  // exports

  scope.Base = PolymerBase;
  scope.isBase = isBase;
  scope.api.instance.base = base;

})(Polymer);

(function(scope) {

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};
  var hasShadowDOMPolyfill = window.ShadowDOMPolyfill;

  // magic words
  
  var STYLE_SCOPE_ATTRIBUTE = 'element';
  var STYLE_CONTROLLER_SCOPE = 'controller';
  
  var styles = {
    STYLE_SCOPE_ATTRIBUTE: STYLE_SCOPE_ATTRIBUTE,
    /**
     * Installs external stylesheets and <style> elements with the attribute 
     * polymer-scope='controller' into the scope of element. This is intended
     * to be a called during custom element construction.
    */
    installControllerStyles: function() {
      // apply controller styles, but only if they are not yet applied
      var scope = this.findStyleScope();
      if (scope && !this.scopeHasNamedStyle(scope, this.localName)) {
        // allow inherited controller styles
        var proto = getPrototypeOf(this), cssText = '';
        while (proto && proto.element) {
          cssText += proto.element.cssTextForScope(STYLE_CONTROLLER_SCOPE);
          proto = getPrototypeOf(proto);
        }
        if (cssText) {
          this.installScopeCssText(cssText, scope);
        }
      }
    },
    installScopeStyle: function(style, name, scope) {
      var scope = scope || this.findStyleScope(), name = name || '';
      if (scope && !this.scopeHasNamedStyle(scope, this.localName + name)) {
        var cssText = '';
        if (style instanceof Array) {
          for (var i=0, l=style.length, s; (i<l) && (s=style[i]); i++) {
            cssText += s.textContent + '\n\n';
          }
        } else {
          cssText = style.textContent;
        }
        this.installScopeCssText(cssText, scope, name);
      }
    },
    installScopeCssText: function(cssText, scope, name) {
      scope = scope || this.findStyleScope();
      name = name || '';
      if (!scope) {
        return;
      }
      if (hasShadowDOMPolyfill) {
        cssText = shimCssText(cssText, scope.host);
      }
      var style = this.element.cssTextToScopeStyle(cssText,
          STYLE_CONTROLLER_SCOPE);
      Polymer.applyStyleToScope(style, scope);
      // cache that this style has been applied
      this.styleCacheForScope(scope)[this.localName + name] = true;
    },
    findStyleScope: function(node) {
      // find the shadow root that contains this element
      var n = node || this;
      while (n.parentNode) {
        n = n.parentNode;
      }
      return n;
    },
    scopeHasNamedStyle: function(scope, name) {
      var cache = this.styleCacheForScope(scope);
      return cache[name];
    },
    styleCacheForScope: function(scope) {
      if (hasShadowDOMPolyfill) {
        var scopeName = scope.host ? scope.host.localName : scope.localName;
        return polyfillScopeStyleCache[scopeName] || (polyfillScopeStyleCache[scopeName] = {});
      } else {
        return scope._scopeStyles = (scope._scopeStyles || {});
      }
    }
  };

  var polyfillScopeStyleCache = {};
  
  // NOTE: use raw prototype traversal so that we ensure correct traversal
  // on platforms where the protoype chain is simulated via __proto__ (IE10)
  function getPrototypeOf(prototype) {
    return prototype.__proto__;
  }

  function shimCssText(cssText, host) {
    var name = '', is = false;
    if (host) {
      name = host.localName;
      is = host.hasAttribute('is');
    }
    var selector = WebComponents.ShadowCSS.makeScopeSelector(name, is);
    return WebComponents.ShadowCSS.shimCssText(cssText, selector);
  }

  // exports

  scope.api.instance.styles = styles;
  
})(Polymer);

(function(scope) {

  // imports

  var extend = scope.extend;
  var api = scope.api;

  // imperative implementation: Polymer()

  // specify an 'own' prototype for tag `name`
  function element(name, prototype) {
    if (typeof name !== 'string') {
      var script = prototype || document._currentScript;
      prototype = name;
      name = script && script.parentNode && script.parentNode.getAttribute ?
          script.parentNode.getAttribute('name') : '';
      if (!name) {
        throw 'Element name could not be inferred.';
      }
    }
    if (getRegisteredPrototype(name)) {
      throw 'Already registered (Polymer) prototype for element ' + name;
    }
    // cache the prototype
    registerPrototype(name, prototype);
    // notify the registrar waiting for 'name', if any
    notifyPrototype(name);
  }

  // async prototype source

  function waitingForPrototype(name, client) {
    waitPrototype[name] = client;
  }

  var waitPrototype = {};

  function notifyPrototype(name) {
    if (waitPrototype[name]) {
      waitPrototype[name].registerWhenReady();
      delete waitPrototype[name];
    }
  }

  // utility and bookkeeping

  // maps tag names to prototypes, as registered with
  // Polymer. Prototypes associated with a tag name
  // using document.registerElement are available from
  // HTMLElement.getPrototypeForTag().
  // If an element was fully registered by Polymer, then
  // Polymer.getRegisteredPrototype(name) === 
  //   HTMLElement.getPrototypeForTag(name)

  var prototypesByName = {};

  function registerPrototype(name, prototype) {
    return prototypesByName[name] = prototype || {};
  }

  function getRegisteredPrototype(name) {
    return prototypesByName[name];
  }

  function instanceOfType(element, type) {
    if (typeof type !== 'string') {
      return false;
    }
    var proto = HTMLElement.getPrototypeForTag(type);
    var ctor = proto && proto.constructor;
    if (!ctor) {
      return false;
    }
    if (CustomElements.instanceof) {
      return CustomElements.instanceof(element, ctor);
    }
    return element instanceof ctor;
  }

  // exports

  scope.getRegisteredPrototype = getRegisteredPrototype;
  scope.waitingForPrototype = waitingForPrototype;
  scope.instanceOfType = instanceOfType;

  // namespace shenanigans so we can expose our scope on the registration 
  // function

  // make window.Polymer reference `element()`

  window.Polymer = element;

  // TODO(sjmiles): find a way to do this that is less terrible
  // copy window.Polymer properties onto `element()`

  extend(Polymer, scope);

  // Under the HTMLImports polyfill, scripts in the main document
  // do not block on imports; we want to allow calls to Polymer in the main
  // document. WebComponents collects those calls until we can process them, which
  // we do here.

  if (WebComponents.consumeDeclarations) {
    WebComponents.consumeDeclarations(function(declarations) {
      if (declarations) {
        for (var i=0, l=declarations.length, d; (i<l) && (d=declarations[i]); i++) {
          element.apply(null, d);
        }
      }
    });
  }

})(Polymer);

(function(scope) {

/**
 * @class polymer-base
 */

 /**
  * Resolve a url path to be relative to a `base` url. If unspecified, `base`
  * defaults to the element's ownerDocument url. Can be used to resolve
  * paths from element's in templates loaded in HTMLImports to be relative
  * to the document containing the element. Polymer automatically does this for
  * url attributes in element templates; however, if a url, for
  * example, contains a binding, then `resolvePath` can be used to ensure it is 
  * relative to the element document. For example, in an element's template,
  *
  *     <a href="{{resolvePath(path)}}">Resolved</a>
  * 
  * @method resolvePath
  * @param {String} url Url path to resolve.
  * @param {String} base Optional base url against which to resolve, defaults
  * to the element's ownerDocument url.
  * returns {String} resolved url.
  */

var path = {
  resolveElementPaths: function(node) {
    Polymer.urlResolver.resolveDom(node);
  },
  addResolvePathApi: function() {
    // let assetpath attribute modify the resolve path
    var assetPath = this.getAttribute('assetpath') || '';
    var root = new URL(assetPath, this.ownerDocument.baseURI);
    this.prototype.resolvePath = function(urlPath, base) {
      var u = new URL(urlPath, base || root);
      return u.href;
    };
  }
};

// exports
scope.api.declaration.path = path;

})(Polymer);

(function(scope) {

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};
  var api = scope.api.instance.styles;
  var STYLE_SCOPE_ATTRIBUTE = api.STYLE_SCOPE_ATTRIBUTE;

  var hasShadowDOMPolyfill = window.ShadowDOMPolyfill;

  // magic words

  var STYLE_SELECTOR = 'style';
  var STYLE_LOADABLE_MATCH = '@import';
  var SHEET_SELECTOR = 'link[rel=stylesheet]';
  var STYLE_GLOBAL_SCOPE = 'global';
  var SCOPE_ATTR = 'polymer-scope';

  var styles = {
    // returns true if resources are loading
    loadStyles: function(callback) {
      var template = this.fetchTemplate();
      var content = template && this.templateContent();
      if (content) {
        this.convertSheetsToStyles(content);
        var styles = this.findLoadableStyles(content);
        if (styles.length) {
          var templateUrl = template.ownerDocument.baseURI;
          return Polymer.styleResolver.loadStyles(styles, templateUrl, callback);
        }
      }
      if (callback) {
        callback();
      }
    },
    convertSheetsToStyles: function(root) {
      var s$ = root.querySelectorAll(SHEET_SELECTOR);
      for (var i=0, l=s$.length, s, c; (i<l) && (s=s$[i]); i++) {
        c = createStyleElement(importRuleForSheet(s, this.ownerDocument.baseURI),
            this.ownerDocument);
        this.copySheetAttributes(c, s);
        s.parentNode.replaceChild(c, s);
      }
    },
    copySheetAttributes: function(style, link) {
      for (var i=0, a$=link.attributes, l=a$.length, a; (a=a$[i]) && i<l; i++) {
        if (a.name !== 'rel' && a.name !== 'href') {
          style.setAttribute(a.name, a.value);
        }
      }
    },
    findLoadableStyles: function(root) {
      var loadables = [];
      if (root) {
        var s$ = root.querySelectorAll(STYLE_SELECTOR);
        for (var i=0, l=s$.length, s; (i<l) && (s=s$[i]); i++) {
          if (s.textContent.match(STYLE_LOADABLE_MATCH)) {
            loadables.push(s);
          }
        }
      }
      return loadables;
    },
    /**
     * Install external stylesheets loaded in <polymer-element> elements into the 
     * element's template.
     * @param elementElement The <element> element to style.
     */
    installSheets: function() {
      this.cacheSheets();
      this.cacheStyles();
      this.installLocalSheets();
      this.installGlobalStyles();
    },
    /**
     * Remove all sheets from element and store for later use.
     */
    cacheSheets: function() {
      this.sheets = this.findNodes(SHEET_SELECTOR);
      this.sheets.forEach(function(s) {
        if (s.parentNode) {
          s.parentNode.removeChild(s);
        }
      });
    },
    cacheStyles: function() {
      this.styles = this.findNodes(STYLE_SELECTOR + '[' + SCOPE_ATTR + ']');
      this.styles.forEach(function(s) {
        if (s.parentNode) {
          s.parentNode.removeChild(s);
        }
      });
    },
    /**
     * Takes external stylesheets loaded in an <element> element and moves
     * their content into a <style> element inside the <element>'s template.
     * The sheet is then removed from the <element>. This is done only so 
     * that if the element is loaded in the main document, the sheet does
     * not become active.
     * Note, ignores sheets with the attribute 'polymer-scope'.
     * @param elementElement The <element> element to style.
     */
    installLocalSheets: function () {
      var sheets = this.sheets.filter(function(s) {
        return !s.hasAttribute(SCOPE_ATTR);
      });
      var content = this.templateContent();
      if (content) {
        var cssText = '';
        sheets.forEach(function(sheet) {
          cssText += cssTextFromSheet(sheet) + '\n';
        });
        if (cssText) {
          var style = createStyleElement(cssText, this.ownerDocument);
          content.insertBefore(style, content.firstChild);
        }
      }
    },
    findNodes: function(selector, matcher) {
      var nodes = this.querySelectorAll(selector).array();
      var content = this.templateContent();
      if (content) {
        var templateNodes = content.querySelectorAll(selector).array();
        nodes = nodes.concat(templateNodes);
      }
      return matcher ? nodes.filter(matcher) : nodes;
    },
    /**
     * Promotes external stylesheets and <style> elements with the attribute 
     * polymer-scope='global' into global scope.
     * This is particularly useful for defining @keyframe rules which 
     * currently do not function in scoped or shadow style elements.
     * (See wkb.ug/72462)
     * @param elementElement The <element> element to style.
    */
    // TODO(sorvell): remove when wkb.ug/72462 is addressed.
    installGlobalStyles: function() {
      var style = this.styleForScope(STYLE_GLOBAL_SCOPE);
      applyStyleToScope(style, document.head);
    },
    cssTextForScope: function(scopeDescriptor) {
      var cssText = '';
      // handle stylesheets
      var selector = '[' + SCOPE_ATTR + '=' + scopeDescriptor + ']';
      var matcher = function(s) {
        return matchesSelector(s, selector);
      };
      var sheets = this.sheets.filter(matcher);
      sheets.forEach(function(sheet) {
        cssText += cssTextFromSheet(sheet) + '\n\n';
      });
      // handle cached style elements
      var styles = this.styles.filter(matcher);
      styles.forEach(function(style) {
        cssText += style.textContent + '\n\n';
      });
      return cssText;
    },
    styleForScope: function(scopeDescriptor) {
      var cssText = this.cssTextForScope(scopeDescriptor);
      return this.cssTextToScopeStyle(cssText, scopeDescriptor);
    },
    cssTextToScopeStyle: function(cssText, scopeDescriptor) {
      if (cssText) {
        var style = createStyleElement(cssText);
        style.setAttribute(STYLE_SCOPE_ATTRIBUTE, this.getAttribute('name') +
            '-' + scopeDescriptor);
        return style;
      }
    }
  };

  function importRuleForSheet(sheet, baseUrl) {
    var href = new URL(sheet.getAttribute('href'), baseUrl).href;
    return '@import \'' + href + '\';';
  }

  function applyStyleToScope(style, scope) {
    if (style) {
      if (scope === document) {
        scope = document.head;
      }
      if (hasShadowDOMPolyfill) {
        scope = document.head;
      }
      // TODO(sorvell): necessary for IE
      // see https://connect.microsoft.com/IE/feedback/details/790212/
      // cloning-a-style-element-and-adding-to-document-produces
      // -unexpected-result#details
      // var clone = style.cloneNode(true);
      var clone = createStyleElement(style.textContent);
      var attr = style.getAttribute(STYLE_SCOPE_ATTRIBUTE);
      if (attr) {
        clone.setAttribute(STYLE_SCOPE_ATTRIBUTE, attr);
      }
      // TODO(sorvell): probably too brittle; try to figure out 
      // where to put the element.
      var refNode = scope.firstElementChild;
      if (scope === document.head) {
        var selector = 'style[' + STYLE_SCOPE_ATTRIBUTE + ']';
        var s$ = document.head.querySelectorAll(selector);
        if (s$.length) {
          refNode = s$[s$.length-1].nextElementSibling;
        }
      }
      scope.insertBefore(clone, refNode);
    }
  }

  function createStyleElement(cssText, scope) {
    scope = scope || document;
    scope = scope.createElement ? scope : scope.ownerDocument;
    var style = scope.createElement('style');
    style.textContent = cssText;
    return style;
  }

  function cssTextFromSheet(sheet) {
    return (sheet && sheet.__resource) || '';
  }

  function matchesSelector(node, inSelector) {
    if (matches) {
      return matches.call(node, inSelector);
    }
  }
  var p = HTMLElement.prototype;
  var matches = p.matches || p.matchesSelector || p.webkitMatchesSelector 
      || p.mozMatchesSelector;
  
  // exports

  scope.api.declaration.styles = styles;
  scope.applyStyleToScope = applyStyleToScope;
  
})(Polymer);

(function(scope) {

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};
  var api = scope.api.instance.events;
  var EVENT_PREFIX = api.EVENT_PREFIX;

  var mixedCaseEventTypes = {};
  [
    'webkitAnimationStart',
    'webkitAnimationEnd',
    'webkitTransitionEnd',
    'DOMFocusOut',
    'DOMFocusIn',
    'DOMMouseScroll'
  ].forEach(function(e) {
    mixedCaseEventTypes[e.toLowerCase()] = e;
  });

  // polymer-element declarative api: events feature
  var events = {
    parseHostEvents: function() {
      // our delegates map
      var delegates = this.prototype.eventDelegates;
      // extract data from attributes into delegates
      this.addAttributeDelegates(delegates);
    },
    addAttributeDelegates: function(delegates) {
      // for each attribute
      for (var i=0, a; a=this.attributes[i]; i++) {
        // does it have magic marker identifying it as an event delegate?
        if (this.hasEventPrefix(a.name)) {
          // if so, add the info to delegates
          delegates[this.removeEventPrefix(a.name)] = a.value.replace('{{', '')
              .replace('}}', '').trim();
        }
      }
    },
    // starts with 'on-'
    hasEventPrefix: function (n) {
      return n && (n[0] === 'o') && (n[1] === 'n') && (n[2] === '-');
    },
    removeEventPrefix: function(n) {
      return n.slice(prefixLength);
    },
    findController: function(node) {
      while (node.parentNode) {
        if (node.eventController) {
          return node.eventController;
        }
        node = node.parentNode;
      }
      return node.host;
    },
    getEventHandler: function(controller, target, method) {
      var events = this;
      return function(e) {
        if (!controller || !controller.PolymerBase) {
          controller = events.findController(target);
        }

        var args = [e, e.detail, e.currentTarget];
        controller.dispatchMethod(controller, method, args);
      };
    },
    prepareEventBinding: function(pathString, name, node) {
      if (!this.hasEventPrefix(name))
        return;

      var eventType = this.removeEventPrefix(name);
      eventType = mixedCaseEventTypes[eventType] || eventType;

      var events = this;

      return function(model, node, oneTime) {
        var handler = events.getEventHandler(undefined, node, pathString);
        PolymerGestures.addEventListener(node, eventType, handler);

        if (oneTime)
          return;

        // TODO(rafaelw): This is really pointless work. Aside from the cost
        // of these allocations, NodeBind is going to setAttribute back to its
        // current value. Fixing this would mean changing the TemplateBinding
        // binding delegate API.
        function bindingValue() {
          return '{{ ' + pathString + ' }}';
        }

        return {
          open: bindingValue,
          discardChanges: bindingValue,
          close: function() {
            PolymerGestures.removeEventListener(node, eventType, handler);
          }
        };
      };
    }
  };

  var prefixLength = EVENT_PREFIX.length;

  // exports
  scope.api.declaration.events = events;

})(Polymer);

(function(scope) {

  // element api

  var observationBlacklist = ['attribute'];

  var properties = {
    inferObservers: function(prototype) {
      // called before prototype.observe is chained to inherited object
      var observe = prototype.observe, property;
      for (var n in prototype) {
        if (n.slice(-7) === 'Changed') {
          property = n.slice(0, -7);
          if (this.canObserveProperty(property)) {
            if (!observe) {
              observe  = (prototype.observe = {});
            }
            observe[property] = observe[property] || n;
          }
        }
      }
    },
    canObserveProperty: function(property) {
      return (observationBlacklist.indexOf(property) < 0);
    },
    explodeObservers: function(prototype) {
      // called before prototype.observe is chained to inherited object
      var o = prototype.observe;
      if (o) {
        var exploded = {};
        for (var n in o) {
          var names = n.split(' ');
          for (var i=0, ni; ni=names[i]; i++) {
            exploded[ni] = o[n];
          }
        }
        prototype.observe = exploded;
      }
    },
    optimizePropertyMaps: function(prototype) {
      if (prototype.observe) {
        // construct name list
        var a = prototype._observeNames = [];
        for (var n in prototype.observe) {
          var names = n.split(' ');
          for (var i=0, ni; ni=names[i]; i++) {
            a.push(ni);
          }
        }
      }
      if (prototype.publish) {
        // construct name list
        var a = prototype._publishNames = [];
        for (var n in prototype.publish) {
          a.push(n);
        }
      }
      if (prototype.computed) {
        // construct name list
        var a = prototype._computedNames = [];
        for (var n in prototype.computed) {
          a.push(n);
        }
      }
    },
    publishProperties: function(prototype, base) {
      // if we have any properties to publish
      var publish = prototype.publish;
      if (publish) {
        // transcribe `publish` entries onto own prototype
        this.requireProperties(publish, prototype, base);
        // warn and remove accessor names that are broken on some browsers
        this.filterInvalidAccessorNames(publish);
        // construct map of lower-cased property names
        prototype._publishLC = this.lowerCaseMap(publish);
      }
      var computed = prototype.computed;
      if (computed) {
        // warn and remove accessor names that are broken on some browsers
        this.filterInvalidAccessorNames(computed);
      }
    },
    // Publishing/computing a property where the name might conflict with a
    // browser property is not currently supported to help users of Polymer
    // avoid browser bugs:
    //
    // https://code.google.com/p/chromium/issues/detail?id=43394
    // https://bugs.webkit.org/show_bug.cgi?id=49739
    //
    // We can lift this restriction when those bugs are fixed.
    filterInvalidAccessorNames: function(propertyNames) {
      for (var name in propertyNames) {
        // Check if the name is in our blacklist.
        if (this.propertyNameBlacklist[name]) {
          console.warn('Cannot define property "' + name + '" for element "' +
            this.name + '" because it has the same name as an HTMLElement ' +
            'property, and not all browsers support overriding that. ' +
            'Consider giving it a different name.');
          // Remove the invalid accessor from the list.
          delete propertyNames[name];
        }
      }
    },
    //
    // `name: value` entries in the `publish` object may need to generate 
    // matching properties on the prototype.
    //
    // Values that are objects may have a `reflect` property, which
    // signals that the value describes property control metadata.
    // In metadata objects, the prototype default value (if any)
    // is encoded in the `value` property.
    //
    // publish: {
    //   foo: 5, 
    //   bar: {value: true, reflect: true},
    //   zot: {}
    // }
    //
    // `reflect` metadata property controls whether changes to the property
    // are reflected back to the attribute (default false). 
    //
    // A value is stored on the prototype unless it's === `undefined`,
    // in which case the base chain is checked for a value.
    // If the basal value is also undefined, `null` is stored on the prototype.
    //
    // The reflection data is stored on another prototype object, `reflect`
    // which also can be specified directly.
    //
    // reflect: {
    //   foo: true
    // }
    //
    requireProperties: function(propertyInfos, prototype, base) {
      // per-prototype storage for reflected properties
      prototype.reflect = prototype.reflect || {};
      // ensure a prototype value for each property
      // and update the property's reflect to attribute status
      for (var n in propertyInfos) {
        var value = propertyInfos[n];
        // value has metadata if it has a `reflect` property
        if (value && value.reflect !== undefined) {
          prototype.reflect[n] = Boolean(value.reflect);
          value = value.value;
        }
        // only set a value if one is specified
        if (value !== undefined) {
          prototype[n] = value;
        }
      }
    },
    lowerCaseMap: function(properties) {
      var map = {};
      for (var n in properties) {
        map[n.toLowerCase()] = n;
      }
      return map;
    },
    createPropertyAccessor: function(name, ignoreWrites) {
      var proto = this.prototype;

      var privateName = name + '_';
      var privateObservable  = name + 'Observable_';
      proto[privateName] = proto[name];

      Object.defineProperty(proto, name, {
        get: function() {
          var observable = this[privateObservable];
          if (observable)
            observable.deliver();

          return this[privateName];
        },
        set: function(value) {
          if (ignoreWrites) {
            return this[privateName];
          }

          var observable = this[privateObservable];
          if (observable) {
            observable.setValue(value);
            return;
          }

          var oldValue = this[privateName];
          this[privateName] = value;
          this.emitPropertyChangeRecord(name, value, oldValue);

          return value;
        },
        configurable: true
      });
    },
    createPropertyAccessors: function(prototype) {
      var n$ = prototype._computedNames;
      if (n$ && n$.length) {
        for (var i=0, l=n$.length, n, fn; (i<l) && (n=n$[i]); i++) {
          this.createPropertyAccessor(n, true);
        }
      }
      var n$ = prototype._publishNames;
      if (n$ && n$.length) {
        for (var i=0, l=n$.length, n, fn; (i<l) && (n=n$[i]); i++) {
          // If the property is computed and published, the accessor is created
          // above.
          if (!prototype.computed || !prototype.computed[n]) {
            this.createPropertyAccessor(n);
          }
        }
      }
    },
    // This list contains some property names that people commonly want to use,
    // but won't work because of Chrome/Safari bugs. It isn't an exhaustive
    // list. In particular it doesn't contain any property names found on
    // subtypes of HTMLElement (e.g. name, value). Rather it attempts to catch
    // some common cases.
    propertyNameBlacklist: {
      children: 1,
      'class': 1,
      id: 1,
      hidden: 1,
      style: 1,
      title: 1,
    }
  };

  // exports

  scope.api.declaration.properties = properties;

})(Polymer);

(function(scope) {

  // magic words

  var ATTRIBUTES_ATTRIBUTE = 'attributes';
  var ATTRIBUTES_REGEX = /\s|,/;

  // attributes api

  var attributes = {
    
    inheritAttributesObjects: function(prototype) {
      // chain our lower-cased publish map to the inherited version
      this.inheritObject(prototype, 'publishLC');
      // chain our instance attributes map to the inherited version
      this.inheritObject(prototype, '_instanceAttributes');
    },

    publishAttributes: function(prototype, base) {
      // merge names from 'attributes' attribute into the 'publish' object
      var attributes = this.getAttribute(ATTRIBUTES_ATTRIBUTE);
      if (attributes) {
        // create a `publish` object if needed.
        // the `publish` object is only relevant to this prototype, the 
        // publishing logic in `declaration/properties.js` is responsible for
        // managing property values on the prototype chain.
        // TODO(sjmiles): the `publish` object is later chained to it's 
        //                ancestor object, presumably this is only for 
        //                reflection or other non-library uses. 
        var publish = prototype.publish || (prototype.publish = {}); 
        // names='a b c' or names='a,b,c'
        var names = attributes.split(ATTRIBUTES_REGEX);
        // record each name for publishing
        for (var i=0, l=names.length, n; i<l; i++) {
          // remove excess ws
          n = names[i].trim();
          // looks weird, but causes n to exist on `publish` if it does not;
          // a more careful test would need expensive `in` operator
          if (n && publish[n] === undefined) {
            publish[n] = undefined;
          }
        }
      }
    },

    // record clonable attributes from <element>
    accumulateInstanceAttributes: function() {
      // inherit instance attributes
      var clonable = this.prototype._instanceAttributes;
      // merge attributes from element
      var a$ = this.attributes;
      for (var i=0, l=a$.length, a; (i<l) && (a=a$[i]); i++) {  
        if (this.isInstanceAttribute(a.name)) {
          clonable[a.name] = a.value;
        }
      }
    },

    isInstanceAttribute: function(name) {
      return !this.blackList[name] && name.slice(0,3) !== 'on-';
    },

    // do not clone these attributes onto instances
    blackList: {
      name: 1,
      'extends': 1,
      constructor: 1,
      noscript: 1,
      assetpath: 1,
      'cache-csstext': 1
    }
    
  };

  // add ATTRIBUTES_ATTRIBUTE to the blacklist
  attributes.blackList[ATTRIBUTES_ATTRIBUTE] = 1;

  // exports

  scope.api.declaration.attributes = attributes;

})(Polymer);

(function(scope) {

  // imports
  var events = scope.api.declaration.events;

  var syntax = new PolymerExpressions();
  var prepareBinding = syntax.prepareBinding;

  // Polymer takes a first crack at the binding to see if it's a declarative
  // event handler.
  syntax.prepareBinding = function(pathString, name, node) {
    return events.prepareEventBinding(pathString, name, node) ||
           prepareBinding.call(syntax, pathString, name, node);
  };

  // declaration api supporting mdv
  var mdv = {
    syntax: syntax,
    fetchTemplate: function() {
      return this.querySelector('template');
    },
    templateContent: function() {
      var template = this.fetchTemplate();
      return template && template.content;
    },
    installBindingDelegate: function(template) {
      if (template) {
        template.bindingDelegate = this.syntax;
      }
    }
  };

  // exports
  scope.api.declaration.mdv = mdv;

})(Polymer);

(function(scope) {

  // imports
  
  var api = scope.api;
  var isBase = scope.isBase;
  var extend = scope.extend;

  var hasShadowDOMPolyfill = window.ShadowDOMPolyfill;

  // prototype api

  var prototype = {

    register: function(name, extendeeName) {
      // build prototype combining extendee, Polymer base, and named api
      this.buildPrototype(name, extendeeName);
      // register our custom element with the platform
      this.registerPrototype(name, extendeeName);
      // reference constructor in a global named by 'constructor' attribute
      this.publishConstructor();
    },

    buildPrototype: function(name, extendeeName) {
      // get our custom prototype (before chaining)
      var extension = scope.getRegisteredPrototype(name);
      // get basal prototype
      var base = this.generateBasePrototype(extendeeName);
      // implement declarative features
      this.desugarBeforeChaining(extension, base);
      // join prototypes
      this.prototype = this.chainPrototypes(extension, base);
      // more declarative features
      this.desugarAfterChaining(name, extendeeName);
    },

    desugarBeforeChaining: function(prototype, base) {
      // back reference declaration element
      // TODO(sjmiles): replace `element` with `elementElement` or `declaration`
      prototype.element = this;
      // transcribe `attributes` declarations onto own prototype's `publish`
      this.publishAttributes(prototype, base);
      // `publish` properties to the prototype and to attribute watch
      this.publishProperties(prototype, base);
      // infer observers for `observe` list based on method names
      this.inferObservers(prototype);
      // desugar compound observer syntax, e.g. 'a b c' 
      this.explodeObservers(prototype);
    },

    chainPrototypes: function(prototype, base) {
      // chain various meta-data objects to inherited versions
      this.inheritMetaData(prototype, base);
      // chain custom api to inherited
      var chained = this.chainObject(prototype, base);
      // x-platform fixup
      ensurePrototypeTraversal(chained);
      return chained;
    },

    inheritMetaData: function(prototype, base) {
      // chain observe object to inherited
      this.inheritObject('observe', prototype, base);
      // chain publish object to inherited
      this.inheritObject('publish', prototype, base);
      // chain reflect object to inherited
      this.inheritObject('reflect', prototype, base);
      // chain our lower-cased publish map to the inherited version
      this.inheritObject('_publishLC', prototype, base);
      // chain our instance attributes map to the inherited version
      this.inheritObject('_instanceAttributes', prototype, base);
      // chain our event delegates map to the inherited version
      this.inheritObject('eventDelegates', prototype, base);
    },

    // implement various declarative features
    desugarAfterChaining: function(name, extendee) {
      // build side-chained lists to optimize iterations
      this.optimizePropertyMaps(this.prototype);
      this.createPropertyAccessors(this.prototype);
      // install mdv delegate on template
      this.installBindingDelegate(this.fetchTemplate());
      // install external stylesheets as if they are inline
      this.installSheets();
      // adjust any paths in dom from imports
      this.resolveElementPaths(this);
      // compile list of attributes to copy to instances
      this.accumulateInstanceAttributes();
      // parse on-* delegates declared on `this` element
      this.parseHostEvents();
      //
      // install a helper method this.resolvePath to aid in 
      // setting resource urls. e.g.
      // this.$.image.src = this.resolvePath('images/foo.png')
      this.addResolvePathApi();
      // under ShadowDOMPolyfill, transforms to approximate missing CSS features
      if (hasShadowDOMPolyfill) {
        WebComponents.ShadowCSS.shimStyling(this.templateContent(), name,
          extendee);
      }
      // allow custom element access to the declarative context
      if (this.prototype.registerCallback) {
        this.prototype.registerCallback(this);
      }
    },

    // if a named constructor is requested in element, map a reference
    // to the constructor to the given symbol
    publishConstructor: function() {
      var symbol = this.getAttribute('constructor');
      if (symbol) {
        window[symbol] = this.ctor;
      }
    },

    // build prototype combining extendee, Polymer base, and named api
    generateBasePrototype: function(extnds) {
      var prototype = this.findBasePrototype(extnds);
      if (!prototype) {
        // create a prototype based on tag-name extension
        var prototype = HTMLElement.getPrototypeForTag(extnds);
        // insert base api in inheritance chain (if needed)
        prototype = this.ensureBaseApi(prototype);
        // memoize this base
        memoizedBases[extnds] = prototype;
      }
      return prototype;
    },

    findBasePrototype: function(name) {
      return memoizedBases[name];
    },

    // install Polymer instance api into prototype chain, as needed 
    ensureBaseApi: function(prototype) {
      if (prototype.PolymerBase) {
        return prototype;
      }
      var extended = Object.create(prototype);
      // we need a unique copy of base api for each base prototype
      // therefore we 'extend' here instead of simply chaining
      api.publish(api.instance, extended);
      // TODO(sjmiles): sharing methods across prototype chains is
      // not supported by 'super' implementation which optimizes
      // by memoizing prototype relationships.
      // Probably we should have a version of 'extend' that is 
      // share-aware: it could study the text of each function,
      // look for usage of 'super', and wrap those functions in
      // closures.
      // As of now, there is only one problematic method, so 
      // we just patch it manually.
      // To avoid re-entrancy problems, the special super method
      // installed is called `mixinSuper` and the mixin method
      // must use this method instead of the default `super`.
      this.mixinMethod(extended, prototype, api.instance.mdv, 'bind');
      // return buffed-up prototype
      return extended;
    },

    mixinMethod: function(extended, prototype, api, name) {
      var $super = function(args) {
        return prototype[name].apply(this, args);
      };
      extended[name] = function() {
        this.mixinSuper = $super;
        return api[name].apply(this, arguments);
      }
    },

    // ensure prototype[name] inherits from a prototype.prototype[name]
    inheritObject: function(name, prototype, base) {
      // require an object
      var source = prototype[name] || {};
      // chain inherited properties onto a new object
      prototype[name] = this.chainObject(source, base[name]);
    },

    // register 'prototype' to custom element 'name', store constructor 
    registerPrototype: function(name, extendee) { 
      var info = {
        prototype: this.prototype
      }
      // native element must be specified in extends
      var typeExtension = this.findTypeExtension(extendee);
      if (typeExtension) {
        info.extends = typeExtension;
      }
      // register the prototype with HTMLElement for name lookup
      HTMLElement.register(name, this.prototype);
      // register the custom type
      this.ctor = document.registerElement(name, info);
    },

    findTypeExtension: function(name) {
      if (name && name.indexOf('-') < 0) {
        return name;
      } else {
        var p = this.findBasePrototype(name);
        if (p.element) {
          return this.findTypeExtension(p.element.extends);
        }
      }
    }

  };

  // memoize base prototypes
  var memoizedBases = {};

  // implementation of 'chainObject' depends on support for __proto__
  if (Object.__proto__) {
    prototype.chainObject = function(object, inherited) {
      if (object && inherited && object !== inherited) {
        object.__proto__ = inherited;
      }
      return object;
    }
  } else {
    prototype.chainObject = function(object, inherited) {
      if (object && inherited && object !== inherited) {
        var chained = Object.create(inherited);
        object = extend(chained, object);
      }
      return object;
    }
  }

  // On platforms that do not support __proto__ (versions of IE), the prototype
  // chain of a custom element is simulated via installation of __proto__.
  // Although custom elements manages this, we install it here so it's
  // available during desugaring.
  function ensurePrototypeTraversal(prototype) {
    if (!Object.__proto__) {
      var ancestor = Object.getPrototypeOf(prototype);
      prototype.__proto__ = ancestor;
      if (isBase(ancestor)) {
        ancestor.__proto__ = Object.getPrototypeOf(ancestor);
      }
    }
  }

  // exports

  api.declaration.prototype = prototype;

})(Polymer);

(function(scope) {

  /*

    Elements are added to a registration queue so that they register in 
    the proper order at the appropriate time. We do this for a few reasons:

    * to enable elements to load resources (like stylesheets) 
    asynchronously. We need to do this until the platform provides an efficient
    alternative. One issue is that remote @import stylesheets are 
    re-fetched whenever stamped into a shadowRoot.

    * to ensure elements loaded 'at the same time' (e.g. via some set of
    imports) are registered as a batch. This allows elements to be enured from
    upgrade ordering as long as they query the dom tree 1 task after
    upgrade (aka domReady). This is a performance tradeoff. On the one hand,
    elements that could register while imports are loading are prevented from 
    doing so. On the other, grouping upgrades into a single task means less
    incremental work (for example style recalcs),  Also, we can ensure the 
    document is in a known state at the single quantum of time when 
    elements upgrade.

  */
  var queue = {

    // tell the queue to wait for an element to be ready
    wait: function(element) {
      if (!element.__queue) {
        element.__queue = {};
        elements.push(element);
      }
    },

    // enqueue an element to the next spot in the queue.
    enqueue: function(element, check, go) {
      var shouldAdd = element.__queue && !element.__queue.check;
      if (shouldAdd) {
        queueForElement(element).push(element);
        element.__queue.check = check;
        element.__queue.go = go;
      }
      return (this.indexOf(element) !== 0);
    },

    indexOf: function(element) {
      var i = queueForElement(element).indexOf(element);
      if (i >= 0 && document.contains(element)) {
        i += (HTMLImports.useNative || HTMLImports.ready) ? 
          importQueue.length : 1e9;
      }
      return i;  
    },

    // tell the queue an element is ready to be registered
    go: function(element) {
      var readied = this.remove(element);
      if (readied) {
        element.__queue.flushable = true;
        this.addToFlushQueue(readied);
        this.check();
      }
    },

    remove: function(element) {
      var i = this.indexOf(element);
      if (i !== 0) {
        //console.warn('queue order wrong', i);
        return;
      }
      return queueForElement(element).shift();
    },

    check: function() {
      // next
      var element = this.nextElement();
      if (element) {
        element.__queue.check.call(element);
      }
      if (this.canReady()) {
        this.ready();
        return true;
      }
    },

    nextElement: function() {
      return nextQueued();
    },

    canReady: function() {
      return !this.waitToReady && this.isEmpty();
    },

    isEmpty: function() {
      for (var i=0, l=elements.length, e; (i<l) && 
          (e=elements[i]); i++) {
        if (e.__queue && !e.__queue.flushable) {
          return;
        }
      }
      return true;
    },

    addToFlushQueue: function(element) {
      flushQueue.push(element);  
    },

    flush: function() {
      // prevent re-entrance
      if (this.flushing) {
        return;
      }
      this.flushing = true;
      var element;
      while (flushQueue.length) {
        element = flushQueue.shift();
        element.__queue.go.call(element);
        element.__queue = null;
      }
      this.flushing = false;
    },

    ready: function() {
      // TODO(sorvell): As an optimization, turn off CE polyfill upgrading
      // while registering. This way we avoid having to upgrade each document
      // piecemeal per registration and can instead register all elements
      // and upgrade once in a batch. Without this optimization, upgrade time
      // degrades significantly when SD polyfill is used. This is mainly because
      // querying the document tree for elements is slow under the SD polyfill.
      var polyfillWasReady = CustomElements.ready;
      CustomElements.ready = false;
      this.flush();
      if (!CustomElements.useNative) {
        CustomElements.upgradeDocumentTree(document);
      }
      CustomElements.ready = polyfillWasReady;
      Polymer.flush();
      requestAnimationFrame(this.flushReadyCallbacks);
    },

    addReadyCallback: function(callback) {
      if (callback) {
        readyCallbacks.push(callback);
      }
    },

    flushReadyCallbacks: function() {
      if (readyCallbacks) {
        var fn;
        while (readyCallbacks.length) {
          fn = readyCallbacks.shift();
          fn();
        }
      }
    },
  
    /**
    Returns a list of elements that have had polymer-elements created but 
    are not yet ready to register. The list is an array of element definitions.
    */
    waitingFor: function() {
      var e$ = [];
      for (var i=0, l=elements.length, e; (i<l) && 
          (e=elements[i]); i++) {
        if (e.__queue && !e.__queue.flushable) {
          e$.push(e);
        }
      }
      return e$;
    },

    waitToReady: true

  };

  var elements = [];
  var flushQueue = [];
  var importQueue = [];
  var mainQueue = [];
  var readyCallbacks = [];

  function queueForElement(element) {
    return document.contains(element) ? mainQueue : importQueue;
  }

  function nextQueued() {
    return importQueue.length ? importQueue[0] : mainQueue[0];
  }

  function whenReady(callback) {
    queue.waitToReady = true;
    Polymer.endOfMicrotask(function() {
      HTMLImports.whenReady(function() {
        queue.addReadyCallback(callback);
        queue.waitToReady = false;
        queue.check();
    });
    });
  }

  /**
    Forces polymer to register any pending elements. Can be used to abort
    waiting for elements that are partially defined.
    @param timeout {Integer} Optional timeout in milliseconds
  */
  function forceReady(timeout) {
    if (timeout === undefined) {
      queue.ready();
      return;
    }
    var handle = setTimeout(function() {
      queue.ready();
    }, timeout);
    Polymer.whenReady(function() {
      clearTimeout(handle);
    });
  }

  // exports
  scope.elements = elements;
  scope.waitingFor = queue.waitingFor.bind(queue);
  scope.forceReady = forceReady;
  scope.queue = queue;
  scope.whenReady = scope.whenPolymerReady = whenReady;
})(Polymer);

(function(scope) {

  // imports

  var extend = scope.extend;
  var api = scope.api;
  var queue = scope.queue;
  var whenReady = scope.whenReady;
  var getRegisteredPrototype = scope.getRegisteredPrototype;
  var waitingForPrototype = scope.waitingForPrototype;

  // declarative implementation: <polymer-element>

  var prototype = extend(Object.create(HTMLElement.prototype), {

    createdCallback: function() {
      if (this.getAttribute('name')) {
        this.init();
      }
    },

    init: function() {
      // fetch declared values
      this.name = this.getAttribute('name');
      this.extends = this.getAttribute('extends');
      queue.wait(this);
      // initiate any async resource fetches
      this.loadResources();
      // register when all constraints are met
      this.registerWhenReady();
    },

    // TODO(sorvell): we currently queue in the order the prototypes are 
    // registered, but we should queue in the order that polymer-elements
    // are registered. We are currently blocked from doing this based on 
    // crbug.com/395686.
    registerWhenReady: function() {
     if (this.registered
       || this.waitingForPrototype(this.name)
       || this.waitingForQueue()
       || this.waitingForResources()) {
          return;
      }
      queue.go(this);
    },

    _register: function() {
      //console.log('registering', this.name);
      // warn if extending from a custom element not registered via Polymer
      if (isCustomTag(this.extends) && !isRegistered(this.extends)) {
        console.warn('%s is attempting to extend %s, an unregistered element ' +
            'or one that was not registered with Polymer.', this.name,
            this.extends);
      }
      this.register(this.name, this.extends);
      this.registered = true;
    },

    waitingForPrototype: function(name) {
      if (!getRegisteredPrototype(name)) {
        // then wait for a prototype
        waitingForPrototype(name, this);
        // emulate script if user is not supplying one
        this.handleNoScript(name);
        // prototype not ready yet
        return true;
      }
    },

    handleNoScript: function(name) {
      // if explicitly marked as 'noscript'
      if (this.hasAttribute('noscript') && !this.noscript) {
        this.noscript = true;
        // imperative element registration
        Polymer(name);
      }
    },

    waitingForResources: function() {
      return this._needsResources;
    },

    // NOTE: Elements must be queued in proper order for inheritance/composition
    // dependency resolution. Previously this was enforced for inheritance,
    // and by rule for composition. It's now entirely by rule.
    waitingForQueue: function() {
      return queue.enqueue(this, this.registerWhenReady, this._register);
    },

    loadResources: function() {
      this._needsResources = true;
      this.loadStyles(function() {
        this._needsResources = false;
        this.registerWhenReady();
      }.bind(this));
    }

  });

  // semi-pluggable APIs 

  // TODO(sjmiles): should be fully pluggable (aka decoupled, currently
  // the various plugins are allowed to depend on each other directly)
  api.publish(api.declaration, prototype);

  // utility and bookkeeping

  function isRegistered(name) {
    return Boolean(HTMLElement.getPrototypeForTag(name));
  }

  function isCustomTag(name) {
    return (name && name.indexOf('-') >= 0);
  }

  // boot tasks

  whenReady(function() {
    document.body.removeAttribute('unresolved');
    document.dispatchEvent(
      new CustomEvent('polymer-ready', {bubbles: true})
    );
  });

  // register polymer-element with document

  document.registerElement('polymer-element', {prototype: prototype});

})(Polymer);

(function(scope) {

/**
 * @class Polymer
 */

var whenReady = scope.whenReady;

/**
 * Loads the set of HTMLImports contained in `node`. Notifies when all
 * the imports have loaded by calling the `callback` function argument.
 * This method can be used to lazily load imports. For example, given a 
 * template:
 *     
 *     <template>
 *       <link rel="import" href="my-import1.html">
 *       <link rel="import" href="my-import2.html">
 *     </template>
 *
 *     Polymer.importElements(template.content, function() {
 *       console.log('imports lazily loaded'); 
 *     });
 * 
 * @method importElements
 * @param {Node} node Node containing the HTMLImports to load.
 * @param {Function} callback Callback called when all imports have loaded.
 */
function importElements(node, callback) {
  if (node) {
    document.head.appendChild(node);
    whenReady(callback);
  } else if (callback) {
    callback();
  }
}

/**
 * Loads an HTMLImport for each url specified in the `urls` array.
 * Notifies when all the imports have loaded by calling the `callback` 
 * function argument. This method can be used to lazily load imports. 
 * For example,
 *
 *     Polymer.import(['my-import1.html', 'my-import2.html'], function() {
 *       console.log('imports lazily loaded'); 
 *     });
 * 
 * @method import
 * @param {Array} urls Array of urls to load as HTMLImports.
 * @param {Function} callback Callback called when all imports have loaded.
 */
function _import(urls, callback) {
  if (urls && urls.length) {
      var frag = document.createDocumentFragment();
      for (var i=0, l=urls.length, url, link; (i<l) && (url=urls[i]); i++) {
        link = document.createElement('link');
        link.rel = 'import';
        link.href = url;
        frag.appendChild(link);
      }
      importElements(frag, callback);
  } else if (callback) {
    callback();
  }
}

// exports
scope.import = _import;
scope.importElements = importElements;

})(Polymer);

/**
 * The `auto-binding` element extends the template element. It provides a quick 
 * and easy way to do data binding without the need to setup a model. 
 * The `auto-binding` element itself serves as the model and controller for the 
 * elements it contains. Both data and event handlers can be bound. 
 *
 * The `auto-binding` element acts just like a template that is bound to 
 * a model. It stamps its content in the dom adjacent to itself. When the 
 * content is stamped, the `template-bound` event is fired.
 *
 * Example:
 *
 *     <template is="auto-binding">
 *       <div>Say something: <input value="{{value}}"></div>
 *       <div>You said: {{value}}</div>
 *       <button on-tap="{{buttonTap}}">Tap me!</button>
 *     </template>
 *     <script>
 *       var template = document.querySelector('template');
 *       template.value = 'something';
 *       template.buttonTap = function() {
 *         console.log('tap!');
 *       };
 *     <\/script>
 *
 * @module Polymer
 * @status stable
*/

(function() {

  var element = document.createElement('polymer-element');
  element.setAttribute('name', 'auto-binding');
  element.setAttribute('extends', 'template');
  element.init();

  Polymer('auto-binding', {

    createdCallback: function() {
      this.syntax = this.bindingDelegate = this.makeSyntax();
      // delay stamping until polymer-ready so that auto-binding is not
      // required to load last.
      Polymer.whenPolymerReady(function() {
        this.model = this;
        this.setAttribute('bind', '');
        // we don't bother with an explicit signal here, we could ust a MO
        // if necessary
        this.async(function() {
          // note: this will marshall *all* the elements in the parentNode
          // rather than just stamped ones. We'd need to use createInstance
          // to fix this or something else fancier.
          this.marshalNodeReferences(this.parentNode);
          // template stamping is asynchronous so stamping isn't complete
          // by polymer-ready; fire an event so users can use stamped elements
          this.fire('template-bound');
        });
      }.bind(this));
    },

    makeSyntax: function() {
      var events = Object.create(Polymer.api.declaration.events);
      var self = this;
      events.findController = function() { return self.model; };

      var syntax = new PolymerExpressions();
      var prepareBinding = syntax.prepareBinding;  
      syntax.prepareBinding = function(pathString, name, node) {
        return events.prepareEventBinding(pathString, name, node) ||
               prepareBinding.call(syntax, pathString, name, node);
      };
      return syntax;
    }

  });

})();
;


  Polymer('core-localstorage', {
    
    /**
     * Fired when a value is loaded from localStorage.
     * @event core-localstorage-load
     */
     
    /**
     * The key to the data stored in localStorage.
     *
     * @attribute name
     * @type string
     * @default null
     */
    name: '',
    
    /**
     * The data associated with the specified name.
     *
     * @attribute value
     * @type object
     * @default null
     */
    value: null,
    
    /**
     * If true, the value is stored and retrieved without JSON processing.
     *
     * @attribute useRaw
     * @type boolean
     * @default false
     */
    useRaw: false,
    
    /**
     * If true, auto save is disabled.
     *
     * @attribute autoSaveDisabled
     * @type boolean
     * @default false
     */
    autoSaveDisabled: false,
    
    attached: function() {
      // wait for bindings are all setup
      this.async('load');
    },
    
    valueChanged: function() {
      if (this.loaded && !this.autoSaveDisabled) {
        this.save();
      }
    },
    
    load: function() {
      var v = localStorage.getItem(this.name);
      if (this.useRaw) {
        this.value = v;
      } else {
        // localStorage has a flaw that makes it difficult to determine
        // if a key actually exists or not (getItem returns null if the
        // key doesn't exist, which is not distinguishable from a stored
        // null value)
        // however, if not `useRaw`, an (unparsed) null value unambiguously
        // signals that there is no value in storage (a stored null value would
        // be escaped, i.e. "null")
        // in this case we save any non-null current (default) value
        if (v === null) {
          if (this.value != null) {
            this.save();
          }
        } else {
          try {
            v = JSON.parse(v);
          } catch(x) {
          }
          this.value = v;
        }
      }
      this.loaded = true;
      this.asyncFire('core-localstorage-load');
    },
    
    /** 
     * Saves the value to localStorage.
     *
     * @method save
     */
    save: function() {
      var v = this.useRaw ? this.value : JSON.stringify(this.value);
      localStorage.setItem(this.name, v);
    }
    
  });

;

        Polymer('cwn-info-link', {
            // leave blank for stupid hack polymer team won't fix
            hack : '',
        });
    ;

        Polymer('cwn-dateslider', {
            numDays : 0,

            startDate : new Date(),
            endDate : new Date(),

            current : {
                start : new Date(),
                end : new Date()
            },

            dragging : null,
            dragStartX : 0,
            dragStartLeft : 0,
            otherStartLeft : 0,

            cWidth : 0,
            cBarWidth : 0,

            ready : function() {
                this.reset();

                $(this).on('mouseup mouseout touchend touchcancel', function(e){
                    this.endDrag(e.originalEvent);
                }.bind(this));
                $(this).on('mousemove touchmove', function(e){
                    this.onDrag(e.originalEvent);
                }.bind(this));

                $(window).on('resize', function() {
                    this.resize();
                }.bind(this));

                setTimeout(function(){
                    this.resize();
                }.bind(this),500);
            },

            reset : function() {
                this.startDate = this.start ? new Date(this.start) : new Date();
                this.stopDate = this.stop ? new Date(this.stop) : new Date();

                this.numDays = (this.stopDate - this.startDate)/(1000*60*60*24);

                this.current.start = this.startDate;
                this.current.end = this.endDate;
            },

            domReady : function() {
                setTimeout(function(){
                    this.resize();
                }.bind(this),1000);
            },

            resize : function() {
                if( this.numDays == 0 ) return;

                this.cWidth = this.shadowRoot.querySelector('.tabs').offsetWidth;

                var days = (this.current.start - this.startDate)/(1000*60*60*24);
                var leftPos = this.cWidth * (days / this.numDays);

                days = (this.current.end - this.startDate)/(1000*60*60*24);
                var rightPos = this.cWidth * (days / this.numDays);
                
                this.setLeftPos(leftPos);
                this.setRightPos(rightPos);

                this.$.startTab.innerHTML = this.current.start.toISOString().split('T')[0];
                this.$.endTab.innerHTML = this.current.end.toISOString().split('T')[0];
            },

            startDrag : function(e) {
                if( this.dragging ) return;

                this.cWidth = this.shadowRoot.querySelector('.tabs').offsetWidth;
                this.cBarWidth = this.$.slider.offsetWidth;

                this.dragging = e.currentTarget;
                this.dragStartLeft = parseInt(e.currentTarget.style.left || 0);
                this.dragStartX = this.getX(e);

                if( this.dragging.id == 'startTab' ) {
                    this.otherStartLeft = parseInt(this.$.endTab.style.left || 0 );
                } else if( this.dragging.id == 'endTab' ) {
                    this.otherStartLeft = parseInt(this.$.startTab.style.left || 0 );
                }
                console.log('Drag start: '+this.dragging.id);
            },

            onDrag : function(e) {
                if( this.dragging == null ) return;
                if( this.dragging.id == 'slider' ) return this.onSliderDrag(e);

                var pos = this.getPosition(e);

                var cDay = Math.floor(this.numDays * (pos / this.cWidth));
                var result = new Date(this.startDate);
                result.setDate(this.startDate.getDate() + cDay);

                this.dragging.innerHTML = result.toISOString().split('T')[0];

                if( this.dragging.id == 'startTab' ) {
                    this.setLeftPos(pos);
                } else if( this.dragging.id == 'endTab' ) {
                    this.setRightPos(pos);
                }
            },

            onSliderDrag : function(e) {
                var frontPos = this.getPosition(e);
                var backPos = this.cBarWidth + frontPos;

                if( backPos > this.cWidth ) return;

                //this.dragging.style.left = frontPos + 'px';
                //this.dragging.style.right = this.cWidth - backPos + 'px';

                this.setLeftPos(frontPos);
                this.setRightPos(backPos);

                //this.$.startTab.style.left = frontPos+'px';
                var cDay = Math.floor(this.numDays * (frontPos / this.cWidth));
                var result = new Date(this.startDate);
                result.setDate(this.startDate.getDate() + cDay);
                this.$.startTab.innerHTML = result.toISOString().split('T')[0];
                this.current.start = result;

                //this.$.endTab.style.left = backPos+'px';
                cDay = Math.floor(this.numDays * (backPos / this.cWidth));
                result = new Date(this.startDate);
                result.setDate(this.startDate.getDate() + cDay);
                this.$.endTab.innerHTML = result.toISOString().split('T')[0];
                this.current.end = result;
            },

            endDrag : function(e) {
                if( this.dragging == null ) return;
                console.log('Drag end: '+this.dragging.id);

                var pos = this.getPosition(e);
                var cDay = Math.floor(this.numDays * (pos / this.cWidth));

                var result = new Date(this.startDate);
                result.setDate(this.startDate.getDate() + cDay);
                
                if( this.dragging.id == 'startTab' ) this.current.start = result;
                else if( this.dragging.id == 'endTab' ) this.current.end = result;

                if( this.dragging.id != 'slider' ) {
                    this.dragging.innerHTML = result.toISOString().split('T')[0];
                }
                
                this.dragging = null;

                this.fire('values-changed', this.current);
            },

            setLeftPos : function(pos) {
                this.$.startTab.style.left = pos + 'px';
                this.$.startLine.style.left = pos + 'px';
                this.$.slider.style.left = pos + 'px';
            },

            setRightPos : function(pos) {
                this.$.endTab.style.left = pos + 'px';
                this.$.endLine.style.left = pos + 'px';

                pos = this.cWidth - pos;
                this.$.slider.style.right = pos + 'px';
            },

            getPosition : function(e) {
                var pos = this.dragStartLeft + (this.getX(e) - this.dragStartX);

                if( pos < 0 ) pos = 0;
                if( pos > this.cWidth ) pos = this.cWidth;

                if( this.dragging.id == 'startTab' && pos > this.otherStartLeft ) {
                    pos = this.otherStartLeft;
                } else if( this.dragging.id == 'endTab' && pos < this.otherStartLeft ) {
                    pos = this.otherStartLeft;
                } 

                return pos;
            },

            // keep track of last touch for trouch end
            lastTouchX : 0,
            getX : function(e) {
                if( e.x !== undefined ) return e.x;
                if( e.touches !== undefined ) {
                    if( e.touches.length > 0 ) {
                        this.lastTouchX = e.touches[0].screenX;
                        return e.touches[0].screenX;
                    } else {
                        // touchend... I hope
                        return this.lastTouchX;
                    }
                }                
                return 0; // bad
            }
        });
    ;
Polymer('cwn-icon');;

        Polymer('cwn-app-icon', {
            fillStyle : '#fffff',
            fillFromType : false,
            fontSize : 14,

            styles : {
              'Power Plant' : '#3366cc',
              'Agricultural Demand' : '#ff9900',
              'Junction' : '#109618',
              'Pump Plant' : '#990099',
              'Water Treatment' : '#0099c6',
              'Surface Storage' : '#dd4477',
              'Urban Demand' : '#66aa00',
              'Sink' : '#b82e2e',
              'Groundwater Storage' : '#316395',
              'Non-Standard Demand' : '#22aa99'
            },

            observe : {
                height : 'redraw',
                width : 'redraw',
                type : 'redraw'
            },

            attached : function() {
                this.redraw();
            },

            redraw : function() {
                this.fontSize = this.width-15;
                if( this.fontSize < 14 ) this.fontSize = 14;

                var ctx = this.$.canvas.getContext('2d');
                ctx.clearRect(0, 0, this.width, this.height);

                if( !CWN.render[this.type] ) return;
                CWN.render[this.type](ctx, 2, 2, this.width-4, this.height-4);
            },

            /*redraw : function() {
                this.fontSize = this.width-15;
                if( this.fontSize < 14 ) this.fontSize = 14;

                var c2 = this.$.canvas.getContext('2d');
                c2.clearRect(0, 0, this.width, this.height);

                var width = this.width - 4;
                var height = this.height - 4;

                var x = width / 2;
                var y = height / 2;
                var r = x;
                if( y < r ) r = y;
                  
                if( this.type == 'Junction' || this.type == 'Pump Plant' || this.type == 'Power Plant' ) {
                    this._circle(c2, x+2, y+2, r);
                } else if ( this.type == 'Water Treatment' ) {
                    this._polygon(c2, x+2, y+2, r, 6, 0);    
                } else if ( this.type == 'Surface Storage' || this.type == 'Groundwater Storage' ) {
                    this._polygon(c2, x+2, y+2, r, 3, 90);
                } else if ( this.type == 'Agricultural Demand' || this.type == 'Urban Demand' ) {
                    this._polygon(c2, x+2, y+2, r, 5, 18);    
                } else {
                    this._polygon(c2, x+2, y+2, r, 4, 45);
                }
            },

            _polygon : function(cxt, x, y, radius, sides, startAngle) {
                if (sides < 3) return;
                var a = (Math.PI * 2)/sides;
                var r = startAngle * (Math.PI / 180);
                cxt.beginPath();

                for (var i = 0; i <= sides; i++ ) {
                    if( i == 0 ) cxt.lineTo(x+radius*Math.cos(i*a-r), y + radius*Math.sin(i*a-r));
                    else cxt.lineTo(x+radius*Math.cos(i*a-r), y+radius*Math.sin(i*a-r));
                }
                cxt.closePath();

                if( this.fillFromType ) {
                    cxt.fillStyle = this.styles[this.type] || '#ffffff';
                } else {
                    cxt.fillStyle = this.fillStyle;
                }
                
                cxt.fill();

                cxt.strokeStyle = "#333";
                cxt.lineWidth = 1;
                cxt.stroke();
            },

            _circle : function(cxt, x, y, r) {
                cxt.beginPath();
                cxt.arc(x,y,r-2,0,2*Math.PI);
                cxt.closePath();

                if( this.fillFromType ) {
                    cxt.fillStyle = this.styles[this.type] || '#ffffff';
                } else {
                    cxt.fillStyle = this.fillStyle;
                }

                cxt.fill();

                cxt.strokeStyle = "#333";
                cxt.lineWidth = 1;
                cxt.stroke();
            }*/

        }); 
    ;

        Polymer('cwn-date-linechart',{
            dt : null,
            chart : null,
            height : 400,

            updateTimer : -1,

            observe : {
                label : 'redraw',
                xlabel : 'redraw',
                ylabel : 'redraw',
                height : 'redraw',
                data  : 'update',
                start : 'update',
                stop  : 'update'
            },

            options : null,
            type : null,
            cols : null,

            onLoadHandlerSet : false,

            ready : function() {
                $(window).on('resize', function(){
                    this.redraw();
                }.bind(this));
            },

            setOnloadHandler : function() {
                if( this.onLoadHandlerSet ) return;

                // put in global scope by cwn-datastore
                chartLoadHandlers.push(function(){
                    this.update();
                }.bind(this));
            },
            

            update : function() {
                if( !window.google.visualization ) return this.setOnloadHandler();
                if( !window.google.visualization.LineChart ) return this.setOnloadHandler();

                if( !this.chart ) {
                    if( this.type ) {
                        this.chart = new google.visualization[this.type](this.$.root);
                    } else {
                        this.chart = new google.visualization.LineChart(this.$.root);
                    }
                }

                if( !this.cols ) {
                    if( !this.data ) this.data = ['date', 'value'];
                    if( typeof this.data[0][1] != 'string' ) this.data.splice(0, 0, ['date', 'value']);
                }
                

                if( this.updateTimer == -1 ) clearTimeout(this.updateTimer);
                this.updateTimer = setTimeout(function() {
                    this.updateTimer = -1;
                    this._update();
                }.bind(this), 500);
            },

            _setDataTable : function(data) {
                if( this.cols ) {
                    this.dt = new google.visualization.DataTable();
                    for( var i = 0; i < this.cols.length; i++ ) {
                        this.dt.addColumn(this.cols[i]);
                    }
                    this.dt.addRows(data);
                } else {
                    this.dt = google.visualization.arrayToDataTable(data);
                }
            },

            _update : function() {
                if( !this.start && !this.stop ) {
                    this._setDataTable(this.data);
                    this.redraw();
                    return;
                }

                var filteredData;
                if( !this.cols ) {
                    filteredData = [this.data[0]];
                } else {
                    filteredData = [];
                }
                var d;
                for( var i = 1; i < this.data.length; i++ ) {
                    d = new Date(this.data[i][0]).getTime();

                    if( this.start && this.stop ) {
                        if( d >= this.start.getTime() && d <= this.stop.getTime() ) {
                            filteredData.push(this.data[i]);
                        }
                    } else if ( this.start ) {
                        if( d >= this.start.getTime() ) {
                            filteredData.push(this.data[i]);
                        }
                    } else {
                        if( d <= this.stop.getTime()  ) {
                            filteredData.push(this.data[i]);
                        }
                    }
                }

                this._setDataTable(filteredData);
                this.redraw();
            },

            redraw : function() {
                if( !this.chart || !this.dt ) return;

                var options = {
                    legend : {
                        position : 'none'
                    }
                };

                if( !this.options ) {
                    options.vAxis = {};
                    options.hAxis = {};

                    if( this.label && this.label != '' ) {
                        options.title = this.label;
                    }
                    if( this.xlabel && this.xlabel != '' ) {
                        options.hAxis.title = this.xlabel;
                    }
                    if( this.ylabel && this.ylabel != '' ) {
                        options.vAxis.title = this.ylabel;
                    }
                } else {
                    for( var key in this.options ) {
                        options[key] = this.options[key];
                    }
                }


                this.chart.draw(this.dt, options);
            }
        });
    ;

        Polymer('cwn-linechart',{
            dt : null,
            chart : null,
            height : 400,
            animate : false,

            updateTimer : -1,

            observe : {
                label : 'redraw',
                xlabel : 'redraw',
                ylabel : 'redraw',
                height : 'redraw',
                data  : 'update',
                start : 'update',
                stop  : 'update',
                options : 'update'
            },

            onLoadHandlerSet : false,

            options : null,
            cols : null,

            ready : function() {
                $(window).on('resize', function(){
                    this.redraw();
                }.bind(this));
            },

            setOnloadHandler : function() {
                if( this.onLoadHandlerSet ) return;

                // put in global scope by cwn-datastore
                chartLoadHandlers.push(function(){
                    this.update();
                }.bind(this));
            },
            

            update : function() {
                if( !window.google.visualization ) return this.setOnloadHandler();
                if( !window.google.visualization.LineChart ) return this.setOnloadHandler();

                if( !this.chart ) {
                    if( this.type ) {
                        this.chart = new google.visualization[this.type](this.$.root);
                    } else {
                        this.chart = new google.visualization.LineChart(this.$.root);
                    }
                }

                if( this.updateTimer == -1 ) clearTimeout(this.updateTimer);
                this.updateTimer = setTimeout(function() {
                    this.updateTimer = -1;
                    this._update();
                }.bind(this), 500);
            },

            _update : function() {
                if( this.cols ) {
                    this.dt = new google.visualization.DataTable();
                    for( var i = 0; i < this.cols.length; i++ ) {
                        this.dt.addColumn(this.cols[i]);
                    }
                    this.dt.addRows(this.data);
                } else {
                    this.dt = google.visualization.arrayToDataTable(this.data);
                }
                
                this.redraw();
            },

            redraw : function() {
                if( !this.chart || !this.dt ) return;

                var options = {
                    legend : {
                        position : 'none'
                    }
                };

                if( !this.options ) {
                    options.vAxis = {};
                    options.hAxis = {};

                    if( this.label && this.label != '' ) {
                        options.title = this.label;
                    }
                    if( this.xlabel && this.xlabel != '' ) {
                        options.hAxis.title = this.xlabel;
                    }
                    if( this.ylabel && this.ylabel != '' ) {
                        options.vAxis.title = this.ylabel;
                    }
                } else {
                    for( var key in this.options ) {
                        options[key] = this.options[key];
                    }
                }

                if( this.animate ) {
                    options.animation = {
                        duration : 750,
                        easing : 'out'
                    }
                }

                this.chart.draw(this.dt, options);
            }
        });
    ;

        Polymer('cwn-popup', {
            ele : {},
            target : null,
            label : '',
            initd : false,
          ready : function() {
            this.ele = {};
            this.target = {};
            this.lanel = '';
            this.initd = false;
          },
            targetChanged: function() {
                if( this.initd ) return;
                this.initd = true;
                this.ele = this.$.root;
                /*var children = this.childNodes;
                for( var i = 0; i < children.length; i++ ) {
                    this.removeChild(children[0]);
                    console.log(children[0]);
                    if( !children[0].classList ) continue;
                    if( children[0].classList.contains('popup-body') ) {
                        this.$.body.appendChild(children[0]);
                    } else if( children[0].classList.contains('popup-footer') ) {
                        this.$.footer.appendChild(children[0]);
                    }
                }*/
                var target = this.target.parentNode ? this.target : this;

                target.parentNode.removeChild(target);
                document.querySelector('body').appendChild(target);
                $(this.ele).modal({
              show:false,
              backdrop:'static'
            });
                
                $(this.querySelectorAll('[data-dismiss="modal"]'))
                    .on('click', function(){
                        this.hide();
                    }.bind(this));
            },
            show: function() {
                $(this.ele).modal('show');
            },
            hide: function() {
                $(this.ele).modal('hide');
            }
        });

+function ($) {
  'use strict';
  // MODAL CLASS DEFINITION
  // ======================
  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null
    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }
  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }
  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }
  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })
    this.$element.trigger(e)
    if (this.isShown || e.isDefaultPrevented()) return
    this.isShown = true
    this.escape()
    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))
    $(document.body).addClass('modal-open');
    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')
      // JM
      //if (!that.$element.parent().length) {
      //  that.$element.appendTo(document.body) // don't move modals dom position
      //}
      that.$element
        .show()
        .scrollTop(0)
      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }
      that.$element
        .addClass('in')
        .attr('aria-hidden', false)
      that.enforceFocus()
      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })
      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }
  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()
    e = $.Event('hide.bs.modal')
    this.$element.trigger(e)
    if (!this.isShown || e.isDefaultPrevented()) return
    this.isShown = false
    this.escape()
    $(document).off('focusin.bs.modal')
    $(document.body).removeClass('modal-open')
    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')
    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }
  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }
  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }
  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }
  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }
  Modal.prototype.backdrop = function (callback) {
    var animate = this.$element.hasClass('fade') ? 'fade' : ''
    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate
      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)
      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))
      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
      this.$backdrop.addClass('in')
      if (!callback) return
      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()
    } else if (callback) {
      callback()
    }
  }
  // MODAL PLUGIN DEFINITION
  // =======================
  var old = $.fn.modal
  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }
  $.fn.modal.Constructor = Modal
  // MODAL NO CONFLICT
  // =================
  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }
  // MODAL DATA-API
  // ==============
  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())
    if ($this.is('a')) e.preventDefault()
    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })
  // JM
  //$(document)
  //  .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
  //  .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })
}(jQuery);
    ;

        Polymer('cwn-app-layout', {
            initd : false,
            attached : function(){
                /*if( this.initd ) return;
                this.initd = true;

                var children = this.children.array();

                for( var i = 0; i < children.length; i++ ) {
                    if( children[i].hasAttribute('left-nav') || children[i].hasAttribute('right-nav') ) {
                        this.removeChild(children[i]);
                        var li = document.createElement('li');
                        li.appendChild(children[i]);

                        if( children[i].hasAttribute('left-nav') ) this.$.leftNav.appendChild(li);
                        else this.$.rightNav.appendChild(li);
                    }
                }*/
            }
        });
    ;

        Polymer('cwn-filters', {

            filterText : '',
            textTimer : -1,

            legendArr : [],
            iconSize : 22,

            filters : {
                calibrationMode : true,
                oneStepMode : true,
                text : '',
            },

            observe : {
                filterText : 'setTextTimer'
            },

            ready : function() {
                for( var key in this.legend ) {
                    this.filters[key.replace(' ','_').replace('-','_')] = true;
                    this.legendArr.push({
                        name : key,
                        checked : true
                    });
                }
            },

            _updateCheckbox : function(e) {
                var name = e.currentTarget.getAttribute('name');
                var value = $(e.currentTarget).is(':checked');
                this.filters[name.replace(' ','_').replace('-','_')] = value;
            },

            show : function() {
                setTimeout(function(){
                    this.$.root.classList.add('show');
                }.bind(this), 50);

                this.$.root.classList.add('open');
                this.classList.add('open');
                $('html, body').animate({ scrollTop: '0px' });
            },
            hide : function() {
                this.$.root.classList.remove('show');
                this.$.root.classList.remove('open');
                this.classList.remove('open');
            },
            toggle : function() {
                this.$.root.classList.toggle('open');
                this.classList.toggle('open');
                if( this.classList.contains('open') ) {
                    $('html, body').animate({ scrollTop: '0px' });
                    setTimeout(function(){
                        this.$.root.classList.add('show');
                    }.bind(this), 50);
                } else {
                    this.$.root.classList.remove('show');
                }
            },

            setTextTimer : function() {
                if( this.textTimer != -1 ) clearTimeout(this.textTimer);

                this.textTimer = setTimeout(function(){
                    this.textTimer = -1;
                    this.filters.text = this.filterText;
                }.bind(this), 1000);
            }
        });
    ;

        Polymer('cwn-datastore', {
            loading : true,
            islocal : false,
            
            network : 'default',

            data : {
                nodes : [],
                links : []
                /*default : {
                    links : [],
                    nodes : []
                },
                custom : {
                    links : [],
                    nodes : []
                }*/
            },
            // look up any node or terminal by prmname
            lookupMap : {},
            // look up any link origin name
            originLookupMap : {},
            terminalLookupMap : {},

            loadingCharts : true,
            chartLoadHandlers : [],

            ready : function() {
                // elements that need charts can push to this array callbacks for when charts are loaded
                window.chartLoadHandlers = this.chartLoadHandlers;
                window.ds = this;

                google.load("visualization", '1', {
                    packages:['corechart', 'table'],
                    callback : function() {
                        this.loadingCharts = false;
                        for( var i = 0; i < this.chartLoadHandlers.length; i++ ) {
                            this.chartLoadHandlers[i]();
                        }
                    }.bind(this)
                });

                Polymer.whenPolymerReady(this.init.bind(this));
            },

            init : function(callback) {
                this.reset();
                this.callback = callback;
                this.reload();
            },

            reset : function() {
                this.loading = true;
                this.data = {
                    nodes : [],
                    links : []
                    /*default : {
                        links : [],
                        nodes : []
                    },
                    custom : {
                        links : [],
                        nodes : []
                    }*/
                };
                this.lookupMap = {};
                this.originLookupMap = {};
                this.terminalLookupMap = {};
            },

            reload : function() {
                this.loadNetwork(this.network, function(err){
                    this.loading = false;
                    this.fire('loaded');
                    if( this.callback ) this.callback(err);
                }.bind(this));
            },

            loadNetwork : function(network, callback) {
                if( this.islocal ) {
                    this.loadFromFileSystem(callback);
                    return;
                }

                var url = window.location.protocol+'//'+window.location.host+'/rest/getNetwork';
                url += '?network='+network;

                $.ajax({
                    url : url,
                    success : function(resp) {
                        for( var i = 0; i < resp.nodes.length; i++ ) {
                            try {
                                d = JSON.parse(resp.nodes[i]);
                                this._processNode(d);
                            } catch (e) {
                                debugger;
                            }
                        }
                        for( var i = 0; i < resp.links.length; i++ ) {
                            try {
                                d = JSON.parse(resp.links[i]);
                                this._processLink(d);
                            } catch (e) {
                                debugger;
                            }
                        }

                        callback();
                        // we don't care about the custom network
                        /*if( this.network == 'default') {
                            callback();
                        } else {
                            // we want to load the default network
                            if( network == 'default' ) this.loadNetwork('default');
                            // we loaded the default network
                            else callback();
                        }*/
                    }.bind(this),
                    error : function(resp) {
                        alert('Error retrieving data from network: '+network);
                        callback(true);
                    }.bind(this)
                });
            },

            // cwne-fs-network-loader will be injected by the node-webkit app
            loadFromFileSystem : function(callback) {
                document.querySelector('cwne-fs-network-loader').run(function(resp){
                    for( var i = 0; i < resp.nodes.length; i++ ) {
                        this._processNode(resp.nodes[i]);
                    }
                    for( var i = 0; i < resp.links.length; i++ ) {
                        this._processLink(resp.links[i]);
                    }
                    callback();
                }.bind(this));
            },  

            _processNode : function(node) {
                if( !node ) return;
                if( !node.properties ) return;
                if( !node.properties.prmname ) return;

                this._markCalibrationNode(node);
                
                if( !this.lookupMap[node.properties.prmname] ) {
                    this.data.nodes.push(node);
                }

                this.lookupMap[node.properties.prmname] = node;

                //this.data.nodes.push(node);
                /*if( node.properties.network == 'default') {
                    this.data.default.nodes.push(node);
                } else {
                    this.data.custom.nodes.push(node);
                }*/
            },

            _processLink : function(link) {
                if( !link ) return;
                if( !link.properties ) return;
                if( !link.properties.prmname ) return;

                // mark if this node is a calibration or not
                this._markCalibrationNode(link);

                // set up render info flags for markers
                this._markLinkTypes(link);

                if( !this.lookupMap[link.properties.prmname] ) {
                    this.data.links.push(link);
                }

                this.lookupMap[link.properties.prmname] = link;

                // set the origin lookup map
                if( !this.originLookupMap[link.properties.origin] ) {
                    this.originLookupMap[link.properties.origin] = [link];
                } else {
                    this.originLookupMap[link.properties.origin].push(link);
                }

                // set the terminal lookup map
                if( !this.terminalLookupMap[link.properties.terminus] ) {
                    this.terminalLookupMap[link.properties.terminus] = [link];
                } else {
                    this.terminalLookupMap[link.properties.terminus].push(link);
                }


                //this.data.links.push(link);
                /*if( link.properties.network == 'default') {
                    this.data.default.links.push(link);
                } else {
                    this.data.custom.links.push(link);
                }*/
            },

            _markLinkTypes : function(link) {
                link.properties.renderInfo = {
                    cost : link.properties.hasCosts ? true : false,
                    amplitude : link.properties.amplitude ? true : false,
                    // TODO: parser needs to sheet shortcut for contraint type
                    // data will still need to be loaded on second call
                    constraints : link.properties.hasConstraints ? true : false,
                    environmental : link.properties.hasClimate ? true : false
                };

                // Flow to a sink
                if( this.lookupMap[link.properties.terminus] && 
                    this.lookupMap[link.properties.terminus].properties.type == 'Sink' ) {
                    link.properties.renderInfo.type = 'flowToSink';
                
                } else if( link.properties.type == 'Return Flow' ) {
                    link.properties.renderInfo.type = 'returnFlowFromDemand';

                } else if ( this._isGWToDemand(link) ) {
                    link.properties.renderInfo.type = 'gwToDemand';

                } else if( this.lookupMap[link.properties.origin] && 
                    this.lookupMap[link.properties.origin].properties.calibrationMode == 'in' ||
                    this.lookupMap[link.properties.origin].properties.calibrationMode == 'both' ) {

                    link.properties.renderInfo.type = 'artificalRecharge';
                } else {

                    link.properties.renderInfo.type = 'unknown';
                }

                // finally, mark the angle of the line, so we can rotate the icon on the
                // map accordingly
                var width = link.geometry.coordinates[1][0] - link.geometry.coordinates[0][0];
                var height = link.geometry.coordinates[1][1] - link.geometry.coordinates[0][1];
                link.properties.renderInfo.rotate =  Math.atan(width / height) * (180 / Math.PI);

            },

            _isGWToDemand : function(link) {
                var origin = this.lookupMap[link.properties.origin];
                var terminal = this.lookupMap[link.properties.terminal];

                if( !origin || !terminal ) return false;

                if( origin.properties.type != 'Groundwater Storage' ) return false;
                if( terminal.properties.type == 'Non-Standard Demand' || 
                    terminal.properties.type == 'Agricultural Demand' ||
                    terminal.properties.type == 'Urban Demand' ) return true;

                return false;
            },

            _markCalibrationNode : function(node) {
                if( node.properties.prmname.indexOf('_') > -1 ) {
                    var parts = node.properties.prmname.split('_');
                    if( !(parts[0].match(/^CN.*/) || parts[1].match(/^CN.*/)) ) {
                        return;
                    }
                } else if( !node.properties.prmname.match(/^CN.*/) ) {
                    return;
                }

                var hasIn = false;
                var hasOut = false;

                if( node.properties.terminals ) {
                    for( var i = 0; i < node.properties.terminals.length; i++ ) {
                        if( node.properties.terminals[i] != null ) {
                            hasOut = true;
                            break;
                        }
                    }
                }
                if( node.properties.origins ) {
                    for( var i = 0; i < node.properties.origins.length; i++ ) {
                        if( node.properties.origins[i] != null ) {
                            hasIn = true;
                            break;
                        }
                    }
                } 

                node.properties.calibrationNode = true;
                if( !hasIn && !hasOut ) return;
                
                if( hasIn && hasOut ) node.properties.calibrationMode = 'both';
                else if ( hasIn ) node.properties.calibrationMode = 'in';
                else if ( hasOut ) node.properties.calibrationMode = 'out';
            }
        })
    ;

        Polymer('cwn-info-page', {
            feature : {},

            hack : '',
            islocal : false,

            tableProperties : ['prmname'],

            // loading flags
            climateLoadError : false,
            costLoadError : false,
            climateLoading : false,
            costLoading : false,

            // have to do long lookup right now, is there are better way?
            origins : [],
            terminals : [],

            // render data.  Data in a format ready to draw above
            inflows : [],
            costs : {
              label : '',
              data : {},
              cost : 0, // for constant costs
              months : [],
              selected : 0
            },
            // Elevation / Area / Capacity charts
            eacChart : {
              type : 'ComboChart',
              cols : [
                {id: 'capacity', label: 'capacity', type: 'number'},
                {id: 'elevation', label: 'elevation', type: 'number'},
                {id: 'area', label: 'area', type: 'number'},
                {id: 'initial', type: 'number', label: 'initial'},
                {id: 'tooltip', type: 'string', role:'tooltip'}
              ],
              data : [],
              options : {
                hAxis : {
                  title : 'Capacity (kAF)'
                },
                vAxes : [
                  {title:'Elevation (ft)'}, // axis 0
                  {title:'Area (ac)'} // Axis 1
                ],
                seriesType: "bars",
                series :{
                  0: {type: "line", targetAxisIndex:0},
                  1: {type: "line", targetAxisIndex:1},
                  2: {targetAxisIndex: 0},
                },
                interpolateNulls : true,
                legend : {
                  position: 'top'
                }
              }
            },

            constraintChart : {
              constant: -1,
              label : '',
              isTimeSeries : false,
              cols : [
                {id:'date', type:'string'},
                {id:'upper_value', type:'number'},
                {id:'upper_interval', type:'number', role:'interval'},
                {id:'lower_interval', type:'number', role:'interval'},
                {id: 'tooltip', type: 'string', role:'tooltip'}
              ],
              data : [],
              options : {
                series: [{'color': '#F1CA3A'}],
                intervals: { 'style':'area' },
                vAxis : {
                  viewWindow:{ min: 0 }
                }
              }
            },

            months : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],

            // date filtering
            filters : {
              start : null,
              stop : null
            },

            observe : {
                feature : 'update',
                'ds.loading' : 'onLoad'
            },

            ready : function() {
              $(window).on('resize', this._updateSize.bind(this));
            },

            onLoad : function() {
              if( this.ds.loading ) return;

              var loc = window.location.hash.replace('#','').split('/');
              if( loc[0] == 'info' && loc.length > 1) {
                this.feature = this.ds.lookupMap[loc[1]];
              }

            },

            _updateSize : function() {
              var w = $(window).width();

              if( w < 992 ) {
                this.$.middleCol.style.marginTop = '0px';
                return;
              }
              
              var ele = $(this.$.middleCol);
              
              var h = ele.next().height();
              if( h < ele.prev().height() ) h = ele.prev().height();
              if( h < ele.height() ) h = ele.height();


              this.$.middleCol.style.marginTop = Math.floor(((h-ele.height()) / 2)) + 'px';
              
            },

            _lookupLink : function(origin, terminal) {
              for( var i = 0; i < this.ds.data.links.length; i++ ) {
                if( this.ds.data.links[i].properties.origin == origin && this.ds.data.links[i].properties.terminus == terminal ) {
                  return this.ds.data.links[i];
                }
              }
              return null;
            },

            update : function() {
              if( this.feature == null ) return alert('Feature not found');


              this.origins = [];
              this.terminals = [];

              var link;
              if( this.feature && this.feature.properties.origins ) {
                for( var i = 0; i < this.feature.properties.origins.length; i++ ) {
                  link = this._lookupLink(this.feature.properties.origins[i], this.feature.properties.prmname);
                  if( link ) {
                    this.origins.push({
                      name: this.feature.properties.origins[i], 
                      link: link.properties.prmname,
                      description: this.ds.lookupMap[this.feature.properties.origins[i]] ? 
                                    this.ds.lookupMap[this.feature.properties.origins[i]].properties.description : ''
                    });
                  } else {
                    this.origins.push({name: this.feature.properties.origins[i], link: '', description: ''});
                  }
                }
              }

              if( this.feature && this.feature.properties.terminals ) {
                for( var i = 0; i < this.feature.properties.terminals.length; i++ ) {
                  link = this._lookupLink(this.feature.properties.prmname, this.feature.properties.terminals[i]);
                  if( link ) {
                    this.terminals.push({
                      name: this.feature.properties.terminals[i], 
                      link: link.properties.prmname,
                      description: this.ds.lookupMap[this.feature.properties.terminals[i]] ? 
                                    this.ds.lookupMap[this.feature.properties.terminals[i]].properties.description : ''
                    });
                  } else {
                    this.terminals.push({name: this.feature.properties.terminals[i], link: '', description: ''});
                  }
                }
              }

              this.climateLoadError = false;
              this.costLoadError = false;
              this.climateLoading = false;
              this.costLoading = false;

              this.eacChart.data = [];
              this.constraintChart.data = [];
              this.constraintChart.isTimeSeries = false;
              this.constraintChart.constant = -1;
              this.constraintChart.label = '';

              this.loadClimateData();
              this.loadCostData();

              setTimeout(this._updateSize.bind(this), 100);
            },

            /*loadClimateData : function() {
              if( !this.feature.properties.hasClimate ) return;
              this.climateLoading = true;
              this.inflows = [];

              var query;
              if( this.feature.properties.type == 'Diversion' || this.feature.properties.type == 'Return Flow' ) {
                query = 'MATCH (n)-[r { prmname: "'+this.feature.properties.prmname+'" }]->() RETURN r.climate';
              } else {
                query ='MATCH (n { prmname: "'+this.feature.properties.prmname+'" }) RETURN n.climate';
              }

              $.ajax({
                  type : 'POST',
                  url : this.settings.neo4jUrl+'/cypher',
                  data : {
                      query : query,
                      params : {}
                  },
                  success : function(resp) {
                    this.climateLoading = false;
                    if( resp.data.length == 0 ) return this.climateLoadError = true;

                    this.renderClimateData(JSON.parse(resp.data[0][0]));
                    this.async(function(){
                      this.$.dateslider.resize();
                    });
                  }.bind(this),
                  error : function(resp) {
                    this.climateLoadError = true;
                  }.bind(this)
              });
            },*/

            loadClimateData : function() {
              if( !this.feature.properties.hasClimate ) return;
              this.climateLoading = true;
              this.inflows = [];

              var type;
              if( this.feature.properties.type == 'Diversion' || this.feature.properties.type == 'Return Flow' ) {
                type = 'link';
              } else {
                type = 'node';
              }

              var params = '?prmname='+ this.feature.properties.prmname +
                '&type=' + type + '&attribute=climate'

              $.ajax({
                  url : '/rest/getAttribute'+params,
                  success : function(resp) {
                    this.climateLoading = false;
                    if( !resp.climate ) return this.climateLoadError = true;

                    this.renderClimateData(JSON.parse(resp.climate));
                    this.async(function(){
                      this.$.dateslider.resize();
                    });
                  }.bind(this),
                  error : function(resp) {
                    this.climateLoadError = true;
                  }.bind(this)
              });
            },

            renderClimateData : function(data) {

              if( data.inflows ) {
                for( var i = 0; i < data.inflows.length; i++ ) {
                  var inflow = {
                    label : data.inflows[i].name,
                    data : []
                  };
                  for( var j = 0; j < data.inflows[i].date.length; j++ ) {
                    inflow.data.push([data.inflows[i].date[j], data.inflows[i].inflow[j]]);
                  }
                  this.inflows.push(inflow);
                }
              }

              this.eacChart.data = [];
              if( data.el_ar_cap ) {
                
                var max = 0;
                for( var i = 0; i < data.el_ar_cap.length; i++ ) {
                  this.eacChart.data.push([
                    data.el_ar_cap[i].capacity,
                    data.el_ar_cap[i].elevation,
                    data.el_ar_cap[i].area,
                    null,
                    null
                  ]);
                  if( data.el_ar_cap[i].elevation > max ) max = data.el_ar_cap[i].elevation;
                }

                if( this.feature.properties.initialstorage ) {
                  this.eacChart.data.push([
                    this.feature.properties.initialstorage,
                    null,
                    null,
                    max,
                    'Initial: '+this.feature.properties.initialstorage
                  ]);
                }

                this.eacChart.data.sort(function(a,b){
                  if( a[0] > b[0] ) return 1;
                  if( a[0] < b[0] ) return -1;
                  return 0;
                });
              }



            },

            /*loadCostData : function() {
              if( !this.feature.properties.hasCosts ) return;
              this.costLoading = true;
              this.costLoadError = false;

              var query;
              if( this.feature.properties.type == 'Diversion' || this.feature.properties.type == 'Return Flow' ) {
                query = 'MATCH (n)-[r { prmname: "'+this.feature.properties.prmname+'" }]->() RETURN r.costs';
              } else {
                query ='MATCH (n { prmname: "'+this.feature.properties.prmname+'" }) RETURN n.costs';
              }

              $.ajax({
                  type : 'POST',
                  url : this.settings.neo4jUrl+'/cypher',
                  data : {
                      query : query,
                      params : {}
                  },
                  success : function(resp) {
                    this.costLoading = false;
                    if( resp.data.length == 0 ) return this.costLoadError = true;

                    this.renderCostData(JSON.parse(resp.data[0][0]));
                  }.bind(this),
                  error : function(resp) {
                    this.costLoadError = true;
                  }.bind(this)
              });
            },*/

            loadCostData : function() {
              if( !this.feature.properties.hasCosts ) return;
              this.costLoading = true;
              this.costLoadError = false;

              var type;
              if( this.feature.properties.type == 'Diversion' || this.feature.properties.type == 'Return Flow' ) {
                type = 'link';
              } else {
                type = 'node';
              }

              var params = '?prmname='+ this.feature.properties.prmname +
                '&type=' + type + '&attribute=costs'

              $.ajax({
                  url : '/rest/getAttribute'+params,
                  success : function(resp) {
                    this.costLoading = false;
                    if( !resp.costs ) return this.costLoadError = true;

                    this.renderCostData(JSON.parse(resp.costs));
                  }.bind(this),
                  error : function(resp) {
                    this.costLoadError = true;
                  }.bind(this)
              });
            },

            renderCostData : function(d) {
              if( d.constraints ) this.renderConstraints(d.constraints);

              if( !d.costs ) return;

              this.costs.label = d.costs.type;
              this.costs.data = {};
              this.costs.months = [];
              this.costs.selected = 0;

              this.costs.cost = d.costs.cost;

              if( !d.costs.costs ) return;
              if( d.costs.costs.length == 0 ) return;

              for( var i = 0; i < d.costs.costs.length; i++ ) {
                var m = d.costs.costs[i];

                var label = m.label;
                if( (!label || label == '') && i < 12 ) label = this.months[i];

                this.costs.data[label] = [];
                this.costs.months.push(label);

                for( var j = 0; j < m.costs.length; j++ ) {
                  this.costs.data[label].push([
                    m.costs[j].capacity,
                    m.costs[j].cost
                  ]);
                }

                this.costs.data[label].sort(function(a, b){
                  if( a[0] > b[0] ) return 1;
                  if( a[0] < b[0] ) return -1;
                  return 0;
                });
                this.costs.data[label].splice(0,0, ['Capacity','Cost']);

              }

            },

            renderConstraints : function(constraints) {
              console.log(constraints);


              if( constraints.constraint_type == 'Bounded' ) {
                var length = this.getContraintsLength(constraints);
                if( length < 12 ) length = 12;

                for( var i = 0; i < length; i++ ) {
                  this.constraintChart.data.push(this.getConstraintRow(constraints, i));
                }

              } else if( constraints.constraint_type == 'Constrained' ) {

                if( constraints.constraint.bound_type == 'Constant') {
                  this.constraintChart.constant = constraints.constraint.bound;
                } else if( constraints.constraint.bound_type == 'Monthly') {
                  for( var i = 0; i < 12; i++ ) {
                    this.constraintChart.data.push([
                      this.months[i],
                      constraints.constraint.bound[i],
                      null,
                      null,
                      'Constrained: '+constraints.constraint.bound[i]
                    ]);
                  }
                } if( constraints.constraint.bound_type == 'TimeSeries') {

                  this.constraintChart.isTimeSeries = true;
                  for( var i = 0; i < constraints.constraint.bound.length; i++ ) {
                    this.constraintChart.data.push([
                      constraints.constraint.date[i],
                      constraints.constraint.bound[i],
                      null,
                      null,
                      'Constrained: '+constraints.constraint.bound[i]
                    ]);
                  }

                }

              } else {
                console.log('Unknown Constraint Type: '+constraints.constraint_type);
              }
            },

            getConstraintRow : function(constraints, index) {
              var row = [];

              if( constraints.lower && constraints.lower.bound_type == 'TimeSeries' ) {
                row.push(constraints.lower.date[index]);
              } else if ( constraints.upper && constraints.upper.bound_type == 'TimeSeries' ) {
                row.push(constraints.upper.date[index]);
              } else {
                row.push(this.months[index]);
              }

              var tooltip = row[0]+'\n';

              if( constraints.upper ) {
                if( constraints.upper.bound_type == 'Constant' ) {
                  row.push(constraints.upper.bound);
                  row.push(constraints.upper.bound);
                  tooltip += 'Upper: '+constraints.upper.bound;
                } else if ( constraints.upper.bound_type == 'TimeSeries' || constraints.upper.bound_type == 'Monthly') {
                  var i = index;
                  if( i > 11 && constraints.upper.bound_type == 'Monthly' ) {
                    i = parseInt(row[0].split("-")[1])-1;
                  }

                  row.push(constraints.upper.bound[i]);
                  row.push(constraints.upper.bound[i]);
                  tooltip += 'Upper: '+constraints.upper.bound[i];
                } else if ( constraints.upper.bound_type == 'None' ) {
                  tooltip += 'Upper: None';
                }
              }

              if( constraints.lower ) {

                if( constraints.lower.bound_type == 'Constant' ) {
                  row.push(constraints.lower.bound);
                  tooltip += ', Lower: '+constraints.lower.bound;
                } else if ( constraints.lower.bound_type == 'TimeSeries' || constraints.lower.bound_type == 'Monthly' ) {
                  var i = index;
                  if( i > 11 && constraints.upper.bound_type == 'Monthly' ) {
                    i = parseInt(row[0].split("-")[1])-1;
                  }

                  row.push(constraints.lower.bound[i]);
                  tooltip += ', Lower: '+constraints.lower.bound[i];
                } else if ( constraints.lower.bound_type == 'None' ) {
                  row.push(0);
                  tooltip += ', Lower: 0';
                } else {
                   tooltip += ', Lower: Unknown';
                }

              } 

              while(row.length < 4) row.push(null);

              row.push(tooltip);

              return row;
            },

            getContraintsLength : function(constraints) {
              var l = 0;
              if( constraints.lower ) {
                if( constraints.lower.bound_type == 'Constant' ) {
                  l = 1;
                } else if ( constraints.lower.bound_type == 'TimeSeries' ) {
                  this.constraintChart.isTimeSeries = true;
                  l = constraints.lower.bound.length;
                } else if ( constraints.lower.bound_type == 'Monthly' ) {
                  l = constraints.lower.bound.length;
                }
              }
              if (constraints.upper ) {
                if( constraints.upper.bound_type == 'Constant' && l == 0 ) {
                  l = 1;
                } else if(constraints.upper.bound_type == 'TimeSeries' && l < constraints.upper.bound.length ) {
                  this.constraintChart.isTimeSeries = true;
                  l = constraints.upper.bound.length;
                } else if ( constraints.upper.bound_type == 'Monthly' && l < constraints.upper.bound.length ) {
                  l = constraints.upper.bound.length;
                }
              }
              return l;
            },

            updateDateFilters : function(e) {
              this.filters.start = e.detail.start;
              this.filters.stop = e.detail.end;
            },  

            back : function() {
              window.location.hash = 'map'
            },

            _setCostMonth : function(e) {
              var index = parseInt(e.currentTarget.getAttribute('index'));
              this.costs.selected = index;
            },

            goTo : function() {
              window.location.hash = 'map';
              this.async(function() {
                var pts = this.feature.geometry.coordinates;
                this.leaflet.setView([pts[1], pts[0]], 12);
              });
            },

            goToGraph : function() {
              window.location.hash = 'graph/'+this.feature.properties.prmname;
            }

        });
    ;

        Polymer('cwn-settings', {

            legendArr : [],
            iconSize : 22,

            dbType : 'default',
            cypherType : 'default',
            defaultServer : 'http://watershed.ice.ucdavis.edu/neo4jdb/data',
            
            // response info from a custom query
            showInfo : false,
            respInfo : null,

            settings : {
                neo4jUrl : '',
                cypherQuery : ''
            },

            observe : {
                dbType : 'onDbTypeChange',
                'settings.neo4jUrl' : 'save'
            },

            
            onDbTypeChange : function() {
                if( this.dbType == 'default' ) this.settings.neo4jUrl = this.defaultServer;

                this.$.storage.save();
            },

            onLocalStorageLoad : function() {
                if( this.settings.neo4jUrl == '' ) this.settings.neo4jUrl = this.defaultServer;
                if( this.settings.neo4jUrl != this.defaultServer ) {
                    this.dbType = 'custom';
                }

                this.ds.init();
            },

            save : function() {
                this.$.storage.save();
            },

            onCypherInputKey : function(e) {
                if( e.which == 13 ) this.reloadData();
            },

            reloadData : function() {
                this.$.reloadBtn.classList.add('disabled');
                this.$.reloadBtn.innerHTML = '<cwn-icon icon="fa-refresh fa-spin"></cwn-icon> Loading...'

                if( this.cypherType == 'default' ) {
                    this.ds.reload(this.onDataLoaded.bind(this));
                    return;
                }

                var query = this.settings.cypherQuery.replace(/return/i, 'RETURN');
                if( !query.match(/.*RETURN.*/) ) {
                    this.onDataLoaded();
                    return alert('You must provide a RETURN clause');
                }

                // need to make sure that only the geojson property is returned, regardless of what the user provides
                var parts = query.split("RETURN");
                var returns = parts[1].replace(/\s/g, '').split(',');
                for( var i = 0; i < returns.length; i++ ) {
                    returns[i] = returns[i].replace(/\..*/,'') + '.geojson'
                }
                query = parts[0]+' RETURN '+returns.join(', ');
                console.log(query);

                this.ds.reload(query, this.onDataLoaded.bind(this));
            },

            onDataLoaded : function(err, info) {
                if( info ) {
                    this.showInfo = true;
                    this.respInfo = info;
                } else {
                    this.showInfo = false;
                }

                this.$.reloadBtn.classList.remove('disabled');
                this.$.reloadBtn.innerHTML = '<cwn-icon icon="fa-refresh"></cwn-icon> Reload Data';
            },

            show : function() {
                setTimeout(function(){
                    this.$.root.classList.add('show');
                }.bind(this), 50);

                this.$.root.classList.add('open');
                this.classList.add('open');
                $('html, body').animate({ scrollTop: '0px' });
            },
            hide : function() {
                this.$.root.classList.remove('show');
                this.$.root.classList.remove('open');
                this.classList.remove('open');
            },
            toggle : function() {
                this.$.root.classList.toggle('open');
                this.classList.toggle('open');
                if( this.classList.contains('open') ) {
                    $('html, body').animate({ scrollTop: '0px' });
                    setTimeout(function(){
                        this.$.root.classList.add('show');
                    }.bind(this), 50);
                } else {
                    this.$.root.classList.remove('show');
                }
            }
        });
    ;

        Polymer('cwn-graph', {
            ds : null,
            hack : '',

            maxDepth : '6',
            negativeDepth : '0',
            graph : null,
            graphJson : {},
            updateTimer : -1,
            prmname : '',
            popupNode : {},

            nodeLevels : {},
            negativeLevels : {},
            cnodes : [],

            observe : {
                ds : 'update',
                'ds.data.nodes' : 'update',
                'ds.data.links' : 'update',
                'prmname' : 'update',
                'maxDepth' : 'update',
                'negativeDepth' : 'update'
            },

            ready : function() {
                //this.$.popup.target = this;
                $(window).on('hashchange', this.changeNode.bind(this));
                this.changeNode();
            },

            changeNode : function() {
                var loc = window.location.hash.replace('#','').split('/');
                if( loc[0] == 'graph' ) {
                    this.async(function(){
                        this.prmname = loc.length == 1 ? this.ds.data.nodes[0] : loc[1];
                    });

                    // make sure it was drawn correctly
                    setTimeout(function(){
                         this.graph.refresh();
                    }.bind(this), 500);
                    setTimeout(function(){
                         this.graph.refresh();
                    }.bind(this), 1000);
                }
            },

            update : function() {
                if( !this.ds ) return;
                if( this.prmname == '' ) return;
                
                this.reset();

                var t1 = new Date().getTime();

                this.walk(this.prmname, 0, 'forward');

                var t2 = new Date().getTime();

                // check max depth
                if( this.negativeDepth && this.negativeDepth.length > 0 ) {
                    if( 0 < parseInt(this.negativeDepth) ) {
                        this.walk(this.prmname, 0, 'backward');
                    }
                }

                var t3 = new Date().getTime();

                // make sure all links for all node are in tree
                this._addMissingLinks();

                var t4 = new Date().getTime();
                console.log('positive walk time: '+(t4-t1)+'ms');
                console.log('negative walk time: '+(t4-t2)+'ms');
                console.log('missing check time: '+(t4-t3)+'ms');


                this.setPositions();
            },

            reset : function() {
                this.graphJson = {
                    nodes : [],
                    edges : []
                };
                this.nodeLevels = {};
                this.negativeLevels = {};
                this.cnodes = [];
            },

            walk : function(prmname, level, direction) {
                // has this node already been added to the graph?
                //if( this.cnodes.indexOf(prmname) != -1 ) {
                    // if we are walking backward, we need to process the first node again
                //    if( direction == 'forward' || level != 0 ) return;
                //}

                // does the node actually exist?
                if( !this.ds.lookupMap[prmname] ) return;

                var node = this.ds.lookupMap[prmname];
                // is the node hidden (ie been filtered out)
                if( node.properties._render && !node.properties._render.show && level != 0 ) {
                    return;
                }

                // add the node, unless this is level 0 and we are walking backward
                if( (direction == 'forward' || level != 0) && this.cnodes.indexOf(prmname) == -1  ) {
                    this._addNode(node, level, direction);
                }

                // find the links by using the datastores lookup indexes
                var links;
                if( direction == 'forward' ) {
                    if( !this.ds.originLookupMap[prmname] ) return;
                    links = this.ds.originLookupMap[prmname];
                } else {
                    if( !this.ds.terminalLookupMap[prmname] ) return;
                    links = this.ds.terminalLookupMap[prmname];
                }

                // check max depth, quit if we have passed it
                if( direction == 'forward' ) {
                    if( this.maxDepth && this.maxDepth.length > 0 ) {
                        if( level >= parseInt(this.maxDepth) ) {
                            return;
                        }
                    }
                } else {
                    if( this.negativeDepth && this.negativeDepth.length > 0 ) {
                        if( level >= parseInt(this.negativeDepth) ) {
                            return;
                        }
                    }
                }
  

                // increase the level
                level++;
                // add the links to the graph
                for( var i = 0; i < links.length; i++ ) {
                    this._addLink(links[i], level, direction);
                }
            },


            _addNode : function(node, level, direction) {
                if( this.cnodes.indexOf(node.properties.prmname) != -1 ) {
                    console.log('found repeat: '+node.properties.prmname);
                    return;
                }

                var gnode = {
                    id : node.properties.prmname,
                    calvin : node.properties,
                    label : node.properties.prmname,
                    type : node.properties.type,
                    size : 8,
                };

                // set the graph node to the list at the current later
                // this list will be used later on to render the nodes location
                if( direction == 'forward' ) {
                    if( !this.nodeLevels[level] ) {
                        this.nodeLevels[level] = [gnode];
                    } else {
                        this.nodeLevels[level].push(gnode);
                    }
                } else {
                    if( !this.negativeLevels[level] ) {
                        this.negativeLevels[level] = [gnode];
                    } else {
                        this.negativeLevels[level].push(gnode);
                    }
                }

                // add the nodes name to the list of nodes already in the graph
                this.cnodes.push(node.properties.prmname);
                // add the node to the graph
                this.graphJson.nodes.push(gnode);
            },

            _addLink : function(link, level, direction) {
                // get the links next node
                var tNode = this.ds.lookupMap[direction == 'forward' ? link.properties.terminus : link.properties.origin];
                // make sure the next node exists
                if( !tNode ) return;
                
                // make sure the next node is being shown
                if( tNode.properties._render && !tNode.properties._render.show ) {
                    this._followLink(link, level, direction);
                    return;
                }

                // make sure the link hasn't already been added
                if( this.cnodes.indexOf(link.properties.prmname) != -1 ) {
                    this._followLink(link, level, direction);
                    return;
                }

                var edge = this._createEdge(link);

                // add the link to the graph
                this.graphJson.edges.push(edge);

                // add to the list of nodes/links already used
                this.cnodes.push(link.properties.prmname);

                this._followLink(link, level, direction);
            },

            _followLink : function(link, level, direction) {
                // walk the next node in the graph
                if( direction == 'forward' ) {
                    this.walk(link.properties.terminus, level, direction);
                } else {
                    this.walk(link.properties.origin, level, direction);
                }
            },

            _createEdge : function(link) {
                return {
                    id : link.properties.prmname,
                    label : link.properties.prmname,
                    calvin : link.properties,
                    type : 'cwn',
                    source : link.properties.origin,
                    target : link.properties.terminus,
                    color: 'blue'
                };
            },

            // if we are at max depth (positive or negative) we still want add links for the
            // node where the given node links back to nodes we have already added
            _addMissingLinks : function() {
                var i, n, link;
                for( i = 0; i < this.graphJson.nodes.length; i++ ) {
                    n = this.graphJson.nodes[i];

                    links = this.ds.originLookupMap[n.id] || [];
                    for( var j = 0; j < links.length; j++ ) {
                        this._addLinkIfMissing(links[j]);
                    }
                    links = this.ds.terminalLookupMap[n.id] || [];
                    for( var j = 0; j < links.length; j++ ) {
                        this._addLinkIfMissing(links[j]);
                    }
                }
            },

            _addLinkIfMissing : function(link) {
                if( this.cnodes.indexOf(link.properties.origin) != -1 &&
                    this.cnodes.indexOf(link.properties.terminus) != -1 &&
                    this.cnodes.indexOf(link.properties.prmname) == -1 ) {

                    var edge = this._createEdge(link);

                    // add the link to the graph
                    this.graphJson.edges.push(edge);

                    // add to the list of nodes/links already used
                    this.cnodes.push(edge.id);
                }
            },

            // set the position for all nodes in the graph
            setPositions : function() {
                var nLevelCount = Object.keys(this.negativeLevels).length;
                var w = $(this.$.sigma).width();
                var top = nLevelCount * 75;

                for( var level in this.negativeLevels ) {
                    var row = this.negativeLevels[level];
                    var width = w / row.length;
                    var left = width / 2;
                    if( level > 0 ) left -= Math.random() * 30;

                    for( var i = 0; i < row.length; i++ ) {
                        row[i].x = left;
                        row[i].y = top-75;
                        left += width;
                    }

                    top -= 75;
                }
 
                top = nLevelCount * 75;

                for( var level in this.nodeLevels ) {
                    var row = this.nodeLevels[level];
                    var width = w / row.length;
                    var left = width / 2;
                    if( level > 0 ) left -= Math.random() * 30;

                    for( var i = 0; i < row.length; i++ ) {
                        row[i].x = left;
                        row[i].y = top;
                        left += width;
                    }

                    top += 75;
                }

                //console.log(this.prmname);
                //console.log(this.negativeLevels);
                //console.log(this.nodeLevels);
                console.log(this.graphJson);

                this.render();
            },

            render : function() {
                if( !this.graph ) {
                    this.graph = new sigma({ 
                        graph: this.graphJson,
                        renderer : {
                            container: this.$.sigma,
                            type : 'canvas'
                        },
                        settings: {
                            defaultNodeColor: '#ec5148',
                            minArrowSize : 6,
                            minNodeSize: 10
                        }
                    });
                    this.graph.bind('clickNode', function(e){
                        //window.location.hash = 'graph/'+e.data.node.id;
                        this.popupNode = this.ds.lookupMap[e.data.node.id];
                        this.$.popup.show();
                    }.bind(this));
                } else {
      
                    this.graph.graph.clear();
                    this.graph.graph.read(this.graphJson);
                    // Refresh the display:
                    this.graph.refresh();
                }
                // ForceAtlas Layout
                //this.graph.startForceAtlas2();
            },

            goTo : function() {
                window.location.hash = 'map';
                setTimeout(function() {
                    var pts = this.popupNode.geometry.coordinates;
                    var ele =document.querySelector('html /deep/ cwn-map')
                    ele.map.setView([pts[1], pts[0]], 12);
                    this.$.popup.hide();
                }.bind(this), 500);
            },

            hide : function() {
                this.$.popup.hide();
            }

        });
    ;

        Polymer('cwn-map', {
            ds : null,

            markerLayer : null,
            edgeLayer : null,

            observe : {
                'ds.loading' : 'update',
                'map' : 'update',
                'filters.calibrationMode' : 'update',
                'filters.oneStepMode' : 'update',
                'filters.Junction' : 'update',
                'filters.Power_Plant'  : 'update',
                'filters.Agricultural_Demand'  : 'update',
                'filters.Pump_Plant' : 'update',
                'filters.Water_Treatment' : 'update',
                'filters.Surface_Storage' : 'update',
                'filters.Urban_Demand' : 'update',
                'filters.Sink'  : 'update',
                'filters.Groundwater_Storage' : 'update',
                'filters.Non_Standard_Demand' : 'update',
                'filters.text' : 'update'
            },

            updating: false,

            map : null,

            ready : function() {
                this._process();
            },

            domReady : function() {
                this.async(function(){
                    this.map = L.map(this.$.leaflet).setView([40, -121], 5);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 18
                    }).addTo(this.map);

                    this.map.on('zoomend', this._onZoomEnd.bind(this));
                });
            },

            _process : function() {
                if( !this.ds ) return;
                if( this.ds.loading || !this.map ) return;

                this.edges = [];
                this.knownEdges = [];
                for( var i = 0; i < this.ds.data.length; i++ ) {
                    var d = this.ds.data[i];

                    if( d.properties.type == 'Diversion' || d.properties.type == 'Return Flow' ) {
                        this.links.push(d);
                    } else {
                        this.nodes.push(d);
                    }
                }

                this.update();
            },

            // TODO: this data sucks... needs to be cleaned up!
            _addEdge : function(edge, type) {
                if( edge == null ) return;

                var pts = edge.split('_');
                if( pts.length <= 1 ) return;
                if( !this.ds.dataMap[pts[0]] || !this.ds.dataMap[pts[1]] ) return;
                if( !this.ds.dataMap[pts[0]].geometry || !this.ds.dataMap[pts[1]].geometry ) return;

                // only add edge once
                if( this.knownEdges.indexOf(edge) > -1 || this.knownEdges.indexOf(pts[1]+'_'+pts[0]) > -1 ) return;
                this.knownEdges.push(edge);

                this.edges.push({
                    type : 'Feature',
                    geometry : {
                        type: 'LineString',
                        coordinates : [
                            this.ds.dataMap[pts[0]].geometry.coordinates,
                            this.ds.dataMap[pts[1]].geometry.coordinates 
                        ]
                    },
                    properties : {
                        name : edge
                        //edgeType : type
                    }
                });
            },

            update : function() {
                if( this.ds.loading || !this.map ) return;
                this.updating = true;

                setTimeout(function(){
                    var map = this.map;
                    var oneStepMode = this.filters.oneStepMode;

                    if( !L.MyMarker ) {
                        this.initMoveEvents();
                        this.initMarker();
                    }

                    if( this.markerLayer ) map.removeLayer(this.markerLayer);
                    if( this.edgeLayer ) map.removeLayer(this.edgeLayer);

                    // update filtering
                    this._filter();

                    var lineMarkers = this.getEdgeMarkers();


                    var calibrationMode = this.filters.calibrationMode;
                    this.edgeLayer = L.geoJson(lineMarkers, {
                        style: function(feature) {
                            var color = CWN.colors.salmon;
                            if( feature.properties.renderInfo ) {
                                if( feature.properties.renderInfo.type == 'flowToSink' ) {
                                  color = CWN.colors.lightGrey;
                                } else if( feature.properties.renderInfo.type == 'returnFlowFromDemand' ) {
                                    color = CWN.colors.red;
                                } else if( feature.properties.renderInfo.type == 'gwToDemand' ) {
                                    color = CWN.colors.black;
                                } else if( feature.properties.renderInfo.type == 'artificalRecharge' ) {
                                    color = CWN.colors.purple;
                                }
                            }

                            var line = {
                                color: color,
                                weight: 3,
                                opacity: 0.4,
                                smoothFactor: 1
                            }

                            if( feature.properties.calibrationNode && calibrationMode ) {
                                line.color = 'blue';
                            }
                            return line;
                        },
                        pointToLayer: function (feature, latlng) {
                            return this._getLineMarker(feature, latlng);
                        }.bind(this),
                        filter: function(feature, layer) {
                            return feature.properties._render.show;
                        }.bind(this)
                    }).addTo(map);

                    this.edgeLayer.on('click', function(e){
                        this.fire('selected', e.layer.feature);
                    }.bind(this));
                    
                    for( var key in this.edgeLayer._layers ) {
                        this._hackTouchEvent(this.edgeLayer._layers[key]);
                    }

                    this.markerLayer = L.geoJson(this.ds.data.nodes, {
                        pointToLayer: function(feature, ll) {
                            return this._getMarker(feature, ll);
                        }.bind(this),
                        filter: function(feature, layer) {
                            return feature.properties._render.show || 
                                    (feature.properties._render.oneStep && oneStepMode);
                        }
                    }).addTo(map);
                    this.markerLayer.on('click', function(e){
                        this.fire('selected', e.layer.feature);
                    }.bind(this));

                    for( var key in this.markerLayer._layers ) {
                        this._hackTouchEvent(this.markerLayer._layers[key]);
                    }

                    this.updating = false;
                    this.fire('filtering-complete');
                }.bind(this), 250);
                
            },

            getEdgeMarkers : function() {
                var x2, y2, i, coord, link, markers = [];

                for( i = 0; i < this.ds.data.links.length; i++ ) {
                    link = this.ds.data.links[i];
                    if( !link.properties._render.show ) continue;
                    coord = link.geometry.coordinates;
                    
                    x2 = (coord[0][0] + coord[1][0]) / 2;
                    y2 = (coord[0][1] + coord[1][1]) / 2;

                    x2 = (x2 + coord[1][0]) / 2;
                    y2 = (y2 + coord[1][1]) / 2;

                    markers.push(link);
                    /*var m = {
                        type: "Point", 
                        coordinates : [x2, y2],
                        properties : $.extend(true, {}, link.properties)
                    };
                    m.properties.isCanvasMarker = true;
                    markers.push(m);*/
                }

                return markers;
            },

            // marker nodes that are linked to a visible node with the 'nodeStep' attribute
            _filter : function() {
                var re, i, d, d2, d3, id;

                // three loops, first mark nodes that match, then mark one step nodes
                // finally mark links to hide and show


                try {
                    re = new RegExp('.*'+this.filters.text.toLowerCase()+'.*');
                } catch (e) {}

                for( i = 0; i < this.ds.data.nodes.length; i++ ) {
                    d = this.ds.data.nodes[i];
                    
                    if( !d.properties._render ) {
                        d.properties._render = {
                            filter_id : d.properties.type.replace(' ','_').replace('-','_')
                        };
                    }
                    d.properties._render.oneStep = false;

                    
                    if( this.filters[d.properties._render.filter_id] && this._isTextMatch(re, d.properties) ) {
                        if( !this.filters.calibrationMode && d.properties.calibrationNode ) {
                            d.properties._render.show = false;
                        } else {
                            d.properties._render.show = true;
                        }
                    } else {
                        d.properties._render.show = false;
                    }
                }

                // now mark one step nodes
                for( i = 0; i < this.ds.data.nodes.length; i++ ) {
                    d = this.ds.data.nodes[i];
                    if( d.properties._render.show ) continue;
                    if( !this.filters.calibrationMode && d.properties.calibrationNode ) continue;

                    if( d.properties.terminals ) {
                        for( var j = 0; j < d.properties.terminals.length; j++ ) {
                            d2 = this.ds.lookupMap[d.properties.terminals[j]];
                            if( d2 && d2.properties._render.show ) {
                                d.properties._render.oneStep = true;
                                break;
                            }
                        }
                    }
                    if( d.properties.origins && !d.properties._render.oneStep) {
                        for( var j = 0; j < d.properties.origins.length; j++ ) {
                            d2 = this.ds.lookupMap[d.properties.origins[j]];
                            if( d2 && d2.properties._render.show ) {
                                d.properties._render.oneStep = true;
                                break;
                            }
                        }
                    }
                }

                // now mark links that should be show
                for( var i = 0; i < this.ds.data.links.length; i++ ) {
                    d = this.ds.data.links[i];
                    if( !d.properties._render ) {
                        d.properties._render = {};
                    }

                    d2 = this.ds.lookupMap[d.properties.origin];
                    d3 = this.ds.lookupMap[d.properties.terminus];
                    if( d2 && d3 && 
                        (d2.properties._render.show || (this.filters.oneStepMode && d2.properties._render.oneStep) ) && 
                        (d3.properties._render.show || (this.filters.oneStepMode && d3.properties._render.oneStep) ) &&
                       !(d2.properties._render.oneStep && d3.properties._render.oneStep ) ) {
                        d.properties._render.show = true;
                    } else {
                        d.properties._render.show = false;
                    }
                }
            },

            _isTextMatch : function(re, props) {
                if( this.filters.text == '' || !re ) return true;

                if( re.test(props.prmname.toLowerCase()) ) return true;
                if( props.description && re.test(props.description.toLowerCase()) ) return true;
                return false;
            },

            _onZoomEnd : function() {
/* WHY AGAIN */
                if( this.markerLayer ) this.map.removeLayer(this.markerLayer);

                this.markerLayer = L.geoJson(this.ds.data.nodes, {
                    pointToLayer: function(feature, ll) {
                        return this._getMarker(feature, ll);
                    }.bind(this),
                    filter: function(feature, layer) {
                        if( !feature ) return false;
                        return feature.properties._render.show || 
                                (feature.properties._render.oneStep && this.filters.oneStepMode);
                    }.bind(this)
                }).addTo(this.map);

                this.markerLayer.on('click', function(e){
                    this.fire('selected', e.layer.feature);
                }.bind(this));

                
                for( var key in this.markerLayer._layers ) {
                    this._hackTouchEvent(this.markerLayer._layers[key]);
                }
/**/


                if( this.map.getZoom() < 10 ) {
                    $('html /deep/ .LineCanvas').hide();
                } else {
                    $('html /deep/ .LineCanvas').show();
                }
            },

            _getMarker : function(feature, ll) {
                var render = feature.properties._render || {};
                var type = feature.properties.type;

                if( this.map.getZoom() < 10 ) {
                    s = this.map.getZoom() * 3;
                } else {
                    s = this.map.getZoom() * 4;
                }

                var options = {
                    iconSize : new L.Point(s, s),
                    type : type
                };

                /*if( this.filters.calibrationMode && feature.properties.calibrationMode ) {
                    options.radius = 30,
                    options.weight = 7;
                    if( feature.properties.calibrationMode == 'both' ) options.color = 'red';
                    else if( feature.properties.calibrationMode == 'in' ) options.color = 'yellow';
                    else if( feature.properties.calibrationMode == 'out' ) options.color = 'blue';
                }*/

                var m = new L.Marker(ll, {
                    icon: new L.Icon.Canvas(options), 
                    opacity: render.oneStep ? .1 : .7
                });

                return m;
            },

            _getLineMarker : function(feature, ll) {
                var hide = false;

                if( this.map.getZoom() < 10 ) {
                    s = this.map.getZoom() * 3;
                    hide = true;
                } else {
                    s = this.map.getZoom() * 4;
                }

                var options = {
                    iconSize : new L.Point(s, s),
                    renderInfo : feature.properties.renderInfo || {},
                    hide : hide
                };

                var m = new L.Marker(ll, {
                    icon: new L.Icon.LineCanvas(options)
                });

                return m;
            },

            // hack so we know if the map is moving for touch events
            lastMove : -1,
            mapMoving : false,
            initMoveEvents : function() {
                this.map.on('movestart', function(){
                    this.mapMoving = true;
                }.bind(this));
                this.map.on('moveend', function(){
                    this.lastMove = new Date().getTime();
                    this.mapMoving = false;
                }.bind(this));
            },

            _hackTouchEvent : function(marker) {
                $(marker._container).on('touchend', function(e){
                    setTimeout(function(){
                        var timeFromLastMove = new Date().getTime() - this.lastMove;
                        // make sure the map is not moving and has actually been settled for 300ms
                        if( !this.mapMoving && timeFromLastMove > 300 ) {
                            this.fire('selected', marker.feature);
                        }

                    // wait 50ms seconds to check to make sure map.movestart has had a chance to fire
                    }.bind(this), 50);
                }.bind(this));
            },

            initMarker : function() {
                // can we pass in type and then just use
                L.Icon.Canvas = L.Icon.extend({
                    options: {
                        iconSize: new L.Point(20, 20), // Have to be supplied
                        className: 'leaflet-canvas-icon'
                    },

                    createIcon: function () {
                        var e = document.createElement('canvas');
                        this._setIconStyles(e, 'icon');
                        var s = this.options.iconSize;
                        e.width = s.x;
                        e.height = s.y;
                        this.draw(e.getContext('2d'), s.x, s.y);
                        return e;
                    },

                    createShadow: function () {
                        return null;
                    },

                    draw: function(ctx, width, height) {
                        CWN.render[this.options.type](ctx, 2, 2, width-4, height-4);
                    }
                });

                L.Icon.LineCanvas = L.Icon.extend({
                    options: {
                        iconSize: new L.Point(20, 20), // Have to be supplied
                        className: 'LineCanvas'
                    },
                    _transformProps : ['webkitTransform', 'MozTransform', 'msTransform', 'transform'],

                    createIcon: function () {
                        var icon = document.createElement('div');
                        var canvas = document.createElement('canvas');
                        icon.appendChild(canvas);

                        this._setIconStyles(icon, 'icon');

                        var s = this.options.iconSize;
                        canvas.width = s.x;
                        canvas.height = s.y;
                        this.draw(canvas.getContext('2d'), s.x, s.y);

                        // now we need to rotate the icon
                        var rotate = this.options.renderInfo.rotate || 0;

                        for( var i = 0; i < this._transformProps.length; i++ ) {
                            canvas.style[this._transformProps[i]] = 'rotate('+rotate+'deg)';
                        }
                        if( this.options.hide ) icon.style.display = 'none';
                        return icon;
                    },

                    createShadow: function () {
                        return null;
                    },

                    draw: function(ctx, width, height) {
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(width, 0);
                        ctx.lineTo(width, height);
                        ctx.lineTo(0, height);
                        ctx.moveTo(0, 0);
                        ctx.closePath();
                        ctx.stroke();

                        var mX = 5;
                        var mY = height / 2;
                        var vX = 10;
                        var vY = 10;


                        if( this.options.renderInfo ) {
                          for( var key in CWN.render.lineMarkers ) {
                            if( this.options.renderInfo[key] ) {
                              CWN.render.lineMarkers[key](ctx, mX, mY, 4, vX, vY);
                              mX += vX * 1.75;
                              //mY += vY * 1.75;
                            }
                          }
                        }
                    }
                });
            }
        });
    ;

        Polymer('cwn-app', {
            PAGES : {
              MAP : 0,
              INFO : 1,
              GRAPH : 2
            },
            selectedPage : 0,

            islocal : false,

            legend : {
              'Power Plant'         : {
                color : '#3366cc',
                google : 'small_red'
              },
              'Agricultural Demand' : {
                  color : '#ff9900',
                  google : 'small_yellow'
              },
              'Junction'            : {
                  color : '#109618',
                  google : 'small_green'
              },
              'Pump Plant'          : {
                  color : '#990099',
                  google : 'small_blue'
              },
              'Water Treatment'     : {
                  color : '#0099c6',
                  google : 'small_purple'
              },
              'Surface Storage'     : {
                  color : '#dd4477',
                  google : 'measle_brown',
              },
              'Urban Demand'        : {
                  color : '#66aa00',
                  google : 'measle_grey'
              },
              'Sink'                : {
                  color : '#b82e2e',
                  google : 'measle_white'
              },
              'Groundwater Storage' : {
                  color : '#316395',
                  google : 'measle_turquoise'
              },
              'Non-Standard Demand' : {
                  color : '#22aa99',
                  google : 'shaded_dot'
              }
            },

            dataLoaded : false,
            dataLoadHandlers : [],

            ready : function() {
              $(window).on('hashchange', function(){
                this.setLocation();
              }.bind(this));
              this.setLocation();
            },

            setLocation : function() {
              var loc = window.location.hash.replace('#','').replace(/\/.*/,'');
              if( loc == '') loc = 'map';

              if( loc == 'map' ) {
                //this.$.pages.selected = this.PAGES.MAP;
                this.selectedPage = this.PAGES.MAP;
                this.async(function(){
                  var map = this.shadowRoot.querySelector('cwn-map').map;
                  if( map ) map.invalidateSize();
                });
              } else if ( loc == 'info' ) {
                //this.$.pages.selected = this.PAGES.INFO;
                this.selectedPage = this.PAGES.INFO;
                if( this.dataLoaded ) {
                  this.setInfoFeature();
                } else {
                  this.dataLoadHandlers.push(this.setInfoFeature.bind(this));
                }
              } else if ( loc == 'graph' ) {
                this.selectedPage = this.PAGES.GRAPH;
              }
            },

            setInfoFeature : function() {
              var name = window.location.hash.replace('#','').split('/')[1];
              name = decodeURIComponent(name);
              this.$.info.feature = this.$.ds.lookupMap[name];
            },
           
            onDataLoad : function() {
              this.dataLoaded = true;
              for( var i = 0; i < this.dataLoadHandlers.length; i++ ) {
                this.dataLoadHandlers[i]();
              }
              this.dataLoadHandlers = [];
            },

            showFilters : function() {
                this.$.filters.toggle();
            },

            updateGraph : function() {
              this.$.graph.update();
            },

            onFeatureSelected : function(e) {
              //this.$.pages.selected = this.PAGES.INFO;
              this.selectedPage = this.PAGES.INFO;
              window.location.hash = 'info/'+e.detail.properties.prmname;
            }
        });
    