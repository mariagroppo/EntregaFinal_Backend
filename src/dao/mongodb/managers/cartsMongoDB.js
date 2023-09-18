import { Cart } from "../models/cartModel.js";
import config from '../../../config/config.js'
//import mongoose from "mongoose";

class CartsMongoDB {
    /* Devuelve el array con los objetos presentes en el archivo ---------------------------------------- */
    getAll = async (userId) => {
        try {
            let contenido;
            if (userId === config.mailing.ADMIN_ID) {
                contenido = await Cart.find().lean().populate('products._id');
            } else {
                contenido = await Cart.find({user: userId}).lean().populate('products._id');
            }
            return { status: 'success', message: "Carts ok.", value: contenido}
            
        } catch (error) {
            return { status: 'error', message: "Error en getAll MongoDB: " + error, value: null}
        }
    } 

    getById = async (number,userId) => {
        try {
            let cart = await Cart.findOne({idCart: Number(number), user: userId}).lean().populate('products._id');
            if (!cart) {
                return { status: 'error', message: `cart ID ${number} do not exists.`, value: null}
            } else {
                if (cart.products.length === 0){
                    return { status: 'success', message: "Cart founded. It has no products.", value: cart, pExist: false}
                } else {
                    //let a = await prodsMongo.infoProducts(cart);
                    return { status: 'success', message: "Cart founded. It has products.", value: cart, pExist: true}
                }
            }
        } catch (error) {
            return { status: 'error', message: "Error en getById MongoDB: " + error, value: null}
        }
        
    } 

    asignId = async (userId) => {
        try {
            const list = await this.getAll(userId);
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
            //console.log("asigna " + maxId)
            return maxId;
        } catch (error) {
            console.log("Error en asignId: " + error);
            return null;    
        }
    }

    save = async (userId) => {
        try {
            const list = await this.getAll(userId);
            let cartsQuantity = list.value.length;
            if (cartsQuantity > 0) {
                let cart = list.value[cartsQuantity-1];
                if (cart.cartStatus === true) {
                    return { status: 'error', 
                    message: "No se puede crear un nuevo carrito ya que posee uno abierto.",
                    value: null}
                } 
            }
            const newId = await this.asignId(userId);
            const timestamp = Date.now();
            const obj = ({
                idCart:parseInt(newId),
                timestamp: timestamp,
                products: [],
                cartStatus: true,
                user: userId
            });
            const newCart = new Cart(obj);
            await newCart.save();
            return { status: 'success', message: `Cart created.`, value: newCart}
        } catch (error) {
            return { status: 'error', message: error, value: null}
        }
        
    } 

    deleteById = async (id,userId) => {
        try {
            if (parseInt(id)>0) {
                let cart = await this.getById(id,userId);
                if (cart.status === 'success') {
                    if (cart.value.user.toString() === userId) {
                        await Cart.deleteOne({
                            idCart: id
                        })
                        return { status: 'success', message: `Cart ${id} deleted.`, value: true}
                    } else {
                        return { status: 'error', message: `Cart ${id} can not be deleted. It is not yours`, value: false}
                    }
                    
                } else {
                    return { status: 'error', message: `Cart ${id} do not exists.`, value: false}
                }
            } else {
                return { status: 'errr', message: "The ID must be an integer.", value: false}
            }
        } catch (error) {
            return { status: 'error', message: "Error en deleteById MongoDB: " + error, value: false}
        }
    }

    addProductInCart = async (product, quantity, userId) => {
        try {
            /* 1. Busco el carrito abierto y si no hay, abro uno*/
            const carts = await this.getAll(userId);
            let cart;
            let createCart;
            if (carts.value.length > 0) {
                cart = carts.value[carts.value.length-1];
                if (cart.cartStatus === false) {
                    createCart = await this.save(userId);
                    if (createCart.status === 'success'){
                        cart = createCart.value
                    } else {
                        return { status: 'error', message: "Error while trying to create a new cart: " + error}
                    }
                }
            } else {
                //creo un carrito
                createCart = await this.save(userId);
                if (createCart.status === 'success'){
                    cart = createCart.value
                } else {
                    return { status: 'error', message: "Error while trying to create a new cart: " + error}
                }
            }
            let cid = cart.idCart;
            //2. Verifio si el producto esta cargado en el carrito
            
            let findProductInCart = false;
            for (let index = 0; index < cart.products.length; index++) {
                if (cart.products[index]._id._id.toString() === product._id.toString()) {
                    findProductInCart = true
                }
            }
            if (findProductInCart) {
                await Cart.updateOne(
                    { idCart: cid, "products._id": product._id },
                    { $inc: { "products.$.quantity": quantity } })
            
            } else {
                await Cart.updateOne(
                    { idCart: cid },
                    {
                        $push: {
                            products: {
                                _id: product._id.toString(),
                                quantity: quantity
                            }
                        }
                    })
            }
            return { status: 'success', message: `Product ID ${product.id} added to cart ID ${cid}.`}
        } catch (error) {
            return { status: 'error', message: "addProductInCart manager error: " + error}
        }
    } 
    
    
    closeCart = async (cid,userId) => {
        try {
            await Cart.updateOne(
                {idCart: cid, user: userId.toString()},
                {$set: {"cartStatus": false } }
            )
            return { status: 'success', message: "Cart closed."}
        } catch (error) {
            return { status: 'error', message: "closeCart Manager error: " + error}
        }
    }

