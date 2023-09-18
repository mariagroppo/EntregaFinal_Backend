//console.log("Conectado")

const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    //console.log(obj)
    const response = await fetch('/views/register',{
        method: 'POST',
        body: JSON.stringify(obj),
        /* los headers especifican el tipo de datos que envio */
        headers:{
            "Content-Type":'application/json'
        }
    })
    const text = await response.json();
    if (text.status ==="success") {
        window.location.replace('/login')
    }
    
})