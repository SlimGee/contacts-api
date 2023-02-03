import Contact from 'App/Models/Contact'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Contact, ({ faker }) => {
    return {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        mobile: faker.phone.number(),
        address: faker.address.streetAddress(),
        mobile2: faker.phone.number(),
    }
}).build()
