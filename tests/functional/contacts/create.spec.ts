import { test } from '@japa/runner'
import Route from '@ioc:Adonis/Core/Route'
import { faker } from '@faker-js/faker'
import Contact from 'App/Models/Contact'

test.group('Contacts create', (group) => {
    group.each.setup(() => () => console.log('new test'))

    test('can create contact', async ({ client, assert }) => {
        const response = await client.post(Route.makeUrl('contacts.store')).json({
            email: faker.internet.email(),
            name: faker.name.fullName(),
            address: faker.address.streetAddress(),
            mobile: '0719071581',
            mobile2: null,
        })

        response.assertStatus(201)
        assert.equal(1, (await Contact.all()).length)
    })

    test('it throws validation errors if required inputs are missing', async ({ client }) => {
        const response = await client.post(Route.makeUrl('contacts.store')).json({
            email: faker.internet.email(),
            name: faker.name.fullName(),
            address: faker.address.streetAddress(),
            mobile: null,
            mobile2: '0719071581',
        })

        response.assertStatus(422)
    })
})
