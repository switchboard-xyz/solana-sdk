"use strict";(self.webpackChunk_switchboard_xyz_v2_docs=self.webpackChunk_switchboard_xyz_v2_docs||[]).push([[1832,5019],{5318:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return d}});var a=r(7378);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var l=a.createContext({}),c=function(e){var t=a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},s=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,l=e.parentName,s=u(e,["components","mdxType","originalType","parentName"]),p=c(r),d=n,m=p["".concat(l,".").concat(d)]||p[d]||f[d]||o;return r?a.createElement(m,i(i({ref:t},s),{},{components:r})):a.createElement(m,i({ref:t},s))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,i=new Array(o);i[0]=p;var u={};for(var l in t)hasOwnProperty.call(t,l)&&(u[l]=t[l]);u.originalType=e,u.mdxType="string"==typeof e?e:n,i[1]=u;for(var c=2;c<o;c++)i[c]=r[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}p.displayName="MDXCreateElement"},5310:function(e,t,r){r.d(t,{Z:function(){return b}});var a=r(5773),n=r(808),o=r(7378),i=r(8944),u=r(5642),l=r(1652),c=r(3772),s=r(6206),f=r(4246);const p=["className","component"];var d=r(4907);const m=function(e={}){const{defaultTheme:t,defaultClassName:r="MuiBox-root",generateClassName:d,styleFunctionSx:m=l.Z}=e,b=(0,u.ZP)("div")(m);return o.forwardRef((function(e,o){const u=(0,s.Z)(t),l=(0,c.Z)(e),{className:m,component:g="div"}=l,h=(0,n.Z)(l,p);return(0,f.jsx)(b,(0,a.Z)({as:g,ref:o,className:(0,i.Z)(m,d?d(r):r),theme:u},h))}))}({defaultTheme:(0,r(2905).Z)(),defaultClassName:"MuiBox-root",generateClassName:d.Z.generate});var b=m},3772:function(e,t,r){r.d(t,{Z:function(){return l}});var a=r(5773),n=r(808),o=r(3143),i=r(7351);const u=["sx"];function l(e){const{sx:t}=e,r=(0,n.Z)(e,u),{systemProps:l,otherProps:c}=(e=>{const t={systemProps:{},otherProps:{}};return Object.keys(e).forEach((r=>{i.Gc[r]?t.systemProps[r]=e[r]:t.otherProps[r]=e[r]})),t})(r);let s;return s=Array.isArray(t)?[l,...t]:"function"==typeof t?(...e)=>{const r=t(...e);return(0,o.P)(r)?(0,a.Z)({},l,r):l}:(0,a.Z)({},l,t),(0,a.Z)({},c,{sx:s})}},4295:function(e,t,r){r.r(t),r.d(t,{contentTitle:function(){return f},default:function(){return b},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return d}});var a=r(5773),n=r(808),o=(r(7378),r(5318)),i=["components"],u={toc:[]};function l(e){var t=e.components,r=(0,n.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Field"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"data"),(0,o.kt)("td",{parentName:"tr",align:null},"publicKey[]"),(0,o.kt)("td",{parentName:"tr",align:null},"Buffer account storing an array of oracle public keys.")))))}l.isMDXComponent=!0;var c=["components"],s={},f=void 0,p={unversionedId:"idl/accounts/OracleQueueBuffer",id:"idl/accounts/OracleQueueBuffer",title:"OracleQueueBuffer",description:"Serialized buffer account storing the list of oracle's for a queue.",source:"@site/api/idl/accounts/OracleQueueBuffer.md",sourceDirName:"idl/accounts",slug:"/idl/accounts/OracleQueueBuffer",permalink:"/api/idl/accounts/OracleQueueBuffer",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"OracleQueueAccountData",permalink:"/api/idl/accounts/OracleQueueAccountData"},next:{title:"PermissionAccountData",permalink:"/api/idl/accounts/PermissionAccountData"}},d=[],m={toc:d};function b(e){var t=e.components,r=(0,n.Z)(e,c);return(0,o.kt)("wrapper",(0,a.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Serialized buffer account storing the list of oracle's for a queue."),(0,o.kt)("b",null,"Size: "),"8 Bytes + (32 Bytes \xd7 Num Oracles)",(0,o.kt)("br",null),(0,o.kt)("b",null,"Rent Exemption: ")," Dependent on number of oracles.",(0,o.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 1,000 oracles:\xa0\xa0 0.223666560 SOL",(0,o.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 25,000 oracles: 5.568946560 SOL",(0,o.kt)("br",null),(0,o.kt)("br",null),(0,o.kt)(l,{mdxType:"QueueBuffer"}))}b.isMDXComponent=!0},6003:function(e,t,r){var a=r(5310),n=r(7378),o=r(1142),i=r(2638);t.Z=function(e){var t=(0,i.Z)().isDarkTheme,r="inherit";e.lightBg&&!t&&(r=e.lightBg),e.darkBg&&t&&(r=e.darkBg);var u={};return e.sx&&(u=Object.assign({backgroundColor:r,m:"auto",display:"flex"},u,e.sx)),n.createElement(a.Z,{component:"img",sx:u,src:(0,o.Z)(e.img)})}},5356:function(e,t,r){r.r(t),r.d(t,{contentTitle:function(){return c},default:function(){return d},frontMatter:function(){return l},metadata:function(){return s},toc:function(){return f}});var a=r(5773),n=r(808),o=(r(7378),r(5318)),i=(r(6003),r(9556),r(4295)),u=["components"],l={sidebar_position:20,title:"Oracle Buffer"},c=void 0,s={unversionedId:"architecture/oracles/oracle-buffer",id:"architecture/oracles/oracle-buffer",title:"Oracle Buffer",description:"An oracle queue buffer stores the list of active oracles for a queue. If an oracle fails to heartbeat before oracleTimeout, it may be removed from the buffer and no longer be assigned update request from the queue.",source:"@site/docs/architecture/oracles/oracle-buffer.mdx",sourceDirName:"architecture/oracles",slug:"/architecture/oracles/oracle-buffer",permalink:"/architecture/oracles/oracle-buffer",tags:[],version:"current",sidebarPosition:20,frontMatter:{sidebar_position:20,title:"Oracle Buffer"},sidebar:"tutorialSidebar",previous:{title:"Oracle",permalink:"/architecture/oracles/"},next:{title:"Activities",permalink:"/architecture/oracles/activities"}},f=[{value:"Queue Configuration",id:"queue-configuration",children:[{value:"\u2699\ufe0fmaxSize",id:"\ufe0fmaxsize",children:[],level:3}],level:2},{value:"Functions",id:"functions",children:[{value:"\ud83d\ude80Store Active Oracles",id:"store-active-oracles",children:[],level:3},{value:"\ud83d\ude80Garbage Collection",id:"garbage-collection",children:[{value:"Stale Oracle",id:"stale-oracle",children:[],level:5},{value:"Stale Aggregators",id:"stale-aggregators",children:[],level:5}],level:3}],level:2},{value:"Account Schema",id:"account-schema",children:[{value:"\ud83d\udce6OracleQueueBuffer",id:"oraclequeuebuffer",children:[],level:3}],level:2}],p={toc:f};function d(e){var t=e.components,r=(0,n.Z)(e,u);return(0,o.kt)("wrapper",(0,a.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"An oracle queue buffer stores the list of active oracles for a queue. If an oracle fails to heartbeat before ",(0,o.kt)("inlineCode",{parentName:"p"},"oracleTimeout"),", it may be removed from the buffer and no longer be assigned update request from the queue."),(0,o.kt)("h2",{id:"queue-configuration"},"Queue Configuration"),(0,o.kt)("h3",{id:"\ufe0fmaxsize"},"\u2699\ufe0fmaxSize"),(0,o.kt)("p",null,"When creating a queue with the OracleQueueInit instruction, an OracleQueueBuffer account must be initialized with a size of ",(0,o.kt)("inlineCode",{parentName:"p"},"8 Bytes + (32 Bytes \xd7 maxSize)"),", where ",(0,o.kt)("inlineCode",{parentName:"p"},"maxSize")," is the maximum number of oracles the queue can support. Once a buffer is full, oracles must be removed before new oracles can join the network."),(0,o.kt)("h2",{id:"functions"},"Functions"),(0,o.kt)("p",null,"An oracle queue buffer account is responsible for the following functions:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#store-active-oracles"},(0,o.kt)("strong",{parentName:"a"},"Store Active Oracles")),": Store a list of oracles to assign to update request."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#garbage-collection"},(0,o.kt)("strong",{parentName:"a"},"Garbage Collection")),": Remove inactive oracles from the buffer.")),(0,o.kt)("h3",{id:"store-active-oracles"},"\ud83d\ude80Store Active Oracles"),(0,o.kt)("p",null,"The oracle queue buffer stores a list of oracle public keys that are ready to be assigned to update request."),(0,o.kt)("h3",{id:"garbage-collection"},"\ud83d\ude80Garbage Collection"),(0,o.kt)("h5",{id:"stale-oracle"},"Stale Oracle"),(0,o.kt)("p",null,"Oracle's are required to heartbeat at a regular interval to signal readiness. After a successful oracle heartbeat, the on-chain program will attempt to garbage collect inactive oracles using ",(0,o.kt)("inlineCode",{parentName:"p"},"gcIdx")," to track its position iterating over the queue. If an oracle fails to heartbeat before ",(0,o.kt)("inlineCode",{parentName:"p"},"oracleTimeout"),", it will no longer receive update requests from the queue. If an oracle fails to heartbeat ",(0,o.kt)("inlineCode",{parentName:"p"},"consecutiveOracleFailureLimit")," times, it's queue permissions will be automatically revoked, requiring the oracle to be re-approved by the queue's ",(0,o.kt)("inlineCode",{parentName:"p"},"authority")," before it can rejoin the network. This is to prevent stale oracles from wasting queue resources."),(0,o.kt)("h5",{id:"stale-aggregators"},"Stale Aggregators"),(0,o.kt)("p",null,"If a data feed has misconfigured jobs or insufficient escrow it may fail to update, causing the aggregator to increment its number of failures on-chain. If an aggregator fails to update ",(0,o.kt)("inlineCode",{parentName:"p"},"consecutiveFeedFailureLimit")," times, it's queue permissions will be automatically revoked, requiring the oracle to be re-approved by the queue's ",(0,o.kt)("inlineCode",{parentName:"p"},"authority")," before it can rejoin the network. This is to prevent stale aggregators from wasting queue resources."),(0,o.kt)("p",null,"Aggregators must maintain a lease escrow to reward oracle operators for successfully updating a data feed. After an aggregators lease account is funded or has been re-funded, a queue may specify ",(0,o.kt)("inlineCode",{parentName:"p"},"feedProbationPeriod")," to require N successful update requests or else it's queue permissions will be automatically revoked by the queue."),(0,o.kt)("h2",{id:"account-schema"},"Account Schema"),(0,o.kt)("h3",{id:"oraclequeuebuffer"},"\ud83d\udce6OracleQueueBuffer"),(0,o.kt)(i.default,{mdxType:"OracleQueueBuffer"}))}d.isMDXComponent=!0}}]);