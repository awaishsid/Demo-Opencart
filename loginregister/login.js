let form=document.querySelector('form')
let em=document.querySelector('#email')
let pass=document.querySelector('#password')
let userpresent=false
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    fetch('https://opencart-4daca-default-rtdb.firebaseio.com/users.json')
    .then(res=>res.json())
    .then(da=>checkuserpresent(Object.entries(da)))
    console.log(email.value,password.value)
})

function checkuserpresent(da){
    da.forEach(el=>{
        let {email,password}=el[1]
        if(em.value==email && pass.value==password){
            userpresent=true
        }
    })
    if(userpresent){
        alert('user loged in successfully')
        window.location.assign('../index.html')
    }
    else{
        alert('user not present !!please register!!')
    }
}