import React, { useCallback, useEffect } from 'react';
import { BackHandler, StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import type { TargetImageInfo } from './light-box';
import { useLightBox, type AnimationParams } from './provider';
import { withRubberBandClamp, useVector } from './utils';

export type ActiveImageType = AnimationParams & {
  layout: TargetImageInfo;
  imageElement: JSX.Element;
};
type LightImageModalProps = {
  activeImage: ActiveImageType;
  onClose: () => void;
};
const timingConfig = {
  duration: 240,
  easing: Easing.bezier(0.33, 0.01, 0, 1),
};
const maxScale = 6;
export const LightImageModal = ({
  activeImage,
  onClose,
}: LightImageModalProps) => {
  const { layout, position, imageElement, onLongPress, tapToClose, onTap } =
    activeImage;
  const { x, y, width, height, imageOpacity } = position;
  const { width: targetWidth, height: dimensionHeight } = useWindowDimensions();
  const CENTER = {
    x: targetWidth / 2,
    y: dimensionHeight / 2,
  };
  const scaleFactor = layout.width / targetWidth;

  const targetHeight = layout.height / scaleFactor;

  // const headerHeight = useHeaderHeight();
  const headerHeight = 0;

  const { animationProgress } = useLightBox();

  const backdropOpacity = useSharedValue(0);

  const offset = useVector(0, 0);

  const scale = useSharedValue(1);

  const translation = useVector(0, 0);

  const origin = useVector(0, 0);

  const adjustedFocal = useVector(0, 0);

  // const originalLayout = useVector(width, 0);
  // const layout = useVector(width, 0);

  const targetX = useSharedValue(0);
  const targetY = useSharedValue(
    (dimensionHeight - targetHeight) / 2 - headerHeight
  );

  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .minPointers(1)
    .minDistance(10)

    .onBegin(() => {
      const newWidth = scale.value * layout.width;
      const newHeight = scale.value * layout.height;
      if (
        offset.x.value < (newWidth - layout.width) / 2 - translation.x.value &&
        offset.x.value > -(newWidth - layout.width) / 2 - translation.x.value
      ) {
        cancelAnimation(offset.x);
      }

      if (
        offset.y.value <
          (newHeight - layout.height) / 2 - translation.y.value &&
        offset.y.value > -(newHeight - layout.height) / 2 - translation.y.value
      ) {
        cancelAnimation(offset.y);
      }
    })
    .onUpdate(({ translationX, translationY }) => {
      translation.x.value = translationX;
      translation.y.value = translationY;

      scale.value = interpolate(
        translation.y.value,
        [-200, 0, 200],
        [0.65, 1, 0.65],
        Extrapolate.CLAMP
      );

      backdropOpacity.value = interpolate(
        translation.y.value,
        [-100, 0, 100],
        [0.2, 1, 0.2],
        Extrapolate.CLAMP
      );
    })
    .onEnd(() => {
      if (Math.abs(translation.y.value) > 40) {
        targetX.value = translation.x.value - targetX.value * -1;
        targetY.value = translation.y.value - targetY.value * -1;
        translation.x.value = 0;
        translation.y.value = 0;
        animationProgress.value = withTiming(0, timingConfig, () => {
          imageOpacity.value = withTiming(
            1,
            {
              duration: 16,
            },
            () => {
              runOnJS(onClose)();
            }
          );
        });
        backdropOpacity.value = withTiming(0, timingConfig);
      } else {
        backdropOpacity.value = withTiming(1, timingConfig);
        translation.x.value = withTiming(0, timingConfig);
        translation.y.value = withTiming(0, timingConfig);
      }
      scale.value = withTiming(1, timingConfig);
    });

  const imageStyles = useAnimatedStyle(() => {
    const interpolateProgress = (range: [number, number]) =>
      interpolate(animationProgress.value, [0, 1], range, Extrapolate.CLAMP);

    return {
      width: interpolateProgress([width.value, targetWidth]),
      height: interpolateProgress([height.value, targetHeight]),
      transform: [
        {
          scale: scale.value,
        },
        {
          translateX:
            offset.x.value +
            translation.x.value +
            interpolateProgress([x.value, targetX.value]),
        },
        {
          translateY:
            offset.y.value +
            translation.y.value +
            interpolateProgress([y.value, targetY.value]),
        },
      ],
    };
  });

  const backdropStyles = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });
  const closeModal = useCallback(() => {
    'worklet';
    animationProgress.value = withTiming(0, timingConfig, () => {
      imageOpacity.value = withTiming(
        1,
        {
          duration: 16,
        },
        () => {
          runOnJS(onClose)();
        }
      );
    });
    backdropOpacity.value = withTiming(0, timingConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    requestAnimationFrame(() => {
      imageOpacity.value = 0;
    });
    animationProgress.value = withTiming(1, timingConfig);
    backdropOpacity.value = withTiming(1, timingConfig);
    const backhanderListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        closeModal();
        return true;
      }
    );
    return () => {
      backhanderListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setAdjustedFocal = ({
    focalX,
    focalY,
  }: Record<'focalX' | 'focalY', number>) => {
    'worklet';

    adjustedFocal.x.value = focalX - (CENTER.x + offset.x.value);
    adjustedFocal.y.value = focalY - (CENTER.y + offset.y.value);
  };
  const longPressGesture = Gesture.LongPress()
    .enabled(!!onLongPress)
    .maxDistance(10)
    .onStart(() => {
      'worklet';
      if (onLongPress) {
        runOnJS(onLongPress)();
      }
    });
  const scaleOffset = useSharedValue(1);
  const resetValues = (animated = true) => {
    'worklet';

    scale.value = animated ? withTiming(1) : 1;
    offset.x.value = animated ? withTiming(0) : 0;
    offset.y.value = animated ? withTiming(0) : 0;
    translation.x.value = animated ? withTiming(0) : 0;
    translation.y.value = animated ? withTiming(0) : 0;
  };
  const onStart = () => {
    'worklet';

    offset.x.value = offset.x.value + translation.x.value;
    offset.y.value = offset.y.value + translation.y.value;

    translation.x.value = 0;
    translation.y.value = 0;
  };
  const pinchGesture = Gesture.Pinch()
    .onStart(({ focalX, focalY }) => {
      'worklet';
      onStart();
      scaleOffset.value = scale.value;
      setAdjustedFocal({ focalX, focalY });
      origin.x.value = adjustedFocal.x.value;
      origin.y.value = adjustedFocal.y.value;
    })
    .onUpdate(({ scale: s, focalX, focalY, numberOfPointers }) => {
      'worklet';
      if (numberOfPointers !== 2) return;
      const nextScale = withRubberBandClamp(
        s * scaleOffset.value,
        0.55,
        maxScale,
        [1, maxScale]
      );

      scale.value = nextScale;

      setAdjustedFocal({ focalX, focalY });

      translation.x.value =
        adjustedFocal.x.value +
        ((-1 * nextScale) / scaleOffset.value) * origin.x.value;
      translation.y.value =
        adjustedFocal.y.value +
        ((-1 * nextScale) / scaleOffset.value) * origin.y.value;
    })
    .onEnd(() => {
      'worklet';
      if (scale.value < 1) {
        resetValues();
      } else {
        const sc = Math.min(scale.value, maxScale);

        const newWidth = sc * layout.width;
        const newHeight = sc * layout.height;

        const nextTransX =
          scale.value > maxScale
            ? adjustedFocal.x.value +
              ((-1 * maxScale) / scaleOffset.value) * origin.x.value
            : translation.x.value;

        const nextTransY =
          scale.value > maxScale
            ? adjustedFocal.y.value +
              ((-1 * maxScale) / scaleOffset.value) * origin.y.value
            : translation.y.value;

        const diffX =
          nextTransX + offset.x.value - (newWidth - layout.width) / 2;
        if (scale.value > maxScale) {
          scale.value = withTiming(maxScale);
        }

        if (newWidth <= layout.width) {
          translation.x.value = withTiming(0);
        } else {
          let moved;
          if (diffX > 0) {
            translation.x.value = withTiming(nextTransX - diffX);
            moved = true;
          }

          if (newWidth + diffX < layout.width) {
            translation.x.value = withTiming(
              nextTransX + layout.width - (newWidth + diffX)
            );
            moved = true;
          }
          if (!moved) {
            translation.x.value = withTiming(nextTransX);
          }
        }

        const diffY =
          nextTransY + offset.y.value - (newHeight - height.value) / 2;

        if (newHeight <= height.value) {
          translation.y.value = withTiming(-offset.y.value);
        } else {
          let moved;
          if (diffY > 0) {
            translation.y.value = withTiming(nextTransY - diffY);
            moved = true;
          }

          if (newHeight + diffY < height.value) {
            translation.y.value = withTiming(
              nextTransY + height.value - (newHeight + diffY)
            );
            moved = true;
          }
          if (!moved) {
            translation.y.value = withTiming(nextTransY);
          }
        }
      }
    });
  // Todo: add double tab
  const doubleTapGesture = Gesture.Tap().numberOfTaps(2).enabled(false);
  const tapGesture = Gesture.Tap()
    .enabled(tapToClose || !!onTap)
    .numberOfTaps(1)
    .maxDistance(10)
    .onEnd(() => {
      if (tapToClose) {
        closeModal();
      }
      if (onTap) {
        runOnJS(onTap)();
      }
    });
  return (
    <Animated.View style={StyleSheet.absoluteFillObject}>
      <Animated.View style={[styles.backdrop, backdropStyles]} />
      <GestureDetector
        gesture={Gesture.Race(
          Gesture.Simultaneous(
            longPressGesture,
            Gesture.Race(panGesture, pinchGesture)
          ),
          Gesture.Exclusive(doubleTapGesture, tapGesture)
        )}
      >
        <Animated.View style={styles.full}>
          <Animated.View style={[StyleSheet.absoluteFillObject, imageStyles]}>
            {imageElement}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  full: {
    flex: 1,
  },
});
