"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5198],{5318:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return d}});var r=n(7378);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=r.createContext({}),p=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(i.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),m=p(n),d=a,f=m["".concat(i,".").concat(d)]||m[d]||s[d]||o;return n?r.createElement(f,l(l({ref:t},c),{},{components:n})):r.createElement(f,l({ref:t},c))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=m;var u={};for(var i in t)hasOwnProperty.call(t,i)&&(u[i]=t[i]);u.originalType=e,u.mdxType="string"==typeof e?e:a,l[1]=u;for(var p=2;p<o;p++)l[p]=n[p];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},9633:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return i},default:function(){return d},frontMatter:function(){return u},metadata:function(){return p},toc:function(){return s}});var r=n(5773),a=n(808),o=(n(7378),n(5318)),l=["components"],u={sidebar_position:20,slug:"/oracle/gcp/automated-setup"},i="Automated Setup",p={unversionedId:"oracle/gcp/automated",id:"oracle/gcp/automated",title:"Automated Setup",description:"Setup",source:"@site/docs/oracle/gcp/automated.mdx",sourceDirName:"oracle/gcp",slug:"/oracle/gcp/automated-setup",permalink:"/oracle/gcp/automated-setup",tags:[],version:"current",sidebarPosition:20,frontMatter:{sidebar_position:20,slug:"/oracle/gcp/automated-setup"},sidebar:"tutorialSidebar",previous:{title:"Environment",permalink:"/oracle/gcp/env"},next:{title:"Manual Setup",permalink:"/oracle/gcp/manual-setup"}},c={},s=[{value:"Setup",id:"setup",level:2},{value:"Wrapping Up",id:"wrapping-up",level:2}],m={toc:s};function d(e){var t=e.components,n=(0,a.Z)(e,l);return(0,o.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"automated-setup"},"Automated Setup"),(0,o.kt)("h2",{id:"setup"},"Setup"),(0,o.kt)("p",null,"The helm-manifests repo contains a bash script to walk through the GCP setup and output the required variables to an env file. This script is provided as a convenience tool, you should understand all of the commands in the script before running. To automate the GCP setup, run the following command:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"./setup-gcloud.sh PROJECTNAME\n\n# ./setup-gcloud.sh Sbv-Devnet-Oracle\n")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"PROJECTNAME")," will be the name of your GCP project and must contain no spaces or special characters")),(0,o.kt)("p",null,"The script will walk-through the google cloud setup, create your gcp project, add your oracle keypair as a secret, create a service account and give it access to your keypair, then spin up a kubernetes cluster. The script will periodically prompt you for more information."),(0,o.kt)("h2",{id:"wrapping-up"},"Wrapping Up"),(0,o.kt)("p",null,"Upon completion you will have a file ",(0,o.kt)("inlineCode",{parentName:"p"},"PROJECTNAME.env")," containing:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"PROJECT"),(0,o.kt)("li",{parentName:"ul"},"DEFAULT_REGION"),(0,o.kt)("li",{parentName:"ul"},"DEFAULT_ZONE"),(0,o.kt)("li",{parentName:"ul"},"CLUSTER_NAME"),(0,o.kt)("li",{parentName:"ul"},"EXTERNAL_IP"),(0,o.kt)("li",{parentName:"ul"},"SECRET_NAME"),(0,o.kt)("li",{parentName:"ul"},"GOOGLE_PAYER_SECRET_PATH"),(0,o.kt)("li",{parentName:"ul"},"GCP_CONFIG_BUCKET"),(0,o.kt)("li",{parentName:"ul"},"SERVICE_ACCOUNT_EMAIL"),(0,o.kt)("li",{parentName:"ul"},"SERVICE_ACCOUNT_BASE64")),(0,o.kt)("p",null,"You will need to manually add:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"CLUSTER"),(0,o.kt)("li",{parentName:"ul"},"RPC_URL"),(0,o.kt)("li",{parentName:"ul"},"BACKUP_MAINNET_RPC"),(0,o.kt)("li",{parentName:"ul"},"ORACLE_KEY"),(0,o.kt)("li",{parentName:"ul"},"GRAFANA_HOSTNAME"),(0,o.kt)("li",{parentName:"ul"},"GRAFANA_PASSWORD"),(0,o.kt)("li",{parentName:"ul"},"GRAFANA_TLS_CRT"),(0,o.kt)("li",{parentName:"ul"},"GRAFANA_TLS_KEY")))}d.isMDXComponent=!0}}]);