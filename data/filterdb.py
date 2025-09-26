"""
Prepares permanent repository for offline view

Should it remove any tables?
"""
import os
import sys
import json
import shutil
from pathlib import Path
import argparse

from sqlalchemy import create_engine
from utils.reflected import *


def drop_table(engine, table_name):
    with engine.connect() as connection:
        sql_text = f"DROP TABLE IF EXISTS {table_name};"
        connection.execute(text(sql_text))
        connection.commit()


def parse():
    parser = argparse.ArgumentParser(description="Data analyzer program")
    parser.add_argument("--db", default="places.db", help="DB to be scanned")
    parser.add_argument("--bookmarked", action="store_true", help="export bookmarks")
    parser.add_argument("--votes", action="store_true", help="export if votes is > 0")
    parser.add_argument("--clean", action="store_true", help="cleans db from tables")
    parser.add_argument("-v", "--verbosity", help="Verbosity level")
    
    args = parser.parse_args()

    return parser, args


def main():
    parser, args = parse()

    path = Path(args.db)
    if not path.exists():
        print("File {} does not exist".format(path))
        return

    engine = create_engine(f"sqlite:///{args.db}")

    with engine.connect() as connection:
        table = ReflectedEntryTable(engine, connection)

        if args.clean:
            drop_table(engine, "userentrytransitionhistory")
            drop_table(engine, "userentryvisithistory")
            drop_table(engine, "usersearchhistory")
            drop_table(engine, "uservotes")
            drop_table(engine, "usercompactedtags")
            drop_table(engine, "usercomments")
            drop_table(engine, "userbookmarks")
            drop_table(engine, "user")
            drop_table(engine, "userconfig")
            drop_table(engine, "sourcedatamodel")
            drop_table(engine, "sourcecategories")
            drop_table(engine, "sourcesubcategories")
            drop_table(engine, "readlater")
            drop_table(engine, "modelfiles")
            drop_table(engine, "gateway")
            drop_table(engine, "entryrules")
            drop_table(engine, "domains")
            drop_table(engine, "dataexport")
            drop_table(engine, "configurationentry")
            drop_table(engine, "compactedtags")
            drop_table(engine, "blockentrylist")

        if args.bookmarked:
            sql_text = f"DELETE FROM linkdatamodel WHERE bookmarked=False;"
            connection.execute(text(sql_text))
            connection.commit()

            table.close()

        elif args.votes:
            sql_text = f"DELETE FROM linkdatamodel WHERE page_rating_votes = 0;"
            connection.execute(text(sql_text))
            connection.commit()

            table.close()

main()
