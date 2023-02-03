import { BaseModel, LucidModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export class QueryBuilder {
    /**
     * The subject model where query are carried out on
     *
     * @private
     */
    private subject: typeof BaseModel

    /**
     * The request to marshall query params from
     *
     * @private
     */
    private request: RequestContract

    /**
     * The allowed sorts
     *
     * @private
     */
    private sorts: Array<string> = []

    /**
     * The allowed filters
     *
     * @private
     */
    private filters: Object = {
        scopes: {},
        regular: [],
    }

    /**
     * Of course create a new instance
     *
     * @param subject the model to run queries on
     * @param request the incoming http request from the context
     */
    constructor(subject: typeof BaseModel, { request }: HttpContextContract) {
        this.initializeSubject(subject).initializeRequest(request)
    }

    /**
     * Simply set the request
     *
     * @param request
     * @private
     */
    private initializeRequest(request: RequestContract): QueryBuilder {
        this.request = request
        return this
    }

    /**
     * simply set the model
     *
     * @param subject
     * @private
     */
    private initializeSubject(subject: typeof BaseModel): QueryBuilder {
        this.subject = subject
        return this
    }

    /**
     * Ask for the query builder for a given model
     *
     * @param subject
     * @param ctx
     */
    public static for(subject: typeof BaseModel, ctx: HttpContextContract): QueryBuilder {
        return new QueryBuilder(subject, ctx)
    }

    /**
     * Declare the allowed sorts
     *
     * @param sorts
     */
    public sort(sorts: Array<string>): QueryBuilder {
        this.sorts = [...new Set([...this.sorts, ...sorts])]
        return this
    }

    /**
     * Declare the allowed filters
     *
     * @param scopes
     * @param regular
     */
    public filter({ scopes = {}, regular = [] }): QueryBuilder {
        this.filters['scopes'] = { ...this.filters['scopes'], ...scopes }
        this.filters['regular'] = [...new Set([...this.filters['regular'], ...regular])]
        return this
    }

    /**
     * Finally get the query builder
     */
    public get(): ModelQueryBuilderContract<LucidModel, InstanceType<LucidModel>> {
        let query = this.subject.query()

        const { sort, filter } = this.request.qs()

        if (sort) {
            sort.split(',').forEach((param) => {
                const items = param.split('-')

                if (items.length === 2 && this.sorts.includes(items[1])) {
                    query = query.orderBy(items[1], 'desc')
                } else if (this.sorts.includes(items[0])) {
                    query = query.orderBy(items[0])
                }
            })
        }

        if (filter) {
            for (const filterKey in filter) {
                if (Object.keys(this.filters['scopes']).includes(filterKey)) {
                    query.withScopes((scopes) => {
                        scopes[this.filters['scopes'][filterKey]](filter[filterKey])
                    })
                }
                if (this.filters['regular'].includes(filterKey)) {
                    query.where(filterKey, filter[filterKey])
                }
            }
        }

        return query
    }
}
