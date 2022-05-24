## Installation

```sh
npm install @alantoa/lightbox
```

## Usage

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

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
