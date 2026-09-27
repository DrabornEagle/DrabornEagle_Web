#!/usr/bin/env python3
"""Build DraBornNews' attributed, short-form RSS digest with no dependencies."""

import concurrent.futures
import datetime as dkd_datetime
import email.utils as dkd_email
import hashlib as dkd_hashlib
import html as dkd_html
from html.parser import HTMLParser as DkdHTMLParser
import json as dkd_json
import os as dkd_os
from pathlib import Path as DkdPath
import re as dkd_re
import sys as dkd_sys
import urllib.parse as dkd_parse
import urllib.request as dkd_request
import xml.etree.ElementTree as DkdET


DKD_OUTPUT = DkdPath(__file__).resolve().parents[1] / "data" / "news.json"
DKD_SOURCES = [
    ("PlayStation Blog", "https://blog.playstation.com/feed/", "Oyun", "en", "blog.playstation.com"),
    ("Xbox Wire", "https://news.xbox.com/en-us/feed/", "Oyun", "en", "news.xbox.com"),
    ("Google Blog", "https://blog.google/rss/", "Teknoloji", "en", "blog.google"),
    ("Microsoft Blog", "https://blogs.microsoft.com/feed/", "Teknoloji", "en", "blogs.microsoft.com"),
    ("Cloudflare Blog", "https://blog.cloudflare.com/rss/", "Teknoloji", "en", "blog.cloudflare.com"),
    ("Webtekno", "https://www.webtekno.com/rss.xml", "Teknoloji", "tr", "www.webtekno.com"),
    ("DonanımHaber", "https://www.donanimhaber.com/rss/tum/", "Teknoloji", "tr", "www.donanimhaber.com"),
]
DKD_MEDIA = "{http://search.yahoo.com/mrss/}"
DKD_CONTENT = "{http://purl.org/rss/1.0/modules/content/}"
DKD_NOW = dkd_datetime.datetime.now(dkd_datetime.timezone.utc)


