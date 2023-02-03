import { test } from '@japa/runner'
import { ContactFactory } from 'Database/factories'
import Route from '@ioc:Adonis/Core/Route'
import { faker } from '@faker-js/faker'

test.group('Contacts update', () => {
    test('it can update a contact', async ({ client, assert }) => {
        const contact = await ContactFactory.create()
        const newName = faker.name.fullName()
        const response = await client
            .patch(Route.makeUrl('contacts.update', { id: contact.id }))
            .json({
                name: newName,
            })
        console.log(response.dumpError())
        response.assertStatus(200)

        assert.equal(newName, (await contact.refresh()).name)
    })
})
