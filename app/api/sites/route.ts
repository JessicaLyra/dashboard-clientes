import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 🔹 LISTAR SITES
export async function GET() {
  const sites = await prisma.site.findMany({
    include: {
      client: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(sites)
}

// 🔹 CRIAR SITE
export async function POST(request: Request) {
  const body = await request.json()
  const { name, url, clientId } = body

  if (!name || !url || !clientId) {
    return NextResponse.json(
      { error: 'Dados obrigatórios ausentes' },
      { status: 400 }
    )
  }

  const site = await prisma.site.create({
    data: {
      name,
      url,
      clientId,
      status: 'ATIVO',
    },
  })

  return NextResponse.json(site, { status: 201 })
}

// 🔹 EDITAR SITE
export async function PUT(request: Request) {
  const body = await request.json()
  const { id, name, url, status } = body

  if (!id || !name || !url || !status) {
    return NextResponse.json(
      { error: 'Dados obrigatórios ausentes' },
      { status: 400 }
    )
  }

  const site = await prisma.site.update({
    where: { id },
    data: { name, url, status },
  })

  return NextResponse.json(site)
}

// 🔹 EXCLUIR SITE
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'ID não informado' },
      { status: 400 }
    )
  }

  await prisma.site.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
