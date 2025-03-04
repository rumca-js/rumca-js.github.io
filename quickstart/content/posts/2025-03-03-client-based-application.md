+++
title = "Client based web application"
date = 2025-03-03 16:43:32
draft = false
+++

For a long period of time I have been working on an RSS client. This was a difficult task, and requiring a lot of effort in a long period of time.

Recently I have started making public some data. I wanted users to be able to see the output of my data.

There were problems:
 - My server would freeze intermittently.
 - I could not serve many people since my server is running on a raspberry pi
 - I didn’t want to deal with maintaining a VPS, configuring it, and handling all the associated overhead.

So I implemented static solution - a static web page. Here’s how it works:
 - The user visits the webpage
 - JavaScript loads a zip file
 - Javascript unpacks the zip file
 - Javascript reads an SQLite database file
 - The data is displayed to the user using the information from the database.

Why I Love This Static Approach:
 - No Need for Database Hosting: I really enjoy the fact that I don’t have to host the database on a server. There are no hosting costs, no need to worry about server maintenance, and no issues with my server getting stuck.
 - Scalability: This setup is incredibly scalable. Whether one user or a billion users access the data, the processing is all done client-side, so there are no bottlenecks on my server.
 - Simplicity: I don’t have to worry about managing a server, VPS, or handling database configuration. Everything works seamlessly on the user’s end.

Before this, I had been using static JSON files. While this approach worked, it came with its own challenges, especially when it came to reading and processing multiple JSON files.

## The Benefits of SQLite over JSON

Switching from using JSON files to SQLite has been a game-changer for me. Here’s why:

 - Centralized Data Storage: With SQLite, all the data is stored in one place, making it much easier to manage than dealing with thousands of individual JSON files.
 - Structured Data with Relationships: SQLite allows me to define multiple tables with relationships between them. This organization makes it much more efficient to work with data compared to a collection of flat JSON files.
 - Efficient Data Handling: A single SQLite database can handle many rows of data with ease. It’s also incredibly simple to query and filter the data using SQL, which is much faster than manually filtering JSON data.
 - Built-in Performance Optimizations: SQLite has well-implemented algorithms for data access. While I could manually implement similar functionality for JSON data, SQLite’s solution is more efficient and faster.
