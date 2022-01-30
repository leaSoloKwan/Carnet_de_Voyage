const app = require('../app')
const request = require('supertest')
const status = require('http-status');



describe('Tests about activity', () => {
    beforeAll(async () => {
        const response = await request(app).post('/login').send({ login: 'leask99@hotmail.fr', password: '123456' }).set('Accept', 'application/json')
        token_user1 = response.body.token
        const response2 = await request(app).post('/login').send({ login: 'houde.elina@orange.fr', password: '123soleil' }).set('Accept', 'application/json')
        token_user2 = response2.body.token
        const response3 = await request(app).post('/login').send({ login: 'user3@etu.fr', password: '12345678' }).set('Accept', 'application/json')
        token_user3 = response3.body.token
    });

    describe('GET request', () => {
        test('Get activities list (the user is the owner)', async () => {
            const expected_result = [
                {
                    "id": 1,
                    "name": "See the famous statue",
                    "type": "Visit",
                    "place": "Parc national de la Tijuaca",
                    "start": "Thu Jul 01 2021 11:30:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Thu Jul 01 2021 12:45:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "id_travel": 1
                  },
                  {
                    "id": 2,
                    "name": "Eat some food",
                    "type": "Meals",
                    "place": "Restaurante Marius Degustare",
                    "start": "Sat Jul 10 2021 12:30:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Sat Jul 10 2021 14:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "id_travel": 1
                  }
            ]

            const response = await request(app).get('/travels/1/activities')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get empty activities list', async () => {
            const expected_result = []

            const response = await request(app).get('/travels/2/activities')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get activities list => the user has rights for this travel', async () => {
            const expected_result = [
                {
                    "id": 1,
                    "name": "See the famous statue",
                    "type": "Visit",
                    "place": "Parc national de la Tijuaca",
                    "start": "Thu Jul 01 2021 11:30:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Thu Jul 01 2021 12:45:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "id_travel": 1
                  },
                  {
                    "id": 2,
                    "name": "Eat some food",
                    "type": "Meals",
                    "place": "Restaurante Marius Degustare",
                    "start": "Sat Jul 10 2021 12:30:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Sat Jul 10 2021 14:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "id_travel": 1
                  }
            ]

            const response = await request(app).get('/travels/1/activities')
            .set('authorization', token_user2)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get activities list => the user has no right for this travel', async () => {
            const expected_result = {"message": "You haven't the rights to access at it or the travel doesn't exist"};
            const response = await request(app).get('/travels/2/activities')
            .set('authorization', token_user2)
            expect(response.statusCode).toBe(403)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get activities list => the travel doesn\'t exist', async () => {
            const expected_result = {"message": "You haven't the rights to access at it or the travel doesn't exist"};

            const response = await request(app).get('/travels/254/activities')
            .set('authorization', token_user3)
            expect(response.statusCode).toBe(403)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get activities list => the activity doesn\'t exist', async () => {
            const expected_result = {"message": "The activity or travel doesn't exist or the travel doesn't have activities"};

            const response = await request(app).get('/travels/1/activities/520')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(404)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get activity by id => the user is the owner', async () => {
            const expected_result = {
                "id": 1,
                "name": "See the famous statue",
                "type": "Visit",
                "place": "Parc national de la Tijuaca",
                "start": "Thu Jul 01 2021 11:30:00 GMT+0200 (heure d’été d’Europe centrale)",
                "end": "Thu Jul 01 2021 12:45:00 GMT+0200 (heure d’été d’Europe centrale)",
                "id_travel": 1
            }

            const response = await request(app).get('/travels/1/activities/1')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get activity by id => the user has the rights', async () => {
            const expected_result = {
                "id": 1,
                "name": "See the famous statue",
                "type": "Visit",
                "place": "Parc national de la Tijuaca",
                "start": "Thu Jul 01 2021 11:30:00 GMT+0200 (heure d’été d’Europe centrale)",
                "end": "Thu Jul 01 2021 12:45:00 GMT+0200 (heure d’été d’Europe centrale)",
                "id_travel": 1
            }

            const response = await request(app).get('/travels/1/activities/1')
            .set('authorization', token_user2)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get activity by id => the user has no right', async () => {
            const expected_result = {"message": "You haven't the rights to access at it"}

            const response = await request(app).get('/travels/1/activities/1')
            .set('authorization', token_user3)
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get activity by id => the travel does\'nt exist', async () => {
            const expected_result = {"message": "You haven't the rights to access at it"}

            const response = await request(app).get('/travels/251/activities/1')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get activity by id => the activity does\'nt exist', async () => {
            const expected_result = {"message": "The activity or travel doesn't exist or the travel doesn't have activities"}

            const response = await request(app).get('/travels/1/activities/420')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(status.NOT_FOUND)
            expect(response.body).toStrictEqual(expected_result)
        });
    });

    describe('POST request', () => {
        test('Create a new activity', async () => {
            const activity = {"name":"voyage1","type":"type1", "place":"place1", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {msg: 'ok'}
            const expected_result2 = {
                "id": 8,
                "id_travel":1,
                "name": "voyage1",
                "type":"type1",
                "place": "place1",
                "start": "Fri Mar 12 2021 01:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "end": "Sun May 01 2022 02:00:00 GMT+0200 (heure d’été d’Europe centrale)",
              
            }

            const response = await request(app).post('/travels/1/activities')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(activity)})
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            const response2 = await request(app).get('/travels/1/activities/8')
            .set('authorization', token_user1)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)
        });

        test('Create a new activity without all the parameters', async () => {
            const travel = {"name":"voyage1","type":"type1","start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'You must specify the name, the type, the place, the start datetime, the end datetime to create the activity'}

            const response = await request(app).post('/travels/1/activities')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Create a new activity without valid dates', async () => {
            const travel = {"name":"voyage1","type":"type1", "place":"place1", "start":"2021-03-12hgrf", "end":"2022-05-01"}
            const expected_result = {message: 'You must specify valid date (format YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)'}

            const response = await request(app).post('/travels/1/activities')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Create a new activity with end date before start date', async () => {
            const travel = {"name":"voyage1","type":"type1", "place":"place1", "start":"2023-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'The start date need to be before the end date'}

            const response = await request(app).post('/travels/1/activities')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });
    });

    describe('PUT request', () => {
        test('Update a activity that the user owns', async () => {
            const travel = {"name":"voyage1modified","type":"type1", "place":"place1modified", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {msg: 'ok'}
            const expected_result2 = {
                "id": 8,
                "id_travel":1,
                "type":"type1",
                "name": "voyage1modified",
                "place": "place1modified",
                "start": "Fri Mar 12 2021 01:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "end": "Sun May 01 2022 02:00:00 GMT+0200 (heure d’été d’Europe centrale)",
            }

            const response = await request(app).put('/travels/1/activities/8')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            const response2 = await request(app).get('/travels/1/activities/8')
            .set('authorization', token_user1)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)
        });

        test('Update a activity that the user doesn\'t own', async () => {
            const travel = {"name":"voyage1","type":"type1", "place":"place1", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'You haven\'t the rights to modify it'}

            const response = await request(app).put('/travels/4/activities/6')
            .set('authorization', token_user3)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Update a activity which doesn\'t exist', async () => {
            const travel = {"name":"voyage1","type":"type", "place":"place1", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'The activity doesn\'t exist'}

            const response = await request(app).put('/travels/1/activities/256')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(404)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Update a activity without all the parameters', async () => {
            const travel = {"name":"voyage1", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'You must specify the name, the type, the place, the start datetime, the end datetime to modify the activity'}

            const response = await request(app).put('/travels/1/activities/8')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Update a activity without valid dates', async () => {
            const travel = {"name":"voyage1","type":"type1", "place":"place1", "start":"2021-03-12hgrf", "end":"2022-05-01"}
            const expected_result = {message: 'You must specify valid date (format YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)'}

            const response = await request(app).put('/travels/1/activities/8')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Update a activity with end date before start date', async () => {
            const travel = {"title":"voyage1","type":"type1", "place":"place1", "start":"2023-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'You must specify the name, the type, the place, the start datetime, the end datetime to modify the activity'}

            const response = await request(app).put('/travels/1/activities/8')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });
    });

    describe('DELETE request', () => {
        test('DELETE one activity of a user => the user don\'t own the activity', async () => {
            const expected_result = {"message": "You haven't the rights to delete it"}
            const expected_result2 = [
                {
                    "id": 3,
                    "name": "See \"la Joconde\"",
                    "type": "Visit",
                    "place": "Musee du Louvre",
                    "start": "Sat Dec 03 2022 09:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Sat Dec 03 2022 12:15:00 GMT+0100 (heure normale d’Europe centrale)",
                    "id_travel": 3
                  },
                  {
                    "id": 4,
                    "name": "Hiking",
                    "type": "Sport",
                    "place": "Forêt de Fontainebleau",
                    "start": "Sat Dec 10 2022 08:30:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Sun Dec 11 2022 17:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "id_travel": 3
                  },
                  {
                    "id": 5,
                    "name": "Aircraft",
                    "type": "Transports",
                    "place": "Aeroport de Paris",
                    "start": "Mon Dec 12 2022 06:12:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Mon Dec 12 2022 06:12:00 GMT+0100 (heure normale d’Europe centrale)",
                    "id_travel": 3
                  }
            ]
            const expected_result3 = [
                {
                    "id": 3,
                    "name": "See \"la Joconde\"",
                    "type": "Visit",
                    "place": "Musee du Louvre",
                    "start": "Sat Dec 03 2022 09:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Sat Dec 03 2022 12:15:00 GMT+0100 (heure normale d’Europe centrale)",
                    "id_travel": 3
                  },
                  {
                    "id": 4,
                    "name": "Hiking",
                    "type": "Sport",
                    "place": "Forêt de Fontainebleau",
                    "start": "Sat Dec 10 2022 08:30:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Sun Dec 11 2022 17:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "id_travel": 3
                  },
                  {
                    "id": 5,
                    "name": "Aircraft",
                    "type": "Transports",
                    "place": "Aeroport de Paris",
                    "start": "Mon Dec 12 2022 06:12:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Mon Dec 12 2022 06:12:00 GMT+0100 (heure normale d’Europe centrale)",
                    "id_travel": 3
                  }
            ]
           

            const response = await request(app).delete('/travels/1/activities/1')
            .set('authorization', token_user3)
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)

            // No changes for the user
            const response2 = await request(app).get('/travels/3/activities')
            .set('authorization', token_user1)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)

            // No changes for the owner of the travel
            const response3 = await request(app).get('/travels/3/activities')
            .set('authorization', token_user2)
            expect(response3.statusCode).toBe(200)
            expect(response3.body).toStrictEqual(expected_result3)
        });

        test('DELETE one activity of a user => the activity don\'t exist', async () => {
            const expected_result = {"message": "The activity doesn't exist"}

            const response = await request(app).delete('/travels/1/activities/420')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(status.NOT_FOUND)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('DELETE one activity of a user who own more than one act => the user own the travel', async () => {
            const expected_result = {"msg": "ok"}
            const expected_result2 = [
                {
                    "id": 3,
                    "name": "See \"la Joconde\"",
                    "type": "Visit",
                    "place": "Musee du Louvre",
                    "start": "Sat Dec 03 2022 09:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Sat Dec 03 2022 12:15:00 GMT+0100 (heure normale d’Europe centrale)",
                    "id_travel": 3
                  },
                  {
                    "id": 4,
                    "name": "Hiking",
                    "type": "Sport",
                    "place": "Forêt de Fontainebleau",
                    "start": "Sat Dec 10 2022 08:30:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Sun Dec 11 2022 17:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "id_travel": 3
                  }
            ]

            const response = await request(app).delete('/travels/3/activities/5')
            .set('authorization', token_user2)
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            const response2 = await request(app).get('/travels/3/activities')
            .set('authorization', token_user2)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)
        });

       
    });
})
