import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ImageStyle } from 'react-native';
import type { ImageBoundingClientRect, TargetImageInfo } from './light-box';

import { ActiveImageType, LightImageModal } from './light-box-modal';

export type AnimationParams = {
  layout: TargetImageInfo;
  position: ImageBoundingClientRect;
  style?: ImageStyle;
  imageElement: JSX.Element;
};

type LightBoxContextType = {
  show: (params: AnimationParams) => void;
};

export const LightBoxContext = createContext<LightBoxContextType | null>(null);

export const LightBoxProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [activeImage, setActiveImage] = useState<ActiveImageType | null>(null);
  const value = useMemo(
    () => ({
      show: ({ layout, position, imageElement }: AnimationParams) => {
        setActiveImage({
          layout,
          imageElement,
          ...position,
        });
      },
    }),
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

export const useLightBox = () => {
  const lightBox = useContext(LightBoxContext);
  if (!lightBox) {
    console.error('Trying to use useLightBox without a LightBoxProvider');
  }
  return lightBox;
};
