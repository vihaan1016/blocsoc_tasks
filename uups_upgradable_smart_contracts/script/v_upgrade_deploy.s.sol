// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {UUPSv1} from "../src/UUPSv1.sol";
import {UUPSv2} from "../src/UUPSv2.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";

contract Upgrade_version is Script {
    function run() external returns (address) {
        address mostRecentlyDeployedProxy = DevOpsTools
            .get_most_recent_deployment("ERC1967Proxy", block.chainid);

        vm.startBroadcast();
        UUPSv2 vnew = new UUPSv2();
        vm.stopBroadcast();

        address proxy = upgradeBox(mostRecentlyDeployedProxy, address(vnew));
        return proxy;
    }

    function upgradeBox(
        address proxyAddress,
        address new_ver
    ) public returns (address) {
        vm.startBroadcast();
        UUPSv1 proxy = UUPSv1(payable(proxyAddress));
        proxy.upgradeToAndCall(address(new_ver), "");
        vm.stopBroadcast();
        return address(proxy);
    }
}
