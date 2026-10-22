
/* ==================================
   DOCE SABOR - CARRINHO E PEDIDOS
================================== */

// IMPORTANTE:
// Troque pelo WhatsApp da loja, com código do país e DDD.
// Use apenas números, sem espaços, +, parênteses ou traços.
const WHATSAPP_NUMBER = "55DDNUMERO";

const produtos = [
    { nome: "Brigadeiros Gourmet", preco: 3.50 },
    { nome: "Bolos Decorados", preco: 65.00 },
    { nome: "Trufas Recheadas", preco: 5.00 },
    { nome: "Brownies", preco: 7.00 },
    { nome: "Cupcakes e Sobremesas", preco: 8.00 },
    { nome: "Caixas de Doces", preco: 35.00 }
];

const carrinho = [];

function dinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Criar a área do carrinho
const secaoCarrinho = document.createElement("section");
secaoCarrinho.id = "carrinho";
secaoCarrinho.className = "pedido";

secaoCarrinho.innerHTML = `
    <p class="subtitulo">SEUS FAVORITOS</p>
    <h2>Meu carrinho</h2>
    <div id="itens-carrinho">
        <p>Seu carrinho está vazio.</p>
    </div>
    <h3 id="total-carrinho">Total: R$ 0,00</h3>
    <button type="button" id="limpar-carrinho" class="botao">
        LIMPAR CARRINHO
    </button>
`;

const secaoPedido = document.getElementById("pedido");
secaoPedido.parentNode.insertBefore(secaoCarrinho, secaoPedido);

// Adicionar botões aos produtos
document.querySelectorAll(".produto").forEach((cartao, indice) => {
    const produto = produtos[indice];
    if (!produto) return;

    const preco = cartao.querySelector(".preco");
    if (preco) preco.textContent = dinheiro(produto.preco);

    const botaoAntigo = cartao.querySelector(".botao-produto");
    if (botaoAntigo) botaoAntigo.remove();

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-produto";
    botao.textContent = "ADICIONAR AO CARRINHO";

    botao.addEventListener("click", () => {
        const item = carrinho.find(
            produtoCarrinho => produtoCarrinho.nome === produto.nome
        );

        if (item) {
            item.quantidade++;
        } else {
            carrinho.push({
                ...produto,
                quantidade: 1
            });
        }

        atualizarCarrinho();
        secaoCarrinho.scrollIntoView({ behavior: "smooth" });
    });

    cartao.querySelector(".produto-info").appendChild(botao);
});

// Mostrar produtos e total
function atualizarCarrinho() {
    const area = document.getElementById("itens-carrinho");
    const totalElemento = document.getElementById("total-carrinho");

    if (carrinho.length === 0) {
        area.innerHTML = "<p>Seu carrinho está vazio.</p>";
    } else {
        area.innerHTML = carrinho.map((item, indice) => `
            <div style="border-bottom:1px solid #666;padding:12px 0">
                <strong>${item.nome}</strong>
                <p>${dinheiro(item.preco)} por unidade</p>
                <label>
                    Quantidade:
                    <input
                        type="number"
                        min="1"
                        step="1"
                        value="${item.quantidade}"
                        data-indice="${indice}"
                        class="quantidade-carrinho"
                        style="width:80px;padding:6px"
                    >
                </label>
                <button
                    type="button"
                    data-remover="${indice}"
                    class="botao-produto"
                >
                    REMOVER
                </button>
                <p>Subtotal: ${dinheiro(item.preco * item.quantidade)}</p>
            </div>
        `).join("");
    }

    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade,
        0
    );

    totalElemento.textContent = "Total: " + dinheiro(total);
}

document.getElementById("itens-carrinho").addEventListener("change", evento => {
    if (!evento.target.matches(".quantidade-carrinho")) return;

    const indice = Number(evento.target.dataset.indice);
    const quantidade = Number(evento.target.value);

    if (!Number.isInteger(quantidade) || quantidade < 1) {
        atualizarCarrinho();
        return;
    }

    carrinho[indice].quantidade = quantidade;
    atualizarCarrinho();
});

