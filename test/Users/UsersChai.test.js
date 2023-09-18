import { connection } from "../../src/dao/mongodb/config.js";
import { expect } from "chai";
import UserManager from '../../src/dao/mongodb/managers/userManager.js';
//import config from "../../src/config.js";
import { createHash, validatePassword } from '../../utils.js';
//import UserDTO from "../../src/dtos/user.dto.js";

connection();

describe("CHAI Testing", function () {

    this.timeout(5000);

    before(function () {
        this.userDao = new UserManager();
    })


    it("El DAO debe devolver usuarios en formato de arreglo.", async function () {
        const result = await this.userDao.listUsers();
        expect(Array.isArray(result)).to.be.true;
    })

    it("El DAO debe instertar correctamente un ususario en la base.", async function () {
        const mockUser = {
            first_name: "Usuario",
            last_name: "Test",
            email: "test@unitario.com",
            password: "123"
        }

        const result = await this.userDao.createUser(mockUser);
        expect(result.value).to.have.property("_id");
    })

    /* ------------------------------------------------------------------------------------------- */
    describe("Utils Testing", function () {
        describe("bcrypt", function () {

            it("La funcion createHash debe hacer un hasheo efectivo.", async function () {
                const testPass = "123";
                const hashedPass = await hasher.createHash(testPass);
                expect(/^[$]2[abxy]?[$](?:0[4-9]|[12][0-9]|3[01])[$][./0-9a-zA-Z]{53}$/.test(hashedPass)).to.be.equal(true);
            })

            it("La función validatePassword debe comparar la pwd ingresada con la pwd hasheada en la BD correctamente.", async function() {
                const testPass = "123";
                const hashedPass = await hasher.createHash(testPass);
                expect(await hasher.validatePassword(testPass, hashedPass)).to.be.ok.and.to.be.true;
            })

        })       

    })

})