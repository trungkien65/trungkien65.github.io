// pnpmfile.cjs - Hook to customize pnpm behavior if needed
function readPackage(pkg, context) {
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
