+++
title = "Another bug bites the dust"
date = 2025-01-29 16:43:32
draft = false
+++

It always starts with a bug.

Recently I had several problems:

 - my RSS feed server, that I wrote, started freezing
 - my web crawler, lead to OS freeze

This happened after major code refactor. I split my RSS feed reader into two projects, so naturally things blew up.

I have unit tests mind you, but unit tests do not cover 100% of code.

My functional manual testing also did not show anything outstanding.

Turns out my celery tasks had an unkown bug in which it would spin forever that did not happen because:
 - my RSS feed had been eating memory for a long period of time
 - celery had defined memory limit for workers
 - workers ate too much memory, which lead to worker restart and everything was all rosy

When I fixed memory bug it showed that behind that bug there was lurking a more nasty one.

After some time I have been able to track it down and kill.

What are my closing thoughts? It was all worth it. Now my application runs better than ever!
