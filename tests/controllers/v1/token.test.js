import TestHelper from '../../tests-helper';
import models from '../../../src/models';
import request from 'supertest';
import JWTUtils from '../../../src/utils/jwt.utils'

describe('token', () => {
  let app;
  let newUserResponse;

  beforeAll(async () => {
    await TestHelper.startDb();
    app = TestHelper.getApp();
  });

  afterAll(async () => {
    await TestHelper.stopDb();
  });

  beforeEach(async () => {
    await TestHelper.syncDb();
    newUserResponse = await TestHelper.registerNewUser({
      email: 'test@example.com',
      password: 'Test123#',
    });
  });

  describe('requiresAuth middleware', () => {
    it('should fail if refresh token is invalid', async () => {
      const response = await request(app)
        .post('/v1/token')
        .set('Authorization', 'Bearer invalidtoken')
        .send()
        .expect(401);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('Invalid Token');
    });
    it('should fail if no authorization header is present', async () => {
      const response = await request(app).post('/v1/token').send().expect(401);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('Authorization header not found');
    });
    it('should fail if refresh token is malformed', async () => {
      const response = await request(app)
          .post('/v1/token')
          .set('Authorization', 'Invalid')
          .send()
          .expect(401)
      expect(response.body.success).toEqual(false)
      expect(response.body.message).toEqual('Bearer malformed')
    });
  });

  describe('errors middleware', ()=> {
    it('should throw 500 error is something goes wrong', async () =>{
      const jwtUtilsSpy = jest.spyOn(JWTUtils, 'generateAccessToken')
      jwtUtilsSpy.mockImplementation(() => {
        throw Error('test error')
      })
      const refreshToken = newUserResponse.body.data.refreshToken
      const response = await request(app)
          .post('/v1/token')
          .set('Authorization', `Bearer ${refreshToken}`)
          .send()
          .expect(500)
      jwtUtilsSpy.mockRestore()
      expect(response.body.success).toEqual(false)
      expect(response.body.message).toEqual('test error')
    })
  })
});
