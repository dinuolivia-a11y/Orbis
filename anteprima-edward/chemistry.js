/* Painted workbenches for Edward's two other experiments. Loaded after Orbis' game.js. */
(() => {
  'use strict';
  const base = new URL('assets/', document.currentScript?.src || document.baseURI);
  const art = name => new URL(name + '.webp', base).href;
  const sprites=new Map();
  function sprite(name) {
    if(!sprites.has(name)){const im=new Image();im.src=art(name);sprites.set(name,im);}
    return sprites.get(name);
  }
  const clamp = (v, lo=0, hi=1) => Math.max(lo, Math.min(hi,v));
  const ease = v => { v=clamp(v); return v*v*(3-2*v); };
  const mix = (a,b,v) => gMix(a,b,clamp(v));
  const alpha = (hex,a) => hex + Math.round(clamp(a)*255).toString(16).padStart(2,'0');
  const short = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const names = {
    limone:['lemon','Limone','Lemon','#f5de61'], aceto:['vinegar','Aceto','Vinegar','#e8d4a1'],
    acqua:['water','Acqua','Water','#5fbde4'], bicarbonato:['bicarbonate','Bicarbonato','Baking soda','#f6f0df'],
    sapone:['soap','Sapone','Soap','#7bcfcb'], miele:['honey','Miele','Honey','#bf680e',1.4],
    bluacqua:['water','Acqua blu','Blue water','#278bd2',1], olio:['oil','Olio','Oil','#edcc40',.92],
    moneta:['coin','Moneta','Coin','#c78c2b',8], uva:['grape','Acino d’uva','Grape','#8d468c',1.1],
    tappo:['cork','Tappo di sughero','Cork','#b98754',.25]
  };
  const bands = [
    ['rosa','Rosa','Pink','#f04d8a','acido','acidic'],['viola','Viola','Purple','#8448c0','neutro','neutral'],
    ['blu','Blu','Blue','#3f72d9','un po’ basico','slightly basic'],['verde','Verde','Green','#3fae5a','basico','basic']
  ];
  const stops=[[2,'#ee3a5c'],[4.2,'#f04d8a'],[5.6,'#b04fc4'],[7,'#8448c0'],[8.5,'#3f72d9'],[9.3,'#2a9fb0'],[10,'#3fae5a']];
  const band=p=>p<=4.8?0:p<=7.6?1:p<=9.2?2:3;
  function hue(p) {
    for(let i=1;i<stops.length;i++) if(p<=stops[i][0]) return mix(stops[i-1][1],stops[i][1],(p-stops[i-1][0])/(stops[i][0]-stops[i-1][0]));
    return stops.at(-1)[1];
  }
  const configs={
    // Native image coordinates. Crop the work surface identically at every viewport width.
    cavolo:{bg:'bench',crop:[70,190,884,878],cx:508,lip:464,bottom:948,depth:450},
    torre:{bg:'tower',crop:[42,157,940,969],cx:512,lip:395,bottom:1034,depth:590,hw:250}
  };
  function drawFlaskPath(ctx) {
    ctx.beginPath();ctx.moveTo(449,469);ctx.lineTo(449,565);
    ctx.bezierCurveTo(449,601,409,685,323,899);
    ctx.bezierCurveTo(303,945,336,965,401,972);
    ctx.bezierCurveTo(472,985,600,981,650,966);
    ctx.bezierCurveTo(688,956,704,945,691,902);
    ctx.bezierCurveTo(651,795,572,606,568,576);
    ctx.lineTo(568,469);ctx.closePath();
  }
  function controls(keys,isTower) {
    return '<div class="g-ingr ec-controls'+(keys.length===3?' ec-three':'')+'">'+keys.map(key=>{
      const m=names[isTower&&key==='acqua'?'bluacqua':key];
      return '<button type="button" class="g-in" data-k="'+key+'"><img draggable="false" alt="" src="'+art(m[0])+'"><span>'+esc(L2(m[1],m[2]))+'</span></button>';
    }).join('')+'</div>';
  }
  const groups=[
    ['limone','aceto','acqua','bicarbonato','sapone'],['miele','acqua','olio'],['moneta','uva','tappo']
  ];
  function table(host,key) {
    const cfg=configs[key], tower=key==='torre';
    host.classList.add('ed-fx-c');
    host.innerHTML='<figure class="ec-table" role="img"><img alt="" draggable="false"><canvas aria-hidden="true"></canvas>'+(tower?'<ul class="ec-layers" aria-hidden="true"></ul>':'')+'</figure>' + (!tower?'<div class="g-found" id="g-found"></div>':'')+
      '<p class="g-status ec-status" role="status" aria-live="polite" id="g-status"></p>'+
      (tower?'<p class="ec-label">'+esc(L2('Versa un liquido','Pour a liquid'))+'</p>'+controls(groups[1],true)+'<p class="ec-label">'+esc(L2('Lascia cadere un oggetto','Drop an object'))+'</p>'+controls(groups[2],true):controls(groups[0],false))+
      '<div class="g-row"><button type="button" class="w-btn ghost" id="g-empty">↺ '+esc(t(tower?GUI.empty:GUI.fresh))+'</button></div>';
    const figure=host.querySelector('figure'),img=figure.querySelector('img'),cv=figure.querySelector('canvas'),ctx=cv.getContext('2d');
    const [x,y,w,h]=cfg.crop;
    Object.assign(figure.style,{aspectRatio:w+'/'+h});
    figure.setAttribute('aria-label',tower?L2('Cilindro di vetro per la torre dei liquidi','Glass cylinder for the liquid tower'):L2('Ampolla di vetro con succo di cavolo rosso','Glass flask containing red cabbage juice'));
    Object.assign(img.style,{width:(1024/w*100)+'%',height:(1536/h*100)+'%',left:(-x/w*100)+'%',top:(-y/h*100)+'%'});
    img.src=art(cfg.bg);
    const labels=host.querySelector('.ec-layers');
    const status=host.querySelector('#g-status');
    const say=v=>{status.textContent=v;};
    const buttons=[...host.querySelectorAll('.g-in')];
    let paint=()=>false,raf=0,dead=false,scheduled=0,last=0;
    function frame(stamp){
      raf=0;if(dead)return;
      const px=Math.min(2,window.devicePixelRatio||1),width=Math.max(1,Math.round(figure.clientWidth*px)),height=Math.round(width*h/w);
      if(cv.width!==width||cv.height!==height){cv.width=width;cv.height=height;}
      ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,width,height);
      ctx.setTransform(width/w,0,0,height/h,-x*width/w,-y*height/h);
      const dt=Math.min(.08, Math.max(0,(stamp-(last||stamp))/1000)); last=stamp;
      if(paint(stamp/1000,dt)) wake();
    }
    function wake(){if(!dead&&!raf)raf=requestAnimationFrame(frame);}
    const ro=new ResizeObserver(wake);ro.observe(figure);
    const stop=()=>{dead=true;cancelAnimationFrame(raf);clearTimeout(scheduled);ro.disconnect();host.classList.remove('ed-fx-c');};
    const later=(f,ms)=>{clearTimeout(scheduled);scheduled=setTimeout(()=>{ if(!dead&&host.isConnected)f();},ms);};
    const cancel=()=>clearTimeout(scheduled);
    const preload=tower?['honey','pour-water','pour-vinegar','coin','grape','cork']:['lemon','soap','pour-water','pour-vinegar','pour-bicarbonate'];
    preload.forEach(k=>{const im=sprite(k);if(!im.complete)im.addEventListener('load',wake,{once:true});});
    return {cfg,ctx,host,buttons,say,labels,later,cancel,wake,stop,setPaint(fn){paint=fn;wake();}};
  }
  function ellipse(ctx,x,y,rx,ry,col){
    if(rx<=0||ry<=0)return;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
  }
  function fluid(ctx,c,cx,y,bottom,hw,ry,amp,t,opacity=1) {
    if(bottom<=y)return;
    // Old glass is visible through the centre; darker edges and a separate meniscus give it thickness.
    const gr=ctx.createLinearGradient(cx-hw,0,cx+hw,0);
    [[0,mix(c,'#251624',.48),.96],[.13,mix(c,'#fff1cd',.23),.88],[.37,c,.82],[.67,mix(c,'#210e39',.09),.79],[.87,mix(c,'#fff5ba',.24),.85],[1,mix(c,'#3c1a16',.4),.94]].forEach(([p,v,a])=>gr.addColorStop(p,alpha(v,a*opacity)));
    ctx.beginPath();ctx.moveTo(cx-hw-3,bottom);ctx.lineTo(cx-hw-3,y);
    for(let i=0;i<=40;i++){const f=i/40;ctx.lineTo(cx-hw-3+f*(hw*2+6),y+Math.sin(f*7+t*7)*amp);}
    ctx.lineTo(cx+hw+3,bottom);ctx.closePath();ctx.fillStyle=gr;ctx.fill();
    const surface=ctx.createLinearGradient(0,y-ry,0,y+ry);
    surface.addColorStop(0,alpha(mix(c,'#ffc79e',.39),.88*opacity));surface.addColorStop(.5,alpha(c,.77*opacity));surface.addColorStop(1,alpha(mix(c,'#e9ffe9',.49),.95*opacity));
    ellipse(ctx,cx,y,hw,ry,surface);
    ctx.beginPath();ctx.ellipse(cx,y,hw,ry,0,.13,2.75);ctx.strokeStyle=alpha('#fff4d2',.72*opacity);ctx.lineWidth=2.1;ctx.stroke();
  }
  function streams(ctx,m,k,p,cfg,surface,t,impact) {
    // Spout and stream share one anchor through the whole tipping movement.
    const isPowder=k==='bicarbonato',cx=cfg.cx,lip=cfg.lip;
    const arrive=ease(p/.2), retreat=ease((p-.76)/.24), tilt=arrive*(1-retreat);
    const mouthX=cx+19+(1-arrive+retreat)*125, mouthY=lip-43-(1-arrive+retreat)*44;
    const start=.15,end=.83,head=clamp((p-start)/.14),tail=clamp((p-.71)/.12);
    const hit=Math.min(1,head*1.02);
    const targetX=cx-13, targetY=surface;
    const point=f=>({x:mouthX+(targetX-mouthX)*Math.sqrt(f),y:mouthY+(targetY-mouthY)*f});
    if(p>start&&p<end){
      if(isPowder){
        for(let i=0;i<75;i++){
          const f=(p*2.85+(i*.6180339)%1)%1;if(f>head||f<tail)continue;
          const v=point(f),noise=Math.sin(i*58.7)*(.3+f)*15,rad=1.4+((i*17)%7)*.4;
          ellipse(ctx,v.x+noise,v.y,rad,rad*.82,i%5===0?'#b9a99e':'#fffbed');
        }
      }else{
        const c=m[3];ctx.lineCap='round';const thick=k==='miele'?10:k==='olio'||k==='sapone'?8:7;
        for(const [lw,col,off] of [[thick+3,alpha(mix(c,'#654a45',.3),.76),0],[thick,alpha(c,.96),0],[2.5,'#fff4c5df',-2]]){
          ctx.beginPath();
          for(let i=0;i<=24;i++){const f=tail+(head-tail)*i/24,v=point(f);const xx=v.x+off+Math.sin(f*11+t*9)*1.5,yy=v.y;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}
          ctx.lineWidth=lw;ctx.strokeStyle=col;ctx.stroke();
        }
        if(hit>.9&&tail<.99){for(let i=0;i<5;i++){const f=(t*2+i*.16)%1;ellipse(ctx,targetX+(i-2)*f*8,targetY-5-Math.sin(f*Math.PI)*12,(1-f)*3+1,(1-f)*3+1,alpha(c,.75));}}
      }
      if(hit>.85&&impact){ctx.beginPath();ctx.ellipse(targetX,targetY+2,9+Math.sin(t*12)*4,2.5,0,0,Math.PI*2);ctx.strokeStyle='#fff6d79b';ctx.lineWidth=1.7;ctx.stroke();}
    }
    ctx.save();ctx.translate(mouthX,mouthY);ctx.globalAlpha=clamp(Math.min(p/.08,(1-p)/.11));
    // A cutout has a measured opening. Pivot around it, and keep the beginning of the stream attached.
    const sources={
      acqua:['pour-water',177,.985,.52,1,.7],aceto:['pour-vinegar',177,.985,.52,1,.7],olio:['pour-vinegar',177,.985,.52,1,.7],
      miele:['honey',103,.14,.06,0,1.81],bicarbonato:['pour-bicarbonate',184,.975,.59,1,.46],
      limone:['lemon',105,.085,.69,0,.72],sapone:['soap',93,.015,.105,0,0]
    };
    const [imageName,w,ax,ay,flip,angle]=sources[k],im=sprite(imageName);
    if(im.complete && im.naturalWidth){
      const h=w*im.naturalHeight/im.naturalWidth;
      ctx.rotate(-angle*tilt);ctx.scale(flip?-1:1,k==='limone'?1-.1*Math.sin(Math.PI*tilt):1);
      ctx.drawImage(im,-ax*w,-ay*h,w,h);ctx.restore();return;
    }
    ctx.rotate(isPowder?-.2-.35*tilt:-.18-1.96*tilt);
    if(isPowder){
      const metal=ctx.createLinearGradient(0,-35,0,3);metal.addColorStop(0,'#535b5f');metal.addColorStop(.4,'#ecf0e7');metal.addColorStop(.6,'#82979a');metal.addColorStop(1,'#3d5258');
      ctx.save();ctx.rotate(-.47);ctx.fillStyle=metal;ctx.beginPath();ctx.roundRect(39,-21,105,9,5);ctx.fill();ctx.restore();
      ellipse(ctx,27,-8,34,15,metal);ellipse(ctx,25,-10,25,9,'#919b98');
      if(p<.72){const r=1-ease((p-.15)/.58);ellipse(ctx,23,-14,23*r+2,10*r+1,'#f8f2e4'); for(let i=0;i<14;i++)ellipse(ctx,23+Math.sin(i*11)*18*r,-15+Math.cos(i*6.2)*6*r,1.5,1.2,'#c9c0ac');}
    }else{
      const vessel=new Path2D('M 0 0 L 10 8 L 10 27 Q 5 41 0 52 L -1 96 Q 0 110 16 111 L 49 111 Q 61 110 60 96 L 56 51 Q 54 40 38 29 L 34 4 L 36 -2 Z');
      const glass=ctx.createLinearGradient(0,0,56,0);glass.addColorStop(0,'#ceeef6df');glass.addColorStop(.17,'#68a8acd4');glass.addColorStop(.42,'#deded84d');glass.addColorStop(.72,'#5368738a');glass.addColorStop(1,'#e5faf2d4');ctx.fillStyle=glass;ctx.fill(vessel);
      ctx.save();ctx.clip(vessel);const mcol=m[3];ctx.fillStyle=alpha(mcol,.81);ctx.beginPath();ctx.moveTo(-12,8+p*41);ctx.lineTo(76,39+p*54);ctx.lineTo(76,117);ctx.lineTo(-12,118);ctx.closePath();ctx.fill();ctx.restore();
      ctx.lineWidth=3;ctx.strokeStyle='#eff3dd';ctx.stroke(vessel);ctx.lineWidth=2;ctx.strokeStyle='#ffffffc4';ctx.beginPath();ctx.moveTo(4,88);ctx.lineTo(5,60);ctx.quadraticCurveTo(9,40,15,33);ctx.stroke();
      ctx.beginPath();ctx.moveTo(-2,0);ctx.lineTo(36,-2);ctx.lineWidth=6;ctx.strokeStyle='#89baba';ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle='#fff9db';ctx.stroke();
    }
    ctx.restore();
  }

  function cabbage(host,onGoal) {
    const scene=table(host,'cavolo'),{ctx,cfg,say}=scene, found=new Set([1]);
    const chips=host.querySelector('#g-found');
    let ph=7, level=0, baseCount=0, pouring=null, fizzEnd=0,water=0,goal=false;
    const surface=dose=>cfg.bottom- (.28+dose*.076)*cfg.depth;
    const flaskHW=y=>clamp(59+(y-575)*.388,59,190);
    function foundColours() {
      chips.innerHTML=bands.map(([key,it,en,c,why,whyEn],i)=>'<span class="g-chip'+(found.has(i)?' on':'')+'" style="--ic:'+c+'"><i></i>'+esc(L2(it,en))+(found.has(i)?' <small>'+esc(L2(why,whyEn))+'</small>':'')+'</span>').join('');
    }
    function next(k){
      if(k==='limone')return Math.max(2.2,ph-3);
      if(k==='aceto')return Math.max(3,ph-2.5);
      if(k==='bicarbonato')return ph<8.5?Math.min(8.5,ph+1.6):ph;
      if(k==='sapone')return ph<10?Math.min(10,ph+3):ph;
      return ph+(7-ph)*.15;
    }
    function finish(p) {
      const k=p.key,b=band(p.to),prev=band(ph),B=bands[b],fresh=!found.has(b);
      if(k==='bicarbonato')baseCount++;
      if(k==='limone'||k==='aceto')baseCount=Math.max(0,baseCount-1);
      if(k==='acqua')water++;
      ph=p.to;level++;found.add(b);foundColours();
      const name=L2(B[1],B[2]).toLowerCase(),why=L2(B[4],B[5]);
      if(k==='acqua')say(L2('L’acqua lo rende più chiaro, ma il colore resta quello: non è né acida né basica.','Water makes it paler, but the colour stays: water is neither acidic nor basic.'));
      else if(b===prev)say(p.fizz?L2('Bollicine! Acido e bicarbonato si stanno neutralizzando. Aggiungine ancora per cambiare colore.','Bubbles! Acid and baking soda are neutralising each other. Add more to change the colour.'):L2('Resta '+name+'. Prova un ingrediente diverso, oppure aggiungine ancora.','It stays '+name+'. Try a different ingredient, or add more.'));
      else say((fresh?L2('Nuovo colore! ','New colour! '):'')+L2('Ora è '+name+': il liquido è '+why+'.','Now it is '+name+': the liquid is '+why+'.')+(p.fizz?L2(' E quelle bollicine? Acido e bicarbonato che reagiscono.',' And those bubbles? Acid and baking soda reacting.'):''));
      if(found.size===4&&!goal){goal=true;scene.later(onGoal,850);}
    }
    function select(button){
      if(pouring)return;
      if(level>=5){say(L2('L’ampolla è piena: prendi del succo nuovo. I colori trovati restano.','The flask is full: take some fresh juice. The colours you found are kept.'));return;}
      const key=button.dataset.k,now=performance.now()/1000;
      const fizz=((key==='aceto'||key==='limone')&&baseCount>0&&ph>7)||(key==='bicarbonato'&&ph<6);
      pouring={key,to:next(key),start:now,seconds:short()?.36:1.13,fizz};
      if(fizz)fizzEnd=now+2.75;
      scene.buttons.forEach(b=>{b.disabled=true;});
      button.classList.add('ec-selected');scene.wake();
    }
    scene.buttons.forEach(b=>b.onclick=()=>select(b));
    host.querySelector('#g-empty').onclick=()=>{
      pouring=null;ph=7;level=0;baseCount=0;water=0;fizzEnd=0;
      scene.buttons.forEach(b=>{b.disabled=false;b.classList.remove('ec-selected');});
      say(L2('Succo nuovo, di nuovo viola.','Fresh juice, purple again.'));scene.wake();
    };
    foundColours();
    say(L2('Succo di cavolo rosso: viola. Che cosa aggiungi?','Red cabbage juice: purple. What will you add?'));
    scene.setPaint((time)=>{
      const p=pouring?clamp((time-pouring.start)/pouring.seconds):0;
      const f=pouring?ease((p-.27)/.51):0, y=surface(level+f), hw=flaskHW(y), k=pouring?.key;
      const tint=hue(ph+((pouring?.to??ph)-ph)*ease((p-.29)/.68));
      const color=mix(tint,'#d7e7ff',.04*water+(k==='acqua'?f*.04:0)),amp=pouring&&!short()?Math.sin(p*Math.PI)*3.3:0;
      ctx.save();drawFlaskPath(ctx);ctx.clip();
      // Fill extends to both glass walls; the thin, elliptical meniscus fits the local waist.
      const topBody=y+1;
      const glass=ctx.createLinearGradient(cfg.cx-190,0,cfg.cx+190,0);
      [[0,.46,'#321627'],[.15,.12,'#220e1e'],[.31,.19,'#f1c4ed'],[.54,.07,'#220e1e'],[.84,.12,'#ffe6ca'],[1,.45,'#321627']].forEach(([stop,v,b])=>glass.addColorStop(stop,alpha(mix(color,b,v),.89)));
      ctx.fillStyle=glass;ctx.fillRect(cfg.cx-200,topBody,400,1000-topBody);
      fluid(ctx,color,cfg.cx,y,y+15,hw,clamp(hw*.083,5,17),amp,time);
      if(pouring&&f>.01&&f<.99&&!short()){
        ctx.save();ctx.translate(cfg.cx-7,y+6);const swirl=ctx.createRadialGradient(0,10,0,0,20,58);swirl.addColorStop(0,alpha(hue(pouring.to),.44*Math.sin(f*Math.PI)));swirl.addColorStop(1,alpha(hue(pouring.to),0));ctx.scale(1,.8);ctx.fillStyle=swirl;ctx.fillRect(-80,-2,160,100);ctx.restore();
      }
      if(time<fizzEnd&&!short()){
        for(let i=0;i<21;i++){
          const q=(time*(.42+(i%5)*.037)+i*.619)%1,by=cfg.bottom-6-q*(cfg.bottom-y-7),bx=cfg.cx+Math.sin(i*9.214)*(flaskHW(by)-18)*.85+Math.sin(q*8+i)*3;
          const r=1.5+((i*17)%5)*.82;ctx.beginPath();ctx.arc(bx,by,r,0,Math.PI*2);ctx.strokeStyle=alpha('#fff2db',clamp((fizzEnd-time)*1.4)*.85);ctx.lineWidth=1.6;ctx.stroke();
        }
      }
      // Transmitted warm rim light and two curved reflections on the front of the photographic glass.
      ctx.lineCap='round';ctx.lineWidth=5;ctx.strokeStyle='#fff7d440';ctx.beginPath();ctx.moveTo(336,917);ctx.bezierCurveTo(351,884,367,836,377,813);ctx.stroke();
      ctx.restore();
      if(pouring){
        streams(ctx,names[k],k,p,cfg,y,time,true);
        if(p>=1){const finished=pouring;pouring=null;scene.buttons.forEach(b=>{b.disabled=false;b.classList.remove('ec-selected');});finish(finished);return true;}
      }
      return !!pouring||time<fizzEnd;
    });
    return scene.stop;
  }
  function tower(host,onGoal) {
    const scene=table(host,'torre'),{ctx,cfg,say}=scene, {cx,hw,bottom}=cfg, lh=cfg.depth/3;
    const meta=k=>names[k==='acqua'?'bluacqua':k], density=k=>meta(k)[4],name=k=>L2(meta(k)[1],meta(k)[2]);
    const liquids=new Set(),objects=[],nodes=new Map();
    let pour=null, goal=false, renderedGoal=false;
    function cylinders(time){
      let sum=0;
      return groups[1].filter(k=>liquids.has(k)).sort((a,b)=>density(b)-density(a)).map(key=>{
        const p=pour?.key===key?clamp((time-pour.start)/pour.seconds):1;
        const h=lh*ease((p-.27)/.50),yb=bottom-sum,y=yb-h;sum+=h;
        return {key,h,y,yb};
      });
    }
    function rest(o,layers){
      const r=o.radius,d=density(o.key),contained=layers.filter(l=>l.h>.1),dense=contained.filter(l=>density(l.key)>=d);
      if(!dense.length)return bottom-r*.52;
      const supporting=dense.at(-1),lighter=contained[contained.indexOf(supporting)+1],below=density(supporting.key),above=lighter?density(lighter.key):0;
      // Buoyancy at an interface: the displaced fraction in the denser liquid balances the object.
      const fraction=clamp((d-above)/(below-above));return supporting.y+r*(2*fraction-1)*.83;
    }
    const refresh=()=>scene.buttons.forEach(b=>{
      const k=b.dataset.k;b.disabled=!!pour||liquids.has(k)||objects.some(o=>o.key===k);b.classList.toggle('ec-selected',pour?.key===k);
    });
    function complete(){
      if(!pour&&liquids.size===3&&objects.length===3&&!goal){goal=true;scene.later(()=>{renderedGoal=true;onGoal();},1500);}
    }
    function describe(k){
      const sorted=[...liquids].sort((a,b)=>density(b)-density(a)),i=sorted.indexOf(k),v=name(k);
      say(sorted.length===1?L2(v+': per ora è da solo.',v+': on its own for now.'):
        i===sorted.length-1?L2(v+' resta sopra: è il meno denso.',v+' stays on top: it is the least dense.'):
        L2('Guarda! '+v+' scivola sotto: è più denso di quello che c’era sopra.','Look! '+v+' slides underneath: it is denser than what was above it.'));
    }
    function drop(key){
      const o={key,radius:key==='moneta'?29:32,dx:({moneta:-94,uva:9,tappo:92})[key],y:cfg.lip-66,v:0,fall:true};objects.push(o);
      if(!liquids.size)say(L2('Senza liquidi cade dritto sul fondo. Versa qualcosa e guarda se si sposta!','With no liquid it drops straight to the bottom. Pour something and see if it moves!'));
      else if(key==='moneta')say(L2('La moneta è più densa di tutti i liquidi: va giù fino in fondo.','The coin is denser than every liquid: it goes all the way down.'));
      else if(key==='uva')say(liquids.has('miele')?L2('L’acino affonda nell’olio e nell’acqua, ma il miele è più denso di lui e lo ferma.','The grape sinks through oil and water, but honey is denser than it and stops it.'):L2('L’acino è più denso di acqua e olio: scende fino in fondo. Prova ad aggiungere il miele!','The grape is denser than water and oil: it sinks to the bottom. Try adding honey!'));
      else say(L2('Il sughero è leggerissimo: galleggia sopra a tutto.','Cork is very light: it floats on top of everything.'));
      refresh();complete();scene.wake();
    }
    scene.buttons.forEach(b=>b.onclick=()=>{
      const key=b.dataset.k;if(pour)return;
      if(groups[2].includes(key)){if(!objects.some(o=>o.key===key))drop(key);return;}
      if(liquids.has(key))return;
      pour={key,start:performance.now()/1000,seconds:short()?.36:1.13};liquids.add(key);
      const li=document.createElement('li');li.textContent=name(key);li.style.setProperty('--ec-ink',meta(key)[3]);li.hidden=true;scene.labels.append(li);nodes.set(key,li);
      refresh();scene.wake();
    });
    host.querySelector('#g-empty').onclick=()=>{
      liquids.clear();objects.length=0;pour=null;goal=renderedGoal;scene.cancel();
      scene.labels.replaceChildren();nodes.clear();refresh();
      say(L2('Cilindro vuoto. Prova a versarli in un altro ordine: finiranno uguali?','Empty cylinder. Try pouring them in a different order: will they end up the same?'));scene.wake();
    };
    say(L2('Il cilindro è vuoto. Scegli tu da quale liquido cominciare.','The cylinder is empty. You choose which liquid to start with.'));
    scene.setPaint((time,dt)=>{
      const layers=cylinders(time),surface=layers.length?layers.at(-1).y:bottom;
      const p=pour?clamp((time-pour.start)/pour.seconds):0;
      if(layers.some(l=>l.h>.1)){
        ctx.save();
        ctx.beginPath();ctx.moveTo(cx-hw,cfg.lip);ctx.lineTo(cx-hw,bottom);
        ctx.bezierCurveTo(cx-hw,bottom+48,cx+hw,bottom+48,cx+hw,bottom);ctx.lineTo(cx+hw,cfg.lip);ctx.closePath();ctx.clip();
        for(const l of layers){
          const tag=nodes.get(l.key);tag.hidden=l.h<lh*.18;
          tag.style.top=((l.y+l.h*.49-cfg.crop[1])/cfg.crop[3]*100)+'%';
          if(l.h<.1)continue;
          const col=meta(l.key)[3],ry=clamp(l.h*.5,.1,23);
          ellipse(ctx,cx,l.yb,hw,clamp(l.h*.6,.1,32),alpha(mix(col,'#53382d',.22),.9));
          fluid(ctx,col,cx,l.y,l.yb+1,hw,ry,pour&&!short()?2*Math.sin(p*Math.PI):0,time);
        }
        if(pour&&layers.length>1&&p>.28&&p<.81&&!short()){
          // A denser addition leaves a narrowing plume through the existing lighter layers.
          const target=layers.find(l=>l.key===pour.key);
          if(target.y>surface+8){
            const col=meta(pour.key)[3],tail=target.y+6;
            ctx.beginPath();ctx.moveTo(cx-17,surface);
            for(let i=0;i<=14;i++){const q=i/14;ctx.lineTo(cx-13+Math.sin(q*13+time*4)*7+q*4,surface+q*(tail-surface));}
            ctx.strokeStyle=alpha(col,Math.sin((p-.28)/.53*Math.PI)*.75);ctx.lineCap='round';ctx.lineWidth=12;ctx.stroke();
          }
        }
        ctx.restore();
      }
      let moving=false;
      for(const o of objects){
        const target=rest(o,layers),delta=target-o.y;
        if(short()){o.y=target;o.fall=false;}
        else if(o.fall&&o.y<Math.min(target,surface-4)){
          o.v+=2250*dt;o.y=Math.min(target,o.y+o.v*dt);
        }else{
          o.fall=false;o.y+=delta*(1-Math.exp(-(delta>0?4.7:6)*dt));
        }
        if(Math.abs(target-o.y)>.4)moving=true;else o.y=target;
        const x=cx+o.dx,im=sprite(meta(o.key)[0]);ctx.save();ctx.translate(x,o.y);
        if(o.key==='moneta')ctx.rotate(-.35);else if(o.key==='tappo')ctx.rotate(.12);
        if(im.complete&&im.naturalWidth){
          const height=o.radius*2,width=height*im.naturalWidth/im.naturalHeight;
          const h=o.key==='moneta'?height*.61:height;
          ctx.drawImage(im,-width/2,-h/2,width,h);
        }else ellipse(ctx,0,0,o.radius,o.radius*(o.key==='moneta'?.55:1),meta(o.key)[3]);
        ctx.restore();
      }
      if(pour) {
        streams(ctx,meta(pour.key),pour.key,p,cfg,surface,time,true);
        if(p>=1){const key=pour.key;pour=null;refresh();describe(key);complete();return true;}
      }
      return !!pour||moving;
    });
    return scene.stop;
  }
  Object.assign(GEXP,{cavolo:cabbage,torre:tower});
})();
