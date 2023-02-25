import { DateTime } from 'luxon'
import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Contact extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public email: string

    @column()
    public address: string

    @column()
    public mobile: string

    @column()
    public mobile2: string | null

    public static search = scope((query, term: string) => {
        query
            .whereRaw("name like '%" + term + "%'")
            .orWhereRaw("email like '%" + term + "%'")
            .orWhereRaw("address like '%" + term + "%'")
            .orWhereRaw("mobile like '%" + term + "%'")
            .orWhereRaw("mobile2 like '%" + term + "%'")
    })

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
