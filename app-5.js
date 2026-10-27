  if(l===1){var T=[['جرم یک انسان','۱ کیلوگرم'],['دمای بدن یک بیمار','۰٫۱ درجه'],['جرم یک قطعه فلز گران‌بها','۰٫۰۱ گرم'],['طول یک مداد','۱ میلی‌متر'],['جرم یک کیسه برنج','۱ کیلوگرم']],it=pick(T),wr=shuf(['۱ کیلوگرم','۰٫۱ درجه','۰٫۰۱ گرم','۱ میلی‌متر','۱ تن','۱۰ درجه','۱ کیلومتر'].filter(function(z){return z!==it[1]})).slice(0,3);return MQ('approx','برای اندازه‌گیری «'+it[0]+'» کدام دقت (تقریب کمتر از) مناسب‌تر است؟',it[1],wr,'prec',{it:it})}
  if(l===2){var a=ri(100,999),b=ri(100,999);var u=pick([10,100]);return NQ('approx','هر عدد را با تقریب کمتر از '+u+' (قطع کردن) بنویسید و سپس جمع کنید: '+a+' + '+b+' = ؟',Math.floor(a/u)*u+Math.floor(b/u)*u,'est',{a:a,b:b,u:u})}
  var money=ri(10000000,99999999),un=pick([1000,10000,100000]);return NQ('approx',cm(money)+' تومان را با تقریب کمتر از '+cm(un)+' تومان به روش قطع کردن بنویسید.',Math.floor(money/un)*un,'money',{money:money,un:un});
}
var FP=[[2,3],[2,4],[3,6],[2,6],[4,6],[3,4],[5,10],[2,5],[3,5],[4,8],[6,8]];

function mkQ(op,l){
  var a,b,qt;
  if(op==='add'){if(l===1){a=ri(10,99);b=ri(10,99)}else if(l===2){a=ri(100,9999);b=ri(100,9999)}else{a=ri(1000,9999);b=ri(1000,9999)}return N(op,a,b,a+' + '+b,a+b)}
  if(op==='sub'){if(l===1){a=ri(20,99);b=ri(10,a)}else if(l===2){a=ri(1000,9999);b=ri(100,a)}else{a=ri(5000,9999);b=ri(1000,a)}return N(op,a,b,a+' − '+b,a-b)}
  if(op==='mul'){if(l===1){a=ri(12,99);b=ri(2,9)}else if(l===2){if(Math.random()<0.5){a=ri(100,999);b=ri(2,9)}else{a=ri(12,99);b=ri(11,99)}}else{a=ri(100,999);b=ri(11,99)}return N(op,a,b,a+' × '+b,a*b)}
  if(op==='divi'){if(l===1){b=ri(2,9);qt=ri(12,99)}else if(l===2){b=ri(11,30);qt=ri(12,99)}else{b=ri(11,99);qt=ri(101,999)}a=b*qt;return N(op,a,b,a+' ÷ '+b,qt)}
  return mkWord(l);
}
var LG={pat:gPat,numw:gNumw,divis:gDivis,int:gInt,fadd:gFadd,fmul:gFmul,fdiv:gFdiv,fcalc:gFcalc,dplace:gDplace,dmuldiv:gDmuldiv,ddivn:gDdivn,ddivd:gDdivd,sym:gSym,rot:gRot,axes:gAxes,scoord:gScoord,len:gLen,vol:gVol,circ:gCirc,line:gLine,ratio:gRatio,pct:gPct,fin:gFin,stat:gStat,trunc:gTrunc,approx:gApprox,calc:function(l){return mkQ(pick(['add','sub','mul','divi']),l)},word:function(l){return mkWord(l)}};

