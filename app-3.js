    var v=ri(4,9)*10,t1=ri(2,5),t2=ri(2,5);return N('word',v,t1,'اتومبیلی با سرعت '+v+' کیلومتر در ساعت، '+t1+' ساعت و بعد '+t2+' ساعت دیگر می‌رود. در کل چند کیلومتر رفته است؟',v*(t1+t2),true);
  }
  if(Math.random()<0.5){var n=ri(2,9),p=ri(5,20)*1000,pr=pick([10,20,25,30,40,50]);return N('word',n,p,'مغازه‌داری '+n+' کیلو برنج، هر کیلو '+p+' تومان خرید و با '+pr+'٪ سود فروخت. فروش کل چند تومان شد؟',n*p*(100+pr)/100,true)}
  var c=ri(2,10)*20,pc=pick([20,25,40,45,60]);return N('word',c,pc,'در کلاسی '+c+' دانش‌آموز هست. '+pc+'٪ آن‌ها دختر هستند. چند پسر در کلاس هست؟',c-c*pc/100,true);
}





var PIV=3,SGN='−';
function cm(x){return String(x).replace(/\B(?=(\d{3})+(?!\d))/g,',')}
function ord(n){return n+'\u200cام'}
function MQ(op,t,ans,wr,kind,p){var o=[String(ans)];wr.forEach(function(x){x=String(x);if(o.indexOf(x)<0&&o.length<4)o.push(x)});return{op:op,kind:kind||'',p:p||null,t:t,ans:String(ans),mode:'opt',rtl:true,opts:shuf(o)}}
function NQ(op,t,ans,kind,p){return{op:op,kind:kind||'',p:p||null,t:t,ans:ans,mode:'num',rtl:true}}
function nO(ans,cands){var o=[ans];cands.forEach(function(c){if(o.indexOf(c)<0&&o.length<4)o.push(c)});var k=1;while(o.length<4&&k<80){var c2=ans+(k%2?1:-1)*Math.ceil(k/2);k++;if(c2!==ans&&o.indexOf(c2)<0)o.push(c2)}return o}
function mixS(n,d){var g=gcd(Math.abs(n),d);n/=g;d/=g;if(d===1)return String(n);var w=Math.floor(n/d),r=n-w*d;return w?(r?w+' و '+r+'/'+d:String(w)):r+'/'+d}
function pfS(n,d){return d===1?String(n):n+'/'+d}
function fO(n,d,wr){var ans=mixS(n,d),o=[ans];
  wr.concat([[n+1,d],[Math.max(1,n-1),d],[n,d+1],[d,n],[n+d,d],[n*2,d]]).forEach(function(c){var s=mixS(c[0],c[1]);if(o.length<4&&o.indexOf(s)<0)o.push(s)});
  var k=1;while(o.length<4&&k<80){var s2=mixS(n+k,d);if(o.indexOf(s2)<0)o.push(s2);k++}
  return{ans:ans,opts:shuf(o)}}
function FQ(op,t,n,d,wr,kind,p,wd){var r=fO(n,d,wr);return{op:op,kind:kind,p:p,t:t,ans:r.ans,mode:'opt',rtl:true,wrongDen:wd?mixS(wd[0],wd[1]):null,opts:r.opts}}
function dist(k){var d=[0,1,2,3,4,5,6,7,8,9];shuf(d);return d.slice(0,k)}
function perms(a,k){var out=[];(function rec(cur,rest){if(cur.length===k){out.push(cur.slice());return}for(var i=0;i<rest.length;i++){cur.push(rest[i]);rec(cur,rest.slice(0,i).concat(rest.slice(i+1)));cur.pop()}})([],a);return out}
function cardNum(digs,k,pred){var best=null,worst=null;perms(digs,k).forEach(function(p){if(p[0]===0)return;var v=Number(p.join(''));if(pred&&!pred(v))return;if(best===null||v<best)best=v;if(worst===null||v>worst)worst=v});return{min:best,max:worst}}
function sI(x){return x<0?SGN+Math.abs(x):(x>0?'+'+x:'0')}
var POSN=['یکان','دهگان','صدگان','یکان هزار','دهگان هزار','صدگان هزار','یکان میلیون','دهگان میلیون','صدگان میلیون','یکان میلیارد'];

