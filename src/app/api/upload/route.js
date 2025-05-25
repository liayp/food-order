import { writeFile } from 'fs/promises';
import uniqid from 'uniqid';

export async function POST(req) {
  const data = await req.formData();
  if (data.get('file')) {
    // upload the file
    const file = data.get('file');

    const ext = file.name.split('.').slice(-1)[0];
    const newFileName = uniqid() + '.' + ext;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = `./public/upload/${newFileName}`;
    await writeFile(path, buffer);


    const link = '/upload/' + newFileName;
    return Response.json(link);
  }
  return Response.json(true);
}