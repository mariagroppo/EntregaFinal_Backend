import { mailProducts } from "../mail/nodemailer.js";
import { cartService, productService, ticketsService } from "../services/repository.js";
import { fileExists } from '../../utils.js';

const viewCarts = async (req, res) => {
    let userName=req.session.user.name;
    let userId = req.session.user.id;
    let userRole = req.session.user.role;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    let myProducts = false;
    if (userRole === 'premiumUser') {
        myProducts = true;
    }
    let email = req.session.user.email;
    let fileOK = await fileExists(email);
    if (fileOK === false) {
        email = 'perfil'
    }
    try {
        let listado = await cartService.getAll(userId);  
        if (listado.value?.length>0) {
            res.render('../src/views/partials/cart-list.hbs', { 
                carts: listado.value,
                cartsExists: true,
                userStatus: true,
                userName,
                enabled,
                myProducts,
                email
            });
        } else {
            res.render('../src/views/partials/cart-list.hbs', { 
                carts: null,
                cartsExists: false,
                userStatus: true,
                userName,
                enabled,
                myProducts,
                email
            });
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "getCarts controller error: " + error,
            userStatus: true,
            userName,
            enabled,
            myProducts,
            email
        })
    }

}

const addNewCart = async (req, res) => {
    let userName=req.session.user.name;
    let userId = req.session.user.id;
    let userRole = req.session.user.role;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    let myProducts = false;
    if (userRole === 'premiumUser') {
        myProducts = true;
    }
    let email = req.session.user.email;
    let fileOK = await fileExists(email);
    if (fileOK === false) {
        email = 'perfil'
    }
    try {
        let cart = await cartService.save(userId);
        res.render('../src/views/partials/error.hbs', { 
            message: cart.message,
            userStatus: true,
            userName,
            enabled,
            myProducts,
            email
        })
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "addNewCart controller error: " + error,
            userStatus: true,
            userName,
            enabled,
            myProducts,
            email
        })
    }
    
}

const cartById = async (req, res) => {
    let userName=req.session.user.name;
    let userId = req.session.user.id;
    let userRole = req.session.user.role;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    let myProducts = false;
    if (userRole === 'premiumUser') {
        myProducts = true;
    }
    let email = req.session.user.email;
    let fileOK = await fileExists(email);
    if (fileOK === false) {
        email = 'perfil'
    }
    try {
        let cid = req.params.cid;
        if (isNaN(cid)){
            res.render('../src/views/partials/error.hbs', { 
                message: "The ID must be an integer.",
                userStatus: true,
                userName,
                enabled,
                myProducts,
                email
            })
        } else {
            let cart = await cartService.getById(cid, userId);    
            if (cart.status === 'success') {
                res.render('../src/views/partials/cart-container.hbs', { 
                    cart: cart.value,
                    pExist: cart.pExist,
                    userStatus: true,
                    userName,
                    enabled,
                    myProducts,
                    email
                })
            } else {
                res.render('../src/views/partials/error.hbs', { 
                    message: cart.message,
                    userStatus: true,
                    userName,
                    enabled,
                    myProducts,
                    email
                })
            }
        }
        
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "getCartById controller error: " + error,
            userStatus: true,
            userName,
            enabled,
            myProducts,
            email
        })
    }
}

const deleteCartById = async (req, res) => {
    let userName=req.session.user.name;
    let userId = req.session.user.id;
    let userRole = req.session.user.role;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    let myProducts = false;
    if (userRole === 'premiumUser') {
        myProducts = true;
    }
    let email = req.session.user.email;
    let fileOK = await fileExists(email);
    if (fileOK === false) {
        email = 'perfil'
    }
    try {
        let idCart = parseInt(req.params.cid);
        let answer;
        if (!isNaN(idCart)) {
            answer = await cartService.deleteById(idCart,userId);
            res.render('../src/views/partials/error.hbs', { 
                message: answer.message,
                userStatus: true,
                userName,
                enabled,
                myProducts,
                email
            })
        } else {
            res.render('../src/views/partials/error.hbs', { 
                message: "The ID must be a number.",
                userStatus: true,
                userName,
                enabled,
                myProducts,
                email
            })
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "deleteCartById controller error: " + error,
            userStatus: true,
            userName,
            enabled,
            myProducts,
            email
        })
    }
}

const addProductInCart = async (req, res) => {
    let userName=req.session.user.name;
    let userId = req.session.user.id;
    let userRole = req.session.user.role;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    let myProducts = false;
    if (userRole === 'premiumUser') {
        myProducts = true;
    }
    let email = req.session.user.email;
    let fileOK = await fileExists(email);
    if (fileOK === false) {
        email = 'perfil'
    }
    try {
        let id = parseInt(req.params.pid);
        let qty = parseInt(req.body.productQtyInput);
        let product = await productService.getById(id);
        if (product.status === 'success') {
            let answer = await cartService.addProductInCart(product.value, qty, userId);
            res.render('../src/views/partials/error.hbs', { 
                message: answer.message,
                userStatus: true,
                userName,
                enabled,
                myProducts,
                email
            })
        } else {
            res.render('../src/views/partials/error.hbs', { 
                message: product.message,
                userStatus: true,
                userName,
                enabled,
                myProducts,
                email
            })
        }           
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "addProductInCart controller error: " + error,
            userStatus: true,
            userName,
            enabled,
            myProducts,
            email
        })
    }
    
}

