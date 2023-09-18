import { cartService, productService, ticketsService } from "../services/repository.js";
import { mailProducts } from '../mail/nodemailer.js'

const getCarts = async (req, res) => {
    let userId = req.session.user.id;
    let values;
    try {
        let listado = await cartService.getAll(userId);  
        if (listado.value.length>0) {
            values = {
                value: listado.value,
                cartsExists: true
            };
            res.sendSuccessMessageAndValue("List of carts ok.", values)
        } else {
            values = {
                value: null,
                cartsExists: false
            };
            res.sendSuccessMessage("You do not have carts opened.", values)
        }
    } catch (error) {
        res.sendErrorMessage("getCarts Controller error: " + error)
    }
}
const addNewCart = async (req, res) => {
    let userId = req.session.user.id;
    try {
        let cart = await cartService.save(userId);
        res.sendStatusMessageAndValue(cart.status, cart.message, cart.value)
    } catch (error) {
        res.sendErrorMessageAndValue("addNewCart controller error: " + error, null)
    }
}

const getCartById = async (req,res) => {
    let userId = req.session.user.id;
    let values;
    try {
        let cid = req.params.cid;
        if (isNaN(cid)){
            res.sendErrorMessage("The ID must be an integer.")
        } else {
            let cart = await cartService.getById(cid, userId);    
            values = {
                value: cart.value,
                pExist: cart.pExist
            };
            res.sendStatusMessageAndValue(cart.status, cart.message, values)
        }
    } catch (error) {
        res.sendErrorMessage("getCartById controller error: " + error)
    }
}

const deleteCartById = async (req, res) => {
    let userId = req.session.user.id;
    try {
        let idCart = parseInt(req.params.cid);
        let answer;
        let values;
        if (!isNaN(idCart)) {
            answer = await cartService.deleteById(idCart,userId);
            values = {
                value: answer.value,
                pExist: answer.pExist
            };
            res.sendStatusMessageAndValue(answer.status,answer.message,values)
        } else {
            req.info = {
                status: 'error',
                message: "The ID must be a number.",
                userName,
            };
            next();
        }
    } catch (error) {
        res.sendErrorMessage("deleteCartById controller error: " + error)
    }
}

const addProductInCart = async (req, res) => {
    let userId = req.session.user.id;
    try {
        let id = parseInt(req.params.pid);
        let qty = parseInt(req.body.productQtyInput);
        let product = await productService.getById(id);
        if (product.status === 'success') {
            let answer = await cartService.addProductInCart(product.value, qty, userId);
            res.sendStatusAndMessage(answer.status, answer.message)
        } else {
            res.sendStatusAndMessage(product.status, product.message)
        }
    } catch (error) {
        res.sendErrorMessage("addProductInCart controller error: " + error)
    }
}

/* const updateCart = async (req, res, next) => {
    let userName = req.session.user.name;
    let userId = req.session.user.id;
    try {
        let cid = parseInt(req.params.cid);
        let data = req.body;
        let answer = await cartService.updateCartGlobal(cid, data, userId);
        console.log(answer)
        req.info = {
            status: answer.status,
            message: answer.message,
            userName,
        };
        next();
        
    } catch (error) {
        req.info = {
            status: 'error',
            message: "updateCart controller error: " + error,
            userName,
        };
        next();
    }
} */


const deleteProduct = async (req,res) => {
    let userId = req.session.user.id;
    try {
        let id = parseInt(req.params.pid);
        let cid = parseInt(req.params.cid);
        let answer = await cartService.deleteProduct(cid, id, userId);
        res.sendStatusAndMessage(answer.status, answer.message)
    } catch (error) {
        res.sendErrorMessage("deleteProduct controller error: " + error)
    }
}

const closeCart = async (req, res) => {
    let userId = req.session.user.id;

    try {
        let cid = parseInt(req.params.cid);
        let cart = await cartService.getById(cid,userId);
        if (cart.value.products.length > 0) {
            if (cart.status === "success"){
                //Verifico el stock de cada producto.
                let okStock = true;
                let productsWithoutStock = [];
                cart.value.products.forEach(product => {
                    let wantedQty = product.quantity;
                    let actualQty = product._id.stock;
                    if (wantedQty > actualQty) {
                        let b = {
                            id: product._id._id,
                            name: product._id.title,
                            wantedQty: product.quantity,
                            actualQty: product._id.stock,
                        };
                        productsWithoutStock.push(b);
                        okStock = false;
                    }
                });
                if (okStock === true) {
                    //Cerrar carrito.
                    let answer = await cartService.closeCart(cid, userId);
                    if (answer.status === 'success') {
                        //Crear ticket
                        let ticketCreate = await ticketsService.save(cart.value, req.session.user);
                        if (ticketCreate.status === 'success') {
                            //Enviar correo con info.
                            await mailProducts(cart.value, user)
                            res.sendSuccessMessageAndValue("Emails sent.", ticketCreate.value)
                        } else {
                            // Abro de nuevo el carrito
                            await cartService.reopenCart(cid);
                            res.sendErrorMessage(ticketCreate.message)
                        }

                    } else {
                        res.sendErrorMessage(answer.message)
                    }
                } else {
                    res.sendErrorMessage("There is no stock for some products. Please review the wanted quantity. " + JSON.stringify(productsWithoutStock))
                }
            }

        } else {
            res.sendErrorMessage("There are no products in the cart.")
        }
        //res.render('../src/views/partials/pageNotFound.hbs', {userStatus: true, userName})
    } catch (error) {
        res.sendErrorMessage("closeCart controller error: " + error)
    }
}

export default {
    getCarts,
    addNewCart,
    getCartById,
    deleteCartById,
    addProductInCart,
    //updateCart,
    deleteProduct,
    closeCart
}