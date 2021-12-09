node/goerli:
	yarn hardhat node --fork https://eth-goerli.alchemyapi.io/v2/NaRHL0aj6QXyhhP8lg2GOekiKT6kb2AD --hostname 0.0.0.0

node:
	yarn hardhat node --hostname 0.0.0.0

deploy:
	yarn hardhat deploy

deploy/local:
	yarn hardhat deploy --network localhost

script:
	yarn hardhat run scripts/getPolicyId.ts --network localhost

typechain:
	yarn hardhat typechain 

typechain/client:
	TYPECHAIN_DIR=../client/types yarn hardhat typechain