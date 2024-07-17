import { faker } from "@faker-js/faker"
import { User, UserStatus } from "@prisma/client"


export const prismaMock = {
    user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
}


export const userMock: User = {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.string.nanoid(),
    status: UserStatus.CONNECTED,
    created_at: new Date(),
    updated_at: new Date(),
    refreshToken: null
}

export const userMockWithToken: User = {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.string.nanoid(),
    status: UserStatus.CONNECTED,
    created_at: new Date(),
    updated_at: new Date(),
    refreshToken: faker.string.nanoid()
}



