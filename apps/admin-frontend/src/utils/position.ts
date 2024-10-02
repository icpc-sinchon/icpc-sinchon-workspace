type Position = {
  top: number;
  left: number;
};

type Dimension = {
  width: number;
  height: number;
};

export const getCenterPosition = (
  target: HTMLElement,
  movingToast: HTMLElement,
): Position => {
  const boundary = target.getBoundingClientRect();
  const movingToastBoundary = movingToast.getBoundingClientRect();
  const topPos = boundary.top - movingToastBoundary.height;
  const leftPos =
    boundary.left + boundary.width / 2 - movingToastBoundary.width / 2;

  return { top: topPos, left: leftPos };
};

export const getWidthHeight = (target: HTMLElement): Dimension => {
  const boundary = target.getBoundingClientRect();
  return { width: boundary.width, height: boundary.height };
};

// export const GetCornerPosition = (target) => {
//   const boundary = target.getBoundingClientRect();
//   const top_left_pos = { top: boundary.top, left: boundary.left };
//   const top_right_pos = {
//     top: boundary.top,
//     left: boundary.left + boundary.width,
//   };
//   const bottom_left_pos = {
//     top: boundary.top + boundary.height,
//     left: boundary.left,
//   };
//   const bottom_right_pos = {
//     top: boundary.top + boundary.height,
//     left: boundary.left + boundary.width,
//   };

//   return { top_left_pos, top_right_pos, bottom_left_pos, bottom_right_pos };
// };
