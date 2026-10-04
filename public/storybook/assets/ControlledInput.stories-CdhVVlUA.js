import{j as e}from"./jsx-runtime-CDt2p4po.js";import"./index-GiUgBvb1.js";import{C as k,u as f}from"./ControlledInput-BwZphOGv.js";const A={title:"Forms/ControlledInput",component:k,parameters:{layout:"centered"}};function t(j){const{control:w}=f({defaultValues:{username:"",email:"",password:""}});return e.jsx("div",{className:"w-[320px] p-4 bg-card rounded-xl border border-border",children:e.jsx(k,{control:w,...j})})}const r={render:()=>e.jsx(t,{name:"username",label:"Tên người dùng",placeholder:"Nhập tên người dùng...",helperText:"Tên hiển thị công khai trên tài khoản của bạn"})},a={render:()=>e.jsx(t,{name:"email",label:"Địa chỉ Email",type:"email",placeholder:"email@example.com",required:!0,rules:{pattern:{value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:"Email không hợp lệ"}}})},s={render:()=>e.jsx(t,{name:"password",label:"Mật khẩu",type:"password",placeholder:"••••••••",required:!0,rules:{minLength:{value:6,message:"Mật khẩu tối thiểu 6 ký tự"}}})},n={render:()=>e.jsx(t,{name:"username",label:"Không thể chỉnh sửa",placeholder:"Giá trị bị vô hiệu",disabled:!0})};var l,o,p;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <InputWrapper name="username" label="Tên người dùng" placeholder="Nhập tên người dùng..." helperText="Tên hiển thị công khai trên tài khoản của bạn" />
}`,...(p=(o=r.parameters)==null?void 0:o.docs)==null?void 0:p.source}}};var d,i,m;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <InputWrapper name="email" label="Địa chỉ Email" type="email" placeholder="email@example.com" required rules={{
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
      message: 'Email không hợp lệ'
    }
  }} />
}`,...(m=(i=a.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};var u,c,h;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <InputWrapper name="password" label="Mật khẩu" type="password" placeholder="••••••••" required rules={{
    minLength: {
      value: 6,
      message: 'Mật khẩu tối thiểu 6 ký tự'
    }
  }} />
}`,...(h=(c=s.parameters)==null?void 0:c.docs)==null?void 0:h.source}}};var g,b,x;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <InputWrapper name="username" label="Không thể chỉnh sửa" placeholder="Giá trị bị vô hiệu" disabled />
}`,...(x=(b=n.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};const E=["Default","WithValidation","Password","Disabled"];export{r as Default,n as Disabled,s as Password,a as WithValidation,E as __namedExportsOrder,A as default};
