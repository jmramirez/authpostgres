import TestHelper from '../tests-helper'
import models from '../../src/models'

describe('Role', ()=> {
    beforeAll(async () => {
        await TestHelper.startDb()
    })

    afterAll(async () => {
        await TestHelper.stopDb()
    })

    beforeEach(async () => {
        await TestHelper.syncDb()
    })

    it('should delete role records is user is removed', async () => {
        const { Role } = models
        const rolesForNewUser = ['admin', 'customer']
        const user = await TestHelper.createNewUser({ roles: rolesForNewUser })
        let rolesCount = await  Role.count()
        expect(rolesCount).toEqual(rolesForNewUser.length)
        await user.destroy()
        rolesCount = await Role.count()
        expect(rolesCount).toEqual(0)
    })
})