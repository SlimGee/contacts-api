import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { ContactFactory } from 'Database/factories'

export default class extends BaseSeeder {
    public async run() {
        await ContactFactory.createMany(20)
    }
}
