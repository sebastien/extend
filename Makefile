# Extend Makefile (19-Jun-2007)
# TODO: Replace all this with source/target shortcuts
#
DOC_TEXT=$(shell echo *.txt)
DOC_HTML=$(DOC_TEXT:.txt=.html)
TEST_EXTEND=Tests/test-extend.html
VERSION=$(shell grep @version Sources/*.sjs | cut -d' ' -f2)
EXTEND_JS=Distribution/extend.js
EXTEND_JS_SOURCE:=oopjs runtime reflection functional pytypes
EXTEND_JS_SOURCE:=$(EXTEND_JS_SOURCE:%=Sources/extend-%.sjs)
API_DOC=extend-api.html
SUGAR=sugar
PAMELA=pamela
PAMELAWEB=pamela-web

.PHONY: doc

# Generic rules ______________________________________________________________

all: doc dist
	echo $(EXTEND_JS)

doc: $(API_DOC) $(DOC_HTML)
	@echo "Documentation ready."

dist: $(EXTEND_JS)
	@echo "Distribution ready."

clean:
	rm $(EXTEND_JS) $(API_DOC)

# Specific rules _____________________________________________________________

$(EXTEND_JS): $(EXTEND_JS_SOURCE)
	@mkdir -p `dirname $@`
	$(SUGAR) -cljavascript $^ > $@

$(API_DOC): $(EXTEND_JS_SOURCE)
	$(SUGAR) -a $@ $< > /dev/null

%.html: %.txt
	kiwi $< $@

# EOF
