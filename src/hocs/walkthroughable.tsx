import React from "react";
import { type NativeMethods } from "react-native/types";

interface WithCopilot {
  copilot?: {
    ref?: React.RefObject<NativeMethods>;
    onLayout?: () => void;
  };
}

type PropsWithCopilot<P> = P & WithCopilot;

export function walkthroughable<P = any>(
  WrappedComponent: React.ComponentType<P>
) {
  const Component = ({ copilot, ...props }: PropsWithCopilot<P>) => {
    return <WrappedComponent {...(copilot as any)} {...props} />;
  };

  Component.displayName = "Walkthroughable";

  return Component;
}
