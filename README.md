# OasthWrapper

## A Wrapper for Oasth Telematics.

# About


Many features have been added nevertheless, theres functionality lacking such as getting the `schedules`, `map data` etc. These will be implemented later on.
Feature requests are accepted! 


# Setup / Use

To use the library, clone it or download it.

```ts
import {Oasth} from "./libs/Oasth";
const oasth = new Oasth({
    options: {
        reuseSessions: false
    }
})
```

# Options:

**reuseSessions**: Whenever to reuse the same session to make a request. If set to false, will randomize it in each request.
