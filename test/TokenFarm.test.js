const { assert } = require('chai');

const EscoToken = artifacts.require("EscoToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require('chai')
    .use(require('chai-as-promised'))
    .should();


function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, escoToken, tokenFarm;
    before(async () => {
        // Load contracts
        daiToken = await DaiToken.new();
        escoToken = await EscoToken.new();
        tokenFarm = await TokenFarm.new(escoToken.address, daiToken.address);

        // Transfer all esco tokens to the token TokenFarm
        await escoToken.transfer(tokenFarm.address, tokens('1000000'));

        // Send dai tokens to investor
        await daiToken.transfer(investor, tokens('100'), { from: owner });
    })

    describe('Mock DAI Deployment', async () => {
        it('has a name', async () => {
            const name = await daiToken.name();
            assert.equal(name, 'Mock DAI Token');
        })
    });

    describe('Esco Token Deployment', async () => {
        it('has a name', async () => {
            const name = await escoToken.name();
            assert.equal(name, 'Escobar Token');
        })
    });

    describe('Token Farm Deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name();
            assert.equal(name, 'Escobar Token Farm');
        });

        it('contract has tokens', async () => {
            let balance = await escoToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), tokens('1000000'));
        })
    });

    describe('Farming token Deployment', async () => {
        it('rewards investors for staking mDai tokens', async () => {
            let result;

            // check the investor has 100 mDai
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking');

            // Stake mDai tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
            await tokenFarm.stakeTokens(tokens('100'), { from: investor });

            // check the investor has 0 mDai
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking');

            // check the token farm has 100 mDai
            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI wallet balance correct after staking');

            result = await tokenFarm.stakingBalance(investor);
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking');

            result = await tokenFarm.isStaking(investor);
            assert.equal(result.toString(), 'true', 'investor status correct after staking');

            // issue tokens
            await tokenFarm.issueTokens({ from: owner });

            // Check balance after issuance
            result = await escoToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), 'investor esco token wallet balance correct after issuance');

            // Make sure the owner is the only one who can issue ESCO tokens
            await tokenFarm.issueTokens({ from: investor }).should.be.rejected;
        })
    })
});