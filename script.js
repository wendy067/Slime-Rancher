/**
* GLOSSÁRIO DIDÁTICO DE JAVASCRIPT EM CÓDIGO - SLIME RANCHER SHOP
* Módulos adaptados sem marcadores ou mensagens artificiais.
*/

// ============================================================================
// PARTE 1: MODO ESCURO (Manipulação de Classes e Persistência com localStorage)
// ============================================================================
const botaoTema = document.querySelector("#btn-alternar-tema");
const elementoCorpo = document.body;
const temaSalvoNoNavegador = localStorage.getItem("slimerancher_theme");

if (temaSalvoNoNavegador === "escuro") {
    elementoCorpo.classList.add("modo-escuro");
    if (botaoTema) botaoTema.textContent = "Modo claro";
}

if (botaoTema) {
    botaoTema.addEventListener("click", () => {
        elementoCorpo.classList.toggle("modo-escuro");
        const estaNoModoEscuro = elementoCorpo.classList.contains("modo-escuro");
        if (estaNoModoEscuro) {
            botaoTema.textContent = "Modo claro";
            localStorage.setItem("slimerancher_theme", "escuro");
        } else {
            botaoTema.textContent = "Modo escuro";
            localStorage.setItem("slimerancher_theme", "claro");
        }
    });
}

// ============================================================================
// PARTE 2: MODAL E CTA DE LOGIN (Eventos e Validação de Formulário Corrigida)
// ============================================================================
const botaoCadastrarLivro = document.querySelector(".cta-cadastrar-livro");
const janelaModalCadastro = document.querySelector("#modal-cadastro");
const botaoFecharModal = document.querySelector("#fechar-modal");
const formularioModal = document.querySelector("#form-cadastro-livro");
const inputTituloLivro = document.querySelector("#input-titulo");
const mensagemFeedbackModal = document.querySelector("#feedback-modal");

if (botaoCadastrarLivro) {
    botaoCadastrarLivro.addEventListener("click", (eventoDeClique) => {
        eventoDeClique.preventDefault();
        janelaModalCadastro.classList.add("modal-ativo");
    });
}

if (botaoFecharModal) {
    botaoFecharModal.addEventListener("click", () => {
        janelaModalCadastro.classList.remove("modal-ativo");
        mensagemFeedbackModal.textContent = "";
        formularioModal.reset();
    });
}

if (formularioModal && inputTituloLivro && mensagemFeedbackModal) {
    formularioModal.addEventListener("submit", (eventoDeSubmissao) => {
        eventoDeSubmissao.preventDefault();
        
        // Pega o valor digitado e limpa espaços vazios
        const emailUsuario = inputTituloLivro.value.trim();

        // VALIDAÇÃO CORRETA: Verifica se não está vazio, se tem @ e se tem .com
        if (emailUsuario !== "" && emailUsuario.includes("@") && emailUsuario.includes(".com")) {
            localStorage.setItem("slimerancher_user_logged", "true");
            mensagemFeedbackModal.style.color = "#16a34a";
            mensagemFeedbackModal.textContent = `Acesso liberado para ${emailUsuario}. O desconto de 15% OFF foi aplicado ao cesto.`;
            
            if (typeof atualizarCalculosCarrinho === "function") {
                atualizarCalculosCarrinho();
            }

            setTimeout(() => {
                janelaModalCadastro.classList.remove("modal-ativo");
                mensagemFeedbackModal.textContent = "";
                formularioModal.reset();
            }, 2500);
        } else {
            // Mensagem caso o e-mail não tenha @ ou .com
            mensagemFeedbackModal.style.color = "#dc2626";
            mensagemFeedbackModal.textContent = "Por favor, insira um e-mail válido contendo '@' e '.com'.";
        }
    });
}


// ============================================================================
// COMPONENTE ADICIONAL: GERENCIADOR DO CARRINHO DE COMPRAS
// ============================================================================
const botoesAdicionar = document.querySelectorAll(".btn-adicionar-carrinho");
const listaCarrinhoHTML = document.querySelector("#lista-itens-carrinho");
const precoTotalHTML = document.querySelector("#preco-total-carrinho");
const botaoFinalizar = document.querySelector("#btn-finalizar-compra");
const feedbackCheckout = document.querySelector("#checkout-feedback");
const contadorNavCarrinho = document.querySelector("#contador-nav-carrinho");

let itensNoCarrinho = [];

