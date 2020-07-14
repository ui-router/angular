## 6.0.3 (2020-07-06)
[Compare `@uirouter/angular` versions 6.0.2 and 6.0.3](https://github.com/ui-router/angular/compare/6.0.2...6.0.3)

### Bug Fixes

* **LocationServices:** Apply the hash correctly when a query string is present ([0192877](https://github.com/ui-router/angular/commit/0192877)), closes [#747](https://github.com/ui-router/angular/issues/747)
* **tokens:** Export injection tokens ([#810](https://github.com/ui-router/angular/issues/810)) ([b9c338d](https://github.com/ui-router/angular/commit/b9c338d)), closes [#805](https://github.com/ui-router/angular/issues/805)
* **uiSref:** Render empty 'href' for states that have no urls ([5020c79](https://github.com/ui-router/angular/commit/5020c79)), closes [#721](https://github.com/ui-router/angular/issues/721)
* **uiSrefActive:** Fix nested UISrefActive where UISref components are added/removed dynamically ([#811](https://github.com/ui-router/angular/issues/811)) ([8d35dc1](https://github.com/ui-router/angular/commit/8d35dc1)), closes [#760](https://github.com/ui-router/angular/issues/760)

## 6.0.2 (2020-06-06)
[Compare `@uirouter/angular` versions 6.0.1 and 6.0.2](https://github.com/ui-router/angular/compare/6.0.1...6.0.2)

### Bug Fixes

* **ci:** Set git username ([b209cd8](https://github.com/ui-router/angular/commit/b209cd8))


### Features

* create OnUiParamsChanged, OnUiExit interfaces  ([#800](https://github.com/ui-router/angular/issues/800)) ([ea4574d](https://github.com/ui-router/angular/commit/ea4574d)), closes [#788](https://github.com/ui-router/angular/issues/788)
* **update_dependencies:** Add a repository_dispatch trigger ([d7a9777](https://github.com/ui-router/angular/commit/d7a9777))

## 6.0.1 (2019-11-24)
[Compare `@uirouter/angular` versions 6.0.0 and 6.0.1](https://github.com/ui-router/angular/compare/6.0.0...6.0.1)

### Bug Fixes

* **package:** Change angular peerDependency semver to match 9.0.0-next/rc ([#681](https://github.com/ui-router/angular/issues/681)) ([ca4acfb](https://github.com/ui-router/angular/commit/ca4acfb)) (Allows this package to be used with Angular 9.0.0-rc without warnings)

# 6.0.0 (2019-11-12)
[Compare `@uirouter/angular` versions 5.0.0 and 6.0.0](https://github.com/ui-router/angular/compare/5.0.0...6.0.0)

This release supports Angular 9 and removes the dependency on `@angular/router`
There are some *BREAKING CHANGES*, see below.

### Bug Fixes

* **ivy:** Inject host UISref separately to account for behavior change in [@ContentChildren](https://github.com/ContentChildren) ([ebd2e40](https://github.com/ui-router/angular/commit/ebd2e40)), closes [/github.com/angular/angular/issues/8277#issuecomment-323678013](https://github.com//github.com/angular/angular/issues/8277/issues/issuecomment-323678013)
* fix(angular8): Add static: true to ViewChild
* fix(lazyLoad): Remove dependency on angular/router in favor of using ivy
Ivy supports lazy loading of modules without depending on the ROUTES token from angular/router.

### Features

* **lazyLoad:** Remove NgModuleToLoad type (string based lazy module loading) ([2f1506c](https://github.com/ui-router/angular/commit/2f1506c))
* Ivy support (#674) ([00e9d6a](https://github.com/ui-router/angular/commit/00e9d6a)), closes [#674](https://github.com/ui-router/angular/issues/674)


### BREAKING CHANGES

####  UIRouter for Angular v6.0.0 now requires Angular 8 or higher

If you are not yet on Angular 8, please use `@uirouter/angular` v5.x

#### `@uirouter/core` and `@uirouter/rx` packages are now `peerDependencies`.

You will need to explicitly install the correct versions of `@uirouter/core` and `@uirouter/rx` into your project.

before:

```
dependencies: {
  "@uirouter/angular": "5.0.0"
}
```

after (example -- versions will vary):
```
dependencies: {
  "@uirouter/angular": "6.0.0"
  "@uirouter/core": "6.0.1",
  "@uirouter/rx": "0.6.0",
}
```

Or, use this command to automatically install peerDependencies:


```
npx check-peer-dependencies --install
```

#### Removed string based lazy module loading via loadChildren

Previously, we supported `loadChildren: './lazymodule/lazy.module.ts#LazyModule'`

This lazy load mechanism is deprecated in Angular 8 in favor of:
`loadChildren: import('./lazymodule/lazy.module).then(x => x.LazyModule)`

Migrate your `loadChildren`(s) to the `import()` style.

# 5.0.0 (2019-10-02)
[Compare `@uirouter/angular` versions 4.0.0 and 5.0.0](https://github.com/ui-router/angular/compare/4.0.0...5.0.0)

### Bug Fixes

* **travis:** use service: xvfb instead of launching it manually.  install libgconf debian package ([309fc9b](https://github.com/ui-router/angular/commit/309fc9b))


### Chores

* **package:** update [@uirouter/core](https://github.com/uirouter/core) and [@uirouter/rx](https://github.com/uirouter/rx) to enable support for observables in resolves ([#646](https://github.com/ui-router/angular/issues/646)) ([4661bab](https://github.com/ui-router/angular/commit/4661bab))


### BREAKING CHANGES

* **package:** Removed RXWAIT async policy (which was broken) in favor of supporting custom resolve policies.  Added a custom RXWAIT policy to uirouter/rx which is included in uirouter/angular

---

### Updated `@uirouter/core` from 5.0.23 to 6.0.1
[Compare `@uirouter/core` versions 5.0.23 and 6.0.1](https://github.com/ui-router/core/compare/5.0.23...6.0.1)

### Bug Fixes

* **resolve:** remove unnecessary generics from CustomAsyncPolicy ([#452](https://github.com/ui-router/core/issues/452)) ([61f4ee9](https://github.com/ui-router/core/commit/61f4ee9))
* **travis:** use service: xvfb instead of launching it manually ([1271fcd](https://github.com/ui-router/core/commit/1271fcd))
* **travis:** use service: xvfb instead of launching it manually.  install libgconf debian package ([ac1ef4b](https://github.com/ui-router/core/commit/ac1ef4b))


### Features

* **resolve:** Remove RXWAIT async policy in favour of allowing user defined async policy function ([#366](https://github.com/ui-router/core/issues/366)) ([0ad87f6](https://github.com/ui-router/core/commit/0ad87f6))


### BREAKING CHANGES in core

* **resolve:** RXWAIT async policy has been removed, but it never worked in the first place

---


### Updated `@uirouter/rx` from 0.5.0 to 0.6.0
[Compare `@uirouter/rx` versions 0.5.0 and 0.6.0](https://github.com/ui-router/rx/compare/0.5.0...0.6.0)

### Bug Fixes

* **travis:** use service: xvfb instead of launching it manually.  install libgconf debian package ([eace3a9](https://github.com/ui-router/rx/commit/eace3a9))


### Features

* add rxwait custom async policy ([dca4929](https://github.com/ui-router/rx/commit/dca4929))
* add rxwait custom async policy ([ab1aaa4](https://github.com/ui-router/rx/commit/ab1aaa4))
* **package:** require uirouter/core >=6.0.0 via peerDependency ([9bacfa4](https://github.com/ui-router/rx/commit/9bacfa4))


### BREAKING CHANGES in rx

* **package:** this version of uirouter/rx depends on uirouter/core version 6 and greater.
Because this package now provides an async resolve policy for Observables, this package now has a peerDependency on uirouter/core version >=6.0.0

# 4.0.0 (2019-06-14)
[Compare `@uirouter/angular` versions 3.0.0 and 4.0.0](https://github.com/ui-router/angular/compare/3.0.0...4.0.0)

### Features

* **uirouter:** Add support for Angular 8 ([c141d95](https://github.com/ui-router/angular/commit/c141d95))

# 3.0.0 (2019-02-04)
[Compare `@uirouter/angular` versions 2.0.4 and 3.0.0](https://github.com/ui-router/angular/compare/2.0.4...3.0.0)

### Features

* **angular:** Updates for Angular 7 ([7f3132a](https://github.com/ui-router/angular/commit/7f3132a))

## 2.0.4 (2019-01-29)
[Compare `@uirouter/angular` versions 2.0.3 and 2.0.4](https://github.com/ui-router/angular/compare/2.0.3...2.0.4)


### Updated `@uirouter/core` from 5.0.22 to 5.0.23
[Compare `@uirouter/core` versions 5.0.22 and 5.0.23](https://github.com/ui-router/core/compare/5.0.22...5.0.23)

### Bug Fixes

* **test_downstream_projects:** don't double build core while testing downstreams ([148b16b](https://github.com/ui-router/core/commit/148b16b))
* **typescript:** Fix typing of onChange callback in UrlService ([961ed0f](https://github.com/ui-router/core/commit/961ed0f)), closes [#229](https://github.com/ui-router/core/issues/229)
* **typescript:** Mark `params` as optional in StateService.href ([614bfb4](https://github.com/ui-router/core/commit/614bfb4)), closes [#287](https://github.com/ui-router/core/issues/287)
* **vanilla:** Fix baseHref parsing with chrome-extension:// urls ([f11be4d](https://github.com/ui-router/core/commit/f11be4d)), closes [#304](https://github.com/ui-router/core/issues/304)

## 2.0.3 (2019-01-10)
[Compare `@uirouter/angular` versions 2.0.2 and 2.0.3](https://github.com/ui-router/angular/compare/2.0.2...2.0.3)


### Updated `@uirouter/core` from 5.0.21 to 5.0.22
[Compare `@uirouter/core` versions 5.0.21 and 5.0.22](https://github.com/ui-router/core/compare/5.0.21...5.0.22)

### Bug Fixes

* **lazyLoad:** StateBuilder should not mutate the state declaration ([1478a3c](https://github.com/ui-router/core/commit/1478a3c)), closes [/github.com/ui-router/core/commit/3cd5a2a#r31260154](https://github.com//github.com/ui-router/core/commit/3cd5a2a/issues/r31260154)
* **state:** Update URL in response to ignored transition due to redirect ([c64c252](https://github.com/ui-router/core/commit/c64c252))


### Features

* **TransitionHook:** Pass in transition to HookMatchCriteria ([#255](https://github.com/ui-router/core/issues/255)) ([926705e](https://github.com/ui-router/core/commit/926705e))

## 2.0.2 (2018-08-11)
[Compare `@uirouter/angular` versions 2.0.1 and 2.0.2](https://github.com/ui-router/angular/compare/2.0.1...2.0.2)


### Updated `@uirouter/core` from 5.0.20 to 5.0.21
[Compare `@uirouter/core` versions 5.0.20 and 5.0.21](https://github.com/ui-router/core/compare/5.0.20...5.0.21)

### Bug Fixes

* **dynamic:** Use 'find' from common.ts instead of Array.prototype.find ([66a3244](https://github.com/ui-router/core/commit/66a3244)), closes [#215](https://github.com/ui-router/core/issues/215)
* **url:** When using html5Mode and no <base> tag is present, default to '/' ([23742e3](https://github.com/ui-router/core/commit/23742e3)), closes [#223](https://github.com/ui-router/core/issues/223)

## 2.0.1 (2018-07-20)
[Compare `@uirouter/angular` versions 2.0.0 and 2.0.1](https://github.com/ui-router/angular/compare/2.0.0...2.0.1)


### Updated `@uirouter/core` from 5.0.19 to 5.0.20
[Compare `@uirouter/core` versions 5.0.19 and 5.0.20](https://github.com/ui-router/core/compare/5.0.19...5.0.20)

### Bug Fixes

* **params:** When creating an array parameter from a custom type, copy the `raw` property ([b6dd738](https://github.com/ui-router/core/commit/b6dd738)), closes [#178](https://github.com/ui-router/core/issues/178)


### Features

* **dynamic:** Support dynamic flag on a state declaration ([3cd5a2a](https://github.com/ui-router/core/commit/3cd5a2a))
* **transition:** Added transition.paramsChanged() to get added/deleted/changed parameter values for a transition ([10b7fde](https://github.com/ui-router/core/commit/10b7fde))
* **view:** Add _pluginapi._registeredUIView() to get a ui-view by id ([6533b51](https://github.com/ui-router/core/commit/6533b51))

# 2.0.0 (2018-05-09)
[Compare `@uirouter/angular` versions 1.1.0 and 2.0.0](https://github.com/ui-router/angular/compare/1.1.0...2.0.0)

### Features

* **angular:** Drop Angular v4 support, add Angular v6 support ([cdf0273](https://github.com/ui-router/angular/commit/cdf0273)), closes [#301](https://github.com/ui-router/angular/issues/301)
* **core:** Update core to 5.0.19, rx to 0.5.0 ([be6de0d](https://github.com/ui-router/angular/commit/be6de0d))


### BREAKING CHANGES

* **angular:** RxJS v6 and Angular v5 or higher is now required to use this package.

If using Angular v5, you should update to `"rxjs": "^6.0.0"` and also add `"rxjs-compat": "^6.0.0"`.


### Updated `@uirouter/core` from 5.0.18 to 5.0.19
[Compare `@uirouter/core` versions 5.0.18 and 5.0.19](https://github.com/ui-router/core/compare/5.0.18...5.0.19)

### Bug Fixes

* **enums:** Workaround angular compiler export issue https://github.com/angular/angular/issues/23759 ([38d25fa](https://github.com/ui-router/core/commit/38d25fa))

# 1.1.0 (2018-05-03)
[Compare `@uirouter/angular` versions 1.0.1 and 1.1.0](https://github.com/ui-router/angular/compare/1.0.1...1.1.0)

### Bug Fixes

* **uiSref:** Ignore clicks if destination state is falsey ([b599e72](https://github.com/ui-router/angular/commit/b599e72))
* **uiView:** Always inject and/or bind NOWAIT resolve as a Promise object. ([42d739d](https://github.com/ui-router/angular/commit/42d739d))


### Features

* **uiView:** Add uiOnParamsChanged support for routed components ([45aa2aa](https://github.com/ui-router/angular/commit/45aa2aa))


### Updated `@uirouter/core` from 5.0.17 to 5.0.18
[Compare `@uirouter/core` versions 5.0.17 and 5.0.18](https://github.com/ui-router/core/compare/5.0.17...5.0.18)

### Bug Fixes

* **angular:** A hack to force the Angular compiler to import from module index ([d56a2be](https://github.com/ui-router/core/commit/d56a2be))
* **StateRegistry:** Notify listeners of added states when there are orphans in the state queue ([5a9bac9](https://github.com/ui-router/core/commit/5a9bac9))
* **transition:** Fix typing of Transition.params() ([ebea30e](https://github.com/ui-router/core/commit/ebea30e))
* **transition:** Normalize `error()` to always return `Rejection` ([9bcc5db](https://github.com/ui-router/core/commit/9bcc5db))

## 1.0.1 (2018-02-12)
[Compare `@uirouter/angular` versions 1.0.0 and 1.0.1](https://github.com/ui-router/ng2/compare/1.0.0...1.0.1)

### Bug Fixes

* **package:** update [@uirouter](https://github.com/uirouter)/core to version 5.0.17 ([f018f35](https://github.com/ui-router/ng2/commit/f018f35))
* **uiSrefActive:** Support multiple active classes ([e086700](https://github.com/ui-router/ng2/commit/e086700))


### Updated `@uirouter/core` from 5.0.16 to 5.0.17
[Compare `@uirouter/core` versions 5.0.16 and 5.0.17](https://github.com/ui-router/core/compare/5.0.16...5.0.17)

### Bug Fixes

* **core:** Fix leak of old transitions by mutating pathnode*.resolvables*.data ([0a1f518](https://github.com/ui-router/core/commit/0a1f518))

# 1.0.0 (2018-01-31)
[Compare `@uirouter/angular` versions 1.0.0-rc.3 and 1.0.0](https://github.com/ui-router/ng2/compare/1.0.0-rc.3...1.0.0)


### Updated `@uirouter/core` from 5.0.14 to 5.0.16
[Compare `@uirouter/core` versions 5.0.14 and 5.0.16](https://github.com/ui-router/core/compare/5.0.14...5.0.16)

### Bug Fixes

* **common:** Fix signature of  for objects (make target optional) ([61d0afc](https://github.com/ui-router/core/commit/61d0afc))
* **core:** Fix memory leak of resolve data from ALL transitions ever ([7f2aed1](https://github.com/ui-router/core/commit/7f2aed1))
* **pathNode:** add backwards compat for PathNode.clone(). Add retainedWithToParams to treeChanges interface. ([4833a32](https://github.com/ui-router/core/commit/4833a32))


### Features

* **common:** Add map-in-place support to map() ([12bc7d8](https://github.com/ui-router/core/commit/12bc7d8))
* **common:** Add onEvict() callback registry for queues with max length ([c19d007](https://github.com/ui-router/core/commit/c19d007))

# 1.0.0-rc.3 (2018-01-10)
[Compare `@uirouter/angular` versions 1.0.0-rc.2 and 1.0.0-rc.3](https://github.com/ui-router/ng2/compare/1.0.0-rc.2...1.0.0-rc.3)

### Bug Fixes

* **hooks:** Use an APP_INITIALIZER to sync/listen to the URL ([f1d390f](https://github.com/ui-router/ng2/commit/f1d390f))


### Updated `@uirouter/core` from 5.0.13 to 5.0.14
[Compare `@uirouter/core` versions 5.0.13 and 5.0.14](https://github.com/ui-router/core/compare/5.0.13...5.0.14)

### Bug Fixes

* **trace:** Fix null reference in uiview name sort function ([59cb067](https://github.com/ui-router/core/commit/59cb067))
* **treeChanges:** apply toParams to 'retained' path ([#72](https://github.com/ui-router/core/issues/72)) ([cf63d11](https://github.com/ui-router/core/commit/cf63d11))

# 1.0.0-rc.2 (2017-12-22)
[Compare `@uirouter/angular` versions 1.0.0-rc.1 and 1.0.0-rc.2](https://github.com/ui-router/ng2/compare/1.0.0-rc.1...1.0.0-rc.2)

### Bug Fixes

* **package:** Bump dependency on uirouter/publish-scripts to fix npm install ([1a026d2](https://github.com/ui-router/ng2/commit/1a026d2))
* **package:** update [@uirouter](https://github.com/uirouter)/core to version 5.0.13 ([90aa1d4](https://github.com/ui-router/ng2/commit/90aa1d4))


### Features

* **uiSref:** Add support for ctrl/middle-clicking on a uiSref generated URL ([#175](https://github.com/ui-router/ng2/issues/175)) ([973924a](https://github.com/ui-router/ng2/commit/973924a))


### Updated `@uirouter/core` from 5.0.11 to 5.0.13
[Compare `@uirouter/core` versions 5.0.11 and 5.0.13](https://github.com/ui-router/core/compare/5.0.11...5.0.13)

### Bug Fixes

* **browserLocation:** Use location.pathname (not href) or '/' when no base tag found ([db461d6](https://github.com/ui-router/core/commit/db461d6))
* **browserLocationConfig:** If no base href found, use location.href (not empty string) ([0251424](https://github.com/ui-router/core/commit/0251424))
* **pushStateLocation:** Fix URLs: add slash between base and path when necessary ([bfa5755](https://github.com/ui-router/core/commit/bfa5755))
* **pushStateLocation:** When url is "" or "/", use baseHref for pushState ([042a950](https://github.com/ui-router/core/commit/042a950))
* **resolve:** Add onFinish hook to resolve any dynamicly added resolvables ([7d1ca54](https://github.com/ui-router/core/commit/7d1ca54))
* **urlRouter:** Update query params when resetting url via .update() ([7664cd0](https://github.com/ui-router/core/commit/7664cd0))


### Features

* **view:** Add onSync callback API to plugin API ([9544ae5](https://github.com/ui-router/core/commit/9544ae5))

# 1.0.0-rc.1 (2017-12-06)
[Compare `@uirouter/angular` versions 1.0.0-rc.0 and 1.0.0-rc.1](https://github.com/ui-router/ng2/compare/1.0.0-rc.0...1.0.0-rc.1)

### Bug Fixes

* **package:** Rebuild uirouter/angular using angular 4.4.6 ([a39aed8](https://github.com/ui-router/ng2/commit/a39aed8))
* **package.json:** npm shrinkwarp with angular 5 ([477d0f7](https://github.com/ui-router/ng2/commit/477d0f7))

# 1.0.0-rc.0 (2017-11-15)
[Compare `@uirouter/angular` versions 1.0.0-beta.9 and 1.0.0-rc.0](https://github.com/ui-router/ng2/compare/1.0.0-beta.9...1.0.0-rc.0)

### Bug Fixes

* **uiView:** Fix animations :enter trigger by using markForCheck ([3d7ce44](https://github.com/ui-router/ng2/commit/3d7ce44))


### Features

* **directives:** Export directives using `exportAs:` for use as template variables ([3d532b6](https://github.com/ui-router/ng2/commit/3d532b6))
* **lazyLoad:** Allow loadChildren for non-future states. ([ac3cdef](https://github.com/ui-router/ng2/commit/ac3cdef))
* **uiView:** add getter for state which is filling the uiview ([e7cb5f1](https://github.com/ui-router/ng2/commit/e7cb5f1))

# 1.0.0-beta.9 (2017-10-17)
[Compare `@uirouter/angular` versions 1.0.0-beta.8 and 1.0.0-beta.9](https://github.com/ui-router/ng2/compare/1.0.0-beta.8...1.0.0-beta.9)

### Features

* **UIRouterModule:** Add `initial` property to `forRoot` to specify the initial route. ([b7b5e4f](https://github.com/ui-router/ng2/commit/b7b5e4f))


### Updated `@uirouter/core` from 5.0.10 to 5.0.11
[Compare `@uirouter/core` versions 5.0.10 and 5.0.11](https://github.com/ui-router/core/compare/5.0.10...5.0.11)

### Bug Fixes

* **ie9:** make console.bind work in ie9 ([#85](https://github.com/ui-router/core/issues/85)) ([318214b](https://github.com/ui-router/core/commit/318214b))

# 1.0.0-beta.8 (2017-10-07)
[Compare `@uirouter/angular` versions 1.0.0-beta.7 and 1.0.0-beta.8](https://github.com/ui-router/ng2/compare/1.0.0-beta.7...1.0.0-beta.8)

### Bug Fixes

* **NgModule:** Use InjectionToken instead of OpaqueToken ([bfa604c](https://github.com/ui-router/ng2/commit/bfa604c))
* **typescript:** Fix typescript 2.4 compatibility issue ([d0c46ce](https://github.com/ui-router/ng2/commit/d0c46ce))
* **uiSref:** run update when input properties change ([#141](https://github.com/ui-router/ng2/issues/141)) ([9ecc6e2](https://github.com/ui-router/ng2/commit/9ecc6e2))


### Features

* **UIRouterModule:** Add deferInitialRender toggle to forRoot. Waits for initial router transition before bootstrapping the app the initial render. ([5ae9051](https://github.com/ui-router/ng2/commit/5ae9051))
* **uiSrefStatus:** Emit all enclosed uiSref targetStates in the status object ([0687e19](https://github.com/ui-router/ng2/commit/0687e19))
* **uiSrefStatus:** emit state/params in events ([bd67d25](https://github.com/ui-router/ng2/commit/bd67d25))



## `@uirouter/core` updated from 5.0.4 to 5.0.10 (2017-10-07)
[Compare `@uirouter/core` versions 5.0.4 and 5.0.10](https://github.com/ui-router/core/compare/5.0.4...5.0.10)

### Bug Fixes

* **angular/cli:** Use package.json fields: 'typings', 'main', 'jsnext:main' ([74143d9](https://github.com/ui-router/core/commit/74143d9))
* **bundle:** Rollup: Do not warn on THIS_IS_UNDEFINED ([a4581b1](https://github.com/ui-router/core/commit/a4581b1))
* **globals:** Use shallow copy to update the globals.params / $state.params object ([e883afc](https://github.com/ui-router/core/commit/e883afc))
* **Injector:** When getting tokens from native injector, only throw on undefined (not on falsey values) ([ada9ca2](https://github.com/ui-router/core/commit/ada9ca2))
* **isomorphic:** Remove use of CustomEvent. Detect root scope (global/window/self) for nodejs, browser, or web-worker. ([2d206ba](https://github.com/ui-router/core/commit/2d206ba))
* **redirectTo:** Fix typings for redirectTo. Allow a function that returns a target state or a promise for one. ([3904487](https://github.com/ui-router/core/commit/3904487))
* **sourceMaps:** Embed typescript sources in sourcemaps ([10558a3](https://github.com/ui-router/core/commit/10558a3))
* **trace:** Fall back to console.log if .table is unavailable (IE) ([c8110fc](https://github.com/ui-router/core/commit/c8110fc))
* **trace:** Support tracing of object-parameters with circular references ([2f1ae9a](https://github.com/ui-router/core/commit/2f1ae9a))
* **typescript:** Fix strictNullCheck type error ([0ae585e](https://github.com/ui-router/core/commit/0ae585e))
* **typescript:** Update to typescript 2.4 ([ce1669b](https://github.com/ui-router/core/commit/ce1669b))
* **typings:** Use StateObject for parameter to hook criteria functions ([5b58566](https://github.com/ui-router/core/commit/5b58566))
* **url:** Add CustomEvent polyfill for IE ([a50db21](https://github.com/ui-router/core/commit/a50db21))
* **urlRouter:** Fix absolute 'href' generation by using location.hostname (not location.host) ([a28b68a](https://github.com/ui-router/core/commit/a28b68a))
* **urlService:** Fix priority sorting of URL rules ([73a1fe0](https://github.com/ui-router/core/commit/73a1fe0))
* **vanilla:** fix base path handling for vanilla push state ([ad61d74](https://github.com/ui-router/core/commit/ad61d74))
* **vanilla:** Use `self` instead of `window` for webworker compat ([a4629ee](https://github.com/ui-router/core/commit/a4629ee))


### Features

* **Resolvable:** Add `.value()`: returns value (WAIT) or promise (NOWAIT) ([8769449](https://github.com/ui-router/core/commit/8769449))
* **TargetState:** Add builder methods .withState, .withParams, and .withOptions ([6b93142](https://github.com/ui-router/core/commit/6b93142))
* **TransitionHook:** Add hook registration option `invokeLimit` to limit the number of times a hook is invoked before being auto-deregistered. ([2cb17ef](https://github.com/ui-router/core/commit/2cb17ef))
* **urlMatcher:** add support for multiline urls ([5b11ce0](https://github.com/ui-router/core/commit/5b11ce0))



<a name="1.0.0-beta.7"></a>
# [1.0.0-beta.7](https://github.com/ui-router/ng2/compare/1.0.0-beta.6...1.0.0-beta.7) (2017-06-19)


### Bug Fixes

* **lazyLoad:** fixed getting parent injector in angular 4.2 ([dcd1cda](https://github.com/ui-router/ng2/commit/dcd1cda))
* **Ng2LocationServices:** Do not fireAfterUpdate when on server. ([543afcd](https://github.com/ui-router/ng2/commit/543afcd))
* **UISrefStatus:** Fix memory leak -- take only one inner subscription  at a time. ([#120](https://github.com/ui-router/ng2/issues/120)) ([5a65d3c](https://github.com/ui-router/ng2/commit/5a65d3c)), closes [#21](https://github.com/ui-router/ng2/issues/21)


### Features

* **view:** Support shorthand for named views, `views: { viewName: Component }` ([84aec02](https://github.com/ui-router/ng2/commit/84aec02))

### Changes in `@uirouter/core` from [5.0.0 to 5.0.4](https://github.com/ui-router/core/compare/5.0.0...5.0.4)

### Bug Fixes

* **common:** Fix implementation of 'pick' -- use hasOwnProperty ([09848a4](https://github.com/ui-router/core/commit/09848a4))
* **common:** Re-fix implementation of 'pick' using for .. in ([f2da7f4](https://github.com/ui-router/core/commit/f2da7f4))
* **future:** Allow future states to specify a `parent:` ([828fe1b](https://github.com/ui-router/core/commit/828fe1b))
* **transition:** Do not ignore transitions which have states being entered or exited ([175717e](https://github.com/ui-router/core/commit/175717e))
* **view:** only sync views which are of the same name *and type* ([c48da4a](https://github.com/ui-router/core/commit/c48da4a))


### Features

* **build:** Build and distribute UMD bundles ([0a8da85](https://github.com/ui-router/core/commit/0a8da85))
* **invalidTransition:** Better error messaging when param values are invalid ([2a15d1a](https://github.com/ui-router/core/commit/2a15d1a))
* **Resolvable:** Add `.value()`: returns value (WAIT) or promise (NOWAIT) ([8769449](https://github.com/ui-router/core/commit/8769449))
* **trace:** Trace view synchronization. Allow trace.enable(...string) ([284392d](https://github.com/ui-router/core/commit/284392d))
* **urlMatcher:** add support for multiline urls ([5b11ce0](https://github.com/ui-router/core/commit/5b11ce0))


<a name="1.0.0-beta.6"></a>
# [1.0.0-beta.6](https://github.com/ui-router/ng2/compare/1.0.0-beta.5...1.0.0-beta.6) (2017-04-28)

## Adds supports for Angular 4.x, removes support for Angular 2.x

### Bug Fixes

* **uiSref:** open new tab when a tag has target="_blank" ([d13ed47](https://github.com/ui-router/ng2/commit/d13ed47))

### Features

* **resolve:** auto-map resolve values to matching component inputs in AoT ([f6c552d](https://github.com/ui-router/ng2/commit/f6c552d))

<a name="1.0.0-beta.5"></a>
# [1.0.0-beta.5](https://github.com/ui-router/ng2/compare/1.0.0-beta.4...1.0.0-beta.5) (2017-04-22)

# NOTICE: The npm package changed to `@uirouter/angular`

### Bug Fixes

* **bindings:** Make `bindings:` work on a state declaration (as well as a view declaration) ([a21c479](https://github.com/ui-router/ng2/commit/a21c479))
* **bundle:** Only bundle ui-router-ng2 code (do not bundle ui-router-core) ([a285218](https://github.com/ui-router/ng2/commit/a285218))
* **bundle:** work around rollup bug https://github.com/rollup/rollup/issues/1322 ([89884b9](https://github.com/ui-router/ng2/commit/89884b9))
* **lazyLoad:** Supply native injector to lazy loaded states ([ebce639](https://github.com/ui-router/ng2/commit/ebce639))
* **Ng2LocationServices:** Ignore duplicated 'hashchange' event in favor of 'popstate' event ([82a3e2e](https://github.com/ui-router/ng2/commit/82a3e2e))
* **NgModule:** De-dupe states loaded from NgModule ([ffe85cb](https://github.com/ui-router/ng2/commit/ffe85cb))
* **package.json:** Fix engines in package.json ([b2d828a](https://github.com/ui-router/ng2/commit/b2d828a))
* **rxjs:** Fix missing RxJS operators in tree-shaked apps ([5f03719](https://github.com/ui-router/ng2/commit/5f03719))
* **rxjs:** import rxjs operators. ([26a74ef](https://github.com/ui-router/ng2/commit/26a74ef))
* **uiSref:** avoid empty links ([#26](https://github.com/ui-router/ng2/issues/26)) ([5f6870d](https://github.com/ui-router/ng2/commit/5f6870d))


### Features

* **bindings:** Apply explicit bindings even when no `[@Input](https://github.com/Input)()` found. ([4351c53](https://github.com/ui-router/ng2/commit/4351c53))
* **config:** Pass the module object to the module config function ([e9705b0](https://github.com/ui-router/ng2/commit/e9705b0))
* **Ng2LocationConfig:** use BrowserLocationConfig. ([7e0aef6](https://github.com/ui-router/ng2/commit/7e0aef6))
* **uiCanExit:** Add `uiCanExit` hook for routed components ([633573e](https://github.com/ui-router/ng2/commit/633573e))

### Reverts

* **ResolveData:** Remove [@ResolveData](https://github.com/ResolveData) decorator ([0c8226d](https://github.com/ui-router/ng2/commit/0c8226d))

### BREAKING CHANGES

## **bundle:** We no longer bundle the core nor rx code in the UMD bundle.

Previously, the `ui-router-ng2` bundle included the code from `ui-router-core` and `ui-router-rx`.
Now, each UMD bundle must be included separately.

This change is most likely to affect:

- SystemJS projects
- projects that do not bundle (but ship pre-built UMD bundles)
- Users of ui-router plugins that import ui-router-core, such as sticky-states.


### @ui-router/core changes
# [5.0.0](https://github.com/ui-router/core/compare/4.0.0...5.0.0) (2017-04-22)

This release of `@uirouter/angular` updates `@uirouter/core` from `4.0.0` to `5.0.0`.
Here are the changes from core:

### Bug Fixes

* **BrowserLocationConfig:** fixed protocol + port value ([#38](https://github.com/ui-router/core/issues/38)) ([5559382](https://github.com/ui-router/core/commit/5559382))
* **lazyLoad:** Wait for future state to be replaced before registering lazy children ([4bdce47](https://github.com/ui-router/core/commit/4bdce47))
* **noImplicitAny:** Fix noimplicitany compliance ([1a6cdfc](https://github.com/ui-router/core/commit/1a6cdfc))
* **redirect:** Do not update URL after redirect with { location: false } ([652a760](https://github.com/ui-router/core/commit/652a760))
* **tfs:** Rename $q.ts and $injector.ts files, removing leading dollar signs ([cb653ee](https://github.com/ui-router/core/commit/cb653ee))
* **trace:** Re-add transitionStart trace ([b019036](https://github.com/ui-router/core/commit/b019036))
* **TransitionHook:** Do not process transition hooks after router has been disposed. ([666c6d7](https://github.com/ui-router/core/commit/666c6d7))
* **TransitionHook:** Transition hooks no longer expose the internal StateObject ([2b0e48b](https://github.com/ui-router/core/commit/2b0e48b))
* **typings:** Allow strictNullChecks for HookMatchCriteria ([d92d4d5](https://github.com/ui-router/core/commit/d92d4d5))
* **ui-sref:** Improve performance of generating hrefs ([c3967bd](https://github.com/ui-router/core/commit/c3967bd))
* **view:** Do not throw when uiView doesn't have a state context ([f76ee2a](https://github.com/ui-router/core/commit/f76ee2a))
* **view:** Update views in order of ui-view depth and also by state depth ([46dea2b](https://github.com/ui-router/core/commit/46dea2b))


### Features

* **abort:** Add API to manually abort/cancel a transition ([39f8a53](https://github.com/ui-router/core/commit/39f8a53))
* **common:** Perf improvements in hot functions: ([4193244](https://github.com/ui-router/core/commit/4193244))
* **core:** Switch to [@uirouter/core](https://github.com/uirouter/core) npm module ([e3f389f](https://github.com/ui-router/core/commit/e3f389f))
* **defaultErrorHandler:** Do not invoke default error handler for ABORTED transitions ([b07a24b](https://github.com/ui-router/core/commit/b07a24b))
* **Globals:** implement Disposable and delete global transition data ([a794018](https://github.com/ui-router/core/commit/a794018))
* **onBefore:** Run onBefore hooks asynchronously. ([30b82aa](https://github.com/ui-router/core/commit/30b82aa))
* **onEnter/Exit/Retain:** Use onExit/onEnter/onRetain from StateObject, not state.self ([bc1f554](https://github.com/ui-router/core/commit/bc1f554))
* **Rejection:** Add $id to ease debugging of transition rejections ([d456d54](https://github.com/ui-router/core/commit/d456d54))
* **State:** Switch Internal State Object to prototypally inherit from the State Declaration ([027c995](https://github.com/ui-router/core/commit/027c995)), closes [#34](https://github.com/ui-router/core/issues/34)
* **StateObject:** Rename internal `State` object to `StateObject` ([feceaf9](https://github.com/ui-router/core/commit/feceaf9))
* **StateRegistry:** improve perf for: `.register()` and `StateMatcher.find()` misses ([fdb3ab9](https://github.com/ui-router/core/commit/fdb3ab9))
* **Transition:** Ignore duplicate transitions (double clicks) ([bd1bd0b](https://github.com/ui-router/core/commit/bd1bd0b))
* **Transition:** Improve supersede logic: Do not supersede if the new trans is aborted before onStart ([3141a8f](https://github.com/ui-router/core/commit/3141a8f))
* **Transition:** Run hooks synchronously in current stack, when possible ([953e618](https://github.com/ui-router/core/commit/953e618))
* **Transition:** Normalize all transition errors to a Rejection. ([a7464bb](https://github.com/ui-router/core/commit/a7464bb))
* **UrlService:** (`UrlRouter`) improve perf of registering Url Rules and sorting Url Rules ([64fbfff](https://github.com/ui-router/core/commit/64fbfff))
* **UrlService:** Add `rules.initial("/home")` to config initial state (like otherwise) ([bbe4209](https://github.com/ui-router/core/commit/bbe4209))


### BREAKING CHANGES

## **TransitionHook:** Transition hooks no longer expose the internal `State` object (now named `StateObject`)

#### Before:

```js
import { State } from "ui-router-core";
const match = { to: (state: State) => state.data.auth };
transitionsvc.onEnter(match, (trans: Transition, state: State) => {
  // state is the internal State object
  if (state.includes["foo"]) { // internal ui-router API
    return false;
  }
}
```

#### Now:

```js
import { StateDeclaration } from "ui-router-core";
const match = { to: (state: StateDeclaration) => state.data.auth };
transitionsvc.onEnter(match, (trans: Transition, state: StateDeclaration) => {
  // state === the state object you registered
  // Access internal ui-router API using $$state()
  if (state.$$state().includes["foo"]) {
    return false;
  }
}
```

#### Motivation:

The `State` object (now named `StateObject`) is an internal API and should not be exposed via any public APIs.
If you depend on the internal APIs, you can still access the internal object by calling `state.$$state()`.

#### BC Likelihood

How likely is this BC to affect me?

Medium: You will likely be affected you 1) have transition hooks, 2) are using typescript and/or 3) use the internal ui-router State API.

#### BC Severity

How severe is this BC?

Low: Access to the internal api is still available using `$$state()`.




## **StateObject:** Renamed internal API `State` object to `StateObject`

#### Before:

```
import {State} from "ui-router-core";
```

#### Now:

```
import {StateObject} from "ui-router-core";
```

#### Motivation:

We'd like to use the `State` name/symbol as a public API.
Some day (not today) it will likely be an ES7/TS decorator for ES6/TS state definition classes, i.e:

```js
@State("foo")
export class FooState implements StateDeclaration {
  url = "/foo";
  component = FooComponent;

  @Resolve({ deps: [FooService] })
  fooData(fooService) {
    return fooService.getFoos();
  }
}
```

#### BC Likelihood

How likely is this to affect me?

Low: This only affects code that imports the internal API symbol `State`.
You will likely be affected you 1) import that symbol, 2) are using typescript and 3) explicitly
typed a variable such as `let internalStateObject = state.$$state();`

#### BC Severity

How severe is this change?

Low: Find all places where `State` is imported and rename to `StateObject`


## **Transition:** All Transition errors are now wrapped in a Rejection object.

#### Before:

Previously, if a transition hook returned a rejected promise:
```js
.onStart({}, () => Promise.reject('reject transition'));
```

In `onError` or `transtion.promise.catch()`, the raw rejection was returned:
```js
.onError({}, (trans, err) => err === 'reject transition')
```

#### Now:

Now, the error is wrapped in a Rejection object.

- The detail (thrown error or rejected value) is still available as `.detail`.

```js
.onError({}, (trans, err) =>
    err instanceof Rejection && err.detail === 'reject transition')
```

- The Rejection object indicates the `.type` of transition rejection (ABORTED, ERROR, SUPERSEDED and/or redirection).
```js
.onError({}, (trans, err) => {
  err.type === RejectType.ABORTED === 3
});
```

#### Motivation:

Errors *thrown from* a hook and rejection values *returned from* a hook can now be processed in the same way.

#### BC Likelihood

How likely is this to affect me?

Medium: apps which have onError handlers for rejected values

#### BC Severity

How severe is this change?

Low: Find all error handlers (or .catch/.then chains) that do not understand Rejection. Add `err.detail` processing.


## **onBefore:** `onBefore` hooks are now run asynchronously like all the other hooks.

#### Old behavior

Previously, the `onBefore` hooks were run in the same stackframe as `transitionTo`.
If they threw an error, it could be caught using try/catch.

```js
transitionService.onBefore({ to: 'foo' }), () => { throw new Error('doh'); });
try {
  stateService.go('foo');
} catch (error) {
  // handle error
}
```

#### New behavior

Now, `onBefore` hooks are processed asynchronously.
To handle errors, use any of the async error handling paradigms:

- Chain off the promise
  ```js
  transitionService.onBefore({ to: 'foo' }), () => { throw new Error('doh'); });
  stateService.go('foo').catch(error => { //handle error });
  ```
- Define an error handler
  ```js
  transitionService.onBefore({ to: 'foo' }), () => { throw new Error('doh'); });
  transitionService.onError({ to: 'foo' }), () => { // handle error });
  stateService.go('foo');
  ```
- Use the global defaultErrorHandler
  ```js
  transitionService.onBefore({ to: 'foo' }), () => { throw new Error('doh'); });
  stateService.go('foo');
  stateService.defaultErrorHandler(error => { // global error handler });
  ```

#### Motivation

Why introduce a BC?

- No subtle behavior differences by hook type
- Simpler code and mental model
- Fewer edge cases to account for

#### BC Liklihood

How likely is this to affect my app?

Very Low: Apps that registered onBefore hooks and depend on
synchronous execution are affected.

#### BC Severity

How severe is this BC?

Low: Switch to asynchronous handling, such as chaining off the
transition promise


## **defaultErrorHandler:** ABORTED transitions do not invoke the `defaultErrorHandler`

Returning `false` from a transition hook will abort the transition.

#### Old behavior

Previously, this case was considered an error and was logged by
`defaultErrorHandler`.
After your feedback, we agree that this is not typically an error.

#### New behavior

Now, aborted transitions do not trigger the `defaultErrorHandler`

#### Motivation:

> Why introduce a BC?

Most users do not consider ABORT to be an error.  The default error
handler should match this assumption.

#### BC liklihood

> How likely am I to be affected?

Low: Most users do not consider ABORT to be an error. For most users
this will not be a BC.

#### BC severity

> How severe is this BC?

Low: Users who want to handle all transition rejections can
register a `.onError` handler and filter/process accordingly.



<a name="1.0.0-beta.4"></a>
# [1.0.0-beta.4](https://github.com/ui-router/ng2/compare/1.0.0-beta.3...1.0.0-beta.4) (2017-01-22)

This is a major release of `ui-router-ng2` with many new features, including support for the [angular-cli](https://github.com/angular/angular-cli).
We now support AoT compilation with NgModule lazy loading (via Future States).
We also enabled code splitting support from the []`@ngtools/webpack` project](https://www.npmjs.com/package/@ngtools/webpack).

There are numerous BREAKING CHANGES including those from the `ui-router-core` dependency.
Please read through them carefully.

## AoT support + lazy loading + Angular-CLI

Commits eb5d599, 2a4b174, and 8088ef9 enable AoT compilation support and better Lazy Loading support.
When `@ngtools/webpack` is being used, this also enables automatic code splitting + lazy loading.  
Because `angular-cli` uses `@ngtools/webpack`, this change also enables `angular-cli` support.

To use these new features, define a `Future State` (by appending `.**` to
the state name).  Give the state a `loadChildren` property which points
to a nested NgModule that will be lazy loaded.  Use the same syntax that
`@ngtools/webpack` expects: `<pathToModule>#<name of export>`.

```js
export var futureFooState = {
  name: 'foo.**',
  url: '/foo',
  loadChildren: './foo/foo.module#FooModule'
};

...

  imports: [
    UIRouterModule.forRoot({ states: [ futureFooState  ] }),
...
```

In your nested module, add a state named `foo` (without the `.**`). This
nested module's `foo` state will replace the `foo.**` Future State (placeholder).

```js
export var fooState = {
  name: 'foo',
  url: '/foo',
  resolve: {
    fooData: fooResolveFn
  },
  onEnter: onEnterFooFn,
  data: {
    requiresAuth: true
  }
};

...

  imports: [
    UIRouterModule.forChild({ states: [ fooState ] }),
...
```

This change works by providing the same DI token as the `@angular/router`
which is then analyzed for lazy loading by `@ngtools/webpack`.
The `ROUTES` token is deep imported from `@angular/router/src/router_config_loader`.
The module's states are provided on the ROUTES token, which enables the
webpack tooling to analyze the states, looking for `loadChildren`.

When the UMD bundle is built, the ROUTES token is pulled in from
`@angular/router` (and duplicated), but should not be used by anything.

Because we pull in the token from the `@angular/router` package, we have
a temporary dependency on the angular router.  This is a temporary hack
until the `@ngtools/webpack` project makes itself router-agnostic.



### Bug Fixes

* **#3087:** deep rxjs imports ([964c99f](https://github.com/ui-router/ng2/commit/964c99f))
* **build:** bump ng2 deps and remove prepublish step ([c6628fa](https://github.com/ui-router/ng2/commit/c6628fa))
* **lazyLoad:** Update lazyLoad for ui-router-core 3.1 ([2a4b174](https://github.com/ui-router/ng2/commit/2a4b174))
* **loadNgModule:** Better error message when lazy loaded NgModule contains no state defs ([7d4ac6d](https://github.com/ui-router/ng2/commit/7d4ac6d))
* **location:** Do not deep import `vanilla.*` from `ui-router-core` ([19113ee](https://github.com/ui-router/ng2/commit/19113ee))
* **location:** make initial otherwise('/') activate state (perform url sync) ([33ae6a8](https://github.com/ui-router/ng2/commit/33ae6a8))
* **uiSrefActive:** Allow ng-if on nested uiSrefs ([e3051f5](https://github.com/ui-router/ng2/commit/e3051f5)), closes [#3046](https://github.com/ui-router/ng2/issues/3046)
* **params:** Fix typed parameters by auto-flushing the param type queue ([6241bca](https://github.com/ui-router/ng2/commit/6241bca)), closes [#14](https://github.com/ui-router/ng2/issues/14)
* **ui-router-rx:** Fix ui-router-rx plugin name ([a1855ab](https://github.com/ui-router/ng2/commit/a1855ab))


### Features

* BC: We no longer ship commonjs in the npm package.   We now ship esm+es5 (individual files) and UMD bundles only. ([34ea6ad](https://github.com/ui-router/ng2/commit/34ea6ad))
* BC: You no longer configure a module using an Injectable `UIRouterConfig` class. Now you use a function that receives the `UIRouter` and the `Injector` ([9aae71a](https://github.com/ui-router/ng2/commit/9aae71a))
* **UIRouterConfig:** Use a simple function to configure module instead of an injectable class ([9aae71a](https://github.com/ui-router/ng2/commit/9aae71a))
* **AoT:** Enable AoT with Lazy Loading. Enable Angular CLI support. ([eb5d599](https://github.com/ui-router/ng2/commit/eb5d599))
* **build:** Generate bundle using rollup instead of webpack ([42b0f16](https://github.com/ui-router/ng2/commit/42b0f16))
* **bundles:** Point package.json main: to the umd bundle. Stop shipping commonjs. ([34ea6ad](https://github.com/ui-router/ng2/commit/34ea6ad))
* **lazyLoad:** Allow `loadChildren:` sugar on a state definition ([2a4b174](https://github.com/ui-router/ng2/commit/2a4b174))
* **lazyLoad:** automatically unwrap default export (`__esModule`) (allows easier default export of NgModule) ([2a4b174](https://github.com/ui-router/ng2/commit/2a4b174))
* **lazyLoad:** Support passing callback to lazyLoad for loading ng2 module ([#3037](https://github.com/ui-router/ng2/issues/3037)) ([a0688ae](https://github.com/ui-router/ng2/commit/a0688ae))
* **UrlService:** Add UrlService injectable ([33ae6a8](https://github.com/ui-router/ng2/commit/33ae6a8)), closes [#17](https://github.com/ui-router/ng2/issues/17)
* **rx:** Move reactive extension to its own project at http://github.com/ui-router/rx ([b0a672f](https://github.com/ui-router/ng2/commit/b0a672f))


## BREAKING CHANGES

## BREAKING CHANGE:  We no longer ship commonjs in the npm package.   We now ship esm+es5 (individual files) and UMD bundles only.

This brings ui-router-ng2 npm package in line with how the core Angular 2 packages are packaged.

We compile and distribute esm+es5 + typescript typings in `lib/` (formerly in `lib-esm/`)
We *no longer include the commonjs+es5* (formerly in `lib/`)
We now point the `main:` entry to the UMD bundle for commonjs users.

## BREAKING CHANGE: You no longer configure a module using an Injectable `UIRouterConfig` class. Now you use a function that receives the `UIRouter` and the `Injector`

In 1.0.0-beta.3 you might have a config class like this:
```js
export class MyUIRouterConfig {
  constructor(@Inject(UIRouter) router: UIRouter, @Inject(SomeService) myService: SomeService) {
    // do something with router and injected service
  }
}

which was wired into the root module like this:
```js
@NgModule({
  imports: [
    UIRouterModule.forRoot({ configClass: MyUIRouterConfig })
  ]
})
export class AppModule {}
```

In 1.0.0-beta.4 you should switch to a simple function.
The function receives the router: `UIRouter` and injector: `Injector`
```js
export function configureModule(router: UIRouter, injector: Injector) {
  // do something with router
  router.urlService.rules.type('slug', slugParamType);
  // inject other services
  const myService: SomeService = injector.get(SomeService);
  // do something injected service
  myService.init();
}
```

which is now wired using `config: configureModule` instead of `configClass: ...`
```js
@NgModule({
  imports: [
    UIRouterModule.forRoot({ configClass: MyUIRouterConfig })
  ]
})
export class AppModule {}
```



### ui-router-core changes
This `1.0.0-beta.4` release of `ui-router-ng2` updates `ui-router-core` from `1.0.0-beta.3` to `4.0.0`
# [4.0.0](https://github.com/ui-router/core/compare/1.0.0-beta.3...4.0.0) (2017-01-22)


### Bug Fixes

* **lazyLoad:** Allow `lazyLoad` stateBuilder: Get lazyLoad fn from internal State object, not StateDeclaration ([9313880](https://github.com/ui-router/core/commit/9313880))
* **lazyLoad:** Fix `State.lazyLoad` type def ([9313880](https://github.com/ui-router/core/commit/9313880))
* **lazyLoad:** Sync by URL after nested lazy load triggered by URL ([1c6220c](https://github.com/ui-router/core/commit/1c6220c))
* **lazyLoad:** Use UrlService.match() to retry url sync after successful lazy load triggered by url ([8c2461d](https://github.com/ui-router/core/commit/8c2461d)), closes [#19](https://github.com/ui-router/core/issues/19)
* **onBefore:** Skip remaining hooks after the ([#2](https://github.com/ui-router/core/issues/2)) ([8a45d04](https://github.com/ui-router/core/commit/8a45d04))
* **param:** `params: { foo: { raw: true } }` overrides `ParamType.raw` ([aefeabf](https://github.com/ui-router/core/commit/aefeabf))
* **Param:** Mark all query parameters as optional ([7334d98](https://github.com/ui-router/core/commit/7334d98))
* **params:** Check for null in `int` param type `is()` check ([aa551e4](https://github.com/ui-router/core/commit/aa551e4)), closes [#3197](https://github.com/ui-router/core/issues/3197)
* **pushStateLocation:** call listeners in url() ([#24](https://github.com/ui-router/core/issues/24)) ([7c90911](https://github.com/ui-router/core/commit/7c90911)), closes [#23](https://github.com/ui-router/core/issues/23)
* **redirect:** Do not allow `onBefore` hooks to cause infinite redirect loops ([5c5f7eb](https://github.com/ui-router/core/commit/5c5f7eb)), closes [#6](https://github.com/ui-router/core/issues/6)
* **redirectTo:** Do not puke when redirectTo returns undefined ([bde9c0f](https://github.com/ui-router/core/commit/bde9c0f))
* **redirectTo:** fix TS type signature of `redirectTo` ([2c059c4](https://github.com/ui-router/core/commit/2c059c4))
* **resolve:** Allow resolve's state context to be injected as `$state$` ([a06948b](https://github.com/ui-router/core/commit/a06948b))
* **StateQueueManager:** Compare parsed url parameters using typed parameters ([beca1f5](https://github.com/ui-router/core/commit/beca1f5))
* **StateRegistry:** Fix error message: State '' is already defined ([f5bd96b](https://github.com/ui-router/core/commit/f5bd96b))
* **StateService:** Compare typed parameters in .is() and .includes() ([b1a5155](https://github.com/ui-router/core/commit/b1a5155))
* **TargetState:** Narrow `name()` return type to `String` ([a02f4a7](https://github.com/ui-router/core/commit/a02f4a7))
* **Transition:** Use { location: replace } when redirecting a transtition in response to a URL sync ([23e2b78](https://github.com/ui-router/core/commit/23e2b78))
* **typescript:** Emit TS 1.8 compatible .d.ts files ([65badf4](https://github.com/ui-router/core/commit/65badf4))
* **typings:** Allow urlRouter.rule to return void ([0b78bdf](https://github.com/ui-router/core/commit/0b78bdf))
* **UrlRouter:** Use { location: 'replace' } whenever a url redirect happens ([6cf9b8f](https://github.com/ui-router/core/commit/6cf9b8f))
* **UrlService:** Wire urlMatcherFactory and urlRouter functions ([a7b58d6](https://github.com/ui-router/core/commit/a7b58d6))
* **vanilla:** vanilla locations: do not parse "empty string" query key parameter ([f949480](https://github.com/ui-router/core/commit/f949480))
* **view:** Load view prerequisites in `onFinish` ([cc85e76](https://github.com/ui-router/core/commit/cc85e76))
* **view.load:** Allow view.load to return synchronously ([8619cf9](https://github.com/ui-router/core/commit/8619cf9))


### Features

* BC: (CoreServices) Move `location` and `locationConfig` from `services` to `UIRouter.locationService` and `UIRouter.locationConfig`. ([029fb00](https://github.com/ui-router/core/commit/029fb00))
* BC: Built-in `string` parameter type no longer encodes slashes as `~2F` nor tildes as `~~` ([72bb2d8](https://github.com/ui-router/core/commit/72bb2d8))
* BC: Path/Query parameters no longer default to `string` param type ([72bb2d8](https://github.com/ui-router/core/commit/72bb2d8))
* BC: Hook errors are all normalized to a "Rejection" type.  To access the  detail of the error thrown (`throw "Error 123"`), use `.detail`, i.e.: ([f486ced](https://github.com/ui-router/core/commit/f486ced))
* BC: Move `html5Mode` and `hashPrefix` from `LocationServices` to `LocationConfig` interface ([9d316a7](https://github.com/ui-router/core/commit/9d316a7))
* BC: move `ViewService.viewConfigFactory` and `rootContext`  to `_pluginapi.*` ([65badf4](https://github.com/ui-router/core/commit/65badf4))
* BC: Move html5Mode and hashPrefix to LocationServices from LocationConfig ([f7ac2bb](https://github.com/ui-router/core/commit/f7ac2bb))
* BC: Order URL Matching Rules by priority, not registration order ([eb2f5d7](https://github.com/ui-router/core/commit/eb2f5d7))
* BC: Previously, a state with a `lazyLoad` function was considered a future state. ([ec50da4](https://github.com/ui-router/core/commit/ec50da4))
* BC: Remove `getResolveValue` and `getResolvable`  methods from `Transition` in favor of `injector().get()` and `injector().getAsync()` ([111d259](https://github.com/ui-router/core/commit/111d259))
* BC: Replace `LocationServices.setUrl` with `LocationServices.url` ([4c39dcb](https://github.com/ui-router/core/commit/4c39dcb))
* BC: Replace UrlRouterProvider/UrlRouter with just UrlRouter ([fddd1e2](https://github.com/ui-router/core/commit/fddd1e2))
* Create router.dispose() to dispose a router instance and resources. ([0690917](https://github.com/ui-router/core/commit/0690917))
* **assertMap:** Add a [].map() helper that asserts that each element is truthy ([f044f53](https://github.com/ui-router/core/commit/f044f53))
* **core:** Export all vanilla.* code from `ui-router-core` ([f3392d1](https://github.com/ui-router/core/commit/f3392d1))
* **futureState:** States with a `.**` name suffix (i.e., `foo.**`) are considered future states ([ec50da4](https://github.com/ui-router/core/commit/ec50da4))
* **globals:** Removed `UIRouterGlobals` interface. Renamed `Globals` class to `UIRouterGlobals` ([8719334](https://github.com/ui-router/core/commit/8719334))
* **hash:** Change the hash parameter type (`'#'`) to `inherit: false` so it is cleared out when another transition occurs. ([849f84f](https://github.com/ui-router/core/commit/849f84f)), closes [#3245](https://github.com/ui-router/core/issues/3245) [#3218](https://github.com/ui-router/core/issues/3218) [#3017](https://github.com/ui-router/core/issues/3017)
* **HookBuilder:** Allow custom hook types (to be defined by a plugin) ([3f146e6](https://github.com/ui-router/core/commit/3f146e6))
* **lazyLoad:** Created `StateService.lazyLoad` method to imperatively lazy load a state ([ec50da4](https://github.com/ui-router/core/commit/ec50da4)), closes [#8](https://github.com/ui-router/core/issues/8)
* **lazyLoad:** Exported/exposed the `lazyLoadState` function ([ec50da4](https://github.com/ui-router/core/commit/ec50da4))
* **lazyLoad:** the `lazyLoad` hook can be used to lazy load anything (component code, etc) ([ec50da4](https://github.com/ui-router/core/commit/ec50da4)), closes [#4](https://github.com/ui-router/core/issues/4)
* **LocationServices:** Add a `parts()` method which returns the URL parts as an object ([32e64f0](https://github.com/ui-router/core/commit/32e64f0))
* **onCreate:** Add onCreate transition hook ([f486ced](https://github.com/ui-router/core/commit/f486ced))
* **Params:** Add `path` and `query` param types ([72bb2d8](https://github.com/ui-router/core/commit/72bb2d8))
* **Params:** add option to use generic type for Transition.params ([#17](https://github.com/ui-router/core/issues/17)) ([eb12ec8](https://github.com/ui-router/core/commit/eb12ec8)), closes [#16](https://github.com/ui-router/core/issues/16)
* **Params:** Allow `inherit: false` specified per parameter or type ([849f84f](https://github.com/ui-router/core/commit/849f84f))
* **Plugin:** Allow all plugins to be gotted. ([e324973](https://github.com/ui-router/core/commit/e324973))
* **Plugin:** Allow registration by ES6 class, JS constructor fn, JS factory fn ([b9f4541](https://github.com/ui-router/core/commit/b9f4541))
* **Plugin:** Create plugin API ([36a5215](https://github.com/ui-router/core/commit/36a5215)), closes [#7](https://github.com/ui-router/core/issues/7)
* **Resolve:** implement NOWAIT policy: Do not wait for resolves before completing a transition. ([05d4c73](https://github.com/ui-router/core/commit/05d4c73)), closes [#3243](https://github.com/ui-router/core/issues/3243) [#2691](https://github.com/ui-router/core/issues/2691)
* **State:** add .parameters() option for filtering to matching keys ([beca1f5](https://github.com/ui-router/core/commit/beca1f5))
* **Transition:** Allow plugins to define own transition events like `onEnter` ([0dc2c19](https://github.com/ui-router/core/commit/0dc2c19))
* **Transition:** Add Transition.originalTransition() to return the initial transition in a chain of redirects ([4fe39e3](https://github.com/ui-router/core/commit/4fe39e3))
* **Transition:** Allow `injector()` to retrieve resolves for the exiting states/path ([df502e8](https://github.com/ui-router/core/commit/df502e8))
* **Transition:** Allow a plain object `ResolvableLiteral` in `Transition.addResolvable` ([ad9ae81](https://github.com/ui-router/core/commit/ad9ae81))
* **Transition:** Make Transition.params() immutable to avoid confusion about mutability ([0162212](https://github.com/ui-router/core/commit/0162212))
* **Transition:** Support treechange paths in API for Resolve+transition ([beedc82](https://github.com/ui-router/core/commit/beedc82))
* **UIRouter:** Add `trace` global to the `UIRouter` object ([48c5af6](https://github.com/ui-router/core/commit/48c5af6))
* **UrlMatcher:** Add comparison function by UrlMatcher specificity ([eb2f5d7](https://github.com/ui-router/core/commit/eb2f5d7))
* **UrlRouter:** sort url rules by specificity, not by registration order. ([eb2f5d7](https://github.com/ui-router/core/commit/eb2f5d7))
* **UrlService:** allow eager or lazy binding of location objects during construction ([7e0a8af](https://github.com/ui-router/core/commit/7e0a8af))
* **UrlServices:** Add `match()`: given a URL, return the best matching Url Rule ([32e64f0](https://github.com/ui-router/core/commit/32e64f0))
* **vanilla:** Implement in-memory-only location api ([f64aace](https://github.com/ui-router/core/commit/f64aace))
* **View:** Allow targeting views on own state using `viewname@.` (normalizeUIViewTarget) ([7078216](https://github.com/ui-router/core/commit/7078216)), closes [#25](https://github.com/ui-router/core/issues/25)


## BREAKING CHANGES

## BREAKING CHANGE: Renamed Globals class to UIRouterGlobals (removed UIRouterGlobals interface)

This change will likely only affect a small subset of typescript users and probably only those using `ui-router-ng2`.
If you're injecting the `Globals` class somewhere, e.g.:
```
@Injectable()
class MyService {
  _globals: UIRouterGlobals;
  constructor(globals: Globals) {
    this._globals = <UIRouterGlobals> globals;
  }
}
```
you should now inject `UIRouterGlobals`, e.g.:
```
@Injectable()
class MyService {
  constructor(public globals: UIRouterGlobals) { }
}
```

Likewise, if you were casting the `UIRouter.globals` object as a `UIRouterGlobals`, it is no longer necessary:

```js
function myHook(trans: Transition) {
  let globals: UIRouterGlobals = trans.router.globals; // cast is no longer necessary
}
```

Closes https://github.com/ui-router/core/issues/31

## BREAKING CHANGE: Hook errors are all normalized to a "Rejection" type.  To access the  detail of the error thrown (`throw "Error 123"`), use `.detail`, i.e.:
### Before
```js
$state.go('foo').catch(err => { if (err === "Error 123") .. });
```
### New way
```js
$state.go('foo').catch(err => { if (err.detail === "Error 123") .. });
```

## BREAKING CHANGE: Order URL Matching Rules by priority, not registration order

URL Rules can come from registered states' `.url`s, calling `.when()`, or calling `.rule()`.
It's possible that two or more URL Rules could match the URL.

### Previously

Previously, url rules were matched in the order in which they were registered.
The rule which was registered first would handle the URL change.

### Now

Now, the URL rules are sorted according to a sort function.
More specific rules are preferred over less specific rules

### Why

It's possible to have multiple url rules that match a given URL.
Consider the following states:

 - `{ name: 'books', url: '/books/index' }''`
 - `{ name: 'book', url: '/books/:bookId' }''`

Both states match when the url is `/books/index`.
Additionally, you might have some custom url rewrite rules such as:

 `.when('/books/list', '/books/index')`.

The `book` state also matches when the rewrite rule is matched.

Previously, we simply used the first rule that matched.  However, now that lazy loading is officially supported, it can be difficult for developers to ensure the rules are registered in the right order.

Instead, we now prioritize url rules by how specific they are.  More specific rules are matched earlier than less specific rules.
We split the path on `/`.  A static segment (such as `index` in the example) is more specific than a parameter (such as`:bookId`).

### More Details

The built-in rule sorting function (see `UrlRouter.defaultRuleSortFn`) sorts rules in this order:

- Explicit priority: `.when('/foo', '/bar', { priority: 1 })` (default priority is 0)
- Rule Type:
  - UrlMatchers first (registered states and `.when(string, ...)`)
  - then regular Expressions (`.when(regexp, ...)`)
  - finally, everything else (`.rule()`)
- UrlMatcher specificity: static path segments are more specific than variables (see `UrlMatcher.compare`)
- Registration order (except for UrlMatcher based rules)

For complete control, a custom sort function can be registered with `UrlService.rules.sort(sortFn)`

### Query params

Because query parameters are optional, they are not considered during sorting.
For example, both these rules will match when the url is `'/foo/bar'`:

```
.when('/foo/bar', doSomething);
.when('/foo/bar?queryparam', doSomethingElse);
```

To choose the most specific rule, we match both rules, then choose the rule with the "best ratio" of matched optional parameters (see `UrlRuleFactory.fromUrlMatcher`)

This allows child states to be defined with only query params for a URL.
The state only activates when the query parameter is present.

```
.state('parent', { url: '/parent' });
.state('parent.child', { url: '?queryParam' });
```

## Restoring the previous behavior

For backwards compatibility, register a sort function which sorts by the registration order:

```js
myApp.config(function ($urlServiceProvider) {

  function sortByRegistrationOrder(a, b) {
   return a.$id - b.$id;
  }

  $urlServiceProvider.rules.sort(sortByRegistrationOrder);

});
```

## BREAKING CHANGE: Replace `LocationServices.setUrl` with `LocationServices.url`

This makes `url()` a getter/setter.  It also adds the optional `state` parameter to pass through to the browser history when using pushstate.
End users should not notice this change, but plugin authors may.

## BREAKING CHANGE: Replace UrlRouterProvider/UrlRouter with just UrlRouter

The configuration functions from the provider object have been integrated into the normal UrlRouter object.
The `UIRouter` object no longer has a `uriRouterProvider`, but the equivalent functions can be found on `uiRouter`

One difference between the old functions on `urlRouterProvider` and the new ones on `uriRouter` is that new functions do not accept injectable functions.

## BREAKING CHANGE: Built-in `string` parameter type no longer encodes slashes as `~2F` nor tildes as `~~`

Previously, the `string` parameter type pre-encoded tilde chars (`~`) as two tilde chars (`~~`) and slashes (`/`) as `~2F`.

Now, the `string` parameter type does not pre-encode slashes nor tildes.
If you rely on the previous encoding, create a custom parameter type that implements the behavior:

```js
urlMatcherFactory.type('tildes', {
  encode: (val: any) =>
      val != null ? val.toString().replace(/(~|\/)/g, m => ({ '~': '~~', '/': '~2F' }[m])) : val;
  decode: (val: string) =>
      val != null ? val.toString().replace(/(~~|~2F)/g, m => ({ '~~': '~', '~2F': '/' }[m])) : val;
  pattern: /[^/]*/
});
```

## BREAKING CHANGE: Remove `getResolveValue` and `getResolvable`  methods from `Transition` in favor of `injector().get()` and `injector().getAsync()`

In beta.3, the Transition APIs: `injector()`, `getResolvable`, and `getResolveValue` duplicated functionality.

Instead of:
```js
trans.getResolveValue('myResolve');
```
use:
```js
trans.injector().get('myResolve')
```

## BREAKING CHANGE: (CoreServices) Move `location` and `locationConfig` from `services` to `UIRouter.locationService` and `UIRouter.locationConfig`.

The core `services` object is a mutable object which each framework was monkey patching.
This change removes the requirement to monkey patch a global mutable object.
Instead, framework implementors should pass the `LocationServices` and `LocationConfig` implementations into the `UIRouter` constructor.

### End Users

End users who were accessing `services.location` or `services.locationConfig` should access these off the `UIRouter` instance instead.

## BREAKING CHANGE: Move `html5Mode` and `hashPrefix` from `LocationServices` to `LocationConfig` interface

### End users should not notice

## BREAKING CHANGE: move `ViewService.viewConfigFactory` and `rootContext`  to `_pluginapi.*`
This BC happened in commit 6c42285

## BREAKING CHANGE: Move html5Mode and hashPrefix to LocationServices from LocationConfig

## BREAKING CHANGE: Future States names must end with `.**`, i.e., `foo.bar.**`

Previously, a state with a `lazyLoad` function was considered a future state.
Now, a state whose name ends with `.**` (i.e., a glob pattern which matches all children) is a future state.

### All future states should be given a name that ends in `.**`.

Change your future states from:
```
{ name: 'future', url: '/future', lazyLoad: () => ... }
```
to:
```
{ name: 'future.**', url: '/future', lazyLoad: () => ... }
```

## BREAKING CHANGE: Path/Query parameters no longer default to `string` param type

Previously, if a url parameter's type  was not specified (in either the path or query), it defaulted to the `string` type.

Now, path parameters default to the new `path` type and query parameters default to the new `query` type.





<a name="1.0.0-beta.3"></a>
# [1.0.0-beta.3 commits](https://github.com/angular-ui/ui-router/compare/1.0.0-beta.2...1.0.0-beta.3) (2016-09-23)

[Read more on the blog](https://ui-router.github.io/blog/uirouter-1.0.0-beta.3/)

This release adds Angular 2.0.0 final support.
It changes the NgModule mechanism to use `UIRouterModule.forRoot()` and `UIRouterModule.forChild()`.
See the blog and the breaking changes section.

### Bug Fixes

This release fixes bugs for both ng1 and ng2

* **common:** Remove `url()` from LocationService interface ([#2990](https://github.com/angular-ui/ui-router/issues/2990)) ([d6c2580](https://github.com/angular-ui/ui-router/commit/d6c2580))
* **lazyLoad:** Always delete the lazy load promise after it settles. ([dd2f101](https://github.com/angular-ui/ui-router/commit/dd2f101))
* **ng1.StateProvider:** Export StateProvider class so type can be used ([167770d](https://github.com/angular-ui/ui-router/commit/167770d))
* **ng1.uiView:** Remove deprecated jquery functions bind/unbind in favor of on/off ([60ebd44](https://github.com/angular-ui/ui-router/commit/60ebd44))
* **ng2:** Angular 2.0.0 final compatibility ([7c54b75](https://github.com/angular-ui/ui-router/commit/7c54b75)), closes [#2991](https://github.com/angular-ui/ui-router/issues/2991)
* **ng2.NgModule:** Allow apps with no forChild modules ([d3bd332](https://github.com/angular-ui/ui-router/commit/d3bd332)), closes [#3009](https://github.com/angular-ui/ui-router/issues/3009)
* **ng2.uiView:** Use ReflectorReader to get component inputs
* **resolve:** Don't re-resolve data when redirected to same state, but only dynamic params changed. ([98cd2d2](https://github.com/angular-ui/ui-router/commit/98cd2d2)), closes [#3033](https://github.com/angular-ui/ui-router/issues/3033)
* **trace:** Show function definition during logging of trace.enable('HOOK') ([190d122](https://github.com/angular-ui/ui-router/commit/190d122))
* **transition:** Fail a transition if a new one has started while resolves are loading ([bc87d9e](https://github.com/angular-ui/ui-router/commit/bc87d9e)), closes [#2972](https://github.com/angular-ui/ui-router/issues/2972)
* **urlMatcherFactory:** fix tilde edge case with "string" encoding ([#3018](https://github.com/angular-ui/ui-router/issues/3018)) ([a201906](https://github.com/angular-ui/ui-router/commit/a201906))
* **viewService:** Allow root ui-view to be wrapped in ng-if ([32f718a](https://github.com/angular-ui/ui-router/commit/32f718a)), closes [#3004](https://github.com/angular-ui/ui-router/issues/3004)

### Features

* **StateBuilder:** Calculate parent state name when ends in two wildcards `**` ([b4621f3](https://github.com/angular-ui/ui-router/commit/b4621f3))


### BREAKING CHANGES

#### BC in Core
* Remove `UIInjector.native` infavor of `UIInjector.getNative()` ([d11b7dc](https://github.com/angular-ui/ui-router/commit/d11b7dc))
* Remove `stateProvider` from ui-router-core. Use `stateRegistry` and `stateService` in 88c6494
* We now enforce states with an explicit `parent:` may NOT ALSO specify a parent state in their name (i.e., `parent.child`)

#### BC in Angular 2

Major breaking changes for Angular 2 bootstrap between beta.2 and beta.3

- Removed `@UIRouterModule` decorator.
- Added `UIRouterModule.forRoot()` and `UIRouterModule.forChild()` factory methods
- See https://ui-router.github.io/docs/latest/classes/ng2.uiroutermodule.html

@NgModule({
  imports: [
    UIRouterModule.forRoot({
      states: INITIAL_STATES,
      useHash: true,
      configClass: MyUIRouterConfig
    }),
    BrowserModule,
    FeatureModule,
  ],
  declarations: INITIAL_COMPONENTS
})
class RootAppModule {}

@NgModule({
  imports: [
    UIRouterModule.forChild({
      states: FEATURE_STATES,
      configClass: FeatureConfig
    }),
    CommonModule,
  ],
  declarations: FEATURE_COMPONENTS
})


<a name="1.0.0-beta.2"></a>
# [1.0.0-beta.2 commits](https://github.com/angular-ui/ui-router/compare/1.0.0-beta.1...1.0.0-beta.2) (2016-09-09)

[Read more on the blog](https://ui-router.github.io/blog/uirouter-1.0.0-beta.2/)

### Features

#### Core

* **lazyLoad:** Add state.lazyLoad hook to lazy load a tree of states ([bef5257](https://github.com/angular-ui/ui-router/commit/bef5257)) ([8ecb6c6](https://github.com/angular-ui/ui-router/commit/8ecb6c6)), closes [#146](https://github.com/angular-ui/ui-router/issues/146) [#2739](https://github.com/angular-ui/ui-router/issues/2739)
* **StateRegistry:** Add `deregister` method. ([44579ec](https://github.com/angular-ui/ui-router/commit/44579ec)), closes [#1095](https://github.com/angular-ui/ui-router/issues/1095) [#2711](https://github.com/angular-ui/ui-router/issues/2711)
* **redirectTo:** Process `redirectTo` property of a state as a redirect string/object/hook function ([6becb12](https://github.com/angular-ui/ui-router/commit/6becb12)), closes [#27](https://github.com/angular-ui/ui-router/issues/27) [#948](https://github.com/angular-ui/ui-router/issues/948)
* **redirect:** Error after 20+ redirected transitions ([88052bf](https://github.com/angular-ui/ui-router/commit/88052bf))
* **rejectFactory:** separate transition aborted and transition errored reject types ([55995fd](https://github.com/angular-ui/ui-router/commit/55995fd))
* **Resolve:** support ng2-like provide object literals ([a7e5ea6](https://github.com/angular-ui/ui-router/commit/a7e5ea6))
* **Resolve:** Switch state.resolve to be an array of Resolvables ([6743a60](https://github.com/angular-ui/ui-router/commit/6743a60))
* **Transition:** Add the transition source (url/sref) to TransitionOptions ([5d42d79](https://github.com/angular-ui/ui-router/commit/5d42d79))
* **Transition:** Added `getResolvable(token)` method ([3aee2b7](https://github.com/angular-ui/ui-router/commit/3aee2b7))
* **Transition:** expose the current `UiRouter` object as a public property ([52f1308](https://github.com/angular-ui/ui-router/commit/52f1308))
* **Transition:** expose the transition rejection reason as `Transition.error()` ([7a9e383](https://github.com/angular-ui/ui-router/commit/7a9e383)), closes [#2866](https://github.com/angular-ui/ui-router/issues/2866)
* **Transition:** Expose the transition's TargetState as targetState() ([f06f6b6](https://github.com/angular-ui/ui-router/commit/f06f6b6))
* **urlRouter:** Allow a rule to be deleted. ([55f3d3d](https://github.com/angular-ui/ui-router/commit/55f3d3d))

#### ng2
* **ng2.rx:** Added RxJS Observables for transitions and states: ([2a2f381](https://github.com/angular-ui/ui-router/commit/2a2f381))
* **ng2:** Add [@UIRouterModule](https://github.com/UIRouterModule) decorator ([e7bedc2](https://github.com/angular-ui/ui-router/commit/e7bedc2)), closes [#2922](https://github.com/angular-ui/ui-router/issues/2922)
* **ng2:** Improve ng2 bootstrap flexibility with provideUIRouter() provider factory function ([bc17066](https://github.com/angular-ui/ui-router/commit/bc17066)), closes [#2958](https://github.com/angular-ui/ui-router/issues/2958)
* **ng2.UrlRouter:** Implement { location: replace } ([b8c6146](https://github.com/angular-ui/ui-router/commit/b8c6146)), closes [#2850](https://github.com/angular-ui/ui-router/issues/2850)
* **ng2.NgModule:** Add module's states to DI using UIROUTER_STATES_TOKEN ([0cb628e](https://github.com/angular-ui/ui-router/commit/0cb628e))
* **ng2.stateRegistry:** Automatically register states defined on a UIRouterModule ([58a3c84](https://github.com/angular-ui/ui-router/commit/58a3c84))
* **ng2.UIView:** Use merged NgModule/ParentComp to inject routed component ([37241e7](https://github.com/angular-ui/ui-router/commit/37241e7))
* **ng2.upgrade:** Enable ng1-to-ng2 ([0bf4eb4](https://github.com/angular-ui/ui-router/commit/0bf4eb4))
* **uiView:** Support Components loaded via AppModule ([696148f](https://github.com/angular-ui/ui-router/commit/696148f))


### Bug Fixes

#### Core

* **defaultErrorHandler:** Invoke handler when a transition is Canceled. ([4fcccd8](https://github.com/angular-ui/ui-router/commit/4fcccd8)), closes [#2924](https://github.com/angular-ui/ui-router/issues/2924)
* **defaultErrorHandler:** log Error and Error.stack by default ([e102a85](https://github.com/angular-ui/ui-router/commit/e102a85))
* **defaultErrorHandler:** Reduce console.error noise when redirected ([8c0344f](https://github.com/angular-ui/ui-router/commit/8c0344f))
* **common:** Add concrete import to interface.ts to fix unit tests ([2d16740](https://github.com/angular-ui/ui-router/commit/2d16740))
* **redirect:** fix bug where redirected transitions with reload: true got wrong resolve values copied ([bd0e3a3](https://github.com/angular-ui/ui-router/commit/bd0e3a3))
* **redirectTo:** fix redirectTo definition (interface) ([eff7195](https://github.com/angular-ui/ui-router/commit/eff7195)), closes [#2871](https://github.com/angular-ui/ui-router/issues/2871)
* **Rejection:** Silence "Error: Uncaught (in Exception)" ([38432f4](https://github.com/angular-ui/ui-router/commit/38432f4)), closes [#2676](https://github.com/angular-ui/ui-router/issues/2676)
* **Resolve:** prevent RXWAIT from waiting for the observable to complete ([a02caf3](https://github.com/angular-ui/ui-router/commit/a02caf3))
* **ResolvePolicy:** Fix resolve policy config loading ([4440811](https://github.com/angular-ui/ui-router/commit/4440811)), closes [#2945](https://github.com/angular-ui/ui-router/issues/2945)
* **stateService:** change reloadState parameter in reload function is optional ([#2973](https://github.com/angular-ui/ui-router/issues/2973)) ([839dc4a](https://github.com/angular-ui/ui-router/commit/839dc4a))
* **StateService:** remove jQuery deprecated feature ([fa40acc](https://github.com/angular-ui/ui-router/commit/fa40acc))
* **trace:** make TRANSITION trace less noisy when a transition is redirected ([a65c58f](https://github.com/angular-ui/ui-router/commit/a65c58f))
* **Trace:** Fix error in console after $trace.enable() ([013c77a](https://github.com/angular-ui/ui-router/commit/013c77a)), closes [#2752](https://github.com/angular-ui/ui-router/issues/2752)
* **transitionHook:** Prevent queued hookFn to be called if deregistered ([#2939](https://github.com/angular-ui/ui-router/issues/2939)) ([39e1ba7](https://github.com/angular-ui/ui-router/commit/39e1ba7)), closes [#2928](https://github.com/angular-ui/ui-router/issues/2928)
* **typescript:** Make UI-Router `noImplicitAny` safe. ([0769bc2](https://github.com/angular-ui/ui-router/commit/0769bc2)), closes [#2693](https://github.com/angular-ui/ui-router/issues/2693)
* **typescript:** Remove angular1 specific types from ui-router-core methods ([30124bd](https://github.com/angular-ui/ui-router/commit/30124bd)), closes [#2693](https://github.com/angular-ui/ui-router/issues/2693)


#### ng1

* **ng1.stateService:** Coerce 'null' `params` value to empty object ([f674151](https://github.com/angular-ui/ui-router/commit/f674151)), closes [#2952](https://github.com/angular-ui/ui-router/issues/2952)
* **ng1.uiSref:** Allow nested UISrefs by stopping event propagation on-click ([b4a2499](https://github.com/angular-ui/ui-router/commit/b4a2499)), closes [#2962](https://github.com/angular-ui/ui-router/issues/2962)
* **ng1.uiSrefActive:** update sref-active after existing transition-in-progress completes ([0994c71](https://github.com/angular-ui/ui-router/commit/0994c71)), closes [#2908](https://github.com/angular-ui/ui-router/issues/2908)
* **uiSref, uiState:** added click unbind to prevent memory leaks ([79d501e](https://github.com/angular-ui/ui-router/commit/79d501e))
* **uiView:** separate $uiView and $uiViewAnim element.data() ([a94117d](https://github.com/angular-ui/ui-router/commit/a94117d)), closes [#2763](https://github.com/angular-ui/ui-router/issues/2763)

#### ng2

* **ng2.pushState:** Properly match urls when base path set ([b9be2dc](https://github.com/angular-ui/ui-router/commit/b9be2dc)), closes [#2745](https://github.com/angular-ui/ui-router/issues/2745)
* **ng2.UIRouterConfig:** Allow new UIRouter() to finish before configuring it ([a151f71](https://github.com/angular-ui/ui-router/commit/a151f71))
* **ng2.uiSrefActive:** Allow uiSrefActive on ancestor element. ([874fc07](https://github.com/angular-ui/ui-router/commit/874fc07)), closes [#2950](https://github.com/angular-ui/ui-router/issues/2950)
* **ng2.uiSrefActive:** don't puke on sref to invalid target state ([c9b6570](https://github.com/angular-ui/ui-router/commit/c9b6570))
* **ng2.UISrefActive:** Use [@ContentChildren](https://github.com/ContentChildren) to query for the nested UISref ([999c42a](https://github.com/angular-ui/ui-router/commit/999c42a)), closes [#2950](https://github.com/angular-ui/ui-router/issues/2950)
* **ng2.UiView:** fix input resolve binding ([4f53f81](https://github.com/angular-ui/ui-router/commit/4f53f81))
* **ng2.UIView:** Make routed to component appear *inside* UIView, not next to it. ([558fc80](https://github.com/angular-ui/ui-router/commit/558fc80))

### BREAKING CHANGES:

1) State Glob patterns have been changed slightly.

Previously, a single wildcard `foo.*` could match "missing segments" on the end of a state name.
For example, `foo.*` would match the state `foo`.
Likewise, `foo.*.*.*` would also match the `foo` state.

Now, a single wildcard matches exactly one segment.
`foo.*` will match `foo.bar` and `foo.baz`, but neither `foo` nor `foo.bar.baz`.

If you previously relied on the single wildcard to match missing segments, use a double wildcard, `foo.**`.

Double wildcards match 0 or more segments.

[Read more about Glob matching](https://ui-router.github.io/docs/latest/classes/common.glob.html)

2) (obscure) Angular 1 DI token `ng1UIRouter` renamed to `$uiRouter`

3) (obscure) Renamed `Transition.previous()` to `Transition.redirectedFrom()`


<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1 commits](https://github.com/angular-ui/ui-router/compare/1.0.0-alpha.5...1.0.0-beta.1) (2016-06-30)

# UI-Router 1.0 is in beta

## UI-Router has a new home!

https://ui-router.github.io/new-ui-router-site/


# BREAKING CHANGES

These breaking changes are for users upgrading from a previous alpha, not from 0.x legacy series.
This list is extensive, but typical users won't be affected by most of these changes.

The most common breaks will be #1 and #2

1) BC-BREAK: renamed all Ui* (lowercase 'i') symbols to UI* (uppercase 'I') for more consistent naming.
   - UiView -> UIView
   - UiSref -> UISref (and related directives)
   - UiInjector -> UIInjector

2) BC-BREAK: Transition Hooks are no longer injected (onBefore/onStart/onExit/onRetain/onEnter/onFinish/onSuccess/onError)

   Previously, a hook like `['$state', ($state) => $state.target('foo')]` would get `$state` injected.
   Now, all hooks receive two parameters:
   - transition: the current Transition, which has an `injector()` function
   - state: for onEnter/onRetain/onExit hooks only, the State which the hook is being run for. This value will be null for onBefore/onStart/onFinish/onSuccess/onError hooks.

   Refactor your hooks
   from: `['$state', 'mySvc', ($state, mySvc) => mySvc.foo() ? $state.target('foo')] : true`
   to: `(trans) => trans.injector().get('mySvc').foo() ? trans.router.stateService.target('foo') : true`

   Note: for backwards compatiblity, angular 1 onEnter/onExit/onRetain hooks are still injected

3) BC-BREAK: - The (internal API) State object's .resolve property is now an array of Resolvables, built from your state definitions by the StateBuilder

4) BC-BREAK: - Removed the default resolve called `$resolve$`, which was added in a previous alpha

5) BC-BREAK: - `Transition.addResolves()`  replaced with `Transition.addResolvable()`

6) BC-BREAK: remove `ResolveContext.getResolvables()` in favor of `.getToken()`` and `.getResolvable()`

7) BC-BREAK: remove `ResolveContext.invokeLater()` and `.invokeNow()`

8) BC-BREAK: remove support for `JIT` resolves.  This also eliminated the need for the `loadAllControllerLocals` hook which was also removed

9) BC-BREAK: Replaced `ViewConfig.node` with `ViewConfig.path`. Angular 1's `$(element).data('$uiView')` is affected. 
   Previously the .node was the node for the view. Now the last element in the path is the node for the view.

10) BC-BREAK: Nodes no longer have (stateful) `.resolveContext` properties. Instead, a new ResolveContext is wrapped over a Path of Nodes.  Removed `PathFactory.bindResolveContexts()`.

11) BC-BREAK: ResolveContext.resolvePath returns a promise for resolved data as an array of tuples, instead of a promise for an object of resolved data.  Removed `ResolveContext.resolvePathElement()`.

12) BC-BREAK: Removed ResolvePolicy enum in favor of the ResolvePolicy interface `{ when: "", async: "" }`

13) BC-BREAK: renamed `ResolveContext.isolateRootTo` to `subContext`

14) BC-BREAK: rename `UIRouterGlobals` class to `Globals`; add `UIRouterGlobals` back as an interface

15) BC-BREAK: Moved `defaultErrorHandler` from `TransitionService` to `StateService`




### Features

* **Resolve:** Switch state.resolve to be an array of Resolvables ([6743a60](https://github.com/angular-ui/ui-router/commit/6743a60))
* **Resolve:** support ng2-like provide object literals.  Support injection of arbitrary tokens, not just strings. ([a7e5ea6](https://github.com/angular-ui/ui-router/commit/a7e5ea6))
* **Resolve:** support ng2-like provide object literals ([a7e5ea6](https://github.com/angular-ui/ui-router/commit/a7e5ea6))
* **Transition:** expose the current `UiRouter` object as a public property ([52f1308](https://github.com/angular-ui/ui-router/commit/52f1308))
* **redirectTo:** Process `redirectTo` property of a state as a redirect string/object/hook function ([6becb12](https://github.com/angular-ui/ui-router/commit/6becb12)), closes [#27](https://github.com/angular-ui/ui-router/issues/27) [#948](https://github.com/angular-ui/ui-router/issues/948)
* **rejectFactory:** separate transition aborted and transition errored reject types ([55995fd](https://github.com/angular-ui/ui-router/commit/55995fd))
* **ParamType:** allow a custom parameter Type to specify a default value for a parameter's `dynamic` property
* **Resolvable:** Added a new Resolve Policy 'RXWAIT'.  If an Observable is returned, pass the observable as the value, but also wait for it to emit its first value

### Bug Fixes

* **ng2.pushState:** Properly match urls when base path set ([b9be2dc](https://github.com/angular-ui/ui-router/commit/b9be2dc)), closes [#2745](https://github.com/angular-ui/ui-router/issues/2745)
* **ng2.UIRouterConfig:** Allow new UIRouter() to finish before configuring it ([a151f71](https://github.com/angular-ui/ui-router/commit/a151f71))
* **ng2.UiView:** fix input resolve binding ([4f53f81](https://github.com/angular-ui/ui-router/commit/4f53f81))
* **ng2.UIView:** Make routed to component appear *inside* UIView, not next to it. ([558fc80](https://github.com/angular-ui/ui-router/commit/558fc80))
* **redirect:** fix bug where redirected transitions with reload: true got wrong resolve values copied ([bd0e3a3](https://github.com/angular-ui/ui-router/commit/bd0e3a3))
* **Rejection:** Silence "Error: Uncaught (in Exception)" ([38432f4](https://github.com/angular-ui/ui-router/commit/38432f4)), closes [#2676](https://github.com/angular-ui/ui-router/issues/2676)
* **Trace:** Fix error in console after $trace.enable() ([013c77a](https://github.com/angular-ui/ui-router/commit/013c77a)), closes [#2752](https://github.com/angular-ui/ui-router/issues/2752)
* **ng2.UIView:** Trigger change detection once for routed components




<a name="1.0.0-alpha.5"></a>
# [1.0.0-alpha.5 commits](https://github.com/angular-ui/ui-router/compare/1.0.0-alpha.4...1.0.0-alpha.5) (2016-05-13)


### Bug Fixes

## Core
* **attachRoute:** Do not update URL after syncing from url([8742511](https://github.com/angular-ui/ui-router/commit/8742511)), closes [#2730](https://github.com/angular-ui/ui-router/issues/2730)
* **common:** only use window if available([32ff988](https://github.com/angular-ui/ui-router/commit/32ff988))
* **coreservices:** Use Promise.reject()/resolve()/all()([62b2ebc](https://github.com/angular-ui/ui-router/commit/62b2ebc)), closes [#2683](https://github.com/angular-ui/ui-router/issues/2683)
* **paramTypes.hash:** Update hash for each transition([79d4fd7](https://github.com/angular-ui/ui-router/commit/79d4fd7)), closes [#2742](https://github.com/angular-ui/ui-router/issues/2742)
* **Rejection:** Dont log an ignored trans as console.error([7522c26](https://github.com/angular-ui/ui-router/commit/7522c26)), closes [#2676](https://github.com/angular-ui/ui-router/issues/2676)
* **resolve:** Fix regression; Allow resolve values to be service names([a34fd3b](https://github.com/angular-ui/ui-router/commit/a34fd3b)), closes [#2588](https://github.com/angular-ui/ui-router/issues/2588)
* **StateQueueManager:** Do not throw on orphan states.([95ae0cf](https://github.com/angular-ui/ui-router/commit/95ae0cf)), closes [#2546](https://github.com/angular-ui/ui-router/issues/2546)
* **TransitionManager:** Update url even when the Transition is ignored.([f9c3e3c](https://github.com/angular-ui/ui-router/commit/f9c3e3c)), closes [#2723](https://github.com/angular-ui/ui-router/issues/2723)

## ng1
* **ng1.component:** Allow route-to-component "@" and optional bindings([71b3393](https://github.com/angular-ui/ui-router/commit/71b3393)), closes [#2708](https://github.com/angular-ui/ui-router/issues/2708)
* **view:** only run ng1 route-to-component code if component: is a string([ec1c534](https://github.com/angular-ui/ui-router/commit/ec1c534))

## ng2
* **ng2.uiSrefStatus:** Avoid "dehydrated detector" error([9111727](https://github.com/angular-ui/ui-router/commit/9111727)), closes [#2684](https://github.com/angular-ui/ui-router/issues/2684)
* **ng2.uiView:** Fix "Invalid left-hand in assignment"([3f711a1](https://github.com/angular-ui/ui-router/commit/3f711a1))
* **build:** declare external dep on `angular/core` in webpack bundle([adfbde3](https://github.com/angular-ui/ui-router/commit/adfbde3)), closes [#2687](https://github.com/angular-ui/ui-router/issues/2687)



### Features

## ng2
* **ng2.uiView:** bind resolve data to input[] and [@Input](https://github.com/Input)(), process bindings:([f6dae28](https://github.com/angular-ui/ui-router/commit/f6dae28))
* **ng2.urlRouter:** HTML5 PushState support([9842fb7](https://github.com/angular-ui/ui-router/commit/9842fb7)), closes [#2688](https://github.com/angular-ui/ui-router/issues/2688)
* **ng2.UIRouter:** update to ng2 beta.17([45c0758](https://github.com/angular-ui/ui-router/commit/45c0758))
* **ng2.UIRouter:** Update ui-router for ng2 rc.1([3219406](https://github.com/angular-ui/ui-router/commit/3219406)), closes [#2722](https://github.com/angular-ui/ui-router/issues/2722)



<a name="1.0.0-alpha.4"></a>
# [1.0.0-alpha.4 commits](https://github.com/angular-ui/ui-router/compare/1.0.0-alpha.3...1.0.0-alpha.4) (2016-04-06)

### Bug Fixes

* **ng2.uiView:** Fix "Invalid left-hand in assignment" ([3f711a1](https://github.com/angular-ui/ui-router/commit/3f711a1))
* **view:** only run ng1 route-to-component code if component: is a string ([ec1c534](https://github.com/angular-ui/ui-router/commit/ec1c534))

### Features

* **uiView:** add support for hybrid ng1/ng2 ui-router apps via ng-upgrade and http://github.com/ui-router/ng1-to-ng2
* **ng2.uiView:** bind resolve data to input[] and @Input(), process bindings: ([f6dae28](https://github.com/angular-ui/ui-router/commit/f6dae28))



<a name="1.0.0-alpha.2"></a>
# [1.0.0-alpha.2](https://github.com/angular-ui/ui-router/compare/1.0.0-alpha.1...v1.0.0-alpha.2) (2016-04-03)

Changes between 1.0.0-alpha.1 and 1.0.0-alpha.2

## Angular 2
This is the first release with angular 2 support.  See http://github.com/ui-router/quickstart-ng2 for a small ui-router-ng2 app

### Bug Fixes

* **ViewHooks:** Avoid calling $onInit if angular 1.5 will call it for us ([d42b617](https://github.com/angular-ui/ui-router/commit/d42b617)), closes [#2660](https://github.com/angular-ui/ui-router/issues/2660)
* **ViewHooks:** Fix problem with injecting uiCanExit ([76ab22d](https://github.com/angular-ui/ui-router/commit/76ab22d)), closes [#2661](https://github.com/angular-ui/ui-router/issues/2661)
* **view:** temporary sanity check that a node exists ([1c0edeb](https://github.com/angular-ui/ui-router/commit/1c0edeb)), closes [#2657](https://github.com/angular-ui/ui-router/issues/2657)
* **justjs.$q:** Fix $q.all([..]) and $q.all({...}) ([b1624c6](https://github.com/angular-ui/ui-router/commit/b1624c6))
* **ng2.uiSref:** Fix anchor href generation ([98b5b42](https://github.com/angular-ui/ui-router/commit/98b5b42))
* **ng2.uiSrefStatus:** calculate target state parameters ([46cdf4c](https://github.com/angular-ui/ui-router/commit/46cdf4c))
* **ng2.uiView:** Dispose prev comp on empty viewconfig ([f28e0c3](https://github.com/angular-ui/ui-router/commit/f28e0c3))

### Features

* **UIRouterConfig:** Define UIRouterConfig class for router bootstrap ([c16b9e6](https://github.com/angular-ui/ui-router/commit/c16b9e6))
* **UIRouterGlobals:** Create UIRouterGlobals ([0eb7406](https://github.com/angular-ui/ui-router/commit/0eb7406)), closes [#2525](https://github.com/angular-ui/ui-router/issues/2525)
* **ui-router-ng2:** Update providers and viewsBuilder to match new 1.0 API ([ff54d61](https://github.com/angular-ui/ui-router/commit/ff54d61))
* **ng2.uiSrefActive:** Implement uiSrefStatus, uiSrefActive, uiSrefActiveEq ([fcb15c5](https://github.com/angular-ui/ui-router/commit/fcb15c5))



<a name="1.0.0-alpha.1"></a>
# [1.0.0-alpha.1 commits](https://github.com/angular-ui/ui-router/compare/1.0.0alpha0...1.0.0-alpha.1) (2016-03-27)

## We will maintain a list of [Known BC from 0.2.x to 1.0 final](https://github.com/angular-ui/ui-router/issues/2219) to help people upgrade to the 1.0 release.

## Bug fixes and features since 1.0.0alpha0

### Bug Fixes

* **date:** Compare dates only using year, month, date ([7a68ade](https://github.com/angular-ui/ui-router/commit/7a68ade)), closes [#2484](https://github.com/angular-ui/ui-router/issues/2484)
* **params:** Clone all properties of a Node. Introduce applyRawParams() ([88c624d](https://github.com/angular-ui/ui-router/commit/88c624d))
* **RejectFactory:** stringify rejections with circular dependency-aware stringify ([199db79](https://github.com/angular-ui/ui-router/commit/199db79)), closes [#2538](https://github.com/angular-ui/ui-router/issues/2538)
* **src/resolve:** use injector's strictDi value in calls to .annotate ([4c5b5d8](https://github.com/angular-ui/ui-router/commit/4c5b5d8))
* **stateQueueManager:** Use `location: true` for url-matched transitions ([25e0c04](https://github.com/angular-ui/ui-router/commit/25e0c04)), closes [#2455](https://github.com/angular-ui/ui-router/issues/2455)
* **stateService:** Process reload: in the StateService.target() ([081da32](https://github.com/angular-ui/ui-router/commit/081da32)), closes [#2537](https://github.com/angular-ui/ui-router/issues/2537)
* **Transition:** Do not reuse resolves for reloaded state during redirect ([0c123c3](https://github.com/angular-ui/ui-router/commit/0c123c3)), closes [#2539](https://github.com/angular-ui/ui-router/issues/2539)
* **Transition:** Reject Transition promise when onBefore error ([4b6d56f](https://github.com/angular-ui/ui-router/commit/4b6d56f)), closes [#2561](https://github.com/angular-ui/ui-router/issues/2561)
* **Transition:** Reset URL to current state after aborted transition ([3a1308b](https://github.com/angular-ui/ui-router/commit/3a1308b)), closes [#2611](https://github.com/angular-ui/ui-router/issues/2611)
* **transition/transitionService:** uses console.error to log error in default error handler ([43a8fc5](https://github.com/angular-ui/ui-router/commit/43a8fc5))
* **ui-sref:** update ui-sref-active/eq info when params change ([dcbaebf](https://github.com/angular-ui/ui-router/commit/dcbaebf)), closes [#2554](https://github.com/angular-ui/ui-router/issues/2554)
* **ui-state:** update ui-sref-active/eq info ([025ebc8](https://github.com/angular-ui/ui-router/commit/025ebc8)), closes [#2488](https://github.com/angular-ui/ui-router/issues/2488)
* **UrlMatcher:** Format parent/child UrlMatchers properly ([86e07ef](https://github.com/angular-ui/ui-router/commit/86e07ef)), closes [##2504](https://github.com/#/issues/2504)
* **UrlMatcher:** isOptional always false for empty parameter ([4e85db4](https://github.com/angular-ui/ui-router/commit/4e85db4))

### Features

* **params:** Add uiOnParamsChanged controller callback ([961c96d](https://github.com/angular-ui/ui-router/commit/961c96d)), closes [#2608](https://github.com/angular-ui/ui-router/issues/2608) [#2470](https://github.com/angular-ui/ui-router/issues/2470) [#2391](https://github.com/angular-ui/ui-router/issues/2391) [#1967](https://github.com/angular-ui/ui-router/issues/1967)
* **resolve:** Allow all resolved data for a node to be injected as `$resolve$` ([e432c27](https://github.com/angular-ui/ui-router/commit/e432c27))
* **state:** Expose the internal state API via `$$state()` ([92053f1](https://github.com/angular-ui/ui-router/commit/92053f1)), closes [#13](https://github.com/angular-ui/ui-router/issues/13)
* **ui-router-ng2:** Initial angular2 support ([217de70](https://github.com/angular-ui/ui-router/commit/217de70))
* **uiCanExit:** Add controller lifecycle hook "uiCanExit" ([afcfe95](https://github.com/angular-ui/ui-router/commit/afcfe95))
* **uiView:** Expose the resolved data for a state as $scope.$resolve ([0f6aea6](https://github.com/angular-ui/ui-router/commit/0f6aea6)), closes [#2175](https://github.com/angular-ui/ui-router/issues/2175) [#2547](https://github.com/angular-ui/ui-router/issues/2547)
* **uiView:** Fire the $onInit hook ([c8afc38](https://github.com/angular-ui/ui-router/commit/c8afc38)), closes [#2559](https://github.com/angular-ui/ui-router/issues/2559)
* **uiView:** Put $animate promises on element.data('$uiView') ([a5578de](https://github.com/angular-ui/ui-router/commit/a5578de)), closes [#2562](https://github.com/angular-ui/ui-router/issues/2562) [#2579](https://github.com/angular-ui/ui-router/issues/2579)
* **view:** Route a view to a directive using `component:` ([1552032](https://github.com/angular-ui/ui-router/commit/1552032)), closes [#2627](https://github.com/angular-ui/ui-router/issues/2627)



## Other commits

Many of these commits are merged from 0.2.x `legacy` branch

* **uiSrefActive:** allow multiple classes ([120d7ad](https://github.com/angular-ui/ui-router/commit/120d7ad)), closes [#2481](https://github.com/angular-ui/ui-router/issues/2481) [#2482](https://github.com/angular-ui/ui-router/issues/2482)
* **justjs:** provide naive implementation of most of the coreservices api ([426f134](https://github.com/angular-ui/ui-router/commit/426f134))
* **resolve:** add $resolve service back to 1.0 ([70c6659](https://github.com/angular-ui/ui-router/commit/70c6659))
* **uiSrefActive:** allow active & active-eq on same element ([d9a676b](https://github.com/angular-ui/ui-router/commit/d9a676b)), closes [#1997](https://github.com/angular-ui/ui-router/issues/1997)
* **uiSrefActive:** provide a ng-{class,style} like interface ([a9ff6fe](https://github.com/angular-ui/ui-router/commit/a9ff6fe)), closes [#1431](https://github.com/angular-ui/ui-router/issues/1431)
* **uiSrefActive:** Added support for multiple nested uiSref directives ([b184494](https://github.com/angular-ui/ui-router/commit/b184494))
* **uiState:** add ui-state directive ([3831af1](https://github.com/angular-ui/ui-router/commit/3831af1)), closes [#395](https://github.com/angular-ui/ui-router/issues/395) [#900](https://github.com/angular-ui/ui-router/issues/900) [#1932](https://github.com/angular-ui/ui-router/issues/1932)
* **urlMatcher:** add support for optional spaces ([4b7f304](https://github.com/angular-ui/ui-router/commit/4b7f304))
* **urlMatcher:** Add param only type names ([6a371f9](https://github.com/angular-ui/ui-router/commit/6a371f9))
* **$IncludedByStateFilter:** add parameters to $IncludedByStateFilter ([963f6e7](https://github.com/angular-ui/ui-router/commit/963f6e7)), closes [#1735](https://github.com/angular-ui/ui-router/issues/1735)
* **$state:** make state data inheritance prototypical ([c4fec8c](https://github.com/angular-ui/ui-router/commit/c4fec8c))
* **$state:** Inject templateProvider with resolved values ([afa20f2](https://github.com/angular-ui/ui-router/commit/afa20f2))
* **$state:** added 'state' to state reload method (feat no.1612) ([b8f0457](https://github.com/angular-ui/ui-router/commit/b8f0457))
* **$state:** broadcast $stateChangeCancel event when event.preventDefault() is called in $sta ([ecefb75](https://github.com/angular-ui/ui-router/commit/ecefb75))
* **$state:** inject resolve params into controllerProvider ([b380c22](https://github.com/angular-ui/ui-router/commit/b380c22)), closes [#1131](https://github.com/angular-ui/ui-router/issues/1131)
* **$state:** support URLs with #fragments ([3da0a17](https://github.com/angular-ui/ui-router/commit/3da0a17))
* **$uiViewScroll:** change function to return promise ([c2a9a31](https://github.com/angular-ui/ui-router/commit/c2a9a31)), closes [#1702](https://github.com/angular-ui/ui-router/issues/1702)



<a name="0.2.18"></a>
### 0.2.18 (2016-02-07)

This is a maintenance release which fixes a few known bugs introduced in 0.2.16.

#### Bug Fixes

* **$urlRouter:** revert BC: resolve clashing of routes This reverts commit b5c57c8ec2e14e17e75104 ([2f1ebefc](https://github.com/angular-ui/ui-router/commit/2f1ebefc242ff48960e0bf63da359296a38f6852), closes [#2501](https://github.com/angular-ui/ui-router/issues/2501))
* **uiState:** Corrected typo for 'ref' variable (#2488, #2508) ([b8f3c144](https://github.com/angular-ui/ui-router/commit/b8f3c144b913e620f177b78f3b4f52afa61d41a6))
* **$urlMatcherFactory:** Fix to make the YUI Javascript compressor work ([ad9c41d2](https://github.com/angular-ui/ui-router/commit/ad9c41d2e723d50e30dd3452fbd274b7057dc3d9))
* **stateBuilder:** fix non-url params on a state without a url. The parameters are now applied when ([d6d8c332](https://github.com/angular-ui/ui-router/commit/d6d8c3322c4dde8bb5b8dde25f9fcda49e9c4c81), closes [#2025](https://github.com/angular-ui/ui-router/issues/2025))
* **ui-view:** (ui-view) use static renderer when no animation is present for a ui-view ([2523bbdb](https://github.com/angular-ui/ui-router/commit/2523bbdb5542483a489c22804f1751b8b9f71703), closes [#2485](https://github.com/angular-ui/ui-router/issues/2485)). This allows a ui-view scope to be destroyed when switching states, before the next view is initialized.


#### Features

* **ui-view:** Add noanimation attribute to specify static renderer. ([2523bbdb](https://github.com/angular-ui/ui-router/commit/2523bbdb5542483a489c22804f1751b8b9f71703), closes [#2485](https://github.com/angular-ui/ui-router/issues/2485)). This allows a ui-view scope to be destroyed before the next ui-view is initialized, when ui-view animation is not present.


<a name="0.2.17"></a>
### 0.2.17 (2016-01-25)


#### Bug Fixes

* **uiSrefActive:** allow multiple classes ([a89114a0](https://github.com/angular-ui/ui-router/commit/a89114a083813c1a7280c48fc18e626caa5a31f4), closes [#2481](https://github.com/angular-ui/ui-router/issues/2481), [#2482](https://github.com/angular-ui/ui-router/issues/2482))


<a name="0.2.16"></a>
### 0.2.16 (2016-01-24)


#### Bug Fixes

* **$state:** 
  * statechangeCancel: Avoid infinite digest in .otherwise/redirect case. Don't clobber url if a new transition has started.  Closes #222 ([e00aa695](https://github.com/angular-ui/ui-router/commit/e00aa695e41ddc5ebd5d2b226aa0917a751b11aa), closes [#2238](https://github.com/angular-ui/ui-router/issues/2238))
  * transitionTo: Allow hash (#) value to be read as toParams['#'] in events.  Re-add the saved hash before broadcasting $stateChangeStart event.  ([8c1bf30d](https://github.com/angular-ui/ui-router/commit/8c1bf30d2a3b78ba40b330f12d854c885d6cc117))
* **$stateParams:** Fix for testing: reset service instance between tests ([2aeb0c4b](https://github.com/angular-ui/ui-router/commit/2aeb0c4b205baf6cfa2ef25bb986bb160dc13bf9))
* **$urlRouter:** 
  * Sort URL rules by specificity. Potential minor BC if apps were relying on rule registration order.  ([b5c57c8e](https://github.com/angular-ui/ui-router/commit/b5c57c8ec2e14e17e75104c1424654f126ea4011))
  * Use $sniffer for pushstate compat check ([c219e801](https://github.com/angular-ui/ui-router/commit/c219e801797f340ef9c5c919ab890ef003a7a042))
* **UrlMatcher:**
  * Properly encode/decode slashes in parameters Closes #2172 Closes #2250 Closes #1 ([02e98660](https://github.com/angular-ui/ui-router/commit/02e98660a80dfd1ca4b113dd24ee304af91e9f8c), closes [#2339](https://github.com/angular-ui/ui-router/issues/2339))
  * Array types:  Fix default value for array query parameters.  Pass empty arrays through in handler. ([20d6e243](https://github.com/angular-ui/ui-router/commit/20d6e243f1745ddbf257217245a1dc22eabe13da), closes [#2222](https://github.com/angular-ui/ui-router/issues/2222))
  * Remove trailing slash, if parameter is optional and was squashed from URL ([77fa11bf](https://github.com/angular-ui/ui-router/commit/77fa11bf0787d0f6da97ab0003ab29afb7411391), closes [#1902](https://github.com/angular-ui/ui-router/issues/1902))
  * Allow a parameter declaration to configure the parameter type by name. closes #2294 ([e4010249](https://github.com/angular-ui/ui-router/commit/e40102492d40fe1cf6ba14d955fcc9f345c16458))
  * include the slash when recognizing squashed params in url ([b5130bb1](https://github.com/angular-ui/ui-router/commit/b5130bb1215e15f832ea6daa670410b9a950c0d4), closes [#2064](https://github.com/angular-ui/ui-router/issues/2064))
  * Allow url query param names to contain periods ([d31b3337](https://github.com/angular-ui/ui-router/commit/d31b3337cc2ce71d87c92fdded629e46558d0b49))
* **reloadOnSearch:** Update `locals.globals.$stateParams` when reloadOnSearch=false ([350d3e87](https://github.com/angular-ui/ui-router/commit/350d3e87783a2263fd7d23913da34f1268c3300b), closes [#2356](https://github.com/angular-ui/ui-router/issues/2356))
* **ui-view:** 
  * fix $animate usage for ng 1.4+ ([9b6d9a2d](https://github.com/angular-ui/ui-router/commit/9b6d9a2d0ce4ae08384165cb517bddea59b67892))
  * change $viewContentLoading to pair with $viewContentLoaded ([f9b43d66](https://github.com/angular-ui/ui-router/commit/f9b43d66833f0e17de41fd8d1cc3b491e3ba4a0e), closes [#685](https://github.com/angular-ui/ui-router/issues/685))
  * $destroy event is triggered before animation ends ([1be13795](https://github.com/angular-ui/ui-router/commit/1be13795686ab78abb2d5094bc8addcacb928975))
* **uiSref:** 
  * Ensure URL once param checks pass ([9dc31c54](https://github.com/angular-ui/ui-router/commit/9dc31c5465328e5666468b0c2319ce205f4b72f8), closes [#2091](https://github.com/angular-ui/ui-router/issues/2091))
  * uiSrefActive: update the active classes after linking directive ([7c914030](https://github.com/angular-ui/ui-router/commit/7c914030f13e05e45a941c1b723cb785db729890))


#### Features

* **$IncludedByStateFilter:** add parameters to $IncludedByStateFilter ([963f6e71](https://github.com/angular-ui/ui-router/commit/963f6e71633b9c3a266f3991d79089b7d14786b4), closes [#1735](https://github.com/angular-ui/ui-router/issues/1735))
* **isStateFilter:** Include optional state params. ([71d74699](https://github.com/angular-ui/ui-router/commit/71d7469987ee9ca86a41c8c6393ccd5d8913c3d6))
* **$state:** make state data inheritance prototypical ([c4fec8c7](https://github.com/angular-ui/ui-router/commit/c4fec8c7998113902af4152d716c42dada6eb465))
* **$stateChangeStart:** Add options to event ([a1f07559](https://github.com/angular-ui/ui-router/commit/a1f07559ec74e10ff80bc4be81f287e3772b8fcb))
* **UrlMatcher:** Add param only type names ([6a371f9b](https://github.com/angular-ui/ui-router/commit/6a371f9b70e37a82eb324122879e4473c3f6d526))
* **uiSrefActive:**
  * provide a ng-{class,style} like interface ([a9ff6feb](https://github.com/angular-ui/ui-router/commit/a9ff6febb469e0d5cd49054216c4472df7a6259d))
  * allow active & active-eq on same element ([d9a676ba](https://github.com/angular-ui/ui-router/commit/d9a676ba2c4d9e954be224c60496bcb38f6074e3))
* **uiState:** add ui-state directive ([3831af1d](https://github.com/angular-ui/ui-router/commit/3831af1dc71b601351e6694af0665a77297f8f7f), closes [#395](https://github.com/angular-ui/ui-router/issues/395), [#900](https://github.com/angular-ui/ui-router/issues/900), [#1932](https://github.com/angular-ui/ui-router/issues/1932))
* **urlMatcher:** add support for optional spaces in params ([4b7f3046](https://github.com/angular-ui/ui-router/commit/4b7f304617f0b3590b532103b5c2fb526c98a9e4))


<a name="0.2.15"></a>
### 0.2.15 (2015-05-19)


#### Bug Fixes

* **$state:** reloadOnSearch should not affect non-search param changes. ([6ca0d770](https://github.com/angular-ui/ui-router/commit/6ca0d7704cf7de9c6e6b7bb64df2f9c68fe081cc), closes [#1079](https://github.com/angular-ui/ui-router/issues/1079))
* **urlMatcherFactory:** Revert to 0.2.13 behavior where all string parameters are considered optional fi ([495a02c3](https://github.com/angular-ui/ui-router/commit/495a02c3cbde501c1c149bce137806669209bc29), closes [#1963](https://github.com/angular-ui/ui-router/issues/1963))
* **urlRouter:** allow .when() to redirect, even after a successful $state.go() - This partially  ([48aeaff6](https://github.com/angular-ui/ui-router/commit/48aeaff645baf3f42f5a8940ebd97563791ad9f8), closes [#1584](https://github.com/angular-ui/ui-router/issues/1584))


#### Features

* **$state:** Inject templateProvider with resolved values ([afa20f22](https://github.com/angular-ui/ui-router/commit/afa20f22373b7176b26daa7e1099750c4254a354))


<a name="0.2.14"></a>
### 0.2.14 (2015-04-23)


#### Bug Fixes

* **$StateRefDirective:** resolve missing support for svg anchor elements #1667 ([0149a7bb](https://github.com/angular-ui/ui-router/commit/0149a7bb38b7af99388a1ad7cc9909a7b7c4439d))
* **$urlMatcherFactory:**
  * regex params should respect case-sensitivity ([1e10519f](https://github.com/angular-ui/ui-router/commit/1e10519f3be6bbf0cefdcce623cd2ade06e649e5), closes [#1671](https://github.com/angular-ui/ui-router/issues/1671))
  * unquote all dashes from array params ([06664d33](https://github.com/angular-ui/ui-router/commit/06664d330f882390655dcfa83e10276110d0d0fa))
  * add Type.$normalize function ([b0c6aa23](https://github.com/angular-ui/ui-router/commit/b0c6aa2350fdd3ce8483144774adc12f5a72b7e9))
  * make optional params regex grouping optional ([06f73794](https://github.com/angular-ui/ui-router/commit/06f737945e83e668d09cfc3bcffd04a500ff1963), closes [#1576](https://github.com/angular-ui/ui-router/issues/1576))
* **$state:** allow about.*.** glob patterns ([e39b27a2](https://github.com/angular-ui/ui-router/commit/e39b27a2cb7d88525c446a041f9fbf1553202010))
* **uiSref:**
  * use Object's toString instead of Window's toString ([2aa7f4d1](https://github.com/angular-ui/ui-router/commit/2aa7f4d139dbd5b9fcc4afdcf2ab6642c87f5671))
  * add absolute to allowed transition options ([ae1b3c4e](https://github.com/angular-ui/ui-router/commit/ae1b3c4eedc37983400d830895afb50457c63af4))
* **uiSrefActive:** Apply active classes on lazy loaded states ([f0ddbe7b](https://github.com/angular-ui/ui-router/commit/f0ddbe7b4a91daf279c3b7d0cee732bb1f3be5b4))
* **uiView:** add `$element` to locals for view controller ([db68914c](https://github.com/angular-ui/ui-router/commit/db68914cd6c821e7dec8155bd33142a3a97f5453))


#### Features

* **$state:**
  * support URLs with #fragments ([3da0a170](https://github.com/angular-ui/ui-router/commit/3da0a17069e27598c0f9d9164e104dd5ce05cdc6))
  * inject resolve params into controllerProvider ([b380c223](https://github.com/angular-ui/ui-router/commit/b380c223fe12e2fde7582c0d6b1ed7b15a23579b), closes [#1131](https://github.com/angular-ui/ui-router/issues/1131))
  * added 'state' to state reload method (feat no.1612)  - modiefied options.reload  ([b8f04575](https://github.com/angular-ui/ui-router/commit/b8f04575a8557035c1858c4d5c8dbde3e1855aaa))
  * broadcast $stateChangeCancel event when event.preventDefault() is called in $sta ([ecefb758](https://github.com/angular-ui/ui-router/commit/ecefb758cb445e41620b62a272aafa3638613d7a))
* **$uiViewScroll:** change function to return promise ([c2a9a311](https://github.com/angular-ui/ui-router/commit/c2a9a311388bb212e5a2e820536d1d739f829ccd), closes [#1702](https://github.com/angular-ui/ui-router/issues/1702))
* **uiSrefActive:** Added support for multiple nested uiSref directives ([b1844948](https://github.com/angular-ui/ui-router/commit/b18449481d152b50705abfce2493a444eb059fa5))


<a name="0.2.13"></a>
### 0.2.13 (2014-11-20)

This release primarily fixes issues reported against 0.2.12

#### Bug Fixes

* **$state:** fix $state.includes/.is to apply param types before comparisions fix(uiSref): ma ([19715d15](https://github.com/angular-ui/ui-router/commit/19715d15e3cbfff724519e9febedd05b49c75baa), closes [#1513](https://github.com/angular-ui/ui-router/issues/1513))
  * Avoid re-synchronizing from url after .transitionTo ([b267ecd3](https://github.com/angular-ui/ui-router/commit/b267ecd348e5c415233573ef95ebdbd051875f52), closes [#1573](https://github.com/angular-ui/ui-router/issues/1573))
* **$urlMatcherFactory:**
  * Built-in date type uses local time zone ([d726bedc](https://github.com/angular-ui/ui-router/commit/d726bedcbb5f70a5660addf43fd52ec730790293))
  * make date type fn check .is before running ([aa94ce3b](https://github.com/angular-ui/ui-router/commit/aa94ce3b86632ad05301530a2213099da73a3dc0), closes [#1564](https://github.com/angular-ui/ui-router/issues/1564))
  * early binding of array handler bypasses type resolution ([ada4bc27](https://github.com/angular-ui/ui-router/commit/ada4bc27df5eff3ba3ab0de94a09bd91b0f7a28c))
  * add 'any' Type for non-encoding non-url params ([3bfd75ab](https://github.com/angular-ui/ui-router/commit/3bfd75ab445ee2f1dd55275465059ed116b10b27), closes [#1562](https://github.com/angular-ui/ui-router/issues/1562))
  * fix encoding slashes in params ([0c983a08](https://github.com/angular-ui/ui-router/commit/0c983a08e2947f999683571477debd73038e95cf), closes [#1119](https://github.com/angular-ui/ui-router/issues/1119))
  * fix mixed path/query params ordering problem ([a479fbd0](https://github.com/angular-ui/ui-router/commit/a479fbd0b8eb393a94320973e5b9a62d83912ee2), closes [#1543](https://github.com/angular-ui/ui-router/issues/1543))
* **ArrayType:**
  * specify empty array mapping corner case ([74aa6091](https://github.com/angular-ui/ui-router/commit/74aa60917e996b0b4e27bbb4eb88c3c03832021d), closes [#1511](https://github.com/angular-ui/ui-router/issues/1511))
  * fix .equals for array types ([5e6783b7](https://github.com/angular-ui/ui-router/commit/5e6783b77af9a90ddff154f990b43dbb17eeda6e), closes [#1538](https://github.com/angular-ui/ui-router/issues/1538))
* **Param:** fix default value shorthand declaration ([831d812a](https://github.com/angular-ui/ui-router/commit/831d812a524524c71f0ee1c9afaf0487a5a66230), closes [#1554](https://github.com/angular-ui/ui-router/issues/1554))
* **common:** fixed the _.filter clone to not create sparse arrays ([750f5cf5](https://github.com/angular-ui/ui-router/commit/750f5cf5fd91f9ada96f39e50d39aceb2caf22b6), closes [#1563](https://github.com/angular-ui/ui-router/issues/1563))
* **ie8:** fix calls to indexOf and filter ([dcb31b84](https://github.com/angular-ui/ui-router/commit/dcb31b843391b3e61dee4de13f368c109541813e), closes [#1556](https://github.com/angular-ui/ui-router/issues/1556))


#### Features

* add json parameter Type ([027f1fcf](https://github.com/angular-ui/ui-router/commit/027f1fcf9c0916cea651e88981345da6f9ff214a))


<a name="0.2.12"></a>
### 0.2.12 (2014-11-13)

#### Bug Fixes

* **$resolve:** use resolve fn result, not parent resolved value of same name ([67f5e00c](https://github.com/angular-ui/ui-router/commit/67f5e00cc9aa006ce3fe6cde9dff261c28eab70a), closes [#1317], [#1353])
* **$state:**
  * populate default params in .transitionTo. ([3f60fbe6](https://github.com/angular-ui/ui-router/commit/3f60fbe6d65ebeca8d97952c05aa1d269f1b7ba1), closes [#1396])
  * reload() now reinvokes controllers ([73443420](https://github.com/angular-ui/ui-router/commit/7344342018847902594dc1fc62d30a5c30f01763), closes [#582])
  * do not emit $viewContentLoading if notify: false ([74255feb](https://github.com/angular-ui/ui-router/commit/74255febdf48ae082a02ca1e735165f2c369a463), closes [#1387](https://github.com/angular-ui/ui-router/issues/1387))
  * register states at config-time ([4533fe36](https://github.com/angular-ui/ui-router/commit/4533fe36e0ab2f0143edd854a4145deaa013915a))
  * handle parent.name when parent is obj ([4533fe36](https://github.com/angular-ui/ui-router/commit/4533fe36e0ab2f0143edd854a4145deaa013915a))
* **$urlMatcherFactory:**
  * register types at config ([4533fe36](https://github.com/angular-ui/ui-router/commit/4533fe36e0ab2f0143edd854a4145deaa013915a), closes [#1476])
  * made path params default value "" for backwards compat ([8f998e71](https://github.com/angular-ui/ui-router/commit/8f998e71e43a0b31293331c981f5db0f0097b8ba))
  * Pre-replace certain param values for better mapping ([6374a3e2](https://github.com/angular-ui/ui-router/commit/6374a3e29ab932014a7c77d2e1ab884cc841a2e3))
  * fixed ParamSet.$$keys() ordering ([9136fecb](https://github.com/angular-ui/ui-router/commit/9136fecbc2bfd4fda748a9914f0225a46c933860))
  * empty string policy now respected in Param.value() ([db12c85c](https://github.com/angular-ui/ui-router/commit/db12c85c16f2d105415f9bbbdeb11863f64728e0))
  * "string" type now encodes/decodes slashes ([3045e415](https://github.com/angular-ui/ui-router/commit/3045e41577a8b8b8afc6039f42adddf5f3c061ec), closes [#1119])
  * allow arrays in both path and query params ([fdd2f2c1](https://github.com/angular-ui/ui-router/commit/fdd2f2c191c4a67c874fdb9ec9a34f8dde9ad180), closes [#1073], [#1045], [#1486], [#1394])
  * typed params in search ([8d4cab69](https://github.com/angular-ui/ui-router/commit/8d4cab69dd67058e1a716892cc37b7d80a57037f), closes [#1488](https://github.com/angular-ui/ui-router/issues/1488))
  * no longer generate unroutable urls ([cb9fd9d8](https://github.com/angular-ui/ui-router/commit/cb9fd9d8943cb26c7223f6990db29c82ae8740f8), closes [#1487](https://github.com/angular-ui/ui-router/issues/1487))
  * handle optional parameter followed by required parameter in url format. ([efc72106](https://github.com/angular-ui/ui-router/commit/efc72106ddcc4774b48ea176a505ef9e95193b41))
  * default to parameter string coersion. ([13a468a7](https://github.com/angular-ui/ui-router/commit/13a468a7d54c2fb0751b94c0c1841d580b71e6dc), closes [#1414](https://github.com/angular-ui/ui-router/issues/1414))
  * concat respects strictMode/caseInsensitive ([dd72e103](https://github.com/angular-ui/ui-router/commit/dd72e103edb342d9cf802816fe127e1bbd68fd5f), closes [#1395])
* **ui-sref:**
  * Allow sref state options to take a scope object ([b5f7b596](https://github.com/angular-ui/ui-router/commit/b5f7b59692ce4933e2d63eb5df3f50a4ba68ccc0))
  * replace raw href modification with attrs. ([08c96782](https://github.com/angular-ui/ui-router/commit/08c96782faf881b0c7ab00afc233ee6729548fa0))
  * nagivate to state when url is "" fix($state.href): generate href for state with  ([656b5aab](https://github.com/angular-ui/ui-router/commit/656b5aab906e5749db9b5a080c6a83b95f50fd91), closes [#1363](https://github.com/angular-ui/ui-router/issues/1363))
  * Check that state is defined in isMatch() ([92aebc75](https://github.com/angular-ui/ui-router/commit/92aebc7520f88babdc6e266536086e07263514c3), closes [#1314](https://github.com/angular-ui/ui-router/issues/1314), [#1332](https://github.com/angular-ui/ui-router/issues/1332))
* **uiView:**
  * allow inteprolated ui-view names ([81f6a19a](https://github.com/angular-ui/ui-router/commit/81f6a19a432dac9198fd33243855bfd3b4fea8c0), closes [#1324](https://github.com/angular-ui/ui-router/issues/1324))
  * Made anim work with angular 1.3 ([c3bb7ad9](https://github.com/angular-ui/ui-router/commit/c3bb7ad903da1e1f3c91019cfd255be8489ff4ef), closes [#1367](https://github.com/angular-ui/ui-router/issues/1367), [#1345](https://github.com/angular-ui/ui-router/issues/1345))
* **urlRouter:** html5Mode accepts an object from angular v1.3.0-rc.3 ([7fea1e9d](https://github.com/angular-ui/ui-router/commit/7fea1e9d0d8c6e09cc6c895ecb93d4221e9adf48))
* **stateFilters:** mark state filters as stateful. ([a00b353e](https://github.com/angular-ui/ui-router/commit/a00b353e3036f64a81245c4e7898646ba218f833), closes [#1479])
* **ui-router:** re-add IE8 compatibility for map/filter/keys ([8ce69d9f](https://github.com/angular-ui/ui-router/commit/8ce69d9f7c886888ab53eca7e53536f36b428aae), closes [#1518], [#1383])
* **package:** point 'main' to a valid filename ([ac903350](https://github.com/angular-ui/ui-router/commit/ac9033501debb63364539d91fbf3a0cba4579f8e))
* **travis:** make CI build faster ([0531de05](https://github.com/angular-ui/ui-router/commit/0531de052e414a8d839fbb4e7635e923e94865b3))


#### Features

##### Default and Typed params

This release includes a lot of bug fixes around default/optional and typed parameters.  As such, 0.2.12 is the first release where we recommend those features be used.

* **$state:**
  * add state params validation ([b1379e6a](https://github.com/angular-ui/ui-router/commit/b1379e6a4d38f7ed7436e05873932d7c279af578), closes [#1433](https://github.com/angular-ui/ui-router/issues/1433))
  * is/includes/get work on relative stateOrName ([232e94b3](https://github.com/angular-ui/ui-router/commit/232e94b3c2ca2c764bb9510046e4b61690c87852))
  * .reload() returns state transition promise ([639e0565](https://github.com/angular-ui/ui-router/commit/639e0565dece9d5544cc93b3eee6e11c99bd7373))
* **$templateFactory:** request templateURL as text/html ([ccd60769](https://github.com/angular-ui/ui-router/commit/ccd6076904a4b801d77b47f6e2de4c06ce9962f8), closes [#1287])
* **$urlMatcherFactory:** Made a Params and ParamSet class ([0cc1e6cc](https://github.com/angular-ui/ui-router/commit/0cc1e6cc461a4640618e2bb594566551c54834e2))



<a name="0.2.11"></a>
### 0.2.11 (2014-08-26)


#### Bug Fixes

* **$resolve:** Resolves only inherit from immediate parent fixes #702 ([df34e20c](https://github.com/angular-ui/ui-router/commit/df34e20c576299e7a3c8bd4ebc68d42341c0ace9))
* **$state:**
  * change $state.href default options.inherit to true ([deea695f](https://github.com/angular-ui/ui-router/commit/deea695f5cacc55de351ab985144fd233c02a769))
  * sanity-check state lookups ([456fd5ae](https://github.com/angular-ui/ui-router/commit/456fd5aec9ea507518927bfabd62b4afad4cf714), closes [#980](https://github.com/angular-ui/ui-router/issues/980))
  * didn't comply to inherit parameter ([09836781](https://github.com/angular-ui/ui-router/commit/09836781f126c1c485b06551eb9cfd4fa0f45c35))
  * allow view content loading broadcast ([7b78edee](https://github.com/angular-ui/ui-router/commit/7b78edeeb52a74abf4d3f00f79534033d5a08d1a))
* **$urlMatcherFactory:**
  * detect injected functions ([91f75ae6](https://github.com/angular-ui/ui-router/commit/91f75ae66c4d129f6f69e53bd547594e9661f5d5))
  * syntax ([1ebed370](https://github.com/angular-ui/ui-router/commit/1ebed37069bae8614d41541d56521f5c45f703f3))
* **UrlMatcher:**
  * query param function defaults ([f9c20530](https://github.com/angular-ui/ui-router/commit/f9c205304f10d8a4ebe7efe9025e642016479a51))
  * don't decode default values ([63607bdb](https://github.com/angular-ui/ui-router/commit/63607bdbbcb432d3fb37856a1cb3da0cd496804e))
* **travis:** update Node version to fix build ([d6b95ef2](https://github.com/angular-ui/ui-router/commit/d6b95ef23d9dacb4eba08897f5190a0bcddb3a48))
* **uiSref:**
  * Generate an href for states with a blank url. closes #1293 ([691745b1](https://github.com/angular-ui/ui-router/commit/691745b12fa05d3700dd28f0c8d25f8a105074ad))
  * should inherit params by default ([b973dad1](https://github.com/angular-ui/ui-router/commit/b973dad155ad09a7975e1476bd096f7b2c758eeb))
  * cancel transition if preventDefault() has been called ([2e6d9167](https://github.com/angular-ui/ui-router/commit/2e6d9167d3afbfbca6427e53e012f94fb5fb8022))
* **uiView:** Fixed infinite loop when is called .go() from a controller. ([e13988b8](https://github.com/angular-ui/ui-router/commit/e13988b8cd6231d75c78876ee9d012cc87f4a8d9), closes [#1194](https://github.com/angular-ui/ui-router/issues/1194))
* **docs:**
  * Fixed link to milestones ([6c0ae500](https://github.com/angular-ui/ui-router/commit/6c0ae500cc238ea9fc95adcc15415c55fc9e1f33))
  * fix bug in decorator example ([4bd00af5](https://github.com/angular-ui/ui-router/commit/4bd00af50b8b88a49d1545a76290731cb8e0feb1))
  * Removed an incorrect semi-colon ([af97cef8](https://github.com/angular-ui/ui-router/commit/af97cef8b967f2e32177e539ef41450dca131a7d))
  * Explain return value of rule as function ([5e887890](https://github.com/angular-ui/ui-router/commit/5e8878900a6ffe59a81aed531a3925e34a297377))


#### Features

* **$state:**
  * allow parameters to pass unharmed ([8939d057](https://github.com/angular-ui/ui-router/commit/8939d0572ab1316e458ef016317ecff53131a822))
    * **BREAKING CHANGE**: state parameters are no longer automatically coerced to strings, and unspecified parameter values are now set to undefined rather than null.
  * allow prevent syncUrl on failure ([753060b9](https://github.com/angular-ui/ui-router/commit/753060b910d5d2da600a6fa0757976e401c33172))
* **typescript:** Add typescript definitions for component builds ([521ceb3f](https://github.com/angular-ui/ui-router/commit/521ceb3fd7850646422f411921e21ce5e7d82e0f))
* **uiSref:** extend syntax for ui-sref ([71cad3d6](https://github.com/angular-ui/ui-router/commit/71cad3d636508b5a9fe004775ad1f1adc0c80c3e))
* **uiSrefActive:** 
  * Also activate for child states. ([bf163ad6](https://github.com/angular-ui/ui-router/commit/bf163ad6ce176ce28792696c8302d7cdf5c05a01), closes [#818](https://github.com/angular-ui/ui-router/issues/818))
    * **BREAKING CHANGE** Since ui-sref-active now activates even when child states are active you may need to swap out your ui-sref-active with ui-sref-active-eq, thought typically we think devs want the auto inheritance.

  * uiSrefActiveEq: new directive with old ui-sref-active behavior
* **$urlRouter:**
  * defer URL change interception ([c72d8ce1](https://github.com/angular-ui/ui-router/commit/c72d8ce11916d0ac22c81b409c9e61d7048554d7))
  * force URLs to have valid params ([d48505cd](https://github.com/angular-ui/ui-router/commit/d48505cd328d83e39d5706e085ba319715f999a6))
  * abstract $location handling ([08b4636b](https://github.com/angular-ui/ui-router/commit/08b4636b294611f08db35f00641eb5211686fb50))
* **$urlMatcherFactory:**
  * fail on bad parameters ([d8f124c1](https://github.com/angular-ui/ui-router/commit/d8f124c10d00c7e5dde88c602d966db261aea221))
  * date type support ([b7f074ff](https://github.com/angular-ui/ui-router/commit/b7f074ff65ca150a3cdbda4d5ad6cb17107300eb))
  * implement type support ([450b1f0e](https://github.com/angular-ui/ui-router/commit/450b1f0e8e03c738174ff967f688b9a6373290f4))
* **UrlMatcher:**
  * handle query string arrays ([9cf764ef](https://github.com/angular-ui/ui-router/commit/9cf764efab45fa9309368688d535ddf6e96d6449), closes [#373](https://github.com/angular-ui/ui-router/issues/373))
  * injectable functions as defaults ([00966ecd](https://github.com/angular-ui/ui-router/commit/00966ecd91fb745846039160cab707bfca8b3bec))
  * default values & type decoding for query params ([a472b301](https://github.com/angular-ui/ui-router/commit/a472b301389fbe84d1c1fa9f24852b492a569d11))
  * allow shorthand definitions ([5b724304](https://github.com/angular-ui/ui-router/commit/5b7243049793505e44b6608ea09878c37c95b1f5))
  * validates whole interface ([32b27db1](https://github.com/angular-ui/ui-router/commit/32b27db173722e9194ef1d5c0ea7d93f25a98d11))
  * implement non-strict matching ([a3e21366](https://github.com/angular-ui/ui-router/commit/a3e21366bee0475c9795a1ec76f70eec41c5b4e3))
  * add per-param config support ([07b3029f](https://github.com/angular-ui/ui-router/commit/07b3029f4d409cf955780113df92e36401b47580))
    * **BREAKING CHANGE**: the `params` option in state configurations must now be an object keyed by parameter name.

### 0.2.10 (2014-03-12)


#### Bug Fixes

* **$state:** use $browser.baseHref() when generating urls with .href() ([cbcc8488](https://github.com/angular-ui/ui-router/commit/cbcc84887d6b6d35258adabb97c714cd9c1e272d))
* **bower.json:** JS files should not be ignored ([ccdab193](https://github.com/angular-ui/ui-router/commit/ccdab193315f304eb3be5f5b97c47a926c79263e))
* **dev:** karma:background task is missing, can't run grunt:dev. ([d9f7b898](https://github.com/angular-ui/ui-router/commit/d9f7b898e8e3abb8c846b0faa16a382913d7b22b))
* **sample:** Contacts menu button not staying active when navigating to detail states. Need t ([2fcb8443](https://github.com/angular-ui/ui-router/commit/2fcb84437cb43ade12682a92b764f13cac77dfe7))
* **uiSref:** support mock-clicks/events with no data ([717d3ff7](https://github.com/angular-ui/ui-router/commit/717d3ff7d0ba72d239892dee562b401cdf90e418))
* **uiView:**
  * Do NOT autoscroll when autoscroll attr is missing ([affe5bd7](https://github.com/angular-ui/ui-router/commit/affe5bd785cdc3f02b7a9f64a52e3900386ec3a0), closes [#807](https://github.com/angular-ui/ui-router/issues/807))
  * Refactoring uiView directive to copy ngView logic ([548fab6a](https://github.com/angular-ui/ui-router/commit/548fab6ab9debc9904c5865c8bc68b4fc3271dd0), closes [#857](https://github.com/angular-ui/ui-router/issues/857), [#552](https://github.com/angular-ui/ui-router/issues/552))


#### Features

* **$state:** includes() allows glob patterns for state matching. ([2d5f6b37](https://github.com/angular-ui/ui-router/commit/2d5f6b37191a3135f4a6d9e8f344c54edcdc065b))
* **UrlMatcher:** Add support for case insensitive url matching ([642d5247](https://github.com/angular-ui/ui-router/commit/642d524799f604811e680331002feec7199a1fb5))
* **uiSref:** add support for transition options ([2ed7a728](https://github.com/angular-ui/ui-router/commit/2ed7a728cee6854b38501fbc1df6139d3de5b28a))
* **uiView:** add controllerAs config with function ([1ee7334a](https://github.com/angular-ui/ui-router/commit/1ee7334a73efeccc9b95340e315cdfd59944762d))


### 0.2.9 (2014-01-17)


This release is identical to 0.2.8. 0.2.8 was re-tagged in git to fix a problem with bower.


### 0.2.8 (2014-01-16)


#### Bug Fixes

* **$state:** allow null to be passed as 'params' param ([094dc30e](https://github.com/angular-ui/ui-router/commit/094dc30e883e1bd14e50a475553bafeaade3b178))
* **$state.go:** param inheritance shouldn't inherit from siblings ([aea872e0](https://github.com/angular-ui/ui-router/commit/aea872e0b983cb433436ce5875df10c838fccedb))
* **bower.json:** fixes bower.json ([eed3cc4d](https://github.com/angular-ui/ui-router/commit/eed3cc4d4dfef1d3ef84b9fd063127538ebf59d3))
* **uiSrefActive:** annotate controller injection ([85921422](https://github.com/angular-ui/ui-router/commit/85921422ff7fb0effed358136426d616cce3d583), closes [#671](https://github.com/angular-ui/ui-router/issues/671))
* **uiView:**
  * autoscroll tests pass on 1.2.4 & 1.1.5 ([86eacac0](https://github.com/angular-ui/ui-router/commit/86eacac09ca5e9000bd3b9c7ba6e2cc95d883a3a))
  * don't animate initial load ([83b6634d](https://github.com/angular-ui/ui-router/commit/83b6634d27942ca74766b2b1244a7fc52c5643d9))
  * test pass against 1.0.8 and 1.2.4 ([a402415a](https://github.com/angular-ui/ui-router/commit/a402415a2a28b360c43b9fe8f4f54c540f6c33de))
  * it should autoscroll when expr is missing. ([8bb9e27a](https://github.com/angular-ui/ui-router/commit/8bb9e27a2986725f45daf44c4c9f846385095aff))


#### Features

* **uiSref:** add target attribute behaviour ([c12bf9a5](https://github.com/angular-ui/ui-router/commit/c12bf9a520d30d70294e3d82de7661900f8e394e))
* **uiView:**
  * merge autoscroll expression test. ([b89e0f87](https://github.com/angular-ui/ui-router/commit/b89e0f871d5cc35c10925ede986c10684d5c9252))
  * cache and test autoscroll expression ([ee262282](https://github.com/angular-ui/ui-router/commit/ee2622828c2ce83807f006a459ac4e11406d9258))
