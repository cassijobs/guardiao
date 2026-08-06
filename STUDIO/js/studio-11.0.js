(()=> {
const KEY="guardiao-studio-v10-publicador";
const TAMANHO_LOTE=25;
const VERSOES={studio:"11.0",ar:"1.0.0",leitor:"1.0.0",app:"1.0.0",schema:1};
const CHAVES_ANTIGAS=["guardiao-studio-v8-publicador","guardiao-studio-v6-publicador","guardiao-studio-v5-publicador","guardiao-studio-v4-escriba"];
const DB_NOME="guardiao-studio-v10-targets";
const DB_STORE="targets";
const DB_STORE_IMAGENS="imagens";
let dados;
function carregarBiblioteca(){
  const chaves=[KEY,...CHAVES_ANTIGAS];
  try{
    for(let i=0;i<localStorage.length;i++){
      const chave=localStorage.key(i);
      if(chave && /guardiao|escriba/i.test(chave) && !chaves.includes(chave)) chaves.push(chave);
    }
  }catch{}
  let melhor=null;
  for(const chave of chaves){
    try{
      const bruto=localStorage.getItem(chave);
      if(!bruto)continue;
      const candidato=JSON.parse(bruto);
      if(Array.isArray(candidato?.artefatos)){
        if(!melhor || candidato.artefatos.length>melhor.artefatos.length) melhor=candidato;
      }
    }catch{}
  }
  if(melhor){
    try{localStorage.setItem(KEY,JSON.stringify({...melhor,versao:10}))}catch{}
    return melhor;
  }
  return {versao:10,artefatos:[]};
}
dados=carregarBiblioteca();
if(!Array.isArray(dados.artefatos))dados={versao:10,artefatos:[]};
// Migração: versões antigas podiam guardar PNGs em base64 no localStorage.
// A partir da versão 10.9, cada PNG original é congelado no IndexedDB e reutilizado
// sem redesenho em exportação, publicação e reconstrução.
dados.artefatos.forEach(a=>{if(a.imagem){a._imagem=a.imagem;delete a.imagem}});
const $=id=>document.getElementById(id);
let revelando=false;
let planoAtual=null;
const targetsManuais=new Map();
let bancoTargetsPromise=null;

function abrirBancoTargets(){
  if(bancoTargetsPromise)return bancoTargetsPromise;
  bancoTargetsPromise=new Promise((resolve,reject)=>{
    if(!("indexedDB" in window)){
      reject(new Error("Armazenamento persistente indisponível neste navegador."));
      return;
    }
    let concluido=false;
    const timer=setTimeout(()=>{
      if(!concluido)reject(new Error("O armazenamento demorou para responder."));
    },3500);
    const finalizar=(fn,valor)=>{
      if(concluido)return;
      concluido=true;
      clearTimeout(timer);
      fn(valor);
    };
    const req=indexedDB.open(DB_NOME,2);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(DB_STORE))db.createObjectStore(DB_STORE,{keyPath:"lote"});
      if(!db.objectStoreNames.contains(DB_STORE_IMAGENS))db.createObjectStore(DB_STORE_IMAGENS,{keyPath:"chave"});
    };
    req.onsuccess=()=>finalizar(resolve,req.result);
    req.onerror=()=>finalizar(reject,req.error||new Error("Não foi possível abrir o armazenamento de targets."));
    req.onblocked=()=>finalizar(reject,new Error("O armazenamento está bloqueado por outra aba do Studio."));
  });
  return bancoTargetsPromise;
}
function assinaturaLote(lote){
  return lote.artefatos.map(a=>`${a.targetIndex}:${a.codigo}`).join("|");
}
async function guardarTargetPersistente(nome,item){
  const db=await abrirBancoTargets();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(DB_STORE,"readwrite");
    tx.objectStore(DB_STORE).put({
      lote:nome,
      nomeArquivo:item.nomeArquivo||item.file?.name||"targets.mind",
      buffer:item.buffer,
      quantidade:item.quantidade,
      assinatura:item.assinatura,
      salvoEm:new Date().toISOString()
    });
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error||new Error("Não foi possível guardar o target."));
  });
}
async function apagarTargetPersistente(nome){
  try{
    const db=await abrirBancoTargets();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(DB_STORE,"readwrite");
      tx.objectStore(DB_STORE).delete(nome);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error);
    });
  }catch(e){console.warn("Não foi possível apagar o target persistente.",e)}
}
async function guardarImagemPersistente(a,dataURL){
  try{
    const db=await abrirBancoTargets();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(DB_STORE_IMAGENS,"readwrite");
      tx.objectStore(DB_STORE_IMAGENS).put({
        chave:a.id||a.codigo,
        codigo:a.codigo,
        estilo:a.estilo,
        dataURL,
        salvoEm:new Date().toISOString()
      });
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error||new Error("Não foi possível guardar a imagem do símbolo."));
    });
  }catch(e){console.warn("Imagem persistente indisponível.",e)}
}
async function carregarImagemPersistente(a){
  try{
    const db=await abrirBancoTargets();
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction(DB_STORE_IMAGENS,"readonly");
      const req=tx.objectStore(DB_STORE_IMAGENS).get(a.id||a.codigo);
      req.onsuccess=()=>{
        const r=req.result;
        if(r && r.codigo===a.codigo && r.estilo===a.estilo && r.dataURL)resolve(r.dataURL);
        else resolve(null);
      };
      req.onerror=()=>reject(req.error);
    });
  }catch{return null}
}
async function apagarImagemPersistente(a){
  try{
    const db=await abrirBancoTargets();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(DB_STORE_IMAGENS,"readwrite");
      tx.objectStore(DB_STORE_IMAGENS).delete(a.id||a.codigo);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error);
    });
  }catch(e){console.warn("Não foi possível apagar a imagem persistente.",e)}
}
async function apagarTodasImagensPersistentes(){
  try{
    const db=await abrirBancoTargets();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction(DB_STORE_IMAGENS,"readwrite");
      tx.objectStore(DB_STORE_IMAGENS).clear();
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error);
    });
  }catch(e){console.warn("Não foi possível limpar as imagens persistentes.",e)}
}

async function carregarTargetsPersistentes(){
  try{
    const db=await abrirBancoTargets();
    const registros=await new Promise((resolve,reject)=>{
      const tx=db.transaction(DB_STORE,"readonly");
      const req=tx.objectStore(DB_STORE).getAll();
      req.onsuccess=()=>resolve(req.result||[]);
      req.onerror=()=>reject(req.error);
    });
    const mapaLotes=new Map(lotes().map(l=>[l.nome,l]));
    for(const r of registros){
      const lote=mapaLotes.get(r.lote);
      if(!lote||r.quantidade!==lote.artefatos.length||r.assinatura!==assinaturaLote(lote)){
        await apagarTargetPersistente(r.lote);
        continue;
      }
      const buffer=r.buffer instanceof ArrayBuffer?r.buffer:r.buffer?.buffer;
      if(!buffer)continue;
      try{
        validarQuantidadeMind(buffer,lote.artefatos.length,lote.nome);
        targetsManuais.set(r.lote,{
          nomeArquivo:r.nomeArquivo||"targets.mind",
          buffer,
          quantidade:r.quantidade,
          assinatura:r.assinatura,
          persistido:true
        });
      }catch{await apagarTargetPersistente(r.lote)}
    }
  }catch(e){console.warn("Targets persistentes indisponíveis.",e)}
}

