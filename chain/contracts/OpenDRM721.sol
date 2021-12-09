//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AbioticAliceManager} from "./AbioticAliceManager.sol";

import "hardhat/console.sol";

interface IPolicyManager {
    function policies(bytes16 _policyId)
        external
        returns (Policy memory policy);

    /**
     * @notice Create policy
     * @dev Generate policy id before creation
     * @param _policyId Policy id
     * @param _policyOwner Policy owner. Zero address means sender is owner
     * @param _endTimestamp End timestamp of the policy in seconds
     * @param _nodes Nodes that will handle policy
     */
    function createPolicy(
        bytes16 _policyId,
        address _policyOwner,
        uint64 _endTimestamp,
        address[] calldata _nodes
    ) external payable;

    struct ArrangementInfo {
        address node;
        uint256 indexOfDowntimePeriods;
        uint16 lastRefundedPeriod;
    }

    struct Policy {
        bool disabled;
        address payable sponsor;
        address owner;
        uint128 feeRate;
        uint64 startTimestamp;
        uint64 endTimestamp;
        uint256 reservedSlot1;
        uint256 reservedSlot2;
        uint256 reservedSlot3;
        uint256 reservedSlot4;
        uint256 reservedSlot5;
        ArrangementInfo[] arrangements;
    }
}

contract OpenDRM721 is ERC721 {
    IPolicyManager private PolicyManager;
    AbioticAliceManager private AbioticAlice;

    mapping(uint256 => string) labels;

    constructor(address _policyManager, address _abioticAlice)
        ERC721("OpenDRM POC", "ODRM")
    {
        PolicyManager = IPolicyManager(_policyManager);
        AbioticAlice = AbioticAliceManager(_abioticAlice);
    }

    function mint(uint256 tokenId, string memory label) public {
        _safeMint(msg.sender, tokenId);
        labels[tokenId] = label;
    }

    function encryptedTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory fromPublicKey,
        bytes memory toPublicKey,
        uint64 _endTimestamp,
        address[] calldata _nodes
    ) public payable {
        bytes memory aaVerifyingKey = AbioticAlice.getVerifyingKey();
        // Deal with previous policy
        {
            bytes16 previousPolicyId = bytes16(
                keccak256(
                    abi.encodePacked(
                        aaVerifyingKey,
                        fromPublicKey,
                        bytes("label")
                    )
                )
            );
            // Check to see if policy is active and we own it
            // if (
            //     PolicyManager.policies(previousPolicyId).owner == address(this)
            // ) {}
        }
        // Deal with new policy
        {
            bytes16 newPolicyId = bytes16(
                keccak256(
                    abi.encodePacked(
                        aaVerifyingKey,
                        toPublicKey,
                        bytes("label")
                    )
                )
            );
            PolicyManager.createPolicy(
                newPolicyId,
                address(this),
                _endTimestamp,
                _nodes
            );
        }
    }

    function getPolicy(
        bytes16 _policyId,
        uint64 _endTimestamp,
        address[] calldata _nodes
    ) public payable {
        PolicyManager.createPolicy{value: msg.value}(
            _policyId,
            address(0),
            _endTimestamp,
            _nodes
        );
    }
}
