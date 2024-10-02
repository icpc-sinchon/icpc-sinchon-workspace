function searchStringInObject<T extends object>(
  object: T,
  searchString: string,
): boolean {
  return Object.values(object).some((value) => {
    if (typeof value === "object") {
      return searchStringInObject(value, searchString);
    }
    if (typeof value === "string") {
      // 대소문자 구분 없이 검색
      return value.toLowerCase().includes(searchString.toLowerCase());
    }
    return value.toString().includes(searchString);
  });
}

export default searchStringInObject;
