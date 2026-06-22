import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, content } = await req.json();

    if (!name || !email || !content) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        name,
        email,
        content,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Failed to create message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, archived, deleted } = await req.json();
    const updateData: any = {};
    if (archived !== undefined) updateData.archived = archived;
    if (deleted !== undefined) updateData.deleted = deleted;

    const message = await prisma.message.update({
      where: { id },
      data: updateData
    });
    return NextResponse.json(message);
  } catch (error) {
    console.error('Failed to update message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.message.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
