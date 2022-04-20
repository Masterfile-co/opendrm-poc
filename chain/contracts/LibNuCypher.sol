// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.13;

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

    function toLabel(string memory labelSuffix, address requestor)
        internal
        view
        returns (string memory label)
    {
        return
            string(
                abi.encodePacked(
                    _toString(requestor),
                    _toString(block.chainid),
                    labelSuffix
                )
            );
    }

    function _toString(address addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(addr)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
