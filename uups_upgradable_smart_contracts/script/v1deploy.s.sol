// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {UUPSv1} from "../src/UUPSv1.sol";
import {ERC1967Proxy} from "lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployUUPS is Script {
    function run() external returns (address) {
        address proxy = deployer();
        return proxy;
    }

    function deployer() internal returns (address) {
        vm.startBroadcast();
        UUPSv1 impl = new UUPSv1();
        bytes memory data = abi.encodeWithSignature("initialize(address)", msg.sender);
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), data);
        vm.stopBroadcast();
        return address(proxy);
    }
}
