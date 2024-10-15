export const HamburgerIcon = ({
  size = 24,
  color = "black",
}: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Hamburger button icon</title>
    <rect x="3" y="6" width="18" height="2" fill={color} />
    <rect x="3" y="11" width="18" height="2" fill={color} />
    <rect x="3" y="16" width="18" height="2" fill={color} />
  </svg>
);

export const CloseIcon = ({
  size = 24,
  color = "black",
}: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Close button icon</title>
    <line x1="4" y1="4" x2="20" y2="20" stroke={color} strokeWidth="2" />
    <line x1="20" y1="4" x2="4" y2="20" stroke={color} strokeWidth="2" />
  </svg>
);
