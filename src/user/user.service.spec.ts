import { Test } from "@nestjs/testing"
import { PrismaService } from "../../prisma/prisma.service"
import { UserService } from "./user.service"
import { prismaMock, userMock, userMockWithToken } from "../__test__/mock";
import { faker } from "@faker-js/faker";





describe('The userService suite test', () => {

    let userService: UserService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: PrismaService,
                    useValue: prismaMock
                }
            ]
        }).compile();

        userService = await module.get(UserService);

        prismaMock.user.findUnique.mockClear();
        prismaMock.user.findFirst.mockClear();

    })



    describe('When the method findByUnique is called', () => {

        it('Should return the user with id', async () => {
            let userSample = userMock
            prismaMock.user.findUnique.mockResolvedValue(userSample);
            const result = await userService.findByUnique({ id: userSample.id })
            expect(result).toEqual(userSample)
            expect(result).toHaveProperty('password');

            expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: userSample.id } })
        })

        it('Shouldn\'t return the user with id', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);
            const fakerId = faker.string.uuid();
            const result = await userService.findByUnique({ id: fakerId })
            expect(result).toBeNull()
            expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: fakerId } })
        })


    })

    describe('When the method findByRefreshToken is called', () => {

        it('Should return the user with refreshToken', async () => {
            let userSample = userMockWithToken
            const userPrimaMock = {
                id: userSample.id,
                email: userSample.email,
                status: userSample.status
            };
            prismaMock.user.findFirst.mockResolvedValue(userPrimaMock);
            const result = await userService.findByRefreshToken(userSample.refreshToken)
            expect(result).toEqual(userPrimaMock)
            expect(result).not.toHaveProperty('password');
            expect(result).not.toHaveProperty('refreshToken');

            expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
            expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
                where: { refreshToken: userSample.refreshToken },
                select: {
                    id: true,
                    email: true,
                    status: true
                }
            })
        })

        it('Shouldn\'t return the user with empty refreshToken', async () => {
            prismaMock.user.findFirst.mockResolvedValue(null);
            const refreshTokenSample = faker.string.nanoid();
            const result = await userService.findByRefreshToken(refreshTokenSample)
            expect(result).toBeNull()
            expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
            expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
                where: { refreshToken: refreshTokenSample },
                select: {
                    id: true,
                    email: true,
                    status: true
                }
            })
        })


    })

})