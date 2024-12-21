let firstname=document.querySelector('#firstname')
let lastname=document.querySelector('#lastname')
let email=document.querySelector('#email')
let password=document.querySelector('#password')

let form=document.querySelector('form')

form.addEventListener('submit',(e)=>formsubmited(e))

function formsubmited(e){
    // e.preventDefault()
    fetch(`https://opencart-4daca-default-rtdb.firebaseio.com/users/${firstname.value+lastname.value}.json`,{
        method:'PUT',
        redirect:'follow',
        body:JSON.stringify({email:email.value,password:password.value}),
        headers:{
            'content-type':'application/json; charset=UTF-'
        }
    })
    alert('user added suffessfully')
}

