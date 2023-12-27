import * as React from 'react';

import { LightBox, LightBoxProvider } from '@alantoa/lightbox';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const { width } = Dimensions.get('window');

const AZUKI_IMG_LIST = [
  'https://plus.unsplash.com/premium_photo-1679470310712-82c0a39cd41d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEwNXx4SHhZVE1ITGdPY3x8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1698681908648-962c6048ec3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1658963654546-593c6ea57ce4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDIyfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1698584200770-3838c3690a27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDQyfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1619992525255-3bed3879b0d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDYyfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1703343872540-af08e5a6d703?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE5fHhIeFlUTUhMZ09jfHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1699514886400-3df192033292?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDMyOHxKcGc2S2lkbC1Ia3x8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1661808819761-878bc1a39dee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI1MnxKcGc2S2lkbC1Ia3x8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1666612440466-25089c980bfd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDIzN3xKcGc2S2lkbC1Ia3x8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1699111259952-47e5c8e8727f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE2MnxKcGc2S2lkbC1Ia3x8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1694875464862-978a879a1210?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDkyfEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1700413473936-81b281f88715?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDgxfEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1624981015247-697f0b9e24a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDU2fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1551085036-92c80da2bf4a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI0fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1534757889788-2aea3517f2ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDV8SnBnNktpZGwtSGt8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1547471080-19acba333038?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDR8SnBnNktpZGwtSGt8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1702877511807-2cb45e74e0fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDYxfHhIeFlUTUhMZ09jfHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1702287055981-24272805c309?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDkzfHhIeFlUTUhMZ09jfHxlbnwwfHx8fHw%3D',
];

export default function App() {
  return (
    <GestureHandlerRootView style={styles.view}>
      <LightBoxProvider>
        <SafeAreaView style={styles.view}>
          <ScrollView contentContainerStyle={styles.container}>
            {AZUKI_IMG_LIST.map((uri, i) => (
              <LightBox
                width={width / 3}
                height={width / 3}
                imgLayout={{ width, height: width }}
                key={`Avatar-${i}`}
                tapToClose
              >
                <Image
                  source={{
                    uri: uri,
                  }}
                  style={[StyleSheet.absoluteFillObject]}
                />
              </LightBox>
            ))}
          </ScrollView>
        </SafeAreaView>
      </LightBoxProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  view: {
    flex: 1,
  },
});
