install:
	yarn

up:
	yarn dev

build:
	@docker build -t opendrm-client:latest -t opendrm-client:$(GIT_SHA) -t 634967882344.dkr.ecr.us-west-2.amazonaws.com/masterfile:opendrm-client-$(GIT_SHA) -t 634967882344.dkr.ecr.us-west-2.amazonaws.com/masterfile:opendrm-client-latest --build-arg NEXT_PUBLIC_ABIOTIC_ALICE_MANAGER_ADDRESS=$(ABIOTIC_ALICE_MANAGER_ADDRESS) --build-arg NEXT_PUBLIC_OPENDRM721_ADDRESS=$(OPENDRM721_ADDRESS) --build-arg NEXT_PUBLIC_BOB_ADDRESS=$(BOB_ADDRESS) .

build/dev:
	yarn build

start:
	yarn start

run: export ABIOTIC_ALICE_URL=http://localhost:3001
run:
	@docker run -p 3000:3000 \
	-e NEXT_PUBLIC_BOB_ADDRESS=$(BOB_ADDRESS) \
	-e NEXT_PUBLIC_OPENDRM721_ADDRESS=$(OPENDRM721_ADDRESS) \
	-e NEXT_PUBLIC_ABIOTIC_ALICE_MANAGER_ADDRESS=$(ABIOTIC_ALICE_MANAGER_ADDRESS) \
	-e ABIOTIC_ALICE_URL=$(ABIOTIC_ALICE_URL) \
	opendrm-client

push: ## Push production image of service to respository
	@docker push 634967882344.dkr.ecr.us-west-2.amazonaws.com/masterfile:opendrm-client-$(GIT_SHA)
	@docker push 634967882344.dkr.ecr.us-west-2.amazonaws.com/masterfile:opendrm-client-latest