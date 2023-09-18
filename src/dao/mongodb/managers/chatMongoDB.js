import { Message } from "../models/msgModel.js";

class MessageMongoDB {
    
    /* Devuelve el array con los objetos presentes en el archivo ---------------------------------------- */
    getAll = async () => {
        try {
            const contenido = await Message.find().lean()
            let contenido2=contenido;
            for (let i = 0; i < contenido.length; i++) {
                contenido2[i]._id = contenido[i]._id.toString();
            }
            //console.log("getAll messages")
            //console.log(contenido2)
            return { status: 'success', message: "Messages ok.", value: contenido2}
            
        } catch (error) {
            return { status: 'error', message: "Error en getAll MongoDB: " + error, value: null}
        }
    } 

    save = async (newMessage) => {
        try {
            let newMess = new Message(newMessage);
            //console.log("Newmess en chatMongoDB.js: " + newMessage)
            await newMess.save();
            //console.log("msg guardado")
            return { status: 'success', message: "Message saved.", value: true}
        } catch (error) {
            //console.log("msg no guardado")
            return { status: 'error', message: "Message not saved." + error, value: false}
        }
    } 

    
}

export default MessageMongoDB;