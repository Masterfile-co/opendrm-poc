# OpenDRM Proof of Concept Demo

This is a proof of concept demo of the encrypted NFT protocol know as OpenDRM. We are leveraging NuCypher (soon to be Threshold) [Umbral PRE](https://www.nucypher.com/proxy-re-encryption) service to manage access to the underlying encrypted metadata associated with each NFT. 

The goal of the OpenDRM protocol is to provide a completely decentralized digital rights management (DRM) solution. In the OpenDRM protocol, solely the holder of the NFT will have rights to decrypt and access the media underlying that NFT. Future extensions of the protocol will also include the abilty to deletate access to decrypt the media at the will of the NFT holder. This will allow for OpenDRM enabled NFTs to potentially become yield bearing assets where the owner can charge for privlidged access to their collection. 

OpenDRM will also eventually rely on the upcoming NuCypher distributed key generation (DKG) protocol, codenamed Abiotic Alice, which is still in development. In this demo, the functionality of Abiotic Alice is handled by a centralized Alice server located in [server directory](server/)

It is reccomended that the user is familair with the workings of the [NuCypher network](https://docs.nucypher.com/en/latest/) if they wish to understand the OpenDRM protocol.

## OpenDRM Protocol Goals

- OpenDRM NFTs shall not rely on any centralized/trusted 3rd parties 
- OpenDRM NFTs shall be backwards compatible with ERC721 standards
- OpenDRM NFTs shall be transferrable/sellable
- After transferring the NFT, the previous owner shall lose access to decrypt the underlying media

## Demo Steps

### Step 1: Connect Wallet

Step 1 of the demo is to connect your ethereum wallet to the application, we reccomend using Metamask. The demo is operating on the Goerli testnet. You will need testnet eth to interact with the demo. This can be aquired through the [Paradigm Faucet](https://faucet.paradigm.xyz/)

### Step 2: Register NuCypher account

Step 2 is one we hope to eliminate in the future. NuCypher's PRE protocol uses a slightly different protocol for generating public/private key pairs than Ethereum. Therefore a user of the OpenDRM protocol will need to map their Ethereum public keys to their NuCypher public keys, so that Abiotic Alice knows the proper target for creating re-encryption key shares (`kFrags`). 

We hope to find a solution in the near future to avoid the need for this step.

![Screen Shot 2021-12-16 at 2 51 05 PM](https://user-images.githubusercontent.com/54160127/146447205-637fd0be-387a-4fc8-98b6-a2ba61a0792d.png)

### Step 3: Encrypt media and mint NFT

As the creator of an encrypted NFT (minter), you will essentially be assuming the role of `Enrico` in the NuCypher network scheme. The first step is to get the asymetric encryption key which will be used to encrypt the underlying media of the NFT. This will be done by creating a `label` and sending it to `Alice`. For the OpenDRM protocol demo, we will be using the following labeling schema:

```
label = {nft contract address}{chainId}{tokenId}
```

This label will be sent to `Alice` where it will be combined with her secret material (key) to create an encrypting key. The minter will use this key to create a `MessageKit` containing the encrypted media and a `capsule` needed to decrypt the media. Both of these will be included in the metadata of the NFT.

![Screen Shot 2021-12-16 at 2 35 14 PM](https://user-images.githubusercontent.com/54160127/146445266-01a59a88-6a2e-4ebc-bc43-9d7ff58cc9a6.png)

Next comes the actual minting of the encrypted NFT. As the token is created (transfered from `0x00...00` to the minter) the `_beforeTokenTransfer` hook function is called. Within this function, the `requestPolicy` method on the `AbioticAliceManager` smart contract is invoked with details about what token is transferred to who, along with the policy details required for PRE. 

In this demo `Abiotic Alice` (or the centralized stand in for her) is modeled after the Chainlink oracle architecture, using a request/recieve data cycle. `Abiotic Alice` will be listening for the `PolicyRequested` event, emitted within the `requestPolicy` function and containing the details needed for creating the supporting materials for a new `Policy`. `AbioticAlice` will then call the `fulfillPolicy` method on `AbioticAliceManager` passing in the policy details (nodes, cost, etc). This will be forwarded to the `OpenDRM721.fulfillPolicy` method which is responsible for the creation of a new policy by calling `PolicyManager.createPolicy`. 

![Screen Shot 2021-12-16 at 2 53 03 PM](https://user-images.githubusercontent.com/54160127/146447403-bd7305a8-8706-46ec-ae9a-54dd97ceab74.png)

### Step 4: Decrypt your NFT

Once the above process is complete, the minter will be able to request the `EnactedPolicy` details from `AbioticAlice` using the `policyId` (derived from the public NuCypher keys of `AbioticAlice` and the minter, as well as the label used to encrypt the NFT media). The `EnactedPolicy` contains all the information needed to request `cFrags` from the `Ursulas` associated with the `policy`, allowing the minter to decrypt the NFT media. 

![Screen Shot 2021-12-16 at 3 11 52 PM](https://user-images.githubusercontent.com/54160127/146449656-e8e2a421-61a1-41ff-b4a2-5eb4b0a8061d.png)

### Step 5: Transfer your NFT

When the minter would like to sell or transfer their NFT to someone else (`Bob` in this demo), they would call the standard ERC721 `transferFrom` method. As the transfer is occuring, the `_beforeTokenTransfer` hook mentioned above is again called. Since there is now an active policy associated with this NFT, the `_beforeTokenTransfer` hook will first call `PolicyManager.revokePolicy` before continuing on with the process mentioned in step 3. This will remove the minter's ability to request `cFrags` from `Ursulas` since there is now no active policy for them, effectively disabling the ability of the minter to decrypt the NFT media going forward.

![Screen Shot 2021-12-16 at 2 57 54 PM](https://user-images.githubusercontent.com/54160127/146447985-d8207578-101b-4561-a93e-4f558e4a3c97.png)

This cycle is repeated for all subsequent transfers so that once the NFT is transfered, the previous owner loses access (immediately and atomicly) and the new owner gains access (after the policy is created).

## Improvements Needed

- Payment mechanisms for Abiotic Alice
- Abiotic Alice dispute mechanisms
- Incorperating decentralized Abiotic Alice (when launched)
- Extending PRE policies after they expire
- Determanistic mapping of Eth wallet -> NuCypher wallet
- Treasury management for handling payments to Abiotic Alice and PRE
  
