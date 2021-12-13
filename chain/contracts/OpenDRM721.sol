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

    mapping(uint256 => string) labels;

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
        string memory label = getLabel(tokenId);

        _safeMint(msg.sender, tokenId);
        labels[tokenId] = label;
    }

    function getLabel(uint256 tokenId)
        public
        view
        returns (string memory label)
    {
        // label = contractId-tokenId-chainId
        return
            string(
                abi.encodePacked(
                    _addressToString(address(this)),
                    tokenId.toString(),
                    chainId.toString()
                )
            );
    }

    function revokePolicy(bytes16 _policyId) external {
        policyManager.revokePolicy(_policyId);
    }

    function getPolicy(bytes16 _policyId)
        public
        view
        returns (IPolicyManager.Policy memory _policy)
    {
        return policyManager.policies(_policyId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        string memory label = getLabel(tokenId);

        {
            // Revoke old policy
            (bytes memory bobVerifyingKey, ) = abioticAlice.registry(from);

            bytes16 policyId = label.toPolicyId(
                abioticAlice.verifyingKey(),
                bobVerifyingKey
            );

            console.logBytes16(policyId);

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

        abioticAlice.requestPolicy(label, to);
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
}
