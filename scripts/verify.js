// verify and format data

const fs = require('fs');

const tokenListsPath = './tokenlists';

(async function () {
  // verify and sort token lists data
  const lists = fs.readdirSync(tokenListsPath);

  for (const list of lists) {
    let data = JSON.parse(fs.readFileSync(`${tokenListsPath}/${list}`).toString());

    console.assert(data.name !== undefined, 'token list must has a name');
    console.assert(data.version !== undefined, 'token list must has a version');
    console.assert(data.tokens !== undefined && data.tokens.length, 'token list must has token arrays');

    for (const token of data.tokens) {
      console.assert(token.name !== undefined, 'token must has a name');
      console.assert(token.symbol !== undefined, 'token must has a symbol');
      console.assert(token.decimals !== undefined, 'token must has a decimals');
      console.assert(token.logoURI !== undefined, 'token must has a logo uri');
      console.assert(token.addresses !== undefined, 'token must has addresses');
    }

    // sort token list by name
    data.tokens = data.tokens.sort(function (a, b) {
      return a.name > b.name ? 1 : -1;
    });

    // save sorted data
    fs.writeFileSync(`${tokenListsPath}/${list}`, JSON.stringify(data).toString());
  }
})();
