node/goerli:
	yarn hardhat node --fork https://eth-goerli.alchemyapi.io/v2/NaRHL0aj6QXyhhP8lg2GOekiKT6kb2AD --hostname 0.0.0.0

node:
	yarn hardhat node --hostname 0.0.0.0

deploy:
	yarn hardhat deploy

deploy/local:
	yarn hardhat deploy --network localhost

listen:
	yarn hardhat run scripts/listen.ts --network localhost

transfer:
	yarn hardhat run scripts/transfer.ts --network localhost

typechain:
	yarn hardhat typechain 

typechain/client:
	TYPECHAIN_DIR=../client/types yarn hardhat typechain

typechain/server:
	TYPECHAIN_DIR=../server/src/types yarn hardhat typechain

install:
	yarn --registry http://localhost:4873/