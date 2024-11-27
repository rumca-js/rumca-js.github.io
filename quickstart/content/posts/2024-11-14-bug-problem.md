+++
title = 'Table problem'
date = 2024-11-13 16:43:32
draft = false
+++

Once upon a time I got up and checked my webpage. It's a habit of mine — checking, making sure everything is up and running. I'm not doing it for anyone else. Nobody uses my app instances; I’m the sole user. Yet, I'm devoted.

That day, I ran into a problem. A table in my database had a data error and became completely unreadable. I tried fixing it—several times. I sifted through pages of documentation and even enlisted ChatGPT for assistance. Nothing worked.

Eventually, I tried creating a new table instance and copying over what I could. Unfortunately, every copy operation failed. Perhaps it was my limited SQL skills, or maybe I was missing some internal PostgreSQL trickery.

One webpage I stumbled upon had an amusing piece of SQL advice:

1. Try step A.
1. If that doesn’t work, try step B.
1. Then step C.
1. If all else fails, restore from a backup. And, of course, if you don’t have a backup? Well, congratulations - you’ve just learned the importance of making backups.

Luckily, I had a backup—of sorts. It was in JSON format. Importing it worked, but it was a painstakingly slow process. I spent some time experimenting with PostgreSQL’s native tools, like pg\_backup and pg\_restore. To my amazement, they worked like magic, taking a fraction of the time and resources compared to my improvised import/export process. It turns out my manual methods weren’t “optimal,” or perhaps PostgreSQL’s internal scripts benefit from directly copying tables, which is always faster for straightforward operations.

In the end, I wrote a handy new script to perform PostgreSQL backups using its native tools—a silver lining to the ordeal.

A week later, disaster struck again: a cascade delete operation wiped out most of my data. But this time, I was prepared. With my new backup script, I restored everything within minutes. Funny how things turn out sometimes.

You better watchout, because there can always be another monster after your bug.

<pre>
⣿⠛⠉⠉⠁⠀⠛⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⡇⠰⢶⣟⣃⠀⠠⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣅⡀⢾⣿⣽⣶⠒⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠟⠋⠉⠉⠉⠉⠉⠛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠃⠀⢈⠻⡿⠄⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣦⣝⣿⣦⣤⡉⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡯⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⠛⠀⠈⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡋⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣯⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⢀⡠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⠂⠀⠀⢀⡾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⣀⣰⡗⢀⣠⣤⣶⣶⣶⣶⣶⣦⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠉⠿⣿⣿⣿⣿⠋⢤⣾⣶⠝⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⡛⠿⣿⣿⢿⡀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣷⣌⣉⡉⣠⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⢀⣤⣶⣶⣤⣀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢹⢫⠛⣧⠈⠻⡄⠀⣀⠀⠀⠀⠀⠀⠉⠻⢿⣻⠿⢿⣿⠿⣿⠿⠻⠃⠀⠀⣀⠀⠀⠀⠀⠀⢦⣾⣿⡿⠛⣻⣙⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢧⡞⠀⠛⣧⠀⢻⠟⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⣠⣼⠗⠦⣤⠀⡾⣿⣿⣇⡘⠿⠟⣸⣇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠘⠁⣶⡿⣿⡖⣯⠀⡁⢿⣷⣤⣤⣽⡶⠦⠖⠒⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡟⡠⢀⣿⡇⠃⠹⢻⣿⣿⣷⣾⣿⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⢦⡻⣤⣈⣆⢻⠀⢹⠸⠿⣿⣿⣦⣤⣠⡄⠀⠀⠀⠀⠀⠀⠀⠀⠈⢉⡻⠁⠀⠈⣼⡿⠃⠀⠀⠀⠁⠉⠉⠉⠁⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄⡙⠷⠍⣹⣿⡄⠀⠀⢸⡈⢻⣿⣿⣿⣿⣶⣶⣶⣦⣤⣄⣀⣀⡀⠀⠙⠆⠒⠀⠹⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⣠⣿⡇⠀⠀⠀⠃⠀⢿⣿⣿⣿⣿⣿⣿⢿⣿⣿⢿⣿⣿⣿⣶⣶⣤⣄⣀⣀⣀⠀⠀⠀⠀⠀⢹⣦⣼⣥⠜⠛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣇⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣴⣯⣼⢸⣃⣿⡿⢹⣿⣿⢿⣿⣿⣿⣿⣶⣶⣠⣤⣾⣿⣟⠁⡄⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⢻⡄⠀⢀⠀⠀⠀⠈⢿⣿⣿⣿⣻⢿⣿⣿⣿⣿⣿⣷⣾⣿⣧⣾⣿⡞⠙⣻⣿⣿⣿⡿⢻⢟⠏⢀⢃⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠘⣷⡀⠈⠄⢡⠀⠀⠀⠈⠻⣿⣿⣤⡿⢹⢏⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⢀⡼⠋⢀⡼⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⡀⢹⣷⡄⠀⡈⣆⠀⠀⠀⠀⠽⣿⣿⣿⣿⣾⣁⠋⣿⡏⡿⠿⢿⣙⣼⣿⣿⠏⠁⢀⣾⡁⣉⣽⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡗⠸⣄⢿⣷⡄⢱⢤⡀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣶⣷⣶⣿⣿⣿⡿⠃⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⢸⡜⠾⣿⣿⣾⡆⢧⠀⠀⠀⠀⠐⢤⡀⢻⡿⢿⣿⣿⣿⣿⣿⣿⠿⠋⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣿⠓⠀⠘⡇⠀⢻⣿⣿⣿⡜⣧⠀⠀⠀⠀⠀⠉⠀⠡⢤⣬⣉⣉⡿⠋⠁⠀⡀⣀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠿⠿⠿⠿⠿⠿⠛⠛⠛⠉⠉⠀⢀⣼⠃⠀⠀⠀⢻⠀⢸⣿⣿⣿⣿⣿⣶⡄⠀⠀⠀⠀⠀⠀⠀⠓⠉⠉⠀⠀⠀⠎⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⡏⠀⠀⠀⠸⡏⠀⠨⡿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠃⠀⠃⠀⢰⣧⠀⠀⠀⢹⣿⣿⣿⣿⣿⣷⣆⣀⠀⠀⠀⠀⠀⠀⠀⢀⣴⢟⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⡆⠘⣦⠀⠀⠀⠈⠛⠿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣦⣤⣤⣴⣿⢁⠎⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢠⠀⠀⠀⠀⡀⠀⠉⢻⢿⣿⣿⣿⣿⣿⣿⣟⣿⡿⠋⠂⢰⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠘⣦⣀⣘⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⢀⡞⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠰⠀⠀⠄⠀⠀⠤⢀⠨⢿⣿⣿⣿⣿⣿⣿⣿⣿⡗⠀⠀⠀⡾⠀⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣤⠹⣿⣮⣿⣿⣿⣿⣿⣿⢫⡄⣀⠀⠀⠐⠁⠀⠀⠀⠀⠀⠀⠀⠈⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
</pre>

