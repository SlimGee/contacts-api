import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UserFactory } from 'Database/factories'
export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await UserFactory.createMany(10)
    }
}
