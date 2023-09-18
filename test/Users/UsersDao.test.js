import { connection } from '../../src/dao/mongodb/config.js';
import UserManager from '../../src/dao/mongodb/managers/userManager.js';
// Comparación o preguntas usados por el framework de testing.
import Assert from 'assert';

// Forma estricta de hacer comparaciones
const assert = Assert.strict;

// Permite poner nombre y diferecias los contextos de pruebas.
describe("Testing del DAO de usuarios", function () {
    
    //Ya qe si la prueba tarda mas de 2seg la da como fallida.
    this.timeout(5000);

    //Se instancia para no hacerlo en cada una de las pruebas.
    before(function () {
        this.userDao = new UserManager();
    })
    
    //Se ejecuta antes de cada prueba.
    this.beforeEach(function(){
         connection();
    })

    // it seguido del nombre de la prueba.
    it("El DAO debe devolver usuarios en formato de arreglo.", async function () {
        const result = await this.userDao.listUsers();
        assert.strictEqual(Array.isArray(result), true);
    })

    it("El DAO debe instertar correctamente un ususario en la base.", async function () {
        const mockUser = {
            first_name: "Nombre de prueba",
            last_name: "Apellido de prueba",
            email: "test@mocha.com",
            password: "123"
        }

        const result = await this.userDao.createUser(mockUser);
        assert.ok(result.value._id);
    })

    it("El DAO debe verificar que el correo existe.", async function(){
        const result = await this.userDao.verifyMail({email:"test@mocha.com"});
        assert.strictEqual(result, true);
    })


})