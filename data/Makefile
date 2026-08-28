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
	rm memes*.db
	rm places*.db
	rm rsshistory*.db

clear: clear-zips

zips: jsons pack-jsons clear-dbs clear-jsons

pack-jsons:
	zip awesome.zip awesome*.json
	zip music.zip music*.json
	zip movies.zip movies*.json
	zip top.zip places*.json
	zip bookmarks.zip bookmark*.json

jsons:
	# from smaller to bigger
	poetry run python filter.py --db awesomelistsdb.db --jsons --file-names awesome
	poetry run python filter.py --db musicdb.db --jsons --file-names music --redundant
	poetry run python filter.py --db moviedb.db --jsons --file-names movies --redundant
	poetry run python filter.py --db places.db --jsons --file-names places --votes
	poetry run python filter.py --db rsshistory.db --jsons --file-names bookmark --redundant
	poetry run python filter.py --db internet.db --jsons --file-names places --redundant
	rm tmp.db

databases: awesomelists-db books-db feeds-db memes-db movies-db music-db youtube-db bookmarks-db top-db

youtube-db:
	rm youtube.db.zip
	poetry run python filter.py --db youtubedb.db --output-file youtubedb_filtered.db --user-data --search-data --configuration --dynamic-data --obfuscate
	zip youtube.db.zip youtubedb-filtered.db 
	rm youtubedb.db 
	rm youtubedb_filtered.db 

music-db:
	rm music.db.zip
	poetry run python filter.py --db music.db --output-file musicdb_filtered.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip music.db.zip musicdb_filtered.db 
	rm musicdb.db 
	rm musicdb_filtered.db 

bookmarks-db:
	rm bookmarks.db.zip
	poetry run python filter.py --db rsshistory.db --output-file rsshistory_filtered.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip bookmarks.db.zip rsshistory_filtered.db 
	rm rsshistory.db 
	rm rsshistory_filtered.db 

top-db:
	rm top.db.zip
	poetry run python filter.py --db topdb.db --output-file topdb_filtered.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip top.db.zip topdb_filtered.db 
	rm topdb.db 
	rm topdb_filtered.db 

books-db:
	rm books.db.zip
	poetry run python filter.py --db booksdb.db --output-file booksdb_filtered.db --redundant --user-data --search-data --configuration --dynamic-data --domains --obfuscate
	zip books.db.zip booksdb_filtered.db 
	rm booksdb.db 
	rm booksdb_filtered.db 


feeds-db:
	rm feeds.db.zip
	poetry run python filter.py --db feedsdb.db --output-file feedsdb_filtered.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip feeds.db.zip feedsdb_filtered.db 
	rm feedsdb.db 
	rm feedsdb_filtered.db 

movies-db:
	rm movies.db.zip
	poetry run python filter.py --db moviesdb.db --output-file moviesdb_filtered.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip movies.db.zip moviesdb_filtered.db 
	rm moviesdb.db 
	rm moviesdb_filtered.db 

memes-db:
	rm memes.db.zip
	poetry run python filter.py --db memesdb.db --output-file memesdb_filtered.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip memes.db.zip memesdb_filtered.db 
	rm memesdb.db 
	rm memesdb_filtered.db 

awesomelists-db:
	rm awesomelists.db.zip
	poetry run python filter.py --db awesomelistsdb.db --output-file awesomelistsdb_filtered.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip awesomelists.db.zip awesomelistsdb_filtered.db 
	rm awesomelistsdb.db 
	rm awesomelistsdb_filtered.db 

bookmarks-db-summary:
	poetry run python dataanalyzer.py --db rsshistory_filtered.db --summary
