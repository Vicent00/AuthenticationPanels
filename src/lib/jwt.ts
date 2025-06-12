import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-seguro';

export const generateToken = (payload: any) => {
  try {
    console.log('Generating token with payload:', payload);
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    console.log('Token generated successfully');
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

export const verifyToken = (token: string) => {
  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified successfully:', decoded);
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};
