# Extend Makefile (19-Jun-2007)
# TODO: Replace all this with source/target shortcuts
#
SUGAR=sugar
PAMELA=pamela
PAMELAWEB=pamela-web
EXTEND_SOURCE=Sources/extend.sjs
EXTEND_DIST=Sources/extend.js
EXTEND_SUGAR_DIST=Sources/extend+sugar.js
API_DOC=Documentation/extend.html
API_DOC_SUGAR=Documentation/extend+sugar.html
DOC_TEXT=$(shell echo *.txt)
DOC_HTML=$(DOC_TEXT:.txt=.html)
TEST_EXTEND=Tests/test-extend.html

.PHONY: doc

# Generic rules ______________________________________________________________

all: doc dist
	@echo

doc: $(API_DOC) $(API_DOC_SUGAR) $(DOC_HTML)
	@echo "Documentation ready."

dist: $(EXTEND_DIST) $(EXTEND_SUGAR_DIST)
	@echo "Distribution ready."

clean:
	rm $(EXTEND_DIST) $(EXTEND_SUGAR_DIST) $(API_DOC) $(API_DOC_SUGAR)

# Specific rules _____________________________________________________________

$(EXTEND_DIST): $(EXTEND_SOURCE)
	$(SUGAR) -cljavascript $< > $@

$(EXTEND_SUGAR_DIST): $(EXTEND_SOURCE)
	$(SUGAR) -cljavascript -DSUGAR_RUNTIME $< > $@

$(API_DOC): $(EXTEND_SOURCE)
	$(SUGAR) -a $@ $< > /dev/null

$(API_DOC_SUGAR): $(EXTEND_SOURCE)
	$(SUGAR) -DSUGAR_RUNTIME -a $@ $< > /dev/null

%.html: %.txt
	kiwi $< $@

# EOF
