# Description

Helper to read different types from a binary array buffer, while the reader
keeps track of the current position. This is inspired by the DataInputStreamReader
of the BimSurfer library.

# Usage

```typescript

import { BinaryReader } from 'ts-binary-reader';

// ...

let reader = new BinaryReader(myArrayBuffer, false);

// read int16 Array with length 4 and force littleEndian
let myDataArray = reader.readInt16Array(4, true);

// read utf8 string with bytelength of 64
let text = reader.readUtf8(64);

// align the current position to a multiple of 8 bit
reader.align(8);
```

# License
MIT
