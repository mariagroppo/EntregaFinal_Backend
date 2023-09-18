//Multer es un middleware
import multer from "multer";
import __dirname from "../../utils.js";

//¿Donde voy a almacenar?
const storage = multer.diskStorage({
    //cb = callback
    destination: function (req, file, cb) {
        // Determina la carpeta de destino basada en el tipo de documento
        let docType = file.fieldname;
        if (docType === "image") {
            cb(null, `${__dirname}/src/public/docs/profiles`)
        } else {
            cb(null, `${__dirname}/src/public/docs/docs`)
        }
      },
    filename: function (req, file, cb) {
        let name = req.session.user.email;
        let docType = file.fieldname;
        if (docType === "image") {
            cb(null, name + ".jpg")
        }else{
            cb(null, `${name}-${Date.now()}-${file.originalname}`)
        }
    }
})

const uploader = multer({storage});

export default uploader;