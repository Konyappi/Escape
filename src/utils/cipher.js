export function caesarDecode(value, shift = 3) {
  return value
    .toUpperCase()
    .replace(/[A-Z]/g, (char) => {
      const code = char.charCodeAt(0) - 65;
      return String.fromCharCode(((code - shift + 26) % 26) + 65);
    });
}
