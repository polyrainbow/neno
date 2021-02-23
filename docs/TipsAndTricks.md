# Tips And Tricks for working with NENO

## Search for exact titles
In editor view, the notes list can be filtered with the search box. By default, the search input is splitted into tokens (words or part of words) and then all notes are displayed that contain all of those tokens.

When you have a lot of nodes with a similar name, this may not be that helpful.

In that case, you can type `exact:` followed by the exact title of the note in the search box. In that case, only notes whose title are an exact match are displayed.

![Search for exact matches](./img/exact%20matches.png)

## Import links batch-wise

When you have several URLs and want to create a note for every one of those, use the `Import links as notes` button in the note control bar. A dialog will open where you can paste the URLs, separated by line breaks.

## Show notes with same URLs

When you have a lot of notes, chances are that the same URL is included in several notes. It might be better to extract it and create a new note for it, or to remove the duplicate. To find such notes, use the `Show notes with same URLs` button in the note list control bar, or type  `special:DUPLICATE_URLS` into the search box.

## Full-text search
You can perform a full-text search on all notes by typing `ft:` followed by the search query
into the search box. The full-text search is case-insensitive.

## Stats and number of components

It might be interesting to you to see some stats on your graph or see how many [components](https://en.wikipedia.org/wiki/Component_(graph_theory)) it has. Use the `Show stats` function for this in the app menu.

![Exhaustive stats](./img/exhaustive%20stats.png)

## Graph View

See [How to use the Graph view](./GraphViewManual.md)