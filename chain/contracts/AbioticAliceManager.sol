//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

contract AbioticAliceManager {
    bytes private verifyingKey;

    constructor(bytes memory _verifyingKey) {
        verifyingKey = _verifyingKey;
    }

    function requestKfrags(string memory label, string memory bobPk)
        public
        view
        returns (string memory)
    {}

    function getVerifyingKey()
        external
        view
        returns (bytes memory _verifyingKey)
    {
        return verifyingKey;
    }
}
