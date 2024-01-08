import { type Step, type ToursStore } from "./types";

export type TourKey = string;
export type StepName = string;
export function showTour(store: ToursStore, payload: { tourKey: TourKey }) {
  const { tourKey } = payload;

  return {
    ...store,
    [tourKey]: {
      ...store[tourKey],
      steps: store[tourKey]?.steps ?? {},
      visible: true,
    },
  };
}

export function hideTour(store: ToursStore, payload: { tourKey: TourKey }) {
  const { tourKey } = payload;

  return {
    ...store,
    [tourKey]: {
      ...store[tourKey],
      steps: store[tourKey]?.steps ?? {},
      visible: false,
    },
  };
}

export function addStep(
  store: ToursStore,
  payload: {
    tourKey: TourKey;
    step: Step;
  }
) {
  const { tourKey, step } = payload;

  return {
    ...store,
    [tourKey]: {
      ...store[tourKey],
      visible: store[tourKey]?.visible ?? false,
      steps: {
        ...store[tourKey]?.steps,
        [step.name]: step,
      },
    },
  };
}

export function removeStep(
  store: ToursStore,
  payload: {
    tourKey: TourKey;
    stepName: StepName;
  }
) {
  const { tourKey, stepName } = payload;

  const steps = store[tourKey]?.steps;
  const { [stepName]: _, ...rest } = steps || {};

  return {
    ...store,
    [tourKey]: {
      ...store[tourKey],
      visible: store[tourKey]?.visible ?? false,
      steps: rest,
    },
  };
}

export function getSteps(store: ToursStore, payload: { tourKey: TourKey }) {
  const { tourKey } = payload;
  const tour = store[tourKey];

  if (!tour) {
    return [];
  }

  return Object.values(tour.steps).sort((a, b) => a.order - b.order);
}

export function getNextStep(
  store: ToursStore,
  payload: {
    tourKey: TourKey;
    currentStep: Step;
  }
) {
  const { currentStep } = payload;
  const steps = getSteps(store, payload);

  const currentStepIndex = steps.findIndex(
    (step) => step.name === currentStep.name
  );

  return steps[currentStepIndex + 1];
}

export function getStepIndex(
  store: ToursStore,
  payload: {
    tourKey: TourKey;
    currentStep: Step;
  }
) {
  const { currentStep } = payload;
  const steps = getSteps(store, payload);
  return steps.findIndex((step) => step.name === currentStep.name);
}

export function getPrevStep(
  store: ToursStore,
  payload: {
    tourKey: TourKey;
    currentStep: Step;
  }
) {
  const steps = getSteps(store, payload);

  const currentStepIndex = getStepIndex(store, payload);
  return steps[currentStepIndex - 1];
}

export function getNthStep(
  store: ToursStore,
  payload: {
    tourKey: TourKey;
    n: number;
  }
) {
  const { n } = payload;
  const steps = getSteps(store, payload);
  return steps[n];
}

export function getStepNumber(
  store: ToursStore,
  payload: {
    tourKey: TourKey;
    currentStep: Step;
  }
) {
  const { currentStep } = payload;
  const steps = getSteps(store, payload);
  return steps.findIndex((step) => step.name === currentStep.name) + 1;
}

export function getFirstStep(
  store: ToursStore,
  payload: {
    tourKey: TourKey;
  }
) {
  const steps = getSteps(store, payload);
  return steps[0];
}

export function getLastStep(
  store: ToursStore,
  payload: {
    tourKey: TourKey;
  }
) {
  const steps = getSteps(store, payload);
  return steps[steps.length - 1];
}

export function getIsLastStep(
  store: ToursStore,
  payload: {
    tourKey: TourKey;
    currentStep: Step;
  }
) {
  const { currentStep } = payload;
  const steps = getSteps(store, payload);
  return steps[steps.length - 1]?.name === currentStep.name;
}

export function getIsFirstStep(
  store: ToursStore,
  payload: {
    tourKey: TourKey;
    currentStep: Step;
  }
) {
  const { currentStep } = payload;
  const steps = getSteps(store, payload);
  return steps[0]?.name === currentStep.name;
}

export function setCurrentStep(
  store: ToursStore,
  payload: {
    tourKey: TourKey;
    step?: Step;
  }
) {
  const { tourKey, step } = payload;

  return {
    ...store,
    [tourKey]: {
      ...store[tourKey],
      steps: store[tourKey]?.steps ?? {},
      visible: store[tourKey]?.visible ?? false,
      currentStep: step,
    },
  };
}

export function getCurrentStep(
  store: ToursStore,
  payload: {
    tourKey: TourKey;
  }
) {
  const { tourKey } = payload;
  return store[tourKey]?.currentStep;
}

export enum StepEvents {
  START = "start",
  STOP = "stop",
  REGISTER = "register",
  UNREGISTER = "unregister",
  STEP_CHANGE = "stepChange",
}
