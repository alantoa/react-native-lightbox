import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ImageStyle } from 'react-native';
import type {
  ImageBoundingClientRect,
  LightBoxProps,
  TargetImageInfo,
} from './light-box';
import { ActiveImageType, LightImageModal } from './light-box-modal';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';

export type AnimationParams = Pick<
  LightBoxProps,
  'onTap' | 'tapToClose' | 'onLongPress' | 'nativeHeaderHeight'
> & {
  layout: TargetImageInfo;
  position: ImageBoundingClientRect;
  style?: ImageStyle;
  imageElement: JSX.Element;
};

type LightBoxContextType = {
  show: (params: AnimationParams) => void;
  animationProgress: SharedValue<number>;
};

export const LightBoxContext = createContext<LightBoxContextType | undefined>(
  undefined
);

const LightBoxProvider: React.FC<{
  children: JSX.Element | JSX.Element[];
}> = ({ children }) => {
  const animationProgress = useSharedValue<number>(0);

  const [activeImage, setActiveImage] = useState<ActiveImageType | null>(null);
  const value = useMemo(
    () => ({
      animationProgress,
      show: ({ layout, position, imageElement, ...rest }: AnimationParams) => {
        setActiveImage({
          layout,
          imageElement,
          position,
          ...rest,
        });
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onClose = () => {
    setActiveImage(null);
  };
  return (
    <LightBoxContext.Provider value={value}>
      {children}
      {activeImage && (
        <LightImageModal onClose={onClose} activeImage={activeImage} />
      )}
    </LightBoxContext.Provider>
  );
};

const useLightBox = (): LightBoxContextType => {
  const lightBox = useContext(LightBoxContext);
  if (!lightBox) {
    throw new Error(
      'LightBoxContext: `LightBoxContext` is undefined. Seems you forgot to wrap component within the CalendarProvider'
    );
  }
  return lightBox;
};

export { useLightBox, LightBoxProvider };
