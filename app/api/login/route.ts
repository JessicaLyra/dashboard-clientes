import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email e senha obrigatórios' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    );
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    return NextResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set('session', user.id, {
    httpOnly: true,
    path: '/',
  });

  return response;
}
