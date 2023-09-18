import usersControllers from '../controllers/users-controllers.js';
import generalControllers from '../controllers/general.js';
import BaseRouter from './router.js';
import { privacy } from '../auth/auth.js';
import uploader from '../services/uploader.js';

export default class UsersRouter extends BaseRouter {
    init() {
        this.get('/', ['ADMIN'], privacy('PRIVATE'), usersControllers.listAllUsers)
        this.get('/lastConnection', ['ADMIN'], privacy('PRIVATE'), usersControllers.usersLastConnection)
        this.delete('/', ['ADMIN'], privacy('PRIVATE'), usersControllers.deleteUsersLastConnection)
        

        //Accepts all files that comes over the wire. An array of files will be stored in req.files.
        this.post('/documents', ['USER'], privacy('PRIVATE'), uploader.any(), usersControllers.uploadPremiumDoc);
        
        this.put('/premium/:uid', ['ADMIN'], privacy('PRIVATE'), usersControllers.changeUserToPremium);
        this.put('/premium/DNI/:uid', ['ADMIN'], privacy('PRIVATE'), usersControllers.updateDNIStatus);
        this.put('/premium/comp1/:uid', ['ADMIN'], privacy('PRIVATE'), usersControllers.updateComp1Status);
        this.put('/premium/comp2/:uid', ['ADMIN'], privacy('PRIVATE'), usersControllers.updateComp2Status);

        //this.post('upload-premium-doc', ['USER'], , privacy('PRIVATE'), usersControllers.uploadPremiumDoc);
        //this.post('/upload-premium-avatar', ['PUBLIC'], uploader.single('image'), usersControllers.uploadPremiumAvatar);
        //Accept a single file with the name fieldname. The single file will be stored in req.file.
        

        this.get('*', ['USER'], privacy('PRIVATE'), generalControllers.pageNotFound)
    }
}