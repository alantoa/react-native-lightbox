import React, { useState } from 'react';
import { ViewStyle, StyleProp, Dimensions } from 'react-native';

import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { AnimationParams, useLightBox } from './provider';

// const AnimatedImage = Animated.createAnimatedComponent(FastImage as any);
export type ImageBoundingClientRect = {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  width: Animated.SharedValue<number>;
  height: Animated.SharedValue<number>;
  imageOpacity: Animated.SharedValue<number>;
};
export type TargetImageInfo = {
  width: number;
  height: number;
};
export type LightImageProps = {
  width: number;
  height: number;
  containerStyle?: StyleProp<ViewStyle>;
  imgLayout?: TargetImageInfo;
  alt?: string;
  children: JSX.Element;
};

export const LightBox: React.FC<LightImageProps> = ({
  width: imgWidth,
  height: imgHeight,
  containerStyle,
  imgLayout,
  children,
}) => {
  // Todo: add lightboxImage component.
  const [targetLayout] = useState<AnimationParams['layout'] | null>(null);

  const animatedRef = useAnimatedRef<Animated.View>();
  const opacity = useSharedValue(1);
  const lightBox = useLightBox();

  // const headerHeight = useHeaderHeight();
  const headerHeight = 0;
  const styles = useAnimatedStyle(() => {
    return {
      width: imgWidth,
      height: imgHeight,
      opacity: opacity.value,
    };
  });
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const handlePress = () => {
    if (!targetLayout && !imgLayout) return;
    const position = { imageOpacity: opacity, width, height, x, y };

    lightBox?.show({
      position,
      layout: targetLayout ??
        imgLayout ?? {
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').width,
        },
      imageElement: children,
    });
  };

  const gesture = Gesture.Tap().onEnd((_, success) => {
    if (!success) return;
    const measurements = measure(animatedRef);
    width.value = measurements.width;
    height.value = measurements.height;
    x.value = measurements.pageX;
    y.value = measurements.pageY - headerHeight;
    runOnJS(handlePress)();
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={containerStyle}>
        <Animated.View ref={animatedRef} style={styles}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
