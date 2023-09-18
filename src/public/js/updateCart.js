let counterCartInfo = [];

document.addEventListener("click", (event) => {
    const clickedElement = event.target;
    let product = event.target.name;
    let initialValue;
    let a;
    let stocks=document.getElementById('stock');
    console.log(stocks)
    let inputs=document.getElementsByClassName('productQtyInput2');
    for (let index = 0; index < inputs.length; index++) {
        if (parseInt(inputs[index].id) === parseInt(product)){
            initialValue= parseInt(inputs[index].value);
            a=index;
        }
    }
    if (clickedElement.id === 'btnSum2') {
        /* Faltaria verificar cantidad contra stock */
        if (initialValue > 0 ) {
            inputs[a].value=initialValue+1;
        }
        
    } else if (clickedElement.id === 'btnRest2') {
        if (initialValue > 0) {
            inputs[a].value=initialValue-1;
        } else if (initialValue===0){
            inputs[a].value=0;
        }
        
    }
    
  });