function dadosCompactos(){
  return {versao:10,artefatos:dados.artefatos.map(a=>{const {_imagem,imagem,...limpo}=a;return limpo})};
}
function save(){
  dados.versao=10;
  const texto=JSON.stringify(dadosCompactos());
  try{localStorage.setItem(KEY,texto)}
  catch(e){
    // Remove a versão antiga inchada e tenta novamente com somente metadados.
    localStorage.removeItem(KEY);
    localStorage.setItem(KEY,texto);
  }
}
const TAMANHO_PNG_SIMBOLO=512;
function carregarImagemDataURL(dataURL){
  return new Promise((resolve,reject)=>{
    const imagem=new Image();
    imagem.onload=()=>resolve(imagem);
    imagem.onerror=()=>reject(new Error("Não foi possível preparar a imagem do símbolo."));
    imagem.src=dataURL;
  });
}
async function otimizarImagemSimbolo(dataURL){
  const imagem=await carregarImagemDataURL(dataURL);
  if(imagem.naturalWidth===TAMANHO_PNG_SIMBOLO && imagem.naturalHeight===TAMANHO_PNG_SIMBOLO)return dataURL;
  const canvas=document.createElement("canvas");
  canvas.width=canvas.height=TAMANHO_PNG_SIMBOLO;
  const ctx=canvas.getContext("2d",{alpha:false});
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality="high";
  ctx.drawImage(imagem,0,0,TAMANHO_PNG_SIMBOLO,TAMANHO_PNG_SIMBOLO);
  return Simbolo.durl(await Simbolo.blob(canvas));
}
async function imagemArtefato(a){
  // Fonte única da verdade: depois de criado, o PNG é congelado no IndexedDB.
  // Exportar símbolos, publicar novo lote e reconstruir o Guardião reutilizam
  // exatamente a mesma imagem, sem redesenhar o símbolo.
  if(a._imagem)return a._imagem;
  const persistida=await carregarImagemPersistente(a);
  if(persistida){a._imagem=persistida;return persistida}
  const criada=await Simbolo.criar(a.codigo,a.estilo);
  const final=await otimizarImagemSimbolo(criada);
  a._imagem=final;
  await guardarImagemPersistente(a,final);
  return final;
}
function toast(t){$("toast").textContent=t;$("toast").className="on";setTimeout(()=>$("toast").className="",2600)}
function numeroLote(nome){
  const n=Number(String(nome||"").match(/(\d+)/)?.[1]||0);
  return Number.isFinite(n)?n:0;
}
function proximoNomeLote(){
  const maior=dados.artefatos.reduce((m,a)=>Math.max(m,numeroLote(a.lote)),0);
  return `lote-${String(maior+1).padStart(3,"0")}`;
}
function organizar(){
  // Migração de bibliotecas antigas: preserva os lotes existentes e só preenche campos ausentes.
  let loteAtual="lote-001", indice=0;
  dados.artefatos.forEach((a,i)=>{
    if(!a.lote){
      a.lote=loteAtual;
      a.targetIndex=indice++;
      if(indice>=TAMANHO_LOTE){loteAtual=`lote-${String(numeroLote(loteAtual)+1).padStart(3,"0")}`;indice=0}
    }
  });
  const grupos={};
  dados.artefatos.forEach(a=>(grupos[a.lote]??=[]).push(a));
  Object.values(grupos).forEach(arr=>arr.forEach((a,i)=>a.targetIndex=i));
  invalidarTargetsManuaisIncompativeis();
  save();
}
function lotes(){
  const m={};
  dados.artefatos.forEach(a=>(m[a.lote]??=[]).push(a));
  return Object.entries(m).sort((a,b)=>numeroLote(a[0])-numeroLote(b[0])).map(([nome,artefatos])=>({nome,artefatos:artefatos.sort((a,b)=>a.targetIndex-b.targetIndex)}));
}
function novoCodigo(){
  const A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes=new Uint32Array(5);crypto.getRandomValues(bytes);
  return "MKS-"+Array.from(bytes,(n,i)=>A[n%A.length]).join("");
}
function nomeEstilo(v){return{orbe:"Orbe Partido",caminho:"Caminho Velado",limiar:"Limiar Aberto"}[v]||v}
function tituloCasa(c){return "Casa da "+c}
function primeiraMaiuscula(t){return String(t||"").charAt(0).toUpperCase()+String(t||"").slice(1)}
function interpretarPlano(plano){
  const codigo=plano?.codigo||Simbolo.limpar($("codigo").value)||"MKS-7ZKC4";
  const casa=Simbolo.casa(codigo),sentido=Simbolo.significado(codigo);
  const comandos=plano?.comandos||[];
  const quantidade=t=>comandos.filter(c=>c.tipo===t).length;
  const elementos=[];

  elementos.push({
    titulo: plano?.estilo==="caminho"?"Traço dominante — O Caminho":plano?.estilo==="limiar"?"Estrutura dominante — O Limiar":"Órbita dominante — O Ciclo",
    texto: plano?.estilo==="caminho"
      ?"O percurso principal representa uma jornada que avança sem precisar ser perfeitamente reta. Seus desvios recordam que crescer também é rever a direção."
      :plano?.estilo==="limiar"
        ?"As passagens angulares representam momentos de transição. Um limiar não é apenas uma fronteira: é o instante em que uma escolha abre uma nova etapa."
        :"A órbita incompleta representa continuidade. A história deste artefato permanece aberta, porque seu significado será ampliado pelos encontros que ainda virão."
  });

  if(quantidade("curva")>0)elementos.push({titulo:"Curvas de ligação — As Relações",texto:"As linhas que aproximam os glifos simbolizam vínculos entre experiências. Nem todo acontecimento permanece isolado; alguns transformam a maneira como compreendemos os demais."});
  if(quantidade("arco")>0)elementos.push({titulo:"Arcos abertos — A Continuidade",texto:"Os arcos não se fecham por completo. Eles lembram que nenhuma identidade está terminada e que sempre existe espaço para um novo entendimento."});
  if(quantidade("ponto")>0)elementos.push({titulo:"Pontos de tinta — A Memória",texto:"Os pequenos pontos representam marcas deixadas pela experiência. Algumas são claras; outras permanecem discretas, mas continuam participando de nossas escolhas."});
  if(quantidade("glifo")>0)elementos.push({titulo:"Glifos principais — A Identidade",texto:"Os sinais centrais nascem do código exclusivo deste artefato. Juntos, formam uma identidade visual que não corresponde a uma palavra pronta, mas a uma composição única."});
  if(quantidade("linha")>=3)elementos.push({titulo:"Cortes e travessias — A Escolha",texto:"Quando um traço interrompe ou atravessa outro, ele representa os momentos em que uma decisão modifica o rumo da jornada."});

  const leituras={
    origem:"Este sigilo guarda a ideia de origem: reconhecer de onde se parte antes de decidir para onde seguir.",
    passagem:"Este sigilo guarda a ideia de passagem: atravessar uma mudança sem perder a consciência do caminho percorrido.",
    escolha:"Este sigilo guarda a ideia de escolha: perceber que até uma pequena decisão pode alterar a direção da jornada.",
    memória:"Este sigilo guarda a ideia de memória: acolher o que permanece, sem permitir que o passado determine sozinho o próximo passo.",
    transformação:"Este sigilo guarda a ideia de transformação: compreender que mudar não apaga quem fomos, mas amplia quem podemos nos tornar."
  };
  return {codigo,casa,sentido,elementos:elementos.slice(0,4),introducao:`Este sigilo foi criado exclusivamente para o artefato ${codigo}. Ele pertence à ${tituloCasa(casa)} e traz como essência a ${sentido}. ${leituras[sentido]||"Seu significado será construído ao longo da jornada."}`};
}
function atualizarExplicacao(plano=planoAtual){
  if(!plano)return;
  const x=interpretarPlano(plano);
  $("explicacaoImagem").src=$("selo").toDataURL("image/png");
  $("explicacaoCodigo").textContent=x.codigo;
  $("explicacaoCasa").textContent=tituloCasa(x.casa);
  $("explicacaoSentido").textContent="Essência: "+primeiraMaiuscula(x.sentido);
  $("explicacaoIntroducao").textContent=x.introducao;
  $("explicacaoElementos").innerHTML=x.elementos.map(e=>`<div class="explicacao-elemento"><strong>${e.titulo}</strong><p>${e.texto}</p></div>`).join("");
}
function escaparHTML(t){return String(t).replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function imprimirExplicacao(){
  if(!planoAtual)return toast("Gere um sigilo primeiro");
  const x=interpretarPlano(planoAtual),imagem=$("selo").toDataURL("image/png");
  const itens=x.elementos.slice(0,4).map(e=>`<section><h3>${escaparHTML(e.titulo)}</h3><p>${escaparHTML(e.texto)}</p></section>`).join("");
  const w=window.open("","_blank","width=520,height=760");
  if(!w)return toast("Permita janelas pop-up para imprimir");
  w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Cartão ${escaparHTML(x.codigo)}</title><style>
  @page{size:100mm 150mm;margin:0}*{box-sizing:border-box}html,body{width:100mm;height:150mm;margin:0;padding:0;background:#fff;color:#24190d}body{font-family:Georgia,serif;overflow:hidden}.cartao{width:100mm;height:150mm;padding:5.5mm;border:1px solid #9a743c;display:flex;flex-direction:column;page-break-inside:avoid;break-inside:avoid;overflow:hidden}header{text-align:center}h1{font-size:11pt;letter-spacing:.18em;margin:0 0 1.5mm}.sigilo{display:block;width:44mm;height:44mm;object-fit:cover;margin:1mm auto 2mm;border:1px solid #9a743c}.codigo{font-family:Arial,sans-serif;font-size:10pt;font-weight:700;letter-spacing:.11em;margin:0}.identidade{display:flex;justify-content:center;gap:3mm;margin:2mm 0 2.5mm;font-family:Arial,sans-serif;font-size:7.3pt}.identidade span{border-top:1px solid #b99760;padding-top:1mm}.intro{font-size:7.2pt;line-height:1.25;text-align:center;margin:0 0 2mm}.elementos{display:grid;grid-template-columns:1fr 1fr;gap:1.7mm 3mm;flex:1;align-content:start}section{break-inside:avoid;margin:0}h3{font-size:7.2pt;margin:0 0 .4mm;text-transform:uppercase;letter-spacing:.03em}section p{font-size:6.8pt;line-height:1.2;margin:0;text-align:left}blockquote{margin:2mm 0 0;padding-top:1.6mm;border-top:1px solid #b99760;text-align:center;font-style:italic;font-size:7pt;line-height:1.25}.assinatura{text-align:right;font-size:6.4pt;margin:.7mm 1mm 0 0}.rodape{text-align:center;font-family:Arial,sans-serif;font-size:5.6pt;letter-spacing:.08em;margin-top:1mm;color:#6f5a3a}@media print{html,body{width:100mm;height:150mm}.cartao{border:0}}
  </style></head><body><main class="cartao"><header><h1>GUARDIÃO</h1><img class="sigilo" src="${imagem}" alt="Sigilo"><p class="codigo">ARTEFATO ${escaparHTML(x.codigo)}</p><div class="identidade"><span>${escaparHTML(tituloCasa(x.casa))}</span><span>ESSÊNCIA: ${escaparHTML(primeiraMaiuscula(x.sentido))}</span></div></header><p class="intro">Este símbolo foi criado exclusivamente para este artefato. Nenhum outro será exatamente igual.</p><div class="elementos">${itens}</div><blockquote>“Se este símbolo chegou até suas mãos, nossa caminhada já começou.”</blockquote><p class="assinatura">— Guardião</p><p class="rodape">ESCRITA EXCLUSIVA DO ARTEFATO</p></main><script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script></body></html>`);
  w.document.close();
}
function destino(){$("destino").value="https://cassijobs.github.io/guardiao/?artefato="+$("codigo").value}
function atualizarInfo(plano){
  const total=dados.artefatos.length,c=$("codigo").value,e=$("estilo").value;
  $("infoCodigo").textContent=c;$("infoEstilo").textContent=nomeEstilo(e);
  $("infoCasa").textContent=Simbolo.casa(c);$("infoSentido").textContent=Simbolo.significado(c);$("infoAssinatura").textContent=plano?.assinatura||Simbolo.assinatura(c,e);
  $("infoLote").textContent=`lote-${String(Math.floor(total/TAMANHO_LOTE)+1).padStart(3,"0")}`;
  $("infoIndice").textContent=total%TAMANHO_LOTE;
}
function aplicarQualidade(){
  const q=Simbolo.qualidade();$("infoQualidade").textContent=q+"/100 — "+(q>=85?"excelente":q>=72?"boa":"moderada");
  $("qualidadePreenchimento").style.width=q+"%";return q
}
async function revelar(){
  if(revelando)return;revelando=true;
  const c=Simbolo.limpar($("codigo").value)||"MKS-7ZKC4";$("codigo").value=c;destino();
  $("ritualMensagem").classList.remove("visivel");
  const plano=await Simbolo.revelar(c,$("estilo").value);
  planoAtual=plano;atualizarInfo(plano);aplicarQualidade();atualizarExplicacao(plano);
  $("ritualMensagem").classList.add("visivel");
  setTimeout(()=>$("ritualMensagem").classList.remove("visivel"),2600);
  revelando=false;
}
function preview(){
  const c=Simbolo.limpar($("codigo").value)||"MKS-7ZKC4";$("codigo").value=c;
  const p=Simbolo.desenhar(c,$("estilo").value);planoAtual=p;atualizarInfo(p);aplicarQualidade();atualizarExplicacao(p)
}
async function registrarAtual({avancar=true}={}){
  const c=Simbolo.limpar($("codigo").value);
  if(!c)throw new Error("Código inválido");
  let artefato=dados.artefatos.find(a=>a.codigo===c);
  if(!artefato){
    const e=$("estilo").value,imagem=await Simbolo.criar(c,e);
    const ultimo=lotes().at(-1);
    const nomeLote=ultimo&&ultimo.artefatos.length<TAMANHO_LOTE?ultimo.nome:proximoNomeLote();
    const ordem=ultimo&&ultimo.nome===nomeLote?ultimo.artefatos.length:0;
    artefato={id:crypto.randomUUID(),codigo:c,destino:$("destino").value,estilo:e,obs:$("obs").value,_imagem:imagem,assinatura:Simbolo.assinatura(c,e),qualidade:Simbolo.qualidade(),lote:nomeLote,targetIndex:ordem};
    dados.artefatos.push(artefato);
    organizar();render();
  }else{
    artefato.destino=$("destino").value;
    artefato.obs=$("obs").value;
    save();render();
  }
  if(avancar){
    toast("O Guardião registrou este artefato");
    $("codigo").value=novoCodigo();destino();$("obs").value="";await revelar();
  }
  return artefato;
}
async function salvar(){
  const c=Simbolo.limpar($("codigo").value);
  const artefato=dados.artefatos.find(a=>a.codigo===c);
  if(!artefato)return toast("Escolha um artefato existente");
  artefato.obs=$("obs").value;
  artefato.cartaoRevisado=true;
  artefato.cartaoRevisadoEm=new Date().toISOString();
  save();render();renderEditorCartoes(c);
  toast("Dados do cartão salvos");
}
async function remover(id){
  if(!confirm("Remover este artefato da biblioteca?"))return;
  const removido=dados.artefatos.find(a=>a.id===id);
  dados.artefatos=dados.artefatos.filter(a=>a.id!==id);
  if(removido)await apagarImagemPersistente(removido);
  organizar();render();
}
function render(){
  const busca=$("busca").value.toLowerCase();
  const arr=dados.artefatos.filter(a=>(a.codigo+" "+(a.obs||"")+" "+a.destino+" "+(a.assinatura||"")).toLowerCase().includes(busca));
  $("bibliotecaGrid").innerHTML=arr.length?arr.map(a=>`<article class="item"><img data-thumb="${a.id}" src="${a._imagem||''}" alt="Sigilo ${a.codigo}"><div class="item-body"><h3>${a.codigo}</h3><small>${nomeEstilo(a.estilo)}</small><small class="assinatura">assinatura ${a.assinatura||Simbolo.assinatura(a.codigo,a.estilo)}</small><small>${a.lote} · targetIndex ${a.targetIndex} · qualidade ${a.qualidade||"—"}</small><small>${a.obs||a.destino}</small><button data-remove="${a.id}" class="perigo">Remover</button></div></article>`).join(""):'<p>Nenhum artefato registrado.</p>';
  arr.forEach(async a=>{const el=document.querySelector(`[data-thumb="${a.id}"]`);if(el&&!el.getAttribute("src")){try{el.src=await imagemArtefato(a)}catch{}}});
  const ls=lotes(),next=dados.artefatos.length;
  $("total").textContent=dados.artefatos.length;$("qtdLotes").textContent=ls.length;
  $("proxLote").textContent=`lote-${String(Math.floor(next/TAMANHO_LOTE)+1).padStart(3,"0")}`;$("proxIndice").textContent=next%TAMANHO_LOTE;
  sincronizarLoteAtivo();
  atualizarInfo();
  atualizarTargetManualUI();
  renderLotesResumo();
  renderHistorico();
  atualizarBoasVindas();
}
function montarAlfabeto(){
  const grid=$("alfabetoGrid");
  grid.innerHTML=Simbolo.ALFABETO.split("").map(c=>`<div class="glifo-card"><canvas data-char="${c}"></canvas><span>${c}</span></div>`).join("");
  grid.querySelectorAll("canvas").forEach(cv=>Simbolo.desenharAmostra(cv,cv.dataset.char));
  const marca=$("marcaCanvas");Simbolo.desenharAmostra(marca,"G")
}
function prog(v,t){$("barra").style.width=v+"%";$("status").textContent=t}
function img(blob){return new Promise((ok,no)=>{const i=new Image,u=URL.createObjectURL(blob);i.onload=()=>{URL.revokeObjectURL(u);ok(i)};i.onerror=no;i.src=u})}

function quantidadeDeAlvosMind(dadosMind){
  const bytes=dadosMind instanceof Uint8Array
    ? dadosMind
    : new Uint8Array(dadosMind);
  const chave=[0xa8,0x64,0x61,0x74,0x61,0x4c,0x69,0x73,0x74];
  let inicio=-1;
  for(let i=0;i<=bytes.length-chave.length;i++){
    let igual=true;
    for(let j=0;j<chave.length;j++){
      if(bytes[i+j]!==chave[j]){igual=false;break}
    }
    if(igual){inicio=i+chave.length;break}
  }
  if(inicio<0||inicio>=bytes.length){
    throw new Error("Arquivo .mind inválido: a lista interna de alvos não foi encontrada.");
  }
  const marcador=bytes[inicio];
  if(marcador>=0x90&&marcador<=0x9f)return marcador&0x0f;
  if(marcador===0xdc){
    if(inicio+2>=bytes.length)throw new Error("Arquivo .mind incompleto.");
    return (bytes[inicio+1]<<8)|bytes[inicio+2];
  }
  if(marcador===0xdd){
    if(inicio+4>=bytes.length)throw new Error("Arquivo .mind incompleto.");
    return (
      bytes[inicio+1]*0x1000000+
      (bytes[inicio+2]<<16)+
      (bytes[inicio+3]<<8)+
      bytes[inicio+4]
    );
  }
  throw new Error("Arquivo .mind inválido: formato de alvos não reconhecido.");
}

function validarQuantidadeMind(dadosMind,esperado,nomeLote){
  const encontrado=quantidadeDeAlvosMind(dadosMind);
  if(encontrado!==esperado){
    throw new Error(
      `O arquivo .mind de ${nomeLote} contém ${encontrado} símbolo${encontrado===1?"":"s"}, `+
      `mas o lote possui ${esperado}. Recompile todos os símbolos desse lote juntos, na ordem exibida pela Biblioteca.`
    );
  }
  return encontrado;
}

function invalidarTargetsManuaisIncompativeis(){
  if(!targetsManuais.size)return;
  const grupos=new Map(lotes().map(l=>[l.nome,l]));
  const removidos=[];
  for(const [nome,item] of targetsManuais){
    const lote=grupos.get(nome);
    if(!lote||item.quantidade!==lote.artefatos.length||item.assinatura!==assinaturaLote(lote)){
      targetsManuais.delete(nome);
      apagarTargetPersistente(nome);
      removidos.push(nome);
    }
  }
  if(removidos.length&&document.getElementById("mindStatus")){
    document.getElementById("arquivoMind").value="";
    atualizarTargetManualUI();
    toast(`Target removido: a composição de ${removidos.join(", ")} mudou.`);
  }
}
async function mind(arts){
  throw new Error("Antes de publicar, gere o arquivo .mind no compilador oficial e importe-o em TARGETS MINDAR.");
}

function obterLoteAtivo(){
  const grupos=lotes();
  if(!grupos.length)return null;
  // O lote em andamento é sempre o último lote da biblioteca.
  // Lotes anteriores permanecem fechados e não são alterados durante a importação.
  return grupos[grupos.length-1];
}
function loteSelecionado(){
  const ativo=obterLoteAtivo();
  return ativo?ativo.nome:"";
}
function sincronizarLoteAtivo(){
  const ativo=obterLoteAtivo();
  const seletor=$("loteExportar");
  if(seletor){
    seletor.innerHTML=ativo
      ? `<option value="${ativo.nome}">${ativo.nome} — ${ativo.artefatos.length} símbolo${ativo.artefatos.length===1?"":"s"}</option>`
      : '<option value="">Nenhum lote</option>';
    seletor.value=ativo?.nome||"";
    seletor.disabled=true;
  }
  const rotulo=document.getElementById("loteAtivoPublicacao");
  if(rotulo)rotulo.textContent=ativo
    ? `${ativo.nome} — ${ativo.artefatos.length} símbolo${ativo.artefatos.length===1?"":"s"}`
    : "Nenhum lote disponível";
  const ordem=document.getElementById("ordemCompilacao");
  if(ordem){
    ordem.innerHTML=ativo
      ? ativo.artefatos.map(a=>`<div class="ordem-item"><b>targetIndex ${a.targetIndex}</b><code>${escaparHTML(a.codigo)}</code></div>`).join("")
      : '<div class="validacao-linha erro">Nenhum lote disponível.</div>';
  }
}

function validarEstruturaLote(lote){
  const erros=[];
  const codigos=new Set();
  lote.artefatos.forEach((a,indice)=>{
    if(a.targetIndex!==indice)erros.push(`${a.codigo}: targetIndex ${a.targetIndex}, esperado ${indice}`);
    if(codigos.has(a.codigo))erros.push(`Código repetido: ${a.codigo}`);
    codigos.add(a.codigo);
    if(!a.destino||!a.destino.includes(`artefato=${a.codigo}`))erros.push(`${a.codigo}: destino incompatível`);
    if(!a.assinatura)erros.push(`${a.codigo}: assinatura ausente`);
  });
  return erros;
}

function estadoValidacaoFinal(){
  const grupos=lotes();
  const resultado={ok:grupos.length>0,lotes:[],errosGerais:[]};
  if(!grupos.length){resultado.ok=false;resultado.errosGerais.push('Nenhum artefato registrado.');return resultado}
  const todosCodigos=new Set();
  for(const lote of grupos){
    const erros=validarEstruturaLote(lote);
    for(const a of lote.artefatos){
      if(todosCodigos.has(a.codigo))erros.push(`Código duplicado em outro lote: ${a.codigo}`);
      todosCodigos.add(a.codigo);
    }
    const manual=targetsManuais.get(lote.nome);
    if(!manual)erros.push('Arquivo .mind ainda não importado para este lote.');
    else if(manual.quantidade!==lote.artefatos.length)erros.push(`O .mind contém ${manual.quantidade} targets; o lote exige ${lote.artefatos.length}.`);
    resultado.lotes.push({lote,manual,erros});
    if(erros.length)resultado.ok=false;
  }
  return resultado;
}

function atualizarValidacaoFinal(){
  const caixa=document.getElementById('validacaoFinal');
  const itens=document.getElementById('validacaoItens');
  const resumo=caixa?.querySelector('.validacao-resumo');
  const botoes=[...document.querySelectorAll('#publicarTudo, #publicarTudoTopo')];
  if(!caixa||!itens||!resumo||!botoes.length)return;

  const ativo=obterLoteAtivo();
  const manual=ativo?targetsManuais.get(ativo.nome):null;

  // Antes da importação não existe erro: esta é apenas a próxima etapa do fluxo.
  if(ativo && !manual){
    botoes.forEach(botao=>{ botao.disabled=true; botao.setAttribute("aria-disabled","true"); });
    resumo.innerHTML='Próxima etapa: selecione o arquivo <code>targets.mind</code> gerado pelo compilador.';
    const mapa=ativo.artefatos.map(a=>`targetIndex ${a.targetIndex} → ${a.codigo}`).join('<br>');
    itens.innerHTML=`<div class="validacao-lote aguardando">
      <strong>${ativo.nome} — ${ativo.artefatos.length} símbolo${ativo.artefatos.length===1?'':'s'}</strong>
      <div class="validacao-linha neutra">• Aguardando a importação do arquivo <code>targets.mind</code>.</div>
      <div class="validacao-linha neutra">• Depois da importação, o Studio fará a validação completa.</div>
      <div class="validacao-mapa"><b>ORDEM ESPERADA NO COMPILADOR:</b><br>${mapa}</div>
    </div>`;
    return;
  }

  const estado=estadoValidacaoFinal();
  botoes.forEach(botao=>{
    botao.disabled=!estado.ok;
    botao.setAttribute("aria-disabled", String(!estado.ok));
    botao.classList.toggle("publicacao-liberada", estado.ok);
  });
  resumo.textContent=estado.ok
    ? 'Validação concluída. O pacote pode ser gerado com segurança.'
    : 'O arquivo foi importado, mas ainda existem itens que precisam ser corrigidos.';

  itens.innerHTML=estado.lotes.map(({lote,manual,erros})=>{
    const linhas=[];
    linhas.push(`<div class="validacao-linha ${manual?'ok':'erro'}">${manual?'✓':'✕'} .mind: ${manual?`${escaparHTML(manual.nomeArquivo||manual.file?.name||"targets.mind")} — ${manual.quantidade} targets`:'não importado'}</div>`);
    linhas.push(`<div class="validacao-linha ${erros.some(e=>e.includes('targetIndex'))?'erro':'ok'}">${erros.some(e=>e.includes('targetIndex'))?'✕':'✓'} Índices sequenciais de 0 a ${Math.max(0,lote.artefatos.length-1)}</div>`);
    linhas.push(`<div class="validacao-linha ${erros.some(e=>e.includes('destino'))?'erro':'ok'}">${erros.some(e=>e.includes('destino'))?'✕':'✓'} Rotas e destinos correspondem aos códigos</div>`);
    linhas.push(`<div class="validacao-linha ${erros.some(e=>e.includes('repetido')||e.includes('duplicado'))?'erro':'ok'}">${erros.some(e=>e.includes('repetido')||e.includes('duplicado'))?'✕':'✓'} Códigos sem duplicação</div>`);
    if(erros.length)linhas.push(...erros.map(e=>`<div class="validacao-linha erro">• ${escaparHTML(e)}</div>`));
    const mapa=lote.artefatos.map(a=>`targetIndex ${a.targetIndex} → ${a.codigo}`).join('<br>');
    return `<div class="validacao-lote"><strong>${lote.nome} — ${lote.artefatos.length} símbolo${lote.artefatos.length===1?'':'s'}</strong>${linhas.join('')}<div class="validacao-mapa"><b>ORDEM VALIDADA:</b><br>${mapa}</div></div>`;
  }).join('') || '<div class="validacao-linha erro">Nenhum lote disponível.</div>';
}

function atualizarTargetManualUI(){
  const nome=loteSelecionado(),item=targetsManuais.get(nome);
  $("mindStatus").textContent=item
    ? `${item.nomeArquivo||item.file?.name||"targets.mind"} — ${item.quantidade} símbolo${item.quantidade===1?"":"s"} — validado para ${nome}${item.persistido===false?" (válido nesta sessão)":" e guardado"}`
    : `Aguardando o targets.mind de ${nome}. O Studio associará o arquivo automaticamente a este lote.`;
  $("dropMind").classList.toggle("tem-arquivo",!!item);
  atualizarValidacaoFinal();
}
async function definirTargetManual(file){
  if(!file||!file.name.toLowerCase().endsWith(".mind"))return toast("Selecione um arquivo .mind válido");
  const lote=obterLoteAtivo();
  if(!lote)return toast("Crie ao menos um artefato antes de importar o .mind");
  const nome=lote.nome;
  sincronizarLoteAtivo();
  try{
    const buffer=await file.arrayBuffer();
    const quantidade=validarQuantidadeMind(buffer,lote.artefatos.length,nome);
    const item={file,nomeArquivo:file.name,buffer,quantidade,assinatura:assinaturaLote(lote)};
    targetsManuais.set(nome,item);
    let persistido=true;
    try{
      await guardarTargetPersistente(nome,item);
    }catch(erroPersistencia){
      persistido=false;
      console.warn("O target foi validado, mas não pôde ser guardado permanentemente.",erroPersistencia);
    }
    item.persistido=persistido;
    atualizarTargetManualUI();
    if(persistido){
      toast(`Target validado e guardado para ${nome}: ${quantidade} símbolos`);
    }else{
      $("mindStatus").textContent=`${file.name} — ${quantidade} símbolos — validado para ${nome} (válido nesta sessão)`;
      toast(`Target validado para ${nome}. Ele ficará disponível nesta sessão.`);
    }
  }catch(erro){
    targetsManuais.delete(nome);
    await apagarTargetPersistente(nome);
    $("arquivoMind").value="";
    $("mindStatus").textContent="ARQUIVO RECUSADO — "+erro.message;
    $("dropMind").classList.remove("tem-arquivo");
    prog(0,"Erro: "+erro.message);
    toast("O arquivo .mind não corresponde ao lote");
  }
}
async function obterMind(lote){
  const manual=targetsManuais.get(lote.nome);
  if(manual){
    const buffer=manual.buffer||await manual.file.arrayBuffer();
    validarQuantidadeMind(buffer,lote.artefatos.length,lote.nome);
    prog(30,`Usando target manual validado de ${lote.nome}`);
    return buffer;
  }
  const compilado=await mind(lote.artefatos);
  validarQuantidadeMind(compilado,lote.artefatos.length,lote.nome);
  return compilado;
}
async function gerarLote(){
  const l=obterLoteAtivo();
  if(!l)throw new Error("Nenhum lote disponível");
  const nome=l.nome;
  prog(2,"Preparando publicação do novo lote");
  const m=await obterMind(l),z=new JSZip,ar=z.folder("AR");

  // A atualização contém apenas os arquivos pesados do lote ativo,
  // porém leva o config.json completo para manter todos os lotes visíveis.
  ar.file(`targets/${nome}.mind`,m);
  ar.file(`rotas/${nome}.json`,JSON.stringify(l.artefatos.map(a=>({
    codigo:a.codigo,
    targetIndex:a.targetIndex,
    destino:a.destino,
    imagem:`./selos/selo-${a.codigo}.png`,
    casa:Simbolo.casa(a.codigo),
    essencia:Simbolo.significado(a.codigo),
    assinatura:a.assinatura,
    qualidade:a.qualidade
  })),null,2));
  for(const a of l.artefatos){
    ar.file(`selos/selo-${a.codigo}.png`,Simbolo.toBlob(await imagemArtefato(a)));
  }

  const configLotes=lotes().map(lote=>({
    nome:lote.nome,
    quantidade:lote.artefatos.length,
    targets:`./targets/${lote.nome}.mind`,
    rotas:`./rotas/${lote.nome}.json`
  }));
  const versaoPublicacao=Date.now();
  const geradoEm=new Date().toISOString();
  ar.file("config.json",JSON.stringify({
    versao:versaoPublicacao,
    sistema:"O Escriba Studio 11.0 — Publicação de novo lote",
    versoes:VERSOES,
    geradoEm,
    lotes:configLotes
  },null,2));
  ar.file("version.json",JSON.stringify({
    ecossistema:"Guardião",
    ...VERSOES,
    tipoPublicacao:"incremental",
    lote:nome,
    geradoEm,
    lotes:configLotes.length,
    artefatos:dados.artefatos.length
  },null,2));
  ar.file("COMO-ATUALIZAR.txt",`GUARDIÃO — ATUALIZAÇÃO INCREMENTAL DE ${nome}\n\n1. NÃO apague a pasta AR existente.\n2. Copie o conteúdo desta pasta AR sobre a pasta AR do projeto.\n3. Confirme a substituição de config.json e de arquivos com o mesmo nome.\n4. Os lotes anteriores permanecem intactos.\n5. Faça Commit e Push pelo GitHub Desktop.\n\nLote acrescentado/atualizado: ${nome}\nTotal de lotes registrados no config.json: ${configLotes.length}\n`);

  const b=await z.generateAsync({type:"blob"},x=>prog(85+x.percent*.15,`Compactando ${Math.round(x.percent)}%`));
  download(b,`guardiao-NOVO-LOTE-${nome}.zip`);
  prog(100,"Pacote do novo lote criado");
  toast("Novo lote preparado. Copie sobre a pasta AR existente sem apagá-la");
}
function config(){
  const ls=lotes().map(l=>({nome:l.nome,quantidade:l.artefatos.length,targets:`./targets/${l.nome}.mind`,rotas:`./rotas/${l.nome}.json`}));
  download(new Blob([JSON.stringify({versao:4,sistema:"O Escriba — A Escrita Viva",lotes:ls},null,2)],{type:"application/json"}),"config.json")
}

const AR_ARQUIVOS=[
  "index.html","leitor.css",
  "js/app.js","js/config.js","js/identidade.js","js/reconhecimento.js","js/ritual.js","js/ui.js"
];
async function copiarLeitorPara(zipAR){
  for(const caminho of AR_ARQUIVOS){
    const resposta=await fetch(`./leitor-base/${caminho}`,{cache:"no-store"});
    if(!resposta.ok)throw new Error(`Arquivo interno do leitor ausente: ${caminho}`);
    zipAR.file(caminho,await resposta.blob());
  }
}

async function validarPacoteAR(ar,grupos){
  const obrigatorios=[
    "index.html","leitor.css","config.json","version.json",
    "js/app.js","js/config.js","js/identidade.js","js/reconhecimento.js","js/ritual.js","js/ui.js"
  ];
  for(const lote of grupos){
    obrigatorios.push(`targets/${lote.nome}.mind`);
    obrigatorios.push(`rotas/${lote.nome}.json`);
    for(const a of lote.artefatos)obrigatorios.push(`selos/selo-${a.codigo}.png`);
  }
  const faltando=[];
  for(const caminho of obrigatorios){
    const arquivo=ar.file(caminho);
    if(!arquivo){faltando.push(caminho);continue}
    try{
      const bytes=await arquivo.async("uint8array");
      if(bytes.length===0)faltando.push(`${caminho} (vazio)`);
      if(caminho.endsWith(".mind")){
        if(bytes.length<1000){
          faltando.push(`${caminho} (inválido)`);
        }else{
          const nome=caminho.split("/").pop().replace(/\.mind$/i,"");
          const lote=grupos.find(g=>g.nome===nome);
          try{
            validarQuantidadeMind(bytes,lote?.artefatos.length||0,nome);
          }catch(erro){
            faltando.push(`${caminho} (${erro.message})`);
          }
        }
      }
    }catch{faltando.push(`${caminho} (não legível)`) }
  }
  if(faltando.length)throw new Error("Publicação cancelada. Arquivos ausentes: "+faltando.join(", "));
  return obrigatorios;
}

async function publicarTudo(){
  if(!window.JSZip)throw new Error("JSZip não carregado. Verifique a internet.");
  // IMPORTANTE: a publicação é montada exclusivamente a partir de dados.artefatos.
  // Qualquer código exibido no formulário individual é apenas rascunho visual.
  // A publicação usa somente os artefatos efetivamente registrados na biblioteca.
  // O formulário de criação pode conter um código de exemplo ou um rascunho e
  // não deve bloquear a geração de um lote já validado.
  organizar();
  const validacao=estadoValidacaoFinal();
  atualizarValidacaoFinal();
  if(!validacao.ok)throw new Error("Publicação bloqueada. Corrija os itens mostrados em VALIDAÇÃO FINAL DA PUBLICAÇÃO.");
  prog(1,"Conferindo biblioteca, targets e rotas");
  const grupos=lotes();
  if(!grupos.length)throw new Error("Nenhum artefato foi registrado");

  const zip=new JSZip();
  const ar=zip.folder("AR");
  prog(3,"Incluindo o leitor ritual");
  await copiarLeitorPara(ar);

  const configLotes=[];
  for(let i=0;i<grupos.length;i++){
    const lote=grupos[i];
    prog(5+(i/grupos.length)*72,`Compilando ${lote.nome} (${i+1}/${grupos.length})`);
    const mindData=await obterMind(lote);
    ar.file(`targets/${lote.nome}.mind`,mindData);
    const rotas=lote.artefatos.map(a=>({
      codigo:a.codigo,
      targetIndex:a.targetIndex,
      destino:a.destino,
      imagem:`./selos/selo-${a.codigo}.png`,
      casa:Simbolo.casa(a.codigo),
      essencia:Simbolo.significado(a.codigo),
      assinatura:a.assinatura,
      qualidade:a.qualidade
    }));
    ar.file(`rotas/${lote.nome}.json`,JSON.stringify(rotas,null,2));
    for(const a of lote.artefatos)ar.file(`selos/selo-${a.codigo}.png`,Simbolo.toBlob(await imagemArtefato(a)));
    configLotes.push({nome:lote.nome,quantidade:lote.artefatos.length,targets:`./targets/${lote.nome}.mind`,rotas:`./rotas/${lote.nome}.json`});
  }
  const geradoEmPublicacao=new Date().toISOString();
  ar.file("config.json",JSON.stringify({versao:Date.now(),sistema:"O Escriba Studio 11.0 — Biblioteca completa",versoes:VERSOES,geradoEm:geradoEmPublicacao,lotes:configLotes},null,2));
  ar.file("version.json",JSON.stringify({
    ecossistema:"Guardião",
    ...VERSOES,
    tipoPublicacao:"completa",
    geradoEm:geradoEmPublicacao,
    lotes:grupos.length,
    artefatos:dados.artefatos.length
  },null,2));
  ar.file("COMO-PUBLICAR.txt",`GUARDIÃO — PACOTE AR COMPLETO E VALIDADO

ESTE É O PACOTE COMPLETO, COM TODOS OS LOTES SALVOS NO STUDIO.

1. Use este pacote quando desejar reconstruir toda a pasta AR.
2. Confirme que a lista abaixo inclui todos os lotes anteriores e o novo.
3. Faça backup da pasta AR atual.
4. Substitua a pasta AR pelo conteúdo completo deste pacote.
5. Faça Commit e Push pelo GitHub Desktop.
6. Teste /guardiao/AR/config.json e depois /guardiao/AR/.

Artefatos: ${dados.artefatos.length}
Lotes: ${grupos.length}
`);
  const manifest={
    versao:9,
    studio:VERSOES.studio,
    ar:VERSOES.ar,
    leitor:VERSOES.leitor,
    app:VERSOES.app,
    validado:true,
    geradoEm:new Date().toISOString(),
    artefatos:dados.artefatos.length,
    lotes:grupos.map(lote=>({
      ...configLotes.find(x=>x.nome===lote.nome),
      ordemEsperada:lote.artefatos.map(a=>({targetIndex:a.targetIndex,codigo:a.codigo,assinatura:a.assinatura}))
    }))
  };
  ar.file("manifest.json",JSON.stringify(manifest,null,2));
  prog(78,"Validando todos os arquivos");
  const listaValidada=await validarPacoteAR(ar,grupos);
  manifest.arquivos=listaValidada;
  ar.file("manifest.json",JSON.stringify(manifest,null,2));
  prog(82,"Montando o pacote completo");
  const blob=await zip.generateAsync({type:"blob"},x=>prog(82+x.percent*.18,`Compactando ${Math.round(x.percent)}%`));
  const data=new Date().toISOString().slice(0,10);
  download(blob,`guardiao-AR-COMPLETO-VALIDADO-${data}.zip`);
  prog(100,"AR completo validado — agora envie a pasta AR gerada ao GitHub");
  toast("Pasta AR completa e validada criada");
}
const HIST_KEY="guardiao-studio-v8-historico";
function lerHistorico(){try{return JSON.parse(localStorage.getItem(HIST_KEY)||"[]")}catch{return []}}
function registrarPublicacao(nome){
  const h=lerHistorico();
  h.unshift({nome,data:new Date().toISOString(),artefatos:dados.artefatos.length,lotes:lotes().length});
  try{localStorage.setItem(HIST_KEY,JSON.stringify(h.slice(0,100)))}catch{}
  renderHistorico();
}

async function criarLoteCom25(){
  if(!window.confirm("Criar um novo lote com 25 identidades exclusivas? Esta operação não altera os lotes existentes."))return;
  const nome=proximoNomeLote();
  const existentes=new Set(dados.artefatos.map(a=>a.codigo));
  prog(2,`Criando ${nome}`);
  const novos=[];
  for(let i=0;i<TAMANHO_LOTE;i++){
    let codigo;
    do{codigo=novoCodigo()}while(existentes.has(codigo));
    existentes.add(codigo);
    const estilo=["orbe","caminho","limiar"][i%3];
    const artefato={
      id:crypto.randomUUID(),codigo,
      destino:`https://cassijobs.github.io/guardiao/?artefato=${codigo}`,
      estilo,obs:"",assinatura:Simbolo.assinatura(codigo,estilo),qualidade:78,
      lote:nome,targetIndex:i
    };
    prog(2+(i+1)/TAMANHO_LOTE*70,`Congelando identidade ${i+1} de ${TAMANHO_LOTE}`);
    artefato._imagem=await Simbolo.criar(codigo,estilo);
    await guardarImagemPersistente(artefato,artefato._imagem);
    novos.push(artefato);
    await new Promise(r=>setTimeout(r,0));
  }
  dados.artefatos.push(...novos);
  organizar();
  render();
  prog(100,`${nome} criado com ${TAMANHO_LOTE} artefatos`);
  toast(`${nome} criado com 25 identidades`);
  document.querySelector('[data-modulo="lotesModulo"]')?.click();
}

