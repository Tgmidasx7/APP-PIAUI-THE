"""Verificações básicas para a página estática, sem acesso à rede."""

import collections
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.tabs = []
        self.canvases = set()
        self.scripts = []
        self.script_sources = []
        self.in_inline_script = False
        self.lang = None
        self.viewport = False
        self.csp = False
        self.referrer = False
        self.has_doctype = False

    def handle_decl(self, decl):
        if decl.lower() == "doctype html":
            self.has_doctype = True

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "html":
            self.lang = attrs.get("lang")
        if tag == "meta" and attrs.get("name", "").lower() == "viewport":
            self.viewport = True
        if tag == "meta" and attrs.get("http-equiv", "").lower() == "content-security-policy":
            self.csp = True
        if tag == "meta" and attrs.get("name", "").lower() == "referrer":
            self.referrer = attrs.get("content") == "no-referrer"
        if tag == "button" and "data-tab" in attrs:
            self.tabs.append(attrs["data-tab"])
        if tag == "canvas" and "id" in attrs:
            self.canvases.add(attrs["id"])
        if tag == "script" and "src" in attrs:
            self.script_sources.append(attrs["src"])
        if tag == "script" and "src" not in attrs:
            self.in_inline_script = True
            self.scripts.append("")

    def handle_endtag(self, tag):
        if tag == "script":
            self.in_inline_script = False

    def handle_data(self, data):
        if self.in_inline_script:
            self.scripts[-1] += data


class SiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = PageParser()
        cls.page.feed((ROOT / "index.html").read_text(encoding="utf-8"))
        cls.page.close()

    def test_basic_document_metadata(self):
        self.assertTrue(self.page.has_doctype)
        self.assertEqual(self.page.lang, "pt-BR")
        self.assertTrue(self.page.viewport)
        self.assertTrue(self.page.csp)
        self.assertTrue(self.page.referrer)

    def test_ids_are_unique(self):
        duplicates = [key for key, count in collections.Counter(self.page.ids).items() if count > 1]
        self.assertEqual(duplicates, [])

    def test_tabs_have_content(self):
        self.assertTrue(self.page.tabs, "Nenhuma aba encontrada")
        self.assertEqual(len(self.page.tabs), len(set(self.page.tabs)), "Abas duplicadas")
        for tab in self.page.tabs:
            with self.subTest(tab=tab):
                self.assertIn("tab-" + tab, self.page.ids)

    def test_chart_targets_exist(self):
        chart_targets = re.findall(
            r"createChart\s*\(\s*document\.getElementById\(\s*['\"]([^'\"]+)['\"]\s*\)",
            "\n".join(self.page.scripts),
        )
        self.assertTrue(chart_targets, "Nenhum gráfico encontrado")
        for target in chart_targets:
            with self.subTest(chart=target):
                self.assertIn(target, self.page.canvases)

    def test_chart_library_is_local_and_available(self):
        self.assertIn("assets/vendor/chart.umd.js", self.page.script_sources)
        for src in self.page.script_sources:
            self.assertFalse(src.startswith(("http:", "https:")), f"Script externo: {src}")
            self.assertTrue((ROOT / src).is_file(), f"Script ausente: {src}")

    def test_inline_javascript_syntax(self):
        self.assertTrue(self.page.scripts, "Nenhum script embutido encontrado")
        self.assertIsNotNone(shutil.which("node"), "Node.js é necessário para verificar a sintaxe")
        for index, script in enumerate(self.page.scripts):
            with self.subTest(script=index):
                result = subprocess.run(
                    ["node", "--check"], input=script, text=True, capture_output=True, check=False
                )
                self.assertEqual(result.returncode, 0, result.stderr)

    def test_eyeofgod_standalone_page(self):
        eog_path = ROOT / "eyeofgod" / "index.html"
        self.assertTrue(eog_path.is_file(), "Página /eyeofgod/index.html ausente")
        eog = PageParser()
        eog.feed(eog_path.read_text(encoding="utf-8"))
        eog.close()
        self.assertTrue(eog.has_doctype)
        self.assertEqual(eog.lang, "pt-BR")
        self.assertTrue(eog.viewport)
        self.assertTrue(eog.csp)
        self.assertTrue(eog.referrer)
        duplicates = [key for key, count in collections.Counter(eog.ids).items() if count > 1]
        self.assertEqual(duplicates, [])
        for src in eog.script_sources:
            self.assertFalse(src.startswith(("http:", "https:")), f"Script externo: {src}")
            resolved = (eog_path.parent / src).resolve()
            self.assertTrue(resolved.is_file(), f"Script ausente: {src}")

    def test_v2_structured_data_and_snapshot_exist(self):
        import json
        snapshot_path = ROOT / "data" / "piaui-live.json"
        self.assertTrue(snapshot_path.is_file(), "Snapshot data/piaui-live.json ausente")
        data = json.loads(snapshot_path.read_text(encoding="utf-8"))
        self.assertIn("sources", data)
        self.assertEqual(data["sources"]["ibge"]["municipiosCount"], 224)
        self.assertTrue((ROOT / "assets" / "ontology.js").is_file())
        self.assertTrue((ROOT / "assets" / "realtime-gov.js").is_file())
        self.assertTrue((ROOT / "scripts" / "sync_osint.mjs").is_file())

    def test_teresina_parallel_edition(self):
        the_path = ROOT / "teresina" / "index.html"
        self.assertTrue(the_path.is_file(), "Página /teresina/index.html ausente")
        the = PageParser()
        the.feed(the_path.read_text(encoding="utf-8"))
        the.close()
        self.assertTrue(the.has_doctype)
        self.assertEqual(the.lang, "pt-BR")
        self.assertTrue(the.viewport)
        self.assertTrue(the.csp)
        self.assertTrue(the.referrer)
        duplicates = [key for key, count in collections.Counter(the.ids).items() if count > 1]
        self.assertEqual(duplicates, [])
        self.assertEqual(len(the.tabs), 14, "Teresina Capital deve espelhar todas as 14 abas")
        for tab in the.tabs:
            with self.subTest(teresina_tab=tab):
                self.assertIn("tab-" + tab, the.ids)
        self.assertIn("../assets/vendor/chart.umd.js", the.script_sources)
        self.assertIn("../assets/teresina-app.js", the.script_sources)
        for src in the.script_sources:
            self.assertFalse(src.startswith(("http:", "https:")), f"Script externo em /teresina/: {src}")
            resolved = (the_path.parent / src).resolve()
            self.assertTrue(resolved.is_file(), f"Script ausente em /teresina/: {src}")
        app_js = (ROOT / "assets" / "teresina-app.js").read_text(encoding="utf-8")
        the_charts = re.findall(r"createTheChart\s*\(\s*['\"]([^'\"]+)['\"]", app_js)
        self.assertEqual(len(the_charts), 11)
        for cid in the_charts:
            with self.subTest(teresina_chart=cid):
                self.assertIn(cid, the.canvases)


if __name__ == "__main__":
    unittest.main()
