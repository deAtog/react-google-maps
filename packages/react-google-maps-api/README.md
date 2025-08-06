# @deatog/react-google-maps-api

![logo](https://raw.githubusercontent.com/deAtog/react-google-maps/master/logo.png)

[![npm package](https://img.shields.io/npm/v/@deatog/react-google-maps-api)](https://www.npmjs.com/package/@deatog/react-google-maps-api)
[![npm downloads](https://img.shields.io/npm/dt/@deatog/react-google-maps-api)](https://www.npmjs.com/package/@deatog/react-google-maps-api)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@deatog/react-google-maps-api)](https://www.npmjs.com/package/@deatog/react-google-maps-api)

@deatog/react-google-maps-api

> This library was forked from @react-google-maps/api v2.20.7.
> This library requires React v16.6 or later. To use the latest features (including hooks) requires React v16.8+. If you need support for earlier versions of React, you should check out [react-google-maps](https://github.com/tomchentw/react-google-maps)
> Versions starting 12.20.0 should support React@19.

This is complete re-write of the (sadly unmaintained) `react-google-maps` library. We thank [tomchentw](https://github.com/tomchentw/) for his great work that made possible.

@deatog/react-google-maps-api provides very simple bindings to the google maps api and lets you use it in your app as React components.

Here are the main additions to react-google-maps that were the motivation behind this re-write

## Install @deatog/react-google-maps-api

with PNPM

```shell
pnpm install @deatog/react-google-maps-api
```

with NPM

```shell
npm i -S @deatog/react-google-maps-api
```

```jsx
import React from 'react'
import { GoogleMap, useJsApiLoader } from '@deatog/react-google-maps-api'

const containerStyle = {
  width: '400px',
  height: '400px',
}

const center = {
  lat: -3.745,
  lng: -38.523,
}

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY',
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  )
}

export default React.memo(MyComponent)
```

## Migration from react-google-maps@9.4.5

if you need an access to map object, instead of `ref` prop, you need to use `onLoad` callback on `<GoogleMap />` component.

Before:

```jsx
// before - don't do this!
<GoogleMap
  ref={(map) => {
    const bounds = new window.google.maps.LatLngBounds()

    map.fitBounds(bounds)
  }}
/>
```

After:

```jsx
<GoogleMap
  onLoad={(map) => {
    const bounds = new window.google.maps.LatLngBounds()
    map.fitBounds(bounds)
  }}
  onUnmount={(map) => {
    // do your stuff before map is unmounted
  }}
/>
```

If you want to use `window.google` object, you need to extract GoogleMap in separate module, so it is lazy executed then `google-maps-api` script is loaded and executed by `<LoadScript />`. If you try to use `window.google` before it is loaded it will be undefined and you'll get a TypeError.

## Main features

- Simplified API
- Uses the new Context API
- Supports async React (StrictMode compliant)
- Removes lodash dependency =>
  smaller bundle size `12.4kb` gzip, tree-shakeable [https://bundlephobia.com/result?p=@deatog/react-google-maps-api](https://bundlephobia.com/result?p=@deatog/react-google-maps-api)
- forbids loading of Roboto fonts, if you set property preventGoogleFonts on `<LoadScript preventGoogleFonts />` component

## Advice

> Using the examples requires you to generate a google maps api key. For instructions on how to do that please see the following [guide](https://developers.google.com/maps/documentation/embed/get-api-key)

## Contribute

Maintainers and contributors are very welcome! Please submit pull requests via GitHub.

## How to test changes locally

When working on a feature/fix, you're probably gonna want to test your changes. This workflow is a work in progress. Please feel free to improve it!

1. In the file `packages/react-google-maps-api/package.json` change `main` to `"src/index.ts"`
2. In the same file, delete the `module` field
3. You can now use the package `react-google-maps-api-vike-example` to test your changes.
