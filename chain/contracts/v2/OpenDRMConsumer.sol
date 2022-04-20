// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.13;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import {DKGSubscriptionManager, PolicyRequest} from "./DKGSubscriptionManager.sol";
import {IPRESubscriptionManager} from "./IPRESubscriptionManager.sol";

import "hardhat/console.sol";
import {LibNuCypher} from "../LibNuCypher.sol";

abstract contract OpenDRMConsumer is Initializable {
    using LibNuCypher for string;

    DKGSubscriptionManager private _dkgManager;
    IPRESubscriptionManager private _preManager;

    function __OpenDRMConsumer__init(
        DKGSubscriptionManager dkgManager_,
        IPRESubscriptionManager preManager_
    ) internal onlyInitializing {
        _dkgManager = dkgManager_;
        _preManager = preManager_;
    }

    /**
     * @dev An alternative to this is to move the actual `createPolicy` function to OpenDRMCoordinator so it
     * @dev can become the policy sponsor. This will move all funding requirements (subscriptions & policies)
     * @dev to a central entity and is likely what we will do for the final OpenDRM tokenomics model.
     */
    function createPolicy(
        uint16 _size,
        uint16 _threshold,
        uint32 _startTimestamp,
        uint32 _endTimestamp,
        // Policy Request Info
        uint256 _subscriptionId,
        string memory _labelSuffix,
        bytes memory _verifyingKey,
        bytes memory _decryptingKey
    ) internal returns (bytes16 policyId) {
        // First request policy from Abiotic Alice
        (policyId, ) = _dkgManager.requestPolicy(
            _subscriptionId,
            _labelSuffix,
            PolicyRequest(
                _size,
                _threshold,
                _verifyingKey,
                _decryptingKey,
                _startTimestamp,
                _endTimestamp
            )
        );

        uint256 policyCost = _preManager.getPolicyCost(
            _size,
            _startTimestamp,
            _endTimestamp
        );

        // Then create a new PRE policy so Ursulas will provide service
        _preManager.createPolicy{value: policyCost}(
            policyId,
            address(0),
            _size,
            _startTimestamp,
            _endTimestamp
        );
    }

    function revokePolicy(bytes16 _policyId) internal {
        // TODO: Once Implemented
        // _preManager.revokePolicy(_policyId);
    }
}
