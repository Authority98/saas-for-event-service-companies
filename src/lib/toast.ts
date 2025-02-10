import { toast } from "../components/ui/toast";

export const showToast = {
  success: (message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "default",
      duration: 3000,
    });
  },
  error: (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
      duration: 4000,
    });
  },
  info: (message: string) => {
    toast({
      title: "Info",
      description: message,
      duration: 3000,
    });
  },
  warning: (message: string) => {
    toast({
      title: "Warning",
      description: message,
      variant: "destructive",
      duration: 3000,
    });
  }
}; 