# DraBornNews

`/DraBornNews/` is a static news reader hosted with the rest of DrabornEagle_Web. It reads `data/news.json`; GitHub Actions checks the RSS feeds twice an hour and commits changes only when the article list changes. The bundled feed provides a working first load before the next scheduled update.

## Sources and editorial method

The collector reads only the publisher's RSS title, URL, date, image and short summary. Current sources: PlayStation Blog, Xbox Wire, Google Blog, Microsoft Blog, Cloudflare Blog, Webtekno and DonanımHaber. Links are restricted to the named source domain, duplicate URLs are removed, invalid/future dates are excluded, and the feed retains the last 100 articles. A failure in one feed does not erase its previous articles; complete feed failure does not replace a working snapshot with an empty page.

Each card identifies its publisher and publication date. The reader links to the original article. When AI copy is unavailable, the source's short RSS summary is displayed and explicitly labeled as such. No full articles are copied. The page never describes an RSS excerpt as independently checked reporting.

## Original Turkish DraBornNews summaries

To enable short, original Turkish rewrites, add the repository **Actions secret** `OPENAI_API_KEY`. The workflow then submits only each *new* article's title, publisher and RSS excerpt to the OpenAI Responses API (`gpt-4.1-mini` by default). The prompt requires no new facts, two short paragraphs, and a restrained headline. Responses are checked for shape and length; failures leave the attributed source excerpt in place. Up to eight new entries are rewritten per run. The key is never embedded in the website or committed to the repository. This uses the account associated with that API key and incurs API usage costs. Existing AI summaries are reused in later runs.

If there is no key, the news feed, search, filters, saved items, story reader, sharing, theme switch and browser text-to-speech work without an API service. The UI distinguishes generated DraBornNews summaries from source excerpts.

## Run and check

```sh
python3 DraBornNews/scripts/dkd_collect.py
python3 -m http.server 8000
```

Open `http://localhost:8000/DraBornNews/`. The collector uses only the Python standard library. On GitHub, run **Actions → DraBornNews feed → Run workflow** for an immediate refresh; scheduled checks follow. If source websites change their RSS format or stop serving a feed, update `DKD_SOURCES` in the collector.
