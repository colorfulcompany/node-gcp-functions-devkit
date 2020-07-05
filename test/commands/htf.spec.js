/* global describe, it */

const sleep = require('sleep-promise')
const assert = require('power-assert')

const HtfCommand = require('commands/htf')

describe('HtfCommand', function () {
  this.timeout(5000)
  describe('#options', () => {
    it('options is object', () => {
      assert.equal(typeof (new HtfCommand()).options, 'object')
    })
    describe('behave yargs because argv, help, parse and usage', () => {
      const options = (new HtfCommand()).options
      it('argv property', () => {
        assert.equal(typeof options.argv, 'object')
      })
      it('help, parse and usage methods', () => {
        assert(
          'help parse usage'.split(/\s/).every((prop) => {
            return typeof options[prop] === 'function'
          })
        )
      })
    })
  })

  it('launch without options', async () => {
    const command = new HtfCommand(['launch'])
    const launcher = await command.run()
    await sleep(3500)
    await launcher.kill()
  })
})
