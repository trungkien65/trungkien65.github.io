import{j as e}from"./jsx-runtime-CDt2p4po.js";import"./index-GiUgBvb1.js";import{B as t}from"./Button-n0DAZ2Bc.js";import"./utils-Cok0UjuV.js";const h={title:"Components/Button",component:t,parameters:{layout:"centered"}},r={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-3 items-center",children:[e.jsx(t,{variant:"primary",children:"Primary"}),e.jsx(t,{variant:"secondary",children:"Secondary"}),e.jsx(t,{variant:"outline",children:"Outline"}),e.jsx(t,{variant:"ghost",children:"Ghost"}),e.jsx(t,{variant:"destructive",children:"Destructive"}),e.jsx(t,{variant:"muted",children:"Muted"})]})},n={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-3 items-center",children:[e.jsx(t,{size:"sm",children:"Small (sm)"}),e.jsx(t,{size:"md",children:"Medium (md)"}),e.jsx(t,{size:"lg",children:"Large (lg)"})]})},a={render:()=>e.jsx("div",{className:"flex gap-3",children:e.jsx(t,{variant:"primary",loading:!0,children:"Đang xử lý"})})};var s,i,o;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="muted">Muted</Button>
    </div>
}`,...(o=(i=r.parameters)==null?void 0:i.docs)==null?void 0:o.source}}};var d,c,m;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-3 items-center">
      <Button size="sm">Small (sm)</Button>
      <Button size="md">Medium (md)</Button>
      <Button size="lg">Large (lg)</Button>
    </div>
}`,...(m=(c=n.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var l,u,p;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <div className="flex gap-3">
      <Button variant="primary" loading>
        Đang xử lý
      </Button>
    </div>
}`,...(p=(u=a.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};const j=["Variants","Sizes","Loading"];export{a as Loading,n as Sizes,r as Variants,j as __namedExportsOrder,h as default};
