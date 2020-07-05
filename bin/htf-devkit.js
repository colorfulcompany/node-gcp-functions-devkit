#! /usr/bin/env node

const path = require('path')
const HtfCommand = require(path.join(__dirname, '../src/commands/htf'))
const command = new HtfCommand(process.argv.slice(2))
;(async () => command.run())()
