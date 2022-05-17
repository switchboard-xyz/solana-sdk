"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[554],{5318:function(t,e,n){n.d(e,{Zo:function(){return d},kt:function(){return s}});var r=n(7378);function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function l(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?l(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function o(t,e){if(null==t)return{};var n,r,a=function(t,e){if(null==t)return{};var n,r,a={},l=Object.keys(t);for(r=0;r<l.length;r++)n=l[r],e.indexOf(n)>=0||(a[n]=t[n]);return a}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(r=0;r<l.length;r++)n=l[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(a[n]=t[n])}return a}var u=r.createContext({}),p=function(t){var e=r.useContext(u),n=e;return t&&(n="function"==typeof t?t(e):i(i({},e),t)),n},d=function(t){var e=p(t.components);return r.createElement(u.Provider,{value:e},t.children)},m={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},g=r.forwardRef((function(t,e){var n=t.components,a=t.mdxType,l=t.originalType,u=t.parentName,d=o(t,["components","mdxType","originalType","parentName"]),g=p(n),s=a,c=g["".concat(u,".").concat(s)]||g[s]||m[s]||l;return n?r.createElement(c,i(i({ref:e},d),{},{components:n})):r.createElement(c,i({ref:e},d))}));function s(t,e){var n=arguments,a=e&&e.mdxType;if("string"==typeof t||a){var l=n.length,i=new Array(l);i[0]=g;var o={};for(var u in e)hasOwnProperty.call(e,u)&&(o[u]=e[u]);o.originalType=t,o.mdxType="string"==typeof t?t:a,i[1]=o;for(var p=2;p<l;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}g.displayName="MDXCreateElement"},37:function(t,e,n){n.r(e),n.d(e,{assets:function(){return d},contentTitle:function(){return u},default:function(){return s},frontMatter:function(){return o},metadata:function(){return p},toc:function(){return m}});var r=n(5773),a=n(808),l=(n(7378),n(5318)),i=["components"],o={},u=void 0,p={unversionedId:"instructions/aggregatorInit",id:"instructions/aggregatorInit",title:"aggregatorInit",description:"Create and initialize the AggregatorAccount.",source:"@site/idl/instructions/aggregatorInit.md",sourceDirName:"instructions",slug:"/instructions/aggregatorInit",permalink:"/idl/instructions/aggregatorInit",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"aggregatorAddJob",permalink:"/idl/instructions/aggregatorAddJob"},next:{title:"aggregatorLock",permalink:"/idl/instructions/aggregatorLock"}},d={},m=[{value:"Accounts",id:"accounts",level:2},{value:"Args",id:"args",level:2}],g={toc:m};function s(t){var e=t.components,n=(0,a.Z)(t,i);return(0,l.kt)("wrapper",(0,r.Z)({},g,n,{components:e,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Create and initialize the AggregatorAccount."),(0,l.kt)("h2",{id:"accounts"},"Accounts"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Name"),(0,l.kt)("th",{parentName:"tr",align:null},"isMut"),(0,l.kt)("th",{parentName:"tr",align:null},"isSigner"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"aggregator"),(0,l.kt)("td",{parentName:"tr",align:null},"true"),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"authority"),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"queue"),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"authorWallet"),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"programState"),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null})))),(0,l.kt)("h2",{id:"args"},"Args"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Field"),(0,l.kt)("th",{parentName:"tr",align:null},"Type"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"name"),(0,l.kt)("td",{parentName:"tr",align:null},"u8","[32]"),(0,l.kt)("td",{parentName:"tr",align:null},"Name of the aggregator to store on-chain.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"metadata"),(0,l.kt)("td",{parentName:"tr",align:null},"u8","[128]"),(0,l.kt)("td",{parentName:"tr",align:null},"Metadata of the aggregator to store on-chain.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"batchSize"),(0,l.kt)("td",{parentName:"tr",align:null},"u32"),(0,l.kt)("td",{parentName:"tr",align:null},"Number of oracles to request on aggregator update.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"minOracleResults"),(0,l.kt)("td",{parentName:"tr",align:null},"u32"),(0,l.kt)("td",{parentName:"tr",align:null},"Minimum number of oracle responses required before a round is validated.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"minJobResults"),(0,l.kt)("td",{parentName:"tr",align:null},"u32"),(0,l.kt)("td",{parentName:"tr",align:null},"Minimum number of feed jobs suggested to be successful before an oracle sends a response.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"minUpdateDelaySeconds"),(0,l.kt)("td",{parentName:"tr",align:null},"u32"),(0,l.kt)("td",{parentName:"tr",align:null},"Minimum number of seconds required between aggregator rounds.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"startAfter"),(0,l.kt)("td",{parentName:"tr",align:null},"i64"),(0,l.kt)("td",{parentName:"tr",align:null},"unix_timestamp for which no feed update will occur before.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"varianceThreshold"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/idl/types/BorshDecimal"},"BorshDecimal")),(0,l.kt)("td",{parentName:"tr",align:null},"Change percentage required between a previous round and the current round. If variance percentage is not met, reject new oracle responses.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"forceReportPeriod"),(0,l.kt)("td",{parentName:"tr",align:null},"i64"),(0,l.kt)("td",{parentName:"tr",align:null},"Number of seconds for which, even if the variance threshold is not passed, accept new responses from oracles.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"expiration"),(0,l.kt)("td",{parentName:"tr",align:null},"i64"),(0,l.kt)("td",{parentName:"tr",align:null},"unix_timestamp after which funds may be withdrawn from the aggregator. null/undefined/0 means the feed has no expiration.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"stateBump"),(0,l.kt)("td",{parentName:"tr",align:null},"u8"),(0,l.kt)("td",{parentName:"tr",align:null})))))}s.isMDXComponent=!0}}]);