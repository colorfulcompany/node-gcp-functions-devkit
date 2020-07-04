/* global describe, it, beforeEach */

const path = require('path')
const assert = require('power-assert')
const sinon = require('sinon')

const PsfConfig = require('configs/psf')

describe('PsfConfig', () => {
  let config

  describe('default config file not exists', () => {
    /**
     * @param {string} configPath
     * @return {object}
     */
    function createPsfConfig (configPath) {
      config = new PsfConfig(configPath)
      sinon.stub(config, 'searchPlaces').returns([])

      return config
    }

    describe('no config file specified', () => {
      beforeEach(() => {
        config = createPsfConfig()
      })
      describe('#loadConf()', () => {
        it('return {}', () => {
          assert.deepEqual(config.loadConf(), {})
        })
      })
    })

    describe('empty yaml', () => {
      beforeEach(() => {
        config = createPsfConfig(path.join(__dirname, '../support/empty.yml'))
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
        it('PsfConfig object properties should be added', () => {
          config.init()
          assert.deepEqual(
            Object.keys(config),
            '_givenPath emulator-host-port projectId topics'.split(/\s+/))
        })
      })
    })

    describe('topics only yaml specified', () => {
      beforeEach(() => {
        config = createPsfConfig(path.join(__dirname, '../support/topics-only.yml'))
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
          () => createPsfConfig(path.join(__dirname, 'nonexist.yml')).loadConf()
        )
      })
    })
  })
})
