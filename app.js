<script>
// ---------------- IMAGE SLIDER ----------------
let images = [
    'https://demo.opencart.com/image/cache/catalog/demo/banners/MacBookAir-1140x380.jpg',
    'https://demo.opencart.com/image/cache/catalog/demo/banners/iPhone6-1140x380.jpg'
];

let image = document.querySelector('#imagesscroll');
let pre = document.querySelector('.arrowleft i');
let nex = document.querySelector('.arrowright i');
let dots = document.querySelector('.dots').children;
let current = 0;

pre.addEventListener('click', () => changeimage('pre'));
nex.addEventListener('click', () => changeimage('nex'));

dots[0].classList.add('active');
let slideshowTimer = setInterval(changeimage, 5000);

function changeimage() {
    current = current === 0 ? 1 : 0;
    image.src = images[current];
    dots[0].classList.remove('active');
    dots[1].classList.remove('active');
    dots[current].classList.add('active');
}

// ---------------- FETCHING DATA ----------------
let products = [];
let filtered;
let fetaturedProducts = document.querySelector('.featuredproducts');

async function fetchdata() {
    try {
        let res = await fetch('https://opencart-4daca-default-rtdb.firebaseio.com/Products.json');
        let data = await res.json();
        products = data;
        displaydata(data);
        displaycart();
        displaywishlist();
        displayonpopupcart();
    } catch (err) {
        console.error("Error fetching data:", err);
    }
}
fetchdata();

function displaydata(data) {
    fetaturedProducts.innerHTML = '';
    if (data.length > 0) {
        data.map((el, i) => {
            let product = document.createElement('div');
            product.className = 'product';
            product.innerHTML = `
                <a href="/product.html?name=${el.title}">
                    <img src="${el.image}" alt="${el.title}">
                </a>
                <h3 class="title">${el.title}</h3>
                <p class="detail">${el.desctription}</p>
                <div class="pricing">
                    <p id="price">$${Number(el.price).toFixed(2)}</p>
                    <p id="tax">Ex Tax: $${Number(el.tax).toFixed(2)}</p>
                </div>
                <div class="tags">
                    <i class="fa-solid fa-cart-shopping" id=${i}></i>
                    <i class="fa-solid fa-heart" id=${i}></i>
                    <i class="fa-solid fa-arrows-turn-to-dots"></i>
                </div>
            `;
            fetaturedProducts.appendChild(product);
        });
    } else {
        fetaturedProducts.innerHTML = `<p>Nothing to show</p>`;
    }
}

// ---------------- CART FUNCTIONALITY ----------------
let itemsincart = document.querySelector('#cart-products');
let totalprice = document.querySelector('#total-price');
let cartproducts = JSON.parse(localStorage.getItem('cartedproducts')) || [];

fetaturedProducts.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-cart-shopping')) {
        addtocart(e.target.id);
    }
    else if (e.target.classList.contains('fa-heart')) {
        addwishlist(e.target.id);
    }
});

function addtocart(i) {
    let con = cartproducts.some(el => el.id == i);
    if (!con) {
        showpopup();
        cartproducts.push({
            id: i,
            quantity: 1,
            price: products[i].price
        });
    } else {
        failurepopup();
        let indx = cartproducts.findIndex(el => el.id == i);
        cartproducts.splice(indx, 1);
    }
    displaycart();
}

function displaycart() {
    itemsincart.textContent = `${cartproducts.length}`;
    let tot = 0;
    for (let i = 0; i < cartproducts.length; i++) {
        tot += cartproducts[i].price * cartproducts[i].quantity;
    }
    totalprice.innerHTML = `${tot}`;
    localStorage.setItem('cartedproducts', JSON.stringify(cartproducts));
    displayonpopupcart();
}

// ---------------- WISHLIST FUNCTIONALITY ----------------
let wishno = document.querySelector('#wish');
let wislist = JSON.parse(localStorage.getItem('wishlist')) || [];

function addwishlist(i) {
    if (!wislist.includes(i)) {
        wislist.push(i);
    } else {
        let indx = wislist.indexOf(i);
        wislist.splice(indx, 1);
    }
    displaywishlist();
}

