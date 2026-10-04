import{j as e}from"./jsx-runtime-CDt2p4po.js";import{r as c}from"./index-GiUgBvb1.js";import{u as p,C as r}from"./ControlledInput-BwZphOGv.js";import{C as b,a as h,b as x,c as g}from"./AudioButton-DaQ7KC20.js";import"./Button-n0DAZ2Bc.js";import"./Badge-DC8bmRuK.js";import"./utils-Cok0UjuV.js";const N={title:"Forms/CompleteFormDemo",parameters:{layout:"centered"}},o={render:()=>{const[l,d]=c.useState(null),{control:t,handleSubmit:i}=p({defaultValues:{word:"学习",pinyin:"xuéxí",hskLevel:"1",meaning:"Học tập, nghiên cứu",isFavorite:!0,notifyReview:!1}}),m=u=>{d(u)};return e.jsxs("div",{className:"w-[420px] rounded-2xl border border-border bg-card p-6 shadow-lg",children:[e.jsx("h3",{className:"mb-1 text-lg font-bold text-foreground",children:"Thêm từ vựng tiếng Trung"}),e.jsx("p",{className:"mb-4 text-xs text-muted-foreground",children:"Biểu mẫu tích hợp 100% qua hook useController của react-hook-form"}),e.jsxs("form",{onSubmit:i(m),className:"space-y-4",children:[e.jsx(r,{name:"word",control:t,label:"Hán tự (Hanzi)",placeholder:"Ví dụ: 你好",required:!0}),e.jsx(r,{name:"pinyin",control:t,label:"Phiên âm (Pinyin)",placeholder:"Ví dụ: nǐ hǎo",required:!0}),e.jsx(b,{name:"hskLevel",control:t,label:"Cấp độ HSK",options:[{label:"HSK 1 (Sơ cấp)",value:"1"},{label:"HSK 2",value:"2"},{label:"HSK 3",value:"3"},{label:"HSK 4 (Trung cấp)",value:"4"},{label:"HSK 5",value:"5"},{label:"HSK 6 (Cao cấp)",value:"6"}]}),e.jsx(h,{name:"meaning",control:t,label:"Ý nghĩa & Ví dụ",placeholder:"Nghĩa tiếng Việt...",rows:2}),e.jsx(x,{name:"isFavorite",control:t,label:"Đánh dấu từ yêu thích"}),e.jsx(g,{name:"notifyReview",control:t,label:"Bật nhắc nhở ôn tập SM-2",description:"Tự động thêm vào hàng đợi ôn hôm nay"}),e.jsx("button",{type:"submit",className:"w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90",children:"Lưu dữ liệu"})]}),l&&e.jsxs("div",{className:"mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs",children:[e.jsx("p",{className:"font-semibold text-emerald-700 dark:text-emerald-300",children:"Dữ liệu đã submit:"}),e.jsx("pre",{className:"mt-1 text-foreground overflow-x-auto",children:JSON.stringify(l,null,2)})]})]})}};var a,n,s;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`{
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
}`,...(s=(n=o.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const j=["FullFormDemo"];export{o as FullFormDemo,j as __namedExportsOrder,N as default};
