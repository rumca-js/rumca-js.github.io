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

zips: jsons pack clear-dbs clear-jsons

pack:
	zip music.zip catalog*.json
	zip bookmarks.zip bookmark*.json
	zip top.zip places*.json

jsons:
	# from smaller to bigger
	poetry run python filter.py --db catalog.db --file-names catalog
	poetry run python filter.py --db rsshistory.db --file-names bookmark
	poetry run python filter.py --db places.db --file-names places
