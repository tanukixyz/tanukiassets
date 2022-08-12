// draw tokens data from token lists

const fs = require('fs');
const axios = require('axios');

const configs = {
  uniswap: ['https://gateway.ipfs.io/ipns/tokens.uniswap.org'],
};

const chainIds = {
  1: 'ethereum',
  10: 'optimism',
  25: 'cronos',
  56: 'binance',
  137: 'polygon',
  250: 'fantom',
  42161: 'arbitrum',
  42220: 'celo',
  43114: 'avalanche',
};

const tokenListsPath = './tokenlists';

function findDupToken(token, tokens) {
  for (let i = 0; i < tokens.length; i++) {
    if (token.symbol === tokens[i].symbol) {
      return i;
    }
  }

  return -1;
}

(async function () {
  for (const [name, urls] of Object.entries(configs)) {
    // read existed data
    let data = [];

    for (const url of urls) {
      const response = await axios.get(url);
      if (response.data && response.data.tokens) {
        for (const token of response.data.tokens) {
          const index = findDupToken(token, data);

          if (index === -1) {
            // not found
            data.push({
              name: token.name,
              symbol: token.symbol,
              decimals: token.decimals,
              coingeckoId: '',
              addresses: {
                [chainIds[token.chainId]]: token.address.toLowerCase(),
              },
              logoURI: token.logoURI,
            });
          } else {
            data[index].addresses[chainIds[token.chainId]] = token.address.toLowerCase();
          }
        }
      }
    }

    console.info(data);
  }
})();