function detect(q,w){
  var c=q.ans,d=Math.abs(w-c);
  if(q.op==='add'&&(d===10||d===100||d===1000||d===10000))return 'carry';
  if(q.op==='sub'){
    var A=String(q.a),B=String(q.b),s2='',i;while(B.length<A.length)B='0'+B;
    for(i=0;i<A.length;i++)s2+=Math.abs(Number(A[i])-Number(B[i]));
    if(Number(s2)===w||d===10||d===100||d===1000)return 'borrow';
  }
  if(q.op==='mul'&&d>0&&q.a&&q.b&&(d%q.a===0||d%q.b===0))return 'table';
  if((q.op==='dmuldiv'||q.op==='ddivn'||q.op==='ddivd')&&c!==0&&w!==0){var rt=w/c;if(Math.abs(rt-10)<1e-9||Math.abs(rt-0.1)<1e-9||Math.abs(rt-100)<1e-9||Math.abs(rt-0.01)<1e-9)return 'decPoint'}
  return TG[q.op]?q.op:'other';
}
function tagFrac(q,sel){return (q.wrongDen&&String(sel)===q.wrongDen)?'fracDen':(TG[q.op]?q.op:'other')}
function nextQ(){
  var ci=chInfo(pr.ch),ls=pr.ls&&pr.ls!=='all'?pr.ls:null,q,tries=0,seen=pr.log.map(function(x){return x.t});
  do{var key=ls||pick(ci.lessons).k;q=LG[key](pr.lvl);q.ls=key;tries++}while(seen.indexOf(q.t)>=0&&tries<15);
  pr.q=q;pr.fb=null;pr.shown=false;
}




