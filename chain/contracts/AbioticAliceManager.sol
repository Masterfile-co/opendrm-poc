// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.4;

import {LibNuCypher} from "./LibNuCypher.sol";
import {OpenDRM721} from "./OpenDRM721.sol";

import "hardhat/console.sol";

contract AbioticAliceManager {
    using LibNuCypher for string;

    struct Bob {
        bytes bobVerifyingKey;
        bytes bobDecryptingKey;
    }

    bytes public verifyingKey;

    // Mapping from eth address to user verifying key
    mapping(address => Bob) public registry;
    mapping(bytes16 => address payable) public policyIdToRequestor;

    event UserRegistered(
        address indexed user,
        bytes verifyingKey,
        bytes decryptingKey
    );
    event PolicyRequested(
        address indexed requestor,
        address indexed recipient,
        uint256 threshold,
        uint256 shares,
        uint256 paymentPeriods,
        string label
    );

    constructor(bytes memory _verifyingKey) {
        verifyingKey = _verifyingKey;
    }

    /**
     * @dev This should require some payment, most likely escrowed until request is fulfilled
     */
    function requestPolicy(
        string memory _labelSuffix,
        address _recipient,
        uint256 _threshold,
        uint256 _shares,
        uint256 _paymentPeriods
    ) public payable {
        require(_threshold <= _shares, "Error: Threshold > shares");

        string memory label = _labelSuffix.toLabel(msg.sender);

        bytes16 policyId = getPolicyId(label, _recipient);

        console.log("Policy requested with:");
        console.logBytes16(policyId);

        policyIdToRequestor[policyId] = payable(msg.sender);

        emit PolicyRequested(
            msg.sender,
            _recipient,
            _threshold,
            _shares,
            _paymentPeriods,
            label
        );
    }

    /**
     * @dev TODO: onlyOwner
     */
    function fulfillPolicy(
        bytes16 _policyId,
        uint64 _endTimestamp,
        uint256 _valueInWei,
        address[] calldata _nodes
    ) public payable {
        // TODO: request validation
        address payable requestor = policyIdToRequestor[_policyId];
        require(requestor != address(0), "Error: Invalid policyId");
        OpenDRM721(policyIdToRequestor[_policyId]).fulfillPolicy(
            _policyId,
            _endTimestamp,
            _valueInWei,
            _nodes
        );
    }

    /**
     * @notice Quick and dirty way to map eth material -> PRE material.
     * @dev Would be very nice to get rid of this step and have determanistic mapping
     */
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
        return
            _label.toPolicyId(
                verifyingKey,
                registry[_recipient].bobVerifyingKey
            );
    }
}
