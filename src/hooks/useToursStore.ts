import { useCallback, useReducer } from "react";
import { type StepsAction, type Step, type ToursStore } from "../types";
import * as utils from "../utils";

function stepsReducer(state: ToursStore, action: StepsAction) {
  switch (action.type) {
    case "register":
      return utils.addStep(state, action.payload);
    case "unregister":
      return utils.removeStep(state, action.payload);
    case "show":
      return utils.showTour(state, action.payload);
    case "hide":
      return utils.hideTour(state, action.payload);
    case "step":
      return utils.setCurrentStep(state, action.payload);
    default:
      return state;
  }
}

export const useToursStore = () => {
  const [toursStore, dispatch] = useReducer(stepsReducer, {});

  const getCurrentStep = useCallback(
    (key: string) => utils.getCurrentStep(toursStore, { tourKey: key }),
    [toursStore]
  );

  const getOrderedSteps = useCallback(
    (tourKey: string) => {
      return utils.getSteps(toursStore, { tourKey });
    },
    [toursStore]
  );

  const stepIndex = useCallback(
    (key: string, step = toursStore[key]?.currentStep) =>
      step
        ? utils.getStepIndex(toursStore, {
            currentStep: step,
            tourKey: key,
          })
        : -1,
    [toursStore]
  );

  const getCurrentStepNumber = useCallback(
    (key: string, step = toursStore[key]?.currentStep) =>
      stepIndex(key, step) + 1,
    [stepIndex, toursStore]
  );

  const getFirstStep = useCallback(
    (tourKey: string) => utils.getFirstStep(toursStore, { tourKey }),
    [toursStore]
  );

  const getLastStep = useCallback(
    (key: string) => utils.getLastStep(toursStore, { tourKey: key }),
    [toursStore]
  );

  const getPrevStep = useCallback(
    (key: string, step = toursStore[key]?.currentStep) =>
      step
        ? utils.getPrevStep(toursStore, { currentStep: step, tourKey: key })
        : undefined,
    [toursStore]
  );

  const getNextStep = useCallback(
    (key: string, step = toursStore[key]?.currentStep) =>
      step
        ? utils.getNextStep(toursStore, { currentStep: step, tourKey: key })
        : undefined,
    [toursStore]
  );

  const getNthStep = useCallback(
    (key: string, n: number) => getOrderedSteps(key)[n - 1],
    [getOrderedSteps]
  );

  const getIsFirstStep = useCallback(
    (key: string, step = toursStore[key]?.currentStep) =>
      step
        ? utils.getIsFirstStep(toursStore, {
            tourKey: key,
            currentStep: step,
          })
        : false,
    [toursStore]
  );

  const getIsLastStep = useCallback(
    (key: string, step = toursStore[key]?.currentStep) =>
      step
        ? utils.getIsLastStep(toursStore, {
            tourKey: key,
            currentStep: step,
          })
        : false,
    [toursStore]
  );

  const hideTour = useCallback((key: string) => {
    dispatch({ type: "hide", payload: { tourKey: key } });
  }, []);

  const showTour = useCallback((key: string) => {
    dispatch({ type: "show", payload: { tourKey: key } });
  }, []);

  const registerStep = useCallback((key: string, step: Step) => {
    dispatch({ type: "register", payload: { tourKey: key, step } });
  }, []);

  const unregisterStep = useCallback((key: string, stepName: string) => {
    dispatch({ type: "unregister", payload: { tourKey: key, stepName } });
  }, []);

  const setCurrentStep = useCallback((key: string, step: Step | undefined) => {
    dispatch({ type: "step", payload: { tourKey: key, step } });
  }, []);

  return {
    toursStore,
    getCurrentStep,
    hideTour,
    showTour,
    getFirstStep,
    getLastStep,
    getPrevStep,
    getNextStep,
    getNthStep,
    getIsFirstStep,
    getIsLastStep,
    setCurrentStep,
    registerStep,
    unregisterStep,
    getCurrentStepNumber,
  };
};
