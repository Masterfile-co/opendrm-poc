

install:
	yarn --registry http://localhost:4873/

up/local:
	yarn dev

up/goerli:
	export NETWORK=goerli && yarn dev

start:
	yarn start

build:
	docker build -t opendrm-server:latest -t opendrm-server:$(GIT_SHA) -t 634967882344.dkr.ecr.us-west-2.amazonaws.com/masterfile:opendrm-server-$(GIT_SHA) -t 634967882344.dkr.ecr.us-west-2.amazonaws.com/masterfile:opendrm-server-latest .

build/dev:
	yarn build

run:
	@docker run -e PORT=$(PORT) -e NETWORK=$(NETWORK) -e ALICE_PRIVATE_KEY=$(ALICE_PRIVATE_KEY) -e ALICE_NU_SECRET_KEY=$(ALICE_NU_SECRET_KEY) -e ABIOTIC_ALICE_MANAGER_ADDRESS=$(ABIOTIC_ALICE_MANAGER_ADDRESS) opendrm-server