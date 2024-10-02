import { useCallback, useEffect } from "react";
import styled from "styled-components";
import { COLORS } from "@/styles/colors";

type ToastProps = {
  text: string;
  closeTimeout?: number;
  color?: string;
  show: boolean;
  onClose: () => void;
};

function Toast({
  text,
  closeTimeout = 2500,
  color = COLORS.primarySurface,
  show,
  onClose,
}: ToastProps) {
  const handleClose = useCallback(() => {
    const timer = setTimeout(onClose, 300); // Wait for fade out animation
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(handleClose, closeTimeout);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [show, closeTimeout, onClose]);

  if (!show) return null;

  return (
    <Wrap $isVisible={show}>
      <Alert $color={color}>{text}</Alert>
    </Wrap>
  );
}

export default Toast;

const Wrap = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);

  z-index: 10000;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};

  transition: opacity 0.3s, transform 0.3s;

  transform: translateX(-50%)
    translateY(${(props) => (props.$isVisible ? 0 : "-20px")});
`;

const Alert = styled.p<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 400px;
  height: 45px;

  border: none;
  background: ${(props) => props.$color || "#123241"};
  color: white;
  border-radius: 10px;
  font-size: 14px;

  z-index: 10000;
`;
