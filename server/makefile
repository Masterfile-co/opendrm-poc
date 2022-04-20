

install:
	yarn 

up/local: DKG_MANAGER_ADDRESS=0x2BDeC9e49795B4Af28D66d2e73B2e61a932F9F64
up/local:
	yarn dev

up/mumbai:
	export NETWORK=mumbai && yarn dev

up/goerli:
	export NETWORK=goerli && yarn dev

start: export NETWORK=goerli
start:
	yarn start

build:
	docker build -t 634967882344.dkr.ecr.us-west-2.amazonaws.com/dev:opendrm-server-$(GIT_SHA) .

build/dev:
	yarn build

run: export NETWORK=goerli
run:
	@export NETWORK=goerli && docker run -p 3001:3001 -e PORT=$(PORT) -e GOERLI_URL=$(GOERLI_URL) -e NETWORK=$(NETWORK) -e ALICE_PRIVATE_KEY=$(ALICE_PRIVATE_KEY) -e ALICE_NU_SECRET_KEY=$(ALICE_NU_SECRET_KEY) -e ABIOTIC_ALICE_MANAGER_ADDRESS=$(ABIOTIC_ALICE_MANAGER_ADDRESS) opendrm-server

push: ## Push production image of service to respository
	@docker push 634967882344.dkr.ecr.us-west-2.amazonaws.com/dev:opendrm-server-$(GIT_SHA)

clean: ## Clean up docker build
	@docker rmi 634967882344.dkr.ecr.us-west-2.amazonaws.com/dev:opendrm-server-$(GIT_SHA)

deploy: ## Deploy image to dev environment
	@NOMAD_VAR_DOMAIN=masterfiledev.co NOMAD_VAR_IMAGETAG=$(TAG) nomad job run -address $(ADDRESS) -verbose -detach server.nomad