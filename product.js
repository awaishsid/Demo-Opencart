const itemname=new URLSearchParams(location.search
).get('name')
document.querySelector('title').innerHTML=itemname
document.querySelector('#itemname').innerHTML=itemname
document.querySelector('#itemname').href=window.location.href
let productdata=[]

async function fetchdata() {
    let res = await fetch('https://opencart-4daca-default-rtdb.firebaseio.com/Products.json')
    let data = await res.json()
    productdata = data.filter(el=>el.title==itemname)[0]
    // console.log(productdata)
    showpro()
}
fetchdata()

let showitem=document.querySelector('.showitem')
function showpro(){
    document.querySelector('#para').innerHTML=productdata.longdescription
    showitem.innerHTML=''
    let imagesection=document.createElement('div')
    imagesection.className='imagesection'
    // create display images
    let displayimage=document.createElement('div')
    displayimage.className='img'
    displayimage.innerHTML=`<img src="${productdata.image}"/>`

    // create reference images
    let referenceimages=document.createElement('div')

    referenceimages.className='relatedimages'
    referenceimages.style.display='flex'
    productdata["references-images"].forEach(element => {
        let div=document.createElement('div')
        div.style.width='15%'
        div.innerHTML= `<img src=${element} alt="">`
        referenceimages.appendChild(div)
    })
    imagesection.appendChild(displayimage)
    imagesection.appendChild(referenceimages)

    // detail section
    let detailsection=document.createElement('div')
    detailsection.className='detailsection'
    detailsection.innerHTML=` <div class="det">
                    <h2>${productdata.title}</h2>
                    <div class="extrafet">
                        <p>Brand: <span id="brand">${productdata.brand}</span></p>
                        <p>Product code: <span id="product-code">${productdata["product-code"]}</span></p>
                        <p>Availability: <span id="availability">${productdata["availability"]}</span></p>
                    </div>
                </div>
                <div class="prcntax">
                    <h3 id="prize">$${productdata.price}.00</h3>
                    <p>Ex Tax: <span id="tax">$${productdata.tax}.00</span></p>
                </div>
                <div class="taz">
                    <i class="fa-solid fa-heart"></i>
                    <i class="fa-solid fa-arrows-turn-to-dots"></i>
                </div>
                <div class="quant">
                    <p>Qty</p>
                    <input value="1" type="number">
                </div>
                <div class="btn">
                    <span>Add to Cart</span>
                </div>
                <div class="reviews">
                    <div class="stars">
                        <i class="fa-regular fa-star" style="color: #FFD43B;"></i>
                        <i class="fa-regular fa-star" style="color: #FFD43B;"></i>
                        <i class="fa-regular fa-star" style="color: #FFD43B;"></i>
                        <i class="fa-regular fa-star" style="color: #FFD43B;"></i>
                        <i class="fa-regular fa-star" style="color: #FFD43B;"></i>
                        <i class="fa-regular fa-star" style="color: #FFD43B;"></i>
                    </div>
                    <p><span id="noofreview">0</span>reviews/write a review</p>
                </div>`
    showitem.appendChild(imagesection)
    showitem.appendChild(detailsection)
}

