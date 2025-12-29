import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const clients = await prisma.client.findMany();
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email } = body;

  if (!name || !email) {
    return NextResponse.json(
      { error: 'Nome e email são obrigatórios' },
      { status: 400 }
    );
  }

  if (!email.includes('@')) {
    return NextResponse.json(
      { error: 'Email inválido' },
      { status: 400 }
    );
  }

  const client = await prisma.client.create({
    data: { name, email },
  });

  return NextResponse.json(client);
}



export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'ID não informado' },
      { status: 400 }
    );
  }

  await prisma.client.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name, email } = body;

  if (!id || !name || !email) {
    return NextResponse.json(
      { error: 'Dados inválidos' },
      { status: 400 }
    );
  }

  const updatedClient = await prisma.client.update({
    where: { id },
    data: { name, email },
  });

  return NextResponse.json(updatedClient);
}
