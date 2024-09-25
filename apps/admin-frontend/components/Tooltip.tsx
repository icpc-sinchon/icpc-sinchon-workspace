import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { getCenterPosition, getWidthHeight } from "@/utils/position";

type TooltipProps = {
  text: string;
  position: "top" | "bottom";
  triggerRef: React.RefObject<HTMLElement>;
};

function Tooltip({ text, position, triggerRef }: TooltipProps) {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef(null);

  const calculatePosition = () => {
    const target = triggerRef.current;
    const movingToast = tooltipRef.current;
    if (!target || !movingToast) return;
    const pos = getCenterPosition(target, movingToast);
    const targetWH = getWidthHeight(target);

    if (position === "top") {
      movingToast.style.top = `${pos.top - 8}px`;
      movingToast.style.left = `${pos.left}px`;
      movingToast.style.display = "block";
    } else {
      movingToast.style.top = `${pos.top + targetWH.height + 8}px`;
      movingToast.style.left = `${pos.left}px`;
      movingToast.style.display = "block";
    }
  };

  const handleMouseOver = () => {
    calculatePosition();
    setShow(true);
  };

  const handleMouseOut = () => {
    setShow(false);
  };

  const addEventToTextBalloon = () => {
    if (!triggerRef.current) return undefined;
    triggerRef.current.addEventListener("mouseover", handleMouseOver);
    triggerRef.current.addEventListener("mouseout", handleMouseOut);

    return () => {
      if (!triggerRef.current) return;
      triggerRef.current.removeEventListener("mouseover", handleMouseOver);
      triggerRef.current.removeEventListener("mouseout", handleMouseOut);
    };
  };

  useEffect(() => {
    if (text) {
      addEventToTextBalloon();
    }
  }, [text]);

  return (
    <TooltipContainer
      ref={tooltipRef}
      className={show ? "" : "vhide"}
      $position={position}
    >
      {text}
    </TooltipContainer>
  );
}

const TooltipContainer = styled.div<{ $position: "top" | "bottom" }>`
  position: absolute;
  background: #555353;
  color: white;
  border-radius: 0.4em;
  padding: 0.2rem 2rem;
  font-size: 14px;

  z-index: 100;

  &:after {
    content: "";
    position: absolute;
    border: 7px solid transparent;
    width: 0;
    height: 0;
    left: 50%;
    margin-left: -7px;

    ${({ $position }) => {
      if ($position === "top") {
        return css`
          bottom: 0;
          border-top-color: #555353;
          border-bottom: 0;
          margin-bottom: -7px;
        `;
      }
      return css`
        top: 0;
        border-bottom-color: #555353;
        border-top: 0;
        margin-top: -7px;
      `;
    }}
  }
`;

export default Tooltip;
