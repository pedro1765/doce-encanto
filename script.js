// Botões Comprar
const botoes = document.querySelectorAll(".card button");

botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        alert("🍫 Produto adicionado ao pedido!");
        document.getElementById("pedido").scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Finalizar pedido
const formulario = document.querySelector("form");

formulario.addEventListener("submit", function(e){
    e.preventDefault();

    const nome = document.querySelector("input[type='text']").value;

    if(nome == ""){
        alert("Digite seu nome.");
        return;
    }

    alert("✅ Pedido enviado com sucesso!\n\nObrigado por comprar na Doce Encanto!");
});
