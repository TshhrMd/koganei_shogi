(()=>{const R=C=>!C||/\D/.test(C)?0:Number(C),P=" \u6b69 \u9999 \u6842 \u9280 \u91d1 \u89d2 \u98db \u7389         \u3068 \u674f \u572d \u5168  \u99ac \u9f8d          \u6b69 \u9999 \u6842 \u9280 \u91d1 \u89d2 \u98db \u738b         \u3068 \u674f \u572d \u5168  \u99ac \u9f8d          \u6b69 \u9999 \u6842 \u9280 \u91d1 \u89d2 \u98db \u7389         \u3068 \u674f \u572d \u5168  \u99ac \u9f8d        ".split(" "),T=(C=>[[],[!1,!0,!1,!1,!1,!1,!1,!1],[!1,!0,!0,!1,!1,!1,!1,!1],[!0,!1,!1,!1,!1,!1,!1,!1],[!1,
!0,!1,!1,!1,!0,!0,!1],C,[!1,!1,!1,!1,!1,!0,!0,!0],[!1,!0,!0,!0,!0,!1,!1,!1],[!1,!0,!1,!0,!1,!0,!0,!1],[],[],[],[],[],[],[],[],C,C,C,C,[],[!1,!0,!1,!0,!1,!0,!0,!0],[!1,!0,!0,!0,!0,!0,!0,!1]])([!1,!0,!1,!0,!1,!0,!1,!1]),X=(C,L)=>{let b={h:new Int8Array(81),A:new Int8Array(8),u:new Int8Array(8),K:0,L:0,H:0,I:0,l:0,B:0,C:0,Z:0,$:0,i:!1,s:""},M,x=0;const O=" * ;FU;KY;KE;GI;KI;KA;HI;OU;;;;;;;;;TO;NY;NK;NG;;UM;RY;;;;;;;;;;+FU;+KY;+KE;+GI;+KI;+KA;+HI;+OU;;;;;;;;;+TO;+NY;+NK;+NG;;+UM;+RY;;;;;;;;;;-FU;-KY;-KE;-GI;-KI;-KA;-HI;-OU;;;;;;;;;-TO;-NY;-NK;-NG;;-UM;-RY;;;;;;;;".split(";"),
a=()=>{const d=b.B,e=b.C;var f=b.$;f=1>f||9<f?0:f;b.s=b.ka.s+" "+(d+(e+P[b.h[9*d-e]]+(f?b.Z:0))+f)},I=d=>{const e=(A,J,g,m,y,G)=>{const r=k(A+g,J+m);return r?r&y?!1:T[r&31][G]:e(A+g,J+m,g,m,y,G)},f=(A,J,g,m,y,G,r)=>{const z=k(A+g,J+m);return z?z&y?!1:T[z&31][G]:e(A+g,J+m,g,m,y,r)},u=d?b.H:b.K,n=d?b.I:b.L;if(!u||!n)return!1;const F=d?1:-1,w=d?64:32;d=(d?32:64)|3;return k(u+1,n+F+F)==d||k(u-1,n+F+F)==d||f(u,n,0,F,w,1,2)||f(u,n,0,-F,w,3,4)||f(u,n,1,0,w,3,4)||f(u,n,-1,0,w,3,4)||f(u,n,1,F,w,5,7)||f(u,
n,-1,F,w,5,7)||f(u,n,1,-F,w,6,7)||f(u,n,-1,-F,w,6,7)},l=()=>{var d=b.h;var e=9*b.B-b.C;d[e]^=16;a()},k=(d,e)=>1>d||9<d||1>e||9<e?96:b.h[9*d-e];(()=>{for(const f of C.split(/\r\n|\n/))switch(f.substring(0,1)){case "P":var d=f.substring(1,4);if("+00"==d){d=b.A;for(var e=4;e<f.length;e+=4)d[O.indexOf(f.substring(e,e+2))]++}else if("-00"==d)for(d=b.u,e=4;e<f.length;e+=4)d[O.indexOf(f.substring(e,e+2))]++;else if(d=R(f.substring(1,2))){e=[1,2,3,4,5,6,7,8,9];for(const u of e)e=29-3*u,e=O.indexOf(f.substring(e,
e+3)),b.h[9*u-d]=e,40==e?(b.K=u,b.L=d):72==e&&(b.H=u,b.I=d)}break;case "+":case "-":if(4<f.length){x=2;return}break;case "'":M||(M=R(f.substring(2).trim()))}})();return{ea:()=>{b.l&&(b=b.ka,x=0)},l:()=>b.l,ha:(d,e,f,u)=>{b={h:Int8Array.from(b.h),A:Int8Array.from(b.A),u:Int8Array.from(b.u),K:b.K,L:b.L,H:b.H,I:b.I,l:b.l+1,B:0,C:0,Z:0,$:0,i:!1,s:"",ka:b};b.B=d;b.C=e;b.Z=f;b.$=u;const n=9*d-e;if(1>u)b.h[n]=f|64,b.u[f]--;else if(9<u)b.h[n]=f|32,b.A[f]--;else{f=9*f-u;const F=b.h[n],w=b.h[f],A=w&31;w&32?
(b.A[F&7]++,b.h[f]=0,1!=e||1!=A&&2!=A?3>e&&3==A?(b.h[n]=w|16,b.i=!1):5==A?(b.h[n]=w,b.i=!1):8==A?(b.h[n]=w,b.i=!1,b.K=d,b.L=e):!(4>u||4>e)||w&16?(b.h[n]=w,b.i=!1):(b.h[n]=w|16,b.i=!0):(b.h[n]=w|16,b.i=!1)):(b.u[F&7]++,b.h[f]=0,9!=e||1!=A&&2!=A?7<e&&3==A?(b.h[n]=w|16,b.i=!1):5==A?(b.h[n]=w,b.i=!1):8==A?(b.h[n]=w,b.i=!1,b.H=d,b.I=e):!(6<u||6<e)||w&16?(b.h[n]=w,b.i=!1):(b.h[n]=w|16,b.i=!0):(b.h[n]=w|16,b.i=!1))}a();L&&(d=k(d,e)&64,e=I(!0),d?x=e?3:0:I(!1)?x=3:b.i?(l(),I(!0)?e?l():b.i=!1:e?(l(),b.i=!1):
x=3):x=e?0:3)},pa:l,F:k,A:d=>b.A[d&7],u:d=>b.u[d&7],B:()=>b.B,C:()=>b.C,i:()=>b.i,fa:()=>x,s:()=>b.s,ga:M}},Y=(()=>{const C=(()=>{const l=[],k={Ba:f=>l.push(f)},d=window.matchMedia("(prefers-color-scheme: dark)"),e=()=>{const f=d.matches;k.V=f?"white":"black";k.ua=f?"maroon":"yellow";k.Y=f?"darkgray":"lightgray";for(const u of l)u.m.X(u==document.activeElement)};d.addEventListener("change",e);e();return k})(),L=" \uff11 \uff12 \uff13 \uff14 \uff15 \uff16 \uff17 \uff18 \uff19".split(" "),b=" \u4e00 \u4e8c \u4e09 \u56db \u4e94 \u516d \u4e03 \u516b \u4e5d".split(" "),
M=[7,6,5,4,3,2,1],x=[9,8,...M],O=(()=>{const l=[9,8,7,6,5,4,3],k=[...l,2],d=[8,...M];return[[[],k,k,l,x,x,x,x],[[],d,d,M,x,x,x,x]]})(),a=(()=>{var l="px "+(window.navigator.userAgent.toLowerCase().includes("firefox")?"monospace":"sans-serif");const k=Math.floor(Math.min(((document.currentScript.parentNode.clientWidth||window.innerWidth)-8)/20,window.innerHeight/34,22)),d=Math.floor(k/3+1),e=Math.floor(k/2);l={Ha:e,wa:d,g:2*k,S:20*k,R:31*k,T:29*k+e,za:Math.round(27.7*k+e),J:28*k+e,U:5*k+e,qa:Math.round(3.7*
k+e),G:4*k+e,ia:4*k+d,xa:Math.round(17.5*k+d),ya:3*k,v:new Int16Array(10),P:new Int16Array(10),j:new Int16Array(10),o:new Int16Array(10),M:0*k+e,ca:k+e,aa:0*k+d,na:2*k+d,da:14*k+d,oa:16*k+d,N:4*k,ba:Math.round(3.5*k),Ea:9*k+d,Ga:k+e,Fa:9*k,ra:Math.round(18.7*k+d),sa:Math.round(7.3*k+e),O:Math.floor(1.4*k)+l,W:Math.floor(.8*k)+l,ta:2*k+1+l,ja:new Path2D};const f=l.ja,u=[...x,0];for(const n of u)l.v[n]=k*(19-2*n)+d,l.j[n]=k*(18-2*n)+d,l.P[n]=k*(2*n+7)+e,l.o[n]=k*(2*n+8)+e;for(const n of u)f.moveTo(l.j[n],
l.o[0]),f.lineTo(l.j[n],l.o[9]),f.moveTo(l.j[0],l.o[n]),f.lineTo(l.j[9],l.o[n]);f.rect(l.j[9],3*k+e,16*k,3*k);f.rect(l.j[9],27*k+e,16*k,3*k);f.rect(l.aa,l.M,l.N,l.g);f.rect(l.da,l.M,l.N,l.g);return l})(),I=(new Int8Array(187)).fill(104);for(const l of x)for(const k of x)I[11*k+44+l]=0;return l=>{let k,d={l:()=>0},e=0,f=0,u=0,n=!1,F=0,w=0,A=!1,J=!1,g=0,m=0,y=0,G=0,r;l.width=a.S;l.height=a.R;l.style.width=a.S+"px";l.style.height=a.R+"px";let z;(z=l.style).zIndex||(z.zIndex=1);const h=l.getContext("2d");
h.textAlign="center";h.textBaseline="middle";const H=p=>{h.clearRect(0,0,a.S,a.R);p||(h.fillStyle=C.Y,h.fillRect(0,0,a.S,a.R));h.strokeStyle=C.V;J?(p=r[11*m+44+g],104!=p&&(h.fillStyle=C.Y,112==p?h.fillRect(a.aa,a.M,a.N,a.g):120==p?h.fillRect(a.da,a.M,a.N,a.g):1>m?h.fillRect(a.j[g],a.G,a.g,a.g):9<m?h.fillRect(a.j[g],a.J,a.g,a.g):h.fillRect(a.j[g],a.o[m-1],a.g,a.g))):A&&(h.fillStyle=C.Y,1>w?h.fillRect(a.j[F],a.G,a.g,a.g):9<w?h.fillRect(a.j[F],a.J,a.g,a.g):h.fillRect(a.j[F],a.o[w-1],a.g,a.g));h.fillStyle=
C.ua;if(n)p=a.j[e],1>f?(h.fillRect(p,a.G,a.g,a.g),h.strokeRect(p,a.G,a.g,a.g)):9<f?(h.fillRect(p,a.J,a.g,a.g),h.strokeRect(p,a.J,a.g,a.g)):(h.fillRect(p,a.o[f-1],a.g,a.g),h.strokeRect(p+2,a.o[f-1]+2,a.g-4,a.g-4));else if(d.l()){p=d.B();const q=d.C();1>q?h.fillRect(a.j[p],a.G,a.g,a.g):9<q?h.fillRect(a.j[p],a.J,a.g,a.g):h.fillRect(a.j[p],a.o[q-1],a.g,a.g)}h.fillStyle=C.V;h.stroke(a.ja);h.font=a.W;for(const q of x)h.fillText(L[q],a.v[q],a.sa),h.fillText(b[q],a.ra,a.P[q]);h.font=a.O;h.fillText("\u2617",
a.v[9],a.T);h.fillText("\u2616",a.v[9],a.U)},N=(()=>{const p=()=>{var q=(c,t,K)=>{d.F(c,t)&K||(r[11*t+44+c]=96)};const D=(c,t,K,S,U)=>{c+=K;t+=S;const V=d.F(c,t);V?V&U||(r[11*t+44+c]=96):(r[11*t+44+c]=96,D(c,t,K,S,U))};var B=(c,t)=>{d.F(c,t)||(r[11*t+44+c]=96)},v=d.l()&1;if(u&248){B=v?1:-1;v=v?72:40;var E=T[u&31];E[0]?(q(e+1,f+B+B,v),q(e-1,f+B+B,v)):(E[2]?D(e,f,0,B,v):E[1]&&q(e,f+B,v),E[4]?(D(e,f,1,0,v),D(e,f,-1,0,v),D(e,f,0,-B,v)):E[3]&&(q(e+1,f,v),q(e-1,f,v),q(e,f-B,v)),E[7]?(D(e,f,1,1,v),D(e,f,
-1,1,v),D(e,f,1,-1,v),D(e,f,-1,-1,v)):E[5]&&(q(e+1,f+B,v),q(e-1,f+B,v),E[6]&&(q(e+1,f-B,v),q(e-1,f-B,v))))}else if(q=O[v][u],1==u){const c=v?65:33;for(const t of x)if(q.every(K=>d.F(t,K)!=c))for(E of q)B(t,E)}else for(const c of q)for(const t of x)B(t,c)};return()=>{const q=d.l()&1;r=Int8Array.from(I);h.fillStyle=C.V;h.font=a.O;for(var D of x)for(var B of x){var v=d.F(B,D);v&32&&(h.fillText(P[v],a.v[B],a.P[D]),q||(r[11*D+44+B]=v|128))}B=D=9;for(var E of M){if(v=d.A(E)){var c=a.v[--D];h.fillText(P[E],
c,a.T);h.font=a.W;h.fillText(9<v?v:L[v],c,a.za);h.font=a.O;q||(r[165+D]=E|128)}if(v=d.u(E))c=a.v[--B],h.fillText(P[E],c,a.U),h.font=a.W,h.fillText(9<v?v:L[v],c,a.qa),h.font=a.O,q&&(r[33+B]=E|128)}8<D&&h.fillText("\u306a\u3057",a.ia,a.T);8<B&&h.fillText("\u306a\u3057",a.ia,a.U);E=d.l();h.fillText(E+(n?"-"+(E+1):"\u624b"),a.xa,a.T,a.ya);h.scale(-1,-1);for(const t of x)for(const K of x)E=d.F(K,t),E&64&&(h.fillText(P[E],-a.v[K],-a.P[t]),q&&(r[11*t+44+K]=E|128));h.scale(-1,-1);d.l()&&(h.fillText("\uff11\u624b\u3082\u3069\u308b",
a.na,a.ca,a.ba),r[20]=112,r[19]=112);d.i()&&(h.fillText("\u6210\u30fb\u4e0d\u6210",a.oa,a.ca,a.ba),r[13]=120,r[12]=120);h.font=a.ta;h.fillText(k,a.Ea,a.Ga,a.Fa);n&&p()}})(),Q=p=>{var q=p.clientX;p=p.clientY;var D=l.getBoundingClientRect();q=Math.round(q-D.left-a.wa);p=Math.round(p-D.top-a.Ha);D=a.g;const B=9-Math.floor(q/D),v=-3+Math.floor(p/D);if((3>(q+1)%D||3>(p+1)%D)&&-3!=v)return m=g=0,!0;if(B==g&&v==m)return!1;g=B;m=v;return!0};H(!1);return{Aa:(p,q)=>{d=X(p,q);d.fa()?alert("\u7b2c"+l.D+"\u554f\u306f\u89e3\u7b54\u624b\u9806\u3042\u308a\uff01"):
(k="\u7b2c"+l.D+"\u554f"+(d.ga?"\uff08"+d.ga+"\u624b\u8a70\uff09":""),H(!1),N(),C.Ba(l),W(l));return 0},X:p=>{H(p);N()},la:p=>{Q(p);y=g;G=m;J=!0;H(!0);N()},Ca:p=>{J&&Q(p)&&(p=r[11*G+44+y],p&128&&(e=y,f=G,u=p&127,n=!0,A=!1),-3==m&&(m=g=0),G=y=0,H(!0),N())},ma:p=>{if(J&&(J=!1,!Q(p))){p=r[11*m+44+g];switch(p){case 104:A=!1;return;case 112:d.ea();A=n=!1;break;case 120:d.pa();n=A=!1;break;case 0:A=!0;F=g;w=m;break;case 96:8>u?d.ha(g,m,u,f):d.ha(g,m,e,f);d.fa()?(d.ea(),n=!1,A=!0,F=g,w=m,n=!0):A=n=!1;break;
default:e=g,f=m,u=p&127,n=!0,A=!1}H(!0);N()}},Da:()=>{J=!1},s:()=>d.s()}}})(),W=(()=>{const C=document.currentScript.dataset,L=document.currentScript.parentNode,b=L.getElementsByTagName("canvas"),M=(g=>new Date(g?g+".000+09:00":0))(C.start),[x,O]=(()=>{const g=((C.file||"1")+".csa").split("."),m=R(g[0]);return[m||1,"."+(m?g[1]:g[0])]})(),a=L.getElementsByTagName("form")[0],I=a&&L.getElementsByTagName("button")[0];I&&(I.type="button",I.disabled=!0);const l=((C.required||"name,place")+":\u6c0f\u540d\u30fb\u5c45\u4f4f\u5730").split(":");
let k=!1;const d=(()=>{const g=Array.from(L.getElementsByTagName("div")).filter(z=>!z.innerHTML),m=l[1].trim(),y=m+"\u3092\u5165\u529b\u3057\u3066\u3001\u958b\u59cb\u6642\u523b\u3092\u304a\u5f85\u3061\u4e0b\u3055\u3044\u3002",G=m+"\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002";let r="\u958b\u59cb\u6642\u523b\u307e\u3067\u304a\u5f85\u3061\u304f\u3060\u3055\u3044\u3002";return z=>{-3==z?z="Cookie\u3092\u6709\u52b9\u306b\u3057\u3066\u518d\u5ea6\u63a5\u7d9a\u3057\u3066\u4e0b\u3055\u3044\u3002":
(-2==z?r="\u6df7\u96d1\u3057\u3066\u3044\u307e\u3059\u3002\u3053\u306e\u307e\u307e\u5c11\u3057\u304a\u5f85\u3061\u4e0b\u3055\u3044\u3002":0>z?r="":z&&(r="\u958b\u59cb\u6642\u523b\u307e\u3067\u7d04"+(600>z?z+"\u79d2":Math.floor(z/60)+"\u5206")+"\u304a\u5f85\u3061\u4e0b\u3055\u3044\u3002"),z=k?r:new Date<M?y:G);for(const h of g)h.textContent=z}})(),e=(g=>{for(const m of l[0].split(",")){const y=document.getElementById(m.trim());g.push(y);y.value=""}return g})([]),f=(()=>{const g=(r,z)=>{const h=()=>
{fetch(r,{cache:"no-store"}).then(H=>H.ok?H.text():"").then(H=>{H&&!z(H)||setTimeout(h,5E3)}).catch(()=>{setTimeout(h,5E3)})};h()},m=()=>{let r=!1,z;g(C.config||"0"+O,h=>{for(const H of h.split(/\r\n|\n/))switch(H.trim()){case "shokyu":r=z=!0;break;case "ippan":z=!1,r=!0}if(!r)return 1;for(const H of b)g(H.D+O,N=>H.m.Aa(N,z));return 0})};let y=!0;const G=()=>{const r=10*Math.floor((M-new Date)/1E4);0<r?(d(r),setTimeout(G,5E3)):(d(-2),m())};return()=>{k=e.every(r=>r.value);I&&(I.disabled=!k);d(0);
k&&y&&(y=!1,G())}})(),u="ontouchstart"in document,n=g=>{g.preventDefault();g.returnValue=""},F=(()=>{const g=C.idprefix||"answer";return m=>document.getElementById(g+m)})(),w=()=>{var g=C.cookie;if(""==g)return!0;if(!navigator.cookieEnabled)return!1;var m=(new Date).getTime()%1E9;g=";samesite=strict;max-age=3456000"+("https:"==location.protocol?";secure":"")+("/"==g?";path=/":"");const y=F(0),G=()=>{for(const z of document.cookie.split(";")){const h=z.split("=");if("TsumeCompe"==h[0].trim())return h[1].trim()}return""};
m=G()||m+Math.random()+"+"+Math.random();const r="TsumeCompe="+m+g;I&&(y.value=m);window.addEventListener("beforeunload",()=>{document.cookie=r});document.cookie=r;return G()==m},A=()=>{for(const g of b)g.va.value=g.m.s();window.removeEventListener("beforeunload",n);a.submit()},J=(()=>{let g={},m={};const y=c=>{c.stopPropagation();return c.cancelable?(c.preventDefault(),!1):!0};let G=!1;const r=c=>{if(y(c)||G)G=!1;else if(!c.button){const t=c.target;t==g?g.m.la(c):m=t}},z=c=>{y(c)||c.button||c.target!=
g||g.m.Ca(c)},h=c=>{if(!y(c)&&!c.button){const t=c.target;t==g?g.m.ma(c):t==m&&(m={},t==g&&t==document.activeElement||t.focus())}},H=c=>{G=!0;if(1==c.touches.length){const t=c.target;t==g?g.m.la(c.changedTouches[0]):m=t}};let N=!1;const Q=c=>{if(N)N=!1;else if(y(c),!c.touches.length){const t=c.target;t==g?g.m.ma(c.changedTouches[0]):t==m&&(m={},t==g&&t==document.activeElement||t.focus())}},p=[],q=(c=>u&&1==c.length&&c[0])(Array.from(L.getElementsByTagName("select")).filter(c=>{let t=0,K=x;for(const S of c){if(S.value!=
t)return!1;t=K++}c=c.style;c.visibility="hidden";c.position="fixed";c.bottom||(c.bottom="0em");c.right||(c.right="0em");c.zIndex||(c.zIndex=2);return!0})),D=()=>{var c=R(q.value);c?(c=p[c],c==g&&c==document.activeElement||c.focus()):window.scrollTo(0,0)},B=c=>{g=c.target;q&&(q.value=g.D);g.m.X(!0);g.scrollIntoView({behavior:"smooth",block:"start",inline:"nearest"})},v=c=>{q&&(q.value="-1");g={};c.target.m.X(!1)};let E=b.length;return c=>{u&&(c.addEventListener("touchstart",H,{passive:!0}),c.addEventListener("touchend",
Q),c.addEventListener("touchmove",()=>{N=!0},{passive:!0}),p[c.D]=c);c.addEventListener("mousedown",r);c.addEventListener("mouseup",h);c.addEventListener("mousemove",z);c.addEventListener("mouseleave",t=>{t.target.m.Da()});c.addEventListener("focus",B);c.addEventListener("contextmenu",y);c.addEventListener("selectstart",y);c.addEventListener("click",y);c.addEventListener("dblclick",y);c.addEventListener("blur",v);c.tabIndex=0;c.va=F(c.D);--E||(window.addEventListener("beforeunload",n),I&&I.addEventListener("click",
A),q&&(q.addEventListener("change",D),q.style.visibility="visible"),d(-1))}})();return g=>{if(g)J(g);else if(w()){g=x;for(const m of b)m.D=g++,m.m=Y(m);for(const m of e)m.addEventListener("input",f);f()}else d(-3)}})();W()})();