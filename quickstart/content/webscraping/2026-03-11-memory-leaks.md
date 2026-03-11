+++
title = "Memory leaks"
date = 2023-03-11 21:43:32
draft = false
+++

 - I had problems with web scraping for a very long time

 - I think there could have been some parts where there was no particular problem. Now it returned

 - I am experienced programmer so I fixed it with a little bit of duct tape and a zip tie: the processing script watches virtual memory. If 95% is taken, it exists. There is also a calling script, that calls processing script in a loop. This is a very common way to handle memory leaks. It is a very simple, effective solution, but definitely not clean and correct

I asked chatgpt how can he help me with python memory leaks

# 1st

 - first it said to try to manually release memory with gc.collect() because it could have been just 'delayed' release of memory

# 2nd

```
'pip install memory-profiler'
```

with the following to see which line increases

```
from memory_profiler import profile

@profile
def my_function():
```

# 3rd
Shows which lines allocated the most memory

```
import tracemalloc

tracemalloc.start()

run_my_program()
snapshot = tracemalloc.take_snapshot()
top = snapshot.statistics('lineno')

for stat in top[:10]:
   print(stat)

```

# 4th
Print objects that are accumulating

```
import gc

gc.collect()

for obj in gc.get_objects():
    if isinstance(obj, MyClass):
        print(obj)
```

# 5th

This will show uncollectable objects
```
import gc
gc.set_debug(gc.DEBUG_LEAK)
gc.collect()
```

# 6th

install objgraph

```
pip install objgraph
```

```
import objgraph
objgraph.show_growth()
```

Then inspect
objgraph.show_backrefs(objgraph.by_type('MyClass')[0])

# 7th 

Common causes

 - appending global lists
 - Unbounded dictionaries
 - Arrays that stay references
 - quques that are not drained

# 8th

pip install memray

memray run script.py
memray flamegraph