function chStats(c,sid,ch){
  var o={1:{n:0,ok:0,k:0},2:{n:0,ok:0,k:0},3:{n:0,ok:0,k:0}};
  (c.practice||[]).forEach(function(r){
    if(r.sid!==sid)return;
    if((r.ch||opCh(r.op))!==ch)return;
    var L=Math.min(3,Math.max(1,r.lvl||2));o[L].n+=r.n;o[L].ok+=r.ok;o[L].k++;
  });
  return o;
}
function suggestLevel(st){
  var lv=1,L;
  for(L=1;L<=3;L++){var x=st[L];if(x.n>=5&&x.ok/x.n>=0.8)lv=Math.min(3,L+1);else break}
  return lv;
}
function lvText(st){
  var out=[],L;
  for(L=1;L<=3;L++)if(st[L].k)out.push(LVN[L]+': '+fa(Math.round(st[L].ok/Math.max(1,st[L].n)*100))+'٪ ('+fa(st[L].k)+' بار)');
  return out.length?out.join(' - '):'هنوز تمرینی ثبت نشده';
}
function pMenu(c){
  var h='<div class="card"><p class="muted">تمرین ریاضی ششم بر اساس فصل‌های کتاب. هر فصل سه سطح دارد: ساده، متوسط و سخت. نتیجه فقط برای تمرین بیشتر است، نه قضاوت یا تشخیص.</p>';
  h+='<label for="pstu">دانش‌آموز (برای ثبت نتیجه و پیشنهاد سطح)</label><select id="pstu" class="fs"><option value="">بدون ثبت نتیجه (فقط تمرین)</option>'+(c?c.students.map(function(s){return '<option value="'+s.id+'"'+(PS.sid===s.id?' selected':'')+'>'+esc(s.name)+'</option>'}).join(''):'')+'</select>';
  h+='<label for="pmode">شیوه تمرین</label><select id="pmode" class="fs"><option value="self"'+(PS.mode==='self'?' selected':'')+'>خود دانش‌آموز تمرین می‌کند</option><option value="oral"'+(PS.mode==='oral'?' selected':'')+'>معلم می‌پرسد (پرسش شفاهی)</option></select>';
  h+='<label for="pcnt">تعداد سؤال</label><select id="pcnt" class="fs">'+[5,10,15,20].map(function(n){return '<option value="'+n+'"'+(PS.n===n?' selected':'')+'>'+fa(n)+'</option>'}).join('')+'</select></div>';
  h+='<h2>فصل‌های کتاب ریاضی ششم</h2><div class="grid">'+CHAP.map(function(x){return '<button class="tile" data-act="pchapter" data-id="'+x.k+'"><span class="ic" aria-hidden="true">'+x.ic+'</span><b>'+x.t.split(':')[0]+'</b><span class="muted">'+x.s+'</span></button>'}).join('')+'</div>';
  return h+'<div style="margin-top:14px"><button class="btn ghost" data-act="preport">گزارش عملکرد دانش‌آموزان</button></div>';
}
function pChapter(c){
  var ci=chInfo(pr.ch),h='<button class="back" data-act="pmenu">بازگشت به فصل‌ها</button><h2>'+ci.t+'</h2><p class="muted">'+ci.topics+'</p>';
  var sug=0,stu=c&&PS.sid?c.students.filter(function(s){return s.id===PS.sid})[0]:null;
  if(stu){var st=chStats(c,stu.id,pr.ch);sug=suggestLevel(st);h+='<div class="card"><b>'+esc(stu.name)+'</b><div class="muted">'+lvText(st)+'</div><div>سطح پیشنهادی: <b>'+LVN[sug]+'</b></div></div>'}
  if(ci.lessons.length>1)h+='<div class="card"><label for="plsn">درس (از کتاب)</label><select id="plsn" class="fs"><option value="all">همه درس‌های این فصل</option>'+ci.lessons.map(function(z){return '<option value="'+z.k+'">'+z.t+'</option>'}).join('')+'</select></div>';
  h+='<div class="card"><p class="muted">'+(PS.mode==='oral'?'پرسش شفاهی توسط معلم':'تمرین دانش‌آموز')+' - '+fa(PS.n)+' سؤال'+(stu?'':' - بدون ثبت نتیجه')+'</p><div class="grid">';
  [1,2,3].forEach(function(L){h+='<button class="tile" data-act="pstartlv" data-id="'+L+'"><b>'+LVN[L]+'</b>'+(sug===L?'<span class="badge">پیشنهادی</span>':'')+'</button>'});
  return h+'</div></div>';
}
function pReport(c){
  var h='<button class="back" data-act="pmenu">بازگشت به فصل‌ها</button><h2>گزارش عملکرد'+(c?' '+esc(c.name):'')+'</h2>';
  if(!c)return h+'<div class="empty"><p>اول یک کلاس انتخاب کنید.</p></div>';
  var any=false;
  c.students.forEach(function(s){
    var rows='',tags={};
    CHAP.forEach(function(ch){
      var st=chStats(c,s.id,ch.k),tot=st[1].k+st[2].k+st[3].k;
      if(!tot)return;
      rows+='<div class="st"><span><b>'+ch.s+'</b><br><span class="muted">'+lvText(st)+'</span></span><span class="badge">'+LVN[suggestLevel(st)]+'</span></div>';
    });
    (c.practice||[]).forEach(function(r){if(r.sid===s.id)Object.keys(r.tags||{}).forEach(function(t){tags[t]=(tags[t]||0)+r.tags[t]})});
    if(!rows)return;
    any=true;
    var top=null,tc=0;Object.keys(tags).forEach(function(t){if(t!=='other'&&tags[t]>tc){tc=tags[t];top=t}});
    h+='<div class="card"><b>'+esc(s.name)+'</b>'+rows+(top&&tc>=2?'<p class="muted">پیشنهاد تمرین بیشتر: '+TG[top]+'</p>':'')+'</div>';
  });
  if(!any)h+='<div class="empty"><p>هنوز نتیجه‌ای ثبت نشده است.</p></div>';
  return h+'<p class="muted">نشان کنار هر فصل، سطح پیشنهادی برای سؤال بعدی است (وقتی در یک سطح حداقل ۵ سؤال و ۸۰٪ درست بوده، سطح بالاتر پیشنهاد می‌شود). این فقط راهنمای تمرین است و تشخیص نیست. اگر نگرانی ادامه‌دار بود، با مشاور مدرسه صحبت کنید.</p>';
}
function pPlay(){
  var q=pr.q,h='<div class="card"><div class="row"><span class="muted">سؤال '+fa(pr.i+1)+' از '+fa(pr.n)+' - '+LVN[pr.lvl]+'</span><b>درست: '+fa(pr.ok)+'</b></div>';
  h+=q.rtl?'<div dir="rtl" style="text-align:center;font-size:1.25rem;font-weight:700;margin:18px 0;line-height:2">'+pf(q.t)+'</div>':'<div dir="ltr" style="text-align:center;font-size:2rem;font-weight:800;margin:18px 0">'+pf(q.t)+'</div>';
  if(pr.mode==='oral'){
    if(q.mode==='opt')h+='<p class="muted" style="text-align:center">گزینه‌ها: <span dir="ltr">'+q.opts.map(pf).join('  |  ')+'</span></p>';
    if(!pr.shown)h+='<button class="btn" data-act="pshow">نمایش پاسخ</button>';
    else h+='<div class="msg" role="status">پاسخ: <b dir="ltr">'+pf(q.ans)+'</b></div><div class="row" style="margin-top:12px"><button class="btn" data-act="pgood">✅ درست گفت</button><button class="btn danger" data-act="pbad">❌ نادرست</button></div>';
  }else if(pr.fb===null){
    if(q.mode==='num')h+='<input id="pa" inputmode="'+(q.op==='int'?'text':'decimal')+'" autocomplete="off" placeholder="جواب" style="text-align:center;font-size:1.4rem"><button class="btn" data-act="pcheck">بررسی</button>';
    else h+='<div class="grid">'+q.opts.map(function(o,i){return '<button class="tile" data-act="ppick" data-id="'+i+'"><b dir="ltr" style="font-size:1.2rem">'+pf(o)+'</b></button>'}).join('')+'</div>';
  }else{
    var last=pr.log[pr.log.length-1];
    h+='<div class="msg" role="status"><b>'+(last.ok?'آفرین! درست بود ✅':'این بار درست نبود. جواب درست: ')+'</b>'+(last.ok?'':'<span dir="ltr"> '+pf(q.ans)+'</span>')+'</div><div style="margin-top:12px"><button class="btn" data-act="pnext">'+(pr.i+1>=pr.n?'دیدن نتیجه':'سؤال بعدی')+'</button></div>';
  }
  return h+'</div><button class="back" data-act="pquit">پایان تمرین</button>';
}
function pDone(){
  var r=pr.ok/pr.n,stars=r>=0.9?'⭐⭐⭐':r>=0.7?'⭐⭐':'⭐';
  var h='<div class="card" style="text-align:center"><div style="font-size:2rem">'+stars+'</div><b>'+fa(pr.ok)+' از '+fa(pr.n)+' درست</b><p class="muted">'+(r>=0.9?'عالی بود! 🎉':r>=0.7?'خیلی خوب بود! با تمرین بیشتر بهتر هم می‌شود.':'تلاش خوبی بود! با تمرین بیشتر پیشرفت می‌کنی.')+'</p>'+(pr.sid?'<p class="muted">نتیجه ذخیره شد.</p>':'')+'</div>';
  var wr=pr.log.filter(function(x){return !x.ok});
  if(wr.length){h+='<div class="card"><b>سؤال‌هایی که می‌شود دوباره مرور کرد</b>';wr.forEach(function(x){h+='<div class="st"><span dir="'+(x.rtl?'rtl':'ltr')+'">'+pf(x.t.replace(' = ?',''))+'</span><b dir="ltr">'+pf(x.ans)+'</b></div>'});h+='</div>'}
  return h+'<div class="row"><button class="btn" data-act="pagain">یک بار دیگر</button><button class="btn ghost" data-act="pquit">بازگشت به فصل</button></div>';
}
function vPractice(){
  var c=active(),h=back()+'<h2>تمرین و بازی ریاضی</h2><div id="live">'+msgBox()+'</div>';
  if(!pr||pr.stage==='menu')return h+pMenu(c);
  if(pr.stage==='chapter')return h+pChapter(c);
  if(pr.stage==='report')return h+pReport(c);
  return h+(pr.stage==='play'?pPlay():pDone());
}
function pFinish(){
  pr.stage='done';
  var c=active();
  if(pr.sid&&c){if(!c.practice)c.practice=[];c.practice.push({sid:pr.sid,ch:pr.ch,ls:pr.ls,lvl:pr.lvl,mode:pr.mode,ts:new Date().toISOString(),n:pr.n,ok:pr.ok,tags:pr.tags});save()}
}
function pStart(ch,lvl,ls){
  pr={stage:'play',ch:ch,ls:ls||'all',mode:PS.mode,sid:PS.sid,lvl:lvl,n:PS.n,i:0,ok:0,log:[],tags:{},fb:null,q:null,shown:false};nextQ();
}
function pAdvance(){pr.i++;if(pr.i>=pr.n)pFinish();else nextQ()}
function pAnswer(ok,given,tag){
  pr.log.push({t:pr.q.t,ans:pr.q.ans,rtl:!!pr.q.rtl,given:given,ok:ok,tag:tag});
  if(ok)pr.ok++;else pr.tags[tag]=(pr.tags[tag]||0)+1;
  pr.fb=ok;
}

