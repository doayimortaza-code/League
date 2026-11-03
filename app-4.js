  if(k==='fuel'||k==='fuelRem'){var p=ri(8,20),T=ri(100,400);if(k==='fuel')return NQ('ddivn','یک موتور آب در هر ساعت '+p+' لیتر گازوئیل مصرف می‌کند. منبع آن '+T+' لیتر دارد. چند ساعت کامل می‌تواند کار کند؟',Math.floor(T/p),'fuel',{p:p,T:T});return NQ('ddivn','یک موتور آب در هر ساعت '+p+' لیتر گازوئیل مصرف می‌کند. اگر منبع آن '+T+' لیتر باشد، پس از کار کامل چند ساعت، چند لیتر گازوئیل باقی می‌ماند؟',T%p,'fuelRem',{p:p,T:T})}
  var per=ri(2,6)*4,ha=ri(5,20);return NQ('ddivn','برای آبیاری هر هکتار زمین '+per+' مترمکعب آب لازم است. برای '+ha+' هکتار چند مترمکعب آب لازم است؟',per*ha,'water',{per:per,ha:ha});
}
function gDdivd(l){
  var d,qt,a,k;
  if(l===1){d=pick([0.1,0.2,0.25,0.5,1.5,2.5]);qt=ri(3,40);a=Math.round(d*qt*100)/100;return NQ('ddivd',dStr(a)+' ÷ '+dStr(d)+' = ؟',qt,'basic',{a:a,d:d,qt:qt})}
  if(l===2){var dv=pick([[0.2,10],[0.5,10],[1.5,10],[0.21,100],[0.25,100],[0.07,100],[0.125,1000],[2.5,10]]);return NQ('ddivd','برای اینکه مقسوم‌علیه در تقسیم '+dStr(ri(3,99)/ (dv[1]===10?10:100))+' ÷ '+dStr(dv[0])+' عدد صحیح شود، مقسوم و مقسوم‌علیه را در چه عددی ضرب می‌کنیم؟',dv[1],'scale',{dv:dv})}
  d=pick([0.25,0.5,0.2,0.75,1.5]);qt=ri(4,30);var tot=Math.round(d*qt*100)/100;k=pick(['cup','rope']);
  if(k==='cup')return NQ('ddivd',dStr(tot)+' لیتر آب را در ظرف‌هایی با گنجایش '+dStr(d)+' لیتر می‌ریزیم. چند ظرف پر می‌شود؟',qt,'cup',{tot:tot,d:d,qt:qt});
  return NQ('ddivd','از یک طناب به طول '+dStr(tot)+' متر، تکه‌های '+dStr(d)+' متری می‌بریم. چند تکه به دست می‌آید؟',qt,'rope',{tot:tot,d:d,qt:qt});
}
var SHP_C=['مربع','مستطیل','دایره','متوازی‌الاضلاع','لوزی'],SHP_N=['مثلث متساوی‌الاضلاع','ذوزنقه متساوی‌الساقین','پنج‌ضلعی منتظم','مثلث قائم‌الزاویه'];
function pts(x,y){return '('+x+'، '+y+')'}
function oPts(ans,wr){var o=[ans];wr.forEach(function(x){if(o.indexOf(x)<0&&o.length<4)o.push(x)});var k=0;while(o.length<4&&k<60){var z=pts(ri(1,12),ri(1,12));if(o.indexOf(z)<0)o.push(z);k++}return o}
function PQ(op,t,ans,wr,kind,p){return{op:op,kind:kind,p:p,t:t,ans:ans,mode:'opt',rtl:true,opts:shuf(oPts(ans,wr))}}
function gSym(l){
  var a,b,c,d,k;
  if(l===1){k=pick(['which','half']);if(k==='which'){var cor=pick(SHP_C);return MQ('sym','کدام شکل مرکز تقارن دارد؟',cor,shuf(SHP_N.slice()).slice(0,3),'which',{cor:cor})}return NQ('sym','وقتی شکلی را «نیم‌دور» می‌چرخانیم، چند درجه می‌چرخد؟',180,'half')}
  if(l===2){c=ri(3,8);d=ri(3,8);a=ri(1,2*c-1);b=ri(1,2*d-1);var ans=pts(2*c-a,2*d-b);return PQ('sym','قرینه نقطه '+pts(a,b)+' نسبت به نقطه '+pts(c,d)+' (تقارن مرکزی) کدام است؟',ans,[pts(2*d-b,2*c-a),pts(c+a,d+b),pts(Math.abs(c-a),Math.abs(d-b))],'central',{a:a,b:b,c:c,d:d})}
  if(Math.random()<0.5){var x1=ri(1,5),y1=ri(1,5),x2=x1+2*ri(1,4),y2=y1+2*ri(1,3);return PQ('sym','مرکز تقارن مستطیلی که دو رأس روبه‌روی آن '+pts(x1,y1)+' و '+pts(x2,y2)+' است، کدام نقطه است؟',pts((x1+x2)/2,(y1+y2)/2),[pts(x2-x1,y2-y1),pts(x1+x2,y1+y2),pts((x1+x2)/2,y2)],'center',{x1:x1,y1:y1,x2:x2,y2:y2})}
  c=ri(2,6);d=ri(2,6);a=ri(1,2*c-1);b=ri(1,2*d-1);var ans2=pts(2*c-a,2*d-b);return PQ('sym','قرینه نقطه '+pts(a,b)+' نسبت به مرکز '+pts(c,d)+' را پیدا کنید و بنویسید.',ans2,[pts(a+c,b+d),pts(2*c-b,2*d-a),pts(c,d)],'central2',{a:a,b:b,c:c,d:d});
}
function gRot(l){
  var k;
  if(l===1){k=pick(['full','quarter']);if(k==='full')return MQ('rot','اگر شکلی را ۳۶۰ درجه حول مرکز دوران بچرخانیم، چه می‌شود؟','به حالت اول برمی‌گردد',['قرینه می‌شود','وارونه می‌شود','کوچک‌تر می‌شود'],'full');return NQ('rot','یک دوران ۱۸۰ درجه چند برابر دوران ۹۰ درجه است؟',2,'quarter')}
  if(l===2){var sh=pick([['مربع',90],['مستطیل',180],['مثلث متساوی‌الاضلاع',120],['شش‌ضلعی منتظم',60],['پنج‌ضلعی منتظم',72],['لوزی',180]]);return NQ('rot','کمترین زاویه دوران که یک '+sh[0]+' حول مرکزش بچرخد و دوباره دقیقاً روی خودش بیفتد، چند درجه است؟',sh[1],'min',{sh:sh})}
  k=pick(['count','sum','mul']);
  if(k==='count'){var s=pick([90,60,120,45,72]);return NQ('rot','با دوران‌های '+s+' درجه‌ای پشت سر هم، چند دوران لازم است تا شکل برای اولین بار به حالت اول برگردد؟',360/s,'count',{s:s})}
  if(k==='sum'){var a=pick([90,180,270]),b=pick([90,180,270]);return NQ('rot','شکلی را ابتدا '+a+' درجه و بعد '+b+' درجه در یک جهت می‌چرخانیم. وضعیت نهایی معادل چرخش چند درجه (کمتر از ۳۶۰ درجه یا صفر) است؟',(a+b)%360,'sum',{a:a,b:b})}
  var m=ri(2,7);return NQ('rot',m+' دوران ۹۰ درجه‌ای متوالی در مجموع چند درجه است؟',m*90,'mul',{m:m});
}
function gAxes(l){
  var x,y,a,b;
  if(l===1){x=ri(1,9);y=ri(1,9);if(Math.random()<0.5)return NQ('axes','فاصله نقطه '+pts(x,y)+' از محور افقی (محور xها) چند واحد است؟',y,'dx',{x:x,y:y});return NQ('axes','فاصله نقطه '+pts(x,y)+' از محور عمودی (محور yها) چند واحد است؟',x,'dy',{x:x,y:y})}
  if(l===2){x=ri(1,8);y=ri(1,8);var s=ri(2,6),right=Math.random()<0.5,nx=right?x+s:x,ny=right?y:y+s,ans=pts(nx,ny);return PQ('axes','نقطه '+pts(x,y)+' را '+s+' واحد به '+(right?'راست':'بالا')+' می‌بریم. مختصات نقطه جدید کدام است؟',ans,[pts(ny,nx),right?pts(x,y+s):pts(x+s,y),pts(x+s,y+s)],'move',{x:x,y:y,s:s,right:right})}
  var k=pick(['hdist','vdist','area','peri']);
  var x1=ri(1,5),y1=ri(1,5),dx=ri(2,7),dy=ri(2,6);
  if(k==='hdist')return NQ('axes','فاصله دو نقطه '+pts(x1,y1)+' و '+pts(x1+dx,y1)+' چند واحد است؟',dx,'hdist',{x1:x1,y1:y1,dx:dx});
  if(k==='vdist')return NQ('axes','فاصله دو نقطه '+pts(x1,y1)+' و '+pts(x1,y1+dy)+' چند واحد است؟',dy,'vdist',{x1:x1,y1:y1,dy:dy});
  if(k==='area')return NQ('axes','دو رأس روبه‌روی یک مستطیل (با اضلاع موازی محورها) نقطه‌های '+pts(x1,y1)+' و '+pts(x1+dx,y1+dy)+' هستند. مساحت مستطیل چند واحد مربع است؟',dx*dy,'area',{x1:x1,y1:y1,dx:dx,dy:dy});
  return NQ('axes','دو رأس روبه‌روی یک مستطیل (با اضلاع موازی محورها) نقطه‌های '+pts(x1,y1)+' و '+pts(x1+dx,y1+dy)+' هستند. محیط مستطیل چند واحد است؟',2*(dx+dy),'peri',{x1:x1,y1:y1,dx:dx,dy:dy});
}
function gScoord(l){
  var a,b,k,ans,k2;
  if(l===1){k=ri(3,9);a=ri(1,2*k-1);if(a===k)a--;if(a<1)a=1;b=ri(1,9);return PQ('scoord','قرینه نقطه '+pts(a,b)+' نسبت به خط عمودی x = '+k+' کدام است؟',pts(2*k-a,b),[pts(a,2*k-b),pts(b,a),pts(2*k+a,b)],'vert',{a:a,b:b,k:k})}
  if(l===2){k=ri(3,9);b=ri(1,2*k-1);if(b===k)b--;if(b<1)b=1;a=ri(1,9);return PQ('scoord','قرینه نقطه '+pts(a,b)+' نسبت به خط افقی y = '+k+' کدام است؟',pts(a,2*k-b),[pts(2*k-a,b),pts(b,a),pts(a,2*k+b)],'horiz',{a:a,b:b,k:k})}
  k2=pick(['which','dist']);
  if(k2==='which')return MQ('scoord','نقطه‌ای را نسبت به یک خط عمودی (موازی محور yها) قرینه می‌کنیم. کدام مختصه نقطه تغییر نمی‌کند؟','عرض (y)',['طول (x)','هر دو مختصه','هیچ‌کدام'],'which');
  k=ri(3,9);a=ri(1,k-1);b=ri(1,9);return NQ('scoord','فاصله نقطه '+pts(a,b)+' و قرینه‌اش نسبت به خط عمودی x = '+k+' چند واحد است؟',2*(k-a),'dist',{a:a,b:b,k:k});
}
function gLen(l){
  var k;
  if(l===1){var P=[['سنگینی یک میوه','جرم'],['مدت بارش باران','زمان'],['دور کمر','طول'],['زیربنای یک ساختمان','سطح'],['گنجایش یک بطری','حجم'],['ارتفاع یک کوه','طول'],['اندازه یک گوشه','زاویه']],it=pick(P),all=['طول','سطح','حجم','جرم','زمان','زاویه'];return MQ('len','در اندازه‌گیری «'+it[0]+'» کدام کمیت را اندازه می‌گیریم؟',it[1],shuf(all.filter(function(z){return z!==it[1]})).slice(0,3),'which',{it:it})}
  if(l===2){k=pick(['m_cm','dm_m','km_m','m_dm','m2_ha','ha_m2','cm_m']);var x;
    if(k==='m_cm'){x=ri(2,90)/ pick([1,2,10]);return NQ('len',dStr(x)+' متر چند سانتی‌متر است؟',Math.round(x*100*1000)/1000,k,{x:x})}
    if(k==='dm_m'){x=ri(11,990);return NQ('len',x+' دسی‌متر چند متر است؟',x/10,k,{x:x})}
    if(k==='km_m'){x=ri(2,90)/pick([1,2,10]);return NQ('len',dStr(x)+' کیلومتر چند متر است؟',Math.round(x*1000*1000)/1000,k,{x:x})}
    if(k==='m_dm'){x=ri(2,90)/pick([1,10]);return NQ('len',dStr(x)+' متر چند دسی‌متر است؟',Math.round(x*10*1000)/1000,k,{x:x})}
    if(k==='cm_m'){x=ri(1,9)*100+ri(0,9)*10;return NQ('len',x+' سانتی‌متر چند متر است؟',x/100,k,{x:x})}
    if(k==='m2_ha'){x=ri(1,9)*5000;return NQ('len',cm(x)+' مترمربع چند هکتار است؟ (۱ هکتار = ۱۰٬۰۰۰ مترمربع)',x/10000,k,{x:x})}
    x=ri(2,40)/ pick([1,2,4]);return NQ('len',dStr(x)+' هکتار چند مترمربع است؟ (۱ هکتار = ۱۰٬۰۰۰ مترمربع)',Math.round(x*10000*1000)/1000,k,{x:x})}
  k=pick(['step','ha','hect']);
  if(k==='step'){var st=pick([0.5,0.4,0.8,0.25]),km=ri(1,5);return NQ('len','طول هر قدم یک نفر تقریباً '+dStr(st)+' متر است. او برای رفتن '+km+' کیلومتر چند قدم باید بردارد؟',Math.round(km*1000/st),'step',{st:st,km:km})}
  if(k==='ha'){var w=pick([40,50,80,100,200,250]),h=pick([25,40,50,100,200]);return NQ('len','مساحت یک زمین مستطیل شکل به ابعاد '+w+' و '+h+' متر چند هکتار است؟',w*h/10000,'ha',{w:w,h:h})}
  var m=ri(2,20);return NQ('len','یک مزرعه '+m+' هکتار مساحت دارد. اگر هر هکتار '+ri(2,9)*10+' بوته داشته باشد... (فقط مساحت را به مترمربع تبدیل کنید) مساحت مزرعه چند مترمربع است؟',m*10000,'hect',{m:m});
}
function gVol(l){
  var k,a,b,c;
  if(l===1){k=pick(['f','e','v','pyr','cyl']);
    if(k==='f')return NQ('vol','یک مکعب چند وجه دارد؟',6,'cubeF');
    if(k==='e')return NQ('vol','یک مکعب مستطیل چند یال دارد؟',12,'cubeE');
    if(k==='v')return NQ('vol','یک مکعب مستطیل چند رأس دارد؟',8,'cubeV');
    if(k==='pyr'){var q=pick([['وجه',5],['رأس',5],['یال',8]]);return NQ('vol','یک هرم با قاعده مربع چند '+q[0]+' دارد؟',q[1],'pyr',{q:q})}
    return MQ('vol','کدام جسم دو قاعده دایره‌ای دارد؟','استوانه',['مخروط','کره','هرم'],'cyl')}
  if(l===2){k=pick(['vol','area','cube','cubeA']);a=ri(2,12);b=ri(2,9);c=ri(2,9);
    if(k==='vol')return NQ('vol','حجم یک مکعب مستطیل به ابعاد '+a+' و '+b+' و '+c+' سانتی‌متر چند سانتی‌متر مکعب است؟',a*b*c,'vol',{a:a,b:b,c:c});
    if(k==='area')return NQ('vol','مساحت کل رویه‌های یک مکعب مستطیل به ابعاد '+a+' و '+b+' و '+c+' سانتی‌متر چند سانتی‌متر مربع است؟',2*(a*b+a*c+b*c),'area',{a:a,b:b,c:c});
    if(k==='cube')return NQ('vol','حجم مکعبی که طول هر ضلع آن '+b+' سانتی‌متر است، چند سانتی‌متر مکعب است؟',b*b*b,'cube',{b:b});
    return NQ('vol','مساحت کل رویه‌های مکعبی که طول هر ضلع آن '+b+' سانتی‌متر است، چند سانتی‌متر مربع است؟',6*b*b,'cubeA',{b:b})}
  k=pick(['l_cc','m3_l','g_kg','t_kg','pool']);var x;
  if(k==='l_cc'){x=ri(2,40)/pick([1,2]);return NQ('vol',dStr(x)+' لیتر چند سی‌سی (میلی‌لیتر) است؟',Math.round(x*1000),k,{x:x})}
  if(k==='m3_l'){x=ri(2,20)/pick([1,2]);return NQ('vol',dStr(x)+' مترمکعب چند لیتر است؟ (۱ مترمکعب = ۱۰۰۰ لیتر)',Math.round(x*1000),k,{x:x})}
  if(k==='g_kg'){x=ri(11,99)*100;return NQ('vol',cm(x)+' گرم چند کیلوگرم است؟',x/1000,k,{x:x})}
  if(k==='t_kg'){x=ri(2,20)/pick([1,2]);return NQ('vol',dStr(x)+' تن چند کیلوگرم است؟ (۱ تن = ۱۰۰۰ کیلوگرم)',Math.round(x*1000),k,{x:x})}
  a=ri(2,6);b=ri(2,5);c=ri(1,3);return NQ('vol','یک حوض به شکل مکعب مستطیل با ابعاد '+a+' و '+b+' و '+c+' متر چند لیتر آب گنجایش دارد؟ (۱ مترمکعب = ۱۰۰۰ لیتر)',a*b*c*1000,'pool',{a:a,b:b,c:c});
}
function gCirc(l){
  var r,k;
  var NT='(عدد پی را '+PIV+' بگیرید)';
  if(l===1){r=ri(2,20);if(Math.random()<0.5)return NQ('circ','محیط دایره‌ای به شعاع '+r+' سانتی‌متر چند سانتی‌متر است؟ '+NT,2*r*PIV,'c',{r:r});return NQ('circ','محیط دایره‌ای به قطر '+(2*r)+' سانتی‌متر چند سانتی‌متر است؟ '+NT,2*r*PIV,'cd',{r:r})}
  if(l===2){r=ri(2,15);if(Math.random()<0.6)return NQ('circ','مساحت دایره‌ای به شعاع '+r+' سانتی‌متر چند سانتی‌متر مربع است؟ '+NT,r*r*PIV,'a',{r:r});return NQ('circ','مساحت دایره‌ای به قطر '+(2*r)+' سانتی‌متر چند سانتی‌متر مربع است؟ '+NT,r*r*PIV,'ad',{r:r})}
  k=pick(['sq','half','ring']);r=ri(2,10);
  if(k==='sq')return NQ('circ','دایره‌ای به شعاع '+r+' سانتی‌متر درون مربعی به ضلع '+(2*r)+' سانتی‌متر قرار دارد. مساحت قسمت رنگی (بیرون دایره و درون مربع) چند سانتی‌متر مربع است؟ '+NT,4*r*r-PIV*r*r,'sq',{r:r});
  if(k==='half')return NQ('circ','مساحت نیم‌دایره‌ای به شعاع '+(2*r)+' سانتی‌متر چند سانتی‌متر مربع است؟ '+NT,PIV*(2*r)*(2*r)/2,'half',{r:2*r});
  var R=r+ri(1,5);return NQ('circ','از دایره‌ای به شعاع '+R+' سانتی‌متر، دایره‌ای هم‌مرکز به شعاع '+r+' سانتی‌متر را جدا می‌کنیم. مساحت باقی‌مانده چند سانتی‌متر مربع است؟ '+NT,PIV*(R*R-r*r),'ring',{R:R,r:r});
}
function gLine(l){
  var k,b,h;
  if(l===1){k=pick(['short','mid']);if(k==='short')return MQ('line','کوتاه‌ترین فاصله یک نقطه تا یک خط، طول پاره‌خطی است که از نقطه بر خط:','عمود می‌شود',['مایل می‌شود','موازی می‌شود','منحنی می‌شود'],'short');b=ri(2,20)*2;return NQ('line','وسط پاره‌خطی به طول '+b+' سانتی‌متر از هر دو سر آن چند سانتی‌متر فاصله دارد؟',b/2,'mid',{b:b})}
  if(l===2){b=ri(3,20);h=ri(2,14);return NQ('line','مساحت مثلثی که قاعده‌اش '+b+' سانتی‌متر و ارتفاع نظیر آن '+h+' سانتی‌متر است، چند سانتی‌متر مربع است؟',b*h/2,'tri',{b:b,h:h})}
  k=pick(['height','base','mid']);
  if(k==='height'){b=ri(2,10)*2;h=ri(2,12);return NQ('line','مساحت یک مثلث '+(b*h/2)+' سانتی‌متر مربع و قاعده‌اش '+b+' سانتی‌متر است. ارتفاع نظیر این قاعده چند سانتی‌متر است؟',h,'height',{b:b,h:h})}
  if(k==='base'){b=ri(2,12);h=ri(2,10)*2;return NQ('line','مساحت یک مثلث '+(b*h/2)+' سانتی‌متر مربع و ارتفاعش '+h+' سانتی‌متر است. قاعده نظیر این ارتفاع چند سانتی‌متر است؟',b,'base',{b:b,h:h})}
  return MQ('line','خطی که از وسط یک پاره‌خط بگذرد و بر آن عمود باشد چه نام دارد؟','عمودمنصف',['نیم‌ساز','قطر','موازی'],'mid');
}
function gRatio(l){
  var k,a,b;
  if(l===1){var P=[[7,10],[3,4],[1,2],[3,5],[9,20],[1,4],[2,5],[17,20],[7,25],[3,50]],pp=pick(P);return NQ('ratio','نسبت '+pp[0]+' به '+pp[1]+' را به صورت عدد اعشاری بنویسید.',pp[0]/pp[1],'dec',{p:pp})}
  if(l===2){k=pick(['simp','eq']);
    if(k==='simp'){var g=ri(2,9);do{a=ri(1,9);b=ri(2,10)}while(a===b||gcd(a,b)!==1);return MQ('ratio','نسبت '+(a*g)+' به '+(b*g)+' را به ساده‌ترین شکل بنویسید.',a+' به '+b,[(a*g)+' به '+b,a+' به '+(b*g),b+' به '+a],'simp',{a:a,b:b,g:g})}
    do{a=ri(1,9);b=ri(2,10)}while(a===b||gcd(a,b)!==1);var m=ri(2,9);return NQ('ratio','اگر '+a+' به '+b+' برابر باشد با ؟ به '+(b*m)+'، عدد ؟ چند است؟',a*m,'eq',{a:a,b:b,m:m})}
  k=pick(['sq','share','map']);
  if(k==='sq'){var s=ri(3,30);return NQ('ratio','نسبت طول ضلع یک مربع به محیط آن ۱ به ۴ است. محیط مربعی با ضلع '+s+' سانتی‌متر چند سانتی‌متر است؟',4*s,'sq',{s:s})}
  if(k==='share'){a=ri(2,7);b=ri(2,7);if(a===b)b=a+1;var m2=ri(2,9);return NQ('ratio','نسبت تعداد دختران به پسران یک کلاس '+a+' به '+b+' است. اگر کلاس '+((a+b)*m2)+' دانش‌آموز داشته باشد، چند دختر دارد؟',a*m2,'share',{a:a,b:b,m:m2})}
  var q=ri(2,8),u=ri(2,9)*10,n=ri(2,9);return NQ('ratio',q+' کیلوگرم میوه '+(q*u*100)+' تومان قیمت دارد. '+(q*n)+' کیلوگرم از همان میوه چند تومان می‌شود؟',n*u*q*100,'price',{q:q,u:u,n:n});
}
function gPct(l){
  var k,a,b,n;
  if(l===1){k=pick(['f2p','d2p','p2f']);
    if(k==='f2p'){var f=pick([[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[7,10],[3,20],[7,20],[9,25],[1,25],[19,50]]);return NQ('pct',f[0]+'/'+f[1]+' برابر چند درصد است؟',f[0]/f[1]*100,'f2p',{f:f})}
    if(k==='d2p'){var dd=ri(1,99)/100;return NQ('pct',dStr(dd)+' برابر چند درصد است؟',Math.round(dd*100),'d2p',{d:dd})}
    var pp=ri(1,19)*5;return NQ('pct',pp+'٪ را به صورت عدد اعشاری بنویسید.',pp/100,'p2d',{p:pp})}
  if(l===2){k=pick(['of','what']);
    if(k==='of'){var p=pick([5,10,15,20,25,30,35,40,45,50,60,75,80]);n=ri(2,40)*20;return NQ('pct',p+'٪ از '+n+' چند است؟',p*n/100,'of',{p:p,n:n})}
    var tot=pick([20,25,40,50,80,200,250,500]);do{a=ri(1,tot-1)}while((a*100)%tot!==0);return NQ('pct',a+' چند درصد '+tot+' است؟',a*100/tot,'what',{a:a,tot:tot})}
  k=pick(['rev','err','twoTier']);
  if(k==='rev'){var p3=pick([10,20,25,40,50]),w=ri(2,50)*20,part=p3*w/100;return NQ('pct',p3+'٪ یک عدد برابر '+part+' است. آن عدد چند است؟',w,'rev',{p:p3,part:part,w:w})}
  if(k==='err'){var tot2=pick([20,25,50,40]);do{a=ri(1,tot2-1)}while((a*100)%tot2!==0);var corr=a*100/tot2;return MQ('pct','از '+tot2+' فرفره، '+a+' فرفره آبی است. چند درصد فرفره‌ها آبی است؟',corr+'٪',[a+'٪',(100-corr)+'٪',(corr+10)+'٪'],'err',{a:a,tot:tot2})}
  var tt=pick([100,200,300,400,500]),pa=pick([10,20,30,40]),pb=pick([5,10,15,20]);if(pa+pb>=100)pb=5;var rest=100-pa-pb;return NQ('pct','در یک مدرسه '+tt+' دانش‌آموز هست. '+pa+'٪ آن‌ها پایه ششم و '+pb+'٪ آن‌ها پایه پنجم هستند. چند نفر در پایه‌های دیگر هستند؟',tt*rest/100,'rest',{tt:tt,pa:pa,pb:pb});
}
function gFin(l){
  var k,pr,p;
  if(l===1){k=pick(['tax','profit']);if(k==='tax'){var bill=ri(2,20)*10000,tx=pick([5,9,10]);return NQ('fin','به مبلغ فاکتور '+cm(bill)+' تومان، '+tx+' درصد مالیات اضافه می‌شود. مالیات چند تومان است؟',bill*tx/100,'tax',{bill:bill,tx:tx})}var cap=ri(1,10)*1000000,rt=pick([10,15,18,20]);return NQ('fin','به سرمایه '+cm(cap)+' تومانی، سالانه '+rt+' درصد سود تعلق می‌گیرد. سود یک سال چند تومان است؟',cap*rt/100,'profit',{cap:cap,rt:rt})}
  if(l===2){k=pick(['disc','final']);pr=ri(5,50)*10000;p=pick([5,10,15,20,25,30]);if(k==='disc')return NQ('fin','قیمت یک کالا '+cm(pr)+' تومان است. با '+p+' درصد تخفیف، چند تومان تخفیف می‌گیرید؟',pr*p/100,'disc',{pr:pr,p:p});return NQ('fin','قیمت یک کالا '+cm(pr)+' تومان است. با '+p+' درصد تخفیف، قیمت جدید چند تومان می‌شود؟',pr*(100-p)/100,'final',{pr:pr,p:p})}
  k=pick(['growth','tax2']);
  if(k==='growth'){var pop=ri(2,9)*10000000,g=pick([1,2,5,10]);return NQ('fin','جمعیت یک شهر '+cm(pop)+' نفر است. اگر جمعیت در یک سال '+g+' درصد رشد کند، جمعیت پس از یک سال چند نفر می‌شود؟',pop+pop*g/100,'growth',{pop:pop,g:g})}
  var bill2=ri(2,20)*10000,tx2=pick([5,9,10]);return NQ('fin','مبلغ فاکتور '+cm(bill2)+' تومان است و '+tx2+' درصد مالیات به آن اضافه می‌شود. مبلغ نهایی قابل پرداخت چند تومان است؟',bill2+bill2*tx2/100,'tax2',{bill:bill2,tx:tx2});
}
function gStat(l){
  var k,n,a,p;
  if(l===1){n=pick([20,25,40,50,100,200]);do{a=ri(1,n-1)}while((a*100)%n!==0);return NQ('stat','از '+n+' دانش‌آموز، '+a+' نفر یک خواهر دارند. چند درصد دانش‌آموزان یک خواهر دارند؟',a*100/n,'pc',{n:n,a:a})}
  if(l===2){p=ri(1,19)*5;return NQ('stat','در یک نمودار دایره‌ای (کل دایره ۳۶۰ درجه)، سهم یک قسمت '+p+' درصد است. زاویه آن قسمت چند درجه است؟',p*360/100,'p2a',{p:p})}
  k=pick(['a2p','a2n']);
  if(k==='a2p'){var ang=pick([18,36,54,72,90,108,144,180,270]);return NQ('stat','در یک نمودار دایره‌ای، زاویه یک قسمت '+ang+' درجه است. این قسمت چند درصد دایره است؟',ang*100/360,'a2p',{ang:ang})}
  var tot,an;do{tot=pick([20,40,60,120,180,360]);an=pick([36,45,60,72,90,120,180])}while((tot*an)%360!==0);return NQ('stat','از '+tot+' نفر که در یک نظرسنجی شرکت کردند، سهم یک گروه در نمودار دایره‌ای با زاویه '+an+' درجه نشان داده شده است. تعداد افراد این گروه چند نفر است؟',tot*an/360,'a2n',{tot:tot,an:an});
}
function fx3(X){var s=String(X),neg='';while(s.length<4)s='0'+s;return s.slice(0,-3)+'.'+s.slice(-3)}
function gTrunc(l){
  var k,x,u;
  if(l===1){x=ri(1000,99999);u=pick([10,100,1000]);return NQ('trunc',x+' را به روش قطع کردن با تقریب کمتر از '+u+' بنویسید.',Math.floor(x/u)*u,'int',{x:x,u:u})}
  if(l===2){k=pick(['unit','dif']);var X=ri(10000,999999),un=pick([[1,1000],[0.1,100],[0.01,10]]);
    var val=fx3(X);
    if(k==='unit')return NQ('trunc',val+' را به روش قطع کردن با تقریب کمتر از '+dStr(un[0])+' بنویسید.',Math.floor(X/un[1])/(1000/un[1]),'dec',{X:X,un:un});
    return NQ('trunc','اختلاف عدد '+val+' با مقدار تقریبی آن (به روش قطع کردن با تقریب کمتر از '+dStr(un[0])+') چقدر است؟',(X-Math.floor(X/un[1])*un[1])/1000,'dif',{X:X,un:un})}
  k=pick(['both','near','round']);