function atualizarCalculosCarrinho() {
    if (!listaCarrinhoHTML) return;

    let somaTotal = 0;
    listaCarrinhoHTML.innerHTML = "";

    if (itensNoCarrinho.length === 0) {
        listaCarrinhoHTML.innerHTML = `<li class="carrinho-vazio-texto">Seu cesto está vazio. Adicione itens do catálogo acima.</li>`;
        botaoFinalizar.setAttribute("disabled", "true");
    } else {
        botaoFinalizar.removeAttribute("disabled");

        itensNoCarrinho.forEach((item) => {
            somaTotal += item.preco;
            const li = document.createElement("li");
            li.classList.add("carrinho-item");
            li.innerHTML = `<span>${item.nome}</span> <span>R$ ${item.preco.toFixed(2).replace('.', ',')}</span>`;
            listaCarrinhoHTML.appendChild(li);
        });
    }

    const checarLogin = localStorage.getItem("slimerancher_user_logged");
    if (checarLogin === "true") {
        somaTotal = somaTotal * 0.85;
    }

    precoTotalHTML.textContent = `R$ ${somaTotal.toFixed(2).replace('.', ',')}`;
    contadorNavCarrinho.textContent = `Itens: ${itensNoCarrinho.length}`;
}

botoesAdicionar.forEach((botao) => {
    botao.addEventListener("click", () => {
        const nomeProduto = botao.getAttribute("data-name") || botao.dataset.nome;
        const precoProduto = parseFloat(botao.getAttribute("data-price") || botao.dataset.preco);

        itensNoCarrinho.push({ nome: nomeProduto, preco: precoProduto });
        atualizarCalculosCarrinho();
    });
});

if (botaoFinalizar) {
    botaoFinalizar.addEventListener("click", async () => {
        botaoFinalizar.setAttribute("disabled", "true");
        botaoFinalizar.textContent = "Processando transação...";
        feedbackCheckout.style.color = "var(--primary-bubble)";
        feedbackCheckout.textContent = "Verificando dados no sistema central...";

        try {
            await new Promise((resolver) => setTimeout(resolver, 2000));
            feedbackCheckout.textContent = "Pedido finalizado com sucesso. Itens enviados via Vac-Pack.";
            itensNoCarrinho = [];
            atualizarCalculosCarrinho();
        } catch (erro) {
            feedbackCheckout.textContent = "Ocorreu um erro ao processar o pedido. Tente novamente.";
        } finally {
            botaoFinalizar.textContent = "Finalizar Encomenda";
        }
    });
}

// ============================================================================
// PARTE 3: ALERTA DINÂMICO (Criação de Elementos via DOM e Inserção com prepend)
// ============================================================================
const secaoDestaqueHero = document.querySelector(".secao-hero");

function dispararAlertaInstitucional() {
    if (!secaoDestaqueHero || document.querySelector(".alerta-sistema-banner")) return;

    const bannerAlerta = document.createElement("div");
    bannerAlerta.classList.add("alerta-sistema-banner");

    const textoAlerta = document.createElement("p");
    textoAlerta.innerHTML = "Realize o login na plataforma para desbloquear vantagens exclusivas no catálogo.";

    const botaoFecharAlerta = document.createElement("button");
    botaoFecharAlerta.textContent = "×";
    botaoFecharAlerta.classList.add("btn-fechar-alerta");

    botaoFecharAlerta.addEventListener("click", () => {
        bannerAlerta.remove();
    });

    bannerAlerta.appendChild(textoAlerta);
    bannerAlerta.appendChild(botaoFecharAlerta);

    secaoDestaqueHero.prepend(bannerAlerta);
}
if (secaoDestaqueHero) {
    setTimeout(dispararAlertaInstitucional, 2000);
}

// ============================================================================
// PARTE 4: FILTRO INTERATIVO (Busca em Tempo Real sobre Coleções de Elementos)
// ============================================================================
const inputCampoBusca = document.querySelector("#filtro-busca-livros");
const colecaoDeCardsLivros = document.querySelectorAll(".grade-catalogo .card-livro");
const avisoNenhumResultado = document.querySelector("#aviso-sem-resultados");

if (inputCampoBusca && colecaoDeCardsLivros.length > 0) {
    inputCampoBusca.addEventListener("input", (eventoTeclado) => {
        const termoPesquisado = eventoTeclado.target.value.toLowerCase().trim();
        let contadorVisiveis = 0;

        colecaoDeCardsLivros.forEach((cardAtual) => {
            const conteudoTextoCard = cardAtual.textContent.toLowerCase();

            if (conteudoTextoCard.includes(termoPesquisado)) {
                cardAtual.style.display = "flex";
                contadorVisiveis++;
            } else {
                cardAtual.style.display = "none";
            }
        });

        if (avisoNenhumResultado) {
            avisoNenhumResultado.style.display = (contadorVisiveis === 0) ? "block" : "none";
        }
    });
}

