## the difference between `<link rel="subresource">` and `<link rel="prefetch">`
`<link rel="prefetch">` is a directive that tell a browser to **fetch a resource that probably be needed** for the next navigation.That mostly means that the resource will be fetched with extremely low priority(since everything the browser know is needed in the current page is more important than a resource that we guess might be needed in the next one).That means that prefetch's main use case **is speeding up the next navigation tather**.

`<link rel="subresource">` was originally planned to tackle the current navigation, but it failed to do that in some spectacular ways.Since the web developer had no way to define what the priority of the resource should be, the browser(just Chrome and Chromium-based browsers, really)downloaded it with fairly low priority, which meant that in most cases, the resource requrest came out about the same time that it would if subresource wasn't there at all.

## How can Preload Do Better?

Preload is destined for current navigation.It has an `as` attribute, which enables the browsers the browser to do a number of things that subresource and prefetch did not enable

The basic way you could use preload is to **load late-discovered resources early**.It means to tell browser, 'hey, here's a resource you're going to need later on, so start loading it now'

It would look something like:
~~~html
<link rel="preload" href="late_discovered_thing.js" as="script">
~~~

The `as` attribute tell the browser what it will be downloading.Possible `as` values include:
* `script`
* `style`
* `image`
* `media`
* `document`

Omitting the `as` attribute, or having an invalid value is equivalent to an XHR request, where the browser doesn't know what it is fetching, and fetches it with a fairly low priority.

## early loading of fonts

~~~html
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
~~~
One point worth going over: You have to add a `crossorigin` attibute when fetching fonts, as they are fetched using anonymous mode CORS.Yes, event if your fonts are on the same origin as the page.Sorry.

Also, the `type` attribute is there to make sure that this resource will only get preloaded on browser support that file type.Right now, only Chrome supports preload, and it does support WOFF2 as well, but more browser may support preload in the future, and we cannot assyme they'd also support WOFF2.