document.getElementById("itens-carrinho").addEventListener("click", evento => {
    const botao = evento.target.closest("[data-remover]");
    if (!botao) return;

    carrinho.splice(Number(botao.dataset.remover), 1);
    atualizarCarrinho();
});

document.getElementById("limpar-carrinho").addEventListener("click", () => {
    carrinho.length = 0;
    atualizarCarrinho();
});

// Criar formulário de entrega e pedido
secaoPedido.innerHTML = `
    <p class="subtitulo">FINALIZE SUA COMPRA</p>
    <h2>Entrega do pedido</h2>
    <p>Preencha os dados para enviar seu pedido pelo WhatsApp.</p>

    <form id="form-finalizar" class="formulario-pedido">
        <label for="cliente">Nome completo</label>
        <input id="cliente" name="cliente" required>

        <label for="telefone">Telefone para contato</label>
        <input id="telefone" name="telefone" type="tel" required>

        <label for="cep">CEP</label>
        <input id="cep" name="cep" inputmode="numeric" required>

        <label for="estado">Estado</label>
        <input id="estado" name="estado" required>

        <label for="cidade">Cidade</label>
        <input id="cidade" name="cidade" required>

        <label for="bairro">Bairro</label>
        <input id="bairro" name="bairro" required>

        <label for="rua">Rua ou avenida</label>
        <input id="rua" name="rua" required>

        <label for="numero">Número</label>
        <input id="numero" name="numero" required>

        <label for="complemento">Complemento (opcional)</label>
        <input id="complemento" name="complemento">

        <label for="observacoes">Observações do pedido</label>
        <textarea id="observacoes" name="observacoes" rows="3"></textarea>

        <button type="submit" class="botao">
            ENVIAR PEDIDO PELO WHATSAPP
        </button>
    </form>
`;

document.getElementById("form-finalizar").addEventListener("submit", evento => {
    evento.preventDefault();

    if (carrinho.length === 0) {
        alert("Adicione pelo menos um doce ao carrinho antes de finalizar.");
        secaoCarrinho.scrollIntoView({ behavior: "smooth" });
        return;
    }

    if (!/^\d{12,13}$/.test(WHATSAPP_NUMBER) ||
        WHATSAPP_NUMBER.includes("DD")) {
        alert(
            "Configure o número do WhatsApp da loja no arquivo script.js antes de receber pedidos."
        );
        return;
    }

    const formulario = new FormData(evento.target);
    const dados = Object.fromEntries(formulario.entries());

    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade,
        0
    );

    const linhasProdutos = carrinho.map(item =>
        `- ${item.nome} | Quantidade: ${item.quantidade} | Subtotal: ${
            dinheiro(item.preco * item.quantidade)
        }`
    );

    const mensagem = [
        "Olá! Quero fazer um pedido na Doce Sabor.",
        "",
        "PRODUTOS:",
        ...linhasProdutos,
        "",
        `TOTAL DOS PRODUTOS: ${dinheiro(total)}`,
        "",
        "DADOS PARA ENTREGA:",
        `Nome: ${dados.cliente}`,
        `Telefone: ${dados.telefone}`,
        `CEP: ${dados.cep}`,
        `Estado: ${dados.estado}`,
        `Cidade: ${dados.cidade}`,
        `Bairro: ${dados.bairro}`,
        `Rua: ${dados.rua}`,
        `Número: ${dados.numero}`,
        `Complemento: ${dados.complemento || "Não informado"}`,
        `Observações: ${dados.observacoes || "Nenhuma"}`,
        "",
        "Por favor, confirme a disponibilidade, o valor da entrega e o total final."
    ].join("\n");

    const url = "https://wa.me/" + WHATSAPP_NUMBER +
        "?text=" + encodeURIComponent(mensagem);

    window.open(url, "_blank", "noopener,noreferrer");
});

atualizarCarrinho();
