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

test('GET /reviews debe traer todas las reviews', async () => {
    const res = await request(app).get('/reviews');
    expect(res.status).toBe(200);
});

test('POST /reviews debe crear las reservaciones', async () => {
    const body = {
        "rating": 4,
        "comment": "Buen hotel",
    }
    const res = await request(app).post('/reviews')
        .send(body)
        .set('Authorization', `Bearer ${token}`);
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.rating).toBe(body.rating);
});

test('PUT /reviews/:id debe actualizar las reviews', async () => {
    const body = {
        "rating": 5,
    }
    const res = await request(app).put(`/reviews/${id}`).send(body)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.rating).toBe(body.rating);
});

test('DELETE /reviews/:id debe eliminar la review', async () => {
    const res = await request(app).delete(`/reviews/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});