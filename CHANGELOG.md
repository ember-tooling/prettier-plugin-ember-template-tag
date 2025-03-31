# Changelog

## Release (2025-03-31)

prettier-plugin-ember-template-tag 2.0.5 (patch)

#### :bug: Bug Fix
* `prettier-plugin-ember-template-tag`
  * [#341](https://github.com/ember-tooling/prettier-plugin-ember-template-tag/pull/341) Fix implied export default with satisfies ([@ef4](https://github.com/ef4))

#### Committers: 1
- Edward Faulkner ([@ef4](https://github.com/ef4))

## Release (2024-11-06)

prettier-plugin-ember-template-tag 2.0.4 (patch)

#### :bug: Bug Fix
* `prettier-plugin-ember-template-tag`
  * [#284](https://github.com/ember-tooling/prettier-plugin-ember-template-tag/pull/284) Add prepack so that this library builds before publish ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2024-11-06)

prettier-plugin-ember-template-tag 2.0.3 (patch)

#### :house: Internal
* `prettier-plugin-ember-template-tag`
  * [#283](https://github.com/ember-tooling/prettier-plugin-ember-template-tag/pull/283) Remove changelog customizations ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#281](https://github.com/ember-tooling/prettier-plugin-ember-template-tag/pull/281) Setup release-plan ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#280](https://github.com/ember-tooling/prettier-plugin-ember-template-tag/pull/280) Update repo paths in package.json ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#267](https://github.com/ember-tooling/prettier-plugin-ember-template-tag/pull/267) Bump content-tag to v2 ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 2
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)






## v2.0.2 (2024-04-03)

#### :bug: Bug Fix
* [#259](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/259) Fix RangeError in files with multiple forward slashes ([@MichalBryxi](https://github.com/MichalBryxi))

#### :house: Internal
* [#262](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/262) Add config for Corepack ([@MichalBryxi](https://github.com/MichalBryxi))
* [#263](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/263) VSCode settings cleanup ([@MichalBryxi](https://github.com/MichalBryxi))

#### Committers: 1
- Michal Bryxí ([@MichalBryxi](https://github.com/MichalBryxi))

## v2.0.1 (2024-03-15)

#### :bug: Bug Fix
* [#253](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/253) Fix errors when components contain multi-byte characters ([@patricklx](https://github.com/patricklx))

#### :robot: Dependencies
* [#213](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/213) Bump @vitest/ui from 1.1.0 to 1.1.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#214](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/214) Bump eslint-plugin-jsdoc from 46.9.1 to 47.0.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#215](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/215) Bump vitest from 1.1.0 to 1.1.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#216](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/216) Bump eslint-plugin-n from 16.5.0 to 16.6.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 1
- Patrick Pircher ([@patricklx](https://github.com/patricklx))

## v2.0.0 (2023-12-29)

This version is essentially a re-write. We are switching from using [ember-template-imports](https://github.com/ember-template-imports/ember-template-imports) to parse template tags to the more robust [content-tag](https://github.com/embroider-build/content-tag) preprocessor. This should result in fewer unhandled cases and other bugs. For example, this plugin [can now format](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/issues/173) route templates from [ember-route-template](https://github.com/discourse/ember-route-template)!

This is a breaking change in that we are breaking compatibility with the current version of [eslint-plugin-ember](https://github.com/ember-cli/eslint-plugin-ember). If you are running Prettier via eslint-plugin-ember and eslint-plugin-prettier<sup>1</sup>, you will need to follow the following compatibility table, which also appears in the [README](https://github.com/gitKrystan/prettier-plugin-ember-template-tag#compatibility) for this plugin:

| eslint-plugin-ember | prettier-plugin-ember-template-tag |
| ------------------- | ---------------------------------- |
| <12                 | 1.1.0                              |
| >=12.0.0-alpha.1    | 2+                                 |

<sup>1</sup> Neither I [nor the Prettier project](https://prettier.io/docs/en/integrating-with-linters.html) recommend running Prettier this way.

Additionally, there are some formatting differences in this version as discussed in the following RFCs:
* https://github.com/gitKrystan/prettier-plugin-ember-template-tag/issues/192
* https://github.com/gitKrystan/prettier-plugin-ember-template-tag/issues/193

#### :boom: Breaking Change
* [#152](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/152) Drop Node 16 ([@gitKrystan](https://github.com/gitKrystan))
* [#208](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/208) Switch to type: module ([@gitKrystan](https://github.com/gitKrystan))

#### :boom: Breaking Change / :rocket: Enhancement / :robot: Dependencies
* [#162](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/162), [#178](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/178), [#185](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/185), [#180](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/180), [#194](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/194), [#211](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/211), and [#212](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/212) Replace ember-template-imports with content-tag. As a result, we were also able to remove dependencies on ember-cli-htmlbars and @glimmer/syntax. ([@patricklx](https://github.com/patricklx), [@gitKrystan](https://github.com/gitKrystan))

### :rocket: Enhancement
* [#178](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/178) Disable minification for easier debugging.

#### :robot: Dependencies
* [#158](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/158) and [#210](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/210) Upgrade Prettier to 3.1 (including relevant docs updates) ([@bartocc](https://github.com/bartocc) and [@gitKrystan](https://github.com/gitKrystan))
* [#182](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/182), [#177](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/177), [#176](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/176), and [#147](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/147) Upgrade typescript and @typescript-eslint dependencies ([@gitKrystan](https://github.com/gitKrystan), [@dependabot[bot]](https://github.com/apps/dependabot))
* [#181](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/181), [#169](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/169), [#171](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/171), and [#148](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/148) Upgrade eslint and eslint plugins (not including typescript-eslint) ([@gitKrystan](https://github.com/gitKrystan), [@dependabot[bot]](https://github.com/apps/dependabot))
* [#179](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/179), [#140](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/140), and [#150](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/150) Update babel dependencies ([@gitKrystan](https://github.com/gitKrystan), [@dependabot[bot]](https://github.com/apps/dependabot))
* [#161](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/161) Bump actions/setup-node from 3 to 4 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#151](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/151) Upgrade various minor dependencies ([@gitKrystan](https://github.com/gitKrystan))
* [#145](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/145) Bump postcss from 8.4.27 to 8.4.31 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#144](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/144) Bump @vitest/ui from 0.34.3 to 0.34.6 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#130](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/130) Bump actions/checkout from 3 to 4 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#209](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/209) Upgrade vite to v5, vitest to v1 ([@gitKrystan](https://github.com/gitKrystan))
* [#207](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/207) Upgrade dev dependencies ([@gitKrystan](https://github.com/gitKrystan))
* [#201](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/201) Bump @vitest/ui from 0.34.6 to 0.34.7 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#199](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/199) Bump @babel/core from 7.23.5 to 7.23.6 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#205](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/205) Bump @typescript-eslint/eslint-plugin from 6.13.1 to 6.15.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#206](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/206) Bump eslint-plugin-n from 16.3.1 to 16.5.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#196](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/196) Bump vite from 4.5.0 to 4.5.1 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 3
- Julien Palmas ([@bartocc](https://github.com/bartocc))
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))
- Patrick Pircher ([@patricklx](https://github.com/patricklx))



## v2.0.0-2 (2023-12-29)

#### :bug: Bug Fix
* [#212](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/212) Fix bug where preceding {} was slurping up template ([@gitKrystan](https://github.com/gitKrystan))

#### Committers: 1
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))

## v2.0.0-1 (2023-12-28)

#### :boom: Breaking Change
* [#208](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/208) Switch to type: module ([@gitKrystan](https://github.com/gitKrystan))

#### :rocket: Enhancement
* [#195](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/195) More content-tag cleanup ([@gitKrystan](https://github.com/gitKrystan))

#### :bug: Bug Fix
* [#194](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/194) Fix formatting issues #191, #192, #193 ([@gitKrystan](https://github.com/gitKrystan))

#### :robot: Dependencies
* [#211](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/211) Upgrade content-tag ([@gitKrystan](https://github.com/gitKrystan))
* [#210](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/210) Upgrade Prettier to 3.1.1 ([@gitKrystan](https://github.com/gitKrystan))
* [#209](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/209) Upgrade vite to v5, vitest to v1 ([@gitKrystan](https://github.com/gitKrystan))
* [#207](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/207) Upgrade dev dependencies ([@gitKrystan](https://github.com/gitKrystan))
* [#201](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/201) Bump @vitest/ui from 0.34.6 to 0.34.7 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#199](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/199) Bump @babel/core from 7.23.5 to 7.23.6 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#205](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/205) Bump @typescript-eslint/eslint-plugin from 6.13.1 to 6.15.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#206](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/206) Bump eslint-plugin-n from 16.3.1 to 16.5.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#196](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/196) Bump vite from 4.5.0 to 4.5.1 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 1
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))

## v2.0.0-0 (2023-12-04)

This version is essentially a re-write. We are switching from using [ember-template-imports](https://github.com/ember-template-imports/ember-template-imports) to parse template tags to the more robust [content-tag](https://github.com/embroider-build/content-tag) preprocessor. This should result in fewer unhandled cases and other bugs. For example, this plugin [can now format](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/issues/173) route templates from [ember-route-template](https://github.com/discourse/ember-route-template)!

This is a breaking change in that we are breaking compatibility with the current version of [eslint-plugin-ember](https://github.com/ember-cli/eslint-plugin-ember). If you are running Prettier via eslint-plugin-ember and eslint-plugin-prettier<sup>1</sup>, you will need to follow the following compatibility table, which also appears in the [README](https://github.com/gitKrystan/prettier-plugin-ember-template-tag#compatibility) for this plugin:

| eslint-plugin-ember | prettier-plugin-ember-template-tag |
| ------------------- | ---------------------------------- |
| <12                 | 1.1.0                              |
| >=12.0.0-alpha.1    | 2+                                 |

<sup>1</sup> Neither I [nor the Prettier project](https://prettier.io/docs/en/integrating-with-linters.html) recommend running Prettier this way.

#### :boom: Breaking Change
* [#152](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/152) Drop Node 16 ([@gitKrystan](https://github.com/gitKrystan))

#### :boom: Breaking Change / :rocket: Enhancement / :robot: Dependencies
* [#162](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/162), [#178](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/178), [#185](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/185), and [#180](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/180) Replace ember-template-imports with content-tag. As a result, we were also able to remove dependencies on ember-cli-htmlbars and @glimmer/syntax. ([@patricklx](https://github.com/patricklx), [@gitKrystan](https://github.com/gitKrystan))

### :rocket: Enhancement
* [#178](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/178) Disable minification for easier debugging.

#### :robot: Dependencies
* [#158](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/158) Upgrade Prettier to 3.1 (including relevant docs updates) ([@bartocc](https://github.com/bartocc))
* [#182](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/182), [#177](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/177), [#176](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/176), and [#147](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/147) Upgrade typescript and @typescript-eslint dependencies ([@gitKrystan](https://github.com/gitKrystan), [@dependabot[bot]](https://github.com/apps/dependabot))
* [#181](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/181), [#169](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/169), [#171](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/171), and [#148](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/148) Upgrade eslint and eslint plugins (not including typescript-eslint) ([@gitKrystan](https://github.com/gitKrystan), [@dependabot[bot]](https://github.com/apps/dependabot))
* [#179](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/179), [#140](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/140), and [#150](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/150) Update babel dependencies ([@gitKrystan](https://github.com/gitKrystan), [@dependabot[bot]](https://github.com/apps/dependabot))
* [#161](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/161) Bump actions/setup-node from 3 to 4 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#151](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/151) Upgrade various minor dependencies ([@gitKrystan](https://github.com/gitKrystan))
* [#145](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/145) Bump postcss from 8.4.27 to 8.4.31 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#144](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/144) Bump @vitest/ui from 0.34.3 to 0.34.6 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#130](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/130) Bump actions/checkout from 3 to 4 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 3
- Julien Palmas ([@bartocc](https://github.com/bartocc))
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))
- Patrick Pircher ([@patricklx](https://github.com/patricklx))

## v1.1.0 (2023-09-03)

#### :bug: Bug Fix
* [#125](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/125) Add more detail to languages array (possibly simplifying VSCode setup!) ([@gitKrystan](https://github.com/gitKrystan))

#### :house: Internal
* [#124](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/124) Add acceptance testing and document passing `--plugin` flag to `prettier` in CLI ([@gitKrystan](https://github.com/gitKrystan))
* Various dependency upgrades

#### Committers: 1
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))

## v1.0.2 (2023-08-09)

#### :bug: Bug Fix
* [#103](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/103) Remove npx only-allow pnpm preinstall hook and devDep ([@chrisrng](https://github.com/chrisrng))

#### Committers: 1
- Chris Ng ([@chrisrng](https://github.com/chrisrng))

## v1.0.1 (2023-08-08)

#### :bug: Bug Fix
* [#93](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/93) Add `only-allow` to `devDependencies` so it does not require network ([@chriskrycho](https://github.com/chriskrycho))

#### Committers: 1
- Chris Krycho ([@chriskrycho](https://github.com/chriskrycho))

## v1.0.0 (2023-07-25)

#### :house: Internal
* [#83](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/83) Add tests for using template tag within render in a test ([@gitKrystan](https://github.com/gitKrystan))

#### Committers: 1
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))

## v1.0.0-0 (2023-07-25)

#### :boom: Breaking Change
* [#78](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/78) Upgrade to Prettier 3 (Closes [#61](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/issues/61)); Breaks compatibility with Prettier 2 ([@gitKrystan](https://github.com/gitKrystan))
* [#57](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/57) Drop Node 14 ([@gitKrystan](https://github.com/gitKrystan))

#### :memo: Documentation
* [#55](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/55) README improvements ([@charlesfries](https://github.com/charlesfries))
* [#54](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/54) Improve documentation of prettier plugin config ([@ef4](https://github.com/ef4))

#### :house: Internal
* [#82](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/82) Run prettier -w with new trailingComma=all default ([@gitKrystan](https://github.com/gitKrystan))
* [#74](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/74) Add dependabot.yml ([@gitKrystan](https://github.com/gitKrystan))
* [#73](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/73) Upgrade @tsconfig/node16 ([@gitKrystan](https://github.com/gitKrystan))
* [#72](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/72) Upgrade concurrently ([@gitKrystan](https://github.com/gitKrystan))
* [#71](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/71) Upgrade vite / vitest / test package dependencies ([@gitKrystan](https://github.com/gitKrystan))
* [#70](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/70) Upgrade eslint and eslint plugins ([@gitKrystan](https://github.com/gitKrystan))
* [#69](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/69) Upgrade release-it dependencies ([@gitKrystan](https://github.com/gitKrystan))
* [#68](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/68) Upgrade pnpm and node@16 ([@gitKrystan](https://github.com/gitKrystan))
* [#56](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/56) Upgrade Dependencies ([@gitKrystan](https://github.com/gitKrystan))

#### Committers: 3
- Charles Fries ([@charlesfries](https://github.com/charlesfries))
- Edward Faulkner ([@ef4](https://github.com/ef4))
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))

## v0.3.2 (2023-02-01)

#### :bug: Bug Fix
* [#48](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/48) Fix build ([@gitKrystan](https://github.com/gitKrystan))

#### :house: Internal
* [#48](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/48) Fix build ([@gitKrystan](https://github.com/gitKrystan))

#### Committers: 1
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))

## v0.3.1 (2023-02-01)

#### :bug: Bug Fix
* [#46](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/46) No-op for invalid hbs (Closes [#43](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/issues/43)) ([@gitKrystan](https://github.com/gitKrystan))

#### :house: Internal
* [#44](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/44) Dependency Upgrades ([@gitKrystan](https://github.com/gitKrystan))

#### Committers: 1
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))

## v0.3.0 (2022-11-28)

#### :rocket: Enhancement
* [#39](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/39) Dependency Upgrades including Prettier 2.8 ([@gitKrystan](https://github.com/gitKrystan))

#### :bug: Bug Fix
* [#41](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/41) Fix local releases ([@gitKrystan](https://github.com/gitKrystan))

#### :house: Internal
* [#39](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/39) Dependency Upgrades including Prettier 2.8 ([@gitKrystan](https://github.com/gitKrystan))

#### Committers: 1
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))

## v0.2.1 (2022-11-19)

#### :bug: Bug Fix
* [#36](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/36) Fix bug where parsing template on newline caused syntax error ([@gitKrystan](https://github.com/gitKrystan))

#### Committers: 1
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))

## v0.2.0 (2022-11-19)

#### :boom: Breaking Change
* [#35](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/35) Print template tags on separate lines for "default" templates ([@gitKrystan](https://github.com/gitKrystan))

#### :rocket: Enhancement
* [#35](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/35) Print template tags on separate lines for "default" templates ([@gitKrystan](https://github.com/gitKrystan))

#### :memo: Documentation
* [#35](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/35) Print template tags on separate lines for "default" templates ([@gitKrystan](https://github.com/gitKrystan))

#### :house: Internal
* [#34](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/34) Add More Linters ([@gitKrystan](https://github.com/gitKrystan))

#### Committers: 1
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))

## v0.1.1 (2022-11-16)

#### :bug: Bug Fix
* [#33](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/33) HOTFIX block level error message ([@gitKrystan](https://github.com/gitKrystan))
* [#32](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/32) Move @glimmer/syntax to dependencies ([@gitKrystan](https://github.com/gitKrystan))

#### Committers: 1
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))

## v0.1.0 (2022-11-16)

#### :boom: Breaking Change
* [#30](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/30) Don't convert back to <template> if text is pre-preprocessed ([@gitKrystan](https://github.com/gitKrystan))
* [#27](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/27) Remove `export default` by default. Add `templateExportDefault` option to add it back. ([@gitKrystan](https://github.com/gitKrystan))

#### :rocket: Enhancement
* [#30](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/30) Don't convert back to <template> if text is pre-preprocessed ([@gitKrystan](https://github.com/gitKrystan))
* [#27](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/27) Remove `export default` by default. Add `templateExportDefault` option to add it back. ([@gitKrystan](https://github.com/gitKrystan))
* [#24](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/24) Use @glimmer/syntax getTemplateLocals ([@gitKrystan](https://github.com/gitKrystan))

#### :bug: Bug Fix
* [#28](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/28) Fix bug where preprocess caused syntax errors in component classes ([@gitKrystan](https://github.com/gitKrystan))

#### :memo: Documentation
* [#19](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/19) Add VSCode integration docs ([@gitKrystan](https://github.com/gitKrystan))

#### :house: Internal
* [#31](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/31) Depdendency Upgrades ([@gitKrystan](https://github.com/gitKrystan))
* [#29](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/29) Remove babel hacks ([@gitKrystan](https://github.com/gitKrystan))
* [#26](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/26) Increase typescript strictness ([@gitKrystan](https://github.com/gitKrystan))
* [#25](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/25) Remove extraneous arrowParens: avoid tests ([@gitKrystan](https://github.com/gitKrystan))
* [#23](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/23) Dependency Upgrades ([@gitKrystan](https://github.com/gitKrystan))
* [#21](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/21) Dependency Upgrades ([@gitKrystan](https://github.com/gitKrystan))

#### Committers: 1
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))

## v0.0.3 (2022-11-04)

#### :rocket: Enhancement
* [#18](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/18) Add templateSingleQuote option (See #16) + Simplify test suite further ([@gitKrystan](https://github.com/gitKrystan))

#### :memo: Documentation
* [#17](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/17) Test cleanup ([@gitKrystan](https://github.com/gitKrystan))

#### :house: Internal
* [#18](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/18) Add templateSingleQuote option (See #16) + Simplify test suite further ([@gitKrystan](https://github.com/gitKrystan))
* [#17](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/17) Test cleanup ([@gitKrystan](https://github.com/gitKrystan))

#### Committers: 1
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))

## v0.0.2 (2022-11-03)

#### :memo: Documentation
* [#13](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/13) Create CODE_OF_CONDUCT.md ([@gitKrystan](https://github.com/gitKrystan))
* [#12](https://github.com/gitKrystan/prettier-plugin-ember-template-tag/pull/12) Update readme, contribution guidelines, release instructions, examples ([@gitKrystan](https://github.com/gitKrystan))

#### Committers: 1
- Krystan HuffMenne ([@gitKrystan](https://github.com/gitKrystan))
