const mysql = require('mysql2/promise');
const db = require('../../../server/config/db');

jest.mock('mysql2/promise');

describe('Database Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a MySQL connection pool with the correct configuration', () => {
    expect(mysql.createPool).toHaveBeenCalledWith({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  });

  it('should successfully connect to the MySQL database', async () => {
    const mockConnection = {
      release: jest.fn(),
    };
    mysql.createPool.mockReturnValue({
      getConnection: jest.fn().mockResolvedValue(mockConnection),
    });

    const connection = await db.getConnection();
    expect(connection).toBe(mockConnection);
    expect(mockConnection.release).toHaveBeenCalled();
  });

  it('should handle database connection failure', async () => {
    const errorMessage = 'Connection failed';
    mysql.createPool.mockReturnValue({
      getConnection: jest.fn().mockRejectedValue(new Error(errorMessage)),
    });

    try {
      await db.getConnection();
    } catch (err) {
      expect(err.message).toBe(errorMessage);
    }
  });

  it('should execute a query successfully', async () => {
    const mockResults = [{ id: 1, name: 'Test' }];
    mysql.createPool.mockReturnValue({
      query: jest.fn().mockResolvedValue([mockResults]),
    });

    const results = await db.query('SELECT * FROM test_table');
    expect(results).toEqual(mockResults);
    expect(mysql.createPool().query).toHaveBeenCalledWith('SELECT * FROM test_table', undefined);
  });

  it('should handle query failure', async () => {
    const errorMessage = 'Query failed';
    mysql.createPool.mockReturnValue({
      query: jest.fn().mockRejectedValue(new Error(errorMessage)),
    });

    try {
      await db.query('SELECT * FROM test_table');
    } catch (err) {
      expect(err.message).toBe(errorMessage);
    }
  });
});