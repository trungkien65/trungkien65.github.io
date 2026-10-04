import{j as e}from"./jsx-runtime-CDt2p4po.js";import{r as V}from"./index-GiUgBvb1.js";import{a as g,u as $,C as N}from"./ControlledInput-BwZphOGv.js";function C({name:t,control:u,rules:r,defaultValue:c,shouldUnregister:m,label:l,placeholder:p,rows:x=3,helperText:o,className:b="",textareaClassName:s="",disabled:f=!1,required:n=!1,id:d}){const{field:v,fieldState:{error:i}}=g({name:t,control:u,rules:{required:n?"Trường này là bắt buộc":!1,...r},defaultValue:c,shouldUnregister:m}),a=d||`textarea-${t}`;return e.jsxs("div",{className:`space-y-1.5 w-full ${b}`,children:[l&&e.jsxs("label",{htmlFor:a,className:"block text-sm font-medium text-foreground tracking-tight",children:[l,n&&e.jsx("span",{className:"text-destructive ml-1",children:"*"})]}),e.jsx("textarea",{...v,id:a,rows:x,placeholder:p,disabled:f,"aria-invalid":!!i,"aria-describedby":i?`${a}-error`:o?`${a}-desc`:void 0,className:`flex w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${i?"border-destructive focus-visible:ring-destructive":"border-border hover:border-muted-foreground/50"} ${s}`}),i?e.jsx("p",{id:`${a}-error`,className:"text-xs font-medium text-destructive animate-fadeIn",children:i.message}):o?e.jsx("p",{id:`${a}-desc`,className:"text-xs text-muted-foreground",children:o}):null]})}C.__docgenInfo={description:"",methods:[],displayName:"ControlledTextarea",props:{label:{required:!1,tsType:{name:"string"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:""},rows:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"3",computed:!1}},helperText:{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},textareaClassName:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},required:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},id:{required:!1,tsType:{name:"string"},description:""}},composes:["UseControllerProps"]};function T({name:t,control:u,rules:r,defaultValue:c,shouldUnregister:m,label:l,options:p,placeholder:x="Chọn một tuỳ chọn",helperText:o,className:b="",selectClassName:s="",disabled:f=!1,required:n=!1,id:d}){const{field:v,fieldState:{error:i}}=g({name:t,control:u,rules:{required:n?"Vui lòng chọn một mục":!1,...r},defaultValue:c,shouldUnregister:m}),a=d||`select-${t}`;return e.jsxs("div",{className:`space-y-1.5 w-full ${b}`,children:[l&&e.jsxs("label",{htmlFor:a,className:"block text-sm font-medium text-foreground tracking-tight",children:[l,n&&e.jsx("span",{className:"text-destructive ml-1",children:"*"})]}),e.jsxs("div",{className:"relative",children:[e.jsxs("select",{...v,id:a,disabled:f,"aria-invalid":!!i,"aria-describedby":i?`${a}-error`:o?`${a}-desc`:void 0,className:`flex h-10 w-full appearance-none rounded-lg border bg-background px-3 py-2 pr-8 text-sm text-foreground shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${i?"border-destructive focus-visible:ring-destructive":"border-border hover:border-muted-foreground/50"} ${s}`,children:[x&&e.jsx("option",{value:"",disabled:!0,children:x}),p.map(y=>e.jsx("option",{value:y.value,children:y.label},y.value))]}),e.jsx("div",{className:"pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground",children:e.jsx("svg",{className:"h-4 w-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 9l-7 7-7-7"})})})]}),i?e.jsx("p",{id:`${a}-error`,className:"text-xs font-medium text-destructive animate-fadeIn",children:i.message}):o?e.jsx("p",{id:`${a}-desc`,className:"text-xs text-muted-foreground",children:o}):null]})}T.__docgenInfo={description:"",methods:[],displayName:"ControlledSelect",props:{label:{required:!1,tsType:{name:"string"},description:""},options:{required:!0,tsType:{name:"Array",elements:[{name:"SelectOption"}],raw:"SelectOption[]"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Chọn một tuỳ chọn'",computed:!1}},helperText:{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},selectClassName:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},required:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},id:{required:!1,tsType:{name:"string"},description:""}},composes:["UseControllerProps"]};function q({name:t,control:u,rules:r,defaultValue:c,shouldUnregister:m,label:l,helperText:p,className:x="",disabled:o=!1,id:b}){const{field:s,fieldState:{error:f}}=g({name:t,control:u,rules:r,defaultValue:c,shouldUnregister:m}),n=b||`checkbox-${t}`;return e.jsxs("div",{className:`space-y-1 ${x}`,children:[e.jsxs("div",{className:"flex items-start gap-2.5",children:[e.jsx("input",{type:"checkbox",id:n,checked:!!s.value,onChange:d=>s.onChange(d.target.checked),onBlur:s.onBlur,ref:s.ref,disabled:o,className:"mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-colors cursor-pointer disabled:cursor-not-allowed"}),e.jsx("label",{htmlFor:n,className:"text-sm font-medium leading-none text-foreground cursor-pointer select-none",children:l})]}),f?e.jsx("p",{className:"text-xs font-medium text-destructive animate-fadeIn pl-6",children:f.message}):p?e.jsx("p",{className:"text-xs text-muted-foreground pl-6",children:p}):null]})}q.__docgenInfo={description:"",methods:[],displayName:"ControlledCheckbox",props:{label:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},helperText:{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},id:{required:!1,tsType:{name:"string"},description:""}},composes:["UseControllerProps"]};function k({name:t,control:u,rules:r,defaultValue:c,shouldUnregister:m,label:l,description:p,className:x="",disabled:o=!1,id:b}){const{field:s,fieldState:{error:f}}=g({name:t,control:u,rules:r,defaultValue:c,shouldUnregister:m}),n=b||`switch-${t}`,d=!!s.value;return e.jsxs("div",{className:`space-y-1 ${x}`,children:[e.jsxs("div",{className:"flex items-center justify-between gap-3",children:[e.jsxs("label",{htmlFor:n,className:"cursor-pointer select-none",children:[e.jsx("div",{className:"text-sm font-medium text-foreground",children:l}),p&&e.jsx("div",{className:"text-xs text-muted-foreground",children:p})]}),e.jsx("button",{type:"button",role:"switch",id:n,"aria-checked":d,disabled:o,onClick:()=>s.onChange(!d),onBlur:s.onBlur,ref:s.ref,className:`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${d?"bg-primary":"bg-muted"}`,children:e.jsx("span",{className:`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${d?"translate-x-5":"translate-x-0"}`})})]}),f&&e.jsx("p",{className:"text-xs font-medium text-destructive animate-fadeIn",children:f.message})]})}k.__docgenInfo={description:"",methods:[],displayName:"ControlledSwitch",props:{label:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},description:{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},id:{required:!1,tsType:{name:"string"},description:""}},composes:["UseControllerProps"]};const K={title:"Forms/CompleteFormDemo",parameters:{layout:"centered"}},h={render:()=>{const[t,u]=V.useState(null),{control:r,handleSubmit:c}=$({defaultValues:{word:"学习",pinyin:"xuéxí",hskLevel:"1",meaning:"Học tập, nghiên cứu",isFavorite:!0,notifyReview:!1}}),m=l=>{u(l)};return e.jsxs("div",{className:"w-[420px] rounded-2xl border border-border bg-card p-6 shadow-lg",children:[e.jsx("h3",{className:"mb-1 text-lg font-bold text-foreground",children:"Thêm từ vựng tiếng Trung"}),e.jsx("p",{className:"mb-4 text-xs text-muted-foreground",children:"Biểu mẫu tích hợp 100% qua hook useController của react-hook-form"}),e.jsxs("form",{onSubmit:c(m),className:"space-y-4",children:[e.jsx(N,{name:"word",control:r,label:"Hán tự (Hanzi)",placeholder:"Ví dụ: 你好",required:!0}),e.jsx(N,{name:"pinyin",control:r,label:"Phiên âm (Pinyin)",placeholder:"Ví dụ: nǐ hǎo",required:!0}),e.jsx(T,{name:"hskLevel",control:r,label:"Cấp độ HSK",options:[{label:"HSK 1 (Sơ cấp)",value:"1"},{label:"HSK 2",value:"2"},{label:"HSK 3",value:"3"},{label:"HSK 4 (Trung cấp)",value:"4"},{label:"HSK 5",value:"5"},{label:"HSK 6 (Cao cấp)",value:"6"}]}),e.jsx(C,{name:"meaning",control:r,label:"Ý nghĩa & Ví dụ",placeholder:"Nghĩa tiếng Việt...",rows:2}),e.jsx(q,{name:"isFavorite",control:r,label:"Đánh dấu từ yêu thích"}),e.jsx(k,{name:"notifyReview",control:r,label:"Bật nhắc nhở ôn tập SM-2",description:"Tự động thêm vào hàng đợi ôn hôm nay"}),e.jsx("button",{type:"submit",className:"w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90",children:"Lưu dữ liệu"})]}),t&&e.jsxs("div",{className:"mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs",children:[e.jsx("p",{className:"font-semibold text-emerald-700 dark:text-emerald-300",children:"Dữ liệu đã submit:"}),e.jsx("pre",{className:"mt-1 text-foreground overflow-x-auto",children:JSON.stringify(t,null,2)})]})]})}};var j,w,S;h.parameters={...h.parameters,docs:{...(j=h.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => {
    const [submittedData, setSubmittedData] = useState<any>(null);
    const {
      control,
      handleSubmit
    } = useForm({
      defaultValues: {
        word: '学习',
        pinyin: 'xuéxí',
        hskLevel: '1',
        meaning: 'Học tập, nghiên cứu',
        isFavorite: true,
        notifyReview: false
      }
    });
    const onSubmit = (data: any) => {
      setSubmittedData(data);
    };
    return <div className="w-[420px] rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h3 className="mb-1 text-lg font-bold text-foreground">Thêm từ vựng tiếng Trung</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Biểu mẫu tích hợp 100% qua hook useController của react-hook-form
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ControlledInput name="word" control={control} label="Hán tự (Hanzi)" placeholder="Ví dụ: 你好" required />

          <ControlledInput name="pinyin" control={control} label="Phiên âm (Pinyin)" placeholder="Ví dụ: nǐ hǎo" required />

          <ControlledSelect name="hskLevel" control={control} label="Cấp độ HSK" options={[{
          label: 'HSK 1 (Sơ cấp)',
          value: '1'
        }, {
          label: 'HSK 2',
          value: '2'
        }, {
          label: 'HSK 3',
          value: '3'
        }, {
          label: 'HSK 4 (Trung cấp)',
          value: '4'
        }, {
          label: 'HSK 5',
          value: '5'
        }, {
          label: 'HSK 6 (Cao cấp)',
          value: '6'
        }]} />

          <ControlledTextarea name="meaning" control={control} label="Ý nghĩa & Ví dụ" placeholder="Nghĩa tiếng Việt..." rows={2} />

          <ControlledCheckbox name="isFavorite" control={control} label="Đánh dấu từ yêu thích" />

          <ControlledSwitch name="notifyReview" control={control} label="Bật nhắc nhở ôn tập SM-2" description="Tự động thêm vào hàng đợi ôn hôm nay" />

          <button type="submit" className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90">
            Lưu dữ liệu
          </button>
        </form>

        {submittedData && <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs">
            <p className="font-semibold text-emerald-700 dark:text-emerald-300">Dữ liệu đã submit:</p>
            <pre className="mt-1 text-foreground overflow-x-auto">{JSON.stringify(submittedData, null, 2)}</pre>
          </div>}
      </div>;
  }
}`,...(S=(w=h.parameters)==null?void 0:w.docs)==null?void 0:S.source}}};const R=["FullFormDemo"];export{h as FullFormDemo,R as __namedExportsOrder,K as default};
