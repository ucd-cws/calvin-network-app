function Events(a){var b={};a.on=function(a,c){b[a]?b[a].push(c):b[a]=[c]},a.fire=function(a,c){if(b[a])for(var d=0;d<b[a].length;d++)b[a][d](c)}}function Datastore(){Events(this),this.settings={},this.islocal=!1,this.loading=!0,this.data={nodes:[],links:[],regions:[]},this.lookupMap={},this.originLookupMap={},this.terminalLookupMap={},this.regionLookupMap={},this.filenameLookupMap={},this.reset=function(){this.fire("load",this.loading),this.loading=!0,this.data={nodes:[],links:[]},this.lookupMap={},this.originLookupMap={},this.terminalLookupMap={},this.regionLookupMap={},this.filenameLookupMap={}},this.reload=function(a){this.islocal=a,this.loadNetwork(this.network,function(a){this.loading=!1,this.fire("load",this.loading),this.fire("loaded")}.bind(this))},this.loadNetwork=function(a,b){function c(){d&&e&&b()}if(this.islocal)return void this.loadFromFileSystem(b);var d=!1,e=!1,f=window.location.protocol+"//"+window.location.host+"/rest/getNetwork";$.ajax({url:f,success:function(a){if(d=!0,a.error)return alert("Server error loading network :("),c();for(var b=0;b<a.length;b++)"Diversion"==a[b].properties.type||"Return Flow"==a[b].properties.type?this.processLink(a[b]):this.processNode(a[b]);c()}.bind(this),error:function(b){d=!0,alert("Error retrieving data from network: "+a),c()}.bind(this)}),f=window.location.protocol+"//"+window.location.host+"/rest/getRegions",$.ajax({url:f,success:function(a){if(e=!0,a.error)return alert("Server error loading network :("),c();this.data.regions=a;for(var b=0;b<this.data.regions.length;b++)this.processRegion(this.data.regions[b]),this.regionLookupMap[this.data.regions[b].name]=this.data.regions[b];c()}.bind(this),error:function(b){e=!0,alert("Error retrieving data from network: "+a),c()}.bind(this)})},this.loadFromFileSystem=function(a){CWN.rootDir&&document.querySelector("cwne-fs-network-loader").run(function(b){for(var c=0;c<b.nodes.length;c++)this.processNode(b.nodes[c]);for(var c=0;c<b.links.length;c++)this.processLink(b.links[c]);a()}.bind(this))},this.processNode=function(a){a&&a.properties&&a.properties.prmname&&(this.markCalibrationNode(a),this.lookupMap[a.properties.prmname]||this.data.nodes.push(a),this.lookupMap[a.properties.prmname]=a,this.filenameLookupMap[a.properties.repo.dirNodeName]=a)},this.processLink=function(a){a&&a.properties&&a.properties.prmname&&(this.markCalibrationNode(a),this.markLinkTypes(a),this.lookupMap[a.properties.prmname]||this.data.links.push(a),this.lookupMap[a.properties.prmname]=a,this.filenameLookupMap[a.properties.repo.dirNodeName]=a,this.originLookupMap[a.properties.origin]?this.originLookupMap[a.properties.origin].push(a):this.originLookupMap[a.properties.origin]=[a],this.terminalLookupMap[a.properties.terminus]?this.terminalLookupMap[a.properties.terminus].push(a):this.terminalLookupMap[a.properties.terminus]=[a])},this.processRegion=function(a){if(a.subregions&&a.subregions.sort(),a.geo&&a.geo.geometry){var b=this.getXYPolygons(a.geo);a.simplified=[];for(var c=0;c<b.length;c++)b[c].length>100?a.simplified.push(L.LineUtil.simplify(b[c],.001)):a.simplified.push(b[c]);a.center=this.getCenter(a.simplified[0]);for(var c=0;c<a.simplified.length;c++)for(var d=0;d<a.simplified[c].length;d++)a.simplified[c][d]=[a.simplified[c][d].x,a.simplified[c][d].y];isNaN(a.center[0])&&(a.center=a.simplified[0][0])}},this.getXYPolygons=function(a){var b,c,d,e=[],f=[];if("Polygon"==a.geometry.type){for(b=0;b<a.geometry.coordinates[0].length;b++)f.push({x:a.geometry.coordinates[0][b][0],y:a.geometry.coordinates[0][b][1]});e.push(f)}else if("MultiPolygon"==a.geometry.type)for(b=0;b<a.geometry.coordinates.length;b++){for(f=[],d=a.geometry.coordinates[b][0],c=0;c<d.length;c++)f.push({x:d[c][0],y:d[c][1]});e.push(f)}return e},this.markLinkTypes=function(a){a.properties.renderInfo={cost:a.properties.hasCosts?!0:!1,amplitude:a.properties.amplitude?!0:!1,constraints:a.properties.hasConstraints?!0:!1,environmental:a.properties.hasClimate?!0:!1};try{this.lookupMap[a.properties.terminus]&&"Sink"==this.lookupMap[a.properties.terminus].properties.type?a.properties.renderInfo.type="flowToSink":"Return Flow"==a.properties.type?a.properties.renderInfo.type="returnFlowFromDemand":this.isGWToDemand(a)?a.properties.renderInfo.type="gwToDemand":!this.lookupMap[a.properties.origin]||"in"!=this.lookupMap[a.properties.origin].properties.calibrationMode&&"both"!=this.lookupMap[a.properties.origin].properties.calibrationMode?a.properties.renderInfo.type="unknown":a.properties.renderInfo.type="artificalRecharge"}catch(b){}var c=a.geometry.coordinates[1][0]-a.geometry.coordinates[0][0],d=a.geometry.coordinates[1][1]-a.geometry.coordinates[0][1];a.properties.renderInfo.rotate=Math.atan(c/d)*(180/Math.PI)},this.isGWToDemand=function(a){var b=this.lookupMap[a.properties.origin],c=this.lookupMap[a.properties.terminal];return b&&c?"Groundwater Storage"!=b.properties.type?!1:"Non-Standard Demand"==c.properties.type||"Agricultural Demand"==c.properties.type||"Urban Demand"==c.properties.type?!0:!1:!1},this.markCalibrationNode=function(a){if(a.properties.prmname.indexOf("_")>-1){var b=a.properties.prmname.split("_");if(!b[0].match(/^CN.*/)&&!b[1].match(/^CN.*/))return}else if(!a.properties.prmname.match(/^CN.*/))return;var c=!1,d=!1;if(a.properties.terminals)for(var e=0;e<a.properties.terminals.length;e++)if(null!=a.properties.terminals[e]){d=!0;break}if(a.properties.origins)for(var e=0;e<a.properties.origins.length;e++)if(null!=a.properties.origins[e]){c=!0;break}a.properties.calibrationNode=!0,(c||d)&&(c&&d?a.properties.calibrationMode="both":c?a.properties.calibrationMode="in":d&&(a.properties.calibrationMode="out"))},this.getCenter=function(a){var b,c,d,e,f,g,h,i;h=i=0;for(b=0,d=a.length,c=d-1;d>b;c=b++)e=a[b],f=a[c],g=e.y*f.x-f.y*e.x,h+=(e.x+f.x)*g,i+=(e.y+f.y)*g;return g=6*this._getArea(a),[-1*(h/g),-1*(i/g)]},this._getArea=function(a){for(var b,c,d=0,e=a.length,f=e-1,g=0;e>g;f=g++)b=a[g],c=a[f],d+=b.x*c.y,d-=b.y*c.x;return d/=2}}if(!function(a,b,c){var d=a.L,e={};e.version="0.7.3","object"==typeof module&&"object"==typeof module.exports?module.exports=e:"function"==typeof define&&define.amd&&define(e),e.noConflict=function(){return a.L=d,this},a.L=e,e.Util={extend:function(a){var b,c,d,e,f=Array.prototype.slice.call(arguments,1);for(c=0,d=f.length;d>c;c++){e=f[c]||{};for(b in e)e.hasOwnProperty(b)&&(a[b]=e[b])}return a},bind:function(a,b){var c=arguments.length>2?Array.prototype.slice.call(arguments,2):null;return function(){return a.apply(b,c||arguments)}},stamp:function(){var a=0,b="_leaflet_id";return function(c){return c[b]=c[b]||++a,c[b]}}(),invokeEach:function(a,b,c){var d,e;if("object"==typeof a){e=Array.prototype.slice.call(arguments,3);for(d in a)b.apply(c,[d,a[d]].concat(e));return!0}return!1},limitExecByInterval:function(a,b,c){var d,e;return function f(){var g=arguments;return d?void(e=!0):(d=!0,setTimeout(function(){d=!1,e&&(f.apply(c,g),e=!1)},b),void a.apply(c,g))}},falseFn:function(){return!1},formatNum:function(a,b){var c=Math.pow(10,b||5);return Math.round(a*c)/c},trim:function(a){return a.trim?a.trim():a.replace(/^\s+|\s+$/g,"")},splitWords:function(a){return e.Util.trim(a).split(/\s+/)},setOptions:function(a,b){return a.options=e.extend({},a.options,b),a.options},getParamString:function(a,b,c){var d=[];for(var e in a)d.push(encodeURIComponent(c?e.toUpperCase():e)+"="+encodeURIComponent(a[e]));return(b&&-1!==b.indexOf("?")?"&":"?")+d.join("&")},template:function(a,b){return a.replace(/\{ *([\w_]+) *\}/g,function(a,d){var e=b[d];if(e===c)throw new Error("No value provided for variable "+a);return"function"==typeof e&&(e=e(b)),e})},isArray:Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},emptyImageUrl:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="},function(){function b(b){var c,d,e=["webkit","moz","o","ms"];for(c=0;c<e.length&&!d;c++)d=a[e[c]+b];return d}function c(b){var c=+new Date,e=Math.max(0,16-(c-d));return d=c+e,a.setTimeout(b,e)}var d=0,f=a.requestAnimationFrame||b("RequestAnimationFrame")||c,g=a.cancelAnimationFrame||b("CancelAnimationFrame")||b("CancelRequestAnimationFrame")||function(b){a.clearTimeout(b)};e.Util.requestAnimFrame=function(b,d,g,h){return b=e.bind(b,d),g&&f===c?void b():f.call(a,b,h)},e.Util.cancelAnimFrame=function(b){b&&g.call(a,b)}}(),e.extend=e.Util.extend,e.bind=e.Util.bind,e.stamp=e.Util.stamp,e.setOptions=e.Util.setOptions,e.Class=function(){},e.Class.extend=function(a){var b=function(){this.initialize&&this.initialize.apply(this,arguments),this._initHooks&&this.callInitHooks()},c=function(){};c.prototype=this.prototype;var d=new c;d.constructor=b,b.prototype=d;for(var f in this)this.hasOwnProperty(f)&&"prototype"!==f&&(b[f]=this[f]);a.statics&&(e.extend(b,a.statics),delete a.statics),a.includes&&(e.Util.extend.apply(null,[d].concat(a.includes)),delete a.includes),a.options&&d.options&&(a.options=e.extend({},d.options,a.options)),e.extend(d,a),d._initHooks=[];var g=this;return b.__super__=g.prototype,d.callInitHooks=function(){if(!this._initHooksCalled){g.prototype.callInitHooks&&g.prototype.callInitHooks.call(this),this._initHooksCalled=!0;for(var a=0,b=d._initHooks.length;b>a;a++)d._initHooks[a].call(this)}},b},e.Class.include=function(a){e.extend(this.prototype,a)},e.Class.mergeOptions=function(a){e.extend(this.prototype.options,a)},e.Class.addInitHook=function(a){var b=Array.prototype.slice.call(arguments,1),c="function"==typeof a?a:function(){this[a].apply(this,b)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(c)};var f="_leaflet_events";e.Mixin={},e.Mixin.Events={addEventListener:function(a,b,c){if(e.Util.invokeEach(a,this.addEventListener,this,b,c))return this;var d,g,h,i,j,k,l,m=this[f]=this[f]||{},n=c&&c!==this&&e.stamp(c);for(a=e.Util.splitWords(a),d=0,g=a.length;g>d;d++)h={action:b,context:c||this},i=a[d],n?(j=i+"_idx",k=j+"_len",l=m[j]=m[j]||{},l[n]||(l[n]=[],m[k]=(m[k]||0)+1),l[n].push(h)):(m[i]=m[i]||[],m[i].push(h));return this},hasEventListeners:function(a){var b=this[f];return!!b&&(a in b&&b[a].length>0||a+"_idx"in b&&b[a+"_idx_len"]>0)},removeEventListener:function(a,b,c){if(!this[f])return this;if(!a)return this.clearAllEventListeners();if(e.Util.invokeEach(a,this.removeEventListener,this,b,c))return this;var d,g,h,i,j,k,l,m,n,o=this[f],p=c&&c!==this&&e.stamp(c);for(a=e.Util.splitWords(a),d=0,g=a.length;g>d;d++)if(h=a[d],k=h+"_idx",l=k+"_len",m=o[k],b){if(i=p&&m?m[p]:o[h]){for(j=i.length-1;j>=0;j--)i[j].action!==b||c&&i[j].context!==c||(n=i.splice(j,1),n[0].action=e.Util.falseFn);c&&m&&0===i.length&&(delete m[p],o[l]--)}}else delete o[h],delete o[k],delete o[l];return this},clearAllEventListeners:function(){return delete this[f],this},fireEvent:function(a,b){if(!this.hasEventListeners(a))return this;var c,d,g,h,i,j=e.Util.extend({},b,{type:a,target:this}),k=this[f];if(k[a])for(c=k[a].slice(),d=0,g=c.length;g>d;d++)c[d].action.call(c[d].context,j);h=k[a+"_idx"];for(i in h)if(c=h[i].slice())for(d=0,g=c.length;g>d;d++)c[d].action.call(c[d].context,j);return this},addOneTimeEventListener:function(a,b,c){if(e.Util.invokeEach(a,this.addOneTimeEventListener,this,b,c))return this;var d=e.bind(function(){this.removeEventListener(a,b,c).removeEventListener(a,d,c)},this);return this.addEventListener(a,b,c).addEventListener(a,d,c)}},e.Mixin.Events.on=e.Mixin.Events.addEventListener,e.Mixin.Events.off=e.Mixin.Events.removeEventListener,e.Mixin.Events.once=e.Mixin.Events.addOneTimeEventListener,e.Mixin.Events.fire=e.Mixin.Events.fireEvent,function(){var d="ActiveXObject"in a,f=d&&!b.addEventListener,g=navigator.userAgent.toLowerCase(),h=-1!==g.indexOf("webkit"),i=-1!==g.indexOf("chrome"),j=-1!==g.indexOf("phantom"),k=-1!==g.indexOf("android"),l=-1!==g.search("android [23]"),m=-1!==g.indexOf("gecko"),n=typeof orientation!=c+"",o=a.navigator&&a.navigator.msPointerEnabled&&a.navigator.msMaxTouchPoints&&!a.PointerEvent,p=a.PointerEvent&&a.navigator.pointerEnabled&&a.navigator.maxTouchPoints||o,q="devicePixelRatio"in a&&a.devicePixelRatio>1||"matchMedia"in a&&a.matchMedia("(min-resolution:144dpi)")&&a.matchMedia("(min-resolution:144dpi)").matches,r=b.documentElement,s=d&&"transition"in r.style,t="WebKitCSSMatrix"in a&&"m11"in new a.WebKitCSSMatrix&&!l,u="MozPerspective"in r.style,v="OTransition"in r.style,w=!a.L_DISABLE_3D&&(s||t||u||v)&&!j,x=!a.L_NO_TOUCH&&!j&&function(){var a="ontouchstart";if(p||a in r)return!0;var c=b.createElement("div"),d=!1;return c.setAttribute?(c.setAttribute(a,"return;"),"function"==typeof c[a]&&(d=!0),c.removeAttribute(a),c=null,d):!1}();e.Browser={ie:d,ielt9:f,webkit:h,gecko:m&&!h&&!a.opera&&!d,android:k,android23:l,chrome:i,ie3d:s,webkit3d:t,gecko3d:u,opera3d:v,any3d:w,mobile:n,mobileWebkit:n&&h,mobileWebkit3d:n&&t,mobileOpera:n&&a.opera,touch:x,msPointer:o,pointer:p,retina:q}}(),e.Point=function(a,b,c){this.x=c?Math.round(a):a,this.y=c?Math.round(b):b},e.Point.prototype={clone:function(){return new e.Point(this.x,this.y)},add:function(a){return this.clone()._add(e.point(a))},_add:function(a){return this.x+=a.x,this.y+=a.y,this},subtract:function(a){return this.clone()._subtract(e.point(a))},_subtract:function(a){return this.x-=a.x,this.y-=a.y,this},divideBy:function(a){return this.clone()._divideBy(a)},_divideBy:function(a){return this.x/=a,this.y/=a,this},multiplyBy:function(a){return this.clone()._multiplyBy(a)},_multiplyBy:function(a){return this.x*=a,this.y*=a,this},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},distanceTo:function(a){a=e.point(a);var b=a.x-this.x,c=a.y-this.y;return Math.sqrt(b*b+c*c)},equals:function(a){return a=e.point(a),a.x===this.x&&a.y===this.y},contains:function(a){return a=e.point(a),Math.abs(a.x)<=Math.abs(this.x)&&Math.abs(a.y)<=Math.abs(this.y)},toString:function(){return"Point("+e.Util.formatNum(this.x)+", "+e.Util.formatNum(this.y)+")"}},e.point=function(a,b,d){return a instanceof e.Point?a:e.Util.isArray(a)?new e.Point(a[0],a[1]):a===c||null===a?a:new e.Point(a,b,d)},e.Bounds=function(a,b){if(a)for(var c=b?[a,b]:a,d=0,e=c.length;e>d;d++)this.extend(c[d])},e.Bounds.prototype={extend:function(a){return a=e.point(a),this.min||this.max?(this.min.x=Math.min(a.x,this.min.x),this.max.x=Math.max(a.x,this.max.x),this.min.y=Math.min(a.y,this.min.y),this.max.y=Math.max(a.y,this.max.y)):(this.min=a.clone(),this.max=a.clone()),this},getCenter:function(a){return new e.Point((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,a)},getBottomLeft:function(){return new e.Point(this.min.x,this.max.y)},getTopRight:function(){return new e.Point(this.max.x,this.min.y)},getSize:function(){return this.max.subtract(this.min)},contains:function(a){var b,c;return a="number"==typeof a[0]||a instanceof e.Point?e.point(a):e.bounds(a),a instanceof e.Bounds?(b=a.min,c=a.max):b=c=a,b.x>=this.min.x&&c.x<=this.max.x&&b.y>=this.min.y&&c.y<=this.max.y},intersects:function(a){a=e.bounds(a);var b=this.min,c=this.max,d=a.min,f=a.max,g=f.x>=b.x&&d.x<=c.x,h=f.y>=b.y&&d.y<=c.y;return g&&h},isValid:function(){return!(!this.min||!this.max)}},e.bounds=function(a,b){return!a||a instanceof e.Bounds?a:new e.Bounds(a,b)},e.Transformation=function(a,b,c,d){this._a=a,this._b=b,this._c=c,this._d=d},e.Transformation.prototype={transform:function(a,b){return this._transform(a.clone(),b)},_transform:function(a,b){return b=b||1,a.x=b*(this._a*a.x+this._b),a.y=b*(this._c*a.y+this._d),a},untransform:function(a,b){return b=b||1,new e.Point((a.x/b-this._b)/this._a,(a.y/b-this._d)/this._c)}},e.DomUtil={get:function(a){return"string"==typeof a?b.getElementById(a):a},getStyle:function(a,c){var d=a.style[c];if(!d&&a.currentStyle&&(d=a.currentStyle[c]),(!d||"auto"===d)&&b.defaultView){var e=b.defaultView.getComputedStyle(a,null);d=e?e[c]:null}return"auto"===d?null:d},getViewportOffset:function(a){var c,d=0,f=0,g=a,h=b.body,i=b.documentElement;do{if(d+=g.offsetTop||0,f+=g.offsetLeft||0,d+=parseInt(e.DomUtil.getStyle(g,"borderTopWidth"),10)||0,f+=parseInt(e.DomUtil.getStyle(g,"borderLeftWidth"),10)||0,c=e.DomUtil.getStyle(g,"position"),g.offsetParent===h&&"absolute"===c)break;if("fixed"===c){d+=h.scrollTop||i.scrollTop||0,f+=h.scrollLeft||i.scrollLeft||0;break}if("relative"===c&&!g.offsetLeft){var j=e.DomUtil.getStyle(g,"width"),k=e.DomUtil.getStyle(g,"max-width"),l=g.getBoundingClientRect();("none"!==j||"none"!==k)&&(f+=l.left+g.clientLeft),d+=l.top+(h.scrollTop||i.scrollTop||0);break}g=g.offsetParent}while(g);g=a;do{if(g===h)break;d-=g.scrollTop||0,f-=g.scrollLeft||0,g=g.parentNode}while(g);return new e.Point(f,d)},documentIsLtr:function(){return e.DomUtil._docIsLtrCached||(e.DomUtil._docIsLtrCached=!0,e.DomUtil._docIsLtr="ltr"===e.DomUtil.getStyle(b.body,"direction")),e.DomUtil._docIsLtr},create:function(a,c,d){var e=b.createElement(a);return e.className=c,d&&d.appendChild(e),e},hasClass:function(a,b){if(a.classList!==c)return a.classList.contains(b);var d=e.DomUtil._getClass(a);return d.length>0&&new RegExp("(^|\\s)"+b+"(\\s|$)").test(d)},addClass:function(a,b){if(a.classList!==c)for(var d=e.Util.splitWords(b),f=0,g=d.length;g>f;f++)a.classList.add(d[f]);else if(!e.DomUtil.hasClass(a,b)){var h=e.DomUtil._getClass(a);e.DomUtil._setClass(a,(h?h+" ":"")+b)}},removeClass:function(a,b){a.classList!==c?a.classList.remove(b):e.DomUtil._setClass(a,e.Util.trim((" "+e.DomUtil._getClass(a)+" ").replace(" "+b+" "," ")))},_setClass:function(a,b){a.className.baseVal===c?a.className=b:a.className.baseVal=b},_getClass:function(a){return a.className.baseVal===c?a.className:a.className.baseVal},setOpacity:function(a,b){if("opacity"in a.style)a.style.opacity=b;else if("filter"in a.style){var c=!1,d="DXImageTransform.Microsoft.Alpha";try{c=a.filters.item(d)}catch(e){if(1===b)return}b=Math.round(100*b),c?(c.Enabled=100!==b,c.Opacity=b):a.style.filter+=" progid:"+d+"(opacity="+b+")"}},testProp:function(a){for(var c=b.documentElement.style,d=0;d<a.length;d++)if(a[d]in c)return a[d];return!1},getTranslateString:function(a){var b=e.Browser.webkit3d,c="translate"+(b?"3d":"")+"(",d=(b?",0":"")+")";return c+a.x+"px,"+a.y+"px"+d},getScaleString:function(a,b){var c=e.DomUtil.getTranslateString(b.add(b.multiplyBy(-1*a))),d=" scale("+a+") ";return c+d},setPosition:function(a,b,c){a._leaflet_pos=b,!c&&e.Browser.any3d?a.style[e.DomUtil.TRANSFORM]=e.DomUtil.getTranslateString(b):(a.style.left=b.x+"px",a.style.top=b.y+"px")},getPosition:function(a){return a._leaflet_pos}},e.DomUtil.TRANSFORM=e.DomUtil.testProp(["transform","WebkitTransform","OTransform","MozTransform","msTransform"]),e.DomUtil.TRANSITION=e.DomUtil.testProp(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),e.DomUtil.TRANSITION_END="webkitTransition"===e.DomUtil.TRANSITION||"OTransition"===e.DomUtil.TRANSITION?e.DomUtil.TRANSITION+"End":"transitionend",function(){if("onselectstart"in b)e.extend(e.DomUtil,{disableTextSelection:function(){e.DomEvent.on(a,"selectstart",e.DomEvent.preventDefault)},enableTextSelection:function(){e.DomEvent.off(a,"selectstart",e.DomEvent.preventDefault)}});else{var c=e.DomUtil.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);e.extend(e.DomUtil,{disableTextSelection:function(){if(c){var a=b.documentElement.style;this._userSelect=a[c],a[c]="none"}},enableTextSelection:function(){c&&(b.documentElement.style[c]=this._userSelect,delete this._userSelect)}})}e.extend(e.DomUtil,{disableImageDrag:function(){e.DomEvent.on(a,"dragstart",e.DomEvent.preventDefault)},enableImageDrag:function(){e.DomEvent.off(a,"dragstart",e.DomEvent.preventDefault)}})}(),e.LatLng=function(a,b,d){if(a=parseFloat(a),b=parseFloat(b),isNaN(a)||isNaN(b))throw new Error("Invalid LatLng object: ("+a+", "+b+")");this.lat=a,this.lng=b,d!==c&&(this.alt=parseFloat(d))},e.extend(e.LatLng,{DEG_TO_RAD:Math.PI/180,RAD_TO_DEG:180/Math.PI,MAX_MARGIN:1e-9}),e.LatLng.prototype={equals:function(a){if(!a)return!1;a=e.latLng(a);var b=Math.max(Math.abs(this.lat-a.lat),Math.abs(this.lng-a.lng));return b<=e.LatLng.MAX_MARGIN},toString:function(a){return"LatLng("+e.Util.formatNum(this.lat,a)+", "+e.Util.formatNum(this.lng,a)+")"},distanceTo:function(a){a=e.latLng(a);var b=6378137,c=e.LatLng.DEG_TO_RAD,d=(a.lat-this.lat)*c,f=(a.lng-this.lng)*c,g=this.lat*c,h=a.lat*c,i=Math.sin(d/2),j=Math.sin(f/2),k=i*i+j*j*Math.cos(g)*Math.cos(h);return 2*b*Math.atan2(Math.sqrt(k),Math.sqrt(1-k))},wrap:function(a,b){var c=this.lng;return a=a||-180,b=b||180,c=(c+b)%(b-a)+(a>c||c===b?b:a),new e.LatLng(this.lat,c)}},e.latLng=function(a,b){return a instanceof e.LatLng?a:e.Util.isArray(a)?"number"==typeof a[0]||"string"==typeof a[0]?new e.LatLng(a[0],a[1],a[2]):null:a===c||null===a?a:"object"==typeof a&&"lat"in a?new e.LatLng(a.lat,"lng"in a?a.lng:a.lon):b===c?null:new e.LatLng(a,b)},e.LatLngBounds=function(a,b){if(a)for(var c=b?[a,b]:a,d=0,e=c.length;e>d;d++)this.extend(c[d])},e.LatLngBounds.prototype={extend:function(a){if(!a)return this;var b=e.latLng(a);return a=null!==b?b:e.latLngBounds(a),a instanceof e.LatLng?this._southWest||this._northEast?(this._southWest.lat=Math.min(a.lat,this._southWest.lat),this._southWest.lng=Math.min(a.lng,this._southWest.lng),this._northEast.lat=Math.max(a.lat,this._northEast.lat),this._northEast.lng=Math.max(a.lng,this._northEast.lng)):(this._southWest=new e.LatLng(a.lat,a.lng),this._northEast=new e.LatLng(a.lat,a.lng)):a instanceof e.LatLngBounds&&(this.extend(a._southWest),this.extend(a._northEast)),this},pad:function(a){var b=this._southWest,c=this._northEast,d=Math.abs(b.lat-c.lat)*a,f=Math.abs(b.lng-c.lng)*a;return new e.LatLngBounds(new e.LatLng(b.lat-d,b.lng-f),new e.LatLng(c.lat+d,c.lng+f))},getCenter:function(){return new e.LatLng((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new e.LatLng(this.getNorth(),this.getWest())},getSouthEast:function(){return new e.LatLng(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(a){a="number"==typeof a[0]||a instanceof e.LatLng?e.latLng(a):e.latLngBounds(a);var b,c,d=this._southWest,f=this._northEast;return a instanceof e.LatLngBounds?(b=a.getSouthWest(),c=a.getNorthEast()):b=c=a,b.lat>=d.lat&&c.lat<=f.lat&&b.lng>=d.lng&&c.lng<=f.lng},intersects:function(a){a=e.latLngBounds(a);var b=this._southWest,c=this._northEast,d=a.getSouthWest(),f=a.getNorthEast(),g=f.lat>=b.lat&&d.lat<=c.lat,h=f.lng>=b.lng&&d.lng<=c.lng;return g&&h},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(a){return a?(a=e.latLngBounds(a),this._southWest.equals(a.getSouthWest())&&this._northEast.equals(a.getNorthEast())):!1},isValid:function(){return!(!this._southWest||!this._northEast)}},e.latLngBounds=function(a,b){return!a||a instanceof e.LatLngBounds?a:new e.LatLngBounds(a,b)},e.Projection={},e.Projection.SphericalMercator={MAX_LATITUDE:85.0511287798,project:function(a){var b=e.LatLng.DEG_TO_RAD,c=this.MAX_LATITUDE,d=Math.max(Math.min(c,a.lat),-c),f=a.lng*b,g=d*b;return g=Math.log(Math.tan(Math.PI/4+g/2)),new e.Point(f,g)},unproject:function(a){var b=e.LatLng.RAD_TO_DEG,c=a.x*b,d=(2*Math.atan(Math.exp(a.y))-Math.PI/2)*b;return new e.LatLng(d,c)}},e.Projection.LonLat={project:function(a){return new e.Point(a.lng,a.lat)},unproject:function(a){return new e.LatLng(a.y,a.x)}},e.CRS={latLngToPoint:function(a,b){var c=this.projection.project(a),d=this.scale(b);return this.transformation._transform(c,d)},pointToLatLng:function(a,b){var c=this.scale(b),d=this.transformation.untransform(a,c);return this.projection.unproject(d)},project:function(a){return this.projection.project(a)},scale:function(a){return 256*Math.pow(2,a)},getSize:function(a){var b=this.scale(a);return e.point(b,b)}},e.CRS.Simple=e.extend({},e.CRS,{projection:e.Projection.LonLat,transformation:new e.Transformation(1,0,-1,0),scale:function(a){return Math.pow(2,a)}}),e.CRS.EPSG3857=e.extend({},e.CRS,{code:"EPSG:3857",projection:e.Projection.SphericalMercator,transformation:new e.Transformation(.5/Math.PI,.5,-.5/Math.PI,.5),project:function(a){var b=this.projection.project(a),c=6378137;return b.multiplyBy(c)}}),e.CRS.EPSG900913=e.extend({},e.CRS.EPSG3857,{code:"EPSG:900913"}),e.CRS.EPSG4326=e.extend({},e.CRS,{code:"EPSG:4326",projection:e.Projection.LonLat,transformation:new e.Transformation(1/360,.5,-1/360,.5)}),e.Map=e.Class.extend({includes:e.Mixin.Events,options:{crs:e.CRS.EPSG3857,fadeAnimation:e.DomUtil.TRANSITION&&!e.Browser.android23,trackResize:!0,markerZoomAnimation:e.DomUtil.TRANSITION&&e.Browser.any3d},initialize:function(a,b){b=e.setOptions(this,b),this._initContainer(a),this._initLayout(),this._onResize=e.bind(this._onResize,this),this._initEvents(),b.maxBounds&&this.setMaxBounds(b.maxBounds),b.center&&b.zoom!==c&&this.setView(e.latLng(b.center),b.zoom,{reset:!0}),this._handlers=[],this._layers={},this._zoomBoundLayers={},this._tileLayersNum=0,this.callInitHooks(),this._addLayers(b.layers)},setView:function(a,b){return b=b===c?this.getZoom():b,this._resetView(e.latLng(a),this._limitZoom(b)),this},setZoom:function(a,b){return this._loaded?this.setView(this.getCenter(),a,{zoom:b}):(this._zoom=this._limitZoom(a),this)},zoomIn:function(a,b){return this.setZoom(this._zoom+(a||1),b)},zoomOut:function(a,b){return this.setZoom(this._zoom-(a||1),b)},setZoomAround:function(a,b,c){var d=this.getZoomScale(b),f=this.getSize().divideBy(2),g=a instanceof e.Point?a:this.latLngToContainerPoint(a),h=g.subtract(f).multiplyBy(1-1/d),i=this.containerPointToLatLng(f.add(h));return this.setView(i,b,{zoom:c})},fitBounds:function(a,b){b=b||{},a=a.getBounds?a.getBounds():e.latLngBounds(a);var c=e.point(b.paddingTopLeft||b.padding||[0,0]),d=e.point(b.paddingBottomRight||b.padding||[0,0]),f=this.getBoundsZoom(a,!1,c.add(d)),g=d.subtract(c).divideBy(2),h=this.project(a.getSouthWest(),f),i=this.project(a.getNorthEast(),f),j=this.unproject(h.add(i).divideBy(2).add(g),f);return f=b&&b.maxZoom?Math.min(b.maxZoom,f):f,this.setView(j,f,b)},fitWorld:function(a){return this.fitBounds([[-90,-180],[90,180]],a)},panTo:function(a,b){return this.setView(a,this._zoom,{pan:b})},panBy:function(a){return this.fire("movestart"),this._rawPanBy(e.point(a)),this.fire("move"),this.fire("moveend")},setMaxBounds:function(a){return a=e.latLngBounds(a),this.options.maxBounds=a,a?(this._loaded&&this._panInsideMaxBounds(),this.on("moveend",this._panInsideMaxBounds,this)):this.off("moveend",this._panInsideMaxBounds,this)},panInsideBounds:function(a,b){var c=this.getCenter(),d=this._limitCenter(c,this._zoom,a);return c.equals(d)?this:this.panTo(d,b)},addLayer:function(a){var b=e.stamp(a);return this._layers[b]?this:(this._layers[b]=a,!a.options||isNaN(a.options.maxZoom)&&isNaN(a.options.minZoom)||(this._zoomBoundLayers[b]=a,this._updateZoomLevels()),this.options.zoomAnimation&&e.TileLayer&&a instanceof e.TileLayer&&(this._tileLayersNum++,this._tileLayersToLoad++,a.on("load",this._onTileLayerLoad,this)),this._loaded&&this._layerAdd(a),this)},removeLayer:function(a){var b=e.stamp(a);return this._layers[b]?(this._loaded&&a.onRemove(this),delete this._layers[b],this._loaded&&this.fire("layerremove",{layer:a}),this._zoomBoundLayers[b]&&(delete this._zoomBoundLayers[b],this._updateZoomLevels()),this.options.zoomAnimation&&e.TileLayer&&a instanceof e.TileLayer&&(this._tileLayersNum--,this._tileLayersToLoad--,a.off("load",this._onTileLayerLoad,this)),this):this},hasLayer:function(a){return a?e.stamp(a)in this._layers:!1},eachLayer:function(a,b){for(var c in this._layers)a.call(b,this._layers[c]);return this},invalidateSize:function(a){if(!this._loaded)return this;a=e.extend({animate:!1,pan:!0},a===!0?{animate:!0}:a);var b=this.getSize();this._sizeChanged=!0,this._initialCenter=null;var c=this.getSize(),d=b.divideBy(2).round(),f=c.divideBy(2).round(),g=d.subtract(f);return g.x||g.y?(a.animate&&a.pan?this.panBy(g):(a.pan&&this._rawPanBy(g),this.fire("move"),a.debounceMoveend?(clearTimeout(this._sizeTimer),this._sizeTimer=setTimeout(e.bind(this.fire,this,"moveend"),200)):this.fire("moveend")),this.fire("resize",{oldSize:b,newSize:c})):this},addHandler:function(a,b){if(!b)return this;var c=this[a]=new b(this);return this._handlers.push(c),this.options[a]&&c.enable(),this},remove:function(){this._loaded&&this.fire("unload"),this._initEvents("off");try{delete this._container._leaflet}catch(a){this._container._leaflet=c}return this._clearPanes(),this._clearControlPos&&this._clearControlPos(),this._clearHandlers(),this},getCenter:function(){return this._checkIfLoaded(),this._initialCenter&&!this._moved()?this._initialCenter:this.layerPointToLatLng(this._getCenterLayerPoint())},getZoom:function(){return this._zoom},getBounds:function(){var a=this.getPixelBounds(),b=this.unproject(a.getBottomLeft()),c=this.unproject(a.getTopRight());return new e.LatLngBounds(b,c)},getMinZoom:function(){return this.options.minZoom===c?this._layersMinZoom===c?0:this._layersMinZoom:this.options.minZoom},getMaxZoom:function(){return this.options.maxZoom===c?this._layersMaxZoom===c?1/0:this._layersMaxZoom:this.options.maxZoom},getBoundsZoom:function(a,b,c){a=e.latLngBounds(a);var d,f=this.getMinZoom()-(b?1:0),g=this.getMaxZoom(),h=this.getSize(),i=a.getNorthWest(),j=a.getSouthEast(),k=!0;c=e.point(c||[0,0]);do f++,d=this.project(j,f).subtract(this.project(i,f)).add(c),k=b?d.x<h.x||d.y<h.y:h.contains(d);while(k&&g>=f);return k&&b?null:b?f:f-1},getSize:function(){return(!this._size||this._sizeChanged)&&(this._size=new e.Point(this._container.clientWidth,this._container.clientHeight),this._sizeChanged=!1),this._size.clone()},getPixelBounds:function(){var a=this._getTopLeftPoint();return new e.Bounds(a,a.add(this.getSize()))},getPixelOrigin:function(){return this._checkIfLoaded(),this._initialTopLeftPoint},getPanes:function(){return this._panes},getContainer:function(){return this._container},getZoomScale:function(a){var b=this.options.crs;return b.scale(a)/b.scale(this._zoom)},getScaleZoom:function(a){return this._zoom+Math.log(a)/Math.LN2},project:function(a,b){return b=b===c?this._zoom:b,this.options.crs.latLngToPoint(e.latLng(a),b)},unproject:function(a,b){return b=b===c?this._zoom:b,this.options.crs.pointToLatLng(e.point(a),b)},layerPointToLatLng:function(a){var b=e.point(a).add(this.getPixelOrigin());return this.unproject(b)},latLngToLayerPoint:function(a){var b=this.project(e.latLng(a))._round();return b._subtract(this.getPixelOrigin())},containerPointToLayerPoint:function(a){return e.point(a).subtract(this._getMapPanePos())},layerPointToContainerPoint:function(a){return e.point(a).add(this._getMapPanePos())},containerPointToLatLng:function(a){var b=this.containerPointToLayerPoint(e.point(a));return this.layerPointToLatLng(b)},latLngToContainerPoint:function(a){return this.layerPointToContainerPoint(this.latLngToLayerPoint(e.latLng(a)))},mouseEventToContainerPoint:function(a){return e.DomEvent.getMousePosition(a,this._container)},mouseEventToLayerPoint:function(a){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(a))},mouseEventToLatLng:function(a){return this.layerPointToLatLng(this.mouseEventToLayerPoint(a))},_initContainer:function(a){var b=this._container=e.DomUtil.get(a);if(!b)throw new Error("Map container not found.");if(b._leaflet)throw new Error("Map container is already initialized.");b._leaflet=!0},_initLayout:function(){var a=this._container;e.DomUtil.addClass(a,"leaflet-container"+(e.Browser.touch?" leaflet-touch":"")+(e.Browser.retina?" leaflet-retina":"")+(e.Browser.ielt9?" leaflet-oldie":"")+(this.options.fadeAnimation?" leaflet-fade-anim":""));var b=e.DomUtil.getStyle(a,"position");
"absolute"!==b&&"relative"!==b&&"fixed"!==b&&(a.style.position="relative"),this._initPanes(),this._initControlPos&&this._initControlPos()},_initPanes:function(){var a=this._panes={};this._mapPane=a.mapPane=this._createPane("leaflet-map-pane",this._container),this._tilePane=a.tilePane=this._createPane("leaflet-tile-pane",this._mapPane),a.objectsPane=this._createPane("leaflet-objects-pane",this._mapPane),a.shadowPane=this._createPane("leaflet-shadow-pane"),a.overlayPane=this._createPane("leaflet-overlay-pane"),a.markerPane=this._createPane("leaflet-marker-pane"),a.popupPane=this._createPane("leaflet-popup-pane");var b=" leaflet-zoom-hide";this.options.markerZoomAnimation||(e.DomUtil.addClass(a.markerPane,b),e.DomUtil.addClass(a.shadowPane,b),e.DomUtil.addClass(a.popupPane,b))},_createPane:function(a,b){return e.DomUtil.create("div",a,b||this._panes.objectsPane)},_clearPanes:function(){this._container.removeChild(this._mapPane)},_addLayers:function(a){a=a?e.Util.isArray(a)?a:[a]:[];for(var b=0,c=a.length;c>b;b++)this.addLayer(a[b])},_resetView:function(a,b,c,d){var f=this._zoom!==b;d||(this.fire("movestart"),f&&this.fire("zoomstart")),this._zoom=b,this._initialCenter=a,this._initialTopLeftPoint=this._getNewTopLeftPoint(a),c?this._initialTopLeftPoint._add(this._getMapPanePos()):e.DomUtil.setPosition(this._mapPane,new e.Point(0,0)),this._tileLayersToLoad=this._tileLayersNum;var g=!this._loaded;this._loaded=!0,this.fire("viewreset",{hard:!c}),g&&(this.fire("load"),this.eachLayer(this._layerAdd,this)),this.fire("move"),(f||d)&&this.fire("zoomend"),this.fire("moveend",{hard:!c})},_rawPanBy:function(a){e.DomUtil.setPosition(this._mapPane,this._getMapPanePos().subtract(a))},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom()},_updateZoomLevels:function(){var a,b=1/0,d=-1/0,e=this._getZoomSpan();for(a in this._zoomBoundLayers){var f=this._zoomBoundLayers[a];isNaN(f.options.minZoom)||(b=Math.min(b,f.options.minZoom)),isNaN(f.options.maxZoom)||(d=Math.max(d,f.options.maxZoom))}a===c?this._layersMaxZoom=this._layersMinZoom=c:(this._layersMaxZoom=d,this._layersMinZoom=b),e!==this._getZoomSpan()&&this.fire("zoomlevelschange")},_panInsideMaxBounds:function(){this.panInsideBounds(this.options.maxBounds)},_checkIfLoaded:function(){if(!this._loaded)throw new Error("Set map center and zoom first.")},_initEvents:function(b){if(e.DomEvent){b=b||"on",e.DomEvent[b](this._container,"click",this._onMouseClick,this);var c,d,f=["dblclick","mousedown","mouseup","mouseenter","mouseleave","mousemove","contextmenu"];for(c=0,d=f.length;d>c;c++)e.DomEvent[b](this._container,f[c],this._fireMouseEvent,this);this.options.trackResize&&e.DomEvent[b](a,"resize",this._onResize,this)}},_onResize:function(){e.Util.cancelAnimFrame(this._resizeRequest),this._resizeRequest=e.Util.requestAnimFrame(function(){this.invalidateSize({debounceMoveend:!0})},this,!1,this._container)},_onMouseClick:function(a){!this._loaded||!a._simulated&&(this.dragging&&this.dragging.moved()||this.boxZoom&&this.boxZoom.moved())||e.DomEvent._skipped(a)||(this.fire("preclick"),this._fireMouseEvent(a))},_fireMouseEvent:function(a){if(this._loaded&&!e.DomEvent._skipped(a)){var b=a.type;if(b="mouseenter"===b?"mouseover":"mouseleave"===b?"mouseout":b,this.hasEventListeners(b)){"contextmenu"===b&&e.DomEvent.preventDefault(a);var c=this.mouseEventToContainerPoint(a),d=this.containerPointToLayerPoint(c),f=this.layerPointToLatLng(d);this.fire(b,{latlng:f,layerPoint:d,containerPoint:c,originalEvent:a})}}},_onTileLayerLoad:function(){this._tileLayersToLoad--,this._tileLayersNum&&!this._tileLayersToLoad&&this.fire("tilelayersload")},_clearHandlers:function(){for(var a=0,b=this._handlers.length;b>a;a++)this._handlers[a].disable()},whenReady:function(a,b){return this._loaded?a.call(b||this,this):this.on("load",a,b),this},_layerAdd:function(a){a.onAdd(this),this.fire("layeradd",{layer:a})},_getMapPanePos:function(){return e.DomUtil.getPosition(this._mapPane)},_moved:function(){var a=this._getMapPanePos();return a&&!a.equals([0,0])},_getTopLeftPoint:function(){return this.getPixelOrigin().subtract(this._getMapPanePos())},_getNewTopLeftPoint:function(a,b){var c=this.getSize()._divideBy(2);return this.project(a,b)._subtract(c)._round()},_latLngToNewLayerPoint:function(a,b,c){var d=this._getNewTopLeftPoint(c,b).add(this._getMapPanePos());return this.project(a,b)._subtract(d)},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2))},_getCenterOffset:function(a){return this.latLngToLayerPoint(a).subtract(this._getCenterLayerPoint())},_limitCenter:function(a,b,c){if(!c)return a;var d=this.project(a,b),f=this.getSize().divideBy(2),g=new e.Bounds(d.subtract(f),d.add(f)),h=this._getBoundsOffset(g,c,b);return this.unproject(d.add(h),b)},_limitOffset:function(a,b){if(!b)return a;var c=this.getPixelBounds(),d=new e.Bounds(c.min.add(a),c.max.add(a));return a.add(this._getBoundsOffset(d,b))},_getBoundsOffset:function(a,b,c){var d=this.project(b.getNorthWest(),c).subtract(a.min),f=this.project(b.getSouthEast(),c).subtract(a.max),g=this._rebound(d.x,-f.x),h=this._rebound(d.y,-f.y);return new e.Point(g,h)},_rebound:function(a,b){return a+b>0?Math.round(a-b)/2:Math.max(0,Math.ceil(a))-Math.max(0,Math.floor(b))},_limitZoom:function(a){var b=this.getMinZoom(),c=this.getMaxZoom();return Math.max(b,Math.min(c,a))}}),e.map=function(a,b){return new e.Map(a,b)},e.Projection.Mercator={MAX_LATITUDE:85.0840591556,R_MINOR:6356752.314245179,R_MAJOR:6378137,project:function(a){var b=e.LatLng.DEG_TO_RAD,c=this.MAX_LATITUDE,d=Math.max(Math.min(c,a.lat),-c),f=this.R_MAJOR,g=this.R_MINOR,h=a.lng*b*f,i=d*b,j=g/f,k=Math.sqrt(1-j*j),l=k*Math.sin(i);l=Math.pow((1-l)/(1+l),.5*k);var m=Math.tan(.5*(.5*Math.PI-i))/l;return i=-f*Math.log(m),new e.Point(h,i)},unproject:function(a){for(var b,c=e.LatLng.RAD_TO_DEG,d=this.R_MAJOR,f=this.R_MINOR,g=a.x*c/d,h=f/d,i=Math.sqrt(1-h*h),j=Math.exp(-a.y/d),k=Math.PI/2-2*Math.atan(j),l=15,m=1e-7,n=l,o=.1;Math.abs(o)>m&&--n>0;)b=i*Math.sin(k),o=Math.PI/2-2*Math.atan(j*Math.pow((1-b)/(1+b),.5*i))-k,k+=o;return new e.LatLng(k*c,g)}},e.CRS.EPSG3395=e.extend({},e.CRS,{code:"EPSG:3395",projection:e.Projection.Mercator,transformation:function(){var a=e.Projection.Mercator,b=a.R_MAJOR,c=.5/(Math.PI*b);return new e.Transformation(c,.5,-c,.5)}()}),e.TileLayer=e.Class.extend({includes:e.Mixin.Events,options:{minZoom:0,maxZoom:18,tileSize:256,subdomains:"abc",errorTileUrl:"",attribution:"",zoomOffset:0,opacity:1,unloadInvisibleTiles:e.Browser.mobile,updateWhenIdle:e.Browser.mobile},initialize:function(a,b){b=e.setOptions(this,b),b.detectRetina&&e.Browser.retina&&b.maxZoom>0&&(b.tileSize=Math.floor(b.tileSize/2),b.zoomOffset++,b.minZoom>0&&b.minZoom--,this.options.maxZoom--),b.bounds&&(b.bounds=e.latLngBounds(b.bounds)),this._url=a;var c=this.options.subdomains;"string"==typeof c&&(this.options.subdomains=c.split(""))},onAdd:function(a){this._map=a,this._animated=a._zoomAnimated,this._initContainer(),a.on({viewreset:this._reset,moveend:this._update},this),this._animated&&a.on({zoomanim:this._animateZoom,zoomend:this._endZoomAnim},this),this.options.updateWhenIdle||(this._limitedUpdate=e.Util.limitExecByInterval(this._update,150,this),a.on("move",this._limitedUpdate,this)),this._reset(),this._update()},addTo:function(a){return a.addLayer(this),this},onRemove:function(a){this._container.parentNode.removeChild(this._container),a.off({viewreset:this._reset,moveend:this._update},this),this._animated&&a.off({zoomanim:this._animateZoom,zoomend:this._endZoomAnim},this),this.options.updateWhenIdle||a.off("move",this._limitedUpdate,this),this._container=null,this._map=null},bringToFront:function(){var a=this._map._panes.tilePane;return this._container&&(a.appendChild(this._container),this._setAutoZIndex(a,Math.max)),this},bringToBack:function(){var a=this._map._panes.tilePane;return this._container&&(a.insertBefore(this._container,a.firstChild),this._setAutoZIndex(a,Math.min)),this},getAttribution:function(){return this.options.attribution},getContainer:function(){return this._container},setOpacity:function(a){return this.options.opacity=a,this._map&&this._updateOpacity(),this},setZIndex:function(a){return this.options.zIndex=a,this._updateZIndex(),this},setUrl:function(a,b){return this._url=a,b||this.redraw(),this},redraw:function(){return this._map&&(this._reset({hard:!0}),this._update()),this},_updateZIndex:function(){this._container&&this.options.zIndex!==c&&(this._container.style.zIndex=this.options.zIndex)},_setAutoZIndex:function(a,b){var c,d,e,f=a.children,g=-b(1/0,-1/0);for(d=0,e=f.length;e>d;d++)f[d]!==this._container&&(c=parseInt(f[d].style.zIndex,10),isNaN(c)||(g=b(g,c)));this.options.zIndex=this._container.style.zIndex=(isFinite(g)?g:0)+b(1,-1)},_updateOpacity:function(){var a,b=this._tiles;if(e.Browser.ielt9)for(a in b)e.DomUtil.setOpacity(b[a],this.options.opacity);else e.DomUtil.setOpacity(this._container,this.options.opacity)},_initContainer:function(){var a=this._map._panes.tilePane;if(!this._container){if(this._container=e.DomUtil.create("div","leaflet-layer"),this._updateZIndex(),this._animated){var b="leaflet-tile-container";this._bgBuffer=e.DomUtil.create("div",b,this._container),this._tileContainer=e.DomUtil.create("div",b,this._container)}else this._tileContainer=this._container;a.appendChild(this._container),this.options.opacity<1&&this._updateOpacity()}},_reset:function(a){for(var b in this._tiles)this.fire("tileunload",{tile:this._tiles[b]});this._tiles={},this._tilesToLoad=0,this.options.reuseTiles&&(this._unusedTiles=[]),this._tileContainer.innerHTML="",this._animated&&a&&a.hard&&this._clearBgBuffer(),this._initContainer()},_getTileSize:function(){var a=this._map,b=a.getZoom()+this.options.zoomOffset,c=this.options.maxNativeZoom,d=this.options.tileSize;return c&&b>c&&(d=Math.round(a.getZoomScale(b)/a.getZoomScale(c)*d)),d},_update:function(){if(this._map){var a=this._map,b=a.getPixelBounds(),c=a.getZoom(),d=this._getTileSize();if(!(c>this.options.maxZoom||c<this.options.minZoom)){var f=e.bounds(b.min.divideBy(d)._floor(),b.max.divideBy(d)._floor());this._addTilesFromCenterOut(f),(this.options.unloadInvisibleTiles||this.options.reuseTiles)&&this._removeOtherTiles(f)}}},_addTilesFromCenterOut:function(a){var c,d,f,g=[],h=a.getCenter();for(c=a.min.y;c<=a.max.y;c++)for(d=a.min.x;d<=a.max.x;d++)f=new e.Point(d,c),this._tileShouldBeLoaded(f)&&g.push(f);var i=g.length;if(0!==i){g.sort(function(a,b){return a.distanceTo(h)-b.distanceTo(h)});var j=b.createDocumentFragment();for(this._tilesToLoad||this.fire("loading"),this._tilesToLoad+=i,d=0;i>d;d++)this._addTile(g[d],j);this._tileContainer.appendChild(j)}},_tileShouldBeLoaded:function(a){if(a.x+":"+a.y in this._tiles)return!1;var b=this.options;if(!b.continuousWorld){var c=this._getWrapTileNum();if(b.noWrap&&(a.x<0||a.x>=c.x)||a.y<0||a.y>=c.y)return!1}if(b.bounds){var d=b.tileSize,e=a.multiplyBy(d),f=e.add([d,d]),g=this._map.unproject(e),h=this._map.unproject(f);if(b.continuousWorld||b.noWrap||(g=g.wrap(),h=h.wrap()),!b.bounds.intersects([g,h]))return!1}return!0},_removeOtherTiles:function(a){var b,c,d,e;for(e in this._tiles)b=e.split(":"),c=parseInt(b[0],10),d=parseInt(b[1],10),(c<a.min.x||c>a.max.x||d<a.min.y||d>a.max.y)&&this._removeTile(e)},_removeTile:function(a){var b=this._tiles[a];this.fire("tileunload",{tile:b,url:b.src}),this.options.reuseTiles?(e.DomUtil.removeClass(b,"leaflet-tile-loaded"),this._unusedTiles.push(b)):b.parentNode===this._tileContainer&&this._tileContainer.removeChild(b),e.Browser.android||(b.onload=null,b.src=e.Util.emptyImageUrl),delete this._tiles[a]},_addTile:function(a,b){var c=this._getTilePos(a),d=this._getTile();e.DomUtil.setPosition(d,c,e.Browser.chrome),this._tiles[a.x+":"+a.y]=d,this._loadTile(d,a),d.parentNode!==this._tileContainer&&b.appendChild(d)},_getZoomForUrl:function(){var a=this.options,b=this._map.getZoom();return a.zoomReverse&&(b=a.maxZoom-b),b+=a.zoomOffset,a.maxNativeZoom?Math.min(b,a.maxNativeZoom):b},_getTilePos:function(a){var b=this._map.getPixelOrigin(),c=this._getTileSize();return a.multiplyBy(c).subtract(b)},getTileUrl:function(a){return e.Util.template(this._url,e.extend({s:this._getSubdomain(a),z:a.z,x:a.x,y:a.y},this.options))},_getWrapTileNum:function(){var a=this._map.options.crs,b=a.getSize(this._map.getZoom());return b.divideBy(this._getTileSize())._floor()},_adjustTilePoint:function(a){var b=this._getWrapTileNum();this.options.continuousWorld||this.options.noWrap||(a.x=(a.x%b.x+b.x)%b.x),this.options.tms&&(a.y=b.y-a.y-1),a.z=this._getZoomForUrl()},_getSubdomain:function(a){var b=Math.abs(a.x+a.y)%this.options.subdomains.length;return this.options.subdomains[b]},_getTile:function(){if(this.options.reuseTiles&&this._unusedTiles.length>0){var a=this._unusedTiles.pop();return this._resetTile(a),a}return this._createTile()},_resetTile:function(){},_createTile:function(){var a=e.DomUtil.create("img","leaflet-tile");return a.style.width=a.style.height=this._getTileSize()+"px",a.galleryimg="no",a.onselectstart=a.onmousemove=e.Util.falseFn,e.Browser.ielt9&&this.options.opacity!==c&&e.DomUtil.setOpacity(a,this.options.opacity),e.Browser.mobileWebkit3d&&(a.style.WebkitBackfaceVisibility="hidden"),a},_loadTile:function(a,b){a._layer=this,a.onload=this._tileOnLoad,a.onerror=this._tileOnError,this._adjustTilePoint(b),a.src=this.getTileUrl(b),this.fire("tileloadstart",{tile:a,url:a.src})},_tileLoaded:function(){this._tilesToLoad--,this._animated&&e.DomUtil.addClass(this._tileContainer,"leaflet-zoom-animated"),this._tilesToLoad||(this.fire("load"),this._animated&&(clearTimeout(this._clearBgBufferTimer),this._clearBgBufferTimer=setTimeout(e.bind(this._clearBgBuffer,this),500)))},_tileOnLoad:function(){var a=this._layer;this.src!==e.Util.emptyImageUrl&&(e.DomUtil.addClass(this,"leaflet-tile-loaded"),a.fire("tileload",{tile:this,url:this.src})),a._tileLoaded()},_tileOnError:function(){var a=this._layer;a.fire("tileerror",{tile:this,url:this.src});var b=a.options.errorTileUrl;b&&(this.src=b),a._tileLoaded()}}),e.tileLayer=function(a,b){return new e.TileLayer(a,b)},e.TileLayer.WMS=e.TileLayer.extend({defaultWmsParams:{service:"WMS",request:"GetMap",version:"1.1.1",layers:"",styles:"",format:"image/jpeg",transparent:!1},initialize:function(a,b){this._url=a;var c=e.extend({},this.defaultWmsParams),d=b.tileSize||this.options.tileSize;c.width=c.height=b.detectRetina&&e.Browser.retina?2*d:d;for(var f in b)this.options.hasOwnProperty(f)||"crs"===f||(c[f]=b[f]);this.wmsParams=c,e.setOptions(this,b)},onAdd:function(a){this._crs=this.options.crs||a.options.crs,this._wmsVersion=parseFloat(this.wmsParams.version);var b=this._wmsVersion>=1.3?"crs":"srs";this.wmsParams[b]=this._crs.code,e.TileLayer.prototype.onAdd.call(this,a)},getTileUrl:function(a){var b=this._map,c=this.options.tileSize,d=a.multiplyBy(c),f=d.add([c,c]),g=this._crs.project(b.unproject(d,a.z)),h=this._crs.project(b.unproject(f,a.z)),i=this._wmsVersion>=1.3&&this._crs===e.CRS.EPSG4326?[h.y,g.x,g.y,h.x].join(","):[g.x,h.y,h.x,g.y].join(","),j=e.Util.template(this._url,{s:this._getSubdomain(a)});return j+e.Util.getParamString(this.wmsParams,j,!0)+"&BBOX="+i},setParams:function(a,b){return e.extend(this.wmsParams,a),b||this.redraw(),this}}),e.tileLayer.wms=function(a,b){return new e.TileLayer.WMS(a,b)},e.TileLayer.Canvas=e.TileLayer.extend({options:{async:!1},initialize:function(a){e.setOptions(this,a)},redraw:function(){this._map&&(this._reset({hard:!0}),this._update());for(var a in this._tiles)this._redrawTile(this._tiles[a]);return this},_redrawTile:function(a){this.drawTile(a,a._tilePoint,this._map._zoom)},_createTile:function(){var a=e.DomUtil.create("canvas","leaflet-tile");return a.width=a.height=this.options.tileSize,a.onselectstart=a.onmousemove=e.Util.falseFn,a},_loadTile:function(a,b){a._layer=this,a._tilePoint=b,this._redrawTile(a),this.options.async||this.tileDrawn(a)},drawTile:function(){},tileDrawn:function(a){this._tileOnLoad.call(a)}}),e.tileLayer.canvas=function(a){return new e.TileLayer.Canvas(a)},e.ImageOverlay=e.Class.extend({includes:e.Mixin.Events,options:{opacity:1},initialize:function(a,b,c){this._url=a,this._bounds=e.latLngBounds(b),e.setOptions(this,c)},onAdd:function(a){this._map=a,this._image||this._initImage(),a._panes.overlayPane.appendChild(this._image),a.on("viewreset",this._reset,this),a.options.zoomAnimation&&e.Browser.any3d&&a.on("zoomanim",this._animateZoom,this),this._reset()},onRemove:function(a){a.getPanes().overlayPane.removeChild(this._image),a.off("viewreset",this._reset,this),a.options.zoomAnimation&&a.off("zoomanim",this._animateZoom,this)},addTo:function(a){return a.addLayer(this),this},setOpacity:function(a){return this.options.opacity=a,this._updateOpacity(),this},bringToFront:function(){return this._image&&this._map._panes.overlayPane.appendChild(this._image),this},bringToBack:function(){var a=this._map._panes.overlayPane;return this._image&&a.insertBefore(this._image,a.firstChild),this},setUrl:function(a){this._url=a,this._image.src=this._url},getAttribution:function(){return this.options.attribution},_initImage:function(){this._image=e.DomUtil.create("img","leaflet-image-layer"),this._map.options.zoomAnimation&&e.Browser.any3d?e.DomUtil.addClass(this._image,"leaflet-zoom-animated"):e.DomUtil.addClass(this._image,"leaflet-zoom-hide"),this._updateOpacity(),e.extend(this._image,{galleryimg:"no",onselectstart:e.Util.falseFn,onmousemove:e.Util.falseFn,onload:e.bind(this._onImageLoad,this),src:this._url})},_animateZoom:function(a){var b=this._map,c=this._image,d=b.getZoomScale(a.zoom),f=this._bounds.getNorthWest(),g=this._bounds.getSouthEast(),h=b._latLngToNewLayerPoint(f,a.zoom,a.center),i=b._latLngToNewLayerPoint(g,a.zoom,a.center)._subtract(h),j=h._add(i._multiplyBy(.5*(1-1/d)));c.style[e.DomUtil.TRANSFORM]=e.DomUtil.getTranslateString(j)+" scale("+d+") "},_reset:function(){var a=this._image,b=this._map.latLngToLayerPoint(this._bounds.getNorthWest()),c=this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(b);e.DomUtil.setPosition(a,b),a.style.width=c.x+"px",a.style.height=c.y+"px"},_onImageLoad:function(){this.fire("load")},_updateOpacity:function(){e.DomUtil.setOpacity(this._image,this.options.opacity)}}),e.imageOverlay=function(a,b,c){return new e.ImageOverlay(a,b,c)},e.Icon=e.Class.extend({options:{className:""},initialize:function(a){e.setOptions(this,a)},createIcon:function(a){return this._createIcon("icon",a)},createShadow:function(a){return this._createIcon("shadow",a)},_createIcon:function(a,b){var c=this._getIconUrl(a);if(!c){if("icon"===a)throw new Error("iconUrl not set in Icon options (see the docs).");return null}var d;return d=b&&"IMG"===b.tagName?this._createImg(c,b):this._createImg(c),this._setIconStyles(d,a),d},_setIconStyles:function(a,b){var c,d=this.options,f=e.point(d[b+"Size"]);c=e.point("shadow"===b?d.shadowAnchor||d.iconAnchor:d.iconAnchor),!c&&f&&(c=f.divideBy(2,!0)),a.className="leaflet-marker-"+b+" "+d.className,c&&(a.style.marginLeft=-c.x+"px",a.style.marginTop=-c.y+"px"),f&&(a.style.width=f.x+"px",a.style.height=f.y+"px")},_createImg:function(a,c){return c=c||b.createElement("img"),c.src=a,c},_getIconUrl:function(a){return e.Browser.retina&&this.options[a+"RetinaUrl"]?this.options[a+"RetinaUrl"]:this.options[a+"Url"]}}),e.icon=function(a){return new e.Icon(a)},e.Icon.Default=e.Icon.extend({options:{iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]},_getIconUrl:function(a){var b=a+"Url";if(this.options[b])return this.options[b];e.Browser.retina&&"icon"===a&&(a+="-2x");var c=e.Icon.Default.imagePath;if(!c)throw new Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");return c+"/marker-"+a+".png"}}),e.Icon.Default.imagePath=function(){var a,c,d,e,f,g=b.getElementsByTagName("script"),h=/[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;for(a=0,c=g.length;c>a;a++)if(d=g[a].src,e=d.match(h))return f=d.split(h)[0],(f?f+"/":"")+"images"}(),e.Marker=e.Class.extend({includes:e.Mixin.Events,options:{icon:new e.Icon.Default,title:"",alt:"",clickable:!0,draggable:!1,keyboard:!0,zIndexOffset:0,opacity:1,riseOnHover:!1,riseOffset:250},initialize:function(a,b){e.setOptions(this,b),this._latlng=e.latLng(a)},onAdd:function(a){this._map=a,a.on("viewreset",this.update,this),this._initIcon(),this.update(),this.fire("add"),a.options.zoomAnimation&&a.options.markerZoomAnimation&&a.on("zoomanim",this._animateZoom,this)},addTo:function(a){return a.addLayer(this),this},onRemove:function(a){this.dragging&&this.dragging.disable(),this._removeIcon(),this._removeShadow(),this.fire("remove"),a.off({viewreset:this.update,zoomanim:this._animateZoom},this),this._map=null},getLatLng:function(){return this._latlng},setLatLng:function(a){return this._latlng=e.latLng(a),this.update(),this.fire("move",{latlng:this._latlng})},setZIndexOffset:function(a){return this.options.zIndexOffset=a,this.update(),this},setIcon:function(a){return this.options.icon=a,this._map&&(this._initIcon(),this.update()),this._popup&&this.bindPopup(this._popup),this},update:function(){if(this._icon){var a=this._map.latLngToLayerPoint(this._latlng).round();this._setPos(a)}return this},_initIcon:function(){var a=this.options,b=this._map,c=b.options.zoomAnimation&&b.options.markerZoomAnimation,d=c?"leaflet-zoom-animated":"leaflet-zoom-hide",f=a.icon.createIcon(this._icon),g=!1;f!==this._icon&&(this._icon&&this._removeIcon(),g=!0,a.title&&(f.title=a.title),a.alt&&(f.alt=a.alt)),e.DomUtil.addClass(f,d),a.keyboard&&(f.tabIndex="0"),this._icon=f,this._initInteraction(),a.riseOnHover&&e.DomEvent.on(f,"mouseover",this._bringToFront,this).on(f,"mouseout",this._resetZIndex,this);var h=a.icon.createShadow(this._shadow),i=!1;h!==this._shadow&&(this._removeShadow(),i=!0),h&&e.DomUtil.addClass(h,d),this._shadow=h,a.opacity<1&&this._updateOpacity();var j=this._map._panes;g&&j.markerPane.appendChild(this._icon),h&&i&&j.shadowPane.appendChild(this._shadow)},_removeIcon:function(){this.options.riseOnHover&&e.DomEvent.off(this._icon,"mouseover",this._bringToFront).off(this._icon,"mouseout",this._resetZIndex),this._map._panes.markerPane.removeChild(this._icon),this._icon=null},_removeShadow:function(){this._shadow&&this._map._panes.shadowPane.removeChild(this._shadow),this._shadow=null},_setPos:function(a){e.DomUtil.setPosition(this._icon,a),this._shadow&&e.DomUtil.setPosition(this._shadow,a),this._zIndex=a.y+this.options.zIndexOffset,this._resetZIndex()},_updateZIndex:function(a){this._icon.style.zIndex=this._zIndex+a},_animateZoom:function(a){var b=this._map._latLngToNewLayerPoint(this._latlng,a.zoom,a.center).round();this._setPos(b)},_initInteraction:function(){if(this.options.clickable){var a=this._icon,b=["dblclick","mousedown","mouseover","mouseout","contextmenu"];e.DomUtil.addClass(a,"leaflet-clickable"),e.DomEvent.on(a,"click",this._onMouseClick,this),e.DomEvent.on(a,"keypress",this._onKeyPress,this);for(var c=0;c<b.length;c++)e.DomEvent.on(a,b[c],this._fireMouseEvent,this);e.Handler.MarkerDrag&&(this.dragging=new e.Handler.MarkerDrag(this),this.options.draggable&&this.dragging.enable())}},_onMouseClick:function(a){var b=this.dragging&&this.dragging.moved();(this.hasEventListeners(a.type)||b)&&e.DomEvent.stopPropagation(a),b||(this.dragging&&this.dragging._enabled||!this._map.dragging||!this._map.dragging.moved())&&this.fire(a.type,{originalEvent:a,latlng:this._latlng})},_onKeyPress:function(a){13===a.keyCode&&this.fire("click",{originalEvent:a,latlng:this._latlng})},_fireMouseEvent:function(a){this.fire(a.type,{originalEvent:a,latlng:this._latlng}),"contextmenu"===a.type&&this.hasEventListeners(a.type)&&e.DomEvent.preventDefault(a),"mousedown"!==a.type?e.DomEvent.stopPropagation(a):e.DomEvent.preventDefault(a)},setOpacity:function(a){return this.options.opacity=a,this._map&&this._updateOpacity(),this},_updateOpacity:function(){e.DomUtil.setOpacity(this._icon,this.options.opacity),this._shadow&&e.DomUtil.setOpacity(this._shadow,this.options.opacity)},_bringToFront:function(){this._updateZIndex(this.options.riseOffset)},_resetZIndex:function(){this._updateZIndex(0)}}),e.marker=function(a,b){return new e.Marker(a,b)},e.DivIcon=e.Icon.extend({options:{iconSize:[12,12],className:"leaflet-div-icon",html:!1},createIcon:function(a){var c=a&&"DIV"===a.tagName?a:b.createElement("div"),d=this.options;return c.innerHTML=d.html!==!1?d.html:"",d.bgPos&&(c.style.backgroundPosition=-d.bgPos.x+"px "+-d.bgPos.y+"px"),this._setIconStyles(c,"icon"),c},createShadow:function(){return null}}),e.divIcon=function(a){return new e.DivIcon(a)},e.Map.mergeOptions({closePopupOnClick:!0}),e.Popup=e.Class.extend({includes:e.Mixin.Events,options:{minWidth:50,maxWidth:300,autoPan:!0,closeButton:!0,offset:[0,7],autoPanPadding:[5,5],keepInView:!1,className:"",zoomAnimation:!0},initialize:function(a,b){e.setOptions(this,a),this._source=b,this._animated=e.Browser.any3d&&this.options.zoomAnimation,this._isOpen=!1},onAdd:function(a){this._map=a,this._container||this._initLayout();var b=a.options.fadeAnimation;b&&e.DomUtil.setOpacity(this._container,0),a._panes.popupPane.appendChild(this._container),a.on(this._getEvents(),this),this.update(),b&&e.DomUtil.setOpacity(this._container,1),this.fire("open"),a.fire("popupopen",{popup:this}),this._source&&this._source.fire("popupopen",{popup:this})},addTo:function(a){return a.addLayer(this),this},openOn:function(a){return a.openPopup(this),this},onRemove:function(a){a._panes.popupPane.removeChild(this._container),e.Util.falseFn(this._container.offsetWidth),a.off(this._getEvents(),this),a.options.fadeAnimation&&e.DomUtil.setOpacity(this._container,0),this._map=null,this.fire("close"),a.fire("popupclose",{popup:this}),this._source&&this._source.fire("popupclose",{popup:this})},getLatLng:function(){return this._latlng},setLatLng:function(a){return this._latlng=e.latLng(a),this._map&&(this._updatePosition(),this._adjustPan()),this},getContent:function(){return this._content},setContent:function(a){return this._content=a,this.update(),this},update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updateLayout(),this._updatePosition(),this._container.style.visibility="",this._adjustPan())},_getEvents:function(){var a={viewreset:this._updatePosition};return this._animated&&(a.zoomanim=this._zoomAnimation),("closeOnClick"in this.options?this.options.closeOnClick:this._map.options.closePopupOnClick)&&(a.preclick=this._close),this.options.keepInView&&(a.moveend=this._adjustPan),a},_close:function(){this._map&&this._map.closePopup(this)},_initLayout:function(){var a,b="leaflet-popup",c=b+" "+this.options.className+" leaflet-zoom-"+(this._animated?"animated":"hide"),d=this._container=e.DomUtil.create("div",c);this.options.closeButton&&(a=this._closeButton=e.DomUtil.create("a",b+"-close-button",d),a.href="#close",a.innerHTML="&#215;",e.DomEvent.disableClickPropagation(a),e.DomEvent.on(a,"click",this._onCloseButtonClick,this));var f=this._wrapper=e.DomUtil.create("div",b+"-content-wrapper",d);e.DomEvent.disableClickPropagation(f),this._contentNode=e.DomUtil.create("div",b+"-content",f),e.DomEvent.disableScrollPropagation(this._contentNode),e.DomEvent.on(f,"contextmenu",e.DomEvent.stopPropagation),this._tipContainer=e.DomUtil.create("div",b+"-tip-container",d),this._tip=e.DomUtil.create("div",b+"-tip",this._tipContainer)},_updateContent:function(){if(this._content){if("string"==typeof this._content)this._contentNode.innerHTML=this._content;else{for(;this._contentNode.hasChildNodes();)this._contentNode.removeChild(this._contentNode.firstChild);this._contentNode.appendChild(this._content)}this.fire("contentupdate")}},_updateLayout:function(){var a=this._contentNode,b=a.style;b.width="",b.whiteSpace="nowrap";var c=a.offsetWidth;c=Math.min(c,this.options.maxWidth),c=Math.max(c,this.options.minWidth),b.width=c+1+"px",b.whiteSpace="",b.height="";var d=a.offsetHeight,f=this.options.maxHeight,g="leaflet-popup-scrolled";f&&d>f?(b.height=f+"px",e.DomUtil.addClass(a,g)):e.DomUtil.removeClass(a,g),this._containerWidth=this._container.offsetWidth},_updatePosition:function(){if(this._map){var a=this._map.latLngToLayerPoint(this._latlng),b=this._animated,c=e.point(this.options.offset);b&&e.DomUtil.setPosition(this._container,a),this._containerBottom=-c.y-(b?0:a.y),this._containerLeft=-Math.round(this._containerWidth/2)+c.x+(b?0:a.x),this._container.style.bottom=this._containerBottom+"px",this._container.style.left=this._containerLeft+"px"}},_zoomAnimation:function(a){var b=this._map._latLngToNewLayerPoint(this._latlng,a.zoom,a.center);e.DomUtil.setPosition(this._container,b)},_adjustPan:function(){if(this.options.autoPan){var a=this._map,b=this._container.offsetHeight,c=this._containerWidth,d=new e.Point(this._containerLeft,-b-this._containerBottom);this._animated&&d._add(e.DomUtil.getPosition(this._container));var f=a.layerPointToContainerPoint(d),g=e.point(this.options.autoPanPadding),h=e.point(this.options.autoPanPaddingTopLeft||g),i=e.point(this.options.autoPanPaddingBottomRight||g),j=a.getSize(),k=0,l=0;f.x+c+i.x>j.x&&(k=f.x+c-j.x+i.x),f.x-k-h.x<0&&(k=f.x-h.x),f.y+b+i.y>j.y&&(l=f.y+b-j.y+i.y),f.y-l-h.y<0&&(l=f.y-h.y),(k||l)&&a.fire("autopanstart").panBy([k,l])}},_onCloseButtonClick:function(a){this._close(),e.DomEvent.stop(a)}}),e.popup=function(a,b){return new e.Popup(a,b)},e.Map.include({openPopup:function(a,b,c){if(this.closePopup(),!(a instanceof e.Popup)){var d=a;a=new e.Popup(c).setLatLng(b).setContent(d)}return a._isOpen=!0,this._popup=a,this.addLayer(a)},closePopup:function(a){return a&&a!==this._popup||(a=this._popup,this._popup=null),a&&(this.removeLayer(a),a._isOpen=!1),this}}),e.Marker.include({openPopup:function(){return this._popup&&this._map&&!this._map.hasLayer(this._popup)&&(this._popup.setLatLng(this._latlng),this._map.openPopup(this._popup)),this},closePopup:function(){return this._popup&&this._popup._close(),this},togglePopup:function(){return this._popup&&(this._popup._isOpen?this.closePopup():this.openPopup()),this},bindPopup:function(a,b){var c=e.point(this.options.icon.options.popupAnchor||[0,0]);return c=c.add(e.Popup.prototype.options.offset),b&&b.offset&&(c=c.add(b.offset)),b=e.extend({offset:c},b),this._popupHandlersAdded||(this.on("click",this.togglePopup,this).on("remove",this.closePopup,this).on("move",this._movePopup,this),this._popupHandlersAdded=!0),a instanceof e.Popup?(e.setOptions(a,b),this._popup=a):this._popup=new e.Popup(b,this).setContent(a),this},setPopupContent:function(a){return this._popup&&this._popup.setContent(a),this},unbindPopup:function(){return this._popup&&(this._popup=null,this.off("click",this.togglePopup,this).off("remove",this.closePopup,this).off("move",this._movePopup,this),this._popupHandlersAdded=!1),this},getPopup:function(){return this._popup},_movePopup:function(a){this._popup.setLatLng(a.latlng)}}),e.LayerGroup=e.Class.extend({initialize:function(a){this._layers={};var b,c;if(a)for(b=0,c=a.length;c>b;b++)this.addLayer(a[b])},addLayer:function(a){var b=this.getLayerId(a);return this._layers[b]=a,this._map&&this._map.addLayer(a),this},removeLayer:function(a){var b=a in this._layers?a:this.getLayerId(a);return this._map&&this._layers[b]&&this._map.removeLayer(this._layers[b]),delete this._layers[b],this},hasLayer:function(a){return a?a in this._layers||this.getLayerId(a)in this._layers:!1},clearLayers:function(){return this.eachLayer(this.removeLayer,this),this},invoke:function(a){var b,c,d=Array.prototype.slice.call(arguments,1);for(b in this._layers)c=this._layers[b],c[a]&&c[a].apply(c,d);return this},onAdd:function(a){this._map=a,this.eachLayer(a.addLayer,a)},onRemove:function(a){this.eachLayer(a.removeLayer,a),this._map=null},addTo:function(a){return a.addLayer(this),this},eachLayer:function(a,b){for(var c in this._layers)a.call(b,this._layers[c]);return this},getLayer:function(a){return this._layers[a]},getLayers:function(){var a=[];for(var b in this._layers)a.push(this._layers[b]);return a},setZIndex:function(a){return this.invoke("setZIndex",a);
},getLayerId:function(a){return e.stamp(a)}}),e.layerGroup=function(a){return new e.LayerGroup(a)},e.FeatureGroup=e.LayerGroup.extend({includes:e.Mixin.Events,statics:{EVENTS:"click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose"},addLayer:function(a){return this.hasLayer(a)?this:("on"in a&&a.on(e.FeatureGroup.EVENTS,this._propagateEvent,this),e.LayerGroup.prototype.addLayer.call(this,a),this._popupContent&&a.bindPopup&&a.bindPopup(this._popupContent,this._popupOptions),this.fire("layeradd",{layer:a}))},removeLayer:function(a){return this.hasLayer(a)?(a in this._layers&&(a=this._layers[a]),a.off(e.FeatureGroup.EVENTS,this._propagateEvent,this),e.LayerGroup.prototype.removeLayer.call(this,a),this._popupContent&&this.invoke("unbindPopup"),this.fire("layerremove",{layer:a})):this},bindPopup:function(a,b){return this._popupContent=a,this._popupOptions=b,this.invoke("bindPopup",a,b)},openPopup:function(a){for(var b in this._layers){this._layers[b].openPopup(a);break}return this},setStyle:function(a){return this.invoke("setStyle",a)},bringToFront:function(){return this.invoke("bringToFront")},bringToBack:function(){return this.invoke("bringToBack")},getBounds:function(){var a=new e.LatLngBounds;return this.eachLayer(function(b){a.extend(b instanceof e.Marker?b.getLatLng():b.getBounds())}),a},_propagateEvent:function(a){a=e.extend({layer:a.target,target:this},a),this.fire(a.type,a)}}),e.featureGroup=function(a){return new e.FeatureGroup(a)},e.Path=e.Class.extend({includes:[e.Mixin.Events],statics:{CLIP_PADDING:function(){var b=e.Browser.mobile?1280:2e3,c=(b/Math.max(a.outerWidth,a.outerHeight)-1)/2;return Math.max(0,Math.min(.5,c))}()},options:{stroke:!0,color:"#0033ff",dashArray:null,lineCap:null,lineJoin:null,weight:5,opacity:.5,fill:!1,fillColor:null,fillOpacity:.2,clickable:!0},initialize:function(a){e.setOptions(this,a)},onAdd:function(a){this._map=a,this._container||(this._initElements(),this._initEvents()),this.projectLatlngs(),this._updatePath(),this._container&&this._map._pathRoot.appendChild(this._container),this.fire("add"),a.on({viewreset:this.projectLatlngs,moveend:this._updatePath},this)},addTo:function(a){return a.addLayer(this),this},onRemove:function(a){a._pathRoot.removeChild(this._container),this.fire("remove"),this._map=null,e.Browser.vml&&(this._container=null,this._stroke=null,this._fill=null),a.off({viewreset:this.projectLatlngs,moveend:this._updatePath},this)},projectLatlngs:function(){},setStyle:function(a){return e.setOptions(this,a),this._container&&this._updateStyle(),this},redraw:function(){return this._map&&(this.projectLatlngs(),this._updatePath()),this}}),e.Map.include({_updatePathViewport:function(){var a=e.Path.CLIP_PADDING,b=this.getSize(),c=e.DomUtil.getPosition(this._mapPane),d=c.multiplyBy(-1)._subtract(b.multiplyBy(a)._round()),f=d.add(b.multiplyBy(1+2*a)._round());this._pathViewport=new e.Bounds(d,f)}}),e.Path.SVG_NS="http://www.w3.org/2000/svg",e.Browser.svg=!(!b.createElementNS||!b.createElementNS(e.Path.SVG_NS,"svg").createSVGRect),e.Path=e.Path.extend({statics:{SVG:e.Browser.svg},bringToFront:function(){var a=this._map._pathRoot,b=this._container;return b&&a.lastChild!==b&&a.appendChild(b),this},bringToBack:function(){var a=this._map._pathRoot,b=this._container,c=a.firstChild;return b&&c!==b&&a.insertBefore(b,c),this},getPathString:function(){},_createElement:function(a){return b.createElementNS(e.Path.SVG_NS,a)},_initElements:function(){this._map._initPathRoot(),this._initPath(),this._initStyle()},_initPath:function(){this._container=this._createElement("g"),this._path=this._createElement("path"),this.options.className&&e.DomUtil.addClass(this._path,this.options.className),this._container.appendChild(this._path)},_initStyle:function(){this.options.stroke&&(this._path.setAttribute("stroke-linejoin","round"),this._path.setAttribute("stroke-linecap","round")),this.options.fill&&this._path.setAttribute("fill-rule","evenodd"),this.options.pointerEvents&&this._path.setAttribute("pointer-events",this.options.pointerEvents),this.options.clickable||this.options.pointerEvents||this._path.setAttribute("pointer-events","none"),this._updateStyle()},_updateStyle:function(){this.options.stroke?(this._path.setAttribute("stroke",this.options.color),this._path.setAttribute("stroke-opacity",this.options.opacity),this._path.setAttribute("stroke-width",this.options.weight),this.options.dashArray?this._path.setAttribute("stroke-dasharray",this.options.dashArray):this._path.removeAttribute("stroke-dasharray"),this.options.lineCap&&this._path.setAttribute("stroke-linecap",this.options.lineCap),this.options.lineJoin&&this._path.setAttribute("stroke-linejoin",this.options.lineJoin)):this._path.setAttribute("stroke","none"),this.options.fill?(this._path.setAttribute("fill",this.options.fillColor||this.options.color),this._path.setAttribute("fill-opacity",this.options.fillOpacity)):this._path.setAttribute("fill","none")},_updatePath:function(){var a=this.getPathString();a||(a="M0 0"),this._path.setAttribute("d",a)},_initEvents:function(){if(this.options.clickable){(e.Browser.svg||!e.Browser.vml)&&e.DomUtil.addClass(this._path,"leaflet-clickable"),e.DomEvent.on(this._container,"click",this._onMouseClick,this);for(var a=["dblclick","mousedown","mouseover","mouseout","mousemove","contextmenu"],b=0;b<a.length;b++)e.DomEvent.on(this._container,a[b],this._fireMouseEvent,this)}},_onMouseClick:function(a){this._map.dragging&&this._map.dragging.moved()||this._fireMouseEvent(a)},_fireMouseEvent:function(a){if(this.hasEventListeners(a.type)){var b=this._map,c=b.mouseEventToContainerPoint(a),d=b.containerPointToLayerPoint(c),f=b.layerPointToLatLng(d);this.fire(a.type,{latlng:f,layerPoint:d,containerPoint:c,originalEvent:a}),"contextmenu"===a.type&&e.DomEvent.preventDefault(a),"mousemove"!==a.type&&e.DomEvent.stopPropagation(a)}}}),e.Map.include({_initPathRoot:function(){this._pathRoot||(this._pathRoot=e.Path.prototype._createElement("svg"),this._panes.overlayPane.appendChild(this._pathRoot),this.options.zoomAnimation&&e.Browser.any3d?(e.DomUtil.addClass(this._pathRoot,"leaflet-zoom-animated"),this.on({zoomanim:this._animatePathZoom,zoomend:this._endPathZoom})):e.DomUtil.addClass(this._pathRoot,"leaflet-zoom-hide"),this.on("moveend",this._updateSvgViewport),this._updateSvgViewport())},_animatePathZoom:function(a){var b=this.getZoomScale(a.zoom),c=this._getCenterOffset(a.center)._multiplyBy(-b)._add(this._pathViewport.min);this._pathRoot.style[e.DomUtil.TRANSFORM]=e.DomUtil.getTranslateString(c)+" scale("+b+") ",this._pathZooming=!0},_endPathZoom:function(){this._pathZooming=!1},_updateSvgViewport:function(){if(!this._pathZooming){this._updatePathViewport();var a=this._pathViewport,b=a.min,c=a.max,d=c.x-b.x,f=c.y-b.y,g=this._pathRoot,h=this._panes.overlayPane;e.Browser.mobileWebkit&&h.removeChild(g),e.DomUtil.setPosition(g,b),g.setAttribute("width",d),g.setAttribute("height",f),g.setAttribute("viewBox",[b.x,b.y,d,f].join(" ")),e.Browser.mobileWebkit&&h.appendChild(g)}}}),e.Path.include({bindPopup:function(a,b){return a instanceof e.Popup?this._popup=a:((!this._popup||b)&&(this._popup=new e.Popup(b,this)),this._popup.setContent(a)),this._popupHandlersAdded||(this.on("click",this._openPopup,this).on("remove",this.closePopup,this),this._popupHandlersAdded=!0),this},unbindPopup:function(){return this._popup&&(this._popup=null,this.off("click",this._openPopup).off("remove",this.closePopup),this._popupHandlersAdded=!1),this},openPopup:function(a){return this._popup&&(a=a||this._latlng||this._latlngs[Math.floor(this._latlngs.length/2)],this._openPopup({latlng:a})),this},closePopup:function(){return this._popup&&this._popup._close(),this},_openPopup:function(a){this._popup.setLatLng(a.latlng),this._map.openPopup(this._popup)}}),e.Browser.vml=!e.Browser.svg&&function(){try{var a=b.createElement("div");a.innerHTML='<v:shape adj="1"/>';var c=a.firstChild;return c.style.behavior="url(#default#VML)",c&&"object"==typeof c.adj}catch(d){return!1}}(),e.Path=e.Browser.svg||!e.Browser.vml?e.Path:e.Path.extend({statics:{VML:!0,CLIP_PADDING:.02},_createElement:function(){try{return b.namespaces.add("lvml","urn:schemas-microsoft-com:vml"),function(a){return b.createElement("<lvml:"+a+' class="lvml">')}}catch(a){return function(a){return b.createElement("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')}}}(),_initPath:function(){var a=this._container=this._createElement("shape");e.DomUtil.addClass(a,"leaflet-vml-shape"+(this.options.className?" "+this.options.className:"")),this.options.clickable&&e.DomUtil.addClass(a,"leaflet-clickable"),a.coordsize="1 1",this._path=this._createElement("path"),a.appendChild(this._path),this._map._pathRoot.appendChild(a)},_initStyle:function(){this._updateStyle()},_updateStyle:function(){var a=this._stroke,b=this._fill,c=this.options,d=this._container;d.stroked=c.stroke,d.filled=c.fill,c.stroke?(a||(a=this._stroke=this._createElement("stroke"),a.endcap="round",d.appendChild(a)),a.weight=c.weight+"px",a.color=c.color,a.opacity=c.opacity,a.dashStyle=c.dashArray?e.Util.isArray(c.dashArray)?c.dashArray.join(" "):c.dashArray.replace(/( *, *)/g," "):"",c.lineCap&&(a.endcap=c.lineCap.replace("butt","flat")),c.lineJoin&&(a.joinstyle=c.lineJoin)):a&&(d.removeChild(a),this._stroke=null),c.fill?(b||(b=this._fill=this._createElement("fill"),d.appendChild(b)),b.color=c.fillColor||c.color,b.opacity=c.fillOpacity):b&&(d.removeChild(b),this._fill=null)},_updatePath:function(){var a=this._container.style;a.display="none",this._path.v=this.getPathString()+" ",a.display=""}}),e.Map.include(e.Browser.svg||!e.Browser.vml?{}:{_initPathRoot:function(){if(!this._pathRoot){var a=this._pathRoot=b.createElement("div");a.className="leaflet-vml-container",this._panes.overlayPane.appendChild(a),this.on("moveend",this._updatePathViewport),this._updatePathViewport()}}}),e.Browser.canvas=function(){return!!b.createElement("canvas").getContext}(),e.Path=e.Path.SVG&&!a.L_PREFER_CANVAS||!e.Browser.canvas?e.Path:e.Path.extend({statics:{CANVAS:!0,SVG:!1},redraw:function(){return this._map&&(this.projectLatlngs(),this._requestUpdate()),this},setStyle:function(a){return e.setOptions(this,a),this._map&&(this._updateStyle(),this._requestUpdate()),this},onRemove:function(a){a.off("viewreset",this.projectLatlngs,this).off("moveend",this._updatePath,this),this.options.clickable&&(this._map.off("click",this._onClick,this),this._map.off("mousemove",this._onMouseMove,this)),this._requestUpdate(),this.fire("remove"),this._map=null},_requestUpdate:function(){this._map&&!e.Path._updateRequest&&(e.Path._updateRequest=e.Util.requestAnimFrame(this._fireMapMoveEnd,this._map))},_fireMapMoveEnd:function(){e.Path._updateRequest=null,this.fire("moveend")},_initElements:function(){this._map._initPathRoot(),this._ctx=this._map._canvasCtx},_updateStyle:function(){var a=this.options;a.stroke&&(this._ctx.lineWidth=a.weight,this._ctx.strokeStyle=a.color),a.fill&&(this._ctx.fillStyle=a.fillColor||a.color)},_drawPath:function(){var a,b,c,d,f,g;for(this._ctx.beginPath(),a=0,c=this._parts.length;c>a;a++){for(b=0,d=this._parts[a].length;d>b;b++)f=this._parts[a][b],g=(0===b?"move":"line")+"To",this._ctx[g](f.x,f.y);this instanceof e.Polygon&&this._ctx.closePath()}},_checkIfEmpty:function(){return!this._parts.length},_updatePath:function(){if(!this._checkIfEmpty()){var a=this._ctx,b=this.options;this._drawPath(),a.save(),this._updateStyle(),b.fill&&(a.globalAlpha=b.fillOpacity,a.fill()),b.stroke&&(a.globalAlpha=b.opacity,a.stroke()),a.restore()}},_initEvents:function(){this.options.clickable&&(this._map.on("mousemove",this._onMouseMove,this),this._map.on("click",this._onClick,this))},_onClick:function(a){this._containsPoint(a.layerPoint)&&this.fire("click",a)},_onMouseMove:function(a){this._map&&!this._map._animatingZoom&&(this._containsPoint(a.layerPoint)?(this._ctx.canvas.style.cursor="pointer",this._mouseInside=!0,this.fire("mouseover",a)):this._mouseInside&&(this._ctx.canvas.style.cursor="",this._mouseInside=!1,this.fire("mouseout",a)))}}),e.Map.include(e.Path.SVG&&!a.L_PREFER_CANVAS||!e.Browser.canvas?{}:{_initPathRoot:function(){var a,c=this._pathRoot;c||(c=this._pathRoot=b.createElement("canvas"),c.style.position="absolute",a=this._canvasCtx=c.getContext("2d"),a.lineCap="round",a.lineJoin="round",this._panes.overlayPane.appendChild(c),this.options.zoomAnimation&&(this._pathRoot.className="leaflet-zoom-animated",this.on("zoomanim",this._animatePathZoom),this.on("zoomend",this._endPathZoom)),this.on("moveend",this._updateCanvasViewport),this._updateCanvasViewport())},_updateCanvasViewport:function(){if(!this._pathZooming){this._updatePathViewport();var a=this._pathViewport,b=a.min,c=a.max.subtract(b),d=this._pathRoot;e.DomUtil.setPosition(d,b),d.width=c.x,d.height=c.y,d.getContext("2d").translate(-b.x,-b.y)}}}),e.LineUtil={simplify:function(a,b){if(!b||!a.length)return a.slice();var c=b*b;return a=this._reducePoints(a,c),a=this._simplifyDP(a,c)},pointToSegmentDistance:function(a,b,c){return Math.sqrt(this._sqClosestPointOnSegment(a,b,c,!0))},closestPointOnSegment:function(a,b,c){return this._sqClosestPointOnSegment(a,b,c)},_simplifyDP:function(a,b){var d=a.length,e=typeof Uint8Array!=c+""?Uint8Array:Array,f=new e(d);f[0]=f[d-1]=1,this._simplifyDPStep(a,f,b,0,d-1);var g,h=[];for(g=0;d>g;g++)f[g]&&h.push(a[g]);return h},_simplifyDPStep:function(a,b,c,d,e){var f,g,h,i=0;for(g=d+1;e-1>=g;g++)h=this._sqClosestPointOnSegment(a[g],a[d],a[e],!0),h>i&&(f=g,i=h);i>c&&(b[f]=1,this._simplifyDPStep(a,b,c,d,f),this._simplifyDPStep(a,b,c,f,e))},_reducePoints:function(a,b){for(var c=[a[0]],d=1,e=0,f=a.length;f>d;d++)this._sqDist(a[d],a[e])>b&&(c.push(a[d]),e=d);return f-1>e&&c.push(a[f-1]),c},clipSegment:function(a,b,c,d){var e,f,g,h=d?this._lastCode:this._getBitCode(a,c),i=this._getBitCode(b,c);for(this._lastCode=i;;){if(!(h|i))return[a,b];if(h&i)return!1;e=h||i,f=this._getEdgeIntersection(a,b,e,c),g=this._getBitCode(f,c),e===h?(a=f,h=g):(b=f,i=g)}},_getEdgeIntersection:function(a,b,c,d){var f=b.x-a.x,g=b.y-a.y,h=d.min,i=d.max;return 8&c?new e.Point(a.x+f*(i.y-a.y)/g,i.y):4&c?new e.Point(a.x+f*(h.y-a.y)/g,h.y):2&c?new e.Point(i.x,a.y+g*(i.x-a.x)/f):1&c?new e.Point(h.x,a.y+g*(h.x-a.x)/f):void 0},_getBitCode:function(a,b){var c=0;return a.x<b.min.x?c|=1:a.x>b.max.x&&(c|=2),a.y<b.min.y?c|=4:a.y>b.max.y&&(c|=8),c},_sqDist:function(a,b){var c=b.x-a.x,d=b.y-a.y;return c*c+d*d},_sqClosestPointOnSegment:function(a,b,c,d){var f,g=b.x,h=b.y,i=c.x-g,j=c.y-h,k=i*i+j*j;return k>0&&(f=((a.x-g)*i+(a.y-h)*j)/k,f>1?(g=c.x,h=c.y):f>0&&(g+=i*f,h+=j*f)),i=a.x-g,j=a.y-h,d?i*i+j*j:new e.Point(g,h)}},e.Polyline=e.Path.extend({initialize:function(a,b){e.Path.prototype.initialize.call(this,b),this._latlngs=this._convertLatLngs(a)},options:{smoothFactor:1,noClip:!1},projectLatlngs:function(){this._originalPoints=[];for(var a=0,b=this._latlngs.length;b>a;a++)this._originalPoints[a]=this._map.latLngToLayerPoint(this._latlngs[a])},getPathString:function(){for(var a=0,b=this._parts.length,c="";b>a;a++)c+=this._getPathPartStr(this._parts[a]);return c},getLatLngs:function(){return this._latlngs},setLatLngs:function(a){return this._latlngs=this._convertLatLngs(a),this.redraw()},addLatLng:function(a){return this._latlngs.push(e.latLng(a)),this.redraw()},spliceLatLngs:function(){var a=[].splice.apply(this._latlngs,arguments);return this._convertLatLngs(this._latlngs,!0),this.redraw(),a},closestLayerPoint:function(a){for(var b,c,d=1/0,f=this._parts,g=null,h=0,i=f.length;i>h;h++)for(var j=f[h],k=1,l=j.length;l>k;k++){b=j[k-1],c=j[k];var m=e.LineUtil._sqClosestPointOnSegment(a,b,c,!0);d>m&&(d=m,g=e.LineUtil._sqClosestPointOnSegment(a,b,c))}return g&&(g.distance=Math.sqrt(d)),g},getBounds:function(){return new e.LatLngBounds(this.getLatLngs())},_convertLatLngs:function(a,b){var c,d,f=b?a:[];for(c=0,d=a.length;d>c;c++){if(e.Util.isArray(a[c])&&"number"!=typeof a[c][0])return;f[c]=e.latLng(a[c])}return f},_initEvents:function(){e.Path.prototype._initEvents.call(this)},_getPathPartStr:function(a){for(var b,c=e.Path.VML,d=0,f=a.length,g="";f>d;d++)b=a[d],c&&b._round(),g+=(d?"L":"M")+b.x+" "+b.y;return g},_clipPoints:function(){var a,b,c,d=this._originalPoints,f=d.length;if(this.options.noClip)return void(this._parts=[d]);this._parts=[];var g=this._parts,h=this._map._pathViewport,i=e.LineUtil;for(a=0,b=0;f-1>a;a++)c=i.clipSegment(d[a],d[a+1],h,a),c&&(g[b]=g[b]||[],g[b].push(c[0]),(c[1]!==d[a+1]||a===f-2)&&(g[b].push(c[1]),b++))},_simplifyPoints:function(){for(var a=this._parts,b=e.LineUtil,c=0,d=a.length;d>c;c++)a[c]=b.simplify(a[c],this.options.smoothFactor)},_updatePath:function(){this._map&&(this._clipPoints(),this._simplifyPoints(),e.Path.prototype._updatePath.call(this))}}),e.polyline=function(a,b){return new e.Polyline(a,b)},e.PolyUtil={},e.PolyUtil.clipPolygon=function(a,b){var c,d,f,g,h,i,j,k,l,m=[1,4,2,8],n=e.LineUtil;for(d=0,j=a.length;j>d;d++)a[d]._code=n._getBitCode(a[d],b);for(g=0;4>g;g++){for(k=m[g],c=[],d=0,j=a.length,f=j-1;j>d;f=d++)h=a[d],i=a[f],h._code&k?i._code&k||(l=n._getEdgeIntersection(i,h,k,b),l._code=n._getBitCode(l,b),c.push(l)):(i._code&k&&(l=n._getEdgeIntersection(i,h,k,b),l._code=n._getBitCode(l,b),c.push(l)),c.push(h));a=c}return a},e.Polygon=e.Polyline.extend({options:{fill:!0},initialize:function(a,b){e.Polyline.prototype.initialize.call(this,a,b),this._initWithHoles(a)},_initWithHoles:function(a){var b,c,d;if(a&&e.Util.isArray(a[0])&&"number"!=typeof a[0][0])for(this._latlngs=this._convertLatLngs(a[0]),this._holes=a.slice(1),b=0,c=this._holes.length;c>b;b++)d=this._holes[b]=this._convertLatLngs(this._holes[b]),d[0].equals(d[d.length-1])&&d.pop();a=this._latlngs,a.length>=2&&a[0].equals(a[a.length-1])&&a.pop()},projectLatlngs:function(){if(e.Polyline.prototype.projectLatlngs.call(this),this._holePoints=[],this._holes){var a,b,c,d;for(a=0,c=this._holes.length;c>a;a++)for(this._holePoints[a]=[],b=0,d=this._holes[a].length;d>b;b++)this._holePoints[a][b]=this._map.latLngToLayerPoint(this._holes[a][b])}},setLatLngs:function(a){return a&&e.Util.isArray(a[0])&&"number"!=typeof a[0][0]?(this._initWithHoles(a),this.redraw()):e.Polyline.prototype.setLatLngs.call(this,a)},_clipPoints:function(){var a=this._originalPoints,b=[];if(this._parts=[a].concat(this._holePoints),!this.options.noClip){for(var c=0,d=this._parts.length;d>c;c++){var f=e.PolyUtil.clipPolygon(this._parts[c],this._map._pathViewport);f.length&&b.push(f)}this._parts=b}},_getPathPartStr:function(a){var b=e.Polyline.prototype._getPathPartStr.call(this,a);return b+(e.Browser.svg?"z":"x")}}),e.polygon=function(a,b){return new e.Polygon(a,b)},function(){function a(a){return e.FeatureGroup.extend({initialize:function(a,b){this._layers={},this._options=b,this.setLatLngs(a)},setLatLngs:function(b){var c=0,d=b.length;for(this.eachLayer(function(a){d>c?a.setLatLngs(b[c++]):this.removeLayer(a)},this);d>c;)this.addLayer(new a(b[c++],this._options));return this},getLatLngs:function(){var a=[];return this.eachLayer(function(b){a.push(b.getLatLngs())}),a}})}e.MultiPolyline=a(e.Polyline),e.MultiPolygon=a(e.Polygon),e.multiPolyline=function(a,b){return new e.MultiPolyline(a,b)},e.multiPolygon=function(a,b){return new e.MultiPolygon(a,b)}}(),e.Rectangle=e.Polygon.extend({initialize:function(a,b){e.Polygon.prototype.initialize.call(this,this._boundsToLatLngs(a),b)},setBounds:function(a){this.setLatLngs(this._boundsToLatLngs(a))},_boundsToLatLngs:function(a){return a=e.latLngBounds(a),[a.getSouthWest(),a.getNorthWest(),a.getNorthEast(),a.getSouthEast()]}}),e.rectangle=function(a,b){return new e.Rectangle(a,b)},e.Circle=e.Path.extend({initialize:function(a,b,c){e.Path.prototype.initialize.call(this,c),this._latlng=e.latLng(a),this._mRadius=b},options:{fill:!0},setLatLng:function(a){return this._latlng=e.latLng(a),this.redraw()},setRadius:function(a){return this._mRadius=a,this.redraw()},projectLatlngs:function(){var a=this._getLngRadius(),b=this._latlng,c=this._map.latLngToLayerPoint([b.lat,b.lng-a]);this._point=this._map.latLngToLayerPoint(b),this._radius=Math.max(this._point.x-c.x,1)},getBounds:function(){var a=this._getLngRadius(),b=this._mRadius/40075017*360,c=this._latlng;return new e.LatLngBounds([c.lat-b,c.lng-a],[c.lat+b,c.lng+a])},getLatLng:function(){return this._latlng},getPathString:function(){var a=this._point,b=this._radius;return this._checkIfEmpty()?"":e.Browser.svg?"M"+a.x+","+(a.y-b)+"A"+b+","+b+",0,1,1,"+(a.x-.1)+","+(a.y-b)+" z":(a._round(),b=Math.round(b),"AL "+a.x+","+a.y+" "+b+","+b+" 0,23592600")},getRadius:function(){return this._mRadius},_getLatRadius:function(){return this._mRadius/40075017*360},_getLngRadius:function(){return this._getLatRadius()/Math.cos(e.LatLng.DEG_TO_RAD*this._latlng.lat)},_checkIfEmpty:function(){if(!this._map)return!1;var a=this._map._pathViewport,b=this._radius,c=this._point;return c.x-b>a.max.x||c.y-b>a.max.y||c.x+b<a.min.x||c.y+b<a.min.y}}),e.circle=function(a,b,c){return new e.Circle(a,b,c)},e.CircleMarker=e.Circle.extend({options:{radius:10,weight:2},initialize:function(a,b){e.Circle.prototype.initialize.call(this,a,null,b),this._radius=this.options.radius},projectLatlngs:function(){this._point=this._map.latLngToLayerPoint(this._latlng)},_updateStyle:function(){e.Circle.prototype._updateStyle.call(this),this.setRadius(this.options.radius)},setLatLng:function(a){return e.Circle.prototype.setLatLng.call(this,a),this._popup&&this._popup._isOpen&&this._popup.setLatLng(a),this},setRadius:function(a){return this.options.radius=this._radius=a,this.redraw()},getRadius:function(){return this._radius}}),e.circleMarker=function(a,b){return new e.CircleMarker(a,b)},e.Polyline.include(e.Path.CANVAS?{_containsPoint:function(a,b){var c,d,f,g,h,i,j,k=this.options.weight/2;for(e.Browser.touch&&(k+=10),c=0,g=this._parts.length;g>c;c++)for(j=this._parts[c],d=0,h=j.length,f=h-1;h>d;f=d++)if((b||0!==d)&&(i=e.LineUtil.pointToSegmentDistance(a,j[f],j[d]),k>=i))return!0;return!1}}:{}),e.Polygon.include(e.Path.CANVAS?{_containsPoint:function(a){var b,c,d,f,g,h,i,j,k=!1;if(e.Polyline.prototype._containsPoint.call(this,a,!0))return!0;for(f=0,i=this._parts.length;i>f;f++)for(b=this._parts[f],g=0,j=b.length,h=j-1;j>g;h=g++)c=b[g],d=b[h],c.y>a.y!=d.y>a.y&&a.x<(d.x-c.x)*(a.y-c.y)/(d.y-c.y)+c.x&&(k=!k);return k}}:{}),e.Circle.include(e.Path.CANVAS?{_drawPath:function(){var a=this._point;this._ctx.beginPath(),this._ctx.arc(a.x,a.y,this._radius,0,2*Math.PI,!1)},_containsPoint:function(a){var b=this._point,c=this.options.stroke?this.options.weight/2:0;return a.distanceTo(b)<=this._radius+c}}:{}),e.CircleMarker.include(e.Path.CANVAS?{_updateStyle:function(){e.Path.prototype._updateStyle.call(this)}}:{}),e.GeoJSON=e.FeatureGroup.extend({initialize:function(a,b){e.setOptions(this,b),this._layers={},a&&this.addData(a)},addData:function(a){var b,c,d,f=e.Util.isArray(a)?a:a.features;if(f){for(b=0,c=f.length;c>b;b++)d=f[b],(d.geometries||d.geometry||d.features||d.coordinates)&&this.addData(f[b]);return this}var g=this.options;if(!g.filter||g.filter(a)){var h=e.GeoJSON.geometryToLayer(a,g.pointToLayer,g.coordsToLatLng,g);return h.feature=e.GeoJSON.asFeature(a),h.defaultOptions=h.options,this.resetStyle(h),g.onEachFeature&&g.onEachFeature(a,h),this.addLayer(h)}},resetStyle:function(a){var b=this.options.style;b&&(e.Util.extend(a.options,a.defaultOptions),this._setLayerStyle(a,b))},setStyle:function(a){this.eachLayer(function(b){this._setLayerStyle(b,a)},this)},_setLayerStyle:function(a,b){"function"==typeof b&&(b=b(a.feature)),a.setStyle&&a.setStyle(b)}}),e.extend(e.GeoJSON,{geometryToLayer:function(a,b,c,d){var f,g,h,i,j="Feature"===a.type?a.geometry:a,k=j.coordinates,l=[];switch(c=c||this.coordsToLatLng,j.type){case"Point":return f=c(k),b?b(a,f):new e.Marker(f);case"MultiPoint":for(h=0,i=k.length;i>h;h++)f=c(k[h]),l.push(b?b(a,f):new e.Marker(f));return new e.FeatureGroup(l);case"LineString":return g=this.coordsToLatLngs(k,0,c),new e.Polyline(g,d);case"Polygon":if(2===k.length&&!k[1].length)throw new Error("Invalid GeoJSON object.");return g=this.coordsToLatLngs(k,1,c),new e.Polygon(g,d);case"MultiLineString":return g=this.coordsToLatLngs(k,1,c),new e.MultiPolyline(g,d);case"MultiPolygon":return g=this.coordsToLatLngs(k,2,c),new e.MultiPolygon(g,d);case"GeometryCollection":for(h=0,i=j.geometries.length;i>h;h++)l.push(this.geometryToLayer({geometry:j.geometries[h],type:"Feature",properties:a.properties},b,c,d));return new e.FeatureGroup(l);default:throw new Error("Invalid GeoJSON object.")}},coordsToLatLng:function(a){return new e.LatLng(a[1],a[0],a[2])},coordsToLatLngs:function(a,b,c){var d,e,f,g=[];for(e=0,f=a.length;f>e;e++)d=b?this.coordsToLatLngs(a[e],b-1,c):(c||this.coordsToLatLng)(a[e]),g.push(d);return g},latLngToCoords:function(a){var b=[a.lng,a.lat];return a.alt!==c&&b.push(a.alt),b},latLngsToCoords:function(a){for(var b=[],c=0,d=a.length;d>c;c++)b.push(e.GeoJSON.latLngToCoords(a[c]));return b},getFeature:function(a,b){return a.feature?e.extend({},a.feature,{geometry:b}):e.GeoJSON.asFeature(b)},asFeature:function(a){return"Feature"===a.type?a:{type:"Feature",properties:{},geometry:a}}});var g={toGeoJSON:function(){return e.GeoJSON.getFeature(this,{type:"Point",coordinates:e.GeoJSON.latLngToCoords(this.getLatLng())})}};e.Marker.include(g),e.Circle.include(g),e.CircleMarker.include(g),e.Polyline.include({toGeoJSON:function(){return e.GeoJSON.getFeature(this,{type:"LineString",coordinates:e.GeoJSON.latLngsToCoords(this.getLatLngs())})}}),e.Polygon.include({toGeoJSON:function(){var a,b,c,d=[e.GeoJSON.latLngsToCoords(this.getLatLngs())];if(d[0].push(d[0][0]),this._holes)for(a=0,b=this._holes.length;b>a;a++)c=e.GeoJSON.latLngsToCoords(this._holes[a]),c.push(c[0]),d.push(c);return e.GeoJSON.getFeature(this,{type:"Polygon",coordinates:d})}}),function(){function a(a){return function(){var b=[];return this.eachLayer(function(a){b.push(a.toGeoJSON().geometry.coordinates)}),e.GeoJSON.getFeature(this,{type:a,coordinates:b})}}e.MultiPolyline.include({toGeoJSON:a("MultiLineString")}),e.MultiPolygon.include({toGeoJSON:a("MultiPolygon")}),e.LayerGroup.include({toGeoJSON:function(){var b,c=this.feature&&this.feature.geometry,d=[];if(c&&"MultiPoint"===c.type)return a("MultiPoint").call(this);var f=c&&"GeometryCollection"===c.type;return this.eachLayer(function(a){a.toGeoJSON&&(b=a.toGeoJSON(),d.push(f?b.geometry:e.GeoJSON.asFeature(b)))}),f?e.GeoJSON.getFeature(this,{geometries:d,type:"GeometryCollection"}):{type:"FeatureCollection",features:d}}})}(),e.geoJson=function(a,b){return new e.GeoJSON(a,b)},e.DomEvent={addListener:function(a,b,c,d){var f,g,h,i=e.stamp(c),j="_leaflet_"+b+i;return a[j]?this:(f=function(b){return c.call(d||a,b||e.DomEvent._getEvent())},e.Browser.pointer&&0===b.indexOf("touch")?this.addPointerListener(a,b,f,i):(e.Browser.touch&&"dblclick"===b&&this.addDoubleTapListener&&this.addDoubleTapListener(a,f,i),"addEventListener"in a?"mousewheel"===b?(a.addEventListener("DOMMouseScroll",f,!1),a.addEventListener(b,f,!1)):"mouseenter"===b||"mouseleave"===b?(g=f,h="mouseenter"===b?"mouseover":"mouseout",f=function(b){return e.DomEvent._checkMouse(a,b)?g(b):void 0},a.addEventListener(h,f,!1)):"click"===b&&e.Browser.android?(g=f,f=function(a){return e.DomEvent._filterClick(a,g)},a.addEventListener(b,f,!1)):a.addEventListener(b,f,!1):"attachEvent"in a&&a.attachEvent("on"+b,f),a[j]=f,this))},removeListener:function(a,b,c){var d=e.stamp(c),f="_leaflet_"+b+d,g=a[f];return g?(e.Browser.pointer&&0===b.indexOf("touch")?this.removePointerListener(a,b,d):e.Browser.touch&&"dblclick"===b&&this.removeDoubleTapListener?this.removeDoubleTapListener(a,d):"removeEventListener"in a?"mousewheel"===b?(a.removeEventListener("DOMMouseScroll",g,!1),a.removeEventListener(b,g,!1)):"mouseenter"===b||"mouseleave"===b?a.removeEventListener("mouseenter"===b?"mouseover":"mouseout",g,!1):a.removeEventListener(b,g,!1):"detachEvent"in a&&a.detachEvent("on"+b,g),a[f]=null,this):this},stopPropagation:function(a){return a.stopPropagation?a.stopPropagation():a.cancelBubble=!0,e.DomEvent._skipped(a),this},disableScrollPropagation:function(a){var b=e.DomEvent.stopPropagation;return e.DomEvent.on(a,"mousewheel",b).on(a,"MozMousePixelScroll",b)},disableClickPropagation:function(a){for(var b=e.DomEvent.stopPropagation,c=e.Draggable.START.length-1;c>=0;c--)e.DomEvent.on(a,e.Draggable.START[c],b);return e.DomEvent.on(a,"click",e.DomEvent._fakeStop).on(a,"dblclick",b)},preventDefault:function(a){return a.preventDefault?a.preventDefault():a.returnValue=!1,this},stop:function(a){return e.DomEvent.preventDefault(a).stopPropagation(a)},getMousePosition:function(a,b){if(!b)return new e.Point(a.clientX,a.clientY);var c=b.getBoundingClientRect();return new e.Point(a.clientX-c.left-b.clientLeft,a.clientY-c.top-b.clientTop)},getWheelDelta:function(a){var b=0;return a.wheelDelta&&(b=a.wheelDelta/120),a.detail&&(b=-a.detail/3),b},_skipEvents:{},_fakeStop:function(a){e.DomEvent._skipEvents[a.type]=!0},_skipped:function(a){var b=this._skipEvents[a.type];return this._skipEvents[a.type]=!1,b},_checkMouse:function(a,b){var c=b.relatedTarget;if(!c)return!0;try{for(;c&&c!==a;)c=c.parentNode}catch(d){return!1}return c!==a},_getEvent:function(){var b=a.event;if(!b)for(var c=arguments.callee.caller;c&&(b=c.arguments[0],!b||a.Event!==b.constructor);)c=c.caller;return b},_filterClick:function(a,b){var c=a.timeStamp||a.originalEvent.timeStamp,d=e.DomEvent._lastClick&&c-e.DomEvent._lastClick;return d&&d>100&&500>d||a.target._simulatedClick&&!a._simulated?void e.DomEvent.stop(a):(e.DomEvent._lastClick=c,b(a))}},e.DomEvent.on=e.DomEvent.addListener,e.DomEvent.off=e.DomEvent.removeListener,e.Draggable=e.Class.extend({includes:e.Mixin.Events,statics:{START:e.Browser.touch?["touchstart","mousedown"]:["mousedown"],END:{mousedown:"mouseup",touchstart:"touchend",pointerdown:"touchend",MSPointerDown:"touchend"},MOVE:{mousedown:"mousemove",touchstart:"touchmove",pointerdown:"touchmove",MSPointerDown:"touchmove"}},initialize:function(a,b){this._element=a,this._dragStartTarget=b||a},enable:function(){if(!this._enabled){for(var a=e.Draggable.START.length-1;a>=0;a--)e.DomEvent.on(this._dragStartTarget,e.Draggable.START[a],this._onDown,this);this._enabled=!0}},disable:function(){if(this._enabled){for(var a=e.Draggable.START.length-1;a>=0;a--)e.DomEvent.off(this._dragStartTarget,e.Draggable.START[a],this._onDown,this);this._enabled=!1,this._moved=!1}},_onDown:function(a){if(this._moved=!1,!(a.shiftKey||1!==a.which&&1!==a.button&&!a.touches||(e.DomEvent.stopPropagation(a),e.Draggable._disabled||(e.DomUtil.disableImageDrag(),e.DomUtil.disableTextSelection(),this._moving)))){var c=a.touches?a.touches[0]:a;this._startPoint=new e.Point(c.clientX,c.clientY),this._startPos=this._newPos=e.DomUtil.getPosition(this._element),e.DomEvent.on(b,e.Draggable.MOVE[a.type],this._onMove,this).on(b,e.Draggable.END[a.type],this._onUp,this)}},_onMove:function(a){if(a.touches&&a.touches.length>1)return void(this._moved=!0);var c=a.touches&&1===a.touches.length?a.touches[0]:a,d=new e.Point(c.clientX,c.clientY),f=d.subtract(this._startPoint);(f.x||f.y)&&(e.Browser.touch&&Math.abs(f.x)+Math.abs(f.y)<3||(e.DomEvent.preventDefault(a),this._moved||(this.fire("dragstart"),this._moved=!0,this._startPos=e.DomUtil.getPosition(this._element).subtract(f),e.DomUtil.addClass(b.body,"leaflet-dragging"),this._lastTarget=a.target||a.srcElement,e.DomUtil.addClass(this._lastTarget,"leaflet-drag-target")),this._newPos=this._startPos.add(f),this._moving=!0,e.Util.cancelAnimFrame(this._animRequest),this._animRequest=e.Util.requestAnimFrame(this._updatePosition,this,!0,this._dragStartTarget)))},_updatePosition:function(){this.fire("predrag"),e.DomUtil.setPosition(this._element,this._newPos),this.fire("drag")},_onUp:function(){e.DomUtil.removeClass(b.body,"leaflet-dragging"),this._lastTarget&&(e.DomUtil.removeClass(this._lastTarget,"leaflet-drag-target"),this._lastTarget=null);for(var a in e.Draggable.MOVE)e.DomEvent.off(b,e.Draggable.MOVE[a],this._onMove).off(b,e.Draggable.END[a],this._onUp);e.DomUtil.enableImageDrag(),
e.DomUtil.enableTextSelection(),this._moved&&this._moving&&(e.Util.cancelAnimFrame(this._animRequest),this.fire("dragend",{distance:this._newPos.distanceTo(this._startPos)})),this._moving=!1}}),e.Handler=e.Class.extend({initialize:function(a){this._map=a},enable:function(){this._enabled||(this._enabled=!0,this.addHooks())},disable:function(){this._enabled&&(this._enabled=!1,this.removeHooks())},enabled:function(){return!!this._enabled}}),e.Map.mergeOptions({dragging:!0,inertia:!e.Browser.android23,inertiaDeceleration:3400,inertiaMaxSpeed:1/0,inertiaThreshold:e.Browser.touch?32:18,easeLinearity:.25,worldCopyJump:!1}),e.Map.Drag=e.Handler.extend({addHooks:function(){if(!this._draggable){var a=this._map;this._draggable=new e.Draggable(a._mapPane,a._container),this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this),a.options.worldCopyJump&&(this._draggable.on("predrag",this._onPreDrag,this),a.on("viewreset",this._onViewReset,this),a.whenReady(this._onViewReset,this))}this._draggable.enable()},removeHooks:function(){this._draggable.disable()},moved:function(){return this._draggable&&this._draggable._moved},_onDragStart:function(){var a=this._map;a._panAnim&&a._panAnim.stop(),a.fire("movestart").fire("dragstart"),a.options.inertia&&(this._positions=[],this._times=[])},_onDrag:function(){if(this._map.options.inertia){var a=this._lastTime=+new Date,b=this._lastPos=this._draggable._newPos;this._positions.push(b),this._times.push(a),a-this._times[0]>200&&(this._positions.shift(),this._times.shift())}this._map.fire("move").fire("drag")},_onViewReset:function(){var a=this._map.getSize()._divideBy(2),b=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=b.subtract(a).x,this._worldWidth=this._map.project([0,180]).x},_onPreDrag:function(){var a=this._worldWidth,b=Math.round(a/2),c=this._initialWorldOffset,d=this._draggable._newPos.x,e=(d-b+c)%a+b-c,f=(d+b+c)%a-b-c,g=Math.abs(e+c)<Math.abs(f+c)?e:f;this._draggable._newPos.x=g},_onDragEnd:function(a){var b=this._map,c=b.options,d=+new Date-this._lastTime,f=!c.inertia||d>c.inertiaThreshold||!this._positions[0];if(b.fire("dragend",a),f)b.fire("moveend");else{var g=this._lastPos.subtract(this._positions[0]),h=(this._lastTime+d-this._times[0])/1e3,i=c.easeLinearity,j=g.multiplyBy(i/h),k=j.distanceTo([0,0]),l=Math.min(c.inertiaMaxSpeed,k),m=j.multiplyBy(l/k),n=l/(c.inertiaDeceleration*i),o=m.multiplyBy(-n/2).round();o.x&&o.y?(o=b._limitOffset(o,b.options.maxBounds),e.Util.requestAnimFrame(function(){b.panBy(o,{duration:n,easeLinearity:i,noMoveStart:!0})})):b.fire("moveend")}}}),e.Map.addInitHook("addHandler","dragging",e.Map.Drag),e.Map.mergeOptions({doubleClickZoom:!0}),e.Map.DoubleClickZoom=e.Handler.extend({addHooks:function(){this._map.on("dblclick",this._onDoubleClick,this)},removeHooks:function(){this._map.off("dblclick",this._onDoubleClick,this)},_onDoubleClick:function(a){var b=this._map,c=b.getZoom()+(a.originalEvent.shiftKey?-1:1);"center"===b.options.doubleClickZoom?b.setZoom(c):b.setZoomAround(a.containerPoint,c)}}),e.Map.addInitHook("addHandler","doubleClickZoom",e.Map.DoubleClickZoom),e.Map.mergeOptions({scrollWheelZoom:!0}),e.Map.ScrollWheelZoom=e.Handler.extend({addHooks:function(){e.DomEvent.on(this._map._container,"mousewheel",this._onWheelScroll,this),e.DomEvent.on(this._map._container,"MozMousePixelScroll",e.DomEvent.preventDefault),this._delta=0},removeHooks:function(){e.DomEvent.off(this._map._container,"mousewheel",this._onWheelScroll),e.DomEvent.off(this._map._container,"MozMousePixelScroll",e.DomEvent.preventDefault)},_onWheelScroll:function(a){var b=e.DomEvent.getWheelDelta(a);this._delta+=b,this._lastMousePos=this._map.mouseEventToContainerPoint(a),this._startTime||(this._startTime=+new Date);var c=Math.max(40-(+new Date-this._startTime),0);clearTimeout(this._timer),this._timer=setTimeout(e.bind(this._performZoom,this),c),e.DomEvent.preventDefault(a),e.DomEvent.stopPropagation(a)},_performZoom:function(){var a=this._map,b=this._delta,c=a.getZoom();b=b>0?Math.ceil(b):Math.floor(b),b=Math.max(Math.min(b,4),-4),b=a._limitZoom(c+b)-c,this._delta=0,this._startTime=null,b&&("center"===a.options.scrollWheelZoom?a.setZoom(c+b):a.setZoomAround(this._lastMousePos,c+b))}}),e.Map.addInitHook("addHandler","scrollWheelZoom",e.Map.ScrollWheelZoom),e.extend(e.DomEvent,{_touchstart:e.Browser.msPointer?"MSPointerDown":e.Browser.pointer?"pointerdown":"touchstart",_touchend:e.Browser.msPointer?"MSPointerUp":e.Browser.pointer?"pointerup":"touchend",addDoubleTapListener:function(a,c,d){function f(a){var b;if(e.Browser.pointer?(o.push(a.pointerId),b=o.length):b=a.touches.length,!(b>1)){var c=Date.now(),d=c-(h||c);i=a.touches?a.touches[0]:a,j=d>0&&k>=d,h=c}}function g(a){if(e.Browser.pointer){var b=o.indexOf(a.pointerId);if(-1===b)return;o.splice(b,1)}if(j){if(e.Browser.pointer){var d,f={};for(var g in i)d=i[g],f[g]="function"==typeof d?d.bind(i):d;i=f}i.type="dblclick",c(i),h=null}}var h,i,j=!1,k=250,l="_leaflet_",m=this._touchstart,n=this._touchend,o=[];a[l+m+d]=f,a[l+n+d]=g;var p=e.Browser.pointer?b.documentElement:a;return a.addEventListener(m,f,!1),p.addEventListener(n,g,!1),e.Browser.pointer&&p.addEventListener(e.DomEvent.POINTER_CANCEL,g,!1),this},removeDoubleTapListener:function(a,c){var d="_leaflet_";return a.removeEventListener(this._touchstart,a[d+this._touchstart+c],!1),(e.Browser.pointer?b.documentElement:a).removeEventListener(this._touchend,a[d+this._touchend+c],!1),e.Browser.pointer&&b.documentElement.removeEventListener(e.DomEvent.POINTER_CANCEL,a[d+this._touchend+c],!1),this}}),e.extend(e.DomEvent,{POINTER_DOWN:e.Browser.msPointer?"MSPointerDown":"pointerdown",POINTER_MOVE:e.Browser.msPointer?"MSPointerMove":"pointermove",POINTER_UP:e.Browser.msPointer?"MSPointerUp":"pointerup",POINTER_CANCEL:e.Browser.msPointer?"MSPointerCancel":"pointercancel",_pointers:[],_pointerDocumentListener:!1,addPointerListener:function(a,b,c,d){switch(b){case"touchstart":return this.addPointerListenerStart(a,b,c,d);case"touchend":return this.addPointerListenerEnd(a,b,c,d);case"touchmove":return this.addPointerListenerMove(a,b,c,d);default:throw"Unknown touch event type"}},addPointerListenerStart:function(a,c,d,f){var g="_leaflet_",h=this._pointers,i=function(a){e.DomEvent.preventDefault(a);for(var b=!1,c=0;c<h.length;c++)if(h[c].pointerId===a.pointerId){b=!0;break}b||h.push(a),a.touches=h.slice(),a.changedTouches=[a],d(a)};if(a[g+"touchstart"+f]=i,a.addEventListener(this.POINTER_DOWN,i,!1),!this._pointerDocumentListener){var j=function(a){for(var b=0;b<h.length;b++)if(h[b].pointerId===a.pointerId){h.splice(b,1);break}};b.documentElement.addEventListener(this.POINTER_UP,j,!1),b.documentElement.addEventListener(this.POINTER_CANCEL,j,!1),this._pointerDocumentListener=!0}return this},addPointerListenerMove:function(a,b,c,d){function e(a){if(a.pointerType!==a.MSPOINTER_TYPE_MOUSE&&"mouse"!==a.pointerType||0!==a.buttons){for(var b=0;b<g.length;b++)if(g[b].pointerId===a.pointerId){g[b]=a;break}a.touches=g.slice(),a.changedTouches=[a],c(a)}}var f="_leaflet_",g=this._pointers;return a[f+"touchmove"+d]=e,a.addEventListener(this.POINTER_MOVE,e,!1),this},addPointerListenerEnd:function(a,b,c,d){var e="_leaflet_",f=this._pointers,g=function(a){for(var b=0;b<f.length;b++)if(f[b].pointerId===a.pointerId){f.splice(b,1);break}a.touches=f.slice(),a.changedTouches=[a],c(a)};return a[e+"touchend"+d]=g,a.addEventListener(this.POINTER_UP,g,!1),a.addEventListener(this.POINTER_CANCEL,g,!1),this},removePointerListener:function(a,b,c){var d="_leaflet_",e=a[d+b+c];switch(b){case"touchstart":a.removeEventListener(this.POINTER_DOWN,e,!1);break;case"touchmove":a.removeEventListener(this.POINTER_MOVE,e,!1);break;case"touchend":a.removeEventListener(this.POINTER_UP,e,!1),a.removeEventListener(this.POINTER_CANCEL,e,!1)}return this}}),e.Map.mergeOptions({touchZoom:e.Browser.touch&&!e.Browser.android23,bounceAtZoomLimits:!0}),e.Map.TouchZoom=e.Handler.extend({addHooks:function(){e.DomEvent.on(this._map._container,"touchstart",this._onTouchStart,this)},removeHooks:function(){e.DomEvent.off(this._map._container,"touchstart",this._onTouchStart,this)},_onTouchStart:function(a){var c=this._map;if(a.touches&&2===a.touches.length&&!c._animatingZoom&&!this._zooming){var d=c.mouseEventToLayerPoint(a.touches[0]),f=c.mouseEventToLayerPoint(a.touches[1]),g=c._getCenterLayerPoint();this._startCenter=d.add(f)._divideBy(2),this._startDist=d.distanceTo(f),this._moved=!1,this._zooming=!0,this._centerOffset=g.subtract(this._startCenter),c._panAnim&&c._panAnim.stop(),e.DomEvent.on(b,"touchmove",this._onTouchMove,this).on(b,"touchend",this._onTouchEnd,this),e.DomEvent.preventDefault(a)}},_onTouchMove:function(a){var b=this._map;if(a.touches&&2===a.touches.length&&this._zooming){var c=b.mouseEventToLayerPoint(a.touches[0]),d=b.mouseEventToLayerPoint(a.touches[1]);this._scale=c.distanceTo(d)/this._startDist,this._delta=c._add(d)._divideBy(2)._subtract(this._startCenter),1!==this._scale&&(b.options.bounceAtZoomLimits||!(b.getZoom()===b.getMinZoom()&&this._scale<1||b.getZoom()===b.getMaxZoom()&&this._scale>1))&&(this._moved||(e.DomUtil.addClass(b._mapPane,"leaflet-touching"),b.fire("movestart").fire("zoomstart"),this._moved=!0),e.Util.cancelAnimFrame(this._animRequest),this._animRequest=e.Util.requestAnimFrame(this._updateOnMove,this,!0,this._map._container),e.DomEvent.preventDefault(a))}},_updateOnMove:function(){var a=this._map,b=this._getScaleOrigin(),c=a.layerPointToLatLng(b),d=a.getScaleZoom(this._scale);a._animateZoom(c,d,this._startCenter,this._scale,this._delta,!1,!0)},_onTouchEnd:function(){if(!this._moved||!this._zooming)return void(this._zooming=!1);var a=this._map;this._zooming=!1,e.DomUtil.removeClass(a._mapPane,"leaflet-touching"),e.Util.cancelAnimFrame(this._animRequest),e.DomEvent.off(b,"touchmove",this._onTouchMove).off(b,"touchend",this._onTouchEnd);var c=this._getScaleOrigin(),d=a.layerPointToLatLng(c),f=a.getZoom(),g=a.getScaleZoom(this._scale)-f,h=g>0?Math.ceil(g):Math.floor(g),i=a._limitZoom(f+h),j=a.getZoomScale(i)/this._scale;a._animateZoom(d,i,c,j)},_getScaleOrigin:function(){var a=this._centerOffset.subtract(this._delta).divideBy(this._scale);return this._startCenter.add(a)}}),e.Map.addInitHook("addHandler","touchZoom",e.Map.TouchZoom),e.Map.mergeOptions({tap:!0,tapTolerance:15}),e.Map.Tap=e.Handler.extend({addHooks:function(){e.DomEvent.on(this._map._container,"touchstart",this._onDown,this)},removeHooks:function(){e.DomEvent.off(this._map._container,"touchstart",this._onDown,this)},_onDown:function(a){if(a.touches){if(e.DomEvent.preventDefault(a),this._fireClick=!0,a.touches.length>1)return this._fireClick=!1,void clearTimeout(this._holdTimeout);var c=a.touches[0],d=c.target;this._startPos=this._newPos=new e.Point(c.clientX,c.clientY),d.tagName&&"a"===d.tagName.toLowerCase()&&e.DomUtil.addClass(d,"leaflet-active"),this._holdTimeout=setTimeout(e.bind(function(){this._isTapValid()&&(this._fireClick=!1,this._onUp(),this._simulateEvent("contextmenu",c))},this),1e3),e.DomEvent.on(b,"touchmove",this._onMove,this).on(b,"touchend",this._onUp,this)}},_onUp:function(a){if(clearTimeout(this._holdTimeout),e.DomEvent.off(b,"touchmove",this._onMove,this).off(b,"touchend",this._onUp,this),this._fireClick&&a&&a.changedTouches){var c=a.changedTouches[0],d=c.target;d&&d.tagName&&"a"===d.tagName.toLowerCase()&&e.DomUtil.removeClass(d,"leaflet-active"),this._isTapValid()&&this._simulateEvent("click",c)}},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance},_onMove:function(a){var b=a.touches[0];this._newPos=new e.Point(b.clientX,b.clientY)},_simulateEvent:function(c,d){var e=b.createEvent("MouseEvents");e._simulated=!0,d.target._simulatedClick=!0,e.initMouseEvent(c,!0,!0,a,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null),d.target.dispatchEvent(e)}}),e.Browser.touch&&!e.Browser.pointer&&e.Map.addInitHook("addHandler","tap",e.Map.Tap),e.Map.mergeOptions({boxZoom:!0}),e.Map.BoxZoom=e.Handler.extend({initialize:function(a){this._map=a,this._container=a._container,this._pane=a._panes.overlayPane,this._moved=!1},addHooks:function(){e.DomEvent.on(this._container,"mousedown",this._onMouseDown,this)},removeHooks:function(){e.DomEvent.off(this._container,"mousedown",this._onMouseDown),this._moved=!1},moved:function(){return this._moved},_onMouseDown:function(a){return this._moved=!1,!a.shiftKey||1!==a.which&&1!==a.button?!1:(e.DomUtil.disableTextSelection(),e.DomUtil.disableImageDrag(),this._startLayerPoint=this._map.mouseEventToLayerPoint(a),void e.DomEvent.on(b,"mousemove",this._onMouseMove,this).on(b,"mouseup",this._onMouseUp,this).on(b,"keydown",this._onKeyDown,this))},_onMouseMove:function(a){this._moved||(this._box=e.DomUtil.create("div","leaflet-zoom-box",this._pane),e.DomUtil.setPosition(this._box,this._startLayerPoint),this._container.style.cursor="crosshair",this._map.fire("boxzoomstart"));var b=this._startLayerPoint,c=this._box,d=this._map.mouseEventToLayerPoint(a),f=d.subtract(b),g=new e.Point(Math.min(d.x,b.x),Math.min(d.y,b.y));e.DomUtil.setPosition(c,g),this._moved=!0,c.style.width=Math.max(0,Math.abs(f.x)-4)+"px",c.style.height=Math.max(0,Math.abs(f.y)-4)+"px"},_finish:function(){this._moved&&(this._pane.removeChild(this._box),this._container.style.cursor=""),e.DomUtil.enableTextSelection(),e.DomUtil.enableImageDrag(),e.DomEvent.off(b,"mousemove",this._onMouseMove).off(b,"mouseup",this._onMouseUp).off(b,"keydown",this._onKeyDown)},_onMouseUp:function(a){this._finish();var b=this._map,c=b.mouseEventToLayerPoint(a);if(!this._startLayerPoint.equals(c)){var d=new e.LatLngBounds(b.layerPointToLatLng(this._startLayerPoint),b.layerPointToLatLng(c));b.fitBounds(d),b.fire("boxzoomend",{boxZoomBounds:d})}},_onKeyDown:function(a){27===a.keyCode&&this._finish()}}),e.Map.addInitHook("addHandler","boxZoom",e.Map.BoxZoom),e.Map.mergeOptions({keyboard:!0,keyboardPanOffset:80,keyboardZoomOffset:1}),e.Map.Keyboard=e.Handler.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,173]},initialize:function(a){this._map=a,this._setPanOffset(a.options.keyboardPanOffset),this._setZoomOffset(a.options.keyboardZoomOffset)},addHooks:function(){var a=this._map._container;-1===a.tabIndex&&(a.tabIndex="0"),e.DomEvent.on(a,"focus",this._onFocus,this).on(a,"blur",this._onBlur,this).on(a,"mousedown",this._onMouseDown,this),this._map.on("focus",this._addHooks,this).on("blur",this._removeHooks,this)},removeHooks:function(){this._removeHooks();var a=this._map._container;e.DomEvent.off(a,"focus",this._onFocus,this).off(a,"blur",this._onBlur,this).off(a,"mousedown",this._onMouseDown,this),this._map.off("focus",this._addHooks,this).off("blur",this._removeHooks,this)},_onMouseDown:function(){if(!this._focused){var c=b.body,d=b.documentElement,e=c.scrollTop||d.scrollTop,f=c.scrollLeft||d.scrollLeft;this._map._container.focus(),a.scrollTo(f,e)}},_onFocus:function(){this._focused=!0,this._map.fire("focus")},_onBlur:function(){this._focused=!1,this._map.fire("blur")},_setPanOffset:function(a){var b,c,d=this._panKeys={},e=this.keyCodes;for(b=0,c=e.left.length;c>b;b++)d[e.left[b]]=[-1*a,0];for(b=0,c=e.right.length;c>b;b++)d[e.right[b]]=[a,0];for(b=0,c=e.down.length;c>b;b++)d[e.down[b]]=[0,a];for(b=0,c=e.up.length;c>b;b++)d[e.up[b]]=[0,-1*a]},_setZoomOffset:function(a){var b,c,d=this._zoomKeys={},e=this.keyCodes;for(b=0,c=e.zoomIn.length;c>b;b++)d[e.zoomIn[b]]=a;for(b=0,c=e.zoomOut.length;c>b;b++)d[e.zoomOut[b]]=-a},_addHooks:function(){e.DomEvent.on(b,"keydown",this._onKeyDown,this)},_removeHooks:function(){e.DomEvent.off(b,"keydown",this._onKeyDown,this)},_onKeyDown:function(a){var b=a.keyCode,c=this._map;if(b in this._panKeys){if(c._panAnim&&c._panAnim._inProgress)return;c.panBy(this._panKeys[b]),c.options.maxBounds&&c.panInsideBounds(c.options.maxBounds)}else{if(!(b in this._zoomKeys))return;c.setZoom(c.getZoom()+this._zoomKeys[b])}e.DomEvent.stop(a)}}),e.Map.addInitHook("addHandler","keyboard",e.Map.Keyboard),e.Handler.MarkerDrag=e.Handler.extend({initialize:function(a){this._marker=a},addHooks:function(){var a=this._marker._icon;this._draggable||(this._draggable=new e.Draggable(a,a)),this._draggable.on("dragstart",this._onDragStart,this).on("drag",this._onDrag,this).on("dragend",this._onDragEnd,this),this._draggable.enable(),e.DomUtil.addClass(this._marker._icon,"leaflet-marker-draggable")},removeHooks:function(){this._draggable.off("dragstart",this._onDragStart,this).off("drag",this._onDrag,this).off("dragend",this._onDragEnd,this),this._draggable.disable(),e.DomUtil.removeClass(this._marker._icon,"leaflet-marker-draggable")},moved:function(){return this._draggable&&this._draggable._moved},_onDragStart:function(){this._marker.closePopup().fire("movestart").fire("dragstart")},_onDrag:function(){var a=this._marker,b=a._shadow,c=e.DomUtil.getPosition(a._icon),d=a._map.layerPointToLatLng(c);b&&e.DomUtil.setPosition(b,c),a._latlng=d,a.fire("move",{latlng:d}).fire("drag")},_onDragEnd:function(a){this._marker.fire("moveend").fire("dragend",a)}}),e.Control=e.Class.extend({options:{position:"topright"},initialize:function(a){e.setOptions(this,a)},getPosition:function(){return this.options.position},setPosition:function(a){var b=this._map;return b&&b.removeControl(this),this.options.position=a,b&&b.addControl(this),this},getContainer:function(){return this._container},addTo:function(a){this._map=a;var b=this._container=this.onAdd(a),c=this.getPosition(),d=a._controlCorners[c];return e.DomUtil.addClass(b,"leaflet-control"),-1!==c.indexOf("bottom")?d.insertBefore(b,d.firstChild):d.appendChild(b),this},removeFrom:function(a){var b=this.getPosition(),c=a._controlCorners[b];return c.removeChild(this._container),this._map=null,this.onRemove&&this.onRemove(a),this},_refocusOnMap:function(){this._map&&this._map.getContainer().focus()}}),e.control=function(a){return new e.Control(a)},e.Map.include({addControl:function(a){return a.addTo(this),this},removeControl:function(a){return a.removeFrom(this),this},_initControlPos:function(){function a(a,f){var g=c+a+" "+c+f;b[a+f]=e.DomUtil.create("div",g,d)}var b=this._controlCorners={},c="leaflet-",d=this._controlContainer=e.DomUtil.create("div",c+"control-container",this._container);a("top","left"),a("top","right"),a("bottom","left"),a("bottom","right")},_clearControlPos:function(){this._container.removeChild(this._controlContainer)}}),e.Control.Zoom=e.Control.extend({options:{position:"topleft",zoomInText:"+",zoomInTitle:"Zoom in",zoomOutText:"-",zoomOutTitle:"Zoom out"},onAdd:function(a){var b="leaflet-control-zoom",c=e.DomUtil.create("div",b+" leaflet-bar");return this._map=a,this._zoomInButton=this._createButton(this.options.zoomInText,this.options.zoomInTitle,b+"-in",c,this._zoomIn,this),this._zoomOutButton=this._createButton(this.options.zoomOutText,this.options.zoomOutTitle,b+"-out",c,this._zoomOut,this),this._updateDisabled(),a.on("zoomend zoomlevelschange",this._updateDisabled,this),c},onRemove:function(a){a.off("zoomend zoomlevelschange",this._updateDisabled,this)},_zoomIn:function(a){this._map.zoomIn(a.shiftKey?3:1)},_zoomOut:function(a){this._map.zoomOut(a.shiftKey?3:1)},_createButton:function(a,b,c,d,f,g){var h=e.DomUtil.create("a",c,d);h.innerHTML=a,h.href="#",h.title=b;var i=e.DomEvent.stopPropagation;return e.DomEvent.on(h,"click",i).on(h,"mousedown",i).on(h,"dblclick",i).on(h,"click",e.DomEvent.preventDefault).on(h,"click",f,g).on(h,"click",this._refocusOnMap,g),h},_updateDisabled:function(){var a=this._map,b="leaflet-disabled";e.DomUtil.removeClass(this._zoomInButton,b),e.DomUtil.removeClass(this._zoomOutButton,b),a._zoom===a.getMinZoom()&&e.DomUtil.addClass(this._zoomOutButton,b),a._zoom===a.getMaxZoom()&&e.DomUtil.addClass(this._zoomInButton,b)}}),e.Map.mergeOptions({zoomControl:!0}),e.Map.addInitHook(function(){this.options.zoomControl&&(this.zoomControl=new e.Control.Zoom,this.addControl(this.zoomControl))}),e.control.zoom=function(a){return new e.Control.Zoom(a)},e.Control.Attribution=e.Control.extend({options:{position:"bottomright",prefix:'<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'},initialize:function(a){e.setOptions(this,a),this._attributions={}},onAdd:function(a){this._container=e.DomUtil.create("div","leaflet-control-attribution"),e.DomEvent.disableClickPropagation(this._container);for(var b in a._layers)a._layers[b].getAttribution&&this.addAttribution(a._layers[b].getAttribution());return a.on("layeradd",this._onLayerAdd,this).on("layerremove",this._onLayerRemove,this),this._update(),this._container},onRemove:function(a){a.off("layeradd",this._onLayerAdd).off("layerremove",this._onLayerRemove)},setPrefix:function(a){return this.options.prefix=a,this._update(),this},addAttribution:function(a){return a?(this._attributions[a]||(this._attributions[a]=0),this._attributions[a]++,this._update(),this):void 0},removeAttribution:function(a){return a?(this._attributions[a]&&(this._attributions[a]--,this._update()),this):void 0},_update:function(){if(this._map){var a=[];for(var b in this._attributions)this._attributions[b]&&a.push(b);var c=[];this.options.prefix&&c.push(this.options.prefix),a.length&&c.push(a.join(", ")),this._container.innerHTML=c.join(" | ")}},_onLayerAdd:function(a){a.layer.getAttribution&&this.addAttribution(a.layer.getAttribution())},_onLayerRemove:function(a){a.layer.getAttribution&&this.removeAttribution(a.layer.getAttribution())}}),e.Map.mergeOptions({attributionControl:!0}),e.Map.addInitHook(function(){this.options.attributionControl&&(this.attributionControl=(new e.Control.Attribution).addTo(this))}),e.control.attribution=function(a){return new e.Control.Attribution(a)},e.Control.Scale=e.Control.extend({options:{position:"bottomleft",maxWidth:100,metric:!0,imperial:!0,updateWhenIdle:!1},onAdd:function(a){this._map=a;var b="leaflet-control-scale",c=e.DomUtil.create("div",b),d=this.options;return this._addScales(d,b,c),a.on(d.updateWhenIdle?"moveend":"move",this._update,this),a.whenReady(this._update,this),c},onRemove:function(a){a.off(this.options.updateWhenIdle?"moveend":"move",this._update,this)},_addScales:function(a,b,c){a.metric&&(this._mScale=e.DomUtil.create("div",b+"-line",c)),a.imperial&&(this._iScale=e.DomUtil.create("div",b+"-line",c))},_update:function(){var a=this._map.getBounds(),b=a.getCenter().lat,c=6378137*Math.PI*Math.cos(b*Math.PI/180),d=c*(a.getNorthEast().lng-a.getSouthWest().lng)/180,e=this._map.getSize(),f=this.options,g=0;e.x>0&&(g=d*(f.maxWidth/e.x)),this._updateScales(f,g)},_updateScales:function(a,b){a.metric&&b&&this._updateMetric(b),a.imperial&&b&&this._updateImperial(b)},_updateMetric:function(a){var b=this._getRoundNum(a);this._mScale.style.width=this._getScaleWidth(b/a)+"px",this._mScale.innerHTML=1e3>b?b+" m":b/1e3+" km"},_updateImperial:function(a){var b,c,d,e=3.2808399*a,f=this._iScale;e>5280?(b=e/5280,c=this._getRoundNum(b),f.style.width=this._getScaleWidth(c/b)+"px",f.innerHTML=c+" mi"):(d=this._getRoundNum(e),f.style.width=this._getScaleWidth(d/e)+"px",f.innerHTML=d+" ft")},_getScaleWidth:function(a){return Math.round(this.options.maxWidth*a)-10},_getRoundNum:function(a){var b=Math.pow(10,(Math.floor(a)+"").length-1),c=a/b;return c=c>=10?10:c>=5?5:c>=3?3:c>=2?2:1,b*c}}),e.control.scale=function(a){return new e.Control.Scale(a)},e.Control.Layers=e.Control.extend({options:{collapsed:!0,position:"topright",autoZIndex:!0},initialize:function(a,b,c){e.setOptions(this,c),this._layers={},this._lastZIndex=0,this._handlingClick=!1;for(var d in a)this._addLayer(a[d],d);for(d in b)this._addLayer(b[d],d,!0)},onAdd:function(a){return this._initLayout(),this._update(),a.on("layeradd",this._onLayerChange,this).on("layerremove",this._onLayerChange,this),this._container},onRemove:function(a){a.off("layeradd",this._onLayerChange,this).off("layerremove",this._onLayerChange,this)},addBaseLayer:function(a,b){return this._addLayer(a,b),this._update(),this},addOverlay:function(a,b){return this._addLayer(a,b,!0),this._update(),this},removeLayer:function(a){var b=e.stamp(a);return delete this._layers[b],this._update(),this},_initLayout:function(){var a="leaflet-control-layers",b=this._container=e.DomUtil.create("div",a);b.setAttribute("aria-haspopup",!0),e.Browser.touch?e.DomEvent.on(b,"click",e.DomEvent.stopPropagation):e.DomEvent.disableClickPropagation(b).disableScrollPropagation(b);var c=this._form=e.DomUtil.create("form",a+"-list");if(this.options.collapsed){e.Browser.android||e.DomEvent.on(b,"mouseover",this._expand,this).on(b,"mouseout",this._collapse,this);var d=this._layersLink=e.DomUtil.create("a",a+"-toggle",b);d.href="#",d.title="Layers",e.Browser.touch?e.DomEvent.on(d,"click",e.DomEvent.stop).on(d,"click",this._expand,this):e.DomEvent.on(d,"focus",this._expand,this),e.DomEvent.on(c,"click",function(){setTimeout(e.bind(this._onInputClick,this),0)},this),this._map.on("click",this._collapse,this)}else this._expand();this._baseLayersList=e.DomUtil.create("div",a+"-base",c),this._separator=e.DomUtil.create("div",a+"-separator",c),this._overlaysList=e.DomUtil.create("div",a+"-overlays",c),b.appendChild(c)},_addLayer:function(a,b,c){var d=e.stamp(a);this._layers[d]={layer:a,name:b,overlay:c},this.options.autoZIndex&&a.setZIndex&&(this._lastZIndex++,a.setZIndex(this._lastZIndex))},_update:function(){if(this._container){this._baseLayersList.innerHTML="",this._overlaysList.innerHTML="";var a,b,c=!1,d=!1;for(a in this._layers)b=this._layers[a],this._addItem(b),d=d||b.overlay,c=c||!b.overlay;this._separator.style.display=d&&c?"":"none"}},_onLayerChange:function(a){var b=this._layers[e.stamp(a.layer)];if(b){this._handlingClick||this._update();var c=b.overlay?"layeradd"===a.type?"overlayadd":"overlayremove":"layeradd"===a.type?"baselayerchange":null;c&&this._map.fire(c,b)}},_createRadioElement:function(a,c){var d='<input type="radio" class="leaflet-control-layers-selector" name="'+a+'"';c&&(d+=' checked="checked"'),d+="/>";var e=b.createElement("div");return e.innerHTML=d,e.firstChild},_addItem:function(a){var c,d=b.createElement("label"),f=this._map.hasLayer(a.layer);a.overlay?(c=b.createElement("input"),c.type="checkbox",c.className="leaflet-control-layers-selector",c.defaultChecked=f):c=this._createRadioElement("leaflet-base-layers",f),c.layerId=e.stamp(a.layer),e.DomEvent.on(c,"click",this._onInputClick,this);var g=b.createElement("span");g.innerHTML=" "+a.name,d.appendChild(c),d.appendChild(g);var h=a.overlay?this._overlaysList:this._baseLayersList;return h.appendChild(d),d},_onInputClick:function(){var a,b,c,d=this._form.getElementsByTagName("input"),e=d.length;for(this._handlingClick=!0,a=0;e>a;a++)b=d[a],c=this._layers[b.layerId],b.checked&&!this._map.hasLayer(c.layer)?this._map.addLayer(c.layer):!b.checked&&this._map.hasLayer(c.layer)&&this._map.removeLayer(c.layer);this._handlingClick=!1,this._refocusOnMap()},_expand:function(){e.DomUtil.addClass(this._container,"leaflet-control-layers-expanded")},_collapse:function(){this._container.className=this._container.className.replace(" leaflet-control-layers-expanded","")}}),e.control.layers=function(a,b,c){return new e.Control.Layers(a,b,c)},e.PosAnimation=e.Class.extend({includes:e.Mixin.Events,run:function(a,b,c,d){this.stop(),this._el=a,this._inProgress=!0,this._newPos=b,this.fire("start"),a.style[e.DomUtil.TRANSITION]="all "+(c||.25)+"s cubic-bezier(0,0,"+(d||.5)+",1)",e.DomEvent.on(a,e.DomUtil.TRANSITION_END,this._onTransitionEnd,this),e.DomUtil.setPosition(a,b),e.Util.falseFn(a.offsetWidth),this._stepTimer=setInterval(e.bind(this._onStep,this),50)},stop:function(){this._inProgress&&(e.DomUtil.setPosition(this._el,this._getPos()),this._onTransitionEnd(),e.Util.falseFn(this._el.offsetWidth))},_onStep:function(){var a=this._getPos();return a?(this._el._leaflet_pos=a,void this.fire("step")):void this._onTransitionEnd()},_transformRe:/([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,_getPos:function(){var b,c,d,f=this._el,g=a.getComputedStyle(f);if(e.Browser.any3d){if(d=g[e.DomUtil.TRANSFORM].match(this._transformRe),!d)return;b=parseFloat(d[1]),c=parseFloat(d[2])}else b=parseFloat(g.left),c=parseFloat(g.top);return new e.Point(b,c,!0)},_onTransitionEnd:function(){e.DomEvent.off(this._el,e.DomUtil.TRANSITION_END,this._onTransitionEnd,this),this._inProgress&&(this._inProgress=!1,this._el.style[e.DomUtil.TRANSITION]="",this._el._leaflet_pos=this._newPos,clearInterval(this._stepTimer),this.fire("step").fire("end"))}}),e.Map.include({setView:function(a,b,d){if(b=b===c?this._zoom:this._limitZoom(b),a=this._limitCenter(e.latLng(a),b,this.options.maxBounds),d=d||{},this._panAnim&&this._panAnim.stop(),this._loaded&&!d.reset&&d!==!0){d.animate!==c&&(d.zoom=e.extend({animate:d.animate},d.zoom),d.pan=e.extend({animate:d.animate},d.pan));var f=this._zoom!==b?this._tryAnimatedZoom&&this._tryAnimatedZoom(a,b,d.zoom):this._tryAnimatedPan(a,d.pan);if(f)return clearTimeout(this._sizeTimer),this}return this._resetView(a,b),this},panBy:function(a,b){if(a=e.point(a).round(),b=b||{},!a.x&&!a.y)return this;if(this._panAnim||(this._panAnim=new e.PosAnimation,this._panAnim.on({step:this._onPanTransitionStep,end:this._onPanTransitionEnd},this)),b.noMoveStart||this.fire("movestart"),b.animate!==!1){e.DomUtil.addClass(this._mapPane,"leaflet-pan-anim");var c=this._getMapPanePos().subtract(a);this._panAnim.run(this._mapPane,c,b.duration||.25,b.easeLinearity)}else this._rawPanBy(a),this.fire("move").fire("moveend");return this},_onPanTransitionStep:function(){this.fire("move")},_onPanTransitionEnd:function(){e.DomUtil.removeClass(this._mapPane,"leaflet-pan-anim"),this.fire("moveend")},_tryAnimatedPan:function(a,b){var c=this._getCenterOffset(a)._floor();return(b&&b.animate)===!0||this.getSize().contains(c)?(this.panBy(c,b),!0):!1}}),e.PosAnimation=e.DomUtil.TRANSITION?e.PosAnimation:e.PosAnimation.extend({run:function(a,b,c,d){this.stop(),this._el=a,this._inProgress=!0,this._duration=c||.25,this._easeOutPower=1/Math.max(d||.5,.2),this._startPos=e.DomUtil.getPosition(a),this._offset=b.subtract(this._startPos),this._startTime=+new Date,this.fire("start"),this._animate()},stop:function(){this._inProgress&&(this._step(),this._complete())},_animate:function(){this._animId=e.Util.requestAnimFrame(this._animate,this),this._step()},_step:function(){var a=+new Date-this._startTime,b=1e3*this._duration;b>a?this._runFrame(this._easeOut(a/b)):(this._runFrame(1),this._complete())},_runFrame:function(a){var b=this._startPos.add(this._offset.multiplyBy(a));e.DomUtil.setPosition(this._el,b),this.fire("step")},_complete:function(){e.Util.cancelAnimFrame(this._animId),this._inProgress=!1,this.fire("end")},_easeOut:function(a){return 1-Math.pow(1-a,this._easeOutPower)}}),e.Map.mergeOptions({zoomAnimation:!0,zoomAnimationThreshold:4}),e.DomUtil.TRANSITION&&e.Map.addInitHook(function(){this._zoomAnimated=this.options.zoomAnimation&&e.DomUtil.TRANSITION&&e.Browser.any3d&&!e.Browser.android23&&!e.Browser.mobileOpera,this._zoomAnimated&&e.DomEvent.on(this._mapPane,e.DomUtil.TRANSITION_END,this._catchTransitionEnd,this)}),e.Map.include(e.DomUtil.TRANSITION?{_catchTransitionEnd:function(a){this._animatingZoom&&a.propertyName.indexOf("transform")>=0&&this._onZoomTransitionEnd()},_nothingToAnimate:function(){return!this._container.getElementsByClassName("leaflet-zoom-animated").length},_tryAnimatedZoom:function(a,b,c){if(this._animatingZoom)return!0;if(c=c||{},!this._zoomAnimated||c.animate===!1||this._nothingToAnimate()||Math.abs(b-this._zoom)>this.options.zoomAnimationThreshold)return!1;var d=this.getZoomScale(b),e=this._getCenterOffset(a)._divideBy(1-1/d),f=this._getCenterLayerPoint()._add(e);return c.animate===!0||this.getSize().contains(e)?(this.fire("movestart").fire("zoomstart"),this._animateZoom(a,b,f,d,null,!0),!0):!1},_animateZoom:function(a,b,c,d,f,g,h){h||(this._animatingZoom=!0),e.DomUtil.addClass(this._mapPane,"leaflet-zoom-anim"),this._animateToCenter=a,this._animateToZoom=b,e.Draggable&&(e.Draggable._disabled=!0),e.Util.requestAnimFrame(function(){
this.fire("zoomanim",{center:a,zoom:b,origin:c,scale:d,delta:f,backwards:g})},this)},_onZoomTransitionEnd:function(){this._animatingZoom=!1,e.DomUtil.removeClass(this._mapPane,"leaflet-zoom-anim"),this._resetView(this._animateToCenter,this._animateToZoom,!0,!0),e.Draggable&&(e.Draggable._disabled=!1)}}:{}),e.TileLayer.include({_animateZoom:function(a){this._animating||(this._animating=!0,this._prepareBgBuffer());var b=this._bgBuffer,c=e.DomUtil.TRANSFORM,d=a.delta?e.DomUtil.getTranslateString(a.delta):b.style[c],f=e.DomUtil.getScaleString(a.scale,a.origin);b.style[c]=a.backwards?f+" "+d:d+" "+f},_endZoomAnim:function(){var a=this._tileContainer,b=this._bgBuffer;a.style.visibility="",a.parentNode.appendChild(a),e.Util.falseFn(b.offsetWidth),this._animating=!1},_clearBgBuffer:function(){var a=this._map;!a||a._animatingZoom||a.touchZoom._zooming||(this._bgBuffer.innerHTML="",this._bgBuffer.style[e.DomUtil.TRANSFORM]="")},_prepareBgBuffer:function(){var a=this._tileContainer,b=this._bgBuffer,c=this._getLoadedTilesPercentage(b),d=this._getLoadedTilesPercentage(a);return b&&c>.5&&.5>d?(a.style.visibility="hidden",void this._stopLoadingImages(a)):(b.style.visibility="hidden",b.style[e.DomUtil.TRANSFORM]="",this._tileContainer=b,b=this._bgBuffer=a,this._stopLoadingImages(b),void clearTimeout(this._clearBgBufferTimer))},_getLoadedTilesPercentage:function(a){var b,c,d=a.getElementsByTagName("img"),e=0;for(b=0,c=d.length;c>b;b++)d[b].complete&&e++;return e/c},_stopLoadingImages:function(a){var b,c,d,f=Array.prototype.slice.call(a.getElementsByTagName("img"));for(b=0,c=f.length;c>b;b++)d=f[b],d.complete||(d.onload=e.Util.falseFn,d.onerror=e.Util.falseFn,d.src=e.Util.emptyImageUrl,d.parentNode.removeChild(d))}}),e.Map.include({_defaultLocateOptions:{watch:!1,setView:!1,maxZoom:1/0,timeout:1e4,maximumAge:0,enableHighAccuracy:!1},locate:function(a){if(a=this._locateOptions=e.extend(this._defaultLocateOptions,a),!navigator.geolocation)return this._handleGeolocationError({code:0,message:"Geolocation not supported."}),this;var b=e.bind(this._handleGeolocationResponse,this),c=e.bind(this._handleGeolocationError,this);return a.watch?this._locationWatchId=navigator.geolocation.watchPosition(b,c,a):navigator.geolocation.getCurrentPosition(b,c,a),this},stopLocate:function(){return navigator.geolocation&&navigator.geolocation.clearWatch(this._locationWatchId),this._locateOptions&&(this._locateOptions.setView=!1),this},_handleGeolocationError:function(a){var b=a.code,c=a.message||(1===b?"permission denied":2===b?"position unavailable":"timeout");this._locateOptions.setView&&!this._loaded&&this.fitWorld(),this.fire("locationerror",{code:b,message:"Geolocation error: "+c+"."})},_handleGeolocationResponse:function(a){var b=a.coords.latitude,c=a.coords.longitude,d=new e.LatLng(b,c),f=180*a.coords.accuracy/40075017,g=f/Math.cos(e.LatLng.DEG_TO_RAD*b),h=e.latLngBounds([b-f,c-g],[b+f,c+g]),i=this._locateOptions;if(i.setView){var j=Math.min(this.getBoundsZoom(h),i.maxZoom);this.setView(d,j)}var k={latlng:d,bounds:h,timestamp:a.timestamp};for(var l in a.coords)"number"==typeof a.coords[l]&&(k[l]=a.coords[l]);this.fire("locationfound",k)}})}(window,document),function(a){"use strict";var b={},c=function(a){var d,e,f,g,h;c.classes.dispatcher.extend(this);var i=this,j=a||{};if("string"==typeof j||j instanceof HTMLElement?j={renderers:[j]}:"[object Array]"===Object.prototype.toString.call(j)&&(j={renderers:j}),g=j.renderers||j.renderer||j.container,j.renderers&&0!==j.renderers.length||("string"==typeof g||g instanceof HTMLElement||"object"==typeof g&&"container"in g)&&(j.renderers=[g]),j.id){if(b[j.id])throw'sigma: Instance "'+j.id+'" already exists.';Object.defineProperty(this,"id",{value:j.id})}else{for(h=0;b[h];)h++;Object.defineProperty(this,"id",{value:""+h})}for(b[this.id]=this,this.settings=new c.classes.configurable(c.settings,j.settings||{}),Object.defineProperty(this,"graph",{value:new c.classes.graph(this.settings),configurable:!0}),Object.defineProperty(this,"middlewares",{value:[],configurable:!0}),Object.defineProperty(this,"cameras",{value:{},configurable:!0}),Object.defineProperty(this,"renderers",{value:{},configurable:!0}),Object.defineProperty(this,"renderersPerCamera",{value:{},configurable:!0}),Object.defineProperty(this,"cameraFrames",{value:{},configurable:!0}),Object.defineProperty(this,"camera",{get:function(){return this.cameras[0]}}),this._handler=function(a){var b,c={};for(b in a.data)c[b]=a.data[b];c.renderer=a.target,this.dispatchEvent(a.type,c)}.bind(this),f=j.renderers||[],d=0,e=f.length;e>d;d++)this.addRenderer(f[d]);for(f=j.middlewares||[],d=0,e=f.length;e>d;d++)this.middlewares.push("string"==typeof f[d]?c.middlewares[f[d]]:f[d]);"object"==typeof j.graph&&j.graph&&(this.graph.read(j.graph),this.refresh()),window.addEventListener("resize",function(){i.settings&&i.refresh()})};if(c.prototype.addCamera=function(b){var d,e=this;if(!arguments.length){for(b=0;this.cameras[""+b];)b++;b=""+b}if(this.cameras[b])throw'sigma.addCamera: The camera "'+b+'" already exists.';return d=new c.classes.camera(b,this.graph,this.settings),this.cameras[b]=d,d.quadtree=new c.classes.quad,c.classes.edgequad!==a&&(d.edgequadtree=new c.classes.edgequad),d.bind("coordinatesUpdated",function(){e.renderCamera(d,d.isAnimated)}),this.renderersPerCamera[b]=[],d},c.prototype.killCamera=function(a){if(a="string"==typeof a?this.cameras[a]:a,!a)throw"sigma.killCamera: The camera is undefined.";var b,c,d=this.renderersPerCamera[a.id];for(c=d.length,b=c-1;b>=0;b--)this.killRenderer(d[b]);return delete this.renderersPerCamera[a.id],delete this.cameraFrames[a.id],delete this.cameras[a.id],a.kill&&a.kill(),this},c.prototype.addRenderer=function(a){var b,d,e,f,g=a||{};if("string"==typeof g?g={container:document.getElementById(g)}:g instanceof HTMLElement&&(g={container:g}),"string"==typeof g.container&&(g.container=document.getElementById(g.container)),"id"in g)b=g.id;else{for(b=0;this.renderers[""+b];)b++;b=""+b}if(this.renderers[b])throw'sigma.addRenderer: The renderer "'+b+'" already exists.';if(d="function"==typeof g.type?g.type:c.renderers[g.type],d=d||c.renderers.def,e="camera"in g?g.camera instanceof c.classes.camera?g.camera:this.cameras[g.camera]||this.addCamera(g.camera):this.addCamera(),this.cameras[e.id]!==e)throw"sigma.addRenderer: The camera is not properly referenced.";return f=new d(this.graph,e,this.settings,g),this.renderers[b]=f,Object.defineProperty(f,"id",{value:b}),f.bind&&f.bind(["click","rightClick","clickStage","doubleClickStage","rightClickStage","clickNode","clickNodes","clickEdge","clickEdges","doubleClickNode","doubleClickNodes","doubleClickEdge","doubleClickEdges","rightClickNode","rightClickNodes","rightClickEdge","rightClickEdges","overNode","overNodes","overEdge","overEdges","outNode","outNodes","outEdge","outEdges","downNode","downNodes","downEdge","downEdges","upNode","upNodes","upEdge","upEdges"],this._handler),this.renderersPerCamera[e.id].push(f),f},c.prototype.killRenderer=function(a){if(a="string"==typeof a?this.renderers[a]:a,!a)throw"sigma.killRenderer: The renderer is undefined.";var b=this.renderersPerCamera[a.camera.id],c=b.indexOf(a);return c>=0&&b.splice(c,1),a.kill&&a.kill(),delete this.renderers[a.id],this},c.prototype.refresh=function(b){var d,e,f,g,h,i,j=0;for(b=b||{},g=this.middlewares||[],d=0,e=g.length;e>d;d++)g[d].call(this,0===d?"":"tmp"+j+":",d===e-1?"ready:":"tmp"+ ++j+":");for(f in this.cameras)h=this.cameras[f],h.settings("autoRescale")&&this.renderersPerCamera[h.id]&&this.renderersPerCamera[h.id].length?c.middlewares.rescale.call(this,g.length?"ready:":"",h.readPrefix,{width:this.renderersPerCamera[h.id][0].width,height:this.renderersPerCamera[h.id][0].height}):c.middlewares.copy.call(this,g.length?"ready:":"",h.readPrefix),b.skipIndexation||(i=c.utils.getBoundaries(this.graph,h.readPrefix),h.quadtree.index(this.graph.nodes(),{prefix:h.readPrefix,bounds:{x:i.minX,y:i.minY,width:i.maxX-i.minX,height:i.maxY-i.minY}}),h.edgequadtree!==a&&h.settings("drawEdges")&&h.settings("enableEdgeHovering")&&h.edgequadtree.index(this.graph,{prefix:h.readPrefix,bounds:{x:i.minX,y:i.minY,width:i.maxX-i.minX,height:i.maxY-i.minY}}));for(g=Object.keys(this.renderers),d=0,e=g.length;e>d;d++)if(this.renderers[g[d]].process)if(this.settings("skipErrors"))try{this.renderers[g[d]].process()}catch(k){console.log('Warning: The renderer "'+g[d]+'" crashed on ".process()"')}else this.renderers[g[d]].process();return this.render(),this},c.prototype.render=function(){var a,b,c;for(c=Object.keys(this.renderers),a=0,b=c.length;b>a;a++)if(this.settings("skipErrors"))try{this.renderers[c[a]].render()}catch(d){this.settings("verbose")&&console.log('Warning: The renderer "'+c[a]+'" crashed on ".render()"')}else this.renderers[c[a]].render();return this},c.prototype.renderCamera=function(a,b){var c,d,e,f=this;if(b)for(e=this.renderersPerCamera[a.id],c=0,d=e.length;d>c;c++)if(this.settings("skipErrors"))try{e[c].render()}catch(g){this.settings("verbose")&&console.log('Warning: The renderer "'+e[c].id+'" crashed on ".render()"')}else e[c].render();else if(!this.cameraFrames[a.id]){for(e=this.renderersPerCamera[a.id],c=0,d=e.length;d>c;c++)if(this.settings("skipErrors"))try{e[c].render()}catch(g){this.settings("verbose")&&console.log('Warning: The renderer "'+e[c].id+'" crashed on ".render()"')}else e[c].render();this.cameraFrames[a.id]=requestAnimationFrame(function(){delete f.cameraFrames[a.id]})}return this},c.prototype.kill=function(){var a;this.dispatchEvent("kill"),this.graph.kill(),delete this.middlewares;for(a in this.renderers)this.killRenderer(this.renderers[a]);for(a in this.cameras)this.killCamera(this.cameras[a]);delete this.renderers,delete this.cameras;for(a in this)this.hasOwnProperty(a)&&delete this[a];delete b[this.id]},c.instances=function(a){return arguments.length?b[a]:c.utils.extend({},b)},c.version="1.0.3","undefined"!=typeof this.sigma)throw"An object called sigma is already in the global scope.";this.sigma=c}.call(this),function(a){"use strict";function b(a,c){var d,e,f,g;if(arguments.length)if(1===arguments.length&&Object(arguments[0])===arguments[0])for(a in arguments[0])b(a,arguments[0][a]);else if(arguments.length>1)for(g=Array.isArray(a)?a:a.split(/ /),d=0,e=g.length;d!==e;d+=1)f=g[d],C[f]||(C[f]=[]),C[f].push({handler:c})}function c(a,b){var c,d,e,f,g,h,i=Array.isArray(a)?a:a.split(/ /);if(arguments.length)if(b)for(c=0,d=i.length;c!==d;c+=1){if(h=i[c],C[h]){for(g=[],e=0,f=C[h].length;e!==f;e+=1)C[h][e].handler!==b&&g.push(C[h][e]);C[h]=g}C[h]&&0===C[h].length&&delete C[h]}else for(c=0,d=i.length;c!==d;c+=1)delete C[i[c]];else C=Object.create(null)}function d(a,b){var c,d,e,f,g,h,i=Array.isArray(a)?a:a.split(/ /);for(b=void 0===b?{}:b,c=0,e=i.length;c!==e;c+=1)if(h=i[c],C[h])for(g={type:h,data:b||{}},d=0,f=C[h].length;d!==f;d+=1)try{C[h][d].handler(g)}catch(j){}}function e(){var a,b,c,d,e=!1,f=s(),g=x.shift();if(c=g.job(),f=s()-f,g.done++,g.time+=f,g.currentTime+=f,g.weightTime=g.currentTime/(g.weight||1),g.averageTime=g.time/g.done,d=g.count?g.count<=g.done:!c,!d){for(a=0,b=x.length;b>a;a++)if(x[a].weightTime>g.weightTime){x.splice(a,0,g),e=!0;break}e||x.push(g)}return d?g:null}function f(a){var b=x.length;w[a.id]=a,a.status="running",b&&(a.weightTime=x[b-1].weightTime,a.currentTime=a.weightTime*(a.weight||1)),a.startTime=s(),d("jobStarted",q(a)),x.push(a)}function g(){var a,b,c;for(a in v)b=v[a],b.after?y[a]=b:f(b),delete v[a];for(u=!!x.length;x.length&&s()-t<B.frameDuration;)if(c=e()){i(c.id);for(a in y)y[a].after===c.id&&(f(y[a]),delete y[a])}u?(t=s(),d("enterFrame"),setTimeout(g,0)):d("stop")}function h(a,b){var c,e,f;if(Array.isArray(a)){for(A=!0,c=0,e=a.length;e>c;c++)h(a[c].id,p(a[c],b));A=!1,u||(t=s(),d("start"),g())}else if("object"==typeof a)if("string"==typeof a.id)h(a.id,a);else{A=!0;for(c in a)"function"==typeof a[c]?h(c,p({job:a[c]},b)):h(c,p(a[c],b));A=!1,u||(t=s(),d("start"),g())}else{if("string"!=typeof a)throw new Error("[conrad.addJob] Wrong arguments.");if(k(a))throw new Error('[conrad.addJob] Job with id "'+a+'" already exists.');if("function"==typeof b)f={id:a,done:0,time:0,status:"waiting",currentTime:0,averageTime:0,weightTime:0,job:b};else{if("object"!=typeof b)throw new Error("[conrad.addJob] Wrong arguments.");f=p({id:a,done:0,time:0,status:"waiting",currentTime:0,averageTime:0,weightTime:0},b)}v[a]=f,d("jobAdded",q(f)),u||A||(t=s(),d("start"),g())}return this}function i(a){var b,c,e,f,g=!1;if(Array.isArray(a))for(b=0,c=a.length;c>b;b++)i(a[b]);else{if("string"!=typeof a)throw new Error("[conrad.killJob] Wrong arguments.");for(e=[w,y,v],b=0,c=e.length;c>b;b++)a in e[b]&&(f=e[b][a],B.history&&(f.status="done",z.push(f)),d("jobEnded",q(f)),delete e[b][a],"function"==typeof f.end&&f.end(),g=!0);for(e=x,b=0,c=e.length;c>b;b++)if(e[b].id===a){e.splice(b,1);break}if(!g)throw new Error('[conrad.killJob] Job "'+a+'" not found.')}return this}function j(){var a,b=p(v,w,y);if(B.history)for(a in b)b[a].status="done",z.push(b[a]),"function"==typeof b[a].end&&b[a].end();return v={},y={},w={},x=[],u=!1,this}function k(a){var b=v[a]||w[a]||y[a];return b?p(b):null}function l(){var a;if("string"==typeof a1&&1===arguments.length)return B[a1];a="object"==typeof a1&&1===arguments.length?a1||{}:{},"string"==typeof a1&&(a[a1]=a2);for(var b in a)void 0!==a[b]?B[b]=a[b]:delete B[b];return this}function m(){return u}function n(){return z=[],this}function o(a,b){var c,d,e,f,g,h,i;if(!arguments.length){g=[];for(d in v)g.push(v[d]);for(d in y)g.push(y[d]);for(d in w)g.push(w[d]);g=g.concat(z)}if("string"==typeof a)switch(a){case"waiting":g=r(y);break;case"running":g=r(w);break;case"done":g=z;break;default:h=a}if(a instanceof RegExp&&(h=a),!h&&("string"==typeof b||b instanceof RegExp)&&(h=b),h){if(i="string"==typeof h,g instanceof Array)c=g;else if("object"==typeof g){c=[];for(d in g)c=c.concat(g[d])}else{c=[];for(d in v)c.push(v[d]);for(d in y)c.push(y[d]);for(d in w)c.push(w[d]);c=c.concat(z)}for(g=[],e=0,f=c.length;f>e;e++)(i?c[e].id===h:c[e].id.match(h))&&g.push(c[e])}return q(g)}function p(){var a,b,c={},d=arguments.length;for(a=d-1;a>=0;a--)for(b in arguments[a])c[b]=arguments[a][b];return c}function q(a){var b,c,d;if(!a)return a;if(Array.isArray(a))for(b=[],c=0,d=a.length;d>c;c++)b.push(q(a[c]));else if("object"==typeof a){b={};for(c in a)b[c]=q(a[c])}else b=a;return b}function r(a){var b,c=[];for(b in a)c.push(a[b]);return c}function s(){return Date.now?Date.now():(new Date).getTime()}if(a.conrad)throw new Error("conrad already exists");var t,u=!1,v={},w={},x=[],y={},z=[],A=!1,B={frameDuration:20,history:!0},C=Object.create(null);Array.isArray||(Array.isArray=function(a){return"[object Array]"===Object.prototype.toString.call(a)});var D={hasJob:k,addJob:h,killJob:i,killAll:j,settings:l,getStats:o,isRunning:m,clearHistory:n,bind:b,unbind:c,version:"0.1.0"};"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(exports=module.exports=D),exports.conrad=D),a.conrad=D}(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";var b=this;sigma.utils=sigma.utils||{},sigma.utils.extend=function(){var a,b,c={},d=arguments.length;for(a=d-1;a>=0;a--)for(b in arguments[a])c[b]=arguments[a][b];return c},sigma.utils.dateNow=function(){return Date.now?Date.now():(new Date).getTime()},sigma.utils.pkg=function(a){return(a||"").split(".").reduce(function(a,b){return b in a?a[b]:a[b]={}},b)},sigma.utils.id=function(){var a=0;return function(){return++a}}(),sigma.utils.floatColor=function(a){var b=[0,0,0];return a.match(/^#/)?(a=(a||"").replace(/^#/,""),b=3===a.length?[parseInt(a.charAt(0)+a.charAt(0),16),parseInt(a.charAt(1)+a.charAt(1),16),parseInt(a.charAt(2)+a.charAt(2),16)]:[parseInt(a.charAt(0)+a.charAt(1),16),parseInt(a.charAt(2)+a.charAt(3),16),parseInt(a.charAt(4)+a.charAt(5),16)]):a.match(/^ *rgba? *\(/)&&(a=a.match(/^ *rgba? *\( *([0-9]*) *, *([0-9]*) *, *([0-9]*) *(,.*)?\) *$/),b=[+a[1],+a[2],+a[3]]),256*b[0]*256+256*b[1]+b[2]},sigma.utils.zoomTo=function(a,b,c,d,e){var f,g,h,i=a.settings;g=Math.max(i("zoomMin"),Math.min(i("zoomMax"),a.ratio*d)),g!==a.ratio&&(d=g/a.ratio,h={x:b*(1-d)+a.x,y:c*(1-d)+a.y,ratio:g},e&&e.duration?(f=sigma.misc.animation.killAll(a),e=sigma.utils.extend(e,{easing:f?"quadraticOut":"quadraticInOut"}),sigma.misc.animation.camera(a,h,e)):(a.goTo(h),e&&e.onComplete&&e.onComplete()))},sigma.utils.getQuadraticControlPoint=function(a,b,c,d){return{x:(a+c)/2+(d-b)/4,y:(b+d)/2+(a-c)/4}},sigma.utils.getPointOnQuadraticCurve=function(a,b,c,d,e,f,g){return{x:Math.pow(1-a,2)*b+2*(1-a)*a*f+Math.pow(a,2)*d,y:Math.pow(1-a,2)*c+2*(1-a)*a*g+Math.pow(a,2)*e}},sigma.utils.getPointOnBezierCurve=function(a,b,c,d,e,f,g,h,i){var j=Math.pow(1-a,3),k=3*a*Math.pow(1-a,2),l=3*Math.pow(a,2)*(1-a),m=Math.pow(a,3);return{x:j*b+k*f+l*h+m*d,y:j*c+k*g+l*i+m*e}},sigma.utils.getSelfLoopControlPoints=function(a,b,c){return{x1:a-7*c,y1:b,x2:a,y2:b+7*c}},sigma.utils.getDistance=function(a,b,c,d){return Math.sqrt(Math.pow(c-a,2)+Math.pow(d-b,2))},sigma.utils.getCircleIntersection=function(a,b,c,d,e,f){var g,h,i,j,k,l,m,n,o;if(h=d-a,i=e-b,j=Math.sqrt(i*i+h*h),j>c+f)return!1;if(j<Math.abs(c-f))return!1;g=(c*c-f*f+j*j)/(2*j),n=a+h*g/j,o=b+i*g/j,k=Math.sqrt(c*c-g*g),l=-i*(k/j),m=h*(k/j);var p=n+l,q=n-l,r=o+m,s=o-m;return{xi:p,xi_prime:q,yi:r,yi_prime:s}},sigma.utils.isPointOnSegment=function(a,b,c,d,e,f,g){var h=Math.abs((b-d)*(e-c)-(a-c)*(f-d)),i=sigma.utils.getDistance(c,d,e,f),j=h/i;return g>j&&Math.min(c,e)<=a&&a<=Math.max(c,e)&&Math.min(d,f)<=b&&b<=Math.max(d,f)},sigma.utils.isPointOnQuadraticCurve=function(a,b,c,d,e,f,g,h,i){var j=sigma.utils.getDistance(c,d,e,f);if(Math.abs(a-c)>j||Math.abs(b-d)>j)return!1;for(var k,l=sigma.utils.getDistance(a,b,c,d),m=sigma.utils.getDistance(a,b,e,f),n=.5,o=m>l?-.01:.01,p=.001,q=100,r=sigma.utils.getPointOnQuadraticCurve(n,c,d,e,f,g,h),s=sigma.utils.getDistance(a,b,r.x,r.y);q-->0&&n>=0&&1>=n&&s>i&&(o>p||-p>o);)k=s,r=sigma.utils.getPointOnQuadraticCurve(n,c,d,e,f,g,h),s=sigma.utils.getDistance(a,b,r.x,r.y),s>k?(o=-o/2,n+=o):0>n+o||n+o>1?(o/=2,s=k):n+=o;return i>s},sigma.utils.isPointOnBezierCurve=function(a,b,c,d,e,f,g,h,i,j,k){var l=sigma.utils.getDistance(c,d,g,h);if(Math.abs(a-c)>l||Math.abs(b-d)>l)return!1;for(var m,n=sigma.utils.getDistance(a,b,c,d),o=sigma.utils.getDistance(a,b,e,f),p=.5,q=o>n?-.01:.01,r=.001,s=100,t=sigma.utils.getPointOnBezierCurve(p,c,d,e,f,g,h,i,j),u=sigma.utils.getDistance(a,b,t.x,t.y);s-->0&&p>=0&&1>=p&&u>k&&(q>r||-r>q);)m=u,t=sigma.utils.getPointOnBezierCurve(p,c,d,e,f,g,h,i,j),u=sigma.utils.getDistance(a,b,t.x,t.y),u>m?(q=-q/2,p+=q):0>p+q||p+q>1?(q/=2,u=m):p+=q;return k>u},sigma.utils.getX=function(b){return b.offsetX!==a&&b.offsetX||b.layerX!==a&&b.layerX||b.clientX!==a&&b.clientX},sigma.utils.getY=function(b){return b.offsetY!==a&&b.offsetY||b.layerY!==a&&b.layerY||b.clientY!==a&&b.clientY},sigma.utils.getDelta=function(b){return b.wheelDelta!==a&&b.wheelDelta||b.detail!==a&&-b.detail},sigma.utils.getOffset=function(a){for(var b=0,c=0;a;)c+=parseInt(a.offsetTop),b+=parseInt(a.offsetLeft),a=a.offsetParent;return{top:c,left:b}},sigma.utils.doubleClick=function(a,b,c){var d,e=0;a._doubleClickHandler=a._doubleClickHandler||{},a._doubleClickHandler[b]=a._doubleClickHandler[b]||[],d=a._doubleClickHandler[b],d.push(function(a){return e++,2===e?(e=0,c(a)):void(1===e&&setTimeout(function(){e=0},sigma.settings.doubleClickTimeout))}),a.addEventListener(b,d[d.length-1],!1)},sigma.utils.unbindDoubleClick=function(a,b){for(var c,d=(a._doubleClickHandler||{})[b]||[];c=d.pop();)a.removeEventListener(b,c);delete(a._doubleClickHandler||{})[b]},sigma.utils.easings=sigma.utils.easings||{},sigma.utils.easings.linearNone=function(a){return a},sigma.utils.easings.quadraticIn=function(a){return a*a},sigma.utils.easings.quadraticOut=function(a){return a*(2-a)},sigma.utils.easings.quadraticInOut=function(a){return(a*=2)<1?.5*a*a:-.5*(--a*(a-2)-1)},sigma.utils.easings.cubicIn=function(a){return a*a*a},sigma.utils.easings.cubicOut=function(a){return--a*a*a+1},sigma.utils.easings.cubicInOut=function(a){return(a*=2)<1?.5*a*a*a:.5*((a-=2)*a*a+2)},sigma.utils.loadShader=function(a,b,c,d){var e,f=a.createShader(c);return a.shaderSource(f,b),a.compileShader(f),e=a.getShaderParameter(f,a.COMPILE_STATUS),e?f:(d&&d('Error compiling shader "'+f+'":'+a.getShaderInfoLog(f)),a.deleteShader(f),null)},sigma.utils.loadProgram=function(a,b,c,d,e){var f,g,h=a.createProgram();for(f=0;f<b.length;++f)a.attachShader(h,b[f]);if(c)for(f=0;f<c.length;++f)a.bindAttribLocation(h,locations?locations[f]:f,opt_attribs[f]);return a.linkProgram(h),g=a.getProgramParameter(h,a.LINK_STATUS),g?h:(e&&e("Error in program linking: "+a.getProgramInfoLog(h)),a.deleteProgram(h),null)},sigma.utils.pkg("sigma.utils.matrices"),sigma.utils.matrices.translation=function(a,b){return[1,0,0,0,1,0,a,b,1]},sigma.utils.matrices.rotation=function(a,b){var c=Math.cos(a),d=Math.sin(a);return b?[c,-d,d,c]:[c,-d,0,d,c,0,0,0,1]},sigma.utils.matrices.scale=function(a,b){return b?[a,0,0,a]:[a,0,0,0,a,0,0,0,1]},sigma.utils.matrices.multiply=function(a,b,c){var d=c?2:3,e=a[0*d+0],f=a[0*d+1],g=a[0*d+2],h=a[1*d+0],i=a[1*d+1],j=a[1*d+2],k=a[2*d+0],l=a[2*d+1],m=a[2*d+2],n=b[0*d+0],o=b[0*d+1],p=b[0*d+2],q=b[1*d+0],r=b[1*d+1],s=b[1*d+2],t=b[2*d+0],u=b[2*d+1],v=b[2*d+2];return c?[e*n+f*q,e*o+f*r,h*n+i*q,h*o+i*r]:[e*n+f*q+g*t,e*o+f*r+g*u,e*p+f*s+g*v,h*n+i*q+j*t,h*o+i*r+j*u,h*p+i*s+j*v,k*n+l*q+m*t,k*o+l*r+m*u,k*p+l*s+m*v]}}.call(this),function(a){"use strict";var b,c=0,d=["ms","moz","webkit","o"];for(b=0;b<d.length&&!a.requestAnimationFrame;b++)a.requestAnimationFrame=a[d[b]+"RequestAnimationFrame"],a.cancelAnimationFrame=a[d[b]+"CancelAnimationFrame"]||a[d[b]+"CancelRequestAnimationFrame"];a.requestAnimationFrame||(a.requestAnimationFrame=function(b){var d=(new Date).getTime(),e=Math.max(0,16-(d-c)),f=a.setTimeout(function(){b(d+e)},e);return c=d+e,f}),a.cancelAnimationFrame||(a.cancelAnimationFrame=function(a){clearTimeout(a)}),Function.prototype.bind||(Function.prototype.bind=function(a){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b,c,d=Array.prototype.slice.call(arguments,1),e=this;return b=function(){},c=function(){return e.apply(this instanceof b&&a?this:a,d.concat(Array.prototype.slice.call(arguments)))},b.prototype=this.prototype,c.prototype=new b,c})}(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.settings");var a={clone:!0,immutable:!0,verbose:!1,defaultNodeType:"def",defaultEdgeType:"def",defaultLabelColor:"#000",defaultEdgeColor:"#000",defaultNodeColor:"#000",defaultLabelSize:14,edgeColor:"source",minArrowSize:0,font:"arial",fontStyle:"",labelColor:"default",labelSize:"fixed",labelSizeRatio:1,labelThreshold:8,webglOversamplingRatio:2,borderSize:0,defaultNodeBorderColor:"#000",hoverFont:"",singleHover:!1,hoverFontStyle:"",labelHoverShadow:"default",labelHoverShadowColor:"#000",nodeHoverColor:"node",defaultNodeHoverColor:"#000",labelHoverBGColor:"default",defaultHoverLabelBGColor:"#fff",labelHoverColor:"default",defaultLabelHoverColor:"#000",edgeHoverColor:"edge",edgeHoverSizeRatio:1,defaultEdgeHoverColor:"#000",edgeHoverExtremities:!1,drawEdges:!0,drawNodes:!0,drawLabels:!0,drawEdgeLabels:!1,batchEdgesDrawing:!1,hideEdgesOnMove:!1,canvasEdgesBatchSize:500,webglEdgesBatchSize:1e3,scalingMode:"inside",sideMargin:0,minEdgeSize:.5,maxEdgeSize:1,minNodeSize:1,maxNodeSize:8,touchEnabled:!0,mouseEnabled:!0,mouseWheelEnabled:!0,doubleClickEnabled:!0,eventsEnabled:!0,zoomingRatio:1.7,doubleClickZoomingRatio:2.2,zoomMin:.0625,zoomMax:2,mouseZoomDuration:200,doubleClickZoomDuration:200,mouseInertiaDuration:200,mouseInertiaRatio:3,touchInertiaDuration:200,touchInertiaRatio:3,doubleClickTimeout:300,doubleTapTimeout:300,dragTimeout:200,autoResize:!0,autoRescale:!0,enableCamera:!0,enableHovering:!0,enableEdgeHovering:!1,edgeHoverPrecision:5,rescaleIgnoreSize:!1,skipErrors:!1,nodesPowRatio:.5,edgesPowRatio:.5,animationsTime:200};sigma.settings=sigma.utils.extend(sigma.settings||{},a)}.call(this),function(){"use strict";var a=function(){Object.defineProperty(this,"_handlers",{value:{}})};a.prototype.bind=function(a,b){var c,d,e,f;if(1===arguments.length&&"object"==typeof arguments[0])for(a in arguments[0])this.bind(a,arguments[0][a]);else{if(2!==arguments.length||"function"!=typeof arguments[1])throw"bind: Wrong arguments.";for(f="string"==typeof a?a.split(" "):a,c=0,d=f.length;c!==d;c+=1)e=f[c],e&&(this._handlers[e]||(this._handlers[e]=[]),this._handlers[e].push({handler:b}))}return this},a.prototype.unbind=function(a,b){var c,d,e,f,g,h,i,j="string"==typeof a?a.split(" "):a;if(!arguments.length){for(g in this._handlers)delete this._handlers[g];return this}if(b)for(c=0,d=j.length;c!==d;c+=1){if(i=j[c],this._handlers[i]){for(h=[],e=0,f=this._handlers[i].length;e!==f;e+=1)this._handlers[i][e].handler!==b&&h.push(this._handlers[i][e]);this._handlers[i]=h}this._handlers[i]&&0===this._handlers[i].length&&delete this._handlers[i]}else for(c=0,d=j.length;c!==d;c+=1)delete this._handlers[j[c]];return this},a.prototype.dispatchEvent=function(a,b){var c,d,e,f,g,h,i,j=this,k="string"==typeof a?a.split(" "):a;for(b=void 0===b?{}:b,c=0,d=k.length;c!==d;c+=1)if(i=k[c],this._handlers[i]){for(h=j.getEvent(i,b),g=[],e=0,f=this._handlers[i].length;e!==f;e+=1)this._handlers[i][e].handler(h),this._handlers[i][e].one||g.push(this._handlers[i][e]);this._handlers[i]=g}return this},a.prototype.getEvent=function(a,b){return{type:a,data:b||{},target:this}},a.extend=function(b,c){var d;for(d in a.prototype)a.prototype.hasOwnProperty(d)&&(b[d]=a.prototype[d]);a.apply(b,c)},"undefined"!=typeof this.sigma?(this.sigma.classes=this.sigma.classes||{},this.sigma.classes.dispatcher=a):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=a),exports.dispatcher=a):this.dispatcher=a}.call(this),function(){"use strict";var a=function(){var b,c,d={},e=Array.prototype.slice.call(arguments,0),f=function(a,g){var h,i;if(1===arguments.length&&"string"==typeof a){if(a in d&&void 0!==d[a])return d[a];for(b=0,c=e.length;c>b;b++)if(a in e[b]&&void 0!==e[b][a])return e[b][a];return void 0}if("object"==typeof a&&"string"==typeof g)return g in(a||{})?a[g]:f(g);h="object"==typeof a&&void 0===g?a:{},"string"==typeof a&&(h[a]=g);for(i in h)d[i]=h[i];return this};for(f.embedObjects=function(){var b=e.concat(d).concat(Array.prototype.splice.call(arguments,0));return a.apply({},b)},b=0,c=arguments.length;c>b;b++)f(arguments[b]);return f};"undefined"!=typeof this.sigma?(this.sigma.classes=this.sigma.classes||{},this.sigma.classes.configurable=a):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=a),exports.configurable=a):this.configurable=a}.call(this),function(){"use strict";function a(a,b,c){var d=function(){var d,e;for(d in g[a])g[a][d].apply(b,arguments);e=c.apply(b,arguments);for(d in f[a])f[a][d].apply(b,arguments);return e};return d}function b(a){var b;for(b in a)"hasOwnProperty"in a&&!a.hasOwnProperty(b)||delete a[b];return a}var c=Object.create(null),d=Object.create(null),e=Object.create(null),f=Object.create(null),g=Object.create(null),h={immutable:!0,clone:!0},i=function(a){return h[a]},j=function(b){var d,f,g;g={settings:b||i,nodesArray:[],edgesArray:[],nodesIndex:Object.create(null),edgesIndex:Object.create(null),inNeighborsIndex:Object.create(null),outNeighborsIndex:Object.create(null),allNeighborsIndex:Object.create(null),inNeighborsCount:Object.create(null),outNeighborsCount:Object.create(null),allNeighborsCount:Object.create(null)};for(d in e)e[d].call(g);for(d in c)f=a(d,g,c[d]),this[d]=f,g[d]=f};j.addMethod=function(a,b){if("string"!=typeof a||"function"!=typeof b||2!==arguments.length)throw"addMethod: Wrong arguments.";if(c[a]||j[a])throw'The method "'+a+'" already exists.';return c[a]=b,f[a]=Object.create(null),g[a]=Object.create(null),this},j.hasMethod=function(a){return!(!c[a]&&!j[a])},j.attach=function(a,b,c,d){if("string"!=typeof a||"string"!=typeof b||"function"!=typeof c||arguments.length<3||arguments.length>4)throw"attach: Wrong arguments.";var h;if("constructor"===a)h=e;else if(d){if(!g[a])throw'The method "'+a+'" does not exist.';h=g[a]}else{if(!f[a])throw'The method "'+a+'" does not exist.';h=f[a]}if(h[b])throw'A function "'+b+'" is already attached to the method "'+a+'".';return h[b]=c,this},j.attachBefore=function(a,b,c){return this.attach(a,b,c,!0)},j.addIndex=function(a,b){if("string"!=typeof a||Object(b)!==b||2!==arguments.length)throw"addIndex: Wrong arguments.";if(d[a])throw'The index "'+a+'" already exists.';var c;d[a]=b;for(c in b){if("function"!=typeof b[c])throw"The bindings must be functions.";j.attach(c,a,b[c])}return this},j.addMethod("addNode",function(a){if(Object(a)!==a||1!==arguments.length)throw"addNode: Wrong arguments.";if("string"!=typeof a.id&&"number"!=typeof a.id)throw"The node must have a string or number id.";if(this.nodesIndex[a.id])throw'The node "'+a.id+'" already exists.';var b,c=a.id,d=Object.create(null);if(this.settings("clone"))for(b in a)"id"!==b&&(d[b]=a[b]);else d=a;return this.settings("immutable")?Object.defineProperty(d,"id",{value:c,enumerable:!0}):d.id=c,this.inNeighborsIndex[c]=Object.create(null),this.outNeighborsIndex[c]=Object.create(null),this.allNeighborsIndex[c]=Object.create(null),this.inNeighborsCount[c]=0,this.outNeighborsCount[c]=0,this.allNeighborsCount[c]=0,this.nodesArray.push(d),this.nodesIndex[d.id]=d,this}),j.addMethod("addEdge",function(a){if(Object(a)!==a||1!==arguments.length)throw"addEdge: Wrong arguments.";if("string"!=typeof a.id&&"number"!=typeof a.id)throw"The edge must have a string or number id.";if("string"!=typeof a.source&&"number"!=typeof a.source||!this.nodesIndex[a.source])throw"The edge source must have an existing node id.";if("string"!=typeof a.target&&"number"!=typeof a.target||!this.nodesIndex[a.target])throw"The edge target must have an existing node id.";if(this.edgesIndex[a.id])throw'The edge "'+a.id+'" already exists.';var b,c=Object.create(null);if(this.settings("clone"))for(b in a)"id"!==b&&"source"!==b&&"target"!==b&&(c[b]=a[b]);else c=a;return this.settings("immutable")?(Object.defineProperty(c,"id",{value:a.id,enumerable:!0}),Object.defineProperty(c,"source",{value:a.source,enumerable:!0}),Object.defineProperty(c,"target",{value:a.target,enumerable:!0})):(c.id=a.id,c.source=a.source,c.target=a.target),this.edgesArray.push(c),this.edgesIndex[c.id]=c,this.inNeighborsIndex[c.target][c.source]||(this.inNeighborsIndex[c.target][c.source]=Object.create(null)),this.inNeighborsIndex[c.target][c.source][c.id]=c,this.outNeighborsIndex[c.source][c.target]||(this.outNeighborsIndex[c.source][c.target]=Object.create(null)),this.outNeighborsIndex[c.source][c.target][c.id]=c,this.allNeighborsIndex[c.source][c.target]||(this.allNeighborsIndex[c.source][c.target]=Object.create(null)),this.allNeighborsIndex[c.source][c.target][c.id]=c,c.target!==c.source&&(this.allNeighborsIndex[c.target][c.source]||(this.allNeighborsIndex[c.target][c.source]=Object.create(null)),this.allNeighborsIndex[c.target][c.source][c.id]=c),this.inNeighborsCount[c.target]++,this.outNeighborsCount[c.source]++,this.allNeighborsCount[c.target]++,this.allNeighborsCount[c.source]++,this}),j.addMethod("dropNode",function(a){if("string"!=typeof a&&"number"!=typeof a||1!==arguments.length)throw"dropNode: Wrong arguments.";if(!this.nodesIndex[a])throw'The node "'+a+'" does not exist.';var b,c,d;for(delete this.nodesIndex[a],b=0,d=this.nodesArray.length;d>b;b++)if(this.nodesArray[b].id===a){this.nodesArray.splice(b,1);break}for(b=this.edgesArray.length-1;b>=0;b--)(this.edgesArray[b].source===a||this.edgesArray[b].target===a)&&this.dropEdge(this.edgesArray[b].id);delete this.inNeighborsIndex[a],delete this.outNeighborsIndex[a],delete this.allNeighborsIndex[a],delete this.inNeighborsCount[a],delete this.outNeighborsCount[a],delete this.allNeighborsCount[a];
for(c in this.nodesIndex)delete this.inNeighborsIndex[c][a],delete this.outNeighborsIndex[c][a],delete this.allNeighborsIndex[c][a];return this}),j.addMethod("dropEdge",function(a){if("string"!=typeof a&&"number"!=typeof a||1!==arguments.length)throw"dropEdge: Wrong arguments.";if(!this.edgesIndex[a])throw'The edge "'+a+'" does not exist.';var b,c,d;for(d=this.edgesIndex[a],delete this.edgesIndex[a],b=0,c=this.edgesArray.length;c>b;b++)if(this.edgesArray[b].id===a){this.edgesArray.splice(b,1);break}return delete this.inNeighborsIndex[d.target][d.source][d.id],Object.keys(this.inNeighborsIndex[d.target][d.source]).length||delete this.inNeighborsIndex[d.target][d.source],delete this.outNeighborsIndex[d.source][d.target][d.id],Object.keys(this.outNeighborsIndex[d.source][d.target]).length||delete this.outNeighborsIndex[d.source][d.target],delete this.allNeighborsIndex[d.source][d.target][d.id],Object.keys(this.allNeighborsIndex[d.source][d.target]).length||delete this.allNeighborsIndex[d.source][d.target],d.target!==d.source&&(delete this.allNeighborsIndex[d.target][d.source][d.id],Object.keys(this.allNeighborsIndex[d.target][d.source]).length||delete this.allNeighborsIndex[d.target][d.source]),this.inNeighborsCount[d.target]--,this.outNeighborsCount[d.source]--,this.allNeighborsCount[d.source]--,this.allNeighborsCount[d.target]--,this}),j.addMethod("kill",function(){this.nodesArray.length=0,this.edgesArray.length=0,delete this.nodesArray,delete this.edgesArray,delete this.nodesIndex,delete this.edgesIndex,delete this.inNeighborsIndex,delete this.outNeighborsIndex,delete this.allNeighborsIndex,delete this.inNeighborsCount,delete this.outNeighborsCount,delete this.allNeighborsCount}),j.addMethod("clear",function(){return this.nodesArray.length=0,this.edgesArray.length=0,b(this.nodesIndex),b(this.edgesIndex),b(this.nodesIndex),b(this.inNeighborsIndex),b(this.outNeighborsIndex),b(this.allNeighborsIndex),b(this.inNeighborsCount),b(this.outNeighborsCount),b(this.allNeighborsCount),this}),j.addMethod("read",function(a){var b,c,d;for(c=a.nodes||[],b=0,d=c.length;d>b;b++)this.addNode(c[b]);for(c=a.edges||[],b=0,d=c.length;d>b;b++)this.addEdge(c[b]);return this}),j.addMethod("nodes",function(a){if(!arguments.length)return this.nodesArray.slice(0);if(1===arguments.length&&("string"==typeof a||"number"==typeof a))return this.nodesIndex[a];if(1===arguments.length&&"[object Array]"===Object.prototype.toString.call(a)){var b,c,d=[];for(b=0,c=a.length;c>b;b++){if("string"!=typeof a[b]&&"number"!=typeof a[b])throw"nodes: Wrong arguments.";d.push(this.nodesIndex[a[b]])}return d}throw"nodes: Wrong arguments."}),j.addMethod("degree",function(a,b){if(b={"in":this.inNeighborsCount,out:this.outNeighborsCount}[b||""]||this.allNeighborsCount,"string"==typeof a||"number"==typeof a)return b[a];if("[object Array]"===Object.prototype.toString.call(a)){var c,d,e=[];for(c=0,d=a.length;d>c;c++){if("string"!=typeof a[c]&&"number"!=typeof a[c])throw"degree: Wrong arguments.";e.push(b[a[c]])}return e}throw"degree: Wrong arguments."}),j.addMethod("edges",function(a){if(!arguments.length)return this.edgesArray.slice(0);if(1===arguments.length&&("string"==typeof a||"number"==typeof a))return this.edgesIndex[a];if(1===arguments.length&&"[object Array]"===Object.prototype.toString.call(a)){var b,c,d=[];for(b=0,c=a.length;c>b;b++){if("string"!=typeof a[b]&&"number"!=typeof a[b])throw"edges: Wrong arguments.";d.push(this.edgesIndex[a[b]])}return d}throw"edges: Wrong arguments."}),"undefined"!=typeof sigma?(sigma.classes=sigma.classes||Object.create(null),sigma.classes.graph=j):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports.graph=j):this.graph=j}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.classes"),sigma.classes.camera=function(a,b,c,d){sigma.classes.dispatcher.extend(this),Object.defineProperty(this,"graph",{value:b}),Object.defineProperty(this,"id",{value:a}),Object.defineProperty(this,"readPrefix",{value:"read_cam"+a+":"}),Object.defineProperty(this,"prefix",{value:"cam"+a+":"}),this.x=0,this.y=0,this.ratio=1,this.angle=0,this.isAnimated=!1,this.settings="object"==typeof d&&d?c.embedObject(d):c},sigma.classes.camera.prototype.goTo=function(b){if(!this.settings("enableCamera"))return this;var c,d,e=b||{},f=["x","y","ratio","angle"];for(c=0,d=f.length;d>c;c++)if(e[f[c]]!==a){if("number"!=typeof e[f[c]]||isNaN(e[f[c]]))throw'Value for "'+f[c]+'" is not a number.';this[f[c]]=e[f[c]]}return this.dispatchEvent("coordinatesUpdated"),this},sigma.classes.camera.prototype.applyView=function(b,c,d){d=d||{},c=c!==a?c:this.prefix,b=b!==a?b:this.readPrefix;var e,f,g,h=d.nodes||this.graph.nodes(),i=d.edges||this.graph.edges(),j=Math.cos(this.angle),k=Math.sin(this.angle);for(e=0,f=h.length;f>e;e++)g=h[e],g[c+"x"]=(((g[b+"x"]||0)-this.x)*j+((g[b+"y"]||0)-this.y)*k)/this.ratio+(d.width||0)/2,g[c+"y"]=(((g[b+"y"]||0)-this.y)*j-((g[b+"x"]||0)-this.x)*k)/this.ratio+(d.height||0)/2,g[c+"size"]=(g[b+"size"]||0)/Math.pow(this.ratio,this.settings("nodesPowRatio"));for(e=0,f=i.length;f>e;e++)i[e][c+"size"]=(i[e][b+"size"]||0)/Math.pow(this.ratio,this.settings("edgesPowRatio"));return this},sigma.classes.camera.prototype.graphPosition=function(a,b,c){var d=0,e=0,f=Math.cos(this.angle),g=Math.sin(this.angle);return c||(d=-(this.x*f+this.y*g)/this.ratio,e=-(this.y*f-this.x*g)/this.ratio),{x:(a*f+b*g)/this.ratio+d,y:(b*f-a*g)/this.ratio+e}},sigma.classes.camera.prototype.cameraPosition=function(a,b,c){var d=0,e=0,f=Math.cos(this.angle),g=Math.sin(this.angle);return c||(d=-(this.x*f+this.y*g)/this.ratio,e=-(this.y*f-this.x*g)/this.ratio),{x:((a-d)*f-(b-e)*g)*this.ratio,y:((b-e)*f+(a-d)*g)*this.ratio}},sigma.classes.camera.prototype.getMatrix=function(){var a=sigma.utils.matrices.scale(1/this.ratio),b=sigma.utils.matrices.rotation(this.angle),c=sigma.utils.matrices.translation(-this.x,-this.y),d=sigma.utils.matrices.multiply(c,sigma.utils.matrices.multiply(b,a));return d},sigma.classes.camera.prototype.getRectangle=function(a,b){var c=this.cameraPosition(a,0,!0),d=this.cameraPosition(0,b,!0),e=this.cameraPosition(a/2,b/2,!0),f=this.cameraPosition(a/4,0,!0).x,g=this.cameraPosition(0,b/4,!0).y;return{x1:this.x-e.x-f,y1:this.y-e.y-g,x2:this.x-e.x+f+c.x,y2:this.y-e.y-g+c.y,height:Math.sqrt(Math.pow(d.x,2)+Math.pow(d.y+2*g,2))}}}.call(this),function(a){"use strict";function b(a,b){var c=b.x+b.width/2,d=b.y+b.height/2,e=a.y<d,f=a.x<c;return e?f?0:1:f?2:3}function c(a,b){for(var c=[],d=0;4>d;d++)a.x2>=b[d][0].x&&a.x1<=b[d][1].x&&a.y1+a.height>=b[d][0].y&&a.y1<=b[d][2].y&&c.push(d);return c}function d(a,b){for(var c=[],d=0;4>d;d++)j.collision(a,b[d])&&c.push(d);return c}function e(a,b){var c,d,e=b.level+1,f=Math.round(b.bounds.width/2),g=Math.round(b.bounds.height/2),h=Math.round(b.bounds.x),j=Math.round(b.bounds.y);switch(a){case 0:c=h,d=j;break;case 1:c=h+f,d=j;break;case 2:c=h,d=j+g;break;case 3:c=h+f,d=j+g}return i({x:c,y:d,width:f,height:g},e,b.maxElements,b.maxLevel)}function f(b,d,g){if(g.level<g.maxLevel)for(var h=c(d,g.corners),i=0,j=h.length;j>i;i++)g.nodes[h[i]]===a&&(g.nodes[h[i]]=e(h[i],g)),f(b,d,g.nodes[h[i]]);else g.elements.push(b)}function g(c,d){if(d.level<d.maxLevel){var e=b(c,d.bounds);return d.nodes[e]!==a?g(c,d.nodes[e]):[]}return d.elements}function h(b,c,d,e){if(e=e||{},c.level<c.maxLevel)for(var f=d(b,c.corners),g=0,i=f.length;i>g;g++)c.nodes[f[g]]!==a&&h(b,c.nodes[f[g]],d,e);else for(var j=0,k=c.elements.length;k>j;j++)e[c.elements[j].id]===a&&(e[c.elements[j].id]=c.elements[j]);return e}function i(a,b,c,d){return{level:b||0,bounds:a,corners:j.splitSquare(a),maxElements:c||20,maxLevel:d||4,elements:[],nodes:[]}}var j={pointToSquare:function(a){return{x1:a.x-a.size,y1:a.y-a.size,x2:a.x+a.size,y2:a.y-a.size,height:2*a.size}},isAxisAligned:function(a){return a.x1===a.x2||a.y1===a.y2},axisAlignedTopPoints:function(a){return a.y1===a.y2&&a.x1<a.x2?a:a.x1===a.x2&&a.y2>a.y1?{x1:a.x1-a.height,y1:a.y1,x2:a.x1,y2:a.y1,height:a.height}:a.x1===a.x2&&a.y2<a.y1?{x1:a.x1,y1:a.y2,x2:a.x2+a.height,y2:a.y2,height:a.height}:{x1:a.x2,y1:a.y1-a.height,x2:a.x1,y2:a.y1-a.height,height:a.height}},lowerLeftCoor:function(a){var b=Math.sqrt(Math.pow(a.x2-a.x1,2)+Math.pow(a.y2-a.y1,2));return{x:a.x1-(a.y2-a.y1)*a.height/b,y:a.y1+(a.x2-a.x1)*a.height/b}},lowerRightCoor:function(a,b){return{x:b.x-a.x1+a.x2,y:b.y-a.y1+a.y2}},rectangleCorners:function(a){var b=this.lowerLeftCoor(a),c=this.lowerRightCoor(a,b);return[{x:a.x1,y:a.y1},{x:a.x2,y:a.y2},{x:b.x,y:b.y},{x:c.x,y:c.y}]},splitSquare:function(a){return[[{x:a.x,y:a.y},{x:a.x+a.width/2,y:a.y},{x:a.x,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height/2}],[{x:a.x+a.width/2,y:a.y},{x:a.x+a.width,y:a.y},{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x+a.width,y:a.y+a.height/2}],[{x:a.x,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x,y:a.y+a.height},{x:a.x+a.width/2,y:a.y+a.height}],[{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x+a.width,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height},{x:a.x+a.width,y:a.y+a.height}]]},axis:function(a,b){return[{x:a[1].x-a[0].x,y:a[1].y-a[0].y},{x:a[1].x-a[3].x,y:a[1].y-a[3].y},{x:b[0].x-b[2].x,y:b[0].y-b[2].y},{x:b[0].x-b[1].x,y:b[0].y-b[1].y}]},projection:function(a,b){var c=(a.x*b.x+a.y*b.y)/(Math.pow(b.x,2)+Math.pow(b.y,2));return{x:c*b.x,y:c*b.y}},axisCollision:function(a,b,c){for(var d=[],e=[],f=0;4>f;f++){var g=this.projection(b[f],a),h=this.projection(c[f],a);d.push(g.x*a.x+g.y*a.y),e.push(h.x*a.x+h.y*a.y)}var i=Math.max.apply(Math,d),j=Math.max.apply(Math,e),k=Math.min.apply(Math,d),l=Math.min.apply(Math,e);return i>=l&&j>=k},collision:function(a,b){for(var c=this.axis(a,b),d=!0,e=0;4>e;e++)d*=this.axisCollision(c[e],a,b);return!!d}},k=function(){this._geom=j,this._tree=null,this._cache={query:!1,result:!1}};k.prototype.index=function(a,b){if(!b.bounds)throw"sigma.classes.quad.index: bounds information not given.";var c=b.prefix||"";this._tree=i(b.bounds,0,b.maxElements,b.maxLevel);for(var d=0,e=a.length;e>d;d++)f(a[d],j.pointToSquare({x:a[d][c+"x"],y:a[d][c+"y"],size:a[d][c+"size"]}),this._tree);return this._cache={query:!1,result:!1},this._tree},k.prototype.point=function(a,b){return this._tree?g({x:a,y:b},this._tree)||[]:[]},k.prototype.area=function(a){var b,e,f=JSON.stringify(a);if(this._cache.query===f)return this._cache.result;j.isAxisAligned(a)?(b=c,e=j.axisAlignedTopPoints(a)):(b=d,e=j.rectangleCorners(a));var g=this._tree?h(e,this._tree,b):[],i=[];for(var k in g)i.push(g[k]);return this._cache.query=f,this._cache.result=i,i},"undefined"!=typeof this.sigma?(this.sigma.classes=this.sigma.classes||{},this.sigma.classes.quad=k):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=k),exports.quad=k):this.quad=k}.call(this),function(a){"use strict";function b(a,b){var c=b.x+b.width/2,d=b.y+b.height/2,e=a.y<d,f=a.x<c;return e?f?0:1:f?2:3}function c(a,b){for(var c=[],d=0;4>d;d++)a.x2>=b[d][0].x&&a.x1<=b[d][1].x&&a.y1+a.height>=b[d][0].y&&a.y1<=b[d][2].y&&c.push(d);return c}function d(a,b){for(var c=[],d=0;4>d;d++)j.collision(a,b[d])&&c.push(d);return c}function e(a,b){var c,d,e=b.level+1,f=Math.round(b.bounds.width/2),g=Math.round(b.bounds.height/2),h=Math.round(b.bounds.x),j=Math.round(b.bounds.y);switch(a){case 0:c=h,d=j;break;case 1:c=h+f,d=j;break;case 2:c=h,d=j+g;break;case 3:c=h+f,d=j+g}return i({x:c,y:d,width:f,height:g},e,b.maxElements,b.maxLevel)}function f(b,d,g){if(g.level<g.maxLevel)for(var h=c(d,g.corners),i=0,j=h.length;j>i;i++)g.nodes[h[i]]===a&&(g.nodes[h[i]]=e(h[i],g)),f(b,d,g.nodes[h[i]]);else g.elements.push(b)}function g(c,d){if(d.level<d.maxLevel){var e=b(c,d.bounds);return d.nodes[e]!==a?g(c,d.nodes[e]):[]}return d.elements}function h(b,c,d,e){if(e=e||{},c.level<c.maxLevel)for(var f=d(b,c.corners),g=0,i=f.length;i>g;g++)c.nodes[f[g]]!==a&&h(b,c.nodes[f[g]],d,e);else for(var j=0,k=c.elements.length;k>j;j++)e[c.elements[j].id]===a&&(e[c.elements[j].id]=c.elements[j]);return e}function i(a,b,c,d){return{level:b||0,bounds:a,corners:j.splitSquare(a),maxElements:c||40,maxLevel:d||8,elements:[],nodes:[]}}var j={pointToSquare:function(a){return{x1:a.x-a.size,y1:a.y-a.size,x2:a.x+a.size,y2:a.y-a.size,height:2*a.size}},lineToSquare:function(a){return a.y1<a.y2?a.x1<a.x2?{x1:a.x1-a.size,y1:a.y1-a.size,x2:a.x2+a.size,y2:a.y1-a.size,height:a.y2-a.y1+2*a.size}:{x1:a.x2-a.size,y1:a.y1-a.size,x2:a.x1+a.size,y2:a.y1-a.size,height:a.y2-a.y1+2*a.size}:a.x1<a.x2?{x1:a.x1-a.size,y1:a.y2-a.size,x2:a.x2+a.size,y2:a.y2-a.size,height:a.y1-a.y2+2*a.size}:{x1:a.x2-a.size,y1:a.y2-a.size,x2:a.x1+a.size,y2:a.y2-a.size,height:a.y1-a.y2+2*a.size}},quadraticCurveToSquare:function(a,b){var c=sigma.utils.getPointOnQuadraticCurve(.5,a.x1,a.y1,a.x2,a.y2,b.x,b.y),d=Math.min(a.x1,a.x2,c.x),e=Math.max(a.x1,a.x2,c.x),f=Math.min(a.y1,a.y2,c.y),g=Math.max(a.y1,a.y2,c.y);return{x1:d-a.size,y1:f-a.size,x2:e+a.size,y2:f-a.size,height:g-f+2*a.size}},selfLoopToSquare:function(a){var b=sigma.utils.getSelfLoopControlPoints(a.x,a.y,a.size),c=Math.min(a.x,b.x1,b.x2),d=Math.max(a.x,b.x1,b.x2),e=Math.min(a.y,b.y1,b.y2),f=Math.max(a.y,b.y1,b.y2);return{x1:c-a.size,y1:e-a.size,x2:d+a.size,y2:e-a.size,height:f-e+2*a.size}},isAxisAligned:function(a){return a.x1===a.x2||a.y1===a.y2},axisAlignedTopPoints:function(a){return a.y1===a.y2&&a.x1<a.x2?a:a.x1===a.x2&&a.y2>a.y1?{x1:a.x1-a.height,y1:a.y1,x2:a.x1,y2:a.y1,height:a.height}:a.x1===a.x2&&a.y2<a.y1?{x1:a.x1,y1:a.y2,x2:a.x2+a.height,y2:a.y2,height:a.height}:{x1:a.x2,y1:a.y1-a.height,x2:a.x1,y2:a.y1-a.height,height:a.height}},lowerLeftCoor:function(a){var b=Math.sqrt(Math.pow(a.x2-a.x1,2)+Math.pow(a.y2-a.y1,2));return{x:a.x1-(a.y2-a.y1)*a.height/b,y:a.y1+(a.x2-a.x1)*a.height/b}},lowerRightCoor:function(a,b){return{x:b.x-a.x1+a.x2,y:b.y-a.y1+a.y2}},rectangleCorners:function(a){var b=this.lowerLeftCoor(a),c=this.lowerRightCoor(a,b);return[{x:a.x1,y:a.y1},{x:a.x2,y:a.y2},{x:b.x,y:b.y},{x:c.x,y:c.y}]},splitSquare:function(a){return[[{x:a.x,y:a.y},{x:a.x+a.width/2,y:a.y},{x:a.x,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height/2}],[{x:a.x+a.width/2,y:a.y},{x:a.x+a.width,y:a.y},{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x+a.width,y:a.y+a.height/2}],[{x:a.x,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x,y:a.y+a.height},{x:a.x+a.width/2,y:a.y+a.height}],[{x:a.x+a.width/2,y:a.y+a.height/2},{x:a.x+a.width,y:a.y+a.height/2},{x:a.x+a.width/2,y:a.y+a.height},{x:a.x+a.width,y:a.y+a.height}]]},axis:function(a,b){return[{x:a[1].x-a[0].x,y:a[1].y-a[0].y},{x:a[1].x-a[3].x,y:a[1].y-a[3].y},{x:b[0].x-b[2].x,y:b[0].y-b[2].y},{x:b[0].x-b[1].x,y:b[0].y-b[1].y}]},projection:function(a,b){var c=(a.x*b.x+a.y*b.y)/(Math.pow(b.x,2)+Math.pow(b.y,2));return{x:c*b.x,y:c*b.y}},axisCollision:function(a,b,c){for(var d=[],e=[],f=0;4>f;f++){var g=this.projection(b[f],a),h=this.projection(c[f],a);d.push(g.x*a.x+g.y*a.y),e.push(h.x*a.x+h.y*a.y)}var i=Math.max.apply(Math,d),j=Math.max.apply(Math,e),k=Math.min.apply(Math,d),l=Math.min.apply(Math,e);return i>=l&&j>=k},collision:function(a,b){for(var c=this.axis(a,b),d=!0,e=0;4>e;e++)d*=this.axisCollision(c[e],a,b);return!!d}},k=function(){this._geom=j,this._tree=null,this._cache={query:!1,result:!1},this._enabled=!0};k.prototype.index=function(a,b){if(!this._enabled)return this._tree;if(!b.bounds)throw"sigma.classes.edgequad.index: bounds information not given.";var c,d,e,g,h,k=b.prefix||"";this._tree=i(b.bounds,0,b.maxElements,b.maxLevel);for(var l=a.edges(),m=0,n=l.length;n>m;m++)d=a.nodes(l[m].source),e=a.nodes(l[m].target),h={x1:d[k+"x"],y1:d[k+"y"],x2:e[k+"x"],y2:e[k+"y"],size:l[m][k+"size"]||0},"curve"===l[m].type||"curvedArrow"===l[m].type?d.id===e.id?(g={x:d[k+"x"],y:d[k+"y"],size:d[k+"size"]||0},f(l[m],j.selfLoopToSquare(g),this._tree)):(c=sigma.utils.getQuadraticControlPoint(h.x1,h.y1,h.x2,h.y2),f(l[m],j.quadraticCurveToSquare(h,c),this._tree)):f(l[m],j.lineToSquare(h),this._tree);return this._cache={query:!1,result:!1},this._tree},k.prototype.point=function(a,b){return this._enabled&&this._tree?g({x:a,y:b},this._tree)||[]:[]},k.prototype.area=function(a){if(!this._enabled)return[];var b,e,f=JSON.stringify(a);if(this._cache.query===f)return this._cache.result;j.isAxisAligned(a)?(b=c,e=j.axisAlignedTopPoints(a)):(b=d,e=j.rectangleCorners(a));var g=this._tree?h(e,this._tree,b):[],i=[];for(var k in g)i.push(g[k]);return this._cache.query=f,this._cache.result=i,i},"undefined"!=typeof this.sigma?(this.sigma.classes=this.sigma.classes||{},this.sigma.classes.edgequad=k):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=k),exports.edgequad=k):this.edgequad=k}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.captors"),sigma.captors.mouse=function(a,b,c){function d(a){var b,c,d;return y("mouseEnabled")&&v.dispatchEvent("mousemove",{x:sigma.utils.getX(a)-a.target.width/2,y:sigma.utils.getY(a)-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),y("mouseEnabled")&&q?(r=!0,s=!0,u&&clearTimeout(u),u=setTimeout(function(){r=!1},y("dragTimeout")),sigma.misc.animation.killAll(x),x.isMoving=!0,d=x.cameraPosition(sigma.utils.getX(a)-o,sigma.utils.getY(a)-p,!0),b=k-d.x,c=l-d.y,(b!==x.x||c!==x.y)&&(m=x.x,n=x.y,x.goTo({x:b,y:c})),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1):void 0}function e(a){if(y("mouseEnabled")&&q){q=!1,u&&clearTimeout(u),x.isMoving=!1;var b=sigma.utils.getX(a),c=sigma.utils.getY(a);r?(sigma.misc.animation.killAll(x),sigma.misc.animation.camera(x,{x:x.x+y("mouseInertiaRatio")*(x.x-m),y:x.y+y("mouseInertiaRatio")*(x.y-n)},{easing:"quadraticOut",duration:y("mouseInertiaDuration")})):(o!==b||p!==c)&&x.goTo({x:x.x,y:x.y}),v.dispatchEvent("mouseup",{x:b-a.target.width/2,y:c-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),r=!1}}function f(a){if(y("mouseEnabled"))switch(k=x.x,l=x.y,m=x.x,n=x.y,o=sigma.utils.getX(a),p=sigma.utils.getY(a),s=!1,t=(new Date).getTime(),a.which){case 2:break;case 3:v.dispatchEvent("rightclick",{x:o-a.target.width/2,y:p-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey});break;default:q=!0,v.dispatchEvent("mousedown",{x:o-a.target.width/2,y:p-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey})}}function g(){y("mouseEnabled")&&v.dispatchEvent("mouseout")}function h(a){return y("mouseEnabled")&&v.dispatchEvent("click",{x:sigma.utils.getX(a)-a.target.width/2,y:sigma.utils.getY(a)-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey,isDragging:(new Date).getTime()-t>100&&s}),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1}function i(a){var b,c,d;return y("mouseEnabled")?(c=1/y("doubleClickZoomingRatio"),v.dispatchEvent("doubleclick",{x:o-a.target.width/2,y:p-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),y("doubleClickEnabled")&&(b=x.cameraPosition(sigma.utils.getX(a)-a.target.width/2,sigma.utils.getY(a)-a.target.height/2,!0),d={duration:y("doubleClickZoomDuration")},sigma.utils.zoomTo(x,b.x,b.y,c,d)),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1):void 0}function j(a){var b,c,d;return y("mouseEnabled")&&y("mouseWheelEnabled")?(c=sigma.utils.getDelta(a)>0?1/y("zoomingRatio"):y("zoomingRatio"),b=x.cameraPosition(sigma.utils.getX(a)-a.target.width/2,sigma.utils.getY(a)-a.target.height/2,!0),d={duration:y("mouseZoomDuration")},sigma.utils.zoomTo(x,b.x,b.y,c,d),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1):void 0}var k,l,m,n,o,p,q,r,s,t,u,v=this,w=a,x=b,y=c;sigma.classes.dispatcher.extend(this),sigma.utils.doubleClick(w,"click",i),w.addEventListener("DOMMouseScroll",j,!1),w.addEventListener("mousewheel",j,!1),w.addEventListener("mousemove",d,!1),w.addEventListener("mousedown",f,!1),w.addEventListener("click",h,!1),w.addEventListener("mouseout",g,!1),document.addEventListener("mouseup",e,!1),this.kill=function(){sigma.utils.unbindDoubleClick(w,"click"),w.removeEventListener("DOMMouseScroll",j),w.removeEventListener("mousewheel",j),w.removeEventListener("mousemove",d),w.removeEventListener("mousedown",f),w.removeEventListener("click",h),w.removeEventListener("mouseout",g),document.removeEventListener("mouseup",e)}}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.captors"),sigma.captors.touch=function(a,b,c){function d(a){var b=sigma.utils.getOffset(B);return{x:a.pageX-b.left,y:a.pageY-b.top}}function e(a){if(D("touchEnabled")){var b,c,e,f,g,h;switch(E=a.touches,E.length){case 1:C.isMoving=!0,w=1,i=C.x,j=C.y,m=C.x,n=C.y,g=d(E[0]),q=g.x,r=g.y;break;case 2:return C.isMoving=!0,w=2,g=d(E[0]),h=d(E[1]),b=g.x,e=g.y,c=h.x,f=h.y,m=C.x,n=C.y,k=C.angle,l=C.ratio,i=C.x,j=C.y,q=b,r=e,s=c,t=f,u=Math.atan2(t-r,s-q),v=Math.sqrt(Math.pow(t-r,2)+Math.pow(s-q,2)),a.preventDefault(),!1}}}function f(a){if(D("touchEnabled")){E=a.touches;var b=D("touchInertiaRatio");switch(z&&(x=!1,clearTimeout(z)),w){case 2:if(1===a.touches.length){e(a),a.preventDefault();break}case 1:C.isMoving=!1,A.dispatchEvent("stopDrag"),x&&(y=!1,sigma.misc.animation.camera(C,{x:C.x+b*(C.x-m),y:C.y+b*(C.y-n)},{easing:"quadraticOut",duration:D("touchInertiaDuration")})),x=!1,w=0}}}function g(a){if(!y&&D("touchEnabled")){var b,c,e,f,g,h,B,F,G,H,I,J,K,L,M,N,O;switch(E=a.touches,x=!0,z&&clearTimeout(z),z=setTimeout(function(){x=!1},D("dragTimeout")),w){case 1:F=d(E[0]),b=F.x,e=F.y,H=C.cameraPosition(b-q,e-r,!0),L=i-H.x,M=j-H.y,(L!==C.x||M!==C.y)&&(m=C.x,n=C.y,C.goTo({x:L,y:M}),A.dispatchEvent("mousemove",{x:F.x-a.target.width/2,y:F.y-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),A.dispatchEvent("drag"));break;case 2:F=d(E[0]),G=d(E[1]),b=F.x,e=F.y,c=G.x,f=G.y,I=C.cameraPosition((q+s)/2-a.target.width/2,(r+t)/2-a.target.height/2,!0),B=C.cameraPosition((b+c)/2-a.target.width/2,(e+f)/2-a.target.height/2,!0),J=Math.atan2(f-e,c-b)-u,K=Math.sqrt(Math.pow(f-e,2)+Math.pow(c-b,2))/v,b=I.x,e=I.y,N=l/K,b*=K,e*=K,O=k-J,g=Math.cos(-J),h=Math.sin(-J),c=b*g+e*h,f=e*g-b*h,b=c,e=f,L=b-B.x+i,M=e-B.y+j,(N!==C.ratio||O!==C.angle||L!==C.x||M!==C.y)&&(m=C.x,n=C.y,o=C.angle,p=C.ratio,C.goTo({x:L,y:M,angle:O,ratio:N}),A.dispatchEvent("drag"))}return a.preventDefault(),!1}}function h(a){var b,c,e;return a.touches&&1===a.touches.length&&D("touchEnabled")?(y=!0,c=1/D("doubleClickZoomingRatio"),b=d(a.touches[0]),A.dispatchEvent("doubleclick",{x:b.x-a.target.width/2,y:b.y-a.target.height/2,clientX:a.clientX,clientY:a.clientY,ctrlKey:a.ctrlKey,metaKey:a.metaKey,altKey:a.altKey,shiftKey:a.shiftKey}),D("doubleClickEnabled")&&(b=C.cameraPosition(b.x-a.target.width/2,b.y-a.target.height/2,!0),e={duration:D("doubleClickZoomDuration"),onComplete:function(){y=!1}},sigma.utils.zoomTo(C,b.x,b.y,c,e)),a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation(),!1):void 0}var i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A=this,B=a,C=b,D=c,E=[];sigma.classes.dispatcher.extend(this),sigma.utils.doubleClick(B,"touchstart",h),B.addEventListener("touchstart",e,!1),B.addEventListener("touchend",f,!1),B.addEventListener("touchcancel",f,!1),B.addEventListener("touchleave",f,!1),B.addEventListener("touchmove",g,!1),this.kill=function(){sigma.utils.unbindDoubleClick(B,"touchstart"),B.addEventListener("touchstart",e),B.addEventListener("touchend",f),B.addEventListener("touchcancel",f),B.addEventListener("touchleave",f),B.addEventListener("touchmove",g)}}}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";if("undefined"==typeof conrad)throw"conrad is not declared";sigma.utils.pkg("sigma.renderers"),sigma.renderers.canvas=function(a,b,c,d){if("object"!=typeof d)throw"sigma.renderers.canvas: Wrong arguments.";if(!(d.container instanceof HTMLElement))throw"Container not found.";var e,f,g,h;for(sigma.classes.dispatcher.extend(this),Object.defineProperty(this,"conradId",{value:sigma.utils.id()}),this.graph=a,this.camera=b,this.contexts={},this.domElements={},this.options=d,this.container=this.options.container,this.settings="object"==typeof d.settings&&d.settings?c.embedObjects(d.settings):c,this.nodesOnScreen=[],this.edgesOnScreen=[],this.jobs={},this.options.prefix="renderer"+this.conradId+":",this.settings("batchEdgesDrawing")?(this.initDOM("canvas","edges"),this.initDOM("canvas","scene"),this.contexts.nodes=this.contexts.scene,this.contexts.labels=this.contexts.scene):(this.initDOM("canvas","scene"),this.contexts.edges=this.contexts.scene,this.contexts.nodes=this.contexts.scene,this.contexts.labels=this.contexts.scene),this.initDOM("canvas","mouse"),this.contexts.hover=this.contexts.mouse,this.captors=[],g=this.options.captors||[sigma.captors.mouse,sigma.captors.touch],e=0,f=g.length;f>e;e++)h="function"==typeof g[e]?g[e]:sigma.captors[g[e]],this.captors.push(new h(this.domElements.mouse,this.camera,this.settings));sigma.misc.bindEvents.call(this,this.options.prefix),sigma.misc.drawHovers.call(this,this.options.prefix),this.resize(!1)},sigma.renderers.canvas.prototype.render=function(b){b=b||{};var c,d,e,f,g,h,i,j,k,l,m,n,o,p={},q=this.graph,r=this.graph.nodes,s=(this.options.prefix||"",this.settings(b,"drawEdges")),t=this.settings(b,"drawNodes"),u=this.settings(b,"drawLabels"),v=this.settings(b,"drawEdgeLabels"),w=this.settings.embedObjects(b,{prefix:this.options.prefix});this.resize(!1),this.settings(b,"hideEdgesOnMove")&&(this.camera.isAnimated||this.camera.isMoving)&&(s=!1),this.camera.applyView(a,this.options.prefix,{width:this.width,height:this.height}),this.clear();for(e in this.jobs)conrad.hasJob(e)&&conrad.killJob(e);for(this.edgesOnScreen=[],this.nodesOnScreen=this.camera.quadtree.area(this.camera.getRectangle(this.width,this.height)),c=this.nodesOnScreen,d=0,f=c.length;f>d;d++)p[c[d].id]=c[d];if(s){for(c=q.edges(),d=0,f=c.length;f>d;d++)g=c[d],!p[g.source]&&!p[g.target]||g.hidden||r(g.source).hidden||r(g.target).hidden||this.edgesOnScreen.push(g);if(this.settings(b,"batchEdgesDrawing"))h="edges_"+this.conradId,n=w("canvasEdgesBatchSize"),l=this.edgesOnScreen,f=l.length,k=0,i=Math.min(l.length,k+n),j=function(){for(o=this.contexts.edges.globalCompositeOperation,this.contexts.edges.globalCompositeOperation="destination-over",m=sigma.canvas.edges,d=k;i>d;d++)g=l[d],(m[g.type||this.settings(b,"defaultEdgeType")]||m.def)(g,q.nodes(g.source),q.nodes(g.target),this.contexts.edges,w);if(v)for(m=sigma.canvas.edges.labels,d=k;i>d;d++)g=l[d],g.hidden||(m[g.type||this.settings(b,"defaultEdgeType")]||m.def)(g,q.nodes(g.source),q.nodes(g.target),this.contexts.labels,w);return this.contexts.edges.globalCompositeOperation=o,i===l.length?(delete this.jobs[h],!1):(k=i+1,i=Math.min(l.length,k+n),!0)},this.jobs[h]=j,conrad.addJob(h,j.bind(this));else{for(m=sigma.canvas.edges,c=this.edgesOnScreen,d=0,f=c.length;f>d;d++)g=c[d],(m[g.type||this.settings(b,"defaultEdgeType")]||m.def)(g,q.nodes(g.source),q.nodes(g.target),this.contexts.edges,w);if(v)for(m=sigma.canvas.edges.labels,c=this.edgesOnScreen,d=0,f=c.length;f>d;d++)c[d].hidden||(m[c[d].type||this.settings(b,"defaultEdgeType")]||m.def)(c[d],q.nodes(c[d].source),q.nodes(c[d].target),this.contexts.labels,w)}}if(t)for(m=sigma.canvas.nodes,c=this.nodesOnScreen,d=0,f=c.length;f>d;d++)c[d].hidden||(m[c[d].type||this.settings(b,"defaultNodeType")]||m.def)(c[d],this.contexts.nodes,w);if(u)for(m=sigma.canvas.labels,c=this.nodesOnScreen,d=0,f=c.length;f>d;d++)c[d].hidden||(m[c[d].type||this.settings(b,"defaultNodeType")]||m.def)(c[d],this.contexts.labels,w);return this.dispatchEvent("render"),this},sigma.renderers.canvas.prototype.initDOM=function(a,b){var c=document.createElement(a);c.style.position="absolute",c.setAttribute("class","sigma-"+b),this.domElements[b]=c,this.container.appendChild(c),"canvas"===a.toLowerCase()&&(this.contexts[b]=c.getContext("2d"))},sigma.renderers.canvas.prototype.resize=function(b,c){var d,e=this.width,f=this.height,g=1;if(b!==a&&c!==a?(this.width=b,this.height=c):(this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,b=this.width,c=this.height),e!==this.width||f!==this.height)for(d in this.domElements)this.domElements[d].style.width=b+"px",this.domElements[d].style.height=c+"px","canvas"===this.domElements[d].tagName.toLowerCase()&&(this.domElements[d].setAttribute("width",b*g+"px"),this.domElements[d].setAttribute("height",c*g+"px"),1!==g&&this.contexts[d].scale(g,g));return this},sigma.renderers.canvas.prototype.clear=function(){var a;for(a in this.domElements)"CANVAS"===this.domElements[a].tagName&&(this.domElements[a].width=this.domElements[a].width);return this},sigma.renderers.canvas.prototype.kill=function(){for(var a,b;b=this.captors.pop();)b.kill();delete this.captors;for(a in this.domElements)this.domElements[a].parentNode.removeChild(this.domElements[a]),delete this.domElements[a],delete this.contexts[a];delete this.domElements,delete this.contexts},sigma.utils.pkg("sigma.canvas.nodes"),sigma.utils.pkg("sigma.canvas.edges"),sigma.utils.pkg("sigma.canvas.labels")}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.renderers"),sigma.renderers.webgl=function(a,b,c,d){if("object"!=typeof d)throw"sigma.renderers.webgl: Wrong arguments.";if(!(d.container instanceof HTMLElement))throw"Container not found.";var e,f,g,h;for(sigma.classes.dispatcher.extend(this),this.jobs={},Object.defineProperty(this,"conradId",{value:sigma.utils.id()}),this.graph=a,this.camera=b,this.contexts={},this.domElements={},this.options=d,this.container=this.options.container,this.settings="object"==typeof d.settings&&d.settings?c.embedObjects(d.settings):c,this.options.prefix=this.camera.readPrefix,Object.defineProperty(this,"nodePrograms",{value:{}}),Object.defineProperty(this,"edgePrograms",{value:{}}),Object.defineProperty(this,"nodeFloatArrays",{value:{}}),Object.defineProperty(this,"edgeFloatArrays",{value:{}}),this.settings(d,"batchEdgesDrawing")?(this.initDOM("canvas","edges",!0),this.initDOM("canvas","nodes",!0)):(this.initDOM("canvas","scene",!0),this.contexts.nodes=this.contexts.scene,this.contexts.edges=this.contexts.scene),this.initDOM("canvas","labels"),this.initDOM("canvas","mouse"),this.contexts.hover=this.contexts.mouse,this.captors=[],g=this.options.captors||[sigma.captors.mouse,sigma.captors.touch],e=0,f=g.length;f>e;e++)h="function"==typeof g[e]?g[e]:sigma.captors[g[e]],this.captors.push(new h(this.domElements.mouse,this.camera,this.settings));sigma.misc.bindEvents.call(this,this.camera.prefix),sigma.misc.drawHovers.call(this,this.camera.prefix),this.resize()},sigma.renderers.webgl.prototype.process=function(){var a,b,c,d,e,f,g=this.graph,h=sigma.utils.extend(h,this.options);for(d in this.nodeFloatArrays)delete this.nodeFloatArrays[d];for(d in this.edgeFloatArrays)delete this.edgeFloatArrays[d];for(a=g.edges(),b=0,c=a.length;c>b;b++)e=a[b].type||this.settings(h,"defaultEdgeType"),d=e&&sigma.webgl.edges[e]?e:"def",this.edgeFloatArrays[d]||(this.edgeFloatArrays[d]={edges:[]}),this.edgeFloatArrays[d].edges.push(a[b]);for(a=g.nodes(),b=0,c=a.length;c>b;b++)e=a[b].type||this.settings(h,"defaultNodeType"),d=e&&sigma.webgl.nodes[e]?e:"def",this.nodeFloatArrays[d]||(this.nodeFloatArrays[d]={nodes:[]}),this.nodeFloatArrays[d].nodes.push(a[b]);for(d in this.edgeFloatArrays)for(f=sigma.webgl.edges[d],a=this.edgeFloatArrays[d].edges,b=0,c=a.length;c>b;b++)this.edgeFloatArrays[d].array||(this.edgeFloatArrays[d].array=new Float32Array(a.length*f.POINTS*f.ATTRIBUTES)),a[b].hidden||g.nodes(a[b].source).hidden||g.nodes(a[b].target).hidden||f.addEdge(a[b],g.nodes(a[b].source),g.nodes(a[b].target),this.edgeFloatArrays[d].array,b*f.POINTS*f.ATTRIBUTES,h.prefix,this.settings);
for(d in this.nodeFloatArrays)for(f=sigma.webgl.nodes[d],a=this.nodeFloatArrays[d].nodes,b=0,c=a.length;c>b;b++)this.nodeFloatArrays[d].array||(this.nodeFloatArrays[d].array=new Float32Array(a.length*f.POINTS*f.ATTRIBUTES)),a[b].hidden||f.addNode(a[b],this.nodeFloatArrays[d].array,b*f.POINTS*f.ATTRIBUTES,h.prefix,this.settings);return this},sigma.renderers.webgl.prototype.render=function(b){var c,d,e,f,g,h,i=this,j=(this.graph,this.contexts.nodes),k=this.contexts.edges,l=this.camera.getMatrix(),m=sigma.utils.extend(b,this.options),n=this.settings(m,"drawLabels"),o=this.settings(m,"drawEdges"),p=this.settings(m,"drawNodes");this.resize(!1),this.settings(m,"hideEdgesOnMove")&&(this.camera.isAnimated||this.camera.isMoving)&&(o=!1),this.clear(),l=sigma.utils.matrices.multiply(l,sigma.utils.matrices.translation(this.width/2,this.height/2));for(f in this.jobs)conrad.hasJob(f)&&conrad.killJob(f);if(o)if(this.settings(m,"batchEdgesDrawing"))(function(){var a,b,c,d,e,f,g,h,i;c="edges_"+this.conradId,i=this.settings(m,"webglEdgesBatchSize"),a=Object.keys(this.edgeFloatArrays),a.length&&(b=0,h=sigma.webgl.edges[a[b]],e=this.edgeFloatArrays[a[b]].array,g=0,f=Math.min(g+i*h.POINTS,e.length/h.ATTRIBUTES),d=function(){return this.edgePrograms[a[b]]||(this.edgePrograms[a[b]]=h.initProgram(k)),f>g&&(k.useProgram(this.edgePrograms[a[b]]),h.render(k,this.edgePrograms[a[b]],e,{settings:this.settings,matrix:l,width:this.width,height:this.height,ratio:this.camera.ratio,scalingRatio:this.settings(m,"webglOversamplingRatio"),start:g,count:f-g})),f>=e.length/h.ATTRIBUTES&&b===a.length-1?(delete this.jobs[c],!1):(f>=e.length/h.ATTRIBUTES?(b++,e=this.edgeFloatArrays[a[b]].array,h=sigma.webgl.edges[a[b]],g=0,f=Math.min(g+i*h.POINTS,e.length/h.ATTRIBUTES)):(g=f,f=Math.min(g+i*h.POINTS,e.length/h.ATTRIBUTES)),!0)},this.jobs[c]=d,conrad.addJob(c,d.bind(this)))}).call(this);else for(f in this.edgeFloatArrays)h=sigma.webgl.edges[f],this.edgePrograms[f]||(this.edgePrograms[f]=h.initProgram(k)),this.edgeFloatArrays[f]&&(k.useProgram(this.edgePrograms[f]),h.render(k,this.edgePrograms[f],this.edgeFloatArrays[f].array,{settings:this.settings,matrix:l,width:this.width,height:this.height,ratio:this.camera.ratio,scalingRatio:this.settings(m,"webglOversamplingRatio")}));if(p){j.blendFunc(j.SRC_ALPHA,j.ONE_MINUS_SRC_ALPHA),j.enable(j.BLEND);for(f in this.nodeFloatArrays)h=sigma.webgl.nodes[f],this.nodePrograms[f]||(this.nodePrograms[f]=h.initProgram(j)),this.nodeFloatArrays[f]&&(j.useProgram(this.nodePrograms[f]),h.render(j,this.nodePrograms[f],this.nodeFloatArrays[f].array,{settings:this.settings,matrix:l,width:this.width,height:this.height,ratio:this.camera.ratio,scalingRatio:this.settings(m,"webglOversamplingRatio")}))}if(n)for(c=this.camera.quadtree.area(this.camera.getRectangle(this.width,this.height)),this.camera.applyView(a,a,{nodes:c,edges:[],width:this.width,height:this.height}),g=function(a){return i.settings({prefix:i.camera.prefix},a)},d=0,e=c.length;e>d;d++)c[d].hidden||(sigma.canvas.labels[c[d].type||this.settings(m,"defaultNodeType")]||sigma.canvas.labels.def)(c[d],this.contexts.labels,g);return this.dispatchEvent("render"),this},sigma.renderers.webgl.prototype.initDOM=function(a,b,c){var d=document.createElement(a),e=this;d.style.position="absolute",d.setAttribute("class","sigma-"+b),this.domElements[b]=d,this.container.appendChild(d),"canvas"===a.toLowerCase()&&(this.contexts[b]=d.getContext(c?"experimental-webgl":"2d",{preserveDrawingBuffer:!0}),c&&(d.addEventListener("webglcontextlost",function(a){a.preventDefault()},!1),d.addEventListener("webglcontextrestored",function(){e.render()},!1)))},sigma.renderers.webgl.prototype.resize=function(b,c){var d,e=this.width,f=this.height;if(b!==a&&c!==a?(this.width=b,this.height=c):(this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,b=this.width,c=this.height),e!==this.width||f!==this.height)for(d in this.domElements)this.domElements[d].style.width=b+"px",this.domElements[d].style.height=c+"px","canvas"===this.domElements[d].tagName.toLowerCase()&&(this.contexts[d]&&this.contexts[d].scale?(this.domElements[d].setAttribute("width",b+"px"),this.domElements[d].setAttribute("height",c+"px")):(this.domElements[d].setAttribute("width",b*this.settings("webglOversamplingRatio")+"px"),this.domElements[d].setAttribute("height",c*this.settings("webglOversamplingRatio")+"px")));for(d in this.contexts)this.contexts[d]&&this.contexts[d].viewport&&this.contexts[d].viewport(0,0,this.width*this.settings("webglOversamplingRatio"),this.height*this.settings("webglOversamplingRatio"));return this},sigma.renderers.webgl.prototype.clear=function(){var a;for(a in this.domElements)"CANVAS"===this.domElements[a].tagName&&(this.domElements[a].width=this.domElements[a].width);return this.contexts.nodes.clear(this.contexts.nodes.COLOR_BUFFER_BIT),this.contexts.edges.clear(this.contexts.edges.COLOR_BUFFER_BIT),this},sigma.renderers.webgl.prototype.kill=function(){for(var a,b;b=this.captors.pop();)b.kill();delete this.captors;for(a in this.domElements)this.domElements[a].parentNode.removeChild(this.domElements[a]),delete this.domElements[a],delete this.contexts[a];delete this.domElements,delete this.contexts},sigma.utils.pkg("sigma.webgl.nodes"),sigma.utils.pkg("sigma.webgl.edges"),sigma.utils.pkg("sigma.canvas.labels")}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.renderers");var b,c=!!a.WebGLRenderingContext;if(c){b=document.createElement("canvas");try{c=!(!b.getContext("webgl")&&!b.getContext("experimental-webgl"))}catch(d){c=!1}}sigma.renderers.def=c?sigma.renderers.webgl:sigma.renderers.canvas}(this),function(){"use strict";sigma.utils.pkg("sigma.webgl.nodes"),sigma.webgl.nodes.def={POINTS:3,ATTRIBUTES:5,addNode:function(a,b,c,d,e){var f=sigma.utils.floatColor(a.color||e("defaultNodeColor"));b[c++]=a[d+"x"],b[c++]=a[d+"y"],b[c++]=a[d+"size"],b[c++]=f,b[c++]=0,b[c++]=a[d+"x"],b[c++]=a[d+"y"],b[c++]=a[d+"size"],b[c++]=f,b[c++]=2*Math.PI/3,b[c++]=a[d+"x"],b[c++]=a[d+"y"],b[c++]=a[d+"size"],b[c++]=f,b[c++]=4*Math.PI/3},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_position"),g=a.getAttribLocation(b,"a_size"),h=a.getAttribLocation(b,"a_color"),i=a.getAttribLocation(b,"a_angle"),j=a.getUniformLocation(b,"u_resolution"),k=a.getUniformLocation(b,"u_matrix"),l=a.getUniformLocation(b,"u_ratio"),m=a.getUniformLocation(b,"u_scale");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.DYNAMIC_DRAW),a.uniform2f(j,d.width,d.height),a.uniform1f(l,1/Math.pow(d.ratio,d.settings("nodesPowRatio"))),a.uniform1f(m,d.scalingRatio),a.uniformMatrix3fv(k,!1,d.matrix),a.enableVertexAttribArray(f),a.enableVertexAttribArray(g),a.enableVertexAttribArray(h),a.enableVertexAttribArray(i),a.vertexAttribPointer(f,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(g,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.vertexAttribPointer(h,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,12),a.vertexAttribPointer(i,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,16),a.drawArrays(a.TRIANGLES,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_position;","attribute float a_size;","attribute float a_color;","attribute float a_angle;","uniform vec2 u_resolution;","uniform float u_ratio;","uniform float u_scale;","uniform mat3 u_matrix;","varying vec4 color;","varying vec2 center;","varying float radius;","void main() {","radius = a_size * u_ratio;","vec2 position = (u_matrix * vec3(a_position, 1)).xy;","center = position * u_scale;","center = vec2(center.x, u_scale * u_resolution.y - center.y);","position = position +","2.0 * radius * vec2(cos(a_angle), sin(a_angle));","position = (position / u_resolution * 2.0 - 1.0) * vec2(1, -1);","radius = radius * u_scale;","gl_Position = vec4(position, 0, 1);","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","varying vec2 center;","varying float radius;","void main(void) {","vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);","vec2 m = gl_FragCoord.xy - center;","float diff = radius - sqrt(m.x * m.x + m.y * m.y);","if (diff > 0.0)","gl_FragColor = color;","else","gl_FragColor = color0;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";sigma.utils.pkg("sigma.webgl.nodes"),sigma.webgl.nodes.fast={POINTS:1,ATTRIBUTES:4,addNode:function(a,b,c,d,e){b[c++]=a[d+"x"],b[c++]=a[d+"y"],b[c++]=a[d+"size"],b[c++]=sigma.utils.floatColor(a.color||e("defaultNodeColor"))},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_position"),g=a.getAttribLocation(b,"a_size"),h=a.getAttribLocation(b,"a_color"),i=a.getUniformLocation(b,"u_resolution"),j=a.getUniformLocation(b,"u_matrix"),k=a.getUniformLocation(b,"u_ratio"),l=a.getUniformLocation(b,"u_scale");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.DYNAMIC_DRAW),a.uniform2f(i,d.width,d.height),a.uniform1f(k,1/Math.pow(d.ratio,d.settings("nodesPowRatio"))),a.uniform1f(l,d.scalingRatio),a.uniformMatrix3fv(j,!1,d.matrix),a.enableVertexAttribArray(f),a.enableVertexAttribArray(g),a.enableVertexAttribArray(h),a.vertexAttribPointer(f,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(g,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.vertexAttribPointer(h,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,12),a.drawArrays(a.POINTS,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_position;","attribute float a_size;","attribute float a_color;","uniform vec2 u_resolution;","uniform float u_ratio;","uniform float u_scale;","uniform mat3 u_matrix;","varying vec4 color;","void main() {","gl_Position = vec4(","((u_matrix * vec3(a_position, 1)).xy /","u_resolution * 2.0 - 1.0) * vec2(1, -1),","0,","1",");","gl_PointSize = a_size * u_ratio * u_scale * 2.0;","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","void main(void) {","gl_FragColor = color;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";sigma.utils.pkg("sigma.webgl.edges"),sigma.webgl.edges.def={POINTS:6,ATTRIBUTES:7,addEdge:function(a,b,c,d,e,f,g){var h=(a[f+"size"]||1)/2,i=b[f+"x"],j=b[f+"y"],k=c[f+"x"],l=c[f+"y"],m=a.color;if(!m)switch(g("edgeColor")){case"source":m=b.color||g("defaultNodeColor");break;case"target":m=c.color||g("defaultNodeColor");break;default:m=g("defaultEdgeColor")}m=sigma.utils.floatColor(m),d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=0,d[e++]=m,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=1,d[e++]=m,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=0,d[e++]=m,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=0,d[e++]=m,d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=1,d[e++]=m,d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=0,d[e++]=m},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_color"),g=a.getAttribLocation(b,"a_position1"),h=a.getAttribLocation(b,"a_position2"),i=a.getAttribLocation(b,"a_thickness"),j=a.getAttribLocation(b,"a_minus"),k=a.getUniformLocation(b,"u_resolution"),l=a.getUniformLocation(b,"u_matrix"),m=a.getUniformLocation(b,"u_matrixHalfPi"),n=a.getUniformLocation(b,"u_matrixHalfPiMinus"),o=a.getUniformLocation(b,"u_ratio"),p=a.getUniformLocation(b,"u_scale");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.STATIC_DRAW),a.uniform2f(k,d.width,d.height),a.uniform1f(o,d.ratio/Math.pow(d.ratio,d.settings("edgesPowRatio"))),a.uniform1f(p,d.scalingRatio),a.uniformMatrix3fv(l,!1,d.matrix),a.uniformMatrix2fv(m,!1,sigma.utils.matrices.rotation(Math.PI/2,!0)),a.uniformMatrix2fv(n,!1,sigma.utils.matrices.rotation(-Math.PI/2,!0)),a.enableVertexAttribArray(f),a.enableVertexAttribArray(g),a.enableVertexAttribArray(h),a.enableVertexAttribArray(i),a.enableVertexAttribArray(j),a.vertexAttribPointer(g,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(h,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.vertexAttribPointer(i,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,16),a.vertexAttribPointer(j,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,20),a.vertexAttribPointer(f,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,24),a.drawArrays(a.TRIANGLES,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_position1;","attribute vec2 a_position2;","attribute float a_thickness;","attribute float a_minus;","attribute float a_color;","uniform vec2 u_resolution;","uniform float u_ratio;","uniform float u_scale;","uniform mat3 u_matrix;","uniform mat2 u_matrixHalfPi;","uniform mat2 u_matrixHalfPiMinus;","varying vec4 color;","void main() {","vec2 position = a_thickness * u_ratio *","normalize(a_position2 - a_position1);","mat2 matrix = a_minus * u_matrixHalfPiMinus +","(1.0 - a_minus) * u_matrixHalfPi;","position = matrix * position + a_position1;","gl_Position = vec4(","((u_matrix * vec3(position, 1)).xy /","u_resolution * 2.0 - 1.0) * vec2(1, -1),","0,","1",");","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","void main(void) {","gl_FragColor = color;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";sigma.utils.pkg("sigma.webgl.edges"),sigma.webgl.edges.fast={POINTS:2,ATTRIBUTES:3,addEdge:function(a,b,c,d,e,f,g){var h=((a[f+"size"]||1)/2,b[f+"x"]),i=b[f+"y"],j=c[f+"x"],k=c[f+"y"],l=a.color;if(!l)switch(g("edgeColor")){case"source":l=b.color||g("defaultNodeColor");break;case"target":l=c.color||g("defaultNodeColor");break;default:l=g("defaultEdgeColor")}l=sigma.utils.floatColor(l),d[e++]=h,d[e++]=i,d[e++]=l,d[e++]=j,d[e++]=k,d[e++]=l},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_color"),g=a.getAttribLocation(b,"a_position"),h=a.getUniformLocation(b,"u_resolution"),i=a.getUniformLocation(b,"u_matrix");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.DYNAMIC_DRAW),a.uniform2f(h,d.width,d.height),a.uniformMatrix3fv(i,!1,d.matrix),a.enableVertexAttribArray(g),a.enableVertexAttribArray(f),a.vertexAttribPointer(g,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(f,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.lineWidth(3),a.drawArrays(a.LINES,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_position;","attribute float a_color;","uniform vec2 u_resolution;","uniform mat3 u_matrix;","varying vec4 color;","void main() {","gl_Position = vec4(","((u_matrix * vec3(a_position, 1)).xy /","u_resolution * 2.0 - 1.0) * vec2(1, -1),","0,","1",");","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","void main(void) {","gl_FragColor = color;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";sigma.utils.pkg("sigma.webgl.edges"),sigma.webgl.edges.arrow={POINTS:9,ATTRIBUTES:11,addEdge:function(a,b,c,d,e,f,g){var h=(a[f+"size"]||1)/2,i=b[f+"x"],j=b[f+"y"],k=c[f+"x"],l=c[f+"y"],m=c[f+"size"],n=a.color;if(!n)switch(g("edgeColor")){case"source":n=b.color||g("defaultNodeColor");break;case"target":n=c.color||g("defaultNodeColor");break;default:n=g("defaultEdgeColor")}n=sigma.utils.floatColor(n),d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=m,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=1,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=m,d[e++]=0,d[e++]=1,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=i,d[e++]=j,d[e++]=k,d[e++]=l,d[e++]=h,d[e++]=m,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=1,d[e++]=-1,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=1,d[e++]=0,d[e++]=n,d[e++]=k,d[e++]=l,d[e++]=i,d[e++]=j,d[e++]=h,d[e++]=m,d[e++]=1,d[e++]=0,d[e++]=1,d[e++]=1,d[e++]=n},render:function(a,b,c,d){var e,f=a.getAttribLocation(b,"a_pos1"),g=a.getAttribLocation(b,"a_pos2"),h=a.getAttribLocation(b,"a_thickness"),i=a.getAttribLocation(b,"a_tSize"),j=a.getAttribLocation(b,"a_delay"),k=a.getAttribLocation(b,"a_minus"),l=a.getAttribLocation(b,"a_head"),m=a.getAttribLocation(b,"a_headPosition"),n=a.getAttribLocation(b,"a_color"),o=a.getUniformLocation(b,"u_resolution"),p=a.getUniformLocation(b,"u_matrix"),q=a.getUniformLocation(b,"u_matrixHalfPi"),r=a.getUniformLocation(b,"u_matrixHalfPiMinus"),s=a.getUniformLocation(b,"u_ratio"),t=a.getUniformLocation(b,"u_nodeRatio"),u=a.getUniformLocation(b,"u_arrowHead"),v=a.getUniformLocation(b,"u_scale");e=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,e),a.bufferData(a.ARRAY_BUFFER,c,a.STATIC_DRAW),a.uniform2f(o,d.width,d.height),a.uniform1f(s,d.ratio/Math.pow(d.ratio,d.settings("edgesPowRatio"))),a.uniform1f(t,Math.pow(d.ratio,d.settings("nodesPowRatio"))/d.ratio),a.uniform1f(u,5),a.uniform1f(v,d.scalingRatio),a.uniformMatrix3fv(p,!1,d.matrix),a.uniformMatrix2fv(q,!1,sigma.utils.matrices.rotation(Math.PI/2,!0)),a.uniformMatrix2fv(r,!1,sigma.utils.matrices.rotation(-Math.PI/2,!0)),a.enableVertexAttribArray(f),a.enableVertexAttribArray(g),a.enableVertexAttribArray(h),a.enableVertexAttribArray(i),a.enableVertexAttribArray(j),a.enableVertexAttribArray(k),a.enableVertexAttribArray(l),a.enableVertexAttribArray(m),a.enableVertexAttribArray(n),a.vertexAttribPointer(f,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),a.vertexAttribPointer(g,2,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),a.vertexAttribPointer(h,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,16),a.vertexAttribPointer(i,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,20),a.vertexAttribPointer(j,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,24),a.vertexAttribPointer(k,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,28),a.vertexAttribPointer(l,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,32),a.vertexAttribPointer(m,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,36),a.vertexAttribPointer(n,1,a.FLOAT,!1,this.ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,40),a.drawArrays(a.TRIANGLES,d.start||0,d.count||c.length/this.ATTRIBUTES)},initProgram:function(a){var b,c,d;return b=sigma.utils.loadShader(a,["attribute vec2 a_pos1;","attribute vec2 a_pos2;","attribute float a_thickness;","attribute float a_tSize;","attribute float a_delay;","attribute float a_minus;","attribute float a_head;","attribute float a_headPosition;","attribute float a_color;","uniform vec2 u_resolution;","uniform float u_ratio;","uniform float u_nodeRatio;","uniform float u_arrowHead;","uniform float u_scale;","uniform mat3 u_matrix;","uniform mat2 u_matrixHalfPi;","uniform mat2 u_matrixHalfPiMinus;","varying vec4 color;","void main() {","vec2 pos = normalize(a_pos2 - a_pos1);","mat2 matrix = (1.0 - a_head) *","(","a_minus * u_matrixHalfPiMinus +","(1.0 - a_minus) * u_matrixHalfPi",") + a_head * (","a_headPosition * u_matrixHalfPiMinus * 0.6 +","(a_headPosition * a_headPosition - 1.0) * mat2(1.0)",");","pos = a_pos1 + (","(1.0 - a_head) * a_thickness * u_ratio * matrix * pos +","a_head * u_arrowHead * a_thickness * u_ratio * matrix * pos +","a_delay * pos * (","a_tSize / u_nodeRatio +","u_arrowHead * a_thickness * u_ratio",")",");","gl_Position = vec4(","((u_matrix * vec3(pos, 1)).xy /","u_resolution * 2.0 - 1.0) * vec2(1, -1),","0,","1",");","float c = a_color;","color.b = mod(c, 256.0); c = floor(c / 256.0);","color.g = mod(c, 256.0); c = floor(c / 256.0);","color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;","color.a = 1.0;","}"].join("\n"),a.VERTEX_SHADER),c=sigma.utils.loadShader(a,["precision mediump float;","varying vec4 color;","void main(void) {","gl_FragColor = color;","}"].join("\n"),a.FRAGMENT_SHADER),d=sigma.utils.loadProgram(a,[b,c])}}}(),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.canvas.labels"),sigma.canvas.labels.def=function(a,b,c){var d,e=c("prefix")||"",f=a[e+"size"];f<c("labelThreshold")||"string"==typeof a.label&&(d="fixed"===c("labelSize")?c("defaultLabelSize"):c("labelSizeRatio")*f,b.font=(c("fontStyle")?c("fontStyle")+" ":"")+d+"px "+c("font"),b.fillStyle="node"===c("labelColor")?a.color||c("defaultNodeColor"):c("defaultLabelColor"),b.fillText(a.label,Math.round(a[e+"x"]+f+3),Math.round(a[e+"y"]+d/3)))}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.canvas.hovers"),sigma.canvas.hovers.def=function(a,b,c){var d,e,f,g,h,i=c("hoverFontStyle")||c("fontStyle"),j=c("prefix")||"",k=a[j+"size"],l="fixed"===c("labelSize")?c("defaultLabelSize"):c("labelSizeRatio")*k;b.font=(i?i+" ":"")+l+"px "+(c("hoverFont")||c("font")),b.beginPath(),b.fillStyle="node"===c("labelHoverBGColor")?a.color||c("defaultNodeColor"):c("defaultHoverLabelBGColor"),a.label&&c("labelHoverShadow")&&(b.shadowOffsetX=0,b.shadowOffsetY=0,b.shadowBlur=8,b.shadowColor=c("labelHoverShadowColor")),a.label&&"string"==typeof a.label&&(d=Math.round(a[j+"x"]-l/2-2),e=Math.round(a[j+"y"]-l/2-2),f=Math.round(b.measureText(a.label).width+l/2+k+7),g=Math.round(l+4),h=Math.round(l/2+2),b.moveTo(d,e+h),b.arcTo(d,e,d+h,e,h),b.lineTo(d+f,e),b.lineTo(d+f,e+g),b.lineTo(d+h,e+g),b.arcTo(d,e+g,d,e+g-h,h),b.lineTo(d,e+h),b.closePath(),b.fill(),b.shadowOffsetX=0,b.shadowOffsetY=0,b.shadowBlur=0),c("borderSize")>0&&(b.beginPath(),b.fillStyle="node"===c("nodeBorderColor")?a.color||c("defaultNodeColor"):c("defaultNodeBorderColor"),b.arc(a[j+"x"],a[j+"y"],k+c("borderSize"),0,2*Math.PI,!0),b.closePath(),b.fill());var m=sigma.canvas.nodes[a.type]||sigma.canvas.nodes.def;m(a,b,c),"string"==typeof a.label&&(b.fillStyle="node"===c("labelHoverColor")?a.color||c("defaultNodeColor"):c("defaultLabelHoverColor"),b.fillText(a.label,Math.round(a[j+"x"]+k+3),Math.round(a[j+"y"]+l/3)))}}.call(this),function(){"use strict";sigma.utils.pkg("sigma.canvas.nodes"),sigma.canvas.nodes.def=function(a,b,c){var d=c("prefix")||"";b.fillStyle=a.color||c("defaultNodeColor"),b.beginPath(),b.arc(a[d+"x"],a[d+"y"],a[d+"size"],0,2*Math.PI,!0),b.closePath(),b.fill()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.def=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.curve=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor"),l={},m=b[g+"size"],n=b[g+"x"],o=b[g+"y"],p=c[g+"x"],q=c[g+"y"];if(l=b.id===c.id?sigma.utils.getSelfLoopControlPoints(n,o,m):sigma.utils.getQuadraticControlPoint(n,o,p,q),!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(n,o),b.id===c.id?d.bezierCurveTo(l.x1,l.y1,l.x2,l.y2,p,q):d.quadraticCurveTo(l.x,l.y,p,q),d.stroke()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.arrow=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=e("edgeColor"),i=e("defaultNodeColor"),j=e("defaultEdgeColor"),k=a[g+"size"]||1,l=c[g+"size"],m=b[g+"x"],n=b[g+"y"],o=c[g+"x"],p=c[g+"y"],q=Math.max(2.5*k,e("minArrowSize")),r=Math.sqrt(Math.pow(o-m,2)+Math.pow(p-n,2)),s=m+(o-m)*(r-q-l)/r,t=n+(p-n)*(r-q-l)/r,u=(o-m)*q/r,v=(p-n)*q/r;if(!f)switch(h){case"source":f=b.color||i;break;case"target":f=c.color||i;break;default:f=j}d.strokeStyle=f,d.lineWidth=k,d.beginPath(),d.moveTo(m,n),d.lineTo(s,t),d.stroke(),d.fillStyle=f,d.beginPath(),d.moveTo(s+u,t+v),d.lineTo(s+.6*v,t-.6*u),d.lineTo(s-.6*v,t+.6*u),d.lineTo(s+u,t+v),d.closePath(),d.fill()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.curvedArrow=function(a,b,c,d,e){var f,g,h,i,j,k=a.color,l=e("prefix")||"",m=e("edgeColor"),n=e("defaultNodeColor"),o=e("defaultEdgeColor"),p={},q=a[l+"size"]||1,r=c[l+"size"],s=b[l+"x"],t=b[l+"y"],u=c[l+"x"],v=c[l+"y"],w=Math.max(2.5*q,e("minArrowSize"));if(p=b.id===c.id?sigma.utils.getSelfLoopControlPoints(s,t,r):sigma.utils.getQuadraticControlPoint(s,t,u,v),b.id===c.id?(f=Math.sqrt(Math.pow(u-p.x1,2)+Math.pow(v-p.y1,2)),g=p.x1+(u-p.x1)*(f-w-r)/f,h=p.y1+(v-p.y1)*(f-w-r)/f,i=(u-p.x1)*w/f,j=(v-p.y1)*w/f):(f=Math.sqrt(Math.pow(u-p.x,2)+Math.pow(v-p.y,2)),g=p.x+(u-p.x)*(f-w-r)/f,h=p.y+(v-p.y)*(f-w-r)/f,i=(u-p.x)*w/f,j=(v-p.y)*w/f),!k)switch(m){case"source":k=b.color||n;break;case"target":k=c.color||n;break;default:k=o}d.strokeStyle=k,d.lineWidth=q,d.beginPath(),d.moveTo(s,t),b.id===c.id?d.bezierCurveTo(p.x2,p.y2,p.x1,p.y1,g,h):d.quadraticCurveTo(p.x,p.y,g,h),d.stroke(),d.fillStyle=k,d.beginPath(),d.moveTo(g+i,h+j),d.lineTo(g+.6*j,h-.6*i),d.lineTo(g-.6*j,h+.6*i),d.lineTo(g+i,h+j),d.closePath(),d.fill()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.def=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,h*=e("edgeHoverSizeRatio"),d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.curve=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=e("edgeHoverSizeRatio")*(a[g+"size"]||1),i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor"),l={},m=b[g+"size"],n=b[g+"x"],o=b[g+"y"],p=c[g+"x"],q=c[g+"y"];if(l=b.id===c.id?sigma.utils.getSelfLoopControlPoints(n,o,m):sigma.utils.getQuadraticControlPoint(n,o,p,q),!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(n,o),b.id===c.id?d.bezierCurveTo(l.x1,l.y1,l.x2,l.y2,p,q):d.quadraticCurveTo(l.x,l.y,p,q),d.stroke()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.arrow=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=e("edgeColor"),i=e("defaultNodeColor"),j=e("defaultEdgeColor"),k=a[g+"size"]||1,l=c[g+"size"],m=b[g+"x"],n=b[g+"y"],o=c[g+"x"],p=c[g+"y"];k=a.hover?e("edgeHoverSizeRatio")*k:k;var q=2.5*k,r=Math.sqrt(Math.pow(o-m,2)+Math.pow(p-n,2)),s=m+(o-m)*(r-q-l)/r,t=n+(p-n)*(r-q-l)/r,u=(o-m)*q/r,v=(p-n)*q/r;if(!f)switch(h){case"source":f=b.color||i;break;case"target":f=c.color||i;break;default:f=j}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,d.strokeStyle=f,d.lineWidth=k,d.beginPath(),d.moveTo(m,n),d.lineTo(s,t),d.stroke(),d.fillStyle=f,d.beginPath(),d.moveTo(s+u,t+v),d.lineTo(s+.6*v,t-.6*u),d.lineTo(s-.6*v,t+.6*u),d.lineTo(s+u,t+v),d.closePath(),d.fill()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.curvedArrow=function(a,b,c,d,e){var f,g,h,i,j,k,l=a.color,m=e("prefix")||"",n=e("edgeColor"),o=e("defaultNodeColor"),p=e("defaultEdgeColor"),q={},r=e("edgeHoverSizeRatio")*(a[m+"size"]||1),s=c[m+"size"],t=b[m+"x"],u=b[m+"y"],v=c[m+"x"],w=c[m+"y"];if(q=b.id===c.id?sigma.utils.getSelfLoopControlPoints(t,u,s):sigma.utils.getQuadraticControlPoint(t,u,v,w),b.id===c.id?(f=Math.sqrt(Math.pow(v-q.x1,2)+Math.pow(w-q.y1,2)),g=2.5*r,h=q.x1+(v-q.x1)*(f-g-s)/f,i=q.y1+(w-q.y1)*(f-g-s)/f,j=(v-q.x1)*g/f,k=(w-q.y1)*g/f):(f=Math.sqrt(Math.pow(v-q.x,2)+Math.pow(w-q.y,2)),g=2.5*r,h=q.x+(v-q.x)*(f-g-s)/f,i=q.y+(w-q.y)*(f-g-s)/f,j=(v-q.x)*g/f,k=(w-q.y)*g/f),!l)switch(n){case"source":l=b.color||o;break;case"target":l=c.color||o;break;default:l=p}l="edge"===e("edgeHoverColor")?a.hover_color||l:a.hover_color||e("defaultEdgeHoverColor")||l,d.strokeStyle=l,d.lineWidth=r,d.beginPath(),d.moveTo(t,u),b.id===c.id?d.bezierCurveTo(q.x2,q.y2,q.x1,q.y1,h,i):d.quadraticCurveTo(q.x,q.y,h,i),d.stroke(),d.fillStyle=l,d.beginPath(),d.moveTo(h+j,i+k),d.lineTo(h+.6*k,i-.6*j),d.lineTo(h-.6*k,i+.6*j),d.lineTo(h+j,i+k),d.closePath(),d.fill()}}(),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.canvas.extremities"),sigma.canvas.extremities.def=function(a,b,c,d,e){(sigma.canvas.hovers[b.type]||sigma.canvas.hovers.def)(b,d,e),(sigma.canvas.hovers[c.type]||sigma.canvas.hovers.def)(c,d,e)}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.middlewares"),sigma.utils.pkg("sigma.utils"),sigma.middlewares.rescale=function(a,b,c){var d,e,f,g,h,i,j,k,l=this.graph.nodes(),m=this.graph.edges(),n=this.settings.embedObjects(c||{}),o=n("bounds")||sigma.utils.getBoundaries(this.graph,a,!0),p=o.minX,q=o.minY,r=o.maxX,s=o.maxY,t=o.sizeMax,u=o.weightMax,v=n("width")||1,w=n("height")||1,x=n("autoRescale"),y={nodePosition:1,nodeSize:1,edgeSize:1};for(x instanceof Array||(x=["nodePosition","nodeSize","edgeSize"]),d=0,e=x.length;e>d;d++)if(!y[x[d]])throw new Error('The rescale setting "'+x[d]+'" is not recognized.');var z=~x.indexOf("nodePosition"),A=~x.indexOf("nodeSize"),B=~x.indexOf("edgeSize");for(j="outside"===n("scalingMode")?Math.max(v/Math.max(r-p,1),w/Math.max(s-q,1)):Math.min(v/Math.max(r-p,1),w/Math.max(s-q,1)),k=(n("rescaleIgnoreSize")?0:(n("maxNodeSize")||t)/j)+(n("sideMargin")||0),r+=k,p-=k,s+=k,q-=k,j="outside"===n("scalingMode")?Math.max(v/Math.max(r-p,1),w/Math.max(s-q,1)):Math.min(v/Math.max(r-p,1),w/Math.max(s-q,1)),n("maxNodeSize")||n("minNodeSize")?n("maxNodeSize")===n("minNodeSize")?(f=0,g=+n("maxNodeSize")):(f=(n("maxNodeSize")-n("minNodeSize"))/t,g=+n("minNodeSize")):(f=1,g=0),n("maxEdgeSize")||n("minEdgeSize")?n("maxEdgeSize")===n("minEdgeSize")?(h=0,i=+n("minEdgeSize")):(h=(n("maxEdgeSize")-n("minEdgeSize"))/u,i=+n("minEdgeSize")):(h=1,i=0),d=0,e=m.length;e>d;d++)m[d][b+"size"]=m[d][a+"size"]*(B?h:1)+(B?i:0);for(d=0,e=l.length;e>d;d++)l[d][b+"size"]=l[d][a+"size"]*(A?f:1)+(A?g:0),l[d][b+"x"]=(l[d][a+"x"]-(r+p)/2)*(z?j:1),l[d][b+"y"]=(l[d][a+"y"]-(s+q)/2)*(z?j:1)},sigma.utils.getBoundaries=function(a,b,c){var d,e,f=a.edges(),g=a.nodes(),h=-1/0,i=-1/0,j=1/0,k=1/0,l=-1/0,m=-1/0;
if(c)for(d=0,e=f.length;e>d;d++)h=Math.max(f[d][b+"size"],h);for(d=0,e=g.length;e>d;d++)i=Math.max(g[d][b+"size"],i),l=Math.max(g[d][b+"x"],l),j=Math.min(g[d][b+"x"],j),m=Math.max(g[d][b+"y"],m),k=Math.min(g[d][b+"y"],k);return h=h||1,i=i||1,{weightMax:h,sizeMax:i,minX:j,minY:k,maxX:l,maxY:m}}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.middlewares"),sigma.middlewares.copy=function(a,b){var c,d,e;if(b+""!=a+""){for(e=this.graph.nodes(),c=0,d=e.length;d>c;c++)e[c][b+"x"]=e[c][a+"x"],e[c][b+"y"]=e[c][a+"y"],e[c][b+"size"]=e[c][a+"size"];for(e=this.graph.edges(),c=0,d=e.length;d>c;c++)e[c][b+"size"]=e[c][a+"size"]}}}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.misc.animation.running");var b=function(){var a=0;return function(){return""+ ++a}}();sigma.misc.animation.camera=function(c,d,e){if(!(c instanceof sigma.classes.camera&&"object"==typeof d&&d))throw"animation.camera: Wrong arguments.";if("number"!=typeof d.x&&"number"!=typeof d.y&&"number"!=typeof d.ratio&&"number"!=typeof d.angle)throw"There must be at least one valid coordinate in the given val.";var f,g,h,i,j,k,l=e||{},m=sigma.utils.dateNow();return k={x:c.x,y:c.y,ratio:c.ratio,angle:c.angle},j=l.duration,i="function"!=typeof l.easing?sigma.utils.easings[l.easing||"quadraticInOut"]:l.easing,f=function(){var b,e=l.duration?(sigma.utils.dateNow()-m)/l.duration:1;e>=1?(c.isAnimated=!1,c.goTo({x:d.x!==a?d.x:k.x,y:d.y!==a?d.y:k.y,ratio:d.ratio!==a?d.ratio:k.ratio,angle:d.angle!==a?d.angle:k.angle}),cancelAnimationFrame(g),delete sigma.misc.animation.running[g],"function"==typeof l.onComplete&&l.onComplete()):(b=i(e),c.isAnimated=!0,c.goTo({x:d.x!==a?k.x+(d.x-k.x)*b:k.x,y:d.y!==a?k.y+(d.y-k.y)*b:k.y,ratio:d.ratio!==a?k.ratio+(d.ratio-k.ratio)*b:k.ratio,angle:d.angle!==a?k.angle+(d.angle-k.angle)*b:k.angle}),"function"==typeof l.onNewFrame&&l.onNewFrame(),h.frameId=requestAnimationFrame(f))},g=b(),h={frameId:requestAnimationFrame(f),target:c,type:"camera",options:l,fn:f},sigma.misc.animation.running[g]=h,g},sigma.misc.animation.kill=function(a){if(1!==arguments.length||"number"!=typeof a)throw"animation.kill: Wrong arguments.";var b=sigma.misc.animation.running[a];return b&&(cancelAnimationFrame(a),delete sigma.misc.animation.running[b.frameId],"camera"===b.type&&(b.target.isAnimated=!1),"function"==typeof(b.options||{}).onComplete&&b.options.onComplete()),this},sigma.misc.animation.killAll=function(a){var b,c,d=0,e="string"==typeof a?a:null,f="object"==typeof a?a:null,g=sigma.misc.animation.running;for(c in g)e&&g[c].type!==e||f&&g[c].target!==f||(b=sigma.misc.animation.running[c],cancelAnimationFrame(b.frameId),delete sigma.misc.animation.running[c],"camera"===b.type&&(b.target.isAnimated=!1),d++,"function"==typeof(b.options||{}).onComplete&&b.options.onComplete());return d},sigma.misc.animation.has=function(a){var b,c="string"==typeof a?a:null,d="object"==typeof a?a:null,e=sigma.misc.animation.running;for(b in e)if(!(c&&e[b].type!==c||d&&e[b].target!==d))return!0;return!1}}.call(this),function(a){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.misc"),sigma.misc.bindEvents=function(b){function c(a){a&&(h="x"in a.data?a.data.x:h,i="y"in a.data?a.data.y:i);var c,d,e,f,g,k,l,m,n=[],o=h+j.width/2,p=i+j.height/2,q=j.camera.cameraPosition(h,i),r=j.camera.quadtree.point(q.x,q.y);if(r.length)for(c=0,e=r.length;e>c;c++)if(f=r[c],g=f[b+"x"],k=f[b+"y"],l=f[b+"size"],!f.hidden&&o>g-l&&g+l>o&&p>k-l&&k+l>p&&Math.sqrt(Math.pow(o-g,2)+Math.pow(p-k,2))<l){for(m=!1,d=0;d<n.length;d++)if(f.size>n[d].size){n.splice(d,0,f),m=!0;break}m||n.push(f)}return n}function d(c){function d(a,b){for(r=!1,g=0;g<a.length;g++)if(b.size>a[g].size){a.splice(g,0,b),r=!0;break}r||a.push(b)}if(!j.settings("enableEdgeHovering"))return[];var e=sigma.renderers.canvas&&j instanceof sigma.renderers.canvas;if(!e)throw new Error("The edge events feature is not compatible with the WebGL renderer");c&&(h="x"in c.data?c.data.x:h,i="y"in c.data?c.data.y:i);var f,g,k,l,m,n,o,p,q,r,s=j.settings("edgeHoverPrecision"),t={},u=[],v=h+j.width/2,w=i+j.height/2,x=j.camera.cameraPosition(h,i),y=[];if(e){var z=j.camera.quadtree.area(j.camera.getRectangle(j.width,j.height));for(l=z,f=0,k=l.length;k>f;f++)t[l[f].id]=l[f]}if(j.camera.edgequadtree!==a&&(y=j.camera.edgequadtree.point(x.x,x.y)),y.length)for(f=0,k=y.length;k>f;f++)m=y[f],o=j.graph.nodes(m.source),p=j.graph.nodes(m.target),n=m[b+"size"]||m["read_"+b+"size"],!m.hidden&&!o.hidden&&!p.hidden&&(!e||t[m.source]||t[m.target])&&sigma.utils.getDistance(o[b+"x"],o[b+"y"],v,w)>o[b+"size"]&&sigma.utils.getDistance(p[b+"x"],p[b+"y"],v,w)>p[b+"size"]&&("curve"==m.type||"curvedArrow"==m.type?o.id===p.id?(q=sigma.utils.getSelfLoopControlPoints(o[b+"x"],o[b+"y"],o[b+"size"]),sigma.utils.isPointOnBezierCurve(v,w,o[b+"x"],o[b+"y"],p[b+"x"],p[b+"y"],q.x1,q.y1,q.x2,q.y2,Math.max(n,s))&&d(u,m)):(q=sigma.utils.getQuadraticControlPoint(o[b+"x"],o[b+"y"],p[b+"x"],p[b+"y"]),sigma.utils.isPointOnQuadraticCurve(v,w,o[b+"x"],o[b+"y"],p[b+"x"],p[b+"y"],q.x,q.y,Math.max(n,s))&&d(u,m)):sigma.utils.isPointOnSegment(v,w,o[b+"x"],o[b+"y"],p[b+"x"],p[b+"y"],Math.max(n,s))&&d(u,m));return u}function e(a){function b(a){j.settings("eventsEnabled")&&(j.dispatchEvent("click",a.data),i=c(a),k=d(a),i.length?(j.dispatchEvent("clickNode",{node:i[0],captor:a.data}),j.dispatchEvent("clickNodes",{node:i,captor:a.data})):k.length?(j.dispatchEvent("clickEdge",{edge:k[0],captor:a.data}),j.dispatchEvent("clickEdges",{edge:k,captor:a.data})):j.dispatchEvent("clickStage",{captor:a.data}))}function e(a){j.settings("eventsEnabled")&&(j.dispatchEvent("doubleClick",a.data),i=c(a),k=d(a),i.length?(j.dispatchEvent("doubleClickNode",{node:i[0],captor:a.data}),j.dispatchEvent("doubleClickNodes",{node:i,captor:a.data})):k.length?(j.dispatchEvent("doubleClickEdge",{edge:k[0],captor:a.data}),j.dispatchEvent("doubleClickEdges",{edge:k,captor:a.data})):j.dispatchEvent("doubleClickStage",{captor:a.data}))}function f(a){j.settings("eventsEnabled")&&(j.dispatchEvent("rightClick",a.data),i.length?(j.dispatchEvent("rightClickNode",{node:i[0],captor:a.data}),j.dispatchEvent("rightClickNodes",{node:i,captor:a.data})):k.length?(j.dispatchEvent("rightClickEdge",{edge:k[0],captor:a.data}),j.dispatchEvent("rightClickEdges",{edge:k,captor:a.data})):j.dispatchEvent("rightClickStage",{captor:a.data}))}function g(a){if(j.settings("eventsEnabled")){var b,c,d,e,f=[],g=[];for(b in l)f.push(l[b]);for(l={},c=0,d=f.length;d>c;c++)j.dispatchEvent("outNode",{node:f[c],captor:a.data});for(f.length&&j.dispatchEvent("outNodes",{nodes:f,captor:a.data}),m={},c=0,d=g.length;e>c;c++)j.dispatchEvent("outEdge",{edge:g[c],captor:a.data});f.length&&j.dispatchEvent("outEdges",{edges:g,captor:a.data})}}function h(a){if(j.settings("eventsEnabled")){i=c(a),k=d(a);var b,e,f,g,h=[],n=[],o={},p=i.length,q=[],r=[],s={},t=k.length;for(b=0;p>b;b++)f=i[b],o[f.id]=f,l[f.id]||(n.push(f),l[f.id]=f);for(e in l)o[e]||(h.push(l[e]),delete l[e]);for(b=0,p=n.length;p>b;b++)j.dispatchEvent("overNode",{node:n[b],captor:a.data});for(b=0,p=h.length;p>b;b++)j.dispatchEvent("outNode",{node:h[b],captor:a.data});for(n.length&&j.dispatchEvent("overNodes",{nodes:n,captor:a.data}),h.length&&j.dispatchEvent("outNodes",{nodes:h,captor:a.data}),b=0;t>b;b++)g=k[b],s[g.id]=g,m[g.id]||(r.push(g),m[g.id]=g);for(e in m)s[e]||(q.push(m[e]),delete m[e]);for(b=0,t=r.length;t>b;b++)j.dispatchEvent("overEdge",{edge:r[b],captor:a.data});for(b=0,t=q.length;t>b;b++)j.dispatchEvent("outEdge",{edge:q[b],captor:a.data});r.length&&j.dispatchEvent("overEdges",{edges:r,captor:a.data}),q.length&&j.dispatchEvent("outEdges",{edges:q,captor:a.data})}}var i,k,l={},m={};a.bind("click",b),a.bind("mousedown",h),a.bind("mouseup",h),a.bind("mousemove",h),a.bind("mouseout",g),a.bind("doubleclick",e),a.bind("rightclick",f),j.bind("render",h)}var f,g,h,i,j=this;for(f=0,g=this.captors.length;g>f;f++)e(this.captors[f])}}.call(this),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.misc"),sigma.misc.drawHovers=function(a){function b(){c.contexts.hover.canvas.width=c.contexts.hover.canvas.width;var b,f,g,h,i,j=c.settings("defaultNodeType"),k=c.settings("defaultEdgeType"),l=sigma.canvas.hovers,m=sigma.canvas.edgehovers,n=sigma.canvas.extremities,o=c.settings.embedObjects({prefix:a});if(o("enableHovering")&&o("singleHover")&&Object.keys(d).length&&(h=d[Object.keys(d)[0]],(l[h.type]||l[j]||l.def)(h,c.contexts.hover,o)),o("enableHovering")&&!o("singleHover"))for(b in d)(l[d[b].type]||l[j]||l.def)(d[b],c.contexts.hover,o);if(o("enableEdgeHovering")&&o("singleHover")&&Object.keys(e).length&&(i=e[Object.keys(e)[0]],f=c.graph.nodes(i.source),g=c.graph.nodes(i.target),i.hidden||((m[i.type]||m[k]||m.def)(i,f,g,c.contexts.hover,o),o("edgeHoverExtremities")?(n[i.type]||n.def)(i,f,g,c.contexts.hover,o):((sigma.canvas.nodes[f.type]||sigma.canvas.nodes.def)(f,c.contexts.hover,o),(sigma.canvas.nodes[g.type]||sigma.canvas.nodes.def)(g,c.contexts.hover,o)))),o("enableEdgeHovering")&&!o("singleHover"))for(b in e)i=e[b],f=c.graph.nodes(i.source),g=c.graph.nodes(i.target),i.hidden||((m[i.type]||m[k]||m.def)(i,f,g,c.contexts.hover,o),o("edgeHoverExtremities")?(n[i.type]||n.def)(i,f,g,c.contexts.hover,o):((sigma.canvas.nodes[f.type]||sigma.canvas.nodes.def)(f,c.contexts.hover,o),(sigma.canvas.nodes[g.type]||sigma.canvas.nodes.def)(g,c.contexts.hover,o)))}var c=this,d={},e={};this.bind("overNode",function(a){var c=a.data.node;c.hidden||(d[c.id]=c,b())}),this.bind("outNode",function(a){delete d[a.data.node.id],b()}),this.bind("overEdge",function(a){var c=a.data.edge;c.hidden||(e[c.id]=c,b())}),this.bind("outEdge",function(a){delete e[a.data.edge.id],b()}),this.bind("render",function(){b()})}}.call(this),!function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.dashed=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,h*=e("edgeHoverSizeRatio"),d.save(),d.setLineDash([8,3]),d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.dotted=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,h*=e("edgeHoverSizeRatio"),d.save(),d.setLineDash([2]),d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.parallel=function(a,b,c,d,e){var f,g,h=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,i=e("prefix")||"",j=a[i+"size"]||1,k=e("edgeColor"),l=e("defaultNodeColor"),m=e("defaultEdgeColor"),n=b[i+"x"],o=b[i+"y"],p=c[i+"x"],q=c[i+"y"],r=sigma.utils.getDistance(n,o,p,q);if(!h)switch(k){case"source":h=b.color||l;break;case"target":h=c.color||l;break;default:h=m}h="edge"===e("edgeHoverColor")?a.hover_color||h:a.hover_color||e("defaultEdgeHoverColor")||h,j*=e("edgeHoverSizeRatio"),f=sigma.utils.getCircleIntersection(n,o,j,p,q,r),g=sigma.utils.getCircleIntersection(p,q,j,n,o,r),d.save(),d.strokeStyle=h,d.lineWidth=j,d.beginPath(),d.moveTo(f.xi,f.yi),d.lineTo(g.xi_prime,g.yi_prime),d.closePath(),d.stroke(),d.beginPath(),d.moveTo(f.xi_prime,f.yi_prime),d.lineTo(g.xi,g.yi),d.closePath(),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edgehovers"),sigma.canvas.edgehovers.tapered=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),g=e("prefix")||"",j=e("defaultNodeColor"),k=e("defaultEdgeColor"),l=b[g+"x"],m=b[g+"y"],n=c[g+"x"],o=c[g+"y"],p=sigma.utils.getDistance(l,m,n,o);if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}f="edge"===e("edgeHoverColor")?a.hover_color||f:a.hover_color||e("defaultEdgeHoverColor")||f,h*=e("edgeHoverSizeRatio");var q=sigma.utils.getCircleIntersection(l,m,h,n,o,p);d.save(),d.globalAlpha=.65,d.fillStyle=f,d.beginPath(),d.moveTo(n,o),d.lineTo(q.xi,q.yi),d.lineTo(q.xi_prime,q.yi_prime),d.closePath(),d.fill(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.dashed=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}d.save(),d.strokeStyle=a.active?"edge"===e("edgeActiveColor")?f||k:e("defaultEdgeActiveColor"):f,d.setLineDash([8,3]),d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.dotted=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),j=e("defaultNodeColor"),k=e("defaultEdgeColor");if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}d.save(),d.strokeStyle=a.active?"edge"===e("edgeActiveColor")?f||k:e("defaultEdgeActiveColor"):f,d.setLineDash([2]),d.lineWidth=h,d.beginPath(),d.moveTo(b[g+"x"],b[g+"y"]),d.lineTo(c[g+"x"],c[g+"y"]),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.parallel=function(a,b,c,d,e){var f,g,h=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,i=e("prefix")||"",j=a[i+"size"]||1,k=e("edgeColor"),l=e("defaultNodeColor"),m=e("defaultEdgeColor"),n=b[i+"x"],o=b[i+"y"],p=c[i+"x"],q=c[i+"y"],r=sigma.utils.getDistance(n,o,p,q);if(!h)switch(k){case"source":h=b.color||l;break;case"target":h=c.color||l;break;default:h=m}f=sigma.utils.getCircleIntersection(n,o,j,p,q,r),g=sigma.utils.getCircleIntersection(p,q,j,n,o,r),d.save(),d.strokeStyle=a.active?"edge"===e("edgeActiveColor")?h||m:e("defaultEdgeActiveColor"):h,d.lineWidth=j,d.beginPath(),d.moveTo(f.xi,f.yi),d.lineTo(g.xi_prime,g.yi_prime),d.closePath(),d.stroke(),d.beginPath(),d.moveTo(f.xi_prime,f.yi_prime),d.lineTo(g.xi,g.yi),d.closePath(),d.stroke(),d.restore()}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.tapered=function(a,b,c,d,e){var f=a.active?a.active_color||e("defaultEdgeActiveColor"):a.color,g=e("prefix")||"",h=a[g+"size"]||1,i=e("edgeColor"),g=e("prefix")||"",j=e("defaultNodeColor"),k=e("defaultEdgeColor"),l=b[g+"x"],m=b[g+"y"],n=c[g+"x"],o=c[g+"y"],p=sigma.utils.getDistance(l,m,n,o);if(!f)switch(i){case"source":f=b.color||j;break;case"target":f=c.color||j;break;default:f=k}var q=sigma.utils.getCircleIntersection(l,m,h,n,o,p);d.save(),d.fillStyle=a.active?"edge"===e("edgeActiveColor")?f||k:e("defaultEdgeActiveColor"):f,d.globalAlpha=.65,d.beginPath(),d.moveTo(n,o),d.lineTo(q.xi,q.yi),d.lineTo(q.xi_prime,q.yi_prime),d.closePath(),d.fill(),d.restore()}}(),function(){"use strict";if("undefined"==typeof sigma)throw"sigma is not declared";sigma.utils.pkg("sigma.parsers"),sigma.utils.pkg("sigma.utils"),sigma.utils.xhr=function(){if(window.XMLHttpRequest)return new XMLHttpRequest;var a,b;if(window.ActiveXObject){a=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];for(b in a)try{return new ActiveXObject(a[b])}catch(c){}}return null},sigma.parsers.json=function(a,b,c){var d,e=sigma.utils.xhr();if(!e)throw"XMLHttpRequest not supported, cannot load the file.";e.open("GET",a,!0),e.onreadystatechange=function(){4===e.readyState&&(d=JSON.parse(e.responseText),b instanceof sigma?(b.graph.clear(),b.graph.read(d)):"object"==typeof b?(b.graph=d,b=new sigma(b)):"function"==typeof b&&(c=b,b=null),c&&c(b||d))},e.send()}}.call(this),"undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.4",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a(f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.4",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")&&(c.prop("checked")&&this.$element.hasClass("active")?a=!1:b.find(".active").removeClass("active")),a&&c.prop("checked",!this.$element.hasClass("active")).trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active"));a&&this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target);d.hasClass("btn")||(d=d.closest(".btn")),b.call(d,"toggle"),c.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.4",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));return a>this.$items.length-1||0>a?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&/show|hide/.test(b)&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a('[data-toggle="collapse"][href="#'+b.id+'"],[data-toggle="collapse"][data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.4",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":e.data();c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){b&&3===b.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=c(d),f={relatedTarget:this};e.hasClass("open")&&(e.trigger(b=a.Event("hide.bs.dropdown",f)),b.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger("hidden.bs.dropdown",f)))}))}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.4",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger("shown.bs.dropdown",h)}return!1}},g.prototype.keydown=function(b){if(/(38|40|27|32)/.test(b.which)&&!/input|textarea/i.test(b.target.tagName)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var e=c(d),g=e.hasClass("open");if(!g&&27!=b.which||g&&27==b.which)return 27==b.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.disabled):visible a",i=e.find('[role="menu"]'+h+', [role="listbox"]'+h);if(i.length){var j=i.index(b.target);38==b.which&&j>0&&j--,40==b.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",'[role="menu"]',g.prototype.keydown).on("keydown.bs.dropdown.data-api",'[role="listbox"]',g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.4",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in").attr("aria-hidden",!1),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),
this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a('<div class="modal-backdrop '+e+'" />').appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.init("tooltip",a,b)};c.VERSION="3.3.4",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){if(this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(this.options.viewport.selector||this.options.viewport),this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c&&c.$tip&&c.$tip.is(":visible")?void(c.hoverState="in"):(c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.options.container?a(this.options.container):this.$element.parent(),p=this.getPosition(o);h="bottom"==h&&k.bottom+m>p.bottom?"top":"top"==h&&k.top-m<p.top?"bottom":"right"==h&&k.right+l>p.width?"left":"left"==h&&k.left-l<p.left?"right":h,f.removeClass(n).addClass(h)}var q=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(q,h);var r=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",r).emulateTransitionEnd(c.TRANSITION_DURATION):r()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top=b.top+g,b.left=b.left+h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=a(this.$tip),g=a.Event("hide.bs."+this.type);return this.$element.trigger(g),g.isDefaultPrevented()?void 0:(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=d?{top:0,left:0}:b.offset(),g={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},h=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,g,h,f)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.width&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type)})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.4",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){this.$body=a(document.body),this.$scrollElement=a(a(c).is(document.body)?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",a.proxy(this.process,this)),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.4",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b=this,c="offset",d=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),a.isWindow(this.$scrollElement[0])||(c="position",d=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var b=a(this),e=b.data("target")||b.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[c]().top+d,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(void 0===e[a+1]||b<e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.4",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu").length&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.4",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return c>e?"top":!1;if("bottom"==this.affixed)return null!=c?e+this.unpin<=f.top?!1:"bottom":a-d>=e+g?!1:"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&c>=e?"top":null!=d&&i+j>=a-d?"bottom":!1},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=a(document.body).height();"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery),window.CWN||(window.CWN={}),CWN.colors={base:"#ffffca",lightGrey:"#7b7b79",green:"#8fd248",salmon:"#ffcd96",lightBlue:"#91cbdd",red:"#ff0800",blue:"#4f7fbf",purple:"#7228a2",black:"#000000"},CWN.colors.rgb={base:[255,255,202],lightGrey:[70,70,70],green:[143,210,72],salmon:[255,205,150],lightBlue:[145,203,221],red:[255,8,0],blue:[79,127,191],purple:[114,40,162],black:[0,0,0]},CWN.chartLoadHandlers=[],google.load("visualization","1",{packages:["corechart","table"],callback:function(){for(var a=0;a<CWN.chartLoadHandlers.length;a++)CWN.chartLoadHandlers[a]()}}),CWN.render={},CWN.icon=function(a,b,c){var d=document.createElement("canvas");if(d.width=b,d.height=c,!CWN.render[a])return d;var e=d.getContext("2d");return CWN.render[a](e,2,2,b-4,c-4),d},CWN.getColor=function(a,b){return void 0===b&&(b=1),"rgba("+CWN.colors.rgb[a].join(",")+","+b+")"},CWN.render.Junction=function(a,b){a.fillStyle=b.fill||CWN.getColor("base",b.opacity),a.strokeStyle=b.stroke||CWN.getColor("lightGrey",b.opacity),a.lineWidth=b.lineWidth||2;var c=b.width/2;a.beginPath(),a.arc(b.x+c,b.y+c,c,0,2*Math.PI,!0),a.closePath(),a.fill(),a.stroke()},CWN.render["Power Plant"]=function(a,b){CWN.render.Junction(a,b);var c=b.width/2;a.beginPath(),a.moveTo(b.x,b.y+c),a.lineTo(b.x+b.width,b.y+c),a.stroke(),a.closePath(),a.beginPath(),a.moveTo(b.x+c,b.y),a.lineTo(b.x+c,b.y+b.width),a.stroke(),a.closePath()},CWN.render["Pump Plant"]=function(a,b){CWN.render.Junction(a,b);var c=b.width/2,d=b.x+c,e=b.y+c,f=d+c*Math.cos(Math.PI/4),g=e+c*Math.sin(Math.PI/4),h=d+c*Math.cos(Math.PI*(5/4)),i=e+c*Math.sin(Math.PI*(5/4));a.beginPath(),a.moveTo(f,g),a.lineTo(h,i),a.stroke(),a.closePath(),f=d+c*Math.cos(.75*Math.PI),g=e+c*Math.sin(.75*Math.PI),h=d+c*Math.cos(Math.PI*(7/4)),i=e+c*Math.sin(Math.PI*(7/4)),a.beginPath(),a.moveTo(f,g),a.lineTo(h,i),a.stroke(),a.closePath()},CWN.render["Water Treatment"]=function(a,b){a.fillStyle=b.fill||CWN.getColor("base",b.opacity),a.strokeStyle=b.stroke||CWN.getColor("lightGrey",b.opacity),a.lineWidth=b.lineWidth||2,CWN.render._nSidedPath(a,b.x,b.y,b.width/2,8,22.5),a.fill(),a.closePath(),a.stroke()},CWN.render["Surface Storage"]=function(a,b){a.fillStyle=b.fill||CWN.getColor("base",b.opacity),a.strokeStyle=b.stroke||CWN.getColor("lightGrey",b.opacity),a.lineWidth=b.lineWidth||2,CWN.render._nSidedPath(a,b.x,b.y,b.width/2,3,90),a.fill(),a.closePath(),a.stroke()},CWN.render["Groundwater Storage"]=function(a,b){var c=b.width/2,d=a.createLinearGradient(b.x+c,b.y,b.x+c,b.y+b.height-.25*b.height);d.addColorStop(0,b.stroke||CWN.getColor("lightGrey",b.opacity)),d.addColorStop(1,b.fill||CWN.getColor("base",b.opacity)),a.fillStyle=d,a.strokeStyle=b.stroke||CWN.getColor("lightGrey",b.opacity),a.lineWidth=b.lineWidth||2,CWN.render._nSidedPath(a,b.x,b.y,c,3,90),a.fill(),a.closePath(),a.stroke()},CWN.render.Sink=function(a,b){a.fillStyle=b.fill||CWN.getColor("base",b.opacity),a.strokeStyle=b.stroke||CWN.getColor("lightGrey",b.opacity),a.lineWidth=b.lineWidth||2,CWN.render._nSidedPath(a,b.x,b.y,b.width/2,4,45),a.fill(),a.closePath(),a.stroke()},CWN.render["Non-Standard Demand"]=function(a,b){a.fillStyle=b.fill||CWN.getColor("red",b.opacity),a.strokeStyle=b.stroke||CWN.getColor("lightGrey",b.opacity),a.lineWidth=b.lineWidth||2,CWN.render._nSidedPath(a,b.x,b.y,b.width/2,4,45),a.fill(),a.closePath(),a.stroke()},CWN.render["Agricultural Demand"]=function(a,b){b.stroke||(b.stroke=CWN.getColor("lightGrey",b.opacity)),b.fill||(b.fill=CWN.getColor("lightBlue",b.opacity)),CWN.render._oval(a,b)},CWN.render["Urban Demand"]=function(a,b){b.stroke||(b.stroke=CWN.getColor("lightGrey",b.opacity)),b.fill||(b.fill=CWN.getColor("salmon",b.opacity)),CWN.render._oval(a,b)},CWN.render.Wetland=function(a,b){b.stroke||(b.stroke=CWN.getColor("lightGrey",b.opacity)),b.fill||(b.fill=CWN.getColor("green",b.opacity)),CWN.render._oval(a,b)},CWN.render._oval=function(a,b){a.fillStyle=b.fill,a.strokeStyle=b.stroke,b.height-=.5*b.width,b.y+=b.height/2;var c=.5522848,d=b.width/2*c,e=b.height/2*c,f=b.x+b.width,g=b.y+b.height,h=b.x+b.width/2,i=b.y+b.height/2;a.beginPath(),a.moveTo(b.x,i),a.bezierCurveTo(b.x,i-e,h-d,b.y,h,b.y),a.bezierCurveTo(h+d,b.y,f,i-e,f,i),a.bezierCurveTo(f,i+e,h+d,g,h,g),a.bezierCurveTo(h-d,g,b.x,i+e,b.x,i),a.fill(),a.stroke()},CWN.render._nSidedPath=function(a,b,c,d,e,f){b+=d,c+=d;var g,h,i=2*Math.PI/e,j=f*(Math.PI/180);a.beginPath();var k=b+d*Math.cos(-1*j),l=c+d*Math.sin(-1*j);a.moveTo(k,l);for(var m=1;e>m;m++)g=b+d*Math.cos(i*m-j),h=c+d*Math.sin(i*m-j),a.lineTo(g,h);a.lineTo(k,l)},CWN.render.lineMarkers={cost:function(a,b,c,d){a.beginPath(),a.arc(b,c,d,0,2*Math.PI,!1),a.fillStyle=CWN.colors.green,a.fill(),a.closePath()},amplitude:function(a,b,c,d){a.beginPath(),a.arc(b,c,d,0,2*Math.PI,!1),a.lineWidth=2,a.strokeStyle=CWN.colors.black,a.stroke(),a.closePath()},constraints:function(a,b,c,d,e,f){a.beginPath();var g=.4*e,h=.4*f;a.beginPath(),a.moveTo(b+f+g,c-e+h),a.lineTo(b+f-g,c-e-h),a.lineTo(b-f-g,c+e-h),a.lineTo(b-f+g,c+e+h),a.lineTo(b+f+g,c-e+h),a.strokeStyle=CWN.colors.black,a.stroke(),a.closePath()},environmental:function(a,b,c,d){a.beginPath(),a.arc(b,c,d,0,2*Math.PI,!1),a.lineWidth=2,a.strokeStyle=CWN.colors.green,a.stroke(),a.closePath()}},function(){"use strict";sigma.utils.pkg("sigma.canvas.nodes"),sigma.canvas.nodes.Junction=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render.Junction(b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Power Plant"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Power Plant"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Pump Plant"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Pump Plant"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Water Treatment"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Water Treatment"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Surface Storage"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Surface Storage"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Groundwater Storage"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Groundwater Storage"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Agricultural Demand"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Agricultural Demand"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Urban Demand"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Urban Demand"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes.Sink=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render.Sink(b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes["Non-Standard Demand"]=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render["Non-Standard Demand"](b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)},sigma.canvas.nodes.Wetland=function(a,b,c){var d=c("prefix")||"",e=2*a[d+"size"];CWN.render.Wetland(b,a[d+"x"]-a[d+"size"],a[d+"y"]-a[d+"size"],e,e)}}(),function(){"use strict";sigma.utils.pkg("sigma.canvas.edges"),sigma.canvas.edges.cwn=function(a,b,c,d,e){var f=a.color,g=e("prefix")||"",h=(e("edgeColor"),e("defaultNodeColor"),e("defaultEdgeColor"),a[g+"size"]||1),i=c[g+"size"],j=b[g+"x"],k=b[g+"y"],l=c[g+"x"],m=c[g+"y"],n=Math.max(2.5*h,e("minArrowSize")),o=Math.sqrt(Math.pow(l-j,2)+Math.pow(m-k,2)),p=j+(l-j)*(o-n-i)/o,q=k+(m-k)*(o-n-i)/o,r=(l-j)*n/o,s=(m-k)*n/o,f=CWN.colors.salmon;a.calvin.renderInfo&&("flowToSink"==a.calvin.renderInfo.type?f=CWN.colors.lightGrey:"returnFlowFromDemand"==a.calvin.renderInfo.type?f=CWN.colors.red:"gwToDemand"==a.calvin.renderInfo.type?f=CWN.colors.black:"artificalRecharge"==a.calvin.renderInfo.type&&(f=CWN.colors.purple)),d.strokeStyle=f,d.lineWidth=h,d.beginPath(),d.moveTo(j,k),d.lineTo(p,q),d.stroke(),d.fillStyle=f,d.beginPath(),d.moveTo(p+r,q+s),d.lineTo(p+.6*s,q-.6*r),d.lineTo(p-.6*s,q+.6*r),d.lineTo(p+r,q+s),d.closePath(),d.fill();var t=j+3*r,u=k+3*s;if(a.calvin.renderInfo)for(var v in CWN.render.lineMarkers)a.calvin.renderInfo[v]&&(CWN.render.lineMarkers[v](d,t,u,4,r,s),t+=1.75*r,u+=1.75*s)}}(),CWN.ds=new Datastore,function(){function a(a,b,c,d,e){o=e.oneStep?.3:.7,e.point=b,ms=(d.size||20)*(e.multipier||1),buffer=ms/2,CWN.render[d.geojson.properties.type](a,{x:b.x-10,y:b.y-10,width:ms,height:ms,opacity:o,fill:e.fill,stroke:e.stroke,lineWidth:e.lineWidth})}function b(a,b,c,e,f){color="white",f.highlight&&("origin"==f.highlight?color="green":color="red"),a.beginPath(),a.strokeStyle=color,a.lineWidth=4,a.moveTo(b[0].x,b[0].y),a.lineTo(b[1].x,b[1].y),a.stroke(),a.beginPath(),a.strokeStyle=d(e.geojson),a.lineWidth=2,a.moveTo(b[0].x,b[0].y),a.lineTo(b[1].x,b[1].y),a.stroke()}function c(a,b,c,d,e){var f;if(!(b.length<=1)){a.beginPath(),f=b[0],a.moveTo(f.x,f.y);for(var g=1;g<b.length;g++)a.lineTo(b[g].x,b[g].y);a.lineTo(b[0].x,b[0].y),a.strokeStyle=e.hover?"red":"rgba("+CWN.colors.rgb.blue.join(",")+",.8)",a.fillStyle=e.fillStyle?e.fillStyle:"rgba("+CWN.colors.rgb.blue.join(",")+",.4)",a.lineWidth=4,a.stroke(),a.fill()}}function d(a){var b=CWN.colors.salmon;a.properties.renderInfo&&("flowToSink"==a.properties.renderInfo.type?b=CWN.colors.lightGrey:"returnFlowFromDemand"==a.properties.renderInfo.type?b=CWN.colors.red:"gwToDemand"==a.properties.renderInfo.type?b=CWN.colors.black:"artificalRecharge"==a.properties.renderInfo.type&&(b=CWN.colors.purple));var c={color:b,weight:3,opacity:.4,smoothFactor:1};return a.properties.calibrationNode&&this.mapFilters.calibrationMode&&(c.color="blue"),b}CWN.map={},CWN.map.renderer={},CWN.map.renderer.basic=function(d,e,f,g){var h=g.geojson.properties._render||{};"Point"==g.geojson.geometry.type?a(d,e,f,g,h):"LineString"==g.geojson.geometry.type?b(d,e,f,g,h):"Polygon"==g.geojson.geometry.type&&c(d,e,f,g,h)}}(),L.Icon.LineCanvas=L.Icon.extend({options:{iconSize:new L.Point(20,20),className:"LineCanvas"},_transformProps:["webkitTransform","MozTransform","msTransform","transform"],createIcon:function(){var a=document.createElement("div"),b=document.createElement("canvas");a.appendChild(b),this._setIconStyles(a,"icon");var c=this.options.iconSize;b.width=c.x,b.height=c.y,this.draw(b.getContext("2d"),c.x,c.y);for(var d=this.options.renderInfo.rotate||0,e=0;e<this._transformProps.length;e++)b.style[this._transformProps[e]]="rotate("+d+"deg)";return this.options.hide&&(a.style.display="none"),a},createShadow:function(){return null},draw:function(a,b,c){a.beginPath(),a.moveTo(0,0),a.lineTo(b,0),a.lineTo(b,c),a.lineTo(0,c),a.moveTo(0,0),a.closePath(),a.stroke();var d=5,e=c/2,f=10,g=10;if(this.options.renderInfo)for(var h in CWN.render.lineMarkers)this.options.renderInfo[h]&&(CWN.render.lineMarkers[h](a,d,e,4,f,g),d+=1.75*f)}}),L.Icon.Canvas=L.Icon.extend({options:{iconSize:new L.Point(20,20),className:"leaflet-canvas-icon"},createIcon:function(){var a=document.createElement("canvas");this._setIconStyles(a,"icon");var b=this.options.iconSize;if(a.width=b.x,a.height=b.y,this.draw(a.getContext("2d"),b.x,b.y),this.options.name){var c=$('<div style="z-index:1000;position:absolute;padding:5px;background-color:white;border:1px solid #ccc">'+this.options.name+"</div>");$(a).on("mouseover",function(a){c.css("top",a.clientY+30).css("left",a.clientX),$("body").append(c)}).on("mouseout",function(){c.remove()})}return a},createShadow:function(){return null},draw:function(a,b,c){CWN.render[this.options.type](a,2,2,b-4,c-4)}}),"undefined"!=typeof L&&(L.CanvasLayer=L.Class.extend({includes:[L.Mixin.Events],options:{minZoom:0,maxZoom:28,tileSize:256,subdomains:"abc",errorTileUrl:"",attribution:"",zoomOffset:0,opacity:1,unloadInvisibleTiles:L.Browser.mobile,
updateWhenIdle:L.Browser.mobile},initialize:function(a){a=a||{},this.render=this.render.bind(this),L.Util.setOptions(this,a),this._canvas=this._createCanvas(),this._backCanvas=this._createCanvas(),this._ctx=this._canvas.getContext("2d")},_createCanvas:function(){var a;a=document.createElement("canvas"),a.style.position="absolute",a.style.top=0,a.style.left=0,a.style.pointerEvents="none",a.style.zIndex=this.options.zIndex||0;var b="leaflet-tile-container leaflet-zoom-animated";return a.setAttribute("class",b),a},onAdd:function(a){this._map=a;var b=this._map._panes.tilePane,c=L.DomUtil.create("div","leaflet-layer");c.appendChild(this._canvas),c.appendChild(this._backCanvas),this._backCanvas.style.display="none",b.appendChild(c),this._container=c,a.dragging.enabled()&&a.dragging._draggable.on("predrag",function(){var b=a.dragging._draggable;L.DomUtil.setPosition(this._canvas,{x:-b._newPos.x,y:-b._newPos.y})},this),a.on({viewreset:this._reset},this),a.on("move",this.render,this),a.on("resize",this._reset,this),a.on({zoomstart:this._startZoom,zoomend:this._endZoom},this),this._reset()},_startZoom:function(){this._canvas.style.visibility="hidden"},_endZoom:function(){this._canvas.style.visibility="visible"},getCanvas:function(){return this._canvas},getAttribution:function(){return this.options.attribution},draw:function(){return this._reset()},onRemove:function(a){this._container.parentNode.removeChild(this._container),a.off({viewreset:this._reset,move:this._render,resize:this._reset,zoomanim:this._animateZoom,zoomend:this._endZoomAnim},this)},addTo:function(a){return a.addLayer(this),this},setOpacity:function(a){return this.options.opacity=a,this._updateOpacity(),this},setZIndex:function(a){this._canvas.style.zIndex=a},bringToFront:function(){return this},bringToBack:function(){return this},_reset:function(){var a=this._map.getSize();this._canvas.width=a.x,this._canvas.height=a.y;var b=L.DomUtil.getPosition(this._map.getPanes().mapPane);b&&L.DomUtil.setPosition(this._canvas,{x:-b.x,y:-b.y}),this.onResize(),this.render()},_updateOpacity:function(){},_render:function(){},redraw:function(a){a?this.render():this._render()},onResize:function(){},render:function(){throw new Error("render function should be implemented")}})),CWN.MapController=function(a){a.map;this.regions=regions,this.lookup={},this.initLookup=function(a){this.lookup[a.name]=a,a.subregions&&a.subregions.forEach(this.initLookup.bind(this))},this.initLookup(regions)};var GeoJSONUtils=function(){function a(a){for(var b=[],c=[],d=0;d<a[0].length;d++)b.push(a[0][d][1]),c.push(a[0][d][0]);return b=b.sort(function(a,b){return a-b}),c=c.sort(function(a,b){return a-b}),[[b[0],c[0]],[b[b.length-1],c[c.length-1]]]}function b(a,b,c){for(var d=[[0,0]],e=0;e<c.length;e++){for(var f=0;f<c[e].length;f++)d.push(c[e][f]);d.push(c[e][0]),d.push([0,0])}for(var g=!1,e=0,f=d.length-1;e<d.length;f=e++)d[e][0]>b!=d[f][0]>b&&a<(d[f][1]-d[e][1])*(b-d[e][0])/(d[f][0]-d[e][0])+d[e][1]&&(g=!g);return g}var c=this.gju={};return c.lineStringsIntersect=function(a,b){for(var c=[],d=0;d<=a.coordinates.length-2;++d)for(var e=0;e<=b.coordinates.length-2;++e){var f={x:a.coordinates[d][1],y:a.coordinates[d][0]},g={x:a.coordinates[d+1][1],y:a.coordinates[d+1][0]},h={x:b.coordinates[e][1],y:b.coordinates[e][0]},i={x:b.coordinates[e+1][1],y:b.coordinates[e+1][0]},j=(i.x-h.x)*(f.y-h.y)-(i.y-h.y)*(f.x-h.x),k=(g.x-f.x)*(f.y-h.y)-(g.y-f.y)*(f.x-h.x),l=(i.y-h.y)*(g.x-f.x)-(i.x-h.x)*(g.y-f.y);if(0!=l){var m=j/l,n=k/l;m>=0&&1>=m&&n>=0&&1>=n&&c.push({type:"Point",coordinates:[f.x+m*(g.x-f.x),f.y+m*(g.y-f.y)]})}}return 0==c.length&&(c=!1),c},c.pointInBoundingBox=function(a,b){return!(a.coordinates[1]<b[0][0]||a.coordinates[1]>b[1][0]||a.coordinates[0]<b[0][1]||a.coordinates[0]>b[1][1])},c.pointInPolygon=function(d,e){for(var f="Polygon"==e.type?[e.coordinates]:e.coordinates,g=!1,h=0;h<f.length;h++)c.pointInBoundingBox(d,a(f[h]))&&(g=!0);if(!g)return!1;for(var i=!1,h=0;h<f.length;h++)b(d.coordinates[1],d.coordinates[0],f[h])&&(i=!0);return i},c.pointInMultiPolygon=function(d,e){for(var f="MultiPolygon"==e.type?[e.coordinates]:e.coordinates,g=!1,h=!1,i=0;i<f.length;i++){for(var j=f[i],k=0;k<j.length;k++)g||c.pointInBoundingBox(d,a(j[k]))&&(g=!0);if(!g)return!1;for(var k=0;k<j.length;k++)h||b(d.coordinates[1],d.coordinates[0],j[k])&&(h=!0)}return h},c.numberToRadius=function(a){return a*Math.PI/180},c.numberToDegree=function(a){return 180*a/Math.PI},c.drawCircle=function(a,b,d){for(var e=[b.coordinates[1],b.coordinates[0]],f=a/1e3/6371,g=[c.numberToRadius(e[0]),c.numberToRadius(e[1])],d=d||15,h=[[e[0],e[1]]],i=0;d>i;i++){var j=2*Math.PI*i/d,k=Math.asin(Math.sin(g[0])*Math.cos(f)+Math.cos(g[0])*Math.sin(f)*Math.cos(j)),l=g[1]+Math.atan2(Math.sin(j)*Math.sin(f)*Math.cos(g[0]),Math.cos(f)-Math.sin(g[0])*Math.sin(k));h[i]=[],h[i][1]=c.numberToDegree(k),h[i][0]=c.numberToDegree(l)}return{type:"Polygon",coordinates:[h]}},c.rectangleCentroid=function(a){var b=a.coordinates[0],c=b[0][0],d=b[0][1],e=b[2][0],f=b[2][1],g=e-c,h=f-d;return{type:"Point",coordinates:[c+g/2,d+h/2]}},c.pointDistance=function(a,b){var d=a.coordinates[0],e=a.coordinates[1],f=b.coordinates[0],g=b.coordinates[1],h=c.numberToRadius(g-e),i=c.numberToRadius(f-d),j=Math.pow(Math.sin(h/2),2)+Math.cos(c.numberToRadius(e))*Math.cos(c.numberToRadius(g))*Math.pow(Math.sin(i/2),2),k=2*Math.atan2(Math.sqrt(j),Math.sqrt(1-j));return 6371*k*1e3},c.geometryWithinRadius=function(a,b,d){if("Point"==a.type)return c.pointDistance(a,b)<=d;if("LineString"==a.type||"Polygon"==a.type){var e,f={};e="Polygon"==a.type?a.coordinates[0]:a.coordinates;for(var g in e)if(f.coordinates=e[g],c.pointDistance(f,b)>d)return!1}return!0},c.area=function(a){for(var b,c,d=0,e=a.coordinates[0],f=e.length-1,g=0;g<e.length;f=g++){var b={x:e[g][1],y:e[g][0]},c={x:e[f][1],y:e[f][0]};d+=b.x*c.y,d-=b.y*c.x}return d/=2},c.centroid=function(a){for(var b,d,e,f=0,g=0,h=a.coordinates[0],i=h.length-1,j=0;j<h.length;i=j++){var d={x:h[j][1],y:h[j][0]},e={x:h[i][1],y:h[i][0]};b=d.x*e.y-e.x*d.y,f+=(d.x+e.x)*b,g+=(d.y+e.y)*b}return b=6*c.area(a),{type:"Point",coordinates:[g/b,f/b]}},c.simplify=function(a,b){b=b||20,a=a.map(function(a){return{lng:a.coordinates[0],lat:a.coordinates[1]}});var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v=Math.PI/180*.5,w=new Array,x=new Array,y=new Array;if(a.length<3)return a;for(c=a.length,l=360*b/(2*Math.PI*6378137),l*=l,e=0,x[0]=0,y[0]=c-1,d=1;d>0;)if(f=x[d-1],g=y[d-1],d--,g-f>1){for(m=a[g].lng()-a[f].lng(),n=a[g].lat()-a[f].lat(),Math.abs(m)>180&&(m=360-Math.abs(m)),m*=Math.cos(v*(a[g].lat()+a[f].lat())),o=m*m+n*n,h=f+1,i=f,k=-1;g>h;h++)p=a[h].lng()-a[f].lng(),q=a[h].lat()-a[f].lat(),Math.abs(p)>180&&(p=360-Math.abs(p)),p*=Math.cos(v*(a[h].lat()+a[f].lat())),r=p*p+q*q,s=a[h].lng()-a[g].lng(),t=a[h].lat()-a[g].lat(),Math.abs(s)>180&&(s=360-Math.abs(s)),s*=Math.cos(v*(a[h].lat()+a[g].lat())),u=s*s+t*t,j=r>=o+u?u:u>=o+r?r:(p*n-q*m)*(p*n-q*m)/o,j>k&&(i=h,k=j);l>k?(w[e]=f,e++):(d++,x[d-1]=i,y[d-1]=g,d++,x[d-1]=f,y[d-1]=i)}else w[e]=f,e++;w[e]=c-1,e++;for(var z=new Array,h=0;e>h;h++)z.push(a[w[h]]);return z.map(function(a){return{type:"Point",coordinates:[a.lng,a.lat]}})},c.destinationPoint=function(a,b,d){d/=6371,b=c.numberToRadius(b);var e=c.numberToRadius(a.coordinates[0]),f=c.numberToRadius(a.coordinates[1]),g=Math.asin(Math.sin(f)*Math.cos(d)+Math.cos(f)*Math.sin(d)*Math.cos(b)),h=e+Math.atan2(Math.sin(b)*Math.sin(d)*Math.cos(f),Math.cos(d)-Math.sin(f)*Math.sin(g));return h=(h+3*Math.PI)%(2*Math.PI)-Math.PI,{type:"Point",coordinates:[c.numberToDegree(h),c.numberToDegree(g)]}},c}();!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){L.CanvasGeojsonLayer=L.Class.extend({debug:!1,includes:[L.Mixin.Events],features:[],intersectList:[],lastCenterLL:null,utils:a("./utils"),initialize:function(a){a=a||{},L.Util.setOptions(this,a);var b=["onMouseOver","onMouseMove","onMouseOut","onClick"];b.forEach(function(a){this.options[a]&&(this[a]=this.options[a],delete this.options[a])}.bind(this)),this._canvas=this._createCanvas(),this._ctx=this._canvas.getContext("2d")},_createCanvas:function(){var a=document.createElement("canvas");a.style.position="absolute",a.style.top=0,a.style.left=0,a.style.pointerEvents="none",a.style.zIndex=this.options.zIndex||0;var b="leaflet-tile-container leaflet-zoom-animated";return a.setAttribute("class",b),a},onAdd:function(a){this._map=a;var b=this._map._panes.tilePane,c=L.DomUtil.create("div","leaflet-layer");c.appendChild(this._canvas),b.appendChild(c),this._container=c,a.dragging.enabled()&&a.dragging._draggable.on("predrag",function(){var b=a.dragging._draggable;L.DomUtil.setPosition(this._canvas,{x:-b._newPos.x,y:-b._newPos.y})},this),a.on({viewreset:this._reset,resize:this._reset,move:this.render,zoomstart:this._startZoom,zoomend:this._endZoom,mousemove:this._intersects,click:this._intersects},this),this._reset()},_startZoom:function(){this._canvas.style.visibility="hidden",this.zooming=!0},_endZoom:function(){this._canvas.style.visibility="visible",this.zooming=!1,setTimeout(this.render.bind(this),50)},getCanvas:function(){return this._canvas},draw:function(){this._reset()},onRemove:function(a){this._container.parentNode.removeChild(this._container),a.off({viewreset:this._reset,resize:this._reset,move:this.render,zoomstart:this._startZoom,zoomend:this._endZoom,mousemove:this._intersects,click:this._intersects},this)},addTo:function(a){return a.addLayer(this),this},_reset:function(){var a=this._map.getSize();this._canvas.width=a.x,this._canvas.height=a.y,this.clearCache(),this.render()},clearCache:function(){for(var a=0;a<this.features.length;a++)this.clearFeatureCache(this.features[a])},clearFeatureCache:function(a){a.cache&&(a.cache.geoXY=null)},redraw:function(a){var b=this._map.getBounds(),c=this._map.getZoom();this.debug&&(t=(new Date).getTime());for(var d=0;d<this.features.length;d++)this.redrawFeature(this.features[d],b,c,a);this.debug&&console.log("Render time: "+((new Date).getTime()-t)+"ms; avg: "+((new Date).getTime()-t)/this.features.length+"ms")},redrawFeature:function(a,b,c,d){if(!a.visible)return void this.clearFeatureCache(a);var e=!0;if(a.cache&&a.cache.zoom==c&&a.cache.geoXY&&(e=!1),e&&this._calcGeoXY(a,c),d&&!e&&("Point"==a.geojson.geometry.type?(a.cache.geoXY.x+=d.x,a.cache.geoXY.y+=d.y):"LineString"==a.geojson.geometry.type?this.utils.moveLine(a.cache.geoXY,d):"Polygon"==a.geojson.geometry.type&&this.utils.moveLine(a.cache.geoXY,d)),"Point"==a.geojson.geometry.type){if(!b.contains(a.latlng))return}else if(!b.contains(a.bounds)&&!b.intersects(a.bounds))return;a.render.call(a,this._ctx,a.cache.geoXY,this._map,a)},_calcGeoXY:function(a,b){a.cache||(a.cache={}),a.cache.zoom=b,"Point"==a.geojson.geometry.type?(a.cache.geoXY=this._map.latLngToContainerPoint([a.geojson.geometry.coordinates[1],a.geojson.geometry.coordinates[0]]),a.size&&(a.cache.geoXY[0]=a.cache.geoXY[0]-a.size/2,a.cache.geoXY[1]=a.cache.geoXY[1]-a.size/2)):"LineString"==a.geojson.geometry.type?a.cache.geoXY=this.utils.projectLine(a.geojson.geometry.coordinates,this._map):"Polygon"==a.geojson.geometry.type&&(a.cache.geoXY=this.utils.projectLine(a.geojson.geometry.coordinates[0],this._map))},addFeatures:function(a){for(var b=0;b<this.features.length;b++)this.addFeature(this.features[b])},addFeature:function(a,b){if(a.geojson&&a.geojson.geometry){if("undefined"==typeof a.visible&&(a.visible=!0),a.cache=null,"LineString"==a.geojson.geometry.type)a.bounds=this.utils.calcBounds(a.geojson.geometry.coordinates);else if("Polygon"==a.geojson.geometry.type)a.bounds=this.utils.calcBounds(a.geojson.geometry.coordinates[0]);else{if("Point"!=a.geojson.geometry.type)return console.log('GeoJSON feature type "'+a.geojson.geometry.type+'" not supported.'),void console.log(a.geojson);a.latlng=L.latLng(a.geojson.geometry.coordinates[1],a.geojson.geometry.coordinates[0])}b?"number"==typeof b?this.features.splice(b,0,a):this.features.unshift(a):this.features.push(a)}},addFeatureBottom:function(a){this.addFeature(a,!0)},removeFeature:function(a){var b=this.features.indexOf(a);if(-1!=b)return this.splice(b,1),this.feature.visible?!0:!1},render:function(a){var b,c;this.debug&&(b=(new Date).getTime());var c=null;if(a&&"move"==a.type){var d=this._map.getCenter(),e=this._map.latLngToContainerPoint(d);if(this.lastCenterLL){var f=this._map.latLngToContainerPoint(this.lastCenterLL);c={x:f.x-e.x,y:f.y-e.y}}this.lastCenterLL=d}var g=this._map.containerPointToLayerPoint([0,0]);L.DomUtil.setPosition(this._canvas,g);var h=this.getCanvas(),i=h.getContext("2d");if(i.clearRect(0,0,h.width,h.height),this.zooming||this.redraw(c),this.debug){c=(new Date).getTime()-b;for(var j=0,k=0;k<this.features.length;k++)this.features[k].cache.geoXY&&Array.isArray(this.features[k].cache.geoXY)&&(j+=this.features[k].cache.geoXY.length);console.log("Rendered "+j+" pts in "+c+"ms")}},getAllIntersectingGeometry:function(a,b){for(var c,d=this.utils.metersPerPx(a,this._map),e=d*(b||5),f={type:"Point",coordinates:[a.lng,a.lat]},g=this._map.getZoom(),h=this._map.latLngToContainerPoint(a),i=[],j=0;j<this.features.length;j++)c=this.features[j],c.geojson.geometry&&(!c.bounds||c.bounds.contains(a))&&(c.cache?c.cache.geoXY||this._calcGeoXY(c,g):this._calcGeoXY(c,g),this.utils.geometryWithinRadius(c.geojson.geometry,c.cache.geoXY,f,h,e)&&i.push(c));return i},getMetersPerPx:function(a){return this.utils.metersPerPx(a,this._map)},_intersects:function(a){for(var b,c=(new Date).getTime(),d=this.getMetersPerPx(a.latlng),e=5*d,f={type:"Point",coordinates:[a.latlng.lng,a.latlng.lat]},g=[],h=0;h<this.features.length;h++)b=this.features[h],b.visible&&b.geojson.geometry&&b.cache&&b.cache.geoXY&&(!b.bounds||b.bounds.contains(a.latlng))&&this.utils.geometryWithinRadius(b.geojson.geometry,b.cache.geoXY,f,a.containerPoint,b.size?b.size*d:e)&&g.push(b.geojson);if("click"==a.type&&this.onClick)return void this.onClick(g);for(var i=[],j=[],k=[],l=!1,h=0;h<g.length;h++)this.intersectList.indexOf(g[h])>-1?k.push(g[h]):(l=!0,i.push(g[h]));for(var h=0;h<this.intersectList.length;h++)-1==g.indexOf(this.intersectList[h])&&(l=!0,j.push(this.intersectList[h]));this.intersectList=g,this.onMouseOver&&i.length>0&&this.onMouseOver.call(this,i),this.onMouseMove&&k.length>0&&this.onMouseMove.call(this,k),this.onMouseOut&&j.length>0&&this.onMouseOut.call(this,j),this.debug&&console.log("intersects time: "+((new Date).getTime()-c)+"ms"),l&&this.render()}})},{"./utils":2}],2:[function(a,b,c){b.exports={moveLine:function(a,b){var c;for(len=a.length,c=0;c<len;c++)a[c].x+=b.x,a[c].y+=b.y},projectLine:function(a,b){for(var c=[],d=0;d<a.length;d++)c.push(b.latLngToContainerPoint([a[d][1],a[d][0]]));return c},calcBounds:function(a){for(var b=a[0][1],c=a[0][1],d=a[0][0],e=a[0][0],f=1;f<a.length;f++)b>a[f][1]&&(b=a[f][1]),c<a[f][1]&&(c=a[f][1]),d>a[f][0]&&(d=a[f][0]),e<a[f][0]&&(e=a[f][0]);var g=L.latLng(b-.01,d-.01),h=L.latLng(c+.01,e+.01);return L.latLngBounds(g,h)},geometryWithinRadius:function(a,b,c,d,e){if("Point"==a.type)return this.pointDistance(a,c)<=e;if("LineString"==a.type){for(var f=1;f<b.length;f++)if(this.lineIntersectsCircle(b[f-1],b[f],d,3))return!0;return!1}return"Polygon"==a.type?this.pointInPolygon(c,a):void 0},lineIntersectsCircle:function(a,b,c,d){var e=Math.abs((b.y-a.y)*c.x-(b.x-a.x)*c.y+b.x*a.y-b.y*a.x)/Math.sqrt(Math.pow(b.y-a.y,2)+Math.pow(b.x-a.x,2));return d>=e},metersPerPx:function(a,b){var c=b.latLngToContainerPoint(a),d=[c.x+1,c.y],e=b.containerPointToLatLng(c),f=b.containerPointToLatLng(d),g=e.distanceTo(f);return g},pointDistance:function(a,b){var c=a.coordinates[0],d=a.coordinates[1],e=b.coordinates[0],f=b.coordinates[1],g=this.numberToRadius(f-d),h=this.numberToRadius(e-c),i=Math.pow(Math.sin(g/2),2)+Math.cos(this.numberToRadius(d))*Math.cos(this.numberToRadius(f))*Math.pow(Math.sin(h/2),2),j=2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i));return 6371*j*1e3},pointInPolygon:function(a,b){for(var c="Polygon"==b.type?[b.coordinates]:b.coordinates,d=!1,e=0;e<c.length;e++)this.pointInBoundingBox(a,this.boundingBoxAroundPolyCoords(c[e]))&&(d=!0);if(!d)return!1;for(var f=!1,e=0;e<c.length;e++)this.pnpoly(a.coordinates[1],a.coordinates[0],c[e])&&(f=!0);return f},pointInBoundingBox:function(a,b){return!(a.coordinates[1]<b[0][0]||a.coordinates[1]>b[1][0]||a.coordinates[0]<b[0][1]||a.coordinates[0]>b[1][1])},boundingBoxAroundPolyCoords:function(a){for(var b=[],c=[],d=0;d<a[0].length;d++)b.push(a[0][d][1]),c.push(a[0][d][0]);return b=b.sort(function(a,b){return a-b}),c=c.sort(function(a,b){return a-b}),[[b[0],c[0]],[b[b.length-1],c[c.length-1]]]},pnpoly:function(a,b,c){for(var d=[[0,0]],e=0;e<c.length;e++){for(var f=0;f<c[e].length;f++)d.push(c[e][f]);d.push(c[e][0]),d.push([0,0])}for(var g=!1,e=0,f=d.length-1;e<d.length;f=e++)d[e][0]>b!=d[f][0]>b&&a<(d[f][1]-d[e][1])*(b-d[e][0])/(d[f][0]-d[e][0])+d[e][1]&&(g=!g);return g},numberToRadius:function(a){return a*Math.PI/180}}},{}]},{},[1]);;
(function () {
function resolve() {
document.body.removeAttribute('unresolved');
}
if (window.WebComponents) {
addEventListener('WebComponentsReady', resolve);
} else {
if (document.readyState === 'interactive' || document.readyState === 'complete') {
resolve();
} else {
addEventListener('DOMContentLoaded', resolve);
}
}
}());
Polymer = {
Settings: function () {
var user = window.Polymer || {};
location.search.slice(1).split('&').forEach(function (o) {
o = o.split('=');
o[0] && (user[o[0]] = o[1] || true);
});
var wantShadow = user.dom === 'shadow';
var hasShadow = Boolean(Element.prototype.createShadowRoot);
var nativeShadow = hasShadow && !window.ShadowDOMPolyfill;
var useShadow = wantShadow && hasShadow;
var hasNativeImports = Boolean('import' in document.createElement('link'));
var useNativeImports = hasNativeImports;
var useNativeCustomElements = !window.CustomElements || window.CustomElements.useNative;
return {
wantShadow: wantShadow,
hasShadow: hasShadow,
nativeShadow: nativeShadow,
useShadow: useShadow,
useNativeShadow: useShadow && nativeShadow,
useNativeImports: useNativeImports,
useNativeCustomElements: useNativeCustomElements
};
}()
};
(function () {
var userPolymer = window.Polymer;
window.Polymer = function (prototype) {
var ctor = desugar(prototype);
prototype = ctor.prototype;
var options = { prototype: prototype };
if (prototype.extends) {
options.extends = prototype.extends;
}
Polymer.telemetry._registrate(prototype);
document.registerElement(prototype.is, options);
return ctor;
};
var desugar = function (prototype) {
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
}());
Polymer.telemetry = {
registrations: [],
_regLog: function (prototype) {
console.log('[' + prototype.is + ']: registered');
},
_registrate: function (prototype) {
this.registrations.push(prototype);
Polymer.log && this._regLog(prototype);
},
dumpRegistrations: function () {
this.registrations.forEach(this._regLog);
}
};
Object.defineProperty(window, 'currentImport', {
enumerable: true,
configurable: true,
get: function () {
return (document._currentScript || document.currentScript).ownerDocument;
}
});
Polymer.Base = {
_addFeature: function (feature) {
this.extend(this, feature);
},
registerCallback: function () {
this._registerFeatures();
this._doBehavior('registered');
},
createdCallback: function () {
Polymer.telemetry.instanceCount++;
this.root = this;
this._doBehavior('created');
this._initFeatures();
},
attachedCallback: function () {
this.isAttached = true;
this._doBehavior('attached');
},
detachedCallback: function () {
this.isAttached = false;
this._doBehavior('detached');
},
attributeChangedCallback: function (name) {
this._setAttributeToProperty(this, name);
this._doBehavior('attributeChanged', arguments);
},
extend: function (prototype, api) {
if (prototype && api) {
Object.getOwnPropertyNames(api).forEach(function (n) {
this.copyOwnProperty(n, api, prototype);
}, this);
}
return prototype || api;
},
mixin: function (target, source) {
for (var i in source) {
target[i] = source[i];
}
return target;
},
copyOwnProperty: function (name, source, target) {
var pd = Object.getOwnPropertyDescriptor(source, name);
if (pd) {
Object.defineProperty(target, name, pd);
}
},
_log: console.log.apply.bind(console.log, console),
_warn: console.warn.apply.bind(console.warn, console),
_error: console.error.apply.bind(console.error, console),
_logf: function () {
return this._logPrefix.concat([this.is]).concat(Array.prototype.slice.call(arguments, 0));
}
};
Polymer.Base._logPrefix = function () {
var color = window.chrome || /firefox/i.test(navigator.userAgent);
return color ? [
'%c[%s::%s]:',
'font-weight: bold; background-color:#EEEE00;'
] : ['[%s::%s]:'];
}();
Polymer.Base.chainObject = function (object, inherited) {
if (object && inherited && object !== inherited) {
if (!Object.__proto__) {
object = Polymer.Base.extend(Object.create(inherited), object);
}
object.__proto__ = inherited;
}
return object;
};
Polymer.Base = Polymer.Base.chainObject(Polymer.Base, HTMLElement.prototype);
Polymer.telemetry.instanceCount = 0;
(function () {
var modules = {};
var DomModule = function () {
return document.createElement('dom-module');
};
DomModule.prototype = Object.create(HTMLElement.prototype);
DomModule.prototype.constructor = DomModule;
DomModule.prototype.createdCallback = function () {
var id = this.id || this.getAttribute('name') || this.getAttribute('is');
if (id) {
this.id = id;
modules[id] = this;
}
};
DomModule.prototype.import = function (id, slctr) {
var m = modules[id];
if (!m) {
forceDocumentUpgrade();
m = modules[id];
}
if (m && slctr) {
m = m.querySelector(slctr);
}
return m;
};
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
}());
Polymer.Base._addFeature({
_prepIs: function () {
if (!this.is) {
var module = (document._currentScript || document.currentScript).parentNode;
if (module.localName === 'dom-module') {
var id = module.id || module.getAttribute('name') || module.getAttribute('is');
this.is = id;
}
}
}
});
Polymer.Base._addFeature({
behaviors: [],
_prepBehaviors: function () {
if (this.behaviors.length) {
this.behaviors = this._flattenBehaviorsList(this.behaviors);
}
this._prepAllBehaviors(this.behaviors);
},
_flattenBehaviorsList: function (behaviors) {
var flat = [];
behaviors.forEach(function (b) {
if (b instanceof Array) {
flat = flat.concat(this._flattenBehaviorsList(b));
} else if (b) {
flat.push(b);
} else {
this._warn(this._logf('_flattenBehaviorsList', 'behavior is null, check for missing or 404 import'));
}
}, this);
return flat;
},
_prepAllBehaviors: function (behaviors) {
for (var i = behaviors.length - 1; i >= 0; i--) {
this._mixinBehavior(behaviors[i]);
}
for (var i = 0, l = behaviors.length; i < l; i++) {
this._prepBehavior(behaviors[i]);
}
this._prepBehavior(this);
},
_mixinBehavior: function (b) {
Object.getOwnPropertyNames(b).forEach(function (n) {
switch (n) {
case 'hostAttributes':
case 'registered':
case 'properties':
case 'observers':
case 'listeners':
case 'created':
case 'attached':
case 'detached':
case 'attributeChanged':
case 'configure':
case 'ready':
break;
default:
if (!this.hasOwnProperty(n)) {
this.copyOwnProperty(n, b, this);
}
break;
}
}, this);
},
_doBehavior: function (name, args) {
this.behaviors.forEach(function (b) {
this._invokeBehavior(b, name, args);
}, this);
this._invokeBehavior(this, name, args);
},
_invokeBehavior: function (b, name, args) {
var fn = b[name];
if (fn) {
fn.apply(this, args || Polymer.nar);
}
},
_marshalBehaviors: function () {
this.behaviors.forEach(function (b) {
this._marshalBehavior(b);
}, this);
this._marshalBehavior(this);
}
});
Polymer.Base._addFeature({
_prepExtends: function () {
if (this.extends) {
this.__proto__ = this._getExtendedPrototype(this.extends);
}
},
_getExtendedPrototype: function (tag) {
return this._getExtendedNativePrototype(tag);
},
_nativePrototypes: {},
_getExtendedNativePrototype: function (tag) {
var p = this._nativePrototypes[tag];
if (!p) {
var np = this.getNativePrototype(tag);
p = this.extend(Object.create(np), Polymer.Base);
this._nativePrototypes[tag] = p;
}
return p;
},
getNativePrototype: function (tag) {
return Object.getPrototypeOf(document.createElement(tag));
}
});
Polymer.Base._addFeature({
_prepConstructor: function () {
this._factoryArgs = this.extends ? [
this.extends,
this.is
] : [this.is];
var ctor = function () {
return this._factory(arguments);
};
if (this.hasOwnProperty('extends')) {
ctor.extends = this.extends;
}
Object.defineProperty(this, 'constructor', {
value: ctor,
writable: true,
configurable: true
});
ctor.prototype = this;
},
_factory: function (args) {
var elt = document.createElement.apply(document, this._factoryArgs);
if (this.factoryImpl) {
this.factoryImpl.apply(elt, args);
}
return elt;
}
});
Polymer.nob = Object.create(null);
Polymer.Base._addFeature({
properties: {},
getPropertyInfo: function (property) {
var info = this._getPropertyInfo(property, this.properties);
if (!info) {
this.behaviors.some(function (b) {
return info = this._getPropertyInfo(property, b.properties);
}, this);
}
return info || Polymer.nob;
},
_getPropertyInfo: function (property, properties) {
var p = properties && properties[property];
if (typeof p === 'function') {
p = properties[property] = { type: p };
}
if (p) {
p.defined = true;
}
return p;
}
});
Polymer.CaseMap = {
_caseMap: {},
dashToCamelCase: function (dash) {
var mapped = Polymer.CaseMap._caseMap[dash];
if (mapped) {
return mapped;
}
if (dash.indexOf('-') < 0) {
return Polymer.CaseMap._caseMap[dash] = dash;
}
return Polymer.CaseMap._caseMap[dash] = dash.replace(/-([a-z])/g, function (m) {
return m[1].toUpperCase();
});
},
camelToDashCase: function (camel) {
var mapped = Polymer.CaseMap._caseMap[camel];
if (mapped) {
return mapped;
}
return Polymer.CaseMap._caseMap[camel] = camel.replace(/([a-z][A-Z])/g, function (g) {
return g[0] + '-' + g[1].toLowerCase();
});
}
};
Polymer.Base._addFeature({
_prepAttributes: function () {
this._aggregatedAttributes = {};
},
_addHostAttributes: function (attributes) {
if (attributes) {
this.mixin(this._aggregatedAttributes, attributes);
}
},
_marshalHostAttributes: function () {
this._applyAttributes(this, this._aggregatedAttributes);
},
_applyAttributes: function (node, attr$) {
for (var n in attr$) {
if (!this.hasAttribute(n) && n !== 'class') {
this.serializeValueToAttribute(attr$[n], n, this);
}
}
},
_marshalAttributes: function () {
this._takeAttributesToModel(this);
},
_takeAttributesToModel: function (model) {
for (var i = 0, l = this.attributes.length; i < l; i++) {
this._setAttributeToProperty(model, this.attributes[i].name);
}
},
_setAttributeToProperty: function (model, attrName) {
if (!this._serializing) {
var propName = Polymer.CaseMap.dashToCamelCase(attrName);
var info = this.getPropertyInfo(propName);
if (info.defined || this._propertyEffects && this._propertyEffects[propName]) {
var val = this.getAttribute(attrName);
model[propName] = this.deserialize(val, info.type);
}
}
},
_serializing: false,
reflectPropertyToAttribute: function (name) {
this._serializing = true;
this.serializeValueToAttribute(this[name], Polymer.CaseMap.camelToDashCase(name));
this._serializing = false;
},
serializeValueToAttribute: function (value, attribute, node) {
var str = this.serialize(value);
(node || this)[str === undefined ? 'removeAttribute' : 'setAttribute'](attribute, str);
},
deserialize: function (value, type) {
switch (type) {
case Number:
value = Number(value);
break;
case Boolean:
value = value !== null;
break;
case Object:
try {
value = JSON.parse(value);
} catch (x) {
}
break;
case Array:
try {
value = JSON.parse(value);
} catch (x) {
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
serialize: function (value) {
switch (typeof value) {
case 'boolean':
return value ? '' : undefined;
case 'object':
if (value instanceof Date) {
return value;
} else if (value) {
try {
return JSON.stringify(value);
} catch (x) {
return '';
}
}
default:
return value != null ? value : undefined;
}
}
});
Polymer.Base._addFeature({
_setupDebouncers: function () {
this._debouncers = {};
},
debounce: function (jobName, callback, wait) {
this._debouncers[jobName] = Polymer.Debounce.call(this, this._debouncers[jobName], callback, wait);
},
isDebouncerActive: function (jobName) {
var debouncer = this._debouncers[jobName];
return debouncer && debouncer.finish;
},
flushDebouncer: function (jobName) {
var debouncer = this._debouncers[jobName];
if (debouncer) {
debouncer.complete();
}
},
cancelDebouncer: function (jobName) {
var debouncer = this._debouncers[jobName];
if (debouncer) {
debouncer.stop();
}
}
});
Polymer.version = '1.0.5';
Polymer.Base._addFeature({
_registerFeatures: function () {
this._prepIs();
this._prepAttributes();
this._prepBehaviors();
this._prepExtends();
this._prepConstructor();
},
_prepBehavior: function (b) {
this._addHostAttributes(b.hostAttributes);
},
_marshalBehavior: function (b) {
},
_initFeatures: function () {
this._marshalHostAttributes();
this._setupDebouncers();
this._marshalBehaviors();
}
});;
Polymer.Base._addFeature({
_prepTemplate: function () {
this._template = this._template || Polymer.DomModule.import(this.is, 'template');
if (this._template && this._template.hasAttribute('is')) {
this._warn(this._logf('_prepTemplate', 'top-level Polymer template ' + 'must not be a type-extension, found', this._template, 'Move inside simple <template>.'));
}
},
_stampTemplate: function () {
if (this._template) {
this.root = this.instanceTemplate(this._template);
}
},
instanceTemplate: function (template) {
var dom = document.importNode(template._content || template.content, true);
return dom;
}
});
(function () {
var baseAttachedCallback = Polymer.Base.attachedCallback;
Polymer.Base._addFeature({
_hostStack: [],
ready: function () {
},
_pushHost: function (host) {
this.dataHost = host = host || Polymer.Base._hostStack[Polymer.Base._hostStack.length - 1];
if (host && host._clients) {
host._clients.push(this);
}
this._beginHost();
},
_beginHost: function () {
Polymer.Base._hostStack.push(this);
if (!this._clients) {
this._clients = [];
}
},
_popHost: function () {
Polymer.Base._hostStack.pop();
},
_tryReady: function () {
if (this._canReady()) {
this._ready();
}
},
_canReady: function () {
return !this.dataHost || this.dataHost._clientsReadied;
},
_ready: function () {
this._beforeClientsReady();
this._setupRoot();
this._readyClients();
this._afterClientsReady();
this._readySelf();
},
_readyClients: function () {
this._beginDistribute();
var c$ = this._clients;
for (var i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
c._ready();
}
this._finishDistribute();
this._clientsReadied = true;
this._clients = null;
},
_readySelf: function () {
this._doBehavior('ready');
this._readied = true;
if (this._attachedPending) {
this._attachedPending = false;
this.attachedCallback();
}
},
_beforeClientsReady: function () {
},
_afterClientsReady: function () {
},
_beforeAttached: function () {
},
attachedCallback: function () {
if (this._readied) {
this._beforeAttached();
baseAttachedCallback.call(this);
} else {
this._attachedPending = true;
}
}
});
}());
Polymer.ArraySplice = function () {
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
function ArraySplice() {
}
ArraySplice.prototype = {
calcEditDistances: function (current, currentStart, currentEnd, old, oldStart, oldEnd) {
var rowCount = oldEnd - oldStart + 1;
var columnCount = currentEnd - currentStart + 1;
var distances = new Array(rowCount);
for (var i = 0; i < rowCount; i++) {
distances[i] = new Array(columnCount);
distances[i][0] = i;
}
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
spliceOperationsFromEditDistances: function (distances) {
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
calcSplices: function (current, currentStart, currentEnd, old, oldStart, oldEnd) {
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
return [splice];
} else if (oldStart == oldEnd)
return [newSplice(currentStart, [], currentEnd - currentStart)];
var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));
var splice = undefined;
var splices = [];
var index = currentStart;
var oldIndex = oldStart;
for (var i = 0; i < ops.length; i++) {
switch (ops[i]) {
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
sharedPrefix: function (current, old, searchLength) {
for (var i = 0; i < searchLength; i++)
if (!this.equals(current[i], old[i]))
return i;
return searchLength;
},
sharedSuffix: function (current, old, searchLength) {
var index1 = current.length;
var index2 = old.length;
var count = 0;
while (count < searchLength && this.equals(current[--index1], old[--index2]))
count++;
return count;
},
calculateSplices: function (current, previous) {
return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
},
equals: function (currentValue, previousValue) {
return currentValue === previousValue;
}
};
return new ArraySplice();
}();
Polymer.EventApi = function () {
var Settings = Polymer.Settings;
var EventApi = function (event) {
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
var currentRoot = current && Polymer.dom(current).getOwnerRoot();
var p$ = this.path;
for (var i = 0; i < p$.length; i++) {
if (Polymer.dom(p$[i]).getOwnerRoot() === currentRoot) {
return p$[i];
}
}
},
get path() {
if (!this.event._path) {
var path = [];
var o = this.rootTarget;
while (o) {
path.push(o);
o = Polymer.dom(o).parentNode || o.host;
}
path.push(window);
this.event._path = path;
}
return this.event._path;
}
};
}
var factory = function (event) {
if (!event.__eventApi) {
event.__eventApi = new EventApi(event);
}
return event.__eventApi;
};
return { factory: factory };
}();
Polymer.domInnerHTML = function () {
var escapeAttrRegExp = /[&\u00A0"]/g;
var escapeDataRegExp = /[&\u00A0<>]/g;
function escapeReplace(c) {
switch (c) {
case '&':
return '&amp;';
case '<':
return '&lt;';
case '>':
return '&gt;';
case '"':
return '&quot;';
case '\xA0':
return '&nbsp;';
}
}
function escapeAttr(s) {
return s.replace(escapeAttrRegExp, escapeReplace);
}
function escapeData(s) {
return s.replace(escapeDataRegExp, escapeReplace);
}
function makeSet(arr) {
var set = {};
for (var i = 0; i < arr.length; i++) {
set[arr[i]] = true;
}
return set;
}
var voidElements = makeSet([
'area',
'base',
'br',
'col',
'command',
'embed',
'hr',
'img',
'input',
'keygen',
'link',
'meta',
'param',
'source',
'track',
'wbr'
]);
var plaintextParents = makeSet([
'style',
'script',
'xmp',
'iframe',
'noembed',
'noframes',
'plaintext',
'noscript'
]);
function getOuterHTML(node, parentNode, composed) {
switch (node.nodeType) {
case Node.ELEMENT_NODE:
var tagName = node.localName;
var s = '<' + tagName;
var attrs = node.attributes;
for (var i = 0, attr; attr = attrs[i]; i++) {
s += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
}
s += '>';
if (voidElements[tagName]) {
return s;
}
return s + getInnerHTML(node, composed) + '</' + tagName + '>';
case Node.TEXT_NODE:
var data = node.data;
if (parentNode && plaintextParents[parentNode.localName]) {
return data;
}
return escapeData(data);
case Node.COMMENT_NODE:
return '<!--' + node.data + '-->';
default:
console.error(node);
throw new Error('not implemented');
}
}
function getInnerHTML(node, composed) {
if (node instanceof HTMLTemplateElement)
node = node.content;
var s = '';
var c$ = Polymer.dom(node).childNodes;
c$ = composed ? node._composedChildren : c$;
for (var i = 0, l = c$.length, child; i < l && (child = c$[i]); i++) {
s += getOuterHTML(child, node, composed);
}
return s;
}
return { getInnerHTML: getInnerHTML };
}();
Polymer.DomApi = function () {
'use strict';
var Settings = Polymer.Settings;
var getInnerHTML = Polymer.domInnerHTML.getInnerHTML;
var nativeInsertBefore = Element.prototype.insertBefore;
var nativeRemoveChild = Element.prototype.removeChild;
var nativeAppendChild = Element.prototype.appendChild;
var dirtyRoots = [];
var DomApi = function (node) {
this.node = node;
if (this.patch) {
this.patch();
}
};
DomApi.prototype = {
flush: function () {
for (var i = 0, host; i < dirtyRoots.length; i++) {
host = dirtyRoots[i];
host.flushDebouncer('_distribute');
}
dirtyRoots = [];
},
_lazyDistribute: function (host) {
if (host.shadyRoot && host.shadyRoot._distributionClean) {
host.shadyRoot._distributionClean = false;
host.debounce('_distribute', host._distributeContent);
dirtyRoots.push(host);
}
},
appendChild: function (node) {
var handled;
this._removeNodeFromHost(node, true);
if (this._nodeIsInLogicalTree(this.node)) {
this._addLogicalInfo(node, this.node);
this._addNodeToHost(node);
handled = this._maybeDistribute(node, this.node);
}
if (!handled && !this._tryRemoveUndistributedNode(node)) {
var container = this.node._isShadyRoot ? this.node.host : this.node;
addToComposedParent(container, node);
nativeAppendChild.call(container, node);
}
return node;
},
insertBefore: function (node, ref_node) {
if (!ref_node) {
return this.appendChild(node);
}
var handled;
this._removeNodeFromHost(node, true);
if (this._nodeIsInLogicalTree(this.node)) {
saveLightChildrenIfNeeded(this.node);
var children = this.childNodes;
var index = children.indexOf(ref_node);
if (index < 0) {
throw Error('The ref_node to be inserted before is not a child ' + 'of this node');
}
this._addLogicalInfo(node, this.node, index);
this._addNodeToHost(node);
handled = this._maybeDistribute(node, this.node);
}
if (!handled && !this._tryRemoveUndistributedNode(node)) {
ref_node = ref_node.localName === CONTENT ? this._firstComposedNode(ref_node) : ref_node;
var container = this.node._isShadyRoot ? this.node.host : this.node;
addToComposedParent(container, node, ref_node);
nativeInsertBefore.call(container, node, ref_node);
}
return node;
},
removeChild: function (node) {
if (factory(node).parentNode !== this.node) {
console.warn('The node to be removed is not a child of this node', node);
}
var handled;
if (this._nodeIsInLogicalTree(this.node)) {
this._removeNodeFromHost(node);
handled = this._maybeDistribute(node, this.node);
}
if (!handled) {
var container = this.node._isShadyRoot ? this.node.host : this.node;
if (container === node.parentNode) {
removeFromComposedParent(container, node);
nativeRemoveChild.call(container, node);
}
}
return node;
},
replaceChild: function (node, ref_node) {
this.insertBefore(node, ref_node);
this.removeChild(ref_node);
return node;
},
getOwnerRoot: function () {
return this._ownerShadyRootForNode(this.node);
},
_ownerShadyRootForNode: function (node) {
if (!node) {
return;
}
if (node._ownerShadyRoot === undefined) {
var root;
if (node._isShadyRoot) {
root = node;
} else {
var parent = Polymer.dom(node).parentNode;
if (parent) {
root = parent._isShadyRoot ? parent : this._ownerShadyRootForNode(parent);
} else {
root = null;
}
}
node._ownerShadyRoot = root;
}
return node._ownerShadyRoot;
},
_maybeDistribute: function (node, parent) {
var fragContent = node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !node.__noContent && Polymer.dom(node).querySelector(CONTENT);
var wrappedContent = fragContent && Polymer.dom(fragContent).parentNode.nodeType !== Node.DOCUMENT_FRAGMENT_NODE;
var hasContent = fragContent || node.localName === CONTENT;
if (hasContent) {
var root = this._ownerShadyRootForNode(parent);
if (root) {
var host = root.host;
this._updateInsertionPoints(host);
this._lazyDistribute(host);
}
}
var parentNeedsDist = this._parentNeedsDistribution(parent);
if (parentNeedsDist) {
this._lazyDistribute(parent);
}
return parentNeedsDist || hasContent && !wrappedContent;
},
_tryRemoveUndistributedNode: function (node) {
if (this.node.shadyRoot) {
if (node.parentNode) {
nativeRemoveChild.call(node.parentNode, node);
}
return true;
}
},
_updateInsertionPoints: function (host) {
host.shadyRoot._insertionPoints = factory(host.shadyRoot).querySelectorAll(CONTENT);
},
_nodeIsInLogicalTree: function (node) {
return Boolean(node._lightParent || node._isShadyRoot || this._ownerShadyRootForNode(node) || node.shadyRoot);
},
_parentNeedsDistribution: function (parent) {
return parent && parent.shadyRoot && hasInsertionPoint(parent.shadyRoot);
},
_removeNodeFromHost: function (node, ensureComposedRemoval) {
var hostNeedsDist;
var root;
var parent = node._lightParent;
if (parent) {
root = this._ownerShadyRootForNode(node);
if (root) {
root.host._elementRemove(node);
hostNeedsDist = this._removeDistributedChildren(root, node);
}
this._removeLogicalInfo(node, node._lightParent);
}
this._removeOwnerShadyRoot(node);
if (root && hostNeedsDist) {
this._updateInsertionPoints(root.host);
this._lazyDistribute(root.host);
} else if (ensureComposedRemoval) {
removeFromComposedParent(parent || node.parentNode, node);
}
},
_removeDistributedChildren: function (root, container) {
var hostNeedsDist;
var ip$ = root._insertionPoints;
for (var i = 0; i < ip$.length; i++) {
var content = ip$[i];
if (this._contains(container, content)) {
var dc$ = factory(content).getDistributedNodes();
for (var j = 0; j < dc$.length; j++) {
hostNeedsDist = true;
var node = dc$[j];
var parent = node.parentNode;
if (parent) {
removeFromComposedParent(parent, node);
nativeRemoveChild.call(parent, node);
}
}
}
}
return hostNeedsDist;
},
_contains: function (container, node) {
while (node) {
if (node == container) {
return true;
}
node = factory(node).parentNode;
}
},
_addNodeToHost: function (node) {
var checkNode = node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? node.firstChild : node;
var root = this._ownerShadyRootForNode(checkNode);
if (root) {
root.host._elementAdd(node);
}
},
_addLogicalInfo: function (node, container, index) {
saveLightChildrenIfNeeded(container);
var children = factory(container).childNodes;
index = index === undefined ? children.length : index;
if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
var c$ = Array.prototype.slice.call(node.childNodes);
for (var i = 0, n; i < c$.length && (n = c$[i]); i++) {
children.splice(index++, 0, n);
n._lightParent = container;
}
} else {
children.splice(index, 0, node);
node._lightParent = container;
}
},
_removeLogicalInfo: function (node, container) {
var children = factory(container).childNodes;
var index = children.indexOf(node);
if (index < 0 || container !== node._lightParent) {
throw Error('The node to be removed is not a child of this node');
}
children.splice(index, 1);
node._lightParent = null;
},
_removeOwnerShadyRoot: function (node) {
var hasCachedRoot = factory(node).getOwnerRoot() !== undefined;
if (hasCachedRoot) {
var c$ = factory(node).childNodes;
for (var i = 0, l = c$.length, n; i < l && (n = c$[i]); i++) {
this._removeOwnerShadyRoot(n);
}
}
node._ownerShadyRoot = undefined;
},
_firstComposedNode: function (content) {
var n$ = factory(content).getDistributedNodes();
for (var i = 0, l = n$.length, n, p$; i < l && (n = n$[i]); i++) {
p$ = factory(n).getDestinationInsertionPoints();
if (p$[p$.length - 1] === content) {
return n;
}
}
},
querySelector: function (selector) {
return this.querySelectorAll(selector)[0];
},
querySelectorAll: function (selector) {
return this._query(function (n) {
return matchesSelector.call(n, selector);
}, this.node);
},
_query: function (matcher, node) {
node = node || this.node;
var list = [];
this._queryElements(factory(node).childNodes, matcher, list);
return list;
},
_queryElements: function (elements, matcher, list) {
for (var i = 0, l = elements.length, c; i < l && (c = elements[i]); i++) {
if (c.nodeType === Node.ELEMENT_NODE) {
this._queryElement(c, matcher, list);
}
}
},
_queryElement: function (node, matcher, list) {
if (matcher(node)) {
list.push(node);
}
this._queryElements(factory(node).childNodes, matcher, list);
},
getDestinationInsertionPoints: function () {
return this.node._destinationInsertionPoints || [];
},
getDistributedNodes: function () {
return this.node._distributedNodes || [];
},
queryDistributedElements: function (selector) {
var c$ = this.childNodes;
var list = [];
this._distributedFilter(selector, c$, list);
for (var i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
if (c.localName === CONTENT) {
this._distributedFilter(selector, factory(c).getDistributedNodes(), list);
}
}
return list;
},
_distributedFilter: function (selector, list, results) {
results = results || [];
for (var i = 0, l = list.length, d; i < l && (d = list[i]); i++) {
if (d.nodeType === Node.ELEMENT_NODE && d.localName !== CONTENT && matchesSelector.call(d, selector)) {
results.push(d);
}
}
return results;
},
_clear: function () {
while (this.childNodes.length) {
this.removeChild(this.childNodes[0]);
}
},
setAttribute: function (name, value) {
this.node.setAttribute(name, value);
this._distributeParent();
},
removeAttribute: function (name) {
this.node.removeAttribute(name);
this._distributeParent();
},
_distributeParent: function () {
if (this._parentNeedsDistribution(this.parentNode)) {
this._lazyDistribute(this.parentNode);
}
}
};
Object.defineProperty(DomApi.prototype, 'classList', {
get: function () {
if (!this._classList) {
this._classList = new DomApi.ClassList(this);
}
return this._classList;
},
configurable: true
});
DomApi.ClassList = function (host) {
this.domApi = host;
this.node = host.node;
};
DomApi.ClassList.prototype = {
add: function () {
this.node.classList.add.apply(this.node.classList, arguments);
this.domApi._distributeParent();
},
remove: function () {
this.node.classList.remove.apply(this.node.classList, arguments);
this.domApi._distributeParent();
},
toggle: function () {
this.node.classList.toggle.apply(this.node.classList, arguments);
this.domApi._distributeParent();
},
contains: function () {
return this.node.classList.contains.apply(this.node.classList, arguments);
}
};
if (!Settings.useShadow) {
Object.defineProperties(DomApi.prototype, {
childNodes: {
get: function () {
var c$ = getLightChildren(this.node);
return Array.isArray(c$) ? c$ : Array.prototype.slice.call(c$);
},
configurable: true
},
children: {
get: function () {
return Array.prototype.filter.call(this.childNodes, function (n) {
return n.nodeType === Node.ELEMENT_NODE;
});
},
configurable: true
},
parentNode: {
get: function () {
return this.node._lightParent || (this.node.__patched ? this.node._composedParent : this.node.parentNode);
},
configurable: true
},
firstChild: {
get: function () {
return this.childNodes[0];
},
configurable: true
},
lastChild: {
get: function () {
var c$ = this.childNodes;
return c$[c$.length - 1];
},
configurable: true
},
nextSibling: {
get: function () {
var c$ = this.parentNode && factory(this.parentNode).childNodes;
if (c$) {
return c$[Array.prototype.indexOf.call(c$, this.node) + 1];
}
},
configurable: true
},
previousSibling: {
get: function () {
var c$ = this.parentNode && factory(this.parentNode).childNodes;
if (c$) {
return c$[Array.prototype.indexOf.call(c$, this.node) - 1];
}
},
configurable: true
},
firstElementChild: {
get: function () {
return this.children[0];
},
configurable: true
},
lastElementChild: {
get: function () {
var c$ = this.children;
return c$[c$.length - 1];
},
configurable: true
},
nextElementSibling: {
get: function () {
var c$ = this.parentNode && factory(this.parentNode).children;
if (c$) {
return c$[Array.prototype.indexOf.call(c$, this.node) + 1];
}
},
configurable: true
},
previousElementSibling: {
get: function () {
var c$ = this.parentNode && factory(this.parentNode).children;
if (c$) {
return c$[Array.prototype.indexOf.call(c$, this.node) - 1];
}
},
configurable: true
},
textContent: {
get: function () {
if (this.node.nodeType === Node.TEXT_NODE) {
return this.node.textContent;
} else {
return Array.prototype.map.call(this.childNodes, function (c) {
return c.textContent;
}).join('');
}
},
set: function (text) {
this._clear();
if (text) {
this.appendChild(document.createTextNode(text));
}
},
configurable: true
},
innerHTML: {
get: function () {
if (this.node.nodeType === Node.TEXT_NODE) {
return null;
} else {
return getInnerHTML(this.node);
}
},
set: function (text) {
if (this.node.nodeType !== Node.TEXT_NODE) {
this._clear();
var d = document.createElement('div');
d.innerHTML = text;
for (var e = d.firstChild; e; e = e.nextSibling) {
this.appendChild(e);
}
}
},
configurable: true
}
});
DomApi.prototype._getComposedInnerHTML = function () {
return getInnerHTML(this.node, true);
};
} else {
DomApi.prototype.querySelectorAll = function (selector) {
return Array.prototype.slice.call(this.node.querySelectorAll(selector));
};
DomApi.prototype.getOwnerRoot = function () {
var n = this.node;
while (n) {
if (n.nodeType === Node.DOCUMENT_FRAGMENT_NODE && n.host) {
return n;
}
n = n.parentNode;
}
};
DomApi.prototype.getDestinationInsertionPoints = function () {
var n$ = this.node.getDestinationInsertionPoints();
return n$ ? Array.prototype.slice.call(n$) : [];
};
DomApi.prototype.getDistributedNodes = function () {
var n$ = this.node.getDistributedNodes();
return n$ ? Array.prototype.slice.call(n$) : [];
};
DomApi.prototype._distributeParent = function () {
};
Object.defineProperties(DomApi.prototype, {
childNodes: {
get: function () {
return Array.prototype.slice.call(this.node.childNodes);
},
configurable: true
},
children: {
get: function () {
return Array.prototype.slice.call(this.node.children);
},
configurable: true
},
textContent: {
get: function () {
return this.node.textContent;
},
set: function (value) {
return this.node.textContent = value;
},
configurable: true
},
innerHTML: {
get: function () {
return this.node.innerHTML;
},
set: function (value) {
return this.node.innerHTML = value;
},
configurable: true
}
});
var forwards = [
'parentNode',
'firstChild',
'lastChild',
'nextSibling',
'previousSibling',
'firstElementChild',
'lastElementChild',
'nextElementSibling',
'previousElementSibling'
];
forwards.forEach(function (name) {
Object.defineProperty(DomApi.prototype, name, {
get: function () {
return this.node[name];
},
configurable: true
});
});
}
var CONTENT = 'content';
var factory = function (node, patch) {
node = node || document;
if (!node.__domApi) {
node.__domApi = new DomApi(node, patch);
}
return node.__domApi;
};
Polymer.dom = function (obj, patch) {
if (obj instanceof Event) {
return Polymer.EventApi.factory(obj);
} else {
return factory(obj, patch);
}
};
Polymer.dom.flush = DomApi.prototype.flush;
function getLightChildren(node) {
var children = node._lightChildren;
return children ? children : node.childNodes;
}
function getComposedChildren(node) {
if (!node._composedChildren) {
node._composedChildren = Array.prototype.slice.call(node.childNodes);
}
return node._composedChildren;
}
function addToComposedParent(parent, node, ref_node) {
var children = getComposedChildren(parent);
var i = ref_node ? children.indexOf(ref_node) : -1;
if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
var fragChildren = getComposedChildren(node);
for (var j = 0; j < fragChildren.length; j++) {
addNodeToComposedChildren(fragChildren[j], parent, children, i + j);
}
node._composedChildren = null;
} else {
addNodeToComposedChildren(node, parent, children, i);
}
}
function addNodeToComposedChildren(node, parent, children, i) {
node._composedParent = parent;
children.splice(i >= 0 ? i : children.length, 0, node);
}
function removeFromComposedParent(parent, node) {
node._composedParent = null;
if (parent) {
var children = getComposedChildren(parent);
var i = children.indexOf(node);
if (i >= 0) {
children.splice(i, 1);
}
}
}
function saveLightChildrenIfNeeded(node) {
if (!node._lightChildren) {
var c$ = Array.prototype.slice.call(node.childNodes);
for (var i = 0, l = c$.length, child; i < l && (child = c$[i]); i++) {
child._lightParent = child._lightParent || node;
}
node._lightChildren = c$;
}
}
function hasInsertionPoint(root) {
return Boolean(root._insertionPoints.length);
}
var p = Element.prototype;
var matchesSelector = p.matches || p.matchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector || p.webkitMatchesSelector;
return {
getLightChildren: getLightChildren,
getComposedChildren: getComposedChildren,
removeFromComposedParent: removeFromComposedParent,
saveLightChildrenIfNeeded: saveLightChildrenIfNeeded,
matchesSelector: matchesSelector,
hasInsertionPoint: hasInsertionPoint,
ctor: DomApi,
factory: factory
};
}();
(function () {
Polymer.Base._addFeature({
_prepShady: function () {
this._useContent = this._useContent || Boolean(this._template);
},
_poolContent: function () {
if (this._useContent) {
saveLightChildrenIfNeeded(this);
}
},
_setupRoot: function () {
if (this._useContent) {
this._createLocalRoot();
if (!this.dataHost) {
upgradeLightChildren(this._lightChildren);
}
}
},
_createLocalRoot: function () {
this.shadyRoot = this.root;
this.shadyRoot._distributionClean = false;
this.shadyRoot._isShadyRoot = true;
this.shadyRoot._dirtyRoots = [];
this.shadyRoot._insertionPoints = !this._notes || this._notes._hasContent ? this.shadyRoot.querySelectorAll('content') : [];
saveLightChildrenIfNeeded(this.shadyRoot);
this.shadyRoot.host = this;
},
get domHost() {
var root = Polymer.dom(this).getOwnerRoot();
return root && root.host;
},
distributeContent: function (updateInsertionPoints) {
if (this.shadyRoot) {
var dom = Polymer.dom(this);
if (updateInsertionPoints) {
dom._updateInsertionPoints(this);
}
var host = getTopDistributingHost(this);
dom._lazyDistribute(host);
}
},
_distributeContent: function () {
if (this._useContent && !this.shadyRoot._distributionClean) {
this._beginDistribute();
this._distributeDirtyRoots();
this._finishDistribute();
}
},
_beginDistribute: function () {
if (this._useContent && hasInsertionPoint(this.shadyRoot)) {
this._resetDistribution();
this._distributePool(this.shadyRoot, this._collectPool());
}
},
_distributeDirtyRoots: function () {
var c$ = this.shadyRoot._dirtyRoots;
for (var i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
c._distributeContent();
}
this.shadyRoot._dirtyRoots = [];
},
_finishDistribute: function () {
if (this._useContent) {
if (hasInsertionPoint(this.shadyRoot)) {
this._composeTree();
} else {
if (!this.shadyRoot._hasDistributed) {
this.textContent = '';
this._composedChildren = null;
this.appendChild(this.shadyRoot);
} else {
var children = this._composeNode(this);
this._updateChildNodes(this, children);
}
}
this.shadyRoot._hasDistributed = true;
this.shadyRoot._distributionClean = true;
}
},
elementMatches: function (selector, node) {
node = node || this;
return matchesSelector.call(node, selector);
},
_resetDistribution: function () {
var children = getLightChildren(this);
for (var i = 0; i < children.length; i++) {
var child = children[i];
if (child._destinationInsertionPoints) {
child._destinationInsertionPoints = undefined;
}
if (isInsertionPoint(child)) {
clearDistributedDestinationInsertionPoints(child);
}
}
var root = this.shadyRoot;
var p$ = root._insertionPoints;
for (var j = 0; j < p$.length; j++) {
p$[j]._distributedNodes = [];
}
},
_collectPool: function () {
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
_distributePool: function (node, pool) {
var p$ = node._insertionPoints;
for (var i = 0, l = p$.length, p; i < l && (p = p$[i]); i++) {
this._distributeInsertionPoint(p, pool);
maybeRedistributeParent(p, this);
}
},
_distributeInsertionPoint: function (content, pool) {
var anyDistributed = false;
for (var i = 0, l = pool.length, node; i < l; i++) {
node = pool[i];
if (!node) {
continue;
}
if (this._matchesContentSelect(node, content)) {
distributeNodeInto(node, content);
pool[i] = undefined;
anyDistributed = true;
}
}
if (!anyDistributed) {
var children = getLightChildren(content);
for (var j = 0; j < children.length; j++) {
distributeNodeInto(children[j], content);
}
}
},
_composeTree: function () {
this._updateChildNodes(this, this._composeNode(this));
var p$ = this.shadyRoot._insertionPoints;
for (var i = 0, l = p$.length, p, parent; i < l && (p = p$[i]); i++) {
parent = p._lightParent || p.parentNode;
if (!parent._useContent && parent !== this && parent !== this.shadyRoot) {
this._updateChildNodes(parent, this._composeNode(parent));
}
}
},
_composeNode: function (node) {
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
_updateChildNodes: function (container, children) {
var composed = getComposedChildren(container);
var splices = Polymer.ArraySplice.calculateSplices(children, composed);
for (var i = 0, d = 0, s; i < splices.length && (s = splices[i]); i++) {
for (var j = 0, n; j < s.removed.length && (n = s.removed[j]); j++) {
remove(n);
composed.splice(s.index + d, 1);
}
d -= s.addedCount;
}
for (var i = 0, s, next; i < splices.length && (s = splices[i]); i++) {
next = composed[s.index];
for (var j = s.index, n; j < s.index + s.addedCount; j++) {
n = children[j];
insertBefore(container, n, next);
composed.splice(j, 0, n);
}
}
},
_matchesContentSelect: function (node, contentElement) {
var select = contentElement.getAttribute('select');
if (!select) {
return true;
}
select = select.trim();
if (!select) {
return true;
}
if (!(node instanceof Element)) {
return false;
}
var validSelectors = /^(:not\()?[*.#[a-zA-Z_|]/;
if (!validSelectors.test(select)) {
return false;
}
return this.elementMatches(select, node);
},
_elementAdd: function () {
},
_elementRemove: function () {
}
});
var saveLightChildrenIfNeeded = Polymer.DomApi.saveLightChildrenIfNeeded;
var getLightChildren = Polymer.DomApi.getLightChildren;
var matchesSelector = Polymer.DomApi.matchesSelector;
var hasInsertionPoint = Polymer.DomApi.hasInsertionPoint;
var getComposedChildren = Polymer.DomApi.getComposedChildren;
var removeFromComposedParent = Polymer.DomApi.removeFromComposedParent;
function distributeNodeInto(child, insertionPoint) {
insertionPoint._distributedNodes.push(child);
var points = child._destinationInsertionPoints;
if (!points) {
child._destinationInsertionPoints = [insertionPoint];
} else {
points.push(insertionPoint);
}
}
function clearDistributedDestinationInsertionPoints(content) {
var e$ = content._distributedNodes;
if (e$) {
for (var i = 0; i < e$.length; i++) {
var d = e$[i]._destinationInsertionPoints;
if (d) {
d.splice(d.indexOf(content) + 1, d.length);
}
}
}
}
function maybeRedistributeParent(content, host) {
var parent = content._lightParent;
if (parent && parent.shadyRoot && hasInsertionPoint(parent.shadyRoot) && parent.shadyRoot._distributionClean) {
parent.shadyRoot._distributionClean = false;
host.shadyRoot._dirtyRoots.push(parent);
}
}
function isFinalDestination(insertionPoint, node) {
var points = node._destinationInsertionPoints;
return points && points[points.length - 1] === insertionPoint;
}
function isInsertionPoint(node) {
return node.localName == 'content';
}
var nativeInsertBefore = Element.prototype.insertBefore;
var nativeRemoveChild = Element.prototype.removeChild;
function insertBefore(parentNode, newChild, refChild) {
var newChildParent = getComposedParent(newChild);
if (newChildParent !== parentNode) {
removeFromComposedParent(newChildParent, newChild);
}
remove(newChild);
saveLightChildrenIfNeeded(parentNode);
nativeInsertBefore.call(parentNode, newChild, refChild || null);
newChild._composedParent = parentNode;
}
function remove(node) {
var parentNode = getComposedParent(node);
if (parentNode) {
saveLightChildrenIfNeeded(parentNode);
node._composedParent = null;
nativeRemoveChild.call(parentNode, node);
}
}
function getComposedParent(node) {
return node.__patched ? node._composedParent : node.parentNode;
}
function getTopDistributingHost(host) {
while (host && hostNeedsRedistribution(host)) {
host = host.domHost;
}
return host;
}
function hostNeedsRedistribution(host) {
var c$ = Polymer.dom(host).children;
for (var i = 0, c; i < c$.length; i++) {
c = c$[i];
if (c.localName === 'content') {
return host.domHost;
}
}
}
var needsUpgrade = window.CustomElements && !CustomElements.useNative;
function upgradeLightChildren(children) {
if (needsUpgrade && children) {
for (var i = 0; i < children.length; i++) {
CustomElements.upgrade(children[i]);
}
}
}
}());
if (Polymer.Settings.useShadow) {
Polymer.Base._addFeature({
_poolContent: function () {
},
_beginDistribute: function () {
},
distributeContent: function () {
},
_distributeContent: function () {
},
_finishDistribute: function () {
},
_createLocalRoot: function () {
this.createShadowRoot();
this.shadowRoot.appendChild(this.root);
this.root = this.shadowRoot;
}
});
}
Polymer.DomModule = document.createElement('dom-module');
Polymer.Base._addFeature({
_registerFeatures: function () {
this._prepIs();
this._prepAttributes();
this._prepBehaviors();
this._prepExtends();
this._prepConstructor();
this._prepTemplate();
this._prepShady();
},
_prepBehavior: function (b) {
this._addHostAttributes(b.hostAttributes);
},
_initFeatures: function () {
this._poolContent();
this._pushHost();
this._stampTemplate();
this._popHost();
this._marshalHostAttributes();
this._setupDebouncers();
this._marshalBehaviors();
this._tryReady();
},
_marshalBehavior: function (b) {
}
});;
Polymer.nar = [];
Polymer.Annotations = {
parseAnnotations: function (template) {
var list = [];
var content = template._content || template.content;
this._parseNodeAnnotations(content, list);
return list;
},
_parseNodeAnnotations: function (node, list) {
return node.nodeType === Node.TEXT_NODE ? this._parseTextNodeAnnotation(node, list) : this._parseElementAnnotations(node, list);
},
_testEscape: function (value) {
var escape = value.slice(0, 2);
if (escape === '{{' || escape === '[[') {
return escape;
}
},
_parseTextNodeAnnotation: function (node, list) {
var v = node.textContent;
var escape = this._testEscape(v);
if (escape) {
node.textContent = ' ';
var annote = {
bindings: [{
kind: 'text',
mode: escape[0],
value: v.slice(2, -2).trim()
}]
};
list.push(annote);
return annote;
}
},
_parseElementAnnotations: function (element, list) {
var annote = {
bindings: [],
events: []
};
if (element.localName === 'content') {
list._hasContent = true;
}
this._parseChildNodesAnnotations(element, annote, list);
if (element.attributes) {
this._parseNodeAttributeAnnotations(element, annote, list);
if (this.prepElement) {
this.prepElement(element);
}
}
if (annote.bindings.length || annote.events.length || annote.id) {
list.push(annote);
}
return annote;
},
_parseChildNodesAnnotations: function (root, annote, list, callback) {
if (root.firstChild) {
for (var i = 0, node = root.firstChild; node; node = node.nextSibling, i++) {
if (node.localName === 'template' && !node.hasAttribute('preserve-content')) {
this._parseTemplate(node, i, list, annote);
}
var childAnnotation = this._parseNodeAnnotations(node, list, callback);
if (childAnnotation) {
childAnnotation.parent = annote;
childAnnotation.index = i;
}
}
}
},
_parseTemplate: function (node, index, list, parent) {
var content = document.createDocumentFragment();
content._notes = this.parseAnnotations(node);
content.appendChild(node.content);
list.push({
bindings: Polymer.nar,
events: Polymer.nar,
templateContent: content,
parent: parent,
index: index
});
},
_parseNodeAttributeAnnotations: function (node, annotation) {
for (var i = node.attributes.length - 1, a; a = node.attributes[i]; i--) {
var n = a.name, v = a.value;
if (n === 'id' && !this._testEscape(v)) {
annotation.id = v;
} else if (n.slice(0, 3) === 'on-') {
node.removeAttribute(n);
annotation.events.push({
name: n.slice(3),
value: v
});
} else {
var b = this._parseNodeAttributeAnnotation(node, n, v);
if (b) {
annotation.bindings.push(b);
}
}
}
},
_parseNodeAttributeAnnotation: function (node, n, v) {
var escape = this._testEscape(v);
if (escape) {
var customEvent;
var name = n;
var mode = escape[0];
v = v.slice(2, -2).trim();
var not = false;
if (v[0] == '!') {
v = v.substring(1);
not = true;
}
var kind = 'property';
if (n[n.length - 1] == '$') {
name = n.slice(0, -1);
kind = 'attribute';
}
var notifyEvent, colon;
if (mode == '{' && (colon = v.indexOf('::')) > 0) {
notifyEvent = v.substring(colon + 2);
v = v.substring(0, colon);
customEvent = true;
}
if (node.localName == 'input' && n == 'value') {
node.setAttribute(n, '');
}
node.removeAttribute(n);
if (kind === 'property') {
name = Polymer.CaseMap.dashToCamelCase(name);
}
return {
kind: kind,
mode: mode,
name: name,
value: v,
negate: not,
event: notifyEvent,
customEvent: customEvent
};
}
},
_localSubTree: function (node, host) {
return node === host ? node.childNodes : node._lightChildren || node.childNodes;
},
findAnnotatedNode: function (root, annote) {
var parent = annote.parent && Polymer.Annotations.findAnnotatedNode(root, annote.parent);
return !parent ? root : Polymer.Annotations._localSubTree(parent, root)[annote.index];
}
};
(function () {
function resolveCss(cssText, ownerDocument) {
return cssText.replace(CSS_URL_RX, function (m, pre, url, post) {
return pre + '\'' + resolve(url.replace(/["']/g, ''), ownerDocument) + '\'' + post;
});
}
function resolveAttrs(element, ownerDocument) {
for (var name in URL_ATTRS) {
var a$ = URL_ATTRS[name];
for (var i = 0, l = a$.length, a, at, v; i < l && (a = a$[i]); i++) {
if (name === '*' || element.localName === name) {
at = element.attributes[a];
v = at && at.value;
if (v && v.search(BINDING_RX) < 0) {
at.value = a === 'style' ? resolveCss(v, ownerDocument) : resolve(v, ownerDocument);
}
}
}
}
}
function resolve(url, ownerDocument) {
if (url && url[0] === '#') {
return url;
}
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
return ownerDocument.__urlResolver || (ownerDocument.__urlResolver = ownerDocument.createElement('a'));
}
var CSS_URL_RX = /(url\()([^)]*)(\))/g;
var URL_ATTRS = {
'*': [
'href',
'src',
'style',
'url'
],
form: ['action']
};
var BINDING_RX = /\{\{|\[\[/;
Polymer.ResolveUrl = {
resolveCss: resolveCss,
resolveAttrs: resolveAttrs,
resolveUrl: resolveUrl
};
}());
Polymer.Base._addFeature({
_prepAnnotations: function () {
if (!this._template) {
this._notes = [];
} else {
Polymer.Annotations.prepElement = this._prepElement.bind(this);
this._notes = Polymer.Annotations.parseAnnotations(this._template);
this._processAnnotations(this._notes);
Polymer.Annotations.prepElement = null;
}
},
_processAnnotations: function (notes) {
for (var i = 0; i < notes.length; i++) {
var note = notes[i];
for (var j = 0; j < note.bindings.length; j++) {
var b = note.bindings[j];
b.signature = this._parseMethod(b.value);
if (!b.signature) {
b.model = this._modelForPath(b.value);
}
}
if (note.templateContent) {
this._processAnnotations(note.templateContent._notes);
var pp = note.templateContent._parentProps = this._discoverTemplateParentProps(note.templateContent._notes);
var bindings = [];
for (var prop in pp) {
bindings.push({
index: note.index,
kind: 'property',
mode: '{',
name: '_parent_' + prop,
model: prop,
value: prop
});
}
note.bindings = note.bindings.concat(bindings);
}
}
},
_discoverTemplateParentProps: function (notes) {
var pp = {};
notes.forEach(function (n) {
n.bindings.forEach(function (b) {
if (b.signature) {
var args = b.signature.args;
for (var k = 0; k < args.length; k++) {
pp[args[k].model] = true;
}
} else {
pp[b.model] = true;
}
});
if (n.templateContent) {
var tpp = n.templateContent._parentProps;
Polymer.Base.mixin(pp, tpp);
}
});
return pp;
},
_prepElement: function (element) {
Polymer.ResolveUrl.resolveAttrs(element, this._template.ownerDocument);
},
_findAnnotatedNode: Polymer.Annotations.findAnnotatedNode,
_marshalAnnotationReferences: function () {
if (this._template) {
this._marshalIdNodes();
this._marshalAnnotatedNodes();
this._marshalAnnotatedListeners();
}
},
_configureAnnotationReferences: function () {
this._configureTemplateContent();
},
_configureTemplateContent: function () {
this._notes.forEach(function (note, i) {
if (note.templateContent) {
this._nodes[i]._content = note.templateContent;
}
}, this);
},
_marshalIdNodes: function () {
this.$ = {};
this._notes.forEach(function (a) {
if (a.id) {
this.$[a.id] = this._findAnnotatedNode(this.root, a);
}
}, this);
},
_marshalAnnotatedNodes: function () {
if (this._nodes) {
this._nodes = this._nodes.map(function (a) {
return this._findAnnotatedNode(this.root, a);
}, this);
}
},
_marshalAnnotatedListeners: function () {
this._notes.forEach(function (a) {
if (a.events && a.events.length) {
var node = this._findAnnotatedNode(this.root, a);
a.events.forEach(function (e) {
this.listen(node, e.name, e.value);
}, this);
}
}, this);
}
});
Polymer.Base._addFeature({
listeners: {},
_listenListeners: function (listeners) {
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
listen: function (node, eventName, methodName) {
this._listen(node, eventName, this._createEventHandler(node, eventName, methodName));
},
_boundListenerKey: function (eventName, methodName) {
return eventName + ':' + methodName;
},
_recordEventHandler: function (host, eventName, target, methodName, handler) {
var hbl = host.__boundListeners;
if (!hbl) {
hbl = host.__boundListeners = new WeakMap();
}
var bl = hbl.get(target);
if (!bl) {
bl = {};
hbl.set(target, bl);
}
var key = this._boundListenerKey(eventName, methodName);
bl[key] = handler;
},
_recallEventHandler: function (host, eventName, target, methodName) {
var hbl = host.__boundListeners;
if (!hbl) {
return;
}
var bl = hbl.get(target);
if (!bl) {
return;
}
var key = this._boundListenerKey(eventName, methodName);
return bl[key];
},
_createEventHandler: function (node, eventName, methodName) {
var host = this;
var handler = function (e) {
if (host[methodName]) {
host[methodName](e, e.detail);
} else {
host._warn(host._logf('_createEventHandler', 'listener method `' + methodName + '` not defined'));
}
};
this._recordEventHandler(host, eventName, node, methodName, handler);
return handler;
},
unlisten: function (node, eventName, methodName) {
var handler = this._recallEventHandler(this, eventName, node, methodName);
if (handler) {
this._unlisten(node, eventName, handler);
}
},
_listen: function (node, eventName, handler) {
node.addEventListener(eventName, handler);
},
_unlisten: function (node, eventName, handler) {
node.removeEventListener(eventName, handler);
}
});
(function () {
'use strict';
var HAS_NATIVE_TA = typeof document.head.style.touchAction === 'string';
var GESTURE_KEY = '__polymerGestures';
var HANDLED_OBJ = '__polymerGesturesHandled';
var TOUCH_ACTION = '__polymerGesturesTouchAction';
var TAP_DISTANCE = 25;
var TRACK_DISTANCE = 5;
var TRACK_LENGTH = 2;
var MOUSE_TIMEOUT = 2500;
var MOUSE_EVENTS = [
'mousedown',
'mousemove',
'mouseup',
'click'
];
var mouseCanceller = function (mouseEvent) {
mouseEvent[HANDLED_OBJ] = { skip: true };
if (mouseEvent.type === 'click') {
var path = Polymer.dom(mouseEvent).path;
for (var i = 0; i < path.length; i++) {
if (path[i] === POINTERSTATE.mouse.target) {
return;
}
}
mouseEvent.preventDefault();
mouseEvent.stopPropagation();
}
};
function setupTeardownMouseCanceller(setup) {
for (var i = 0, en; i < MOUSE_EVENTS.length; i++) {
en = MOUSE_EVENTS[i];
if (setup) {
document.addEventListener(en, mouseCanceller, true);
} else {
document.removeEventListener(en, mouseCanceller, true);
}
}
}
function ignoreMouse() {
if (!POINTERSTATE.mouse.mouseIgnoreJob) {
setupTeardownMouseCanceller(true);
}
var unset = function () {
setupTeardownMouseCanceller();
POINTERSTATE.mouse.target = null;
POINTERSTATE.mouse.mouseIgnoreJob = null;
};
POINTERSTATE.mouse.mouseIgnoreJob = Polymer.Debounce(POINTERSTATE.mouse.mouseIgnoreJob, unset, MOUSE_TIMEOUT);
}
var POINTERSTATE = {
mouse: {
target: null,
mouseIgnoreJob: null
},
touch: {
x: 0,
y: 0,
id: -1,
scrollDecided: false
}
};
function firstTouchAction(ev) {
var path = Polymer.dom(ev).path;
var ta = 'auto';
for (var i = 0, n; i < path.length; i++) {
n = path[i];
if (n[TOUCH_ACTION]) {
ta = n[TOUCH_ACTION];
break;
}
}
return ta;
}
var Gestures = {
gestures: {},
recognizers: [],
deepTargetFind: function (x, y) {
var node = document.elementFromPoint(x, y);
var next = node;
while (next && next.shadowRoot) {
next = next.shadowRoot.elementFromPoint(x, y);
if (next) {
node = next;
}
}
return node;
},
handleNative: function (ev) {
var handled;
var type = ev.type;
var node = ev.currentTarget;
var gobj = node[GESTURE_KEY];
var gs = gobj[type];
if (!gs) {
return;
}
if (!ev[HANDLED_OBJ]) {
ev[HANDLED_OBJ] = {};
if (type.slice(0, 5) === 'touch') {
var t = ev.changedTouches[0];
if (type === 'touchstart') {
if (ev.touches.length === 1) {
POINTERSTATE.touch.id = t.identifier;
}
}
if (POINTERSTATE.touch.id !== t.identifier) {
return;
}
if (!HAS_NATIVE_TA) {
if (type === 'touchstart' || type === 'touchmove') {
Gestures.handleTouchAction(ev);
}
}
if (type === 'touchend') {
POINTERSTATE.mouse.target = Polymer.dom(ev).rootTarget;
ignoreMouse(true);
}
}
}
handled = ev[HANDLED_OBJ];
if (handled.skip) {
return;
}
var recognizers = Gestures.recognizers;
for (var i = 0, r; i < recognizers.length; i++) {
r = recognizers[i];
if (gs[r.name] && !handled[r.name]) {
handled[r.name] = true;
r[type](ev);
}
}
},
handleTouchAction: function (ev) {
var t = ev.changedTouches[0];
var type = ev.type;
if (type === 'touchstart') {
POINTERSTATE.touch.x = t.clientX;
POINTERSTATE.touch.y = t.clientY;
POINTERSTATE.touch.scrollDecided = false;
} else if (type === 'touchmove') {
if (POINTERSTATE.touch.scrollDecided) {
return;
}
POINTERSTATE.touch.scrollDecided = true;
var ta = firstTouchAction(ev);
var prevent = false;
var dx = Math.abs(POINTERSTATE.touch.x - t.clientX);
var dy = Math.abs(POINTERSTATE.touch.y - t.clientY);
if (!ev.cancelable) {
} else if (ta === 'none') {
prevent = true;
} else if (ta === 'pan-x') {
prevent = dy > dx;
} else if (ta === 'pan-y') {
prevent = dx > dy;
}
if (prevent) {
ev.preventDefault();
}
}
},
add: function (node, evType, handler) {
var recognizer = this.gestures[evType];
var deps = recognizer.deps;
var name = recognizer.name;
var gobj = node[GESTURE_KEY];
if (!gobj) {
node[GESTURE_KEY] = gobj = {};
}
for (var i = 0, dep, gd; i < deps.length; i++) {
dep = deps[i];
gd = gobj[dep];
if (!gd) {
gobj[dep] = gd = {};
node.addEventListener(dep, this.handleNative);
}
gd[name] = (gd[name] || 0) + 1;
}
node.addEventListener(evType, handler);
if (recognizer.touchAction) {
this.setTouchAction(node, recognizer.touchAction);
}
},
remove: function (node, evType, handler) {
var recognizer = this.gestures[evType];
var deps = recognizer.deps;
var name = recognizer.name;
var gobj = node[GESTURE_KEY];
if (gobj) {
for (var i = 0, dep, gd; i < deps.length; i++) {
dep = deps[i];
gd = gobj[dep];
if (gd && gd[name]) {
gd[name] = (gd[name] || 1) - 1;
if (gd[name] === 0) {
node.removeEventListener(dep, this.handleNative);
}
}
}
}
node.removeEventListener(evType, handler);
},
register: function (recog) {
this.recognizers.push(recog);
for (var i = 0; i < recog.emits.length; i++) {
this.gestures[recog.emits[i]] = recog;
}
},
findRecognizerByEvent: function (evName) {
for (var i = 0, r; i < this.recognizers.length; i++) {
r = this.recognizers[i];
for (var j = 0, n; j < r.emits.length; j++) {
n = r.emits[j];
if (n === evName) {
return r;
}
}
}
return null;
},
setTouchAction: function (node, value) {
if (HAS_NATIVE_TA) {
node.style.touchAction = value;
}
node[TOUCH_ACTION] = value;
},
fire: function (target, type, detail) {
var ev = Polymer.Base.fire(type, detail, {
node: target,
bubbles: true,
cancelable: true
});
if (ev.defaultPrevented) {
var se = detail.sourceEvent;
if (se && se.preventDefault) {
se.preventDefault();
}
}
},
prevent: function (evName) {
var recognizer = this.findRecognizerByEvent(evName);
if (recognizer.info) {
recognizer.info.prevent = true;
}
}
};
Gestures.register({
name: 'downup',
deps: [
'mousedown',
'touchstart',
'touchend'
],
emits: [
'down',
'up'
],
mousedown: function (e) {
var t = e.currentTarget;
var self = this;
var upfn = function upfn(e) {
self.fire('up', t, e);
document.removeEventListener('mouseup', upfn);
};
document.addEventListener('mouseup', upfn);
this.fire('down', t, e);
},
touchstart: function (e) {
this.fire('down', e.currentTarget, e.changedTouches[0]);
},
touchend: function (e) {
this.fire('up', e.currentTarget, e.changedTouches[0]);
},
fire: function (type, target, event) {
var self = this;
Gestures.fire(target, type, {
x: event.clientX,
y: event.clientY,
sourceEvent: event,
prevent: Gestures.prevent.bind(Gestures)
});
}
});
Gestures.register({
name: 'track',
touchAction: 'none',
deps: [
'mousedown',
'touchstart',
'touchmove',
'touchend'
],
emits: ['track'],
info: {
x: 0,
y: 0,
state: 'start',
started: false,
moves: [],
addMove: function (move) {
if (this.moves.length > TRACK_LENGTH) {
this.moves.shift();
}
this.moves.push(move);
},
prevent: false
},
clearInfo: function () {
this.info.state = 'start';
this.info.started = false;
this.info.moves = [];
this.info.x = 0;
this.info.y = 0;
this.info.prevent = false;
},
hasMovedEnough: function (x, y) {
if (this.info.prevent) {
return false;
}
if (this.info.started) {
return true;
}
var dx = Math.abs(this.info.x - x);
var dy = Math.abs(this.info.y - y);
return dx >= TRACK_DISTANCE || dy >= TRACK_DISTANCE;
},
mousedown: function (e) {
var t = e.currentTarget;
var self = this;
var movefn = function movefn(e) {
var x = e.clientX, y = e.clientY;
if (self.hasMovedEnough(x, y)) {
self.info.state = self.info.started ? e.type === 'mouseup' ? 'end' : 'track' : 'start';
self.info.addMove({
x: x,
y: y
});
self.fire(t, e);
self.info.started = true;
}
};
var upfn = function upfn(e) {
if (self.info.started) {
Gestures.prevent('tap');
movefn(e);
}
self.clearInfo();
document.removeEventListener('mousemove', movefn);
document.removeEventListener('mouseup', upfn);
};
document.addEventListener('mousemove', movefn);
document.addEventListener('mouseup', upfn);
this.info.x = e.clientX;
this.info.y = e.clientY;
},
touchstart: function (e) {
var ct = e.changedTouches[0];
this.info.x = ct.clientX;
this.info.y = ct.clientY;
},
touchmove: function (e) {
var t = e.currentTarget;
var ct = e.changedTouches[0];
var x = ct.clientX, y = ct.clientY;
if (this.hasMovedEnough(x, y)) {
this.info.addMove({
x: x,
y: y
});
this.fire(t, ct);
this.info.state = 'track';
this.info.started = true;
}
},
touchend: function (e) {
var t = e.currentTarget;
var ct = e.changedTouches[0];
if (this.info.started) {
Gestures.prevent('tap');
this.info.state = 'end';
this.info.addMove({
x: ct.clientX,
y: ct.clientY
});
this.fire(t, ct);
}
this.clearInfo();
},
fire: function (target, touch) {
var secondlast = this.info.moves[this.info.moves.length - 2];
var lastmove = this.info.moves[this.info.moves.length - 1];
var dx = lastmove.x - this.info.x;
var dy = lastmove.y - this.info.y;
var ddx, ddy = 0;
if (secondlast) {
ddx = lastmove.x - secondlast.x;
ddy = lastmove.y - secondlast.y;
}
return Gestures.fire(target, 'track', {
state: this.info.state,
x: touch.clientX,
y: touch.clientY,
dx: dx,
dy: dy,
ddx: ddx,
ddy: ddy,
sourceEvent: touch,
hover: function () {
return Gestures.deepTargetFind(touch.clientX, touch.clientY);
}
});
}
});
Gestures.register({
name: 'tap',
deps: [
'mousedown',
'click',
'touchstart',
'touchend'
],
emits: ['tap'],
info: {
x: NaN,
y: NaN,
prevent: false
},
reset: function () {
this.info.x = NaN;
this.info.y = NaN;
this.info.prevent = false;
},
save: function (e) {
this.info.x = e.clientX;
this.info.y = e.clientY;
},
mousedown: function (e) {
this.save(e);
},
click: function (e) {
this.forward(e);
},
touchstart: function (e) {
this.save(e.changedTouches[0]);
},
touchend: function (e) {
this.forward(e.changedTouches[0]);
},
forward: function (e) {
var dx = Math.abs(e.clientX - this.info.x);
var dy = Math.abs(e.clientY - this.info.y);
if (isNaN(dx) || isNaN(dy) || dx <= TAP_DISTANCE && dy <= TAP_DISTANCE) {
if (!this.info.prevent) {
Gestures.fire(e.target, 'tap', {
x: e.clientX,
y: e.clientY,
sourceEvent: e
});
}
}
this.reset();
}
});
var DIRECTION_MAP = {
x: 'pan-x',
y: 'pan-y',
none: 'none',
all: 'auto'
};
Polymer.Base._addFeature({
_listen: function (node, eventName, handler) {
if (Gestures.gestures[eventName]) {
Gestures.add(node, eventName, handler);
} else {
node.addEventListener(eventName, handler);
}
},
_unlisten: function (node, eventName, handler) {
if (Gestures.gestures[eventName]) {
Gestures.remove(node, eventName, handler);
} else {
node.removeEventListener(eventName, handler);
}
},
setScrollDirection: function (direction, node) {
node = node || this;
Gestures.setTouchAction(node, DIRECTION_MAP[direction] || 'auto');
}
});
Polymer.Gestures = Gestures;
}());
Polymer.Async = {
_currVal: 0,
_lastVal: 0,
_callbacks: [],
_twiddleContent: 0,
_twiddle: document.createTextNode(''),
run: function (callback, waitTime) {
if (waitTime > 0) {
return ~setTimeout(callback, waitTime);
} else {
this._twiddle.textContent = this._twiddleContent++;
this._callbacks.push(callback);
return this._currVal++;
}
},
cancel: function (handle) {
if (handle < 0) {
clearTimeout(~handle);
} else {
var idx = handle - this._lastVal;
if (idx >= 0) {
if (!this._callbacks[idx]) {
throw 'invalid async handle: ' + handle;
}
this._callbacks[idx] = null;
}
}
},
_atEndOfMicrotask: function () {
var len = this._callbacks.length;
for (var i = 0; i < len; i++) {
var cb = this._callbacks[i];
if (cb) {
try {
cb();
} catch (e) {
i++;
this._callbacks.splice(0, i);
this._lastVal += i;
this._twiddle.textContent = this._twiddleContent++;
throw e;
}
}
}
this._callbacks.splice(0, len);
this._lastVal += len;
}
};
new (window.MutationObserver || JsMutationObserver)(Polymer.Async._atEndOfMicrotask.bind(Polymer.Async)).observe(Polymer.Async._twiddle, { characterData: true });
Polymer.Debounce = function () {
var Async = Polymer.Async;
var Debouncer = function (context) {
this.context = context;
this.boundComplete = this.complete.bind(this);
};
Debouncer.prototype = {
go: function (callback, wait) {
var h;
this.finish = function () {
Async.cancel(h);
};
h = Async.run(this.boundComplete, wait);
this.callback = callback;
},
stop: function () {
if (this.finish) {
this.finish();
this.finish = null;
}
},
complete: function () {
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
return debounce;
}();
Polymer.Base._addFeature({
$$: function (slctr) {
return Polymer.dom(this.root).querySelector(slctr);
},
toggleClass: function (name, bool, node) {
node = node || this;
if (arguments.length == 1) {
bool = !node.classList.contains(name);
}
if (bool) {
Polymer.dom(node).classList.add(name);
} else {
Polymer.dom(node).classList.remove(name);
}
},
toggleAttribute: function (name, bool, node) {
node = node || this;
if (arguments.length == 1) {
bool = !node.hasAttribute(name);
}
if (bool) {
Polymer.dom(node).setAttribute(name, '');
} else {
Polymer.dom(node).removeAttribute(name);
}
},
classFollows: function (name, toElement, fromElement) {
if (fromElement) {
Polymer.dom(fromElement).classList.remove(name);
}
if (toElement) {
Polymer.dom(toElement).classList.add(name);
}
},
attributeFollows: function (name, toElement, fromElement) {
if (fromElement) {
Polymer.dom(fromElement).removeAttribute(name);
}
if (toElement) {
Polymer.dom(toElement).setAttribute(name, '');
}
},
getContentChildNodes: function (slctr) {
return Polymer.dom(Polymer.dom(this.root).querySelector(slctr || 'content')).getDistributedNodes();
},
getContentChildren: function (slctr) {
return this.getContentChildNodes(slctr).filter(function (n) {
return n.nodeType === Node.ELEMENT_NODE;
});
},
fire: function (type, detail, options) {
options = options || Polymer.nob;
var node = options.node || this;
var detail = detail === null || detail === undefined ? Polymer.nob : detail;
var bubbles = options.bubbles === undefined ? true : options.bubbles;
var cancelable = Boolean(options.cancelable);
var event = new CustomEvent(type, {
bubbles: Boolean(bubbles),
cancelable: cancelable,
detail: detail
});
node.dispatchEvent(event);
return event;
},
async: function (callback, waitTime) {
return Polymer.Async.run(callback.bind(this), waitTime);
},
cancelAsync: function (handle) {
Polymer.Async.cancel(handle);
},
arrayDelete: function (path, item) {
var index;
if (Array.isArray(path)) {
index = path.indexOf(item);
if (index >= 0) {
return path.splice(index, 1);
}
} else {
var arr = this.get(path);
index = arr.indexOf(item);
if (index >= 0) {
return this.splice(path, index, 1);
}
}
},
transform: function (transform, node) {
node = node || this;
node.style.webkitTransform = transform;
node.style.transform = transform;
},
translate3d: function (x, y, z, node) {
node = node || this;
this.transform('translate3d(' + x + ',' + y + ',' + z + ')', node);
},
importHref: function (href, onload, onerror) {
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
create: function (tag, props) {
var elt = document.createElement(tag);
if (props) {
for (var n in props) {
elt[n] = props[n];
}
}
return elt;
}
});
Polymer.Bind = {
prepareModel: function (model) {
model._propertyEffects = {};
model._bindListeners = [];
var api = this._modelApi;
for (var n in api) {
model[n] = api[n];
}
},
_modelApi: {
_notifyChange: function (property) {
var eventName = Polymer.CaseMap.camelToDashCase(property) + '-changed';
this.fire(eventName, { value: this[property] }, { bubbles: false });
},
_propertySetter: function (property, value, effects, fromAbove) {
var old = this.__data__[property];
if (old !== value && (old === old || value === value)) {
this.__data__[property] = value;
if (typeof value == 'object') {
this._clearPath(property);
}
if (this._propertyChanged) {
this._propertyChanged(property, value, old);
}
if (effects) {
this._effectEffects(property, value, effects, old, fromAbove);
}
}
return old;
},
__setProperty: function (property, value, quiet, node) {
node = node || this;
var effects = node._propertyEffects && node._propertyEffects[property];
if (effects) {
node._propertySetter(property, value, effects, quiet);
} else {
node[property] = value;
}
},
_effectEffects: function (property, value, effects, old, fromAbove) {
effects.forEach(function (fx) {
var fn = Polymer.Bind['_' + fx.kind + 'Effect'];
if (fn) {
fn.call(this, property, value, fx.effect, old, fromAbove);
}
}, this);
},
_clearPath: function (path) {
for (var prop in this.__data__) {
if (prop.indexOf(path + '.') === 0) {
this.__data__[prop] = undefined;
}
}
}
},
ensurePropertyEffects: function (model, property) {
var fx = model._propertyEffects[property];
if (!fx) {
fx = model._propertyEffects[property] = [];
}
return fx;
},
addPropertyEffect: function (model, property, kind, effect) {
var fx = this.ensurePropertyEffects(model, property);
fx.push({
kind: kind,
effect: effect
});
},
createBindings: function (model) {
var fx$ = model._propertyEffects;
if (fx$) {
for (var n in fx$) {
var fx = fx$[n];
fx.sort(this._sortPropertyEffects);
this._createAccessors(model, n, fx);
}
}
},
_sortPropertyEffects: function () {
var EFFECT_ORDER = {
'compute': 0,
'annotation': 1,
'computedAnnotation': 2,
'reflect': 3,
'notify': 4,
'observer': 5,
'complexObserver': 6,
'function': 7
};
return function (a, b) {
return EFFECT_ORDER[a.kind] - EFFECT_ORDER[b.kind];
};
}(),
_createAccessors: function (model, property, effects) {
var defun = {
get: function () {
return this.__data__[property];
}
};
var setter = function (value) {
this._propertySetter(property, value, effects);
};
if (model.getPropertyInfo && model.getPropertyInfo(property).readOnly) {
model['_set' + this.upper(property)] = setter;
} else {
defun.set = setter;
}
Object.defineProperty(model, property, defun);
},
upper: function (name) {
return name[0].toUpperCase() + name.substring(1);
},
_addAnnotatedListener: function (model, index, property, path, event) {
var fn = this._notedListenerFactory(property, path, this._isStructured(path), this._isEventBogus);
var eventName = event || Polymer.CaseMap.camelToDashCase(property) + '-changed';
model._bindListeners.push({
index: index,
property: property,
path: path,
changedFn: fn,
event: eventName
});
},
_isStructured: function (path) {
return path.indexOf('.') > 0;
},
_isEventBogus: function (e, target) {
return e.path && e.path[0] !== target;
},
_notedListenerFactory: function (property, path, isStructured, bogusTest) {
return function (e, target) {
if (!bogusTest(e, target)) {
if (e.detail && e.detail.path) {
this.notifyPath(this._fixPath(path, property, e.detail.path), e.detail.value);
} else {
var value = target[property];
if (!isStructured) {
this[path] = target[property];
} else {
if (this.__data__[path] != value) {
this.set(path, value);
}
}
}
}
};
},
prepareInstance: function (inst) {
inst.__data__ = Object.create(null);
},
setupBindListeners: function (inst) {
inst._bindListeners.forEach(function (info) {
var node = inst._nodes[info.index];
node.addEventListener(info.event, inst._notifyListener.bind(inst, info.changedFn));
});
}
};
Polymer.Base.extend(Polymer.Bind, {
_shouldAddListener: function (effect) {
return effect.name && effect.mode === '{' && !effect.negate && effect.kind != 'attribute';
},
_annotationEffect: function (source, value, effect) {
if (source != effect.value) {
value = this.get(effect.value);
this.__data__[effect.value] = value;
}
var calc = effect.negate ? !value : value;
if (!effect.customEvent || this._nodes[effect.index][effect.name] !== calc) {
return this._applyEffectValue(calc, effect);
}
},
_reflectEffect: function (source) {
this.reflectPropertyToAttribute(source);
},
_notifyEffect: function (source, value, effect, old, fromAbove) {
if (!fromAbove) {
this._notifyChange(source);
}
},
_functionEffect: function (source, value, fn, old, fromAbove) {
fn.call(this, source, value, old, fromAbove);
},
_observerEffect: function (source, value, effect, old) {
var fn = this[effect.method];
if (fn) {
fn.call(this, value, old);
} else {
this._warn(this._logf('_observerEffect', 'observer method `' + effect.method + '` not defined'));
}
},
_complexObserverEffect: function (source, value, effect) {
var fn = this[effect.method];
if (fn) {
var args = Polymer.Bind._marshalArgs(this.__data__, effect, source, value);
if (args) {
fn.apply(this, args);
}
} else {
this._warn(this._logf('_complexObserverEffect', 'observer method `' + effect.method + '` not defined'));
}
},
_computeEffect: function (source, value, effect) {
var args = Polymer.Bind._marshalArgs(this.__data__, effect, source, value);
if (args) {
var fn = this[effect.method];
if (fn) {
this.__setProperty(effect.property, fn.apply(this, args));
} else {
this._warn(this._logf('_computeEffect', 'compute method `' + effect.method + '` not defined'));
}
}
},
_annotatedComputationEffect: function (source, value, effect) {
var computedHost = this._rootDataHost || this;
var fn = computedHost[effect.method];
if (fn) {
var args = Polymer.Bind._marshalArgs(this.__data__, effect, source, value);
if (args) {
var computedvalue = fn.apply(computedHost, args);
if (effect.negate) {
computedvalue = !computedvalue;
}
this._applyEffectValue(computedvalue, effect);
}
} else {
computedHost._warn(computedHost._logf('_annotatedComputationEffect', 'compute method `' + effect.method + '` not defined'));
}
},
_marshalArgs: function (model, effect, path, value) {
var values = [];
var args = effect.args;
for (var i = 0, l = args.length; i < l; i++) {
var arg = args[i];
var name = arg.name;
var v;
if (arg.literal) {
v = arg.value;
} else if (arg.structured) {
v = Polymer.Base.get(name, model);
} else {
v = model[name];
}
if (args.length > 1 && v === undefined) {
return;
}
if (arg.wildcard) {
var baseChanged = name.indexOf(path + '.') === 0;
var matches = effect.trigger.name.indexOf(name) === 0 && !baseChanged;
values[i] = {
path: matches ? path : name,
value: matches ? value : v,
base: v
};
} else {
values[i] = v;
}
}
return values;
}
});
Polymer.Base._addFeature({
_addPropertyEffect: function (property, kind, effect) {
Polymer.Bind.addPropertyEffect(this, property, kind, effect);
},
_prepEffects: function () {
Polymer.Bind.prepareModel(this);
this._addAnnotationEffects(this._notes);
},
_prepBindings: function () {
Polymer.Bind.createBindings(this);
},
_addPropertyEffects: function (properties) {
if (properties) {
for (var p in properties) {
var prop = properties[p];
if (prop.observer) {
this._addObserverEffect(p, prop.observer);
}
if (prop.computed) {
prop.readOnly = true;
this._addComputedEffect(p, prop.computed);
}
if (prop.notify) {
this._addPropertyEffect(p, 'notify');
}
if (prop.reflectToAttribute) {
this._addPropertyEffect(p, 'reflect');
}
if (prop.readOnly) {
Polymer.Bind.ensurePropertyEffects(this, p);
}
}
}
},
_addComputedEffect: function (name, expression) {
var sig = this._parseMethod(expression);
sig.args.forEach(function (arg) {
this._addPropertyEffect(arg.model, 'compute', {
method: sig.method,
args: sig.args,
trigger: arg,
property: name
});
}, this);
},
_addObserverEffect: function (property, observer) {
this._addPropertyEffect(property, 'observer', {
method: observer,
property: property
});
},
_addComplexObserverEffects: function (observers) {
if (observers) {
observers.forEach(function (observer) {
this._addComplexObserverEffect(observer);
}, this);
}
},
_addComplexObserverEffect: function (observer) {
var sig = this._parseMethod(observer);
sig.args.forEach(function (arg) {
this._addPropertyEffect(arg.model, 'complexObserver', {
method: sig.method,
args: sig.args,
trigger: arg
});
}, this);
},
_addAnnotationEffects: function (notes) {
this._nodes = [];
notes.forEach(function (note) {
var index = this._nodes.push(note) - 1;
note.bindings.forEach(function (binding) {
this._addAnnotationEffect(binding, index);
}, this);
}, this);
},
_addAnnotationEffect: function (note, index) {
if (Polymer.Bind._shouldAddListener(note)) {
Polymer.Bind._addAnnotatedListener(this, index, note.name, note.value, note.event);
}
if (note.signature) {
this._addAnnotatedComputationEffect(note, index);
} else {
note.index = index;
this._addPropertyEffect(note.model, 'annotation', note);
}
},
_addAnnotatedComputationEffect: function (note, index) {
var sig = note.signature;
if (sig.static) {
this.__addAnnotatedComputationEffect('__static__', index, note, sig, null);
} else {
sig.args.forEach(function (arg) {
if (!arg.literal) {
this.__addAnnotatedComputationEffect(arg.model, index, note, sig, arg);
}
}, this);
}
},
__addAnnotatedComputationEffect: function (property, index, note, sig, trigger) {
this._addPropertyEffect(property, 'annotatedComputation', {
index: index,
kind: note.kind,
property: note.name,
negate: note.negate,
method: sig.method,
args: sig.args,
trigger: trigger
});
},
_parseMethod: function (expression) {
var m = expression.match(/(\w*)\((.*)\)/);
if (m) {
var sig = {
method: m[1],
static: true
};
if (m[2].trim()) {
var args = m[2].replace(/\\,/g, '&comma;').split(',');
return this._parseArgs(args, sig);
} else {
sig.args = Polymer.nar;
return sig;
}
}
},
_parseArgs: function (argList, sig) {
sig.args = argList.map(function (rawArg) {
var arg = this._parseArg(rawArg);
if (!arg.literal) {
sig.static = false;
}
return arg;
}, this);
return sig;
},
_parseArg: function (rawArg) {
var arg = rawArg.trim().replace(/&comma;/g, ',').replace(/\\(.)/g, '$1');
var a = {
name: arg,
model: this._modelForPath(arg)
};
var fc = arg[0];
if (fc >= '0' && fc <= '9') {
fc = '#';
}
switch (fc) {
case '\'':
case '"':
a.value = arg.slice(1, -1);
a.literal = true;
break;
case '#':
a.value = Number(arg);
a.literal = true;
break;
}
if (!a.literal) {
a.structured = arg.indexOf('.') > 0;
if (a.structured) {
a.wildcard = arg.slice(-2) == '.*';
if (a.wildcard) {
a.name = arg.slice(0, -2);
}
}
}
return a;
},
_marshalInstanceEffects: function () {
Polymer.Bind.prepareInstance(this);
Polymer.Bind.setupBindListeners(this);
},
_applyEffectValue: function (value, info) {
var node = this._nodes[info.index];
var property = info.property || info.name || 'textContent';
if (info.kind == 'attribute') {
this.serializeValueToAttribute(value, property, node);
} else {
if (property === 'className') {
value = this._scopeElementClass(node, value);
}
if (property === 'textContent' || node.localName == 'input' && property == 'value') {
value = value == undefined ? '' : value;
}
return node[property] = value;
}
},
_executeStaticEffects: function () {
if (this._propertyEffects.__static__) {
this._effectEffects('__static__', null, this._propertyEffects.__static__);
}
}
});
Polymer.Base._addFeature({
_setupConfigure: function (initialConfig) {
this._config = initialConfig || {};
this._handlers = [];
},
_marshalAttributes: function () {
this._takeAttributesToModel(this._config);
},
_configValue: function (name, value) {
this._config[name] = value;
},
_beforeClientsReady: function () {
this._configure();
},
_configure: function () {
this._configureAnnotationReferences();
this._aboveConfig = this.mixin({}, this._config);
var config = {};
this.behaviors.forEach(function (b) {
this._configureProperties(b.properties, config);
}, this);
this._configureProperties(this.properties, config);
this._mixinConfigure(config, this._aboveConfig);
this._config = config;
this._distributeConfig(this._config);
},
_configureProperties: function (properties, config) {
for (var i in properties) {
var c = properties[i];
if (c.value !== undefined) {
var value = c.value;
if (typeof value == 'function') {
value = value.call(this, this._config);
}
config[i] = value;
}
}
},
_mixinConfigure: function (a, b) {
for (var prop in b) {
if (!this.getPropertyInfo(prop).readOnly) {
a[prop] = b[prop];
}
}
},
_distributeConfig: function (config) {
var fx$ = this._propertyEffects;
if (fx$) {
for (var p in config) {
var fx = fx$[p];
if (fx) {
for (var i = 0, l = fx.length, x; i < l && (x = fx[i]); i++) {
if (x.kind === 'annotation') {
var node = this._nodes[x.effect.index];
if (node._configValue) {
var value = p === x.effect.value ? config[p] : this.get(x.effect.value, config);
node._configValue(x.effect.name, value);
}
}
}
}
}
}
},
_afterClientsReady: function () {
this._executeStaticEffects();
this._applyConfig(this._config, this._aboveConfig);
this._flushHandlers();
},
_applyConfig: function (config, aboveConfig) {
for (var n in config) {
if (this[n] === undefined) {
this.__setProperty(n, config[n], n in aboveConfig);
}
}
},
_notifyListener: function (fn, e) {
if (!this._clientsReadied) {
this._queueHandler([
fn,
e,
e.target
]);
} else {
return fn.call(this, e, e.target);
}
},
_queueHandler: function (args) {
this._handlers.push(args);
},
_flushHandlers: function () {
var h$ = this._handlers;
for (var i = 0, l = h$.length, h; i < l && (h = h$[i]); i++) {
h[0].call(this, h[1], h[2]);
}
}
});
(function () {
'use strict';
Polymer.Base._addFeature({
notifyPath: function (path, value, fromAbove) {
var old = this._propertySetter(path, value);
if (old !== value && (old === old || value === value)) {
this._pathEffector(path, value);
if (!fromAbove) {
this._notifyPath(path, value);
}
}
},
_getPathParts: function (path) {
if (Array.isArray(path)) {
var parts = [];
for (var i = 0; i < path.length; i++) {
var args = path[i].toString().split('.');
for (var j = 0; j < args.length; j++) {
parts.push(args[j]);
}
}
return parts;
} else {
return path.toString().split('.');
}
},
set: function (path, value, root) {
var prop = root || this;
var parts = this._getPathParts(path);
var array;
var last = parts[parts.length - 1];
if (parts.length > 1) {
for (var i = 0; i < parts.length - 1; i++) {
prop = prop[parts[i]];
if (array) {
parts[i] = Polymer.Collection.get(array).getKey(prop);
}
if (!prop) {
return;
}
array = Array.isArray(prop) ? prop : null;
}
if (array) {
var coll = Polymer.Collection.get(array);
var old = prop[last];
var key = coll.getKey(old);
if (key) {
parts[i] = key;
coll.setItem(key, value);
}
}
prop[last] = value;
if (!root) {
this.notifyPath(parts.join('.'), value);
}
} else {
prop[path] = value;
}
},
get: function (path, root) {
var prop = root || this;
var parts = this._getPathParts(path);
var last = parts.pop();
while (parts.length) {
prop = prop[parts.shift()];
if (!prop) {
return;
}
}
return prop[last];
},
_pathEffector: function (path, value) {
var model = this._modelForPath(path);
var fx$ = this._propertyEffects[model];
if (fx$) {
fx$.forEach(function (fx) {
var fxFn = this['_' + fx.kind + 'PathEffect'];
if (fxFn) {
fxFn.call(this, path, value, fx.effect);
}
}, this);
}
if (this._boundPaths) {
this._notifyBoundPaths(path, value);
}
},
_annotationPathEffect: function (path, value, effect) {
if (effect.value === path || effect.value.indexOf(path + '.') === 0) {
Polymer.Bind._annotationEffect.call(this, path, value, effect);
} else if (path.indexOf(effect.value + '.') === 0 && !effect.negate) {
var node = this._nodes[effect.index];
if (node && node.notifyPath) {
var p = this._fixPath(effect.name, effect.value, path);
node.notifyPath(p, value, true);
}
}
},
_complexObserverPathEffect: function (path, value, effect) {
if (this._pathMatchesEffect(path, effect)) {
Polymer.Bind._complexObserverEffect.call(this, path, value, effect);
}
},
_computePathEffect: function (path, value, effect) {
if (this._pathMatchesEffect(path, effect)) {
Polymer.Bind._computeEffect.call(this, path, value, effect);
}
},
_annotatedComputationPathEffect: function (path, value, effect) {
if (this._pathMatchesEffect(path, effect)) {
Polymer.Bind._annotatedComputationEffect.call(this, path, value, effect);
}
},
_pathMatchesEffect: function (path, effect) {
var effectArg = effect.trigger.name;
return effectArg == path || effectArg.indexOf(path + '.') === 0 || effect.trigger.wildcard && path.indexOf(effectArg) === 0;
},
linkPaths: function (to, from) {
this._boundPaths = this._boundPaths || {};
if (from) {
this._boundPaths[to] = from;
} else {
this.unbindPath(to);
}
},
unlinkPaths: function (path) {
if (this._boundPaths) {
delete this._boundPaths[path];
}
},
_notifyBoundPaths: function (path, value) {
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
_fixPath: function (property, root, path) {
return property + path.slice(root.length);
},
_notifyPath: function (path, value) {
var rootName = this._modelForPath(path);
var dashCaseName = Polymer.CaseMap.camelToDashCase(rootName);
var eventName = dashCaseName + this._EVENT_CHANGED;
this.fire(eventName, {
path: path,
value: value
}, { bubbles: false });
},
_modelForPath: function (path) {
var dot = path.indexOf('.');
return dot < 0 ? path : path.slice(0, dot);
},
_EVENT_CHANGED: '-changed',
_notifySplice: function (array, path, index, added, removed) {
var splices = [{
index: index,
addedCount: added,
removed: removed,
object: array,
type: 'splice'
}];
var change = {
keySplices: Polymer.Collection.applySplices(array, splices),
indexSplices: splices
};
this.set(path + '.splices', change);
if (added != removed.length) {
this.notifyPath(path + '.length', array.length);
}
change.keySplices = null;
change.indexSplices = null;
},
push: function (path) {
var array = this.get(path);
var args = Array.prototype.slice.call(arguments, 1);
var len = array.length;
var ret = array.push.apply(array, args);
this._notifySplice(array, path, len, args.length, []);
return ret;
},
pop: function (path) {
var array = this.get(path);
var args = Array.prototype.slice.call(arguments, 1);
var rem = array.slice(-1);
var ret = array.pop.apply(array, args);
this._notifySplice(array, path, array.length, 0, rem);
return ret;
},
splice: function (path, start, deleteCount) {
var array = this.get(path);
var args = Array.prototype.slice.call(arguments, 1);
var ret = array.splice.apply(array, args);
this._notifySplice(array, path, start, args.length - 2, ret);
return ret;
},
shift: function (path) {
var array = this.get(path);
var args = Array.prototype.slice.call(arguments, 1);
var ret = array.shift.apply(array, args);
this._notifySplice(array, path, 0, 0, [ret]);
return ret;
},
unshift: function (path) {
var array = this.get(path);
var args = Array.prototype.slice.call(arguments, 1);
var ret = array.unshift.apply(array, args);
this._notifySplice(array, path, 0, args.length, []);
return ret;
}
});
}());
Polymer.Base._addFeature({
resolveUrl: function (url) {
var module = Polymer.DomModule.import(this.is);
var root = '';
if (module) {
var assetPath = module.getAttribute('assetpath') || '';
root = Polymer.ResolveUrl.resolveUrl(assetPath, module.ownerDocument.baseURI);
}
return Polymer.ResolveUrl.resolveUrl(url, root);
}
});
Polymer.CssParse = function () {
var api = {
parse: function (text) {
text = this._clean(text);
return this._parseCss(this._lex(text), text);
},
_clean: function (cssText) {
return cssText.replace(rx.comments, '').replace(rx.port, '');
},
_lex: function (text) {
var root = {
start: 0,
end: text.length
};
var n = root;
for (var i = 0, s = 0, l = text.length; i < l; i++) {
switch (text[i]) {
case this.OPEN_BRACE:
if (!n.rules) {
n.rules = [];
}
var p = n;
var previous = p.rules[p.rules.length - 1];
n = {
start: i + 1,
parent: p,
previous: previous
};
p.rules.push(n);
break;
case this.CLOSE_BRACE:
n.end = i + 1;
n = n.parent || root;
break;
}
}
return root;
},
_parseCss: function (node, text) {
var t = text.substring(node.start, node.end - 1);
node.parsedCssText = node.cssText = t.trim();
if (node.parent) {
var ss = node.previous ? node.previous.end : node.parent.start;
t = text.substring(ss, node.start - 1);
t = t.substring(t.lastIndexOf(';') + 1);
var s = node.parsedSelector = node.selector = t.trim();
node.atRule = s.indexOf(AT_START) === 0;
if (node.atRule) {
if (s.indexOf(MEDIA_START) === 0) {
node.type = this.types.MEDIA_RULE;
} else if (s.match(rx.keyframesRule)) {
node.type = this.types.KEYFRAMES_RULE;
}
} else {
if (s.indexOf(VAR_START) === 0) {
node.type = this.types.MIXIN_RULE;
} else {
node.type = this.types.STYLE_RULE;
}
}
}
var r$ = node.rules;
if (r$) {
for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
this._parseCss(r, text);
}
}
return node;
},
stringify: function (node, preserveProperties, text) {
text = text || '';
var cssText = '';
if (node.cssText || node.rules) {
var r$ = node.rules;
if (r$ && (preserveProperties || !hasMixinRules(r$))) {
for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
cssText = this.stringify(r, preserveProperties, cssText);
}
} else {
cssText = preserveProperties ? node.cssText : removeCustomProps(node.cssText);
cssText = cssText.trim();
if (cssText) {
cssText = '  ' + cssText + '\n';
}
}
}
if (cssText) {
if (node.selector) {
text += node.selector + ' ' + this.OPEN_BRACE + '\n';
}
text += cssText;
if (node.selector) {
text += this.CLOSE_BRACE + '\n\n';
}
}
return text;
},
types: {
STYLE_RULE: 1,
KEYFRAMES_RULE: 7,
MEDIA_RULE: 4,
MIXIN_RULE: 1000
},
OPEN_BRACE: '{',
CLOSE_BRACE: '}'
};
function hasMixinRules(rules) {
return rules[0].selector.indexOf(VAR_START) >= 0;
}
function removeCustomProps(cssText) {
return cssText.replace(rx.customProp, '').replace(rx.mixinProp, '').replace(rx.mixinApply, '').replace(rx.varApply, '');
}
var VAR_START = '--';
var MEDIA_START = '@media';
var AT_START = '@';
var rx = {
comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
port: /@import[^;]*;/gim,
customProp: /(?:^|[\s;])--[^;{]*?:[^{};]*?(?:[;\n]|$)/gim,
mixinProp: /(?:^|[\s;])--[^;{]*?:[^{;]*?{[^}]*?}(?:[;\n]|$)?/gim,
mixinApply: /@apply[\s]*\([^)]*?\)[\s]*(?:[;\n]|$)?/gim,
varApply: /[^;:]*?:[^;]*var[^;]*(?:[;\n]|$)?/gim,
keyframesRule: /^@[^\s]*keyframes/
};
return api;
}();
Polymer.StyleUtil = function () {
return {
MODULE_STYLES_SELECTOR: 'style, link[rel=import][type~=css]',
toCssText: function (rules, callback, preserveProperties) {
if (typeof rules === 'string') {
rules = this.parser.parse(rules);
}
if (callback) {
this.forEachStyleRule(rules, callback);
}
return this.parser.stringify(rules, preserveProperties);
},
forRulesInStyles: function (styles, callback) {
for (var i = 0, l = styles.length, s; i < l && (s = styles[i]); i++) {
this.forEachStyleRule(this.rulesForStyle(s), callback);
}
},
rulesForStyle: function (style) {
if (!style.__cssRules && style.textContent) {
style.__cssRules = this.parser.parse(style.textContent);
}
return style.__cssRules;
},
clearStyleRules: function (style) {
style.__cssRules = null;
},
forEachStyleRule: function (node, callback) {
var s = node.selector;
var skipRules = false;
if (node.type === this.ruleTypes.STYLE_RULE) {
callback(node);
} else if (node.type === this.ruleTypes.KEYFRAMES_RULE || node.type === this.ruleTypes.MIXIN_RULE) {
skipRules = true;
}
var r$ = node.rules;
if (r$ && !skipRules) {
for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
this.forEachStyleRule(r, callback);
}
}
},
applyCss: function (cssText, moniker, target, afterNode) {
var style = document.createElement('style');
if (moniker) {
style.setAttribute('scope', moniker);
}
style.textContent = cssText;
target = target || document.head;
if (!afterNode) {
var n$ = target.querySelectorAll('style[scope]');
afterNode = n$[n$.length - 1];
}
target.insertBefore(style, afterNode && afterNode.nextSibling || target.firstChild);
return style;
},
cssFromModule: function (moduleId) {
var m = Polymer.DomModule.import(moduleId);
if (m && !m._cssText) {
var cssText = '';
var e$ = Array.prototype.slice.call(m.querySelectorAll(this.MODULE_STYLES_SELECTOR));
for (var i = 0, e; i < e$.length; i++) {
e = e$[i];
if (e.localName === 'style') {
e = e.__appliedElement || e;
e.parentNode.removeChild(e);
} else {
e = e.import && e.import.body;
}
if (e) {
cssText += Polymer.ResolveUrl.resolveCss(e.textContent, e.ownerDocument);
}
}
m._cssText = cssText;
}
return m && m._cssText || '';
},
parser: Polymer.CssParse,
ruleTypes: Polymer.CssParse.types
};
}();
Polymer.StyleTransformer = function () {
var nativeShadow = Polymer.Settings.useNativeShadow;
var styleUtil = Polymer.StyleUtil;
var api = {
dom: function (node, scope, useAttr, shouldRemoveScope) {
this._transformDom(node, scope || '', useAttr, shouldRemoveScope);
},
_transformDom: function (node, selector, useAttr, shouldRemoveScope) {
if (node.setAttribute) {
this.element(node, selector, useAttr, shouldRemoveScope);
}
var c$ = Polymer.dom(node).childNodes;
for (var i = 0; i < c$.length; i++) {
this._transformDom(c$[i], selector, useAttr, shouldRemoveScope);
}
},
element: function (element, scope, useAttr, shouldRemoveScope) {
if (useAttr) {
if (shouldRemoveScope) {
element.removeAttribute(SCOPE_NAME);
} else {
element.setAttribute(SCOPE_NAME, scope);
}
} else {
if (scope) {
if (element.classList) {
if (shouldRemoveScope) {
element.classList.remove(SCOPE_NAME);
element.classList.remove(scope);
} else {
element.classList.add(SCOPE_NAME);
element.classList.add(scope);
}
} else if (element.getAttribute) {
var c = element.getAttribute(CLASS);
if (shouldRemoveScope) {
if (c) {
element.setAttribute(CLASS, c.replace(SCOPE_NAME, '').replace(scope, ''));
}
} else {
element.setAttribute(CLASS, c + (c ? ' ' : '') + SCOPE_NAME + ' ' + scope);
}
}
}
}
},
elementStyles: function (element, callback) {
var styles = element._styles;
var cssText = '';
for (var i = 0, l = styles.length, s, text; i < l && (s = styles[i]); i++) {
var rules = styleUtil.rulesForStyle(s);
cssText += nativeShadow ? styleUtil.toCssText(rules, callback) : this.css(rules, element.is, element.extends, callback, element._scopeCssViaAttr) + '\n\n';
}
return cssText.trim();
},
css: function (rules, scope, ext, callback, useAttr) {
var hostScope = this._calcHostScope(scope, ext);
scope = this._calcElementScope(scope, useAttr);
var self = this;
return styleUtil.toCssText(rules, function (rule) {
if (!rule.isScoped) {
self.rule(rule, scope, hostScope);
rule.isScoped = true;
}
if (callback) {
callback(rule, scope, hostScope);
}
});
},
_calcElementScope: function (scope, useAttr) {
if (scope) {
return useAttr ? CSS_ATTR_PREFIX + scope + CSS_ATTR_SUFFIX : CSS_CLASS_PREFIX + scope;
} else {
return '';
}
},
_calcHostScope: function (scope, ext) {
return ext ? '[is=' + scope + ']' : scope;
},
rule: function (rule, scope, hostScope) {
this._transformRule(rule, this._transformComplexSelector, scope, hostScope);
},
_transformRule: function (rule, transformer, scope, hostScope) {
var p$ = rule.selector.split(COMPLEX_SELECTOR_SEP);
for (var i = 0, l = p$.length, p; i < l && (p = p$[i]); i++) {
p$[i] = transformer.call(this, p, scope, hostScope);
}
rule.selector = p$.join(COMPLEX_SELECTOR_SEP);
},
_transformComplexSelector: function (selector, scope, hostScope) {
var stop = false;
var hostContext = false;
var self = this;
selector = selector.replace(SIMPLE_SELECTOR_SEP, function (m, c, s) {
if (!stop) {
var info = self._transformCompoundSelector(s, c, scope, hostScope);
stop = stop || info.stop;
hostContext = hostContext || info.hostContext;
c = info.combinator;
s = info.value;
} else {
s = s.replace(SCOPE_JUMP, ' ');
}
return c + s;
});
if (hostContext) {
selector = selector.replace(HOST_CONTEXT_PAREN, function (m, pre, paren, post) {
return pre + paren + ' ' + hostScope + post + COMPLEX_SELECTOR_SEP + ' ' + pre + hostScope + paren + post;
});
}
return selector;
},
_transformCompoundSelector: function (selector, combinator, scope, hostScope) {
var jumpIndex = selector.search(SCOPE_JUMP);
var hostContext = false;
if (selector.indexOf(HOST_CONTEXT) >= 0) {
hostContext = true;
} else if (selector.indexOf(HOST) >= 0) {
selector = selector.replace(HOST_PAREN, function (m, host, paren) {
return hostScope + paren;
});
selector = selector.replace(HOST, hostScope);
} else if (jumpIndex !== 0) {
selector = scope ? this._transformSimpleSelector(selector, scope) : selector;
}
if (selector.indexOf(CONTENT) >= 0) {
combinator = '';
}
var stop;
if (jumpIndex >= 0) {
selector = selector.replace(SCOPE_JUMP, ' ');
stop = true;
}
return {
value: selector,
combinator: combinator,
stop: stop,
hostContext: hostContext
};
},
_transformSimpleSelector: function (selector, scope) {
var p$ = selector.split(PSEUDO_PREFIX);
p$[0] += scope;
return p$.join(PSEUDO_PREFIX);
},
documentRule: function (rule) {
rule.selector = rule.parsedSelector;
this.normalizeRootSelector(rule);
if (!nativeShadow) {
this._transformRule(rule, this._transformDocumentSelector);
}
},
normalizeRootSelector: function (rule) {
if (rule.selector === ROOT) {
rule.selector = 'body';
}
},
_transformDocumentSelector: function (selector) {
return selector.match(SCOPE_JUMP) ? this._transformComplexSelector(selector, SCOPE_DOC_SELECTOR) : this._transformSimpleSelector(selector.trim(), SCOPE_DOC_SELECTOR);
},
SCOPE_NAME: 'style-scope'
};
var SCOPE_NAME = api.SCOPE_NAME;
var SCOPE_DOC_SELECTOR = ':not([' + SCOPE_NAME + '])' + ':not(.' + SCOPE_NAME + ')';
var COMPLEX_SELECTOR_SEP = ',';
var SIMPLE_SELECTOR_SEP = /(^|[\s>+~]+)([^\s>+~]+)/g;
var HOST = ':host';
var ROOT = ':root';
var HOST_PAREN = /(\:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/g;
var HOST_CONTEXT = ':host-context';
var HOST_CONTEXT_PAREN = /(.*)(?:\:host-context)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))(.*)/;
var CONTENT = '::content';
var SCOPE_JUMP = /\:\:content|\:\:shadow|\/deep\//;
var CSS_CLASS_PREFIX = '.';
var CSS_ATTR_PREFIX = '[' + SCOPE_NAME + '~=';
var CSS_ATTR_SUFFIX = ']';
var PSEUDO_PREFIX = ':';
var CLASS = 'class';
return api;
}();
Polymer.StyleExtends = function () {
var styleUtil = Polymer.StyleUtil;
return {
hasExtends: function (cssText) {
return Boolean(cssText.match(this.rx.EXTEND));
},
transform: function (style) {
var rules = styleUtil.rulesForStyle(style);
var self = this;
styleUtil.forEachStyleRule(rules, function (rule) {
var map = self._mapRule(rule);
if (rule.parent) {
var m;
while (m = self.rx.EXTEND.exec(rule.cssText)) {
var extend = m[1];
var extendor = self._findExtendor(extend, rule);
if (extendor) {
self._extendRule(rule, extendor);
}
}
}
rule.cssText = rule.cssText.replace(self.rx.EXTEND, '');
});
return styleUtil.toCssText(rules, function (rule) {
if (rule.selector.match(self.rx.STRIP)) {
rule.cssText = '';
}
}, true);
},
_mapRule: function (rule) {
if (rule.parent) {
var map = rule.parent.map || (rule.parent.map = {});
var parts = rule.selector.split(',');
for (var i = 0, p; i < parts.length; i++) {
p = parts[i];
map[p.trim()] = rule;
}
return map;
}
},
_findExtendor: function (extend, rule) {
return rule.parent && rule.parent.map && rule.parent.map[extend] || this._findExtendor(extend, rule.parent);
},
_extendRule: function (target, source) {
if (target.parent !== source.parent) {
this._cloneAndAddRuleToParent(source, target.parent);
}
target.extends = target.extends || (target.extends = []);
target.extends.push(source);
source.selector = source.selector.replace(this.rx.STRIP, '');
source.selector = (source.selector && source.selector + ',\n') + target.selector;
if (source.extends) {
source.extends.forEach(function (e) {
this._extendRule(target, e);
}, this);
}
},
_cloneAndAddRuleToParent: function (rule, parent) {
rule = Object.create(rule);
rule.parent = parent;
if (rule.extends) {
rule.extends = rule.extends.slice();
}
parent.rules.push(rule);
},
rx: {
EXTEND: /@extends\(([^)]*)\)\s*?;/gim,
STRIP: /%[^,]*$/
}
};
}();
(function () {
var prepElement = Polymer.Base._prepElement;
var nativeShadow = Polymer.Settings.useNativeShadow;
var styleUtil = Polymer.StyleUtil;
var styleTransformer = Polymer.StyleTransformer;
var styleExtends = Polymer.StyleExtends;
Polymer.Base._addFeature({
_prepElement: function (element) {
if (this._encapsulateStyle) {
styleTransformer.element(element, this.is, this._scopeCssViaAttr);
}
prepElement.call(this, element);
},
_prepStyles: function () {
if (this._encapsulateStyle === undefined) {
this._encapsulateStyle = !nativeShadow && Boolean(this._template);
}
this._styles = this._collectStyles();
var cssText = styleTransformer.elementStyles(this);
if (cssText && this._template) {
var style = styleUtil.applyCss(cssText, this.is, nativeShadow ? this._template.content : null);
if (!nativeShadow) {
this._scopeStyle = style;
}
}
},
_collectStyles: function () {
var styles = [];
var cssText = '', m$ = this.styleModules;
if (m$) {
for (var i = 0, l = m$.length, m; i < l && (m = m$[i]); i++) {
cssText += styleUtil.cssFromModule(m);
}
}
cssText += styleUtil.cssFromModule(this.is);
if (cssText) {
var style = document.createElement('style');
style.textContent = cssText;
if (styleExtends.hasExtends(style.textContent)) {
cssText = styleExtends.transform(style);
}
styles.push(style);
}
return styles;
},
_elementAdd: function (node) {
if (this._encapsulateStyle) {
if (node.__styleScoped) {
node.__styleScoped = false;
} else {
styleTransformer.dom(node, this.is, this._scopeCssViaAttr);
}
}
},
_elementRemove: function (node) {
if (this._encapsulateStyle) {
styleTransformer.dom(node, this.is, this._scopeCssViaAttr, true);
}
},
scopeSubtree: function (container, shouldObserve) {
if (nativeShadow) {
return;
}
var self = this;
var scopify = function (node) {
if (node.nodeType === Node.ELEMENT_NODE) {
node.className = self._scopeElementClass(node, node.className);
var n$ = node.querySelectorAll('*');
Array.prototype.forEach.call(n$, function (n) {
n.className = self._scopeElementClass(n, n.className);
});
}
};
scopify(container);
if (shouldObserve) {
var mo = new MutationObserver(function (mxns) {
mxns.forEach(function (m) {
if (m.addedNodes) {
for (var i = 0; i < m.addedNodes.length; i++) {
scopify(m.addedNodes[i]);
}
}
});
});
mo.observe(container, {
childList: true,
subtree: true
});
return mo;
}
}
});
}());
Polymer.StyleProperties = function () {
'use strict';
var nativeShadow = Polymer.Settings.useNativeShadow;
var matchesSelector = Polymer.DomApi.matchesSelector;
var styleUtil = Polymer.StyleUtil;
var styleTransformer = Polymer.StyleTransformer;
return {
decorateStyles: function (styles) {
var self = this, props = {};
styleUtil.forRulesInStyles(styles, function (rule) {
self.decorateRule(rule);
self.collectPropertiesInCssText(rule.propertyInfo.cssText, props);
});
var names = [];
for (var i in props) {
names.push(i);
}
return names;
},
decorateRule: function (rule) {
if (rule.propertyInfo) {
return rule.propertyInfo;
}
var info = {}, properties = {};
var hasProperties = this.collectProperties(rule, properties);
if (hasProperties) {
info.properties = properties;
rule.rules = null;
}
info.cssText = this.collectCssText(rule);
rule.propertyInfo = info;
return info;
},
collectProperties: function (rule, properties) {
var info = rule.propertyInfo;
if (info) {
if (info.properties) {
Polymer.Base.mixin(properties, info.properties);
return true;
}
} else {
var m, rx = this.rx.VAR_ASSIGN;
var cssText = rule.parsedCssText;
var any;
while (m = rx.exec(cssText)) {
properties[m[1]] = (m[2] || m[3]).trim();
any = true;
}
return any;
}
},
collectCssText: function (rule) {
var customCssText = '';
var cssText = rule.parsedCssText;
cssText = cssText.replace(this.rx.BRACKETED, '').replace(this.rx.VAR_ASSIGN, '');
var parts = cssText.split(';');
for (var i = 0, p; i < parts.length; i++) {
p = parts[i];
if (p.match(this.rx.MIXIN_MATCH) || p.match(this.rx.VAR_MATCH)) {
customCssText += p + ';\n';
}
}
return customCssText;
},
collectPropertiesInCssText: function (cssText, props) {
var m;
while (m = this.rx.VAR_CAPTURE.exec(cssText)) {
props[m[1]] = true;
var def = m[2];
if (def && def.match(this.rx.IS_VAR)) {
props[def] = true;
}
}
},
reify: function (props) {
var names = Object.getOwnPropertyNames(props);
for (var i = 0, n; i < names.length; i++) {
n = names[i];
props[n] = this.valueForProperty(props[n], props);
}
},
valueForProperty: function (property, props) {
if (property) {
if (property.indexOf(';') >= 0) {
property = this.valueForProperties(property, props);
} else {
var self = this;
var fn = function (all, prefix, value, fallback) {
var propertyValue = self.valueForProperty(props[value], props) || (props[fallback] ? self.valueForProperty(props[fallback], props) : fallback);
return prefix + (propertyValue || '');
};
property = property.replace(this.rx.VAR_MATCH, fn);
}
}
return property && property.trim() || '';
},
valueForProperties: function (property, props) {
var parts = property.split(';');
for (var i = 0, p, m; i < parts.length && (p = parts[i]); i++) {
m = p.match(this.rx.MIXIN_MATCH);
if (m) {
p = this.valueForProperty(props[m[1]], props);
} else {
var pp = p.split(':');
if (pp[1]) {
pp[1] = pp[1].trim();
pp[1] = this.valueForProperty(pp[1], props) || pp[1];
}
p = pp.join(':');
}
parts[i] = p && p.lastIndexOf(';') === p.length - 1 ? p.slice(0, -1) : p || '';
}
return parts.join(';');
},
applyProperties: function (rule, props) {
var output = '';
if (!rule.propertyInfo) {
this.decorateRule(rule);
}
if (rule.propertyInfo.cssText) {
output = this.valueForProperties(rule.propertyInfo.cssText, props);
}
rule.cssText = output;
},
propertyDataFromStyles: function (styles, element) {
var props = {}, self = this;
var o = [], i = 0;
styleUtil.forRulesInStyles(styles, function (rule) {
if (!rule.propertyInfo) {
self.decorateRule(rule);
}
if (element && rule.propertyInfo.properties && matchesSelector.call(element, rule.selector)) {
self.collectProperties(rule, props);
addToBitMask(i, o);
}
i++;
});
return {
properties: props,
key: o
};
},
scopePropertiesFromStyles: function (styles) {
if (!styles._scopeStyleProperties) {
styles._scopeStyleProperties = this.selectedPropertiesFromStyles(styles, this.SCOPE_SELECTORS);
}
return styles._scopeStyleProperties;
},
hostPropertiesFromStyles: function (styles) {
if (!styles._hostStyleProperties) {
styles._hostStyleProperties = this.selectedPropertiesFromStyles(styles, this.HOST_SELECTORS);
}
return styles._hostStyleProperties;
},
selectedPropertiesFromStyles: function (styles, selectors) {
var props = {}, self = this;
styleUtil.forRulesInStyles(styles, function (rule) {
if (!rule.propertyInfo) {
self.decorateRule(rule);
}
for (var i = 0; i < selectors.length; i++) {
if (rule.parsedSelector === selectors[i]) {
self.collectProperties(rule, props);
return;
}
}
});
return props;
},
transformStyles: function (element, properties, scopeSelector) {
var self = this;
var hostSelector = styleTransformer._calcHostScope(element.is, element.extends);
var rxHostSelector = element.extends ? '\\' + hostSelector.slice(0, -1) + '\\]' : hostSelector;
var hostRx = new RegExp(this.rx.HOST_PREFIX + rxHostSelector + this.rx.HOST_SUFFIX);
return styleTransformer.elementStyles(element, function (rule) {
self.applyProperties(rule, properties);
if (rule.cssText && !nativeShadow) {
self._scopeSelector(rule, hostRx, hostSelector, element._scopeCssViaAttr, scopeSelector);
}
});
},
_scopeSelector: function (rule, hostRx, hostSelector, viaAttr, scopeId) {
rule.transformedSelector = rule.transformedSelector || rule.selector;
var selector = rule.transformedSelector;
var scope = viaAttr ? '[' + styleTransformer.SCOPE_NAME + '~=' + scopeId + ']' : '.' + scopeId;
var parts = selector.split(',');
for (var i = 0, l = parts.length, p; i < l && (p = parts[i]); i++) {
parts[i] = p.match(hostRx) ? p.replace(hostSelector, hostSelector + scope) : scope + ' ' + p;
}
rule.selector = parts.join(',');
},
applyElementScopeSelector: function (element, selector, old, viaAttr) {
var c = viaAttr ? element.getAttribute(styleTransformer.SCOPE_NAME) : element.className;
var v = old ? c.replace(old, selector) : (c ? c + ' ' : '') + this.XSCOPE_NAME + ' ' + selector;
if (c !== v) {
if (viaAttr) {
element.setAttribute(styleTransformer.SCOPE_NAME, v);
} else {
element.className = v;
}
}
},
applyElementStyle: function (element, properties, selector, style) {
var cssText = style ? style.textContent || '' : this.transformStyles(element, properties, selector);
var s = element._customStyle;
if (s && !nativeShadow && s !== style) {
s._useCount--;
if (s._useCount <= 0 && s.parentNode) {
s.parentNode.removeChild(s);
}
}
if (nativeShadow || (!style || !style.parentNode)) {
if (nativeShadow && element._customStyle) {
element._customStyle.textContent = cssText;
style = element._customStyle;
} else if (cssText) {
style = styleUtil.applyCss(cssText, selector, nativeShadow ? element.root : null, element._scopeStyle);
}
}
if (style) {
style._useCount = style._useCount || 0;
if (element._customStyle != style) {
style._useCount++;
}
element._customStyle = style;
}
return style;
},
mixinCustomStyle: function (props, customStyle) {
var v;
for (var i in customStyle) {
v = customStyle[i];
if (v || v === 0) {
props[i] = v;
}
}
},
rx: {
VAR_ASSIGN: /(?:^|[;\n]\s*)(--[\w-]*?):\s*?(?:([^;{]*?)|{([^}]*)})(?:(?=[;\n])|$)/gim,
MIXIN_MATCH: /(?:^|\W+)@apply[\s]*\(([^)]*)\)/im,
VAR_MATCH: /(^|\W+)var\([\s]*([^,)]*)[\s]*,?[\s]*((?:[^,)]*)|(?:[^;]*\([^;)]*\)))[\s]*?\)/gim,
VAR_CAPTURE: /\([\s]*(--[^,\s)]*)(?:,[\s]*(--[^,\s)]*))?(?:\)|,)/gim,
IS_VAR: /^--/,
BRACKETED: /\{[^}]*\}/g,
HOST_PREFIX: '(?:^|[^.#[:])',
HOST_SUFFIX: '($|[.:[\\s>+~])'
},
HOST_SELECTORS: [':host'],
SCOPE_SELECTORS: [':root'],
XSCOPE_NAME: 'x-scope'
};
function addToBitMask(n, bits) {
var o = parseInt(n / 32);
var v = 1 << n % 32;
bits[o] = (bits[o] || 0) | v;
}
}();
(function () {
Polymer.StyleCache = function () {
this.cache = {};
};
Polymer.StyleCache.prototype = {
MAX: 100,
store: function (is, data, keyValues, keyStyles) {
data.keyValues = keyValues;
data.styles = keyStyles;
var s$ = this.cache[is] = this.cache[is] || [];
s$.push(data);
if (s$.length > this.MAX) {
s$.shift();
}
},
retrieve: function (is, keyValues, keyStyles) {
var cache = this.cache[is];
if (cache) {
for (var i = cache.length - 1, data; i >= 0; i--) {
data = cache[i];
if (keyStyles === data.styles && this._objectsEqual(keyValues, data.keyValues)) {
return data;
}
}
}
},
clear: function () {
this.cache = {};
},
_objectsEqual: function (target, source) {
var t, s;
for (var i in target) {
t = target[i], s = source[i];
if (!(typeof t === 'object' && t ? this._objectsStrictlyEqual(t, s) : t === s)) {
return false;
}
}
if (Array.isArray(target)) {
return target.length === source.length;
}
return true;
},
_objectsStrictlyEqual: function (target, source) {
return this._objectsEqual(target, source) && this._objectsEqual(source, target);
}
};
}());
Polymer.StyleDefaults = function () {
var styleProperties = Polymer.StyleProperties;
var styleUtil = Polymer.StyleUtil;
var StyleCache = Polymer.StyleCache;
var api = {
_styles: [],
_properties: null,
customStyle: {},
_styleCache: new StyleCache(),
addStyle: function (style) {
this._styles.push(style);
this._properties = null;
},
get _styleProperties() {
if (!this._properties) {
styleProperties.decorateStyles(this._styles);
this._styles._scopeStyleProperties = null;
this._properties = styleProperties.scopePropertiesFromStyles(this._styles);
styleProperties.mixinCustomStyle(this._properties, this.customStyle);
styleProperties.reify(this._properties);
}
return this._properties;
},
_needsStyleProperties: function () {
},
_computeStyleProperties: function () {
return this._styleProperties;
},
updateStyles: function (properties) {
this._properties = null;
if (properties) {
Polymer.Base.mixin(this.customStyle, properties);
}
this._styleCache.clear();
for (var i = 0, s; i < this._styles.length; i++) {
s = this._styles[i];
s = s.__importElement || s;
s._apply();
}
}
};
return api;
}();
(function () {
'use strict';
var serializeValueToAttribute = Polymer.Base.serializeValueToAttribute;
var propertyUtils = Polymer.StyleProperties;
var styleTransformer = Polymer.StyleTransformer;
var styleUtil = Polymer.StyleUtil;
var styleDefaults = Polymer.StyleDefaults;
var nativeShadow = Polymer.Settings.useNativeShadow;
Polymer.Base._addFeature({
_prepStyleProperties: function () {
this._ownStylePropertyNames = this._styles ? propertyUtils.decorateStyles(this._styles) : [];
},
_setupStyleProperties: function () {
this.customStyle = {};
},
_needsStyleProperties: function () {
return Boolean(this._ownStylePropertyNames && this._ownStylePropertyNames.length);
},
_beforeAttached: function () {
if (!this._scopeSelector && this._needsStyleProperties()) {
this._updateStyleProperties();
}
},
_updateStyleProperties: function () {
var info, scope = this.domHost || styleDefaults;
if (!scope._styleCache) {
scope._styleCache = new Polymer.StyleCache();
}
var scopeData = propertyUtils.propertyDataFromStyles(scope._styles, this);
scopeData.key.customStyle = this.customStyle;
info = scope._styleCache.retrieve(this.is, scopeData.key, this._styles);
var scopeCached = Boolean(info);
if (scopeCached) {
this._styleProperties = info._styleProperties;
} else {
this._computeStyleProperties(scopeData.properties);
}
this._computeOwnStyleProperties();
if (!scopeCached) {
info = styleCache.retrieve(this.is, this._ownStyleProperties, this._styles);
}
var globalCached = Boolean(info) && !scopeCached;
var style = this._applyStyleProperties(info);
if (!scopeCached) {
style = style && nativeShadow ? style.cloneNode(true) : style;
info = {
style: style,
_scopeSelector: this._scopeSelector,
_styleProperties: this._styleProperties
};
scopeData.key.customStyle = {};
this.mixin(scopeData.key.customStyle, this.customStyle);
scope._styleCache.store(this.is, info, scopeData.key, this._styles);
if (!globalCached) {
styleCache.store(this.is, Object.create(info), this._ownStyleProperties, this._styles);
}
}
},
_computeStyleProperties: function (scopeProps) {
var scope = this.domHost || styleDefaults;
if (!scope._styleProperties) {
scope._computeStyleProperties();
}
var props = Object.create(scope._styleProperties);
this.mixin(props, propertyUtils.hostPropertiesFromStyles(this._styles));
scopeProps = scopeProps || propertyUtils.propertyDataFromStyles(scope._styles, this).properties;
this.mixin(props, scopeProps);
this.mixin(props, propertyUtils.scopePropertiesFromStyles(this._styles));
propertyUtils.mixinCustomStyle(props, this.customStyle);
propertyUtils.reify(props);
this._styleProperties = props;
},
_computeOwnStyleProperties: function () {
var props = {};
for (var i = 0, n; i < this._ownStylePropertyNames.length; i++) {
n = this._ownStylePropertyNames[i];
props[n] = this._styleProperties[n];
}
this._ownStyleProperties = props;
},
_scopeCount: 0,
_applyStyleProperties: function (info) {
var oldScopeSelector = this._scopeSelector;
this._scopeSelector = info ? info._scopeSelector : this.is + '-' + this.__proto__._scopeCount++;
var style = propertyUtils.applyElementStyle(this, this._styleProperties, this._scopeSelector, info && info.style);
if (!nativeShadow) {
propertyUtils.applyElementScopeSelector(this, this._scopeSelector, oldScopeSelector, this._scopeCssViaAttr);
}
return style;
},
serializeValueToAttribute: function (value, attribute, node) {
node = node || this;
if (attribute === 'class') {
var host = node === this ? this.domHost || this.dataHost : this;
if (host) {
value = host._scopeElementClass(node, value);
}
}
node = Polymer.dom(node);
serializeValueToAttribute.call(this, value, attribute, node);
},
_scopeElementClass: function (element, selector) {
if (!nativeShadow && !this._scopeCssViaAttr) {
selector += (selector ? ' ' : '') + SCOPE_NAME + ' ' + this.is + (element._scopeSelector ? ' ' + XSCOPE_NAME + ' ' + element._scopeSelector : '');
}
return selector;
},
updateStyles: function (properties) {
if (this.isAttached) {
if (properties) {
this.mixin(this.customStyle, properties);
}
if (this._needsStyleProperties()) {
this._updateStyleProperties();
} else {
this._styleProperties = null;
}
if (this._styleCache) {
this._styleCache.clear();
}
this._updateRootStyles();
}
},
_updateRootStyles: function (root) {
root = root || this.root;
var c$ = Polymer.dom(root)._query(function (e) {
return e.shadyRoot || e.shadowRoot;
});
for (var i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
if (c.updateStyles) {
c.updateStyles();
}
}
}
});
Polymer.updateStyles = function (properties) {
styleDefaults.updateStyles(properties);
Polymer.Base._updateRootStyles(document);
};
var styleCache = new Polymer.StyleCache();
Polymer.customStyleCache = styleCache;
var SCOPE_NAME = styleTransformer.SCOPE_NAME;
var XSCOPE_NAME = propertyUtils.XSCOPE_NAME;
}());
Polymer.Base._addFeature({
_registerFeatures: function () {
this._prepIs();
this._prepAttributes();
this._prepExtends();
this._prepConstructor();
this._prepTemplate();
this._prepStyles();
this._prepStyleProperties();
this._prepAnnotations();
this._prepEffects();
this._prepBehaviors();
this._prepBindings();
this._prepShady();
},
_prepBehavior: function (b) {
this._addPropertyEffects(b.properties);
this._addComplexObserverEffects(b.observers);
this._addHostAttributes(b.hostAttributes);
},
_initFeatures: function () {
this._poolContent();
this._setupConfigure();
this._setupStyleProperties();
this._pushHost();
this._stampTemplate();
this._popHost();
this._marshalAnnotationReferences();
this._marshalHostAttributes();
this._setupDebouncers();
this._marshalInstanceEffects();
this._marshalBehaviors();
this._marshalAttributes();
this._tryReady();
},
_marshalBehavior: function (b) {
this._listenListeners(b.listeners);
}
});
(function () {
var nativeShadow = Polymer.Settings.useNativeShadow;
var propertyUtils = Polymer.StyleProperties;
var styleUtil = Polymer.StyleUtil;
var styleDefaults = Polymer.StyleDefaults;
var styleTransformer = Polymer.StyleTransformer;
Polymer({
is: 'custom-style',
extends: 'style',
created: function () {
this._tryApply();
},
attached: function () {
this._tryApply();
},
_tryApply: function () {
if (!this._appliesToDocument) {
if (this.parentNode && this.parentNode.localName !== 'dom-module') {
this._appliesToDocument = true;
var e = this.__appliedElement || this;
styleDefaults.addStyle(e);
if (e.textContent) {
this._apply();
} else {
var observer = new MutationObserver(function () {
observer.disconnect();
this._apply();
}.bind(this));
observer.observe(e, { childList: true });
}
}
}
},
_apply: function () {
var e = this.__appliedElement || this;
this._computeStyleProperties();
var props = this._styleProperties;
var self = this;
e.textContent = styleUtil.toCssText(styleUtil.rulesForStyle(e), function (rule) {
var css = rule.cssText = rule.parsedCssText;
if (rule.propertyInfo && rule.propertyInfo.cssText) {
css = css.replace(propertyUtils.rx.VAR_ASSIGN, '');
rule.cssText = propertyUtils.valueForProperties(css, props);
}
styleTransformer.documentRule(rule);
});
}
});
}());
Polymer.Templatizer = {
properties: { _hideTemplateChildren: { observer: '_showHideChildren' } },
_templatizerStatic: {
count: 0,
callbacks: {},
debouncer: null
},
_instanceProps: Polymer.nob,
created: function () {
this._templatizerId = this._templatizerStatic.count++;
},
templatize: function (template) {
if (!template._content) {
template._content = template.content;
}
if (template._content._ctor) {
this.ctor = template._content._ctor;
this._prepParentProperties(this.ctor.prototype, template);
return;
}
var archetype = Object.create(Polymer.Base);
this._customPrepAnnotations(archetype, template);
archetype._prepEffects();
this._customPrepEffects(archetype);
archetype._prepBehaviors();
archetype._prepBindings();
this._prepParentProperties(archetype, template);
archetype._notifyPath = this._notifyPathImpl;
archetype._scopeElementClass = this._scopeElementClassImpl;
archetype.listen = this._listenImpl;
var _constructor = this._constructorImpl;
var ctor = function TemplateInstance(model, host) {
_constructor.call(this, model, host);
};
ctor.prototype = archetype;
archetype.constructor = ctor;
template._content._ctor = ctor;
this.ctor = ctor;
},
_getRootDataHost: function () {
return this.dataHost && this.dataHost._rootDataHost || this.dataHost;
},
_showHideChildren: function (hidden) {
},
_debounceTemplate: function (fn) {
this._templatizerStatic.callbacks[this._templatizerId] = fn.bind(this);
this._templatizerStatic.debouncer = Polymer.Debounce(this._templatizerStatic.debouncer, this._flushTemplates.bind(this, true));
},
_flushTemplates: function (debouncerExpired) {
var db = this._templatizerStatic.debouncer;
while (debouncerExpired || db && db.finish) {
db.stop();
var cbs = this._templatizerStatic.callbacks;
this._templatizerStatic.callbacks = {};
for (var id in cbs) {
cbs[id]();
}
debouncerExpired = false;
}
},
_customPrepEffects: function (archetype) {
var parentProps = archetype._parentProps;
for (var prop in parentProps) {
archetype._addPropertyEffect(prop, 'function', this._createHostPropEffector(prop));
}
for (var prop in this._instanceProps) {
archetype._addPropertyEffect(prop, 'function', this._createInstancePropEffector(prop));
}
},
_customPrepAnnotations: function (archetype, template) {
archetype._template = template;
var c = template._content;
if (!c._notes) {
var rootDataHost = archetype._rootDataHost;
if (rootDataHost) {
Polymer.Annotations.prepElement = rootDataHost._prepElement.bind(rootDataHost);
}
c._notes = Polymer.Annotations.parseAnnotations(template);
Polymer.Annotations.prepElement = null;
this._processAnnotations(c._notes);
}
archetype._notes = c._notes;
archetype._parentProps = c._parentProps;
},
_prepParentProperties: function (archetype, template) {
var parentProps = this._parentProps = archetype._parentProps;
if (this._forwardParentProp && parentProps) {
var proto = archetype._parentPropProto;
var prop;
if (!proto) {
for (prop in this._instanceProps) {
delete parentProps[prop];
}
proto = archetype._parentPropProto = Object.create(null);
if (template != this) {
Polymer.Bind.prepareModel(proto);
}
for (prop in parentProps) {
var parentProp = '_parent_' + prop;
var effects = [
{
kind: 'function',
effect: this._createForwardPropEffector(prop)
},
{ kind: 'notify' }
];
Polymer.Bind._createAccessors(proto, parentProp, effects);
}
}
if (template != this) {
Polymer.Bind.prepareInstance(template);
template._forwardParentProp = this._forwardParentProp.bind(this);
}
this._extendTemplate(template, proto);
}
},
_createForwardPropEffector: function (prop) {
return function (source, value) {
this._forwardParentProp(prop, value);
};
},
_createHostPropEffector: function (prop) {
return function (source, value) {
this.dataHost['_parent_' + prop] = value;
};
},
_createInstancePropEffector: function (prop) {
return function (source, value, old, fromAbove) {
if (!fromAbove) {
this.dataHost._forwardInstanceProp(this, prop, value);
}
};
},
_extendTemplate: function (template, proto) {
Object.getOwnPropertyNames(proto).forEach(function (n) {
var val = template[n];
var pd = Object.getOwnPropertyDescriptor(proto, n);
Object.defineProperty(template, n, pd);
if (val !== undefined) {
template._propertySetter(n, val);
}
});
},
_forwardInstancePath: function (inst, path, value) {
},
_forwardInstanceProp: function (inst, prop, value) {
},
_notifyPathImpl: function (path, value) {
var dataHost = this.dataHost;
var dot = path.indexOf('.');
var root = dot < 0 ? path : path.slice(0, dot);
dataHost._forwardInstancePath.call(dataHost, this, path, value);
if (root in dataHost._parentProps) {
dataHost.notifyPath('_parent_' + path, value);
}
},
_pathEffector: function (path, value, fromAbove) {
if (this._forwardParentPath) {
if (path.indexOf('_parent_') === 0) {
this._forwardParentPath(path.substring(8), value);
}
}
Polymer.Base._pathEffector.apply(this, arguments);
},
_constructorImpl: function (model, host) {
this._rootDataHost = host._getRootDataHost();
this._setupConfigure(model);
this._pushHost(host);
this.root = this.instanceTemplate(this._template);
this.root.__noContent = !this._notes._hasContent;
this.root.__styleScoped = true;
this._popHost();
this._marshalAnnotatedNodes();
this._marshalInstanceEffects();
this._marshalAnnotatedListeners();
var children = [];
for (var n = this.root.firstChild; n; n = n.nextSibling) {
children.push(n);
n._templateInstance = this;
}
this._children = children;
this._tryReady();
},
_listenImpl: function (node, eventName, methodName) {
var model = this;
var host = this._rootDataHost;
var handler = host._createEventHandler(node, eventName, methodName);
var decorated = function (e) {
e.model = model;
handler(e);
};
host._listen(node, eventName, decorated);
},
_scopeElementClassImpl: function (node, value) {
var host = this._rootDataHost;
if (host) {
return host._scopeElementClass(node, value);
}
},
stamp: function (model) {
model = model || {};
if (this._parentProps) {
for (var prop in this._parentProps) {
model[prop] = this['_parent_' + prop];
}
}
return new this.ctor(model, this);
}
};
Polymer({
is: 'dom-template',
extends: 'template',
behaviors: [Polymer.Templatizer],
ready: function () {
this.templatize(this);
}
});
Polymer._collections = new WeakMap();
Polymer.Collection = function (userArray) {
Polymer._collections.set(userArray, this);
this.userArray = userArray;
this.store = userArray.slice();
this.initMap();
};
Polymer.Collection.prototype = {
constructor: Polymer.Collection,
initMap: function () {
var omap = this.omap = new WeakMap();
var pmap = this.pmap = {};
var s = this.store;
for (var i = 0; i < s.length; i++) {
var item = s[i];
if (item && typeof item == 'object') {
omap.set(item, i);
} else {
pmap[item] = i;
}
}
},
add: function (item) {
var key = this.store.push(item) - 1;
if (item && typeof item == 'object') {
this.omap.set(item, key);
} else {
this.pmap[item] = key;
}
return key;
},
removeKey: function (key) {
this._removeFromMap(this.store[key]);
delete this.store[key];
},
_removeFromMap: function (item) {
if (typeof item == 'object') {
this.omap.delete(item);
} else {
delete this.pmap[item];
}
},
remove: function (item) {
var key = this.getKey(item);
this.removeKey(key);
return key;
},
getKey: function (item) {
if (typeof item == 'object') {
return this.omap.get(item);
} else {
return this.pmap[item];
}
},
getKeys: function () {
return Object.keys(this.store);
},
setItem: function (key, item) {
var old = this.store[key];
if (old) {
this._removeFromMap(old);
}
if (item && typeof item == 'object') {
this.omap.set(item, key);
} else {
this.pmap[item] = key;
}
this.store[key] = item;
},
getItem: function (key) {
return this.store[key];
},
getItems: function () {
var items = [], store = this.store;
for (var key in store) {
items.push(store[key]);
}
return items;
},
_applySplices: function (splices) {
var keySplices = [];
for (var i = 0; i < splices.length; i++) {
var j, o, key, s = splices[i];
var removed = [];
for (j = 0; j < s.removed.length; j++) {
o = s.removed[j];
key = this.remove(o);
removed.push(key);
}
var added = [];
for (j = 0; j < s.addedCount; j++) {
o = this.userArray[s.index + j];
key = this.add(o);
added.push(key);
}
keySplices.push({
index: s.index,
removed: removed,
removedItems: s.removed,
added: added
});
}
return keySplices;
}
};
Polymer.Collection.get = function (userArray) {
return Polymer._collections.get(userArray) || new Polymer.Collection(userArray);
};
Polymer.Collection.applySplices = function (userArray, splices) {
var coll = Polymer._collections.get(userArray);
return coll ? coll._applySplices(splices) : null;
};
Polymer({
is: 'dom-repeat',
extends: 'template',
properties: {
items: { type: Array },
as: {
type: String,
value: 'item'
},
indexAs: {
type: String,
value: 'index'
},
sort: {
type: Function,
observer: '_sortChanged'
},
filter: {
type: Function,
observer: '_filterChanged'
},
observe: {
type: String,
observer: '_observeChanged'
},
delay: Number
},
behaviors: [Polymer.Templatizer],
observers: ['_itemsChanged(items.*)'],
detached: function () {
if (this.rows) {
for (var i = 0; i < this.rows.length; i++) {
this._detachRow(i);
}
}
},
attached: function () {
if (this.rows) {
var parentNode = Polymer.dom(this).parentNode;
for (var i = 0; i < this.rows.length; i++) {
Polymer.dom(parentNode).insertBefore(this.rows[i].root, this);
}
}
},
ready: function () {
this._instanceProps = { __key__: true };
this._instanceProps[this.as] = true;
this._instanceProps[this.indexAs] = true;
if (!this.ctor) {
this.templatize(this);
}
},
_sortChanged: function () {
var dataHost = this._getRootDataHost();
var sort = this.sort;
this._sortFn = sort && (typeof sort == 'function' ? sort : function () {
return dataHost[sort].apply(dataHost, arguments);
});
this._fullRefresh = true;
if (this.items) {
this._debounceTemplate(this._render);
}
},
_filterChanged: function () {
var dataHost = this._getRootDataHost();
var filter = this.filter;
this._filterFn = filter && (typeof filter == 'function' ? filter : function () {
return dataHost[filter].apply(dataHost, arguments);
});
this._fullRefresh = true;
if (this.items) {
this._debounceTemplate(this._render);
}
},
_observeChanged: function () {
this._observePaths = this.observe && this.observe.replace('.*', '.').split(' ');
},
_itemsChanged: function (change) {
if (change.path == 'items') {
if (Array.isArray(this.items)) {
this.collection = Polymer.Collection.get(this.items);
} else if (!this.items) {
this.collection = null;
} else {
this._error(this._logf('dom-repeat', 'expected array for `items`,' + ' found', this.items));
}
this._splices = [];
this._fullRefresh = true;
this._debounceTemplate(this._render);
} else if (change.path == 'items.splices') {
this._splices = this._splices.concat(change.value.keySplices);
this._debounceTemplate(this._render);
} else {
var subpath = change.path.slice(6);
this._forwardItemPath(subpath, change.value);
this._checkObservedPaths(subpath);
}
},
_checkObservedPaths: function (path) {
if (this._observePaths) {
path = path.substring(path.indexOf('.') + 1);
var paths = this._observePaths;
for (var i = 0; i < paths.length; i++) {
if (path.indexOf(paths[i]) === 0) {
this._fullRefresh = true;
if (this.delay) {
this.debounce('render', this._render, this.delay);
} else {
this._debounceTemplate(this._render);
}
return;
}
}
}
},
render: function () {
this._fullRefresh = true;
this._debounceTemplate(this._render);
this._flushTemplates();
},
_render: function () {
var c = this.collection;
if (!this._fullRefresh) {
if (this._sortFn) {
this._applySplicesViewSort(this._splices);
} else {
if (this._filterFn) {
this._fullRefresh = true;
} else {
this._applySplicesArraySort(this._splices);
}
}
}
if (this._fullRefresh) {
this._sortAndFilter();
this._fullRefresh = false;
}
this._splices = [];
var rowForKey = this._rowForKey = {};
var keys = this._orderedKeys;
this.rows = this.rows || [];
for (var i = 0; i < keys.length; i++) {
var key = keys[i];
var item = c.getItem(key);
var row = this.rows[i];
rowForKey[key] = i;
if (!row) {
this.rows.push(row = this._insertRow(i, null, item));
}
row.__setProperty(this.as, item, true);
row.__setProperty('__key__', key, true);
row.__setProperty(this.indexAs, i, true);
}
for (; i < this.rows.length; i++) {
this._detachRow(i);
}
this.rows.splice(keys.length, this.rows.length - keys.length);
this.fire('dom-change');
},
_sortAndFilter: function () {
var c = this.collection;
if (!this._sortFn) {
this._orderedKeys = [];
var items = this.items;
if (items) {
for (var i = 0; i < items.length; i++) {
this._orderedKeys.push(c.getKey(items[i]));
}
}
} else {
this._orderedKeys = c ? c.getKeys() : [];
}
if (this._filterFn) {
this._orderedKeys = this._orderedKeys.filter(function (a) {
return this._filterFn(c.getItem(a));
}, this);
}
if (this._sortFn) {
this._orderedKeys.sort(function (a, b) {
return this._sortFn(c.getItem(a), c.getItem(b));
}.bind(this));
}
},
_keySort: function (a, b) {
return this.collection.getKey(a) - this.collection.getKey(b);
},
_applySplicesViewSort: function (splices) {
var c = this.collection;
var keys = this._orderedKeys;
var rows = this.rows;
var removedRows = [];
var addedKeys = [];
var pool = [];
var sortFn = this._sortFn || this._keySort.bind(this);
splices.forEach(function (s) {
for (var i = 0; i < s.removed.length; i++) {
var idx = this._rowForKey[s.removed[i]];
if (idx != null) {
removedRows.push(idx);
}
}
for (var i = 0; i < s.added.length; i++) {
addedKeys.push(s.added[i]);
}
}, this);
if (removedRows.length) {
removedRows.sort();
for (var i = removedRows.length - 1; i >= 0; i--) {
var idx = removedRows[i];
pool.push(this._detachRow(idx));
rows.splice(idx, 1);
keys.splice(idx, 1);
}
}
if (addedKeys.length) {
if (this._filterFn) {
addedKeys = addedKeys.filter(function (a) {
return this._filterFn(c.getItem(a));
}, this);
}
addedKeys.sort(function (a, b) {
return this._sortFn(c.getItem(a), c.getItem(b));
}.bind(this));
var start = 0;
for (var i = 0; i < addedKeys.length; i++) {
start = this._insertRowIntoViewSort(start, addedKeys[i], pool);
}
}
},
_insertRowIntoViewSort: function (start, key, pool) {
var c = this.collection;
var item = c.getItem(key);
var end = this.rows.length - 1;
var idx = -1;
var sortFn = this._sortFn || this._keySort.bind(this);
while (start <= end) {
var mid = start + end >> 1;
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
this._orderedKeys.splice(idx, 0, key);
this.rows.splice(idx, 0, this._insertRow(idx, pool, c.getItem(key)));
return idx;
},
_applySplicesArraySort: function (splices) {
var keys = this._orderedKeys;
var pool = [];
splices.forEach(function (s) {
for (var i = 0; i < s.removed.length; i++) {
pool.push(this._detachRow(s.index + i));
}
this.rows.splice(s.index, s.removed.length);
}, this);
var c = this.collection;
splices.forEach(function (s) {
var args = [
s.index,
s.removed.length
].concat(s.added);
keys.splice.apply(keys, args);
for (var i = 0; i < s.added.length; i++) {
var item = c.getItem(s.added[i]);
var row = this._insertRow(s.index + i, pool, item);
this.rows.splice(s.index + i, 0, row);
}
}, this);
},
_detachRow: function (idx) {
var row = this.rows[idx];
var parentNode = Polymer.dom(this).parentNode;
for (var i = 0; i < row._children.length; i++) {
var el = row._children[i];
Polymer.dom(row.root).appendChild(el);
}
return row;
},
_insertRow: function (idx, pool, item) {
var row = pool && pool.pop() || this._generateRow(idx, item);
var beforeRow = this.rows[idx];
var beforeNode = beforeRow ? beforeRow._children[0] : this;
var parentNode = Polymer.dom(this).parentNode;
Polymer.dom(parentNode).insertBefore(row.root, beforeNode);
return row;
},
_generateRow: function (idx, item) {
var model = { __key__: this.collection.getKey(item) };
model[this.as] = item;
model[this.indexAs] = idx;
var row = this.stamp(model);
return row;
},
_showHideChildren: function (hidden) {
if (this.rows) {
for (var i = 0; i < this.rows.length; i++) {
var c$ = this.rows[i]._children;
for (var j = 0; j < c$.length; j++) {
var c = c$[j];
if (c.style) {
c.style.display = hidden ? 'none' : '';
}
c._hideTemplateChildren = hidden;
}
}
}
},
_forwardInstanceProp: function (row, prop, value) {
if (prop == this.as) {
var idx;
if (this._sortFn || this._filterFn) {
idx = this.items.indexOf(this.collection.getItem(row.__key__));
} else {
idx = row[this.indexAs];
}
this.set('items.' + idx, value);
}
},
_forwardInstancePath: function (row, path, value) {
if (path.indexOf(this.as + '.') === 0) {
this.notifyPath('items.' + row.__key__ + '.' + path.slice(this.as.length + 1), value);
}
},
_forwardParentProp: function (prop, value) {
if (this.rows) {
this.rows.forEach(function (row) {
row.__setProperty(prop, value, true);
}, this);
}
},
_forwardParentPath: function (path, value) {
if (this.rows) {
this.rows.forEach(function (row) {
row.notifyPath(path, value, true);
}, this);
}
},
_forwardItemPath: function (path, value) {
if (this._rowForKey) {
var dot = path.indexOf('.');
var key = path.substring(0, dot < 0 ? path.length : dot);
var idx = this._rowForKey[key];
var row = this.rows[idx];
if (row) {
if (dot >= 0) {
path = this.as + '.' + path.substring(dot + 1);
row.notifyPath(path, value, true);
} else {
row.__setProperty(this.as, value, true);
}
}
}
},
modelForElement: function (el) {
var model;
while (el) {
if (model = el._templateInstance) {
if (model.dataHost != this) {
el = model.dataHost;
} else {
return model;
}
} else {
el = el.parentNode;
}
}
},
itemForElement: function (el) {
var instance = this.modelForElement(el);
return instance && instance[this.as];
},
keyForElement: function (el) {
var instance = this.modelForElement(el);
return instance && instance.__key__;
},
indexForElement: function (el) {
var instance = this.modelForElement(el);
return instance && instance[this.indexAs];
}
});
Polymer({
is: 'array-selector',
properties: {
items: {
type: Array,
observer: '_itemsChanged'
},
selected: {
type: Object,
notify: true
},
toggle: Boolean,
multi: Boolean
},
_itemsChanged: function () {
if (Array.isArray(this.selected)) {
for (var i = 0; i < this.selected.length; i++) {
this.unlinkPaths('selected.' + i);
}
} else {
this.unlinkPaths('selected');
}
if (this.multi) {
this.selected = [];
} else {
this.selected = null;
}
},
deselect: function (item) {
if (this.multi) {
var scol = Polymer.Collection.get(this.selected);
var sidx = this.selected.indexOf(item);
if (sidx >= 0) {
var skey = scol.getKey(item);
this.splice('selected', sidx, 1);
this.unlinkPaths('selected.' + skey);
return true;
}
} else {
this.selected = null;
this.unlinkPaths('selected');
}
},
select: function (item) {
var icol = Polymer.Collection.get(this.items);
var key = icol.getKey(item);
if (this.multi) {
var scol = Polymer.Collection.get(this.selected);
var skey = scol.getKey(item);
if (skey >= 0) {
if (this.toggle) {
this.deselect(item);
}
} else {
this.push('selected', item);
this.async(function () {
skey = scol.getKey(item);
this.linkPaths('selected.' + skey, 'items.' + key);
});
}
} else {
if (this.toggle && item == this.selected) {
this.deselect();
} else {
this.linkPaths('selected', 'items.' + key);
this.selected = item;
}
}
}
});
Polymer({
is: 'dom-if',
extends: 'template',
properties: {
'if': {
type: Boolean,
value: false,
observer: '_queueRender'
},
restamp: {
type: Boolean,
value: false,
observer: '_queueRender'
}
},
behaviors: [Polymer.Templatizer],
_queueRender: function () {
this._debounceTemplate(this._render);
},
detached: function () {
this._teardownInstance();
},
attached: function () {
if (this.if && this.ctor) {
this.async(this._ensureInstance);
}
},
render: function () {
this._flushTemplates();
},
_render: function () {
if (this.if) {
if (!this.ctor) {
this._wrapTextNodes(this._content || this.content);
this.templatize(this);
}
this._ensureInstance();
this._showHideChildren();
} else if (this.restamp) {
this._teardownInstance();
}
if (!this.restamp && this._instance) {
this._showHideChildren();
}
if (this.if != this._lastIf) {
this.fire('dom-change');
this._lastIf = this.if;
}
},
_ensureInstance: function () {
if (!this._instance) {
this._instance = this.stamp();
var root = this._instance.root;
var parent = Polymer.dom(Polymer.dom(this).parentNode);
parent.insertBefore(root, this);
}
},
_teardownInstance: function () {
if (this._instance) {
var c = this._instance._children;
if (c) {
var parent = Polymer.dom(Polymer.dom(c[0]).parentNode);
c.forEach(function (n) {
parent.removeChild(n);
});
}
this._instance = null;
}
},
_wrapTextNodes: function (root) {
for (var n = root.firstChild; n; n = n.nextSibling) {
if (n.nodeType === Node.TEXT_NODE) {
var s = document.createElement('span');
root.insertBefore(s, n);
s.appendChild(n);
n = s;
}
}
},
_showHideChildren: function () {
var hidden = this._hideTemplateChildren || !this.if;
if (this._instance) {
var c$ = this._instance._children;
for (var i = 0; i < c$.length; i++) {
var c = c$[i];
c.style.display = hidden ? 'none' : '';
c._hideTemplateChildren = hidden;
}
}
},
_forwardParentProp: function (prop, value) {
if (this._instance) {
this._instance[prop] = value;
}
},
_forwardParentPath: function (path, value) {
if (this._instance) {
this._instance.notifyPath(path, value, true);
}
}
});
Polymer.ImportStatus = {
_ready: false,
_callbacks: [],
whenLoaded: function (cb) {
if (this._ready) {
cb();
} else {
this._callbacks.push(cb);
}
},
_importsLoaded: function () {
this._ready = true;
this._callbacks.forEach(function (cb) {
cb();
});
this._callbacks = [];
}
};
window.addEventListener('load', function () {
Polymer.ImportStatus._importsLoaded();
});
if (window.HTMLImports) {
HTMLImports.whenReady(function () {
Polymer.ImportStatus._importsLoaded();
});
}
Polymer({
is: 'dom-bind',
extends: 'template',
created: function () {
Polymer.ImportStatus.whenLoaded(this._readySelf.bind(this));
},
_registerFeatures: function () {
this._prepExtends();
this._prepConstructor();
},
_insertChildren: function () {
var parentDom = Polymer.dom(Polymer.dom(this).parentNode);
parentDom.insertBefore(this.root, this);
},
_removeChildren: function () {
if (this._children) {
for (var i = 0; i < this._children.length; i++) {
this.root.appendChild(this._children[i]);
}
}
},
_initFeatures: function () {
},
_scopeElementClass: function (element, selector) {
if (this.dataHost) {
return this.dataHost._scopeElementClass(element, selector);
} else {
return selector;
}
},
_prepConfigure: function () {
var config = {};
for (var prop in this._propertyEffects) {
config[prop] = this[prop];
}
this._setupConfigure = this._setupConfigure.bind(this, config);
},
attached: function () {
if (!this._children) {
this._template = this;
this._prepAnnotations();
this._prepEffects();
this._prepBehaviors();
this._prepConfigure();
this._prepBindings();
Polymer.Base._initFeatures.call(this);
this._children = Array.prototype.slice.call(this.root.childNodes);
}
this._insertChildren();
this.fire('dom-change');
},
detached: function () {
this._removeChildren();
}
});;

    Polymer({
        is : 'cwn-info-link',

        properties : {
            prmname : {
              notify : true,
              type : String,
              observer : 'update'
            }
        },

        ready : function() {
          this.prmname = '';
          this.link = '';
          this.type = '';
          this.valid = false;
        },

        attached : function() {
          CWN.ds.on('load', this.update.bind(this));
        },

        update : function() {
          if( CWN.ds.loading ) return;

          if( !CWN.ds.lookupMap[this.prmname] ) {
              this.valid = false;
              return;
          }

          this.valid = true;

          this.type = CWN.ds.lookupMap[this.prmname].properties.type;
          this.link = '#info/'+ this.prmname;
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


        ready : function() {
          this.numDays = 0;

          this.startDate = new Date();
          this.endDate = new Date();

          this.current = {
              start : new Date(),
              end : new Date()
          };

          this.dragging = null;
          this.dragStartX = 0;
          this.dragStartLeft = 0;
          this.otherStartLeft = 0;

          this.cWidth = 0;
          this.cBarWidth = 0;

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
                reflect : true,
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

        ready : function() {
          this.fillStyle = '#fffff';
          this.fillFromType = false;
          this.fontSize = 14;

          this.styles = {
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
          };
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
                $(this.$.canvas).show();
                this.redraw();
            }

        },

        redraw : function() {
            if( !this.$.canvas ) return;
            if( this.height === undefined || this.width == undefined ) return;

            this.fontSize = this.width-15;
            if( this.fontSize < 14 ) this.fontSize = 14;

            if( !CWN.render[this.type] ) return;

            this.$.canvas.setAttribute('height', this.height);
            this.$.canvas.setAttribute('width', this.width);

            var ctx = this.$.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.width, this.height);

            CWN.render[this.type](ctx, {
                x: 2,
                y: 2,
                width: this.width-4,
                height: this.height-4
            });
        }
    });
;

    Polymer({
        is : 'cwn-date-linechart',

        properties : {
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
            animate : {
              type: Boolean,
              notify : true
            }
        },

        ready : function() {

            this.options = null;
            this.type = '';
            this.cols = null;
            this.dt = null;
            this.chart = null;
            this.height = 400;
            this.data = [];
            this.startDate = null;
            this.stopDate = null;
            this.animate = false;

            this.updateTimer = -1;

            this.onLoadHandlerSet = false;
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
            CWN.chartLoadHandlers.push(function(){
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
                else if( this.data.length == 0 ) this.data = ['date', 'value'];

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
          try {
            if( this.cols ) {
                this.dt = new google.visualization.DataTable();
                for( var i = 0; i < this.cols.length; i++ ) {
                    this.dt.addColumn(this.cols[i]);
                }
                this.dt.addRows(data);
            } else {
                this.dt = google.visualization.arrayToDataTable(data);
            }
          } catch(e) {
            return false;
          }
          return true;
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

            var success = this._setDataTable(filteredData);
            if( success ) this.redraw();
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

        properties : {
            label : String,
            xlabel : String,
            ylabel : String,
            height : Number,
            animate : {
              notify: true,
              type: Boolean
            },
            options : Object,
            cols : Object,
            type : String
        },

        ready : function() {
          this.onLoadHandlerSet = false;
          this.dt = null;
          this.chart = null;
          this.height = 400;
          this.updateTimer = -1;
          this.options = null;
          this.cols = null;
          this.data = null;

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

      published : {
        header : String,
        noFooter : Boolean
      },

      configure : function() {
        return {
          //header : '',
          showHeader : false,
          noFooter : true,
          showing : false,
        }
      },

      bind : {
        header : 'onHeaderUpdate'
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
    is : 'cwn-region-selector',

    ready : function() {
      this.$.popup.header = 'Select';
    },

    init : function(map, markerLayer) {
      this.map = map;
      this.markerLayer = markerLayer;
    },

    onClick : function(features) {
      this.features = features;
      this.renderFeatures();
      this.$.popup.show();
    },

    renderFeatures : function() {
      var table = '<table class="table">';

      for (var i = 0; i < this.features.length; i++) {
        var f = this.features[i];

        var type = '';
        if( f.geometry.type == 'Point' ) type = 'Node';
        else if( f.geometry.type == 'LineString' ) type = 'Link';
        else if( f.geometry.type == 'Polygon' ) type = 'Region';


        table +=
          '<tr>' +
            '<td>'+type+'</td>' +
            '<td style="text-align:center">'+
              (f.properties.prmname || f.properties.name || 'Region to Region') +
            '</td>' +
            '<td>'+
              (type == 'Region' ?
                '<a class="btn btn-link region" index="'+i+'">Expand</a>' :
                '<a class="btn btn-link" index="'+i+'" href="#info/'+f.properties.prmname+'">Info</a>') +
            '</td>'
          '</tr>';
      }

      this.$.body.innerHTML = table+'</table>';

      $(this.$.body)
        .find('a')
        .on('click', function(e){
          if( !$(e.currentTarget).hasClass('region') ) {
            this.$.popup.hide();
            return;
          }

          var index = parseInt(e.currentTarget.getAttribute('index'));
          var feature = this.features[index];

          if( feature.geometry.type == 'Polygon') {
            this.map.onRegionClick(feature.properties.id);
            this.$.popup.hide();
          } else {
            alert("Not implemented yet :(");
          }

        }.bind(this));
    }
  })
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

        ready : function() {
          this.hasOriginDescription = false;
          this.originDescription = '';
          this.editUrl = '';
          this.originUrl = '';
          this.terminalUrl = '';
          this.showNavLinks = false;
          this.hasTerminalDescription = false;
          this.terminalDescription = '';
          this.type = '';
          this.origins = [];
          this.terminals = [];

          $(window).on('resize', this.updateSize.bind(this));
        },

        update : function() {
            if( !CWN.ds || !this.feature ) return;

            this.type = this.feature.properties.type;
            this.editUrl = '#edit/'+this.feature.properties.prmname;

            this.origins = [];
            this.terminals = [];

            var link, node, types = ['origins', 'terminals'];
            types.forEach(function(type){
              if( this.feature && this.feature.properties[type] ) {
                for( var i = 0; i < this.feature.properties[type].length; i++ ) {
                  link = CWN.ds.lookupMap[this.feature.properties[type][i].link_prmname];
                  node = CWN.ds.lookupMap[this.feature.properties[type][i].prmname];

                  if( link ) {
                    this[type].push({
                      name: node.properties.prmname,
                      link: '#info/'+link.properties.prmname,
                      hasLink : true,
                      description: node ? node.properties.description : ''
                    });
                  } else {
                    this.origins.push({
                        name: this.feature.properties.origins[i].prmname,
                        hasLink : false,
                        link: '',
                        description: ''
                    });
                  }
                }
              }
            }.bind(this));

            if( this.feature.properties.repo ) {
              this.$.githubLink.innerHTML = '<a class="btn btn-link" href="https://github.com/ucd-cws/calvin-network-data/tree/'+
                this.feature.properties.repo.branch+this.feature.properties.repo.dir+'" target="_blank">'+
                '<i class="fa fa-github"></i> Show on GitHub</a>';
            }

            // stupid polymer hack! when will this stop!!!!!!!!!!
            this.origins = $.extend(true, [], this.origins);
            this.terminals = $.extend(true, [], this.terminals);

            $(window).on('resize', this.updateSize.bind(this));

            this.onTypeUpdate();
            this.onOriginUpdate();
            this.onTerminalUpdate();
        },

        createRenderLinks : function(name) {
          var link, i, tmp = [];
          var links = this[name];
          if(!links) return;

          for( i = 0; i < links.length; i++ ) {
            link = links[i];

            tmp.push({
              name: link.properties.prmname,
              link: '#info/'+link.properties.prmname,
              hasLink : true,
              description: link.properties.description ? link.properties.description : ''
            });
          }

          // stupid polymer... when will this crap work right!?
          this[name] = tmp;
        },

        onOriginUpdate : function() {
            if( !CWN.ds ) return;

            if( !this.feature.properties.origin ) return this.$.origin.style.display = 'none';
            else this.$.origin.style.display = 'block';

            this.hasOriginDescription = false;
            this.originDescription = '';

            if( CWN.ds.lookupMap[this.feature.properties.origin] ) {
                this.hasOriginDescription = true;
                this.originDescription = CWN.ds.lookupMap[this.feature.properties.origin].properties.description
            }
        },

        onTerminalUpdate : function() {
            if( !CWN.ds ) return;

            if( !this.feature.properties.terminus ) return this.$.terminal.style.display = 'none';
            else this.$.terminal.style.display = 'block';

            this.hasTerminalDescription = false;
            this.terminalDescription = '';

            if( CWN.ds.lookupMap[this.feature.properties.terminus] ) {
                this.hasTerminalDescription = true;
                this.terminalDescription = CWN.ds.lookupMap[this.feature.properties.terminus].properties.description
            }
        },

        onTypeUpdate : function() {
            if( !CWN.ds ) return;

            this.showNavLinks = true;

            if( this.feature.properties.type == 'Diversion' || this.feature.properties.type == 'Return Flow' ) {
                this.showNavLinks = false;
            }
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

        ready : function() {
          this.noCostData = true;
          this.costsMonths = [];
          this.costs = {
            label : '',
            data : {},
            cost : 0, // for constant costs
            selected : 0
          };

          this.constraintChart = {
              constant: -1,
              label : '',
              isTimeSeries : false,
              /*cols : [
                  {id:'date', type:'string'},
                  {id:'upper_value', type:'number'},
                  {id:'upper_interval', type:'number', role:'interval'},
                  {id:'lower_interval', type:'number', role:'interval'},
                  {id: 'tooltip', type: 'string', role:'tooltip'}
              ],*/
              data : [],
              options : {
                  series: [{'color': '#F1CA3A'}],
                  intervals: { 'style':'area' },
                  vAxis : {
                    viewWindow:{ min: 0 }
                  }
              }
          };

          this.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],

          this.showCostData = false;
          this.showMonthlyVariableCost = false;
          this.showConstantCost = false;
          this.costChartLabel = '';
          this.costChartData = [];
          this.showBounds = false;
          this.showConstantBounds = false;
          this.showTimeSeriesBounds = false;
          this.showChartBounds = false;
          this.hasTimeSeries = false;
          this.charts = {};
        },

        update : function() {
            if( !this.feature ) return;
            console.log(this.feature.properties.costs);

            this.noCostData = true;

            this.constraintChart.data = [];
            this.constraintChart.isTimeSeries = false;
            this.hasTimeSeries = false;
            this.constraintChart.constant = -1;
            this.constraintChart.label = '';

            this.showCostData = false;
            this.showMonthlyVariableCost = false;
            this.showConstantCost = false;
            this.showConstantBounds = false;
            this.$.constraintChartAnchor.innerHTML = '';
            this.showBounds = false;
            this.showConstantBounds = false;

            if( !this.feature.properties.costs || !this.feature.properties.bounds ) return;

            this.noCostData = false;
            this.showCostData = true;

            if( this.feature.properties.bounds ) this.renderBounds(this.feature.properties.bounds);


            this.renderCostData(this.feature.properties.costs);
        },



        renderCostData : function(d) {
          this.costs.label = d.type;


          if( d.type == 'Constant' ) {

            this.showConstantCost = true;
            this.costs.cost = d.cost;


          } else if( d.type == 'Monthly Variable' ) {

            this.showMonthlyVariableCost = true;

            this.costsMonths = {};
            var costArr;
            if( !d.costs ) return;

            if( d.costs.data ) {
              this.costMonths = d.costs.data;
            } else {
              this.costMonths = d.costs;
            }
            this.showMonthlyVariableCost = true;
            this.$.monthSelector.style.display = 'inline-block';

            this.setMonth('JAN');

          } else if( d.type == 'Annual Variable' ) {

            if( !d.costs ) return;

            var keys = Object.keys(d.costs);
            if( keys.length == 0 ) return;
            if( keys.length > 1 ) {
              console.log('! cwn-cost-info found multiple keys for costs data');
              console.log(keys);
            }

            this.costChartLabel = d.type+': '+keys[0];
            this.costChartData = d.costs[keys[0]];
            this.$.lineChart.update(this.costChartData);
            this.showMonthlyVariableCost = true;
            this.$.monthSelector.style.display = 'none';

          } else {
            alert('Unknown cost type: '+d.type);
          }
        },

        /*
          --LBC (Lower Bound Constant),
          --LBM (Lower Bound Monthly Varying)
          --LBT (Lower Bound Time Varying)
          --UBC (Upper Bound Constant)
          --UBM (Upper Bound Monthly Varying)
          --UBT (Upper Bound Time Varying)
          --EQC (Equality Constraint: constant, this requires a time-series data)
             -- is upper and lower bound, single line
          --EQT (Equality Constraint: time, this requires a time-series data)
            -- is upper and lower bound, single line
          --NOB (No Bounds)
        */
        renderBounds : function(bounds) {
          var data = {
            upper: null,
            lower : null,
            NOB : false,
            EQC : false,
            use : 'constant'
          }

          for( var i = 0; i < bounds.length; i++ ) {
            if( bounds[i].type == 'LBC' || bounds[i].type == 'LBM' || bounds[i].type == 'LBT') {
              data.lower = bounds[i];
              if( bounds[i].type != 'LBC' ) data.use = 'lower';

            } else if ( bounds[i].type == 'UBC' || bounds[i].type == 'UBM' || bounds[i].type == 'UBT' ) {
              data.upper = bounds[i];
              if( bounds[i].type == 'UBM' || bounds[i].type == 'UBT' ) {
                // if lower is date, we want to use the date
                if( !(bounds[i].type != 'UBM' && data.use == 'lower') ) data.use = 'upper';
              }

            } else if ( bounds[i].type == 'NOB' ) {
              data.NOB = true;

            // TODO: this should proly render a special case
            } else if ( bounds[i].type == 'EQC' || bounds[i].type == 'EQT' ) {
              data.EQC = true;
              data.lower = bounds[i];
              data.upper = bounds[i];
              data.use = 'upper';
            }

            if( bounds[i].type == 'UBT' || bounds[i].type == 'LBT' ||
                bounds[i].type == 'EQC' || bounds[i].type == 'EQT') {
              this.constraintChart.isTimeSeries = true;

            }
          }

          //  TODO: if NOB, just quit?
          if( data.NOB ) return;

          var chartData = [];

          var length = 1;
          if( data.upper && data.upper.type != 'UBC') {
            length = data.upper.bound.length;
          }
          if( data.lower && data.lower.type != 'LBC' && data.lower.bounds > length ) {
            length = data.lower.bound.length;
          }

          var header = ['Date'];
          if( data.upper ) header.push('Upper Bound');
          if( data.lower ) header.push('Lower Bound');

          if( length == 1 ) length = 12;  // TODO: if len == 1, should we just show text?
          for( var i = 0; i < length; i++ ) {
            this.appendBoundsRow(data, chartData, i);
          }

          this.constraintChart.data = chartData;
          this.updateConstraintUi();
        },

        appendBoundsRow : function(data, chartData, index) {
          var row = [], ud, ld;

          if( data.upper ) {
            ud = this.getBoundsRow(data.upper, index);
            row.push(ud[1]);
          }
          if( data.lower ) {
            ld = this.getBoundsRow(data.lower, index);
            row.push(ld[1]);
          }

          if( data.use == 'constant' ) row.splice(0, 0, index+'');
          else if( data.use == 'upper' ) row.splice(0, 0, ud[0]);
          else row.splice(0, 0, ld[0]);

          chartData.push(row);
        },

        getBoundsRow : function(data, index) {
          if( data.type == 'LBC' || data.type == 'UBC' ) {
            if( index == 0 ) return ['Constant Lower', 'Constant Lower']
            return ['', data.bound];
          }

          if( index > data.bound.length -1) {
            index = index % 12;
          }
          if( index > data.bound.length -1) {
            return ['Invalid', 0];
          }

          return data.bound[index];
        },

        /*renderBounds : function(bounds) {

          if( bounds.constraint_type == 'Bounded' ) {
            var length = this.getContraintsLength(bounds);
            if( length < 12 ) length = 12;

            for( var i = 0; i < length; i++ ) {
              this.constraintChart.data.push(this.getConstraintRow(bounds, i));
            }

          } else if( bounds.constraint_type == 'Constrained' ) {

            if( bounds.constraint.bound_type == 'Constant') {

              this.constraintChart.constant = bounds.constraint.bound;

            } else if( bounds.constraint.bound_type == 'Monthly') {

              for( var i = 0; i < 12; i++ ) {
                this.constraintChart.data.push([
                  this.months[i],
                  bounds.constraint.bound[i],
                  null,
                  null,
                  'Constrained: '+bounds.constraint.bound[i]
                ]);
              }

            } if( bounds.constraint.bound_type == 'TimeSeries') {

              this.constraintChart.isTimeSeries = true;
              this.hasTimeSeries = true;
              for( var i = 0; i < bounds.constraint.bound.length; i++ ) {
                this.constraintChart.data.push([
                  bounds.constraint.date[i],
                  bounds.constraint.bound[i],
                  null,
                  null,
                  'Constrained: '+bounds.constraint.bound[i]
                ]);
              }

            }

          } else {
            console.log('Unknown Constraint Type: '+bounds.constraint_type);
          }

          this.updateConstraintUi();
        },

        getConstraintRow : function(bounds, index) {
          var row = [];

          if( bounds.lower && bounds.lower.bound_type == 'TimeSeries' ) {
            row.push(bounds.lower.date[index]);
          } else if ( bounds.upper && bounds.upper.bound_type == 'TimeSeries' ) {
            row.push(bounds.upper.date[index]);
          } else {
            row.push(this.months[index]);
          }

          var tooltip = row[0]+'\n';

          if( bounds.upper ) {
            if( bounds.upper.bound_type == 'Constant' ) {
              row.push(bounds.upper.bound);
              row.push(bounds.upper.bound);
              tooltip += 'Upper: '+bounds.upper.bound;
            } else if ( bounds.upper.bound_type == 'TimeSeries' || bounds.upper.bound_type == 'Monthly') {
              var i = index;
              if( i > 11 && bounds.upper.bound_type == 'Monthly' ) {
                i = parseInt(row[0].split("-")[1])-1;
              }

              row.push(bounds.upper.bound[i]);
              row.push(bounds.upper.bound[i]);
              tooltip += 'Upper: '+bounds.upper.bound[i];
            } else if ( bounds.upper.bound_type == 'None' ) {
              tooltip += 'Upper: None';
            }
          }

          if( bounds.lower ) {

            if( bounds.lower.bound_type == 'Constant' ) {
              row.push(bounds.lower.bound);
              tooltip += ', Lower: '+bounds.lower.bound;
            } else if ( bounds.lower.bound_type == 'TimeSeries' || bounds.lower.bound_type == 'Monthly' ) {
              var i = index;
              if( i > 11 && bounds.upper.bound_type == 'Monthly' ) {
                i = parseInt(row[0].split("-")[1])-1;
              }

              row.push(bounds.lower.bound[i]);
              tooltip += ', Lower: '+bounds.lower.bound[i];
            } else if ( bounds.lower.bound_type == 'None' ) {
              row.push(0);
              tooltip += ', Lower: 0';
            } else {
               tooltip += ', Lower: Unknown';
            }

          }

          while(row.length < 4) row.push(null);

          row.push(tooltip);

          return row;
        },*/

        getContraintsLength : function(bounds) {
          var l = 0;
          if( bounds.lower ) {
            if( bounds.lower.bound_type == 'Constant' ) {
              l = 1;
            } else if ( bounds.lower.bound_type == 'TimeSeries' ) {
              this.constraintChart.isTimeSeries = true;
              this.hasTimeSeries = true;

              l = bounds.lower.bound.length;
            } else if ( bounds.lower.bound_type == 'Monthly' ) {
              l = bounds.lower.bound.length;
            }
          }
          if (bounds.upper ) {
            if( bounds.upper.bound_type == 'Constant' && l == 0 ) {
              l = 1;
            } else if(bounds.upper.bound_type == 'TimeSeries' && l < bounds.upper.bound.length ) {
              this.constraintChart.isTimeSeries = true;
              this.hasTimeSeries = true;

              l = bounds.upper.bound.length;
            } else if ( bounds.upper.bound_type == 'Monthly' && l < bounds.upper.bound.length ) {
              l = bounds.upper.bound.length;
            }
          }
          return l;
        },

        // used by the month selector to update Monthly Variable chart's current month
        // buttons for this UI are generated above.  Can take button click event
        // or month string
        setMonth : function(month) {
          if( typeof month == 'object' ) month = month.currentTarget.innerHTML;
          month = month.toUpperCase();

          this.costChartLabel = this.costs.label+' - '+month;
          this.costChartData = this.costMonths[month];

          // redraw chart
          this.$.lineChart.update(this.costChartData);
        },


        updateConstraintUi : function() {
            if( this.constraintChart.data.length != 0 || this.constraintChart.constant != -1 ) {
                this.showBounds = true;
            }

            if( this.constraintChart.constant != -1 ) {
                this.showConstantBounds = true;
            }

            this.$.constraintChartAnchor.innerHTML = '';
            this.charts.constraintChart = null;

            if( this.constraintChart.data.length != 0 ) {
                var isline = false;

                // stamp out cwn-date-linechart instead of just linechart
                if( this.constraintChart.isTimeSeries ) {
                    this.hasTimeSeries = true;
                    this.charts.constraintChart = this._stamp(this.$.constraintChartTimeSeries, 'cwn-date-linechart', this.constraintChart);
                } else {
                    isline = true;
                    this.charts.constraintChart = this.$.constraintChart.stamp(this.constraintChart);
                }


                this.$.constraintChartAnchor.appendChild(this.charts.constraintChart.root);

                if( isline ) {
                  this.$.constraintChartAnchor.querySelector('cwn-linechart').update(this.constraintChart.data);
                }
            }
        },

        // dom-template: http://polymer.github.io/polymer/
        // doesn't seem to take variables when you stamp now :(
        // setting manually.
        _stamp : function(ele, query, data) {
          var template = ele.stamp();

          if( query && data ) {
            var newEle = template.root.querySelector(query);
            if( newEle ) {
              for( var key in data ) newEle[key] = data[key];
            }
          }

          return template;
        }

    })
;
Polymer({
    is : 'cwn-info-page',

    properties : {
      hasTimeSeries : {
        type : Boolean,
        notify : true,
        observer : 'updateDateSliderVisibility'
      }
    },

    ready : function() {
      this.feature = null;

      this.hack = '';
      this.islocal = false;

      this.tableProperties = ['prmname'];

      // loading flags
      this.climateLoadError = false;
      this.costLoadError = false;
      this.climateLoading = false;
      this.costLoading = false;
      this.loading = false;

        // have to do long lookup right now, is there are better way?
      this.origins = [];
      this.terminals = [];

      // render data.  Data in a format ready to draw above
      this.inflows = [],

      this.map = {};

        // Elevation / Area / Capacity charts
        this.eacChart = {
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
        };

        // date filtering
        this.filters = {
          start : null,
          stop : null
        },

        // dom controller stuff
        this.hasTimeSeries = false;
        this.showClimateData = false;
        this.charts = {};

    },

    init : function(map) {
      this.map = map;
      this.islocal = CWN.ds.islocal;

      CWN.ds.on('load', this.onLoad.bind(this));
    },

    onLoad : function() {
      if( CWN.ds.loading ) return;

      var loc = window.location.hash.replace('#','').split('/');
      if( loc[0] == 'info' && loc.length > 1) {
        if( this.feature = CWN.ds.lookupMap[loc[1]] ) {
          this.update();
        } else {
          this.feature = CWN.ds.lookupMap[loc[1]];
        }
      }
    },

    setFeature : function(feature) {
      this.feature = feature;
      this.update();
    },

    update : function() {
      if( CWN.ds.loading ) return;

      if( this.feature == null ) return alert('Feature not found');

      this.climateLoadError = false;
      this.climateLoading = false;

      this.eacChart.data = [];
      this.evaporationData = null;
      this.hasInflows = false;

      var props = this.feature.properties;
      if( props.inflows || props.el_ar_cap || props.evaporation) {
        this.showClimateData = true;
      } else {
        this.showClimateData = false;
      }

      this.renderClimateData(props.inflows, props.el_ar_cap, props.evaporation);
      this.updateDateSliderVisibility();

      this.async(function(){
        this.$.dateslider.resize();
      });

    },

    renderClimateData : function(inflows, el_ar_cap, evaporation) {

      if( inflows ) {
        this.hasInflows = true;
        this.$.inflowCharts.innerHTML = '';

        for( var name in inflows ) {
          /*var inflow = {
            label : name,
            description : inflows[name].description || '',
            data : inflows[name].inflow
          };*/

          var chart = document.createElement('cwn-date-linechart');
          chart.label = (inflows[name].description || name || ''),
          chart.data = inflows[name].inflow;

          this.$.inflowCharts.appendChild(chart);
        }

        this.$.inflows.style.display = 'block';
      } else {
        this.$.inflows.style.display = 'none';
      }

      if( evaporation ) {
        this.$.evaporationChart.update(evaporation);
        this.evaporationData = evaporation;
        this.$.evaporation.style.display = 'block';
      } else {
        this.$.evaporation.style.display = 'none';
      }

      this.eacChart.data = [];
      if( el_ar_cap ) {

        var max = 0;
        var elevationCol = 0, capacityCol = 0, areaCol = 0;

        for( var i = 0; i < el_ar_cap.length; i++ ) {
          // make sure col labels are set correctly
          if( i == 0 ) {
            for( var j = 0; j < el_ar_cap[i].length; j ++ ) {
              if( el_ar_cap[i][j].toLowerCase() == 'elevation' ) elevationCol = j;
              else if( el_ar_cap[i][j].toLowerCase() == 'capacity' ) capacityCol = j;
              else if( el_ar_cap[i][j].toLowerCase() == 'area' ) areaCol = j;
            }
          } else {
            this.eacChart.data.push([
              el_ar_cap[i][capacityCol],
              el_ar_cap[i][elevationCol],
              el_ar_cap[i][areaCol],
              null,
              null
            ]);
          }

          if( el_ar_cap[i][elevationCol] > max ) max = el_ar_cap[i][elevationCol];
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
          if( a[capacityCol] > b[capacityCol] ) return 1;
          if( a[capacityCol] < b[capacityCol] ) return -1;
          return 0;
        });

        this.stampEacChart();
      }


      this.updateDateSliderVisibility();
    },

    updateDateFilters : function(e) {
      var eles = this.querySelectorAll('cwn-date-linechart');

      for( var i = 0; i < eles.length; i++ ) {
        eles[i].startDate = e.detail.start;
        eles[i].stopDate = e.detail.end;

        eles[i].update();
      }

      this.notifyPath('filters.start', e.detail.start);
      this.notifyPath('filters.stop', e.detail.end);
    },

    back : function() {
      window.location.hash = 'map'
    },

    _setCostMonth : function(e) {
      this.$.costInfo.setMonth(parseInt(e.currentTarget.getAttribute('index')));
    },

    // dom-template: http://polymer.github.io/polymer/
    // doesn't seem to take variables when you stamp now :(
    // setting manually.
    _stamp : function(ele, query, data) {
      var template = ele.stamp();

      if( query && data ) {
        var newEle = template.root.querySelector(query);
        if( newEle ) {
          for( var key in data ) newEle[key] = data[key];
        }
      }

      return template;
    },

    updateDateSliderVisibility : function() {
      this.$.dateRangeSlider.style.display = (this.hasInflows || this.hasTimeSeries) ? 'block' : 'none';
    },

    stampEacChart : function() {
      if( !this.eacChart ) return;

        if( this.eacChart.data.length == 0 ) {

            this.charts.eacChart = null;
            this.$.eacChartRoot.innerHTML = '';

        } else if( !this.charts.eacChart ) {

            this.charts.eacChart = this._stamp(this.$.eacChart, 'cwn-linechart', this.eacChart);
            this.$.eacChartRoot.appendChild(this.charts.eacChart.root);

            this.async(function(){
                this.$.eacChartRoot.querySelector('cwn-linechart').update(this.eacChart.data);
            });
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
            },
            popupNode : {
                observer : 'setLinks'
            }
        },

        ready : function() {
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
        },

        attached : function() {
            //this.$.popup.target = this;
            $(window).on('hashchange', this.changeNode.bind(this));
            this.changeNode();

            this.async(function(){
                this.$.popup.init();
            });
        },

        setLinks : function() {
            if( !this.popupNode ) return;
            if( !this.popupNode.properties ) return;

            this.graphLink = '#info/'+this.popupNode.properties.prmname;
            this.infoLink = '#info/'+this.popupNode.properties.prmname;
        },

        changeNode : function() {
            if( !this.$ ) return;

            var loc = window.location.hash.replace('#','').split('/');
            if( loc[0] == 'graph' ) {
                this.async(function(){
                    this.prmname = loc.length == 1 ? CWN.ds.data.nodes[0] : loc[1];
                });

                if( !this.graph ) this.render();

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
            if( !CWN.ds ) return;
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
            if( !CWN.ds.lookupMap[prmname] ) return;

            var node = CWN.ds.lookupMap[prmname];
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
                if( !CWN.ds.originLookupMap[prmname] ) return;
                links = CWN.ds.originLookupMap[prmname];
            } else {
                if( !CWN.ds.terminalLookupMap[prmname] ) return;
                links = CWN.ds.terminalLookupMap[prmname];
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
            var tNode = CWN.ds.lookupMap[direction == 'forward' ? link.properties.terminus : link.properties.origin];
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

                links = CWN.ds.originLookupMap[n.id] || [];
                for( var j = 0; j < links.length; j++ ) {
                    this._addLinkIfMissing(links[j]);
                }
                links = CWN.ds.terminalLookupMap[n.id] || [];
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
                    this.popupNode = CWN.ds.lookupMap[e.data.node.id];

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

        goTo : function() {
            window.location.hash = 'map';
            setTimeout(function() {
                var pts = this.popupNode.geometry.coordinates;
                var ele =document.querySelector('cwn-map')
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
        is : 'cwn-map-menu',

        ready : function() {
          this.classList.add('closed');
        },

        init : function() {
            this.state = {
              enabled : [],
              disabled : []
            };
            this.render();

            if( $(window).width() > 700 ) this.toggle();
        },

        getEnabled : function() {
          this.state = {
            enabled : ['California'],
            disabled : []
          };
          this._getEnabled('California');
          return this.state;
        },

        _getEnabled : function(name) {
          var ele = $(this).find('input[name="'+name+'"]');

          if( ele.is(':checked') ) {
            if( name != 'California' ) this.state.enabled.push(name);
            var region = CWN.ds.regionLookupMap[name];

            if( !region.subregions ) return;

            for( var i = 0; i < region.subregions.length; i++ ) {
              this._getEnabled(region.subregions[i]);
            }
          } else {
            this.state.disabled.push(name);
          }
        },

        render : function() {
            this.$.content.innerHTML = '';
            this.renderRegion('California', this.$.content);
        },

        renderRegion : function(regionName, root) {
            var ref = this;
            var region = CWN.ds.regionLookupMap[regionName];

            var panel = $('<div class="menu-root cwn-map-menu"></div>');
            var input = $('<div class="menu-item cwn-map-menu" name="'+region.name+'">'+
                          '<input type="checkbox" name="'+region.name+'" /> '+region.name+'</div>');

            var children = $('<div style="display:'+( region.name == 'California' ? 'block' : 'none')+'"></div>');
            panel.append(input);
            panel.append(children);

            root.appendChild(panel[0]);


            input.find('input').on('click', function(e){
              e.stopPropagation();

              var ele = $(this);

              if( ele.is(':checked') ) {
                  children.show('fast');
              } else {
                  children.hide('fast');
              }

              ref.fire('select', ref.getEnabled());
            });

            input
              .on('click', function(){
                input.find('input').trigger("click");
              })
              .on('mouseover', function(){
                this.fire('hover', regionName);
              }.bind(this))
              .on('mouseout', function(){
                this.fire('nohover', regionName);
              }.bind(this));


            if( !region.subregions ) return;

            for( var i = 0; i < region.subregions.length; i++ ) {
                this.renderRegion(region.subregions[i], children[0]);
            }
        },

        setHovered : function(region) {
          if( !region ) {
            $(this).find('.menu-item').removeClass('hovered');
            this.mouseOverRegion = null;
            return;
          }

          if( this.mouseOverRegion && region.name == this.mouseOverRegion.name ) return;

          $(this).find('.menu-item').removeClass('hovered');
          this.mouseOverRegion = region;

          $(this).find('.menu-item[name="'+region.name+'"]').addClass('hovered');
        },

        toggle : function() {
          if( $(this).hasClass('closed') ) {
            $(this).removeClass('closed');
            this.$.toggle.className = "fa fa-arrow-right";
          } else {
            $(this).addClass('closed');
            this.$.toggle.className = "fa fa-arrow-left";
          }
        }
    })
;

    Polymer({
        is : 'cwn-map',

        ready : function() {
          this.customLines = {};
        },

        init : function(legend, filters) {
          this.map = L.map(this.$.leaflet).setView([40, -121], 5);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 18
          }).addTo(this.map);

          this.links = [];
          this.mapFilters = filters || {};

          this.legend = legend;

          this.mouseMoveTimer = -1;

          this.renderState = {
            points : [],
            lines : [],
            polygons : []
          }

          var ref = this;

          this.markerLayer = new L.CanvasGeojsonLayer({
            onMouseOver : function(features) {
              for( var i = 0; i < features.length; i++ ) {
                if( !features[i].properties._render ) features[i].properties._render = {};
                features[i].properties._render.hover = true;
              }
            },
            onMouseOut : function(features) {
              for( var i = 0; i < features.length; i++ ) {
                if( !features[i].properties._render ) features[i].properties._render = {};
                features[i].properties._render.hover = false;
              }
            },
            onClick : function(features) {
              if( features.length == 0 ) return;

              if( features.length == 1 && features[0].geometry.type == 'Polygon' ) {
                ref.onRegionClick(features[0].properties.id);
                return;
              }

              if( features.length == 1 && features[0].geometry.type == 'Point' ) {
                window.location.href = '#info/' + features[0].properties.prmname;
                return;
              }

              this.$.selector.onClick(features);
            }.bind(this)
          });
          this.markerLayer.addTo(this.map);

          this.$.selector.init(this, this.markerLayer);

          CWN.ds.on('load', this.process.bind(this));
          if( !CWN.ds.loading ) this.process();

          setTimeout(function(){
              this.map.invalidateSize();
          }.bind(this), 200);
        },

        renderRegionLine : function(ctx, xyPoints, config, feature) {
          color = 'orange';

          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 6;
          ctx.moveTo(xyPoints[0].x, xyPoints[0].y);
          ctx.lineTo(xyPoints[1].x, xyPoints[1].y);
          ctx.stroke();

          ctx.beginPath();
          ctx.strokeStyle = 'blue';
          ctx.lineWidth = 2;
          ctx.moveTo(xyPoints[0].x, xyPoints[0].y);
          ctx.lineTo(xyPoints[1].x, xyPoints[1].y);
          ctx.stroke();
        },


        process : function() {
            if( CWN.ds.loading ) return;

            this.edges = [];
            this.knownEdges = [];
            /*for( var i = 0; i < CWN.ds.data.length; i++ ) {
                var d = CWN.ds.data[i];

                if( d.properties.type == 'Diversion' || d.properties.type == 'Return Flow' ) {
                    this.links.push(d);

                } else {
                    this.nodes.push(d);
                }
            }*/

            for( var i = 0; i < CWN.ds.data.regions.length; i++ ) {
              this.markerLayer.addFeature({
                geojson: CWN.ds.data.regions[i].geo,
                render: CWN.map.renderer.basic
              })
            }

            for( var i = 0; i < CWN.ds.data.links.length; i++ ) {
              this.markerLayer.addFeature({
                geojson: CWN.ds.data.links[i],
                render: CWN.map.renderer.basic
              })
            }

            for( var i = 0; i < CWN.ds.data.nodes.length; i++ ) {
              this.markerLayer.addFeature({
                geojson: CWN.ds.data.nodes[i],
                render: CWN.map.renderer.basic
              })
            }



            this.$.menu.init();

            this.updateRenderState();
            this.update();

            setTimeout(function(){
              $('.menu-item[name="California"]').trigger('click');
            }, 200);
        },

        update : function() {
            this.updating = true;

            if( !this.mapFilters ) this.mapFilters = {};

            var map = this.map;
            var oneStepMode = this.mapFilters.oneStepMode;

            // update filtering
            this.filter();

            this.links = this.getEdgeMarkers();

            if( this.markerLayer ) this.markerLayer.render();

            this.updating = false;
            this.fire('filtering-complete');
        },

        getEdgeMarkers : function() {
            var x2, y2, i, coord, link, markers = [];

            for( i = 0; i < CWN.ds.data.links.length; i++ ) {
                link = CWN.ds.data.links[i];
                if( !link.properties._render.show ) continue;
                coord = link.geometry.coordinates;

                x2 = (coord[0][0] + coord[1][0]) / 2;
                y2 = (coord[0][1] + coord[1][1]) / 2;

                x2 = (x2 + coord[1][0]) / 2;
                y2 = (y2 + coord[1][1]) / 2;

                markers.push(link);
            }

            return markers;
        },

        // marker nodes that are linked to a visible node with the 'nodeStep' attribute
        filter : function() {
            var re, i, d, d2, d3, id;

            // three loops, first mark nodes that match, then mark one step nodes
            // finally mark links to hide and show
            try {
                re = new RegExp('.*'+this.mapFilters.text.toLowerCase()+'.*');
            } catch (e) {}

            for( i = 0; i < CWN.ds.data.nodes.length; i++ ) {
                d = CWN.ds.data.nodes[i];

                if( !d.properties._render ) {
                    d.properties._render = {
                        filter_id : d.properties.type.replace(' ','_').replace('-','_')
                    };
                }
                d.properties._render.oneStep = false;


                if( this.mapFilters[d.properties._render.filter_id] && this.isTextMatch(re, d.properties) ) {
                    if( !this.mapFilters.calibrationMode && d.properties.calibrationNode ) {
                        d.properties._render.show = false;
                    } else {
                        d.properties._render.show = true;
                    }
                } else {
                    d.properties._render.show = false;
                }
            }

            // now mark one step nodes
            for( i = 0; i < CWN.ds.data.nodes.length; i++ ) {
                d = CWN.ds.data.nodes[i];
                if( d.properties._render.show ) continue;
                if( !this.mapFilters.calibrationMode && d.properties.calibrationNode ) continue;

                if( d.properties.terminals ) {
                    for( var j = 0; j < d.properties.terminals.length; j++ ) {
                        d2 = CWN.ds.lookupMap[d.properties.terminals[j]];
                        if( d2 && d2.properties._render.show ) {
                            d.properties._render.oneStep = true;
                            break;
                        }
                    }
                }
                if( d.properties.origins && !d.properties._render.oneStep) {
                    for( var j = 0; j < d.properties.origins.length; j++ ) {
                        d2 = CWN.ds.lookupMap[d.properties.origins[j]];
                        if( d2 && d2.properties._render.show ) {
                            d.properties._render.oneStep = true;
                            break;
                        }
                    }
                }
            }

            // now mark links that should be show
            for( var i = 0; i < CWN.ds.data.links.length; i++ ) {
                d = CWN.ds.data.links[i];
                if( !d.properties._render ) {
                    d.properties._render = {};
                }

                d2 = CWN.ds.lookupMap[d.properties.origin];
                d3 = CWN.ds.lookupMap[d.properties.terminus];
                if( d2 && d3 &&
                    (d2.properties._render.show || (this.mapFilters.oneStepMode && d2.properties._render.oneStep) ) &&
                    (d3.properties._render.show || (this.mapFilters.oneStepMode && d3.properties._render.oneStep) ) &&
                   !(d2.properties._render.oneStep && d3.properties._render.oneStep ) ) {
                    d.properties._render.show = true;
                } else {
                    d.properties._render.show = false;
                }
            }
        },

        isTextMatch : function(re, props) {
            if( this.mapFilters.text == '' || !re ) return true;

            if( re.test(props.prmname.toLowerCase()) ) return true;
            if( props.description && re.test(props.description.toLowerCase()) ) return true;
            return false;
        },

        onRegionClick : function(name) {
          $('.menu-item[name="'+name+'"]').trigger('click');
        },

        onRegionSelect : function(e) {
          this.updateRenderState();
          this.markerLayer.render();
        },

        updateRenderState : function() {
          this.renderState = {
            points : [],
            lines : [],
            polygons : []
          }
          this.clearCustomLines();

          this._updateRenderState('California');

          var f = null;
          for( var i = 0; i < this.markerLayer.features.length; i++ ) {
            f = this.markerLayer.features[i];

            if( this.renderState.points.indexOf(f.geojson) > -1 ||
              this.renderState.lines.indexOf(f.geojson) > -1 ||
              this.renderState.polygons.indexOf(f.geojson) > -1  ) {
                f.visible = true;
            } else {
              f.visible = false;
            }
          }
          console.log('set render state');
          this.markerLayer.render();
        },

        _updateRenderState : function(name) {
          var region = CWN.ds.regionLookupMap[name];
          var state = this.$.menu.state;

          if( state.enabled.indexOf(name) > -1 ) {
            this._addStateNodes(region.nodes, state);

            if( !region.subregions ) return;

            for( var i = 0; i < region.subregions.length; i++ ) {
              this._updateRenderState(region.subregions[i]);
            }
          } else {

            if( name != 'California' ) this.renderState.polygons.push(region.geo);
          }
        },

        _addStateNodes : function(nodes, state) {
          var self = this;

          // find first region and insert after
          var index = 0;
          for( var i = 0; i < this.markerLayer.features.length; i++ ) {
            if( this.markerLayer.features[i].geojson.geometry.type != 'Polygon' ) {
              index = i;
              break;
            }
          }

          for( var i = 0; i < nodes.length; i++ ) {
            var node = CWN.ds.filenameLookupMap[nodes[i]];

            // TODO: why!?
            if( !node ) continue;

            if( node.properties.type == 'Diversion' || node.properties.type == 'Return Flow' ) {
              var terminal = this._getStateNodeLocation(node.properties.terminus, state);
              var origin = this._getStateNodeLocation(node.properties.origin, state);


              var lineFeature;
              if( terminal.isNode && origin.isNode ) {
                lineFeature = this.createNodeLink(origin.center, terminal.center, node);
                this.customLines[node.properties.origin+'_'+node.properties.terminus] = lineFeature;
              } else {
                // if this line already exists, a null value will be returned
                lineFeature = this.createCustomLink(origin, terminal, node);
              }

              if( lineFeature ) {
                this.renderState.lines.push(lineFeature.geojson);
                this.markerLayer.addFeature(lineFeature, index);
              }

            } else {
              this.renderState.points.push(node);
            }
          }
        },

        createNodeLink : function(origin, terminal, node) {
          return {
            geojson : {
              "type" : "Feature",
              "geometry" : {
                "type" : "LineString",
                coordinates : [origin, terminal]
              },
              properties : $.extend(true, {}, node.properties)
            },
            render : CWN.map.renderer.basic
          };
        },

        createCustomLink : function(origin, terminal, node) {
          var self = this;

          var feature = null;
          if( this.customLines[origin.name+'_'+terminal.name] ) {
            feature = this.customLines[origin.name+'_'+terminal.name];
          } else if ( this.customLines[terminal.name+'_'+origin.name] ) {
            feature = this.customLines[terminal.name+'_'+origin.name];
          }

          if( !feature ) {
            feature = {
              geojson : {
                "type" : "Feature",
                "geometry" : {
                  "type" : "LineString",
                  coordinates : [origin.center, terminal.center]
                },
                properties : {
                  lines : [$.extend(true, {}, node.properties)]
                }
              },
              render : function(ctx, xyPoints, map) {
                self.renderRegionLine(ctx, xyPoints, map, this);
              }
            }

            this.customLines[origin.name+'_'+terminal.name] = feature;

            return feature;
          }

          feature.geojson.properties.lines.push($.extend(true, {}, node.properties));
        },

        clearCustomLines : function() {
          for( var key in this.customLines ) {
            var index = this.markerLayer.features.indexOf(this.customLines[key]);
            if( index > -1 ) this.markerLayer.features.splice(index, 1);
          }
          this.customLines = {};
        },

        _getStateNodeLocation : function(name, state) {
          var node = CWN.ds.lookupMap[name];

          for( var i = 0; i < node.properties.regions.length; i++ ) {
            if( state.disabled.indexOf(node.properties.regions[i]) > -1 ) {
              if( CWN.ds.regionLookupMap[node.properties.regions[i]].center ) {
                return {
                  center: CWN.ds.regionLookupMap[node.properties.regions[i]].center,
                  name: node.properties.regions[i],
                  isRegion : true
                };
              }
            }
          }

          return {
            center : node.geometry.coordinates || [0,0],
            name : name,
            isNode : true
          }
        },

        onMenuRegionHover : function(e) {
          this.hoverRegion = e.detail;
          this.markerLayer.render();
        },

        onMenuRegionNoHover : function(e) {
          if( this.hoverRegion == e.detail ) {
            this.hoverRegion = null;
            this.markerLayer.render();
          }
        }


    });
;

    Polymer({
        is : 'cwn-app',

        ready : function() {
          this.PAGES = {
            map : 0,
            info : 1,
            graph : 2
          };

          this.selectedPage = 0;


          this.loading = true;

          this.dataLoaded = false;
          this.dataLoadHandlers = [];

          this.legend = {
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
          };

        },

        attached : function() {
          $(window).on('hashchange', function(){
            this.setLocation();
          }.bind(this));

          this.$.map.init(this.legend, this.$.filters.filters);
          this.$.info.init(this.$.map.map);

          this.setLocation();

          CWN.ds.on('load', this.onLoadingChange.bind(this));
        },

        onLoadingChange : function() {
          if( CWN.ds.loading ) {
            this.$.splash.style.display = 'block';
          } else {
            this.$.splash.style.display = 'none';
            this.onDataLoad();
          }
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
          this.$.info.setFeature(CWN.ds.lookupMap[name]);
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
