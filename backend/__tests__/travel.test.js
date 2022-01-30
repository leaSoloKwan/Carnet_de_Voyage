const app = require('../app')
const request = require('supertest')
const status = require('http-status');



describe('Tests about travel', () => {
    beforeAll(async () => {
        const response = await request(app).post('/login').send({ login: 'leask99@hotmail.fr', password: '123456' }).set('Accept', 'application/json')
        token_user1 = response.body.token
        const response2 = await request(app).post('/login').send({ login: 'houde.elina@orange.fr', password: '123soleil' }).set('Accept', 'application/json')
        token_user2 = response2.body.token
        const response3 = await request(app).post('/login').send({ login: 'user3@etu.fr', password: '12345678' }).set('Accept', 'application/json')
        token_user3 = response3.body.token
    });

    describe('GET request', () => {
        test('Get travels list with one travel with activities, and one travel without activities', async () => {
            const expected_result = [
                {
                    "id": 1,
                    "title": "Travel in Bresil",
                    "place": "Rio de Janeiro",
                    "start": "Wed Jun 30 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Mon Jul 12 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "owner": "leask99@hotmail.fr"
                },
                {
                    "id": 4,
                    "title": "Travel in Mada",
                    "place": "Faraf",
                    "start": "Wed Jun 30 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Mon Jul 12 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "owner": "leask99@hotmail.fr",
                },
                {
                    "id": 2,
                    "title": "Relax at home",
                    "place": "Limoges",
                    "start": "Wed Apr 29 2020 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Fri May 01 2020 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "owner": "leask99@hotmail.fr"
                }
            ]

            const response = await request(app).get('/travels')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get travels list with just one travel', async () => {
            const expected_result = [
                {
                    "id": 3,
                    "title": "Paris !!!!",
                    "place": "Paris",
                    "start": "Wed Nov 30 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Mon Dec 12 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "owner": "houde.elina@orange.fr"
                }
            ]

            const response = await request(app).get('/travels')
            .set('authorization', token_user2)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get empty travels list', async () => {
            const expected_result = []

            const response = await request(app).get('/travels')
            .set('authorization', token_user3)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get travel by id => the user is the owner', async () => {
            const expected_result = {
                "id": 1,
                "title": "Travel in Bresil",
                "place": "Rio de Janeiro",
                "start": "Wed Jun 30 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                "end": "Mon Jul 12 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                "owner": "leask99@hotmail.fr"
            }

            const response = await request(app).get('/travels/1')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get travel by id => the user is not the owner', async () => {
            const expected_result = {"message": "The travel doesn't exist"}

            const response = await request(app).get('/travels/3')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(status.NOT_FOUND)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get travel by id => the travel does\'nt exist', async () => {
            const expected_result = {"message": "The travel doesn't exist"}

            const response = await request(app).get('/travels/251')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(status.NOT_FOUND)
            expect(response.body).toStrictEqual(expected_result)
        });
    });

    describe('POST request', () => {
        test('Create a new travel', async () => {
            const travel = {"title":"voyage1", "place":"place1", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {msg: 'ok'}
            const expected_result2 = {
                "id": 5,
                "title": "voyage1",
                "place": "place1",
                "start": "Fri Mar 12 2021 01:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "end": "Sun May 01 2022 02:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                "owner": "user3@etu.fr"
            }

            const response = await request(app).post('/travels/')
            .set('authorization', token_user3)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            const response2 = await request(app).get('/travels/5')
            .set('authorization', token_user3)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)
        });

        test('Create a new travel without all the parameters', async () => {
            const travel = {"title":"voyage1", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'You must specify the title, the place, the start datetime and the end datetime to create a travel'}

            const response = await request(app).post('/travels/')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Create a new travel without valid dates', async () => {
            const travel = {"title":"voyage1", "place":"place1", "start":"2021-03-12hgrf", "end":"2022-05-01"}
            const expected_result = {message: 'You must specify valid date (format YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)'}

            const response = await request(app).post('/travels/')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Create a new travel with end date before start date', async () => {
            const travel = {"title":"voyage1", "place":"place1", "start":"2023-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'The start date need to be before the end date'}

            const response = await request(app).post('/travels/')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });
    });

    describe('PUT request', () => {
        test('Update a travel that the user owns', async () => {
            const travel = {"title":"voyage1modified", "place":"place1modified", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {msg: 'ok'}
            const expected_result2 = {
                "id": 5,
                "title": "voyage1modified",
                "place": "place1modified",
                "start": "Fri Mar 12 2021 01:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "end": "Sun May 01 2022 02:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                "owner": "user3@etu.fr"
            }

            const response = await request(app).put('/travels/5')
            .set('authorization', token_user3)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            const response2 = await request(app).get('/travels/5')
            .set('authorization', token_user3)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)
        });

        test('Update a travel that the user doesn\'t own', async () => {
            const travel = {"title":"voyage1", "place":"place1", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'The travel doesn\'t exist'}

            const response = await request(app).put('/travels/1')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.NOT_FOUND)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Update a travel which doesn\'t exist', async () => {
            const travel = {"title":"voyage1", "place":"place1", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'The travel doesn\'t exist'}

            const response = await request(app).put('/travels/5')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.NOT_FOUND)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Update a travel without all the parameters', async () => {
            const travel = {"title":"voyage1", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'You must specify the title, the place, the start datetime and the end datetime to create a travel'}

            const response = await request(app).put('/travels/3')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Update a travel without valid dates', async () => {
            const travel = {"title":"voyage1", "place":"place1", "start":"2021-03-12hgrf", "end":"2022-05-01"}
            const expected_result = {message: 'You must specify valid date (format YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)'}

            const response = await request(app).put('/travels/3')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Update a travel with end date before start date', async () => {
            const travel = {"title":"voyage1", "place":"place1", "start":"2023-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'The start date need to be before the end date'}

            const response = await request(app).put('/travels/3')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });
    });

    describe('DELETE request', () => {
        test('DELETE one travel of a user => the user don\'t own the travel', async () => {
            const expected_result = {message: 'The travel doesn\'t exist or you haven\'t the rights to delete this travel'}
            const expected_result2 = [
                {
                    "id": 1,
                    "title": "Travel in Bresil",
                    "place": "Rio de Janeiro",
                    "start": "Wed Jun 30 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Mon Jul 12 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "owner": "leask99@hotmail.fr"
                },
                {
                    "id": 4,
                    "title": "Travel in Mada",
                    "place": "Faraf",
                    "start": "Wed Jun 30 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Mon Jul 12 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "owner": "leask99@hotmail.fr",
                },
                {
                    "id": 2,
                    "title": "Relax at home",
                    "place": "Limoges",
                    "start": "Wed Apr 29 2020 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Fri May 01 2020 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "owner": "leask99@hotmail.fr"
                }
            ]
            const expected_result3 = [
                {
                    "id": 3,
                    "title": "Paris !!!!",
                    "place": "Paris",
                    "start": "Wed Nov 30 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Mon Dec 12 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "owner": "houde.elina@orange.fr"
                }
            ]

            const response = await request(app).delete('/travels/3')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)

            // No changes for the user
            const response2 = await request(app).get('/travels')
            .set('authorization', token_user1)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)

            // No changes for the owner of the travel
            const response3 = await request(app).get('/travels')
            .set('authorization', token_user2)
            expect(response3.statusCode).toBe(200)
            expect(response3.body).toStrictEqual(expected_result3)
        });

        test('DELETE one travel of a user => the travel don\'t exist', async () => {
            const expected_result = {message: 'The travel doesn\'t exist or you haven\'t the rights to delete this travel'}

            const response = await request(app).delete('/travels/251')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('DELETE one travel of a user who own more than one travel => the user own the travel', async () => {
            const expected_result = {"msg": "ok"}
            const expected_result2 = [
                {
                    "id": 1,
                    "title": "Travel in Bresil",
                    "place": "Rio de Janeiro",
                    "start": "Wed Jun 30 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Mon Jul 12 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "owner": "leask99@hotmail.fr"
                },
                {
                    "id": 4,
                    "title": "Travel in Mada",
                    "place": "Faraf",
                    "start": "Wed Jun 30 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Mon Jul 12 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "owner": "leask99@hotmail.fr",
                }
            ]

            const response = await request(app).delete('/travels/2')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            const response2 = await request(app).get('/travels')
            .set('authorization', token_user1)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)
        });

        test('DELETE one travel of a user who own just one travel => the user own the travel', async () => {
            const expected_result = {"msg": "ok"}
            const expected_result2 = []

            const response = await request(app).delete('/travels/3')
            .set('authorization', token_user2)
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            const response2 = await request(app).get('/travels')
            .set('authorization', token_user2)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)
        });
    });
})
