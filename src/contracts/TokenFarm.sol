pragma solidity ^0.5.0;

import "./EscoToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Escobar Token Farm";
    EscoToken public escoToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(EscoToken _escobarToken, DaiToken _daiToken) public {
        escoToken = _escobarToken;
        daiToken = _daiToken;
    }

    function stakeTokens(uint256 _amount) public {
        // Transfer Mock dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add sender to the stakers array
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // update staking statuses
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
}
