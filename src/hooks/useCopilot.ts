import { useCallback, useContext, useMemo } from "react";
import { CopilotContext } from "../contexts/CopilotProvider";
import { type Step, type UseCopilotReturn } from "../types";
import { type ScrollView } from "react-native";

export const useCopilot = (tourKey?: string): UseCopilotReturn => {
  const value = useContext(CopilotContext);

  const key = tourKey ?? "_default";

  if (value == null) {
    throw new Error("You must wrap your app inside CopilotProvider");
  }

  const {
    tourKey: activeTourKey,
    start: _start,
    stop: _stop,
    getCurrentStep: _getCurrentStep,
    copilotEvents: _copilotEvents,
    goToNext: _goToNext,
    goToNth: _goToNth,
    goToPrev: _goToPrev,
    toursStore,
    getIsFirstStep,
    getIsLastStep,
    getCurrentStepNumber,
    registerStep: _registerStep,
    unregisterStep: _unregisterStep,
  } = value;

  const start = useCallback(
    async (fromStep?: string, scrollView?: ScrollView) => {
      void _start(key, fromStep, scrollView);
    },
    [_start, key]
  );

  const goToNext = useCallback(async () => {
    void _goToNext(key);
  }, [_goToNext, key]);

  const stop = useCallback(async () => {
    void _stop(key);
  }, [_stop, key]);

  const getCurrentStep = useCallback(
    () => _getCurrentStep(key),
    [_getCurrentStep, key]
  );

  const goToNth = useCallback(
    async (n: number) => {
      void _goToNth(key, n);
    },
    [_goToNth, key]
  );

  const goToPrev = useCallback(async () => {
    void _goToPrev(key);
  }, [_goToPrev, key]);

  const registerStep = useCallback(
    (step: Step) => {
      _registerStep(key, step);
    },
    [_registerStep, key]
  );

  const unregisterStep = useCallback(
    (stepName: string) => {
      _unregisterStep(key, stepName);
    },
    [_unregisterStep, key]
  );

  const copilotEvents = useMemo(() => {
    return _copilotEvents[key];
  }, [_copilotEvents, key]);

  const currentStep = useMemo(() => getCurrentStep(), [getCurrentStep]);

  const visible = useMemo(
    () => toursStore[key]?.visible ?? false,
    [toursStore, key]
  );

  const isFirstStep = useMemo(() => getIsFirstStep(key), [getIsFirstStep, key]);
  const isLastStep = useMemo(() => getIsLastStep(key), [getIsLastStep, key]);

  const currentStepNumber = useMemo(
    () => getCurrentStepNumber(key),
    [getCurrentStepNumber, key]
  );

  return {
    start,
    stop,
    copilotEvents,
    getCurrentStep,
    currentStep,
    visible,
    goToNext,
    goToNth,
    goToPrev,
    isLastStep,
    isFirstStep,
    currentStepNumber,
    tourKey: activeTourKey,
    registerStep,
    unregisterStep,
  };
};
