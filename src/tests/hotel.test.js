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
});

test('GET /hotels debe traer a todos los hoteles', async () => {
    const res = await request(app).get('/hotels');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('POST /hotels debe crear un hotel', async () => {
    const body = {
        "name": "test",
        "description": "test description",
        "price": "750",
        "address": "test",
        "lat": "20.875838090473664",
        "lon": "5.875838090473664",
    }
    const res = await request(app).post('/hotels')
        .send(body)
        .set('Authorization', `Bearer ${token}`);
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe(body.name);
});

test('PUT /hotels/:id debe actualizar un hotel', async () => {
    const body = {
        "name": "test actualizado"
    }
    const res = await request(app).put(`/hotels/${id}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(body.name);
});

test('DELETE /hotels/:id debe eliminar un hotel', async () => {
    const res = await request(app).delete(`/hotels/${id}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});