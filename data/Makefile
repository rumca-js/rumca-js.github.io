clear-zips:
	rm awesome.zip
	rm music.zip
	rm movies.zip
	rm top.zip
	rm bookmarks.zip

clear-jsons:
	rm awesome*.json
	rm music*.json
	rm movie*.json
	rm places*.json
	rm bookmark*.json

clear-dbs:
	rm awesome*.db
	rm music*.db
	rm movie*.db
	rm places*.db
	rm rsshistory*.db

clear: clear-zips

zips: jsons pack clear-dbs clear-jsons

pack:
	zip awesome.zip awesome*.json
	zip music.zip music*.json
	zip movies.zip movies*.json
	zip top.zip places*.json
	zip bookmarks.zip bookmark*.json

jsons:
	# from smaller to bigger
	poetry run python filter.py --db awesomelistsdb.db --file-names awesome
	poetry run python filter.py --db musicdb.db --file-names music --redundant
	poetry run python filter.py --db moviedb.db --file-names movies --redundant
	poetry run python filter.py --db places.db --file-names places --votes
	poetry run python filter.py --db rsshistory.db --file-names bookmark --redundant
