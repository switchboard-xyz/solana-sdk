"use strict";(self.webpackChunk_switchboard_xyz_v2_docs=self.webpackChunk_switchboard_xyz_v2_docs||[]).push([[3300],{5318:function(e,t,n){n.d(t,{Zo:function(){return i},kt:function(){return f}});var r=n(7378);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},i=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,i=u(e,["components","mdxType","originalType","parentName"]),d=c(n),f=a,m=d["".concat(s,".").concat(f)]||d[f]||p[f]||o;return n?r.createElement(m,l(l({ref:t},i),{},{components:n})):r.createElement(m,l({ref:t},i))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=d;var u={};for(var s in t)hasOwnProperty.call(t,s)&&(u[s]=t[s]);u.originalType=e,u.mdxType="string"==typeof e?e:a,l[1]=u;for(var c=2;c<o;c++)l[c]=n[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3167:function(e,t,n){var r=n(7378);t.Z=function(e){var t=e.children,n=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},1884:function(e,t,n){n.d(t,{Z:function(){return d}});var r=n(5773),a=n(7378),o=n(4954),l=n(5880);var u=function(){var e=(0,a.useContext)(l.Z);if(null==e)throw new Error('"useUserPreferencesContext" is used outside of "Layout" component.');return e},s=n(1050),c=n(8944),i="tabItem_vU9c";function p(e){var t,n,o,l=e.lazy,p=e.block,d=e.defaultValue,f=e.values,m=e.groupId,v=e.className,g=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=f?f:g.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),h=(0,s.lx)(b,(function(e,t){return e.value===t.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===d?d:null!=(t=null!=d?d:null==(n=g.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(o=g[0])?void 0:o.props.value;if(null!==y&&!b.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+b.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=u(),w=k.tabGroupChoices,_=k.setTabGroupChoices,x=(0,a.useState)(y),O=x[0],E=x[1],N=[],P=(0,s.o5)().blockElementScrollPositionUntilNextRender;if(null!=m){var T=w[m];null!=T&&T!==O&&b.some((function(e){return e.value===T}))&&E(T)}var A=function(e){var t=e.currentTarget,n=N.indexOf(t),r=b[n].value;r!==O&&(P(t),E(r),null!=m&&_(m,r))},j=function(e){var t,n=null;switch(e.key){case"ArrowRight":var r=N.indexOf(e.currentTarget)+1;n=N[r]||N[0];break;case"ArrowLeft":var a=N.indexOf(e.currentTarget)-1;n=N[a]||N[N.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,c.Z)("tabs",{"tabs--block":p},v)},b.map((function(e){var t=e.value,n=e.label,o=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:O===t?0:-1,"aria-selected":O===t,key:t,ref:function(e){return N.push(e)},onKeyDown:j,onFocus:A,onClick:A},o,{className:(0,c.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":O===t})}),null!=n?n:t)}))),l?(0,a.cloneElement)(g.filter((function(e){return e.props.value===O}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},g.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==O})}))))}function d(e){var t=(0,o.Z)();return a.createElement(p,(0,r.Z)({key:String(t)},e))}},5867:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return p},default:function(){return v},frontMatter:function(){return i},metadata:function(){return d},toc:function(){return f}});var r=n(5773),a=n(808),o=(n(7378),n(5318)),l=n(1884),u=n(3167),s=n(1596),c=["components"],i={sidebar_position:10,slug:"/developers/rs",title:"Rust"},p=void 0,d={unversionedId:"developers/rust",id:"developers/rust",title:"Rust",description:"Install",source:"@site/docs/developers/rust.mdx",sourceDirName:"developers",slug:"/developers/rs",permalink:"/developers/rs",tags:[],version:"current",sidebarPosition:10,frontMatter:{sidebar_position:10,slug:"/developers/rs",title:"Rust"},sidebar:"tutorialSidebar",previous:{title:"Python",permalink:"/developers/py"},next:{title:"CLI",permalink:"/developers/cli"}},f=[{value:"Install",id:"install",children:[],level:2},{value:"Reading Feeds",id:"reading-feeds",children:[],level:2},{value:"Examples",id:"examples",children:[],level:2}],m={toc:f};function v(e){var t=e.components,n=(0,a.Z)(e,c);return(0,o.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"install"},"Install"),(0,o.kt)("p",null,"Add the following line to your Cargo.toml file:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-toml"},'switchboard-v2 = "0.1.4"\n')),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Documentation:")," ",(0,o.kt)("a",{parentName:"p",href:"https://crates.io/crates/switchboard-v2"},"crates.io ",(0,o.kt)(s.lzP,{className:"devicons",mdxType:"GoLinkExternal"})),", ",(0,o.kt)("a",{parentName:"p",href:"https://docs.rs/switchboard-v2"},"docs.rs ",(0,o.kt)(s.lzP,{className:"devicons",mdxType:"GoLinkExternal"}))),(0,o.kt)("h2",{id:"reading-feeds"},"Reading Feeds"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},"use switchboard_v2::AggregatorAccountData;\nuse std::convert::TryInto;\n\nlet feed_result = AggregatorAccountData::new(feed_account_info)?.get_result()?;\n\nlet decimal: f64 = feed_result.try_into()?;\n")),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://docs.rs/switchboard-v2/latest/switchboard_v2/aggregator/struct.AggregatorAccountData.html#method.get_result"},"Docs ",(0,o.kt)(s.lzP,{className:"devicons",mdxType:"GoLinkExternal"}))),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)(l.Z,{mdxType:"Tabs"},(0,o.kt)(u.Z,{value:"anchor",label:"Anchor",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},'#[allow(unaligned_references)]\nuse anchor_lang::prelude::*;\nuse std::convert::TryInto;\npub use switchboard_v2::AggregatorAccountData;\n\ndeclare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");\n\n#[derive(Accounts)]\n#[instruction(params: ReadResultParams)]\npub struct ReadResult<\'info> {\n    pub aggregator: AccountInfo<\'info>,\n}\n\n#[derive(Clone, AnchorSerialize, AnchorDeserialize)]\npub struct ReadResultParams {}\n\n#[program]\npub mod anchor_feed_parser {\n    use super::*;\n\n    pub fn read_result(ctx: Context<ReadResult>, _params: ReadResultParams) -> ProgramResult {\n        let aggregator = &ctx.accounts.aggregator;\n        let val: f64 = AggregatorAccountData::new(aggregator)?.get_result()?.try_into()?;\n\n        msg!("Current feed result is {}!", val);\n        Ok(())\n    }\n}\n'))),(0,o.kt)(u.Z,{value:"solana",label:"Solana",default:!0,mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},"pub use anchor_lang::prelude::*;\npub use solana_program::{\n    account_info::{next_account_info, AccountInfo},\n    entrypoint,\n    entrypoint::ProgramResult,\n    msg,\n};\nuse std::convert::TryInto;\npub use switchboard_v2::AggregatorAccountData;\n\nentrypoint!(process_instruction);\n\nfn process_instruction<'a>(\n    _program_id: &'a Pubkey,\n    accounts: &'a [AccountInfo],\n    _instruction_data: &'a [u8],\n) -> ProgramResult {\n    let accounts_iter = &mut accounts.iter();\n    let aggregator = next_account_info(accounts_iter)?;\n\n    let val: f64 = AggregatorAccountData::new(aggregator)?.get_result()?.try_into()?;\n\n    msg!(\"Current feed result is {}!\", val);\n    Ok(())\n}\n")))))}v.isMDXComponent=!0},5668:function(e,t,n){n.d(t,{w_:function(){return c}});var r=n(7378),a={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},o=r.createContext&&r.createContext(a),l=function(){return l=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var a in t=arguments[n])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e},l.apply(this,arguments)},u=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]])}return n};function s(e){return e&&e.map((function(e,t){return r.createElement(e.tag,l({key:t},e.attr),s(e.child))}))}function c(e){return function(t){return r.createElement(i,l({attr:l({},e.attr)},t),s(e.child))}}function i(e){var t=function(t){var n,a=e.attr,o=e.size,s=e.title,c=u(e,["attr","size","title"]),i=o||t.size||"1em";return t.className&&(n=t.className),e.className&&(n=(n?n+" ":"")+e.className),r.createElement("svg",l({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,a,c,{className:n,style:l(l({color:e.color||t.color},t.style),e.style),height:i,width:i,xmlns:"http://www.w3.org/2000/svg"}),s&&r.createElement("title",null,s),e.children)};return void 0!==o?r.createElement(o.Consumer,null,(function(e){return t(e)})):t(a)}}}]);