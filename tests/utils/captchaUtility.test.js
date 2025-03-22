const { createCanvas } = require('canvas');
const { generateCaptcha, generateCaptchaImage } = require('../../../server/utils/captchaUtility');

jest.mock('canvas');

describe('captchaUtility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCaptcha', () => {
    it('should generate a 6-character captcha text', () => {
      const captchaText = generateCaptcha();
      expect(captchaText).toHaveLength(6);
      expect(/^[A-Za-z0-9]{6}$/.test(captchaText)).toBe(true);
    });
  });

  describe('generateCaptchaImage', () => {
    it('should generate a captcha image with the given text', () => {
      const mockCanvas = {
        getContext: jest.fn().mockReturnValue({
          fillStyle: '',
          fillRect: jest.fn(),
          font: '',
          fillText: jest.fn(),
        }),
        toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockdata'),
      };
      createCanvas.mockReturnValue(mockCanvas);

      const text = 'ABC123';
      const imageData = generateCaptchaImage(text);

      expect(createCanvas).toHaveBeenCalledWith(150, 50);
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
      expect(mockCanvas.getContext().fillStyle).toBe('#f0f0f0');
      expect(mockCanvas.getContext().fillRect).toHaveBeenCalledWith(0, 0, 150, 50);
      expect(mockCanvas.getContext().font).toBe('30px Arial');
      expect(mockCanvas.getContext().fillStyle).toBe('#000');
      expect(mockCanvas.getContext().fillText).toHaveBeenCalledWith(text, 25, 35);
      expect(imageData).toBe('data:image/png;base64,mockdata');
    });
  });
});