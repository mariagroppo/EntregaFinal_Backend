import {faker} from '@faker-js/faker/locale/es';

export const generateProduct = () => {
    return {
        //id:{ type: Number, required: false, index: true },
        title: faker.commerce.productName(),
        thumbnail: faker.image.urlPicsumPhotos(),
        price: faker.commerce.price(),
        code: faker.airline.flightNumber(),
        description: faker.commerce.productDescription(),
        category: faker.animal.type(),
        stock: faker.number.int()
    }
}