import argparse
import time
import os
import json
from sqlalchemy import create_engine

from linkarchivetools import DbAnalyzer
from linkarchivetools.dbanalyzer import Parser


def main():
    p = Parser()
    if not p.parse():
        print("Could not parse options")
        return

    args = p.args

    analyzer = DbAnalyzer(input_db = p.args.db, args=p.args)
    if p.args.summary:
        analyzer.print_summary()
    else:
        for _ in analyzer.search():
            pass


if __name__ == "__main__":
    main()
