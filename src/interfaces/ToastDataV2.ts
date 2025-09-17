export interface ToastDataV2 {
  id: string;
  isSuccess: boolean | undefined;
  message: string;
  isVisible?: boolean;
  withLoginRedirection?: boolean;
  onClose?: () => void;
}