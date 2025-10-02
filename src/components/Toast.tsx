import React from "react";

type toastProps = {
  message: string;
  isSuccess: boolean | undefined;
  withLoginButton?: boolean;
  duration?: number;
  onClose: () => void;
};

const Toast = ({
  message,
  isSuccess,
  withLoginButton,
}: toastProps): React.ReactElement => {

  return (
    <div
      className={`w-full flex justify-center gap-[10px] text-center z-[1000] border-2 
        ${isSuccess === true
          ? "bg-[#EAFCEF] border-[#33A720] text-[#33A720]" // success
          : isSuccess === false
            ? "bg-[#FFDDCA] border-[#F60707] text-[#F60707]" // fail
            : "bg-[#F3F4F6] border-[#9CA3AF] text-[#374151]" // pending
        } px-[15px] py-[5px] rounded-[8px] text-[18px] font-[600]`}
    >
      <p>
        {message}{" "}
        {withLoginButton && (
          <a
            href="/auth/login"
            className={`px-[2px] border-b-[2px] 
              ${isSuccess === true
                ? "bg-[#EAFCEF] border-[#33A720] text-[#33A720]" // success
                : isSuccess === false
                  ? "bg-[#FFDDCA] border-[#F60707] text-[#F60707]" // fail
                  : "bg-[#F3F4F6] border-[#9CA3AF] text-[#374151]" // pending
              } h-[25px]`}
          >
            Login here
          </a>
        )}
      </p>
    </div>
  );
};

export default Toast;