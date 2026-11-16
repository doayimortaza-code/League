  if(!c.students.length)return h+'<div class="empty"><p>هنوز دانش‌آموزی ثبت نشده است.</p><button class="btn" data-act="go" data-v="students">رفتن به دانش‌آموزان</button></div>';
  if(!CP.month)CP.month=mKey(nowMs());
  var tabs=[['rec','ثبت رفتار'],['twk','کار گروهی'],['exm','نمونه ماه']];
  h+='<div class="row" style="margin-bottom:10px">'+tabs.map(function(t){return '<button class="btn'+(CP.tab===t[0]?'':' ghost')+'" data-act="cpTab" data-id="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div>';
  return h+(CP.tab==='rec'?cpRec(c):CP.tab==='twk'?cpTwk(c):cpExm(c));
}
var RC={sid:'',rank:true,avg:true,comp:false,img:''};
function rcStudent(c){var s=c.students.filter(function(x){return x.id===RC.sid})[0];if(!s&&c.students.length){s=c.students[0];RC.sid=s.id}return s||null}
function rcData(c,sid,opt){
  var rows=indTotals(c),me=rows.filter(function(r){return r.id===sid})[0];
  if(!me)return null;
  var list=exs(c),out=[],ex=0,mx=0;
  list.forEach(function(e){
    var v=e.scores&&e.scores[sid],t=0,k=0;
    c.students.forEach(function(s){var z=e.scores&&e.scores[s.id];if(z!=null){t+=z;k++}});
    mx+=e.max;if(v!=null)ex+=v;
    out.push({t:e.title,d:e.date,m:e.max,v:v==null?null:v,a:k?r2(t/k):null});
  });
  return{name:me.name,group:me.group,school:c.school||'',cls:c.name,year:c.year||'',teacher:c.teacher||'',date:new Date(nowMs()).toLocaleDateString('fa-IR'),
    rows:out,ex:r2(ex),mx:mx,pct:mx>0?Math.round(ex/mx*1000)/10:0,rank:me.rank,cnt:rows.length,adj:me.adj,total:me.total,opt:opt};
}
function rcPreview(d,opt){
  var st='style="border:1px solid var(--line);padding:6px;text-align:center"';
  var h='<div id="rccard" style="background:#fff;color:#14302a;border:2px solid #0f5c4d;border-radius:14px;overflow:hidden;margin-top:12px"><div style="background:#0f5c4d;color:#fff;padding:14px;text-align:center"><div style="font-size:1.1rem;font-weight:800">کارنامه</div><div>'+esc(d.school)+'</div><div>'+esc(d.cls)+(d.year?' - '+esc(d.year):'')+'</div></div><div style="padding:12px">';
  h+='<div style="font-size:1.2rem;font-weight:800">'+esc(d.name)+'</div>'+(d.group?'<div style="color:#5d726b">گروه: '+esc(d.group)+'</div>':'');
  h+='<div style="overflow-x:auto;margin-top:10px"><table style="width:100%;border-collapse:collapse;font-size:.95rem"><tr style="background:#e6f1ee"><th '+st+'>آزمون</th><th '+st+'>تاریخ</th><th '+st+'>نمره</th>'+(opt.avg?'<th '+st+'>میانگین کلاس</th>':'')+'</tr>';
  d.rows.forEach(function(r){h+='<tr><td '+st+'>'+esc(r.t)+'</td><td '+st+'>'+esc(r.d)+'</td><td '+st+'>'+(r.v==null?'ثبت نشده':fn(r.v)+' از '+fn(r.m))+'</td>'+(opt.avg?'<td '+st+'>'+(r.a==null?'-':fn(r.a))+'</td>':'')+'</tr>'});
  h+='</table></div><div style="margin-top:10px;line-height:2"><b>مجموع نمره: '+fn(d.ex)+' از '+fn(d.mx)+'</b> ('+fn(d.pct)+'٪)';
  if(opt.rank)h+='<br>رتبه در کلاس: '+fa(d.rank)+' از '+fa(d.cnt);
  if(opt.comp&&d.adj)h+='<br>تعدیل شایستگی: '+sgn(d.adj)+' - امتیاز نهایی لیگ فردی: '+fn(d.total);
  h+='</div><div style="margin-top:8px;color:#5d726b;font-size:.85rem">آموزگار: '+esc(d.teacher)+' - تاریخ: '+esc(d.date)+'</div></div></div>';
  return h;
}
function rcDraw(d,opt){
  var W=900,rowH=60,top=290,M=40,cv=document.createElement('canvas');
  var H=top+(d.rows.length+1)*rowH+(opt.rank?70:0)+(opt.comp&&d.adj?70:0)+230;
  cv.width=W;cv.height=H;
  var x=cv.getContext('2d'),F='"Vazirmatn",Tahoma,"Segoe UI","Noto Naskh Arabic",sans-serif';
  x.direction='rtl';x.textBaseline='middle';
  function T(s,xr,y,size,col,bold,al){x.font=(bold?'bold ':'')+size+'px '+F;x.fillStyle=col;x.textAlign=al||'right';x.fillText(pf(String(s)),xr,y)}
  function fit(s,maxW,size,bold){x.font=(bold?'bold ':'')+size+'px '+F;s=pf(String(s));while(x.measureText(s).width>maxW&&s.length>3)s=s.slice(0,-2);return s}
  x.fillStyle='#ffffff';x.fillRect(0,0,W,H);
  x.fillStyle='#0f5c4d';x.fillRect(0,0,W,200);
  T('کارنامه',W/2,45,44,'#ffffff',true,'center');
  T(d.school,W/2,102,30,'#ffffff',false,'center');
  T(d.cls+(d.year?' - '+d.year:''),W/2,150,28,'#ffffff',false,'center');
  T(fit(d.name,W-2*M,40,true),W-M,240,40,'#14302a',true);
  if(d.group)T('گروه: '+d.group,M+200,240,28,'#5d726b',false,'left');
  var cw=opt.avg?[330,160,200,140]:[400,200,240],xr=W-M,i,y=top;
  var heads=['آزمون','تاریخ','نمره'].concat(opt.avg?['میانگین کلاس']:[]);
  x.fillStyle='#e6f1ee';x.fillRect(M,y-rowH/2,W-2*M,rowH);
  var xx=xr;heads.forEach(function(hd,k){T(hd,xx-12,y,26,'#0f5c4d',true);xx-=cw[k]});
  d.rows.forEach(function(r,ri){
    y=top+(ri+1)*rowH;
    if(ri%2===1){x.fillStyle='#f4f8f6';x.fillRect(M,y-rowH/2,W-2*M,rowH)}
    var cells=[fit(r.t,cw[0]-24,26,false),r.d,r.v==null?'ثبت نشده':fn(r.v)+' از '+fn(r.m)].concat(opt.avg?[r.a==null?'-':fn(r.a)]:[]);
    xx=xr;cells.forEach(function(cl,k){T(cl,xx-12,y,26,'#14302a',false);xx-=cw[k]});
  });
  x.strokeStyle='#c9d6d0';x.lineWidth=2;x.strokeRect(M,top-rowH/2,W-2*M,(d.rows.length+1)*rowH);
  y=top+(d.rows.length+1)*rowH+50;
  T('مجموع نمره: '+fn(d.ex)+' از '+fn(d.mx)+' ('+fn(d.pct)+'٪)',W-M,y,34,'#0f5c4d',true);
  if(opt.rank){y+=70;T('رتبه در کلاس: '+fa(d.rank)+' از '+fa(d.cnt),W-M,y,30,'#14302a',false)}
  if(opt.comp&&d.adj){y+=70;T('تعدیل شایستگی: '+sgn(d.adj)+' - امتیاز نهایی لیگ فردی: '+fn(d.total),W-M,y,28,'#14302a',false)}
  y+=90;T('آموزگار: '+d.teacher,W-M,y,26,'#5d726b',false);T('تاریخ: '+d.date,M+150,y,26,'#5d726b',false,'left');
  return cv;
}
function rcSave(c,d,opt,idx){
  var cv=rcDraw(d,opt);
  cv.toBlob(function(b){
    if(!b){note('ساخت عکس ممکن نشد. از صفحه کارنامه اسکرین‌شات بگیرید.');return}
    var name='karname-'+(idx+1)+'.png',f=null;
    try{f=new File([b],name,{type:'image/png'})}catch(e){f=null}
    if(f&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:'کارنامه '+d.name}).catch(function(){});return}
    var u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();
    setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(u)},2000);
    note('عکس دانلود شد. اگر دانلود نشد، روی عکس کارنامه نگه دارید و گزینه ذخیره را بزنید.');
  },'image/png');
}
function vRcard(){
  var c=active(),h=back()+'<h2>کارنامه دانش‌آموزان 🧾</h2><div id="live">'+msgBox()+'</div>';
  if(!c)return h+'<div class="empty"><div class="ic">🏫</div><p>اول یک کلاس بسازید یا انتخاب کنید.</p><button class="btn" data-act="go" data-v="classes">رفتن به کلاس‌ها</button></div>';
  if(!c.students.length)return h+'<div class="empty"><p>هنوز دانش‌آموزی ثبت نشده است.</p><button class="btn" data-act="go" data-v="students">رفتن به دانش‌آموزان</button></div>';
  if(!exs(c).length)return h+'<div class="empty"><p>هنوز آزمونی ثبت نشده است.</p><button class="btn" data-act="go" data-v="exams">رفتن به ثبت آزمون</button></div>';
  var s=rcStudent(c),opt={rank:RC.rank,avg:RC.avg,comp:RC.comp},d=rcData(c,s.id,opt);
  h+='<div class="card"><label for="rcs">دانش‌آموز</label><select id="rcs" class="fs" data-act="rcStu">'+c.students.map(function(x,i){return '<option value="'+x.id+'"'+(x.id===s.id?' selected':'')+'>'+fa(i+1)+'. '+esc(x.name)+'</option>'}).join('')+'</select>';
  h+='<div class="row" style="margin-bottom:8px"><button class="btn ghost" data-act="rcNav" data-id="-1">▶ قبلی</button><button class="btn ghost" data-act="rcNav" data-id="1">بعدی ◀</button></div>';
  h+='<label><input type="checkbox" data-act="rcOpt" data-k="rank"'+(RC.rank?' checked':'')+' style="width:auto;margin:0 6px"> نمایش رتبه در کلاس</label><br><label><input type="checkbox" data-act="rcOpt" data-k="avg"'+(RC.avg?' checked':'')+' style="width:auto;margin:0 6px"> نمایش میانگین کلاس در هر آزمون</label><br><label><input type="checkbox" data-act="rcOpt" data-k="comp"'+(RC.comp?' checked':'')+' style="width:auto;margin:0 6px"> نمایش تعدیل شایستگی (اگر وجود داشته باشد)</label>';
  h+='<div class="row" style="margin-top:10px"><button class="btn" data-act="rcImg">ساخت عکس کارنامه 📷</button><button class="btn ghost" data-act="rcShare">اشتراک‌گذاری یا ذخیره عکس</button></div><p class="muted">می‌توانید از همین صفحه هم اسکرین‌شات بگیرید.</p></div>';
  h+=rcPreview(d,opt);
  if(RC.img)h+='<div class="card" style="text-align:center"><b>عکس کارنامه</b><p class="muted">روی عکس نگه دارید و گزینه ذخیره را بزنید، یا دکمه اشتراک‌گذاری را بزنید.</p><img alt="عکس کارنامه '+esc(d.name)+'" src="'+RC.img+'" style="max-width:100%;border-radius:10px"></div>';
  return h;
}
function rcOpt(){return{rank:RC.rank,avg:RC.avg,comp:RC.comp}}
function vPh(t){return back()+'<div class="empty"><h2>'+esc(t)+'</h2><p>این بخش در مرحله‌های بعدی ساخته می‌شود.</p></div>'}
function render(keep){var y=window.scrollY;
  var h=view==='home'?vHome():view==='classes'?vClasses():view==='students'?vStudents():view==='groups'?vGroups():view==='backup'?vBackup():view==='exams'?vExams():view==='leagueInd'?vLeagueInd():view==='leagueGrp'?vLeagueGrp():view==='honors'?vHonors():view==='settings'?vSettings():view==='practice'?vPractice():view==='lottery'?vLottery():view==='gquiz'?vGQuiz():view==='gexam'?vGExam():view==='comp'?vComp():view==='rcard'?vRcard():vPh(view.slice(3));
  document.getElementById('app').innerHTML=h;window.scrollTo(0,keep?y:0);
  if(focusId){var f=document.getElementById(focusId);if(f)f.focus();focusId=null}
}
function arm(btn,key,label){
  if(armed===key)return true;
  armed=key;var old=btn.textContent;btn.textContent=label;btn.classList.add('armed');
  setTimeout(function(){if(armed===key){armed=null;if(btn.isConnected){btn.textContent=old;btn.classList.remove('armed')}}},3000);
  return false;
}
function hasName(c,n){return c.students.some(function(s){return s.name===n})}
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-act]');if(!t)return;
  var a=t.dataset.act,id=t.dataset.id,c=active();
  if(a==='go'){view=t.dataset.v;armed=null;curExam=null;xferId=null;pr=null;GE.cur=null;CP.open=null;RC.img='';render()}
  else if(a==='pick'){db.activeId=id;save();msg='کلاس فعال تغییر کرد.';render()}
  else if(a==='delClass'){
    if(!arm(t,'c'+id,'مطمئنید؟ دوباره بزنید'))return;
    armed=null;db.classes=db.classes.filter(function(x){return x.id!==id});
    if(db.activeId===id)db.activeId=firstActive();
    save();msg='کلاس حذف شد.';render();
  }
  else if(a==='addClass'){
    var n=val('cn');if(!n){msg='نام کلاس را بنویسید.';render();return}
    var k={id:uid('c'),name:n,grade:val('cg'),school:val('cs'),year:val('cy'),teacher:val('ct'),students:[],groups:[]};
    if(db.classes.some(function(x){return x.name===n&&x.year===k.year})){msg='کلاسی با همین نام و سال تحصیلی وجود دارد.';render();return}
    db.classes.push(k);db.activeId=k.id;save();msg='کلاس «'+n+'» ساخته شد و فعال است.';render();
  }
  else if(a==='addStu'&&c){
    var nm=val('sn');
    if(!nm)msg='نام را بنویسید.';
    else if(c.students.length>=MAX)msg='ظرفیت کلاس پر است (حداکثر '+fa(MAX)+' نفر).';
    else if(hasName(c,nm))msg='این نام قبلاً در این کلاس ثبت شده است.';
    else{c.students.push({id:uid('s'),name:nm});save();msg='«'+nm+'» اضافه شد.'}
    focusId='sn';render();
  }
  else if(a==='addBulk'&&c){
    var lines=(document.getElementById('sb').value||'').split(/\n/).map(norm).filter(Boolean),add=0,dup=0,full=0;
    lines.forEach(function(l){
      if(c.students.length>=MAX){full++;return}
      if(hasName(c,l)){dup++;return}
      c.students.push({id:uid('s'),name:l});add++;
    });
    save();msg=fa(add)+' نفر اضافه شد.'+(dup?' '+fa(dup)+' نام تکراری نادیده گرفته شد.':'')+(full?' '+fa(full)+' نام به‌خاطر پر بودن ظرفیت اضافه نشد.':'');render();
  }
  else if(a==='addGroup'&&c){
    var gn=val('gn'),gs=grp(c);
    if(!gn)msg='نام گروه را بنویسید.';
    else if(gs.some(function(g){return g.name===gn}))msg='گروهی با این نام در این کلاس وجود دارد.';
    else{gs.push({id:uid('g'),name:gn});save();msg='گروه «'+gn+'» ساخته شد.'}
    focusId='gn';render();
  }
  else if(a==='delGroup'&&c){
    if(!arm(t,'g'+id,'مطمئنید؟ دوباره بزنید'))return;
    armed=null;c.groups=grp(c).filter(function(g){return g.id!==id});
    c.students.forEach(function(s){if(s.groupId===id)s.groupId=null});
    save();msg='گروه حذف شد. اعضای آن بدون گروه شدند.';render();
  }
  else if(a==='openExam'){curExam=id;render()}
  else if(a==='closeExam'){curExam=null;render()}
  else if(a==='addExam'&&c){
    var xt=val('xt'),xm=num(val('xm')),xd=val('xd');
    if(!xt)note('عنوان آزمون را بنویسید.');
    else if(xm===null||isNaN(xm)||xm<=0||xm>1000)note('نمره کل آزمون را درست بنویسید (عددی بزرگ‌تر از صفر).');
    else if(exs(c).some(function(x){return x.title===xt&&x.date===xd}))note('آزمونی با همین عنوان و تاریخ قبلاً ثبت شده است.');
    else{var nx={id:uid('x'),title:xt,date:xd,max:xm,scores:{}};exs(c).push(nx);save();curExam=nx.id;msg='آزمون ساخته شد. حالا نمره‌ها را وارد کنید.';render()}
  }
  else if(a==='editExam'&&c){
    var ex=findExam(c,curExam);if(!ex)return;
    var et=val('et'),em=num(val('em')),ed=val('ed'),hi=0;
    Object.keys(ex.scores||{}).forEach(function(k){if(ex.scores[k]>hi)hi=ex.scores[k]});
    if(!et)note('عنوان آزمون را بنویسید.');
    else if(em===null||isNaN(em)||em<=0||em>1000)note('نمره کل آزمون را درست بنویسید.');
    else if(em<hi)note('نمره کل نمی‌تواند از بالاترین نمره ثبت‌شده ('+fn(hi)+') کمتر باشد.');
    else{ex.title=et;ex.max=em;ex.date=ed;save();msg='مشخصات آزمون ذخیره شد.';render(true)}
  }
  else if(a==='saveScores'&&c){
    var se=findExam(c,curExam);if(!se)return;
    var bad=[],ns={};
    c.students.forEach(function(s){
      var el=document.getElementById('sc_'+s.id);if(!el)return;
      var v=num(el.value);
      if(v===null)return;
      if(isNaN(v)||v<0||v>se.max)bad.push(s.name);else ns[s.id]=v;
    });
    if(bad.length){note('نمره نامعتبر برای: '+bad.slice(0,5).join('، ')+(bad.length>5?' و '+fa(bad.length-5)+' نفر دیگر':'')+'. نمره باید بین ۰ و '+fn(se.max)+' باشد. چیزی ذخیره نشد.');return}
    se.scores=ns;save();msg='نمره‌ها ذخیره شد: '+fa(Object.keys(ns).length)+' نفر.';render(true);
  }
  else if(a==='delExam'&&c){
    if(!arm(t,'x'+id,'مطمئنید؟ دوباره بزنید'))return;
    armed=null;c.exams=exs(c).filter(function(x){return x.id!==id});curExam=null;save();msg='آزمون حذف شد.';render(true);
  }
  else if(a==='addAward'&&c){
    var ty=document.getElementById('at').value,sid=document.getElementById('as').value,ad=val('ad'),an=val('an');
    var stu=c.students.filter(function(x){return x.id===sid})[0];
    if(!stu)note('دانش‌آموز را انتخاب کنید.');
    else if(!ad)note('تاریخ یا هفته را بنویسید.');
    else if(aws(c).some(function(w){return w.type===ty&&w.sid===sid&&w.date===ad}))note('این جایزه با همین تاریخ قبلاً برای این دانش‌آموز ثبت شده است.');
    else{aws(c).push({id:uid('w'),type:ty,sid:sid,nm:stu.name,date:ad,note:an,ts:new Date().toISOString()});save();msg='«'+stu.name+'» به‌عنوان '+AW[ty]+' ثبت شد.';render(true)}
  }
  else if(a==='awf'){awFilter=id;render(true)}
  else if(a==='delAward'&&c){
    if(!arm(t,'w'+id,'مطمئنید؟ دوباره بزنید'))return;
    armed=null;c.awards=aws(c).filter(function(w){return w.id!==id});save();msg='جایزه حذف شد.';render(true);
  }
  else if(a==='editClass'&&c){
    var kn=val('kn'),ky=val('ky');
    if(!kn)note('نام کلاس را بنویسید.');
    else if(db.classes.some(function(x){return x.id!==c.id&&x.name===kn&&x.year===ky}))note('کلاس دیگری با همین نام و سال تحصیلی وجود دارد.');
    else{c.name=kn;c.grade=val('kg');c.school=val('ks');c.year=ky;c.teacher=val('kt');save();msg='تغییرات کلاس ذخیره شد.';render(true)}
  }
  else if(a==='archiveClass'&&c){
    if(!arm(t,'ac','مطمئنید؟ دوباره بزنید'))return;
    armed=null;c.archived=true;db.activeId=firstActive();save();msg='کلاس بایگانی شد. هر وقت خواستید از همین‌جا بازیابی کنید.';render(true);
  }
  else if(a==='restoreClass'){
    var rc=db.classes.filter(function(x){return x.id===id})[0];
    if(rc){rc.archived=false;if(!db.activeId)db.activeId=rc.id;save();msg='کلاس «'+rc.name+'» بازیابی شد.';render(true)}
  }
  else if(a==='xfer'&&c){xferId=id;render()}
  else if(a==='cancelXfer'){xferId=null;render(true)}
  else if(a==='doXfer'&&c&&xferId){
    if(!arm(t,'xf','مطمئنید؟ دوباره بزنید'))return;
    armed=null;
    var dest=db.classes.filter(function(k){return k.id===document.getElementById('tc').value})[0];
    var nmx=(c.students.filter(function(x){return x.id===xferId})[0]||{}).name;
    var er=transferStudent(c,dest,xferId);
    if(er)msg=er;else{save();msg='«'+nmx+'» به کلاس «'+dest.name+'» منتقل شد.';xferId=null}
    render(true);
  }
  else if(a==='csv'&&c){doCsv(c)}
  else if(a==='csvText'&&c){csvShow=buildCsv(c).replace('\uFEFF','');msg='متن CSV در کادر پایین است.';render(true)}
  else if(a==='gqdraw'&&c){if(GQ.stage==='menu')gqRead();gqDraw(c);GQ.stage='pick';render()}
  else if(a==='gqstart'&&c){gqStart();render()}
  else if(a==='gqshow'){GQ.shown=true;render(true)}
  else if(a==='gqgood'){gqJudge(true);render()}
  else if(a==='gqbad'){gqJudge(false);render()}
  else if(a==='gqback'){GQ.stage='menu';GQ.sel=[];GQ.q=null;render()}
  else if(a==='gqsave'&&c){
    if(!arm(t,'gqs','مطمئنید؟ دوباره بزنید'))return;
    armed=null;var gp=gqPoints();
    if(!c.gquiz)c.gquiz=[];
    c.gquiz.push({id:uid('q'),ts:new Date().toISOString(),ch:GQ.ch,lvl:GQ.lvl,pts:gp,n:GQ.res.length,ok:GQ.res.filter(function(r){return r.ok}).length,res:GQ.res.map(function(r){return{g:r.gid,s:r.sid,ok:r.ok}})});
    save();GQ.stage='menu';GQ.sel=[];GQ.q=null;msg='امتیاز پرسش گروهی در لیگ گروهی ثبت شد.';render();
  }
  else if(a==='gqdel'&&c){if(!arm(t,'gd'+id,'مطمئنید؟ دوباره بزنید'))return;armed=null;c.gquiz=(c.gquiz||[]).filter(function(x){return x.id!==id});save();msg='سابقه حذف شد.';render(true)}
  else if(a==='pwRand'&&c){c.pwd=c.pwd||{};c.students.forEach(function(s2){var e=document.getElementById('pw_'+s2.id),v=normPw(e?e.value:'');if(!v)v=pwRand();c.pwd[s2.id]=v});save();msg='رمزها ثبت شد.';render(true)}
  else if(a==='genParent'&&c){
    c.pwd=c.pwd||{};var badp=[];
    c.students.forEach(function(s2){var e=document.getElementById('pw_'+s2.id),v=normPw(e?e.value:'');if(v.length<4)badp.push(s2.name);else c.pwd[s2.id]=v});
    if(badp.length){note('رمز این دانش‌آموزان خالی یا کوتاه‌تر از ۴ حرف یا رقم است: '+badp.slice(0,6).join('، ')+(badp.length>6?' و ...':''));return}
    save();
    var po={rank:document.getElementById('pr').checked,avg:document.getElementById('pa').checked,aw:document.getElementById('pw').checked};
    if(!(window.crypto&&window.crypto.subtle)){note('این مرورگر یا این آدرس از رمزگذاری پشتیبانی نمی‌کند. برنامه را از آدرس https باز کنید.');return}
    var cards=parentCards(c,po),pbase=siteBase()+'karname.html#';PL={};
    (async function(){
      try{
        for(var ii=0;ii<cards.length;ii++){note('در حال ساخت لینک‌ها: '+fa(ii+1)+' از '+fa(cards.length));var cd=await encObj(cards[ii].obj,c.pwd[cards[ii].id]);PL[cards[ii].id]={name:cards[ii].name,link:pbase+cd,pw:c.pwd[cards[ii].id]}}
        msg='لینک‌ها ساخته شد: '+fa(cards.length)+' دانش‌آموز.';render(true);
      }catch(e){note('ساخت لینک‌ها ناموفق بود.')}
    })();
  }
  else if(a==='cpPar'&&c&&PL[id]){copyText(pmsg(c,PL[id])).then(function(ok){note(ok?'پیام کپی شد ✅ حالا در پیام خصوصی بچسبانید.':'کپی خودکار ممکن نشد.')})}
  else if(a==='bdMake'&&c){
    BD.month=val('bdm')||BD.month;
    var bsel={c:{},s:{},i:{}},bn={c:[],s:[],i:[]};
    c.students.forEach(function(s2){[['c','bc_'],['s','bs_'],['i','bi_']].forEach(function(k2){var e=document.getElementById(k2[1]+s2.id);if(e&&e.checked){bsel[k2[0]][s2.id]=1;bn[k2[0]].push(s2.name)}})});
    BD.sel=bsel;
    if(!bn.c.length&&!bn.s.length&&!bn.i.length){note('حداقل یک نفر را برای تابلو تأیید کنید (تیک بزنید).');return}
    var bdata={v:1,m:BD.month,s:c.school||'',c:c.name,t:c.teacher||'',d:new Date().toLocaleDateString('fa-IR'),cond:bn.c,study:bn.s,impr:bn.i};
    BD.link=siteBase()+'karname.html#B1.'+u8b64(new TextEncoder().encode(JSON.stringify(bdata)));
    BD.text=boardText(c,bdata,BD.link);msg='تابلو ساخته شد. متن زیر را کپی کنید.';render(true);
  }
  else if(a==='cpBd'){copyText(BD.text).then(function(ok){note(ok?'متن کپی شد ✅':'کپی خودکار ممکن نشد.')})}
  else if(a==='cpBdLink'){copyText(BD.link).then(function(ok){note(ok?'لینک کپی شد ✅':'کپی خودکار ممکن نشد.')})}
  else if(a==='pchapter'){
    PS.sid=document.getElementById('pstu').value||'';PS.mode=document.getElementById('pmode').value;PS.n=Number(document.getElementById('pcnt').value);
    pr={stage:'chapter',ch:id};render();
  }
  else if(a==='pmenu'){pr=null;render()}
  else if(a==='preport'){pr={stage:'report'};render()}
  else if(a==='pstartlv'&&pr){var lsel=document.getElementById('plsn');pStart(pr.ch,Number(id),lsel?lsel.value:'all');render()}
  else if(a==='pcheck'&&pr){
    var v=numS(document.getElementById('pa').value);
    if(v===null||isNaN(v)){note('جواب را به‌صورت عدد بنویسید.');return}
    var okk=Math.abs(v-pr.q.ans)<1e-6;pAnswer(okk,v,okk?'':detect(pr.q,v));render();
  }
  else if(a==='ppick'&&pr){
    var sel=pr.q.opts[Number(id)],ok2=String(sel)===String(pr.q.ans);
    pAnswer(ok2,sel,ok2?'':tagFrac(pr.q,sel));render();
  }
  else if(a==='pnext'&&pr){pAdvance();render()}
  else if(a==='pshow'&&pr){pr.shown=true;render(true)}
  else if(a==='pgood'&&pr){pAnswer(true,null,'');pAdvance();render()}
  else if(a==='pbad'&&pr){pAnswer(false,null,pr.q.op==='frac'?'frac':(['add','sub','mul'].indexOf(pr.q.op)>=0?'other':pr.q.op));pAdvance();render()}
  else if(a==='pagain'&&pr){var ch0=pr.ch,lv0=pr.lvl,ls0=pr.ls;pStart(ch0,lv0,ls0);render()}
  else if(a==='pquit'){
    var ch1=pr&&pr.ch;
    if(pr&&pr.stage==='play'&&pr.log.length>0){pr.n=pr.log.length;pFinish()}
    pr=ch1?{stage:'chapter',ch:ch1}:null;render();
  }
  else if(a==='ldraw'){
    ltRead();
    var pool=ltPool(),k=LT.count;