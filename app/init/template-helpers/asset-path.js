var url = require('url')

function assetPath (pathRelatedToAssets) {
  if (parseInt(process.env.ASSET_DEV) === 1) {
    return url.format({
      protocal: process.env.ASSET_PROTOCAL,
      hostname: process.env.ASSET_HOSTNAME,
      port: process.env.ASSET_PORT,
      pathname: `/assets/${pathRelatedToAssets}`
    })
  }
}

module.exports = assetPath
