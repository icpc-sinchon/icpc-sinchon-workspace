const saveToClipboard = async (
  txt: string,
  successMsg?: string,
  errorMsg?: string,
): Promise<void> => {
  try {
    await navigator.clipboard.writeText(txt);
    if (successMsg) {
      alert(successMsg);
    }
  } catch (err) {
    if (errorMsg) {
      alert(errorMsg);
    }
    console.error("Failed to copy text to clipboard:", err);
  }
};

export default saveToClipboard;
