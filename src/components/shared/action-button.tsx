"use client";

import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";

interface ActionButtonProps extends ButtonProps {
  action: () => Promise<{ success?: boolean; error?: string; data?: any } | any>;
  onSuccess?: (data?: any) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function ActionButton({
  action,
  onSuccess,
  onError,
  successMessage = "Success",
  errorMessage = "Something went wrong",
  children,
  ...props
}: ActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);


  const handleClick = async () => {
    try {
      setIsLoading(true);
      const res = await action();
      
      // If our actionHandler format
      if (res && res.error) {
        toast.error(res.error);
        onError?.(res.error);
      } else if (res && res.success === false) {
        toast.error(res.error || errorMessage);
        onError?.(res.error || errorMessage);
      } else {
        toast.success(res?.success || successMessage);
        onSuccess?.(res?.data || res);
      }
    } catch (err: any) {
      toast.error(err.message || errorMessage);
      onError?.(err.message || errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {children}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
