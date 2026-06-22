import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const skills = await prisma.$queryRawUnsafe('SELECT * FROM Skill');
  return NextResponse.json(skills);
}

export async function POST(req: Request) {
  const body = await req.json();
  const skill = await prisma.skill.create({ data: body });
  return NextResponse.json(skill);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const { id, ...data } = await req.json();
  const skill = await prisma.skill.update({ where: { id }, data });
  return NextResponse.json(skill);
}
