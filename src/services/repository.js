// Sirve para no mantener una conexión intermedia entre el DAO y el controlador.
// Toma el DAO del factory y define el metodo.

import PersistenceFactory from "../dao/mongodb/Factory.js";

import UserRepository from "./user.repository.js";
import CartRepository from "./cart.repository.js";
import ProductRepository from "./products.repository.js";
import TicketRepostory from "./tickets.repository.js";

let { usersDAO, productsDAO, cartsDAO, ticketsDAO } = await PersistenceFactory.getPersistence();
export const userService = new UserRepository(usersDAO)
export const productService = new ProductRepository(productsDAO);
export const cartService = new CartRepository(cartsDAO);
export const ticketsService = new TicketRepostory(ticketsDAO);
