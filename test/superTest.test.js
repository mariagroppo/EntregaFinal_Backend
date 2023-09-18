import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
//Debo tener iniciado el servidor en otra consola.
const requester = supertest('http://localhost:8080');

describe('Testing integrador', function () {
    this.timeout(5000);
    describe('Tests de usuarios', function () {
        it('Endpoint POST /api/sessions debe crear correctamente un usuario en la BD.', async function () {
            const mockUser = {
                first_name: "Usuario",
                last_name: "SuperTest",
                email: "test@supertest.com",
                password: "123"
            }
            const response = await requester.post('/api/sessions/register').send(mockUser);
            const {status, _body} = response;
            expect(status).to.be.equal(200)
            //expect(_body.payload._id).to.be.ok;
        })

        it('Endpoint POST /api/sessions debe arrojar un error si no se pasan los valores necesarios.', async function () {
            const mockUser = {
                first_name: "Usuario"
            }
            const response = await requester.post('/api/sessions/register').send(mockUser);
            const {status} = response;
            expect(status).not.to.be.equal(200)
        })

    })

    describe('Test de elementos avanzados', async function() {
        /* it('Endpoint POST /api/sessions/register debe registrar OK.', async function () {
            const mockUser = {
                first_name: "Usuario",
                last_name: "SuperTest",
                email: "test@supertest.com",
                password: "123"
            }
            const {status} = await requester.post('/api/sessions/register').send(mockUser);
            expect(status).to.be.equal(200)
        }) */
        let cookie;
        it('Endpoint POST /api/sessions/login debe loguear OK.', async function () {
            const mockUser = {
                first_name: "Tiago",
                last_name: "Groppo",
                email: "tiago@gmail.com",
                password: "123"
            }
            const response = await requester.post('/api/sessions/login').send(mockUser);
            const cookieResult = response.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }
            //console.log(cookie)
            expect(cookie.name).to.be.ok.and.equal("connect.sid");
            expect(cookie.value).to.be.ok;
        })

        it('Endpoint GET /api/sessions/current debe devolver la cookie del use.', async function () {
            //Debo mandar la cookie en formato de header
            const response = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
            console.log(response)
            //expect(_body).to.have.property('payload')
        })

    })
})