export const extractImageIdFromUrl = (url: string) => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const imageId = filename.split('.')[0];
  return imageId;
};
