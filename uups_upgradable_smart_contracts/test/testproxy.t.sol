// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {DeployUUPS} from "../script/v1deploy.s.sol";
import {Upgrade_version} from "../script/v_upgrade_deploy.s.sol";
import {UUPSv1} from "../src/UUPSv1.sol";
import {UUPSv2} from "../src/UUPSv2.sol";

contract TestUUPS is Test {
    DeployUUPS deployer;
    Upgrade_version upgrader;

    function setUp() public {
        deployer = new DeployUUPS();
        upgrader = new Upgrade_version();
    }

    function testUpgrade() public {
        address proxyAddress = deployer.run();
        UUPSv1 proxy = UUPSv1(proxyAddress);

        assertEq(proxy.getValue(), 0, "Initial value should be 0");

        address newProxyAddress = upgrader.run();
        UUPSv2 upgradedProxy = UUPSv2(newProxyAddress);

        assertEq(upgradedProxy.getValue(), 0, "Value should be preserved after upgrade");

        upgradedProxy.setValue(42);
        assertEq(upgradedProxy.getValue(), 42, "Value should be updated to 42");
    }
}
