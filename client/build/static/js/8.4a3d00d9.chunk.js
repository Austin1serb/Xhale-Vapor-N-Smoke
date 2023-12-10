"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[8],{8:function(s,n,e){e.r(n),e.d(n,{default:function(){return w}});var t=e(4165),i=e(5861),c=e(9439),l=e(5527),o=e(6029),r=e(3400),a=e(493),d=e(4852),h=e(3239),m=e(4294),x=e(2791),p=e(1087),u=e(6125),j=e(184),N=x.lazy((function(){return Promise.all([e.e(704),e.e(889),e.e(11),e.e(502)]).then(e.bind(e,2095))})),w=function(s){var n=s.isVisible,e=s.onLinkClick,w=(0,x.useState)(!1),f=(0,c.Z)(w,2),Z=f[0],C=f[1],v=(0,x.useState)([]),L=(0,c.Z)(v,2),g=L[0],k=L[1],P=(0,x.useState)(!1),S=(0,c.Z)(P,2),U=S[0],O=S[1],B=(0,x.useState)(!1),b=(0,c.Z)(B,2),_=b[0],T=b[1],A=(0,x.useState)(null),D=(0,c.Z)(A,2),y=D[0],E=D[1],R=function(){var s=(0,i.Z)((0,t.Z)().mark((function s(){var n,e;return(0,t.Z)().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:return O(!0),s.prev=1,s.next=4,fetch("http://localhost:8000/api/product/featured?limit=3");case 4:if((n=s.sent).ok){s.next=7;break}throw new Error("HTTP error! status: ".concat(n.status));case 7:return s.next=9,n.json();case 9:e=s.sent,k(e),s.next=16;break;case 13:s.prev=13,s.t0=s.catch(1),console.error("Could not fetch featured products:",s.t0);case 16:return s.prev=16,O(!1),s.finish(16);case 19:case"end":return s.stop()}}),s,null,[[1,13,16,19]])})));return function(){return s.apply(this,arguments)}}();(0,x.useEffect)((function(){var s=function(){window.innerWidth>900?n&&0===g.length&&R():k([])};return window.addEventListener("resize",s),s(),function(){window.removeEventListener("resize",s)}}),[n,g.length]);var H=function(s){C(Z===s?null:s)};(0,x.useEffect)((function(){window.innerWidth<=900&&C(null);var s=function(s,n){var e;return function(){for(var t=arguments.length,i=new Array(t),c=0;c<t;c++)i[c]=arguments[c];clearTimeout(e),e=setTimeout((function(){return s.apply(void 0,i)}),n)}}((function(){window.innerWidth<=900&&C(null)}),150);return window.addEventListener("resize",s),function(){window.removeEventListener("resize",s)}}),[]);var I={fontSize:"10px",padding:"5px",borderRadius:"0px",marginRight:"10px",height:"26px"},M={pl:{xs:5,md:0}};return(0,j.jsxs)(l.Z,{elevation:0,className:"dropdown",component:"div",sx:{boxShadow:"0 6px 6px rgba(0, 0, 0, 0.1)"},children:[(0,j.jsxs)(o.Z,{className:"dropdown-container",children:[(0,j.jsxs)(o.Z,{component:"div",sx:{display:"flex",flexDirection:{xs:"column",md:"row"},width:"92%"},children:[(0,j.jsxs)("div",{className:"dropdown-section",children:[(0,j.jsxs)("div",{className:"list-header",onClick:function(){H("SHOP_ALL_CBD")},children:[(0,j.jsx)("span",{className:"list-content",children:"SHOP ALL"}),(0,j.jsx)(r.Z,{className:"icon-button-dropdown",sx:{display:{md:"none"}},children:(0,j.jsx)("svg",{height:"40",className:"arrow-icon ".concat("SHOP_ALL_CBD"===Z&&"rotate"),viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,j.jsx)("path",{d:"M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"})})})]}),(0,j.jsx)(u.Z,{in:"SHOP_ALL_CBD"===Z||window.innerWidth>900,children:(0,j.jsxs)(a.Z,{sx:M,className:"list-container",children:[(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"Shop All A-Z"})}),(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=best-sellers",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"Best Sellers"})}),(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=new-products",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"New Products"})}),(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=high-potency",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"High Potency"})}),(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=featured",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"Featured "})})]})})]}),(0,j.jsxs)("div",{className:"dropdown-section",children:[(0,j.jsxs)("div",{className:"list-header",onClick:function(){return H("SHOP_BY_CATEGORY")},children:[(0,j.jsx)("span",{className:"list-content",children:"SHOP BY CATEGORY"}),(0,j.jsx)(r.Z,{className:"icon-button-dropdown",sx:{display:{md:"none"}},children:(0,j.jsx)("svg",{height:"40",className:"arrow-icon ".concat("SHOP_BY_CATEGORY"===Z&&"rotate"),viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,j.jsx)("path",{d:"M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"})})})]}),(0,j.jsx)(u.Z,{in:"SHOP_BY_CATEGORY"===Z||window.innerWidth>900,children:(0,j.jsxs)(a.Z,{sx:M,className:"list-container",children:[(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=gummies",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"CBD Gummies"})}),(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=oils",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"CBD Oils"})}),(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=pills",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"CBD Pills"})}),(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=topicals",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"CBD Topicals"})}),(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=tinctures",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"CBD Tinctures"})}),(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=edibles",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"CBD Edibles"})}),(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=cbd",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"THC-Free CBD"})})]})})]}),(0,j.jsxs)("div",{className:"dropdown-section",children:[(0,j.jsxs)("div",{className:"list-header",onClick:function(){return H("MORE_CANNABINOIDS")},children:[(0,j.jsx)("span",{className:"list-content",children:" MORE CANNABINOIDS"}),(0,j.jsx)(r.Z,{className:"icon-button-dropdown",sx:{display:{md:"none"}},children:(0,j.jsx)("svg",{height:"40",className:"arrow-icon ".concat("MORE_CANNABINOIDS"===Z&&"rotate"),viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,j.jsx)("path",{d:"M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"})})})]}),("MORE_CANNABINOIDS"===Z||window.innerWidth>900)&&(0,j.jsxs)(a.Z,{sx:M,className:"list-container",children:[(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=cbn",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"CBN"})}),(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=cbg",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"CBG"})}),(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=CBDa",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"CBDa"})}),(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/shop?filter=delta 9",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"Delta 9"})})]})]}),(0,j.jsxs)("div",{className:"dropdown-section",style:{display:"".concat(window.innerWidth<1050?"none":"block")},children:[(0,j.jsxs)("div",{className:"list-header",onClick:function(){return H("OTHER_PRODUCTS")},children:[(0,j.jsx)("span",{className:"list-content",children:"OTHER PRODUCTS"}),(0,j.jsx)(r.Z,{className:"icon-button-dropdown",sx:{display:{md:"none"}},children:(0,j.jsx)("svg",{height:"40",className:"arrow-icon ".concat("OTHER_PRODUCTS"===Z&&"rotate"),viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,j.jsx)("path",{d:"M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"})})})]}),(0,j.jsx)(u.Z,{in:"OTHER_PRODUCTS"===Z||window.innerWidth>900,children:(0,j.jsxs)(a.Z,{sx:M,className:"list-container",children:[(0,j.jsx)(d.ZP,{className:"list-item",onClick:e,component:p.rU,to:"/shop?filter=mushrooms",children:(0,j.jsx)("span",{className:"list-content",children:"Mushroom Gummies"})}),(0,j.jsx)(d.ZP,{className:"list-item",onClick:e,component:p.rU,to:"/shop?filter=kratom",children:(0,j.jsx)("span",{className:"list-content",children:"Kratom"})}),(0,j.jsx)(d.ZP,{className:"list-item",onClick:e,component:p.rU,to:"/shop?filter=pet",children:(0,j.jsx)("span",{className:"list-content",children:"CBD for Pets"})})]})})]}),(0,j.jsxs)(o.Z,{className:"dropdown-section",sx:{display:{sm:"block",md:"none"}},children:[(0,j.jsxs)("div",{className:"list-header",onClick:function(){return H("JOIN_US")},children:[(0,j.jsx)("span",{className:"list-content",children:"Join Us"}),(0,j.jsx)(r.Z,{className:"icon-button-dropdown",sx:{display:{md:"none"}},children:(0,j.jsx)("svg",{height:"40",className:"arrow-icon ".concat("JOIN_US"===Z&&"rotate"),viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,j.jsx)("path",{d:"M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"})})})]}),(0,j.jsx)(u.Z,{in:"JOIN_US"===Z||window.innerWidth>900,children:(0,j.jsx)(a.Z,{sx:M,className:"list-container",children:(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/registration",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"Sign Up"})})})})]}),(0,j.jsxs)(o.Z,{className:"dropdown-section",sx:{display:{sm:"block",md:"none"}},children:[(0,j.jsxs)("div",{className:"list-header",onClick:function(){return H("ABOUT_US")},children:[(0,j.jsx)("span",{className:"list-content",children:"About Us"}),(0,j.jsx)(r.Z,{className:"icon-button-dropdown",sx:{display:{md:"none"}},children:(0,j.jsx)("svg",{height:"40",className:"arrow-icon ".concat("ABOUT_US"===Z&&"rotate"),viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,j.jsx)("path",{d:"M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"})})})]}),(0,j.jsx)(u.Z,{in:"ABOUT_US"===Z||window.innerWidth>900,children:(0,j.jsx)(a.Z,{sx:M,className:"list-container",children:(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/about",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"Our Story"})})})})]}),(0,j.jsxs)(o.Z,{className:"dropdown-section",sx:{display:{sm:"block",md:"none"},mb:2},children:[(0,j.jsxs)("div",{className:"list-header",onClick:function(){return H("SUPPORT")},children:[(0,j.jsx)("span",{className:"list-content",children:"Support"}),(0,j.jsx)(r.Z,{className:"icon-button-dropdown",sx:{display:{md:"none"}},children:(0,j.jsx)("svg",{height:"40",className:"arrow-icon ".concat("SUPPORT"===Z&&"rotate"),viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,j.jsx)("path",{d:"M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"})})})]}),(0,j.jsx)(u.Z,{in:"SUPPORT"===Z||window.innerWidth>900,children:(0,j.jsx)(a.Z,{sx:M,className:"list-container",children:(0,j.jsx)(d.ZP,{className:"list-item",component:p.rU,to:"/contact",onClick:e,children:(0,j.jsx)("span",{className:"list-content",children:"Customer Service"})})})})]})]}),U?(0,j.jsx)(o.Z,{children:(0,j.jsx)(h.Z,{})}):(0,j.jsxs)(o.Z,{className:"dropdown-featured",sx:{ml:{ms:0,lg:-10}},children:[(0,j.jsx)("legend",{className:"dropdown-featured-header",children:"Featured Products"}),g.map((function(s){return(0,j.jsxs)(o.Z,{onClick:function(){E(s._id),T(!0)},className:"drowdown-featured-container",children:[" ",(0,j.jsx)("img",{className:"dropdown-featured-img",alt:"featured",src:s.imgSource[0].url,loading:"lazy"}),(0,j.jsxs)(o.Z,{children:[(0,j.jsx)(o.Z,{className:"dropdown-featured-name",children:s.name}),(0,j.jsxs)(o.Z,{className:"dropdown-featured-price",children:["$",s.price,(0,j.jsx)(m.Z,{variant:"outlined",sx:I,className:"dropdown-featured-button",children:"Quick View"})]})]})]},s._id)}))]})]}),(0,j.jsx)(o.Z,{sx:{textAlign:"center",mt:5,borderBottom:.5},children:"Exhale Vapor & Smoke"}),(0,j.jsx)(x.Suspense,{fallback:(0,j.jsx)(h.Z,{}),children:(0,j.jsx)(N,{productId:y,open:_,handleClose:function(){return T(!1)},products:g})})]})}}}]);
//# sourceMappingURL=8.4a3d00d9.chunk.js.map