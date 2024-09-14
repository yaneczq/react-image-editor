// utils.js

/**
 * Save an array of images to local storage.
 * @param {Array<File>} files - The array of File objects to save.
 */
export const saveImagesToLocalStorage = (files) => {
  // Create an array to hold data URLs
  const imageUrls = files.map(file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  });

  // Convert the array of promises to an array of resolved values
  Promise.all(imageUrls).then(urls => {
    // Save the data URLs to local storage
    localStorage.setItem('uploadedImages', JSON.stringify(urls));
  }).catch(error => {
    console.error('Error reading files:', error);
  });
};

export const loadImagesFromLocalStorage = () => {
/**
 * Retrieve the saved images from local storage.
 * @returns {Array<string>} - The array of data URLs for the saved images.
 */
const getSavedImagesFromLocalStorage = () => {
  const savedImages = localStorage.getItem('uploadedImages');
  return savedImages ? JSON.parse(savedImages) : [];
};


/**
 * Load saved images from local storage and convert them to File objects.
 * @returns {Promise<Array<File>>} - A promise that resolves to an array of File objects.
 */
  return new Promise((resolve, reject) => {
    const savedImages = getSavedImagesFromLocalStorage();

    if (savedImages.length > 0) {
      // Convert data URLs back to File objects
      const files = savedImages.map(url => {
        return fetch(url)
          .then(res => res.blob())
          .then(blob => new File([blob], 'image.png', { type: blob.type }));
      });

      Promise.all(files)
        .then(filesArray => resolve(filesArray))
        .catch(error => reject(error));
    } else {
      resolve([]);
    }
  });
};


export const resetStorageAndReload = () => {
  // Clear localStorage
  localStorage.clear();

  // Clear sessionStorage
  sessionStorage.clear();

  // Optional: Reload the page to clear any in-memory state
  window.location.reload();
};
