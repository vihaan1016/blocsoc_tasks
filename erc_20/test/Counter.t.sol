// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {DeployOurToken} from "../script/TokenDeploy.s.sol";
import {OurToken} from "../src/ourToken.sol";
import {Test, console} from "forge-std/Test.sol";
import {
    ZkSyncChainChecker
} from "lib/foundry-devops/src/ZkSyncChainChecker.sol";

interface badToken {
    function mint(address user, uint256 amount) external;
}

contract myTests is Test, ZkSyncChainChecker {
    uint256 bobMoney = 100 ether;
    uint256 public startAmount = 1000000 ether;

    OurToken public theToken;
    DeployOurToken public theDeployer;
    address bobUser;
    address aliceUser;

    function setUp() public {
        theDeployer = new DeployOurToken();
        if (!isZkSyncChain()) {
            theToken = theDeployer.run();
        } else {
            theToken = new OurToken(startAmount);
            theToken.transfer(msg.sender, startAmount);
        }

        bobUser = makeAddr("bob");
        aliceUser = makeAddr("alice");

        vm.prank(msg.sender);
        theToken.transfer(bobUser, bobMoney);
    }

    function testSupply() public view {
        assertEq(theToken.totalSupply(), theDeployer.INITIAL_SUPPLY());
    }

    function testCantMint() public {
        vm.expectRevert();
        badToken(address(theToken)).mint(address(this), 1);
    }

    function testAllows() public {
        uint256 allowAmount = 1000;

        vm.prank(bobUser);
        theToken.approve(aliceUser, allowAmount);

        uint256 takeAmount = 500;

        vm.prank(aliceUser);
        theToken.transferFrom(bobUser, aliceUser, takeAmount);

        assertEq(theToken.balanceOf(aliceUser), takeAmount);
        assertEq(theToken.balanceOf(bobUser), bobMoney - takeAmount);
    }

    function testTransferWorks() public {
        uint256 sendAmt = 10;
        vm.prank(bobUser);
        theToken.transfer(aliceUser, sendAmt);

        assertEq(theToken.balanceOf(aliceUser), sendAmt);
        assertEq(theToken.balanceOf(bobUser), bobMoney - sendAmt);
    }

    function testTransferFails() public {
        uint256 tooMuch = 200 ether;
        vm.prank(bobUser);
        vm.expectRevert();
        theToken.transfer(aliceUser, tooMuch);
    }

    function testTransferFromFails() public {
        vm.prank(aliceUser);
        vm.expectRevert();
        theToken.transferFrom(bobUser, aliceUser, 10);
    }
}
