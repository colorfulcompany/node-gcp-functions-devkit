/* global describe, it, beforeEach */

const path = require('path')
const assert = require('power-assert')
const sinon = require('sinon')

const Config = require('config')

describe('Config', () => {
  let config

  describe('default config file not exists', () => {
    /**
     * @param {string} configPath
     * @return {object}
     */
    function createConfig (configPath) {
      config = new Config(configPath)
      sinon.stub(config, 'searchPlaces').returns([])

      return config
    }

    describe('no config file specified', () => {
      beforeEach(() => {
        config = createConfig()
      })
      describe('#loadConf()', () => {
        it('return {}', () => {
          assert.deepEqual(config.loadConf(), {})
        })
      })
    })

    describe('empty yaml', () => {
      beforeEach(() => {
        config = createConfig(path.join(__dirname, 'support/empty.yml'))
      })

      describe('#loadConf()', () => {
        it('empty object', () => {
          assert.deepEqual(config.loadConf(), {})
        })
      })
      describe('#load()', () => {
        it('is equal to default', () => {
          assert.deepEqual(config.load(), config.default)
        })
      })
      describe('#init', () => {
        it('Config object properties should be added', () => {
          config.init()
          assert.deepEqual(
            Object.keys(config),
            '_givenPath emulator-host-port projectId topics'.split(/\s+/))
        })
      })
    })

    describe('topics only yaml specified', () => {
      beforeEach(() => {
        config = createConfig(path.join(__dirname, 'support/topics-only.yml'))
      })

      describe('#loadConf()', () => {
        it('has topic1 and topic2', () => {
          assert.deepEqual(
            config.loadConf().topics.map((t) => t.name),
            ['topic1', 'topic2']
          )
        })
      })
    })

    describe('YAML file not found', () => {
      it('throw error', () => {
        assert.throws(
          () => createConfig(path.join(__dirname, 'nonexist.yml')).loadConf()
        )
      })
    })
  })
})
