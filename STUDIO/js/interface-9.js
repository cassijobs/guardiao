(() => {
  const $ = id => document.getElementById(id);
  const modulos = ['inicio','criacao','biblioteca','lotesModulo','publicacao','historicoModulo','backup','escrita'];

  function mostrarModulo(id){
    if(!modulos.includes(id)) id='inicio';
    document.body.classList.add('modo-modulos9');
    modulos.forEach(nome => {
      const el=$(nome);
      if(el) el.classList.toggle('modulo-ativo9', nome===id);
    });
    document.querySelectorAll('[data-modulo]').forEach(b=>b.classList.toggle('nav-ativo', b.dataset.modulo===id && b.closest('nav')));
    window.scrollTo({top:0,behavior:'instant'});
    history.replaceState(null,'','#'+id);
    if(id==='criacao' && typeof window.renderEditorCartoes==='function') window.renderEditorCartoes();
    atualizarResumo();
  }

  function totalArtefatos(){
    const n=parseInt(($('total')?.textContent||'0').replace(/\D/g,''),10);
    return Number.isFinite(n)?n:0;
  }
  function totalLotes(){
    const n=parseInt(($('qtdLotes')?.textContent||'0').replace(/\D/g,''),10);
    return Number.isFinite(n)?n:0;
  }
  function mindPronto(){
    const t=$('mindStatus')?.textContent||'';
    return /validado|símbolos|targets encontrados/i.test(t) && !/aguardando|não importado/i.test(t);
  }
  function atualizarResumo(){
    const total=totalArtefatos(), lotes=totalLotes(), pronto=mindPronto();
    if($('cardTotal9')) $('cardTotal9').textContent=`${total} registrado${total===1?'':'s'}`;
    if($('cardLotes9')) $('cardLotes9').textContent=`${lotes} lote${lotes===1?'':'s'}`;
    const estado=$('estadoGeral9'), tit=$('proximoTitulo9'), txt=$('proximoTexto9'), bot=$('proximoBotao9'), pub=$('cardPublicacao9');
    let alvo='lotesModulo';
    if(total===0){
      estado && (estado.className='estado9 aguardando', estado.querySelector('span').textContent='Biblioteca pronta para começar');
      tit && (tit.textContent='Criar o primeiro lote com 25');
      txt && (txt.textContent='Gere 25 identidades de uma vez e prepare a produção em grupo.');
      pub && (pub.textContent='Aguardando artefato');
    } else if(!pronto){
      alvo='publicacao';
      estado && (estado.className='estado9 atencao', estado.querySelector('span').textContent='Lote aguardando compilação');
      tit && (tit.textContent='Preparar o lote para publicação');
      txt && (txt.textContent='Confira a ordem, compile os símbolos e importe o arquivo targets.mind.');
      pub && (pub.textContent='Continuar publicação');
    } else {
      alvo='publicacao';
      estado && (estado.className='estado9 pronto', estado.querySelector('span').textContent='Compilação pronta para validar');
      tit && (tit.textContent='Validar e gerar o pacote AR');
      txt && (txt.textContent='O targets.mind foi recebido. Conclua a validação e gere o ZIP.');
      pub && (pub.textContent='Pronto para validar');
    }
    if(bot) bot.onclick=()=>{
      if(total===0 && document.getElementById('novoLote25')) document.getElementById('novoLote25').click();
      else mostrarModulo(alvo);
    };
  }

  document.addEventListener('click', e=>{
    const b=e.target.closest('[data-modulo]');
    if(!b)return;
    e.preventDefault();
    mostrarModulo(b.dataset.modulo);
  });


  const obs=new MutationObserver(atualizarResumo);
  ['total','qtdLotes','mindStatus','validacaoFinal'].forEach(id=>{const e=$(id);if(e)obs.observe(e,{subtree:true,childList:true,characterData:true,attributes:true})});
  window.addEventListener('load',()=>{
    document.querySelector('.metricas')?.classList.add('metricas-ocultas9');
    mostrarModulo(location.hash.slice(1)||'inicio');
    setTimeout(atualizarResumo,500);
  });
})();
