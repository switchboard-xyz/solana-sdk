"use strict";(self.webpackChunk_switchboard_xyz_v2_docs=self.webpackChunk_switchboard_xyz_v2_docs||[]).push([[57],{5318:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return m}});var n=r(7378);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var l=n.createContext({}),p=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=p(r),m=i,f=u["".concat(l,".").concat(m)]||u[m]||d[m]||a;return r?n.createElement(f,o(o({ref:t},c),{},{components:r})):n.createElement(f,o({ref:t},c))}));function m(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var p=2;p<a;p++)o[p]=r[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},2189:function(e,t,r){r.r(t),r.d(t,{contentTitle:function(){return l},default:function(){return u},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return c}});var n=r(5773),i=r(808),a=(r(7378),r(5318)),o=["components"],s={},l=void 0,p={unversionedId:"switchboardv2-api/interfaces/PermissionSetParams",id:"switchboardv2-api/interfaces/PermissionSetParams",title:"PermissionSetParams",description:"@switchboard-xyz/switchboard-v2 / PermissionSetParams",source:"@site/api/switchboardv2-api/interfaces/PermissionSetParams.md",sourceDirName:"switchboardv2-api/interfaces",slug:"/switchboardv2-api/interfaces/PermissionSetParams",permalink:"/api/switchboardv2-api/interfaces/PermissionSetParams",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"PermissionInitParams",permalink:"/api/switchboardv2-api/interfaces/PermissionInitParams"},next:{title:"ProgramInitParams",permalink:"/api/switchboardv2-api/interfaces/ProgramInitParams"}},c=[{value:"Table of contents",id:"table-of-contents",children:[{value:"Properties",id:"properties",children:[],level:3}],level:2},{value:"Properties",id:"properties-1",children:[{value:"authority",id:"authority",children:[{value:"Defined in",id:"defined-in",children:[],level:4}],level:3},{value:"enable",id:"enable",children:[{value:"Defined in",id:"defined-in-1",children:[],level:4}],level:3},{value:"permission",id:"permission",children:[{value:"Defined in",id:"defined-in-2",children:[],level:4}],level:3}],level:2}],d={toc:c};function u(e){var t=e.components,r=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/api/switchboardv2-api"},"@switchboard-xyz/switchboard-v2")," / PermissionSetParams"),(0,a.kt)("h1",{id:"interface-permissionsetparams"},"Interface: PermissionSetParams"),(0,a.kt)("p",null,"Parameters for setting a permission in a PermissionAccount"),(0,a.kt)("h2",{id:"table-of-contents"},"Table of contents"),(0,a.kt)("h3",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/api/switchboardv2-api/interfaces/PermissionSetParams#authority"},"authority")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/api/switchboardv2-api/interfaces/PermissionSetParams#enable"},"enable")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/api/switchboardv2-api/interfaces/PermissionSetParams#permission"},"permission"))),(0,a.kt)("h2",{id:"properties-1"},"Properties"),(0,a.kt)("h3",{id:"authority"},"authority"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"authority"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"Keypair")),(0,a.kt)("p",null,"The authority controlling this permission."),(0,a.kt)("h4",{id:"defined-in"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1455"},"sbv2.ts:1455")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"enable"},"enable"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"enable"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"boolean")),(0,a.kt)("p",null,"Specifies whether to enable or disable the permission."),(0,a.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1459"},"sbv2.ts:1459")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"permission"},"permission"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"permission"),": ",(0,a.kt)("a",{parentName:"p",href:"/api/switchboardv2-api/enums/SwitchboardPermission"},(0,a.kt)("inlineCode",{parentName:"a"},"SwitchboardPermission"))),(0,a.kt)("p",null,"The permssion to set"),(0,a.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1451"},"sbv2.ts:1451")))}u.isMDXComponent=!0}}]);