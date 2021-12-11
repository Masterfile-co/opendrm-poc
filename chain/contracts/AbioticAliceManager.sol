//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import {IPolicyManager} from "./IPolicyManager.sol";

import "hardhat/console.sol";

contract AbioticAliceManager {
    struct PolicyRequest {
        address recipient;
        address policyOwner;
        uint256 timestamp;
        string label;
    }

    struct Bob {
        bytes bobVerifyingKey;
        bytes bobDecryptingKey;
    }

    IPolicyManager private policyManager;
    bytes public verifyingKey;

    // Mapping from eth address to user verifying key
    mapping(address => Bob) public registry;
    mapping(bytes16 => PolicyRequest) public requests;

    event UserRegistered(
        address indexed user,
        bytes verifyingKey,
        bytes decryptingKey
    );
    event PolicyRequested(
        address indexed requestor,
        address indexed recipient,
        string label
    );
    event KfragsCreated(bytes16 indexed policyId, address ursula, bytes kfrag);

    constructor(IPolicyManager _policyManager, bytes memory _verifyingKey) {
        policyManager = _policyManager;
        verifyingKey = _verifyingKey;
    }

    function requestPolicy(string memory _label, address _recipient)
        public
        payable
    {
        bytes16 policyId = getPolicyId(_label, _recipient);

        console.logBytes16(policyId);

        requests[policyId] = PolicyRequest(
            _recipient,
            msg.sender,
            block.timestamp,
            _label
        );

        emit PolicyRequested(msg.sender, _recipient, _label);
    }

    /**
     * @dev TODO: onlyOwner
     */
    function createPolicy(
        bytes16 _policyId,
        uint64 _endTimestamp,
        address[] calldata _nodes,
        bytes[] calldata _kfrags
    ) public payable {

        // TODO: request validation

        policyManager.createPolicy{value: msg.value}(
            _policyId,
            requests[_policyId].policyOwner,
            _endTimestamp,
            _nodes
        );

        for (uint256 i; i < _nodes.length; i++) {
            emit KfragsCreated(_policyId, _nodes[i], _kfrags[i]);
        }
    }

    function registerMe(
        bytes calldata _bobVerifyingKey,
        bytes calldata _bobDecryptingKey
    ) external {
        registry[msg.sender] = Bob(_bobVerifyingKey, _bobDecryptingKey);
        emit UserRegistered(msg.sender, _bobVerifyingKey, _bobDecryptingKey);
    }

    function getPolicyId(string memory _label, address _recipient)
        internal
        view
        returns (bytes16 _policyId)
    {
        console.logBytes(verifyingKey);
        console.logBytes(registry[_recipient].bobVerifyingKey);
        

        return
            bytes16(
                keccak256(
                    abi.encodePacked(
                        verifyingKey,
                        registry[_recipient].bobVerifyingKey,
                        bytes(_label)
                    )
                )
            );
    }
}
