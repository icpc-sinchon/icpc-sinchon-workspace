import Link from "next/link";
import * as styles from "./styles.css";
import { forwardRef, type ForwardRefRenderFunction } from "react";

type Props = {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
};

const CustomButton: ForwardRefRenderFunction<HTMLAnchorElement, Props> = (
  { href, disabled, children },
  ref,
) => {
  return (
    <a
      href={href}
      className={
        disabled
          ? `${styles.customButton} ${styles.disabledButton}`
          : styles.customButton
      }
      ref={ref}
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </a>
  );
};

const ForwardedCustomButton = forwardRef(CustomButton);

function LinkButton({ href, disabled, children }: Props) {
  if (disabled) {
    return (
      <ForwardedCustomButton href={href} disabled={disabled}>
        {children}
      </ForwardedCustomButton>
    );
  }
  return (
    <Link href={href} passHref legacyBehavior>
      <ForwardedCustomButton href={href} disabled={disabled}>
        {children}
      </ForwardedCustomButton>
    </Link>
  );
}

export default LinkButton;
