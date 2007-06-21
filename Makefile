# Extend Makefile (19-Jun-2007)

SUGAR=sugar
PAMELA=pamela-web
EXTEND_SOURCE=Sources/extend.sjs
EXTEND_DIST=Sources/extend.js
API_DOC=Documentation/extend.html
DOC_README=README.html

.PHONY: doc

# Generic rules ______________________________________________________________

doc: $(API_DOC) $(DOC_README)
	echo "Documentation ready."

dist: $(EXTEND_DIST) doc
	echo "Distribution ready.

# Specific rules _____________________________________________________________

$(EXTEND_DIST): $(EXTEND_SOURCE)
	echo "Compiling Sugar to JavaScript $(EXTEND_DIST)"
	$(SUGAR) -ljs $(EXTEND_SOURCE) > $(EXTEND_DIST)

$(API_DOC): $(EXTEND_SOURCE)
	echo "Generating API documentation: $(API_DOC)"
	$(SUGAR) -a $(API_DOC) $(EXTEND_SOURCE) > /dev/null

$(DOC_README): README.txt
	kiwi README.txt $(DOC_README)

# EOF
