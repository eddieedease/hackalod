# hackalod

This repo is the result from participating on the HACK-A-LOD open-data for the National Library of the Netherlands (Hague).
We won 2nd prize with this, so yay.

Concept: Place trending toppics of today in line with events of the past. Show them in a interactive timeline where users can explore the datasets

First it will get the trending topics based on nu.nl (dutch news feed), then it will fire quering the SPARQL database 
(part of them are radio/news bulletins, States General Chambers database)
Users also can put in their own search topics to search the database.

The visualization library used is d3. The web-framework used is Angular

# known issues
- the data (datum) object parameter has changed, value won't come with it, so the timeline is broken (for now)


# contributers
- Tanne van Bree (http://www.tannevanbree.nl) For all D3 stuff
- Eddie Maas (http://www.edease.nl) for the whole angular stuff



