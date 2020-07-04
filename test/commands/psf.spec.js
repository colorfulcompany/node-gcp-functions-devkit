/* global describe, it */

const path = require('path')
const sleep = require('sleep-promise')
const assert = require('power-assert')

const PsfCommand = require('commands/psf')

describe('PsfCommand', function () {
  this.timeout(5000)
  describe('#options', () => {
    it('options is object', () => {
      assert.equal(typeof (new PsfCommand()).options, 'object')
    })
    describe('behave yargs because argv, help, parse and usage', () => {
      const options = (new PsfCommand()).options
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
    const opt = ['-c', path.join(__dirname, '../support/topics-only.yml')]
    return opt
  }

  async function launch () {
    const command = new PsfCommand(['launch', ...configOption()])
    const launcher = await command.run()
    await sleep(3000)
    return launcher
  }

  it('launch without options', async () => {
    const command = new PsfCommand(['launch'])
    const launcher = await command.run()
    await sleep(3500)
    await launcher.kill()
  })
  it('sub', async () => {
    const launcher = await launch()
    const sub = new PsfCommand(['sub', ...configOption()])
    await sub.run()
    await sleep(1000)
    await launcher.kill()
  })
  it('pub with message', async function () {
    this.timeout(7000)

    const launcher = await launch()
    const sub = new PsfCommand(['sub', ...configOption()])
    await sub.run()
    await sleep(1000)
    const pub = new PsfCommand(['pub', '-m', 'hello', '-t', 'topic2', ...configOption()])
    await pub.run()
    // console.log(launcher.procs.map((proc) => proc.pid))
    await sleep(1000)
    await launcher.kill()
  })
})
