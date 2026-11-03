    return{id:s.id,name:s.name,gid:g?g.id:null,group:g?g.name:'',total:r2(t+ad.v),ex:r2(t),adj:ad.v,pen:ad.pen,exm:ad.exm,n:n};
  });
  rows.sort(function(a,b){return b.total-a.total||a.name.localeCompare(b.name,'fa')});
  rows.forEach(function(r,i){r.rank=(i>0&&r.total===rows[i-1].total)?rows[i-1].rank:i+1});
  return rows;
}
function vLeagueInd(){
  var c=active(),h=back();
  if(!c)return h+'<div class="empty"><div class="ic">🏫</div><p>اول یک کلاس بسازید یا انتخاب کنید.</p><button class="btn" data-act="go" data-v="classes">رفتن به کلاس‌ها</button></div>';
  h+='<h2>لیگ فردی '+esc(c.name)+'</h2>';
  var list=exs(c);
  if(!c.students.length)return h+'<div class="empty"><p>هنوز دانش‌آموزی ثبت نشده است.</p></div>';
  if(!list.length)return h+'<div class="empty"><p>هنوز آزمونی ثبت نشده است.</p><button class="btn" data-act="go" data-v="exams">رفتن به ثبت آزمون</button></div>';
  var sum=0;list.forEach(function(e){sum+=e.max});
  var rows=indTotals(c),medal={1:'🥇',2:'🥈',3:'🥉'};
  h+='<p class="muted">امتیاز هر نفر = جمع نمره‌های همه آزمون‌ها. تعداد آزمون‌ها: '+fa(list.length)+' ، جمع نمره کل آزمون‌ها: '+fn(sum)+'. نمره ثبت‌نشده (غایب) صفر حساب می‌شود.</p><ol class="card">';
  rows.forEach(function(r){
    h+='<li class="st"><span><b>'+(r.total>0&&medal[r.rank]?medal[r.rank]+' ':'')+fa(r.rank)+'.</b> '+esc(r.name)+(r.group?'<span class="muted"> - '+esc(r.group)+'</span>':'')+'<br><span class="muted">نمره ثبت‌شده در '+fa(r.n)+' از '+fa(list.length)+' آزمون'+(r.adj?' - نمره آزمون‌ها: '+fn(r.ex)+' - شایستگی: '+sgn(r.adj):'')+'</span></span><b>'+fn(r.total)+'</b></li>';
  });
  return h+'</ol><p class="muted">نفرات با امتیاز برابر، رتبه یکسان دارند.</p>';
}
function grpTotals(c){
  var rows=indTotals(c),out=[],bn=gqBonus(c),gx=gexTotals(c),now=nowMs();
  grp(c).forEach(function(g){
    var m=rows.filter(function(r){return r.gid===g.id});
    if(!m.length)return;
    var t=0;m.forEach(function(r){t+=r.ex});
    var base=t/m.length,bonus=bn[g.id]||0,ge=gx[g.id]||0,gc=gcomp(c,g.id,now).v;
    out.push({id:g.id,name:g.name,count:m.length,sum:r2(t),raw:base+bonus+ge+gc,avg:r2(base),bonus:bonus,gexam:ge,comp:gc,total:r2(base+bonus+ge+gc),names:m.map(function(r){return r.name})});
  });
  out.sort(function(a,b){return b.raw-a.raw||a.name.localeCompare(b.name,'fa')});
  out.forEach(function(r,i){r.rank=(i>0&&Math.abs(r.raw-out[i-1].raw)<1e-9)?out[i-1].rank:i+1});
  return out;
}
function vLeagueGrp(){
  var c=active(),h=back();
  if(!c)return h+'<div class="empty"><div class="ic">🏫</div><p>اول یک کلاس بسازید یا انتخاب کنید.</p><button class="btn" data-act="go" data-v="classes">رفتن به کلاس‌ها</button></div>';
  h+='<h2>لیگ گروهی '+esc(c.name)+'</h2>';
  var list=exs(c),gs=grp(c);
  if(!gs.length)return h+'<div class="empty"><p>هنوز گروهی ساخته نشده است.</p><button class="btn" data-act="go" data-v="groups">رفتن به گروه‌ها</button></div>';
  if(!list.length&&!(c.gquiz||[]).length&&!(c.gexams||[]).length)return h+'<div class="empty"><p>هنوز آزمونی یا پرسش گروهی ثبت نشده است.</p><button class="btn" data-act="go" data-v="exams">رفتن به ثبت آزمون</button></div>';
  var rows=grpTotals(c);
  if(!rows.length)return h+'<div class="empty"><p>هیچ گروهی عضو ندارد. دانش‌آموزان را به گروه‌ها اضافه کنید.</p><button class="btn" data-act="go" data-v="groups">رفتن به گروه‌ها</button></div>';
  var un=indTotals(c).filter(function(r){return !r.gid}).length,medal={1:'🥇',2:'🥈',3:'🥉'};
  h+='<p class="muted">امتیاز هر گروه = میانگین امتیاز اعضا (جمع نمره‌های همه آزمون‌ها) + امتیاز پرسش‌های گروهی + نمره آزمون‌های گروهی + تعدیل شایستگی و کار گروهی. نمره ثبت‌نشده (غایب) صفر حساب می‌شود. امتیاز پرسش گروهی و آزمون گروهی فقط به لیگ گروهی اضافه می‌شود و در لیگ فردی اثری ندارد.</p><ol class="card">';
  rows.forEach(function(r){
    h+='<li class="st"><span><b>'+(r.total>0&&medal[r.rank]?medal[r.rank]+' ':'')+fa(r.rank)+'.</b> '+esc(r.name)+'<br><span class="muted">'+fa(r.count)+' عضو - میانگین نمره اعضا: '+fn(r.avg)+' + پرسش گروهی: '+fn(r.bonus)+' + آزمون گروهی: '+fn(r.gexam)+' + شایستگی و کار گروهی: '+sgn(r.comp)+'<br>'+r.names.map(esc).join('، ')+'</span></span><b>'+fn(r.total)+'</b></li>';
  });
  h+='</ol><p class="muted">گروه‌های با امتیاز برابر، رتبه یکسان دارند.';
  if(un)h+=' '+fa(un)+' دانش‌آموز بدون گروه‌اند و در لیگ گروهی حساب نمی‌شوند.';
  return h+'</p>';
}
function honorsData(c){
  var rows=indTotals(c),list=exs(c),perfect={},per=[];
  var top=rows.filter(function(r){return r.rank<=3&&r.total>0});
  var tg=grpTotals(c).filter(function(r){return r.rank===1&&r.total>0});
  list.forEach(function(e){
    var best=0,names=[];
    c.students.forEach(function(s){
      var v=e.scores&&e.scores[s.id];if(v==null)return;
      if(v>best){best=v;names=[s.name]}else if(v===best&&v>0)names.push(s.name);
      if(v===e.max)perfect[s.id]=(perfect[s.id]||0)+1;
    });
    per.push({title:e.title,max:e.max,best:best,names:best>0?names:[]});
  });
  var pf=c.students.filter(function(s){return perfect[s.id]}).map(function(s){return{name:s.name,n:perfect[s.id]}}).sort(function(a,b){return b.n-a.n||a.name.localeCompare(b.name,'fa')});
  return{top:top,tg:tg,per:per,pf:pf};
}
var AW={week:'دانش‌آموز نمونه هفته',conduct:'دانش‌آموز نمونه اخلاق'};
function aws(c){if(!c.awards)c.awards=[];return c.awards}
function improveData(c){
  var list=exs(c),out=[];
  c.students.forEach(function(s){
    var p=[];
    list.forEach(function(e){var v=e.scores&&e.scores[s.id];if(v!=null&&e.max>0)p.push(v/e.max*100)});
    if(p.length<2)return;
    var sum=0,i;for(i=0;i<p.length-1;i++)sum+=p[i];
    out.push({id:s.id,name:s.name,delta:r2(p[p.length-1]-sum/(p.length-1)),last:r2(p[p.length-1])});
  });
  out.sort(function(a,b){return b.delta-a.delta||a.name.localeCompare(b.name,'fa')});
  return out.filter(function(r){return r.delta>0}).slice(0,3);
}
function nameOf(c,a){var st=c.students.filter(function(s){return s.id===a.sid})[0];if(st)return st.name;var mv=(c.former||[]).some(function(f){return f.id===a.sid});return a.nm+(mv?' (منتقل‌شده)':' (حذف‌شده)')}
function stampText(ts){try{var d=new Date(ts);if(isNaN(d))return '';return d.toLocaleDateString('fa-IR')+' ساعت '+d.toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'})}catch(e){return ''}}
function awardCard(c,type){
  var h='<div class="card"><b>'+AW[type]+' (آخرین مورد)</b>',last=null;
  aws(c).forEach(function(a){if(a.type===type)last=a});
  if(!last)return h+'<p class="muted">هنوز ثبت نشده است.</p></div>';
  return h+'<div class="st"><span>⭐ '+esc(nameOf(c,last))+'<br><span class="muted">'+esc(last.date)+(last.note?' - '+esc(last.note):'')+'</span></span></div></div>';
}
function archiveCard(c){
  var all=aws(c).slice().reverse(),h='<h2>بایگانی دانش‌آموزان نمونه</h2><div class="card">';
  if(!all.length)return h+'<p class="muted">هنوز موردی ثبت نشده است.</p></div>';
  var cnt={},order=[];
  all.forEach(function(a){var k=a.sid;if(!cnt[k]){cnt[k]={nm:nameOf(c,a),week:0,conduct:0};order.push(k)}if(cnt[k][a.type]!==undefined)cnt[k][a.type]++});
  order.sort(function(x,y){return (cnt[y].week+cnt[y].conduct)-(cnt[x].week+cnt[x].conduct)});
  h+='<b>خلاصه تعداد دفعات</b>';
  order.forEach(function(k){h+='<div class="st"><span>'+esc(cnt[k].nm)+'</span><span class="muted">هفته: '+fa(cnt[k].week)+' - اخلاق: '+fa(cnt[k].conduct)+'</span></div>'});
  h+='</div><div class="card"><div class="row" style="margin-bottom:8px">';
  [['all','همه'],['week','نمونه هفته'],['conduct','نمونه اخلاق']].forEach(function(f){h+='<button class="btn'+(awFilter===f[0]?'':' ghost')+'" data-act="awf" data-id="'+f[0]+'">'+f[1]+'</button>'});
  h+='</div>';
  var n=0;
  all.forEach(function(a){
    if(awFilter!=='all'&&a.type!==awFilter)return;n++;
    var st=a.ts?stampText(a.ts):'';
    h+='<div class="st"><span><b>'+AW[a.type]+'</b><br>⭐ '+esc(nameOf(c,a))+'<br><span class="muted">تاریخ: '+esc(a.date)+(st?' - ثبت در برنامه: '+st:'')+(a.note?'<br>'+esc(a.note):'')+'</span></span><button class="btn danger" data-act="delAward" data-id="'+a.id+'">حذف</button></div>';
  });
  if(!n)h+='<p class="muted">موردی در این دسته نیست.</p>';
  return h+'</div>';
}
function vHonors(){
  var c=active(),h=back();
  if(!c)return h+'<div class="empty"><div class="ic">🏫</div><p>اول یک کلاس بسازید یا انتخاب کنید.</p><button class="btn" data-act="go" data-v="classes">رفتن به کلاس‌ها</button></div>';
  h+='<h2>افتخارات '+esc(c.name)+'</h2><div id="live">'+msgBox()+'</div>';
  var medal={1:'🥇',2:'🥈',3:'🥉'};
  if(!exs(c).length){
    h+='<div class="card"><p class="muted">افتخارات خودکار (نفرات برتر، گروه برتر، بیشترین پیشرفت و ...) بعد از ثبت اولین آزمون نشان داده می‌شود.</p><button class="btn" data-act="go" data-v="exams">رفتن به ثبت آزمون</button></div>';
  }else{
    var d=honorsData(c),im=improveData(c);
    h+='<div class="card"><b>نفرات برتر لیگ فردی</b>';
    if(!d.top.length)h+='<p class="muted">هنوز نمره‌ای ثبت نشده است.</p>';
    d.top.forEach(function(r){h+='<div class="st"><span>'+medal[r.rank]+' '+esc(r.name)+'</span><b>'+fn(r.total)+'</b></div>'});
    h+='</div><div class="card"><b>گروه برتر</b>';
    if(!d.tg.length)h+='<p class="muted">هنوز گروهی با امتیاز ثبت نشده است.</p>';
    d.tg.forEach(function(r){h+='<div class="st"><span>🏆 '+esc(r.name)+'</span><b>'+fn(r.total)+'</b></div>'});
    h+='</div><div class="card"><b>بیشترین پیشرفت</b><p class="muted">درصد نمره آخرین آزمون هر دانش‌آموز نسبت به میانگین درصد آزمون‌های قبلی‌اش. حداقل دو آزمون لازم است. ترتیب آزمون‌ها به‌ترتیب ساخته‌شدن آن‌هاست.</p>';
    if(!im.length)h+='<p class="muted">هنوز پیشرفتی قابل محاسبه نیست.</p>';
    im.forEach(function(r){h+='<div class="st"><span>📈 '+esc(r.name)+'<br><span class="muted">درصد آخرین آزمون: '+fn(r.last)+'</span></span><b>+'+fn(r.delta)+' درصد</b></div>'});
    h+='</div><div class="card"><b>بالاترین نمره هر آزمون</b>';
    d.per.forEach(function(e){h+='<div class="st"><span>'+esc(e.title)+'<br><span class="muted">'+(e.names.length?e.names.map(esc).join('، '):'نمره‌ای ثبت نشده')+'</span></span><b>'+(e.names.length?fn(e.best)+' از '+fn(e.max):'')+'</b></div>'});
    h+='</div><div class="card"><b>نمره کامل</b>';
    if(!d.pf.length)h+='<p class="muted">هنوز کسی نمره کامل نگرفته است.</p>';
    d.pf.forEach(function(r){h+='<div class="st"><span>⭐ '+esc(r.name)+'</span><b>'+fa(r.n)+' بار</b></div>'});
    h+='</div>';
  }
  h+=awardCard(c,'week')+awardCard(c,'conduct')+archiveCard(c);
  h+='<h2>ثبت دانش‌آموز نمونه</h2><div class="card"><p class="muted">این جایزه‌ها را خودتان ثبت می‌کنید و روی امتیاز لیگ اثر ندارند.</p>';
  if(!c.students.length)return h+'<p class="muted">اول دانش‌آموزان کلاس را ثبت کنید.</p></div>';
  h+='<label for="at">نوع جایزه</label><select id="at" class="fs"><option value="week">'+AW.week+'</option><option value="conduct">'+AW.conduct+'</option></select>';
  h+='<label for="as">دانش‌آموز</label><select id="as" class="fs"><option value="">انتخاب کنید</option>'+c.students.map(function(s){return '<option value="'+s.id+'">'+esc(s.name)+'</option>'}).join('')+'</select>';
  h+='<label for="ad">تاریخ یا هفته</label><input id="ad" value="'+new Date().toLocaleDateString('fa-IR')+'"><label for="an">توضیح (اختیاری)</label><input id="an" placeholder="مثلاً: رعایت نظم و کمک به دوستان"><button class="btn" data-act="addAward">ثبت جایزه</button></div>';
  return h;
}
function firstActive(){var f=db.classes.filter(function(k){return !k.archived})[0];return f?f.id:null}
function pCode(o){return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function parentCards(c,opt){
  var list=exs(c),rows=indTotals(c),gt=grpTotals(c),n=rows.length,sumMax=0,byId={},avgT=0;
  list.forEach(function(e){sumMax+=e.max});
  rows.forEach(function(r){byId[r.id]=r;avgT+=r.ex});
  avgT=n?r2(avgT/n):0;
  var exAvg=list.map(function(e){var t=0,k=0;c.students.forEach(function(s){var v=e.scores&&e.scores[s.id];if(v!=null){t+=v;k++}});return k?r2(t/k):null});
  return c.students.map(function(s){
    var r=byId[s.id];
    var o={v:1,s:c.school||'',c:c.name,y:c.year||'',t:c.teacher||'',n:r.name,g:r.group||'',d:new Date().toLocaleDateString('fa-IR'),tot:r.ex,adj:r.adj,mx:sumMax};
    if(opt.rank){o.rk=r.rank;o.cnt=n;var g=r.gid?gt.filter(function(x){return x.id===r.gid})[0]:null;if(g){o.gr=g.rank;o.gc=gt.length}}
    if(opt.avg)o.avg=avgT;
    o.ex=list.map(function(e,i){var v=e.scores&&e.scores[r.id];return[e.title,e.date,e.max,v==null?null:v,opt.avg?exAvg[i]:null]});
    if(opt.aw)o.aw=aws(c).filter(function(a){return a.sid===r.id}).map(function(a){return[a.type==='week'?'w':'c',a.date,a.note||'']});
    var prs=[];CHAP.forEach(function(ch){var st=chStats(c,s.id,ch.k),kk=st[1].k+st[2].k+st[3].k;if(!kk)return;var nn=0,okk=0;[1,2,3].forEach(function(L){nn+=st[L].n;okk+=st[L].ok});prs.push([ch.s,Math.round(okk/Math.max(1,nn)*100),kk,LVN[suggestLevel(st)]])});
    if(prs.length)o.pr=prs;
    return{id:s.id,name:r.name,obj:o};
  });
}
function vSettings(){
  var c=active(),h=back()+'<h2>تنظیمات</h2><div id="live">'+msgBox()+'</div>';
  h+='<div class="card"><b>درباره برنامه</b><div class="st"><span>نام برنامه</span><span>لیگ موفقیت</span></div><div class="st"><span>نام کامل پروژه</span><span>لیگ موفقیت کلاس ششم ۵ دبستان سیدالشهدا</span></div><div class="st"><span>سازنده</span><span>مرتضی دعائی</span></div><div class="st"><span>نسخه</span><span>'+VER+'</span></div><div class="st"><span>سال ساخت</span><span>۱۴۰۵</span></div><p class="muted">هدف: ثبت و مقایسه نمره‌ها و ایجاد رقابت سالم و انگیزه در دانش‌آموزان کلاس.</p></div>';
  h+='<div class="card"><b>حریم خصوصی و ذخیره اطلاعات</b><p class="muted">اطلاعات دانش‌آموزان فقط داخل مرورگر همین گوشی ذخیره می‌شود و به جایی فرستاده نمی‌شود. اگر اطلاعات مرورگر پاک شود، از بین می‌رود. پشتیبان‌گیری مرتب فراموش نشود. '+lastBackup()+'</p><button class="btn ghost" data-act="go" data-v="backup">رفتن به پشتیبان‌گیری</button></div>';
  if(c&&exs(c).length&&c.students.length){h+=vParentCard(c)+vBoardCard(c)}
  if(c){
    h+='<div class="card"><b>ویرایش کلاس فعال</b><label for="kn">نام کلاس</label><input id="kn" value="'+esc(c.name)+'"><label for="kg">پایه</label><input id="kg" value="'+esc(c.grade||'')+'"><label for="ks">مدرسه</label><input id="ks" value="'+esc(c.school||'')+'"><label for="ky">سال تحصیلی</label><input id="ky" value="'+esc(c.year||'')+'"><label for="kt">آموزگار</label><input id="kt" value="'+esc(c.teacher||'')+'"><button class="btn" data-act="editClass">ذخیره تغییرات کلاس</button></div>';
    h+='<div class="card"><b>بایگانی کلاس فعال</b><p class="muted">مثلاً برای پایان سال تحصیلی. اطلاعات کلاس پاک نمی‌شود و بعداً می‌توانید آن را بازیابی کنید. کلاس بایگانی‌شده در بخش‌های دیگر دیده نمی‌شود.</p><button class="btn danger" data-act="archiveClass">بایگانی کلاس «'+esc(c.name)+'»</button></div>';
  }
  var ar=db.classes.filter(function(k){return k.archived});
  h+='<div class="card"><b>کلاس‌های بایگانی‌شده</b>';
  if(!ar.length)h+='<p class="muted">کلاس بایگانی‌شده‌ای ندارید.</p>';
  ar.forEach(function(k){h+='<div class="st"><span>'+esc(k.name)+'<br><span class="muted">'+esc(k.year||'')+' - '+fa(k.students.length)+' دانش‌آموز</span></span><button class="btn" data-act="restoreClass" data-id="'+k.id+'">بازیابی</button></div>'});
  return h+'</div>';
}
var pr=null;
var PS={sid:'',mode:'self',n:10},LVN={1:'ساده',2:'متوسط',3:'سخت'};
var CHAP=[
{k:'c1',t:'فصل ۱: عدد و الگوهای عددی',s:'عدد و الگو',ic:'🔢',topics:'الگوهای عددی، یادآوری عددنویسی، بخش‌پذیری، معرفی اعداد صحیح',lessons:[{k:'pat',t:'الگوهای عددی'},{k:'numw',t:'یادآوری عددنویسی'},{k:'divis',t:'بخش‌پذیری'},{k:'int',t:'معرفی اعداد صحیح'}]},
{k:'c2',t:'فصل ۲: کسر',s:'کسر',ic:'🍕',topics:'جمع و تفریق، ضرب، تقسیم و محاسبات با کسر',lessons:[{k:'fadd',t:'جمع و تفریق کسرها'},{k:'fmul',t:'ضرب کسرها'},{k:'fdiv',t:'تقسیم کسرها'},{k:'fcalc',t:'محاسبات با کسر'}]},
{k:'c3',t:'فصل ۳: اعداد اعشاری',s:'اعشار',ic:'🔟',topics:'یادآوری، ضرب و تقسیم، تقسیم اعشار بر طبیعی، تقسیم بر اعشار',lessons:[{k:'dplace',t:'یادآوری اعداد اعشاری'},{k:'dmuldiv',t:'جمع، تفریق و ضرب اعشاری'},{k:'ddivn',t:'تقسیم عدد اعشاری بر عدد طبیعی'},{k:'ddivd',t:'تقسیم یک عدد بر عدد اعشاری'}]},
{k:'c4',t:'فصل ۴: تقارن و مختصات',s:'تقارن و مختصات',ic:'📍',topics:'مرکز تقارن، دوران، محورهای مختصات، تقارن و مختصات',lessons:[{k:'sym',t:'مرکز تقارن'},{k:'rot',t:'دوران'},{k:'axes',t:'محورهای مختصات'},{k:'scoord',t:'تقارن و مختصات'}]},
{k:'c5',t:'فصل ۵: اندازه‌گیری',s:'اندازه‌گیری',ic:'📏',topics:'طول و سطح، حجم و جرم، مساحت دایره، خط و زاویه',lessons:[{k:'len',t:'طول و سطح'},{k:'vol',t:'حجم و جرم'},{k:'circ',t:'مساحت دایره'},{k:'line',t:'خط و زاویه'}]},
{k:'c6',t:'فصل ۶: تناسب و درصد',s:'تناسب و درصد',ic:'💯',topics:'نسبت و تناسب، درصد، محاسبات مالی، آمار',lessons:[{k:'ratio',t:'کسر، نسبت و تناسب'},{k:'pct',t:'درصد'},{k:'fin',t:'کاربرد درصد در محاسبات مالی'},{k:'stat',t:'کاربرد درصد در آمار'}]},
{k:'c7',t:'فصل ۷: تقریب',s:'تقریب',ic:'🎯',topics:'تقریب، اندازه‌گیری و محاسبات تقریبی',lessons:[{k:'trunc',t:'تقریب'},{k:'approx',t:'اندازه‌گیری و محاسبات تقریبی'}]},
{k:'x1',t:'مرور محاسبه‌ها',s:'مرور محاسبه',ic:'➕',topics:'جمع، تفریق، ضرب و تقسیم',lessons:[{k:'calc',t:'مرور محاسبه‌ها'}]},
{k:'x2',t:'مسئله‌های کلامی',s:'مسئله کلامی',ic:'🧩',topics:'حل مسئله چندمرحله‌ای',lessons:[{k:'word',t:'مسئله‌های کلامی'}]}
];
function chInfo(k){return CHAP.filter(function(x){return x.k===k})[0]||CHAP[0]}
function opCh(op){var m={add:'x1',sub:'x1',mul:'x1',divi:'x1',mix:'x1',frac:'c2',dec:'c3',pct:'c6',ratio:'c6',int:'c1',bakh:'c1',pat:'c1',coord:'c4',round:'c7',meas:'c5',word:'x2'};return m[op]||'x1'}
var TG={carry:'جمع با نقلی',borrow:'تفریق با قرض گرفتن',table:'جدول ضرب',fracDen:'جمع کسرها (مخرج مشترک)',decPoint:'جای ممیز در اعداد اعشاری',other:'دقت در محاسبه',add:'جمع',sub:'تفریق',mul:'ضرب',divi:'تقسیم',word:'مسئله‌های کلامی',pat:'الگوهای عددی',numw:'عددنویسی و ارزش مکانی',divis:'بخش‌پذیری',int:'اعداد صحیح',fadd:'جمع و تفریق کسرها',fmul:'ضرب کسرها',fdiv:'تقسیم کسرها',fcalc:'محاسبات با کسر',dplace:'اعداد اعشاری و کسر',dmuldiv:'جمع، تفریق و ضرب اعشاری',ddivn:'تقسیم اعشار بر عدد طبیعی',ddivd:'تقسیم بر عدد اعشاری',sym:'مرکز تقارن',rot:'دوران',axes:'محورهای مختصات',scoord:'تقارن و مختصات',len:'طول و سطح (یکاها)',vol:'حجم و جرم',circ:'محیط و مساحت دایره',line:'خط، عمود و مثلث',ratio:'نسبت و تناسب',pct:'درصد',fin:'درصد در محاسبات مالی',stat:'درصد و نمودار دایره‌ای',trunc:'تقریب (قطع و گرد کردن)',approx:'محاسبات تقریبی',frac:'کسرها',dec:'اعشار',bakh:'بخش‌پذیری',round:'گرد کردن',meas:'اندازه‌گیری',coord:'مختصات',ratio_:'نسبت'};
function ri(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function gcd(a,b){return b?gcd(b,a%b):a}
function frs(n,d){var g=gcd(Math.abs(n),d);n=n/g;d=d/g;return d===1?String(n):n+'/'+d}
function pf(x){return String(x).replace(/(\d)\.(\d)/g,'$1٫$2').replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d]})}
function shuf(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function uniqOpts(ans,wrongs){
  var o=[String(ans)];
  wrongs.forEach(function(w){w=String(w);if(o.indexOf(w)<0)o.push(w)});
  var k=1;
  while(o.length<4&&typeof ans==='number'){var w2=String(ans+k*(k%2?1:-1)*ri(1,3));if(ans+k>0&&o.indexOf(w2)<0&&Number(w2)>0)o.push(w2);k++;if(k>30)break}
  return shuf(o.slice(0,4));
}
function numS(t){
  var s=String(t==null?'':t).trim().replace(/[−–—]/g,'-'),neg=false;
  if(s.charAt(0)==='-'){neg=true;s=s.slice(1)}else if(s.charAt(s.length-1)==='-'){neg=true;s=s.slice(0,-1)}
  var v=num(s);
  if(v===null||isNaN(v))return v;
  return neg?-v:v;
}
function pick(a){return a[ri(0,a.length-1)]}
function dstr(x){return String(r2(x))}
function sg(x){return x<0?'(−'+Math.abs(x)+')':String(x)}

function N(op,a,b,t,ans,rtl){return{op:op,a:a,b:b,t:rtl?t:t+' = ?',ans:ans,mode:'num',rtl:!!rtl}}


function mkWord(l){
  var nm=pick(['علی','سارا','رضا','مریم','امیر','نگار','حسین','زهرا']);
  if(l===1){var k=ri(2,9),q=ri(2,20)*500;return N('word',k,q,nm+' برای '+k+' دفتر، هر دفتر '+q+' تومان، چقدر پرداخت کرد؟',k*q,true)}
  if(l===2){
    if(Math.random()<0.5){var P,k2,q2;do{P=ri(5,20)*10000;k2=ri(2,6);q2=ri(2,15)*1000}while(P<=k2*q2);return N('word',P,q2,nm+' '+P+' تومان داشت. '+k2+' بسته '+q2+' تومانی خرید. چند تومان باقی ماند؟',P-k2*q2,true)}