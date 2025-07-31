/**
 * Text utilities for Arabic text handling
 */

// Function to clean corrupted Arabic text
export const cleanArabicText = (text: string): string => {
  if (!text) return text;

  // Replace common corruption patterns
  const replacements: { [key: string]: string } = {
    "��": "", // Remove replacement characters
    "ï»¿": "", // Remove BOM
    "â€™": "'", // Fix apostrophe
    "â€œ": '"', // Fix opening quote
    "â€": '"', // Fix closing quote
    'â€"': "–", // Fix en dash
    'â€"': "—", // Fix em dash
    "Ã ": "à",
    "Ã¡": "á",
    "Ã©": "é",
    "Ã­": "í",
    "Ã³": "ó",
    Ãº: "ú",
  };

  let cleaned = text;

  // Apply replacements
  Object.entries(replacements).forEach(([corrupted, correct]) => {
    cleaned = cleaned.replace(new RegExp(corrupted, "g"), correct);
  });

  // Normalize Arabic characters
  cleaned = cleaned.normalize("NFC");

  return cleaned;
};

// Function to ensure text is properly encoded
export const ensureUtf8 = (text: string): string => {
  try {
    // Try to encode/decode to ensure proper UTF-8
    const encoded = encodeURIComponent(text);
    const decoded = decodeURIComponent(encoded);
    return decoded;
  } catch (error) {
    console.warn("UTF-8 encoding issue:", error);
    return text;
  }
};

// Function to validate Arabic text
export const isValidArabicText = (text: string): boolean => {
  if (!text) return true;

  // Check for replacement characters
  if (text.includes("�")) return false;

  // Check for common encoding issues
  const corruptionPatterns = [
    /ï»¿/g, // BOM
    /â€/g, // Common corruption
    /Ã[0-9a-f]/g, // UTF-8 corruption
  ];

  return !corruptionPatterns.some((pattern) => pattern.test(text));
};

// Hook for cleaning text in React components
export const useCleanText = () => {
  return {
    clean: cleanArabicText,
    validate: isValidArabicText,
    ensureUtf8,
  };
};

// Safe text processing function
export const getSafeText = (
  text: string,
  fallback: string = "نص غير صالح",
): string => {
  const cleanText = cleanArabicText(text);
  const isValid = isValidArabicText(cleanText);
  return isValid ? cleanText : fallback;
};