function gPat(l){
  var k=pick(l===1?['par','mult','nxt']:l===2?['rel','inv','poss']:['lin','which','sump']),a,d,n,x,w;
  if(k==='par'){var ev=Math.random()<0.5;x=ri(5,60)*2+(ev?0:1);w=[];while(w.length<3){var y=ri(10,120);if((y%2===0)!==ev&&w.indexOf(y)<0)w.push(y)}return MQ('pat',ev?'کدام عدد زوج است؟':'کدام عدد فرد است؟',x,w,'par',{ev:ev})}
  if(k==='mult'){d=ri(3,9);n=ri(3,12);if(Math.random()<0.5)return NQ('pat','مضرب '+ord(n)+' عدد '+d+' چه عددی است؟ (مضرب‌ها: '+d+'، '+(2*d)+'، '+(3*d)+'، ...)',n*d,'mult',{d:d,n:n});return NQ('pat',d*n+' چندمین مضرب عدد '+d+' است؟',n,'multinv',{d:d,n:n})}
  if(k==='nxt'){a=ri(1,20);d=ri(2,9);var sq=[0,1,2,3].map(function(i){return a+i*d});return NQ('pat','عدد بعدی در الگوی '+sq.join('، ')+'، … چیست؟',a+4*d,'nxt',{a:a,d:d})}
  if(k==='rel'){d=ri(2,9);n=ri(8,20);return NQ('pat','در یک الگو، تعداد چوب‌کبریت‌های هر شکل برابر است با '+d+' × شماره شکل. شکل '+ord(n)+' چند چوب‌کبریت دارد؟',d*n,'rel',{d:d,n:n})}
  if(k==='inv'){var it=pick([['چرخ','دوچرخه',2],['پایه','میز',4],['چوب‌کبریت','شکل',3],['انگشت','دست',5]]);n=ri(5,20);return NQ('pat','برای ساختن هر '+it[1]+' به '+it[2]+' '+it[0]+' نیاز است. با '+(it[2]*n)+' '+it[0]+' چند '+it[1]+' می‌توان ساخت؟',n,'inv',{n:n})}
  if(k==='poss'){var it2=pick([['چرخ','دوچرخه',2],['پایه','میز',4],['چوب‌کبریت','شکل',3]]),T=Math.random()<0.5?it2[2]*ri(3,15):ri(10,60),yes=T%it2[2]===0;return MQ('pat','هر '+it2[1]+' به '+it2[2]+' '+it2[0]+' نیاز دارد. آیا ممکن است برای ساختن چند '+it2[1]+' دقیقاً '+T+' '+it2[0]+' لازم باشد؟',yes?'بله':'خیر',[yes?'خیر':'بله'],'poss',{T:T,u:it2[2]})}
  if(k==='lin'){a=ri(2,5);n=ri(6,20);return NQ('pat','در یک الگو، تعداد مربع‌ها در هر شکل برابر است با '+a+' × شماره شکل − ۱. شکل '+ord(n)+' چند مربع دارد؟',a*n-1,'lin',{a:a,n:n})}
  if(k==='which'){a=ri(2,5);n=ri(5,20);return NQ('pat','در یک الگو، تعداد مربع‌ها در هر شکل برابر است با '+a+' × شماره شکل − ۱. چندمین شکل '+(a*n-1)+' مربع دارد؟',n,'which',{a:a,n:n})}
  var pq=pick([['فرد','فرد','زوج'],['زوج','زوج','زوج'],['زوج','فرد','فرد'],['فرد','زوج','فرد']]);
  return MQ('pat','حاصل جمع یک عدد '+pq[0]+' و یک عدد '+pq[1]+' چه نوع عددی است؟',pq[2],[pq[2]==='زوج'?'فرد':'زوج'],'sump',pq);
}
function gNumw(l){
  var ds,i,N;
  if(l===1){
    if(Math.random()<0.5){do{ds=dist(7)}while(ds[0]===0);N=Number(ds.join(''));do{i=ri(0,6)}while(ds[i]===0);var val=ds[i]*Math.pow(10,6-i);return NQ('numw','ارزش رقم '+ds[i]+' در عدد '+cm(N)+' چقدر است؟',val,'val',{N:N,i:i})}
    var ps=shuf([0,1,2,3,4,5,6]).slice(0,3).sort(function(a,b){return b-a}),parts=ps.map(function(p){return ri(1,9)*Math.pow(10,p)}),tot=parts.reduce(function(a,b){return a+b},0);
    return NQ('numw',parts.map(cm).join(' + ')+' = ؟',tot,'exp',{parts:parts});
  }
  if(l===2){
    if(Math.random()<0.5){do{ds=dist(10)}while(ds[0]===0);N=Number(ds.join(''));var pos=ri(0,9);return NQ('numw','در عدد '+cm(N)+' کدام رقم، رقم «'+POSN[pos]+'» است؟',ds[9-pos],'digit',{N:N,pos:pos})}
    var nums=[];while(nums.length<4){var dg=ri(6,10),v=ri(Math.pow(10,dg-1),Math.pow(10,dg)-1);if(nums.indexOf(v)<0)nums.push(v)}
    var mx=Math.max.apply(null,nums);return MQ('numw','کدام عدد بزرگ‌تر است؟',cm(mx),nums.filter(function(x){return x!==mx}).map(cm),'big',{nums:nums});
  }
  var tries=0,res,digs,kk,kind,len;
  do{len=pick([5,6,7]);digs=dist(len);if(digs.indexOf(0)<0)digs[0]=0;digs=digs.filter(function(v,i,a){return a.indexOf(v)===i});kk=len>6?6:len-0;kind=pick(['min','maxOdd','minEven','maxEven']);
     res=cardNum(digs,kk,kind==='min'?null:(kind.indexOf('Odd')>0?function(v){return v%2===1}:function(v){return v%2===0}));tries++}
  while(((kind==='min'||kind==='minEven')?res.min:res.max)===null&&tries<30);
  var want=(kind==='min'||kind==='minEven')?res.min:res.max,sorted=digs.slice().sort(function(a,b){return a-b});
  var nm={min:'کوچک‌ترین عدد',maxOdd:'بزرگ‌ترین عدد فرد',minEven:'کوچک‌ترین عدد زوج',maxEven:'بزرگ‌ترین عدد زوج'}[kind];
  return NQ('numw','با کارت‌های '+sorted.join('، ')+' (هر کارت حداکثر یک بار) '+nm+' '+kk+' رقمی را بسازید.',want,'cards',{digs:digs,kk:kk,kind:kind});
}
function gDivis(l){
  var d,x,k,w,cor,a,b,c;
  function mcq(ds){d=pick(ds);cor=d*ri(Math.ceil(12/d),Math.floor(999/d));w=[];while(w.length<3){x=ri(12,999);if(x%d!==0&&w.indexOf(x)<0)w.push(x)}return MQ('divis','کدام عدد بر '+d+' بخش‌پذیر است؟',cor,w,'mcq',{d:d})}
  if(l===1){k=pick(['mcq','mcq','rem']);if(k==='mcq')return mcq([2,5,10]);d=pick([2,5]);x=ri(120,999);return NQ('divis','باقیمانده تقسیم '+x+' بر '+d+' چند است؟',x%d,'rem',{x:x,d:d})}
  if(l===2){k=pick(['mcq','sum','miss']);if(k==='mcq')return mcq([3,9]);
    if(k==='sum'){x=ri(1000,99999);return NQ('divis','مجموع رقم‌های عدد '+x+' چند است؟',String(x).split('').reduce(function(s,v){return s+Number(v)},0),'sum',{x:x})}
    d=pick([3,9]);a=ri(1,9);c=ri(0,9);var md=0;while((a+md+c)%d!==0)md++;return NQ('divis','کوچک‌ترین رقمی که به جای ؟ در عدد '+a+'؟'+c+' بگذاریم تا بر '+d+' بخش‌پذیر شود، کدام است؟',md,'miss',{a:a,c:c,d:d})}
  if(Math.random()<0.5){var conds=pick([[2],[5],[2,5],[3],[9],[2,3]]),res,digs,tries=0,big=Math.random()<0.5;
    do{digs=dist(3);res=cardNum(digs,3,function(v){return conds.every(function(q){return v%q===0})});tries++}while(((big?res.max:res.min)===null)&&tries<200);
    if((big?res.max:res.min)===null){digs=[5,0,9];res=cardNum(digs,3,function(v){return conds.every(function(q){return v%q===0})})}
    var ans=big?res.max:res.min;if(ans===null)return gDivis(3);
    return NQ('divis','با کارت‌های '+digs.slice().sort(function(a,b){return a-b}).join('، ')+' ('+'هر کارت یک بار) '+(big?'بزرگ‌ترین':'کوچک‌ترین')+' عدد سه‌رقمی بخش‌پذیر بر '+conds.join(' و ')+' کدام است؟',ans,'cards',{digs:digs,conds:conds,big:big});}
  d=pick([2,3,5,9,10]);var bg=Math.random()<0.5;return NQ('divis',(bg?'بزرگ‌ترین':'کوچک‌ترین')+' عدد سه‌رقمی بخش‌پذیر بر '+d+' کدام است؟',bg?Math.floor(999/d)*d:Math.ceil(100/d)*d,'range',{d:d,big:bg});
}
function gInt(l){
  var k,a,b,n,x;
  if(l===1){k=pick(['sign','opp','sign']);
    if(k==='sign'){var ctx=pick([['درجه زیر صفر','درجه بالای صفر'],['طبقه پایین‌تر از همکف','طبقه بالاتر از همکف'],['گل خورده','گل زده'],['متر زیر سطح دریا','متر بالای سطح دریا']]),neg=Math.random()<0.5;n=ri(2,25);var ans=neg?-n:n;return MQ('int',n+' '+(neg?ctx[0]:ctx[1])+' با کدام عدد صحیح نمایش داده می‌شود؟',sI(ans),[sI(-ans),'0',sI(ans>0?ans+1:ans-1)],'sign',{v:ans})}
    x=ri(2,20)*(Math.random()<0.5?1:-1);return NQ('int','قرینه عدد '+sI(x)+' نسبت به صفر روی محور اعداد چه عددی است؟',-x,'opp',{x:x})}
  if(l===2){k=pick(['cmp2','min4','between','max4']);
    if(k==='cmp2'){do{a=ri(-20,20);b=ri(-20,20)}while(a===b);return MQ('int','کدام عدد بزرگ‌تر است؟',sI(Math.max(a,b)),[sI(Math.min(a,b))],'cmp2',{a:a,b:b})}
    if(k==='min4'||k==='max4'){var s=[];while(s.length<4){var v=ri(-30,30);if(s.indexOf(v)<0)s.push(v)}var m=k==='min4'?Math.min.apply(null,s):Math.max.apply(null,s);return MQ('int',k==='min4'?'کدام عدد کوچک‌ترین است؟':'کدام عدد بزرگ‌ترین است؟',sI(m),s.filter(function(v){return v!==m}).map(sI),k,{s:s})}
    var lo=ri(-12,6),hi=lo+ri(3,12);return NQ('int','بین '+sI(lo)+' و '+sI(hi)+' چند عدد صحیح وجود دارد؟',hi-lo-1,'between',{lo:lo,hi:hi})}
  k=pick(['pat','floor','ord']);
  if(k==='pat'){var st=ri(-30,-5),d=ri(2,10),sq=[0,1,2,3].map(function(i){return st+i*d});return NQ('int','الگو را ادامه دهید. عدد بعدی چیست؟ '+sq.map(sI).join(' ، ')+' ، …',st+4*d,'pat',{st:st,d:d})}
  if(k==='floor'){var m1=ri(1,5),m2=ri(1,8),m3=ri(1,5);return NQ('int','از طبقه همکف ('+'صفر) '+m1+' طبقه پایین می‌روید، بعد '+m2+' طبقه بالا و سپس '+m3+' طبقه پایین. در کدام طبقه هستید؟ (طبقه‌های زیر همکف را با عدد صحیح منفی بنویسید)',-m1+m2-m3,'floor',{m:[m1,m2,m3]})}
  var s5=[];while(s5.length<5){var v5=ri(-15,15);if(s5.indexOf(v5)<0)s5.push(v5)}
  var asc=s5.slice().sort(function(a,b){return a-b}),opts=[asc.map(sI).join(' ، ')],cand=[asc.slice().reverse(),s5.slice().sort(function(a,b){return Math.abs(a)-Math.abs(b)}),shuf(s5.slice())];
  cand.forEach(function(c){var t=c.map(sI).join(' ، ');if(opts.indexOf(t)<0&&opts.length<4)opts.push(t)});
  return MQ('int','اعداد '+shuf(s5.slice()).map(sI).join(' ، ')+' را از کوچک به بزرگ مرتب کنید. کدام ترتیب درست است؟',opts[0],opts.slice(1),'ord',{s:s5});
}
function gFadd(l){
  var k=pick(l===1?['toMixed','toImp','same']:l===2?['diffAdd','diffSub','diffAdd']:['mixAdd','mixSub','word']),a,b,d,d1,d2,p,L,w,w2,r;
  if(k==='toMixed'){do{d=ri(2,9);a=ri(d+1,5*d)}while(gcd(a,d)!==1);return FQ('fadd',a+'/'+d+' را به صورت عدد مخلوط بنویسید.',a,d,[],'toMixed',{n:a,d:d})}
  if(k==='toImp'){do{d=ri(2,9);w=ri(1,6);r=ri(1,d-1)}while(gcd(r,d)!==1);var ans=(w*d+r)+'/'+d,wr=[(w+r)+'/'+d,(w*d)+'/'+r,(w*d+r+1)+'/'+d,(w*d+r-1)+'/'+d];return MQ('fadd',w+' و '+r+'/'+d+' را به صورت کسر بنویسید.',ans,wr,'toImp',{w:w,r:r,d:d})}
  if(k==='same'){d=ri(4,12);a=ri(2,d-1);b=ri(2,d-1);var plus=Math.random()<0.5;if(!plus&&a<b){var t0=a;a=b;b=t0}if(!plus&&a===b)a=Math.min(d-1,b+1);var n0=plus?a+b:a-b;if(n0<=0){plus=true;n0=a+b}return FQ('fadd',a+'/'+d+(plus?' + ':' − ')+b+'/'+d+' = ؟',n0,d,[],'same',{x:[a,d],y:[b,d],op:plus?'+':'-'},[n0,2*d])}
  if(k==='diffAdd'||k==='diffSub'){
    var tries=0;do{p=pick(FP);d1=p[0];d2=p[1];a=ri(1,d1-1);b=ri(1,d2-1);L=d1*d2/gcd(d1,d2);tries++}while(k==='diffSub'&&a*(L/d1)<=b*(L/d2)&&tries<80);
    if(k==='diffSub'&&a*(L/d1)<=b*(L/d2)){d1=4;d2=3;a=3;b=2;L=12}
    var num=k==='diffAdd'?a*(L/d1)+b*(L/d2):a*(L/d1)-b*(L/d2);
    return FQ('fadd',a+'/'+d1+(k==='diffAdd'?' + ':' − ')+b+'/'+d2+' = ؟',num,L,[],k,{x:[a,d1],y:[b,d2],op:k==='diffAdd'?'+':'-'},k==='diffAdd'?[a+b,d1+d2]:[Math.abs(a-b)||1,Math.abs(d1-d2)||1]);
  }
  if(k==='mixAdd'||k==='mixSub'){
    do{p=pick(FP);d1=p[0];d2=p[1];w=ri(1,4);w2=ri(1,3);a=ri(1,d1-1);b=ri(1,d2-1);L=d1*d2/gcd(d1,d2);
       var n1=(w*d1+a)*(L/d1),n2=(w2*d2+b)*(L/d2)}while(k==='mixSub'&&n1<=n2);
    return FQ('fadd',w+' و '+a+'/'+d1+(k==='mixAdd'?' + ':' − ')+w2+' و '+b+'/'+d2+' = ؟',k==='mixAdd'?n1+n2:n1-n2,L,[],k,{x:[w*d1+a,d1],y:[w2*d2+b,d2],op:k==='mixAdd'?'+':'-'});
  }
  p=pick(FP);d1=p[0];d2=p[1];a=ri(1,d1-1);b=ri(1,d2-1);L=d1*d2/gcd(d1,d2);var nm=pick(['ناهید','سارا','مریم','رضا']),sub=Math.random()<0.5;
  if(!sub)return FQ('fadd',nm+' دیروز '+a+'/'+d1+' لیتر و امروز '+b+'/'+d2+' لیتر شیر نوشید. روی هم چند لیتر شیر نوشیده است؟',a*(L/d1)+b*(L/d2),L,[],'word',{x:[a,d1],y:[b,d2],op:'+'},[a+b,d1+d2]);
  var whole=ri(2,5);return FQ('fadd','از '+whole+' لیتر شیر، '+a+'/'+d1+' لیتر مصرف شد. چند لیتر شیر باقی ماند؟',whole*d1-a,d1,[],'wordSub',{x:[whole,1],y:[a,d1],op:'-'});
}
function gFmul(l){
  var k=pick(l===1?['natfrac','part']:l===2?['ff','recip','ff']:['mixfrac','word']),a,b,c,d,n;
  if(l===1){d=ri(2,9);a=ri(1,d-1);n=d*ri(2,9);if(k==='natfrac')return NQ('fmul',n+' × '+a+'/'+d+' = ؟',n/d*a,'natfrac',{x:[n,1],y:[a,d],op:'*'});return NQ('fmul',a+'/'+d+' از '+n+' چند است؟',n/d*a,'part',{x:[a,d],y:[n,1],op:'*'})}
  if(k==='ff'){b=ri(2,9);a=ri(1,b-1);d=ri(2,9);c=ri(1,d-1);return FQ('fmul',a+'/'+b+' × '+c+'/'+d+' = ؟',a*c,b*d,[[a*d,b*c],[a*c,b+d]],'ff',{x:[a,b],y:[c,d],op:'*'},[a*c,b+d])}
  if(k==='recip'){do{a=ri(1,9);b=ri(2,9)}while(a===b||gcd(a,b)!==1);var ans=pfS(b,a);return MQ('fmul','معکوس کسر '+a+'/'+b+' کدام است؟',ans,[pfS(a,b),pfS(b,a+1),pfS(a*b,1),pfS(b+1,a)],'recip',{a:a,b:b})}
  if(k==='mixfrac'){var w=ri(1,3);b=ri(2,5);a=ri(1,b-1);d=ri(2,6);c=ri(1,d-1);return FQ('fmul',w+' و '+a+'/'+b+' × '+c+'/'+d+' = ؟',(w*b+a)*c,b*d,[],'mixfrac',{x:[w*b+a,b],y:[c,d],op:'*'})}
  b=ri(2,8);a=ri(1,b-1);n=ri(2,9);return FQ('fmul','برای پختن یک کیک '+a+'/'+b+' کیلوگرم آرد لازم است. برای پختن '+n+' کیک از همان نوع چند کیلوگرم آرد لازم است؟',a*n,b,[],'word',{x:[a,b],y:[n,1],op:'*'});
}
function gFdiv(l){
  var k=pick(l===1?['same','howmany']:l===2?['diff','fracnat','diff']:['pack','natfrac']),a,b,c,d,m,n;
  if(k==='same'){d=ri(3,9);c=ri(1,d-1);m=ri(2,9);return NQ('fdiv',(m*c)+'/'+d+' ÷ '+c+'/'+d+' = ؟',m,'same',{x:[m*c,d],y:[c,d],op:'/'})}
  if(k==='howmany'){a=pick([1,1,2,3]);b=ri(a+1,a+5);if(gcd(a,b)!==1)b=a+1;m=ri(1,6);n=a*m;return NQ('fdiv','در '+n+' چند تا '+a+'/'+b+' وجود دارد؟',n*b/a,'howmany',{x:[n,1],y:[a,b],op:'/'})}
  if(k==='diff'){b=ri(2,9);a=ri(1,b-1);d=ri(2,9);c=ri(1,d-1);return FQ('fdiv',a+'/'+b+' ÷ '+c+'/'+d+' = ؟',a*d,b*c,[[a*c,b*d],[b*c,a*d]],'diff',{x:[a,b],y:[c,d],op:'/'})}
  if(k==='fracnat'){b=ri(2,9);a=ri(1,b-1);n=ri(2,6);return FQ('fdiv',a+'/'+b+' ÷ '+n+' = ؟',a,b*n,[[a*n,b]],'fracnat',{x:[a,b],y:[n,1],op:'/'})}
  if(k==='pack'){var pp=pick([[3,4],[1,2],[2,3],[3,2],[5,2],[3,8]]);m=ri(3,9);var tot=mixS(m*pp[0],pp[1]);return NQ('fdiv',tot+' کیلوگرم پسته را در بسته‌های '+pp[0]+'/'+pp[1]+' کیلوگرمی بسته‌بندی می‌کنیم. تعداد بسته‌ها چقدر است؟',m,'pack',{p:pp,m:m})}
  a=pick([2,3,4,5]);b=ri(1,a-1);if(gcd(a,b)!==1)b=1;n=b*ri(1,8);return NQ('fdiv',n+' ÷ '+b+'/'+a+' = ؟',n*a/b,'natfrac',{x:[n,1],y:[b,a],op:'/'});
}
function gFcalc(l){
  var k=pick(l===1?['big1','equiv']:l===2?['prec','cmp']:['ord4','word']),a,b,c,d,e,f,w,i;
  if(k==='big1'){var s=[],ans;do{s=[];while(s.length<4){b=ri(2,9);a=ri(1,2*b);if(a!==b&&gcd(a,b)===1&&s.map(function(z){return z[0]/z[1]}).indexOf(a/b)<0)s.push([a,b])}}while(s.filter(function(z){return z[0]>z[1]}).length!==1);var cor=s.filter(function(z){return z[0]>z[1]})[0];return MQ('fcalc','کدام کسر از ۱ بزرگ‌تر است؟',pfS(cor[0],cor[1]),s.filter(function(z){return z!==cor}).map(function(z){return pfS(z[0],z[1])}),'big1',{s:s})}
  if(k==='equiv'){do{b=ri(2,9);a=ri(1,b-1)}while(gcd(a,b)!==1);var m=ri(2,6);return MQ('fcalc','کدام کسر با '+a+'/'+b+' مساوی است؟',pfS(a*m,b*m),[pfS(a*m+1,b*m),pfS(a*m,b*m+1),pfS(a+m,b+m)],'equiv',{a:a,b:b,m:m})}
  if(k==='prec'){b=ri(2,6);a=ri(1,b-1);d=ri(2,6);c=ri(1,d-1);f=ri(2,6);e=ri(1,f-1);var n1=c*e,d1=d*f,L=b*d1/gcd(b,d1),num=a*(L/b)+n1*(L/d1);return FQ('fcalc',a+'/'+b+' + '+c+'/'+d+' × '+e+'/'+f+' = ؟',num,L,[[a*d*f+c*e*b,b*d*f*1],[(a*d+c)*e,b*d*f]],'prec',{a:[a,b],c:[c,d],e:[e,f]})}
  if(k==='cmp'){var x,y;do{b=ri(2,12);a=ri(1,b-1);d=ri(2,12);c=ri(1,d-1);x=a/b;y=c/d}while(Math.abs(x-y)<1e-9);var big=x>y?[a,b]:[c,d],small=x>y?[c,d]:[a,b];return MQ('fcalc','کدام کسر بزرگ‌تر است؟',pfS(big[0],big[1]),[pfS(small[0],small[1])],'cmp',{x:[a,b],y:[c,d]})}
  if(k==='ord4'){var arr=[],vals=[];while(arr.length<4){b=ri(2,8);a=ri(1,3*b);var v=a/b;if(vals.some(function(q){return Math.abs(q-v)<1e-9}))continue;vals.push(v);arr.push([a,b])}var mn=Math.random()<0.5,idx=0;arr.forEach(function(z,j){if(mn?z[0]/z[1]<arr[idx][0]/arr[idx][1]:z[0]/z[1]>arr[idx][0]/arr[idx][1])idx=j});
    return MQ('fcalc',mn?'کوچک‌ترین عدد کدام است؟':'بزرگ‌ترین عدد کدام است؟',mixS(arr[idx][0],arr[idx][1]),arr.filter(function(z,j){return j!==idx}).map(function(z){return mixS(z[0],z[1])}),'ord4',{arr:arr,mn:mn})}
  var aw=ri(1,3),mm=ri(1,4),cnt=10*aw+5+2*mm;return NQ('fcalc','در تهیه یک شربت، '+aw+' کیلوگرم آب، 1/2 کیلوگرم شکر و '+mm+'/5 کیلوگرم آبلیمو مصرف شده است. این مقدار شربت برای پر کردن چند لیوان 1/10 کیلوگرمی کافی است؟',cnt,'word',{aw:aw,mm:mm});
}
function dS(x){return String(Math.round(x*1000)/1000)}
function gDplace(l){
  var k,i;
  var PR=[['1/4',0.25],['3/4',0.75],['1/2',0.5],['1/5',0.2],['2/5',0.4],['3/5',0.6],['4/5',0.8],['1/8',0.125],['7/20',0.35],['3/20',0.15],['9/20',0.45],['3/25',0.12],['7/50',0.14]];
  if(l===1){k=pick(['place','tofrac10','place']);
    if(k==='place'){var di;do{di=dist(4)}while(di[0]===0||di[2]===0||di[3]===0);var X=di[0]*10+di[1]+di[2]/10+di[3]/100;i=pick([2,3]);return NQ('dplace','ارزش مکانی رقم '+di[i]+' در عدد '+dS(X)+' چقدر است؟',i===2?di[2]/10:di[3]/100,'place',{X:dS(X),i:i,di:di})}
    var den=pick([10,100]),nu=den===10?ri(1,9):ri(1,99);return NQ('dplace',nu+'/'+den+' را به صورت عدد اعشاری بنویسید.',nu/den,'tofrac10',{nu:nu,den:den})}
  if(l===2){k=pick(['tofrac','todec']);
    var pr=pick(PR);
    if(k==='todec')return NQ('dplace',pr[0]+' را به صورت عدد اعشاری بنویسید.',pr[1],'todec',{f:pr[0],v:pr[1]});
    var wr=shuf(PR.filter(function(z){return z[0]!==pr[0]})).slice(0,3).map(function(z){return z[0]});
    return MQ('dplace',dStr(pr[1])+' را به صورت کسر ساده‌شده بنویسید.',pr[0],wr,'tofrac',{dec:pr[1],ans:pr[0]})}
  k=pick(['cmp','eq']);
  if(k==='cmp'){var vals=[];while(vals.length<4){var q=ri(100,999)/pick([100,1000]);if(vals.indexOf(q)<0)vals.push(q)}var mn=Math.random()<0.5,m=mn?Math.min.apply(null,vals):Math.max.apply(null,vals);return MQ('dplace',mn?'کدام عدد کوچک‌ترین است؟':'کدام عدد بزرگ‌ترین است؟',dStr(m),vals.filter(function(z){return z!==m}).map(dStr),'cmp',{vals:vals,mn:mn})}
  var b=pick([0.4,0.5,0.2,0.6,0.8]),b10=Math.round(b*10);
  return MQ('dplace','کدام عدد با '+dStr(b)+' برابر نیست؟',dStr(b/10),[dStr(b)+'0',b10+'/10',(b10*10)+'/100'],'eq',{b:b});
}
function dStr(x){var s=String(Math.round(x*100000)/100000);return s}
function gDmuldiv(l){
  var a,b,k;
  if(l===1){a=ri(11,999)/10;b=ri(11,999)/10;if(Math.random()<0.5)return NQ('dmuldiv',dStr(a)+' + '+dStr(b)+' = ؟',Math.round((a+b)*1000)/1000,'add',{a:a,b:b});if(b>a){var t=a;a=b;b=t}return NQ('dmuldiv',dStr(a)+' − '+dStr(b)+' = ؟',Math.round((a-b)*1000)/1000,'sub',{a:a,b:b})}
  if(l===2){k=pick(['pow','mulNat','mulDec']);
    if(k==='pow'){var f=pick([10,100,1000,0.1,0.01]),x=ri(101,9999)/100;return NQ('dmuldiv',dStr(x)+' × '+dStr(f)+' = ؟',Math.round(x*f*100000)/100000,'pow',{x:x,f:f})}
    if(k==='mulNat'){a=ri(11,99)/10;b=ri(2,9);return NQ('dmuldiv',dStr(a)+' × '+b+' = ؟',Math.round(a*b*100)/100,'mulNat',{a:a,b:b})}
    a=ri(11,99)/10;b=ri(11,99)/10;return NQ('dmuldiv',dStr(a)+' × '+dStr(b)+' = ؟',Math.round(a*b*100)/100,'mulDec',{a:a,b:b})}
  k=pick(['paren1','paren2','mental']);
  if(k==='paren1'){a=ri(11,99)/10;b=ri(11,99)/10;var f2=pick([10,100]);return NQ('dmuldiv','('+dStr(a)+' + '+dStr(b)+') × '+f2+' = ؟',Math.round((a+b)*f2*1000)/1000,'paren1',{a:a,b:b,f:f2})}
  if(k==='paren2'){a=ri(51,99)/10;b=ri(11,50)/10;var c=pick([0.4,0.5,0.2,30,10]);return NQ('dmuldiv','('+dStr(a)+' − '+dStr(b)+') × '+dStr(c)+' = ؟',Math.round((a-b)*c*1000)/1000,'paren2',{a:a,b:b,c:c})}
  a=ri(2,9)/10;b=ri(2,9)/100;return NQ('dmuldiv',dStr(a)+' × '+dStr(b)+' = ؟',Math.round(a*b*10000)/10000,'mental',{a:a,b:b});
}
function gDdivn(l){
  var k,a,b,q;
  if(l===1){b=ri(2,9);a=ri(100,999);return NQ('ddivn',a+' ÷ '+b+' : خارج قسمت چند است؟ (باقیمانده را در نظر نگیرید)',Math.floor(a/b),'q',{a:a,b:b})}
  if(l===2){b=ri(2,9);q=ri(11,299)/10;a=Math.round(b*q*100)/100;return NQ('ddivn',dStr(a)+' ÷ '+b+' = ؟',q,'decnat',{a:a,b:b,q:q})}
  k=pick(['fuel','fuelRem','water']);