async function exportarSimbolosDoLote(){
  if(!window.JSZip)throw new Error("Gerador ZIP não carregado.");
  const lote=obterLoteAtivo();
  if(!lote)throw new Error("Nenhum lote disponível.");
  if(lote.artefatos.length!==TAMANHO_LOTE){
    const continuar=window.confirm(`${lote.nome} possui ${lote.artefatos.length} artefatos, e não 25. Exportar mesmo assim?`);
    if(!continuar)return;
  }
  const zip=new JSZip();
  const pasta=zip.folder(`${lote.nome}-simbolos`);
  const lista=[];
  for(let i=0;i<lote.artefatos.length;i++){
    const a=lote.artefatos[i];
    prog(5+(i+1)/lote.artefatos.length*75,`Preparando símbolo 512 px ${i+1} de ${lote.artefatos.length}`);
    const imagem=await imagemArtefato(a);
    const nome=`${String(i+1).padStart(2,"0")}-${a.codigo}.png`;
    pasta.file(nome,Simbolo.toBlob(imagem));
    lista.push({ordem:i,targetIndex:i,codigo:a.codigo,arquivo:nome,destino:a.destino,assinatura:a.assinatura});
  }
  pasta.file("lote.json",JSON.stringify({nome:lote.nome,quantidade:lote.artefatos.length,ordem:lista},null,2));
  pasta.file("ORDEM-MINDAR.txt",`ORDEM OBRIGATÓRIA NO COMPILADOR MINDAR\n\n${lista.map(x=>`${String(x.ordem+1).padStart(2,"0")}. ${x.codigo} — ${x.arquivo}`).join("\n")}\n\nSelecione todas as imagens juntas e mantenha esta ordem.\nO compilador deverá gerar um único arquivo targets.mind com ${lista.length} targets.\n`);
  pasta.file("CHECKLIST-PRODUCAO.txt",`GUARDIÃO — CHECKLIST DE PRODUÇÃO — ${lote.nome}\n\n[ ] Conferir os ${lista.length} códigos\n[ ] Compilar todas as imagens juntas no MindAR\n[ ] Importar targets.mind no Studio\n[ ] Gerar pacote AR completo\n[ ] Publicar a pasta AR no GitHub\n[ ] Gravar as etiquetas NFC\n[ ] Imprimir os símbolos de segurança\n[ ] Montar os artefatos físicos\n[ ] Conferir correspondência NFC / símbolo / embalagem\n[ ] Finalizar o lote\n`);
  const blob=await zip.generateAsync({type:"blob"},m=>prog(80+m.percent*.2,`Compactando ${Math.round(m.percent)}%`));
  download(blob,`${lote.nome}-SIMBOLOS-ORDENADOS.zip`);
  prog(100,`${lote.nome} exportado para compilação`);
  toast("Símbolos 512 px exportados na ordem correta");
}

