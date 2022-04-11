"use strict";(self.webpackChunk_switchboard_xyz_v2_docs=self.webpackChunk_switchboard_xyz_v2_docs||[]).push([[6307],{5318:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return m}});var a=r(7378);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},c=Object.keys(e);for(a=0;a<c.length;a++)r=c[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(a=0;a<c.length;a++)r=c[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var i=a.createContext({}),u=function(e){var t=a.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=u(e.components);return a.createElement(i.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,c=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=u(r),m=n,b=d["".concat(i,".").concat(m)]||d[m]||s[m]||c;return r?a.createElement(b,o(o({ref:t},p),{},{components:r})):a.createElement(b,o({ref:t},p))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var c=r.length,o=new Array(c);o[0]=d;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:n,o[1]=l;for(var u=2;u<c;u++)o[u]=r[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}d.displayName="MDXCreateElement"},3977:function(e,t,r){r.r(t),r.d(t,{contentTitle:function(){return i},default:function(){return d},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return p}});var a=r(5773),n=r(808),c=(r(7378),r(5318)),o=["components"],l={sidebar_label:"Oracle",title:"switchboardpy.oracle"},i=void 0,u={unversionedId:"switchboardpy/oracle",id:"switchboardpy/oracle",title:"switchboardpy.oracle",description:"OracleInitParams Objects",source:"@site/api/switchboardpy/oracle.md",sourceDirName:"switchboardpy",slug:"/switchboardpy/oracle",permalink:"/api/switchboardpy/oracle",tags:[],version:"current",frontMatter:{sidebar_label:"Oracle",title:"switchboardpy.oracle"},sidebar:"tutorialSidebar",previous:{title:"Lease",permalink:"/api/switchboardpy/lease"},next:{title:"Oraclequeue",permalink:"/api/switchboardpy/oraclequeue"}},p=[{value:"OracleInitParams Objects",id:"oracleinitparams-objects",children:[{value:"queue_account",id:"queue_account",children:[],level:4},{value:"name",id:"name",children:[],level:4}],level:2},{value:"OracleWithdrawParams Objects",id:"oraclewithdrawparams-objects",children:[{value:"amount",id:"amount",children:[],level:4},{value:"withdraw_account",id:"withdraw_account",children:[],level:4}],level:2},{value:"OracleAccount Objects",id:"oracleaccount-objects",children:[],level:2}],s={toc:p};function d(e){var t=e.components,r=(0,n.Z)(e,o);return(0,c.kt)("wrapper",(0,a.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("h2",{id:"oracleinitparams-objects"},"OracleInitParams Objects"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-python"},"@dataclass\nclass OracleInitParams()\n")),(0,c.kt)("p",null,"Specifies the oracle queue to associate with this OracleAccount."),(0,c.kt)("h4",{id:"queue_account"},"queue_account"),(0,c.kt)("p",null,"Buffer specifying oracle name"),(0,c.kt)("h4",{id:"name"},"name"),(0,c.kt)("p",null,"Buffer specifying oracle metadata"),(0,c.kt)("h2",{id:"oraclewithdrawparams-objects"},"OracleWithdrawParams Objects"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-python"},"@dataclass\nclass OracleWithdrawParams()\n")),(0,c.kt)("p",null,"Amount to withdraw"),(0,c.kt)("h4",{id:"amount"},"amount"),(0,c.kt)("p",null,"Token Account to withdraw to"),(0,c.kt)("h4",{id:"withdraw_account"},"withdraw_account"),(0,c.kt)("p",null,"Oracle authority keypair"),(0,c.kt)("h2",{id:"oracleaccount-objects"},"OracleAccount Objects"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-python"},"class OracleAccount()\n")),(0,c.kt)("p",null,"A Switchboard account representing an oracle account and its associated queue\nand escrow account."),(0,c.kt)("p",null,(0,c.kt)("strong",{parentName:"p"},"Attributes"),":"),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("inlineCode",{parentName:"li"},"program")," ",(0,c.kt)("em",{parentName:"li"},"anchor.Program")," - The anchor program ref"),(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("inlineCode",{parentName:"li"},"public_key")," ",(0,c.kt)("em",{parentName:"li"},"PublicKey | None")," - This aggregator","'","s public key"),(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("inlineCode",{parentName:"li"},"keypair")," ",(0,c.kt)("em",{parentName:"li"},"Keypair | None")," - this aggregator","'","s keypair")))}d.isMDXComponent=!0}}]);