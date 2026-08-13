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

databases: youtube-db bookmarks-db
	rm awesomelists.db.zip
	rm books.db.zip
	rm feeds.db.zip
	rm memes.db.zip
	rm movies.db.zip
	rm music.db.zip
	rm top.db.zip
	
	zip awesomelists.db.zip awesomelistsdb.db 
	zip books.db.zip booksdb.db 
	zip feeds.db.zip feedsdb.db 
	zip memes.db.zip memesdb.db 
	zip movies.db.zip moviesdb.db 
	zip music.db.zip musicdb.db 
	zip top.db.zip topdb.db 
	
	rm awesomelistsdb.db 
	rm booksdb.db 
	rm feedsdb.db 
	rm memesdb.db 
	rm moviesdb.db 
	rm musicdb.db 
	rm topdb.db 

youtube-db:
	rm youtube.db.zip
	zip youtube.db.zip youtubedb.db 
	rm youtubedb.db 

bookmarks-db:
	#rm bookmarks.db.zip
	poetry run python filter.py --db rsshistory.db --output-file rsshistory_filtered.db --redundant --user-data
	zip bookmarks.db.zip rsshistory_filtered.db 
	rm rsshistory.db 
	rm rsshistory_filtered.db 

bookmarks-db-summary:
	poetry run python dataanalyzer.py --db rsshistory_filtered.db --summary
