/* eslint-disable */
const fs = require('fs');

function verifyProjectList() {
  const projectList = JSON.parse(fs.readFileSync('./configs/projects.json').toString());

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
  fs.writeFileSync('./configs/projects.json', JSON.stringify(ordered).toString());
}

function verifyBlockchainList() {
  const blockchainList = JSON.parse(fs.readFileSync('./configs/blockchains.json').toString());

  for (const [name, blockchain] of Object.entries(blockchainList)) {
    console.assert(blockchain.name === name, 'blockchain key must be name');
    console.assert(blockchain.name !== undefined, 'blockchain must has a name');
    console.assert(blockchain.displayName !== undefined, 'blockchain must has a display name');
  }

  const ordered = Object.keys(blockchainList)
    .sort()
    .reduce((obj, key) => {
      obj[key] = blockchainList[key];
      return obj;
    }, {});
  fs.writeFileSync('./configs/blockchains.json', JSON.stringify(ordered).toString());
}

(async function () {
  verifyProjectList();
  verifyBlockchainList();
})();
