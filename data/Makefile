clear-zips:
	rm music.zip
	rm top.zip
	rm bookmarks.zip

clear-json:
	rm catalog*.json
	rm bookmark*.json
	rm places*.json

pack:
	zip music.zip catalog*.json
	zip bookmarks.zip bookmark*.json
	zip top.zip places*.json

filter:
	poetry run python filter.py --db places.db --votes -f places
	poetry run python filter.py --db catalog.db --bookmarked -f catalog
	poetry run python filter.py --db rsshistory.db --bookmarked -f bookmarks
