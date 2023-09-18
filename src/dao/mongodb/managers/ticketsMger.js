import { Ticket } from "../models/ticketModel.js";

class TicketMongoDB {
    
    save = async (cart, user) => {
        try {
            let timestamp = Date.now();
            let code = user.email + "-" + timestamp;
            let amount=0;
            //console.log(cart)
            for (let index = 0; index < cart.products.length; index++) {
                amount = amount + cart.products[index].quantity * cart.products[index]._id.price;
            }
            const ticket = {
                codeTicket: code,
                timestamp: timestamp,
                cart: cart._id,
                amount: amount,
                purchaser: user.id
            }
            const newTicket = new Ticket(ticket);
            await newTicket.save();
            return { status: 'success', message: `Ticket guardado.`, value: newTicket}            
        } catch (error) {
            return { status: 'error', message: `Ticket Manager save Mongo DB error: ${error}.`, value: false}
        }
        
    } 

    
}

export default TicketMongoDB;