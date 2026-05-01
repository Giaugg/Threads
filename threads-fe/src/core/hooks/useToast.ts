import toast from "react-hot-toast";

interface ToastOptions {
  duration?: number;
}

export const useToast = () => {
  return {
    success: (message: string, options?: ToastOptions) => {
      toast.success(message, {
        duration: options?.duration ?? 3000,
        icon: "✅",
      });
    },
    error: (message: string, options?: ToastOptions) => {
      toast.error(message, {
        duration: options?.duration ?? 4000,
        icon: "❌",
      });
    },
    loading: (message: string) => {
      return toast.loading(message, {
        icon: "⏳",
      });
    },
    info: (message: string, options?: ToastOptions) => {
      toast(message, {
        duration: options?.duration ?? 3000,
        icon: "ℹ️",
      });
    },
    promise: async <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error: string;
      }
    ) => {
      return toast.promise(
        promise,
        {
          loading: `⏳ ${messages.loading}`,
          success: `✅ ${messages.success}`,
          error: `❌ ${messages.error}`,
        },
        {
          duration: 4000,
        }
      );
    },
    dismiss: (id?: string) => {
      if (id) toast.dismiss(id);
      else toast.remove();
    },
  };
};