    reopenCart = async (cid) => {
        try {
            await Cart.updateOne(
                {idCart: cid},
                {$set: {"cartStatus": true } }
            )
            return { status: 'success', message: "Cart reopened."}
        } catch (error) {
            return { status: 'error', message: "reopenCart Manager error: " + error}
        }
    }

    deleteProduct = async (cid, id, userId) => {
        try {
            let cart = await this.getAll(userId);
            let idCart;
            if ((cart.value.length > 0) && (cart.value[cart.value.length-1].cartStatus===true)) {
                idCart = cart.value[cart.value.length-1].idCart;
                if (idCart === cid) {
                                const a = await Cart.updateOne(
                                    {idCart: idCart, user: userId},
                                    {$pull: {products: {_id: id}}});
                                return { status: 'success', message: `Product deleted.`}
                } else {
                    return { status: 'error', message: `The cart ID ${cid} does not matches with the opened cart ID.`}
                }
            } else {
                return ({status:'error', message: "No carts opened."})
            }
        } catch (error) {
            return { status: 'error', message: "deleteProduct Manager error: " + error}
        }
    }
    
    updateCart = async (cid, prodId, newQty, userId) => {
        try {
            let carts = await this.getAll(userId);
            let idCart;
            if ((carts.value.length > 0) && (carts.value[carts.value.length-1].cartStatus===true)) {
                idCart = carts.value[carts.value.length-1].idCart;
                if (idCart === cid) {
                    /* verificar que el producto id este */
                    //let prod = await productService.getById(id);
                    //if (prod.status === "success") {
                        await Cart.findOneAndUpdate(
                            {idCart: idCart, user: userId},
                            {$set: {"products.$[el].quantity": newQty } },
                            { 
                              arrayFilters: [{ "el._id": prodId }],
                              new: true
                            }
                          )
                        return { status: 'success', message: `Product updated.`}
                    
                    
                }else {
                    return { status: 'error', message: `The cart ID ${cid} does not matches with the opened cart ID.`}
                }
            } else {
                return ({status:'error', message: "No cart opened."})
            }
        } catch (error) {
            return { status: 'error', message: "updateCart Manager error: " + error}
        }
    }
    
    /* updateCartGlobal = async (cid, newData, userId) => {
        try {
            let b = Object.values(newData)
            let cart = await this.getAll(userId);
            let idCart;
            if ((cart.value.length > 0) && (cart.value[cart.value.length-1].cartStatus===true)) {
                idCart = cart.value[cart.value.length-1].idCart;
                if (idCart === cid) {
                    for (let index = 0; index < b.length -1 ; index++) {
                        let a = {pid: parseInt(b[index][0]), qty: parseInt(b[index][1])}
                        await Cart.updateOne(
                            {idCart: idCart},
                            {$set: {"products.$[el].quantity": a.qty } },
                            { 
                                arrayFilters: [{ "el.id": a.pid }],
                                new: true
                            }
                            )
                    }
                    //console.log("Finalizo")
                    return { status: 'success', message: `Cart ID ${cid} updated.`}
                }
            } else {
                return ({status:'error', message: "No cart opened."})
            }
        } catch (error) {
            return { status: 'error', message: "updateCart Manager error: " + error}
        }
    } */

    /* updateCartGlobal2 = async (cid, newData) => {
        try {
            console.log(cid);
            for (let index = 0; index < newData.products.length; index++) {
                console.log(newData.products[index])
            }
            for (let index = 0; index < newData.products.length; index++) {
                await Cart.updateOne(
                    {idCart: cid},
                    {$set: {"products.$[el].quantity": newData.products[index].quantity } },
                    { 
                        arrayFilters: [{ "el.id": newData.products[index].id }],
                        new: true
                    }
                    )
            }

            return { status: 'success', message: "updateCartGlobal2 Manager error: " + error}
        } catch (error) {
            return { status: 'error', message: "updateCart Manager error: " + error}
        }
    } */

    
}

export default CartsMongoDB;