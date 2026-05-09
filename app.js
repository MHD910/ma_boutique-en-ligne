let iconcart = document.querySelector(".icon-cart");
let body = document.querySelector("body");
let closecart = document.querySelector(".close");
let listproducthtml = document.querySelector(".listproduct");
let listcarthtml = document.querySelector(".listcart"); 
let iconcartspan = document.querySelector(".icon-cart span");
let totalValueHtml = document.querySelector(".totalValue");

// Éléments pour le Checkout et la Modal
let checkoutButton = document.querySelector(".checkout");
let paymentModal = document.getElementById("payment-modal");
let paymentAmount = document.getElementById("payment-amount");

let listproduct = [];
let cart = [];

// Ouvrir/Fermer le panier
iconcart.addEventListener('click', () => {
    body.classList.toggle('showcart');
});

closecart.addEventListener('click', () => {
    body.classList.toggle('showcart');
});

// Afficher les produits de la boutique
const addDataToHTML = () => {
    listproducthtml.innerHTML = ''; 
    if (listproduct.length > 0) {
        listproduct.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add("item");
            newProduct.dataset.id = product.id;

            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="add-cart">
                    Ajouter au panier 
                </button>`;
            listproducthtml.appendChild(newProduct); 
        });
    }
};

// Ajouter au panier
listproducthtml.addEventListener("click", (even) => {
    let positionclick = even.target;
    if (positionclick.classList.contains("add-cart")) {
        let product_id = positionclick.parentElement.dataset.id;
        addTocart(product_id);
    }
})

const addTocart = (product_id) => {
    let positionthisproductIncart = cart.findIndex((value) => value.product_id == product_id);

    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }]
    } else if (positionthisproductIncart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionthisproductIncart].quantity = cart[positionthisproductIncart].quantity + 1;
    }
    addcartTohtml();
}

// Mettre à jour le panier HTML et le Total
const addcartTohtml = () => {
    listcarthtml.innerHTML = "";
    let totalquantity = 0;
    let totalPrice = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            totalquantity = totalquantity + item.quantity;
            
            let positionproduct = listproduct.findIndex((value) => value.id == item.product_id);
            let info = listproduct[positionproduct];
            
            totalPrice = totalPrice + (info.price * item.quantity);

            let newcart = document.createElement('div');
            newcart.classList.add("item");
            newcart.dataset.id = item.product_id;

            newcart.innerHTML = `
                <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalprice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>`;
            listcarthtml.appendChild(newcart);
        })
    }
    iconcartspan.innerText = totalquantity;
    totalValueHtml.innerText = '$' + totalPrice;
}

// Gestion des boutons + et -
listcarthtml.addEventListener('click', (even) => {
    let positionclick = even.target;
    if (positionclick.classList.contains("minus") || positionclick.classList.contains("plus")) {
        let product_id = positionclick.parentElement.parentElement.dataset.id;
        let type = positionclick.classList.contains('plus') ? 'plus' : 'minus';
        changequantity(product_id, type);
    }
})

const changequantity = (product_id, type) => {
    let positionitemIncart = cart.findIndex((value) => value.product_id == product_id);
    if (positionitemIncart >= 0) {
        switch (type) {
            case 'plus': 
                cart[positionitemIncart].quantity = cart[positionitemIncart].quantity + 1;
                break;

            default: 
                let valuechange = cart[positionitemIncart].quantity - 1;
                if (valuechange > 0) {
                    cart[positionitemIncart].quantity = valuechange;
                } else {
                    cart.splice(positionitemIncart, 1);
                }
                break;
        }
    }
    addcartTohtml(); 
}

// LOGIQUE DU CHECKOUT
checkoutButton.addEventListener("click", () => {
    if (cart.length > 0) {
        paymentAmount.innerText = totalValueHtml.innerText;
        paymentModal.style.display = "flex";
    } else {
        alert("Votre panier est vide !");
    }
});

const closePayment = () => {
    paymentModal.style.display = "none";
}

const processPayment = (methode) => {
    alert(`Merci ! Paiement par ${methode} accepté.`);
    cart = []; // Vide le panier
    addcartTohtml();
    closePayment();
    body.classList.remove('showcart');
}

// Initialisation
const initApp = () => {
    fetch("product.json")
        .then(response => response.json())
        .then(data => {
            listproduct = data;
            addDataToHTML();
        });
};

initApp();
