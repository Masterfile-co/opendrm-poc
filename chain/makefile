node/goerli:
	yarn hardhat node --fork ${GOERLI_URL} --hostname 0.0.0.0

node/mumbai:
	yarn hardhat node --fork ${MUMBAI_URL} --fork-block-number 25941385 --hostname 0.0.0.0

node:
	yarn hardhat node --hostname 0.0.0.0

deploy:
	yarn hardhat deploy

deploy/local:
	yarn hardhat deploy --network localhost

deploy/goerli:
	yarn hardhat deploy --network goerli

deploy/mumbai:
	yarn hardhat deploy --network mumbai

transfer:
	yarn hardhat run scripts/transfer.ts --network localhost

mint:
	yarn hardhat run scripts/mint.ts --network localhost

revoke:
	yarn hardhat run scripts/revoke.ts --network localhost

getPolicy:
	yarn hardhat run scripts/getPolicy.ts --network localhost

typechain:
	yarn hardhat typechain 

typechain/client:
	TYPECHAIN_DIR=../client/types yarn hardhat typechain

typechain/server:
	TYPECHAIN_DIR=../server/src/types yarn hardhat typechain

verify:
	yarn hardhat etherscan-verify --network mumbai

install:
	yarn --registry http://localhost:4873/