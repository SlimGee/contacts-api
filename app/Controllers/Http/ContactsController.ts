import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import Route from '@ioc:Adonis/Core/Route'
import StoreContactValidator from 'App/Validators/StoreContactValidator'
import UpdateContactValidator from 'App/Validators/UpdateContactValidator'
import { QueryBuilder } from 'App/Builder/QueryBuilder'

export default class ContactsController {
    public async index(ctx: HttpContextContract) {
        const contacts = await QueryBuilder.for(Contact, ctx)
            .sort(['name', 'id', 'email'])
            .filter({
                scopes: {
                    search: 'search',
                },
            })
            .get()

        return ctx.response.json({
            links: {
                self: Route.makeUrl('contacts.index'),
            },
            data: contacts,
        })
    }

    /**
     * Persist a resource in storage
     *
     * @param request
     * @param response
     */
    public async store({ request, response }: HttpContextContract) {
        const data = await request.validate(StoreContactValidator)

        const contact = await Contact.create(data)

        return response.created({
            data: {
                type: 'contacts',
                id: contact.id,
                attributes: contact,
            },
            links: {
                self: Route.makeUrl('contacts.show', { id: contact.id }),
            },
        })
    }

    /**
     * Display specified resource
     *
     * @param params
     * @param response
     */
    public async show({ params, response }: HttpContextContract) {
        const contact = await Contact.findOrFail(params.id)

        return response.json({
            links: {
                self: Route.makeUrl('contacts.show', { id: contact.id }),
            },
            data: {
                type: 'contacts',
                id: contact.id,
                attributes: contact,
            },
        })
    }

    /**
     * Update specified resource in storage
     *
     * @param response
     * @param request
     * @param params
     */
    public async update({ response, request, params }: HttpContextContract) {
        const contact = await Contact.findOrFail(params.id)

        const data = await request.validate(UpdateContactValidator)

        await contact.merge(data).save()

        return response.json({
            data: {
                type: 'contacts',
                id: contact.id,
                attributes: await contact.refresh(),
            },
            links: {
                self: Route.makeUrl('contacts.show', { id: contact.id }),
            },
        })
    }

    public async destroy({ response, params }: HttpContextContract) {
        const contact = await Contact.findOrFail(params.id)

        await contact.delete()

        return response.noContent()
    }
}
