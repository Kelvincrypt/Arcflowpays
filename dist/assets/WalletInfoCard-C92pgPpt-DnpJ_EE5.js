import{db as d,de as e,df as r}from"./index-BeNGqjyN.js";import{f as p}from"./ModalFooter-CmGY3GN5-oBWxvVBR.js";import{e as f}from"./ErrorMessage-D8VaAP5m-BbDa9vwv.js";import{r as x}from"./LabelXs-oqZNqbm_-nXOgqY76.js";import{d as h}from"./Address-D-hKSBMc-DaQFWO60.js";import{d as g}from"./shared-FM0rljBt-L8n1A_U9.js";import{C as j}from"./check-CjH_DYv_.js";import{C as u}from"./copy-DowNgRMk.js";let v=r(g)`
  && {
    padding: 0.75rem;
    height: 56px;
  }
`,y=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`,C=r.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`,b=r.div`
  font-size: 12px;
  line-height: 1rem;
  color: var(--privy-color-foreground-3);
`,w=r(x)`
  text-align: left;
  margin-bottom: 0.5rem;
`,z=r(f)`
  margin-top: 0.25rem;
`,E=r(p)`
  && {
    gap: 0.375rem;
    font-size: 14px;
  }
`;const P=({errMsg:t,balance:i,address:a,className:c,title:n,showCopyButton:m=!1})=>{let[s,l]=d.useState(!1);return d.useEffect((()=>{if(s){let o=setTimeout((()=>l(!1)),3e3);return()=>clearTimeout(o)}}),[s]),e.jsxs("div",{children:[n&&e.jsx(w,{children:n}),e.jsx(v,{className:c,$state:t?"error":void 0,children:e.jsxs(y,{children:[e.jsxs(C,{children:[e.jsx(h,{address:a,showCopyIcon:!1}),i!==void 0&&e.jsx(b,{children:i})]}),m&&e.jsx(E,{onClick:function(o){o.stopPropagation(),navigator.clipboard.writeText(a).then((()=>l(!0))).catch(console.error)},size:"sm",children:e.jsxs(e.Fragment,s?{children:["Copied",e.jsx(j,{size:14})]}:{children:["Copy",e.jsx(u,{size:14})]})})]})}),t&&e.jsx(z,{children:t})]})};export{P as j};
