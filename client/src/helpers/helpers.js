export const bufferBase64ToBlobUrl = (dataUrl) => {
  if (!dataUrl) return '';

  try {
    // ✅ extract mime type and base64 part
    const [header, base64String] = dataUrl.split(',');
    const mimeMatch = header.match(/data:(.*);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

    // ✅ convert base64 to binary
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const uint8Array = new Uint8Array(byteNumbers);

    // ✅ create blob + object URL
    const blob = new Blob([uint8Array], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error('Failed to convert base64 to blob:', e);
    return dataUrl; // fallback to original
  }
};
