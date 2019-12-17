# Emby Auto-Collections
This is a simple script to automatically create collections by matching the titles of movies in your library with movies in the `collections.yml` file.

## Installation
```
git clone https://github.com/alex-phillips/emby-auto-collections
cd emby-auto-collections
npm install
```

You will need to copy `config.ini.sample` to `config.ini` and populate this with your server's information. Then run `index.js` and pass in whichever collection files you want as arguments.

```
node index.js collections.d/marvel.yml
node index.js collections.d/*
```

## Usage
Since this was designed to run against any arbitrary Plex movie library (and some people may have different naming conventions for movies), I decided that regular expression matching would be best for most cases.

Example:
`^Star Wars(.*?A New Hope|.*?Episode (?:4|IV))?$` will match all of the following that could be the first (chronoligically) Star Wars movie (and more):
* Star Wars
* Star Wars: A New Hope
* Star Wars: Episode 4
* Star Wars: Episode IV

If you want to customize collection names or the names of movies found in your library, simply edit or replace the included `collections.yml` file.

### Custom collections
The directory `collections.d` exists as a way for people to contribute and add new collections. Collections can also be broken out into individual files so you don't have to run the script against every collection in the project.

### Best practices
When determining whether to put a new collection in `collections.yml` or
`collections.d`, please keep the following best practices in mind:
* Any collection _may_ reside in a custom collection.
* A collection longer than about 10 lines in length _should_ be placed in its own
  custom collection.
* A collection longer than about 50 lines in length _should_ be placed in its own
  custom collection, and be _disabled_ by default (e.g.
  `my_collection.yml.disabled`).

## Posters

A great resource for posters can be found in this [reddit thread](https://www.reddit.com/r/PlexPosters/comments/8vny7j/an_index_of_utheo00s_473_collections_posters/).

## Contributing
I wrote this with the hope that the community would help expand and include more collections and help make any corrections in better matching movies in various libraries. Pull requests are very much welcome!
