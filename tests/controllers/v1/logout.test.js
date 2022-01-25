import TestHelper from '../../tests-helper';
import models from '../../../src/models';
import request from 'supertest';

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
        .post('/v1/logout')
        .set('Authorization', 'Bearer invalidtoken')
        .send()
        .expect(401);
      expect(response.body.success).toEqual(false);
      expect(response.body.message).toEqual('Invalid Token');
    });
  });
  it('should logout an user successfully', async () => {
    const accessToken = newUserResponse.body.data.accessToken;
    const response = await request(app)
      .post('/v1/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(200);
    expect(response.body.success).toEqual(true);
    expect(response.body.message).toEqual('Successfully logged out');
    const { User, RefreshToken } = models;
    const user = await User.findOne({
      where: { email: 'test@example.com' },
      include: RefreshToken,
    });
    expect(user.RefreshToken.token).toBeNull()
  });
});
