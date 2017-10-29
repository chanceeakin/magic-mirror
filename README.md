#magic-mirror

This is a rather large magic-mirror project, a la [this site.](http://www.makeuseof.com/tag/6-best-raspberry-pi-smart-mirror-projects-weve-seen-far/)

It consists of several sub repos, which will interconnect when I write their interconnections.

* pi
* web
* phone

The Pi directory contains an electron app, Magic Mirror 2, to be hosted on the magic mirror.

The Web component contains:
* a react/redux client app, a personal extension of create-react-app. of dubious stability.
* a golang server with graphql layer
* mysqldb

The Phone component is a react-native app, which has not been remotely built yet.

## Web/Client Development
`npm i`
`npm run start`

## Web/Server Development
`godep get`
`go run main.go`

## Pi Development
`npm i`
`npm <WHATEVER PACKAGE.JSON SAYS>`


## Phone Development
...Just read the react-native docs.
