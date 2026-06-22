import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const certs = await prisma.certification.findMany();
  return NextResponse.json(certs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const cert = await prisma.certification.create({ data: body });
  return NextResponse.json(cert);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.certification.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const { id, ...data } = await req.json();
  const cert = await prisma.certification.update({ where: { id }, data });
  return NextResponse.json(cert);
}
