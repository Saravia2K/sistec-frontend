export const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
