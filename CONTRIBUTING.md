
# Report an Issue

Help us make UI-Router better! If you think you might have found a bug, or some other weirdness, start by making sure
it hasn't already been reported. You can [search through existing @uirouter/angular issues](https://github.com/ui-router/ng2?search?q=wat%3F&type=Issues) and [@uirouter/core issues](https://github.com/ui-router/core?search?q=wat%3F&type=Issues)
to see if someone's reported one similar to yours.

If not, then [create a plunkr](http://bit.ly/UIR-Plunk) that demonstrates the problem (try to use as little code
as possible: the more minimalist, the faster we can debug it).

Next, [create a new issue](https://github.com/ui-router/ng2/issues/new) that briefly explains the problem,
and provides a bit of background as to the circumstances that triggered it. Don't forget to include the link to
that plunkr you created!

**Note**: If you're unsure how a feature is used, or are encountering some unexpected behavior that you aren't sure
is a bug, it's best to talk it out on
[StackOverflow](http://stackoverflow.com/questions/ask?tags=angular2,@uirouter/angular) before reporting it. This
keeps development streamlined, and helps us focus on building great software.


Issues only! |
-------------|
Please keep in mind that the issue tracker is for *issues*. Please do *not* post an issue if you need help or support. Instead, use StackOverflow. |

# Contribute

**(1)** See the **[Developing](#developing)** section below, to get the development version of UI-Router up and running on your local machine.

**(2)** Check out the [roadmap](https://github.com/ui-router/ng2/milestones) to see where the project is headed, and if your feature idea fits with where we're headed.

**(3)** If you're not sure, [open an RFC](https://github.com/ui-router/ng2/issues/new?title=RFC:%20My%20idea) to get some feedback on your idea.

**(4)** Finally, commit some code and open a pull request. Code & commits should abide by the following rules:

- *Always* have test coverage for new features (or regression tests for bug fixes), and *never* break existing tests
- Commits should represent one logical change each; if a feature goes through multiple iterations, squash your commits down to one
- Make sure to follow the [Angular commit message format](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format) so your change will appear in the changelog of the next release.
- Changes should always respect the coding style of the project



# Developing

`ui-router-ng2` uses <code>npm</code> and <code>webpack</code>.

## Fetch the source code

The code for `ui-router-ng2` is split into two source repositories:

* [UI-Router Core](https://github.com/ui-router/core) (`@uirouter/core` on npm)
* [UI-Router for Angular 2](https://github.com/ui-router/ng2) (`ui-router-ng2` on npm)

Clone both repositories into directories next to each other.

```
mkdir uirouter
cd uirouter
git clone https://github.com/ui-router/ng2.git
git clone https://github.com/ui-router/core.git
```

## Install dependencies

Use `npm` to install the development dependencies for each repository.

```
cd core
npm install
cd ../ng2
npm install
cd ..
```

## Link the directories

This step is necessary if you need to modify any code in `@uirouter/core`.
Using `npm`, link `@uirouter/core` into `ui-router-ng2`

```
cd core
npm link
cd ../ng2
npm link @uirouter/core
cd ..
```

After executing these steps, your local copy of `@uirouter/angular` will be built using your local copy of `@uirouter/core`
instead of the prebuilt version specified in `package.json`.

## Develop

* `npm run build`: Perform a full build.
* `npm run watch`: Continuously builds and runs tests when source or tests change.

If you make changes in `@uirouter/core`, run these scripts before rebuilding or re-testing `@uirouter/angular`:

* `npm run build`: Compiles `@uirouter/core` code
* `npm run watch`: Continuously builds the `@uirouter/core` code when sources change.

