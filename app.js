// making image scroller logic
let images = ['https://demo.opencart.com/image/cache/catalog/demo/banners/MacBookAir-1140x380.jpg', 'https://demo.opencart.com/image/cache/catalog/demo/banners/iPhone6-1140x380.jpg']

let image = document.querySelector('#imagesscroll')
let pre = document.querySelector('.arrowleft i')
let nex = document.querySelector('.arrowright i')
let dots = document.querySelector('.dots').children
let current = 0
pre.addEventListener('click', () => changeimage('pre'))
nex.addEventListener('click', () => changeimage('nex'))
dots[0].classList.add('active')
let timer = setInterval(changeimage, 5000)
function changeimage(da) {
    if (current == 0) {
        current = 1
    }
    else {
        current = 0
    }
    image.src = images[current]
    dots[0].classList.remove('active')
    dots[1].classList.remove('active')
    dots[current].classList.add('active')
    
}


// fetching data from api and showing it in ui
let products = []
let filtered
let fetaturedProducts = document.querySelector('.featuredproducts')
async function fetchdata() {
    let res = await fetch('https://opencart-4daca-default-rtdb.firebaseio.com/Products.json')
    let data = await res.json()
    products = data
    displaydata(data)
    displaycart()
    displaywishlist()
    displayonpopupcart()
}
fetchdata()
function displaydata(data) {
    fetaturedProducts.innerHTML = ''
    if(data.length>0){
        data.map((el, i) => {
            let product = document.createElement('a')
            product.href=`/product.html?name=${el.title}`
            // product.target="_blank"
            product.className = 'product'
            product.innerHTML = `
             <img src="${el.image}" alt="${el.title}">
                    <h3 class="title">${el.title}</h3>
                    <p class="detail">${el.desctription}</p>
                    <div class="pricing">
                        <p id="price">$${el.price}.00</p>
                        <p id="tax">Ex Tax:$${el.tax}.00</p>
                    </div>
                    <div class="tags">
                    <i class="fa-solid fa-cart-shopping" id=${i}></i>
                    <i class="fa-solid fa-heart"></i>
                    <i class="fa-solid fa-arrows-turn-to-dots"></i>
                    </div>
            `
            fetaturedProducts.appendChild(product)
        })

    }
    else{
        fetaturedProducts.innerHTML = `<p>Nothing to show</p>`
    }
}

// adding to cart functinality
let itemsincart = document.querySelector('#cart-products')
let totalprice = document.querySelector('#total-price')
let cartproducts = JSON.parse(localStorage.getItem('cartedproducts')) || []

fetaturedProducts.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-cart-shopping')) {
        addtocart(e.target.id)
    }
    else if (e.target.classList.contains('fa-heart')) {
        addwishlist(e.target.previousElementSibling.id)
    }
})

function addtocart(i) {
    let con = cartproducts.some(el => el.id == i)
    if (!con) {
        cartproducts.push({
            id: i,
            quantity: 1,
            price: products[i].price
        })
    }
    else {
        let indx = cartproducts.indexOf(cartproducts.filter(el => el.id == innerWidth)[0])
        cartproducts.splice(indx, 1)
    }
    displaycart()
}

function displaycart() {
    itemsincart.textContent = `${cartproducts.length}`
    let tot = 0
    for (let i = 0; i < cartproducts.length; i++) {
        tot += cartproducts[i].price*cartproducts[i].quantity
    }
    totalprice.innerHTML = `${tot
        }`
    localStorage.setItem('cartedproducts', JSON.stringify(cartproducts))
    displayonpopupcart()
}

// adding wish list functinality
let wishno = document.querySelector('#wish')
let wislist = JSON.parse(localStorage.getItem('wishlist')) || []

function addwishlist(i) {
    if (!wislist.includes(i)) {
        wislist.push(i)
    }
    else {
        let indx = wislist.indexOf(i)
        wislist.splice(indx, 1)
    }
    displaywishlist()
}

function displaywishlist() {
    wishno.textContent = wislist.length
    localStorage.setItem('wishlist', JSON.stringify(wislist))

    fetaturedProducts.querySelectorAll(".fa-heart").forEach(el => {
        el.id = wislist.includes(el.previousElementSibling.id) ? 'wishadded' : null
    })
}

// showing the popup for the cart
let cartbar = document.querySelector('.cart')
let popup = document.querySelector('.container')
let removepopup = document.querySelector('.removepopup')
cartbar.addEventListener('click', () => {
    popup.classList.add('show')
})

removepopup.addEventListener('click', () => {
    popup.classList.remove('show')
})
// adding products to popupcart
let carpor = document.querySelector('.cartproduct')

function displayonpopupcart() {
    document.querySelector('#shipitem').innerHTML=cartproducts.length
    carpor.innerHTML = ''
    if(cartproducts.length>0){
        cartproducts.map((el,i) => {
            let da = products[el.id]
            let prp = document.createElement('div')
            prp.className = 'prp'
            prp.innerHTML = `
                                    <div>
                                <img src="${da.image}" alt="macbook">
                                <p>${da.title}</p>
                            </div>
                            <div>
                                <div class="quantity">
                                    <span id="dec" class="bn">-</span>
                                    <span id="${i}">${el.quantity}</span>
                                    <span id="inc" class="bn">+</span>
                                    </div>
                                    <p>$${el.price*el.quantity}</p>
                                    <i class="fa-solid fa-trash-can" id="trash"></i>
                            </div>
            `
            let hr=document.createElement('hr')
            hr.id='divider'
            carpor.append(hr,prp)
        })

    }
    else{
        carpor.innerHTML = '<p id="nothing">Nothing to show</p>'

    }
}

// increase and decrease quantity
carpor.addEventListener('click',(e)=>{
    if(e.target.id==='inc'){
        changequantity(e.target.previousElementSibling.id,'inc')
    }
    else if(e.target.id=='dec'){
        changequantity(e.target.nextElementSibling.id,'dec')
    }
    else if(e.target.id=='trash'){
        delteproductfromcart(e.target.previousElementSibling.previousElementSibling.children[1].id)
    }
})

function changequantity(i,type){
    let r=cartproducts[i]
    if(type=='inc' && r.quantity<10){
        r.quantity++
        
    }
    else if(type=='dec'){
        if(r.quantity>1){
            r.quantity--
        }
    }
    displaycart()
    displayonpopupcart()
}

//delte product from cart


function delteproductfromcart(id){
    console.log(cartproducts[id])
    cartproducts.splice(id,1)
    localStorage.setItem('cartedproducts', JSON.stringify(cartproducts))
    displaycart()
    displayonpopupcart()
}


// search functionality

let searinp=document.querySelector('.searchinp')
let settimer
searinp.addEventListener('input',()=>{
    clearTimeout(settimer)
    settimer=setTimeout(calldisplaydata,500)
})

function calldisplaydata(){ 
    let val=searinp.value
    if(val){
        filtered=products.filter(el=>el.title.toLowerCase().includes(val))
    }
    else{
        filtered=products
    }
    displaydata(filtered)
}