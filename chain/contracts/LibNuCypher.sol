//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

library LibNuCypher {
    function toPolicyId(
        string memory label,
        bytes memory aliceVerifyingKey,
        bytes memory bobVerifyingKey
    ) internal pure returns (bytes16 policyId) {
        return
            bytes16(
                keccak256(
                    abi.encodePacked(aliceVerifyingKey, bobVerifyingKey, label)
                )
            );
    }
}
