// making image scroller logic
let images=['https://demo.opencart.com/image/cache/catalog/demo/banners/MacBookAir-1140x380.jpg','https://demo.opencart.com/image/cache/catalog/demo/banners/iPhone6-1140x380.jpg']

let image=document.querySelector('#imagesscroll')
let pre=document.querySelector('.arrowleft i')
let nex=document.querySelector('.arrowright i')
let dots=document.querySelector('.dots').children
let current=0
pre.addEventListener('click',()=>changeimage('pre'))
nex.addEventListener('click',()=>changeimage('nex'))
dots[0].classList.add('active')
let timer=setInterval(changeimage,5000)
function changeimage(da){
    if(current==0){
        current=1
    }
    else{
        current=0
    }
    image.src=images[current]
    dots[0].classList.remove('active')
    dots[1].classList.remove('active')
    dots[current].classList.add('active')
    
}