# Extend Makefile (16-Dec-2008)
#
DOC_TEXT=$(shell echo *.txt)
TEST_EXTEND=Tests/test-extend.html
VERSION=$(shell grep @version Sources/*.sjs | cut -d' ' -f2)
EXTEND_JS=Distribution/extend-$(VERSION).js
# NOTE: Disabled temporarily
#EXTEND_AS=Distribution/extend-$(VERSION).as
EXTEND_SWC=Distribution/extend-$(VERSION).swc
EXTEND_JS_MIN=Distribution/extend-$(VERSION).min.js
EXTEND_JS_SOURCE:=oopjs runtime reflection functional pytypes
EXTEND_JS_SOURCE:=$(EXTEND_JS_SOURCE:%=Sources/extend-%.sjs)
EXTEND_AS_SOURCE:=oopjs runtime reflection functional pytypes
EXTEND_AS_SOURCE:=$(EXTEND_AS_SOURCE:%=Sources/extend-%.sjs)
PRODUCTS=$(EXTEND_JS) $(EXTEND_JS_MIN) $(EXTEND_AS) #$(API_DOC)
API_DOC=Distribution/extend-api-$(VERSION).html
SUGAR=sugar -ONORUNTIME
PAMELA=pamela
PAMELAWEB=pamela-web
JSMIN=jsmin

.PHONY: doc

# Generic rules ______________________________________________________________

all: dist
	echo $(PRODUCTS)

functions:
	@grep @function Sources/*.sjs | cut -d' ' -f2 | sort | uniq | cut -d':' -f1 
	
doc: $(API_DOC) $(DOC_HTML)
	@echo "Documentation ready."

dist: $(PRODUCTS)
	@echo "Distribution ready."
	@cd Tests && ln -sf ../$(EXTEND_JS) extend.js

clean:
	rm $(PRODUCTS)

# Specific rules _____________________________________________________________

$(EXTEND_JS): $(EXTEND_JS_SOURCE)
	@mkdir -p `dirname $@`
	$(SUGAR) -cljavascript $^ > $@

$(EXTEND_AS): $(EXTEND_AS_SOURCE)
	@mkdir -p `dirname $@`
	$(SUGAR) -clactionscript $^ > $@

$(EXTEND_SWC): $(EXTEND_AS)
	compc -compiler.strict=false -source-path Distribution -include-sources $< -o extend.swc

$(API_DOC): $(EXTEND_JS_SOURCE)
	@mkdir -p `dirname $@`
	$(SUGAR) -a $@ $^ > /dev/null

%.min.js: %.js
	cat $< | $(JSMIN) > $@

# EOF
