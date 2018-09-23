/**
 * This is an auto-generated code by Monaca JS/CSS Components.
 * Please do not edit by hand.
 */

/*** <GENERATED> ***/


/*** <Start:monaca-cordova-loader> ***/
/*** <Start:monaca-cordova-loader LoadJs:"components/monaca-cordova-loader/cordova-loader.js"> ***/
(function(){
  function getDeviceObjectForPreview() {
    var raw_values = window.location.search.substring(1).split('&');
    var values = {};
    var device = { platform: "" };
    
    if (raw_values) {
      for (var key in raw_values) {
        var tmp = raw_values[key].split('=');
        values[tmp[0]] = decodeURIComponent(tmp[1]);
      }
      device.platform = values.platform;
    }
    
    return device;
  }
    
  if (/^https:\/\/preview-.+monaca\.(local||mobi)/.test(location.href)) {
    window.device = getDeviceObjectForPreview();
  }
 
  if ((navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPhone|iPad|iPod/i))) {
    if (typeof location.href === "string") {
      var relativePath = location.href.split("/www")[1];
      var paths = relativePath.split("/");
      var cordovaJsUrl = ""; 
      for (var i = 0; i < paths.length - 2; i++) {
        cordovaJsUrl += "../";
      }
      document.write("<script src=\"" + cordovaJsUrl+ "cordova.js" + "\"></script>");
    }
  } else if ( ((navigator.userAgent.match(/MSIE\s10.0/)) && (navigator.userAgent.match(/Windows\sNT\s6.2/)) ) || navigator.userAgent.match(/MSAppHost/) ) {
    var elm = document.createElement('script');
    elm.setAttribute("src", "cordova.js");
    document.getElementsByTagName("head")[0].appendChild(elm);
  };
})();
/*** <End:monaca-cordova-loader LoadJs:"components/monaca-cordova-loader/cordova-loader.js"> ***/
/*** <End:monaca-cordova-loader> ***//*** <Start:monaca-core-utils> ***/
/*** <Start:monaca-core-utils LoadJs:"components/monaca-core-utils/monaca-core-utils.js"> ***/
/**
 * Monaca Core Utility Library
 * This library requires cordova.js
 *
 * @version 2.0.6
 * @author  Asial Corporation
 */
window.monaca = window.monaca || {};

(function() {
    /*
     * monaca api queue.
     */
    monaca.apiQueue = monaca.apiQueue || {};
    monaca.apiQueue.paramsArray = [];
    monaca.apiQueue.exec = function(a,b,c,d,e){
        if (!monaca.isDeviceReady) {
            monaca.apiQueue.paramsArray.push([a,b,c,d,e]);
        } else {
            window.cordova.exec(a,b,c,d,e);
        }
    };
    monaca.apiQueue.next = function(){
        var params = monaca.apiQueue.paramsArray.shift();
        if (params) {
            window.cordova.exec(
                function(r) {
                  if (typeof params[0] === 'function') params[0](r);
                  monaca.apiQueue.next();
                },
                function(r) {
                  if (typeof params[1] === 'function') params[1](r);
                  monaca.apiQueue.next();
                },
                params[2],
                params[3],
                params[4]
            );
        }
    };

    monaca.isDeviceReady = monaca.isDeviceReady || false;
    document.addEventListener('deviceready', function(){
        window.monaca.isDeviceReady = true;
        monaca.apiQueue.next();
    }, false);

    /**
     * Check User-Agent
     */
    var isAndroid = !!(navigator.userAgent.match(/Android/i));
    var isIOS     = !!(navigator.userAgent.match(/iPhone|iPad|iPod/i));
    monaca.isAndroid = isAndroid;
    monaca.isIOS     = isIOS;

    /**
     * Obtain style property
     */
    monaca.retrieveUIStyle = function() {
        var argsArray = [].slice.apply(arguments);
        monaca.apiQueue.exec(arguments[arguments.length-1], null, "mobi.monaca.nativecomponent", "retrieve", argsArray);
    };

    /**
     * Update style property
     */
    monaca.updateUIStyle = function(id, name, value) {
        if (typeof id == "string") {
            var argsArray = [].slice.apply(arguments);
            monaca.apiQueue.exec(null, null, "mobi.monaca.nativecomponent", "update", argsArray);
        } else {
            for (var i = 0; i < id.length; i++) {
                monaca.apiQueue.exec(null, null, "mobi.monaca.nativecomponent", "update", [id[i], name, value]);
            }
        }
    };

    if (isAndroid) {
        monaca.retrieveUIStyle = function(id, name, success, failure) {
            monaca.apiQueue.exec(
                function(style) { success(style[name]); } || function() { },
                failure || function() { },
                "mobi.monaca.nativecomponent",
                "retrieve",
                [id]
            );
        };

        monaca.updateUIStyle = function(id, name, value, success, failure) {
            var style = {};
            style[name] = value;

            monaca.apiQueue.exec(
                success || function() { },
                failure || function() { },
                "mobi.monaca.nativecomponent",
                "update",
                [id, style]
            );
        };
    }

    /**
     * Spinner handling
     */
    monaca.showSpinner = function (options) {
        options = options || {};
        var src = options.src ? options.src : null;
        var frames = options.frames != null ? options.frames : null;
        var interval = options.interval != null ? options.interval : null;
        var backgroundColor = options.backgroundColor ? options.backgroundColor : null;
        var backgroundOpacity = options.backgroundOpacity != null ? options.backgroundOpacity : null;
        var title = options.title ? options.title : null;
        var titleColor = options.titleColor ? options.titleColor : null;
        var titleFontScale = options.titleFontScale != null ? options.titleFontScale : null;
        monaca.apiQueue.exec(null, null, "mobi.monaca.nativecomponent", 'showSpinner', [ src, frames, interval, backgroundColor, backgroundOpacity, title, titleColor, titleFontScale, null ]);
    };

    monaca.hideSpinner = function(){
        monaca.apiQueue.exec(null, null, "mobi.monaca.nativecomponent", 'hideSpinner', []);
    };

    monaca.updateSpinnerTitle = function(newTitle){
        if (!newTitle) newTitle = "";
        monaca.apiQueue.exec(null, null, "mobi.monaca.nativecomponent", 'updateSpinnerTitle', [ newTitle ]);
    };

    var transitionPluginName = "Transit";

    /**
     * Open new page.
     */
    monaca.pushPage = function(path, options, param) {
        options = options || {};
        var animation = null;
        switch (options.animation) {
        case "lift":
          animation = "modal"; break;
        case "slide":
        case "slideLeft":
          animation = "push"; break;
        case "slideRight":
          animation = "slideRight"; break;
        default:
          animation = "push";
        }
        monaca.apiQueue.exec(null, null, transitionPluginName, animation, [path, options, param]);
    };
    /**
     * Close current page.
     */
    monaca.popPage = function(options) {
        options = options || {};
        var name = options.animation == 'lift' ? 'dismiss' : 'pop';
        monaca.apiQueue.exec(null, null, transitionPluginName, name, [options]);
    };

    /**
     * Open in browser.
     */
    monaca.invokeBrowser = function(url) {
        monaca.apiQueue.exec(null, null, transitionPluginName, "browse", [url]);
    };

    /**
     * Load in current page.
     */
    monaca.load = function(path, options, param) {
        monaca.apiQueue.exec(null, null, transitionPluginName, "link", [path, options, param]);
    };

    /**
     * return to top page.
     */
    monaca.home = function(options) {
        options = options || {};
        monaca.apiQueue.exec(null, null, transitionPluginName, "home", [options]);
    };

    /**
     * Clear stack
     */
    monaca.clearPageStack = function(clearAll) {
        clearAll = clearAll || false;
        monaca.apiQueue.exec(null, null, transitionPluginName, "clearPageStack", [clearAll]);
    };


    /**
     * Console API from independent PhoneGap.
     */
    window.monaca.console = window.monaca.console || {};

    /**
     * base method for send log.
     */
    monaca.console.sendLog = function(level, url, line, char, arguments) {
        var message;
        for (var i=0; i<arguments.length; i++){
            if (typeof arguments[i] == "string") {
                message = arguments[i];
            } else {
                message = JSON.stringify(arguments[i]);
            }

            if (isIOS) {
                // not checked yet  or  confirmed MonacaDebugger
                if (! monaca.isMonacaDebuggerChecked || monaca.isMonacaDebugger ) {
                  var head = message.substr(0, 5);
                  if (window.monaca.isDeviceReady !== true || (head != 'ERROR' && head != 'WARN:')) {
                      var xhr = new XMLHttpRequest();
                      var path = "https://monaca-debugger.local/log?level=" + encodeURIComponent(level) + "&message=" + encodeURIComponent(message) + "&at=" + (new Date()).getTime();
                      xhr.open("GET", path);
                      xhr.send();
                  }
                }
                window.orig_console[level](message);
            } else {
                window.console[level](message);
            }
        }
    }

    /**
     * monaca console methods
     */
    var methods = ["debug", "info", "log", "warn", "error"];
    for (var i=0; i<methods.length; i++) {
        var method = methods[i];
        monaca.console[method] = function(method) {
            return function() {
                monaca.console.sendLog(method, null, null, null, arguments);
            };
        }(method);
    }

    /** Replace window.console if iOS **/
    if (isIOS) {
      window.orig_console = window.console;
      window.console = window.monaca.console;
      window.addEventListener( "error" , function (desc, page, line, char) {
          monaca.console.sendLog("error", null, null, null, [ { "message" : desc.message , "page" : desc.filename , "line" : desc.lineno , "char" : desc.colno   } ]);
      } , false );
      // window.onerror = function (desc, page, line, char) {
      //    monaca.console.sendLog("error", page, line, char, [ { "message" : desc , "page" : page , "line" : line, "char" : char } ] );
      // };
    }
    /* Comment out for now
    window.onerror = function (desc, page, line, char) {
      monaca.console.sendLog("error", page, line, char, [desc]);
    };
    */

    window.monaca.splashScreen = window.monaca.splashScreen || {};
    var splashScreenPluginName = "MonacaSplashScreen";

    /**
     * hide SplashScreen.
     */
    monaca.splashScreen.hide = function() {
        if (isAndroid) {
            monaca.apiQueue.exec(null, null, splashScreenPluginName, "hide", []);
        } else {
            navigator.splashscreen.hide();
        }
    };

    // Set monaca.baseUrl
    if (typeof location.href !== "string") {
        console.warn("Cannot find base url");
        monaca.baseUrl = null;
    } else {
        monaca.baseUrl = location.href.split("/www/")[0] + "/www/";
    }

    /**
     * Get device ID
     */
    monaca.getDeviceId = function(callback) {
        monaca.apiQueue.exec(function(result) { callback(result.deviceId); }, null, "Monaca", "getRuntimeConfiguration", []);
    };

    monaca.getRuntimeConfiguration = function(success,failure) {
        monaca.apiQueue.exec( success , failure , "Monaca" , "getRuntimeConfiguration" , []);
    };

    monaca.isMonacaDebuggerChecked = false;
    monaca.isMonacaDebugger = null;

    monaca.getRuntimeConfiguration( function(result) {
        monaca.isMonacaDebuggerChecked = true;
        monaca.isMonacaDebugger = !! result.isMonacaDebugger;
    });


})();

/**
 * iOS Status Bar Plugin
 *
 * @author Asial Corporation
 * @date   2014/1/15
 */
window.StatusBar = window.StatusBar || {};

(function() {

  /*
    hideStatusBar
    support : iOS6,iOS7
  */
  StatusBar.hideStatusBar = function() {
    monaca.apiQueue.exec(null, null, "mobi.monaca.nativecomponent", 'hideStatusBar', []);
  }

  /*
    showStatusBar
    support : iOS6,iOS7
  */
  StatusBar.showStatusBar = function() {
    monaca.apiQueue.exec(null, null, "mobi.monaca.nativecomponent", 'showStatusBar', []);
  }

  /*
    statusBarStyleDefault
    support : iOS6,iOS7
  */
  StatusBar.statusBarStyleDefault = function() {
    monaca.apiQueue.exec(null, null, "mobi.monaca.nativecomponent", 'statusBarStyleDefault', []);
  }

  /*
    statusBarStyleLightContent
    support : iOS7
  */
  StatusBar.statusBarStyleLightContent = function() {
    monaca.apiQueue.exec(null, null, "mobi.monaca.nativecomponent", 'statusBarStyleLightContent', []);
  }

  /*
    statusBarStyleBlackOpaque
    support : iOS6
  */
  StatusBar.statusBarStyleBlackOpaque = function() {
    monaca.apiQueue.exec(null, null, "mobi.monaca.nativecomponent", 'statusBarStyleBlackOpaque', []);
  }

  /*
    statusBarStyleBlackTranslucent
    support : iOS6
  */
  StatusBar.statusBarStyleBlackTranslucent = function() {
    monaca.apiQueue.exec(null, null, "mobi.monaca.nativecomponent", 'statusBarStyleBlackTranslucent', []);
  }

})();

/**
 * Monaca Cloud Functions
 *  Version 1.5.0
 *
 * @author Masahiro TANAKA <info@monaca.mobi>
 * @date   2013/03/17
 */
window.monaca = window.monaca || {};
window.monaca.cloud = window.monaca.cloud || {};

(function() {
    /**
     * Push Notification
     */
    monaca.cloud.Push = {};
    monaca.cloud.Push.callback = null;
    monaca.cloud.Push.callbackData = null;

    monaca.cloud.Push.send = function(data) {
        if (typeof monaca.cloud.Push.callback === "function") {
            monaca.cloud.Push.callback(data);
        } else {
            monaca.cloud.Push.callbackData = data;
        }
    };
    monaca.cloud.Push.setHandler = function(fn) {
        if (typeof fn !== "function") {
            console.warn("Push callback must be a function");
        } else {
            monaca.cloud.Push.callback = fn;
            if (monaca.cloud.Push.callbackData) {
                monaca.cloud.Push.callback(monaca.cloud.Push.callbackData);
                monaca.cloud.Push.callbackData = null;
            }
        }
    };

})();


/*
 * cloud
 */
(function(root) {
  var original$ = root.$;
  var originalZepto = root.Zepto;

  /* Zepto 1.1.3 - zepto event ajax deferred callbacks - zeptojs.com/license */
  var Zepto=function(){function k(t){return null==t?String(t):j[T.call(t)]||"object"}function $(t){return"function"==k(t)}function L(t){return null!=t&&t==t.window}function D(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function F(t){return"object"==k(t)}function Z(t){return F(t)&&!L(t)&&Object.getPrototypeOf(t)==Object.prototype}function M(t){return"number"==typeof t.length}function R(t){return s.call(t,function(t){return null!=t})}function _(t){return t.length>0?n.fn.concat.apply([],t):t}function q(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function W(t){return t in f?f[t]:f[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function z(t,e){return"number"!=typeof e||c[q(t)]?e:e+"px"}function H(t){var e,n;return u[t]||(e=a.createElement(t),a.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),u[t]=n),u[t]}function V(t){return"children"in t?o.call(t.children):n.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function I(n,i,r){for(e in i)r&&(Z(i[e])||A(i[e]))?(Z(i[e])&&!Z(n[e])&&(n[e]={}),A(i[e])&&!A(n[e])&&(n[e]=[]),I(n[e],i[e],r)):i[e]!==t&&(n[e]=i[e])}function B(t,e){return null==e?n(t):n(t).filter(e)}function J(t,e,n,i){return $(e)?e.call(t,n,i):e}function U(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function X(e,n){var i=e.className,r=i&&i.baseVal!==t;return n===t?r?i.baseVal:i:void(r?i.baseVal=n:e.className=n)}function Y(t){var e;try{return t?"true"==t||("false"==t?!1:"null"==t?null:/^0/.test(t)||isNaN(e=Number(t))?/^[\[\{]/.test(t)?n.parseJSON(t):t:e):t}catch(i){return t}}function G(t,e){e(t);for(var n in t.childNodes)G(t.childNodes[n],e)}var t,e,n,i,C,N,r=[],o=r.slice,s=r.filter,a=window.document,u={},f={},c={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},l=/^\s*<(\w+|!)[^>]*>/,h=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,p=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,d=/^(?:body|html)$/i,m=/([A-Z])/g,g=["val","css","html","text","data","width","height","offset"],v=["after","prepend","before","append"],y=a.createElement("table"),x=a.createElement("tr"),b={tr:a.createElement("tbody"),tbody:y,thead:y,tfoot:y,td:x,th:x,"*":a.createElement("div")},w=/complete|loaded|interactive/,E=/^[\w-]*$/,j={},T=j.toString,S={},O=a.createElement("div"),P={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},A=Array.isArray||function(t){return t instanceof Array};return S.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var i,r=t.parentNode,o=!r;return o&&(r=O).appendChild(t),i=~S.qsa(r,e).indexOf(t),o&&O.removeChild(t),i},C=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},N=function(t){return s.call(t,function(e,n){return t.indexOf(e)==n})},S.fragment=function(e,i,r){var s,u,f;return h.test(e)&&(s=n(a.createElement(RegExp.$1))),s||(e.replace&&(e=e.replace(p,"<$1></$2>")),i===t&&(i=l.test(e)&&RegExp.$1),i in b||(i="*"),f=b[i],f.innerHTML=""+e,s=n.each(o.call(f.childNodes),function(){f.removeChild(this)})),Z(r)&&(u=n(s),n.each(r,function(t,e){g.indexOf(t)>-1?u[t](e):u.attr(t,e)})),s},S.Z=function(t,e){return t=t||[],t.__proto__=n.fn,t.selector=e||"",t},S.isZ=function(t){return t instanceof S.Z},S.init=function(e,i){var r;if(!e)return S.Z();if("string"==typeof e)if(e=e.trim(),"<"==e[0]&&l.test(e))r=S.fragment(e,RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=S.qsa(a,e)}else{if($(e))return n(a).ready(e);if(S.isZ(e))return e;if(A(e))r=R(e);else if(F(e))r=[e],e=null;else if(l.test(e))r=S.fragment(e.trim(),RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=S.qsa(a,e)}}return S.Z(r,e)},n=function(t,e){return S.init(t,e)},n.extend=function(t){var e,n=o.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){I(t,n,e)}),t},S.qsa=function(t,e){var n,i="#"==e[0],r=!i&&"."==e[0],s=i||r?e.slice(1):e,a=E.test(s);return D(t)&&a&&i?(n=t.getElementById(s))?[n]:[]:1!==t.nodeType&&9!==t.nodeType?[]:o.call(a&&!i?r?t.getElementsByClassName(s):t.getElementsByTagName(e):t.querySelectorAll(e))},n.contains=function(t,e){return t!==e&&t.contains(e)},n.type=k,n.isFunction=$,n.isWindow=L,n.isArray=A,n.isPlainObject=Z,n.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},n.inArray=function(t,e,n){return r.indexOf.call(e,t,n)},n.camelCase=C,n.trim=function(t){return null==t?"":String.prototype.trim.call(t)},n.uuid=0,n.support={},n.expr={},n.map=function(t,e){var n,r,o,i=[];if(M(t))for(r=0;r<t.length;r++)n=e(t[r],r),null!=n&&i.push(n);else for(o in t)n=e(t[o],o),null!=n&&i.push(n);return _(i)},n.each=function(t,e){var n,i;if(M(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(i in t)if(e.call(t[i],i,t[i])===!1)return t;return t},n.grep=function(t,e){return s.call(t,e)},window.JSON&&(n.parseJSON=JSON.parse),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){j["[object "+e+"]"]=e.toLowerCase()}),n.fn={forEach:r.forEach,reduce:r.reduce,push:r.push,sort:r.sort,indexOf:r.indexOf,concat:r.concat,map:function(t){return n(n.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return n(o.apply(this,arguments))},ready:function(t){return w.test(a.readyState)&&a.body?t(n):a.addEventListener("DOMContentLoaded",function(){t(n)},!1),this},get:function(e){return e===t?o.call(this):this[e>=0?e:e+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return r.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return $(t)?this.not(this.not(t)):n(s.call(this,function(e){return S.matches(e,t)}))},add:function(t,e){return n(N(this.concat(n(t,e))))},is:function(t){return this.length>0&&S.matches(this[0],t)},not:function(e){var i=[];if($(e)&&e.call!==t)this.each(function(t){e.call(this,t)||i.push(this)});else{var r="string"==typeof e?this.filter(e):M(e)&&$(e.item)?o.call(e):n(e);this.forEach(function(t){r.indexOf(t)<0&&i.push(t)})}return n(i)},has:function(t){return this.filter(function(){return F(t)?n.contains(this,t):n(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!F(t)?t:n(t)},last:function(){var t=this[this.length-1];return t&&!F(t)?t:n(t)},find:function(t){var e,i=this;return e="object"==typeof t?n(t).filter(function(){var t=this;return r.some.call(i,function(e){return n.contains(e,t)})}):1==this.length?n(S.qsa(this[0],t)):this.map(function(){return S.qsa(this,t)})},closest:function(t,e){var i=this[0],r=!1;for("object"==typeof t&&(r=n(t));i&&!(r?r.indexOf(i)>=0:S.matches(i,t));)i=i!==e&&!D(i)&&i.parentNode;return n(i)},parents:function(t){for(var e=[],i=this;i.length>0;)i=n.map(i,function(t){return(t=t.parentNode)&&!D(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return B(e,t)},parent:function(t){return B(N(this.pluck("parentNode")),t)},children:function(t){return B(this.map(function(){return V(this)}),t)},contents:function(){return this.map(function(){return o.call(this.childNodes)})},siblings:function(t){return B(this.map(function(t,e){return s.call(V(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return n.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=H(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var e=$(t);if(this[0]&&!e)var i=n(t).get(0),r=i.parentNode||this.length>1;return this.each(function(o){n(this).wrapAll(e?t.call(this,o):r?i.cloneNode(!0):i)})},wrapAll:function(t){if(this[0]){n(this[0]).before(t=n(t));for(var e;(e=t.children()).length;)t=e.first();n(t).append(this)}return this},wrapInner:function(t){var e=$(t);return this.each(function(i){var r=n(this),o=r.contents(),s=e?t.call(this,i):t;o.length?o.wrapAll(s):r.append(s)})},unwrap:function(){return this.parent().each(function(){n(this).replaceWith(n(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(e){return this.each(function(){var i=n(this);(e===t?"none"==i.css("display"):e)?i.show():i.hide()})},prev:function(t){return n(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return n(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0===arguments.length?this.length>0?this[0].innerHTML:null:this.each(function(e){var i=this.innerHTML;n(this).empty().append(J(this,t,e,i))})},text:function(e){return 0===arguments.length?this.length>0?this[0].textContent:null:this.each(function(){this.textContent=e===t?"":""+e})},attr:function(n,i){var r;return"string"==typeof n&&i===t?0==this.length||1!==this[0].nodeType?t:"value"==n&&"INPUT"==this[0].nodeName?this.val():!(r=this[0].getAttribute(n))&&n in this[0]?this[0][n]:r:this.each(function(t){if(1===this.nodeType)if(F(n))for(e in n)U(this,e,n[e]);else U(this,n,J(this,i,t,this.getAttribute(n)))})},removeAttr:function(t){return this.each(function(){1===this.nodeType&&U(this,t)})},prop:function(e,n){return e=P[e]||e,n===t?this[0]&&this[0][e]:this.each(function(t){this[e]=J(this,n,t,this[e])})},data:function(e,n){var i=this.attr("data-"+e.replace(m,"-$1").toLowerCase(),n);return null!==i?Y(i):t},val:function(t){return 0===arguments.length?this[0]&&(this[0].multiple?n(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value):this.each(function(e){this.value=J(this,t,e,this.value)})},offset:function(t){if(t)return this.each(function(e){var i=n(this),r=J(this,t,e,i.offset()),o=i.offsetParent().offset(),s={top:r.top-o.top,left:r.left-o.left};"static"==i.css("position")&&(s.position="relative"),i.css(s)});if(0==this.length)return null;var e=this[0].getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:Math.round(e.width),height:Math.round(e.height)}},css:function(t,i){if(arguments.length<2){var r=this[0],o=getComputedStyle(r,"");if(!r)return;if("string"==typeof t)return r.style[C(t)]||o.getPropertyValue(t);if(A(t)){var s={};return n.each(A(t)?t:[t],function(t,e){s[e]=r.style[C(e)]||o.getPropertyValue(e)}),s}}var a="";if("string"==k(t))i||0===i?a=q(t)+":"+z(t,i):this.each(function(){this.style.removeProperty(q(t))});else for(e in t)t[e]||0===t[e]?a+=q(e)+":"+z(e,t[e])+";":this.each(function(){this.style.removeProperty(q(e))});return this.each(function(){this.style.cssText+=";"+a})},index:function(t){return t?this.indexOf(n(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?r.some.call(this,function(t){return this.test(X(t))},W(t)):!1},addClass:function(t){return t?this.each(function(e){i=[];var r=X(this),o=J(this,t,e,r);o.split(/\s+/g).forEach(function(t){n(this).hasClass(t)||i.push(t)},this),i.length&&X(this,r+(r?" ":"")+i.join(" "))}):this},removeClass:function(e){return this.each(function(n){return e===t?X(this,""):(i=X(this),J(this,e,n,i).split(/\s+/g).forEach(function(t){i=i.replace(W(t)," ")}),void X(this,i.trim()))})},toggleClass:function(e,i){return e?this.each(function(r){var o=n(this),s=J(this,e,r,X(this));s.split(/\s+/g).forEach(function(e){(i===t?!o.hasClass(e):i)?o.addClass(e):o.removeClass(e)})}):this},scrollTop:function(e){if(this.length){var n="scrollTop"in this[0];return e===t?n?this[0].scrollTop:this[0].pageYOffset:this.each(n?function(){this.scrollTop=e}:function(){this.scrollTo(this.scrollX,e)})}},scrollLeft:function(e){if(this.length){var n="scrollLeft"in this[0];return e===t?n?this[0].scrollLeft:this[0].pageXOffset:this.each(n?function(){this.scrollLeft=e}:function(){this.scrollTo(e,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),i=this.offset(),r=d.test(e[0].nodeName)?{top:0,left:0}:e.offset();return i.top-=parseFloat(n(t).css("margin-top"))||0,i.left-=parseFloat(n(t).css("margin-left"))||0,r.top+=parseFloat(n(e[0]).css("border-top-width"))||0,r.left+=parseFloat(n(e[0]).css("border-left-width"))||0,{top:i.top-r.top,left:i.left-r.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||a.body;t&&!d.test(t.nodeName)&&"static"==n(t).css("position");)t=t.offsetParent;return t})}},n.fn.detach=n.fn.remove,["width","height"].forEach(function(e){var i=e.replace(/./,function(t){return t[0].toUpperCase()});n.fn[e]=function(r){var o,s=this[0];return r===t?L(s)?s["inner"+i]:D(s)?s.documentElement["scroll"+i]:(o=this.offset())&&o[e]:this.each(function(t){s=n(this),s.css(e,J(this,r,t,s[e]()))})}}),v.forEach(function(t,e){var i=e%2;n.fn[t]=function(){var t,o,r=n.map(arguments,function(e){return t=k(e),"object"==t||"array"==t||null==e?e:S.fragment(e)}),s=this.length>1;return r.length<1?this:this.each(function(t,a){o=i?a:a.parentNode,a=0==e?a.nextSibling:1==e?a.firstChild:2==e?a:null,r.forEach(function(t){if(s)t=t.cloneNode(!0);else if(!o)return n(t).remove();G(o.insertBefore(t,a),function(t){null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src||window.eval.call(window,t.innerHTML)})})})},n.fn[i?t+"To":"insert"+(e?"Before":"After")]=function(e){return n(e)[t](this),this}}),S.Z.prototype=n.fn,S.uniq=N,S.deserializeValue=Y,n.zepto=S,n}();window.Zepto=Zepto,void 0===window.$&&(window.$=Zepto),function(t){function l(t){return t._zid||(t._zid=e++)}function h(t,e,n,i){if(e=p(e),e.ns)var r=d(e.ns);return(s[l(t)]||[]).filter(function(t){return!(!t||e.e&&t.e!=e.e||e.ns&&!r.test(t.ns)||n&&l(t.fn)!==l(n)||i&&t.sel!=i)})}function p(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function d(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function m(t,e){return t.del&&!u&&t.e in f||!!e}function g(t){return c[t]||u&&f[t]||t}function v(e,i,r,o,a,u,f){var h=l(e),d=s[h]||(s[h]=[]);i.split(/\s/).forEach(function(i){if("ready"==i)return t(document).ready(r);var s=p(i);s.fn=r,s.sel=a,s.e in c&&(r=function(e){var n=e.relatedTarget;return!n||n!==this&&!t.contains(this,n)?s.fn.apply(this,arguments):void 0}),s.del=u;var l=u||r;s.proxy=function(t){if(t=j(t),!t.isImmediatePropagationStopped()){t.data=o;var i=l.apply(e,t._args==n?[t]:[t].concat(t._args));return i===!1&&(t.preventDefault(),t.stopPropagation()),i}},s.i=d.length,d.push(s),"addEventListener"in e&&e.addEventListener(g(s.e),s.proxy,m(s,f))})}function y(t,e,n,i,r){var o=l(t);(e||"").split(/\s/).forEach(function(e){h(t,e,n,i).forEach(function(e){delete s[o][e.i],"removeEventListener"in t&&t.removeEventListener(g(e.e),e.proxy,m(e,r))})})}function j(e,i){return(i||!e.isDefaultPrevented)&&(i||(i=e),t.each(E,function(t,n){var r=i[t];e[t]=function(){return this[n]=x,r&&r.apply(i,arguments)},e[n]=b}),(i.defaultPrevented!==n?i.defaultPrevented:"returnValue"in i?i.returnValue===!1:i.getPreventDefault&&i.getPreventDefault())&&(e.isDefaultPrevented=x)),e}function T(t){var e,i={originalEvent:t};for(e in t)w.test(e)||t[e]===n||(i[e]=t[e]);return j(i,t)}var n,e=1,i=Array.prototype.slice,r=t.isFunction,o=function(t){return"string"==typeof t},s={},a={},u="onfocusin"in window,f={focus:"focusin",blur:"focusout"},c={mouseenter:"mouseover",mouseleave:"mouseout"};a.click=a.mousedown=a.mouseup=a.mousemove="MouseEvents",t.event={add:v,remove:y},t.proxy=function(e,n){if(r(e)){var i=function(){return e.apply(n,arguments)};return i._zid=l(e),i}if(o(n))return t.proxy(e[n],e);throw new TypeError("expected function")},t.fn.bind=function(t,e,n){return this.on(t,e,n)},t.fn.unbind=function(t,e){return this.off(t,e)},t.fn.one=function(t,e,n,i){return this.on(t,e,n,i,1)};var x=function(){return!0},b=function(){return!1},w=/^([A-Z]|returnValue$|layer[XY]$)/,E={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};t.fn.delegate=function(t,e,n){return this.on(e,t,n)},t.fn.undelegate=function(t,e,n){return this.off(e,t,n)},t.fn.live=function(e,n){return t(document.body).delegate(this.selector,e,n),this},t.fn.die=function(e,n){return t(document.body).undelegate(this.selector,e,n),this},t.fn.on=function(e,s,a,u,f){var c,l,h=this;return e&&!o(e)?(t.each(e,function(t,e){h.on(t,s,a,e,f)}),h):(o(s)||r(u)||u===!1||(u=a,a=s,s=n),(r(a)||a===!1)&&(u=a,a=n),u===!1&&(u=b),h.each(function(n,r){f&&(c=function(t){return y(r,t.type,u),u.apply(this,arguments)}),s&&(l=function(e){var n,o=t(e.target).closest(s,r).get(0);return o&&o!==r?(n=t.extend(T(e),{currentTarget:o,liveFired:r}),(c||u).apply(o,[n].concat(i.call(arguments,1)))):void 0}),v(r,e,u,a,s,l||c)}))},t.fn.off=function(e,i,s){var a=this;return e&&!o(e)?(t.each(e,function(t,e){a.off(t,i,e)}),a):(o(i)||r(s)||s===!1||(s=i,i=n),s===!1&&(s=b),a.each(function(){y(this,e,s,i)}))},t.fn.trigger=function(e,n){return e=o(e)||t.isPlainObject(e)?t.Event(e):j(e),e._args=n,this.each(function(){"dispatchEvent"in this?this.dispatchEvent(e):t(this).triggerHandler(e,n)})},t.fn.triggerHandler=function(e,n){var i,r;return this.each(function(s,a){i=T(o(e)?t.Event(e):e),i._args=n,i.target=a,t.each(h(a,e.type||e),function(t,e){return r=e.proxy(i),i.isImmediatePropagationStopped()?!1:void 0})}),r},"focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.trigger(e)}}),["focus","blur"].forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.each(function(){try{this[e]()}catch(t){}}),this}}),t.Event=function(t,e){o(t)||(e=t,t=e.type);var n=document.createEvent(a[t]||"Events"),i=!0;if(e)for(var r in e)"bubbles"==r?i=!!e[r]:n[r]=e[r];return n.initEvent(t,i,!0),j(n)}}(Zepto),function(t){function l(e,n,i){var r=t.Event(n);return t(e).trigger(r,i),!r.isDefaultPrevented()}function h(t,e,i,r){return t.global?l(e||n,i,r):void 0}function p(e){e.global&&0===t.active++&&h(e,null,"ajaxStart")}function d(e){e.global&&!--t.active&&h(e,null,"ajaxStop")}function m(t,e){var n=e.context;return e.beforeSend.call(n,t,e)===!1||h(e,n,"ajaxBeforeSend",[t,e])===!1?!1:void h(e,n,"ajaxSend",[t,e])}function g(t,e,n,i){var r=n.context,o="success";n.success.call(r,t,o,e),i&&i.resolveWith(r,[t,o,e]),h(n,r,"ajaxSuccess",[e,n,t]),y(o,e,n)}function v(t,e,n,i,r){var o=i.context;i.error.call(o,n,e,t),r&&r.rejectWith(o,[n,e,t]),h(i,o,"ajaxError",[n,i,t||e]),y(e,n,i)}function y(t,e,n){var i=n.context;n.complete.call(i,e,t),h(n,i,"ajaxComplete",[e,n]),d(n)}function x(){}function b(t){return t&&(t=t.split(";",2)[0]),t&&(t==f?"html":t==u?"json":s.test(t)?"script":a.test(t)&&"xml")||"text"}function w(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function E(e){e.processData&&e.data&&"string"!=t.type(e.data)&&(e.data=t.param(e.data,e.traditional)),!e.data||e.type&&"GET"!=e.type.toUpperCase()||(e.url=w(e.url,e.data),e.data=void 0)}function j(e,n,i,r){return t.isFunction(n)&&(r=i,i=n,n=void 0),t.isFunction(i)||(r=i,i=void 0),{url:e,data:n,success:i,dataType:r}}function S(e,n,i,r){var o,s=t.isArray(n),a=t.isPlainObject(n);t.each(n,function(n,u){o=t.type(u),r&&(n=i?r:r+"["+(a||"object"==o||"array"==o?n:"")+"]"),!r&&s?e.add(u.name,u.value):"array"==o||!i&&"object"==o?S(e,u,i,n):e.add(n,u)})}var i,r,e=0,n=window.document,o=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,s=/^(?:text|application)\/javascript/i,a=/^(?:text|application)\/xml/i,u="application/json",f="text/html",c=/^\s*$/;t.active=0,t.ajaxJSONP=function(i,r){if(!("type"in i))return t.ajax(i);var f,h,o=i.jsonpCallback,s=(t.isFunction(o)?o():o)||"jsonp"+ ++e,a=n.createElement("script"),u=window[s],c=function(e){t(a).triggerHandler("error",e||"abort")},l={abort:c};return r&&r.promise(l),t(a).on("load error",function(e,n){clearTimeout(h),t(a).off().remove(),"error"!=e.type&&f?g(f[0],l,i,r):v(null,n||"error",l,i,r),window[s]=u,f&&t.isFunction(u)&&u(f[0]),u=f=void 0}),m(l,i)===!1?(c("abort"),l):(window[s]=function(){f=arguments},a.src=i.url.replace(/\?(.+)=\?/,"?$1="+s),n.head.appendChild(a),i.timeout>0&&(h=setTimeout(function(){c("timeout")},i.timeout)),l)},t.ajaxSettings={type:"GET",beforeSend:x,success:x,error:x,complete:x,context:null,global:!0,xhr:function(){return new window.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:u,xml:"application/xml, text/xml",html:f,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0},t.ajax=function(e){var n=t.extend({},e||{}),o=t.Deferred&&t.Deferred();for(i in t.ajaxSettings)void 0===n[i]&&(n[i]=t.ajaxSettings[i]);p(n),n.crossDomain||(n.crossDomain=/^([\w-]+:)?\/\/([^\/]+)/.test(n.url)&&RegExp.$2!=window.location.host),n.url||(n.url=window.location.toString()),E(n),n.cache===!1&&(n.url=w(n.url,"_="+Date.now()));var s=n.dataType,a=/\?.+=\?/.test(n.url);if("jsonp"==s||a)return a||(n.url=w(n.url,n.jsonp?n.jsonp+"=?":n.jsonp===!1?"":"callback=?")),t.ajaxJSONP(n,o);var j,u=n.accepts[s],f={},l=function(t,e){f[t.toLowerCase()]=[t,e]},h=/^([\w-]+:)\/\//.test(n.url)?RegExp.$1:window.location.protocol,d=n.xhr(),y=d.setRequestHeader;if(o&&o.promise(d),n.crossDomain||l("X-Requested-With","XMLHttpRequest"),l("Accept",u||"*/*"),(u=n.mimeType||u)&&(u.indexOf(",")>-1&&(u=u.split(",",2)[0]),d.overrideMimeType&&d.overrideMimeType(u)),(n.contentType||n.contentType!==!1&&n.data&&"GET"!=n.type.toUpperCase())&&l("Content-Type",n.contentType||"application/x-www-form-urlencoded"),n.headers)for(r in n.headers)l(r,n.headers[r]);if(d.setRequestHeader=l,d.onreadystatechange=function(){if(4==d.readyState){d.onreadystatechange=x,clearTimeout(j);var e,i=!1;if(d.status>=200&&d.status<300||304==d.status||0==d.status&&"file:"==h){s=s||b(n.mimeType||d.getResponseHeader("content-type")),e=d.responseText;try{"script"==s?(1,eval)(e):"xml"==s?e=d.responseXML:"json"==s&&(e=c.test(e)?null:t.parseJSON(e))}catch(r){i=r}i?v(i,"parsererror",d,n,o):g(e,d,n,o)}else v(d.statusText||null,d.status?"error":"abort",d,n,o)}},m(d,n)===!1)return d.abort(),v(null,"abort",d,n,o),d;if(n.xhrFields)for(r in n.xhrFields)d[r]=n.xhrFields[r];var T="async"in n?n.async:!0;d.open(n.type,n.url,T,n.username,n.password);for(r in f)y.apply(d,f[r]);return n.timeout>0&&(j=setTimeout(function(){d.onreadystatechange=x,d.abort(),v(null,"timeout",d,n,o)},n.timeout)),d.send(n.data?n.data:null),d},t.get=function(){return t.ajax(j.apply(null,arguments))},t.post=function(){var e=j.apply(null,arguments);return e.type="POST",t.ajax(e)},t.getJSON=function(){var e=j.apply(null,arguments);return e.dataType="json",t.ajax(e)},t.fn.load=function(e,n,i){if(!this.length)return this;var a,r=this,s=e.split(/\s/),u=j(e,n,i),f=u.success;return s.length>1&&(u.url=s[0],a=s[1]),u.success=function(e){r.html(a?t("<div>").html(e.replace(o,"")).find(a):e),f&&f.apply(r,arguments)},t.ajax(u),this};var T=encodeURIComponent;t.param=function(t,e){var n=[];return n.add=function(t,e){this.push(T(t)+"="+T(e))},S(n,t,e),n.join("&").replace(/%20/g,"+")}}(Zepto),function(t){function n(e){var i=[["resolve","done",t.Callbacks({once:1,memory:1}),"resolved"],["reject","fail",t.Callbacks({once:1,memory:1}),"rejected"],["notify","progress",t.Callbacks({memory:1})]],r="pending",o={state:function(){return r},always:function(){return s.done(arguments).fail(arguments),this},then:function(){var e=arguments;return n(function(n){t.each(i,function(i,r){var a=t.isFunction(e[i])&&e[i];s[r[1]](function(){var e=a&&a.apply(this,arguments);if(e&&t.isFunction(e.promise))e.promise().done(n.resolve).fail(n.reject).progress(n.notify);else{var i=this===o?n.promise():this,s=a?[e]:arguments;n[r[0]+"With"](i,s)}})}),e=null}).promise()},promise:function(e){return null!=e?t.extend(e,o):o}},s={};return t.each(i,function(t,e){var n=e[2],a=e[3];o[e[1]]=n.add,a&&n.add(function(){r=a},i[1^t][2].disable,i[2][2].lock),s[e[0]]=function(){return s[e[0]+"With"](this===s?o:this,arguments),this},s[e[0]+"With"]=n.fireWith}),o.promise(s),e&&e.call(s,s),s}var e=Array.prototype.slice;t.when=function(i){var f,c,l,r=e.call(arguments),o=r.length,s=0,a=1!==o||i&&t.isFunction(i.promise)?o:0,u=1===a?i:n(),h=function(t,n,i){return function(r){n[t]=this,i[t]=arguments.length>1?e.call(arguments):r,i===f?u.notifyWith(n,i):--a||u.resolveWith(n,i)}};if(o>1)for(f=new Array(o),c=new Array(o),l=new Array(o);o>s;++s)r[s]&&t.isFunction(r[s].promise)?r[s].promise().done(h(s,l,r)).fail(u.reject).progress(h(s,c,f)):--a;return a||u.resolveWith(l,r),u.promise()},t.Deferred=n}(Zepto),function(t){t.Callbacks=function(e){e=t.extend({},e);var n,i,r,o,s,a,u=[],f=!e.once&&[],c=function(t){for(n=e.memory&&t,i=!0,a=o||0,o=0,s=u.length,r=!0;u&&s>a;++a)if(u[a].apply(t[0],t[1])===!1&&e.stopOnFalse){n=!1;break}r=!1,u&&(f?f.length&&c(f.shift()):n?u.length=0:l.disable())},l={add:function(){if(u){var i=u.length,a=function(n){t.each(n,function(t,n){"function"==typeof n?e.unique&&l.has(n)||u.push(n):n&&n.length&&"string"!=typeof n&&a(n)})};a(arguments),r?s=u.length:n&&(o=i,c(n))}return this},remove:function(){return u&&t.each(arguments,function(e,n){for(var i;(i=t.inArray(n,u,i))>-1;)u.splice(i,1),r&&(s>=i&&--s,a>=i&&--a)}),this},has:function(e){return!(!u||!(e?t.inArray(e,u)>-1:u.length))},empty:function(){return s=u.length=0,this},disable:function(){return u=f=n=void 0,this},disabled:function(){return!u},lock:function(){return f=void 0,n||l.disable(),this},locked:function(){return!f},fireWith:function(t,e){return!u||i&&!f||(e=e||[],e=[t,e.slice?e.slice():e],r?f.push(e):c(e)),this},fire:function(){return l.fireWith(this,arguments)},fired:function(){return!!i}};return l}}(Zepto);

  root.$ = original$;
  root.Zepto = originalZepto;
  var monaca = root.monaca = root.monaca || {};
  monaca.cloud = monaca.cloud || {};

  monaca.cloud.timeout = 30000;
  monaca.cloud.url = '%%%CLOUD_HOST%%%';
  monaca.cloud.backendId = '%%%BACKEND_ID%%%';
  monaca.cloud.apiKey = '%%%BACKEND_API_KEY%%%';
  monaca.cloud.deviceId = null;
  monaca.cloud.postQueue = [];

  /**
   * @property {jQuery} .
   */
  monaca.cloud.$ = Zepto;

  var MonacaCloudError = (function() {
    function MonacaCloudError(code, message, data) {
      if (typeof data === "undefined") {
        data = {};
      }
      this.code = code;
      this.message = message;
      this.data = data;
    }
    return MonacaCloudError;
  })();

  /**
   * @class
   */
  monaca.cloud.Error = function(code, message, data) {
    return new MonacaCloudError(code, message, data);
  };

  /**
   * @param {Number} msec .
   */
  monaca.cloud.setTimeout = function(msec) {
    this.timeout = msec;
  };

  // Get device id
  document.addEventListener("deviceready", function() {

    cordova.exec(function(result) {
        monaca.cloud.deviceId = new String(result.deviceId);
        monaca.cloud.url = new String(result.url);
        monaca.cloud.backendId = new String(result.backendId);
        monaca.cloud.apiKey = new String(result.apiKey);

        // execute and clear postQueue
        for (var i = 0; i < monaca.cloud.postQueue.length; i++) {
          monaca.cloud._doPost.apply(monaca.cloud, monaca.cloud.postQueue[i]);
        }
        monaca.cloud.postQueue = [];
      }, function(error) {
        console.error(error);
      },

      "Monaca",
      "getRuntimeConfiguration", []
    );

  }, false);

  // Others
  monaca.cloud._post = function(method, params, dfd, ajaxOptions, beforeSuccess) {
    if (monaca.cloud.deviceId == null) {
      monaca.cloud.postQueue.push([method, params, dfd, ajaxOptions, beforeSuccess]);
    } else {
      monaca.cloud._doPost(method, params, dfd, ajaxOptions, beforeSuccess);
    }
  };

  monaca.cloud._doPost = function(method, params, dfd, ajaxOptions, beforeSuccess) {
    var $ = monaca.cloud.$;

    if (typeof(ajaxOptions) === 'undefined') ajaxOptions = {};
    if ((typeof(method) === 'undefined') && (typeof(params) === 'undefined')) {
      throw new Error('Invalid arguments');
    }

    params['__api_key'] = monaca.cloud.apiKey;
    params['__device'] = monaca.cloud.deviceId;
    var sid = monaca.cloud._getSessionId();
    if (sid.length > 0) {
      params['__session'] = sid;
    }
    var data = JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: '1'
    });

    var o = $.extend(true, {
      url: this.url + this.backendId,
      data: data,
      dataType: 'json',
      type: 'POST',
      timeout: this.timeout,
      success: function(jsonResponse, status, xhr) {
        var sessionHeader = xhr.getResponseHeader('X-Set-Monaca-Cloud-Session');
        if (sessionHeader) {
          monaca.cloud._setSessionId(sessionHeader);
        }

        if (typeof(jsonResponse.error) !== 'undefined') {
          // has error code
          dfd.reject(jsonResponse.error);
        } else {
          // success
          if (typeof(jsonResponse.result.loginToken) !== 'undefined') {
            localStorage.monacaCloudLoginToken = jsonResponse.result.loginToken;
          }
          if (typeof(beforeSuccess) !== 'undefined') {
            beforeSuccess(jsonResponse, status, xhr, dfd);
          }
          dfd.resolve(jsonResponse.result);
        }
      },
      error: function(xhr, status) {
        switch (status) {
          case 'timeout':
            var err = monaca.cloud.Error(-11, 'Connection timeout');
            break;
          case 'parsererror':
            var err = monaca.cloud.Error(-12, 'Invalid response');
            break;
          default:
            var err = monaca.cloud.Error(-13, 'Invalid status code');
        }
        dfd.reject(err);
      }
    }, ajaxOptions);

    $.ajax(o);
  };

  var _sessionId = '';

  monaca.cloud._getSessionId = function() {
    return _sessionId;
  };

  monaca.cloud._setSessionId = function(id) {
    if (typeof id != 'string') {
      id = '';
    }
    _sessionId = id;
  };

})(window);
/*
 * CollectionItem
 */
(function(root) {

  var monaca = root.monaca = root.monaca || {};
  monaca.cloud = monaca.cloud || {};
  var $ = monaca.cloud.$;

  /**
   * @class
   */
  MonacaCloudCollectionItem = (function() {

    function MonacaCloudCollectionItem(item, collection) {

      /**
       * @property {String} .
       */
      this._id = item._id;

      /**
       * @property {String} .
       */
      this._ownerUserOid = item._ownerUserOid;

      /**
       * @property {Date} .
       */
      this._createdAt = new Date(item._createdAt);

      /**
       * @property {Date} .
       */
      this._updatedAt = new Date(item._updatedAt);

      /**
       * @property {MonacaCloudCollection} .
       */
      this._collection = collection;


      for (var key in item) {
        if (key.substr(0, 1) != '_') {
          this[key] = item[key];
        }
      }
    }

    MonacaCloudCollectionItem.prototype = {

      /**
       * @return {$.Promise} .
       */
      update: function() {
        var dfd = new $.Deferred();
        var col = this._collection;
        var data = {};

        for (var key in this) {
          if (key.indexOf('_') !== 0) {
            data[key] = this[key];
          }
        }

        monaca.cloud._post('Collection.update', {
          collectionName: col.name,
          itemOid: this._id,
          data: data,
        }, dfd, {});

        return dfd.promise();
      },

      /**
       * @return {$.Promise} .
       */
      getPermission: function() {
        var dfd = new $.Deferred();
        var col = this._collection;

        monaca.cloud._post('Collection.getPermission', {
          collectionName: col.name,
          itemOid: this._id
        }, dfd, {});

        return dfd.promise();
      },

      /**
       * @param {Object} permission .
       * @param {Object} [options] .
       * @return {$.Promise} .
       */
      updatePermission: function(permission, options) {
        var dfd = new $.Deferred();
        var col = this._collection;

        if (typeof(options) === 'undefined') {
          options = {};
        }

        monaca.cloud._post('Collection.updatePermission', {
          collectionName: col.name,
          criteria: '_id == ?',
          bindParams: [this._id],
          permission: permission,
          options: options
        }, dfd, {});

        return dfd.promise();
      },

      /**
       * @return {$.Promise} .
       */
      remove: function() {
        var dfd = new $.Deferred();
        var col = this._collection;

        monaca.cloud._post('Collection.delete', {
          collectionName: col.name,
          itemOid: this._id,
        }, dfd, {});

        return dfd.promise();
      },

      'delete': function() {
        return this.remove();
      }

    };


    return MonacaCloudCollectionItem;
  })();

  monaca.cloud.CollectionItem = function(item, collection) {
    return new MonacaCloudCollectionItem(item, collection);
  };

})(window);
/*
 * Collection
 */
(function(root) {

  var monaca = root.monaca = root.monaca || {};
  monaca.cloud = monaca.cloud || {};
  var $ = monaca.cloud.$;

  /**
   * @class
   */
  MonacaCloudCollection = (function() {

    function MonacaCloudCollection(name) {
      this.name = name;
    }

    MonacaCloudCollection.prototype = {

      /**
       * @param {Object|Array} items .
       * @return {Array} result .
       */
      _makeCollectionItem: function(items) {
        var result = [];

        if (items instanceof Array) {
          for (var i = 0; i < items.length; i++) {
            result[i] = monaca.cloud.CollectionItem(items[i], this);
          }
        } else {
          result = monaca.cloud.CollectionItem(items, this);
        }

        return result;
      },

      /**
       * @param {Criteria|Array} criteria .
       */
      _validateCriteria: function(criteria) {
        if ((typeof(criteria) === 'undefined') || (typeof(criteria) === 'null')) {
          criteria = monaca.cloud.Criteria('');
        } else if (typeof(criteria) === 'string') {
          criteria = monaca.cloud.Criteria(criteria);
        }

        return criteria;
      },

      /**
       * @param {Object|Array} orderBy .
       * @param {Object} options .
       */
      _validateOptions: function(orderBy, options) {
        //if orderBy is hash, consider it as "options"
        if ((typeof(orderBy) === 'object') && (typeof(orderBy.length) === 'undefined')) {
          options = orderBy;
          if (typeof(options.orderBy) !== 'undefined') {
            orderBy = orderBy.orderBy;
          } else {
            orderBy = null;
          }
        }

        if (orderBy === '') {
          orderBy = null;
        }

        return {
          orderBy: orderBy,
          options: options
        };
      },

      /**
       * @param {Criteria|String} criteria .
       * @param {String|Array} [orderBy] .
       * @param {Object} [options] .
       * @return {$.Promise} .
       */
      find: function(criteria, orderBy, options) {
        var self = this;
        var dfd = new $.Deferred();

        criteria = self._validateCriteria(criteria);
        var o = self._validateOptions(orderBy, options);

        monaca.cloud._post('Collection.find', {
            collectionName: this.name,
            criteria: criteria.query,
            bindParams: criteria.bindParams,
            orderBy: o.orderBy,
            options: o.options
          }, dfd, {},
          function(e, status, xhr, dfd) {
            e.result.items = self._makeCollectionItem(e.result.items);
            dfd.resolve(e.result);
          });

        return dfd.promise();
      },

      /**
       * @param {Criteria|String} criteria .
       * @param {String|Array} [orderBy] .
       * @param {Object} [options] .
       * @return {$.Promise} .
       */
      findMine: function(criteria, orderBy, options) {
        var self = this;
        var dfd = new $.Deferred();

        criteria = self._validateCriteria(criteria);
        var o = self._validateOptions(orderBy, options);

        var userOid = monaca.cloud.User._oid;

        if (criteria.query != '') {
          criteria.query = '(' + criteria.query + ') && ';
        }
        if (userOid != null) {
          criteria.query += '(_ownerUserOid == ?)';
          criteria.bindParams.push(userOid);
        } else {
          criteria.query += '(_ownerDeviceOid == ?)';
          criteria.bindParams.push(monaca.cloud.deviceId);
        }

        monaca.cloud._post('Collection.find', {
            collectionName: this.name,
            criteria: criteria.query,
            bindParams: criteria.bindParams,
            orderBy: o.orderBy,
            options: o.options
          }, dfd, {},
          function(e, status, xhr, dfd) {
            e.result.items = self._makeCollectionItem(e.result.items);
            dfd.resolve(e.result);
          });

        return dfd.promise();
      },

      /**
       * @param {Criteria|String} criteria .
       * @param {String|Array} [orderBy] .
       * @param {Object} [options] .
       * @return {$.Promise} .
       */
      findOne: function(criteria, orderBy, options) {
        var self = this;
        var dfd = new $.Deferred();

        criteria = self._validateCriteria(criteria);
        var o = self._validateOptions(orderBy, options);

        monaca.cloud._post('Collection.find', {
            collectionName: this.name,
            criteria: criteria.query,
            bindParams: criteria.bindParams,
            orderBy: o.orderBy,
            options: o.options
          }, dfd, {},
          function(e, status, xhr, dfd) {
            var result = (e.result.totalItems > 0) ? self._makeCollectionItem(e.result.items[0]) : null;
            dfd.resolve(result);
          });

        return dfd.promise();
      },

      /**
       * @param {Criteria|String} criteria .
       * @param {String|Array} [orderBy] .
       * @param {Object} [options] .
       * @return {$.Promise} .
       */
      findOneMine: function(criteria, orderBy, options) {
        var self = this;
        var dfd = new $.Deferred();

        criteria = self._validateCriteria(criteria);
        var o = self._validateOptions(orderBy, options);

        var userOid = monaca.cloud.User._oid;

        if (criteria.query != '') {
          criteria.query = '(' + criteria.query + ') && ';
        }
        if (userOid != null) {
          criteria.query += '(_ownerUserOid == ?)';
          criteria.bindParams.push(userOid);
        } else {
          criteria.query += '(_ownerDeviceOid == ?)';
          criteria.bindParams.push(monaca.cloud.deviceId);
        }

        monaca.cloud._post('Collection.find', {
            collectionName: this.name,
            criteria: criteria.query,
            bindParams: criteria.bindParams,
            orderBy: o.orderBy,
            options: o.options
          }, dfd, {},
          function(e, status, xhr, dfd) {
            var result = (e.result.totalItems > 0) ? self._makeCollectionItem(e.result.items[0]) : null;
            dfd.resolve(result);
          });

        return dfd.promise();
      },

      /**
       * @param {Object} item .
       * @param {Object} [permission] .
       * @return {$.Promise} .
       */
      insert: function(item, permission) {
        var self = this;
        var dfd = new $.Deferred();

        if (typeof(permission) === 'undefined') {
          permission = {};
        }

        monaca.cloud._post('Collection.insert', {
            collectionName: this.name,
            item: item,
            permission: permission
          }, dfd, {},
          function(e, status, xhr, dfd) {
            var item = self._makeCollectionItem(e.result.item);
            dfd.resolve(item);
          });

        return dfd.promise();
      },

      /**
       * @param {Criteria|String} criteria .
       * @param {Object} permission .
       * @param {Object} [options] .
       * @return {$.Promise} .
       */
      updatePermission: function(criteria, permission, options) {
        var self = this;
        var dfd = new $.Deferred();

        criteria = self._validateCriteria(criteria);

        monaca.cloud._post('Collection.updatePermission', {
          collectionName: this.name,
          criteria: criteria.query,
          bindParams: criteria.bindParams,
          permission: permission,
          options: options
        }, dfd, {});

        return dfd.promise();
      }
    };

    return MonacaCloudCollection;
  })();


  monaca.cloud.Collection = function(name) {
    return new MonacaCloudCollection(name);
  };

})(window);
/*
 * Criteria
 */
(function(root) {

  var monaca = root.monaca = root.monaca || {};
  monaca.cloud = monaca.cloud || {};
  var $ = monaca.cloud.$;

  /**
   * @class
   */
  MonacaCloudCriteria = (function() {

    function MonacaCloudCriteria(query, bindParams) {
      this.query = query;
      this.bindParams = (typeof(bindParams) !== 'undefined') ? bindParams : [];
    }

    return MonacaCloudCriteria;
  })();


  monaca.cloud.Criteria = function(query, bindParams) {
    return new MonacaCloudCriteria(query, bindParams);
  };

})(window);
/*
 * Device
 */
(function(root) {

  var monaca = root.monaca = root.monaca || {};
  monaca.cloud = monaca.cloud || {};
  var $ = monaca.cloud.$;

  /**
   * @class
   */
  monaca.cloud.Device = {

    /**
     * @param {String} name .
     * @return {$.Promise} .
     */
    getProperty: function(name) {
      var dfd = new $.Deferred();

      monaca.cloud._post('Device.getProperties', {
          names: [name]
        }, dfd, {},
        function(e, status, xhr, dfd) {
          dfd.resolve(e.result.properties[name]);
        }
      );

      return dfd.promise();
    },

    /**
     * @param {Array} names .
     * @return {$.Promise} .
     */
    getProperties: function(names) {
      var dfd = new $.Deferred();

      monaca.cloud._post('Device.getProperties', {
          names: names
        }, dfd, {},
        function(e, status, xhr, dfd) {
          dfd.resolve(e.result.properties);
        }
      );

      return dfd.promise();
    },

    /**
     * @param {String} name .
     * @param {String} value .
     * @return {$.Promise} .
     */
    saveProperty: function(name, value) {
      var dfd = new $.Deferred();
      var param = {};

      if ((typeof(name) !== 'undefined') && (typeof(value) !== 'undefined')) {
        param = {
          properties: {}
        };
        param.properties[name] = value;
      }

      monaca.cloud._post('Device.saveProperties', param, dfd);

      return dfd.promise();
    },

    /**
     * @param {Object} properties .
     * @return {$.Promise} .
     */
    saveProperties: function(properties) {
      var dfd = new $.Deferred();
      var param = {};

      if (typeof(properties) !== 'undefined') param.properties = properties;
      monaca.cloud._post('Device.saveProperties', param, dfd);

      return dfd.promise();
    }

  };

})(window);
/*
 * Mailer
 */
(function(root) {

  var monaca = root.monaca = root.monaca || {};
  monaca.cloud = monaca.cloud || {};
  var $ = monaca.cloud.$;

  /**
   * @class
   */
  monaca.cloud.Mailer = {

    /**
     * @param {String} userOid .
     * @param {String} templateName .
     * @param {Object} substituteParams .
     * @param {Object} [options] .
     * @return {$.Promise} .
     */
    sendMail: function(userOid, templateName, substituteParams, options) {
      var dfd = new $.Deferred();

      if (typeof(options) === 'undefined') {
        options = {};
      }

      monaca.cloud._post('Mailer.sendMail', {
        userOid: userOid,
        templateName: templateName,
        substituteParams: substituteParams,
        options: options
      }, dfd);

      return dfd.promise();
    }
  };

})(window);
/*
 * User
 */
(function(root) {

  var monaca = root.monaca = root.monaca || {};
  monaca.cloud = monaca.cloud || {};
  var $ = monaca.cloud.$;

  /**
   * @class
   */
  monaca.cloud.User = (function() {


    return {

      _oid: null,

      /**
       * @return {Boolean} .
       */
      isAuthenticated: function() {
        return (this._oid === null) ? false : true;
      },


      /**
       * @param {String} username .
       * @param {String} password .
       * @param {Object} [properties] .
       * @return {$.Promise} .
       */
      register: function(username, password, properties) {
        var dfd = new $.Deferred();
        var self = this;

        if (typeof(properties) === 'undefined') properties = {};

        monaca.cloud._post('User.register', {
            username: username,
            password: password,
            properties: properties
          }, dfd, {},
          function(jsonResponse) {
            self._oid = jsonResponse.result.user._id;
          }
        );


        return dfd.promise();
      },

      /**
       * @param {String} username .
       * @param {Object} properties .
       * @return {$.Promise} .
       */
      validate: function(username, properties) {
        var dfd = new $.Deferred();

        monaca.cloud._post('User.validate', {
          username: username,
          properties: properties
        }, dfd);

        return dfd.promise();
      },

      /**
       * @param {String} password .
       * @return {$.Promise} .
       */
      unregister: function(password) {
        var self = this,
          dfd = new $.Deferred();

        monaca.cloud._post('User.unregister', {
            password: password
          }, dfd, {},
          function() {
            self._oid = null;
            monaca.cloud._setSessionId('');
            localStorage.removeItem('monacaCloudLoginToken');
          }
        );

        return dfd.promise();
      },

      /**
       * @param {String} username .
       * @param {String} password .
       * @return {$.Promise} .
       */
      login: function(username, password) {
        var self = this,
          dfd = new $.Deferred();

        monaca.cloud._post('User.login', {
            username: username,
            password: password
          }, dfd, {},
          function(jsonResponse) {
            self._oid = jsonResponse.result.user._id;
          }
        );

        return dfd.promise();
      },

      /**
       * @return {$.Promise} .
       */
      autoLogin: function() {
        var dfd = new $.Deferred();
        var token = localStorage.monacaCloudLoginToken || '';
        var self = this;

        monaca.cloud._post('User.autoLogin', {
            loginToken: token
          }, dfd, {},
          function(jsonResponse) {
            self._oid = jsonResponse.result.user._id;
          }
        );

        return dfd.promise();
      },

      /**
       * @return {$.Promise} .
       */
      logout: function() {
        var self = this,
          dfd = new $.Deferred();

        monaca.cloud._post('User.logout', {}, dfd, {},
          function() {
            self._oid = null;
            monaca.cloud._setSessionId('');
            localStorage.removeItem('monacaCloudLoginToken');
          }
        );

        return dfd.promise();
      },

      /**
       * @param {String} oldPassword .
       * @param {String} newPassword .
       * @return {$.Promise} .
       */
      updatePassword: function(oldPassword, newPassword) {
        var dfd = new $.Deferred();

        monaca.cloud._post('User.updatePassword', {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, dfd);

        return dfd.promise();
      },

      /**
       * @param {String} username .
       * @param {Object} options .
       * @return {$.Promise} .
       */
      sendPasswordResetToken: function(username, options) {
        var dfd = new $.Deferred();

        monaca.cloud._post('User.sendPasswordResetToken', {
          username: username,
          options: options
        }, dfd);

        return dfd.promise();
      },

      /**
       * @param {String} username .
       * @param {String} newPassword .
       * @param {String} token .
       * @return {$.Promise} .
       */
      resetPasswordAndLogin: function(username, newPassword, token) {
        var dfd = new $.Deferred();
        var self = this;

        monaca.cloud._post('User.resetPasswordAndLogin', {
            username: username,
            newPassword: newPassword,
            token: token
          }, dfd, {},
          function(jsonResponse) {
            self._oid = jsonResponse.result.user._id;
          }
        );

        return dfd.promise();
      },

      /**
       * @param {String} name .
       * @return {$.Promise} .
       */
      getProperty: function(name) {
        var dfd = new $.Deferred();

        monaca.cloud._post('User.getProperties', {
            names: [name]
          }, dfd, {},
          function(e, status, xhr, dfd) {
            dfd.resolve(e.result.properties[name]);
          }
        );

        return dfd.promise();
      },

      /**
       * @param {Array} names .
       * @return {$.Promise} .
       */
      getProperties: function(names) {
        var dfd = new $.Deferred();

        monaca.cloud._post('User.getProperties', {
            names: names
          }, dfd, {},
          function(e, status, xhr, dfd) {
            dfd.resolve(e.result.properties);
          }
        );

        return dfd.promise();
      },

      /**
       * @param {String} name .
       * @param {String} value .
       * @return {$.Promise} .
       */
      saveProperty: function(name, value) {
        var dfd = new $.Deferred();
        var param = {};

        if (typeof(name) !== 'undefined') {
          param = {
            properties: {}
          };
          param.properties[name] = value;
        }

        monaca.cloud._post('User.saveProperties', param, dfd);

        return dfd.promise();
      },

      /**
       * @param {Object} properties .
       * @return {$.Promise} .
       */
      saveProperties: function(properties) {
        var dfd = new $.Deferred();
        var param = {};

        if (typeof(properties) !== 'undefined') param.properties = properties;
        monaca.cloud._post('User.saveProperties', param, dfd);

        return dfd.promise();
      }

    };
  })();

})(window);

/*** <End:monaca-core-utils LoadJs:"components/monaca-core-utils/monaca-core-utils.js"> ***/
/*** <End:monaca-core-utils> ***/













/*** <Start:pixi> ***/
/*** <Start:pixi LoadJs:"components/pixi/bin/pixi.js"> ***/
/**
 * @license
 * pixi.js - v1.6.0
 * Copyright (c) 2012-2014, Mat Groves
 * http://goodboydigital.com/
 *
 * Compiled: 2014-07-18
 *
 * pixi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(){var a=this,b=b||{};b.WEBGL_RENDERER=0,b.CANVAS_RENDERER=1,b.VERSION="v1.6.1",b.blendModes={NORMAL:0,ADD:1,MULTIPLY:2,SCREEN:3,OVERLAY:4,DARKEN:5,LIGHTEN:6,COLOR_DODGE:7,COLOR_BURN:8,HARD_LIGHT:9,SOFT_LIGHT:10,DIFFERENCE:11,EXCLUSION:12,HUE:13,SATURATION:14,COLOR:15,LUMINOSITY:16},b.scaleModes={DEFAULT:0,LINEAR:0,NEAREST:1},b._UID=0,"undefined"!=typeof Float32Array?(b.Float32Array=Float32Array,b.Uint16Array=Uint16Array):(b.Float32Array=Array,b.Uint16Array=Array),b.INTERACTION_FREQUENCY=30,b.AUTO_PREVENT_DEFAULT=!0,b.RAD_TO_DEG=180/Math.PI,b.DEG_TO_RAD=Math.PI/180,b.dontSayHello=!1,b.sayHello=function(a){if(!b.dontSayHello){if(navigator.userAgent.toLowerCase().indexOf("chrome")>-1){var c=["%c %c %c Pixi.js "+b.VERSION+" - "+a+"  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ ","background: #ff66a5","background: #ff66a5","color: #ff66a5; background: #030307;","background: #ff66a5","background: #ffc3dc","background: #ff66a5","color: #ff2424; background: #fff","color: #ff2424; background: #fff","color: #ff2424; background: #fff"];console.log.apply(console,c)}else window.console&&console.log("Pixi.js "+b.VERSION+" - http://www.pixijs.com/");b.dontSayHello=!0}},b.Point=function(a,b){this.x=a||0,this.y=b||0},b.Point.prototype.clone=function(){return new b.Point(this.x,this.y)},b.Point.prototype.set=function(a,b){this.x=a||0,this.y=b||(0!==b?this.x:0)},b.Point.prototype.constructor=b.Point,b.Rectangle=function(a,b,c,d){this.x=a||0,this.y=b||0,this.width=c||0,this.height=d||0},b.Rectangle.prototype.clone=function(){return new b.Rectangle(this.x,this.y,this.width,this.height)},b.Rectangle.prototype.contains=function(a,b){if(this.width<=0||this.height<=0)return!1;var c=this.x;if(a>=c&&a<=c+this.width){var d=this.y;if(b>=d&&b<=d+this.height)return!0}return!1},b.Rectangle.prototype.constructor=b.Rectangle,b.EmptyRectangle=new b.Rectangle(0,0,0,0),b.Polygon=function(a){if(a instanceof Array||(a=Array.prototype.slice.call(arguments)),"number"==typeof a[0]){for(var c=[],d=0,e=a.length;e>d;d+=2)c.push(new b.Point(a[d],a[d+1]));a=c}this.points=a},b.Polygon.prototype.clone=function(){for(var a=[],c=0;c<this.points.length;c++)a.push(this.points[c].clone());return new b.Polygon(a)},b.Polygon.prototype.contains=function(a,b){for(var c=!1,d=0,e=this.points.length-1;d<this.points.length;e=d++){var f=this.points[d].x,g=this.points[d].y,h=this.points[e].x,i=this.points[e].y,j=g>b!=i>b&&(h-f)*(b-g)/(i-g)+f>a;j&&(c=!c)}return c},b.Polygon.prototype.constructor=b.Polygon,b.Circle=function(a,b,c){this.x=a||0,this.y=b||0,this.radius=c||0},b.Circle.prototype.clone=function(){return new b.Circle(this.x,this.y,this.radius)},b.Circle.prototype.contains=function(a,b){if(this.radius<=0)return!1;var c=this.x-a,d=this.y-b,e=this.radius*this.radius;return c*=c,d*=d,e>=c+d},b.Circle.prototype.getBounds=function(){return new b.Rectangle(this.x-this.radius,this.y-this.radius,this.width,this.height)},b.Circle.prototype.constructor=b.Circle,b.Ellipse=function(a,b,c,d){this.x=a||0,this.y=b||0,this.width=c||0,this.height=d||0},b.Ellipse.prototype.clone=function(){return new b.Ellipse(this.x,this.y,this.width,this.height)},b.Ellipse.prototype.contains=function(a,b){if(this.width<=0||this.height<=0)return!1;var c=(a-this.x)/this.width,d=(b-this.y)/this.height;return c*=c,d*=d,1>=c+d},b.Ellipse.prototype.getBounds=function(){return new b.Rectangle(this.x-this.width,this.y-this.height,this.width,this.height)},b.Ellipse.prototype.constructor=b.Ellipse,b.Matrix=function(){this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0},b.Matrix.prototype.fromArray=function(a){this.a=a[0],this.b=a[1],this.c=a[3],this.d=a[4],this.tx=a[2],this.ty=a[5]},b.Matrix.prototype.toArray=function(a){this.array||(this.array=new Float32Array(9));var b=this.array;return a?(b[0]=this.a,b[1]=this.c,b[2]=0,b[3]=this.b,b[4]=this.d,b[5]=0,b[6]=this.tx,b[7]=this.ty,b[8]=1):(b[0]=this.a,b[1]=this.b,b[2]=this.tx,b[3]=this.c,b[4]=this.d,b[5]=this.ty,b[6]=0,b[7]=0,b[8]=1),b},b.identityMatrix=new b.Matrix,b.determineMatrixArrayType=function(){return"undefined"!=typeof Float32Array?Float32Array:Array},b.Matrix2=b.determineMatrixArrayType(),b.DisplayObject=function(){this.position=new b.Point,this.scale=new b.Point(1,1),this.pivot=new b.Point(0,0),this.rotation=0,this.alpha=1,this.visible=!0,this.hitArea=null,this.buttonMode=!1,this.renderable=!1,this.parent=null,this.stage=null,this.worldAlpha=1,this._interactive=!1,this.defaultCursor="pointer",this.worldTransform=new b.Matrix,this.color=[],this.dynamic=!0,this._sr=0,this._cr=1,this.filterArea=null,this._bounds=new b.Rectangle(0,0,1,1),this._currentBounds=null,this._mask=null,this._cacheAsBitmap=!1,this._cacheIsDirty=!1},b.DisplayObject.prototype.constructor=b.DisplayObject,b.DisplayObject.prototype.setInteractive=function(a){this.interactive=a},Object.defineProperty(b.DisplayObject.prototype,"interactive",{get:function(){return this._interactive},set:function(a){this._interactive=a,this.stage&&(this.stage.dirty=!0)}}),Object.defineProperty(b.DisplayObject.prototype,"worldVisible",{get:function(){var a=this;do{if(!a.visible)return!1;a=a.parent}while(a);return!0}}),Object.defineProperty(b.DisplayObject.prototype,"mask",{get:function(){return this._mask},set:function(a){this._mask&&(this._mask.isMask=!1),this._mask=a,this._mask&&(this._mask.isMask=!0)}}),Object.defineProperty(b.DisplayObject.prototype,"filters",{get:function(){return this._filters},set:function(a){if(a){for(var b=[],c=0;c<a.length;c++)for(var d=a[c].passes,e=0;e<d.length;e++)b.push(d[e]);this._filterBlock={target:this,filterPasses:b}}this._filters=a}}),Object.defineProperty(b.DisplayObject.prototype,"cacheAsBitmap",{get:function(){return this._cacheAsBitmap},set:function(a){this._cacheAsBitmap!==a&&(a?this._generateCachedSprite():this._destroyCachedSprite(),this._cacheAsBitmap=a)}}),b.DisplayObject.prototype.updateTransform=function(){this.rotation!==this.rotationCache&&(this.rotationCache=this.rotation,this._sr=Math.sin(this.rotation),this._cr=Math.cos(this.rotation));var a=this.parent.worldTransform,b=this.worldTransform,c=this.pivot.x,d=this.pivot.y,e=this._cr*this.scale.x,f=-this._sr*this.scale.y,g=this._sr*this.scale.x,h=this._cr*this.scale.y,i=this.position.x-e*c-d*f,j=this.position.y-h*d-c*g,k=a.a,l=a.b,m=a.c,n=a.d;b.a=k*e+l*g,b.b=k*f+l*h,b.tx=k*i+l*j+a.tx,b.c=m*e+n*g,b.d=m*f+n*h,b.ty=m*i+n*j+a.ty,this.worldAlpha=this.alpha*this.parent.worldAlpha},b.DisplayObject.prototype.getBounds=function(a){return a=a,b.EmptyRectangle},b.DisplayObject.prototype.getLocalBounds=function(){return this.getBounds(b.identityMatrix)},b.DisplayObject.prototype.setStageReference=function(a){this.stage=a,this._interactive&&(this.stage.dirty=!0)},b.DisplayObject.prototype.generateTexture=function(a){var c=this.getLocalBounds(),d=new b.RenderTexture(0|c.width,0|c.height,a);return d.render(this,new b.Point(-c.x,-c.y)),d},b.DisplayObject.prototype.updateCache=function(){this._generateCachedSprite()},b.DisplayObject.prototype._renderCachedSprite=function(a){this._cachedSprite.worldAlpha=this.worldAlpha,a.gl?b.Sprite.prototype._renderWebGL.call(this._cachedSprite,a):b.Sprite.prototype._renderCanvas.call(this._cachedSprite,a)},b.DisplayObject.prototype._generateCachedSprite=function(){this._cacheAsBitmap=!1;var a=this.getLocalBounds();if(this._cachedSprite)this._cachedSprite.texture.resize(0|a.width,0|a.height);else{var c=new b.RenderTexture(0|a.width,0|a.height);this._cachedSprite=new b.Sprite(c),this._cachedSprite.worldTransform=this.worldTransform}var d=this._filters;this._filters=null,this._cachedSprite.filters=d,this._cachedSprite.texture.render(this,new b.Point(-a.x,-a.y)),this._cachedSprite.anchor.x=-(a.x/a.width),this._cachedSprite.anchor.y=-(a.y/a.height),this._filters=d,this._cacheAsBitmap=!0},b.DisplayObject.prototype._destroyCachedSprite=function(){this._cachedSprite&&(this._cachedSprite.texture.destroy(!0),this._cachedSprite=null)},b.DisplayObject.prototype._renderWebGL=function(a){a=a},b.DisplayObject.prototype._renderCanvas=function(a){a=a},Object.defineProperty(b.DisplayObject.prototype,"x",{get:function(){return this.position.x},set:function(a){this.position.x=a}}),Object.defineProperty(b.DisplayObject.prototype,"y",{get:function(){return this.position.y},set:function(a){this.position.y=a}}),b.DisplayObjectContainer=function(){b.DisplayObject.call(this),this.children=[]},b.DisplayObjectContainer.prototype=Object.create(b.DisplayObject.prototype),b.DisplayObjectContainer.prototype.constructor=b.DisplayObjectContainer,Object.defineProperty(b.DisplayObjectContainer.prototype,"width",{get:function(){return this.scale.x*this.getLocalBounds().width},set:function(a){var b=this.getLocalBounds().width;this.scale.x=0!==b?a/(b/this.scale.x):1,this._width=a}}),Object.defineProperty(b.DisplayObjectContainer.prototype,"height",{get:function(){return this.scale.y*this.getLocalBounds().height},set:function(a){var b=this.getLocalBounds().height;this.scale.y=0!==b?a/(b/this.scale.y):1,this._height=a}}),b.DisplayObjectContainer.prototype.addChild=function(a){return this.addChildAt(a,this.children.length)},b.DisplayObjectContainer.prototype.addChildAt=function(a,b){if(b>=0&&b<=this.children.length)return a.parent&&a.parent.removeChild(a),a.parent=this,this.children.splice(b,0,a),this.stage&&a.setStageReference(this.stage),a;throw new Error(a+" The index "+b+" supplied is out of bounds "+this.children.length)},b.DisplayObjectContainer.prototype.swapChildren=function(a,b){if(a!==b){var c=this.children.indexOf(a),d=this.children.indexOf(b);if(0>c||0>d)throw new Error("swapChildren: Both the supplied DisplayObjects must be a child of the caller.");this.children[c]=b,this.children[d]=a}},b.DisplayObjectContainer.prototype.getChildAt=function(a){if(a>=0&&a<this.children.length)return this.children[a];throw new Error("Supplied index does not exist in the child list, or the supplied DisplayObject must be a child of the caller")},b.DisplayObjectContainer.prototype.removeChild=function(a){return this.removeChildAt(this.children.indexOf(a))},b.DisplayObjectContainer.prototype.removeChildAt=function(a){var b=this.getChildAt(a);return this.stage&&b.removeStageReference(),b.parent=void 0,this.children.splice(a,1),b},b.DisplayObjectContainer.prototype.removeChildren=function(a,b){var c=a||0,d="number"==typeof b?b:this.children.length,e=d-c;if(e>0&&d>=e){for(var f=this.children.splice(c,e),g=0;g<f.length;g++){var h=f[g];this.stage&&h.removeStageReference(),h.parent=void 0}return f}throw new Error("Range Error, numeric values are outside the acceptable range")},b.DisplayObjectContainer.prototype.updateTransform=function(){if(this.visible&&(b.DisplayObject.prototype.updateTransform.call(this),!this._cacheAsBitmap))for(var a=0,c=this.children.length;c>a;a++)this.children[a].updateTransform()},b.DisplayObjectContainer.prototype.getBounds=function(a){if(0===this.children.length)return b.EmptyRectangle;if(a){var c=this.worldTransform;this.worldTransform=a,this.updateTransform(),this.worldTransform=c}for(var d,e,f,g=1/0,h=1/0,i=-1/0,j=-1/0,k=!1,l=0,m=this.children.length;m>l;l++){var n=this.children[l];n.visible&&(k=!0,d=this.children[l].getBounds(a),g=g<d.x?g:d.x,h=h<d.y?h:d.y,e=d.width+d.x,f=d.height+d.y,i=i>e?i:e,j=j>f?j:f)}if(!k)return b.EmptyRectangle;var o=this._bounds;return o.x=g,o.y=h,o.width=i-g,o.height=j-h,o},b.DisplayObjectContainer.prototype.getLocalBounds=function(){var a=this.worldTransform;this.worldTransform=b.identityMatrix;for(var c=0,d=this.children.length;d>c;c++)this.children[c].updateTransform();var e=this.getBounds();return this.worldTransform=a,e},b.DisplayObjectContainer.prototype.setStageReference=function(a){this.stage=a,this._interactive&&(this.stage.dirty=!0);for(var b=0,c=this.children.length;c>b;b++){var d=this.children[b];d.setStageReference(a)}},b.DisplayObjectContainer.prototype.removeStageReference=function(){for(var a=0,b=this.children.length;b>a;a++){var c=this.children[a];c.removeStageReference()}this._interactive&&(this.stage.dirty=!0),this.stage=null},b.DisplayObjectContainer.prototype._renderWebGL=function(a){if(this.visible&&!(this.alpha<=0)){if(this._cacheAsBitmap)return this._renderCachedSprite(a),void 0;var b,c;if(this._mask||this._filters){for(this._filters&&(a.spriteBatch.flush(),a.filterManager.pushFilter(this._filterBlock)),this._mask&&(a.spriteBatch.stop(),a.maskManager.pushMask(this.mask,a),a.spriteBatch.start()),b=0,c=this.children.length;c>b;b++)this.children[b]._renderWebGL(a);a.spriteBatch.stop(),this._mask&&a.maskManager.popMask(this._mask,a),this._filters&&a.filterManager.popFilter(),a.spriteBatch.start()}else for(b=0,c=this.children.length;c>b;b++)this.children[b]._renderWebGL(a)}},b.DisplayObjectContainer.prototype._renderCanvas=function(a){if(this.visible!==!1&&0!==this.alpha){if(this._cacheAsBitmap)return this._renderCachedSprite(a),void 0;this._mask&&a.maskManager.pushMask(this._mask,a.context);for(var b=0,c=this.children.length;c>b;b++){var d=this.children[b];d._renderCanvas(a)}this._mask&&a.maskManager.popMask(a.context)}},b.Sprite=function(a){b.DisplayObjectContainer.call(this),this.anchor=new b.Point,this.texture=a,this._width=0,this._height=0,this.tint=16777215,this.blendMode=b.blendModes.NORMAL,a.baseTexture.hasLoaded?this.onTextureUpdate():(this.onTextureUpdateBind=this.onTextureUpdate.bind(this),this.texture.addEventListener("update",this.onTextureUpdateBind)),this.renderable=!0},b.Sprite.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Sprite.prototype.constructor=b.Sprite,Object.defineProperty(b.Sprite.prototype,"width",{get:function(){return this.scale.x*this.texture.frame.width},set:function(a){this.scale.x=a/this.texture.frame.width,this._width=a}}),Object.defineProperty(b.Sprite.prototype,"height",{get:function(){return this.scale.y*this.texture.frame.height},set:function(a){this.scale.y=a/this.texture.frame.height,this._height=a}}),b.Sprite.prototype.setTexture=function(a){this.texture=a,this.cachedTint=16777215},b.Sprite.prototype.onTextureUpdate=function(){this._width&&(this.scale.x=this._width/this.texture.frame.width),this._height&&(this.scale.y=this._height/this.texture.frame.height)},b.Sprite.prototype.getBounds=function(a){var b=this.texture.frame.width,c=this.texture.frame.height,d=b*(1-this.anchor.x),e=b*-this.anchor.x,f=c*(1-this.anchor.y),g=c*-this.anchor.y,h=a||this.worldTransform,i=h.a,j=h.c,k=h.b,l=h.d,m=h.tx,n=h.ty,o=i*e+k*g+m,p=l*g+j*e+n,q=i*d+k*g+m,r=l*g+j*d+n,s=i*d+k*f+m,t=l*f+j*d+n,u=i*e+k*f+m,v=l*f+j*e+n,w=-1/0,x=-1/0,y=1/0,z=1/0;y=y>o?o:y,y=y>q?q:y,y=y>s?s:y,y=y>u?u:y,z=z>p?p:z,z=z>r?r:z,z=z>t?t:z,z=z>v?v:z,w=o>w?o:w,w=q>w?q:w,w=s>w?s:w,w=u>w?u:w,x=p>x?p:x,x=r>x?r:x,x=t>x?t:x,x=v>x?v:x;var A=this._bounds;return A.x=y,A.width=w-y,A.y=z,A.height=x-z,this._currentBounds=A,A},b.Sprite.prototype._renderWebGL=function(a){if(this.visible&&!(this.alpha<=0)){var b,c;if(this._mask||this._filters){var d=a.spriteBatch;for(this._filters&&(d.flush(),a.filterManager.pushFilter(this._filterBlock)),this._mask&&(d.stop(),a.maskManager.pushMask(this.mask,a),d.start()),d.render(this),b=0,c=this.children.length;c>b;b++)this.children[b]._renderWebGL(a);d.stop(),this._mask&&a.maskManager.popMask(this._mask,a),this._filters&&a.filterManager.popFilter(),d.start()}else for(a.spriteBatch.render(this),b=0,c=this.children.length;c>b;b++)this.children[b]._renderWebGL(a)}},b.Sprite.prototype._renderCanvas=function(a){if(this.visible!==!1&&0!==this.alpha){if(this.blendMode!==a.currentBlendMode&&(a.currentBlendMode=this.blendMode,a.context.globalCompositeOperation=b.blendModesCanvas[a.currentBlendMode]),this._mask&&a.maskManager.pushMask(this._mask,a.context),this.texture.valid){a.context.globalAlpha=this.worldAlpha,a.roundPixels?a.context.setTransform(this.worldTransform.a,this.worldTransform.c,this.worldTransform.b,this.worldTransform.d,0|this.worldTransform.tx,0|this.worldTransform.ty):a.context.setTransform(this.worldTransform.a,this.worldTransform.c,this.worldTransform.b,this.worldTransform.d,this.worldTransform.tx,this.worldTransform.ty),a.smoothProperty&&a.scaleMode!==this.texture.baseTexture.scaleMode&&(a.scaleMode=this.texture.baseTexture.scaleMode,a.context[a.smoothProperty]=a.scaleMode===b.scaleModes.LINEAR);var c=this.texture.trim?this.texture.trim.x-this.anchor.x*this.texture.trim.width:this.anchor.x*-this.texture.frame.width,d=this.texture.trim?this.texture.trim.y-this.anchor.y*this.texture.trim.height:this.anchor.y*-this.texture.frame.height;16777215!==this.tint?(this.cachedTint!==this.tint&&(this.cachedTint=this.tint,this.tintedTexture=b.CanvasTinter.getTintedTexture(this,this.tint)),a.context.drawImage(this.tintedTexture,0,0,this.texture.crop.width,this.texture.crop.height,c,d,this.texture.crop.width,this.texture.crop.height)):a.context.drawImage(this.texture.baseTexture.source,this.texture.crop.x,this.texture.crop.y,this.texture.crop.width,this.texture.crop.height,c,d,this.texture.crop.width,this.texture.crop.height)}for(var e=0,f=this.children.length;f>e;e++)this.children[e]._renderCanvas(a);this._mask&&a.maskManager.popMask(a.context)}},b.Sprite.fromFrame=function(a){var c=b.TextureCache[a];if(!c)throw new Error('The frameId "'+a+'" does not exist in the texture cache'+this);return new b.Sprite(c)},b.Sprite.fromImage=function(a,c,d){var e=b.Texture.fromImage(a,c,d);return new b.Sprite(e)},b.SpriteBatch=function(a){b.DisplayObjectContainer.call(this),this.textureThing=a,this.ready=!1},b.SpriteBatch.prototype=Object.create(b.DisplayObjectContainer.prototype),b.SpriteBatch.constructor=b.SpriteBatch,b.SpriteBatch.prototype.initWebGL=function(a){this.fastSpriteBatch=new b.WebGLFastSpriteBatch(a),this.ready=!0},b.SpriteBatch.prototype.updateTransform=function(){b.DisplayObject.prototype.updateTransform.call(this)},b.SpriteBatch.prototype._renderWebGL=function(a){!this.visible||this.alpha<=0||!this.children.length||(this.ready||this.initWebGL(a.gl),a.spriteBatch.stop(),a.shaderManager.setShader(a.shaderManager.fastShader),this.fastSpriteBatch.begin(this,a),this.fastSpriteBatch.render(this),a.spriteBatch.start())},b.SpriteBatch.prototype._renderCanvas=function(a){var c=a.context;c.globalAlpha=this.worldAlpha,b.DisplayObject.prototype.updateTransform.call(this);for(var d=this.worldTransform,e=!0,f=0;f<this.children.length;f++){var g=this.children[f];if(g.visible){var h=g.texture,i=h.frame;if(c.globalAlpha=this.worldAlpha*g.alpha,g.rotation%(2*Math.PI)===0)e&&(c.setTransform(d.a,d.c,d.b,d.d,d.tx,d.ty),e=!1),c.drawImage(h.baseTexture.source,i.x,i.y,i.width,i.height,g.anchor.x*-i.width*g.scale.x+g.position.x+.5|0,g.anchor.y*-i.height*g.scale.y+g.position.y+.5|0,i.width*g.scale.x,i.height*g.scale.y);else{e||(e=!0),b.DisplayObject.prototype.updateTransform.call(g);var j=g.worldTransform;a.roundPixels?c.setTransform(j.a,j.c,j.b,j.d,0|j.tx,0|j.ty):c.setTransform(j.a,j.c,j.b,j.d,j.tx,j.ty),c.drawImage(h.baseTexture.source,i.x,i.y,i.width,i.height,g.anchor.x*-i.width+.5|0,g.anchor.y*-i.height+.5|0,i.width,i.height)}}}},b.MovieClip=function(a){b.Sprite.call(this,a[0]),this.textures=a,this.animationSpeed=1,this.loop=!0,this.onComplete=null,this.currentFrame=0,this.playing=!1},b.MovieClip.prototype=Object.create(b.Sprite.prototype),b.MovieClip.prototype.constructor=b.MovieClip,Object.defineProperty(b.MovieClip.prototype,"totalFrames",{get:function(){return this.textures.length}}),b.MovieClip.prototype.stop=function(){this.playing=!1},b.MovieClip.prototype.play=function(){this.playing=!0},b.MovieClip.prototype.gotoAndStop=function(a){this.playing=!1,this.currentFrame=a;var b=this.currentFrame+.5|0;this.setTexture(this.textures[b%this.textures.length])},b.MovieClip.prototype.gotoAndPlay=function(a){this.currentFrame=a,this.playing=!0},b.MovieClip.prototype.updateTransform=function(){if(b.Sprite.prototype.updateTransform.call(this),this.playing){this.currentFrame+=this.animationSpeed;var a=this.currentFrame+.5|0;this.currentFrame=this.currentFrame%this.textures.length,this.loop||a<this.textures.length?this.setTexture(this.textures[a%this.textures.length]):a>=this.textures.length&&(this.gotoAndStop(this.textures.length-1),this.onComplete&&this.onComplete())}},b.MovieClip.fromFrames=function(a){for(var c=[],d=0;d<a.length;d++)c.push(new b.Texture.fromFrame(a[d]));return new b.MovieClip(c)},b.MovieClip.fromImages=function(a){for(var c=[],d=0;d<a.length;d++)c.push(new b.Texture.fromImage(a[d]));return new b.MovieClip(c)},b.FilterBlock=function(){this.visible=!0,this.renderable=!0},b.Text=function(a,c){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),b.Sprite.call(this,b.Texture.fromCanvas(this.canvas)),this.setText(a),this.setStyle(c)},b.Text.prototype=Object.create(b.Sprite.prototype),b.Text.prototype.constructor=b.Text,Object.defineProperty(b.Text.prototype,"width",{get:function(){return this.dirty&&(this.updateText(),this.dirty=!1),this.scale.x*this.texture.frame.width},set:function(a){this.scale.x=a/this.texture.frame.width,this._width=a}}),Object.defineProperty(b.Text.prototype,"height",{get:function(){return this.dirty&&(this.updateText(),this.dirty=!1),this.scale.y*this.texture.frame.height},set:function(a){this.scale.y=a/this.texture.frame.height,this._height=a}}),b.Text.prototype.setStyle=function(a){a=a||{},a.font=a.font||"bold 20pt Arial",a.fill=a.fill||"black",a.align=a.align||"left",a.stroke=a.stroke||"black",a.strokeThickness=a.strokeThickness||0,a.wordWrap=a.wordWrap||!1,a.wordWrapWidth=a.wordWrapWidth||100,a.wordWrapWidth=a.wordWrapWidth||100,a.dropShadow=a.dropShadow||!1,a.dropShadowAngle=a.dropShadowAngle||Math.PI/6,a.dropShadowDistance=a.dropShadowDistance||4,a.dropShadowColor=a.dropShadowColor||"black",this.style=a,this.dirty=!0},b.Text.prototype.setText=function(a){this.text=a.toString()||" ",this.dirty=!0},b.Text.prototype.updateText=function(){this.context.font=this.style.font;var a=this.text;this.style.wordWrap&&(a=this.wordWrap(this.text));for(var b=a.split(/(?:\r\n|\r|\n)/),c=[],d=0,e=0;e<b.length;e++){var f=this.context.measureText(b[e]).width;c[e]=f,d=Math.max(d,f)}var g=d+this.style.strokeThickness;this.style.dropShadow&&(g+=this.style.dropShadowDistance),this.canvas.width=g+this.context.lineWidth;var h=this.determineFontHeight("font: "+this.style.font+";")+this.style.strokeThickness,i=h*b.length;this.style.dropShadow&&(i+=this.style.dropShadowDistance),this.canvas.height=i,navigator.isCocoonJS&&this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.context.font=this.style.font,this.context.strokeStyle=this.style.stroke,this.context.lineWidth=this.style.strokeThickness,this.context.textBaseline="top";var j,k;if(this.style.dropShadow){this.context.fillStyle=this.style.dropShadowColor;var l=Math.sin(this.style.dropShadowAngle)*this.style.dropShadowDistance,m=Math.cos(this.style.dropShadowAngle)*this.style.dropShadowDistance;for(e=0;e<b.length;e++)j=this.style.strokeThickness/2,k=this.style.strokeThickness/2+e*h,"right"===this.style.align?j+=d-c[e]:"center"===this.style.align&&(j+=(d-c[e])/2),this.style.fill&&this.context.fillText(b[e],j+l,k+m)}for(this.context.fillStyle=this.style.fill,e=0;e<b.length;e++)j=this.style.strokeThickness/2,k=this.style.strokeThickness/2+e*h,"right"===this.style.align?j+=d-c[e]:"center"===this.style.align&&(j+=(d-c[e])/2),this.style.stroke&&this.style.strokeThickness&&this.context.strokeText(b[e],j,k),this.style.fill&&this.context.fillText(b[e],j,k);this.updateTexture()},b.Text.prototype.updateTexture=function(){this.texture.baseTexture.width=this.canvas.width,this.texture.baseTexture.height=this.canvas.height,this.texture.crop.width=this.texture.frame.width=this.canvas.width,this.texture.crop.height=this.texture.frame.height=this.canvas.height,this._width=this.canvas.width,this._height=this.canvas.height,this.requiresUpdate=!0},b.Text.prototype._renderWebGL=function(a){this.requiresUpdate&&(this.requiresUpdate=!1,b.updateWebGLTexture(this.texture.baseTexture,a.gl)),b.Sprite.prototype._renderWebGL.call(this,a)},b.Text.prototype.updateTransform=function(){this.dirty&&(this.updateText(),this.dirty=!1),b.Sprite.prototype.updateTransform.call(this)},b.Text.prototype.determineFontHeight=function(a){var c=b.Text.heightCache[a];if(!c){var d=document.getElementsByTagName("body")[0],e=document.createElement("div"),f=document.createTextNode("M");e.appendChild(f),e.setAttribute("style",a+";position:absolute;top:0;left:0"),d.appendChild(e),c=e.offsetHeight,b.Text.heightCache[a]=c,d.removeChild(e)}return c},b.Text.prototype.wordWrap=function(a){for(var b="",c=a.split("\n"),d=0;d<c.length;d++){for(var e=this.style.wordWrapWidth,f=c[d].split(" "),g=0;g<f.length;g++){var h=this.context.measureText(f[g]).width,i=h+this.context.measureText(" ").width;0===g||i>e?(g>0&&(b+="\n"),b+=f[g],e=this.style.wordWrapWidth-h):(e-=i,b+=" "+f[g])}d<c.length-1&&(b+="\n")}return b},b.Text.prototype.destroy=function(a){this.context=null,this.canvas=null,this.texture.destroy(void 0===a?!0:a)},b.Text.heightCache={},b.BitmapText=function(a,c){b.DisplayObjectContainer.call(this),this._pool=[],this.setText(a),this.setStyle(c),this.updateText(),this.dirty=!1},b.BitmapText.prototype=Object.create(b.DisplayObjectContainer.prototype),b.BitmapText.prototype.constructor=b.BitmapText,b.BitmapText.prototype.setText=function(a){this.text=a||" ",this.dirty=!0},b.BitmapText.prototype.setStyle=function(a){a=a||{},a.align=a.align||"left",this.style=a;var c=a.font.split(" ");this.fontName=c[c.length-1],this.fontSize=c.length>=2?parseInt(c[c.length-2],10):b.BitmapText.fonts[this.fontName].size,this.dirty=!0,this.tint=a.tint},b.BitmapText.prototype.updateText=function(){for(var a=b.BitmapText.fonts[this.fontName],c=new b.Point,d=null,e=[],f=0,g=[],h=0,i=this.fontSize/a.size,j=0;j<this.text.length;j++){var k=this.text.charCodeAt(j);if(/(?:\r\n|\r|\n)/.test(this.text.charAt(j)))g.push(c.x),f=Math.max(f,c.x),h++,c.x=0,c.y+=a.lineHeight,d=null;else{var l=a.chars[k];l&&(d&&l[d]&&(c.x+=l.kerning[d]),e.push({texture:l.texture,line:h,charCode:k,position:new b.Point(c.x+l.xOffset,c.y+l.yOffset)}),c.x+=l.xAdvance,d=k)}}g.push(c.x),f=Math.max(f,c.x);var m=[];for(j=0;h>=j;j++){var n=0;"right"===this.style.align?n=f-g[j]:"center"===this.style.align&&(n=(f-g[j])/2),m.push(n)}var o=this.children.length,p=e.length,q=this.tint||16777215;for(j=0;p>j;j++){var r=o>j?this.children[j]:this._pool.pop();r?r.setTexture(e[j].texture):r=new b.Sprite(e[j].texture),r.position.x=(e[j].position.x+m[e[j].line])*i,r.position.y=e[j].position.y*i,r.scale.x=r.scale.y=i,r.tint=q,r.parent||this.addChild(r)}for(;this.children.length>p;){var s=this.getChildAt(this.children.length-1);this._pool.push(s),this.removeChild(s)}this.textWidth=f*i,this.textHeight=(c.y+a.lineHeight)*i},b.BitmapText.prototype.updateTransform=function(){this.dirty&&(this.updateText(),this.dirty=!1),b.DisplayObjectContainer.prototype.updateTransform.call(this)},b.BitmapText.fonts={},b.InteractionData=function(){this.global=new b.Point,this.target=null,this.originalEvent=null},b.InteractionData.prototype.getLocalPosition=function(a){var c=a.worldTransform,d=this.global,e=c.a,f=c.b,g=c.tx,h=c.c,i=c.d,j=c.ty,k=1/(e*i+f*-h);return new b.Point(i*k*d.x+-f*k*d.y+(j*f-g*i)*k,e*k*d.y+-h*k*d.x+(-j*e+g*h)*k)},b.InteractionData.prototype.constructor=b.InteractionData,b.InteractionManager=function(a){this.stage=a,this.mouse=new b.InteractionData,this.touchs={},this.tempPoint=new b.Point,this.mouseoverEnabled=!0,this.pool=[],this.interactiveItems=[],this.interactionDOMElement=null,this.onMouseMove=this.onMouseMove.bind(this),this.onMouseDown=this.onMouseDown.bind(this),this.onMouseOut=this.onMouseOut.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onTouchStart=this.onTouchStart.bind(this),this.onTouchEnd=this.onTouchEnd.bind(this),this.onTouchMove=this.onTouchMove.bind(this),this.last=0,this.currentCursorStyle="inherit",this.mouseOut=!1},b.InteractionManager.prototype.constructor=b.InteractionManager,b.InteractionManager.prototype.collectInteractiveSprite=function(a,b){for(var c=a.children,d=c.length,e=d-1;e>=0;e--){var f=c[e];f._interactive?(b.interactiveChildren=!0,this.interactiveItems.push(f),f.children.length>0&&this.collectInteractiveSprite(f,f)):(f.__iParent=null,f.children.length>0&&this.collectInteractiveSprite(f,b))}},b.InteractionManager.prototype.setTarget=function(a){this.target=a,null===this.interactionDOMElement&&this.setTargetDomElement(a.view)},b.InteractionManager.prototype.setTargetDomElement=function(a){this.removeEvents(),window.navigator.msPointerEnabled&&(a.style["-ms-content-zooming"]="none",a.style["-ms-touch-action"]="none"),this.interactionDOMElement=a,a.addEventListener("mousemove",this.onMouseMove,!0),a.addEventListener("mousedown",this.onMouseDown,!0),a.addEventListener("mouseout",this.onMouseOut,!0),a.addEventListener("touchstart",this.onTouchStart,!0),a.addEventListener("touchend",this.onTouchEnd,!0),a.addEventListener("touchmove",this.onTouchMove,!0),window.addEventListener("mouseup",this.onMouseUp,!0)},b.InteractionManager.prototype.removeEvents=function(){this.interactionDOMElement&&(this.interactionDOMElement.style["-ms-content-zooming"]="",this.interactionDOMElement.style["-ms-touch-action"]="",this.interactionDOMElement.removeEventListener("mousemove",this.onMouseMove,!0),this.interactionDOMElement.removeEventListener("mousedown",this.onMouseDown,!0),this.interactionDOMElement.removeEventListener("mouseout",this.onMouseOut,!0),this.interactionDOMElement.removeEventListener("touchstart",this.onTouchStart,!0),this.interactionDOMElement.removeEventListener("touchend",this.onTouchEnd,!0),this.interactionDOMElement.removeEventListener("touchmove",this.onTouchMove,!0),this.interactionDOMElement=null,window.removeEventListener("mouseup",this.onMouseUp,!0))},b.InteractionManager.prototype.update=function(){if(this.target){var a=Date.now(),c=a-this.last;if(c=c*b.INTERACTION_FREQUENCY/1e3,!(1>c)){this.last=a;var d=0;this.dirty&&this.rebuildInteractiveGraph();var e=this.interactiveItems.length,f="inherit",g=!1;for(d=0;e>d;d++){var h=this.interactiveItems[d];h.__hit=this.hitTest(h,this.mouse),this.mouse.target=h,h.__hit&&!g?(h.buttonMode&&(f=h.defaultCursor),h.interactiveChildren||(g=!0),h.__isOver||(h.mouseover&&h.mouseover(this.mouse),h.__isOver=!0)):h.__isOver&&(h.mouseout&&h.mouseout(this.mouse),h.__isOver=!1)}this.currentCursorStyle!==f&&(this.currentCursorStyle=f,this.interactionDOMElement.style.cursor=f)}}},b.InteractionManager.prototype.rebuildInteractiveGraph=function(){this.dirty=!1;for(var a=this.interactiveItems.length,b=0;a>b;b++)this.interactiveItems[b].interactiveChildren=!1;this.interactiveItems=[],this.stage.interactive&&this.interactiveItems.push(this.stage),this.collectInteractiveSprite(this.stage,this.stage)},b.InteractionManager.prototype.onMouseMove=function(a){this.dirty&&this.rebuildInteractiveGraph(),this.mouse.originalEvent=a||window.event;var b=this.interactionDOMElement.getBoundingClientRect();this.mouse.global.x=(a.clientX-b.left)*(this.target.width/b.width),this.mouse.global.y=(a.clientY-b.top)*(this.target.height/b.height);for(var c=this.interactiveItems.length,d=0;c>d;d++){var e=this.interactiveItems[d];e.mousemove&&e.mousemove(this.mouse)}},b.InteractionManager.prototype.onMouseDown=function(a){this.dirty&&this.rebuildInteractiveGraph(),this.mouse.originalEvent=a||window.event,b.AUTO_PREVENT_DEFAULT&&this.mouse.originalEvent.preventDefault();for(var c=this.interactiveItems.length,d=0;c>d;d++){var e=this.interactiveItems[d];if((e.mousedown||e.click)&&(e.__mouseIsDown=!0,e.__hit=this.hitTest(e,this.mouse),e.__hit&&(e.mousedown&&e.mousedown(this.mouse),e.__isDown=!0,!e.interactiveChildren)))break}},b.InteractionManager.prototype.onMouseOut=function(){this.dirty&&this.rebuildInteractiveGraph();var a=this.interactiveItems.length;this.interactionDOMElement.style.cursor="inherit";for(var b=0;a>b;b++){var c=this.interactiveItems[b];c.__isOver&&(this.mouse.target=c,c.mouseout&&c.mouseout(this.mouse),c.__isOver=!1)}this.mouseOut=!0,this.mouse.global.x=-1e4,this.mouse.global.y=-1e4},b.InteractionManager.prototype.onMouseUp=function(a){this.dirty&&this.rebuildInteractiveGraph(),this.mouse.originalEvent=a||window.event;
for(var b=this.interactiveItems.length,c=!1,d=0;b>d;d++){var e=this.interactiveItems[d];e.__hit=this.hitTest(e,this.mouse),e.__hit&&!c?(e.mouseup&&e.mouseup(this.mouse),e.__isDown&&e.click&&e.click(this.mouse),e.interactiveChildren||(c=!0)):e.__isDown&&e.mouseupoutside&&e.mouseupoutside(this.mouse),e.__isDown=!1}},b.InteractionManager.prototype.hitTest=function(a,c){var d=c.global;if(!a.worldVisible)return!1;var e=a instanceof b.Sprite,f=a.worldTransform,g=f.a,h=f.b,i=f.tx,j=f.c,k=f.d,l=f.ty,m=1/(g*k+h*-j),n=k*m*d.x+-h*m*d.y+(l*h-i*k)*m,o=g*m*d.y+-j*m*d.x+(-l*g+i*j)*m;if(c.target=a,a.hitArea&&a.hitArea.contains)return a.hitArea.contains(n,o)?(c.target=a,!0):!1;if(e){var p,q=a.texture.frame.width,r=a.texture.frame.height,s=-q*a.anchor.x;if(n>s&&s+q>n&&(p=-r*a.anchor.y,o>p&&p+r>o))return c.target=a,!0}for(var t=a.children.length,u=0;t>u;u++){var v=a.children[u],w=this.hitTest(v,c);if(w)return c.target=a,!0}return!1},b.InteractionManager.prototype.onTouchMove=function(a){this.dirty&&this.rebuildInteractiveGraph();var b,c=this.interactionDOMElement.getBoundingClientRect(),d=a.changedTouches,e=0;for(e=0;e<d.length;e++){var f=d[e];b=this.touchs[f.identifier],b.originalEvent=a||window.event,b.global.x=(f.clientX-c.left)*(this.target.width/c.width),b.global.y=(f.clientY-c.top)*(this.target.height/c.height),navigator.isCocoonJS&&(b.global.x=f.clientX,b.global.y=f.clientY);for(var g=0;g<this.interactiveItems.length;g++){var h=this.interactiveItems[g];h.touchmove&&h.__touchData&&h.__touchData[f.identifier]&&h.touchmove(b)}}},b.InteractionManager.prototype.onTouchStart=function(a){this.dirty&&this.rebuildInteractiveGraph();var c=this.interactionDOMElement.getBoundingClientRect();b.AUTO_PREVENT_DEFAULT&&a.preventDefault();for(var d=a.changedTouches,e=0;e<d.length;e++){var f=d[e],g=this.pool.pop();g||(g=new b.InteractionData),g.originalEvent=a||window.event,this.touchs[f.identifier]=g,g.global.x=(f.clientX-c.left)*(this.target.width/c.width),g.global.y=(f.clientY-c.top)*(this.target.height/c.height),navigator.isCocoonJS&&(g.global.x=f.clientX,g.global.y=f.clientY);for(var h=this.interactiveItems.length,i=0;h>i;i++){var j=this.interactiveItems[i];if((j.touchstart||j.tap)&&(j.__hit=this.hitTest(j,g),j.__hit&&(j.touchstart&&j.touchstart(g),j.__isDown=!0,j.__touchData=j.__touchData||{},j.__touchData[f.identifier]=g,!j.interactiveChildren)))break}}},b.InteractionManager.prototype.onTouchEnd=function(a){this.dirty&&this.rebuildInteractiveGraph();for(var b=this.interactionDOMElement.getBoundingClientRect(),c=a.changedTouches,d=0;d<c.length;d++){var e=c[d],f=this.touchs[e.identifier],g=!1;f.global.x=(e.clientX-b.left)*(this.target.width/b.width),f.global.y=(e.clientY-b.top)*(this.target.height/b.height),navigator.isCocoonJS&&(f.global.x=e.clientX,f.global.y=e.clientY);for(var h=this.interactiveItems.length,i=0;h>i;i++){var j=this.interactiveItems[i];j.__touchData&&j.__touchData[e.identifier]&&(j.__hit=this.hitTest(j,j.__touchData[e.identifier]),f.originalEvent=a||window.event,(j.touchend||j.tap)&&(j.__hit&&!g?(j.touchend&&j.touchend(f),j.__isDown&&j.tap&&j.tap(f),j.interactiveChildren||(g=!0)):j.__isDown&&j.touchendoutside&&j.touchendoutside(f),j.__isDown=!1),j.__touchData[e.identifier]=null)}this.pool.push(f),this.touchs[e.identifier]=null}},b.Stage=function(a){b.DisplayObjectContainer.call(this),this.worldTransform=new b.Matrix,this.interactive=!0,this.interactionManager=new b.InteractionManager(this),this.dirty=!0,this.stage=this,this.stage.hitArea=new b.Rectangle(0,0,1e5,1e5),this.setBackgroundColor(a)},b.Stage.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Stage.prototype.constructor=b.Stage,b.Stage.prototype.setInteractionDelegate=function(a){this.interactionManager.setTargetDomElement(a)},b.Stage.prototype.updateTransform=function(){this.worldAlpha=1;for(var a=0,b=this.children.length;b>a;a++)this.children[a].updateTransform();this.dirty&&(this.dirty=!1,this.interactionManager.dirty=!0),this.interactive&&this.interactionManager.update()},b.Stage.prototype.setBackgroundColor=function(a){this.backgroundColor=a||0,this.backgroundColorSplit=b.hex2rgb(this.backgroundColor);var c=this.backgroundColor.toString(16);c="000000".substr(0,6-c.length)+c,this.backgroundColorString="#"+c},b.Stage.prototype.getMousePosition=function(){return this.interactionManager.mouse.global};for(var c=0,d=["ms","moz","webkit","o"],e=0;e<d.length&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[d[e]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[d[e]+"CancelAnimationFrame"]||window[d[e]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(a){var b=(new Date).getTime(),d=Math.max(0,16-(b-c)),e=window.setTimeout(function(){a(b+d)},d);return c=b+d,e}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)}),window.requestAnimFrame=window.requestAnimationFrame,b.hex2rgb=function(a){return[(a>>16&255)/255,(a>>8&255)/255,(255&a)/255]},b.rgb2hex=function(a){return(255*a[0]<<16)+(255*a[1]<<8)+255*a[2]},"function"!=typeof Function.prototype.bind&&(Function.prototype.bind=function(){var a=Array.prototype.slice;return function(b){function c(){var f=e.concat(a.call(arguments));d.apply(this instanceof c?this:b,f)}var d=this,e=a.call(arguments,1);if("function"!=typeof d)throw new TypeError;return c.prototype=function f(a){return a&&(f.prototype=a),this instanceof f?void 0:new f}(d.prototype),c}}()),b.AjaxRequest=function(){var a=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0","Microsoft.XMLHTTP"];if(!window.ActiveXObject)return window.XMLHttpRequest?new window.XMLHttpRequest:!1;for(var b=0;b<a.length;b++)try{return new window.ActiveXObject(a[b])}catch(c){}},b.canUseNewCanvasBlendModes=function(){var a=document.createElement("canvas");a.width=1,a.height=1;var b=a.getContext("2d");return b.fillStyle="#000",b.fillRect(0,0,1,1),b.globalCompositeOperation="multiply",b.fillStyle="#fff",b.fillRect(0,0,1,1),0===b.getImageData(0,0,1,1).data[0]},b.getNextPowerOfTwo=function(a){if(a>0&&0===(a&a-1))return a;for(var b=1;a>b;)b<<=1;return b},b.EventTarget=function(){var a={};this.addEventListener=this.on=function(b,c){void 0===a[b]&&(a[b]=[]),-1===a[b].indexOf(c)&&a[b].unshift(c)},this.dispatchEvent=this.emit=function(b){if(a[b.type]&&a[b.type].length)for(var c=a[b.type].length-1;c>=0;c--)a[b.type][c](b)},this.removeEventListener=this.off=function(b,c){if(void 0!==a[b]){var d=a[b].indexOf(c);-1!==d&&a[b].splice(d,1)}},this.removeAllEventListeners=function(b){var c=a[b];c&&(c.length=0)}},b.autoDetectRenderer=function(a,c,d,e,f){a||(a=800),c||(c=600);var g=function(){try{var a=document.createElement("canvas");return!!window.WebGLRenderingContext&&(a.getContext("webgl")||a.getContext("experimental-webgl"))}catch(b){return!1}}();return g?new b.WebGLRenderer(a,c,d,e,f):new b.CanvasRenderer(a,c,d,e)},b.autoDetectRecommendedRenderer=function(a,c,d,e,f){a||(a=800),c||(c=600);var g=function(){try{var a=document.createElement("canvas");return!!window.WebGLRenderingContext&&(a.getContext("webgl")||a.getContext("experimental-webgl"))}catch(b){return!1}}(),h=/Android/i.test(navigator.userAgent);return g&&!h?new b.WebGLRenderer(a,c,d,e,f):new b.CanvasRenderer(a,c,d,e)},b.PolyK={},b.PolyK.Triangulate=function(a){var c=!0,d=a.length>>1;if(3>d)return[];for(var e=[],f=[],g=0;d>g;g++)f.push(g);g=0;for(var h=d;h>3;){var i=f[(g+0)%h],j=f[(g+1)%h],k=f[(g+2)%h],l=a[2*i],m=a[2*i+1],n=a[2*j],o=a[2*j+1],p=a[2*k],q=a[2*k+1],r=!1;if(b.PolyK._convex(l,m,n,o,p,q,c)){r=!0;for(var s=0;h>s;s++){var t=f[s];if(t!==i&&t!==j&&t!==k&&b.PolyK._PointInTriangle(a[2*t],a[2*t+1],l,m,n,o,p,q)){r=!1;break}}}if(r)e.push(i,j,k),f.splice((g+1)%h,1),h--,g=0;else if(g++>3*h){if(!c)return window.console.log("PIXI Warning: shape too complex to fill"),[];for(e=[],f=[],g=0;d>g;g++)f.push(g);g=0,h=d,c=!1}}return e.push(f[0],f[1],f[2]),e},b.PolyK._PointInTriangle=function(a,b,c,d,e,f,g,h){var i=g-c,j=h-d,k=e-c,l=f-d,m=a-c,n=b-d,o=i*i+j*j,p=i*k+j*l,q=i*m+j*n,r=k*k+l*l,s=k*m+l*n,t=1/(o*r-p*p),u=(r*q-p*s)*t,v=(o*s-p*q)*t;return u>=0&&v>=0&&1>u+v},b.PolyK._convex=function(a,b,c,d,e,f,g){return(b-d)*(e-c)+(c-a)*(f-d)>=0===g},b.initDefaultShaders=function(){},b.CompileVertexShader=function(a,c){return b._CompileShader(a,c,a.VERTEX_SHADER)},b.CompileFragmentShader=function(a,c){return b._CompileShader(a,c,a.FRAGMENT_SHADER)},b._CompileShader=function(a,b,c){var d=b.join("\n"),e=a.createShader(c);return a.shaderSource(e,d),a.compileShader(e),a.getShaderParameter(e,a.COMPILE_STATUS)?e:(window.console.log(a.getShaderInfoLog(e)),null)},b.compileProgram=function(a,c,d){var e=b.CompileFragmentShader(a,d),f=b.CompileVertexShader(a,c),g=a.createProgram();return a.attachShader(g,f),a.attachShader(g,e),a.linkProgram(g),a.getProgramParameter(g,a.LINK_STATUS)||window.console.log("Could not initialise shaders"),g},b.PixiShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision lowp float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;","}"],this.textureCount=0,this.attributes=[],this.init()},b.PixiShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc||b.PixiShader.defaultVertexSrc,this.fragmentSrc);a.useProgram(c),this.uSampler=a.getUniformLocation(c,"uSampler"),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.dimensions=a.getUniformLocation(c,"dimensions"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.aTextureCoord=a.getAttribLocation(c,"aTextureCoord"),this.colorAttribute=a.getAttribLocation(c,"aColor"),-1===this.colorAttribute&&(this.colorAttribute=2),this.attributes=[this.aVertexPosition,this.aTextureCoord,this.colorAttribute];for(var d in this.uniforms)this.uniforms[d].uniformLocation=a.getUniformLocation(c,d);this.initUniforms(),this.program=c},b.PixiShader.prototype.initUniforms=function(){this.textureCount=1;var a,b=this.gl;for(var c in this.uniforms){a=this.uniforms[c];var d=a.type;"sampler2D"===d?(a._init=!1,null!==a.value&&this.initSampler2D(a)):"mat2"===d||"mat3"===d||"mat4"===d?(a.glMatrix=!0,a.glValueLength=1,"mat2"===d?a.glFunc=b.uniformMatrix2fv:"mat3"===d?a.glFunc=b.uniformMatrix3fv:"mat4"===d&&(a.glFunc=b.uniformMatrix4fv)):(a.glFunc=b["uniform"+d],a.glValueLength="2f"===d||"2i"===d?2:"3f"===d||"3i"===d?3:"4f"===d||"4i"===d?4:1)}},b.PixiShader.prototype.initSampler2D=function(a){if(a.value&&a.value.baseTexture&&a.value.baseTexture.hasLoaded){var b=this.gl;if(b.activeTexture(b["TEXTURE"+this.textureCount]),b.bindTexture(b.TEXTURE_2D,a.value.baseTexture._glTextures[b.id]),a.textureData){var c=a.textureData,d=c.magFilter?c.magFilter:b.LINEAR,e=c.minFilter?c.minFilter:b.LINEAR,f=c.wrapS?c.wrapS:b.CLAMP_TO_EDGE,g=c.wrapT?c.wrapT:b.CLAMP_TO_EDGE,h=c.luminance?b.LUMINANCE:b.RGBA;if(c.repeat&&(f=b.REPEAT,g=b.REPEAT),b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL,!!c.flipY),c.width){var i=c.width?c.width:512,j=c.height?c.height:2,k=c.border?c.border:0;b.texImage2D(b.TEXTURE_2D,0,h,i,j,k,h,b.UNSIGNED_BYTE,null)}else b.texImage2D(b.TEXTURE_2D,0,h,b.RGBA,b.UNSIGNED_BYTE,a.value.baseTexture.source);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,d),b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,e),b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,f),b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,g)}b.uniform1i(a.uniformLocation,this.textureCount),a._init=!0,this.textureCount++}},b.PixiShader.prototype.syncUniforms=function(){this.textureCount=1;var a,c=this.gl;for(var d in this.uniforms)a=this.uniforms[d],1===a.glValueLength?a.glMatrix===!0?a.glFunc.call(c,a.uniformLocation,a.transpose,a.value):a.glFunc.call(c,a.uniformLocation,a.value):2===a.glValueLength?a.glFunc.call(c,a.uniformLocation,a.value.x,a.value.y):3===a.glValueLength?a.glFunc.call(c,a.uniformLocation,a.value.x,a.value.y,a.value.z):4===a.glValueLength?a.glFunc.call(c,a.uniformLocation,a.value.x,a.value.y,a.value.z,a.value.w):"sampler2D"===a.type&&(a._init?(c.activeTexture(c["TEXTURE"+this.textureCount]),c.bindTexture(c.TEXTURE_2D,a.value.baseTexture._glTextures[c.id]||b.createWebGLTexture(a.value.baseTexture,c)),c.uniform1i(a.uniformLocation,this.textureCount),this.textureCount++):this.initSampler2D(a))},b.PixiShader.prototype.destroy=function(){this.gl.deleteProgram(this.program),this.uniforms=null,this.gl=null,this.attributes=null},b.PixiShader.defaultVertexSrc=["attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","attribute vec2 aColor;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","varying vec2 vTextureCoord;","varying vec4 vColor;","const vec2 center = vec2(-1.0, 1.0);","void main(void) {","   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);","   vTextureCoord = aTextureCoord;","   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;","   vColor = vec4(color * aColor.x, aColor.x);","}"],b.PixiFastShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision lowp float;","varying vec2 vTextureCoord;","varying float vColor;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","attribute vec2 aPositionCoord;","attribute vec2 aScale;","attribute float aRotation;","attribute vec2 aTextureCoord;","attribute float aColor;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","uniform mat3 uMatrix;","varying vec2 vTextureCoord;","varying float vColor;","const vec2 center = vec2(-1.0, 1.0);","void main(void) {","   vec2 v;","   vec2 sv = aVertexPosition * aScale;","   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);","   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);","   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;","   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);","   vTextureCoord = aTextureCoord;","   vColor = aColor;","}"],this.textureCount=0,this.init()},b.PixiFastShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc,this.fragmentSrc);a.useProgram(c),this.uSampler=a.getUniformLocation(c,"uSampler"),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.dimensions=a.getUniformLocation(c,"dimensions"),this.uMatrix=a.getUniformLocation(c,"uMatrix"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.aPositionCoord=a.getAttribLocation(c,"aPositionCoord"),this.aScale=a.getAttribLocation(c,"aScale"),this.aRotation=a.getAttribLocation(c,"aRotation"),this.aTextureCoord=a.getAttribLocation(c,"aTextureCoord"),this.colorAttribute=a.getAttribLocation(c,"aColor"),-1===this.colorAttribute&&(this.colorAttribute=2),this.attributes=[this.aVertexPosition,this.aPositionCoord,this.aScale,this.aRotation,this.aTextureCoord,this.colorAttribute],this.program=c},b.PixiFastShader.prototype.destroy=function(){this.gl.deleteProgram(this.program),this.uniforms=null,this.gl=null,this.attributes=null},b.StripShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","uniform float alpha;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","uniform mat3 translationMatrix;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","varying vec2 vTextureCoord;","void main(void) {","   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);","   v -= offsetVector.xyx;","   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);","   vTextureCoord = aTextureCoord;","}"],this.init()},b.StripShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc,this.fragmentSrc);a.useProgram(c),this.uSampler=a.getUniformLocation(c,"uSampler"),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.colorAttribute=a.getAttribLocation(c,"aColor"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.aTextureCoord=a.getAttribLocation(c,"aTextureCoord"),this.attributes=[this.aVertexPosition,this.aTextureCoord],this.translationMatrix=a.getUniformLocation(c,"translationMatrix"),this.alpha=a.getUniformLocation(c,"alpha"),this.program=c},b.PrimitiveShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision mediump float;","varying vec4 vColor;","void main(void) {","   gl_FragColor = vColor;","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","attribute vec4 aColor;","uniform mat3 translationMatrix;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","uniform float alpha;","uniform vec3 tint;","varying vec4 vColor;","void main(void) {","   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);","   v -= offsetVector.xyx;","   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);","   vColor = aColor * vec4(tint * alpha, alpha);","}"],this.init()},b.PrimitiveShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc,this.fragmentSrc);a.useProgram(c),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.tintColor=a.getUniformLocation(c,"tint"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.colorAttribute=a.getAttribLocation(c,"aColor"),this.attributes=[this.aVertexPosition,this.colorAttribute],this.translationMatrix=a.getUniformLocation(c,"translationMatrix"),this.alpha=a.getUniformLocation(c,"alpha"),this.program=c},b.PrimitiveShader.prototype.destroy=function(){this.gl.deleteProgram(this.program),this.uniforms=null,this.gl=null,this.attribute=null},b.ComplexPrimitiveShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision mediump float;","varying vec4 vColor;","void main(void) {","   gl_FragColor = vColor;","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","uniform mat3 translationMatrix;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","uniform vec3 tint;","uniform float alpha;","uniform vec3 color;","varying vec4 vColor;","void main(void) {","   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);","   v -= offsetVector.xyx;","   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);","   vColor = vec4(color * alpha * tint, alpha);","}"],this.init()},b.ComplexPrimitiveShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc,this.fragmentSrc);a.useProgram(c),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.tintColor=a.getUniformLocation(c,"tint"),this.color=a.getUniformLocation(c,"color"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.attributes=[this.aVertexPosition,this.colorAttribute],this.translationMatrix=a.getUniformLocation(c,"translationMatrix"),this.alpha=a.getUniformLocation(c,"alpha"),this.program=c},b.ComplexPrimitiveShader.prototype.destroy=function(){this.gl.deleteProgram(this.program),this.uniforms=null,this.gl=null,this.attribute=null},b.WebGLGraphics=function(){},b.WebGLGraphics.renderGraphics=function(a,c){var d,e=c.gl,f=c.projection,g=c.offset,h=c.shaderManager.primitiveShader;a.dirty&&b.WebGLGraphics.updateGraphics(a,e);for(var i=a._webGL[e.id],j=0;j<i.data.length;j++)1===i.data[j].mode?(d=i.data[j],c.stencilManager.pushStencil(a,d,c),e.drawElements(e.TRIANGLE_FAN,4,e.UNSIGNED_SHORT,2*(d.indices.length-4)),c.stencilManager.popStencil(a,d,c),this.last=d.mode):(d=i.data[j],c.shaderManager.setShader(h),h=c.shaderManager.primitiveShader,e.uniformMatrix3fv(h.translationMatrix,!1,a.worldTransform.toArray(!0)),e.uniform2f(h.projectionVector,f.x,-f.y),e.uniform2f(h.offsetVector,-g.x,-g.y),e.uniform3fv(h.tintColor,b.hex2rgb(a.tint)),e.uniform1f(h.alpha,a.worldAlpha),e.bindBuffer(e.ARRAY_BUFFER,d.buffer),e.vertexAttribPointer(h.aVertexPosition,2,e.FLOAT,!1,24,0),e.vertexAttribPointer(h.colorAttribute,4,e.FLOAT,!1,24,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,d.indexBuffer),e.drawElements(e.TRIANGLE_STRIP,d.indices.length,e.UNSIGNED_SHORT,0))},b.WebGLGraphics.updateGraphics=function(a,c){var d=a._webGL[c.id];d||(d=a._webGL[c.id]={lastIndex:0,data:[],gl:c}),a.dirty=!1;var e;if(a.clearDirty){for(a.clearDirty=!1,e=0;e<d.data.length;e++){var f=d.data[e];f.reset(),b.WebGLGraphics.graphicsDataPool.push(f)}d.data=[],d.lastIndex=0}var g;for(e=d.lastIndex;e<a.graphicsData.length;e++){var h=a.graphicsData[e];h.type===b.Graphics.POLY?(h.fill&&h.points.length>6&&(h.points.length>10?(g=b.WebGLGraphics.switchMode(d,1),b.WebGLGraphics.buildComplexPoly(h,g)):(g=b.WebGLGraphics.switchMode(d,0),b.WebGLGraphics.buildPoly(h,g))),h.lineWidth>0&&(g=b.WebGLGraphics.switchMode(d,0),b.WebGLGraphics.buildLine(h,g))):(g=b.WebGLGraphics.switchMode(d,0),h.type===b.Graphics.RECT?b.WebGLGraphics.buildRectangle(h,g):h.type===b.Graphics.CIRC||h.type===b.Graphics.ELIP?b.WebGLGraphics.buildCircle(h,g):h.type===b.Graphics.RREC&&b.WebGLGraphics.buildRoundedRectangle(h,g)),d.lastIndex++}for(e=0;e<d.data.length;e++)g=d.data[e],g.dirty&&g.upload()},b.WebGLGraphics.switchMode=function(a,c){var d;return a.data.length?(d=a.data[a.data.length-1],(d.mode!==c||1===c)&&(d=b.WebGLGraphics.graphicsDataPool.pop()||new b.WebGLGraphicsData(a.gl),d.mode=c,a.data.push(d))):(d=b.WebGLGraphics.graphicsDataPool.pop()||new b.WebGLGraphicsData(a.gl),d.mode=c,a.data.push(d)),d.dirty=!0,d},b.WebGLGraphics.buildRectangle=function(a,c){var d=a.points,e=d[0],f=d[1],g=d[2],h=d[3];if(a.fill){var i=b.hex2rgb(a.fillColor),j=a.fillAlpha,k=i[0]*j,l=i[1]*j,m=i[2]*j,n=c.points,o=c.indices,p=n.length/6;n.push(e,f),n.push(k,l,m,j),n.push(e+g,f),n.push(k,l,m,j),n.push(e,f+h),n.push(k,l,m,j),n.push(e+g,f+h),n.push(k,l,m,j),o.push(p,p,p+1,p+2,p+3,p+3)}if(a.lineWidth){var q=a.points;a.points=[e,f,e+g,f,e+g,f+h,e,f+h,e,f],b.WebGLGraphics.buildLine(a,c),a.points=q}},b.WebGLGraphics.buildRoundedRectangle=function(a,c){var d=a.points,e=d[0],f=d[1],g=d[2],h=d[3],i=d[4],j=[];if(j.push(e,f+i),j=j.concat(b.WebGLGraphics.quadraticBezierCurve(e,f+h-i,e,f+h,e+i,f+h)),j=j.concat(b.WebGLGraphics.quadraticBezierCurve(e+g-i,f+h,e+g,f+h,e+g,f+h-i)),j=j.concat(b.WebGLGraphics.quadraticBezierCurve(e+g,f+i,e+g,f,e+g-i,f)),j=j.concat(b.WebGLGraphics.quadraticBezierCurve(e+i,f,e,f,e,f+i)),a.fill){var k=b.hex2rgb(a.fillColor),l=a.fillAlpha,m=k[0]*l,n=k[1]*l,o=k[2]*l,p=c.points,q=c.indices,r=p.length/6,s=b.PolyK.Triangulate(j),t=0;for(t=0;t<s.length;t+=3)q.push(s[t]+r),q.push(s[t]+r),q.push(s[t+1]+r),q.push(s[t+2]+r),q.push(s[t+2]+r);for(t=0;t<j.length;t++)p.push(j[t],j[++t],m,n,o,l)}if(a.lineWidth){var u=a.points;a.points=j,b.WebGLGraphics.buildLine(a,c),a.points=u}},b.WebGLGraphics.quadraticBezierCurve=function(a,b,c,d,e,f){function g(a,b,c){var d=b-a;return a+d*c}for(var h,i,j,k,l,m,n=20,o=[],p=0,q=0;n>=q;q++)p=q/n,h=g(a,c,p),i=g(b,d,p),j=g(c,e,p),k=g(d,f,p),l=g(h,j,p),m=g(i,k,p),o.push(l,m);return o},b.WebGLGraphics.buildCircle=function(a,c){var d=a.points,e=d[0],f=d[1],g=d[2],h=d[3],i=40,j=2*Math.PI/i,k=0;if(a.fill){var l=b.hex2rgb(a.fillColor),m=a.fillAlpha,n=l[0]*m,o=l[1]*m,p=l[2]*m,q=c.points,r=c.indices,s=q.length/6;for(r.push(s),k=0;i+1>k;k++)q.push(e,f,n,o,p,m),q.push(e+Math.sin(j*k)*g,f+Math.cos(j*k)*h,n,o,p,m),r.push(s++,s++);r.push(s-1)}if(a.lineWidth){var t=a.points;for(a.points=[],k=0;i+1>k;k++)a.points.push(e+Math.sin(j*k)*g,f+Math.cos(j*k)*h);b.WebGLGraphics.buildLine(a,c),a.points=t}},b.WebGLGraphics.buildLine=function(a,c){var d=0,e=a.points;if(0!==e.length){if(a.lineWidth%2)for(d=0;d<e.length;d++)e[d]+=.5;var f=new b.Point(e[0],e[1]),g=new b.Point(e[e.length-2],e[e.length-1]);if(f.x===g.x&&f.y===g.y){e=e.slice(),e.pop(),e.pop(),g=new b.Point(e[e.length-2],e[e.length-1]);var h=g.x+.5*(f.x-g.x),i=g.y+.5*(f.y-g.y);e.unshift(h,i),e.push(h,i)}var j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G=c.points,H=c.indices,I=e.length/2,J=e.length,K=G.length/6,L=a.lineWidth/2,M=b.hex2rgb(a.lineColor),N=a.lineAlpha,O=M[0]*N,P=M[1]*N,Q=M[2]*N;for(l=e[0],m=e[1],n=e[2],o=e[3],r=-(m-o),s=l-n,F=Math.sqrt(r*r+s*s),r/=F,s/=F,r*=L,s*=L,G.push(l-r,m-s,O,P,Q,N),G.push(l+r,m+s,O,P,Q,N),d=1;I-1>d;d++)l=e[2*(d-1)],m=e[2*(d-1)+1],n=e[2*d],o=e[2*d+1],p=e[2*(d+1)],q=e[2*(d+1)+1],r=-(m-o),s=l-n,F=Math.sqrt(r*r+s*s),r/=F,s/=F,r*=L,s*=L,t=-(o-q),u=n-p,F=Math.sqrt(t*t+u*u),t/=F,u/=F,t*=L,u*=L,x=-s+m-(-s+o),y=-r+n-(-r+l),z=(-r+l)*(-s+o)-(-r+n)*(-s+m),A=-u+q-(-u+o),B=-t+n-(-t+p),C=(-t+p)*(-u+o)-(-t+n)*(-u+q),D=x*B-A*y,Math.abs(D)<.1?(D+=10.1,G.push(n-r,o-s,O,P,Q,N),G.push(n+r,o+s,O,P,Q,N)):(j=(y*C-B*z)/D,k=(A*z-x*C)/D,E=(j-n)*(j-n)+(k-o)+(k-o),E>19600?(v=r-t,w=s-u,F=Math.sqrt(v*v+w*w),v/=F,w/=F,v*=L,w*=L,G.push(n-v,o-w),G.push(O,P,Q,N),G.push(n+v,o+w),G.push(O,P,Q,N),G.push(n-v,o-w),G.push(O,P,Q,N),J++):(G.push(j,k),G.push(O,P,Q,N),G.push(n-(j-n),o-(k-o)),G.push(O,P,Q,N)));for(l=e[2*(I-2)],m=e[2*(I-2)+1],n=e[2*(I-1)],o=e[2*(I-1)+1],r=-(m-o),s=l-n,F=Math.sqrt(r*r+s*s),r/=F,s/=F,r*=L,s*=L,G.push(n-r,o-s),G.push(O,P,Q,N),G.push(n+r,o+s),G.push(O,P,Q,N),H.push(K),d=0;J>d;d++)H.push(K++);H.push(K-1)}},b.WebGLGraphics.buildComplexPoly=function(a,c){var d=a.points.slice();if(!(d.length<6)){var e=c.indices;c.points=d,c.alpha=a.fillAlpha,c.color=b.hex2rgb(a.fillColor);for(var f,g,h=1/0,i=-1/0,j=1/0,k=-1/0,l=0;l<d.length;l+=2)f=d[l],g=d[l+1],h=h>f?f:h,i=f>i?f:i,j=j>g?g:j,k=g>k?g:k;d.push(h,j,i,j,i,k,h,k);var m=d.length/2;for(l=0;m>l;l++)e.push(l)}},b.WebGLGraphics.buildPoly=function(a,c){var d=a.points;if(!(d.length<6)){var e=c.points,f=c.indices,g=d.length/2,h=b.hex2rgb(a.fillColor),i=a.fillAlpha,j=h[0]*i,k=h[1]*i,l=h[2]*i,m=b.PolyK.Triangulate(d),n=e.length/6,o=0;for(o=0;o<m.length;o+=3)f.push(m[o]+n),f.push(m[o]+n),f.push(m[o+1]+n),f.push(m[o+2]+n),f.push(m[o+2]+n);for(o=0;g>o;o++)e.push(d[2*o],d[2*o+1],j,k,l,i)}},b.WebGLGraphics.graphicsDataPool=[],b.WebGLGraphicsData=function(a){this.gl=a,this.color=[0,0,0],this.points=[],this.indices=[],this.lastIndex=0,this.buffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),this.mode=1,this.alpha=1,this.dirty=!0},b.WebGLGraphicsData.prototype.reset=function(){this.points=[],this.indices=[],this.lastIndex=0},b.WebGLGraphicsData.prototype.upload=function(){var a=this.gl;this.glPoints=new Float32Array(this.points),a.bindBuffer(a.ARRAY_BUFFER,this.buffer),a.bufferData(a.ARRAY_BUFFER,this.glPoints,a.STATIC_DRAW),this.glIndicies=new Uint16Array(this.indices),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,this.glIndicies,a.STATIC_DRAW),this.dirty=!1},b.glContexts=[],b.WebGLRenderer=function(a,c,d,e,f,g){b.defaultRenderer||(b.sayHello("webGL"),b.defaultRenderer=this),this.type=b.WEBGL_RENDERER,this.transparent=!!e,this.preserveDrawingBuffer=g,this.width=a||800,this.height=c||600,this.view=d||document.createElement("canvas"),this.view.width=this.width,this.view.height=this.height,this.contextLost=this.handleContextLost.bind(this),this.contextRestoredLost=this.handleContextRestored.bind(this),this.view.addEventListener("webglcontextlost",this.contextLost,!1),this.view.addEventListener("webglcontextrestored",this.contextRestoredLost,!1),this.options={alpha:this.transparent,antialias:!!f,premultipliedAlpha:!!e,stencil:!0,preserveDrawingBuffer:g};var h=null;if(["experimental-webgl","webgl"].forEach(function(a){try{h=h||this.view.getContext(a,this.options)}catch(b){}},this),!h)throw new Error("This browser does not support webGL. Try using the canvas renderer"+this);this.gl=h,this.glContextId=h.id=b.WebGLRenderer.glContextId++,b.glContexts[this.glContextId]=h,b.blendModesWebGL||(b.blendModesWebGL=[],b.blendModesWebGL[b.blendModes.NORMAL]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.ADD]=[h.SRC_ALPHA,h.DST_ALPHA],b.blendModesWebGL[b.blendModes.MULTIPLY]=[h.DST_COLOR,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.SCREEN]=[h.SRC_ALPHA,h.ONE],b.blendModesWebGL[b.blendModes.OVERLAY]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.DARKEN]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.LIGHTEN]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.COLOR_DODGE]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.COLOR_BURN]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.HARD_LIGHT]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.SOFT_LIGHT]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.DIFFERENCE]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.EXCLUSION]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.HUE]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.SATURATION]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.COLOR]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.LUMINOSITY]=[h.ONE,h.ONE_MINUS_SRC_ALPHA]),this.projection=new b.Point,this.projection.x=this.width/2,this.projection.y=-this.height/2,this.offset=new b.Point(0,0),this.resize(this.width,this.height),this.contextLost=!1,this.shaderManager=new b.WebGLShaderManager(h),this.spriteBatch=new b.WebGLSpriteBatch(h),this.maskManager=new b.WebGLMaskManager(h),this.filterManager=new b.WebGLFilterManager(h,this.transparent),this.stencilManager=new b.WebGLStencilManager(h),this.blendModeManager=new b.WebGLBlendModeManager(h),this.renderSession={},this.renderSession.gl=this.gl,this.renderSession.drawCount=0,this.renderSession.shaderManager=this.shaderManager,this.renderSession.maskManager=this.maskManager,this.renderSession.filterManager=this.filterManager,this.renderSession.blendModeManager=this.blendModeManager,this.renderSession.spriteBatch=this.spriteBatch,this.renderSession.stencilManager=this.stencilManager,this.renderSession.renderer=this,h.useProgram(this.shaderManager.defaultShader.program),h.disable(h.DEPTH_TEST),h.disable(h.CULL_FACE),h.enable(h.BLEND),h.colorMask(!0,!0,!0,this.transparent)},b.WebGLRenderer.prototype.constructor=b.WebGLRenderer,b.WebGLRenderer.prototype.render=function(a){if(!this.contextLost){this.__stage!==a&&(a.interactive&&a.interactionManager.removeEvents(),this.__stage=a),b.WebGLRenderer.updateTextures(),a.updateTransform(),a._interactive&&(a._interactiveEventsAdded||(a._interactiveEventsAdded=!0,a.interactionManager.setTarget(this)));var c=this.gl;c.viewport(0,0,this.width,this.height),c.bindFramebuffer(c.FRAMEBUFFER,null),this.transparent?c.clearColor(0,0,0,0):c.clearColor(a.backgroundColorSplit[0],a.backgroundColorSplit[1],a.backgroundColorSplit[2],1),c.clear(c.COLOR_BUFFER_BIT),this.renderDisplayObject(a,this.projection),a.interactive?a._interactiveEventsAdded||(a._interactiveEventsAdded=!0,a.interactionManager.setTarget(this)):a._interactiveEventsAdded&&(a._interactiveEventsAdded=!1,a.interactionManager.setTarget(this))}},b.WebGLRenderer.prototype.renderDisplayObject=function(a,c,d){this.renderSession.blendModeManager.setBlendMode(b.blendModes.NORMAL),this.renderSession.drawCount=0,this.renderSession.currentBlendMode=9999,this.renderSession.projection=c,this.renderSession.offset=this.offset,this.spriteBatch.begin(this.renderSession),this.filterManager.begin(this.renderSession,d),a._renderWebGL(this.renderSession),this.spriteBatch.end()},b.WebGLRenderer.updateTextures=function(){var a=0;for(a=0;a<b.Texture.frameUpdates.length;a++)b.WebGLRenderer.updateTextureFrame(b.Texture.frameUpdates[a]);for(a=0;a<b.texturesToDestroy.length;a++)b.WebGLRenderer.destroyTexture(b.texturesToDestroy[a]);b.texturesToUpdate.length=0,b.texturesToDestroy.length=0,b.Texture.frameUpdates.length=0},b.WebGLRenderer.destroyTexture=function(a){for(var c=a._glTextures.length-1;c>=0;c--){var d=a._glTextures[c],e=b.glContexts[c];
e&&d&&e.deleteTexture(d)}a._glTextures.length=0},b.WebGLRenderer.updateTextureFrame=function(a){a._updateWebGLuvs()},b.WebGLRenderer.prototype.resize=function(a,b){this.width=a,this.height=b,this.view.width=a,this.view.height=b,this.gl.viewport(0,0,this.width,this.height),this.projection.x=this.width/2,this.projection.y=-this.height/2},b.createWebGLTexture=function(a,c){return a.hasLoaded&&(a._glTextures[c.id]=c.createTexture(),c.bindTexture(c.TEXTURE_2D,a._glTextures[c.id]),c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultipliedAlpha),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,c.RGBA,c.UNSIGNED_BYTE,a.source),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MAG_FILTER,a.scaleMode===b.scaleModes.LINEAR?c.LINEAR:c.NEAREST),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MIN_FILTER,a.scaleMode===b.scaleModes.LINEAR?c.LINEAR:c.NEAREST),a._powerOf2?(c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.REPEAT),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.REPEAT)):(c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.CLAMP_TO_EDGE),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.CLAMP_TO_EDGE)),c.bindTexture(c.TEXTURE_2D,null),a._dirty[c.id]=!1),a._glTextures[c.id]},b.updateWebGLTexture=function(a,c){a._glTextures[c.id]&&(c.bindTexture(c.TEXTURE_2D,a._glTextures[c.id]),c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultipliedAlpha),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,c.RGBA,c.UNSIGNED_BYTE,a.source),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MAG_FILTER,a.scaleMode===b.scaleModes.LINEAR?c.LINEAR:c.NEAREST),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MIN_FILTER,a.scaleMode===b.scaleModes.LINEAR?c.LINEAR:c.NEAREST),a._powerOf2?(c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.REPEAT),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.REPEAT)):(c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.CLAMP_TO_EDGE),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.CLAMP_TO_EDGE)),a._dirty[c.id]=!1)},b.WebGLRenderer.prototype.handleContextLost=function(a){a.preventDefault(),this.contextLost=!0},b.WebGLRenderer.prototype.handleContextRestored=function(){try{this.gl=this.view.getContext("experimental-webgl",this.options)}catch(a){try{this.gl=this.view.getContext("webgl",this.options)}catch(c){throw new Error(" This browser does not support webGL. Try using the canvas renderer"+this)}}var d=this.gl;d.id=b.WebGLRenderer.glContextId++,this.shaderManager.setContext(d),this.spriteBatch.setContext(d),this.primitiveBatch.setContext(d),this.maskManager.setContext(d),this.filterManager.setContext(d),this.renderSession.gl=this.gl,d.disable(d.DEPTH_TEST),d.disable(d.CULL_FACE),d.enable(d.BLEND),d.colorMask(!0,!0,!0,this.transparent),this.gl.viewport(0,0,this.width,this.height);for(var e in b.TextureCache){var f=b.TextureCache[e].baseTexture;f._glTextures=[]}this.contextLost=!1},b.WebGLRenderer.prototype.destroy=function(){this.view.removeEventListener("webglcontextlost",this.contextLost),this.view.removeEventListener("webglcontextrestored",this.contextRestoredLost),b.glContexts[this.glContextId]=null,this.projection=null,this.offset=null,this.shaderManager.destroy(),this.spriteBatch.destroy(),this.primitiveBatch.destroy(),this.maskManager.destroy(),this.filterManager.destroy(),this.shaderManager=null,this.spriteBatch=null,this.maskManager=null,this.filterManager=null,this.gl=null,this.renderSession=null},b.WebGLRenderer.glContextId=0,b.WebGLBlendModeManager=function(a){this.gl=a,this.currentBlendMode=99999},b.WebGLBlendModeManager.prototype.setBlendMode=function(a){if(this.currentBlendMode===a)return!1;this.currentBlendMode=a;var c=b.blendModesWebGL[this.currentBlendMode];return this.gl.blendFunc(c[0],c[1]),!0},b.WebGLBlendModeManager.prototype.destroy=function(){this.gl=null},b.WebGLMaskManager=function(a){this.maskStack=[],this.maskPosition=0,this.setContext(a),this.reverse=!1,this.count=0},b.WebGLMaskManager.prototype.setContext=function(a){this.gl=a},b.WebGLMaskManager.prototype.pushMask=function(a,c){var d=c.gl;a.dirty&&b.WebGLGraphics.updateGraphics(a,d),a._webGL[d.id].data.length&&c.stencilManager.pushStencil(a,a._webGL[d.id].data[0],c)},b.WebGLMaskManager.prototype.popMask=function(a,b){var c=this.gl;b.stencilManager.popStencil(a,a._webGL[c.id].data[0],b)},b.WebGLMaskManager.prototype.destroy=function(){this.maskStack=null,this.gl=null},b.WebGLStencilManager=function(a){this.stencilStack=[],this.setContext(a),this.reverse=!0,this.count=0},b.WebGLStencilManager.prototype.setContext=function(a){this.gl=a},b.WebGLStencilManager.prototype.pushStencil=function(a,b,c){var d=this.gl;this.bindGraphics(a,b,c),0===this.stencilStack.length&&(d.enable(d.STENCIL_TEST),d.clear(d.STENCIL_BUFFER_BIT),this.reverse=!0,this.count=0),this.stencilStack.push(b);var e=this.count;d.colorMask(!1,!1,!1,!1),d.stencilFunc(d.ALWAYS,0,255),d.stencilOp(d.KEEP,d.KEEP,d.INVERT),1===b.mode?(d.drawElements(d.TRIANGLE_FAN,b.indices.length-4,d.UNSIGNED_SHORT,0),this.reverse?(d.stencilFunc(d.EQUAL,255-e,255),d.stencilOp(d.KEEP,d.KEEP,d.DECR)):(d.stencilFunc(d.EQUAL,e,255),d.stencilOp(d.KEEP,d.KEEP,d.INCR)),d.drawElements(d.TRIANGLE_FAN,4,d.UNSIGNED_SHORT,2*(b.indices.length-4)),this.reverse?d.stencilFunc(d.EQUAL,255-(e+1),255):d.stencilFunc(d.EQUAL,e+1,255),this.reverse=!this.reverse):(this.reverse?(d.stencilFunc(d.EQUAL,e,255),d.stencilOp(d.KEEP,d.KEEP,d.INCR)):(d.stencilFunc(d.EQUAL,255-e,255),d.stencilOp(d.KEEP,d.KEEP,d.DECR)),d.drawElements(d.TRIANGLE_STRIP,b.indices.length,d.UNSIGNED_SHORT,0),this.reverse?d.stencilFunc(d.EQUAL,e+1,255):d.stencilFunc(d.EQUAL,255-(e+1),255)),d.colorMask(!0,!0,!0,!0),d.stencilOp(d.KEEP,d.KEEP,d.KEEP),this.count++},b.WebGLStencilManager.prototype.bindGraphics=function(a,c,d){this._currentGraphics=a;var e,f=this.gl,g=d.projection,h=d.offset;1===c.mode?(e=d.shaderManager.complexPrimativeShader,d.shaderManager.setShader(e),f.uniformMatrix3fv(e.translationMatrix,!1,a.worldTransform.toArray(!0)),f.uniform2f(e.projectionVector,g.x,-g.y),f.uniform2f(e.offsetVector,-h.x,-h.y),f.uniform3fv(e.tintColor,b.hex2rgb(a.tint)),f.uniform3fv(e.color,c.color),f.uniform1f(e.alpha,a.worldAlpha*c.alpha),f.bindBuffer(f.ARRAY_BUFFER,c.buffer),f.vertexAttribPointer(e.aVertexPosition,2,f.FLOAT,!1,8,0),f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,c.indexBuffer)):(e=d.shaderManager.primitiveShader,d.shaderManager.setShader(e),f.uniformMatrix3fv(e.translationMatrix,!1,a.worldTransform.toArray(!0)),f.uniform2f(e.projectionVector,g.x,-g.y),f.uniform2f(e.offsetVector,-h.x,-h.y),f.uniform3fv(e.tintColor,b.hex2rgb(a.tint)),f.uniform1f(e.alpha,a.worldAlpha),f.bindBuffer(f.ARRAY_BUFFER,c.buffer),f.vertexAttribPointer(e.aVertexPosition,2,f.FLOAT,!1,24,0),f.vertexAttribPointer(e.colorAttribute,4,f.FLOAT,!1,24,8),f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,c.indexBuffer))},b.WebGLStencilManager.prototype.popStencil=function(a,b,c){var d=this.gl;if(this.stencilStack.pop(),this.count--,0===this.stencilStack.length)d.disable(d.STENCIL_TEST);else{var e=this.count;this.bindGraphics(a,b,c),d.colorMask(!1,!1,!1,!1),1===b.mode?(this.reverse=!this.reverse,this.reverse?(d.stencilFunc(d.EQUAL,255-(e+1),255),d.stencilOp(d.KEEP,d.KEEP,d.INCR)):(d.stencilFunc(d.EQUAL,e+1,255),d.stencilOp(d.KEEP,d.KEEP,d.DECR)),d.drawElements(d.TRIANGLE_FAN,4,d.UNSIGNED_SHORT,2*(b.indices.length-4)),d.stencilFunc(d.ALWAYS,0,255),d.stencilOp(d.KEEP,d.KEEP,d.INVERT),d.drawElements(d.TRIANGLE_FAN,b.indices.length-4,d.UNSIGNED_SHORT,0),this.reverse?d.stencilFunc(d.EQUAL,e,255):d.stencilFunc(d.EQUAL,255-e,255)):(this.reverse?(d.stencilFunc(d.EQUAL,e+1,255),d.stencilOp(d.KEEP,d.KEEP,d.DECR)):(d.stencilFunc(d.EQUAL,255-(e+1),255),d.stencilOp(d.KEEP,d.KEEP,d.INCR)),d.drawElements(d.TRIANGLE_STRIP,b.indices.length,d.UNSIGNED_SHORT,0),this.reverse?d.stencilFunc(d.EQUAL,e,255):d.stencilFunc(d.EQUAL,255-e,255)),d.colorMask(!0,!0,!0,!0),d.stencilOp(d.KEEP,d.KEEP,d.KEEP)}},b.WebGLStencilManager.prototype.destroy=function(){this.maskStack=null,this.gl=null},b.WebGLShaderManager=function(a){this.maxAttibs=10,this.attribState=[],this.tempAttribState=[],this.shaderMap=[];for(var b=0;b<this.maxAttibs;b++)this.attribState[b]=!1;this.setContext(a)},b.WebGLShaderManager.prototype.setContext=function(a){this.gl=a,this.primitiveShader=new b.PrimitiveShader(a),this.complexPrimativeShader=new b.ComplexPrimitiveShader(a),this.defaultShader=new b.PixiShader(a),this.fastShader=new b.PixiFastShader(a),this.stripShader=new b.StripShader(a),this.setShader(this.defaultShader)},b.WebGLShaderManager.prototype.setAttribs=function(a){var b;for(b=0;b<this.tempAttribState.length;b++)this.tempAttribState[b]=!1;for(b=0;b<a.length;b++){var c=a[b];this.tempAttribState[c]=!0}var d=this.gl;for(b=0;b<this.attribState.length;b++)this.attribState[b]!==this.tempAttribState[b]&&(this.attribState[b]=this.tempAttribState[b],this.tempAttribState[b]?d.enableVertexAttribArray(b):d.disableVertexAttribArray(b))},b.WebGLShaderManager.prototype.setShader=function(a){return this._currentId===a._UID?!1:(this._currentId=a._UID,this.currentShader=a,this.gl.useProgram(a.program),this.setAttribs(a.attributes),!0)},b.WebGLShaderManager.prototype.destroy=function(){this.attribState=null,this.tempAttribState=null,this.primitiveShader.destroy(),this.defaultShader.destroy(),this.fastShader.destroy(),this.stripShader.destroy(),this.gl=null},b.WebGLSpriteBatch=function(a){this.vertSize=6,this.size=2e3;var b=4*this.size*this.vertSize,c=6*this.size;this.vertices=new Float32Array(b),this.indices=new Uint16Array(c),this.lastIndexCount=0;for(var d=0,e=0;c>d;d+=6,e+=4)this.indices[d+0]=e+0,this.indices[d+1]=e+1,this.indices[d+2]=e+2,this.indices[d+3]=e+0,this.indices[d+4]=e+2,this.indices[d+5]=e+3;this.drawing=!1,this.currentBatchSize=0,this.currentBaseTexture=null,this.setContext(a),this.dirty=!0,this.textures=[],this.blendModes=[]},b.WebGLSpriteBatch.prototype.setContext=function(a){this.gl=a,this.vertexBuffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,this.indices,a.STATIC_DRAW),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bufferData(a.ARRAY_BUFFER,this.vertices,a.DYNAMIC_DRAW),this.currentBlendMode=99999},b.WebGLSpriteBatch.prototype.begin=function(a){this.renderSession=a,this.shader=this.renderSession.shaderManager.defaultShader,this.start()},b.WebGLSpriteBatch.prototype.end=function(){this.flush()},b.WebGLSpriteBatch.prototype.render=function(a){var b=a.texture;this.currentBatchSize>=this.size&&(this.flush(),this.currentBaseTexture=b.baseTexture);var c=b._uvs;if(c){var d,e,f,g,h=a.worldAlpha,i=a.tint,j=this.vertices,k=a.anchor.x,l=a.anchor.y;if(b.trim){var m=b.trim;e=m.x-k*m.width,d=e+b.crop.width,g=m.y-l*m.height,f=g+b.crop.height}else d=b.frame.width*(1-k),e=b.frame.width*-k,f=b.frame.height*(1-l),g=b.frame.height*-l;var n=4*this.currentBatchSize*this.vertSize,o=a.worldTransform,p=o.a,q=o.c,r=o.b,s=o.d,t=o.tx,u=o.ty;j[n++]=p*e+r*g+t,j[n++]=s*g+q*e+u,j[n++]=c.x0,j[n++]=c.y0,j[n++]=h,j[n++]=i,j[n++]=p*d+r*g+t,j[n++]=s*g+q*d+u,j[n++]=c.x1,j[n++]=c.y1,j[n++]=h,j[n++]=i,j[n++]=p*d+r*f+t,j[n++]=s*f+q*d+u,j[n++]=c.x2,j[n++]=c.y2,j[n++]=h,j[n++]=i,j[n++]=p*e+r*f+t,j[n++]=s*f+q*e+u,j[n++]=c.x3,j[n++]=c.y3,j[n++]=h,j[n++]=i,this.textures[this.currentBatchSize]=a.texture.baseTexture,this.blendModes[this.currentBatchSize]=a.blendMode,this.currentBatchSize++}},b.WebGLSpriteBatch.prototype.renderTilingSprite=function(a){var c=a.tilingTexture;this.currentBatchSize>=this.size&&(this.flush(),this.currentBaseTexture=c.baseTexture),a._uvs||(a._uvs=new b.TextureUvs);var d=a._uvs;a.tilePosition.x%=c.baseTexture.width*a.tileScaleOffset.x,a.tilePosition.y%=c.baseTexture.height*a.tileScaleOffset.y;var e=a.tilePosition.x/(c.baseTexture.width*a.tileScaleOffset.x),f=a.tilePosition.y/(c.baseTexture.height*a.tileScaleOffset.y),g=a.width/c.baseTexture.width/(a.tileScale.x*a.tileScaleOffset.x),h=a.height/c.baseTexture.height/(a.tileScale.y*a.tileScaleOffset.y);d.x0=0-e,d.y0=0-f,d.x1=1*g-e,d.y1=0-f,d.x2=1*g-e,d.y2=1*h-f,d.x3=0-e,d.y3=1*h-f;var i=a.worldAlpha,j=a.tint,k=this.vertices,l=a.width,m=a.height,n=a.anchor.x,o=a.anchor.y,p=l*(1-n),q=l*-n,r=m*(1-o),s=m*-o,t=4*this.currentBatchSize*this.vertSize,u=a.worldTransform,v=u.a,w=u.c,x=u.b,y=u.d,z=u.tx,A=u.ty;k[t++]=v*q+x*s+z,k[t++]=y*s+w*q+A,k[t++]=d.x0,k[t++]=d.y0,k[t++]=i,k[t++]=j,k[t++]=v*p+x*s+z,k[t++]=y*s+w*p+A,k[t++]=d.x1,k[t++]=d.y1,k[t++]=i,k[t++]=j,k[t++]=v*p+x*r+z,k[t++]=y*r+w*p+A,k[t++]=d.x2,k[t++]=d.y2,k[t++]=i,k[t++]=j,k[t++]=v*q+x*r+z,k[t++]=y*r+w*q+A,k[t++]=d.x3,k[t++]=d.y3,k[t++]=i,k[t++]=j,this.textures[this.currentBatchSize]=c.baseTexture,this.blendModes[this.currentBatchSize]=a.blendMode,this.currentBatchSize++},b.WebGLSpriteBatch.prototype.flush=function(){if(0!==this.currentBatchSize){var a=this.gl;if(this.renderSession.shaderManager.setShader(this.renderSession.shaderManager.defaultShader),this.dirty){this.dirty=!1,a.activeTexture(a.TEXTURE0),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer);var b=this.renderSession.projection;a.uniform2f(this.shader.projectionVector,b.x,b.y);var c=4*this.vertSize;a.vertexAttribPointer(this.shader.aVertexPosition,2,a.FLOAT,!1,c,0),a.vertexAttribPointer(this.shader.aTextureCoord,2,a.FLOAT,!1,c,8),a.vertexAttribPointer(this.shader.colorAttribute,2,a.FLOAT,!1,c,16)}if(this.currentBatchSize>.5*this.size)a.bufferSubData(a.ARRAY_BUFFER,0,this.vertices);else{var d=this.vertices.subarray(0,4*this.currentBatchSize*this.vertSize);a.bufferSubData(a.ARRAY_BUFFER,0,d)}for(var e,f,g=0,h=0,i=null,j=this.renderSession.blendModeManager.currentBlendMode,k=0,l=this.currentBatchSize;l>k;k++)e=this.textures[k],f=this.blendModes[k],(i!==e||j!==f)&&(this.renderBatch(i,g,h),h=k,g=0,i=e,j=f,this.renderSession.blendModeManager.setBlendMode(j)),g++;this.renderBatch(i,g,h),this.currentBatchSize=0}},b.WebGLSpriteBatch.prototype.renderBatch=function(a,c,d){if(0!==c){var e=this.gl;e.bindTexture(e.TEXTURE_2D,a._glTextures[e.id]||b.createWebGLTexture(a,e)),a._dirty[e.id]&&b.updateWebGLTexture(this.currentBaseTexture,e),e.drawElements(e.TRIANGLES,6*c,e.UNSIGNED_SHORT,6*d*2),this.renderSession.drawCount++}},b.WebGLSpriteBatch.prototype.stop=function(){this.flush()},b.WebGLSpriteBatch.prototype.start=function(){this.dirty=!0},b.WebGLSpriteBatch.prototype.destroy=function(){this.vertices=null,this.indices=null,this.gl.deleteBuffer(this.vertexBuffer),this.gl.deleteBuffer(this.indexBuffer),this.currentBaseTexture=null,this.gl=null},b.WebGLFastSpriteBatch=function(a){this.vertSize=10,this.maxSize=6e3,this.size=this.maxSize;var b=4*this.size*this.vertSize,c=6*this.maxSize;this.vertices=new Float32Array(b),this.indices=new Uint16Array(c),this.vertexBuffer=null,this.indexBuffer=null,this.lastIndexCount=0;for(var d=0,e=0;c>d;d+=6,e+=4)this.indices[d+0]=e+0,this.indices[d+1]=e+1,this.indices[d+2]=e+2,this.indices[d+3]=e+0,this.indices[d+4]=e+2,this.indices[d+5]=e+3;this.drawing=!1,this.currentBatchSize=0,this.currentBaseTexture=null,this.currentBlendMode=0,this.renderSession=null,this.shader=null,this.matrix=null,this.setContext(a)},b.WebGLFastSpriteBatch.prototype.setContext=function(a){this.gl=a,this.vertexBuffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,this.indices,a.STATIC_DRAW),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bufferData(a.ARRAY_BUFFER,this.vertices,a.DYNAMIC_DRAW)},b.WebGLFastSpriteBatch.prototype.begin=function(a,b){this.renderSession=b,this.shader=this.renderSession.shaderManager.fastShader,this.matrix=a.worldTransform.toArray(!0),this.start()},b.WebGLFastSpriteBatch.prototype.end=function(){this.flush()},b.WebGLFastSpriteBatch.prototype.render=function(a){var b=a.children,c=b[0];if(c.texture._uvs){this.currentBaseTexture=c.texture.baseTexture,c.blendMode!==this.renderSession.blendModeManager.currentBlendMode&&(this.flush(),this.renderSession.blendModeManager.setBlendMode(c.blendMode));for(var d=0,e=b.length;e>d;d++)this.renderSprite(b[d]);this.flush()}},b.WebGLFastSpriteBatch.prototype.renderSprite=function(a){if(a.visible&&(a.texture.baseTexture===this.currentBaseTexture||(this.flush(),this.currentBaseTexture=a.texture.baseTexture,a.texture._uvs))){var b,c,d,e,f,g,h,i,j=this.vertices;if(b=a.texture._uvs,c=a.texture.frame.width,d=a.texture.frame.height,a.texture.trim){var k=a.texture.trim;f=k.x-a.anchor.x*k.width,e=f+a.texture.crop.width,h=k.y-a.anchor.y*k.height,g=h+a.texture.crop.height}else e=a.texture.frame.width*(1-a.anchor.x),f=a.texture.frame.width*-a.anchor.x,g=a.texture.frame.height*(1-a.anchor.y),h=a.texture.frame.height*-a.anchor.y;i=4*this.currentBatchSize*this.vertSize,j[i++]=f,j[i++]=h,j[i++]=a.position.x,j[i++]=a.position.y,j[i++]=a.scale.x,j[i++]=a.scale.y,j[i++]=a.rotation,j[i++]=b.x0,j[i++]=b.y1,j[i++]=a.alpha,j[i++]=e,j[i++]=h,j[i++]=a.position.x,j[i++]=a.position.y,j[i++]=a.scale.x,j[i++]=a.scale.y,j[i++]=a.rotation,j[i++]=b.x1,j[i++]=b.y1,j[i++]=a.alpha,j[i++]=e,j[i++]=g,j[i++]=a.position.x,j[i++]=a.position.y,j[i++]=a.scale.x,j[i++]=a.scale.y,j[i++]=a.rotation,j[i++]=b.x2,j[i++]=b.y2,j[i++]=a.alpha,j[i++]=f,j[i++]=g,j[i++]=a.position.x,j[i++]=a.position.y,j[i++]=a.scale.x,j[i++]=a.scale.y,j[i++]=a.rotation,j[i++]=b.x3,j[i++]=b.y3,j[i++]=a.alpha,this.currentBatchSize++,this.currentBatchSize>=this.size&&this.flush()}},b.WebGLFastSpriteBatch.prototype.flush=function(){if(0!==this.currentBatchSize){var a=this.gl;if(this.currentBaseTexture._glTextures[a.id]||b.createWebGLTexture(this.currentBaseTexture,a),a.bindTexture(a.TEXTURE_2D,this.currentBaseTexture._glTextures[a.id]),this.currentBatchSize>.5*this.size)a.bufferSubData(a.ARRAY_BUFFER,0,this.vertices);else{var c=this.vertices.subarray(0,4*this.currentBatchSize*this.vertSize);a.bufferSubData(a.ARRAY_BUFFER,0,c)}a.drawElements(a.TRIANGLES,6*this.currentBatchSize,a.UNSIGNED_SHORT,0),this.currentBatchSize=0,this.renderSession.drawCount++}},b.WebGLFastSpriteBatch.prototype.stop=function(){this.flush()},b.WebGLFastSpriteBatch.prototype.start=function(){var a=this.gl;a.activeTexture(a.TEXTURE0),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer);var b=this.renderSession.projection;a.uniform2f(this.shader.projectionVector,b.x,b.y),a.uniformMatrix3fv(this.shader.uMatrix,!1,this.matrix);var c=4*this.vertSize;a.vertexAttribPointer(this.shader.aVertexPosition,2,a.FLOAT,!1,c,0),a.vertexAttribPointer(this.shader.aPositionCoord,2,a.FLOAT,!1,c,8),a.vertexAttribPointer(this.shader.aScale,2,a.FLOAT,!1,c,16),a.vertexAttribPointer(this.shader.aRotation,1,a.FLOAT,!1,c,24),a.vertexAttribPointer(this.shader.aTextureCoord,2,a.FLOAT,!1,c,28),a.vertexAttribPointer(this.shader.colorAttribute,1,a.FLOAT,!1,c,36)},b.WebGLFilterManager=function(a,b){this.transparent=b,this.filterStack=[],this.offsetX=0,this.offsetY=0,this.setContext(a)},b.WebGLFilterManager.prototype.setContext=function(a){this.gl=a,this.texturePool=[],this.initShaderBuffers()},b.WebGLFilterManager.prototype.begin=function(a,b){this.renderSession=a,this.defaultShader=a.shaderManager.defaultShader;var c=this.renderSession.projection;this.width=2*c.x,this.height=2*-c.y,this.buffer=b},b.WebGLFilterManager.prototype.pushFilter=function(a){var c=this.gl,d=this.renderSession.projection,e=this.renderSession.offset;a._filterArea=a.target.filterArea||a.target.getBounds(),this.filterStack.push(a);var f=a.filterPasses[0];this.offsetX+=a._filterArea.x,this.offsetY+=a._filterArea.y;var g=this.texturePool.pop();g?g.resize(this.width,this.height):g=new b.FilterTexture(this.gl,this.width,this.height),c.bindTexture(c.TEXTURE_2D,g.texture);var h=a._filterArea,i=f.padding;h.x-=i,h.y-=i,h.width+=2*i,h.height+=2*i,h.x<0&&(h.x=0),h.width>this.width&&(h.width=this.width),h.y<0&&(h.y=0),h.height>this.height&&(h.height=this.height),c.bindFramebuffer(c.FRAMEBUFFER,g.frameBuffer),c.viewport(0,0,h.width,h.height),d.x=h.width/2,d.y=-h.height/2,e.x=-h.x,e.y=-h.y,this.renderSession.shaderManager.setShader(this.defaultShader),c.uniform2f(this.defaultShader.projectionVector,h.width/2,-h.height/2),c.uniform2f(this.defaultShader.offsetVector,-h.x,-h.y),c.colorMask(!0,!0,!0,!0),c.clearColor(0,0,0,0),c.clear(c.COLOR_BUFFER_BIT),a._glFilterTexture=g},b.WebGLFilterManager.prototype.popFilter=function(){var a=this.gl,c=this.filterStack.pop(),d=c._filterArea,e=c._glFilterTexture,f=this.renderSession.projection,g=this.renderSession.offset;if(c.filterPasses.length>1){a.viewport(0,0,d.width,d.height),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),this.vertexArray[0]=0,this.vertexArray[1]=d.height,this.vertexArray[2]=d.width,this.vertexArray[3]=d.height,this.vertexArray[4]=0,this.vertexArray[5]=0,this.vertexArray[6]=d.width,this.vertexArray[7]=0,a.bufferSubData(a.ARRAY_BUFFER,0,this.vertexArray),a.bindBuffer(a.ARRAY_BUFFER,this.uvBuffer),this.uvArray[2]=d.width/this.width,this.uvArray[5]=d.height/this.height,this.uvArray[6]=d.width/this.width,this.uvArray[7]=d.height/this.height,a.bufferSubData(a.ARRAY_BUFFER,0,this.uvArray);var h=e,i=this.texturePool.pop();i||(i=new b.FilterTexture(this.gl,this.width,this.height)),i.resize(this.width,this.height),a.bindFramebuffer(a.FRAMEBUFFER,i.frameBuffer),a.clear(a.COLOR_BUFFER_BIT),a.disable(a.BLEND);for(var j=0;j<c.filterPasses.length-1;j++){var k=c.filterPasses[j];a.bindFramebuffer(a.FRAMEBUFFER,i.frameBuffer),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,h.texture),this.applyFilterPass(k,d,d.width,d.height);var l=h;h=i,i=l}a.enable(a.BLEND),e=h,this.texturePool.push(i)}var m=c.filterPasses[c.filterPasses.length-1];this.offsetX-=d.x,this.offsetY-=d.y;var n=this.width,o=this.height,p=0,q=0,r=this.buffer;if(0===this.filterStack.length)a.colorMask(!0,!0,!0,!0);else{var s=this.filterStack[this.filterStack.length-1];d=s._filterArea,n=d.width,o=d.height,p=d.x,q=d.y,r=s._glFilterTexture.frameBuffer}f.x=n/2,f.y=-o/2,g.x=p,g.y=q,d=c._filterArea;var t=d.x-p,u=d.y-q;a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),this.vertexArray[0]=t,this.vertexArray[1]=u+d.height,this.vertexArray[2]=t+d.width,this.vertexArray[3]=u+d.height,this.vertexArray[4]=t,this.vertexArray[5]=u,this.vertexArray[6]=t+d.width,this.vertexArray[7]=u,a.bufferSubData(a.ARRAY_BUFFER,0,this.vertexArray),a.bindBuffer(a.ARRAY_BUFFER,this.uvBuffer),this.uvArray[2]=d.width/this.width,this.uvArray[5]=d.height/this.height,this.uvArray[6]=d.width/this.width,this.uvArray[7]=d.height/this.height,a.bufferSubData(a.ARRAY_BUFFER,0,this.uvArray),a.viewport(0,0,n,o),a.bindFramebuffer(a.FRAMEBUFFER,r),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,e.texture),this.applyFilterPass(m,d,n,o),this.renderSession.shaderManager.setShader(this.defaultShader),a.uniform2f(this.defaultShader.projectionVector,n/2,-o/2),a.uniform2f(this.defaultShader.offsetVector,-p,-q),this.texturePool.push(e),c._glFilterTexture=null},b.WebGLFilterManager.prototype.applyFilterPass=function(a,c,d,e){var f=this.gl,g=a.shaders[f.id];g||(g=new b.PixiShader(f),g.fragmentSrc=a.fragmentSrc,g.uniforms=a.uniforms,g.init(),a.shaders[f.id]=g),this.renderSession.shaderManager.setShader(g),f.uniform2f(g.projectionVector,d/2,-e/2),f.uniform2f(g.offsetVector,0,0),a.uniforms.dimensions&&(a.uniforms.dimensions.value[0]=this.width,a.uniforms.dimensions.value[1]=this.height,a.uniforms.dimensions.value[2]=this.vertexArray[0],a.uniforms.dimensions.value[3]=this.vertexArray[5]),g.syncUniforms(),f.bindBuffer(f.ARRAY_BUFFER,this.vertexBuffer),f.vertexAttribPointer(g.aVertexPosition,2,f.FLOAT,!1,0,0),f.bindBuffer(f.ARRAY_BUFFER,this.uvBuffer),f.vertexAttribPointer(g.aTextureCoord,2,f.FLOAT,!1,0,0),f.bindBuffer(f.ARRAY_BUFFER,this.colorBuffer),f.vertexAttribPointer(g.colorAttribute,2,f.FLOAT,!1,0,0),f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,this.indexBuffer),f.drawElements(f.TRIANGLES,6,f.UNSIGNED_SHORT,0),this.renderSession.drawCount++},b.WebGLFilterManager.prototype.initShaderBuffers=function(){var a=this.gl;this.vertexBuffer=a.createBuffer(),this.uvBuffer=a.createBuffer(),this.colorBuffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),this.vertexArray=new Float32Array([0,0,1,0,0,1,1,1]),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bufferData(a.ARRAY_BUFFER,this.vertexArray,a.STATIC_DRAW),this.uvArray=new Float32Array([0,0,1,0,0,1,1,1]),a.bindBuffer(a.ARRAY_BUFFER,this.uvBuffer),a.bufferData(a.ARRAY_BUFFER,this.uvArray,a.STATIC_DRAW),this.colorArray=new Float32Array([1,16777215,1,16777215,1,16777215,1,16777215]),a.bindBuffer(a.ARRAY_BUFFER,this.colorBuffer),a.bufferData(a.ARRAY_BUFFER,this.colorArray,a.STATIC_DRAW),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,1,3,2]),a.STATIC_DRAW)},b.WebGLFilterManager.prototype.destroy=function(){var a=this.gl;this.filterStack=null,this.offsetX=0,this.offsetY=0;for(var b=0;b<this.texturePool.length;b++)this.texturePool[b].destroy();this.texturePool=null,a.deleteBuffer(this.vertexBuffer),a.deleteBuffer(this.uvBuffer),a.deleteBuffer(this.colorBuffer),a.deleteBuffer(this.indexBuffer)},b.FilterTexture=function(a,c,d,e){this.gl=a,this.frameBuffer=a.createFramebuffer(),this.texture=a.createTexture(),e=e||b.scaleModes.DEFAULT,a.bindTexture(a.TEXTURE_2D,this.texture),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,e===b.scaleModes.LINEAR?a.LINEAR:a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,e===b.scaleModes.LINEAR?a.LINEAR:a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.bindFramebuffer(a.FRAMEBUFFER,this.framebuffer),a.bindFramebuffer(a.FRAMEBUFFER,this.frameBuffer),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,this.texture,0),this.renderBuffer=a.createRenderbuffer(),a.bindRenderbuffer(a.RENDERBUFFER,this.renderBuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.RENDERBUFFER,this.renderBuffer),this.resize(c,d)},b.FilterTexture.prototype.clear=function(){var a=this.gl;a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT)},b.FilterTexture.prototype.resize=function(a,b){if(this.width!==a||this.height!==b){this.width=a,this.height=b;var c=this.gl;c.bindTexture(c.TEXTURE_2D,this.texture),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,a,b,0,c.RGBA,c.UNSIGNED_BYTE,null),c.bindRenderbuffer(c.RENDERBUFFER,this.renderBuffer),c.renderbufferStorage(c.RENDERBUFFER,c.DEPTH_STENCIL,a,b)}},b.FilterTexture.prototype.destroy=function(){var a=this.gl;a.deleteFramebuffer(this.frameBuffer),a.deleteTexture(this.texture),this.frameBuffer=null,this.texture=null},b.CanvasMaskManager=function(){},b.CanvasMaskManager.prototype.pushMask=function(a,c){c.save();var d=a.alpha,e=a.worldTransform;c.setTransform(e.a,e.c,e.b,e.d,e.tx,e.ty),b.CanvasGraphics.renderGraphicsMask(a,c),c.clip(),a.worldAlpha=d},b.CanvasMaskManager.prototype.popMask=function(a){a.restore()},b.CanvasTinter=function(){},b.CanvasTinter.getTintedTexture=function(a,c){var d=a.texture;c=b.CanvasTinter.roundColor(c);var e="#"+("00000"+(0|c).toString(16)).substr(-6);if(d.tintCache=d.tintCache||{},d.tintCache[e])return d.tintCache[e];var f=b.CanvasTinter.canvas||document.createElement("canvas");if(b.CanvasTinter.tintMethod(d,c,f),b.CanvasTinter.convertTintToImage){var g=new Image;g.src=f.toDataURL(),d.tintCache[e]=g}else d.tintCache[e]=f,b.CanvasTinter.canvas=null;return f},b.CanvasTinter.tintWithMultiply=function(a,b,c){var d=c.getContext("2d"),e=a.frame;c.width=e.width,c.height=e.height,d.fillStyle="#"+("00000"+(0|b).toString(16)).substr(-6),d.fillRect(0,0,e.width,e.height),d.globalCompositeOperation="multiply",d.drawImage(a.baseTexture.source,e.x,e.y,e.width,e.height,0,0,e.width,e.height),d.globalCompositeOperation="destination-atop",d.drawImage(a.baseTexture.source,e.x,e.y,e.width,e.height,0,0,e.width,e.height)},b.CanvasTinter.tintWithOverlay=function(a,b,c){var d=c.getContext("2d"),e=a.frame;c.width=e.width,c.height=e.height,d.globalCompositeOperation="copy",d.fillStyle="#"+("00000"+(0|b).toString(16)).substr(-6),d.fillRect(0,0,e.width,e.height),d.globalCompositeOperation="destination-atop",d.drawImage(a.baseTexture.source,e.x,e.y,e.width,e.height,0,0,e.width,e.height)},b.CanvasTinter.tintWithPerPixel=function(a,c,d){var e=d.getContext("2d"),f=a.frame;d.width=f.width,d.height=f.height,e.globalCompositeOperation="copy",e.drawImage(a.baseTexture.source,f.x,f.y,f.width,f.height,0,0,f.width,f.height);for(var g=b.hex2rgb(c),h=g[0],i=g[1],j=g[2],k=e.getImageData(0,0,f.width,f.height),l=k.data,m=0;m<l.length;m+=4)l[m+0]*=h,l[m+1]*=i,l[m+2]*=j;e.putImageData(k,0,0)},b.CanvasTinter.roundColor=function(a){var c=b.CanvasTinter.cacheStepsPerColorChannel,d=b.hex2rgb(a);return d[0]=Math.min(255,d[0]/c*c),d[1]=Math.min(255,d[1]/c*c),d[2]=Math.min(255,d[2]/c*c),b.rgb2hex(d)},b.CanvasTinter.cacheStepsPerColorChannel=8,b.CanvasTinter.convertTintToImage=!1,b.CanvasTinter.canUseMultiply=b.canUseNewCanvasBlendModes(),b.CanvasTinter.tintMethod=b.CanvasTinter.canUseMultiply?b.CanvasTinter.tintWithMultiply:b.CanvasTinter.tintWithPerPixel,b.CanvasRenderer=function(a,c,d,e){b.defaultRenderer||(b.sayHello("Canvas"),b.defaultRenderer=this),this.type=b.CANVAS_RENDERER,this.clearBeforeRender=!0,this.transparent=!!e,b.blendModesCanvas||(b.blendModesCanvas=[],b.canUseNewCanvasBlendModes()?(b.blendModesCanvas[b.blendModes.NORMAL]="source-over",b.blendModesCanvas[b.blendModes.ADD]="lighter",b.blendModesCanvas[b.blendModes.MULTIPLY]="multiply",b.blendModesCanvas[b.blendModes.SCREEN]="screen",b.blendModesCanvas[b.blendModes.OVERLAY]="overlay",b.blendModesCanvas[b.blendModes.DARKEN]="darken",b.blendModesCanvas[b.blendModes.LIGHTEN]="lighten",b.blendModesCanvas[b.blendModes.COLOR_DODGE]="color-dodge",b.blendModesCanvas[b.blendModes.COLOR_BURN]="color-burn",b.blendModesCanvas[b.blendModes.HARD_LIGHT]="hard-light",b.blendModesCanvas[b.blendModes.SOFT_LIGHT]="soft-light",b.blendModesCanvas[b.blendModes.DIFFERENCE]="difference",b.blendModesCanvas[b.blendModes.EXCLUSION]="exclusion",b.blendModesCanvas[b.blendModes.HUE]="hue",b.blendModesCanvas[b.blendModes.SATURATION]="saturation",b.blendModesCanvas[b.blendModes.COLOR]="color",b.blendModesCanvas[b.blendModes.LUMINOSITY]="luminosity"):(b.blendModesCanvas[b.blendModes.NORMAL]="source-over",b.blendModesCanvas[b.blendModes.ADD]="lighter",b.blendModesCanvas[b.blendModes.MULTIPLY]="source-over",b.blendModesCanvas[b.blendModes.SCREEN]="source-over",b.blendModesCanvas[b.blendModes.OVERLAY]="source-over",b.blendModesCanvas[b.blendModes.DARKEN]="source-over",b.blendModesCanvas[b.blendModes.LIGHTEN]="source-over",b.blendModesCanvas[b.blendModes.COLOR_DODGE]="source-over",b.blendModesCanvas[b.blendModes.COLOR_BURN]="source-over",b.blendModesCanvas[b.blendModes.HARD_LIGHT]="source-over",b.blendModesCanvas[b.blendModes.SOFT_LIGHT]="source-over",b.blendModesCanvas[b.blendModes.DIFFERENCE]="source-over",b.blendModesCanvas[b.blendModes.EXCLUSION]="source-over",b.blendModesCanvas[b.blendModes.HUE]="source-over",b.blendModesCanvas[b.blendModes.SATURATION]="source-over",b.blendModesCanvas[b.blendModes.COLOR]="source-over",b.blendModesCanvas[b.blendModes.LUMINOSITY]="source-over")),this.width=a||800,this.height=c||600,this.view=d||document.createElement("canvas"),this.context=this.view.getContext("2d",{alpha:this.transparent}),this.refresh=!0,this.view.width=this.width,this.view.height=this.height,this.count=0,this.maskManager=new b.CanvasMaskManager,this.renderSession={context:this.context,maskManager:this.maskManager,scaleMode:null,smoothProperty:null,roundPixels:!1},"imageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="imageSmoothingEnabled":"webkitImageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="webkitImageSmoothingEnabled":"mozImageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="mozImageSmoothingEnabled":"oImageSmoothingEnabled"in this.context&&(this.renderSession.smoothProperty="oImageSmoothingEnabled")},b.CanvasRenderer.prototype.constructor=b.CanvasRenderer,b.CanvasRenderer.prototype.render=function(a){b.texturesToUpdate.length=0,b.texturesToDestroy.length=0,a.updateTransform(),this.context.setTransform(1,0,0,1,0,0),this.context.globalAlpha=1,navigator.isCocoonJS&&this.view.screencanvas&&(this.context.fillStyle="black",this.context.clear()),!this.transparent&&this.clearBeforeRender?(this.context.fillStyle=a.backgroundColorString,this.context.fillRect(0,0,this.width,this.height)):this.transparent&&this.clearBeforeRender&&this.context.clearRect(0,0,this.width,this.height),this.renderDisplayObject(a),a.interactive&&(a._interactiveEventsAdded||(a._interactiveEventsAdded=!0,a.interactionManager.setTarget(this))),b.Texture.frameUpdates.length>0&&(b.Texture.frameUpdates.length=0)
},b.CanvasRenderer.prototype.resize=function(a,b){this.width=a,this.height=b,this.view.width=a,this.view.height=b},b.CanvasRenderer.prototype.renderDisplayObject=function(a,b){this.renderSession.context=b||this.context,a._renderCanvas(this.renderSession)},b.CanvasRenderer.prototype.renderStripFlat=function(a){var b=this.context,c=a.verticies,d=c.length/2;this.count++,b.beginPath();for(var e=1;d-2>e;e++){var f=2*e,g=c[f],h=c[f+2],i=c[f+4],j=c[f+1],k=c[f+3],l=c[f+5];b.moveTo(g,j),b.lineTo(h,k),b.lineTo(i,l)}b.fillStyle="#FF0000",b.fill(),b.closePath()},b.CanvasRenderer.prototype.renderStrip=function(a){var b=this.context,c=a.verticies,d=a.uvs,e=c.length/2;this.count++;for(var f=1;e-2>f;f++){var g=2*f,h=c[g],i=c[g+2],j=c[g+4],k=c[g+1],l=c[g+3],m=c[g+5],n=d[g]*a.texture.width,o=d[g+2]*a.texture.width,p=d[g+4]*a.texture.width,q=d[g+1]*a.texture.height,r=d[g+3]*a.texture.height,s=d[g+5]*a.texture.height;b.save(),b.beginPath(),b.moveTo(h,k),b.lineTo(i,l),b.lineTo(j,m),b.closePath(),b.clip();var t=n*r+q*p+o*s-r*p-q*o-n*s,u=h*r+q*j+i*s-r*j-q*i-h*s,v=n*i+h*p+o*j-i*p-h*o-n*j,w=n*r*j+q*i*p+h*o*s-h*r*p-q*o*j-n*i*s,x=k*r+q*m+l*s-r*m-q*l-k*s,y=n*l+k*p+o*m-l*p-k*o-n*m,z=n*r*m+q*l*p+k*o*s-k*r*p-q*o*m-n*l*s;b.transform(u/t,x/t,v/t,y/t,w/t,z/t),b.drawImage(a.texture.baseTexture.source,0,0),b.restore()}},b.CanvasBuffer=function(a,b){this.width=a,this.height=b,this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.canvas.width=a,this.canvas.height=b},b.CanvasBuffer.prototype.clear=function(){this.context.clearRect(0,0,this.width,this.height)},b.CanvasBuffer.prototype.resize=function(a,b){this.width=this.canvas.width=a,this.height=this.canvas.height=b},b.CanvasGraphics=function(){},b.CanvasGraphics.renderGraphics=function(a,c){for(var d=a.worldAlpha,e="",f=0;f<a.graphicsData.length;f++){var g=a.graphicsData[f],h=g.points;if(c.strokeStyle=e="#"+("00000"+(0|g.lineColor).toString(16)).substr(-6),c.lineWidth=g.lineWidth,g.type===b.Graphics.POLY){c.beginPath(),c.moveTo(h[0],h[1]);for(var i=1;i<h.length/2;i++)c.lineTo(h[2*i],h[2*i+1]);h[0]===h[h.length-2]&&h[1]===h[h.length-1]&&c.closePath(),g.fill&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fill()),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.stroke())}else if(g.type===b.Graphics.RECT)(g.fillColor||0===g.fillColor)&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fillRect(h[0],h[1],h[2],h[3])),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.strokeRect(h[0],h[1],h[2],h[3]));else if(g.type===b.Graphics.CIRC)c.beginPath(),c.arc(h[0],h[1],h[2],0,2*Math.PI),c.closePath(),g.fill&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fill()),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.stroke());else if(g.type===b.Graphics.ELIP){var j=g.points,k=2*j[2],l=2*j[3],m=j[0]-k/2,n=j[1]-l/2;c.beginPath();var o=.5522848,p=k/2*o,q=l/2*o,r=m+k,s=n+l,t=m+k/2,u=n+l/2;c.moveTo(m,u),c.bezierCurveTo(m,u-q,t-p,n,t,n),c.bezierCurveTo(t+p,n,r,u-q,r,u),c.bezierCurveTo(r,u+q,t+p,s,t,s),c.bezierCurveTo(t-p,s,m,u+q,m,u),c.closePath(),g.fill&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fill()),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.stroke())}else if(g.type===b.Graphics.RREC){var v=h[0],w=h[1],x=h[2],y=h[3],z=h[4],A=Math.min(x,y)/2|0;z=z>A?A:z,c.beginPath(),c.moveTo(v,w+z),c.lineTo(v,w+y-z),c.quadraticCurveTo(v,w+y,v+z,w+y),c.lineTo(v+x-z,w+y),c.quadraticCurveTo(v+x,w+y,v+x,w+y-z),c.lineTo(v+x,w+z),c.quadraticCurveTo(v+x,w,v+x-z,w),c.lineTo(v+z,w),c.quadraticCurveTo(v,w,v,w+z),c.closePath(),(g.fillColor||0===g.fillColor)&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fill()),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.stroke())}}},b.CanvasGraphics.renderGraphicsMask=function(a,c){var d=a.graphicsData.length;if(0!==d){d>1&&(d=1,window.console.log("Pixi.js warning: masks in canvas can only mask using the first path in the graphics object"));for(var e=0;1>e;e++){var f=a.graphicsData[e],g=f.points;if(f.type===b.Graphics.POLY){c.beginPath(),c.moveTo(g[0],g[1]);for(var h=1;h<g.length/2;h++)c.lineTo(g[2*h],g[2*h+1]);g[0]===g[g.length-2]&&g[1]===g[g.length-1]&&c.closePath()}else if(f.type===b.Graphics.RECT)c.beginPath(),c.rect(g[0],g[1],g[2],g[3]),c.closePath();else if(f.type===b.Graphics.CIRC)c.beginPath(),c.arc(g[0],g[1],g[2],0,2*Math.PI),c.closePath();else if(f.type===b.Graphics.ELIP){var i=f.points,j=2*i[2],k=2*i[3],l=i[0]-j/2,m=i[1]-k/2;c.beginPath();var n=.5522848,o=j/2*n,p=k/2*n,q=l+j,r=m+k,s=l+j/2,t=m+k/2;c.moveTo(l,t),c.bezierCurveTo(l,t-p,s-o,m,s,m),c.bezierCurveTo(s+o,m,q,t-p,q,t),c.bezierCurveTo(q,t+p,s+o,r,s,r),c.bezierCurveTo(s-o,r,l,t+p,l,t),c.closePath()}else if(f.type===b.Graphics.RREC){var u=g[0],v=g[1],w=g[2],x=g[3],y=g[4],z=Math.min(w,x)/2|0;y=y>z?z:y,c.beginPath(),c.moveTo(u,v+y),c.lineTo(u,v+x-y),c.quadraticCurveTo(u,v+x,u+y,v+x),c.lineTo(u+w-y,v+x),c.quadraticCurveTo(u+w,v+x,u+w,v+x-y),c.lineTo(u+w,v+y),c.quadraticCurveTo(u+w,v,u+w-y,v),c.lineTo(u+y,v),c.quadraticCurveTo(u,v,u,v+y),c.closePath()}}}},b.Graphics=function(){b.DisplayObjectContainer.call(this),this.renderable=!0,this.fillAlpha=1,this.lineWidth=0,this.lineColor="black",this.graphicsData=[],this.tint=16777215,this.blendMode=b.blendModes.NORMAL,this.currentPath={points:[]},this._webGL=[],this.isMask=!1,this.bounds=null,this.boundsPadding=10,this.dirty=!0},b.Graphics.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Graphics.prototype.constructor=b.Graphics,Object.defineProperty(b.Graphics.prototype,"cacheAsBitmap",{get:function(){return this._cacheAsBitmap},set:function(a){this._cacheAsBitmap=a,this._cacheAsBitmap?this._generateCachedSprite():(this.destroyCachedSprite(),this.dirty=!0)}}),b.Graphics.prototype.lineStyle=function(a,c,d){return this.currentPath.points.length||this.graphicsData.pop(),this.lineWidth=a||0,this.lineColor=c||0,this.lineAlpha=arguments.length<3?1:d,this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[],type:b.Graphics.POLY},this.graphicsData.push(this.currentPath),this},b.Graphics.prototype.moveTo=function(a,c){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath=this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[],type:b.Graphics.POLY},this.currentPath.points.push(a,c),this.graphicsData.push(this.currentPath),this},b.Graphics.prototype.lineTo=function(a,b){return this.currentPath.points.push(a,b),this.dirty=!0,this},b.Graphics.prototype.quadraticCurveTo=function(a,b,c,d){0===this.currentPath.points.length&&this.moveTo(0,0);var e,f,g=20,h=this.currentPath.points;0===h.length&&this.moveTo(0,0);for(var i=h[h.length-2],j=h[h.length-1],k=0,l=1;g>=l;l++)k=l/g,e=i+(a-i)*k,f=j+(b-j)*k,h.push(e+(a+(c-a)*k-e)*k,f+(b+(d-b)*k-f)*k);return this.dirty=!0,this},b.Graphics.prototype.bezierCurveTo=function(a,b,c,d,e,f){0===this.currentPath.points.length&&this.moveTo(0,0);for(var g,h,i,j,k,l=20,m=this.currentPath.points,n=m[m.length-2],o=m[m.length-1],p=0,q=1;l>q;q++)p=q/l,g=1-p,h=g*g,i=h*g,j=p*p,k=j*p,m.push(i*n+3*h*p*a+3*g*j*c+k*e,i*o+3*h*p*b+3*g*j*d+k*f);return this.dirty=!0,this},b.Graphics.prototype.arcTo=function(a,b,c,d,e){0===this.currentPath.points.length&&this.moveTo(a,b);var f=this.currentPath.points,g=f[f.length-2],h=f[f.length-1],i=h-b,j=g-a,k=d-b,l=c-a,m=Math.abs(i*l-j*k);if(1e-8>m||0===e)f.push(a,b);else{var n=i*i+j*j,o=k*k+l*l,p=i*k+j*l,q=e*Math.sqrt(n)/m,r=e*Math.sqrt(o)/m,s=q*p/n,t=r*p/o,u=q*l+r*j,v=q*k+r*i,w=j*(r+s),x=i*(r+s),y=l*(q+t),z=k*(q+t),A=Math.atan2(x-v,w-u),B=Math.atan2(z-v,y-u);this.arc(u+a,v+b,e,A,B,j*k>l*i)}return this.dirty=!0,this},b.Graphics.prototype.arc=function(a,b,c,d,e,f){var g=a+Math.cos(d)*c,h=b+Math.sin(d)*c,i=this.currentPath.points;if((0!==i.length&&i[i.length-2]!==g||i[i.length-1]!==h)&&(this.moveTo(g,h),i=this.currentPath.points),d===e)return this;!f&&d>=e?e+=2*Math.PI:f&&e>=d&&(d+=2*Math.PI);var j=f?-1*(d-e):e-d,k=Math.abs(j)/(2*Math.PI)*40;if(0===j)return this;for(var l=j/(2*k),m=2*l,n=Math.cos(l),o=Math.sin(l),p=k-1,q=p%1/p,r=0;p>=r;r++){var s=r+q*r,t=l+d+m*s,u=Math.cos(t),v=-Math.sin(t);i.push((n*u+o*v)*c+a,(n*-v+o*u)*c+b)}return this.dirty=!0,this},b.Graphics.prototype.drawPath=function(a){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath=this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[],type:b.Graphics.POLY},this.graphicsData.push(this.currentPath),this.currentPath.points=this.currentPath.points.concat(a),this.dirty=!0,this},b.Graphics.prototype.beginFill=function(a,b){return this.filling=!0,this.fillColor=a||0,this.fillAlpha=arguments.length<2?1:b,this},b.Graphics.prototype.endFill=function(){return this.filling=!1,this.fillColor=null,this.fillAlpha=1,this},b.Graphics.prototype.drawRect=function(a,c,d,e){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,c,d,e],type:b.Graphics.RECT},this.graphicsData.push(this.currentPath),this.dirty=!0,this},b.Graphics.prototype.drawRoundedRect=function(a,c,d,e,f){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,c,d,e,f],type:b.Graphics.RREC},this.graphicsData.push(this.currentPath),this.dirty=!0,this},b.Graphics.prototype.drawCircle=function(a,c,d){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,c,d,d],type:b.Graphics.CIRC},this.graphicsData.push(this.currentPath),this.dirty=!0,this},b.Graphics.prototype.drawEllipse=function(a,c,d,e){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,c,d,e],type:b.Graphics.ELIP},this.graphicsData.push(this.currentPath),this.dirty=!0,this},b.Graphics.prototype.clear=function(){return this.lineWidth=0,this.filling=!1,this.dirty=!0,this.clearDirty=!0,this.graphicsData=[],this.bounds=null,this},b.Graphics.prototype.generateTexture=function(){var a=this.getBounds(),c=new b.CanvasBuffer(a.width,a.height),d=b.Texture.fromCanvas(c.canvas);return c.context.translate(-a.x,-a.y),b.CanvasGraphics.renderGraphics(this,c.context),d},b.Graphics.prototype._renderWebGL=function(a){if(this.visible!==!1&&0!==this.alpha&&this.isMask!==!0){if(this._cacheAsBitmap)return this.dirty&&(this._generateCachedSprite(),b.updateWebGLTexture(this._cachedSprite.texture.baseTexture,a.gl),this.dirty=!1),this._cachedSprite.alpha=this.alpha,b.Sprite.prototype._renderWebGL.call(this._cachedSprite,a),void 0;if(a.spriteBatch.stop(),a.blendModeManager.setBlendMode(this.blendMode),this._mask&&a.maskManager.pushMask(this._mask,a),this._filters&&a.filterManager.pushFilter(this._filterBlock),this.blendMode!==a.spriteBatch.currentBlendMode){a.spriteBatch.currentBlendMode=this.blendMode;var c=b.blendModesWebGL[a.spriteBatch.currentBlendMode];a.spriteBatch.gl.blendFunc(c[0],c[1])}if(b.WebGLGraphics.renderGraphics(this,a),this.children.length){a.spriteBatch.start();for(var d=0,e=this.children.length;e>d;d++)this.children[d]._renderWebGL(a);a.spriteBatch.stop()}this._filters&&a.filterManager.popFilter(),this._mask&&a.maskManager.popMask(this.mask,a),a.drawCount++,a.spriteBatch.start()}},b.Graphics.prototype._renderCanvas=function(a){if(this.visible!==!1&&0!==this.alpha&&this.isMask!==!0){var c=a.context,d=this.worldTransform;this.blendMode!==a.currentBlendMode&&(a.currentBlendMode=this.blendMode,c.globalCompositeOperation=b.blendModesCanvas[a.currentBlendMode]),this._mask&&a.maskManager.pushMask(this._mask,a.context),c.setTransform(d.a,d.c,d.b,d.d,d.tx,d.ty),b.CanvasGraphics.renderGraphics(this,c);for(var e=0,f=this.children.length;f>e;e++)this.children[e]._renderCanvas(a);this._mask&&a.maskManager.popMask(a.context)}},b.Graphics.prototype.getBounds=function(a){this.bounds||this.updateBounds();var b=this.bounds.x,c=this.bounds.width+this.bounds.x,d=this.bounds.y,e=this.bounds.height+this.bounds.y,f=a||this.worldTransform,g=f.a,h=f.c,i=f.b,j=f.d,k=f.tx,l=f.ty,m=g*c+i*e+k,n=j*e+h*c+l,o=g*b+i*e+k,p=j*e+h*b+l,q=g*b+i*d+k,r=j*d+h*b+l,s=g*c+i*d+k,t=j*d+h*c+l,u=m,v=n,w=m,x=n;w=w>o?o:w,w=w>q?q:w,w=w>s?s:w,x=x>p?p:x,x=x>r?r:x,x=x>t?t:x,u=o>u?o:u,u=q>u?q:u,u=s>u?s:u,v=p>v?p:v,v=r>v?r:v,v=t>v?t:v;var y=this._bounds;return y.x=w,y.width=u-w,y.y=x,y.height=v-x,y},b.Graphics.prototype.updateBounds=function(){for(var a,c,d,e,f,g=1/0,h=-1/0,i=1/0,j=-1/0,k=0;k<this.graphicsData.length;k++){var l=this.graphicsData[k],m=l.type,n=l.lineWidth;if(a=l.points,m===b.Graphics.RECT)c=a[0]-n/2,d=a[1]-n/2,e=a[2]+n,f=a[3]+n,g=g>c?c:g,h=c+e>h?c+e:h,i=i>d?c:i,j=d+f>j?d+f:j;else if(m===b.Graphics.CIRC||m===b.Graphics.ELIP)c=a[0],d=a[1],e=a[2]+n/2,f=a[3]+n/2,g=g>c-e?c-e:g,h=c+e>h?c+e:h,i=i>d-f?d-f:i,j=d+f>j?d+f:j;else for(var o=0;o<a.length;o+=2)c=a[o],d=a[o+1],g=g>c-n?c-n:g,h=c+n>h?c+n:h,i=i>d-n?d-n:i,j=d+n>j?d+n:j}var p=this.boundsPadding;this.bounds=new b.Rectangle(g-p,i-p,h-g+2*p,j-i+2*p)},b.Graphics.prototype._generateCachedSprite=function(){var a=this.getLocalBounds();if(this._cachedSprite)this._cachedSprite.buffer.resize(a.width,a.height);else{var c=new b.CanvasBuffer(a.width,a.height),d=b.Texture.fromCanvas(c.canvas);this._cachedSprite=new b.Sprite(d),this._cachedSprite.buffer=c,this._cachedSprite.worldTransform=this.worldTransform}this._cachedSprite.anchor.x=-(a.x/a.width),this._cachedSprite.anchor.y=-(a.y/a.height),this._cachedSprite.buffer.context.translate(-a.x,-a.y),b.CanvasGraphics.renderGraphics(this,this._cachedSprite.buffer.context),this._cachedSprite.alpha=this.alpha},b.Graphics.prototype.destroyCachedSprite=function(){this._cachedSprite.texture.destroy(!0),this._cachedSprite=null},b.Graphics.POLY=0,b.Graphics.RECT=1,b.Graphics.CIRC=2,b.Graphics.ELIP=3,b.Graphics.RREC=4,b.Strip=function(a){b.DisplayObjectContainer.call(this),this.texture=a,this.uvs=new b.Float32Array([0,1,1,1,1,0,0,1]),this.verticies=new b.Float32Array([0,0,100,0,100,100,0,100]),this.colors=new b.Float32Array([1,1,1,1]),this.indices=new b.Uint16Array([0,1,2,3]),this.dirty=!0},b.Strip.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Strip.prototype.constructor=b.Strip,b.Strip.prototype._renderWebGL=function(a){!this.visible||this.alpha<=0||(a.spriteBatch.stop(),this._vertexBuffer||this._initWebGL(a),a.shaderManager.setShader(a.shaderManager.stripShader),this._renderStrip(a),a.spriteBatch.start())},b.Strip.prototype._initWebGL=function(a){var b=a.gl;this._vertexBuffer=b.createBuffer(),this._indexBuffer=b.createBuffer(),this._uvBuffer=b.createBuffer(),this._colorBuffer=b.createBuffer(),b.bindBuffer(b.ARRAY_BUFFER,this._vertexBuffer),b.bufferData(b.ARRAY_BUFFER,this.verticies,b.DYNAMIC_DRAW),b.bindBuffer(b.ARRAY_BUFFER,this._uvBuffer),b.bufferData(b.ARRAY_BUFFER,this.uvs,b.STATIC_DRAW),b.bindBuffer(b.ARRAY_BUFFER,this._colorBuffer),b.bufferData(b.ARRAY_BUFFER,this.colors,b.STATIC_DRAW),b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,this._indexBuffer),b.bufferData(b.ELEMENT_ARRAY_BUFFER,this.indices,b.STATIC_DRAW)},b.Strip.prototype._renderStrip=function(a){var c=a.gl,d=a.projection,e=a.offset,f=a.shaderManager.stripShader;c.blendFunc(c.ONE,c.ONE_MINUS_SRC_ALPHA),c.uniformMatrix3fv(f.translationMatrix,!1,this.worldTransform.toArray(!0)),c.uniform2f(f.projectionVector,d.x,-d.y),c.uniform2f(f.offsetVector,-e.x,-e.y),c.uniform1f(f.alpha,1),this.dirty?(this.dirty=!1,c.bindBuffer(c.ARRAY_BUFFER,this._vertexBuffer),c.bufferData(c.ARRAY_BUFFER,this.verticies,c.STATIC_DRAW),c.vertexAttribPointer(f.aVertexPosition,2,c.FLOAT,!1,0,0),c.bindBuffer(c.ARRAY_BUFFER,this._uvBuffer),c.bufferData(c.ARRAY_BUFFER,this.uvs,c.STATIC_DRAW),c.vertexAttribPointer(f.aTextureCoord,2,c.FLOAT,!1,0,0),c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,this.texture.baseTexture._glTextures[c.id]||b.createWebGLTexture(this.texture.baseTexture,c)),c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,this._indexBuffer),c.bufferData(c.ELEMENT_ARRAY_BUFFER,this.indices,c.STATIC_DRAW)):(c.bindBuffer(c.ARRAY_BUFFER,this._vertexBuffer),c.bufferSubData(c.ARRAY_BUFFER,0,this.verticies),c.vertexAttribPointer(f.aVertexPosition,2,c.FLOAT,!1,0,0),c.bindBuffer(c.ARRAY_BUFFER,this._uvBuffer),c.vertexAttribPointer(f.aTextureCoord,2,c.FLOAT,!1,0,0),c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,this.texture.baseTexture._glTextures[c.id]||b.createWebGLTexture(this.texture.baseTexture,c)),c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,this._indexBuffer)),c.drawElements(c.TRIANGLE_STRIP,this.indices.length,c.UNSIGNED_SHORT,0)},b.Strip.prototype._renderCanvas=function(a){var b=a.context,c=this.worldTransform;a.roundPixels?b.setTransform(c.a,c.c,c.b,c.d,0|c.tx,0|c.ty):b.setTransform(c.a,c.c,c.b,c.d,c.tx,c.ty);var d=this,e=d.verticies,f=d.uvs,g=e.length/2;this.count++;for(var h=0;g-2>h;h++){var i=2*h,j=e[i],k=e[i+2],l=e[i+4],m=e[i+1],n=e[i+3],o=e[i+5],p=(j+k+l)/3,q=(m+n+o)/3,r=j-p,s=m-q,t=Math.sqrt(r*r+s*s);j=p+r/t*(t+3),m=q+s/t*(t+3),r=k-p,s=n-q,t=Math.sqrt(r*r+s*s),k=p+r/t*(t+3),n=q+s/t*(t+3),r=l-p,s=o-q,t=Math.sqrt(r*r+s*s),l=p+r/t*(t+3),o=q+s/t*(t+3);var u=f[i]*d.texture.width,v=f[i+2]*d.texture.width,w=f[i+4]*d.texture.width,x=f[i+1]*d.texture.height,y=f[i+3]*d.texture.height,z=f[i+5]*d.texture.height;b.save(),b.beginPath(),b.moveTo(j,m),b.lineTo(k,n),b.lineTo(l,o),b.closePath(),b.clip();var A=u*y+x*w+v*z-y*w-x*v-u*z,B=j*y+x*l+k*z-y*l-x*k-j*z,C=u*k+j*w+v*l-k*w-j*v-u*l,D=u*y*l+x*k*w+j*v*z-j*y*w-x*v*l-u*k*z,E=m*y+x*o+n*z-y*o-x*n-m*z,F=u*n+m*w+v*o-n*w-m*v-u*o,G=u*y*o+x*n*w+m*v*z-m*y*w-x*v*o-u*n*z;b.transform(B/A,E/A,C/A,F/A,D/A,G/A),b.drawImage(d.texture.baseTexture.source,0,0),b.restore()}},b.Strip.prototype.onTextureUpdate=function(){this.updateFrame=!0},b.Rope=function(a,c){b.Strip.call(this,a),this.points=c,this.verticies=new b.Float32Array(4*c.length),this.uvs=new b.Float32Array(4*c.length),this.colors=new b.Float32Array(2*c.length),this.indices=new b.Uint16Array(2*c.length),this.refresh()},b.Rope.prototype=Object.create(b.Strip.prototype),b.Rope.prototype.constructor=b.Rope,b.Rope.prototype.refresh=function(){var a=this.points;if(!(a.length<1)){var b=this.uvs,c=a[0],d=this.indices,e=this.colors;this.count-=.2,b[0]=0,b[1]=0,b[2]=0,b[3]=1,e[0]=1,e[1]=1,d[0]=0,d[1]=1;for(var f,g,h,i=a.length,j=1;i>j;j++)f=a[j],g=4*j,h=j/(i-1),j%2?(b[g]=h,b[g+1]=0,b[g+2]=h,b[g+3]=1):(b[g]=h,b[g+1]=0,b[g+2]=h,b[g+3]=1),g=2*j,e[g]=1,e[g+1]=1,g=2*j,d[g]=g,d[g+1]=g+1,c=f}},b.Rope.prototype.updateTransform=function(){var a=this.points;if(!(a.length<1)){var c,d=a[0],e={x:0,y:0};this.count-=.2;for(var f,g,h,i,j,k=this.verticies,l=a.length,m=0;l>m;m++)f=a[m],g=4*m,c=m<a.length-1?a[m+1]:f,e.y=-(c.x-d.x),e.x=c.y-d.y,h=10*(1-m/(l-1)),h>1&&(h=1),i=Math.sqrt(e.x*e.x+e.y*e.y),j=this.texture.height/2,e.x/=i,e.y/=i,e.x*=j,e.y*=j,k[g]=f.x+e.x,k[g+1]=f.y+e.y,k[g+2]=f.x-e.x,k[g+3]=f.y-e.y,d=f;b.DisplayObjectContainer.prototype.updateTransform.call(this)}},b.Rope.prototype.setTexture=function(a){this.texture=a},b.TilingSprite=function(a,c,d){b.Sprite.call(this,a),this._width=c||100,this._height=d||100,this.tileScale=new b.Point(1,1),this.tileScaleOffset=new b.Point(1,1),this.tilePosition=new b.Point(0,0),this.renderable=!0,this.tint=16777215,this.blendMode=b.blendModes.NORMAL},b.TilingSprite.prototype=Object.create(b.Sprite.prototype),b.TilingSprite.prototype.constructor=b.TilingSprite,Object.defineProperty(b.TilingSprite.prototype,"width",{get:function(){return this._width},set:function(a){this._width=a}}),Object.defineProperty(b.TilingSprite.prototype,"height",{get:function(){return this._height},set:function(a){this._height=a}}),b.TilingSprite.prototype.setTexture=function(a){this.texture!==a&&(this.texture=a,this.refreshTexture=!0,this.cachedTint=16777215)},b.TilingSprite.prototype._renderWebGL=function(a){if(this.visible!==!1&&0!==this.alpha){var c,d;for(this._mask&&(a.spriteBatch.stop(),a.maskManager.pushMask(this.mask,a),a.spriteBatch.start()),this._filters&&(a.spriteBatch.flush(),a.filterManager.pushFilter(this._filterBlock)),!this.tilingTexture||this.refreshTexture?(this.generateTilingTexture(!0),this.tilingTexture&&this.tilingTexture.needsUpdate&&(b.updateWebGLTexture(this.tilingTexture.baseTexture,a.gl),this.tilingTexture.needsUpdate=!1)):a.spriteBatch.renderTilingSprite(this),c=0,d=this.children.length;d>c;c++)this.children[c]._renderWebGL(a);a.spriteBatch.stop(),this._filters&&a.filterManager.popFilter(),this._mask&&a.maskManager.popMask(a),a.spriteBatch.start()}},b.TilingSprite.prototype._renderCanvas=function(a){if(this.visible!==!1&&0!==this.alpha){var c=a.context;this._mask&&a.maskManager.pushMask(this._mask,c),c.globalAlpha=this.worldAlpha;var d,e,f=this.worldTransform;if(c.setTransform(f.a,f.c,f.b,f.d,f.tx,f.ty),!this.__tilePattern||this.refreshTexture){if(this.generateTilingTexture(!1),!this.tilingTexture)return;this.__tilePattern=c.createPattern(this.tilingTexture.baseTexture.source,"repeat")}this.blendMode!==a.currentBlendMode&&(a.currentBlendMode=this.blendMode,c.globalCompositeOperation=b.blendModesCanvas[a.currentBlendMode]);var g=this.tilePosition,h=this.tileScale;for(g.x%=this.tilingTexture.baseTexture.width,g.y%=this.tilingTexture.baseTexture.height,c.scale(h.x,h.y),c.translate(g.x,g.y),c.fillStyle=this.__tilePattern,c.fillRect(-g.x+this.anchor.x*-this._width,-g.y+this.anchor.y*-this._height,this._width/h.x,this._height/h.y),c.scale(1/h.x,1/h.y),c.translate(-g.x,-g.y),this._mask&&a.maskManager.popMask(a.context),d=0,e=this.children.length;e>d;d++)this.children[d]._renderCanvas(a)}},b.TilingSprite.prototype.getBounds=function(){var a=this._width,b=this._height,c=a*(1-this.anchor.x),d=a*-this.anchor.x,e=b*(1-this.anchor.y),f=b*-this.anchor.y,g=this.worldTransform,h=g.a,i=g.c,j=g.b,k=g.d,l=g.tx,m=g.ty,n=h*d+j*f+l,o=k*f+i*d+m,p=h*c+j*f+l,q=k*f+i*c+m,r=h*c+j*e+l,s=k*e+i*c+m,t=h*d+j*e+l,u=k*e+i*d+m,v=-1/0,w=-1/0,x=1/0,y=1/0;x=x>n?n:x,x=x>p?p:x,x=x>r?r:x,x=x>t?t:x,y=y>o?o:y,y=y>q?q:y,y=y>s?s:y,y=y>u?u:y,v=n>v?n:v,v=p>v?p:v,v=r>v?r:v,v=t>v?t:v,w=o>w?o:w,w=q>w?q:w,w=s>w?s:w,w=u>w?u:w;var z=this._bounds;return z.x=x,z.width=v-x,z.y=y,z.height=w-y,this._currentBounds=z,z},b.TilingSprite.prototype.onTextureUpdate=function(){},b.TilingSprite.prototype.generateTilingTexture=function(a){if(this.texture.baseTexture.hasLoaded){var c,d,e=this.texture,f=e.frame,g=f.width!==e.baseTexture.width||f.height!==e.baseTexture.height,h=!1;if(a?(c=b.getNextPowerOfTwo(f.width),d=b.getNextPowerOfTwo(f.height),(f.width!==c||f.height!==d)&&(h=!0)):g&&(c=f.width,d=f.height,h=!0),h){var i;this.tilingTexture&&this.tilingTexture.isTiling?(i=this.tilingTexture.canvasBuffer,i.resize(c,d),this.tilingTexture.baseTexture.width=c,this.tilingTexture.baseTexture.height=d,this.tilingTexture.needsUpdate=!0):(i=new b.CanvasBuffer(c,d),this.tilingTexture=b.Texture.fromCanvas(i.canvas),this.tilingTexture.canvasBuffer=i,this.tilingTexture.isTiling=!0),i.context.drawImage(e.baseTexture.source,e.crop.x,e.crop.y,e.crop.width,e.crop.height,0,0,c,d),this.tileScaleOffset.x=f.width/c,this.tileScaleOffset.y=f.height/d}else this.tilingTexture&&this.tilingTexture.isTiling&&this.tilingTexture.destroy(!0),this.tileScaleOffset.x=1,this.tileScaleOffset.y=1,this.tilingTexture=e;this.refreshTexture=!1,this.tilingTexture.baseTexture._powerOf2=!0}};var f={};f.BoneData=function(a,b){this.name=a,this.parent=b},f.BoneData.prototype={length:0,x:0,y:0,rotation:0,scaleX:1,scaleY:1},f.SlotData=function(a,b){this.name=a,this.boneData=b},f.SlotData.prototype={r:1,g:1,b:1,a:1,attachmentName:null},f.Bone=function(a,b){this.data=a,this.parent=b,this.setToSetupPose()},f.Bone.yDown=!1,f.Bone.prototype={x:0,y:0,rotation:0,scaleX:1,scaleY:1,m00:0,m01:0,worldX:0,m10:0,m11:0,worldY:0,worldRotation:0,worldScaleX:1,worldScaleY:1,updateWorldTransform:function(a,b){var c=this.parent;null!=c?(this.worldX=this.x*c.m00+this.y*c.m01+c.worldX,this.worldY=this.x*c.m10+this.y*c.m11+c.worldY,this.worldScaleX=c.worldScaleX*this.scaleX,this.worldScaleY=c.worldScaleY*this.scaleY,this.worldRotation=c.worldRotation+this.rotation):(this.worldX=this.x,this.worldY=this.y,this.worldScaleX=this.scaleX,this.worldScaleY=this.scaleY,this.worldRotation=this.rotation);var d=this.worldRotation*Math.PI/180,e=Math.cos(d),g=Math.sin(d);this.m00=e*this.worldScaleX,this.m10=g*this.worldScaleX,this.m01=-g*this.worldScaleY,this.m11=e*this.worldScaleY,a&&(this.m00=-this.m00,this.m01=-this.m01),b&&(this.m10=-this.m10,this.m11=-this.m11),f.Bone.yDown&&(this.m10=-this.m10,this.m11=-this.m11)},setToSetupPose:function(){var a=this.data;this.x=a.x,this.y=a.y,this.rotation=a.rotation,this.scaleX=a.scaleX,this.scaleY=a.scaleY}},f.Slot=function(a,b,c){this.data=a,this.skeleton=b,this.bone=c,this.setToSetupPose()},f.Slot.prototype={r:1,g:1,b:1,a:1,_attachmentTime:0,attachment:null,setAttachment:function(a){this.attachment=a,this._attachmentTime=this.skeleton.time},setAttachmentTime:function(a){this._attachmentTime=this.skeleton.time-a},getAttachmentTime:function(){return this.skeleton.time-this._attachmentTime},setToSetupPose:function(){var a=this.data;this.r=a.r,this.g=a.g,this.b=a.b,this.a=a.a;for(var b=this.skeleton.data.slots,c=0,d=b.length;d>c;c++)if(b[c]==a){this.setAttachment(a.attachmentName?this.skeleton.getAttachmentBySlotIndex(c,a.attachmentName):null);break}}},f.Skin=function(a){this.name=a,this.attachments={}},f.Skin.prototype={addAttachment:function(a,b,c){this.attachments[a+":"+b]=c},getAttachment:function(a,b){return this.attachments[a+":"+b]},_attachAll:function(a,b){for(var c in b.attachments){var d=c.indexOf(":"),e=parseInt(c.substring(0,d),10),f=c.substring(d+1),g=a.slots[e];if(g.attachment&&g.attachment.name==f){var h=this.getAttachment(e,f);h&&g.setAttachment(h)}}}},f.Animation=function(a,b,c){this.name=a,this.timelines=b,this.duration=c},f.Animation.prototype={apply:function(a,b,c){c&&this.duration&&(b%=this.duration);for(var d=this.timelines,e=0,f=d.length;f>e;e++)d[e].apply(a,b,1)},mix:function(a,b,c,d){c&&this.duration&&(b%=this.duration);for(var e=this.timelines,f=0,g=e.length;g>f;f++)e[f].apply(a,b,d)}},f.binarySearch=function(a,b,c){var d=0,e=Math.floor(a.length/c)-2;if(!e)return c;for(var f=e>>>1;;){if(a[(f+1)*c]<=b?d=f+1:e=f,d==e)return(d+1)*c;f=d+e>>>1}},f.linearSearch=function(a,b,c){for(var d=0,e=a.length-c;e>=d;d+=c)if(a[d]>b)return d;return-1},f.Curves=function(a){this.curves=[],this.curves.length=6*(a-1)},f.Curves.prototype={setLinear:function(a){this.curves[6*a]=0},setStepped:function(a){this.curves[6*a]=-1},setCurve:function(a,b,c,d,e){var f=.1,g=f*f,h=g*f,i=3*f,j=3*g,k=6*g,l=6*h,m=2*-b+d,n=2*-c+e,o=3*(b-d)+1,p=3*(c-e)+1,q=6*a,r=this.curves;r[q]=b*i+m*j+o*h,r[q+1]=c*i+n*j+p*h,r[q+2]=m*k+o*l,r[q+3]=n*k+p*l,r[q+4]=o*l,r[q+5]=p*l},getCurvePercent:function(a,b){b=0>b?0:b>1?1:b;var c=6*a,d=this.curves,e=d[c];if(!e)return b;if(-1==e)return 0;for(var f=d[c+1],g=d[c+2],h=d[c+3],i=d[c+4],j=d[c+5],k=e,l=f,m=8;;){if(k>=b){var n=k-e,o=l-f;return o+(l-o)*(b-n)/(k-n)}if(!m)break;m--,e+=g,f+=h,g+=i,h+=j,k+=e,l+=f}return l+(1-l)*(b-k)/(1-k)}},f.RotateTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=2*a},f.RotateTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/2},setFrame:function(a,b,c){a*=2,this.frames[a]=b,this.frames[a+1]=c},apply:function(a,b,c){var d,e=this.frames;if(!(b<e[0])){var g=a.bones[this.boneIndex];if(b>=e[e.length-2]){for(d=g.data.rotation+e[e.length-1]-g.rotation;d>180;)d-=360;for(;-180>d;)d+=360;return g.rotation+=d*c,void 0}var h=f.binarySearch(e,b,2),i=e[h-1],j=e[h],k=1-(b-j)/(e[h-2]-j);for(k=this.curves.getCurvePercent(h/2-1,k),d=e[h+1]-i;d>180;)d-=360;for(;-180>d;)d+=360;for(d=g.data.rotation+(i+d*k)-g.rotation;d>180;)d-=360;for(;-180>d;)d+=360;g.rotation+=d*c}}},f.TranslateTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=3*a},f.TranslateTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/3},setFrame:function(a,b,c,d){a*=3,this.frames[a]=b,this.frames[a+1]=c,this.frames[a+2]=d},apply:function(a,b,c){var d=this.frames;if(!(b<d[0])){var e=a.bones[this.boneIndex];if(b>=d[d.length-3])return e.x+=(e.data.x+d[d.length-2]-e.x)*c,e.y+=(e.data.y+d[d.length-1]-e.y)*c,void 0;var g=f.binarySearch(d,b,3),h=d[g-2],i=d[g-1],j=d[g],k=1-(b-j)/(d[g+-3]-j);k=this.curves.getCurvePercent(g/3-1,k),e.x+=(e.data.x+h+(d[g+1]-h)*k-e.x)*c,e.y+=(e.data.y+i+(d[g+2]-i)*k-e.y)*c}}},f.ScaleTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=3*a},f.ScaleTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/3},setFrame:function(a,b,c,d){a*=3,this.frames[a]=b,this.frames[a+1]=c,this.frames[a+2]=d},apply:function(a,b,c){var d=this.frames;if(!(b<d[0])){var e=a.bones[this.boneIndex];if(b>=d[d.length-3])return e.scaleX+=(e.data.scaleX-1+d[d.length-2]-e.scaleX)*c,e.scaleY+=(e.data.scaleY-1+d[d.length-1]-e.scaleY)*c,void 0;var g=f.binarySearch(d,b,3),h=d[g-2],i=d[g-1],j=d[g],k=1-(b-j)/(d[g+-3]-j);k=this.curves.getCurvePercent(g/3-1,k),e.scaleX+=(e.data.scaleX-1+h+(d[g+1]-h)*k-e.scaleX)*c,e.scaleY+=(e.data.scaleY-1+i+(d[g+2]-i)*k-e.scaleY)*c}}},f.ColorTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=5*a},f.ColorTimeline.prototype={slotIndex:0,getFrameCount:function(){return this.frames.length/5},setFrame:function(a,b,c,d,e,f){a*=5,this.frames[a]=b,this.frames[a+1]=c,this.frames[a+2]=d,this.frames[a+3]=e,this.frames[a+4]=f},apply:function(a,b,c){var d=this.frames;if(!(b<d[0])){var e=a.slots[this.slotIndex];if(b>=d[d.length-5]){var g=d.length-1;return e.r=d[g-3],e.g=d[g-2],e.b=d[g-1],e.a=d[g],void 0}var h=f.binarySearch(d,b,5),i=d[h-4],j=d[h-3],k=d[h-2],l=d[h-1],m=d[h],n=1-(b-m)/(d[h-5]-m);n=this.curves.getCurvePercent(h/5-1,n);var o=i+(d[h+1]-i)*n,p=j+(d[h+2]-j)*n,q=k+(d[h+3]-k)*n,r=l+(d[h+4]-l)*n;1>c?(e.r+=(o-e.r)*c,e.g+=(p-e.g)*c,e.b+=(q-e.b)*c,e.a+=(r-e.a)*c):(e.r=o,e.g=p,e.b=q,e.a=r)}}},f.AttachmentTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=a,this.attachmentNames=[],this.attachmentNames.length=a},f.AttachmentTimeline.prototype={slotIndex:0,getFrameCount:function(){return this.frames.length},setFrame:function(a,b,c){this.frames[a]=b,this.attachmentNames[a]=c},apply:function(a,b){var c=this.frames;if(!(b<c[0])){var d;d=b>=c[c.length-1]?c.length-1:f.binarySearch(c,b,1)-1;var e=this.attachmentNames[d];a.slots[this.slotIndex].setAttachment(e?a.getAttachmentBySlotIndex(this.slotIndex,e):null)}}},f.SkeletonData=function(){this.bones=[],this.slots=[],this.skins=[],this.animations=[]},f.SkeletonData.prototype={defaultSkin:null,findBone:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},findBoneIndex:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].name==a)return c;return-1},findSlot:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].name==a)return slot[c];return null},findSlotIndex:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].name==a)return c;return-1},findSkin:function(a){for(var b=this.skins,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},findAnimation:function(a){for(var b=this.animations,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null}},f.Skeleton=function(a){this.data=a,this.bones=[];
for(var b=0,c=a.bones.length;c>b;b++){var d=a.bones[b],e=d.parent?this.bones[a.bones.indexOf(d.parent)]:null;this.bones.push(new f.Bone(d,e))}for(this.slots=[],this.drawOrder=[],b=0,c=a.slots.length;c>b;b++){var g=a.slots[b],h=this.bones[a.bones.indexOf(g.boneData)],i=new f.Slot(g,this,h);this.slots.push(i),this.drawOrder.push(i)}},f.Skeleton.prototype={x:0,y:0,skin:null,r:1,g:1,b:1,a:1,time:0,flipX:!1,flipY:!1,updateWorldTransform:function(){for(var a=this.flipX,b=this.flipY,c=this.bones,d=0,e=c.length;e>d;d++)c[d].updateWorldTransform(a,b)},setToSetupPose:function(){this.setBonesToSetupPose(),this.setSlotsToSetupPose()},setBonesToSetupPose:function(){for(var a=this.bones,b=0,c=a.length;c>b;b++)a[b].setToSetupPose()},setSlotsToSetupPose:function(){for(var a=this.slots,b=0,c=a.length;c>b;b++)a[b].setToSetupPose(b)},getRootBone:function(){return this.bones.length?this.bones[0]:null},findBone:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return b[c];return null},findBoneIndex:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return c;return-1},findSlot:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return b[c];return null},findSlotIndex:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return c;return-1},setSkinByName:function(a){var b=this.data.findSkin(a);if(!b)throw"Skin not found: "+a;this.setSkin(b)},setSkin:function(a){this.skin&&a&&a._attachAll(this,this.skin),this.skin=a},getAttachmentBySlotName:function(a,b){return this.getAttachmentBySlotIndex(this.data.findSlotIndex(a),b)},getAttachmentBySlotIndex:function(a,b){if(this.skin){var c=this.skin.getAttachment(a,b);if(c)return c}return this.data.defaultSkin?this.data.defaultSkin.getAttachment(a,b):null},setAttachment:function(a,b){for(var c=this.slots,d=0,e=c.size;e>d;d++){var f=c[d];if(f.data.name==a){var g=null;if(b&&(g=this.getAttachment(d,b),null==g))throw"Attachment not found: "+b+", for slot: "+a;return f.setAttachment(g),void 0}}throw"Slot not found: "+a},update:function(a){time+=a}},f.AttachmentType={region:0},f.RegionAttachment=function(){this.offset=[],this.offset.length=8,this.uvs=[],this.uvs.length=8},f.RegionAttachment.prototype={x:0,y:0,rotation:0,scaleX:1,scaleY:1,width:0,height:0,rendererObject:null,regionOffsetX:0,regionOffsetY:0,regionWidth:0,regionHeight:0,regionOriginalWidth:0,regionOriginalHeight:0,setUVs:function(a,b,c,d,e){var f=this.uvs;e?(f[2]=a,f[3]=d,f[4]=a,f[5]=b,f[6]=c,f[7]=b,f[0]=c,f[1]=d):(f[0]=a,f[1]=d,f[2]=a,f[3]=b,f[4]=c,f[5]=b,f[6]=c,f[7]=d)},updateOffset:function(){var a=this.width/this.regionOriginalWidth*this.scaleX,b=this.height/this.regionOriginalHeight*this.scaleY,c=-this.width/2*this.scaleX+this.regionOffsetX*a,d=-this.height/2*this.scaleY+this.regionOffsetY*b,e=c+this.regionWidth*a,f=d+this.regionHeight*b,g=this.rotation*Math.PI/180,h=Math.cos(g),i=Math.sin(g),j=c*h+this.x,k=c*i,l=d*h+this.y,m=d*i,n=e*h+this.x,o=e*i,p=f*h+this.y,q=f*i,r=this.offset;r[0]=j-m,r[1]=l+k,r[2]=j-q,r[3]=p+k,r[4]=n-q,r[5]=p+o,r[6]=n-m,r[7]=l+o},computeVertices:function(a,b,c,d){a+=c.worldX,b+=c.worldY;var e=c.m00,f=c.m01,g=c.m10,h=c.m11,i=this.offset;d[0]=i[0]*e+i[1]*f+a,d[1]=i[0]*g+i[1]*h+b,d[2]=i[2]*e+i[3]*f+a,d[3]=i[2]*g+i[3]*h+b,d[4]=i[4]*e+i[5]*f+a,d[5]=i[4]*g+i[5]*h+b,d[6]=i[6]*e+i[7]*f+a,d[7]=i[6]*g+i[7]*h+b}},f.AnimationStateData=function(a){this.skeletonData=a,this.animationToMixTime={}},f.AnimationStateData.prototype={defaultMix:0,setMixByName:function(a,b,c){var d=this.skeletonData.findAnimation(a);if(!d)throw"Animation not found: "+a;var e=this.skeletonData.findAnimation(b);if(!e)throw"Animation not found: "+b;this.setMix(d,e,c)},setMix:function(a,b,c){this.animationToMixTime[a.name+":"+b.name]=c},getMix:function(a,b){var c=this.animationToMixTime[a.name+":"+b.name];return c?c:this.defaultMix}},f.AnimationState=function(a){this.data=a,this.queue=[]},f.AnimationState.prototype={animationSpeed:1,current:null,previous:null,currentTime:0,previousTime:0,currentLoop:!1,previousLoop:!1,mixTime:0,mixDuration:0,update:function(a){if(this.currentTime+=a*this.animationSpeed,this.previousTime+=a,this.mixTime+=a,this.queue.length>0){var b=this.queue[0];this.currentTime>=b.delay&&(this._setAnimation(b.animation,b.loop),this.queue.shift())}},apply:function(a){if(this.current)if(this.previous){this.previous.apply(a,this.previousTime,this.previousLoop);var b=this.mixTime/this.mixDuration;b>=1&&(b=1,this.previous=null),this.current.mix(a,this.currentTime,this.currentLoop,b)}else this.current.apply(a,this.currentTime,this.currentLoop)},clearAnimation:function(){this.previous=null,this.current=null,this.queue.length=0},_setAnimation:function(a,b){this.previous=null,a&&this.current&&(this.mixDuration=this.data.getMix(this.current,a),this.mixDuration>0&&(this.mixTime=0,this.previous=this.current,this.previousTime=this.currentTime,this.previousLoop=this.currentLoop)),this.current=a,this.currentLoop=b,this.currentTime=0},setAnimationByName:function(a,b){var c=this.data.skeletonData.findAnimation(a);if(!c)throw"Animation not found: "+a;this.setAnimation(c,b)},setAnimation:function(a,b){this.queue.length=0,this._setAnimation(a,b)},addAnimationByName:function(a,b,c){var d=this.data.skeletonData.findAnimation(a);if(!d)throw"Animation not found: "+a;this.addAnimation(d,b,c)},addAnimation:function(a,b,c){var d={};if(d.animation=a,d.loop=b,!c||0>=c){var e=this.queue.length?this.queue[this.queue.length-1].animation:this.current;c=null!=e?e.duration-this.data.getMix(e,a)+(c||0):0}d.delay=c,this.queue.push(d)},isComplete:function(){return!this.current||this.currentTime>=this.current.duration}},f.SkeletonJson=function(a){this.attachmentLoader=a},f.SkeletonJson.prototype={scale:1,readSkeletonData:function(a){for(var b,c=new f.SkeletonData,d=a.bones,e=0,g=d.length;g>e;e++){var h=d[e],i=null;if(h.parent&&(i=c.findBone(h.parent),!i))throw"Parent bone not found: "+h.parent;b=new f.BoneData(h.name,i),b.length=(h.length||0)*this.scale,b.x=(h.x||0)*this.scale,b.y=(h.y||0)*this.scale,b.rotation=h.rotation||0,b.scaleX=h.scaleX||1,b.scaleY=h.scaleY||1,c.bones.push(b)}var j=a.slots;for(e=0,g=j.length;g>e;e++){var k=j[e];if(b=c.findBone(k.bone),!b)throw"Slot bone not found: "+k.bone;var l=new f.SlotData(k.name,b),m=k.color;m&&(l.r=f.SkeletonJson.toColor(m,0),l.g=f.SkeletonJson.toColor(m,1),l.b=f.SkeletonJson.toColor(m,2),l.a=f.SkeletonJson.toColor(m,3)),l.attachmentName=k.attachment,c.slots.push(l)}var n=a.skins;for(var o in n)if(n.hasOwnProperty(o)){var p=n[o],q=new f.Skin(o);for(var r in p)if(p.hasOwnProperty(r)){var s=c.findSlotIndex(r),t=p[r];for(var u in t)if(t.hasOwnProperty(u)){var v=this.readAttachment(q,u,t[u]);null!=v&&q.addAttachment(s,u,v)}}c.skins.push(q),"default"==q.name&&(c.defaultSkin=q)}var w=a.animations;for(var x in w)w.hasOwnProperty(x)&&this.readAnimation(x,w[x],c);return c},readAttachment:function(a,b,c){b=c.name||b;var d=f.AttachmentType[c.type||"region"];if(d==f.AttachmentType.region){var e=new f.RegionAttachment;return e.x=(c.x||0)*this.scale,e.y=(c.y||0)*this.scale,e.scaleX=c.scaleX||1,e.scaleY=c.scaleY||1,e.rotation=c.rotation||0,e.width=(c.width||32)*this.scale,e.height=(c.height||32)*this.scale,e.updateOffset(),e.rendererObject={},e.rendererObject.name=b,e.rendererObject.scale={},e.rendererObject.scale.x=e.scaleX,e.rendererObject.scale.y=e.scaleY,e.rendererObject.rotation=-e.rotation*Math.PI/180,e}throw"Unknown attachment type: "+d},readAnimation:function(a,b,c){var d,e,g,h,i,j,k,l=[],m=0,n=b.bones;for(var o in n)if(n.hasOwnProperty(o)){var p=c.findBoneIndex(o);if(-1==p)throw"Bone not found: "+o;var q=n[o];for(g in q)if(q.hasOwnProperty(g))if(i=q[g],"rotate"==g){for(e=new f.RotateTimeline(i.length),e.boneIndex=p,d=0,j=0,k=i.length;k>j;j++)h=i[j],e.setFrame(d,h.time,h.angle),f.SkeletonJson.readCurve(e,d,h),d++;l.push(e),m=Math.max(m,e.frames[2*e.getFrameCount()-2])}else{if("translate"!=g&&"scale"!=g)throw"Invalid timeline type for a bone: "+g+" ("+o+")";var r=1;for("scale"==g?e=new f.ScaleTimeline(i.length):(e=new f.TranslateTimeline(i.length),r=this.scale),e.boneIndex=p,d=0,j=0,k=i.length;k>j;j++){h=i[j];var s=(h.x||0)*r,t=(h.y||0)*r;e.setFrame(d,h.time,s,t),f.SkeletonJson.readCurve(e,d,h),d++}l.push(e),m=Math.max(m,e.frames[3*e.getFrameCount()-3])}}var u=b.slots;for(var v in u)if(u.hasOwnProperty(v)){var w=u[v],x=c.findSlotIndex(v);for(g in w)if(w.hasOwnProperty(g))if(i=w[g],"color"==g){for(e=new f.ColorTimeline(i.length),e.slotIndex=x,d=0,j=0,k=i.length;k>j;j++){h=i[j];var y=h.color,z=f.SkeletonJson.toColor(y,0),A=f.SkeletonJson.toColor(y,1),B=f.SkeletonJson.toColor(y,2),C=f.SkeletonJson.toColor(y,3);e.setFrame(d,h.time,z,A,B,C),f.SkeletonJson.readCurve(e,d,h),d++}l.push(e),m=Math.max(m,e.frames[5*e.getFrameCount()-5])}else{if("attachment"!=g)throw"Invalid timeline type for a slot: "+g+" ("+v+")";for(e=new f.AttachmentTimeline(i.length),e.slotIndex=x,d=0,j=0,k=i.length;k>j;j++)h=i[j],e.setFrame(d++,h.time,h.name);l.push(e),m=Math.max(m,e.frames[e.getFrameCount()-1])}}c.animations.push(new f.Animation(a,l,m))}},f.SkeletonJson.readCurve=function(a,b,c){var d=c.curve;d&&("stepped"==d?a.curves.setStepped(b):d instanceof Array&&a.curves.setCurve(b,d[0],d[1],d[2],d[3]))},f.SkeletonJson.toColor=function(a,b){if(8!=a.length)throw"Color hexidecimal length must be 8, recieved: "+a;return parseInt(a.substr(2*b,2),16)/255},f.Atlas=function(a,b){this.textureLoader=b,this.pages=[],this.regions=[];var c=new f.AtlasReader(a),d=[];d.length=4;for(var e=null;;){var g=c.readLine();if(null==g)break;if(g=c.trim(g),g.length)if(e){var h=new f.AtlasRegion;h.name=g,h.page=e,h.rotate="true"==c.readValue(),c.readTuple(d);var i=parseInt(d[0],10),j=parseInt(d[1],10);c.readTuple(d);var k=parseInt(d[0],10),l=parseInt(d[1],10);h.u=i/e.width,h.v=j/e.height,h.rotate?(h.u2=(i+l)/e.width,h.v2=(j+k)/e.height):(h.u2=(i+k)/e.width,h.v2=(j+l)/e.height),h.x=i,h.y=j,h.width=Math.abs(k),h.height=Math.abs(l),4==c.readTuple(d)&&(h.splits=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10),parseInt(d[3],10)],4==c.readTuple(d)&&(h.pads=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10),parseInt(d[3],10)],c.readTuple(d))),h.originalWidth=parseInt(d[0],10),h.originalHeight=parseInt(d[1],10),c.readTuple(d),h.offsetX=parseInt(d[0],10),h.offsetY=parseInt(d[1],10),h.index=parseInt(c.readValue(),10),this.regions.push(h)}else{e=new f.AtlasPage,e.name=g,e.format=f.Atlas.Format[c.readValue()],c.readTuple(d),e.minFilter=f.Atlas.TextureFilter[d[0]],e.magFilter=f.Atlas.TextureFilter[d[1]];var m=c.readValue();e.uWrap=f.Atlas.TextureWrap.clampToEdge,e.vWrap=f.Atlas.TextureWrap.clampToEdge,"x"==m?e.uWrap=f.Atlas.TextureWrap.repeat:"y"==m?e.vWrap=f.Atlas.TextureWrap.repeat:"xy"==m&&(e.uWrap=e.vWrap=f.Atlas.TextureWrap.repeat),b.load(e,g),this.pages.push(e)}else e=null}},f.Atlas.prototype={findRegion:function(a){for(var b=this.regions,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},dispose:function(){for(var a=this.pages,b=0,c=a.length;c>b;b++)this.textureLoader.unload(a[b].rendererObject)},updateUVs:function(a){for(var b=this.regions,c=0,d=b.length;d>c;c++){var e=b[c];e.page==a&&(e.u=e.x/a.width,e.v=e.y/a.height,e.rotate?(e.u2=(e.x+e.height)/a.width,e.v2=(e.y+e.width)/a.height):(e.u2=(e.x+e.width)/a.width,e.v2=(e.y+e.height)/a.height))}}},f.Atlas.Format={alpha:0,intensity:1,luminanceAlpha:2,rgb565:3,rgba4444:4,rgb888:5,rgba8888:6},f.Atlas.TextureFilter={nearest:0,linear:1,mipMap:2,mipMapNearestNearest:3,mipMapLinearNearest:4,mipMapNearestLinear:5,mipMapLinearLinear:6},f.Atlas.TextureWrap={mirroredRepeat:0,clampToEdge:1,repeat:2},f.AtlasPage=function(){},f.AtlasPage.prototype={name:null,format:null,minFilter:null,magFilter:null,uWrap:null,vWrap:null,rendererObject:null,width:0,height:0},f.AtlasRegion=function(){},f.AtlasRegion.prototype={page:null,name:null,x:0,y:0,width:0,height:0,u:0,v:0,u2:0,v2:0,offsetX:0,offsetY:0,originalWidth:0,originalHeight:0,index:0,rotate:!1,splits:null,pads:null},f.AtlasReader=function(a){this.lines=a.split(/\r\n|\r|\n/)},f.AtlasReader.prototype={index:0,trim:function(a){return a.replace(/^\s+|\s+$/g,"")},readLine:function(){return this.index>=this.lines.length?null:this.lines[this.index++]},readValue:function(){var a=this.readLine(),b=a.indexOf(":");if(-1==b)throw"Invalid line: "+a;return this.trim(a.substring(b+1))},readTuple:function(a){var b=this.readLine(),c=b.indexOf(":");if(-1==c)throw"Invalid line: "+b;for(var d=0,e=c+1;3>d;d++){var f=b.indexOf(",",e);if(-1==f){if(!d)throw"Invalid line: "+b;break}a[d]=this.trim(b.substr(e,f-e)),e=f+1}return a[d]=this.trim(b.substring(e)),d+1}},f.AtlasAttachmentLoader=function(a){this.atlas=a},f.AtlasAttachmentLoader.prototype={newAttachment:function(a,b,c){switch(b){case f.AttachmentType.region:var d=this.atlas.findRegion(c);if(!d)throw"Region not found in atlas: "+c+" ("+b+")";var e=new f.RegionAttachment(c);return e.rendererObject=d,e.setUVs(d.u,d.v,d.u2,d.v2,d.rotate),e.regionOffsetX=d.offsetX,e.regionOffsetY=d.offsetY,e.regionWidth=d.width,e.regionHeight=d.height,e.regionOriginalWidth=d.originalWidth,e.regionOriginalHeight=d.originalHeight,e}throw"Unknown attachment type: "+b}},f.Bone.yDown=!0,b.AnimCache={},b.Spine=function(a){if(b.DisplayObjectContainer.call(this),this.spineData=b.AnimCache[a],!this.spineData)throw new Error("Spine data must be preloaded using PIXI.SpineLoader or PIXI.AssetLoader: "+a);this.skeleton=new f.Skeleton(this.spineData),this.skeleton.updateWorldTransform(),this.stateData=new f.AnimationStateData(this.spineData),this.state=new f.AnimationState(this.stateData),this.slotContainers=[];for(var c=0,d=this.skeleton.drawOrder.length;d>c;c++){var e=this.skeleton.drawOrder[c],g=e.attachment,h=new b.DisplayObjectContainer;if(this.slotContainers.push(h),this.addChild(h),g instanceof f.RegionAttachment){var i=g.rendererObject.name,j=this.createSprite(e,g.rendererObject);e.currentSprite=j,e.currentSpriteName=i,h.addChild(j)}}},b.Spine.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Spine.prototype.constructor=b.Spine,b.Spine.prototype.updateTransform=function(){this.lastTime=this.lastTime||Date.now();var a=.001*(Date.now()-this.lastTime);this.lastTime=Date.now(),this.state.update(a),this.state.apply(this.skeleton),this.skeleton.updateWorldTransform();for(var c=this.skeleton.drawOrder,d=0,e=c.length;e>d;d++){var g=c[d],h=g.attachment,i=this.slotContainers[d];if(h instanceof f.RegionAttachment){if(h.rendererObject&&(!g.currentSpriteName||g.currentSpriteName!=h.name)){var j=h.rendererObject.name;if(void 0!==g.currentSprite&&(g.currentSprite.visible=!1),g.sprites=g.sprites||{},void 0!==g.sprites[j])g.sprites[j].visible=!0;else{var k=this.createSprite(g,h.rendererObject);i.addChild(k)}g.currentSprite=g.sprites[j],g.currentSpriteName=j}i.visible=!0;var l=g.bone;i.position.x=l.worldX+h.x*l.m00+h.y*l.m01,i.position.y=l.worldY+h.x*l.m10+h.y*l.m11,i.scale.x=l.worldScaleX,i.scale.y=l.worldScaleY,i.rotation=-(g.bone.worldRotation*Math.PI/180),i.alpha=g.a,g.currentSprite.tint=b.rgb2hex([g.r,g.g,g.b])}else i.visible=!1}b.DisplayObjectContainer.prototype.updateTransform.call(this)},b.Spine.prototype.createSprite=function(a,c){var d=b.TextureCache[c.name]?c.name:c.name+".png",e=new b.Sprite(b.Texture.fromFrame(d));return e.scale=c.scale,e.rotation=c.rotation,e.anchor.x=e.anchor.y=.5,a.sprites=a.sprites||{},a.sprites[c.name]=e,e},b.BaseTextureCache={},b.texturesToUpdate=[],b.texturesToDestroy=[],b.BaseTextureCacheIdGenerator=0,b.BaseTexture=function(a,c){if(b.EventTarget.call(this),this.width=100,this.height=100,this.scaleMode=c||b.scaleModes.DEFAULT,this.hasLoaded=!1,this.source=a,this.id=b.BaseTextureCacheIdGenerator++,this.premultipliedAlpha=!0,this._glTextures=[],this._dirty=[],a){if((this.source.complete||this.source.getContext)&&this.source.width&&this.source.height)this.hasLoaded=!0,this.width=this.source.width,this.height=this.source.height,b.texturesToUpdate.push(this);else{var d=this;this.source.onload=function(){d.hasLoaded=!0,d.width=d.source.width,d.height=d.source.height;for(var a=0;a<d._glTextures.length;a++)d._dirty[a]=!0;d.dispatchEvent({type:"loaded",content:d})},this.source.onerror=function(){d.dispatchEvent({type:"error",content:d})}}this.imageUrl=null,this._powerOf2=!1}},b.BaseTexture.prototype.constructor=b.BaseTexture,b.BaseTexture.prototype.destroy=function(){this.imageUrl?(delete b.BaseTextureCache[this.imageUrl],delete b.TextureCache[this.imageUrl],this.imageUrl=null,this.source.src=null):this.source&&this.source._pixiId&&delete b.BaseTextureCache[this.source._pixiId],this.source=null,b.texturesToDestroy.push(this)},b.BaseTexture.prototype.updateSourceImage=function(a){this.hasLoaded=!1,this.source.src=null,this.source.src=a},b.BaseTexture.fromImage=function(a,c,d){var e=b.BaseTextureCache[a];if(void 0===c&&-1===a.indexOf("data:")&&(c=!0),!e){var f=new Image;c&&(f.crossOrigin=""),f.src=a,e=new b.BaseTexture(f,d),e.imageUrl=a,b.BaseTextureCache[a]=e}return e},b.BaseTexture.fromCanvas=function(a,c){a._pixiId||(a._pixiId="canvas_"+b.TextureCacheIdGenerator++);var d=b.BaseTextureCache[a._pixiId];return d||(d=new b.BaseTexture(a,c),b.BaseTextureCache[a._pixiId]=d),d},b.TextureCache={},b.FrameCache={},b.TextureCacheIdGenerator=0,b.Texture=function(a,c){if(b.EventTarget.call(this),this.noFrame=!1,c||(this.noFrame=!0,c=new b.Rectangle(0,0,1,1)),a instanceof b.Texture&&(a=a.baseTexture),this.baseTexture=a,this.frame=c,this.trim=null,this.valid=!1,this.scope=this,this._uvs=null,this.width=0,this.height=0,this.crop=new b.Rectangle(0,0,1,1),a.hasLoaded)this.noFrame&&(c=new b.Rectangle(0,0,a.width,a.height)),this.setFrame(c);else{var d=this;a.addEventListener("loaded",function(){d.onBaseTextureLoaded()})}},b.Texture.prototype.constructor=b.Texture,b.Texture.prototype.onBaseTextureLoaded=function(){var a=this.baseTexture;a.removeEventListener("loaded",this.onLoaded),this.noFrame&&(this.frame=new b.Rectangle(0,0,a.width,a.height)),this.setFrame(this.frame),this.scope.dispatchEvent({type:"update",content:this})},b.Texture.prototype.destroy=function(a){a&&this.baseTexture.destroy(),this.valid=!1},b.Texture.prototype.setFrame=function(a){if(this.noFrame=!1,this.frame=a,this.width=a.width,this.height=a.height,this.crop.x=a.x,this.crop.y=a.y,this.crop.width=a.width,this.crop.height=a.height,!this.trim&&(a.x+a.width>this.baseTexture.width||a.y+a.height>this.baseTexture.height))throw new Error("Texture Error: frame does not fit inside the base Texture dimensions "+this);this.valid=a&&a.width&&a.height&&this.baseTexture.source&&this.baseTexture.hasLoaded,this.trim&&(this.width=this.trim.width,this.height=this.trim.height,this.frame.width=this.trim.width,this.frame.height=this.trim.height),this.valid&&b.Texture.frameUpdates.push(this)},b.Texture.prototype._updateWebGLuvs=function(){this._uvs||(this._uvs=new b.TextureUvs);var a=this.crop,c=this.baseTexture.width,d=this.baseTexture.height;this._uvs.x0=a.x/c,this._uvs.y0=a.y/d,this._uvs.x1=(a.x+a.width)/c,this._uvs.y1=a.y/d,this._uvs.x2=(a.x+a.width)/c,this._uvs.y2=(a.y+a.height)/d,this._uvs.x3=a.x/c,this._uvs.y3=(a.y+a.height)/d},b.Texture.fromImage=function(a,c,d){var e=b.TextureCache[a];return e||(e=new b.Texture(b.BaseTexture.fromImage(a,c,d)),b.TextureCache[a]=e),e},b.Texture.fromFrame=function(a){var c=b.TextureCache[a];if(!c)throw new Error('The frameId "'+a+'" does not exist in the texture cache ');return c},b.Texture.fromCanvas=function(a,c){var d=b.BaseTexture.fromCanvas(a,c);return new b.Texture(d)},b.Texture.addTextureToCache=function(a,c){b.TextureCache[c]=a},b.Texture.removeTextureFromCache=function(a){var c=b.TextureCache[a];return delete b.TextureCache[a],delete b.BaseTextureCache[a],c},b.Texture.frameUpdates=[],b.TextureUvs=function(){this.x0=0,this.y0=0,this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.x3=0,this.y3=0},b.RenderTexture=function(a,c,d,e){if(b.EventTarget.call(this),this.width=a||100,this.height=c||100,this.frame=new b.Rectangle(0,0,this.width,this.height),this.crop=new b.Rectangle(0,0,this.width,this.height),this.baseTexture=new b.BaseTexture,this.baseTexture.width=this.width,this.baseTexture.height=this.height,this.baseTexture._glTextures=[],this.baseTexture.scaleMode=e||b.scaleModes.DEFAULT,this.baseTexture.hasLoaded=!0,this.renderer=d||b.defaultRenderer,this.renderer.type===b.WEBGL_RENDERER){var f=this.renderer.gl;this.textureBuffer=new b.FilterTexture(f,this.width,this.height,this.baseTexture.scaleMode),this.baseTexture._glTextures[f.id]=this.textureBuffer.texture,this.render=this.renderWebGL,this.projection=new b.Point(this.width/2,-this.height/2)}else this.render=this.renderCanvas,this.textureBuffer=new b.CanvasBuffer(this.width,this.height),this.baseTexture.source=this.textureBuffer.canvas;this.valid=!0,b.Texture.frameUpdates.push(this)},b.RenderTexture.prototype=Object.create(b.Texture.prototype),b.RenderTexture.prototype.constructor=b.RenderTexture,b.RenderTexture.prototype.resize=function(a,c,d){(a!==this.width||c!==this.height)&&(this.width=this.frame.width=this.crop.width=a,this.height=this.frame.height=this.crop.height=c,d&&(this.baseTexture.width=this.width,this.baseTexture.height=this.height),this.renderer.type===b.WEBGL_RENDERER&&(this.projection.x=this.width/2,this.projection.y=-this.height/2),this.textureBuffer.resize(this.width,this.height))},b.RenderTexture.prototype.clear=function(){this.renderer.type===b.WEBGL_RENDERER&&this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER,this.textureBuffer.frameBuffer),this.textureBuffer.clear()},b.RenderTexture.prototype.renderWebGL=function(a,c,d){var e=this.renderer.gl;e.colorMask(!0,!0,!0,!0),e.viewport(0,0,this.width,this.height),e.bindFramebuffer(e.FRAMEBUFFER,this.textureBuffer.frameBuffer),d&&this.textureBuffer.clear();var f=a.children,g=a.worldTransform;a.worldTransform=b.RenderTexture.tempMatrix,a.worldTransform.d=-1,a.worldTransform.ty=-2*this.projection.y,c&&(a.worldTransform.tx=c.x,a.worldTransform.ty-=c.y);for(var h=0,i=f.length;i>h;h++)f[h].updateTransform();b.WebGLRenderer.updateTextures(),this.renderer.spriteBatch.dirty=!0,this.renderer.renderDisplayObject(a,this.projection,this.textureBuffer.frameBuffer),a.worldTransform=g,this.renderer.spriteBatch.dirty=!0},b.RenderTexture.prototype.renderCanvas=function(a,c,d){var e=a.children,f=a.worldTransform;a.worldTransform=b.RenderTexture.tempMatrix,c?(a.worldTransform.tx=c.x,a.worldTransform.ty=c.y):(a.worldTransform.tx=0,a.worldTransform.ty=0);for(var g=0,h=e.length;h>g;g++)e[g].updateTransform();d&&this.textureBuffer.clear();var i=this.textureBuffer.context;this.renderer.renderDisplayObject(a,i),i.setTransform(1,0,0,1,0,0),a.worldTransform=f},b.RenderTexture.tempMatrix=new b.Matrix,b.AssetLoader=function(a,c){b.EventTarget.call(this),this.assetURLs=a,this.crossorigin=c,this.loadersByType={jpg:b.ImageLoader,jpeg:b.ImageLoader,png:b.ImageLoader,gif:b.ImageLoader,webp:b.ImageLoader,json:b.JsonLoader,atlas:b.AtlasLoader,anim:b.SpineLoader,xml:b.BitmapFontLoader,fnt:b.BitmapFontLoader}},b.AssetLoader.prototype.constructor=b.AssetLoader,b.AssetLoader.prototype._getDataType=function(a){var b="data:",c=a.slice(0,b.length).toLowerCase();if(c===b){var d=a.slice(b.length),e=d.indexOf(",");if(-1===e)return null;var f=d.slice(0,e).split(";")[0];return f&&"text/plain"!==f.toLowerCase()?f.split("/").pop().toLowerCase():"txt"}return null},b.AssetLoader.prototype.load=function(){function a(a){b.onAssetLoaded(a.content)}var b=this;this.loadCount=this.assetURLs.length;for(var c=0;c<this.assetURLs.length;c++){var d=this.assetURLs[c],e=this._getDataType(d);e||(e=d.split("?").shift().split(".").pop().toLowerCase());var f=this.loadersByType[e];if(!f)throw new Error(e+" is an unsupported file type");var g=new f(d,this.crossorigin);g.addEventListener("loaded",a),g.load()}},b.AssetLoader.prototype.onAssetLoaded=function(a){this.loadCount--,this.dispatchEvent({type:"onProgress",content:this,loader:a}),this.onProgress&&this.onProgress(a),this.loadCount||(this.dispatchEvent({type:"onComplete",content:this}),this.onComplete&&this.onComplete())},b.JsonLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.crossorigin=c,this.baseUrl=a.replace(/[^\/]*$/,""),this.loaded=!1},b.JsonLoader.prototype.constructor=b.JsonLoader,b.JsonLoader.prototype.load=function(){var a=this;window.XDomainRequest&&a.crossorigin?(this.ajaxRequest=new window.XDomainRequest,this.ajaxRequest.timeout=3e3,this.ajaxRequest.onerror=function(){a.onError()},this.ajaxRequest.ontimeout=function(){a.onError()},this.ajaxRequest.onprogress=function(){}):this.ajaxRequest=window.XMLHttpRequest?new window.XMLHttpRequest:new window.ActiveXObject("Microsoft.XMLHTTP"),this.ajaxRequest.onload=function(){a.onJSONLoaded()},this.ajaxRequest.open("GET",this.url,!0),this.ajaxRequest.send()},b.JsonLoader.prototype.onJSONLoaded=function(){if(!this.ajaxRequest.responseText)return this.onError(),void 0;if(this.json=JSON.parse(this.ajaxRequest.responseText),this.json.frames){var a=this,c=this.baseUrl+this.json.meta.image,d=new b.ImageLoader(c,this.crossorigin),e=this.json.frames;this.texture=d.texture.baseTexture,d.addEventListener("loaded",function(){a.onLoaded()});for(var g in e){var h=e[g].frame;if(h&&(b.TextureCache[g]=new b.Texture(this.texture,{x:h.x,y:h.y,width:h.w,height:h.h}),b.TextureCache[g].crop=new b.Rectangle(h.x,h.y,h.w,h.h),e[g].trimmed)){var i=e[g].sourceSize,j=e[g].spriteSourceSize;b.TextureCache[g].trim=new b.Rectangle(j.x,j.y,i.w,i.h)}}d.load()}else if(this.json.bones){var k=new f.SkeletonJson,l=k.readSkeletonData(this.json);b.AnimCache[this.url]=l,this.onLoaded()}else this.onLoaded()},b.JsonLoader.prototype.onLoaded=function(){this.loaded=!0,this.dispatchEvent({type:"loaded",content:this})},b.JsonLoader.prototype.onError=function(){this.dispatchEvent({type:"error",content:this})},b.AtlasLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.baseUrl=a.replace(/[^\/]*$/,""),this.crossorigin=c,this.loaded=!1},b.AtlasLoader.constructor=b.AtlasLoader,b.AtlasLoader.prototype.load=function(){this.ajaxRequest=new b.AjaxRequest,this.ajaxRequest.onreadystatechange=this.onAtlasLoaded.bind(this),this.ajaxRequest.open("GET",this.url,!0),this.ajaxRequest.overrideMimeType&&this.ajaxRequest.overrideMimeType("application/json"),this.ajaxRequest.send(null)},b.AtlasLoader.prototype.onAtlasLoaded=function(){if(4===this.ajaxRequest.readyState)if(200===this.ajaxRequest.status||-1===window.location.href.indexOf("http")){this.atlas={meta:{image:[]},frames:[]};var a=this.ajaxRequest.responseText.split(/\r?\n/),c=-3,d=0,e=null,f=!1,g=0,h=0,i=this.onLoaded.bind(this);for(g=0;g<a.length;g++)if(a[g]=a[g].replace(/^\s+|\s+$/g,""),""===a[g]&&(f=g+1),a[g].length>0){if(f===g)this.atlas.meta.image.push(a[g]),d=this.atlas.meta.image.length-1,this.atlas.frames.push({}),c=-3;else if(c>0)if(c%7===1)null!=e&&(this.atlas.frames[d][e.name]=e),e={name:a[g],frame:{}};else{var j=a[g].split(" ");if(c%7===3)e.frame.x=Number(j[1].replace(",","")),e.frame.y=Number(j[2]);else if(c%7===4)e.frame.w=Number(j[1].replace(",","")),e.frame.h=Number(j[2]);else if(c%7===5){var k={x:0,y:0,w:Number(j[1].replace(",","")),h:Number(j[2])};k.w>e.frame.w||k.h>e.frame.h?(e.trimmed=!0,e.realSize=k):e.trimmed=!1}}c++}if(null!=e&&(this.atlas.frames[d][e.name]=e),this.atlas.meta.image.length>0){for(this.images=[],h=0;h<this.atlas.meta.image.length;h++){var l=this.baseUrl+this.atlas.meta.image[h],m=this.atlas.frames[h];this.images.push(new b.ImageLoader(l,this.crossorigin));for(g in m){var n=m[g].frame;n&&(b.TextureCache[g]=new b.Texture(this.images[h].texture.baseTexture,{x:n.x,y:n.y,width:n.w,height:n.h}),m[g].trimmed&&(b.TextureCache[g].realSize=m[g].realSize,b.TextureCache[g].trim.x=0,b.TextureCache[g].trim.y=0))}}for(this.currentImageId=0,h=0;h<this.images.length;h++)this.images[h].addEventListener("loaded",i);this.images[this.currentImageId].load()}else this.onLoaded()}else this.onError()},b.AtlasLoader.prototype.onLoaded=function(){this.images.length-1>this.currentImageId?(this.currentImageId++,this.images[this.currentImageId].load()):(this.loaded=!0,this.dispatchEvent({type:"loaded",content:this}))},b.AtlasLoader.prototype.onError=function(){this.dispatchEvent({type:"error",content:this})},b.SpriteSheetLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.crossorigin=c,this.baseUrl=a.replace(/[^\/]*$/,""),this.texture=null,this.frames={}},b.SpriteSheetLoader.prototype.constructor=b.SpriteSheetLoader,b.SpriteSheetLoader.prototype.load=function(){var a=this,c=new b.JsonLoader(this.url,this.crossorigin);c.addEventListener("loaded",function(b){a.json=b.content.json,a.onLoaded()}),c.load()},b.SpriteSheetLoader.prototype.onLoaded=function(){this.dispatchEvent({type:"loaded",content:this})},b.ImageLoader=function(a,c){b.EventTarget.call(this),this.texture=b.Texture.fromImage(a,c),this.frames=[]},b.ImageLoader.prototype.constructor=b.ImageLoader,b.ImageLoader.prototype.load=function(){if(this.texture.baseTexture.hasLoaded)this.onLoaded();else{var a=this;this.texture.baseTexture.addEventListener("loaded",function(){a.onLoaded()})}},b.ImageLoader.prototype.onLoaded=function(){this.dispatchEvent({type:"loaded",content:this})},b.ImageLoader.prototype.loadFramedSpriteSheet=function(a,c,d){this.frames=[];for(var e=Math.floor(this.texture.width/a),f=Math.floor(this.texture.height/c),g=0,h=0;f>h;h++)for(var i=0;e>i;i++,g++){var j=new b.Texture(this.texture,{x:i*a,y:h*c,width:a,height:c});this.frames.push(j),d&&(b.TextureCache[d+"-"+g]=j)}if(this.texture.baseTexture.hasLoaded)this.onLoaded();else{var k=this;this.texture.baseTexture.addEventListener("loaded",function(){k.onLoaded()})}},b.BitmapFontLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.crossorigin=c,this.baseUrl=a.replace(/[^\/]*$/,""),this.texture=null},b.BitmapFontLoader.prototype.constructor=b.BitmapFontLoader,b.BitmapFontLoader.prototype.load=function(){this.ajaxRequest=new b.AjaxRequest;var a=this;this.ajaxRequest.onreadystatechange=function(){a.onXMLLoaded()},this.ajaxRequest.open("GET",this.url,!0),this.ajaxRequest.overrideMimeType&&this.ajaxRequest.overrideMimeType("application/xml"),this.ajaxRequest.send(null)},b.BitmapFontLoader.prototype.onXMLLoaded=function(){if(4===this.ajaxRequest.readyState&&(200===this.ajaxRequest.status||-1===window.location.protocol.indexOf("http"))){var a=this.ajaxRequest.responseXML;if(!a||/MSIE 9/i.test(navigator.userAgent)||navigator.isCocoonJS)if("function"==typeof window.DOMParser){var c=new DOMParser;a=c.parseFromString(this.ajaxRequest.responseText,"text/xml")}else{var d=document.createElement("div");d.innerHTML=this.ajaxRequest.responseText,a=d}var e=this.baseUrl+a.getElementsByTagName("page")[0].getAttribute("file"),f=new b.ImageLoader(e,this.crossorigin);this.texture=f.texture.baseTexture;var g={},h=a.getElementsByTagName("info")[0],i=a.getElementsByTagName("common")[0];g.font=h.getAttribute("face"),g.size=parseInt(h.getAttribute("size"),10),g.lineHeight=parseInt(i.getAttribute("lineHeight"),10),g.chars={};for(var j=a.getElementsByTagName("char"),k=0;k<j.length;k++){var l=parseInt(j[k].getAttribute("id"),10),m=new b.Rectangle(parseInt(j[k].getAttribute("x"),10),parseInt(j[k].getAttribute("y"),10),parseInt(j[k].getAttribute("width"),10),parseInt(j[k].getAttribute("height"),10));g.chars[l]={xOffset:parseInt(j[k].getAttribute("xoffset"),10),yOffset:parseInt(j[k].getAttribute("yoffset"),10),xAdvance:parseInt(j[k].getAttribute("xadvance"),10),kerning:{},texture:b.TextureCache[l]=new b.Texture(this.texture,m)}}var n=a.getElementsByTagName("kerning");for(k=0;k<n.length;k++){var o=parseInt(n[k].getAttribute("first"),10),p=parseInt(n[k].getAttribute("second"),10),q=parseInt(n[k].getAttribute("amount"),10);g.chars[p].kerning[o]=q}b.BitmapText.fonts[g.font]=g;var r=this;f.addEventListener("loaded",function(){r.onLoaded()}),f.load()}},b.BitmapFontLoader.prototype.onLoaded=function(){this.dispatchEvent({type:"loaded",content:this})},b.SpineLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.crossorigin=c,this.loaded=!1},b.SpineLoader.prototype.constructor=b.SpineLoader,b.SpineLoader.prototype.load=function(){var a=this,c=new b.JsonLoader(this.url,this.crossorigin);
c.addEventListener("loaded",function(b){a.json=b.content.json,a.onLoaded()}),c.load()},b.SpineLoader.prototype.onLoaded=function(){this.loaded=!0,this.dispatchEvent({type:"loaded",content:this})},b.AbstractFilter=function(a,b){this.passes=[this],this.shaders=[],this.dirty=!0,this.padding=0,this.uniforms=b||{},this.fragmentSrc=a||[]},b.AlphaMaskFilter=function(a){b.AbstractFilter.call(this),this.passes=[this],a.baseTexture._powerOf2=!0,this.uniforms={mask:{type:"sampler2D",value:a},mapDimensions:{type:"2f",value:{x:1,y:5112}},dimensions:{type:"4fv",value:[0,0,0,0]}},a.baseTexture.hasLoaded?(this.uniforms.mask.value.x=a.width,this.uniforms.mask.value.y=a.height):(this.boundLoadedFunction=this.onTextureLoaded.bind(this),a.baseTexture.on("loaded",this.boundLoadedFunction)),this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D mask;","uniform sampler2D uSampler;","uniform vec2 offset;","uniform vec4 dimensions;","uniform vec2 mapDimensions;","void main(void) {","   vec2 mapCords = vTextureCoord.xy;","   mapCords += (dimensions.zw + offset)/ dimensions.xy ;","   mapCords.y *= -1.0;","   mapCords.y += 1.0;","   mapCords *= dimensions.xy / mapDimensions;","   vec4 original =  texture2D(uSampler, vTextureCoord);","   float maskAlpha =  texture2D(mask, mapCords).r;","   original *= maskAlpha;","   gl_FragColor =  original;","}"]},b.AlphaMaskFilter.prototype=Object.create(b.AbstractFilter.prototype),b.AlphaMaskFilter.prototype.constructor=b.AlphaMaskFilter,b.AlphaMaskFilter.prototype.onTextureLoaded=function(){this.uniforms.mapDimensions.value.x=this.uniforms.mask.value.width,this.uniforms.mapDimensions.value.y=this.uniforms.mask.value.height,this.uniforms.mask.value.baseTexture.off("loaded",this.boundLoadedFunction)},Object.defineProperty(b.AlphaMaskFilter.prototype,"map",{get:function(){return this.uniforms.mask.value},set:function(a){this.uniforms.mask.value=a}}),b.ColorMatrixFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={matrix:{type:"mat4",value:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float invert;","uniform mat4 matrix;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord) * matrix;","}"]},b.ColorMatrixFilter.prototype=Object.create(b.AbstractFilter.prototype),b.ColorMatrixFilter.prototype.constructor=b.ColorMatrixFilter,Object.defineProperty(b.ColorMatrixFilter.prototype,"matrix",{get:function(){return this.uniforms.matrix.value},set:function(a){this.uniforms.matrix.value=a}}),b.GrayFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={gray:{type:"1f",value:1}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D uSampler;","uniform float gray;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord);","   gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), gray);","}"]},b.GrayFilter.prototype=Object.create(b.AbstractFilter.prototype),b.GrayFilter.prototype.constructor=b.GrayFilter,Object.defineProperty(b.GrayFilter.prototype,"gray",{get:function(){return this.uniforms.gray.value},set:function(a){this.uniforms.gray.value=a}}),b.DisplacementFilter=function(a){b.AbstractFilter.call(this),this.passes=[this],a.baseTexture._powerOf2=!0,this.uniforms={displacementMap:{type:"sampler2D",value:a},scale:{type:"2f",value:{x:30,y:30}},offset:{type:"2f",value:{x:0,y:0}},mapDimensions:{type:"2f",value:{x:1,y:5112}},dimensions:{type:"4fv",value:[0,0,0,0]}},a.baseTexture.hasLoaded?(this.uniforms.mapDimensions.value.x=a.width,this.uniforms.mapDimensions.value.y=a.height):(this.boundLoadedFunction=this.onTextureLoaded.bind(this),a.baseTexture.on("loaded",this.boundLoadedFunction)),this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D displacementMap;","uniform sampler2D uSampler;","uniform vec2 scale;","uniform vec2 offset;","uniform vec4 dimensions;","uniform vec2 mapDimensions;","void main(void) {","   vec2 mapCords = vTextureCoord.xy;","   mapCords += (dimensions.zw + offset)/ dimensions.xy ;","   mapCords.y *= -1.0;","   mapCords.y += 1.0;","   vec2 matSample = texture2D(displacementMap, mapCords).xy;","   matSample -= 0.5;","   matSample *= scale;","   matSample /= mapDimensions;","   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x + matSample.x, vTextureCoord.y + matSample.y));","   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb, 1.0);","   vec2 cord = vTextureCoord;","}"]},b.DisplacementFilter.prototype=Object.create(b.AbstractFilter.prototype),b.DisplacementFilter.prototype.constructor=b.DisplacementFilter,b.DisplacementFilter.prototype.onTextureLoaded=function(){this.uniforms.mapDimensions.value.x=this.uniforms.displacementMap.value.width,this.uniforms.mapDimensions.value.y=this.uniforms.displacementMap.value.height,this.uniforms.displacementMap.value.baseTexture.off("loaded",this.boundLoadedFunction)},Object.defineProperty(b.DisplacementFilter.prototype,"map",{get:function(){return this.uniforms.displacementMap.value},set:function(a){this.uniforms.displacementMap.value=a}}),Object.defineProperty(b.DisplacementFilter.prototype,"scale",{get:function(){return this.uniforms.scale.value},set:function(a){this.uniforms.scale.value=a}}),Object.defineProperty(b.DisplacementFilter.prototype,"offset",{get:function(){return this.uniforms.offset.value},set:function(a){this.uniforms.offset.value=a}}),b.PixelateFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={invert:{type:"1f",value:0},dimensions:{type:"4fv",value:new Float32Array([1e4,100,10,10])},pixelSize:{type:"2f",value:{x:10,y:10}}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform vec2 testDim;","uniform vec4 dimensions;","uniform vec2 pixelSize;","uniform sampler2D uSampler;","void main(void) {","   vec2 coord = vTextureCoord;","   vec2 size = dimensions.xy/pixelSize;","   vec2 color = floor( ( vTextureCoord * size ) ) / size + pixelSize/dimensions.xy * 0.5;","   gl_FragColor = texture2D(uSampler, color);","}"]},b.PixelateFilter.prototype=Object.create(b.AbstractFilter.prototype),b.PixelateFilter.prototype.constructor=b.PixelateFilter,Object.defineProperty(b.PixelateFilter.prototype,"size",{get:function(){return this.uniforms.pixelSize.value},set:function(a){this.dirty=!0,this.uniforms.pixelSize.value=a}}),b.BlurXFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={blur:{type:"1f",value:1/512}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float blur;","uniform sampler2D uSampler;","void main(void) {","   vec4 sum = vec4(0.0);","   sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;","   sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;","   gl_FragColor = sum;","}"]},b.BlurXFilter.prototype=Object.create(b.AbstractFilter.prototype),b.BlurXFilter.prototype.constructor=b.BlurXFilter,Object.defineProperty(b.BlurXFilter.prototype,"blur",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.dirty=!0,this.uniforms.blur.value=1/7e3*a}}),b.BlurYFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={blur:{type:"1f",value:1/512}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float blur;","uniform sampler2D uSampler;","void main(void) {","   vec4 sum = vec4(0.0);","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;","   gl_FragColor = sum;","}"]},b.BlurYFilter.prototype=Object.create(b.AbstractFilter.prototype),b.BlurYFilter.prototype.constructor=b.BlurYFilter,Object.defineProperty(b.BlurYFilter.prototype,"blur",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.uniforms.blur.value=1/7e3*a}}),b.BlurFilter=function(){this.blurXFilter=new b.BlurXFilter,this.blurYFilter=new b.BlurYFilter,this.passes=[this.blurXFilter,this.blurYFilter]},Object.defineProperty(b.BlurFilter.prototype,"blur",{get:function(){return this.blurXFilter.blur},set:function(a){this.blurXFilter.blur=this.blurYFilter.blur=a}}),Object.defineProperty(b.BlurFilter.prototype,"blurX",{get:function(){return this.blurXFilter.blur},set:function(a){this.blurXFilter.blur=a}}),Object.defineProperty(b.BlurFilter.prototype,"blurY",{get:function(){return this.blurYFilter.blur},set:function(a){this.blurYFilter.blur=a}}),b.InvertFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={invert:{type:"1f",value:1}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float invert;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord);","   gl_FragColor.rgb = mix( (vec3(1)-gl_FragColor.rgb) * gl_FragColor.a, gl_FragColor.rgb, 1.0 - invert);","}"]},b.InvertFilter.prototype=Object.create(b.AbstractFilter.prototype),b.InvertFilter.prototype.constructor=b.InvertFilter,Object.defineProperty(b.InvertFilter.prototype,"invert",{get:function(){return this.uniforms.invert.value},set:function(a){this.uniforms.invert.value=a}}),b.SepiaFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={sepia:{type:"1f",value:1}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float sepia;","uniform sampler2D uSampler;","const mat3 sepiaMatrix = mat3(0.3588, 0.7044, 0.1368, 0.2990, 0.5870, 0.1140, 0.2392, 0.4696, 0.0912);","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord);","   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb * sepiaMatrix, sepia);","}"]},b.SepiaFilter.prototype=Object.create(b.AbstractFilter.prototype),b.SepiaFilter.prototype.constructor=b.SepiaFilter,Object.defineProperty(b.SepiaFilter.prototype,"sepia",{get:function(){return this.uniforms.sepia.value},set:function(a){this.uniforms.sepia.value=a}}),b.TwistFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={radius:{type:"1f",value:.5},angle:{type:"1f",value:5},offset:{type:"2f",value:{x:.5,y:.5}}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform vec4 dimensions;","uniform sampler2D uSampler;","uniform float radius;","uniform float angle;","uniform vec2 offset;","void main(void) {","   vec2 coord = vTextureCoord - offset;","   float distance = length(coord);","   if (distance < radius) {","       float ratio = (radius - distance) / radius;","       float angleMod = ratio * ratio * angle;","       float s = sin(angleMod);","       float c = cos(angleMod);","       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);","   }","   gl_FragColor = texture2D(uSampler, coord+offset);","}"]},b.TwistFilter.prototype=Object.create(b.AbstractFilter.prototype),b.TwistFilter.prototype.constructor=b.TwistFilter,Object.defineProperty(b.TwistFilter.prototype,"offset",{get:function(){return this.uniforms.offset.value},set:function(a){this.dirty=!0,this.uniforms.offset.value=a}}),Object.defineProperty(b.TwistFilter.prototype,"radius",{get:function(){return this.uniforms.radius.value},set:function(a){this.dirty=!0,this.uniforms.radius.value=a}}),Object.defineProperty(b.TwistFilter.prototype,"angle",{get:function(){return this.uniforms.angle.value},set:function(a){this.dirty=!0,this.uniforms.angle.value=a}}),b.ColorStepFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={step:{type:"1f",value:5}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D uSampler;","uniform float step;","void main(void) {","   vec4 color = texture2D(uSampler, vTextureCoord);","   color = floor(color * step) / step;","   gl_FragColor = color;","}"]},b.ColorStepFilter.prototype=Object.create(b.AbstractFilter.prototype),b.ColorStepFilter.prototype.constructor=b.ColorStepFilter,Object.defineProperty(b.ColorStepFilter.prototype,"step",{get:function(){return this.uniforms.step.value},set:function(a){this.uniforms.step.value=a}}),b.DotScreenFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={scale:{type:"1f",value:1},angle:{type:"1f",value:5},dimensions:{type:"4fv",value:[0,0,0,0]}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform vec4 dimensions;","uniform sampler2D uSampler;","uniform float angle;","uniform float scale;","float pattern() {","   float s = sin(angle), c = cos(angle);","   vec2 tex = vTextureCoord * dimensions.xy;","   vec2 point = vec2(","       c * tex.x - s * tex.y,","       s * tex.x + c * tex.y","   ) * scale;","   return (sin(point.x) * sin(point.y)) * 4.0;","}","void main() {","   vec4 color = texture2D(uSampler, vTextureCoord);","   float average = (color.r + color.g + color.b) / 3.0;","   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);","}"]},b.DotScreenFilter.prototype=Object.create(b.AbstractFilter.prototype),b.DotScreenFilter.prototype.constructor=b.DotScreenFilter,Object.defineProperty(b.DotScreenFilter.prototype,"scale",{get:function(){return this.uniforms.scale.value},set:function(a){this.dirty=!0,this.uniforms.scale.value=a}}),Object.defineProperty(b.DotScreenFilter.prototype,"angle",{get:function(){return this.uniforms.angle.value},set:function(a){this.dirty=!0,this.uniforms.angle.value=a}}),b.CrossHatchFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={blur:{type:"1f",value:1/512}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float blur;","uniform sampler2D uSampler;","void main(void) {","    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);","    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);","    if (lum < 1.00) {","        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","    if (lum < 0.75) {","        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","    if (lum < 0.50) {","        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","    if (lum < 0.3) {","        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","}"]},b.CrossHatchFilter.prototype=Object.create(b.AbstractFilter.prototype),b.CrossHatchFilter.prototype.constructor=b.BlurYFilter,Object.defineProperty(b.CrossHatchFilter.prototype,"blur",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.uniforms.blur.value=1/7e3*a}}),b.RGBSplitFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={red:{type:"2f",value:{x:20,y:20}},green:{type:"2f",value:{x:-20,y:20}},blue:{type:"2f",value:{x:20,y:-20}},dimensions:{type:"4fv",value:[0,0,0,0]}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform vec2 red;","uniform vec2 green;","uniform vec2 blue;","uniform vec4 dimensions;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/dimensions.xy).r;","   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/dimensions.xy).g;","   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/dimensions.xy).b;","   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;","}"]},b.RGBSplitFilter.prototype=Object.create(b.AbstractFilter.prototype),b.RGBSplitFilter.prototype.constructor=b.RGBSplitFilter,Object.defineProperty(b.RGBSplitFilter.prototype,"angle",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.uniforms.blur.value=1/7e3*a}}),"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=b),exports.PIXI=b):"undefined"!=typeof define&&define.amd?define(b):a.PIXI=b}).call(this);
;
/*** <End:pixi LoadJs:"components/pixi/bin/pixi.js"> ***/
/*** <Start:pixi LoadJs:"components/pixi/bin/pixi.dev.js"> ***/
/**
 * @license
 * pixi.js - v1.6.0
 * Copyright (c) 2012-2014, Mat Groves
 * http://goodboydigital.com/
 *
 * Compiled: 2014-07-18
 *
 * pixi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

(function(){

    var root = this;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * @module PIXI
 */
var PIXI = PIXI || {};

/* 
* 
* This file contains a lot of pixi consts which are used across the rendering engine
* @class Consts
*/
PIXI.WEBGL_RENDERER = 0;
PIXI.CANVAS_RENDERER = 1;

// useful for testing against if your lib is using pixi.
PIXI.VERSION = "v1.6.1";


// the various blend modes supported by pixi
PIXI.blendModes = {
    NORMAL:0,
    ADD:1,
    MULTIPLY:2,
    SCREEN:3,
    OVERLAY:4,
    DARKEN:5,
    LIGHTEN:6,
    COLOR_DODGE:7,
    COLOR_BURN:8,
    HARD_LIGHT:9,
    SOFT_LIGHT:10,
    DIFFERENCE:11,
    EXCLUSION:12,
    HUE:13,
    SATURATION:14,
    COLOR:15,
    LUMINOSITY:16
};

// the scale modes
PIXI.scaleModes = {
    DEFAULT:0,
    LINEAR:0,
    NEAREST:1
};

// used to create uids for various pixi objects..
PIXI._UID = 0;

if(typeof(Float32Array) != 'undefined')
{
    PIXI.Float32Array = Float32Array;
    PIXI.Uint16Array = Uint16Array;
}
else
{
    PIXI.Float32Array = Array;
    PIXI.Uint16Array = Array;
}

// interaction frequency 
PIXI.INTERACTION_FREQUENCY = 30;
PIXI.AUTO_PREVENT_DEFAULT = true;

PIXI.RAD_TO_DEG = 180 / Math.PI;
PIXI.DEG_TO_RAD = Math.PI / 180;


PIXI.dontSayHello = false;

PIXI.sayHello = function (type) 
{
    if(PIXI.dontSayHello)return;

    if ( navigator.userAgent.toLowerCase().indexOf('chrome') > -1 )
    {
        var args = [
            '%c %c %c Pixi.js ' + PIXI.VERSION + ' - ' + type + '  %c ' + ' %c ' + ' http://www.pixijs.com/  %c %c ♥%c♥%c♥ ',
            'background: #ff66a5',
            'background: #ff66a5',
            'color: #ff66a5; background: #030307;',
            'background: #ff66a5',
            'background: #ffc3dc',
            'background: #ff66a5',
            'color: #ff2424; background: #fff',
            'color: #ff2424; background: #fff',
            'color: #ff2424; background: #fff'
        ];

       

        console.log.apply(console, args);
    }
    else if (window['console'])
    {
        console.log('Pixi.js ' + PIXI.VERSION + ' - http://www.pixijs.com/');
    }

    PIXI.dontSayHello = true;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
 *
 * @class Point
 * @constructor
 * @param x {Number} position of the point on the x axis
 * @param y {Number} position of the point on the y axis
 */
PIXI.Point = function(x, y)
{
    /**
     * @property x
     * @type Number
     * @default 0
     */
    this.x = x || 0;

    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y || 0;
};

/**
 * Creates a clone of this point
 *
 * @method clone
 * @return {Point} a copy of the point
 */
PIXI.Point.prototype.clone = function()
{
    return new PIXI.Point(this.x, this.y);
};

/**
 * Sets the point to a new x and y position.
 * If y is ommited, both x and y will be set to x.
 * 
 * @method set
 * @param [x=0] {Number} position of the point on the x axis
 * @param [y=0] {Number} position of the point on the y axis
 */
PIXI.Point.prototype.set = function(x, y)
{
    this.x = x || 0;
    this.y = y || ( (y !== 0) ? this.x : 0 ) ;
};

// constructor
PIXI.Point.prototype.constructor = PIXI.Point;
/**
 * @author Mat Groves http://matgroves.com/
 */

/**
 * the Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its width and its height.
 *
 * @class Rectangle
 * @constructor
 * @param x {Number} The X coord of the upper-left corner of the rectangle
 * @param y {Number} The Y coord of the upper-left corner of the rectangle
 * @param width {Number} The overall width of this rectangle
 * @param height {Number} The overall height of this rectangle
 */
PIXI.Rectangle = function(x, y, width, height)
{
    /**
     * @property x
     * @type Number
     * @default 0
     */
    this.x = x || 0;

    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y || 0;

    /**
     * @property width
     * @type Number
     * @default 0
     */
    this.width = width || 0;

    /**
     * @property height
     * @type Number
     * @default 0
     */
    this.height = height || 0;
};

/**
 * Creates a clone of this Rectangle
 *
 * @method clone
 * @return {Rectangle} a copy of the rectangle
 */
PIXI.Rectangle.prototype.clone = function()
{
    return new PIXI.Rectangle(this.x, this.y, this.width, this.height);
};

/**
 * Checks whether the x and y coordinates passed to this function are contained within this Rectangle
 *
 * @method contains
 * @param x {Number} The X coordinate of the point to test
 * @param y {Number} The Y coordinate of the point to test
 * @return {Boolean} Whether the x/y coords are within this Rectangle
 */
PIXI.Rectangle.prototype.contains = function(x, y)
{
    if(this.width <= 0 || this.height <= 0)
        return false;

    var x1 = this.x;
    if(x >= x1 && x <= x1 + this.width)
    {
        var y1 = this.y;

        if(y >= y1 && y <= y1 + this.height)
        {
            return true;
        }
    }

    return false;
};

// constructor
PIXI.Rectangle.prototype.constructor = PIXI.Rectangle;

PIXI.EmptyRectangle = new PIXI.Rectangle(0,0,0,0);
/**
 * @author Adrien Brault <adrien.brault@gmail.com>
 */

/**
 * @class Polygon
 * @constructor
 * @param points* {Array<Point>|Array<Number>|Point...|Number...} This can be an array of Points that form the polygon,
 *      a flat array of numbers that will be interpreted as [x,y, x,y, ...], or the arguments passed can be
 *      all the points of the polygon e.g. `new PIXI.Polygon(new PIXI.Point(), new PIXI.Point(), ...)`, or the
 *      arguments passed can be flat x,y values e.g. `new PIXI.Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are
 *      Numbers.
 */
PIXI.Polygon = function(points)
{
    //if points isn't an array, use arguments as the array
    if(!(points instanceof Array))
        points = Array.prototype.slice.call(arguments);

    //if this is a flat array of numbers, convert it to points
    if(typeof points[0] === 'number') {
        var p = [];
        for(var i = 0, il = points.length; i < il; i+=2) {
            p.push(
                new PIXI.Point(points[i], points[i + 1])
            );
        }

        points = p;
    }

    this.points = points;
};

/**
 * Creates a clone of this polygon
 *
 * @method clone
 * @return {Polygon} a copy of the polygon
 */
PIXI.Polygon.prototype.clone = function()
{
    var points = [];
    for (var i=0; i<this.points.length; i++) {
        points.push(this.points[i].clone());
    }

    return new PIXI.Polygon(points);
};

/**
 * Checks whether the x and y coordinates passed to this function are contained within this polygon
 *
 * @method contains
 * @param x {Number} The X coordinate of the point to test
 * @param y {Number} The Y coordinate of the point to test
 * @return {Boolean} Whether the x/y coordinates are within this polygon
 */
PIXI.Polygon.prototype.contains = function(x, y)
{
    var inside = false;

    // use some raycasting to test hits
    // https://github.com/substack/point-in-polygon/blob/master/index.js
    for(var i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
        var xi = this.points[i].x, yi = this.points[i].y,
            xj = this.points[j].x, yj = this.points[j].y,
            intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if(intersect) inside = !inside;
    }

    return inside;
};

// constructor
PIXI.Polygon.prototype.constructor = PIXI.Polygon;

/**
 * @author Chad Engler <chad@pantherdev.com>
 */

/**
 * The Circle object can be used to specify a hit area for displayObjects
 *
 * @class Circle
 * @constructor
 * @param x {Number} The X coordinate of the center of this circle
 * @param y {Number} The Y coordinate of the center of this circle
 * @param radius {Number} The radius of the circle
 */
PIXI.Circle = function(x, y, radius)
{
    /**
     * @property x
     * @type Number
     * @default 0
     */
    this.x = x || 0;

    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y || 0;

    /**
     * @property radius
     * @type Number
     * @default 0
     */
    this.radius = radius || 0;
};

/**
 * Creates a clone of this Circle instance
 *
 * @method clone
 * @return {Circle} a copy of the polygon
 */
PIXI.Circle.prototype.clone = function()
{
    return new PIXI.Circle(this.x, this.y, this.radius);
};

/**
 * Checks whether the x, and y coordinates passed to this function are contained within this circle
 *
 * @method contains
 * @param x {Number} The X coordinate of the point to test
 * @param y {Number} The Y coordinate of the point to test
 * @return {Boolean} Whether the x/y coordinates are within this polygon
 */
PIXI.Circle.prototype.contains = function(x, y)
{
    if(this.radius <= 0)
        return false;

    var dx = (this.x - x),
        dy = (this.y - y),
        r2 = this.radius * this.radius;

    dx *= dx;
    dy *= dy;

    return (dx + dy <= r2);
};

/**
* Returns the framing rectangle of the circle as a PIXI.Rectangle object
*
* @method getBounds
* @return {Rectangle} the framing rectangle
*/
PIXI.Circle.prototype.getBounds = function()
{
    return new PIXI.Rectangle(this.x - this.radius, this.y - this.radius, this.width, this.height);
};

// constructor
PIXI.Circle.prototype.constructor = PIXI.Circle;


/**
 * @author Chad Engler <chad@pantherdev.com>
 */

/**
 * The Ellipse object can be used to specify a hit area for displayObjects
 *
 * @class Ellipse
 * @constructor
 * @param x {Number} The X coordinate of the center of the ellipse
 * @param y {Number} The Y coordinate of the center of the ellipse
 * @param width {Number} The half width of this ellipse
 * @param height {Number} The half height of this ellipse
 */
PIXI.Ellipse = function(x, y, width, height)
{
    /**
     * @property x
     * @type Number
     * @default 0
     */
    this.x = x || 0;

    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y || 0;

    /**
     * @property width
     * @type Number
     * @default 0
     */
    this.width = width || 0;

    /**
     * @property height
     * @type Number
     * @default 0
     */
    this.height = height || 0;
};

/**
 * Creates a clone of this Ellipse instance
 *
 * @method clone
 * @return {Ellipse} a copy of the ellipse
 */
PIXI.Ellipse.prototype.clone = function()
{
    return new PIXI.Ellipse(this.x, this.y, this.width, this.height);
};

/**
 * Checks whether the x and y coordinates passed to this function are contained within this ellipse
 *
 * @method contains
 * @param x {Number} The X coordinate of the point to test
 * @param y {Number} The Y coordinate of the point to test
 * @return {Boolean} Whether the x/y coords are within this ellipse
 */
PIXI.Ellipse.prototype.contains = function(x, y)
{
    if(this.width <= 0 || this.height <= 0)
        return false;

    //normalize the coords to an ellipse with center 0,0
    var normx = ((x - this.x) / this.width),
        normy = ((y - this.y) / this.height);

    normx *= normx;
    normy *= normy;

    return (normx + normy <= 1);
};

/**
* Returns the framing rectangle of the ellipse as a PIXI.Rectangle object
*
* @method getBounds
* @return {Rectangle} the framing rectangle
*/
PIXI.Ellipse.prototype.getBounds = function()
{
    return new PIXI.Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
};

// constructor
PIXI.Ellipse.prototype.constructor = PIXI.Ellipse;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The Matrix class is now an object, which makes it a lot faster, 
 * here is a representation of it : 
 * | a | b | tx|
 * | c | d | ty|
 * | 0 | 0 | 1 |
 *
 * @class Matrix
 * @constructor
 */
PIXI.Matrix = function()
{
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;
};

/**
 * Creates a pixi matrix object based on the array given as a parameter
 *
 * @method fromArray
 * @param array {Array} The array that the matrix will be filled with
 */
PIXI.Matrix.prototype.fromArray = function(array)
{
    this.a = array[0];
    this.b = array[1];
    this.c = array[3];
    this.d = array[4];
    this.tx = array[2];
    this.ty = array[5];
};

/**
 * Creates an array from the current Matrix object
 *
 * @method toArray
 * @param transpose {Boolean} Whether we need to transpose the matrix or not
 * @return {Array} the newly created array which contains the matrix
 */
PIXI.Matrix.prototype.toArray = function(transpose)
{
    if(!this.array) this.array = new Float32Array(9);
    var array = this.array;

    if(transpose)
    {
        array[0] = this.a;
        array[1] = this.c;
        array[2] = 0;
        array[3] = this.b;
        array[4] = this.d;
        array[5] = 0;
        array[6] = this.tx;
        array[7] = this.ty;
        array[8] = 1;
    }
    else
    {
        array[0] = this.a;
        array[1] = this.b;
        array[2] = this.tx;
        array[3] = this.c;
        array[4] = this.d;
        array[5] = this.ty;
        array[6] = 0;
        array[7] = 0;
        array[8] = 1;
    }

    return array;
};

PIXI.identityMatrix = new PIXI.Matrix();

PIXI.determineMatrixArrayType = function() {
    return (typeof Float32Array !== 'undefined') ? Float32Array : Array;
};

/**
 * The Matrix2 class will choose the best type of array to use between
 * a regular javascript Array and a Float32Array if the latter is available
 *
 * @class Matrix2
 * @constructor
 */
PIXI.Matrix2 = PIXI.determineMatrixArrayType();

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The base class for all objects that are rendered on the screen. 
 * This is an abstract class and should not be used on its own rather it should be extended.
 *
 * @class DisplayObject
 * @constructor
 */
PIXI.DisplayObject = function()
{
    /**
     * The coordinate of the object relative to the local coordinates of the parent.
     *
     * @property position
     * @type Point
     */
    this.position = new PIXI.Point();

    /**
     * The scale factor of the object.
     *
     * @property scale
     * @type Point
     */
    this.scale = new PIXI.Point(1,1);//{x:1, y:1};

    /**
     * The pivot point of the displayObject that it rotates around
     *
     * @property pivot
     * @type Point
     */
    this.pivot = new PIXI.Point(0,0);

    /**
     * The rotation of the object in radians.
     *
     * @property rotation
     * @type Number
     */
    this.rotation = 0;

    /**
     * The opacity of the object.
     *
     * @property alpha
     * @type Number
     */
    this.alpha = 1;

    /**
     * The visibility of the object.
     *
     * @property visible
     * @type Boolean
     */
    this.visible = true;

    /**
     * This is the defined area that will pick up mouse / touch events. It is null by default.
     * Setting it is a neat way of optimising the hitTest function that the interactionManager will use (as it will not need to hit test all the children)
     *
     * @property hitArea
     * @type Rectangle|Circle|Ellipse|Polygon
     */
    this.hitArea = null;

    /**
     * This is used to indicate if the displayObject should display a mouse hand cursor on rollover
     *
     * @property buttonMode
     * @type Boolean
     */
    this.buttonMode = false;

    /**
     * Can this object be rendered
     *
     * @property renderable
     * @type Boolean
     */
    this.renderable = false;

    /**
     * [read-only] The display object container that contains this display object.
     *
     * @property parent
     * @type DisplayObjectContainer
     * @readOnly
     */
    this.parent = null;

    /**
     * [read-only] The stage the display object is connected to, or undefined if it is not connected to the stage.
     *
     * @property stage
     * @type Stage
     * @readOnly
     */
    this.stage = null;

    /**
     * [read-only] The multiplied alpha of the displayObject
     *
     * @property worldAlpha
     * @type Number
     * @readOnly
     */
    this.worldAlpha = 1;

    /**
     * [read-only] Whether or not the object is interactive, do not toggle directly! use the `interactive` property
     *
     * @property _interactive
     * @type Boolean
     * @readOnly
     * @private
     */
    this._interactive = false;

    /**
     * This is the cursor that will be used when the mouse is over this object. To enable this the element must have interaction = true and buttonMode = true
     * 
     * @property defaultCursor
     * @type String
     *
    */
    this.defaultCursor = 'pointer';

    /**
     * [read-only] Current transform of the object based on world (parent) factors
     *
     * @property worldTransform
     * @type Mat3
     * @readOnly
     * @private
     */
    this.worldTransform = new PIXI.Matrix();

    /**
     * [NYI] Unknown
     *
     * @property color
     * @type Array<>
     * @private
     */
    this.color = [];

    /**
     * [NYI] Holds whether or not this object is dynamic, for rendering optimization
     *
     * @property dynamic
     * @type Boolean
     * @private
     */
    this.dynamic = true;

    // cached sin rotation and cos rotation
    this._sr = 0;
    this._cr = 1;

    /**
     * The area the filter is applied to like the hitArea this is used as more of an optimisation
     * rather than figuring out the dimensions of the displayObject each frame you can set this rectangle
     *
     * @property filterArea
     * @type Rectangle
     */
    this.filterArea = null;//new PIXI.Rectangle(0,0,1,1);

    /**
     * The original, cached bounds of the object
     *
     * @property _bounds
     * @type Rectangle
     * @private
     */
    this._bounds = new PIXI.Rectangle(0, 0, 1, 1);
    /**
     * The most up-to-date bounds of the object
     *
     * @property _currentBounds
     * @type Rectangle
     * @private
     */
    this._currentBounds = null;
    /**
     * The original, cached mask of the object
     *
     * @property _currentBounds
     * @type Rectangle
     * @private
     */
    this._mask = null;

    this._cacheAsBitmap = false;
    this._cacheIsDirty = false;


    /*
     * MOUSE Callbacks
     */

    /**
     * A callback that is used when the users clicks on the displayObject with their mouse
     * @method click
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the user clicks the mouse down over the sprite
     * @method mousedown
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the user releases the mouse that was over the displayObject
     * for this callback to be fired the mouse must have been pressed down over the displayObject
     * @method mouseup
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the user releases the mouse that was over the displayObject but is no longer over the displayObject
     * for this callback to be fired, The touch must have started over the displayObject
     * @method mouseupoutside
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the users mouse rolls over the displayObject
     * @method mouseover
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the users mouse leaves the displayObject
     * @method mouseout
     * @param interactionData {InteractionData}
     */


    /*
     * TOUCH Callbacks
     */

    /**
     * A callback that is used when the users taps on the sprite with their finger
     * basically a touch version of click
     * @method tap
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the user touches over the displayObject
     * @method touchstart
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the user releases a touch over the displayObject
     * @method touchend
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the user releases the touch that was over the displayObject
     * for this callback to be fired, The touch must have started over the sprite
     * @method touchendoutside
     * @param interactionData {InteractionData}
     */
};

// constructor
PIXI.DisplayObject.prototype.constructor = PIXI.DisplayObject;

/**
 * [Deprecated] Indicates if the sprite will have touch and mouse interactivity. It is false by default
 * Instead of using this function you can now simply set the interactive property to true or false
 *
 * @method setInteractive
 * @param interactive {Boolean}
 * @deprecated Simply set the `interactive` property directly
 */
PIXI.DisplayObject.prototype.setInteractive = function(interactive)
{
    this.interactive = interactive;
};

/**
 * Indicates if the sprite will have touch and mouse interactivity. It is false by default
 *
 * @property interactive
 * @type Boolean
 * @default false
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'interactive', {
    get: function() {
        return this._interactive;
    },
    set: function(value) {
        this._interactive = value;

        // TODO more to be done here..
        // need to sort out a re-crawl!
        if(this.stage)this.stage.dirty = true;
    }
});

/**
 * [read-only] Indicates if the sprite is globaly visible.
 *
 * @property worldVisible
 * @type Boolean
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'worldVisible', {
    get: function() {
        var item = this;

        do
        {
            if(!item.visible)return false;
            item = item.parent;
        }
        while(item);

        return true;
    }
});

/**
 * Sets a mask for the displayObject. A mask is an object that limits the visibility of an object to the shape of the mask applied to it.
 * In PIXI a regular mask must be a PIXI.Graphics object. This allows for much faster masking in canvas as it utilises shape clipping.
 * To remove a mask, set this property to null.
 *
 * @property mask
 * @type Graphics
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'mask', {
    get: function() {
        return this._mask;
    },
    set: function(value) {

        if(this._mask)this._mask.isMask = false;
        this._mask = value;
        if(this._mask)this._mask.isMask = true;
    }
});

/**
 * Sets the filters for the displayObject.
 * * IMPORTANT: This is a webGL only feature and will be ignored by the canvas renderer.
 * To remove filters simply set this property to 'null'
 * @property filters
 * @type Array An array of filters
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'filters', {
    get: function() {
        return this._filters;
    },
    set: function(value) {

        if(value)
        {
            // now put all the passes in one place..
            var passes = [];
            for (var i = 0; i < value.length; i++)
            {
                var filterPasses = value[i].passes;
                for (var j = 0; j < filterPasses.length; j++)
                {
                    passes.push(filterPasses[j]);
                }
            }

            // TODO change this as it is legacy
            this._filterBlock = {target:this, filterPasses:passes};
        }

        this._filters = value;
    }
});

/**
 * Set weather or not a the display objects is cached as a bitmap.
 * This basically takes a snap shot of the display object as it is at that moment. It can provide a performance benefit for complex static displayObjects
 * To remove filters simply set this property to 'null'
 * @property cacheAsBitmap
 * @type Boolean
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'cacheAsBitmap', {
    get: function() {
        return  this._cacheAsBitmap;
    },
    set: function(value) {

        if(this._cacheAsBitmap === value)return;

        if(value)
        {
            //this._cacheIsDirty = true;
            this._generateCachedSprite();
        }
        else
        {
            this._destroyCachedSprite();
        }

        this._cacheAsBitmap = value;
    }
});

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.DisplayObject.prototype.updateTransform = function()
{
    // TODO OPTIMIZE THIS!! with dirty
    if(this.rotation !== this.rotationCache)
    {

        this.rotationCache = this.rotation;
        this._sr =  Math.sin(this.rotation);
        this._cr =  Math.cos(this.rotation);
    }

   // var localTransform = this.localTransform//.toArray();
    var parentTransform = this.parent.worldTransform;//.toArray();
    var worldTransform = this.worldTransform;//.toArray();

    var px = this.pivot.x;
    var py = this.pivot.y;

    var a00 = this._cr * this.scale.x,
        a01 = -this._sr * this.scale.y,
        a10 = this._sr * this.scale.x,
        a11 = this._cr * this.scale.y,
        a02 = this.position.x - a00 * px - py * a01,
        a12 = this.position.y - a11 * py - px * a10,
        b00 = parentTransform.a, b01 = parentTransform.b,
        b10 = parentTransform.c, b11 = parentTransform.d;

    worldTransform.a = b00 * a00 + b01 * a10;
    worldTransform.b = b00 * a01 + b01 * a11;
    worldTransform.tx = b00 * a02 + b01 * a12 + parentTransform.tx;

    worldTransform.c = b10 * a00 + b11 * a10;
    worldTransform.d = b10 * a01 + b11 * a11;
    worldTransform.ty = b10 * a02 + b11 * a12 + parentTransform.ty;

    this.worldAlpha = this.alpha * this.parent.worldAlpha;
};

/**
 * Retrieves the bounds of the displayObject as a rectangle object
 *
 * @method getBounds
 * @return {Rectangle} the rectangular bounding area
 */
PIXI.DisplayObject.prototype.getBounds = function( matrix )
{
    matrix = matrix;//just to get passed js hinting (and preserve inheritance)
    return PIXI.EmptyRectangle;
};

/**
 * Retrieves the local bounds of the displayObject as a rectangle object
 *
 * @method getLocalBounds
 * @return {Rectangle} the rectangular bounding area
 */
PIXI.DisplayObject.prototype.getLocalBounds = function()
{
    return this.getBounds(PIXI.identityMatrix);///PIXI.EmptyRectangle();
};


/**
 * Sets the object's stage reference, the stage this object is connected to
 *
 * @method setStageReference
 * @param stage {Stage} the stage that the object will have as its current stage reference
 */
PIXI.DisplayObject.prototype.setStageReference = function(stage)
{
    this.stage = stage;
    if(this._interactive)this.stage.dirty = true;
};

PIXI.DisplayObject.prototype.generateTexture = function(renderer)
{
    var bounds = this.getLocalBounds();

    var renderTexture = new PIXI.RenderTexture(bounds.width | 0, bounds.height | 0, renderer);
    renderTexture.render(this, new PIXI.Point(-bounds.x, -bounds.y) );

    return renderTexture;
};

PIXI.DisplayObject.prototype.updateCache = function()
{
    this._generateCachedSprite();
};

PIXI.DisplayObject.prototype._renderCachedSprite = function(renderSession)
{
    this._cachedSprite.worldAlpha = this.worldAlpha;
   
    if(renderSession.gl)
    {
        PIXI.Sprite.prototype._renderWebGL.call(this._cachedSprite, renderSession);
    }
    else
    {
        PIXI.Sprite.prototype._renderCanvas.call(this._cachedSprite, renderSession);
    }
};

PIXI.DisplayObject.prototype._generateCachedSprite = function()//renderSession)
{
    this._cacheAsBitmap = false;
    var bounds = this.getLocalBounds();
   
    if(!this._cachedSprite)
    {
        var renderTexture = new PIXI.RenderTexture(bounds.width | 0, bounds.height | 0);//, renderSession.renderer);
        
        this._cachedSprite = new PIXI.Sprite(renderTexture);
        this._cachedSprite.worldTransform = this.worldTransform;
    }
    else
    {
        this._cachedSprite.texture.resize(bounds.width | 0, bounds.height | 0);
    }

    //REMOVE filter!
    var tempFilters = this._filters;
    this._filters = null;

    this._cachedSprite.filters = tempFilters;
    this._cachedSprite.texture.render(this, new PIXI.Point(-bounds.x, -bounds.y) );

    this._cachedSprite.anchor.x = -( bounds.x / bounds.width );
    this._cachedSprite.anchor.y = -( bounds.y / bounds.height );

    this._filters = tempFilters;

    this._cacheAsBitmap = true;
};

/**
* Renders the object using the WebGL renderer
*
* @method _renderWebGL
* @param renderSession {RenderSession} 
* @private
*/
PIXI.DisplayObject.prototype._destroyCachedSprite = function()
{
    if(!this._cachedSprite)return;

    this._cachedSprite.texture.destroy(true);
  //  console.log("DESTROY")
    // let the gc collect the unused sprite
    // TODO could be object pooled!
    this._cachedSprite = null;
};


PIXI.DisplayObject.prototype._renderWebGL = function(renderSession)
{
    // OVERWRITE;
    // this line is just here to pass jshinting :)
    renderSession = renderSession;
};

/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession} 
* @private
*/
PIXI.DisplayObject.prototype._renderCanvas = function(renderSession)
{
    // OVERWRITE;
    // this line is just here to pass jshinting :)
    renderSession = renderSession;
};

/**
 * The position of the displayObject on the x axis relative to the local coordinates of the parent.
 *
 * @property x
 * @type Number
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'x', {
    get: function() {
        return  this.position.x;
    },
    set: function(value) {
        this.position.x = value;
    }
});

/**
 * The position of the displayObject on the y axis relative to the local coordinates of the parent.
 *
 * @property y
 * @type Number
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'y', {
    get: function() {
        return  this.position.y;
    },
    set: function(value) {
        this.position.y = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * A DisplayObjectContainer represents a collection of display objects.
 * It is the base class of all display objects that act as a container for other objects.
 *
 * @class DisplayObjectContainer
 * @extends DisplayObject
 * @constructor
 */
PIXI.DisplayObjectContainer = function()
{
    PIXI.DisplayObject.call( this );

    /**
     * [read-only] The array of children of this container.
     *
     * @property children
     * @type Array<DisplayObject>
     * @readOnly
     */
    this.children = [];
};

// constructor
PIXI.DisplayObjectContainer.prototype = Object.create( PIXI.DisplayObject.prototype );
PIXI.DisplayObjectContainer.prototype.constructor = PIXI.DisplayObjectContainer;

/**
 * The width of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
 *
 * @property width
 * @type Number
 */

 
Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'width', {
    get: function() {
        return this.scale.x * this.getLocalBounds().width;
    },
    set: function(value) {
        
        var width = this.getLocalBounds().width;

        if(width !== 0)
        {
            this.scale.x = value / ( width/this.scale.x );
        }
        else
        {
            this.scale.x = 1;
        }

        
        this._width = value;
    }
});


/**
 * The height of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
 *
 * @property height
 * @type Number
 */

Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'height', {
    get: function() {
        return  this.scale.y * this.getLocalBounds().height;
    },
    set: function(value) {

        var height = this.getLocalBounds().height;

        if(height !== 0)
        {
            this.scale.y = value / ( height/this.scale.y );
        }
        else
        {
            this.scale.y = 1;
        }

        this._height = value;
    }
});


/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param child {DisplayObject} The DisplayObject to add to the container
 */
PIXI.DisplayObjectContainer.prototype.addChild = function(child)
{
    return this.addChildAt(child, this.children.length);
};

/**
 * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
 *
 * @method addChildAt
 * @param child {DisplayObject} The child to add
 * @param index {Number} The index to place the child in
 */
PIXI.DisplayObjectContainer.prototype.addChildAt = function(child, index)
{
    if(index >= 0 && index <= this.children.length)
    {
        if(child.parent)
        {
            child.parent.removeChild(child);
        }

        child.parent = this;

        this.children.splice(index, 0, child);

        if(this.stage)child.setStageReference(this.stage);

        return child;
    }
    else
    {
        throw new Error(child + ' The index '+ index +' supplied is out of bounds ' + this.children.length);
    }
};

/**
 * [NYI] Swaps the depth of 2 displayObjects
 *
 * @method swapChildren
 * @param child {DisplayObject}
 * @param child2 {DisplayObject}
 * @private
 */
PIXI.DisplayObjectContainer.prototype.swapChildren = function(child, child2)
{
    if(child === child2) {
        return;
    }

    var index1 = this.children.indexOf(child);
    var index2 = this.children.indexOf(child2);

    if(index1 < 0 || index2 < 0) {
        throw new Error('swapChildren: Both the supplied DisplayObjects must be a child of the caller.');
    }

    this.children[index1] = child2;
    this.children[index2] = child;
    
};

/**
 * Returns the child at the specified index
 *
 * @method getChildAt
 * @param index {Number} The index to get the child from
 */
PIXI.DisplayObjectContainer.prototype.getChildAt = function(index)
{
    if(index >= 0 && index < this.children.length)
    {
        return this.children[index];
    }
    else
    {
        throw new Error('Supplied index does not exist in the child list, or the supplied DisplayObject must be a child of the caller');
    }
};

/**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param child {DisplayObject} The DisplayObject to remove
 */
PIXI.DisplayObjectContainer.prototype.removeChild = function(child)
{
    return this.removeChildAt( this.children.indexOf( child ) );
};

/**
 * Removes a child from the specified index position in the child list of the container.
 *
 * @method removeChildAt
 * @param index {Number} The index to get the child from
 */
PIXI.DisplayObjectContainer.prototype.removeChildAt = function(index)
{
    var child = this.getChildAt( index );
    if(this.stage)
        child.removeStageReference();

    child.parent = undefined;
    this.children.splice( index, 1 );
    return child;
};

/**
* Removes all child instances from the child list of the container.
*
* @method removeChildren
* @param beginIndex {Number} The beginning position. Predefined value is 0.
* @param endIndex {Number} The ending position. Predefined value is children's array length.
*/
PIXI.DisplayObjectContainer.prototype.removeChildren = function(beginIndex, endIndex)
{
    var begin = beginIndex || 0;
    var end = typeof endIndex === 'number' ? endIndex : this.children.length;
    var range = end - begin;

    if (range > 0 && range <= end)
    {
        var removed = this.children.splice(begin, range);
        for (var i = 0; i < removed.length; i++) {
            var child = removed[i];
            if(this.stage)
                child.removeStageReference();
            child.parent = undefined;
        }
        return removed;
    }
    else
    {
        throw new Error( 'Range Error, numeric values are outside the acceptable range' );
    }
};

/*
 * Updates the container's childrens transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.DisplayObjectContainer.prototype.updateTransform = function()
{
    //this._currentBounds = null;

    if(!this.visible)return;

    PIXI.DisplayObject.prototype.updateTransform.call( this );

    if(this._cacheAsBitmap)return;

    for(var i=0,j=this.children.length; i<j; i++)
    {
        this.children[i].updateTransform();
    }
};

/**
 * Retrieves the bounds of the displayObjectContainer as a rectangle object
 *
 * @method getBounds
 * @return {Rectangle} the rectangular bounding area
 */
PIXI.DisplayObjectContainer.prototype.getBounds = function(matrix)
{
    if(this.children.length === 0)return PIXI.EmptyRectangle;

    // TODO the bounds have already been calculated this render session so return what we have
    if(matrix)
    {
        var matrixCache = this.worldTransform;
        this.worldTransform = matrix;
        this.updateTransform();
        this.worldTransform = matrixCache;
    }

    var minX = Infinity;
    var minY = Infinity;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var childBounds;
    var childMaxX;
    var childMaxY;

    var childVisible = false;

    for(var i=0,j=this.children.length; i<j; i++)
    {
        var child = this.children[i];
        
        if(!child.visible)continue;

        childVisible = true;

        childBounds = this.children[i].getBounds( matrix );
     
        minX = minX < childBounds.x ? minX : childBounds.x;
        minY = minY < childBounds.y ? minY : childBounds.y;

        childMaxX = childBounds.width + childBounds.x;
        childMaxY = childBounds.height + childBounds.y;

        maxX = maxX > childMaxX ? maxX : childMaxX;
        maxY = maxY > childMaxY ? maxY : childMaxY;
    }

    if(!childVisible)
        return PIXI.EmptyRectangle;

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.y = minY;
    bounds.width = maxX - minX;
    bounds.height = maxY - minY;

    // TODO: store a reference so that if this function gets called again in the render cycle we do not have to recalculate
    //this._currentBounds = bounds;
   
    return bounds;
};

PIXI.DisplayObjectContainer.prototype.getLocalBounds = function()
{
    var matrixCache = this.worldTransform;

    this.worldTransform = PIXI.identityMatrix;

    for(var i=0,j=this.children.length; i<j; i++)
    {
        this.children[i].updateTransform();
    }

    var bounds = this.getBounds();

    this.worldTransform = matrixCache;

    return bounds;
};

/**
 * Sets the container's stage reference, the stage this object is connected to
 *
 * @method setStageReference
 * @param stage {Stage} the stage that the container will have as its current stage reference
 */
PIXI.DisplayObjectContainer.prototype.setStageReference = function(stage)
{
    this.stage = stage;
    if(this._interactive)this.stage.dirty = true;

    for(var i=0,j=this.children.length; i<j; i++)
    {
        var child = this.children[i];
        child.setStageReference(stage);
    }
};

/**
 * removes the current stage reference of the container
 *
 * @method removeStageReference
 */
PIXI.DisplayObjectContainer.prototype.removeStageReference = function()
{

    for(var i=0,j=this.children.length; i<j; i++)
    {
        var child = this.children[i];
        child.removeStageReference();
    }

    if(this._interactive)this.stage.dirty = true;
    
    this.stage = null;
};

/**
* Renders the object using the WebGL renderer
*
* @method _renderWebGL
* @param renderSession {RenderSession} 
* @private
*/
PIXI.DisplayObjectContainer.prototype._renderWebGL = function(renderSession)
{
    if(!this.visible || this.alpha <= 0)return;
    
    if(this._cacheAsBitmap)
    {
        this._renderCachedSprite(renderSession);
        return;
    }
    
    var i,j;

    if(this._mask || this._filters)
    {
        
        // push filter first as we need to ensure the stencil buffer is correct for any masking
        if(this._filters)
        {
            renderSession.spriteBatch.flush();
            renderSession.filterManager.pushFilter(this._filterBlock);
        }

        if(this._mask)
        {
            renderSession.spriteBatch.stop();
            renderSession.maskManager.pushMask(this.mask, renderSession);
            renderSession.spriteBatch.start();
        }

        // simple render children!
        for(i=0,j=this.children.length; i<j; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }

        renderSession.spriteBatch.stop();

        if(this._mask)renderSession.maskManager.popMask(this._mask, renderSession);
        if(this._filters)renderSession.filterManager.popFilter();
        
        renderSession.spriteBatch.start();
    }
    else
    {
        // simple render children!
        for(i=0,j=this.children.length; i<j; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }
    }
};

/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession} 
* @private
*/
PIXI.DisplayObjectContainer.prototype._renderCanvas = function(renderSession)
{
    if(this.visible === false || this.alpha === 0)return;

    if(this._cacheAsBitmap)
    {

        this._renderCachedSprite(renderSession);
        return;
    }

    if(this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession.context);
    }

    for(var i=0,j=this.children.length; i<j; i++)
    {
        var child = this.children[i];
        child._renderCanvas(renderSession);
    }

    if(this._mask)
    {
        renderSession.maskManager.popMask(renderSession.context);
    }
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The Sprite object is the base for all textured objects that are rendered to the screen
 *
 * @class Sprite
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} The texture for this sprite
 * 
 * A sprite can be created directly from an image like this : 
 * var sprite = new PIXI.Sprite.fromImage('assets/image.png');
 * yourStage.addChild(sprite);
 * then obviously don't forget to add it to the stage you have already created
 */
PIXI.Sprite = function(texture)
{
    PIXI.DisplayObjectContainer.call( this );

    /**
     * The anchor sets the origin point of the texture.
     * The default is 0,0 this means the texture's origin is the top left
     * Setting than anchor to 0.5,0.5 means the textures origin is centred
     * Setting the anchor to 1,1 would mean the textures origin points will be the bottom right corner
     *
     * @property anchor
     * @type Point
     */
    this.anchor = new PIXI.Point();

    /**
     * The texture that the sprite is using
     *
     * @property texture
     * @type Texture
     */
    this.texture = texture;

    /**
     * The width of the sprite (this is initially set by the texture)
     *
     * @property _width
     * @type Number
     * @private
     */
    this._width = 0;

    /**
     * The height of the sprite (this is initially set by the texture)
     *
     * @property _height
     * @type Number
     * @private
     */
    this._height = 0;


    /**
     * The tint applied to the sprite. This is a hex value
     *
     * @property tint
     * @type Number
     * @default 0xFFFFFF
     */
    this.tint = 0xFFFFFF;// * Math.random();
    
    /**
     * The blend mode to be applied to the sprite
     *
     * @property blendMode
     * @type Number
     * @default PIXI.blendModes.NORMAL;
     */
    this.blendMode = PIXI.blendModes.NORMAL;

    if(texture.baseTexture.hasLoaded)
    {
        this.onTextureUpdate();
    }
    else
    {
        this.onTextureUpdateBind = this.onTextureUpdate.bind(this);
        this.texture.addEventListener( 'update', this.onTextureUpdateBind );
    }

    this.renderable = true;
};

// constructor
PIXI.Sprite.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Sprite.prototype.constructor = PIXI.Sprite;

/**
 * The width of the sprite, setting this will actually modify the scale to achieve the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.Sprite.prototype, 'width', {
    get: function() {
        return this.scale.x * this.texture.frame.width;
    },
    set: function(value) {
        this.scale.x = value / this.texture.frame.width;
        this._width = value;
    }
});

/**
 * The height of the sprite, setting this will actually modify the scale to achieve the value set
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI.Sprite.prototype, 'height', {
    get: function() {
        return  this.scale.y * this.texture.frame.height;
    },
    set: function(value) {
        this.scale.y = value / this.texture.frame.height;
        this._height = value;
    }
});

/**
 * Sets the texture of the sprite
 *
 * @method setTexture
 * @param texture {Texture} The PIXI texture that is displayed by the sprite
 */
PIXI.Sprite.prototype.setTexture = function(texture)
{
    this.texture = texture;
    this.cachedTint = 0xFFFFFF;
};

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */
PIXI.Sprite.prototype.onTextureUpdate = function()
{
    // so if _width is 0 then width was not set..
    if(this._width)this.scale.x = this._width / this.texture.frame.width;
    if(this._height)this.scale.y = this._height / this.texture.frame.height;


    //this.updateFrame = true;
};

/**
* Returns the framing rectangle of the sprite as a PIXI.Rectangle object
*
* @method getBounds
* @param matrix {Matrix} the transformation matrix of the sprite
* @return {Rectangle} the framing rectangle
*/
PIXI.Sprite.prototype.getBounds = function(matrix)
{

    var width = this.texture.frame.width;
    var height = this.texture.frame.height;

    var w0 = width * (1-this.anchor.x);
    var w1 = width * -this.anchor.x;

    var h0 = height * (1-this.anchor.y);
    var h1 = height * -this.anchor.y;

    var worldTransform = matrix || this.worldTransform ;

    var a = worldTransform.a;
    var b = worldTransform.c;
    var c = worldTransform.b;
    var d = worldTransform.d;
    var tx = worldTransform.tx;
    var ty = worldTransform.ty;

    var x1 = a * w1 + c * h1 + tx;
    var y1 = d * h1 + b * w1 + ty;

    var x2 = a * w0 + c * h1 + tx;
    var y2 = d * h1 + b * w0 + ty;

    var x3 = a * w0 + c * h0 + tx;
    var y3 = d * h0 + b * w0 + ty;

    var x4 =  a * w1 + c * h0 + tx;
    var y4 =  d * h0 + b * w1 + ty;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var minX = Infinity;
    var minY = Infinity;

    minX = x1 < minX ? x1 : minX;
    minX = x2 < minX ? x2 : minX;
    minX = x3 < minX ? x3 : minX;
    minX = x4 < minX ? x4 : minX;

    minY = y1 < minY ? y1 : minY;
    minY = y2 < minY ? y2 : minY;
    minY = y3 < minY ? y3 : minY;
    minY = y4 < minY ? y4 : minY;

    maxX = x1 > maxX ? x1 : maxX;
    maxX = x2 > maxX ? x2 : maxX;
    maxX = x3 > maxX ? x3 : maxX;
    maxX = x4 > maxX ? x4 : maxX;

    maxY = y1 > maxY ? y1 : maxY;
    maxY = y2 > maxY ? y2 : maxY;
    maxY = y3 > maxY ? y3 : maxY;
    maxY = y4 > maxY ? y4 : maxY;

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate
    this._currentBounds = bounds;

    return bounds;
};

/**
* Renders the object using the WebGL renderer
*
* @method _renderWebGL
* @param renderSession {RenderSession} 
* @private
*/
PIXI.Sprite.prototype._renderWebGL = function(renderSession)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if(!this.visible || this.alpha <= 0)return;
    
    var i,j;

    // do a quick check to see if this element has a mask or a filter.
    if(this._mask || this._filters)
    {
        var spriteBatch =  renderSession.spriteBatch;

        // push filter first as we need to ensure the stencil buffer is correct for any masking
        if(this._filters)
        {
            spriteBatch.flush();
            renderSession.filterManager.pushFilter(this._filterBlock);
        }

        if(this._mask)
        {
            spriteBatch.stop();
            renderSession.maskManager.pushMask(this.mask, renderSession);
            spriteBatch.start();
        }

        // add this sprite to the batch
        spriteBatch.render(this);

        // now loop through the children and make sure they get rendered
        for(i=0,j=this.children.length; i<j; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }

        // time to stop the sprite batch as either a mask element or a filter draw will happen next
        spriteBatch.stop();

        if(this._mask)renderSession.maskManager.popMask(this._mask, renderSession);
        if(this._filters)renderSession.filterManager.popFilter();
        
        spriteBatch.start();
    }
    else
    {
        renderSession.spriteBatch.render(this);

        // simple render children!
        for(i=0,j=this.children.length; i<j; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }
    }

   
    //TODO check culling  
};

/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession} 
* @private
*/
PIXI.Sprite.prototype._renderCanvas = function(renderSession)
{
    // If the sprite is not visible or the alpha is 0 then no need to render this element
    if (this.visible === false || this.alpha === 0) return;
    
    if (this.blendMode !== renderSession.currentBlendMode)
    {
        renderSession.currentBlendMode = this.blendMode;
        renderSession.context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];
    }

    if (this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession.context);
    }

    //  Ignore null sources
    if (this.texture.valid)
    {
        renderSession.context.globalAlpha = this.worldAlpha;

        //  Allow for pixel rounding
        if (renderSession.roundPixels)
        {
            renderSession.context.setTransform(
                this.worldTransform.a,
                this.worldTransform.c,
                this.worldTransform.b,
                this.worldTransform.d,
                this.worldTransform.tx | 0,
                this.worldTransform.ty | 0);
        }
        else
        {
            renderSession.context.setTransform(
                this.worldTransform.a,
                this.worldTransform.c,
                this.worldTransform.b,
                this.worldTransform.d,
                this.worldTransform.tx,
                this.worldTransform.ty);
        }

        //  If smoothingEnabled is supported and we need to change the smoothing property for this texture
        if (renderSession.smoothProperty && renderSession.scaleMode !== this.texture.baseTexture.scaleMode)
        {
            renderSession.scaleMode = this.texture.baseTexture.scaleMode;
            renderSession.context[renderSession.smoothProperty] = (renderSession.scaleMode === PIXI.scaleModes.LINEAR);
        }

        //  If the texture is trimmed we offset by the trim x/y, otherwise we use the frame dimensions
        var dx = (this.texture.trim) ? this.texture.trim.x - this.anchor.x * this.texture.trim.width : this.anchor.x * -this.texture.frame.width;
        var dy = (this.texture.trim) ? this.texture.trim.y - this.anchor.y * this.texture.trim.height : this.anchor.y * -this.texture.frame.height;

        if (this.tint !== 0xFFFFFF)
        {
            if (this.cachedTint !== this.tint)
            {
                this.cachedTint = this.tint;
                
                //  TODO clean up caching - how to clean up the caches?
                this.tintedTexture = PIXI.CanvasTinter.getTintedTexture(this, this.tint);
            }

            renderSession.context.drawImage(
                                this.tintedTexture,
                                0,
                                0,
                                this.texture.crop.width,
                                this.texture.crop.height,
                                dx,
                                dy,
                                this.texture.crop.width,
                                this.texture.crop.height);
        }
        else
        {
            renderSession.context.drawImage(
                                this.texture.baseTexture.source,
                                this.texture.crop.x,
                                this.texture.crop.y,
                                this.texture.crop.width,
                                this.texture.crop.height,
                                dx,
                                dy,
                                this.texture.crop.width,
                                this.texture.crop.height);
        }
    }

    // OVERWRITE
    for (var i = 0, j = this.children.length; i < j; i++)
    {
        this.children[i]._renderCanvas(renderSession);
    }

    if (this._mask)
    {
        renderSession.maskManager.popMask(renderSession.context);
    }
};

// some helper functions..

/**
 *
 * Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
 * The frame ids are created when a Texture packer file has been loaded
 *
 * @method fromFrame
 * @static
 * @param frameId {String} The frame Id of the texture in the cache
 * @return {Sprite} A new Sprite using a texture from the texture cache matching the frameId
 */
PIXI.Sprite.fromFrame = function(frameId)
{
    var texture = PIXI.TextureCache[frameId];
    if(!texture) throw new Error('The frameId "' + frameId + '" does not exist in the texture cache' + this);
    return new PIXI.Sprite(texture);
};

/**
 *
 * Helper function that creates a sprite that will contain a texture based on an image url
 * If the image is not in the texture cache it will be loaded
 *
 * @method fromImage
 * @static
 * @param imageId {String} The image url of the texture
 * @return {Sprite} A new Sprite using a texture from the texture cache matching the image id
 */
PIXI.Sprite.fromImage = function(imageId, crossorigin, scaleMode)
{
    var texture = PIXI.Texture.fromImage(imageId, crossorigin, scaleMode);
    return new PIXI.Sprite(texture);
};

/**
 * @author Mat Groves http://matgroves.com/
 */

/**
 * The SpriteBatch class is a really fast version of the DisplayObjectContainer 
 * built solely for speed, so use when you need a lot of sprites or particles.
 * And it's extremely easy to use : 

    var container = new PIXI.SpriteBatch();
 
    stage.addChild(container);
 
    for(var i  = 0; i < 100; i++)
    {
        var sprite = new PIXI.Sprite.fromImage("myImage.png");
        container.addChild(sprite);
    }
 * And here you have a hundred sprites that will be renderer at the speed of light
 *
 * @class SpriteBatch
 * @constructor
 * @param texture {Texture}
 */
PIXI.SpriteBatch = function(texture)
{
    PIXI.DisplayObjectContainer.call( this);

    this.textureThing = texture;

    this.ready = false;
};

PIXI.SpriteBatch.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.SpriteBatch.constructor = PIXI.SpriteBatch;

/*
 * Initialises the spriteBatch
 *
 * @method initWebGL
 * @param gl {WebGLContext} the current WebGL drawing context
 */
PIXI.SpriteBatch.prototype.initWebGL = function(gl)
{
    // TODO only one needed for the whole engine really?
    this.fastSpriteBatch = new PIXI.WebGLFastSpriteBatch(gl);

    this.ready = true;
};

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.SpriteBatch.prototype.updateTransform = function()
{
   // TODO dont need to!
    PIXI.DisplayObject.prototype.updateTransform.call( this );
  //  PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );
};

/**
* Renders the object using the WebGL renderer
*
* @method _renderWebGL
* @param renderSession {RenderSession} 
* @private
*/
PIXI.SpriteBatch.prototype._renderWebGL = function(renderSession)
{
    if(!this.visible || this.alpha <= 0 || !this.children.length)return;

    if(!this.ready)this.initWebGL( renderSession.gl );
    
    renderSession.spriteBatch.stop();
    
    renderSession.shaderManager.setShader(renderSession.shaderManager.fastShader);
    
    this.fastSpriteBatch.begin(this, renderSession);
    this.fastSpriteBatch.render(this);

    renderSession.spriteBatch.start();
 
};

/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession} 
* @private
*/
PIXI.SpriteBatch.prototype._renderCanvas = function(renderSession)
{
    var context = renderSession.context;
    context.globalAlpha = this.worldAlpha;

    PIXI.DisplayObject.prototype.updateTransform.call(this);

    var transform = this.worldTransform;
    // alow for trimming
       
    var isRotated = true;

    for (var i = 0; i < this.children.length; i++) {
       
        var child = this.children[i];

        if(!child.visible)continue;

        var texture = child.texture;
        var frame = texture.frame;

        context.globalAlpha = this.worldAlpha * child.alpha;

        if(child.rotation % (Math.PI * 2) === 0)
        {
            if(isRotated)
            {
                context.setTransform(transform.a, transform.c, transform.b, transform.d, transform.tx, transform.ty);
                isRotated = false;
            }

            // this is the fastest  way to optimise! - if rotation is 0 then we can avoid any kind of setTransform call
            context.drawImage(texture.baseTexture.source,
                                 frame.x,
                                 frame.y,
                                 frame.width,
                                 frame.height,
                                 ((child.anchor.x) * (-frame.width * child.scale.x) + child.position.x  + 0.5) | 0,
                                 ((child.anchor.y) * (-frame.height * child.scale.y) + child.position.y  + 0.5) | 0,
                                 frame.width * child.scale.x,
                                 frame.height * child.scale.y);
        }
        else
        {
            if(!isRotated)isRotated = true;
    
            PIXI.DisplayObject.prototype.updateTransform.call(child);
           
            var childTransform = child.worldTransform;

            // allow for trimming
           
            if (renderSession.roundPixels)
            {
                context.setTransform(childTransform.a, childTransform.c, childTransform.b, childTransform.d, childTransform.tx | 0, childTransform.ty | 0);
            }
            else
            {
                context.setTransform(childTransform.a, childTransform.c, childTransform.b, childTransform.d, childTransform.tx, childTransform.ty);
            }

            context.drawImage(texture.baseTexture.source,
                                 frame.x,
                                 frame.y,
                                 frame.width,
                                 frame.height,
                                 ((child.anchor.x) * (-frame.width) + 0.5) | 0,
                                 ((child.anchor.y) * (-frame.height) + 0.5) | 0,
                                 frame.width,
                                 frame.height);
           

        }

       // context.restore();
    }

//    context.restore();
};


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A MovieClip is a simple way to display an animation depicted by a list of textures.
 *
 * @class MovieClip
 * @extends Sprite
 * @constructor
 * @param textures {Array<Texture>} an array of {Texture} objects that make up the animation
 */
PIXI.MovieClip = function(textures)
{
    PIXI.Sprite.call(this, textures[0]);

    /**
     * The array of textures that make up the animation
     *
     * @property textures
     * @type Array
     */
    this.textures = textures;

    /**
     * The speed that the MovieClip will play at. Higher is faster, lower is slower
     *
     * @property animationSpeed
     * @type Number
     * @default 1
     */
    this.animationSpeed = 1;

    /**
     * Whether or not the movie clip repeats after playing.
     *
     * @property loop
     * @type Boolean
     * @default true
     */
    this.loop = true;

    /**
     * Function to call when a MovieClip finishes playing
     *
     * @property onComplete
     * @type Function
     */
    this.onComplete = null;

    /**
     * [read-only] The MovieClips current frame index (this may not have to be a whole number)
     *
     * @property currentFrame
     * @type Number
     * @default 0
     * @readOnly
     */
    this.currentFrame = 0;

    /**
     * [read-only] Indicates if the MovieClip is currently playing
     *
     * @property playing
     * @type Boolean
     * @readOnly
     */
    this.playing = false;
};

// constructor
PIXI.MovieClip.prototype = Object.create( PIXI.Sprite.prototype );
PIXI.MovieClip.prototype.constructor = PIXI.MovieClip;

/**
* [read-only] totalFrames is the total number of frames in the MovieClip. This is the same as number of textures
* assigned to the MovieClip.
*
* @property totalFrames
* @type Number
* @default 0
* @readOnly
*/
Object.defineProperty( PIXI.MovieClip.prototype, 'totalFrames', {
	get: function() {

		return this.textures.length;
	}
});


/**
 * Stops the MovieClip
 *
 * @method stop
 */
PIXI.MovieClip.prototype.stop = function()
{
    this.playing = false;
};

/**
 * Plays the MovieClip
 *
 * @method play
 */
PIXI.MovieClip.prototype.play = function()
{
    this.playing = true;
};

/**
 * Stops the MovieClip and goes to a specific frame
 *
 * @method gotoAndStop
 * @param frameNumber {Number} frame index to stop at
 */
PIXI.MovieClip.prototype.gotoAndStop = function(frameNumber)
{
    this.playing = false;
    this.currentFrame = frameNumber;
    var round = (this.currentFrame + 0.5) | 0;
    this.setTexture(this.textures[round % this.textures.length]);
};

/**
 * Goes to a specific frame and begins playing the MovieClip
 *
 * @method gotoAndPlay
 * @param frameNumber {Number} frame index to start at
 */
PIXI.MovieClip.prototype.gotoAndPlay = function(frameNumber)
{
    this.currentFrame = frameNumber;
    this.playing = true;
};

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.MovieClip.prototype.updateTransform = function()
{
    PIXI.Sprite.prototype.updateTransform.call(this);

    if(!this.playing)return;

    this.currentFrame += this.animationSpeed;

    var round = (this.currentFrame + 0.5) | 0;

    this.currentFrame = this.currentFrame % this.textures.length;

    if(this.loop || round < this.textures.length)
    {
        this.setTexture(this.textures[round % this.textures.length]);
    }
    else if(round >= this.textures.length)
    {
        this.gotoAndStop(this.textures.length - 1);
        if(this.onComplete)
        {
            this.onComplete();
        }
    }
};

/**
 * A short hand way of creating a movieclip from an array of frame ids
 *
 * @static
 * @method fromFrames
 * @param frames {Array} the array of frames ids the movieclip will use as its texture frames
 */
PIXI.MovieClip.fromFrames = function(frames)
{
    var textures = [];

    for (var i = 0; i < frames.length; i++)
    {
        textures.push(new PIXI.Texture.fromFrame(frames[i]));
    }

    return new PIXI.MovieClip(textures);
};

/**
 * A short hand way of creating a movieclip from an array of image ids
 *
 * @static
 * @method fromFrames
 * @param frames {Array} the array of image ids the movieclip will use as its texture frames
 */
PIXI.MovieClip.fromImages = function(images)
{
    var textures = [];

    for (var i = 0; i < images.length; i++)
    {
        textures.push(new PIXI.Texture.fromImage(images[i]));
    }

    return new PIXI.MovieClip(textures);
};
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


PIXI.FilterBlock = function()
{
    this.visible = true;
    this.renderable = true;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * - Modified by Tom Slezakowski http://www.tomslezakowski.com @TomSlezakowski (24/03/2014) - Added dropShadowColor.
 */

/**
 * A Text Object will create a line(s) of text. To split a line you can use '\n' 
 * or add a wordWrap property set to true and and wordWrapWidth property with a value
 * in the style object
 *
 * @class Text
 * @extends Sprite
 * @constructor
 * @param text {String} The copy that you would like the text to display
 * @param [style] {Object} The style parameters
 * @param [style.font] {String} default 'bold 20px Arial' The style and size of the font
 * @param [style.fill='black'] {String|Number} A canvas fillstyle that will be used on the text e.g 'red', '#00FF00'
 * @param [style.align='left'] {String} Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
 * @param [style.stroke] {String|Number} A canvas fillstyle that will be used on the text stroke e.g 'blue', '#FCFF00'
 * @param [style.strokeThickness=0] {Number} A number that represents the thickness of the stroke. Default is 0 (no stroke)
 * @param [style.wordWrap=false] {Boolean} Indicates if word wrap should be used
 * @param [style.wordWrapWidth=100] {Number} The width at which text will wrap, it needs wordWrap to be set to true
 * @param [style.dropShadow=false] {Boolean} Set a drop shadow for the text
 * @param [style.dropShadowColor='#000000'] {String} A fill style to be used on the dropshadow e.g 'red', '#00FF00'
 * @param [style.dropShadowAngle=Math.PI/4] {Number} Set a angle of the drop shadow
 * @param [style.dropShadowDistance=5] {Number} Set a distance of the drop shadow
 */
PIXI.Text = function(text, style)
{
    /**
     * The canvas element that everything is drawn to
     *
     * @property canvas
     * @type HTMLCanvasElement
     */
    this.canvas = document.createElement('canvas');

    /**
     * The canvas 2d context that everything is drawn with
     * @property context
     * @type HTMLCanvasElement 2d Context
     */
    this.context = this.canvas.getContext('2d');

    PIXI.Sprite.call(this, PIXI.Texture.fromCanvas(this.canvas));

    this.setText(text);
    this.setStyle(style);
};

// constructor
PIXI.Text.prototype = Object.create(PIXI.Sprite.prototype);
PIXI.Text.prototype.constructor = PIXI.Text;


/**
 * The width of the sprite, setting this will actually modify the scale to achieve the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.Text.prototype, 'width', {
    get: function() {

        if(this.dirty)
        {
            this.updateText();
            this.dirty = false;
        }


        return this.scale.x * this.texture.frame.width;
    },
    set: function(value) {
        this.scale.x = value / this.texture.frame.width;
        this._width = value;
    }
});

/**
 * The height of the Text, setting this will actually modify the scale to achieve the value set
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI.Text.prototype, 'height', {
    get: function() {

        if(this.dirty)
        {
            this.updateText();
            this.dirty = false;
        }


        return  this.scale.y * this.texture.frame.height;
    },
    set: function(value) {
        this.scale.y = value / this.texture.frame.height;
        this._height = value;
    }
});


/**
 * Set the style of the text
 *
 * @method setStyle
 * @param [style] {Object} The style parameters
 * @param [style.font='bold 20pt Arial'] {String} The style and size of the font
 * @param [style.fill='black'] {Object} A canvas fillstyle that will be used on the text eg 'red', '#00FF00'
 * @param [style.align='left'] {String} Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
 * @param [style.stroke='black'] {String} A canvas fillstyle that will be used on the text stroke eg 'blue', '#FCFF00'
 * @param [style.strokeThickness=0] {Number} A number that represents the thickness of the stroke. Default is 0 (no stroke)
 * @param [style.wordWrap=false] {Boolean} Indicates if word wrap should be used
 * @param [style.wordWrapWidth=100] {Number} The width at which text will wrap
 * @param [style.dropShadow=false] {Boolean} Set a drop shadow for the text
 * @param [style.dropShadowColor='#000000'] {String} A fill style to be used on the dropshadow e.g 'red', '#00FF00'
 * @param [style.dropShadowAngle=Math.PI/4] {Number} Set a angle of the drop shadow
 * @param [style.dropShadowDistance=5] {Number} Set a distance of the drop shadow
 */
PIXI.Text.prototype.setStyle = function(style)
{
    style = style || {};
    style.font = style.font || 'bold 20pt Arial';
    style.fill = style.fill || 'black';
    style.align = style.align || 'left';
    style.stroke = style.stroke || 'black'; //provide a default, see: https://github.com/GoodBoyDigital/pixi.js/issues/136
    style.strokeThickness = style.strokeThickness || 0;
    style.wordWrap = style.wordWrap || false;
    style.wordWrapWidth = style.wordWrapWidth || 100;
    style.wordWrapWidth = style.wordWrapWidth || 100;
    
    style.dropShadow = style.dropShadow || false;
    style.dropShadowAngle = style.dropShadowAngle || Math.PI / 6;
    style.dropShadowDistance = style.dropShadowDistance || 4;
    style.dropShadowColor = style.dropShadowColor || 'black';

    this.style = style;
    this.dirty = true;
};

/**
 * Set the copy for the text object. To split a line you can use '\n'
 *
 * @method setText
 * @param {String} text The copy that you would like the text to display
 */
PIXI.Text.prototype.setText = function(text)
{
    this.text = text.toString() || ' ';
    this.dirty = true;

};

/**
 * Renders text and updates it when needed
 *
 * @method updateText
 * @private
 */
PIXI.Text.prototype.updateText = function()
{
    this.context.font = this.style.font;

    var outputText = this.text;

    // word wrap
    // preserve original text
    if(this.style.wordWrap)outputText = this.wordWrap(this.text);

    //split text into lines
    var lines = outputText.split(/(?:\r\n|\r|\n)/);

    //calculate text width
    var lineWidths = [];
    var maxLineWidth = 0;
    for (var i = 0; i < lines.length; i++)
    {
        var lineWidth = this.context.measureText(lines[i]).width;
        lineWidths[i] = lineWidth;
        maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }

    var width = maxLineWidth + this.style.strokeThickness;
    if(this.style.dropShadow)width += this.style.dropShadowDistance;

    this.canvas.width = width + this.context.lineWidth;
    //calculate text height
    var lineHeight = this.determineFontHeight('font: ' + this.style.font  + ';') + this.style.strokeThickness;
    
    var height = lineHeight * lines.length;
    if(this.style.dropShadow)height += this.style.dropShadowDistance;

    this.canvas.height = height;

    if(navigator.isCocoonJS) this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    
    this.context.font = this.style.font;
    this.context.strokeStyle = this.style.stroke;
    this.context.lineWidth = this.style.strokeThickness;
    this.context.textBaseline = 'top';

    var linePositionX;
    var linePositionY;

    if(this.style.dropShadow)
    {
        this.context.fillStyle = this.style.dropShadowColor;

        var xShadowOffset = Math.sin(this.style.dropShadowAngle) * this.style.dropShadowDistance;
        var yShadowOffset = Math.cos(this.style.dropShadowAngle) * this.style.dropShadowDistance;

        for (i = 0; i < lines.length; i++)
        {
            linePositionX = this.style.strokeThickness / 2;
            linePositionY = this.style.strokeThickness / 2 + i * lineHeight;

            if(this.style.align === 'right')
            {
                linePositionX += maxLineWidth - lineWidths[i];
            }
            else if(this.style.align === 'center')
            {
                linePositionX += (maxLineWidth - lineWidths[i]) / 2;
            }

            if(this.style.fill)
            {
                this.context.fillText(lines[i], linePositionX + xShadowOffset, linePositionY + yShadowOffset);
            }

          //  if(dropShadow)
        }
    }

    //set canvas text styles
    this.context.fillStyle = this.style.fill;
    
    //draw lines line by line
    for (i = 0; i < lines.length; i++)
    {
        linePositionX = this.style.strokeThickness / 2;
        linePositionY = this.style.strokeThickness / 2 + i * lineHeight;

        if(this.style.align === 'right')
        {
            linePositionX += maxLineWidth - lineWidths[i];
        }
        else if(this.style.align === 'center')
        {
            linePositionX += (maxLineWidth - lineWidths[i]) / 2;
        }

        if(this.style.stroke && this.style.strokeThickness)
        {
            this.context.strokeText(lines[i], linePositionX, linePositionY);
        }

        if(this.style.fill)
        {
            this.context.fillText(lines[i], linePositionX, linePositionY);
        }

      //  if(dropShadow)
    }


    this.updateTexture();
};

/**
 * Updates texture size based on canvas size
 *
 * @method updateTexture
 * @private
 */
PIXI.Text.prototype.updateTexture = function()
{
    this.texture.baseTexture.width = this.canvas.width;
    this.texture.baseTexture.height = this.canvas.height;
    this.texture.crop.width = this.texture.frame.width = this.canvas.width;
    this.texture.crop.height = this.texture.frame.height = this.canvas.height;

    this._width = this.canvas.width;
    this._height = this.canvas.height;

    this.requiresUpdate =  true;
};

/**
* Renders the object using the WebGL renderer
*
* @method _renderWebGL
* @param renderSession {RenderSession} 
* @private
*/
PIXI.Text.prototype._renderWebGL = function(renderSession)
{
    if(this.requiresUpdate)
    {
        this.requiresUpdate = false;
        PIXI.updateWebGLTexture(this.texture.baseTexture, renderSession.gl);
    }

    PIXI.Sprite.prototype._renderWebGL.call(this, renderSession);
};

/**
 * Updates the transform of this object
 *
 * @method updateTransform
 * @private
 */
PIXI.Text.prototype.updateTransform = function()
{
    if(this.dirty)
    {
        this.updateText();
        this.dirty = false;
    }

    PIXI.Sprite.prototype.updateTransform.call(this);
};

/*
 * http://stackoverflow.com/users/34441/ellisbben
 * great solution to the problem!
 * returns the height of the given font
 *
 * @method determineFontHeight
 * @param fontStyle {Object}
 * @private
 */
PIXI.Text.prototype.determineFontHeight = function(fontStyle)
{
    // build a little reference dictionary so if the font style has been used return a
    // cached version...
    var result = PIXI.Text.heightCache[fontStyle];

    if(!result)
    {
        var body = document.getElementsByTagName('body')[0];
        var dummy = document.createElement('div');
        var dummyText = document.createTextNode('M');
        dummy.appendChild(dummyText);
        dummy.setAttribute('style', fontStyle + ';position:absolute;top:0;left:0');
        body.appendChild(dummy);

        result = dummy.offsetHeight;
        PIXI.Text.heightCache[fontStyle] = result;

        body.removeChild(dummy);
    }

    return result;
};

/**
 * Applies newlines to a string to have it optimally fit into the horizontal
 * bounds set by the Text object's wordWrapWidth property.
 *
 * @method wordWrap
 * @param text {String}
 * @private
 */
PIXI.Text.prototype.wordWrap = function(text)
{
    // Greedy wrapping algorithm that will wrap words as the line grows longer
    // than its horizontal bounds.
    var result = '';
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++)
    {
        var spaceLeft = this.style.wordWrapWidth;
        var words = lines[i].split(' ');
        for (var j = 0; j < words.length; j++)
        {
            var wordWidth = this.context.measureText(words[j]).width;
            var wordWidthWithSpace = wordWidth + this.context.measureText(' ').width;
            if(j === 0 || wordWidthWithSpace > spaceLeft)
            {
                // Skip printing the newline if it's the first word of the line that is
                // greater than the word wrap width.
                if(j > 0)
                {
                    result += '\n';
                }
                result += words[j];
                spaceLeft = this.style.wordWrapWidth - wordWidth;
            }
            else
            {
                spaceLeft -= wordWidthWithSpace;
                result += ' ' + words[j];
            }
        }

        if (i < lines.length-1)
        {
            result += '\n';
        }
    }
    return result;
};

/**
 * Destroys this text object
 *
 * @method destroy
 * @param destroyBaseTexture {Boolean} whether to destroy the base texture as well
 */
PIXI.Text.prototype.destroy = function(destroyBaseTexture)
{
    // make sure to reset the the context and canvas.. dont want this hanging around in memory!
    this.context = null;
    this.canvas = null;

    this.texture.destroy(destroyBaseTexture === undefined ? true : destroyBaseTexture);
};

PIXI.Text.heightCache = {};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Text Object will create a line(s) of text using bitmap font. To split a line you can use '\n', '\r' or '\r\n'
 * You can generate the fnt files using
 * http://www.angelcode.com/products/bmfont/ for windows or
 * http://www.bmglyph.com/ for mac.
 *
 * @class BitmapText
 * @extends DisplayObjectContainer
 * @constructor
 * @param text {String} The copy that you would like the text to display
 * @param style {Object} The style parameters
 * @param style.font {String} The size (optional) and bitmap font id (required) eq 'Arial' or '20px Arial' (must have loaded previously)
 * @param [style.align='left'] {String} Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
 */
PIXI.BitmapText = function(text, style)
{
    PIXI.DisplayObjectContainer.call(this);

    this._pool = [];

    this.setText(text);
    this.setStyle(style);
    this.updateText();
    this.dirty = false;
};

// constructor
PIXI.BitmapText.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.BitmapText.prototype.constructor = PIXI.BitmapText;

/**
 * Set the copy for the text object
 *
 * @method setText
 * @param text {String} The copy that you would like the text to display
 */
PIXI.BitmapText.prototype.setText = function(text)
{
    this.text = text || ' ';
    this.dirty = true;
};

/**
 * Set the style of the text
 * style.font {String} The size (optional) and bitmap font id (required) eq 'Arial' or '20px Arial' (must have loaded previously)
 * [style.align='left'] {String} Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
 *
 * @method setStyle
 * @param style {Object} The style parameters, contained as properties of an object
 */
PIXI.BitmapText.prototype.setStyle = function(style)
{
    style = style || {};
    style.align = style.align || 'left';
    this.style = style;

    var font = style.font.split(' ');
    this.fontName = font[font.length - 1];
    this.fontSize = font.length >= 2 ? parseInt(font[font.length - 2], 10) : PIXI.BitmapText.fonts[this.fontName].size;

    this.dirty = true;
    this.tint = style.tint;
};

/**
 * Renders text and updates it when needed
 *
 * @method updateText
 * @private
 */
PIXI.BitmapText.prototype.updateText = function()
{
    var data = PIXI.BitmapText.fonts[this.fontName];
    var pos = new PIXI.Point();
    var prevCharCode = null;
    var chars = [];
    var maxLineWidth = 0;
    var lineWidths = [];
    var line = 0;
    var scale = this.fontSize / data.size;
    

    for(var i = 0; i < this.text.length; i++)
    {
        var charCode = this.text.charCodeAt(i);
        if(/(?:\r\n|\r|\n)/.test(this.text.charAt(i)))
        {
            lineWidths.push(pos.x);
            maxLineWidth = Math.max(maxLineWidth, pos.x);
            line++;

            pos.x = 0;
            pos.y += data.lineHeight;
            prevCharCode = null;
            continue;
        }

        var charData = data.chars[charCode];
        if(!charData) continue;

        if(prevCharCode && charData[prevCharCode])
        {
            pos.x += charData.kerning[prevCharCode];
        }
        chars.push({texture:charData.texture, line: line, charCode: charCode, position: new PIXI.Point(pos.x + charData.xOffset, pos.y + charData.yOffset)});
        pos.x += charData.xAdvance;

        prevCharCode = charCode;
    }

    lineWidths.push(pos.x);
    maxLineWidth = Math.max(maxLineWidth, pos.x);

    var lineAlignOffsets = [];
    for(i = 0; i <= line; i++)
    {
        var alignOffset = 0;
        if(this.style.align === 'right')
        {
            alignOffset = maxLineWidth - lineWidths[i];
        }
        else if(this.style.align === 'center')
        {
            alignOffset = (maxLineWidth - lineWidths[i]) / 2;
        }
        lineAlignOffsets.push(alignOffset);
    }

    var lenChildren = this.children.length;
    var lenChars = chars.length;
    var tint = this.tint || 0xFFFFFF;
    for(i = 0; i < lenChars; i++)
    {
        var c = i < lenChildren ? this.children[i] : this._pool.pop(); // get old child if have. if not - take from pool.

        if (c) c.setTexture(chars[i].texture); // check if got one before.
        else c = new PIXI.Sprite(chars[i].texture); // if no create new one.

        c.position.x = (chars[i].position.x + lineAlignOffsets[chars[i].line]) * scale;
        c.position.y = chars[i].position.y * scale;
        c.scale.x = c.scale.y = scale;
        c.tint = tint;
        if (!c.parent) this.addChild(c);
    }

    // remove unnecessary children.
    // and put their into the pool.
    while(this.children.length > lenChars)
    {
        var child = this.getChildAt(this.children.length - 1);
        this._pool.push(child);
        this.removeChild(child);
    }


    /**
     * [read-only] The width of the overall text, different from fontSize,
     * which is defined in the style object
     *
     * @property textWidth
     * @type Number
     */
    this.textWidth = maxLineWidth * scale;

    /**
     * [read-only] The height of the overall text, different from fontSize,
     * which is defined in the style object
     *
     * @property textHeight
     * @type Number
     */
    this.textHeight = (pos.y + data.lineHeight) * scale;
};

/**
 * Updates the transform of this object
 *
 * @method updateTransform
 * @private
 */
PIXI.BitmapText.prototype.updateTransform = function()
{
    if(this.dirty)
    {
        this.updateText();
        this.dirty = false;
    }

    PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
};

PIXI.BitmapText.fonts = {};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */
 
/**
 * Holds all information related to an Interaction event
 *
 * @class InteractionData
 * @constructor
 */
PIXI.InteractionData = function()
{
    /**
     * This point stores the global coords of where the touch/mouse event happened
     *
     * @property global
     * @type Point
     */
    this.global = new PIXI.Point();

   
    /**
     * The target Sprite that was interacted with
     *
     * @property target
     * @type Sprite
     */
    this.target = null;

    /**
     * When passed to an event handler, this will be the original DOM Event that was captured
     *
     * @property originalEvent
     * @type Event
     */
    this.originalEvent = null;
};

/**
 * This will return the local coordinates of the specified displayObject for this InteractionData
 *
 * @method getLocalPosition
 * @param displayObject {DisplayObject} The DisplayObject that you would like the local coords off
 * @return {Point} A point containing the coordinates of the InteractionData position relative to the DisplayObject
 */
PIXI.InteractionData.prototype.getLocalPosition = function(displayObject)
{
    var worldTransform = displayObject.worldTransform;
    var global = this.global;

    // do a cheeky transform to get the mouse coords;
    var a00 = worldTransform.a, a01 = worldTransform.b, a02 = worldTransform.tx,
        a10 = worldTransform.c, a11 = worldTransform.d, a12 = worldTransform.ty,
        id = 1 / (a00 * a11 + a01 * -a10);
    // set the mouse coords...
    return new PIXI.Point(a11 * id * global.x + -a01 * id * global.y + (a12 * a01 - a02 * a11) * id,
                               a00 * id * global.y + -a10 * id * global.x + (-a12 * a00 + a02 * a10) * id);
};

// constructor
PIXI.InteractionData.prototype.constructor = PIXI.InteractionData;
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

 /**
 * The interaction manager deals with mouse and touch events. Any DisplayObject can be interactive
 * if its interactive parameter is set to true
 * This manager also supports multitouch.
 *
 * @class InteractionManager
 * @constructor
 * @param stage {Stage} The stage to handle interactions
 */
PIXI.InteractionManager = function(stage)
{
    /**
     * a reference to the stage
     *
     * @property stage
     * @type Stage
     */
    this.stage = stage;

    /**
     * the mouse data
     *
     * @property mouse
     * @type InteractionData
     */
    this.mouse = new PIXI.InteractionData();

    /**
     * an object that stores current touches (InteractionData) by id reference
     *
     * @property touchs
     * @type Object
     */
    this.touchs = {};

    // helpers
    this.tempPoint = new PIXI.Point();

    /**
     * 
     * @property mouseoverEnabled
     * @type Boolean
     * @default
     */
    this.mouseoverEnabled = true;

    /**
     * tiny little interactiveData pool !
     * 
     * @property pool
     * @type Array
     */
    this.pool = [];

    /**
     * An array containing all the iterative items from the our interactive tree
     * @property interactiveItems
     * @type Array
     * @private
     *
     */
    this.interactiveItems = [];

    /**
     * Our canvas
     * @property interactionDOMElement
     * @type HTMLCanvasElement
     * @private
     */
    this.interactionDOMElement = null;

    //this will make it so that you dont have to call bind all the time
    this.onMouseMove = this.onMouseMove.bind( this );
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);

    this.last = 0;

    /**
     * The css style of the cursor that is being used
     * @property currentCursorStyle
     * @type String
     *
     */
    this.currentCursorStyle = 'inherit';

    /**
     * Is set to true when the mouse is moved out of the canvas
     * @property mouseOut
     * @type Boolean
     *
     */
    this.mouseOut = false;
};

// constructor
PIXI.InteractionManager.prototype.constructor = PIXI.InteractionManager;

/**
 * Collects an interactive sprite recursively to have their interactions managed
 *
 * @method collectInteractiveSprite
 * @param displayObject {DisplayObject} the displayObject to collect
 * @param iParent {DisplayObject} the display object's parent
 * @private
 */
PIXI.InteractionManager.prototype.collectInteractiveSprite = function(displayObject, iParent)
{
    var children = displayObject.children;
    var length = children.length;

    // make an interaction tree... {item.__interactiveParent}
    for (var i = length-1; i >= 0; i--)
    {
        var child = children[i];

        // push all interactive bits
        if(child._interactive)
        {
            iParent.interactiveChildren = true;
            //child.__iParent = iParent;
            this.interactiveItems.push(child);

            if(child.children.length > 0)
            {
                this.collectInteractiveSprite(child, child);
            }
        }
        else
        {
            child.__iParent = null;

            if(child.children.length > 0)
            {
                this.collectInteractiveSprite(child, iParent);
            }
        }

    }
};

/**
 * Sets the target for event delegation
 *
 * @method setTarget
 * @param target {WebGLRenderer|CanvasRenderer} the renderer to bind events to
 * @private
 */
PIXI.InteractionManager.prototype.setTarget = function(target)
{
    this.target = target;

    //check if the dom element has been set. If it has don't do anything
    if( this.interactionDOMElement === null ) {

        this.setTargetDomElement( target.view );
    }

    
};


/**
 * Sets the DOM element which will receive mouse/touch events. This is useful for when you have other DOM
 * elements on top of the renderers Canvas element. With this you'll be able to delegate another DOM element
 * to receive those events
 *
 * @method setTargetDomElement
 * @param domElement {DOMElement} the DOM element which will receive mouse and touch events
 * @private
 */
PIXI.InteractionManager.prototype.setTargetDomElement = function(domElement)
{

    this.removeEvents();


    if (window.navigator.msPointerEnabled)
    {
        // time to remove some of that zoom in ja..
        domElement.style['-ms-content-zooming'] = 'none';
        domElement.style['-ms-touch-action'] = 'none';

        // DO some window specific touch!
    }

    this.interactionDOMElement = domElement;

    domElement.addEventListener('mousemove',  this.onMouseMove, true);
    domElement.addEventListener('mousedown',  this.onMouseDown, true);
    domElement.addEventListener('mouseout',   this.onMouseOut, true);

    // aint no multi touch just yet!
    domElement.addEventListener('touchstart', this.onTouchStart, true);
    domElement.addEventListener('touchend', this.onTouchEnd, true);
    domElement.addEventListener('touchmove', this.onTouchMove, true);

    window.addEventListener('mouseup',  this.onMouseUp, true);
};


PIXI.InteractionManager.prototype.removeEvents = function()
{
    if(!this.interactionDOMElement)return;

    this.interactionDOMElement.style['-ms-content-zooming'] = '';
    this.interactionDOMElement.style['-ms-touch-action'] = '';

    this.interactionDOMElement.removeEventListener('mousemove',  this.onMouseMove, true);
    this.interactionDOMElement.removeEventListener('mousedown',  this.onMouseDown, true);
    this.interactionDOMElement.removeEventListener('mouseout',   this.onMouseOut, true);

    // aint no multi touch just yet!
    this.interactionDOMElement.removeEventListener('touchstart', this.onTouchStart, true);
    this.interactionDOMElement.removeEventListener('touchend', this.onTouchEnd, true);
    this.interactionDOMElement.removeEventListener('touchmove', this.onTouchMove, true);

    this.interactionDOMElement = null;

    window.removeEventListener('mouseup',  this.onMouseUp, true);
};

/**
 * updates the state of interactive objects
 *
 * @method update
 * @private
 */
PIXI.InteractionManager.prototype.update = function()
{
    if(!this.target)return;

    // frequency of 30fps??
    var now = Date.now();
    var diff = now - this.last;
    diff = (diff * PIXI.INTERACTION_FREQUENCY ) / 1000;
    if(diff < 1)return;
    this.last = now;

    var i = 0;

    // ok.. so mouse events??
    // yes for now :)
    // OPTIMISE - how often to check??
    if(this.dirty)
    {
        this.rebuildInteractiveGraph();
    }

    // loop through interactive objects!
    var length = this.interactiveItems.length;
    var cursor = 'inherit';
    var over = false;

    for (i = 0; i < length; i++)
    {
        var item = this.interactiveItems[i];

        // OPTIMISATION - only calculate every time if the mousemove function exists..
        // OK so.. does the object have any other interactive functions?
        // hit-test the clip!
       // if(item.mouseover || item.mouseout || item.buttonMode)
       // {
        // ok so there are some functions so lets hit test it..
        item.__hit = this.hitTest(item, this.mouse);
        this.mouse.target = item;
        // ok so deal with interactions..
        // looks like there was a hit!
        if(item.__hit && !over)
        {
            if(item.buttonMode) cursor = item.defaultCursor;

            if(!item.interactiveChildren)over = true;

            if(!item.__isOver)
            {
                if(item.mouseover)item.mouseover(this.mouse);
                item.__isOver = true;
            }
        }
        else
        {
            if(item.__isOver)
            {
                // roll out!
                if(item.mouseout)item.mouseout(this.mouse);
                item.__isOver = false;
            }
        }
    }

    if( this.currentCursorStyle !== cursor )
    {
        this.currentCursorStyle = cursor;
        this.interactionDOMElement.style.cursor = cursor;
    }
};

PIXI.InteractionManager.prototype.rebuildInteractiveGraph = function()
{
    this.dirty = false;

    var len = this.interactiveItems.length;

    for (var i = 0; i < len; i++) {
        this.interactiveItems[i].interactiveChildren = false;
    }

    this.interactiveItems = [];

    if(this.stage.interactive)this.interactiveItems.push(this.stage);
    // go through and collect all the objects that are interactive..
    this.collectInteractiveSprite(this.stage, this.stage);
};

/**
 * Is called when the mouse moves across the renderer element
 *
 * @method onMouseMove
 * @param event {Event} The DOM event of the mouse moving
 * @private
 */
PIXI.InteractionManager.prototype.onMouseMove = function(event)
{
    if(this.dirty)
    {
        this.rebuildInteractiveGraph();
    }

    this.mouse.originalEvent = event || window.event; //IE uses window.event
    // TODO optimize by not check EVERY TIME! maybe half as often? //
    var rect = this.interactionDOMElement.getBoundingClientRect();

    this.mouse.global.x = (event.clientX - rect.left) * (this.target.width / rect.width);
    this.mouse.global.y = (event.clientY - rect.top) * ( this.target.height / rect.height);

    var length = this.interactiveItems.length;

    for (var i = 0; i < length; i++)
    {
        var item = this.interactiveItems[i];

        if(item.mousemove)
        {
            //call the function!
            item.mousemove(this.mouse);
        }
    }
};

/**
 * Is called when the mouse button is pressed down on the renderer element
 *
 * @method onMouseDown
 * @param event {Event} The DOM event of a mouse button being pressed down
 * @private
 */
PIXI.InteractionManager.prototype.onMouseDown = function(event)
{
    if(this.dirty)
    {
        this.rebuildInteractiveGraph();
    }

    this.mouse.originalEvent = event || window.event; //IE uses window.event

    if(PIXI.AUTO_PREVENT_DEFAULT)this.mouse.originalEvent.preventDefault();

    // loop through interaction tree...
    // hit test each item! ->
    // get interactive items under point??
    //stage.__i
    var length = this.interactiveItems.length;

    // while
    // hit test
    for (var i = 0; i < length; i++)
    {
        var item = this.interactiveItems[i];

        if(item.mousedown || item.click)
        {
            item.__mouseIsDown = true;
            item.__hit = this.hitTest(item, this.mouse);

            if(item.__hit)
            {
                //call the function!
                if(item.mousedown)item.mousedown(this.mouse);
                item.__isDown = true;

                // just the one!
                if(!item.interactiveChildren)break;
            }
        }
    }
};

/**
 * Is called when the mouse button is moved out of the renderer element
 *
 * @method onMouseOut
 * @param event {Event} The DOM event of a mouse button being moved out
 * @private 
 */
PIXI.InteractionManager.prototype.onMouseOut = function()
{
    if(this.dirty)
    {
        this.rebuildInteractiveGraph();
    }

    var length = this.interactiveItems.length;

    this.interactionDOMElement.style.cursor = 'inherit';

    for (var i = 0; i < length; i++)
    {
        var item = this.interactiveItems[i];
        if(item.__isOver)
        {
            this.mouse.target = item;
            if(item.mouseout)item.mouseout(this.mouse);
            item.__isOver = false;
        }
    }

    this.mouseOut = true;

    // move the mouse to an impossible position
    this.mouse.global.x = -10000;
    this.mouse.global.y = -10000;
};

/**
 * Is called when the mouse button is released on the renderer element
 *
 * @method onMouseUp
 * @param event {Event} The DOM event of a mouse button being released
 * @private
 */
PIXI.InteractionManager.prototype.onMouseUp = function(event)
{
    if(this.dirty)
    {
        this.rebuildInteractiveGraph();
    }

    this.mouse.originalEvent = event || window.event; //IE uses window.event

    var length = this.interactiveItems.length;
    var up = false;

    for (var i = 0; i < length; i++)
    {
        var item = this.interactiveItems[i];

        item.__hit = this.hitTest(item, this.mouse);

        if(item.__hit && !up)
        {
            //call the function!
            if(item.mouseup)
            {
                item.mouseup(this.mouse);
            }
            if(item.__isDown)
            {
                if(item.click)item.click(this.mouse);
            }

            if(!item.interactiveChildren)up = true;
        }
        else
        {
            if(item.__isDown)
            {
                if(item.mouseupoutside)item.mouseupoutside(this.mouse);
            }
        }

        item.__isDown = false;
        //}
    }
};

/**
 * Tests if the current mouse coordinates hit a sprite
 *
 * @method hitTest
 * @param item {DisplayObject} The displayObject to test for a hit
 * @param interactionData {InteractionData} The interactionData object to update in the case there is a hit
 * @private
 */
PIXI.InteractionManager.prototype.hitTest = function(item, interactionData)
{
    var global = interactionData.global;

    if( !item.worldVisible )return false;

    // temp fix for if the element is in a non visible
   
    var isSprite = (item instanceof PIXI.Sprite),
        worldTransform = item.worldTransform,
        a00 = worldTransform.a, a01 = worldTransform.b, a02 = worldTransform.tx,
        a10 = worldTransform.c, a11 = worldTransform.d, a12 = worldTransform.ty,
        id = 1 / (a00 * a11 + a01 * -a10),
        x = a11 * id * global.x + -a01 * id * global.y + (a12 * a01 - a02 * a11) * id,
        y = a00 * id * global.y + -a10 * id * global.x + (-a12 * a00 + a02 * a10) * id;

    interactionData.target = item;

    //a sprite or display object with a hit area defined
    if(item.hitArea && item.hitArea.contains) {
        if(item.hitArea.contains(x, y)) {
            //if(isSprite)
            interactionData.target = item;

            return true;
        }

        return false;
    }
    // a sprite with no hitarea defined
    else if(isSprite)
    {
        var width = item.texture.frame.width,
            height = item.texture.frame.height,
            x1 = -width * item.anchor.x,
            y1;

        if(x > x1 && x < x1 + width)
        {
            y1 = -height * item.anchor.y;

            if(y > y1 && y < y1 + height)
            {
                // set the target property if a hit is true!
                interactionData.target = item;
                return true;
            }
        }
    }

    var length = item.children.length;

    for (var i = 0; i < length; i++)
    {
        var tempItem = item.children[i];
        var hit = this.hitTest(tempItem, interactionData);
        if(hit)
        {
            // hmm.. TODO SET CORRECT TARGET?
            interactionData.target = item;
            return true;
        }
    }

    return false;
};

/**
 * Is called when a touch is moved across the renderer element
 *
 * @method onTouchMove
 * @param event {Event} The DOM event of a touch moving across the renderer view
 * @private
 */
PIXI.InteractionManager.prototype.onTouchMove = function(event)
{
    if(this.dirty)
    {
        this.rebuildInteractiveGraph();
    }

    var rect = this.interactionDOMElement.getBoundingClientRect();
    var changedTouches = event.changedTouches;
    var touchData;
    var i = 0;

    for (i = 0; i < changedTouches.length; i++)
    {
        var touchEvent = changedTouches[i];
        touchData = this.touchs[touchEvent.identifier];
        touchData.originalEvent =  event || window.event;

        // update the touch position
        touchData.global.x = (touchEvent.clientX - rect.left) * (this.target.width / rect.width);
        touchData.global.y = (touchEvent.clientY - rect.top)  * (this.target.height / rect.height);
        if(navigator.isCocoonJS) {
            touchData.global.x = touchEvent.clientX;
            touchData.global.y = touchEvent.clientY;
        }

        for (var j = 0; j < this.interactiveItems.length; j++)
        {
            var item = this.interactiveItems[j];
            if(item.touchmove && item.__touchData && item.__touchData[touchEvent.identifier]) item.touchmove(touchData);
        }
    }
};

/**
 * Is called when a touch is started on the renderer element
 *
 * @method onTouchStart
 * @param event {Event} The DOM event of a touch starting on the renderer view
 * @private
 */
PIXI.InteractionManager.prototype.onTouchStart = function(event)
{
    if(this.dirty)
    {
        this.rebuildInteractiveGraph();
    }

    var rect = this.interactionDOMElement.getBoundingClientRect();

    if(PIXI.AUTO_PREVENT_DEFAULT)event.preventDefault();
    
    var changedTouches = event.changedTouches;
    for (var i=0; i < changedTouches.length; i++)
    {
        var touchEvent = changedTouches[i];

        var touchData = this.pool.pop();
        if(!touchData)touchData = new PIXI.InteractionData();

        touchData.originalEvent =  event || window.event;

        this.touchs[touchEvent.identifier] = touchData;
        touchData.global.x = (touchEvent.clientX - rect.left) * (this.target.width / rect.width);
        touchData.global.y = (touchEvent.clientY - rect.top)  * (this.target.height / rect.height);
        if(navigator.isCocoonJS) {
            touchData.global.x = touchEvent.clientX;
            touchData.global.y = touchEvent.clientY;
        }

        var length = this.interactiveItems.length;

        for (var j = 0; j < length; j++)
        {
            var item = this.interactiveItems[j];

            if(item.touchstart || item.tap)
            {
                item.__hit = this.hitTest(item, touchData);

                if(item.__hit)
                {
                    //call the function!
                    if(item.touchstart)item.touchstart(touchData);
                    item.__isDown = true;
                    item.__touchData = item.__touchData || {};
                    item.__touchData[touchEvent.identifier] = touchData;

                    if(!item.interactiveChildren)break;
                }
            }
        }
    }
};

/**
 * Is called when a touch is ended on the renderer element
 *
 * @method onTouchEnd
 * @param event {Event} The DOM event of a touch ending on the renderer view
 * @private
 */
PIXI.InteractionManager.prototype.onTouchEnd = function(event)
{
    if(this.dirty)
    {
        this.rebuildInteractiveGraph();
    }
    
    //this.mouse.originalEvent = event || window.event; //IE uses window.event
    var rect = this.interactionDOMElement.getBoundingClientRect();
    var changedTouches = event.changedTouches;

    for (var i=0; i < changedTouches.length; i++)
    {
        var touchEvent = changedTouches[i];
        var touchData = this.touchs[touchEvent.identifier];
        var up = false;
        touchData.global.x = (touchEvent.clientX - rect.left) * (this.target.width / rect.width);
        touchData.global.y = (touchEvent.clientY - rect.top)  * (this.target.height / rect.height);
        if(navigator.isCocoonJS) {
            touchData.global.x = touchEvent.clientX;
            touchData.global.y = touchEvent.clientY;
        }

        var length = this.interactiveItems.length;
        for (var j = 0; j < length; j++)
        {
            var item = this.interactiveItems[j];

            if(item.__touchData && item.__touchData[touchEvent.identifier]) {

                item.__hit = this.hitTest(item, item.__touchData[touchEvent.identifier]);

                // so this one WAS down...
                touchData.originalEvent = event || window.event;
                // hitTest??

                if(item.touchend || item.tap)
                {
                    if(item.__hit && !up)
                    {
                        if(item.touchend)item.touchend(touchData);
                        if(item.__isDown)
                        {
                            if(item.tap)item.tap(touchData);
                        }

                        if(!item.interactiveChildren)up = true;
                    }
                    else
                    {
                        if(item.__isDown)
                        {
                            if(item.touchendoutside)item.touchendoutside(touchData);
                        }
                    }

                    item.__isDown = false;
                }

                item.__touchData[touchEvent.identifier] = null;
            }
        }
        // remove the touch..
        this.pool.push(touchData);
        this.touchs[touchEvent.identifier] = null;
    }
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Stage represents the root of the display tree. Everything connected to the stage is rendered
 *
 * @class Stage
 * @extends DisplayObjectContainer
 * @constructor
 * @param backgroundColor {Number} the background color of the stage, you have to pass this in is in hex format
 *      like: 0xFFFFFF for white
 * 
 * Creating a stage is a mandatory process when you use Pixi, which is as simple as this : 
 * var stage = new PIXI.Stage(0xFFFFFF);
 * where the parameter given is the background colour of the stage, in hex
 * you will use this stage instance to add your sprites to it and therefore to the renderer
 * Here is how to add a sprite to the stage : 
 * stage.addChild(sprite);
 */
PIXI.Stage = function(backgroundColor)
{
    PIXI.DisplayObjectContainer.call( this );

    /**
     * [read-only] Current transform of the object based on world (parent) factors
     *
     * @property worldTransform
     * @type Mat3
     * @readOnly
     * @private
     */
    this.worldTransform = new PIXI.Matrix();

    /**
     * Whether or not the stage is interactive
     *
     * @property interactive
     * @type Boolean
     */
    this.interactive = true;

    /**
     * The interaction manage for this stage, manages all interactive activity on the stage
     *
     * @property interactionManager
     * @type InteractionManager
     */
    this.interactionManager = new PIXI.InteractionManager(this);

    /**
     * Whether the stage is dirty and needs to have interactions updated
     *
     * @property dirty
     * @type Boolean
     * @private
     */
    this.dirty = true;

    //the stage is its own stage
    this.stage = this;

    //optimize hit detection a bit
    this.stage.hitArea = new PIXI.Rectangle(0,0,100000, 100000);

    this.setBackgroundColor(backgroundColor);
};

// constructor
PIXI.Stage.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Stage.prototype.constructor = PIXI.Stage;

/**
 * Sets another DOM element which can receive mouse/touch interactions instead of the default Canvas element.
 * This is useful for when you have other DOM elements on top of the Canvas element.
 *
 * @method setInteractionDelegate
 * @param domElement {DOMElement} This new domElement which will receive mouse/touch events
 */
PIXI.Stage.prototype.setInteractionDelegate = function(domElement)
{
    this.interactionManager.setTargetDomElement( domElement );
};

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.Stage.prototype.updateTransform = function()
{
    this.worldAlpha = 1;

    for(var i=0,j=this.children.length; i<j; i++)
    {
        this.children[i].updateTransform();
    }

    if(this.dirty)
    {
        this.dirty = false;
        // update interactive!
        this.interactionManager.dirty = true;
    }

    if(this.interactive)this.interactionManager.update();
};

/**
 * Sets the background color for the stage
 *
 * @method setBackgroundColor
 * @param backgroundColor {Number} the color of the background, easiest way to pass this in is in hex format
 *      like: 0xFFFFFF for white
 */
PIXI.Stage.prototype.setBackgroundColor = function(backgroundColor)
{
    this.backgroundColor = backgroundColor || 0x000000;
    this.backgroundColorSplit = PIXI.hex2rgb(this.backgroundColor);
    var hex = this.backgroundColor.toString(16);
    hex = '000000'.substr(0, 6 - hex.length) + hex;
    this.backgroundColorString = '#' + hex;
};

/**
 * This will return the point containing global coords of the mouse.
 *
 * @method getMousePosition
 * @return {Point} The point containing the coords of the global InteractionData position.
 */
PIXI.Stage.prototype.getMousePosition = function()
{
    return this.interactionManager.mouse.global;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */
 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

/**
 * A polyfill for requestAnimationFrame
 * You can actually use both requestAnimationFrame and requestAnimFrame, 
 * you will still benefit from the polyfill
 *
 * @method requestAnimationFrame
 */
/**
 * A polyfill for cancelAnimationFrame
 *
 * @method cancelAnimationFrame
 */
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
        window[vendors[x] + 'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}

if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}

window.requestAnimFrame = window.requestAnimationFrame;

/**
 * Converts a hex color number to an [R, G, B] array
 *
 * @method hex2rgb
 * @param hex {Number}
 */
PIXI.hex2rgb = function(hex) {
    return [(hex >> 16 & 0xFF) / 255, ( hex >> 8 & 0xFF) / 255, (hex & 0xFF)/ 255];
};

/**
 * Converts a color as an [R, G, B] array to a hex number
 *
 * @method rgb2hex
 * @param rgb {Array}
 */
PIXI.rgb2hex = function(rgb) {
    return ((rgb[0]*255 << 16) + (rgb[1]*255 << 8) + rgb[2]*255);
};

/**
 * A polyfill for Function.prototype.bind
 *
 * @method bind
 */
if (typeof Function.prototype.bind !== 'function') {
    Function.prototype.bind = (function () {
        var slice = Array.prototype.slice;
        return function (thisArg) {
            var target = this, boundArgs = slice.call(arguments, 1);

            if (typeof target !== 'function') throw new TypeError();

            function bound() {
                var args = boundArgs.concat(slice.call(arguments));
                target.apply(this instanceof bound ? this : thisArg, args);
            }

            bound.prototype = (function F(proto) {
                if (proto) F.prototype = proto;
                if (!(this instanceof F)) return new F();
            })(target.prototype);

            return bound;
        };
    })();
}

/**
 * A wrapper for ajax requests to be handled cross browser
 *
 * @class AjaxRequest
 * @constructor
 */
PIXI.AjaxRequest = function()
{
    var activexmodes = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Microsoft.XMLHTTP']; //activeX versions to check for in IE

    if (window.ActiveXObject)
    { //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
        for (var i=0; i<activexmodes.length; i++)
        {
            try{
                return new window.ActiveXObject(activexmodes[i]);
            }
            catch(e) {
                //suppress error
            }
        }
    }
    else if (window.XMLHttpRequest) // if Mozilla, Safari etc
    {
        return new window.XMLHttpRequest();
    }
    else
    {
        return false;
    }
};
/*
PIXI.packColorRGBA = function(r, g, b, a)//r, g, b, a)
{
  //  console.log(r, b, c, d)
  return (Math.floor((r)*63) << 18) | (Math.floor((g)*63) << 12) | (Math.floor((b)*63) << 6);// | (Math.floor((a)*63))
  //  i = i | (Math.floor((a)*63));
   // return i;
   // var r = (i / 262144.0 ) / 64;
   // var g = (i / 4096.0)%64 / 64;
  //  var b = (i / 64.0)%64 / 64;
  //  var a = (i)%64 / 64;
     
  //  console.log(r, g, b, a);
  //  return i;

};
*/
/*
PIXI.packColorRGB = function(r, g, b)//r, g, b, a)
{
    return (Math.floor((r)*255) << 16) | (Math.floor((g)*255) << 8) | (Math.floor((b)*255));
};

PIXI.unpackColorRGB = function(r, g, b)//r, g, b, a)
{
    return (Math.floor((r)*255) << 16) | (Math.floor((g)*255) << 8) | (Math.floor((b)*255));
};
*/

/**
 * Checks whether the Canvas BlendModes are supported by the current browser
 *
 * @method canUseNewCanvasBlendModes
 * @return {Boolean} whether they are supported
 */
PIXI.canUseNewCanvasBlendModes = function()
{
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    var context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0,0,1,1);
    context.globalCompositeOperation = 'multiply';
    context.fillStyle = '#fff';
    context.fillRect(0,0,1,1);
    return context.getImageData(0,0,1,1).data[0] === 0;
};

/**
 * Given a number, this function returns the closest number that is a power of two
 * this function is taken from Starling Framework as its pretty neat ;)
 *
 * @method getNextPowerOfTwo
 * @param number {Number}
 * @return {Number} the closest number that is a power of two
 */
PIXI.getNextPowerOfTwo = function(number)
{
    if (number > 0 && (number & (number - 1)) === 0) // see: http://goo.gl/D9kPj
        return number;
    else
    {
        var result = 1;
        while (result < number) result <<= 1;
        return result;
    }
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */
 
/**
 * https://github.com/mrdoob/eventtarget.js/
 * THankS mr DOob!
 */

/**
 * Adds event emitter functionality to a class
 *
 * @class EventTarget
 * @example
 *      function MyEmitter() {
 *          PIXI.EventTarget.call(this); //mixes in event target stuff
 *      }
 *
 *      var em = new MyEmitter();
 *      em.emit({ type: 'eventName', data: 'some data' });
 */
PIXI.EventTarget = function () {

    /**
     * Holds all the listeners
     *
     * @property listeners
     * @type Object
     */
    var listeners = {};

    /**
     * Adds a listener for a specific event
     *
     * @method addEventListener
     * @param type {string} A string representing the event type to listen for.
     * @param listener {function} The callback function that will be fired when the event occurs
     */
    this.addEventListener = this.on = function ( type, listener ) {


        if ( listeners[ type ] === undefined ) {

            listeners[ type ] = [];

        }

        if ( listeners[ type ].indexOf( listener ) === - 1 ) {

            listeners[ type ].unshift( listener );
        }

    };

    /**
     * Fires the event, ie pretends that the event has happened
     *
     * @method dispatchEvent
     * @param event {Event} the event object
     */
    this.dispatchEvent = this.emit = function ( event ) {

        if ( !listeners[ event.type ] || !listeners[ event.type ].length ) {

            return;

        }


        for(var i = listeners[ event.type ].length-1; i >= 0; i--) {
//        for(var i = 0, l=listeners[ event.type ].length; i < l; i++) {


            listeners[ event.type ][ i ]( event );

        }

    };

    /**
     * Removes the specified listener that was assigned to the specified event type
     *
     * @method removeEventListener
     * @param type {string} A string representing the event type which will have its listener removed
     * @param listener {function} The callback function that was be fired when the event occured
     */
    this.removeEventListener = this.off = function ( type, listener ) {

        if ( listeners[ type ] === undefined ) return;

        var index = listeners[ type ].indexOf( listener );

        if ( index !== - 1 ) {

            listeners[ type ].splice( index, 1 );

        }

    };

    /**
     * Removes all the listeners that were active for the specified event type
     *
     * @method removeAllEventListeners
     * @param type {string} A string representing the event type which will have all its listeners removed
     */
	this.removeAllEventListeners = function( type ) {
		var a = listeners[type];
		if (a)
			a.length = 0;
	};
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * This helper function will automatically detect which renderer you should be using.
 * WebGL is the preferred renderer as it is a lot faster. If webGL is not supported by
 * the browser then this function will return a canvas renderer
 * @class autoDetectRenderer
 * @static
 * @param width=800 {Number} the width of the renderers view
 * @param height=600 {Number} the height of the renderers view
 * @param [view] {Canvas} the canvas to use as a view, optional 
 * @param [transparent=false] {Boolean} the transparency of the render view, default false
 * @param [antialias=false] {Boolean} sets antialias (only applicable in webGL chrome at the moment)
 *
 */
PIXI.autoDetectRenderer = function(width, height, view, transparent, antialias)
{
    if(!width)width = 800;
    if(!height)height = 600;

    // BORROWED from Mr Doob (mrdoob.com)
    var webgl = ( function () { try {
                                    var canvas = document.createElement( 'canvas' );
                                    return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
                                } catch( e ) {
                                    return false;
                                }
                            } )();

    if( webgl )
    {
        return new PIXI.WebGLRenderer(width, height, view, transparent, antialias);
    }

    return  new PIXI.CanvasRenderer(width, height, view, transparent);
};

/**
 * This helper function will automatically detect which renderer you should be using.
 * This function is very similar to the autoDetectRenderer function except that is will return a canvas renderer for android.
 * Even thought both android chrome suports webGL the canvas implementation perform better at the time of writing. 
 * This function will likely change and update as webGL performance imporoves on thease devices.
 * @class getRecommendedRenderer
 * @static
 * @param width=800 {Number} the width of the renderers view
 * @param height=600 {Number} the height of the renderers view
 * @param [view] {Canvas} the canvas to use as a view, optional 
 * @param [transparent=false] {Boolean} the transparency of the render view, default false
 * @param [antialias=false] {Boolean} sets antialias (only applicable in webGL chrome at the moment)
 *
 */
PIXI.autoDetectRecommendedRenderer = function(width, height, view, transparent, antialias)
{
    if(!width)width = 800;
    if(!height)height = 600;

    // BORROWED from Mr Doob (mrdoob.com)
    var webgl = ( function () { try {
                                    var canvas = document.createElement( 'canvas' );
                                    return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
                                } catch( e ) {
                                    return false;
                                }
                            } )();

    var isAndroid = /Android/i.test(navigator.userAgent);

    if( webgl && !isAndroid)
    {
        return new PIXI.WebGLRenderer(width, height, view, transparent, antialias);
    }

    return  new PIXI.CanvasRenderer(width, height, view, transparent);
};

/*
    PolyK library
    url: http://polyk.ivank.net
    Released under MIT licence.

    Copyright (c) 2012 Ivan Kuckir

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.

    This is an amazing lib!

    slightly modified by Mat Groves (matgroves.com);
*/

/**
 * Based on the Polyk library http://polyk.ivank.net released under MIT licence.
 * This is an amazing lib!
 * slightly modified by Mat Groves (matgroves.com);
 * @class PolyK
 *
 */
PIXI.PolyK = {};

/**
 * Triangulates shapes for webGL graphic fills
 *
 * @method Triangulate
 * 
 */
PIXI.PolyK.Triangulate = function(p)
{
    var sign = true;

    var n = p.length >> 1;
    if(n < 3) return [];

    var tgs = [];
    var avl = [];
    for(var i = 0; i < n; i++) avl.push(i);

    i = 0;
    var al = n;
    while(al > 3)
    {
        var i0 = avl[(i+0)%al];
        var i1 = avl[(i+1)%al];
        var i2 = avl[(i+2)%al];

        var ax = p[2*i0],  ay = p[2*i0+1];
        var bx = p[2*i1],  by = p[2*i1+1];
        var cx = p[2*i2],  cy = p[2*i2+1];

        var earFound = false;
        if(PIXI.PolyK._convex(ax, ay, bx, by, cx, cy, sign))
        {
            earFound = true;
            for(var j = 0; j < al; j++)
            {
                var vi = avl[j];
                if(vi === i0 || vi === i1 || vi === i2) continue;

                if(PIXI.PolyK._PointInTriangle(p[2*vi], p[2*vi+1], ax, ay, bx, by, cx, cy)) {
                    earFound = false;
                    break;
                }
            }
        }

        if(earFound)
        {
            tgs.push(i0, i1, i2);
            avl.splice((i+1)%al, 1);
            al--;
            i = 0;
        }
        else if(i++ > 3*al)
        {
            // need to flip flip reverse it!
            // reset!
            if(sign)
            {
                tgs = [];
                avl = [];
                for(i = 0; i < n; i++) avl.push(i);

                i = 0;
                al = n;

                sign = false;
            }
            else
            {
                window.console.log("PIXI Warning: shape too complex to fill");
                return [];
            }
        }
    }

    tgs.push(avl[0], avl[1], avl[2]);
    return tgs;
};

/**
 * Checks whether a point is within a triangle
 *
 * @method _PointInTriangle
 * @param px {Number} x coordinate of the point to test
 * @param py {Number} y coordinate of the point to test
 * @param ax {Number} x coordinate of the a point of the triangle
 * @param ay {Number} y coordinate of the a point of the triangle
 * @param bx {Number} x coordinate of the b point of the triangle
 * @param by {Number} y coordinate of the b point of the triangle
 * @param cx {Number} x coordinate of the c point of the triangle
 * @param cy {Number} y coordinate of the c point of the triangle
 * @private
 */
PIXI.PolyK._PointInTriangle = function(px, py, ax, ay, bx, by, cx, cy)
{
    var v0x = cx-ax;
    var v0y = cy-ay;
    var v1x = bx-ax;
    var v1y = by-ay;
    var v2x = px-ax;
    var v2y = py-ay;

    var dot00 = v0x*v0x+v0y*v0y;
    var dot01 = v0x*v1x+v0y*v1y;
    var dot02 = v0x*v2x+v0y*v2y;
    var dot11 = v1x*v1x+v1y*v1y;
    var dot12 = v1x*v2x+v1y*v2y;

    var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    // Check if point is in triangle
    return (u >= 0) && (v >= 0) && (u + v < 1);
};

/**
 * Checks whether a shape is convex
 *
 * @method _convex
 * 
 * @private
 */
PIXI.PolyK._convex = function(ax, ay, bx, by, cx, cy, sign)
{
    return ((ay-by)*(cx-bx) + (bx-ax)*(cy-by) >= 0) === sign;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

// TODO Alvin and Mat
// Should we eventually create a Utils class ? 
// Or just move this file to the pixi.js file ?
PIXI.initDefaultShaders = function()
{
   
  //  PIXI.stripShader = new PIXI.StripShader();
//    PIXI.stripShader.init();

};

PIXI.CompileVertexShader = function(gl, shaderSrc)
{
    return PIXI._CompileShader(gl, shaderSrc, gl.VERTEX_SHADER);
};

PIXI.CompileFragmentShader = function(gl, shaderSrc)
{
    return PIXI._CompileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
};

PIXI._CompileShader = function(gl, shaderSrc, shaderType)
{
    var src = shaderSrc.join("\n");
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        window.console.log(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
};

PIXI.compileProgram = function(gl, vertexSrc, fragmentSrc)
{
    var fragmentShader = PIXI.CompileFragmentShader(gl, fragmentSrc);
    var vertexShader = PIXI.CompileVertexShader(gl, vertexSrc);

    var shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        window.console.log("Could not initialise shaders");
    }

    return shaderProgram;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * @author Richard Davey http://www.photonstorm.com @photonstorm
 */

/**
* @class PixiShader
* @constructor
*/
PIXI.PixiShader = function(gl)
{
    this._UID = PIXI._UID++;
    
    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;

    /**
    * @property {any} program - The WebGL program.
    */
    this.program = null;

    /**
    * @property {array} fragmentSrc - The fragment shader.
    */
    this.fragmentSrc = [
        'precision lowp float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D uSampler;',
        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
        '}'
    ];

    /**
    * @property {number} textureCount - A local texture counter for multi-texture shaders.
    */
    this.textureCount = 0;

    this.attributes = [];

    this.init();
};

/**
* Initialises the shader
* @method init
*
*/
PIXI.PixiShader.prototype.init = function()
{
    var gl = this.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc || PIXI.PixiShader.defaultVertexSrc, this.fragmentSrc);
    
    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.uSampler = gl.getUniformLocation(program, 'uSampler');
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.dimensions = gl.getUniformLocation(program, 'dimensions');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');


    // Begin worst hack eva //

    // WHY??? ONLY on my chrome pixel the line above returns -1 when using filters?
    // maybe its something to do with the current state of the gl context.
    // Im convinced this is a bug in the chrome browser as there is NO reason why this should be returning -1 especially as it only manifests on my chrome pixel
    // If theres any webGL people that know why could happen please help :)
    if(this.colorAttribute === -1)
    {
        this.colorAttribute = 2;
    }

    this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute];

    // End worst hack eva //

    // add those custom shaders!
    for (var key in this.uniforms)
    {
        // get the uniform locations..
        this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);
    }

    this.initUniforms();

    this.program = program;
};

/**
* Initialises the shader uniform values.
* Uniforms are specified in the GLSL_ES Specification: http://www.khronos.org/registry/webgl/specs/latest/1.0/
* http://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf
*
* @method initUniforms
*/
PIXI.PixiShader.prototype.initUniforms = function()
{
    this.textureCount = 1;
    var gl = this.gl;
    var uniform;

    for (var key in this.uniforms)
    {
        uniform = this.uniforms[key];

        var type = uniform.type;

        if (type === 'sampler2D')
        {
            uniform._init = false;

            if (uniform.value !== null)
            {
                this.initSampler2D(uniform);
            }
        }
        else if (type === 'mat2' || type === 'mat3' || type === 'mat4')
        {
            //  These require special handling
            uniform.glMatrix = true;
            uniform.glValueLength = 1;

            if (type === 'mat2')
            {
                uniform.glFunc = gl.uniformMatrix2fv;
            }
            else if (type === 'mat3')
            {
                uniform.glFunc = gl.uniformMatrix3fv;
            }
            else if (type === 'mat4')
            {
                uniform.glFunc = gl.uniformMatrix4fv;
            }
        }
        else
        {
            //  GL function reference
            uniform.glFunc = gl['uniform' + type];

            if (type === '2f' || type === '2i')
            {
                uniform.glValueLength = 2;
            }
            else if (type === '3f' || type === '3i')
            {
                uniform.glValueLength = 3;
            }
            else if (type === '4f' || type === '4i')
            {
                uniform.glValueLength = 4;
            }
            else
            {
                uniform.glValueLength = 1;
            }
        }
    }

};

/**
* Initialises a Sampler2D uniform (which may only be available later on after initUniforms once the texture has loaded)
*
* @method initSampler2D
*/
PIXI.PixiShader.prototype.initSampler2D = function(uniform)
{
    if (!uniform.value || !uniform.value.baseTexture || !uniform.value.baseTexture.hasLoaded)
    {
        return;
    }

    var gl = this.gl;

    gl.activeTexture(gl['TEXTURE' + this.textureCount]);
    gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id]);

    //  Extended texture data
    if (uniform.textureData)
    {
        var data = uniform.textureData;

        // GLTexture = mag linear, min linear_mipmap_linear, wrap repeat + gl.generateMipmap(gl.TEXTURE_2D);
        // GLTextureLinear = mag/min linear, wrap clamp
        // GLTextureNearestRepeat = mag/min NEAREST, wrap repeat
        // GLTextureNearest = mag/min nearest, wrap clamp
        // AudioTexture = whatever + luminance + width 512, height 2, border 0
        // KeyTexture = whatever + luminance + width 256, height 2, border 0

        //  magFilter can be: gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR or gl.NEAREST
        //  wrapS/T can be: gl.CLAMP_TO_EDGE or gl.REPEAT

        var magFilter = (data.magFilter) ? data.magFilter : gl.LINEAR;
        var minFilter = (data.minFilter) ? data.minFilter : gl.LINEAR;
        var wrapS = (data.wrapS) ? data.wrapS : gl.CLAMP_TO_EDGE;
        var wrapT = (data.wrapT) ? data.wrapT : gl.CLAMP_TO_EDGE;
        var format = (data.luminance) ? gl.LUMINANCE : gl.RGBA;

        if (data.repeat)
        {
            wrapS = gl.REPEAT;
            wrapT = gl.REPEAT;
        }

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !!data.flipY);

        if (data.width)
        {
            var width = (data.width) ? data.width : 512;
            var height = (data.height) ? data.height : 2;
            var border = (data.border) ? data.border : 0;

            // void texImage2D(GLenum target, GLint level, GLenum internalformat, GLsizei width, GLsizei height, GLint border, GLenum format, GLenum type, ArrayBufferView? pixels);
            gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, border, format, gl.UNSIGNED_BYTE, null);
        }
        else
        {
            //  void texImage2D(GLenum target, GLint level, GLenum internalformat, GLenum format, GLenum type, ImageData? pixels);
            gl.texImage2D(gl.TEXTURE_2D, 0, format, gl.RGBA, gl.UNSIGNED_BYTE, uniform.value.baseTexture.source);
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    }

    gl.uniform1i(uniform.uniformLocation, this.textureCount);

    uniform._init = true;

    this.textureCount++;

};

/**
* Updates the shader uniform values.
*
* @method syncUniforms
*/
PIXI.PixiShader.prototype.syncUniforms = function()
{
    this.textureCount = 1;
    var uniform;
    var gl = this.gl;

    //  This would probably be faster in an array and it would guarantee key order
    for (var key in this.uniforms)
    {
        uniform = this.uniforms[key];

        if (uniform.glValueLength === 1)
        {
            if (uniform.glMatrix === true)
            {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.transpose, uniform.value);
            }
            else
            {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value);
            }
        }
        else if (uniform.glValueLength === 2)
        {
            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y);
        }
        else if (uniform.glValueLength === 3)
        {
            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z);
        }
        else if (uniform.glValueLength === 4)
        {
            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w);
        }
        else if (uniform.type === 'sampler2D')
        {
            if (uniform._init)
            {
                gl.activeTexture(gl['TEXTURE' + this.textureCount]);
                gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture( uniform.value.baseTexture, gl));
                gl.uniform1i(uniform.uniformLocation, this.textureCount);
                this.textureCount++;
            }
            else
            {
                this.initSampler2D(uniform);
            }
        }
    }

};

/**
* Destroys the shader
* @method destroy
*/
PIXI.PixiShader.prototype.destroy = function()
{
    this.gl.deleteProgram( this.program );
    this.uniforms = null;
    this.gl = null;

    this.attributes = null;
};

/**
* The Default Vertex shader source
* @property defaultVertexSrc
* @type String
*/
PIXI.PixiShader.defaultVertexSrc = [
    'attribute vec2 aVertexPosition;',
    'attribute vec2 aTextureCoord;',
    'attribute vec2 aColor;',

    'uniform vec2 projectionVector;',
    'uniform vec2 offsetVector;',

    'varying vec2 vTextureCoord;',
    'varying vec4 vColor;',

    'const vec2 center = vec2(-1.0, 1.0);',

    'void main(void) {',
    '   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);',
    '   vTextureCoord = aTextureCoord;',
    '   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;',
    '   vColor = vec4(color * aColor.x, aColor.x);',
    '}'
];

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * @author Richard Davey http://www.photonstorm.com @photonstorm
 */

/**
* @class PixiFastShader
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.PixiFastShader = function(gl)
{
    this._UID = PIXI._UID++;
    
    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;

    /**
     * @property {any} program - The WebGL program.
     */
    this.program = null;

    /**
     * @property {array} fragmentSrc - The fragment shader.
     */
    this.fragmentSrc = [
        'precision lowp float;',
        'varying vec2 vTextureCoord;',
        'varying float vColor;',
        'uniform sampler2D uSampler;',
        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
        '}'
    ];

    /**
    * @property {array} vertexSrc - The vertex shader
    */
    this.vertexSrc = [
        'attribute vec2 aVertexPosition;',
        'attribute vec2 aPositionCoord;',
        'attribute vec2 aScale;',
        'attribute float aRotation;',
        'attribute vec2 aTextureCoord;',
        'attribute float aColor;',

        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',
        'uniform mat3 uMatrix;',

        'varying vec2 vTextureCoord;',
        'varying float vColor;',

        'const vec2 center = vec2(-1.0, 1.0);',

        'void main(void) {',
        '   vec2 v;',
        '   vec2 sv = aVertexPosition * aScale;',
        '   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);',
        '   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);',
        '   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;',
        '   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;',
      //  '   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;',
        '   vColor = aColor;',
        '}'
    ];


    /**
    * @property {number} textureCount - A local texture counter for multi-texture shaders.
    */
    this.textureCount = 0;

    
    this.init();
};

/**
* Initialises the shader
* @method init
*
*/
PIXI.PixiFastShader.prototype.init = function()
{

    var gl = this.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
    
    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.uSampler = gl.getUniformLocation(program, 'uSampler');

    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.dimensions = gl.getUniformLocation(program, 'dimensions');
    this.uMatrix = gl.getUniformLocation(program, 'uMatrix');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aPositionCoord = gl.getAttribLocation(program, 'aPositionCoord');

    this.aScale = gl.getAttribLocation(program, 'aScale');
    this.aRotation = gl.getAttribLocation(program, 'aRotation');

    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');
   

   
    // Begin worst hack eva //

    // WHY??? ONLY on my chrome pixel the line above returns -1 when using filters?
    // maybe its somthing to do with the current state of the gl context.
    // Im convinced this is a bug in the chrome browser as there is NO reason why this should be returning -1 especially as it only manifests on my chrome pixel
    // If theres any webGL people that know why could happen please help :)
    if(this.colorAttribute === -1)
    {
        this.colorAttribute = 2;
    }

    this.attributes = [this.aVertexPosition, this.aPositionCoord,  this.aScale, this.aRotation, this.aTextureCoord, this.colorAttribute];
    
    // End worst hack eva //


    this.program = program;
};

/**
* Destroys the shader
* @method destroy
*
*/
PIXI.PixiFastShader.prototype.destroy = function()
{
    this.gl.deleteProgram( this.program );
    this.uniforms = null;
    this.gl = null;

    this.attributes = null;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


PIXI.StripShader = function(gl)
{
    this._UID = PIXI._UID++;
    
    this.gl = gl;

    /**
    * @property {any} program - The WebGL program.
    */
    this.program = null;

    /**
     * @property {array} fragmentSrc - The fragment shader.
     */
    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
     //   'varying float vColor;',
        'uniform float alpha;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));',
      //  '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',//gl_FragColor * alpha;',
        '}'
    ];

     /**
    * @property {array} fragmentSrc - The fragment shader.
    */
    this.vertexSrc  = [
        'attribute vec2 aVertexPosition;',
        'attribute vec2 aTextureCoord;',
        'uniform mat3 translationMatrix;',
        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',
      //  'uniform float alpha;',
       // 'uniform vec3 tint;',
        'varying vec2 vTextureCoord;',
      //  'varying vec4 vColor;',

        'void main(void) {',
        '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
        '   v -= offsetVector.xyx;',
        '   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;',
       // '   vColor = aColor * vec4(tint * alpha, alpha);',
        '}'
    ];

    this.init();
};

/**
* Initialises the shader
* @method init
*
*/
PIXI.StripShader.prototype.init = function()
{
    var gl = this.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.uSampler = gl.getUniformLocation(program, 'uSampler');
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');
    //this.dimensions = gl.getUniformLocation(this.program, 'dimensions');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');

    this.attributes = [this.aVertexPosition, this.aTextureCoord];

    this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
    this.alpha = gl.getUniformLocation(program, 'alpha');

    this.program = program;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class PrimitiveShader
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.PrimitiveShader = function(gl)
{
    this._UID = PIXI._UID++;
 
    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;

    /**
    * @property {any} program - The WebGL program.
    */
    this.program = null;

    /**
     * @property fragmentSrc
     * @type Array
     */
    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec4 vColor;',

        'void main(void) {',
        '   gl_FragColor = vColor;',
        '}'
    ];

    /**
     * @property vertexSrc
     * @type Array
     */
    this.vertexSrc  = [
        'attribute vec2 aVertexPosition;',
        'attribute vec4 aColor;',
        'uniform mat3 translationMatrix;',
        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',
        'uniform float alpha;',
        'uniform vec3 tint;',
        'varying vec4 vColor;',

        'void main(void) {',
        '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
        '   v -= offsetVector.xyx;',
        '   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);',
        '   vColor = aColor * vec4(tint * alpha, alpha);',
        '}'
    ];

    this.init();
};

/**
* Initialises the shader
* @method init
*
*/
PIXI.PrimitiveShader.prototype.init = function()
{

    var gl = this.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.tintColor = gl.getUniformLocation(program, 'tint');


    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');

    this.attributes = [this.aVertexPosition, this.colorAttribute];

    this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
    this.alpha = gl.getUniformLocation(program, 'alpha');

    this.program = program;
};

/**
* Destroys the shader
* @method destroy
*
*/
PIXI.PrimitiveShader.prototype.destroy = function()
{
    this.gl.deleteProgram( this.program );
    this.uniforms = null;
    this.gl = null;

    this.attribute = null;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class ComplexPrimitiveShader
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.ComplexPrimitiveShader = function(gl)
{
    this._UID = PIXI._UID++;
    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;

    /**
    * @property {any} program - The WebGL program.
    */
    this.program = null;

    /**
     * @property fragmentSrc
     * @type Array
     */
    this.fragmentSrc = [
        'precision mediump float;',
        


        'varying vec4 vColor;',

        'void main(void) {',
        '   gl_FragColor = vColor;',
        '}'
    ];

    /**
     * @property vertexSrc
     * @type Array
     */
    this.vertexSrc  = [
        'attribute vec2 aVertexPosition;',
        //'attribute vec4 aColor;',
        'uniform mat3 translationMatrix;',
        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',
        
        'uniform vec3 tint;',
        'uniform float alpha;',
        'uniform vec3 color;',

        'varying vec4 vColor;',

        'void main(void) {',
        '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
        '   v -= offsetVector.xyx;',
        '   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);',
        '   vColor = vec4(color * alpha * tint, alpha);',//" * vec4(tint * alpha, alpha);',
        '}'
    ];

    this.init();
};

/**
* Initialises the shader
* @method init
*
*/
PIXI.ComplexPrimitiveShader.prototype.init = function()
{

    var gl = this.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.tintColor = gl.getUniformLocation(program, 'tint');
    this.color = gl.getUniformLocation(program, 'color');


    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
   // this.colorAttribute = gl.getAttribLocation(program, 'aColor');

    this.attributes = [this.aVertexPosition, this.colorAttribute];

    this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
    this.alpha = gl.getUniformLocation(program, 'alpha');

    this.program = program;
};

/**
* Destroys the shader
* @method destroy
*
*/
PIXI.ComplexPrimitiveShader.prototype.destroy = function()
{
    this.gl.deleteProgram( this.program );
    this.uniforms = null;
    this.gl = null;

    this.attribute = null;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A set of functions used by the webGL renderer to draw the primitive graphics data
 *
 * @class WebGLGraphics
 * @private
 * @static
 */
PIXI.WebGLGraphics = function()
{

};

/**
 * Renders the graphics object
 *
 * @static
 * @private
 * @method renderGraphics
 * @param graphics {Graphics}
 * @param renderSession {Object}
 */
PIXI.WebGLGraphics.renderGraphics = function(graphics, renderSession)//projection, offset)
{
    var gl = renderSession.gl;
    var projection = renderSession.projection,
        offset = renderSession.offset,
        shader = renderSession.shaderManager.primitiveShader,
        webGLData;

    if(graphics.dirty)
    {
        PIXI.WebGLGraphics.updateGraphics(graphics, gl);
    }

    var webGL = graphics._webGL[gl.id];

    // This  could be speeded up for sure!

    for (var i = 0; i < webGL.data.length; i++)
    {
        if(webGL.data[i].mode === 1)
        {
            webGLData = webGL.data[i];

            renderSession.stencilManager.pushStencil(graphics, webGLData, renderSession);

            // render quad..
            gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, ( webGLData.indices.length - 4 ) * 2 );
            
            renderSession.stencilManager.popStencil(graphics, webGLData, renderSession);
            
            this.last = webGLData.mode;
        }
        else
        {
            webGLData = webGL.data[i];
           

            renderSession.shaderManager.setShader( shader );//activatePrimitiveShader();
            shader = renderSession.shaderManager.primitiveShader;
            gl.uniformMatrix3fv(shader.translationMatrix, false, graphics.worldTransform.toArray(true));

            gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
            gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);

            gl.uniform3fv(shader.tintColor, PIXI.hex2rgb(graphics.tint));

            gl.uniform1f(shader.alpha, graphics.worldAlpha);
            

            gl.bindBuffer(gl.ARRAY_BUFFER, webGLData.buffer);

            gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 6, 0);
            gl.vertexAttribPointer(shader.colorAttribute, 4, gl.FLOAT, false,4 * 6, 2 * 4);

            // set the index buffer!
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLData.indexBuffer);
            gl.drawElements(gl.TRIANGLE_STRIP,  webGLData.indices.length, gl.UNSIGNED_SHORT, 0 );
        }
    }
};

/**
 * Updates the graphics object
 *
 * @static
 * @private
 * @method updateGraphics
 * @param graphicsData {Graphics} The graphics object to update
 * @param gl {WebGLContext} the current WebGL drawing context
 */
PIXI.WebGLGraphics.updateGraphics = function(graphics, gl)
{
    // get the contexts graphics object
    var webGL = graphics._webGL[gl.id];
    // if the graphics object does not exist in the webGL context time to create it!
    if(!webGL)webGL = graphics._webGL[gl.id] = {lastIndex:0, data:[], gl:gl};

    // flag the graphics as not dirty as we are about to update it...
    graphics.dirty = false;

    var i;

    // if the user cleared the graphics object we will need to clear every object
    if(graphics.clearDirty)
    {
        graphics.clearDirty = false;

        // lop through and return all the webGLDatas to the object pool so than can be reused later on
        for (i = 0; i < webGL.data.length; i++)
        {
            var graphicsData = webGL.data[i];
            graphicsData.reset();
            PIXI.WebGLGraphics.graphicsDataPool.push( graphicsData );
        }

        // clear the array and reset the index.. 
        webGL.data = [];
        webGL.lastIndex = 0;
    }

    
    var webGLData;
    
    // loop through the graphics datas and construct each one..
    // if the object is a complex fill then the new stencil buffer technique will be used
    // other wise graphics objects will be pushed into a batch..
    for (i = webGL.lastIndex; i < graphics.graphicsData.length; i++)
    {
        var data = graphics.graphicsData[i];

        if(data.type === PIXI.Graphics.POLY)
        {
            // MAKE SURE WE HAVE THE CORRECT TYPE..
            if(data.fill)
            {
                if(data.points.length > 6)
                {
                    if(data.points.length > 5 * 2)
                    {
                        webGLData = PIXI.WebGLGraphics.switchMode(webGL, 1);
                        PIXI.WebGLGraphics.buildComplexPoly(data, webGLData);
                    }
                    else
                    {
                        webGLData = PIXI.WebGLGraphics.switchMode(webGL, 0);
                        PIXI.WebGLGraphics.buildPoly(data, webGLData);
                    }
                }
            }

            if(data.lineWidth > 0)
            {
                webGLData = PIXI.WebGLGraphics.switchMode(webGL, 0);
                PIXI.WebGLGraphics.buildLine(data, webGLData);

            }
        }
        else
        {
            webGLData = PIXI.WebGLGraphics.switchMode(webGL, 0);
            
            if(data.type === PIXI.Graphics.RECT)
            {
                PIXI.WebGLGraphics.buildRectangle(data, webGLData);
            }
            else if(data.type === PIXI.Graphics.CIRC || data.type === PIXI.Graphics.ELIP)
            {
                PIXI.WebGLGraphics.buildCircle(data, webGLData);
            }
            else if(data.type === PIXI.Graphics.RREC)
            {
                PIXI.WebGLGraphics.buildRoundedRectangle(data, webGLData);
            }
        }


        webGL.lastIndex++;
    }

    // upload all the dirty data...
    for (i = 0; i < webGL.data.length; i++)
    {
        webGLData = webGL.data[i];
        if(webGLData.dirty)webGLData.upload();
    }
};


PIXI.WebGLGraphics.switchMode = function(webGL, type)
{
    var webGLData;

    if(!webGL.data.length)
    {
        webGLData = PIXI.WebGLGraphics.graphicsDataPool.pop() || new PIXI.WebGLGraphicsData(webGL.gl);
        webGLData.mode = type;
        webGL.data.push(webGLData);
    }
    else
    {
        webGLData = webGL.data[webGL.data.length-1];

        if(webGLData.mode !== type || type === 1)
        {
            webGLData = PIXI.WebGLGraphics.graphicsDataPool.pop() || new PIXI.WebGLGraphicsData(webGL.gl);
            webGLData.mode = type;
            webGL.data.push(webGLData);
        }
    }

    webGLData.dirty = true;

    return webGLData;
};

/**
 * Builds a rectangle to draw
 *
 * @static
 * @private
 * @method buildRectangle
 * @param graphicsData {Graphics} The graphics object containing all the necessary properties
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildRectangle = function(graphicsData, webGLData)
{
    // --- //
    // need to convert points to a nice regular data
    //
    var rectData = graphicsData.points;
    var x = rectData[0];
    var y = rectData[1];
    var width = rectData[2];
    var height = rectData[3];


    if(graphicsData.fill)
    {
        var color = PIXI.hex2rgb(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;

        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var vertPos = verts.length/6;

        // start
        verts.push(x, y);
        verts.push(r, g, b, alpha);

        verts.push(x + width, y);
        verts.push(r, g, b, alpha);

        verts.push(x , y + height);
        verts.push(r, g, b, alpha);

        verts.push(x + width, y + height);
        verts.push(r, g, b, alpha);

        // insert 2 dead triangles..
        indices.push(vertPos, vertPos, vertPos+1, vertPos+2, vertPos+3, vertPos+3);
    }

    if(graphicsData.lineWidth)
    {
        var tempPoints = graphicsData.points;

        graphicsData.points = [x, y,
                  x + width, y,
                  x + width, y + height,
                  x, y + height,
                  x, y];


        PIXI.WebGLGraphics.buildLine(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
};

/**
 * Builds a rounded rectangle to draw
 *
 * @static
 * @private
 * @method buildRoundedRectangle
 * @param graphicsData {Graphics} The graphics object containing all the necessary properties
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildRoundedRectangle = function(graphicsData, webGLData)
{

    var points = graphicsData.points;
    var x = points[0];
    var y = points[1];
    var width = points[2];
    var height = points[3];
    var radius = points[4];


    var recPoints = [];
    recPoints.push(x, y + radius);
    recPoints = recPoints.concat(PIXI.WebGLGraphics.quadraticBezierCurve(x, y + height - radius, x, y + height, x + radius, y + height));
    recPoints = recPoints.concat(PIXI.WebGLGraphics.quadraticBezierCurve(x + width - radius, y + height, x + width, y + height, x + width, y + height - radius));
    recPoints = recPoints.concat(PIXI.WebGLGraphics.quadraticBezierCurve(x + width, y + radius, x + width, y, x + width - radius, y));
    recPoints = recPoints.concat(PIXI.WebGLGraphics.quadraticBezierCurve(x + radius, y, x, y, x, y + radius));


    if (graphicsData.fill) {
        var color = PIXI.hex2rgb(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;

        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var vecPos = verts.length/6;

        var triangles = PIXI.PolyK.Triangulate(recPoints);

        var i = 0;
        for (i = 0; i < triangles.length; i+=3)
        {
            indices.push(triangles[i] + vecPos);
            indices.push(triangles[i] + vecPos);
            indices.push(triangles[i+1] + vecPos);
            indices.push(triangles[i+2] + vecPos);
            indices.push(triangles[i+2] + vecPos);
        }

        for (i = 0; i < recPoints.length; i++)
        {
            verts.push(recPoints[i], recPoints[++i], r, g, b, alpha);
        }
    }

    if (graphicsData.lineWidth) {
        var tempPoints = graphicsData.points;

        graphicsData.points = recPoints;

        PIXI.WebGLGraphics.buildLine(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
};

/**
 * Calcul the points for a quadratic bezier curve. (helper function..)
 * Based on : https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
 *
 * @param  {number}   fromX Origin point x
 * @param  {number}   fromY Origin point x
 * @param  {number}   cpX   Control point x
 * @param  {number}   cpY   Control point y
 * @param  {number}   toX   Destination point x
 * @param  {number}   toY   Destination point y
 * @return {number[]}
 */
PIXI.WebGLGraphics.quadraticBezierCurve = function(fromX, fromY, cpX, cpY, toX, toY) {
    var xa,
        ya,
        xb,
        yb,
        x,
        y,
        n = 20,
        points = [];

    function getPt(n1 , n2, perc) {
        var diff = n2 - n1;

        return n1 + ( diff * perc );
    }

    var j = 0;
    for (var i = 0; i <= n; i++ )
    {
        j = i / n;

        // The Green Line
        xa = getPt( fromX , cpX , j );
        ya = getPt( fromY , cpY , j );
        xb = getPt( cpX , toX , j );
        yb = getPt( cpY , toY , j );

        // The Black Dot
        x = getPt( xa , xb , j );
        y = getPt( ya , yb , j );

        points.push(x, y);
    }
    return points;
};

/**
 * Builds a circle to draw
 *
 * @static
 * @private
 * @method buildCircle
 * @param graphicsData {Graphics} The graphics object to draw
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildCircle = function(graphicsData, webGLData)
{
    
    // need to convert points to a nice regular data
    var rectData = graphicsData.points;
    var x = rectData[0];
    var y = rectData[1];
    var width = rectData[2];
    var height = rectData[3];

    var totalSegs = 40;
    var seg = (Math.PI * 2) / totalSegs ;

    var i = 0;

    if(graphicsData.fill)
    {
        var color = PIXI.hex2rgb(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;

        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var vecPos = verts.length/6;

        indices.push(vecPos);

        for (i = 0; i < totalSegs + 1 ; i++)
        {
            verts.push(x,y, r, g, b, alpha);

            verts.push(x + Math.sin(seg * i) * width,
                       y + Math.cos(seg * i) * height,
                       r, g, b, alpha);

            indices.push(vecPos++, vecPos++);
        }

        indices.push(vecPos-1);
    }

    if(graphicsData.lineWidth)
    {
        var tempPoints = graphicsData.points;

        graphicsData.points = [];

        for (i = 0; i < totalSegs + 1; i++)
        {
            graphicsData.points.push(x + Math.sin(seg * i) * width,
                                     y + Math.cos(seg * i) * height);
        }

        PIXI.WebGLGraphics.buildLine(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
};

/**
 * Builds a line to draw
 *
 * @static
 * @private
 * @method buildLine
 * @param graphicsData {Graphics} The graphics object containing all the necessary properties
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildLine = function(graphicsData, webGLData)
{
    // TODO OPTIMISE!
    var i = 0;

    var points = graphicsData.points;
    if(points.length === 0)return;

    // if the line width is an odd number add 0.5 to align to a whole pixel
    if(graphicsData.lineWidth%2)
    {
        for (i = 0; i < points.length; i++) {
            points[i] += 0.5;
        }
    }

    // get first and last point.. figure out the middle!
    var firstPoint = new PIXI.Point( points[0], points[1] );
    var lastPoint = new PIXI.Point( points[points.length - 2], points[points.length - 1] );

    // if the first point is the last point - gonna have issues :)
    if(firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y)
    {
        // need to clone as we are going to slightly modify the shape..
        points = points.slice();

        points.pop();
        points.pop();

        lastPoint = new PIXI.Point( points[points.length - 2], points[points.length - 1] );

        var midPointX = lastPoint.x + (firstPoint.x - lastPoint.x) *0.5;
        var midPointY = lastPoint.y + (firstPoint.y - lastPoint.y) *0.5;

        points.unshift(midPointX, midPointY);
        points.push(midPointX, midPointY);
    }

    var verts = webGLData.points;
    var indices = webGLData.indices;
    var length = points.length / 2;
    var indexCount = points.length;
    var indexStart = verts.length/6;

    // DRAW the Line
    var width = graphicsData.lineWidth / 2;

    // sort color
    var color = PIXI.hex2rgb(graphicsData.lineColor);
    var alpha = graphicsData.lineAlpha;
    var r = color[0] * alpha;
    var g = color[1] * alpha;
    var b = color[2] * alpha;

    var px, py, p1x, p1y, p2x, p2y, p3x, p3y;
    var perpx, perpy, perp2x, perp2y, perp3x, perp3y;
    var a1, b1, c1, a2, b2, c2;
    var denom, pdist, dist;

    p1x = points[0];
    p1y = points[1];

    p2x = points[2];
    p2y = points[3];

    perpx = -(p1y - p2y);
    perpy =  p1x - p2x;

    dist = Math.sqrt(perpx*perpx + perpy*perpy);

    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;

    // start
    verts.push(p1x - perpx , p1y - perpy,
                r, g, b, alpha);

    verts.push(p1x + perpx , p1y + perpy,
                r, g, b, alpha);

    for (i = 1; i < length-1; i++)
    {
        p1x = points[(i-1)*2];
        p1y = points[(i-1)*2 + 1];

        p2x = points[(i)*2];
        p2y = points[(i)*2 + 1];

        p3x = points[(i+1)*2];
        p3y = points[(i+1)*2 + 1];

        perpx = -(p1y - p2y);
        perpy = p1x - p2x;

        dist = Math.sqrt(perpx*perpx + perpy*perpy);
        perpx /= dist;
        perpy /= dist;
        perpx *= width;
        perpy *= width;

        perp2x = -(p2y - p3y);
        perp2y = p2x - p3x;

        dist = Math.sqrt(perp2x*perp2x + perp2y*perp2y);
        perp2x /= dist;
        perp2y /= dist;
        perp2x *= width;
        perp2y *= width;

        a1 = (-perpy + p1y) - (-perpy + p2y);
        b1 = (-perpx + p2x) - (-perpx + p1x);
        c1 = (-perpx + p1x) * (-perpy + p2y) - (-perpx + p2x) * (-perpy + p1y);
        a2 = (-perp2y + p3y) - (-perp2y + p2y);
        b2 = (-perp2x + p2x) - (-perp2x + p3x);
        c2 = (-perp2x + p3x) * (-perp2y + p2y) - (-perp2x + p2x) * (-perp2y + p3y);

        denom = a1*b2 - a2*b1;

        if(Math.abs(denom) < 0.1 )
        {

            denom+=10.1;
            verts.push(p2x - perpx , p2y - perpy,
                r, g, b, alpha);

            verts.push(p2x + perpx , p2y + perpy,
                r, g, b, alpha);

            continue;
        }

        px = (b1*c2 - b2*c1)/denom;
        py = (a2*c1 - a1*c2)/denom;


        pdist = (px -p2x) * (px -p2x) + (py -p2y) + (py -p2y);


        if(pdist > 140 * 140)
        {
            perp3x = perpx - perp2x;
            perp3y = perpy - perp2y;

            dist = Math.sqrt(perp3x*perp3x + perp3y*perp3y);
            perp3x /= dist;
            perp3y /= dist;
            perp3x *= width;
            perp3y *= width;

            verts.push(p2x - perp3x, p2y -perp3y);
            verts.push(r, g, b, alpha);

            verts.push(p2x + perp3x, p2y +perp3y);
            verts.push(r, g, b, alpha);

            verts.push(p2x - perp3x, p2y -perp3y);
            verts.push(r, g, b, alpha);

            indexCount++;
        }
        else
        {

            verts.push(px , py);
            verts.push(r, g, b, alpha);

            verts.push(p2x - (px-p2x), p2y - (py - p2y));
            verts.push(r, g, b, alpha);
        }
    }

    p1x = points[(length-2)*2];
    p1y = points[(length-2)*2 + 1];

    p2x = points[(length-1)*2];
    p2y = points[(length-1)*2 + 1];

    perpx = -(p1y - p2y);
    perpy = p1x - p2x;

    dist = Math.sqrt(perpx*perpx + perpy*perpy);
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;

    verts.push(p2x - perpx , p2y - perpy);
    verts.push(r, g, b, alpha);

    verts.push(p2x + perpx , p2y + perpy);
    verts.push(r, g, b, alpha);

    indices.push(indexStart);

    for (i = 0; i < indexCount; i++)
    {
        indices.push(indexStart++);
    }

    indices.push(indexStart-1);
};

/**
 * Builds a complex polygon to draw
 *
 * @static
 * @private
 * @method buildPoly
 * @param graphicsData {Graphics} The graphics object containing all the necessary properties
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildComplexPoly = function(graphicsData, webGLData)
{

    //TODO - no need to copy this as it gets turned into a FLoat32Array anyways..
    var points = graphicsData.points.slice();
    if(points.length < 6)return;

    // get first and last point.. figure out the middle!
    var indices = webGLData.indices;
    webGLData.points = points;
    webGLData.alpha = graphicsData.fillAlpha;
    webGLData.color = PIXI.hex2rgb(graphicsData.fillColor);

    /*
        calclate the bounds..
    */
    var minX = Infinity;
    var maxX = -Infinity;

    var minY = Infinity;
    var maxY = -Infinity;

    var x,y;

    // get size..
    for (var i = 0; i < points.length; i+=2)
    {
        x = points[i];
        y = points[i+1];

        minX = x < minX ? x : minX;
        maxX = x > maxX ? x : maxX;

        minY = y < minY ? y : minY;
        maxY = y > maxY ? y : maxY;
    }

    // add a quad to the end cos there is no point making another buffer!
    points.push(minX, minY,
                maxX, minY,
                maxX, maxY,
                minX, maxY);

    // push a quad onto the end.. 
    
    //TODO - this aint needed!
    var length = points.length / 2;
    for (i = 0; i < length; i++)
    {
        indices.push( i );
    }

};

PIXI.WebGLGraphics.buildPoly = function(graphicsData, webGLData)
{
    var points = graphicsData.points;
    if(points.length < 6)return;

    // get first and last point.. figure out the middle!
    var verts = webGLData.points;
    var indices = webGLData.indices;

    var length = points.length / 2;

    // sort color
    var color = PIXI.hex2rgb(graphicsData.fillColor);
    var alpha = graphicsData.fillAlpha;
    var r = color[0] * alpha;
    var g = color[1] * alpha;
    var b = color[2] * alpha;

    var triangles = PIXI.PolyK.Triangulate(points);
    var vertPos = verts.length / 6;

    var i = 0;

    for (i = 0; i < triangles.length; i+=3)
    {
        indices.push(triangles[i] + vertPos);
        indices.push(triangles[i] + vertPos);
        indices.push(triangles[i+1] + vertPos);
        indices.push(triangles[i+2] +vertPos);
        indices.push(triangles[i+2] + vertPos);
    }

    for (i = 0; i < length; i++)
    {
        verts.push(points[i * 2], points[i * 2 + 1],
                   r, g, b, alpha);
    }

};

PIXI.WebGLGraphics.graphicsDataPool = [];

PIXI.WebGLGraphicsData = function(gl)
{
    this.gl = gl;

    //TODO does this need to be split before uploding??
    this.color = [0,0,0]; // color split!
    this.points = [];
    this.indices = [];
    this.lastIndex = 0;
    this.buffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    this.mode = 1;
    this.alpha = 1;
    this.dirty = true;
};

PIXI.WebGLGraphicsData.prototype.reset = function()
{
    this.points = [];
    this.indices = [];
    this.lastIndex = 0;
};

PIXI.WebGLGraphicsData.prototype.upload = function()
{
    var gl = this.gl;

//    this.lastIndex = graphics.graphicsData.length;
    this.glPoints = new Float32Array(this.points);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.glPoints, gl.STATIC_DRAW);

    this.glIndicies = new Uint16Array(this.indices);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.glIndicies, gl.STATIC_DRAW);

    this.dirty = false;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.glContexts = []; // this is where we store the webGL contexts for easy access.

/**
 * the WebGLRenderer draws the stage and all its content onto a webGL enabled canvas. This renderer
 * should be used for browsers that support webGL. This Render works by automatically managing webGLBatch's.
 * So no need for Sprite Batch's or Sprite Cloud's
 * Dont forget to add the view to your DOM or you will not see anything :)
 *
 * @class WebGLRenderer
 * @constructor
 * @param width=0 {Number} the width of the canvas view
 * @param height=0 {Number} the height of the canvas view
 * @param view {HTMLCanvasElement} the canvas to use as a view, optional
 * @param transparent=false {Boolean} If the render view is transparent, default false
 * @param antialias=false {Boolean} sets antialias (only applicable in chrome at the moment)
 * @param preserveDrawingBuffer=false {Boolean} enables drawing buffer preservation, enable this if you need to call toDataUrl on the webgl context
 *
 */
PIXI.WebGLRenderer = function(width, height, view, transparent, antialias, preserveDrawingBuffer)
{
    if(!PIXI.defaultRenderer)
    {
        PIXI.sayHello('webGL');
        PIXI.defaultRenderer = this;
    }

    this.type = PIXI.WEBGL_RENDERER;

    // do a catch.. only 1 webGL renderer..
    /**
     * Whether the render view is transparent
     *
     * @property transparent
     * @type Boolean
     */
    this.transparent = !!transparent;

    /**
     * The value of the preserveDrawingBuffer flag affects whether or not the contents of the stencil buffer is retained after rendering.
     *
     * @property preserveDrawingBuffer
     * @type Boolean
     */
    this.preserveDrawingBuffer = preserveDrawingBuffer;

    /**
     * The width of the canvas view
     *
     * @property width
     * @type Number
     * @default 800
     */
    this.width = width || 800;

    /**
     * The height of the canvas view
     *
     * @property height
     * @type Number
     * @default 600
     */
    this.height = height || 600;

    /**
     * The canvas element that everything is drawn to
     *
     * @property view
     * @type HTMLCanvasElement
     */
    this.view = view || document.createElement( 'canvas' );
    this.view.width = this.width;
    this.view.height = this.height;

    // deal with losing context..
    this.contextLost = this.handleContextLost.bind(this);
    this.contextRestoredLost = this.handleContextRestored.bind(this);
    
    this.view.addEventListener('webglcontextlost', this.contextLost, false);
    this.view.addEventListener('webglcontextrestored', this.contextRestoredLost, false);

    this.options = {
        alpha: this.transparent,
        antialias:!!antialias, // SPEED UP??
        premultipliedAlpha:!!transparent,
        stencil:true,
        preserveDrawingBuffer: preserveDrawingBuffer
    };

    var gl = null;

    ['experimental-webgl', 'webgl'].forEach(function(name) {
        try {
            gl = gl || this.view.getContext(name,  this.options);
        } catch(e) {}
    }, this);

    if (!gl) {
        // fail, not able to get a context
        throw new Error('This browser does not support webGL. Try using the canvas renderer' + this);
    }

    this.gl = gl;
    this.glContextId = gl.id = PIXI.WebGLRenderer.glContextId ++;

    PIXI.glContexts[this.glContextId] = gl;

    if(!PIXI.blendModesWebGL)
    {
        PIXI.blendModesWebGL = [];

        PIXI.blendModesWebGL[PIXI.blendModes.NORMAL]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.ADD]           = [gl.SRC_ALPHA, gl.DST_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.MULTIPLY]      = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.SCREEN]        = [gl.SRC_ALPHA, gl.ONE];
        PIXI.blendModesWebGL[PIXI.blendModes.OVERLAY]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.DARKEN]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.LIGHTEN]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.COLOR_DODGE]   = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.COLOR_BURN]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.HARD_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.SOFT_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.DIFFERENCE]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.EXCLUSION]     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.HUE]           = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.SATURATION]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.COLOR]         = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.LUMINOSITY]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
    }




    this.projection = new PIXI.Point();
    this.projection.x =  this.width/2;
    this.projection.y =  -this.height/2;

    this.offset = new PIXI.Point(0, 0);

    this.resize(this.width, this.height);
    this.contextLost = false;

    // time to create the render managers! each one focuses on managine a state in webGL
    this.shaderManager = new PIXI.WebGLShaderManager(gl);                   // deals with managing the shader programs and their attribs
    this.spriteBatch = new PIXI.WebGLSpriteBatch(gl);                       // manages the rendering of sprites
    //this.primitiveBatch = new PIXI.WebGLPrimitiveBatch(gl);               // primitive batch renderer
    this.maskManager = new PIXI.WebGLMaskManager(gl);                       // manages the masks using the stencil buffer
    this.filterManager = new PIXI.WebGLFilterManager(gl, this.transparent); // manages the filters
    this.stencilManager = new PIXI.WebGLStencilManager(gl);
    this.blendModeManager = new PIXI.WebGLBlendModeManager(gl);

    this.renderSession = {};
    this.renderSession.gl = this.gl;
    this.renderSession.drawCount = 0;
    this.renderSession.shaderManager = this.shaderManager;
    this.renderSession.maskManager = this.maskManager;
    this.renderSession.filterManager = this.filterManager;
    this.renderSession.blendModeManager = this.blendModeManager;
   // this.renderSession.primitiveBatch = this.primitiveBatch;
    this.renderSession.spriteBatch = this.spriteBatch;
    this.renderSession.stencilManager = this.stencilManager;
    this.renderSession.renderer = this;

    gl.useProgram(this.shaderManager.defaultShader.program);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    gl.enable(gl.BLEND);
    gl.colorMask(true, true, true, this.transparent);
};

// constructor
PIXI.WebGLRenderer.prototype.constructor = PIXI.WebGLRenderer;

/**
 * Renders the stage to its webGL view
 *
 * @method render
 * @param stage {Stage} the Stage element to be rendered
 */
PIXI.WebGLRenderer.prototype.render = function(stage)
{
    if(this.contextLost)return;


    // if rendering a new stage clear the batches..
    if(this.__stage !== stage)
    {
        if(stage.interactive)stage.interactionManager.removeEvents();

        // TODO make this work
        // dont think this is needed any more?
        this.__stage = stage;
    }

    // update any textures this includes uvs and uploading them to the gpu
    PIXI.WebGLRenderer.updateTextures();

    // update the scene graph
    stage.updateTransform();


    // interaction
    if(stage._interactive)
    {
        //need to add some events!
        if(!stage._interactiveEventsAdded)
        {
            stage._interactiveEventsAdded = true;
            stage.interactionManager.setTarget(this);
        }
    }
    
    var gl = this.gl;

    // -- Does this need to be set every frame? -- //
    //gl.colorMask(true, true, true, this.transparent);
    gl.viewport(0, 0, this.width, this.height);

    // make sure we are bound to the main frame buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    if(this.transparent)
    {
        gl.clearColor(0, 0, 0, 0);
    }
    else
    {
        gl.clearColor(stage.backgroundColorSplit[0],stage.backgroundColorSplit[1],stage.backgroundColorSplit[2], 1);
    }


    gl.clear(gl.COLOR_BUFFER_BIT);

    this.renderDisplayObject( stage, this.projection );

    // interaction
    if(stage.interactive)
    {
        //need to add some events!
        if(!stage._interactiveEventsAdded)
        {
            stage._interactiveEventsAdded = true;
            stage.interactionManager.setTarget(this);
        }
    }
    else
    {
        if(stage._interactiveEventsAdded)
        {
            stage._interactiveEventsAdded = false;
            stage.interactionManager.setTarget(this);
        }
    }

    /*
    //can simulate context loss in Chrome like so:
     this.view.onmousedown = function(ev) {
     console.dir(this.gl.getSupportedExtensions());
        var ext = (
            gl.getExtension("WEBGL_scompressed_texture_s3tc")
       // gl.getExtension("WEBGL_compressed_texture_s3tc") ||
       // gl.getExtension("MOZ_WEBGL_compressed_texture_s3tc") ||
       // gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc")
     );
     console.dir(ext);
     var loseCtx = this.gl.getExtension("WEBGL_lose_context");
      console.log("killing context");
      loseCtx.loseContext();
     setTimeout(function() {
          console.log("restoring context...");
          loseCtx.restoreContext();
      }.bind(this), 1000);
     }.bind(this);
     */
};

/**
 * Renders a display Object
 *
 * @method renderDIsplayObject
 * @param displayObject {DisplayObject} The DisplayObject to render
 * @param projection {Point} The projection
 * @param buffer {Array} a standard WebGL buffer 
 */
PIXI.WebGLRenderer.prototype.renderDisplayObject = function(displayObject, projection, buffer)
{
    this.renderSession.blendModeManager.setBlendMode(PIXI.blendModes.NORMAL);
    // reset the render session data..
    this.renderSession.drawCount = 0;
    this.renderSession.currentBlendMode = 9999;

    this.renderSession.projection = projection;
    this.renderSession.offset = this.offset;

    // start the sprite batch
    this.spriteBatch.begin(this.renderSession);

//    this.primitiveBatch.begin(this.renderSession);

    // start the filter manager
    this.filterManager.begin(this.renderSession, buffer);

    // render the scene!
    displayObject._renderWebGL(this.renderSession);

    // finish the sprite batch
    this.spriteBatch.end();

//    this.primitiveBatch.end();
};

/**
 * Updates the textures loaded into this webgl renderer
 *
 * @static
 * @method updateTextures
 * @private
 */
PIXI.WebGLRenderer.updateTextures = function()
{
    var i = 0;

    //TODO break this out into a texture manager...
  //  for (i = 0; i < PIXI.texturesToUpdate.length; i++)
  //      PIXI..updateWebGLTexture(PIXI.texturesToUpdate[i], this.gl);


    for (i=0; i < PIXI.Texture.frameUpdates.length; i++)
        PIXI.WebGLRenderer.updateTextureFrame(PIXI.Texture.frameUpdates[i]);

    for (i = 0; i < PIXI.texturesToDestroy.length; i++)
        PIXI.WebGLRenderer.destroyTexture(PIXI.texturesToDestroy[i]);

    PIXI.texturesToUpdate.length = 0;
    PIXI.texturesToDestroy.length = 0;
    PIXI.Texture.frameUpdates.length = 0;
};

/**
 * Destroys a loaded webgl texture
 *
 * @method destroyTexture
 * @param texture {Texture} The texture to update
 * @private
 */
PIXI.WebGLRenderer.destroyTexture = function(texture)
{
    //TODO break this out into a texture manager...

    for (var i = texture._glTextures.length - 1; i >= 0; i--)
    {
        var glTexture = texture._glTextures[i];
        var gl = PIXI.glContexts[i];

        if(gl && glTexture)
        {
            gl.deleteTexture(glTexture);
        }
    }

    texture._glTextures.length = 0;
};

/**
 *
 * @method updateTextureFrame
 * @param texture {Texture} The texture to update the frame from
 * @private
 */
PIXI.WebGLRenderer.updateTextureFrame = function(texture)
{
    //texture.updateFrame = false;

    // now set the uvs. Figured that the uv data sits with a texture rather than a sprite.
    // so uv data is stored on the texture itself
    texture._updateWebGLuvs();
};

/**
 * resizes the webGL view to the specified width and height
 *
 * @method resize
 * @param width {Number} the new width of the webGL view
 * @param height {Number} the new height of the webGL view
 */
PIXI.WebGLRenderer.prototype.resize = function(width, height)
{
    this.width = width;
    this.height = height;

    this.view.width = width;
    this.view.height = height;

    this.gl.viewport(0, 0, this.width, this.height);

    this.projection.x =  this.width/2;
    this.projection.y =  -this.height/2;
};

/**
 * Creates a WebGL texture
 *
 * @method createWebGLTexture
 * @param texture {Texture} the texture to render
 * @param gl {webglContext} the WebGL context
 * @static
 */
PIXI.createWebGLTexture = function(texture, gl)
{


    if(texture.hasLoaded)
    {
        texture._glTextures[gl.id] = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultipliedAlpha);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);

        // reguler...

        if(!texture._powerOf2)
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);

        texture._dirty[gl.id] = false;
    }

    return  texture._glTextures[gl.id];
};

/**
 * Updates a WebGL texture
 *
 * @method updateWebGLTexture
 * @param texture {Texture} the texture to update
 * @param gl {webglContext} the WebGL context
 * @private
 */
PIXI.updateWebGLTexture = function(texture, gl)
{
    if( texture._glTextures[gl.id] )
    {
        gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultipliedAlpha);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);

        // reguler...

        if(!texture._powerOf2)
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }

        texture._dirty[gl.id] = false;
    }
    
};

/**
 * Handles a lost webgl context
 *
 * @method handleContextLost
 * @param event {Event}
 * @private
 */
PIXI.WebGLRenderer.prototype.handleContextLost = function(event)
{
    event.preventDefault();
    this.contextLost = true;
};

/**
 * Handles a restored webgl context
 *
 * @method handleContextRestored
 * @param event {Event}
 * @private
 */
PIXI.WebGLRenderer.prototype.handleContextRestored = function()
{

    //try 'experimental-webgl'
    try {
        this.gl = this.view.getContext('experimental-webgl',  this.options);
    } catch (e) {
        //try 'webgl'
        try {
            this.gl = this.view.getContext('webgl',  this.options);
        } catch (e2) {
            // fail, not able to get a context
            throw new Error(' This browser does not support webGL. Try using the canvas renderer' + this);
        }
    }

    var gl = this.gl;
    gl.id = PIXI.WebGLRenderer.glContextId ++;



    // need to set the context...
    this.shaderManager.setContext(gl);
    this.spriteBatch.setContext(gl);
    this.primitiveBatch.setContext(gl);
    this.maskManager.setContext(gl);
    this.filterManager.setContext(gl);


    this.renderSession.gl = this.gl;

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    gl.enable(gl.BLEND);
    gl.colorMask(true, true, true, this.transparent);

    this.gl.viewport(0, 0, this.width, this.height);

    for(var key in PIXI.TextureCache)
    {
        var texture = PIXI.TextureCache[key].baseTexture;
        texture._glTextures = [];
    }

    /**
     * Whether the context was lost 
     * @property contextLost
     * @type Boolean
     */
    this.contextLost = false;

};

/**
 * Removes everything from the renderer (event listeners, spritebatch, etc...)
 *
 * @method destroy
 */
PIXI.WebGLRenderer.prototype.destroy = function()
{

    // deal with losing context..
    
    // remove listeners
    this.view.removeEventListener('webglcontextlost', this.contextLost);
    this.view.removeEventListener('webglcontextrestored', this.contextRestoredLost);

    PIXI.glContexts[this.glContextId] = null;

    this.projection = null;
    this.offset = null;

    // time to create the render managers! each one focuses on managine a state in webGL
    this.shaderManager.destroy();
    this.spriteBatch.destroy();
    this.primitiveBatch.destroy();
    this.maskManager.destroy();
    this.filterManager.destroy();

    this.shaderManager = null;
    this.spriteBatch = null;
    this.maskManager = null;
    this.filterManager = null;
    
    this.gl = null;
    //
    this.renderSession = null;
};


PIXI.WebGLRenderer.glContextId = 0;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class WebGLMaskManager
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
* @private
*/
PIXI.WebGLBlendModeManager = function(gl)
{
    this.gl = gl;
    this.currentBlendMode = 99999;
};

/**
* Sets-up the given blendMode from WebGL's point of view
* @method setBlendMode 
*
* @param blendMode {Number} the blendMode, should be a Pixi const, such as PIXI.BlendModes.ADD
*/
PIXI.WebGLBlendModeManager.prototype.setBlendMode = function(blendMode)
{
    if(this.currentBlendMode === blendMode)return false;
 //   console.log("SWAP!")
    this.currentBlendMode = blendMode;
    
    var blendModeWebGL = PIXI.blendModesWebGL[this.currentBlendMode];
    this.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
    
    return true;
};

PIXI.WebGLBlendModeManager.prototype.destroy = function()
{
    this.gl = null;
};
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class WebGLMaskManager
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
* @private
*/
PIXI.WebGLMaskManager = function(gl)
{
    this.maskStack = [];
    this.maskPosition = 0;

    this.setContext(gl);

    this.reverse = false;
    this.count = 0;
};

/**
* Sets the drawing context to the one given in parameter
* @method setContext 
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.WebGLMaskManager.prototype.setContext = function(gl)
{
    this.gl = gl;
};

/**
* Applies the Mask and adds it to the current filter stack
* @method pushMask
* @param maskData {Array}
* @param renderSession {RenderSession}
*/
PIXI.WebGLMaskManager.prototype.pushMask = function(maskData, renderSession)
{
    var gl = renderSession.gl;

    if(maskData.dirty)
    {
        PIXI.WebGLGraphics.updateGraphics(maskData, gl);
    }

    if(!maskData._webGL[gl.id].data.length)return;

    renderSession.stencilManager.pushStencil(maskData, maskData._webGL[gl.id].data[0], renderSession);
};

/**
* Removes the last filter from the filter stack and doesn't return it
* @method popMask
*
* @param renderSession {RenderSession} an object containing all the useful parameters
*/
PIXI.WebGLMaskManager.prototype.popMask = function(maskData, renderSession)
{
    var gl = this.gl;
    renderSession.stencilManager.popStencil(maskData, maskData._webGL[gl.id].data[0], renderSession);
};


/**
* Destroys the mask stack
* @method destroy
*/
PIXI.WebGLMaskManager.prototype.destroy = function()
{
    this.maskStack = null;
    this.gl = null;
};
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */
 
//BA0285
//Intercontinental Hotel, 888 Howard Street
//San Francisco

/**
* @class WebGLStencilManager
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
* @private
*/
PIXI.WebGLStencilManager = function(gl)
{
   
    this.stencilStack = [];
    this.setContext(gl);
    this.reverse = true;
    this.count = 0;

};

/**
* Sets the drawing context to the one given in parameter
* @method setContext 
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.WebGLStencilManager.prototype.setContext = function(gl)
{
    this.gl = gl;
};

/**
* Applies the Mask and adds it to the current filter stack
* @method pushMask
* @param maskData {Array}
* @param renderSession {RenderSession}
*/
PIXI.WebGLStencilManager.prototype.pushStencil = function(graphics, webGLData, renderSession)
{
    var gl = this.gl;
    this.bindGraphics(graphics, webGLData, renderSession);

    if(this.stencilStack.length === 0)
    {
        gl.enable(gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        this.reverse = true;
        this.count = 0;
    }

    this.stencilStack.push(webGLData);

    var level = this.count;

    gl.colorMask(false, false, false, false);

    gl.stencilFunc(gl.ALWAYS,0,0xFF);
    gl.stencilOp(gl.KEEP,gl.KEEP,gl.INVERT);

    // draw the triangle strip!

    if(webGLData.mode === 1)
    {

        gl.drawElements(gl.TRIANGLE_FAN,  webGLData.indices.length - 4, gl.UNSIGNED_SHORT, 0 );
       
        if(this.reverse)
        {
            gl.stencilFunc(gl.EQUAL, 0xFF - level, 0xFF);
            gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);
        }
        else
        {
            gl.stencilFunc(gl.EQUAL,level, 0xFF);
            gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);
        }

        // draw a quad to increment..
        gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, ( webGLData.indices.length - 4 ) * 2 );
               
        if(this.reverse)
        {
            gl.stencilFunc(gl.EQUAL,0xFF-(level+1), 0xFF);
        }
        else
        {
            gl.stencilFunc(gl.EQUAL,level+1, 0xFF);
        }

        this.reverse = !this.reverse;
    }
    else
    {
        if(!this.reverse)
        {
            gl.stencilFunc(gl.EQUAL, 0xFF - level, 0xFF);
            gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);
        }
        else
        {
            gl.stencilFunc(gl.EQUAL,level, 0xFF);
            gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);
        }

        gl.drawElements(gl.TRIANGLE_STRIP,  webGLData.indices.length, gl.UNSIGNED_SHORT, 0 );

        if(!this.reverse)
        {
            gl.stencilFunc(gl.EQUAL,0xFF-(level+1), 0xFF);
        }
        else
        {
            gl.stencilFunc(gl.EQUAL,level+1, 0xFF);
        }
    }

    gl.colorMask(true, true, true, true);
    gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);

    this.count++;
};

//TODO this does not belong here!
PIXI.WebGLStencilManager.prototype.bindGraphics = function(graphics, webGLData, renderSession)
{
    //if(this._currentGraphics === graphics)return;
    this._currentGraphics = graphics;

    var gl = this.gl;

     // bind the graphics object..
    var projection = renderSession.projection,
        offset = renderSession.offset,
        shader;// = renderSession.shaderManager.primitiveShader;

    if(webGLData.mode === 1)
    {
        shader = renderSession.shaderManager.complexPrimativeShader;

        renderSession.shaderManager.setShader( shader );

        gl.uniformMatrix3fv(shader.translationMatrix, false, graphics.worldTransform.toArray(true));

        gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
        gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);

        gl.uniform3fv(shader.tintColor, PIXI.hex2rgb(graphics.tint));
        gl.uniform3fv(shader.color, webGLData.color);

        gl.uniform1f(shader.alpha, graphics.worldAlpha * webGLData.alpha);

        gl.bindBuffer(gl.ARRAY_BUFFER, webGLData.buffer);

        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 2, 0);


        // now do the rest..
        // set the index buffer!
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLData.indexBuffer);
    }
    else
    {
        //renderSession.shaderManager.activatePrimitiveShader();
        shader = renderSession.shaderManager.primitiveShader;
        renderSession.shaderManager.setShader( shader );

        gl.uniformMatrix3fv(shader.translationMatrix, false, graphics.worldTransform.toArray(true));

        gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
        gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);

        gl.uniform3fv(shader.tintColor, PIXI.hex2rgb(graphics.tint));

        gl.uniform1f(shader.alpha, graphics.worldAlpha);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, webGLData.buffer);

        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 6, 0);
        gl.vertexAttribPointer(shader.colorAttribute, 4, gl.FLOAT, false,4 * 6, 2 * 4);

        // set the index buffer!
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLData.indexBuffer);
    }
};

PIXI.WebGLStencilManager.prototype.popStencil = function(graphics, webGLData, renderSession)
{
	var gl = this.gl;
    this.stencilStack.pop();
   
    this.count--;

    if(this.stencilStack.length === 0)
    {
        // the stack is empty!
        gl.disable(gl.STENCIL_TEST);

    }
    else
    {

        var level = this.count;

        this.bindGraphics(graphics, webGLData, renderSession);

        gl.colorMask(false, false, false, false);
    
        if(webGLData.mode === 1)
        {
            this.reverse = !this.reverse;

            if(this.reverse)
            {
                gl.stencilFunc(gl.EQUAL, 0xFF - (level+1), 0xFF);
                gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level+1, 0xFF);
                gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);
            }

            // draw a quad to increment..
            gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, ( webGLData.indices.length - 4 ) * 2 );
            
            gl.stencilFunc(gl.ALWAYS,0,0xFF);
            gl.stencilOp(gl.KEEP,gl.KEEP,gl.INVERT);

            // draw the triangle strip!
            gl.drawElements(gl.TRIANGLE_FAN,  webGLData.indices.length - 4, gl.UNSIGNED_SHORT, 0 );
           
            if(!this.reverse)
            {
                gl.stencilFunc(gl.EQUAL,0xFF-(level), 0xFF);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level, 0xFF);
            }

        }
        else
        {
          //  console.log("<<>>")
            if(!this.reverse)
            {
                gl.stencilFunc(gl.EQUAL, 0xFF - (level+1), 0xFF);
                gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level+1, 0xFF);
                gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);
            }

            gl.drawElements(gl.TRIANGLE_STRIP,  webGLData.indices.length, gl.UNSIGNED_SHORT, 0 );

            if(!this.reverse)
            {
                gl.stencilFunc(gl.EQUAL,0xFF-(level), 0xFF);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level, 0xFF);
            }
        }

        gl.colorMask(true, true, true, true);
        gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);


    }

    //renderSession.shaderManager.deactivatePrimitiveShader();
};

/**
* Destroys the mask stack
* @method destroy
*/
PIXI.WebGLStencilManager.prototype.destroy = function()
{
    this.maskStack = null;
    this.gl = null;
};
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class WebGLShaderManager
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
* @private
*/
PIXI.WebGLShaderManager = function(gl)
{

    this.maxAttibs = 10;
    this.attribState = [];
    this.tempAttribState = [];
    this.shaderMap = [];

    for (var i = 0; i < this.maxAttibs; i++) {
        this.attribState[i] = false;
    }

    this.setContext(gl);
    // the final one is used for the rendering strips
};


/**
* Initialises the context and the properties
* @method setContext 
* @param gl {WebGLContext} the current WebGL drawing context
* @param transparent {Boolean} Whether or not the drawing context should be transparent
*/
PIXI.WebGLShaderManager.prototype.setContext = function(gl)
{
    this.gl = gl;
    
    // the next one is used for rendering primatives
    this.primitiveShader = new PIXI.PrimitiveShader(gl);

    // the next one is used for rendering triangle strips
    this.complexPrimativeShader = new PIXI.ComplexPrimitiveShader(gl);

    // this shader is used for the default sprite rendering
    this.defaultShader = new PIXI.PixiShader(gl);

    // this shader is used for the fast sprite rendering
    this.fastShader = new PIXI.PixiFastShader(gl);

    // the next one is used for rendering triangle strips
    this.stripShader = new PIXI.StripShader(gl);
    this.setShader(this.defaultShader);
};


/**
* Takes the attributes given in parameters 
* @method setAttribs
* @param attribs {Array} attribs 
*/
PIXI.WebGLShaderManager.prototype.setAttribs = function(attribs)
{
    // reset temp state

    var i;

    for (i = 0; i < this.tempAttribState.length; i++)
    {
        this.tempAttribState[i] = false;
    }

    // set the new attribs
    for (i = 0; i < attribs.length; i++)
    {
        var attribId = attribs[i];
        this.tempAttribState[attribId] = true;
    }

    var gl = this.gl;

    for (i = 0; i < this.attribState.length; i++)
    {
        if(this.attribState[i] !== this.tempAttribState[i])
        {
            this.attribState[i] = this.tempAttribState[i];

            if(this.tempAttribState[i])
            {
                gl.enableVertexAttribArray(i);
            }
            else
            {
                gl.disableVertexAttribArray(i);
            }
        }
    }
};

PIXI.WebGLShaderManager.prototype.setShader = function(shader)
{
    if(this._currentId === shader._UID)return false;
    
    this._currentId = shader._UID;

    this.currentShader = shader;

    this.gl.useProgram(shader.program);
    this.setAttribs(shader.attributes);

    return true;
};

/**
* Destroys
* @method destroy
*/
PIXI.WebGLShaderManager.prototype.destroy = function()
{
    this.attribState = null;

    this.tempAttribState = null;

    this.primitiveShader.destroy();

    this.defaultShader.destroy();

    this.fastShader.destroy();

    this.stripShader.destroy();

    this.gl = null;
};


/**
 * @author Mat Groves
 * 
 * Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/
 * for creating the original pixi version!
 *
 * Heavily inspired by LibGDX's WebGLSpriteBatch:
 * https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/WebGLSpriteBatch.java
 */

 /**
 *
 * @class WebGLSpriteBatch
 * @private
 * @constructor
 * @param gl {WebGLContext} the current WebGL drawing context
 *
 */
PIXI.WebGLSpriteBatch = function(gl)
{

    /**
     * 
     *
     * @property vertSize
     * @type Number
     */
    this.vertSize = 6;

    /**
     * The number of images in the SpriteBatch before it flushes
     * @property size
     * @type Number
     */
    this.size = 2000;//Math.pow(2, 16) /  this.vertSize;

    //the total number of floats in our batch
    var numVerts = this.size * 4 *  this.vertSize;
    //the total number of indices in our batch
    var numIndices = this.size * 6;

    //vertex data

    /**
    * Holds the vertices
    *
    * @property vertices
    * @type Float32Array
    */
    this.vertices = new Float32Array(numVerts);

    //index data
    /**
     * Holds the indices
     *
     * @property indices
     * @type Uint16Array
     */
    this.indices = new Uint16Array(numIndices);
    
    this.lastIndexCount = 0;

    for (var i=0, j=0; i < numIndices; i += 6, j += 4)
    {
        this.indices[i + 0] = j + 0;
        this.indices[i + 1] = j + 1;
        this.indices[i + 2] = j + 2;
        this.indices[i + 3] = j + 0;
        this.indices[i + 4] = j + 2;
        this.indices[i + 5] = j + 3;
    }


    this.drawing = false;
    this.currentBatchSize = 0;
    this.currentBaseTexture = null;
    
    this.setContext(gl);

    this.dirty = true;

    this.textures = [];
    this.blendModes = [];
};

/**
* 
* @method setContext
*
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.WebGLSpriteBatch.prototype.setContext = function(gl)
{
    this.gl = gl;

    // create a couple of buffers
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();

    // 65535 is max index, so 65535 / 6 = 10922.


    //upload the index data
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    this.currentBlendMode = 99999;
};

/**
* 
* @method begin
*
* @param renderSession {RenderSession} the RenderSession
*/
PIXI.WebGLSpriteBatch.prototype.begin = function(renderSession)
{
    this.renderSession = renderSession;
    this.shader = this.renderSession.shaderManager.defaultShader;

    this.start();
};

/**
* 
* @method end
*
*/
PIXI.WebGLSpriteBatch.prototype.end = function()
{
    this.flush();
};

/**
* 
* @method render
* 
* @param sprite {Sprite} the sprite to render when using this spritebatch
*/
PIXI.WebGLSpriteBatch.prototype.render = function(sprite)
{
    var texture = sprite.texture;
    
   //TODO set blend modes.. 
    // check texture..
    if(this.currentBatchSize >= this.size)
    {
        //return;
        this.flush();
        this.currentBaseTexture = texture.baseTexture;
    }

    // get the uvs for the texture
    var uvs = texture._uvs;
    // if the uvs have not updated then no point rendering just yet!
    if(!uvs)return;

    // get the sprites current alpha
    var alpha = sprite.worldAlpha;
    var tint = sprite.tint;

    var verticies = this.vertices;


    // TODO trim??
    var aX = sprite.anchor.x;
    var aY = sprite.anchor.y;

    var w0, w1, h0, h1;
        
    if (texture.trim)
    {
        // if the sprite is trimmed then we need to add the extra space before transforming the sprite coords..
        var trim = texture.trim;

        w1 = trim.x - aX * trim.width;
        w0 = w1 + texture.crop.width;

        h1 = trim.y - aY * trim.height;
        h0 = h1 + texture.crop.height;

    }
    else
    {
        w0 = (texture.frame.width ) * (1-aX);
        w1 = (texture.frame.width ) * -aX;

        h0 = texture.frame.height * (1-aY);
        h1 = texture.frame.height * -aY;
    }

    var index = this.currentBatchSize * 4 * this.vertSize;

    var worldTransform = sprite.worldTransform;

    var a = worldTransform.a;//[0];
    var b = worldTransform.c;//[3];
    var c = worldTransform.b;//[1];
    var d = worldTransform.d;//[4];
    var tx = worldTransform.tx;//[2];
    var ty = worldTransform.ty;///[5];

    // xy
    verticies[index++] = a * w1 + c * h1 + tx;
    verticies[index++] = d * h1 + b * w1 + ty;
    // uv
    verticies[index++] = uvs.x0;
    verticies[index++] = uvs.y0;
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;

    // xy
    verticies[index++] = a * w0 + c * h1 + tx;
    verticies[index++] = d * h1 + b * w0 + ty;
    // uv
    verticies[index++] = uvs.x1;
    verticies[index++] = uvs.y1;
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;

    // xy
    verticies[index++] = a * w0 + c * h0 + tx;
    verticies[index++] = d * h0 + b * w0 + ty;
    // uv
    verticies[index++] = uvs.x2;
    verticies[index++] = uvs.y2;
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;

    // xy
    verticies[index++] = a * w1 + c * h0 + tx;
    verticies[index++] = d * h0 + b * w1 + ty;
    // uv
    verticies[index++] = uvs.x3;
    verticies[index++] = uvs.y3;
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;
    
    // increment the batchsize
    this.textures[this.currentBatchSize] = sprite.texture.baseTexture;
    this.blendModes[this.currentBatchSize] = sprite.blendMode;

    this.currentBatchSize++;

};

/**
* Renders a tilingSprite using the spriteBatch
* @method renderTilingSprite
* 
* @param sprite {TilingSprite} the tilingSprite to render
*/
PIXI.WebGLSpriteBatch.prototype.renderTilingSprite = function(tilingSprite)
{
    var texture = tilingSprite.tilingTexture;

    
    // check texture..
    if(this.currentBatchSize >= this.size)
    {
        //return;
        this.flush();
        this.currentBaseTexture = texture.baseTexture;
    }

     // set the textures uvs temporarily
    // TODO create a separate texture so that we can tile part of a texture

    if(!tilingSprite._uvs)tilingSprite._uvs = new PIXI.TextureUvs();

    var uvs = tilingSprite._uvs;

    tilingSprite.tilePosition.x %= texture.baseTexture.width * tilingSprite.tileScaleOffset.x;
    tilingSprite.tilePosition.y %= texture.baseTexture.height * tilingSprite.tileScaleOffset.y;

    var offsetX =  tilingSprite.tilePosition.x/(texture.baseTexture.width*tilingSprite.tileScaleOffset.x);
    var offsetY =  tilingSprite.tilePosition.y/(texture.baseTexture.height*tilingSprite.tileScaleOffset.y);

    var scaleX =  (tilingSprite.width / texture.baseTexture.width)  / (tilingSprite.tileScale.x * tilingSprite.tileScaleOffset.x);
    var scaleY =  (tilingSprite.height / texture.baseTexture.height) / (tilingSprite.tileScale.y * tilingSprite.tileScaleOffset.y);

    uvs.x0 = 0 - offsetX;
    uvs.y0 = 0 - offsetY;

    uvs.x1 = (1 * scaleX) - offsetX;
    uvs.y1 = 0 - offsetY;

    uvs.x2 = (1 * scaleX) - offsetX;
    uvs.y2 = (1 * scaleY) - offsetY;

    uvs.x3 = 0 - offsetX;
    uvs.y3 = (1 *scaleY) - offsetY;

    // get the tilingSprites current alpha
    var alpha = tilingSprite.worldAlpha;
    var tint = tilingSprite.tint;

    var  verticies = this.vertices;

    var width = tilingSprite.width;
    var height = tilingSprite.height;

    // TODO trim??
    var aX = tilingSprite.anchor.x;
    var aY = tilingSprite.anchor.y;
    var w0 = width * (1-aX);
    var w1 = width * -aX;

    var h0 = height * (1-aY);
    var h1 = height * -aY;

    var index = this.currentBatchSize * 4 * this.vertSize;

    var worldTransform = tilingSprite.worldTransform;

    var a = worldTransform.a;//[0];
    var b = worldTransform.c;//[3];
    var c = worldTransform.b;//[1];
    var d = worldTransform.d;//[4];
    var tx = worldTransform.tx;//[2];
    var ty = worldTransform.ty;///[5];

    // xy
    verticies[index++] = a * w1 + c * h1 + tx;
    verticies[index++] = d * h1 + b * w1 + ty;
    // uv
    verticies[index++] = uvs.x0;
    verticies[index++] = uvs.y0;
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;

    // xy
    verticies[index++] = (a * w0 + c * h1 + tx);
    verticies[index++] = d * h1 + b * w0 + ty;
    // uv
    verticies[index++] = uvs.x1;
    verticies[index++] = uvs.y1;
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;
    
    // xy
    verticies[index++] = a * w0 + c * h0 + tx;
    verticies[index++] = d * h0 + b * w0 + ty;
    // uv
    verticies[index++] = uvs.x2;
    verticies[index++] = uvs.y2;
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;

    // xy
    verticies[index++] = a * w1 + c * h0 + tx;
    verticies[index++] = d * h0 + b * w1 + ty;
    // uv
    verticies[index++] = uvs.x3;
    verticies[index++] = uvs.y3;
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;

    // increment the batchs
    this.textures[this.currentBatchSize] = texture.baseTexture;
    this.blendModes[this.currentBatchSize] = tilingSprite.blendMode;
    this.currentBatchSize++;
};


/**
* Renders the content and empties the current batch
*
* @method flush
* 
*/
PIXI.WebGLSpriteBatch.prototype.flush = function()
{
    // If the batch is length 0 then return as there is nothing to draw
    if (this.currentBatchSize===0)return;

    var gl = this.gl;

    this.renderSession.shaderManager.setShader(this.renderSession.shaderManager.defaultShader);

    if(this.dirty)
    {
        this.dirty = false;
        // bind the main texture
        gl.activeTexture(gl.TEXTURE0);

        // bind the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        // set the projection
        var projection = this.renderSession.projection;
        gl.uniform2f(this.shader.projectionVector, projection.x, projection.y);

        // set the pointers
        var stride =  this.vertSize * 4;
        gl.vertexAttribPointer(this.shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
        gl.vertexAttribPointer(this.shader.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);
        gl.vertexAttribPointer(this.shader.colorAttribute, 2, gl.FLOAT, false, stride, 4 * 4);

    }

    // upload the verts to the buffer  
    if(this.currentBatchSize > ( this.size * 0.5 ) )
    {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
    }
    else
    {
        var view = this.vertices.subarray(0, this.currentBatchSize * 4 * this.vertSize);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
    }

    var nextTexture, nextBlendMode;
    var batchSize = 0;
    var start = 0;

    var currentBaseTexture = null;
    var currentBlendMode = this.renderSession.blendModeManager.currentBlendMode;

    for (var i = 0, j = this.currentBatchSize; i < j; i++) {
        
        nextTexture = this.textures[i];
        nextBlendMode = this.blendModes[i];

        if(currentBaseTexture !== nextTexture || currentBlendMode !== nextBlendMode)
        {
            this.renderBatch(currentBaseTexture, batchSize, start);

            start = i;
            batchSize = 0;
            currentBaseTexture = nextTexture;
            currentBlendMode = nextBlendMode;
            
            this.renderSession.blendModeManager.setBlendMode( currentBlendMode );
        }

        batchSize++;
    }

    this.renderBatch(currentBaseTexture, batchSize, start);

    // then reset the batch!
    this.currentBatchSize = 0;
};

PIXI.WebGLSpriteBatch.prototype.renderBatch = function(texture, size, startIndex)
{
    if(size === 0)return;

    var gl = this.gl;
    // bind the current texture
    gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id] || PIXI.createWebGLTexture(texture, gl));

    // check if a texture is dirty..
    if(texture._dirty[gl.id])
    {
        PIXI.updateWebGLTexture(this.currentBaseTexture, gl);
    }

    // now draw those suckas!
    gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, startIndex * 6 * 2);
    
    // increment the draw count
    this.renderSession.drawCount++;
};

/**
* 
* @method stop
*
*/
PIXI.WebGLSpriteBatch.prototype.stop = function()
{
    this.flush();
};

/**
* 
* @method start
*
*/
PIXI.WebGLSpriteBatch.prototype.start = function()
{
    this.dirty = true;
};

/**
* Destroys the SpriteBatch
* @method destroy
*/
PIXI.WebGLSpriteBatch.prototype.destroy = function()
{

    this.vertices = null;
    this.indices = null;
    
    this.gl.deleteBuffer( this.vertexBuffer );
    this.gl.deleteBuffer( this.indexBuffer );
    
    this.currentBaseTexture = null;
    
    this.gl = null;
};


/**
 * @author Mat Groves
 * 
 * Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/
 * for creating the original pixi version!
 *
 * Heavily inspired by LibGDX's WebGLSpriteBatch:
 * https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/WebGLSpriteBatch.java
 */

PIXI.WebGLFastSpriteBatch = function(gl)
{
   

    this.vertSize = 10;
    this.maxSize = 6000;//Math.pow(2, 16) /  this.vertSize;
    this.size = this.maxSize;

    //the total number of floats in our batch
    var numVerts = this.size * 4 *  this.vertSize;
    //the total number of indices in our batch
    var numIndices = this.maxSize * 6;

     //vertex data
    this.vertices = new Float32Array(numVerts);
    //index data
    this.indices = new Uint16Array(numIndices);
    
    this.vertexBuffer = null;
    this.indexBuffer = null;

    this.lastIndexCount = 0;

    for (var i=0, j=0; i < numIndices; i += 6, j += 4)
    {
        this.indices[i + 0] = j + 0;
        this.indices[i + 1] = j + 1;
        this.indices[i + 2] = j + 2;
        this.indices[i + 3] = j + 0;
        this.indices[i + 4] = j + 2;
        this.indices[i + 5] = j + 3;
    }

    this.drawing = false;
    this.currentBatchSize = 0;
    this.currentBaseTexture = null;
   
    this.currentBlendMode = 0;
    this.renderSession = null;
    

    this.shader = null;

    this.matrix = null;

    this.setContext(gl);
};

PIXI.WebGLFastSpriteBatch.prototype.setContext = function(gl)
{
    this.gl = gl;

    // create a couple of buffers
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();

    // 65535 is max index, so 65535 / 6 = 10922.


    //upload the index data
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
};

PIXI.WebGLFastSpriteBatch.prototype.begin = function(spriteBatch, renderSession)
{
    this.renderSession = renderSession;
    this.shader = this.renderSession.shaderManager.fastShader;

    this.matrix = spriteBatch.worldTransform.toArray(true);

    this.start();
};

PIXI.WebGLFastSpriteBatch.prototype.end = function()
{
    this.flush();
};


PIXI.WebGLFastSpriteBatch.prototype.render = function(spriteBatch)
{

    var children = spriteBatch.children;
    var sprite = children[0];

    // if the uvs have not updated then no point rendering just yet!
    
    // check texture.
    if(!sprite.texture._uvs)return;
   
    this.currentBaseTexture = sprite.texture.baseTexture;
    
    // check blend mode
    if(sprite.blendMode !== this.renderSession.blendModeManager.currentBlendMode)
    {
        this.flush();
        this.renderSession.blendModeManager.setBlendMode(sprite.blendMode);
    }
    
    for(var i=0,j= children.length; i<j; i++)
    {
        this.renderSprite(children[i]);
    }

    this.flush();
};

PIXI.WebGLFastSpriteBatch.prototype.renderSprite = function(sprite)
{
    //sprite = children[i];
    if(!sprite.visible)return;
    
    // TODO trim??
    if(sprite.texture.baseTexture !== this.currentBaseTexture)
    {
        this.flush();
        this.currentBaseTexture = sprite.texture.baseTexture;
        
        if(!sprite.texture._uvs)return;
    }

    var uvs, verticies = this.vertices, width, height, w0, w1, h0, h1, index;

    uvs = sprite.texture._uvs;


    width = sprite.texture.frame.width;
    height = sprite.texture.frame.height;

    if (sprite.texture.trim)
    {
        // if the sprite is trimmed then we need to add the extra space before transforming the sprite coords..
        var trim = sprite.texture.trim;

        w1 = trim.x - sprite.anchor.x * trim.width;
        w0 = w1 + sprite.texture.crop.width;

        h1 = trim.y - sprite.anchor.y * trim.height;
        h0 = h1 + sprite.texture.crop.height;
    }
    else
    {
        w0 = (sprite.texture.frame.width ) * (1-sprite.anchor.x);
        w1 = (sprite.texture.frame.width ) * -sprite.anchor.x;

        h0 = sprite.texture.frame.height * (1-sprite.anchor.y);
        h1 = sprite.texture.frame.height * -sprite.anchor.y;
    }

    index = this.currentBatchSize * 4 * this.vertSize;

    // xy
    verticies[index++] = w1;
    verticies[index++] = h1;

    verticies[index++] = sprite.position.x;
    verticies[index++] = sprite.position.y;

    //scale
    verticies[index++] = sprite.scale.x;
    verticies[index++] = sprite.scale.y;

    //rotation
    verticies[index++] = sprite.rotation;

    // uv
    verticies[index++] = uvs.x0;
    verticies[index++] = uvs.y1;
    // color
    verticies[index++] = sprite.alpha;
 

    // xy
    verticies[index++] = w0;
    verticies[index++] = h1;

    verticies[index++] = sprite.position.x;
    verticies[index++] = sprite.position.y;

    //scale
    verticies[index++] = sprite.scale.x;
    verticies[index++] = sprite.scale.y;

     //rotation
    verticies[index++] = sprite.rotation;

    // uv
    verticies[index++] = uvs.x1;
    verticies[index++] = uvs.y1;
    // color
    verticies[index++] = sprite.alpha;
  

    // xy
    verticies[index++] = w0;
    verticies[index++] = h0;

    verticies[index++] = sprite.position.x;
    verticies[index++] = sprite.position.y;

    //scale
    verticies[index++] = sprite.scale.x;
    verticies[index++] = sprite.scale.y;

     //rotation
    verticies[index++] = sprite.rotation;

    // uv
    verticies[index++] = uvs.x2;
    verticies[index++] = uvs.y2;
    // color
    verticies[index++] = sprite.alpha;
 



    // xy
    verticies[index++] = w1;
    verticies[index++] = h0;

    verticies[index++] = sprite.position.x;
    verticies[index++] = sprite.position.y;

    //scale
    verticies[index++] = sprite.scale.x;
    verticies[index++] = sprite.scale.y;

     //rotation
    verticies[index++] = sprite.rotation;

    // uv
    verticies[index++] = uvs.x3;
    verticies[index++] = uvs.y3;
    // color
    verticies[index++] = sprite.alpha;

    // increment the batchs
    this.currentBatchSize++;

    if(this.currentBatchSize >= this.size)
    {
        this.flush();
    }
};

PIXI.WebGLFastSpriteBatch.prototype.flush = function()
{

    // If the batch is length 0 then return as there is nothing to draw
    if (this.currentBatchSize===0)return;

    var gl = this.gl;
    
    // bind the current texture

    if(!this.currentBaseTexture._glTextures[gl.id])PIXI.createWebGLTexture(this.currentBaseTexture, gl);

    gl.bindTexture(gl.TEXTURE_2D, this.currentBaseTexture._glTextures[gl.id]);

    // upload the verts to the buffer

   
    if(this.currentBatchSize > ( this.size * 0.5 ) )
    {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
    }
    else
    {
        var view = this.vertices.subarray(0, this.currentBatchSize * 4 * this.vertSize);

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
    }
    
    
    // now draw those suckas!
    gl.drawElements(gl.TRIANGLES, this.currentBatchSize * 6, gl.UNSIGNED_SHORT, 0);
   
    // then reset the batch!
    this.currentBatchSize = 0;

    // increment the draw count
    this.renderSession.drawCount++;
};


PIXI.WebGLFastSpriteBatch.prototype.stop = function()
{
    this.flush();
};

PIXI.WebGLFastSpriteBatch.prototype.start = function()
{
    var gl = this.gl;

    // bind the main texture
    gl.activeTexture(gl.TEXTURE0);

    // bind the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    // set the projection
    var projection = this.renderSession.projection;
    gl.uniform2f(this.shader.projectionVector, projection.x, projection.y);

    // set the matrix
    gl.uniformMatrix3fv(this.shader.uMatrix, false, this.matrix);

    // set the pointers
    var stride =  this.vertSize * 4;

    gl.vertexAttribPointer(this.shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
    gl.vertexAttribPointer(this.shader.aPositionCoord, 2, gl.FLOAT, false, stride, 2 * 4);
    gl.vertexAttribPointer(this.shader.aScale, 2, gl.FLOAT, false, stride, 4 * 4);
    gl.vertexAttribPointer(this.shader.aRotation, 1, gl.FLOAT, false, stride, 6 * 4);
    gl.vertexAttribPointer(this.shader.aTextureCoord, 2, gl.FLOAT, false, stride, 7 * 4);
    gl.vertexAttribPointer(this.shader.colorAttribute, 1, gl.FLOAT, false, stride, 9 * 4);

    
};



/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class WebGLFilterManager
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
* @param transparent {Boolean} Whether or not the drawing context should be transparent
* @private
*/
PIXI.WebGLFilterManager = function(gl, transparent)
{
    this.transparent = transparent;

    this.filterStack = [];
    
    this.offsetX = 0;
    this.offsetY = 0;

    this.setContext(gl);
};

// API
/**
* Initialises the context and the properties
* @method setContext 
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXI.WebGLFilterManager.prototype.setContext = function(gl)
{
    this.gl = gl;
    this.texturePool = [];

    this.initShaderBuffers();
};

/**
* 
* @method begin
* @param renderSession {RenderSession} 
* @param buffer {ArrayBuffer} 
*/
PIXI.WebGLFilterManager.prototype.begin = function(renderSession, buffer)
{
    this.renderSession = renderSession;
    this.defaultShader = renderSession.shaderManager.defaultShader;

    var projection = this.renderSession.projection;
   // console.log(this.width)
    this.width = projection.x * 2;
    this.height = -projection.y * 2;
    this.buffer = buffer;
};

/**
* Applies the filter and adds it to the current filter stack
* @method pushFilter
* @param filterBlock {Object} the filter that will be pushed to the current filter stack
*/
PIXI.WebGLFilterManager.prototype.pushFilter = function(filterBlock)
{
    var gl = this.gl;

    var projection = this.renderSession.projection;
    var offset = this.renderSession.offset;

    filterBlock._filterArea = filterBlock.target.filterArea || filterBlock.target.getBounds();


    // filter program
    // OPTIMISATION - the first filter is free if its a simple color change?
    this.filterStack.push(filterBlock);

    var filter = filterBlock.filterPasses[0];

    this.offsetX += filterBlock._filterArea.x;
    this.offsetY += filterBlock._filterArea.y;

    var texture = this.texturePool.pop();
    if(!texture)
    {
        texture = new PIXI.FilterTexture(this.gl, this.width, this.height);
    }
    else
    {
        texture.resize(this.width, this.height);
    }

    gl.bindTexture(gl.TEXTURE_2D,  texture.texture);

    var filterArea = filterBlock._filterArea;// filterBlock.target.getBounds();///filterBlock.target.filterArea;

    var padding = filter.padding;
    filterArea.x -= padding;
    filterArea.y -= padding;
    filterArea.width += padding * 2;
    filterArea.height += padding * 2;

    // cap filter to screen size..
    if(filterArea.x < 0)filterArea.x = 0;
    if(filterArea.width > this.width)filterArea.width = this.width;
    if(filterArea.y < 0)filterArea.y = 0;
    if(filterArea.height > this.height)filterArea.height = this.height;

    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  filterArea.width, filterArea.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, texture.frameBuffer);

    // set view port
    gl.viewport(0, 0, filterArea.width, filterArea.height);

    projection.x = filterArea.width/2;
    projection.y = -filterArea.height/2;

    offset.x = -filterArea.x;
    offset.y = -filterArea.y;

    // update projection
    // now restore the regular shader..
    this.renderSession.shaderManager.setShader(this.defaultShader);
    gl.uniform2f(this.defaultShader.projectionVector, filterArea.width/2, -filterArea.height/2);
    gl.uniform2f(this.defaultShader.offsetVector, -filterArea.x, -filterArea.y);

    gl.colorMask(true, true, true, true);
    gl.clearColor(0,0,0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    filterBlock._glFilterTexture = texture;

};


/**
* Removes the last filter from the filter stack and doesn't return it
* @method popFilter
*/
PIXI.WebGLFilterManager.prototype.popFilter = function()
{
    var gl = this.gl;
    var filterBlock = this.filterStack.pop();
    var filterArea = filterBlock._filterArea;
    var texture = filterBlock._glFilterTexture;
    var projection = this.renderSession.projection;
    var offset = this.renderSession.offset;

    if(filterBlock.filterPasses.length > 1)
    {
        gl.viewport(0, 0, filterArea.width, filterArea.height);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        this.vertexArray[0] = 0;
        this.vertexArray[1] = filterArea.height;

        this.vertexArray[2] = filterArea.width;
        this.vertexArray[3] = filterArea.height;

        this.vertexArray[4] = 0;
        this.vertexArray[5] = 0;

        this.vertexArray[6] = filterArea.width;
        this.vertexArray[7] = 0;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexArray);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        // now set the uvs..
        this.uvArray[2] = filterArea.width/this.width;
        this.uvArray[5] = filterArea.height/this.height;
        this.uvArray[6] = filterArea.width/this.width;
        this.uvArray[7] = filterArea.height/this.height;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvArray);

        var inputTexture = texture;
        var outputTexture = this.texturePool.pop();
        if(!outputTexture)outputTexture = new PIXI.FilterTexture(this.gl, this.width, this.height);
        outputTexture.resize(this.width, this.height);

        // need to clear this FBO as it may have some left over elements from a previous filter.
        gl.bindFramebuffer(gl.FRAMEBUFFER, outputTexture.frameBuffer );
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.disable(gl.BLEND);

        for (var i = 0; i < filterBlock.filterPasses.length-1; i++)
        {
            var filterPass = filterBlock.filterPasses[i];

            gl.bindFramebuffer(gl.FRAMEBUFFER, outputTexture.frameBuffer );

            // set texture
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, inputTexture.texture);

            // draw texture..
            //filterPass.applyFilterPass(filterArea.width, filterArea.height);
            this.applyFilterPass(filterPass, filterArea, filterArea.width, filterArea.height);

            // swap the textures..
            var temp = inputTexture;
            inputTexture = outputTexture;
            outputTexture = temp;
        }

        gl.enable(gl.BLEND);

        texture = inputTexture;
        this.texturePool.push(outputTexture);
    }

    var filter = filterBlock.filterPasses[filterBlock.filterPasses.length-1];

    this.offsetX -= filterArea.x;
    this.offsetY -= filterArea.y;


    var sizeX = this.width;
    var sizeY = this.height;

    var offsetX = 0;
    var offsetY = 0;

    var buffer = this.buffer;

    // time to render the filters texture to the previous scene
    if(this.filterStack.length === 0)
    {
        gl.colorMask(true, true, true, true);//this.transparent);
    }
    else
    {
        var currentFilter = this.filterStack[this.filterStack.length-1];
        filterArea = currentFilter._filterArea;

        sizeX = filterArea.width;
        sizeY = filterArea.height;

        offsetX = filterArea.x;
        offsetY = filterArea.y;

        buffer =  currentFilter._glFilterTexture.frameBuffer;
    }



    // TODO need toremove thease global elements..
    projection.x = sizeX/2;
    projection.y = -sizeY/2;

    offset.x = offsetX;
    offset.y = offsetY;

    filterArea = filterBlock._filterArea;

    var x = filterArea.x-offsetX;
    var y = filterArea.y-offsetY;

    // update the buffers..
    // make sure to flip the y!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    this.vertexArray[0] = x;
    this.vertexArray[1] = y + filterArea.height;

    this.vertexArray[2] = x + filterArea.width;
    this.vertexArray[3] = y + filterArea.height;

    this.vertexArray[4] = x;
    this.vertexArray[5] = y;

    this.vertexArray[6] = x + filterArea.width;
    this.vertexArray[7] = y;

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexArray);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

    this.uvArray[2] = filterArea.width/this.width;
    this.uvArray[5] = filterArea.height/this.height;
    this.uvArray[6] = filterArea.width/this.width;
    this.uvArray[7] = filterArea.height/this.height;

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvArray);

   //console.log(this.vertexArray)
   //console.log(this.uvArray)
    //console.log(sizeX + " : " + sizeY)

    gl.viewport(0, 0, sizeX, sizeY);

    // bind the buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, buffer );

    // set the blend mode! 
    //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    // set texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.texture);

    // apply!
    this.applyFilterPass(filter, filterArea, sizeX, sizeY);

    // now restore the regular shader..
    this.renderSession.shaderManager.setShader(this.defaultShader);
    gl.uniform2f(this.defaultShader.projectionVector, sizeX/2, -sizeY/2);
    gl.uniform2f(this.defaultShader.offsetVector, -offsetX, -offsetY);

    // return the texture to the pool
    this.texturePool.push(texture);
    filterBlock._glFilterTexture = null;
};


/**
* Applies the filter to the specified area
* @method applyFilterPass
* @param filter {AbstractFilter} the filter that needs to be applied
* @param filterArea {texture} TODO - might need an update
* @param width {Number} the horizontal range of the filter
* @param height {Number} the vertical range of the filter
*/
PIXI.WebGLFilterManager.prototype.applyFilterPass = function(filter, filterArea, width, height)
{
    // use program
    var gl = this.gl;
    var shader = filter.shaders[gl.id];

    if(!shader)
    {
        shader = new PIXI.PixiShader(gl);

        shader.fragmentSrc = filter.fragmentSrc;
        shader.uniforms = filter.uniforms;
        shader.init();

        filter.shaders[gl.id] = shader;
    }

    // set the shader
    this.renderSession.shaderManager.setShader(shader);

//    gl.useProgram(shader.program);

    gl.uniform2f(shader.projectionVector, width/2, -height/2);
    gl.uniform2f(shader.offsetVector, 0,0);

    if(filter.uniforms.dimensions)
    {
        filter.uniforms.dimensions.value[0] = this.width;//width;
        filter.uniforms.dimensions.value[1] = this.height;//height;
        filter.uniforms.dimensions.value[2] = this.vertexArray[0];
        filter.uniforms.dimensions.value[3] = this.vertexArray[5];//filterArea.height;
    }

  //  console.log(this.uvArray )
    shader.syncUniforms();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.vertexAttribPointer(shader.colorAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    // draw the filter...
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

    this.renderSession.drawCount++;
};

/**
* Initialises the shader buffers
* @method initShaderBuffers
*/
PIXI.WebGLFilterManager.prototype.initShaderBuffers = function()
{
    var gl = this.gl;

    // create some buffers
    this.vertexBuffer = gl.createBuffer();
    this.uvBuffer = gl.createBuffer();
    this.colorBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();


    // bind and upload the vertexs..
    // keep a reference to the vertexFloatData..
    this.vertexArray = new Float32Array([0.0, 0.0,
                                         1.0, 0.0,
                                         0.0, 1.0,
                                         1.0, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(
    gl.ARRAY_BUFFER,
    this.vertexArray,
    gl.STATIC_DRAW);


    // bind and upload the uv buffer
    this.uvArray = new Float32Array([0.0, 0.0,
                                     1.0, 0.0,
                                     0.0, 1.0,
                                     1.0, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(
    gl.ARRAY_BUFFER,
    this.uvArray,
    gl.STATIC_DRAW);

    this.colorArray = new Float32Array([1.0, 0xFFFFFF,
                                        1.0, 0xFFFFFF,
                                        1.0, 0xFFFFFF,
                                        1.0, 0xFFFFFF]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(
    gl.ARRAY_BUFFER,
    this.colorArray,
    gl.STATIC_DRAW);

    // bind and upload the index
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 1, 3, 2]),
    gl.STATIC_DRAW);
};

/**
* Destroys the filter and removes it from the filter stack
* @method destroy
*/
PIXI.WebGLFilterManager.prototype.destroy = function()
{
    var gl = this.gl;

    this.filterStack = null;
    
    this.offsetX = 0;
    this.offsetY = 0;

    // destroy textures
    for (var i = 0; i < this.texturePool.length; i++) {
        this.texturePool[i].destroy();
    }
    
    this.texturePool = null;

    //destroy buffers..
    gl.deleteBuffer(this.vertexBuffer);
    gl.deleteBuffer(this.uvBuffer);
    gl.deleteBuffer(this.colorBuffer);
    gl.deleteBuffer(this.indexBuffer);
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class FilterTexture
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
* @param width {Number} the horizontal range of the filter
* @param height {Number} the vertical range of the filter
* @param scaleMode {Number} Should be one of the PIXI.scaleMode consts
* @private
*/
PIXI.FilterTexture = function(gl, width, height, scaleMode)
{
    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;

    // next time to create a frame buffer and texture
    this.frameBuffer = gl.createFramebuffer();
    this.texture = gl.createTexture();

    scaleMode = scaleMode || PIXI.scaleModes.DEFAULT;

    gl.bindTexture(gl.TEXTURE_2D,  this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer );

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer );
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

    // required for masking a mask??
    this.renderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);
  
    this.resize(width, height);
};


/**
* Clears the filter texture
* @method clear
*/
PIXI.FilterTexture.prototype.clear = function()
{
    var gl = this.gl;
    
    gl.clearColor(0,0,0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
};

/**
 * Resizes the texture to the specified width and height
 *
 * @method resize
 * @param width {Number} the new width of the texture
 * @param height {Number} the new height of the texture
 */
PIXI.FilterTexture.prototype.resize = function(width, height)
{
    if(this.width === width && this.height === height) return;

    this.width = width;
    this.height = height;

    var gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D,  this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    // update the stencil buffer width and height
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
};

/**
* Destroys the filter texture
* @method destroy
*/
PIXI.FilterTexture.prototype.destroy = function()
{
    var gl = this.gl;
    gl.deleteFramebuffer( this.frameBuffer );
    gl.deleteTexture( this.texture );

    this.frameBuffer = null;
    this.texture = null;
};

/**
 * @author Mat Groves
 * 
 * 
 */
/**
 * A set of functions used to handle masking
 *
 * @class CanvasMaskManager
 */
PIXI.CanvasMaskManager = function()
{
    
};

/**
 * This method adds it to the current stack of masks
 *
 * @method pushMask
 * @param maskData the maskData that will be pushed
 * @param context {Context2D} the 2d drawing method of the canvas
 */
PIXI.CanvasMaskManager.prototype.pushMask = function(maskData, context)
{
    context.save();
    
    var cacheAlpha = maskData.alpha;
    var transform = maskData.worldTransform;

    context.setTransform(transform.a, transform.c, transform.b, transform.d, transform.tx, transform.ty);

    PIXI.CanvasGraphics.renderGraphicsMask(maskData, context);

    context.clip();

    maskData.worldAlpha = cacheAlpha;
};

/**
 * Restores the current drawing context to the state it was before the mask was applied
 *
 * @method popMask
 * @param context {Context2D} the 2d drawing method of the canvas
 */
PIXI.CanvasMaskManager.prototype.popMask = function(context)
{
    context.restore();
};

/**
 * @author Mat Groves
 * 
 * 
 */

/**
 * @class CanvasTinter
 * @constructor
 * @static
 */
PIXI.CanvasTinter = function()
{
    /// this.textureCach
};

//PIXI.CanvasTinter.cachTint = true;
    

/**
 * Basically this method just needs a sprite and a color and tints the sprite 
 * with the given color
 * 
 * @method getTintedTexture 
 * @param sprite {Sprite} the sprite to tint
 * @param color {Number} the color to use to tint the sprite with
 */
PIXI.CanvasTinter.getTintedTexture = function(sprite, color)
{

    var texture = sprite.texture;

    color = PIXI.CanvasTinter.roundColor(color);

    var stringColor = "#" + ("00000" + ( color | 0).toString(16)).substr(-6);
   
    texture.tintCache = texture.tintCache || {};

    if(texture.tintCache[stringColor]) return texture.tintCache[stringColor];

     // clone texture..
    var canvas = PIXI.CanvasTinter.canvas || document.createElement("canvas");
    
    //PIXI.CanvasTinter.tintWithPerPixel(texture, stringColor, canvas);

    
    PIXI.CanvasTinter.tintMethod(texture, color, canvas);

    if(PIXI.CanvasTinter.convertTintToImage)
    {
        // is this better?
        var tintImage = new Image();
        tintImage.src = canvas.toDataURL();

        texture.tintCache[stringColor] = tintImage;
    }
    else
    {
      
        texture.tintCache[stringColor] = canvas;
        // if we are not converting the texture to an image then we need to lose the reference to the canvas
        PIXI.CanvasTinter.canvas = null;

    }

    return canvas;
};

/**
 * Tint a texture using the "multiply" operation
 * @method tintWithMultiply
 * @param texture {texture} the texture to tint
 * @param color {Number} the color to use to tint the sprite with
 * @param canvas {HTMLCanvasElement} the current canvas
 */
PIXI.CanvasTinter.tintWithMultiply = function(texture, color, canvas)
{
    var context = canvas.getContext( "2d" );

    var frame = texture.frame;

    canvas.width = frame.width;
    canvas.height = frame.height;

    context.fillStyle = "#" + ("00000" + ( color | 0).toString(16)).substr(-6);
    
    context.fillRect(0, 0, frame.width, frame.height);
    
    context.globalCompositeOperation = "multiply";

    context.drawImage(texture.baseTexture.source,
                           frame.x,
                           frame.y,
                           frame.width,
                           frame.height,
                           0,
                           0,
                           frame.width,
                           frame.height);

    context.globalCompositeOperation = "destination-atop";
    
    context.drawImage(texture.baseTexture.source,
                           frame.x,
                           frame.y,
                           frame.width,
                           frame.height,
                           0,
                           0,
                           frame.width,
                           frame.height);
};

/**
 * Tint a texture using the "overlay" operation
 * @method tintWithOverlay
 * @param texture {texture} the texture to tint
 * @param color {Number} the color to use to tint the sprite with
 * @param canvas {HTMLCanvasElement} the current canvas
 */
PIXI.CanvasTinter.tintWithOverlay = function(texture, color, canvas)
{
    var context = canvas.getContext( "2d" );

    var frame = texture.frame;

    canvas.width = frame.width;
    canvas.height = frame.height;

    
    
    context.globalCompositeOperation = "copy";
    context.fillStyle = "#" + ("00000" + ( color | 0).toString(16)).substr(-6);
    context.fillRect(0, 0, frame.width, frame.height);

    context.globalCompositeOperation = "destination-atop";
    context.drawImage(texture.baseTexture.source,
                           frame.x,
                           frame.y,
                           frame.width,
                           frame.height,
                           0,
                           0,
                           frame.width,
                           frame.height);

    
    //context.globalCompositeOperation = "copy";

};

/**
 * Tint a texture pixel per pixel
 * @method tintPerPixel
 * @param texture {texture} the texture to tint
 * @param color {Number} the color to use to tint the sprite with
 * @param canvas {HTMLCanvasElement} the current canvas
 */
PIXI.CanvasTinter.tintWithPerPixel = function(texture, color, canvas)
{
    var context = canvas.getContext( "2d" );

    var frame = texture.frame;

    canvas.width = frame.width;
    canvas.height = frame.height;
  
    context.globalCompositeOperation = "copy";
    context.drawImage(texture.baseTexture.source,
                           frame.x,
                           frame.y,
                           frame.width,
                           frame.height,
                           0,
                           0,
                           frame.width,
                           frame.height);

    var rgbValues = PIXI.hex2rgb(color);
    var r = rgbValues[0], g = rgbValues[1], b = rgbValues[2];

    var pixelData = context.getImageData(0, 0, frame.width, frame.height);

    var pixels = pixelData.data;

    for (var i = 0; i < pixels.length; i += 4)
    {
        pixels[i+0] *= r;
        pixels[i+1] *= g;
        pixels[i+2] *= b;
    }

    context.putImageData(pixelData, 0, 0);
};

/**
 * Rounds the specified color according to the PIXI.CanvasTinter.cacheStepsPerColorChannel
 * @method roundColor
 * @param color {number} the color to round, should be a hex color
 */
PIXI.CanvasTinter.roundColor = function(color)
{
    var step = PIXI.CanvasTinter.cacheStepsPerColorChannel;

    var rgbValues = PIXI.hex2rgb(color);

    rgbValues[0] = Math.min(255, (rgbValues[0] / step) * step);
    rgbValues[1] = Math.min(255, (rgbValues[1] / step) * step);
    rgbValues[2] = Math.min(255, (rgbValues[2] / step) * step);

    return PIXI.rgb2hex(rgbValues);
};

/**
 * 
 * Number of steps which will be used as a cap when rounding colors
 *
 * @property cacheStepsPerColorChannel
 * @type Number
 */
PIXI.CanvasTinter.cacheStepsPerColorChannel = 8;
/**
 * 
 * Number of steps which will be used as a cap when rounding colors
 *
 * @property convertTintToImage
 * @type Boolean
 */
PIXI.CanvasTinter.convertTintToImage = false;

/**
 * Whether or not the Canvas BlendModes are supported, consequently the ability to tint using the multiply method
 *
 * @property canUseMultiply
 * @type Boolean
 */
PIXI.CanvasTinter.canUseMultiply = PIXI.canUseNewCanvasBlendModes();

PIXI.CanvasTinter.tintMethod = PIXI.CanvasTinter.canUseMultiply ? PIXI.CanvasTinter.tintWithMultiply :  PIXI.CanvasTinter.tintWithPerPixel;


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * the CanvasRenderer draws the stage and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.
 * Dont forget to add the view to your DOM or you will not see anything :)
 *
 * @class CanvasRenderer
 * @constructor
 * @param width=800 {Number} the width of the canvas view
 * @param height=600 {Number} the height of the canvas view
 * @param [view] {HTMLCanvasElement} the canvas to use as a view, optional
 * @param [transparent=false] {Boolean} the transparency of the render view, default false
 */
PIXI.CanvasRenderer = function(width, height, view, transparent)
{
    if(!PIXI.defaultRenderer)
    {
        PIXI.sayHello("Canvas");
        PIXI.defaultRenderer = this;
    }

    this.type = PIXI.CANVAS_RENDERER;

    /**
     * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
     * If the Stage is NOT transparent Pixi will use a canvas sized fillRect operation every frame to set the canvas background color.
     * If the Stage is transparent Pixi will use clearRect to clear the canvas every frame.
     * Disable this by setting this to false. For example if your game has a canvas filling background image you often don't need this set.
     *
     * @property clearBeforeRender
     * @type Boolean
     * @default
     */
    this.clearBeforeRender = true;

    /**
     * Whether the render view is transparent
     *
     * @property transparent
     * @type Boolean
     */
    this.transparent = !!transparent;

    if(!PIXI.blendModesCanvas)
    {
        PIXI.blendModesCanvas = [];

        if(PIXI.canUseNewCanvasBlendModes())
        {
            PIXI.blendModesCanvas[PIXI.blendModes.NORMAL]   = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.ADD]      = "lighter"; //IS THIS OK???
            PIXI.blendModesCanvas[PIXI.blendModes.MULTIPLY] = "multiply";
            PIXI.blendModesCanvas[PIXI.blendModes.SCREEN]   = "screen";
            PIXI.blendModesCanvas[PIXI.blendModes.OVERLAY]  = "overlay";
            PIXI.blendModesCanvas[PIXI.blendModes.DARKEN]   = "darken";
            PIXI.blendModesCanvas[PIXI.blendModes.LIGHTEN]  = "lighten";
            PIXI.blendModesCanvas[PIXI.blendModes.COLOR_DODGE] = "color-dodge";
            PIXI.blendModesCanvas[PIXI.blendModes.COLOR_BURN] = "color-burn";
            PIXI.blendModesCanvas[PIXI.blendModes.HARD_LIGHT] = "hard-light";
            PIXI.blendModesCanvas[PIXI.blendModes.SOFT_LIGHT] = "soft-light";
            PIXI.blendModesCanvas[PIXI.blendModes.DIFFERENCE] = "difference";
            PIXI.blendModesCanvas[PIXI.blendModes.EXCLUSION] = "exclusion";
            PIXI.blendModesCanvas[PIXI.blendModes.HUE]       = "hue";
            PIXI.blendModesCanvas[PIXI.blendModes.SATURATION] = "saturation";
            PIXI.blendModesCanvas[PIXI.blendModes.COLOR]      = "color";
            PIXI.blendModesCanvas[PIXI.blendModes.LUMINOSITY] = "luminosity";
        }
        else
        {
            // this means that the browser does not support the cool new blend modes in canvas "cough" ie "cough"
            PIXI.blendModesCanvas[PIXI.blendModes.NORMAL]   = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.ADD]      = "lighter"; //IS THIS OK???
            PIXI.blendModesCanvas[PIXI.blendModes.MULTIPLY] = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.SCREEN]   = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.OVERLAY]  = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.DARKEN]   = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.LIGHTEN]  = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.COLOR_DODGE] = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.COLOR_BURN] = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.HARD_LIGHT] = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.SOFT_LIGHT] = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.DIFFERENCE] = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.EXCLUSION] = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.HUE]       = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.SATURATION] = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.COLOR]      = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.LUMINOSITY] = "source-over";
        }
    }

    /**
     * The width of the canvas view
     *
     * @property width
     * @type Number
     * @default 800
     */
    this.width = width || 800;

    /**
     * The height of the canvas view
     *
     * @property height
     * @type Number
     * @default 600
     */
    this.height = height || 600;

    /**
     * The canvas element that everything is drawn to
     *
     * @property view
     * @type HTMLCanvasElement
     */
    this.view = view || document.createElement( "canvas" );

    /**
     * The canvas 2d context that everything is drawn with
     * @property context
     * @type HTMLCanvasElement 2d Context
     */
    this.context = this.view.getContext( "2d", { alpha: this.transparent } );

    this.refresh = true;
    // hack to enable some hardware acceleration!
    //this.view.style["transform"] = "translatez(0)";

    this.view.width = this.width;
    this.view.height = this.height;
    this.count = 0;

    /**
     * Instance of a PIXI.CanvasMaskManager, handles masking when using the canvas renderer
     * @property CanvasMaskManager
     * @type CanvasMaskManager
     */
    this.maskManager = new PIXI.CanvasMaskManager();

    /**
     * The render session is just a bunch of parameter used for rendering
     * @property renderSession
     * @type Object
     */
    this.renderSession = {
        context: this.context,
        maskManager: this.maskManager,
        scaleMode: null,
        smoothProperty: null,

        /**
         * If true Pixi will Math.floor() x/y values when rendering, stopping pixel interpolation.
         * Handy for crisp pixel art and speed on legacy devices.
         *
         */
        roundPixels: false
    };

    if("imageSmoothingEnabled" in this.context)
        this.renderSession.smoothProperty = "imageSmoothingEnabled";
    else if("webkitImageSmoothingEnabled" in this.context)
        this.renderSession.smoothProperty = "webkitImageSmoothingEnabled";
    else if("mozImageSmoothingEnabled" in this.context)
        this.renderSession.smoothProperty = "mozImageSmoothingEnabled";
    else if("oImageSmoothingEnabled" in this.context)
        this.renderSession.smoothProperty = "oImageSmoothingEnabled";
};

// constructor
PIXI.CanvasRenderer.prototype.constructor = PIXI.CanvasRenderer;

/**
 * Renders the stage to its canvas view
 *
 * @method render
 * @param stage {Stage} the Stage element to be rendered
 */
PIXI.CanvasRenderer.prototype.render = function(stage)
{
    // update textures if need be
    PIXI.texturesToUpdate.length = 0;
    PIXI.texturesToDestroy.length = 0;

    stage.updateTransform();

    this.context.setTransform(1,0,0,1,0,0);
    this.context.globalAlpha = 1;

    if (navigator.isCocoonJS && this.view.screencanvas) {
        this.context.fillStyle = "black";
        this.context.clear();
    }

    if (!this.transparent && this.clearBeforeRender)
    {
        this.context.fillStyle = stage.backgroundColorString;
        this.context.fillRect(0, 0, this.width, this.height);
    }
    else if (this.transparent && this.clearBeforeRender)
    {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    this.renderDisplayObject(stage);

    // run interaction!
    if(stage.interactive)
    {
        //need to add some events!
        if(!stage._interactiveEventsAdded)
        {
            stage._interactiveEventsAdded = true;
            stage.interactionManager.setTarget(this);
        }
    }

    // remove frame updates..
    if(PIXI.Texture.frameUpdates.length > 0)
    {
        PIXI.Texture.frameUpdates.length = 0;
    }
};

/**
 * Resizes the canvas view to the specified width and height
 *
 * @method resize
 * @param width {Number} the new width of the canvas view
 * @param height {Number} the new height of the canvas view
 */
PIXI.CanvasRenderer.prototype.resize = function(width, height)
{
    this.width = width;
    this.height = height;

    this.view.width = width;
    this.view.height = height;
};

/**
 * Renders a display object
 *
 * @method renderDisplayObject
 * @param displayObject {DisplayObject} The displayObject to render
 * @param context {Context2D} the context 2d method of the canvas
 * @private
 */
PIXI.CanvasRenderer.prototype.renderDisplayObject = function(displayObject, context)
{
    // no longer recursive!
    //var transform;
    //var context = this.context;

    this.renderSession.context = context || this.context;
    displayObject._renderCanvas(this.renderSession);
};

/**
 * Renders a flat strip
 *
 * @method renderStripFlat
 * @param strip {Strip} The Strip to render
 * @private
 */
PIXI.CanvasRenderer.prototype.renderStripFlat = function(strip)
{
    var context = this.context;
    var verticies = strip.verticies;

    var length = verticies.length/2;
    this.count++;

    context.beginPath();
    for (var i=1; i < length-2; i++)
    {
        // draw some triangles!
        var index = i*2;

        var x0 = verticies[index],   x1 = verticies[index+2], x2 = verticies[index+4];
        var y0 = verticies[index+1], y1 = verticies[index+3], y2 = verticies[index+5];

        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineTo(x2, y2);
    }

    context.fillStyle = "#FF0000";
    context.fill();
    context.closePath();
};

/**
 * Renders a strip
 *
 * @method renderStrip
 * @param strip {Strip} The Strip to render
 * @private
 */
PIXI.CanvasRenderer.prototype.renderStrip = function(strip)
{
    var context = this.context;

    // draw triangles!!
    var verticies = strip.verticies;
    var uvs = strip.uvs;

    var length = verticies.length/2;
    this.count++;

    for (var i = 1; i < length-2; i++)
    {
        // draw some triangles!
        var index = i*2;

        var x0 = verticies[index],   x1 = verticies[index+2], x2 = verticies[index+4];
        var y0 = verticies[index+1], y1 = verticies[index+3], y2 = verticies[index+5];

        var u0 = uvs[index] * strip.texture.width,   u1 = uvs[index+2] * strip.texture.width, u2 = uvs[index+4]* strip.texture.width;
        var v0 = uvs[index+1]* strip.texture.height, v1 = uvs[index+3] * strip.texture.height, v2 = uvs[index+5]* strip.texture.height;

        context.save();
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineTo(x2, y2);
        context.closePath();

        context.clip();

        // Compute matrix transform
        var delta = u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
        var deltaA = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
        var deltaB = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
        var deltaC = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2 - v0*u1*x2 - u0*x1*v2;
        var deltaD = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
        var deltaE = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
        var deltaF = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2 - v0*u1*y2 - u0*y1*v2;

        context.transform(deltaA / delta, deltaD / delta,
                            deltaB / delta, deltaE / delta,
                            deltaC / delta, deltaF / delta);

        context.drawImage(strip.texture.baseTexture.source, 0, 0);
        context.restore();
    }
};

/**
 * Creates a Canvas element of the given size
 *
 * @method CanvasBuffer
 * @param width {Number} the width for the newly created canvas
 * @param height {Number} the height for the newly created canvas
 * @static
 * @private
 */
PIXI.CanvasBuffer = function(width, height)
{
    this.width = width;
    this.height = height;

    this.canvas = document.createElement( "canvas" );
    this.context = this.canvas.getContext( "2d" );

    this.canvas.width = width;
    this.canvas.height = height;
};

/**
 * Clears the canvas that was created by the CanvasBuffer class
 *
 * @method clear
 * @private
 */
PIXI.CanvasBuffer.prototype.clear = function()
{
    this.context.clearRect(0,0, this.width, this.height);
};

/**
 * Resizes the canvas that was created by the CanvasBuffer class to the specified width and height
 *
 * @method resize
 * @param width {Number} the new width of the canvas
 * @param height {Number} the new height of the canvas
 * @private
 */

PIXI.CanvasBuffer.prototype.resize = function(width, height)
{
    this.width = this.canvas.width = width;
    this.height = this.canvas.height = height;
};


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * A set of functions used by the canvas renderer to draw the primitive graphics data
 *
 * @class CanvasGraphics
 */
PIXI.CanvasGraphics = function()
{

};


/*
 * Renders the graphics object
 *
 * @static
 * @private
 * @method renderGraphics
 * @param graphics {Graphics} the actual graphics object to render
 * @param context {Context2D} the 2d drawing method of the canvas
 */
PIXI.CanvasGraphics.renderGraphics = function(graphics, context)
{
    var worldAlpha = graphics.worldAlpha;
    var color = '';

    for (var i = 0; i < graphics.graphicsData.length; i++)
    {
        var data = graphics.graphicsData[i];
        var points = data.points;

        context.strokeStyle = color = '#' + ('00000' + ( data.lineColor | 0).toString(16)).substr(-6);

        context.lineWidth = data.lineWidth;

        if(data.type === PIXI.Graphics.POLY)
        {
            context.beginPath();

            context.moveTo(points[0], points[1]);

            for (var j=1; j < points.length/2; j++)
            {
                context.lineTo(points[j * 2], points[j * 2 + 1]);
            }

            // if the first and last point are the same close the path - much neater :)
            if(points[0] === points[points.length-2] && points[1] === points[points.length-1])
            {
                context.closePath();
            }

            if(data.fill)
            {
                context.globalAlpha = data.fillAlpha * worldAlpha;
                context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
                context.fill();
            }
            if(data.lineWidth)
            {
                context.globalAlpha = data.lineAlpha * worldAlpha;
                context.stroke();
            }
        }
        else if(data.type === PIXI.Graphics.RECT)
        {

            if(data.fillColor || data.fillColor === 0)
            {
                context.globalAlpha = data.fillAlpha * worldAlpha;
                context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
                context.fillRect(points[0], points[1], points[2], points[3]);

            }
            if(data.lineWidth)
            {
                context.globalAlpha = data.lineAlpha * worldAlpha;
                context.strokeRect(points[0], points[1], points[2], points[3]);
            }

        }
        else if(data.type === PIXI.Graphics.CIRC)
        {
            // TODO - need to be Undefined!
            context.beginPath();
            context.arc(points[0], points[1], points[2],0,2*Math.PI);
            context.closePath();

            if(data.fill)
            {
                context.globalAlpha = data.fillAlpha * worldAlpha;
                context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
                context.fill();
            }
            if(data.lineWidth)
            {
                context.globalAlpha = data.lineAlpha * worldAlpha;
                context.stroke();
            }
        }
        else if(data.type === PIXI.Graphics.ELIP)
        {

            // ellipse code taken from: http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas

            var ellipseData =  data.points;

            var w = ellipseData[2] * 2;
            var h = ellipseData[3] * 2;

            var x = ellipseData[0] - w/2;
            var y = ellipseData[1] - h/2;

            context.beginPath();

            var kappa = 0.5522848,
                ox = (w / 2) * kappa, // control point offset horizontal
                oy = (h / 2) * kappa, // control point offset vertical
                xe = x + w,           // x-end
                ye = y + h,           // y-end
                xm = x + w / 2,       // x-middle
                ym = y + h / 2;       // y-middle

            context.moveTo(x, ym);
            context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
            context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
            context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

            context.closePath();

            if(data.fill)
            {
                context.globalAlpha = data.fillAlpha * worldAlpha;
                context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
                context.fill();
            }
            if(data.lineWidth)
            {
                context.globalAlpha = data.lineAlpha * worldAlpha;
                context.stroke();
            }
        }
        else if (data.type === PIXI.Graphics.RREC)
        {
            var rx = points[0];
            var ry = points[1];
            var width = points[2];
            var height = points[3];
            var radius = points[4];

            var maxRadius = Math.min(width, height) / 2 | 0;
            radius = radius > maxRadius ? maxRadius : radius;

            context.beginPath();
            context.moveTo(rx, ry + radius);
            context.lineTo(rx, ry + height - radius);
            context.quadraticCurveTo(rx, ry + height, rx + radius, ry + height);
            context.lineTo(rx + width - radius, ry + height);
            context.quadraticCurveTo(rx + width, ry + height, rx + width, ry + height - radius);
            context.lineTo(rx + width, ry + radius);
            context.quadraticCurveTo(rx + width, ry, rx + width - radius, ry);
            context.lineTo(rx + radius, ry);
            context.quadraticCurveTo(rx, ry, rx, ry + radius);
            context.closePath();

            if(data.fillColor || data.fillColor === 0)
            {
                context.globalAlpha = data.fillAlpha * worldAlpha;
                context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
                context.fill();

            }
            if(data.lineWidth)
            {
                context.globalAlpha = data.lineAlpha * worldAlpha;
                context.stroke();
            }
        }
    }
};

/*
 * Renders a graphics mask
 *
 * @static
 * @private
 * @method renderGraphicsMask
 * @param graphics {Graphics} the graphics which will be used as a mask
 * @param context {Context2D} the context 2d method of the canvas
 */
PIXI.CanvasGraphics.renderGraphicsMask = function(graphics, context)
{
    var len = graphics.graphicsData.length;

    if(len === 0) return;

    if(len > 1)
    {
        len = 1;
        window.console.log('Pixi.js warning: masks in canvas can only mask using the first path in the graphics object');
    }

    for (var i = 0; i < 1; i++)
    {
        var data = graphics.graphicsData[i];
        var points = data.points;

        if(data.type === PIXI.Graphics.POLY)
        {
            context.beginPath();
            context.moveTo(points[0], points[1]);

            for (var j=1; j < points.length/2; j++)
            {
                context.lineTo(points[j * 2], points[j * 2 + 1]);
            }

            // if the first and last point are the same close the path - much neater :)
            if(points[0] === points[points.length-2] && points[1] === points[points.length-1])
            {
                context.closePath();
            }

        }
        else if(data.type === PIXI.Graphics.RECT)
        {
            context.beginPath();
            context.rect(points[0], points[1], points[2], points[3]);
            context.closePath();
        }
        else if(data.type === PIXI.Graphics.CIRC)
        {
            // TODO - need to be Undefined!
            context.beginPath();
            context.arc(points[0], points[1], points[2],0,2*Math.PI);
            context.closePath();
        }
        else if(data.type === PIXI.Graphics.ELIP)
        {

            // ellipse code taken from: http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
            var ellipseData =  data.points;

            var w = ellipseData[2] * 2;
            var h = ellipseData[3] * 2;

            var x = ellipseData[0] - w/2;
            var y = ellipseData[1] - h/2;

            context.beginPath();

            var kappa = 0.5522848,
                ox = (w / 2) * kappa, // control point offset horizontal
                oy = (h / 2) * kappa, // control point offset vertical
                xe = x + w,           // x-end
                ye = y + h,           // y-end
                xm = x + w / 2,       // x-middle
                ym = y + h / 2;       // y-middle

            context.moveTo(x, ym);
            context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
            context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
            context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
            context.closePath();
        }
        else if (data.type === PIXI.Graphics.RREC)
        {
            var rx = points[0];
            var ry = points[1];
            var width = points[2];
            var height = points[3];
            var radius = points[4];

            var maxRadius = Math.min(width, height) / 2 | 0;
            radius = radius > maxRadius ? maxRadius : radius;

            context.beginPath();
            context.moveTo(rx, ry + radius);
            context.lineTo(rx, ry + height - radius);
            context.quadraticCurveTo(rx, ry + height, rx + radius, ry + height);
            context.lineTo(rx + width - radius, ry + height);
            context.quadraticCurveTo(rx + width, ry + height, rx + width, ry + height - radius);
            context.lineTo(rx + width, ry + radius);
            context.quadraticCurveTo(rx + width, ry, rx + width - radius, ry);
            context.lineTo(rx + radius, ry);
            context.quadraticCurveTo(rx, ry, rx, ry + radius);
            context.closePath();
        }
    }
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * The Graphics class contains a set of methods that you can use to create primitive shapes and lines.
 * It is important to know that with the webGL renderer only simple polygons can be filled at this stage
 * Complex polygons will not be filled. Heres an example of a complex polygon: http://www.goodboydigital.com/wp-content/uploads/2013/06/complexPolygon.png
 *
 * @class Graphics
 * @extends DisplayObjectContainer
 * @constructor
 */
PIXI.Graphics = function()
{
    PIXI.DisplayObjectContainer.call( this );

    this.renderable = true;

    /**
     * The alpha of the fill of this graphics object
     *
     * @property fillAlpha
     * @type Number
     */
    this.fillAlpha = 1;

    /**
     * The width of any lines drawn
     *
     * @property lineWidth
     * @type Number
     */
    this.lineWidth = 0;

    /**
     * The color of any lines drawn
     *
     * @property lineColor
     * @type String
     */
    this.lineColor = "black";

    /**
     * Graphics data
     *
     * @property graphicsData
     * @type Array
     * @private
     */
    this.graphicsData = [];


    /**
     * The tint applied to the graphic shape. This is a hex value
     *
     * @property tint
     * @type Number
     * @default 0xFFFFFF
     */
    this.tint = 0xFFFFFF;// * Math.random();
    
    /**
     * The blend mode to be applied to the graphic shape
     *
     * @property blendMode
     * @type Number
     * @default PIXI.blendModes.NORMAL;
     */
    this.blendMode = PIXI.blendModes.NORMAL;
    
    /**
     * Current path
     *
     * @property currentPath
     * @type Object
     * @private
     */
    this.currentPath = {points:[]};

    /**
     * Array containing some WebGL-related properties used by the WebGL renderer
     *
     * @property _webGL
     * @type Array
     * @private
     */
    this._webGL = [];

    /**
     * Whether this shape is being used as a mask
     *
     * @property isMask
     * @type isMask
     */
    this.isMask = false;

    /**
     * The bounds of the graphic shape as rectangle object
     *
     * @property bounds
     * @type Rectangle
     */
    this.bounds = null;

    /**
     * the bounds' padding used for bounds calculation
     *
     * @property boundsPadding
     * @type Number
     */
    this.boundsPadding = 10;

    /**
     * Used to detect if the graphics object has changed if this is set to true then the graphics object will be recalculated
     * 
     * @type {Boolean}
     */
    this.dirty = true;
};

// constructor
PIXI.Graphics.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Graphics.prototype.constructor = PIXI.Graphics;

/**
 * If cacheAsBitmap is true the graphics object will then be rendered as if it was a sprite.
 * This is useful if your graphics element does not change often as it will speed up the rendering of the object
 * It is also usful as the graphics object will always be antialiased because it will be rendered using canvas
 * Not recommended if you are constanly redrawing the graphics element.
 *
 * @property cacheAsBitmap
 * @default false
 * @type Boolean
 * @private
 */
Object.defineProperty(PIXI.Graphics.prototype, "cacheAsBitmap", {
    get: function() {
        return  this._cacheAsBitmap;
    },
    set: function(value) {
        this._cacheAsBitmap = value;

        if(this._cacheAsBitmap)
        {
            this._generateCachedSprite();
        }
        else
        {
            this.destroyCachedSprite();
            this.dirty = true;
        }

    }
});


/**
 * Specifies the line style used for subsequent calls to Graphics methods such as the lineTo() method or the drawCircle() method.
 *
 * @method lineStyle
 * @param lineWidth {Number} width of the line to draw, will update the object's stored style
 * @param color {Number} color of the line to draw, will update the object's stored style
 * @param alpha {Number} alpha of the line to draw, will update the object's stored style
 */
PIXI.Graphics.prototype.lineStyle = function(lineWidth, color, alpha)
{
    if (!this.currentPath.points.length) this.graphicsData.pop();

    this.lineWidth = lineWidth || 0;
    this.lineColor = color || 0;
    this.lineAlpha = (arguments.length < 3) ? 1 : alpha;

    this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
                        fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling, points:[], type:PIXI.Graphics.POLY};

    this.graphicsData.push(this.currentPath);

    return this;
};

/**
 * Moves the current drawing position to (x, y).
 *
 * @method moveTo
 * @param x {Number} the X coordinate to move to
 * @param y {Number} the Y coordinate to move to
 */
PIXI.Graphics.prototype.moveTo = function(x, y)
{
    if (!this.currentPath.points.length) this.graphicsData.pop();

    this.currentPath = this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
                        fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling, points:[], type:PIXI.Graphics.POLY};

    this.currentPath.points.push(x, y);

    this.graphicsData.push(this.currentPath);

    return this;
};

/**
 * Draws a line using the current line style from the current drawing position to (x, y);
 * the current drawing position is then set to (x, y).
 *
 * @method lineTo
 * @param x {Number} the X coordinate to draw to
 * @param y {Number} the Y coordinate to draw to
 */
PIXI.Graphics.prototype.lineTo = function(x, y)
{
    this.currentPath.points.push(x, y);
    this.dirty = true;

    return this;
};

/**
 * Calculate the points for a quadratic bezier curve.
 * Based on : https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
 *
 * @method quadraticCurveTo
 * @param  {number}   cpX   Control point x
 * @param  {number}   cpY   Control point y
 * @param  {number}   toX   Destination point x
 * @param  {number}   toY   Destination point y
 * @return {PIXI.Graphics}
 */
PIXI.Graphics.prototype.quadraticCurveTo = function(cpX, cpY, toX, toY)
{
    if( this.currentPath.points.length === 0)this.moveTo(0,0);

    var xa,
    ya,
    n = 20,
    points = this.currentPath.points;
    if(points.length === 0)this.moveTo(0, 0);
    

    var fromX = points[points.length-2];
    var fromY = points[points.length-1];

    var j = 0;
    for (var i = 1; i <= n; i++ )
    {
        j = i / n;

        xa = fromX + ( (cpX - fromX) * j );
        ya = fromY + ( (cpY - fromY) * j );

        points.push( xa + ( ((cpX + ( (toX - cpX) * j )) - xa) * j ),
                     ya + ( ((cpY + ( (toY - cpY) * j )) - ya) * j ) );
    }


    this.dirty = true;

    return this;
};

/**
 * Calculate the points for a bezier curve.
 *
 * @method bezierCurveTo
 * @param  {number}   cpX    Control point x
 * @param  {number}   cpY    Control point y
 * @param  {number}   cpX2   Second Control point x
 * @param  {number}   cpY2   Second Control point y
 * @param  {number}   toX    Destination point x
 * @param  {number}   toY    Destination point y
 * @return {PIXI.Graphics}
 */
PIXI.Graphics.prototype.bezierCurveTo = function(cpX, cpY, cpX2, cpY2, toX, toY)
{
    if( this.currentPath.points.length === 0)this.moveTo(0,0);

    var n = 20,
    dt,
    dt2,
    dt3,
    t2,
    t3,
    points = this.currentPath.points;

    var fromX = points[points.length-2];
    var fromY = points[points.length-1];
    
    var j = 0;

    for (var i=1; i<n; i++)
    {
        j = i / n;

        dt = (1 - j);
        dt2 = dt * dt;
        dt3 = dt2 * dt;

        t2 = j * j;
        t3 = t2 * j;
        
        points.push( dt3 * fromX + 3 * dt2 * j * cpX + 3 * dt * t2 * cpX2 + t3 * toX,
                     dt3 * fromY + 3 * dt2 * j * cpY + 3 * dt * t2 * cpY2 + t3 * toY);
        
    }
    
    this.dirty = true;

    return this;
};

/*
 * the arcTo() method creates an arc/curve between two tangents on the canvas.
 * 
 * "borrowed" from https://code.google.com/p/fxcanvas/ - thanks google!
 *
 * @method arcTo
 * @param  {number}   x1        The x-coordinate of the beginning of the arc
 * @param  {number}   y1        The y-coordinate of the beginning of the arc
 * @param  {number}   x2        The x-coordinate of the end of the arc
 * @param  {number}   y2        The y-coordinate of the end of the arc
 * @param  {number}   radius    The radius of the arc
 * @return {PIXI.Graphics}
 */
PIXI.Graphics.prototype.arcTo = function(x1, y1, x2, y2, radius)
{
    // check that path contains subpaths
    if( this.currentPath.points.length === 0)this.moveTo(x1, y1);
    
    var points = this.currentPath.points;
    var fromX = points[points.length-2];
    var fromY = points[points.length-1];

//    points.push( x1,  y1);

    var a1 = fromY - y1;
    var b1 = fromX - x1;
    var a2 = y2   - y1;
    var b2 = x2   - x1;
    var mm = Math.abs(a1 * b2 - b1 * a2);

    if (mm < 1.0e-8 || radius === 0)
    {
        points.push(x1, y1);
    }
    else
    {
        var dd = a1 * a1 + b1 * b1;
        var cc = a2 * a2 + b2 * b2;
        var tt = a1 * a2 + b1 * b2;
        var k1 = radius * Math.sqrt(dd) / mm;
        var k2 = radius * Math.sqrt(cc) / mm;
        var j1 = k1 * tt / dd;
        var j2 = k2 * tt / cc;
        var cx = k1 * b2 + k2 * b1;
        var cy = k1 * a2 + k2 * a1;
        var px = b1 * (k2 + j1);
        var py = a1 * (k2 + j1);
        var qx = b2 * (k1 + j2);
        var qy = a2 * (k1 + j2);
        var startAngle = Math.atan2(py - cy, px - cx);
        var endAngle   = Math.atan2(qy - cy, qx - cx);
        // not required?
     //   points.push(px + x1 , py + y1);
        this.arc(cx + x1, cy + y1, radius, startAngle, endAngle, b1 * a2 > b2 * a1);
    }

    this.dirty = true;

    return this;
};

/**
 * The arc() method creates an arc/curve (used to create circles, or parts of circles).
 *
 * @method arc
 * @param  {number}   cx                The x-coordinate of the center of the circle
 * @param  {number}   cy                The y-coordinate of the center of the circle
 * @param  {number}   radius            The radius of the circle
 * @param  {number}   startAngle        The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
 * @param  {number}   endAngle          The ending angle, in radians
 * @param  {number}   anticlockwise     Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
 * @return {PIXI.Graphics}
 */
PIXI.Graphics.prototype.arc = function(cx, cy, radius, startAngle, endAngle, anticlockwise)
{
    var startX = cx + Math.cos(startAngle) * radius;
    var startY = cy + Math.sin(startAngle) * radius;
    
    var points = this.currentPath.points;

    if(points.length !== 0 && points[points.length-2] !== startX || points[points.length-1] !== startY)
    {
        this.moveTo(startX, startY);
        points = this.currentPath.points;
    }

    if (startAngle === endAngle)return this;

    if( !anticlockwise && endAngle <= startAngle )
    {
        endAngle += Math.PI * 2;
    }
    else if( anticlockwise && startAngle <= endAngle )
    {
        startAngle += Math.PI * 2;
    }

    var sweep = anticlockwise ? (startAngle - endAngle) *-1 : (endAngle - startAngle);
    var segs =  ( Math.abs(sweep)/ (Math.PI * 2) ) * 40;

    if( sweep === 0 ) return this;

    var theta = sweep/(segs*2);
    var theta2 = theta*2;

    var cTheta = Math.cos(theta);
    var sTheta = Math.sin(theta);
    
    var segMinus = segs - 1;

    var remainder = ( segMinus % 1 ) / segMinus;

    for(var i=0; i<=segMinus; i++)
    {
        var real =  i + remainder * i;

    
        var angle = ((theta) + startAngle + (theta2 * real));

        var c = Math.cos(angle);
        var s = -Math.sin(angle);

        points.push(( (cTheta *  c) + (sTheta * s) ) * radius + cx,
                    ( (cTheta * -s) + (sTheta * c) ) * radius + cy);
    }

    this.dirty = true;

    return this;
};

/**
 * Draws a line using the current line style from the current drawing position to (x, y);
 * the current drawing position is then set to (x, y).
 *
 * @method lineTo
 * @param x {Number} the X coordinate to draw to
 * @param y {Number} the Y coordinate to draw to
 */
PIXI.Graphics.prototype.drawPath = function(path)
{
    if (!this.currentPath.points.length) this.graphicsData.pop();

    this.currentPath = this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
                        fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling, points:[], type:PIXI.Graphics.POLY};

    this.graphicsData.push(this.currentPath);

    this.currentPath.points = this.currentPath.points.concat(path);
    this.dirty = true;

    return this;
};

/**
 * Specifies a simple one-color fill that subsequent calls to other Graphics methods
 * (such as lineTo() or drawCircle()) use when drawing.
 *
 * @method beginFill
 * @param color {Number} the color of the fill
 * @param alpha {Number} the alpha of the fill
 */
PIXI.Graphics.prototype.beginFill = function(color, alpha)
{

    this.filling = true;
    this.fillColor = color || 0;
    this.fillAlpha = (arguments.length < 2) ? 1 : alpha;

    return this;
};

/**
 * Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
 *
 * @method endFill
 */
PIXI.Graphics.prototype.endFill = function()
{
    this.filling = false;
    this.fillColor = null;
    this.fillAlpha = 1;

    return this;
};

/**
 * @method drawRect
 *
 * @param x {Number} The X coord of the top-left of the rectangle
 * @param y {Number} The Y coord of the top-left of the rectangle
 * @param width {Number} The width of the rectangle
 * @param height {Number} The height of the rectangle
 */
PIXI.Graphics.prototype.drawRect = function( x, y, width, height )
{
    if (!this.currentPath.points.length) this.graphicsData.pop();

    this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
                        fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling,
                        points:[x, y, width, height], type:PIXI.Graphics.RECT};

    this.graphicsData.push(this.currentPath);
    this.dirty = true;

    return this;
};

/**
 * @method drawRoundedRect
 *
 * @param x {Number} The X coord of the top-left of the rectangle
 * @param y {Number} The Y coord of the top-left of the rectangle
 * @param width {Number} The width of the rectangle
 * @param height {Number} The height of the rectangle
 * @param radius {Number} Radius of the rectangle corners
 */
PIXI.Graphics.prototype.drawRoundedRect = function( x, y, width, height, radius )
{
    if (!this.currentPath.points.length) this.graphicsData.pop();

    this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
                        fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling,
                        points:[x, y, width, height, radius], type:PIXI.Graphics.RREC};

    this.graphicsData.push(this.currentPath);
    this.dirty = true;

    return this;
};

/**
 * Draws a circle.
 *
 * @method drawCircle
 * @param x {Number} The X coordinate of the center of the circle
 * @param y {Number} The Y coordinate of the center of the circle
 * @param radius {Number} The radius of the circle
 */
PIXI.Graphics.prototype.drawCircle = function(x, y, radius)
{

    if (!this.currentPath.points.length) this.graphicsData.pop();

    this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
                        fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling,
                        points:[x, y, radius, radius], type:PIXI.Graphics.CIRC};

    this.graphicsData.push(this.currentPath);
    this.dirty = true;

    return this;
};

/**
 * Draws an ellipse.
 *
 * @method drawEllipse
 * @param x {Number} The X coordinate of the center of the ellipse
 * @param y {Number} The Y coordinate of the center of the ellipse
 * @param width {Number} The half width of the ellipse
 * @param height {Number} The half height of the ellipse
 */
PIXI.Graphics.prototype.drawEllipse = function(x, y, width, height)
{

    if (!this.currentPath.points.length) this.graphicsData.pop();

    this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
                        fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling,
                        points:[x, y, width, height], type:PIXI.Graphics.ELIP};

    this.graphicsData.push(this.currentPath);
    this.dirty = true;

    return this;
};

/**
 * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
 *
 * @method clear
 */
PIXI.Graphics.prototype.clear = function()
{
    this.lineWidth = 0;
    this.filling = false;

    this.dirty = true;
    this.clearDirty = true;
    this.graphicsData = [];

    this.bounds = null; //new PIXI.Rectangle();

    return this;
};

/**
 * Useful function that returns a texture of the graphics object that can then be used to create sprites
 * This can be quite useful if your geometry is complicated and needs to be reused multiple times.
 *
 * @method generateTexture
 * @return {Texture} a texture of the graphics object
 */
PIXI.Graphics.prototype.generateTexture = function()
{
    var bounds = this.getBounds();

    var canvasBuffer = new PIXI.CanvasBuffer(bounds.width, bounds.height);
    var texture = PIXI.Texture.fromCanvas(canvasBuffer.canvas);

    canvasBuffer.context.translate(-bounds.x,-bounds.y);
    
    PIXI.CanvasGraphics.renderGraphics(this, canvasBuffer.context);

    return texture;
};

/**
* Renders the object using the WebGL renderer
*
* @method _renderWebGL
* @param renderSession {RenderSession} 
* @private
*/
PIXI.Graphics.prototype._renderWebGL = function(renderSession)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if(this.visible === false || this.alpha === 0 || this.isMask === true)return;
    

    if(this._cacheAsBitmap)
    {
       
        if(this.dirty)
        {
            this._generateCachedSprite();
            // we will also need to update the texture on the gpu too!
            PIXI.updateWebGLTexture(this._cachedSprite.texture.baseTexture, renderSession.gl);
            
            this.dirty =  false;
        }

        this._cachedSprite.alpha = this.alpha;
        PIXI.Sprite.prototype._renderWebGL.call(this._cachedSprite, renderSession);

        return;
    }
    else
    {
        renderSession.spriteBatch.stop();
        renderSession.blendModeManager.setBlendMode(this.blendMode);

        if(this._mask)renderSession.maskManager.pushMask(this._mask, renderSession);
        if(this._filters)renderSession.filterManager.pushFilter(this._filterBlock);
      
        // check blend mode
        if(this.blendMode !== renderSession.spriteBatch.currentBlendMode)
        {
            renderSession.spriteBatch.currentBlendMode = this.blendMode;
            var blendModeWebGL = PIXI.blendModesWebGL[renderSession.spriteBatch.currentBlendMode];
            renderSession.spriteBatch.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
        }
        
      //  for (var i = this.graphicsData.length - 1; i >= 0; i--) {
        //    this.graphicsData[i]
            
//        };

        PIXI.WebGLGraphics.renderGraphics(this, renderSession);
        
        // only render if it has children!
        if(this.children.length)
        {
            renderSession.spriteBatch.start();

             // simple render children!
            for(var i=0, j=this.children.length; i<j; i++)
            {
                this.children[i]._renderWebGL(renderSession);
            }

            renderSession.spriteBatch.stop();
        }

        if(this._filters)renderSession.filterManager.popFilter();
        if(this._mask)renderSession.maskManager.popMask(this.mask, renderSession);
          
        renderSession.drawCount++;

        renderSession.spriteBatch.start();
    }
};

/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession} 
* @private
*/
PIXI.Graphics.prototype._renderCanvas = function(renderSession)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if(this.visible === false || this.alpha === 0 || this.isMask === true)return;
    
    var context = renderSession.context;
    var transform = this.worldTransform;
    
    if(this.blendMode !== renderSession.currentBlendMode)
    {
        renderSession.currentBlendMode = this.blendMode;
        context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];
    }

    if(this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession.context);
    }

    context.setTransform(transform.a, transform.c, transform.b, transform.d, transform.tx, transform.ty);
    PIXI.CanvasGraphics.renderGraphics(this, context);

     // simple render children!
    for(var i=0, j=this.children.length; i<j; i++)
    {
        this.children[i]._renderCanvas(renderSession);
    }

    if(this._mask)
    {
        renderSession.maskManager.popMask(renderSession.context);
    }
};

/**
 * Retrieves the bounds of the graphic shape as a rectangle object
 *
 * @method getBounds
 * @return {Rectangle} the rectangular bounding area
 */
PIXI.Graphics.prototype.getBounds = function( matrix )
{
    if(!this.bounds)this.updateBounds();

    var w0 = this.bounds.x;
    var w1 = this.bounds.width + this.bounds.x;

    var h0 = this.bounds.y;
    var h1 = this.bounds.height + this.bounds.y;

    var worldTransform = matrix || this.worldTransform;

    var a = worldTransform.a;
    var b = worldTransform.c;
    var c = worldTransform.b;
    var d = worldTransform.d;
    var tx = worldTransform.tx;
    var ty = worldTransform.ty;

    var x1 = a * w1 + c * h1 + tx;
    var y1 = d * h1 + b * w1 + ty;

    var x2 = a * w0 + c * h1 + tx;
    var y2 = d * h1 + b * w0 + ty;

    var x3 = a * w0 + c * h0 + tx;
    var y3 = d * h0 + b * w0 + ty;

    var x4 =  a * w1 + c * h0 + tx;
    var y4 =  d * h0 + b * w1 + ty;

    var maxX = x1;
    var maxY = y1;

    var minX = x1;
    var minY = y1;

    minX = x2 < minX ? x2 : minX;
    minX = x3 < minX ? x3 : minX;
    minX = x4 < minX ? x4 : minX;

    minY = y2 < minY ? y2 : minY;
    minY = y3 < minY ? y3 : minY;
    minY = y4 < minY ? y4 : minY;

    maxX = x2 > maxX ? x2 : maxX;
    maxX = x3 > maxX ? x3 : maxX;
    maxX = x4 > maxX ? x4 : maxX;

    maxY = y2 > maxY ? y2 : maxY;
    maxY = y3 > maxY ? y3 : maxY;
    maxY = y4 > maxY ? y4 : maxY;

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    return bounds;
};

/**
 * Update the bounds of the object
 *
 * @method updateBounds
 */
PIXI.Graphics.prototype.updateBounds = function()
{
    
    var minX = Infinity;
    var maxX = -Infinity;

    var minY = Infinity;
    var maxY = -Infinity;

    var points, x, y, w, h;

    for (var i = 0; i < this.graphicsData.length; i++) {
        var data = this.graphicsData[i];
        var type = data.type;
        var lineWidth = data.lineWidth;

        points = data.points;

        if(type === PIXI.Graphics.RECT)
        {
            x = points[0] - lineWidth/2;
            y = points[1] - lineWidth/2;
            w = points[2] + lineWidth;
            h = points[3] + lineWidth;

            minX = x < minX ? x : minX;
            maxX = x + w > maxX ? x + w : maxX;

            minY = y < minY ? x : minY;
            maxY = y + h > maxY ? y + h : maxY;
        }
        else if(type === PIXI.Graphics.CIRC || type === PIXI.Graphics.ELIP)
        {
            x = points[0];
            y = points[1];
            w = points[2] + lineWidth/2;
            h = points[3] + lineWidth/2;

            minX = x - w < minX ? x - w : minX;
            maxX = x + w > maxX ? x + w : maxX;

            minY = y - h < minY ? y - h : minY;
            maxY = y + h > maxY ? y + h : maxY;
        }
        else
        {
            // POLY
            for (var j = 0; j < points.length; j+=2)
            {

                x = points[j];
                y = points[j+1];
                minX = x-lineWidth < minX ? x-lineWidth : minX;
                maxX = x+lineWidth > maxX ? x+lineWidth : maxX;

                minY = y-lineWidth < minY ? y-lineWidth : minY;
                maxY = y+lineWidth > maxY ? y+lineWidth : maxY;
            }
        }
    }

    var padding = this.boundsPadding;
    this.bounds = new PIXI.Rectangle(minX - padding, minY - padding, (maxX - minX) + padding * 2, (maxY - minY) + padding * 2);
};


/**
 * Generates the cached sprite when the sprite has cacheAsBitmap = true
 *
 * @method _generateCachedSprite
 * @private
 */
PIXI.Graphics.prototype._generateCachedSprite = function()
{
    var bounds = this.getLocalBounds();

    if(!this._cachedSprite)
    {
        var canvasBuffer = new PIXI.CanvasBuffer(bounds.width, bounds.height);
        var texture = PIXI.Texture.fromCanvas(canvasBuffer.canvas);
        
        this._cachedSprite = new PIXI.Sprite(texture);
        this._cachedSprite.buffer = canvasBuffer;

        this._cachedSprite.worldTransform = this.worldTransform;
    }
    else
    {
        this._cachedSprite.buffer.resize(bounds.width, bounds.height);
    }

    // leverage the anchor to account for the offset of the element
    this._cachedSprite.anchor.x = -( bounds.x / bounds.width );
    this._cachedSprite.anchor.y = -( bounds.y / bounds.height );

   // this._cachedSprite.buffer.context.save();
    this._cachedSprite.buffer.context.translate(-bounds.x,-bounds.y);
    
    PIXI.CanvasGraphics.renderGraphics(this, this._cachedSprite.buffer.context);
    this._cachedSprite.alpha = this.alpha;

   // this._cachedSprite.buffer.context.restore();
};

PIXI.Graphics.prototype.destroyCachedSprite = function()
{
    this._cachedSprite.texture.destroy(true);

    // let the gc collect the unused sprite
    // TODO could be object pooled!
    this._cachedSprite = null;
};


// SOME TYPES:
PIXI.Graphics.POLY = 0;
PIXI.Graphics.RECT = 1;
PIXI.Graphics.CIRC = 2;
PIXI.Graphics.ELIP = 3;
PIXI.Graphics.RREC = 4;


/**
 * @author Mat Groves http://matgroves.com/
 */

 /**
 * 
 * @class Strip
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} The texture to use
 * @param width {Number} the width 
 * @param height {Number} the height
 * 
 */
PIXI.Strip = function(texture)
{
    PIXI.DisplayObjectContainer.call( this );
    
    this.texture = texture;

    // set up the main bits..
    this.uvs = new PIXI.Float32Array([0, 1,
                                    1, 1,
                                    1, 0,
                                    0,1]);

    this.verticies = new PIXI.Float32Array([0, 0,
                      100,0,
                      100,100,
                      0, 100]);

    this.colors = new PIXI.Float32Array([1, 1, 1, 1]);

    this.indices = new PIXI.Uint16Array([0, 1, 2, 3]);
    

    this.dirty = true;
};

// constructor
PIXI.Strip.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.Strip.prototype.constructor = PIXI.Strip;

PIXI.Strip.prototype._renderWebGL = function(renderSession)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if(!this.visible || this.alpha <= 0)return;
    // render triangle strip..

    renderSession.spriteBatch.stop();

    // init! init!
    if(!this._vertexBuffer)this._initWebGL(renderSession);
    
    renderSession.shaderManager.setShader(renderSession.shaderManager.stripShader);

    this._renderStrip(renderSession);

    ///renderSession.shaderManager.activateDefaultShader();

    renderSession.spriteBatch.start();

    //TODO check culling  
};

PIXI.Strip.prototype._initWebGL = function(renderSession)
{
    // build the strip!
    var gl = renderSession.gl;
    
    this._vertexBuffer = gl.createBuffer();
    this._indexBuffer = gl.createBuffer();
    this._uvBuffer = gl.createBuffer();
    this._colorBuffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,  this.uvs, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
};

PIXI.Strip.prototype._renderStrip = function(renderSession)
{
    var gl = renderSession.gl;
    var projection = renderSession.projection,
        offset = renderSession.offset,
        shader = renderSession.shaderManager.stripShader;


    // gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mat4Real);

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // set uniforms
    gl.uniformMatrix3fv(shader.translationMatrix, false, this.worldTransform.toArray(true));
    gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
    gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);
    gl.uniform1f(shader.alpha, 1);

    if(!this.dirty)
    {
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verticies);
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        
        // update the uvs
        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
            
        gl.activeTexture(gl.TEXTURE0);
         // bind the current texture
        gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture(this.texture.baseTexture, gl));
    
        // dont need to upload!
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    
    
    }
    else
    {

        this.dirty = false;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        
        // update the uvs
        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
            
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture(this.texture.baseTexture, gl));
    
        // dont need to upload!
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        
    }
    //console.log(gl.TRIANGLE_STRIP)
    //
    //
    gl.drawElements(gl.TRIANGLE_STRIP, this.indices.length, gl.UNSIGNED_SHORT, 0);
    
  
};

PIXI.Strip.prototype._renderCanvas = function(renderSession)
{
    var context = renderSession.context;
    
    var transform = this.worldTransform;

    if (renderSession.roundPixels)
    {
        context.setTransform(transform.a, transform.c, transform.b, transform.d, transform.tx | 0, transform.ty | 0);
    }
    else
    {
        context.setTransform(transform.a, transform.c, transform.b, transform.d, transform.tx, transform.ty);
    }
        
    var strip = this;
    // draw triangles!!
    var verticies = strip.verticies;
    var uvs = strip.uvs;

    var length = verticies.length/2;
    this.count++;

    for (var i = 0; i < length-2; i++)
    {
        // draw some triangles!
        var index = i*2;

        var x0 = verticies[index],   x1 = verticies[index+2], x2 = verticies[index+4];
        var y0 = verticies[index+1], y1 = verticies[index+3], y2 = verticies[index+5];

        if(true)
        {

            //expand();
            var centerX = (x0 + x1 + x2)/3;
            var centerY = (y0 + y1 + y2)/3;

            var normX = x0 - centerX;
            var normY = y0 - centerY;

            var dist = Math.sqrt( normX * normX + normY * normY );
            x0 = centerX + (normX / dist) * (dist + 3);
            y0 = centerY + (normY / dist) * (dist + 3);

            // 
            
            normX = x1 - centerX;
            normY = y1 - centerY;

            dist = Math.sqrt( normX * normX + normY * normY );
            x1 = centerX + (normX / dist) * (dist + 3);
            y1 = centerY + (normY / dist) * (dist + 3);

            normX = x2 - centerX;
            normY = y2 - centerY;

            dist = Math.sqrt( normX * normX + normY * normY );
            x2 = centerX + (normX / dist) * (dist + 3);
            y2 = centerY + (normY / dist) * (dist + 3);

        }

        var u0 = uvs[index] * strip.texture.width,   u1 = uvs[index+2] * strip.texture.width, u2 = uvs[index+4]* strip.texture.width;
        var v0 = uvs[index+1]* strip.texture.height, v1 = uvs[index+3] * strip.texture.height, v2 = uvs[index+5]* strip.texture.height;

        context.save();
        context.beginPath();


        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineTo(x2, y2);

        context.closePath();

        context.clip();

        // Compute matrix transform
        var delta = u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
        var deltaA = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
        var deltaB = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
        var deltaC = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2 - v0*u1*x2 - u0*x1*v2;
        var deltaD = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
        var deltaE = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
        var deltaF = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2 - v0*u1*y2 - u0*y1*v2;

        context.transform(deltaA / delta, deltaD / delta,
                            deltaB / delta, deltaE / delta,
                            deltaC / delta, deltaF / delta);

        context.drawImage(strip.texture.baseTexture.source, 0, 0);
        context.restore();
    }
};

/*
 * Sets the texture that the Strip will use 
 *
 * @method setTexture
 * @param texture {Texture} the texture that will be used
 * @private
 */

/*
PIXI.Strip.prototype.setTexture = function(texture)
{
    //TODO SET THE TEXTURES
    //TODO VISIBILITY

    // stop current texture
    this.texture = texture;
    this.width   = texture.frame.width;
    this.height  = texture.frame.height;
    this.updateFrame = true;
};
*/

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */

PIXI.Strip.prototype.onTextureUpdate = function()
{
    this.updateFrame = true;
};
/* @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * 
 * @class Rope
 * @constructor
 * @param texture {Texture} The texture to use
 * @param points {Array}
 * 
 */
PIXI.Rope = function(texture, points)
{
    PIXI.Strip.call( this, texture );
    this.points = points;

    this.verticies = new PIXI.Float32Array(points.length * 4);
    this.uvs = new PIXI.Float32Array(points.length * 4);
    this.colors = new PIXI.Float32Array(points.length * 2);
    this.indices = new PIXI.Uint16Array(points.length * 2);
   

    this.refresh();
};


// constructor
PIXI.Rope.prototype = Object.create( PIXI.Strip.prototype );
PIXI.Rope.prototype.constructor = PIXI.Rope;

/*
 * Refreshes 
 *
 * @method refresh
 */
PIXI.Rope.prototype.refresh = function()
{
    var points = this.points;
    if(points.length < 1) return;

    var uvs = this.uvs;

    var lastPoint = points[0];
    var indices = this.indices;
    var colors = this.colors;

    this.count-=0.2;

    uvs[0] = 0;
    uvs[1] = 0;
    uvs[2] = 0;
    uvs[3] = 1;

    colors[0] = 1;
    colors[1] = 1;

    indices[0] = 0;
    indices[1] = 1;

    var total = points.length,
        point, index, amount;

    for (var i = 1; i < total; i++)
    {
        point = points[i];
        index = i * 4;
        // time to do some smart drawing!
        amount = i / (total-1);

        if(i%2)
        {
            uvs[index] = amount;
            uvs[index+1] = 0;

            uvs[index+2] = amount;
            uvs[index+3] = 1;
        }
        else
        {
            uvs[index] = amount;
            uvs[index+1] = 0;

            uvs[index+2] = amount;
            uvs[index+3] = 1;
        }

        index = i * 2;
        colors[index] = 1;
        colors[index+1] = 1;

        index = i * 2;
        indices[index] = index;
        indices[index + 1] = index + 1;

        lastPoint = point;
    }
};

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.Rope.prototype.updateTransform = function()
{

    var points = this.points;
    if(points.length < 1)return;

    var lastPoint = points[0];
    var nextPoint;
    var perp = {x:0, y:0};

    this.count-=0.2;

    var verticies = this.verticies;
    var total = points.length,
        point, index, ratio, perpLength, num;

    for (var i = 0; i < total; i++)
    {
        point = points[i];
        index = i * 4;

        if(i < points.length-1)
        {
            nextPoint = points[i+1];
        }
        else
        {
            nextPoint = point;
        }

        perp.y = -(nextPoint.x - lastPoint.x);
        perp.x = nextPoint.y - lastPoint.y;

        ratio = (1 - (i / (total-1))) * 10;

        if(ratio > 1) ratio = 1;

        perpLength = Math.sqrt(perp.x * perp.x + perp.y * perp.y);
        num = this.texture.height / 2; //(20 + Math.abs(Math.sin((i + this.count) * 0.3) * 50) )* ratio;
        perp.x /= perpLength;
        perp.y /= perpLength;

        perp.x *= num;
        perp.y *= num;

        verticies[index] = point.x + perp.x;
        verticies[index+1] = point.y + perp.y;
        verticies[index+2] = point.x - perp.x;
        verticies[index+3] = point.y - perp.y;

        lastPoint = point;
    }

    PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );
};
/*
 * Sets the texture that the Rope will use 
 *
 * @method setTexture
 * @param texture {Texture} the texture that will be used
 */
PIXI.Rope.prototype.setTexture = function(texture)
{
    // stop current texture
    this.texture = texture;
    //this.updateFrame = true;
};

/**
 * @author Mat Groves http://matgroves.com/
 */

/**
 * A tiling sprite is a fast way of rendering a tiling image
 *
 * @class TilingSprite
 * @extends Sprite
 * @constructor
 * @param texture {Texture} the texture of the tiling sprite
 * @param width {Number}  the width of the tiling sprite
 * @param height {Number} the height of the tiling sprite
 */
PIXI.TilingSprite = function(texture, width, height)
{
    PIXI.Sprite.call( this, texture);

    /**
     * The with of the tiling sprite
     *
     * @property width
     * @type Number
     */
    this._width = width || 100;

    /**
     * The height of the tiling sprite
     *
     * @property height
     * @type Number
     */
    this._height = height || 100;

    /**
     * The scaling of the image that is being tiled
     *
     * @property tileScale
     * @type Point
     */
    this.tileScale = new PIXI.Point(1,1);

    /**
     * A point that represents the scale of the texture object
     *
     * @property tileScaleOffset
     * @type Point
     */
    this.tileScaleOffset = new PIXI.Point(1,1);
    
    /**
     * The offset position of the image that is being tiled
     *
     * @property tilePosition
     * @type Point
     */
    this.tilePosition = new PIXI.Point(0,0);

    /**
     * Whether this sprite is renderable or not
     *
     * @property renderable
     * @type Boolean
     * @default true
     */
    this.renderable = true;

    /**
     * The tint applied to the sprite. This is a hex value
     *
     * @property tint
     * @type Number
     * @default 0xFFFFFF
     */
    this.tint = 0xFFFFFF;
    
    /**
     * The blend mode to be applied to the sprite
     *
     * @property blendMode
     * @type Number
     * @default PIXI.blendModes.NORMAL;
     */
    this.blendMode = PIXI.blendModes.NORMAL;

    

};

// constructor
PIXI.TilingSprite.prototype = Object.create(PIXI.Sprite.prototype);
PIXI.TilingSprite.prototype.constructor = PIXI.TilingSprite;


/**
 * The width of the sprite, setting this will actually modify the scale to achieve the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.TilingSprite.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        
        this._width = value;
    }
});

/**
 * The height of the TilingSprite, setting this will actually modify the scale to achieve the value set
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI.TilingSprite.prototype, 'height', {
    get: function() {
        return  this._height;
    },
    set: function(value) {
        this._height = value;
    }
});

PIXI.TilingSprite.prototype.setTexture = function(texture)
{
    if (this.texture === texture) return;

    this.texture = texture;

    this.refreshTexture = true;

    this.cachedTint = 0xFFFFFF;
};

/**
* Renders the object using the WebGL renderer
*
* @method _renderWebGL
* @param renderSession {RenderSession} 
* @private
*/
PIXI.TilingSprite.prototype._renderWebGL = function(renderSession)
{
    if (this.visible === false || this.alpha === 0) return;
    var i,j;

    if (this._mask)
    {
        renderSession.spriteBatch.stop();
        renderSession.maskManager.pushMask(this.mask, renderSession);
        renderSession.spriteBatch.start();
    }

    if (this._filters)
    {
        renderSession.spriteBatch.flush();
        renderSession.filterManager.pushFilter(this._filterBlock);
    }

   

    if (!this.tilingTexture || this.refreshTexture)
    {
        this.generateTilingTexture(true);

        if (this.tilingTexture && this.tilingTexture.needsUpdate)
        {
            //TODO - tweaking
            PIXI.updateWebGLTexture(this.tilingTexture.baseTexture, renderSession.gl);
            this.tilingTexture.needsUpdate = false;
           // this.tilingTexture._uvs = null;
        }
    }
    else
    {
        renderSession.spriteBatch.renderTilingSprite(this);
    }
    // simple render children!
    for (i=0,j=this.children.length; i<j; i++)
    {
        this.children[i]._renderWebGL(renderSession);
    }

    renderSession.spriteBatch.stop();

    if (this._filters) renderSession.filterManager.popFilter();
    if (this._mask) renderSession.maskManager.popMask(renderSession);
    
    renderSession.spriteBatch.start();
};

/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession} 
* @private
*/
PIXI.TilingSprite.prototype._renderCanvas = function(renderSession)
{
    if (this.visible === false || this.alpha === 0)return;
    
    var context = renderSession.context;

    if (this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, context);
    }

    context.globalAlpha = this.worldAlpha;
    
    var transform = this.worldTransform;

    var i,j;

    context.setTransform(transform.a, transform.c, transform.b, transform.d, transform.tx , transform.ty);

    if (!this.__tilePattern ||  this.refreshTexture)
    {
        this.generateTilingTexture(false);
    
        if (this.tilingTexture)
        {
            this.__tilePattern = context.createPattern(this.tilingTexture.baseTexture.source, 'repeat');
        }
        else
        {
            return;
        }
    }

    // check blend mode
    if (this.blendMode !== renderSession.currentBlendMode)
    {
        renderSession.currentBlendMode = this.blendMode;
        context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];
    }

    var tilePosition = this.tilePosition;
    var tileScale = this.tileScale;

    tilePosition.x %= this.tilingTexture.baseTexture.width;
    tilePosition.y %= this.tilingTexture.baseTexture.height;

    // offset
    context.scale(tileScale.x,tileScale.y);
    context.translate(tilePosition.x, tilePosition.y);

    context.fillStyle = this.__tilePattern;

    // make sure to account for the anchor point..
    context.fillRect(-tilePosition.x + (this.anchor.x * -this._width),
                    -tilePosition.y + (this.anchor.y * -this._height),
                    this._width / tileScale.x,
                    this._height / tileScale.y);

    context.scale(1 / tileScale.x, 1 / tileScale.y);
    context.translate(-tilePosition.x, -tilePosition.y);

    if (this._mask)
    {
        renderSession.maskManager.popMask(renderSession.context);
    }

    for (i=0,j=this.children.length; i<j; i++)
    {
        this.children[i]._renderCanvas(renderSession);
    }
};


/**
* Returns the framing rectangle of the sprite as a PIXI.Rectangle object
*
* @method getBounds
* @return {Rectangle} the framing rectangle
*/
PIXI.TilingSprite.prototype.getBounds = function()
{
    var width = this._width;
    var height = this._height;

    var w0 = width * (1-this.anchor.x);
    var w1 = width * -this.anchor.x;

    var h0 = height * (1-this.anchor.y);
    var h1 = height * -this.anchor.y;

    var worldTransform = this.worldTransform;

    var a = worldTransform.a;
    var b = worldTransform.c;
    var c = worldTransform.b;
    var d = worldTransform.d;
    var tx = worldTransform.tx;
    var ty = worldTransform.ty;
    
    var x1 = a * w1 + c * h1 + tx;
    var y1 = d * h1 + b * w1 + ty;

    var x2 = a * w0 + c * h1 + tx;
    var y2 = d * h1 + b * w0 + ty;

    var x3 = a * w0 + c * h0 + tx;
    var y3 = d * h0 + b * w0 + ty;

    var x4 =  a * w1 + c * h0 + tx;
    var y4 =  d * h0 + b * w1 + ty;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var minX = Infinity;
    var minY = Infinity;

    minX = x1 < minX ? x1 : minX;
    minX = x2 < minX ? x2 : minX;
    minX = x3 < minX ? x3 : minX;
    minX = x4 < minX ? x4 : minX;

    minY = y1 < minY ? y1 : minY;
    minY = y2 < minY ? y2 : minY;
    minY = y3 < minY ? y3 : minY;
    minY = y4 < minY ? y4 : minY;

    maxX = x1 > maxX ? x1 : maxX;
    maxX = x2 > maxX ? x2 : maxX;
    maxX = x3 > maxX ? x3 : maxX;
    maxX = x4 > maxX ? x4 : maxX;

    maxY = y1 > maxY ? y1 : maxY;
    maxY = y2 > maxY ? y2 : maxY;
    maxY = y3 > maxY ? y3 : maxY;
    maxY = y4 > maxY ? y4 : maxY;

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate
    this._currentBounds = bounds;

    return bounds;
};



/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */
PIXI.TilingSprite.prototype.onTextureUpdate = function()
{
   // overriding the sprite version of this!
};


/**
* 
* @method generateTilingTexture
* 
* @param forcePowerOfTwo {Boolean} Whether we want to force the texture to be a power of two
*/
PIXI.TilingSprite.prototype.generateTilingTexture = function(forcePowerOfTwo)
{
    if (!this.texture.baseTexture.hasLoaded) return;

    var texture = this.texture;
    var frame = texture.frame;
    var targetWidth, targetHeight;

    //  Check that the frame is the same size as the base texture.
    var isFrame = frame.width !== texture.baseTexture.width || frame.height !== texture.baseTexture.height;

    var newTextureRequired = false;

    if (!forcePowerOfTwo)
    {
        if (isFrame)
        {
            targetWidth = frame.width;
            targetHeight = frame.height;
           
            newTextureRequired = true;
        }
    }
    else
    {
        targetWidth = PIXI.getNextPowerOfTwo(frame.width);
        targetHeight = PIXI.getNextPowerOfTwo(frame.height);

        if (frame.width !== targetWidth || frame.height !== targetHeight) newTextureRequired = true;
    }

    if (newTextureRequired)
    {
        var canvasBuffer;

        if (this.tilingTexture && this.tilingTexture.isTiling)
        {
            canvasBuffer = this.tilingTexture.canvasBuffer;
            canvasBuffer.resize(targetWidth, targetHeight);
            this.tilingTexture.baseTexture.width = targetWidth;
            this.tilingTexture.baseTexture.height = targetHeight;
            this.tilingTexture.needsUpdate = true;
        }
        else
        {
            canvasBuffer = new PIXI.CanvasBuffer(targetWidth, targetHeight);

            this.tilingTexture = PIXI.Texture.fromCanvas(canvasBuffer.canvas);
            this.tilingTexture.canvasBuffer = canvasBuffer;
            this.tilingTexture.isTiling = true;
        }

        canvasBuffer.context.drawImage(texture.baseTexture.source,
                               texture.crop.x,
                               texture.crop.y,
                               texture.crop.width,
                               texture.crop.height,
                               0,
                               0,
                               targetWidth,
                               targetHeight);

        this.tileScaleOffset.x = frame.width / targetWidth;
        this.tileScaleOffset.y = frame.height / targetHeight;
    }
    else
    {
        //  TODO - switching?
        if (this.tilingTexture && this.tilingTexture.isTiling)
        {
            // destroy the tiling texture!
            // TODO could store this somewhere?
            this.tilingTexture.destroy(true);
        }

        this.tileScaleOffset.x = 1;
        this.tileScaleOffset.y = 1;
        this.tilingTexture = texture;
    }

    this.refreshTexture = false;
    this.tilingTexture.baseTexture._powerOf2 = true;
};
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * based on pixi impact spine implementation made by Eemeli Kelokorpi (@ekelokorpi) https://github.com/ekelokorpi
 *
 * Awesome JS run time provided by EsotericSoftware
 * https://github.com/EsotericSoftware/spine-runtimes
 *
 */

/*
 * Awesome JS run time provided by EsotericSoftware
 *
 * https://github.com/EsotericSoftware/spine-runtimes
 *
 */



var spine = {};

spine.BoneData = function (name, parent) {
    this.name = name;
    this.parent = parent;
};
spine.BoneData.prototype = {
    length: 0,
    x: 0, y: 0,
    rotation: 0,
    scaleX: 1, scaleY: 1
};

spine.SlotData = function (name, boneData) {
    this.name = name;
    this.boneData = boneData;
};
spine.SlotData.prototype = {
    r: 1, g: 1, b: 1, a: 1,
    attachmentName: null
};

spine.Bone = function (boneData, parent) {
    this.data = boneData;
    this.parent = parent;
    this.setToSetupPose();
};
spine.Bone.yDown = false;
spine.Bone.prototype = {
    x: 0, y: 0,
    rotation: 0,
    scaleX: 1, scaleY: 1,
    m00: 0, m01: 0, worldX: 0, // a b x
    m10: 0, m11: 0, worldY: 0, // c d y
    worldRotation: 0,
    worldScaleX: 1, worldScaleY: 1,
    updateWorldTransform: function (flipX, flipY) {
        var parent = this.parent;
        if (parent != null) {
            this.worldX = this.x * parent.m00 + this.y * parent.m01 + parent.worldX;
            this.worldY = this.x * parent.m10 + this.y * parent.m11 + parent.worldY;
            this.worldScaleX = parent.worldScaleX * this.scaleX;
            this.worldScaleY = parent.worldScaleY * this.scaleY;
            this.worldRotation = parent.worldRotation + this.rotation;
        } else {
            this.worldX = this.x;
            this.worldY = this.y;
            this.worldScaleX = this.scaleX;
            this.worldScaleY = this.scaleY;
            this.worldRotation = this.rotation;
        }
        var radians = this.worldRotation * Math.PI / 180;
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        this.m00 = cos * this.worldScaleX;
        this.m10 = sin * this.worldScaleX;
        this.m01 = -sin * this.worldScaleY;
        this.m11 = cos * this.worldScaleY;
        if (flipX) {
            this.m00 = -this.m00;
            this.m01 = -this.m01;
        }
        if (flipY) {
            this.m10 = -this.m10;
            this.m11 = -this.m11;
        }
        if (spine.Bone.yDown) {
            this.m10 = -this.m10;
            this.m11 = -this.m11;
        }
    },
    setToSetupPose: function () {
        var data = this.data;
        this.x = data.x;
        this.y = data.y;
        this.rotation = data.rotation;
        this.scaleX = data.scaleX;
        this.scaleY = data.scaleY;
    }
};

spine.Slot = function (slotData, skeleton, bone) {
    this.data = slotData;
    this.skeleton = skeleton;
    this.bone = bone;
    this.setToSetupPose();
};
spine.Slot.prototype = {
    r: 1, g: 1, b: 1, a: 1,
    _attachmentTime: 0,
    attachment: null,
    setAttachment: function (attachment) {
        this.attachment = attachment;
        this._attachmentTime = this.skeleton.time;
    },
    setAttachmentTime: function (time) {
        this._attachmentTime = this.skeleton.time - time;
    },
    getAttachmentTime: function () {
        return this.skeleton.time - this._attachmentTime;
    },
    setToSetupPose: function () {
        var data = this.data;
        this.r = data.r;
        this.g = data.g;
        this.b = data.b;
        this.a = data.a;

        var slotDatas = this.skeleton.data.slots;
        for (var i = 0, n = slotDatas.length; i < n; i++) {
            if (slotDatas[i] == data) {
                this.setAttachment(!data.attachmentName ? null : this.skeleton.getAttachmentBySlotIndex(i, data.attachmentName));
                break;
            }
        }
    }
};

spine.Skin = function (name) {
    this.name = name;
    this.attachments = {};
};
spine.Skin.prototype = {
    addAttachment: function (slotIndex, name, attachment) {
        this.attachments[slotIndex + ":" + name] = attachment;
    },
    getAttachment: function (slotIndex, name) {
        return this.attachments[slotIndex + ":" + name];
    },
    _attachAll: function (skeleton, oldSkin) {
        for (var key in oldSkin.attachments) {
            var colon = key.indexOf(":");
            var slotIndex = parseInt(key.substring(0, colon), 10);
            var name = key.substring(colon + 1);
            var slot = skeleton.slots[slotIndex];
            if (slot.attachment && slot.attachment.name == name) {
                var attachment = this.getAttachment(slotIndex, name);
                if (attachment) slot.setAttachment(attachment);
            }
        }
    }
};

spine.Animation = function (name, timelines, duration) {
    this.name = name;
    this.timelines = timelines;
    this.duration = duration;
};
spine.Animation.prototype = {
    apply: function (skeleton, time, loop) {
        if (loop && this.duration) time %= this.duration;
        var timelines = this.timelines;
        for (var i = 0, n = timelines.length; i < n; i++)
            timelines[i].apply(skeleton, time, 1);
    },
    mix: function (skeleton, time, loop, alpha) {
        if (loop && this.duration) time %= this.duration;
        var timelines = this.timelines;
        for (var i = 0, n = timelines.length; i < n; i++)
            timelines[i].apply(skeleton, time, alpha);
    }
};

spine.binarySearch = function (values, target, step) {
    var low = 0;
    var high = Math.floor(values.length / step) - 2;
    if (!high) return step;
    var current = high >>> 1;
    while (true) {
        if (values[(current + 1) * step] <= target)
            low = current + 1;
        else
            high = current;
        if (low == high) return (low + 1) * step;
        current = (low + high) >>> 1;
    }
};
spine.linearSearch = function (values, target, step) {
    for (var i = 0, last = values.length - step; i <= last; i += step)
        if (values[i] > target) return i;
    return -1;
};

spine.Curves = function (frameCount) {
    this.curves = []; // dfx, dfy, ddfx, ddfy, dddfx, dddfy, ...
    this.curves.length = (frameCount - 1) * 6;
};
spine.Curves.prototype = {
    setLinear: function (frameIndex) {
        this.curves[frameIndex * 6] = 0/*LINEAR*/;
    },
    setStepped: function (frameIndex) {
        this.curves[frameIndex * 6] = -1/*STEPPED*/;
    },
    /** Sets the control handle positions for an interpolation bezier curve used to transition from this keyframe to the next.
     * cx1 and cx2 are from 0 to 1, representing the percent of time between the two keyframes. cy1 and cy2 are the percent of
     * the difference between the keyframe's values. */
    setCurve: function (frameIndex, cx1, cy1, cx2, cy2) {
        var subdiv_step = 1 / 10/*BEZIER_SEGMENTS*/;
        var subdiv_step2 = subdiv_step * subdiv_step;
        var subdiv_step3 = subdiv_step2 * subdiv_step;
        var pre1 = 3 * subdiv_step;
        var pre2 = 3 * subdiv_step2;
        var pre4 = 6 * subdiv_step2;
        var pre5 = 6 * subdiv_step3;
        var tmp1x = -cx1 * 2 + cx2;
        var tmp1y = -cy1 * 2 + cy2;
        var tmp2x = (cx1 - cx2) * 3 + 1;
        var tmp2y = (cy1 - cy2) * 3 + 1;
        var i = frameIndex * 6;
        var curves = this.curves;
        curves[i] = cx1 * pre1 + tmp1x * pre2 + tmp2x * subdiv_step3;
        curves[i + 1] = cy1 * pre1 + tmp1y * pre2 + tmp2y * subdiv_step3;
        curves[i + 2] = tmp1x * pre4 + tmp2x * pre5;
        curves[i + 3] = tmp1y * pre4 + tmp2y * pre5;
        curves[i + 4] = tmp2x * pre5;
        curves[i + 5] = tmp2y * pre5;
    },
    getCurvePercent: function (frameIndex, percent) {
        percent = percent < 0 ? 0 : (percent > 1 ? 1 : percent);
        var curveIndex = frameIndex * 6;
        var curves = this.curves;
        var dfx = curves[curveIndex];
        if (!dfx/*LINEAR*/) return percent;
        if (dfx == -1/*STEPPED*/) return 0;
        var dfy = curves[curveIndex + 1];
        var ddfx = curves[curveIndex + 2];
        var ddfy = curves[curveIndex + 3];
        var dddfx = curves[curveIndex + 4];
        var dddfy = curves[curveIndex + 5];
        var x = dfx, y = dfy;
        var i = 10/*BEZIER_SEGMENTS*/ - 2;
        while (true) {
            if (x >= percent) {
                var lastX = x - dfx;
                var lastY = y - dfy;
                return lastY + (y - lastY) * (percent - lastX) / (x - lastX);
            }
            if (!i) break;
            i--;
            dfx += ddfx;
            dfy += ddfy;
            ddfx += dddfx;
            ddfy += dddfy;
            x += dfx;
            y += dfy;
        }
        return y + (1 - y) * (percent - x) / (1 - x); // Last point is 1,1.
    }
};

spine.RotateTimeline = function (frameCount) {
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, angle, ...
    this.frames.length = frameCount * 2;
};
spine.RotateTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 2;
    },
    setFrame: function (frameIndex, time, angle) {
        frameIndex *= 2;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = angle;
    },
    apply: function (skeleton, time, alpha) {
        var frames = this.frames,
            amount;

        if (time < frames[0]) return; // Time is before first frame.

        var bone = skeleton.bones[this.boneIndex];

        if (time >= frames[frames.length - 2]) { // Time is after last frame.
            amount = bone.data.rotation + frames[frames.length - 1] - bone.rotation;
            while (amount > 180)
                amount -= 360;
            while (amount < -180)
                amount += 360;
            bone.rotation += amount * alpha;
            return;
        }

        // Interpolate between the last frame and the current frame.
        var frameIndex = spine.binarySearch(frames, time, 2);
        var lastFrameValue = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex - 2/*LAST_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 2 - 1, percent);

        amount = frames[frameIndex + 1/*FRAME_VALUE*/] - lastFrameValue;
        while (amount > 180)
            amount -= 360;
        while (amount < -180)
            amount += 360;
        amount = bone.data.rotation + (lastFrameValue + amount * percent) - bone.rotation;
        while (amount > 180)
            amount -= 360;
        while (amount < -180)
            amount += 360;
        bone.rotation += amount * alpha;
    }
};

spine.TranslateTimeline = function (frameCount) {
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, x, y, ...
    this.frames.length = frameCount * 3;
};
spine.TranslateTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 3;
    },
    setFrame: function (frameIndex, time, x, y) {
        frameIndex *= 3;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = x;
        this.frames[frameIndex + 2] = y;
    },
    apply: function (skeleton, time, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var bone = skeleton.bones[this.boneIndex];

        if (time >= frames[frames.length - 3]) { // Time is after last frame.
            bone.x += (bone.data.x + frames[frames.length - 2] - bone.x) * alpha;
            bone.y += (bone.data.y + frames[frames.length - 1] - bone.y) * alpha;
            return;
        }

        // Interpolate between the last frame and the current frame.
        var frameIndex = spine.binarySearch(frames, time, 3);
        var lastFrameX = frames[frameIndex - 2];
        var lastFrameY = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex + -3/*LAST_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);

        bone.x += (bone.data.x + lastFrameX + (frames[frameIndex + 1/*FRAME_X*/] - lastFrameX) * percent - bone.x) * alpha;
        bone.y += (bone.data.y + lastFrameY + (frames[frameIndex + 2/*FRAME_Y*/] - lastFrameY) * percent - bone.y) * alpha;
    }
};

spine.ScaleTimeline = function (frameCount) {
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, x, y, ...
    this.frames.length = frameCount * 3;
};
spine.ScaleTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 3;
    },
    setFrame: function (frameIndex, time, x, y) {
        frameIndex *= 3;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = x;
        this.frames[frameIndex + 2] = y;
    },
    apply: function (skeleton, time, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var bone = skeleton.bones[this.boneIndex];

        if (time >= frames[frames.length - 3]) { // Time is after last frame.
            bone.scaleX += (bone.data.scaleX - 1 + frames[frames.length - 2] - bone.scaleX) * alpha;
            bone.scaleY += (bone.data.scaleY - 1 + frames[frames.length - 1] - bone.scaleY) * alpha;
            return;
        }

        // Interpolate between the last frame and the current frame.
        var frameIndex = spine.binarySearch(frames, time, 3);
        var lastFrameX = frames[frameIndex - 2];
        var lastFrameY = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex + -3/*LAST_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);

        bone.scaleX += (bone.data.scaleX - 1 + lastFrameX + (frames[frameIndex + 1/*FRAME_X*/] - lastFrameX) * percent - bone.scaleX) * alpha;
        bone.scaleY += (bone.data.scaleY - 1 + lastFrameY + (frames[frameIndex + 2/*FRAME_Y*/] - lastFrameY) * percent - bone.scaleY) * alpha;
    }
};

spine.ColorTimeline = function (frameCount) {
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, r, g, b, a, ...
    this.frames.length = frameCount * 5;
};
spine.ColorTimeline.prototype = {
    slotIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 5;
    },
    setFrame: function (frameIndex, time, r, g, b, a) {
        frameIndex *= 5;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = r;
        this.frames[frameIndex + 2] = g;
        this.frames[frameIndex + 3] = b;
        this.frames[frameIndex + 4] = a;
    },
    apply: function (skeleton, time, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var slot = skeleton.slots[this.slotIndex];

        if (time >= frames[frames.length - 5]) { // Time is after last frame.
            var i = frames.length - 1;
            slot.r = frames[i - 3];
            slot.g = frames[i - 2];
            slot.b = frames[i - 1];
            slot.a = frames[i];
            return;
        }

        // Interpolate between the last frame and the current frame.
        var frameIndex = spine.binarySearch(frames, time, 5);
        var lastFrameR = frames[frameIndex - 4];
        var lastFrameG = frames[frameIndex - 3];
        var lastFrameB = frames[frameIndex - 2];
        var lastFrameA = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex - 5/*LAST_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 5 - 1, percent);

        var r = lastFrameR + (frames[frameIndex + 1/*FRAME_R*/] - lastFrameR) * percent;
        var g = lastFrameG + (frames[frameIndex + 2/*FRAME_G*/] - lastFrameG) * percent;
        var b = lastFrameB + (frames[frameIndex + 3/*FRAME_B*/] - lastFrameB) * percent;
        var a = lastFrameA + (frames[frameIndex + 4/*FRAME_A*/] - lastFrameA) * percent;
        if (alpha < 1) {
            slot.r += (r - slot.r) * alpha;
            slot.g += (g - slot.g) * alpha;
            slot.b += (b - slot.b) * alpha;
            slot.a += (a - slot.a) * alpha;
        } else {
            slot.r = r;
            slot.g = g;
            slot.b = b;
            slot.a = a;
        }
    }
};

spine.AttachmentTimeline = function (frameCount) {
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, ...
    this.frames.length = frameCount;
    this.attachmentNames = []; // time, ...
    this.attachmentNames.length = frameCount;
};
spine.AttachmentTimeline.prototype = {
    slotIndex: 0,
    getFrameCount: function () {
            return this.frames.length;
    },
    setFrame: function (frameIndex, time, attachmentName) {
        this.frames[frameIndex] = time;
        this.attachmentNames[frameIndex] = attachmentName;
    },
    apply: function (skeleton, time, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var frameIndex;
        if (time >= frames[frames.length - 1]) // Time is after last frame.
            frameIndex = frames.length - 1;
        else
            frameIndex = spine.binarySearch(frames, time, 1) - 1;

        var attachmentName = this.attachmentNames[frameIndex];
        skeleton.slots[this.slotIndex].setAttachment(!attachmentName ? null : skeleton.getAttachmentBySlotIndex(this.slotIndex, attachmentName));
    }
};

spine.SkeletonData = function () {
    this.bones = [];
    this.slots = [];
    this.skins = [];
    this.animations = [];
};
spine.SkeletonData.prototype = {
    defaultSkin: null,
    /** @return May be null. */
    findBone: function (boneName) {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].name == boneName) return bones[i];
        return null;
    },
    /** @return -1 if the bone was not found. */
    findBoneIndex: function (boneName) {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].name == boneName) return i;
        return -1;
    },
    /** @return May be null. */
    findSlot: function (slotName) {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++) {
            if (slots[i].name == slotName) return slot[i];
        }
        return null;
    },
    /** @return -1 if the bone was not found. */
    findSlotIndex: function (slotName) {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            if (slots[i].name == slotName) return i;
        return -1;
    },
    /** @return May be null. */
    findSkin: function (skinName) {
        var skins = this.skins;
        for (var i = 0, n = skins.length; i < n; i++)
            if (skins[i].name == skinName) return skins[i];
        return null;
    },
    /** @return May be null. */
    findAnimation: function (animationName) {
        var animations = this.animations;
        for (var i = 0, n = animations.length; i < n; i++)
            if (animations[i].name == animationName) return animations[i];
        return null;
    }
};

spine.Skeleton = function (skeletonData) {
    this.data = skeletonData;

    this.bones = [];
    for (var i = 0, n = skeletonData.bones.length; i < n; i++) {
        var boneData = skeletonData.bones[i];
        var parent = !boneData.parent ? null : this.bones[skeletonData.bones.indexOf(boneData.parent)];
        this.bones.push(new spine.Bone(boneData, parent));
    }

    this.slots = [];
    this.drawOrder = [];
    for (i = 0, n = skeletonData.slots.length; i < n; i++) {
        var slotData = skeletonData.slots[i];
        var bone = this.bones[skeletonData.bones.indexOf(slotData.boneData)];
        var slot = new spine.Slot(slotData, this, bone);
        this.slots.push(slot);
        this.drawOrder.push(slot);
    }
};
spine.Skeleton.prototype = {
    x: 0, y: 0,
    skin: null,
    r: 1, g: 1, b: 1, a: 1,
    time: 0,
    flipX: false, flipY: false,
    /** Updates the world transform for each bone. */
    updateWorldTransform: function () {
        var flipX = this.flipX;
        var flipY = this.flipY;
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            bones[i].updateWorldTransform(flipX, flipY);
    },
    /** Sets the bones and slots to their setup pose values. */
    setToSetupPose: function () {
        this.setBonesToSetupPose();
        this.setSlotsToSetupPose();
    },
    setBonesToSetupPose: function () {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            bones[i].setToSetupPose();
    },
    setSlotsToSetupPose: function () {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            slots[i].setToSetupPose(i);
    },
    /** @return May return null. */
    getRootBone: function () {
        return this.bones.length ? this.bones[0] : null;
    },
    /** @return May be null. */
    findBone: function (boneName) {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].data.name == boneName) return bones[i];
        return null;
    },
    /** @return -1 if the bone was not found. */
    findBoneIndex: function (boneName) {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].data.name == boneName) return i;
        return -1;
    },
    /** @return May be null. */
    findSlot: function (slotName) {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            if (slots[i].data.name == slotName) return slots[i];
        return null;
    },
    /** @return -1 if the bone was not found. */
    findSlotIndex: function (slotName) {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            if (slots[i].data.name == slotName) return i;
        return -1;
    },
    setSkinByName: function (skinName) {
        var skin = this.data.findSkin(skinName);
        if (!skin) throw "Skin not found: " + skinName;
        this.setSkin(skin);
    },
    /** Sets the skin used to look up attachments not found in the {@link SkeletonData#getDefaultSkin() default skin}. Attachments
     * from the new skin are attached if the corresponding attachment from the old skin was attached.
     * @param newSkin May be null. */
    setSkin: function (newSkin) {
        if (this.skin && newSkin) newSkin._attachAll(this, this.skin);
        this.skin = newSkin;
    },
    /** @return May be null. */
    getAttachmentBySlotName: function (slotName, attachmentName) {
        return this.getAttachmentBySlotIndex(this.data.findSlotIndex(slotName), attachmentName);
    },
    /** @return May be null. */
    getAttachmentBySlotIndex: function (slotIndex, attachmentName) {
        if (this.skin) {
            var attachment = this.skin.getAttachment(slotIndex, attachmentName);
            if (attachment) return attachment;
        }
        if (this.data.defaultSkin) return this.data.defaultSkin.getAttachment(slotIndex, attachmentName);
        return null;
    },
    /** @param attachmentName May be null. */
    setAttachment: function (slotName, attachmentName) {
        var slots = this.slots;
        for (var i = 0, n = slots.size; i < n; i++) {
            var slot = slots[i];
            if (slot.data.name == slotName) {
                var attachment = null;
                if (attachmentName) {
                    attachment = this.getAttachment(i, attachmentName);
                    if (attachment == null) throw "Attachment not found: " + attachmentName + ", for slot: " + slotName;
                }
                slot.setAttachment(attachment);
                return;
            }
        }
        throw "Slot not found: " + slotName;
    },
    update: function (delta) {
        time += delta;
    }
};

spine.AttachmentType = {
    region: 0
};

spine.RegionAttachment = function () {
    this.offset = [];
    this.offset.length = 8;
    this.uvs = [];
    this.uvs.length = 8;
};
spine.RegionAttachment.prototype = {
    x: 0, y: 0,
    rotation: 0,
    scaleX: 1, scaleY: 1,
    width: 0, height: 0,
    rendererObject: null,
    regionOffsetX: 0, regionOffsetY: 0,
    regionWidth: 0, regionHeight: 0,
    regionOriginalWidth: 0, regionOriginalHeight: 0,
    setUVs: function (u, v, u2, v2, rotate) {
        var uvs = this.uvs;
        if (rotate) {
            uvs[2/*X2*/] = u;
            uvs[3/*Y2*/] = v2;
            uvs[4/*X3*/] = u;
            uvs[5/*Y3*/] = v;
            uvs[6/*X4*/] = u2;
            uvs[7/*Y4*/] = v;
            uvs[0/*X1*/] = u2;
            uvs[1/*Y1*/] = v2;
        } else {
            uvs[0/*X1*/] = u;
            uvs[1/*Y1*/] = v2;
            uvs[2/*X2*/] = u;
            uvs[3/*Y2*/] = v;
            uvs[4/*X3*/] = u2;
            uvs[5/*Y3*/] = v;
            uvs[6/*X4*/] = u2;
            uvs[7/*Y4*/] = v2;
        }
    },
    updateOffset: function () {
        var regionScaleX = this.width / this.regionOriginalWidth * this.scaleX;
        var regionScaleY = this.height / this.regionOriginalHeight * this.scaleY;
        var localX = -this.width / 2 * this.scaleX + this.regionOffsetX * regionScaleX;
        var localY = -this.height / 2 * this.scaleY + this.regionOffsetY * regionScaleY;
        var localX2 = localX + this.regionWidth * regionScaleX;
        var localY2 = localY + this.regionHeight * regionScaleY;
        var radians = this.rotation * Math.PI / 180;
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var localXCos = localX * cos + this.x;
        var localXSin = localX * sin;
        var localYCos = localY * cos + this.y;
        var localYSin = localY * sin;
        var localX2Cos = localX2 * cos + this.x;
        var localX2Sin = localX2 * sin;
        var localY2Cos = localY2 * cos + this.y;
        var localY2Sin = localY2 * sin;
        var offset = this.offset;
        offset[0/*X1*/] = localXCos - localYSin;
        offset[1/*Y1*/] = localYCos + localXSin;
        offset[2/*X2*/] = localXCos - localY2Sin;
        offset[3/*Y2*/] = localY2Cos + localXSin;
        offset[4/*X3*/] = localX2Cos - localY2Sin;
        offset[5/*Y3*/] = localY2Cos + localX2Sin;
        offset[6/*X4*/] = localX2Cos - localYSin;
        offset[7/*Y4*/] = localYCos + localX2Sin;
    },
    computeVertices: function (x, y, bone, vertices) {
        x += bone.worldX;
        y += bone.worldY;
        var m00 = bone.m00;
        var m01 = bone.m01;
        var m10 = bone.m10;
        var m11 = bone.m11;
        var offset = this.offset;
        vertices[0/*X1*/] = offset[0/*X1*/] * m00 + offset[1/*Y1*/] * m01 + x;
        vertices[1/*Y1*/] = offset[0/*X1*/] * m10 + offset[1/*Y1*/] * m11 + y;
        vertices[2/*X2*/] = offset[2/*X2*/] * m00 + offset[3/*Y2*/] * m01 + x;
        vertices[3/*Y2*/] = offset[2/*X2*/] * m10 + offset[3/*Y2*/] * m11 + y;
        vertices[4/*X3*/] = offset[4/*X3*/] * m00 + offset[5/*X3*/] * m01 + x;
        vertices[5/*X3*/] = offset[4/*X3*/] * m10 + offset[5/*X3*/] * m11 + y;
        vertices[6/*X4*/] = offset[6/*X4*/] * m00 + offset[7/*Y4*/] * m01 + x;
        vertices[7/*Y4*/] = offset[6/*X4*/] * m10 + offset[7/*Y4*/] * m11 + y;
    }
}

spine.AnimationStateData = function (skeletonData) {
    this.skeletonData = skeletonData;
    this.animationToMixTime = {};
};
spine.AnimationStateData.prototype = {
        defaultMix: 0,
    setMixByName: function (fromName, toName, duration) {
        var from = this.skeletonData.findAnimation(fromName);
        if (!from) throw "Animation not found: " + fromName;
        var to = this.skeletonData.findAnimation(toName);
        if (!to) throw "Animation not found: " + toName;
        this.setMix(from, to, duration);
    },
    setMix: function (from, to, duration) {
        this.animationToMixTime[from.name + ":" + to.name] = duration;
    },
    getMix: function (from, to) {
        var time = this.animationToMixTime[from.name + ":" + to.name];
            return time ? time : this.defaultMix;
    }
};

spine.AnimationState = function (stateData) {
    this.data = stateData;
    this.queue = [];
};
spine.AnimationState.prototype = {
    animationSpeed: 1,
    current: null,
    previous: null,
    currentTime: 0,
    previousTime: 0,
    currentLoop: false,
    previousLoop: false,
    mixTime: 0,
    mixDuration: 0,
    update: function (delta) {
        this.currentTime += (delta * this.animationSpeed); //timeScale: Multiply delta by the speed of animation required.
        this.previousTime += delta;
        this.mixTime += delta;

        if (this.queue.length > 0) {
            var entry = this.queue[0];
            if (this.currentTime >= entry.delay) {
                this._setAnimation(entry.animation, entry.loop);
                this.queue.shift();
            }
        }
    },
    apply: function (skeleton) {
        if (!this.current) return;
        if (this.previous) {
            this.previous.apply(skeleton, this.previousTime, this.previousLoop);
            var alpha = this.mixTime / this.mixDuration;
            if (alpha >= 1) {
                alpha = 1;
                this.previous = null;
            }
            this.current.mix(skeleton, this.currentTime, this.currentLoop, alpha);
        } else
            this.current.apply(skeleton, this.currentTime, this.currentLoop);
    },
    clearAnimation: function () {
        this.previous = null;
        this.current = null;
        this.queue.length = 0;
    },
    _setAnimation: function (animation, loop) {
        this.previous = null;
        if (animation && this.current) {
            this.mixDuration = this.data.getMix(this.current, animation);
            if (this.mixDuration > 0) {
                this.mixTime = 0;
                this.previous = this.current;
                this.previousTime = this.currentTime;
                this.previousLoop = this.currentLoop;
            }
        }
        this.current = animation;
        this.currentLoop = loop;
        this.currentTime = 0;
    },
    /** @see #setAnimation(Animation, Boolean) */
    setAnimationByName: function (animationName, loop) {
        var animation = this.data.skeletonData.findAnimation(animationName);
        if (!animation) throw "Animation not found: " + animationName;
        this.setAnimation(animation, loop);
    },
    /** Set the current animation. Any queued animations are cleared and the current animation time is set to 0.
     * @param animation May be null. */
    setAnimation: function (animation, loop) {
        this.queue.length = 0;
        this._setAnimation(animation, loop);
    },
    /** @see #addAnimation(Animation, Boolean, Number) */
    addAnimationByName: function (animationName, loop, delay) {
        var animation = this.data.skeletonData.findAnimation(animationName);
        if (!animation) throw "Animation not found: " + animationName;
        this.addAnimation(animation, loop, delay);
    },
    /** Adds an animation to be played delay seconds after the current or last queued animation.
     * @param delay May be <= 0 to use duration of previous animation minus any mix duration plus the negative delay. */
    addAnimation: function (animation, loop, delay) {
        var entry = {};
        entry.animation = animation;
        entry.loop = loop;

        if (!delay || delay <= 0) {
            var previousAnimation = this.queue.length ? this.queue[this.queue.length - 1].animation : this.current;
            if (previousAnimation != null)
                delay = previousAnimation.duration - this.data.getMix(previousAnimation, animation) + (delay || 0);
            else
                delay = 0;
        }
        entry.delay = delay;

        this.queue.push(entry);
    },
    /** Returns true if no animation is set or if the current time is greater than the animation duration, regardless of looping. */
    isComplete: function () {
        return !this.current || this.currentTime >= this.current.duration;
    }
};

spine.SkeletonJson = function (attachmentLoader) {
    this.attachmentLoader = attachmentLoader;
};
spine.SkeletonJson.prototype = {
    scale: 1,
    readSkeletonData: function (root) {
        /*jshint -W069*/
        var skeletonData = new spine.SkeletonData(),
            boneData;

        // Bones.
        var bones = root["bones"];
        for (var i = 0, n = bones.length; i < n; i++) {
            var boneMap = bones[i];
            var parent = null;
            if (boneMap["parent"]) {
                parent = skeletonData.findBone(boneMap["parent"]);
                if (!parent) throw "Parent bone not found: " + boneMap["parent"];
            }
            boneData = new spine.BoneData(boneMap["name"], parent);
            boneData.length = (boneMap["length"] || 0) * this.scale;
            boneData.x = (boneMap["x"] || 0) * this.scale;
            boneData.y = (boneMap["y"] || 0) * this.scale;
            boneData.rotation = (boneMap["rotation"] || 0);
            boneData.scaleX = boneMap["scaleX"] || 1;
            boneData.scaleY = boneMap["scaleY"] || 1;
            skeletonData.bones.push(boneData);
        }

        // Slots.
        var slots = root["slots"];
        for (i = 0, n = slots.length; i < n; i++) {
            var slotMap = slots[i];
            boneData = skeletonData.findBone(slotMap["bone"]);
            if (!boneData) throw "Slot bone not found: " + slotMap["bone"];
            var slotData = new spine.SlotData(slotMap["name"], boneData);

            var color = slotMap["color"];
            if (color) {
                slotData.r = spine.SkeletonJson.toColor(color, 0);
                slotData.g = spine.SkeletonJson.toColor(color, 1);
                slotData.b = spine.SkeletonJson.toColor(color, 2);
                slotData.a = spine.SkeletonJson.toColor(color, 3);
            }

            slotData.attachmentName = slotMap["attachment"];

            skeletonData.slots.push(slotData);
        }

        // Skins.
        var skins = root["skins"];
        for (var skinName in skins) {
            if (!skins.hasOwnProperty(skinName)) continue;
            var skinMap = skins[skinName];
            var skin = new spine.Skin(skinName);
            for (var slotName in skinMap) {
                if (!skinMap.hasOwnProperty(slotName)) continue;
                var slotIndex = skeletonData.findSlotIndex(slotName);
                var slotEntry = skinMap[slotName];
                for (var attachmentName in slotEntry) {
                    if (!slotEntry.hasOwnProperty(attachmentName)) continue;
                    var attachment = this.readAttachment(skin, attachmentName, slotEntry[attachmentName]);
                    if (attachment != null) skin.addAttachment(slotIndex, attachmentName, attachment);
                }
            }
            skeletonData.skins.push(skin);
            if (skin.name == "default") skeletonData.defaultSkin = skin;
        }

        // Animations.
        var animations = root["animations"];
        for (var animationName in animations) {
            if (!animations.hasOwnProperty(animationName)) continue;
            this.readAnimation(animationName, animations[animationName], skeletonData);
        }

        return skeletonData;
    },
    readAttachment: function (skin, name, map) {
        /*jshint -W069*/
        name = map["name"] || name;

        var type = spine.AttachmentType[map["type"] || "region"];

        if (type == spine.AttachmentType.region) {
            var attachment = new spine.RegionAttachment();
            attachment.x = (map["x"] || 0) * this.scale;
            attachment.y = (map["y"] || 0) * this.scale;
            attachment.scaleX = map["scaleX"] || 1;
            attachment.scaleY = map["scaleY"] || 1;
            attachment.rotation = map["rotation"] || 0;
            attachment.width = (map["width"] || 32) * this.scale;
            attachment.height = (map["height"] || 32) * this.scale;
            attachment.updateOffset();

            attachment.rendererObject = {};
            attachment.rendererObject.name = name;
            attachment.rendererObject.scale = {};
            attachment.rendererObject.scale.x = attachment.scaleX;
            attachment.rendererObject.scale.y = attachment.scaleY;
            attachment.rendererObject.rotation = -attachment.rotation * Math.PI / 180;
            return attachment;
        }

            throw "Unknown attachment type: " + type;
    },

    readAnimation: function (name, map, skeletonData) {
        /*jshint -W069*/
        var timelines = [];
        var duration = 0;
        var frameIndex, timeline, timelineName, valueMap, values,
            i, n;

        var bones = map["bones"];
        for (var boneName in bones) {
            if (!bones.hasOwnProperty(boneName)) continue;
            var boneIndex = skeletonData.findBoneIndex(boneName);
            if (boneIndex == -1) throw "Bone not found: " + boneName;
            var boneMap = bones[boneName];

            for (timelineName in boneMap) {
                if (!boneMap.hasOwnProperty(timelineName)) continue;
                values = boneMap[timelineName];
                if (timelineName == "rotate") {
                    timeline = new spine.RotateTimeline(values.length);
                    timeline.boneIndex = boneIndex;

                    frameIndex = 0;
                    for (i = 0, n = values.length; i < n; i++) {
                        valueMap = values[i];
                        timeline.setFrame(frameIndex, valueMap["time"], valueMap["angle"]);
                        spine.SkeletonJson.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 2 - 2]);

                } else if (timelineName == "translate" || timelineName == "scale") {
                    var timelineScale = 1;
                    if (timelineName == "scale")
                        timeline = new spine.ScaleTimeline(values.length);
                    else {
                        timeline = new spine.TranslateTimeline(values.length);
                        timelineScale = this.scale;
                    }
                    timeline.boneIndex = boneIndex;

                    frameIndex = 0;
                    for (i = 0, n = values.length; i < n; i++) {
                        valueMap = values[i];
                        var x = (valueMap["x"] || 0) * timelineScale;
                        var y = (valueMap["y"] || 0) * timelineScale;
                        timeline.setFrame(frameIndex, valueMap["time"], x, y);
                        spine.SkeletonJson.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 3 - 3]);

                } else
                    throw "Invalid timeline type for a bone: " + timelineName + " (" + boneName + ")";
            }
        }
        var slots = map["slots"];
        for (var slotName in slots) {
            if (!slots.hasOwnProperty(slotName)) continue;
            var slotMap = slots[slotName];
            var slotIndex = skeletonData.findSlotIndex(slotName);

            for (timelineName in slotMap) {
                if (!slotMap.hasOwnProperty(timelineName)) continue;
                values = slotMap[timelineName];
                if (timelineName == "color") {
                    timeline = new spine.ColorTimeline(values.length);
                    timeline.slotIndex = slotIndex;

                    frameIndex = 0;
                    for (i = 0, n = values.length; i < n; i++) {
                        valueMap = values[i];
                        var color = valueMap["color"];
                        var r = spine.SkeletonJson.toColor(color, 0);
                        var g = spine.SkeletonJson.toColor(color, 1);
                        var b = spine.SkeletonJson.toColor(color, 2);
                        var a = spine.SkeletonJson.toColor(color, 3);
                        timeline.setFrame(frameIndex, valueMap["time"], r, g, b, a);
                        spine.SkeletonJson.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 5 - 5]);

                } else if (timelineName == "attachment") {
                    timeline = new spine.AttachmentTimeline(values.length);
                    timeline.slotIndex = slotIndex;

                    frameIndex = 0;
                    for (i = 0, n = values.length; i < n; i++) {
                        valueMap = values[i];
                        timeline.setFrame(frameIndex++, valueMap["time"], valueMap["name"]);
                    }
                    timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);

                } else
                    throw "Invalid timeline type for a slot: " + timelineName + " (" + slotName + ")";
            }
        }
        skeletonData.animations.push(new spine.Animation(name, timelines, duration));
    }
};
spine.SkeletonJson.readCurve = function (timeline, frameIndex, valueMap) {
    /*jshint -W069*/
    var curve = valueMap["curve"];
    if (!curve) return;
    if (curve == "stepped")
        timeline.curves.setStepped(frameIndex);
    else if (curve instanceof Array)
        timeline.curves.setCurve(frameIndex, curve[0], curve[1], curve[2], curve[3]);
};
spine.SkeletonJson.toColor = function (hexString, colorIndex) {
    if (hexString.length != 8) throw "Color hexidecimal length must be 8, recieved: " + hexString;
    return parseInt(hexString.substr(colorIndex * 2, 2), 16) / 255;
};

spine.Atlas = function (atlasText, textureLoader) {
    this.textureLoader = textureLoader;
    this.pages = [];
    this.regions = [];

    var reader = new spine.AtlasReader(atlasText);
    var tuple = [];
    tuple.length = 4;
    var page = null;
    while (true) {
        var line = reader.readLine();
        if (line == null) break;
        line = reader.trim(line);
        if (!line.length)
            page = null;
        else if (!page) {
            page = new spine.AtlasPage();
            page.name = line;

            page.format = spine.Atlas.Format[reader.readValue()];

            reader.readTuple(tuple);
            page.minFilter = spine.Atlas.TextureFilter[tuple[0]];
            page.magFilter = spine.Atlas.TextureFilter[tuple[1]];

            var direction = reader.readValue();
            page.uWrap = spine.Atlas.TextureWrap.clampToEdge;
            page.vWrap = spine.Atlas.TextureWrap.clampToEdge;
            if (direction == "x")
                page.uWrap = spine.Atlas.TextureWrap.repeat;
            else if (direction == "y")
                page.vWrap = spine.Atlas.TextureWrap.repeat;
            else if (direction == "xy")
                page.uWrap = page.vWrap = spine.Atlas.TextureWrap.repeat;

            textureLoader.load(page, line);

            this.pages.push(page);

        } else {
            var region = new spine.AtlasRegion();
            region.name = line;
            region.page = page;

            region.rotate = reader.readValue() == "true";

            reader.readTuple(tuple);
            var x = parseInt(tuple[0], 10);
            var y = parseInt(tuple[1], 10);

            reader.readTuple(tuple);
            var width = parseInt(tuple[0], 10);
            var height = parseInt(tuple[1], 10);

            region.u = x / page.width;
            region.v = y / page.height;
            if (region.rotate) {
                region.u2 = (x + height) / page.width;
                region.v2 = (y + width) / page.height;
            } else {
                region.u2 = (x + width) / page.width;
                region.v2 = (y + height) / page.height;
            }
            region.x = x;
            region.y = y;
            region.width = Math.abs(width);
            region.height = Math.abs(height);

            if (reader.readTuple(tuple) == 4) { // split is optional
                region.splits = [parseInt(tuple[0], 10), parseInt(tuple[1], 10), parseInt(tuple[2], 10), parseInt(tuple[3], 10)];

                if (reader.readTuple(tuple) == 4) { // pad is optional, but only present with splits
                    region.pads = [parseInt(tuple[0], 10), parseInt(tuple[1], 10), parseInt(tuple[2], 10), parseInt(tuple[3], 10)];

                    reader.readTuple(tuple);
                }
            }

            region.originalWidth = parseInt(tuple[0], 10);
            region.originalHeight = parseInt(tuple[1], 10);

            reader.readTuple(tuple);
            region.offsetX = parseInt(tuple[0], 10);
            region.offsetY = parseInt(tuple[1], 10);

            region.index = parseInt(reader.readValue(), 10);

            this.regions.push(region);
        }
    }
};
spine.Atlas.prototype = {
    findRegion: function (name) {
        var regions = this.regions;
        for (var i = 0, n = regions.length; i < n; i++)
            if (regions[i].name == name) return regions[i];
        return null;
    },
    dispose: function () {
        var pages = this.pages;
        for (var i = 0, n = pages.length; i < n; i++)
            this.textureLoader.unload(pages[i].rendererObject);
    },
    updateUVs: function (page) {
        var regions = this.regions;
        for (var i = 0, n = regions.length; i < n; i++) {
            var region = regions[i];
            if (region.page != page) continue;
            region.u = region.x / page.width;
            region.v = region.y / page.height;
            if (region.rotate) {
                region.u2 = (region.x + region.height) / page.width;
                region.v2 = (region.y + region.width) / page.height;
            } else {
                region.u2 = (region.x + region.width) / page.width;
                region.v2 = (region.y + region.height) / page.height;
            }
        }
    }
};

spine.Atlas.Format = {
    alpha: 0,
    intensity: 1,
    luminanceAlpha: 2,
    rgb565: 3,
    rgba4444: 4,
    rgb888: 5,
    rgba8888: 6
};

spine.Atlas.TextureFilter = {
    nearest: 0,
    linear: 1,
    mipMap: 2,
    mipMapNearestNearest: 3,
    mipMapLinearNearest: 4,
    mipMapNearestLinear: 5,
    mipMapLinearLinear: 6
};

spine.Atlas.TextureWrap = {
    mirroredRepeat: 0,
    clampToEdge: 1,
    repeat: 2
};

spine.AtlasPage = function () {};
spine.AtlasPage.prototype = {
    name: null,
    format: null,
    minFilter: null,
    magFilter: null,
    uWrap: null,
    vWrap: null,
    rendererObject: null,
    width: 0,
    height: 0
};

spine.AtlasRegion = function () {};
spine.AtlasRegion.prototype = {
    page: null,
    name: null,
    x: 0, y: 0,
    width: 0, height: 0,
    u: 0, v: 0, u2: 0, v2: 0,
    offsetX: 0, offsetY: 0,
    originalWidth: 0, originalHeight: 0,
    index: 0,
    rotate: false,
    splits: null,
    pads: null
};

spine.AtlasReader = function (text) {
    this.lines = text.split(/\r\n|\r|\n/);
};
spine.AtlasReader.prototype = {
    index: 0,
    trim: function (value) {
        return value.replace(/^\s+|\s+$/g, "");
    },
    readLine: function () {
        if (this.index >= this.lines.length) return null;
        return this.lines[this.index++];
    },
    readValue: function () {
        var line = this.readLine();
        var colon = line.indexOf(":");
        if (colon == -1) throw "Invalid line: " + line;
        return this.trim(line.substring(colon + 1));
    },
    /** Returns the number of tuple values read (2 or 4). */
    readTuple: function (tuple) {
        var line = this.readLine();
        var colon = line.indexOf(":");
        if (colon == -1) throw "Invalid line: " + line;
        var i = 0, lastMatch= colon + 1;
        for (; i < 3; i++) {
            var comma = line.indexOf(",", lastMatch);
            if (comma == -1) {
                if (!i) throw "Invalid line: " + line;
                break;
            }
            tuple[i] = this.trim(line.substr(lastMatch, comma - lastMatch));
            lastMatch = comma + 1;
        }
        tuple[i] = this.trim(line.substring(lastMatch));
        return i + 1;
    }
}

spine.AtlasAttachmentLoader = function (atlas) {
    this.atlas = atlas;
}
spine.AtlasAttachmentLoader.prototype = {
    newAttachment: function (skin, type, name) {
        switch (type) {
        case spine.AttachmentType.region:
            var region = this.atlas.findRegion(name);
            if (!region) throw "Region not found in atlas: " + name + " (" + type + ")";
            var attachment = new spine.RegionAttachment(name);
            attachment.rendererObject = region;
            attachment.setUVs(region.u, region.v, region.u2, region.v2, region.rotate);
            attachment.regionOffsetX = region.offsetX;
            attachment.regionOffsetY = region.offsetY;
            attachment.regionWidth = region.width;
            attachment.regionHeight = region.height;
            attachment.regionOriginalWidth = region.originalWidth;
            attachment.regionOriginalHeight = region.originalHeight;
            return attachment;
        }
        throw "Unknown attachment type: " + type;
    }
}

spine.Bone.yDown = true;
PIXI.AnimCache = {};

/**
 * A class that enables the you to import and run your spine animations in pixi.
 * Spine animation data needs to be loaded using the PIXI.AssetLoader or PIXI.SpineLoader before it can be used by this class
 * See example 12 (http://www.goodboydigital.com/pixijs/examples/12/) to see a working example and check out the source
 *
 * @class Spine
 * @extends DisplayObjectContainer
 * @constructor
 * @param url {String} The url of the spine anim file to be used
 */
PIXI.Spine = function (url) {
    PIXI.DisplayObjectContainer.call(this);

    this.spineData = PIXI.AnimCache[url];

    if (!this.spineData) {
        throw new Error("Spine data must be preloaded using PIXI.SpineLoader or PIXI.AssetLoader: " + url);
    }

    this.skeleton = new spine.Skeleton(this.spineData);
    this.skeleton.updateWorldTransform();

    this.stateData = new spine.AnimationStateData(this.spineData);
    this.state = new spine.AnimationState(this.stateData);

    this.slotContainers = [];

    for (var i = 0, n = this.skeleton.drawOrder.length; i < n; i++) {
        var slot = this.skeleton.drawOrder[i];
        var attachment = slot.attachment;
        var slotContainer = new PIXI.DisplayObjectContainer();
        this.slotContainers.push(slotContainer);
        this.addChild(slotContainer);
        if (!(attachment instanceof spine.RegionAttachment)) {
            continue;
        }
        var spriteName = attachment.rendererObject.name;
        var sprite = this.createSprite(slot, attachment.rendererObject);
        slot.currentSprite = sprite;
        slot.currentSpriteName = spriteName;
        slotContainer.addChild(sprite);
    }
};

PIXI.Spine.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.Spine.prototype.constructor = PIXI.Spine;

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.Spine.prototype.updateTransform = function () {
    this.lastTime = this.lastTime || Date.now();
    var timeDelta = (Date.now() - this.lastTime) * 0.001;
    this.lastTime = Date.now();
    this.state.update(timeDelta);
    this.state.apply(this.skeleton);
    this.skeleton.updateWorldTransform();

    var drawOrder = this.skeleton.drawOrder;
    for (var i = 0, n = drawOrder.length; i < n; i++) {
        var slot = drawOrder[i];
        var attachment = slot.attachment;
        var slotContainer = this.slotContainers[i];
        if (!(attachment instanceof spine.RegionAttachment)) {
            slotContainer.visible = false;
            continue;
        }

        if (attachment.rendererObject) {
            if (!slot.currentSpriteName || slot.currentSpriteName != attachment.name) {
                var spriteName = attachment.rendererObject.name;
                if (slot.currentSprite !== undefined) {
                    slot.currentSprite.visible = false;
                }
                slot.sprites = slot.sprites || {};
                if (slot.sprites[spriteName] !== undefined) {
                    slot.sprites[spriteName].visible = true;
                } else {
                    var sprite = this.createSprite(slot, attachment.rendererObject);
                    slotContainer.addChild(sprite);
                }
                slot.currentSprite = slot.sprites[spriteName];
                slot.currentSpriteName = spriteName;
            }
        }
        slotContainer.visible = true;

        var bone = slot.bone;

        slotContainer.position.x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;
        slotContainer.position.y = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11;
        slotContainer.scale.x = bone.worldScaleX;
        slotContainer.scale.y = bone.worldScaleY;

        slotContainer.rotation = -(slot.bone.worldRotation * Math.PI / 180);

        slotContainer.alpha = slot.a;
        slot.currentSprite.tint = PIXI.rgb2hex([slot.r,slot.g,slot.b]);
    }

    PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
};


PIXI.Spine.prototype.createSprite = function (slot, descriptor) {
    var name = PIXI.TextureCache[descriptor.name] ? descriptor.name : descriptor.name + ".png";
    var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(name));
    sprite.scale = descriptor.scale;
    sprite.rotation = descriptor.rotation;
    sprite.anchor.x = sprite.anchor.y = 0.5;

    slot.sprites = slot.sprites || {};
    slot.sprites[descriptor.name] = sprite;
    return sprite;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.BaseTextureCache = {};
PIXI.texturesToUpdate = [];
PIXI.texturesToDestroy = [];

PIXI.BaseTextureCacheIdGenerator = 0;

/**
 * A texture stores the information that represents an image. All textures have a base texture
 *
 * @class BaseTexture
 * @uses EventTarget
 * @constructor
 * @param source {String} the source object (image or canvas)
 * @param scaleMode {Number} Should be one of the PIXI.scaleMode consts
 */
PIXI.BaseTexture = function(source, scaleMode)
{
    PIXI.EventTarget.call( this );

    /**
     * [read-only] The width of the base texture set when the image has loaded
     *
     * @property width
     * @type Number
     * @readOnly
     */
    this.width = 100;

    /**
     * [read-only] The height of the base texture set when the image has loaded
     *
     * @property height
     * @type Number
     * @readOnly
     */
    this.height = 100;

    /**
     * The scale mode to apply when scaling this texture
     * @property scaleMode
     * @type PIXI.scaleModes
     * @default PIXI.scaleModes.LINEAR
     */
    this.scaleMode = scaleMode || PIXI.scaleModes.DEFAULT;

    /**
     * [read-only] Describes if the base texture has loaded or not
     *
     * @property hasLoaded
     * @type Boolean
     * @readOnly
     */
    this.hasLoaded = false;

    /**
     * The source that is loaded to create the texture
     *
     * @property source
     * @type Image
     */
    this.source = source;

    //TODO will be used for futer pixi 1.5...
    this.id = PIXI.BaseTextureCacheIdGenerator++;

    /**
     * Controls if RGB channels should be premultiplied by Alpha  (WebGL only)
     *
     * @property
     * @type Boolean
     * @default TRUE
    */
    this.premultipliedAlpha = true;

    // used for webGL
    this._glTextures = [];
    
    // used for webGL teture updateing...
    this._dirty = [];
    
    if(!source)return;

    if((this.source.complete || this.source.getContext) && this.source.width && this.source.height)
    {
        this.hasLoaded = true;
        this.width = this.source.width;
        this.height = this.source.height;

        PIXI.texturesToUpdate.push(this);
    }
    else
    {

        var scope = this;
        this.source.onload = function() {

            scope.hasLoaded = true;
            scope.width = scope.source.width;
            scope.height = scope.source.height;

            for (var i = 0; i < scope._glTextures.length; i++)
            {
                scope._dirty[i] = true;
            }

            // add it to somewhere...
            scope.dispatchEvent( { type: 'loaded', content: scope } );
        };
        this.source.onerror = function() {
            scope.dispatchEvent( { type: 'error', content: scope } );
        };
    }

    this.imageUrl = null;
    this._powerOf2 = false;

    

};

PIXI.BaseTexture.prototype.constructor = PIXI.BaseTexture;

/**
 * Destroys this base texture
 *
 * @method destroy
 */
PIXI.BaseTexture.prototype.destroy = function()
{
    if(this.imageUrl)
    {
        delete PIXI.BaseTextureCache[this.imageUrl];
        delete PIXI.TextureCache[this.imageUrl];
        this.imageUrl = null;
        this.source.src = null;
    }
    else if (this.source && this.source._pixiId)
    {
        delete PIXI.BaseTextureCache[this.source._pixiId];
    }
    this.source = null;
    PIXI.texturesToDestroy.push(this);
};

/**
 * Changes the source image of the texture
 *
 * @method updateSourceImage
 * @param newSrc {String} the path of the image
 */
PIXI.BaseTexture.prototype.updateSourceImage = function(newSrc)
{
    this.hasLoaded = false;
    this.source.src = null;
    this.source.src = newSrc;
};

/**
 * Helper function that returns a base texture based on an image url
 * If the image is not in the base texture cache it will be created and loaded
 *
 * @static
 * @method fromImage
 * @param imageUrl {String} The image url of the texture
 * @param crossorigin {Boolean} 
 * @param scaleMode {Number} Should be one of the PIXI.scaleMode consts
 * @return BaseTexture
 */
PIXI.BaseTexture.fromImage = function(imageUrl, crossorigin, scaleMode)
{
    var baseTexture = PIXI.BaseTextureCache[imageUrl];
    
    if(crossorigin === undefined && imageUrl.indexOf('data:') === -1) crossorigin = true;

    if(!baseTexture)
    {
        // new Image() breaks tex loading in some versions of Chrome.
        // See https://code.google.com/p/chromium/issues/detail?id=238071
        var image = new Image();//document.createElement('img');
        if (crossorigin)
        {
            image.crossOrigin = '';
        }
        image.src = imageUrl;
        baseTexture = new PIXI.BaseTexture(image, scaleMode);
        baseTexture.imageUrl = imageUrl;
        PIXI.BaseTextureCache[imageUrl] = baseTexture;
    }

    return baseTexture;
};

/**
 * Helper function that returns a base texture based on a canvas element
 * If the image is not in the base texture cache it will be created and loaded
 *
 * @static
 * @method fromCanvas
 * @param canvas {Canvas} The canvas element source of the texture
 * @param scaleMode {Number} Should be one of the PIXI.scaleMode consts
 * @return BaseTexture
 */
PIXI.BaseTexture.fromCanvas = function(canvas, scaleMode)
{
    if(!canvas._pixiId)
    {
        canvas._pixiId = 'canvas_' + PIXI.TextureCacheIdGenerator++;
    }

    var baseTexture = PIXI.BaseTextureCache[canvas._pixiId];

    if(!baseTexture)
    {
        baseTexture = new PIXI.BaseTexture(canvas, scaleMode);
        PIXI.BaseTextureCache[canvas._pixiId] = baseTexture;
    }

    return baseTexture;
};



/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.TextureCache = {};
PIXI.FrameCache = {};

PIXI.TextureCacheIdGenerator = 0;

/**
 * A texture stores the information that represents an image or part of an image. It cannot be added
 * to the display list directly. To do this use PIXI.Sprite. If no frame is provided then the whole image is used
 *
 * @class Texture
 * @uses EventTarget
 * @constructor
 * @param baseTexture {BaseTexture} The base texture source to create the texture from
 * @param frame {Rectangle} The rectangle frame of the texture to show
 */
PIXI.Texture = function(baseTexture, frame)
{
    PIXI.EventTarget.call( this );

    /**
     * Does this Texture have any frame data assigned to it?
     *
     * @property noFrame
     * @type Boolean
     */
    this.noFrame = false;

    if (!frame)
    {
        this.noFrame = true;
        frame = new PIXI.Rectangle(0,0,1,1);
    }

    if (baseTexture instanceof PIXI.Texture)
    {
        baseTexture = baseTexture.baseTexture;
    }

    /**
     * The base texture that this texture uses.
     *
     * @property baseTexture
     * @type BaseTexture
     */
    this.baseTexture = baseTexture;

    /**
     * The frame specifies the region of the base texture that this texture uses
     *
     * @property frame
     * @type Rectangle
     */
    this.frame = frame;

    /**
     * The trim point
     *
     * @property trim
     * @type Rectangle
     */
    this.trim = null;
    
    /**
     * This will let the renderer know if the texture is valid. If its not then it cannot be rendered.
     *
     * @property valid
     * @type Boolean
     */
    this.valid = false;

    /**
     * The context scope under which events are run.
     *
     * @property scope
     * @type Object
     */
    this.scope = this;

    /**
     * The WebGL UV data cache.
     *
     * @private
     * @property _uvs
     * @type Object
     */
    this._uvs = null;
    
    /**
     * The width of the Texture in pixels.
     *
     * @property width
     * @type Number
     */
    this.width = 0;

    /**
     * The height of the Texture in pixels.
     *
     * @property height
     * @type Number
     */
    this.height = 0;

    /**
     * This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
     * irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
     *
     * @property crop
     * @type Rectangle
     */
    this.crop = new PIXI.Rectangle(0, 0, 1, 1);

    if (baseTexture.hasLoaded)
    {
        if (this.noFrame) frame = new PIXI.Rectangle(0, 0, baseTexture.width, baseTexture.height);
        this.setFrame(frame);
    }
    else
    {
        var scope = this;
        baseTexture.addEventListener('loaded', function(){ scope.onBaseTextureLoaded(); });
    }
};

PIXI.Texture.prototype.constructor = PIXI.Texture;

/**
 * Called when the base texture is loaded
 *
 * @method onBaseTextureLoaded
 * @param event
 * @private
 */
PIXI.Texture.prototype.onBaseTextureLoaded = function()
{
    var baseTexture = this.baseTexture;
    baseTexture.removeEventListener('loaded', this.onLoaded);

    if (this.noFrame) this.frame = new PIXI.Rectangle(0, 0, baseTexture.width, baseTexture.height);
    
    this.setFrame(this.frame);

    this.scope.dispatchEvent( { type: 'update', content: this } );
};

/**
 * Destroys this texture
 *
 * @method destroy
 * @param destroyBase {Boolean} Whether to destroy the base texture as well
 */
PIXI.Texture.prototype.destroy = function(destroyBase)
{
    if (destroyBase) this.baseTexture.destroy();

    this.valid = false;
};

/**
 * Specifies the region of the baseTexture that this texture will use.
 *
 * @method setFrame
 * @param frame {Rectangle} The frame of the texture to set it to
 */
PIXI.Texture.prototype.setFrame = function(frame)
{
    this.noFrame = false;

    this.frame = frame;
    this.width = frame.width;
    this.height = frame.height;

    this.crop.x = frame.x;
    this.crop.y = frame.y;
    this.crop.width = frame.width;
    this.crop.height = frame.height;

    if (!this.trim && (frame.x + frame.width > this.baseTexture.width || frame.y + frame.height > this.baseTexture.height))
    {
        throw new Error('Texture Error: frame does not fit inside the base Texture dimensions ' + this);
    }

    this.valid = frame && frame.width && frame.height && this.baseTexture.source && this.baseTexture.hasLoaded;

    if (this.trim)
    {
        this.width = this.trim.width;
        this.height = this.trim.height;
        this.frame.width = this.trim.width;
        this.frame.height = this.trim.height;
    }

    if (this.valid) PIXI.Texture.frameUpdates.push(this);

};

/**
 * Updates the internal WebGL UV cache.
 *
 * @method _updateWebGLuvs
 * @private
 */
PIXI.Texture.prototype._updateWebGLuvs = function()
{
    if(!this._uvs)this._uvs = new PIXI.TextureUvs();

    var frame = this.crop;
    var tw = this.baseTexture.width;
    var th = this.baseTexture.height;

    this._uvs.x0 = frame.x / tw;
    this._uvs.y0 = frame.y / th;

    this._uvs.x1 = (frame.x + frame.width) / tw;
    this._uvs.y1 = frame.y / th;

    this._uvs.x2 = (frame.x + frame.width) / tw;
    this._uvs.y2 = (frame.y + frame.height) / th;

    this._uvs.x3 = frame.x / tw;
    this._uvs.y3 = (frame.y + frame.height) / th;

};

/**
 * Helper function that returns a texture based on an image url
 * If the image is not in the texture cache it will be  created and loaded
 *
 * @static
 * @method fromImage
 * @param imageUrl {String} The image url of the texture
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 * @param scaleMode {Number} Should be one of the PIXI.scaleMode consts
 * @return Texture
 */
PIXI.Texture.fromImage = function(imageUrl, crossorigin, scaleMode)
{
    var texture = PIXI.TextureCache[imageUrl];

    if(!texture)
    {
        texture = new PIXI.Texture(PIXI.BaseTexture.fromImage(imageUrl, crossorigin, scaleMode));
        PIXI.TextureCache[imageUrl] = texture;
    }

    return texture;
};

/**
 * Helper function that returns a texture based on a frame id
 * If the frame id is not in the texture cache an error will be thrown
 *
 * @static
 * @method fromFrame
 * @param frameId {String} The frame id of the texture
 * @return Texture
 */
PIXI.Texture.fromFrame = function(frameId)
{
    var texture = PIXI.TextureCache[frameId];
    if(!texture) throw new Error('The frameId "' + frameId + '" does not exist in the texture cache ');
    return texture;
};

/**
 * Helper function that returns a texture based on a canvas element
 * If the canvas is not in the texture cache it will be  created and loaded
 *
 * @static
 * @method fromCanvas
 * @param canvas {Canvas} The canvas element source of the texture
 * @param scaleMode {Number} Should be one of the PIXI.scaleMode consts
 * @return Texture
 */
PIXI.Texture.fromCanvas = function(canvas, scaleMode)
{
    var baseTexture = PIXI.BaseTexture.fromCanvas(canvas, scaleMode);

    return new PIXI.Texture( baseTexture );

};


/**
 * Adds a texture to the textureCache.
 *
 * @static
 * @method addTextureToCache
 * @param texture {Texture}
 * @param id {String} the id that the texture will be stored against.
 */
PIXI.Texture.addTextureToCache = function(texture, id)
{
    PIXI.TextureCache[id] = texture;
};

/**
 * Remove a texture from the textureCache.
 *
 * @static
 * @method removeTextureFromCache
 * @param id {String} the id of the texture to be removed
 * @return {Texture} the texture that was removed
 */
PIXI.Texture.removeTextureFromCache = function(id)
{
    var texture = PIXI.TextureCache[id];
    delete PIXI.TextureCache[id];
    delete PIXI.BaseTextureCache[id];
    return texture;
};

// this is more for webGL.. it contains updated frames..
PIXI.Texture.frameUpdates = [];

PIXI.TextureUvs = function()
{
    this.x0 = 0;
    this.y0 = 0;

    this.x1 = 0;
    this.y1 = 0;

    this.x2 = 0;
    this.y2 = 0;

    this.x3 = 0;
    this.y3 = 0;


};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 A RenderTexture is a special texture that allows any pixi displayObject to be rendered to it.

 __Hint__: All DisplayObjects (exmpl. Sprites) that render on RenderTexture should be preloaded.
 Otherwise black rectangles will be drawn instead.

 RenderTexture takes snapshot of DisplayObject passed to render method. If DisplayObject is passed to render method, position and rotation of it will be ignored. For example:

    var renderTexture = new PIXI.RenderTexture(800, 600);
    var sprite = PIXI.Sprite.fromImage("spinObj_01.png");
    sprite.position.x = 800/2;
    sprite.position.y = 600/2;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    renderTexture.render(sprite);

 Sprite in this case will be rendered to 0,0 position. To render this sprite at center DisplayObjectContainer should be used:

    var doc = new PIXI.DisplayObjectContainer();
    doc.addChild(sprite);
    renderTexture.render(doc);  // Renders to center of renderTexture

 * @class RenderTexture
 * @extends Texture
 * @constructor
 * @param width {Number} The width of the render texture
 * @param height {Number} The height of the render texture
 * @param scaleMode {Number} Should be one of the PIXI.scaleMode consts
 */
PIXI.RenderTexture = function(width, height, renderer, scaleMode)
{
    PIXI.EventTarget.call( this );

    /**
     * The with of the render texture
     *
     * @property width
     * @type Number
     */
    this.width = width || 100;
    /**
     * The height of the render texture
     *
     * @property height
     * @type Number
     */
    this.height = height || 100;

    /**
     * The framing rectangle of the render texture
     *
     * @property frame
     * @type Rectangle
     */
    this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);

    /**
     * This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
     * irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
     *
     * @property crop
     * @type Rectangle
     */
    this.crop = new PIXI.Rectangle(0, 0, this.width, this.height);
    
    /**
     * The base texture object that this texture uses
     *
     * @property baseTexture
     * @type BaseTexture
     */
    this.baseTexture = new PIXI.BaseTexture();
    this.baseTexture.width = this.width;
    this.baseTexture.height = this.height;
    this.baseTexture._glTextures = [];

    this.baseTexture.scaleMode = scaleMode || PIXI.scaleModes.DEFAULT;

    this.baseTexture.hasLoaded = true;

    // each render texture can only belong to one renderer at the moment if its webGL
    this.renderer = renderer || PIXI.defaultRenderer;

    if(this.renderer.type === PIXI.WEBGL_RENDERER)
    {
        var gl = this.renderer.gl;

        this.textureBuffer = new PIXI.FilterTexture(gl, this.width, this.height, this.baseTexture.scaleMode);
        this.baseTexture._glTextures[gl.id] =  this.textureBuffer.texture;

        this.render = this.renderWebGL;
        this.projection = new PIXI.Point(this.width/2 , -this.height/2);
    }
    else
    {
        this.render = this.renderCanvas;
        this.textureBuffer = new PIXI.CanvasBuffer(this.width, this.height);
        this.baseTexture.source = this.textureBuffer.canvas;
    }

    this.valid = true;
    PIXI.Texture.frameUpdates.push(this);


};

PIXI.RenderTexture.prototype = Object.create(PIXI.Texture.prototype);
PIXI.RenderTexture.prototype.constructor = PIXI.RenderTexture;

/**
 * Resize the RenderTexture.
 *
 * @method resize
 * @param width {Number} The width to resize to.
 * @param height {Number} The height to resize to.
 * @param updateBase {Boolean} Should the baseTexture.width and height values be resized as well?
 */
PIXI.RenderTexture.prototype.resize = function(width, height, updateBase)
{
    if (width === this.width && height === this.height)
    {
        return;
    }

    this.width = this.frame.width = this.crop.width = width;
    this.height =  this.frame.height = this.crop.height = height;

    if (updateBase)
    {
        this.baseTexture.width = this.width;
        this.baseTexture.height = this.height;
    }

    if (this.renderer.type === PIXI.WEBGL_RENDERER)
    {
        this.projection.x = this.width / 2;
        this.projection.y = -this.height / 2;
    }
    
    this.textureBuffer.resize(this.width, this.height);
};

/**
 * Clears the RenderTexture.
 *
 * @method clear
 */
PIXI.RenderTexture.prototype.clear = function()
{
    if (this.renderer.type === PIXI.WEBGL_RENDERER)
    {
        this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, this.textureBuffer.frameBuffer);
    }
    
    this.textureBuffer.clear();
};

/**
 * This function will draw the display object to the texture.
 *
 * @method renderWebGL
 * @param displayObject {DisplayObject} The display object to render this texture on
 * @param clear {Boolean} If true the texture will be cleared before the displayObject is drawn
 * @private
 */
PIXI.RenderTexture.prototype.renderWebGL = function(displayObject, position, clear)
{
    //TOOD replace position with matrix..
    var gl = this.renderer.gl;

    gl.colorMask(true, true, true, true);

    gl.viewport(0, 0, this.width, this.height);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.textureBuffer.frameBuffer );

    if(clear)this.textureBuffer.clear();


    // THIS WILL MESS WITH HIT TESTING!
    var children = displayObject.children;

    //TODO -? create a new one??? dont think so!
    var originalWorldTransform = displayObject.worldTransform;
    displayObject.worldTransform = PIXI.RenderTexture.tempMatrix;
    // modify to flip...
    displayObject.worldTransform.d = -1;
    displayObject.worldTransform.ty = this.projection.y * -2;

    if(position)
    {
        displayObject.worldTransform.tx = position.x;
        displayObject.worldTransform.ty -= position.y;
    }

    for(var i=0,j=children.length; i<j; i++)
    {
        children[i].updateTransform();
    }

    // update the textures!
    PIXI.WebGLRenderer.updateTextures();

    this.renderer.spriteBatch.dirty = true;
    
    this.renderer.renderDisplayObject(displayObject, this.projection, this.textureBuffer.frameBuffer);

    displayObject.worldTransform = originalWorldTransform;

    this.renderer.spriteBatch.dirty = true;
};


/**
 * This function will draw the display object to the texture.
 *
 * @method renderCanvas
 * @param displayObject {DisplayObject} The display object to render this texture on
 * @param clear {Boolean} If true the texture will be cleared before the displayObject is drawn
 * @private
 */
PIXI.RenderTexture.prototype.renderCanvas = function(displayObject, position, clear)
{
    var children = displayObject.children;

    var originalWorldTransform = displayObject.worldTransform;

    displayObject.worldTransform = PIXI.RenderTexture.tempMatrix;
    
    if(position)
    {
        displayObject.worldTransform.tx = position.x;
        displayObject.worldTransform.ty = position.y;
    }
    else
    {
        displayObject.worldTransform.tx = 0;
        displayObject.worldTransform.ty = 0;
    }

    for(var i = 0, j = children.length; i < j; i++)
    {
        children[i].updateTransform();
    }

    if(clear)this.textureBuffer.clear();

    var context = this.textureBuffer.context;

    this.renderer.renderDisplayObject(displayObject, context);

    context.setTransform(1,0,0,1,0,0);

    displayObject.worldTransform = originalWorldTransform;
};

PIXI.RenderTexture.tempMatrix = new PIXI.Matrix();


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Class that loads a bunch of images / sprite sheet / bitmap font files. Once the
 * assets have been loaded they are added to the PIXI Texture cache and can be accessed
 * easily through PIXI.Texture.fromImage() and PIXI.Sprite.fromImage()
 * When all items have been loaded this class will dispatch a 'onLoaded' event
 * As each individual item is loaded this class will dispatch a 'onProgress' event
 *
 * @class AssetLoader
 * @constructor
 * @uses EventTarget
 * @param {Array<String>} assetURLs an array of image/sprite sheet urls that you would like loaded
 *      supported. Supported image formats include 'jpeg', 'jpg', 'png', 'gif'. Supported
 *      sprite sheet data formats only include 'JSON' at this time. Supported bitmap font
 *      data formats include 'xml' and 'fnt'.
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.AssetLoader = function(assetURLs, crossorigin)
{
    PIXI.EventTarget.call(this);

    /**
     * The array of asset URLs that are going to be loaded
     *
     * @property assetURLs
     * @type Array<String>
     */
    this.assetURLs = assetURLs;

    /**
     * Whether the requests should be treated as cross origin
     *
     * @property crossorigin
     * @type Boolean
     */
    this.crossorigin = crossorigin;

    /**
     * Maps file extension to loader types
     *
     * @property loadersByType
     * @type Object
     */
    this.loadersByType = {
        'jpg':  PIXI.ImageLoader,
        'jpeg': PIXI.ImageLoader,
        'png':  PIXI.ImageLoader,
        'gif':  PIXI.ImageLoader,
        'webp': PIXI.ImageLoader,
        'json': PIXI.JsonLoader,
        'atlas': PIXI.AtlasLoader,
        'anim': PIXI.SpineLoader,
        'xml':  PIXI.BitmapFontLoader,
        'fnt':  PIXI.BitmapFontLoader
    };
};

/**
 * Fired when an item has loaded
 * @event onProgress
 */

/**
 * Fired when all the assets have loaded
 * @event onComplete
 */

// constructor
PIXI.AssetLoader.prototype.constructor = PIXI.AssetLoader;

/**
 * Given a filename, returns its extension, wil
 *
 * @method _getDataType
 * @param str {String} the name of the asset
 */
PIXI.AssetLoader.prototype._getDataType = function(str)
{
    var test = 'data:';
    //starts with 'data:'
    var start = str.slice(0, test.length).toLowerCase();
    if (start === test) {
        var data = str.slice(test.length);

        var sepIdx = data.indexOf(',');
        if (sepIdx === -1) //malformed data URI scheme
            return null;

        //e.g. 'image/gif;base64' => 'image/gif'
        var info = data.slice(0, sepIdx).split(';')[0];

        //We might need to handle some special cases here...
        //standardize text/plain to 'txt' file extension
        if (!info || info.toLowerCase() === 'text/plain')
            return 'txt';

        //User specified mime type, try splitting it by '/'
        return info.split('/').pop().toLowerCase();
    }

    return null;
};

/**
 * Starts loading the assets sequentially
 *
 * @method load
 */
PIXI.AssetLoader.prototype.load = function()
{
    var scope = this;

    function onLoad(evt) {
        scope.onAssetLoaded(evt.content);
    }

    this.loadCount = this.assetURLs.length;

    for (var i=0; i < this.assetURLs.length; i++)
    {
        var fileName = this.assetURLs[i];
        //first see if we have a data URI scheme..
        var fileType = this._getDataType(fileName);

        //if not, assume it's a file URI
        if (!fileType)
            fileType = fileName.split('?').shift().split('.').pop().toLowerCase();

        var Constructor = this.loadersByType[fileType];
        if(!Constructor)
            throw new Error(fileType + ' is an unsupported file type');

        var loader = new Constructor(fileName, this.crossorigin);

        loader.addEventListener('loaded', onLoad);
        loader.load();
    }
};

/**
 * Invoked after each file is loaded
 *
 * @method onAssetLoaded
 * @private
 */
PIXI.AssetLoader.prototype.onAssetLoaded = function(loader)
{
    this.loadCount--;
    this.dispatchEvent({ type: 'onProgress', content: this, loader: loader });
    if (this.onProgress) this.onProgress(loader);

    if (!this.loadCount)
    {
        this.dispatchEvent({type: 'onComplete', content: this});
        if(this.onComplete) this.onComplete();
    }
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The json file loader is used to load in JSON data and parse it
 * When loaded this class will dispatch a 'loaded' event
 * If loading fails this class will dispatch an 'error' event
 *
 * @class JsonLoader
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the JSON file
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.JsonLoader = function (url, crossorigin) {
    PIXI.EventTarget.call(this);

    /**
     * The url of the bitmap font data
     *
     * @property url
     * @type String
     */
    this.url = url;

    /**
     * Whether the requests should be treated as cross origin
     *
     * @property crossorigin
     * @type Boolean
     */
    this.crossorigin = crossorigin;

    /**
     * [read-only] The base url of the bitmap font data
     *
     * @property baseUrl
     * @type String
     * @readOnly
     */
    this.baseUrl = url.replace(/[^\/]*$/, '');

    /**
     * [read-only] Whether the data has loaded yet
     *
     * @property loaded
     * @type Boolean
     * @readOnly
     */
    this.loaded = false;

};

// constructor
PIXI.JsonLoader.prototype.constructor = PIXI.JsonLoader;

/**
 * Loads the JSON data
 *
 * @method load
 */
PIXI.JsonLoader.prototype.load = function () {

    var scope = this;

    if(window.XDomainRequest && scope.crossorigin)
    {
        this.ajaxRequest = new window.XDomainRequest();

        // XDomainRequest has a few querks. Occasionally it will abort requests
        // A way to avoid this is to make sure ALL callbacks are set even if not used
        // More info here: http://stackoverflow.com/questions/15786966/xdomainrequest-aborts-post-on-ie-9
        this.ajaxRequest.timeout = 3000;

        this.ajaxRequest.onerror = function () {
            scope.onError();
        };
           
        this.ajaxRequest.ontimeout = function () {
            scope.onError();
        };

        this.ajaxRequest.onprogress = function() {};

    }
    else if (window.XMLHttpRequest)
    {
        this.ajaxRequest = new window.XMLHttpRequest();
    }
    else
    {
        this.ajaxRequest = new window.ActiveXObject('Microsoft.XMLHTTP');
    }

    

    this.ajaxRequest.onload = function(){

        scope.onJSONLoaded();
    };

    this.ajaxRequest.open('GET',this.url,true);

    this.ajaxRequest.send();
};

/**
 * Invoke when JSON file is loaded
 *
 * @method onJSONLoaded
 * @private
 */
PIXI.JsonLoader.prototype.onJSONLoaded = function () {
    
    if(!this.ajaxRequest.responseText )
    {
        this.onError();
        return;
    }
   
    this.json = JSON.parse(this.ajaxRequest.responseText);

    if(this.json.frames)
    {
        // sprite sheet
        var scope = this;
        var textureUrl = this.baseUrl + this.json.meta.image;
        var image = new PIXI.ImageLoader(textureUrl, this.crossorigin);
        var frameData = this.json.frames;

        this.texture = image.texture.baseTexture;
        image.addEventListener('loaded', function() {
            scope.onLoaded();
        });

        for (var i in frameData)
        {
            var rect = frameData[i].frame;

            if (rect)
            {
                PIXI.TextureCache[i] = new PIXI.Texture(this.texture, {
                    x: rect.x,
                    y: rect.y,
                    width: rect.w,
                    height: rect.h
                });

                PIXI.TextureCache[i].crop = new PIXI.Rectangle(rect.x, rect.y, rect.w, rect.h);

                //  Check to see if the sprite is trimmed
                if (frameData[i].trimmed)
                {
                    var actualSize = frameData[i].sourceSize;
                    var realSize = frameData[i].spriteSourceSize;
                    PIXI.TextureCache[i].trim = new PIXI.Rectangle(realSize.x, realSize.y, actualSize.w, actualSize.h);
                }
            }
        }

        image.load();

    }
    else if(this.json.bones)
    {
        // spine animation
        var spineJsonParser = new spine.SkeletonJson();
        var skeletonData = spineJsonParser.readSkeletonData(this.json);
        PIXI.AnimCache[this.url] = skeletonData;
        this.onLoaded();
    }
    else
    {
        this.onLoaded();
    }
};

/**
 * Invoke when json file loaded
 *
 * @method onLoaded
 * @private
 */
PIXI.JsonLoader.prototype.onLoaded = function () {
    this.loaded = true;
    this.dispatchEvent({
        type: 'loaded',
        content: this
    });
};

/**
 * Invoke when error occured
 *
 * @method onError
 * @private
 */
PIXI.JsonLoader.prototype.onError = function () {

    this.dispatchEvent({
        type: 'error',
        content: this
    });
};

/**
 * @author Martin Kelm http://mkelm.github.com
 */

/**
 * The atlas file loader is used to load in Atlas data and parse it
 * When loaded this class will dispatch a 'loaded' event
 * If loading fails this class will dispatch an 'error' event
 * @class AtlasLoader
 * @extends EventTarget
 * @constructor
 * @param {String} url the url of the JSON file
 * @param {Boolean} crossorigin
 */

PIXI.AtlasLoader = function (url, crossorigin) {
    PIXI.EventTarget.call(this);
    this.url = url;
    this.baseUrl = url.replace(/[^\/]*$/, '');
    this.crossorigin = crossorigin;
    this.loaded = false;

};

// constructor
PIXI.AtlasLoader.constructor = PIXI.AtlasLoader;


 /**
 * Starts loading the JSON file
 *
 * @method load
 */
PIXI.AtlasLoader.prototype.load = function () {
    this.ajaxRequest = new PIXI.AjaxRequest();
    this.ajaxRequest.onreadystatechange = this.onAtlasLoaded.bind(this);

    this.ajaxRequest.open('GET', this.url, true);
    if (this.ajaxRequest.overrideMimeType) this.ajaxRequest.overrideMimeType('application/json');
    this.ajaxRequest.send(null);
};

/**
 * Invoke when JSON file is loaded
 * @method onAtlasLoaded
 * @private
 */
PIXI.AtlasLoader.prototype.onAtlasLoaded = function () {
    if (this.ajaxRequest.readyState === 4) {
        if (this.ajaxRequest.status === 200 || window.location.href.indexOf('http') === -1) {
            this.atlas = {
                meta : {
                    image : []
                },
                frames : []
            };
            var result = this.ajaxRequest.responseText.split(/\r?\n/);
            var lineCount = -3;

            var currentImageId = 0;
            var currentFrame = null;
            var nameInNextLine = false;

            var i = 0,
                j = 0,
                selfOnLoaded = this.onLoaded.bind(this);

            // parser without rotation support yet!
            for (i = 0; i < result.length; i++) {
                result[i] = result[i].replace(/^\s+|\s+$/g, '');
                if (result[i] === '') {
                    nameInNextLine = i+1;
                }
                if (result[i].length > 0) {
                    if (nameInNextLine === i) {
                        this.atlas.meta.image.push(result[i]);
                        currentImageId = this.atlas.meta.image.length - 1;
                        this.atlas.frames.push({});
                        lineCount = -3;
                    } else if (lineCount > 0) {
                        if (lineCount % 7 === 1) { // frame name
                            if (currentFrame != null) { //jshint ignore:line
                                this.atlas.frames[currentImageId][currentFrame.name] = currentFrame;
                            }
                            currentFrame = { name: result[i], frame : {} };
                        } else {
                            var text = result[i].split(' ');
                            if (lineCount % 7 === 3) { // position
                                currentFrame.frame.x = Number(text[1].replace(',', ''));
                                currentFrame.frame.y = Number(text[2]);
                            } else if (lineCount % 7 === 4) { // size
                                currentFrame.frame.w = Number(text[1].replace(',', ''));
                                currentFrame.frame.h = Number(text[2]);
                            } else if (lineCount % 7 === 5) { // real size
                                var realSize = {
                                    x : 0,
                                    y : 0,
                                    w : Number(text[1].replace(',', '')),
                                    h : Number(text[2])
                                };

                                if (realSize.w > currentFrame.frame.w || realSize.h > currentFrame.frame.h) {
                                    currentFrame.trimmed = true;
                                    currentFrame.realSize = realSize;
                                } else {
                                    currentFrame.trimmed = false;
                                }
                            }
                        }
                    }
                    lineCount++;
                }
            }

            if (currentFrame != null) { //jshint ignore:line
                this.atlas.frames[currentImageId][currentFrame.name] = currentFrame;
            }

            if (this.atlas.meta.image.length > 0) {
                this.images = [];
                for (j = 0; j < this.atlas.meta.image.length; j++) {
                    // sprite sheet
                    var textureUrl = this.baseUrl + this.atlas.meta.image[j];
                    var frameData = this.atlas.frames[j];
                    this.images.push(new PIXI.ImageLoader(textureUrl, this.crossorigin));

                    for (i in frameData) {
                        var rect = frameData[i].frame;
                        if (rect) {
                            PIXI.TextureCache[i] = new PIXI.Texture(this.images[j].texture.baseTexture, {
                                x: rect.x,
                                y: rect.y,
                                width: rect.w,
                                height: rect.h
                            });
                            if (frameData[i].trimmed) {
                                PIXI.TextureCache[i].realSize = frameData[i].realSize;
                                // trim in pixi not supported yet, todo update trim properties if it is done ...
                                PIXI.TextureCache[i].trim.x = 0;
                                PIXI.TextureCache[i].trim.y = 0;
                            }
                        }
                    }
                }

                this.currentImageId = 0;
                for (j = 0; j < this.images.length; j++) {
                    this.images[j].addEventListener('loaded', selfOnLoaded);
                }
                this.images[this.currentImageId].load();

            } else {
                this.onLoaded();
            }

        } else {
            this.onError();
        }
    }
};

/**
 * Invoke when json file has loaded
 * @method onLoaded
 * @private
 */
PIXI.AtlasLoader.prototype.onLoaded = function () {
    if (this.images.length - 1 > this.currentImageId) {
        this.currentImageId++;
        this.images[this.currentImageId].load();
    } else {
        this.loaded = true;
        this.dispatchEvent({
            type: 'loaded',
            content: this
        });
    }
};

/**
 * Invoke when error occured
 * @method onError
 * @private
 */
PIXI.AtlasLoader.prototype.onError = function () {
    this.dispatchEvent({
        type: 'error',
        content: this
    });
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The sprite sheet loader is used to load in JSON sprite sheet data
 * To generate the data you can use http://www.codeandweb.com/texturepacker and publish in the 'JSON' format
 * There is a free version so thats nice, although the paid version is great value for money.
 * It is highly recommended to use Sprite sheets (also know as a 'texture atlas') as it means sprites can be batched and drawn together for highly increased rendering speed.
 * Once the data has been loaded the frames are stored in the PIXI texture cache and can be accessed though PIXI.Texture.fromFrameId() and PIXI.Sprite.fromFrameId()
 * This loader will load the image file that the Spritesheet points to as well as the data.
 * When loaded this class will dispatch a 'loaded' event
 *
 * @class SpriteSheetLoader
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the sprite sheet JSON file
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.SpriteSheetLoader = function (url, crossorigin) {
    /*
     * i use texture packer to load the assets..
     * http://www.codeandweb.com/texturepacker
     * make sure to set the format as 'JSON'
     */
    PIXI.EventTarget.call(this);

    /**
     * The url of the bitmap font data
     *
     * @property url
     * @type String
     */
    this.url = url;

    /**
     * Whether the requests should be treated as cross origin
     *
     * @property crossorigin
     * @type Boolean
     */
    this.crossorigin = crossorigin;

    /**
     * [read-only] The base url of the bitmap font data
     *
     * @property baseUrl
     * @type String
     * @readOnly
     */
    this.baseUrl = url.replace(/[^\/]*$/, '');

    /**
     * The texture being loaded
     *
     * @property texture
     * @type Texture
     */
    this.texture = null;

    /**
     * The frames of the sprite sheet
     *
     * @property frames
     * @type Object
     */
    this.frames = {};
};

// constructor
PIXI.SpriteSheetLoader.prototype.constructor = PIXI.SpriteSheetLoader;

/**
 * This will begin loading the JSON file
 *
 * @method load
 */
PIXI.SpriteSheetLoader.prototype.load = function () {
    var scope = this;
    var jsonLoader = new PIXI.JsonLoader(this.url, this.crossorigin);
    jsonLoader.addEventListener('loaded', function (event) {
        scope.json = event.content.json;
        scope.onLoaded();
    });
    jsonLoader.load();
};

/**
 * Invoke when all files are loaded (json and texture)
 *
 * @method onLoaded
 * @private
 */
PIXI.SpriteSheetLoader.prototype.onLoaded = function () {
    this.dispatchEvent({
        type: 'loaded',
        content: this
    });
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The image loader class is responsible for loading images file formats ('jpeg', 'jpg', 'png' and 'gif')
 * Once the image has been loaded it is stored in the PIXI texture cache and can be accessed though PIXI.Texture.fromFrameId() and PIXI.Sprite.fromFrameId()
 * When loaded this class will dispatch a 'loaded' event
 *
 * @class ImageLoader
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the image
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.ImageLoader = function(url, crossorigin)
{
    PIXI.EventTarget.call(this);

    /**
     * The texture being loaded
     *
     * @property texture
     * @type Texture
     */
    this.texture = PIXI.Texture.fromImage(url, crossorigin);

    /**
     * if the image is loaded with loadFramedSpriteSheet
     * frames will contain the sprite sheet frames
     *
     */
    this.frames = [];
};

// constructor
PIXI.ImageLoader.prototype.constructor = PIXI.ImageLoader;

/**
 * Loads image or takes it from cache
 *
 * @method load
 */
PIXI.ImageLoader.prototype.load = function()
{
    if(!this.texture.baseTexture.hasLoaded)
    {
        var scope = this;
        this.texture.baseTexture.addEventListener('loaded', function()
        {
            scope.onLoaded();
        });
    }
    else
    {
        this.onLoaded();
    }
};

/**
 * Invoked when image file is loaded or it is already cached and ready to use
 *
 * @method onLoaded
 * @private
 */
PIXI.ImageLoader.prototype.onLoaded = function()
{
    this.dispatchEvent({type: 'loaded', content: this});
};

/**
 * Loads image and split it to uniform sized frames
 *
 *
 * @method loadFramedSpriteSheet
 * @param frameWidth {Number} width of each frame
 * @param frameHeight {Number} height of each frame
 * @param textureName {String} if given, the frames will be cached in <textureName>-<ord> format
 */
PIXI.ImageLoader.prototype.loadFramedSpriteSheet = function(frameWidth, frameHeight, textureName)
{
    this.frames = [];
    var cols = Math.floor(this.texture.width / frameWidth);
    var rows = Math.floor(this.texture.height / frameHeight);

    var i=0;
    for (var y=0; y<rows; y++)
    {
        for (var x=0; x<cols; x++,i++)
        {
            var texture = new PIXI.Texture(this.texture, {
                x: x*frameWidth,
                y: y*frameHeight,
                width: frameWidth,
                height: frameHeight
            });

            this.frames.push(texture);
            if (textureName) PIXI.TextureCache[textureName + '-' + i] = texture;
        }
    }

    if(!this.texture.baseTexture.hasLoaded)
    {
        var scope = this;
        this.texture.baseTexture.addEventListener('loaded', function() {
            scope.onLoaded();
        });
    }
    else
    {
        this.onLoaded();
    }
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The xml loader is used to load in XML bitmap font data ('xml' or 'fnt')
 * To generate the data you can use http://www.angelcode.com/products/bmfont/
 * This loader will also load the image file as the data.
 * When loaded this class will dispatch a 'loaded' event
 *
 * @class BitmapFontLoader
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the sprite sheet JSON file
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.BitmapFontLoader = function(url, crossorigin)
{
    /*
     * I use texture packer to load the assets..
     * http://www.codeandweb.com/texturepacker
     * make sure to set the format as 'JSON'
     */
    PIXI.EventTarget.call(this);

    /**
     * The url of the bitmap font data
     *
     * @property url
     * @type String
     */
    this.url = url;

    /**
     * Whether the requests should be treated as cross origin
     *
     * @property crossorigin
     * @type Boolean
     */
    this.crossorigin = crossorigin;

    /**
     * [read-only] The base url of the bitmap font data
     *
     * @property baseUrl
     * @type String
     * @readOnly
     */
    this.baseUrl = url.replace(/[^\/]*$/, '');

    /**
     * [read-only] The texture of the bitmap font
     *
     * @property baseUrl
     * @type String
     */
    this.texture = null;
};

// constructor
PIXI.BitmapFontLoader.prototype.constructor = PIXI.BitmapFontLoader;

/**
 * Loads the XML font data
 *
 * @method load
 */
PIXI.BitmapFontLoader.prototype.load = function()
{
    this.ajaxRequest = new PIXI.AjaxRequest();
    var scope = this;
    this.ajaxRequest.onreadystatechange = function()
    {
        scope.onXMLLoaded();
    };

    this.ajaxRequest.open('GET', this.url, true);
    if (this.ajaxRequest.overrideMimeType) this.ajaxRequest.overrideMimeType('application/xml');
    this.ajaxRequest.send(null);
};

/**
 * Invoked when the XML file is loaded, parses the data
 *
 * @method onXMLLoaded
 * @private
 */
PIXI.BitmapFontLoader.prototype.onXMLLoaded = function()
{
    if (this.ajaxRequest.readyState === 4)
    {
        if (this.ajaxRequest.status === 200 || window.location.protocol.indexOf('http') === -1)
        {
            var responseXML = this.ajaxRequest.responseXML;
            if(!responseXML || /MSIE 9/i.test(navigator.userAgent) || navigator.isCocoonJS) {
                if(typeof(window.DOMParser) === 'function') {
                    var domparser = new DOMParser();
                    responseXML = domparser.parseFromString(this.ajaxRequest.responseText, 'text/xml');
                } else {
                    var div = document.createElement('div');
                    div.innerHTML = this.ajaxRequest.responseText;
                    responseXML = div;
                }
            }

            var textureUrl = this.baseUrl + responseXML.getElementsByTagName('page')[0].getAttribute('file');
            var image = new PIXI.ImageLoader(textureUrl, this.crossorigin);
            this.texture = image.texture.baseTexture;

            var data = {};
            var info = responseXML.getElementsByTagName('info')[0];
            var common = responseXML.getElementsByTagName('common')[0];
            data.font = info.getAttribute('face');
            data.size = parseInt(info.getAttribute('size'), 10);
            data.lineHeight = parseInt(common.getAttribute('lineHeight'), 10);
            data.chars = {};

            //parse letters
            var letters = responseXML.getElementsByTagName('char');

            for (var i = 0; i < letters.length; i++)
            {
                var charCode = parseInt(letters[i].getAttribute('id'), 10);

                var textureRect = new PIXI.Rectangle(
                    parseInt(letters[i].getAttribute('x'), 10),
                    parseInt(letters[i].getAttribute('y'), 10),
                    parseInt(letters[i].getAttribute('width'), 10),
                    parseInt(letters[i].getAttribute('height'), 10)
                );

                data.chars[charCode] = {
                    xOffset: parseInt(letters[i].getAttribute('xoffset'), 10),
                    yOffset: parseInt(letters[i].getAttribute('yoffset'), 10),
                    xAdvance: parseInt(letters[i].getAttribute('xadvance'), 10),
                    kerning: {},
                    texture: PIXI.TextureCache[charCode] = new PIXI.Texture(this.texture, textureRect)

                };
            }

            //parse kernings
            var kernings = responseXML.getElementsByTagName('kerning');
            for (i = 0; i < kernings.length; i++)
            {
                var first = parseInt(kernings[i].getAttribute('first'), 10);
                var second = parseInt(kernings[i].getAttribute('second'), 10);
                var amount = parseInt(kernings[i].getAttribute('amount'), 10);

                data.chars[second].kerning[first] = amount;

            }

            PIXI.BitmapText.fonts[data.font] = data;

            var scope = this;
            image.addEventListener('loaded', function() {
                scope.onLoaded();
            });
            image.load();
        }
    }
};

/**
 * Invoked when all files are loaded (xml/fnt and texture)
 *
 * @method onLoaded
 * @private
 */
PIXI.BitmapFontLoader.prototype.onLoaded = function()
{
    this.dispatchEvent({type: 'loaded', content: this});
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * based on pixi impact spine implementation made by Eemeli Kelokorpi (@ekelokorpi) https://github.com/ekelokorpi
 *
 * Awesome JS run time provided by EsotericSoftware
 * https://github.com/EsotericSoftware/spine-runtimes
 *
 */

/**
 * The Spine loader is used to load in JSON spine data
 * To generate the data you need to use http://esotericsoftware.com/ and export in the "JSON" format
 * Due to a clash of names  You will need to change the extension of the spine file from *.json to *.anim for it to load
 * See example 12 (http://www.goodboydigital.com/pixijs/examples/12/) to see a working example and check out the source
 * You will need to generate a sprite sheet to accompany the spine data
 * When loaded this class will dispatch a "loaded" event
 *
 * @class Spine
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the JSON file
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.SpineLoader = function(url, crossorigin)
{
    PIXI.EventTarget.call(this);

    /**
     * The url of the bitmap font data
     *
     * @property url
     * @type String
     */
    this.url = url;

    /**
     * Whether the requests should be treated as cross origin
     *
     * @property crossorigin
     * @type Boolean
     */
    this.crossorigin = crossorigin;

    /**
     * [read-only] Whether the data has loaded yet
     *
     * @property loaded
     * @type Boolean
     * @readOnly
     */
    this.loaded = false;
};

PIXI.SpineLoader.prototype.constructor = PIXI.SpineLoader;

/**
 * Loads the JSON data
 *
 * @method load
 */
PIXI.SpineLoader.prototype.load = function () {

    var scope = this;
    var jsonLoader = new PIXI.JsonLoader(this.url, this.crossorigin);
    jsonLoader.addEventListener("loaded", function (event) {
        scope.json = event.content.json;
        scope.onLoaded();
    });
    jsonLoader.load();
};

/**
 * Invoke when JSON file is loaded
 *
 * @method onLoaded
 * @private
 */
PIXI.SpineLoader.prototype.onLoaded = function () {
    this.loaded = true;
    this.dispatchEvent({type: "loaded", content: this});
};


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * This is the base class for creating a pixi.js filter. Currently only webGL supports filters.
 * If you want to make a custom filter this should be your base class.
 * @class AbstractFilter
 * @constructor
 * @param fragmentSrc
 * @param uniforms
 */
PIXI.AbstractFilter = function(fragmentSrc, uniforms)
{
    /**
    * An array of passes - some filters contain a few steps this array simply stores the steps in a liniear fashion.
    * For example the blur filter has two passes blurX and blurY.
    * @property passes
    * @type Array an array of filter objects
    * @private
    */
    this.passes = [this];

    /**
    * @property shaders
    * @type Array an array of shaders
    * @private
    */
    this.shaders = [];
    
    this.dirty = true;
    this.padding = 0;

    /**
    * @property uniforms
    * @type object
    * @private
    */
    this.uniforms = uniforms || {};
    /**
    * @property fragmentSrc
    * @type Array
    * @private
    */
    this.fragmentSrc = fragmentSrc || [];
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * The AlphaMaskFilter class uses the pixel values from the specified texture (called the displacement map) to perform a displacement of an object.
 * You can use this filter to apply all manor of crazy warping effects
 * Currently the r property of the texture is used to offset the x and the g propery of the texture is used to offset the y.
 * @class AlphaMaskFilter
 * @contructor
 * @param texture {Texture} The texture used for the displacemtent map * must be power of 2 texture at the moment
 */
PIXI.AlphaMaskFilter = function(texture)
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];
    texture.baseTexture._powerOf2 = true;

    // set the uniforms
    this.uniforms = {
        mask: {type: 'sampler2D', value:texture},
        mapDimensions:   {type: '2f', value:{x:1, y:5112}},
        dimensions:   {type: '4fv', value:[0,0,0,0]}
    };

    if(texture.baseTexture.hasLoaded)
    {
        this.uniforms.mask.value.x = texture.width;
        this.uniforms.mask.value.y = texture.height;
    }
    else
    {
        this.boundLoadedFunction = this.onTextureLoaded.bind(this);

        texture.baseTexture.on('loaded', this.boundLoadedFunction);
    }

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D mask;',
        'uniform sampler2D uSampler;',
        'uniform vec2 offset;',
        'uniform vec4 dimensions;',
        'uniform vec2 mapDimensions;',

        'void main(void) {',
        '   vec2 mapCords = vTextureCoord.xy;',
        '   mapCords += (dimensions.zw + offset)/ dimensions.xy ;',
        '   mapCords.y *= -1.0;',
        '   mapCords.y += 1.0;',
        '   mapCords *= dimensions.xy / mapDimensions;',

        '   vec4 original =  texture2D(uSampler, vTextureCoord);',
        '   float maskAlpha =  texture2D(mask, mapCords).r;',
        '   original *= maskAlpha;',
        //'   original.rgb *= maskAlpha;',
        '   gl_FragColor =  original;',
        //'   gl_FragColor = gl_FragColor;',
        '}'
    ];
};

PIXI.AlphaMaskFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.AlphaMaskFilter.prototype.constructor = PIXI.AlphaMaskFilter;

PIXI.AlphaMaskFilter.prototype.onTextureLoaded = function()
{
    this.uniforms.mapDimensions.value.x = this.uniforms.mask.value.width;
    this.uniforms.mapDimensions.value.y = this.uniforms.mask.value.height;

    this.uniforms.mask.value.baseTexture.off('loaded', this.boundLoadedFunction);
};

/**
 * The texture used for the displacemtent map * must be power of 2 texture at the moment
 *
 * @property map
 * @type Texture
 */
Object.defineProperty(PIXI.AlphaMaskFilter.prototype, 'map', {
    get: function() {
        return this.uniforms.mask.value;
    },
    set: function(value) {
        this.uniforms.mask.value = value;
    }
});


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * The ColorMatrixFilter class lets you apply a 4x4 matrix transformation on the RGBA
 * color and alpha values of every pixel on your displayObject to produce a result
 * with a new set of RGBA color and alpha values. Its pretty powerful!
 * @class ColorMatrixFilter
 * @contructor
 */
PIXI.ColorMatrixFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        matrix: {type: 'mat4', value: [1,0,0,0,
                                       0,1,0,0,
                                       0,0,1,0,
                                       0,0,0,1]}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform float invert;',
        'uniform mat4 matrix;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord) * matrix;',
      //  '   gl_FragColor = gl_FragColor;',
        '}'
    ];
};

PIXI.ColorMatrixFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.ColorMatrixFilter.prototype.constructor = PIXI.ColorMatrixFilter;

/**
 * Sets the matrix of the color matrix filter
 *
 * @property matrix
 * @type Array and array of 26 numbers
 * @default [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
 */
Object.defineProperty(PIXI.ColorMatrixFilter.prototype, 'matrix', {
    get: function() {
        return this.uniforms.matrix.value;
    },
    set: function(value) {
        this.uniforms.matrix.value = value;
    }
});
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * This turns your displayObjects to black and white.
 * @class GrayFilter
 * @contructor
 */
PIXI.GrayFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        gray: {type: '1f', value: 1}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D uSampler;',
        'uniform float gray;',

        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord);',
        '   gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), gray);',
     //   '   gl_FragColor = gl_FragColor;',
        '}'
    ];
};

PIXI.GrayFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.GrayFilter.prototype.constructor = PIXI.GrayFilter;

/**
The strength of the gray. 1 will make the object black and white, 0 will make the object its normal color
@property gray
*/
Object.defineProperty(PIXI.GrayFilter.prototype, 'gray', {
    get: function() {
        return this.uniforms.gray.value;
    },
    set: function(value) {
        this.uniforms.gray.value = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * The DisplacementFilter class uses the pixel values from the specified texture (called the displacement map) to perform a displacement of an object.
 * You can use this filter to apply all manor of crazy warping effects
 * Currently the r property of the texture is used offset the x and the g propery of the texture is used to offset the y.
 * @class DisplacementFilter
 * @contructor
 * @param texture {Texture} The texture used for the displacemtent map * must be power of 2 texture at the moment
 */
PIXI.DisplacementFilter = function(texture)
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];
    texture.baseTexture._powerOf2 = true;

    // set the uniforms
    this.uniforms = {
        displacementMap: {type: 'sampler2D', value:texture},
        scale:           {type: '2f', value:{x:30, y:30}},
        offset:          {type: '2f', value:{x:0, y:0}},
        mapDimensions:   {type: '2f', value:{x:1, y:5112}},
        dimensions:   {type: '4fv', value:[0,0,0,0]}
    };

    if(texture.baseTexture.hasLoaded)
    {
        this.uniforms.mapDimensions.value.x = texture.width;
        this.uniforms.mapDimensions.value.y = texture.height;
    }
    else
    {
        this.boundLoadedFunction = this.onTextureLoaded.bind(this);

        texture.baseTexture.on('loaded', this.boundLoadedFunction);
    }

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D displacementMap;',
        'uniform sampler2D uSampler;',
        'uniform vec2 scale;',
        'uniform vec2 offset;',
        'uniform vec4 dimensions;',
        'uniform vec2 mapDimensions;',// = vec2(256.0, 256.0);',
        // 'const vec2 textureDimensions = vec2(750.0, 750.0);',

        'void main(void) {',
        '   vec2 mapCords = vTextureCoord.xy;',
        //'   mapCords -= ;',
        '   mapCords += (dimensions.zw + offset)/ dimensions.xy ;',
        '   mapCords.y *= -1.0;',
        '   mapCords.y += 1.0;',
        '   vec2 matSample = texture2D(displacementMap, mapCords).xy;',
        '   matSample -= 0.5;',
        '   matSample *= scale;',
        '   matSample /= mapDimensions;',
        '   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x + matSample.x, vTextureCoord.y + matSample.y));',
        '   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb, 1.0);',
        '   vec2 cord = vTextureCoord;',

        //'   gl_FragColor =  texture2D(displacementMap, cord);',
     //   '   gl_FragColor = gl_FragColor;',
        '}'
    ];
};

PIXI.DisplacementFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.DisplacementFilter.prototype.constructor = PIXI.DisplacementFilter;

PIXI.DisplacementFilter.prototype.onTextureLoaded = function()
{
    this.uniforms.mapDimensions.value.x = this.uniforms.displacementMap.value.width;
    this.uniforms.mapDimensions.value.y = this.uniforms.displacementMap.value.height;

    this.uniforms.displacementMap.value.baseTexture.off('loaded', this.boundLoadedFunction);
};

/**
 * The texture used for the displacemtent map * must be power of 2 texture at the moment
 *
 * @property map
 * @type Texture
 */
Object.defineProperty(PIXI.DisplacementFilter.prototype, 'map', {
    get: function() {
        return this.uniforms.displacementMap.value;
    },
    set: function(value) {
        this.uniforms.displacementMap.value = value;
    }
});

/**
 * The multiplier used to scale the displacement result from the map calculation.
 *
 * @property scale
 * @type Point
 */
Object.defineProperty(PIXI.DisplacementFilter.prototype, 'scale', {
    get: function() {
        return this.uniforms.scale.value;
    },
    set: function(value) {
        this.uniforms.scale.value = value;
    }
});

/**
 * The offset used to move the displacement map.
 *
 * @property offset
 * @type Point
 */
Object.defineProperty(PIXI.DisplacementFilter.prototype, 'offset', {
    get: function() {
        return this.uniforms.offset.value;
    },
    set: function(value) {
        this.uniforms.offset.value = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * This filter applies a pixelate effect making display objects appear 'blocky'
 * @class PixelateFilter
 * @contructor
 */
PIXI.PixelateFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        invert: {type: '1f', value: 0},
        dimensions: {type: '4fv', value:new Float32Array([10000, 100, 10, 10])},
        pixelSize: {type: '2f', value:{x:10, y:10}}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform vec2 testDim;',
        'uniform vec4 dimensions;',
        'uniform vec2 pixelSize;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '   vec2 coord = vTextureCoord;',

        '   vec2 size = dimensions.xy/pixelSize;',

        '   vec2 color = floor( ( vTextureCoord * size ) ) / size + pixelSize/dimensions.xy * 0.5;',
        '   gl_FragColor = texture2D(uSampler, color);',
        '}'
    ];
};

PIXI.PixelateFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.PixelateFilter.prototype.constructor = PIXI.PixelateFilter;

/**
 *
 * This a point that describes the size of the blocs. x is the width of the block and y is the the height
 * @property size
 * @type Point
 */
Object.defineProperty(PIXI.PixelateFilter.prototype, 'size', {
    get: function() {
        return this.uniforms.pixelSize.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.pixelSize.value = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.BlurXFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        blur: {type: '1f', value: 1/512}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform float blur;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '   vec4 sum = vec4(0.0);',

        '   sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;',

        '   gl_FragColor = sum;',
        '}'
    ];
};

PIXI.BlurXFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.BlurXFilter.prototype.constructor = PIXI.BlurXFilter;

Object.defineProperty(PIXI.BlurXFilter.prototype, 'blur', {
    get: function() {
        return this.uniforms.blur.value / (1/7000);
    },
    set: function(value) {

        this.dirty = true;
        this.uniforms.blur.value = (1/7000) * value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.BlurYFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        blur: {type: '1f', value: 1/512}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform float blur;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '   vec4 sum = vec4(0.0);',

        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;',
        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;',

        '   gl_FragColor = sum;',
        '}'
    ];
};

PIXI.BlurYFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.BlurYFilter.prototype.constructor = PIXI.BlurYFilter;

Object.defineProperty(PIXI.BlurYFilter.prototype, 'blur', {
    get: function() {
        return this.uniforms.blur.value / (1/7000);
    },
    set: function(value) {
        //this.padding = value;
        this.uniforms.blur.value = (1/7000) * value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * The BlurFilter applies a Gaussian blur to an object.
 * The strength of the blur can be set for x- and y-axis separately (always relative to the stage).
 *
 * @class BlurFilter
 * @contructor
 */
PIXI.BlurFilter = function()
{
    this.blurXFilter = new PIXI.BlurXFilter();
    this.blurYFilter = new PIXI.BlurYFilter();

    this.passes =[this.blurXFilter, this.blurYFilter];
};

/**
 * Sets the strength of both the blurX and blurY properties simultaneously
 *
 * @property blur
 * @type Number the strength of the blur
 * @default 2
 */
Object.defineProperty(PIXI.BlurFilter.prototype, 'blur', {
    get: function() {
        return this.blurXFilter.blur;
    },
    set: function(value) {
        this.blurXFilter.blur = this.blurYFilter.blur = value;
    }
});

/**
 * Sets the strength of the blurX property
 *
 * @property blurX
 * @type Number the strength of the blurX
 * @default 2
 */
Object.defineProperty(PIXI.BlurFilter.prototype, 'blurX', {
    get: function() {
        return this.blurXFilter.blur;
    },
    set: function(value) {
        this.blurXFilter.blur = value;
    }
});

/**
 * Sets the strength of the blurX property
 *
 * @property blurY
 * @type Number the strength of the blurY
 * @default 2
 */
Object.defineProperty(PIXI.BlurFilter.prototype, 'blurY', {
    get: function() {
        return this.blurYFilter.blur;
    },
    set: function(value) {
        this.blurYFilter.blur = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * This inverts your displayObjects colors.
 * @class InvertFilter
 * @contructor
 */
PIXI.InvertFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        invert: {type: '1f', value: 1}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform float invert;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord);',
        '   gl_FragColor.rgb = mix( (vec3(1)-gl_FragColor.rgb) * gl_FragColor.a, gl_FragColor.rgb, 1.0 - invert);',
        //'   gl_FragColor.rgb = gl_FragColor.rgb  * gl_FragColor.a;',
      //  '   gl_FragColor = gl_FragColor * vColor;',
        '}'
    ];
};

PIXI.InvertFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.InvertFilter.prototype.constructor = PIXI.InvertFilter;

/**
The strength of the invert. 1 will fully invert the colors, 0 will make the object its normal color
@property invert
*/
Object.defineProperty(PIXI.InvertFilter.prototype, 'invert', {
    get: function() {
        return this.uniforms.invert.value;
    },
    set: function(value) {
        this.uniforms.invert.value = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * This applies a sepia effect to your displayObjects.
 * @class SepiaFilter
 * @contructor
 */
PIXI.SepiaFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        sepia: {type: '1f', value: 1}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform float sepia;',
        'uniform sampler2D uSampler;',

        'const mat3 sepiaMatrix = mat3(0.3588, 0.7044, 0.1368, 0.2990, 0.5870, 0.1140, 0.2392, 0.4696, 0.0912);',

        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord);',
        '   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb * sepiaMatrix, sepia);',
       // '   gl_FragColor = gl_FragColor * vColor;',
        '}'
    ];
};

PIXI.SepiaFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.SepiaFilter.prototype.constructor = PIXI.SepiaFilter;

/**
The strength of the sepia. 1 will apply the full sepia effect, 0 will make the object its normal color
@property sepia
*/
Object.defineProperty(PIXI.SepiaFilter.prototype, 'sepia', {
    get: function() {
        return this.uniforms.sepia.value;
    },
    set: function(value) {
        this.uniforms.sepia.value = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * This filter applies a twist effect making display objects appear twisted in the given direction
 * @class TwistFilter
 * @contructor
 */
PIXI.TwistFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        radius: {type: '1f', value:0.5},
        angle: {type: '1f', value:5},
        offset: {type: '2f', value:{x:0.5, y:0.5}}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform vec4 dimensions;',
        'uniform sampler2D uSampler;',

        'uniform float radius;',
        'uniform float angle;',
        'uniform vec2 offset;',

        'void main(void) {',
        '   vec2 coord = vTextureCoord - offset;',
        '   float distance = length(coord);',

        '   if (distance < radius) {',
        '       float ratio = (radius - distance) / radius;',
        '       float angleMod = ratio * ratio * angle;',
        '       float s = sin(angleMod);',
        '       float c = cos(angleMod);',
        '       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);',
        '   }',

        '   gl_FragColor = texture2D(uSampler, coord+offset);',
        '}'
    ];
};

PIXI.TwistFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.TwistFilter.prototype.constructor = PIXI.TwistFilter;

/**
 *
 * This point describes the the offset of the twist
 * @property size
 * @type Point
 */
Object.defineProperty(PIXI.TwistFilter.prototype, 'offset', {
    get: function() {
        return this.uniforms.offset.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.offset.value = value;
    }
});

/**
 *
 * This radius describes size of the twist
 * @property size
 * @type Number
 */
Object.defineProperty(PIXI.TwistFilter.prototype, 'radius', {
    get: function() {
        return this.uniforms.radius.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.radius.value = value;
    }
});

/**
 *
 * This radius describes angle of the twist
 * @property angle
 * @type Number
 */
Object.defineProperty(PIXI.TwistFilter.prototype, 'angle', {
    get: function() {
        return this.uniforms.angle.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.angle.value = value;
    }
});
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * This lowers the color depth of your image by the given amount, producing an image with a smaller palette.
 * @class ColorStepFilter
 * @contructor
 */
PIXI.ColorStepFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        step: {type: '1f', value: 5}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D uSampler;',
        'uniform float step;',

        'void main(void) {',
        '   vec4 color = texture2D(uSampler, vTextureCoord);',
        '   color = floor(color * step) / step;',
        '   gl_FragColor = color;',
        '}'
    ];
};

PIXI.ColorStepFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.ColorStepFilter.prototype.constructor = PIXI.ColorStepFilter;

/**
The number of steps.
@property step
*/
Object.defineProperty(PIXI.ColorStepFilter.prototype, 'step', {
    get: function() {
        return this.uniforms.step.value;
    },
    set: function(value) {
        this.uniforms.step.value = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/fun/dotscreen.js
 */

/**
 *
 * This filter applies a dotscreen effect making display objects appear to be made out of black and white halftone dots like an old printer
 * @class DotScreenFilter
 * @contructor
 */
PIXI.DotScreenFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        scale: {type: '1f', value:1},
        angle: {type: '1f', value:5},
        dimensions:   {type: '4fv', value:[0,0,0,0]}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform vec4 dimensions;',
        'uniform sampler2D uSampler;',

        'uniform float angle;',
        'uniform float scale;',

        'float pattern() {',
        '   float s = sin(angle), c = cos(angle);',
        '   vec2 tex = vTextureCoord * dimensions.xy;',
        '   vec2 point = vec2(',
        '       c * tex.x - s * tex.y,',
        '       s * tex.x + c * tex.y',
        '   ) * scale;',
        '   return (sin(point.x) * sin(point.y)) * 4.0;',
        '}',

        'void main() {',
        '   vec4 color = texture2D(uSampler, vTextureCoord);',
        '   float average = (color.r + color.g + color.b) / 3.0;',
        '   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);',
        '}'
    ];
};

PIXI.DotScreenFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.DotScreenFilter.prototype.constructor = PIXI.DotScreenFilter;

/**
 *
 * This describes the the scale
 * @property scale
 * @type Number
 */
Object.defineProperty(PIXI.DotScreenFilter.prototype, 'scale', {
    get: function() {
        return this.uniforms.scale.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.scale.value = value;
    }
});

/**
 *
 * This radius describes angle
 * @property angle
 * @type Number
 */
Object.defineProperty(PIXI.DotScreenFilter.prototype, 'angle', {
    get: function() {
        return this.uniforms.angle.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.angle.value = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.CrossHatchFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        blur: {type: '1f', value: 1 / 512}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform float blur;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);',

        '    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);',

        '    if (lum < 1.00) {',
        '        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {',
        '            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
        '        }',
        '    }',

        '    if (lum < 0.75) {',
        '        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0) {',
        '            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
        '        }',
        '    }',

        '    if (lum < 0.50) {',
        '        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0) {',
        '            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
        '        }',
        '    }',

        '    if (lum < 0.3) {',
        '        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0) {',
        '            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
        '        }',
        '    }',
        '}'
    ];
};

PIXI.CrossHatchFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.CrossHatchFilter.prototype.constructor = PIXI.BlurYFilter;

Object.defineProperty(PIXI.CrossHatchFilter.prototype, 'blur', {
    get: function() {
        return this.uniforms.blur.value / (1/7000);
    },
    set: function(value) {
        //this.padding = value;
        this.uniforms.blur.value = (1/7000) * value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.RGBSplitFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        red: {type: '2f', value: {x:20, y:20}},
        green: {type: '2f', value: {x:-20, y:20}},
        blue: {type: '2f', value: {x:20, y:-20}},
        dimensions:   {type: '4fv', value:[0,0,0,0]}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform vec2 red;',
        'uniform vec2 green;',
        'uniform vec2 blue;',
        'uniform vec4 dimensions;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/dimensions.xy).r;',
        '   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/dimensions.xy).g;',
        '   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/dimensions.xy).b;',
        '   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;',
        '}'
    ];
};

PIXI.RGBSplitFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.RGBSplitFilter.prototype.constructor = PIXI.RGBSplitFilter;

Object.defineProperty(PIXI.RGBSplitFilter.prototype, 'angle', {
    get: function() {
        return this.uniforms.blur.value / (1/7000);
    },
    set: function(value) {
        //this.padding = value;
        this.uniforms.blur.value = (1/7000) * value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PIXI;
        }
        exports.PIXI = PIXI;
    } else if (typeof define !== 'undefined' && define.amd) {
        define(PIXI);
    } else {
        root.PIXI = PIXI;
    }
}).call(this);
;
/*** <End:pixi LoadJs:"components/pixi/bin/pixi.dev.js"> ***/
/*** <End:pixi> ***/