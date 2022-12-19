export const addressCompare = (string1, string2) => {
  if (!string1 || !string2) {
    return;
  }

  return string1.toUpperCase() === string2.toUpperCase();
};
