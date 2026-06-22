import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const publications = await prisma.publication.findMany();
  return NextResponse.json(publications);
}

export async function POST(req: Request) {
  const body = await req.json();
  const pub = await prisma.publication.create({ data: body });
  return NextResponse.json(pub);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.publication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const { id, ...data } = await req.json();
  const pub = await prisma.publication.update({ where: { id }, data });
  return NextResponse.json(pub);
}
