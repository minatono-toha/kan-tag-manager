(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**//*! #__NO_SIDE_EFFECTS__ */function aa(e){const t=Object.create(null);for(const n of e.split(","))t[n]=1;return n=>n in t}const It={},Xn=[],Ne=()=>{},yd=()=>!1,Ti=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),la=e=>e.startsWith("onUpdate:"),se=Object.assign,ca=(e,t)=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)},vd=Object.prototype.hasOwnProperty,yt=(e,t)=>vd.call(e,t),it=Array.isArray,Yn=e=>Ii(e)==="[object Map]",Iu=e=>Ii(e)==="[object Set]",at=e=>typeof e=="function",Ot=e=>typeof e=="string",gn=e=>typeof e=="symbol",Ct=e=>e!==null&&typeof e=="object",wu=e=>(Ct(e)||at(e))&&at(e.then)&&at(e.catch),Au=Object.prototype.toString,Ii=e=>Au.call(e),Ed=e=>Ii(e).slice(8,-1),bu=e=>Ii(e)==="[object Object]",ua=e=>Ot(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,jr=aa(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),wi=e=>{const t=Object.create(null);return n=>t[n]||(t[n]=e(n))},Td=/-(\w)/g,Ie=wi(e=>e.replace(Td,(t,n)=>n?n.toUpperCase():"")),Id=/\B([A-Z])/g,Ln=wi(e=>e.replace(Id,"-$1").toLowerCase()),Ai=wi(e=>e.charAt(0).toUpperCase()+e.slice(1)),io=wi(e=>e?`on${Ai(e)}`:""),sn=(e,t)=>!Object.is(e,t),oo=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},Su=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},wd=e=>{const t=parseFloat(e);return isNaN(t)?e:t};let Ul;const bi=()=>Ul||(Ul=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Pn(e){if(it(e)){const t={};for(let n=0;n<e.length;n++){const r=e[n],s=Ot(r)?Cd(r):Pn(r);if(s)for(const o in s)t[o]=s[o]}return t}else if(Ot(e)||Ct(e))return e}const Ad=/;(?![^(]*\))/g,bd=/:([^]+)/,Sd=/\/\*[^]*?\*\//g;function Cd(e){const t={};return e.replace(Sd,"").split(Ad).forEach(n=>{if(n){const r=n.split(bd);r.length>1&&(t[r[0].trim()]=r[1].trim())}}),t}function Jr(e){let t="";if(Ot(e))t=e;else if(it(e))for(let n=0;n<e.length;n++){const r=Jr(e[n]);r&&(t+=r+" ")}else if(Ct(e))for(const n in e)e[n]&&(t+=n+" ");return t.trim()}const Rd="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Pd=aa(Rd);function Cu(e){return!!e||e===""}const Ru=e=>!!(e&&e.__v_isRef===!0),zt=e=>Ot(e)?e:e==null?"":it(e)||Ct(e)&&(e.toString===Au||!at(e.toString))?Ru(e)?zt(e.value):JSON.stringify(e,Pu,2):String(e),Pu=(e,t)=>Ru(t)?Pu(e,t.value):Yn(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((n,[r,s],o)=>(n[ao(r,o)+" =>"]=s,n),{})}:Iu(t)?{[`Set(${t.size})`]:[...t.values()].map(n=>ao(n))}:gn(t)?ao(t):Ct(t)&&!it(t)&&!bu(t)?String(t):t,ao=(e,t="")=>{var n;return gn(e)?`Symbol(${(n=e.description)!=null?n:t})`:e};/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let ge;class Vu{constructor(t=!1){this.detached=t,this._active=!0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=ge,!t&&ge&&(this.index=(ge.scopes||(ge.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,n;if(this.scopes)for(t=0,n=this.scopes.length;t<n;t++)this.scopes[t].pause();for(t=0,n=this.effects.length;t<n;t++)this.effects[t].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let t,n;if(this.scopes)for(t=0,n=this.scopes.length;t<n;t++)this.scopes[t].resume();for(t=0,n=this.effects.length;t<n;t++)this.effects[t].resume()}}run(t){if(this._active){const n=ge;try{return ge=this,t()}finally{ge=n}}}on(){ge=this}off(){ge=this.parent}stop(t){if(this._active){this._active=!1;let n,r;for(n=0,r=this.effects.length;n<r;n++)this.effects[n].stop();for(this.effects.length=0,n=0,r=this.cleanups.length;n<r;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){for(n=0,r=this.scopes.length;n<r;n++)this.scopes[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!t){const s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.parent=void 0}}}function Vd(e){return new Vu(e)}function Dd(){return ge}let Tt;const lo=new WeakSet;class Du{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,ge&&ge.active&&ge.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,lo.has(this)&&(lo.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Nu(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Bl(this),Ou(this);const t=Tt,n=Se;Tt=this,Se=!0;try{return this.fn()}finally{Mu(this),Tt=t,Se=n,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)da(t);this.deps=this.depsTail=void 0,Bl(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?lo.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){So(this)&&this.run()}get dirty(){return So(this)}}let xu=0,qr,Hr;function Nu(e,t=!1){if(e.flags|=8,t){e.next=Hr,Hr=e;return}e.next=qr,qr=e}function ha(){xu++}function fa(){if(--xu>0)return;if(Hr){let t=Hr;for(Hr=void 0;t;){const n=t.next;t.next=void 0,t.flags&=-9,t=n}}let e;for(;qr;){let t=qr;for(qr=void 0;t;){const n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(r){e||(e=r)}t=n}}if(e)throw e}function Ou(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Mu(e){let t,n=e.depsTail,r=n;for(;r;){const s=r.prevDep;r.version===-1?(r===n&&(n=s),da(r),xd(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=s}e.deps=t,e.depsTail=n}function So(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(ku(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function ku(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Zr))return;e.globalVersion=Zr;const t=e.dep;if(e.flags|=2,t.version>0&&!e.isSSR&&e.deps&&!So(e)){e.flags&=-3;return}const n=Tt,r=Se;Tt=e,Se=!0;try{Ou(e);const s=e.fn(e._value);(t.version===0||sn(s,e._value))&&(e._value=s,t.version++)}catch(s){throw t.version++,s}finally{Tt=n,Se=r,Mu(e),e.flags&=-3}}function da(e,t=!1){const{dep:n,prevSub:r,nextSub:s}=e;if(r&&(r.nextSub=s,e.prevSub=void 0),s&&(s.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let o=n.computed.deps;o;o=o.nextDep)da(o,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function xd(e){const{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}let Se=!0;const Lu=[];function mn(){Lu.push(Se),Se=!1}function _n(){const e=Lu.pop();Se=e===void 0?!0:e}function Bl(e){const{cleanup:t}=e;if(e.cleanup=void 0,t){const n=Tt;Tt=void 0;try{t()}finally{Tt=n}}}let Zr=0;class Nd{constructor(t,n){this.sub=t,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class pa{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0}track(t){if(!Tt||!Se||Tt===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==Tt)n=this.activeLink=new Nd(Tt,this),Tt.deps?(n.prevDep=Tt.depsTail,Tt.depsTail.nextDep=n,Tt.depsTail=n):Tt.deps=Tt.depsTail=n,Fu(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const r=n.nextDep;r.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=r),n.prevDep=Tt.depsTail,n.nextDep=void 0,Tt.depsTail.nextDep=n,Tt.depsTail=n,Tt.deps===n&&(Tt.deps=r)}return n}trigger(t){this.version++,Zr++,this.notify(t)}notify(t){ha();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{fa()}}}function Fu(e){if(e.dep.sc++,e.sub.flags&4){const t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let r=t.deps;r;r=r.nextDep)Fu(r)}const n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}const Co=new WeakMap,Dn=Symbol(""),Ro=Symbol(""),ts=Symbol("");function Zt(e,t,n){if(Se&&Tt){let r=Co.get(e);r||Co.set(e,r=new Map);let s=r.get(n);s||(r.set(n,s=new pa),s.map=r,s.key=n),s.track()}}function He(e,t,n,r,s,o){const a=Co.get(e);if(!a){Zr++;return}const l=u=>{u&&u.trigger()};if(ha(),t==="clear")a.forEach(l);else{const u=it(e),f=u&&ua(n);if(u&&n==="length"){const d=Number(r);a.forEach((m,A)=>{(A==="length"||A===ts||!gn(A)&&A>=d)&&l(m)})}else switch((n!==void 0||a.has(void 0))&&l(a.get(n)),f&&l(a.get(ts)),t){case"add":u?f&&l(a.get("length")):(l(a.get(Dn)),Yn(e)&&l(a.get(Ro)));break;case"delete":u||(l(a.get(Dn)),Yn(e)&&l(a.get(Ro)));break;case"set":Yn(e)&&l(a.get(Dn));break}}fa()}function qn(e){const t=_t(e);return t===e?t:(Zt(t,"iterate",ts),Te(e)?t:t.map(te))}function Si(e){return Zt(e=_t(e),"iterate",ts),e}const Od={__proto__:null,[Symbol.iterator](){return co(this,Symbol.iterator,te)},concat(...e){return qn(this).concat(...e.map(t=>it(t)?qn(t):t))},entries(){return co(this,"entries",e=>(e[1]=te(e[1]),e))},every(e,t){return je(this,"every",e,t,void 0,arguments)},filter(e,t){return je(this,"filter",e,t,n=>n.map(te),arguments)},find(e,t){return je(this,"find",e,t,te,arguments)},findIndex(e,t){return je(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return je(this,"findLast",e,t,te,arguments)},findLastIndex(e,t){return je(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return je(this,"forEach",e,t,void 0,arguments)},includes(...e){return uo(this,"includes",e)},indexOf(...e){return uo(this,"indexOf",e)},join(e){return qn(this).join(e)},lastIndexOf(...e){return uo(this,"lastIndexOf",e)},map(e,t){return je(this,"map",e,t,void 0,arguments)},pop(){return kr(this,"pop")},push(...e){return kr(this,"push",e)},reduce(e,...t){return $l(this,"reduce",e,t)},reduceRight(e,...t){return $l(this,"reduceRight",e,t)},shift(){return kr(this,"shift")},some(e,t){return je(this,"some",e,t,void 0,arguments)},splice(...e){return kr(this,"splice",e)},toReversed(){return qn(this).toReversed()},toSorted(e){return qn(this).toSorted(e)},toSpliced(...e){return qn(this).toSpliced(...e)},unshift(...e){return kr(this,"unshift",e)},values(){return co(this,"values",te)}};function co(e,t,n){const r=Si(e),s=r[t]();return r!==e&&!Te(e)&&(s._next=s.next,s.next=()=>{const o=s._next();return o.value&&(o.value=n(o.value)),o}),s}const Md=Array.prototype;function je(e,t,n,r,s,o){const a=Si(e),l=a!==e&&!Te(e),u=a[t];if(u!==Md[t]){const m=u.apply(e,o);return l?te(m):m}let f=n;a!==e&&(l?f=function(m,A){return n.call(this,te(m),A,e)}:n.length>2&&(f=function(m,A){return n.call(this,m,A,e)}));const d=u.call(a,f,r);return l&&s?s(d):d}function $l(e,t,n,r){const s=Si(e);let o=n;return s!==e&&(Te(e)?n.length>3&&(o=function(a,l,u){return n.call(this,a,l,u,e)}):o=function(a,l,u){return n.call(this,a,te(l),u,e)}),s[t](o,...r)}function uo(e,t,n){const r=_t(e);Zt(r,"iterate",ts);const s=r[t](...n);return(s===-1||s===!1)&&ya(n[0])?(n[0]=_t(n[0]),r[t](...n)):s}function kr(e,t,n=[]){mn(),ha();const r=_t(e)[t].apply(e,n);return fa(),_n(),r}const kd=aa("__proto__,__v_isRef,__isVue"),Uu=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(gn));function Ld(e){gn(e)||(e=String(e));const t=_t(this);return Zt(t,"has",e),t.hasOwnProperty(e)}class Bu{constructor(t=!1,n=!1){this._isReadonly=t,this._isShallow=n}get(t,n,r){if(n==="__v_skip")return t.__v_skip;const s=this._isReadonly,o=this._isShallow;if(n==="__v_isReactive")return!s;if(n==="__v_isReadonly")return s;if(n==="__v_isShallow")return o;if(n==="__v_raw")return r===(s?o?Gd:Hu:o?qu:ju).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(r)?t:void 0;const a=it(t);if(!s){let u;if(a&&(u=Od[n]))return u;if(n==="hasOwnProperty")return Ld}const l=Reflect.get(t,n,re(t)?t:r);return(gn(n)?Uu.has(n):kd(n))||(s||Zt(t,"get",n),o)?l:re(l)?a&&ua(n)?l:l.value:Ct(l)?s?zu(l):ma(l):l}}class $u extends Bu{constructor(t=!1){super(!1,t)}set(t,n,r,s){let o=t[n];if(!this._isShallow){const u=On(o);if(!Te(r)&&!On(r)&&(o=_t(o),r=_t(r)),!it(t)&&re(o)&&!re(r))return u?!1:(o.value=r,!0)}const a=it(t)&&ua(n)?Number(n)<t.length:yt(t,n),l=Reflect.set(t,n,r,re(t)?t:s);return t===_t(s)&&(a?sn(r,o)&&He(t,"set",n,r):He(t,"add",n,r)),l}deleteProperty(t,n){const r=yt(t,n);t[n];const s=Reflect.deleteProperty(t,n);return s&&r&&He(t,"delete",n,void 0),s}has(t,n){const r=Reflect.has(t,n);return(!gn(n)||!Uu.has(n))&&Zt(t,"has",n),r}ownKeys(t){return Zt(t,"iterate",it(t)?"length":Dn),Reflect.ownKeys(t)}}class Fd extends Bu{constructor(t=!1){super(!0,t)}set(t,n){return!0}deleteProperty(t,n){return!0}}const Ud=new $u,Bd=new Fd,$d=new $u(!0);const Po=e=>e,Ms=e=>Reflect.getPrototypeOf(e);function jd(e,t,n){return function(...r){const s=this.__v_raw,o=_t(s),a=Yn(o),l=e==="entries"||e===Symbol.iterator&&a,u=e==="keys"&&a,f=s[e](...r),d=n?Po:t?Vo:te;return!t&&Zt(o,"iterate",u?Ro:Dn),{next(){const{value:m,done:A}=f.next();return A?{value:m,done:A}:{value:l?[d(m[0]),d(m[1])]:d(m),done:A}},[Symbol.iterator](){return this}}}}function ks(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}function qd(e,t){const n={get(s){const o=this.__v_raw,a=_t(o),l=_t(s);e||(sn(s,l)&&Zt(a,"get",s),Zt(a,"get",l));const{has:u}=Ms(a),f=t?Po:e?Vo:te;if(u.call(a,s))return f(o.get(s));if(u.call(a,l))return f(o.get(l));o!==a&&o.get(s)},get size(){const s=this.__v_raw;return!e&&Zt(_t(s),"iterate",Dn),Reflect.get(s,"size",s)},has(s){const o=this.__v_raw,a=_t(o),l=_t(s);return e||(sn(s,l)&&Zt(a,"has",s),Zt(a,"has",l)),s===l?o.has(s):o.has(s)||o.has(l)},forEach(s,o){const a=this,l=a.__v_raw,u=_t(l),f=t?Po:e?Vo:te;return!e&&Zt(u,"iterate",Dn),l.forEach((d,m)=>s.call(o,f(d),f(m),a))}};return se(n,e?{add:ks("add"),set:ks("set"),delete:ks("delete"),clear:ks("clear")}:{add(s){!t&&!Te(s)&&!On(s)&&(s=_t(s));const o=_t(this);return Ms(o).has.call(o,s)||(o.add(s),He(o,"add",s,s)),this},set(s,o){!t&&!Te(o)&&!On(o)&&(o=_t(o));const a=_t(this),{has:l,get:u}=Ms(a);let f=l.call(a,s);f||(s=_t(s),f=l.call(a,s));const d=u.call(a,s);return a.set(s,o),f?sn(o,d)&&He(a,"set",s,o):He(a,"add",s,o),this},delete(s){const o=_t(this),{has:a,get:l}=Ms(o);let u=a.call(o,s);u||(s=_t(s),u=a.call(o,s)),l&&l.call(o,s);const f=o.delete(s);return u&&He(o,"delete",s,void 0),f},clear(){const s=_t(this),o=s.size!==0,a=s.clear();return o&&He(s,"clear",void 0,void 0),a}}),["keys","values","entries",Symbol.iterator].forEach(s=>{n[s]=jd(s,e,t)}),n}function ga(e,t){const n=qd(e,t);return(r,s,o)=>s==="__v_isReactive"?!e:s==="__v_isReadonly"?e:s==="__v_raw"?r:Reflect.get(yt(n,s)&&s in r?n:r,s,o)}const Hd={get:ga(!1,!1)},zd={get:ga(!1,!0)},Kd={get:ga(!0,!1)};const ju=new WeakMap,qu=new WeakMap,Hu=new WeakMap,Gd=new WeakMap;function Wd(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function Qd(e){return e.__v_skip||!Object.isExtensible(e)?0:Wd(Ed(e))}function ma(e){return On(e)?e:_a(e,!1,Ud,Hd,ju)}function Xd(e){return _a(e,!1,$d,zd,qu)}function zu(e){return _a(e,!0,Bd,Kd,Hu)}function _a(e,t,n,r,s){if(!Ct(e)||e.__v_raw&&!(t&&e.__v_isReactive))return e;const o=s.get(e);if(o)return o;const a=Qd(e);if(a===0)return e;const l=new Proxy(e,a===2?r:n);return s.set(e,l),l}function Jn(e){return On(e)?Jn(e.__v_raw):!!(e&&e.__v_isReactive)}function On(e){return!!(e&&e.__v_isReadonly)}function Te(e){return!!(e&&e.__v_isShallow)}function ya(e){return e?!!e.__v_raw:!1}function _t(e){const t=e&&e.__v_raw;return t?_t(t):e}function Ku(e){return!yt(e,"__v_skip")&&Object.isExtensible(e)&&Su(e,"__v_skip",!0),e}const te=e=>Ct(e)?ma(e):e,Vo=e=>Ct(e)?zu(e):e;function re(e){return e?e.__v_isRef===!0:!1}function Nt(e){return Yd(e,!1)}function Yd(e,t){return re(e)?e:new Jd(e,t)}class Jd{constructor(t,n){this.dep=new pa,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?t:_t(t),this._value=n?t:te(t),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(t){const n=this._rawValue,r=this.__v_isShallow||Te(t)||On(t);t=r?t:_t(t),sn(t,n)&&(this._rawValue=t,this._value=r?t:te(t),this.dep.trigger())}}function Zs(e){return re(e)?e.value:e}const Zd={get:(e,t,n)=>t==="__v_raw"?e:Zs(Reflect.get(e,t,n)),set:(e,t,n,r)=>{const s=e[t];return re(s)&&!re(n)?(s.value=n,!0):Reflect.set(e,t,n,r)}};function Gu(e){return Jn(e)?e:new Proxy(e,Zd)}class tp{constructor(t,n,r){this.fn=t,this.setter=n,this._value=void 0,this.dep=new pa(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Zr-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&Tt!==this)return Nu(this,!0),!0}get value(){const t=this.dep.track();return ku(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}}function ep(e,t,n=!1){let r,s;return at(e)?r=e:(r=e.get,s=e.set),new tp(r,s,n)}const Ls={},ti=new WeakMap;let Cn;function np(e,t=!1,n=Cn){if(n){let r=ti.get(n);r||ti.set(n,r=[]),r.push(e)}}function rp(e,t,n=It){const{immediate:r,deep:s,once:o,scheduler:a,augmentJob:l,call:u}=n,f=N=>s?N:Te(N)||s===!1||s===0?en(N,1):en(N);let d,m,A,C,x=!1,L=!1;if(re(e)?(m=()=>e.value,x=Te(e)):Jn(e)?(m=()=>f(e),x=!0):it(e)?(L=!0,x=e.some(N=>Jn(N)||Te(N)),m=()=>e.map(N=>{if(re(N))return N.value;if(Jn(N))return f(N);if(at(N))return u?u(N,2):N()})):at(e)?t?m=u?()=>u(e,2):e:m=()=>{if(A){mn();try{A()}finally{_n()}}const N=Cn;Cn=d;try{return u?u(e,3,[C]):e(C)}finally{Cn=N}}:m=Ne,t&&s){const N=m,W=s===!0?1/0:s;m=()=>en(N(),W)}const $=Dd(),Y=()=>{d.stop(),$&&$.active&&ca($.effects,d)};if(o&&t){const N=t;t=(...W)=>{N(...W),Y()}}let z=L?new Array(e.length).fill(Ls):Ls;const G=N=>{if(!(!(d.flags&1)||!d.dirty&&!N))if(t){const W=d.run();if(s||x||(L?W.some((X,E)=>sn(X,z[E])):sn(W,z))){A&&A();const X=Cn;Cn=d;try{const E=[W,z===Ls?void 0:L&&z[0]===Ls?[]:z,C];u?u(t,3,E):t(...E),z=W}finally{Cn=X}}}else d.run()};return l&&l(G),d=new Du(m),d.scheduler=a?()=>a(G,!1):G,C=N=>np(N,!1,d),A=d.onStop=()=>{const N=ti.get(d);if(N){if(u)u(N,4);else for(const W of N)W();ti.delete(d)}},t?r?G(!0):z=d.run():a?a(G.bind(null,!0),!0):d.run(),Y.pause=d.pause.bind(d),Y.resume=d.resume.bind(d),Y.stop=Y,Y}function en(e,t=1/0,n){if(t<=0||!Ct(e)||e.__v_skip||(n=n||new Set,n.has(e)))return e;if(n.add(e),t--,re(e))en(e.value,t,n);else if(it(e))for(let r=0;r<e.length;r++)en(e[r],t,n);else if(Iu(e)||Yn(e))e.forEach(r=>{en(r,t,n)});else if(bu(e)){for(const r in e)en(e[r],t,n);for(const r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&en(e[r],t,n)}return e}/**
* @vue/runtime-core v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function fs(e,t,n,r){try{return r?e(...r):e()}catch(s){Ci(s,t,n)}}function Me(e,t,n,r){if(at(e)){const s=fs(e,t,n,r);return s&&wu(s)&&s.catch(o=>{Ci(o,t,n)}),s}if(it(e)){const s=[];for(let o=0;o<e.length;o++)s.push(Me(e[o],t,n,r));return s}}function Ci(e,t,n,r=!0){const s=t?t.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:a}=t&&t.appContext.config||It;if(t){let l=t.parent;const u=t.proxy,f=`https://vuejs.org/error-reference/#runtime-${n}`;for(;l;){const d=l.ec;if(d){for(let m=0;m<d.length;m++)if(d[m](e,u,f)===!1)return}l=l.parent}if(o){mn(),fs(o,null,10,[e,u,f]),_n();return}}sp(e,n,s,r,a)}function sp(e,t,n,r=!0,s=!1){if(s)throw e;console.error(e)}const ae=[];let Pe=-1;const Zn=[];let Ze=null,Hn=0;const Wu=Promise.resolve();let ei=null;function ip(e){const t=ei||Wu;return e?t.then(this?e.bind(this):e):t}function op(e){let t=Pe+1,n=ae.length;for(;t<n;){const r=t+n>>>1,s=ae[r],o=es(s);o<e||o===e&&s.flags&2?t=r+1:n=r}return t}function va(e){if(!(e.flags&1)){const t=es(e),n=ae[ae.length-1];!n||!(e.flags&2)&&t>=es(n)?ae.push(e):ae.splice(op(t),0,e),e.flags|=1,Qu()}}function Qu(){ei||(ei=Wu.then(Yu))}function ap(e){it(e)?Zn.push(...e):Ze&&e.id===-1?Ze.splice(Hn+1,0,e):e.flags&1||(Zn.push(e),e.flags|=1),Qu()}function jl(e,t,n=Pe+1){for(;n<ae.length;n++){const r=ae[n];if(r&&r.flags&2){if(e&&r.id!==e.uid)continue;ae.splice(n,1),n--,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function Xu(e){if(Zn.length){const t=[...new Set(Zn)].sort((n,r)=>es(n)-es(r));if(Zn.length=0,Ze){Ze.push(...t);return}for(Ze=t,Hn=0;Hn<Ze.length;Hn++){const n=Ze[Hn];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}Ze=null,Hn=0}}const es=e=>e.id==null?e.flags&2?-1:1/0:e.id;function Yu(e){try{for(Pe=0;Pe<ae.length;Pe++){const t=ae[Pe];t&&!(t.flags&8)&&(t.flags&4&&(t.flags&=-2),fs(t,t.i,t.i?15:14),t.flags&4||(t.flags&=-2))}}finally{for(;Pe<ae.length;Pe++){const t=ae[Pe];t&&(t.flags&=-2)}Pe=-1,ae.length=0,Xu(),ei=null,(ae.length||Zn.length)&&Yu()}}let be=null,Ju=null;function ni(e){const t=be;return be=e,Ju=e&&e.type.__scopeId||null,t}function lp(e,t=be,n){if(!t||e._n)return e;const r=(...s)=>{r._d&&Jl(-1);const o=ni(t);let a;try{a=e(...s)}finally{ni(o),r._d&&Jl(1)}return a};return r._n=!0,r._c=!0,r._d=!0,r}function bn(e,t,n,r){const s=e.dirs,o=t&&t.dirs;for(let a=0;a<s.length;a++){const l=s[a];o&&(l.oldValue=o[a].value);let u=l.dir[r];u&&(mn(),Me(u,n,8,[e.el,l,e,t]),_n())}}const cp=Symbol("_vte"),up=e=>e.__isTeleport;function Ea(e,t){e.shapeFlag&6&&e.component?(e.transition=t,Ea(e.component.subTree,t)):e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}/*! #__NO_SIDE_EFFECTS__ */function gr(e,t){return at(e)?se({name:e.name},t,{setup:e}):e}function Zu(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}function ri(e,t,n,r,s=!1){if(it(e)){e.forEach((x,L)=>ri(x,t&&(it(t)?t[L]:t),n,r,s));return}if(zr(r)&&!s){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&ri(e,t,n,r.component.subTree);return}const o=r.shapeFlag&4?wa(r.component):r.el,a=s?null:o,{i:l,r:u}=e,f=t&&t.r,d=l.refs===It?l.refs={}:l.refs,m=l.setupState,A=_t(m),C=m===It?()=>!1:x=>yt(A,x);if(f!=null&&f!==u&&(Ot(f)?(d[f]=null,C(f)&&(m[f]=null)):re(f)&&(f.value=null)),at(u))fs(u,l,12,[a,d]);else{const x=Ot(u),L=re(u);if(x||L){const $=()=>{if(e.f){const Y=x?C(u)?m[u]:d[u]:u.value;s?it(Y)&&ca(Y,o):it(Y)?Y.includes(o)||Y.push(o):x?(d[u]=[o],C(u)&&(m[u]=d[u])):(u.value=[o],e.k&&(d[e.k]=u.value))}else x?(d[u]=a,C(u)&&(m[u]=a)):L&&(u.value=a,e.k&&(d[e.k]=a))};a?($.id=-1,pe($,n)):$()}}}bi().requestIdleCallback;bi().cancelIdleCallback;const zr=e=>!!e.type.__asyncLoader,th=e=>e.type.__isKeepAlive;function hp(e,t){eh(e,"a",t)}function fp(e,t){eh(e,"da",t)}function eh(e,t,n=ne){const r=e.__wdc||(e.__wdc=()=>{let s=n;for(;s;){if(s.isDeactivated)return;s=s.parent}return e()});if(Ri(t,r,n),n){let s=n.parent;for(;s&&s.parent;)th(s.parent.vnode)&&dp(r,t,n,s),s=s.parent}}function dp(e,t,n,r){const s=Ri(t,e,r,!0);rh(()=>{ca(r[t],s)},n)}function Ri(e,t,n=ne,r=!1){if(n){const s=n[e]||(n[e]=[]),o=t.__weh||(t.__weh=(...a)=>{mn();const l=ds(n),u=Me(t,n,e,a);return l(),_n(),u});return r?s.unshift(o):s.push(o),o}}const Ge=e=>(t,n=ne)=>{(!ss||e==="sp")&&Ri(e,(...r)=>t(...r),n)},pp=Ge("bm"),nh=Ge("m"),gp=Ge("bu"),mp=Ge("u"),_p=Ge("bum"),rh=Ge("um"),yp=Ge("sp"),vp=Ge("rtg"),Ep=Ge("rtc");function Tp(e,t=ne){Ri("ec",e,t)}const Ip="components";function Fs(e,t){return Ap(Ip,e,!0,t)||e}const wp=Symbol.for("v-ndc");function Ap(e,t,n=!0,r=!1){const s=be||ne;if(s){const o=s.type;{const l=hg(o,!1);if(l&&(l===t||l===Ie(t)||l===Ai(Ie(t))))return o}const a=ql(s[e]||o[e],t)||ql(s.appContext[e],t);return!a&&r?o:a}}function ql(e,t){return e&&(e[t]||e[Ie(t)]||e[Ai(Ie(t))])}function tr(e,t,n,r){let s;const o=n,a=it(e);if(a||Ot(e)){const l=a&&Jn(e);let u=!1;l&&(u=!Te(e),e=Si(e)),s=new Array(e.length);for(let f=0,d=e.length;f<d;f++)s[f]=t(u?te(e[f]):e[f],f,void 0,o)}else if(typeof e=="number"){s=new Array(e);for(let l=0;l<e;l++)s[l]=t(l+1,l,void 0,o)}else if(Ct(e))if(e[Symbol.iterator])s=Array.from(e,(l,u)=>t(l,u,void 0,o));else{const l=Object.keys(e);s=new Array(l.length);for(let u=0,f=l.length;u<f;u++){const d=l[u];s[u]=t(e[d],d,u,o)}}else s=[];return s}const Do=e=>e?Sh(e)?wa(e):Do(e.parent):null,Kr=se(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>Do(e.parent),$root:e=>Do(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>ih(e),$forceUpdate:e=>e.f||(e.f=()=>{va(e.update)}),$nextTick:e=>e.n||(e.n=ip.bind(e.proxy)),$watch:e=>Kp.bind(e)}),ho=(e,t)=>e!==It&&!e.__isScriptSetup&&yt(e,t),bp={get({_:e},t){if(t==="__v_skip")return!0;const{ctx:n,setupState:r,data:s,props:o,accessCache:a,type:l,appContext:u}=e;let f;if(t[0]!=="$"){const C=a[t];if(C!==void 0)switch(C){case 1:return r[t];case 2:return s[t];case 4:return n[t];case 3:return o[t]}else{if(ho(r,t))return a[t]=1,r[t];if(s!==It&&yt(s,t))return a[t]=2,s[t];if((f=e.propsOptions[0])&&yt(f,t))return a[t]=3,o[t];if(n!==It&&yt(n,t))return a[t]=4,n[t];xo&&(a[t]=0)}}const d=Kr[t];let m,A;if(d)return t==="$attrs"&&Zt(e.attrs,"get",""),d(e);if((m=l.__cssModules)&&(m=m[t]))return m;if(n!==It&&yt(n,t))return a[t]=4,n[t];if(A=u.config.globalProperties,yt(A,t))return A[t]},set({_:e},t,n){const{data:r,setupState:s,ctx:o}=e;return ho(s,t)?(s[t]=n,!0):r!==It&&yt(r,t)?(r[t]=n,!0):yt(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(o[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:r,appContext:s,propsOptions:o}},a){let l;return!!n[a]||e!==It&&yt(e,a)||ho(t,a)||(l=o[0])&&yt(l,a)||yt(r,a)||yt(Kr,a)||yt(s.config.globalProperties,a)},defineProperty(e,t,n){return n.get!=null?e._.accessCache[t]=0:yt(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};function Hl(e){return it(e)?e.reduce((t,n)=>(t[n]=null,t),{}):e}let xo=!0;function Sp(e){const t=ih(e),n=e.proxy,r=e.ctx;xo=!1,t.beforeCreate&&zl(t.beforeCreate,e,"bc");const{data:s,computed:o,methods:a,watch:l,provide:u,inject:f,created:d,beforeMount:m,mounted:A,beforeUpdate:C,updated:x,activated:L,deactivated:$,beforeDestroy:Y,beforeUnmount:z,destroyed:G,unmounted:N,render:W,renderTracked:X,renderTriggered:E,errorCaptured:g,serverPrefetch:v,expose:I,inheritAttrs:w,components:S,directives:y,filters:fe}=t;if(f&&Cp(f,r,null),a)for(const vt in a){const gt=a[vt];at(gt)&&(r[vt]=gt.bind(n))}if(s){const vt=s.call(n,n);Ct(vt)&&(e.data=ma(vt))}if(xo=!0,o)for(const vt in o){const gt=o[vt],we=at(gt)?gt.bind(n,n):at(gt.get)?gt.get.bind(n,n):Ne,yn=!at(gt)&&at(gt.set)?gt.set.bind(n):Ne,Fe=is({get:we,set:yn});Object.defineProperty(r,vt,{enumerable:!0,configurable:!0,get:()=>Fe.value,set:Mt=>Fe.value=Mt})}if(l)for(const vt in l)sh(l[vt],r,n,vt);if(u){const vt=at(u)?u.call(n):u;Reflect.ownKeys(vt).forEach(gt=>{Np(gt,vt[gt])})}d&&zl(d,e,"c");function Bt(vt,gt){it(gt)?gt.forEach(we=>vt(we.bind(n))):gt&&vt(gt.bind(n))}if(Bt(pp,m),Bt(nh,A),Bt(gp,C),Bt(mp,x),Bt(hp,L),Bt(fp,$),Bt(Tp,g),Bt(Ep,X),Bt(vp,E),Bt(_p,z),Bt(rh,N),Bt(yp,v),it(I))if(I.length){const vt=e.exposed||(e.exposed={});I.forEach(gt=>{Object.defineProperty(vt,gt,{get:()=>n[gt],set:we=>n[gt]=we})})}else e.exposed||(e.exposed={});W&&e.render===Ne&&(e.render=W),w!=null&&(e.inheritAttrs=w),S&&(e.components=S),y&&(e.directives=y),v&&Zu(e)}function Cp(e,t,n=Ne){it(e)&&(e=No(e));for(const r in e){const s=e[r];let o;Ct(s)?"default"in s?o=zs(s.from||r,s.default,!0):o=zs(s.from||r):o=zs(s),re(o)?Object.defineProperty(t,r,{enumerable:!0,configurable:!0,get:()=>o.value,set:a=>o.value=a}):t[r]=o}}function zl(e,t,n){Me(it(e)?e.map(r=>r.bind(t.proxy)):e.bind(t.proxy),t,n)}function sh(e,t,n,r){let s=r.includes(".")?vh(n,r):()=>n[r];if(Ot(e)){const o=t[e];at(o)&&nr(s,o)}else if(at(e))nr(s,e.bind(n));else if(Ct(e))if(it(e))e.forEach(o=>sh(o,t,n,r));else{const o=at(e.handler)?e.handler.bind(n):t[e.handler];at(o)&&nr(s,o,e)}}function ih(e){const t=e.type,{mixins:n,extends:r}=t,{mixins:s,optionsCache:o,config:{optionMergeStrategies:a}}=e.appContext,l=o.get(t);let u;return l?u=l:!s.length&&!n&&!r?u=t:(u={},s.length&&s.forEach(f=>si(u,f,a,!0)),si(u,t,a)),Ct(t)&&o.set(t,u),u}function si(e,t,n,r=!1){const{mixins:s,extends:o}=t;o&&si(e,o,n,!0),s&&s.forEach(a=>si(e,a,n,!0));for(const a in t)if(!(r&&a==="expose")){const l=Rp[a]||n&&n[a];e[a]=l?l(e[a],t[a]):t[a]}return e}const Rp={data:Kl,props:Gl,emits:Gl,methods:Fr,computed:Fr,beforeCreate:oe,created:oe,beforeMount:oe,mounted:oe,beforeUpdate:oe,updated:oe,beforeDestroy:oe,beforeUnmount:oe,destroyed:oe,unmounted:oe,activated:oe,deactivated:oe,errorCaptured:oe,serverPrefetch:oe,components:Fr,directives:Fr,watch:Vp,provide:Kl,inject:Pp};function Kl(e,t){return t?e?function(){return se(at(e)?e.call(this,this):e,at(t)?t.call(this,this):t)}:t:e}function Pp(e,t){return Fr(No(e),No(t))}function No(e){if(it(e)){const t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function oe(e,t){return e?[...new Set([].concat(e,t))]:t}function Fr(e,t){return e?se(Object.create(null),e,t):t}function Gl(e,t){return e?it(e)&&it(t)?[...new Set([...e,...t])]:se(Object.create(null),Hl(e),Hl(t??{})):t}function Vp(e,t){if(!e)return t;if(!t)return e;const n=se(Object.create(null),e);for(const r in t)n[r]=oe(e[r],t[r]);return n}function oh(){return{app:null,config:{isNativeTag:yd,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Dp=0;function xp(e,t){return function(r,s=null){at(r)||(r=se({},r)),s!=null&&!Ct(s)&&(s=null);const o=oh(),a=new WeakSet,l=[];let u=!1;const f=o.app={_uid:Dp++,_component:r,_props:s,_container:null,_context:o,_instance:null,version:dg,get config(){return o.config},set config(d){},use(d,...m){return a.has(d)||(d&&at(d.install)?(a.add(d),d.install(f,...m)):at(d)&&(a.add(d),d(f,...m))),f},mixin(d){return o.mixins.includes(d)||o.mixins.push(d),f},component(d,m){return m?(o.components[d]=m,f):o.components[d]},directive(d,m){return m?(o.directives[d]=m,f):o.directives[d]},mount(d,m,A){if(!u){const C=f._ceVNode||_e(r,s);return C.appContext=o,A===!0?A="svg":A===!1&&(A=void 0),e(C,d,A),u=!0,f._container=d,d.__vue_app__=f,wa(C.component)}},onUnmount(d){l.push(d)},unmount(){u&&(Me(l,f._instance,16),e(null,f._container),delete f._container.__vue_app__)},provide(d,m){return o.provides[d]=m,f},runWithContext(d){const m=er;er=f;try{return d()}finally{er=m}}};return f}}let er=null;function Np(e,t){if(ne){let n=ne.provides;const r=ne.parent&&ne.parent.provides;r===n&&(n=ne.provides=Object.create(r)),n[e]=t}}function zs(e,t,n=!1){const r=ne||be;if(r||er){const s=er?er._context.provides:r?r.parent==null?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(s&&e in s)return s[e];if(arguments.length>1)return n&&at(t)?t.call(r&&r.proxy):t}}const ah={},lh=()=>Object.create(ah),ch=e=>Object.getPrototypeOf(e)===ah;function Op(e,t,n,r=!1){const s={},o=lh();e.propsDefaults=Object.create(null),uh(e,t,s,o);for(const a in e.propsOptions[0])a in s||(s[a]=void 0);n?e.props=r?s:Xd(s):e.type.props?e.props=s:e.props=o,e.attrs=o}function Mp(e,t,n,r){const{props:s,attrs:o,vnode:{patchFlag:a}}=e,l=_t(s),[u]=e.propsOptions;let f=!1;if((r||a>0)&&!(a&16)){if(a&8){const d=e.vnode.dynamicProps;for(let m=0;m<d.length;m++){let A=d[m];if(Pi(e.emitsOptions,A))continue;const C=t[A];if(u)if(yt(o,A))C!==o[A]&&(o[A]=C,f=!0);else{const x=Ie(A);s[x]=Oo(u,l,x,C,e,!1)}else C!==o[A]&&(o[A]=C,f=!0)}}}else{uh(e,t,s,o)&&(f=!0);let d;for(const m in l)(!t||!yt(t,m)&&((d=Ln(m))===m||!yt(t,d)))&&(u?n&&(n[m]!==void 0||n[d]!==void 0)&&(s[m]=Oo(u,l,m,void 0,e,!0)):delete s[m]);if(o!==l)for(const m in o)(!t||!yt(t,m))&&(delete o[m],f=!0)}f&&He(e.attrs,"set","")}function uh(e,t,n,r){const[s,o]=e.propsOptions;let a=!1,l;if(t)for(let u in t){if(jr(u))continue;const f=t[u];let d;s&&yt(s,d=Ie(u))?!o||!o.includes(d)?n[d]=f:(l||(l={}))[d]=f:Pi(e.emitsOptions,u)||(!(u in r)||f!==r[u])&&(r[u]=f,a=!0)}if(o){const u=_t(n),f=l||It;for(let d=0;d<o.length;d++){const m=o[d];n[m]=Oo(s,u,m,f[m],e,!yt(f,m))}}return a}function Oo(e,t,n,r,s,o){const a=e[n];if(a!=null){const l=yt(a,"default");if(l&&r===void 0){const u=a.default;if(a.type!==Function&&!a.skipFactory&&at(u)){const{propsDefaults:f}=s;if(n in f)r=f[n];else{const d=ds(s);r=f[n]=u.call(null,t),d()}}else r=u;s.ce&&s.ce._setProp(n,r)}a[0]&&(o&&!l?r=!1:a[1]&&(r===""||r===Ln(n))&&(r=!0))}return r}const kp=new WeakMap;function hh(e,t,n=!1){const r=n?kp:t.propsCache,s=r.get(e);if(s)return s;const o=e.props,a={},l=[];let u=!1;if(!at(e)){const d=m=>{u=!0;const[A,C]=hh(m,t,!0);se(a,A),C&&l.push(...C)};!n&&t.mixins.length&&t.mixins.forEach(d),e.extends&&d(e.extends),e.mixins&&e.mixins.forEach(d)}if(!o&&!u)return Ct(e)&&r.set(e,Xn),Xn;if(it(o))for(let d=0;d<o.length;d++){const m=Ie(o[d]);Wl(m)&&(a[m]=It)}else if(o)for(const d in o){const m=Ie(d);if(Wl(m)){const A=o[d],C=a[m]=it(A)||at(A)?{type:A}:se({},A),x=C.type;let L=!1,$=!0;if(it(x))for(let Y=0;Y<x.length;++Y){const z=x[Y],G=at(z)&&z.name;if(G==="Boolean"){L=!0;break}else G==="String"&&($=!1)}else L=at(x)&&x.name==="Boolean";C[0]=L,C[1]=$,(L||yt(C,"default"))&&l.push(m)}}const f=[a,l];return Ct(e)&&r.set(e,f),f}function Wl(e){return e[0]!=="$"&&!jr(e)}const fh=e=>e[0]==="_"||e==="$stable",Ta=e=>it(e)?e.map(De):[De(e)],Lp=(e,t,n)=>{if(t._n)return t;const r=lp((...s)=>Ta(t(...s)),n);return r._c=!1,r},dh=(e,t,n)=>{const r=e._ctx;for(const s in e){if(fh(s))continue;const o=e[s];if(at(o))t[s]=Lp(s,o,r);else if(o!=null){const a=Ta(o);t[s]=()=>a}}},ph=(e,t)=>{const n=Ta(t);e.slots.default=()=>n},gh=(e,t,n)=>{for(const r in t)(n||r!=="_")&&(e[r]=t[r])},Fp=(e,t,n)=>{const r=e.slots=lh();if(e.vnode.shapeFlag&32){const s=t._;s?(gh(r,t,n),n&&Su(r,"_",s,!0)):dh(t,r)}else t&&ph(e,t)},Up=(e,t,n)=>{const{vnode:r,slots:s}=e;let o=!0,a=It;if(r.shapeFlag&32){const l=t._;l?n&&l===1?o=!1:gh(s,t,n):(o=!t.$stable,dh(t,s)),a=t}else t&&(ph(e,t),a={default:1});if(o)for(const l in s)!fh(l)&&a[l]==null&&delete s[l]},pe=Zp;function Bp(e){return $p(e)}function $p(e,t){const n=bi();n.__VUE__=!0;const{insert:r,remove:s,patchProp:o,createElement:a,createText:l,createComment:u,setText:f,setElementText:d,parentNode:m,nextSibling:A,setScopeId:C=Ne,insertStaticContent:x}=e,L=(_,T,P,O=null,D=null,M=null,q=void 0,U=null,F=!!T.dynamicChildren)=>{if(_===T)return;_&&!Lr(_,T)&&(O=Ue(_),Mt(_,D,M,!0),_=null),T.patchFlag===-2&&(F=!1,T.dynamicChildren=null);const{type:k,ref:J,shapeFlag:H}=T;switch(k){case Vi:$(_,T,P,O);break;case Mn:Y(_,T,P,O);break;case po:_==null&&z(T,P,O,q);break;case le:S(_,T,P,O,D,M,q,U,F);break;default:H&1?W(_,T,P,O,D,M,q,U,F):H&6?y(_,T,P,O,D,M,q,U,F):(H&64||H&128)&&k.process(_,T,P,O,D,M,q,U,F,Ce)}J!=null&&D&&ri(J,_&&_.ref,M,T||_,!T)},$=(_,T,P,O)=>{if(_==null)r(T.el=l(T.children),P,O);else{const D=T.el=_.el;T.children!==_.children&&f(D,T.children)}},Y=(_,T,P,O)=>{_==null?r(T.el=u(T.children||""),P,O):T.el=_.el},z=(_,T,P,O)=>{[_.el,_.anchor]=x(_.children,T,P,O,_.el,_.anchor)},G=({el:_,anchor:T},P,O)=>{let D;for(;_&&_!==T;)D=A(_),r(_,P,O),_=D;r(T,P,O)},N=({el:_,anchor:T})=>{let P;for(;_&&_!==T;)P=A(_),s(_),_=P;s(T)},W=(_,T,P,O,D,M,q,U,F)=>{T.type==="svg"?q="svg":T.type==="math"&&(q="mathml"),_==null?X(T,P,O,D,M,q,U,F):v(_,T,D,M,q,U,F)},X=(_,T,P,O,D,M,q,U)=>{let F,k;const{props:J,shapeFlag:H,transition:Q,dirs:et}=_;if(F=_.el=a(_.type,M,J&&J.is,J),H&8?d(F,_.children):H&16&&g(_.children,F,null,O,D,fo(_,M),q,U),et&&bn(_,null,O,"created"),E(F,_,_.scopeId,q,O),J){for(const ot in J)ot!=="value"&&!jr(ot)&&o(F,ot,null,J[ot],M,O);"value"in J&&o(F,"value",null,J.value,M),(k=J.onVnodeBeforeMount)&&Re(k,O,_)}et&&bn(_,null,O,"beforeMount");const Z=jp(D,Q);Z&&Q.beforeEnter(F),r(F,T,P),((k=J&&J.onVnodeMounted)||Z||et)&&pe(()=>{k&&Re(k,O,_),Z&&Q.enter(F),et&&bn(_,null,O,"mounted")},D)},E=(_,T,P,O,D)=>{if(P&&C(_,P),O)for(let M=0;M<O.length;M++)C(_,O[M]);if(D){let M=D.subTree;if(T===M||Th(M.type)&&(M.ssContent===T||M.ssFallback===T)){const q=D.vnode;E(_,q,q.scopeId,q.slotScopeIds,D.parent)}}},g=(_,T,P,O,D,M,q,U,F=0)=>{for(let k=F;k<_.length;k++){const J=_[k]=U?tn(_[k]):De(_[k]);L(null,J,T,P,O,D,M,q,U)}},v=(_,T,P,O,D,M,q)=>{const U=T.el=_.el;let{patchFlag:F,dynamicChildren:k,dirs:J}=T;F|=_.patchFlag&16;const H=_.props||It,Q=T.props||It;let et;if(P&&Sn(P,!1),(et=Q.onVnodeBeforeUpdate)&&Re(et,P,T,_),J&&bn(T,_,P,"beforeUpdate"),P&&Sn(P,!0),(H.innerHTML&&Q.innerHTML==null||H.textContent&&Q.textContent==null)&&d(U,""),k?I(_.dynamicChildren,k,U,P,O,fo(T,D),M):q||gt(_,T,U,null,P,O,fo(T,D),M,!1),F>0){if(F&16)w(U,H,Q,P,D);else if(F&2&&H.class!==Q.class&&o(U,"class",null,Q.class,D),F&4&&o(U,"style",H.style,Q.style,D),F&8){const Z=T.dynamicProps;for(let ot=0;ot<Z.length;ot++){const ut=Z[ot],Gt=H[ut],$t=Q[ut];($t!==Gt||ut==="value")&&o(U,ut,Gt,$t,D,P)}}F&1&&_.children!==T.children&&d(U,T.children)}else!q&&k==null&&w(U,H,Q,P,D);((et=Q.onVnodeUpdated)||J)&&pe(()=>{et&&Re(et,P,T,_),J&&bn(T,_,P,"updated")},O)},I=(_,T,P,O,D,M,q)=>{for(let U=0;U<T.length;U++){const F=_[U],k=T[U],J=F.el&&(F.type===le||!Lr(F,k)||F.shapeFlag&70)?m(F.el):P;L(F,k,J,null,O,D,M,q,!0)}},w=(_,T,P,O,D)=>{if(T!==P){if(T!==It)for(const M in T)!jr(M)&&!(M in P)&&o(_,M,T[M],null,D,O);for(const M in P){if(jr(M))continue;const q=P[M],U=T[M];q!==U&&M!=="value"&&o(_,M,U,q,D,O)}"value"in P&&o(_,"value",T.value,P.value,D)}},S=(_,T,P,O,D,M,q,U,F)=>{const k=T.el=_?_.el:l(""),J=T.anchor=_?_.anchor:l("");let{patchFlag:H,dynamicChildren:Q,slotScopeIds:et}=T;et&&(U=U?U.concat(et):et),_==null?(r(k,P,O),r(J,P,O),g(T.children||[],P,J,D,M,q,U,F)):H>0&&H&64&&Q&&_.dynamicChildren?(I(_.dynamicChildren,Q,P,D,M,q,U),(T.key!=null||D&&T===D.subTree)&&mh(_,T,!0)):gt(_,T,P,J,D,M,q,U,F)},y=(_,T,P,O,D,M,q,U,F)=>{T.slotScopeIds=U,_==null?T.shapeFlag&512?D.ctx.activate(T,P,O,q,F):fe(T,P,O,D,M,q,F):We(_,T,F)},fe=(_,T,P,O,D,M,q)=>{const U=_.component=og(_,O,D);if(th(_)&&(U.ctx.renderer=Ce),ag(U,!1,q),U.asyncDep){if(D&&D.registerDep(U,Bt,q),!_.el){const F=U.subTree=_e(Mn);Y(null,F,T,P)}}else Bt(U,_,T,P,D,M,q)},We=(_,T,P)=>{const O=T.component=_.component;if(Yp(_,T,P))if(O.asyncDep&&!O.asyncResolved){vt(O,T,P);return}else O.next=T,O.update();else T.el=_.el,O.vnode=T},Bt=(_,T,P,O,D,M,q)=>{const U=()=>{if(_.isMounted){let{next:H,bu:Q,u:et,parent:Z,vnode:ot}=_;{const Wt=_h(_);if(Wt){H&&(H.el=ot.el,vt(_,H,q)),Wt.asyncDep.then(()=>{_.isUnmounted||U()});return}}let ut=H,Gt;Sn(_,!1),H?(H.el=ot.el,vt(_,H,q)):H=ot,Q&&oo(Q),(Gt=H.props&&H.props.onVnodeBeforeUpdate)&&Re(Gt,Z,H,ot),Sn(_,!0);const $t=Xl(_),ye=_.subTree;_.subTree=$t,L(ye,$t,m(ye.el),Ue(ye),_,D,M),H.el=$t.el,ut===null&&Jp(_,$t.el),et&&pe(et,D),(Gt=H.props&&H.props.onVnodeUpdated)&&pe(()=>Re(Gt,Z,H,ot),D)}else{let H;const{el:Q,props:et}=T,{bm:Z,m:ot,parent:ut,root:Gt,type:$t}=_,ye=zr(T);Sn(_,!1),Z&&oo(Z),!ye&&(H=et&&et.onVnodeBeforeMount)&&Re(H,ut,T),Sn(_,!0);{Gt.ce&&Gt.ce._injectChildStyle($t);const Wt=_.subTree=Xl(_);L(null,Wt,P,O,_,D,M),T.el=Wt.el}if(ot&&pe(ot,D),!ye&&(H=et&&et.onVnodeMounted)){const Wt=T;pe(()=>Re(H,ut,Wt),D)}(T.shapeFlag&256||ut&&zr(ut.vnode)&&ut.vnode.shapeFlag&256)&&_.a&&pe(_.a,D),_.isMounted=!0,T=P=O=null}};_.scope.on();const F=_.effect=new Du(U);_.scope.off();const k=_.update=F.run.bind(F),J=_.job=F.runIfDirty.bind(F);J.i=_,J.id=_.uid,F.scheduler=()=>va(J),Sn(_,!0),k()},vt=(_,T,P)=>{T.component=_;const O=_.vnode.props;_.vnode=T,_.next=null,Mp(_,T.props,O,P),Up(_,T.children,P),mn(),jl(_),_n()},gt=(_,T,P,O,D,M,q,U,F=!1)=>{const k=_&&_.children,J=_?_.shapeFlag:0,H=T.children,{patchFlag:Q,shapeFlag:et}=T;if(Q>0){if(Q&128){yn(k,H,P,O,D,M,q,U,F);return}else if(Q&256){we(k,H,P,O,D,M,q,U,F);return}}et&8?(J&16&&En(k,D,M),H!==k&&d(P,H)):J&16?et&16?yn(k,H,P,O,D,M,q,U,F):En(k,D,M,!0):(J&8&&d(P,""),et&16&&g(H,P,O,D,M,q,U,F))},we=(_,T,P,O,D,M,q,U,F)=>{_=_||Xn,T=T||Xn;const k=_.length,J=T.length,H=Math.min(k,J);let Q;for(Q=0;Q<H;Q++){const et=T[Q]=F?tn(T[Q]):De(T[Q]);L(_[Q],et,P,null,D,M,q,U,F)}k>J?En(_,D,M,!0,!1,H):g(T,P,O,D,M,q,U,F,H)},yn=(_,T,P,O,D,M,q,U,F)=>{let k=0;const J=T.length;let H=_.length-1,Q=J-1;for(;k<=H&&k<=Q;){const et=_[k],Z=T[k]=F?tn(T[k]):De(T[k]);if(Lr(et,Z))L(et,Z,P,null,D,M,q,U,F);else break;k++}for(;k<=H&&k<=Q;){const et=_[H],Z=T[Q]=F?tn(T[Q]):De(T[Q]);if(Lr(et,Z))L(et,Z,P,null,D,M,q,U,F);else break;H--,Q--}if(k>H){if(k<=Q){const et=Q+1,Z=et<J?T[et].el:O;for(;k<=Q;)L(null,T[k]=F?tn(T[k]):De(T[k]),P,Z,D,M,q,U,F),k++}}else if(k>Q)for(;k<=H;)Mt(_[k],D,M,!0),k++;else{const et=k,Z=k,ot=new Map;for(k=Z;k<=Q;k++){const jt=T[k]=F?tn(T[k]):De(T[k]);jt.key!=null&&ot.set(jt.key,k)}let ut,Gt=0;const $t=Q-Z+1;let ye=!1,Wt=0;const Qe=new Array($t);for(k=0;k<$t;k++)Qe[k]=0;for(k=et;k<=H;k++){const jt=_[k];if(Gt>=$t){Mt(jt,D,M,!0);continue}let ve;if(jt.key!=null)ve=ot.get(jt.key);else for(ut=Z;ut<=Q;ut++)if(Qe[ut-Z]===0&&Lr(jt,T[ut])){ve=ut;break}ve===void 0?Mt(jt,D,M,!0):(Qe[ve-Z]=k+1,ve>=Wt?Wt=ve:ye=!0,L(jt,T[ve],P,null,D,M,q,U,F),Gt++)}const wr=ye?qp(Qe):Xn;for(ut=wr.length-1,k=$t-1;k>=0;k--){const jt=Z+k,ve=T[jt],vs=jt+1<J?T[jt+1].el:O;Qe[k]===0?L(null,ve,P,vs,D,M,q,U,F):ye&&(ut<0||k!==wr[ut]?Fe(ve,P,vs,2):ut--)}}},Fe=(_,T,P,O,D=null)=>{const{el:M,type:q,transition:U,children:F,shapeFlag:k}=_;if(k&6){Fe(_.component.subTree,T,P,O);return}if(k&128){_.suspense.move(T,P,O);return}if(k&64){q.move(_,T,P,Ce);return}if(q===le){r(M,T,P);for(let H=0;H<F.length;H++)Fe(F[H],T,P,O);r(_.anchor,T,P);return}if(q===po){G(_,T,P);return}if(O!==2&&k&1&&U)if(O===0)U.beforeEnter(M),r(M,T,P),pe(()=>U.enter(M),D);else{const{leave:H,delayLeave:Q,afterLeave:et}=U,Z=()=>r(M,T,P),ot=()=>{H(M,()=>{Z(),et&&et()})};Q?Q(M,Z,ot):ot()}else r(M,T,P)},Mt=(_,T,P,O=!1,D=!1)=>{const{type:M,props:q,ref:U,children:F,dynamicChildren:k,shapeFlag:J,patchFlag:H,dirs:Q,cacheIndex:et}=_;if(H===-2&&(D=!1),U!=null&&ri(U,null,P,_,!0),et!=null&&(T.renderCache[et]=void 0),J&256){T.ctx.deactivate(_);return}const Z=J&1&&Q,ot=!zr(_);let ut;if(ot&&(ut=q&&q.onVnodeBeforeUnmount)&&Re(ut,T,_),J&6)vn(_.component,P,O);else{if(J&128){_.suspense.unmount(P,O);return}Z&&bn(_,null,T,"beforeUnmount"),J&64?_.type.remove(_,T,P,Ce,O):k&&!k.hasOnce&&(M!==le||H>0&&H&64)?En(k,T,P,!1,!0):(M===le&&H&384||!D&&J&16)&&En(F,T,P),O&&kt(_)}(ot&&(ut=q&&q.onVnodeUnmounted)||Z)&&pe(()=>{ut&&Re(ut,T,_),Z&&bn(_,null,T,"unmounted")},P)},kt=_=>{const{type:T,el:P,anchor:O,transition:D}=_;if(T===le){qi(P,O);return}if(T===po){N(_);return}const M=()=>{s(P),D&&!D.persisted&&D.afterLeave&&D.afterLeave()};if(_.shapeFlag&1&&D&&!D.persisted){const{leave:q,delayLeave:U}=D,F=()=>q(P,M);U?U(_.el,M,F):F()}else M()},qi=(_,T)=>{let P;for(;_!==T;)P=A(_),s(_),_=P;s(T)},vn=(_,T,P)=>{const{bum:O,scope:D,job:M,subTree:q,um:U,m:F,a:k}=_;Ql(F),Ql(k),O&&oo(O),D.stop(),M&&(M.flags|=8,Mt(q,_,T,P)),U&&pe(U,T),pe(()=>{_.isUnmounted=!0},T),T&&T.pendingBranch&&!T.isUnmounted&&_.asyncDep&&!_.asyncResolved&&_.suspenseId===T.pendingId&&(T.deps--,T.deps===0&&T.resolve())},En=(_,T,P,O=!1,D=!1,M=0)=>{for(let q=M;q<_.length;q++)Mt(_[q],T,P,O,D)},Ue=_=>{if(_.shapeFlag&6)return Ue(_.component.subTree);if(_.shapeFlag&128)return _.suspense.next();const T=A(_.anchor||_.el),P=T&&T[cp];return P?A(P):T};let Tr=!1;const ys=(_,T,P)=>{_==null?T._vnode&&Mt(T._vnode,null,null,!0):L(T._vnode||null,_,T,null,null,null,P),T._vnode=_,Tr||(Tr=!0,jl(),Xu(),Tr=!1)},Ce={p:L,um:Mt,m:Fe,r:kt,mt:fe,mc:g,pc:gt,pbc:I,n:Ue,o:e};return{render:ys,hydrate:void 0,createApp:xp(ys)}}function fo({type:e,props:t},n){return n==="svg"&&e==="foreignObject"||n==="mathml"&&e==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:n}function Sn({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function jp(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function mh(e,t,n=!1){const r=e.children,s=t.children;if(it(r)&&it(s))for(let o=0;o<r.length;o++){const a=r[o];let l=s[o];l.shapeFlag&1&&!l.dynamicChildren&&((l.patchFlag<=0||l.patchFlag===32)&&(l=s[o]=tn(s[o]),l.el=a.el),!n&&l.patchFlag!==-2&&mh(a,l)),l.type===Vi&&(l.el=a.el)}}function qp(e){const t=e.slice(),n=[0];let r,s,o,a,l;const u=e.length;for(r=0;r<u;r++){const f=e[r];if(f!==0){if(s=n[n.length-1],e[s]<f){t[r]=s,n.push(r);continue}for(o=0,a=n.length-1;o<a;)l=o+a>>1,e[n[l]]<f?o=l+1:a=l;f<e[n[o]]&&(o>0&&(t[r]=n[o-1]),n[o]=r)}}for(o=n.length,a=n[o-1];o-- >0;)n[o]=a,a=t[a];return n}function _h(e){const t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:_h(t)}function Ql(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}const Hp=Symbol.for("v-scx"),zp=()=>zs(Hp);function nr(e,t,n){return yh(e,t,n)}function yh(e,t,n=It){const{immediate:r,deep:s,flush:o,once:a}=n,l=se({},n),u=t&&r||!t&&o!=="post";let f;if(ss){if(o==="sync"){const C=zp();f=C.__watcherHandles||(C.__watcherHandles=[])}else if(!u){const C=()=>{};return C.stop=Ne,C.resume=Ne,C.pause=Ne,C}}const d=ne;l.call=(C,x,L)=>Me(C,d,x,L);let m=!1;o==="post"?l.scheduler=C=>{pe(C,d&&d.suspense)}:o!=="sync"&&(m=!0,l.scheduler=(C,x)=>{x?C():va(C)}),l.augmentJob=C=>{t&&(C.flags|=4),m&&(C.flags|=2,d&&(C.id=d.uid,C.i=d))};const A=rp(e,t,l);return ss&&(f?f.push(A):u&&A()),A}function Kp(e,t,n){const r=this.proxy,s=Ot(e)?e.includes(".")?vh(r,e):()=>r[e]:e.bind(r,r);let o;at(t)?o=t:(o=t.handler,n=t);const a=ds(this),l=yh(s,o.bind(r),n);return a(),l}function vh(e,t){const n=t.split(".");return()=>{let r=e;for(let s=0;s<n.length&&r;s++)r=r[n[s]];return r}}const Gp=(e,t)=>t==="modelValue"||t==="model-value"?e.modelModifiers:e[`${t}Modifiers`]||e[`${Ie(t)}Modifiers`]||e[`${Ln(t)}Modifiers`];function Wp(e,t,...n){if(e.isUnmounted)return;const r=e.vnode.props||It;let s=n;const o=t.startsWith("update:"),a=o&&Gp(r,t.slice(7));a&&(a.trim&&(s=n.map(d=>Ot(d)?d.trim():d)),a.number&&(s=n.map(wd)));let l,u=r[l=io(t)]||r[l=io(Ie(t))];!u&&o&&(u=r[l=io(Ln(t))]),u&&Me(u,e,6,s);const f=r[l+"Once"];if(f){if(!e.emitted)e.emitted={};else if(e.emitted[l])return;e.emitted[l]=!0,Me(f,e,6,s)}}function Eh(e,t,n=!1){const r=t.emitsCache,s=r.get(e);if(s!==void 0)return s;const o=e.emits;let a={},l=!1;if(!at(e)){const u=f=>{const d=Eh(f,t,!0);d&&(l=!0,se(a,d))};!n&&t.mixins.length&&t.mixins.forEach(u),e.extends&&u(e.extends),e.mixins&&e.mixins.forEach(u)}return!o&&!l?(Ct(e)&&r.set(e,null),null):(it(o)?o.forEach(u=>a[u]=null):se(a,o),Ct(e)&&r.set(e,a),a)}function Pi(e,t){return!e||!Ti(t)?!1:(t=t.slice(2).replace(/Once$/,""),yt(e,t[0].toLowerCase()+t.slice(1))||yt(e,Ln(t))||yt(e,t))}function Xl(e){const{type:t,vnode:n,proxy:r,withProxy:s,propsOptions:[o],slots:a,attrs:l,emit:u,render:f,renderCache:d,props:m,data:A,setupState:C,ctx:x,inheritAttrs:L}=e,$=ni(e);let Y,z;try{if(n.shapeFlag&4){const N=s||r,W=N;Y=De(f.call(W,N,d,m,C,A,x)),z=l}else{const N=t;Y=De(N.length>1?N(m,{attrs:l,slots:a,emit:u}):N(m,null)),z=t.props?l:Qp(l)}}catch(N){Gr.length=0,Ci(N,e,1),Y=_e(Mn)}let G=Y;if(z&&L!==!1){const N=Object.keys(z),{shapeFlag:W}=G;N.length&&W&7&&(o&&N.some(la)&&(z=Xp(z,o)),G=ar(G,z,!1,!0))}return n.dirs&&(G=ar(G,null,!1,!0),G.dirs=G.dirs?G.dirs.concat(n.dirs):n.dirs),n.transition&&Ea(G,n.transition),Y=G,ni($),Y}const Qp=e=>{let t;for(const n in e)(n==="class"||n==="style"||Ti(n))&&((t||(t={}))[n]=e[n]);return t},Xp=(e,t)=>{const n={};for(const r in e)(!la(r)||!(r.slice(9)in t))&&(n[r]=e[r]);return n};function Yp(e,t,n){const{props:r,children:s,component:o}=e,{props:a,children:l,patchFlag:u}=t,f=o.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&u>=0){if(u&1024)return!0;if(u&16)return r?Yl(r,a,f):!!a;if(u&8){const d=t.dynamicProps;for(let m=0;m<d.length;m++){const A=d[m];if(a[A]!==r[A]&&!Pi(f,A))return!0}}}else return(s||l)&&(!l||!l.$stable)?!0:r===a?!1:r?a?Yl(r,a,f):!0:!!a;return!1}function Yl(e,t,n){const r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let s=0;s<r.length;s++){const o=r[s];if(t[o]!==e[o]&&!Pi(n,o))return!0}return!1}function Jp({vnode:e,parent:t},n){for(;t;){const r=t.subTree;if(r.suspense&&r.suspense.activeBranch===e&&(r.el=e.el),r===e)(e=t.vnode).el=n,t=t.parent;else break}}const Th=e=>e.__isSuspense;function Zp(e,t){t&&t.pendingBranch?it(e)?t.effects.push(...e):t.effects.push(e):ap(e)}const le=Symbol.for("v-fgt"),Vi=Symbol.for("v-txt"),Mn=Symbol.for("v-cmt"),po=Symbol.for("v-stc"),Gr=[];let me=null;function At(e=!1){Gr.push(me=e?null:[])}function tg(){Gr.pop(),me=Gr[Gr.length-1]||null}let ns=1;function Jl(e,t=!1){ns+=e,e<0&&me&&t&&(me.hasOnce=!0)}function Ih(e){return e.dynamicChildren=ns>0?me||Xn:null,tg(),ns>0&&me&&me.push(e),e}function bt(e,t,n,r,s,o){return Ih(rt(e,t,n,r,s,o,!0))}function wh(e,t,n,r,s){return Ih(_e(e,t,n,r,s,!0))}function Ah(e){return e?e.__v_isVNode===!0:!1}function Lr(e,t){return e.type===t.type&&e.key===t.key}const bh=({key:e})=>e??null,Ks=({ref:e,ref_key:t,ref_for:n})=>(typeof e=="number"&&(e=""+e),e!=null?Ot(e)||re(e)||at(e)?{i:be,r:e,k:t,f:!!n}:e:null);function rt(e,t=null,n=null,r=0,s=null,o=e===le?0:1,a=!1,l=!1){const u={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&bh(t),ref:t&&Ks(t),scopeId:Ju,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:o,patchFlag:r,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:be};return l?(Ia(u,n),o&128&&e.normalize(u)):n&&(u.shapeFlag|=Ot(n)?8:16),ns>0&&!a&&me&&(u.patchFlag>0||o&6)&&u.patchFlag!==32&&me.push(u),u}const _e=eg;function eg(e,t=null,n=null,r=0,s=null,o=!1){if((!e||e===wp)&&(e=Mn),Ah(e)){const l=ar(e,t,!0);return n&&Ia(l,n),ns>0&&!o&&me&&(l.shapeFlag&6?me[me.indexOf(e)]=l:me.push(l)),l.patchFlag=-2,l}if(fg(e)&&(e=e.__vccOpts),t){t=ng(t);let{class:l,style:u}=t;l&&!Ot(l)&&(t.class=Jr(l)),Ct(u)&&(ya(u)&&!it(u)&&(u=se({},u)),t.style=Pn(u))}const a=Ot(e)?1:Th(e)?128:up(e)?64:Ct(e)?4:at(e)?2:0;return rt(e,t,n,r,s,a,o,!0)}function ng(e){return e?ya(e)||ch(e)?se({},e):e:null}function ar(e,t,n=!1,r=!1){const{props:s,ref:o,patchFlag:a,children:l,transition:u}=e,f=t?rg(s||{},t):s,d={__v_isVNode:!0,__v_skip:!0,type:e.type,props:f,key:f&&bh(f),ref:t&&t.ref?n&&o?it(o)?o.concat(Ks(t)):[o,Ks(t)]:Ks(t):o,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:l,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==le?a===-1?16:a|16:a,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:u,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&ar(e.ssContent),ssFallback:e.ssFallback&&ar(e.ssFallback),el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return u&&r&&Ea(d,u.clone(d)),d}function Qn(e=" ",t=0){return _e(Vi,null,e,t)}function rs(e="",t=!1){return t?(At(),wh(Mn,null,e)):_e(Mn,null,e)}function De(e){return e==null||typeof e=="boolean"?_e(Mn):it(e)?_e(le,null,e.slice()):Ah(e)?tn(e):_e(Vi,null,String(e))}function tn(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:ar(e)}function Ia(e,t){let n=0;const{shapeFlag:r}=e;if(t==null)t=null;else if(it(t))n=16;else if(typeof t=="object")if(r&65){const s=t.default;s&&(s._c&&(s._d=!1),Ia(e,s()),s._c&&(s._d=!0));return}else{n=32;const s=t._;!s&&!ch(t)?t._ctx=be:s===3&&be&&(be.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else at(t)?(t={default:t,_ctx:be},n=32):(t=String(t),r&64?(n=16,t=[Qn(t)]):n=8);e.children=t,e.shapeFlag|=n}function rg(...e){const t={};for(let n=0;n<e.length;n++){const r=e[n];for(const s in r)if(s==="class")t.class!==r.class&&(t.class=Jr([t.class,r.class]));else if(s==="style")t.style=Pn([t.style,r.style]);else if(Ti(s)){const o=t[s],a=r[s];a&&o!==a&&!(it(o)&&o.includes(a))&&(t[s]=o?[].concat(o,a):a)}else s!==""&&(t[s]=r[s])}return t}function Re(e,t,n,r=null){Me(e,t,7,[n,r])}const sg=oh();let ig=0;function og(e,t,n){const r=e.type,s=(t?t.appContext:e.appContext)||sg,o={uid:ig++,vnode:e,type:r,parent:t,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new Vu(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(s.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:hh(r,s),emitsOptions:Eh(r,s),emit:null,emitted:null,propsDefaults:It,inheritAttrs:r.inheritAttrs,ctx:It,data:It,props:It,attrs:It,slots:It,refs:It,setupState:It,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return o.ctx={_:o},o.root=t?t.root:o,o.emit=Wp.bind(null,o),e.ce&&e.ce(o),o}let ne=null,ii,Mo;{const e=bi(),t=(n,r)=>{let s;return(s=e[n])||(s=e[n]=[]),s.push(r),o=>{s.length>1?s.forEach(a=>a(o)):s[0](o)}};ii=t("__VUE_INSTANCE_SETTERS__",n=>ne=n),Mo=t("__VUE_SSR_SETTERS__",n=>ss=n)}const ds=e=>{const t=ne;return ii(e),e.scope.on(),()=>{e.scope.off(),ii(t)}},Zl=()=>{ne&&ne.scope.off(),ii(null)};function Sh(e){return e.vnode.shapeFlag&4}let ss=!1;function ag(e,t=!1,n=!1){t&&Mo(t);const{props:r,children:s}=e.vnode,o=Sh(e);Op(e,r,o,t),Fp(e,s,n);const a=o?lg(e,t):void 0;return t&&Mo(!1),a}function lg(e,t){const n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,bp);const{setup:r}=n;if(r){mn();const s=e.setupContext=r.length>1?ug(e):null,o=ds(e),a=fs(r,e,0,[e.props,s]),l=wu(a);if(_n(),o(),(l||e.sp)&&!zr(e)&&Zu(e),l){if(a.then(Zl,Zl),t)return a.then(u=>{tc(e,u)}).catch(u=>{Ci(u,e,0)});e.asyncDep=a}else tc(e,a)}else Ch(e)}function tc(e,t,n){at(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:Ct(t)&&(e.setupState=Gu(t)),Ch(e)}function Ch(e,t,n){const r=e.type;e.render||(e.render=r.render||Ne);{const s=ds(e);mn();try{Sp(e)}finally{_n(),s()}}}const cg={get(e,t){return Zt(e,"get",""),e[t]}};function ug(e){const t=n=>{e.exposed=n||{}};return{attrs:new Proxy(e.attrs,cg),slots:e.slots,emit:e.emit,expose:t}}function wa(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(Gu(Ku(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in Kr)return Kr[n](e)},has(t,n){return n in t||n in Kr}})):e.proxy}function hg(e,t=!0){return at(e)?e.displayName||e.name:e.name||t&&e.__name}function fg(e){return at(e)&&"__vccOpts"in e}const is=(e,t)=>ep(e,t,ss),dg="3.5.13";/**
* @vue/runtime-dom v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let ko;const ec=typeof window<"u"&&window.trustedTypes;if(ec)try{ko=ec.createPolicy("vue",{createHTML:e=>e})}catch{}const Rh=ko?e=>ko.createHTML(e):e=>e,pg="http://www.w3.org/2000/svg",gg="http://www.w3.org/1998/Math/MathML",qe=typeof document<"u"?document:null,nc=qe&&qe.createElement("template"),mg={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{const s=t==="svg"?qe.createElementNS(pg,e):t==="mathml"?qe.createElementNS(gg,e):n?qe.createElement(e,{is:n}):qe.createElement(e);return e==="select"&&r&&r.multiple!=null&&s.setAttribute("multiple",r.multiple),s},createText:e=>qe.createTextNode(e),createComment:e=>qe.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>qe.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,n,r,s,o){const a=n?n.previousSibling:t.lastChild;if(s&&(s===o||s.nextSibling))for(;t.insertBefore(s.cloneNode(!0),n),!(s===o||!(s=s.nextSibling)););else{nc.innerHTML=Rh(r==="svg"?`<svg>${e}</svg>`:r==="mathml"?`<math>${e}</math>`:e);const l=nc.content;if(r==="svg"||r==="mathml"){const u=l.firstChild;for(;u.firstChild;)l.appendChild(u.firstChild);l.removeChild(u)}t.insertBefore(l,n)}return[a?a.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},_g=Symbol("_vtc");function yg(e,t,n){const r=e[_g];r&&(t=(t?[t,...r]:[...r]).join(" ")),t==null?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t}const rc=Symbol("_vod"),vg=Symbol("_vsh"),Eg=Symbol(""),Tg=/(^|;)\s*display\s*:/;function Ig(e,t,n){const r=e.style,s=Ot(n);let o=!1;if(n&&!s){if(t)if(Ot(t))for(const a of t.split(";")){const l=a.slice(0,a.indexOf(":")).trim();n[l]==null&&Gs(r,l,"")}else for(const a in t)n[a]==null&&Gs(r,a,"");for(const a in n)a==="display"&&(o=!0),Gs(r,a,n[a])}else if(s){if(t!==n){const a=r[Eg];a&&(n+=";"+a),r.cssText=n,o=Tg.test(n)}}else t&&e.removeAttribute("style");rc in e&&(e[rc]=o?r.display:"",e[vg]&&(r.display="none"))}const sc=/\s*!important$/;function Gs(e,t,n){if(it(n))n.forEach(r=>Gs(e,t,r));else if(n==null&&(n=""),t.startsWith("--"))e.setProperty(t,n);else{const r=wg(e,t);sc.test(n)?e.setProperty(Ln(r),n.replace(sc,""),"important"):e[r]=n}}const ic=["Webkit","Moz","ms"],go={};function wg(e,t){const n=go[t];if(n)return n;let r=Ie(t);if(r!=="filter"&&r in e)return go[t]=r;r=Ai(r);for(let s=0;s<ic.length;s++){const o=ic[s]+r;if(o in e)return go[t]=o}return t}const oc="http://www.w3.org/1999/xlink";function ac(e,t,n,r,s,o=Pd(t)){r&&t.startsWith("xlink:")?n==null?e.removeAttributeNS(oc,t.slice(6,t.length)):e.setAttributeNS(oc,t,n):n==null||o&&!Cu(n)?e.removeAttribute(t):e.setAttribute(t,o?"":gn(n)?String(n):n)}function lc(e,t,n,r,s){if(t==="innerHTML"||t==="textContent"){n!=null&&(e[t]=t==="innerHTML"?Rh(n):n);return}const o=e.tagName;if(t==="value"&&o!=="PROGRESS"&&!o.includes("-")){const l=o==="OPTION"?e.getAttribute("value")||"":e.value,u=n==null?e.type==="checkbox"?"on":"":String(n);(l!==u||!("_value"in e))&&(e.value=u),n==null&&e.removeAttribute(t),e._value=n;return}let a=!1;if(n===""||n==null){const l=typeof e[t];l==="boolean"?n=Cu(n):n==null&&l==="string"?(n="",a=!0):l==="number"&&(n=0,a=!0)}try{e[t]=n}catch{}a&&e.removeAttribute(s||t)}function Ag(e,t,n,r){e.addEventListener(t,n,r)}function bg(e,t,n,r){e.removeEventListener(t,n,r)}const cc=Symbol("_vei");function Sg(e,t,n,r,s=null){const o=e[cc]||(e[cc]={}),a=o[t];if(r&&a)a.value=r;else{const[l,u]=Cg(t);if(r){const f=o[t]=Vg(r,s);Ag(e,l,f,u)}else a&&(bg(e,l,a,u),o[t]=void 0)}}const uc=/(?:Once|Passive|Capture)$/;function Cg(e){let t;if(uc.test(e)){t={};let r;for(;r=e.match(uc);)e=e.slice(0,e.length-r[0].length),t[r[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):Ln(e.slice(2)),t]}let mo=0;const Rg=Promise.resolve(),Pg=()=>mo||(Rg.then(()=>mo=0),mo=Date.now());function Vg(e,t){const n=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=n.attached)return;Me(Dg(r,n.value),t,5,[r])};return n.value=e,n.attached=Pg(),n}function Dg(e,t){if(it(t)){const n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0},t.map(r=>s=>!s._stopped&&r&&r(s))}else return t}const hc=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,xg=(e,t,n,r,s,o)=>{const a=s==="svg";t==="class"?yg(e,r,a):t==="style"?Ig(e,n,r):Ti(t)?la(t)||Sg(e,t,n,r,o):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):Ng(e,t,r,a))?(lc(e,t,r),!e.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&ac(e,t,r,a,o,t!=="value")):e._isVueCE&&(/[A-Z]/.test(t)||!Ot(r))?lc(e,Ie(t),r,o,t):(t==="true-value"?e._trueValue=r:t==="false-value"&&(e._falseValue=r),ac(e,t,r,a))};function Ng(e,t,n,r){if(r)return!!(t==="innerHTML"||t==="textContent"||t in e&&hc(t)&&at(n));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){const s=e.tagName;if(s==="IMG"||s==="VIDEO"||s==="CANVAS"||s==="SOURCE")return!1}return hc(t)&&Ot(n)?!1:t in e}const Og=["ctrl","shift","alt","meta"],Mg={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&e.button!==0,middle:e=>"button"in e&&e.button!==1,right:e=>"button"in e&&e.button!==2,exact:(e,t)=>Og.some(n=>e[`${n}Key`]&&!t.includes(n))},fc=(e,t)=>{const n=e._withMods||(e._withMods={}),r=t.join(".");return n[r]||(n[r]=(s,...o)=>{for(let a=0;a<t.length;a++){const l=Mg[t[a]];if(l&&l(s,t))return}return e(s,...o)})},kg=se({patchProp:xg},mg);let dc;function Lg(){return dc||(dc=Bp(kg))}const Fg=(...e)=>{const t=Lg().createApp(...e),{mount:n}=t;return t.mount=r=>{const s=Bg(r);if(!s)return;const o=t._component;!at(o)&&!o.render&&!o.template&&(o.template=s.innerHTML),s.nodeType===1&&(s.textContent="");const a=n(s,!1,Ug(s));return s instanceof Element&&(s.removeAttribute("v-cloak"),s.setAttribute("data-v-app","")),a},t};function Ug(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function Bg(e){return Ot(e)?document.querySelector(e):e}/*!
 * pinia v3.0.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */const $g=Symbol();var pc;(function(e){e.direct="direct",e.patchObject="patch object",e.patchFunction="patch function"})(pc||(pc={}));function jg(){const e=Vd(!0),t=e.run(()=>Nt({}));let n=[],r=[];const s=Ku({install(o){s._a=o,o.provide($g,s),o.config.globalProperties.$pinia=s,r.forEach(a=>n.push(a)),r=[]},use(o){return this._a?n.push(o):r.push(o),this},_p:n,_a:null,_e:e,_s:new Map,state:t});return s}const qg={class:"tabs-container fixed top-0 left-0 right-0 bg-white z-10"},Hg=["onClick"],zg=gr({__name:"ShipFilterTabs",props:{filters:{},selectedFilterIds:{},isAllSelected:{type:Boolean}},emits:["toggle-filter","toggle-all"],setup(e){return(t,n)=>(At(),bt("div",qg,[rt("button",{class:Jr(["px-3 py-1 rounded-full",t.isAllSelected?"bg-green-500 text-white":"bg-gray-300"]),onClick:n[0]||(n[0]=r=>t.$emit("toggle-all"))}," 全選択 ",2),(At(!0),bt(le,null,tr(t.filters,r=>(At(),bt("button",{key:r.id,class:Jr(["px-3 py-1 rounded-full",t.selectedFilterIds.includes(r.id)?"bg-blue-500 text-white":"bg-gray-200"]),onClick:s=>t.$emit("toggle-filter",r.id)},zt(r.label),11,Hg))),128))]))}}),Kg=40,Gg="14px",Wg="8px",Qg=40,Xg="nowrap",Ee={rowHeight:Kg,headerHeight:Qg,fontSize:Gg,padding:Wg,whiteSpace:Xg},Yg={class:"p-4"},Jg={class:"w-full text-sm border-collapse border border-gray-300"},Zg=["onClick"],tm=gr({__name:"ShipListTable",props:{ships:{}},emits:["select"],setup(e,{emit:t}){const n=e,r=t;function s(u){r("select",u)}const o={height:`${Ee.rowHeight}px`,fontSize:Ee.fontSize},a={padding:Ee.padding,whiteSpace:Ee.whiteSpace},l={height:`${Ee.headerHeight}px`,fontSize:Ee.fontSize};return(u,f)=>(At(),bt("div",Yg,[f[0]||(f[0]=rt("h2",{class:"text-xl font-bold mb-2"},"艦船情報",-1)),rt("table",Jg,[rt("thead",{class:"bg-gray-100",style:l},[rt("tr",null,[rt("th",{style:a,class:"border text-left"},"図鑑ID"),rt("th",{style:a,class:"border text-left"},"艦名"),rt("th",{style:a,class:"border text-left"},"艦型・艦番"),rt("th",{style:a,class:"border text-left"},"艦種"),rt("th",{style:a,class:"border text-left"},"速力")])]),rt("tbody",null,[(At(!0),bt(le,null,tr(n.ships,d=>(At(),bt("tr",{key:d.id,style:o,class:"hover:bg-gray-100 cursor-pointer",onClick:m=>s(d.orig)},[rt("td",{style:a,class:"border"},zt(d.libraryId),1),rt("td",{style:a,class:"border"},zt(d.name),1),rt("td",{style:a,class:"border"},zt(d.class),1),rt("td",{style:a,class:"border"},zt(d.shipType),1),rt("td",{style:a,class:"border"},zt(d.speed),1)],8,Zg))),128))])])]))}}),em={class:"p-2 border rounded shadow hover:bg-gray-100 cursor-pointer"},nm=["src"],rm=gr({__name:"ShipCard",props:{ship:{},showBanner:{type:Boolean}},emits:["select","openCard"],setup(e){const n=e.showBanner??!0,r="/kan-tag-manager/";return(s,o)=>(At(),bt("li",em,[Zs(n)?(At(),bt("img",{key:0,src:`${Zs(r)}img/ship/banner/${s.ship.bannerId}.png`,alt:"バナー",class:"w-full h-auto",onClick:o[0]||(o[0]=a=>s.$emit("openCard",s.ship.bannerId))},null,8,nm)):rs("",!0),rt("p",{class:"text-center mt-1 text-sm",onClick:o[1]||(o[1]=a=>s.$emit("select",s.ship.orig))},zt(s.ship.name),1)]))}}),sm={class:"modal-content"},im={class:"ship-list"},om={class:"ship-banner"},am={class:"ship-info"},lm={class:"card-modal-content"},cm=["src"],um=gr({__name:"ShipModal",props:{ships:{},modalVisible:{type:Boolean},selectedShipOrig:{}},emits:["close"],setup(e,{emit:t}){const n=e,r=t,s=Nt(null),o=Nt([]),a=Nt(!1),l=Nt(null),u=A=>{l.value=A,a.value=!0},f=()=>{a.value=!1,l.value=null},d="/kan-tag-manager/";nr(()=>n.selectedShipOrig,A=>{if(A===null){s.value=null,o.value=[];return}const C=n.ships.filter(x=>x.orig===A);C.length>0?(s.value=C[0],o.value=C.sort((x,L)=>(x.updateLevel??0)-(L.updateLevel??0))):(s.value=null,o.value=[])},{immediate:!0});const m=()=>{s.value=null,o.value=[],r("close")};return(A,C)=>{var x;return A.modalVisible?(At(),bt("div",{key:0,class:"modal-overlay",onClick:fc(m,["self"])},[rt("div",sm,[rt("h2",null,zt((x=s.value)==null?void 0:x.name)+" 詳細",1),rt("ul",im,[(At(!0),bt(le,null,tr(o.value,L=>(At(),bt("li",{key:L.id,class:"ship-item"},[rt("div",om,[_e(rm,{ship:L,showBanner:!0,onSelect:()=>{},onOpenCard:u},null,8,["ship"])]),rt("div",am,[rt("p",null,[C[0]||(C[0]=rt("strong",null,"艦名:",-1)),Qn(" "+zt(L.name),1)]),rt("p",null,[C[1]||(C[1]=rt("strong",null,"艦型・艦番:",-1)),Qn(" "+zt(L.class)+" "+zt(L.shipType),1)]),rt("p",null,[C[2]||(C[2]=rt("strong",null,"速力:",-1)),Qn(" "+zt(L.speed),1)]),rt("p",null,[C[3]||(C[3]=rt("strong",null,"改造段階:",-1)),Qn(" "+zt(L.updateLevel??"未設定"),1)])])]))),128))]),rt("button",{onClick:m},"閉じる")]),a.value?(At(),bt("div",{key:0,class:"card-modal-overlay",onClick:fc(f,["self"])},[rt("div",lm,[rt("img",{src:`${Zs(d)}img/ship/card/${l.value}.png`,alt:"カード画像"},null,8,cm)])])):rs("",!0)])):rs("",!0)}}}),Aa=(e,t)=>{const n=e.__vccOpts||e;for(const[r,s]of t)n[r]=s;return n},hm=Aa(um,[["__scopeId","data-v-17c1d290"]]),fm=()=>{};var gc={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ph=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let s=e.charCodeAt(r);s<128?t[n++]=s:s<2048?(t[n++]=s>>6|192,t[n++]=s&63|128):(s&64512)===55296&&r+1<e.length&&(e.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(e.charCodeAt(++r)&1023),t[n++]=s>>18|240,t[n++]=s>>12&63|128,t[n++]=s>>6&63|128,t[n++]=s&63|128):(t[n++]=s>>12|224,t[n++]=s>>6&63|128,t[n++]=s&63|128)}return t},dm=function(e){const t=[];let n=0,r=0;for(;n<e.length;){const s=e[n++];if(s<128)t[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=e[n++];t[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=e[n++],a=e[n++],l=e[n++],u=((s&7)<<18|(o&63)<<12|(a&63)<<6|l&63)-65536;t[r++]=String.fromCharCode(55296+(u>>10)),t[r++]=String.fromCharCode(56320+(u&1023))}else{const o=e[n++],a=e[n++];t[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return t.join("")},Vh={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<e.length;s+=3){const o=e[s],a=s+1<e.length,l=a?e[s+1]:0,u=s+2<e.length,f=u?e[s+2]:0,d=o>>2,m=(o&3)<<4|l>>4;let A=(l&15)<<2|f>>6,C=f&63;u||(C=64,a||(A=64)),r.push(n[d],n[m],n[A],n[C])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(Ph(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):dm(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<e.length;){const o=n[e.charAt(s++)],l=s<e.length?n[e.charAt(s)]:0;++s;const f=s<e.length?n[e.charAt(s)]:64;++s;const m=s<e.length?n[e.charAt(s)]:64;if(++s,o==null||l==null||f==null||m==null)throw new pm;const A=o<<2|l>>4;if(r.push(A),f!==64){const C=l<<4&240|f>>2;if(r.push(C),m!==64){const x=f<<6&192|m;r.push(x)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class pm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const gm=function(e){const t=Ph(e);return Vh.encodeByteArray(t,!0)},oi=function(e){return gm(e).replace(/\./g,"")},mm=function(e){try{return Vh.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _m(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ym=()=>_m().__FIREBASE_DEFAULTS__,vm=()=>{if(typeof process>"u"||typeof gc>"u")return;const e=gc.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},Em=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=e&&mm(e[1]);return t&&JSON.parse(t)},ba=()=>{try{return fm()||ym()||vm()||Em()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},Tm=e=>{var t,n;return(n=(t=ba())===null||t===void 0?void 0:t.emulatorHosts)===null||n===void 0?void 0:n[e]},Im=e=>{const t=Tm(e);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(n+1),10);return t[0]==="["?[t.substring(1,n-1),r]:[t.substring(0,n),r]},Dh=()=>{var e;return(e=ba())===null||e===void 0?void 0:e.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wm{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Am(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=t||"demo-project",s=e.iat||0,o=e.sub||e.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}}},e);return[oi(JSON.stringify(n)),oi(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bm(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Sm(){var e;const t=(e=ba())===null||e===void 0?void 0:e.forceEnvironment;if(t==="node")return!0;if(t==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Cm(){return!Sm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Rm(){try{return typeof indexedDB=="object"}catch{return!1}}function Pm(){return new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var o;t(((o=s.error)===null||o===void 0?void 0:o.message)||"")}}catch(n){t(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vm="FirebaseError";class mr extends Error{constructor(t,n,r){super(n),this.code=t,this.customData=r,this.name=Vm,Object.setPrototypeOf(this,mr.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,xh.prototype.create)}}class xh{constructor(t,n,r){this.service=t,this.serviceName=n,this.errors=r}create(t,...n){const r=n[0]||{},s=`${this.service}/${t}`,o=this.errors[t],a=o?Dm(o,r):"Error",l=`${this.serviceName}: ${a} (${s}).`;return new mr(s,l,r)}}function Dm(e,t){return e.replace(xm,(n,r)=>{const s=t[r];return s!=null?String(s):`<${r}?>`})}const xm=/\{\$([^}]+)}/g;function ai(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const s of n){if(!r.includes(s))return!1;const o=e[s],a=t[s];if(mc(o)&&mc(a)){if(!ai(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function mc(e){return e!==null&&typeof e=="object"}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nm(e){return e&&e._delegate?e._delegate:e}class os{constructor(t,n,r){this.name=t,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Om{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){const r=new wm;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){var n;const r=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),s=(n=t==null?void 0:t.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(o){if(s)return null;throw o}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(km(t))try{this.getOrInitializeService({instanceIdentifier:Rn})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(t=Rn){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Rn){return this.instances.has(t)}getOptions(t=Rn){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:n={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[o,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(o);r===l&&a.resolve(s)}return s}onInit(t,n){var r;const s=this.normalizeInstanceIdentifier(n),o=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;o.add(t),this.onInitCallbacks.set(s,o);const a=this.instances.get(s);return a&&t(a,s),()=>{o.delete(t)}}invokeOnInitCallbacks(t,n){const r=this.onInitCallbacks.get(n);if(r)for(const s of r)try{s(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Mm(t),options:n}),this.instances.set(t,r),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=Rn){return this.component?this.component.multipleInstances?t:Rn:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Mm(e){return e===Rn?void 0:e}function km(e){return e.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const n=new Om(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ft;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(ft||(ft={}));const Fm={debug:ft.DEBUG,verbose:ft.VERBOSE,info:ft.INFO,warn:ft.WARN,error:ft.ERROR,silent:ft.SILENT},Um=ft.INFO,Bm={[ft.DEBUG]:"log",[ft.VERBOSE]:"log",[ft.INFO]:"info",[ft.WARN]:"warn",[ft.ERROR]:"error"},$m=(e,t,...n)=>{if(t<e.logLevel)return;const r=new Date().toISOString(),s=Bm[t];if(s)console[s](`[${r}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Nh{constructor(t){this.name=t,this._logLevel=Um,this._logHandler=$m,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in ft))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Fm[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,ft.DEBUG,...t),this._logHandler(this,ft.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,ft.VERBOSE,...t),this._logHandler(this,ft.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,ft.INFO,...t),this._logHandler(this,ft.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,ft.WARN,...t),this._logHandler(this,ft.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,ft.ERROR,...t),this._logHandler(this,ft.ERROR,...t)}}const jm=(e,t)=>t.some(n=>e instanceof n);let _c,yc;function qm(){return _c||(_c=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Hm(){return yc||(yc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Oh=new WeakMap,Lo=new WeakMap,Mh=new WeakMap,_o=new WeakMap,Sa=new WeakMap;function zm(e){const t=new Promise((n,r)=>{const s=()=>{e.removeEventListener("success",o),e.removeEventListener("error",a)},o=()=>{n(on(e.result)),s()},a=()=>{r(e.error),s()};e.addEventListener("success",o),e.addEventListener("error",a)});return t.then(n=>{n instanceof IDBCursor&&Oh.set(n,e)}).catch(()=>{}),Sa.set(t,e),t}function Km(e){if(Lo.has(e))return;const t=new Promise((n,r)=>{const s=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",a),e.removeEventListener("abort",a)},o=()=>{n(),s()},a=()=>{r(e.error||new DOMException("AbortError","AbortError")),s()};e.addEventListener("complete",o),e.addEventListener("error",a),e.addEventListener("abort",a)});Lo.set(e,t)}let Fo={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return Lo.get(e);if(t==="objectStoreNames")return e.objectStoreNames||Mh.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return on(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Gm(e){Fo=e(Fo)}function Wm(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const r=e.call(yo(this),t,...n);return Mh.set(r,t.sort?t.sort():[t]),on(r)}:Hm().includes(e)?function(...t){return e.apply(yo(this),t),on(Oh.get(this))}:function(...t){return on(e.apply(yo(this),t))}}function Qm(e){return typeof e=="function"?Wm(e):(e instanceof IDBTransaction&&Km(e),jm(e,qm())?new Proxy(e,Fo):e)}function on(e){if(e instanceof IDBRequest)return zm(e);if(_o.has(e))return _o.get(e);const t=Qm(e);return t!==e&&(_o.set(e,t),Sa.set(t,e)),t}const yo=e=>Sa.get(e);function Xm(e,t,{blocked:n,upgrade:r,blocking:s,terminated:o}={}){const a=indexedDB.open(e,t),l=on(a);return r&&a.addEventListener("upgradeneeded",u=>{r(on(a.result),u.oldVersion,u.newVersion,on(a.transaction),u)}),n&&a.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),l.then(u=>{o&&u.addEventListener("close",()=>o()),s&&u.addEventListener("versionchange",f=>s(f.oldVersion,f.newVersion,f))}).catch(()=>{}),l}const Ym=["get","getKey","getAll","getAllKeys","count"],Jm=["put","add","delete","clear"],vo=new Map;function vc(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(vo.get(t))return vo.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,s=Jm.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Ym.includes(n)))return;const o=async function(a,...l){const u=this.transaction(a,s?"readwrite":"readonly");let f=u.store;return r&&(f=f.index(l.shift())),(await Promise.all([f[n](...l),s&&u.done]))[0]};return vo.set(t,o),o}Gm(e=>({...e,get:(t,n,r)=>vc(t,n)||e.get(t,n,r),has:(t,n)=>!!vc(t,n)||e.has(t,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zm{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(t_(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function t_(e){const t=e.getComponent();return(t==null?void 0:t.type)==="VERSION"}const Uo="@firebase/app",Ec="0.11.3";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ze=new Nh("@firebase/app"),e_="@firebase/app-compat",n_="@firebase/analytics-compat",r_="@firebase/analytics",s_="@firebase/app-check-compat",i_="@firebase/app-check",o_="@firebase/auth",a_="@firebase/auth-compat",l_="@firebase/database",c_="@firebase/data-connect",u_="@firebase/database-compat",h_="@firebase/functions",f_="@firebase/functions-compat",d_="@firebase/installations",p_="@firebase/installations-compat",g_="@firebase/messaging",m_="@firebase/messaging-compat",__="@firebase/performance",y_="@firebase/performance-compat",v_="@firebase/remote-config",E_="@firebase/remote-config-compat",T_="@firebase/storage",I_="@firebase/storage-compat",w_="@firebase/firestore",A_="@firebase/vertexai",b_="@firebase/firestore-compat",S_="firebase",C_="11.5.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bo="[DEFAULT]",R_={[Uo]:"fire-core",[e_]:"fire-core-compat",[r_]:"fire-analytics",[n_]:"fire-analytics-compat",[i_]:"fire-app-check",[s_]:"fire-app-check-compat",[o_]:"fire-auth",[a_]:"fire-auth-compat",[l_]:"fire-rtdb",[c_]:"fire-data-connect",[u_]:"fire-rtdb-compat",[h_]:"fire-fn",[f_]:"fire-fn-compat",[d_]:"fire-iid",[p_]:"fire-iid-compat",[g_]:"fire-fcm",[m_]:"fire-fcm-compat",[__]:"fire-perf",[y_]:"fire-perf-compat",[v_]:"fire-rc",[E_]:"fire-rc-compat",[T_]:"fire-gcs",[I_]:"fire-gcs-compat",[w_]:"fire-fst",[b_]:"fire-fst-compat",[A_]:"fire-vertex","fire-js":"fire-js",[S_]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const li=new Map,P_=new Map,$o=new Map;function Tc(e,t){try{e.container.addComponent(t)}catch(n){ze.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function ci(e){const t=e.name;if($o.has(t))return ze.debug(`There were multiple attempts to register component ${t}.`),!1;$o.set(t,e);for(const n of li.values())Tc(n,e);for(const n of P_.values())Tc(n,e);return!0}function V_(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function D_(e){return e==null?!1:e.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x_={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},an=new xh("app","Firebase",x_);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N_{constructor(t,n,r){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new os("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw an.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O_=C_;function kh(e,t={}){let n=e;typeof t!="object"&&(t={name:t});const r=Object.assign({name:Bo,automaticDataCollectionEnabled:!1},t),s=r.name;if(typeof s!="string"||!s)throw an.create("bad-app-name",{appName:String(s)});if(n||(n=Dh()),!n)throw an.create("no-options");const o=li.get(s);if(o){if(ai(n,o.options)&&ai(r,o.config))return o;throw an.create("duplicate-app",{appName:s})}const a=new Lm(s);for(const u of $o.values())a.addComponent(u);const l=new N_(n,r,a);return li.set(s,l),l}function M_(e=Bo){const t=li.get(e);if(!t&&e===Bo&&Dh())return kh();if(!t)throw an.create("no-app",{appName:e});return t}function rr(e,t,n){var r;let s=(r=R_[e])!==null&&r!==void 0?r:e;n&&(s+=`-${n}`);const o=s.match(/\s|\//),a=t.match(/\s|\//);if(o||a){const l=[`Unable to register library "${s}" with version "${t}":`];o&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),o&&a&&l.push("and"),a&&l.push(`version name "${t}" contains illegal characters (whitespace or "/")`),ze.warn(l.join(" "));return}ci(new os(`${s}-version`,()=>({library:s,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k_="firebase-heartbeat-database",L_=1,as="firebase-heartbeat-store";let Eo=null;function Lh(){return Eo||(Eo=Xm(k_,L_,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(as)}catch(n){console.warn(n)}}}}).catch(e=>{throw an.create("idb-open",{originalErrorMessage:e.message})})),Eo}async function F_(e){try{const n=(await Lh()).transaction(as),r=await n.objectStore(as).get(Fh(e));return await n.done,r}catch(t){if(t instanceof mr)ze.warn(t.message);else{const n=an.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});ze.warn(n.message)}}}async function Ic(e,t){try{const r=(await Lh()).transaction(as,"readwrite");await r.objectStore(as).put(t,Fh(e)),await r.done}catch(n){if(n instanceof mr)ze.warn(n.message);else{const r=an.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});ze.warn(r.message)}}}function Fh(e){return`${e.name}!${e.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U_=1024,B_=30;class $_{constructor(t){this.container=t,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new q_(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,n;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=wc();if(((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats.length>B_){const a=H_(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){ze.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=wc(),{heartbeatsToSend:r,unsentEntries:s}=j_(this._heartbeatsCache.heartbeats),o=oi(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(n){return ze.warn(n),""}}}function wc(){return new Date().toISOString().substring(0,10)}function j_(e,t=U_){const n=[];let r=e.slice();for(const s of e){const o=n.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),Ac(n)>t){o.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),Ac(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class q_{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Rm()?Pm().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await F_(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return Ic(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return Ic(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...t.heartbeats]})}else return}}function Ac(e){return oi(JSON.stringify({version:2,heartbeats:e})).length}function H_(e){if(e.length===0)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z_(e){ci(new os("platform-logger",t=>new Zm(t),"PRIVATE")),ci(new os("heartbeat",t=>new $_(t),"PRIVATE")),rr(Uo,Ec,e),rr(Uo,Ec,"esm2017"),rr("fire-js","")}z_("");var K_="firebase",G_="11.5.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */rr(K_,G_,"app");var bc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ln,Uh;(function(){var e;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(E,g){function v(){}v.prototype=g.prototype,E.D=g.prototype,E.prototype=new v,E.prototype.constructor=E,E.C=function(I,w,S){for(var y=Array(arguments.length-2),fe=2;fe<arguments.length;fe++)y[fe-2]=arguments[fe];return g.prototype[w].apply(I,y)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(E,g,v){v||(v=0);var I=Array(16);if(typeof g=="string")for(var w=0;16>w;++w)I[w]=g.charCodeAt(v++)|g.charCodeAt(v++)<<8|g.charCodeAt(v++)<<16|g.charCodeAt(v++)<<24;else for(w=0;16>w;++w)I[w]=g[v++]|g[v++]<<8|g[v++]<<16|g[v++]<<24;g=E.g[0],v=E.g[1],w=E.g[2];var S=E.g[3],y=g+(S^v&(w^S))+I[0]+3614090360&4294967295;g=v+(y<<7&4294967295|y>>>25),y=S+(w^g&(v^w))+I[1]+3905402710&4294967295,S=g+(y<<12&4294967295|y>>>20),y=w+(v^S&(g^v))+I[2]+606105819&4294967295,w=S+(y<<17&4294967295|y>>>15),y=v+(g^w&(S^g))+I[3]+3250441966&4294967295,v=w+(y<<22&4294967295|y>>>10),y=g+(S^v&(w^S))+I[4]+4118548399&4294967295,g=v+(y<<7&4294967295|y>>>25),y=S+(w^g&(v^w))+I[5]+1200080426&4294967295,S=g+(y<<12&4294967295|y>>>20),y=w+(v^S&(g^v))+I[6]+2821735955&4294967295,w=S+(y<<17&4294967295|y>>>15),y=v+(g^w&(S^g))+I[7]+4249261313&4294967295,v=w+(y<<22&4294967295|y>>>10),y=g+(S^v&(w^S))+I[8]+1770035416&4294967295,g=v+(y<<7&4294967295|y>>>25),y=S+(w^g&(v^w))+I[9]+2336552879&4294967295,S=g+(y<<12&4294967295|y>>>20),y=w+(v^S&(g^v))+I[10]+4294925233&4294967295,w=S+(y<<17&4294967295|y>>>15),y=v+(g^w&(S^g))+I[11]+2304563134&4294967295,v=w+(y<<22&4294967295|y>>>10),y=g+(S^v&(w^S))+I[12]+1804603682&4294967295,g=v+(y<<7&4294967295|y>>>25),y=S+(w^g&(v^w))+I[13]+4254626195&4294967295,S=g+(y<<12&4294967295|y>>>20),y=w+(v^S&(g^v))+I[14]+2792965006&4294967295,w=S+(y<<17&4294967295|y>>>15),y=v+(g^w&(S^g))+I[15]+1236535329&4294967295,v=w+(y<<22&4294967295|y>>>10),y=g+(w^S&(v^w))+I[1]+4129170786&4294967295,g=v+(y<<5&4294967295|y>>>27),y=S+(v^w&(g^v))+I[6]+3225465664&4294967295,S=g+(y<<9&4294967295|y>>>23),y=w+(g^v&(S^g))+I[11]+643717713&4294967295,w=S+(y<<14&4294967295|y>>>18),y=v+(S^g&(w^S))+I[0]+3921069994&4294967295,v=w+(y<<20&4294967295|y>>>12),y=g+(w^S&(v^w))+I[5]+3593408605&4294967295,g=v+(y<<5&4294967295|y>>>27),y=S+(v^w&(g^v))+I[10]+38016083&4294967295,S=g+(y<<9&4294967295|y>>>23),y=w+(g^v&(S^g))+I[15]+3634488961&4294967295,w=S+(y<<14&4294967295|y>>>18),y=v+(S^g&(w^S))+I[4]+3889429448&4294967295,v=w+(y<<20&4294967295|y>>>12),y=g+(w^S&(v^w))+I[9]+568446438&4294967295,g=v+(y<<5&4294967295|y>>>27),y=S+(v^w&(g^v))+I[14]+3275163606&4294967295,S=g+(y<<9&4294967295|y>>>23),y=w+(g^v&(S^g))+I[3]+4107603335&4294967295,w=S+(y<<14&4294967295|y>>>18),y=v+(S^g&(w^S))+I[8]+1163531501&4294967295,v=w+(y<<20&4294967295|y>>>12),y=g+(w^S&(v^w))+I[13]+2850285829&4294967295,g=v+(y<<5&4294967295|y>>>27),y=S+(v^w&(g^v))+I[2]+4243563512&4294967295,S=g+(y<<9&4294967295|y>>>23),y=w+(g^v&(S^g))+I[7]+1735328473&4294967295,w=S+(y<<14&4294967295|y>>>18),y=v+(S^g&(w^S))+I[12]+2368359562&4294967295,v=w+(y<<20&4294967295|y>>>12),y=g+(v^w^S)+I[5]+4294588738&4294967295,g=v+(y<<4&4294967295|y>>>28),y=S+(g^v^w)+I[8]+2272392833&4294967295,S=g+(y<<11&4294967295|y>>>21),y=w+(S^g^v)+I[11]+1839030562&4294967295,w=S+(y<<16&4294967295|y>>>16),y=v+(w^S^g)+I[14]+4259657740&4294967295,v=w+(y<<23&4294967295|y>>>9),y=g+(v^w^S)+I[1]+2763975236&4294967295,g=v+(y<<4&4294967295|y>>>28),y=S+(g^v^w)+I[4]+1272893353&4294967295,S=g+(y<<11&4294967295|y>>>21),y=w+(S^g^v)+I[7]+4139469664&4294967295,w=S+(y<<16&4294967295|y>>>16),y=v+(w^S^g)+I[10]+3200236656&4294967295,v=w+(y<<23&4294967295|y>>>9),y=g+(v^w^S)+I[13]+681279174&4294967295,g=v+(y<<4&4294967295|y>>>28),y=S+(g^v^w)+I[0]+3936430074&4294967295,S=g+(y<<11&4294967295|y>>>21),y=w+(S^g^v)+I[3]+3572445317&4294967295,w=S+(y<<16&4294967295|y>>>16),y=v+(w^S^g)+I[6]+76029189&4294967295,v=w+(y<<23&4294967295|y>>>9),y=g+(v^w^S)+I[9]+3654602809&4294967295,g=v+(y<<4&4294967295|y>>>28),y=S+(g^v^w)+I[12]+3873151461&4294967295,S=g+(y<<11&4294967295|y>>>21),y=w+(S^g^v)+I[15]+530742520&4294967295,w=S+(y<<16&4294967295|y>>>16),y=v+(w^S^g)+I[2]+3299628645&4294967295,v=w+(y<<23&4294967295|y>>>9),y=g+(w^(v|~S))+I[0]+4096336452&4294967295,g=v+(y<<6&4294967295|y>>>26),y=S+(v^(g|~w))+I[7]+1126891415&4294967295,S=g+(y<<10&4294967295|y>>>22),y=w+(g^(S|~v))+I[14]+2878612391&4294967295,w=S+(y<<15&4294967295|y>>>17),y=v+(S^(w|~g))+I[5]+4237533241&4294967295,v=w+(y<<21&4294967295|y>>>11),y=g+(w^(v|~S))+I[12]+1700485571&4294967295,g=v+(y<<6&4294967295|y>>>26),y=S+(v^(g|~w))+I[3]+2399980690&4294967295,S=g+(y<<10&4294967295|y>>>22),y=w+(g^(S|~v))+I[10]+4293915773&4294967295,w=S+(y<<15&4294967295|y>>>17),y=v+(S^(w|~g))+I[1]+2240044497&4294967295,v=w+(y<<21&4294967295|y>>>11),y=g+(w^(v|~S))+I[8]+1873313359&4294967295,g=v+(y<<6&4294967295|y>>>26),y=S+(v^(g|~w))+I[15]+4264355552&4294967295,S=g+(y<<10&4294967295|y>>>22),y=w+(g^(S|~v))+I[6]+2734768916&4294967295,w=S+(y<<15&4294967295|y>>>17),y=v+(S^(w|~g))+I[13]+1309151649&4294967295,v=w+(y<<21&4294967295|y>>>11),y=g+(w^(v|~S))+I[4]+4149444226&4294967295,g=v+(y<<6&4294967295|y>>>26),y=S+(v^(g|~w))+I[11]+3174756917&4294967295,S=g+(y<<10&4294967295|y>>>22),y=w+(g^(S|~v))+I[2]+718787259&4294967295,w=S+(y<<15&4294967295|y>>>17),y=v+(S^(w|~g))+I[9]+3951481745&4294967295,E.g[0]=E.g[0]+g&4294967295,E.g[1]=E.g[1]+(w+(y<<21&4294967295|y>>>11))&4294967295,E.g[2]=E.g[2]+w&4294967295,E.g[3]=E.g[3]+S&4294967295}r.prototype.u=function(E,g){g===void 0&&(g=E.length);for(var v=g-this.blockSize,I=this.B,w=this.h,S=0;S<g;){if(w==0)for(;S<=v;)s(this,E,S),S+=this.blockSize;if(typeof E=="string"){for(;S<g;)if(I[w++]=E.charCodeAt(S++),w==this.blockSize){s(this,I),w=0;break}}else for(;S<g;)if(I[w++]=E[S++],w==this.blockSize){s(this,I),w=0;break}}this.h=w,this.o+=g},r.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var g=1;g<E.length-8;++g)E[g]=0;var v=8*this.o;for(g=E.length-8;g<E.length;++g)E[g]=v&255,v/=256;for(this.u(E),E=Array(16),g=v=0;4>g;++g)for(var I=0;32>I;I+=8)E[v++]=this.g[g]>>>I&255;return E};function o(E,g){var v=l;return Object.prototype.hasOwnProperty.call(v,E)?v[E]:v[E]=g(E)}function a(E,g){this.h=g;for(var v=[],I=!0,w=E.length-1;0<=w;w--){var S=E[w]|0;I&&S==g||(v[w]=S,I=!1)}this.g=v}var l={};function u(E){return-128<=E&&128>E?o(E,function(g){return new a([g|0],0>g?-1:0)}):new a([E|0],0>E?-1:0)}function f(E){if(isNaN(E)||!isFinite(E))return m;if(0>E)return $(f(-E));for(var g=[],v=1,I=0;E>=v;I++)g[I]=E/v|0,v*=4294967296;return new a(g,0)}function d(E,g){if(E.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(E.charAt(0)=="-")return $(d(E.substring(1),g));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var v=f(Math.pow(g,8)),I=m,w=0;w<E.length;w+=8){var S=Math.min(8,E.length-w),y=parseInt(E.substring(w,w+S),g);8>S?(S=f(Math.pow(g,S)),I=I.j(S).add(f(y))):(I=I.j(v),I=I.add(f(y)))}return I}var m=u(0),A=u(1),C=u(16777216);e=a.prototype,e.m=function(){if(L(this))return-$(this).m();for(var E=0,g=1,v=0;v<this.g.length;v++){var I=this.i(v);E+=(0<=I?I:4294967296+I)*g,g*=4294967296}return E},e.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(x(this))return"0";if(L(this))return"-"+$(this).toString(E);for(var g=f(Math.pow(E,6)),v=this,I="";;){var w=N(v,g).g;v=Y(v,w.j(g));var S=((0<v.g.length?v.g[0]:v.h)>>>0).toString(E);if(v=w,x(v))return S+I;for(;6>S.length;)S="0"+S;I=S+I}},e.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function x(E){if(E.h!=0)return!1;for(var g=0;g<E.g.length;g++)if(E.g[g]!=0)return!1;return!0}function L(E){return E.h==-1}e.l=function(E){return E=Y(this,E),L(E)?-1:x(E)?0:1};function $(E){for(var g=E.g.length,v=[],I=0;I<g;I++)v[I]=~E.g[I];return new a(v,~E.h).add(A)}e.abs=function(){return L(this)?$(this):this},e.add=function(E){for(var g=Math.max(this.g.length,E.g.length),v=[],I=0,w=0;w<=g;w++){var S=I+(this.i(w)&65535)+(E.i(w)&65535),y=(S>>>16)+(this.i(w)>>>16)+(E.i(w)>>>16);I=y>>>16,S&=65535,y&=65535,v[w]=y<<16|S}return new a(v,v[v.length-1]&-2147483648?-1:0)};function Y(E,g){return E.add($(g))}e.j=function(E){if(x(this)||x(E))return m;if(L(this))return L(E)?$(this).j($(E)):$($(this).j(E));if(L(E))return $(this.j($(E)));if(0>this.l(C)&&0>E.l(C))return f(this.m()*E.m());for(var g=this.g.length+E.g.length,v=[],I=0;I<2*g;I++)v[I]=0;for(I=0;I<this.g.length;I++)for(var w=0;w<E.g.length;w++){var S=this.i(I)>>>16,y=this.i(I)&65535,fe=E.i(w)>>>16,We=E.i(w)&65535;v[2*I+2*w]+=y*We,z(v,2*I+2*w),v[2*I+2*w+1]+=S*We,z(v,2*I+2*w+1),v[2*I+2*w+1]+=y*fe,z(v,2*I+2*w+1),v[2*I+2*w+2]+=S*fe,z(v,2*I+2*w+2)}for(I=0;I<g;I++)v[I]=v[2*I+1]<<16|v[2*I];for(I=g;I<2*g;I++)v[I]=0;return new a(v,0)};function z(E,g){for(;(E[g]&65535)!=E[g];)E[g+1]+=E[g]>>>16,E[g]&=65535,g++}function G(E,g){this.g=E,this.h=g}function N(E,g){if(x(g))throw Error("division by zero");if(x(E))return new G(m,m);if(L(E))return g=N($(E),g),new G($(g.g),$(g.h));if(L(g))return g=N(E,$(g)),new G($(g.g),g.h);if(30<E.g.length){if(L(E)||L(g))throw Error("slowDivide_ only works with positive integers.");for(var v=A,I=g;0>=I.l(E);)v=W(v),I=W(I);var w=X(v,1),S=X(I,1);for(I=X(I,2),v=X(v,2);!x(I);){var y=S.add(I);0>=y.l(E)&&(w=w.add(v),S=y),I=X(I,1),v=X(v,1)}return g=Y(E,w.j(g)),new G(w,g)}for(w=m;0<=E.l(g);){for(v=Math.max(1,Math.floor(E.m()/g.m())),I=Math.ceil(Math.log(v)/Math.LN2),I=48>=I?1:Math.pow(2,I-48),S=f(v),y=S.j(g);L(y)||0<y.l(E);)v-=I,S=f(v),y=S.j(g);x(S)&&(S=A),w=w.add(S),E=Y(E,y)}return new G(w,E)}e.A=function(E){return N(this,E).h},e.and=function(E){for(var g=Math.max(this.g.length,E.g.length),v=[],I=0;I<g;I++)v[I]=this.i(I)&E.i(I);return new a(v,this.h&E.h)},e.or=function(E){for(var g=Math.max(this.g.length,E.g.length),v=[],I=0;I<g;I++)v[I]=this.i(I)|E.i(I);return new a(v,this.h|E.h)},e.xor=function(E){for(var g=Math.max(this.g.length,E.g.length),v=[],I=0;I<g;I++)v[I]=this.i(I)^E.i(I);return new a(v,this.h^E.h)};function W(E){for(var g=E.g.length+1,v=[],I=0;I<g;I++)v[I]=E.i(I)<<1|E.i(I-1)>>>31;return new a(v,E.h)}function X(E,g){var v=g>>5;g%=32;for(var I=E.g.length-v,w=[],S=0;S<I;S++)w[S]=0<g?E.i(S+v)>>>g|E.i(S+v+1)<<32-g:E.i(S+v);return new a(w,E.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Uh=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=f,a.fromString=d,ln=a}).apply(typeof bc<"u"?bc:typeof self<"u"?self:typeof window<"u"?window:{});var Us=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Bh,Ur,$h,Ws,jo,jh,qh,Hh;(function(){var e,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(i,c,h){return i==Array.prototype||i==Object.prototype||(i[c]=h.value),i};function n(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof Us=="object"&&Us];for(var c=0;c<i.length;++c){var h=i[c];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=n(this);function s(i,c){if(c)t:{var h=r;i=i.split(".");for(var p=0;p<i.length-1;p++){var b=i[p];if(!(b in h))break t;h=h[b]}i=i[i.length-1],p=h[i],c=c(p),c!=p&&c!=null&&t(h,i,{configurable:!0,writable:!0,value:c})}}function o(i,c){i instanceof String&&(i+="");var h=0,p=!1,b={next:function(){if(!p&&h<i.length){var R=h++;return{value:c(R,i[R]),done:!1}}return p=!0,{done:!0,value:void 0}}};return b[Symbol.iterator]=function(){return b},b}s("Array.prototype.values",function(i){return i||function(){return o(this,function(c,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function u(i){var c=typeof i;return c=c!="object"?c:i?Array.isArray(i)?"array":c:"null",c=="array"||c=="object"&&typeof i.length=="number"}function f(i){var c=typeof i;return c=="object"&&i!=null||c=="function"}function d(i,c,h){return i.call.apply(i.bind,arguments)}function m(i,c,h){if(!i)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var b=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(b,p),i.apply(c,b)}}return function(){return i.apply(c,arguments)}}function A(i,c,h){return A=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?d:m,A.apply(null,arguments)}function C(i,c){var h=Array.prototype.slice.call(arguments,1);return function(){var p=h.slice();return p.push.apply(p,arguments),i.apply(this,p)}}function x(i,c){function h(){}h.prototype=c.prototype,i.aa=c.prototype,i.prototype=new h,i.prototype.constructor=i,i.Qb=function(p,b,R){for(var B=Array(arguments.length-2),Et=2;Et<arguments.length;Et++)B[Et-2]=arguments[Et];return c.prototype[b].apply(p,B)}}function L(i){const c=i.length;if(0<c){const h=Array(c);for(let p=0;p<c;p++)h[p]=i[p];return h}return[]}function $(i,c){for(let h=1;h<arguments.length;h++){const p=arguments[h];if(u(p)){const b=i.length||0,R=p.length||0;i.length=b+R;for(let B=0;B<R;B++)i[b+B]=p[B]}else i.push(p)}}class Y{constructor(c,h){this.i=c,this.j=h,this.h=0,this.g=null}get(){let c;return 0<this.h?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function z(i){return/^[\s\xa0]*$/.test(i)}function G(){var i=l.navigator;return i&&(i=i.userAgent)?i:""}function N(i){return N[" "](i),i}N[" "]=function(){};var W=G().indexOf("Gecko")!=-1&&!(G().toLowerCase().indexOf("webkit")!=-1&&G().indexOf("Edge")==-1)&&!(G().indexOf("Trident")!=-1||G().indexOf("MSIE")!=-1)&&G().indexOf("Edge")==-1;function X(i,c,h){for(const p in i)c.call(h,i[p],p,i)}function E(i,c){for(const h in i)c.call(void 0,i[h],h,i)}function g(i){const c={};for(const h in i)c[h]=i[h];return c}const v="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function I(i,c){let h,p;for(let b=1;b<arguments.length;b++){p=arguments[b];for(h in p)i[h]=p[h];for(let R=0;R<v.length;R++)h=v[R],Object.prototype.hasOwnProperty.call(p,h)&&(i[h]=p[h])}}function w(i){var c=1;i=i.split(":");const h=[];for(;0<c&&i.length;)h.push(i.shift()),c--;return i.length&&h.push(i.join(":")),h}function S(i){l.setTimeout(()=>{throw i},0)}function y(){var i=we;let c=null;return i.g&&(c=i.g,i.g=i.g.next,i.g||(i.h=null),c.next=null),c}class fe{constructor(){this.h=this.g=null}add(c,h){const p=We.get();p.set(c,h),this.h?this.h.next=p:this.g=p,this.h=p}}var We=new Y(()=>new Bt,i=>i.reset());class Bt{constructor(){this.next=this.g=this.h=null}set(c,h){this.h=c,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let vt,gt=!1,we=new fe,yn=()=>{const i=l.Promise.resolve(void 0);vt=()=>{i.then(Fe)}};var Fe=()=>{for(var i;i=y();){try{i.h.call(i.g)}catch(h){S(h)}var c=We;c.j(i),100>c.h&&(c.h++,i.next=c.g,c.g=i)}gt=!1};function Mt(){this.s=this.s,this.C=this.C}Mt.prototype.s=!1,Mt.prototype.ma=function(){this.s||(this.s=!0,this.N())},Mt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function kt(i,c){this.type=i,this.g=this.target=c,this.defaultPrevented=!1}kt.prototype.h=function(){this.defaultPrevented=!0};var qi=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var i=!1,c=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const h=()=>{};l.addEventListener("test",h,c),l.removeEventListener("test",h,c)}catch{}return i}();function vn(i,c){if(kt.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i){var h=this.type=i.type,p=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;if(this.target=i.target||i.srcElement,this.g=c,c=i.relatedTarget){if(W){t:{try{N(c.nodeName);var b=!0;break t}catch{}b=!1}b||(c=null)}}else h=="mouseover"?c=i.fromElement:h=="mouseout"&&(c=i.toElement);this.relatedTarget=c,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=typeof i.pointerType=="string"?i.pointerType:En[i.pointerType]||"",this.state=i.state,this.i=i,i.defaultPrevented&&vn.aa.h.call(this)}}x(vn,kt);var En={2:"touch",3:"pen",4:"mouse"};vn.prototype.h=function(){vn.aa.h.call(this);var i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var Ue="closure_listenable_"+(1e6*Math.random()|0),Tr=0;function ys(i,c,h,p,b){this.listener=i,this.proxy=null,this.src=c,this.type=h,this.capture=!!p,this.ha=b,this.key=++Tr,this.da=this.fa=!1}function Ce(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Ir(i){this.src=i,this.g={},this.h=0}Ir.prototype.add=function(i,c,h,p,b){var R=i.toString();i=this.g[R],i||(i=this.g[R]=[],this.h++);var B=T(i,c,p,b);return-1<B?(c=i[B],h||(c.fa=!1)):(c=new ys(c,this.src,R,!!p,b),c.fa=h,i.push(c)),c};function _(i,c){var h=c.type;if(h in i.g){var p=i.g[h],b=Array.prototype.indexOf.call(p,c,void 0),R;(R=0<=b)&&Array.prototype.splice.call(p,b,1),R&&(Ce(c),i.g[h].length==0&&(delete i.g[h],i.h--))}}function T(i,c,h,p){for(var b=0;b<i.length;++b){var R=i[b];if(!R.da&&R.listener==c&&R.capture==!!h&&R.ha==p)return b}return-1}var P="closure_lm_"+(1e6*Math.random()|0),O={};function D(i,c,h,p,b){if(Array.isArray(c)){for(var R=0;R<c.length;R++)D(i,c[R],h,p,b);return null}return h=et(h),i&&i[Ue]?i.K(c,h,f(p)?!!p.capture:!1,b):M(i,c,h,!1,p,b)}function M(i,c,h,p,b,R){if(!c)throw Error("Invalid event type");var B=f(b)?!!b.capture:!!b,Et=H(i);if(Et||(i[P]=Et=new Ir(i)),h=Et.add(c,h,p,B,R),h.proxy)return h;if(p=q(),h.proxy=p,p.src=i,p.listener=h,i.addEventListener)qi||(b=B),b===void 0&&(b=!1),i.addEventListener(c.toString(),p,b);else if(i.attachEvent)i.attachEvent(k(c.toString()),p);else if(i.addListener&&i.removeListener)i.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return h}function q(){function i(h){return c.call(i.src,i.listener,h)}const c=J;return i}function U(i,c,h,p,b){if(Array.isArray(c))for(var R=0;R<c.length;R++)U(i,c[R],h,p,b);else p=f(p)?!!p.capture:!!p,h=et(h),i&&i[Ue]?(i=i.i,c=String(c).toString(),c in i.g&&(R=i.g[c],h=T(R,h,p,b),-1<h&&(Ce(R[h]),Array.prototype.splice.call(R,h,1),R.length==0&&(delete i.g[c],i.h--)))):i&&(i=H(i))&&(c=i.g[c.toString()],i=-1,c&&(i=T(c,h,p,b)),(h=-1<i?c[i]:null)&&F(h))}function F(i){if(typeof i!="number"&&i&&!i.da){var c=i.src;if(c&&c[Ue])_(c.i,i);else{var h=i.type,p=i.proxy;c.removeEventListener?c.removeEventListener(h,p,i.capture):c.detachEvent?c.detachEvent(k(h),p):c.addListener&&c.removeListener&&c.removeListener(p),(h=H(c))?(_(h,i),h.h==0&&(h.src=null,c[P]=null)):Ce(i)}}}function k(i){return i in O?O[i]:O[i]="on"+i}function J(i,c){if(i.da)i=!0;else{c=new vn(c,this);var h=i.listener,p=i.ha||i.src;i.fa&&F(i),i=h.call(p,c)}return i}function H(i){return i=i[P],i instanceof Ir?i:null}var Q="__closure_events_fn_"+(1e9*Math.random()>>>0);function et(i){return typeof i=="function"?i:(i[Q]||(i[Q]=function(c){return i.handleEvent(c)}),i[Q])}function Z(){Mt.call(this),this.i=new Ir(this),this.M=this,this.F=null}x(Z,Mt),Z.prototype[Ue]=!0,Z.prototype.removeEventListener=function(i,c,h,p){U(this,i,c,h,p)};function ot(i,c){var h,p=i.F;if(p)for(h=[];p;p=p.F)h.push(p);if(i=i.M,p=c.type||c,typeof c=="string")c=new kt(c,i);else if(c instanceof kt)c.target=c.target||i;else{var b=c;c=new kt(p,i),I(c,b)}if(b=!0,h)for(var R=h.length-1;0<=R;R--){var B=c.g=h[R];b=ut(B,p,!0,c)&&b}if(B=c.g=i,b=ut(B,p,!0,c)&&b,b=ut(B,p,!1,c)&&b,h)for(R=0;R<h.length;R++)B=c.g=h[R],b=ut(B,p,!1,c)&&b}Z.prototype.N=function(){if(Z.aa.N.call(this),this.i){var i=this.i,c;for(c in i.g){for(var h=i.g[c],p=0;p<h.length;p++)Ce(h[p]);delete i.g[c],i.h--}}this.F=null},Z.prototype.K=function(i,c,h,p){return this.i.add(String(i),c,!1,h,p)},Z.prototype.L=function(i,c,h,p){return this.i.add(String(i),c,!0,h,p)};function ut(i,c,h,p){if(c=i.i.g[String(c)],!c)return!0;c=c.concat();for(var b=!0,R=0;R<c.length;++R){var B=c[R];if(B&&!B.da&&B.capture==h){var Et=B.listener,qt=B.ha||B.src;B.fa&&_(i.i,B),b=Et.call(qt,p)!==!1&&b}}return b&&!p.defaultPrevented}function Gt(i,c,h){if(typeof i=="function")h&&(i=A(i,h));else if(i&&typeof i.handleEvent=="function")i=A(i.handleEvent,i);else throw Error("Invalid listener argument");return 2147483647<Number(c)?-1:l.setTimeout(i,c||0)}function $t(i){i.g=Gt(()=>{i.g=null,i.i&&(i.i=!1,$t(i))},i.l);const c=i.h;i.h=null,i.m.apply(null,c)}class ye extends Mt{constructor(c,h){super(),this.m=c,this.l=h,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:$t(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Wt(i){Mt.call(this),this.h=i,this.g={}}x(Wt,Mt);var Qe=[];function wr(i){X(i.g,function(c,h){this.g.hasOwnProperty(h)&&F(c)},i),i.g={}}Wt.prototype.N=function(){Wt.aa.N.call(this),wr(this)},Wt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var jt=l.JSON.stringify,ve=l.JSON.parse,vs=class{stringify(i){return l.JSON.stringify(i,void 0)}parse(i){return l.JSON.parse(i,void 0)}};function Hi(){}Hi.prototype.h=null;function Wa(i){return i.h||(i.h=i.i())}function Qa(){}var Ar={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function zi(){kt.call(this,"d")}x(zi,kt);function Ki(){kt.call(this,"c")}x(Ki,kt);var Tn={},Xa=null;function Es(){return Xa=Xa||new Z}Tn.La="serverreachability";function Ya(i){kt.call(this,Tn.La,i)}x(Ya,kt);function br(i){const c=Es();ot(c,new Ya(c))}Tn.STAT_EVENT="statevent";function Ja(i,c){kt.call(this,Tn.STAT_EVENT,i),this.stat=c}x(Ja,kt);function ie(i){const c=Es();ot(c,new Ja(c,i))}Tn.Ma="timingevent";function Za(i,c){kt.call(this,Tn.Ma,i),this.size=c}x(Za,kt);function Sr(i,c){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){i()},c)}function Cr(){this.g=!0}Cr.prototype.xa=function(){this.g=!1};function Qf(i,c,h,p,b,R){i.info(function(){if(i.g)if(R)for(var B="",Et=R.split("&"),qt=0;qt<Et.length;qt++){var mt=Et[qt].split("=");if(1<mt.length){var Qt=mt[0];mt=mt[1];var Xt=Qt.split("_");B=2<=Xt.length&&Xt[1]=="type"?B+(Qt+"="+mt+"&"):B+(Qt+"=redacted&")}}else B=null;else B=R;return"XMLHTTP REQ ("+p+") [attempt "+b+"]: "+c+`
`+h+`
`+B})}function Xf(i,c,h,p,b,R,B){i.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+b+"]: "+c+`
`+h+`
`+R+" "+B})}function Un(i,c,h,p){i.info(function(){return"XMLHTTP TEXT ("+c+"): "+Jf(i,h)+(p?" "+p:"")})}function Yf(i,c){i.info(function(){return"TIMEOUT: "+c})}Cr.prototype.info=function(){};function Jf(i,c){if(!i.g)return c;if(!c)return null;try{var h=JSON.parse(c);if(h){for(i=0;i<h.length;i++)if(Array.isArray(h[i])){var p=h[i];if(!(2>p.length)){var b=p[1];if(Array.isArray(b)&&!(1>b.length)){var R=b[0];if(R!="noop"&&R!="stop"&&R!="close")for(var B=1;B<b.length;B++)b[B]=""}}}}return jt(h)}catch{return c}}var Ts={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},tl={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Gi;function Is(){}x(Is,Hi),Is.prototype.g=function(){return new XMLHttpRequest},Is.prototype.i=function(){return{}},Gi=new Is;function Xe(i,c,h,p){this.j=i,this.i=c,this.l=h,this.R=p||1,this.U=new Wt(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new el}function el(){this.i=null,this.g="",this.h=!1}var nl={},Wi={};function Qi(i,c,h){i.L=1,i.v=Ss(Be(c)),i.m=h,i.P=!0,rl(i,null)}function rl(i,c){i.F=Date.now(),ws(i),i.A=Be(i.v);var h=i.A,p=i.R;Array.isArray(p)||(p=[String(p)]),_l(h.i,"t",p),i.C=0,h=i.j.J,i.h=new el,i.g=Ml(i.j,h?c:null,!i.m),0<i.O&&(i.M=new ye(A(i.Y,i,i.g),i.O)),c=i.U,h=i.g,p=i.ca;var b="readystatechange";Array.isArray(b)||(b&&(Qe[0]=b.toString()),b=Qe);for(var R=0;R<b.length;R++){var B=D(h,b[R],p||c.handleEvent,!1,c.h||c);if(!B)break;c.g[B.key]=B}c=i.H?g(i.H):{},i.m?(i.u||(i.u="POST"),c["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.A,i.u,i.m,c)):(i.u="GET",i.g.ea(i.A,i.u,null,c)),br(),Qf(i.i,i.u,i.A,i.l,i.R,i.m)}Xe.prototype.ca=function(i){i=i.target;const c=this.M;c&&$e(i)==3?c.j():this.Y(i)},Xe.prototype.Y=function(i){try{if(i==this.g)t:{const Xt=$e(this.g);var c=this.g.Ba();const jn=this.g.Z();if(!(3>Xt)&&(Xt!=3||this.g&&(this.h.h||this.g.oa()||Al(this.g)))){this.J||Xt!=4||c==7||(c==8||0>=jn?br(3):br(2)),Xi(this);var h=this.g.Z();this.X=h;e:if(sl(this)){var p=Al(this.g);i="";var b=p.length,R=$e(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){In(this),Rr(this);var B="";break e}this.h.i=new l.TextDecoder}for(c=0;c<b;c++)this.h.h=!0,i+=this.h.i.decode(p[c],{stream:!(R&&c==b-1)});p.length=0,this.h.g+=i,this.C=0,B=this.h.g}else B=this.g.oa();if(this.o=h==200,Xf(this.i,this.u,this.A,this.l,this.R,Xt,h),this.o){if(this.T&&!this.K){e:{if(this.g){var Et,qt=this.g;if((Et=qt.g?qt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!z(Et)){var mt=Et;break e}}mt=null}if(h=mt)Un(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Yi(this,h);else{this.o=!1,this.s=3,ie(12),In(this),Rr(this);break t}}if(this.P){h=!0;let Ae;for(;!this.J&&this.C<B.length;)if(Ae=Zf(this,B),Ae==Wi){Xt==4&&(this.s=4,ie(14),h=!1),Un(this.i,this.l,null,"[Incomplete Response]");break}else if(Ae==nl){this.s=4,ie(15),Un(this.i,this.l,B,"[Invalid Chunk]"),h=!1;break}else Un(this.i,this.l,Ae,null),Yi(this,Ae);if(sl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Xt!=4||B.length!=0||this.h.h||(this.s=1,ie(16),h=!1),this.o=this.o&&h,!h)Un(this.i,this.l,B,"[Invalid Chunked Response]"),In(this),Rr(this);else if(0<B.length&&!this.W){this.W=!0;var Qt=this.j;Qt.g==this&&Qt.ba&&!Qt.M&&(Qt.j.info("Great, no buffering proxy detected. Bytes received: "+B.length),ro(Qt),Qt.M=!0,ie(11))}}else Un(this.i,this.l,B,null),Yi(this,B);Xt==4&&In(this),this.o&&!this.J&&(Xt==4?Dl(this.j,this):(this.o=!1,ws(this)))}else md(this.g),h==400&&0<B.indexOf("Unknown SID")?(this.s=3,ie(12)):(this.s=0,ie(13)),In(this),Rr(this)}}}catch{}finally{}};function sl(i){return i.g?i.u=="GET"&&i.L!=2&&i.j.Ca:!1}function Zf(i,c){var h=i.C,p=c.indexOf(`
`,h);return p==-1?Wi:(h=Number(c.substring(h,p)),isNaN(h)?nl:(p+=1,p+h>c.length?Wi:(c=c.slice(p,p+h),i.C=p+h,c)))}Xe.prototype.cancel=function(){this.J=!0,In(this)};function ws(i){i.S=Date.now()+i.I,il(i,i.I)}function il(i,c){if(i.B!=null)throw Error("WatchDog timer not null");i.B=Sr(A(i.ba,i),c)}function Xi(i){i.B&&(l.clearTimeout(i.B),i.B=null)}Xe.prototype.ba=function(){this.B=null;const i=Date.now();0<=i-this.S?(Yf(this.i,this.A),this.L!=2&&(br(),ie(17)),In(this),this.s=2,Rr(this)):il(this,this.S-i)};function Rr(i){i.j.G==0||i.J||Dl(i.j,i)}function In(i){Xi(i);var c=i.M;c&&typeof c.ma=="function"&&c.ma(),i.M=null,wr(i.U),i.g&&(c=i.g,i.g=null,c.abort(),c.ma())}function Yi(i,c){try{var h=i.j;if(h.G!=0&&(h.g==i||Ji(h.h,i))){if(!i.K&&Ji(h.h,i)&&h.G==3){try{var p=h.Da.g.parse(c)}catch{p=null}if(Array.isArray(p)&&p.length==3){var b=p;if(b[0]==0){t:if(!h.u){if(h.g)if(h.g.F+3e3<i.F)xs(h),Vs(h);else break t;no(h),ie(18)}}else h.za=b[1],0<h.za-h.T&&37500>b[2]&&h.F&&h.v==0&&!h.C&&(h.C=Sr(A(h.Za,h),6e3));if(1>=ll(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else An(h,11)}else if((i.K||h.g==i)&&xs(h),!z(c))for(b=h.Da.g.parse(c),c=0;c<b.length;c++){let mt=b[c];if(h.T=mt[0],mt=mt[1],h.G==2)if(mt[0]=="c"){h.K=mt[1],h.ia=mt[2];const Qt=mt[3];Qt!=null&&(h.la=Qt,h.j.info("VER="+h.la));const Xt=mt[4];Xt!=null&&(h.Aa=Xt,h.j.info("SVER="+h.Aa));const jn=mt[5];jn!=null&&typeof jn=="number"&&0<jn&&(p=1.5*jn,h.L=p,h.j.info("backChannelRequestTimeoutMs_="+p)),p=h;const Ae=i.g;if(Ae){const Os=Ae.g?Ae.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Os){var R=p.h;R.g||Os.indexOf("spdy")==-1&&Os.indexOf("quic")==-1&&Os.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(Zi(R,R.h),R.h=null))}if(p.D){const so=Ae.g?Ae.g.getResponseHeader("X-HTTP-Session-Id"):null;so&&(p.ya=so,wt(p.I,p.D,so))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-i.F,h.j.info("Handshake RTT: "+h.R+"ms")),p=h;var B=i;if(p.qa=Ol(p,p.J?p.ia:null,p.W),B.K){cl(p.h,B);var Et=B,qt=p.L;qt&&(Et.I=qt),Et.B&&(Xi(Et),ws(Et)),p.g=B}else Pl(p);0<h.i.length&&Ds(h)}else mt[0]!="stop"&&mt[0]!="close"||An(h,7);else h.G==3&&(mt[0]=="stop"||mt[0]=="close"?mt[0]=="stop"?An(h,7):eo(h):mt[0]!="noop"&&h.l&&h.l.ta(mt),h.v=0)}}br(4)}catch{}}var td=class{constructor(i,c){this.g=i,this.map=c}};function ol(i){this.l=i||10,l.PerformanceNavigationTiming?(i=l.performance.getEntriesByType("navigation"),i=0<i.length&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function al(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function ll(i){return i.h?1:i.g?i.g.size:0}function Ji(i,c){return i.h?i.h==c:i.g?i.g.has(c):!1}function Zi(i,c){i.g?i.g.add(c):i.h=c}function cl(i,c){i.h&&i.h==c?i.h=null:i.g&&i.g.has(c)&&i.g.delete(c)}ol.prototype.cancel=function(){if(this.i=ul(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function ul(i){if(i.h!=null)return i.i.concat(i.h.D);if(i.g!=null&&i.g.size!==0){let c=i.i;for(const h of i.g.values())c=c.concat(h.D);return c}return L(i.i)}function ed(i){if(i.V&&typeof i.V=="function")return i.V();if(typeof Map<"u"&&i instanceof Map||typeof Set<"u"&&i instanceof Set)return Array.from(i.values());if(typeof i=="string")return i.split("");if(u(i)){for(var c=[],h=i.length,p=0;p<h;p++)c.push(i[p]);return c}c=[],h=0;for(p in i)c[h++]=i[p];return c}function nd(i){if(i.na&&typeof i.na=="function")return i.na();if(!i.V||typeof i.V!="function"){if(typeof Map<"u"&&i instanceof Map)return Array.from(i.keys());if(!(typeof Set<"u"&&i instanceof Set)){if(u(i)||typeof i=="string"){var c=[];i=i.length;for(var h=0;h<i;h++)c.push(h);return c}c=[],h=0;for(const p in i)c[h++]=p;return c}}}function hl(i,c){if(i.forEach&&typeof i.forEach=="function")i.forEach(c,void 0);else if(u(i)||typeof i=="string")Array.prototype.forEach.call(i,c,void 0);else for(var h=nd(i),p=ed(i),b=p.length,R=0;R<b;R++)c.call(void 0,p[R],h&&h[R],i)}var fl=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function rd(i,c){if(i){i=i.split("&");for(var h=0;h<i.length;h++){var p=i[h].indexOf("="),b=null;if(0<=p){var R=i[h].substring(0,p);b=i[h].substring(p+1)}else R=i[h];c(R,b?decodeURIComponent(b.replace(/\+/g," ")):"")}}}function wn(i){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,i instanceof wn){this.h=i.h,As(this,i.j),this.o=i.o,this.g=i.g,bs(this,i.s),this.l=i.l;var c=i.i,h=new Dr;h.i=c.i,c.g&&(h.g=new Map(c.g),h.h=c.h),dl(this,h),this.m=i.m}else i&&(c=String(i).match(fl))?(this.h=!1,As(this,c[1]||"",!0),this.o=Pr(c[2]||""),this.g=Pr(c[3]||"",!0),bs(this,c[4]),this.l=Pr(c[5]||"",!0),dl(this,c[6]||"",!0),this.m=Pr(c[7]||"")):(this.h=!1,this.i=new Dr(null,this.h))}wn.prototype.toString=function(){var i=[],c=this.j;c&&i.push(Vr(c,pl,!0),":");var h=this.g;return(h||c=="file")&&(i.push("//"),(c=this.o)&&i.push(Vr(c,pl,!0),"@"),i.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&i.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&i.push("/"),i.push(Vr(h,h.charAt(0)=="/"?od:id,!0))),(h=this.i.toString())&&i.push("?",h),(h=this.m)&&i.push("#",Vr(h,ld)),i.join("")};function Be(i){return new wn(i)}function As(i,c,h){i.j=h?Pr(c,!0):c,i.j&&(i.j=i.j.replace(/:$/,""))}function bs(i,c){if(c){if(c=Number(c),isNaN(c)||0>c)throw Error("Bad port number "+c);i.s=c}else i.s=null}function dl(i,c,h){c instanceof Dr?(i.i=c,cd(i.i,i.h)):(h||(c=Vr(c,ad)),i.i=new Dr(c,i.h))}function wt(i,c,h){i.i.set(c,h)}function Ss(i){return wt(i,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),i}function Pr(i,c){return i?c?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function Vr(i,c,h){return typeof i=="string"?(i=encodeURI(i).replace(c,sd),h&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function sd(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var pl=/[#\/\?@]/g,id=/[#\?:]/g,od=/[#\?]/g,ad=/[#\?@]/g,ld=/#/g;function Dr(i,c){this.h=this.g=null,this.i=i||null,this.j=!!c}function Ye(i){i.g||(i.g=new Map,i.h=0,i.i&&rd(i.i,function(c,h){i.add(decodeURIComponent(c.replace(/\+/g," ")),h)}))}e=Dr.prototype,e.add=function(i,c){Ye(this),this.i=null,i=Bn(this,i);var h=this.g.get(i);return h||this.g.set(i,h=[]),h.push(c),this.h+=1,this};function gl(i,c){Ye(i),c=Bn(i,c),i.g.has(c)&&(i.i=null,i.h-=i.g.get(c).length,i.g.delete(c))}function ml(i,c){return Ye(i),c=Bn(i,c),i.g.has(c)}e.forEach=function(i,c){Ye(this),this.g.forEach(function(h,p){h.forEach(function(b){i.call(c,b,p,this)},this)},this)},e.na=function(){Ye(this);const i=Array.from(this.g.values()),c=Array.from(this.g.keys()),h=[];for(let p=0;p<c.length;p++){const b=i[p];for(let R=0;R<b.length;R++)h.push(c[p])}return h},e.V=function(i){Ye(this);let c=[];if(typeof i=="string")ml(this,i)&&(c=c.concat(this.g.get(Bn(this,i))));else{i=Array.from(this.g.values());for(let h=0;h<i.length;h++)c=c.concat(i[h])}return c},e.set=function(i,c){return Ye(this),this.i=null,i=Bn(this,i),ml(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[c]),this.h+=1,this},e.get=function(i,c){return i?(i=this.V(i),0<i.length?String(i[0]):c):c};function _l(i,c,h){gl(i,c),0<h.length&&(i.i=null,i.g.set(Bn(i,c),L(h)),i.h+=h.length)}e.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],c=Array.from(this.g.keys());for(var h=0;h<c.length;h++){var p=c[h];const R=encodeURIComponent(String(p)),B=this.V(p);for(p=0;p<B.length;p++){var b=R;B[p]!==""&&(b+="="+encodeURIComponent(String(B[p]))),i.push(b)}}return this.i=i.join("&")};function Bn(i,c){return c=String(c),i.j&&(c=c.toLowerCase()),c}function cd(i,c){c&&!i.j&&(Ye(i),i.i=null,i.g.forEach(function(h,p){var b=p.toLowerCase();p!=b&&(gl(this,p),_l(this,b,h))},i)),i.j=c}function ud(i,c){const h=new Cr;if(l.Image){const p=new Image;p.onload=C(Je,h,"TestLoadImage: loaded",!0,c,p),p.onerror=C(Je,h,"TestLoadImage: error",!1,c,p),p.onabort=C(Je,h,"TestLoadImage: abort",!1,c,p),p.ontimeout=C(Je,h,"TestLoadImage: timeout",!1,c,p),l.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=i}else c(!1)}function hd(i,c){const h=new Cr,p=new AbortController,b=setTimeout(()=>{p.abort(),Je(h,"TestPingServer: timeout",!1,c)},1e4);fetch(i,{signal:p.signal}).then(R=>{clearTimeout(b),R.ok?Je(h,"TestPingServer: ok",!0,c):Je(h,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(b),Je(h,"TestPingServer: error",!1,c)})}function Je(i,c,h,p,b){try{b&&(b.onload=null,b.onerror=null,b.onabort=null,b.ontimeout=null),p(h)}catch{}}function fd(){this.g=new vs}function dd(i,c,h){const p=h||"";try{hl(i,function(b,R){let B=b;f(b)&&(B=jt(b)),c.push(p+R+"="+encodeURIComponent(B))})}catch(b){throw c.push(p+"type="+encodeURIComponent("_badmap")),b}}function Cs(i){this.l=i.Ub||null,this.j=i.eb||!1}x(Cs,Hi),Cs.prototype.g=function(){return new Rs(this.l,this.j)},Cs.prototype.i=function(i){return function(){return i}}({});function Rs(i,c){Z.call(this),this.D=i,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}x(Rs,Z),e=Rs.prototype,e.open=function(i,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=i,this.A=c,this.readyState=1,Nr(this)},e.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const c={headers:this.u,method:this.B,credentials:this.m,cache:void 0};i&&(c.body=i),(this.D||l).fetch(new Request(this.A,c)).then(this.Sa.bind(this),this.ga.bind(this))},e.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,xr(this)),this.readyState=0},e.Sa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,Nr(this)),this.g&&(this.readyState=3,Nr(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;yl(this)}else i.text().then(this.Ra.bind(this),this.ga.bind(this))};function yl(i){i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i))}e.Pa=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var c=i.value?i.value:new Uint8Array(0);(c=this.v.decode(c,{stream:!i.done}))&&(this.response=this.responseText+=c)}i.done?xr(this):Nr(this),this.readyState==3&&yl(this)}},e.Ra=function(i){this.g&&(this.response=this.responseText=i,xr(this))},e.Qa=function(i){this.g&&(this.response=i,xr(this))},e.ga=function(){this.g&&xr(this)};function xr(i){i.readyState=4,i.l=null,i.j=null,i.v=null,Nr(i)}e.setRequestHeader=function(i,c){this.u.append(i,c)},e.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},e.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],c=this.h.entries();for(var h=c.next();!h.done;)h=h.value,i.push(h[0]+": "+h[1]),h=c.next();return i.join(`\r
`)};function Nr(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(Rs.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function vl(i){let c="";return X(i,function(h,p){c+=p,c+=":",c+=h,c+=`\r
`}),c}function to(i,c,h){t:{for(p in h){var p=!1;break t}p=!0}p||(h=vl(h),typeof i=="string"?h!=null&&encodeURIComponent(String(h)):wt(i,c,h))}function Rt(i){Z.call(this),this.headers=new Map,this.o=i||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}x(Rt,Z);var pd=/^https?$/i,gd=["POST","PUT"];e=Rt.prototype,e.Ha=function(i){this.J=i},e.ea=function(i,c,h,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);c=c?c.toUpperCase():"GET",this.D=i,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Gi.g(),this.v=this.o?Wa(this.o):Wa(Gi),this.g.onreadystatechange=A(this.Ea,this);try{this.B=!0,this.g.open(c,String(i),!0),this.B=!1}catch(R){El(this,R);return}if(i=h||"",h=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var b in p)h.set(b,p[b]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const R of p.keys())h.set(R,p.get(R));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(h.keys()).find(R=>R.toLowerCase()=="content-type"),b=l.FormData&&i instanceof l.FormData,!(0<=Array.prototype.indexOf.call(gd,c,void 0))||p||b||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,B]of h)this.g.setRequestHeader(R,B);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{wl(this),this.u=!0,this.g.send(i),this.u=!1}catch(R){El(this,R)}};function El(i,c){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=c,i.m=5,Tl(i),Ps(i)}function Tl(i){i.A||(i.A=!0,ot(i,"complete"),ot(i,"error"))}e.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=i||7,ot(this,"complete"),ot(this,"abort"),Ps(this))},e.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ps(this,!0)),Rt.aa.N.call(this)},e.Ea=function(){this.s||(this.B||this.u||this.j?Il(this):this.bb())},e.bb=function(){Il(this)};function Il(i){if(i.h&&typeof a<"u"&&(!i.v[1]||$e(i)!=4||i.Z()!=2)){if(i.u&&$e(i)==4)Gt(i.Ea,0,i);else if(ot(i,"readystatechange"),$e(i)==4){i.h=!1;try{const B=i.Z();t:switch(B){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break t;default:c=!1}var h;if(!(h=c)){var p;if(p=B===0){var b=String(i.D).match(fl)[1]||null;!b&&l.self&&l.self.location&&(b=l.self.location.protocol.slice(0,-1)),p=!pd.test(b?b.toLowerCase():"")}h=p}if(h)ot(i,"complete"),ot(i,"success");else{i.m=6;try{var R=2<$e(i)?i.g.statusText:""}catch{R=""}i.l=R+" ["+i.Z()+"]",Tl(i)}}finally{Ps(i)}}}}function Ps(i,c){if(i.g){wl(i);const h=i.g,p=i.v[0]?()=>{}:null;i.g=null,i.v=null,c||ot(i,"ready");try{h.onreadystatechange=p}catch{}}}function wl(i){i.I&&(l.clearTimeout(i.I),i.I=null)}e.isActive=function(){return!!this.g};function $e(i){return i.g?i.g.readyState:0}e.Z=function(){try{return 2<$e(this)?this.g.status:-1}catch{return-1}},e.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},e.Oa=function(i){if(this.g){var c=this.g.responseText;return i&&c.indexOf(i)==0&&(c=c.substring(i.length)),ve(c)}};function Al(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.H){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function md(i){const c={};i=(i.g&&2<=$e(i)&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<i.length;p++){if(z(i[p]))continue;var h=w(i[p]);const b=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const R=c[b]||[];c[b]=R,R.push(h)}E(c,function(p){return p.join(", ")})}e.Ba=function(){return this.m},e.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Or(i,c,h){return h&&h.internalChannelParams&&h.internalChannelParams[i]||c}function bl(i){this.Aa=0,this.i=[],this.j=new Cr,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Or("failFast",!1,i),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Or("baseRetryDelayMs",5e3,i),this.cb=Or("retryDelaySeedMs",1e4,i),this.Wa=Or("forwardChannelMaxRetries",2,i),this.wa=Or("forwardChannelRequestTimeoutMs",2e4,i),this.pa=i&&i.xmlHttpFactory||void 0,this.Xa=i&&i.Tb||void 0,this.Ca=i&&i.useFetchStreams||!1,this.L=void 0,this.J=i&&i.supportsCrossDomainXhr||!1,this.K="",this.h=new ol(i&&i.concurrentRequestLimit),this.Da=new fd,this.P=i&&i.fastHandshake||!1,this.O=i&&i.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=i&&i.Rb||!1,i&&i.xa&&this.j.xa(),i&&i.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&i&&i.detectBufferingProxy||!1,this.ja=void 0,i&&i.longPollingTimeout&&0<i.longPollingTimeout&&(this.ja=i.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}e=bl.prototype,e.la=8,e.G=1,e.connect=function(i,c,h,p){ie(0),this.W=i,this.H=c||{},h&&p!==void 0&&(this.H.OSID=h,this.H.OAID=p),this.F=this.X,this.I=Ol(this,null,this.W),Ds(this)};function eo(i){if(Sl(i),i.G==3){var c=i.U++,h=Be(i.I);if(wt(h,"SID",i.K),wt(h,"RID",c),wt(h,"TYPE","terminate"),Mr(i,h),c=new Xe(i,i.j,c),c.L=2,c.v=Ss(Be(h)),h=!1,l.navigator&&l.navigator.sendBeacon)try{h=l.navigator.sendBeacon(c.v.toString(),"")}catch{}!h&&l.Image&&(new Image().src=c.v,h=!0),h||(c.g=Ml(c.j,null),c.g.ea(c.v)),c.F=Date.now(),ws(c)}Nl(i)}function Vs(i){i.g&&(ro(i),i.g.cancel(),i.g=null)}function Sl(i){Vs(i),i.u&&(l.clearTimeout(i.u),i.u=null),xs(i),i.h.cancel(),i.s&&(typeof i.s=="number"&&l.clearTimeout(i.s),i.s=null)}function Ds(i){if(!al(i.h)&&!i.s){i.s=!0;var c=i.Ga;vt||yn(),gt||(vt(),gt=!0),we.add(c,i),i.B=0}}function _d(i,c){return ll(i.h)>=i.h.j-(i.s?1:0)?!1:i.s?(i.i=c.D.concat(i.i),!0):i.G==1||i.G==2||i.B>=(i.Va?0:i.Wa)?!1:(i.s=Sr(A(i.Ga,i,c),xl(i,i.B)),i.B++,!0)}e.Ga=function(i){if(this.s)if(this.s=null,this.G==1){if(!i){this.U=Math.floor(1e5*Math.random()),i=this.U++;const b=new Xe(this,this.j,i);let R=this.o;if(this.S&&(R?(R=g(R),I(R,this.S)):R=this.S),this.m!==null||this.O||(b.H=R,R=null),this.P)t:{for(var c=0,h=0;h<this.i.length;h++){e:{var p=this.i[h];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break e}p=void 0}if(p===void 0)break;if(c+=p,4096<c){c=h;break t}if(c===4096||h===this.i.length-1){c=h+1;break t}}c=1e3}else c=1e3;c=Rl(this,b,c),h=Be(this.I),wt(h,"RID",i),wt(h,"CVER",22),this.D&&wt(h,"X-HTTP-Session-Id",this.D),Mr(this,h),R&&(this.O?c="headers="+encodeURIComponent(String(vl(R)))+"&"+c:this.m&&to(h,this.m,R)),Zi(this.h,b),this.Ua&&wt(h,"TYPE","init"),this.P?(wt(h,"$req",c),wt(h,"SID","null"),b.T=!0,Qi(b,h,null)):Qi(b,h,c),this.G=2}}else this.G==3&&(i?Cl(this,i):this.i.length==0||al(this.h)||Cl(this))};function Cl(i,c){var h;c?h=c.l:h=i.U++;const p=Be(i.I);wt(p,"SID",i.K),wt(p,"RID",h),wt(p,"AID",i.T),Mr(i,p),i.m&&i.o&&to(p,i.m,i.o),h=new Xe(i,i.j,h,i.B+1),i.m===null&&(h.H=i.o),c&&(i.i=c.D.concat(i.i)),c=Rl(i,h,1e3),h.I=Math.round(.5*i.wa)+Math.round(.5*i.wa*Math.random()),Zi(i.h,h),Qi(h,p,c)}function Mr(i,c){i.H&&X(i.H,function(h,p){wt(c,p,h)}),i.l&&hl({},function(h,p){wt(c,p,h)})}function Rl(i,c,h){h=Math.min(i.i.length,h);var p=i.l?A(i.l.Na,i.l,i):null;t:{var b=i.i;let R=-1;for(;;){const B=["count="+h];R==-1?0<h?(R=b[0].g,B.push("ofs="+R)):R=0:B.push("ofs="+R);let Et=!0;for(let qt=0;qt<h;qt++){let mt=b[qt].g;const Qt=b[qt].map;if(mt-=R,0>mt)R=Math.max(0,b[qt].g-100),Et=!1;else try{dd(Qt,B,"req"+mt+"_")}catch{p&&p(Qt)}}if(Et){p=B.join("&");break t}}}return i=i.i.splice(0,h),c.D=i,p}function Pl(i){if(!i.g&&!i.u){i.Y=1;var c=i.Fa;vt||yn(),gt||(vt(),gt=!0),we.add(c,i),i.v=0}}function no(i){return i.g||i.u||3<=i.v?!1:(i.Y++,i.u=Sr(A(i.Fa,i),xl(i,i.v)),i.v++,!0)}e.Fa=function(){if(this.u=null,Vl(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var i=2*this.R;this.j.info("BP detection timer enabled: "+i),this.A=Sr(A(this.ab,this),i)}},e.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,ie(10),Vs(this),Vl(this))};function ro(i){i.A!=null&&(l.clearTimeout(i.A),i.A=null)}function Vl(i){i.g=new Xe(i,i.j,"rpc",i.Y),i.m===null&&(i.g.H=i.o),i.g.O=0;var c=Be(i.qa);wt(c,"RID","rpc"),wt(c,"SID",i.K),wt(c,"AID",i.T),wt(c,"CI",i.F?"0":"1"),!i.F&&i.ja&&wt(c,"TO",i.ja),wt(c,"TYPE","xmlhttp"),Mr(i,c),i.m&&i.o&&to(c,i.m,i.o),i.L&&(i.g.I=i.L);var h=i.g;i=i.ia,h.L=1,h.v=Ss(Be(c)),h.m=null,h.P=!0,rl(h,i)}e.Za=function(){this.C!=null&&(this.C=null,Vs(this),no(this),ie(19))};function xs(i){i.C!=null&&(l.clearTimeout(i.C),i.C=null)}function Dl(i,c){var h=null;if(i.g==c){xs(i),ro(i),i.g=null;var p=2}else if(Ji(i.h,c))h=c.D,cl(i.h,c),p=1;else return;if(i.G!=0){if(c.o)if(p==1){h=c.m?c.m.length:0,c=Date.now()-c.F;var b=i.B;p=Es(),ot(p,new Za(p,h)),Ds(i)}else Pl(i);else if(b=c.s,b==3||b==0&&0<c.X||!(p==1&&_d(i,c)||p==2&&no(i)))switch(h&&0<h.length&&(c=i.h,c.i=c.i.concat(h)),b){case 1:An(i,5);break;case 4:An(i,10);break;case 3:An(i,6);break;default:An(i,2)}}}function xl(i,c){let h=i.Ta+Math.floor(Math.random()*i.cb);return i.isActive()||(h*=2),h*c}function An(i,c){if(i.j.info("Error code "+c),c==2){var h=A(i.fb,i),p=i.Xa;const b=!p;p=new wn(p||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||As(p,"https"),Ss(p),b?ud(p.toString(),h):hd(p.toString(),h)}else ie(2);i.G=0,i.l&&i.l.sa(c),Nl(i),Sl(i)}e.fb=function(i){i?(this.j.info("Successfully pinged google.com"),ie(2)):(this.j.info("Failed to ping google.com"),ie(1))};function Nl(i){if(i.G=0,i.ka=[],i.l){const c=ul(i.h);(c.length!=0||i.i.length!=0)&&($(i.ka,c),$(i.ka,i.i),i.h.i.length=0,L(i.i),i.i.length=0),i.l.ra()}}function Ol(i,c,h){var p=h instanceof wn?Be(h):new wn(h);if(p.g!="")c&&(p.g=c+"."+p.g),bs(p,p.s);else{var b=l.location;p=b.protocol,c=c?c+"."+b.hostname:b.hostname,b=+b.port;var R=new wn(null);p&&As(R,p),c&&(R.g=c),b&&bs(R,b),h&&(R.l=h),p=R}return h=i.D,c=i.ya,h&&c&&wt(p,h,c),wt(p,"VER",i.la),Mr(i,p),p}function Ml(i,c,h){if(c&&!i.J)throw Error("Can't create secondary domain capable XhrIo object.");return c=i.Ca&&!i.pa?new Rt(new Cs({eb:h})):new Rt(i.pa),c.Ha(i.J),c}e.isActive=function(){return!!this.l&&this.l.isActive(this)};function kl(){}e=kl.prototype,e.ua=function(){},e.ta=function(){},e.sa=function(){},e.ra=function(){},e.isActive=function(){return!0},e.Na=function(){};function Ns(){}Ns.prototype.g=function(i,c){return new de(i,c)};function de(i,c){Z.call(this),this.g=new bl(c),this.l=i,this.h=c&&c.messageUrlParams||null,i=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(i?i["X-WebChannel-Content-Type"]=c.messageContentType:i={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.va&&(i?i["X-WebChannel-Client-Profile"]=c.va:i={"X-WebChannel-Client-Profile":c.va}),this.g.S=i,(i=c&&c.Sb)&&!z(i)&&(this.g.m=i),this.v=c&&c.supportsCrossDomainXhr||!1,this.u=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!z(c)&&(this.g.D=c,i=this.h,i!==null&&c in i&&(i=this.h,c in i&&delete i[c])),this.j=new $n(this)}x(de,Z),de.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},de.prototype.close=function(){eo(this.g)},de.prototype.o=function(i){var c=this.g;if(typeof i=="string"){var h={};h.__data__=i,i=h}else this.u&&(h={},h.__data__=jt(i),i=h);c.i.push(new td(c.Ya++,i)),c.G==3&&Ds(c)},de.prototype.N=function(){this.g.l=null,delete this.j,eo(this.g),delete this.g,de.aa.N.call(this)};function Ll(i){zi.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var c=i.__sm__;if(c){t:{for(const h in c){i=h;break t}i=void 0}(this.i=i)&&(i=this.i,c=c!==null&&i in c?c[i]:void 0),this.data=c}else this.data=i}x(Ll,zi);function Fl(){Ki.call(this),this.status=1}x(Fl,Ki);function $n(i){this.g=i}x($n,kl),$n.prototype.ua=function(){ot(this.g,"a")},$n.prototype.ta=function(i){ot(this.g,new Ll(i))},$n.prototype.sa=function(i){ot(this.g,new Fl)},$n.prototype.ra=function(){ot(this.g,"b")},Ns.prototype.createWebChannel=Ns.prototype.g,de.prototype.send=de.prototype.o,de.prototype.open=de.prototype.m,de.prototype.close=de.prototype.close,Hh=function(){return new Ns},qh=function(){return Es()},jh=Tn,jo={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Ts.NO_ERROR=0,Ts.TIMEOUT=8,Ts.HTTP_ERROR=6,Ws=Ts,tl.COMPLETE="complete",$h=tl,Qa.EventType=Ar,Ar.OPEN="a",Ar.CLOSE="b",Ar.ERROR="c",Ar.MESSAGE="d",Z.prototype.listen=Z.prototype.K,Ur=Qa,Rt.prototype.listenOnce=Rt.prototype.L,Rt.prototype.getLastError=Rt.prototype.Ka,Rt.prototype.getLastErrorCode=Rt.prototype.Ba,Rt.prototype.getStatus=Rt.prototype.Z,Rt.prototype.getResponseJson=Rt.prototype.Oa,Rt.prototype.getResponseText=Rt.prototype.oa,Rt.prototype.send=Rt.prototype.ea,Rt.prototype.setWithCredentials=Rt.prototype.Ha,Bh=Rt}).apply(typeof Us<"u"?Us:typeof self<"u"?self:typeof window<"u"?window:{});const Sc="@firebase/firestore",Cc="4.7.10";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}Jt.UNAUTHENTICATED=new Jt(null),Jt.GOOGLE_CREDENTIALS=new Jt("google-credentials-uid"),Jt.FIRST_PARTY=new Jt("first-party-uid"),Jt.MOCK_USER=new Jt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let _r="11.5.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kn=new Nh("@firebase/firestore");function zn(){return kn.logLevel}function K(e,...t){if(kn.logLevel<=ft.DEBUG){const n=t.map(Ca);kn.debug(`Firestore (${_r}): ${e}`,...n)}}function Ke(e,...t){if(kn.logLevel<=ft.ERROR){const n=t.map(Ca);kn.error(`Firestore (${_r}): ${e}`,...n)}}function lr(e,...t){if(kn.logLevel<=ft.WARN){const n=t.map(Ca);kn.warn(`Firestore (${_r}): ${e}`,...n)}}function Ca(e){if(typeof e=="string")return e;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(e)}catch{return e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lt(e="Unexpected state"){const t=`FIRESTORE (${_r}) INTERNAL ASSERTION FAILED: `+e;throw Ke(t),new Error(t)}function St(e,t){e||lt()}function dt(e,t){return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const j={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class tt extends mr{constructor(t,n){super(t,n),this.code=t,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(){this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zh{constructor(t,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class W_{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,n){t.enqueueRetryable(()=>n(Jt.UNAUTHENTICATED))}shutdown(){}}class Q_{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,n){this.changeListener=n,t.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class X_{constructor(t){this.t=t,this.currentUser=Jt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,n){St(this.o===void 0);let r=this.i;const s=u=>this.i!==r?(r=this.i,n(u)):Promise.resolve();let o=new xn;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new xn,t.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const u=o;t.enqueueRetryable(async()=>{await u.promise,await s(this.currentUser)})},l=u=>{K("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(u=>l(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):(K("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new xn)}},0),a()}getToken(){const t=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==t?(K("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(St(typeof r.accessToken=="string"),new zh(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return St(t===null||typeof t=="string"),new Jt(t)}}class Y_{constructor(t,n,r){this.l=t,this.h=n,this.P=r,this.type="FirstParty",this.user=Jt.FIRST_PARTY,this.T=new Map}I(){return this.P?this.P():null}get headers(){this.T.set("X-Goog-AuthUser",this.l);const t=this.I();return t&&this.T.set("Authorization",t),this.h&&this.T.set("X-Goog-Iam-Authorization-Token",this.h),this.T}}class J_{constructor(t,n,r){this.l=t,this.h=n,this.P=r}getToken(){return Promise.resolve(new Y_(this.l,this.h,this.P))}start(t,n){t.enqueueRetryable(()=>n(Jt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Rc{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Z_{constructor(t,n){this.A=n,this.forceRefresh=!1,this.appCheck=null,this.R=null,this.V=null,D_(t)&&t.settings.appCheckToken&&(this.V=t.settings.appCheckToken)}start(t,n){St(this.o===void 0);const r=o=>{o.error!=null&&K("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.R;return this.R=o.token,K("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?n(o.token):Promise.resolve()};this.o=o=>{t.enqueueRetryable(()=>r(o))};const s=o=>{K("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(o=>s(o)),setTimeout(()=>{if(!this.appCheck){const o=this.A.getImmediate({optional:!0});o?s(o):K("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.V)return Promise.resolve(new Rc(this.V));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(n=>n?(St(typeof n.token=="string"),this.R=n.token,new Rc(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ty(e){const t=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(e);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(n);else for(let r=0;r<e;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kh(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ey{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=ty(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<n&&(r+=t.charAt(s[o]%62))}return r}}function ct(e,t){return e<t?-1:e>t?1:0}function qo(e,t){let n=0;for(;n<e.length&&n<t.length;){const r=e.codePointAt(n),s=t.codePointAt(n);if(r!==s){if(r<128&&s<128)return ct(r,s);{const o=Kh(),a=ny(o.encode(Pc(e,n)),o.encode(Pc(t,n)));return a!==0?a:ct(r,s)}}n+=r>65535?2:1}return ct(e.length,t.length)}function Pc(e,t){return e.codePointAt(t)>65535?e.substring(t,t+2):e.substring(t,t+1)}function ny(e,t){for(let n=0;n<e.length&&n<t.length;++n)if(e[n]!==t[n])return ct(e[n],t[n]);return ct(e.length,t.length)}function cr(e,t,n){return e.length===t.length&&e.every((r,s)=>n(r,t[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vc=-62135596800,Dc=1e6;class he{static now(){return he.fromMillis(Date.now())}static fromDate(t){return he.fromMillis(t.getTime())}static fromMillis(t){const n=Math.floor(t/1e3),r=Math.floor((t-1e3*n)*Dc);return new he(n,r)}constructor(t,n){if(this.seconds=t,this.nanoseconds=n,n<0)throw new tt(j.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new tt(j.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(t<Vc)throw new tt(j.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new tt(j.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Dc}_compareTo(t){return this.seconds===t.seconds?ct(this.nanoseconds,t.nanoseconds):ct(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const t=this.seconds-Vc;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st{static fromTimestamp(t){return new st(t)}static min(){return new st(new he(0,0))}static max(){return new st(new he(253402300799,999999999))}constructor(t){this.timestamp=t}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xc="__name__";class Ve{constructor(t,n,r){n===void 0?n=0:n>t.length&&lt(),r===void 0?r=t.length-n:r>t.length-n&&lt(),this.segments=t,this.offset=n,this.len=r}get length(){return this.len}isEqual(t){return Ve.comparator(this,t)===0}child(t){const n=this.segments.slice(this.offset,this.limit());return t instanceof Ve?t.forEach(r=>{n.push(r)}):n.push(t),this.construct(n)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==t.get(n))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==t.get(n))return!1;return!0}forEach(t){for(let n=this.offset,r=this.limit();n<r;n++)t(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,n){const r=Math.min(t.length,n.length);for(let s=0;s<r;s++){const o=Ve.compareSegments(t.get(s),n.get(s));if(o!==0)return o}return ct(t.length,n.length)}static compareSegments(t,n){const r=Ve.isNumericId(t),s=Ve.isNumericId(n);return r&&!s?-1:!r&&s?1:r&&s?Ve.extractNumericId(t).compare(Ve.extractNumericId(n)):qo(t,n)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return ln.fromString(t.substring(4,t.length-2))}}class Pt extends Ve{construct(t,n,r){return new Pt(t,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const n=[];for(const r of t){if(r.indexOf("//")>=0)throw new tt(j.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(s=>s.length>0))}return new Pt(n)}static emptyPath(){return new Pt([])}}const ry=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ce extends Ve{construct(t,n,r){return new ce(t,n,r)}static isValidIdentifier(t){return ry.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ce.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===xc}static keyField(){return new ce([xc])}static fromServerFormat(t){const n=[];let r="",s=0;const o=()=>{if(r.length===0)throw new tt(j.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let a=!1;for(;s<t.length;){const l=t[s];if(l==="\\"){if(s+1===t.length)throw new tt(j.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const u=t[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new tt(j.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);r+=u,s+=2}else l==="`"?(a=!a,s++):l!=="."||a?(r+=l,s++):(o(),s++)}if(o(),a)throw new tt(j.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new ce(n)}static emptyPath(){return new ce([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(t){this.path=t}static fromPath(t){return new nt(Pt.fromString(t))}static fromName(t){return new nt(Pt.fromString(t).popFirst(5))}static empty(){return new nt(Pt.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&Pt.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,n){return Pt.comparator(t.path,n.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new nt(new Pt(t.slice()))}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ls=-1;function sy(e,t){const n=e.toTimestamp().seconds,r=e.toTimestamp().nanoseconds+1,s=st.fromTimestamp(r===1e9?new he(n+1,0):new he(n,r));return new cn(s,nt.empty(),t)}function iy(e){return new cn(e.readTime,e.key,ls)}class cn{constructor(t,n,r){this.readTime=t,this.documentKey=n,this.largestBatchId=r}static min(){return new cn(st.min(),nt.empty(),ls)}static max(){return new cn(st.max(),nt.empty(),ls)}}function oy(e,t){let n=e.readTime.compareTo(t.readTime);return n!==0?n:(n=nt.comparator(e.documentKey,t.documentKey),n!==0?n:ct(e.largestBatchId,t.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ay="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class ly{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Di(e){if(e.code!==j.FAILED_PRECONDITION||e.message!==ay)throw e;K("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(t){return this.next(void 0,t)}next(t,n){return this.callbackAttached&&lt(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(t,this.result):new V((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(t,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(n,o).next(r,s)}})}toPromise(){return new Promise((t,n)=>{this.next(t,n)})}wrapUserFunction(t){try{const n=t();return n instanceof V?n:V.resolve(n)}catch(n){return V.reject(n)}}wrapSuccess(t,n){return t?this.wrapUserFunction(()=>t(n)):V.resolve(n)}wrapFailure(t,n){return t?this.wrapUserFunction(()=>t(n)):V.reject(n)}static resolve(t){return new V((n,r)=>{n(t)})}static reject(t){return new V((n,r)=>{r(t)})}static waitFor(t){return new V((n,r)=>{let s=0,o=0,a=!1;t.forEach(l=>{++s,l.next(()=>{++o,a&&o===s&&n()},u=>r(u))}),a=!0,o===s&&n()})}static or(t){let n=V.resolve(!1);for(const r of t)n=n.next(s=>s?V.resolve(s):r());return n}static forEach(t,n){const r=[];return t.forEach((s,o)=>{r.push(n.call(this,s,o))}),this.waitFor(r)}static mapArray(t,n){return new V((r,s)=>{const o=t.length,a=new Array(o);let l=0;for(let u=0;u<o;u++){const f=u;n(t[f]).next(d=>{a[f]=d,++l,l===o&&r(a)},d=>s(d))}})}static doWhile(t,n){return new V((r,s)=>{const o=()=>{t()===!0?n().next(()=>{o()},s):r()};o()})}}function cy(e){const t=e.match(/Android ([\d.]+)/i),n=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function yr(e){return e.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xi{constructor(t,n){this.previousValue=t,n&&(n.sequenceNumberHandler=r=>this.oe(r),this._e=r=>n.writeSequenceNumber(r))}oe(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this._e&&this._e(t),t}}xi.ae=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uy=-1;function Ni(e){return e==null}function Ho(e){return e===0&&1/e==-1/0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gh="";function hy(e){let t="";for(let n=0;n<e.length;n++)t.length>0&&(t=Nc(t)),t=fy(e.get(n),t);return Nc(t)}function fy(e,t){let n=t;const r=e.length;for(let s=0;s<r;s++){const o=e.charAt(s);switch(o){case"\0":n+="";break;case Gh:n+="";break;default:n+=o}}return n}function Nc(e){return e+Gh+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oc(e){let t=0;for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function ps(e,t){for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function dy(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt{constructor(t,n){this.comparator=t,this.root=n||Ht.EMPTY}insert(t,n){return new Dt(this.comparator,this.root.insert(t,n,this.comparator).copy(null,null,Ht.BLACK,null,null))}remove(t){return new Dt(this.comparator,this.root.remove(t,this.comparator).copy(null,null,Ht.BLACK,null,null))}get(t){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(t,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(t){let n=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(t,r.key);if(s===0)return n+r.left.size;s<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((n,r)=>(t(n,r),!1))}toString(){const t=[];return this.inorderTraversal((n,r)=>(t.push(`${n}:${r}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new Bs(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new Bs(this.root,t,this.comparator,!1)}getReverseIterator(){return new Bs(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new Bs(this.root,t,this.comparator,!0)}}class Bs{constructor(t,n,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!t.isEmpty();)if(o=n?r(t.key,n):1,n&&s&&(o*=-1),o<0)t=this.isReverse?t.left:t.right;else{if(o===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const n={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class Ht{constructor(t,n,r,s,o){this.key=t,this.value=n,this.color=r??Ht.RED,this.left=s??Ht.EMPTY,this.right=o??Ht.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,n,r,s,o){return new Ht(t??this.key,n??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,n,r){let s=this;const o=r(t,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(t,n,r),null):o===0?s.copy(null,n,null,null,null):s.copy(null,null,null,null,s.right.insert(t,n,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Ht.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,n){let r,s=this;if(n(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,n),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),n(t,s.key)===0){if(s.right.isEmpty())return Ht.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,n))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,Ht.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,Ht.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,n)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw lt();const t=this.left.check();if(t!==this.right.check())throw lt();return t+(this.isRed()?0:1)}}Ht.EMPTY=null,Ht.RED=!0,Ht.BLACK=!1;Ht.EMPTY=new class{constructor(){this.size=0}get key(){throw lt()}get value(){throw lt()}get color(){throw lt()}get left(){throw lt()}get right(){throw lt()}copy(t,n,r,s,o){return this}insert(t,n,r){return new Ht(t,n)}remove(t,n){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft{constructor(t){this.comparator=t,this.data=new Dt(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((n,r)=>(t(n),!1))}forEachInRange(t,n){const r=this.data.getIteratorFrom(t[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,t[1])>=0)return;n(s.key)}}forEachWhile(t,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!t(r.getNext().key))return}firstAfterOrEqual(t){const n=this.data.getIteratorFrom(t);return n.hasNext()?n.getNext().key:null}getIterator(){return new Mc(this.data.getIterator())}getIteratorFrom(t){return new Mc(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let n=this;return n.size<t.size&&(n=t,t=this),t.forEach(r=>{n=n.add(r)}),n}isEqual(t){if(!(t instanceof Ft)||this.size!==t.size)return!1;const n=this.data.getIterator(),r=t.data.getIterator();for(;n.hasNext();){const s=n.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(n=>{t.push(n)}),t}toString(){const t=[];return this.forEach(n=>t.push(n)),"SortedSet("+t.toString()+")"}copy(t){const n=new Ft(this.comparator);return n.data=t,n}}class Mc{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nn{constructor(t){this.fields=t,t.sort(ce.comparator)}static empty(){return new nn([])}unionWith(t){let n=new Ft(ce.comparator);for(const r of this.fields)n=n.add(r);for(const r of t)n=n.add(r);return new nn(n.toArray())}covers(t){for(const n of this.fields)if(n.isPrefixOf(t))return!0;return!1}isEqual(t){return cr(this.fields,t.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt{constructor(t){this.binaryString=t}static fromBase64String(t){const n=function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Wh("Invalid base64 string: "+o):o}}(t);return new Kt(n)}static fromUint8Array(t){const n=function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o}(t);return new Kt(n)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let s=0;s<n.length;s++)r[s]=n.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return ct(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}Kt.EMPTY_BYTE_STRING=new Kt("");const py=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function un(e){if(St(!!e),typeof e=="string"){let t=0;const n=py.exec(e);if(St(!!n),n[1]){let s=n[1];s=(s+"000000000").substr(0,9),t=Number(s)}const r=new Date(e);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:Vt(e.seconds),nanos:Vt(e.nanos)}}function Vt(e){return typeof e=="number"?e:typeof e=="string"?Number(e):0}function hn(e){return typeof e=="string"?Kt.fromBase64String(e):Kt.fromUint8Array(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qh="server_timestamp",Xh="__type__",Yh="__previous_value__",Jh="__local_write_time__";function Ra(e){var t,n;return((n=(((t=e==null?void 0:e.mapValue)===null||t===void 0?void 0:t.fields)||{})[Xh])===null||n===void 0?void 0:n.stringValue)===Qh}function Oi(e){const t=e.mapValue.fields[Yh];return Ra(t)?Oi(t):t}function cs(e){const t=un(e.mapValue.fields[Jh].timestampValue);return new he(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gy{constructor(t,n,r,s,o,a,l,u,f){this.databaseId=t,this.appId=n,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=f}}const ui="(default)";class us{constructor(t,n){this.projectId=t,this.database=n||ui}static empty(){return new us("","")}get isDefaultDatabase(){return this.database===ui}isEqual(t){return t instanceof us&&t.projectId===this.projectId&&t.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const my="__type__",_y="__max__",$s={mapValue:{}},yy="__vector__",zo="value";function fn(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?Ra(e)?4:Ey(e)?9007199254740991:vy(e)?10:11:lt()}function ke(e,t){if(e===t)return!0;const n=fn(e);if(n!==fn(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return cs(e).isEqual(cs(t));case 3:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=un(s.timestampValue),l=un(o.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return function(s,o){return hn(s.bytesValue).isEqual(hn(o.bytesValue))}(e,t);case 7:return e.referenceValue===t.referenceValue;case 8:return function(s,o){return Vt(s.geoPointValue.latitude)===Vt(o.geoPointValue.latitude)&&Vt(s.geoPointValue.longitude)===Vt(o.geoPointValue.longitude)}(e,t);case 2:return function(s,o){if("integerValue"in s&&"integerValue"in o)return Vt(s.integerValue)===Vt(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=Vt(s.doubleValue),l=Vt(o.doubleValue);return a===l?Ho(a)===Ho(l):isNaN(a)&&isNaN(l)}return!1}(e,t);case 9:return cr(e.arrayValue.values||[],t.arrayValue.values||[],ke);case 10:case 11:return function(s,o){const a=s.mapValue.fields||{},l=o.mapValue.fields||{};if(Oc(a)!==Oc(l))return!1;for(const u in a)if(a.hasOwnProperty(u)&&(l[u]===void 0||!ke(a[u],l[u])))return!1;return!0}(e,t);default:return lt()}}function hs(e,t){return(e.values||[]).find(n=>ke(n,t))!==void 0}function ur(e,t){if(e===t)return 0;const n=fn(e),r=fn(t);if(n!==r)return ct(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return ct(e.booleanValue,t.booleanValue);case 2:return function(o,a){const l=Vt(o.integerValue||o.doubleValue),u=Vt(a.integerValue||a.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1}(e,t);case 3:return kc(e.timestampValue,t.timestampValue);case 4:return kc(cs(e),cs(t));case 5:return qo(e.stringValue,t.stringValue);case 6:return function(o,a){const l=hn(o),u=hn(a);return l.compareTo(u)}(e.bytesValue,t.bytesValue);case 7:return function(o,a){const l=o.split("/"),u=a.split("/");for(let f=0;f<l.length&&f<u.length;f++){const d=ct(l[f],u[f]);if(d!==0)return d}return ct(l.length,u.length)}(e.referenceValue,t.referenceValue);case 8:return function(o,a){const l=ct(Vt(o.latitude),Vt(a.latitude));return l!==0?l:ct(Vt(o.longitude),Vt(a.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return Lc(e.arrayValue,t.arrayValue);case 10:return function(o,a){var l,u,f,d;const m=o.fields||{},A=a.fields||{},C=(l=m[zo])===null||l===void 0?void 0:l.arrayValue,x=(u=A[zo])===null||u===void 0?void 0:u.arrayValue,L=ct(((f=C==null?void 0:C.values)===null||f===void 0?void 0:f.length)||0,((d=x==null?void 0:x.values)===null||d===void 0?void 0:d.length)||0);return L!==0?L:Lc(C,x)}(e.mapValue,t.mapValue);case 11:return function(o,a){if(o===$s.mapValue&&a===$s.mapValue)return 0;if(o===$s.mapValue)return 1;if(a===$s.mapValue)return-1;const l=o.fields||{},u=Object.keys(l),f=a.fields||{},d=Object.keys(f);u.sort(),d.sort();for(let m=0;m<u.length&&m<d.length;++m){const A=qo(u[m],d[m]);if(A!==0)return A;const C=ur(l[u[m]],f[d[m]]);if(C!==0)return C}return ct(u.length,d.length)}(e.mapValue,t.mapValue);default:throw lt()}}function kc(e,t){if(typeof e=="string"&&typeof t=="string"&&e.length===t.length)return ct(e,t);const n=un(e),r=un(t),s=ct(n.seconds,r.seconds);return s!==0?s:ct(n.nanos,r.nanos)}function Lc(e,t){const n=e.values||[],r=t.values||[];for(let s=0;s<n.length&&s<r.length;++s){const o=ur(n[s],r[s]);if(o)return o}return ct(n.length,r.length)}function hr(e){return Ko(e)}function Ko(e){return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(n){const r=un(n);return`time(${r.seconds},${r.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?function(n){return hn(n).toBase64()}(e.bytesValue):"referenceValue"in e?function(n){return nt.fromName(n).toString()}(e.referenceValue):"geoPointValue"in e?function(n){return`geo(${n.latitude},${n.longitude})`}(e.geoPointValue):"arrayValue"in e?function(n){let r="[",s=!0;for(const o of n.values||[])s?s=!1:r+=",",r+=Ko(o);return r+"]"}(e.arrayValue):"mapValue"in e?function(n){const r=Object.keys(n.fields||{}).sort();let s="{",o=!0;for(const a of r)o?o=!1:s+=",",s+=`${a}:${Ko(n.fields[a])}`;return s+"}"}(e.mapValue):lt()}function Qs(e){switch(fn(e)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=Oi(e);return t?16+Qs(t):16;case 5:return 2*e.stringValue.length;case 6:return hn(e.bytesValue).approximateByteSize();case 7:return e.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((s,o)=>s+Qs(o),0)}(e.arrayValue);case 10:case 11:return function(r){let s=0;return ps(r.fields,(o,a)=>{s+=o.length+Qs(a)}),s}(e.mapValue);default:throw lt()}}function Go(e){return!!e&&"integerValue"in e}function Pa(e){return!!e&&"arrayValue"in e}function Fc(e){return!!e&&"nullValue"in e}function Uc(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function To(e){return!!e&&"mapValue"in e}function vy(e){var t,n;return((n=(((t=e==null?void 0:e.mapValue)===null||t===void 0?void 0:t.fields)||{})[my])===null||n===void 0?void 0:n.stringValue)===yy}function Wr(e){if(e.geoPointValue)return{geoPointValue:Object.assign({},e.geoPointValue)};if(e.timestampValue&&typeof e.timestampValue=="object")return{timestampValue:Object.assign({},e.timestampValue)};if(e.mapValue){const t={mapValue:{fields:{}}};return ps(e.mapValue.fields,(n,r)=>t.mapValue.fields[n]=Wr(r)),t}if(e.arrayValue){const t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=Wr(e.arrayValue.values[n]);return t}return Object.assign({},e)}function Ey(e){return(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===_y}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(t){this.value=t}static empty(){return new xe({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let n=this.value;for(let r=0;r<t.length-1;++r)if(n=(n.mapValue.fields||{})[t.get(r)],!To(n))return null;return n=(n.mapValue.fields||{})[t.lastSegment()],n||null}}set(t,n){this.getFieldsMap(t.popLast())[t.lastSegment()]=Wr(n)}setAll(t){let n=ce.emptyPath(),r={},s=[];t.forEach((a,l)=>{if(!n.isImmediateParentOf(l)){const u=this.getFieldsMap(n);this.applyChanges(u,r,s),r={},s=[],n=l.popLast()}a?r[l.lastSegment()]=Wr(a):s.push(l.lastSegment())});const o=this.getFieldsMap(n);this.applyChanges(o,r,s)}delete(t){const n=this.field(t.popLast());To(n)&&n.mapValue.fields&&delete n.mapValue.fields[t.lastSegment()]}isEqual(t){return ke(this.value,t.value)}getFieldsMap(t){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<t.length;++r){let s=n.mapValue.fields[t.get(r)];To(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},n.mapValue.fields[t.get(r)]=s),n=s}return n.mapValue.fields}applyChanges(t,n,r){ps(n,(s,o)=>t[s]=o);for(const s of r)delete t[s]}clone(){return new xe(Wr(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(t,n,r,s,o,a,l){this.key=t,this.documentType=n,this.version=r,this.readTime=s,this.createTime=o,this.data=a,this.documentState=l}static newInvalidDocument(t){return new ee(t,0,st.min(),st.min(),st.min(),xe.empty(),0)}static newFoundDocument(t,n,r,s){return new ee(t,1,n,st.min(),r,s,0)}static newNoDocument(t,n){return new ee(t,2,n,st.min(),st.min(),xe.empty(),0)}static newUnknownDocument(t,n){return new ee(t,3,n,st.min(),st.min(),xe.empty(),2)}convertToFoundDocument(t,n){return!this.createTime.isEqual(st.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=xe.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=xe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=st.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof ee&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new ee(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi{constructor(t,n){this.position=t,this.inclusive=n}}function Bc(e,t,n){let r=0;for(let s=0;s<e.position.length;s++){const o=t[s],a=e.position[s];if(o.field.isKeyField()?r=nt.comparator(nt.fromName(a.referenceValue),n.key):r=ur(a,n.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function $c(e,t){if(e===null)return t===null;if(t===null||e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let n=0;n<e.position.length;n++)if(!ke(e.position[n],t.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fi{constructor(t,n="asc"){this.field=t,this.dir=n}}function Ty(e,t){return e.dir===t.dir&&e.field.isEqual(t.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zh{}class Lt extends Zh{constructor(t,n,r){super(),this.field=t,this.op=n,this.value=r}static create(t,n,r){return t.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(t,n,r):new wy(t,n,r):n==="array-contains"?new Sy(t,r):n==="in"?new Cy(t,r):n==="not-in"?new Ry(t,r):n==="array-contains-any"?new Py(t,r):new Lt(t,n,r)}static createKeyFieldInFilter(t,n,r){return n==="in"?new Ay(t,r):new by(t,r)}matches(t){const n=t.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(ur(n,this.value)):n!==null&&fn(this.value)===fn(n)&&this.matchesComparison(ur(n,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return lt()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Le extends Zh{constructor(t,n){super(),this.filters=t,this.op=n,this.ce=null}static create(t,n){return new Le(t,n)}matches(t){return tf(this)?this.filters.find(n=>!n.matches(t))===void 0:this.filters.find(n=>n.matches(t))!==void 0}getFlattenedFilters(){return this.ce!==null||(this.ce=this.filters.reduce((t,n)=>t.concat(n.getFlattenedFilters()),[])),this.ce}getFilters(){return Object.assign([],this.filters)}}function tf(e){return e.op==="and"}function ef(e){return Iy(e)&&tf(e)}function Iy(e){for(const t of e.filters)if(t instanceof Le)return!1;return!0}function Wo(e){if(e instanceof Lt)return e.field.canonicalString()+e.op.toString()+hr(e.value);if(ef(e))return e.filters.map(t=>Wo(t)).join(",");{const t=e.filters.map(n=>Wo(n)).join(",");return`${e.op}(${t})`}}function nf(e,t){return e instanceof Lt?function(r,s){return s instanceof Lt&&r.op===s.op&&r.field.isEqual(s.field)&&ke(r.value,s.value)}(e,t):e instanceof Le?function(r,s){return s instanceof Le&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((o,a,l)=>o&&nf(a,s.filters[l]),!0):!1}(e,t):void lt()}function rf(e){return e instanceof Lt?function(n){return`${n.field.canonicalString()} ${n.op} ${hr(n.value)}`}(e):e instanceof Le?function(n){return n.op.toString()+" {"+n.getFilters().map(rf).join(" ,")+"}"}(e):"Filter"}class wy extends Lt{constructor(t,n,r){super(t,n,r),this.key=nt.fromName(r.referenceValue)}matches(t){const n=nt.comparator(t.key,this.key);return this.matchesComparison(n)}}class Ay extends Lt{constructor(t,n){super(t,"in",n),this.keys=sf("in",n)}matches(t){return this.keys.some(n=>n.isEqual(t.key))}}class by extends Lt{constructor(t,n){super(t,"not-in",n),this.keys=sf("not-in",n)}matches(t){return!this.keys.some(n=>n.isEqual(t.key))}}function sf(e,t){var n;return(((n=t.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(r=>nt.fromName(r.referenceValue))}class Sy extends Lt{constructor(t,n){super(t,"array-contains",n)}matches(t){const n=t.data.field(this.field);return Pa(n)&&hs(n.arrayValue,this.value)}}class Cy extends Lt{constructor(t,n){super(t,"in",n)}matches(t){const n=t.data.field(this.field);return n!==null&&hs(this.value.arrayValue,n)}}class Ry extends Lt{constructor(t,n){super(t,"not-in",n)}matches(t){if(hs(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=t.data.field(this.field);return n!==null&&!hs(this.value.arrayValue,n)}}class Py extends Lt{constructor(t,n){super(t,"array-contains-any",n)}matches(t){const n=t.data.field(this.field);return!(!Pa(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>hs(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vy{constructor(t,n=null,r=[],s=[],o=null,a=null,l=null){this.path=t,this.collectionGroup=n,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=a,this.endAt=l,this.le=null}}function jc(e,t=null,n=[],r=[],s=null,o=null,a=null){return new Vy(e,t,n,r,s,o,a)}function Va(e){const t=dt(e);if(t.le===null){let n=t.path.canonicalString();t.collectionGroup!==null&&(n+="|cg:"+t.collectionGroup),n+="|f:",n+=t.filters.map(r=>Wo(r)).join(","),n+="|ob:",n+=t.orderBy.map(r=>function(o){return o.field.canonicalString()+o.dir}(r)).join(","),Ni(t.limit)||(n+="|l:",n+=t.limit),t.startAt&&(n+="|lb:",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map(r=>hr(r)).join(",")),t.endAt&&(n+="|ub:",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map(r=>hr(r)).join(",")),t.le=n}return t.le}function Da(e,t){if(e.limit!==t.limit||e.orderBy.length!==t.orderBy.length)return!1;for(let n=0;n<e.orderBy.length;n++)if(!Ty(e.orderBy[n],t.orderBy[n]))return!1;if(e.filters.length!==t.filters.length)return!1;for(let n=0;n<e.filters.length;n++)if(!nf(e.filters[n],t.filters[n]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!$c(e.startAt,t.startAt)&&$c(e.endAt,t.endAt)}function Qo(e){return nt.isDocumentKey(e.path)&&e.collectionGroup===null&&e.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mi{constructor(t,n=null,r=[],s=[],o=null,a="F",l=null,u=null){this.path=t,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=a,this.startAt=l,this.endAt=u,this.he=null,this.Pe=null,this.Te=null,this.startAt,this.endAt}}function Dy(e,t,n,r,s,o,a,l){return new Mi(e,t,n,r,s,o,a,l)}function of(e){return new Mi(e)}function qc(e){return e.filters.length===0&&e.limit===null&&e.startAt==null&&e.endAt==null&&(e.explicitOrderBy.length===0||e.explicitOrderBy.length===1&&e.explicitOrderBy[0].field.isKeyField())}function xy(e){return e.collectionGroup!==null}function Qr(e){const t=dt(e);if(t.he===null){t.he=[];const n=new Set;for(const o of t.explicitOrderBy)t.he.push(o),n.add(o.field.canonicalString());const r=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new Ft(ce.comparator);return a.filters.forEach(u=>{u.getFlattenedFilters().forEach(f=>{f.isInequality()&&(l=l.add(f.field))})}),l})(t).forEach(o=>{n.has(o.canonicalString())||o.isKeyField()||t.he.push(new fi(o,r))}),n.has(ce.keyField().canonicalString())||t.he.push(new fi(ce.keyField(),r))}return t.he}function Oe(e){const t=dt(e);return t.Pe||(t.Pe=Ny(t,Qr(e))),t.Pe}function Ny(e,t){if(e.limitType==="F")return jc(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(s=>{const o=s.dir==="desc"?"asc":"desc";return new fi(s.field,o)});const n=e.endAt?new hi(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new hi(e.startAt.position,e.startAt.inclusive):null;return jc(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}function Xo(e,t,n){return new Mi(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,n,e.startAt,e.endAt)}function ki(e,t){return Da(Oe(e),Oe(t))&&e.limitType===t.limitType}function af(e){return`${Va(Oe(e))}|lt:${e.limitType}`}function Kn(e){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(s=>rf(s)).join(", ")}]`),Ni(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(s=>hr(s)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(s=>hr(s)).join(",")),`Target(${r})`}(Oe(e))}; limitType=${e.limitType})`}function Li(e,t){return t.isFoundDocument()&&function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):nt.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)}(e,t)&&function(r,s){for(const o of Qr(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0}(e,t)&&function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0}(e,t)&&function(r,s){return!(r.startAt&&!function(a,l,u){const f=Bc(a,l,u);return a.inclusive?f<=0:f<0}(r.startAt,Qr(r),s)||r.endAt&&!function(a,l,u){const f=Bc(a,l,u);return a.inclusive?f>=0:f>0}(r.endAt,Qr(r),s))}(e,t)}function Oy(e){return e.collectionGroup||(e.path.length%2==1?e.path.lastSegment():e.path.get(e.path.length-2))}function lf(e){return(t,n)=>{let r=!1;for(const s of Qr(e)){const o=My(s,t,n);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function My(e,t,n){const r=e.field.isKeyField()?nt.comparator(t.key,n.key):function(o,a,l){const u=a.data.field(o),f=l.data.field(o);return u!==null&&f!==null?ur(u,f):lt()}(e.field,t,n);switch(e.dir){case"asc":return r;case"desc":return-1*r;default:return lt()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(t,n){this.mapKeyFn=t,this.equalsFn=n,this.inner={},this.innerSize=0}get(t){const n=this.mapKeyFn(t),r=this.inner[n];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,t))return o}}has(t){return this.get(t)!==void 0}set(t,n){const r=this.mapKeyFn(t),s=this.inner[r];if(s===void 0)return this.inner[r]=[[t,n]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],t))return void(s[o]=[t,n]);s.push([t,n]),this.innerSize++}delete(t){const n=this.mapKeyFn(t),r=this.inner[n];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],t))return r.length===1?delete this.inner[n]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(t){ps(this.inner,(n,r)=>{for(const[s,o]of r)t(s,o)})}isEmpty(){return dy(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ky=new Dt(nt.comparator);function dn(){return ky}const cf=new Dt(nt.comparator);function Br(...e){let t=cf;for(const n of e)t=t.insert(n.key,n);return t}function Ly(e){let t=cf;return e.forEach((n,r)=>t=t.insert(n,r.overlayedDocument)),t}function Vn(){return Xr()}function uf(){return Xr()}function Xr(){return new Fn(e=>e.toString(),(e,t)=>e.isEqual(t))}const Fy=new Ft(nt.comparator);function pt(...e){let t=Fy;for(const n of e)t=t.add(n);return t}const Uy=new Ft(ct);function By(){return Uy}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $y(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ho(t)?"-0":t}}function jy(e){return{integerValue:""+e}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fi{constructor(){this._=void 0}}function qy(e,t,n){return e instanceof Yo?function(s,o){const a={fields:{[Xh]:{stringValue:Qh},[Jh]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&Ra(o)&&(o=Oi(o)),o&&(a.fields[Yh]=o),{mapValue:a}}(n,t):e instanceof di?hf(e,t):e instanceof pi?ff(e,t):function(s,o){const a=zy(s,o),l=Hc(a)+Hc(s.Ie);return Go(a)&&Go(s.Ie)?jy(l):$y(s.serializer,l)}(e,t)}function Hy(e,t,n){return e instanceof di?hf(e,t):e instanceof pi?ff(e,t):n}function zy(e,t){return e instanceof Jo?function(r){return Go(r)||function(o){return!!o&&"doubleValue"in o}(r)}(t)?t:{integerValue:0}:null}class Yo extends Fi{}class di extends Fi{constructor(t){super(),this.elements=t}}function hf(e,t){const n=df(t);for(const r of e.elements)n.some(s=>ke(s,r))||n.push(r);return{arrayValue:{values:n}}}class pi extends Fi{constructor(t){super(),this.elements=t}}function ff(e,t){let n=df(t);for(const r of e.elements)n=n.filter(s=>!ke(s,r));return{arrayValue:{values:n}}}class Jo extends Fi{constructor(t,n){super(),this.serializer=t,this.Ie=n}}function Hc(e){return Vt(e.integerValue||e.doubleValue)}function df(e){return Pa(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}function Ky(e,t){return e.field.isEqual(t.field)&&function(r,s){return r instanceof di&&s instanceof di||r instanceof pi&&s instanceof pi?cr(r.elements,s.elements,ke):r instanceof Jo&&s instanceof Jo?ke(r.Ie,s.Ie):r instanceof Yo&&s instanceof Yo}(e.transform,t.transform)}class Nn{constructor(t,n){this.updateTime=t,this.exists=n}static none(){return new Nn}static exists(t){return new Nn(void 0,t)}static updateTime(t){return new Nn(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function Xs(e,t){return e.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(e.updateTime):e.exists===void 0||e.exists===t.isFoundDocument()}class xa{}function pf(e,t){if(!e.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return e.isNoDocument()?new Wy(e.key,Nn.none()):new Na(e.key,e.data,Nn.none());{const n=e.data,r=xe.empty();let s=new Ft(ce.comparator);for(let o of t.fields)if(!s.has(o)){let a=n.field(o);a===null&&o.length>1&&(o=o.popLast(),a=n.field(o)),a===null?r.delete(o):r.set(o,a),s=s.add(o)}return new Ui(e.key,r,new nn(s.toArray()),Nn.none())}}function Gy(e,t,n){e instanceof Na?function(s,o,a){const l=s.value.clone(),u=Kc(s.fieldTransforms,o,a.transformResults);l.setAll(u),o.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(e,t,n):e instanceof Ui?function(s,o,a){if(!Xs(s.precondition,o))return void o.convertToUnknownDocument(a.version);const l=Kc(s.fieldTransforms,o,a.transformResults),u=o.data;u.setAll(gf(s)),u.setAll(l),o.convertToFoundDocument(a.version,u).setHasCommittedMutations()}(e,t,n):function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()}(0,t,n)}function Yr(e,t,n,r){return e instanceof Na?function(o,a,l,u){if(!Xs(o.precondition,a))return l;const f=o.value.clone(),d=Gc(o.fieldTransforms,u,a);return f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),null}(e,t,n,r):e instanceof Ui?function(o,a,l,u){if(!Xs(o.precondition,a))return l;const f=Gc(o.fieldTransforms,u,a),d=a.data;return d.setAll(gf(o)),d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),l===null?null:l.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map(m=>m.field))}(e,t,n,r):function(o,a,l){return Xs(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l}(e,t,n)}function zc(e,t){return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&cr(r,s,(o,a)=>Ky(o,a))}(e.fieldTransforms,t.fieldTransforms)&&(e.type===0?e.value.isEqual(t.value):e.type!==1||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask))}class Na extends xa{constructor(t,n,r,s=[]){super(),this.key=t,this.value=n,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Ui extends xa{constructor(t,n,r,s,o=[]){super(),this.key=t,this.data=n,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function gf(e){const t=new Map;return e.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=e.data.field(n);t.set(n,r)}}),t}function Kc(e,t,n){const r=new Map;St(e.length===n.length);for(let s=0;s<n.length;s++){const o=e[s],a=o.transform,l=t.data.field(o.field);r.set(o.field,Hy(a,l,n[s]))}return r}function Gc(e,t,n){const r=new Map;for(const s of e){const o=s.transform,a=n.data.field(s.field);r.set(s.field,qy(o,a,t))}return r}class Wy extends xa{constructor(t,n){super(),this.key=t,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qy{constructor(t,n,r,s){this.batchId=t,this.localWriteTime=n,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(t,n){const r=n.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(t.key)&&Gy(o,t,r[s])}}applyToLocalView(t,n){for(const r of this.baseMutations)r.key.isEqual(t.key)&&(n=Yr(r,t,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(t.key)&&(n=Yr(r,t,n,this.localWriteTime));return n}applyToLocalDocumentSet(t,n){const r=uf();return this.mutations.forEach(s=>{const o=t.get(s.key),a=o.overlayedDocument;let l=this.applyToLocalView(a,o.mutatedFields);l=n.has(s.key)?null:l;const u=pf(a,l);u!==null&&r.set(s.key,u),a.isValidDocument()||a.convertToNoDocument(st.min())}),r}keys(){return this.mutations.reduce((t,n)=>t.add(n.key),pt())}isEqual(t){return this.batchId===t.batchId&&cr(this.mutations,t.mutations,(n,r)=>zc(n,r))&&cr(this.baseMutations,t.baseMutations,(n,r)=>zc(n,r))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xy{constructor(t,n){this.largestBatchId=t,this.mutation=n}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yy{constructor(t,n){this.count=t,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xt,ht;function mf(e){if(e===void 0)return Ke("GRPC error has no .code"),j.UNKNOWN;switch(e){case xt.OK:return j.OK;case xt.CANCELLED:return j.CANCELLED;case xt.UNKNOWN:return j.UNKNOWN;case xt.DEADLINE_EXCEEDED:return j.DEADLINE_EXCEEDED;case xt.RESOURCE_EXHAUSTED:return j.RESOURCE_EXHAUSTED;case xt.INTERNAL:return j.INTERNAL;case xt.UNAVAILABLE:return j.UNAVAILABLE;case xt.UNAUTHENTICATED:return j.UNAUTHENTICATED;case xt.INVALID_ARGUMENT:return j.INVALID_ARGUMENT;case xt.NOT_FOUND:return j.NOT_FOUND;case xt.ALREADY_EXISTS:return j.ALREADY_EXISTS;case xt.PERMISSION_DENIED:return j.PERMISSION_DENIED;case xt.FAILED_PRECONDITION:return j.FAILED_PRECONDITION;case xt.ABORTED:return j.ABORTED;case xt.OUT_OF_RANGE:return j.OUT_OF_RANGE;case xt.UNIMPLEMENTED:return j.UNIMPLEMENTED;case xt.DATA_LOSS:return j.DATA_LOSS;default:return lt()}}(ht=xt||(xt={}))[ht.OK=0]="OK",ht[ht.CANCELLED=1]="CANCELLED",ht[ht.UNKNOWN=2]="UNKNOWN",ht[ht.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ht[ht.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ht[ht.NOT_FOUND=5]="NOT_FOUND",ht[ht.ALREADY_EXISTS=6]="ALREADY_EXISTS",ht[ht.PERMISSION_DENIED=7]="PERMISSION_DENIED",ht[ht.UNAUTHENTICATED=16]="UNAUTHENTICATED",ht[ht.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ht[ht.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ht[ht.ABORTED=10]="ABORTED",ht[ht.OUT_OF_RANGE=11]="OUT_OF_RANGE",ht[ht.UNIMPLEMENTED=12]="UNIMPLEMENTED",ht[ht.INTERNAL=13]="INTERNAL",ht[ht.UNAVAILABLE=14]="UNAVAILABLE",ht[ht.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jy=new ln([4294967295,4294967295],0);function Wc(e){const t=Kh().encode(e),n=new Uh;return n.update(t),new Uint8Array(n.digest())}function Qc(e){const t=new DataView(e.buffer),n=t.getUint32(0,!0),r=t.getUint32(4,!0),s=t.getUint32(8,!0),o=t.getUint32(12,!0);return[new ln([n,r],0),new ln([s,o],0)]}class Oa{constructor(t,n,r){if(this.bitmap=t,this.padding=n,this.hashCount=r,n<0||n>=8)throw new $r(`Invalid padding: ${n}`);if(r<0)throw new $r(`Invalid hash count: ${r}`);if(t.length>0&&this.hashCount===0)throw new $r(`Invalid hash count: ${r}`);if(t.length===0&&n!==0)throw new $r(`Invalid padding when bitmap length is 0: ${n}`);this.Ee=8*t.length-n,this.de=ln.fromNumber(this.Ee)}Ae(t,n,r){let s=t.add(n.multiply(ln.fromNumber(r)));return s.compare(Jy)===1&&(s=new ln([s.getBits(0),s.getBits(1)],0)),s.modulo(this.de).toNumber()}Re(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(this.Ee===0)return!1;const n=Wc(t),[r,s]=Qc(n);for(let o=0;o<this.hashCount;o++){const a=this.Ae(r,s,o);if(!this.Re(a))return!1}return!0}static create(t,n,r){const s=t%8==0?0:8-t%8,o=new Uint8Array(Math.ceil(t/8)),a=new Oa(o,s,n);return r.forEach(l=>a.insert(l)),a}insert(t){if(this.Ee===0)return;const n=Wc(t),[r,s]=Qc(n);for(let o=0;o<this.hashCount;o++){const a=this.Ae(r,s,o);this.Ve(a)}}Ve(t){const n=Math.floor(t/8),r=t%8;this.bitmap[n]|=1<<r}}class $r extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bi{constructor(t,n,r,s,o){this.snapshotVersion=t,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(t,n,r){const s=new Map;return s.set(t,gs.createSynthesizedTargetChangeForCurrentChange(t,n,r)),new Bi(st.min(),s,new Dt(ct),dn(),pt())}}class gs{constructor(t,n,r,s,o){this.resumeToken=t,this.current=n,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(t,n,r){return new gs(r,n,pt(),pt(),pt())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ys{constructor(t,n,r,s){this.me=t,this.removedTargetIds=n,this.key=r,this.fe=s}}class _f{constructor(t,n){this.targetId=t,this.ge=n}}class yf{constructor(t,n,r=Kt.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=n,this.resumeToken=r,this.cause=s}}class Xc{constructor(){this.pe=0,this.ye=Yc(),this.we=Kt.EMPTY_BYTE_STRING,this.Se=!1,this.be=!0}get current(){return this.Se}get resumeToken(){return this.we}get De(){return this.pe!==0}get ve(){return this.be}Ce(t){t.approximateByteSize()>0&&(this.be=!0,this.we=t)}Fe(){let t=pt(),n=pt(),r=pt();return this.ye.forEach((s,o)=>{switch(o){case 0:t=t.add(s);break;case 2:n=n.add(s);break;case 1:r=r.add(s);break;default:lt()}}),new gs(this.we,this.Se,t,n,r)}Me(){this.be=!1,this.ye=Yc()}xe(t,n){this.be=!0,this.ye=this.ye.insert(t,n)}Oe(t){this.be=!0,this.ye=this.ye.remove(t)}Ne(){this.pe+=1}Be(){this.pe-=1,St(this.pe>=0)}Le(){this.be=!0,this.Se=!0}}class Zy{constructor(t){this.ke=t,this.qe=new Map,this.Qe=dn(),this.$e=js(),this.Ue=js(),this.Ke=new Dt(ct)}We(t){for(const n of t.me)t.fe&&t.fe.isFoundDocument()?this.Ge(n,t.fe):this.ze(n,t.key,t.fe);for(const n of t.removedTargetIds)this.ze(n,t.key,t.fe)}je(t){this.forEachTarget(t,n=>{const r=this.He(n);switch(t.state){case 0:this.Je(n)&&r.Ce(t.resumeToken);break;case 1:r.Be(),r.De||r.Me(),r.Ce(t.resumeToken);break;case 2:r.Be(),r.De||this.removeTarget(n);break;case 3:this.Je(n)&&(r.Le(),r.Ce(t.resumeToken));break;case 4:this.Je(n)&&(this.Ye(n),r.Ce(t.resumeToken));break;default:lt()}})}forEachTarget(t,n){t.targetIds.length>0?t.targetIds.forEach(n):this.qe.forEach((r,s)=>{this.Je(s)&&n(s)})}Ze(t){const n=t.targetId,r=t.ge.count,s=this.Xe(n);if(s){const o=s.target;if(Qo(o))if(r===0){const a=new nt(o.path);this.ze(n,a,ee.newNoDocument(a,st.min()))}else St(r===1);else{const a=this.et(n);if(a!==r){const l=this.tt(t),u=l?this.nt(l,t,a):1;if(u!==0){this.Ye(n);const f=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ke=this.Ke.insert(n,f)}}}}}tt(t){const n=t.ge.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:o=0}=n;let a,l;try{a=hn(r).toUint8Array()}catch(u){if(u instanceof Wh)return lr("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{l=new Oa(a,s,o)}catch(u){return lr(u instanceof $r?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return l.Ee===0?null:l}nt(t,n,r){return n.ge.count===r-this.st(t,n.targetId)?0:2}st(t,n){const r=this.ke.getRemoteKeysForTarget(n);let s=0;return r.forEach(o=>{const a=this.ke.it(),l=`projects/${a.projectId}/databases/${a.database}/documents/${o.path.canonicalString()}`;t.mightContain(l)||(this.ze(n,o,null),s++)}),s}ot(t){const n=new Map;this.qe.forEach((o,a)=>{const l=this.Xe(a);if(l){if(o.current&&Qo(l.target)){const u=new nt(l.target.path);this._t(u).has(a)||this.ut(a,u)||this.ze(a,u,ee.newNoDocument(u,t))}o.ve&&(n.set(a,o.Fe()),o.Me())}});let r=pt();this.Ue.forEach((o,a)=>{let l=!0;a.forEachWhile(u=>{const f=this.Xe(u);return!f||f.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(o))}),this.Qe.forEach((o,a)=>a.setReadTime(t));const s=new Bi(t,n,this.Ke,this.Qe,r);return this.Qe=dn(),this.$e=js(),this.Ue=js(),this.Ke=new Dt(ct),s}Ge(t,n){if(!this.Je(t))return;const r=this.ut(t,n.key)?2:0;this.He(t).xe(n.key,r),this.Qe=this.Qe.insert(n.key,n),this.$e=this.$e.insert(n.key,this._t(n.key).add(t)),this.Ue=this.Ue.insert(n.key,this.ct(n.key).add(t))}ze(t,n,r){if(!this.Je(t))return;const s=this.He(t);this.ut(t,n)?s.xe(n,1):s.Oe(n),this.Ue=this.Ue.insert(n,this.ct(n).delete(t)),this.Ue=this.Ue.insert(n,this.ct(n).add(t)),r&&(this.Qe=this.Qe.insert(n,r))}removeTarget(t){this.qe.delete(t)}et(t){const n=this.He(t).Fe();return this.ke.getRemoteKeysForTarget(t).size+n.addedDocuments.size-n.removedDocuments.size}Ne(t){this.He(t).Ne()}He(t){let n=this.qe.get(t);return n||(n=new Xc,this.qe.set(t,n)),n}ct(t){let n=this.Ue.get(t);return n||(n=new Ft(ct),this.Ue=this.Ue.insert(t,n)),n}_t(t){let n=this.$e.get(t);return n||(n=new Ft(ct),this.$e=this.$e.insert(t,n)),n}Je(t){const n=this.Xe(t)!==null;return n||K("WatchChangeAggregator","Detected inactive target",t),n}Xe(t){const n=this.qe.get(t);return n&&n.De?null:this.ke.lt(t)}Ye(t){this.qe.set(t,new Xc),this.ke.getRemoteKeysForTarget(t).forEach(n=>{this.ze(t,n,null)})}ut(t,n){return this.ke.getRemoteKeysForTarget(t).has(n)}}function js(){return new Dt(nt.comparator)}function Yc(){return new Dt(nt.comparator)}const tv={asc:"ASCENDING",desc:"DESCENDING"},ev={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},nv={and:"AND",or:"OR"};class rv{constructor(t,n){this.databaseId=t,this.useProto3Json=n}}function Zo(e,t){return e.useProto3Json||Ni(t)?t:{value:t}}function sv(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function iv(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function sr(e){return St(!!e),st.fromTimestamp(function(n){const r=un(n);return new he(r.seconds,r.nanos)}(e))}function ov(e,t){return ta(e,t).canonicalString()}function ta(e,t){const n=function(s){return new Pt(["projects",s.projectId,"databases",s.database])}(e).child("documents");return t===void 0?n:n.child(t)}function vf(e){const t=Pt.fromString(e);return St(Af(t)),t}function Io(e,t){const n=vf(t);if(n.get(1)!==e.databaseId.projectId)throw new tt(j.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new tt(j.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+e.databaseId.database);return new nt(Tf(n))}function Ef(e,t){return ov(e.databaseId,t)}function av(e){const t=vf(e);return t.length===4?Pt.emptyPath():Tf(t)}function Jc(e){return new Pt(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function Tf(e){return St(e.length>4&&e.get(4)==="documents"),e.popFirst(5)}function lv(e,t){let n;if("targetChange"in t){t.targetChange;const r=function(f){return f==="NO_CHANGE"?0:f==="ADD"?1:f==="REMOVE"?2:f==="CURRENT"?3:f==="RESET"?4:lt()}(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],o=function(f,d){return f.useProto3Json?(St(d===void 0||typeof d=="string"),Kt.fromBase64String(d||"")):(St(d===void 0||d instanceof Buffer||d instanceof Uint8Array),Kt.fromUint8Array(d||new Uint8Array))}(e,t.targetChange.resumeToken),a=t.targetChange.cause,l=a&&function(f){const d=f.code===void 0?j.UNKNOWN:mf(f.code);return new tt(d,f.message||"")}(a);n=new yf(r,s,o,l||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const s=Io(e,r.document.name),o=sr(r.document.updateTime),a=r.document.createTime?sr(r.document.createTime):st.min(),l=new xe({mapValue:{fields:r.document.fields}}),u=ee.newFoundDocument(s,o,a,l),f=r.targetIds||[],d=r.removedTargetIds||[];n=new Ys(f,d,u.key,u)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const s=Io(e,r.document),o=r.readTime?sr(r.readTime):st.min(),a=ee.newNoDocument(s,o),l=r.removedTargetIds||[];n=new Ys([],l,a.key,a)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const s=Io(e,r.document),o=r.removedTargetIds||[];n=new Ys([],o,s,null)}else{if(!("filter"in t))return lt();{t.filter;const r=t.filter;r.targetId;const{count:s=0,unchangedNames:o}=r,a=new Yy(s,o),l=r.targetId;n=new _f(l,a)}}return n}function cv(e,t){return{documents:[Ef(e,t.path)]}}function uv(e,t){const n={structuredQuery:{}},r=t.path;let s;t.collectionGroup!==null?(s=r,n.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=Ef(e,s);const o=function(f){if(f.length!==0)return wf(Le.create(f,"and"))}(t.filters);o&&(n.structuredQuery.where=o);const a=function(f){if(f.length!==0)return f.map(d=>function(A){return{field:Gn(A.field),direction:dv(A.dir)}}(d))}(t.orderBy);a&&(n.structuredQuery.orderBy=a);const l=Zo(e,t.limit);return l!==null&&(n.structuredQuery.limit=l),t.startAt&&(n.structuredQuery.startAt=function(f){return{before:f.inclusive,values:f.position}}(t.startAt)),t.endAt&&(n.structuredQuery.endAt=function(f){return{before:!f.inclusive,values:f.position}}(t.endAt)),{ht:n,parent:s}}function hv(e){let t=av(e.parent);const n=e.structuredQuery,r=n.from?n.from.length:0;let s=null;if(r>0){St(r===1);const d=n.from[0];d.allDescendants?s=d.collectionId:t=t.child(d.collectionId)}let o=[];n.where&&(o=function(m){const A=If(m);return A instanceof Le&&ef(A)?A.getFilters():[A]}(n.where));let a=[];n.orderBy&&(a=function(m){return m.map(A=>function(x){return new fi(Wn(x.field),function($){switch($){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(x.direction))}(A))}(n.orderBy));let l=null;n.limit&&(l=function(m){let A;return A=typeof m=="object"?m.value:m,Ni(A)?null:A}(n.limit));let u=null;n.startAt&&(u=function(m){const A=!!m.before,C=m.values||[];return new hi(C,A)}(n.startAt));let f=null;return n.endAt&&(f=function(m){const A=!m.before,C=m.values||[];return new hi(C,A)}(n.endAt)),Dy(t,s,a,o,l,"F",u,f)}function fv(e,t){const n=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return lt()}}(t.purpose);return n==null?null:{"goog-listen-tags":n}}function If(e){return e.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=Wn(n.unaryFilter.field);return Lt.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Wn(n.unaryFilter.field);return Lt.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=Wn(n.unaryFilter.field);return Lt.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Wn(n.unaryFilter.field);return Lt.create(a,"!=",{nullValue:"NULL_VALUE"});default:return lt()}}(e):e.fieldFilter!==void 0?function(n){return Lt.create(Wn(n.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return lt()}}(n.fieldFilter.op),n.fieldFilter.value)}(e):e.compositeFilter!==void 0?function(n){return Le.create(n.compositeFilter.filters.map(r=>If(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return lt()}}(n.compositeFilter.op))}(e):lt()}function dv(e){return tv[e]}function pv(e){return ev[e]}function gv(e){return nv[e]}function Gn(e){return{fieldPath:e.canonicalString()}}function Wn(e){return ce.fromServerFormat(e.fieldPath)}function wf(e){return e instanceof Lt?function(n){if(n.op==="=="){if(Uc(n.value))return{unaryFilter:{field:Gn(n.field),op:"IS_NAN"}};if(Fc(n.value))return{unaryFilter:{field:Gn(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Uc(n.value))return{unaryFilter:{field:Gn(n.field),op:"IS_NOT_NAN"}};if(Fc(n.value))return{unaryFilter:{field:Gn(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Gn(n.field),op:pv(n.op),value:n.value}}}(e):e instanceof Le?function(n){const r=n.getFilters().map(s=>wf(s));return r.length===1?r[0]:{compositeFilter:{op:gv(n.op),filters:r}}}(e):lt()}function Af(e){return e.length>=4&&e.get(0)==="projects"&&e.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rn{constructor(t,n,r,s,o=st.min(),a=st.min(),l=Kt.EMPTY_BYTE_STRING,u=null){this.target=t,this.targetId=n,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=u}withSequenceNumber(t){return new rn(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,n){return new rn(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new rn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new rn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mv{constructor(t){this.Tt=t}}function _v(e){const t=hv({parent:e.parent,structuredQuery:e.structuredQuery});return e.limitType==="LAST"?Xo(t,t.limit,"L"):t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yv{constructor(){this.Tn=new vv}addToCollectionParentIndex(t,n){return this.Tn.add(n),V.resolve()}getCollectionParents(t,n){return V.resolve(this.Tn.getEntries(n))}addFieldIndex(t,n){return V.resolve()}deleteFieldIndex(t,n){return V.resolve()}deleteAllFieldIndexes(t){return V.resolve()}createTargetIndexes(t,n){return V.resolve()}getDocumentsMatchingTarget(t,n){return V.resolve(null)}getIndexType(t,n){return V.resolve(0)}getFieldIndexes(t,n){return V.resolve([])}getNextCollectionGroupToUpdate(t){return V.resolve(null)}getMinOffset(t,n){return V.resolve(cn.min())}getMinOffsetFromCollectionGroup(t,n){return V.resolve(cn.min())}updateCollectionGroup(t,n,r){return V.resolve()}updateIndexEntries(t,n){return V.resolve()}}class vv{constructor(){this.index={}}add(t){const n=t.lastSegment(),r=t.popLast(),s=this.index[n]||new Ft(Pt.comparator),o=!s.has(r);return this.index[n]=s.add(r),o}has(t){const n=t.lastSegment(),r=t.popLast(),s=this.index[n];return s&&s.has(r)}getEntries(t){return(this.index[t]||new Ft(Pt.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zc={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},bf=41943040;class ue{static withCacheSize(t){return new ue(t,ue.DEFAULT_COLLECTION_PERCENTILE,ue.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(t,n,r){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=n,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ue.DEFAULT_COLLECTION_PERCENTILE=10,ue.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,ue.DEFAULT=new ue(bf,ue.DEFAULT_COLLECTION_PERCENTILE,ue.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),ue.DISABLED=new ue(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fr{constructor(t){this.$n=t}next(){return this.$n+=2,this.$n}static Un(){return new fr(0)}static Kn(){return new fr(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tu="LruGarbageCollector",Ev=1048576;function eu([e,t],[n,r]){const s=ct(e,n);return s===0?ct(t,r):s}class Tv{constructor(t){this.Hn=t,this.buffer=new Ft(eu),this.Jn=0}Yn(){return++this.Jn}Zn(t){const n=[t,this.Yn()];if(this.buffer.size<this.Hn)this.buffer=this.buffer.add(n);else{const r=this.buffer.last();eu(n,r)<0&&(this.buffer=this.buffer.delete(r).add(n))}}get maxValue(){return this.buffer.last()[0]}}class Iv{constructor(t,n,r){this.garbageCollector=t,this.asyncQueue=n,this.localStore=r,this.Xn=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.er(6e4)}stop(){this.Xn&&(this.Xn.cancel(),this.Xn=null)}get started(){return this.Xn!==null}er(t){K(tu,`Garbage collection scheduled in ${t}ms`),this.Xn=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,async()=>{this.Xn=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(n){yr(n)?K(tu,"Ignoring IndexedDB error during garbage collection: ",n):await Di(n)}await this.er(3e5)})}}class wv{constructor(t,n){this.tr=t,this.params=n}calculateTargetCount(t,n){return this.tr.nr(t).next(r=>Math.floor(n/100*r))}nthSequenceNumber(t,n){if(n===0)return V.resolve(xi.ae);const r=new Tv(n);return this.tr.forEachTarget(t,s=>r.Zn(s.sequenceNumber)).next(()=>this.tr.rr(t,s=>r.Zn(s))).next(()=>r.maxValue)}removeTargets(t,n,r){return this.tr.removeTargets(t,n,r)}removeOrphanedDocuments(t,n){return this.tr.removeOrphanedDocuments(t,n)}collect(t,n){return this.params.cacheSizeCollectionThreshold===-1?(K("LruGarbageCollector","Garbage collection skipped; disabled"),V.resolve(Zc)):this.getCacheSize(t).next(r=>r<this.params.cacheSizeCollectionThreshold?(K("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Zc):this.ir(t,n))}getCacheSize(t){return this.tr.getCacheSize(t)}ir(t,n){let r,s,o,a,l,u,f;const d=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next(m=>(m>this.params.maximumSequenceNumbersToCollect?(K("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),s=this.params.maximumSequenceNumbersToCollect):s=m,a=Date.now(),this.nthSequenceNumber(t,s))).next(m=>(r=m,l=Date.now(),this.removeTargets(t,r,n))).next(m=>(o=m,u=Date.now(),this.removeOrphanedDocuments(t,r))).next(m=>(f=Date.now(),zn()<=ft.DEBUG&&K("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-d}ms
	Determined least recently used ${s} in `+(l-a)+`ms
	Removed ${o} targets in `+(u-l)+`ms
	Removed ${m} documents in `+(f-u)+`ms
Total Duration: ${f-d}ms`),V.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:o,documentsRemoved:m})))}}function Av(e,t){return new wv(e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bv{constructor(){this.changes=new Fn(t=>t.toString(),(t,n)=>t.isEqual(n)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,n){this.assertNotApplied(),this.changes.set(t,ee.newInvalidDocument(t).setReadTime(n))}getEntry(t,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?V.resolve(r):this.getFromCache(t,n)}getEntries(t,n){return this.getAllFromCache(t,n)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sv{constructor(t,n){this.overlayedDocument=t,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cv{constructor(t,n,r,s){this.remoteDocumentCache=t,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=s}getDocument(t,n){let r=null;return this.documentOverlayCache.getOverlay(t,n).next(s=>(r=s,this.remoteDocumentCache.getEntry(t,n))).next(s=>(r!==null&&Yr(r.mutation,s,nn.empty(),he.now()),s))}getDocuments(t,n){return this.remoteDocumentCache.getEntries(t,n).next(r=>this.getLocalViewOfDocuments(t,r,pt()).next(()=>r))}getLocalViewOfDocuments(t,n,r=pt()){const s=Vn();return this.populateOverlays(t,s,n).next(()=>this.computeViews(t,n,s,r).next(o=>{let a=Br();return o.forEach((l,u)=>{a=a.insert(l,u.overlayedDocument)}),a}))}getOverlayedDocuments(t,n){const r=Vn();return this.populateOverlays(t,r,n).next(()=>this.computeViews(t,n,r,pt()))}populateOverlays(t,n,r){const s=[];return r.forEach(o=>{n.has(o)||s.push(o)}),this.documentOverlayCache.getOverlays(t,s).next(o=>{o.forEach((a,l)=>{n.set(a,l)})})}computeViews(t,n,r,s){let o=dn();const a=Xr(),l=function(){return Xr()}();return n.forEach((u,f)=>{const d=r.get(f.key);s.has(f.key)&&(d===void 0||d.mutation instanceof Ui)?o=o.insert(f.key,f):d!==void 0?(a.set(f.key,d.mutation.getFieldMask()),Yr(d.mutation,f,d.mutation.getFieldMask(),he.now())):a.set(f.key,nn.empty())}),this.recalculateAndSaveOverlays(t,o).next(u=>(u.forEach((f,d)=>a.set(f,d)),n.forEach((f,d)=>{var m;return l.set(f,new Sv(d,(m=a.get(f))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(t,n){const r=Xr();let s=new Dt((a,l)=>a-l),o=pt();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,n).next(a=>{for(const l of a)l.keys().forEach(u=>{const f=n.get(u);if(f===null)return;let d=r.get(u)||nn.empty();d=l.applyToLocalView(f,d),r.set(u,d);const m=(s.get(l.batchId)||pt()).add(u);s=s.insert(l.batchId,m)})}).next(()=>{const a=[],l=s.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),f=u.key,d=u.value,m=uf();d.forEach(A=>{if(!o.has(A)){const C=pf(n.get(A),r.get(A));C!==null&&m.set(A,C),o=o.add(A)}}),a.push(this.documentOverlayCache.saveOverlays(t,f,m))}return V.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(t,n){return this.remoteDocumentCache.getEntries(t,n).next(r=>this.recalculateAndSaveOverlays(t,r))}getDocumentsMatchingQuery(t,n,r,s){return function(a){return nt.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(t,n.path):xy(n)?this.getDocumentsMatchingCollectionGroupQuery(t,n,r,s):this.getDocumentsMatchingCollectionQuery(t,n,r,s)}getNextDocuments(t,n,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,n,r,s).next(o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,n,r.largestBatchId,s-o.size):V.resolve(Vn());let l=ls,u=o;return a.next(f=>V.forEach(f,(d,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),o.get(d)?V.resolve():this.remoteDocumentCache.getEntry(t,d).next(A=>{u=u.insert(d,A)}))).next(()=>this.populateOverlays(t,f,o)).next(()=>this.computeViews(t,u,f,pt())).next(d=>({batchId:l,changes:Ly(d)})))})}getDocumentsMatchingDocumentQuery(t,n){return this.getDocument(t,new nt(n)).next(r=>{let s=Br();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(t,n,r,s){const o=n.collectionGroup;let a=Br();return this.indexManager.getCollectionParents(t,o).next(l=>V.forEach(l,u=>{const f=function(m,A){return new Mi(A,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(n,u.child(o));return this.getDocumentsMatchingCollectionQuery(t,f,r,s).next(d=>{d.forEach((m,A)=>{a=a.insert(m,A)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(t,n,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(t,n.path,r.largestBatchId).next(a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(t,n,r,o,s))).next(a=>{o.forEach((u,f)=>{const d=f.getKey();a.get(d)===null&&(a=a.insert(d,ee.newInvalidDocument(d)))});let l=Br();return a.forEach((u,f)=>{const d=o.get(u);d!==void 0&&Yr(d.mutation,f,nn.empty(),he.now()),Li(n,f)&&(l=l.insert(u,f))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rv{constructor(t){this.serializer=t,this.dr=new Map,this.Ar=new Map}getBundleMetadata(t,n){return V.resolve(this.dr.get(n))}saveBundleMetadata(t,n){return this.dr.set(n.id,function(s){return{id:s.id,version:s.version,createTime:sr(s.createTime)}}(n)),V.resolve()}getNamedQuery(t,n){return V.resolve(this.Ar.get(n))}saveNamedQuery(t,n){return this.Ar.set(n.name,function(s){return{name:s.name,query:_v(s.bundledQuery),readTime:sr(s.readTime)}}(n)),V.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pv{constructor(){this.overlays=new Dt(nt.comparator),this.Rr=new Map}getOverlay(t,n){return V.resolve(this.overlays.get(n))}getOverlays(t,n){const r=Vn();return V.forEach(n,s=>this.getOverlay(t,s).next(o=>{o!==null&&r.set(s,o)})).next(()=>r)}saveOverlays(t,n,r){return r.forEach((s,o)=>{this.Et(t,n,o)}),V.resolve()}removeOverlaysForBatchId(t,n,r){const s=this.Rr.get(r);return s!==void 0&&(s.forEach(o=>this.overlays=this.overlays.remove(o)),this.Rr.delete(r)),V.resolve()}getOverlaysForCollection(t,n,r){const s=Vn(),o=n.length+1,a=new nt(n.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const u=l.getNext().value,f=u.getKey();if(!n.isPrefixOf(f.path))break;f.path.length===o&&u.largestBatchId>r&&s.set(u.getKey(),u)}return V.resolve(s)}getOverlaysForCollectionGroup(t,n,r,s){let o=new Dt((f,d)=>f-d);const a=this.overlays.getIterator();for(;a.hasNext();){const f=a.getNext().value;if(f.getKey().getCollectionGroup()===n&&f.largestBatchId>r){let d=o.get(f.largestBatchId);d===null&&(d=Vn(),o=o.insert(f.largestBatchId,d)),d.set(f.getKey(),f)}}const l=Vn(),u=o.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((f,d)=>l.set(f,d)),!(l.size()>=s)););return V.resolve(l)}Et(t,n,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Rr.get(s.largestBatchId).delete(r.key);this.Rr.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new Xy(n,r));let o=this.Rr.get(n);o===void 0&&(o=pt(),this.Rr.set(n,o)),this.Rr.set(n,o.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vv{constructor(){this.sessionToken=Kt.EMPTY_BYTE_STRING}getSessionToken(t){return V.resolve(this.sessionToken)}setSessionToken(t,n){return this.sessionToken=n,V.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ma{constructor(){this.Vr=new Ft(Ut.mr),this.gr=new Ft(Ut.pr)}isEmpty(){return this.Vr.isEmpty()}addReference(t,n){const r=new Ut(t,n);this.Vr=this.Vr.add(r),this.gr=this.gr.add(r)}yr(t,n){t.forEach(r=>this.addReference(r,n))}removeReference(t,n){this.wr(new Ut(t,n))}Sr(t,n){t.forEach(r=>this.removeReference(r,n))}br(t){const n=new nt(new Pt([])),r=new Ut(n,t),s=new Ut(n,t+1),o=[];return this.gr.forEachInRange([r,s],a=>{this.wr(a),o.push(a.key)}),o}Dr(){this.Vr.forEach(t=>this.wr(t))}wr(t){this.Vr=this.Vr.delete(t),this.gr=this.gr.delete(t)}vr(t){const n=new nt(new Pt([])),r=new Ut(n,t),s=new Ut(n,t+1);let o=pt();return this.gr.forEachInRange([r,s],a=>{o=o.add(a.key)}),o}containsKey(t){const n=new Ut(t,0),r=this.Vr.firstAfterOrEqual(n);return r!==null&&t.isEqual(r.key)}}class Ut{constructor(t,n){this.key=t,this.Cr=n}static mr(t,n){return nt.comparator(t.key,n.key)||ct(t.Cr,n.Cr)}static pr(t,n){return ct(t.Cr,n.Cr)||nt.comparator(t.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dv{constructor(t,n){this.indexManager=t,this.referenceDelegate=n,this.mutationQueue=[],this.Fr=1,this.Mr=new Ft(Ut.mr)}checkEmpty(t){return V.resolve(this.mutationQueue.length===0)}addMutationBatch(t,n,r,s){const o=this.Fr;this.Fr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new Qy(o,n,r,s);this.mutationQueue.push(a);for(const l of s)this.Mr=this.Mr.add(new Ut(l.key,o)),this.indexManager.addToCollectionParentIndex(t,l.key.path.popLast());return V.resolve(a)}lookupMutationBatch(t,n){return V.resolve(this.Or(n))}getNextMutationBatchAfterBatchId(t,n){const r=n+1,s=this.Nr(r),o=s<0?0:s;return V.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return V.resolve(this.mutationQueue.length===0?uy:this.Fr-1)}getAllMutationBatches(t){return V.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,n){const r=new Ut(n,0),s=new Ut(n,Number.POSITIVE_INFINITY),o=[];return this.Mr.forEachInRange([r,s],a=>{const l=this.Or(a.Cr);o.push(l)}),V.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(t,n){let r=new Ft(ct);return n.forEach(s=>{const o=new Ut(s,0),a=new Ut(s,Number.POSITIVE_INFINITY);this.Mr.forEachInRange([o,a],l=>{r=r.add(l.Cr)})}),V.resolve(this.Br(r))}getAllMutationBatchesAffectingQuery(t,n){const r=n.path,s=r.length+1;let o=r;nt.isDocumentKey(o)||(o=o.child(""));const a=new Ut(new nt(o),0);let l=new Ft(ct);return this.Mr.forEachWhile(u=>{const f=u.key.path;return!!r.isPrefixOf(f)&&(f.length===s&&(l=l.add(u.Cr)),!0)},a),V.resolve(this.Br(l))}Br(t){const n=[];return t.forEach(r=>{const s=this.Or(r);s!==null&&n.push(s)}),n}removeMutationBatch(t,n){St(this.Lr(n.batchId,"removed")===0),this.mutationQueue.shift();let r=this.Mr;return V.forEach(n.mutations,s=>{const o=new Ut(s.key,n.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)}).next(()=>{this.Mr=r})}qn(t){}containsKey(t,n){const r=new Ut(n,0),s=this.Mr.firstAfterOrEqual(r);return V.resolve(n.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,V.resolve()}Lr(t,n){return this.Nr(t)}Nr(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Or(t){const n=this.Nr(t);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xv{constructor(t){this.kr=t,this.docs=function(){return new Dt(nt.comparator)}(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,n){const r=n.key,s=this.docs.get(r),o=s?s.size:0,a=this.kr(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(t,r.path.popLast())}removeEntry(t){const n=this.docs.get(t);n&&(this.docs=this.docs.remove(t),this.size-=n.size)}getEntry(t,n){const r=this.docs.get(n);return V.resolve(r?r.document.mutableCopy():ee.newInvalidDocument(n))}getEntries(t,n){let r=dn();return n.forEach(s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():ee.newInvalidDocument(s))}),V.resolve(r)}getDocumentsMatchingQuery(t,n,r,s){let o=dn();const a=n.path,l=new nt(a.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:f,value:{document:d}}=u.getNext();if(!a.isPrefixOf(f.path))break;f.path.length>a.length+1||oy(iy(d),r)<=0||(s.has(d.key)||Li(n,d))&&(o=o.insert(d.key,d.mutableCopy()))}return V.resolve(o)}getAllFromCollectionGroup(t,n,r,s){lt()}qr(t,n){return V.forEach(this.docs,r=>n(r))}newChangeBuffer(t){return new Nv(this)}getSize(t){return V.resolve(this.size)}}class Nv extends bv{constructor(t){super(),this.Ir=t}applyChanges(t){const n=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?n.push(this.Ir.addEntry(t,s)):this.Ir.removeEntry(r)}),V.waitFor(n)}getFromCache(t,n){return this.Ir.getEntry(t,n)}getAllFromCache(t,n){return this.Ir.getEntries(t,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ov{constructor(t){this.persistence=t,this.Qr=new Fn(n=>Va(n),Da),this.lastRemoteSnapshotVersion=st.min(),this.highestTargetId=0,this.$r=0,this.Ur=new Ma,this.targetCount=0,this.Kr=fr.Un()}forEachTarget(t,n){return this.Qr.forEach((r,s)=>n(s)),V.resolve()}getLastRemoteSnapshotVersion(t){return V.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return V.resolve(this.$r)}allocateTargetId(t){return this.highestTargetId=this.Kr.next(),V.resolve(this.highestTargetId)}setTargetsMetadata(t,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.$r&&(this.$r=n),V.resolve()}zn(t){this.Qr.set(t.target,t);const n=t.targetId;n>this.highestTargetId&&(this.Kr=new fr(n),this.highestTargetId=n),t.sequenceNumber>this.$r&&(this.$r=t.sequenceNumber)}addTargetData(t,n){return this.zn(n),this.targetCount+=1,V.resolve()}updateTargetData(t,n){return this.zn(n),V.resolve()}removeTargetData(t,n){return this.Qr.delete(n.target),this.Ur.br(n.targetId),this.targetCount-=1,V.resolve()}removeTargets(t,n,r){let s=0;const o=[];return this.Qr.forEach((a,l)=>{l.sequenceNumber<=n&&r.get(l.targetId)===null&&(this.Qr.delete(a),o.push(this.removeMatchingKeysForTargetId(t,l.targetId)),s++)}),V.waitFor(o).next(()=>s)}getTargetCount(t){return V.resolve(this.targetCount)}getTargetData(t,n){const r=this.Qr.get(n)||null;return V.resolve(r)}addMatchingKeys(t,n,r){return this.Ur.yr(n,r),V.resolve()}removeMatchingKeys(t,n,r){this.Ur.Sr(n,r);const s=this.persistence.referenceDelegate,o=[];return s&&n.forEach(a=>{o.push(s.markPotentiallyOrphaned(t,a))}),V.waitFor(o)}removeMatchingKeysForTargetId(t,n){return this.Ur.br(n),V.resolve()}getMatchingKeysForTargetId(t,n){const r=this.Ur.vr(n);return V.resolve(r)}containsKey(t,n){return V.resolve(this.Ur.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sf{constructor(t,n){this.Wr={},this.overlays={},this.Gr=new xi(0),this.zr=!1,this.zr=!0,this.jr=new Vv,this.referenceDelegate=t(this),this.Hr=new Ov(this),this.indexManager=new yv,this.remoteDocumentCache=function(s){return new xv(s)}(r=>this.referenceDelegate.Jr(r)),this.serializer=new mv(n),this.Yr=new Rv(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.zr=!1,Promise.resolve()}get started(){return this.zr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let n=this.overlays[t.toKey()];return n||(n=new Pv,this.overlays[t.toKey()]=n),n}getMutationQueue(t,n){let r=this.Wr[t.toKey()];return r||(r=new Dv(n,this.referenceDelegate),this.Wr[t.toKey()]=r),r}getGlobalsCache(){return this.jr}getTargetCache(){return this.Hr}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Yr}runTransaction(t,n,r){K("MemoryPersistence","Starting transaction:",t);const s=new Mv(this.Gr.next());return this.referenceDelegate.Zr(),r(s).next(o=>this.referenceDelegate.Xr(s).next(()=>o)).toPromise().then(o=>(s.raiseOnCommittedEvent(),o))}ei(t,n){return V.or(Object.values(this.Wr).map(r=>()=>r.containsKey(t,n)))}}class Mv extends ly{constructor(t){super(),this.currentSequenceNumber=t}}class ka{constructor(t){this.persistence=t,this.ti=new Ma,this.ni=null}static ri(t){return new ka(t)}get ii(){if(this.ni)return this.ni;throw lt()}addReference(t,n,r){return this.ti.addReference(r,n),this.ii.delete(r.toString()),V.resolve()}removeReference(t,n,r){return this.ti.removeReference(r,n),this.ii.add(r.toString()),V.resolve()}markPotentiallyOrphaned(t,n){return this.ii.add(n.toString()),V.resolve()}removeTarget(t,n){this.ti.br(n.targetId).forEach(s=>this.ii.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(t,n.targetId).next(s=>{s.forEach(o=>this.ii.add(o.toString()))}).next(()=>r.removeTargetData(t,n))}Zr(){this.ni=new Set}Xr(t){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return V.forEach(this.ii,r=>{const s=nt.fromPath(r);return this.si(t,s).next(o=>{o||n.removeEntry(s,st.min())})}).next(()=>(this.ni=null,n.apply(t)))}updateLimboDocument(t,n){return this.si(t,n).next(r=>{r?this.ii.delete(n.toString()):this.ii.add(n.toString())})}Jr(t){return 0}si(t,n){return V.or([()=>V.resolve(this.ti.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(t,n),()=>this.persistence.ei(t,n)])}}class gi{constructor(t,n){this.persistence=t,this.oi=new Fn(r=>hy(r.path),(r,s)=>r.isEqual(s)),this.garbageCollector=Av(this,n)}static ri(t,n){return new gi(t,n)}Zr(){}Xr(t){return V.resolve()}forEachTarget(t,n){return this.persistence.getTargetCache().forEachTarget(t,n)}nr(t){const n=this.sr(t);return this.persistence.getTargetCache().getTargetCount(t).next(r=>n.next(s=>r+s))}sr(t){let n=0;return this.rr(t,r=>{n++}).next(()=>n)}rr(t,n){return V.forEach(this.oi,(r,s)=>this.ar(t,r,s).next(o=>o?V.resolve():n(s)))}removeTargets(t,n,r){return this.persistence.getTargetCache().removeTargets(t,n,r)}removeOrphanedDocuments(t,n){let r=0;const s=this.persistence.getRemoteDocumentCache(),o=s.newChangeBuffer();return s.qr(t,a=>this.ar(t,a,n).next(l=>{l||(r++,o.removeEntry(a,st.min()))})).next(()=>o.apply(t)).next(()=>r)}markPotentiallyOrphaned(t,n){return this.oi.set(n,t.currentSequenceNumber),V.resolve()}removeTarget(t,n){const r=n.withSequenceNumber(t.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(t,r)}addReference(t,n,r){return this.oi.set(r,t.currentSequenceNumber),V.resolve()}removeReference(t,n,r){return this.oi.set(r,t.currentSequenceNumber),V.resolve()}updateLimboDocument(t,n){return this.oi.set(n,t.currentSequenceNumber),V.resolve()}Jr(t){let n=t.key.toString().length;return t.isFoundDocument()&&(n+=Qs(t.data.value)),n}ar(t,n,r){return V.or([()=>this.persistence.ei(t,n),()=>this.persistence.getTargetCache().containsKey(t,n),()=>{const s=this.oi.get(n);return V.resolve(s!==void 0&&s>r)}])}getCacheSize(t){return this.persistence.getRemoteDocumentCache().getSize(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class La{constructor(t,n,r,s){this.targetId=t,this.fromCache=n,this.Hi=r,this.Ji=s}static Yi(t,n){let r=pt(),s=pt();for(const o of n.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new La(t,n.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kv{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lv{constructor(){this.Zi=!1,this.Xi=!1,this.es=100,this.ts=function(){return Cm()?8:cy(bm())>0?6:4}()}initialize(t,n){this.ns=t,this.indexManager=n,this.Zi=!0}getDocumentsMatchingQuery(t,n,r,s){const o={result:null};return this.rs(t,n).next(a=>{o.result=a}).next(()=>{if(!o.result)return this.ss(t,n,s,r).next(a=>{o.result=a})}).next(()=>{if(o.result)return;const a=new kv;return this._s(t,n,a).next(l=>{if(o.result=l,this.Xi)return this.us(t,n,a,l.size)})}).next(()=>o.result)}us(t,n,r,s){return r.documentReadCount<this.es?(zn()<=ft.DEBUG&&K("QueryEngine","SDK will not create cache indexes for query:",Kn(n),"since it only creates cache indexes for collection contains","more than or equal to",this.es,"documents"),V.resolve()):(zn()<=ft.DEBUG&&K("QueryEngine","Query:",Kn(n),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.ts*s?(zn()<=ft.DEBUG&&K("QueryEngine","The SDK decides to create cache indexes for query:",Kn(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,Oe(n))):V.resolve())}rs(t,n){if(qc(n))return V.resolve(null);let r=Oe(n);return this.indexManager.getIndexType(t,r).next(s=>s===0?null:(n.limit!==null&&s===1&&(n=Xo(n,null,"F"),r=Oe(n)),this.indexManager.getDocumentsMatchingTarget(t,r).next(o=>{const a=pt(...o);return this.ns.getDocuments(t,a).next(l=>this.indexManager.getMinOffset(t,r).next(u=>{const f=this.cs(n,l);return this.ls(n,f,a,u.readTime)?this.rs(t,Xo(n,null,"F")):this.hs(t,f,n,u)}))})))}ss(t,n,r,s){return qc(n)||s.isEqual(st.min())?V.resolve(null):this.ns.getDocuments(t,r).next(o=>{const a=this.cs(n,o);return this.ls(n,a,r,s)?V.resolve(null):(zn()<=ft.DEBUG&&K("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Kn(n)),this.hs(t,a,n,sy(s,ls)).next(l=>l))})}cs(t,n){let r=new Ft(lf(t));return n.forEach((s,o)=>{Li(t,o)&&(r=r.add(o))}),r}ls(t,n,r,s){if(t.limit===null)return!1;if(r.size!==n.size)return!0;const o=t.limitType==="F"?n.last():n.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}_s(t,n,r){return zn()<=ft.DEBUG&&K("QueryEngine","Using full collection scan to execute query:",Kn(n)),this.ns.getDocumentsMatchingQuery(t,n,cn.min(),r)}hs(t,n,r,s){return this.ns.getDocumentsMatchingQuery(t,r,s).next(o=>(n.forEach(a=>{o=o.insert(a.key,a)}),o))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fa="LocalStore",Fv=3e8;class Uv{constructor(t,n,r,s){this.persistence=t,this.Ps=n,this.serializer=s,this.Ts=new Dt(ct),this.Is=new Fn(o=>Va(o),Da),this.Es=new Map,this.ds=t.getRemoteDocumentCache(),this.Hr=t.getTargetCache(),this.Yr=t.getBundleCache(),this.As(r)}As(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new Cv(this.ds,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.ds.setIndexManager(this.indexManager),this.Ps.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>t.collect(n,this.Ts))}}function Bv(e,t,n,r){return new Uv(e,t,n,r)}async function Cf(e,t){const n=dt(e);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let s;return n.mutationQueue.getAllMutationBatches(r).next(o=>(s=o,n.As(t),n.mutationQueue.getAllMutationBatches(r))).next(o=>{const a=[],l=[];let u=pt();for(const f of s){a.push(f.batchId);for(const d of f.mutations)u=u.add(d.key)}for(const f of o){l.push(f.batchId);for(const d of f.mutations)u=u.add(d.key)}return n.localDocuments.getDocuments(r,u).next(f=>({Rs:f,removedBatchIds:a,addedBatchIds:l}))})})}function Rf(e){const t=dt(e);return t.persistence.runTransaction("Get last remote snapshot version","readonly",n=>t.Hr.getLastRemoteSnapshotVersion(n))}function $v(e,t){const n=dt(e),r=t.snapshotVersion;let s=n.Ts;return n.persistence.runTransaction("Apply remote event","readwrite-primary",o=>{const a=n.ds.newChangeBuffer({trackRemovals:!0});s=n.Ts;const l=[];t.targetChanges.forEach((d,m)=>{const A=s.get(m);if(!A)return;l.push(n.Hr.removeMatchingKeys(o,d.removedDocuments,m).next(()=>n.Hr.addMatchingKeys(o,d.addedDocuments,m)));let C=A.withSequenceNumber(o.currentSequenceNumber);t.targetMismatches.get(m)!==null?C=C.withResumeToken(Kt.EMPTY_BYTE_STRING,st.min()).withLastLimboFreeSnapshotVersion(st.min()):d.resumeToken.approximateByteSize()>0&&(C=C.withResumeToken(d.resumeToken,r)),s=s.insert(m,C),function(L,$,Y){return L.resumeToken.approximateByteSize()===0||$.snapshotVersion.toMicroseconds()-L.snapshotVersion.toMicroseconds()>=Fv?!0:Y.addedDocuments.size+Y.modifiedDocuments.size+Y.removedDocuments.size>0}(A,C,d)&&l.push(n.Hr.updateTargetData(o,C))});let u=dn(),f=pt();if(t.documentUpdates.forEach(d=>{t.resolvedLimboDocuments.has(d)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(o,d))}),l.push(jv(o,a,t.documentUpdates).next(d=>{u=d.Vs,f=d.fs})),!r.isEqual(st.min())){const d=n.Hr.getLastRemoteSnapshotVersion(o).next(m=>n.Hr.setTargetsMetadata(o,o.currentSequenceNumber,r));l.push(d)}return V.waitFor(l).next(()=>a.apply(o)).next(()=>n.localDocuments.getLocalViewOfDocuments(o,u,f)).next(()=>u)}).then(o=>(n.Ts=s,o))}function jv(e,t,n){let r=pt(),s=pt();return n.forEach(o=>r=r.add(o)),t.getEntries(e,r).next(o=>{let a=dn();return n.forEach((l,u)=>{const f=o.get(l);u.isFoundDocument()!==f.isFoundDocument()&&(s=s.add(l)),u.isNoDocument()&&u.version.isEqual(st.min())?(t.removeEntry(l,u.readTime),a=a.insert(l,u)):!f.isValidDocument()||u.version.compareTo(f.version)>0||u.version.compareTo(f.version)===0&&f.hasPendingWrites?(t.addEntry(u),a=a.insert(l,u)):K(Fa,"Ignoring outdated watch update for ",l,". Current version:",f.version," Watch version:",u.version)}),{Vs:a,fs:s}})}function qv(e,t){const n=dt(e);return n.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return n.Hr.getTargetData(r,t).next(o=>o?(s=o,V.resolve(s)):n.Hr.allocateTargetId(r).next(a=>(s=new rn(t,a,"TargetPurposeListen",r.currentSequenceNumber),n.Hr.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=n.Ts.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(n.Ts=n.Ts.insert(r.targetId,r),n.Is.set(t,r.targetId)),r})}async function ea(e,t,n){const r=dt(e),s=r.Ts.get(t),o=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",o,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!yr(a))throw a;K(Fa,`Failed to update sequence numbers for target ${t}: ${a}`)}r.Ts=r.Ts.remove(t),r.Is.delete(s.target)}function nu(e,t,n){const r=dt(e);let s=st.min(),o=pt();return r.persistence.runTransaction("Execute query","readwrite",a=>function(u,f,d){const m=dt(u),A=m.Is.get(d);return A!==void 0?V.resolve(m.Ts.get(A)):m.Hr.getTargetData(f,d)}(r,a,Oe(t)).next(l=>{if(l)return s=l.lastLimboFreeSnapshotVersion,r.Hr.getMatchingKeysForTargetId(a,l.targetId).next(u=>{o=u})}).next(()=>r.Ps.getDocumentsMatchingQuery(a,t,n?s:st.min(),n?o:pt())).next(l=>(Hv(r,Oy(t),l),{documents:l,gs:o})))}function Hv(e,t,n){let r=e.Es.get(t)||st.min();n.forEach((s,o)=>{o.readTime.compareTo(r)>0&&(r=o.readTime)}),e.Es.set(t,r)}class ru{constructor(){this.activeTargetIds=By()}Ds(t){this.activeTargetIds=this.activeTargetIds.add(t)}vs(t){this.activeTargetIds=this.activeTargetIds.delete(t)}bs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class zv{constructor(){this.ho=new ru,this.Po={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,n,r){}addLocalQueryTarget(t,n=!0){return n&&this.ho.Ds(t),this.Po[t]||"not-current"}updateQueryState(t,n,r){this.Po[t]=n}removeLocalQueryTarget(t){this.ho.vs(t)}isLocalQueryTarget(t){return this.ho.activeTargetIds.has(t)}clearQueryState(t){delete this.Po[t]}getAllActiveQueryTargets(){return this.ho.activeTargetIds}isActiveQueryTarget(t){return this.ho.activeTargetIds.has(t)}start(){return this.ho=new ru,Promise.resolve()}handleUserChange(t,n,r){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kv{To(t){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const su="ConnectivityMonitor";class iu{constructor(){this.Io=()=>this.Eo(),this.Ao=()=>this.Ro(),this.Vo=[],this.mo()}To(t){this.Vo.push(t)}shutdown(){window.removeEventListener("online",this.Io),window.removeEventListener("offline",this.Ao)}mo(){window.addEventListener("online",this.Io),window.addEventListener("offline",this.Ao)}Eo(){K(su,"Network connectivity changed: AVAILABLE");for(const t of this.Vo)t(0)}Ro(){K(su,"Network connectivity changed: UNAVAILABLE");for(const t of this.Vo)t(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let qs=null;function na(){return qs===null?qs=function(){return 268435456+Math.round(2147483648*Math.random())}():qs++,"0x"+qs.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wo="RestConnection",Gv={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class Wv{get fo(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const n=t.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.po=n+"://"+t.host,this.yo=`projects/${r}/databases/${s}`,this.wo=this.databaseId.database===ui?`project_id=${r}`:`project_id=${r}&database_id=${s}`}So(t,n,r,s,o){const a=na(),l=this.bo(t,n.toUriEncodedString());K(wo,`Sending RPC '${t}' ${a}:`,l,r);const u={"google-cloud-resource-prefix":this.yo,"x-goog-request-params":this.wo};return this.Do(u,s,o),this.vo(t,l,u,r).then(f=>(K(wo,`Received RPC '${t}' ${a}: `,f),f),f=>{throw lr(wo,`RPC '${t}' ${a} failed with error: `,f,"url: ",l,"request:",r),f})}Co(t,n,r,s,o,a){return this.So(t,n,r,s,o)}Do(t,n,r){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+_r}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((s,o)=>t[o]=s),r&&r.headers.forEach((s,o)=>t[o]=s)}bo(t,n){const r=Gv[t];return`${this.po}/v1/${n}:${r}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qv{constructor(t){this.Fo=t.Fo,this.Mo=t.Mo}xo(t){this.Oo=t}No(t){this.Bo=t}Lo(t){this.ko=t}onMessage(t){this.qo=t}close(){this.Mo()}send(t){this.Fo(t)}Qo(){this.Oo()}$o(){this.Bo()}Uo(t){this.ko(t)}Ko(t){this.qo(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yt="WebChannelConnection";class Xv extends Wv{constructor(t){super(t),this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}vo(t,n,r,s){const o=na();return new Promise((a,l)=>{const u=new Bh;u.setWithCredentials(!0),u.listenOnce($h.COMPLETE,()=>{try{switch(u.getLastErrorCode()){case Ws.NO_ERROR:const d=u.getResponseJson();K(Yt,`XHR for RPC '${t}' ${o} received:`,JSON.stringify(d)),a(d);break;case Ws.TIMEOUT:K(Yt,`RPC '${t}' ${o} timed out`),l(new tt(j.DEADLINE_EXCEEDED,"Request time out"));break;case Ws.HTTP_ERROR:const m=u.getStatus();if(K(Yt,`RPC '${t}' ${o} failed with status:`,m,"response text:",u.getResponseText()),m>0){let A=u.getResponseJson();Array.isArray(A)&&(A=A[0]);const C=A==null?void 0:A.error;if(C&&C.status&&C.message){const x=function($){const Y=$.toLowerCase().replace(/_/g,"-");return Object.values(j).indexOf(Y)>=0?Y:j.UNKNOWN}(C.status);l(new tt(x,C.message))}else l(new tt(j.UNKNOWN,"Server responded with status "+u.getStatus()))}else l(new tt(j.UNAVAILABLE,"Connection failed."));break;default:lt()}}finally{K(Yt,`RPC '${t}' ${o} completed.`)}});const f=JSON.stringify(s);K(Yt,`RPC '${t}' ${o} sending request:`,s),u.send(n,"POST",f,r,15)})}Wo(t,n,r){const s=na(),o=[this.po,"/","google.firestore.v1.Firestore","/",t,"/channel"],a=Hh(),l=qh(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},f=this.longPollingOptions.timeoutSeconds;f!==void 0&&(u.longPollingTimeout=Math.round(1e3*f)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Do(u.initMessageHeaders,n,r),u.encodeInitMessageHeaders=!0;const d=o.join("");K(Yt,`Creating RPC '${t}' stream ${s}: ${d}`,u);const m=a.createWebChannel(d,u);let A=!1,C=!1;const x=new Qv({Fo:$=>{C?K(Yt,`Not sending because RPC '${t}' stream ${s} is closed:`,$):(A||(K(Yt,`Opening RPC '${t}' stream ${s} transport.`),m.open(),A=!0),K(Yt,`RPC '${t}' stream ${s} sending:`,$),m.send($))},Mo:()=>m.close()}),L=($,Y,z)=>{$.listen(Y,G=>{try{z(G)}catch(N){setTimeout(()=>{throw N},0)}})};return L(m,Ur.EventType.OPEN,()=>{C||(K(Yt,`RPC '${t}' stream ${s} transport opened.`),x.Qo())}),L(m,Ur.EventType.CLOSE,()=>{C||(C=!0,K(Yt,`RPC '${t}' stream ${s} transport closed`),x.Uo())}),L(m,Ur.EventType.ERROR,$=>{C||(C=!0,lr(Yt,`RPC '${t}' stream ${s} transport errored:`,$),x.Uo(new tt(j.UNAVAILABLE,"The operation could not be completed")))}),L(m,Ur.EventType.MESSAGE,$=>{var Y;if(!C){const z=$.data[0];St(!!z);const G=z,N=(G==null?void 0:G.error)||((Y=G[0])===null||Y===void 0?void 0:Y.error);if(N){K(Yt,`RPC '${t}' stream ${s} received error:`,N);const W=N.status;let X=function(v){const I=xt[v];if(I!==void 0)return mf(I)}(W),E=N.message;X===void 0&&(X=j.INTERNAL,E="Unknown error status: "+W+" with message "+N.message),C=!0,x.Uo(new tt(X,E)),m.close()}else K(Yt,`RPC '${t}' stream ${s} received:`,z),x.Ko(z)}}),L(l,jh.STAT_EVENT,$=>{$.stat===jo.PROXY?K(Yt,`RPC '${t}' stream ${s} detected buffering proxy`):$.stat===jo.NOPROXY&&K(Yt,`RPC '${t}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{x.$o()},0),x}}function Ao(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pf(e){return new rv(e,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vf{constructor(t,n,r=1e3,s=1.5,o=6e4){this.Ti=t,this.timerId=n,this.Go=r,this.zo=s,this.jo=o,this.Ho=0,this.Jo=null,this.Yo=Date.now(),this.reset()}reset(){this.Ho=0}Zo(){this.Ho=this.jo}Xo(t){this.cancel();const n=Math.floor(this.Ho+this.e_()),r=Math.max(0,Date.now()-this.Yo),s=Math.max(0,n-r);s>0&&K("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ho} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.Jo=this.Ti.enqueueAfterDelay(this.timerId,s,()=>(this.Yo=Date.now(),t())),this.Ho*=this.zo,this.Ho<this.Go&&(this.Ho=this.Go),this.Ho>this.jo&&(this.Ho=this.jo)}t_(){this.Jo!==null&&(this.Jo.skipDelay(),this.Jo=null)}cancel(){this.Jo!==null&&(this.Jo.cancel(),this.Jo=null)}e_(){return(Math.random()-.5)*this.Ho}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ou="PersistentStream";class Yv{constructor(t,n,r,s,o,a,l,u){this.Ti=t,this.n_=r,this.r_=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.i_=0,this.s_=null,this.o_=null,this.stream=null,this.__=0,this.a_=new Vf(t,n)}u_(){return this.state===1||this.state===5||this.c_()}c_(){return this.state===2||this.state===3}start(){this.__=0,this.state!==4?this.auth():this.l_()}async stop(){this.u_()&&await this.close(0)}h_(){this.state=0,this.a_.reset()}P_(){this.c_()&&this.s_===null&&(this.s_=this.Ti.enqueueAfterDelay(this.n_,6e4,()=>this.T_()))}I_(t){this.E_(),this.stream.send(t)}async T_(){if(this.c_())return this.close(0)}E_(){this.s_&&(this.s_.cancel(),this.s_=null)}d_(){this.o_&&(this.o_.cancel(),this.o_=null)}async close(t,n){this.E_(),this.d_(),this.a_.cancel(),this.i_++,t!==4?this.a_.reset():n&&n.code===j.RESOURCE_EXHAUSTED?(Ke(n.toString()),Ke("Using maximum backoff delay to prevent overloading the backend."),this.a_.Zo()):n&&n.code===j.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.A_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.Lo(n)}A_(){}auth(){this.state=1;const t=this.R_(this.i_),n=this.i_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.i_===n&&this.V_(r,s)},r=>{t(()=>{const s=new tt(j.UNKNOWN,"Fetching auth token failed: "+r.message);return this.m_(s)})})}V_(t,n){const r=this.R_(this.i_);this.stream=this.f_(t,n),this.stream.xo(()=>{r(()=>this.listener.xo())}),this.stream.No(()=>{r(()=>(this.state=2,this.o_=this.Ti.enqueueAfterDelay(this.r_,1e4,()=>(this.c_()&&(this.state=3),Promise.resolve())),this.listener.No()))}),this.stream.Lo(s=>{r(()=>this.m_(s))}),this.stream.onMessage(s=>{r(()=>++this.__==1?this.g_(s):this.onNext(s))})}l_(){this.state=5,this.a_.Xo(async()=>{this.state=0,this.start()})}m_(t){return K(ou,`close with error: ${t}`),this.stream=null,this.close(4,t)}R_(t){return n=>{this.Ti.enqueueAndForget(()=>this.i_===t?n():(K(ou,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Jv extends Yv{constructor(t,n,r,s,o,a){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,s,a),this.serializer=o}f_(t,n){return this.connection.Wo("Listen",t,n)}g_(t){return this.onNext(t)}onNext(t){this.a_.reset();const n=lv(this.serializer,t),r=function(o){if(!("targetChange"in o))return st.min();const a=o.targetChange;return a.targetIds&&a.targetIds.length?st.min():a.readTime?sr(a.readTime):st.min()}(t);return this.listener.p_(n,r)}y_(t){const n={};n.database=Jc(this.serializer),n.addTarget=function(o,a){let l;const u=a.target;if(l=Qo(u)?{documents:cv(o,u)}:{query:uv(o,u).ht},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=iv(o,a.resumeToken);const f=Zo(o,a.expectedCount);f!==null&&(l.expectedCount=f)}else if(a.snapshotVersion.compareTo(st.min())>0){l.readTime=sv(o,a.snapshotVersion.toTimestamp());const f=Zo(o,a.expectedCount);f!==null&&(l.expectedCount=f)}return l}(this.serializer,t);const r=fv(this.serializer,t);r&&(n.labels=r),this.I_(n)}w_(t){const n={};n.database=Jc(this.serializer),n.removeTarget=t,this.I_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zv{}class tE extends Zv{constructor(t,n,r,s){super(),this.authCredentials=t,this.appCheckCredentials=n,this.connection=r,this.serializer=s,this.F_=!1}M_(){if(this.F_)throw new tt(j.FAILED_PRECONDITION,"The client has already been terminated.")}So(t,n,r,s){return this.M_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.So(t,ta(n,r),s,o,a)).catch(o=>{throw o.name==="FirebaseError"?(o.code===j.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new tt(j.UNKNOWN,o.toString())})}Co(t,n,r,s,o){return this.M_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,l])=>this.connection.Co(t,ta(n,r),s,a,l,o)).catch(a=>{throw a.name==="FirebaseError"?(a.code===j.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new tt(j.UNKNOWN,a.toString())})}terminate(){this.F_=!0,this.connection.terminate()}}class eE{constructor(t,n){this.asyncQueue=t,this.onlineStateHandler=n,this.state="Unknown",this.x_=0,this.O_=null,this.N_=!0}B_(){this.x_===0&&(this.L_("Unknown"),this.O_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.O_=null,this.k_("Backend didn't respond within 10 seconds."),this.L_("Offline"),Promise.resolve())))}q_(t){this.state==="Online"?this.L_("Unknown"):(this.x_++,this.x_>=1&&(this.Q_(),this.k_(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.L_("Offline")))}set(t){this.Q_(),this.x_=0,t==="Online"&&(this.N_=!1),this.L_(t)}L_(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}k_(t){const n=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.N_?(Ke(n),this.N_=!1):K("OnlineStateTracker",n)}Q_(){this.O_!==null&&(this.O_.cancel(),this.O_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dr="RemoteStore";class nE{constructor(t,n,r,s,o){this.localStore=t,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.U_=[],this.K_=new Map,this.W_=new Set,this.G_=[],this.z_=o,this.z_.To(a=>{r.enqueueAndForget(async()=>{_s(this)&&(K(dr,"Restarting streams for network reachability change."),await async function(u){const f=dt(u);f.W_.add(4),await ms(f),f.j_.set("Unknown"),f.W_.delete(4),await $i(f)}(this))})}),this.j_=new eE(r,s)}}async function $i(e){if(_s(e))for(const t of e.G_)await t(!0)}async function ms(e){for(const t of e.G_)await t(!1)}function Df(e,t){const n=dt(e);n.K_.has(t.targetId)||(n.K_.set(t.targetId,t),ja(n)?$a(n):vr(n).c_()&&Ba(n,t))}function Ua(e,t){const n=dt(e),r=vr(n);n.K_.delete(t),r.c_()&&xf(n,t),n.K_.size===0&&(r.c_()?r.P_():_s(n)&&n.j_.set("Unknown"))}function Ba(e,t){if(e.H_.Ne(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(st.min())>0){const n=e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(n)}vr(e).y_(t)}function xf(e,t){e.H_.Ne(t),vr(e).w_(t)}function $a(e){e.H_=new Zy({getRemoteKeysForTarget:t=>e.remoteSyncer.getRemoteKeysForTarget(t),lt:t=>e.K_.get(t)||null,it:()=>e.datastore.serializer.databaseId}),vr(e).start(),e.j_.B_()}function ja(e){return _s(e)&&!vr(e).u_()&&e.K_.size>0}function _s(e){return dt(e).W_.size===0}function Nf(e){e.H_=void 0}async function rE(e){e.j_.set("Online")}async function sE(e){e.K_.forEach((t,n)=>{Ba(e,t)})}async function iE(e,t){Nf(e),ja(e)?(e.j_.q_(t),$a(e)):e.j_.set("Unknown")}async function oE(e,t,n){if(e.j_.set("Online"),t instanceof yf&&t.state===2&&t.cause)try{await async function(s,o){const a=o.cause;for(const l of o.targetIds)s.K_.has(l)&&(await s.remoteSyncer.rejectListen(l,a),s.K_.delete(l),s.H_.removeTarget(l))}(e,t)}catch(r){K(dr,"Failed to remove targets %s: %s ",t.targetIds.join(","),r),await au(e,r)}else if(t instanceof Ys?e.H_.We(t):t instanceof _f?e.H_.Ze(t):e.H_.je(t),!n.isEqual(st.min()))try{const r=await Rf(e.localStore);n.compareTo(r)>=0&&await function(o,a){const l=o.H_.ot(a);return l.targetChanges.forEach((u,f)=>{if(u.resumeToken.approximateByteSize()>0){const d=o.K_.get(f);d&&o.K_.set(f,d.withResumeToken(u.resumeToken,a))}}),l.targetMismatches.forEach((u,f)=>{const d=o.K_.get(u);if(!d)return;o.K_.set(u,d.withResumeToken(Kt.EMPTY_BYTE_STRING,d.snapshotVersion)),xf(o,u);const m=new rn(d.target,u,f,d.sequenceNumber);Ba(o,m)}),o.remoteSyncer.applyRemoteEvent(l)}(e,n)}catch(r){K(dr,"Failed to raise snapshot:",r),await au(e,r)}}async function au(e,t,n){if(!yr(t))throw t;e.W_.add(1),await ms(e),e.j_.set("Offline"),n||(n=()=>Rf(e.localStore)),e.asyncQueue.enqueueRetryable(async()=>{K(dr,"Retrying IndexedDB access"),await n(),e.W_.delete(1),await $i(e)})}async function lu(e,t){const n=dt(e);n.asyncQueue.verifyOperationInProgress(),K(dr,"RemoteStore received new credentials");const r=_s(n);n.W_.add(3),await ms(n),r&&n.j_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(t),n.W_.delete(3),await $i(n)}async function aE(e,t){const n=dt(e);t?(n.W_.delete(2),await $i(n)):t||(n.W_.add(2),await ms(n),n.j_.set("Unknown"))}function vr(e){return e.J_||(e.J_=function(n,r,s){const o=dt(n);return o.M_(),new Jv(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(e.datastore,e.asyncQueue,{xo:rE.bind(null,e),No:sE.bind(null,e),Lo:iE.bind(null,e),p_:oE.bind(null,e)}),e.G_.push(async t=>{t?(e.J_.h_(),ja(e)?$a(e):e.j_.set("Unknown")):(await e.J_.stop(),Nf(e))})),e.J_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qa{constructor(t,n,r,s,o){this.asyncQueue=t,this.timerId=n,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new xn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,n,r,s,o){const a=Date.now()+r,l=new qa(t,n,a,s,o);return l.start(r),l}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new tt(j.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Of(e,t){if(Ke("AsyncQueue",`${t}: ${e}`),yr(e))return new tt(j.UNAVAILABLE,`${t}: ${e}`);throw e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ir{static emptySet(t){return new ir(t.comparator)}constructor(t){this.comparator=t?(n,r)=>t(n,r)||nt.comparator(n.key,r.key):(n,r)=>nt.comparator(n.key,r.key),this.keyedMap=Br(),this.sortedSet=new Dt(this.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const n=this.keyedMap.get(t);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((n,r)=>(t(n),!1))}add(t){const n=this.delete(t.key);return n.copy(n.keyedMap.insert(t.key,t),n.sortedSet.insert(t,null))}delete(t){const n=this.get(t);return n?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(n)):this}isEqual(t){if(!(t instanceof ir)||this.size!==t.size)return!1;const n=this.sortedSet.getIterator(),r=t.sortedSet.getIterator();for(;n.hasNext();){const s=n.getNext().key,o=r.getNext().key;if(!s.isEqual(o))return!1}return!0}toString(){const t=[];return this.forEach(n=>{t.push(n.toString())}),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,n){const r=new ir;return r.comparator=this.comparator,r.keyedMap=t,r.sortedSet=n,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cu{constructor(){this.Z_=new Dt(nt.comparator)}track(t){const n=t.doc.key,r=this.Z_.get(n);r?t.type!==0&&r.type===3?this.Z_=this.Z_.insert(n,t):t.type===3&&r.type!==1?this.Z_=this.Z_.insert(n,{type:r.type,doc:t.doc}):t.type===2&&r.type===2?this.Z_=this.Z_.insert(n,{type:2,doc:t.doc}):t.type===2&&r.type===0?this.Z_=this.Z_.insert(n,{type:0,doc:t.doc}):t.type===1&&r.type===0?this.Z_=this.Z_.remove(n):t.type===1&&r.type===2?this.Z_=this.Z_.insert(n,{type:1,doc:r.doc}):t.type===0&&r.type===1?this.Z_=this.Z_.insert(n,{type:2,doc:t.doc}):lt():this.Z_=this.Z_.insert(n,t)}X_(){const t=[];return this.Z_.inorderTraversal((n,r)=>{t.push(r)}),t}}class pr{constructor(t,n,r,s,o,a,l,u,f){this.query=t,this.docs=n,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=o,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=u,this.hasCachedResults=f}static fromInitialDocuments(t,n,r,s,o){const a=[];return n.forEach(l=>{a.push({type:0,doc:l})}),new pr(t,n,ir.emptySet(n),a,r,s,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&ki(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const n=this.docChanges,r=t.docChanges;if(n.length!==r.length)return!1;for(let s=0;s<n.length;s++)if(n[s].type!==r[s].type||!n[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lE{constructor(){this.ea=void 0,this.ta=[]}na(){return this.ta.some(t=>t.ra())}}class cE{constructor(){this.queries=uu(),this.onlineState="Unknown",this.ia=new Set}terminate(){(function(n,r){const s=dt(n),o=s.queries;s.queries=uu(),o.forEach((a,l)=>{for(const u of l.ta)u.onError(r)})})(this,new tt(j.ABORTED,"Firestore shutting down"))}}function uu(){return new Fn(e=>af(e),ki)}async function uE(e,t){const n=dt(e);let r=3;const s=t.query;let o=n.queries.get(s);o?!o.na()&&t.ra()&&(r=2):(o=new lE,r=t.ra()?0:1);try{switch(r){case 0:o.ea=await n.onListen(s,!0);break;case 1:o.ea=await n.onListen(s,!1);break;case 2:await n.onFirstRemoteStoreListen(s)}}catch(a){const l=Of(a,`Initialization of query '${Kn(t.query)}' failed`);return void t.onError(l)}n.queries.set(s,o),o.ta.push(t),t.sa(n.onlineState),o.ea&&t.oa(o.ea)&&Ha(n)}async function hE(e,t){const n=dt(e),r=t.query;let s=3;const o=n.queries.get(r);if(o){const a=o.ta.indexOf(t);a>=0&&(o.ta.splice(a,1),o.ta.length===0?s=t.ra()?0:1:!o.na()&&t.ra()&&(s=2))}switch(s){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function fE(e,t){const n=dt(e);let r=!1;for(const s of t){const o=s.query,a=n.queries.get(o);if(a){for(const l of a.ta)l.oa(s)&&(r=!0);a.ea=s}}r&&Ha(n)}function dE(e,t,n){const r=dt(e),s=r.queries.get(t);if(s)for(const o of s.ta)o.onError(n);r.queries.delete(t)}function Ha(e){e.ia.forEach(t=>{t.next()})}var ra,hu;(hu=ra||(ra={}))._a="default",hu.Cache="cache";class pE{constructor(t,n,r){this.query=t,this.aa=n,this.ua=!1,this.ca=null,this.onlineState="Unknown",this.options=r||{}}oa(t){if(!this.options.includeMetadataChanges){const r=[];for(const s of t.docChanges)s.type!==3&&r.push(s);t=new pr(t.query,t.docs,t.oldDocs,r,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let n=!1;return this.ua?this.la(t)&&(this.aa.next(t),n=!0):this.ha(t,this.onlineState)&&(this.Pa(t),n=!0),this.ca=t,n}onError(t){this.aa.error(t)}sa(t){this.onlineState=t;let n=!1;return this.ca&&!this.ua&&this.ha(this.ca,t)&&(this.Pa(this.ca),n=!0),n}ha(t,n){if(!t.fromCache||!this.ra())return!0;const r=n!=="Offline";return(!this.options.Ta||!r)&&(!t.docs.isEmpty()||t.hasCachedResults||n==="Offline")}la(t){if(t.docChanges.length>0)return!0;const n=this.ca&&this.ca.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}Pa(t){t=pr.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.ua=!0,this.aa.next(t)}ra(){return this.options.source!==ra.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mf{constructor(t){this.key=t}}class kf{constructor(t){this.key=t}}class gE{constructor(t,n){this.query=t,this.fa=n,this.ga=null,this.hasCachedResults=!1,this.current=!1,this.pa=pt(),this.mutatedKeys=pt(),this.ya=lf(t),this.wa=new ir(this.ya)}get Sa(){return this.fa}ba(t,n){const r=n?n.Da:new cu,s=n?n.wa:this.wa;let o=n?n.mutatedKeys:this.mutatedKeys,a=s,l=!1;const u=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,f=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(t.inorderTraversal((d,m)=>{const A=s.get(d),C=Li(this.query,m)?m:null,x=!!A&&this.mutatedKeys.has(A.key),L=!!C&&(C.hasLocalMutations||this.mutatedKeys.has(C.key)&&C.hasCommittedMutations);let $=!1;A&&C?A.data.isEqual(C.data)?x!==L&&(r.track({type:3,doc:C}),$=!0):this.va(A,C)||(r.track({type:2,doc:C}),$=!0,(u&&this.ya(C,u)>0||f&&this.ya(C,f)<0)&&(l=!0)):!A&&C?(r.track({type:0,doc:C}),$=!0):A&&!C&&(r.track({type:1,doc:A}),$=!0,(u||f)&&(l=!0)),$&&(C?(a=a.add(C),o=L?o.add(d):o.delete(d)):(a=a.delete(d),o=o.delete(d)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const d=this.query.limitType==="F"?a.last():a.first();a=a.delete(d.key),o=o.delete(d.key),r.track({type:1,doc:d})}return{wa:a,Da:r,ls:l,mutatedKeys:o}}va(t,n){return t.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(t,n,r,s){const o=this.wa;this.wa=t.wa,this.mutatedKeys=t.mutatedKeys;const a=t.Da.X_();a.sort((d,m)=>function(C,x){const L=$=>{switch($){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return lt()}};return L(C)-L(x)}(d.type,m.type)||this.ya(d.doc,m.doc)),this.Ca(r),s=s!=null&&s;const l=n&&!s?this.Fa():[],u=this.pa.size===0&&this.current&&!s?1:0,f=u!==this.ga;return this.ga=u,a.length!==0||f?{snapshot:new pr(this.query,t.wa,o,a,t.mutatedKeys,u===0,f,!1,!!r&&r.resumeToken.approximateByteSize()>0),Ma:l}:{Ma:l}}sa(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({wa:this.wa,Da:new cu,mutatedKeys:this.mutatedKeys,ls:!1},!1)):{Ma:[]}}xa(t){return!this.fa.has(t)&&!!this.wa.has(t)&&!this.wa.get(t).hasLocalMutations}Ca(t){t&&(t.addedDocuments.forEach(n=>this.fa=this.fa.add(n)),t.modifiedDocuments.forEach(n=>{}),t.removedDocuments.forEach(n=>this.fa=this.fa.delete(n)),this.current=t.current)}Fa(){if(!this.current)return[];const t=this.pa;this.pa=pt(),this.wa.forEach(r=>{this.xa(r.key)&&(this.pa=this.pa.add(r.key))});const n=[];return t.forEach(r=>{this.pa.has(r)||n.push(new kf(r))}),this.pa.forEach(r=>{t.has(r)||n.push(new Mf(r))}),n}Oa(t){this.fa=t.gs,this.pa=pt();const n=this.ba(t.documents);return this.applyChanges(n,!0)}Na(){return pr.fromInitialDocuments(this.query,this.wa,this.mutatedKeys,this.ga===0,this.hasCachedResults)}}const za="SyncEngine";class mE{constructor(t,n,r){this.query=t,this.targetId=n,this.view=r}}class _E{constructor(t){this.key=t,this.Ba=!1}}class yE{constructor(t,n,r,s,o,a){this.localStore=t,this.remoteStore=n,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.La={},this.ka=new Fn(l=>af(l),ki),this.qa=new Map,this.Qa=new Set,this.$a=new Dt(nt.comparator),this.Ua=new Map,this.Ka=new Ma,this.Wa={},this.Ga=new Map,this.za=fr.Kn(),this.onlineState="Unknown",this.ja=void 0}get isPrimaryClient(){return this.ja===!0}}async function vE(e,t,n=!0){const r=$f(e);let s;const o=r.ka.get(t);return o?(r.sharedClientState.addLocalQueryTarget(o.targetId),s=o.view.Na()):s=await Lf(r,t,n,!0),s}async function EE(e,t){const n=$f(e);await Lf(n,t,!0,!1)}async function Lf(e,t,n,r){const s=await qv(e.localStore,Oe(t)),o=s.targetId,a=e.sharedClientState.addLocalQueryTarget(o,n);let l;return r&&(l=await TE(e,t,o,a==="current",s.resumeToken)),e.isPrimaryClient&&n&&Df(e.remoteStore,s),l}async function TE(e,t,n,r,s){e.Ha=(m,A,C)=>async function(L,$,Y,z){let G=$.view.ba(Y);G.ls&&(G=await nu(L.localStore,$.query,!1).then(({documents:E})=>$.view.ba(E,G)));const N=z&&z.targetChanges.get($.targetId),W=z&&z.targetMismatches.get($.targetId)!=null,X=$.view.applyChanges(G,L.isPrimaryClient,N,W);return du(L,$.targetId,X.Ma),X.snapshot}(e,m,A,C);const o=await nu(e.localStore,t,!0),a=new gE(t,o.gs),l=a.ba(o.documents),u=gs.createSynthesizedTargetChangeForCurrentChange(n,r&&e.onlineState!=="Offline",s),f=a.applyChanges(l,e.isPrimaryClient,u);du(e,n,f.Ma);const d=new mE(t,n,a);return e.ka.set(t,d),e.qa.has(n)?e.qa.get(n).push(t):e.qa.set(n,[t]),f.snapshot}async function IE(e,t,n){const r=dt(e),s=r.ka.get(t),o=r.qa.get(s.targetId);if(o.length>1)return r.qa.set(s.targetId,o.filter(a=>!ki(a,t))),void r.ka.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await ea(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),n&&Ua(r.remoteStore,s.targetId),sa(r,s.targetId)}).catch(Di)):(sa(r,s.targetId),await ea(r.localStore,s.targetId,!0))}async function wE(e,t){const n=dt(e),r=n.ka.get(t),s=n.qa.get(r.targetId);n.isPrimaryClient&&s.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Ua(n.remoteStore,r.targetId))}async function Ff(e,t){const n=dt(e);try{const r=await $v(n.localStore,t);t.targetChanges.forEach((s,o)=>{const a=n.Ua.get(o);a&&(St(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?a.Ba=!0:s.modifiedDocuments.size>0?St(a.Ba):s.removedDocuments.size>0&&(St(a.Ba),a.Ba=!1))}),await Bf(n,r,t)}catch(r){await Di(r)}}function fu(e,t,n){const r=dt(e);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const s=[];r.ka.forEach((o,a)=>{const l=a.view.sa(t);l.snapshot&&s.push(l.snapshot)}),function(a,l){const u=dt(a);u.onlineState=l;let f=!1;u.queries.forEach((d,m)=>{for(const A of m.ta)A.sa(l)&&(f=!0)}),f&&Ha(u)}(r.eventManager,t),s.length&&r.La.p_(s),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function AE(e,t,n){const r=dt(e);r.sharedClientState.updateQueryState(t,"rejected",n);const s=r.Ua.get(t),o=s&&s.key;if(o){let a=new Dt(nt.comparator);a=a.insert(o,ee.newNoDocument(o,st.min()));const l=pt().add(o),u=new Bi(st.min(),new Map,new Dt(ct),a,l);await Ff(r,u),r.$a=r.$a.remove(o),r.Ua.delete(t),Ka(r)}else await ea(r.localStore,t,!1).then(()=>sa(r,t,n)).catch(Di)}function sa(e,t,n=null){e.sharedClientState.removeLocalQueryTarget(t);for(const r of e.qa.get(t))e.ka.delete(r),n&&e.La.Ja(r,n);e.qa.delete(t),e.isPrimaryClient&&e.Ka.br(t).forEach(r=>{e.Ka.containsKey(r)||Uf(e,r)})}function Uf(e,t){e.Qa.delete(t.path.canonicalString());const n=e.$a.get(t);n!==null&&(Ua(e.remoteStore,n),e.$a=e.$a.remove(t),e.Ua.delete(n),Ka(e))}function du(e,t,n){for(const r of n)r instanceof Mf?(e.Ka.addReference(r.key,t),bE(e,r)):r instanceof kf?(K(za,"Document no longer in limbo: "+r.key),e.Ka.removeReference(r.key,t),e.Ka.containsKey(r.key)||Uf(e,r.key)):lt()}function bE(e,t){const n=t.key,r=n.path.canonicalString();e.$a.get(n)||e.Qa.has(r)||(K(za,"New document in limbo: "+n),e.Qa.add(r),Ka(e))}function Ka(e){for(;e.Qa.size>0&&e.$a.size<e.maxConcurrentLimboResolutions;){const t=e.Qa.values().next().value;e.Qa.delete(t);const n=new nt(Pt.fromString(t)),r=e.za.next();e.Ua.set(r,new _E(n)),e.$a=e.$a.insert(n,r),Df(e.remoteStore,new rn(Oe(of(n.path)),r,"TargetPurposeLimboResolution",xi.ae))}}async function Bf(e,t,n){const r=dt(e),s=[],o=[],a=[];r.ka.isEmpty()||(r.ka.forEach((l,u)=>{a.push(r.Ha(u,t,n).then(f=>{var d;if((f||n)&&r.isPrimaryClient){const m=f?!f.fromCache:(d=n==null?void 0:n.targetChanges.get(u.targetId))===null||d===void 0?void 0:d.current;r.sharedClientState.updateQueryState(u.targetId,m?"current":"not-current")}if(f){s.push(f);const m=La.Yi(u.targetId,f);o.push(m)}}))}),await Promise.all(a),r.La.p_(s),await async function(u,f){const d=dt(u);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>V.forEach(f,A=>V.forEach(A.Hi,C=>d.persistence.referenceDelegate.addReference(m,A.targetId,C)).next(()=>V.forEach(A.Ji,C=>d.persistence.referenceDelegate.removeReference(m,A.targetId,C)))))}catch(m){if(!yr(m))throw m;K(Fa,"Failed to update sequence numbers: "+m)}for(const m of f){const A=m.targetId;if(!m.fromCache){const C=d.Ts.get(A),x=C.snapshotVersion,L=C.withLastLimboFreeSnapshotVersion(x);d.Ts=d.Ts.insert(A,L)}}}(r.localStore,o))}async function SE(e,t){const n=dt(e);if(!n.currentUser.isEqual(t)){K(za,"User change. New user:",t.toKey());const r=await Cf(n.localStore,t);n.currentUser=t,function(o,a){o.Ga.forEach(l=>{l.forEach(u=>{u.reject(new tt(j.CANCELLED,a))})}),o.Ga.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(t,r.removedBatchIds,r.addedBatchIds),await Bf(n,r.Rs)}}function CE(e,t){const n=dt(e),r=n.Ua.get(t);if(r&&r.Ba)return pt().add(r.key);{let s=pt();const o=n.qa.get(t);if(!o)return s;for(const a of o){const l=n.ka.get(a);s=s.unionWith(l.view.Sa)}return s}}function $f(e){const t=dt(e);return t.remoteStore.remoteSyncer.applyRemoteEvent=Ff.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=CE.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=AE.bind(null,t),t.La.p_=fE.bind(null,t.eventManager),t.La.Ja=dE.bind(null,t.eventManager),t}class mi{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=Pf(t.databaseInfo.databaseId),this.sharedClientState=this.Za(t),this.persistence=this.Xa(t),await this.persistence.start(),this.localStore=this.eu(t),this.gcScheduler=this.tu(t,this.localStore),this.indexBackfillerScheduler=this.nu(t,this.localStore)}tu(t,n){return null}nu(t,n){return null}eu(t){return Bv(this.persistence,new Lv,t.initialUser,this.serializer)}Xa(t){return new Sf(ka.ri,this.serializer)}Za(t){return new zv}async terminate(){var t,n;(t=this.gcScheduler)===null||t===void 0||t.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}mi.provider={build:()=>new mi};class RE extends mi{constructor(t){super(),this.cacheSizeBytes=t}tu(t,n){St(this.persistence.referenceDelegate instanceof gi);const r=this.persistence.referenceDelegate.garbageCollector;return new Iv(r,t.asyncQueue,n)}Xa(t){const n=this.cacheSizeBytes!==void 0?ue.withCacheSize(this.cacheSizeBytes):ue.DEFAULT;return new Sf(r=>gi.ri(r,n),this.serializer)}}class ia{async initialize(t,n){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>fu(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=SE.bind(null,this.syncEngine),await aE(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return function(){return new cE}()}createDatastore(t){const n=Pf(t.databaseInfo.databaseId),r=function(o){return new Xv(o)}(t.databaseInfo);return function(o,a,l,u){return new tE(o,a,l,u)}(t.authCredentials,t.appCheckCredentials,r,n)}createRemoteStore(t){return function(r,s,o,a,l){return new nE(r,s,o,a,l)}(this.localStore,this.datastore,t.asyncQueue,n=>fu(this.syncEngine,n,0),function(){return iu.D()?new iu:new Kv}())}createSyncEngine(t,n){return function(s,o,a,l,u,f,d){const m=new yE(s,o,a,l,u,f);return d&&(m.ja=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,n)}async terminate(){var t,n;await async function(s){const o=dt(s);K(dr,"RemoteStore shutting down."),o.W_.add(5),await ms(o),o.z_.shutdown(),o.j_.set("Unknown")}(this.remoteStore),(t=this.datastore)===null||t===void 0||t.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}ia.provider={build:()=>new ia};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PE{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.iu(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.iu(this.observer.error,t):Ke("Uncaught Error in snapshot listener:",t.toString()))}su(){this.muted=!0}iu(t,n){setTimeout(()=>{this.muted||t(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pn="FirestoreClient";class VE{constructor(t,n,r,s,o){this.authCredentials=t,this.appCheckCredentials=n,this.asyncQueue=r,this.databaseInfo=s,this.user=Jt.UNAUTHENTICATED,this.clientId=ey.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,async a=>{K(pn,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(K(pn,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new xn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(n){const r=Of(n,"Failed to shutdown persistence");t.reject(r)}}),t.promise}}async function bo(e,t){e.asyncQueue.verifyOperationInProgress(),K(pn,"Initializing OfflineComponentProvider");const n=e.configuration;await t.initialize(n);let r=n.initialUser;e.setCredentialChangeListener(async s=>{r.isEqual(s)||(await Cf(t.localStore,s),r=s)}),t.persistence.setDatabaseDeletedListener(()=>e.terminate()),e._offlineComponents=t}async function pu(e,t){e.asyncQueue.verifyOperationInProgress();const n=await DE(e);K(pn,"Initializing OnlineComponentProvider"),await t.initialize(n,e.configuration),e.setCredentialChangeListener(r=>lu(t.remoteStore,r)),e.setAppCheckTokenChangeListener((r,s)=>lu(t.remoteStore,s)),e._onlineComponents=t}async function DE(e){if(!e._offlineComponents)if(e._uninitializedComponentsProvider){K(pn,"Using user provided OfflineComponentProvider");try{await bo(e,e._uninitializedComponentsProvider._offline)}catch(t){const n=t;if(!function(s){return s.name==="FirebaseError"?s.code===j.FAILED_PRECONDITION||s.code===j.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(n))throw n;lr("Error using user provided cache. Falling back to memory cache: "+n),await bo(e,new mi)}}else K(pn,"Using default OfflineComponentProvider"),await bo(e,new RE(void 0));return e._offlineComponents}async function xE(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(K(pn,"Using user provided OnlineComponentProvider"),await pu(e,e._uninitializedComponentsProvider._online)):(K(pn,"Using default OnlineComponentProvider"),await pu(e,new ia))),e._onlineComponents}async function NE(e){const t=await xE(e),n=t.eventManager;return n.onListen=vE.bind(null,t.syncEngine),n.onUnlisten=IE.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=EE.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=wE.bind(null,t.syncEngine),n}function OE(e,t,n={}){const r=new xn;return e.asyncQueue.enqueueAndForget(async()=>function(o,a,l,u,f){const d=new PE({next:A=>{d.su(),a.enqueueAndForget(()=>hE(o,m)),A.fromCache&&u.source==="server"?f.reject(new tt(j.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):f.resolve(A)},error:A=>f.reject(A)}),m=new pE(l,d,{includeMetadataChanges:!0,Ta:!0});return uE(o,m)}(await NE(e),e.asyncQueue,t,n,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jf(e){const t={};return e.timeoutSeconds!==void 0&&(t.timeoutSeconds=e.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gu=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ME(e,t,n){if(!n)throw new tt(j.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function kE(e,t,n,r){if(t===!0&&r===!0)throw new tt(j.INVALID_ARGUMENT,`${e} and ${n} cannot be used together.`)}function mu(e){if(nt.isDocumentKey(e))throw new tt(j.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function LE(e){if(e===void 0)return"undefined";if(e===null)return"null";if(typeof e=="string")return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if(typeof e=="number"||typeof e=="boolean")return""+e;if(typeof e=="object"){if(e instanceof Array)return"an array";{const t=function(r){return r.constructor?r.constructor.name:null}(e);return t?`a custom ${t} object`:"an object"}}return typeof e=="function"?"a function":lt()}function oa(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new tt(j.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=LE(e);throw new tt(j.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qf="firestore.googleapis.com",_u=!0;class yu{constructor(t){var n,r;if(t.host===void 0){if(t.ssl!==void 0)throw new tt(j.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=qf,this.ssl=_u}else this.host=t.host,this.ssl=(n=t.ssl)!==null&&n!==void 0?n:_u;if(this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=bf;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<Ev)throw new tt(j.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}kE("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=jf((r=t.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(o){if(o.timeoutSeconds!==void 0){if(isNaN(o.timeoutSeconds))throw new tt(j.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (must not be NaN)`);if(o.timeoutSeconds<5)throw new tt(j.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (minimum allowed value is 5)`);if(o.timeoutSeconds>30)throw new tt(j.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class Ga{constructor(t,n,r,s){this._authCredentials=t,this._appCheckCredentials=n,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new yu({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new tt(j.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new tt(j.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new yu(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new W_;switch(r.type){case"firstParty":return new J_(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new tt(j.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=gu.get(n);r&&(K("ComponentProvider","Removing Datastore"),gu.delete(n),r.terminate())}(this),Promise.resolve()}}function FE(e,t,n,r={}){var s;const o=(e=oa(e,Ga))._getSettings(),a=Object.assign(Object.assign({},o),{emulatorOptions:e._getEmulatorOptions()}),l=`${t}:${n}`;o.host!==qf&&o.host!==l&&lr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u=Object.assign(Object.assign({},o),{host:l,ssl:!1,emulatorOptions:r});if(!ai(u,a)&&(e._setSettings(u),r.mockUserToken)){let f,d;if(typeof r.mockUserToken=="string")f=r.mockUserToken,d=Jt.MOCK_USER;else{f=Am(r.mockUserToken,(s=e._app)===null||s===void 0?void 0:s.options.projectId);const m=r.mockUserToken.sub||r.mockUserToken.user_id;if(!m)throw new tt(j.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");d=new Jt(m)}e._authCredentials=new Q_(new zh(f,d))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ji{constructor(t,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=t}withConverter(t){return new ji(this.firestore,t,this._query)}}class Er{constructor(t,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new or(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new Er(this.firestore,t,this._key)}}class or extends ji{constructor(t,n,r){super(t,n,of(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new Er(this.firestore,null,new nt(t))}withConverter(t){return new or(this.firestore,t,this._path)}}function _i(e,t,...n){if(e=Nm(e),ME("collection","path",t),e instanceof Ga){const r=Pt.fromString(t,...n);return mu(r),new or(e,null,r)}{if(!(e instanceof Er||e instanceof or))throw new tt(j.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(Pt.fromString(t,...n));return mu(r),new or(e.firestore,null,r)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vu="AsyncQueue";class Eu{constructor(t=Promise.resolve()){this.Vu=[],this.mu=!1,this.fu=[],this.gu=null,this.pu=!1,this.yu=!1,this.wu=[],this.a_=new Vf(this,"async_queue_retry"),this.Su=()=>{const r=Ao();r&&K(vu,"Visibility state changed to "+r.visibilityState),this.a_.t_()},this.bu=t;const n=Ao();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Su)}get isShuttingDown(){return this.mu}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.Du(),this.vu(t)}enterRestrictedMode(t){if(!this.mu){this.mu=!0,this.yu=t||!1;const n=Ao();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Su)}}enqueue(t){if(this.Du(),this.mu)return new Promise(()=>{});const n=new xn;return this.vu(()=>this.mu&&this.yu?Promise.resolve():(t().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Vu.push(t),this.Cu()))}async Cu(){if(this.Vu.length!==0){try{await this.Vu[0](),this.Vu.shift(),this.a_.reset()}catch(t){if(!yr(t))throw t;K(vu,"Operation failed with retryable error: "+t)}this.Vu.length>0&&this.a_.Xo(()=>this.Cu())}}vu(t){const n=this.bu.then(()=>(this.pu=!0,t().catch(r=>{this.gu=r,this.pu=!1;const s=function(a){let l=a.message||"";return a.stack&&(l=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),l}(r);throw Ke("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.pu=!1,r))));return this.bu=n,n}enqueueAfterDelay(t,n,r){this.Du(),this.wu.indexOf(t)>-1&&(n=0);const s=qa.createAndSchedule(this,t,n,r,o=>this.Fu(o));return this.fu.push(s),s}Du(){this.gu&&lt()}verifyOperationInProgress(){}async Mu(){let t;do t=this.bu,await t;while(t!==this.bu)}xu(t){for(const n of this.fu)if(n.timerId===t)return!0;return!1}Ou(t){return this.Mu().then(()=>{this.fu.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.fu)if(n.skipDelay(),t!=="all"&&n.timerId===t)break;return this.Mu()})}Nu(t){this.wu.push(t)}Fu(t){const n=this.fu.indexOf(t);this.fu.splice(n,1)}}class Hf extends Ga{constructor(t,n,r,s){super(t,n,r,s),this.type="firestore",this._queue=new Eu,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new Eu(t),this._firestoreClient=void 0,await t}}}function UE(e,t){const n=typeof e=="object"?e:M_(),r=typeof e=="string"?e:ui,s=V_(n,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=Im("firestore");o&&FE(s,...o)}return s}function BE(e){if(e._terminated)throw new tt(j.FAILED_PRECONDITION,"The client has already been terminated.");return e._firestoreClient||$E(e),e._firestoreClient}function $E(e){var t,n,r;const s=e._freezeSettings(),o=function(l,u,f,d){return new gy(l,u,f,d.host,d.ssl,d.experimentalForceLongPolling,d.experimentalAutoDetectLongPolling,jf(d.experimentalLongPollingOptions),d.useFetchStreams)}(e._databaseId,((t=e._app)===null||t===void 0?void 0:t.options.appId)||"",e._persistenceKey,s);e._componentsProvider||!((n=s.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(e._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),e._firestoreClient=new VE(e._authCredentials,e._appCheckCredentials,e._queue,o,e._componentsProvider&&function(l){const u=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(u),_online:u}}(e._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi{constructor(t){this._byteString=t}static fromBase64String(t){try{return new yi(Kt.fromBase64String(t))}catch(n){throw new tt(j.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(t){return new yi(Kt.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zf{constructor(...t){for(let n=0;n<t.length;++n)if(t[n].length===0)throw new tt(j.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ce(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jE{constructor(t,n){if(!isFinite(t)||t<-90||t>90)throw new tt(j.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(n)||n<-180||n>180)throw new tt(j.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=t,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(t){return ct(this._lat,t._lat)||ct(this._long,t._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qE{constructor(t){this._values=(t||[]).map(n=>n)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0}(this._values,t._values)}}const HE=new RegExp("[~\\*/\\[\\]]");function zE(e,t,n){if(t.search(HE)>=0)throw Tu(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e);try{return new zf(...t.split("."))._internalPath}catch{throw Tu(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e)}}function Tu(e,t,n,r,s){let o=`Function ${t}() called with invalid data`;o+=". ";let a="";return new tt(j.INVALID_ARGUMENT,o+e+a)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kf{constructor(t,n,r,s,o){this._firestore=t,this._userDataWriter=n,this._key=r,this._document=s,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new Er(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new KE(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const n=this._document.data.field(Gf("DocumentSnapshot.get",t));if(n!==null)return this._userDataWriter.convertValue(n)}}}class KE extends Kf{data(){return super.data()}}function Gf(e,t){return typeof t=="string"?zE(e,t):t instanceof zf?t._internalPath:t._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function GE(e){if(e.limitType==="L"&&e.explicitOrderBy.length===0)throw new tt(j.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class WE{convertValue(t,n="none"){switch(fn(t)){case 0:return null;case 1:return t.booleanValue;case 2:return Vt(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,n);case 5:return t.stringValue;case 6:return this.convertBytes(hn(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,n);case 11:return this.convertObject(t.mapValue,n);case 10:return this.convertVectorValue(t.mapValue);default:throw lt()}}convertObject(t,n){return this.convertObjectMap(t.fields,n)}convertObjectMap(t,n="none"){const r={};return ps(t,(s,o)=>{r[s]=this.convertValue(o,n)}),r}convertVectorValue(t){var n,r,s;const o=(s=(r=(n=t.fields)===null||n===void 0?void 0:n[zo].arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.map(a=>Vt(a.doubleValue));return new qE(o)}convertGeoPoint(t){return new jE(Vt(t.latitude),Vt(t.longitude))}convertArray(t,n){return(t.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(t,n){switch(n){case"previous":const r=Oi(t);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(cs(t));default:return null}}convertTimestamp(t){const n=un(t);return new he(n.seconds,n.nanos)}convertDocumentKey(t,n){const r=Pt.fromString(t);St(Af(r));const s=new us(r.get(1),r.get(3)),o=new nt(r.popFirst(5));return s.isEqual(n)||Ke(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hs{constructor(t,n){this.hasPendingWrites=t,this.fromCache=n}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class QE extends Kf{constructor(t,n,r,s,o,a){super(t,n,r,s,a),this._firestore=t,this._firestoreImpl=t,this.metadata=o}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const n=new Js(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,n={}){if(this._document){const r=this._document.data.field(Gf("DocumentSnapshot.get",t));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}}class Js extends QE{data(t={}){return super.data(t)}}class XE{constructor(t,n,r,s){this._firestore=t,this._userDataWriter=n,this._snapshot=s,this.metadata=new Hs(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const t=[];return this.forEach(n=>t.push(n)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,n){this._snapshot.docs.forEach(r=>{t.call(n,new Js(this._firestore,this._userDataWriter,r.key,r,new Hs(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const n=!!t.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new tt(j.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(s,o){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(l=>{const u=new Js(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Hs(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(l=>o||l.type!==3).map(l=>{const u=new Js(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Hs(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let f=-1,d=-1;return l.type!==0&&(f=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),d=a.indexOf(l.doc.key)),{type:YE(l.type),doc:u,oldIndex:f,newIndex:d}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function YE(e){switch(e){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return lt()}}class JE extends WE{constructor(t){super(),this.firestore=t}convertBytes(t){return new yi(t)}convertReference(t){const n=this.convertDocumentKey(t,this.firestore._databaseId);return new Er(this.firestore,null,n)}}function vi(e){e=oa(e,ji);const t=oa(e.firestore,Hf),n=BE(t),r=new JE(t);return GE(e._query),OE(n,e._query).then(s=>new XE(t,r,e,s))}(function(t,n=!0){(function(s){_r=s})(O_),ci(new os("firestore",(r,{instanceIdentifier:s,options:o})=>{const a=r.getProvider("app").getImmediate(),l=new Hf(new X_(r.getProvider("auth-internal")),new Z_(a,r.getProvider("app-check-internal")),function(f,d){if(!Object.prototype.hasOwnProperty.apply(f.options,["projectId"]))throw new tt(j.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new us(f.options.projectId,d)}(a,s),a);return o=Object.assign({useFetchStreams:n},o),l._setSettings(o),l},"PUBLIC").setMultipleInstances(!0)),rr(Sc,Cc,t),rr(Sc,Cc,"esm2017")})();const ZE={apiKey:"AIzaSyBZnuw_hB2Z4e9OfQzkl_YXl_B1_EEVDv4",authDomain:"kan-tag-manager-backend.firebaseapp.com",databaseURL:"https://kan-tag-manager-backend-default-rtdb.firebaseio.com",projectId:"kan-tag-manager-backend",storageBucket:"kan-tag-manager-backend.firebasestorage.app",messagingSenderId:"643695827033",appId:"1:643695827033:web:65ce3f62822d2adfce3948",measurementId:"G-T70106DCYY"},tT=kh(ZE),Ei=UE(tT),eT=gr({name:"AttackTable",props:{filteredUniqueOrigs:{type:Array,required:!0}},emits:["update-sorted-ships"],setup(e,{emit:t}){const n=Nt([]),r=is(()=>n.value.slice().sort((z,G)=>z.mapId-G.mapId).map(z=>`mapId_${z.mapId}`)),s=Nt([]),o=Nt(!0),a=Nt({}),l=Nt(null),u=Nt("asc"),f=z=>{l.value===z?u.value=u.value==="asc"?"desc":"asc":(l.value=z,u.value="desc")},d=is(()=>l.value?[...s.value].sort((z,G)=>{const N=z.spAttackData[l.value],W=G.spAttackData[l.value],X=typeof N=="number"?N:-1/0,E=typeof W=="number"?W:-1/0;return u.value==="asc"?X-E:E-X}):s.value),m=async()=>{const z=await vi(_i(Ei,"eventmap"));n.value=z.docs.map(G=>G.data())},A=async()=>{await m();const z=await vi(_i(Ei,"eventId_1")),G={};z.forEach(N=>{const W=N.data(),X=W.orig;G[X]={};for(const E of n.value){const g=`mapId_${E.mapId}`;typeof W[g]=="number"&&(G[X][g]=W[g])}}),a.value=G,C(),o.value=!1},C=()=>{s.value=e.filteredUniqueOrigs.map(z=>({...z,spAttackData:a.value[z.orig]||{}}))};nr(()=>e.filteredUniqueOrigs,C),A(),nr(()=>d.value,z=>{t("update-sorted-ships",z.map(G=>({...G})))},{immediate:!0});const x={height:`${Ee.rowHeight}px`,fontSize:Ee.fontSize},L={padding:Ee.padding,whiteSpace:Ee.whiteSpace},$={height:`${Ee.headerHeight}px`,fontSize:Ee.fontSize};return{mapIds:r,eventMaps:n,shipsWithSpAttack:s,sortedShips:d,loading:o,rowStyle:x,cellStyle:L,headerStyle:$,getCellStyle:z=>{let G="rgb(255, 255, 255)";if(typeof z=="number")if(z===1)G="rgb(255, 255, 255)";else{const N=Math.min(Math.max(z,1),2),W=245,X=Math.floor(255-(N-1)*70);G=`rgb(${W}, ${X}, 220)`}return{...L,backgroundColor:G}},sortKey:l,sortOrder:u,sortBy:f}}}),nT={class:"p-4"},rT={key:0},sT={key:1},iT={class:"sp-attack-table w-full text-sm border-collapse border border-gray-300"},oT=["onClick"],aT={key:0};function lT(e,t,n,r,s,o){return At(),bt("div",nT,[t[0]||(t[0]=rt("h2",{class:"text-xl font-bold mb-2"},"特攻情報",-1)),e.loading?(At(),bt("div",rT,"読み込み中...")):(At(),bt("div",sT,[rt("table",iT,[rt("thead",{class:"bg-gray-100",style:Pn(e.headerStyle)},[rt("tr",null,[(At(!0),bt(le,null,tr(e.eventMaps.slice().sort((a,l)=>a.mapId-l.mapId),a=>(At(),bt("th",{key:a.mapId,style:Pn(e.cellStyle),class:"border sp-col text-center cursor-pointer",onClick:l=>e.sortBy(`mapId_${a.mapId}`)},[Qn(zt(a.stage)+" ",1),e.sortKey===`mapId_${a.mapId}`?(At(),bt("span",aT,zt(e.sortOrder==="asc"?"▲":"▼"),1)):rs("",!0)],12,oT))),128))])],4),rt("tbody",null,[(At(!0),bt(le,null,tr(e.sortedShips,a=>(At(),bt("tr",{key:a.orig,style:Pn(e.rowStyle)},[(At(!0),bt(le,null,tr(e.eventMaps.slice().sort((l,u)=>l.mapId-u.mapId),l=>(At(),bt("td",{key:l.mapId,style:Pn(e.getCellStyle(a.spAttackData[`mapId_${l.mapId}`])),class:"border sp-col text-center"},zt(typeof a.spAttackData[`mapId_${l.mapId}`]=="number"?a.spAttackData[`mapId_${l.mapId}`]:"-"),5))),128))],4))),128))])])]))])}const cT=Aa(eT,[["render",lT]]),uT=gr({components:{ShipFilterTabs:zg,ShipListTable:tm,ShipModal:hm,AttackTable:cT},setup(){const e=Nt([]),t=Nt([]),n=Nt([]),r=Nt(!1),s=Nt([]),o=Nt([]),a=Nt(null),l=Nt({}),u=Nt([]),f=N=>{u.value=N},d=async()=>{const N=await vi(_i(Ei,"shiplist"));e.value=N.docs.map(W=>({...W.data()})),A()},m=async()=>{const N=await vi(_i(Ei,"filter"));s.value=N.docs.map(W=>{const X=W.data();return{id:Number(X.filterId),label:X.filtertype_jp}}).filter(W=>!isNaN(W.id)).sort((W,X)=>W.id-X.id)},A=()=>{var W;const N=new Map;for(const X of e.value)(!N.has(X.orig)||X.id<(((W=N.get(X.orig))==null?void 0:W.id)??1/0))&&N.set(X.orig,X);t.value=Array.from(N.values()).sort((X,E)=>{const g=X.filterId??0,v=E.filterId??0;return g!==v?g-v:X.id-E.id})},C=is(()=>o.value.length===0?[]:t.value.filter(N=>o.value.includes(N.filterId)).sort((N,W)=>{const X=N.filterId??0,E=W.filterId??0;return X!==E?X-E:N.id-W.id})),x=N=>{const W=o.value.indexOf(N);W>-1?o.value.splice(W,1):o.value.push(N)},L=()=>{$.value?o.value=[]:o.value=s.value.map(N=>N.id)},$=is(()=>o.value.length===s.value.length&&s.value.length>0),Y=N=>{r.value=!0,n.value=e.value.filter(W=>W.orig===N).sort((W,X)=>W.updateLevel-X.updateLevel)},z=()=>{r.value=!1,n.value=[]},G=()=>{if(a.value){const N=a.value.scrollTop;l.value={...l.value,main:N}}};return nh(()=>{d(),m()}),{filters:s,selectedFilterIds:o,isAllSelected:$,toggleFilter:x,toggleAllFilters:L,ships:C,modalShips:n,modalVisible:r,openModal:Y,closeModal:z,scrollRef:a,scrollPositions:l,onScroll:G,sortedShipsFromAttackTable:u,handleSortedShipsUpdate:f}}}),hT={class:"app-container"},fT={class:"sticky top-0 bg-white z-10 shadow-md"},dT={class:"main-content flex gap-4"},pT={class:"list-container flex-1"},gT={class:"attack-container flex-1"};function mT(e,t,n,r,s,o){const a=Fs("ShipFilterTabs"),l=Fs("ShipListTable"),u=Fs("AttackTable"),f=Fs("ShipModal");return At(),bt("div",hT,[rt("div",fT,[_e(a,{filters:e.filters,selectedFilterIds:e.selectedFilterIds,isAllSelected:e.isAllSelected,onToggleFilter:e.toggleFilter,onToggleAll:e.toggleAllFilters},null,8,["filters","selectedFilterIds","isAllSelected","onToggleFilter","onToggleAll"])]),rt("div",{class:"main-scroll-container overflow-y-auto h-[calc(100vh-60px)] p-4",ref:"scrollRef",onScroll:t[0]||(t[0]=(...d)=>e.onScroll&&e.onScroll(...d))},[rt("div",dT,[rt("div",pT,[_e(l,{ships:e.sortedShipsFromAttackTable.length>0?e.sortedShipsFromAttackTable:e.ships,onSelect:e.openModal},null,8,["ships","onSelect"])]),rt("div",gT,[_e(u,{filteredUniqueOrigs:e.ships,onUpdateSortedShips:e.handleSortedShipsUpdate},null,8,["filteredUniqueOrigs","onUpdateSortedShips"])])])],544),e.modalVisible?(At(),wh(f,{key:0,ships:e.modalShips,modalVisible:e.modalVisible,selectedShipOrig:e.modalShips.length?e.modalShips[0].orig:null,onClose:e.closeModal},null,8,["ships","modalVisible","selectedShipOrig","onClose"])):rs("",!0)])}const _T=Aa(uT,[["render",mT],["__scopeId","data-v-8ccda22d"]]),Wf=Fg(_T),yT=jg();Wf.use(yT);Wf.mount("#app");
