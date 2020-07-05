const { cosmiconfigSync } = require('cosmiconfig')

class HtfConfig {
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
    Object.keys(config).forEach((key) => {
      this[key] = config[key]
    })
  }

  /**
   * @return {object}
   */
  load () {
    const config = this.default
    config.funcs = this.loadConf()

    return config
  }

  /**
   * @return {object}
   */
  get default () {
    return {
      funcs: []
    }
  }

  /**
   * @param {string} path
   * @return {object}
   */
  loadConf () {
    const path = this._givenPath

    const explorer = cosmiconfigSync('htf-devkit', {
      searchPlaces: this.searchPlaces()
    })

    if (typeof path === 'string' && path.length > 0) {
      return explorer.load(path).config || []
    } else if (explorer.search()) {
      return explorer.search().config
    } else {
      return []
    }
  }

  /**
   * @return {Array}
   */
  searchPlaces () {
    return [
      '.htf-devkit.yaml',
      '.htf-devkit.yml'
    ]
  }
}

module.exports = HtfConfig
