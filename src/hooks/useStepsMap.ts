import { useCallback, useReducer, useState } from "react";
import { type Step, type StepsMap } from "../types";

type Action =
  | {
      type: "register";
      key: string;
      step: Step;
    }
  | {
      type: "unregister";
      key: string;
      stepName: string;
    };

export const useStepsMap = () => {
  const [currentStepState, setCurrentStepState] = useState<
    Record<string, Step | undefined>
  >({});

  const [steps, dispatch] = useReducer((state: StepsMap, action: Action) => {
    switch (action.type) {
      case "register":
        return {
          ...state,
          [action.key]: {
            ...state[action.key],
            [action.step.name]: action.step,
          },
        };
      case "unregister": {
        const {
          [action.key]: { [action.stepName]: _, ...rest },
        } = state;
        return {
          ...state,
          [action.key]: rest,
        };
      }
      default:
        return state;
    }
  }, {});

  const getOrderedSteps = useCallback(
    (tourKey: string) => {
      const _steps = steps[tourKey];

      if (!_steps) {
        return [];
      }
      return Object.values(_steps).sort((a, b) => a.order - b.order);
    },
    [steps]
  );

  const stepIndex = useCallback(
    (tourKey: string, step = currentStepState[tourKey]) =>
      step
        ? getOrderedSteps(tourKey).findIndex(
            (stepCandidate) => stepCandidate.order === step.order
          )
        : -1,
    [currentStepState, getOrderedSteps]
  );

  const getCurrentStepNumber = useCallback(
    (key: string, step = currentStepState[key]) => stepIndex(key, step) + 1,
    [currentStepState, stepIndex]
  );

  const getFirstStep = useCallback(
    (key: string) => getOrderedSteps(key)[0],
    [getOrderedSteps]
  );

  const getLastStep = useCallback(
    (key: string) => {
      const _orderedSteps = getOrderedSteps(key);
      return _orderedSteps[_orderedSteps.length - 1];
    },
    [getOrderedSteps]
  );

  const getPrevStep = useCallback(
    (key: string, step = currentStepState[key]) => {
      const _orderedSteps = getOrderedSteps(key);
      return step && _orderedSteps[stepIndex(key, step) - 1];
    },
    [currentStepState, getOrderedSteps, stepIndex]
  );

  const getNextStep = useCallback(
    (key: string, step = currentStepState[key]) => {
      const _orderedSteps = getOrderedSteps(key);
      return step && _orderedSteps[stepIndex(key, step) + 1];
    },
    [currentStepState, getOrderedSteps, stepIndex]
  );

  const getNthStep = useCallback(
    (key: string, n: number) => getOrderedSteps(key)[n - 1],
    [getOrderedSteps]
  );

  const getIsFirstStep = useCallback(
    (key: string) => currentStepState[key] === getFirstStep(key),
    [currentStepState, getFirstStep]
  );

  const getIsLastStep = useCallback(
    (key: string) => currentStepState[key] === getLastStep(key),
    [currentStepState, getLastStep]
  );

  const registerStep = useCallback((key: string, step: Step) => {
    dispatch({ type: "register", step, key });
  }, []);

  const unregisterStep = useCallback((key: string, stepName: string) => {
    dispatch({ type: "unregister", key, stepName });
  }, []);

  return {
    getFirstStep,
    getLastStep,
    getPrevStep,
    getNextStep,
    getNthStep,
    getIsFirstStep,
    getIsLastStep,
    currentStepState,
    setCurrentStepState,
    steps,
    registerStep,
    unregisterStep,
    getCurrentStepNumber,
  };
};
