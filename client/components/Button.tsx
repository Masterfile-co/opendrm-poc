import React, { KeyboardEvent, MouseEvent } from "react";

export interface IButton extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * disabled attribute
   */
  disabled?: boolean;
  /**
   * onClick
   */
  onClick?: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
  ) => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({ className, children, ...props }: IButton) => {
  return (
    <button
      className={`px-7 py-[14px] font-bold text-white rounded uppercase text-[16px] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export function PrimaryButton({ children, className, ...props }: IButton) {
  return (
    <Button
      className={`bg-masterfile-purple hover:bg-purple-hover 
		disabled:bg-masterfile-gray-900 disabled:hover:cursor-default disabled:hover:bg-masterfile-gray-900 disabled:text-masterfile-gray-300 
		${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}
