// pnpmfile.cjs - Hook để customize pnpm behavior nếu cần
function readPackage(pkg, context) {
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
