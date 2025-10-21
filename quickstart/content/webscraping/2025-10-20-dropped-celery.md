+++
title = "Dropped celery"
date = 2025-10-20 08:43:32
draft = false
+++

My project throughout time has changed a lot. 

 - started by being a simple server, my friend from previous company departament once suggested django
 - I used django, but had a background thread for RSS source data processing, which was junky
 - on 4programmers.net I was suggested to use celery
 - configuring celery was a pain in the ass, since I required one continuous task, and celery seems to be more of set of little jobs, that can be called. I think that it is also scalable solution
 - however my project has one user, and celery was not always working correctly, had problems with limiting one function call to be present
 - dropped celery, switched to django simple server, which works fast
 - background thread is running by django command, which also simplified docker compose

Your hobby project does not have to provide everything in tech stack.

It does not have to be ground breaking.

It just has to work well for the task it is designed.
