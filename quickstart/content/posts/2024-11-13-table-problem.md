+++
title = 'Bug problem'
date = 2024-11-14 16:43:32
draft = false
+++

Another amusing yet frustrating incident occurred recently.

I discovered a particularly nasty bug in my code - it froze the entire app after exactly 10 page refreshes. I was initially baffled and unsure where to start debugging.

I’m no Python expert, and my main safety net is a solid suite of unit tests. These help a lot, but they don’t catch issues like memory leaks or recursion problems. Clearly, I still have a lot to learn.

When you lack advanced debugging skills, you make do with what you have. I started by observing the logs:

1. I monitored PostgreSQL logs.
1. I watched Apache logs.
1. I checked dmesg to ensure the system itself was okay.

Unfortunately, dmesg revealed issues with the drive, which made me a bit uneasy. I could not replace the drive, so I decided to poke around more.

Next, I investigated my software dependencies. I’d recently upgraded several third-party packages, opting for newer versions. I suspected one of these might be introducing a bug. However, this led to another roadblock: downgrading wasn’t straightforward since my requirements.txt file didn’t fully track which packages had been updated. Frustrating.

I then checked the app’s stability at a previous commit. I identified a version where everything was working smoothly, pulled the code, and ran it. Success! The app was stable. That was my starting point.

From there, I began the painstaking process of copy-pasting changes, line by line, to isolate the issue. Initially, I copied significant chunks of code, but the app froze again. Reducing the amount of code copied did help, but it required many back-and forth copy and restart operations. Frustration mounted. Sigh. Coffee. Sigh. Repeat.

Finally, after considerable effort, I pinpointed the culprit. Ironically, it was a bug I had recently fixed. Fixing that bug caused the freeze—a bizarre and unexpected outcome. Why? The subsequent lines of code checked whether a grammar library (Spacy) was loaded. Since the earlier bug was resolved, these lines executed for the first time and caused the app to freeze.

The solution was simple in hindsight: ensure the library was loaded only once, as suggested on Stack Overflow. After making that change, everything worked perfectly.

What a journey—debugging truly tests both patience and creativity!