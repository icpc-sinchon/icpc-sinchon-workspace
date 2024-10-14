export function formatDataFilenames(filenames: string[]) {
  return filenames
    .filter((filename) => !filename.endsWith("schema.json")) // 'schema.json' 제외
    .map((filename) => {
      const [year, season] = filename.replace(".json", "").split(" ");
      return `${year}-${season}`;
    });
}
