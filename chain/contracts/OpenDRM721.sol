//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {AbioticAliceManager} from "./AbioticAliceManager.sol";
import {IPolicyManager} from "./IPolicyManager.sol";
import {LibNuCypher} from "./LibNuCypher.sol";

import "hardhat/console.sol";

contract OpenDRM721 is ERC721 {
    using Strings for uint256;
    using LibNuCypher for string;

    event PolicyRevoked(bytes16 policyId);

    IPolicyManager private policyManager;
    AbioticAliceManager private abioticAlice;
    uint256 private chainId;

    mapping(bytes16 => bool) validPolicy;

    modifier onlyAlice() {
        require(
            msg.sender == address(abioticAlice),
            "Only callable by AbioticAliceManager"
        );
        _;
    }

    constructor(
        IPolicyManager _policyManager,
        AbioticAliceManager _abioticAlice
    ) ERC721("OpenDRM POC", "ODRM") {
        policyManager = _policyManager;
        abioticAlice = _abioticAlice;
        uint256 _chainId;
        assembly {
            _chainId := chainid()
        }
        chainId = _chainId;
    }

    function mint(uint256 tokenId) public {
        _safeMint(msg.sender, tokenId);
    }

    function getFullLabel(uint256 tokenId)
        public
        view
        returns (string memory label)
    {
        return tokenId.toString().toLabel(address(this));
    }

    function getPolicy(bytes16 _policyId)
        public
        view
        returns (IPolicyManager.Policy memory _policy)
    {
        return policyManager.policies(_policyId);
    }

    function fulfillPolicy(
        bytes16 _policyId,
        uint64 _endTimestamp,
        uint256 _valueInWei,
        address[] calldata _nodes
    ) external payable onlyAlice {
        // If token gets transfered multiple times before policy is fulfilled,
        // only actually create a policy for the last holder

        if (validPolicy[_policyId]) {
            // Should potentially do some verification of _valueInWei here so we dont have to trust Alice totally

            policyManager.createPolicy{value: _valueInWei}(
                _policyId,
                address(0),
                _endTimestamp,
                _nodes
            );
            console.log("Policy fulfilled");
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        string memory label = getFullLabel(tokenId);

        bytes memory aliceVerifyingKey = abioticAlice.verifyingKey();
        bytes16 policyId;
        {
            // Revoke old policy
            (bytes memory fromVerifyingKey, ) = abioticAlice.registry(from);

            policyId = label.toPolicyId(aliceVerifyingKey, fromVerifyingKey);
            validPolicy[policyId] = false;
            console.log("Previous Policy");
            console.logBytes16(policyId);

            // TODO: make a request to check if policy is valid instead of blindly revoking
            try policyManager.revokePolicy(policyId) returns (uint256 refund) {
                console.log("Revoke Succeeded, Refund:");
                console.log(refund);
                emit PolicyRevoked(policyId);
            } catch Error(string memory _err) {
                console.log(_err);
                console.log("Revoke Failed");
            } catch {
                console.log("Revoke Failed");
            }
        }
        {
            // Handle new policy
            (bytes memory toVerifyingKey, ) = abioticAlice.registry(to);

            policyId = label.toPolicyId(aliceVerifyingKey, toVerifyingKey);
            console.log("New Policy");
            console.logBytes16(policyId);
            validPolicy[policyId] = true;

            // Hardcoding policy details for now
            abioticAlice.requestPolicy(tokenId.toString(), to, 2, 3, 3);
        }
    }

    function _addressToString(address addr)
        internal
        pure
        returns (string memory)
    {
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

    receive() external payable {}
}
