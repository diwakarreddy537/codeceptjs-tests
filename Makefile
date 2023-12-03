CODECEPT = npx codeceptjs
REPORTS_DIR = output

install:
	npm install

test:
	$(CODECEPT) run

test-html:
	$(CODECEPT) run --reporter mochawesome

clean:
	rm -rf $(REPORTS_DIR)
	rm -rf node_modules

run:
	npm run test

all: install test
