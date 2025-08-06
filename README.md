<div align="center">

![logo](https://raw.githubusercontent.com/deAtog/react-google-maps/master/logo.png)

# @deatog/react-google-maps organization root

[![npm package](https://img.shields.io/npm/v/@deatog/react-google-maps-api)](https://www.npmjs.com/package/@deatog/react-google-maps-api)
[![npm downloads](https://img.shields.io/npm/dt/@deatog/react-google-maps-api)](https://www.npmjs.com/package/@deatog/react-google-maps-api)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@deatog/react-google-maps-api)](https://www.npmjs.com/package/@deatog/react-google-maps-api)

</div>

## README

For API README please navigate to [https://github.com/deAtog/react-google-maps/tree/master/packages/react-google-maps-api](https://github.com/deAtog/react-google-maps/tree/master/packages/react-google-maps-api)

## For Developers and Contributors

### Requirements

- basic git, JavaScript, React knowledge
- Google Maps API Key from [Google Cloud Console](https://console.cloud.google.com)
- git
- node
- pnpm

### To develop locally

Fork repo at <https://github.com/deAtog/react-google-maps>. Clone your fork to local directory of your choice, install dependencies, set up your API Key, and start storybook server. Following commands should do the job:

- `git clone https://github.com/YOUR_USER_NAME/react-google-maps-api.git` - clone your fork
  `
- `cd react-google-maps-api` - move to newly created folder
- `cp .storybook/example.maps.config.ts .storybook/maps.config.ts` - create file with API Key
- `pnpm install` - install dependencies
- `pnpm run bootstrap` - setup workspace
- `pnpm run storybook` - run storybook server

Any changes you make to src folders of contained packages should reflect on the storybook server.

### To contribute

Create a feature/fix branch on your own fork and make pull request towards develop branch of the original repo.
