// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.13;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {DKGSubscriptionManager} from "./DKGSubscriptionManager.sol";
import {IPRESubscriptionManager} from "./IPRESubscriptionManager.sol";
import {OpenDRMCoordinator} from "./OpenDRMCoordinator.sol";
import {LibNuCypher} from "../LibNuCypher.sol";
import {OpenDRMConsumer} from "./OpenDRMConsumer.sol";

import "hardhat/console.sol";

contract OpenDRM721v2 is ERC721Upgradeable, OpenDRMConsumer {
    using Strings for uint256;
    using LibNuCypher for string;

    error InsufficientMintFunds(uint256 fundsRequired, uint256 fundsReceived);

    OpenDRMCoordinator private _openDrmCoordinator;

    mapping(bytes16 => bool) isValidPolicy;

    uint16 constant _size = 3;
    uint16 constant _threshold = 2;
    uint32 constant _duration = 86000;

    function initialize(
        DKGSubscriptionManager dkgManager_,
        IPRESubscriptionManager preManager_,
        string memory name_,
        string memory symbol_
    ) external initializer {
        __ERC721_init(name_, symbol_);
        __ERC165_init();
        __OpenDRMConsumer__init(dkgManager_, preManager_);

        _openDrmCoordinator = OpenDRMCoordinator(msg.sender);
    }

    function mint(uint256 tokenId) public payable {
        console.log("running");
        // pre feeRate * _size * _duration = cpp (cost per policy)
        // cpp * 100 = cost of minting funds 100 future transfers

        // This is to simulate the foundation tokenomics model we are thinking for OpenDRM
        // In realitity it will be time based rather than transfer based as you should
        // recover unused funds when revoking an active policy

        // Ideally this mintRate fee will be deposited in some yield bearing protocol. The yield
        // from this should be enough to cover a perpetual active policy for the token holder
        uint256 mintRate = 1000000000 * 3 * 86000 * 100;

        if (msg.value < mintRate) {
            console.log("failing");
            revert InsufficientMintFunds(mintRate, msg.value);
        }

        _safeMint(msg.sender, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        console.log("_beforeTokenTransfer");
        string memory label = getFullLabel(tokenId);

        bytes16 policyId;
        bytes memory aliceVerifyingKey = _aliceVerifyingKey();

        // Revoke old policy
        {
            console.log("revoking old policy");
            (bytes memory verifyingKey, ) = _openDrmCoordinator.checkRegistry(
                from
            );

            policyId = label.toPolicyId(aliceVerifyingKey, verifyingKey);

            revokePolicy(policyId);

            isValidPolicy[policyId] = false;
        }
        // Request new policy
        {
            console.log("requesting new policy");
            (
                bytes memory verifyingKey,
                bytes memory decryptingKey
            ) = _openDrmCoordinator.checkRegistry(to);

            // TODO: Handle if user not registered. Can probably skip policy and let them create one later?

            policyId = label.toPolicyId(aliceVerifyingKey, verifyingKey);

            isValidPolicy[policyId] = true;
            console.log("calling internal create policy");
            createPolicy(
                policyId,
                _size,
                _threshold,
                uint32(block.timestamp),
                uint32(block.timestamp + _duration),
                _openDrmCoordinator.subscriptionId(),
                verifyingKey,
                decryptingKey
            );
        }
    }

    function getFullLabel(uint256 tokenId)
        public
        view
        returns (string memory label)
    {
        return tokenId.toString().toLabel(address(this));
    }
}
