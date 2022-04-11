"use strict";(self.webpackChunk_switchboard_xyz_v2_docs=self.webpackChunk_switchboard_xyz_v2_docs||[]).push([[6754],{5318:function(t,e,r){r.d(e,{Zo:function(){return s},kt:function(){return u}});var a=r(7378);function n(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function i(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,a)}return r}function o(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?i(Object(r),!0).forEach((function(e){n(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function l(t,e){if(null==t)return{};var r,a,n=function(t,e){if(null==t)return{};var r,a,n={},i=Object.keys(t);for(a=0;a<i.length;a++)r=i[a],e.indexOf(r)>=0||(n[r]=t[r]);return n}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(a=0;a<i.length;a++)r=i[a],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(t,r)&&(n[r]=t[r])}return n}var c=a.createContext({}),p=function(t){var e=a.useContext(c),r=e;return t&&(r="function"==typeof t?t(e):o(o({},e),t)),r},s=function(t){var e=p(t.components);return a.createElement(c.Provider,{value:e},t.children)},m={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},d=a.forwardRef((function(t,e){var r=t.components,n=t.mdxType,i=t.originalType,c=t.parentName,s=l(t,["components","mdxType","originalType","parentName"]),d=p(r),u=n,y=d["".concat(c,".").concat(u)]||d[u]||m[u]||i;return r?a.createElement(y,o(o({ref:e},s),{},{components:r})):a.createElement(y,o({ref:e},s))}));function u(t,e){var r=arguments,n=e&&e.mdxType;if("string"==typeof t||n){var i=r.length,o=new Array(i);o[0]=d;var l={};for(var c in e)hasOwnProperty.call(e,c)&&(l[c]=e[c]);l.originalType=t,l.mdxType="string"==typeof t?t:n,o[1]=l;for(var p=2;p<i;p++)o[p]=r[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}d.displayName="MDXCreateElement"},4307:function(t,e,r){r.r(e),r.d(e,{contentTitle:function(){return p},default:function(){return u},frontMatter:function(){return c},metadata:function(){return s},toc:function(){return m}});var a=r(5773),n=r(808),i=(r(7378),r(5318)),o=r(1596),l=["components"],c={sidebar_position:1,slug:".",title:"Overview"},p="switchboardpy",s={unversionedId:"switchboardpy/overview",id:"switchboardpy/overview",title:"Overview",description:"GitHub GitHub last commit PyPI Page Last Updated",source:"@site/api/switchboardpy/overview.mdx",sourceDirName:"switchboardpy",slug:"/switchboardpy/",permalink:"/api/switchboardpy/",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,slug:".",title:"Overview"},sidebar:"tutorialSidebar",previous:{title:"VrfSetCallbackParams",permalink:"/api/switchboardv2-api/interfaces/VrfSetCallbackParams"},next:{title:"Aggregator",permalink:"/api/switchboardpy/aggregator"}},m=[{value:"Install",id:"install",children:[],level:2},{value:"Example",id:"example",children:[],level:2}],d={toc:m};function u(t){var e=t.components,c=(0,n.Z)(t,l);return(0,i.kt)("wrapper",(0,a.Z)({},d,c,{components:e,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"switchboardpy"},"switchboardpy"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/switchboard-xyz/switchboardv2-py-api"},(0,i.kt)("img",{parentName:"a",src:"https://img.shields.io/badge/--181717?logo=github&logoColor=ffffff",alt:"GitHub"}))," ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/switchboard-xyz/switchboardv2-py-api/commit/"},(0,i.kt)("img",{parentName:"a",src:"https://img.shields.io/github/last-commit/switchboard-xyz/switchboardv2-py-api",alt:"GitHub last commit"}))," ",(0,i.kt)("a",{parentName:"p",href:"https://pypi.org/project/switchboardpy/"},(0,i.kt)("img",{parentName:"a",src:"https://img.shields.io/pypi/v/switchboardpy",alt:"PyPI"}))," ",(0,i.kt)("img",{alt:"Page Last Updated",src:r(6213).Z})),(0,i.kt)("p",null,"SwitchboardPy is the Python client for ",(0,i.kt)("a",{parentName:"p",href:"https://docs.switchboard.xyz/introduction"},"Switchboard"),". It provides wrappers to help you to interact with the Switchboard V2 program on-chain."),(0,i.kt)("p",null,"Internally it uses ",(0,i.kt)("a",{parentName:"p",href:"https://kevinheavey.github.io/anchorpy/"},"AnchorPy"),", an Anchor API implementation in Python."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"switchboardpy/aggregator"},"Aggregator")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"switchboardpy/common"},"Common")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"switchboardpy/crank"},"Crank")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"switchboardpy/job"},"Job")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"switchboardpy/lease"},"Lease")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"switchboardpy/oracle"},"Oracle")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"switchboardpy/oraclequeue"},"OracleQueue")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"switchboardpy/permission"},"Permission")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"switchboardpy/program"},"Program"))),(0,i.kt)("h2",{id:"install"},"Install"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"pip install switchboardpy\n")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Documentation:")," ",(0,i.kt)("a",{parentName:"p",href:"/api/switchboardpy"},"/api/switchboardpy"),", ",(0,i.kt)("a",{parentName:"p",href:"https://pypi.org/project/switchboardpy/"},"pypi - switchboardpy")," ",(0,i.kt)(o.lzP,{className:"devicons",mdxType:"GoLinkExternal"})),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},'import asyncio\nfrom solana.keypair import Keypair\nfrom solana.publickey import PublicKey\nfrom solana.rpc.async_api import AsyncClient\nfrom anchorpy import Program, Provider, Wallet\n\nfrom switchboardpy import AggregatorAccount, AccountParams\n\n# Devnet Program ID.\nSBV2_DEVNET_PID = PublicKey(\n    \'2TfB33aLaneQb5TNVwyDz3jSZXS6jdW2ARw1Dgf84XCG\'\n)\n\nasync def main():\n    client = AsyncClient("https://api.devnet.solana.com/")\n    provider = Provider(client, Wallet(Keypair()))\n    program = await Program.at(\n        SBV2_DEVNET_PID, provider\n    )\n    agg = AggregatorAccount(AccountParams(program=program, public_key=PublicKey("88FX4tBstuwBPNhQU4EEBoPX35neSu4Le9zDSwtPRRQz")))\n\n    # getting aggregator data\n    data = await agg.load_data()\n\n    # getting most recent value (decimal.Decimal)\n    val = await agg.get_latest_value()\n\n    print(\'LATEST VALUE:\')\n    print(val)\n\n    await program.close()\n\nasyncio.run(main())\n\n"""\nOUTPUT\nLATEST VALUE:\n180.12115\n"""\n')))}u.isMDXComponent=!0},5668:function(t,e,r){r.d(e,{w_:function(){return p}});var a=r(7378),n={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},i=a.createContext&&a.createContext(n),o=function(){return o=Object.assign||function(t){for(var e,r=1,a=arguments.length;r<a;r++)for(var n in e=arguments[r])Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t},o.apply(this,arguments)},l=function(t,e){var r={};for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&e.indexOf(a)<0&&(r[a]=t[a]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(a=Object.getOwnPropertySymbols(t);n<a.length;n++)e.indexOf(a[n])<0&&Object.prototype.propertyIsEnumerable.call(t,a[n])&&(r[a[n]]=t[a[n]])}return r};function c(t){return t&&t.map((function(t,e){return a.createElement(t.tag,o({key:e},t.attr),c(t.child))}))}function p(t){return function(e){return a.createElement(s,o({attr:o({},t.attr)},e),c(t.child))}}function s(t){var e=function(e){var r,n=t.attr,i=t.size,c=t.title,p=l(t,["attr","size","title"]),s=i||e.size||"1em";return e.className&&(r=e.className),t.className&&(r=(r?r+" ":"")+t.className),a.createElement("svg",o({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},e.attr,n,p,{className:r,style:o(o({color:t.color||e.color},e.style),t.style),height:s,width:s,xmlns:"http://www.w3.org/2000/svg"}),c&&a.createElement("title",null,c),t.children)};return void 0!==i?a.createElement(i.Consumer,null,(function(t){return e(t)})):e(n)}},6213:function(t,e){e.Z="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTkwIiBoZWlnaHQ9IjIwIiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlBhZ2UgTGFzdFVwZGF0ZWQ6IEZlYi0xOC0yMDIyIj48dGl0bGU+UGFnZSBMYXN0VXBkYXRlZDogRmViLTE4LTIwMjI8L3RpdGxlPjxsaW5lYXJHcmFkaWVudCBpZD0icyIgeDI9IjAiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYmIiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iLjEiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iciI+PHJlY3Qgd2lkdGg9IjE5MCIgaGVpZ2h0PSIyMCIgcng9IjMiIGZpbGw9IiNmZmYiLz48L2NsaXBQYXRoPjxnIGNsaXAtcGF0aD0idXJsKCNyKSI+PHJlY3Qgd2lkdGg9IjEwOSIgaGVpZ2h0PSIyMCIgZmlsbD0iIzU1NSIvPjxyZWN0IHg9IjEwOSIgd2lkdGg9IjgxIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDA3ZWM2Ii8+PHJlY3Qgd2lkdGg9IjE5MCIgaGVpZ2h0PSIyMCIgZmlsbD0idXJsKCNzKSIvPjwvZz48ZyBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iVmVyZGFuYSxHZW5ldmEsRGVqYVZ1IFNhbnMsc2Fucy1zZXJpZiIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgZm9udC1zaXplPSIxMTAiPjx0ZXh0IGFyaWEtaGlkZGVuPSJ0cnVlIiB4PSI1NTUiIHk9IjE1MCIgZmlsbD0iIzAxMDEwMSIgZmlsbC1vcGFjaXR5PSIuMyIgdHJhbnNmb3JtPSJzY2FsZSguMSkiIHRleHRMZW5ndGg9Ijk5MCI+UGFnZSBMYXN0VXBkYXRlZDwvdGV4dD48dGV4dCB4PSI1NTUiIHk9IjE0MCIgdHJhbnNmb3JtPSJzY2FsZSguMSkiIGZpbGw9IiNmZmYiIHRleHRMZW5ndGg9Ijk5MCI+UGFnZSBMYXN0VXBkYXRlZDwvdGV4dD48dGV4dCBhcmlhLWhpZGRlbj0idHJ1ZSIgeD0iMTQ4NSIgeT0iMTUwIiBmaWxsPSIjMDEwMTAxIiBmaWxsLW9wYWNpdHk9Ii4zIiB0cmFuc2Zvcm09InNjYWxlKC4xKSIgdGV4dExlbmd0aD0iNzEwIj5GZWItMTgtMjAyMjwvdGV4dD48dGV4dCB4PSIxNDg1IiB5PSIxNDAiIHRyYW5zZm9ybT0ic2NhbGUoLjEpIiBmaWxsPSIjZmZmIiB0ZXh0TGVuZ3RoPSI3MTAiPkZlYi0xOC0yMDIyPC90ZXh0PjwvZz48L3N2Zz4="}}]);