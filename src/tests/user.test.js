const request = require('supertest');
const app = require('../app');

let id;
let token;

test('POST /users debe crear al usuario', async () => {
    const body = {
        "firstName": "nombre",
        "lastName": "apellido",
        "email": "usuario@gmail.com",
        "password": "123456",
        "gender": "MALE"
    }
    const res = await request(app).post('/users').send(body);
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.firstName).toBe(body.firstName);

});

test('POST /users/login debe hacer login del usuario', async () => {
    const body = {
        "email": "usuario@gmail.com",
        "password": "123456",
    }
    const res = await request(app).post('/users/login').send(body);
    token = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(body.email);
});

test('POST /users/login con credenciales inválidas debe enviar un error', async () => {
    const body = {
        "email": "usuarioerror@gmail.com",
        "password": "123456error",
    }
    const res = await request(app).post('/users/login').send(body);
    expect(res.status).toBe(401);
});

test('GET /users debe retornar todos los usuarios', async () => {
    const res = await request(app).get('/users')
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('PUT /users/:id debe actualizar al usuario', async () => {
    const body = {
        "firstName": "nombre actualizado"
    }
    const res = await request(app).put(`/users/${id}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe(body.firstName);
});

test('DELETE /users/:id debe eliminar al usuario', async () => {
    const res = await request(app).delete(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});

