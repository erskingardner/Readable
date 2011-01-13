## A simple node.js app that runs on port 8000 and parses urls for readability.

Just pass it a url in a param - like:

    http://localhost:8000/?url=http://therealdeal.com/newyork/articles/35528

This will return the readability parsed page as text in the response body. Use it however you'd like from there.

The actual readability engine is a clone of the very handy arrix/node-readability with lots of small changes and tweaks for our individual environment.