var LT={from:1,to:0,count:1,norep:true,names:true,excl:'',list:'',used:[],last:[],msg:''};
function rndInt(n){
  var a=new Uint32Array(1),lim=Math.floor(4294967296/n)*n,x;
  do{crypto.getRandomValues(a);x=a[0]}while(x>=lim);
  return x%n;
}
function parseNums(t){
  t=String(t||'').replace(/[۰-۹]/g,function(d){return d.charCodeAt(0)-1776}).replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632});
  var m=t.match(/\d+/g)||[],out=[];
  m.forEach(function(x){x=Number(x);if(isFinite(x)&&out.indexOf(x)<0)out.push(x)});
  return out;
}
function ltPool(){
  var arr=[],i,ex=parseNums(LT.excl),custom=parseNums(LT.list);
  if(custom.length)arr=custom.slice();else{for(i=LT.from;i<=LT.to&&arr.length<5000;i++)arr.push(i)}
  arr=arr.filter(function(x){return ex.indexOf(x)<0});
  if(LT.norep)arr=arr.filter(function(x){return LT.used.indexOf(x)<0});
  return arr;
}
function ltPick(pool,k){
  var a=pool.slice(),out=[],i,j,t;
  k=Math.min(k,a.length);
  for(i=0;i<k;i++){j=i+rndInt(a.length-i);t=a[i];a[i]=a[j];a[j]=t;out.push(a[i])}
  return out;
}
function ltRead(){
  function g(id){var e=document.getElementById(id);return e?e.value:''}
  var f=parseNums(g('lf')),t=parseNums(g('lt')),n=parseNums(g('ln'));
  LT.from=f.length?f[0]:1;LT.to=t.length?t[0]:LT.to;LT.count=n.length?Math.max(1,n[0]):1;
  LT.excl=g('lx');LT.list=g('ll');
  var a=document.getElementById('lr'),b=document.getElementById('lm');
  LT.norep=a?a.checked:true;LT.names=b?b.checked:true;
}
function vLottery(){
  var c=active(),cnt=c?c.students.length:0;
  if(!LT.to)LT.to=cnt||36;
  var h=back()+'<h2>قرعه‌کشی شانسی 🎲</h2><div id="live">'+msgBox()+'</div>';
  h+='<div class="card"><p class="muted">شماره‌ها را خودتان تعیین می‌کنید و برنامه به‌صورت کاملاً تصادفی و بدون نیاز به اینترنت یک یا چند شماره انتخاب می‌کند. اگر کلاس فعال دارید، شماره هر دانش‌آموز همان ردیف او در فهرست دانش‌آموزان است.</p>';
  h+='<label for="lf">از شماره</label><input id="lf" inputmode="numeric" value="'+LT.from+'"><label for="lt">تا شماره</label><input id="lt" inputmode="numeric" value="'+LT.to+'"><label for="ln">چند شماره انتخاب شود؟</label><input id="ln" inputmode="numeric" value="'+LT.count+'">';
  h+='<label for="lx">شماره‌هایی که شرکت نکنند (مثلاً غایب‌ها؛ با ویرگول یا فاصله جدا کنید)</label><input id="lx" value="'+esc(LT.excl)+'" placeholder="مثلاً: ۳، ۱۲، ۲۰">';
  h+='<label for="ll">یا فهرست دلخواه شماره‌ها (اگر پر شود، به‌جای «از تا» استفاده می‌شود)</label><textarea id="ll" rows="2" placeholder="مثلاً: ۵ ۸ ۱۳ ۲۱ ۳۰">'+esc(LT.list)+'</textarea>';
  h+='<label><input type="checkbox" id="lr"'+(LT.norep?' checked':'')+' style="width:auto;margin:0 6px"> شماره‌های قبلاً انتخاب‌شده دوباره نیایند</label><br><label><input type="checkbox" id="lm"'+(LT.names?' checked':'')+' style="width:auto;margin:0 6px"> نام دانش‌آموز هم نشان داده شود</label>';
  h+='<div class="row" style="margin-top:12px"><button class="btn" data-act="ldraw">قرعه‌کشی 🎲</button><button class="btn ghost" data-act="lreset">پاک کردن سابقه</button></div></div>';
  if(LT.msg){h+='<div class="msg" role="status">'+esc(LT.msg)+'</div>';LT.msg=''}
  if(LT.last.length){
    h+='<div class="card" style="text-align:center"><b>شماره‌های انتخاب‌شده</b><div class="grid" style="margin-top:10px">';
    LT.last.forEach(function(x){var st=(LT.names&&c&&x>=1&&x<=cnt)?c.students[x-1].name:'';h+='<div class="tile"><b style="font-size:2rem">'+fa(x)+'</b>'+(st?'<span class="muted">'+esc(st)+'</span>':'')+'</div>'});
    h+='</div></div>';
  }
  if(LT.used.length)h+='<p class="muted">تا الان انتخاب شده‌اند: '+LT.used.map(fa).join('، ')+'</p>';
  return h;
}
var GQ={stage:'menu',k:1,qn:1,pts:1,ch:'c2',lvl:2,excl:'',sel:[],queue:[],qi:0,res:[],shown:false,q:null};
var PL={},BD={sel:{c:{},s:{},i:{}},init:'',month:'',link:'',text:''},KDF_IT=100000;
function gqBonus(c){var b={};(c.gquiz||[]).forEach(function(q){Object.keys(q.pts||{}).forEach(function(g){b[g]=(b[g]||0)+q.pts[g]})});return b}
function gqName(c,sid){var s=c.students.filter(function(x){return x.id===sid})[0];return s?s.name:'؟'}
function gqDraw(c){
  var ex=parseNums(GQ.excl),sel=[];
  grp(c).forEach(function(g){
    var mem=c.students.filter(function(s,i){return s.groupId===g.id&&ex.indexOf(i+1)<0});
    if(!mem.length)return;
    sel.push({gid:g.id,gname:g.name,sids:ltPick(mem.map(function(s){return s.id}),GQ.k)});
  });
  GQ.sel=sel;
}
function gqNextQ(){
  var ci=chInfo(GQ.ch),q,tries=0,seen=GQ.res.map(function(x){return x.t});
  if(GQ.q)seen.push(GQ.q.t);
  do{q=LG[pick(ci.lessons).k](GQ.lvl);tries++}while(seen.indexOf(q.t)>=0&&tries<15);
  GQ.q=q;GQ.shown=false;
}
function gqStart(){
  var qu=[];
  GQ.sel.forEach(function(g){g.sids.forEach(function(sid){for(var i=0;i<GQ.qn;i++)qu.push({gid:g.gid,gname:g.gname,sid:sid})})});
  GQ.queue=qu;GQ.qi=0;GQ.res=[];GQ.q=null;gqNextQ();GQ.stage='play';
}
function gqPoints(){var p={};GQ.sel.forEach(function(g){p[g.gid]=0});GQ.res.forEach(function(r){if(r.ok)p[r.gid]=(p[r.gid]||0)+GQ.pts});return p}
function gqJudge(ok){
  var it=GQ.queue[GQ.qi];
  GQ.res.push({gid:it.gid,sid:it.sid,ok:ok,t:GQ.q.t});
  GQ.qi++;
  if(GQ.qi>=GQ.queue.length)GQ.stage='done';else gqNextQ();
}
function gqRead(){
  function g(id){var e=document.getElementById(id);return e?e.value:''}
  function nv(id,d){var x=parseNums(g(id));return x.length?Math.max(1,x[0]):d}
  GQ.k=Math.min(20,nv('gk',1));GQ.qn=Math.min(10,nv('gqn',1));GQ.pts=Math.min(100,nv('gpts',1));
  GQ.ch=g('gch')||GQ.ch;GQ.lvl=Number(g('glv'))||2;GQ.excl=g('gex');
}
function vGQuiz(){
  var c=active(),h=back()+'<h2>پرسش گروهی 🙋</h2><div id="live">'+msgBox()+'</div>';
  if(!c)return h+'<div class="empty"><div class="ic">🏫</div><p>اول یک کلاس بسازید یا انتخاب کنید.</p><button class="btn" data-act="go" data-v="classes">رفتن به کلاس‌ها</button></div>';
  var gs=grp(c).filter(function(g){return c.students.some(function(s){return s.groupId===g.id})});
  if(!gs.length)return h+'<div class="empty"><p>گروهی که عضو داشته باشد وجود ندارد.</p><button class="btn" data-act="go" data-v="groups">رفتن به گروه‌ها</button></div>';
  if(GQ.stage==='menu'){
    h+='<div class="card"><p class="muted">از هر گروه یک یا چند نفر به‌طور شانسی انتخاب می‌شوند و به سؤال‌ها پاسخ می‌دهند. امتیاز پاسخ‌های درست فقط به <b>لیگ گروهی</b> اضافه می‌شود و در لیگ فردی هیچ نمره‌ای ثبت نمی‌شود.</p>';
    h+='<label for="gch">موضوع سؤال‌ها (فصل ریاضی)</label><select id="gch" class="fs">'+CHAP.map(function(x){return '<option value="'+x.k+'"'+(GQ.ch===x.k?' selected':'')+'>'+x.t+'</option>'}).join('')+'</select>';
    h+='<label for="glv">سطح</label><select id="glv" class="fs"><option value="1"'+(GQ.lvl===1?' selected':'')+'>ساده</option><option value="2"'+(GQ.lvl===2?' selected':'')+'>متوسط</option><option value="3"'+(GQ.lvl===3?' selected':'')+'>سخت</option></select>';
    h+='<label for="gk">از هر گروه چند نفر انتخاب شوند؟</label><input id="gk" inputmode="numeric" value="'+GQ.k+'"><label for="gqn">هر نفر به چند سؤال پاسخ دهد؟</label><input id="gqn" inputmode="numeric" value="'+GQ.qn+'"><label for="gpts">هر پاسخ درست چند امتیاز برای گروه؟</label><input id="gpts" inputmode="numeric" value="'+GQ.pts+'">';
    h+='<label for="gex">شماره دانش‌آموزان غایب (ردیف در فهرست کلاس؛ شرکت نمی‌کنند)</label><input id="gex" value="'+esc(GQ.excl)+'" placeholder="مثلاً: ۳، ۱۲">';
    h+='<button class="btn" data-act="gqdraw">انتخاب نفرات از هر گروه 🎲</button></div>';
  }else if(GQ.stage==='pick'){
    h+='<div class="card"><b>نفرات انتخاب‌شده</b>';
    GQ.sel.forEach(function(g){h+='<div class="st"><span>'+esc(g.gname)+'</span><span class="muted">'+g.sids.map(function(sid){return esc(gqName(c,sid))}).join('، ')+'</span></div>'});
    h+='<div class="row" style="margin-top:12px"><button class="btn" data-act="gqstart">شروع پرسش ▶️</button><button class="btn ghost" data-act="gqdraw">انتخاب دوباره</button><button class="btn ghost" data-act="gqback">بازگشت</button></div></div>';
  }else if(GQ.stage==='play'){
    var it=GQ.queue[GQ.qi],q=GQ.q;
    h+='<div class="card"><div class="row"><span class="muted">سؤال '+fa(GQ.qi+1)+' از '+fa(GQ.queue.length)+'</span><b>'+esc(it.gname)+'</b></div><p style="text-align:center">نوبت: <b>'+esc(gqName(c,it.sid))+'</b></p>';
    h+=q.rtl?'<div dir="rtl" style="text-align:center;font-size:1.25rem;font-weight:700;margin:14px 0;line-height:2">'+pf(q.t)+'</div>':'<div dir="ltr" style="text-align:center;font-size:2rem;font-weight:800;margin:14px 0">'+pf(q.t)+'</div>';
    if(q.mode==='opt')h+='<p class="muted" style="text-align:center">گزینه‌ها: <span dir="ltr">'+q.opts.map(pf).join('  |  ')+'</span></p>';
    if(!GQ.shown)h+='<button class="btn" data-act="gqshow">نمایش پاسخ</button>';
    else h+='<div class="msg" role="status">پاسخ: <b dir="ltr">'+pf(q.ans)+'</b></div><div class="row" style="margin-top:12px"><button class="btn" data-act="gqgood">✅ درست گفت</button><button class="btn danger" data-act="gqbad">❌ نادرست</button></div>';
    h+='</div><button class="back" data-act="gqback">لغو پرسش</button>';
  }else{
    var pts=gqPoints(),ids=Object.keys(pts).sort(function(a,b){return pts[b]-pts[a]});
    h+='<div class="card"><b>نتیجه پرسش گروهی</b>';
    ids.forEach(function(gid){var g=grp(c).filter(function(x){return x.id===gid})[0];h+='<div class="st"><span>'+esc(g?g.name:'؟')+'</span><b>'+fa(pts[gid])+' امتیاز</b></div>'});
    var okn=GQ.res.filter(function(r){return r.ok}).length;
    h+='<p class="muted">'+fa(okn)+' پاسخ درست از '+fa(GQ.res.length)+' سؤال. فقط با زدن دکمه زیر در لیگ گروهی ثبت می‌شود.</p><div class="row"><button class="btn" data-act="gqsave">ثبت امتیاز در لیگ گروهی</button><button class="btn ghost" data-act="gqback">ثبت نشود</button></div></div>';
  }
  var hist=(c.gquiz||[]).slice().reverse();
  if(GQ.stage==='menu'&&hist.length){
    h+='<h2>سابقه پرسش‌های گروهی</h2><div class="card">';
    hist.forEach(function(r){
      var line=Object.keys(r.pts).map(function(gid){var g=grp(c).filter(function(x){return x.id===gid})[0];return esc(g?g.name:'؟')+': '+fa(r.pts[gid])}).join(' - ');
      h+='<div class="st"><span>'+esc(new Date(r.ts).toLocaleDateString('fa-IR'))+' - '+esc(chInfo(r.ch).s)+'<br><span class="muted">'+line+'</span></span><button class="btn danger" data-act="gqdel" data-id="'+r.id+'">حذف</button></div>';
    });
    h+='</div>';
  }
  return h;
}