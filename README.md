# ActiveFence Solution

## How to run
1 - run docker-compose up to run the mysql on port 3307
2 - run `npm start`

those 2 commands should be enough for running the app with the mysql connection.

## Solution overview
The solution was receving the start url and the max depth and pages
and then run over the url and its inner urls(if there are any) and keep checking 
the links at the same level of depth unless there are no more and then keep going more
and more inside to find all links(and their titles for the pages).
I didnt write a simple BFS with tree and nodes, I wrote it my way, with an object that determined where
I at the time.

## Better solutin
If I had more time I would most likely used caching solution for same requests.
Another thing I would have done is to create a better structure for the DB where I had the parent ID
and the url so I could start crawling not from the start all the time.
Also I would most likely run those crawling missions on a worker threads.
Another thing I would have done is to using sockets to show the result once the crawl has done.