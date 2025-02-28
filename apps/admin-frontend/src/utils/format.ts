export const sortByName = <T extends { name: string }>(students: T[]) => {
  return students.sort((a, b) => a.name.localeCompare(b.name, "ko"));
};
