#! /usr/bin/env node

const path = require('path')
const PsfCommand = require(path.join(__dirname, '../src/commands/psf.js'))
const command = new PsfCommand(process.argv.slice(2))
;(async () => command.run())()
