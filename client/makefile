install:
	yarn

up:
	yarn dev

build:
	@docker build -t 634967882344.dkr.ecr.us-west-2.amazonaws.com/dev:opendrm-client-$(GIT_SHA) .

build/dev:
	yarn build

start:
	yarn start

run: export ABIOTIC_ALICE_URL=http://localhost:3001
run:
	@docker run -p 3000:3000 \
	-e DKG_URL=$(DKG_URL) \
	-e OPENDRM721_ADDRESS=$(OPENDRM721_ADDRESS) \
	-e OPENDRM_COORDINATOR_ADDRESS=$(OPENDRM_COORDINATOR_ADDRESS) \
	-e BOB_ADDRESS=$(BOB_ADDRESS) \
	opendrm-client

push: ## Push production image of service to respository
	@docker push 634967882344.dkr.ecr.us-west-2.amazonaws.com/dev:opendrm-client-$(GIT_SHA)

deploy: ## Deploy image to dev environment
	@NOMAD_VAR_DOMAIN=masterfiledev.co NOMAD_VAR_IMAGETAG=$(TAG) nomad job run -address $(ADDRESS) -verbose -detach client.nomad

clean: ## Clean up docker build
	@docker rmi 634967882344.dkr.ecr.us-west-2.amazonaws.com/dev:opendrm-client-$(GIT_SHA)