# OpenDRM Proof of Concept Demo

[Try out the demo here!](https://opendrm-demo.masterfiledev.co/)

This is a proof of concept demo of the encrypted NFT protocol know as OpenDRM. We are leveraging Threshold's [Umbral PRE](https://www.nucypher.com/proxy-re-encryption) service to manage access to the underlying encrypted metadata associated with each NFT.

The goal of the OpenDRM protocol is to provide a completely decentralized digital rights management (DRM) solution. In the OpenDRM protocol, solely the holder of the NFT will have rights to decrypt and access the media underlying that NFT. Using OpenDRM, the metadata and media of an NFT can be stored in a public and decentralized storage solution (Arweave, IPFS) while still maintaining the same security guarantees as typical centralized DRM solutions.

Future extensions of the protocol will also include the ability to delegate access to decrypt the media at the will of the NFT holder. This will allow for OpenDRM enabled NFTs to potentially become yield bearing assets where the owner can charge for privileged access to their collection.

OpenDRM will also eventually rely on the upcoming NuCypher distributed key generation (DKG) protocol, codenamed Abiotic Alice, which is still in development. In this demo, the functionality of Abiotic Alice is handled by a centralized Alice server located in [server directory](server/)

It is recommended that the user is familiar with the workings of the [NuCypher network](https://docs.nucypher.com/en/latest/) if they wish to understand the OpenDRM protocol.

## OpenDRM Protocol Goals

- OpenDRM NFTs shall not rely on any centralized/trusted 3rd parties
- OpenDRM NFTs shall be backwards compatible with ERC721 standards
- OpenDRM NFTs shall be transferrable/sellable
- After transferring the NFT, the previous owner shall lose access to decrypt the underlying media

## Demo Steps

### Step 0: Initialization

In this demo, we are leveraging the NuCypher Ibex testnet (Mumbai/Goerli). We will utilize the existing `SubscriptionManager` contract on Mumbai for managing payments for PRE. We rename this PRESubscriptionManager in our demo to differentiate it from DKG payments. 

We initialize our demo by deploying two contracts on Mumbai, `OpenDRMCoordinator` and `DKGSubscriptionManager`. `DKGSubscriptionManager` is to manage access and payments for the AbioticAlice DKG service. `OpenDRMCoordinator` is a Masterfile specific contract for managing DKG subscriptions and launching new NFT contracts that will use OpenDRM. 

Our prototype of DKG payments follows very closely to the existing PRE payments mechanism. In the existing PRE system, a user creates a `policy` which is essentially subscription for the recipient of the policy to request PRE services from Ursulas. We extend this idea where `OpenDRMCoordinator` creates and pays for a subscription to DKG services by calling `DKGSubscriptionManager.createSubscription` and providing a list of `consumers` which would be other contracts allowed to request DKG services on its behalf. The `consumer` idea is based from the Chainlink v2 implementation but is probably optional (policy requests could be funneled back through the `OpenDRMCoordinator` contract).

The key question here is an economic one. For PRE policies, it is required to create a new policy for each recipient since a proxy reencryption step has to take place specifically for that individual. This is not the case with DKG subscriptions and so there is not a lot of obvious motivation to create new subscriptions. The only thing that would motivate an incremental subscription would be access/control of the subscription, or a requirement for differing subscription parameters (more/less security, etc). More thought is required here as we believe this will compress the number of subscriptions and require them to be more expensive.

An alternative to this would be to charge per `requestPolicy` call which is less desirable as cost/revenue is less predicable for both customer and AbioticAlice node.

```
                    ┌──────────────────┐          ┌──────────────────────┐                             
                    │OpenDRMCoordinator│          │DKGSubscriptionManager│                             
                    └──────────────────┘          └──────────────────────┘                             
                             │      createSubscription()     │                                         
                             │ ──────────────────────────────>                                         
                             │                               │                                         
                             │        `subscriptionId`       │                                         
                             │ <─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                                          
                             │                               │                                         
                             │                               │                                         
          ╔═══════╤══════════╪═══════════════════════════════╪════════════════════════════════════════╗
          ║ LOOP  │  deploy  │                               │                          │             ║
          ╟───────┘          │                               │                          │             ║
          ║                  │                       deploy()│                      ┌───────┐         ║
          ║                  │ ────────────────────────────────────────────────────>│ODRM721│         ║
          ║                  │                               │                      └───────┘         ║
          ║                  │                        `address`                         │             ║
          ║                  │ <─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │             ║
          ║                  │                               │                          │             ║
          ║                  │      addConsumer(address)     │                          │             ║
          ║                  │ ──────────────────────────────>                          │             ║
          ╚══════════════════╪═══════════════════════════════╪══════════════════════════╪═════════════╝
                             │                               │                          │              
                             │                               │                          │              

```

### Step 1: Connect Wallet

Step 1 of the demo is to connect your ethereum wallet to the application, we recommend using Metamask. The demo is operating on the Mumbai testnet. You will need testnet eth to interact with the demo. This can be acquired through the [Polygon Faucet](https://faucet.polygon.technology/)

### Step 2: Register NuCypher account

Step 2 is one we hope to eliminate in the future. NuCypher's PRE protocol uses a slightly different protocol for generating public/private key pairs than Ethereum. Therefore a user of the OpenDRM protocol will need to map their Ethereum public keys to their NuCypher public keys, so that Abiotic Alice knows the proper target for creating re-encryption key shares (`kFrags`).

We hope to find a solution in the near future to avoid the need for this step.

```
       ┌──────┐          ┌──────────────────┐
       │Client│          │OpenDRMCoordinator│
       └──┬───┘          └──────────────────┘
 secretKey│                       │
 ─────────>                       │
          │                       │
          │────┐                  │
          │    │ fromSecretKey()  │
          │<───┘                  │
          │                       │
          │  regsiter(pubicKeys)  │
          │ ──────────────────────>
          │                       │
          │       `success`       │
          │ <─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
          │                       │
          │                       │

```

### Step 3: Encrypt media and mint NFT

As the creator of an encrypted NFT (minter), you will essentially be assuming the role of `Enrico` in the NuCypher network scheme. The first step is to get the asymmetric encryption key which will be used to encrypt the underlying media of the NFT. This will be done by creating a `label` and sending it to `AbioticAlice`. We propose the following label standard where the user supplies a custom `labelSuffix` and the label prefix is created from onchain attributes to avoid label clashing. For the OpenDRM protocol demo, we will be using the `tokenId` as the `labelSuffix`:

```
label = {requesting contract address}{chainId}{labelSuffix}
```

This label will be sent to `AbioticAlice` where it will be combined with her secret material (key) to create an encrypting key. The minter will use this key to create a `MessageKit` containing the encrypted media and a `capsule` needed to decrypt the media. Both of these will be included in the metadata of the NFT.

```
                                           ┌─┐                ,.-^^-._ 
                                           ║"│               |-.____.-|
                                           └┬┘               |        |
                                           ┌┼┐               |        |
     ┌──────┐                               │                |        |
     │Client│                              ┌┴┐               '-.____.-'
     └──┬───┘                         AbioticAlice            Storage  
        │      getEncryptingKey(label)     │                     │     
        │ ─────────────────────────────────>                     │     
        │                                  │                     │     
        │          `encryptingKey`         │                     │     
        │ <─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                     │     
        │                                  │                     │     
        │────┐                                                   │     
        │    │ encrypt(media, encryptingKey)                     │     
        │<───┘                                                   │     
        │                                  │                     │     
        │       metadata(msgKit, capsule)  │                     │     
        │ ──────────────────────────────────────────────────────>│     
        │                                  │                     │     
        │                                  │                     │     
```

> Note: Currently Abiotic Alice responds to all `getEncryptingKey` requests. In the future this could  probably also be require a dkg subscription to since it requires an action by the nodes of AbioticAlice. 

Next comes the actual minting of the encrypted NFT. As the token is created (transferred from `0x00...00` to the minter) the `_beforeTokenTransfer` hook function is called. Within this function, the `requestPolicy` method on the `DKGSubscriptionManager` smart contract is invoked with details about what token is transferred to who, along with the policy details required for PRE and returns the `policyId` which is to be created. The `OpenDRM721` contract then creates a PRE policy on the `PRESubscriptionManager` (just called `SubscriptionManager` in the current Nucypher codebase) using the same `policyId` that was just returned. This allows for the policy request, policy creation, and token transfer to be fully atomic (if one fails, all fail).

```
     ┌───────┐          ┌──────────────────┐          ┌──────────────────────┐          ┌──────────────────────┐        
     │ODRM721│          │OpenDRMCoordinator│          │DKGSubscriptionManager│          │PRESubscriptionManager│        
     └───┬───┘          └──────────────────┘          └──────────────────────┘          └──────────────────────┘        
 mint()  │                       │                               │                                 │                    
 ───────>│                       │                               │                                 │                    
         │                       │                               │                                 │                    
         ────┐                                                   │                                 │                    
             │ beforeTokenTransfer                               │                                 │                    
         <───┘                                                   │                                 │                    
         │                       │                               │                                 │                    
         │   checkRegistry(to)   │                               │                                 │                    
         │───────────────────────>                               │                                 │                    
         │                       │                               │                                 │                    
         │     `publicKeys`      │                               │                                 │                    
         │<─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                               │                                 │                    
         │                       │                               │                                 │                    
         │       requestPolicy(publicKeys, ...policyInfo)        │                                 │                    
         │───────────────────────────────────────────────────────>                                 │                    
         │                       │                               │                                 │                    
         │                       │                               │                 emit PolicyRequested                 
         │                       │                               │ ────────────────────────────────────────────────────>
         │                       │                               │                                 │                    
         │                      `policyId`                       │                                 │                    
         │<───────────────────────────────────────────────────────                                 │                    
         │                       │                               │                                 │                    
         │                       │  createPolicy(policyId, ...policyInfo)                          │                    
         │─────────────────────────────────────────────────────────────────────────────────────────>                    
         │                       │                               │                                 │                    
         │                       │                               │                                 │ emit PolicyCreated 
         │                       │                               │                                 │ ──────────────────>
         │                       │                               │                                 │                    
         │                       │                `success`      │                                 │                    
         │<─────────────────────────────────────────────────────────────────────────────────────────                    
         │                       │                               │                                 │                    
         ────┐                   │                               │                                 │                    
             │ transfer(0x00, to)│                               │                                 │                    
         <───┘                   │                               │                                 │                    
         │                       │                               │                                 │                    
         │                       │                               │                                 │                    

```

> Improvement: Currently the public keys used in PRE are 33 bytes. Since we believe it is now required to send these credentials to AbioticAlice through and on-chain action, this makes it highly inefficient as memory in the EVM are packed in 32 byte increments. Somehow switching to a 32 byte key, or (better yet) allowing some standard way to derive Nucypher public keys directly from ethereum addresses would solve this problem.

### Step 4: Decrypt your NFT

Once the above process is complete, the minter will be able to request the `EnactedPolicy` details from `AbioticAlice` using the `policyId` (derived from the public NuCypher keys of `AbioticAlice` and the minter, as well as the label used to encrypt the NFT media). The `EnactedPolicy` contains all the information needed to request `cFrags` from the `Ursulas` associated with the `policy`, allowing the minter to decrypt the NFT media.

```
                                             ┌─┐                  ┌─┐            
                                             ║"│                  ║"│            
                                             └┬┘                  └┬┘            
                                             ┌┼┐                  ┌┼┐            
                    ┌──────┐                  │                    │             
                    │Client│                 ┌┴┐                  ┌┴┐            
                    └──┬───┘            AbioticAlice            Ursula           
                       │ getPolicy(policyId) │                    │              
                       │ ────────────────────>                    │              
                       │                     │                    │              
                       │   `EnactedPolicy`   │                    │              
                       │ <─ ─ ─ ─ ─ ─ ─ ─ ─ ─                     │              
                       │                     │                    │              
                       │                     │                    │              
          ╔═══════╤════╪═════════════════════╪════════════════════╪═════════════╗
          ║ LOOP  │  for n of m              │                    │             ║
          ╟───────┘    │                     │                    │             ║
          ║            │             proxyReencrypt()             │             ║
          ║            │ ─────────────────────────────────────────>             ║
          ║            │                     │                    │             ║
          ║            │                  `cfrag`                 │             ║
          ║            │ <─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─             ║
          ╚════════════╪═════════════════════╪════════════════════╪═════════════╝
                       │                     │                    │              
                       │────┐                                     │              
                       │    │ decrypt([cfrag])                    │              
                       │<───┘                                     │              
                       │                     │                    │              
                       │                     │                    │              

```

> Note: In this implementation `AbioticAlice` actively listens for `policyRequested` events and caches the EnactedPolicy. This lowers the latency when the client requests the policy. An alternative would be only to create the policy when first queried for it. This would increase the latency as each Alice node would have to check the chain for a valid `PolicyRequest` and then coordinate with other Alice nodes to create the policy. It also would require we store `PolicyRequests` onchain (currently not doing) but there could be other benefits to doing this as well. 

### Step 5: Transfer your NFT

When the minter would like to sell or transfer their NFT to someone else (`Bob` in this demo), they would call the standard ERC721 `transferFrom` method. As the transfer is occurring, the `_beforeTokenTransfer` hook mentioned above is again called. Since there is now an active policy associated with this NFT, the `_beforeTokenTransfer` hook will first call `PRESubscription.revokePolicy` before continuing on with the process mentioned in step 3. This will remove the minter's ability to request `cFrags` from `Ursulas` since there is now no active policy for them, effectively disabling the ability of the minter to decrypt the NFT media going forward.

This cycle is repeated for all subsequent transfers so that once the NFT is transferred, the previous owner loses access (immediately and atomically) and the new owner gains access (after the policy is created).

```
     ┌───────┐          ┌──────────────────┐          ┌──────────────────────┐          ┌──────────────────────┐        
     │ODRM721│          │OpenDRMCoordinator│          │DKGSubscriptionManager│          │PRESubscriptionManager│        
     └───┬───┘          └──────────────────┘          └──────────────────────┘          └──────────────────────┘        
 mint()  │                       │                               │                                 │                    
 ───────>│                       │                               │                                 │                    
         │                       │                               │                                 │                    
         ────┐                                                   │                                 │                    
             │ beforeTokenTransfer                               │                                 │                    
         <───┘                                                   │                                 │                    
         │                       │                               │                                 │                    
         │                       │        revokePolicy(oldPolicyId)                                │                    
         │─────────────────────────────────────────────────────────────────────────────────────────>                    
         │                       │                               │                                 │                    
         │   checkRegistry(to)   │                               │                                 │                    
         │───────────────────────>                               │                                 │                    
         │                       │                               │                                 │                    
         │     `publicKeys`      │                               │                                 │                    
         │<─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                               │                                 │                    
         │                       │                               │                                 │                    
         │       requestPolicy(publicKeys, ...policyInfo)        │                                 │                    
         │───────────────────────────────────────────────────────>                                 │                    
         │                       │                               │                                 │                    
         │                       │                               │                 emit PolicyRequested                 
         │                       │                               │ ────────────────────────────────────────────────────>
         │                       │                               │                                 │                    
         │                     `newPolicyId`                     │                                 │                    
         │<───────────────────────────────────────────────────────                                 │                    
         │                       │                               │                                 │                    
         │                       │createPolicy(newPolicyId, ...policyInfo)                         │                    
         │─────────────────────────────────────────────────────────────────────────────────────────>                    
         │                       │                               │                                 │                    
         │                       │                               │                                 │ emit PolicyCreated 
         │                       │                               │                                 │ ──────────────────>
         │                       │                               │                                 │                    
         │                       │                `success`      │                                 │                    
         │<─────────────────────────────────────────────────────────────────────────────────────────                    
         │                       │                               │                                 │                    
         ────┐                   │                               │                                 │                    
             │ transfer(from, to)│                               │                                 │                    
         <───┘                   │                               │                                 │                    
         │                       │                               │                                 │                    
         │                       │                               │                                 │                    

```

> Note: In the switch to Polygon, Nucypher dropped the `revokePolicy` functionality. We will require this functionality be restored before OpenDRM can be live in a fully decentralized manner. 

## Improvements Needed

- Abiotic Alice dispute mechanisms
- Incorporating decentralized Abiotic Alice (when launched)
- Extending DKG subscriptions and PRE policies after they expire
- Deterministic mapping of Eth wallet -> NuCypher wallet
- Treasury management for handling continual payments for DKG and PRE
