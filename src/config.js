const { cosmiconfigSync } = require('cosmiconfig')

class Config {
  /**
   * @param {string} path
   */
  constructor (path) {
    this._givenPath = path
  }

  /**
   * @return {void}
   */
  init () {
    const config = this.load()
    'emulator-host-port projectId topics'.split(/\s+/).forEach((key) => {
      this[key] = config[key]
    })
  }

  /**
   * @return {object}
   */
  load () {
    return { ...this.default, ...this.loadConf() }
  }

  /**
   * @return {object}
   */
  get default () {
    return {
      'emulator-host-port': 'localhost:8085',
      projectId: 'test-project',
      topics: []
    }
  }

  /**
   * @param {string} path
   * @return {object}
   */
  loadConf () {
    const path = this._givenPath

    const explorer = cosmiconfigSync('psf-devkit', {
      searchPlaces: this.searchPlaces()
    })

    return (typeof path === 'string' && path.length > 0 && explorer.load(path).config)
      ? (explorer.search()
        ? explorer.search().config
        : {})
      : {}
  }

  /**
   * @return {Array}
   */
  searchPlaces () {
    return [
      '.psf-devkit.yaml',
      '.psf-devkit.yml'
    ]
  }
}

module.exports = Config
