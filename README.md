# Github project settings template

> Manage the settings of your Github repositories with a template file

## Who is this for?

If you have to manage a lot of Github repositories and keep them all under control
(or even worse, keep them consistently configured), then this is for you.

# Usage

## Installation

```
$ git clone git@github.com:peopledoc/github-repo-control.git
$ cd github-repo-control
$ npm i // or yarn
```

## How does it work?

Describe your desired settings in a YML file (see the `settings.sample.yml` file for an example),
and run either:

```
// with yarn
$ yarn start -s path/to/my_file.yml

// with npm
$ npm start -- -s path/to/my_file.yml
```

# LICENSE

Licensed under the MIT License

Copyright 2019 Xavier Cambar, for PeopleDoc

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
