import { DialogBoxType } from "../shared/types";

export {};

declare global {
  interface Window {
    electronAPI: {
      minimize: () => void;
      maximize: () => void;
      getLocalIP: () => Promise<string>;
      openDialog: (dialogType: DialogBoxType, message?: string) => Promise<void>;
      getScreenshot: () => Promise<string>;
      saveImage: (imageURL: string) => Promise<void>;
      copyToClipboard: (imageURL: string) => Promise<void>;
    };
  }
}