function displaywishlist() {
    wishno.textContent = wislist.length;
    localStorage.setItem('wishlist', JSON.stringify(wislist));
    fetaturedProducts.querySelectorAll(".fa-heart").forEach(el => {
        el.classList.toggle('wishadded', wislist.includes(el.id));
    });
}

// ---------------- POPUP CART ----------------
let cartbar = document.querySelector('.cart');
let popup = document.querySelector('.container');
let removepopup = document.querySelector('.removepopup');

cartbar.addEventListener('click', () => {
    popup.classList.add('show');
});
document.querySelector('.fa-cart-shopping').addEventListener('click', () => {
    popup.classList.add('show');
});
removepopup.addEventListener('click', () => {
    popup.classList.remove('show');
});

let carpor = document.querySelector('.cartproduct');

function displayonpopupcart() {
    document.querySelector('#shipitem').innerHTML = cartproducts.length;
    carpor.innerHTML = '';
    if (cartproducts.length > 0) {
        cartproducts.map((el, i) => {
            let da = products[el.id];
            let prp = document.createElement('div');
            prp.className = 'prp';
            prp.innerHTML = `
                <div>
                    <img src="${da.image}" alt="${da.title}">
                    <p>${da.title}</p>
                </div>
                <div>
                    <div class="quantity">
                        <span class="bn dec" data-index="${i}">-</span>
                        <span id="${i}">${el.quantity}</span>
                        <span class="bn inc" data-index="${i}">+</span>
                    </div>
                    <p>$${(el.price * el.quantity).toFixed(2)}</p>
                    <i class="fa-solid fa-trash-can" id="trash" data-index="${i}"></i>
                </div>
            `;
            let hr = document.createElement('hr');
            hr.id = 'divider';
            carpor.append(hr, prp);
        });
    } else {
        carpor.innerHTML = '<p id="nothing">Nothing to show</p>';
    }
}

// ---------------- QUANTITY CHANGE ----------------
carpor.addEventListener('click', (e) => {
    if (e.target.classList.contains('inc')) {
        changequantity(e.target.dataset.index, 'inc');
    }
    else if (e.target.classList.contains('dec')) {
        changequantity(e.target.dataset.index, 'dec');
    }
    else if (e.target.id === 'trash') {
        delteproductfromcart(e.target.dataset.index);
    }
});

function changequantity(i, type) {
    let r = cartproducts[i];
    if (type == 'inc' && r.quantity < 10) {
        r.quantity++;
    }
    else if (type == 'dec') {
        if (r.quantity > 1) {
            r.quantity--;
        }
    }
    displaycart();
    displayonpopupcart();
}

function delteproductfromcart(id) {
    cartproducts.splice(id, 1);
    localStorage.setItem('cartedproducts', JSON.stringify(cartproducts));
    displaycart();
    displayonpopupcart();
}

// ---------------- SEARCH ----------------
let searinp = document.querySelector('.searchinp');
let searchTimer;
searinp.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(calldisplaydata, 500);
});

function calldisplaydata() {
    let val = searinp.value;
    if (val) {
        filtered = products.filter(el => el.title.toLowerCase().includes(val.toLowerCase()));
    } else {
        filtered = products;
    }
    displaydata(filtered);
}

// ---------------- CHECKOUT REDIRECT ----------------
document.querySelector('#gotocheckout').addEventListener('click', () => {
    window.location.assign('./checkoutnwishlist/checkout.html');
});

// ---------------- POPUP FEEDBACK ----------------
function showpopup() {
    clearTimeout(popupTimer);
    document.querySelector('.successdialog').classList.add('showsuccessdialog');
    popupTimer = setTimeout(() => {
        document.querySelector('.successdialog').classList.remove('showsuccessdialog');
    }, 2000);
}

function failurepopup() {
    document.querySelector('.failuredialog').classList.add('showsuccessdialog');
    popupTimer = setTimeout(() => {
        document.querySelector('.failuredialog').classList.remove('showsuccessdialog');
    }, 2000);
}

let popupTimer;
</script>
