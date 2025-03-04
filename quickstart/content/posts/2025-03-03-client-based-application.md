+++
title = "Client based web application"
date = 2025-03-03 16:43:32
draft = false
+++

For a long period of time I have been working on an RSS client. This was a difficult task, and requiring a lot of effort in a long period of time.

Recently I have started making public some data. I wanted users to be able to see the output of my data.

There were problems:
 - my server was freezing from time to time
 - I could not serve many people since my server is running on a raspberry pi
 - I do not want to maintain any VPS, configure it, etc. etc.

So I implemented static solution, a web page. It works like this:
 - user enters web page
 - javascript loads zip file
 - javascript unpacks zip file
 - javascript reads SQLite database file
 - javascript loads the view for the user using the database

My summary:
 - I really dig the idea that I do not have to host 'the database' anywhere
 - there are no costs for hosting
 - there are not problems with application being stuck on my server. I do not have to maintain any server 
 - it is really scalable. The data can be used by 1 and billions of user, since processing is done on client side

Previously I have been operating using JSONs, static data. This is also not trivial, requires reading and processing many JSONs.

My conclusions after switching from using JSONs to SQLite:
 - the data are stored in one place, so it is easier to manage than 'x' files, with thousands of records
 - SQLite database allows me to define many tables, with relations between them
 - table allows me to store many, many rows
 - it is really easy to obtain the data from the database. You have SQL statements at your disposal. You can really really easy filter the data
 - SQLite has implemented algorithms for accessing the data, and those are well implemented. I could implement filtering for JSON data, but it most certainly would be slower if I did that manually
