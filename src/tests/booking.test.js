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

test('GET /bookings debe traer todas las reservaciones', async () => {
    const res = await request(app).get('/bookings')
        .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('POST /bookings debe crear las reservaciones', async () => {
    const body = {
        checkIn: "2024-02-10",
        checkOut: "2024-02-15"
    }
    const res = await request(app).post('/bookings').
        send(body)
        .set('Authorization', `Bearer ${token}`);
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.checkIn).toBe(body.checkIn);
});

test('PUT /bookings/:id debe actualizar las reservaciones', async () => {
    const body = {
        checkIn: "2024-02-11"
    }
    const res = await request(app).put(`/bookings/${id}`).send(body)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.checkIn).toBe(body.checkIn);
});

test('DELETE /bookings/:id debe eliminar la reservación', async () => {
    const res = await request(app).delete(`/bookings/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});