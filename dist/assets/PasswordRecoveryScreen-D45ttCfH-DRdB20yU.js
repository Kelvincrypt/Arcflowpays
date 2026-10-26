import{db as a,dJ as T,dh as _,d9 as E,de as e,eQ as I,eR as F,ef as U,df as p,eo as W}from"./index-BeNGqjyN.js";import{F as N}from"./ShieldCheckIcon-BopbGckb.js";import{b as O}from"./ModalFooter-CmGY3GN5-oBWxvVBR.js";import{l as V}from"./Layouts-BMRfo5hw-DyG4egHA.js";import{g as H,h as z,y as B,w as M,k as D}from"./shared-CFJrjgWW-CIUwnJSP.js";import{w as t}from"./Screen-DZNhZC2N-BoaDB0X2.js";import"./index-CWARkn2w-BNImqPnb.js";const re={component:()=>{let[o,y]=a.useState(!0),{authenticated:m,user:g}=T(),{walletProxy:i,closePrivyModal:v,createAnalyticsEvent:f,client:j}=_(),{navigate:k,data:C,onUserCloseViaDialogOrKeybindRef:$}=E(),[n,A]=a.useState(void 0),[x,d]=a.useState(""),[c,w]=a.useState(!1),{entropyId:u,entropyIdVerifier:R,onCompleteNavigateTo:b,onSuccess:h,onFailure:S}=C.recoverWallet,l=(r="User exited before their wallet could be recovered")=>{v({shouldCallAuthOnSuccess:!1}),S(typeof r=="string"?new U(r):r)};return $.current=l,a.useEffect((()=>{if(!m)return l("User must be authenticated and have a Privy wallet before it can be recovered")}),[m]),e.jsxs(t,{children:[e.jsx(t.Header,{icon:N,title:"Enter your password",subtitle:"Please provision your account on this new device. To continue, enter your recovery password.",showClose:!0,onClose:l}),e.jsx(t.Body,{children:e.jsx(J,{children:e.jsxs("div",{children:[e.jsxs(H,{children:[e.jsx(z,{type:o?"password":"text",onChange:r=>(s=>{s&&A(s)})(r.target.value),disabled:c,style:{paddingRight:"2.3rem"}}),e.jsx(B,{style:{right:"0.75rem"},children:o?e.jsx(M,{onClick:()=>y(!1)}):e.jsx(D,{onClick:()=>y(!0)})})]}),!!x&&e.jsx(Q,{children:x})]})})}),e.jsxs(t.Footer,{children:[e.jsx(t.HelpText,{children:e.jsxs(V,{children:[e.jsx("h4",{children:"Why is this necessary?"}),e.jsx("p",{children:"You previously set a password for this wallet. This helps ensure only you can access it"})]})}),e.jsx(t.Actions,{children:e.jsx(Y,{loading:c||!i,disabled:!n,onClick:async()=>{w(!0);let r=await j.getAccessToken(),s=I(g,u);if(!r||!s||n===null)return l("User must be authenticated and have a Privy wallet before it can be recovered");try{f({eventName:"embedded_wallet_recovery_started",payload:{walletAddress:s.address}}),await(i==null?void 0:i.recover({accessToken:r,entropyId:u,entropyIdVerifier:R,recoveryPassword:n})),d(""),b?k(b):v({shouldCallAuthOnSuccess:!1}),h==null||h(s),f({eventName:"embedded_wallet_recovery_completed",payload:{walletAddress:s.address}})}catch(P){F(P)?d("Invalid recovery password, please try again."):d("An error has occurred, please try again.")}finally{w(!1)}},$hideAnimations:!u&&c,children:"Recover your account"})}),e.jsx(t.Watermark,{})]})]})}};let J=p.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,Q=p.div`
  line-height: 20px;
  height: 20px;
  font-size: 13px;
  color: var(--privy-color-error);
  text-align: left;
  margin-top: 0.5rem;
`,Y=p(O)`
  ${({$hideAnimations:o})=>o&&W`
      && {
        /* Remove animations because the recoverWallet task on the iframe partially
           blocks the renderer, so the animation stutters and doesn't look good */
        transition: none;
      }
    `}
`;export{re as PasswordRecoveryScreen,re as default};
