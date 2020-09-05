# Anki Converter

This project is that converts words stored in
[Naver English wordbook](https://learn.dict.naver.com/wordbook/enkodict)
into a csv file to easy import into Anki's **Basic Type** Card.

## Getting started

### Prerequisite

Node.js

### Installation

```sh
$ git clone git@github.com:khbrst/anki-converter.git
$ cd anki-converter
$ npm install
```

### Preparing the input files

1. Open [Naver English Wordbook](https://learn.dict.naver.com/wordbook/enkodict).
2. Choose the wordbook you want to import into Anki's Basic Type Card.
3. Save the pages(`Ctrl+S`) as `html` files to the `anki-converter/input` directory. Only 20 words are displayed per page.

When you're done, the directory should look like the following.

```sh
$ tree input
input
├── 1.html
└── 2.html
```

### Convert the input files into a csv file

Execute `node index.js` command and check the generated csv file in your
terminal.

```sh
$ node index.js
...
out.csv file is created!

$ ls out.csv
out.csv
```

### Import a csv file into Anki

1. Open your Anki app
2. File > Import > Choose a csv file
3. Choose Card Type to **Basic**
4. Choose the deck you want to save
5. Enter field seperator to **Comma**
6. Press `Import` button
