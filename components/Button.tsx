import { ReactElement, useState } from "react";

export const Button = ({
  content,
  primary,
  secondary,
  extraStyle = {},
}: {
  content: string | ReactElement;
  primary: string;
  secondary: string;
  extraStyle?: object;
}) => {
  const [style, setStyle] = useState({
    backgroundColor: primary,
    boxShadow: `0rem 0.3rem ${secondary}`,
  });

  return (
    <div
      className={`max-h-max cursor-pointer rounded-lg text-center font-bold text-white transition-all hover:-translate-y-1 active:translate-y-1`}
      style={{ ...extraStyle, ...style }}
      onMouseEnter={() =>
        setStyle({
          backgroundColor: primary,
          boxShadow: `0rem 0.5rem ${secondary}`,
        })
      }
      onMouseLeave={() =>
        setStyle({
          backgroundColor: primary,
          boxShadow: `0rem 0.3rem ${secondary}`,
        })
      }
      onPointerDown={() =>
        setStyle({
          backgroundColor: primary,
          boxShadow: `0rem 0rem ${secondary}`,
        })
      }
      onPointerUp={() =>
        setStyle({
          backgroundColor: primary,
          boxShadow: `0rem 0.3rem ${secondary}`,
        })
      }
    >
      {content}
    </div>
  );
};
