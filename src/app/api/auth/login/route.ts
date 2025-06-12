import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { setCookie } from '@/lib/cookies';

export async function POST(request: Request) {
  try {
    console.log('Login attempt started');
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    console.log('User found, verifying password');
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    console.log('Password verified, generating token');
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });

    console.log('Token generated, setting cookie');
    
    // Establecer la cookie usando nuestra utilidad
    await setCookie('token', token);

    console.log('Login successful for user:', email);
    return NextResponse.json(
      { success: true, user: { email: user.email, name: user.name } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in login route:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