// ============================================================================
// PARTE 5: GERENCIADOR DE TAREFAS (Manipulação de Arrays e Persistência Local)
// ============================================================================
const formularioGerenciadorTarefas = document.querySelector("#form-tarefa-biblioteca");
const inputTextoTarefa = document.querySelector("#input-texto-tarefa");
const listaDeTarefasRenderizada = document.querySelector("#lista-de-tarefas");
let arrayDeTarefasDoUsuario = JSON.parse(localStorage.getItem("slimerancher_tasks")) || [];

function persistirAtualizarInterfaceTarefas() {
    localStorage.setItem("slimerancher_tasks", JSON.stringify(arrayDeTarefasDoUsuario));
    renderizarListaDeTarefas();
}

function renderizarListaDeTarefas() {
    if (!listaDeTarefasRenderizada) return;
    listaDeTarefasRenderizada.innerHTML = "";

    arrayDeTarefasDoUsuario.forEach((itemTarefa, indiceDoItem) => {
        const itemListaLi = document.createElement("li");
        itemListaLi.classList.add("item-tarefa-estilo");
        if (itemTarefa.concluida) {
            itemListaLi.classList.add("tarefa-concluida");
        }
        const spanTextoTarefa = document.createElement("span");
        spanTextoTarefa.textContent = itemTarefa.texto;
        spanTextoTarefa.addEventListener("click", () => {
            arrayDeTarefasDoUsuario[indiceDoItem].concluida = !arrayDeTarefasDoUsuario[indiceDoItem].concluida;
            persistirAtualizarInterfaceTarefas();
        });
        const botaoExcluirItem = document.createElement("button");
        botaoExcluirItem.textContent = "🗑️";
        botaoExcluirItem.classList.add("btn-deletar-tarefa");
        botaoExcluirItem.addEventListener("click", () => {
            arrayDeTarefasDoUsuario.splice(indiceDoItem, 1);
            persistirAtualizarInterfaceTarefas();
        });
        itemListaLi.appendChild(spanTextoTarefa);
        itemListaLi.appendChild(botaoExcluirItem);
        listaDeTarefasRenderizada.appendChild(itemListaLi);
    });
}
if (formularioGerenciadorTarefas) {
    formularioGerenciadorTarefas.addEventListener("submit", (eventoFormulario) => {
        eventoFormulario.preventDefault();
        const textoDigitadoNaTarefa = inputTextoTarefa.value.trim();
        if (textoDigitadoNaTarefa !== "") {
            arrayDeTarefasDoUsuario.push({ texto: textoDigitadoNaTarefa, concluida: false });
            inputTextoTarefa.value = "";
            persistirAtualizarInterfaceTarefas();
        }
    });
}
renderizarListaDeTarefas();
// ============================================================================
// PARTE 6: SIMULADOR DE IA (Programação Assíncrona com async/await e Arrays locais)
// ============================================================================
const botaoGerarRecomendacaoIA = document.querySelector("#btn-generar-ia");
const containerResultadoIA = document.querySelector("#resultado-ia-box");
const textoSaidaGeradoIA = document.querySelector("#texto-saida-ia");
const bancoDeInsightsEmPortugues = [
    "Análise de Mercado: A valorização dos Plorts de Slime Tigre indica uma excelente oportunidade para adquirir a variação em pelúcia.",
    "Tendência Econômica: A produção de Slimes de Mel apresentou alta no mercado interno do jogo. Verifique a disponibilidade de chaveiros.",
    "Aviso Técnico: Padrões ideais de gerenciamento indicam a separação estrita de currais para otimização da coleta de recursos."
];
if (botaoGerarRecomendacaoIA) {
    botaoGerarRecomendacaoIA.addEventListener("click", async () => {
        botaoGerarRecomendacaoIA.setAttribute("disabled", "true");
        botaoGerarRecomendacaoIA.textContent = "Analisando mercado...";
        containerResultadoIA.style.display = "block";
        textoSaidaGeradoIA.textContent = "Acessando os dados do mercado de plorts...";
        try {
            await new Promise((resolverPromessa) => setTimeout(resolverPromessa, 1500));
            const indiceAleatorioSorteado = Math.floor(Math.random() * bancoDeInsightsEmPortugues.length);
            textoSaidaGeradoIA.textContent = bancoDeInsightsEmPortugues[indiceAleatorioSorteado];
        } catch (erroDeExecucao) {
            textoSaidaGeradoIA.textContent = "Não foi possível estabelecer contato com o servidor do mercado.";
        } finally {
            botaoGerarRecomendacaoIA.removeAttribute("disabled");
            botaoGerarRecomendacaoIA.textContent = "Gerar Nova Recomendação";
        }
    });
}
