
chain/%: FORCE
	@$(MAKE) -C chain $(patsubst chain/%,%,$@) --no-print-directory

FORCE: ;