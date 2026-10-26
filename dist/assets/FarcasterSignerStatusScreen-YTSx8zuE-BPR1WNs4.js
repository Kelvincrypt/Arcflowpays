import{d9 as T,da as C,dh as I,db as d,dF as y,de as a,dH as h,dC as B,df as n}from"./index-BeNGqjyN.js";import{h as O}from"./CopyToClipboard-i_OQSBJr-DISM8dRe.js";import{n as q}from"./OpenLink-CUpJ1mOr-D9P4xkEj.js";import{x as E}from"./QrCode-HPSrpHat-IixKyOgW.js";import{n as M}from"./ScreenLayout-nGD4p5K0-BQz2Dyad.js";import{l as x}from"./farcaster-DPlSjvF5-DKL6ldXU.js";import"./dijkstra-COg3n3zL.js";import"./ModalFooter-CmGY3GN5-oBWxvVBR.js";import"./Screen-DZNhZC2N-BoaDB0X2.js";import"./index-CWARkn2w-BNImqPnb.js";let S="#8a63d2";const _=({appName:u,loading:m,success:i,errorMessage:e,connectUri:r,onBack:s,onClose:c,onOpenFarcaster:o})=>a.jsx(M,h.isMobile||m?h.isIOS?{title:e?e.message:"Add a signer to Farcaster",subtitle:e?e.detail:`This will allow ${u} to add casts, likes, follows, and more on your behalf.`,icon:x,iconVariant:"loading",iconLoadingStatus:{success:i,fail:!!e},primaryCta:r&&o?{label:"Open Farcaster app",onClick:o}:void 0,onBack:s,onClose:c,watermark:!0}:{title:e?e.message:"Requesting signer from Farcaster",subtitle:e?e.detail:"This should only take a moment",icon:x,iconVariant:"loading",iconLoadingStatus:{success:i,fail:!!e},onBack:s,onClose:c,watermark:!0,children:r&&h.isMobile&&a.jsx(A,{children:a.jsx(q,{text:"Take me to Farcaster",url:r,color:S})})}:{title:"Add a signer to Farcaster",subtitle:`This will allow ${u} to add casts, likes, follows, and more on your behalf.`,onBack:s,onClose:c,watermark:!0,children:a.jsxs(R,{children:[a.jsx(L,{children:r?a.jsx(E,{url:r,size:275,squareLogoElement:x}):a.jsx(V,{children:a.jsx(B,{})})}),a.jsxs(N,{children:[a.jsx(P,{children:"Or copy this link and paste it into a phone browser to open the Farcaster app."}),r&&a.jsx(O,{text:r,itemName:"link",color:S})]})]})});let A=n.div`
  margin-top: 24px;
`,R=n.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`,L=n.div`
  padding: 24px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 275px;
`,N=n.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`,P=n.div`
  font-size: 0.875rem;
  text-align: center;
  color: var(--privy-color-foreground-2);
`,V=n.div`
  position: relative;
  width: 82px;
  height: 82px;
`;const Y={component:()=>{let{lastScreen:u,navigateBack:m,data:i}=T(),e=C(),{requestFarcasterSignerStatus:r,closePrivyModal:s}=I(),[c,o]=d.useState(void 0),[k,v]=d.useState(!1),[b,w]=d.useState(!1),g=d.useRef([]),t=i==null?void 0:i.farcasterSigner;d.useEffect((()=>{let j=Date.now(),l=setInterval((async()=>{if(!(t!=null&&t.public_key))return clearInterval(l),void o({retryable:!0,message:"Connect failed",detail:"Something went wrong. Please try again."});t.status==="approved"&&(clearInterval(l),v(!1),w(!0),g.current.push(setTimeout((()=>s({shouldCallAuthOnSuccess:!1,isSuccess:!0})),y)));let p=await r(t==null?void 0:t.public_key),F=Date.now()-j;p.status==="approved"?(clearInterval(l),v(!1),w(!0),g.current.push(setTimeout((()=>s({shouldCallAuthOnSuccess:!1,isSuccess:!0})),y))):F>3e5?(clearInterval(l),o({retryable:!0,message:"Connect failed",detail:"The request timed out. Try again."})):p.status==="revoked"&&(clearInterval(l),o({retryable:!0,message:"Request rejected",detail:"The request was rejected. Please try again."}))}),2e3);return()=>{clearInterval(l),g.current.forEach((p=>clearTimeout(p)))}}),[]);let f=(t==null?void 0:t.status)==="pending_approval"?t.signer_approval_url:void 0;return a.jsx(_,{appName:e.name,loading:k,success:b,errorMessage:c,connectUri:f,onBack:u?m:void 0,onClose:s,onOpenFarcaster:()=>{f&&(window.location.href=f)}})}};export{Y as FarcasterSignerStatusScreen,_ as FarcasterSignerStatusView,Y as default};
