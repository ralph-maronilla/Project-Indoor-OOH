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
