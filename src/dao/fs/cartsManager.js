/* Copia del desafio N01 */
import fs from 'fs';

import ProductManager from './productManager.js';
const productsList = new ProductManager("../Primera_Practica_Integradora/src/data/productos.txt")

/* Declaración de clase Archivo */
class CartsFile {
    /* Atributos */
    constructor (path) {
        this.path = path;
    }

    /* Devuelve el array con los carritos presentes en el archivo ---------------------------------------- */
    getAllCarts = async () => {
        let contenido;
        try {
            contenido = await fs.promises.readFile(this.path, 'utf-8');
            return { status: 'success', message: "Products ok.", value: JSON.parse(contenido)}
        } catch (error) {
            contenido=[];
            return { status: 'error', message: "Error en getAllCarts: " + error, value: null}
        }
    } 

    /* * Asigna un id incremental considerando el ultimo id asignado. */
    asignId = async () => {
        try {
            const list = await this.getAllCarts();
            let maxId=0;
            if (list.value.length === 0) {
                maxId=1;
            } else {
                list.value.forEach(value => {
                    if (value.idCart > maxId) {
                        maxId=value.idCart
                    }
                })
                maxId=maxId+1;
            }
            return maxId;
        } catch (error) {
            console.log("Error en asignId: " + error);
            return null;    
        }
    }

    /* Crea un carrito, asigna ID y actualiza el archivo txt. ------------------------- */
    createCart= async () => {
        try {
            const newId = await this.asignId();
            const timestamp = Date.now();
            const listOfCarts = await this.getAllCarts();
            const obj = ({
                idCart:parseInt(newId),
                timestamp: timestamp,
                products: []
            });
            listOfCarts.value.push(obj);
            await fs.promises.writeFile(this.path, JSON.stringify(listOfCarts.value, null,2));
        } catch (error) {
            console.log("Error en createCart: " + error);
        }
    }
   
   /* Elimina del archivo el objeto con el id buscado */
    deleteById = async (number) => {
        try {
            const listOfCarts = await this.getAllCarts();
            let founded = false;
            for (let i = 0; i < listOfCarts.value.length; i++) {
                if (listOfCarts.value[i].idCart === number) {
                    listOfCarts.value.splice(i,1);
                    founded = true;
                }
            }
            if (founded) {
                await fs.promises.writeFile(this.path, JSON.stringify(listOfCarts.value, null,2));
                return { status: 'success', message: "Cart ID " + number + " encontrado."}    
            } else {
                return { status: 'error', message: "Cart ID " + number + " no encontrado."}    
            }
        } catch (error) {
            return { status: 'error', message: "Error en deleteById: " + error}
        }
    }   
    
    /* Busca del archivo el carrito con el id indicado */
    getCartById = async (number) => {
        try {
            const listOfCarts = await this.getAllCarts();
            let cart = listOfCarts.value.find(cart => parseInt(cart.idCart) === parseInt(number))
            if (!cart) {
                return { status: 'error', message: "Cart not founded.", value: null, pExist: false}
            } else {
                if (cart.products.length > 0) {
                    return { status: 'success', message: "Cart founded.", value: cart, pExist: true}
                } else {
                    return { status: 'success', message: "Cart founded.", value: cart, pExist: false}
                }
            }
        } catch (error) {
            /* console.log("Error en getCartById: " + error); */
            return { status: 'error', message: "getCartById controller error: " + error}
        }
    } 

    verifyProductIsCharged = async (idCart, id) => {
        try {
            let locate=-1;
            const cart = await this.getCartById(idCart);
            if (cart.value.products.length === 0) {
                return { status: 'success', message: "No hay productos cargados.", value: null}
            } else {
                for (let index = 0; index < cart.value.products.length; index++) {
                    if (parseInt(id) === parseInt(cart.value.products[index].id)) {
                        locate=index;
                        /* console.log("el producto ya esta cargado."); */
                    }
                }
                if (locate>=0) {
                    return { status: 'success', message: "El producto ya está cargado.", value: locate}
                } else {
                    return { status: 'success', message: "Producto no cargado.", value: null}
                }
            }

        } catch (error) {
            return { status: 'error', message: "verifyProductIsCharged manager error: " + error}
        }
    }

    updateCarts = async (cart) => {
        try {
            let listadoCarts=await this.getAllCarts();
            for (let i = 0; i < listadoCarts.value.length; i++) {
                if (listadoCarts.value[i].idCart === parseInt(cart.idCart)) {
                    listadoCarts.value[i] = cart;
                    await fs.promises.writeFile(this.path, JSON.stringify(listadoCarts.value, null,2));
                    return { status: 'success', message: "Carts updated."}
                }
            }
        } catch (error) {
            return { status: 'error', message: "updateCart Manager error: " + error}
        }
    }

    /* Agrega productos nuevos por Id */
    addProductInCart = async (idCart, id, quantity) => {
        try {
            /* 1. verifica que que ID del carrito exista */
            let cart = await this.getCartById(idCart);
            if (cart.value) {
                /* 2. verifico que el id del producto exista */
                let product = await productsList.getProductById(id);
                if (product.value) {
                    /* 3. Verifio si el producto esta cargado en el carrito */
                    const charged = await this.verifyProductIsCharged(idCart, id);
                    console.log("CHARGED: " + charged.status);
                    console.log(charged.message)
                    if (charged.status === 'success') {
                        if (charged.value !== null) {
                            for (let index = 0; index < cart.value.products.length; index++) {
                                if (parseInt(cart.value.products[index].id) === parseInt(id)) {
                                    cart.value.products[index].quantity= parseInt(cart.value.products[index].quantity)+parseInt(quantity);
                                }
                            }
                            console.log("product ya cargado: " + cart.value)
                            await this.updateCarts(cart.value);
                        } else {
                            const product = ({
                                id: id,
                                quantity: quantity
                            });
                            cart.value.products.push(product);
                            console.log("producto NUEVO: " + cart.value)
                            await this.updateCarts(cart.value);
                        }
                        return { status: 'success', message: "Producto/s agregado/s."}
                    } else {
                        return { status: 'error', message: charged.message}
                    }
                } else {
                    return { status: 'error', message: "El producto no existe."}
                }
            } else {
                return { status: 'error', message: "El carrito no existe."}
            }
        } catch (error) {
            return { status: 'error', message: "addProductInCart controller error: " + error}
        }
    } 
    }

export default CartsFile;