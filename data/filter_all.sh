#cp ~/WorkDir/DjangoPage/data/backup_2025_05_05_sqlite/places/places.db .
#cp ~/WorkDir/DjangoPage/data/backup_2025_05_05_sqlite/catalog/catalog.db .
#cp ~/WorkDir/DjangoPage/data/backup_2025_05_05_sqlite/rsshistory/rsshistory.db .

poetry run python filter.py --db places.db --votes -f places
poetry run python filter.py --db catalog.db --bookmarked -f catalog
poetry run python filter.py --db rsshistory.db --bookmarked -f bookmarks