const deleteProduct = async (req,res) => {
    let userName=req.session.user.name;
    let userId = req.session.user.id;
    let userRole = req.session.user.role;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    let myProducts = false;
    if (userRole === 'premiumUser') {
        myProducts = true;
    }
    let email = req.session.user.email;
    let fileOK = await fileExists(email);
    if (fileOK === false) {
        email = 'perfil'
    }
    try {
        let pid = parseInt(req.params.pid);
        let cid = parseInt(req.params.cid);
        let product = await productService.getById(pid);
        if (product.status === 'success') {
            let id = product.value._id;
            let answer = await cartService.deleteProduct(cid, id, userId);
            res.render('../src/views/partials/error.hbs', { 
                message: answer.message,
                userStatus: true,
                userName,
                enabled,
                myProducts,
                email
            })
        } else {
            res.render('../src/views/partials/error.hbs', { 
                message: "Error while trying to delete the product.",
                userStatus: true,
                userName,
                enabled,
                myProducts,
                email
            })
        }

    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "deleteProduct controller error: " + error,
            userStatus: true,
            userName,
            enabled,
            myProducts,
            email
        })
    }
}

const updateCart = async (req, res) => {
    let userName=req.session.user.name;
    let userId = req.session.user.id;
    let userRole = req.session.user.role;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    let myProducts = false;
    if (userRole === 'premiumUser') {
        myProducts = true;
    }
    let cid = parseInt(req.params.cid);
    let email = req.session.user.email;
    let fileOK = await fileExists(email);
    if (fileOK === false) {
        email = 'perfil'
    }
    try {
        let data = req.body;
        let a = JSON.stringify(data).split('"');
        let prodId = a[1];
        let newQty = a[3];
        let product = await productService.getById(prodId);
        if (product.status === 'success') {
            let id = product.value._id;
            let answer = await cartService.updateCart(cid, id, newQty, userId);
            res.render('../src/views/partials/error.hbs', { 
                message: answer.message,
                userStatus: true,
                userName,
                enabled,
                myProducts,
                email
            })
        } else {
            res.render('../src/views/partials/error.hbs', { 
                message: "Error while trying to update the cart.",
                userStatus: true,
                userName,
                enabled,
                myProducts,
                email
            })
        }

    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "updateCart controller error: " + error,
            userStatus: true,
            userName,
            enabled,
            myProducts,
            email
        })
    }
}

const closeCart = async (req, res) => {
    let userName=req.session.user.name;
    let userId = req.session.user.id;
    let userRole = req.session.user.role;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    let myProducts = false;
    if (userRole === 'premiumUser') {
        myProducts = true;
    }
    let email = req.session.user.email;
    let fileOK = await fileExists(email);
    if (fileOK === false) {
        email = 'perfil'
    }
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
                        let b = `Product ID ${product._id.id} - ${product._id.title} - Stock: ${product._id.stock} - Cantidad requerida: ${product.quantity}`
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
                            await mailProducts(cart.value, req.session.user)
                            //RENDERIZO PAGINA DE TICKET
                            res.render('../src/views/partials/ticket.hbs', { 
                                value: ticketCreate.value,
                                userStatus: true,
                                userName,
                                enabled,
                                myProducts,
                                email
                            })
                        } else {
                            // Abro de nuevo el carrito
                            await cartService.reopenCart(cid);
                            res.render('../src/views/partials/error.hbs', { 
                                message: ticketCreate.message,
                                userStatus: true,
                                userName,
                                enabled,
                                myProducts,
                                email
                            })
                        }

                    } else {
                        res.render('../src/views/partials/error.hbs', { 
                            message: answer.message,
                            userStatus: true,
                            userName,
                            enabled,
                            myProducts,
                            email
                        })
                    }
                } else {
                    res.render('../src/views/partials/error.hbs', { 
                        message: "There is no stock for some products. Please review the wanted quantity for the following products: " + JSON.stringify(productsWithoutStock),
                        userStatus: true,
                        userName,
                        enabled,
                        myProducts,
                        email
                    })
                }
            }

        } else {
            res.render('../src/views/partials/error.hbs', { 
                message: "There are no products in the cart.",
                userStatus: true,
                userName,
                enabled,
                myProducts,
                email
            })
        }
        //res.render('../src/views/partials/pageNotFound.hbs', {userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "closeCart controller error: " + error,
            userStatus: true,
            userName,
            enabled,
            myProducts,
            email
        })
    }
}

const ticket = async (req, res) => {
    let userName=req.session.user.name;
    let userRole = req.session.user.role;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    let myProducts = false;
    if (userRole === 'premiumUser') {
        myProducts = true;
    }
    let email = req.session.user.email;
    let fileOK = await fileExists(email);
    if (fileOK === false) {
        email = 'perfil'
    }
    try {
        res.render('../src/views/partials/ticket.hbs', { 
            message: "closeCart controller error: " + error,
            userStatus: true,
            userName,
            enabled,
            myProducts,
            email
        })


    } catch (error) {
        res.render('../src/views/partials/error.hbs', { 
            message: "closeCart controller error: " + error,
            userStatus: true,
            userName,
            enabled,
            myProducts,
            email
        })
    }
}

export default {
    viewCarts,
    addNewCart,
    cartById,
    deleteCartById,
    addProductInCart,
    deleteProduct,
    updateCart,
    closeCart,
    ticket
}