import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Noop } from "../constants/Noop";
import type { ToastDataV2 } from "../interfaces/ToastDataV2";

interface IToastContextV2 {
    toasts: ToastDataV2[];
    setToasts: Dispatch<SetStateAction<ToastDataV2[]>>;
}

export const ToastContextV2 = createContext<IToastContextV2>({
    toasts: [],
    setToasts: Noop,
});