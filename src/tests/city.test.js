const request = require('supertest');
const app = require('../app');

let token;
let id;

beforeAll(async () => {
    const res = await request(app).post('/users/login').send({
        "email": "test@gmail.com",
        "password": "test123",
    });
    token = res.body.token;
})

test('GET /cities trae a todas las ciudades', async () => {
    const res = await request(app).get('/cities');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('POST /cities crea una ciudad', async () => {
    const body = {
        "name": "Colombia",
        "country": "Bogota",
        "countryId": "CO"
    }
    const res = await request(app).post('/cities')
        .send(body)
        .set('Authorization', `Bearer ${token}`);
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe(body.name);
});

test('PUT /cities/:id actualiza una ciudad', async () => {
    const body = {
        "name": "Colombia actualizado",
    }
    const res = await request(app).put(`/cities/${id}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(body.name);
});

test('DELETE /cities/:id delete', async () => {
    const res = await request(app).delete(`/cities/${id}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});