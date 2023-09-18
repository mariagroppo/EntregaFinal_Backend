const socket = io({autoConnect:false});
let user;
const chatbox=document.getElementById('chatbox');

Swal.fire({
    title: 'Nombre de usuario',
    input:"email",
    inputValidator: (value)=>{
        let expReg= /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        let isOK = expReg.test(value);
        return !isOK && '¡Necesitas identificarte con un correo electrónico antes de ingresar!'
    },
    allowOutsideClick:false,
    allowEscapeKey:false
}).then(result=>{
    user=result.value;
    /* De esta manera se crea un socket cuando el usuario se registra */
    socket.connect()
    socket.emit('authenticated', user);
})

const button = document.getElementById('sendButton');

button.addEventListener("click", () => {
    if (chatbox.value.trim().length>0) {
        socket.emit('msg', {user, message:chatbox.value.trim(), msgDate: new Date().toLocaleString()}),
        //console.log("chatbox: " + chatbox.value)
        chatbox.value="";
    }
});

socket.on('logs', info=>{
    const logs = document.getElementById('logs');
    //console.log(info);
    let msg="";
    for (let index = info.length -1; index >= 0; index--) {
        msg+=`
        <p class="fw-bold">${info[index].user}:&nbsp</p><p class="fst-italic"> ${info[index].message}</p><br/>
        `
    }
    /* info.forEach(e => {
        msg+=`
        <p class="fw-bold">${e.user}:&nbsp</p><p class="fst-italic"> ${e.message}</p><br/>
        `
    }); */
    logs.innerHTML=msg;
})

socket.on('newUserConnected', data=> {
    if (!user) return;
    Swal.fire({
        toast:true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        title: `${data} se unió al chat.`,
        icon: "success",
    })
})

/* socket.on('users', data => {
    let users="";
    const usersBox = document.getElementById('connectedPeople');
    data.forEach(e => {
        users+=`${e} <br/>`
    });
    usersBox.innerHTML=users;
}) */