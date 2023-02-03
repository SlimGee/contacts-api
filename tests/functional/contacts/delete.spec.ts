import { test } from '@japa/runner'
import { ContactFactory } from 'Database/factories'
import Route from '@ioc:Adonis/Core/Route'
import Contact from 'App/Models/Contact'

test.group('Contacts delete', () => {
    test('it can delete a contact', async ({ client, assert }) => {
        const contact = await ContactFactory.create()
        const contactsCount = (await Contact.all()).length

        const response = await client.delete(Route.makeUrl('contacts.destroy', { id: contact.id }))

        response.assertStatus(204)

        assert.equal(contactsCount - 1, (await Contact.all()).length)
    })
})
