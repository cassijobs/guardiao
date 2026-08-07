/* A Escrita do Guardião — motor original de glifos v3 */
const Escriba=(()=>{
  const ALFABETO="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const papelCache=new Map();
  const CASAS=["Aurora","Caminho","Silêncio","Chama","Água","Montanha","Lua","Horizonte"];
  const SIGNIFICADOS=["origem","passagem","escolha","memória","transformação"];

  function hash(text){
    let h=2166136261>>>0;
    for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
    h^=h>>>13;h=Math.imul(h,0x5bd1e995);h^=h>>>15;
    return h>>>0;
  }
  function rng(seed){
    let s=seed>>>0;
    return()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}
  }
  function limpar(s){return String(s||"").toUpperCase().replace(/[^A-Z0-9-]/g,"").slice(0,20)}
  function casa(codigo){return CASAS[hash(limpar(codigo)+"|CASA")%CASAS.length]}
  function significado(codigo){return SIGNIFICADOS[hash(limpar(codigo)+"|SENTIDO")%SIGNIFICADOS.length]}
  function assinatura(codigo,estilo){
    const n=hash(limpar(codigo)+"|"+estilo).toString(16).toUpperCase().padStart(8,"0");
    return n.slice(0,4)+"-"+n.slice(4,8);
  }
  function ruido(n,seed=0){
    const x=Math.sin(n*12.9898+seed*78.233)*43758.5453;
    return (x-Math.floor(x))*2-1;
  }
  function pincel(ctx,pontos,w=5,seed=0){
    if(pontos.length<2)return;
    ctx.save();
    ctx.lineCap="round";ctx.lineJoin="round";
    for(let i=1;i<pontos.length;i++){
      const t=i/(pontos.length-1),ant=pontos[i-1],atu=pontos[i];
      const dx=atu[0]-ant[0],dy=atu[1]-ant[1],len=Math.hypot(dx,dy)||1;
      const nx=-dy/len,ny=dx/len;
      const pressao=.25+Math.pow(Math.sin(Math.PI*t),.72)*1.05;
      const vibracao=ruido(i,seed)*w*.085;
      const x1=ant[0]+nx*vibracao,y1=ant[1]+ny*vibracao;
      const x2=atu[0]+nx*ruido(i+1,seed)*w*.085,y2=atu[1]+ny*ruido(i+1,seed)*w*.085;
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
      ctx.lineWidth=Math.max(.8,w*pressao*(.94+ruido(i,seed+9)*.08));ctx.stroke();
    }
    // pequenos depósitos de tinta, como numa pena que desacelera
    for(const f of [.28,.71]){
      const k=Math.max(1,Math.min(pontos.length-1,Math.floor(f*(pontos.length-1))));
      const p=pontos[k];ctx.save();ctx.globalAlpha*=.12;
      ctx.beginPath();ctx.arc(p[0],p[1],w*(.35+Math.abs(ruido(k,seed))* .18),0,Math.PI*2);ctx.fill();ctx.restore();
    }
    ctx.restore();
  }
  function linha(ctx,a,b,w=5){
    const passos=Math.max(18,Math.min(48,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/13)));
    const seed=Math.round(a[0]*3+a[1]*5+b[0]*7+b[1]*11);
    const pts=[];
    for(let i=0;i<=passos;i++){
      const t=i/passos,e=t*t*(3-2*t);
      const x=a[0]+(b[0]-a[0])*e,y=a[1]+(b[1]-a[1])*e;
      pts.push([x,y]);
    }
    pincel(ctx,pts,w,seed);
  }
  function curva(ctx,a,c,b,w=5){
    const passos=36,seed=Math.round(a[0]*3+c[0]*5+b[0]*7+a[1]*11+c[1]*13+b[1]*17),pts=[];
    for(let i=0;i<=passos;i++){
      const t=i/passos,u=1-t;
      pts.push([u*u*a[0]+2*u*t*c[0]+t*t*b[0],u*u*a[1]+2*u*t*c[1]+t*t*b[1]]);
    }
    pincel(ctx,pts,w,seed);
  }
  function arco(ctx,cx,cy,r,ini,fim,w=5){
    const passos=Math.max(22,Math.round(Math.abs(fim-ini)*r/13));
    const seed=Math.round(cx*3+cy*5+r*7+ini*101+fim*137),pts=[];
    for(let i=0;i<=passos;i++){
      const t=i/passos,a=ini+(fim-ini)*t;
      const rr=r+ruido(i,seed)*w*.055;
      pts.push([cx+Math.cos(a)*rr,cy+Math.sin(a)*rr]);
    }
    pincel(ctx,pts,w,seed);
  }
  function ponto(ctx,x,y,r=5){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}

  /* Cada caractere escolhe uma família de operações geométricas.
     Não é uma fonte: é uma gramática de construção. */
  function planoGlifo(char,tamanho=100){
    const idx=Math.max(0,ALFABETO.indexOf(char));
    const R=rng(hash("GLIFO|"+char));
    const ops=[];
    const S=tamanho/100;
    const P=(x,y)=>[(x-50)*S,(y-50)*S];
    const bits=(idx+1)*2654435761>>>0;
    const haste=38+((bits>>>1)%15);
    const topo=10+((bits>>>5)%16);
    const baixo=82-((bits>>>9)%13);
    const esquerda=13+((bits>>>13)%17);
    const direita=87-((bits>>>17)%18);
    const centroX=42+((bits>>>21)%18);
    const centroY=42+((bits>>>25)%18);

    // espinha principal — inclinada de forma própria para cada família
    ops.push(["l",P(centroX+(R()-.5)*8,topo),P(50-centroX/6+(R()-.5)*8,baixo),(5.5+R()*2.5)*S]);

    // braços diferentes à esquerda e à direita; nunca espelhados
    if(bits&1) ops.push(["l",P(centroX,haste),P(esquerda,25+R()*25),(4+R()*2)*S]);
    else ops.push(["q",P(centroX,haste),P(22+R()*15,centroY),P(esquerda,70-R()*15),(4+R()*2)*S]);

    if(bits&2) ops.push(["l",P(centroX+1,centroY),P(direita,35+R()*40),(4.5+R()*2)*S]);
    else ops.push(["q",P(centroX,centroY-5),P(72+R()*17,18+R()*35),P(direita,75-R()*18),(4+R()*2)*S]);

    // travessia ou arco característico
    if(bits&4) ops.push(["l",P(18+R()*12,58+R()*14),P(76+R()*14,45-R()*12),(3.5+R()*2)*S]);
    else ops.push(["a",P(48+R()*8,48+R()*8),22+R()*11,-1.7+R()*.5,1.5+R()*1.5,(3.5+R()*2)*S]);

    // corte de identidade
    if(bits&8) ops.push(["l",P(30+R()*15,18+R()*15),P(66+R()*17,84-R()*17),(2.5+R()*2)*S]);
    if(bits&16) ops.push(["p",P(18+R()*64,15+R()*68),(3+R()*3)*S]);
    if(bits&32) ops.push(["p",P(18+R()*64,15+R()*68),(2+R()*2)*S]);
    if(bits&64) ops.push(["a",P(55+R()*10,55-R()*10),12+R()*7,.3+R(),4.2+R(),(2.5+R()*2)*S]);
    return ops;
  }
  function executarOps(ctx,ops){
    for(const op of ops){
      if(op[0]==="l")linha(ctx,op[1],op[2],op[3]);
      else if(op[0]==="q")curva(ctx,op[1],op[2],op[3],op[4]);
      else if(op[0]==="a")arco(ctx,op[1][0],op[1][1],op[2],op[3],op[4],op[5]);
      else if(op[0]==="p")ponto(ctx,op[1][0],op[1][1],op[2]);
    }
  }
  function desenharGlifo(ctx,char,x,y,tam,rot=0,alpha=1,esp=1){
    ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.globalAlpha=alpha;ctx.scale(esp,1);
    executarOps(ctx,planoGlifo(char,tam));
    ctx.restore();
  }
  function papel(ctx,w,h,seed){
    const key=w+"x"+h+"|"+seed;
    let imagem=papelCache.get(key);
    if(imagem){ctx.drawImage(imagem,0,0);return}
    const cv=document.createElement("canvas");cv.width=w;cv.height=h;
    const c=cv.getContext("2d"),R=rng(seed);
    const g=c.createRadialGradient(w*.43,h*.39,w*.05,w*.5,h*.5,w*.8);
    g.addColorStop(0,"#c9aa73");g.addColorStop(.48,"#a98550");g.addColorStop(1,"#674624");
    c.fillStyle=g;c.fillRect(0,0,w,h);
    for(let i=0;i<2600;i++){
      const x=R()*w,y=R()*h,r=.4+R()*2.3;
      c.fillStyle=`rgba(${45+Math.floor(R()*45)},${28+Math.floor(R()*35)},${10+Math.floor(R()*20)},${.012+R()*.055})`;
      c.fillRect(x,y,r,r*(.4+R()*1.4));
    }
    for(let i=0;i<38;i++){
      c.strokeStyle=`rgba(55,34,14,${.018+R()*.025})`;c.lineWidth=.5+R()*2;
      c.beginPath();c.moveTo(R()*w,R()*h);c.quadraticCurveTo(R()*w,R()*h,R()*w,R()*h);c.stroke()
    }
    papelCache.set(key,cv);ctx.drawImage(cv,0,0)
  }

  function construirPlano(codigo,estilo="orbe"){
    codigo=limpar(codigo)||"MKS-7ZKC4";
    const chars=codigo.replace(/-/g,"").split("");
    const seed=hash(codigo+"|"+estilo),R=rng(seed);
    const comandos=[];
    const centro={x:500+(R()-.5)*70,y:495+(R()-.5)*65};
    const tinta="#171006",tinta2="#35220f";
    comandos.push({tipo:"papel",seed});
    comandos.push({tipo:"config",stroke:tinta,fill:tinta});

    if(estilo==="orbe"){
      const rr=286+R()*34;
      comandos.push({tipo:"arco",x:centro.x,y:centro.y,r:rr,a:-2.75+R()*.25,b:1.4+R()*1.15,w:10+R()*5});
      comandos.push({tipo:"arco",x:centro.x-28+R()*45,y:centro.y+15-R()*35,r:rr-48,a:-1.25+R()*.35,b:3.6+R()*.5,w:4+R()*4,cor:tinta2});
    }else if(estilo==="caminho"){
      comandos.push({tipo:"curva",a:[centro.x-68,165+R()*45],c:[centro.x+145-R()*80,460+R()*60],b:[centro.x-30+R()*85,835-R()*45],w:12});
      comandos.push({tipo:"linha",a:[180+R()*60,570-R()*100],b:[790-R()*50,380+R()*170],w:7});
      comandos.push({tipo:"arco",x:centro.x+145,y:centro.y-205,r:72+R()*25,a:-.3,b:4.45,w:7});
    }else{
      const A=[centro.x-190+R()*55,centro.y+210],B=[centro.x-15+R()*50,centro.y-270],C=[centro.x+230,centro.y+40-R()*90];
      comandos.push({tipo:"linha",a:A,b:B,w:11});comandos.push({tipo:"linha",a:B,b:C,w:9});
      comandos.push({tipo:"linha",a:C,b:[A[0]+70,A[1]-35],w:8});
      comandos.push({tipo:"arco",x:centro.x-105,y:centro.y+45,r:82+R()*30,a:.45,b:5.15,w:6});
    }

    // Núcleo: caracteres ligados por relações não simétricas.
    const n=chars.length;
    const pos=[];
    for(let i=0;i<n;i++){
      const baseA=(i/n)*Math.PI*2 + R()*.35;
      const radial=85+(i%3)*65+R()*45;
      let x=centro.x+Math.cos(baseA)*radial+(R()-.5)*55;
      let y=centro.y+Math.sin(baseA)*radial+(R()-.5)*55;
      if(estilo==="caminho"){x=centro.x-120+i*(260/(n-1||1))+(R()-.5)*45;y=225+i*(530/(n-1||1))+(R()-.5)*60}
      if(estilo==="limiar" && i%2){x+=80;y-=45}
      pos.push([x,y]);
      comandos.push({tipo:"glifo",char:chars[i],x,y,tam:(i===0?205:120)+R()*(i===0?45:52),rot:(R()-.5)*1.35,alpha:.92,esp:.82+R()*.35});
    }

    // Caminhos de relação; escolhe apenas algumas conexões, não todas.
    for(let i=0;i<n-1;i++){
      if(R()>.28){
        const a=pos[i],b=pos[i+1],mx=(a[0]+b[0])/2+(R()-.5)*85,my=(a[1]+b[1])/2+(R()-.5)*85;
        comandos.push({tipo:"curva",a,b,c:[mx,my],w:2.5+R()*3,alpha:.65});
      }
    }

    // Aura: marcas pequenas, densidade e quadrantes distintos.
    const aura=12+Math.floor(R()*10);
    for(let i=0;i<aura;i++){
      const a=R()*Math.PI*2,rad=240+R()*150;
      const x=centro.x+Math.cos(a)*rad+(R()-.5)*28,y=centro.y+Math.sin(a)*rad+(R()-.5)*35;
      if(i%4===0)comandos.push({tipo:"ponto",x,y,r:3+R()*6});
      else if(i%3===0)comandos.push({tipo:"arco",x,y,r:10+R()*20,a:R()*1.5,b:3.7+R()*2,w:2+R()*3});
      else comandos.push({tipo:"glifo",char:chars[(i*3+2)%n],x,y,tam:36+R()*36,rot:a+(R()-.5)*1.4,alpha:.62,esp:.85+R()*.3});
    }

    // Quebras/cortes para afastar aspecto computacional perfeito.
    for(let i=0;i<7;i++){
      const x=130+R()*740,y=130+R()*740;
      comandos.push({tipo:"linha",a:[x,y],b:[x+(R()-.5)*75,y+(R()-.5)*75],w:1.5+R()*3,alpha:.55});
    }
    comandos.push({tipo:"codigo",texto:codigo});
    return {codigo,estilo,seed,comandos,assinatura:assinatura(codigo,estilo)};
  }

  function renderizarPlano(ctx,plano,ate=Infinity){
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    let visiveis=0;
    for(const cmd of plano.comandos){
      if(cmd.tipo!=="papel" && cmd.tipo!=="config" && visiveis++>=ate)break;
      if(cmd.tipo==="papel"){papel(ctx,ctx.canvas.width,ctx.canvas.height,cmd.seed);continue}
      if(cmd.tipo==="config"){ctx.strokeStyle=cmd.stroke;ctx.fillStyle=cmd.fill;ctx.lineCap="round";ctx.lineJoin="round";continue}
      ctx.save();ctx.globalAlpha=cmd.alpha??1;ctx.strokeStyle=cmd.cor||"#171006";ctx.fillStyle=cmd.cor||"#171006";
      if(cmd.tipo==="linha")linha(ctx,cmd.a,cmd.b,cmd.w);
      else if(cmd.tipo==="curva")curva(ctx,cmd.a,cmd.c,cmd.b,cmd.w);
      else if(cmd.tipo==="arco")arco(ctx,cmd.x,cmd.y,cmd.r,cmd.a,cmd.b,cmd.w);
      else if(cmd.tipo==="ponto")ponto(ctx,cmd.x,cmd.y,cmd.r);
      else if(cmd.tipo==="glifo")desenharGlifo(ctx,cmd.char,cmd.x,cmd.y,cmd.tam,cmd.rot,cmd.alpha,cmd.esp);
      else if(cmd.tipo==="codigo"){
        ctx.font="700 29px Cinzel, Georgia";ctx.textAlign="right";ctx.fillStyle="#241609";ctx.fillText(cmd.texto,925,944)
      }
      ctx.restore();
    }
  }
  function desenhar(codigo,estilo="orbe",canvas=document.getElementById("selo")){
    const plano=construirPlano(codigo,estilo);
    renderizarPlano(canvas.getContext("2d"),plano);
    return plano;
  }
  function revelar(codigo,estilo="orbe",canvas=document.getElementById("selo"),duracao=2100){
    const plano=construirPlano(codigo,estilo),ctx=canvas.getContext("2d");
    const total=plano.comandos.filter(x=>!["papel","config"].includes(x.tipo)).length;
    const inicio=performance.now();
    return new Promise(resolve=>{
      function frame(agora){
        const p=Math.min(1,(agora-inicio)/duracao);
        const suave=1-Math.pow(1-p,3);
        renderizarPlano(ctx,plano,Math.ceil(total*suave));
        if(p<1)requestAnimationFrame(frame);else resolve(plano)
      }
      requestAnimationFrame(frame)
    })
  }
  function qualidade(canvas=document.getElementById("selo")){
    const c=document.createElement("canvas");c.width=c.height=160;
    const x=c.getContext("2d");x.drawImage(canvas,0,0,160,160);
    const d=x.getImageData(0,0,160,160).data;
    let bordas=0,contraste=0,ocupados=0,quadrantes=[0,0,0,0];
    const lum=(i)=>.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];
    let media=0;for(let i=0;i<d.length;i+=4)media+=lum(i);media/=d.length/4;
    for(let y=1;y<159;y++)for(let xx=1;xx<159;xx++){
      const i=(y*160+xx)*4,L=lum(i),dx=Math.abs(L-lum(i+4)),dy=Math.abs(L-lum(i+160*4));
      contraste+=Math.abs(L-media);if(dx+dy>55)bordas++;if(L<media-28){ocupados++;quadrantes[(xx>=80?1:0)+(y>=80?2:0)]++}
    }
    const balance=Math.min(...quadrantes)/(Math.max(...quadrantes)||1);
    let score=48+Math.min(22,bordas/95)+Math.min(16,contraste/220000)+Math.min(9,ocupados/580)+balance*5;
    return Math.max(55,Math.min(98,Math.round(score)));
  }
  function blob(canvas=document.getElementById("selo")){return new Promise((ok,no)=>canvas.toBlob(b=>b?ok(b):no(new Error("Falha no PNG")),"image/png"))}
  function durl(b){return new Promise((ok,no)=>{const f=new FileReader;f.onload=()=>ok(f.result);f.onerror=no;f.readAsDataURL(b)})}
  function toBlob(u){const[m,b]=u.split(","),mime=m.match(/:(.*?);/)[1],bin=atob(b),a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return new Blob([a],{type:mime})}
  async function criar(c,e){
    // O desenho-base continua em 1000 px para preservar todos os detalhes,
    // mas o arquivo final é reduzido para 512 px, tamanho adequado ao MindAR,
    // aos cartões e à publicação no GitHub.
    const base=document.createElement("canvas");
    base.width=base.height=1000;
    desenhar(c,e,base);
    const saida=document.createElement("canvas");
    saida.width=saida.height=512;
    const ctx=saida.getContext("2d",{alpha:false});
    ctx.imageSmoothingEnabled=true;
    ctx.imageSmoothingQuality="high";
    ctx.drawImage(base,0,0,512,512);
    return durl(await blob(saida));
  }
  function desenharAmostra(canvas,char){canvas.width=canvas.height=150;const ctx=canvas.getContext("2d");papel(ctx,150,150,hash("AMOSTRA"+char));ctx.strokeStyle=ctx.fillStyle="#171006";ctx.lineCap="round";ctx.lineJoin="round";desenharGlifo(ctx,char,75,75,105,(hash(char)%19-9)/80,1,.95)}
  return{ALFABETO,CASAS,SIGNIFICADOS,limpar,casa,significado,assinatura,construirPlano,desenhar,revelar,qualidade,blob,durl,toBlob,criar,desenharAmostra}
})();