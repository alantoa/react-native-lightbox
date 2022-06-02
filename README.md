<div align="center">
  <h1 align="center">React Native Lightbox</h1>
</div>

<div align="center">
  <img width="300" src="./assets/example.gif" alt="basic usage">
</div> 

### Todo 
- [x] tap to close
- [ ] pinch to zoom (use [Reanimated v2](https://docs.swmansion.com/react-native-reanimated/) & [react-native-gesture-handler v2](https://docs.swmansion.com/react-native-gesture-handler/))
- [ ] web support (use [photoswipe](https://github.com/dimsemenov/photoswipe) )
- [ ] photo gallery (use [react-native-pager-view](https://github.com/callstack/react-native-pager-view))



### Installation
First you have to follow installation instructions of [Reanimated v2](https://docs.swmansion.com/react-native-reanimated/) and [react-native-gesture-handler v2](https://docs.swmansion.com/react-native-gesture-handler/)

```sh
npm install @alantoa/lightbox
```

### Usage

```js
import { LightBoxProvider, LightBox } from '@alantoa/lightbox';
import { StyleSheet, Image, Dimensions } from 'react-native';
import * as React from 'react';

const { width } = Dimensions.get('window');

export default function App() {
  return (
    <LightBoxProvider>
      <LightBox
        width={width / 3}
        height={width / 3}
        imgLayout={{ width, height: width }}
      >
        <Image
          source={{
            uri: uri,
          }}
          style={StyleSheet.absoluteFillObject}
        />
      </LightBox>
    </LightBoxProvider>
  );
}
```

### Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

### License

MIT
