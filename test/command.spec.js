/* global describe, it */

const path = require('path')
const sleep = require('sleep-promise')
const assert = require('power-assert')

const Command = require('command')

describe('Command', function () {
  this.timeout(5000)
  describe('#options', () => {
    it('options is object', () => {
      assert.equal(typeof (new Command()).options, 'object')
    })
    describe('behave yargs because argv, help, parse and usage', () => {
      const options = (new Command()).options
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

  function configOption () {
    const opt = ['-c', path.join(__dirname, 'support/topics-only.yml')]
    return opt
  }

  async function launch () {
    const command = new Command(['launch', ...configOption()])
    const launcher = await command.run()
    await sleep(3000)
    return launcher
  }

  it.skip('launch without options', async () => {
    const command = new Command(['launch'])
    const launcher = await command.run()
    await sleep(3500)
    await launcher.kill()
  })
  it.skip('sub', async () => {
    const launcher = await launch()
    const sub = new Command(['sub', ...configOption()])
    await sub.run()
    await sleep(1000)
    await launcher.kill()
  })
  it.skip('pub with message', async function () {
    this.timeout(7000)

    const launcher = await launch()
    const sub = new Command(['sub', ...configOption()])
    await sub.run()
    await sleep(1000)
    const pub = new Command(['pub', '-m', 'hello', '-t', 'topic2', ...configOption()])
    await pub.run()
    // console.log(launcher.procs.map((proc) => proc.pid))
    await sleep(1000)
    await launcher.kill()
  })
})
