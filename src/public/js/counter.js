let counter = [];

document.addEventListener("click", (event) => {
    const clickedElement = event.target;
    let product = event.target.name;
    
    if (clickedElement.id === 'btnSum') {
        /* Faltaria verificar cantidad contra stock */
        if (counter[parseInt(product)] > 0 ) {
            counter[parseInt(product)]=counter[parseInt(product)]+1;
        } else {
            counter[parseInt(product)]=1;
        }
        let inputs=document.getElementsByClassName('productQtyInput');
        for (let index = 0; index < inputs.length; index++) {
            const element = inputs[index].id;
            if (parseInt(element) === parseInt(product)) {
                inputs[index].value=counter[parseInt(product)]
            }
        }
        
    } else if (clickedElement.id === 'btnRest') {
        if (counter[parseInt(product)] > 0 ) {
            counter[parseInt(product)]=counter[parseInt(product)]-1;
        } else {
            counter[parseInt(product)]=0;
        }
        let inputs=document.getElementsByClassName('productQtyInput');
        for (let index = 0; index < inputs.length; index++) {
            const element = inputs[index].id;
            if (parseInt(element) === parseInt(product)) {
                inputs[index].value=counter[parseInt(product)]
            }
        }
    }
    
  });


/* document.addEventListener("click", (event) => {
    const clickedElement = event.target;
    let productId = clickedElement.id;

    if (clickedElement.name === 'btnOK') {
        let cartsInputs=document.getElementsByClassName('cartInput');
        for (let index = 0; index < cartsInputs.length; index++) {
            const element = cartsInputs[index].id;
            if (parseInt(element) === parseInt(productId)) {
                let cart = cartsInputs[index].value;
                if (cart) {
                    let inputs=document.getElementsByClassName('productQtyInput');
                    for (let index = 0; index < inputs.length; index++) {
                        const element = inputs[index].id;
                        if (parseInt(element) === parseInt(productId)) {
                            alert("Cart: " + cart + " || Producto: " + productId + " || cantidad: " + inputs[index].value)
                            let URL = window.location + "?cid=" + cart + "&pid=" + productId + "&qty=" +  inputs[index].value;
                            alert(URL)
                            //alert(window.location) //http://localhost:8080/api/products
                            //window.location.href("http://localhost:8080/api/carts")
                        }
                    }
                } else {
                    alert("Debe ingresar un número de carrito.")
                }
            }
        }
    
    }
}) */