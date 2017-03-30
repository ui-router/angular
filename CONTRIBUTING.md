
# Report an Issue

Help us make UI-Router better! If you think you might have found a bug, or some other weirdness, start by making sure
it hasn't already been reported. You can [search through existing ui-router-ng2 issues](https://github.com/ui-router/ng2?search?q=wat%3F&type=Issues) and [ui-router-core issues](https://github.com/ui-router/core?search?q=wat%3F&type=Issues)
to see if someone's reported one similar to yours.

If not, then [create a plunkr](http://bit.ly/UIR-Plunk) that demonstrates the problem (try to use as little code
as possible: the more minimalist, the faster we can debug it).

Next, [create a new issue](https://github.com/ui-router/ng2/issues/new) that briefly explains the problem,
and provides a bit of background as to the circumstances that triggered it. Don't forget to include the link to
that plunkr you created!

**Note**: If you're unsure how a feature is used, or are encountering some unexpected behavior that you aren't sure
is a bug, it's best to talk it out on
[StackOverflow](http://stackoverflow.com/questions/ask?tags=angular2,ui-router-ng2) before reporting it. This
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

* [UI-Router Core](https://github.com/ui-router/core) (`ui-router-core` on npm)
* [UI-Router for Angular 2](https://github.com/ui-router/ng2) (`ui-router-ng2` on npm)

Clone both repositories into directories next to each other.

```
git clone https://github.com/ui-router/ng2.git ui-router-ng2
git clone https://github.com/ui-router/core.git ui-router-core
```

## Install dependencies

Use `npm` to install the development dependencies for each repository.

```
cd ui-router-core
npm install
cd ../ui-router-ng2
npm install
cd ..
```

## Link the directories

This step is necessary if you need to modify any code in `ui-router-core`.
Using `npm`, link `ui-router-core` into `ui-router-ng2`

```
cd ui-router-core
npm link
cd ../ui-router-ng2
npm link ui-router-core
cd ..
```

After executing these steps, `ui-router-ng2` will be built using your local copy of `ui-router-core`.

## Develop

* `npm run build`: Perform a full build.
* `npm run watch`: Continuously builds and runs tests when source or tests change.

If you make changes in `ui-router-core`, run these scripts before rebuilding or re-testing `ui-router-ng2`:

* `npm run build`: Compiles `ui-router-core` code
* `npm run watch`: Continuously builds the `ui-router-core` code when sources change.

