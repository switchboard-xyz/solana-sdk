"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9427],{5318:function(e,t,a){a.d(t,{Zo:function(){return p},kt:function(){return h}});var r=a(7378);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function g(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var s=r.createContext({}),l=function(e){var t=r.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=l(e.components);return r.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,p=g(e,["components","mdxType","originalType","parentName"]),u=l(a),h=n,m=u["".concat(s,".").concat(h)]||u[h]||c[h]||o;return a?r.createElement(m,i(i({ref:t},p),{},{components:a})):r.createElement(m,i({ref:t},p))}));function h(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,i=new Array(o);i[0]=u;var g={};for(var s in t)hasOwnProperty.call(t,s)&&(g[s]=t[s]);g.originalType=e,g.mdxType="string"==typeof e?e:n,i[1]=g;for(var l=2;l<o;l++)i[l]=a[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,a)}u.displayName="MDXCreateElement"},2836:function(e,t,a){a.r(t),a.d(t,{assets:function(){return h},contentTitle:function(){return c},default:function(){return y},frontMatter:function(){return p},metadata:function(){return u},toc:function(){return m}});var r=a(2685),n=a(1244),o=(a(7378),a(5318)),i=["components"],g={toc:[{value:"<code>sbv2 aggregator:add:job AGGREGATORKEY</code>",id:"sbv2-aggregatoraddjob-aggregatorkey",level:2},{value:"<code>sbv2 aggregator:create:copy AGGREGATORSOURCE</code>",id:"sbv2-aggregatorcreatecopy-aggregatorsource",level:2},{value:"<code>sbv2 aggregator:create:json DEFINITIONFILE</code>",id:"sbv2-aggregatorcreatejson-definitionfile",level:2},{value:"<code>sbv2 aggregator:lock AGGREGATORKEY</code>",id:"sbv2-aggregatorlock-aggregatorkey",level:2},{value:"<code>sbv2 aggregator:permission:create AGGREGATORKEY</code>",id:"sbv2-aggregatorpermissioncreate-aggregatorkey",level:2},{value:"<code>sbv2 aggregator:remove:job AGGREGATORKEY JOBKEY</code>",id:"sbv2-aggregatorremovejob-aggregatorkey-jobkey",level:2},{value:"<code>sbv2 aggregator:set AGGREGATORKEY</code>",id:"sbv2-aggregatorset-aggregatorkey",level:2},{value:"<code>sbv2 aggregator:set:authority AGGREGATORKEY NEWAUTHORITY</code>",id:"sbv2-aggregatorsetauthority-aggregatorkey-newauthority",level:2},{value:"<code>sbv2 aggregator:set:batchSize AGGREGATORKEY BATCHSIZE</code>",id:"sbv2-aggregatorsetbatchsize-aggregatorkey-batchsize",level:2},{value:"<code>sbv2 aggregator:set:forceReportPeriod AGGREGATORKEY FORCEREPORTPERIOD</code>",id:"sbv2-aggregatorsetforcereportperiod-aggregatorkey-forcereportperiod",level:2},{value:"<code>sbv2 aggregator:set:history AGGREGATORKEY SIZE</code>",id:"sbv2-aggregatorsethistory-aggregatorkey-size",level:2},{value:"<code>sbv2 aggregator:set:minJobs AGGREGATORKEY MINJOBRESULTS</code>",id:"sbv2-aggregatorsetminjobs-aggregatorkey-minjobresults",level:2},{value:"<code>sbv2 aggregator:set:minOracles AGGREGATORKEY MINORACLERESULTS</code>",id:"sbv2-aggregatorsetminoracles-aggregatorkey-minoracleresults",level:2},{value:"<code>sbv2 aggregator:set:queue AGGREGATORKEY QUEUEKEY</code>",id:"sbv2-aggregatorsetqueue-aggregatorkey-queuekey",level:2},{value:"<code>sbv2 aggregator:set:updateInterval AGGREGATORKEY UPDATEINTERVAL</code>",id:"sbv2-aggregatorsetupdateinterval-aggregatorkey-updateinterval",level:2},{value:"<code>sbv2 aggregator:set:varianceThreshold AGGREGATORKEY VARIANCETHRESHOLD</code>",id:"sbv2-aggregatorsetvariancethreshold-aggregatorkey-variancethreshold",level:2},{value:"<code>sbv2 aggregator:update AGGREGATORKEY</code>",id:"sbv2-aggregatorupdate-aggregatorkey",level:2}]};function s(e){var t=e.components,a=(0,n.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},g,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"interact with a switchboard aggregator account"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatoraddjob-aggregatorkey"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:add:job AGGREGATORKEY"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorcreatecopy-aggregatorsource"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:create:copy AGGREGATORSOURCE"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorcreatejson-definitionfile"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:create:json DEFINITIONFILE"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorlock-aggregatorkey"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:lock AGGREGATORKEY"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorpermissioncreate-aggregatorkey"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:permission:create AGGREGATORKEY"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorremovejob-aggregatorkey-jobkey"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:remove:job AGGREGATORKEY JOBKEY"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorset-aggregatorkey"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:set AGGREGATORKEY"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorsetauthority-aggregatorkey-newauthority"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:set:authority AGGREGATORKEY NEWAUTHORITY"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorsetbatchsize-aggregatorkey-batchsize"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:set:batchSize AGGREGATORKEY BATCHSIZE"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorsetforcereportperiod-aggregatorkey-forcereportperiod"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:set:forceReportPeriod AGGREGATORKEY FORCEREPORTPERIOD"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorsethistory-aggregatorkey-size"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:set:history AGGREGATORKEY SIZE"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorsetminjobs-aggregatorkey-minjobresults"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:set:minJobs AGGREGATORKEY MINJOBRESULTS"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorsetminoracles-aggregatorkey-minoracleresults"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:set:minOracles AGGREGATORKEY MINORACLERESULTS"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorsetqueue-aggregatorkey-queuekey"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:set:queue AGGREGATORKEY QUEUEKEY"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorsetupdateinterval-aggregatorkey-updateinterval"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:set:updateInterval AGGREGATORKEY UPDATEINTERVAL"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorsetvariancethreshold-aggregatorkey-variancethreshold"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:set:varianceThreshold AGGREGATORKEY VARIANCETHRESHOLD"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#sbv2-aggregatorupdate-aggregatorkey"},(0,o.kt)("inlineCode",{parentName:"a"},"sbv2 aggregator:update AGGREGATORKEY")))),(0,o.kt)("h2",{id:"sbv2-aggregatoraddjob-aggregatorkey"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:add:job AGGREGATORKEY")),(0,o.kt)("p",null,"add a job account to an aggregator"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:add:job AGGREGATORKEY\n\nARGUMENTS\n  AGGREGATORKEY  public key of the aggregator account\n\nOPTIONS\n  -a, --aggregatorAuthority=aggregatorAuthority  alternate keypair that is the authority for the aggregator\n  -f, --outputFile=outputFile                    output file to save aggregator definition to\n  -h, --help                                     show CLI help\n\n  -k, --keypair=keypair                          keypair that will pay for onchain transactions. defaults to new account\n                                                 authority if no alternate authority provided\n\n  -s, --silent                                   suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl                            alternate RPC url\n\n  -v, --verbose                                  log everything\n\n  --force                                        overwrite outputFile if existing\n\n  --jobDefinition=jobDefinition                  filesystem path of job json definition file\n\n  --jobKey=jobKey                                public key of an existing job account to add to an aggregator\n\n  --mainnetBeta                                  WARNING: use mainnet-beta solana cluster\n\n  --programId=programId                          alternative Switchboard program ID to interact with\n\nEXAMPLE\n  $ sbv2 aggregator:add:job\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/add/job.ts"},"src/commands/aggregator/add/job.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorcreatecopy-aggregatorsource"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:create:copy AGGREGATORSOURCE")),(0,o.kt)("p",null,"copy an aggregator account to a new oracle queue"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:create:copy AGGREGATORSOURCE\n\nARGUMENTS\n  AGGREGATORSOURCE  public key of the aggregator account to copy\n\nOPTIONS\n  -a, --authority=authority              alternate keypair that will be the aggregator authority\n  -f, --outputFile=outputFile            output file to save aggregator definition to\n  -h, --help                             show CLI help\n\n  -k, --keypair=keypair                  keypair that will pay for onchain transactions. defaults to new account\n                                         authority if no alternate authority provided\n\n  -s, --silent                           suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl                    alternate RPC url\n\n  -v, --verbose                          log everything\n\n  --batchSize=batchSize                  override source aggregator's oracleRequestBatchSize\n\n  --copyJobs                             create copy of job accounts instead of referincing existing job account\n\n  --crankKey=crankKey                    public key of the crank to push aggregator to\n\n  --enable                               set permissions to PERMIT_ORACLE_QUEUE_USAGE\n\n  --force                                skip job confirmation\n\n  --forceReportPeriod=forceReportPeriod  override source aggregator's forceReportPeriod\n\n  --mainnetBeta                          WARNING: use mainnet-beta solana cluster\n\n  --minJobs=minJobs                      override source aggregator's minJobResults\n\n  --minOracles=minOracles                override source aggregator's minOracleResults\n\n  --minUpdateDelay=minUpdateDelay        override source aggregator's minUpdateDelaySeconds\n\n  --programId=programId                  alternative Switchboard program ID to interact with\n\n  --queueAuthority=queueAuthority        alternative keypair to use for queue authority\n\n  --queueKey=queueKey                    (required) public key of the queue to create aggregator for\n\n  --varianceThreshold=varianceThreshold  override source aggregator's varianceThreshold\n\nEXAMPLES\n  $ sbv2 aggregator:create:copy GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --queueKey \n  9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json\n  $ sbv2 aggregator:create:copy GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --queueKey \n  9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json --sourceCluster mainnet-beta\n  $ sbv2 aggregator:create:copy FcSmdsdWks75YdyCGegRqXdt5BiNGQKxZywyzb8ckD7D --queueKey \n  9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json --sourceCluster mainnet-beta\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/create/copy.ts"},"src/commands/aggregator/create/copy.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorcreatejson-definitionfile"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:create:json DEFINITIONFILE")),(0,o.kt)("p",null,"create an aggregator from a json file"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:create:json DEFINITIONFILE\n\nARGUMENTS\n  DEFINITIONFILE  filesystem path of queue definition json file\n\nOPTIONS\n  -a, --authority=authority    alternate keypair that will be the authority for the aggregator\n  -f, --outputFile=outputFile  output aggregator definition to a json file\n  -h, --help                   show CLI help\n\n  -k, --keypair=keypair        keypair that will pay for onchain transactions. defaults to new account authority if no\n                               alternate authority provided\n\n  -q, --queueKey=queueKey      public key of the oracle queue to create aggregator for\n\n  -s, --silent                 suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl          alternate RPC url\n\n  -v, --verbose                log everything\n\n  --force                      overwrite output file\n\n  --mainnetBeta                WARNING: use mainnet-beta solana cluster\n\n  --programId=programId        alternative Switchboard program ID to interact with\n\nALIASES\n  $ sbv2 json:create:aggregator\n\nEXAMPLE\n  $ sbv2 aggregator:create:json examples/aggregator.json --keypair ../payer-keypair.json --queueKey \n  GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --outputFile aggregator.schema.json\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/create/json.ts"},"src/commands/aggregator/create/json.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorlock-aggregatorkey"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:lock AGGREGATORKEY")),(0,o.kt)("p",null,"lock an aggregator's configuration and prevent further changes"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:lock AGGREGATORKEY\n\nARGUMENTS\n  AGGREGATORKEY  public key of the aggregator account\n\nOPTIONS\n  -a, --authority=authority  alternate keypair that is the authority for the aggregator\n  -h, --help                 show CLI help\n\n  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no\n                             alternate authority provided\n\n  -s, --silent               suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl        alternate RPC url\n\n  -v, --verbose              log everything\n\n  --mainnetBeta              WARNING: use mainnet-beta solana cluster\n\n  --programId=programId      alternative Switchboard program ID to interact with\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/lock.ts"},"src/commands/aggregator/lock.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorpermissioncreate-aggregatorkey"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:permission:create AGGREGATORKEY")),(0,o.kt)("p",null,"create a permission account for an aggregator"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:permission:create AGGREGATORKEY\n\nARGUMENTS\n  AGGREGATORKEY  public key of the aggregator account\n\nOPTIONS\n  -h, --help             show CLI help\n\n  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no\n                         alternate authority provided\n\n  -s, --silent           suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl    alternate RPC url\n\n  -v, --verbose          log everything\n\n  --mainnetBeta          WARNING: use mainnet-beta solana cluster\n\n  --programId=programId  alternative Switchboard program ID to interact with\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/permission/create.ts"},"src/commands/aggregator/permission/create.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorremovejob-aggregatorkey-jobkey"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:remove:job AGGREGATORKEY JOBKEY")),(0,o.kt)("p",null,"remove a switchboard job account from an aggregator"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:remove:job AGGREGATORKEY JOBKEY\n\nARGUMENTS\n  AGGREGATORKEY  public key of the aggregator account\n  JOBKEY         public key of an existing job account to remove from an aggregator\n\nOPTIONS\n  -a, --authority=authority  alternate keypair that is the authority for the aggregator\n  -h, --help                 show CLI help\n\n  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no\n                             alternate authority provided\n\n  -s, --silent               suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl        alternate RPC url\n\n  -v, --verbose              log everything\n\n  --force                    overwrite outputFile if existing\n\n  --mainnetBeta              WARNING: use mainnet-beta solana cluster\n\n  --programId=programId      alternative Switchboard program ID to interact with\n\nEXAMPLE\n  $ sbv2 aggregator:remove:job\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/remove/job.ts"},"src/commands/aggregator/remove/job.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorset-aggregatorkey"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:set AGGREGATORKEY")),(0,o.kt)("p",null,"set an aggregator's config"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:set AGGREGATORKEY\n\nARGUMENTS\n  AGGREGATORKEY  public key of the aggregator\n\nOPTIONS\n  -a, --authority=authority              alternate keypair that is the authority for the aggregator\n  -h, --help                             show CLI help\n\n  -k, --keypair=keypair                  keypair that will pay for onchain transactions. defaults to new account\n                                         authority if no alternate authority provided\n\n  -s, --silent                           suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl                    alternate RPC url\n\n  -v, --verbose                          log everything\n\n  --forceReportPeriod=forceReportPeriod  Number of seconds for which, even if the variance threshold is not passed,\n                                         accept new responses from oracles.\n\n  --mainnetBeta                          WARNING: use mainnet-beta solana cluster\n\n  --minJobs=minJobs                      number of jobs that must respond before an oracle responds\n\n  --minOracles=minOracles                number of oracles that must respond before a value is accepted on-chain\n\n  --newQueue=newQueue                    public key of the new oracle queue\n\n  --programId=programId                  alternative Switchboard program ID to interact with\n\n  --updateInterval=updateInterval        set an aggregator's minimum update delay\n\n  --varianceThreshold=varianceThreshold  percentage change between a previous accepted result and the next round before\n                                         an oracle reports a value on-chain. Used to conserve lease cost during low\n                                         volatility\n\nALIASES\n  $ sbv2 set:aggregator\n\nEXAMPLE\n  $ sbv2 aggregator:set GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --updateInterval 300 --minOracles 3 --keypair \n  ../payer-keypair.json\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/set/index.ts"},"src/commands/aggregator/set/index.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorsetauthority-aggregatorkey-newauthority"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:set:authority AGGREGATORKEY NEWAUTHORITY")),(0,o.kt)("p",null,"set an aggregator's authority"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:set:authority AGGREGATORKEY NEWAUTHORITY\n\nARGUMENTS\n  AGGREGATORKEY  public key of the aggregator account\n  NEWAUTHORITY   keypair path of new authority\n\nOPTIONS\n  -a, --currentAuthority=currentAuthority  alternate keypair that is the authority for the aggregator\n  -h, --help                               show CLI help\n\n  -k, --keypair=keypair                    keypair that will pay for onchain transactions. defaults to new account\n                                           authority if no alternate authority provided\n\n  -s, --silent                             suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl                      alternate RPC url\n\n  -v, --verbose                            log everything\n\n  --mainnetBeta                            WARNING: use mainnet-beta solana cluster\n\n  --programId=programId                    alternative Switchboard program ID to interact with\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/set/authority.ts"},"src/commands/aggregator/set/authority.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorsetbatchsize-aggregatorkey-batchsize"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:set:batchSize AGGREGATORKEY BATCHSIZE")),(0,o.kt)("p",null,"set an aggregator's batch size"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:set:batchSize AGGREGATORKEY BATCHSIZE\n\nARGUMENTS\n  AGGREGATORKEY  public key of the aggregator account\n  BATCHSIZE      number of oracles requested for each open round call\n\nOPTIONS\n  -a, --authority=authority  alternate keypair that is the authority for the aggregator\n  -h, --help                 show CLI help\n\n  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no\n                             alternate authority provided\n\n  -s, --silent               suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl        alternate RPC url\n\n  -v, --verbose              log everything\n\n  --mainnetBeta              WARNING: use mainnet-beta solana cluster\n\n  --programId=programId      alternative Switchboard program ID to interact with\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/set/batchSize.ts"},"src/commands/aggregator/set/batchSize.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorsetforcereportperiod-aggregatorkey-forcereportperiod"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:set:forceReportPeriod AGGREGATORKEY FORCEREPORTPERIOD")),(0,o.kt)("p",null,"set an aggregator's force report period"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:set:forceReportPeriod AGGREGATORKEY FORCEREPORTPERIOD\n\nARGUMENTS\n  AGGREGATORKEY      public key of the aggregator\n\n  FORCEREPORTPERIOD  Number of seconds for which, even if the variance threshold is not passed, accept new responses\n                     from oracles.\n\nOPTIONS\n  -a, --authority=authority  alternate keypair that is the authority for the aggregator\n  -h, --help                 show CLI help\n\n  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no\n                             alternate authority provided\n\n  -s, --silent               suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl        alternate RPC url\n\n  -v, --verbose              log everything\n\n  --mainnetBeta              WARNING: use mainnet-beta solana cluster\n\n  --programId=programId      alternative Switchboard program ID to interact with\n\nALIASES\n  $ sbv2 aggregator:set:forceReport\n\nEXAMPLE\n  $ sbv2 aggregator:set:forceReportPeriod GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 300 --keypair \n  ../payer-keypair.json\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/set/forceReportPeriod.ts"},"src/commands/aggregator/set/forceReportPeriod.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorsethistory-aggregatorkey-size"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:set:history AGGREGATORKEY SIZE")),(0,o.kt)("p",null,"set an aggregator's history buffer account to record the last N accepted results"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:set:history AGGREGATORKEY SIZE\n\nARGUMENTS\n  AGGREGATORKEY  public key of the aggregator to add to a crank\n  SIZE           size of history buffer\n\nOPTIONS\n  -a, --authority=authority  alternate keypair that is the authority for the aggregator\n  -h, --help                 show CLI help\n\n  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no\n                             alternate authority provided\n\n  -s, --silent               suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl        alternate RPC url\n\n  -v, --verbose              log everything\n\n  --mainnetBeta              WARNING: use mainnet-beta solana cluster\n\n  --programId=programId      alternative Switchboard program ID to interact with\n\nALIASES\n  $ sbv2 aggregator:add:history\n\nEXAMPLE\n  $ sbv2 aggregator:set:history GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 10000 --keypair ../payer-keypair.json\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/set/history.ts"},"src/commands/aggregator/set/history.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorsetminjobs-aggregatorkey-minjobresults"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:set:minJobs AGGREGATORKEY MINJOBRESULTS")),(0,o.kt)("p",null,"set an aggregator's minimum number of jobs before an oracle responds"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:set:minJobs AGGREGATORKEY MINJOBRESULTS\n\nARGUMENTS\n  AGGREGATORKEY  public key of the aggregator account\n  MINJOBRESULTS  number of jobs that must respond before an oracle responds\n\nOPTIONS\n  -a, --authority=authority  alternate keypair that is the authority for the aggregator\n  -h, --help                 show CLI help\n\n  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no\n                             alternate authority provided\n\n  -s, --silent               suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl        alternate RPC url\n\n  -v, --verbose              log everything\n\n  --mainnetBeta              WARNING: use mainnet-beta solana cluster\n\n  --programId=programId      alternative Switchboard program ID to interact with\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/set/minJobs.ts"},"src/commands/aggregator/set/minJobs.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorsetminoracles-aggregatorkey-minoracleresults"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:set:minOracles AGGREGATORKEY MINORACLERESULTS")),(0,o.kt)("p",null,"set an aggregator's minimum number of oracles that must respond before a result is accepted on-chain"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:set:minOracles AGGREGATORKEY MINORACLERESULTS\n\nARGUMENTS\n  AGGREGATORKEY     public key of the aggregator account\n  MINORACLERESULTS  number of oracles that must respond before a value is accepted on-chain\n\nOPTIONS\n  -a, --authority=authority  alternate keypair that is the authority for the aggregator\n  -h, --help                 show CLI help\n\n  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no\n                             alternate authority provided\n\n  -s, --silent               suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl        alternate RPC url\n\n  -v, --verbose              log everything\n\n  --mainnetBeta              WARNING: use mainnet-beta solana cluster\n\n  --programId=programId      alternative Switchboard program ID to interact with\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/set/minOracles.ts"},"src/commands/aggregator/set/minOracles.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorsetqueue-aggregatorkey-queuekey"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:set:queue AGGREGATORKEY QUEUEKEY")),(0,o.kt)("p",null,"set an aggregator's oracle queue"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:set:queue AGGREGATORKEY QUEUEKEY\n\nARGUMENTS\n  AGGREGATORKEY  public key of the aggregator\n  QUEUEKEY       public key of the oracle queue\n\nOPTIONS\n  -a, --authority=authority  alternate keypair that is the authority for the aggregator\n  -h, --help                 show CLI help\n\n  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no\n                             alternate authority provided\n\n  -s, --silent               suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl        alternate RPC url\n\n  -v, --verbose              log everything\n\n  --mainnetBeta              WARNING: use mainnet-beta solana cluster\n\n  --programId=programId      alternative Switchboard program ID to interact with\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/set/queue.ts"},"src/commands/aggregator/set/queue.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorsetupdateinterval-aggregatorkey-updateinterval"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:set:updateInterval AGGREGATORKEY UPDATEINTERVAL")),(0,o.kt)("p",null,"set an aggregator's minimum update delay"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:set:updateInterval AGGREGATORKEY UPDATEINTERVAL\n\nARGUMENTS\n  AGGREGATORKEY   public key of the aggregator account\n  UPDATEINTERVAL  set an aggregator's minimum update delay\n\nOPTIONS\n  -a, --authority=authority  alternate keypair that is the authority for the aggregator\n  -h, --help                 show CLI help\n\n  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no\n                             alternate authority provided\n\n  -s, --silent               suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl        alternate RPC url\n\n  -v, --verbose              log everything\n\n  --mainnetBeta              WARNING: use mainnet-beta solana cluster\n\n  --programId=programId      alternative Switchboard program ID to interact with\n\nEXAMPLE\n  $ sbv2 aggregator:set:updateInterval GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 60 --keypair ../payer-keypair.json\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/set/updateInterval.ts"},"src/commands/aggregator/set/updateInterval.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorsetvariancethreshold-aggregatorkey-variancethreshold"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:set:varianceThreshold AGGREGATORKEY VARIANCETHRESHOLD")),(0,o.kt)("p",null,"set an aggregator's variance threshold"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:set:varianceThreshold AGGREGATORKEY VARIANCETHRESHOLD\n\nARGUMENTS\n  AGGREGATORKEY      public key of the aggregator\n\n  VARIANCETHRESHOLD  percentage change between a previous accepted result and the next round before an oracle reports a\n                     value on-chain. Used to conserve lease cost during low volatility\n\nOPTIONS\n  -a, --authority=authority  alternate keypair that is the authority for the aggregator\n  -h, --help                 show CLI help\n\n  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no\n                             alternate authority provided\n\n  -s, --silent               suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl        alternate RPC url\n\n  -v, --verbose              log everything\n\n  --mainnetBeta              WARNING: use mainnet-beta solana cluster\n\n  --programId=programId      alternative Switchboard program ID to interact with\n\nALIASES\n  $ sbv2 aggregator:set:variance\n\nEXAMPLE\n  $ sbv2 aggregator:set:varianceThreshold GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 0.1 --keypair \n  ../payer-keypair.json\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/set/varianceThreshold.ts"},"src/commands/aggregator/set/varianceThreshold.ts"))),(0,o.kt)("h2",{id:"sbv2-aggregatorupdate-aggregatorkey"},(0,o.kt)("inlineCode",{parentName:"h2"},"sbv2 aggregator:update AGGREGATORKEY")),(0,o.kt)("p",null,"request a new aggregator result from a set of oracles"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"USAGE\n  $ sbv2 aggregator:update AGGREGATORKEY\n\nARGUMENTS\n  AGGREGATORKEY  public key of the aggregator account to deserialize\n\nOPTIONS\n  -h, --help             show CLI help\n\n  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no\n                         alternate authority provided\n\n  -s, --silent           suppress cli prompts\n\n  -u, --rpcUrl=rpcUrl    alternate RPC url\n\n  -v, --verbose          log everything\n\n  --mainnetBeta          WARNING: use mainnet-beta solana cluster\n\n  --programId=programId  alternative Switchboard program ID to interact with\n\nEXAMPLE\n  $ sbv2 aggregator:update J7j9xX8JP2B2ErvUzuqGAKBGeggsxPyFXj5MqZcYDxfa --keypair ../payer-keypair.json\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"See code: ",(0,o.kt)("a",{parentName:"em",href:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/aggregator/update.ts"},"src/commands/aggregator/update.ts"))))}s.isMDXComponent=!0;var l=["components"],p={sidebar_position:20,title:"sbv2 aggregator"},c=void 0,u={unversionedId:"cli/aggregator",id:"cli/aggregator",title:"sbv2 aggregator",description:"",source:"@site/api/cli/aggregator.mdx",sourceDirName:"cli",slug:"/cli/aggregator",permalink:"/api/cli/aggregator",tags:[],version:"current",sidebarPosition:20,frontMatter:{sidebar_position:20,title:"sbv2 aggregator"},sidebar:"tutorialSidebar",previous:{title:"sbv2 job",permalink:"/api/cli/job"},next:{title:"sbv2 lease",permalink:"/api/cli/lease"}},h={},m=[],d={toc:m};function y(e){var t=e.components,a=(0,n.Z)(e,l);return(0,o.kt)("wrapper",(0,r.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)(s,{mdxType:"Sbv2Aggregator"}))}y.isMDXComponent=!0}}]);