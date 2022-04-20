-include .env

export

GIT_SHA=$(shell git log -1 --pretty=format:"%H")

chain/%: FORCE
	@$(MAKE) -C chain $(patsubst chain/%,%,$@) --no-print-directory


client/%: FORCE
	@$(MAKE) -C client $(patsubst client/%,%,$@) --no-print-directory

server/%: FORCE
	@$(MAKE) -C server $(patsubst server/%,%,$@) --no-print-directory

install: chain/install client/install server/install

FORCE: ;