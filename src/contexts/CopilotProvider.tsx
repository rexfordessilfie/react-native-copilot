import mitt, { type Emitter } from "mitt";
import React, {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { findNodeHandle, type ScrollView } from "react-native";
import {
  CopilotModal,
  type CopilotModalHandle,
} from "../components/CopilotModal";
import { OFFSET_WIDTH } from "../components/style";
import { useStepsMap as useSteps } from "../hooks/useStepsMap";
import type {
  CopilotContextType,
  Events,
  CopilotOptions,
  Step,
} from "../types";

/*
This is the maximum wait time for the steps to be registered before starting the tutorial
At 60fps means 2 seconds
*/
const MAX_START_TRIES = 120;

export const CopilotContext = createContext<CopilotContextType | undefined>(
  undefined
);

export const CopilotProvider = ({
  verticalOffset = 0,
  children,
  ...rest
}: PropsWithChildren<CopilotOptions>) => {
  const startTries = useRef(0);
  const copilotEvents = useRef<Record<string, Emitter<Events>>>({}).current;
  const modal = useRef<CopilotModalHandle | null>(null);

  const [visible, setVisibility] = useState<Record<string, boolean>>({});
  const [scrollView, setScrollView] = useState<ScrollView | null>(null);

  const [tourKey, setTourKey] = useState<string>("_default");

  const {
    currentStepState,
    getCurrentStepNumber,
    getFirstStep,
    getPrevStep,
    getNextStep,
    getNthStep,
    getIsFirstStep,
    getIsLastStep,
    setCurrentStepState,
    steps,
    registerStep: _registerStep,
    unregisterStep,
  } = useSteps();

  const registerStep = useCallback(
    (key: string, step: Step) => {
      _registerStep(key, step);

      if (!copilotEvents[key]) {
        copilotEvents[key] = mitt<Events>();
      }

      copilotEvents[key].emit("register", step);
    },
    [_registerStep, copilotEvents]
  );

  const getCurrentStep = useCallback(
    (key: string) => {
      return currentStepState[key];
    },
    [currentStepState]
  );

  const moveModalToStep = useCallback(
    async (step: Step) => {
      const size = await step?.measure();

      if (!size) {
        return;
      }

      await modal.current?.animateMove({
        width: size.width + OFFSET_WIDTH,
        height: size.height + OFFSET_WIDTH,
        x: size.x - OFFSET_WIDTH / 2,
        y: size.y - OFFSET_WIDTH / 2 + verticalOffset,
      });
    },
    [verticalOffset]
  );

  const setCurrentStep = useCallback(
    async (key: string, step?: Step, move: boolean = true) => {
      setCurrentStepState((prev) => ({
        ...prev,
        [key]: step,
      }));
      copilotEvents[key].emit("stepChange", step);

      if (scrollView != null) {
        const nodeHandle = findNodeHandle(scrollView);
        if (nodeHandle) {
          step?.wrapperRef.current?.measureLayout(
            nodeHandle,
            (_x, y, _w, h) => {
              const yOffset = y > 0 ? y - h / 2 : 0;
              scrollView.scrollTo({ y: yOffset, animated: false });
            }
          );
        }
      }

      setTimeout(
        () => {
          if (move && step) {
            void moveModalToStep(step);
          }
        },
        scrollView != null ? 100 : 0
      );
    },
    [copilotEvents, moveModalToStep, scrollView, setCurrentStepState]
  );

  const start = useCallback(
    async (
      key: string,
      fromStep?: string,
      suppliedScrollView: ScrollView | null = null
    ) => {
      setTourKey(key);
      if (scrollView == null) {
        setScrollView(suppliedScrollView);
      }

      const currentStep = fromStep ? steps[key][fromStep] : getFirstStep(key);

      if (startTries.current > MAX_START_TRIES) {
        startTries.current = 0;
        return;
      }

      if (currentStep == null) {
        startTries.current += 1;
        requestAnimationFrame(() => {
          void start(key, fromStep);
        });
      } else {
        copilotEvents[key].emit("start");
        await setCurrentStep(key, currentStep);
        await moveModalToStep(currentStep);
        setVisibility((prev) => ({
          ...prev,
          [key]: true,
        }));
        startTries.current = 0;
      }
    },
    [
      copilotEvents,
      getFirstStep,
      moveModalToStep,
      scrollView,
      setCurrentStep,
      setVisibility,
      steps,
    ]
  );

  const stop = useCallback(
    async (key: string) => {
      setVisibility((prev) => ({
        ...prev,
        [key]: false,
      }));
      copilotEvents[key].emit("stop");
    },
    [copilotEvents, setVisibility]
  );

  const next = useCallback(
    async (key: string) => {
      await setCurrentStep(key, getNextStep(key));
    },
    [getNextStep, setCurrentStep]
  );

  const nth = useCallback(
    async (key: string, n: number) => {
      await setCurrentStep(key, getNthStep(key, n));
    },
    [getNthStep, setCurrentStep]
  );

  const prev = useCallback(
    async (key: string) => {
      await setCurrentStep(key, getPrevStep(key));
    },
    [getPrevStep, setCurrentStep]
  );

  const value = useMemo(
    () => ({
      tourKey,
      registerStep,
      unregisterStep,
      getCurrentStep,
      start,
      stop,
      visible,
      copilotEvents,
      goToNext: next,
      goToNth: nth,
      goToPrev: prev,
      getIsFirstStep,
      getIsLastStep,
      setTourKey,
      getCurrentStepNumber,
    }),
    [
      tourKey,
      registerStep,
      unregisterStep,
      getCurrentStep,
      start,
      stop,
      visible,
      copilotEvents,
      next,
      nth,
      prev,
      getIsFirstStep,
      getIsLastStep,
      getCurrentStepNumber,
    ]
  );

  return (
    <CopilotContext.Provider value={value}>
      <>
        <CopilotModal tourKey={tourKey} ref={modal} {...rest} />
        {children}
      </>
    </CopilotContext.Provider>
  );
};
