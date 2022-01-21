-include .env

export

GIT_SHA=$(shell git log -1 --pretty=format:"%H")

NEXT_PUBLIC_ABIOTIC_ALICE_MANAGER_ADDRESS:=${ABIOTIC_ALICE_MANAGER_ADDRESS}
NEXT_PUBLIC_OPENDRM721_ADDRESS:=${OPENDRM721_ADDRESS}
NEXT_PUBLIC_BOB_ADDRESS:=${BOB_ADDRESS}

export NEXT_PUBLIC_ABIOTIC_ALICE_MANAGER_ADDRESS
export NEXT_PUBLIC_OPENDRM721_ADDRESS
export NEXT_PUBLIC_BOB_ADDRESS

chain/%: FORCE
	@$(MAKE) -C chain $(patsubst chain/%,%,$@) --no-print-directory


client/%: FORCE
	@$(MAKE) -C client $(patsubst client/%,%,$@) --no-print-directory


server/%: FORCE
	@$(MAKE) -C server $(patsubst server/%,%,$@) --no-print-directory

install: chain/install client/install server/install

FORCE: ;