function renderLotesResumo(){
  const el=document.getElementById("lotesResumo"); if(!el)return;
  const ls=lotes();
  el.innerHTML=ls.length?ls.map(l=>`<article class="lote-card lote-card10"><div class="lote-titulo10"><strong>${l.nome}</strong><span class="lote-status10 ${l.artefatos.length===TAMANHO_LOTE?'completo':'preparacao'}">${l.artefatos.length===TAMANHO_LOTE?'COMPLETO':'EM PREPARAÇÃO'}</span></div><span>${l.artefatos.length} / ${TAMANHO_LOTE} artefatos</span><div class="barra-lote10"><i style="width:${Math.min(100,l.artefatos.length/TAMANHO_LOTE*100)}%"></i></div><small>${l.artefatos.map(a=>`${String(a.targetIndex+1).padStart(2,'0')} · ${a.codigo}`).join("<br>")}</small></article>`).join(""):`<div class="vazio-modulo">Nenhum lote criado. Use “Novo lote com 25”.</div>`;
}
function renderHistorico(){
  const el=document.getElementById("historicoLista"); if(!el)return;
  const h=lerHistorico();
  el.innerHTML=h.length?h.map(x=>`<article class="historico-item"><strong>${x.nome}</strong><span>${new Date(x.data).toLocaleString("pt-BR")}</span><small>${x.artefatos} artefatos · ${x.lotes} lotes</small></article>`).join(""):`<div class="vazio-modulo">Nenhuma publicação registrada neste navegador.</div>`;
}
function atualizarBoasVindas(){
  const modal=document.getElementById("boasVindas"); if(!modal)return;
  modal.hidden=dados.artefatos.length>0 || sessionStorage.getItem("escriba-biblioteca-nova")==="1";
}
function importarBackupObjeto(imp){
  if(!Array.isArray(imp?.artefatos))throw new Error("Backup inválido");
  dados=imp; dados.versao=10;
  dados.artefatos.forEach(a=>{if(a.imagem){a._imagem=a.imagem;delete a.imagem}});
  organizar(); render(); atualizarBoasVindas();
}
function download(b,n){const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function artefatoAtualCartao(){
  return dados.artefatos.find(a=>a.codigo===Simbolo.limpar($("codigo").value))||null;
}
function quebrarTexto(ctx,texto,maxWidth){
  const palavras=String(texto||"").split(/\s+/).filter(Boolean),linhas=[];let linha="";
  for(const p of palavras){const teste=linha?linha+" "+p:p;if(ctx.measureText(teste).width>maxWidth&&linha){linhas.push(linha);linha=p}else linha=teste}
  if(linha)linhas.push(linha);return linhas;
}
async function carregarImagemCartao(src){
  return new Promise((resolve,reject)=>{
    const im=new Image();
    im.onload=()=>resolve(im);
    im.onerror=()=>reject(new Error("Não foi possível carregar o molde do cartão."));
    im.src=src;
  });
}
function textoCentralizado(ctx,texto,x,y,maxWidth,alturaLinha,maxLinhas){
  const linhas=quebrarTexto(ctx,texto,maxWidth).slice(0,maxLinhas);
  for(const linha of linhas){ctx.fillText(linha,x,y);y+=alturaLinha}
  return y;
}
async function canvasCartao(a){
  // O molde fornecido pelo usuário passa a ser o cartão oficial impresso.
  // O símbolo de exemplo no círculo é substituído pelo PNG congelado do artefato.
  const molde=await carregarImagemCartao("./assets/cartao-mistico.png");
  const c=document.createElement("canvas");c.width=molde.naturalWidth||908;c.height=molde.naturalHeight||1141;
  const x=c.getContext("2d");x.drawImage(molde,0,0,c.width,c.height);

  const url=await imagemArtefato(a);
  const im=await carregarImagemCartao(url);
  const cx=c.width*.5,cy=c.height*.273,r=c.width*.222;
  x.save();x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.clip();
  // Preenche completamente o círculo para ocultar o símbolo de exemplo do molde.
  x.fillStyle="#c6a66b";x.fillRect(cx-r,cy-r,r*2,r*2);
  x.drawImage(im,cx-r,cy-r,r*2,r*2);x.restore();

  // Mantém apenas as informações já usadas no cartão anterior, com leitura simples.
  const areaX=c.width*.12,areaW=c.width*.76;
  x.textAlign="center";x.fillStyle="#120d06";
  x.font=`700 ${Math.round(c.width*.051)}px Georgia`;
  x.fillText("GUARDIÃO",cx,c.height*.535);
  x.font=`700 ${Math.round(c.width*.045)}px Arial`;
  x.fillText(a.codigo,cx,c.height*.595);
  x.font=`600 ${Math.round(c.width*.023)}px Georgia`;
  x.fillText("CHAVE DE ATIVAÇÃO E RECUPERAÇÃO",cx,c.height*.635);

  x.font=`600 ${Math.round(c.width*.022)}px Georgia`;
  const identidade=`${tituloCasa(Simbolo.casa(a.codigo))}  ·  ESSÊNCIA: ${primeiraMaiuscula(Simbolo.significado(a.codigo))}`;
  textoCentralizado(x,identidade,cx,c.height*.685,areaW,Math.round(c.height*.027),2);

  x.font=`${Math.round(c.width*.021)}px Georgia`;
  const assinatura=`Assinatura: ${a.assinatura||Simbolo.assinatura(a.codigo,a.estilo)}`;
  textoCentralizado(x,assinatura,cx,c.height*.745,areaW,Math.round(c.height*.026),2);

  x.font=`${Math.round(c.width*.020)}px Georgia`;
  const texto=a.obs||"Guarde este símbolo. Ele é a chave de ativação e recuperação do seu Guardião.";
  textoCentralizado(x,texto,cx,c.height*.805,areaW,Math.round(c.height*.025),3);

  x.font=`italic ${Math.round(c.width*.018)}px Georgia`;
  x.fillText("Não publique nem compartilhe este símbolo.",cx,c.height*.885);
  return c;
}
async function baixarPNG(){
  const a=artefatoAtualCartao();if(!a)return toast("Escolha um artefato");
  const c=await canvasCartao(a);c.toBlob(b=>download(b,`cartao-${a.codigo}.png`),"image/png");
}
async function baixarSigiloPNG(){
  const a=artefatoAtualCartao();if(!a)return toast("Escolha um artefato");
  const data=await imagemArtefato(a);download(Simbolo.toBlob(data),`selo-${a.codigo}.png`);
}
async function gerarTodosCartoes(){
  if(!window.JSZip)throw new Error("Gerador ZIP não carregado");
  const nome=$("cartaoLote")?.value;const lote=lotes().find(l=>l.nome===nome);if(!lote)throw new Error("Escolha um lote");
  const zip=new JSZip(),pasta=zip.folder(`cartoes-${nome}`);
  for(let i=0;i<lote.artefatos.length;i++){
    const a=lote.artefatos[i];prog(5+(i+1)/lote.artefatos.length*80,`Gerando cartão ${i+1} de ${lote.artefatos.length}`);
    const cv=await canvasCartao(a);const blob=await new Promise(ok=>cv.toBlob(ok,"image/png"));
    pasta.file(`${String(i+1).padStart(2,"0")}-${a.codigo}.png`,blob);
  }
  pasta.file("LEIA-ME.txt",`Cartões do ${nome}\nQuantidade: ${lote.artefatos.length}\nOs nomes numéricos preservam a ordem dos artefatos no lote.\nMolde: cartão místico oficial.\nStudio: ${VERSOES.studio}\n`);
  const blob=await zip.generateAsync({type:"blob"},m=>prog(85+m.percent*.15,`Compactando cartões ${Math.round(m.percent)}%`));
  download(blob,`CARTOES-${nome}.zip`);prog(100,`Cartões de ${nome} gerados`);toast("Todos os cartões foram gerados");
}
let indiceCartaoAtual=0;
function carregarArtefatoNoEditor(a){
  if(!a)return;
  $("codigo").value=a.codigo;$("destino").value=a.destino;$("obs").value=a.obs||"";$("estilo").value=a.estilo||"orbe";
  document.querySelectorAll(".estilo").forEach(b=>{b.classList.toggle("ativo",b.dataset.estilo===$("estilo").value);b.disabled=true});
  const p=Simbolo.desenhar(a.codigo,a.estilo||"orbe");planoAtual=p;atualizarInfo(p);aplicarQualidade();atualizarExplicacao(p);
}
function renderEditorCartoes(codigoPreferido=null){
  const ls=lotes(),selL=$("cartaoLote"),selA=$("cartaoArtefato");if(!selL||!selA)return;
  const anteriorLote=selL.value;selL.innerHTML=ls.map(l=>`<option value="${l.nome}">${l.nome} — ${l.artefatos.length} símbolos</option>`).join("");
  if(ls.some(l=>l.nome===anteriorLote))selL.value=anteriorLote;
  const lote=ls.find(l=>l.nome===selL.value)||ls[0];
  const vazio=!lote||!lote.artefatos.length;$("cartaoVazio").hidden=!vazio;
  if(vazio){selA.innerHTML="";$("cartaoProgresso").textContent="0 / 0";return}
  selL.value=lote.nome;selA.innerHTML=lote.artefatos.map(a=>`<option value="${a.codigo}">${String(a.targetIndex+1).padStart(2,"0")} · ${a.codigo}${a.cartaoRevisado?' ✓':''}</option>`).join("");
  const preferido=codigoPreferido||selA.value||lote.artefatos[0].codigo;if(lote.artefatos.some(a=>a.codigo===preferido))selA.value=preferido;
  indiceCartaoAtual=Math.max(0,lote.artefatos.findIndex(a=>a.codigo===selA.value));
  carregarArtefatoNoEditor(lote.artefatos[indiceCartaoAtual]);
  $("cartaoProgresso").textContent=`${indiceCartaoAtual+1} / ${lote.artefatos.length}`;
  const revisados=lote.artefatos.filter(a=>a.cartaoRevisado).length;if($("cardCartoes9"))$("cardCartoes9").textContent=`${revisados} / ${lote.artefatos.length} revisados`;
}
window.renderEditorCartoes=renderEditorCartoes;

$("codigo").onchange=()=>{};
$("novoCodigo").onclick=$("gerarCodigoGrande").onclick=()=>{};
$("revelar").onclick=()=>{const a=artefatoAtualCartao();if(a)carregarArtefatoNoEditor(a)};$("salvar").onclick=salvar;$("baixarPNG").onclick=baixarPNG;
$("baixarSigiloPNG").onclick=baixarSigiloPNG;$("gerarTodosCartoes").onclick=async()=>{try{await gerarTodosCartoes()}catch(e){prog(0,"Erro: "+e.message);toast(e.message)}};
$("imprimirExplicacao").onclick=$("imprimirExplicacaoTopo").onclick=imprimirExplicacao;

$("busca").oninput=render;
document.body.onclick=e=>{
  const est=e.target.closest("[data-estilo]");
  if(est){return}
  if(e.target.dataset.remove)remover(e.target.dataset.remove);
  const at=e.target.closest("[data-atalho]");if(at)document.getElementById(at.dataset.atalho).scrollIntoView({behavior:"smooth"})
};
$("gerarLote").onclick=async()=>{try{await gerarLote()}catch(e){prog(0,"Erro: "+e.message);toast(e.message)}};
$("gerarConfig").onclick=config;

const escolherMind=document.getElementById("escolherMind");
if(escolherMind)escolherMind.onclick=()=>$("arquivoMind").click();
$("arquivoMind").onchange=async e=>await definirTargetManual(e.target.files?.[0]);
$("removerMind").onclick=async()=>{const nome=loteSelecionado();targetsManuais.delete(nome);await apagarTargetPersistente(nome);$("arquivoMind").value="";atualizarTargetManualUI();toast("Target removido")};
$("dropMind").ondragover=e=>{e.preventDefault();$("dropMind").classList.add("arrastando")};
$("dropMind").ondragleave=()=>$("dropMind").classList.remove("arrastando");
$("dropMind").ondrop=async e=>{e.preventDefault();$("dropMind").classList.remove("arrastando");await definirTargetManual(e.dataTransfer.files?.[0])};
["publicarTudo","publicarTudoTopo"].forEach(id=>{
  const botao=$(id);
  if(botao)botao.onclick=async()=>{
    try{await publicarTudo()}catch(e){prog(0,"Erro: "+e.message);toast(e.message)}
  };
});
const botaoLote25=document.getElementById("novoLote25"); if(botaoLote25)botaoLote25.onclick=criarLoteCom25;
const botaoLote25Modulo=document.getElementById("criarLote25Modulo"); if(botaoLote25Modulo)botaoLote25Modulo.onclick=criarLoteCom25;
const botaoExportarLote=document.getElementById("exportarSimbolosLote"); if(botaoExportarLote)botaoExportarLote.onclick=async()=>{try{await exportarSimbolosDoLote()}catch(e){prog(0,"Erro: "+e.message);toast(e.message)}};
$("exportarDados").onclick=()=>download(new Blob([JSON.stringify(dadosCompactos(),null,2)],{type:"application/json"}),"backup-guardiao-studio-v10.json");
$("backupTopo").onclick=$("exportarDados").onclick;
$("importarDados").onchange=async e=>{try{importarBackupObjeto(JSON.parse(await e.target.files[0].text()));toast("Backup importado")}catch{toast("Backup inválido")}};
async function limparBancoTargetsCompleto(){
  targetsManuais.clear();
  bancoTargetsPromise=null;
  if (!("indexedDB" in window)) return;
  await new Promise(resolve=>{
    const req=indexedDB.deleteDatabase(DB_NOME);
    req.onsuccess=req.onerror=req.onblocked=()=>resolve();
  });
}

async function reiniciarProjeto(){
  const aviso="Esta ação apagará a biblioteca, os lotes, os PNGs guardados no navegador, os targets importados e o histórico local do Escriba. Ela NÃO apaga arquivos já publicados no GitHub. Continuar?";
  if(!window.confirm(aviso))return;
  try{
    const apagar=[];
    for(let i=0;i<localStorage.length;i++){
      const chave=localStorage.key(i);
      if(chave && (/guardiao-studio|escriba/i.test(chave))) apagar.push(chave);
    }
    apagar.forEach(chave=>localStorage.removeItem(chave));
  }catch{}
  try{sessionStorage.removeItem("escriba-biblioteca-nova")}catch{}
  await limparBancoTargetsCompleto();
  dados={versao:10,artefatos:[]};
  $("busca").value="";
  render();
  atualizarBoasVindas();
  prog(0,"Projeto reiniciado. Para zerar também o repositório, exclua manualmente a pasta AR antiga no GitHub antes de publicar a nova.");
  window.alert("Dados locais apagados. Para reiniciar também o GitHub, exclua manualmente a pasta AR antiga do repositório e depois envie a nova pasta AR gerada pelo Studio.");
  toast("Projeto reiniciado");
}

function criarBibliotecaVazia(){
  dados={versao:10,artefatos:[]};
  try{localStorage.setItem(KEY,JSON.stringify(dadosCompactos()))}catch{}
  try{sessionStorage.setItem("escriba-biblioteca-nova","1")}catch{}
  atualizarBoasVindas();
  render();
  document.querySelector('[data-modulo="inicio"]')?.click();
  prog(0,"Biblioteca criada. Próximo passo: crie o primeiro lote com 25.");
  toast("Nova biblioteca criada");
}

async function criarBibliotecaComPrimeiroLote(){
  criarBibliotecaVazia();
  await criarLoteCom25();
}

$("apagar").onclick=reiniciarProjeto;
const criarBibliotecaBtn=$("criarBiblioteca");
if(criarBibliotecaBtn)criarBibliotecaBtn.onclick=criarBibliotecaComPrimeiroLote;
const criarBibliotecaVaziaBtn=$("criarBibliotecaVazia");
if(criarBibliotecaVaziaBtn)criarBibliotecaVaziaBtn.onclick=criarBibliotecaVazia;
const restaurarBibliotecaBtn=$("restaurarBiblioteca");
const restaurarBibliotecaArquivo=$("restaurarBibliotecaArquivo");
if(restaurarBibliotecaBtn&&restaurarBibliotecaArquivo){
  restaurarBibliotecaBtn.onclick=()=>restaurarBibliotecaArquivo.click();
  restaurarBibliotecaArquivo.onchange=async e=>{
    const arquivo=e.target.files?.[0];
    if(!arquivo)return;
    try{
      importarBackupObjeto(JSON.parse(await arquivo.text()));
      try{sessionStorage.setItem("escriba-biblioteca-nova","1")}catch{}
      atualizarBoasVindas();
      document.querySelector('[data-modulo="inicio"]')?.click();
      toast("Biblioteca restaurada");
    }catch(err){
      console.error(err);
      toast("Backup inválido");
    }finally{e.target.value=""}
  };
}


const cartaoLote=$("cartaoLote"),cartaoArtefato=$("cartaoArtefato");
if(cartaoLote)cartaoLote.onchange=()=>renderEditorCartoes();
if(cartaoArtefato)cartaoArtefato.onchange=()=>renderEditorCartoes(cartaoArtefato.value);
if($("cartaoAnterior"))$("cartaoAnterior").onclick=()=>{const lote=lotes().find(l=>l.nome===$("cartaoLote").value);if(!lote)return;indiceCartaoAtual=(indiceCartaoAtual-1+lote.artefatos.length)%lote.artefatos.length;renderEditorCartoes(lote.artefatos[indiceCartaoAtual].codigo)};
if($("cartaoProximo"))$("cartaoProximo").onclick=()=>{const lote=lotes().find(l=>l.nome===$("cartaoLote").value);if(!lote)return;indiceCartaoAtual=(indiceCartaoAtual+1)%lote.artefatos.length;renderEditorCartoes(lote.artefatos[indiceCartaoAtual].codigo)};

async function iniciarStudio(){
  montarAlfabeto();
  organizar();
  render();
  sincronizarLoteAtivo();
  atualizarTargetManualUI();
  atualizarValidacaoFinal();
  renderEditorCartoes();
  prog(2,"Studio aberto. Recuperando targets guardados...");
  try{
    await carregarTargetsPersistentes();
    atualizarTargetManualUI();
    atualizarValidacaoFinal();
    prog(0,"Studio pronto");
  }catch(e){
    console.warn("Persistência de targets indisponível:",e);
    prog(0,"Studio pronto — importe o .mind nesta sessão");
  }
}
try{
  iniciarStudio();
}catch(e){
  console.error(e);
  document.body.insertAdjacentHTML("afterbegin",`<div style="position:fixed;inset:0;z-index:99999;background:#0c0906;color:#e5c77e;padding:24px;font-family:Georgia,serif"><h2>O Studio encontrou um erro ao abrir.</h2><p>${String(e.message||e)}</p><p>Recarregue a página. A biblioteca não foi apagada.</p></div>`);
}
})();