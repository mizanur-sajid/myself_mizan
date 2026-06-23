import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const socials = await prisma.social.findMany();
    return NextResponse.json(socials);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const social = await prisma.social.create({
      data: {
        name: data.name,
        url: data.url,
        icon: data.icon,
      }
    });
    return NextResponse.json(social);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
