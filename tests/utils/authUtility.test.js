const jwt = require('jsonwebtoken');
const { generateToken } = require('../../../server/utils/authUtility');

jest.mock('jsonwebtoken');

describe('authUtility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'testsecret';
  });

  it('should generate a token with the correct payload and options', () => {
    const mockToken = 'mockToken';
    jwt.sign.mockReturnValue(mockToken);

    const userId = 1;
    const role = 'user';
    const token = generateToken(userId, role);

    expect(token).toBe(mockToken);
    expect(jwt.sign).toHaveBeenCalledWith({ userId, role }, 'testsecret', { expiresIn: '1h' });
  });

  it('should throw an error if JWT_SECRET is not defined', () => {
    delete process.env.JWT_SECRET;

    expect(() => generateToken(1, 'user')).toThrow('JWT_SECRET is not defined');
  });
});