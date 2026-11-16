/* Edward's workbench. Coordinates are pixels in the original 1024 × 1536 painting. */
(() => {
  "use strict";
  const artBase = new URL('assets/', edwardSceneRoot);
  const art = name => new URL(name + '.webp', artBase).href;
  const ing = {
    acqua: {file:'water', label:['Acqua','Water'], liquid:true, rgb:[65,176,221], tip:[.99,.54]},
    aceto: {file:'vinegar', label:['Aceto','Vinegar'], liquid:true, rgb:[223,179,68], tip:[.99,.54]},
    bicarbonato: {file:'bicarbonate', label:['Bicarbonato','Baking soda'], tip:[.99,.62]},
    sale: {file:'salt', label:['Sale','Salt'], tip:[.99,.58]}
  };
  const X=508, FLOOR=967, MOUTH=465;
  const VX=70,VY=190,VW=884,VH=878; // exact crop of the painting, also used by the CSS
  const DUR=2.38, flowStart=.36, flowEnd=1.78, fall=.31;
  const TAU=Math.PI*2, clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const smooth=x=>(x=clamp(x),x*x*(3-2*x));
  const rand=i=>{const n=Math.sin(i*127.1+311.7)*43758.545;return n-Math.floor(n)};
  const rgba=(c,a)=>'rgba('+c.join(',')+','+a+')';
  function circle(c,x,y,r){c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  function ellipse(c,x,y,rx,ry){c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,TAU);c.fill();}
  function curvePath(p) {
    p.moveTo(448,465);p.bezierCurveTo(451,505,450,560,444,578);p.bezierCurveTo(435,605,374,749,322,894);
    p.bezierCurveTo(308,933,313,949,334,958);p.bezierCurveTo(396,986,619,986,683,958);
    p.bezierCurveTo(706,949,710,932,695,892);p.bezierCurveTo(647,758,581,604,573,579);
    p.bezierCurveTo(568,558,568,511,570,465);p.closePath();
  }
  const inside=new Path2D();curvePath(inside);
  function half(y){return y<578?60:Math.min(191,63+(y-578)*.405);}
  function makeFoam(){
    // A seamless, irregular mixture of tiny cream-coloured films and larger reflective cells.
    const s=document.createElement('canvas');s.width=s.height=256;const c=s.getContext('2d');
    c.fillStyle='#e3dfc5';c.fillRect(0,0,256,256);
    for(let i=0;i<780;i++){
      const x=rand(i+3)*256,y=rand(i+905)*256,r=i<142?6+rand(i+61)*9:1.1+rand(i+61)*4.8;
      for(const xx of [x-256,x,x+256])for(const yy of [y-256,y,y+256]){
        if(xx+r<0||xx-r>256||yy+r<0||yy-r>256)continue;
        const g=c.createRadialGradient(xx-r*.3,yy-r*.48,.1,xx,yy,r);
        g.addColorStop(0,'#fffcef');g.addColorStop(.29,'#fcf2d6');g.addColorStop(.66,'#f3e4c7');g.addColorStop(.88,'#cebfa5');g.addColorStop(.96,'#b3b5a7');g.addColorStop(1,'#ede6ce');
        c.fillStyle=g;circle(c,xx,yy,r);
        if(r>5){c.fillStyle='rgba(255,255,255,.88)';ellipse(c,xx-r*.32,yy-r*.45,r*.25,r*.13);}
      }
    }return s;
  }
  // Sample individual reflections from the companion artwork, never the full eruption.
  // Feather out the background in each little cell so the live liquid remains visible.
  let foamTile=null,refStarted=false;const films=[];
  function loadFilms(){
    if(refStarted)return;refStarted=true;
    const pic=new Image();
    pic.onload=()=>{
      for(const [x,y,r] of [[520,688,16.5],[555,730,14.5],[518,609,10.8],[477,736,11.4]]){
        const s=document.createElement('canvas');s.width=s.height=64;const a=s.getContext('2d');
        a.drawImage(pic,x-r,y-r,r*2,r*2,0,0,64,64);
        a.globalCompositeOperation='destination-in';
        const g=a.createRadialGradient(32,32,0,32,32,32);
        g.addColorStop(0,'rgba(0,0,0,.03)');g.addColorStop(.42,'rgba(0,0,0,.12)');g.addColorStop(.67,'rgba(0,0,0,.52)');g.addColorStop(.86,'#000');g.addColorStop(.93,'rgba(0,0,0,.93)');g.addColorStop(1,'transparent');
        a.fillStyle=g;a.fillRect(0,0,64,64);films.push(s);
      }
    };
    pic.src=art('bench-foam');
  }
  function film(c,x,y,r,i,alpha){
    if(!films.length||r<2)return;
    c.save();c.globalAlpha*=alpha;c.drawImage(films[i%films.length],x-r,y-r,r*2,r*2);c.restore();
  }
  GEXP.vulcano=function edwardVolcano(host,onGoal){
    loadFilms();
    const text=(it,en)=>L2(it,en), first=text('L’ampolla è vuota. Che cosa versi per primo?','The flask is empty. What do you pour first?');
    const img=Object.create(null), statusTag=document.createElement('p');
    host.classList.add('ev-lab');
    host.innerHTML='<div class="ev-stage"><img class="ev-bench-photo" alt=""><canvas class="ev-action" aria-hidden="true"></canvas></div><div class="ev-tray g-ingr"></div>';
    const stage=host.querySelector('.ev-stage'), cv=stage.querySelector('canvas'), c=cv.getContext('2d'), photo=stage.firstElementChild;
    photo.src=art('bench');
    statusTag.className='g-status ev-status';statusTag.id='g-status';statusTag.setAttribute('role','status');statusTag.textContent=first;
    stage.after(statusTag);const tray=host.querySelector('.ev-tray');
    Object.entries(ing).forEach(([k,x])=>{
      const b=document.createElement('button');b.type='button';b.className='g-in ev-bottle';b.dataset.k=k;
      const thumb=document.createElement('img');thumb.alt='';thumb.src=art('pour-'+x.file);b.append(thumb);
      const label=document.createElement('span');label.textContent=text(...x.label);b.append(label);tray.append(b);img[k]=thumb;
      b.onclick=()=>start(k);
    });
    const row=document.createElement('div'),empty=document.createElement('button');row.className='g-row';empty.type='button';empty.id='g-empty';empty.className='w-btn ghost';empty.textContent='↺ '+t(GUI.empty);row.append(empty);host.append(row);
    let items=[],level=0,pile=0,colour=[...ing.acqua.rgb],pour=null,rx=null,clock=0,last=0,frame=0,dead=false,reached=false;
    const has=k=>items.includes(k);
    const liquidCount=()=>items.filter(k=>ing[k].liquid).length;
    const say=s=>{statusTag.textContent=s;};
    const buttons=[...tray.querySelectorAll('button')];
    const syncButtons=()=>buttons.forEach(b=>{b.disabled=!!pour;b.classList.toggle('ev-active',b.dataset.k===pour?.k);});
    function start(k){
      if(dead||pour)return;
      if(items.length>=4){say(t(GUI.full));return;}
      const x=ing[k],liqs=liquidCount();
      const targetColour=k==='aceto'||k==='acqua'?
        ((k==='aceto'&&has('acqua'))||(k==='acqua'&&has('aceto'))?[117,192,174]:[...x.rgb]):colour;
      pour={k,at:clock,old:level,target:x.liquid?[.20,.36,.50,.64][liqs]:level,from:[...colour],to:targetColour,
        oldPile:pile, targetPile:x.liquid||liqs?0:Math.min(1.7,pile+1), reacted:false};
      say(text(x.liquid?'Versi '+x.label[0].toLowerCase()+' nell’ampolla…':'Il '+x.label[0].toLowerCase()+' scende dal cucchiaio…',x.liquid?'Pouring '+x.label[1].toLowerCase()+' into the flask…':x.label[1]+' falls from the spoon…'));
      syncButtons();wake();
    }
    function beginReaction(k){
      if(rx) return;
      if(!((k==='aceto'&&has('bicarbonato'))||(k==='bicarbonato'&&has('aceto'))))return;
      rx={at:clock,goal:false,boost:0};
      say(k==='aceto'
        ?text('FSSSS! L’aceto cade sulla polvere tutta insieme e la schiuma sale di colpo: è nato un gas!','FSSSS! The vinegar hits all the powder at once and the foam shoots up: a gas is born!')
        :text('FSSSS! Appena la polvere tocca l’aceto partono le bolle: è nato un gas!','FSSSS! As soon as the powder touches the vinegar the bubbles start: a gas is born!'));
    }
    function settle(k){
      items.push(k);if(rx){if(!pour.reacted){
        say(text('Ancora un po’ di schiuma: finché ci sono aceto e bicarbonato, il gas continua a nascere.','A little more foam: as long as there is vinegar and baking soda, gas keeps forming.'));
        if(k==='bicarbonato'||k==='aceto'){rx.boost=Math.max(rx.boost,Math.min(8,Math.max(0,clock-rx.at-4.6)));}
      }return;}
      if(k==='acqua')say(has('sale')||has('bicarbonato')?text('La polvere si scioglie nell’acqua e sparisce alla vista. Niente schiuma.','The powder dissolves in the water and vanishes from sight. No foam.'):text('Acqua: tranquilla e trasparente. E adesso?','Water: calm and clear. What now?'));
      else if(k==='aceto')say(has('sale')?text('Il sale si scioglie nell’aceto. Niente schiuma: non è lui l’ingrediente giusto.','The salt dissolves in the vinegar. No foam: it is not the right ingredient.'):text('Aceto: un acido leggero, dall’odore pungente. Cerca chi lo fa arrabbiare!','Vinegar: a mild acid with a sharp smell. Find what sets it off!'));
      else if(k==='sale')say(liquidCount()?text('Il sale si scioglie e basta. Nessuna reazione.','The salt just dissolves. No reaction.'):text('Un mucchietto di sale sul fondo. Serve un liquido.','A little heap of salt at the bottom. It needs a liquid.'));
      else say(liquidCount()?text('Il bicarbonato si scioglie nell’acqua. Niente schiuma: l’acqua non è un acido.','The baking soda dissolves in the water. No foam: water is not an acid.'):text('Bicarbonato: una polverina bianca sul fondo. Che cosa gli versi sopra?','Baking soda: a white powder at the bottom. What do you pour on it?'));
    }
    empty.onclick=()=>{
      items=[];pour=rx=null;level=pile=0;colour=[...ing.acqua.rgb];syncButtons();
      say(text('Ampolla pulita. Riprova con un’altra coppia!','Clean flask. Try another pair!'));wake();
    };
    function resize(){
      const w=stage.clientWidth||360,r=Math.min(window.devicePixelRatio||1,2);
      cv.width=Math.round(w*r);cv.height=Math.round(w*VH/VW*r);
      c.setTransform(cv.width/VW,0,0,cv.height/VH,-VX*cv.width/VW,-VY*cv.height/VH);
      draw();
    }
    function drawLiquid(surface,impact){
      if(level<.0001)return;
      const w=half(surface),depth=FLOOR-surface,ry=Math.min(18,depth*.5),wave=impact*4*Math.sin(clock*13);
      c.save();c.clip(inside);
      const dye=c.createLinearGradient(X,surface,X,FLOOR+16);
      dye.addColorStop(0,rgba(colour,.34));dye.addColorStop(.42,rgba(colour,.57));dye.addColorStop(1,rgba(colour,.8));
      c.beginPath();c.moveTo(X-w-3,surface);c.bezierCurveTo(X-w*.65,surface+ry+wave,X+w*.53,surface+ry-wave,X+w+3,surface);
      c.lineTo(728,1000);c.lineTo(285,1000);c.closePath();c.fillStyle=dye;c.fill();
      const top=c.createLinearGradient(X-w,surface-ry,X+w,surface+ry);top.addColorStop(0,rgba(colour,.75));top.addColorStop(.44,'rgba(236,252,245,.43)');top.addColorStop(.60,rgba(colour,.68));top.addColorStop(1,'rgba(237,252,248,.65)');
      c.fillStyle=top;ellipse(c,X,surface,w,ry);c.strokeStyle='rgba(225,253,248,.84)';c.lineWidth=2.8;c.stroke();
      if(impact>.02){c.strokeStyle='rgba(245,255,252,'+(.65*impact)+')';for(let j=0;j<3;j++){const f=(clock*1.65+j/3)%1;c.lineWidth=3*(1-f)+.5;c.beginPath();c.ellipse(X+8,surface,4+w*.67*f,1+ry*.9*f,0,0,TAU);c.stroke();}}
      c.restore();
    }
    function drawPile(q){
      if(q<.006)return;
      const w=88*Math.pow(q,.6),h=34*Math.sqrt(q);
      c.save();c.clip(inside);
      const shade=c.createLinearGradient(X,955-h,X,966);shade.addColorStop(0,'#fffdea');shade.addColorStop(.62,'#f2f0de');shade.addColorStop(1,'#a4ada7');c.fillStyle=shade;
      c.beginPath();c.moveTo(X-w,955);c.bezierCurveTo(X-w*.5,954,X-w*.33,958-h,X-2,954-h);c.bezierCurveTo(X+w*.35,952-h,X+w*.42,951,X+w,955);c.bezierCurveTo(X+w*.65,970,X-w*.77,971,X-w,955);c.fill();
      for(let j=0;j<125;j++){const a=(rand(j+20)*2-1),xx=X+a*w*.88,yy=957-h*(1-Math.abs(a))*(rand(j+232));c.fillStyle=j%3?'rgba(255,255,248,.72)':'rgba(103,118,116,.36)';circle(c,xx,yy,1+rand(j+305)*1.6);}
      c.restore();
    }

    function sheen(){
      if(!photo.complete||!photo.naturalWidth)return;
      // Restore the original optical highlights in front of the material, at their painted positions.
      c.save();c.beginPath();c.moveTo(451,485);c.lineTo(457,486);c.bezierCurveTo(463,583,448,604,377,864);c.lineTo(361,906);c.bezierCurveTo(394,751,448,610,450,570);c.closePath();
      c.moveTo(560,483);c.lineTo(568,486);c.lineTo(572,573);c.bezierCurveTo(590,641,656,782,681,895);c.lineTo(670,900);c.bezierCurveTo(637,770,579,620,564,578);c.closePath();
      c.moveTo(314,941);c.bezierCurveTo(353,974,624,995,700,944);c.lineTo(693,959);c.bezierCurveTo(615,997,361,984,319,956);c.closePath();
      c.clip();c.globalAlpha=.78;c.drawImage(photo,0,0,1024,1536);c.restore();
    }
    function coat(p,y0,y1,shift,alpha=1){
      c.save();c.globalAlpha*=alpha;c.clip(p);
      if(!foamTile)foamTile=makeFoam();
      const pattern=c.createPattern(foamTile,'repeat');
      c.save();c.translate(Math.sin(shift*.72)*2,-shift*14);c.fillStyle=pattern;
      c.fillRect(145,-500+shift*14,790,1650);c.restore();
      const g=c.createLinearGradient(288,y0,690,Math.max(y0+12,y1));
      g.addColorStop(0,'rgba(255,213,141,.31)');g.addColorStop(.35,'rgba(255,254,239,.05)');g.addColorStop(.72,'rgba(124,156,153,.12)');g.addColorStop(1,'rgba(68,101,123,.34)');
      c.fillStyle=g;c.fillRect(130,y0-150,760,y1-y0+350);
      c.restore();
    }
    function grainsAndGas(surface,age){
      if(age<0)return;
      c.save();c.clip(inside);
      const fade=Math.min(smooth(age/.35),1-smooth((age-7.1)/2.8));
      for(let j=0;j<42;j++){
        const f=(age*(.56+.4*rand(j+21))+rand(j+627))%1;
        const y=FLOOR-6-(FLOOR-surface+8)*f;
        const x=X+(rand(j+63)*2-1)*Math.max(40,half(y)-10)+Math.sin(f*11+j)*4.5;
        const r=(1.2+5*rand(j+144))*(.55+f*.7);
        c.strokeStyle='rgba(231,255,252,'+(.67*fade)+')';c.lineWidth=1.9;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();
        c.fillStyle='rgba(255,255,249,'+(.86*fade)+')';ellipse(c,x-r*.3,y-r*.45,r*.36,r*.15);
        if(j%3===0)film(c,x,y,r+.8,j,fade);
      }
      // A few cells stick to the glass, with an effervescent collar left at the meniscus.
      const rest=smooth((age-6.9)/3.8);
      if(rest>.001){
        for(let j=0;j<24;j++){
          const u=.1+.81*rand(j+145),y=surface+(FLOOR-surface)*u,x=X+(rand(j+321)*2-1)*(half(y)-14),r=2+rand(j+49)*6;
          c.strokeStyle='rgba(255,250,218,'+(.43*rest)+')';c.lineWidth=1.5;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();film(c,x,y,r,j,rest);
        }
      }c.restore();
    }
    function foamInside(surface,age){
      const ris=smooth((age-.25)/2.15),subs=smooth((age-6.9)/3.9);
      const top=surface-ris*((surface-MOUTH+11)*(1-subs)+7*subs);
      if(surface-top<.1)return;
      c.save();c.clip(inside);const p=new Path2D(),w=half(top)+13;
      const ripple=x=>top-4+Math.sin(x*.047+clock*2)*3+Math.sin(x*.12-clock*2.1)*2;
      p.moveTo(X-w-2,top+10);for(let j=0;j<=60;j++){const x=X-w+2*w*j/60;p.lineTo(x,ripple(x));}
      p.lineTo(735,surface+8);p.bezierCurveTo(617,surface+26,396,surface+26,281,surface+8);p.closePath();
      coat(p,top,surface+20,age,Math.min(.72,.42+ris*1.0));
      c.save();c.clip(p);
      const volume=c.createLinearGradient(X-w,0,X+w,0);
      volume.addColorStop(0,'rgba(91,66,42,.40)');volume.addColorStop(.15,'rgba(255,212,143,.21)');volume.addColorStop(.32,'rgba(255,251,220,.21)');volume.addColorStop(.6,'rgba(255,255,255,0)');volume.addColorStop(1,'rgba(53,94,106,.37)');
      c.fillStyle=volume;c.fillRect(280,top-15,462,surface-top+49);
      const tint=c.createLinearGradient(0,top,0,surface+9);tint.addColorStop(0,'rgba(255,254,238,.16)');tint.addColorStop(.52,'rgba(243,211,157,.04)');tint.addColorStop(1,'rgba(181,139,71,.35)');
      c.fillStyle=tint;c.fillRect(280,top-15,462,surface-top+49);
      for(let i=0;i<49;i++){
        const v=(rand(i+67)+age*(.14+.09*rand(i+611)))%1,y=surface-(surface-top)*v;
        const x=X+(rand(i+123)*2-1)*half(y)*.97,r=(3+rand(i+599)*8.5)*(.58+.55*v);
        c.strokeStyle='rgba(255,253,226,.57)';c.lineWidth=1.8;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();
        c.fillStyle='rgba(255,254,237,.77)';ellipse(c,x-r*.28,y-r*.53,r*.33,r*.14);
        if(i%2===0)film(c,x,y,r*1.12,i,.89);
      }
      c.restore();
      c.strokeStyle='rgba(255,255,249,.71)';c.lineWidth=2.7;c.beginPath();
      for(let j=0;j<=50;j++){const x=X-w+2*w*j/50;j?c.lineTo(x,ripple(x)):c.moveTo(x,ripple(x));}c.stroke();c.restore();
    }
    function rivulet(age,side,delay,factor,thick,lean,retreat){
      const f=smooth((age-delay)/3.3),p=new Path2D();if(f<=0)return;
      const extent=(482+10*factor)*f,width=thick*(1-retreat*.88);if(width<1)return;
      const point=u=>{
        const y=MOUTH+u*extent;
        const edge=y<575?66:Math.min(195,66+(y-575)*.402);
        const x=X+side*edge*factor+lean+Math.sin(u*5.4+factor)*7*u;
        const w=(width*(1-.40*u)+2*Math.sin(u*19+factor*4)+1.8*Math.sin(u*28-age*1.4))*Math.min(1,(1-u)*3.8+.19);
        return {x,y,w};
      };
      for(let i=0;i<=42;i++){const z=point(i/42);i?p.lineTo(z.x-z.w,z.y):p.moveTo(z.x-z.w,z.y);}
      const b=point(1);p.quadraticCurveTo(b.x,b.y+b.w*1.4,b.x+b.w,b.y);
      for(let i=42;i>=0;i--){const z=point(i/42);p.lineTo(z.x+z.w,z.y);}p.closePath();
      c.save();c.shadowColor='rgba(43,43,32,.44)';c.shadowBlur=5;c.shadowOffsetX=3;c.shadowOffsetY=4;c.fillStyle='#bed0c0';c.fill(p);c.restore();coat(p,MOUTH,b.y,age);
      c.save();c.clip(p);
      for(let i=0;i<35;i++){
        const aa=point(i/35),bb=point((i+1)/35);const g=c.createLinearGradient(aa.x-aa.w,aa.y,aa.x+aa.w,aa.y);
        g.addColorStop(0,'rgba(112,82,61,.28)');g.addColorStop(.26,'rgba(255,234,189,.20)');g.addColorStop(.56,'rgba(255,255,247,.25)');g.addColorStop(1,'rgba(57,83,85,.4)');
        c.fillStyle=g;c.fillRect(aa.x-aa.w-16,aa.y,aa.w*2+35,bb.y-aa.y+.6);
      }
      c.strokeStyle='rgba(255,255,239,.53)';c.lineWidth=2.4;c.beginPath();
      for(let i=0;i<40;i++){const z=point(i/40);i?c.lineTo(z.x-z.w*.65,z.y):c.moveTo(z.x-z.w*.65,z.y);}c.stroke();c.restore();
    }
    function foamOuter(age){
      const rise=smooth((age-2.15)/1.16),retreat=smooth((age-7.0)/4.1),energy=rise*(1-retreat);
      if(energy<.001)return;
      const pool=smooth((age-5.2)/1.7)*(1-retreat);
      if(pool>0){const p=new Path2D();
        for(let i=0;i<=88;i++){const a=TAU*i/88,r=(1+.07*Math.sin(a*8+.16*age)+.05*Math.sin(a*15));const x=434+Math.cos(a)*(78+105*pool)*r,y=964+Math.sin(a)*(13+28*pool)*r;i?p.lineTo(x,y):p.moveTo(x,y);}p.closePath();coat(p,924,1009,age,.93*pool);}
      rivulet(age,-1,2.53,1.01,27,-3,retreat);rivulet(age,1,2.78,.91,22,2,retreat);
      rivulet(age,-1,3.34,.55,13,2,retreat);rivulet(age,1,3.93,.43,10,-1,retreat);
      const w=63+49*energy,h=88*energy+2,p=new Path2D();
      // Bubbling crown: the contour swells from the mouth and feeds the same continuous falls.
      for(let i=0;i<=110;i++){
        const a=Math.PI+i*Math.PI/110;
        const lumps=1+(.08*Math.sin(a*8+Math.sin(age*2)*.8)+.045*Math.cos(a*14-age*.7)+.024*Math.sin(a*26+age))*energy;
        const x=X+Math.cos(a)*w*lumps,y=MOUTH+Math.sin(a)*h*lumps;i?p.lineTo(x,y):p.moveTo(x,y);
      }
      p.bezierCurveTo(X+w*.9,MOUTH+22*energy,X+58,MOUTH+18*energy,X+39,MOUTH+14*energy);
      p.bezierCurveTo(X-15,MOUTH+28*energy,X-76,MOUTH+14*energy,X-w,MOUTH);p.closePath();
      c.save();c.shadowColor='rgba(37,56,47,.35)';c.shadowBlur=5;c.shadowOffsetY=4;c.fillStyle='#dce0cb';c.fill(p);c.restore();coat(p,MOUTH-h-12,MOUTH+24,age);
      c.save();c.clip(p);
      const round=c.createRadialGradient(X-w*.21,MOUTH-h*.78,1,X+w*.12,MOUTH-h*.4,w*1.13);
      round.addColorStop(0,'rgba(255,251,225,.45)');round.addColorStop(.5,'rgba(255,234,198,.07)');round.addColorStop(.84,'rgba(124,104,81,.21)');round.addColorStop(1,'rgba(74,83,85,.53)');
      c.fillStyle=round;c.fillRect(X-w*1.3,MOUTH-h*1.27,w*2.6,h*1.6);
      const shade=c.createLinearGradient(0,MOUTH-h,0,MOUTH+19);
      shade.addColorStop(0,'rgba(255,250,219,.26)');shade.addColorStop(.65,'rgba(255,246,213,0)');shade.addColorStop(1,'rgba(139,96,63,.38)');
      c.fillStyle=shade;c.fillRect(X-w*1.3,MOUTH-h*1.27,w*2.6,h*1.6);c.restore();
      // Slow, transparent bubbles at the surface catch the gold lamp and the blue window.
      for(let j=0;j<24;j++){
        const ac=Math.PI*(1+(j+.2)/24),wobble=.5+.5*Math.sin(age*1.9+j*1.8);
        const xx=X+Math.cos(ac)*w*(.9+.08*rand(j+55)),yy=MOUTH+Math.sin(ac)*h*(.91+.08*wobble),rr=(4+rand(j+465)*12)*energy*(.82+wobble*.18);
        if(rr<1.5)continue;
        const g=c.createRadialGradient(xx-rr*.3,yy-rr*.43,0,xx,yy,rr);
        g.addColorStop(0,'rgba(255,255,246,.66)');g.addColorStop(.3,'rgba(249,234,191,.28)');g.addColorStop(.72,'rgba(225,233,214,.20)');g.addColorStop(.9,'rgba(155,151,122,.62)');g.addColorStop(1,'rgba(250,249,222,.85)');
        c.fillStyle=g;circle(c,xx,yy,rr);c.fillStyle='rgba(255,255,251,.91)';ellipse(c,xx-rr*.32,yy-rr*.48,rr*.28,rr*.12);
        film(c,xx,yy,rr*1.02,j,.92);
      }
      for(let j=0;j<16;j++){const f=(age*.69+rand(j+138))%1,x=X+(rand(j+245)*2-1)*(w+13),y=MOUTH-h*(.25+.64*(1-Math.abs(x-X)/w))-Math.sin(f*Math.PI)*36*energy,r=(2+rand(j+226)*4)*(1-f);if(r<1)continue;c.fillStyle='rgba(253,250,226,'+(energy*.83*(1-f))+')';circle(c,x,y,r);}
    }
    function fallbackTool(liquid){
      c.lineJoin='round';c.lineWidth=5;c.strokeStyle='#e4e8dd';
      if(liquid){
        const p=new Path2D();p.moveTo(0,0);p.lineTo(-32,49);p.lineTo(-44,144);p.bezierCurveTo(-46,174,-175,176,-177,138);p.lineTo(-158,3);p.quadraticCurveTo(-103,-14,-67,5);p.closePath();
        const g=c.createLinearGradient(-170,0,-28,0);g.addColorStop(0,'rgba(216,249,250,.7)');g.addColorStop(.25,'rgba(69,121,134,.5)');g.addColorStop(.7,'rgba(164,222,213,.24)');g.addColorStop(1,'rgba(244,255,228,.86)');c.fillStyle=g;c.fill(p);c.stroke(p);
        c.beginPath();c.moveTo(-154,24);c.bezierCurveTo(-234,5,-220,124,-171,120);c.lineWidth=11;c.stroke();
      }else{
        c.beginPath();c.moveTo(-303,-25);c.quadraticCurveTo(-297,-41,-278,-35);c.lineTo(-84,-8);c.bezierCurveTo(-51,-22,-14,-18,0,0);c.bezierCurveTo(-12,21,-65,31,-91,7);c.closePath();
        const g=c.createLinearGradient(0,-16,0,19);g.addColorStop(0,'#887354');g.addColorStop(.35,'#f8e7ba');g.addColorStop(.75,'#b9b2a5');g.addColorStop(1,'#6e655c');c.fillStyle=g;c.fill();c.lineWidth=2;c.stroke();
        c.fillStyle='#f8f4e4';ellipse(c,-48,-2,40,8);
      }
    }
    function drawPour(p,age,surface){
      const x=ing[p.k],liquid=x.liquid,tip=x.tip,fade=smooth(age/.28)*(1-smooth((age-2.03)/.35));
      if(fade<=.001)return;
      const tilt=smooth(age/.47)*(1-smooth((age-1.78)/.45)),ax=482+14*tilt-85*(1-fade),ay=337+12*tilt-27*(1-fade);
      const aim=510,dst=surface-1,head=clamp((age-flowStart)/fall),tail=clamp((age-flowEnd)/fall);
      const point=f=>({x:ax+(aim-ax)*Math.sqrt(f),y:ay+(dst-ay)*f});
      if(head>tail){
        if(liquid){
          const path=new Path2D(),width=f=>(5+3.8*(1-f)+Math.sin(f*25-age*34)*.73)*Math.min(1,(head-tail)*8);
          for(let j=0;j<=28;j++){const f=tail+(head-tail)*j/28,z=point(f);j?path.lineTo(z.x-width(f),z.y):path.moveTo(z.x-width(f),z.y);}
          for(let j=28;j>=0;j--){const f=tail+(head-tail)*j/28,z=point(f);path.lineTo(z.x+width(f),z.y);}path.closePath();
          const gi=c.createLinearGradient(ax-7,ay,aim+6,dst);gi.addColorStop(0,rgba(x.rgb,.94));gi.addColorStop(.5,rgba(x.rgb,.76));gi.addColorStop(1,'rgba(225,252,245,.72)');c.fillStyle=gi;c.fill(path);
          c.beginPath();for(let j=0;j<=28;j++){const f=tail+(head-tail)*j/28,z=point(f);j?c.lineTo(z.x-width(f)*.45,z.y):c.moveTo(z.x-width(f)*.45,z.y);}
          c.lineWidth=2.6;c.strokeStyle='rgba(248,255,249,.9)';c.stroke();
          if(head>=.995&&tail<.92){for(let j=0;j<10;j++){const f=(age*2.9+rand(j+122))%1;c.fillStyle='rgba(230,253,246,'+(1-f)*.75+')';ellipse(c,aim+(rand(j+67)*2-1)*f*47,dst-Math.sin(f*Math.PI)*(9+rand(j+53)*16),2.8,1.7);}}
        } else{
          for(let j=0;j<134;j++){
            const phase=(age-flowStart)/fall+rand(j+16),f0=phase-Math.floor(phase),f=f0*f0;
            if(f<tail||f>head)continue;
            const z=point(f),xx=z.x+(rand(j+133)*2-1)*(6+14*f);
            c.fillStyle=j%4===0?'#b9b8b3':j%3?'#fff8e7':'#e4e9e7';c.save();c.translate(xx,z.y);c.rotate(f*4+j);c.fillRect(-1,-1,2.2+rand(j+145)*3.9,2+rand(j+235)*3.6);c.restore();
          }
        }
      }
      c.save();c.globalAlpha=fade;c.translate(ax,ay);c.rotate((liquid?0.68:0.43)*tilt-(1-tilt)*.12);
      const pic=img[p.k];
      if(pic.complete&&pic.naturalWidth>0){
        const w=liquid?220:320,h=w*pic.naturalHeight/pic.naturalWidth;
        c.drawImage(pic,-w*tip[0],-h*tip[1],w,h);
      }else fallbackTool(liquid);
      c.restore();
    }
    function draw(){
      c.clearRect(VX,VY,VW,VH);
      const a=pour?clock-pour.at:-1,surface=FLOOR-level*(FLOOR-MOUTH);
      const impact=pour?.k&&ing[pour.k].liquid?smooth((a-flowStart-fall)/.17)*(1-smooth((a-flowEnd-fall)/.33)):0;
      drawLiquid(surface,impact);drawPile(pile);
      if(rx){const age=Math.max(0,clock-rx.at-rx.boost);grainsAndGas(surface,age);foamInside(surface,age);}
      if(pour)drawPour(pour,a,surface);
      if(level>.002||pile>.002||rx)sheen();
      if(rx)foamOuter(Math.max(0,clock-rx.at-rx.boost));
    }
    function update(now){
      frame=0;if(dead)return;
      const dt=last?Math.min(.09,(now-last)/1000):0;last=now;clock+=dt;
      if(pour){
        const a=clock-pour.at,f=smooth((a-flowStart-fall)/(flowEnd-flowStart));
        level=pour.old+(pour.target-pour.old)*f;pile=pour.oldPile+(pour.targetPile-pour.oldPile)*f;
        colour=pour.from.map((v,i)=>Math.round(v+(pour.to[i]-v)*f));
        if(a>flowStart+fall+.03&&!rx&&!pour.reacted){beginReaction(pour.k);if(rx)pour.reacted=true;}
        if(a>=DUR){settle(pour.k);pour=null;syncButtons();}
      }
      draw();
      // Let the rising column and the first full spill be seen before the original lesson CTA scrolls into view.
      if(rx&&!rx.goal&&clock-rx.at>=5.7){rx.goal=true;if(!reached){reached=true;onGoal();}}
      if(!dead&&(pour||(rx&&clock-rx.at-rx.boost<11.1)))frame=requestAnimationFrame(update);else last=0;
    }
    function wake(){if(!dead&&!frame){last=0;frame=requestAnimationFrame(update);}}
    photo.onload=()=>{if(!dead){resize();wake();}};
    const ro=typeof ResizeObserver==='function'?new ResizeObserver(()=>{if(!dead)resize();}):null;
    if(ro)ro.observe(stage);else window.addEventListener('resize',resize);
    resize();
    return ()=>{dead=true;cancelAnimationFrame(frame);ro?.disconnect();window.removeEventListener('resize',resize);photo.onload=null;};
  };
})();
