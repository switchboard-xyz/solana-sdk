"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5835,2877,2743,9803],{5318:function(t,r,e){e.d(r,{Zo:function(){return l},kt:function(){return g}});var n=e(7378);function a(t,r,e){return r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}function o(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),e.push.apply(e,n)}return e}function i(t){for(var r=1;r<arguments.length;r++){var e=null!=arguments[r]?arguments[r]:{};r%2?o(Object(e),!0).forEach((function(r){a(t,r,e[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):o(Object(e)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(e,r))}))}return t}function c(t,r){if(null==t)return{};var e,n,a=function(t,r){if(null==t)return{};var e,n,a={},o=Object.keys(t);for(n=0;n<o.length;n++)e=o[n],r.indexOf(e)>=0||(a[e]=t[e]);return a}(t,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(n=0;n<o.length;n++)e=o[n],r.indexOf(e)>=0||Object.prototype.propertyIsEnumerable.call(t,e)&&(a[e]=t[e])}return a}var s=n.createContext({}),u=function(t){var r=n.useContext(s),e=r;return t&&(e="function"==typeof t?t(r):i(i({},r),t)),e},l=function(t){var r=u(t.components);return n.createElement(s.Provider,{value:r},t.children)},p={inlineCode:"code",wrapper:function(t){var r=t.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(t,r){var e=t.components,a=t.mdxType,o=t.originalType,s=t.parentName,l=c(t,["components","mdxType","originalType","parentName"]),m=u(e),g=a,d=m["".concat(s,".").concat(g)]||m[g]||p[g]||o;return e?n.createElement(d,i(i({ref:r},l),{},{components:e})):n.createElement(d,i({ref:r},l))}));function g(t,r){var e=arguments,a=r&&r.mdxType;if("string"==typeof t||a){var o=e.length,i=new Array(o);i[0]=m;var c={};for(var s in r)hasOwnProperty.call(r,s)&&(c[s]=r[s]);c.originalType=t,c.mdxType="string"==typeof t?t:a,i[1]=c;for(var u=2;u<o;u++)i[u]=e[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,e)}m.displayName="MDXCreateElement"},5310:function(t,r,e){e.d(r,{Z:function(){return f}});var n=e(2685),a=e(1244),o=e(7378),i=e(8944),c=e(5642),s=e(1652),u=e(3772),l=e(6206),p=e(4246);const m=["className","component"];var g=e(4907);const d=function(t={}){const{defaultTheme:r,defaultClassName:e="MuiBox-root",generateClassName:g,styleFunctionSx:d=s.Z}=t,f=(0,c.ZP)("div")(d);return o.forwardRef((function(t,o){const c=(0,l.Z)(r),s=(0,u.Z)(t),{className:d,component:h="div"}=s,y=(0,a.Z)(s,m);return(0,p.jsx)(f,(0,n.Z)({as:h,ref:o,className:(0,i.Z)(d,g?g(e):e),theme:c},y))}))}({defaultTheme:(0,e(2905).Z)(),defaultClassName:"MuiBox-root",generateClassName:g.Z.generate});var f=d},4384:function(t,r,e){e.d(r,{ZP:function(){return S}});var n=e(1244),a=e(2685),o=e(7378),i=e(8944),c=e(2142),s=e(3772),u=e(3892),l=e(2709),p=e(2399);var m=o.createContext(),g=e(765);function d(t){return(0,g.Z)("MuiGrid",t)}const f=["auto",!0,1,2,3,4,5,6,7,8,9,10,11,12];var h=(0,e(2897).Z)("MuiGrid",["root","container","item","zeroMinWidth",...[0,1,2,3,4,5,6,7,8,9,10].map((t=>`spacing-xs-${t}`)),...["column-reverse","column","row-reverse","row"].map((t=>`direction-xs-${t}`)),...["nowrap","wrap-reverse","wrap"].map((t=>`wrap-xs-${t}`)),...f.map((t=>`grid-xs-${t}`)),...f.map((t=>`grid-sm-${t}`)),...f.map((t=>`grid-md-${t}`)),...f.map((t=>`grid-lg-${t}`)),...f.map((t=>`grid-xl-${t}`))]),y=e(4246);const b=["className","columns","columnSpacing","component","container","direction","item","lg","md","rowSpacing","sm","spacing","wrap","xl","xs","zeroMinWidth"];function x(t){const r=parseFloat(t);return`${r}${String(t).replace(String(r),"")||"px"}`}function k(t,r,e={}){if(!r||!t||t<=0)return[];if("string"==typeof t&&!Number.isNaN(Number(t))||"number"==typeof t)return[e[`spacing-xs-${String(t)}`]||`spacing-xs-${String(t)}`];const{xs:n,sm:a,md:o,lg:i,xl:c}=t;return[Number(n)>0&&(e[`spacing-xs-${String(n)}`]||`spacing-xs-${String(n)}`),Number(a)>0&&(e[`spacing-sm-${String(a)}`]||`spacing-sm-${String(a)}`),Number(o)>0&&(e[`spacing-md-${String(o)}`]||`spacing-md-${String(o)}`),Number(i)>0&&(e[`spacing-lg-${String(i)}`]||`spacing-lg-${String(i)}`),Number(c)>0&&(e[`spacing-xl-${String(c)}`]||`spacing-xl-${String(c)}`)]}const v=(0,l.ZP)("div",{name:"MuiGrid",slot:"Root",overridesResolver:(t,r)=>{const{container:e,direction:n,item:a,lg:o,md:i,sm:c,spacing:s,wrap:u,xl:l,xs:p,zeroMinWidth:m}=t.ownerState;return[r.root,e&&r.container,a&&r.item,m&&r.zeroMinWidth,...k(s,e,r),"row"!==n&&r[`direction-xs-${String(n)}`],"wrap"!==u&&r[`wrap-xs-${String(u)}`],!1!==p&&r[`grid-xs-${String(p)}`],!1!==c&&r[`grid-sm-${String(c)}`],!1!==i&&r[`grid-md-${String(i)}`],!1!==o&&r[`grid-lg-${String(o)}`],!1!==l&&r[`grid-xl-${String(l)}`]]}})((({ownerState:t})=>(0,a.Z)({boxSizing:"border-box"},t.container&&{display:"flex",flexWrap:"wrap",width:"100%"},t.item&&{margin:0},t.zeroMinWidth&&{minWidth:0},"wrap"!==t.wrap&&{flexWrap:t.wrap})),(function({theme:t,ownerState:r}){const e=(0,c.P$)({values:r.direction,breakpoints:t.breakpoints.values});return(0,c.k9)({theme:t},e,(t=>{const r={flexDirection:t};return 0===t.indexOf("column")&&(r[`& > .${h.item}`]={maxWidth:"none"}),r}))}),(function({theme:t,ownerState:r}){const{container:e,rowSpacing:n}=r;let a={};if(e&&0!==n){const r=(0,c.P$)({values:n,breakpoints:t.breakpoints.values});a=(0,c.k9)({theme:t},r,(r=>{const e=t.spacing(r);return"0px"!==e?{marginTop:`-${x(e)}`,[`& > .${h.item}`]:{paddingTop:x(e)}}:{}}))}return a}),(function({theme:t,ownerState:r}){const{container:e,columnSpacing:n}=r;let a={};if(e&&0!==n){const r=(0,c.P$)({values:n,breakpoints:t.breakpoints.values});a=(0,c.k9)({theme:t},r,(r=>{const e=t.spacing(r);return"0px"!==e?{width:`calc(100% + ${x(e)})`,marginLeft:`-${x(e)}`,[`& > .${h.item}`]:{paddingLeft:x(e)}}:{}}))}return a}),(function({theme:t,ownerState:r}){let e;return t.breakpoints.keys.reduce(((n,o)=>{let i={};if(r[o]&&(e=r[o]),!e)return n;if(!0===e)i={flexBasis:0,flexGrow:1,maxWidth:"100%"};else if("auto"===e)i={flexBasis:"auto",flexGrow:0,flexShrink:0,maxWidth:"none",width:"auto"};else{const s=(0,c.P$)({values:r.columns,breakpoints:t.breakpoints.values}),u="object"==typeof s?s[o]:s;if(null==u)return n;const l=Math.round(e/u*1e8)/1e6+"%";let p={};if(r.container&&r.item&&0!==r.columnSpacing){const e=t.spacing(r.columnSpacing);if("0px"!==e){const t=`calc(${l} + ${x(e)})`;p={flexBasis:t,maxWidth:t}}}i=(0,a.Z)({flexBasis:l,flexGrow:0,maxWidth:l},p)}return 0===t.breakpoints.values[o]?Object.assign(n,i):n[t.breakpoints.up(o)]=i,n}),{})}));var S=o.forwardRef((function(t,r){const e=(0,p.Z)({props:t,name:"MuiGrid"}),c=(0,s.Z)(e),{className:l,columns:g,columnSpacing:f,component:h="div",container:x=!1,direction:S="row",item:w=!1,lg:Z=!1,md:N=!1,rowSpacing:$,sm:P=!1,spacing:M=0,wrap:O="wrap",xl:T=!1,xs:W=!1,zeroMinWidth:j=!1}=c,B=(0,n.Z)(c,b),D=$||M,C=f||M,A=o.useContext(m),E=x?g||12:A,z=(0,a.Z)({},c,{columns:E,container:x,direction:S,item:w,lg:Z,md:N,sm:P,rowSpacing:D,columnSpacing:C,wrap:O,xl:T,xs:W,zeroMinWidth:j}),G=(t=>{const{classes:r,container:e,direction:n,item:a,lg:o,md:i,sm:c,spacing:s,wrap:l,xl:p,xs:m,zeroMinWidth:g}=t,f={root:["root",e&&"container",a&&"item",g&&"zeroMinWidth",...k(s,e),"row"!==n&&`direction-xs-${String(n)}`,"wrap"!==l&&`wrap-xs-${String(l)}`,!1!==m&&`grid-xs-${String(m)}`,!1!==c&&`grid-sm-${String(c)}`,!1!==i&&`grid-md-${String(i)}`,!1!==o&&`grid-lg-${String(o)}`,!1!==p&&`grid-xl-${String(p)}`]};return(0,u.Z)(f,d,r)})(z);return(0,y.jsx)(m.Provider,{value:E,children:(0,y.jsx)(v,(0,a.Z)({ownerState:z,className:(0,i.Z)(G.root,l),as:h,ref:r},B))})}))},2750:function(t,r,e){e.d(r,{Z:function(){return x}});var n=e(1244),a=e(2685),o=e(7378),i=e(8944),c=e(3772),s=e(3892),u=e(2709),l=e(2399),p=e(1640),m=e(765);function g(t){return(0,m.Z)("MuiTypography",t)}(0,e(2897).Z)("MuiTypography",["root","h1","h2","h3","h4","h5","h6","subtitle1","subtitle2","body1","body2","inherit","button","caption","overline","alignLeft","alignRight","alignCenter","alignJustify","noWrap","gutterBottom","paragraph"]);var d=e(4246);const f=["align","className","component","gutterBottom","noWrap","paragraph","variant","variantMapping"],h=(0,u.ZP)("span",{name:"MuiTypography",slot:"Root",overridesResolver:(t,r)=>{const{ownerState:e}=t;return[r.root,e.variant&&r[e.variant],"inherit"!==e.align&&r[`align${(0,p.Z)(e.align)}`],e.noWrap&&r.noWrap,e.gutterBottom&&r.gutterBottom,e.paragraph&&r.paragraph]}})((({theme:t,ownerState:r})=>(0,a.Z)({margin:0},r.variant&&t.typography[r.variant],"inherit"!==r.align&&{textAlign:r.align},r.noWrap&&{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},r.gutterBottom&&{marginBottom:"0.35em"},r.paragraph&&{marginBottom:16}))),y={h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",subtitle1:"h6",subtitle2:"h6",body1:"p",body2:"p",inherit:"p"},b={primary:"primary.main",textPrimary:"text.primary",secondary:"secondary.main",textSecondary:"text.secondary",error:"error.main"};var x=o.forwardRef((function(t,r){const e=(0,l.Z)({props:t,name:"MuiTypography"}),o=(t=>b[t]||t)(e.color),u=(0,c.Z)((0,a.Z)({},e,{color:o})),{align:m="inherit",className:x,component:k,gutterBottom:v=!1,noWrap:S=!1,paragraph:w=!1,variant:Z="body1",variantMapping:N=y}=u,$=(0,n.Z)(u,f),P=(0,a.Z)({},u,{align:m,color:o,className:x,component:k,gutterBottom:v,noWrap:S,paragraph:w,variant:Z,variantMapping:N}),M=k||(w?"p":N[Z]||y[Z])||"span",O=(t=>{const{align:r,gutterBottom:e,noWrap:n,paragraph:a,variant:o,classes:i}=t,c={root:["root",o,"inherit"!==t.align&&`align${(0,p.Z)(r)}`,e&&"gutterBottom",n&&"noWrap",a&&"paragraph"]};return(0,s.Z)(c,g,i)})(P);return(0,d.jsx)(h,(0,a.Z)({as:M,ref:r,ownerState:P,className:(0,i.Z)(O.root,x)},$))}))},1640:function(t,r,e){var n=e(9490);r.Z=n.Z},3772:function(t,r,e){e.d(r,{Z:function(){return s}});var n=e(2685),a=e(1244),o=e(3143),i=e(7351);const c=["sx"];function s(t){const{sx:r}=t,e=(0,a.Z)(t,c),{systemProps:s,otherProps:u}=(t=>{const r={systemProps:{},otherProps:{}};return Object.keys(t).forEach((e=>{i.Gc[e]?r.systemProps[e]=t[e]:r.otherProps[e]=t[e]})),r})(e);let l;return l=Array.isArray(r)?[s,...r]:"function"==typeof r?(...t)=>{const e=r(...t);return(0,o.P)(e)?(0,n.Z)({},s,e):s}:(0,n.Z)({},s,r),(0,n.Z)({},u,{sx:l})}},8345:function(t,r,e){e.r(r),e.d(r,{assets:function(){return l},contentTitle:function(){return s},default:function(){return g},frontMatter:function(){return c},metadata:function(){return u},toc:function(){return p}});var n=e(2685),a=e(1244),o=(e(7378),e(5318)),i=["components"],c={},s=void 0,u={unversionedId:"accounts/SbState",id:"accounts/SbState",title:"SbState",description:"Size 0.008741760 SOL",source:"@site/idl/accounts/SbState.md",sourceDirName:"accounts",slug:"/accounts/SbState",permalink:"/idl/accounts/SbState",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"PermissionAccountData",permalink:"/idl/accounts/PermissionAccountData"},next:{title:"VrfAccountData",permalink:"/idl/accounts/VrfAccountData"}},l={},p=[],m={toc:p};function g(t){var r=t.components,e=(0,a.Z)(t,i);return(0,o.kt)("wrapper",(0,n.Z)({},m,e,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("b",null,"Size: "),"1128 Bytes",(0,o.kt)("br",null),(0,o.kt)("b",null,"Rent Exemption: "),"0.008741760 SOL",(0,o.kt)("br",null),(0,o.kt)("br",null),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Field"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"authority"),(0,o.kt)("td",{parentName:"tr",align:null},"publicKey"),(0,o.kt)("td",{parentName:"tr",align:null},"The account authority permitted to make account changes.")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"tokenMint"),(0,o.kt)("td",{parentName:"tr",align:null},"publicKey"),(0,o.kt)("td",{parentName:"tr",align:null},"The token mint used for oracle rewards, aggregator leases, and other reward incentives.")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"tokenVault"),(0,o.kt)("td",{parentName:"tr",align:null},"publicKey"),(0,o.kt)("td",{parentName:"tr",align:null},"Token vault used by the program to receive kickbacks.")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"daoMint"),(0,o.kt)("td",{parentName:"tr",align:null},"publicKey"),(0,o.kt)("td",{parentName:"tr",align:null},"The token mint used by the DAO.")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"ebuf"),(0,o.kt)("td",{parentName:"tr",align:null},"u8","[992]"),(0,o.kt)("td",{parentName:"tr",align:null},"Reserved.")))))}g.isMDXComponent=!0},6003:function(t,r,e){var n=e(5310),a=e(1582),o=e(8948),i=e(7378);r.Z=function(t){var r=(0,a.If)().colorMode,e="inherit";t.lightBg&&"dark"!==r&&(e=t.lightBg),t.darkBg&&"dark"===r&&(e=t.darkBg);var c={};return t.sx&&(c=Object.assign({backgroundColor:e,m:"auto",display:"flex"},c,t.sx)),i.createElement(n.Z,{component:"img",sx:c,src:(0,o.Z)(t.img)})}},2292:function(t,r,e){e.r(r),e.d(r,{assets:function(){return d},contentTitle:function(){return m},default:function(){return y},frontMatter:function(){return p},metadata:function(){return g},toc:function(){return f}});var n=e(2685),a=e(1244),o=(e(7378),e(5318)),i=e(6003),c=e(4384),s=e(2750),u=(e(1884),e(8345)),l=["components"],p={sidebar_position:5,id:"program",slug:"/program"},m="Program",g={unversionedId:"program",id:"program",title:"Program",description:"Program State Account",source:"@site/docs/program.mdx",sourceDirName:".",slug:"/program",permalink:"/program",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5,id:"program",slug:"/program"},sidebar:"tutorialSidebar",previous:{title:"Introduction",permalink:"/introduction"},next:{title:"Architecture",permalink:"/queue/"}},d={},f=[{value:"Program State Account",id:"program-state-account",level:2}],h={toc:f};function y(t){var r=t.components,e=(0,a.Z)(t,l);return(0,o.kt)("wrapper",(0,n.Z)({},h,e,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"program"},"Program"),(0,o.kt)("h2",{id:"program-state-account"},"Program State Account"),(0,o.kt)(c.ZP,{container:!0,spacing:3,justifyContent:"space-around",mdxType:"Grid"},(0,o.kt)(c.ZP,{item:!0,md:6,sm:12,mdxType:"Grid"},(0,o.kt)("br",null),(0,o.kt)(s.Z,{mdxType:"Typography"},"The Program State Account is the top level account that is used to connect independent oracle queues."),(0,o.kt)("br",null),(0,o.kt)(s.Z,{mdxType:"Typography"},"The Switchboard V2 program can support many oracle queue's, each acting as independent networks with their own oracles, configuration, and security model."),(0,o.kt)("br",null)),(0,o.kt)(c.ZP,{item:!0,md:5,sm:12,mdxType:"Grid"},(0,o.kt)(i.Z,{img:"/img/L0_Architecture.png",mdxType:"MarkdownImage"}))),(0,o.kt)(u.default,{mdxType:"ProgramStateAccountData"}))}y.isMDXComponent=!0}}]);