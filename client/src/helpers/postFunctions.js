export const postStatusChanged = async (url, method, formData) => {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data.error || `Upload failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error('Error in postStatusChanged:', error);
    throw error;
  }
};
export const handleSubmissionDelete = async (url, submissionId) => {
  try {
    const response = await fetch(`${url}/${submissionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in handleSubmissionDelete:', error);
    throw error;
  }
};

export const postRewardSubmission = async (url, payload) => {
  try {
    const response = await fetch(url, {
      method: 'POST',

      body: payload,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in handleRewardSubmission:', error);
    throw error;
  }
};
