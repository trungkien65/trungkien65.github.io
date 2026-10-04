import{j as e}from"./jsx-runtime-CDt2p4po.js";import{r as h}from"./index-GiUgBvb1.js";import{C as t}from"./Chip-D5AlEKTk.js";import"./utils-Cok0UjuV.js";const f={title:"Components/Chip",component:t,parameters:{layout:"centered"}},a={render:()=>{const[p,u]=h.useState("all"),m=[{id:"all",label:"Tất cả",count:214},{id:"1",label:"1 nét",count:6},{id:"2",label:"2 nét",count:23},{id:"3",label:"3 nét",count:31},{id:"4",label:"4 nét",count:34}];return e.jsx("div",{className:"flex flex-wrap gap-2 items-center",children:m.map(n=>e.jsx(t,{active:p===n.id,badge:n.count,onClick:()=>u(n.id),children:n.label},n.id))})}},i={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-3 items-center",children:[e.jsx(t,{active:!1,children:"Inactive"}),e.jsx(t,{active:!0,children:"Active"}),e.jsx(t,{active:!0,badge:"Hot",children:"With Badge"}),e.jsx(t,{disabled:!0,children:"Disabled"})]})};var r,s,c;a.parameters={...a.parameters,docs:{...(r=a.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<string>("all");
    const options = [{
      id: "all",
      label: "Tất cả",
      count: 214
    }, {
      id: "1",
      label: "1 nét",
      count: 6
    }, {
      id: "2",
      label: "2 nét",
      count: 23
    }, {
      id: "3",
      label: "3 nét",
      count: 31
    }, {
      id: "4",
      label: "4 nét",
      count: 34
    }];
    return <div className="flex flex-wrap gap-2 items-center">
        {options.map(opt => <Chip key={opt.id} active={selected === opt.id} badge={opt.count} onClick={() => setSelected(opt.id)}>
            {opt.label}
          </Chip>)}
      </div>;
  }
}`,...(c=(s=a.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};var l,o,d;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-3 items-center">
      <Chip active={false}>Inactive</Chip>
      <Chip active={true}>Active</Chip>
      <Chip active={true} badge="Hot">With Badge</Chip>
      <Chip disabled>Disabled</Chip>
    </div>
}`,...(d=(o=i.parameters)==null?void 0:o.docs)==null?void 0:d.source}}};const g=["InteractiveGroup","States"];export{a as InteractiveGroup,i as States,g as __namedExportsOrder,f as default};
