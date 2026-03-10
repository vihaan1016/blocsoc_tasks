// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "lib/forge-std/src/Test.sol";
import {MyGovernor} from "../src/MyGovernor.sol";
import {DaoToken} from "../src/DaoTokens.sol";
import {TimeLock} from "../src/TimeLock.sol";
import {Box} from "../src/Dao.sol";
import {console} from "lib/forge-std/src/console.sol";

contract MyGovernorTest is Test {
    DaoToken token;
    TimeLock timelock;
    MyGovernor governor;
    Box box;

    uint256 public constant MIN_DELAY = 3600;
    uint256 public constant QUORUM_PERCENTAGE = 4;
    uint256 public constant VOTING_PERIOD = 50400;
    uint256 public constant VOTING_DELAY = 1;

    address[] addressesToCall;
    address[] proposers;
    address[] executors;
    bytes[] functionCalls;
    uint256[] values;

    address public constant VOTER = address(1);

    function setUp() public {
        token = new DaoToken(VOTER, address(this));
        token.mint(VOTER, 100e18);

        vm.prank(VOTER);
        token.delegate(VOTER);
        timelock = new TimeLock(MIN_DELAY, proposers, executors);
        governor = new MyGovernor(token, timelock);
        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();

        timelock.grantRole(proposerRole, address(governor));
        timelock.grantRole(executorRole, address(0));

        box = new Box();
        box.transferOwnership(address(timelock));
    }

    function testCantUpdateBoxWithoutGovernance() public {
        vm.expectRevert();
        box.store(1);
    }

    function testGovernanceUpdatesBox() public {
        uint256 valueToStore = 777;
        string memory description = "Store custom value in the dao";
        bytes memory encodedFunctionCall = abi.encodeWithSignature("store(uint256)", valueToStore);
        addressesToCall.push(address(box));
        values.push(0);
        functionCalls.push(encodedFunctionCall);

        //proposal
        uint256 proposalId = governor.propose(addressesToCall, values, functionCalls, description);
        console.log("Proposal State:", uint256(governor.state(proposalId)));
        assertEq(uint256(governor.state(proposalId)), 0);
        vm.warp(block.timestamp + VOTING_DELAY + 1);
        vm.roll(block.number + VOTING_DELAY + 1);
        console.log("Proposal State:", uint256(governor.state(proposalId)));
        assertEq(uint256(governor.state(proposalId)), 1);

        //voting and execution after queuing
        string memory reason = "abritratry";
        uint8 voteWay = 1;
        vm.prank(VOTER);
        governor.castVoteWithReason(proposalId, voteWay, reason);

        vm.warp(block.timestamp + VOTING_PERIOD + 1);
        vm.roll(block.number + VOTING_PERIOD + 1);
        console.log("Proposal State:", uint256(governor.state(proposalId)));
        assertEq(uint256(governor.state(proposalId)), 4);

        bytes32 descriptionHash = keccak256(abi.encodePacked(description));
        governor.queue(addressesToCall, values, functionCalls, descriptionHash);

        vm.roll(block.number + MIN_DELAY + 1);
        vm.warp(block.timestamp + MIN_DELAY + 1);
        console.log("Proposal State:", uint256(governor.state(proposalId)));
        assertEq(uint256(governor.state(proposalId)), 5);
        governor.execute(addressesToCall, values, functionCalls, descriptionHash);
        console.log("Proposal State:", uint256(governor.state(proposalId)));
        assertEq(uint256(governor.state(proposalId)), 7);
        assert(box.retrieve() == valueToStore);
    }
}
