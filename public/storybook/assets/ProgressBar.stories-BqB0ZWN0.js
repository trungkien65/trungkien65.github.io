import{j as e}from"./jsx-runtime-CDt2p4po.js";import"./index-GiUgBvb1.js";import{P as r}from"./ProgressBar-CAGRnxIv.js";import"./utils-Cok0UjuV.js";const p={title:"Components/ProgressBar",component:r,parameters:{layout:"centered"}},s={render:()=>e.jsxs("div",{className:"w-[360px] space-y-4 p-4 bg-card rounded-xl border border-border",children:[e.jsx(r,{value:40,variant:"primary",showLabel:!0,label:"Primary (40%)"}),e.jsx(r,{value:75,variant:"success",showLabel:!0,label:"Success (75%)"}),e.jsx(r,{value:90,variant:"warning",showLabel:!0,label:"Warning (90%)"})]})},a={render:()=>e.jsxs("div",{className:"w-[360px] space-y-4 p-4 bg-card rounded-xl border border-border",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-xs text-muted-foreground block mb-1",children:"Small (h-1.5)"}),e.jsx(r,{value:60,size:"sm"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-xs text-muted-foreground block mb-1",children:"Medium (h-2.5)"}),e.jsx(r,{value:60,size:"md"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-xs text-muted-foreground block mb-1",children:"Large (h-4)"}),e.jsx(r,{value:60,size:"lg"})]})]})};var n,o,d;s.parameters={...s.parameters,docs:{...(n=s.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <div className="w-[360px] space-y-4 p-4 bg-card rounded-xl border border-border">
      <ProgressBar value={40} variant="primary" showLabel label="Primary (40%)" />
      <ProgressBar value={75} variant="success" showLabel label="Success (75%)" />
      <ProgressBar value={90} variant="warning" showLabel label="Warning (90%)" />
    </div>
}`,...(d=(o=s.parameters)==null?void 0:o.docs)==null?void 0:d.source}}};var t,l,i;a.parameters={...a.parameters,docs:{...(t=a.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => <div className="w-[360px] space-y-4 p-4 bg-card rounded-xl border border-border">
      <div>
        <span className="text-xs text-muted-foreground block mb-1">Small (h-1.5)</span>
        <ProgressBar value={60} size="sm" />
      </div>
      <div>
        <span className="text-xs text-muted-foreground block mb-1">Medium (h-2.5)</span>
        <ProgressBar value={60} size="md" />
      </div>
      <div>
        <span className="text-xs text-muted-foreground block mb-1">Large (h-4)</span>
        <ProgressBar value={60} size="lg" />
      </div>
    </div>
}`,...(i=(l=a.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};const b=["Variants","Sizes"];export{a as Sizes,s as Variants,b as __namedExportsOrder,p as default};
