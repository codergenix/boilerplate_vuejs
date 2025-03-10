function getImageMimeType(base64String) {
  if (base64String?.startsWith("/9j/")) return "image/jpeg";
  if (base64String?.startsWith("iVBORw0KGg")) return "image/png";
  if (base64String?.startsWith("R0lGODdh")) return "image/gif";
  if (base64String?.startsWith("UklGR")) return "image/webp";
  return "image/png";
}
export const getImageBase64Type = (imgURLstring) => {
  if (imgURLstring == null || imgURLstring == '') {
    return "./images/user.jpg";
  }
  else if (imgURLstring?.startsWith('data:image/') || imgURLstring?.startsWith('/images/') || imgURLstring?.startsWith('http')) {
    return imgURLstring;
  } else {
    const mimeType = getImageMimeType(imgURLstring);
    return `data:${mimeType};base64,${imgURLstring}`;
  }
}
export const removeImageBase64Type = (imgURLstring) => {
  if (imgURLstring?.startsWith('data:image/')) {
    return imgURLstring?.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
  } else {
    return imgURLstring;
  }
}