class DkdText(DkdHTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.dkd_parts = []
        self.dkd_image = ""
        self.dkd_ignored = 0

    def handle_starttag(self, dkd_tag, dkd_attrs):
        if dkd_tag in ("script", "style"):
            self.dkd_ignored += 1
        if dkd_tag == "img" and not self.dkd_image:
            self.dkd_image = dict(dkd_attrs).get("src", "")

    def handle_endtag(self, dkd_tag):
        if dkd_tag in ("script", "style"):
            self.dkd_ignored = max(0, self.dkd_ignored - 1)
        if dkd_tag in ("p", "br", "div"):
            self.dkd_parts.append(" ")

    def handle_data(self, dkd_data):
        if not self.dkd_ignored:
            self.dkd_parts.append(dkd_data)


def dkd_plain(dkd_value):
    dkd_parser = DkdText()
    dkd_parser.feed(dkd_html.unescape(dkd_value or ""))
    return dkd_re.sub(r"\s+", " ", "".join(dkd_parser.dkd_parts)).strip(), dkd_parser.dkd_image


def dkd_safe_url(dkd_url, dkd_domain=None):
    try:
        dkd_parts = dkd_parse.urlsplit(dkd_html.unescape(dkd_url or ""))
        if dkd_parts.scheme != "https" or not dkd_parts.hostname:
            return ""
        if dkd_domain and dkd_parts.hostname.lower() != dkd_domain:
            return ""
        return dkd_parse.urlunsplit(dkd_parts)
    except ValueError:
        return ""


def dkd_category(dkd_default, dkd_title, dkd_tags):
    dkd_words = (dkd_title + " " + " ".join(dkd_tags)).casefold()
    if any(dkd_word in dkd_words for dkd_word in ("artificial intelligence", "yapay zeka", "yapay zekâ", "gemini", "copilot", "machine learning", "openai")):
        return "Yapay Zeka"
    if any(dkd_word in dkd_words for dkd_word in ("security", "güvenlik", "siber", "privacy", "malware", "vulnerability")):
        return "Güvenlik"
    if dkd_default == "Oyun" or any(dkd_word in dkd_words for dkd_word in ("oyun", "gaming", "game pass", "playstation", "xbox", "steam", "nintendo")):
        return "Oyun"
    if any(dkd_word in dkd_words for dkd_word in ("telefon", "iphone", "android", "phone", "mobile", "mobil")):
        return "Mobil"
    if any(dkd_word in dkd_words for dkd_word in ("işlemci", "gpu", "cpu", "çip", "chip", "laptop", "ekran kart", "donanım", "hardware")):
        return "Donanım"
    return dkd_default


def dkd_relevant(dkd_name, dkd_title):
    """Broad RSS feeds sometimes publish cinema, travel, or general lifestyle news."""
    if dkd_name not in ("Webtekno", "DonanımHaber"):
        return True
    dkd_text = dkd_title.casefold()
    dkd_unrelated = ("film", "dizi", "fragman", "netflix", "disney", "box office", "sinema", "booking.com", "otel", "tatil", "futbol", "maç", "transfer", "otomobil", "araba", "elektrikli araç", "tesla")
    dkd_tech = ("oyun", "game", "playstation", "xbox", "yapay zeka", "yapay zekâ", "teknoloji", "telefon", "iphone", "android", "işlemci", "çip", "chip", "gpu", "bilgisayar", "yazılım", "internet", "robot", "tablet", "ekran", "kamera", "uygulama", "nasa", "3d yazıcı")
    return not any(dkd_word in dkd_text for dkd_word in dkd_unrelated) or any(dkd_word in dkd_text for dkd_word in dkd_tech)


def dkd_parse_date(dkd_value):
    try:
        dkd_date = dkd_email.parsedate_to_datetime(dkd_value)
        if not dkd_date.tzinfo:
            dkd_date = dkd_date.replace(tzinfo=dkd_datetime.timezone.utc)
        dkd_date = dkd_date.astimezone(dkd_datetime.timezone.utc)
        if dkd_date > DKD_NOW + dkd_datetime.timedelta(hours=2):
            return ""
        return dkd_date.isoformat().replace("+00:00", "Z")
    except (TypeError, ValueError, IndexError):
        return ""


def dkd_collect_source(dkd_source):
    dkd_name, dkd_feed, dkd_default, dkd_lang, dkd_domain = dkd_source
    dkd_req = dkd_request.Request(dkd_feed, headers={"User-Agent": "DraBornNews/1.0 (+https://www.draborneagle.com/DraBornNews/)", "Accept": "application/rss+xml, application/xml, text/xml"})
    with dkd_request.urlopen(dkd_req, timeout=13) as dkd_response:
        dkd_bytes = dkd_response.read(850_001)
    if len(dkd_bytes) > 850_000:
        raise ValueError("feed too large")
    dkd_root = DkdET.fromstring(dkd_bytes)
    dkd_items = []
    for dkd_item in dkd_root.findall(".//item")[:25]:
        dkd_title, _ = dkd_plain(dkd_item.findtext("title") or "")
        if not dkd_relevant(dkd_name, dkd_title):
            continue
        dkd_link = dkd_safe_url((dkd_item.findtext("link") or "").strip(), dkd_domain)
        dkd_date = dkd_parse_date(dkd_item.findtext("pubDate"))
        if not dkd_title or not dkd_link or not dkd_date:
            continue
        dkd_description, dkd_description_image = dkd_plain(dkd_item.findtext("description") or "")
        dkd_content_text, dkd_content_image = dkd_plain(dkd_item.findtext(DKD_CONTENT + "encoded") or "")
        dkd_description = dkd_description or dkd_content_text
        dkd_description = dkd_description[:430].rsplit(" ", 1)[0] if len(dkd_description) > 430 else dkd_description
        dkd_media = dkd_item.find(DKD_MEDIA + "content")
        if dkd_media is None:
            dkd_media = dkd_item.find(DKD_MEDIA + "thumbnail")
        dkd_enclosure = dkd_item.find("enclosure")
        dkd_image = dkd_safe_url((dkd_media.get("url", "") if dkd_media is not None else "") or (dkd_enclosure.get("url", "") if dkd_enclosure is not None and dkd_enclosure.get("type", "").startswith("image/") else "") or dkd_description_image or dkd_content_image)
        dkd_tags = [(dkd_tag.text or "") for dkd_tag in dkd_item.findall("category")]
        dkd_id = dkd_hashlib.sha256(dkd_link.encode("utf-8")).hexdigest()[:18]
        dkd_items.append({"id": dkd_id, "title": dkd_title[:190], "summary": dkd_description, "source": dkd_name, "sourceUrl": dkd_link, "publishedAt": dkd_date, "category": dkd_category(dkd_default, dkd_title, dkd_tags), "image": dkd_image, "language": dkd_lang, "editorial": False})
    return dkd_name, dkd_items


def dkd_ai_rewrite(dkd_story, dkd_key):
    dkd_payload = {"model": dkd_os.getenv("DKD_NEWS_MODEL", "gpt-4.1-mini"), "store": False, "max_output_tokens": 400,
        "instructions": "Türkçe oyun/teknoloji haber editörüsün. Yalnızca verilen başlık ve kısa kaynak özetinden çıkabilen doğrulanabilir bilgilerle, özgün ve canlı bir haber başlığı ve 2 kısa paragraflık (toplam 60-105 kelime) özet yaz. Kaynağın tam metnini görmüş gibi davranma; spekülasyon, kesin tarih/fiyat/teknik ayrıntı ekleme. Abartılı clickbait kullanma. Sadece JSON döndür: {\"title\":\"...\",\"summary\":\"...\"}.",
        "input": dkd_json.dumps({"source": dkd_story["source"], "title": dkd_story["title"], "excerpt": dkd_story["summary"][:420]}, ensure_ascii=False)}
    dkd_req = dkd_request.Request("https://api.openai.com/v1/responses", data=dkd_json.dumps(dkd_payload).encode(), headers={"Authorization": "Bearer " + dkd_key, "Content-Type": "application/json"}, method="POST")
    with dkd_request.urlopen(dkd_req, timeout=28) as dkd_response:
        dkd_result = dkd_json.load(dkd_response)
    dkd_text = "".join(dkd_part.get("text", "") for dkd_output in dkd_result.get("output", []) for dkd_part in dkd_output.get("content", []) if dkd_part.get("type") == "output_text")
    dkd_copy = dkd_json.loads(dkd_text)
    dkd_title = str(dkd_copy.get("title", "")).strip()
    dkd_summary = str(dkd_copy.get("summary", "")).strip()
    if not (12 <= len(dkd_title) <= 180 and 80 <= len(dkd_summary) <= 900):
        raise ValueError("invalid editorial output")
    dkd_story.update({"title": dkd_title, "summary": dkd_summary, "editorial": True, "language": "tr"})


def dkd_main():
    dkd_previous = {dkd_item["id"]: dkd_item for dkd_item in dkd_json.loads(DKD_OUTPUT.read_text()).get("items", [])} if DKD_OUTPUT.exists() else {}
    dkd_all = []
    dkd_ok = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=7) as dkd_pool:
        for dkd_source, dkd_future in zip(DKD_SOURCES, [dkd_pool.submit(dkd_collect_source, dkd_source) for dkd_source in DKD_SOURCES]):
            try:
                dkd_name, dkd_items = dkd_future.result()
                if dkd_items:
                    dkd_all.extend(dkd_items)
                    dkd_ok.append(dkd_name)
                else:
                    print(f"[DraBornNews] empty: {dkd_source[0]}", file=dkd_sys.stderr)
            except Exception as dkd_error:
                print(f"[DraBornNews] {dkd_source[0]} unavailable: {dkd_error}", file=dkd_sys.stderr)
    if len(dkd_ok) < 2 and not dkd_previous:
        raise RuntimeError("too few feeds; refuse to publish an empty news page")
    dkd_all.extend(dkd_story for dkd_story in dkd_previous.values() if dkd_story["source"] not in dkd_ok)
    dkd_unique = {dkd_story["id"]: dkd_story for dkd_story in dkd_all}
    for dkd_id, dkd_story in dkd_unique.items():
        dkd_old = dkd_previous.get(dkd_id)
        if dkd_old and dkd_old.get("editorial"):
            dkd_story.update({"title": dkd_old["title"], "summary": dkd_old["summary"], "editorial": True, "language": "tr"})
    dkd_stories = sorted(dkd_unique.values(), key=lambda dkd_story: dkd_story["publishedAt"], reverse=True)[:100]
    dkd_key = dkd_os.getenv("OPENAI_API_KEY", "")
    if dkd_key:
        for dkd_story in [dkd_story for dkd_story in dkd_stories if not dkd_story["editorial"] and dkd_story["summary"]][:8]:
            try:
                dkd_ai_rewrite(dkd_story, dkd_key)
            except Exception as dkd_error:
                print(f"[DraBornNews] editorial failed for {dkd_story['id']}: {dkd_error}", file=dkd_sys.stderr)
    dkd_canonical = [{dkd_key: dkd_value for dkd_key, dkd_value in dkd_story.items()} for dkd_story in dkd_stories]
    if dkd_previous and dkd_canonical == list(dkd_previous.values())[:100]:
        print(f"[DraBornNews] no new articles ({len(dkd_stories)} kept)")
        return
    dkd_output = {"generatedAt": DKD_NOW.isoformat().replace("+00:00", "Z"), "sourceCount": len(dkd_ok), "items": dkd_canonical}
    DKD_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    DKD_OUTPUT.write_text(dkd_json.dumps(dkd_output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"[DraBornNews] wrote {len(dkd_stories)} articles from {len(dkd_ok)} feeds")


if __name__ == "__main__":
    dkd_main()
