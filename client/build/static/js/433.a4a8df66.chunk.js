"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[433,95],{2095:function(e,t,n){n.r(t),n.d(t,{default:function(){return N}});var i=n(1413),l=n(5987),r=n(3433),s=n(9439),a=n(2791),c=n(6029),o=n(3239),d=n(1889),u=n(890),x=n(3400),m=n(9124),h=n(3896),f=n(8096),p=n(829),v=n(8406),b=n(3786),j=n(4294),g=n(8447),Z=n(6679),w=function(e,t){var n=(0,a.useRef)(null),i=(0,a.useRef)(null),l=(0,a.useCallback)((function(){for(var l=arguments.length,r=new Array(l),s=0;s<l;s++)r[s]=arguments[s];var a=Date.now();n.current&&a<n.current+t?(clearTimeout(i.current),i.current=setTimeout((function(){n.current=a,e.apply(void 0,r)}),t+n.current-a)):(n.current=a,e.apply(void 0,r))}),[e,t]);return l},y=n(184),k=["children","value","index"],S="freight-display-pro, serif",C={fontFamily:S,position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:{xs:"90%",sm:"600px",md:"800px"},maxHeight:{xs:"70vh",sm:"90vh"},overflowY:"auto",bgcolor:"background.paper",boxShadow:"2px -2px 23px 0",border:"5px solid #ccc",p:4,borderRadius:2};function q(e){var t=e.children,n=e.value,r=e.index,s=(0,l.Z)(e,k);return(0,y.jsx)("div",(0,i.Z)((0,i.Z)({role:"tabpanel",hidden:n!==r,id:"simple-tabpanel-".concat(r),"aria-labelledby":"simple-tab-".concat(r)},s),{},{children:n===r&&(0,y.jsx)(c.Z,{sx:{p:3},children:(0,y.jsx)("div",{children:t})})}))}var N=function(e){var t=e.productId,n=e.open,i=e.handleClose,l=e.products,k=(0,a.useState)(null),N=(0,s.Z)(k,2),z=N[0],F=N[1],E=(0,a.useState)(0),H=(0,s.Z)(E,2),B=H[0],L=H[1],R=(0,a.useState)(""),I=(0,s.Z)(R,2),M=I[0],P=I[1],D=(0,a.useState)(1),A=(0,s.Z)(D,2),W=A[0],V=A[1],_=(0,a.useState)(""),K=(0,s.Z)(_,2),T=K[0],Y=K[1],Q=(0,a.useState)(!1),X=(0,s.Z)(Q,2),$=X[0],G=(X[1],(0,Z.j)().addToCart),J=(0,a.useState)([]),O=(0,s.Z)(J,2),U=O[0],ee=O[1];(0,a.useEffect)((function(){z&&(document.title=z.seo.title||z.name)}),[z]),(0,a.useEffect)((function(){if(z){var e=document.querySelector('meta[name="keywords"]');e&&(e.content=z.seoKeywords.join(", ")||"default, keywords")}}),[z]),(0,a.useEffect)((function(){if(!n){F(null),P(""),document.title="Shop at Herba Naturals - Explore Koi, Beezbee, Wyld Products and More";var e=document.querySelector('meta[name="description"]'),t=document.querySelector('meta[name="keywords"]');e&&(e.content="Browse Herba Natural's online store for the finest CBD products. Featuring brands like Koi, Beezbee, and Wyld with a variety of CBD oils, edibles, and topicals."),t&&(t.content="default, keywords")}}),[n]),(0,a.useEffect)((function(){if(!n)return F(null),void P("");if(t){var e=l.find((function(e){return e._id===t}));e?(F(e),e.imgSource.length>0&&P(e.imgSource[0].url)):console.error("Product not found")}}),[t,n,l]),(0,a.useEffect)((function(){if(z){var e=z.flavor.split(",")[0].trim();Y(e);var t=l.filter((function(e){return e._id!==z._id&&e.category.some((function(e){return z.category.includes(e)}))})).slice(0,3);ee(t)}}),[z,l]),(0,a.useEffect)((function(){z&&z.imgSource.length>0&&P(z.imgSource[0].url)}),[z]);var te=function(e,t){L(t)},ne=(0,a.useState)(!1),ie=(0,s.Z)(ne,2),le=ie[0],re=ie[1],se=(0,a.useState)({x:0,y:0}),ae=(0,s.Z)(se,2),ce=ae[0],oe=ae[1],de=(0,a.useState)({width:200,height:200}),ue=(0,s.Z)(de,1)[0],xe=(0,a.useState)(2),me=(0,s.Z)(xe,1)[0],he=w((function(e){var t=e.target.getBoundingClientRect(),n=e.pageX-t.left-window.scrollX+50,i=e.pageY-t.top-window.scrollY+45;oe({x:n-ue.width/2,y:i-ue.height/2})}),50);return(0,y.jsx)(g.Z,{open:n,onClose:i,children:(0,y.jsx)(c.Z,{className:"quickview-container",sx:C,children:$?(0,y.jsx)(c.Z,{sx:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%"},children:(0,y.jsx)(o.Z,{})}):z?(0,y.jsx)(d.ZP,{container:!0,spacing:2,style:{minWidth:"280px"},children:(0,y.jsxs)(d.ZP,{container:!0,spacing:2,children:[(0,y.jsx)(d.ZP,{item:!0,xs:12,sm:5,md:6,children:(0,y.jsxs)(c.Z,{className:"quickview-img-container",sx:{display:"flex",flexDirection:{xs:"row",sm:"column"}},children:[(0,y.jsxs)(c.Z,{children:[(0,y.jsx)(c.Z,{sx:{display:"flex",ml:{sm:3,md:0}},children:z.imgSource.map((function(e,t){return(0,y.jsx)(c.Z,{className:"quickview-thumbnail-container",sx:{visibility:{xs:t<3?"visible":"hidden",sm:"visible"}},children:(0,y.jsx)("img",{className:"quickview-thumbnail",src:"".concat(e.url),alt:"".concat(z.name," thumbnail ").concat(t),onClick:function(){return t=e.url,void P(t);var t}},"image")},"thumbnail:"+t)}))}),(0,y.jsx)(c.Z,{className:"image-container",onMouseEnter:function(){return re(!0)},onMouseMove:he,onMouseLeave:function(){return re(!1)},display:"flex",justifyContent:"center",children:(0,y.jsx)("img",{className:"quickview-main-image",src:M,alt:z.name},z.name)})]}),(0,y.jsx)(u.Z,{sx:{display:{xs:"none",sm:"block"}},className:"zoom-box-title",children:"Zoom Box"}),(0,y.jsx)(c.Z,{className:"zoom-box",sx:{display:{xs:"none",sm:"block"}},children:le&&(0,y.jsx)(c.Z,{className:"zoom-lens",style:{position:"relative",width:"".concat(ue.width,"px"),height:"".concat(ue.height,"px"),overflow:"hidden",border:"1px solid black"},children:(0,y.jsx)("img",{src:M,alt:z.name,style:{position:"absolute",width:"".concat(300*me,"px"),height:"".concat(300*me,"px"),left:"-".concat(ce.x*me,"px"),top:"-".concat(ce.y*me,"px"),pointerEvents:"none"}})})})]})}),(0,y.jsxs)(d.ZP,{item:!0,xs:12,sm:7,md:6,children:[(0,y.jsxs)(c.Z,{sx:{display:"flex",justifyContent:"space-between"},children:[(0,y.jsx)("div",{style:{marginRight:"-30px"},children:(0,y.jsx)(u.Z,{sx:{width:"100%",fontSize:{xs:18,sm:22},ml:{xs:5,sm:3,md:0},fontFamily:S,fontWeight:600},variant:"h6",className:"quickview-title",children:z.name})}),(0,y.jsx)(x.Z,{sx:{p:{sm:2,md:2},m:2},className:"quickview-close-button",onClick:i,children:(0,y.jsxs)("svg",{height:"45",width:"45",fill:"#282F48",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1024 1024",children:[(0,y.jsx)("path",{fill:"#282F48",d:"M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"}),(0,y.jsx)("path",{fill:"white",d:"M184 840h656V184H184v656zm163.9-473.9A7.95 7.95 0 0 1 354 353h58.9c4.7 0 9.2 2.1 12.3 5.7L512 462.2l86.8-103.5c3-3.6 7.5-5.7 12.3-5.7H670c6.8 0 10.5 7.9 6.1 13.1L553.8 512l122.3 145.9c4.4 5.2.7 13.1-6.1 13.1h-58.9c-4.7 0-9.2-2.1-12.3-5.7L512 561.8l-86.8 103.5c-3 3.6-7.5 5.7-12.3 5.7H354c-6.8 0-10.5-7.9-6.1-13.1L470.2 512 347.9 366.1z"}),(0,y.jsx)("path",{fill:"#282F48",d:"M354 671h58.9c4.8 0 9.3-2.1 12.3-5.7L512 561.8l86.8 103.5c3.1 3.6 7.6 5.7 12.3 5.7H670c6.8 0 10.5-7.9 6.1-13.1L553.8 512l122.3-145.9c4.4-5.2.7-13.1-6.1-13.1h-58.9c-4.8 0-9.3 2.1-12.3 5.7L512 462.2l-86.8-103.5c-3.1-3.6-7.6-5.7-12.3-5.7H354c-6.8 0-10.5 7.9-6.1 13.1L470.2 512 347.9 657.9A7.95 7.95 0 0 0 354 671z"})]})})]}),(0,y.jsx)(c.Z,{sx:{borderBottom:1,borderColor:"divider",mr:{sx:0,sm:6,md:15.01}},children:(0,y.jsxs)(m.Z,{sx:{ml:{xs:5,sm:3,md:0}},value:B,onChange:te,"aria-label":"Product details tabs",children:[(0,y.jsx)(h.Z,{tabIndex:0,type:"button",label:"Details"}),(0,y.jsx)(h.Z,{tabIndex:1,type:"button",label:"Related"}),(0,y.jsx)(h.Z,{tabIndex:3,type:"button",label:"Specs"})]})}),(0,y.jsxs)(c.Z,{height:"320px",sx:{},children:[(0,y.jsx)(q,{value:B,index:0,children:(0,y.jsx)(c.Z,{sx:{overflow:"auto",height:"200px",border:.1,p:2,boxShadow:" 1px 4px 6px -1px rgba(0, 0, 0, 0.2);"},children:(0,y.jsx)("span",{className:"quickview-description",children:z.description})})}),(0,y.jsx)(q,{value:B,index:1,children:U.map((function(e){return(0,y.jsxs)(c.Z,{onClick:function(){return F(e)},className:"quickview-related-container",children:[" ",(0,y.jsx)("img",{className:"quickview-related-img",alt:"related",src:"".concat(e.imgSource[0].url)}),(0,y.jsx)(c.Z,{variant:"button",children:(0,y.jsx)(c.Z,{className:"quickview-related-name",children:e.name})})]},e._id)}))}),(0,y.jsx)(q,{value:B,index:2,children:z.specs})]}),(0,y.jsxs)(c.Z,{className:"quickview-price",children:["Price: $",z.price]}),(0,y.jsxs)(c.Z,{sx:{mb:3,display:"flex",justifyContent:"space-between",alignItems:"start",flexDirection:{xs:"column",sm:"row"}},children:[(0,y.jsxs)(f.Z,{sx:{ml:3,mb:1,mr:4},children:[(0,y.jsx)(p.Z,{name:"quantity-label",id:"quantity-label",children:"Qty"}),(0,y.jsx)(v.Z,{labelId:"quantity-label",id:"quantity-select",name:"quantity-select",sx:{width:"100px",borderRadius:0},value:W,onChange:function(e){return V(Number(e.target.value))},label:"Qty",defaultValue:1,children:(0,r.Z)(Array(10).keys()).map((function(e){return(0,y.jsx)(b.Z,{value:e+1,children:e+1},e+1)}))})]}),(0,y.jsxs)(f.Z,{sx:{width:"280px",ml:{xs:3,sm:0}},children:[(0,y.jsx)(p.Z,{id:"flavor-label",name:"flavor-label",children:"Flavor"}),(0,y.jsx)(v.Z,{labelId:"flavor-label",id:"flavor-select",name:"flavor-select",sx:{borderRadius:0},value:T,onChange:function(e){return Y(e.target.value)},label:"Flavor",children:z.flavor.split(",").map((function(e,t){return(0,y.jsx)(b.Z,{value:e.trim(),children:e.trim()},t)}))})]})]}),(0,y.jsx)(c.Z,{children:(0,y.jsx)(j.Z,{variant:"outlined",className:"shop-button-cart",sx:{ml:3,border:1,borderRadius:0,height:55,letterSpacing:2,fontSize:12,color:"white",backgroundColor:"#283047",borderColor:"#283047",borderWidth:1.5,transition:"all 0.3s","&:hover":{backgroundColor:"#FE6F49",color:"white",borderColor:"#FE6F49",transform:"scale(1.05)"}},onClick:function(){return G(z,W)},children:"Add to Cart"})})]})]})}):null})})}}}]);
//# sourceMappingURL=433.a4a8df66.chunk.js.map