import formidable from 'formidable';
import { readFile } from 'node:fs/promises';

const APILOGY_OCR_URL =
  'https://bigvision.api.apilogy.id/bigvision-ocr-prod/1.0.0/analytics/ocr/image-to-text';

export const config = {
  api: {
    bodyParser: false,
  },
};

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
}

function getSingleFile(file) {
  return Array.isArray(file) ? file[0] : file;
}

async function parseImage(request) {
  const form = formidable({
    multiples: false,
    maxFiles: 1,
  });
  const [, files] = await form.parse(request);
  return getSingleFile(files.image);
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed' });
  }

  const apiKey = process.env.APILOGY_API_KEY;
  if (!apiKey) {
    return sendJson(response, 500, { error: 'OCR service is not configured' });
  }

  try {
    const image = await parseImage(request);
    if (!image?.filepath) {
      return sendJson(response, 400, { error: 'Image file is required' });
    }

    const imageBuffer = await readFile(image.filepath);
    const outgoingForm = new FormData();
    outgoingForm.append(
      'image',
      new Blob([imageBuffer], { type: image.mimetype || 'application/octet-stream' }),
      image.originalFilename || 'image'
    );

    const apilogyResponse = await fetch(APILOGY_OCR_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
      },
      body: outgoingForm,
    });

    const responseText = await apilogyResponse.text();
    let payload;

    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = { error: 'Invalid response from OCR service' };
    }

    return sendJson(response, apilogyResponse.status, payload);
  } catch {
    return sendJson(response, 502, { error: 'OCR service request failed' });
  }
}
