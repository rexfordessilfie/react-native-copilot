import type { Emitter } from "mitt";
import type {
  Animated,
  LayoutRectangle,
  NativeMethods,
  ScrollView,
  ViewStyle,
} from "react-native";
import { type TourKey, type StepName } from "./utils";

export type WalktroughedComponent = NativeMethods & React.ComponentType<any>;

export interface Step {
  name: string;
  order: number;
  visible: boolean;
  wrapperRef: React.RefObject<NativeMethods>;
  measure: () => Promise<LayoutRectangle>;
  text: string;
  data?: Record<string, any>;
}

export interface CopilotContext {
  registerStep: (step: Step) => void;
  unregisterStep: (name: string) => void;
  getCurrentStep: () => Step | undefined;
}

export interface ValueXY {
  x: number;
  y: number;
}

export type SvgMaskPathFunction = (args: {
  size: Animated.ValueXY;
  position: Animated.ValueXY;
  canvasSize: ValueXY;
  step: Step;
}) => string;

export type StepsMap = Record<string, Record<string, Step>>;

export type EasingFunction = (value: number) => number;

export type Labels = Partial<
  Record<"skip" | "previous" | "next" | "finish", string>
>;

export interface TooltipProps {
  labels: Labels;
  handleStop: () => void;
  handleNext: () => void;
  handleNth: (n: number) => void;
  handlePrev: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  currentStep: Step;
}

export interface MaskProps {
  size: ValueXY;
  position: ValueXY;
  style: ViewStyle;
  easing?: EasingFunction;
  animationDuration: number;
  animated: boolean;
  backdropColor: string;
  svgMaskPath?: SvgMaskPathFunction;
  layout: {
    width: number;
    height: number;
  };
  onClick?: () => any;
  currentStep: Step;
}

export interface CopilotOptions {
  easing?: ((value: number) => number) | undefined;
  overlay?: "svg" | "view";
  animationDuration?: number;
  tooltipComponent?: React.ComponentType<TooltipProps>;
  tooltipStyle?: ViewStyle;
  stepNumberComponent?: React.ComponentType<any>;
  animated?: boolean;
  labels?: Labels;
  androidStatusBarVisible?: boolean;
  svgMaskPath?: SvgMaskPathFunction;
  verticalOffset?: number;
  arrowColor?: string;
  arrowSize?: number;
  margin?: number;
  stopOnOutsideClick?: boolean;
  backdropColor?: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Events = {
  register: Step | undefined;
  start: undefined;
  stop: undefined;
  stepChange: Step | undefined;
};

export interface CopilotContextType {
  tourKey: string;
  registerStep: (key: string, step: Step) => void;
  unregisterStep: (key: string, stepName: string) => void;
  getCurrentStep: (key: string) => Step | undefined;
  start: (
    key: string,
    fromStep?: string,
    suppliedScrollView?: ScrollView | null
  ) => Promise<void>;
  stop: (key: string) => Promise<void>;
  goToNext: (key: string) => Promise<void>;
  goToNth: (key: string, n: number) => Promise<void>;
  goToPrev: (key: string) => Promise<void>;
  toursStore: ToursStore;
  copilotEvents: Record<string, Emitter<Events>>;
  getIsFirstStep: (key: string) => boolean;
  getIsLastStep: (key: string) => boolean;
  getCurrentStepNumber: (key: string) => number;
  setTourKey: (key: string) => void;
}

export interface UseCopilotReturn {
  tourKey: string;
  start: (fromStep?: string) => Promise<void>;
  stop: () => Promise<void>;
  getCurrentStep: () => Step | undefined;
  currentStep: Step | undefined;
  copilotEvents?: Emitter<Events>;
  goToNext: () => Promise<void>;
  goToNth: (n: number) => Promise<void>;
  goToPrev: () => Promise<void>;
  visible: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepNumber: number;
  registerStep: (step: Step) => void;
  unregisterStep: (stepName: string) => void;
}

export interface StepNumberProps {
  currentStepNumber: number;
}

export type StepsAction =
  | {
      type: "register";
      payload: {
        tourKey: string;
        step: Step;
      };
    }
  | {
      type: "unregister";
      payload: {
        tourKey: string;
        stepName: string;
      };
    }
  | {
      type: "show" | "hide";
      payload: {
        tourKey: string;
      };
    }
  | {
      type: "step";
      payload: {
        tourKey: string;
        step?: Step;
      };
    };

export type ToursStore = Record<
  TourKey,
  {
    currentStep?: Step;
    steps: Record<StepName, Step>;
    visible: boolean;
  }
>;
