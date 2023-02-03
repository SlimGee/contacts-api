import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import Route from '@ioc:Adonis/Core/Route'
import StoreContactValidator from 'App/Validators/StoreContactValidator'
import UpdateContactValidator from 'App/Validators/UpdateContactValidator'

export default class ContactsController {
    public async index({ response, request }: HttpContextContract) {
        let contacts = Contact.query()

        const allowedScopes = ['search']
        const allowedFilters = []
        const allowedSorts = []

        const { sort, filter } = request.qs()

        if (sort) {
            sort.split(',').forEach((param) => {
                const items = param.split('-')
                if (items.length == 2 && items[1] in allowedSorts) {
                    contacts = contacts.orderBy(items[1], 'desc')
                } else if (items[0] in allowedSorts) {
                    contacts = contacts.orderBy(items[0])
                }
            })
        }

        if (filter) {
            for (const filterKey in filter) {
                console.log(filterKey)

                if (allowedScopes.includes(filterKey)) {
                    contacts.withScopes((scopes) => scopes.search(filter[filterKey]))
                }
                if (filterKey in allowedFilters) {
                    contacts.where(filterKey, filter[filterKey])
                }
            }
        }

        //  const contacts = await Contact.all()

        return response.json({
            links: {
                self: Route.makeUrl('contacts.index'),
            },
            data: await contacts,
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
