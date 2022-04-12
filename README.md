# plaza-app
A desktop app optimized for people to play web-based incremental game

## Setup

`yarn` to install dependencies

## Local testing

`yarn start` to open locally

## Directory structure

`ControlsUI` is the top bar that users would use to go back, toggle visual mode, and change tabs (when in tab mode). This is implemented in React.
`services` provides FE services to React SPAs, in particular, the `ipc.service.ts` is important to enable 2-way communication between browser windows and the main thread.

`DirectoryUI` is unused at the moment, but will be a simple SPA to provide an experience similar to the plaza website. At the moment, the plaza website is used as the "Directory"

`models` host the set of interfaces shared between the React SPAs as well as the main thread.

`Pages` hosts the components in the main thread that would be rendered using browser windows.
  
`Pages/Control/TabLayout` controls the logic for layout, because the application is an orchestration of different browser windows, this controls their positioning.

`Pages/Home/MainView` provides a simple function to generate new tabs, it is used by Controls.

