const socket = io();

/* Si el cliente agrega un nuevo producto ----------------------------------------------------- */
const form = document.getElementById('formNewProduct');

form.addEventListener('submit', e => {
    e.preventDefault();
    let newProduct = {
        title: this.document.querySelector('#title').value,
        code: this.document.querySelector('#code').value,
        price: this.document.querySelector('#price').value,
        category: this.document.querySelector('#category').value,
        description: this.document.querySelector('#description').value,
        stock: this.document.querySelector('#stock').value,
        thumbnail: this.document.querySelector('#thumbnail').value
    }
    socket.emit('newProduct', newProduct);
    form.reset();
    
})

socket.on('listOfProducts', list=> {
    if (Number(list.totalDocs) === 0) {
        document.getElementById('productsContainer').innerHTML = '';
        document.getElementById('productsContainer').innerHTML = 
            `<div class="container-fluid">
                <h4 class="alert alert-danger">No se encontraron productos</h4>
            </div>`
    } else {
        document.getElementById('productsContainer').innerHTML = '';
        list.docs.forEach(product => {
            document.getElementById('productsContainer').innerHTML += `
                <div class="card m-2 cardStyle" style="width: 18rem;">
                    <a href="/api/products/${product.id}" class="position-relative"><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill spanCard">${product.id}</span><img src="${product.thumbnail}" class="card-img-top" alt="${product.title}"></a>
                    <div class="card-body">
                        <div class="container">
                            <div class="d-flex flex-wrap justify-content-between">
                                <div class="col align-self-center">
                                    <h5 class="card-title">${product.title}</h5>
                                </div>
                                <div class="col-2 buttonContainer">
                                    <button type="button" class="btn col botones"><img class="deleteIcon" id=${product.id} src="https://cdn.icon-icons.com/icons2/692/PNG/512/seo-social-web-network-internet_262_icon-icons.com_61518.png" alt=""></button>
                                </div>
                                
                            </div>
                        </div>
                        <span class="badge stockStyle">STOCK: ${product.stock}</span>
                        <p class="card-text">${product.description}</p>
                        <div class="d-flex flex-wrap justify-content-between">
                            <p class="card-text"><b>$ ${product.price}</b></p>
                            <span class="badge categoryStyle align-self-center">${product.category}</span>
                        </div>                       
                    </div>
                </div>    
                `;
        })
        /* document.getElementById('containerButtonsPages').innerHTML = '';
        if (list.value.prevPage) {
            document.getElementById('containerButtonsPages').innerHTML = `
                <a class="p-2" href="?page=${list.value.prevPage}&&limit=10&&sort=1"><button>Anterior</button></a>
            `;
        }
        document.getElementById('containerButtonsPages').innerHTML += `
            <div class="bg-light fw-bold mx-3 p-2">${list.value.page}</div>
        `
        if (list.value.nextPage) {
            document.getElementById('containerButtonsPages').innerHTML += `
                <a class="p-2" href="?page=${list.value.nextPage}&&limit=10&&sort=1"><button>Siguiente</button></a>
            `;
        } */
    }
})

/* Si el cliente elimina un nuevo producto ----------------------------------------------------- */
document.addEventListener("click", (event) => {
    const clickedElement = event.target;
    if (!clickedElement.matches('.botones')) {
        /* console.log(event.target.id) */
        socket.emit('deleteProduct', parseInt(event.target.id));
    }
    
  });
