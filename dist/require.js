!function(a,b,c){var d=a.L,e={};e.version="0.7.3","object"==typeof module&&"object"==typeof module.exports?module.exports=e:"function"==typeof define&&define.amd&&define(e),e.noConflict=function(){return a.L=d,this},a.L=e,e.Util={extend:function(a){var b,c,d,e,f=Array.prototype.slice.call(arguments,1);for(c=0,d=f.length;d>c;c++){e=f[c]||{};for(b in e)e.hasOwnProperty(b)&&(a[b]=e[b])}return a},bind:function(a,b){var c=arguments.length>2?Array.prototype.slice.call(arguments,2):null;return function(){return a.apply(b,c||arguments)}},stamp:function(){var a=0,b="_leaflet_id";return function(c){return c[b]=c[b]||++a,c[b]}}(),invokeEach:function(a,b,c){var d,e;if("object"==typeof a){e=Array.prototype.slice.call(arguments,3);for(d in a)b.apply(c,[d,a[d]].concat(e));return!0}return!1},limitExecByInterval:function(a,b,c){var d,e;return function f(){var g=arguments;return d?void(e=!0):(d=!0,setTimeout(function(){d=!1,e&&(f.apply(c,g),e=!1)},b),void a.apply(c,g))}},falseFn:function(){return!1},formatNum:function(a,b){var c=Math.pow(10,b||5);return Math.round(a*c)/c},trim:function(a){return a.trim?a.trim():a.replace(/^\s+|\s+$/g,"")},splitWords:function(a){return e.Util.trim(a).split(/\s+/)},setOptions:function(a,b){return a.options=e.extend({},a.options,b),a.options},getParamString:function(a,b,c){var d=[];for(var e in a)d.push(encodeURIComponent(c?e.toUpperCase():e)+"="+encodeURIComponent(a[e]));return(b&&-1!==b.indexOf("?")?"&":"?")+d.join("&")},template:function(a,b){return a.replace(/\{ *([\w_]+) *\}/g,function(a,d){var e=b[d];if(e===c)throw new Error("No value provided for variable "+a);return"function"==typeof e&&(e=e(b)),e})},isArray:Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},emptyImageUrl:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="},function(){function b(b){var c,d,e=["webkit","moz","o","ms"];for(c=0;c<e.length&&!d;c++)d=a[e[c]+b];return d}function c(b){var c=+new Date,e=Math.max(0,16-(c-d));return d=c+e,a.setTimeout(b,e)}var d=0,f=a.requestAnimationFrame||b("RequestAnimationFrame")||c,g=a.cancelAnimationFrame||b("CancelAnimationFrame")||b("CancelRequestAnimationFrame")||function(b){a.clearTimeout(b)};e.Util.requestAnimFrame=function(b,d,g,h){return b=e.bind(b,d),g&&f===c?void b():f.call(a,b,h)},e.Util.cancelAnimFrame=function(b){b&&g.call(a,b)}}(),e.extend=e.Util.extend,e.bind=e.Util.bind,e.stamp=e.Util.stamp,e.setOptions=e.Util.setOptions,e.Class=function(){},e.Class.extend=function(a){var b=function(){this.initialize&&this.initialize.apply(this,arguments),this._initHooks&&this.callInitHooks()},c=function(){};c.prototype=this.prototype;var d=new c;d.constructor=b,b.prototype=d;for(var f in this)this.hasOwnProperty(f)&&"prototype"!==f&&(b[f]=this[f]);a.statics&&(e.extend(b,a.statics),delete a.statics),a.includes&&(e.Util.extend.apply(null,[d].concat(a.includes)),delete a.includes),a.options&&d.options&&(a.options=e.extend({},d.options,a.options)),e.extend(d,a),d._initHooks=[];var g=this;return b.__super__=g.prototype,d.callInitHooks=function(){if(!this._initHooksCalled){g.prototype.callInitHooks&&g.prototype.callInitHooks.call(this),this._initHooksCalled=!0;for(var a=0,b=d._initHooks.length;b>a;a++)d._initHooks[a].call(this)}},b},e.Class.include=function(a){e.extend(this.prototype,a)},e.Class.mergeOptions=function(a){e.extend(this.prototype.options,a)},e.Class.addInitHook=function(a){var b=Array.prototype.slice.call(arguments,1),c="function"==typeof a?a:function(){this[a].apply(this,b)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(c)};var f="_leaflet_events";e.Mixin={},e.Mixin.Events={addEventListener:function(a,b,c){if(e.Util.invokeEach(a,this.addEventListener,this,b,c))return this;var d,g,h,i,j,k,l,m=this[f]=this[f]||{},n=c&&c!==this&&e.stamp(c);for(a=e.Util.splitWords(a),d=0,g=a.length;g>d;d++)h={action:b,context:c||this},i=a[d],n?(j=i+"_idx",k=j+"_len",l=m[j]=m[j]||{},l[n]||(l[n]=[],m[k]=(m[k]||0)+1),l[n].push(h)):(m[i]=m[i]||[],m[i].push(h));return this},hasEventListeners:function(a){var b=this[f];return!!b&&(a in b&&b[a].length>0||a+"_idx"in b&&b[a+"_idx_len"]>0)},removeEventListener:function(a,b,c){if(!this[f])return this;if(!a)return this.clearAllEventListeners();if(e.Util.invokeEach(a,this.removeEventListener,this,b,c))return this;var d,g,h,i,j,k,l,m,n,o=this[f],p=c&&c!==this&&e.stamp(c);for(a=e.Util.splitWords(a),d=0,g=a.length;g>d;d++)if(h=a[d],k=h+"_idx",l=k+"_len",m=o[k],b){if(i=p&&m?m[p]:o[h]){for(j=i.length-1;j>=0;j--)i[j].action!==b||c&&i[j].context!==c||(n=i.splice(j,1),n[0].action=e.Util.falseFn);c&&m&&0===i.length&&(delete m[p],o[l]--)}}else delete o[h],delete o[k],delete o[l];return this},clearAllEventListeners:function(){return delete this[f],this},fireEvent:function(a,b){if(!this.hasEventListeners(a))return this;var c,d,g,h,i,j=e.Util.extend({},b,{type:a,target:this}),k=this[f];if(k[a])for(c=k[a].slice(),d=0,g=c.length;g>d;d++)c[d].action.call(c[d].context,j);h=k[a+"_idx"];for(i in h)if(c=h[i].slice())for(d=0,g=c.length;g>d;d++)c[d].action.call(c[d].context,j);return this},addOneTimeEventListener:function(a,b,c){if(e.Util.invokeEach(a,this.addOneTimeEventListener,this,b,c))return this;var d=e.bind(function(){this.removeEventListener(a,b,c).removeEventListener(a,d,c)},this);return this.addEventListener(a,b,c).addEventListener(a,d,c)}},e.Mixin.Events.on=e.Mixin.Events.addEventListener,e.Mixin.Events.off=e.Mixin.Events.removeEventListener,e.Mixin.Events.once=e.Mixin.Events.addOneTimeEventListener,e.Mixin.Events.fire=e.Mixin.Events.fireEvent,function(){var d="ActiveXObject"in a,f=d&&!b.addEventListener,g=navigator.userAgent.toLowerCase(),h=-1!==g.indexOf("webkit"),i=-1!==g.indexOf("chrome"),j=-1!==g.indexOf("phantom"),k=-1!==g.indexOf("android"),l=-1!==g.search("android [23]"),m=-1!==g.indexOf("gecko"),n=typeof orientation!=c+"",o=a.navigator&&a.navigator.msPointerEnabled&&a.navigator.msMaxTouchPoints&&!a.PointerEvent,p=a.PointerEvent&&a.navigator.pointerEnabled&&a.navigator.maxTouchPoints||o,q="devicePixelRatio"in a&&a.devicePixelRatio>1||"matchMedia"in a&&a.matchMedia("(min-resolution:144dpi)")&&a.matchMedia("(min-resolution:144dpi)").matches,r=b.documentElement,s=d&&"transition"in r.style,t="WebKitCSSMatrix"in a&&"m11"in new a.WebKitCSSMatrix&&!l,u="MozPerspective"in r.style,v="OTransition"in r.style,w=!a.L_DISABLE_3D&&(s||t||u||v)&&!j,x=!a.L_NO_TOUCH&&!j&&function(){var a="ontouchstart";if(p||a in r)return!0;var c=b.createElement("div"),d=!1;return c.setAttribute?(c.setAttribute(a,"return;"),"function"==typeof c[a]&&(d=!0),c.removeAttribute(a),c=null,d):!1}();e.Browser={ie:d,ielt9:f,webkit:h,gecko:m&&!h&&!a.opera&&!d,android:k,android23:l,chrome:i,ie3d:s,webkit3d:t,gecko3d:u,opera3d:v,any3d:w,mobile:n,mobileWebkit:n&&h,mobileWebkit3d:n&&t,mobileOpera:n&&a.opera,touch:x,msPointer:o,pointer:p,retina:q}}(),e.Point=function(a,b,c){this.x=c?Math.round(a):a,this.y=c?Math.round(b):b},e.Point.prototype={clone:function(){return new e.Point(this.x,this.y)},add:function(a){return this.clone()._add(e.point(a))},_add:function(a){return this.x+=a.x,this.y+=a.y,this},subtract:function(a){return this.clone()._subtract(e.point(a))},_subtract:function(a){return this.x-=a.x,this.y-=a.y,this},divideBy:function(a){return this.clone()._divideBy(a)},_divideBy:function(a){return this.x/=a,this.y/=a,this},multiplyBy:function(a){return this.clone()._multiplyBy(a)},_multiplyBy:function(a){return this.x*=a,this.y*=a,this},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},distanceTo:function(a){a=e.point(a);var b=a.x-this.x,c=a.y-this.y;return Math.sqrt(b*b+c*c)},equals:function(a){return a=e.point(a),a.x===this.x&&a.y===this.y},contains:function(a){return a=e.point(a),Math.abs(a.x)<=Math.abs(this.x)&&Math.abs(a.y)<=Math.abs(this.y)},toString:function(){return"Point("+e.Util.formatNum(this.x)+", "+e.Util.formatNum(this.y)+")"}},e.point=function(a,b,d){return a instanceof e.Point?a:e.Util.isArray(a)?new e.Point(a[0],a[1]):a===c||null===a?a:new e.Point(a,b,d)},e.Bounds=function(a,b){if(a)for(var c=b?[a,b]:a,d=0,e=c.length;e>d;d++)this.extend(c[d])},e.Bounds.prototype={extend:function(a){return a=e.point(a),this.min||this.max?(this.min.x=Math.min(a.x,this.min.x),this.max.x=Math.max(a.x,this.max.x),this.min.y=Math.min(a.y,this.min.y),this.max.y=Math.max(a.y,this.max.y)):(this.min=a.clone(),this.max=a.clone()),this},getCenter:function(a){return new e.Point((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,a)},getBottomLeft:function(){return new e.Point(this.min.x,this.max.y)},getTopRight:function(){return new e.Point(this.max.x,this.min.y)},getSize:function(){return this.max.subtract(this.min)},contains:function(a){var b,c;return a="number"==typeof a[0]||a instanceof e.Point?e.point(a):e.bounds(a),a instanceof e.Bounds?(b=a.min,c=a.max):b=c=a,b.x>=this.min.x&&c.x<=this.max.x&&b.y>=this.min.y&&c.y<=this.max.y},intersects:function(a){a=e.bounds(a);var b=this.min,c=this.max,d=a.min,f=a.max,g=f.x>=b.x&&d.x<=c.x,h=f.y>=b.y&&d.y<=c.y;return g&&h},isValid:function(){return!(!this.min||!this.max)}},e.bounds=function(a,b){return!a||a instanceof e.Bounds?a:new e.Bounds(a,b)},e.Transformation=function(a,b,c,d){this._a=a,this._b=b,this._c=c,this._d=d},e.Transformation.prototype={transform:function(a,b){return this._transform(a.clone(),b)},_transform:function(a,b){return b=b||1,a.x=b*(this._a*a.x+this._b),a.y=b*(this._c*a.y+this._d),a},untransform:function(a,b){return b=b||1,new e.Point((a.x/b-this._b)/this._a,(a.y/b-this._d)/this._c)}},e.DomUtil={get:function(a){return"string"==typeof a?b.getElementById(a):a},getStyle:function(a,c){var d=a.style[c];if(!d&&a.currentStyle&&(d=a.currentStyle[c]),(!d||"auto"===d)&&b.defaultView){var e=b.defaultView.getComputedStyle(a,null);d=e?e[c]:null}return"auto"===d?null:d},getViewportOffset:function(a){var c,d=0,f=0,g=a,h=b.body,i=b.documentElement;do{if(d+=g.offsetTop||0,f+=g.offsetLeft||0,d+=parseInt(e.DomUtil.getStyle(g,"borderTopWidth"),10)||0,f+=parseInt(e.DomUtil.getStyle(g,"borderLeftWidth"),10)||0,c=e.DomUtil.getStyle(g,"position"),g.offsetParent===h&&"absolute"===c)break;if("fixed"===c){d+=h.scrollTop||i.scrollTop||0,f+=h.scrollLeft||i.scrollLeft||0;break}if("relative"===c&&!g.offsetLeft){var j=e.DomUtil.getStyle(g,"width"),k=e.DomUtil.getStyle(g,"max-width"),l=g.getBoundingClientRect();("none"!==j||"none"!==k)&&(f+=l.left+g.clientLeft),d+=l.top+(h.scrollTop||i.scrollTop||0);break}g=g.offsetParent}while(g);g=a;do{if(g===h)break;d-=g.scrollTop||0,f-=g.scrollLeft||0,g=g.parentNode}while(g);return new e.Point(f,d)},documentIsLtr:function(){return e.DomUtil._docIsLtrCached||(e.DomUtil._docIsLtrCached=!0,e.DomUtil._docIsLtr="ltr"===e.DomUtil.getStyle(b.body,"direction")),e.DomUtil._docIsLtr},create:function(a,c,d){var e=b.createElement(a);return e.className=c,d&&d.appendChild(e),e},hasClass:function(a,b){if(a.classList!==c)return a.classList.contains(b);var d=e.DomUtil._getClass(a);return d.length>0&&new RegExp("(^|\\s)"+b+"(\\s|$)").test(d)},addClass:function(a,b){if(a.classList!==c)for(var d=e.Util.splitWords(b),f=0,g=d.length;g>f;f++)a.classList.add(d[f]);else if(!e.DomUtil.hasClass(a,b)){var h=e.DomUtil._getClass(a);e.DomUtil._setClass(a,(h?h+" ":"")+b)}},removeClass:function(a,b){a.classList!==c?a.classList.remove(b):e.DomUtil._setClass(a,e.Util.trim((" "+e.DomUtil._getClass(a)+" ").replace(" "+b+" "," ")))},_setClass:function(a,b){a.className.baseVal===c?a.className=b:a.className.baseVal=b},_getClass:function(a){return a.className.baseVal===c?a.className:a.className.baseVal},setOpacity:function(a,b){if("opacity"in a.style)a.style.opacity=b;else if("filter"in a.style){var c=!1,d="DXImageTransform.Microsoft.Alpha";try{c=a.filters.item(d)}catch(e){if(1===b)return}b=Math.round(100*b),c?(c.Enabled=100!==b,c.Opacity=b):a.style.filter+=" progid:"+d+"(opacity="+b+")"}},testProp:function(a){for(var c=b.documentElement.style,d=0;d<a.length;d++)if(a[d]in c)return a[d];return!1},getTranslateString:function(a){var b=e.Browser.webkit3d,c="translate"+(b?"3d":"")+"(",d=(b?",0":"")+")";return c+a.x+"px,"+a.y+"px"+d},getScaleString:function(a,b){var c=e.DomUtil.getTranslateString(b.add(b.multiplyBy(-1*a))),d=" scale("+a+") ";return c+d},setPosition:function(a,b,c){a._leaflet_pos=b,!c&&e.Browser.any3d?a.style[e.DomUtil.TRANSFORM]=e.DomUtil.getTranslateString(b):(a.style.left=b.x+"px",a.style.top=b.y+"px")},getPosition:function(a){return a._leaflet_pos}},e.DomUtil.TRANSFORM=e.DomUtil.testProp(["transform","WebkitTransform","OTransform","MozTransform","msTransform"]),e.DomUtil.TRANSITION=e.DomUtil.testProp(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),e.DomUtil.TRANSITION_END="webkitTransition"===e.DomUtil.TRANSITION||"OTransition"===e.DomUtil.TRANSITION?e.DomUtil.TRANSITION+"End":"transitionend",function(){if("onselectstart"in b)e.extend(e.DomUtil,{disableTextSelection:function(){e.DomEvent.on(a,"selectstart",e.DomEvent.preventDefault)},enableTextSelection:function(){e.DomEvent.off(a,"selectstart",e.DomEvent.preventDefault)}});else{var c=e.DomUtil.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);e.extend(e.DomUtil,{disableTextSelection:function(){if(c){var a=b.documentElement.style;this._userSelect=a[c],a[c]="none"}},enableTextSelection:function(){c&&(b.documentElement.style[c]=this._userSelect,delete this._userSelect)}})}e.extend(e.DomUtil,{disableImageDrag:function(){e.DomEvent.on(a,"dragstart",e.DomEvent.preventDefault)},enableImageDrag:function(){e.DomEvent.off(a,"dragstart",e.DomEvent.preventDefault)}})}(),e.LatLng=function(a,b,d){if(a=parseFloat(a),b=parseFloat(b),isNaN(a)||isNaN(b))throw new Error("Invalid LatLng object: ("+a+", "+b+")");this.lat=a,this.lng=b,d!==c&&(this.alt=parseFloat(d))},e.extend(e.LatLng,{DEG_TO_RAD:Math.PI/180,RAD_TO_DEG:180/Math.PI,MAX_MARGIN:1e-9}),e.LatLng.prototype={equals:function(a){if(!a)return!1;a=e.latLng(a);var b=Math.max(Math.abs(this.lat-a.lat),Math.abs(this.lng-a.lng));return b<=e.LatLng.MAX_MARGIN},toString:function(a){return"LatLng("+e.Util.formatNum(this.lat,a)+", "+e.Util.formatNum(this.lng,a)+")"},distanceTo:function(a){a=e.latLng(a);var b=6378137,c=e.LatLng.DEG_TO_RAD,d=(a.lat-this.lat)*c,f=(a.lng-this.lng)*c,g=this.lat*c,h=a.lat*c,i=Math.sin(d/2),j=Math.sin(f/2),k=i*i+j*j*Math.cos(g)*Math.cos(h);return 2*b*Math.atan2(Math.sqrt(k),Math.sqrt(1-k))},wrap:function(a,b){var c=this.lng;return a=a||-180,b=b||180,c=(c+b)%(b-a)+(a>c||c===b?b:a),new e.LatLng(this.lat,c)}},e.latLng=function(a,b){return a instanceof e.LatLng?a:e.Util.isArray(a)?"number"==typeof a[0]||"string"==typeof a[0]?new e.LatLng(a[0],a[1],a[2]):null:a===c||null===a?a:"object"==typeof a&&"lat"in a?new e.LatLng(a.lat,"lng"in a?a.lng:a.lon):b===c?null:new e.LatLng(a,b)},e.LatLngBounds=function(a,b){if(a)for(var c=b?[a,b]:a,d=0,e=c.length;e>d;d++)this.extend(c[d])},e.LatLngBounds.prototype={extend:function(a){if(!a)return this;var b=e.latLng(a);return a=null!==b?b:e.latLngBounds(a),a instanceof e.LatLng?this._southWest||this._northEast?(this._southWest.lat=Math.min(a.lat,this._southWest.lat),this._southWest.lng=Math.min(a.lng,this._southWest.lng),this._northEast.lat=Math.max(a.lat,this._northEast.lat),this._northEast.lng=Math.max(a.lng,this._northEast.lng)):(this._southWest=new e.LatLng(a.lat,a.lng),this._northEast=new e.LatLng(a.lat,a.lng)):a instanceof e.LatLngBounds&&(this.extend(a._southWest),this.extend(a._northEast)),this},pad:function(a){var b=this._southWest,c=this._northEast,d=Math.abs(b.lat-c.lat)*a,f=Math.abs(b.lng-c.lng)*a;return new e.LatLngBounds(new e.LatLng(b.lat-d,b.lng-f),new e.LatLng(c.lat+d,c.lng+f))},getCenter:function(){return new e.LatLng((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new e.LatLng(this.getNorth(),this.getWest())},getSouthEast:function(){return new e.LatLng(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(a){a="number"==typeof a[0]||a instanceof e.LatLng?e.latLng(a):e.latLngBounds(a);var b,c,d=this._southWest,f=this._northEast;return a instanceof e.LatLngBounds?(b=a.getSouthWest(),c=a.getNorthEast()):b=c=a,b.lat>=d.lat&&c.lat<=f.lat&&b.lng>=d.lng&&c.lng<=f.lng},intersects:function(a){a=e.latLngBounds(a);var b=this._southWest,c=this._northEast,d=a.getSouthWest(),f=a.getNorthEast(),g=f.lat>=b.lat&&d.lat<=c.lat,h=f.lng>=b.lng&&d.lng<=c.lng;return g&&h},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(a){return a?(a=e.latLngBounds(a),this._southWest.equals(a.getSouthWest())&&this._northEast.equals(a.getNorthEast())):!1},isValid:function(){return!(!this._southWest||!this._northEast)}},e.latLngBounds=function(a,b){return!a||a instanceof e.LatLngBounds?a:new e.LatLngBounds(a,b)},e.Projection={},e.Projection.SphericalMercator={MAX_LATITUDE:85.0511287798,project:function(a){var b=e.LatLng.DEG_TO_RAD,c=this.MAX_LATITUDE,d=Math.max(Math.min(c,a.lat),-c),f=a.lng*b,g=d*b;return g=Math.log(Math.tan(Math.PI/4+g/2)),new e.Point(f,g)},unproject:function(a){var b=e.LatLng.RAD_TO_DEG,c=a.x*b,d=(2*Math.atan(Math.exp(a.y))-Math.PI/2)*b;return new e.LatLng(d,c)}},e.Projection.LonLat={project:function(a){return new e.Point(a.lng,a.lat)},unproject:function(a){return new e.LatLng(a.y,a.x)}},e.CRS={latLngToPoint:function(a,b){var c=this.projection.project(a),d=this.scale(b);return this.transformation._transform(c,d)},pointToLatLng:function(a,b){var c=this.scale(b),d=this.transformation.untransform(a,c);return this.projection.unproject(d)},project:function(a){return this.projection.project(a)},scale:function(a){return 256*Math.pow(2,a)},getSize:function(a){var b=this.scale(a);return e.point(b,b)}},e.CRS.Simple=e.extend({},e.CRS,{projection:e.Projection.LonLat,transformation:new e.Transformation(1,0,-1,0),scale:function(a){return Math.pow(2,a)}}),e.CRS.EPSG3857=e.extend({},e.CRS,{code:"EPSG:3857",projection:e.Projection.SphericalMercator,transformation:new e.Transformation(.5/Math.PI,.5,-.5/Math.PI,.5),project:function(a){var b=this.projection.project(a),c=6378137;return b.multiplyBy(c)}}),e.CRS.EPSG900913=e.extend({},e.CRS.EPSG3857,{code:"EPSG:900913"}),e.CRS.EPSG4326=e.extend({},e.CRS,{code:"EPSG:4326",projection:e.Projection.LonLat,transformation:new e.Transformation(1/360,.5,-1/360,.5)}),e.Map=e.Class.extend({includes:e.Mixin.Events,options:{crs:e.CRS.EPSG3857,fadeAnimation:e.DomUtil.TRANSITION&&!e.Browser.android23,trackResize:!0,markerZoomAnimation:e.DomUtil.TRANSITION&&e.Browser.any3d},initialize:function(a,b){b=e.setOptions(this,b),this._initContainer(a),this._initLayout(),this._onResize=e.bind(this._onResize,this),this._initEvents(),b.maxBounds&&this.setMaxBounds(b.maxBounds),b.center&&b.zoom!==c&&this.setView(e.latLng(b.center),b.zoom,{reset:!0}),this._handlers=[],this._layers={},this._zoomBoundLayers={},this._tileLayersNum=0,this.callInitHooks(),this._addLayers(b.layers)},setView:function(a,b){return b=b===c?this.getZoom():b,this._resetView(e.latLng(a),this._limitZoom(b)),this},setZoom:function(a,b){return this._loaded?this.setView(this.getCenter(),a,{zoom:b}):(this._zoom=this._limitZoom(a),this)},zoomIn:function(a,b){return this.setZoom(this._zoom+(a||1),b)},zoomOut:function(a,b){return this.setZoom(this._zoom-(a||1),b)},setZoomAround:function(a,b,c){var d=this.getZoomScale(b),f=this.getSize().divideBy(2),g=a instanceof e.Point?a:this.latLngToContainerPoint(a),h=g.subtract(f).multiplyBy(1-1/d),i=this.containerPointToLatLng(f.add(h));return this.setView(i,b,{zoom:c})},fitBounds:function(a,b){b=b||{},a=a.getBounds?a.getBounds():e.latLngBounds(a);var c=e.point(b.paddingTopLeft||b.padding||[0,0]),d=e.point(b.paddingBottomRight||b.padding||[0,0]),f=this.getBoundsZoom(a,!1,c.add(d)),g=d.subtract(c).divideBy(2),h=this.project(a.getSouthWest(),f),i=this.project(a.getNorthEast(),f),j=this.unproject(h.add(i).divideBy(2).add(g),f);return f=b&&b.maxZoom?Math.min(b.maxZoom,f):f,this.setView(j,f,b)},fitWorld:function(a){return this.fitBounds([[-90,-180],[90,180]],a)},panTo:function(a,b){return this.setView(a,this._zoom,{pan:b})},panBy:function(a){return this.fire("movestart"),this._rawPanBy(e.point(a)),this.fire("move"),this.fire("moveend")},setMaxBounds:function(a){return a=e.latLngBounds(a),this.options.maxBounds=a,a?(this._loaded&&this._panInsideMaxBounds(),this.on("moveend",this._panInsideMaxBounds,this)):this.off("moveend",this._panInsideMaxBounds,this)},panInsideBounds:function(a,b){var c=this.getCenter(),d=this._limitCenter(c,this._zoom,a);return c.equals(d)?this:this.panTo(d,b)},addLayer:function(a){var b=e.stamp(a);return this._layers[b]?this:(this._layers[b]=a,!a.options||isNaN(a.options.maxZoom)&&isNaN(a.options.minZoom)||(this._zoomBoundLayers[b]=a,this._updateZoomLevels()),this.options.zoomAnimation&&e.TileLayer&&a instanceof e.TileLayer&&(this._tileLayersNum++,this._tileLayersToLoad++,a.on("load",this._onTileLayerLoad,this)),this._loaded&&this._layerAdd(a),this)},removeLayer:function(a){var b=e.stamp(a);return this._layers[b]?(this._loaded&&a.onRemove(this),delete this._layers[b],this._loaded&&this.fire("layerremove",{layer:a}),this._zoomBoundLayers[b]&&(delete this._zoomBoundLayers[b],this._updateZoomLevels()),this.options.zoomAnimation&&e.TileLayer&&a instanceof e.TileLayer&&(this._tileLayersNum--,this._tileLayersToLoad--,a.off("load",this._onTileLayerLoad,this)),this):this},hasLayer:function(a){return a?e.stamp(a)in this._layers:!1},eachLayer:function(a,b){for(var c in this._layers)a.call(b,this._layers[c]);return this},invalidateSize:function(a){if(!this._loaded)return this;a=e.extend({animate:!1,pan:!0},a===!0?{animate:!0}:a);var b=this.getSize();this._sizeChanged=!0,this._initialCenter=null;var c=this.getSize(),d=b.divideBy(2).round(),f=c.divideBy(2).round(),g=d.subtract(f);return g.x||g.y?(a.animate&&a.pan?this.panBy(g):(a.pan&&this._rawPanBy(g),this.fire("move"),a.debounceMoveend?(clearTimeout(this._sizeTimer),this._sizeTimer=setTimeout(e.bind(this.fire,this,"moveend"),200)):this.fire("moveend")),this.fire("resize",{oldSize:b,newSize:c})):this},addHandler:function(a,b){if(!b)return this;var c=this[a]=new b(this);return this._handlers.push(c),this.options[a]&&c.enable(),this},remove:function(){this._loaded&&this.fire("unload"),this._initEvents("off");try{delete this._container._leaflet}catch(a){this._container._leaflet=c}return this._clearPanes(),this._clearControlPos&&this._clearControlPos(),this._clearHandlers(),this},getCenter:function(){return this._checkIfLoaded(),this._initialCenter&&!this._moved()?this._initialCenter:this.layerPointToLatLng(this._getCenterLayerPoint())},getZoom:function(){return this._zoom},getBounds:function(){var a=this.getPixelBounds(),b=this.unproject(a.getBottomLeft()),c=this.unproject(a.getTopRight());return new e.LatLngBounds(b,c)},getMinZoom:function(){return this.options.minZoom===c?this._layersMinZoom===c?0:this._layersMinZoom:this.options.minZoom},getMaxZoom:function(){return this.options.maxZoom===c?this._layersMaxZoom===c?1/0:this._layersMaxZoom:this.options.maxZoom},getBoundsZoom:function(a,b,c){a=e.latLngBounds(a);var d,f=this.getMinZoom()-(b?1:0),g=this.getMaxZoom(),h=this.getSize(),i=a.getNorthWest(),j=a.getSouthEast(),k=!0;c=e.point(c||[0,0]);do f++,d=this.project(j,f).subtract(this.project(i,f)).add(c),k=b?d.x<h.x||d.y<h.y:h.contains(d);while(k&&g>=f);return k&&b?null:b?f:f-1},getSize:function(){return(!this._size||this._sizeChanged)&&(this._size=new e.Point(this._container.clientWidth,this._container.clientHeight),this._sizeChanged=!1),this._size.clone()},getPixelBounds:function(){var a=this._getTopLeftPoint();return new e.Bounds(a,a.add(this.getSize()))},getPixelOrigin:function(){return this._checkIfLoaded(),this._initialTopLeftPoint},getPanes:function(){return this._panes},getContainer:function(){return this._container},getZoomScale:function(a){var b=this.options.crs;return b.scale(a)/b.scale(this._zoom)},getScaleZoom:function(a){return this._zoom+Math.log(a)/Math.LN2},project:function(a,b){return b=b===c?this._zoom:b,this.options.crs.latLngToPoint(e.latLng(a),b)},unproject:function(a,b){return b=b===c?this._zoom:b,this.options.crs.pointToLatLng(e.point(a),b)},layerPointToLatLng:function(a){var b=e.point(a).add(this.getPixelOrigin());return this.unproject(b)},latLngToLayerPoint:function(a){var b=this.project(e.latLng(a))._round();return b._subtract(this.getPixelOrigin())},containerPointToLayerPoint:function(a){return e.point(a).subtract(this._getMapPanePos())},layerPointToContainerPoint:function(a){return e.point(a).add(this._getMapPanePos())},containerPointToLatLng:function(a){var b=this.containerPointToLayerPoint(e.point(a));return this.layerPointToLatLng(b)},latLngToContainerPoint:function(a){return this.layerPointToContainerPoint(this.latLngToLayerPoint(e.latLng(a)))},mouseEventToContainerPoint:function(a){return e.DomEvent.getMousePosition(a,this._container)},mouseEventToLayerPoint:function(a){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(a))},mouseEventToLatLng:function(a){return this.layerPointToLatLng(this.mouseEventToLayerPoint(a))},_initContainer:function(a){var b=this._container=e.DomUtil.get(a);if(!b)throw new Error("Map container not found.");if(b._leaflet)throw new Error("Map container is already initialized.");b._leaflet=!0},_initLayout:function(){var a=this._container;e.DomUtil.addClass(a,"leaflet-container"+(e.Browser.touch?" leaflet-touch":"")+(e.Browser.retina?" leaflet-retina":"")+(e.Browser.ielt9?" leaflet-oldie":"")+(this.options.fadeAnimation?" leaflet-fade-anim":""));var b=e.DomUtil.getStyle(a,"position");"absolute"!==b&&"relative"!==b&&"fixed"!==b&&(a.style.position="relative"),this._initPanes(),this._initControlPos&&this._initControlPos()},_initPanes:function(){var a=this._panes={};this._mapPane=a.mapPane=this._createPane("leaflet-map-pane",this._container),this._tilePane=a.tilePane=this._createPane("leaflet-tile-pane",this._mapPane),a.objectsPane=this._createPane("leaflet-objects-pane",this._mapPane),a.shadowPane=this._createPane("leaflet-shadow-pane"),a.overlayPane=this._createPane("leaflet-overlay-pane"),a.markerPane=this._createPane("leaflet-marker-pane"),a.popupPane=this._createPane("leaflet-popup-pane");var b=" leaflet-zoom-hide";this.options.markerZoomAnimation||(e.DomUtil.addClass(a.markerPane,b),e.DomUtil.addClass(a.shadowPane,b),e.DomUtil.addClass(a.popupPane,b))},_createPane:function(a,b){return e.DomUtil.create("div",a,b||this._panes.objectsPane)},_clearPanes:function(){this._container.removeChild(this._mapPane)},_addLayers:function(a){a=a?e.Util.isArray(a)?a:[a]:[];for(var b=0,c=a.length;c>b;b++)this.addLayer(a[b])},_resetView:function(a,b,c,d){var f=this._zoom!==b;d||(this.fire("movestart"),f&&this.fire("zoomstart")),this._zoom=b,this._initialCenter=a,this._initialTopLeftPoint=this._getNewTopLeftPoint(a),c?this._initialTopLeftPoint._add(this._getMapPanePos()):e.DomUtil.setPosition(this._mapPane,new e.Point(0,0)),this._tileLayersToLoad=this._tileLayersNum;var g=!this._loaded;this._loaded=!0,this.fire("viewreset",{hard:!c}),g&&(this.fire("load"),this.eachLayer(this._layerAdd,this)),this.fire("move"),(f||d)&&this.fire("zoomend"),this.fire("moveend",{hard:!c})},_rawPanBy:function(a){e.DomUtil.setPosition(this._mapPane,this._getMapPanePos().subtract(a))},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom()},_updateZoomLevels:function(){var a,b=1/0,d=-1/0,e=this._getZoomSpan();for(a in this._zoomBoundLayers){var f=this._zoomBoundLayers[a];isNaN(f.options.minZoom)||(b=Math.min(b,f.options.minZoom)),isNaN(f.options.maxZoom)||(d=Math.max(d,f.options.maxZoom))}a===c?this._layersMaxZoom=this._layersMinZoom=c:(this._layersMaxZoom=d,this._layersMinZoom=b),e!==this._getZoomSpan()&&this.fire("zoomlevelschange")},_panInsideMaxBounds:function(){this.panInsideBounds(this.options.maxBounds)},_checkIfLoaded:function(){if(!this._loaded)throw new Error("Set map center and zoom first.")},_initEvents:function(b){if(e.DomEvent){b=b||"on",e.DomEvent[b](this._container,"click",this._onMouseClick,this);var c,d,f=["dblclick","mousedown","mouseup","mouseenter","mouseleave","mousemove","contextmenu"];for(c=0,d=f.length;d>c;c++)e.DomEvent[b](this._container,f[c],this._fireMouseEvent,this);this.options.trackResize&&e.DomEvent[b](a,"resize",this._onResize,this)}},_onResize:function(){e.Util.cancelAnimFrame(this._resizeRequest),this._resizeRequest=e.Util.requestAnimFrame(function(){this.invalidateSize({debounceMoveend:!0})},this,!1,this._container)},_onMouseClick:function(a){!this._loaded||!a._simulated&&(this.dragging&&this.dragging.moved()||this.boxZoom&&this.boxZoom.moved())||e.DomEvent._skipped(a)||(this.fire("preclick"),this._fireMouseEvent(a))},_fireMouseEvent:function(a){if(this._loaded&&!e.DomEvent._skipped(a)){var b=a.type;if(b="mouseenter"===b?"mouseover":"mouseleave"===b?"mouseout":b,this.hasEventListeners(b)){"contextmenu"===b&&e.DomEvent.preventDefault(a);var c=this.mouseEventToContainerPoint(a),d=this.containerPointToLayerPoint(c),f=this.layerPointToLatLng(d);this.fire(b,{latlng:f,layerPoint:d,containerPoint:c,originalEvent:a})}}},_onTileLayerLoad:function(){this._tileLayersToLoad--,this._tileLayersNum&&!this._tileLayersToLoad&&this.fire("tilelayersload")},_clearHandlers:function(){for(var a=0,b=this._handlers.length;b>a;a++)this._handlers[a].disable()},whenReady:function(a,b){return this._loaded?a.call(b||this,this):this.on("load",a,b),this},_layerAdd:function(a){a.onAdd(this),this.fire("layeradd",{layer:a})},_getMapPanePos:function(){return e.DomUtil.getPosition(this._mapPane)},_moved:function(){var a=this._getMapPanePos();return a&&!a.equals([0,0])},_getTopLeftPoint:function(){return this.getPixelOrigin().subtract(this._getMapPanePos())},_getNewTopLeftPoint:function(a,b){var c=this.getSize()._divideBy(2);return this.project(a,b)._subtract(c)._round()},_latLngToNewLayerPoint:function(a,b,c){var d=this._getNewTopLeftPoint(c,b).add(this._getMapPanePos());return this.project(a,b)._subtract(d)},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2))},_getCenterOffset:function(a){return this.latLngToLayerPoint(a).subtract(this._getCenterLayerPoint())},_limitCenter:function(a,b,c){if(!c)return a;var d=this.project(a,b),f=this.getSize().divideBy(2),g=new e.Bounds(d.subtract(f),d.add(f)),h=this._getBoundsOffset(g,c,b);return this.unproject(d.add(h),b)},_limitOffset:function(a,b){if(!b)return a;var c=this.getPixelBounds(),d=new e.Bounds(c.min.add(a),c.max.add(a));return a.add(this._getBoundsOffset(d,b))},_getBoundsOffset:function(a,b,c){var d=this.project(b.getNorthWest(),c).subtract(a.min),f=this.project(b.getSouthEast(),c).subtract(a.max),g=this._rebound(d.x,-f.x),h=this._rebound(d.y,-f.y);return new e.Point(g,h)},_rebound:function(a,b){return a+b>0?Math.round(a-b)/2:Math.max(0,Math.ceil(a))-Math.max(0,Math.floor(b))},_limitZoom:function(a){var b=this.getMinZoom(),c=this.getMaxZoom();return Math.max(b,Math.min(c,a))}}),e.map=function(a,b){return new e.Map(a,b)},e.Projection.Mercator={MAX_LATITUDE:85.0840591556,R_MINOR:6356752.314245179,R_MAJOR:6378137,project:function(a){var b=e.LatLng.DEG_TO_RAD,c=this.MAX_LATITUDE,d=Math.max(Math.min(c,a.lat),-c),f=this.R_MAJOR,g=this.R_MINOR,h=a.lng*b*f,i=d*b,j=g/f,k=Math.sqrt(1-j*j),l=k*Math.sin(i);l=Math.pow((1-l)/(1+l),.5*k);var m=Math.tan(.5*(.5*Math.PI-i))/l;return i=-f*Math.log(m),new e.Point(h,i)},unproject:function(a){for(var b,c=e.LatLng.RAD_TO_DEG,d=this.R_MAJOR,f=this.R_MINOR,g=a.x*c/d,h=f/d,i=Math.sqrt(1-h*h),j=Math.exp(-a.y/d),k=Math.PI/2-2*Math.atan(j),l=15,m=1e-7,n=l,o=.1;Math.abs(o)>m&&--n>0;)b=i*Math.sin(k),
o=Math.PI/2-2*Math.atan(j*Math.pow((1-b)/(1+b),.5*i))-k,k+=o;return new e.LatLng(k*c,g)}},e.CRS.EPSG3395=e.extend({},e.CRS,{code:"EPSG:3395",projection:e.Projection.Mercator,transformation:function(){var a=e.Projection.Mercator,b=a.R_MAJOR,c=.5/(Math.PI*b);return new e.Transformation(c,.5,-c,.5)}()}),e.TileLayer=e.Class.extend({includes:e.Mixin.Events,options:{minZoom:0,maxZoom:18,tileSize:256,subdomains:"abc",errorTileUrl:"",attribution:"",zoomOffset:0,opacity:1,unloadInvisibleTiles:e.Browser.mobile,updateWhenIdle:e.Browser.mobile},initialize:function(a,b){b=e.setOptions(this,b),b.detectRetina&&e.Browser.retina&&b.maxZoom>0&&(b.tileSize=Math.floor(b.tileSize/2),b.zoomOffset++,b.minZoom>0&&b.minZoom--,this.options.maxZoom--),b.bounds&&(b.bounds=e.latLngBounds(b.bounds)),this._url=a;var c=this.options.subdomains;"string"==typeof c&&(this.options.subdomains=c.split(""))},onAdd:function(a){this._map=a,this._animated=a._zoomAnimated,this._initContainer(),a.on({viewreset:this._reset,moveend:this._update},this),this._animated&&a.on({zoomanim:this._animateZoom,zoomend:this._endZoomAnim},this),this.options.updateWhenIdle||(this._limitedUpdate=e.Util.limitExecByInterval(this._update,150,this),a.on("move",this._limitedUpdate,this)),this._reset(),this._update()},addTo:function(a){return a.addLayer(this),this},onRemove:function(a){this._container.parentNode.removeChild(this._container),a.off({viewreset:this._reset,moveend:this._update},this),this._animated&&a.off({zoomanim:this._animateZoom,zoomend:this._endZoomAnim},this),this.options.updateWhenIdle||a.off("move",this._limitedUpdate,this),this._container=null,this._map=null},bringToFront:function(){var a=this._map._panes.tilePane;return this._container&&(a.appendChild(this._container),this._setAutoZIndex(a,Math.max)),this},bringToBack:function(){var a=this._map._panes.tilePane;return this._container&&(a.insertBefore(this._container,a.firstChild),this._setAutoZIndex(a,Math.min)),this},getAttribution:function(){return this.options.attribution},getContainer:function(){return this._container},setOpacity:function(a){return this.options.opacity=a,this._map&&this._updateOpacity(),this},setZIndex:function(a){return this.options.zIndex=a,this._updateZIndex(),this},setUrl:function(a,b){return this._url=a,b||this.redraw(),this},redraw:function(){return this._map&&(this._reset({hard:!0}),this._update()),this},_updateZIndex:function(){this._container&&this.options.zIndex!==c&&(this._container.style.zIndex=this.options.zIndex)},_setAutoZIndex:function(a,b){var c,d,e,f=a.children,g=-b(1/0,-1/0);for(d=0,e=f.length;e>d;d++)f[d]!==this._container&&(c=parseInt(f[d].style.zIndex,10),isNaN(c)||(g=b(g,c)));this.options.zIndex=this._container.style.zIndex=(isFinite(g)?g:0)+b(1,-1)},_updateOpacity:function(){var a,b=this._tiles;if(e.Browser.ielt9)for(a in b)e.DomUtil.setOpacity(b[a],this.options.opacity);else e.DomUtil.setOpacity(this._container,this.options.opacity)},_initContainer:function(){var a=this._map._panes.tilePane;if(!this._container){if(this._container=e.DomUtil.create("div","leaflet-layer"),this._updateZIndex(),this._animated){var b="leaflet-tile-container";this._bgBuffer=e.DomUtil.create("div",b,this._container),this._tileContainer=e.DomUtil.create("div",b,this._container)}else this._tileContainer=this._container;a.appendChild(this._container),this.options.opacity<1&&this._updateOpacity()}},_reset:function(a){for(var b in this._tiles)this.fire("tileunload",{tile:this._tiles[b]});this._tiles={},this._tilesToLoad=0,this.options.reuseTiles&&(this._unusedTiles=[]),this._tileContainer.innerHTML="",this._animated&&a&&a.hard&&this._clearBgBuffer(),this._initContainer()},_getTileSize:function(){var a=this._map,b=a.getZoom()+this.options.zoomOffset,c=this.options.maxNativeZoom,d=this.options.tileSize;return c&&b>c&&(d=Math.round(a.getZoomScale(b)/a.getZoomScale(c)*d)),d},_update:function(){if(this._map){var a=this._map,b=a.getPixelBounds(),c=a.getZoom(),d=this._getTileSize();if(!(c>this.options.maxZoom||c<this.options.minZoom)){var f=e.bounds(b.min.divideBy(d)._floor(),b.max.divideBy(d)._floor());this._addTilesFromCenterOut(f),(this.options.unloadInvisibleTiles||this.options.reuseTiles)&&this._removeOtherTiles(f)}}},_addTilesFromCenterOut:function(a){var c,d,f,g=[],h=a.getCenter();for(c=a.min.y;c<=a.max.y;c++)for(d=a.min.x;d<=a.max.x;d++)f=new e.Point(d,c),this._tileShouldBeLoaded(f)&&g.push(f);var i=g.length;if(0!==i){g.sort(function(a,b){return a.distanceTo(h)-b.distanceTo(h)});var j=b.createDocumentFragment();for(this._tilesToLoad||this.fire("loading"),this._tilesToLoad+=i,d=0;i>d;d++)this._addTile(g[d],j);this._tileContainer.appendChild(j)}},_tileShouldBeLoaded:function(a){if(a.x+":"+a.y in this._tiles)return!1;var b=this.options;if(!b.continuousWorld){var c=this._getWrapTileNum();if(b.noWrap&&(a.x<0||a.x>=c.x)||a.y<0||a.y>=c.y)return!1}if(b.bounds){var d=b.tileSize,e=a.multiplyBy(d),f=e.add([d,d]),g=this._map.unproject(e),h=this._map.unproject(f);if(b.continuousWorld||b.noWrap||(g=g.wrap(),h=h.wrap()),!b.bounds.intersects([g,h]))return!1}return!0},_removeOtherTiles:function(a){var b,c,d,e;for(e in this._tiles)b=e.split(":"),c=parseInt(b[0],10),d=parseInt(b[1],10),(c<a.min.x||c>a.max.x||d<a.min.y||d>a.max.y)&&this._removeTile(e)},_removeTile:function(a){var b=this._tiles[a];this.fire("tileunload",{tile:b,url:b.src}),this.options.reuseTiles?(e.DomUtil.removeClass(b,"leaflet-tile-loaded"),this._unusedTiles.push(b)):b.parentNode===this._tileContainer&&this._tileContainer.removeChild(b),e.Browser.android||(b.onload=null,b.src=e.Util.emptyImageUrl),delete this._tiles[a]},_addTile:function(a,b){var c=this._getTilePos(a),d=this._getTile();e.DomUtil.setPosition(d,c,e.Browser.chrome),this._tiles[a.x+":"+a.y]=d,this._loadTile(d,a),d.parentNode!==this._tileContainer&&b.appendChild(d)},_getZoomForUrl:function(){var a=this.options,b=this._map.getZoom();return a.zoomReverse&&(b=a.maxZoom-b),b+=a.zoomOffset,a.maxNativeZoom?Math.min(b,a.maxNativeZoom):b},_getTilePos:function(a){var b=this._map.getPixelOrigin(),c=this._getTileSize();return a.multiplyBy(c).subtract(b)},getTileUrl:function(a){return e.Util.template(this._url,e.extend({s:this._getSubdomain(a),z:a.z,x:a.x,y:a.y},this.options))},_getWrapTileNum:function(){var a=this._map.options.crs,b=a.getSize(this._map.getZoom());return b.divideBy(this._getTileSize())._floor()},_adjustTilePoint:function(a){var b=this._getWrapTileNum();this.options.continuousWorld||this.options.noWrap||(a.x=(a.x%b.x+b.x)%b.x),this.options.tms&&(a.y=b.y-a.y-1),a.z=this._getZoomForUrl()},_getSubdomain:function(a){var b=Math.abs(a.x+a.y)%this.options.subdomains.length;return this.options.subdomains[b]},_getTile:function(){if(this.options.reuseTiles&&this._unusedTiles.length>0){var a=this._unusedTiles.pop();return this._resetTile(a),a}return this._createTile()},_resetTile:function(){},_createTile:function(){var a=e.DomUtil.create("img","leaflet-tile");return a.style.width=a.style.height=this._getTileSize()+"px",a.galleryimg="no",a.onselectstart=a.onmousemove=e.Util.falseFn,e.Browser.ielt9&&this.options.opacity!==c&&e.DomUtil.setOpacity(a,this.options.opacity),e.Browser.mobileWebkit3d&&(a.style.WebkitBackfaceVisibility="hidden"),a},_loadTile:function(a,b){a._layer=this,a.onload=this._tileOnLoad,a.onerror=this._tileOnError,this._adjustTilePoint(b),a.src=this.getTileUrl(b),this.fire("tileloadstart",{tile:a,url:a.src})},_tileLoaded:function(){this._tilesToLoad--,this._animated&&e.DomUtil.addClass(this._tileContainer,"leaflet-zoom-animated"),this._tilesToLoad||(this.fire("load"),this._animated&&(clearTimeout(this._clearBgBufferTimer),this._clearBgBufferTimer=setTimeout(e.bind(this._clearBgBuffer,this),500)))},_tileOnLoad:function(){var a=this._layer;this.src!==e.Util.emptyImageUrl&&(e.DomUtil.addClass(this,"leaflet-tile-loaded"),a.fire("tileload",{tile:this,url:this.src})),a._tileLoaded()},_tileOnError:function(){var a=this._layer;a.fire("tileerror",{tile:this,url:this.src});var b=a.options.errorTileUrl;b&&(this.src=b),a._tileLoaded()}}),e.tileLayer=function(a,b){return new e.TileLayer(a,b)},e.TileLayer.WMS=e.TileLayer.extend({defaultWmsParams:{service:"WMS",request:"GetMap",version:"1.1.1",layers:"",styles:"",format:"image/jpeg",transparent:!1},initialize:function(a,b){this._url=a;var c=e.extend({},this.defaultWmsParams),d=b.tileSize||this.options.tileSize;c.width=c.height=b.detectRetina&&e.Browser.retina?2*d:d;for(var f in b)this.options.hasOwnProperty(f)||"crs"===f||(c[f]=b[f]);this.wmsParams=c,e.setOptions(this,b)},onAdd:function(a){this._crs=this.options.crs||a.options.crs,this._wmsVersion=parseFloat(this.wmsParams.version);var b=this._wmsVersion>=1.3?"crs":"srs";this.wmsParams[b]=this._crs.code,e.TileLayer.prototype.onAdd.call(this,a)},getTileUrl:function(a){var b=this._map,c=this.options.tileSize,d=a.multiplyBy(c),f=d.add([c,c]),g=this._crs.project(b.unproject(d,a.z)),h=this._crs.project(b.unproject(f,a.z)),i=this._wmsVersion>=1.3&&this._crs===e.CRS.EPSG4326?[h.y,g.x,g.y,h.x].join(","):[g.x,h.y,h.x,g.y].join(","),j=e.Util.template(this._url,{s:this._getSubdomain(a)});return j+e.Util.getParamString(this.wmsParams,j,!0)+"&BBOX="+i},setParams:function(a,b){return e.extend(this.wmsParams,a),b||this.redraw(),this}}),e.tileLayer.wms=function(a,b){return new e.TileLayer.WMS(a,b)},e.TileLayer.Canvas=e.TileLayer.extend({options:{async:!1},initialize:function(a){e.setOptions(this,a)},redraw:function(){this._map&&(this._reset({hard:!0}),this._update());for(var a in this._tiles)this._redrawTile(this._tiles[a]);return this},_redrawTile:function(a){this.drawTile(a,a._tilePoint,this._map._zoom)},_createTile:function(){var a=e.DomUtil.create("canvas","leaflet-tile");return a.width=a.height=this.options.tileSize,a.onselectstart=a.onmousemove=e.Util.falseFn,a},_loadTile:function(a,b){a._layer=this,a._tilePoint=b,this._redrawTile(a),this.options.async||this.tileDrawn(a)},drawTile:function(){},tileDrawn:function(a){this._tileOnLoad.call(a)}}),e.tileLayer.canvas=function(a){return new e.TileLayer.Canvas(a)},e.ImageOverlay=e.Class.extend({includes:e.Mixin.Events,options:{opacity:1},initialize:function(a,b,c){this._url=a,this._bounds=e.latLngBounds(b),e.setOptions(this,c)},onAdd:function(a){this._map=a,this._image||this._initImage(),a._panes.overlayPane.appendChild(this._image),a.on("viewreset",this._reset,this),a.options.zoomAnimation&&e.Browser.any3d&&a.on("zoomanim",this._animateZoom,this),this._reset()},onRemove:function(a){a.getPanes().overlayPane.removeChild(this._image),a.off("viewreset",this._reset,this),a.options.zoomAnimation&&a.off("zoomanim",this._animateZoom,this)},addTo:function(a){return a.addLayer(this),this},setOpacity:function(a){return this.options.opacity=a,this._updateOpacity(),this},bringToFront:function(){return this._image&&this._map._panes.overlayPane.appendChild(this._image),this},bringToBack:function(){var a=this._map._panes.overlayPane;return this._image&&a.insertBefore(this._image,a.firstChild),this},setUrl:function(a){this._url=a,this._image.src=this._url},getAttribution:function(){return this.options.attribution},_initImage:function(){this._image=e.DomUtil.create("img","leaflet-image-layer"),this._map.options.zoomAnimation&&e.Browser.any3d?e.DomUtil.addClass(this._image,"leaflet-zoom-animated"):e.DomUtil.addClass(this._image,"leaflet-zoom-hide"),this._updateOpacity(),e.extend(this._image,{galleryimg:"no",onselectstart:e.Util.falseFn,onmousemove:e.Util.falseFn,onload:e.bind(this._onImageLoad,this),src:this._url})},_animateZoom:function(a){var b=this._map,c=this._image,d=b.getZoomScale(a.zoom),f=this._bounds.getNorthWest(),g=this._bounds.getSouthEast(),h=b._latLngToNewLayerPoint(f,a.zoom,a.center),i=b._latLngToNewLayerPoint(g,a.zoom,a.center)._subtract(h),j=h._add(i._multiplyBy(.5*(1-1/d)));c.style[e.DomUtil.TRANSFORM]=e.DomUtil.getTranslateString(j)+" scale("+d+") "},_reset:function(){var a=this._image,b=this._map.latLngToLayerPoint(this._bounds.getNorthWest()),c=this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(b);e.DomUtil.setPosition(a,b),a.style.width=c.x+"px",a.style.height=c.y+"px"},_onImageLoad:function(){this.fire("load")},_updateOpacity:function(){e.DomUtil.setOpacity(this._image,this.options.opacity)}}),e.imageOverlay=function(a,b,c){return new e.ImageOverlay(a,b,c)},e.Icon=e.Class.extend({options:{className:""},initialize:function(a){e.setOptions(this,a)},createIcon:function(a){return this._createIcon("icon",a)},createShadow:function(a){return this._createIcon("shadow",a)},_createIcon:function(a,b){var c=this._getIconUrl(a);if(!c){if("icon"===a)throw new Error("iconUrl not set in Icon options (see the docs).");return null}var d;return d=b&&"IMG"===b.tagName?this._createImg(c,b):this._createImg(c),this._setIconStyles(d,a),d},_setIconStyles:function(a,b){var c,d=this.options,f=e.point(d[b+"Size"]);c=e.point("shadow"===b?d.shadowAnchor||d.iconAnchor:d.iconAnchor),!c&&f&&(c=f.divideBy(2,!0)),a.className="leaflet-marker-"+b+" "+d.className,c&&(a.style.marginLeft=-c.x+"px",a.style.marginTop=-c.y+"px"),f&&(a.style.width=f.x+"px",a.style.height=f.y+"px")},_createImg:function(a,c){return c=c||b.createElement("img"),c.src=a,c},_getIconUrl:function(a){return e.Browser.retina&&this.options[a+"RetinaUrl"]?this.options[a+"RetinaUrl"]:this.options[a+"Url"]}}),e.icon=function(a){return new e.Icon(a)},e.Icon.Default=e.Icon.extend({options:{iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]},_getIconUrl:function(a){var b=a+"Url";if(this.options[b])return this.options[b];e.Browser.retina&&"icon"===a&&(a+="-2x");var c=e.Icon.Default.imagePath;if(!c)throw new Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");return c+"/marker-"+a+".png"}}),e.Icon.Default.imagePath=function(){var a,c,d,e,f,g=b.getElementsByTagName("script"),h=/[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;for(a=0,c=g.length;c>a;a++)if(d=g[a].src,e=d.match(h))return f=d.split(h)[0],(f?f+"/":"")+"images"}(),e.Marker=e.Class.extend({includes:e.Mixin.Events,options:{icon:new e.Icon.Default,title:"",alt:"",clickable:!0,draggable:!1,keyboard:!0,zIndexOffset:0,opacity:1,riseOnHover:!1,riseOffset:250},initialize:function(a,b){e.setOptions(this,b),this._latlng=e.latLng(a)},onAdd:function(a){this._map=a,a.on("viewreset",this.update,this),this._initIcon(),this.update(),this.fire("add"),a.options.zoomAnimation&&a.options.markerZoomAnimation&&a.on("zoomanim",this._animateZoom,this)},addTo:function(a){return a.addLayer(this),this},onRemove:function(a){this.dragging&&this.dragging.disable(),this._removeIcon(),this._removeShadow(),this.fire("remove"),a.off({viewreset:this.update,zoomanim:this._animateZoom},this),this._map=null},getLatLng:function(){return this._latlng},setLatLng:function(a){return this._latlng=e.latLng(a),this.update(),this.fire("move",{latlng:this._latlng})},setZIndexOffset:function(a){return this.options.zIndexOffset=a,this.update(),this},setIcon:function(a){return this.options.icon=a,this._map&&(this._initIcon(),this.update()),this._popup&&this.bindPopup(this._popup),this},update:function(){if(this._icon){var a=this._map.latLngToLayerPoint(this._latlng).round();this._setPos(a)}return this},_initIcon:function(){var a=this.options,b=this._map,c=b.options.zoomAnimation&&b.options.markerZoomAnimation,d=c?"leaflet-zoom-animated":"leaflet-zoom-hide",f=a.icon.createIcon(this._icon),g=!1;f!==this._icon&&(this._icon&&this._removeIcon(),g=!0,a.title&&(f.title=a.title),a.alt&&(f.alt=a.alt)),e.DomUtil.addClass(f,d),a.keyboard&&(f.tabIndex="0"),this._icon=f,this._initInteraction(),a.riseOnHover&&e.DomEvent.on(f,"mouseover",this._bringToFront,this).on(f,"mouseout",this._resetZIndex,this);var h=a.icon.createShadow(this._shadow),i=!1;h!==this._shadow&&(this._removeShadow(),i=!0),h&&e.DomUtil.addClass(h,d),this._shadow=h,a.opacity<1&&this._updateOpacity();var j=this._map._panes;g&&j.markerPane.appendChild(this._icon),h&&i&&j.shadowPane.appendChild(this._shadow)},_removeIcon:function(){this.options.riseOnHover&&e.DomEvent.off(this._icon,"mouseover",this._bringToFront).off(this._icon,"mouseout",this._resetZIndex),this._map._panes.markerPane.removeChild(this._icon),this._icon=null},_removeShadow:function(){this._shadow&&this._map._panes.shadowPane.removeChild(this._shadow),this._shadow=null},_setPos:function(a){e.DomUtil.setPosition(this._icon,a),this._shadow&&e.DomUtil.setPosition(this._shadow,a),this._zIndex=a.y+this.options.zIndexOffset,this._resetZIndex()},_updateZIndex:function(a){this._icon.style.zIndex=this._zIndex+a},_animateZoom:function(a){var b=this._map._latLngToNewLayerPoint(this._latlng,a.zoom,a.center).round();this._setPos(b)},_initInteraction:function(){if(this.options.clickable){var a=this._icon,b=["dblclick","mousedown","mouseover","mouseout","contextmenu"];e.DomUtil.addClass(a,"leaflet-clickable"),e.DomEvent.on(a,"click",this._onMouseClick,this),e.DomEvent.on(a,"keypress",this._onKeyPress,this);for(var c=0;c<b.length;c++)e.DomEvent.on(a,b[c],this._fireMouseEvent,this);e.Handler.MarkerDrag&&(this.dragging=new e.Handler.MarkerDrag(this),this.options.draggable&&this.dragging.enable())}},_onMouseClick:function(a){var b=this.dragging&&this.dragging.moved();(this.hasEventListeners(a.type)||b)&&e.DomEvent.stopPropagation(a),b||(this.dragging&&this.dragging._enabled||!this._map.dragging||!this._map.dragging.moved())&&this.fire(a.type,{originalEvent:a,latlng:this._latlng})},_onKeyPress:function(a){13===a.keyCode&&this.fire("click",{originalEvent:a,latlng:this._latlng})},_fireMouseEvent:function(a){this.fire(a.type,{originalEvent:a,latlng:this._latlng}),"contextmenu"===a.type&&this.hasEventListeners(a.type)&&e.DomEvent.preventDefault(a),"mousedown"!==a.type?e.DomEvent.stopPropagation(a):e.DomEvent.preventDefault(a)},setOpacity:function(a){return this.options.opacity=a,this._map&&this._updateOpacity(),this},_updateOpacity:function(){e.DomUtil.setOpacity(this._icon,this.options.opacity),this._shadow&&e.DomUtil.setOpacity(this._shadow,this.options.opacity)},_bringToFront:function(){this._updateZIndex(this.options.riseOffset)},_resetZIndex:function(){this._updateZIndex(0)}}),e.marker=function(a,b){return new e.Marker(a,b)},e.DivIcon=e.Icon.extend({options:{iconSize:[12,12],className:"leaflet-div-icon",html:!1},createIcon:function(a){var c=a&&"DIV"===a.tagName?a:b.createElement("div"),d=this.options;return c.innerHTML=d.html!==!1?d.html:"",d.bgPos&&(c.style.backgroundPosition=-d.bgPos.x+"px "+-d.bgPos.y+"px"),this._setIconStyles(c,"icon"),c},createShadow:function(){return null}}),e.divIcon=function(a){return new e.DivIcon(a)},e.Map.mergeOptions({closePopupOnClick:!0}),e.Popup=e.Class.extend({includes:e.Mixin.Events,options:{minWidth:50,maxWidth:300,autoPan:!0,closeButton:!0,offset:[0,7],autoPanPadding:[5,5],keepInView:!1,className:"",zoomAnimation:!0},initialize:function(a,b){e.setOptions(this,a),this._source=b,this._animated=e.Browser.any3d&&this.options.zoomAnimation,this._isOpen=!1},onAdd:function(a){this._map=a,this._container||this._initLayout();var b=a.options.fadeAnimation;b&&e.DomUtil.setOpacity(this._container,0),a._panes.popupPane.appendChild(this._container),a.on(this._getEvents(),this),this.update(),b&&e.DomUtil.setOpacity(this._container,1),this.fire("open"),a.fire("popupopen",{popup:this}),this._source&&this._source.fire("popupopen",{popup:this})},addTo:function(a){return a.addLayer(this),this},openOn:function(a){return a.openPopup(this),this},onRemove:function(a){a._panes.popupPane.removeChild(this._container),e.Util.falseFn(this._container.offsetWidth),a.off(this._getEvents(),this),a.options.fadeAnimation&&e.DomUtil.setOpacity(this._container,0),this._map=null,this.fire("close"),a.fire("popupclose",{popup:this}),this._source&&this._source.fire("popupclose",{popup:this})},getLatLng:function(){return this._latlng},setLatLng:function(a){return this._latlng=e.latLng(a),this._map&&(this._updatePosition(),this._adjustPan()),this},getContent:function(){return this._content},setContent:function(a){return this._content=a,this.update(),this},update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updateLayout(),this._updatePosition(),this._container.style.visibility="",this._adjustPan())},_getEvents:function(){var a={viewreset:this._updatePosition};return this._animated&&(a.zoomanim=this._zoomAnimation),("closeOnClick"in this.options?this.options.closeOnClick:this._map.options.closePopupOnClick)&&(a.preclick=this._close),this.options.keepInView&&(a.moveend=this._adjustPan),a},_close:function(){this._map&&this._map.closePopup(this)},_initLayout:function(){var a,b="leaflet-popup",c=b+" "+this.options.className+" leaflet-zoom-"+(this._animated?"animated":"hide"),d=this._container=e.DomUtil.create("div",c);this.options.closeButton&&(a=this._closeButton=e.DomUtil.create("a",b+"-close-button",d),a.href="#close",a.innerHTML="&#215;",e.DomEvent.disableClickPropagation(a),e.DomEvent.on(a,"click",this._onCloseButtonClick,this));var f=this._wrapper=e.DomUtil.create("div",b+"-content-wrapper",d);e.DomEvent.disableClickPropagation(f),this._contentNode=e.DomUtil.create("div",b+"-content",f),e.DomEvent.disableScrollPropagation(this._contentNode),e.DomEvent.on(f,"contextmenu",e.DomEvent.stopPropagation),this._tipContainer=e.DomUtil.create("div",b+"-tip-container",d),this._tip=e.DomUtil.create("div",b+"-tip",this._tipContainer)},_updateContent:function(){if(this._content){if("string"==typeof this._content)this._contentNode.innerHTML=this._content;else{for(;this._contentNode.hasChildNodes();)this._contentNode.removeChild(this._contentNode.firstChild);this._contentNode.appendChild(this._content)}this.fire("contentupdate")}},_updateLayout:function(){var a=this._contentNode,b=a.style;b.width="",b.whiteSpace="nowrap";var c=a.offsetWidth;c=Math.min(c,this.options.maxWidth),c=Math.max(c,this.options.minWidth),b.width=c+1+"px",b.whiteSpace="",b.height="";var d=a.offsetHeight,f=this.options.maxHeight,g="leaflet-popup-scrolled";f&&d>f?(b.height=f+"px",e.DomUtil.addClass(a,g)):e.DomUtil.removeClass(a,g),this._containerWidth=this._container.offsetWidth},_updatePosition:function(){if(this._map){var a=this._map.latLngToLayerPoint(this._latlng),b=this._animated,c=e.point(this.options.offset);b&&e.DomUtil.setPosition(this._container,a),this._containerBottom=-c.y-(b?0:a.y),this._containerLeft=-Math.round(this._containerWidth/2)+c.x+(b?0:a.x),this._container.style.bottom=this._containerBottom+"px",this._container.style.left=this._containerLeft+"px"}},_zoomAnimation:function(a){var b=this._map._latLngToNewLayerPoint(this._latlng,a.zoom,a.center);e.DomUtil.setPosition(this._container,b)},_adjustPan:function(){if(this.options.autoPan){var a=this._map,b=this._container.offsetHeight,c=this._containerWidth,d=new e.Point(this._containerLeft,-b-this._containerBottom);this._animated&&d._add(e.DomUtil.getPosition(this._container));var f=a.layerPointToContainerPoint(d),g=e.point(this.options.autoPanPadding),h=e.point(this.options.autoPanPaddingTopLeft||g),i=e.point(this.options.autoPanPaddingBottomRight||g),j=a.getSize(),k=0,l=0;f.x+c+i.x>j.x&&(k=f.x+c-j.x+i.x),f.x-k-h.x<0&&(k=f.x-h.x),f.y+b+i.y>j.y&&(l=f.y+b-j.y+i.y),f.y-l-h.y<0&&(l=f.y-h.y),(k||l)&&a.fire("autopanstart").panBy([k,l])}},_onCloseButtonClick:function(a){this._close(),e.DomEvent.stop(a)}}),e.popup=function(a,b){return new e.Popup(a,b)},e.Map.include({openPopup:function(a,b,c){if(this.closePopup(),!(a instanceof e.Popup)){var d=a;a=new e.Popup(c).setLatLng(b).setContent(d)}return a._isOpen=!0,this._popup=a,this.addLayer(a)},closePopup:function(a){return a&&a!==this._popup||(a=this._popup,this._popup=null),a&&(this.removeLayer(a),a._isOpen=!1),this}}),e.Marker.include({openPopup:function(){return this._popup&&this._map&&!this._map.hasLayer(this._popup)&&(this._popup.setLatLng(this._latlng),this._map.openPopup(this._popup)),this},closePopup:function(){return this._popup&&this._popup._close(),this},togglePopup:function(){return this._popup&&(this._popup._isOpen?this.closePopup():this.openPopup()),this},bindPopup:function(a,b){var c=e.point(this.options.icon.options.popupAnchor||[0,0]);return c=c.add(e.Popup.prototype.options.offset),b&&b.offset&&(c=c.add(b.offset)),b=e.extend({offset:c},b),this._popupHandlersAdded||(this.on("click",this.togglePopup,this).on("remove",this.closePopup,this).on("move",this._movePopup,this),this._popupHandlersAdded=!0),a instanceof e.Popup?(e.setOptions(a,b),this._popup=a):this._popup=new e.Popup(b,this).setContent(a),this},setPopupContent:function(a){return this._popup&&this._popup.setContent(a),this},unbindPopup:function(){return this._popup&&(this._popup=null,this.off("click",this.togglePopup,this).off("remove",this.closePopup,this).off("move",this._movePopup,this),this._popupHandlersAdded=!1),this},getPopup:function(){return this._popup},_movePopup:function(a){this._popup.setLatLng(a.latlng)}}),e.LayerGroup=e.Class.extend({initialize:function(a){this._layers={};var b,c;if(a)for(b=0,c=a.length;c>b;b++)this.addLayer(a[b])},addLayer:function(a){var b=this.getLayerId(a);return this._layers[b]=a,this._map&&this._map.addLayer(a),this},removeLayer:function(a){var b=a in this._layers?a:this.getLayerId(a);return this._map&&this._layers[b]&&this._map.removeLayer(this._layers[b]),delete this._layers[b],this},hasLayer:function(a){return a?a in this._layers||this.getLayerId(a)in this._layers:!1},clearLayers:function(){return this.eachLayer(this.removeLayer,this),this},invoke:function(a){var b,c,d=Array.prototype.slice.call(arguments,1);for(b in this._layers)c=this._layers[b],c[a]&&c[a].apply(c,d);return this},onAdd:function(a){this._map=a,this.eachLayer(a.addLayer,a)},onRemove:function(a){this.eachLayer(a.removeLayer,a),this._map=null},addTo:function(a){return a.addLayer(this),this},eachLayer:function(a,b){for(var c in this._layers)a.call(b,this._layers[c]);return this},getLayer:function(a){return this._layers[a]},getLayers:function(){var a=[];for(var b in this._layers)a.push(this._layers[b]);return a},setZIndex:function(a){return this.invoke("setZIndex",a)},getLayerId:function(a){return e.stamp(a)}}),e.layerGroup=function(a){return new e.LayerGroup(a)},e.FeatureGroup=e.LayerGroup.extend({includes:e.Mixin.Events,statics:{EVENTS:"click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose"},addLayer:function(a){return this.hasLayer(a)?this:("on"in a&&a.on(e.FeatureGroup.EVENTS,this._propagateEvent,this),e.LayerGroup.prototype.addLayer.call(this,a),this._popupContent&&a.bindPopup&&a.bindPopup(this._popupContent,this._popupOptions),this.fire("layeradd",{layer:a}))},removeLayer:function(a){return this.hasLayer(a)?(a in this._layers&&(a=this._layers[a]),a.off(e.FeatureGroup.EVENTS,this._propagateEvent,this),e.LayerGroup.prototype.removeLayer.call(this,a),this._popupContent&&this.invoke("unbindPopup"),this.fire("layerremove",{layer:a})):this},bindPopup:function(a,b){return this._popupContent=a,this._popupOptions=b,this.invoke("bindPopup",a,b)},openPopup:function(a){for(var b in this._layers){this._layers[b].openPopup(a);break}return this},setStyle:function(a){return this.invoke("setStyle",a)},bringToFront:function(){return this.invoke("bringToFront")},bringToBack:function(){return this.invoke("bringToBack")},getBounds:function(){var a=new e.LatLngBounds;return this.eachLayer(function(b){a.extend(b instanceof e.Marker?b.getLatLng():b.getBounds())}),a},_propagateEvent:function(a){a=e.extend({layer:a.target,target:this},a),this.fire(a.type,a)}}),e.featureGroup=function(a){return new e.FeatureGroup(a)},e.Path=e.Class.extend({includes:[e.Mixin.Events],statics:{CLIP_PADDING:function(){var b=e.Browser.mobile?1280:2e3,c=(b/Math.max(a.outerWidth,a.outerHeight)-1)/2;return Math.max(0,Math.min(.5,c))}()},options:{stroke:!0,color:"#0033ff",dashArray:null,lineCap:null,lineJoin:null,weight:5,opacity:.5,fill:!1,fillColor:null,fillOpacity:.2,clickable:!0},initialize:function(a){e.setOptions(this,a)},onAdd:function(a){this._map=a,this._container||(this._initElements(),this._initEvents()),this.projectLatlngs(),this._updatePath(),this._container&&this._map._pathRoot.appendChild(this._container),this.fire("add"),a.on({viewreset:this.projectLatlngs,moveend:this._updatePath},this)},addTo:function(a){return a.addLayer(this),this},onRemove:function(a){a._pathRoot.removeChild(this._container),this.fire("remove"),this._map=null,e.Browser.vml&&(this._container=null,this._stroke=null,this._fill=null),a.off({viewreset:this.projectLatlngs,moveend:this._updatePath},this)},projectLatlngs:function(){},setStyle:function(a){return e.setOptions(this,a),this._container&&this._updateStyle(),this},redraw:function(){return this._map&&(this.projectLatlngs(),this._updatePath()),this}}),e.Map.include({_updatePathViewport:function(){var a=e.Path.CLIP_PADDING,b=this.getSize(),c=e.DomUtil.getPosition(this._mapPane),d=c.multiplyBy(-1)._subtract(b.multiplyBy(a)._round()),f=d.add(b.multiplyBy(1+2*a)._round());this._pathViewport=new e.Bounds(d,f)}}),e.Path.SVG_NS="http://www.w3.org/2000/svg",e.Browser.svg=!(!b.createElementNS||!b.createElementNS(e.Path.SVG_NS,"svg").createSVGRect),e.Path=e.Path.extend({statics:{SVG:e.Browser.svg},bringToFront:function(){var a=this._map._pathRoot,b=this._container;return b&&a.lastChild!==b&&a.appendChild(b),this},bringToBack:function(){var a=this._map._pathRoot,b=this._container,c=a.firstChild;return b&&c!==b&&a.insertBefore(b,c),this},getPathString:function(){},_createElement:function(a){return b.createElementNS(e.Path.SVG_NS,a)},_initElements:function(){this._map._initPathRoot(),this._initPath(),this._initStyle()},_initPath:function(){this._container=this._createElement("g"),this._path=this._createElement("path"),this.options.className&&e.DomUtil.addClass(this._path,this.options.className),this._container.appendChild(this._path)},_initStyle:function(){this.options.stroke&&(this._path.setAttribute("stroke-linejoin","round"),this._path.setAttribute("stroke-linecap","round")),this.options.fill&&this._path.setAttribute("fill-rule","evenodd"),this.options.pointerEvents&&this._path.setAttribute("pointer-events",this.options.pointerEvents),this.options.clickable||this.options.pointerEvents||this._path.setAttribute("pointer-events","none"),this._updateStyle()},_updateStyle:function(){this.options.stroke?(this._path.setAttribute("stroke",this.options.color),this._path.setAttribute("stroke-opacity",this.options.opacity),this._path.setAttribute("stroke-width",this.options.weight),this.options.dashArray?this._path.setAttribute("stroke-dasharray",this.options.dashArray):this._path.removeAttribute("stroke-dasharray"),this.options.lineCap&&this._path.setAttribute("stroke-linecap",this.options.lineCap),this.options.lineJoin&&this._path.setAttribute("stroke-linejoin",this.options.lineJoin)):this._path.setAttribute("stroke","none"),this.options.fill?(this._path.setAttribute("fill",this.options.fillColor||this.options.color),this._path.setAttribute("fill-opacity",this.options.fillOpacity)):this._path.setAttribute("fill","none")},_updatePath:function(){var a=this.getPathString();a||(a="M0 0"),this._path.setAttribute("d",a)},_initEvents:function(){if(this.options.clickable){(e.Browser.svg||!e.Browser.vml)&&e.DomUtil.addClass(this._path,"leaflet-clickable"),e.DomEvent.on(this._container,"click",this._onMouseClick,this);for(var a=["dblclick","mousedown","mouseover","mouseout","mousemove","contextmenu"],b=0;b<a.length;b++)e.DomEvent.on(this._container,a[b],this._fireMouseEvent,this)}},_onMouseClick:function(a){this._map.dragging&&this._map.dragging.moved()||this._fireMouseEvent(a)},_fireMouseEvent:function(a){if(this.hasEventListeners(a.type)){var b=this._map,c=b.mouseEventToContainerPoint(a),d=b.containerPointToLayerPoint(c),f=b.layerPointToLatLng(d);this.fire(a.type,{latlng:f,layerPoint:d,containerPoint:c,originalEvent:a}),"contextmenu"===a.type&&e.DomEvent.preventDefault(a),"mousemove"!==a.type&&e.DomEvent.stopPropagation(a)}}}),e.Map.include({_initPathRoot:function(){this._pathRoot||(this._pathRoot=e.Path.prototype._createElement("svg"),this._panes.overlayPane.appendChild(this._pathRoot),
this.options.zoomAnimation&&e.Browser.any3d?(e.DomUtil.addClass(this._pathRoot,"leaflet-zoom-animated"),this.on({zoomanim:this._animatePathZoom,zoomend:this._endPathZoom})):e.DomUtil.addClass(this._pathRoot,"leaflet-zoom-hide"),this.on("moveend",this._updateSvgViewport),this._updateSvgViewport())},_animatePathZoom:function(a){var b=this.getZoomScale(a.zoom),c=this._getCenterOffset(a.center)._multiplyBy(-b)._add(this._pathViewport.min);this._pathRoot.style[e.DomUtil.TRANSFORM]=e.DomUtil.getTranslateString(c)+" scale("+b+") ",this._pathZooming=!0},_endPathZoom:function(){this._pathZooming=!1},_updateSvgViewport:function(){if(!this._pathZooming){this._updatePathViewport();var a=this._pathViewport,b=a.min,c=a.max,d=c.x-b.x,f=c.y-b.y,g=this._pathRoot,h=this._panes.overlayPane;e.Browser.mobileWebkit&&h.removeChild(g),e.DomUtil.setPosition(g,b),g.setAttribute("width",d),g.setAttribute("height",f),g.setAttribute("viewBox",[b.x,b.y,d,f].join(" ")),e.Browser.mobileWebkit&&h.appendChild(g)}}}),e.Path.include({bindPopup:function(a,b){return a instanceof e.Popup?this._popup=a:((!this._popup||b)&&(this._popup=new e.Popup(b,this)),this._popup.setContent(a)),this._popupHandlersAdded||(this.on("click",this._openPopup,this).on("remove",this.closePopup,this),this._popupHandlersAdded=!0),this},unbindPopup:function(){return this._popup&&(this._popup=null,this.off("click",this._openPopup).off("remove",this.closePopup),this._popupHandlersAdded=!1),this},openPopup:function(a){return this._popup&&(a=a||this._latlng||this._latlngs[Math.floor(this._latlngs.length/2)],this._openPopup({latlng:a})),this},closePopup:function(){return this._popup&&this._popup._close(),this},_openPopup:function(a){this._popup.setLatLng(a.latlng),this._map.openPopup(this._popup)}}),e.Browser.vml=!e.Browser.svg&&function(){try{var a=b.createElement("div");a.innerHTML='<v:shape adj="1"/>';var c=a.firstChild;return c.style.behavior="url(#default#VML)",c&&"object"==typeof c.adj}catch(d){return!1}}(),e.Path=e.Browser.svg||!e.Browser.vml?e.Path:e.Path.extend({statics:{VML:!0,CLIP_PADDING:.02},_createElement:function(){try{return b.namespaces.add("lvml","urn:schemas-microsoft-com:vml"),function(a){return b.createElement("<lvml:"+a+' class="lvml">')}}catch(a){return function(a){return b.createElement("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')}}}(),_initPath:function(){var a=this._container=this._createElement("shape");e.DomUtil.addClass(a,"leaflet-vml-shape"+(this.options.className?" "+this.options.className:"")),this.options.clickable&&e.DomUtil.addClass(a,"leaflet-clickable"),a.coordsize="1 1",this._path=this._createElement("path"),a.appendChild(this._path),this._map._pathRoot.appendChild(a)},_initStyle:function(){this._updateStyle()},_updateStyle:function(){var a=this._stroke,b=this._fill,c=this.options,d=this._container;d.stroked=c.stroke,d.filled=c.fill,c.stroke?(a||(a=this._stroke=this._createElement("stroke"),a.endcap="round",d.appendChild(a)),a.weight=c.weight+"px",a.color=c.color,a.opacity=c.opacity,a.dashStyle=c.dashArray?e.Util.isArray(c.dashArray)?c.dashArray.join(" "):c.dashArray.replace(/( *, *)/g," "):"",c.lineCap&&(a.endcap=c.lineCap.replace("butt","flat")),c.lineJoin&&(a.joinstyle=c.lineJoin)):a&&(d.removeChild(a),this._stroke=null),c.fill?(b||(b=this._fill=this._createElement("fill"),d.appendChild(b)),b.color=c.fillColor||c.color,b.opacity=c.fillOpacity):b&&(d.removeChild(b),this._fill=null)},_updatePath:function(){var a=this._container.style;a.display="none",this._path.v=this.getPathString()+" ",a.display=""}}),e.Map.include(e.Browser.svg||!e.Browser.vml?{}:{_initPathRoot:function(){if(!this._pathRoot){var a=this._pathRoot=b.createElement("div");a.className="leaflet-vml-container",this._panes.overlayPane.appendChild(a),this.on("moveend",this._updatePathViewport),this._updatePathViewport()}}}),e.Browser.canvas=function(){return!!b.createElement("canvas").getContext}(),e.Path=e.Path.SVG&&!a.L_PREFER_CANVAS||!e.Browser.canvas?e.Path:e.Path.extend({statics:{CANVAS:!0,SVG:!1},redraw:function(){return this._map&&(this.projectLatlngs(),this._requestUpdate()),this},setStyle:function(a){return e.setOptions(this,a),this._map&&(this._updateStyle(),this._requestUpdate()),this},onRemove:function(a){a.off("viewreset",this.projectLatlngs,this).off("moveend",this._updatePath,this),this.options.clickable&&(this._map.off("click",this._onClick,this),this._map.off("mousemove",this._onMouseMove,this)),this._requestUpdate(),this.fire("remove"),this._map=null},_requestUpdate:function(){this._map&&!e.Path._updateRequest&&(e.Path._updateRequest=e.Util.requestAnimFrame(this._fireMapMoveEnd,this._map))},_fireMapMoveEnd:function(){e.Path._updateRequest=null,this.fire("moveend")},_initElements:function(){this._map._initPathRoot(),this._ctx=this._map._canvasCtx},_updateStyle:function(){var a=this.options;a.stroke&&(this._ctx.lineWidth=a.weight,this._ctx.strokeStyle=a.color),a.fill&&(this._ctx.fillStyle=a.fillColor||a.color)},_drawPath:function(){var a,b,c,d,f,g;for(this._ctx.beginPath(),a=0,c=this._parts.length;c>a;a++){for(b=0,d=this._parts[a].length;d>b;b++)f=this._parts[a][b],g=(0===b?"move":"line")+"To",this._ctx[g](f.x,f.y);this instanceof e.Polygon&&this._ctx.closePath()}},_checkIfEmpty:function(){return!this._parts.length},_updatePath:function(){if(!this._checkIfEmpty()){var a=this._ctx,b=this.options;this._drawPath(),a.save(),this._updateStyle(),b.fill&&(a.globalAlpha=b.fillOpacity,a.fill()),b.stroke&&(a.globalAlpha=b.opacity,a.stroke()),a.restore()}},_initEvents:function(){this.options.clickable&&(this._map.on("mousemove",this._onMouseMove,this),this._map.on("click",this._onClick,this))},_onClick:function(a){this._containsPoint(a.layerPoint)&&this.fire("click",a)},_onMouseMove:function(a){this._map&&!this._map._animatingZoom&&(this._containsPoint(a.layerPoint)?(this._ctx.canvas.style.cursor="pointer",this._mouseInside=!0,this.fire("mouseover",a)):this._mouseInside&&(this._ctx.canvas.style.cursor="",this._mouseInside=!1,this.fire("mouseout",a)))}}),e.Map.include(e.Path.SVG&&!a.L_PREFER_CANVAS||!e.Browser.canvas?{}:{_initPathRoot:function(){var a,c=this._pathRoot;c||(c=this._pathRoot=b.createElement("canvas"),c.style.position="absolute",a=this._canvasCtx=c.getContext("2d"),a.lineCap="round",a.lineJoin="round",this._panes.overlayPane.appendChild(c),this.options.zoomAnimation&&(this._pathRoot.className="leaflet-zoom-animated",this.on("zoomanim",this._animatePathZoom),this.on("zoomend",this._endPathZoom)),this.on("moveend",this._updateCanvasViewport),this._updateCanvasViewport())},_updateCanvasViewport:function(){if(!this._pathZooming){this._updatePathViewport();var a=this._pathViewport,b=a.min,c=a.max.subtract(b),d=this._pathRoot;e.DomUtil.setPosition(d,b),d.width=c.x,d.height=c.y,d.getContext("2d").translate(-b.x,-b.y)}}}),e.LineUtil={simplify:function(a,b){if(!b||!a.length)return a.slice();var c=b*b;return a=this._reducePoints(a,c),a=this._simplifyDP(a,c)},pointToSegmentDistance:function(a,b,c){return Math.sqrt(this._sqClosestPointOnSegment(a,b,c,!0))},closestPointOnSegment:function(a,b,c){return this._sqClosestPointOnSegment(a,b,c)},_simplifyDP:function(a,b){var d=a.length,e=typeof Uint8Array!=c+""?Uint8Array:Array,f=new e(d);f[0]=f[d-1]=1,this._simplifyDPStep(a,f,b,0,d-1);var g,h=[];for(g=0;d>g;g++)f[g]&&h.push(a[g]);return h},_simplifyDPStep:function(a,b,c,d,e){var f,g,h,i=0;for(g=d+1;e-1>=g;g++)h=this._sqClosestPointOnSegment(a[g],a[d],a[e],!0),h>i&&(f=g,i=h);i>c&&(b[f]=1,this._simplifyDPStep(a,b,c,d,f),this._simplifyDPStep(a,b,c,f,e))},_reducePoints:function(a,b){for(var c=[a[0]],d=1,e=0,f=a.length;f>d;d++)this._sqDist(a[d],a[e])>b&&(c.push(a[d]),e=d);return f-1>e&&c.push(a[f-1]),c},clipSegment:function(a,b,c,d){var e,f,g,h=d?this._lastCode:this._getBitCode(a,c),i=this._getBitCode(b,c);for(this._lastCode=i;;){if(!(h|i))return[a,b];if(h&i)return!1;e=h||i,f=this._getEdgeIntersection(a,b,e,c),g=this._getBitCode(f,c),e===h?(a=f,h=g):(b=f,i=g)}},_getEdgeIntersection:function(a,b,c,d){var f=b.x-a.x,g=b.y-a.y,h=d.min,i=d.max;return 8&c?new e.Point(a.x+f*(i.y-a.y)/g,i.y):4&c?new e.Point(a.x+f*(h.y-a.y)/g,h.y):2&c?new e.Point(i.x,a.y+g*(i.x-a.x)/f):1&c?new e.Point(h.x,a.y+g*(h.x-a.x)/f):void 0},_getBitCode:function(a,b){var c=0;return a.x<b.min.x?c|=1:a.x>b.max.x&&(c|=2),a.y<b.min.y?c|=4:a.y>b.max.y&&(c|=8),c},_sqDist:function(a,b){var c=b.x-a.x,d=b.y-a.y;return c*c+d*d},_sqClosestPointOnSegment:function(a,b,c,d){var f,g=b.x,h=b.y,i=c.x-g,j=c.y-h,k=i*i+j*j;return k>0&&(f=((a.x-g)*i+(a.y-h)*j)/k,f>1?(g=c.x,h=c.y):f>0&&(g+=i*f,h+=j*f)),i=a.x-g,j=a.y-h,d?i*i+j*j:new e.Point(g,h)}},e.Polyline=e.Path.extend({initialize:function(a,b){e.Path.prototype.initialize.call(this,b),this._latlngs=this._convertLatLngs(a)},options:{smoothFactor:1,noClip:!1},projectLatlngs:function(){this._originalPoints=[];for(var a=0,b=this._latlngs.length;b>a;a++)this._originalPoints[a]=this._map.latLngToLayerPoint(this._latlngs[a])},getPathString:function(){for(var a=0,b=this._parts.length,c="";b>a;a++)c+=this._getPathPartStr(this._parts[a]);return c},getLatLngs:function(){return this._latlngs},setLatLngs:function(a){return this._latlngs=this._convertLatLngs(a),this.redraw()},addLatLng:function(a){return this._latlngs.push(e.latLng(a)),this.redraw()},spliceLatLngs:function(){var a=[].splice.apply(this._latlngs,arguments);return this._convertLatLngs(this._latlngs,!0),this.redraw(),a},closestLayerPoint:function(a){for(var b,c,d=1/0,f=this._parts,g=null,h=0,i=f.length;i>h;h++)for(var j=f[h],k=1,l=j.length;l>k;k++){b=j[k-1],c=j[k];var m=e.LineUtil._sqClosestPointOnSegment(a,b,c,!0);d>m&&(d=m,g=e.LineUtil._sqClosestPointOnSegment(a,b,c))}return g&&(g.distance=Math.sqrt(d)),g},getBounds:function(){return new e.LatLngBounds(this.getLatLngs())},_convertLatLngs:function(a,b){var c,d,f=b?a:[];for(c=0,d=a.length;d>c;c++){if(e.Util.isArray(a[c])&&"number"!=typeof a[c][0])return;f[c]=e.latLng(a[c])}return f},_initEvents:function(){e.Path.prototype._initEvents.call(this)},_getPathPartStr:function(a){for(var b,c=e.Path.VML,d=0,f=a.length,g="";f>d;d++)b=a[d],c&&b._round(),g+=(d?"L":"M")+b.x+" "+b.y;return g},_clipPoints:function(){var a,b,c,d=this._originalPoints,f=d.length;if(this.options.noClip)return void(this._parts=[d]);this._parts=[];var g=this._parts,h=this._map._pathViewport,i=e.LineUtil;for(a=0,b=0;f-1>a;a++)c=i.clipSegment(d[a],d[a+1],h,a),c&&(g[b]=g[b]||[],g[b].push(c[0]),(c[1]!==d[a+1]||a===f-2)&&(g[b].push(c[1]),b++))},_simplifyPoints:function(){for(var a=this._parts,b=e.LineUtil,c=0,d=a.length;d>c;c++)a[c]=b.simplify(a[c],this.options.smoothFactor)},_updatePath:function(){this._map&&(this._clipPoints(),this._simplifyPoints(),e.Path.prototype._updatePath.call(this))}}),e.polyline=function(a,b){return new e.Polyline(a,b)},e.PolyUtil={},e.PolyUtil.clipPolygon=function(a,b){var c,d,f,g,h,i,j,k,l,m=[1,4,2,8],n=e.LineUtil;for(d=0,j=a.length;j>d;d++)a[d]._code=n._getBitCode(a[d],b);for(g=0;4>g;g++){for(k=m[g],c=[],d=0,j=a.length,f=j-1;j>d;f=d++)h=a[d],i=a[f],h._code&k?i._code&k||(l=n._getEdgeIntersection(i,h,k,b),l._code=n._getBitCode(l,b),c.push(l)):(i._code&k&&(l=n._getEdgeIntersection(i,h,k,b),l._code=n._getBitCode(l,b),c.push(l)),c.push(h));a=c}return a},e.Polygon=e.Polyline.extend({options:{fill:!0},initialize:function(a,b){e.Polyline.prototype.initialize.call(this,a,b),this._initWithHoles(a)},_initWithHoles:function(a){var b,c,d;if(a&&e.Util.isArray(a[0])&&"number"!=typeof a[0][0])for(this._latlngs=this._convertLatLngs(a[0]),this._holes=a.slice(1),b=0,c=this._holes.length;c>b;b++)d=this._holes[b]=this._convertLatLngs(this._holes[b]),d[0].equals(d[d.length-1])&&d.pop();a=this._latlngs,a.length>=2&&a[0].equals(a[a.length-1])&&a.pop()},projectLatlngs:function(){if(e.Polyline.prototype.projectLatlngs.call(this),this._holePoints=[],this._holes){var a,b,c,d;for(a=0,c=this._holes.length;c>a;a++)for(this._holePoints[a]=[],b=0,d=this._holes[a].length;d>b;b++)this._holePoints[a][b]=this._map.latLngToLayerPoint(this._holes[a][b])}},setLatLngs:function(a){return a&&e.Util.isArray(a[0])&&"number"!=typeof a[0][0]?(this._initWithHoles(a),this.redraw()):e.Polyline.prototype.setLatLngs.call(this,a)},_clipPoints:function(){var a=this._originalPoints,b=[];if(this._parts=[a].concat(this._holePoints),!this.options.noClip){for(var c=0,d=this._parts.length;d>c;c++){var f=e.PolyUtil.clipPolygon(this._parts[c],this._map._pathViewport);f.length&&b.push(f)}this._parts=b}},_getPathPartStr:function(a){var b=e.Polyline.prototype._getPathPartStr.call(this,a);return b+(e.Browser.svg?"z":"x")}}),e.polygon=function(a,b){return new e.Polygon(a,b)},function(){function a(a){return e.FeatureGroup.extend({initialize:function(a,b){this._layers={},this._options=b,this.setLatLngs(a)},setLatLngs:function(b){var c=0,d=b.length;for(this.eachLayer(function(a){d>c?a.setLatLngs(b[c++]):this.removeLayer(a)},this);d>c;)this.addLayer(new a(b[c++],this._options));return this},getLatLngs:function(){var a=[];return this.eachLayer(function(b){a.push(b.getLatLngs())}),a}})}e.MultiPolyline=a(e.Polyline),e.MultiPolygon=a(e.Polygon),e.multiPolyline=function(a,b){return new e.MultiPolyline(a,b)},e.multiPolygon=function(a,b){return new e.MultiPolygon(a,b)}}(),e.Rectangle=e.Polygon.extend({initialize:function(a,b){e.Polygon.prototype.initialize.call(this,this._boundsToLatLngs(a),b)},setBounds:function(a){this.setLatLngs(this._boundsToLatLngs(a))},_boundsToLatLngs:function(a){return a=e.latLngBounds(a),[a.getSouthWest(),a.getNorthWest(),a.getNorthEast(),a.getSouthEast()]}}),e.rectangle=function(a,b){return new e.Rectangle(a,b)},e.Circle=e.Path.extend({initialize:function(a,b,c){e.Path.prototype.initialize.call(this,c),this._latlng=e.latLng(a),this._mRadius=b},options:{fill:!0},setLatLng:function(a){return this._latlng=e.latLng(a),this.redraw()},setRadius:function(a){return this._mRadius=a,this.redraw()},projectLatlngs:function(){var a=this._getLngRadius(),b=this._latlng,c=this._map.latLngToLayerPoint([b.lat,b.lng-a]);this._point=this._map.latLngToLayerPoint(b),this._radius=Math.max(this._point.x-c.x,1)},getBounds:function(){var a=this._getLngRadius(),b=this._mRadius/40075017*360,c=this._latlng;return new e.LatLngBounds([c.lat-b,c.lng-a],[c.lat+b,c.lng+a])},getLatLng:function(){return this._latlng},getPathString:function(){var a=this._point,b=this._radius;return this._checkIfEmpty()?"":e.Browser.svg?"M"+a.x+","+(a.y-b)+"A"+b+","+b+",0,1,1,"+(a.x-.1)+","+(a.y-b)+" z":(a._round(),b=Math.round(b),"AL "+a.x+","+a.y+" "+b+","+b+" 0,23592600")},getRadius:function(){return this._mRadius},_getLatRadius:function(){return this._mRadius/40075017*360},_getLngRadius:function(){return this._getLatRadius()/Math.cos(e.LatLng.DEG_TO_RAD*this._latlng.lat)},_checkIfEmpty:function(){if(!this._map)return!1;var a=this._map._pathViewport,b=this._radius,c=this._point;return c.x-b>a.max.x||c.y-b>a.max.y||c.x+b<a.min.x||c.y+b<a.min.y}}),e.circle=function(a,b,c){return new e.Circle(a,b,c)},e.CircleMarker=e.Circle.extend({options:{radius:10,weight:2},initialize:function(a,b){e.Circle.prototype.initialize.call(this,a,null,b),this._radius=this.options.radius},projectLatlngs:function(){this._point=this._map.latLngToLayerPoint(this._latlng)},_updateStyle:function(){e.Circle.prototype._updateStyle.call(this),this.setRadius(this.options.radius)},setLatLng:function(a){return e.Circle.prototype.setLatLng.call(this,a),this._popup&&this._popup._isOpen&&this._popup.setLatLng(a),this},setRadius:function(a){return this.options.radius=this._radius=a,this.redraw()},getRadius:function(){return this._radius}}),e.circleMarker=function(a,b){return new e.CircleMarker(a,b)},e.Polyline.include(e.Path.CANVAS?{_containsPoint:function(a,b){var c,d,f,g,h,i,j,k=this.options.weight/2;for(e.Browser.touch&&(k+=10),c=0,g=this._parts.length;g>c;c++)for(j=this._parts[c],d=0,h=j.length,f=h-1;h>d;f=d++)if((b||0!==d)&&(i=e.LineUtil.pointToSegmentDistance(a,j[f],j[d]),k>=i))return!0;return!1}}:{}),e.Polygon.include(e.Path.CANVAS?{_containsPoint:function(a){var b,c,d,f,g,h,i,j,k=!1;if(e.Polyline.prototype._containsPoint.call(this,a,!0))return!0;for(f=0,i=this._parts.length;i>f;f++)for(b=this._parts[f],g=0,j=b.length,h=j-1;j>g;h=g++)c=b[g],d=b[h],c.y>a.y!=d.y>a.y&&a.x<(d.x-c.x)*(a.y-c.y)/(d.y-c.y)+c.x&&(k=!k);return k}}:{}),e.Circle.include(e.Path.CANVAS?{_drawPath:function(){var a=this._point;this._ctx.beginPath(),this._ctx.arc(a.x,a.y,this._radius,0,2*Math.PI,!1)},_containsPoint:function(a){var b=this._point,c=this.options.stroke?this.options.weight/2:0;return a.distanceTo(b)<=this._radius+c}}:{}),e.CircleMarker.include(e.Path.CANVAS?{_updateStyle:function(){e.Path.prototype._updateStyle.call(this)}}:{}),e.GeoJSON=e.FeatureGroup.extend({initialize:function(a,b){e.setOptions(this,b),this._layers={},a&&this.addData(a)},addData:function(a){var b,c,d,f=e.Util.isArray(a)?a:a.features;if(f){for(b=0,c=f.length;c>b;b++)d=f[b],(d.geometries||d.geometry||d.features||d.coordinates)&&this.addData(f[b]);return this}var g=this.options;if(!g.filter||g.filter(a)){var h=e.GeoJSON.geometryToLayer(a,g.pointToLayer,g.coordsToLatLng,g);return h.feature=e.GeoJSON.asFeature(a),h.defaultOptions=h.options,this.resetStyle(h),g.onEachFeature&&g.onEachFeature(a,h),this.addLayer(h)}},resetStyle:function(a){var b=this.options.style;b&&(e.Util.extend(a.options,a.defaultOptions),this._setLayerStyle(a,b))},setStyle:function(a){this.eachLayer(function(b){this._setLayerStyle(b,a)},this)},_setLayerStyle:function(a,b){"function"==typeof b&&(b=b(a.feature)),a.setStyle&&a.setStyle(b)}}),e.extend(e.GeoJSON,{geometryToLayer:function(a,b,c,d){var f,g,h,i,j="Feature"===a.type?a.geometry:a,k=j.coordinates,l=[];switch(c=c||this.coordsToLatLng,j.type){case"Point":return f=c(k),b?b(a,f):new e.Marker(f);case"MultiPoint":for(h=0,i=k.length;i>h;h++)f=c(k[h]),l.push(b?b(a,f):new e.Marker(f));return new e.FeatureGroup(l);case"LineString":return g=this.coordsToLatLngs(k,0,c),new e.Polyline(g,d);case"Polygon":if(2===k.length&&!k[1].length)throw new Error("Invalid GeoJSON object.");return g=this.coordsToLatLngs(k,1,c),new e.Polygon(g,d);case"MultiLineString":return g=this.coordsToLatLngs(k,1,c),new e.MultiPolyline(g,d);case"MultiPolygon":return g=this.coordsToLatLngs(k,2,c),new e.MultiPolygon(g,d);case"GeometryCollection":for(h=0,i=j.geometries.length;i>h;h++)l.push(this.geometryToLayer({geometry:j.geometries[h],type:"Feature",properties:a.properties},b,c,d));return new e.FeatureGroup(l);default:throw new Error("Invalid GeoJSON object.")}},coordsToLatLng:function(a){return new e.LatLng(a[1],a[0],a[2])},coordsToLatLngs:function(a,b,c){var d,e,f,g=[];for(e=0,f=a.length;f>e;e++)d=b?this.coordsToLatLngs(a[e],b-1,c):(c||this.coordsToLatLng)(a[e]),g.push(d);return g},latLngToCoords:function(a){var b=[a.lng,a.lat];return a.alt!==c&&b.push(a.alt),b},latLngsToCoords:function(a){for(var b=[],c=0,d=a.length;d>c;c++)b.push(e.GeoJSON.latLngToCoords(a[c]));return b},getFeature:function(a,b){return a.feature?e.extend({},a.feature,{geometry:b}):e.GeoJSON.asFeature(b)},asFeature:function(a){return"Feature"===a.type?a:{type:"Feature",properties:{},geometry:a}}});var g={toGeoJSON:function(){return e.GeoJSON.getFeature(this,{type:"Point",coordinates:e.GeoJSON.latLngToCoords(this.getLatLng())})}};e.Marker.include(g),e.Circle.include(g),e.CircleMarker.include(g),e.Polyline.include({toGeoJSON:function(){return e.GeoJSON.getFeature(this,{type:"LineString",coordinates:e.GeoJSON.latLngsToCoords(this.getLatLngs())})}}),e.Polygon.include({toGeoJSON:function(){var a,b,c,d=[e.GeoJSON.latLngsToCoords(this.getLatLngs())];if(d[0].push(d[0][0]),this._holes)for(a=0,b=this._holes.length;b>a;a++)c=e.GeoJSON.latLngsToCoords(this._holes[a]),c.push(c[0]),d.push(c);return e.GeoJSON.getFeature(this,{type:"Polygon",coordinates:d})}}),function(){function a(a){return function(){var b=[];return this.eachLayer(function(a){b.push(a.toGeoJSON().geometry.coordinates)}),e.GeoJSON.getFeature(this,{type:a,coordinates:b})}}e.MultiPolyline.include({toGeoJSON:a("MultiLineString")}),e.MultiPolygon.include({toGeoJSON:a("MultiPolygon")}),e.LayerGroup.include({toGeoJSON:function(){var b,c=this.feature&&this.feature.geometry,d=[];if(c&&"MultiPoint"===c.type)return a("MultiPoint").call(this);var f=c&&"GeometryCollection"===c.type;return this.eachLayer(function(a){a.toGeoJSON&&(b=a.toGeoJSON(),d.push(f?b.geometry:e.GeoJSON.asFeature(b)))}),f?e.GeoJSON.getFeature(this,{geometries:d,type:"GeometryCollection"}):{type:"FeatureCollection",features:d}}})}(),e.geoJson=function(a,b){return new e.GeoJSON(a,b)},e.DomEvent={addListener:function(a,b,c,d){var f,g,h,i=e.stamp(c),j="_leaflet_"+b+i;return a[j]?this:(f=function(b){return c.call(d||a,b||e.DomEvent._getEvent())},e.Browser.pointer&&0===b.indexOf("touch")?this.addPointerListener(a,b,f,i):(e.Browser.touch&&"dblclick"===b&&this.addDoubleTapListener&&this.addDoubleTapListener(a,f,i),"addEventListener"in a?"mousewheel"===b?(a.addEventListener("DOMMouseScroll",f,!1),a.addEventListener(b,f,!1)):"mouseenter"===b||"mouseleave"===b?(g=f,h="mouseenter"===b?"mouseover":"mouseout",f=function(b){return e.DomEvent._checkMouse(a,b)?g(b):void 0},a.addEventListener(h,f,!1)):"click"===b&&e.Browser.android?(g=f,f=function(a){return e.DomEvent._filterClick(a,g)},a.addEventListener(b,f,!1)):a.addEventListener(b,f,!1):"attachEvent"in a&&a.attachEvent("on"+b,f),a[j]=f,this))},removeListener:function(a,b,c){var d=e.stamp(c),f="_leaflet_"+b+d,g=a[f];return g?(e.Browser.pointer&&0===b.indexOf("touch")?this.removePointerListener(a,b,d):e.Browser.touch&&"dblclick"===b&&this.removeDoubleTapListener?this.removeDoubleTapListener(a,d):"removeEventListener"in a?"mousewheel"===b?(a.removeEventListener("DOMMouseScroll",g,!1),a.removeEventListener(b,g,!1)):"mouseenter"===b||"mouseleave"===b?a.removeEventListener("mouseenter"===b?"mouseover":"mouseout",g,!1):a.removeEventListener(b,g,!1):"detachEvent"in a&&a.detachEvent("on"+b,g),a[f]=null,this):this},stopPropagation:function(a){return a.stopPropagation?a.stopPropagation():a.cancelBubble=!0,e.DomEvent._skipped(a),this},disableScrollPropagation:function(a){var b=e.DomEvent.stopPropagation;return e.DomEvent.on(a,"mousewheel",b).on(a,"MozMousePixelScroll",b)},disableClickPropagation:function(a){for(var b=e.DomEvent.stopPropagation,c=e.Draggable.START.length-1;c>=0;c--)e.DomEvent.on(a,e.Draggable.START[c],b);return e.DomEvent.on(a,"click",e.DomEvent._fakeStop).on(a,"dblclick",b)},preventDefault:function(a){return a.preventDefault?a.preventDefault():a.returnValue=!1,this},stop:function(a){return e.DomEvent.preventDefault(a).stopPropagation(a)},getMousePosition:function(a,b){if(!b)return new e.Point(a.clientX,a.clientY);var c=b.getBoundingClientRect();return new e.Point(a.clientX-c.left-b.clientLeft,a.clientY-c.top-b.clientTop)},getWheelDelta:function(a){var b=0;return a.wheelDelta&&(b=a.wheelDelta/120),a.detail&&(b=-a.detail/3),b},_skipEvents:{},_fakeStop:function(a){e.DomEvent._skipEvents[a.type]=!0},_skipped:function(a){var b=this._skipEvents[a.type];return this._skipEvents[a.type]=!1,b},_checkMouse:function(a,b){var c=b.relatedTarget;if(!c)return!0;try{for(;c&&c!==a;)c=c.parentNode}catch(d){return!1}return c!==a},_getEvent:function(){var b=a.event;if(!b)for(var c=arguments.callee.caller;c&&(b=c.arguments[0],!b||a.Event!==b.constructor);)c=c.caller;return b},_filterClick:function(a,b){var c=a.timeStamp||a.originalEvent.timeStamp,d=e.DomEvent._lastClick&&c-e.DomEvent._lastClick;return d&&d>100&&500>d||a.target._simulatedClick&&!a._simulated?void e.DomEvent.stop(a):(e.DomEvent._lastClick=c,b(a))}},e.DomEvent.on=e.DomEvent.addListener,e.DomEvent.off=e.DomEvent.removeListener,e.Draggable=e.Class.extend({includes:e.Mixin.Events,statics:{START:e.Browser.touch?["touchstart","mousedown"]:["mousedown"],END:{mousedown:"mouseup",touchstart:"touchend",pointerdown:"touchend",MSPointerDown:"touchend"},MOVE:{mousedown:"mousemove",touchstart:"touchmove",pointerdown:"touchmove",MSPointerDown:"touchmove"}},initialize:function(a,b){this._element=a,this._dragStartTarget=b||a},enable:function(){if(!this._enabled){for(var a=e.Draggable.START.length-1;a>=0;a--)e.DomEvent.on(this._dragStartTarget,e.Draggable.START[a],this._onDown,this);this._enabled=!0}},disable:function(){if(this._enabled){for(var a=e.Draggable.START.length-1;a>=0;a--)e.DomEvent.off(this._dragStartTarget,e.Draggable.START[a],this._onDown,this);this._enabled=!1,this._moved=!1}},_onDown:function(a){if(this._moved=!1,!(a.shiftKey||1!==a.which&&1!==a.button&&!a.touches||(e.DomEvent.stopPropagation(a),e.Draggable._disabled||(e.DomUtil.disableImageDrag(),e.DomUtil.disableTextSelection(),this._moving)))){var c=a.touches?a.touches[0]:a;this._startPoint=new e.Point(c.clientX,c.clientY),this._startPos=this._newPos=e.DomUtil.getPosition(this._element),e.DomEvent.on(b,e.Draggable.MOVE[a.type],this._onMove,this).on(b,e.Draggable.END[a.type],this._onUp,this)}},_onMove:function(a){if(a.touches&&a.touches.length>1)return void(this._moved=!0);var c=a.touches&&1===a.touches.length?a.touches[0]:a,d=new e.Point(c.clientX,c.clientY),f=d.subtract(this._startPoint);(f.x||f.y)&&(e.Browser.touch&&Math.abs(f.x)+Math.abs(f.y)<3||(e.DomEvent.preventDefault(a),this._moved||(this.fire("dragstart"),this._moved=!0,this._startPos=e.DomUtil.getPosition(this._element).subtract(f),e.DomUtil.addClass(b.body,"leaflet-dragging"),this._lastTarget=a.target||a.srcElement,e.DomUtil.addClass(this._lastTarget,"leaflet-drag-target")),this._newPos=this._startPos.add(f),this._moving=!0,e.Util.cancelAnimFrame(this._animRequest),this._animRequest=e.Util.requestAnimFrame(this._updatePosition,this,!0,this._dragStartTarget)))},_updatePosition:function(){this.fire("predrag"),e.DomUtil.setPosition(this._element,this._newPos),this.fire("drag")},_onUp:function(){e.DomUtil.removeClass(b.body,"leaflet-dragging"),this._lastTarget&&(e.DomUtil.removeClass(this._lastTarget,"leaflet-drag-target"),this._lastTarget=null);for(var a in e.Draggable.MOVE)e.DomEvent.off(b,e.Draggable.MOVE[a],this._onMove).off(b,e.Draggable.END[a],this._onUp);e.DomUtil.enableImageDrag(),e.DomUtil.enableTextSelection(),this._moved&&this._moving&&(e.Util.cancelAnimFrame(this._animRequest),this.fire("dragend",{distance:this._newPos.distanceTo(this._startPos)})),this._moving=!1}}),e.Handler=e.Class.extend({initialize:function(a){this._map=a},enable:function(){this._enabled||(this._enabled=!0,this.addHooks())},disable:function(){this._enabled&&(this._enabled=!1,this.removeHooks())},enabled:function(){return!!this._enabled}}),e.Map.mergeOptions({dragging:!0,inertia:!e.Browser.android23,inertiaDeceleration:3400,inertiaMaxSpeed:1/0,inertiaThreshold:e.Browser.touch?32:18,easeLinearity:.25,worldCopyJump:!1}),e.Map.Drag=e.Handler.extend({addHooks:function(){if(!this._draggable){var a=this._map;this._draggable=new e.Draggable(a._mapPane,a._container),this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this),a.options.worldCopyJump&&(this._draggable.on("predrag",this._onPreDrag,this),a.on("viewreset",this._onViewReset,this),a.whenReady(this._onViewReset,this))}this._draggable.enable()},removeHooks:function(){this._draggable.disable()},moved:function(){return this._draggable&&this._draggable._moved},_onDragStart:function(){var a=this._map;a._panAnim&&a._panAnim.stop(),a.fire("movestart").fire("dragstart"),a.options.inertia&&(this._positions=[],this._times=[])},_onDrag:function(){if(this._map.options.inertia){var a=this._lastTime=+new Date,b=this._lastPos=this._draggable._newPos;this._positions.push(b),this._times.push(a),a-this._times[0]>200&&(this._positions.shift(),this._times.shift())}this._map.fire("move").fire("drag")},_onViewReset:function(){var a=this._map.getSize()._divideBy(2),b=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=b.subtract(a).x,this._worldWidth=this._map.project([0,180]).x},_onPreDrag:function(){var a=this._worldWidth,b=Math.round(a/2),c=this._initialWorldOffset,d=this._draggable._newPos.x,e=(d-b+c)%a+b-c,f=(d+b+c)%a-b-c,g=Math.abs(e+c)<Math.abs(f+c)?e:f;this._draggable._newPos.x=g},_onDragEnd:function(a){var b=this._map,c=b.options,d=+new Date-this._lastTime,f=!c.inertia||d>c.inertiaThreshold||!this._positions[0];if(b.fire("dragend",a),f)b.fire("moveend");else{var g=this._lastPos.subtract(this._positions[0]),h=(this._lastTime+d-this._times[0])/1e3,i=c.easeLinearity,j=g.multiplyBy(i/h),k=j.distanceTo([0,0]),l=Math.min(c.inertiaMaxSpeed,k),m=j.multiplyBy(l/k),n=l/(c.inertiaDeceleration*i),o=m.multiplyBy(-n/2).round();o.x&&o.y?(o=b._limitOffset(o,b.options.maxBounds),e.Util.requestAnimFrame(function(){b.panBy(o,{duration:n,easeLinearity:i,noMoveStart:!0})})):b.fire("moveend")}}}),e.Map.addInitHook("addHandler","dragging",e.Map.Drag),e.Map.mergeOptions({doubleClickZoom:!0}),e.Map.DoubleClickZoom=e.Handler.extend({addHooks:function(){this._map.on("dblclick",this._onDoubleClick,this)},removeHooks:function(){this._map.off("dblclick",this._onDoubleClick,this)},_onDoubleClick:function(a){var b=this._map,c=b.getZoom()+(a.originalEvent.shiftKey?-1:1);"center"===b.options.doubleClickZoom?b.setZoom(c):b.setZoomAround(a.containerPoint,c)}}),e.Map.addInitHook("addHandler","doubleClickZoom",e.Map.DoubleClickZoom),e.Map.mergeOptions({scrollWheelZoom:!0}),e.Map.ScrollWheelZoom=e.Handler.extend({addHooks:function(){e.DomEvent.on(this._map._container,"mousewheel",this._onWheelScroll,this),e.DomEvent.on(this._map._container,"MozMousePixelScroll",e.DomEvent.preventDefault),this._delta=0},removeHooks:function(){e.DomEvent.off(this._map._container,"mousewheel",this._onWheelScroll),e.DomEvent.off(this._map._container,"MozMousePixelScroll",e.DomEvent.preventDefault)},_onWheelScroll:function(a){var b=e.DomEvent.getWheelDelta(a);this._delta+=b,this._lastMousePos=this._map.mouseEventToContainerPoint(a),this._startTime||(this._startTime=+new Date);var c=Math.max(40-(+new Date-this._startTime),0);clearTimeout(this._timer),this._timer=setTimeout(e.bind(this._performZoom,this),c),e.DomEvent.preventDefault(a),e.DomEvent.stopPropagation(a)},_performZoom:function(){var a=this._map,b=this._delta,c=a.getZoom();b=b>0?Math.ceil(b):Math.floor(b),b=Math.max(Math.min(b,4),-4),b=a._limitZoom(c+b)-c,this._delta=0,this._startTime=null,b&&("center"===a.options.scrollWheelZoom?a.setZoom(c+b):a.setZoomAround(this._lastMousePos,c+b))}}),e.Map.addInitHook("addHandler","scrollWheelZoom",e.Map.ScrollWheelZoom),e.extend(e.DomEvent,{_touchstart:e.Browser.msPointer?"MSPointerDown":e.Browser.pointer?"pointerdown":"touchstart",_touchend:e.Browser.msPointer?"MSPointerUp":e.Browser.pointer?"pointerup":"touchend",addDoubleTapListener:function(a,c,d){function f(a){var b;if(e.Browser.pointer?(o.push(a.pointerId),b=o.length):b=a.touches.length,!(b>1)){var c=Date.now(),d=c-(h||c);i=a.touches?a.touches[0]:a,j=d>0&&k>=d,h=c}}function g(a){if(e.Browser.pointer){var b=o.indexOf(a.pointerId);if(-1===b)return;o.splice(b,1)}if(j){if(e.Browser.pointer){var d,f={};for(var g in i)d=i[g],f[g]="function"==typeof d?d.bind(i):d;i=f}i.type="dblclick",c(i),h=null}}var h,i,j=!1,k=250,l="_leaflet_",m=this._touchstart,n=this._touchend,o=[];a[l+m+d]=f,a[l+n+d]=g;var p=e.Browser.pointer?b.documentElement:a;return a.addEventListener(m,f,!1),p.addEventListener(n,g,!1),e.Browser.pointer&&p.addEventListener(e.DomEvent.POINTER_CANCEL,g,!1),this},removeDoubleTapListener:function(a,c){var d="_leaflet_";return a.removeEventListener(this._touchstart,a[d+this._touchstart+c],!1),(e.Browser.pointer?b.documentElement:a).removeEventListener(this._touchend,a[d+this._touchend+c],!1),e.Browser.pointer&&b.documentElement.removeEventListener(e.DomEvent.POINTER_CANCEL,a[d+this._touchend+c],!1),this}}),e.extend(e.DomEvent,{POINTER_DOWN:e.Browser.msPointer?"MSPointerDown":"pointerdown",POINTER_MOVE:e.Browser.msPointer?"MSPointerMove":"pointermove",POINTER_UP:e.Browser.msPointer?"MSPointerUp":"pointerup",POINTER_CANCEL:e.Browser.msPointer?"MSPointerCancel":"pointercancel",_pointers:[],_pointerDocumentListener:!1,addPointerListener:function(a,b,c,d){switch(b){case"touchstart":return this.addPointerListenerStart(a,b,c,d);case"touchend":
return this.addPointerListenerEnd(a,b,c,d);case"touchmove":return this.addPointerListenerMove(a,b,c,d);default:throw"Unknown touch event type"}},addPointerListenerStart:function(a,c,d,f){var g="_leaflet_",h=this._pointers,i=function(a){e.DomEvent.preventDefault(a);for(var b=!1,c=0;c<h.length;c++)if(h[c].pointerId===a.pointerId){b=!0;break}b||h.push(a),a.touches=h.slice(),a.changedTouches=[a],d(a)};if(a[g+"touchstart"+f]=i,a.addEventListener(this.POINTER_DOWN,i,!1),!this._pointerDocumentListener){var j=function(a){for(var b=0;b<h.length;b++)if(h[b].pointerId===a.pointerId){h.splice(b,1);break}};b.documentElement.addEventListener(this.POINTER_UP,j,!1),b.documentElement.addEventListener(this.POINTER_CANCEL,j,!1),this._pointerDocumentListener=!0}return this},addPointerListenerMove:function(a,b,c,d){function e(a){if(a.pointerType!==a.MSPOINTER_TYPE_MOUSE&&"mouse"!==a.pointerType||0!==a.buttons){for(var b=0;b<g.length;b++)if(g[b].pointerId===a.pointerId){g[b]=a;break}a.touches=g.slice(),a.changedTouches=[a],c(a)}}var f="_leaflet_",g=this._pointers;return a[f+"touchmove"+d]=e,a.addEventListener(this.POINTER_MOVE,e,!1),this},addPointerListenerEnd:function(a,b,c,d){var e="_leaflet_",f=this._pointers,g=function(a){for(var b=0;b<f.length;b++)if(f[b].pointerId===a.pointerId){f.splice(b,1);break}a.touches=f.slice(),a.changedTouches=[a],c(a)};return a[e+"touchend"+d]=g,a.addEventListener(this.POINTER_UP,g,!1),a.addEventListener(this.POINTER_CANCEL,g,!1),this},removePointerListener:function(a,b,c){var d="_leaflet_",e=a[d+b+c];switch(b){case"touchstart":a.removeEventListener(this.POINTER_DOWN,e,!1);break;case"touchmove":a.removeEventListener(this.POINTER_MOVE,e,!1);break;case"touchend":a.removeEventListener(this.POINTER_UP,e,!1),a.removeEventListener(this.POINTER_CANCEL,e,!1)}return this}}),e.Map.mergeOptions({touchZoom:e.Browser.touch&&!e.Browser.android23,bounceAtZoomLimits:!0}),e.Map.TouchZoom=e.Handler.extend({addHooks:function(){e.DomEvent.on(this._map._container,"touchstart",this._onTouchStart,this)},removeHooks:function(){e.DomEvent.off(this._map._container,"touchstart",this._onTouchStart,this)},_onTouchStart:function(a){var c=this._map;if(a.touches&&2===a.touches.length&&!c._animatingZoom&&!this._zooming){var d=c.mouseEventToLayerPoint(a.touches[0]),f=c.mouseEventToLayerPoint(a.touches[1]),g=c._getCenterLayerPoint();this._startCenter=d.add(f)._divideBy(2),this._startDist=d.distanceTo(f),this._moved=!1,this._zooming=!0,this._centerOffset=g.subtract(this._startCenter),c._panAnim&&c._panAnim.stop(),e.DomEvent.on(b,"touchmove",this._onTouchMove,this).on(b,"touchend",this._onTouchEnd,this),e.DomEvent.preventDefault(a)}},_onTouchMove:function(a){var b=this._map;if(a.touches&&2===a.touches.length&&this._zooming){var c=b.mouseEventToLayerPoint(a.touches[0]),d=b.mouseEventToLayerPoint(a.touches[1]);this._scale=c.distanceTo(d)/this._startDist,this._delta=c._add(d)._divideBy(2)._subtract(this._startCenter),1!==this._scale&&(b.options.bounceAtZoomLimits||!(b.getZoom()===b.getMinZoom()&&this._scale<1||b.getZoom()===b.getMaxZoom()&&this._scale>1))&&(this._moved||(e.DomUtil.addClass(b._mapPane,"leaflet-touching"),b.fire("movestart").fire("zoomstart"),this._moved=!0),e.Util.cancelAnimFrame(this._animRequest),this._animRequest=e.Util.requestAnimFrame(this._updateOnMove,this,!0,this._map._container),e.DomEvent.preventDefault(a))}},_updateOnMove:function(){var a=this._map,b=this._getScaleOrigin(),c=a.layerPointToLatLng(b),d=a.getScaleZoom(this._scale);a._animateZoom(c,d,this._startCenter,this._scale,this._delta,!1,!0)},_onTouchEnd:function(){if(!this._moved||!this._zooming)return void(this._zooming=!1);var a=this._map;this._zooming=!1,e.DomUtil.removeClass(a._mapPane,"leaflet-touching"),e.Util.cancelAnimFrame(this._animRequest),e.DomEvent.off(b,"touchmove",this._onTouchMove).off(b,"touchend",this._onTouchEnd);var c=this._getScaleOrigin(),d=a.layerPointToLatLng(c),f=a.getZoom(),g=a.getScaleZoom(this._scale)-f,h=g>0?Math.ceil(g):Math.floor(g),i=a._limitZoom(f+h),j=a.getZoomScale(i)/this._scale;a._animateZoom(d,i,c,j)},_getScaleOrigin:function(){var a=this._centerOffset.subtract(this._delta).divideBy(this._scale);return this._startCenter.add(a)}}),e.Map.addInitHook("addHandler","touchZoom",e.Map.TouchZoom),e.Map.mergeOptions({tap:!0,tapTolerance:15}),e.Map.Tap=e.Handler.extend({addHooks:function(){e.DomEvent.on(this._map._container,"touchstart",this._onDown,this)},removeHooks:function(){e.DomEvent.off(this._map._container,"touchstart",this._onDown,this)},_onDown:function(a){if(a.touches){if(e.DomEvent.preventDefault(a),this._fireClick=!0,a.touches.length>1)return this._fireClick=!1,void clearTimeout(this._holdTimeout);var c=a.touches[0],d=c.target;this._startPos=this._newPos=new e.Point(c.clientX,c.clientY),d.tagName&&"a"===d.tagName.toLowerCase()&&e.DomUtil.addClass(d,"leaflet-active"),this._holdTimeout=setTimeout(e.bind(function(){this._isTapValid()&&(this._fireClick=!1,this._onUp(),this._simulateEvent("contextmenu",c))},this),1e3),e.DomEvent.on(b,"touchmove",this._onMove,this).on(b,"touchend",this._onUp,this)}},_onUp:function(a){if(clearTimeout(this._holdTimeout),e.DomEvent.off(b,"touchmove",this._onMove,this).off(b,"touchend",this._onUp,this),this._fireClick&&a&&a.changedTouches){var c=a.changedTouches[0],d=c.target;d&&d.tagName&&"a"===d.tagName.toLowerCase()&&e.DomUtil.removeClass(d,"leaflet-active"),this._isTapValid()&&this._simulateEvent("click",c)}},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance},_onMove:function(a){var b=a.touches[0];this._newPos=new e.Point(b.clientX,b.clientY)},_simulateEvent:function(c,d){var e=b.createEvent("MouseEvents");e._simulated=!0,d.target._simulatedClick=!0,e.initMouseEvent(c,!0,!0,a,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null),d.target.dispatchEvent(e)}}),e.Browser.touch&&!e.Browser.pointer&&e.Map.addInitHook("addHandler","tap",e.Map.Tap),e.Map.mergeOptions({boxZoom:!0}),e.Map.BoxZoom=e.Handler.extend({initialize:function(a){this._map=a,this._container=a._container,this._pane=a._panes.overlayPane,this._moved=!1},addHooks:function(){e.DomEvent.on(this._container,"mousedown",this._onMouseDown,this)},removeHooks:function(){e.DomEvent.off(this._container,"mousedown",this._onMouseDown),this._moved=!1},moved:function(){return this._moved},_onMouseDown:function(a){return this._moved=!1,!a.shiftKey||1!==a.which&&1!==a.button?!1:(e.DomUtil.disableTextSelection(),e.DomUtil.disableImageDrag(),this._startLayerPoint=this._map.mouseEventToLayerPoint(a),void e.DomEvent.on(b,"mousemove",this._onMouseMove,this).on(b,"mouseup",this._onMouseUp,this).on(b,"keydown",this._onKeyDown,this))},_onMouseMove:function(a){this._moved||(this._box=e.DomUtil.create("div","leaflet-zoom-box",this._pane),e.DomUtil.setPosition(this._box,this._startLayerPoint),this._container.style.cursor="crosshair",this._map.fire("boxzoomstart"));var b=this._startLayerPoint,c=this._box,d=this._map.mouseEventToLayerPoint(a),f=d.subtract(b),g=new e.Point(Math.min(d.x,b.x),Math.min(d.y,b.y));e.DomUtil.setPosition(c,g),this._moved=!0,c.style.width=Math.max(0,Math.abs(f.x)-4)+"px",c.style.height=Math.max(0,Math.abs(f.y)-4)+"px"},_finish:function(){this._moved&&(this._pane.removeChild(this._box),this._container.style.cursor=""),e.DomUtil.enableTextSelection(),e.DomUtil.enableImageDrag(),e.DomEvent.off(b,"mousemove",this._onMouseMove).off(b,"mouseup",this._onMouseUp).off(b,"keydown",this._onKeyDown)},_onMouseUp:function(a){this._finish();var b=this._map,c=b.mouseEventToLayerPoint(a);if(!this._startLayerPoint.equals(c)){var d=new e.LatLngBounds(b.layerPointToLatLng(this._startLayerPoint),b.layerPointToLatLng(c));b.fitBounds(d),b.fire("boxzoomend",{boxZoomBounds:d})}},_onKeyDown:function(a){27===a.keyCode&&this._finish()}}),e.Map.addInitHook("addHandler","boxZoom",e.Map.BoxZoom),e.Map.mergeOptions({keyboard:!0,keyboardPanOffset:80,keyboardZoomOffset:1}),e.Map.Keyboard=e.Handler.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,173]},initialize:function(a){this._map=a,this._setPanOffset(a.options.keyboardPanOffset),this._setZoomOffset(a.options.keyboardZoomOffset)},addHooks:function(){var a=this._map._container;-1===a.tabIndex&&(a.tabIndex="0"),e.DomEvent.on(a,"focus",this._onFocus,this).on(a,"blur",this._onBlur,this).on(a,"mousedown",this._onMouseDown,this),this._map.on("focus",this._addHooks,this).on("blur",this._removeHooks,this)},removeHooks:function(){this._removeHooks();var a=this._map._container;e.DomEvent.off(a,"focus",this._onFocus,this).off(a,"blur",this._onBlur,this).off(a,"mousedown",this._onMouseDown,this),this._map.off("focus",this._addHooks,this).off("blur",this._removeHooks,this)},_onMouseDown:function(){if(!this._focused){var c=b.body,d=b.documentElement,e=c.scrollTop||d.scrollTop,f=c.scrollLeft||d.scrollLeft;this._map._container.focus(),a.scrollTo(f,e)}},_onFocus:function(){this._focused=!0,this._map.fire("focus")},_onBlur:function(){this._focused=!1,this._map.fire("blur")},_setPanOffset:function(a){var b,c,d=this._panKeys={},e=this.keyCodes;for(b=0,c=e.left.length;c>b;b++)d[e.left[b]]=[-1*a,0];for(b=0,c=e.right.length;c>b;b++)d[e.right[b]]=[a,0];for(b=0,c=e.down.length;c>b;b++)d[e.down[b]]=[0,a];for(b=0,c=e.up.length;c>b;b++)d[e.up[b]]=[0,-1*a]},_setZoomOffset:function(a){var b,c,d=this._zoomKeys={},e=this.keyCodes;for(b=0,c=e.zoomIn.length;c>b;b++)d[e.zoomIn[b]]=a;for(b=0,c=e.zoomOut.length;c>b;b++)d[e.zoomOut[b]]=-a},_addHooks:function(){e.DomEvent.on(b,"keydown",this._onKeyDown,this)},_removeHooks:function(){e.DomEvent.off(b,"keydown",this._onKeyDown,this)},_onKeyDown:function(a){var b=a.keyCode,c=this._map;if(b in this._panKeys){if(c._panAnim&&c._panAnim._inProgress)return;c.panBy(this._panKeys[b]),c.options.maxBounds&&c.panInsideBounds(c.options.maxBounds)}else{if(!(b in this._zoomKeys))return;c.setZoom(c.getZoom()+this._zoomKeys[b])}e.DomEvent.stop(a)}}),e.Map.addInitHook("addHandler","keyboard",e.Map.Keyboard),e.Handler.MarkerDrag=e.Handler.extend({initialize:function(a){this._marker=a},addHooks:function(){var a=this._marker._icon;this._draggable||(this._draggable=new e.Draggable(a,a)),this._draggable.on("dragstart",this._onDragStart,this).on("drag",this._onDrag,this).on("dragend",this._onDragEnd,this),this._draggable.enable(),e.DomUtil.addClass(this._marker._icon,"leaflet-marker-draggable")},removeHooks:function(){this._draggable.off("dragstart",this._onDragStart,this).off("drag",this._onDrag,this).off("dragend",this._onDragEnd,this),this._draggable.disable(),e.DomUtil.removeClass(this._marker._icon,"leaflet-marker-draggable")},moved:function(){return this._draggable&&this._draggable._moved},_onDragStart:function(){this._marker.closePopup().fire("movestart").fire("dragstart")},_onDrag:function(){var a=this._marker,b=a._shadow,c=e.DomUtil.getPosition(a._icon),d=a._map.layerPointToLatLng(c);b&&e.DomUtil.setPosition(b,c),a._latlng=d,a.fire("move",{latlng:d}).fire("drag")},_onDragEnd:function(a){this._marker.fire("moveend").fire("dragend",a)}}),e.Control=e.Class.extend({options:{position:"topright"},initialize:function(a){e.setOptions(this,a)},getPosition:function(){return this.options.position},setPosition:function(a){var b=this._map;return b&&b.removeControl(this),this.options.position=a,b&&b.addControl(this),this},getContainer:function(){return this._container},addTo:function(a){this._map=a;var b=this._container=this.onAdd(a),c=this.getPosition(),d=a._controlCorners[c];return e.DomUtil.addClass(b,"leaflet-control"),-1!==c.indexOf("bottom")?d.insertBefore(b,d.firstChild):d.appendChild(b),this},removeFrom:function(a){var b=this.getPosition(),c=a._controlCorners[b];return c.removeChild(this._container),this._map=null,this.onRemove&&this.onRemove(a),this},_refocusOnMap:function(){this._map&&this._map.getContainer().focus()}}),e.control=function(a){return new e.Control(a)},e.Map.include({addControl:function(a){return a.addTo(this),this},removeControl:function(a){return a.removeFrom(this),this},_initControlPos:function(){function a(a,f){var g=c+a+" "+c+f;b[a+f]=e.DomUtil.create("div",g,d)}var b=this._controlCorners={},c="leaflet-",d=this._controlContainer=e.DomUtil.create("div",c+"control-container",this._container);a("top","left"),a("top","right"),a("bottom","left"),a("bottom","right")},_clearControlPos:function(){this._container.removeChild(this._controlContainer)}}),e.Control.Zoom=e.Control.extend({options:{position:"topleft",zoomInText:"+",zoomInTitle:"Zoom in",zoomOutText:"-",zoomOutTitle:"Zoom out"},onAdd:function(a){var b="leaflet-control-zoom",c=e.DomUtil.create("div",b+" leaflet-bar");return this._map=a,this._zoomInButton=this._createButton(this.options.zoomInText,this.options.zoomInTitle,b+"-in",c,this._zoomIn,this),this._zoomOutButton=this._createButton(this.options.zoomOutText,this.options.zoomOutTitle,b+"-out",c,this._zoomOut,this),this._updateDisabled(),a.on("zoomend zoomlevelschange",this._updateDisabled,this),c},onRemove:function(a){a.off("zoomend zoomlevelschange",this._updateDisabled,this)},_zoomIn:function(a){this._map.zoomIn(a.shiftKey?3:1)},_zoomOut:function(a){this._map.zoomOut(a.shiftKey?3:1)},_createButton:function(a,b,c,d,f,g){var h=e.DomUtil.create("a",c,d);h.innerHTML=a,h.href="#",h.title=b;var i=e.DomEvent.stopPropagation;return e.DomEvent.on(h,"click",i).on(h,"mousedown",i).on(h,"dblclick",i).on(h,"click",e.DomEvent.preventDefault).on(h,"click",f,g).on(h,"click",this._refocusOnMap,g),h},_updateDisabled:function(){var a=this._map,b="leaflet-disabled";e.DomUtil.removeClass(this._zoomInButton,b),e.DomUtil.removeClass(this._zoomOutButton,b),a._zoom===a.getMinZoom()&&e.DomUtil.addClass(this._zoomOutButton,b),a._zoom===a.getMaxZoom()&&e.DomUtil.addClass(this._zoomInButton,b)}}),e.Map.mergeOptions({zoomControl:!0}),e.Map.addInitHook(function(){this.options.zoomControl&&(this.zoomControl=new e.Control.Zoom,this.addControl(this.zoomControl))}),e.control.zoom=function(a){return new e.Control.Zoom(a)},e.Control.Attribution=e.Control.extend({options:{position:"bottomright",prefix:'<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'},initialize:function(a){e.setOptions(this,a),this._attributions={}},onAdd:function(a){this._container=e.DomUtil.create("div","leaflet-control-attribution"),e.DomEvent.disableClickPropagation(this._container);for(var b in a._layers)a._layers[b].getAttribution&&this.addAttribution(a._layers[b].getAttribution());return a.on("layeradd",this._onLayerAdd,this).on("layerremove",this._onLayerRemove,this),this._update(),this._container},onRemove:function(a){a.off("layeradd",this._onLayerAdd).off("layerremove",this._onLayerRemove)},setPrefix:function(a){return this.options.prefix=a,this._update(),this},addAttribution:function(a){return a?(this._attributions[a]||(this._attributions[a]=0),this._attributions[a]++,this._update(),this):void 0},removeAttribution:function(a){return a?(this._attributions[a]&&(this._attributions[a]--,this._update()),this):void 0},_update:function(){if(this._map){var a=[];for(var b in this._attributions)this._attributions[b]&&a.push(b);var c=[];this.options.prefix&&c.push(this.options.prefix),a.length&&c.push(a.join(", ")),this._container.innerHTML=c.join(" | ")}},_onLayerAdd:function(a){a.layer.getAttribution&&this.addAttribution(a.layer.getAttribution())},_onLayerRemove:function(a){a.layer.getAttribution&&this.removeAttribution(a.layer.getAttribution())}}),e.Map.mergeOptions({attributionControl:!0}),e.Map.addInitHook(function(){this.options.attributionControl&&(this.attributionControl=(new e.Control.Attribution).addTo(this))}),e.control.attribution=function(a){return new e.Control.Attribution(a)},e.Control.Scale=e.Control.extend({options:{position:"bottomleft",maxWidth:100,metric:!0,imperial:!0,updateWhenIdle:!1},onAdd:function(a){this._map=a;var b="leaflet-control-scale",c=e.DomUtil.create("div",b),d=this.options;return this._addScales(d,b,c),a.on(d.updateWhenIdle?"moveend":"move",this._update,this),a.whenReady(this._update,this),c},onRemove:function(a){a.off(this.options.updateWhenIdle?"moveend":"move",this._update,this)},_addScales:function(a,b,c){a.metric&&(this._mScale=e.DomUtil.create("div",b+"-line",c)),a.imperial&&(this._iScale=e.DomUtil.create("div",b+"-line",c))},_update:function(){var a=this._map.getBounds(),b=a.getCenter().lat,c=6378137*Math.PI*Math.cos(b*Math.PI/180),d=c*(a.getNorthEast().lng-a.getSouthWest().lng)/180,e=this._map.getSize(),f=this.options,g=0;e.x>0&&(g=d*(f.maxWidth/e.x)),this._updateScales(f,g)},_updateScales:function(a,b){a.metric&&b&&this._updateMetric(b),a.imperial&&b&&this._updateImperial(b)},_updateMetric:function(a){var b=this._getRoundNum(a);this._mScale.style.width=this._getScaleWidth(b/a)+"px",this._mScale.innerHTML=1e3>b?b+" m":b/1e3+" km"},_updateImperial:function(a){var b,c,d,e=3.2808399*a,f=this._iScale;e>5280?(b=e/5280,c=this._getRoundNum(b),f.style.width=this._getScaleWidth(c/b)+"px",f.innerHTML=c+" mi"):(d=this._getRoundNum(e),f.style.width=this._getScaleWidth(d/e)+"px",f.innerHTML=d+" ft")},_getScaleWidth:function(a){return Math.round(this.options.maxWidth*a)-10},_getRoundNum:function(a){var b=Math.pow(10,(Math.floor(a)+"").length-1),c=a/b;return c=c>=10?10:c>=5?5:c>=3?3:c>=2?2:1,b*c}}),e.control.scale=function(a){return new e.Control.Scale(a)},e.Control.Layers=e.Control.extend({options:{collapsed:!0,position:"topright",autoZIndex:!0},initialize:function(a,b,c){e.setOptions(this,c),this._layers={},this._lastZIndex=0,this._handlingClick=!1;for(var d in a)this._addLayer(a[d],d);for(d in b)this._addLayer(b[d],d,!0)},onAdd:function(a){return this._initLayout(),this._update(),a.on("layeradd",this._onLayerChange,this).on("layerremove",this._onLayerChange,this),this._container},onRemove:function(a){a.off("layeradd",this._onLayerChange,this).off("layerremove",this._onLayerChange,this)},addBaseLayer:function(a,b){return this._addLayer(a,b),this._update(),this},addOverlay:function(a,b){return this._addLayer(a,b,!0),this._update(),this},removeLayer:function(a){var b=e.stamp(a);return delete this._layers[b],this._update(),this},_initLayout:function(){var a="leaflet-control-layers",b=this._container=e.DomUtil.create("div",a);b.setAttribute("aria-haspopup",!0),e.Browser.touch?e.DomEvent.on(b,"click",e.DomEvent.stopPropagation):e.DomEvent.disableClickPropagation(b).disableScrollPropagation(b);var c=this._form=e.DomUtil.create("form",a+"-list");if(this.options.collapsed){e.Browser.android||e.DomEvent.on(b,"mouseover",this._expand,this).on(b,"mouseout",this._collapse,this);var d=this._layersLink=e.DomUtil.create("a",a+"-toggle",b);d.href="#",d.title="Layers",e.Browser.touch?e.DomEvent.on(d,"click",e.DomEvent.stop).on(d,"click",this._expand,this):e.DomEvent.on(d,"focus",this._expand,this),e.DomEvent.on(c,"click",function(){setTimeout(e.bind(this._onInputClick,this),0)},this),this._map.on("click",this._collapse,this)}else this._expand();this._baseLayersList=e.DomUtil.create("div",a+"-base",c),this._separator=e.DomUtil.create("div",a+"-separator",c),this._overlaysList=e.DomUtil.create("div",a+"-overlays",c),b.appendChild(c)},_addLayer:function(a,b,c){var d=e.stamp(a);this._layers[d]={layer:a,name:b,overlay:c},this.options.autoZIndex&&a.setZIndex&&(this._lastZIndex++,a.setZIndex(this._lastZIndex))},_update:function(){if(this._container){this._baseLayersList.innerHTML="",this._overlaysList.innerHTML="";var a,b,c=!1,d=!1;for(a in this._layers)b=this._layers[a],this._addItem(b),d=d||b.overlay,c=c||!b.overlay;this._separator.style.display=d&&c?"":"none"}},_onLayerChange:function(a){var b=this._layers[e.stamp(a.layer)];if(b){this._handlingClick||this._update();var c=b.overlay?"layeradd"===a.type?"overlayadd":"overlayremove":"layeradd"===a.type?"baselayerchange":null;c&&this._map.fire(c,b)}},_createRadioElement:function(a,c){var d='<input type="radio" class="leaflet-control-layers-selector" name="'+a+'"';c&&(d+=' checked="checked"'),d+="/>";var e=b.createElement("div");return e.innerHTML=d,e.firstChild},_addItem:function(a){var c,d=b.createElement("label"),f=this._map.hasLayer(a.layer);a.overlay?(c=b.createElement("input"),c.type="checkbox",c.className="leaflet-control-layers-selector",c.defaultChecked=f):c=this._createRadioElement("leaflet-base-layers",f),c.layerId=e.stamp(a.layer),e.DomEvent.on(c,"click",this._onInputClick,this);var g=b.createElement("span");g.innerHTML=" "+a.name,d.appendChild(c),d.appendChild(g);var h=a.overlay?this._overlaysList:this._baseLayersList;return h.appendChild(d),d},_onInputClick:function(){var a,b,c,d=this._form.getElementsByTagName("input"),e=d.length;for(this._handlingClick=!0,a=0;e>a;a++)b=d[a],c=this._layers[b.layerId],b.checked&&!this._map.hasLayer(c.layer)?this._map.addLayer(c.layer):!b.checked&&this._map.hasLayer(c.layer)&&this._map.removeLayer(c.layer);this._handlingClick=!1,this._refocusOnMap()},_expand:function(){e.DomUtil.addClass(this._container,"leaflet-control-layers-expanded")},_collapse:function(){this._container.className=this._container.className.replace(" leaflet-control-layers-expanded","")}}),e.control.layers=function(a,b,c){return new e.Control.Layers(a,b,c)},e.PosAnimation=e.Class.extend({includes:e.Mixin.Events,run:function(a,b,c,d){this.stop(),this._el=a,this._inProgress=!0,this._newPos=b,this.fire("start"),a.style[e.DomUtil.TRANSITION]="all "+(c||.25)+"s cubic-bezier(0,0,"+(d||.5)+",1)",e.DomEvent.on(a,e.DomUtil.TRANSITION_END,this._onTransitionEnd,this),e.DomUtil.setPosition(a,b),e.Util.falseFn(a.offsetWidth),this._stepTimer=setInterval(e.bind(this._onStep,this),50)},stop:function(){this._inProgress&&(e.DomUtil.setPosition(this._el,this._getPos()),this._onTransitionEnd(),e.Util.falseFn(this._el.offsetWidth))},_onStep:function(){var a=this._getPos();return a?(this._el._leaflet_pos=a,void this.fire("step")):void this._onTransitionEnd()},_transformRe:/([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,_getPos:function(){var b,c,d,f=this._el,g=a.getComputedStyle(f);if(e.Browser.any3d){if(d=g[e.DomUtil.TRANSFORM].match(this._transformRe),!d)return;b=parseFloat(d[1]),c=parseFloat(d[2])}else b=parseFloat(g.left),c=parseFloat(g.top);return new e.Point(b,c,!0)},_onTransitionEnd:function(){e.DomEvent.off(this._el,e.DomUtil.TRANSITION_END,this._onTransitionEnd,this),this._inProgress&&(this._inProgress=!1,this._el.style[e.DomUtil.TRANSITION]="",this._el._leaflet_pos=this._newPos,clearInterval(this._stepTimer),this.fire("step").fire("end"))}}),e.Map.include({setView:function(a,b,d){if(b=b===c?this._zoom:this._limitZoom(b),a=this._limitCenter(e.latLng(a),b,this.options.maxBounds),d=d||{},this._panAnim&&this._panAnim.stop(),this._loaded&&!d.reset&&d!==!0){d.animate!==c&&(d.zoom=e.extend({animate:d.animate},d.zoom),d.pan=e.extend({animate:d.animate},d.pan));var f=this._zoom!==b?this._tryAnimatedZoom&&this._tryAnimatedZoom(a,b,d.zoom):this._tryAnimatedPan(a,d.pan);if(f)return clearTimeout(this._sizeTimer),this}return this._resetView(a,b),this},panBy:function(a,b){if(a=e.point(a).round(),b=b||{},!a.x&&!a.y)return this;if(this._panAnim||(this._panAnim=new e.PosAnimation,this._panAnim.on({step:this._onPanTransitionStep,end:this._onPanTransitionEnd},this)),b.noMoveStart||this.fire("movestart"),b.animate!==!1){e.DomUtil.addClass(this._mapPane,"leaflet-pan-anim");var c=this._getMapPanePos().subtract(a);this._panAnim.run(this._mapPane,c,b.duration||.25,b.easeLinearity)}else this._rawPanBy(a),this.fire("move").fire("moveend");return this},_onPanTransitionStep:function(){this.fire("move")},_onPanTransitionEnd:function(){e.DomUtil.removeClass(this._mapPane,"leaflet-pan-anim"),this.fire("moveend")},_tryAnimatedPan:function(a,b){var c=this._getCenterOffset(a)._floor();return(b&&b.animate)===!0||this.getSize().contains(c)?(this.panBy(c,b),!0):!1}}),e.PosAnimation=e.DomUtil.TRANSITION?e.PosAnimation:e.PosAnimation.extend({run:function(a,b,c,d){this.stop(),this._el=a,this._inProgress=!0,this._duration=c||.25,this._easeOutPower=1/Math.max(d||.5,.2),this._startPos=e.DomUtil.getPosition(a),this._offset=b.subtract(this._startPos),this._startTime=+new Date,this.fire("start"),this._animate()},stop:function(){this._inProgress&&(this._step(),this._complete())},_animate:function(){this._animId=e.Util.requestAnimFrame(this._animate,this),this._step()},_step:function(){var a=+new Date-this._startTime,b=1e3*this._duration;b>a?this._runFrame(this._easeOut(a/b)):(this._runFrame(1),this._complete())},_runFrame:function(a){var b=this._startPos.add(this._offset.multiplyBy(a));e.DomUtil.setPosition(this._el,b),this.fire("step")},_complete:function(){e.Util.cancelAnimFrame(this._animId),this._inProgress=!1,this.fire("end")},_easeOut:function(a){return 1-Math.pow(1-a,this._easeOutPower)}}),e.Map.mergeOptions({zoomAnimation:!0,zoomAnimationThreshold:4}),e.DomUtil.TRANSITION&&e.Map.addInitHook(function(){this._zoomAnimated=this.options.zoomAnimation&&e.DomUtil.TRANSITION&&e.Browser.any3d&&!e.Browser.android23&&!e.Browser.mobileOpera,this._zoomAnimated&&e.DomEvent.on(this._mapPane,e.DomUtil.TRANSITION_END,this._catchTransitionEnd,this)}),e.Map.include(e.DomUtil.TRANSITION?{_catchTransitionEnd:function(a){this._animatingZoom&&a.propertyName.indexOf("transform")>=0&&this._onZoomTransitionEnd()},_nothingToAnimate:function(){return!this._container.getElementsByClassName("leaflet-zoom-animated").length},_tryAnimatedZoom:function(a,b,c){if(this._animatingZoom)return!0;if(c=c||{},!this._zoomAnimated||c.animate===!1||this._nothingToAnimate()||Math.abs(b-this._zoom)>this.options.zoomAnimationThreshold)return!1;var d=this.getZoomScale(b),e=this._getCenterOffset(a)._divideBy(1-1/d),f=this._getCenterLayerPoint()._add(e);return c.animate===!0||this.getSize().contains(e)?(this.fire("movestart").fire("zoomstart"),this._animateZoom(a,b,f,d,null,!0),!0):!1},_animateZoom:function(a,b,c,d,f,g,h){h||(this._animatingZoom=!0),e.DomUtil.addClass(this._mapPane,"leaflet-zoom-anim"),this._animateToCenter=a,this._animateToZoom=b,e.Draggable&&(e.Draggable._disabled=!0),e.Util.requestAnimFrame(function(){this.fire("zoomanim",{center:a,zoom:b,origin:c,scale:d,delta:f,backwards:g})},this)},_onZoomTransitionEnd:function(){this._animatingZoom=!1,e.DomUtil.removeClass(this._mapPane,"leaflet-zoom-anim"),this._resetView(this._animateToCenter,this._animateToZoom,!0,!0),e.Draggable&&(e.Draggable._disabled=!1)}}:{}),e.TileLayer.include({_animateZoom:function(a){this._animating||(this._animating=!0,this._prepareBgBuffer());var b=this._bgBuffer,c=e.DomUtil.TRANSFORM,d=a.delta?e.DomUtil.getTranslateString(a.delta):b.style[c],f=e.DomUtil.getScaleString(a.scale,a.origin);b.style[c]=a.backwards?f+" "+d:d+" "+f},_endZoomAnim:function(){var a=this._tileContainer,b=this._bgBuffer;a.style.visibility="",a.parentNode.appendChild(a),e.Util.falseFn(b.offsetWidth),this._animating=!1},_clearBgBuffer:function(){var a=this._map;!a||a._animatingZoom||a.touchZoom._zooming||(this._bgBuffer.innerHTML="",this._bgBuffer.style[e.DomUtil.TRANSFORM]="")},_prepareBgBuffer:function(){var a=this._tileContainer,b=this._bgBuffer,c=this._getLoadedTilesPercentage(b),d=this._getLoadedTilesPercentage(a);return b&&c>.5&&.5>d?(a.style.visibility="hidden",void this._stopLoadingImages(a)):(b.style.visibility="hidden",b.style[e.DomUtil.TRANSFORM]="",this._tileContainer=b,b=this._bgBuffer=a,this._stopLoadingImages(b),void clearTimeout(this._clearBgBufferTimer))},_getLoadedTilesPercentage:function(a){var b,c,d=a.getElementsByTagName("img"),e=0;for(b=0,c=d.length;c>b;b++)d[b].complete&&e++;return e/c},_stopLoadingImages:function(a){var b,c,d,f=Array.prototype.slice.call(a.getElementsByTagName("img"));for(b=0,c=f.length;c>b;b++)d=f[b],d.complete||(d.onload=e.Util.falseFn,d.onerror=e.Util.falseFn,d.src=e.Util.emptyImageUrl,d.parentNode.removeChild(d))}}),e.Map.include({_defaultLocateOptions:{watch:!1,setView:!1,maxZoom:1/0,timeout:1e4,maximumAge:0,enableHighAccuracy:!1},locate:function(a){if(a=this._locateOptions=e.extend(this._defaultLocateOptions,a),!navigator.geolocation)return this._handleGeolocationError({code:0,message:"Geolocation not supported."}),this;var b=e.bind(this._handleGeolocationResponse,this),c=e.bind(this._handleGeolocationError,this);return a.watch?this._locationWatchId=navigator.geolocation.watchPosition(b,c,a):navigator.geolocation.getCurrentPosition(b,c,a),this},stopLocate:function(){return navigator.geolocation&&navigator.geolocation.clearWatch(this._locationWatchId),this._locateOptions&&(this._locateOptions.setView=!1),this},_handleGeolocationError:function(a){var b=a.code,c=a.message||(1===b?"permission denied":2===b?"position unavailable":"timeout");this._locateOptions.setView&&!this._loaded&&this.fitWorld(),this.fire("locationerror",{code:b,message:"Geolocation error: "+c+"."})},_handleGeolocationResponse:function(a){var b=a.coords.latitude,c=a.coords.longitude,d=new e.LatLng(b,c),f=180*a.coords.accuracy/40075017,g=f/Math.cos(e.LatLng.DEG_TO_RAD*b),h=e.latLngBounds([b-f,c-g],[b+f,c+g]),i=this._locateOptions;if(i.setView){var j=Math.min(this.getBoundsZoom(h),i.maxZoom);this.setView(d,j)}var k={latlng:d,bounds:h,timestamp:a.timestamp};for(var l in a.coords)"number"==typeof a.coords[l]&&(k[l]=a.coords[l]);this.fire("locationfound",k)}})}(window,document),function(a){"use strict";var b={},c=function(a){var d,e,f,g,h;c.classes.dispatcher.extend(this);var i=this,j=a||{};if("string"==typeof j||j instanceof HTMLElement?j={renderers:[j]}:"[object Array]"===Object.prototype.toString.call(j)&&(j={renderers:j}),g=j.renderers||j.renderer||j.container,j.renderers&&0!==j.renderers.length||("string"==typeof g||g instanceof HTMLElement||"object"==typeof g&&"container"in g)&&(j.renderers=[g]),j.id){if(b[j.id])throw'sigma: Instance "'+j.id+'" already exists.';Object.defineProperty(this,"id",{value:j.id})}else{for(h=0;b[h];)h++;Object.defineProperty(this,"id",{value:""+h})}for(b[this.id]=this,this.settings=new c.classes.configurable(c.settings,j.settings||{}),Object.defineProperty(this,"graph",{value:new c.classes.graph(this.settings),configurable:!0}),Object.defineProperty(this,"middlewares",{value:[],configurable:!0}),Object.defineProperty(this,"cameras",{value:{},configurable:!0}),Object.defineProperty(this,"renderers",{value:{},configurable:!0}),Object.defineProperty(this,"renderersPerCamera",{value:{},configurable:!0}),Object.defineProperty(this,"cameraFrames",{value:{},configurable:!0}),Object.defineProperty(this,"camera",{get:function(){return this.cameras[0]}}),this._handler=function(a){var b,c={};for(b in a.data)c[b]=a.data[b];c.renderer=a.target,this.dispatchEvent(a.type,c)}.bind(this),f=j.renderers||[],d=0,e=f.length;e>d;d++)this.addRenderer(f[d]);for(f=j.middlewares||[],d=0,e=f.length;e>d;d++)this.middlewares.push("string"==typeof f[d]?c.middlewares[f[d]]:f[d]);"object"==typeof j.graph&&j.graph&&(this.graph.read(j.graph),this.refresh()),window.addEventListener("resize",function(){i.settings&&i.refresh()})};if(c.prototype.addCamera=function(b){var d,e=this;if(!arguments.length){for(b=0;this.cameras[""+b];)b++;b=""+b}if(this.cameras[b])throw'sigma.addCamera: The camera "'+b+'" already exists.';return d=new c.classes.camera(b,this.graph,this.settings),this.cameras[b]=d,d.quadtree=new c.classes.quad,c.classes.edgequad!==a&&(d.edgequadtree=new c.classes.edgequad),d.bind("coordinatesUpdated",function(){e.renderCamera(d,d.isAnimated)}),this.renderersPerCamera[b]=[],d},c.prototype.killCamera=function(a){if(a="string"==typeof a?this.cameras[a]:a,!a)throw"sigma.killCamera: The camera is undefined.";var b,c,d=this.renderersPerCamera[a.id];for(c=d.length,b=c-1;b>=0;b--)this.killRenderer(d[b]);return delete this.renderersPerCamera[a.id],delete this.cameraFrames[a.id],delete this.cameras[a.id],a.kill&&a.kill(),this},c.prototype.addRenderer=function(a){var b,d,e,f,g=a||{};if("string"==typeof g?g={container:document.getElementById(g)}:g instanceof HTMLElement&&(g={container:g}),"string"==typeof g.container&&(g.container=document.getElementById(g.container)),"id"in g)b=g.id;else{for(b=0;this.renderers[""+b];)b++;b=""+b}if(this.renderers[b])throw'sigma.addRenderer: The renderer "'+b+'" already exists.';

if(d="function"==typeof g.type?g.type:c.renderers[g.type],d=d||c.renderers.def,e="camera"in g?g.camera instanceof c.classes.camera?g.camera:this.cameras[g.camera]||this.addCamera(g.camera):this.addCamera(),this.cameras[e.id]!==e)throw"sigma.addRenderer: The camera is not properly referenced.";return f=new d(this.graph,e,this.settings,g),this.renderers[b]=f,Object.defineProperty(f,"id",{value:b}),f.bind&&f.bind(["click","rightClick","clickStage","doubleClickStage","rightClickStage","clickNode","clickNodes","clickEdge","clickEdges","doubleClickNode","doubleClickNodes","doubleClickEdge","doubleClickEdges","rightClickNode","rightClickNodes","rightClickEdge","rightClickEdges","overNode","overNodes","overEdge","overEdges","outNode","outNodes","outEdge","outEdges","downNode","downNodes","downEdge","downEdges","upNode","upNodes","upEdge","upEdges"],this._handler),this.renderersPerCamera[e.id].push(f),f},c.prototype.killRenderer=function(a){if(a="string"==typeof a?this.renderers[a]:a,!a)throw"sigma.killRenderer: The renderer is undefined.";var b=this.renderersPerCamera[a.camera.id],c=b.indexOf(a);return c>=0&&b.splice(c,1),a.kill&&a.kill(),delete this.renderers[a.id],this},c.prototype.refresh=function(b){var d,e,f,g,h,i,j=0;for(b=b||{},g=this.middlewares||[],d=0,e=g.length;e>d;d++)g[d].call(this,0===d?"":"tmp"+j+":",d===e-1?"ready:":"tmp"+ ++j+":");for(f in this.cameras)h=this.cameras[f],h.settings("autoRescale")&&this.renderersPerCamera[h.id]&&this.renderersPerCamera[h.id].length?c.middlewares.rescale.call(this,g.length?"ready:":"",h.readPrefix,{width:this.renderersPerCamera[h.id][0].width,height:this.renderersPerCamera[h.id][0].height}):c.middlewares.copy.call(this,g.length?"ready:":"",h.readPrefix),b.skipIndexation||(i=c.utils.getBoundaries(this.graph,h.readPrefix),h.quadtree.index(this.graph.nodes(),{prefix:h.readPrefix,bounds:{x:i.minX,y:i.minY,width:i.maxX-i.minX,height:i.maxY-i.minY}}),h.edgequadtree!==a&&h.settings("drawEdges")&&h.settings("enableEdgeHovering")&&h.edgequadtree.index(this.graph,{prefix:h.readPrefix,bounds:{x:i.minX,y:i.minY,width:i.maxX-i.minX,height:i.maxY-i.minY}}));for(g=Object.keys(this.renderers),d=0,e=g.length;e>d;d++)if(this.renderers[g[d]].process)if(this.settings("skipErrors"))try{this.renderers[g[d]].process()}catch(k){console.log('Warning: The renderer "'+g[d]+'" crashed on ".process()"')}else this.renderers[g[d]].process();return this.render(),this},c.prototype.render=function(){var a,b,c;for(c=Object.keys(this.renderers),a=0,b=c.length;b>a;a++)if(this.settings("skipErrors"))try{this.renderers[c[a]].render()}catch(d){this.settings("verbose")&&console.log('Warning: The renderer "'+c[a]+'" crashed on ".render()"')}else this.renderers[c[a]].render();return this},c.prototype.renderCamera=function(a,b){var c,d,e,f=this;if(b)for(e=this.renderersPerCamera[a.id],c=0,d=e.length;d>c;c++)if(this.settings("skipErrors"))try{e[c].render()}catch(g){this.settings("verbose")&&console.log('Warning: The renderer "'+e[c].id+'" crashed on ".render()"')}else e[c].render();else if(!this.cameraFrames[a.id]){for(e=this.renderersPerCamera[a.id],c=0,d=e.length;d>c;c++)if(this.settings("skipErrors"))try{e[c].render()}catch(g){this.settings("verbose")&&console.log('Warning: The renderer "'+e[c].id+'" crashed on ".render()"')}else e[c].render();this.cameraFrames[a.id]=requestAnimationFrame(function(){delete f.cameraFrames[a.id]})}return this},c.prototype.kill=function(){var a;this.dispatchEvent("kill"),this.graph.kill(),delete this.middlewares;for(a in this.renderers)this.killRenderer(this.renderers[a]);for(a in this.cameras)this.killCamera(this.cameras[a]);delete this.renderers,delete this.cameras;for(a in this)this.hasOwnProperty(a)&&delete this[a];delete b[this.id]},c.instances=function(a){return arguments.length?b[a]:c.utils.extend({},b)},c.version="1.0.3","undefined"!=typeof this.sigma)throw"An object called sigma is already in the global scope.";this.sigma=c}.call(this),function(a){"use strict";function b(a,c){var d,e,f,g;if(arguments.length)if(1===arguments.length&&Object(arguments[0])===arguments[0])for(a in arguments[0])b(a,arguments[0][a]);else if(arguments.length>1)for(g=Array.isArray(a)?a:a.split(/ /),d=0,e=g.length;d!==e;d+=1)f=g[d],C[f]||(C[f]=[]),C[f].push({handler:c})}function c(a,b){var c,d,e,f,g,h,i=Array.isArray(a)?a:a.split(/ /);if(arguments.length)if(b)for(c=0,d=i.length;c!==d;c+=1){if(h=i[c],C[h]){for(g=[],e=0,f=C[h].length;e!==f;e+=1)C[h][e].handler!==b&&g.push(C[h][e]);C[h]=g}C[h]&&0===C[h].length&&delete C[h]}else for(c=0,d=i.length;c!==d;c+=1)delete C[i[c]];else C=Object.create(null)}function d(a,b){var c,d,e,f,g,h,i=Array.isArray(a)?a:a.split(/ /);for(b=void 0===b?{}:b,c=0,e=i.length;c!==e;c+=1)if(h=i[c],C[h])for(g={type:h,data:b||{}},d=0,f=C[h].length;d!==f;d+=1)try{C[h][d].handler(g)}catch(j){}}function e(){var a,b,c,d,e=!1,f=s(),g=x.shift();if(c=g.job(),f=s()-f,g.done++,g.time+=f,g.currentTime+=f,g.weightTime=g.currentTime/(g.weight||1),g.averageTime=g.time/g.done,d=g.count?g.count<=g.done:!c,!d){for(a=0,b=x.length;b>a;a++)if(x[a].weightTime>g.weightTime){x.splice(a,0,g),e=!0;break}e||x.push(g)}return d?g:null}function f(a){var b=x.length;w[a.id]=a,a.status="running",b&&(a.weightTime=x[b-1].weightTime,a.currentTime=a.weightTime*(a.weight||1)),a.startTime=s(),d("jobStarted",q(a)),x.push(a)}function g(){var a,b,c;for(a in v)b=v[a],b.after?y[a]=b:f(b),delete v[a];for(u=!!x.length;x.length&&s()-t<B.frameDuration;)if(c=e()){i(c.id);for(a in y)y[a].after===c.id&&(f(y[a]),delete y[a])}u?(t=s(),d("enterFrame"),setTimeout(g,0)):d("stop")}function h(a,b){var c,e,f;if(Array.isArray(a)){for(A=!0,c=0,e=a.length;e>c;c++)h(a[c].id,p(a[c],b));A=!1,u||(t=s(),d("start"),g())}else if("object"==typeof a)if("string"==typeof a.id)h(a.id,a);else{A=!0;for(c in a)"function"==typeof a[c]?h(c,p({job:a[c]},b)):h(c,p(a[c],b));A=!1,u||(t=s(),d("start"),g())}else{if("string"!=typeof a)throw new Error("[conrad.addJob] Wrong arguments.");if(k(a))throw new Error('[conrad.addJob] Job with id "'+a+'" already exists.');if("function"==typeof b)f={id:a,done:0,time:0,status:"waiting",currentTime:0,averageTime:0,weightTime:0,job:b};else{if("object"!=typeof b)throw new Error("[conrad.addJob] Wrong arguments.");f=p({id:a,done:0,time:0,status:"waiting",currentTime:0,averageTime:0,weightTime:0},b)}v[a]=f,d("jobAdded",q(f)),u||A||(t=s(),d("start"),g())}return this}function i(a){var b,c,e,f,g=!1;if(Array.isArray(a))for(b=0,c=a.length;c>b;b++)i(a[b]);else{if("string"!=typeof a)throw new Error("[conrad.killJob] Wrong arguments.");for(e=[w,y,v],b=0,c=e.length;c>b;b++)a in e[b]&&(f=e[b][a],B.history&&(f.status="done",z.push(f)),d("jobEnded",q(f)),delete e[b][a],"function"==typeof f.end&&f.end(),g=!0);for(e=x,b=0,c=e.length;c>b;b++)if(e[b].id===a){e.splice(b,1);break}if(!g)throw new Error('[conrad.killJob] Job "'+a+'" not found.')}return this}function j(){var a,b=p(v,w,y);if(B.history)for(a in b)b[a].status="done",z.push(b[a]),"function"==typeof b[a].end&&b[a].end();return v={},y={},w={},x=[],u=!1,this}function k(a){var b=v[a]||w[a]||y[a];return b?p(b):null}function l(){var a;if("string"==typeof a1&&1===arguments.length)return B[a1];a="object"==typeof a1&&1===arguments.length?a1||{}:{},"string"==typeof a1&&(a[a1]=a2);for(var b in a)void 0!==a[b]?B[b]=a[b]:delete B[b];return this}function m(){return u}function n(){return z=[],this}function o(a,b){var c,d,e,f,g,h,i;if(!arguments.length){g=[];for(d in v)g.push(v[d]);for(d in y)g.push(y[d]);for(d in w)g.push(w[d]);g=g.concat(z)}if("string"==typeof a)switch(a){case"waiting":g=r(y);break;case"running":g=r(w);break;case"done":g=z;break;default:h=a}if(a instanceof RegExp&&(h=a),!h&&("string"==typeof b||b instanceof RegExp)&&(h=b),h){if(i="string"==typeof h,g instanceof Array)c=g;else if("object"==typeof g){c=[];for(d in g)c=c.concat(g[d])}else{c=[];for(d in v)c.push(v[d]);for(d in y)c.push(y[d]);for(d in w)c.push(w[d]);c=c.concat(z)}for(g=[],e=0,f=c.length;f>e;e++)(i?c[e].id===h:c[e].id.match(h))&&g.push(c[e])}return q(g)}function p(){var a,b,c={},d=arguments.length;for(a=d-1;a>=0;a--)for(b in arguments[a])c[b]=arguments[a][b];return c}function q(a){var b,c,d;if(!a)return a;if(Array.isArray(a))for(b=[],c=0,d=a.length;d>c;c++)b.push(q(a[c]));else if("object"==typeof a){b={};for(c in a)b[c]=q(a[c])}else b=a;return b}function r(a){var b,c=[];for(b in a)c.push(a[b]);return c}function s(){return Date.now?Date.now():(new Date).getTime()}if(a.conrad)throw new Error("conrad already exists");var t,u=!1,v={},w={},x=[],y={},z=[],A=!1,B={frameDuration:20,history:!0},C=Object.create(null);Array.isArray||(Array.isArray=function(a){return"[object Array]"===Object.prototype.toString.call(a)});var D={hasJob:k,addJob:h,killJob:i,killAll:j,settings:l,getStats:o,isRunning:m,clearHistory:n,bind:b,unbind:c,version:"0.1.0"};"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(exports=module.exports=D),exports.conrad=D),a.conrad=D}(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";var b=this;sigma.utils=sigma.utils||{},sigma.utils.extend=function(){var a,b,c={},d=arguments.length;for(a=d-1;a>=0;a--)for(b in arguments[a])c[b]=arguments[a][b];return c},sigma.utils.dateNow=function(){return Date.now?Date.now():(new Date).getTime()},sigma.utils.pkg=function(a){return(a||"").split(".").reduce(function(a,b){return b in a?a[b]:a[b]={}},b)},sigma.utils.id=function(){var a=0;return function(){return++a}}(),sigma.utils.floatColor=function(a){var b=[0,0,0];return a.match(/^#/)?(a=(a||"").replace(/^#/,""),b=3===a.length?[parseInt(a.charAt(0)+a.charAt(0),16),parseInt(a.charAt(1)+a.charAt(1),16),parseInt(a.charAt(2)+a.charAt(2),16)]:[parseInt(a.charAt(0)+a.charAt(1),16),parseInt(a.charAt(2)+a.charAt(3),16),parseInt(a.charAt(4)+a.charAt(5),16)]):a.match(/^ *rgba? *\(/)&&(a=a.match(/^ *rgba? *\( *([0-9]*) *, *([0-9]*) *, *([0-9]*) *(,.*)?\) *$/),b=[+a[1],+a[2],+a[3]]),256*b[0]*256+256*b[1]+b[2]},sigma.utils.zoomTo=function(a,b,c,d,e){var f,g,h,i=a.settings;g=Math.max(i("zoomMin"),Math.min(i("zoomMax"),a.ratio*d)),g!==a.ratio&&(d=g/a.ratio,h={x:b*(1-d)+a.x,y:c*(1-d)+a.y,ratio:g},e&&e.duration?(f=sigma.misc.animation.killAll(a),e=sigma.utils.extend(e,{easing:f?"quadraticOut":"quadraticInOut"}),sigma.misc.animation.camera(a,h,e)):(a.goTo(h),e&&e.onComplete&&e.onComplete()))},sigma.utils.getQuadraticControlPoint=function(a,b,c,d){return{x:(a+c)/2+(d-b)/4,y:(b+d)/2+(a-c)/4}},sigma.utils.getPointOnQuadraticCurve=function(a,b,c,d,e,f,g){return{x:Math.pow(1-a,2)*b+2*(1-a)*a*f+Math.pow(a,2)*d,y:Math.pow(1-a,2)*c+2*(1-a)*a*g+Math.pow(a,2)*e}},sigma.utils.getPointOnBezierCurve=function(a,b,c,d,e,f,g,h,i){var j=Math.pow(1-a,3),k=3*a*Math.pow(1-a,2),l=3*Math.pow(a,2)*(1-a),m=Math.pow(a,3);return{x:j*b+k*f+l*h+m*d,y:j*c+k*g+l*i+m*e}},sigma.utils.getSelfLoopControlPoints=function(a,b,c){return{x1:a-7*c,y1:b,x2:a,y2:b+7*c}},sigma.utils.getDistance=function(a,b,c,d){return Math.sqrt(Math.pow(c-a,2)+Math.pow(d-b,2))},sigma.utils.getCircleIntersection=function(a,b,c,d,e,f){var g,h,i,j,k,l,m,n,o;if(h=d-a,i=e-b,j=Math.sqrt(i*i+h*h),j>c+f)return!1;if(j<Math.abs(c-f))return!1;g=(c*c-f*f+j*j)/(2*j),n=a+h*g/j,o=b+i*g/j,k=Math.sqrt(c*c-g*g),l=-i*(k/j),m=h*(k/j);var p=n+l,q=n-l,r=o+m,s=o-m;return{xi:p,xi_prime:q,yi:r,yi_prime:s}},sigma.utils.isPointOnSegment=function(a,b,c,d,e,f,g){var h=Math.abs((b-d)*(e-c)-(a-c)*(f-d)),i=sigma.utils.getDistance(c,d,e,f),j=h/i;return g>j&&Math.min(c,e)<=a&&a<=Math.max(c,e)&&Math.min(d,f)<=b&&b<=Math.max(d,f)},sigma.utils.isPointOnQuadraticCurve=function(a,b,c,d,e,f,g,h,i){var j=sigma.utils.getDistance(c,d,e,f);if(Math.abs(a-c)>j||Math.abs(b-d)>j)return!1;for(var k,l=sigma.utils.getDistance(a,b,c,d),m=sigma.utils.getDistance(a,b,e,f),n=.5,o=m>l?-.01:.01,p=.001,q=100,r=sigma.utils.getPointOnQuadraticCurve(n,c,d,e,f,g,h),s=sigma.utils.getDistance(a,b,r.x,r.y);q-->0&&n>=0&&1>=n&&s>i&&(o>p||-p>o);)k=s,r=sigma.utils.getPointOnQuadraticCurve(n,c,d,e,f,g,h),s=sigma.utils.getDistance(a,b,r.x,r.y),s>k?(o=-o/2,n+=o):0>n+o||n+o>1?(o/=2,s=k):n+=o;return i>s},sigma.utils.isPointOnBezierCurve=function(a,b,c,d,e,f,g,h,i,j,k){var l=sigma.utils.getDistance(c,d,g,h);if(Math.abs(a-c)>l||Math.abs(b-d)>l)return!1;for(var m,n=sigma.utils.getDistance(a,b,c,d),o=sigma.utils.getDistance(a,b,e,f),p=.5,q=o>n?-.01:.01,r=.001,s=100,t=sigma.utils.getPointOnBezierCurve(p,c,d,e,f,g,h,i,j),u=sigma.utils.getDistance(a,b,t.x,t.y);s-->0&&p>=0&&1>=p&&u>k&&(q>r||-r>q);)m=u,t=sigma.utils.getPointOnBezierCurve(p,c,d,e,f,g,h,i,j),u=sigma.utils.getDistance(a,b,t.x,t.y),u>m?(q=-q/2,p+=q):0>p+q||p+q>1?(q/=2,u=m):p+=q;return k>u},sigma.utils.getX=function(b){return b.offsetX!==a&&b.offsetX||b.layerX!==a&&b.layerX||b.clientX!==a&&b.clientX},sigma.utils.getY=function(b){return b.offsetY!==a&&b.offsetY||b.layerY!==a&&b.layerY||b.clientY!==a&&b.clientY},sigma.utils.getDelta=function(b){return b.wheelDelta!==a&&b.wheelDelta||b.detail!==a&&-b.detail},sigma.utils.getOffset=function(a){for(var b=0,c=0;a;)c+=parseInt(a.offsetTop),b+=parseInt(a.offsetLeft),a=a.offsetParent;return{top:c,left:b}},sigma.utils.doubleClick=function(a,b,c){var d,e=0;a._doubleClickHandler=a._doubleClickHandler||{},a._doubleClickHandler[b]=a._doubleClickHandler[b]||[],d=a._doubleClickHandler[b],d.push(function(a){return e++,2===e?(e=0,c(a)):void(1===e&&setTimeout(function(){e=0},sigma.settings.doubleClickTimeout))}),a.addEventListener(b,d[d.length-1],!1)},sigma.utils.unbindDoubleClick=function(a,b){for(var c,d=(a._doubleClickHandler||{})[b]||[];c=d.pop();)a.removeEventListener(b,c);delete(a._doubleClickHandler||{})[b]},sigma.utils.easings=sigma.utils.easings||{},sigma.utils.easings.linearNone=function(a){return a},sigma.utils.easings.quadraticIn=function(a){return a*a},sigma.utils.easings.quadraticOut=function(a){return a*(2-a)},sigma.utils.easings.quadraticInOut=function(a){return(a*=2)<1?.5*a*a:-.5*(--a*(a-2)-1)},sigma.utils.easings.cubicIn=function(a){return a*a*a},sigma.utils.easings.cubicOut=function(a){return--a*a*a+1},sigma.utils.easings.cubicInOut=function(a){return(a*=2)<1?.5*a*a*a:.5*((a-=2)*a*a+2)},sigma.utils.loadShader=function(a,b,c,d){var e,f=a.createShader(c);return a.shaderSource(f,b),a.compileShader(f),e=a.getShaderParameter(f,a.COMPILE_STATUS),e?f:(d&&d('Error compiling shader "'+f+'":'+a.getShaderInfoLog(f)),a.deleteShader(f),null)},sigma.utils.loadProgram=function(a,b,c,d,e){var f,g,h=a.createProgram();for(f=0;f<b.length;++f)a.attachShader(h,b[f]);if(c)for(f=0;f<c.length;++f)a.bindAttribLocation(h,locations?locations[f]:f,opt_attribs[f]);return a.linkProgram(h),g=a.getProgramParameter(h,a.LINK_STATUS),g?h:(e&&e("Error in program linking: "+a.getProgramInfoLog(h)),a.deleteProgram(h),null)},sigma.utils.pkg("sigma.utils.matrices"),sigma.utils.matrices.translation=function(a,b){return[1,0,0,0,1,0,a,b,1]},sigma.utils.matrices.rotation=function(a,b){var c=Math.cos(a),d=Math.sin(a);return b?[c,-d,d,c]:[c,-d,0,d,c,0,0,0,1]},sigma.utils.matrices.scale=function(a,b){return b?[a,0,0,a]:[a,0,0,0,a,0,0,0,1]},sigma.utils.matrices.multiply=function(a,b,c){var d=c?2:3,e=a[0*d+0],f=a[0*d+1],g=a[0*d+2],h=a[1*d+0],i=a[1*d+1],j=a[1*d+2],k=a[2*d+0],l=a[2*d+1],m=a[2*d+2],n=b[0*d+0],o=b[0*d+1],p=b[0*d+2],q=b[1*d+0],r=b[1*d+1],s=b[1*d+2],t=b[2*d+0],u=b[2*d+1],v=b[2*d+2];return c?[e*n+f*q,e*o+f*r,h*n+i*q,h*o+i*r]:[e*n+f*q+g*t,e*o+f*r+g*u,e*p+f*s+g*v,h*n+i*q+j*t,h*o+i*r+j*u,h*p+i*s+j*v,k*n+l*q+m*t,k*o+l*r+m*u,k*p+l*s+m*v]}}.call(this),function(a){"use strict";var b,c=0,d=["ms","moz","webkit","o"];for(b=0;b<d.length&&!a.requestAnimationFrame;b++)a.requestAnimationFrame=a[d[b]+"RequestAnimationFrame"],a.cancelAnimationFrame=a[d[b]+"CancelAnimationFrame"]||a[d[b]+"CancelRequestAnimationFrame"];a.requestAnimationFrame||(a.requestAnimationFrame=function(b){var d=(new Date).getTime(),e=Math.max(0,16-(d-c)),f=a.setTimeout(function(){b(d+e)},e);return c=d+e,f}),a.cancelAnimationFrame||(a.cancelAnimationFrame=function(a){clearTimeout(a)}),Function.prototype.bind||(Function.prototype.bind=function(a){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b,c,d=Array.prototype.slice.call(arguments,1),e=this;return b=function(){},c=function(){return e.apply(this instanceof b&&a?this:a,d.concat(Array.prototype.slice.call(arguments)))},b.prototype=this.prototype,c.prototype=new b,c})}(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.settings");var a={clone:!0,immutable:!0,verbose:!1,defaultNodeType:"def",defaultEdgeType:"def",defaultLabelColor:"#000",defaultEdgeColor:"#000",defaultNodeColor:"#000",defaultLabelSize:14,edgeColor:"source",minArrowSize:0,font:"arial",fontStyle:"",labelColor:"default",labelSize:"fixed",labelSizeRatio:1,labelThreshold:8,webglOversamplingRatio:2,borderSize:0,defaultNodeBorderColor:"#000",hoverFont:"",singleHover:!1,hoverFontStyle:"",labelHoverShadow:"default",labelHoverShadowColor:"#000",nodeHoverColor:"node",defaultNodeHoverColor:"#000",labelHoverBGColor:"default",defaultHoverLabelBGColor:"#fff",labelHoverColor:"default",defaultLabelHoverColor:"#000",edgeHoverColor:"edge",edgeHoverSizeRatio:1,defaultEdgeHoverColor:"#000",edgeHoverExtremities:!1,drawEdges:!0,drawNodes:!0,drawLabels:!0,drawEdgeLabels:!1,batchEdgesDrawing:!1,hideEdgesOnMove:!1,canvasEdgesBatchSize:500,webglEdgesBatchSize:1e3,scalingMode:"inside",sideMargin:0,minEdgeSize:.5,maxEdgeSize:1,minNodeSize:1,maxNodeSize:8,touchEnabled:!0,mouseEnabled:!0,mouseWheelEnabled:!0,doubleClickEnabled:!0,eventsEnabled:!0,zoomingRatio:1.7,doubleClickZoomingRatio:2.2,zoomMin:.0625,zoomMax:2,mouseZoomDuration:200,doubleClickZoomDuration:200,mouseInertiaDuration:200,mouseInertiaRatio:3,touchInertiaDuration:200,touchInertiaRatio:3,doubleClickTimeout:300,doubleTapTimeout:300,dragTimeout:200,autoResize:!0,autoRescale:!0,enableCamera:!0,enableHovering:!0,enableEdgeHovering:!1,edgeHoverPrecision:5,rescaleIgnoreSize:!1,skipErrors:!1,nodesPowRatio:.5,edgesPowRatio:.5,animationsTime:200};sigma.settings=sigma.utils.extend(sigma.settings||{},a)}.call(this),function(){"use strict";var a=function(){Object.defineProperty(this,"_handlers",{value:{}})};a.prototype.bind=function(a,b){var c,d,e,f;if(1===arguments.length&&"object"==typeof arguments[0])for(a in arguments[0])this.bind(a,arguments[0][a]);else{if(2!==arguments.length||"function"!=typeof arguments[1])throw"bind: Wrong arguments.";for(f="string"==typeof a?a.split(" "):a,c=0,d=f.length;c!==d;c+=1)e=f[c],e&&(this._handlers[e]||(this._handlers[e]=[]),this._handlers[e].push({handler:b}))}return this},a.prototype.unbind=function(a,b){var c,d,e,f,g,h,i,j="string"==typeof a?a.split(" "):a;if(!arguments.length){for(g in this._handlers)delete this._handlers[g];return this}if(b)for(c=0,d=j.length;c!==d;c+=1){if(i=j[c],this._handlers[i]){for(h=[],e=0,f=this._handlers[i].length;e!==f;e+=1)this._handlers[i][e].handler!==b&&h.push(this._handlers[i][e]);this._handlers[i]=h}this._handlers[i]&&0===this._handlers[i].length&&delete this._handlers[i]}else for(c=0,d=j.length;c!==d;c+=1)delete this._handlers[j[c]];return this},a.prototype.dispatchEvent=function(a,b){var c,d,e,f,g,h,i,j=this,k="string"==typeof a?a.split(" "):a;for(b=void 0===b?{}:b,c=0,d=k.length;c!==d;c+=1)if(i=k[c],this._handlers[i]){for(h=j.getEvent(i,b),g=[],e=0,f=this._handlers[i].length;e!==f;e+=1)this._handlers[i][e].handler(h),this._handlers[i][e].one||g.push(this._handlers[i][e]);this._handlers[i]=g}return this},a.prototype.getEvent=function(a,b){return{type:a,data:b||{},target:this}},a.extend=function(b,c){var d;for(d in a.prototype)a.prototype.hasOwnProperty(d)&&(b[d]=a.prototype[d]);a.apply(b,c)},"undefined"!=typeof this.sigma?(this.sigma.classes=this.sigma.classes||{},this.sigma.classes.dispatcher=a):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=a),exports.dispatcher=a):this.dispatcher=a}.call(this),function(){"use strict";var a=function(){var b,c,d={},e=Array.prototype.slice.call(arguments,0),f=function(a,g){var h,i;if(1===arguments.length&&"string"==typeof a){if(a in d&&void 0!==d[a])return d[a];for(b=0,c=e.length;c>b;b++)if(a in e[b]&&void 0!==e[b][a])return e[b][a];return void 0}if("object"==typeof a&&"string"==typeof g)return g in(a||{})?a[g]:f(g);h="object"==typeof a&&void 0===g?a:{},"string"==typeof a&&(h[a]=g);for(i in h)d[i]=h[i];return this};for(f.embedObjects=function(){var b=e.concat(d).concat(Array.prototype.splice.call(arguments,0));return a.apply({},b)},b=0,c=arguments.length;c>b;b++)f(arguments[b]);return f};"undefined"!=typeof this.sigma?(this.sigma.classes=this.sigma.classes||{},this.sigma.classes.configurable=a):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=a),exports.configurable=a):this.configurable=a}.call(this),function(){"use strict";function a(a,b,c){var d=function(){var d,e;for(d in g[a])g[a][d].apply(b,arguments);e=c.apply(b,arguments);for(d in f[a])f[a][d].apply(b,arguments);return e};return d}function b(a){var b;for(b in a)"hasOwnProperty"in a&&!a.hasOwnProperty(b)||delete a[b];return a}var c=Object.create(null),d=Object.create(null),e=Object.create(null),f=Object.create(null),g=Object.create(null),h={immutable:!0,clone:!0},i=function(a){return h[a]},j=function(b){var d,f,g;g={settings:b||i,nodesArray:[],edgesArray:[],nodesIndex:Object.create(null),edgesIndex:Object.create(null),inNeighborsIndex:Object.create(null),outNeighborsIndex:Object.create(null),allNeighborsIndex:Object.create(null),inNeighborsCount:Object.create(null),outNeighborsCount:Object.create(null),allNeighborsCount:Object.create(null)};for(d in e)e[d].call(g);for(d in c)f=a(d,g,c[d]),this[d]=f,g[d]=f};j.addMethod=function(a,b){if("string"!=typeof a||"function"!=typeof b||2!==arguments.length)throw"addMethod: Wrong arguments.";if(c[a]||j[a])throw'The method "'+a+'" already exists.';return c[a]=b,f[a]=Object.create(null),g[a]=Object.create(null),this},j.hasMethod=function(a){return!(!c[a]&&!j[a])},j.attach=function(a,b,c,d){if("string"!=typeof a||"string"!=typeof b||"function"!=typeof c||arguments.length<3||arguments.length>4)throw"attach: Wrong arguments.";var h;if("constructor"===a)h=e;else if(d){if(!g[a])throw'The method "'+a+'" does not exist.';h=g[a]}else{if(!f[a])throw'The method "'+a+'" does not exist.';h=f[a]}if(h[b])throw'A function "'+b+'" is already attached to the method "'+a+'".';return h[b]=c,this},j.attachBefore=function(a,b,c){return this.attach(a,b,c,!0)},j.addIndex=function(a,b){if("string"!=typeof a||Object(b)!==b||2!==arguments.length)throw"addIndex: Wrong arguments.";if(d[a])throw'The index "'+a+'" already exists.';var c;d[a]=b;for(c in b){if("function"!=typeof b[c])throw"The bindings must be functions.";j.attach(c,a,b[c])}return this},j.addMethod("addNode",function(a){if(Object(a)!==a||1!==arguments.length)throw"addNode: Wrong arguments.";if("string"!=typeof a.id&&"number"!=typeof a.id)throw"The node must have a string or number id.";if(this.nodesIndex[a.id])throw'The node "'+a.id+'" already exists.';var b,c=a.id,d=Object.create(null);if(this.settings("clone"))for(b in a)"id"!==b&&(d[b]=a[b]);else d=a;return this.settings("immutable")?Object.defineProperty(d,"id",{value:c,enumerable:!0}):d.id=c,this.inNeighborsIndex[c]=Object.create(null),this.outNeighborsIndex[c]=Object.create(null),this.allNeighborsIndex[c]=Object.create(null),this.inNeighborsCount[c]=0,this.outNeighborsCount[c]=0,this.allNeighborsCount[c]=0,this.nodesArray.push(d),this.nodesIndex[d.id]=d,this}),j.addMethod("addEdge",function(a){if(Object(a)!==a||1!==arguments.length)throw"addEdge: Wrong arguments.";if("string"!=typeof a.id&&"number"!=typeof a.id)throw"The edge must have a string or number id.";if("string"!=typeof a.source&&"number"!=typeof a.source||!this.nodesIndex[a.source])throw"The edge source must have an existing node id.";if("string"!=typeof a.target&&"number"!=typeof a.target||!this.nodesIndex[a.target])throw"The edge target must have an existing node id.";if(this.edgesIndex[a.id])throw'The edge "'+a.id+'" already exists.';var b,c=Object.create(null);if(this.settings("clone"))for(b in a)"id"!==b&&"source"!==b&&"target"!==b&&(c[b]=a[b]);else c=a;return this.settings("immutable")?(Object.defineProperty(c,"id",{value:a.id,enumerable:!0}),Object.defineProperty(c,"source",{value:a.source,enumerable:!0}),Object.defineProperty(c,"target",{value:a.target,enumerable:!0})):(c.id=a.id,c.source=a.source,c.target=a.target),this.edgesArray.push(c),this.edgesIndex[c.id]=c,this.inNeighborsIndex[c.target][c.source]||(this.inNeighborsIndex[c.target][c.source]=Object.create(null)),this.inNeighborsIndex[c.target][c.source][c.id]=c,this.outNeighborsIndex[c.source][c.target]||(this.outNeighborsIndex[c.source][c.target]=Object.create(null)),this.outNeighborsIndex[c.source][c.target][c.id]=c,this.allNeighborsIndex[c.source][c.target]||(this.allNeighborsIndex[c.source][c.target]=Object.create(null)),this.allNeighborsIndex[c.source][c.target][c.id]=c,c.target!==c.source&&(this.allNeighborsIndex[c.target][c.source]||(this.allNeighborsIndex[c.target][c.source]=Object.create(null)),this.allNeighborsIndex[c.target][c.source][c.id]=c),this.inNeighborsCount[c.target]++,this.outNeighborsCount[c.source]++,this.allNeighborsCount[c.target]++,this.allNeighborsCount[c.source]++,this}),j.addMethod("dropNode",function(a){if("string"!=typeof a&&"number"!=typeof a||1!==arguments.length)throw"dropNode: Wrong arguments.";if(!this.nodesIndex[a])throw'The node "'+a+'" does not exist.';var b,c,d;for(delete this.nodesIndex[a],b=0,d=this.nodesArray.length;d>b;b++)if(this.nodesArray[b].id===a){this.nodesArray.splice(b,1);break}for(b=this.edgesArray.length-1;b>=0;b--)(this.edgesArray[b].source===a||this.edgesArray[b].target===a)&&this.dropEdge(this.edgesArray[b].id);delete this.inNeighborsIndex[a],delete this.outNeighborsIndex[a],delete this.allNeighborsIndex[a],delete this.inNeighborsCount[a],delete this.outNeighborsCount[a],delete this.allNeighborsCount[a];for(c in this.nodesIndex)delete this.inNeighborsIndex[c][a],delete this.outNeighborsIndex[c][a],delete this.allNeighborsIndex[c][a];return this}),j.addMethod("dropEdge",function(a){if("string"!=typeof a&&"number"!=typeof a||1!==arguments.length)throw"dropEdge: Wrong arguments.";if(!this.edgesIndex[a])throw'The edge "'+a+'" does not exist.';var b,c,d;for(d=this.edgesIndex[a],delete this.edgesIndex[a],b=0,c=this.edgesArray.length;c>b;b++)if(this.edgesArray[b].id===a){this.edgesArray.splice(b,1);break}return delete this.inNeighborsIndex[d.target][d.source][d.id],Object.keys(this.inNeighborsIndex[d.target][d.source]).length||delete this.inNeighborsIndex[d.target][d.source],delete this.outNeighborsIndex[d.source][d.target][d.id],Object.keys(this.outNeighborsIndex[d.source][d.target]).length||delete this.outNeighborsIndex[d.source][d.target],delete this.allNeighborsIndex[d.source][d.target][d.id],Object.keys(this.allNeighborsIndex[d.source][d.target]).length||delete this.allNeighborsIndex[d.source][d.target],d.target!==d.source&&(delete this.allNeighborsIndex[d.target][d.source][d.id],Object.keys(this.allNeighborsIndex[d.target][d.source]).length||delete this.allNeighborsIndex[d.target][d.source]),this.inNeighborsCount[d.target]--,this.outNeighborsCount[d.source]--,this.allNeighborsCount[d.source]--,this.allNeighborsCount[d.target]--,this}),j.addMethod("kill",function(){this.nodesArray.length=0,this.edgesArray.length=0,delete this.nodesArray,delete this.edgesArray,delete this.nodesIndex,delete this.edgesIndex,delete this.inNeighborsIndex,delete this.outNeighborsIndex,delete this.allNeighborsIndex,delete this.inNeighborsCount,delete this.outNeighborsCount,delete this.allNeighborsCount}),j.addMethod("clear",function(){return this.nodesArray.length=0,this.edgesArray.length=0,b(this.nodesIndex),b(this.edgesIndex),b(this.nodesIndex),b(this.inNeighborsIndex),b(this.outNeighborsIndex),b(this.allNeighborsIndex),b(this.inNeighborsCount),b(this.outNeighborsCount),b(this.allNeighborsCount),this}),j.addMethod("read",function(a){var b,c,d;for(c=a.nodes||[],b=0,d=c.length;d>b;b++)this.addNode(c[b]);for(c=a.edges||[],b=0,d=c.length;d>b;b++)this.addEdge(c[b]);return this}),j.addMethod("nodes",function(a){if(!arguments.length)return this.nodesArray.slice(0);if(1===arguments.length&&("string"==typeof a||"number"==typeof a))return this.nodesIndex[a];if(1===arguments.length&&"[object Array]"===Object.prototype.toString.call(a)){var b,c,d=[];for(b=0,c=a.length;c>b;b++){if("string"!=typeof a[b]&&"number"!=typeof a[b])throw"nodes: Wrong arguments.";d.push(this.nodesIndex[a[b]])}return d}throw"nodes: Wrong arguments."}),j.addMethod("degree",function(a,b){if(b={"in":this.inNeighborsCount,out:this.outNeighborsCount}[b||""]||this.allNeighborsCount,"string"==typeof a||"number"==typeof a)return b[a];if("[object Array]"===Object.prototype.toString.call(a)){var c,d,e=[];for(c=0,d=a.length;d>c;c++){if("string"!=typeof a[c]&&"number"!=typeof a[c])throw"degree: Wrong arguments.";e.push(b[a[c]])}return e}throw"degree: Wrong arguments."}),j.addMethod("edges",function(a){if(!arguments.length)return this.edgesArray.slice(0);if(1===arguments.length&&("string"==typeof a||"number"==typeof a))return this.edgesIndex[a];if(1===arguments.length&&"[object Array]"===Object.prototype.toString.call(a)){var b,c,d=[];for(b=0,c=a.length;c>b;b++){if("string"!=typeof a[b]&&"number"!=typeof a[b])throw"edges: Wrong arguments.";d.push(this.edgesIndex[a[b]])}return d}throw"edges: Wrong arguments."}),"undefined"!=typeof sigma?(sigma.classes=sigma.classes||Object.create(null),sigma.classes.graph=j):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports.graph=j):this.graph=j}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.classes"),sigma.classes.camera=function(a,b,c,d){sigma.classes.dispatcher.extend(this),Object.defineProperty(this,"graph",{value:b}),Object.defineProperty(this,"id",{value:a}),Object.defineProperty(this,"readPrefix",{value:"read_cam"+a+":"}),Object.defineProperty(this,"prefix",{value:"cam"+a+":"}),this.x=0,this.y=0,this.ratio=1,this.angle=0,this.isAnimated=!1,this.settings="object"==typeof d&&d?c.embedObject(d):c},sigma.classes.camera.prototype.goTo=function(b){if(!this.settings("enableCamera"))return this;var c,d,e=b||{},f=["x","y","ratio","angle"];for(c=0,d=f.length;d>c;c++)if(e[f[c]]!==a){if("number"!=typeof e[f[c]]||isNaN(e[f[c]]))throw'Value for "'+f[c]+'" is not a number.';this[f[c]]=e[f[c]]}return this.dispatchEvent("coordinatesUpdated"),this},sigma.classes.camera.prototype.applyView=function(b,c,d){d=d||{},c=c!==a?c:this.prefix,b=b!==a?b:this.readPrefix;var e,f,g,h=d.nodes||this.graph.nodes(),i=d.edges||this.graph.edges(),j=Math.cos(this.angle),k=Math.sin(this.angle);for(e=0,f=h.length;f>e;e++)g=h[e],g[c+"x"]=(((g[b+"x"]||0)-this.x)*j+((g[b+"y"]||0)-this.y)*k)/this.ratio+(d.width||0)/2,g[c+"y"]=(((g[b+"y"]||0)-this.y)*j-((g[b+"x"]||0)-this.x)*k)/this.ratio+(d.height||0)/2,g[c+"size"]=(g[b+"size"]||0)/Math.pow(this.ratio,this.settings("nodesPowRatio"));for(e=0,f=i.length;f>e;e++)i[e][c+"size"]=(i[e][b+"size"]||0)/Math.pow(this.ratio,this.settings("edgesPowRatio"));return this},sigma.classes.camera.prototype.graphPosition=function(a,b,c){var d=0,e=0,f=Math.cos(this.angle),g=Math.sin(this.angle);return c||(d=-(this.x*f+this.y*g)/this.ratio,e=-(this.y*f-this.x*g)/this.ratio),{x:(a*f+b*g)/this.ratio+d,y:(b*f-a*g)/this.ratio+e}},sigma.classes.camera.prototype.cameraPosition=function(a,b,c){var d=0,e=0,f=Math.cos(this.angle),g=Math.sin(this.angle);return c||(d=-(this.x*f+this.y*g)/this.ratio,e=-(this.y*f-this.x*g)/this.ratio),{x:((a-d)*f-(b-e)*g)*this.ratio,y:((b-e)*f+(a-d)*g)*this.ratio}},sigma.classes.camera.prototype.getMatrix=function(){var a=sigma.utils.matrices.scale(1/this.ratio),b=sigma.utils.matrices.rotation(this.angle),c=sigma.utils.matrices.translation(-this.x,-this.y),d=sigma.utils.matrices.multiply(c,sigma.utils.matrices.multiply(b,a));return d},sigma.classes.camera.prototype.getRectangle=function(a,b){
var c=this.cameraPosition(a,0,!0),d=this.cameraPosition(0,b,!0),e=this.cameraPosition(a/2,b/2,!0),f=this.cameraPosition(a/4,0,!0).x,g=this.cameraPosition(0,b/4,!0).y;return{x1:this.x-e.x-f,y1:this.y-e.y-g,x2:this.x-e.x+f+c.x,y2:this.y-e.y-g+c.y,height:Math.sqrt(Math.pow(d.x,2)+Math.pow(d.y+2*g,2))}}}.call(this),function(a){"use strict";function b(a,b){var c=b.x+b.width/2,d=b.y+b.height/2,e=a.y<d,f=a.x<c;return e?f?0:1:f?2:3}function c(a,b){for(var c=[],d=0;4>d;d++)a.x2>=b[d][0].x&&a.x1<=b[d][1].x&&a.y1+a.height>=b[d][0].y&&a.y1<=b[d][2].y&&c.push(d);return c}function d(a,b){for(var c=[],d=0;4>d;d++)j.collision(a,b[d])&&c.push(d);return c}function e(a,b){var c,d,e=b.level+1,f=Math.round(b.bounds.width/2),g=Math.round(b.bounds.height/2),h=Math.round(b.bounds.x),j=Math.round(b.bounds.y);switch(a){case 0:c=h,d=j;break;case 1:c=h+f,d=j;break;case 2:c=h,d=j+g;break;case 3:c=h+f,d=j+g}return i({x:c,y:d,width:f,height:g},e,b.maxElements,b.maxLevel)}function f(b,d,g){if(g.level<g.maxLevel)for(var h=c(d,g.corners),i=0,j=h.length;j>i;i++)g.nodes[h[i]]===a&&(g.nodes[h[i]]=e(h[i],g)),f(b,d,g.nodes[h[i]]);else g.elements.push(b)}function g(c,d){if(d.level<d.maxLevel){var e=b(c,d.bounds);return d.nodes[e]!==a?g(c,d.nodes[e]):[]}return d.elements}function h(b,c,d,e){if(e=e||{},c.level<c.maxLevel)for(var f=d(b,c.corners),g=0,i=f.length;i>g;g++)c.nodes[f[g]]!==a&&h(b,c.nodes[f[g]],d,e);else for(var j=0,k=c.elements.length;k>j;j++)e[c.elements[j].id]===a&&(e[c.elements[j].id]=c.elements[j]);return e}function i(a,b,c,d){return{level:b||0,bounds:a,corners:j.splitSquare(a),maxElements:c||20,maxLevel:d||4,elements:[],nodes:[]}}var j={pointToSquare:function(a){return{x1:a.x-a.size,y1:a.y-a.size,x2:a.x+a.size,y2:a.y-a.size,height:2*a.size}},isAxisAligned:function(a){return a.x1===a.x2||a.y1===a.y2},axisAlignedTopPoints:function(a){return a.y1===a.y2&&a.x1<a.x2?a:a.x1===a.x2&&a.y2>a.y1?{x1:a.x1-a.height,y1:a.y1,x2:a.x1,y2:a.y1,height:a.height}:a.x1===a.x2&&a.y2<a.y1?{x1:a.x1,y1:a.y2,x2:a.x2+a.height,y2:a.y2,height:a.height}:{x1:a.x2,y1:a.y1-a.height,x2:a.x1,y2:a.y1-a.height,height:a.height}},lowerLeftCoor:function(a){var b=Math.sqrt(Math.pow(a.x2-a.x1,2)+Math.pow(a.y2-a.y1,2));return{x:a.x1-(a.y2-a.y1)*a.height/b,y:a.y1+(a.x2-a.x1)*a.height/b}},lowerRightCoor:function(a,b){return{x:b.x-a.x1+a.x2,y:b.y-a.y1+a.y2}},rectangleCorners:function(a){var b=this.lowerLeftCoor(a),c=this.lowerRightCoor(a,b);return[{x:a.x1,y:a.y1},{x:a.x2,y:a.y2},{x:b.x,y:b.y},{x:c.x,y:c.y}]},splitSquare:function(a){return[[{x:a.x,y:a.y},{x:a.x+a.width/2,y:a.y},{x:a.x,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height/2}],[{x:a.x+a.width/2,y:a.y},{x:a.x+a.width,y:a.y},{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x+a.width,y:a.y+a.height/2}],[{x:a.x,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x,y:a.y+a.height},{x:a.x+a.width/2,y:a.y+a.height}],[{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x+a.width,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height},{x:a.x+a.width,y:a.y+a.height}]]},axis:function(a,b){return[{x:a[1].x-a[0].x,y:a[1].y-a[0].y},{x:a[1].x-a[3].x,y:a[1].y-a[3].y},{x:b[0].x-b[2].x,y:b[0].y-b[2].y},{x:b[0].x-b[1].x,y:b[0].y-b[1].y}]},projection:function(a,b){var c=(a.x*b.x+a.y*b.y)/(Math.pow(b.x,2)+Math.pow(b.y,2));return{x:c*b.x,y:c*b.y}},axisCollision:function(a,b,c){for(var d=[],e=[],f=0;4>f;f++){var g=this.projection(b[f],a),h=this.projection(c[f],a);d.push(g.x*a.x+g.y*a.y),e.push(h.x*a.x+h.y*a.y)}var i=Math.max.apply(Math,d),j=Math.max.apply(Math,e),k=Math.min.apply(Math,d),l=Math.min.apply(Math,e);return i>=l&&j>=k},collision:function(a,b){for(var c=this.axis(a,b),d=!0,e=0;4>e;e++)d*=this.axisCollision(c[e],a,b);return!!d}},k=function(){this._geom=j,this._tree=null,this._cache={query:!1,result:!1}};k.prototype.index=function(a,b){if(!b.bounds)throw"sigma.classes.quad.index: bounds information not given.";var c=b.prefix||"";this._tree=i(b.bounds,0,b.maxElements,b.maxLevel);for(var d=0,e=a.length;e>d;d++)f(a[d],j.pointToSquare({x:a[d][c+"x"],y:a[d][c+"y"],size:a[d][c+"size"]}),this._tree);return this._cache={query:!1,result:!1},this._tree},k.prototype.point=function(a,b){return this._tree?g({x:a,y:b},this._tree)||[]:[]},k.prototype.area=function(a){var b,e,f=JSON.stringify(a);if(this._cache.query===f)return this._cache.result;j.isAxisAligned(a)?(b=c,e=j.axisAlignedTopPoints(a)):(b=d,e=j.rectangleCorners(a));var g=this._tree?h(e,this._tree,b):[],i=[];for(var k in g)i.push(g[k]);return this._cache.query=f,this._cache.result=i,i},"undefined"!=typeof this.sigma?(this.sigma.classes=this.sigma.classes||{},this.sigma.classes.quad=k):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=k),exports.quad=k):this.quad=k}.call(this),function(a){"use strict";function b(a,b){var c=b.x+b.width/2,d=b.y+b.height/2,e=a.y<d,f=a.x<c;return e?f?0:1:f?2:3}function c(a,b){for(var c=[],d=0;4>d;d++)a.x2>=b[d][0].x&&a.x1<=b[d][1].x&&a.y1+a.height>=b[d][0].y&&a.y1<=b[d][2].y&&c.push(d);return c}function d(a,b){for(var c=[],d=0;4>d;d++)j.collision(a,b[d])&&c.push(d);return c}function e(a,b){var c,d,e=b.level+1,f=Math.round(b.bounds.width/2),g=Math.round(b.bounds.height/2),h=Math.round(b.bounds.x),j=Math.round(b.bounds.y);switch(a){case 0:c=h,d=j;break;case 1:c=h+f,d=j;break;case 2:c=h,d=j+g;break;case 3:c=h+f,d=j+g}return i({x:c,y:d,width:f,height:g},e,b.maxElements,b.maxLevel)}function f(b,d,g){if(g.level<g.maxLevel)for(var h=c(d,g.corners),i=0,j=h.length;j>i;i++)g.nodes[h[i]]===a&&(g.nodes[h[i]]=e(h[i],g)),f(b,d,g.nodes[h[i]]);else g.elements.push(b)}function g(c,d){if(d.level<d.maxLevel){var e=b(c,d.bounds);return d.nodes[e]!==a?g(c,d.nodes[e]):[]}return d.elements}function h(b,c,d,e){if(e=e||{},c.level<c.maxLevel)for(var f=d(b,c.corners),g=0,i=f.length;i>g;g++)c.nodes[f[g]]!==a&&h(b,c.nodes[f[g]],d,e);else for(var j=0,k=c.elements.length;k>j;j++)e[c.elements[j].id]===a&&(e[c.elements[j].id]=c.elements[j]);return e}function i(a,b,c,d){return{level:b||0,bounds:a,corners:j.splitSquare(a),maxElements:c||40,maxLevel:d||8,elements:[],nodes:[]}}var j={pointToSquare:function(a){return{x1:a.x-a.size,y1:a.y-a.size,x2:a.x+a.size,y2:a.y-a.size,height:2*a.size}},lineToSquare:function(a){return a.y1<a.y2?a.x1<a.x2?{x1:a.x1-a.size,y1:a.y1-a.size,x2:a.x2+a.size,y2:a.y1-a.size,height:a.y2-a.y1+2*a.size}:{x1:a.x2-a.size,y1:a.y1-a.size,x2:a.x1+a.size,y2:a.y1-a.size,height:a.y2-a.y1+2*a.size}:a.x1<a.x2?{x1:a.x1-a.size,y1:a.y2-a.size,x2:a.x2+a.size,y2:a.y2-a.size,height:a.y1-a.y2+2*a.size}:{x1:a.x2-a.size,y1:a.y2-a.size,x2:a.x1+a.size,y2:a.y2-a.size,height:a.y1-a.y2+2*a.size}},quadraticCurveToSquare:function(a,b){var c=sigma.utils.getPointOnQuadraticCurve(.5,a.x1,a.y1,a.x2,a.y2,b.x,b.y),d=Math.min(a.x1,a.x2,c.x),e=Math.max(a.x1,a.x2,c.x),f=Math.min(a.y1,a.y2,c.y),g=Math.max(a.y1,a.y2,c.y);return{x1:d-a.size,y1:f-a.size,x2:e+a.size,y2:f-a.size,height:g-f+2*a.size}},selfLoopToSquare:function(a){var b=sigma.utils.getSelfLoopControlPoints(a.x,a.y,a.size),c=Math.min(a.x,b.x1,b.x2),d=Math.max(a.x,b.x1,b.x2),e=Math.min(a.y,b.y1,b.y2),f=Math.max(a.y,b.y1,b.y2);return{x1:c-a.size,y1:e-a.size,x2:d+a.size,y2:e-a.size,height:f-e+2*a.size}},isAxisAligned:function(a){return a.x1===a.x2||a.y1===a.y2},axisAlignedTopPoints:function(a){return a.y1===a.y2&&a.x1<a.x2?a:a.x1===a.x2&&a.y2>a.y1?{x1:a.x1-a.height,y1:a.y1,x2:a.x1,y2:a.y1,height:a.height}:a.x1===a.x2&&a.y2<a.y1?{x1:a.x1,y1:a.y2,x2:a.x2+a.height,y2:a.y2,height:a.height}:{x1:a.x2,y1:a.y1-a.height,x2:a.x1,y2:a.y1-a.height,height:a.height}},lowerLeftCoor:function(a){var b=Math.sqrt(Math.pow(a.x2-a.x1,2)+Math.pow(a.y2-a.y1,2));return{x:a.x1-(a.y2-a.y1)*a.height/b,y:a.y1+(a.x2-a.x1)*a.height/b}},lowerRightCoor:function(a,b){return{x:b.x-a.x1+a.x2,y:b.y-a.y1+a.y2}},rectangleCorners:function(a){var b=this.lowerLeftCoor(a),c=this.lowerRightCoor(a,b);return[{x:a.x1,y:a.y1},{x:a.x2,y:a.y2},{x:b.x,y:b.y},{x:c.x,y:c.y}]},splitSquare:function(a){return[[{x:a.x,y:a.y},{x:a.x+a.width/2,y:a.y},{x:a.x,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height/2}],[{x:a.x+a.width/2,y:a.y},{x:a.x+a.width,y:a.y},{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x+a.width,y:a.y+a.height/2}],[{x:a.x,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x,y:a.y+a.height},{x:a.x+a.width/2,y:a.y+a.height}],[{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x+a.width,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height},{x:a.x+a.width,y:a.y+a.height}]]},axis:function(a,b){return[{x:a[1].x-a[0].x,y:a[1].y-a[0].y},{x:a[1].x-a[3].x,y:a[1].y-a[3].y},{x:b[0].x-b[2].x,y:b[0].y-b[2].y},{x:b[0].x-b[1].x,y:b[0].y-b[1].y}]},projection:function(a,b){var c=(a.x*b.x+a.y*b.y)/(Math.pow(b.x,2)+Math.pow(b.y,2));return{x:c*b.x,y:c*b.y}},axisCollision:function(a,b,c){for(var d=[],e=[],f=0;4>f;f++){var g=this.projection(b[f],a),h=this.projection(c[f],a);d.push(g.x*a.x+g.y*a.y),e.push(h.x*a.x+h.y*a.y)}var i=Math.max.apply(Math,d),j=Math.max.apply(Math,e),k=Math.min.apply(Math,d),l=Math.min.apply(Math,e);return i>=l&&j>=k},collision:function(a,b){for(var c=this.axis(a,b),d=!0,e=0;4>e;e++)d*=this.axisCollision(c[e],a,b);return!!d}},k=function(){this._geom=j,this._tree=null,this._cache={query:!1,result:!1},this._enabled=!0};k.prototype.index=function(a,b){if(!this._enabled)return this._tree;if(!b.bounds)throw"sigma.classes.edgequad.index: bounds information not given.";var c,d,e,g,h,k=b.prefix||"";this._tree=i(b.bounds,0,b.maxElements,b.maxLevel);for(var l=a.edges(),m=0,n=l.length;n>m;m++)d=a.nodes(l[m].source),e=a.nodes(l[m].target),h={x1:d[k+"x"],y1:d[k+"y"],x2:e[k+"x"],y2:e[k+"y"],size:l[m][k+"size"]||0},"curve"===l[m].type||"curvedArrow"===l[m].type?d.id===e.id?(g={x:d[k+"x"],y:d[k+"y"],size:d[k+"size"]||0},f(l[m],j.selfLoopToSquare(g),this._tree)):(c=sigma.utils.getQuadraticControlPoint(h.x1,h.y1,h.x2,h.y2),f(l[m],j.quadraticCurveToSquare(h,c),this._tree)):f(l[m],j.lineToSquare(h),this._tree);return this._cache={query:!1,result:!1},this._tree},k.prototype.point=function(a,b){return this._enabled&&this._tree?g({x:a,y:b},this._tree)||[]:[]},k.prototype.area=function(a){if(!this._enabled)return[];var b,e,f=JSON.stringify(a);if(this._cache.query===f)return this._cache.result;j.isAxisAligned(a)?(b=c,e=j.axisAlignedTopPoints(a)):(b=d,e=j.rectangleCorners(a));var g=this._tree?h(e,this._tree,b):[],i=[];for(var k in g)i.push(g[k]);return this._cache.query=f,this._cache.result=i,i},"undefined"!=typeof this.sigma?(this.sigma.classes=this.sigma.classes||{},this.sigma.classes.edgequad=k):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=k),exports.edgequad=k):this.edgequad=k}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.captors"),sigma.captors.mouse=function(a,b,c){function d(a){var b,c,d;return y("mouseEnabled")&&v.dispatchEvent("mousemove",{x:sigma.utils.getX(a)-a.target.width/2,y:sigma.utils.getY(a)-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),y("mouseEnabled")&&q?(r=!0,s=!0,u&&clearTimeout(u),u=setTimeout(function(){r=!1},y("dragTimeout")),sigma.misc.animation.killAll(x),x.isMoving=!0,d=x.cameraPosition(sigma.utils.getX(a)-o,sigma.utils.getY(a)-p,!0),b=k-d.x,c=l-d.y,(b!==x.x||c!==x.y)&&(m=x.x,n=x.y,x.goTo({x:b,y:c})),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1):void 0}function e(a){if(y("mouseEnabled")&&q){q=!1,u&&clearTimeout(u),x.isMoving=!1;var b=sigma.utils.getX(a),c=sigma.utils.getY(a);r?(sigma.misc.animation.killAll(x),sigma.misc.animation.camera(x,{x:x.x+y("mouseInertiaRatio")*(x.x-m),y:x.y+y("mouseInertiaRatio")*(x.y-n)},{easing:"quadraticOut",duration:y("mouseInertiaDuration")})):(o!==b||p!==c)&&x.goTo({x:x.x,y:x.y}),v.dispatchEvent("mouseup",{x:b-a.target.width/2,y:c-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),r=!1}}function f(a){if(y("mouseEnabled"))switch(k=x.x,l=x.y,m=x.x,n=x.y,o=sigma.utils.getX(a),p=sigma.utils.getY(a),s=!1,t=(new Date).getTime(),a.which){case 2:break;case 3:v.dispatchEvent("rightclick",{x:o-a.target.width/2,y:p-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey});break;default:q=!0,v.dispatchEvent("mousedown",{x:o-a.target.width/2,y:p-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey})}}function g(){y("mouseEnabled")&&v.dispatchEvent("mouseout")}function h(a){return y("mouseEnabled")&&v.dispatchEvent("click",{x:sigma.utils.getX(a)-a.target.width/2,y:sigma.utils.getY(a)-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey,isDragging:(new Date).getTime()-t>100&&s}),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1}function i(a){var b,c,d;return y("mouseEnabled")?(c=1/y("doubleClickZoomingRatio"),v.dispatchEvent("doubleclick",{x:o-a.target.width/2,y:p-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),y("doubleClickEnabled")&&(b=x.cameraPosition(sigma.utils.getX(a)-a.target.width/2,sigma.utils.getY(a)-a.target.height/2,!0),d={duration:y("doubleClickZoomDuration")},sigma.utils.zoomTo(x,b.x,b.y,c,d)),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1):void 0}function j(a){var b,c,d;return y("mouseEnabled")&&y("mouseWheelEnabled")?(c=sigma.utils.getDelta(a)>0?1/y("zoomingRatio"):y("zoomingRatio"),b=x.cameraPosition(sigma.utils.getX(a)-a.target.width/2,sigma.utils.getY(a)-a.target.height/2,!0),d={duration:y("mouseZoomDuration")},sigma.utils.zoomTo(x,b.x,b.y,c,d),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1):void 0}var k,l,m,n,o,p,q,r,s,t,u,v=this,w=a,x=b,y=c;sigma.classes.dispatcher.extend(this),sigma.utils.doubleClick(w,"click",i),w.addEventListener("DOMMouseScroll",j,!1),w.addEventListener("mousewheel",j,!1),w.addEventListener("mousemove",d,!1),w.addEventListener("mousedown",f,!1),w.addEventListener("click",h,!1),w.addEventListener("mouseout",g,!1),document.addEventListener("mouseup",e,!1),this.kill=function(){sigma.utils.unbindDoubleClick(w,"click"),w.removeEventListener("DOMMouseScroll",j),w.removeEventListener("mousewheel",j),w.removeEventListener("mousemove",d),w.removeEventListener("mousedown",f),w.removeEventListener("click",h),w.removeEventListener("mouseout",g),document.removeEventListener("mouseup",e)}}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.captors"),sigma.captors.touch=function(a,b,c){function d(a){var b=sigma.utils.getOffset(B);return{x:a.pageX-b.left,y:a.pageY-b.top}}function e(a){if(D("touchEnabled")){var b,c,e,f,g,h;switch(E=a.touches,E.length){case 1:C.isMoving=!0,w=1,i=C.x,j=C.y,m=C.x,n=C.y,g=d(E[0]),q=g.x,r=g.y;break;case 2:return C.isMoving=!0,w=2,g=d(E[0]),h=d(E[1]),b=g.x,e=g.y,c=h.x,f=h.y,m=C.x,n=C.y,k=C.angle,l=C.ratio,i=C.x,j=C.y,q=b,r=e,s=c,t=f,u=Math.atan2(t-r,s-q),v=Math.sqrt(Math.pow(t-r,2)+Math.pow(s-q,2)),a.preventDefault(),!1}}}function f(a){if(D("touchEnabled")){E=a.touches;var b=D("touchInertiaRatio");switch(z&&(x=!1,clearTimeout(z)),w){case 2:if(1===a.touches.length){e(a),a.preventDefault();break}case 1:C.isMoving=!1,A.dispatchEvent("stopDrag"),x&&(y=!1,sigma.misc.animation.camera(C,{x:C.x+b*(C.x-m),y:C.y+b*(C.y-n)},{easing:"quadraticOut",duration:D("touchInertiaDuration")})),x=!1,w=0}}}function g(a){if(!y&&D("touchEnabled")){var b,c,e,f,g,h,B,F,G,H,I,J,K,L,M,N,O;switch(E=a.touches,x=!0,z&&clearTimeout(z),z=setTimeout(function(){x=!1},D("dragTimeout")),w){case 1:F=d(E[0]),b=F.x,e=F.y,H=C.cameraPosition(b-q,e-r,!0),L=i-H.x,M=j-H.y,(L!==C.x||M!==C.y)&&(m=C.x,n=C.y,C.goTo({x:L,y:M}),A.dispatchEvent("mousemove",{x:F.x-a.target.width/2,y:F.y-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),A.dispatchEvent("drag"));break;case 2:F=d(E[0]),G=d(E[1]),b=F.x,e=F.y,c=G.x,f=G.y,I=C.cameraPosition((q+s)/2-a.target.width/2,(r+t)/2-a.target.height/2,!0),B=C.cameraPosition((b+c)/2-a.target.width/2,(e+f)/2-a.target.height/2,!0),J=Math.atan2(f-e,c-b)-u,K=Math.sqrt(Math.pow(f-e,2)+Math.pow(c-b,2))/v,b=I.x,e=I.y,N=l/K,b*=K,e*=K,O=k-J,g=Math.cos(-J),h=Math.sin(-J),c=b*g+e*h,f=e*g-b*h,b=c,e=f,L=b-B.x+i,M=e-B.y+j,(N!==C.ratio||O!==C.angle||L!==C.x||M!==C.y)&&(m=C.x,n=C.y,o=C.angle,p=C.ratio,C.goTo({x:L,y:M,angle:O,ratio:N}),A.dispatchEvent("drag"))}return a.preventDefault(),!1}}function h(a){var b,c,e;return a.touches&&1===a.touches.length&&D("touchEnabled")?(y=!0,c=1/D("doubleClickZoomingRatio"),b=d(a.touches[0]),A.dispatchEvent("doubleclick",{x:b.x-a.target.width/2,y:b.y-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),D("doubleClickEnabled")&&(b=C.cameraPosition(b.x-a.target.width/2,b.y-a.target.height/2,!0),e={duration:D("doubleClickZoomDuration"),onComplete:function(){y=!1}},sigma.utils.zoomTo(C,b.x,b.y,c,e)),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1):void 0}var i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A=this,B=a,C=b,D=c,E=[];sigma.classes.dispatcher.extend(this),sigma.utils.doubleClick(B,"touchstart",h),B.addEventListener("touchstart",e,!1),B.addEventListener("touchend",f,!1),B.addEventListener("touchcancel",f,!1),B.addEventListener("touchleave",f,!1),B.addEventListener("touchmove",g,!1),this.kill=function(){sigma.utils.unbindDoubleClick(B,"touchstart"),B.addEventListener("touchstart",e),B.addEventListener("touchend",f),B.addEventListener("touchcancel",f),B.addEventListener("touchleave",f),B.addEventListener("touchmove",g)}}}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";if("undefined"==typeof conrad)throw"conrad is not declared";sigma.utils.pkg("sigma.renderers"),sigma.renderers.canvas=function(a,b,c,d){if("object"!=typeof d)throw"sigma.renderers.canvas: Wrong arguments.";if(!(d.container instanceof HTMLElement))throw"Container not found.";var e,f,g,h;for(sigma.classes.dispatcher.extend(this),Object.defineProperty(this,"conradId",{value:sigma.utils.id()}),this.graph=a,this.camera=b,this.contexts={},this.domElements={},this.options=d,this.container=this.options.container,this.settings="object"==typeof d.settings&&d.settings?c.embedObjects(d.settings):c,this.nodesOnScreen=[],this.edgesOnScreen=[],this.jobs={},this.options.prefix="renderer"+this.conradId+":",this.settings("batchEdgesDrawing")?(this.initDOM("canvas","edges"),this.initDOM("canvas","scene"),this.contexts.nodes=this.contexts.scene,this.contexts.labels=this.contexts.scene):(this.initDOM("canvas","scene"),this.contexts.edges=this.contexts.scene,this.contexts.nodes=this.contexts.scene,this.contexts.labels=this.contexts.scene),this.initDOM("canvas","mouse"),this.contexts.hover=this.contexts.mouse,this.captors=[],g=this.options.captors||[sigma.captors.mouse,sigma.captors.touch],e=0,f=g.length;f>e;e++)h="function"==typeof g[e]?g[e]:sigma.captors[g[e]],this.captors.push(new h(this.domElements.mouse,this.camera,this.settings));sigma.misc.bindEvents.call(this,this.options.prefix),sigma.misc.drawHovers.call(this,this.options.prefix),this.resize(!1)},sigma.renderers.canvas.prototype.render=function(b){b=b||{};var c,d,e,f,g,h,i,j,k,l,m,n,o,p={},q=this.graph,r=this.graph.nodes,s=(this.options.prefix||"",this.settings(b,"drawEdges")),t=this.settings(b,"drawNodes"),u=this.settings(b,"drawLabels"),v=this.settings(b,"drawEdgeLabels"),w=this.settings.embedObjects(b,{prefix:this.options.prefix});this.resize(!1),this.settings(b,"hideEdgesOnMove")&&(this.camera.isAnimated||this.camera.isMoving)&&(s=!1),this.camera.applyView(a,this.options.prefix,{width:this.width,height:this.height}),this.clear();for(e in this.jobs)conrad.hasJob(e)&&conrad.killJob(e);for(this.edgesOnScreen=[],this.nodesOnScreen=this.camera.quadtree.area(this.camera.getRectangle(this.width,this.height)),c=this.nodesOnScreen,d=0,f=c.length;f>d;d++)p[c[d].id]=c[d];if(s){for(c=q.edges(),d=0,f=c.length;f>d;d++)g=c[d],!p[g.source]&&!p[g.target]||g.hidden||r(g.source).hidden||r(g.target).hidden||this.edgesOnScreen.push(g);if(this.settings(b,"batchEdgesDrawing"))h="edges_"+this.conradId,n=w("canvasEdgesBatchSize"),l=this.edgesOnScreen,f=l.length,k=0,i=Math.min(l.length,k+n),j=function(){for(o=this.contexts.edges.globalCompositeOperation,this.contexts.edges.globalCompositeOperation="destination-over",m=sigma.canvas.edges,d=k;i>d;d++)g=l[d],(m[g.type||this.settings(b,"defaultEdgeType")]||m.def)(g,q.nodes(g.source),q.nodes(g.target),this.contexts.edges,w);if(v)for(m=sigma.canvas.edges.labels,d=k;i>d;d++)g=l[d],g.hidden||(m[g.type||this.settings(b,"defaultEdgeType")]||m.def)(g,q.nodes(g.source),q.nodes(g.target),this.contexts.labels,w);return this.contexts.edges.globalCompositeOperation=o,i===l.length?(delete this.jobs[h],!1):(k=i+1,i=Math.min(l.length,k+n),!0)},this.jobs[h]=j,conrad.addJob(h,j.bind(this));else{for(m=sigma.canvas.edges,c=this.edgesOnScreen,d=0,f=c.length;f>d;d++)g=c[d],(m[g.type||this.settings(b,"defaultEdgeType")]||m.def)(g,q.nodes(g.source),q.nodes(g.target),this.contexts.edges,w);if(v)for(m=sigma.canvas.edges.labels,c=this.edgesOnScreen,d=0,f=c.length;f>d;d++)c[d].hidden||(m[c[d].type||this.settings(b,"defaultEdgeType")]||m.def)(c[d],q.nodes(c[d].source),q.nodes(c[d].target),this.contexts.labels,w)}}if(t)for(m=sigma.canvas.nodes,c=this.nodesOnScreen,d=0,f=c.length;f>d;d++)c[d].hidden||(m[c[d].type||this.settings(b,"defaultNodeType")]||m.def)(c[d],this.contexts.nodes,w);if(u)for(m=sigma.canvas.labels,c=this.nodesOnScreen,d=0,f=c.length;f>d;d++)c[d].hidden||(m[c[d].type||this.settings(b,"defaultNodeType")]||m.def)(c[d],this.contexts.labels,w);return this.dispatchEvent("render"),this},sigma.renderers.canvas.prototype.initDOM=function(a,b){var c=document.createElement(a);c.style.position="absolute",c.setAttribute("class","sigma-"+b),this.domElements[b]=c,this.container.appendChild(c),"canvas"===a.toLowerCase()&&(this.contexts[b]=c.getContext("2d"))},sigma.renderers.canvas.prototype.resize=function(b,c){var d,e=this.width,f=this.height,g=1;if(b!==a&&c!==a?(this.width=b,this.height=c):(this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,b=this.width,c=this.height),e!==this.width||f!==this.height)for(d in this.domElements)this.domElements[d].style.width=b+"px",this.domElements[d].style.height=c+"px","canvas"===this.domElements[d].tagName.toLowerCase()&&(this.domElements[d].setAttribute("width",b*g+"px"),this.domElements[d].setAttribute("height",c*g+"px"),1!==g&&this.contexts[d].scale(g,g));return this},sigma.renderers.canvas.prototype.clear=function(){var a;for(a in this.domElements)"CANVAS"===this.domElements[a].tagName&&(this.domElements[a].width=this.domElements[a].width);return this},sigma.renderers.canvas.prototype.kill=function(){for(var a,b;b=this.captors.pop();)b.kill();delete this.captors;for(a in this.domElements)this.domElements[a].parentNode.removeChild(this.domElements[a]),delete this.domElements[a],delete this.contexts[a];delete this.domElements,delete this.contexts},sigma.utils.pkg("sigma.canvas.nodes"),sigma.utils.pkg("sigma.canvas.edges"),sigma.utils.pkg("sigma.canvas.labels")}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.renderers"),sigma.renderers.webgl=function(a,b,c,d){if("object"!=typeof d)throw"sigma.renderers.webgl: Wrong arguments.";if(!(d.container instanceof HTMLElement))throw"Container not found.";var e,f,g,h;for(sigma.classes.dispatcher.extend(this),this.jobs={},Object.defineProperty(this,"conradId",{value:sigma.utils.id()}),this.graph=a,this.camera=b,this.contexts={},this.domElements={},this.options=d,this.container=this.options.container,this.settings="object"==typeof d.settings&&d.settings?c.embedObjects(d.settings):c,this.options.prefix=this.camera.readPrefix,Object.defineProperty(this,"nodePrograms",{value:{}}),Object.defineProperty(this,"edgePrograms",{value:{}}),Object.defineProperty(this,"nodeFloatArrays",{value:{}}),Object.defineProperty(this,"edgeFloatArrays",{value:{}}),this.settings(d,"batchEdgesDrawing")?(this.initDOM("canvas","edges",!0),this.initDOM("canvas","nodes",!0)):(this.initDOM("canvas","scene",!0),this.contexts.nodes=this.contexts.scene,this.contexts.edges=this.contexts.scene),this.initDOM("canvas","labels"),this.initDOM("canvas","mouse"),this.contexts.hover=this.contexts.mouse,this.captors=[],g=this.options.captors||[sigma.captors.mouse,sigma.captors.touch],e=0,f=g.length;f>e;e++)h="function"==typeof g[e]?g[e]:sigma.captors[g[e]],this.captors.push(new h(this.domElements.mouse,this.camera,this.settings));sigma.misc.bindEvents.call(this,this.camera.prefix),sigma.misc.drawHovers.call(this,this.camera.prefix),this.resize()},sigma.renderers.webgl.prototype.process=function(){var a,b,c,d,e,f,g=this.graph,h=sigma.utils.extend(h,this.options);for(d in this.nodeFloatArrays)delete this.nodeFloatArrays[d];for(d in this.edgeFloatArrays)delete this.edgeFloatArrays[d];for(a=g.edges(),b=0,c=a.length;c>b;b++)e=a[b].type||this.settings(h,"defaultEdgeType"),d=e&&sigma.webgl.edges[e]?e:"def",this.edgeFloatArrays[d]||(this.edgeFloatArrays[d]={edges:[]}),this.edgeFloatArrays[d].edges.push(a[b]);for(a=g.nodes(),b=0,c=a.length;c>b;b++)e=a[b].type||this.settings(h,"defaultNodeType"),d=e&&sigma.webgl.nodes[e]?e:"def",this.nodeFloatArrays[d]||(this.nodeFloatArrays[d]={nodes:[]}),this.nodeFloatArrays[d].nodes.push(a[b]);for(d in this.edgeFloatArrays)for(f=sigma.webgl.edges[d],a=this.edgeFloatArrays[d].edges,b=0,c=a.length;c>b;b++)this.edgeFloatArrays[d].array||(this.edgeFloatArrays[d].array=new Float32Array(a.length*f.POINTS*f.ATTRIBUTES)),a[b].hidden||g.nodes(a[b].source).hidden||g.nodes(a[b].target).hidden||f.addEdge(a[b],g.nodes(a[b].source),g.nodes(a[b].target),this.edgeFloatArrays[d].array,b*f.POINTS*f.ATTRIBUTES,h.prefix,this.settings);for(d in this.nodeFloatArrays)for(f=sigma.webgl.nodes[d],a=this.nodeFloatArrays[d].nodes,b=0,c=a.length;c>b;b++)this.nodeFloatArrays[d].array||(this.nodeFloatArrays[d].array=new Float32Array(a.length*f.POINTS*f.ATTRIBUTES)),a[b].hidden||f.addNode(a[b],this.nodeFloatArrays[d].array,b*f.POINTS*f.ATTRIBUTES,h.prefix,this.settings);return this},sigma.renderers.webgl.prototype.render=function(b){var c,d,e,f,g,h,i=this,j=(this.graph,this.contexts.nodes),k=this.contexts.edges,l=this.camera.getMatrix(),m=sigma.utils.extend(b,this.options),n=this.settings(m,"drawLabels"),o=this.settings(m,"drawEdges"),p=this.settings(m,"drawNodes");this.resize(!1),this.settings(m,"hideEdgesOnMove")&&(this.camera.isAnimated||this.camera.isMoving)&&(o=!1),this.clear(),l=sigma.utils.matrices.multiply(l,sigma.utils.matrices.translation(this.width/2,this.height/2));for(f in this.jobs)conrad.hasJob(f)&&conrad.killJob(f);if(o)if(this.settings(m,"batchEdgesDrawing"))(function(){var a,b,c,d,e,f,g,h,i;c="edges_"+this.conradId,i=this.settings(m,"webglEdgesBatchSize"),a=Object.keys(this.edgeFloatArrays),a.length&&(b=0,h=sigma.webgl.edges[a[b]],e=this.edgeFloatArrays[a[b]].array,g=0,f=Math.min(g+i*h.POINTS,e.length/h.ATTRIBUTES),d=function(){return this.edgePrograms[a[b]]||(this.edgePrograms[a[b]]=h.initProgram(k)),f>g&&(k.useProgram(this.edgePrograms[a[b]]),h.render(k,this.edgePrograms[a[b]],e,{settings:this.settings,matrix:l,width:this.width,height:this.height,ratio:this.camera.ratio,scalingRatio:this.settings(m,"webglOversamplingRatio"),start:g,count:f-g})),f>=e.length/h.ATTRIBUTES&&b===a.length-1?(delete this.jobs[c],!1):(f>=e.length/h.ATTRIBUTES?(b++,e=this.edgeFloatArrays[a[b]].array,h=sigma.webgl.edges[a[b]],g=0,f=Math.min(g+i*h.POINTS,e.length/h.ATTRIBUTES)):(g=f,f=Math.min(g+i*h.POINTS,e.length/h.ATTRIBUTES)),!0)},this.jobs[c]=d,conrad.addJob(c,d.bind(this)))}).call(this);else for(f in this.edgeFloatArrays)h=sigma.webgl.edges[f],this.edgePrograms[f]||(this.edgePrograms[f]=h.initProgram(k)),this.edgeFloatArrays[f]&&(k.useProgram(this.edgePrograms[f]),h.render(k,this.edgePrograms[f],this.edgeFloatArrays[f].array,{settings:this.settings,matrix:l,width:this.width,height:this.height,ratio:this.camera.ratio,scalingRatio:this.settings(m,"webglOversamplingRatio")}));if(p){j.blendFunc(j.SRC_ALPHA,j.ONE_MINUS_SRC_ALPHA),j.enable(j.BLEND);for(f in this.nodeFloatArrays)h=sigma.webgl.nodes[f],this.nodePrograms[f]||(this.nodePrograms[f]=h.initProgram(j)),this.nodeFloatArrays[f]&&(j.useProgram(this.nodePrograms[f]),h.render(j,this.nodePrograms[f],this.nodeFloatArrays[f].array,{settings:this.settings,matrix:l,width:this.width,height:this.height,ratio:this.camera.ratio,scalingRatio:this.settings(m,"webglOversamplingRatio")}))}if(n)for(c=this.camera.quadtree.area(this.camera.getRectangle(this.width,this.height)),this.camera.applyView(a,a,{nodes:c,edges:[],width:this.width,height:this.height}),g=function(a){return i.settings({prefix:i.camera.prefix},a)},d=0,e=c.length;e>d;d++)c[d].hidden||(sigma.canvas.labels[c[d].type||this.settings(m,"defaultNodeType")]||sigma.canvas.labels.def)(c[d],this.contexts.labels,g);return this.dispatchEvent("render"),this},sigma.renderers.webgl.prototype.initDOM=function(a,b,c){var d=document.createElement(a),e=this;d.style.position="absolute",d.setAttribute("class","sigma-"+b),this.domElements[b]=d,this.container.appendChild(d),"canvas"===a.toLowerCase()&&(this.contexts[b]=d.getContext(c?"experimental-webgl":"2d",{preserveDrawingBuffer:!0}),c&&(d.addEventListener("webglcontextlost",function(a){a.preventDefault()},!1),d.addEventListener("webglcontextrestored",function(){e.render()},!1)))},sigma.renderers.webgl.prototype.resize=function(b,c){var d,e=this.width,f=this.height;if(b!==a&&c!==a?(this.width=b,this.height=c):(this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,b=this.width,c=this.height),e!==this.width||f!==this.height)for(d in this.domElements)this.domElements[d].style.width=b+"px",this.domElements[d].style.height=c+"px","canvas"===this.domElements[d].tagName.toLowerCase()&&(this.contexts[d]&&this.contexts[d].scale?(this.domElements[d].setAttribute("width",b+"px"),this.domElements[d].setAttribute("height",c+"px")):(this.domElements[d].setAttribute("width",b*this.settings("webglOversamplingRatio")+"px"),this.domElements[d].setAttribute("height",c*this.settings("webglOversamplingRatio")+"px")));for(d in this.contexts)this.contexts[d]&&this.contexts[d].viewport&&this.contexts[d].viewport(0,0,this.width*this.settings("webglOversamplingRatio"),this.height*this.settings("webglOversamplingRatio"));return this},sigma.renderers.webgl.prototype.clear=function(){var a;for(a in this.domElements)"CANVAS"===this.domElements[a].tagName&&(this.domElements[a].width=this.domElements[a].width);return this.contexts.nodes.clear(this.contexts.nodes.COLOR_BUFFER_BIT),this.contexts.edges.clear(this.contexts.edges.COLOR_BUFFER_BIT),this},sigma.renderers.webgl.prototype.kill=function(){for(var a,b;b=this.captors.pop();)b.kill();delete this.captors;for(a in this.domElements)this.domElements[a].parentNode.removeChild(this.domElements[a]),delete this.domElements[a],delete this.contexts[a];delete this.domElements,delete this.contexts},sigma.utils.pkg("sigma.webgl.nodes"),sigma.utils.pkg("sigma.webgl.edges"),sigma.utils.pkg("sigma.canvas.labels")}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.renderers");var b,c=!!a.WebGLRenderingContext;if(c){b=document.createElement("canvas");try{c=!(!b.getContext("webgl")&&!b.getContext("experimental-webgl"))}catch(d){c=!1}}sigma.renderers.def=c?sigma.renderers.webgl:sigma.renderers.canvas}(this),function(){"use strict";sigma.utils.pkg("sigma.webgl.nodes"),sigma.webgl.nodes.def={POINTS:3,ATTRIBUTES:5,addNode:function(a,b,c,d,e){var f=sigma.utils.floatColor(a.color||e("defaultNodeColor"));b[c++]=a[d+"x"],b[c++]=a[d+"y"],b[c++]=a[d+"size"],b[c++]=f,b[c++]=0,b[c++]=a[d+"x"],
b[c++]=a[d+"y"],b[c++]=a[d+"size"],b[c++]=f,b[c++]=2*Math.PI/3,b[c++]=a[d+"x"],b[c++]=a[d+"y"],b[c++]=a[d+"size"],b[c++]=f,b[c++]=4*Math.PI/3},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_position"),g=a.getAttribLocation(b,"a_size"),h=a.getAttribLocation(b,"a_color"),i=a.getAttribLocation(b,"a_angle"),j=a.getUniformLocation(b,"u_resolution"),k=a.getUniformLocation(b,"u_matrix"),l=a.getUniformLocation(b,"u_ratio"),m=a.getUniformLocation(b,"u_scale");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.DYNAMIC_DRAW),a.uniform2f(j,d.width,d.height),a.uniform1f(l,1/Math.pow(d.ratio,d.settings("nodesPowRatio"))),a.uniform1f(m,d.scalingRatio),a.uniformMatrix3fv(k,!1,d.matrix),a.enableVertexAttribArray(f),a.enableVertexAttribArray(g),a.enableVertexAttribArray(h),a.enableVertexAttribArray(i),a.vertexAttribPointer(f,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(g,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.vertexAttribPointer(h,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,12),a.vertexAttribPointer(i,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,16),a.drawArrays(a.TRIANGLES,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_position;","attribute float a_size;","attribute float a_color;","attribute float a_angle;","uniform vec2 u_resolution;","uniform float u_ratio;","uniform float u_scale;","uniform mat3 u_matrix;","varying vec4 color;","varying vec2 center;","varying float radius;","void main() {","radius = a_size * u_ratio;","vec2 position = (u_matrix * vec3(a_position, 1)).xy;","center = position * u_scale;","center = vec2(center.x, u_scale * u_resolution.y - center.y);","position = position +","2.0 * radius * vec2(cos(a_angle), sin(a_angle));","position = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);","radius = radius * u_scale;","gl_Position = vec4(position, 0, 1);","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","varying vec2 center;","varying float radius;","void main(void) {","vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);","vec2 m = gl_FragCoord.xy - center;","float diff = radius - sqrt(m.x * m.x + m.y * m.y);","if (diff > 0.0)","gl_FragColor = color;","else","gl_FragColor = color0;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";sigma.utils.pkg("sigma.webgl.nodes"),sigma.webgl.nodes.fast={POINTS:1,ATTRIBUTES:4,addNode:function(a,b,c,d,e){b[c++]=a[d+"x"],b[c++]=a[d+"y"],b[c++]=a[d+"size"],b[c++]=sigma.utils.floatColor(a.color||e("defaultNodeColor"))},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_position"),g=a.getAttribLocation(b,"a_size"),h=a.getAttribLocation(b,"a_color"),i=a.getUniformLocation(b,"u_resolution"),j=a.getUniformLocation(b,"u_matrix"),k=a.getUniformLocation(b,"u_ratio"),l=a.getUniformLocation(b,"u_scale");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.DYNAMIC_DRAW),a.uniform2f(i,d.width,d.height),a.uniform1f(k,1/Math.pow(d.ratio,d.settings("nodesPowRatio"))),a.uniform1f(l,d.scalingRatio),a.uniformMatrix3fv(j,!1,d.matrix),a.enableVertexAttribArray(f),a.enableVertexAttribArray(g),a.enableVertexAttribArray(h),a.vertexAttribPointer(f,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(g,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.vertexAttribPointer(h,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,12),a.drawArrays(a.POINTS,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_position;","attribute float a_size;","attribute float a_color;","uniform vec2 u_resolution;","uniform float u_ratio;","uniform float u_scale;","uniform mat3 u_matrix;","varying vec4 color;","void main() {","gl_Position = vec4(","((u_matrix * vec3(a_position, 1)).xy /","u_resolution * 2.0 - 1.0) * vec2(1, -1),","0,","1",");","gl_PointSize = a_size * u_ratio * u_scale * 2.0;","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","void main(void) {","gl_FragColor = color;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";sigma.utils.pkg("sigma.webgl.edges"),sigma.webgl.edges.def={POINTS:6,ATTRIBUTES:7,addEdge:function(a,b,c,d,e,f,g){var h=(a[f+"size"]||1)/2,i=b[f+"x"],j=b[f+"y"],k=c[f+"x"],l=c[f+"y"],m=a.color;if(!m)switch(g("edgeColor")){case"source":m=b.color||g("defaultNodeColor");break;case"target":m=c.color||g("defaultNodeColor");break;default:m=g("defaultEdgeColor")}m=sigma.utils.floatColor(m),d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=0,d[e++]=m,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=1,d[e++]=m,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=0,d[e++]=m,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=0,d[e++]=m,d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=1,d[e++]=m,d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=0,d[e++]=m},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_color"),g=a.getAttribLocation(b,"a_position1"),h=a.getAttribLocation(b,"a_position2"),i=a.getAttribLocation(b,"a_thickness"),j=a.getAttribLocation(b,"a_minus"),k=a.getUniformLocation(b,"u_resolution"),l=a.getUniformLocation(b,"u_matrix"),m=a.getUniformLocation(b,"u_matrixHalfPi"),n=a.getUniformLocation(b,"u_matrixHalfPiMinus"),o=a.getUniformLocation(b,"u_ratio"),p=a.getUniformLocation(b,"u_scale");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.STATIC_DRAW),a.uniform2f(k,d.width,d.height),a.uniform1f(o,d.ratio/Math.pow(d.ratio,d.settings("edgesPowRatio"))),a.uniform1f(p,d.scalingRatio),a.uniformMatrix3fv(l,!1,d.matrix),a.uniformMatrix2fv(m,!1,sigma.utils.matrices.rotation(Math.PI/2,!0)),a.uniformMatrix2fv(n,!1,sigma.utils.matrices.rotation(-Math.PI/2,!0)),a.enableVertexAttribArray(f),a.enableVertexAttribArray(g),a.enableVertexAttribArray(h),a.enableVertexAttribArray(i),a.enableVertexAttribArray(j),a.vertexAttribPointer(g,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(h,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.vertexAttribPointer(i,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,16),a.vertexAttribPointer(j,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,20),a.vertexAttribPointer(f,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,24),a.drawArrays(a.TRIANGLES,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_position1;","attribute vec2 a_position2;","attribute float a_thickness;","attribute float a_minus;","attribute float a_color;","uniform vec2 u_resolution;","uniform float u_ratio;","uniform float u_scale;","uniform mat3 u_matrix;","uniform mat2 u_matrixHalfPi;","uniform mat2 u_matrixHalfPiMinus;","varying vec4 color;","void main() {","vec2 position = a_thickness * u_ratio *","normalize(a_position2 - a_position1);","mat2 matrix = a_minus * u_matrixHalfPiMinus +","(1.0 - a_minus) * u_matrixHalfPi;","position = matrix * position + a_position1;","gl_Position = vec4(","((u_matrix * vec3(position, 1)).xy /","u_resolution * 2.0 - 1.0) * vec2(1, -1),","0,","1",");","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","void main(void) {","gl_FragColor = color;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";sigma.utils.pkg("sigma.webgl.edges"),sigma.webgl.edges.fast={POINTS:2,ATTRIBUTES:3,addEdge:function(a,b,c,d,e,f,g){var h=((a[f+"size"]||1)/2,b[f+"x"]),i=b[f+"y"],j=c[f+"x"],k=c[f+"y"],l=a.color;if(!l)switch(g("edgeColor")){case"source":l=b.color||g("defaultNodeColor");break;case"target":l=c.color||g("defaultNodeColor");break;default:l=g("defaultEdgeColor")}l=sigma.utils.floatColor(l),d[e++]=h,d[e++]=i,d[e++]=l,d[e++]=j,d[e++]=k,d[e++]=l},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_color"),g=a.getAttribLocation(b,"a_position"),h=a.getUniformLocation(b,"u_resolution"),i=a.getUniformLocation(b,"u_matrix");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.DYNAMIC_DRAW),a.uniform2f(h,d.width,d.height),a.uniformMatrix3fv(i,!1,d.matrix),a.enableVertexAttribArray(g),a.enableVertexAttribArray(f),a.vertexAttribPointer(g,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(f,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.lineWidth(3),a.drawArrays(a.LINES,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_position;","attribute float a_color;","uniform vec2 u_resolution;","uniform mat3 u_matrix;","varying vec4 color;","void main() {","gl_Position = vec4(","((u_matrix * vec3(a_position, 1)).xy /","u_resolution * 2.0 - 1.0) * vec2(1, -1),","0,","1",");","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","void main(void) {","gl_FragColor = color;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";sigma.utils.pkg("sigma.webgl.edges"),sigma.webgl.edges.arrow={POINTS:9,ATTRIBUTES:11,addEdge:function(a,b,c,d,e,f,g){var h=(a[f+"size"]||1)/2,i=b[f+"x"],j=b[f+"y"],k=c[f+"x"],l=c[f+"y"],m=c[f+"size"],n=a.color;if(!n)switch(g("edgeColor")){case"source":n=b.color||g("defaultNodeColor");break;case"target":n=c.color||g("defaultNodeColor");break;default:n=g("defaultEdgeColor")}n=sigma.utils.floatColor(n),d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=m,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=1,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=m,d[e++]=0,d[e++]=1,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=m,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=1,d[e++]=-1,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=1,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=1,d[e++]=1,d[e++]=n},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_pos1"),g=a.getAttribLocation(b,"a_pos2"),h=a.getAttribLocation(b,"a_thickness"),i=a.getAttribLocation(b,"a_tSize"),j=a.getAttribLocation(b,"a_delay"),k=a.getAttribLocation(b,"a_minus"),l=a.getAttribLocation(b,"a_head"),m=a.getAttribLocation(b,"a_headPosition"),n=a.getAttribLocation(b,"a_color"),o=a.getUniformLocation(b,"u_resolution"),p=a.getUniformLocation(b,"u_matrix"),q=a.getUniformLocation(b,"u_matrixHalfPi"),r=a.getUniformLocation(b,"u_matrixHalfPiMinus"),s=a.getUniformLocation(b,"u_ratio"),t=a.getUniformLocation(b,"u_nodeRatio"),u=a.getUniformLocation(b,"u_arrowHead"),v=a.getUniformLocation(b,"u_scale");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.STATIC_DRAW),a.uniform2f(o,d.width,d.height),a.uniform1f(s,d.ratio/Math.pow(d.ratio,d.settings("edgesPowRatio"))),a.uniform1f(t,Math.pow(d.ratio,d.settings("nodesPowRatio"))/d.ratio),a.uniform1f(u,5),a.uniform1f(v,d.scalingRatio),a.uniformMatrix3fv(p,!1,d.matrix),a.uniformMatrix2fv(q,!1,sigma.utils.matrices.rotation(Math.PI/2,!0)),a.uniformMatrix2fv(r,!1,sigma.utils.matrices.rotation(-Math.PI/2,!0)),a.enableVertexAttribArray(f),a.enableVertexAttribArray(g),a.enableVertexAttribArray(h),a.enableVertexAttribArray(i),a.enableVertexAttribArray(j),a.enableVertexAttribArray(k),a.enableVertexAttribArray(l),a.enableVertexAttribArray(m),a.enableVertexAttribArray(n),a.vertexAttribPointer(f,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(g,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.vertexAttribPointer(h,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,16),a.vertexAttribPointer(i,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,20),a.vertexAttribPointer(j,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,24),a.vertexAttribPointer(k,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,28),a.vertexAttribPointer(l,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,32),a.vertexAttribPointer(m,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,36),a.vertexAttribPointer(n,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,40),a.drawArrays(a.TRIANGLES,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_pos1;","attribute vec2 a_pos2;","attribute float a_thickness;","attribute float a_tSize;","attribute float a_delay;","attribute float a_minus;","attribute float a_head;","attribute float a_headPosition;","attribute float a_color;","uniform vec2 u_resolution;","uniform float u_ratio;","uniform float u_nodeRatio;","uniform float u_arrowHead;","uniform float u_scale;","uniform mat3 u_matrix;","uniform mat2 u_matrixHalfPi;","uniform mat2 u_matrixHalfPiMinus;","varying vec4 color;","void main() {","vec2 pos = normalize(a_pos2 - a_pos1);","mat2 matrix = (1.0 - a_head) *","(","a_minus * u_matrixHalfPiMinus +","(1.0 - a_minus) * u_matrixHalfPi",") + a_head * (","a_headPosition * u_matrixHalfPiMinus * 0.6 +","(a_headPosition * a_headPosition - 1.0) * mat2(1.0)",");","pos = a_pos1 + (","(1.0 - a_head) * a_thickness * u_ratio * matrix * pos +","a_head * u_arrowHead * a_thickness * u_ratio * matrix * pos +","a_delay * pos * (","a_tSize / u_nodeRatio +","u_arrowHead * a_thickness * u_ratio",")",");","gl_Position = vec4(","((u_matrix * vec3(pos, 1)).xy /","u_resolution * 2.0 - 1.0) * vec2(1, -1),","0,","1",");","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","void main(void) {","gl_FragColor = color;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.canvas.labels"),sigma.canvas.labels.def=function(a,b,c){var d,e=c("prefix")||"",f=a[e+"size"];f<c("labelThreshold")||"string"==typeof a.label&&(d="fixed"===c("labelSize")?c("defaultLabelSize"):c("labelSizeRatio")*f,b.font=(c("fontStyle")?c("fontStyle")+" ":"")+d+"px "+c("font"),b.fillStyle="node"===c("labelColor")?a.color||c("defaultNodeColor"):c("defaultLabelColor"),b.fillText(a.label,Math.round(a[e+"x"]+f+3),Math.round(a[e+"y"]+d/3)))}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.canvas.hovers"),sigma.canvas.hovers.def=function(a,b,c){var d,e,f,g,h,i=c("hoverFontStyle")||c("fontStyle"),j=c("prefix")||"",k=a[j+"size"],l="fixed"===c("labelSize")?c("defaultLabelSize"):c("labelSizeRatio")*k;b.font=(i?i+" ":"")+l+"px "+(c("hoverFont")||c("font")),b.beginPath(),b.fillStyle="node"===c("labelHoverBGColor")?a.color||c("defaultNodeColor"):c("defaultHoverLabelBGColor"),a.label&&c("labelHoverShadow")&&(b.shadowOffsetX=0,b.shadowOffsetY=0,b.shadowBlur=8,b.shadowColor=c("labelHoverShadowColor")),a.label&&"string"==typeof a.label&&(d=Math.round(a[j+"x"]-l/2-2),e=Math.round(a[j+"y"]-l/2-2),f=Math.round(b.measureText(a.label).width+l/2+k+7),g=Math.round(l+4),h=Math.round(l/2+2),b.moveTo(d,e+h),b.arcTo(d,e,d+h,e,h),b.lineTo(d+f,e),b.lineTo(d+f,e+g),b.lineTo(d+h,e+g),b.arcTo(d,e+g,d,e+g-h,h),b.lineTo(d,e+h),b.closePath(),b.fill(),b.shadowOffsetX=0,b.shadowOffsetY=0,b.shadowBlur=0),c("borderSize")>0&&(b.beginPath(),b.fillStyle="node"===c("nodeBorderColor")?a.color||c("defaultNodeColor"):c("defaultNodeBorderColor"),b.arc(a[j+"x"],a[j+"y"],k+c("borderSize"),0,2*Math.PI,!0),b.closePath(),b.fill());var m=sigma.canvas.nodes[a.type]||sigma.canvas.nodes.def;m(a,b,c),"string"==typeof a.label&&(b.fillStyle="node"===c("labelHoverColor")?a.color||c("defaultNodeColor"):c("defaultLabelHoverColor"),b.fillText(a.label,Math.round(a[j+"x"]+k+3),Math.round(a[j+"y"]+l/3)))}}.call(this),function(){"use strict";sigma.utils.pkg("sigma.canvas.nodes"),sigma.canvas.nodes.def=function(a,b,c){var d=c("prefix")||"";b.fillStyle=a.color||c("defaultNodeColor"),b.beginPath(),b.arc(a[d+"x"],a[d+"y"],a[d+"size"],0,2*Math.PI,!0),b.closePath(),b.fill()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.def=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.curve=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor"),l={},m=b[g+"size"],n=b[g+"x"],o=b[g+"y"],p=c[g+"x"],q=c[g+"y"];if(l=b.id===c.id?sigma.utils.getSelfLoopControlPoints(n,o,m):sigma.utils.getQuadraticControlPoint(n,o,p,q),!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(n,o),b.id===c.id?d.bezierCurveTo(l.x1,l.y1,l.x2,l.y2,p,q):d.quadraticCurveTo(l.x,l.y,p,q),d.stroke()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.arrow=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=e("edgeColor"),i=e("defaultNodeColor"),j=e("defaultEdgeColor"),k=a[g+"size"]||1,l=c[g+"size"],m=b[g+"x"],n=b[g+"y"],o=c[g+"x"],p=c[g+"y"],q=Math.max(2.5*k,e("minArrowSize")),r=Math.sqrt(Math.pow(o-m,2)+Math.pow(p-n,2)),s=m+(o-m)*(r-q-l)/r,t=n+(p-n)*(r-q-l)/r,u=(o-m)*q/r,v=(p-n)*q/r;if(!f)switch(h){case"source":f=b.color||i;break;case"target":f=c.color||i;break;default:f=j}d.strokeStyle=f,d.lineWidth=k,d.beginPath(),d.moveTo(m,n),d.lineTo(s,t),d.stroke(),d.fillStyle=f,d.beginPath(),d.moveTo(s+u,t+v),d.lineTo(s+.6*v,t-.6*u),d.lineTo(s-.6*v,t+.6*u),d.lineTo(s+u,t+v),d.closePath(),d.fill()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.curvedArrow=function(a,b,c,d,e){var f,g,h,i,j,k=a.color,l=e("prefix")||"",m=e("edgeColor"),n=e("defaultNodeColor"),o=e("defaultEdgeColor"),p={},q=a[l+"size"]||1,r=c[l+"size"],s=b[l+"x"],t=b[l+"y"],u=c[l+"x"],v=c[l+"y"],w=Math.max(2.5*q,e("minArrowSize"));if(p=b.id===c.id?sigma.utils.getSelfLoopControlPoints(s,t,r):sigma.utils.getQuadraticControlPoint(s,t,u,v),b.id===c.id?(f=Math.sqrt(Math.pow(u-p.x1,2)+Math.pow(v-p.y1,2)),g=p.x1+(u-p.x1)*(f-w-r)/f,h=p.y1+(v-p.y1)*(f-w-r)/f,i=(u-p.x1)*w/f,j=(v-p.y1)*w/f):(f=Math.sqrt(Math.pow(u-p.x,2)+Math.pow(v-p.y,2)),g=p.x+(u-p.x)*(f-w-r)/f,h=p.y+(v-p.y)*(f-w-r)/f,i=(u-p.x)*w/f,j=(v-p.y)*w/f),!k)switch(m){case"source":k=b.color||n;break;case"target":k=c.color||n;break;default:k=o}d.strokeStyle=k,d.lineWidth=q,d.beginPath(),d.moveTo(s,t),b.id===c.id?d.bezierCurveTo(p.x2,p.y2,p.x1,p.y1,g,h):d.quadraticCurveTo(p.x,p.y,g,h),d.stroke(),d.fillStyle=k,d.beginPath(),d.moveTo(g+i,h+j),d.lineTo(g+.6*j,h-.6*i),d.lineTo(g-.6*j,h+.6*i),d.lineTo(g+i,h+j),d.closePath(),d.fill()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.def=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,h*=e("edgeHoverSizeRatio"),d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.curve=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=e("edgeHoverSizeRatio")*(a[g+"size"]||1),i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor"),l={},m=b[g+"size"],n=b[g+"x"],o=b[g+"y"],p=c[g+"x"],q=c[g+"y"];if(l=b.id===c.id?sigma.utils.getSelfLoopControlPoints(n,o,m):sigma.utils.getQuadraticControlPoint(n,o,p,q),!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(n,o),b.id===c.id?d.bezierCurveTo(l.x1,l.y1,l.x2,l.y2,p,q):d.quadraticCurveTo(l.x,l.y,p,q),d.stroke()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.arrow=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=e("edgeColor"),i=e("defaultNodeColor"),j=e("defaultEdgeColor"),k=a[g+"size"]||1,l=c[g+"size"],m=b[g+"x"],n=b[g+"y"],o=c[g+"x"],p=c[g+"y"];k=a.hover?e("edgeHoverSizeRatio")*k:k;var q=2.5*k,r=Math.sqrt(Math.pow(o-m,2)+Math.pow(p-n,2)),s=m+(o-m)*(r-q-l)/r,t=n+(p-n)*(r-q-l)/r,u=(o-m)*q/r,v=(p-n)*q/r;if(!f)switch(h){case"source":f=b.color||i;break;case"target":f=c.color||i;break;default:f=j}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,d.strokeStyle=f,d.lineWidth=k,d.beginPath(),d.moveTo(m,n),d.lineTo(s,t),d.stroke(),d.fillStyle=f,d.beginPath(),d.moveTo(s+u,t+v),d.lineTo(s+.6*v,t-.6*u),d.lineTo(s-.6*v,t+.6*u),d.lineTo(s+u,t+v),d.closePath(),d.fill()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.curvedArrow=function(a,b,c,d,e){var f,g,h,i,j,k,l=a.color,m=e("prefix")||"",n=e("edgeColor"),o=e("defaultNodeColor"),p=e("defaultEdgeColor"),q={},r=e("edgeHoverSizeRatio")*(a[m+"size"]||1),s=c[m+"size"],t=b[m+"x"],u=b[m+"y"],v=c[m+"x"],w=c[m+"y"];if(q=b.id===c.id?sigma.utils.getSelfLoopControlPoints(t,u,s):sigma.utils.getQuadraticControlPoint(t,u,v,w),b.id===c.id?(f=Math.sqrt(Math.pow(v-q.x1,2)+Math.pow(w-q.y1,2)),g=2.5*r,h=q.x1+(v-q.x1)*(f-g-s)/f,i=q.y1+(w-q.y1)*(f-g-s)/f,j=(v-q.x1)*g/f,k=(w-q.y1)*g/f):(f=Math.sqrt(Math.pow(v-q.x,2)+Math.pow(w-q.y,2)),g=2.5*r,h=q.x+(v-q.x)*(f-g-s)/f,i=q.y+(w-q.y)*(f-g-s)/f,j=(v-q.x)*g/f,k=(w-q.y)*g/f),!l)switch(n){case"source":l=b.color||o;break;case"target":l=c.color||o;break;default:l=p}l="edge"===e("edgeHoverColor")?a.hover_color||l:a.hover_color||e("defaultEdgeHoverColor")||l,d.strokeStyle=l,d.lineWidth=r,d.beginPath(),d.moveTo(t,u),b.id===c.id?d.bezierCurveTo(q.x2,q.y2,q.x1,q.y1,h,i):d.quadraticCurveTo(q.x,q.y,h,i),d.stroke(),d.fillStyle=l,d.beginPath(),d.moveTo(h+j,i+k),d.lineTo(h+.6*k,i-.6*j),d.lineTo(h-.6*k,i+.6*j),d.lineTo(h+j,i+k),d.closePath(),d.fill()}}(),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.canvas.extremities"),sigma.canvas.extremities.def=function(a,b,c,d,e){(sigma.canvas.hovers[b.type]||sigma.canvas.hovers.def)(b,d,e),(sigma.canvas.hovers[c.type]||sigma.canvas.hovers.def)(c,d,e)}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.middlewares"),sigma.utils.pkg("sigma.utils"),sigma.middlewares.rescale=function(a,b,c){var d,e,f,g,h,i,j,k,l=this.graph.nodes(),m=this.graph.edges(),n=this.settings.embedObjects(c||{}),o=n("bounds")||sigma.utils.getBoundaries(this.graph,a,!0),p=o.minX,q=o.minY,r=o.maxX,s=o.maxY,t=o.sizeMax,u=o.weightMax,v=n("width")||1,w=n("height")||1,x=n("autoRescale"),y={nodePosition:1,nodeSize:1,edgeSize:1};for(x instanceof Array||(x=["nodePosition","nodeSize","edgeSize"]),d=0,e=x.length;e>d;d++)if(!y[x[d]])throw new Error('The rescale setting "'+x[d]+'" is not recognized.');var z=~x.indexOf("nodePosition"),A=~x.indexOf("nodeSize"),B=~x.indexOf("edgeSize");for(j="outside"===n("scalingMode")?Math.max(v/Math.max(r-p,1),w/Math.max(s-q,1)):Math.min(v/Math.max(r-p,1),w/Math.max(s-q,1)),k=(n("rescaleIgnoreSize")?0:(n("maxNodeSize")||t)/j)+(n("sideMargin")||0),r+=k,p-=k,s+=k,q-=k,j="outside"===n("scalingMode")?Math.max(v/Math.max(r-p,1),w/Math.max(s-q,1)):Math.min(v/Math.max(r-p,1),w/Math.max(s-q,1)),n("maxNodeSize")||n("minNodeSize")?n("maxNodeSize")===n("minNodeSize")?(f=0,g=+n("maxNodeSize")):(f=(n("maxNodeSize")-n("minNodeSize"))/t,g=+n("minNodeSize")):(f=1,g=0),n("maxEdgeSize")||n("minEdgeSize")?n("maxEdgeSize")===n("minEdgeSize")?(h=0,i=+n("minEdgeSize")):(h=(n("maxEdgeSize")-n("minEdgeSize"))/u,i=+n("minEdgeSize")):(h=1,i=0),d=0,e=m.length;e>d;d++)m[d][b+"size"]=m[d][a+"size"]*(B?h:1)+(B?i:0);for(d=0,e=l.length;e>d;d++)l[d][b+"size"]=l[d][a+"size"]*(A?f:1)+(A?g:0),l[d][b+"x"]=(l[d][a+"x"]-(r+p)/2)*(z?j:1),l[d][b+"y"]=(l[d][a+"y"]-(s+q)/2)*(z?j:1)},sigma.utils.getBoundaries=function(a,b,c){var d,e,f=a.edges(),g=a.nodes(),h=-1/0,i=-1/0,j=1/0,k=1/0,l=-1/0,m=-1/0;if(c)for(d=0,e=f.length;e>d;d++)h=Math.max(f[d][b+"size"],h);for(d=0,e=g.length;e>d;d++)i=Math.max(g[d][b+"size"],i),l=Math.max(g[d][b+"x"],l),j=Math.min(g[d][b+"x"],j),m=Math.max(g[d][b+"y"],m),k=Math.min(g[d][b+"y"],k);return h=h||1,i=i||1,{weightMax:h,sizeMax:i,minX:j,minY:k,maxX:l,maxY:m}}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.middlewares"),sigma.middlewares.copy=function(a,b){var c,d,e;if(b+""!=a+""){for(e=this.graph.nodes(),c=0,d=e.length;d>c;c++)e[c][b+"x"]=e[c][a+"x"],e[c][b+"y"]=e[c][a+"y"],e[c][b+"size"]=e[c][a+"size"];for(e=this.graph.edges(),c=0,d=e.length;d>c;c++)e[c][b+"size"]=e[c][a+"size"]}}}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.misc.animation.running");var b=function(){var a=0;return function(){return""+ ++a}}();sigma.misc.animation.camera=function(c,d,e){if(!(c instanceof sigma.classes.camera&&"object"==typeof d&&d))throw"animation.camera: Wrong arguments.";if("number"!=typeof d.x&&"number"!=typeof d.y&&"number"!=typeof d.ratio&&"number"!=typeof d.angle)throw"There must be at least one valid coordinate in the given val.";var f,g,h,i,j,k,l=e||{},m=sigma.utils.dateNow();return k={x:c.x,y:c.y,ratio:c.ratio,angle:c.angle},j=l.duration,i="function"!=typeof l.easing?sigma.utils.easings[l.easing||"quadraticInOut"]:l.easing,f=function(){var b,e=l.duration?(sigma.utils.dateNow()-m)/l.duration:1;e>=1?(c.isAnimated=!1,c.goTo({x:d.x!==a?d.x:k.x,y:d.y!==a?d.y:k.y,ratio:d.ratio!==a?d.ratio:k.ratio,angle:d.angle!==a?d.angle:k.angle}),cancelAnimationFrame(g),delete sigma.misc.animation.running[g],"function"==typeof l.onComplete&&l.onComplete()):(b=i(e),c.isAnimated=!0,c.goTo({x:d.x!==a?k.x+(d.x-k.x)*b:k.x,y:d.y!==a?k.y+(d.y-k.y)*b:k.y,ratio:d.ratio!==a?k.ratio+(d.ratio-k.ratio)*b:k.ratio,angle:d.angle!==a?k.angle+(d.angle-k.angle)*b:k.angle}),"function"==typeof l.onNewFrame&&l.onNewFrame(),h.frameId=requestAnimationFrame(f))},g=b(),h={frameId:requestAnimationFrame(f),target:c,type:"camera",options:l,fn:f},sigma.misc.animation.running[g]=h,g},sigma.misc.animation.kill=function(a){if(1!==arguments.length||"number"!=typeof a)throw"animation.kill: Wrong arguments.";var b=sigma.misc.animation.running[a];return b&&(cancelAnimationFrame(a),delete sigma.misc.animation.running[b.frameId],"camera"===b.type&&(b.target.isAnimated=!1),"function"==typeof(b.options||{}).onComplete&&b.options.onComplete()),this},sigma.misc.animation.killAll=function(a){var b,c,d=0,e="string"==typeof a?a:null,f="object"==typeof a?a:null,g=sigma.misc.animation.running;for(c in g)e&&g[c].type!==e||f&&g[c].target!==f||(b=sigma.misc.animation.running[c],cancelAnimationFrame(b.frameId),delete sigma.misc.animation.running[c],"camera"===b.type&&(b.target.isAnimated=!1),d++,"function"==typeof(b.options||{}).onComplete&&b.options.onComplete());return d},sigma.misc.animation.has=function(a){var b,c="string"==typeof a?a:null,d="object"==typeof a?a:null,e=sigma.misc.animation.running;for(b in e)if(!(c&&e[b].type!==c||d&&e[b].target!==d))return!0;return!1}}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.misc"),sigma.misc.bindEvents=function(b){function c(a){a&&(h="x"in a.data?a.data.x:h,i="y"in a.data?a.data.y:i);var c,d,e,f,g,k,l,m,n=[],o=h+j.width/2,p=i+j.height/2,q=j.camera.cameraPosition(h,i),r=j.camera.quadtree.point(q.x,q.y);if(r.length)for(c=0,e=r.length;e>c;c++)if(f=r[c],g=f[b+"x"],k=f[b+"y"],l=f[b+"size"],!f.hidden&&o>g-l&&g+l>o&&p>k-l&&k+l>p&&Math.sqrt(Math.pow(o-g,2)+Math.pow(p-k,2))<l){for(m=!1,d=0;d<n.length;d++)if(f.size>n[d].size){n.splice(d,0,f),m=!0;break}m||n.push(f)}return n}function d(c){function d(a,b){for(r=!1,g=0;g<a.length;g++)if(b.size>a[g].size){a.splice(g,0,b),r=!0;break}r||a.push(b)}if(!j.settings("enableEdgeHovering"))return[];var e=sigma.renderers.canvas&&j instanceof sigma.renderers.canvas;if(!e)throw new Error("The edge events feature is not compatible with the WebGL renderer");c&&(h="x"in c.data?c.data.x:h,i="y"in c.data?c.data.y:i);var f,g,k,l,m,n,o,p,q,r,s=j.settings("edgeHoverPrecision"),t={},u=[],v=h+j.width/2,w=i+j.height/2,x=j.camera.cameraPosition(h,i),y=[];if(e){var z=j.camera.quadtree.area(j.camera.getRectangle(j.width,j.height));for(l=z,f=0,k=l.length;k>f;f++)t[l[f].id]=l[f]}if(j.camera.edgequadtree!==a&&(y=j.camera.edgequadtree.point(x.x,x.y)),y.length)for(f=0,k=y.length;k>f;f++)m=y[f],o=j.graph.nodes(m.source),p=j.graph.nodes(m.target),n=m[b+"size"]||m["read_"+b+"size"],!m.hidden&&!o.hidden&&!p.hidden&&(!e||t[m.source]||t[m.target])&&sigma.utils.getDistance(o[b+"x"],o[b+"y"],v,w)>o[b+"size"]&&sigma.utils.getDistance(p[b+"x"],p[b+"y"],v,w)>p[b+"size"]&&("curve"==m.type||"curvedArrow"==m.type?o.id===p.id?(q=sigma.utils.getSelfLoopControlPoints(o[b+"x"],o[b+"y"],o[b+"size"]),sigma.utils.isPointOnBezierCurve(v,w,o[b+"x"],o[b+"y"],p[b+"x"],p[b+"y"],q.x1,q.y1,q.x2,q.y2,Math.max(n,s))&&d(u,m)):(q=sigma.utils.getQuadraticControlPoint(o[b+"x"],o[b+"y"],p[b+"x"],p[b+"y"]),sigma.utils.isPointOnQuadraticCurve(v,w,o[b+"x"],o[b+"y"],p[b+"x"],p[b+"y"],q.x,q.y,Math.max(n,s))&&d(u,m)):sigma.utils.isPointOnSegment(v,w,o[b+"x"],o[b+"y"],p[b+"x"],p[b+"y"],Math.max(n,s))&&d(u,m));return u}function e(a){function b(a){j.settings("eventsEnabled")&&(j.dispatchEvent("click",a.data),i=c(a),k=d(a),i.length?(j.dispatchEvent("clickNode",{node:i[0],captor:a.data}),j.dispatchEvent("clickNodes",{node:i,captor:a.data})):k.length?(j.dispatchEvent("clickEdge",{edge:k[0],captor:a.data}),j.dispatchEvent("clickEdges",{edge:k,captor:a.data})):j.dispatchEvent("clickStage",{captor:a.data}))}function e(a){j.settings("eventsEnabled")&&(j.dispatchEvent("doubleClick",a.data),i=c(a),k=d(a),i.length?(j.dispatchEvent("doubleClickNode",{node:i[0],captor:a.data}),j.dispatchEvent("doubleClickNodes",{node:i,captor:a.data})):k.length?(j.dispatchEvent("doubleClickEdge",{
edge:k[0],captor:a.data}),j.dispatchEvent("doubleClickEdges",{edge:k,captor:a.data})):j.dispatchEvent("doubleClickStage",{captor:a.data}))}function f(a){j.settings("eventsEnabled")&&(j.dispatchEvent("rightClick",a.data),i.length?(j.dispatchEvent("rightClickNode",{node:i[0],captor:a.data}),j.dispatchEvent("rightClickNodes",{node:i,captor:a.data})):k.length?(j.dispatchEvent("rightClickEdge",{edge:k[0],captor:a.data}),j.dispatchEvent("rightClickEdges",{edge:k,captor:a.data})):j.dispatchEvent("rightClickStage",{captor:a.data}))}function g(a){if(j.settings("eventsEnabled")){var b,c,d,e,f=[],g=[];for(b in l)f.push(l[b]);for(l={},c=0,d=f.length;d>c;c++)j.dispatchEvent("outNode",{node:f[c],captor:a.data});for(f.length&&j.dispatchEvent("outNodes",{nodes:f,captor:a.data}),m={},c=0,d=g.length;e>c;c++)j.dispatchEvent("outEdge",{edge:g[c],captor:a.data});f.length&&j.dispatchEvent("outEdges",{edges:g,captor:a.data})}}function h(a){if(j.settings("eventsEnabled")){i=c(a),k=d(a);var b,e,f,g,h=[],n=[],o={},p=i.length,q=[],r=[],s={},t=k.length;for(b=0;p>b;b++)f=i[b],o[f.id]=f,l[f.id]||(n.push(f),l[f.id]=f);for(e in l)o[e]||(h.push(l[e]),delete l[e]);for(b=0,p=n.length;p>b;b++)j.dispatchEvent("overNode",{node:n[b],captor:a.data});for(b=0,p=h.length;p>b;b++)j.dispatchEvent("outNode",{node:h[b],captor:a.data});for(n.length&&j.dispatchEvent("overNodes",{nodes:n,captor:a.data}),h.length&&j.dispatchEvent("outNodes",{nodes:h,captor:a.data}),b=0;t>b;b++)g=k[b],s[g.id]=g,m[g.id]||(r.push(g),m[g.id]=g);for(e in m)s[e]||(q.push(m[e]),delete m[e]);for(b=0,t=r.length;t>b;b++)j.dispatchEvent("overEdge",{edge:r[b],captor:a.data});for(b=0,t=q.length;t>b;b++)j.dispatchEvent("outEdge",{edge:q[b],captor:a.data});r.length&&j.dispatchEvent("overEdges",{edges:r,captor:a.data}),q.length&&j.dispatchEvent("outEdges",{edges:q,captor:a.data})}}var i,k,l={},m={};a.bind("click",b),a.bind("mousedown",h),a.bind("mouseup",h),a.bind("mousemove",h),a.bind("mouseout",g),a.bind("doubleclick",e),a.bind("rightclick",f),j.bind("render",h)}var f,g,h,i,j=this;for(f=0,g=this.captors.length;g>f;f++)e(this.captors[f])}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.misc"),sigma.misc.drawHovers=function(a){function b(){c.contexts.hover.canvas.width=c.contexts.hover.canvas.width;var b,f,g,h,i,j=c.settings("defaultNodeType"),k=c.settings("defaultEdgeType"),l=sigma.canvas.hovers,m=sigma.canvas.edgehovers,n=sigma.canvas.extremities,o=c.settings.embedObjects({prefix:a});if(o("enableHovering")&&o("singleHover")&&Object.keys(d).length&&(h=d[Object.keys(d)[0]],(l[h.type]||l[j]||l.def)(h,c.contexts.hover,o)),o("enableHovering")&&!o("singleHover"))for(b in d)(l[d[b].type]||l[j]||l.def)(d[b],c.contexts.hover,o);if(o("enableEdgeHovering")&&o("singleHover")&&Object.keys(e).length&&(i=e[Object.keys(e)[0]],f=c.graph.nodes(i.source),g=c.graph.nodes(i.target),i.hidden||((m[i.type]||m[k]||m.def)(i,f,g,c.contexts.hover,o),o("edgeHoverExtremities")?(n[i.type]||n.def)(i,f,g,c.contexts.hover,o):((sigma.canvas.nodes[f.type]||sigma.canvas.nodes.def)(f,c.contexts.hover,o),(sigma.canvas.nodes[g.type]||sigma.canvas.nodes.def)(g,c.contexts.hover,o)))),o("enableEdgeHovering")&&!o("singleHover"))for(b in e)i=e[b],f=c.graph.nodes(i.source),g=c.graph.nodes(i.target),i.hidden||((m[i.type]||m[k]||m.def)(i,f,g,c.contexts.hover,o),o("edgeHoverExtremities")?(n[i.type]||n.def)(i,f,g,c.contexts.hover,o):((sigma.canvas.nodes[f.type]||sigma.canvas.nodes.def)(f,c.contexts.hover,o),(sigma.canvas.nodes[g.type]||sigma.canvas.nodes.def)(g,c.contexts.hover,o)))}var c=this,d={},e={};this.bind("overNode",function(a){var c=a.data.node;c.hidden||(d[c.id]=c,b())}),this.bind("outNode",function(a){delete d[a.data.node.id],b()}),this.bind("overEdge",function(a){var c=a.data.edge;c.hidden||(e[c.id]=c,b())}),this.bind("outEdge",function(a){delete e[a.data.edge.id],b()}),this.bind("render",function(){b()})}}.call(this),!function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.dashed=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,h*=e("edgeHoverSizeRatio"),d.save(),d.setLineDash([8,3]),d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.dotted=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,h*=e("edgeHoverSizeRatio"),d.save(),d.setLineDash([2]),d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.parallel=function(a,b,c,d,e){var f,g,h=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,i=e("prefix")||"",j=a[i+"size"]||1,k=e("edgeColor"),l=e("defaultNodeColor"),m=e("defaultEdgeColor"),n=b[i+"x"],o=b[i+"y"],p=c[i+"x"],q=c[i+"y"],r=sigma.utils.getDistance(n,o,p,q);if(!h)switch(k){case"source":h=b.color||l;break;case"target":h=c.color||l;break;default:h=m}h="edge"===e("edgeHoverColor")?a.hover_color||h:a.hover_color||e("defaultEdgeHoverColor")||h,j*=e("edgeHoverSizeRatio"),f=sigma.utils.getCircleIntersection(n,o,j,p,q,r),g=sigma.utils.getCircleIntersection(p,q,j,n,o,r),d.save(),d.strokeStyle=h,d.lineWidth=j,d.beginPath(),d.moveTo(f.xi,f.yi),d.lineTo(g.xi_prime,g.yi_prime),d.closePath(),d.stroke(),d.beginPath(),d.moveTo(f.xi_prime,f.yi_prime),d.lineTo(g.xi,g.yi),d.closePath(),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.tapered=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),g=e("prefix")||"",j=e("defaultNodeColor"),k=e("defaultEdgeColor"),l=b[g+"x"],m=b[g+"y"],n=c[g+"x"],o=c[g+"y"],p=sigma.utils.getDistance(l,m,n,o);if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,h*=e("edgeHoverSizeRatio");var q=sigma.utils.getCircleIntersection(l,m,h,n,o,p);d.save(),d.globalAlpha=.65,d.fillStyle=f,d.beginPath(),d.moveTo(n,o),d.lineTo(q.xi,q.yi),d.lineTo(q.xi_prime,q.yi_prime),d.closePath(),d.fill(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.dashed=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}d.save(),d.strokeStyle=a.active?"edge"===e("edgeActiveColor")?f||k:e("defaultEdgeActiveColor"):f,d.setLineDash([8,3]),d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.dotted=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}d.save(),d.strokeStyle=a.active?"edge"===e("edgeActiveColor")?f||k:e("defaultEdgeActiveColor"):f,d.setLineDash([2]),d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.parallel=function(a,b,c,d,e){var f,g,h=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,i=e("prefix")||"",j=a[i+"size"]||1,k=e("edgeColor"),l=e("defaultNodeColor"),m=e("defaultEdgeColor"),n=b[i+"x"],o=b[i+"y"],p=c[i+"x"],q=c[i+"y"],r=sigma.utils.getDistance(n,o,p,q);if(!h)switch(k){case"source":h=b.color||l;break;case"target":h=c.color||l;break;default:h=m}f=sigma.utils.getCircleIntersection(n,o,j,p,q,r),g=sigma.utils.getCircleIntersection(p,q,j,n,o,r),d.save(),d.strokeStyle=a.active?"edge"===e("edgeActiveColor")?h||m:e("defaultEdgeActiveColor"):h,d.lineWidth=j,d.beginPath(),d.moveTo(f.xi,f.yi),d.lineTo(g.xi_prime,g.yi_prime),d.closePath(),d.stroke(),d.beginPath(),d.moveTo(f.xi_prime,f.yi_prime),d.lineTo(g.xi,g.yi),d.closePath(),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.tapered=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),g=e("prefix")||"",j=e("defaultNodeColor"),k=e("defaultEdgeColor"),l=b[g+"x"],m=b[g+"y"],n=c[g+"x"],o=c[g+"y"],p=sigma.utils.getDistance(l,m,n,o);if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}var q=sigma.utils.getCircleIntersection(l,m,h,n,o,p);d.save(),d.fillStyle=a.active?"edge"===e("edgeActiveColor")?f||k:e("defaultEdgeActiveColor"):f,d.globalAlpha=.65,d.beginPath(),d.moveTo(n,o),d.lineTo(q.xi,q.yi),d.lineTo(q.xi_prime,q.yi_prime),d.closePath(),d.fill(),d.restore()}}(),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.parsers"),sigma.utils.pkg("sigma.utils"),sigma.utils.xhr=function(){if(window.XMLHttpRequest)return new XMLHttpRequest;var a,b;if(window.ActiveXObject){a=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];for(b in a)try{return new ActiveXObject(a[b])}catch(c){}}return null},sigma.parsers.json=function(a,b,c){var d,e=sigma.utils.xhr();if(!e)throw"XMLHttpRequest not supported, cannot load the file.";e.open("GET",a,!0),e.onreadystatechange=function(){4===e.readyState&&(d=JSON.parse(e.responseText),b instanceof sigma?(b.graph.clear(),b.graph.read(d)):"object"==typeof b?(b.graph=d,b=new sigma(b)):"function"==typeof b&&(c=b,b=null),c&&c(b||d))},e.send()}}.call(this),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.4",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in").attr("aria-hidden",!1),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a('<div class="modal-backdrop '+e+'" />').appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),window.CWN||(window.CWN={}),CWN.colors={base:"#ffffca",lightGrey:"#7b7b79",green:"#8fd248",salmon:"#ffcd96",lightBlue:"#91cbdd",red:"#ff0800",blue:"#4f7fbf",purple:"#7228a2",black:"#000000"},CWN.render={},CWN.icon=function(a,b,c){var d=document.createElement("canvas");if(d.width=b,d.height=c,!CWN.render[a])return d;var e=d.getContext("2d");return CWN.render[a](e,2,2,b-4,c-4),d},CWN.render.Junction=function(a,b,c,d,e){a.fillStyle=CWN.colors.base,a.strokeStyle=CWN.colors.lightGrey,a.lineWidth=1;var f=d/2;a.beginPath(),a.arc(b+f,c+f,f,0,2*Math.PI,!0),a.closePath(),a.fill(),a.stroke()},CWN.render["Power Plant"]=function(a,b,c,d,e){CWN.render.Junction(a,b,c,d,e);var f=d/2;a.beginPath(),a.moveTo(b,c+f),a.lineTo(b+d,c+f),a.stroke(),a.closePath(),a.beginPath(),a.moveTo(b+f,c),a.lineTo(b+f,c+d),a.stroke(),a.closePath()},CWN.render["Pump Plant"]=function(a,b,c,d,e){CWN.render.Junction(a,b,c,d,e);var f=d/2,g=b+f,h=c+f,i=g+f*Math.cos(Math.PI/4),j=h+f*Math.sin(Math.PI/4),k=g+f*Math.cos(Math.PI*(5/4)),l=h+f*Math.sin(Math.PI*(5/4));a.beginPath(),a.moveTo(i,j),a.lineTo(k,l),a.stroke(),a.closePath(),i=g+f*Math.cos(.75*Math.PI),j=h+f*Math.sin(.75*Math.PI),k=g+f*Math.cos(Math.PI*(7/4)),l=h+f*Math.sin(Math.PI*(7/4)),a.beginPath(),a.moveTo(i,j),a.lineTo(k,l),a.stroke(),a.closePath()},CWN.render["Water Treatment"]=function(a,b,c,d,e){a.fillStyle=CWN.colors.base,a.strokeStyle=CWN.colors.lightGrey,a.lineWidth=1,CWN.render._nSidedPath(a,b,c,d/2,8,22.5),a.fill(),a.closePath(),a.stroke()},CWN.render["Surface Storage"]=function(a,b,c,d,e){a.fillStyle=CWN.colors.base,a.strokeStyle=CWN.colors.lightGrey,a.lineWidth=1,CWN.render._nSidedPath(a,b,c,d/2,3,90),a.fill(),a.closePath(),a.stroke()},CWN.render["Groundwater Storage"]=function(a,b,c,d,e){var f=d/2,g=a.createLinearGradient(b+f,c,b+f,c+e-.25*e);g.addColorStop(0,CWN.colors.lightGrey),g.addColorStop(1,CWN.colors.base),a.fillStyle=g,a.strokeStyle=CWN.colors.lightGrey,a.lineWidth=1,CWN.render._nSidedPath(a,b,c,f,3,90),a.fill(),a.closePath(),a.stroke()},CWN.render.Sink=function(a,b,c,d,e){a.fillStyle=CWN.colors.base,a.strokeStyle=CWN.colors.lightGrey,a.lineWidth=1,CWN.render._nSidedPath(a,b,c,d/2,4,45),a.fill(),a.closePath(),a.stroke()},CWN.render["Non-Standard Demand"]=function(a,b,c,d,e){a.fillStyle=CWN.colors.red,a.strokeStyle=CWN.colors.lightGrey,a.lineWidth=1,CWN.render._nSidedPath(a,b,c,d/2,4,45),a.fill(),a.closePath(),a.stroke()},CWN.render["Agricultural Demand"]=function(a,b,c,d,e){CWN.render._oval(a,b,c,d,e,CWN.colors.lightBlue)},CWN.render["Urban Demand"]=function(a,b,c,d,e){CWN.render._oval(a,b,c,d,e,CWN.colors.salmon)},CWN.render.Wetland=function(a,b,c,d,e){CWN.render._oval(a,b,c,d,e,CWN.colors.green)},CWN.render._oval=function(a,b,c,d,e,f){a.fillStyle=f,e-=.5*d,c+=e/2;var g=.5522848,h=d/2*g,i=e/2*g,j=b+d,k=c+e,l=b+d/2,m=c+e/2;a.beginPath(),a.moveTo(b,m),a.bezierCurveTo(b,m-i,l-h,c,l,c),a.bezierCurveTo(l+h,c,j,m-i,j,m),a.bezierCurveTo(j,m+i,l+h,k,l,k),a.bezierCurveTo(l-h,k,b,m+i,b,m),a.fill(),a.stroke()},CWN.render._nSidedPath=function(a,b,c,d,e,f){b+=d,c+=d;var g,h,i=2*Math.PI/e,j=f*(Math.PI/180);a.beginPath();var k=b+d*Math.cos(-1*j),l=c+d*Math.sin(-1*j);a.moveTo(k,l);for(var m=1;e>m;m++)g=b+d*Math.cos(i*m-j),h=c+d*Math.sin(i*m-j),a.lineTo(g,h);a.lineTo(k,l)},CWN.render.lineMarkers={cost:function(a,b,c,d){a.beginPath(),a.arc(b,c,d,0,2*Math.PI,!1),a.fillStyle=CWN.colors.green,a.fill(),a.closePath()},amplitude:function(a,b,c,d){a.beginPath(),a.arc(b,c,d,0,2*Math.PI,!1),a.lineWidth=2,a.strokeStyle=CWN.colors.black,a.stroke(),a.closePath()},constraints:function(a,b,c,d,e,f){a.beginPath();var g=.4*e,h=.4*f;a.beginPath(),a.moveTo(b+f+g,c-e+h),a.lineTo(b+f-g,c-e-h),a.lineTo(b-f-g,c+e-h),a.lineTo(b-f+g,c+e+h),a.lineTo(b+f+g,c-e+h),a.strokeStyle=CWN.colors.black,a.stroke(),a.closePath()},environmental:function(a,b,c,d){a.beginPath(),a.arc(b,c,d,0,2*Math.PI,!1),a.lineWidth=2,a.strokeStyle=CWN.colors.green,a.stroke(),a.closePath()}},function(){"use strict";sigma.utils.pkg("sigma.canvas.nodes"),sigma.canvas.nodes.Junction=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render.Junction(b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Power Plant"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Power Plant"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Pump Plant"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Pump Plant"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Water Treatment"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Water Treatment"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Surface Storage"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Surface Storage"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Groundwater Storage"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Groundwater Storage"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Agricultural Demand"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Agricultural Demand"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Urban Demand"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Urban Demand"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes.Sink=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render.Sink(b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Non-Standard Demand"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Non-Standard Demand"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes.Wetland=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render.Wetland(b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.cwn=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=(e("edgeColor"),e("defaultNodeColor"),e("defaultEdgeColor"),a[g+"size"]||1),i=c[g+"size"],j=b[g+"x"],k=b[g+"y"],l=c[g+"x"],m=c[g+"y"],n=Math.max(2.5*h,e("minArrowSize")),o=Math.sqrt(Math.pow(l-j,2)+Math.pow(m-k,2)),p=j+(l-j)*(o-n-i)/o,q=k+(m-k)*(o-n-i)/o,r=(l-j)*n/o,s=(m-k)*n/o,f=CWN.colors.salmon;a.calvin.renderInfo&&("flowToSink"==a.calvin.renderInfo.type?f=CWN.colors.lightGrey:"returnFlowFromDemand"==a.calvin.renderInfo.type?f=CWN.colors.red:"gwToDemand"==a.calvin.renderInfo.type?f=CWN.colors.black:"artificalRecharge"==a.calvin.renderInfo.type&&(f=CWN.colors.purple)),d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(j,k),d.lineTo(p,q),d.stroke(),d.fillStyle=f,d.beginPath(),d.moveTo(p+r,q+s),d.lineTo(p+.6*s,q-.6*r),d.lineTo(p-.6*s,q+.6*r),d.lineTo(p+r,q+s),d.closePath(),d.fill();var t=j+3*r,u=k+3*s;if(a.calvin.renderInfo)for(var v in CWN.render.lineMarkers)a.calvin.renderInfo[v]&&(CWN.render.lineMarkers[v](d,t,u,4,r,s),t+=1.75*r,u+=1.75*s)}}();;


  Polymer = {
    Settings: (function() {
      // NOTE: Users must currently opt into using ShadowDOM. They do so by doing:
      // Polymer = {dom: 'shadow'};
      // TODO(sorvell): Decide if this should be auto-use when available.
      // TODO(sorvell): if SD is auto-use, then the flag above should be something
      // like: Polymer = {dom: 'shady'}
      
      // via Polymer object
      var user = window.Polymer || {};

      // via url
      location.search.slice(1).split('&').forEach(function(o) {
        o = o.split('=');
        o[0] && (user[o[0]] = o[1] || true);
      });

      var wantShadow = (user.dom === 'shadow');
      var hasShadow = Boolean(Element.prototype.createShadowRoot);
      var nativeShadow = hasShadow && !window.ShadowDOMPolyfill;
      var useShadow = wantShadow && hasShadow;

      var hasNativeImports = Boolean('import' in document.createElement('link'));
      var useNativeImports = hasNativeImports;

      var useNativeCustomElements = (!window.CustomElements ||
        window.CustomElements.useNative);

      return {
        wantShadow: wantShadow,
        hasShadow: hasShadow,
        nativeShadow: nativeShadow,
        useShadow: useShadow,
        useNativeShadow: useShadow && nativeShadow,
        useNativeImports: useNativeImports,
        useNativeCustomElements: useNativeCustomElements
      };
    })()
  };

;


  // until ES6 modules become standard, we follow Occam and simply stake out 
  // a global namespace

  // Polymer is a Function, but of course this is also an Object, so we 
  // hang various other objects off of Polymer.*
  (function() {
    var userPolymer = window.Polymer;
    
    window.Polymer = function(prototype) {
      var ctor = desugar(prototype);
      // native Custom Elements treats 'undefined' extends property
      // as valued, the property must not exist to be ignored
      var options = {
        prototype: ctor.prototype
      };
      if (prototype.extends) {
        options.extends = prototype.extends;
      }
      Polymer.telemetry._registrate(prototype);
      document.registerElement(prototype.is, options);
      return ctor;
    };

    var desugar = function(prototype) {
      prototype = Polymer.Base.chainObject(prototype, Polymer.Base);
      prototype.registerCallback();
      return prototype.constructor;
    };

    window.Polymer = Polymer;

    if (userPolymer) {
      for (var i in userPolymer) {
        Polymer[i] = userPolymer[i];
      }
    }

    Polymer.Class = desugar;

  })();
  /*
  // Raw usage
  [ctor =] Polymer.Class(prototype);
  document.registerElement(name, ctor);
  
  // Simplified usage
  [ctor = ] Polymer(prototype);
  */

  // telemetry: statistics, logging, and debug

  Polymer.telemetry = {
    registrations: [],
    _regLog: function(prototype) {
      console.log('[' + prototype.is + ']: registered')
    },
    _registrate: function(prototype) {
      this.registrations.push(prototype);
      Polymer.log && this._regLog(prototype);
    },
    dumpRegistrations: function() {
      this.registrations.forEach(this._regLog);
    }
  };

;


  // a tiny bit of sugar for `document.currentScript.ownerDocument`
  Object.defineProperty(window, 'currentImport', {
    enumerable: true,
    configurable: true,
    get: function() {
      return (document._currentScript || document.currentScript).ownerDocument;
    }
  });

;


  Polymer.Base = {

    // (semi-)pluggable features for Base
    addFeature: function(feature) {
      this.extend(this, feature);
    },

    registerCallback: function() {
      this.registerFeatures();  // abstract
      this.registered();
    },

    registered: function() {
      // for overriding
      // `this` context is a prototype, not an instance
    },

    createdCallback: function() {
      Polymer.telemetry.instanceCount++;
      this.root = this;
      this.beforeCreated();
      this.created();
      this.afterCreated();
      this.initFeatures(); // abstract
    },

    beforeCreated: function() {
      // for overriding
    },

    created: function() {
      // for overriding
    },

    afterCreated: function() {
      // for overriding
    },

    attachedCallback: function() {
      this.isAttached = true;
      // reserved for canonical behavior
      this.attached();
    },

    attached: function() {
      // for overriding
    },

    detachedCallback: function() {
      this.isAttached = false;
      // reserved for canonical behavior
      this.detached();
    },

    detached: function() {
      // for overriding
    },

    attributeChangedCallback: function(name) {
      this.setAttributeToProperty(this, name);
      // reserved for canonical behavior
      this.attributeChanged.apply(this, arguments);
    },

    attributeChanged: function() {
      // for overriding
    },

    // copy own properties from `api` to `prototype`
    extend: function(prototype, api) {
      if (prototype && api) {
        Object.getOwnPropertyNames(api).forEach(function(n) {
          var pd = Object.getOwnPropertyDescriptor(api, n);
          if (pd) {
            Object.defineProperty(prototype, n, pd);
          }
        });
      }
      return prototype || api;
    }

  };

  if (Object.__proto__) {
    Polymer.Base.chainObject = function(object, inherited) {
      if (object && inherited && object !== inherited) {
        object.__proto__ = inherited;
      }
      return object;
    };
  } else {
    Polymer.Base.chainObject = function(object, inherited) {
      if (object && inherited && object !== inherited) {
        var chained = Object.create(inherited);
        object = Polymer.Base.extend(chained, object);
      }
      return object;
    };
  }

  Polymer.Base = Polymer.Base.chainObject(Polymer.Base, HTMLElement.prototype);

  // TODO(sjmiles): ad hoc telemetry
  Polymer.telemetry.instanceCount = 0;

;


(function() {

  var modules = {};

  var DomModule = function() {
    return document.createElement('dom-module');
  };

  DomModule.prototype = Object.create(HTMLElement.prototype);

  DomModule.prototype.constructor = DomModule;

  DomModule.prototype.createdCallback = function() {
    var id = this.id || this.getAttribute('name') || this.getAttribute('is');
    if (id) {
      this.id = id;
      modules[id] = this;
    }
  };

  DomModule.prototype.import = function(id, slctr) {
    var m = modules[id];
    if (!m) {
      // If polyfilling, a script can run before a dom-module element
      // is upgraded. We force the containing document to upgrade
      // and try again to workaround this polyfill limitation.
      forceDocumentUpgrade();
      m = modules[id];
    }
    if (m && slctr) {
      m = m.querySelector(slctr);
    }
    return m;
  };

  // NOTE: HTMLImports polyfill does not
  // block scripts on upgrading elements. However, we want to ensure that
  // any dom-module in the tree is available prior to a subsequent script
  // processing.
  // Therefore, we force any dom-modules in the tree to upgrade when dom-module
  // is registered by temporarily setting CE polyfill to crawl the entire
  // imports tree. (Note: this should only upgrade any imports that have been
  // loaded by this point. In addition the HTMLImports polyfill should be
  // changed to upgrade elements prior to running any scripts.)
  var cePolyfill = window.CustomElements && !CustomElements.useNative;
  if (cePolyfill) {
    var ready = CustomElements.ready;
    CustomElements.ready = true;
  }
  document.registerElement('dom-module', DomModule);
  if (cePolyfill) {
    CustomElements.ready = ready;
  }

  function forceDocumentUpgrade() {
    if (cePolyfill) {
      var script = document._currentScript || document.currentScript;
      if (script) {
        CustomElements.upgradeAll(script.ownerDocument);
      }
    }
  }

})();

;


  /**
   * Automatically extend using objects referenced in `mixins` array. 
   * 
   *     Polymer({
   *     
   *       mixins: [
   *         someMixinObject
   *       ]
   *     
   *       ...
   *     
   *     });
   * 
   * @class base feature: mixins
   */

  Polymer.Base.addFeature({

    _prepMixins: function() {
      if (this.mixins) {
        this.mixins.forEach(function(m) {
          Polymer.Base.extend(this, m);
        }, this);
      }
    }

  });

;


  /**
   * Support `extends` property (for type-extension only).
   *
   * If the mixin is String-valued, the corresponding Polymer module
   * is mixed in.
   *
   *     Polymer({
   *       is: 'pro-input',
   *       extends: 'input',
   *       ...
   *     });
   * 
   * Type-extension objects are created using `is` notation in HTML, or via
   * the secondary argument to `document.createElement` (the type-extension
   * rules are part of the Custom Elements specification, not something 
   * created by Polymer). 
   * 
   * Example:
   * 
   *     <!-- right: creates a pro-input element -->
   *     <input is="pro-input">
   *   
   *     <!-- wrong: creates an unknown element -->
   *     <pro-input>  
   * 
   *     <script>
   *        // right: creates a pro-input element
   *        var elt = document.createElement('input', 'pro-input');
   * 
   *        // wrong: creates an unknown element
   *        var elt = document.createElement('pro-input');
   *     <\script>
   *
   *   @class base feature: extends
   */

  Polymer.Base.addFeature({

    _prepExtends: function() {
      if (this.extends) {
        this.__proto__ = this.getExtendedPrototype(this.extends);
      }
    },

    getExtendedPrototype: function(tag) {
      return this.getExtendedNativePrototype(tag);
    },

    nativePrototypes: {}, // static

    getExtendedNativePrototype: function(tag) {
      var p = this.nativePrototypes[tag];
      if (!p) {
        var np = this.getNativePrototype(tag);
        p = this.extend(Object.create(np), Polymer.Base);
        this.nativePrototypes[tag] = p;
      }
      return p;
    },

    getNativePrototype: function(tag) {
      // TODO(sjmiles): sad necessity
      return Object.getPrototypeOf(document.createElement(tag));
    }

  });

;


  /**
   * Generates a boilerplate constructor.
   * 
   *     XFoo = Polymer({
   *       is: 'x-foo'
   *     });
   *     ASSERT(new XFoo() instanceof XFoo);
   *  
   * You can supply a custom constructor on the prototype. But remember that 
   * this constructor will only run if invoked **manually**. Elements created
   * via `document.createElement` or from HTML _will not invoke this method_.
   * 
   * Instead, we reuse the concept of `constructor` for a factory method which 
   * can take arguments. 
   * 
   *     MyFoo = Polymer({
   *       is: 'my-foo',
   *       constructor: function(foo) {
   *         this.foo = foo;
   *       }
   *       ...
   *     });
   * 
   * @class base feature: constructor
   */

  Polymer.Base.addFeature({

    // registration-time

    _prepConstructor: function() {
      // capture user-supplied `constructor`
      if (this.hasOwnProperty('constructor')) {
        this._userConstructor = this.constructor;
      }
      // support both possible `createElement` signatures
      this._factoryArgs = this.extends ? [this.extends, this.is] : [this.is];
      // thunk the constructor to delegate allocation to `createElement`
      var ctor = function() { 
        return this._factory(arguments); 
      };
      if (this.hasOwnProperty('extends')) {
        ctor.extends = this.extends; 
      }
      // ensure constructor is set. The `constructor` property is
      // not writable on Safari; note: Chrome requires the property
      // to be configurable.
      Object.defineProperty(this, 'constructor', {value: ctor, 
        writable: true, configurable: true});
      ctor.prototype = this;
    },

    _factory: function(args) {
      var elt = document.createElement.apply(document, this._factoryArgs);
      if (this._userConstructor) {
        this._userConstructor.apply(elt, args);
      }
      return elt;
    }

  });

;


  /**
   * Define property metadata.
   *
   *     properties: {
   *       <property>: <Type || Object>,
   *       ...
   *     }
   * 
   * Example:
   * 
   *     properties: {
   *       // `foo` property can be assigned via attribute, will be deserialized to
   *       // the specified data-type. All `properties` properties have this behavior.
   *       foo: String,
   *
   *       // `bar` property has additional behavior specifiers.
   *       //   type: as above, type for (de-)serialization
   *       //   notify: true to send a signal when a value is set to this property
   *       //   reflectToAttribute: true to serialize the property to an attribute
   *       //   readOnly: if true, the property has no setter
   *       bar: {
   *         type: Boolean,
   *         notify: true
   *       }
   *     }
   *
   * By itself the properties feature doesn't do anything but provide property
   * information. Other features use this information to control behavior.
   *
   * The `type` information is used by the `attributes` feature to convert
   * String values in attributes to typed properties. The `bind` feature uses 
   * property information to control property access.
   *
   * Marking a property as `notify` causes a change in the property to
   * fire a non-bubbling event called `<property>-changed`. Elements that
   * have enabled two-way binding to the property use this event to
   * observe changes.
   *
   * `readOnly` properties have a getter, but no setter. To set a read-only
   * property, use the private setter method `_set_<property>(value)`.
   *
   * @class base feature: properties
   */

  // null object
  Polymer.nob = Object.create(null);
  
  Polymer.Base.addFeature({

    properties: {
    },

    getPropertyInfo: function(property) {
      return this._getPropertyInfo(property, this.properties);
    },

    _getPropertyInfo: function(property, properties) {
      var p = properties[property];
      if (typeof(p) === 'function') {
        p = properties[property] = {
          type: p
        };
      }
      return p || Polymer.nob;
    },

    getPropertyType: function(property) {
      return this.getPropertyInfo(property).type;
    },

    isReadOnlyProperty: function(property) {
      return this.getPropertyInfo(property).readOnly;
    },

    isNotifyProperty: function(property) {
      return this.getPropertyInfo(property).notify;
    },

    isReflectedProperty: function(property) {
      return this.getPropertyInfo(property).reflectToAttribute;
    }

  });

;


  Polymer.CaseMap = {

    _caseMap: {},

    dashToCamelCase: function(dash) {
      var mapped = Polymer.CaseMap._caseMap[dash];
      if (mapped) {
        return mapped;
      }
      // TODO(sjmiles): is rejection test actually helping perf?
      if (dash.indexOf('-') < 0) {
        return Polymer.CaseMap._caseMap[dash] = dash;
      }
      return Polymer.CaseMap._caseMap[dash] = dash.replace(/-([a-z])/g, 
        function(m) {
          return m[1].toUpperCase(); 
        }
      );
    },

    camelToDashCase: function(camel) {
      var mapped = Polymer.CaseMap._caseMap[camel];
      if (mapped) {
        return mapped;
      }
      return Polymer.CaseMap._caseMap[camel] = camel.replace(/([a-z][A-Z])/g, 
        function (g) { 
          return g[0] + '-' + g[1].toLowerCase() 
        }
      );
    }

  };

;


  /**
   * Support for `hostAttributes` property.
   *
   *     hostAttributes: 'block vertical layout'
   *
   * `hostAttributes` is a space-delimited string of boolean attribute names to
   * set true on each instance.
   *
   * Support for mapping attributes to properties.
   *
   * Properties that are configured in `properties` with a type are mapped
   * to attributes.
   *
   * A value set in an attribute is deserialized into the specified
   * data-type and stored into the matching property.
   *
   * Example:
   *
   *     properties: {
   *       // values set to index attribute are converted to Number and propagated
   *       // to index property
   *       index: Number,
   *       // values set to label attribute are propagated to index property
   *       label: String
   *     }
   *
   * Types supported for deserialization:
   *
   * - Number
   * - Boolean
   * - String
   * - Object (JSON)
   * - Array (JSON)
   * - Date
   *
   * This feature implements `attributeChanged` to support automatic
   * propagation of attribute values at run-time. If you override
   * `attributeChanged` be sure to call this base class method
   * if you also want the standard behavior.
   *
   * @class base feature: attributes
   */

  Polymer.Base.addFeature({

    _marshalAttributes: function() {
      this._takeAttributes();
      this._installHostAttributes(this.hostAttributes);
    },

    _installHostAttributes: function(attributes) {
      if (attributes) {
        this.applyAttributes(this, attributes);
      }
    },

    applyAttributes: function(node, attr$) {
      for (var n in attr$) {
        this.serializeValueToAttribute(attr$[n], n, this);
      }
    },

    _takeAttributes: function() {
      this._takeAttributesToModel(this);
    },

    _takeAttributesToModel: function(model) {
      for (var propName in this.properties) {
        var attrName = Polymer.CaseMap.camelToDashCase(propName);
        if (this.hasAttribute(attrName)) {
          var val = this.getAttribute(attrName);
          var type = this.getPropertyType(propName);
          model[propName] = this.deserialize(val, type);
        }
      }
    },

    setAttributeToProperty: function(model, attrName) {
      // Don't deserialize back to property if currently reflecting
      if (!this._serializing) {
        var propName = Polymer.CaseMap.dashToCamelCase(attrName);
        if (propName in this.properties) {
          var type = this.getPropertyType(propName);
          var val = this.getAttribute(attrName);
          model[propName] = this.deserialize(val, type);
        }
      }
    },

    _serializing: false,
    reflectPropertyToAttribute: function(name) {
      this._serializing = true;
      this.serializeValueToAttribute(this[name], name);
      this._serializing = false;
    },

    serializeValueToAttribute: function(value, attribute, node) {
      var str = this.serialize(value);
      (node || this)
        [str === undefined ? 'removeAttribute' : 'setAttribute']
          (Polymer.CaseMap.camelToDashCase(attribute), str);
    },

    deserialize: function(value, type) {
      switch (type) {
        case Number:
          value = Number(value);
          break;

        case Boolean:
          value = (value !== null);
          break;

        case Object:
          try {
            value = JSON.parse(value);
          } catch(x) {
            // allow non-JSON literals like Strings and Numbers
          }
          break;

        case Array:
          try {
            value = JSON.parse(value);
          } catch(x) {
            value = null;
            console.warn('Polymer::Attributes: couldn`t decode Array as JSON');
          }
          break;

        case Date:
          value = new Date(value);
          break;

        case String:
        default:
          break;
      }
      return value;
    },

    serialize: function(value) {
      switch (typeof value) {
        case 'boolean':
          return value ? '' : undefined;

        case 'object':
          if (value instanceof Date) {
            return value;
          } else if (value) {
            try {
              return JSON.stringify(value);
            } catch(x) {
              return '';
            }
          }

        default:
          return value != null ? value : undefined;
      }
    }

  });

;


  Polymer.Base.addFeature({

    registerFeatures: function() {
      this._prepMixins();
      this._prepExtends();
      this._prepConstructor();
    },

    initFeatures: function() {
      this._marshalAttributes();
    }

  });

;


  /**
   * Automatic template management.
   * 
   * The `template` feature locates and instances a `<template>` element
   * corresponding to the current Polymer prototype.
   * 
   * The `<template>` element may be immediately preceeding the script that 
   * invokes `Polymer()`.
   *  
   * @class standard feature: template
   */
  
  Polymer.Base.addFeature({

    _prepTemplate: function() {
      // locate template using dom-module
      this._template = 
        this._template || Polymer.DomModule.import(this.is, 'template');
      // fallback to look at the node previous to the currentScript.
      if (!this._template) {
        var script = document._currentScript || document.currentScript;
        var prev = script && script.previousElementSibling;
        if (prev && prev.localName === 'template') {
          this._template = prev;
        }
      }
    },

    _stampTemplate: function() {
      if (this._template) {
        // note: root is now a fragment which can be manipulated
        // while not attached to the element.
        this.root = this.instanceTemplate(this._template);
      }
    },

    instanceTemplate: function(template) {
      var dom = 
        document.importNode(template._content || template.content, true);
      return dom;
    }

  });

;


  /**
   * Provides `ready` lifecycle callback which is called parent to child.
   *
   * This can be useful in a number of cases. Here are some examples:
   *
   * Setting a default property value that should have a side effect: To ensure
   * the side effect, an element must set a default value no sooner than
   * `created`; however, since `created` flows child to host, this is before the
   * host has had a chance to set a property value on the child. The `ready`
   * method solves this problem since it's called host to child.
   *
   * Dom distribution: To support reprojection efficiently, it's important to 
   * distribute from host to child in one shot. The `attachedCallback` mostly
   * goes in the desired order except for elements that are in dom to start; in
   * this case, all children are attached before the host element. Ready also
   * addresses this case since it's guaranteed to be called host to child.
   *
   * @class standard feature: ready
   */

(function() {

  var baseAttachedCallback = Polymer.Base.attachedCallback;
  var baseDetachedCallback = Polymer.Base.detachedCallback;

  Polymer.Base.addFeature({

    hostStack: [],
    _readied: false,
    _attachedPending: false,

    // for overriding
    configure: function() {
    },

    // for overriding
    ready: function() {
    },

    /**
      Returns the host of the local dom in which this element exists.
      This is a shorthand for Polymer.dom(this).getOwnerRoot().host
    */
    get host() {
      return this._host || (this._host = this._queryHost());
    },

    set host(value) {
      this._host = value;
    },

    _queryHost: function(node) {
      var ownerRoot = Polymer.dom(this).getOwnerRoot();
      return ownerRoot && ownerRoot.host;
    },

    // NOTE: The concept of 'host' is overloaded. There are two different
    // notions:
    // 1. an element hosts the elements in its local dom root.
    // 2. an element hosts the elements on which it configures data.
    // Practially, these notions are almost always coincident.
    // Some special elements like templates may separate them.
    // In order not to over-emphaisize this technical difference, we expose 
    // one concept to the user and it maps to the dom-related meaning of host.
    //
    // 1. set this element's `host` and push this element onto the `host`'s
    // list of `client` elements
    // 2. establish this element as the current hosting element (allows 
    // any elements we stamp to easily set host to us).
    _pushHost: function(host) {
      this.host = host = host || 
        Polymer.Base.hostStack[Polymer.Base.hostStack.length-1];
      if (host && host._clients) {
        host._clients.push(this);
      }
      this._beginHost();
    },

    _beginHost: function() {
      Polymer.Base.hostStack.push(this);
      if (!this._clients) {
        this._clients = [];
      }
    },

    _popHost: function() {
      // this element is no longer the current hosting element
      Polymer.Base.hostStack.pop();
    },

    _readyContent: function() {
      if (this._canReady()) {
        this._initializeContent();
      }
    },

    _canReady: function() {
      return !this._readied && (!this.host || this.host._readied);
    },

    _initializeContent: function() {
      // prepare root
      this._setupRoot();
      // logically distribute self
      this._beginDistribute();
      // send data configuration signal
      this._configure();
      // now fully prepare localChildren
      var c$ = this._clients;
      for (var i=0, l= c$.length, c; (i<l) && (c=c$[i]); i++) {
        c._initializeContent();
      }
      // perform actual dom composition
      this._finishDistribute();
      // ensure elements are attached if they are in the dom at ready time
      // helps normalize attached ordering between native and polyfill ce.
      // TODO(sorvell): worth perf cost? ~6%
      // if (!Polymer.Settings.useNativeCustomElements) {
      //   CustomElements.takeRecords();
      // }
      // send ready signal
      this._ready();
      // reset _host as it needs to be established by local dom after data
      // configuration
      this.host = null;
      this._clients = null;
    },

    // calls `configure`
    // note: called host -> localChild
    _configure: function() {
      this.configure();
    },

    // mark readied and call `ready`
    // note: called localChildren -> host
    _ready: function() {
      this._readied = true;
      this._beforeReady();
      this.ready();
      if (this._attachedPending) {
        this._attachedPending = false;
        this.attachedCallback();
      }
    },

    // for system overriding
    _beforeReady: function() {},

    // normalize lifecycle: ensure attached occurs only after ready.
    attachedCallback: function() {
      if (this._readied) {
        baseAttachedCallback.call(this);
      } else {
        this._attachedPending = true;
      }
    },

    detachedCallback: function() {
      // uncache host so it will be calculated again.
      this.host = null;
      baseDetachedCallback.call(this);
    }

  });

})();

;


Polymer.ArraySplice = (function() {
  
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

  return new ArraySplice();

})();
;


  Polymer.EventApi = (function() {

    var Settings = Polymer.Settings;

    var EventApi = function(event) {
      this.event = event;
    };

    if (Settings.useShadow) {

      EventApi.prototype = {
        
        get rootTarget() {
          return this.event.path[0];
        },

        get localTarget() {
          return this.event.target;
        },

        get path() {
          return this.event.path;
        }

      };

    } else {

      EventApi.prototype = {
      
        get rootTarget() {
          return this.event.target;
        },

        get localTarget() {
          var current = this.event.currentTarget;
          var currentRoot = current && Polymer.dom(current)._getOwnerShadyRoot();
          var p$ = this.path;
          for (var i=0; i < p$.length; i++) {
            if (Polymer.dom(p$[i])._getOwnerShadyRoot() === currentRoot) {
              return p$[i];
            }
          }
        },

        // TODO(sorvell): simulate event.path. This probably incorrect for
        // non-bubbling events.
        get path() {
          if (!this.event._path) {
            var path = [];
            var o = this.rootTarget;
            while (o) {
              path.push(o);
              o = Polymer.dom(o).parentNode || o.host;
            }
            // event path includes window in most recent native implementations
            path.push(window);
            this.event._path = path;
          }
          return this.event._path;
        }

      };

    }

    var factory = function(event) {
      if (!event.__eventApi) {
        event.__eventApi = new EventApi(event);
      }
      return event.__eventApi;
    };

    return {
      factory: factory
    };

  })();

;


  Polymer.DomApi = (function() {

    var Debounce = Polymer.Debounce;
    var Settings = Polymer.Settings;

    var nativeInsertBefore = Element.prototype.insertBefore;
    var nativeRemoveChild = Element.prototype.removeChild;
    var nativeAppendChild = Element.prototype.appendChild;

    var dirtyRoots = [];

    var DomApi = function(node, patch) {
      this.node = node;
      if (patch) {
        this.patch();
      }
    };

    DomApi.prototype = {

      // experimental: support patching selected native api.
      patch: function() {
        var self = this;
        this.node.appendChild = function(node) {
          return self.appendChild(node);
        };
        this.node.insertBefore = function(node, ref_node) {
          return self.insertBefore(node, ref_node);
        };
        this.node.removeChild = function(node) {
          return self.removeChild(node);
        };
      },

      get childNodes() {
        var c$ = getLightChildren(this.node);
        return Array.isArray(c$) ? c$ : Array.prototype.slice.call(c$);
      },

      get children() {
        return Array.prototype.filter.call(this.childNodes, function(n) {
          return (n.nodeType === Node.ELEMENT_NODE);
        });
      },

      get parentNode() {
        return this.node.lightParent || this.node.parentNode;
      },

      flush: function() {
        for (var i=0, host; i<dirtyRoots.length; i++) {
          host = dirtyRoots[i];
          if (host.__distribute) {
            host.__distribute.complete();
          }
        }
        dirtyRoots = [];
      },

      _lazyDistribute: function(host) {
        if (host.shadyRoot) {
          host.shadyRoot._distributionClean = false;
        }
        // TODO(sorvell): optimize debounce so it does less work by default
        // and then remove these checks...
        // need to dirty distribution once.
        if (!host.__distribute || !host.__distribute.finish) {
          host._debounce('__distribute', host._distributeContent);
          dirtyRoots.push(host);
        }
      },

      // cases in which we may not be able to just do standard appendChild
      // 1. container has a shadyRoot (needsDistribution IFF the shadyRoot
      // has an insertion point)
      // 2. container is a shadyRoot (don't distribute, instead set 
      // container to container.host.
      // 3. node is <content> (host of container needs distribution)
      appendChild: function(node) {
        var distributed;
        if (node.lightParent) {
          this._removeLogicalInfo(node, node.lightParent);
        }
        if (this._nodeIsInLogicalTree(this.node)) {
          var host = this._hostForNode(this.node);
          this._addLogicalInfo(node, this.node, host && host.shadyRoot);
          if (host) {
            host._elementAdd(node);
            distributed = this._maybeDistribute(node, this.node, host);
          }
        }
        if (!distributed) {
          // if adding to a shadyRoot, add to host instead
          var container = this.node._isShadyRoot ? this.node.host : this.node;
          nativeAppendChild.call(container, node);
        }
        return node;
      },

      insertBefore: function(node, ref_node) {
        if (!ref_node) {
          return this.appendChild(node);
        }
        var distributed;
        if (node.lightParent) {
          this._removeLogicalInfo(node, node.lightParent);
        }
        if (this._nodeIsInLogicalTree(this.node)) {
          saveLightChildrenIfNeeded(this.node);
          var children = this.childNodes;
          var index = children.indexOf(ref_node);
          if (index < 0) {
            throw Error('The ref_node to be inserted before is not a child ' +
              'of this node');
          }
          var host = this._hostForNode(this.node);
          this._addLogicalInfo(node, this.node, host && host.shadyRoot, index);
          if (host) {
            host._elementAdd(node);
            distributed = this._maybeDistribute(node, this.node, host);
          }
        }
        if (!distributed) {
          // if ref_node is <content> replace with first distributed node
          ref_node = ref_node.localName === CONTENT ? 
            this._firstComposedNode(ref_node) : ref_node;
          // if adding to a shadyRoot, add to host instead
          var container = this.node._isShadyRoot ? this.node.host : this.node;
          nativeInsertBefore.call(container, node, ref_node);
        }
        return node;
      },

      /**
        Removes the given `node` from the element's `lightChildren`.
        This method also performs dom composition.
      */
      removeChild: function(node) {
        var distributed;
        if (this._nodeIsInLogicalTree(this.node)) {
          var host = this._hostForNode(this.node);
          this._removeLogicalInfo(node, this.node);
          if (host) {
            host._elementRemove(node);
            distributed = this._maybeDistribute(node, this.node, host);
          }
        }
        if (!distributed) {
          // if removing from a shadyRoot, remove form host instead
          var container = this.node._isShadyRoot ? this.node.host : this.node;
          nativeRemoveChild.call(container, node);
        }
      },

      replaceChild: function(node, ref_node) {
        this.insertBefore(node, ref_node);
        this.removeChild(ref_node);
      },

      _getOwnerShadyRoot: function() {
        return this._ownerShadyRootForNode(this.node);
      },

      getOwnerRoot: function() {
        return this._getOwnerShadyRoot();
      },

      _ownerShadyRootForNode: function(node) {
        if (node._ownerShadyRoot === undefined) {
          var root;
          if (node._isShadyRoot) {
            root = node;
          } else {
            var parent = Polymer.dom(node).parentNode;
            if (parent) {
              root = parent._isShadyRoot ? parent : 
                this._ownerShadyRootForNode(parent);
            } else {
             root = null;
            }
          }
          node._ownerShadyRoot = root;
        }
        return node._ownerShadyRoot;
        
      },

      _maybeDistribute: function(node, parent, host) {
        var nodeNeedsDistribute = this._nodeNeedsDistribution(node);
        var distribute = this._parentNeedsDistribution(parent) ||
          nodeNeedsDistribute;
        if (nodeNeedsDistribute) {
          this._updateInsertionPoints(host);
        }
        if (distribute) {
          this._lazyDistribute(host);
        }
        return distribute;
      },

      _updateInsertionPoints: function(host) {
        host.shadyRoot._insertionPoints =
          factory(host.shadyRoot).querySelectorAll(CONTENT);
      }, 

      _nodeIsInLogicalTree: function(node) {
        return Boolean(node._isShadyRoot ||
          this._getOwnerShadyRoot(node) ||
          node.shadyRoot);
      },

      _hostForNode: function(node) {
        var root = node.shadyRoot || (node._isShadyRoot ? 
          node : this._getOwnerShadyRoot(node));
        return root && root.host;
      },

      _parentNeedsDistribution: function(parent) {
        return parent.shadyRoot && hasInsertionPoint(parent.shadyRoot);
      },

      // TODO(sorvell): technically we should check non-fragment nodes for 
      // <content> children but since this case is assumed to be exceedingly
      // rare, we avoid the cost and will address with some specific api
      // when the need arises.
      _nodeNeedsDistribution: function(node) {
        return (node.localName === CONTENT) || 
          ((node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) &&
            node.querySelector(CONTENT));
      },

      _addLogicalInfo: function(node, container, root, index) {
        saveLightChildrenIfNeeded(container);
        var children = factory(container).childNodes;
        index = index === undefined ? children.length : index;
        // handle document fragments
        if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          var n = node.firstChild;
          while (n) {
            children.splice(index++, 0, n);
            n.lightParent = container;
            n = n.nextSibling;
          }
        } else {
          children.splice(index, 0, node);
          node.lightParent = container;
          node._ownerShadyRoot = root;
        }
        // TODO(sorvell): consider not attaching this to every node and instead
        // looking up the tree for this info.
        // add _ownerShadyRoot info
        var c$ = factory(node).childNodes;
        if (c$.length) {
          this._addRootToChildren(node, root);
        }
      },

      // NOTE: in general, we expect contents of the lists here to be small-ish
      // and therefore indexOf to be nbd. Other optimizations can be made
      // for larger lists (linked list) 
      _removeLogicalInfo: function(node, container) {
        var children = factory(container).childNodes;
        var index = children.indexOf(node);
        if ((index < 0) || (container !== node.lightParent)) {
          throw Error('The node to be removed is not a child of this node');
        }
        children.splice(index, 1);
        node.lightParent = null;
        // TODO(sorvell): need to clear any children of element?
        node._ownerShadyRoot = undefined;
      },

      _addRootToChildren: function(children, root) {
        for (var i=0, l=children.length, c, cc; (i<l) && (c=children[i]); i++) {
          c._ownerShadyRoot = root;
          cc = factory(c).childNodes;
          if (cc.length) {
            this._addRootToChildren(cc, root);
          }
        }
      },

      // TODO(sorvell): This will fail if distribution that affects this 
      // question is pending; this is expected to be exceedingly rare, but if
      // the issue comes up, we can force a flush in this case.
      _firstComposedNode: function(content) {
        var n$ = factory(content).getDistributedNodes();
        for (var i=0, l=n$.length, n, p$; (i<l) && (n=n$[i]); i++) {
          p$ = factory(n).getDestinationInsertionPoints();
          // means that we're composed to this spot.
          if (p$[p$.length-1] === content) {
            return n;
          }
        }
      },

      // TODO(sorvell): consider doing native QSA and filtering results.
      querySelector: function(selector) {
        return this.querySelectorAll(selector)[0];
      },

      querySelectorAll: function(selector) {
        return this._query(function(n) {
          return matchesSelector.call(n, selector);
        }, this.node);  
      },

      _query: function(matcher, node) {
        var list = [];
        this._queryElements(factory(node).childNodes, matcher, list);
        return list;
      },

      _queryElements: function(elements, matcher, list) {
        for (var i=0, l=elements.length, c; (i<l) && (c=elements[i]); i++) {
          if (c.nodeType === Node.ELEMENT_NODE) {
            this._queryElement(c, matcher, list);
          }
        }
      },

      _queryElement: function(node, matcher, list) {
        if (matcher(node)) {
          list.push(node);
        }
        this._queryElements(factory(node).childNodes, matcher, list);
      },

      getDestinationInsertionPoints: function() {
        return this.node._destinationInsertionPoints ||
          Array.prototype.slice.call(this.node.getDestinationInsertionPoints());
      },

      getDistributedNodes: function() {
        return this.node._distributedNodes ||
          Array.prototype.slice.call(this.node.getDistributedNodes());
      },

      /*
        Returns a list of nodes distributed within this element. These can be 
        dom children or elements distributed to children that are insertion
        points.
      */
      queryDistributedElements: function(selector) {
        var c$ = this.childNodes;
        var list = [];
        this._distributedFilter(selector, c$, list);
        for (var i=0, l=c$.length, c; (i<l) && (c=c$[i]); i++) {
          if (c.localName === CONTENT) {
            this._distributedFilter(selector, factory(c).getDistributedNodes(),
              list);
          }
        }
        return list;
      },

      _distributedFilter: function(selector, list, results) {
        results = results || [];
        for (var i=0, l=list.length, d; (i<l) && (d=list[i]); i++) {
          if ((d.nodeType === Node.ELEMENT_NODE) && 
            (d.localName !== CONTENT) &&
            matchesSelector.call(d, selector)) {
            results.push(d);
          }
        }
        return results;
      }
            
    }; 

    if (Settings.useShadow) {

      DomApi.prototype.querySelectorAll = function(selector) {
        return Array.prototype.slice.call(this.node.querySelectorAll(selector));
      };

      DomApi.prototype.patch = function() {};

      DomApi.prototype.getOwnerRoot = function() {
        var n = this.node;
        while (n) {
          if (n.nodeType === Node.DOCUMENT_FRAGMENT_NODE && n.host) {
            return n;
          }
          n = n.parentNode;
        }
      };

    }

    var CONTENT = 'content';

    var factory = function(node, patch) {
      node = node || document;
      if (!node.__domApi) {
        node.__domApi = new DomApi(node, patch);
      }
      return node.__domApi;
    };

    Polymer.dom = function(obj, patch) {
      if (obj instanceof Event) {
        return Polymer.EventApi.factory(obj);
      } else {
        return factory(obj, patch);
      }
    };

    // make flush available directly.
    Polymer.dom.flush = DomApi.prototype.flush;

    function getLightChildren(node) {
      var children = node.lightChildren;
      return children ? children : node.childNodes;
    }

    function saveLightChildrenIfNeeded(node) {
      // Capture the list of light children. It's important to do this before we
      // start transforming the DOM into "rendered" state.
      // 
      // Children may be added to this list dynamically. It will be treated as the
      // source of truth for the light children of the element. This element's
      // actual children will be treated as the rendered state once lightChildren
      // is populated.
      if (!node.lightChildren) {
        var children = [];
        for (var child = node.firstChild; child; child = child.nextSibling) {
          children.push(child);
          child.lightParent = child.lightParent || node;
        }
        node.lightChildren = children;
      }
    }

    function hasInsertionPoint(root) {
      return Boolean(root._insertionPoints.length);
    }

    var p = Element.prototype;
    var matchesSelector = p.matches || p.matchesSelector ||
        p.mozMatchesSelector || p.msMatchesSelector ||
        p.oMatchesSelector || p.webkitMatchesSelector;

    return {
      getLightChildren: getLightChildren,
      saveLightChildrenIfNeeded: saveLightChildrenIfNeeded,
      matchesSelector: matchesSelector,
      hasInsertionPoint: hasInsertionPoint,
      factory: factory
    };

  })();

;


  (function() {
    /**

      Implements a pared down version of ShadowDOM's scoping, which is easy to
      polyfill across browsers.

    */
    Polymer.Base.addFeature({

      _prepContent: function() {
        // Use this system iff localDom is needed.
        this._useContent = this._useContent || Boolean(this._template);
        if (this._useContent) {
          this._template._hasInsertionPoint =
            this._template.content.querySelector('content');
        }
      },

      // called as part of content initialization, prior to template stamping
      _poolContent: function() {
        if (this._useContent) {
          // capture lightChildren to help reify dom scoping
          saveLightChildrenIfNeeded(this);
        }
      },

      // called as part of content initialization, after template stamping
      _setupRoot: function() {
        if (this._useContent) {
          this._createLocalRoot();
        }
      },

      _createLocalRoot: function() {
        this.shadyRoot = this.root;
        this.shadyRoot._distributionClean = false;
        this.shadyRoot._isShadyRoot = true;
        this.shadyRoot._dirtyRoots = [];
        // capture insertion point list
        // TODO(sorvell): it's faster to do this via native qSA than annotator.
        this.shadyRoot._insertionPoints = this._template._hasInsertionPoint ?
          this.shadyRoot.querySelectorAll('content') : [];
        // save logical tree info for shadyRoot.
        saveLightChildrenIfNeeded(this.shadyRoot);
        this.shadyRoot.host = this;
      },

      /**
       * Force this element to distribute its children to its local dom.
       * A user should call `distributeContent` if distribution has been 
       * invalidated due to changes to selectors on child elements that 
       * effect distribution. For example, if an element contains an
       * insertion point with <content select=".foo"> and a `foo` class is 
       * added to a child, then `distributeContent` must be called to update
       * local dom distribution.
       */
      distributeContent: function() {
        if (this._useContent) {
          this.shadyRoot._distributionClean = false;
          this._distributeContent();
        }
      },

      _distributeContent: function() {
        if (this._useContent && !this.shadyRoot._distributionClean) {
          // logically distribute self
          this._beginDistribute();
          this._distributeDirtyRoots();
          this._finishDistribute();
        }
      },

      _beginDistribute: function() {
        if (this._useContent && hasInsertionPoint(this.shadyRoot)) {
          // reset distributions
          this._resetDistribution(this.shadyRoot);
          // compute which nodes should be distributed where
          // TODO(jmesserly): this is simplified because we assume a single
          // ShadowRoot per host and no `<shadow>`.
          this._distributePool(this.shadyRoot, this._collectPool());
        }
      },

      _distributeDirtyRoots: function() {
        var c$ = this.shadyRoot._dirtyRoots;
        for (var i=0, l= c$.length, c; (i<l) && (c=c$[i]); i++) {
          c._distributeContent();
        }
        this.shadyRoot._dirtyRoots = [];
      },

      _finishDistribute: function() {
        // compose self
        if (this._useContent) {
          if (hasInsertionPoint(this.shadyRoot)) {
            this._composeTree();
          } else {
            if (!this.shadyRoot._hasDistributed) {
              this.textContent = '';
              this.appendChild(this.shadyRoot);
            } else {
              // simplified non-tree walk composition
              var children = this._composeNode(this);
              this._updateChildNodes(this, children);
            }
          }
          this.shadyRoot._hasDistributed = true;
          this.shadyRoot._distributionClean = true;
        }
      },

      // This is a polyfill for Element.prototype.matches, which is sometimes
      // still prefixed. Alternatively we could just polyfill it somewhere.
      // Note that the arguments are reversed from what you might expect.
      elementMatches: function(selector, node) {
        if (node === undefined) {
          node = this;
        }
        return matchesSelector.call(node, selector);
      },

      // Many of the following methods are all conceptually static, but they are
      // included here as "protected" methods to allow overriding.

      _resetDistribution: function(node) {
        // light children
        var children = getLightChildren(node);
        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          if (child._destinationInsertionPoints) {
            child._destinationInsertionPoints = undefined;
          }
        }
        // insertion points
        var p$ = node._insertionPoints;
        for (var j = 0; j < p$.length; j++) {
          p$[j]._distributedNodes = [];
        }
      },

      // Gather the pool of nodes that should be distributed. We will combine
      // these with the "content root" to arrive at the composed tree.
      _collectPool: function() {
        var pool = [];
        var children = getLightChildren(this);
        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          if (isInsertionPoint(child)) {
            pool.push.apply(pool, child._distributedNodes);
          } else {
            pool.push(child);
          }
        }
        return pool;
      },

      // perform "logical" distribution; note, no actual dom is moved here,
      // instead elements are distributed into a `content._distributedNodes`
      // array where applicable.
      _distributePool: function(node, pool) {
        var p$ = node._insertionPoints;
        for (var i=0, l=p$.length, p; (i<l) && (p=p$[i]); i++) {
          this._distributeInsertionPoint(p, pool);
        }
      },

      _distributeInsertionPoint: function(content, pool) {
        // distribute nodes from the pool that this selector matches
        var anyDistributed = false;
        for (var i=0, l=pool.length, node; i < l; i++) {
          node=pool[i];
          // skip nodes that were already used
          if (!node) {
            continue;
          }
          // distribute this node if it matches
          if (this._matchesContentSelect(node, content)) {
            distributeNodeInto(node, content);
            // remove this node from the pool
            pool[i] = undefined;
            // since at least one node matched, we won't need fallback content
            anyDistributed = true;
            var parent = content.lightParent;
            // dirty a shadyRoot if a change may trigger reprojection!
            if (parent && parent.shadyRoot &&
              hasInsertionPoint(parent.shadyRoot)) {
              parent.shadyRoot._distributionClean = false;
              this.shadyRoot._dirtyRoots.push(parent);
            }
          }
        }
        // Fallback content if nothing was distributed here
        if (!anyDistributed) {
          var children = getLightChildren(content);
          for (var j = 0; j < children.length; j++) {
            distributeNodeInto(children[j], content);
          }
        }
      },

      // Reify dom such that it is at its correct rendering position
      // based on logical distribution.
      _composeTree: function() {
        this._updateChildNodes(this, this._composeNode(this));
        var p$ = this.shadyRoot._insertionPoints;
        for (var i=0, l=p$.length, p, parent; (i<l) && (p=p$[i]); i++) {
          parent = p.lightParent || p.parentNode;
          if (!parent._useContent && (parent !== this) &&
            (parent !== this.shadyRoot)) {
            this._updateChildNodes(parent, this._composeNode(parent));
          }
        }
      },

      // Returns the list of nodes which should be rendered inside `node`.
      _composeNode: function(node) {
        var children = [];
        var c$ = getLightChildren(node.shadyRoot || node);
        for (var i = 0; i < c$.length; i++) {
          var child = c$[i];
          if (isInsertionPoint(child)) {
            var distributedNodes = child._distributedNodes;
            for (var j = 0; j < distributedNodes.length; j++) {
              var distributedNode = distributedNodes[j];
              if (isFinalDestination(child, distributedNode)) {
                children.push(distributedNode);
              }
            }
          } else {
            children.push(child);
          }
        }
        return children;
      },

      // Ensures that the rendered node list inside `node` is `children`.
      _updateChildNodes: function(node, children) {
        var splices =
          Polymer.ArraySplice.calculateSplices(children, node.childNodes);
        for (var i=0; i<splices.length; i++) {
          var s = splices[i];
          // remove
          for (var j=0, c; j < s.removed.length; j++) {
            c = s.removed[j];
            if (c.previousSibling == children[s.index-1]) {
              remove(c);
            }
          }
          // insert
          for (var idx=s.index, ch, o; idx < s.index + s.addedCount; idx++) {
            ch = children[idx];
            o = node.childNodes[idx];
            while (o && o === ch) {
              o = o.nextSibling;
            }
            insertBefore(node, ch, o);
          }
        }
      },

      _matchesContentSelect: function(node, contentElement) {
        var select = contentElement.getAttribute('select');
        // no selector matches all nodes (including text)
        if (!select) {
          return true;
        }
        select = select.trim();
        // same thing if it had only whitespace
        if (!select) {
          return true;
        }
        // selectors can only match Elements
        if (!(node instanceof Element)) {
          return false;
        }
        // only valid selectors can match:
        //   TypeSelector
        //   *
        //   ClassSelector
        //   IDSelector
        //   AttributeSelector
        //   negation
        var validSelectors = /^(:not\()?[*.#[a-zA-Z_|]/;
        if (!validSelectors.test(select)) {
          return false;
        }
        return this.elementMatches(select, node);
      },

      // system override point
      _elementAdd: function() {},

      // system override point
      _elementRemove: function() {}

    });

    var saveLightChildrenIfNeeded = Polymer.DomApi.saveLightChildrenIfNeeded;
    var getLightChildren = Polymer.DomApi.getLightChildren;
    var matchesSelector = Polymer.DomApi.matchesSelector;
    var hasInsertionPoint = Polymer.DomApi.hasInsertionPoint;

    function distributeNodeInto(child, insertionPoint) {
      insertionPoint._distributedNodes.push(child);
      var points = child._destinationInsertionPoints;
      if (!points) {
        child._destinationInsertionPoints = [insertionPoint];
      // TODO(sorvell): _destinationInsertionPoints may not be cleared when
      // nodes are dynamically added/removed, therefore test before adding
      // insertion points.
      } else if (points.indexOf(insertionPoint) < 0) {
        points.push(insertionPoint);
      }
    }

    function isFinalDestination(insertionPoint, node) {
      var points = node._destinationInsertionPoints;
      return points && points[points.length - 1] === insertionPoint;
    }

    function isInsertionPoint(node) {
      // TODO(jmesserly): we could add back 'shadow' support here.
      return node.localName == 'content';
    }

    var nativeInsertBefore = Element.prototype.insertBefore;
    var nativeRemoveChild = Element.prototype.removeChild;

    function insertBefore(parentNode, newChild, refChild) {
      // remove child from its old parent first
      remove(newChild);
      // make sure we never lose logical DOM information:
      // if the parentNode doesn't have lightChildren, save that information now.
      saveLightChildrenIfNeeded(parentNode);
      // insert it into the real DOM
      nativeInsertBefore.call(parentNode, newChild, refChild || null);
    }

    function remove(node) {
      var parentNode = node.parentNode;
      if (parentNode) {
        // make sure we never lose logical DOM information:
        // if the parentNode doesn't have lightChildren, save that information now.
        saveLightChildrenIfNeeded(parentNode);
        // remove it from the real DOM
        nativeRemoveChild.call(parentNode, node);
      }
    }

  })();

;

  
  /**
    Implements `shadyRoot` compatible dom scoping using native ShadowDOM.
  */

  // Transform styles if not using ShadowDOM or if flag is set.

  if (Polymer.Settings.useShadow) {

    Polymer.Base.addFeature({

      // no-op's when ShadowDOM is in use
      _poolContent: function() {},
      _beginDistribute: function() {},
      distributeContent: function() {},
      _distributeContent: function() {},
      _finishDistribute: function() {},
      
      // create a shadowRoot
      _createLocalRoot: function() {
        this.createShadowRoot();
        this.shadowRoot.appendChild(this.root);
        this.root = this.shadowRoot;
      }

    });

  }

;


  Polymer.DomModule = document.createElement('dom-module');

  Polymer.Base.addFeature({

    registerFeatures: function() {
      this._prepMixins();
      this._prepExtends();
      this._prepConstructor();
      this._prepTemplate();
      this._prepContent();
    },

    initFeatures: function() {
      this._poolContent();
      this._pushHost();
      this._stampTemplate();
      this._popHost();
      this._marshalAttributes();
      this._readyContent();
    }

  });

;

(function(scope) {

  function withDependencies(task, depends) {
    depends = depends || [];
    if (!depends.map) {
      depends = [depends];
    }
    return task.apply(this, depends.map(marshal));
  }

  function module(name, dependsOrFactory, moduleFactory) {
    var module = null;
    switch (arguments.length) {
      case 0:
        return;
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

  var using = function(depends, task) {
    withDependencies(task, depends);
  };

  // exports

  scope.marshal = marshal;
  // `module` confuses commonjs detectors
  scope.modulate = module;
  scope.using = using;

})(this);
;

/**
 * Scans a template to produce an annotation list that that associates
 * metadata culled from markup with tree locations 
 * metadata and information to associate the metadata with nodes in an instance.
 *
 * Supported expressions include:
 *
 * Double-mustache annotations in text content. The annotation must be the only
 * content in the tag, compound expressions are not supported.
 *
 *     <[tag]>{{annotation}}<[tag]>
 *
 * Double-escaped annotations in an attribute, either {{}} or [[]].
 *
 *     <[tag] someAttribute="{{annotation}}" another="[[annotation]]"><[tag]>
 *
 * `on-` style event declarations.
 *
 *     <[tag] on-<event-name>="annotation"><[tag]>
 *
 * Note that the `annotations` feature does not implement any behaviors
 * associated with these expressions, it only captures the data.
 *
 * Generated data-structure:
 * 
 *     [
 *       {
 *         id: '<id>',
 *         events: [
 *           {
 *             name: '<name>'
 *             value: '<annotation>'
 *           }, ...
 *         ],
 *         bindings: [
 *           {
 *             kind: ['text'|'attribute'],
 *             mode: ['{'|'['],
 *             name: '<name>'
 *             value: '<annotation>'
 *           }, ...
 *         ],
 *         // TODO(sjmiles): this is annotation-parent, not node-parent
 *         parent: <reference to parent annotation object>,
 *         index: <integer index in parent's childNodes collection>
 *       },
 *       ...
 *     ]
 * 
 * @class Template feature
 */

  // null-array (shared empty array to avoid null-checks)
  Polymer.nar = [];

  Polymer.Annotations = {

    // preprocess-time

    // construct and return a list of annotation records
    // by scanning `template`'s content
    //
    parseAnnotations: function(template) {
      var list = [];
      var content = template._content || template.content; 
      this._parseNodeAnnotations(content, list);
      return list;
    },

    // add annotations gleaned from subtree at `node` to `list`
    _parseNodeAnnotations: function(node, list) {
      return node.nodeType === Node.TEXT_NODE ?
        this._parseTextNodeAnnotation(node, list) :
          // TODO(sjmiles): are there other nodes we may encounter
          // that are not TEXT_NODE but also not ELEMENT?
          this._parseElementAnnotations(node, list);
    },

    // add annotations gleaned from TextNode `node` to `list`
    _parseTextNodeAnnotation: function(node, list) {
      var v = node.textContent, escape = v.slice(0, 2);
      if (escape === '{{' || escape === '[[') {
        // NOTE: use a space here so the textNode remains; some browsers
        // (IE) evacipate an empty textNode.
        node.textContent = ' ';
        var annote = {
          bindings: [{
            kind: 'text',
            mode: escape[0],
            value: v.slice(2, -2)
          }]
        };
        list.push(annote);
        return annote;
      }
    },

    // add annotations gleaned from Element `node` to `list`
    _parseElementAnnotations: function(element, list) {
      var annote = {
        bindings: [],
        events: []
      };
      this._parseChildNodesAnnotations(element, annote, list);
      // TODO(sjmiles): is this for non-ELEMENT nodes? If so, we should
      // change the contract of this method, or filter these out above.
      if (element.attributes) {
        this._parseNodeAttributeAnnotations(element, annote, list);
        // TODO(sorvell): ad hoc callback for doing work on elements while
        // leveraging annotator's tree walk.
        // Consider adding an node callback registry and moving specific 
        // processing out of this module.
        if (this.prepElement) {
          this.prepElement(element);
        }
      }
      if (annote.bindings.length || annote.events.length || annote.id) {
        list.push(annote);
      }
      return annote;
    },

    // add annotations gleaned from children of `root` to `list`, `root`'s
    // `annote` is supplied as it is the annote.parent of added annotations 
    _parseChildNodesAnnotations: function(root, annote, list, callback) {
      if (root.firstChild) {
        for (var i=0, node=root.firstChild; node; node=node.nextSibling, i++){
          if (node.localName === 'template') {
            // TODO(sjmiles): simply altering the .content reference didn't
            // work (there was some confusion, might need verification)
            var content = document.createDocumentFragment();
            content.appendChild(node.content);
            // TODO(sjmiles): using `nar` to avoid unnecessary allocation;
            // in general the handling of these arrays needs some cleanup 
            // in this module
            list.push({
              bindings: Polymer.nar,
              events: Polymer.nar,
              templateContent: content,
              parent: annote,
              index: i
            });
          }
          //
          var childAnnotation = this._parseNodeAnnotations(node, list, callback);
          if (childAnnotation) {
            childAnnotation.parent = annote;
            childAnnotation.index = i;
          }
        }
      }
    },

    // add annotation data from attributes to the `annotation` for node `node`
    // TODO(sjmiles): the distinction between an `annotation` and 
    // `annotation data` is not as clear as it could be
    // Walk attributes backwards, since removeAttribute can be vetoed by
    // IE in certain cases (e.g. <input value="foo">), resulting in the
    // attribute staying in the attributes list
    _parseNodeAttributeAnnotations: function(node, annotation) {
      for (var i=node.attributes.length-1, a; (a=node.attributes[i]); i--) {
        var n = a.name, v = a.value;
        // id
        if (n === 'id') {
          annotation.id = v;
        }
        // events (on-*)
        else if (n.slice(0, 3) === 'on-') {
          node.removeAttribute(n);
          annotation.events.push({
            name: n.slice(3),
            value: v
          });
        }
        // bindings (other attributes)
        else {
          var b = this._parseNodeAttributeAnnotation(node, n, v);
          if (b) {
            annotation.bindings.push(b);
          }
        }
      }
    },

    // construct annotation data from a generic attribute, or undefined
    _parseNodeAttributeAnnotation: function(node, n, v) {
      var mode = '', escape = v.slice(0, 2), name = n;
      if (escape === '{{' || escape === '[[') {
        // Mode (one-way or two)
        mode = escape[0];
        v = v.slice(2, -2);
        // Negate
        var not = false;
        if (v[0] == '!') {
          v = v.substring(1);
          not = true;
        }
        // Attribute or property
        var kind = 'property';
        if (n[n.length-1] == '$') {
          name = n.slice(0, -1);
          kind = 'attribute';
        }
        // Custom notification event
        var notifyEvent, colon;
        if (mode == '{' && (colon = v.indexOf('::')) > 0) {
          notifyEvent = v.substring(colon + 2);
          v = v.substring(0, colon);
        }
        // Remove annotation
        node.removeAttribute(n);
        // Case hackery: attributes are lower-case, but bind targets 
        // (properties) are case sensitive. Gambit is to map dash-case to 
        // camel-case: `foo-bar` becomes `fooBar`.
        // Attribute bindings are excepted.
        if (kind === 'property') {
          name = Polymer.CaseMap.dashToCamelCase(name);
        }
        return {
          kind: kind,
          mode: mode,
          name: name,
          value: v,
          negate: not,
          event: notifyEvent
        };
      }
    },

    // instance-time

    _localSubTree: function(node, host) {
      return (node === host) ? node.childNodes :
         (node.lightChildren || node.childNodes);
    },

    findAnnotatedNode: function(root, annote) {
      // recursively ascend tree until we hit root
      var parent = annote.parent && 
        Polymer.Annotations.findAnnotatedNode(root, annote.parent);
      // unwind the stack, returning the indexed node at each level
      return !parent ? root : 
        Polymer.Annotations._localSubTree(parent, root)[annote.index];
    }

  };


;


  (function() {

    // path fixup for urls in cssText that's expected to 
    // come from a given ownerDocument
    function resolveCss(cssText, ownerDocument) {
      return cssText.replace(CSS_URL_RX, function(m, pre, url, post) {
        return pre + '\'' + 
          resolve(url.replace(/["']/g, ''), ownerDocument) + 
          '\'' + post;
      });
    }

    // url fixup for urls in an element's attributes made relative to 
    // ownerDoc's base url
    function resolveAttrs(element, ownerDocument) {
      for (var name in URL_ATTRS) {
        var a$ = URL_ATTRS[name];
        for (var i=0, l=a$.length, a, at, v; (i<l) && (a=a$[i]); i++) {
          if (name === '*' || element.localName === name) {
            at = element.attributes[a];
            v = at && at.value;
            if (v && (v.search(BINDING_RX) < 0)) {
              at.value = (a === 'style') ?
                resolveCss(v, ownerDocument) :
                resolve(v, ownerDocument);
            }
          }
        }
      }
    }

    function resolve(url, ownerDocument) {
      var resolver = getUrlResolver(ownerDocument);
      resolver.href = url;
      return resolver.href || url;
    }

    var tempDoc;
    var tempDocBase;
    function resolveUrl(url, baseUri) {
      if (!tempDoc) {
        tempDoc = document.implementation.createHTMLDocument('temp');
        tempDocBase = tempDoc.createElement('base');
        tempDoc.head.appendChild(tempDocBase);
      }
      tempDocBase.href = baseUri;
      return resolve(url, tempDoc);
    }

    function getUrlResolver(ownerDocument) {
      return ownerDocument.__urlResolver || 
        (ownerDocument.__urlResolver = ownerDocument.createElement('a'));
    }

    var CSS_URL_RX = /(url\()([^)]*)(\))/g;
    var URL_ATTRS = {
      '*': ['href', 'src', 'style', 'url'],
      form: ['action']
    };
    var BINDING_RX = /\{\{|\[\[/;

    // exports
    Polymer.ResolveUrl = {
      resolveCss: resolveCss,
      resolveAttrs: resolveAttrs,
      resolveUrl: resolveUrl
    };

  })();

;


/**
 * Scans a template to produce an annotation object that stores expression 
 * metadata along with information to associate the metadata with nodes in an 
 * instance.
 *
 * Elements with `id` in the template are noted and marshaled into an 
 * the `$` hash in an instance. 
 * 
 * Example
 * 
 *     &lt;template>
 *       &lt;div id="foo">&lt;/div>
 *     &lt;/template>
 *     &lt;script>
 *      Polymer({
 *        task: function() {
 *          this.$.foo.style.color = 'red';
 *        }
 *      });
 *     &lt;/script>
 * 
 * Other expressions that are noted include:
 *
 * Double-mustache annotations in text content. The annotation must be the only
 * content in the tag, compound expressions are not (currently) supported.
 *
 *     <[tag]>{{path.to.host.property}}<[tag]>
 *
 * Double-mustache annotations in an attribute.
 *
 *     <[tag] someAttribute="{{path.to.host.property}}"><[tag]>
 *
 * Only immediate host properties can automatically trigger side-effects.
 * Setting `host.path` in the example above triggers the binding, setting
 * `host.path.to.host.property` does not.
 *
 * `on-` style event declarations.
 *
 *     <[tag] on-<event-name>="{{hostMethodName}}"><[tag]>
 *
 * Note: **the `annotations` feature does not actually implement the behaviors
 * associated with these expressions, it only captures the data**. 
 * 
 * Other optional features contain actual data implementations.
 *
 * @class standard feature: annotations
 */

/*

Scans a template to produce an annotation map that stores expression metadata
and information that associates the metadata to nodes in a template instance.

Supported annotations are:

  * id attributes
  * binding annotations in text nodes
    * double-mustache expressions: {{expression}}
    * double-bracket expressions: [[expression]]
  * binding annotations in attributes
    * attribute-bind expressions: name="{{expression}} || [[expression]]"
    * property-bind expressions: name*="{{expression}} || [[expression]]"
    * property-bind expressions: name:="expression"
  * event annotations
    * event delegation directives: on-<eventName>="expression"

Generated data-structure:

  [
    {
      id: '<id>',
      events: [
        {
          mode: ['auto'|''],
          name: '<name>'
          value: '<expression>'
        }, ...
      ],
      bindings: [
        {
          kind: ['text'|'attribute'|'property'],
          mode: ['auto'|''],
          name: '<name>'
          value: '<expression>'
        }, ...
      ],
      // TODO(sjmiles): confusingly, this is annotation-parent, not node-parent
      parent: <reference to parent annotation>,
      index: <integer index in parent's childNodes collection>
    },
    ...
  ]

TODO(sjmiles): this module should produce either syntactic metadata
(e.g. double-mustache, double-bracket, star-attr), or semantic metadata
(e.g. manual-bind, auto-bind, property-bind). Right now it's half and half.

*/

  Polymer.Base.addFeature({

    // registration-time

    _prepAnnotations: function() {
      if (!this._template) {
        this._annotes = [];
      } else {
        // TODO(sorvell): ad hoc method of plugging behavior into Annotations
        Polymer.Annotations.prepElement = this._prepElement.bind(this);
        this._annotes = Polymer.Annotations.parseAnnotations(this._template);
        Polymer.Annotations.prepElement = null;
      }
    },

    _prepElement: function(element) {
      Polymer.ResolveUrl.resolveAttrs(element, this._template.ownerDocument);
    },

    // instance-time

    findAnnotatedNode: Polymer.Annotations.findAnnotatedNode,

    // marshal all teh things
    _marshalAnnotationReferences: function() {
      if (this._template) {
        this._marshalIdNodes();
        this._marshalAnnotatedNodes();
        this._marshalAnnotatedListeners();
      }
    },

    // push configuration references at configure time
    _configureAnnotationReferences: function() {
      this._configureTemplateContent();
    },

    // nested template contents have been stored prototypically to avoid 
    // unnecessary duplication, here we put references to the 
    // indirected contents onto the nested template instances
    _configureTemplateContent: function() {
      this._annotes.forEach(function(note) {
        if (note.templateContent) {
          var template = this.findAnnotatedNode(this.root, note);
          template._content = note.templateContent;
        }
      }, this);
    },

    // construct `$` map (from id annotations)
    _marshalIdNodes: function() {
      this.$ = {};
      this._annotes.forEach(function(a) {
        if (a.id) {
          this.$[a.id] = this.findAnnotatedNode(this.root, a);
        }
      }, this);
    },

    // concretize `_nodes` map (from anonymous annotations)
    _marshalAnnotatedNodes: function() {
      if (this._nodes) {
        this._nodes = this._nodes.map(function(a) {
          return this.findAnnotatedNode(this.root, a);
        }, this);
      }
    },

    // install event listeners (from event annotations)
    _marshalAnnotatedListeners: function() {
      this._annotes.forEach(function(a) {
        if (a.events && a.events.length) {
          var node = this.findAnnotatedNode(this.root, a);
          a.events.forEach(function(e) {
            this.listen(node, e.name, e.value);
          }, this);
        }
      }, this);
    }

  });

;


(function(scope) {

 'use strict';

  var async = scope.Base.async;

  var Gestures = {
    gestures: {},

    // automate the event listeners for the native events
    // TODO(dfreedm): add a way to remove handlers.
    add: function(evType, node, handler) {
      // listen for events in order to "recognize" this event
      var g = this.gestures[evType];
      var gn = '_' + evType;
      var info = {started: false, abortTrack: false, oneshot: false};
      if (g && !node[gn]) {
        if (g.touchaction) {
          this._setupTouchAction(node, g.touchaction, info);
        }
        for (var i = 0, n, sn, fn; i < g.deps.length; i++) {
          n = g.deps[i];
          fn = g[n].bind(g, info);
          sn = '_' + evType + '-' + n;
          // store the handler on the node for future removal
          node[sn] = fn;
          node.addEventListener(n, fn);
        }
        node[gn] = 0;
      }
      // listen for the gesture event
      node[gn]++;
      node.addEventListener(evType, handler);
    },

    remove: function(evType, node, handler) {
      var g = this.gestures[evType];
      var gn = '_' + evType;
      if (g && node[gn]) {
        for (var i = 0, n, sn, fn; i < g.deps.length; i++) {
          n = g.deps[i];
          sn = '_' + evType + '-' + n;
          fn = node[sn];
          if (fn){
            node.removeEventListener(n, fn);
            // remove stored handler to allow GC
            node[sn] = undefined;
          }
        }
        node[gn] = node[gn] ? (node[gn] - 1) : 0;
        node.removeEventListener(evType, handler);
      }
    },

    register: function(recog) {
      this.gestures[recog.name] = recog;
    },

    // touch will make synthetic mouse events
    // preventDefault on touchend will cancel them,
    // but this breaks <input> focus and link clicks
    // Disabling "mouse" handlers for 500ms is enough

    _cancelFunction: null,

    cancelNextClick: function(timeout) {
      if (!this._cancelFunction) {
        timeout = timeout || 500;
        var self = this;
        var reset = function() {
          var cfn = self._cancelFunction;
          if (cfn) {
            clearTimeout(cfn.id);
            document.removeEventListener('click', cfn, true);
            self._cancelFunction = null;
          }
        };
        var canceller = function(e) {
          e.tapPrevented = true;
          reset();
        };
        canceller.id = setTimeout(reset, timeout);
        this._cancelFunction = canceller;
        document.addEventListener('click', canceller, true);
      }
    },

    // try to use the native touch-action, if it exists
    _hasNativeTA: typeof document.head.style.touchAction === 'string',

    // set scrolling direction on node to check later on first move
    // must call this before adding event listeners!
    setTouchAction: function(node, value) {
      if (this._hasNativeTA) {
        node.style.touchAction = value;
      }
      node.touchAction = value;
    },

    _setupTouchAction: function(node, value, info) {
      // reuse custom value on node if set
      var ta = node.touchAction;
      value = ta || value;
      // set an anchor point to see how far first move is
      node.addEventListener('touchstart', function(e) {
        var t = e.changedTouches[0];
        info.initialTouch = {x: t.clientX, y: t.clientY};
        info.abortTrack = false;
        info.oneshot = false;
      });
      node.addEventListener('touchmove', function(e) {
        // only run this once
        if (info.oneshot) {
          return;
        }
        info.oneshot = true;
        // "none" means always track
        if (value === 'none') {
          return;
        }
        // "auto" is default, always scroll
        // bail-out if touch-action did its job
        // the touchevent is non-cancelable if the page/area is scrolling
        if (value === 'auto' || !value || (ta && !e.cancelable)) {
          info.abortTrack = true;
          return;
        }
        // check first move direction
        // unfortunately, we can only make the decision in the first move,
        // so we have to use whatever values are available.
        // Typically, this can be a really small amount, :(
        var t = e.changedTouches[0];
        var x = t.clientX, y = t.clientY;
        var dx = Math.abs(info.initialTouch.x - x);
        var dy = Math.abs(info.initialTouch.y - y);
        // scroll in x axis, abort track if we move more in x direction
        if (value === 'pan-x') {
          info.abortTrack = dx >= dy;
          // scroll in y axis, abort track if we move more in y direction
        } else if (value === 'pan-y') {
          info.abortTrack = dy >= dx;
        }
      });
    },

    fire: function(target, type, detail, bubbles, cancelable) {
      return target.dispatchEvent(
        new CustomEvent(type, {
          detail: detail,
          bubbles: bubbles,
          cancelable: cancelable
        })
      );
    }

  };

  Gestures.register({
    name: 'track',
    touchaction: 'none',
    deps: ['mousedown', 'touchmove', 'touchend'],

    mousedown: function(info, e) {
      var t = e.currentTarget;
      var self = this;
      var movefn = function movefn(e, up) {
        if (!info.tracking && !up) {
          // set up tap prevention
          Gestures.cancelNextClick();
        }
        // first move is 'start', subsequent moves are 'move', mouseup is 'end'
        var state = up ? 'end' : (!info.started ? 'start' : 'move');
        info.started = true;
        self.fire(t, e, state);
        e.preventDefault();
      };
      var upfn = function upfn(e) {
        // call mousemove function with 'end' state
        movefn(e, true);
        info.started = false;
        // remove the temporary listeners
        document.removeEventListener('mousemove', movefn);
        document.removeEventListener('mouseup', upfn);
      };
      // add temporary document listeners as mouse retargets
      document.addEventListener('mousemove', movefn);
      document.addEventListener('mouseup', upfn);
    },

    touchmove: function(info, e) {
      var t = e.currentTarget;
      var ct = e.changedTouches[0];
      // if track was aborted, stop tracking
      if (info.abortTrack) {
        return;
      }
      e.preventDefault();
      // the first track event is sent after some hysteresis with touchmove.
      // Use `started` state variable to differentiate the "first" move from
      // the rest to make track.state == 'start'
      // first move is 'start', subsequent moves are 'move'
      var state = !info.started ? 'start' : 'move';
      info.started = true;
      this.fire(t, ct, state);
    },

    touchend: function(info, e) {
      var t = e.currentTarget;
      var ct = e.changedTouches[0];
      // only trackend if track was started and not aborted
      if (info.started && !info.abortTrack) {
        // reset started state on up
        info.started = false;
        var ne = this.fire(t, ct, 'end');
        // iff tracking, always prevent tap
        e.tapPrevented = true;
      }
    },

    fire: function(target, touch, state) {
      return Gestures.fire(target, 'track', {
        state: state,
        x: touch.clientX,
        y: touch.clientY
      });
    }

  });

  // dispatch a *bubbling* "tap" only at the node that is the target of the
  // generating event.
  // dispatch *synchronously* so that we can implement prevention of native
  // actions like links being followed.
  //
  // TODO(dfreedm): a tap should not occur when there's too much movement.
  // Right now, a tap can occur when a touchend happens very far from the
  // generating touch.
  // This *should* obviate the need for tapPrevented via track.
  Gestures.register({
    name: 'tap',
    deps: ['click', 'touchend'],

    click: function(info, e) {
      this.forward(e);
    },

    touchend: function(info, e) {
      Gestures.cancelNextClick();
      this.forward(e);
    },

    forward: function(e) {
      // prevent taps from being generated from events that have been
      // canceled (e.g. via cancelNextClick) or already handled via
      // a listener lower in the tree.
      if (!e.tapPrevented) {
        e.tapPrevented = true;
        this.fire(e.target);
      }
    },

    // fire a bubbling event from the generating target.
    fire: function(target) {
      Gestures.fire(target, 'tap', {}, true);
    }

  });

  scope.Gestures = Gestures;

})(Polymer);

;


  /**
   * Supports `listeners` and `keyPresses` objects.
   *
   * Example:
   *
   *     using('Base', function(Base) {
   *
   *       Polymer({
   *
   *         listeners: {
   *           // `click` events on the host are delegated to `clickHandler`
   *           'click': 'clickHandler'
   *         },
   *
   *         keyPresses: {
   *           // 'ESC' key presses are delegated to `escHandler`
   *           Base.ESC_KEY: 'escHandler'
   *         },
   *
   *         ...
   *
   *       });
   *
   *     });
   *
   * @class standard feature: events
   *
   */

  Polymer.Base.addFeature({

    listeners: {},

    _marshalListeners: function() {
      this._listenListeners(this.listeners);
      this._listenKeyPresses(this.keyPresses);
    },

    _listenListeners: function(listeners) {
      var node, name, key;
      for (key in listeners) {
        if (key.indexOf('.') < 0) {
          node = this;
          name = key;
        } else {
          name = key.split('.');
          node = this.$[name[0]];
          name = name[1];
        }
        this.listen(node, name, listeners[key]);
      }
    },

    listen: function(node, eventName, methodName) {
      var host = this;
      var handler = function(e) {
        if (host[methodName]) {
          host[methodName](e, e.detail);
        } else {
          console.warn('[%s].[%s]: event handler [%s] is null in scope (%o)',
            node.localName, eventName, methodName, host);
        }
      };
      switch (eventName) {
        case 'tap':
        case 'track':
          Polymer.Gestures.add(eventName, node, handler);
          break;

        default:
          node.addEventListener(eventName, handler);
          break;
      }
    },

    keyPresses: {},

    _listenKeyPresses: function(keyPresses) {
      // for..in here to gate empty keyPresses object (iterates once or never)
      for (var n in keyPresses) {
        // only get here if there is something in keyPresses
        // TODO(sjmiles): _keyPressesFeatureHandler uses `this.keyPresses`
        // to look up keycodes, it's not agnostic like this method is
        this.addEventListener('keydown', this._keyPressesFeatureHandler);
        // map string keys to numeric codes
        for (n in keyPresses) {
          if (typeof n === 'string') {
            keyPresses[this.eventKeyCodes[n]] = keyPresses[n];
          }
        }
        break;
      }
    },

    _keyPressesFeatureHandler: function(e) {
      var method = this.keyPresses[e.keyCode];
      if (method && this[method]) {
        return this[method](e.keyCode, e);
      }
    },

    eventKeyCodes: {
      ESC_KEY: 27,
      ENTER_KEY: 13,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40
    }

  });

;


Polymer.Async = (function() {
  
  var currVal = 0;
  var lastVal = 0;
  var callbacks = [];
  var twiddle = document.createTextNode('');

  function runAsync(callback, waitTime) {
    if (waitTime > 0) {
      return ~setTimeout(callback, waitTime);
    } else {
      twiddle.textContent = currVal++;
      callbacks.push(callback);
      return currVal - 1;
    }
  }

  function cancelAsync(handle) {
    if (handle < 0) {
      clearTimeout(~handle);
    } else {
      var idx = handle - lastVal;
      if (idx >= 0) {
        if (!callbacks[idx]) {
          throw 'invalid async handle: ' + handle;
        }
        callbacks[idx] = null;
      }
    }
  }

  function atEndOfMicrotask() {
    var len = callbacks.length;
    for (var i=0; i<len; i++) {
      var cb = callbacks[i];
      if (cb) {
        cb();
      }
    }
    callbacks.splice(0, len);
    lastVal += len;
  }

  new (window.MutationObserver || JsMutationObserver)(atEndOfMicrotask)
    .observe(twiddle, {characterData: true})
    ;
  
  // exports 

  return {
    run: runAsync,
    cancel: cancelAsync
  };
  
})();

;


Polymer.Debounce = (function() {
  
  // usage
  
  // invoke cb.call(this) in 100ms, unless the job is re-registered,
  // which resets the timer
  // 
  // this.job = this.debounce(this.job, cb, 100)
  //
  // returns a handle which can be used to re-register a job

  var Async = Polymer.Async;
  
  var Debouncer = function(context) {
    this.context = context;
    this.boundComplete = this.complete.bind(this);
  };
  
  Debouncer.prototype = {
    go: function(callback, wait) {
      var h;
      this.finish = function() {
        Async.cancel(h);
      };
      h = Async.run(this.boundComplete, wait);
      this.callback = callback;
    },
    stop: function() {
      if (this.finish) {
        this.finish();
        this.finish = null;
      }
    },
    complete: function() {
      if (this.finish) {
        this.stop();
        this.callback.call(this.context);
      }
    }
  };

  function debounce(debouncer, callback, wait) {
    if (debouncer) {
      debouncer.stop();
    } else {
      debouncer = new Debouncer(this);
    }
    debouncer.go(callback, wait);
    return debouncer;
  }
  
  // exports 

  return debounce;
  
})();

;


  Polymer.Base.addFeature({

    $$: function(slctr) {
      return Polymer.dom(this.root).querySelector(slctr);
    },

    toggleClass: function(name, bool, node) {
      node = node || this;
      if (arguments.length == 1) {
        bool = !node.classList.contains(name);
      }
      if (bool) {
        node.classList.add(name);
      } else {
        node.classList.remove(name);
      }
    },

    toggleAttribute: function(name, bool, node) {
      (node || this)[bool ? 'setAttribute' : 'removeAttribute'](name, '');
    },

    classFollows: function(className, neo, old) {
      if (old) {
        old.classList.remove(className);
      }
      if (neo) {
        neo.classList.add(className);
      }
    },

    attributeFollows: function(name, neo, old) {
      if (old) {
        old.removeAttribute(name);
      }
      if (neo) {
        neo.setAttribute(name, '');
      }
    },

    getContentChildNodes: function(slctr) {
      return Polymer.dom(Polymer.dom(this.root).querySelector(
          slctr || 'content')).getDistributedNodes();
    },

    getContentChildren: function(slctr) {
      return this.getContentChildNodes(slctr).filter(function(n) {
        return (n.nodeType === Node.ELEMENT_NODE);
      });
    },

    // TODO(sjmiles): use a dictionary for options after `detail`
    fire: function(type, detail, onNode, bubbles, cancelable) {
      var node = onNode || this;
      var detail = (detail === null || detail === undefined) ? {} : detail;
      var event = new CustomEvent(type, {
        bubbles: bubbles !== undefined ? bubbles : true,
        cancelable: cancelable !== undefined ? cancelable : true,
        detail: detail
      });
      node.dispatchEvent(event);
      return event;
    },

    async: function(method, waitTime) {
      return Polymer.Async.run(method.bind(this), waitTime);
    },

    cancelAsync: function(handle) {
      Polymer.Async.cancel(handle);
    },

    arrayDelete: function(array, item) {
      var index = array.indexOf(item);
      if (index >= 0) {
        return array.splice(index, 1);
      }
    },

    transform: function(node, transform) {
      node.style.webkitTransform = transform;
      node.style.transform = transform;
    },

    translate3d: function(node, x, y, z) {
      this.transform(node, 'translate3d(' + x + ',' + y + ',' + z + ')');
    },

    importHref: function(href, onload, onerror) {
      var l = document.createElement('link');
      l.rel = 'import';
      l.href = href;
      if (onload) {
        l.onload = onload.bind(this);
      }
      if (onerror) {
        l.onerror = onerror.bind(this);
      }
      document.head.appendChild(l);
      return l;
    },

    /**
     * Debounce signals.
     *
     * Call `debounce` to collapse multiple requests for a named task into
     * one invocation which is made after the wait time has elapsed with
     * no new request.
     *
     *     debouncedClickAction: function(e) {
     *       // will not call `processClick` more than once per 100ms
     *       this.debounce('click', function() {
     *        this.processClick;
     *       }, 100);
     *     }
     *
     * @method debounce
     * @param String {String} jobName A string to indentify the debounce job.
     * @param Function {Function} callback A function that is called (with `this` context) when the wait time elapses.
     * @param Number {Number} wait Time in milliseconds (ms) after the last signal that must elapse before invoking `callback`
     * @type Handle
     */
    debounce: function(jobName, callback, wait) {
      this._debounce('_job_' + jobName, callback, wait);
    },

    _debounce: function(job, callback, wait) {
      this[job] = Polymer.Debounce.call(this, this[job], callback, wait);
    },

    create: function(tag, props) {
      var elt = document.createElement(tag);
      if (props) {
        for (var n in props) {
          elt[n] = props[n];
        }
      }
      return elt;
    }

  });

;


  Polymer.Bind = {

    // for prototypes (usually)

    prepareModel: function(model) {
      model._propertyEffects = {};
      model._bindListeners = [];
      // TODO(sjmiles): no mixin function?
      var api = this._modelApi;
      for (var n in api) {
        model[n] = api[n];
      }
    },

    _modelApi: {

      _notifyChange: function(property) {
        var eventName = Polymer.CaseMap.camelToDashCase(property) + '-changed';
        // TODO(sjmiles): oops, `fire` doesn't exist at this layer
        this.fire(eventName, {
          value: this[property]
        }, null, false);
      },

      // TODO(sjmiles): removing _notifyListener from here breaks accessors.html
      // as a standalone lib. This is temporary, as standard/configure.html
      // installs it's own version on Polymer.Base, and we need that to work
      // right now.
      // NOTE: exists as a hook for processing listeners
      /*
      _notifyListener: function(fn, e) {
        // NOTE: pass e.target because e.target can get lost if this function
        // is queued asynchrously
        return fn.call(this, e, e.target);
      },
      */

      _propertySet: function(property, value, effects) {
        var old = this._data[property];
        if (old !== value) {
          this._data[property] = value;
          if (typeof value == 'object') {
            this._clearPath(property);
          }
          if (effects) {
            this._effectEffects(property, value, effects, old);
          }
        }
        return old;
      },

      _effectEffects: function(property, value, effects, old) {
        effects.forEach(function(fx) {
          //console.log(fx);
          var fn = Polymer.Bind[fx.kind + 'Effect'];
          if (fn) {
            fn.call(this, property, value, fx.effect, old);
          }
        }, this);
      },

      _clearPath: function(path) {
        for (var prop in this._data) {
          if (prop.indexOf(path + '.') === 0) {
            this._data[prop] = undefined;
          }
        }
      }

    },

    // a prepared model can acquire effects

    addPropertyEffect: function(model, property, kind, effect) {
      var fx = model._propertyEffects[property];
      if (!fx) {
        fx = model._propertyEffects[property] = [];
      }
      fx.push({
        kind: kind,
        effect: effect
      });
    },

    createBindings: function(model) {
      //console.group(model.is);
      // map of properties to effects
      var fx$ = model._propertyEffects;
      if (fx$) {
        // for each property with effects
        for (var n in fx$) {
          // array of effects
          var fx = fx$[n];
          // effects have priority
          fx.sort(this._sortPropertyEffects);
          // create accessors
          this._createAccessors(model, n, fx);
        }
      }
      //console.groupEnd();
    },

    _sortPropertyEffects: (function() {
      // TODO(sjmiles): EFFECT_ORDER buried this way is not ideal,
      // but presumably the sort method is going to be a hot path and not
      // have a `this`. There is also a problematic dependency on effect.kind
      // values here, which are otherwise pluggable.
      var EFFECT_ORDER = {
        'compute': 0,
        'annotation': 1,
        'computedAnnotation': 2,
        'reflect': 3,
        'notify': 4,
        'observer': 5,
        'function': 6
      };
      return function(a, b) {
        return EFFECT_ORDER[a.kind] - EFFECT_ORDER[b.kind];
      };
    })(),

    // create accessors that implement effects

    _createAccessors: function(model, property, effects) {
      var defun = {
        get: function() {
          // TODO(sjmiles): elide delegation for performance, good ROI?
          return this._data[property];
        }
      };
      var setter = function(value) {
        this._propertySet(property, value, effects);
      };
      // ReadOnly properties have a private setter only
      // TODO(kschaaf): Per current Bind factoring, we shouldn't
      // be interrogating the prototype here
      if (model.isReadOnlyProperty && model.isReadOnlyProperty(property)) {
        //model['_' + property + 'Setter'] = setter;
        //model['_set_' + property] = setter;
        model['_set' + this.upper(property)] = setter;
      } else {
        defun.set = setter;
      }
      Object.defineProperty(model, property, defun);
    },

    upper: function(name) {
      return name[0].toUpperCase() + name.substring(1);
    },

    _addAnnotatedListener: function(model, index, property, path, event) {
      var fn = this._notedListenerFactory(property, path,
        this._isStructured(path), this._isEventBogus);
      var eventName = event ||
        (Polymer.CaseMap.camelToDashCase(property) + '-changed');
      model._bindListeners.push({
        index: index,
        property: property,
        path: path,
        changedFn: fn,
        event: eventName
      });
    },

    _isStructured: function(path) {
      return path.indexOf('.') > 0;
    },

    _isEventBogus: function(e, target) {
      return e.path && e.path[0] !== target;
    },

    _notedListenerFactory: function(property, path, isStructured, bogusTest) {
      return function(e, target) {
        if (!bogusTest(e, target)) {
          if (e.detail && e.detail.path) {
            this.notifyPath(this._fixPath(path, property, e.detail.path),
              e.detail.value);
          } else {
            var value = target[property];
            if (!isStructured) {
              this[path] = target[property];
            } else {
              // TODO(kschaaf): dirty check avoids null references when the object has gone away
              if (this._data[path] != value) {
                this.setPathValue(path, value);
              }
            }
          }
        }
      };
    },

    // for instances

    prepareInstance: function(inst) {
      inst._data = Object.create(null);
    },

    setupBindListeners: function(inst) {
      inst._bindListeners.forEach(function(info) {
        // Property listeners:
        // <node>.on.<property>-changed: <path]> = e.detail.value
        //console.log('[_setupBindListener]: [%s][%s] listening for [%s][%s-changed]', this.localName, info.path, info.id || info.index, info.property);
        var node = inst._nodes[info.index];
        node.addEventListener(info.event, inst._notifyListener.bind(inst, info.changedFn));
      });
    }

  };

;


  Polymer.Base.extend(Polymer.Bind, {

    _shouldAddListener: function(info) {
      return info.name &&
             info.mode === '{' &&
             !info.negate &&
             info.kind != 'attribute'
             ;
    },

    annotationEffect: function(source, value, info) {
      if (source != info.value) {
        value = this.getPathValue(info.value);
      }
      var calc = info.negate ? !value : value;
      return this._applyEffectValue(calc, info);
    },

    reflectEffect: function(source) {
      this.reflectPropertyToAttribute(source);
    },

    notifyEffect: function(source) {
      this._notifyChange(source);
    },

    observerEffect: function(source, value, info, old) {
      //console.log(value, info);
      if (info.property) {
        this[info.method](value, old);
      } else {
        var args = Polymer.Bind._marshalArgs(this._data, info.properties);
        if (args) {
          this[info.method].apply(this, args);
        }
      }
    },

    computeEffect: function(source, value, info) {
      var args = Polymer.Bind._marshalArgs(this._data, info.args);
      if (args) {
        this[info.property] = this[info.methodName].apply(this, args);
      }
    },

    annotatedComputationEffect: function(source, value, info) {
      var args = Polymer.Bind._marshalArgs(this._data, info.args);
      if (args) {
        var value = this[info.methodName].apply(this, args);
        this._applyEffectValue(value, info);
      }
    },

    _marshalArgs: function(model, properties) {
      var a=[];
      for (var i=0, l=properties.length, v; i<l; i++) {
        v = model[properties[i]];
        if (v === undefined) {
          return;
        }
        a[i] = v;
      }
      return a;
    }

  });

;


  /**
   * Support for the declarative property sugaring via mustache `{{ }}`
   * annotations in templates, and via the `properties` objects on
   * prototypes.
   *
   * Example:
   *
   *     <template>
   *       <span hidden="{{hideSpan}}">{{name}}</span> is on the hook.
   *     </template>
   *
   * The `properties` object syntax is as follows:
   *
   *     Polymer({
   *
   *       properties: {
   *         myProp: {
   *           observer: 'myPropChanged',
   *           computed: 'computemyProp(input1, input2)'
   *         }
   *       }
   *
   *       ...
   *
   *     });
   *
   * The `bind` feature also provides an API for registering effects against
   * properties.
   *
   * Property effects can be created imperatively, by template-annotations
   * (e.g. mustache notation), or by declaration in the `properties` object.
   *
   * The effect data is consumed by the `bind` subsystem (`/src/bind/*`),
   * which compiles the effects into efficient JavaScript that is triggered,
   * e.g., when a property is set to a new value.
   *
   * @class data feature: bind
   */

  Polymer.Base.addFeature({

    _addPropertyEffect: function(property, kind, effect) {
     // TODO(sjmiles): everything to the right of the first '.' is lost, implies
     // there is some duplicate information flow (not the only sign)
     var model = property.split('.').shift();
     Polymer.Bind.addPropertyEffect(this, model, kind, effect);
    },

    // prototyping

    _prepEffects: function() {
      Polymer.Bind.prepareModel(this);
      this._addPropertyEffects(this.properties);
      this._addObserverEffects(this.observers);
      this._addAnnotationEffects(this._annotes);
      Polymer.Bind.createBindings(this);
    },

    _addPropertyEffects: function(effects) {
      if (effects) {
        for (var n in effects) {
          var effect = effects[n];
          if (effect.observer) {
            this._addObserverEffect(n, effect.observer);
          }
          if (effect.computed) {
            this._addComputedEffect(n, effect.computed);
          }
          if (this.isNotifyProperty(n)) {
            this._addPropertyEffect(n, 'notify');
          }
          if (this.isReflectedProperty(n)) {
            this._addPropertyEffect(n, 'reflect');
          }
        }
      }
    },

    _addComputedEffect: function(name, expression) {
      var index = expression.indexOf('(');
      var method = expression.slice(0, index);
      var args = expression.slice(index + 1, -1).replace(/ /g, '').split(',');
      //console.log('%c on [%s] compute [%s] via [%s]', 'color: green', args[0], name, method);
      var effect = {
        property: name,
        args: args,
        methodName: method
      };
      for (var i=0; i<args.length; i++) {
        this._addPropertyEffect(args[i], 'compute', effect);
      }
    },

    _addObserverEffects: function(effects) {
      for (var n in effects) {
        this._addObserverEffect(n, effects[n]);
      }
    },

    _addObserverEffect: function(property, observer) {
      var effect = {
        method: observer
      };
      var props = property.split(' ');
      if (props.length == 1) {
        // Single property synchronous observer (supports paths)
        var model = property.split('.').shift();
        if (model != property) {
          // TODO(kschaaf): path observers won't get the right `new` argument
          this.addPathObserver(property, observer);
        }
        effect.property = model;
        this._addPropertyEffect(model, 'observer', effect);
      } else {
        // Multiple-property observer
        effect.properties = props;
        for (var i=0, l=props.length; i<l; i++) {
          this._addPropertyEffect(props[i], 'observer', effect);
        }
      }
    },

    _addAnnotationEffects: function(effects) {
      // create a virtual annotation list, must be concretized at instance time
      this._nodes = [];
      // process annotations that have been parsed from template
      effects.forEach(function(note) {
        // where to find the node in the concretized list
        var index = this._nodes.push(note) - 1;
        note.bindings.forEach(function(effect) {
          this._addAnnotationEffect(effect, index);
        }, this);
      }, this);
    },

    _addAnnotationEffect: function(effect, index) {
      // TODO(sjmiles): annotations have 'effects' proper and 'listener'
      if (Polymer.Bind._shouldAddListener(effect)) {
        // <node>.on.<dash-case-property>-changed: <path> = e.detail.value
        Polymer.Bind._addAnnotatedListener(this, index,
          effect.name, effect.value, effect.event);
      }
      var computed = effect.value.match(/(\w*)\((.*)\)/);
      if (computed) {
        var method = computed[1];
        var args = computed[2].split(/[^\w]+/);
        this._addAnnotatedComputationEffect(method, args, effect, index);
      } else {
        // capture the node index
        effect.index = index;
        // discover top-level property (model) from path
        var model = effect.value.split('.').shift();
        // add 'annotation' binding effect for property 'model'
        this._addPropertyEffect(model, 'annotation', effect);
      }
    },

    _addAnnotatedComputationEffect: function(method, args, info, index) {
      var effect = {
        kind: info.kind,
        property: info.name,
        index: index,
        args: args,
        methodName: method
      };
      for (var i=0, l=args.length; i<l; i++) {
        this._addPropertyEffect(args[i], 'annotatedComputation', effect);
      }
    },

    // instancing

    _marshalInstanceEffects: function() {
      Polymer.Bind.prepareInstance(this);
      Polymer.Bind.setupBindListeners(this);
    },

    _applyEffectValue: function(value, info) {
      var node = this._nodes[info.index];
      // TODO(sorvell): ideally, the info object is normalized for easy 
      // lookup here.
      var property = info.property || info.name || 'textContent';
      // TODO(sorvell): consider pre-processing this step so we don't need
      // this lookup.
      if (info._class === undefined) {
        info._class = (property === 'class' || property === 'className');
      }
      if (info._class) {
        value = this._scopeElementClass(node, value);
      }
      if (info.kind == 'attribute') {
        this.serializeValueToAttribute(value, property, node);
      } else {
        return node[property] = value;
      }
    }

  });

;


  /*
    Process inputs efficiently via a configure lifecycle callback.
    Configure is called top-down, host before local dom. Users should 
    implement configure to supply a set of default values for the element by 
    returning an object containing the properties and values to set.

    Configured values are not immediately set, instead they are set when 
    an element becomes ready, after its local dom is ready. This ensures
    that any user change handlers are not called before ready time.

  */

  /*
  Implementation notes:

  Configured values are collected into _config. At ready time, properties
  are set to the values in _config. This ensures properties are set child
  before host and change handlers are called only at ready time. The host
  will reset a value already propagated to a child, but this is not 
  inefficient because of dirty checking at the set point.

  Bind notification events are sent when properties are set at ready time
  and thus received by the host before it is ready. Since notifications result
  in property updates and this triggers side effects, handling notifications
  is deferred until ready time.

  In general, events can be heard before an element is ready. This may occur 
  when a user sends an event in a change handler or listens to a data event
  directly (on-foo-changed).
  */

  Polymer.Base.addFeature({

    // storage for configuration
    _setupConfigure: function(initialConfig) {
      this._config = initialConfig || {};
      this._handlers = [];
    },

    // static attributes are deserialized into _config
    _takeAttributes: function() {
      this._takeAttributesToModel(this._config);
    },

    // at configure time values are stored in _config
    _configValue: function(name, value) {
      this._config[name] = value;
    },

    // configure: returns user supplied default property values
    // combines with _config to create final property values
    _configure: function() {
      this._configureAnnotationReferences();
      var i;
      // get individual default values from property config
      var config = {};
      for (i in this.properties) {
        var c = this.properties[i];
        if (c.value !== undefined) {
          if (typeof c.value == 'function') {
            config[i] = c.value.call(this, this._config);
          } else {
            config[i] = c.value;
          }
        }
      }
      // get add'l default values from central configure 
      this.simpleMixin(config, this.configure(this._config));
      // combine defaults returned from configure with inputs in _config
      this.simpleMixin(config, this._config);
      // this is the new _config, which are the final values to be applied
      this._config = config;
      // pass configuration data to bindings
      this._distributeConfig(this._config);
    },

    simpleMixin: function(a, b) {
      for (var i in b) {
        a[i] = b[i];
      }
    },

    // distribute config values to bound nodes.
    _distributeConfig: function(config) {
      var fx$ = this._propertyEffects;
      if (fx$) {
        for (var p in config) {
          var fx = fx$[p];
          if (fx) {
            for (var i=0, l=fx.length, x; (i<l) && (x=fx[i]); i++) {
              if (x.kind === 'annotation') {
                var node = this._nodes[x.effect.index];
                // seeding configuration only
                if (node._configValue) {
                  var value = (p === x.effect.value) ? config[p] :
                    this.getPathValue(x.effect.value, config);
                  node._configValue(x.effect.name, value);
                }
              }
            }
          }
        }
      }
    },

    _beforeReady: function() {
      this._applyConfig(this._config);
      this._flushHandlers();
    },

    // NOTE: values are already propagated to children via 
    // _distributeConfig so propagation triggered by effects here is 
    // redundant, but safe due to dirty checking
    _applyConfig: function(config) {
      for (var n in config) {
        // Don't stomp on values that may have been set by other side effects
        if (this[n] === undefined) {
          this[n] = config[n];
        }
      }
    },

    // NOTE: Notifications can be processed before ready since
    // they are sent at *child* ready time. Since notifications cause side
    // effects and side effects must not be processed before ready time,
    // handling is queue/defered until then.
    _notifyListener: function(fn, e) {
      if (!this._readied) {
        this._queueHandler([fn, e, e.target]);
      } else {
        return fn.call(this, e, e.target);
      }
    },

    _queueHandler: function(args) {
      this._handlers.push(args);
    },

    _flushHandlers: function() {
      var h$ = this._handlers;
      for (var i=0, l=h$.length, h; (i<l) && (h=h$[i]); i++) {
        h[0].call(this, h[1], h[2]);
      }
    }

  });

;


  /**
   * Changes to an object sub-field (aka "path") via a binding
   * (e.g. `<x-foo value="{{item.subfield}}"`) will notify other elements bound to
   * the same object automatically.
   *
   * When modifying a sub-field of an object imperatively
   * (e.g. `this.item.subfield = 42`), in order to have the new value propagated
   * to other elements, a special `setPathValue(path, value)` API is provided.
   * `setPathValue` sets the object field at the path specified, and then notifies the
   * binding system so that other elements bound to the same path will update.
   *
   * Example:
   *
   *     Polymer({
   *
   *       is: 'x-date',
   *
   *       properties: {
   *         date: {
   *           type: Object,
   *           notify: true
   *          }
   *       },
   *
   *       attached: function() {
   *         this.date = {};
   *         setInterval(function() {
   *           var d = new Date();
   *           // Required to notify elements bound to date of changes to sub-fields
   *           // this.date.seconds = d.getSeconds(); <-- Will not notify
   *           this.setPathValue('date.seconds', d.getSeconds());
   *           this.setPathValue('date.minutes', d.getMinutes());
   *           this.setPathValue('date.hours', d.getHours() % 12);
   *         }.bind(this), 1000);
   *       }
   *
   *     });
   *
   *  Allows bindings to `date` sub-fields to update on changes:
   *
   *     <x-date date="{{date}}"></x-date>
   *
   *     Hour: <span>{{date.hours}}</span>
   *     Min:  <span>{{date.minutes}}</span>
   *     Sec:  <span>{{date.seconds}}</span>
   *
   * @class data feature: path notification
   */

  Polymer.Base.addFeature({
    /**
      Notify that a path has changed. For example:

          this.item.user.name = 'Bob';
          this.notifyPath('item.user.name', this.item.user.name);

      Returns true if notification actually took place, based on
      a dirty check of whether the new value was already known
    */
    notifyPath: function(path, value, fromAbove) {
      var old = this._propertySet(path, value);
      // manual dirty checking for now...
      if (old !== value) {
        //console.group(this.localName + '#' + this.id + ' ' + path);
        // Take path effects at this level for exact path matches,
        // and notify down for any bindings to a subset of this path
        this._pathEffector(path, value);
        // Send event to notify the path change upwards
        // Optimization: don't notify up if we know the notification
        // is coming from above already (avoid wasted event dispatch)
        if (!fromAbove) {
          // TODO(sorvell): should only notify if notify: true?
          this._notifyPath(path, value);
        }
        //console.groupEnd(this.localName + '#' + this.id + ' ' + path);
      }
    },

    /**
      Convienence method for setting a value to a path and calling
      notify path
    */
    setPathValue: function(path, value) {
      var parts = path.split('.');
      if (parts.length > 1) {
        var last = parts.pop();
        var prop = this;
        while (parts.length) {
          prop = prop[parts.shift()];
          if (!prop) {
            return;
          }
        }
        // TODO(kschaaf): want dirty-check here?
        // if (prop[last] !== value) {
          prop[last] = value;
          this.notifyPath(path, value);
        // }
      } else {
        this[path] = value;
      }
    },

    getPathValue: function(path, root) {
      var parts = path.split('.');
      var last = parts.pop();
      var prop = root || this;
      while (parts.length) {
        prop = prop[parts.shift()];
        if (!prop) {
          return;
        }
      }
      return prop[last];
    },

    addPathObserver: function(path, method) {
      var fx$ = this._pathEffects || (this._pathEffects = []);
      var match = path.indexOf('.*') == (path.length-2);
      if (match) {
        path = path.slice(0, -2);
      }
      fx$.push({path: path, match: match, method: method});
    },

    // TODO(kschaaf): This machine can be optimized to memoize compiled path
    // effectors as new paths are notified for performance, since it involves
    // a fair amount of runtime lookup
    _pathEffector: function(path, value) {
      // get root property
      var model = this._modelForPath(path);
      // search property effects of the root property for 'annotation' effects
      var fx$ = this._propertyEffects[model];
      if (fx$) {
        fx$.forEach(function(fx) {
          if (fx.kind === 'annotation') {
            // locate the bound node
            var n = this._nodeForBinding(fx.effect);
            if (n) {
              // perform the effect
              this._performAnnotationPathEffect(n, path, value, fx.effect);
            }
          }
        }, this);
      }
      // iterate and perform _pathEffects matching path
      if (this._pathEffects) {
        this._pathEffects.forEach(function(fx) {
          this._performPathEffect(path, value, fx);
        }, this);
      }
      // notify runtime-bound paths
      if (this._boundPaths) {
        this._notifyBoundPaths(path, value);
      }
    },

    _nodeForBinding: function(info) {
      return info.id ? this.$[info.id] : this._nodes[info.index];
    },

    _performAnnotationPathEffect: function(node, path, value, effect) {
      if (effect.value === path || effect.value.indexOf(path + '.') === 0) {
        // TODO(sorvell): ideally the effect function is on this prototype
        // so we don't have to call it like this.
        Polymer.Bind.annotationEffect.call(this, path, value, effect);
        // path == item.stuff.count
        // value == item.stuff
        // name == zizz
        // calls effect n.notifyPath for zizz.count
      } else if ((path.indexOf(effect.value + '.') === 0) &&
                  node.notifyPath && !effect.negate) {
        var p = this._fixPath(effect.name , effect.value, path);
        node.notifyPath(p, value, true);
      }
    },

    _performPathEffect: function(path, value, fx) {
      if (fx.path == path || (fx.match && path.indexOf(fx.path) === 0)) {
        var fn = this[fx.method];
        if (fn) {
          // TODO(kschaaf): sending null for old; no good way to get it?
          fn.call(this, value, null, path);
        }
      }
    },

    bindPaths: function(to, from) {
      this._boundPaths = this._boundPaths || {};
      if (from) {
        this._boundPaths[to] = from;
        // this.setPathValue(to, this.getPathValue(from));
      } else {
        this.unbindPath(to);
        // this.setPathValue(to, from);
      }
    },

    unbindPaths: function(path) {
      if (this._boundPaths) {
        delete this._boundPaths[path];
      }
    },

    _notifyBoundPaths: function(path, value) {
      var from, to;
      for (var a in this._boundPaths) {
        var b = this._boundPaths[a];
        if (path.indexOf(a + '.') == 0) {
          from = a;
          to = b;
          break;
        }
        if (path.indexOf(b + '.') == 0) {
          from = b;
          to = a;
          break;
        }
      }
      if (from && to) {
        var p = this._fixPath(to, from, path);
        this.notifyPath(p, value);
      }
    },

    _fixPath: function(property, root, path) {
      return property + path.slice(root.length);
    },

    _notifyPath: function(path, value) {
      var rootName = this._modelForPath(path);
      var dashCaseName = Polymer.CaseMap.camelToDashCase(rootName);
      var eventName = dashCaseName + this._EVENT_CHANGED;
      this.fire(eventName, {
        path: path,
        value: value
      }, null, false);
    },

    _modelForPath: function(path) {
      return path.split('.').shift();
    },

    _EVENT_CHANGED: '-changed',

  });

;


  Polymer.Base.addFeature({

    resolveUrl: function(url) {
      // TODO(sorvell): do we want to put the module reference on the prototype?
      var module = Polymer.DomModule.import(this.is);
      var root = '';
      if (module) {
        var assetPath = module.getAttribute('assetpath') || '';
        root = Polymer.ResolveUrl.resolveUrl(assetPath, module.ownerDocument.baseURI);
      }
      return Polymer.ResolveUrl.resolveUrl(url, root);
    }

  });

;


/*
  Extremely simple css parser. Intended to be not more than what we need
  and definitely not necessarly correct =).
*/
(function() {

  // given a string of css, return a simple rule tree
  function parse(text) {
    text = clean(text);
    return parseCss(lex(text), text);
  }

  // remove stuff we don't care about that may hinder parsing
  function clean(cssText) {
    return cssText.replace(rx.comments, '').replace(rx.port, '');
  }

  // super simple {...} lexer that returns a node tree
  function lex(text) {
    var root = {start: 0, end: text.length};
    var n = root;
    for (var i=0, s=0, l=text.length; i < l; i++) {
      switch (text[i]) {
        case OPEN_BRACE:
          //console.group(i);
          if (!n.rules) {
            n.rules = [];
          }
          var p = n;
          var previous = p.rules[p.rules.length-1];
          n = {start: i+1, parent: p, previous: previous};
          p.rules.push(n);
          break;
        case CLOSE_BRACE: 
          //console.groupEnd(n.start);
          n.end = i+1;
          n = n.parent || root;
          break;
      }
    }
    return root;
  }

  // add selectors/cssText to node tree
  function parseCss(node, text) {
    var t = text.substring(node.start, node.end-1);
    node.cssText = t.trim();
    if (node.parent) {
      var ss = node.previous ? node.previous.end : node.parent.start;
      t = text.substring(ss, node.start-1);
      // TODO(sorvell): ad hoc; make selector include only after last ;
      // helps with mixin syntax
      t = t.substring(t.lastIndexOf(';')+1);
      node.selector = t.trim();
    }
    var r$ = node.rules;
    if (r$) {
      for (var i=0, l=r$.length, r; (i<l) && (r=r$[i]); i++) {
        parseCss(r, text);
      }  
    }
    return node;  
  }

  // stringify parsed css.
  function stringify(node, text) {
    text = text || '';
    // calc rule cssText
    var cssText = '';
    if (node.cssText || node.rules) {
      var r$ = node.rules;
      if (r$ && !hasMixinRules(r$)) {
        for (var i=0, l=r$.length, r; (i<l) && (r=r$[i]); i++) {
          cssText = stringify(r, cssText);
        }  
      } else {
        cssText = removeCustomProps(node.cssText).trim();
        if (cssText) {
          cssText = '  ' + cssText + '\n';
        }
      }
    }
    // emit rule iff there is cssText
    if (cssText) {
      if (node.selector) {
        text += node.selector + ' ' + OPEN_BRACE + '\n';
      }
      text += cssText;
      if (node.selector) {
        text += CLOSE_BRACE + '\n\n';
      }
    }
    return text;
  }

  var OPEN_BRACE = '{';
  var CLOSE_BRACE = '}';

  function hasMixinRules(rules) {
    return (rules[0].selector.indexOf(VAR_START) >= 0);
  }

  function removeCustomProps(cssText) {
    return cssText
      .replace(rx.customProp, '')
      .replace(rx.mixinProp, '')
      .replace(rx.mixinApply, '');
  }

  var VAR_START = '--';

  // helper regexp's
  var rx = {
    comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
    port: /@import[^;]*;/gim,
    customProp: /--[^;{]*?:[^{};]*?;/gim,
    mixinProp: /--[^;{]*?:[^{;]*?{[^}]*?}/gim,
    mixinApply: /@mixin[\s]*\([^)]*?\)[\s]*;/gim
  };

  // exports 
  Polymer.CssParse = {
    parse: parse,
    stringify: stringify
  };

})();

;


  (function() {

    function toCssText(rules, callback) {
      if (typeof rules === 'string') {
        rules = Polymer.CssParse.parse(rules);
      } 
      if (callback) {
        forEachStyleRule(rules, callback);
      }
      return Polymer.CssParse.stringify(rules);
    }

    function forEachStyleRule(node, cb) {
      var s = node.selector;
      var skipRules = false;
      if (s) {
        if ((s.indexOf(AT_RULE) !== 0) && (s.indexOf(MIXIN_SELECTOR) !== 0)) {
          cb(node);
        }
        skipRules = (s.indexOf(KEYFRAME_RULE) >= 0) || 
          (s.indexOf(MIXIN_SELECTOR) >= 0);
      }
      var r$ = node.rules;
      if (r$ && !skipRules) {
        for (var i=0, l=r$.length, r; (i<l) && (r=r$[i]); i++) {
          forEachStyleRule(r, cb);
        }
      }
    }

    // add a string of cssText to the document.
    function applyCss(cssText, moniker, target, lowPriority) {
      var style = document.createElement('style');
      if (moniker) {
        style.setAttribute('scope', moniker);
      }
      style.textContent = cssText;
      target = target || document.head;
      if (lowPriority) {
        var n$ = target.querySelectorAll('style[scope]');
        var ref = n$.length ? n$[n$.length-1].nextSibling : target.firstChild;
        target.insertBefore(style, ref);
     } else {
        target.appendChild(style);
      }
      return style;
    }

    var AT_RULE = '@';
    var KEYFRAME_RULE = 'keyframe';
    var MIXIN_SELECTOR = '--';

    // exports
    Polymer.StyleUtil = {
      parser: Polymer.CssParse,
      applyCss: applyCss,
      forEachStyleRule: forEachStyleRule,
      toCssText: toCssText
    };

  })();

;


  (function() {

    /* Transforms ShadowDOM styling into ShadyDOM styling

     * scoping: 

        * elements in scope get scoping selector class="x-foo-scope"
        * selectors re-written as follows:

          div button -> div.x-foo-scope button.x-foo-scope

     * :host -> scopeName

     * :host(...) -> scopeName...

     * ::content -> ' ' NOTE: requires use of scoping selector and selectors
       cannot otherwise be scoped:
       e.g. :host ::content > .bar -> x-foo > .bar

     * ::shadow, /deep/: processed simimlar to ::content

     * :host-context(...): NOT SUPPORTED

    */

    // Given a node and scope name, add a scoping class to each node 
    // in the tree. This facilitates transforming css into scoped rules. 
    function transformDom(node, scope) {
      _transformDom(node, scope ? scope + SCOPE_SUFFIX : '');
    }

    function _transformDom(node, selector) {
      if (node.setAttribute) {
        node.setAttribute(SCOPE_ATTR, selector);
      }
      var c$ = Polymer.dom(node).childNodes;
      for (var i=0; i<c$.length; i++) {
        _transformDom(c$[i], selector);
      }
    }

    function transformElement(element, scope) {
      element.setAttribute(SCOPE_ATTR, scope + SCOPE_SUFFIX);
    }

    function transformHost(host, scope) {
    }

    // Given a string of cssText and a scoping string (scope), returns
    // a string of scoped css where each selector is transformed to include
    // a class created from the scope. ShadowDOM selectors are also transformed
    // (e.g. :host) to use the scoping selector.
    function transformCss(rules, scope, ext, callback) {
      var hostScope = calcHostScope(scope, ext);
      return Polymer.StyleUtil.toCssText(rules, function(rule) {
        transformRule(rule, scope, hostScope);
        if (callback) {
          callback(rule, scope, hostScope);
        }
      });
    }

    function calcHostScope(scope, ext) {
      return ext ? '[is=' +  scope + ']' : scope;
    }

    function transformRule(rule, scope, hostScope) {
      _transformRule(rule, transformComplexSelector,
        scope, hostScope);
    }

    // transforms a css rule to a scoped rule.
    function _transformRule(rule, transformer, scope, hostScope) {
      var p$ = rule.selector.split(COMPLEX_SELECTOR_SEP);
      for (var i=0, l=p$.length, p; (i<l) && (p=p$[i]); i++) {
        p$[i] = transformer(p, scope, hostScope);
      }
      rule.selector = p$.join(COMPLEX_SELECTOR_SEP);
    }

    function transformComplexSelector(selector, scope, hostScope) {
      var stop = false;
      selector = selector.replace(SIMPLE_SELECTOR_SEP, function(m, c, s) {
        if (!stop) {
          var o = transformCompoundSelector(s, c, scope, hostScope);
          if (o.stop) {
            stop = true;
          }
          c = o.combinator;
          s = o.value;  
        }
        return c + s;
      });
      return selector;
    }

    function transformCompoundSelector(selector, combinator, scope, hostScope) {
      // replace :host with host scoping class
      var jumpIndex = selector.search(SCOPE_JUMP);
      if (selector.indexOf(HOST) >=0) {
        // :host(...)
        selector = selector.replace(HOST_PAREN, function(m, host, paren) {
          return hostScope + paren;
        });
        // now normal :host
        selector = selector.replace(HOST, hostScope);
      // replace other selectors with scoping class
      } else if (jumpIndex !== 0) {
        selector = scope ? transformSimpleSelector(selector, scope) : selector;
      }
      // remove left-side combinator when dealing with ::content.
      if (selector.indexOf(CONTENT) >= 0) {
        combinator = '';
      }
      // process scope jumping selectors up to the scope jump and then stop
      // e.g. .zonk ::content > .foo ==> .zonk.scope > .foo
      var stop;
      if (jumpIndex >= 0) {
        selector = selector.replace(SCOPE_JUMP, ' ');
        stop = true;
      }
      return {value: selector, combinator: combinator, stop: stop};
    }

    function transformSimpleSelector(selector, scope) {
      var p$ = selector.split(PSEUDO_PREFIX);
      p$[0] += CSS_PREFIX + scope + SCOPE_SUFFIX + CSS_SUFFIX;
      return p$.join(PSEUDO_PREFIX);
    }

    function transformRootRule(rule) {
      _transformRule(rule, transformRootSelector);
    }

    function transformRootSelector(selector) {
      return selector.match(SCOPE_JUMP) ?
        transformComplexSelector(selector) :
        selector.trim() + SCOPE_ROOT_SELECTOR;
    }

    var SCOPE_ATTR = 'style-scope';
    var SCOPE_ROOT_SELECTOR = ':not([' + SCOPE_ATTR + '])';
    var SCOPE_SUFFIX = '';
    var COMPLEX_SELECTOR_SEP = ',';
    var SIMPLE_SELECTOR_SEP = /(^|[\s>+~]+)([^\s>+~]+)/g;
    var HOST = ':host';
    // NOTE: this supports 1 nested () pair for things like 
    // :host(:not([selected]), more general support requires
    // parsing which seems like overkill
    var HOST_PAREN = /(\:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/g;
    var CONTENT = '::content';
    var SCOPE_JUMP = /\:\:content|\:\:shadow|\/deep\//;
    var CSS_PREFIX = '[' + SCOPE_ATTR + '=';
    var CSS_SUFFIX = ']';
    var PSEUDO_PREFIX = ':';
    var SCOPING_CLASS = /(?:^|\s)([\S]*?-x)(?:$|\s)/;

    // exports
    Polymer.StyleTransformer = {
      element: transformElement,
      dom: transformDom,
      host: transformHost,
      css: transformCss,
      rule: transformRule,
      rootRule: transformRootRule,
      SCOPE_SUFFIX: SCOPE_SUFFIX
    };

  })();

;


  (function() {

    var prepTemplate = Polymer.Base._prepTemplate;
    var prepElement = Polymer.Base._prepElement;
    var baseStampTemplate = Polymer.Base._stampTemplate;

    Polymer.Base.addFeature({

      // declaration-y
      _prepTemplate: function() {
        prepTemplate.call(this);
        var port = Polymer.DomModule.import(this.is);
        if (this._encapsulateStyle === undefined) {
          this._encapsulateStyle = 
            Boolean(port && !Polymer.Settings.useNativeShadow);
        }
        // scope css
        // NOTE: dom scoped via annotations
        if (Polymer.Settings.useNativeShadow || this._encapsulateStyle) {
          this._scopeCss();
        }
      },

      _prepElement: function(element) {
        if (this._encapsulateStyle) {
          Polymer.StyleTransformer.element(element, this.is);
        }
        prepElement.call(this, element);
      },

      _scopeCss: function() {
        this._styles = this._prepareStyles();
        this._scopeStyles(this._styles);
      },

      // search for extra style modules via `styleModules`
      _prepareStyles: function() {
        var cssText = '', m$ = this.styleModules;
        if (m$) {
          for (var i=0, l=m$.length, m; (i<l) && (m=m$[i]); i++) {
            cssText += this._cssFromModule(m);
          }
        }
        cssText += this._cssFromModule(this.is);
        var styles = [];
        if (cssText) {
          var s = document.createElement('style');
          s.textContent = cssText;  
          styles.push(s);
        }
        return styles;
      },

      // returns cssText of styles in a given module; also un-applies any
      // styles that apply to the document.
      _cssFromModule: function(moduleId) {
        var m = Polymer.DomModule.import(moduleId);
        if (m && !m._cssText) {
          var cssText = '';
          var e$ = Array.prototype.slice.call(m.querySelectorAll('style'));
          this._unapplyStyles(e$);
          e$ = e$.concat(Array.prototype.map.call(
            m.querySelectorAll(REMOTE_SHEET_SELECTOR), function(l) {
              return l.import.body;
            }));
          m._cssText = this._cssFromStyles(e$);
        }
        return m && m._cssText || '';
      },

      _cssFromStyles: function(styles) {
        var cssText = '';
        for (var i=0, l=styles.length, s; (i<l) && (s = styles[i]); i++) {
          if (s && s.textContent) {
            cssText += 
              Polymer.ResolveUrl.resolveCss(s.textContent, s.ownerDocument);
          }
        }
        return cssText;
      },

      _unapplyStyles: function(styles) {
        for (var i=0, l=styles.length, s; (i<l) && (s = styles[i]); i++) {
          s = s.__appliedElement || s;
          s.parentNode.removeChild(s);
        }
      },

      _scopeStyles: function(styles) {
        for (var i=0, l=styles.length, s; (i<l) && (s=styles[i]); i++) {
          // transform style if necessary and place in correct place
          if (Polymer.Settings.useNativeShadow) {
            if (this._template) {
              this._template.content.appendChild(s);
            }
          } else {
            var rules = this._rulesForStyle(s);
            Polymer.StyleUtil.applyCss(
              Polymer.StyleTransformer.css(rules, this.is, this.extends), 
              this.is, null, true);
          }
        }
      },

      _rulesForStyle: function(style) {
        if (!style.__cssRules) {
          style.__cssRules = Polymer.StyleUtil.parser.parse(style.textContent);
        }
        return style.__cssRules;
      },

      // instance-y
      _stampTemplate: function() {
        if (this._encapsulateStyle) {
          Polymer.StyleTransformer.host(this, this.is);
        }
        baseStampTemplate.call(this);
      },

      // add scoping class whenever an element is added to localDOM
      _elementAdd: function(node) {
        if (this._encapsulateStyle && !node.__styleScoped) {
          Polymer.StyleTransformer.dom(node, this.is);
        }
      },

      // remove scoping class whenever an element is removed from localDOM
      _elementRemove: function(node) {
        if (this._encapsulateStyle) {
          Polymer.StyleTransformer.dom(node, '');
        }
      }

    });

    var REMOTE_SHEET_SELECTOR = 'link[rel=import][type~=css]';

  })();

;


  (function() {
    
    var defaultSheet = document.createElement('style'); 

    function applyCss(cssText) {
      defaultSheet.textContent += cssText;
      defaultSheet.__cssRules =
        Polymer.StyleUtil.parser.parse(defaultSheet.textContent);
    }

    applyCss('');

    // exports
    Polymer.StyleDefaults = {
      applyCss: applyCss,
      defaultSheet: defaultSheet
    };

  })();
;

  (function() {
    
    var baseAttachedCallback = Polymer.Base.attachedCallback;

    // TODO(sorvell): consider if calculating properties and applying
    // styles with properties should be separate modules.
    Polymer.Base.addFeature({

      attachedCallback: function() {
        baseAttachedCallback.call(this);
        if (this.enableCustomStyleProperties && !this._scopeSelector) {
          this._updateOwnStyles();
        }
      },

      _updateOwnStyles: function() {
        if (this.enableCustomStyleProperties) {
          this._styleProperties = this._computeStyleProperties();
          this.applyStyleProperties(this._styleProperties);
        }
      },

      _computeStyleProperties: function() {
        var props = {};
        this.simpleMixin(props, this._computeStylePropertiesFromHost());        
        this.simpleMixin(props, this._computeOwnStyleProperties());
        this._reifyCustomProperties(props);
        return props;
      },

      _computeStylePropertiesFromHost: function() {
        // TODO(sorvell): experimental feature, global defaults!
        var props = {}, styles = [Polymer.StyleDefaults.defaultSheet];
        if (this.host) {
          // enable finding styles in hosts without `enableStyleCustomProperties`
          if (!this.host._styleProperties) {
            this.host._styleProperties = this.host._computeStyleProperties();
          }
          props = Object.create(this.host._styleProperties);
          styles = this.host._styles;
        }
        this.simpleMixin(props,
          this._customPropertiesFromStyles(styles, this.host));
        return props;
        
      },

      _computeOwnStyleProperties: function() {
        var props = {};
        this.simpleMixin(props, this._customPropertiesFromStyles(this._styles));
        if (this.styleProperties) {
          for (var i in this.styleProperties) {
            props[i] = this.styleProperties[i];
          }
        }
        return props;
      },

      _customPropertiesFromStyles: function(styles, hostNode) {
        var props = {};
        var p = this._customPropertiesFromRule.bind(this, props, hostNode);
        if (styles) {
          for (var i=0, l=styles.length, s; (i<l) && (s=styles[i]); i++) {
            Polymer.StyleUtil.forEachStyleRule(this._rulesForStyle(s), p);
          }
        }
        return props;
      },

      // test if a rule matches the given node and if so, 
      // collect any custom properties
      // TODO(sorvell): support custom variable assignment within mixins
      _customPropertiesFromRule: function(props, hostNode, rule) {
        hostNode = hostNode || this;
        // TODO(sorvell): file crbug, ':host' does not match element.
        if (this.elementMatches(rule.selector) ||
          ((hostNode === this) && (rule.selector === ':host'))) {
          // --g: var(--b); or --g: 5;
          this._collectPropertiesFromRule(rule, CUSTOM_VAR_ASSIGN, props);
          // --g: { ... }
          this._collectPropertiesFromRule(rule, CUSTOM_MIXIN_ASSIGN, props);
        }
      },

      // given a rule and rx that matches key and value, set key in properties
      // to value
      _collectPropertiesFromRule: function(rule, rx, properties) {
        var m;
        while (m = rx.exec(rule.cssText)) {
          properties[m[1]] = m[2].trim();
        }
      },
   
      _reifyCustomProperties: function(props) {
        for (var i in props) {
          props[i] = this._valueForCustomProperty(props[i], props);
        }
      },

      _valueForCustomProperty: function(property, props) {
        var cv;
        while ((typeof property === 'string') && 
          (cv = property.match(CUSTOM_VAR_VALUE))) {
          property = props[cv[1]];
        }
        return property;
      },

      // apply styles
      applyStyleProperties: function(bag) {
        var s$ = this._styles;
        if (s$) {
          var style = styleFromCache(this.is, bag, s$);
          this._ensureScopeSelector(style ? style._scope : null);
          if (!style) {
            var cssText = this._generateCustomStyleCss(bag, s$);
            style = cssText ? this._applyCustomCss(cssText) : {};
            cacheStyle(this.is, style, this._scopeSelector, 
              this._styleProperties, s$);
          } else if (Polymer.Settings.useNativeShadow) {
            this._applyCustomCss(style.textContent);
          }
          if (style.textContent /*&& !Polymer.Settings.useNativeShadow*/) {
            this.setAttribute(XSCOPE_ATTR, this._scopeSelector);
          }
        }
      },

      _generateCustomStyleCss: function(properties, styles) {
        var b = this._applyPropertiesToRule.bind(this, properties);
        var cssText = '';
        // TODO(sorvell): don't redo parsing work each time as below; 
        // instead create a sheet with just custom properties
        for (var i=0, l=styles.length, s; (i<l) && (s=styles[i]); i++) {
          cssText += this._transformCss(s.textContent, b) + '\n\n'; 
        }
        return cssText.trim();
      },

      _transformCss: function(cssText, callback) {
        return Polymer.Settings.useNativeShadow ?
          Polymer.StyleUtil.toCssText(cssText, callback) : 
          Polymer.StyleTransformer.css(cssText, this.is, this.extends, callback);
      },

      _xScopeCount: 0,

      _ensureScopeSelector: function(selector) {
        if (!this._scopeSelector) {
          var c = Object.getPrototypeOf(this)._xScopeCount++;
          this._scopeSelector = selector || (this.is + '-' + c);
        }
      },

      _applyCustomCss: function(cssText) {
        if (this._customStyle) {
          this._customStyle.textContent = cssText;
        } else if (cssText) {
          this._customStyle = Polymer.StyleUtil.applyCss(cssText, 
            this._scopeSelector,
            Polymer.Settings.useNativeShadow ? this.root : null);
        }
        return this._customStyle;
      },

      _applyPropertiesToRule: function(properties, rule) {
        if (!Polymer.Settings.useNativeShadow) {
          this._scopifyRule(rule);
        }
        if (rule.cssText.match(CUSTOM_RULE_RX)) {
          rule.cssText = this._applyPropertiesToText(rule.cssText, properties);
        } else {
          rule.cssText = '';
        }
        //console.log(rule.cssText);
      },

      _applyPropertiesToText: function(cssText, props) {
        var output = '';
        var m, v;
        // e.g. color: var(--color);
        while (m = CUSTOM_VAR_USE.exec(cssText)) {
          v = props[m[2]];
          if (v) {
            output += '\t' + m[1].trim() + ': ' + this._propertyToCss(v);
          }
        }
        // e.g. @mixin(--stuff);
        while (m = CUSTOM_MIXIN_USE.exec(cssText)) {
          v = m[1];
          if (v) {
            var parts = v.split(' ');
            for (var i=0, p; i < parts.length; i++) {
              p = props[parts[i].trim()];
              if (p) {
                output += '\t' + this._propertyToCss(p);
              }
            }
          }
        }
        return output;
      },

      _propertyToCss: function(property) {
        var p = property.trim();
        p = p[p.length-1] === ';' ? p : p + ';';
        return p + '\n';
      },

      _scopifyRule: function(rule) {
        var selector = rule.selector;
        var host = this.is;
        var rx = new RegExp(host + HOST_SELECTOR_SEP);
        var parts = selector.split(',');
        var scope = SCOPE_PREFIX + this._scopeSelector + SCOPE_SUFFIX;
        for (var i=0, l=parts.length, p; (i<l) && (p=parts[i]); i++) {
          parts[i] = p.match(rx) ?
            p.replace(host, host + scope) :
            scope + ' ' + p;
        }
        rule.selector = parts.join(',');
      },

      updateStyles: function() {
        this._updateOwnStyles();
        // TODO(sorvell): temporary way to find local dom that needs 
        // x-scope styling.
        var c$ = Polymer.dom(this.root).querySelectorAll('[x-style-scope]');
        for (var i=0, l= c$.length, c; (i<l) && (c=c$[i]); i++) {
          if (c.updateStyles) {
            c.updateStyles();
          }
        }
      }

    });
    
    var styleCache = {};
    function cacheStyle(is, style, scope, bag, styles) {
      style._scope = scope;
      style._properties = bag;
      style._styles = styles;
      var s$ = styleCache[is] = styleCache[is] || [];
      s$.push(style);
    }

    function styleFromCache(is, bag, checkStyles) {
      var styles = styleCache[is];
      if (styles) {
        for (var i=0, s; i < styles.length; i++) {
          s = styles[i];
          if (objectsEqual(bag, s._properties) && 
            objectsEqual(checkStyles,  s._styles)) { 
            return s;
          }
        }
      }
    }

    function objectsEqual(a, b) {
      for (var i in a) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      for (var i in b) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }

    var XSCOPE_ATTR = 'x-style-scope';
    var SCOPE_PREFIX = '[' + XSCOPE_ATTR + '=';
    var SCOPE_SUFFIX = ']';
    var HOST_SELECTOR_SEP = '($|[\\.\\:\\[\\s>\\+~])';
    var CUSTOM_RULE_RX = /mixin|var/;
    var CUSTOM_VAR_ASSIGN = /(--[^\:;]*?):\s*?([^;{]*?);/g;
    var CUSTOM_MIXIN_ASSIGN = /(--[^\:;]*?):[^{;]*?{([^}]*?)}/g;
    var CUSTOM_VAR_VALUE = /^var\(([^)]*?)\)/;
    var CUSTOM_VAR_USE = /(?:^|[;}\s])([^;{}]*?):[\s]*?var\(([^)]*)?\)/gim;
    var CUSTOM_MIXIN_USE = /mixin\(([^)]*)\)/gim;

  })();
;


  Polymer.Base.addFeature({

    registerFeatures: function() {
      this._prepMixins();
      this._prepExtends();
      this._prepConstructor();
      this._prepTemplate();
      this._prepAnnotations();
      this._prepEffects();
      this._prepContent();
    },

    initFeatures: function() {
      this._poolContent();
      this._setupConfigure();
      this._pushHost();
      this._stampTemplate();
      this._popHost();
      this._marshalAnnotationReferences();
      this._marshalInstanceEffects();
      this._marshalAttributes();
      this._marshalListeners();
      this._readyContent();
    }

  });

;

(function() {

  Polymer({

    is: 'x-style',
    extends: 'style',

    created: function() {
      var rules = Polymer.StyleUtil.parser.parse(this.textContent);
      this.applyProperties(rules);
      // TODO(sorvell): since custom rules must match directly, they tend to be
      // made with selectors like `*`.
      // We *remove them here* so they don't apply too widely and nerf recalc.
      // This means that normal properties mixe in rules with custom 
      // properties will *not* apply.
      var cssText = Polymer.StyleUtil.parser.stringify(rules);
      this.textContent = this.scopeCssText(cssText);
    },

    scopeCssText: function(cssText) {
      return Polymer.Settings.useNativeShadow ?
        cssText :
        Polymer.StyleUtil.toCssText(cssText, function(rule) {
          Polymer.StyleTransformer.rootRule(rule);
      });
    },

    applyProperties: function(rules) {
      var cssText = '';
      Polymer.StyleUtil.forEachStyleRule(rules, function(rule) {
        if (rule.cssText.match(CUSTOM_RULE)) {
          // TODO(sorvell): use parser.stringify, it needs an option not to
          // strip custom properties.
          cssText += rule.selector + ' {\n' + rule.cssText + '\n}\n';
        }
      });
      if (cssText) {
        Polymer.StyleDefaults.applyCss(cssText);
      }
    }

  });

  var CUSTOM_RULE = /--[^;{'"]*\:/;

})();
;


  Polymer({

    is: 'x-autobind',

    extends: 'template',

    registerFeatures: function() {
      this._prepExtends();
      this._prepConstructor();
    },

    _finishDistribute: function() {
      var parentDom = Polymer.dom(Polymer.dom(this).parentNode);
      parentDom.insertBefore(this.root, this);
    },

    initFeatures: function() {
      this._template = this;
      this._prepAnnotations();
      this._prepEffects();
      Polymer.Base.initFeatures.call(this);
    }

  });

;


  Polymer.Templatizer = {

    templatize: function(template) {
      // TODO(sjmiles): supply _alternate_ content reference missing from root
      // templates (not nested). `_content` exists to provide content sharing
      // for nested templates.
      if (!template._content) {
        template._content = template.content;
      }
      // fast path if template's anonymous class has been memoized
      if (template._content._ctor) {
        this.ctor = template._content._ctor;
        //console.log('Templatizer.templatize: using memoized archetype');
        return;
      }
      // `archetype` is the prototype of the anonymous
      // class created by the templatizer 
      var archetype = Object.create(Polymer.Base);
      archetype.host = this;
      archetype.contentHost = this._getContentHost();
      // normally Annotations.parseAnnotations(template) but
      // archetypes do special caching
      this.customPrepAnnotations(archetype, template);
      // setup accessors
      archetype._prepEffects();
      // late-binds archetype.listen to host.listen; h.l doesn't exist yet
      archetype.listen = function() { 
        this.listen.apply(this, arguments);
      }.bind(this.host);

      // boilerplate code
      archetype._notifyPath = this._notifyPathImpl;
      // boilerplate code
      var _constructor = this._constructorImpl;
      var ctor = function TemplateInstance(model) {
        _constructor.call(this, model);
      };
      // standard references
      ctor.prototype = archetype;
      archetype.constructor = ctor;
      // TODO(sjmiles): constructor cache?
      template._content._ctor = ctor;
      // TODO(sjmiles): choose less general name
      this.ctor = ctor;
    },

    _getContentHost: function() {
      return (this.host && this.host.contentHost) || this.host;
    },

    customPrepAnnotations: function(archetype, template) {
      if (template) {
        archetype._template = template;
        var c = template._content;
        if (c) {
          var contentHost = archetype.contentHost;
          if (contentHost) {
            Polymer.Annotations.prepElement = 
              contentHost._prepElement.bind(contentHost);
          }
          archetype._annotes = c._annotes ||
            Polymer.Annotations.parseAnnotations(template);
          c._annotes = archetype._annotes;
          Polymer.Annotations.prepElement = null;
        } 
        else {
          console.warn('no _content');
        }
      }
      else {
        console.warn('no _template');
      }
    },

    _notifyPathImpl: function() {
      var pd = this.pathDelegate;
      if (pd) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this);
        pd._notifyDelegatePath.apply(pd, args);
      }
    },

    _constructorImpl: function(model) {
      this._setupConfigure(model);
      this._pushHost(this.host);
      this.root = this.instanceTemplate(this._template);
      this._popHost();
      this._marshalAnnotatedNodes();
      this._marshalInstanceEffects();
      this._marshalAnnotatedListeners();
      this._readyContent();
    },

    stamp: function(model) {
      return new this.ctor(model);
    }

    // TODO(sorvell): note, using the template as host is ~5-10% faster if 
    // elements have no default values.
    // _constructorImpl: function(model, host) {
    //   this._setupConfigure(model);
    //   host._beginHost();
    //   this.root = this.instanceTemplate(this._template);
    //   host._popHost();
    //   this._marshalTemplateContent();
    //   this._marshalAnnotatedNodes();
    //   this._marshalInstanceEffects();
    //   this._marshalAnnotatedListeners();
    //   this._ready();
    // },

    // stamp: function(model) {
    //   return new this.ctor(model, this.host);
    // }
    

  };

;


  /**
   * Creates a pseudo-custom-element that maps property values to bindings
   * in DOM.
   * 
   * `stamp` method creates an instance of the pseudo-element. The instance
   * references a document-fragment containing the stamped and bound dom
   * via it's `root` property. 
   *  
   */
  Polymer({

    is: 'x-template',
    extends: 'template',

    mixins: [
      Polymer.Templatizer
    ],

    ready: function() {
      this.templatize(this);
    }

  });

;


(function() {

  var callbacks = new WeakMap();
  
  function observe(array, cb) {
    if (Array.observe) {
      var ncb = function(changes) {
        changes = changes.filter(function(o) { return o.type == 'splice'; });
        if (changes.length) {
          cb(changes);
        }
      };
      callbacks.set(cb, ncb);
      Array.observe(array, ncb);
    } else {
      if (!array.__polymerObservable) {
        makeObservable(array);
      }
      callbacks.get(array).push(cb);
    }
  }

  function unobserve(array, cb) {
    if (Array.observe) {
      var ncb = callbacks.get(cb);
      callbacks.delete(cb);
      Array.unobserve(array, ncb);
    } else {
      var cbs = callbacks.get(array);
      var idx = cbs.indexOf(cb);
      if (idx >= 0) {
        cbs.splice(idx, 1);
      }
    }
  }

  function makeObservable(array) {
    var splices = [];
    var debounce;
    var orig = {
      push: array.push,
      pop: array.pop,
      splice: array.splice,
      shift: array.shift,
      unshift: array.unshift,
      sort: array.sort
    };
    var addSplice = function(index, added, removed) {
      splices.push({
        index: index,
        addedCount: added,
        removed: removed,
        object: array,
        type: 'splice'
      });
    };
    callbacks.set(array, []);
    array.push = function() {
      debounce = Polymer.Debounce(debounce, fin);
      addSplice(array.length, 1, []);
      return orig.push.apply(this, arguments);
    };
    array.pop = function() {
      debounce = Polymer.Debounce(debounce, fin);
      addSplice(array.length - 1, 0, array.slice(-1));
      return orig.pop.apply(this, arguments);
    };
    array.splice = function(start, deleteCount) {
      debounce = Polymer.Debounce(debounce, fin);
      addSplice(start, arguments.length - 2, array.slice(start, start + deleteCount));
      return orig.splice.apply(this, arguments);
    };
    array.shift = function() {
      debounce = Polymer.Debounce(debounce, fin);
      addSplice(0, 0, [array[0]]);
      return orig.shift.apply(this, arguments);
    };
    array.unshift = function() {
      debounce = Polymer.Debounce(debounce, fin);
      addSplice(0, 1, []);
      return orig.unshift.apply(this, arguments);
    };
    array.sort = function() {
      debounce = Polymer.Debounce(debounce, fin);
      console.warn('[ArrayObserve]: sort not observable');
      return orig.sort.apply(this, arguments);
    };
    var fin = function() {
      var cbs = callbacks.get(array);
      for (var i=0; i<cbs.length; i++) {
        cbs[i](splices);
      }
      splices = [];
    };
    array.__polymerObservable = true;
  }

  Polymer.ArrayObserve = {
    observe: observe,
    unobserve: unobserve
  };
  
})();

;


  Polymer._collections = new WeakMap();

  Polymer.Collection = function(userArray, noObserve) {
    Polymer._collections.set(userArray, this);
    this.userArray = userArray;
    this.store = userArray.slice();
    this.callbacks = [];
    this.debounce = null;
    this.map = null;
    this.added = [];
    this.removed = [];
    if (!noObserve) {
      Polymer.ArrayObserve.observe(userArray, this.applySplices.bind(this));
      this.initMap();
    }
  };

  Polymer.Collection.prototype = {
    constructor: Polymer.Collection,

    initMap: function() {
      var map = this.map = new WeakMap();
      var s = this.store;
      var u = this.userArray;
      for (var i=0; i<s.length; i++) {
        var v = s[i];
        if (v) {
          switch (typeof v) {
            case 'string':
              v = s[i] = u[i]= new String(v);
              break;
            case 'number':
              v = s[i] = u[i]= new Number(v);
              break;          
            case 'boolean':
              v = s[i] = u[i]= new Boolean(v);
              break;          
          }
        map.set(v, i);
        }
      }
    },

    add: function(item, squelch) {
      var key = this.store.push(item) - 1;
      if (item != null && this.map) {
        this.map.set(item, key);
      }
      if (!squelch) {
        this.added.push(key);
        this.debounce = Polymer.Debounce(this.debounce, this.notify.bind(this));
      }
      return key;
    },

    removeKey: function(key) {
      if (this.map) {
        this.map.delete(this.store[key]);
      }
      delete this.store[key];
      this.removed.push(key);
      this.debounce = Polymer.Debounce(this.debounce, this.notify.bind(this));
    },

    remove: function(item, squelch) {
      var key = this.getKey(item);
      if (item != null && this.map) {
        this.map.delete(item);
      }
      delete this.store[key];
      if (!squelch) {
        this.removed.push(key);
        this.debounce = Polymer.Debounce(this.debounce, this.notify.bind(this));
      }
      return key;
    },

    notify: function(splices) {
      if (!splices) {
        splices = [{
          added: this.added,
          removed: this.removed
        }];
        this.added = [];
        this.removed = [];
      }
      this.callbacks.forEach(function(cb) {
        cb(splices);
      }, this);
    },

    observe: function(callback) {
      this.callbacks.push(callback);
    },

    unobserve: function(callback) {
      this.callbacks.splice(this.callbacks.indexOf(callback), 1);
    },

    getKey: function(item) {
      if (item != null && this.map) {
        return this.map.get(item);
      } else {
        return this.store.indexOf(item);      
      }
    },

    getKeys: function() {
      return Object.keys(this.store);
    },

    setItem: function(key, value) {
      this.store[key] = value;
    },

    getItem: function(key) {
      return this.store[key];
    },

    getItems: function() {
      var items = [], store = this.store;
      for (var key in store) {
        items.push(store[key]);
      }
      return items;
    },

    applySplices: function(splices) {
      var map = this.map;
      var keySplices = [];
      for (var i=0; i<splices.length; i++) {
        var j, o, key, s = splices[i];
        // Removed keys
        var removed = [];
        for (j=0; j<s.removed.length; j++) {
          o = s.removed[j];
          key = this.remove(o, true);
          removed.push(key);
        }
        // Added keys
        var added = [];
        for (j=0; j<s.addedCount; j++) {
          o = this.userArray[s.index + j];
          key = this.add(o, true);
          added.push(key);
        }
        // Record splice
        keySplices.push({
          index: s.index,
          removed: removed,
          added: added
        });
      }
      this.notify(keySplices);
    }

  };

  Polymer.Collection.get = function(userArray, noObserve) {
    return Polymer._collections.get(userArray) 
      || new Polymer.Collection(userArray, noObserve);
  };

;


  Polymer({

    is: 'x-repeat',
    extends: 'template',

    properties: {

      /**
       * An array containing items determining how many instances of the template
       * to stamp and that that each template instance should bind to.
       */
      items: {
        type: Array
      },

      /**
       * A function that should determine the sort order of the items.  This
       * property should either be provided as a string, indicating a method
       * name on the element's host, or else be an actual function.  The
       * function should match the sort function passed to `Array.sort`.
       * Using a sort function has no effect on the underlying `items` array.
       */
      sort: {
        type: Function,
        observer: '_sortChanged'
      },

      /**
       * A function that can be used to filter items out of the view.  This
       * property should either be provided as a string, indicating a method
       * name on the element's host, or else be an actual function.  The
       * function should match the sort function passed to `Array.filter`.
       * Using a filter function has no effect on the underlying `items` array.
       */
      filter: {
        type: Function,
        observer: '_filterChanged'
      },

      /**
       * When using a `filter` or `sort` function, the `observe` property
       * should be set to a space-separated list of the names of item
       * sub-fields that should trigger a re-sort or re-filter when changed.
       * These should generally be fields of `item` that the sort or filter
       * function depends on.
       */
      observe: {
        type: String,
        observer: '_observeChanged'
      },

      /**
       * When using a `filter` or `sort` function, the `delay` property
       * determines a debounce time after a change to observed item
       * properties that must pass before the filter or sort is re-run.
       * This is useful in rate-limiting shuffing of the view when
       * item changes may be frequent.
       */
      delay: Number
    },

    mixins: [
      Polymer.Templatizer
    ],

    observers: {
      'items.*': '_itemsChanged'
    },

    created: function() {
      this.boundCollectionObserver = this.render.bind(this);
    },

    ready: function() {
      // Templatizing (generating the instance constructor) needs to wait
      // until attached, since it may not have its template content handed
      // back to it until then, following its host template stamping
      if (!this.ctor) {
        this.templatize(this);
      }
      if (this._renderPendingAttach) {
        this._renderPendingAttach = false; 
        this.render();
      }
    },

    _sortChanged: function() {
      this._sortFn = this.sort && (typeof this.sort == 'function' ? 
        this.sort : this.host[this.sort].bind(this.host));
      this.debounce('render', this.render);
    },

    _filterChanged: function() {
      this._filterFn = this.filter && (typeof this.filter == 'function' ? 
        this.filter : this.host[this.filter].bind(this.host));
      this.debounce('render', this.render);
    },

    _observeChanged: function() {
      this._observePaths = this.observe && 
        this.observe.replace('.*', '.').split(' ');
    },

    _itemsChanged: function(items, old, path) {
      if (path) {
        this._notifyElement(path, items);
        this._checkObservedPaths(path);
      } else {
        if (old) {
          this._unobserveCollection(old);
        }
        if (items) {
          this._observeCollection(items);
          this.debounce('render', this.render);
        }
      }          
    },

    _checkObservedPaths: function(path) {
      if (this._observePaths && path.indexOf('items.') === 0) {
        path = path.substring(path.indexOf('.', 6) + 1);
        var paths = this._observePaths;
        for (var i=0; i<paths.length; i++) {
          if (path.indexOf(paths[i]) === 0) {
            this.debounce('render', this.render, this.delay);
            return;
          }
        }
      }
    },

    _observeCollection: function(items) {
      this.collection = Array.isArray(items) ? Polymer.Collection.get(items) : items;
      this.collection.observe(this.boundCollectionObserver);
    },

    _unobserveCollection: function(items) {
      var collection = Polymer.Collection.get(items);
      collection.unobserve(this.boundCollectionObserver);
    },

    render: function(splices) {
      // TODO(kschaaf): should actually queue splices also
      if (!this.isAttached) {
        // Render must follow attachment
        this._renderPendingAttach = true;
        return;
      }
      this._render(splices);
    },

    _render: function(splices) {
      var c = this.collection;
      if (splices) {
        if (this._sortFn || splices[0].index == null) {
          this._applySplicesViewSort(splices);
        } else {
          this._applySplicesArraySort(splices);
        }
      } else {
        this._sortAndFilter();
      }
      var rowForKey = this._rowForKey = {};
      var keys = this._orderedKeys;
      // Assign items and keys
      this.rows = this.rows || [];
      for (var i=0; i<keys.length; i++) {
        var key = keys[i];
        var item = c.getItem(key);
        var row = this.rows[i];
        if (!row) {
          this.rows.push(row = this._insertRow(i, null, item));
        }
        row.item = item;
        row.key = key;
        rowForKey[key] = i;
      }
      // Remove extra
      for (; i<this.rows.length; i++) {
        this._detachRow(i);
      }
      this.rows.splice(keys.length, this.rows.length-keys.length);
    },

    _sortAndFilter: function() {
      var c = this.collection;
      this._orderedKeys = c.getKeys();
      // Filter
      if (this._filterFn) {
        this._orderedKeys = this._orderedKeys.filter(function(a) {
          return this._filterFn(c.getItem(a));
        }, this);
      }
      // Sort
      if (this._sortFn) {
        this._orderedKeys.sort(function(a, b) {
          return this._sortFn(c.getItem(a), c.getItem(b));
        }.bind(this));
      }
    },

    _keySort: function(a, b) {
      return this.collection.getKey(a) - this.collection.getKey(b);
    },

    _applySplicesViewSort: function(splices) {
      var c = this.collection;
      var keys = this._orderedKeys;
      var rows = this.rows;
      var removedRows = [];
      var addedKeys = [];
      var pool = [];
      var sortFn = this._sortFn || this._keySort.bind(this);
      splices.forEach(function(s) {
        // Collect all removed row idx's
        for (var i=0; i<s.removed.length; i++) {
          var idx = this._rowForKey[s.removed[i]];
          if (idx != null) {
            removedRows.push(idx);
          }
        }
        // Collect all added keys
        for (i=0; i<s.added.length; i++) {
          addedKeys.push(s.added[i]);
        }
      }, this);
      if (removedRows.length) {
        // Sort removed rows idx's
        removedRows.sort();
        // Remove keys and pool rows (backwards, so we don't invalidate rowForKey)
        for (i=removedRows.length-1; i>=0 ; i--) {
          var idx = removedRows[i];
          pool.push(this._detachRow(idx));
          rows.splice(idx, 1);
          keys.splice(idx, 1);
        }
      }
      if (addedKeys.length) {
        // Filter added keys
        if (this._filterFn) {
          addedKeys = addedKeys.filter(function(a) {
            return this._filterFn(c.getItem(a));
          }, this);
        }
        // Sort added keys
        addedKeys.sort(function(a, b) {
          return this.sortFn(c.getItem(a), c.getItem(b));
        }, this);
        // Insert new rows using sort (from pool or newly created)
        var start = 0;
        for (i=0; i<addedKeys.length; i++) {
          start = this._insertRowIntoViewSort(start, addedKeys[i], pool);
        }          
      }
    },

    _insertRowIntoViewSort: function(start, key, pool) {
      var c = this.collection;
      var item = c.getItem(key);
      var end = this.rows.length - 1;
      var idx = -1;
      var sortFn = this._sortFn || this._keySort.bind(this);
      // Binary search for insertion point
      while (start <= end) {
        var mid = (start + end) >> 1;
        var midKey = this._orderedKeys[mid];
        var cmp = sortFn(c.getItem(midKey), item);
        if (cmp < 0) {
          start = mid + 1;
        } else if (cmp > 0) {
          end = mid - 1;
        } else {
          idx = mid;
          break;
        }
      }
      if (idx < 0) {
        idx = end + 1;
      }
      // Insert key & row at insertion point
      this._orderedKeys.splice(idx, 0, key);
      this.rows.splice(idx, 0, this._insertRow(idx, pool));
      return idx;
    },

    _applySplicesArraySort: function(splices) {
      var keys = this._orderedKeys;
      var pool = [];
      splices.forEach(function(s) {
        // Remove & pool rows first, to ensure we can fully reuse removed rows
        for (var i=0; i<s.removed.length; i++) {
          pool.push(this._detachRow(s.index + i));
        }
        this.rows.splice(s.index, s.removed.length);
      }, this);
      var c = this.collection;
      var filterDelta = 0;
      splices.forEach(function(s) {
        // Filter added keys
        var addedKeys = s.added;
        if (this._filterFn) {
          addedKeys = addedKeys.filter(function(a) {
            return this._filterFn(c.getItem(a));
          }, this);
          filterDelta += (s.added.length - addedKeys.length);            
        }
        var idx = s.index - filterDelta;
        // Apply splices to keys
        var args = [idx, s.removed.length].concat(addedKeys);
        keys.splice.apply(keys, args);
        // Insert new rows (from pool or newly created)
        var addedRows = [];
        for (i=0; i<s.added.length; i++) {
          addedRows.push(this._insertRow(idx + i, pool));
        }
        args = [s.index, 0].concat(addedRows);
        this.rows.splice.apply(this.rows, args);
      }, this);
    },

    _detachRow: function(idx) {
      var row = this.rows[idx];
      var parentNode = Polymer.dom(this).parentNode;
      for (var i=0; i<row._children.length; i++) {
        var el = row._children[i];
        Polymer.dom(row.root).appendChild(el);
      }
      return row;
    },

    _insertRow: function(idx, pool, item) {
      var row = (pool && pool.pop()) || this._generateRow(idx, item);
      var beforeRow = this.rows[idx];
      var beforeNode = beforeRow ? beforeRow._children[0] : this;
      var parentNode = Polymer.dom(this).parentNode;
      row.root.__styleScoped = true;
      Polymer.dom(parentNode).insertBefore(row.root, beforeNode);
      return row;
    },

    _generateRow: function(idx, item) {
      var row = this.stamp({
        item: item,
        pathDelegate: this
      });
      // each row is a document fragment which is lost when we appendChild,
      // so we have to track each child individually
      var children = [];
      for (var n = row.root.firstChild; n; n=n.nextSibling) {
        children.push(n);
        n._templateInstance = row;
      }
      // Since archetype overrides Base/HTMLElement, Safari complains
      // when accessing `children`
      row._children = children;
      return row;
    },

    _notifyDelegatePath: function(row, path, value) {
      this.notifyPath(path.replace('item', 'items.' + row.key), value);
    },

    _notifyElement: function(path, value) {
      if (this._rowForKey) {
        // 'items.'.length == 6
        var dot = path.indexOf('.', 6);
        var key = path.substring(6, dot < 0 ? path.length : dot);
        var idx = this._rowForKey[key];
        var row = this.rows[idx];
        if (row) {
          if (dot >= 0) {
            path = 'item.' + path.substring(dot+1);
            row.notifyPath(path, value, true);
          } else {
            row.item = value;
          }
        }
      }
    },

    _instanceForElement: function(el) {
      while (el && !el._templateInstance) {
        el = el.parentNode;
      }
      return el._templateInstance;
    },

    /**
     * Returns the item associated with a given element stamped by
     * this `x-repeat`.
     */
    itemForElement: function(el) {
      var instance = this._instanceForElement(el);
      return instance && instance.item;
    },

    /**
     * Returns the `Polymer.Collection` key associated with a given
     * element stamped by this `x-repeat`.
     */
    keyForElement: function(el) {
      var instance = this._instanceForElement(el);
      return instance && instance.key;
    },

    /**
     * Returns the index in `items` associated with a given element
     * stamped by this `x-repeat`.
     */
    indexForElement: function(el) {
      var instance = this._instanceForElement(el);
      return this.rows.indexOf(instance);
    }

  });


;


  Polymer({
    is: 'x-array-selector',
    
    properties: {

      /**
       * An array containing items from which selection will be made.
       */
      items: {
        type: Array,
        observer: '_itemsChanged'
      },

      /**
       * When `multi` is true, this is an array that contains any selected.
       * When `multi` is false, this is the currently selected item, or `null`
       * if no item is selected.
       */
      selected: {
        type: Object,
        notify: true
      },

      /**
       * When `true`, calling `select` on an item that is already selected
       * will deselect the item.
       */
      toggle: Boolean,

      /**
       * When `true`, multiple items may be selected at once (in this case,
       * `selected` is an array of currently selected items).  When `false`,
       * only one item may be selected at a time.
       */
      multi: Boolean
    },
    
    _itemsChanged: function() {
      // Unbind previous selection
      if (Array.isArray(this.selected)) {
        for (var i=0; i<this.selected.length; i++) {
          this.unbindPaths('selected.' + i);
        }
      } else {
        this.unbindPaths('selected');
      }
      // Initialize selection
      if (this.multi) {
        this.selected = [];
      } else {
        this.selected = null;
      }
    },

    /**
     * Deselects the given item if it is already selected.
     */
    deselect: function(item) {
      if (this.multi) {
        var scol = Polymer.Collection.get(this.selected);
        // var skey = scol.getKey(item);
        // if (skey >= 0) {
        var sidx = this.selected.indexOf(item);
        if (sidx >= 0) {
          var skey = scol.getKey(item);
          this.selected.splice(sidx, 1);
          // scol.remove(item);
          this.unbindPaths('selected.' + skey);
          return true;
        }
      } else {
        this.selected = null;
        this.unbindPaths('selected');
      }
    },

    /**
     * Selects the given item.  When `toggle` is true, this will automatically
     * deselect the item if already selected.
     */
    select: function(item) {
      var icol = Polymer.Collection.get(this.items);
      var key = icol.getKey(item);
      if (this.multi) {
        // var sidx = this.selected.indexOf(item);
        // if (sidx < 0) {
        var scol = Polymer.Collection.get(this.selected);
        var skey = scol.getKey(item);
        if (skey >= 0) {
          this.deselect(item);
        } else if (this.toggle) {
          this.selected.push(item);
          // this.bindPaths('selected.' + sidx, 'items.' + skey);
          // skey = Polymer.Collection.get(this.selected).add(item);
          this.async(function() {
            skey = scol.getKey(item);
            this.bindPaths('selected.' + skey, 'items.' + key);
          });
        }
      } else {
        if (this.toggle && item == this.selected) {
          this.deselect();
        } else {
          this.bindPaths('selected', 'items.' + key);
          this.selected = item;
        }
      }
    }

  });

;

    Polymer({
        is : 'cwn-datastore',

        published : {
            settings : {
                type : Object
            },
            islocal : {
                type : Boolean
            },
            loading : {
                type : Boolean,
                notify : true
            }
        },

        configure : function() {
            return {
                loading : true,
                islocal : false,
                
                network : 'default',

                data : {
                    nodes : [],
                    links : []
                },

                // look up any node or terminal by prmname
                lookupMap : {},
                // look up any link origin name
                originLookupMap : {},
                terminalLookupMap : {},

                loadingCharts : true,
                chartLoadHandlers : [],

                initialLoad : false,
                initialLoadListeners : []
            }
        },
        
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

            //Polymer.whenPolymerReady();
        },

        attached : function() {
            this.init();
        },

        init : function(callback) {
            this.reset();
            this.callback = callback;
            this.reload();
        },

        reset : function() {
            this.fire('load', this.loading);

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

        onLoad : function(listener) {
            if( this.initialLoad ) {
                listener();
                return;
            }
            this.initialLoadListeners.push(listener);
        },

        reload : function() {
            this.loadNetwork(this.network, function(err){
                this.loading = false;
                this.fire('load', this.loading);
                this.fire('loaded');

                if( this.callback ) this.callback(err);

                if( !this.initialLoad ) {
                    this.initialLoad = true;
                    for( var i = 0; i < this.initialLoadListeners.length; i++ ) {
                        this.initialLoadListeners[i]();
                    }
                }
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
                    if( resp.error ) {
                        alert('Server error loading network :(');
                        return callback(resp);
                    }

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
            if( !CWN.rootDir ) return;
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

            try {

            // Flow to a sink
            if( this.lookupMap[link.properties.terminus] && 
                this.lookupMap[link.properties.terminus].properties.type == 'Sink' ) {
                link.properties.renderInfo.type = 'flowToSink';
            
            } else if( link.properties.type == 'Return Flow' ) {
                link.properties.renderInfo.type = 'returnFlowFromDemand';

            } else if ( this._isGWToDemand(link) ) {
                link.properties.renderInfo.type = 'gwToDemand';

            } else if( this.lookupMap[link.properties.origin] && 
                (this.lookupMap[link.properties.origin].properties.calibrationMode == 'in' ||
                this.lookupMap[link.properties.origin].properties.calibrationMode == 'both') ) {

                link.properties.renderInfo.type = 'artificalRecharge';
            } else {

                link.properties.renderInfo.type = 'unknown';
            }

        } catch(e) {debugger}

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

    Polymer({
        is : 'cwn-info-link',
        
        properties : {
            name : {
                type : String,
                observer : 'update'
            }
        },

        configure : function() {
            return {
                link : '',
                type : '',
                valid : false,
            }
        },
        
        attached : function() {
            this.ds = document.querySelector('cwn-datastore');
            this.ds.onLoad(this.update.bind(this));
        },

        update : function() {
            if( !this.ds ) return;
            if( !this.name ) return;

            if( !this.ds.lookupMap[this.name] ) {
                this.valid = false;
                return;
            }

            this.valid = true;
            this.type = this.ds.lookupMap[this.name].properties.type;
            this.link = '#info/'+ this.name;
        }

    });
;

    Polymer({
        is : 'cwn-dateslider',

        properties : {
            start : {
                type : String
            },
            end : {
                type : String
            }
        },

        listeners: {
            mousedown : 'startDrag',
            touchstart : 'startDrag',
            mousemove : 'onDrag',
            touchmove : 'onDrag'
        },


        configure : function() {
            return {
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
                cBarWidth : 0
            }
        },
        
        ready : function() {
            this.reset();

            $(window)
                .on('resize', this.resize.bind(this))
                .on('mouseup touchend touchcancel', this.endDrag.bind(this));

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

            this.cWidth = this.querySelector('.slider-tabs').offsetWidth;

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

            if( !e.target.classList.contains('slider-tab') && e.target.id != 'slider' ) {
                return;
            }

            this.cWidth = this.querySelector('.slider-tabs').offsetWidth;
            this.cBarWidth = this.$.slider.offsetWidth;

            this.dragging = e.target;
            this.dragStartLeft = parseInt(e.target.style.left || 0);
            this.dragStartX = this.getX(e);

            if( this.dragging.id == 'startTab' ) {
                this.otherStartLeft = parseInt(this.$.endTab.style.left || 0 );
            } else if( this.dragging.id == 'endTab' ) {
                this.otherStartLeft = parseInt(this.$.startTab.style.left || 0 );
            }
            //console.log('Drag start: '+this.dragging.id);
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

            //console.log('Drag end: '+this.dragging.id);

            var parentX = $(this).offset().left;
            var pos = $(this.$[this.dragging.id]).offset().left - parentX;
            
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

    Polymer({
        is: 'cwn-app-icon',

        properties : {
            type : {
                type : String,
                observer : 'onTypeChange'
            },
            width : {
                type: String,
                observer : 'redraw'
            },
            height : {
                type: String,
                observer : 'redraw'
            },
            fillStyle : String,
            fillFromType : Boolean,
            fontSize : {
                type : String,
                observer : 'onFontSizeChange'
            }
        },

        configure : function() {
            return {
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
                }
            }
        },

        attached : function() {
            this.redraw();
        },

        onFontSizeChange : function() {
            if( !this.$.icon ) return;

            this.$.icon.style.fontSize = this.fontSize+'px';
        },

        onTypeChange : function() {
            if( this.type == 'Diversion' || this.type == 'Return Flow' ) {
                $(this.$.canvas).hide();
                $(this.$.icon).show();
            } else {
                $(this.$.icon).hide();
                $(this.$.show).show();
            }
            this.redraw();
        },

        redraw : function() {
            if( !this.$.canvas ) return;
            if( this.height === undefined || this.width == undefined ) return;

            this.fontSize = this.width-15;
            if( this.fontSize < 14 ) this.fontSize = 14;

            this.$.canvas.setAttribute('height', this.height);
            this.$.canvas.setAttribute('width', this.width);

            var ctx = this.$.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.width, this.height);

            if( !CWN.render[this.type] ) return;
            CWN.render[this.type](ctx, 2, 2, this.width-4, this.height-4);
        }
    }); 
;

    Polymer({
        is : 'cwn-date-linechart',

        published : {
            label : String,
            xlabel : String,
            ylabel : String,
            data : Object,
            height : {
                type : Number,
                observer : 'setHeight'
            },
            options : Object,
            cols: Object,
            startDate : Date,
            stopDate : Date,
            type: String,
            animate : Boolean
        },

        configure : function() {
            return {
                options : null,
                type : '',
                cols : null,
                dt : null,
                chart : null,
                height : 400,
                data : [],
                startDate : null,
                stopDate : null,
                animate : false,

                updateTimer : -1,

                onLoadHandlerSet : false
            }
        },

        attached : function() {
            $(window).on('resize', this.redraw.bind(this));

            setTimeout(function(){
                // see if we have initial state
                var slider = document.querySelector('cwn-dateslider');
                if( slider && slider.current) {
                    this.startDate = slider.current.start;
                    this.stopDate = slider.current.end;
                }

                this.update();
            }.bind(this), 50);
        },

        onStop : function() {
            this.update();
        },

        setHeight : function() {
            if( !this.$ ) return;

            this.$.root.style.height = this.height+'px';
            this.redraw();
        },

        setOnloadHandler : function() {
            if( this.onLoadHandlerSet ) return;

            // put in global scope by cwn-datastore
            chartLoadHandlers.push(function(){
                this.update();
            }.bind(this));
        },

        update : function(data) {
            if( data ) this.data = data;

            if( !window.google.visualization ) return this.setOnloadHandler();
            if( !window.google.visualization.LineChart ) return this.setOnloadHandler();
            if( !this.$ ) return;

            if( !this.chart ) {
                if( this.type ) {
                    this.chart = new google.visualization[this.type](this.$.root);
                } else {
                    this.chart = new google.visualization.LineChart(this.$.root);
                }
            }

            if( !this.cols ) {
                if( !this.data ) this.data = ['date', 'value'];
                //else if( !this.data.length == 0 ) this.data = ['date', 'value'];

                try {
                    if( typeof this.data[0][1] != 'string' ) this.data.splice(0, 0, ['date', 'value']);
                } catch(e) {
                    debugger;
                }
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
            if( !this.startDate && !this.stopDate ) {
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

                if( this.startDate && this.stopDate ) {
                    if( d >= this.startDate.getTime() && d <= this.stopDate.getTime() ) {
                        filteredData.push(this.data[i]);
                    }
                } else if ( this.startDate ) {
                    if( d >= this.startDate.getTime() ) {
                        filteredData.push(this.data[i]);
                    }
                } else {
                    if( d <= this.stopDate.getTime()  ) {
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

    Polymer({
        is : 'cwn-linechart',

        published : {
            label : String,
            xlabel : String,
            ylabel : String,
            height : Number,
            animate : Boolean,
            options : Object,
            cols : Object,
            type : String
        },

        /*bind : {
            label : 'redraw',
            xlabel : 'redraw',
            ylabel : 'redraw',
            height : 'setHeight',
            data  : 'update',
            start : 'update',
            stop  : 'update',
            options : 'update'
        },*/

        bind : {
            height: 'setHeight'
        },

        configure : function() {
            return {
                onLoadHandlerSet : false,
                dt : null,
                chart : null,
                height : 400,
                animate : false,
                updateTimer : -1,
                options : null,
                cols : null,
                data : null
            }
        },

        ready : function() {
            $(window).on('resize', function(){
                this.redraw();
            }.bind(this));

            this.async(function(){
                this.redraw();
            });
        },
        
        setHeight : function() {
            if( !this.$ ) return;

            this.$.root.style.height = this.height+'px';
            this.redraw();
        },

        setOnloadHandler : function() {
            if( this.onLoadHandlerSet ) return;

            // put in global scope by cwn-datastore
            chartLoadHandlers.push(function(){
                this.update(this.data);
            }.bind(this));
        },
        

        update : function(data) {
            this.data = data;
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
                this._update(this.data);
            }.bind(this), 500);
        },

        _update : function(data) {
            if( this.cols ) {
                this.dt = new google.visualization.DataTable();
                for( var i = 0; i < this.cols.length; i++ ) {
                    this.dt.addColumn(this.cols[i]);
                }
                this.dt.addRows(data);
            } else {
                this.dt = google.visualization.arrayToDataTable(data);
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

  Polymer({
      is : 'cwn-popup',

      properties : {
        header : {
          type : String,
          observer : 'onHeaderUpdate'
        },
        noFooter : {
          type : Boolean,
          value : true
        },
        showing : {
          type : Boolean,
          value : false
        }
      },

      ready : function() {
        this.classList.add('modal');
        this.classList.add('fade');
      },

      init : function() {
        $(this).modal({show: false, backdrop:'static'});

        /*$(this.querySelectorAll('[data-dismiss="modal"]'))
          .on('click', function(){
              this.hide();
          }.bind(this));*/
      },

      onHeaderUpdate : function() {
        if( !this.header ) return;

        if( this.header.length > 0 ) this.showHeader = true;
        else this.showHeader = false;
      },

      show: function() {
          if( this.showing ) return;
          this.showing = true;

          $(this).modal('show');
      },

      hide: function(e) {
        if( !this.showing ) return;
        this.showing = false;

        $(this).modal('hide');
      }
  });
;

    Polymer({
        is : 'cwn-app-layout'
    });
;

    Polymer({
        is : 'cwn-filters',

        configure : function() {
            return {
                legendArr : [],
                iconSize : 22,

                filters : {
                    calibrationMode : true,
                    oneStepMode : true,
                    text : '',
                }
            }
        },

        ready : function() {
            for( var key in this.legend ) {
                this.filters[key.replace(' ','_').replace('-','_')] = true;
                this.legendArr.push({
                    iconSize : this.iconSize,
                    name : key,
                    checked : true
                });
            }
        },

        _updateCheckbox : function(e) {
            var name = e.currentTarget.getAttribute('name');
            var value = $(e.currentTarget).is(':checked');
            this.filters[name.replace(' ','_').replace('-','_')] = value;

            this.fire('update');
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

        setCalibrationMode : function(e) {
            this.filters.calibrationMode = $(e.currentTarget).is(':checked');
            this.fire('update');
        },

        setOneStepMode : function(e) {
            this.filters.oneStepMode = $(e.currentTarget).is(':checked');
            this.fire('update');
        },

        onKeyUp : function(e) {
            if( e.which != 13 ) return;
            this.updateFilterText(e);
        },

        updateFilterText : function(e) {
            this.filters.text = e.currentTarget.value;
            this.fire('update');
        }
    });
;

    Polymer({
        is : 'cwn-node-info',

        properties : {
            feature : {
              type : Object,
              observer : 'update'
            },
            ds : {
              type : Object,
              observer : 'update'
            },
            leaflet : {
              type : Object
            },
            islocal : {
              type : Boolean
            }
        },

        configure : function() {
            return {
                hasOriginDescription : false,
                originDescription : '',
                editUrl : '',
                originUrl : '',
                terminalUrl : '',
                showNavLinks : false,
                hasTerminalDescription : false,
                terminalDescription : '',
                origins : [],
                terminals : []
            }
        },

        ready : function() {
            $(window).on('resize', this.updateSize.bind(this));
        },

        update : function() {
            if( !this.ds || !this.feature ) return;

            this.editUrl = '#edit/'+this.feature.properties.prmname;

            this.origins = [];
            this.terminals = [];

            var link;
            if( this.feature && this.feature.properties.origins ) {
                for( var i = 0; i < this.feature.properties.origins.length; i++ ) {
                  link = this._lookupLink(this.feature.properties.origins[i], this.feature.properties.prmname);
                  if( link ) {
                    this.origins.push({
                      name: this.feature.properties.origins[i], 
                      link: '#info/'+link.properties.prmname,
                      hasLink : true, 
                      description: this.ds.lookupMap[this.feature.properties.origins[i]] ? 
                                    this.ds.lookupMap[this.feature.properties.origins[i]].properties.description : ''
                    });
                  } else {
                    this.origins.push({
                        name: this.feature.properties.origins[i],
                        hasLink : false, 
                        link: '', 
                        description: ''
                    });
                  }
                }
            }

            if( this.feature && this.feature.properties.terminals ) {
                for( var i = 0; i < this.feature.properties.terminals.length; i++ ) {
                  link = this._lookupLink(this.feature.properties.prmname, this.feature.properties.terminals[i]);
                  if( link ) {
                    this.terminals.push({
                      name: this.feature.properties.terminals[i], 
                      link: '#info/'+link.properties.prmname,
                      hasLink : true, 
                      description: this.ds.lookupMap[this.feature.properties.terminals[i]] ? 
                                    this.ds.lookupMap[this.feature.properties.terminals[i]].properties.description : ''
                    });
                  } else {
                    this.terminals.push({
                        name: this.feature.properties.terminals[i], 
                        link: '', 
                        description: '',
                        hasLink : false, 
                    });
                  }
                }
            }

            $(window).on('resize', this.updateSize.bind(this));

            this.onTypeUpdate();
            this.onOriginUpdate();
            this.onTerminalUpdate();
        },

        onOriginUpdate : function() {
            if( !this.ds ) return;

            if( !this.feature.properties.origin ) return this.$.origin.style.display = 'none'; 
            else this.$.origin.style.display = 'block'; 

            this.hasOriginDescription = false;
            this.originDescription = '';

            if( this.ds.lookupMap[this.feature.properties.origin] ) {
                this.hasOriginDescription = true;
                this.originDescription = this.ds.lookupMap[this.feature.properties.origin].properties.description
            }
        },

        onTerminalUpdate : function() {
            if( !this.ds ) return;

            if( !this.feature.properties.terminus ) return this.$.terminal.style.display = 'none'; 
            else this.$.terminal.style.display = 'block'; 

            this.hasTerminalDescription = false;
            this.terminalDescription = '';

            if( this.ds.lookupMap[this.feature.properties.terminus] ) {
                this.hasTerminalDescription = true;
                this.terminalDescription = this.ds.lookupMap[this.feature.properties.terminus].properties.description
            }
        },

        onTypeUpdate : function() {
            if( !this.ds ) return;

            this.showNavLinks = true;

            if( this.feature.properties.type == 'Diversion' || this.feature.properties.type == 'Return Flow' ) {
                this.showNavLinks = false;
            }
        },

        _lookupLink : function(origin, terminal) {
          for( var i = 0; i < this.ds.data.links.length; i++ ) {
            if( this.ds.data.links[i].properties.origin == origin && this.ds.data.links[i].properties.terminus == terminal ) {
              return this.ds.data.links[i];
            }
          }
          return null;
        },

        updateSize : function() {
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

    Polymer({
        is : 'cwn-cost-info',

        properties : {
            feature : {
                type : Object,
                observer : 'update'
            },
            hasTimeSeries : {
                type : Boolean,
                notify : true
            }
        },

        configure : function() {
            return {
                costsMonths : [],
                costs : {
                  label : '',
                  data : {},
                  cost : 0, // for constant costs
                  selected : 0
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

                showCostData : false,
                showMonthlyVariableCost : false,
                showConstantCost : false,
                costChartLabel : '',
                costChartData : [],
                showConstraints : false,
                showConstantConstraints : false,
                showTimeSeriesConstraints : false,
                showChartConstraints : false,
                hasTimeSeries : false,
                charts : {}
            }
        },

        update : function() {
            if( !this.feature ) return;

            this.costLoading = false;
            this.costLoadError = false;

            this.constraintChart.data = [];
            this.constraintChart.isTimeSeries = false;
            this.hasTimeSeries = false;
            this.constraintChart.constant = -1;
            this.constraintChart.label = '';

            this.loadCostData();
        },

        loadCostData : function() {
          this.showCostData = false;
          this.showMonthlyVariableCost = false;
          this.showConstantCost = false;
          this.showConstantConstraints = false;
          this.$.constraintChartAnchor.innerHTML = '';
          this.showConstraints = false;
          this.showConstantConstraints = false;

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

                this.showCostData = true;

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
          this.costsMonths = [];
          this.costs.selected = 0;

          this.costs.cost = d.costs.cost;

          if( !d.costs.costs ) return;
          if( d.costs.costs.length == 0 ) return;

          for( var i = 0; i < d.costs.costs.length; i++ ) {
            var m = d.costs.costs[i];

            var label = m.label;
            if( (!label || label == '') && i < 12 ) label = this.months[i];

            this.costs.data[label] = [];
            this.costsMonths.push({
              index : i,
              label : label
            });

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
          };
          this._setMonth(0);

          if( this.costs.label == 'Monthly Variable' ) this.showMonthlyVariableCost = true;
          if( this.costs.label == 'Constant' ) this.showConstantCost = true;
        },

        renderConstraints : function(constraints) {

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
              this.hasTimeSeries = true;
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

          this.updateConstraintUi();
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
              this.hasTimeSeries = true;

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
              this.hasTimeSeries = true;

              l = constraints.upper.bound.length;
            } else if ( constraints.upper.bound_type == 'Monthly' && l < constraints.upper.bound.length ) {
              l = constraints.upper.bound.length;
            }
          }
          return l;
        },

        _setMonth : function(index) {
          this.costs.selected = (typeof index == 'object') ? parseInt(index.currentTarget.getAttribute('index')) : index;

          this.costChartLabel = this.costs.label+' - '+this.costsMonths[this.costs.selected].label;
          this.costChartData = this.costs.data[this.costsMonths[this.costs.selected].label];

          this.$.lineChart.update(this.costChartData);
        },

        updateConstraintUi : function() {
            if( this.constraintChart.data.length != 0 || this.constraintChart.constant != -1 ) {
                this.showConstraints = true;
            }

            if( this.constraintChart.constant != -1 ) {
                this.showConstantConstraints = true;
            }
            
            this.$.constraintChartAnchor.innerHTML = '';
            this.charts.constraintChart = null;


            if( this.constraintChart.data.length != 0 ) {
                var isline = false;
                
                if( this.constraintChart.isTimeSeries ) {
                    this.hasTimeSeries = true;
                    this.charts.constraintChart = this.$.constraintChartTimeSeries.stamp(this.constraintChart);
                } else {
                    isline = true;
                    this.charts.constraintChart = this.$.constraintChart.stamp(this.constraintChart);
                }


                this.$.constraintChartAnchor.appendChild(this.charts.constraintChart.root);

                if( isline ) {
                  this.$.constraintChartAnchor.querySelector('cwn-linechart').update(this.constraintChart.data);
                }
            }
        }


    })
;
/*
    And the visibility of various panels and charts based on given features
*/
var InfoPageDomControllers = function() {

    function updateDateSliderVisibility() {
        this.showDateRangeSlider = this.inflows.length > 0 || this.hasTimeSeries
    }

    function stampEacChart() {

        if( this.eacChart.data.length == 0 ) {

            this.charts.eacChart = null;
            this.$.eacChartRoot.innerHTML = '';

        } else if( !this.charts.eacChart ) {

            this.charts.eacChart = this.$.eacChart.stamp(this.eacChart);
            this.$.eacChartRoot.appendChild(this.charts.eacChart.root);

            this.async(function(){
                this.$.eacChartRoot.querySelector('cwn-linechart').update(this.eacChart.data);
            });
        }
    }

    function onLoadingChange() {
        this.notifyPath('ds.loading', this.ds.loading);
    }

    return {
        updateDateSliderVisibility : updateDateSliderVisibility,
        stampEacChart : stampEacChart,
        onLoadingChange : onLoadingChange
    }
}
;
Polymer({
    is : 'cwn-info-page',

    mixins : [new InfoPageDomControllers()],

    properties : {
      hasTimeSeries : {
        type : Boolean,
        notify : true,
        observer : 'updateDateSliderVisibility'
      },
      feature : {
        type : Object,
        observer : 'update'
      }
    },

    configure : function() {
      return {
        feature : null,

        hack : '',
        islocal : false,

        tableProperties : ['prmname'],

        // loading flags
        climateLoadError : false,
        costLoadError : false,
        climateLoading : false,
        costLoading : false,
        loading : false,

        // have to do long lookup right now, is there are better way?
        origins : [],
        terminals : [],

        // render data.  Data in a format ready to draw above
        inflows : [],

        map : {},

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

        // date filtering
        filters : {
          start : null,
          stop : null
        },

        // dom controller stuff
        hasTimeSeries : false,
        showDateRangeSlider : false,
        showClimateData : false,
        charts : {}
      }
    },

    init : function(map, ds, islocal) {
      this.map = map;
      this.ds = ds;
      this.islocal = islocal;

      if( this.ds.loading ) {
        this.ds.addEventListener('load', function(e){
          this.loading = e.detail;
          if( !this.loading ) this.onLoad();
        }.bind(this));
      } else {
        this.onLoad();
      }
    },

    onLoad : function() {
      var loc = window.location.hash.replace('#','').split('/');
      if( loc[0] == 'info' && loc.length > 1) {
        if( this.feature = this.ds.lookupMap[loc[1]] ) {
          this.update();
        } else {
          this.feature = this.ds.lookupMap[loc[1]];
        }
      }
    },

    update : function() {
      if( !this.ds ) return;
      if( this.feature == null ) return alert('Feature not found');

      this.climateLoadError = false;
      this.climateLoading = false;
      this.updateDateSliderVisibility();

      this.eacChart.data = [];

      this.loadClimateData();
    },

    loadClimateData : function() {
      this.showClimateData = false;
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
            
            this.showClimateData = true;
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

      this.stampEacChart();
      this.updateDateSliderVisibility();
    },

    updateDateFilters : function(e) {
      var eles = this.querySelectorAll('cwn-date-linechart');

      for( var i = 0; i < eles.length; i++ ) {
        eles[i].startDate = e.detail.start;
        eles[i].stopDate = e.detail.end;

        eles[i].update();
      }

      this.setPathValue('filters.start', e.detail.start);
      this.setPathValue('filters.stop', e.detail.end);
    },  

    back : function() {
      window.location.hash = 'map'
    },

    _setCostMonth : function(e) {
      this.$.costInfo.setMonth(parseInt(e.currentTarget.getAttribute('index')));
    }

});;

    Polymer({
        is : 'cwn-settings',

        bind : {
            dbType : 'onDbTypeChange',
            'settings.neo4jUrl' : 'save'
        },

        configure : function() {
            return {
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
                }
            }
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

    Polymer({
        is : 'cwn-graph',


        properties : {
          prmname : {
            type : String,
            observer : 'update'
          }
        },

        ready : function() {
          this.hack = '';

          this.maxDepth = '6';
          this.negativeDepth = '0';
          this.graph = null;
          this.graphJson = {};
          this.updateTimer = -1;
          this.prmname = '';
          this.popupNode = {};

          this.nodeLevels = {};
          this.negativeLevels = {};
          this.cnodes = [];
          this.graphLink = '';
          this.infoLink = '';
          this.mapLink = '#map';
        },

        attached : function() {
            //this.$.popup.target = this;
            $(window).on('hashchange', this.changeNode.bind(this));
            this.ds = document.querySelector('cwn-datastore');
            this.changeNode();

            this.async(function(){
                this.$.popup.init();
            });
        },

        setLinks : function() {
            if( !this.popupNode ) return;
            if( !this.popupNode.properties ) return;

            this.graphLink = 'graph/'+this.popupNode.properties.prmname;
            this.infoLink = 'info/'+this.popupNode.properties.prmname;
        },

        changeNode : function() {
            if( !this.$ ) return;

            var loc = window.location.hash.replace('#','').split('/');
            if( loc[0] == 'graph' ) {
                this.async(function(){
                    this.prmname = loc.length == 1 ? this.ds.data.nodes[0] : loc[1];
                });

                if( !this.graph ) this.render();

                setTimeout(function(){
                    this.update();

                    // make sure it was drawn correctly
                    setTimeout(function(){
                         this.graph.refresh();
                    }.bind(this), 500);
                    setTimeout(function(){
                         this.graph.refresh();
                    }.bind(this), 1000);
                }.bind(this), 200);
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

                    this.$.popup.header = this.popupNode.properties.prmname;
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

        goToGraphLink : function() {
          window.location.hash = 'graph/'+this.popupNode.properties.prmname;
          this.hide();
        },

        goToInfoLink : function() {
          window.location.hash = 'info/'+this.popupNode.properties.prmname;
          this.hide();
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
        },

        maxUpdate : function(e) {
            this.maxDepth = e.currentTarget.value;
            this.update();
        },

        minUpdate : function(e) {
            this.negativeDepth = e.currentTarget.value;
            this.update();
        }

    });
;

    Polymer({
        is : 'cwn-map',

        bind : {
            'ds.loading' : 'update',
            'map' : 'update'
        },

        configure : function() {
            return {
                updating: false,
                filters : {},
                map : null,
                ds : null,

                markerLayer : null,
                edgeLayer : null,
                redrawMarkerSizesTimer : -1
            }
        },

        init : function(ds, legend, filters) {
            this.ds = ds;
            this.filters = filters;
            this.legend = legend;

            this.map = L.map(this.$.leaflet).setView([40, -121], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18
            }).addTo(this.map);

            this.map.on('zoomend', this._onZoomEnd.bind(this));

            this.ds.onLoad(this._process.bind(this));
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
            if( !this.ds ) return;
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
/* WHY AGAIN 
            for( var key in this.markerLayer._layers ) {
                this._hackTouchEvent(this.markerLayer._layers[key]);
            }
*/
            //this.redrawMarkerSizes();

            if( this.map.getZoom() < 10 ) {
                $('.LineCanvas').hide();
            } else {
                $('.LineCanvas').show();
            }
        },

        // check sizes

        redrawMarkerSizes : function() {
        
            if( this.redrawMarkerSizesTimer != -1 ) {
                clearTimeout(this.redrawMarkerSizesTimer);
            }

            this.redrawMarkerSizesTimer = setTimeout(function(){
                this.redrawMarkerSizesTimer = -1;
                this._redrawMarkerSizes();
            }.bind(this), 2000);
        },

        _redrawMarkerSizes : function() {
            console.log('redrawing');
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
        },

        _getMarker : function(feature, ll) {
            var render = feature.properties._render || {};
            var type = feature.properties.type;

            /*
            TODO: this is too slow right now :(
            if( this.map.getZoom() < 10 ) {
                s = this.map.getZoom() * 3;
            } else {
                s = this.map.getZoom() * 4;
            }

            var options = {
                iconSize : new L.Point(s, s),
                type : type
            };
            */
            var options = {
                iconSize : new L.Point(24, 24),
                type : type,
                name : feature.properties.prmname
            };
  

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

                    // TODO: make sure this doesn't cause a memory leak...
                    if( this.options.name ) {
                        var popup = $('<div style="z-index:1000;position:absolute;padding:5px;background-color:white;border:1px solid #ccc">'+this.options.name+'</div>');
                        $(e)
                            .on('mouseover', function(e){
                                popup.css('top', e.clientY+30).css('left', e.clientX);
                                $('body').append(popup);
                            })
                            .on('mouseout', function(){
                                popup.remove();
                            });
                    }

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

    Polymer({
        is : 'cwn-app',

        properties : {
          islocal : {
            type : Boolean,
            notify: true
          }
        },

        configure : function() {
          return {
            PAGES : {
              map : 0,
              info : 1,
              graph : 2
            },

            selectedPage : 0,


            loading : true,

            dataLoaded : false,
            dataLoadHandlers : [],

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
          }
          }
        },

        attached : function() {
          $(window).on('hashchange', function(){
            this.setLocation();
          }.bind(this));

          setTimeout(function(){
            this.$.map.init(this.$.ds, this.legend, this.$.filters.filters);
            this.$.info.init(this.$.map.map, this.$.ds, this.islocal);
          }.bind(this), 200);

          this.setLocation();

          console.log('islocal: '+this.islocal);
        },

        onLoadingChange : function() {
          this.loading = this.$.ds.loading;

          if( this.loading ) this.$.splash.style.display = 'block';
          else this.$.splash.style.display = 'none';
        },

        setLocation : function() {
          var loc = window.location.hash.replace('#','').replace(/\/.*/,'');
          if( loc == '') loc = 'map';

          if( loc == 'map' ) {
            //this.$.pages.selected = this.PAGES.MAP;
            this.selectedPage = this.PAGES.map;
            this.async(function(){
              var ele = this.querySelector('cwn-map');
              if( ele && ele.map ) ele.map.invalidateSize();
            });
          } else if ( loc == 'info' ) {
            //this.$.pages.selected = this.PAGES.INFO;
            this.selectedPage = this.PAGES.info;
            if( this.dataLoaded ) {
              this.setInfoFeature();
            } else {
              this.dataLoadHandlers.push(this.setInfoFeature.bind(this));
            }
          } else if ( loc == 'graph' ) {
            this.selectedPage = this.PAGES.graph;
          }
          this.setPage();
        },

        setPage : function() {
          for( var key in this.PAGES ) {
            if( this.selectedPage == this.PAGES[key] ) $(this.$[key]).show();
            else $(this.$[key]).hide();
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
          this.selectedPage = this.PAGES.info;
          window.location.hash = 'info/'+e.detail.properties.prmname;
        },

        onFiltersUpdated : function() {
          this.$.map.update();
          this.$.graph.update();
        }
    });
