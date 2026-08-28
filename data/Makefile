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

databases: awesomelists-db bookmarks-db books-db feeds-db memes-db movies-db music-db reddit-db videogames-db vr-db youtube-db top-db

awesomelists-db:
	#rm awesomelists.db.zip
	poetry run python filter.py --db awesomelistsdb.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip awesomelists.db.zip awesomelistsdb.db 
	rm awesomelistsdb.db 

bookmarks-db:
	rm bookmarks.db.zip
	poetry run python filter.py --db rsshistory.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip bookmarks.db.zip rsshistory.db 
	rm rsshistory.db 

books-db:
	rm books.db.zip
	poetry run python filter.py --db booksdb.db --redundant --user-data --search-data --configuration --dynamic-data --domains --obfuscate
	zip books.db.zip booksdb.db 
	rm booksdb.db 

feeds-db:
	#rm feeds.db.zip
	poetry run python filter.py --db feedsdb.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip feeds.db.zip feedsdb.db 
	rm feedsdb.db 

memes-db:
	rm memes.db.zip
	poetry run python filter.py --db memesdb.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip memes.db.zip memesdb.db 
	rm memesdb.db 

movies-db:
	rm movies.db.zip
	poetry run python filter.py --db moviesdb.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip movies.db.zip moviesdb.db 
	rm moviesdb.db 

music-db:
	#rm music.db.zip
	poetry run python filter.py --db musicdb.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip music.db.zip musicdb.db 
	rm musicdb.db 

reddit-db:
	#rm redditdb.db.zip
	poetry run python filter.py --db redditdb.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip redditdb.db.zip redditdb.db 
	rm redditdb.db 

videogames-db:
	#rm videogamesdb.db.zip
	poetry run python filter.py --db videogamesdb.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip videogamesdb.db.zip videogamesdb.db 
	rm videogamesdb.db 

vr-db:
	#rm vrdb.db.zip
	poetry run python filter.py --db vrdb.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip vrdb.db.zip vrdb.db 
	rm vrdb.db 

youtube-db:
	#rm youtube.db.zip
	poetry run python filter.py --db youtubedb.db --user-data --search-data --configuration --dynamic-data --obfuscate
	zip youtube.db.zip youtubedb.db 
	rm youtubedb.db 


top-db:
	#rm top.db.zip
	poetry run python filter.py --db places.db --redundant --user-data --search-data --configuration --dynamic-data --obfuscate
	zip top.db.zip places.db 
	rm places.db 



bookmarks-db-summary:
	poetry run python dataanalyzer.py --db rsshistory.db --summary
