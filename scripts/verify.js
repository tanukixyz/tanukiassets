// verify and format data

const fs = require('fs');

const tokenListsPath = './tokenlists';
const tanukiList = 'tanuki-default.json';

function verifyProjectList() {
  const projectList = JSON.parse(fs.readFileSync('./data/projects.json').toString());

  for (const [name, project] of Object.entries(projectList)) {
    console.assert(project.name === name, 'project key must be name');
    console.assert(project.name !== undefined, 'project must has a name');
    console.assert(project.displayName !== undefined, 'project must has a display name');
    console.assert(
      project.category !== undefined &&
        ['dex', 'lending', 'borrowing', 'bridge', 'staking', 'marketplace', 'others'].indexOf(project.category) > -1,
      'invalid project category'
    );
  }

  const ordered = Object.keys(projectList)
    .sort()
    .reduce((obj, key) => {
      obj[key] = projectList[key];
      return obj;
    }, {});
  fs.writeFileSync('./data/projects.json', JSON.stringify(ordered).toString());
}

(async function () {
  verifyProjectList();

  // verify and sort token lists data
  const lists = fs.readdirSync(tokenListsPath);

  let allTokens = [];

  for (const list of lists) {
    if (list === tanukiList) continue;

    let data = JSON.parse(fs.readFileSync(`${tokenListsPath}/${list}`).toString());

    console.assert(data.name !== undefined, 'token list must has a name');
    console.assert(data.tokens !== undefined && data.tokens.length, 'token list must has token arrays');

    for (const token of data.tokens) {
      console.assert(token.name !== undefined, 'token must has a name');
      console.assert(token.symbol !== undefined, 'token must has a symbol');
      console.assert(token.decimals !== undefined, 'token must has a decimals');
      console.assert(token.logoURI !== undefined, 'token must has a logo uri');
      console.assert(token.addresses !== undefined, 'token must has addresses');

      // we merge all tokens into single list
      function findDupToken(token, tokens) {
        for (let i = 0; i < tokens.length; i++) {
          if (token.symbol === tokens[i].symbol) {
            return i;
          }
        }

        return -1;
      }

      const index = findDupToken(token, allTokens);
      if (index === -1) {
        allTokens.push(token);
      } else {
        for (const [chain, address] of Object.entries(token.addresses)) {
          allTokens[index].addresses[chain] = address;
        }
      }
    }

    // sort token list by name
    data.tokens = data.tokens.sort(function (a, b) {
      return a.name > b.name ? 1 : -1;
    });

    // save sorted data
    fs.writeFileSync(`${tokenListsPath}/${list}`, JSON.stringify(data).toString());
  }

  // sort token list by name
  allTokens = allTokens.sort(function (a, b) {
    return a.name > b.name ? 1 : -1;
  });

  // save single list
  fs.writeFileSync(
    `${tokenListsPath}/tanuki-default.json`,
    JSON.stringify({
      name: 'tanuki',
      tokens: allTokens,
    }).toString()
  );
})();
