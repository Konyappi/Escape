const ERROR_MESSAGES = {
  OCR_FAILED: 'Unable to scan this document. Please try again.',
  INVALID_IMAGE: 'This document cannot be scanned.',
  API_LIMIT: 'OCR scan limit reached. Try again later.',
  NETWORK_ERROR: 'Network error while scanning. Check your connection.',
  UNKNOWN_ERROR: 'Unexpected OCR error. Please try again.',
  MISSING_CONFIG: 'OCR API is not configured. Enable mock mode or add Apilogy settings.',
  EMPTY_RESPONSE: 'OCR returned no readable text.',
};

function getUseMockOcr() {
  return import.meta.env.VITE_USE_MOCK_OCR === 'true';
}

function createError(code) {
  const error = new Error(
    ERROR_MESSAGES[code] ?? ERROR_MESSAGES.UNKNOWN_ERROR
  );

  error.code = code;

  return error;
}

export function getOcrErrorMessage(error) {
  return ERROR_MESSAGES[error?.code] ?? ERROR_MESSAGES.UNKNOWN_ERROR;
}

function getOcrEndpoint(baseUrl) {
  return `${String(baseUrl).replace(/\/+$/, '')}/analytics/ocr/image-to-text`;
}

async function imageSourceToFile(imageSource) {
  if (imageSource instanceof File) {
    return imageSource;
  }

  if (typeof imageSource !== 'string' || !imageSource.trim()) {
    throw createError('INVALID_IMAGE');
  }

  try {
    const response = await fetch(imageSource);

    if (!response.ok) {
      throw createError('INVALID_IMAGE');
    }

    const blob = await response.blob();
    const filename = imageSource.split('/').pop()?.split('?')[0] || 'document.png';

    return new File([blob], filename, {
      type: blob.type || 'image/png',
    });
  } catch (error) {
    if (error?.code === 'INVALID_IMAGE') {
      throw error;
    }

    throw createError('INVALID_IMAGE');
  }
}

function extractTextFromPayload(payload) {
  const text = (
    payload?.text ??
    payload?.extractedText ??
    payload?.data?.text ??
    payload?.result?.text ??
    payload?.results ??
    ''
  );

  return Array.isArray(text) ? text.join('\n') : text;
}

export async function scanDocument(document) {
  if (!document) {
    throw createError('INVALID_IMAGE');
  }

  // =========================
  // MOCK MODE
  // =========================
  if (getUseMockOcr()) {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const text = document.ocrText ?? document.text ?? '';

    if (!text.trim()) {
      throw createError('EMPTY_RESPONSE');
    }

    return {
      text,
      provider: 'mock',
      documentId: document.id,
    };
  }

  const endpoint = '/api/ocr';

  try {
    // =========================
    // IMAGE + FORM DATA
    // =========================
    const imageFile = await imageSourceToFile(document.image);
    const formData = new FormData();

    formData.append('image', imageFile);

    // =========================
    // REQUEST APILOGY
    // =========================
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    // =========================
    // ERROR HANDLING
    // =========================
    if (response.status === 429) {
      throw createError('API_LIMIT');
    }

    if (!response.ok) {
      const errorBody = await response.text();

      console.error('OCR proxy error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });

      throw createError('OCR_FAILED');
    }

    // =========================
    // RESPONSE
    // =========================
    const payload = await response.json();

    console.log('OCR response:', payload);

    const text = extractTextFromPayload(payload);

    if (!String(text).trim()) {
      throw createError('EMPTY_RESPONSE');
    }

    return {
      text,
      provider: 'apilogy',
      documentId: document.id,
      raw: payload,
    };
  } catch (error) {
    if (error.code) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw createError('NETWORK_ERROR');
    }

    console.error('Unexpected OCR error:', error);

    throw createError('UNKNOWN_ERROR');
  }
}
