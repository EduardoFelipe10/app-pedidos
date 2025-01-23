// Função para exibir os itens no carrinho
function renderCartItems() {
    const cartList = document.getElementById("cart-list");
    const totalPriceElement = document.getElementById("total-price");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartList.innerHTML = ""; // Limpa a lista antes de renderizar novamente


    let totalPrice = 0; // Variável para acumular o preço total

    cart.forEach((product, index) => {
        const row = document.createElement("tr");

        // Calcula o total do preço por quantidade
        const productTotal = parseFloat(product.price.replace("R$", "").replace(",", ".")) * product.quantity;
        totalPrice += productTotal; // Acumula o valor total

        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" width="100"></td>
            <td>${product.name}</td>
            <td>${product.size}</td>
            <td>${product.color}</td>
            <td>${product.quantity}</td>
            <td>R$ ${productTotal.toFixed(2)}</td>
            <td><button class="remove-from-cart-btn" data-index="${index}">Remover</button></td>
        `;
        

        cartList.appendChild(row);
    });

    // Atualiza o valor total no HTML
    totalPriceElement.textContent = `R$ ${totalPrice.toFixed(2)}`;

    initializeRemoveButtons();
}


// Função para inicializar os botões de remoção
function initializeRemoveButtons() {
    const removeButtons = document.querySelectorAll(".remove-from-cart-btn");

    removeButtons.forEach((button) => {
        button.addEventListener("click", function() {
            const index = button.getAttribute("data-index");
            removeFromCart(index);
        });
    });
}

// Função para remover item do carrinho
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1); // Remove o item do array
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
}

// Função para limpar o carrinho
function clearCart() {
    localStorage.removeItem("cart");
    renderCartItems();
}

// Função para gerar o PDF e salvar
// Função para gerar o PDF e salvar
// Função para gerar o PDF e salvar
function generatePDF(cart) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.addImage('https://play-lh.googleusercontent.com/gQP5mzSbvHGED22PEQ7V-efl08uKrJamU-ak24mjY4SxJHZ6e20vmSgrFplic2niThlD', 'PNG', 10, 10, 50, 30);
    doc.setFontSize(14); // Reduz o tamanho da fonte para evitar corte
    const marginLeft = 10;
    let startY = 50; // Posição vertical inicial para os itens

    doc.text("Pedido de Compras", marginLeft, startY);
    doc.setFontSize(10); // Tamanho da fonte para o restante do conteúdo
    startY += 10;
    doc.text(`Data: ${new Date().toLocaleString()}`, marginLeft, startY);

    startY += 10;
    doc.text("Itens do pedido:", marginLeft, startY);

    // Definição das colunas
    const colWidths = [20, 20, 20, 20, 20]; // Largura das colunas (ajustável)
    const headers = ['Produto', 'Tamanho', 'Cor', 'Quantidade', 'Preço'];

    // Desenha o cabeçalho da tabela
    let headerY = startY + 10;
    headers.forEach((header, index) => {
        doc.text(header, marginLeft + (index * colWidths[index]), headerY);
    });

    // Variável para acumular o preço total
    let totalPrice = 0;
    let rowY = headerY + 10; // Posição inicial da primeira linha da tabela

    // Preenche as linhas com os produtos do carrinho
   // Preenche as linhas com os produtos do carrinho
cart.forEach((product) => {
    const productTotal = parseFloat(product.price.replace("R$", "").replace(",", ".")) * product.quantity;
    totalPrice += productTotal; // Soma o preço total

    // Desenha as colunas para cada produto
    doc.text(product.reference, marginLeft, rowY); // Alterado para exibir a referência
    doc.text(product.size, marginLeft + colWidths[0], rowY); // Tamanho
    doc.text(product.color, marginLeft + colWidths[0] + colWidths[1], rowY); // Cor
    doc.text(product.quantity.toString(), marginLeft + colWidths[0] + colWidths[1] + colWidths[2], rowY); // Quantidade
    doc.text(`R$ ${productTotal.toFixed(2)}`, marginLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], rowY); // Preço

    rowY += 10; // Move a linha para a próxima posição
});

    // Adiciona o total do pedido no PDF
    rowY += 10; // Adiciona um espaço antes de mostrar o total
    doc.text(`Total do Pedido: R$ ${totalPrice.toFixed(2)}`, marginLeft, rowY);

    // Salva o PDF
    doc.save("pedido.pdf");
}

// Função para enviar o pedido
function submitOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("O carrinho está vazio. Não é possível enviar um pedido vazio.");
        return;
    }

    // Simulando o envio do pedido
    const orderData = {
        orderDate: new Date().toLocaleString(),
        items: cart
    };

    localStorage.setItem("submittedOrder", JSON.stringify(orderData));
    localStorage.removeItem("cart"); // Limpa o carrinho após enviar o pedido
    renderCartItems(); // Atualiza a lista de itens no carrinho

    const orderMessage = document.getElementById("order-message");
    orderMessage.textContent = "Pedido enviado com sucesso!";

    // Gera e salva o PDF do pedido
    generatePDF(cart);
}

// Inicializando os eventos e renderizando o carrinho quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function() {
    renderCartItems();

    const clearCartButton = document.getElementById("clear-cart-btn");
    clearCartButton.addEventListener("click", clearCart);

    const submitOrderButton = document.getElementById("submit-order-btn");
    submitOrderButton.addEventListener("click", submitOrder);
});
