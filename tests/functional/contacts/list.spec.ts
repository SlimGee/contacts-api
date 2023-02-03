import { test } from '@japa/runner'
import Route from '@ioc:Adonis/Core/Route'

test.group('Contacts list', () => {
    test('it can list all contacts', async ({ client }) => {
        const response = await client.get(Route.makeUrl('contacts.index'))

        response.assertStatus(200)
    })
})
