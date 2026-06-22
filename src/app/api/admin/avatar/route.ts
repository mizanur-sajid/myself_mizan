import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Always overwrite the same file so we don't need a database to store the URL
    const path = join(process.cwd(), 'public/admin-avatar.png');
    await writeFile(path, buffer);
    
    return NextResponse.json({ success: true, url: `/admin-avatar.png` });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { unlink } = require('fs/promises');
    const { join } = require('path');
    const path = join(process.cwd(), 'public/admin-avatar.png');
    await unlink(path);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    // If file doesn't exist, ignore
    if (error.code === 'ENOENT') {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Failed to delete avatar' }, { status: 500 });
  }
}
