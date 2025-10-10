clear-zips:
	rm music.zip
	rm top.zip
	rm bookmarks.zip

clear-jsons:
	rm catalog*.json
	rm bookmark*.json
	rm places*.json

clear-dbs:
	rm catalog*.db
	rm rsshistory*.db
	rm places*.db

clear: clear-zips

zips: filter pack clear-dbs clear-jsons

pack:
	zip music.zip catalog*.json
	zip bookmarks.zip bookmark*.json
	zip top.zip places*.json

filter:
	# from smaller to bigger
	poetry run python filter.py --db catalog.db --bookmarked -f catalog
	poetry run python filter.py --db rsshistory.db --bookmarked -f bookmarks
	poetry run python filter.py --db places.db --votes -f places
