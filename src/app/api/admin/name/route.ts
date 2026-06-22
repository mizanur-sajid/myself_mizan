import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const filePath = join(process.cwd(), 'public', 'admin-name.txt');

export async function GET() {
  try {
    const data = await readFile(filePath, 'utf8');
    return NextResponse.json({ name: data.trim() });
  } catch (error) {
    // If file doesn't exist, return default
    return NextResponse.json({ name: 'mizanursajid' });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    await writeFile(filePath, body.name, 'utf8');
    return NextResponse.json({ success: true, name: body.name });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save name' }, { status: 500 });
  }
}
