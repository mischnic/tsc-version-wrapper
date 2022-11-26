# tsc API version wrapper

TypeScript doesn't use semver, which leads to a very large surface area of breaking changes.

This script generates wrappers to adjust the function parameter order of functions such as `createImportDeclaration` (basically everything on `context.factory`).
