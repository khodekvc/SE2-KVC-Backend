const bcrypt = require('bcrypt');
const { hashPassword, comparePassword } = require('../../../server/utils/passwordUtility');

jest.mock('bcrypt');

describe('passwordUtility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash the password with the correct salt rounds', async () => {
      const mockHash = 'hashedpassword';
      bcrypt.hash.mockResolvedValue(mockHash);

      const password = 'password123';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBe(mockHash);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('comparePassword', () => {
    it('should return true if the passwords match', async () => {
      bcrypt.compare.mockResolvedValue(true);

      const enteredPassword = 'password123';
      const storedHash = 'hashedpassword';
      const isMatch = await comparePassword(enteredPassword, storedHash);

      expect(isMatch).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(enteredPassword, storedHash);
    });

    it('should return false if the passwords do not match', async () => {
      bcrypt.compare.mockResolvedValue(false);

      const enteredPassword = 'password123';
      const storedHash = 'hashedpassword';
      const isMatch = await comparePassword(enteredPassword, storedHash);

      expect(isMatch).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(enteredPassword, storedHash);
    });
  });
});