var url = require('url')

function assetPath (pathRelatedToAssets) {
  console.log(pathRelatedToAssets)
  if (process.env.ASSET_DEV) {
    return url.format({
      protocal: process.env.ASSET_PROTOCAL,
      hostname: process.env.ASSET_HOSTNAME,
      port: process.env.ASSET_PORT,
      pathname: `/assets/${pathRelatedToAssets}`
    })
  }
}

module.exports = assetPath
