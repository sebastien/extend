# Extend Makefile (16-Dec-2008)
#
DOC_TEXT=$(shell echo *.txt)
DOC_HTML=$(DOC_TEXT:.txt=.html)
TEST_EXTEND=Tests/test-extend.html
VERSION=$(shell grep @version Sources/*.sjs | cut -d' ' -f2)
EXTEND_JS=extend-$(VERSION).js
EXTEND_JS_MIN=extend-$(VERSION).min.js
EXTEND_JS_SOURCE:=oopjs runtime reflection functional pytypes
EXTEND_JS_SOURCE:=$(EXTEND_JS_SOURCE:%=Sources/extend-%.sjs)
API_DOC=extend-api.html
SUGAR=sugar
PAMELA=pamela
PAMELAWEB=pamela-web

.PHONY: doc

# Generic rules ______________________________________________________________

all: doc dist

doc: $(API_DOC) $(DOC_HTML)
	@echo "Documentation ready."

dist: $(EXTEND_JS) $(EXTEND_JS_MIN)
	@echo "Distribution ready."

clean:
	rm $(EXTEND_JS) $(EXTEND_JS_MIN) $(API_DOC)

# Specific rules _____________________________________________________________

$(EXTEND_JS): $(EXTEND_JS_SOURCE)
	$(SUGAR) -cljavascript $^ > $@

$(API_DOC): $(EXTEND_JS_SOURCE)
	$(SUGAR) -a $@ $^ > /dev/null

%.min.js: %.js
	cat $< | jsmin.py > $@

%.html: %.txt
	kiwi $< $@

# EOF
