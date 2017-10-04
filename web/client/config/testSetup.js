/*
Provides configuration for enzyme testing. No additional overhead in actual tests is required.
 */
const configure = require('enzyme').configure
const Adapter = require('enzyme-adapter-react-16')

configure({
  adapter: new Adapter()
})
