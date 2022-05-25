"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6945],{5318:function(e,r,t){t.d(r,{Zo:function(){return l},kt:function(){return v}});var n=t(7378);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function o(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function u(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var p=n.createContext({}),c=function(e){var r=n.useContext(p),t=r;return e&&(t="function"==typeof e?e(r):o(o({},r),e)),t},l=function(e){var r=c(e.components);return n.createElement(p.Provider,{value:r},e.children)},s={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},f=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),f=c(t),v=a,y=f["".concat(p,".").concat(v)]||f[v]||s[v]||i;return t?n.createElement(y,o(o({ref:r},l),{},{components:t})):n.createElement(y,o({ref:r},l))}));function v(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var i=t.length,o=new Array(i);o[0]=f;var u={};for(var p in r)hasOwnProperty.call(r,p)&&(u[p]=r[p]);u.originalType=e,u.mdxType="string"==typeof e?e:a,o[1]=u;for(var c=2;c<i;c++)o[c]=t[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,t)}f.displayName="MDXCreateElement"},7047:function(e,r,t){t.r(r),t.d(r,{assets:function(){return v},contentTitle:function(){return s},default:function(){return b},frontMatter:function(){return l},metadata:function(){return f},toc:function(){return y}});var n=t(2685),a=t(1244),i=(t(7378),t(5318)),o=["components"],u={toc:[{value:"<code>sbv2 vrf:create QUEUEKEY</code>",id:"sbv2-vrfcreate-queuekey",level:2},{value:"<code>sbv2 vrf:create:example QUEUEKEY</code>",id:"sbv2-vrfcreateexample-queuekey",level:2},{value:"<code>sbv2 vrf:request VRFKEY</code>",id:"sbv2-vrfrequest-vrfkey",level:2}]};function p(e){var r=e.components,t=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,n.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"create a Switchboard VRF Account"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#sbv2-vrfcreate-queuekey"},(0,i.kt)("inlineCode",{parentName:"a"},"sbv2 vrf:create QUEUEKEY"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#sbv2-vrfcreateexample-queuekey"},(0,i.kt)("inlineCode",{parentName:"a"},"sbv2 vrf:create:example QUEUEKEY"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#sbv2-vrfrequest-vrfkey"},(0,i.kt)("inlineCode",{parentName:"a"},"sbv2 vrf:request VRFKEY")))),(0,i.kt)("h2",{id:"sbv2-vrfcreate-queuekey"},(0,i.kt)("inlineCode",{parentName:"h2"},"sbv2 vrf:create QUEUEKEY")),(0,i.kt)("p",null,"create a Switchboard VRF Account"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'USAGE\n  $ sbv2 vrf:create QUEUEKEY\n\nARGUMENTS\n  QUEUEKEY  public key of the oracle queue to create VRF account for\n\nOPTIONS\n  -a, --accountMeta=accountMeta    (required) account metas for VRF callback\n  -h, --help                       show CLI help\n\n  -k, --keypair=keypair            keypair that will pay for onchain transactions. defaults to new account authority if\n                                   no alternate authority provided\n\n  -s, --silent                     suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl              alternate RPC url\n\n  -v, --verbose                    log everything\n\n  --authority=authority            alternative keypair to use for VRF authority\n\n  --callbackPid=callbackPid        (required) callback program ID\n\n  --enable                         enable vrf permissions\n\n  --ixData=ixData                  (required) instruction data\n\n  --mainnetBeta                    WARNING: use mainnet-beta solana cluster\n\n  --programId=programId            alternative Switchboard program ID to interact with\n\n  --queueAuthority=queueAuthority  alternative keypair to use for queue authority\n\n  --vrfKeypair=vrfKeypair          filesystem path of existing keypair to use for VRF Account\n\nEXAMPLES\n  sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable \n  --queueAuthority queue-authority-keypair.json --callbackPid 6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --ixData \n  "[145,72,9,94,61,97,126,106]" -a "{"pubkey": "HpQoFL5kxPp2JCFvjsVTvBd7navx4THLefUU68SXAyd6","isSigner": \n  false,"isWritable": true}" -a "{"pubkey": "8VdBtS8ufkXMCa6Yr9E4KVCfX2inVZVwU4KGg2CL1q7P","isSigner": \n  false,"isWritable": false}"\n  sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable \n  --queueAuthority oracle-keypair.json --callbackPid 6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --ixData \n  "[145,72,9,94,61,97,126,106]" -a "{"pubkey": "HYKi1grticLXPe5vqapUHhm976brwqRob8vqRnWMKWL5","isSigner": \n  false,"isWritable": true}" -a "{"pubkey": "6vG9QLMgSvsfjvSpDxWfZ2MGPYGzEYoBxviLG7cr4go","isSigner": \n  false,"isWritable": false}"\n')),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"See code: ",(0,i.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/vrf/create/index.ts"},"src/commands/vrf/create/index.ts"))),(0,i.kt)("h2",{id:"sbv2-vrfcreateexample-queuekey"},(0,i.kt)("inlineCode",{parentName:"h2"},"sbv2 vrf:create:example QUEUEKEY")),(0,i.kt)("p",null,"create a VRF account for the client example program"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 vrf:create:example QUEUEKEY\n\nARGUMENTS\n  QUEUEKEY  public key of the oracle queue to create VRF account for\n\nOPTIONS\n  -h, --help                       show CLI help\n\n  -k, --keypair=keypair            keypair that will pay for onchain transactions. defaults to new account authority if\n                                   no alternate authority provided\n\n  -s, --silent                     suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl              alternate RPC url\n\n  -v, --verbose                    log everything\n\n  --enable                         enable vrf permissions\n\n  --mainnetBeta                    WARNING: use mainnet-beta solana cluster\n\n  --maxResult=maxResult            [default: 256000] the maximum VRF result\n\n  --programId=programId            alternative Switchboard program ID to interact with\n\n  --queueAuthority=queueAuthority  alternative keypair to use for queue authority\n\n  --vrfKeypair=vrfKeypair          filesystem path of existing keypair to use for VRF Account\n\n  --vrfPid=vrfPid                  (required) program ID for the VRF example program\n\nEXAMPLE\n  sbv2 vrf:create:example 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --vrfPid \n  6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --keypair ../payer-keypair.json -v --enable --queueAuthority \n  queue-authority-keypair.json\n")),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"See code: ",(0,i.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/vrf/create/example.ts"},"src/commands/vrf/create/example.ts"))),(0,i.kt)("h2",{id:"sbv2-vrfrequest-vrfkey"},(0,i.kt)("inlineCode",{parentName:"h2"},"sbv2 vrf:request VRFKEY")),(0,i.kt)("p",null,"request a new value for a VRF"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'USAGE\n  $ sbv2 vrf:request VRFKEY\n\nARGUMENTS\n  VRFKEY  public key of the VRF account to request randomness for\n\nOPTIONS\n  -h, --help                         show CLI help\n\n  -k, --keypair=keypair              keypair that will pay for onchain transactions. defaults to new account authority\n                                     if no alternate authority provided\n\n  -s, --silent                       suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl                alternate RPC url\n\n  -v, --verbose                      log everything\n\n  --authority=authority              alternative keypair that is the VRF authority\n\n  --funderAuthority=funderAuthority  alternative keypair to pay for VRF request\n\n  --mainnetBeta                      WARNING: use mainnet-beta solana cluster\n\n  --programId=programId              alternative Switchboard program ID to interact with\n\nEXAMPLE\n  sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable \n  --queueAuthority queue-authority-keypair.json --callbackPid 6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --ixData \n  "[145,72,9,94,61,97,126,106]" -a "{"pubkey": "HpQoFL5kxPp2JCFvjsVTvBd7navx4THLefUU68SXAyd6","isSigner": \n  false,"isWritable": true}" -a "{"pubkey": "8VdBtS8ufkXMCa6Yr9E4KVCfX2inVZVwU4KGg2CL1q7P","isSigner": \n  false,"isWritable": false}"\n')),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"See code: ",(0,i.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/vrf/request.ts"},"src/commands/vrf/request.ts"))))}p.isMDXComponent=!0;var c=["components"],l={sidebar_position:80,title:"sbv2 vrf"},s=void 0,f={unversionedId:"cli/vrf",id:"cli/vrf",title:"sbv2 vrf",description:"",source:"@site/api/cli/vrf.mdx",sourceDirName:"cli",slug:"/cli/vrf",permalink:"/api/cli/vrf",tags:[],version:"current",sidebarPosition:80,frontMatter:{sidebar_position:80,title:"sbv2 vrf"},sidebar:"tutorialSidebar",previous:{title:"sbv2 queue",permalink:"/api/cli/queue"},next:{title:"sbv2 update",permalink:"/api/cli/update"}},v={},y=[],m={toc:y};function b(e){var r=e.components,t=(0,a.Z)(e,c);return(0,i.kt)("wrapper",(0,n.Z)({},m,t,{components:r,mdxType:"MDXLayout"}),(0,i.kt)(p,{mdxType:"Sbv2Vrf"}))}b.isMDXComponent=!0}}]);