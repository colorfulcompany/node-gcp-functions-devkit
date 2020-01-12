#! /usr/bin/env node

const path = require('path')
const Command = require(path.join(__dirname, '../src/command'))
const command = new Command(process.argv.slice(2))
;(async () => command.run())()
