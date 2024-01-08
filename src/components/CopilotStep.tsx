import React, { useEffect, useMemo, useRef } from "react";
import { type NativeMethods } from "react-native";

import { useCopilot } from "../hooks/useCopilot";

interface Props {
  tourKey?: string;
  name: string;
  order: number;
  text: string;
  children: React.ReactElement<any>;
  active?: boolean;
  data?: Record<string, any>;
}

export const CopilotStep = ({
  tourKey,
  name,
  order,
  text,
  children,
  active = true,
  data,
}: Props) => {
  const registeredName = useRef<string | null>(null);
  const { registerStep, unregisterStep } = useCopilot(tourKey);
  const wrapperRef = React.useRef<NativeMethods | null>(null);

  const measure = async () => {
    return await new Promise<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>((resolve) => {
      const measure = () => {
        // Wait until the wrapper element appears
        if (wrapperRef.current != null && "measure" in wrapperRef.current) {
          wrapperRef.current.measure((_ox, _oy, width, height, x, y) => {
            resolve({
              x,
              y,
              width,
              height,
            });
          });
        } else {
          requestAnimationFrame(measure);
        }
      };

      measure();
    });
  };

  useEffect(() => {
    if (active) {
      if (registeredName.current && registeredName.current !== name) {
        unregisterStep(registeredName.current);
      }
      registerStep({
        name,
        text,
        order,
        measure,
        wrapperRef,
        visible: true,
        data,
      });
      registeredName.current = name;
    }
  }, [name, order, text, registerStep, unregisterStep, active, data]);

  useEffect(() => {
    if (active) {
      return () => {
        if (registeredName.current) {
          unregisterStep(registeredName.current);
        }
      };
    }
  }, [name, unregisterStep, active]);

  const copilotProps = useMemo(
    () => ({
      ref: wrapperRef,
      onLayout: () => {}, // Android hack
    }),
    []
  );

  return React.cloneElement(children, { copilot: copilotProps });
};
