import styled from "styled-components";

const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.errorText};
  font-size: 0.875rem;
  margin-top: ${(props) => props.theme.spacing[2]};
`;

export default ErrorMessage;
