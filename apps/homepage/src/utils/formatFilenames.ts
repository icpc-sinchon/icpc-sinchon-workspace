// schema.json 제외한 파일명을 추출, 확장자 제거
export function formatFilenames(filenames: string[]) {
  return filenames
    .filter((filename) => !filename.endsWith("schema.json")) // 'schema.json' 제외
    .map((filename) => {
      return filename.replace(".json", "");
    });
}
