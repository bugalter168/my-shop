const mainBlock = document.querySelector("main.items");

function showCart() {
    const shopBlock = document.querySelector(".shop-cart-block"); /*получаем ссылки на корзину*/ 

    shopBlock.classList.toggle("active"); /*toggle добавляет если нет, или убирает если есть класс*/ 

    if (shopBlock.classList.contains("active"))
        mainBlock.style.width = "60%";
    else
        mainBlock.style.width = "90%";
}

let items = []
async function loadData() {
    await fetch("http://localhost:3000/api/shop-items")
    .then(res => {return res.json()})
    .then(data => {
        items = data
        
        data.forEach(item => {
          mainBlock.innerHTML += `<div class="item">
                    <img src="img/${item.img}">
                    <a href="/public/product.html?id=${item.id}"><h4>${item.name} - ${item.price}$</h4></a>
                    <p>${item.desc}</p>
                    <div class="add-to-cart" onclick="addToCart(${item.id})"><i class="fas fa-cart-plus"></i></div>
                </div>`;
        });
        // console.log(items);
    })
}

loadData()

let shopCart = [];
if (localStorage.getItem("shopCart") != undefined) {
    shopCart = JSON.parse(localStorage.getItem("shopCart"));
    showCart();
    updateShopCart();
}

function addToCart(id) {
    let itemInCart = shopCart.find((item) => item.id == id);
    if (itemInCart) {
        changeCountItems('+', id);
    } else {
        let item = items.find((item) => item.id == id);/*ищем один определенный елемент, у которого id совпадает id переным в функцию */
        shopCart.push({
            ...item,
            count: 1
        });
    }

    updateShopCart();
}

function updateShopCart() {
    const shopCartItems = document.querySelector("#shop-cart");
    shopCartItems.innerHTML = "";/*очищяем обьект от информациии*/

    let elementCount = 0, totalPrice = 0;
    shopCart.forEach((el) => {
        shopCartItems.innerHTML += `<div class="shop-item">
                <div class="info">
                    <img src="img/${el.img}" alt="${el.name}">
                    <span class="title">${el.name}</span>
                </div>
                <div class="price">${el.price}$</div>
                <div class="count">
                    <button class="minus" onclick="changeCountItems('-', ${el.id})">-</button>
                    <span>${el.count}</span>
                    <button class="plus" onclick="changeCountItems('+', ${el.id})">+</button>
                </div>
            </div>`;

        elementCount += el.count;
        totalPrice += el.price * el.count;
    });

    let ft = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    document.querySelector("#count-items").textContent = elementCount;
    document.querySelector(".go-shop b").textContent = ft.format(totalPrice);

    localStorage.setItem("shopCart", JSON.stringify(shopCart));
}

function changeCountItems(action, id) {
    let item = shopCart.find((item) => item.id == id);
    if (action == '-' && item.count > 1)
        item.count--;
    else if (action == '+' && item.count < item.leftItems)
        item.count++;
    else if (action == '-' && item.count == 1)/*удаление товара из корзины если он там один оставался*/ 
        shopCart = shopCart.filter((item) => item.id != id);

    updateShopCart();
}

async function makeOrder() {
    let insertOrder = []
    shopCart.forEach(el => {
        insertOrder.push({ item_id: el.id, count: el.count })
    })
    const result = await fetch('http://localhost:3000/api/shop-items', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(insertOrder)
    })
    if(result.status == 200) {
        localStorage.removeItem("shopCart")
        shopCart = []
        updateShopCart()
        document.querySelector(".go-shop").textContent = 'Заказ оформлен'
          
    }
}
//сортировка по категориям
const navItem = document.querySelectorAll("nav span")
navItem.forEach(el => {
    el.addEventListener("click", () => {
       mainBlock.innerHTML = "" //очищаем содержимое\
       items.forEach(item => {
            if (el.classList.value == item.category || el.classList.value == "all") {
              mainBlock.innerHTML += `<div class="item">
                    <img src="img/${item.img}">
                    <a href="/public/product.html?id=${item.id}"><h4>${item.name} – ${item.price}$</h4></a>
                    <p>${item.desc}</p>
                    <div class="add-to-cart" onclick="addToCart(${item.id})"><i class="fas fa-cart-plus"></i></div>
                </div>`;
            }
       })
    })
})