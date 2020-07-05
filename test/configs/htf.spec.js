/* global describe, it, beforeEach */

const path = require('path')
const assert = require('power-assert')
const sinon = require('sinon')

const HtfConfig = require('configs/htf')

describe('HtfConfig', () => {
  let config

  describe('default config file not exists', () => {
    function createHtfConfig (configPath) {
      config = new HtfConfig(configPath)
      sinon.stub(config, 'searchPlaces').returns([])

      return config
    }

    describe('no config file specified', () => {
      beforeEach(() => {
        config = createHtfConfig()
      })
      describe('#loadConfig', () => {
        it('return {}', () => {
          assert.deepEqual(config.loadConf(), {})
        })
      })
    })

    describe('empty yaml', () => {
      beforeEach(() => {
        config = createHtfConfig(path.join(__dirname, '../support/empty.yml'))
      })

      describe('#loadConf()', () => {
        it('empty array', () => {
          assert.deepEqual(config.loadConf(), {})
        })
      })
      describe('#load()', () => {
        it('is equal to default', () => {
          assert.deepEqual(config.load(), config.default)
        })
      })
      describe('#init', () => {
        it('HtfConfig object properties should be added', () => {
          config.init()
          assert.deepEqual(
            Object.keys(config),
            '_givenPath funcs'.split(/\s+/))
        })
      })
    })

    describe('function specified', () => {
      beforeEach(() => {
        config = createHtfConfig(path.join(__dirname, '../support/http-functions.yml'))
      })

      describe('#loadConf()', () => {
        it('expect Array of Object', () => {
          assert.deepEqual(
            config.loadConf(),
            [
              { target: 'func1', port: 9000 },
              { target: 'func2', port: 9010 }
            ]
          )
        })
      })
    })

    describe('YAML file not found', () => {
      it('throw error', () => {
        assert.throws(
          () => createHtfConfig(path.join(__dirname, 'nonexist.yml')).loadConf()
        )
      })
    })
  })
})
