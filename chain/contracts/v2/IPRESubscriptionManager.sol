// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.13;

interface IPRESubscriptionManager {
    struct Policy {
        address payable sponsor;
        uint32 startTimestamp;
        uint32 endTimestamp;
        uint16 size; // also known as `N`
        // There's still 2 bytes available here
        address owner;
    }

    function createPolicy(
        bytes16 _policyId,
        address _policyOwner,
        uint16 _size,
        uint32 _startTimestamp,
        uint32 _endTimestamp
    ) external payable;

    /**
     * @dev not yet implemented
     */
    function revokePolicy(bytes16 _policyId) external;

    function getPolicy(bytes16 _policyID) external view returns (Policy memory);

    function isPolicyActive(bytes16 _policyID) external view returns (bool);

    function getPolicyCost(
        uint16 _size,
        uint32 _startTimestamp,
        uint32 _endTimestamp
    ) external view returns (uint256);
}
