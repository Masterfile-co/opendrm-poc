// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.13;

interface IPolicyManager {
    function policies(bytes16 _policyId)
        external
        view
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

    function revokePolicy(bytes16 _policyId)
        external
        returns (uint256 refundValue);

    function calculateRefundValue(bytes16 _policyId)
        external
        view
        returns (uint256 refundValue);

    function getArrangementsLength(bytes16 _policyId)
        external
        view
        returns (uint256);

    function revokeArrangement(bytes16 _policyId, address _node)
        external
        returns (uint256 refundValue);

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
    }

    function getCurrentPeriod() external view returns (uint16);
}
