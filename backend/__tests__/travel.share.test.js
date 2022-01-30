const app = require('../app')
const request = require('supertest')
const status = require('http-status');



describe('Tests about shared travel and rights', () => {
    beforeAll(async () => {
        const response = await request(app).post('/login').send({ login: 'leask99@hotmail.fr', password: '123456' }).set('Accept', 'application/json')
        token_user1 = response.body.token
        const response2 = await request(app).post('/login').send({ login: 'houde.elina@orange.fr', password: '123soleil' }).set('Accept', 'application/json')
        token_user2 = response2.body.token
        const response3 = await request(app).post('/login').send({ login: 'user3@etu.fr', password: '12345678' }).set('Accept', 'application/json')
        token_user3 = response3.body.token
    });

    describe('GET request', () => {
        test('Get travels list with READER right', async () => {
            const expected_result = [
                {
                    "id": 3,
                    "title": "Paris !!!!",
                    "place": "Paris",
                    "start": "Wed Nov 30 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Mon Dec 12 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "owner": "houde.elina@orange.fr",
                    "right": "READER"
                }
            ]

            const response = await request(app).get('/travels/shared')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get travels list with WRITER right', async () => {
            const expected_result = [
                {
                    "id": 1,
                    "title": "Travel in Bresil",
                    "place": "Rio de Janeiro",
                    "start": "Wed Jun 30 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Mon Jul 12 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "owner": "leask99@hotmail.fr",
                    "right": "WRITER"
                }
            ]

            const response = await request(app).get('/travels/shared')
            .set('authorization', token_user2)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get empty travels list', async () => {
            const expected_result = []

            const response = await request(app).get('/travels/shared')
            .set('authorization', token_user3)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get travel by id => the user have reader right', async () => {
            const expected_result = {
                "id": 3,
                "title": "Paris !!!!",
                "place": "Paris",
                "start": "Wed Nov 30 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "end": "Mon Dec 12 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "owner": "houde.elina@orange.fr",
                "right": "READER"
            }

            const response = await request(app).get('/travels/3/shared')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get travel by id => the user have writer right', async () => {
            const expected_result = {
                "id": 1,
                "title": "Travel in Bresil",
                "place": "Rio de Janeiro",
                "start": "Wed Jun 30 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                "end": "Mon Jul 12 2021 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                "owner": "leask99@hotmail.fr",
                "right": "WRITER"
            }

            const response = await request(app).get('/travels/1/shared')
            .set('authorization', token_user2)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get travel by id => the user have no right', async () => {
            const expected_result = {"message": "The travel doesn't exist or you haven't the rights"}

            const response = await request(app).get('/travels/2/shared')
            .set('authorization', token_user2)
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get travel by id => the travel does\'nt exist', async () => {
            const expected_result = {"message": "The travel doesn't exist or you haven't the rights"}
            
            const response = await request(app).get('/travels/251/shared')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });
    });

    describe('GET request : get list of rights for a travel', () => {
        test('Get list of rights for a travel', async () => {
            const expected_result = [
                {
                    "right": "WRITER",
                    "user_email": "houde.elina@orange.fr",
                }
            ]

            const response = await request(app).get('/travels/1/share')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get list of rights  => there is no right', async () => {
            const expected_result = []

            const response = await request(app).get('/travels/2/share')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get list of rights => the user is not the owner', async () => {
            const expected_result = {"message": 'The travel doesn\'t exist or you haven\'t the rights'}

            const response = await request(app).get('/travels/3/share')
            .set('authorization', token_user1)
            console.log(response.body)
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Get list of rights => the travel doesn\'t exist', async () => {
            const expected_result = {"message": 'The travel doesn\'t exist or you haven\'t the rights'}

            const response = await request(app).get('/travels/251/share')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });
    });

    describe('POST request', () => {
        test('Give reading access right to a project which isn\'t shared at all', async () => {
            const rights = {"user_to_share":"user3@etu.fr", "rights":"READER"}
            const expected_result = {msg: 'ok'}
            const expected_result2 = [
                {
                    "id": 2,
                    "title": "Relax at home",
                    "place": "Limoges",
                    "start": "Wed Apr 29 2020 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Fri May 01 2020 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "owner": "leask99@hotmail.fr",
                    "right": "READER"
                }
            ]

            const response = await request(app).post('/travels/2/share')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(rights)})
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            const response2 = await request(app).get('/travels/shared')
            .set('authorization', token_user3)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)
        });

        test('Give writing access right to a project which is shared with another user yet', async () => {
            const rights = {"user_to_share":"user3@etu.fr", "rights":"WRITER"}
            const expected_result = {msg: 'ok'}
            const expected_result2 = {
                "id": 3,
                "title": "Paris !!!!",
                "place": "Paris",
                "start": "Wed Nov 30 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "end": "Mon Dec 12 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "owner": "houde.elina@orange.fr",
                "right": "WRITER"
            }
            const expected_result3 = {
                "id": 3,
                "title": "Paris !!!!",
                "place": "Paris",
                "start": "Wed Nov 30 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "end": "Mon Dec 12 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "owner": "houde.elina@orange.fr",
                "right": "READER"
            }

            const response = await request(app).post('/travels/3/share')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(rights)})
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            const response2 = await request(app).get('/travels/3/shared')
            .set('authorization', token_user3)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)

            // No change for the other user
            const response3 = await request(app).get('/travels/3/shared')
            .set('authorization', token_user1)
            expect(response3.statusCode).toBe(200)
            expect(response3.body).toStrictEqual(expected_result3)
        });

        test('The user shares a travel that he don\'t own', async () => {
            const rights = {"user_to_share":"user3@etu.fr", "rights":"WRITER"}
            const expected_result = {message: 'This travel doesn\'t exist or you haven\'t the rights to share this travel'}

            const response = await request(app).post('/travels/2/share')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(rights)})
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Share a travel to an user who don\'t exist', async () => {
            const rights = {"user_to_share":"mysterious_user@etu.fr", "rights":"WRITER"}
            const expected_result = {message: 'The user doesn\'t exist'}

            const response = await request(app).post('/travels/2/share')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(rights)})
            expect(response.statusCode).toBe(status.NOT_FOUND)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Share to an user who have rights for this travel yet', async () => {
            const rights = {"user_to_share":"houde.elina@orange.fr", "rights":"READER"}
            const expected_result = {message: 'You have to modify the existing rights for this user and not create some new rights'}

            const response = await request(app).post('/travels/1/share')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(rights)})
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });
    });

    describe('PUT request for rights', () => {
        test('Update access right of a travel for an user who have the access for two different travel', async () => {
            const rights = {"user_to_share":"user3@etu.fr", "rights":"READER"}
            const rights2 = {"user_to_share":"user3@etu.fr", "rights":"WRITER"}
            const expected_result = {msg: 'ok'}
            const expected_result2 = [
                {
                    "id": 3,
                    "title": "Paris !!!!",
                    "place": "Paris",
                    "start": "Wed Nov 30 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Mon Dec 12 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "owner": "houde.elina@orange.fr",
                    "right": "READER"
                },
                {   
                    "id": 2,
                    "title": "Relax at home",
                    "place": "Limoges",
                    "start": "Wed Apr 29 2020 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Fri May 01 2020 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "owner": "leask99@hotmail.fr",  
                    "right": "READER"
                }
            ]
            const expected_result4 = [
                {
                    "id": 3,
                    "title": "Paris !!!!",
                    "place": "Paris",
                    "start": "Wed Nov 30 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Mon Dec 12 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "owner": "houde.elina@orange.fr",
                    "right": "READER"
                },
                {   
                    "id": 2,
                    "title": "Relax at home",
                    "place": "Limoges",
                    "start": "Wed Apr 29 2020 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "end": "Fri May 01 2020 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                    "owner": "leask99@hotmail.fr",  
                    "right": "WRITER"
                }
            ]

            const response = await request(app).put('/travels/3/share')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(rights)})
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            const response2 = await request(app).get('/travels/shared')
            .set('authorization', token_user3)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2) // result in desc travel's start date order


            const response3 = await request(app).put('/travels/2/share')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(rights2)})
            expect(response3.statusCode).toBe(201)
            expect(response3.body).toStrictEqual(expected_result)
            
            // Change for the 1st travel and no change for the second one
            const response4 = await request(app).get('/travels/shared')
            .set('authorization', token_user3)
            expect(response4.statusCode).toBe(200)
            expect(response4.body).toStrictEqual(expected_result4)
        });

        test('Update access right of a travel which is shared to two users with the same rights', async () => {
            const rights = {"user_to_share":"user3@etu.fr", "rights":"WRITER"}
            const expected_result = {msg: 'ok'}
            const expected_result2 = {
                "id": 3,
                "title": "Paris !!!!",
                "place": "Paris",
                "start": "Wed Nov 30 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "end": "Mon Dec 12 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "owner": "houde.elina@orange.fr",
                "right": "WRITER"
            }
            const expected_result3 = {
                "id": 3,
                "title": "Paris !!!!",
                "place": "Paris",
                "start": "Wed Nov 30 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "end": "Mon Dec 12 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "owner": "houde.elina@orange.fr",
                "right": "READER"
            }

            const response = await request(app).put('/travels/3/share')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(rights)})
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            const response2 = await request(app).get('/travels/3/shared')
            .set('authorization', token_user3)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)

            // No change for the other user
            const response3 = await request(app).get('/travels/3/shared')
            .set('authorization', token_user1)
            expect(response3.statusCode).toBe(200)
            expect(response3.body).toStrictEqual(expected_result3)
        });

        test('Update access right of a travel that the user don\'t own', async () => {
            const rights = {"user_to_share":"user3@etu.fr", "rights":"WRITER"}
            const expected_result = {message: 'This travel doesn\'t exist or you haven\'t the rights to share this travel'}

            const response = await request(app).put('/travels/3/share')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(rights)})
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Update access right of a travel which don\'t exist', async () => {
            const rights = {"user_to_share":"user3@etu.fr", "rights":"WRITER"}
            const expected_result = {message: 'This travel doesn\'t exist or you haven\'t the rights to share this travel'}

            const response = await request(app).put('/travels/251/share')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(rights)})
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Update access right of a travel but the travel is not share with this user yet', async () => {
            const rights = {"user_to_share":"user3@etu.fr", "rights":"WRITER"}
            const expected_result = {message: 'You can\'t modify the rights for this user if he haven\'t rights for this travel'}

            const response = await request(app).put('/travels/1/share')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(rights)})
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });
    });

    describe('PUT request for travel', () => {
        test('Update a project when the user has writing right', async () => {
            const travel = {
                "title": "Travel in Bresil [modified]",
                "place": "Rio de Janeiro",
                "start": "2021-06-30",
                "end": "2021-07-12"
            }
            const expected_result = {msg: 'ok'}
            const expected_result2 = {
                "id": 1,
                "title": "Travel in Bresil [modified]",
                "place": "Rio de Janeiro",
                "start": "Wed Jun 30 2021 02:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                "end": "Mon Jul 12 2021 02:00:00 GMT+0200 (heure d’été d’Europe centrale)",
                "owner": "leask99@hotmail.fr",
                "right": "WRITER"
            }

            const response = await request(app).put('/travels/1/shared')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            const response2 = await request(app).get('/travels/1/shared')
            .set('authorization', token_user2)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)
        });

        test('Update a project when the user has reading right', async () => {
            const travel = {"title":"voyage1", "place":"place1", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'This travel doesn\'t exist or you haven\'t the rights for this operation'}

            const response = await request(app).put('/travels/3/shared')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Update a project which doesn\'t exist', async () => {
            const travel = {"title":"voyage1", "place":"place1", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'This travel doesn\'t exist or you haven\'t the rights for this operation'}

            const response = await request(app).put('/travels/5/shared')
            .set('authorization', token_user1)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Update a project without all the parameters', async () => {
            const travel = {"title":"voyage1", "start":"2021-03-12", "end":"2022-05-01"}
            const expected_result = {message: 'You must specify the title, the place, the start datetime and the end datetime to create a travel'}

            const response = await request(app).put('/travels/1/shared')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Update a project without valid dates', async () => {
            const travel = {"title":"voyage1", "place":"place1", "start":"2021-03-12hgrf", "end":"2022-05-01"}
            const expected_result = {message: 'You must specify valid date (format YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)'}

            const response = await request(app).put('/travels/1/shared')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });

        test('Update a project with end date bedore start date', async () => {
            const travel = {"title":"voyage1", "place":"place1", "start":"2022-05-01 11:00:00", "end":"2022-05-01 10:30:00"}
            const expected_result = {message: 'The start date need to be before the end date'}

            const response = await request(app).put('/travels/1/shared')
            .set('authorization', token_user2)
            .send({data: JSON.stringify(travel)})
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });
    });

    describe('DELETE request', () => {
        test('Delete writing access right of a travel for an user who have the access for two different travel', async () => {
            const expected_result = {msg: 'ok'}
            const expected_result2 = [
                {
                    "id": 3,
                    "title": "Paris !!!!",
                    "place": "Paris",
                    "start": "Wed Nov 30 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "end": "Mon Dec 12 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                    "owner": "houde.elina@orange.fr",
                    "right": "WRITER"
                }
            ]

            const response = await request(app).delete('/travels/2/share?user_to_share=user3@etu.fr')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            // The second travel is always shared
            const response2 = await request(app).get('/travels/shared')
            .set('authorization', token_user3)
            expect(response2.statusCode).toBe(200)
            expect(response2.body).toStrictEqual(expected_result2)
        });

        test('Delete access right of a travel which is shared to two users', async () => {
            const expected_result = {msg: 'ok'}
            const expected_result2 = {message: 'The travel doesn\'t exist or you haven\'t the rights'}
            const expected_result3 = {
                "id": 3,
                "title": "Paris !!!!",
                "place": "Paris",
                "start": "Wed Nov 30 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "end": "Mon Dec 12 2022 00:00:00 GMT+0100 (heure normale d’Europe centrale)",
                "owner": "houde.elina@orange.fr",
                "right": "READER"
            }

            const response = await request(app).delete('/travels/3/share?user_to_share=user3@etu.fr')
            .set('authorization', token_user2)
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)

            const response2 = await request(app).get('/travels/3/shared')
            .set('authorization', token_user3)
            expect(response2.statusCode).toBe(status.FORBIDDEN)
            expect(response2.body).toStrictEqual(expected_result2)

            // No change for the other user
            const response3 = await request(app).get('/travels/3/shared')
            .set('authorization', token_user1)
            expect(response3.statusCode).toBe(200)
            expect(response3.body).toStrictEqual(expected_result3)
        });

        test('Delete access right of a travel but the specified user don\'t exist', async () => {
            const expected_result = {msg: 'ok'}

            const response = await request(app).delete('/travels/3/share?user_to_share=mysterious_user@etu.fr')
            .set('authorization', token_user2)
            expect(response.statusCode).toBe(201)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Delete access right of a travel that the user don\'t own', async () => {
            const expected_result = {message: 'This travel doesn\'t exist or you haven\'t the rights for this operation'}

            const response = await request(app).delete('/travels/3/share?user_to_share=user3@etu.fr')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Delete access right of a travel which don\'t exist', async () => {
            const expected_result = {message: 'This travel doesn\'t exist or you haven\'t the rights for this operation'}

            const response = await request(app).delete('/travels/251/share?user_to_share=user3@etu.fr')
            .set('authorization', token_user2)
            expect(response.statusCode).toBe(status.FORBIDDEN)
            expect(response.body).toStrictEqual(expected_result)
        });

        test('Delete access right of a travel without specifying the user whose access rights will be removed', async () => {
            const expected_result = {message: 'You must specify the user\'s email of the user with which you have share this travel'}

            const response = await request(app).delete('/travels/1/share')
            .set('authorization', token_user1)
            expect(response.statusCode).toBe(status.BAD_REQUEST)
            expect(response.body.message).toStrictEqual(expected_result.message)
        });
    }); 
})
