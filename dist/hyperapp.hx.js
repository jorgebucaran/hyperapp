!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.hyperapp=t()}(this,function(){"use strict";function e(t,n,r){n.ns="http://www.w3.org/2000/svg";for(var o=0;o<r.length;o++){var a=r[o];a.data&&e(a.tag,a.data,a.tree)}}function t(e){return function(t,n,r){for(var o in n)o in i&&(n[i[o]]=n[o],delete n[o]);return e(t,n,r)}}function n(e){return e===y||e===m}function r(e){return E.test(e)}var o=function(t,n){var r=[];r.push.apply(r,arguments),r.shift(),r.shift();var o=r[0];return r=Array.isArray(o)||void 0===o?o:r,"svg"===t&&e(t,n,r),{tag:t,data:n||{},tree:[].concat.apply([],r)}},a=t,i={class:"className",for:"htmlFor","http-equiv":"httpEquiv"},s=a,f=0,u=1,l=2,p=3,h=4,c=5,d=6,g=7,v=8,y=9,m=10,b=11,w=12,A=function(e,t){function o(e){return"function"==typeof e?e:"string"==typeof e?e:e&&"object"==typeof e?e:a("",e)}e=s(e),t||(t={});var a=t.concat||function(e,t){return String(e)+String(t)};return function(t){function i(e){var t=[];s===g&&(s=h);for(var r=0;r<e.length;r++){var o=e.charAt(r);s===u&&"<"===o?(A.length&&t.push([u,A]),A="",s=l):">"!==o||n(s)?s===u?A+=o:s===l&&/\s/.test(o)?(t.push([l,A]),A="",s=h):s===l?A+=o:s===h&&/[\w-]/.test(o)?(s=c,A=o):s===h&&/\s/.test(o)?(A.length&&t.push([c,A]),t.push([w])):s===c&&/\s/.test(o)?(t.push([c,A]),A="",s=d):s===c&&"="===o?(t.push([c,A],[b]),A="",s=g):s===c?A+=o:s!==d&&s!==h||"="!==o?s!==d&&s!==h||/\s/.test(o)?s===g&&'"'===o?s=m:s===g&&"'"===o?s=y:s===m&&'"'===o?(t.push([v,A],[w]),A="",s=h):s===y&&"'"===o?(t.push([v,A],[w]),A="",s=h):s!==g||/\s/.test(o)?s===v&&/\s/.test(o)?(t.push([v,A],[w]),A="",s=h):s!==v&&s!==y&&s!==m||(A+=o):(s=v,r--):(t.push([w]),/[\w-]/.test(o)?(A+=o,s=c):s=h):(t.push([b]),s=g):(s===l?t.push([l,A]):s===c?t.push([c,A]):s===v&&A.length&&t.push([v,A]),t.push([p]),A="",s=u)}return s===u&&A.length?(t.push([u,A]),A=""):s===v&&A.length?(t.push([v,A]),A=""):s===m&&A.length?(t.push([v,A]),A=""):s===y&&A.length?(t.push([v,A]),A=""):s===c&&(t.push([c,A]),A=""),t}for(var s=u,A="",E=arguments.length,L=[],k=0;k<t.length;k++)if(k<E-1){var N=arguments[k+1],C=i(t[k]),x=s;x===m&&(x=v),x===y&&(x=v),x===g&&(x=v),x===h&&(x=c),C.push([f,x,N]),L.push.apply(L,C)}else L.push.apply(L,i(t[k]));for(var F=[null,{},[]],S=[[F,-1]],k=0;k<L.length;k++){var M=S[S.length-1][0],C=L[k],D=C[0];if(D===l&&/^\//.test(C[1])){var T=S[S.length-1][1];S.length>1&&(S.pop(),S[S.length-1][0][2][T]=e(M[0],M[1],M[2].length?M[2]:void 0))}else if(D===l){var j=[C[1],{},[]];M[2].push(j),S.push([j,M[2].length-1])}else if(D===c||D===f&&C[1]===c){for(var K,R="";k<L.length;k++)if(L[k][0]===c)R=a(R,L[k][1]);else{if(L[k][0]!==f||L[k][1]!==c)break;if("object"!=typeof L[k][2]||R)R=a(R,L[k][2]);else for(K in L[k][2])L[k][2].hasOwnProperty(K)&&!M[1][K]&&(M[1][K]=L[k][2][K])}L[k][0]===b&&k++;for(var q=k;k<L.length;k++)if(L[k][0]===v||L[k][0]===c)M[1][R]?M[1][R]=a(M[1][R],L[k][1]):M[1][R]=o(L[k][1]);else{if(L[k][0]!==f||L[k][1]!==v&&L[k][1]!==c){!R.length||M[1][R]||k!==q||L[k][0]!==p&&L[k][0]!==w||(M[1][R]=R.toLowerCase());break}M[1][R]?M[1][R]=a(M[1][R],L[k][2]):M[1][R]=o(L[k][2])}}else if(D===c)M[1][C[1]]=!0;else if(D===f&&C[1]===c)M[1][C[2]]=!0;else if(D===p){if(r(M[0])&&S.length){var T=S[S.length-1][1];S.pop(),S[S.length-1][0][2][T]=e(M[0],M[1],M[2].length?M[2]:void 0)}}else if(D===f&&C[1]===u)void 0===C[2]||null===C[2]?C[2]="":C[2]||(C[2]=a("",C[2])),Array.isArray(C[2][0])?M[2].push.apply(M[2],C[2]):M[2].push(C[2]);else if(D===u)M[2].push(C[1]);else if(D!==b&&D!==w)throw new Error("unhandled: "+D)}if(F[2].length>1&&/^\s*$/.test(F[2][0])&&F[2].shift(),F[2].length>2||2===F[2].length&&/\S/.test(F[2][1]))throw new Error("multiple root elements must be wrapped in an enclosing tag");return Array.isArray(F[2][0])&&"string"==typeof F[2][0][0]&&Array.isArray(F[2][0][2])&&(F[2][0]=e(F[2][0][0],F[2][0][1],F[2][0][2])),F[2][0]}},E=RegExp("^("+["area","base","basefont","bgsound","br","col","command","embed","frame","hr","img","input","isindex","keygen","link","meta","param","source","track","wbr","animate","animateTransform","circle","cursor","desc","ellipse","feBlend","feColorMatrix","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","font-face-format","font-face-name","font-face-uri","glyph","glyphRef","hkern","image","line","missing-glyph","mpath","path","polygon","polyline","rect","set","stop","tref","use","view","vkern"].join("|")+")(?:[.#][a-zA-Z0-9-￿_:-]+)*$"),L=function(e){function t(e,t,n){h(w,c=t(e,d),n,0)}function n(e,t){for(var n in e){var o,a=r(n),i={};if(t.replace(new RegExp(a.re,"g"),function(){for(var t=1;t<arguments.length-2;t++)i[a.keys.shift()]=arguments[t];o=function(t,r){return e[n](t,r,i)}}),o)return o}return e["/"]}function r(e){var t=[],n="^"+e.replace(/\//g,"\\/").replace(/:([A-Za-z0-9_]+)/g,function(e,n){return t.push(n),"([A-Za-z0-9_]+)"})+"/?$";return{re:n,keys:t}}function o(e){return"string"===e||"number"===e||"boolean"===e}function a(e,t){setTimeout(function(){e(t)},0)}function i(e,t){var n,r={};if(o(typeof t)||Array.isArray(t))return t;for(n in e)r[n]=e[n];for(n in t)r[n]=t[n];return r}function s(e,t){return e.tag!==t.tag||typeof e!=typeof t||o(typeof e)&&e!==t}function f(e){var t;if(o(typeof e))t=document.createTextNode(e);else{t=e.data&&e.data.ns?document.createElementNS(e.data.ns,e.tag):document.createElement(e.tag);for(var n in e.data)"oncreate"===n?a(e.data[n],t):l(t,n,e.data[n]);for(var r=0;r<e.tree.length;r++)t.appendChild(f(e.tree[r]))}return t}function u(e,t,n){e.removeAttribute("className"===t?"class":t),"boolean"!=typeof n&&"true"!==n&&"false"!==n||(e[t]=!1)}function l(e,t,n,r){if("style"===t)for(var o in n)e.style[o]=n[o];else if("on"===t.substr(0,2)){var a=t.substr(2);e.removeEventListener(a,r),e.addEventListener(a,n)}else"false"===n||n===!1?(e.removeAttribute(t),e[t]=!1):(e.setAttribute(t,n),e[t]=n)}function p(e,t,n){for(var r in i(n,t)){var o=t[r],s=n[r];void 0===o?u(e,r,s):o!==s&&("onupdate"===r?a(o,e):l(e,r,o,s))}}function h(e,t,n,r){if(void 0===n)e.appendChild(f(t));else if(void 0===t){for(;r>0&&!e.childNodes[r];)r--;if(r>=0){var o=e.childNodes[r];if(n&&n.data){var i=n.data.onremove;i&&a(i,o)}e.removeChild(o)}}else if(s(t,n))e.replaceChild(f(t),e.childNodes[r]);else if(t.tag){var o=e.childNodes[r];p(o,t.data,n.data);for(var u=t.tree.length,l=n.tree.length,c=0;c<u||c<l;c++)h(o,t.tree[c],n.tree[c],c)}}var c,d={},g=e.model,v=e.update||{},y=e.effects||{},m=e.subscriptions||e.subs||{},b=i({onAction:Function.prototype,onUpdate:Function.prototype,onError:function(e){throw e}},e.hooks),w=e.root||document.body.appendChild(document.createElement("div")),A=e.view||function(){return w},E="function"==typeof A?void 0:A;E&&(A=n(E,location.pathname),d.setLocation=function(e){t(g,A=n(E,e),c),history.pushState({},"",e)},window.addEventListener("popstate",function(){t(g,A=n(E,location.pathname),c)}),window.onclick=function(e){if(!(e.metaKey||e.shiftKey||e.ctrlKey||e.altKey)){for(var t=e.target;t&&"a"!==t.localName;)t=t.parentNode;if(t&&t.host===location.host&&!t.hasAttribute("data-no-routing")){var n=""===t.hash?n:document.querySelector(t.hash);n?n.scrollIntoView(!0):(d.setLocation(t.pathname),e.preventDefault())}}});for(var L in i(v,y))!function(e){d[e]=function(n){b.onAction(e,n);var r=y[e];if(r)return r(g,d,n,b.onError);var o=v[e],a=g;t(g=i(g,o(g,n)),A,c),b.onUpdate(a,g,n)}}(L);document.addEventListener("DOMContentLoaded",function(){for(var e in m)m[e](g,d,b.onError)}),t(g,A)},k=o,N={html:A(k),app:L,h:k};return N});
//# sourceMappingURL=hyperapp.hx.js.map
