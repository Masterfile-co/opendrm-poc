// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {LibNuCypher} from "../LibNuCypher.sol";

struct PolicyRequest {
    uint16 size;
    uint16 threshold;
    // TODO: Keys are 33 bytes.
    bytes verifyingKey;
    bytes decryptingKey;
    uint32 startTimestamp;
    uint32 endTimestamp;
}

contract DKGSubscriptionManager is Ownable {
    using LibNuCypher for string;

    // ERRORS
    error NotSubscriptionOwner(uint256 subscriptionId, address caller);
    error NotSubscriptionConsumer(uint256 subscriptionId, address caller);
    error InvalidFunding(uint256 fundsRequired, uint256 fundsProvided);
    error SubscriptionExpired(uint256 subscriptionId);

    // EVENTS
    event SubscriptionCreated(
        uint256 indexed subscriptionId,
        address indexed owner,
        uint16 dkgNodes,
        uint32 endTimestamp
    );
    event ConsumerAdded(
        uint256 indexed subscriptionId,
        address indexed consumer
    );
    event PolicyRequested(
        uint256 indexed subscriptionId,
        address indexed consumer,
        bytes16 indexed policyId,
        string label,
        PolicyRequest policyRequest
    );

    // TODO: Pack Struct
    struct SubscriptionConfig {
        address payable owner;
        // Security level of dkg
        uint16 dkgNodes;
        // When subscription ends
        uint32 endTimestamp;
        uint16 numConsumers;
    }

    // This could also be a mapping to accommodate multiple AbioticAlice with varying security levels
    bytes public verifyingKey;
    // Per-second, per-node service fee rate
    uint256 public feeRate;
    uint256 internal subscriptionNonce;

    mapping(uint256 => SubscriptionConfig) public subscriptions;
    mapping(address => mapping(uint256 => uint256)) public consumers;

    modifier onlySubscriber(uint256 _subscriptionId) {
        if (subscriptions[_subscriptionId].owner != msg.sender) {
            revert NotSubscriptionOwner(_subscriptionId, msg.sender);
        }
        _;
    }

    modifier onlyConsumer(uint256 _subscriptiondId) {
        if (consumers[msg.sender][_subscriptiondId] == 0) {
            revert NotSubscriptionConsumer(_subscriptiondId, msg.sender);
        }
        _;
    }

    constructor(bytes memory _verifyingKey, uint256 _feeRate) {
        verifyingKey = _verifyingKey;
        feeRate = _feeRate;
    }

    function createSubscription(
        uint16 _dkgNodes,
        // Duration of subscription
        uint32 _duration
    ) external payable returns (uint256 subscriptionId) {
        // TODO: Check payment
        uint256 requiredPayment = _dkgNodes * _duration * feeRate;

        if (requiredPayment != msg.value) {
            revert InvalidFunding(requiredPayment, msg.value);
        }

        uint32 endTimestamp = uint32(block.timestamp + _duration);

        // Save config
        subscriptions[subscriptionNonce] = SubscriptionConfig(
            payable(msg.sender),
            _dkgNodes,
            endTimestamp,
            1
        );
        // Add owner as consumer
        consumers[msg.sender][subscriptionNonce] = 1;

        subscriptionNonce += 1;
        emit SubscriptionCreated(
            subscriptionId,
            msg.sender,
            _dkgNodes,
            endTimestamp
        );
        emit ConsumerAdded(subscriptionId, msg.sender);
    }

    // function extendSubscription(uint256 _subscriptionId, uint256 _duration)
    //     external
    //     payable
    //     onlySubscriber(_subscriptionId)
    // {
    //     // TODO: Emit Event
    // }

    /**
     *
     */
    function addConsumer(uint256 _subscriptionId, address _consumer)
        external
        onlySubscriber(_subscriptionId)
    {
        // TODO: Set max consumers per subscription
        consumers[_consumer][_subscriptionId] = 1;
        subscriptions[_subscriptionId].numConsumers += 1;

        emit ConsumerAdded(_subscriptionId, _consumer);
    }

    /**
     * @dev consumer is responsible for making sure that these parameters line up with
     * @dev polcy created on PRE SubscriptionManager
     */
    function requestPolicy(
        uint256 _subscriptionId,
        string memory _labelSuffix,
        // TODO: Check the size of these keys
        PolicyRequest memory _policyRequest
    )
        external
        onlyConsumer(_subscriptionId)
        returns (bytes16 policyId, string memory label)
    {
        if (subscriptions[_subscriptionId].endTimestamp < block.timestamp) {
            revert SubscriptionExpired(_subscriptionId);
        }

        // Requestor provides a uuid for their label. We append it to the
        // requesting address so we dont get conflicting labels
        label = _labelSuffix.toLabel(msg.sender);

        // Derive the policy id by hashing label, alice verifying key, and bob verifying key
        // This doesn't technically need to be on chain but is a big convience since
        // the user will most likely directly call the PRE createPolicy method after this.
        policyId = label.toPolicyId(verifyingKey, _policyRequest.verifyingKey);

        emit PolicyRequested(
            _subscriptionId,
            msg.sender,
            policyId,
            label,
            _policyRequest
        );
    }

    function sweep(address payable recipient) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool sent, ) = recipient.call{value: balance}("");
        require(sent, "Failed transfer");
    }
}
