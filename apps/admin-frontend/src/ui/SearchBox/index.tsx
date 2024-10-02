import { Flex, TextField } from "@radix-ui/themes";
import styled from "styled-components";

function SearchBox({
  searchString,
  onSearchStringChange,
}: {
  searchString: string;
  onSearchStringChange: (value: string) => void;
}) {
  return (
    <Flex direction="row" align="center">
      <Label htmlFor="searchString">검색</Label>
      <TextField.Root
        id="searchString"
        value={searchString}
        onChange={(e) => onSearchStringChange(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
    </Flex>
  );
}

const Label = styled.label`
  font-size: 1rem;
  width: 2.5rem;
`;

export default SearchBox;
