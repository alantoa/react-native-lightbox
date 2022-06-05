import * as React from 'react';

import {
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LightBoxProvider, LightBox } from '@alantoa/lightbox';
const { width } = Dimensions.get('window');

const AZUKI_IMG_LIST = [
  'https://img.seadn.io/files/d05fb012462088b91b5a36ad94a6a67c.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/e104c3f1ec179c89ceeb15794b1b3675.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/c75da5ff379261d1a24a5b424a5b96b8.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/aeef6c7096c02f7b14f77a98e048ff26.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/e6e736b065c46d3b3e463f11809b1a23.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/194e68ea3e146c96515a9b3c5ab1b6be.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/b16b55d319d45b80d8519f31abc39118.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/2fceb1d771a6c61f495815b8eff1b708.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/b96eef33fb84dbd13880ab4d34cf8688.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/ead83b79ef9823b3eafe17f844ce15c3.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/5e39b31799644619cf052027d012e269.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/580a0b9d5ba3d12e5d27a3e5f429d49c.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/3b2070293e7fe5344d3b4e273ccfb6e4.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/963f1081c50fa0962062eade7710fcc4.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/7d5b53a74200e437d150e18c44c20d41.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/8efd252af1d76eaee2f1eafe4fd98ebd.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/a315d2b9c0ae5a321d1c0c936674fcfc.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/4a487488ff95c14d3dada736e5238594.png?auto=format&h=720&w=720',
  'https://img.seadn.io/files/90632eddf80a9705e84638209e437d42.png?auto=format&h=720&w=720',
];

export default function App() {
  return (
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
                style={StyleSheet.absoluteFillObject}
              />
            </LightBox>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LightBoxProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  view: {
    backgroundColor: '#000',
  },
});
