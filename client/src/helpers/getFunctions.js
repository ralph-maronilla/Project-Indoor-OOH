export const getSubmissions = async (url, method) => {
  try {
    const response = await fetch(url, {
      // ← Added await here
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getSubmissions:', error);
    throw error;
  }
};
export const uploadFiles = async (url, method, files) => {
  if (!files.length) throw new Error('No files selected');

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });
  formData.append('submitted_by', 1);

  const response = await fetch(url, {
    method: method,
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
