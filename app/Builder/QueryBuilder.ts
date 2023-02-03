import { BaseModel } from '@adonisjs/lucid/build/src/Orm/BaseModel'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RequestContract } from '@ioc:Adonis/Core/Request'

class QueryBuilder {
    private subject: BaseModel
    private request: RequestContract

    constructor(subject: BaseModel, { request }: HttpContextContract) {
        this.initializeSubject(subject).initializeRequest(request)
    }

    initializeRequest(request: RequestContract) {
        this.request = request
        return this
    }

    public initializeSubject(subject: BaseModel) {
        this.subject = subject
        return this
    }

    public static for(subject: BaseModel, ctx: HttpContextContract) {
        return new QueryBuilder(subject, ctx)
    }
}
