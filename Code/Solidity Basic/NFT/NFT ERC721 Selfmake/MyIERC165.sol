// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface MyIERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
