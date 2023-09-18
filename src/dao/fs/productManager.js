/* Desafio N02 */
import fs from 'fs';

/* Declaración de clase Archivo */
class ProductManager {
    /* Atributos */
    constructor (path) {
        this.path = path;
    }
    
    /* Devuelve el arreglo con todos los productos creados hasta ese momento */
    getProducts = async () => {
        let contenido;
        try {
            contenido = await fs.promises.readFile(this.path, 'utf-8');
            return { status: 'success', message: "Products ok.", value: JSON.parse(contenido)}
        } catch (error) {
            contenido=[];
            return { status: 'error', message: "Error en getProducts: " + error, value: error}
        }
    } 

    /* Asigna un id incremental considerando el ultimo id asignado. */
    asignId = async () => {
        try {
            const list = await this.getProducts();
            let maxId=0;
            if (list.value.length === 0) {
                maxId=1;
            } else {
                list.value.forEach(value => {
                    if (value.id > maxId) {
                        maxId=value.id
                    }
                })
                maxId=maxId+1;
            }
            return { status: 'success', message: `Assigned product ID ${maxId} added.`, value: maxId}
        } catch (error) {
            return { status: 'error', message: `ProductManager asignId error: ${error}.`, value: null}    
        }
    }

    /* Con la informacion de un producto, crea el array newProd */
    getFullProduct = async (product) => {
        try {
            let id = await this.asignId();
            if (id) {
                const newProd = {
                    id: id.value,
                    title: product.title,
                    description: product.description,
                    price: parseFloat(product.price),
                    thumbnails: [product.thumbnails],
                    code: product.code,
                    stock: parseInt(product.stock),
                    status: true,
                    category: product.category
                }
                return { status: 'success', message: `New product structure ${newProd}.`, value: newProd}
            } else {
                return { status: 'error', message: `Error asignId error: ${id.message}.`, value: null}   
            }
        } catch (error) {
            return { status: 'error', message: `ProductManager getFullProduct error: ${error}.`, value: null}
        }
    }

    /* Verifica que el codigo del producto a agregar no este repetido */
    repeatCode = async (code) => {
        try {
            const list = await this.getProducts();
            for (let i=0; i<list.value.length; i++){
                if (list.value[i].code===code) {
                    return { status: 'error', message: `Code already in use.`, value: true}
                }
            }
            return { status: 'success', message: `Code not used.`, value: false}
        } catch (error) {
            return { status: 'error', message: `ProductManager repeatCode error: ${error}.`, value: true}
        }
    }

    /* Agrega un producto, validando que no se repita el campo “code” y que todos los campos sean 
    obligatorios. Al agregarlo, debe crearse con un id autoincrementable */
    addProduct = async (product) => {
        try {
            const newProd = await this.getFullProduct(product);
            const repeatCode = await this.repeatCode(newProd.value.code);
            const listOfProducts = await this.getProducts();
            if (!repeatCode.value){
                listOfProducts.value.push(newProd.value);
                await fs.promises.writeFile(this.path, JSON.stringify(listOfProducts.value, null,2));
                return { status: 'success', message: `Product ID ${newProd.value.id} added.`, value: newProd}
            } else {
                return { status: 'error', message: `${repeatCode.message}`, value: null}
            }
        } catch (error) {
            return { status: 'error', message: `Error en addProduct`, value: null} 
        }
    } 

    validateFields =  async (product) => {
        try {
            if ( (typeof product.title === 'undefined') 
                || (typeof product.description === 'undefined') 
                || (typeof product.code === 'undefined')
                || (typeof product.thumbnails === 'undefined')
                || (typeof product.price === 'undefined')
                || (typeof product.stock === 'undefined')
                || (typeof product.category === 'undefined')
            ){
                return { status: 'error', message: `All fields shall be completed.`, value: false}
            } else {
                return { status: 'success', message: `All fields are completed.`, value: true}
            }
        } catch (error) {
            return { status: 'error', message: `ProductManager validateFields error: ${error}`, value: false}
        }
    }

/*  Busca en el arreglo el producto que coincida con el id. En caso de no coincidir ningún id, 
Muestra en consola un error “Not found” */
    getProductById = async (number) => {
        try {
            const listOfProducts = await this.getProducts();
            /* console.log(number) */
            let product = listOfProducts.value.find(prod => parseInt(prod.id) === parseInt(number));
            if (!product) {
                return { status: 'error', message: `Product ID ${number} do not exists.`, value: null}
            } else {
                return { status: 'success', message: "Product founded.", value: product}
            }
        } catch (error) {
            return { status: 'error', message: "Error en getProductById: " + error, value: null}
        }
    } 
    
    /* Elimina del archivo el objeto con el id buscado */
    deleteById = async (number) => {
        try {
            const listOfProducts = await this.getProducts();
            let founded = false;
            for (let i = 0; i < listOfProducts.value.length; i++) {
                if (listOfProducts.value[i].id === number) {
                    listOfProducts.value.splice(i,1);
                    founded = true;
                }
            }
            if (founded) {
                await fs.promises.writeFile(this.path, JSON.stringify(listOfProducts.value, null,2));
                return { status: 'succes', message: `Product ID ${number} deleted.`, value: null}
            } else {
                return { status: 'error', message: `Product ID ${number} do not exists.`, value: null}
            }
        } catch (error) {
            return { status: 'error', message: `ProductManager deleteById error: ${error}.`, value: null}
        }
    }    
    
    updateProductById = async (number, product) => {
        try {
            let prod = await this.getProductById(number);
            if (prod.value) {
                const newProd = {...prod.value, ...product}
                const listOfProducts = await this.getProducts();
                for (let i = 0; i < listOfProducts.value.length; i++) {
                    if (listOfProducts.value[i].id === parseInt(number)) {
                        listOfProducts.value[i] = { ...listOfProducts.value[i], ...newProd };
                        await fs.promises.writeFile(this.path, JSON.stringify(listOfProducts.value, null,2));
                    }
                }
                return { status: 'success', message: `Product ID ${number} updated.`, value: true}
            } else {
                return { status: 'error', message: prod.message, value: false}
            }
        } catch (error) {
            return { status: 'error', message: `ProductManager updateProductById error: ${error}`, value: false}
        }
    }
}


export default ProductManager;
