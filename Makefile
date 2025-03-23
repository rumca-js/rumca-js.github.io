# Define variables
ARCHIVE_NAME = internet.zip
SOURCE_FILE = internet.db

# Declare phony targets
.PHONY: pack unpack clean server pack-split unpack-split

pack:
	zip $(ARCHIVE_NAME) $(SOURCE_FILE)
	split -b 50M -d $(ARCHIVE_NAME) $(ARCHIVE_NAME)
	echo "Packed $(SOURCE_FILE) into $(ARCHIVE_NAME)"
	rm -f $(ARCHIVE_NAME)
	rm -f $(SOURCE_FILE)

unpack:
	cat internet* > $(ARCHIVE_NAME)
	7z x $(ARCHIVE_NAME)

# Clean rule to remove the archive
clean:
	rm -f $(ARCHIVE_NAME) extracted.zip
	echo "Removed $(ARCHIVE_NAME) and extracted.zip"

server:
	python3 -m http.server 8000

summary:
	poetry run python dataanalyzer.py --summary --db $(SOURCE_FILE)
