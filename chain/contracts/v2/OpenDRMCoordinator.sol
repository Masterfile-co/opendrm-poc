// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.13;

import {DKGSubscriptionManager} from "./DKGSubscriptionManager.sol";
import {IPRESubscriptionManager} from "./IPRESubscriptionManager.sol";

import {OpenDRM721} from "./OpenDRM721.sol";

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

contract OpenDRMCoordinator {
    error NotChildRequest(address caller);

    DKGSubscriptionManager public dkgManager;
    IPRESubscriptionManager public preManager;
    address public odrm721Implementation;

    uint256 internal _salt;

    // Standard policy terms. Can be configurable in the future
    uint256 public subscriptionId;
    uint256 internal _policyLength = 86400; // One day

    mapping(address => bool) isChild;

    struct Bob {
        bytes verifyingKey;
        bytes decryptingKey;
    }

    // Registry: Can probably be moved to a seperate contract
    mapping(address => Bob) public registry;

    modifier onlyChildren() {
        if (!isChild[msg.sender]) {
            revert NotChildRequest(msg.sender);
        }
        _;
    }

    constructor(
        DKGSubscriptionManager _dkgManager,
        IPRESubscriptionManager _preManager,
        address _odrm721Implementation,
        uint16 _dkgNodes,
        uint32 _duration
    ) payable {
        dkgManager = _dkgManager;
        preManager = _preManager;
        odrm721Implementation = _odrm721Implementation;

        subscriptionId = dkgManager.createSubscription{value: msg.value}(
            _dkgNodes,
            _duration
        );
    }

    function deployOpenDRM(string memory _name, string memory _symbol)
        external
    {
        // Deploy new contract
        address odrm721 = Clones.cloneDeterministic(
            odrm721Implementation,
            bytes32(_salt)
        );

        // Initialize contract
        OpenDRM721(odrm721).initialize(dkgManager, preManager, _name, _symbol);

        // Add as subscription consumer
        dkgManager.addConsumer(subscriptionId, odrm721);

        // Add as child
        isChild[odrm721] = true;
    }

    // TODO
    // function fundSubscription() external payable {
    //     dkgManager.extendSubscription{value: msg.value}(_subscriptionId);
    // }

    // Register Eth address -> Nu verifyingKey
    function register(
        bytes calldata _verifyingKey,
        bytes calldata _decryptingKey
    ) external {
        registry[msg.sender] = Bob(_verifyingKey, _decryptingKey);
    }

    function checkRegistry(address user)
        public
        returns (bytes memory verifyingKey, bytes memory decryptingKey)
    {
        Bob memory bob = registry[user];
        return (bob.verifyingKey, bob.decryptingKey);
    }
}
