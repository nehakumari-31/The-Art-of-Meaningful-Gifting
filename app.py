from __future__ import annotations

import base64
import json
import mimetypes
import os
import re
import xml.etree.ElementTree as ET
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components


ROOT = Path(__file__).parent
INDEX_FILE = ROOT / "index.html"
SETTINGS_XML = ROOT / "settings.xml"


def _to_data_uri(file_path: Path) -> str | None:
    if not file_path.exists() or not file_path.is_file():
        return None

    mime_type, _ = mimetypes.guess_type(file_path.name)
    if not mime_type:
        mime_type = "application/octet-stream"

    encoded = base64.b64encode(file_path.read_bytes()).decode("utf-8")
    return f"data:{mime_type};base64,{encoded}"


def _inline_styles(html: str, base_path: Path) -> str:
    pattern = re.compile(r'<link\s+[^>]*rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\'][^>]*>', re.IGNORECASE)

    def replace(match: re.Match[str]) -> str:
        href = match.group(1).strip()
        css_path = (base_path / href).resolve()
        if not css_path.exists():
            return match.group(0)
        try:
            css_content = css_path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            return match.group(0)
        return f"<style>\n{css_content}\n</style>"

    return pattern.sub(replace, html)


def _inline_scripts(html: str, base_path: Path) -> str:
    pattern = re.compile(r'<script\s+[^>]*src=["\']([^"\']+)["\'][^>]*>\s*</script>', re.IGNORECASE)

    def replace(match: re.Match[str]) -> str:
        src = match.group(1).strip()
        js_path = (base_path / src).resolve()
        if not js_path.exists():
            return match.group(0)
        try:
            js_content = js_path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            return match.group(0)
        return f"<script>\n{js_content}\n</script>"

    return pattern.sub(replace, html)


def _inline_images(html: str, base_path: Path) -> str:
    pattern = re.compile(r'(<img\s+[^>]*src=["\'])([^"\']+)(["\'][^>]*>)', re.IGNORECASE)

    def replace(match: re.Match[str]) -> str:
        prefix, src, suffix = match.groups()
        src = src.strip()
        if src.startswith(("http://", "https://", "data:")):
            return match.group(0)

        image_path = (base_path / src).resolve()
        data_uri = _to_data_uri(image_path)
        if not data_uri:
            return match.group(0)
        return f"{prefix}{data_uri}{suffix}"

    return pattern.sub(replace, html)


def load_embedded_html() -> str:
    if not INDEX_FILE.exists():
        return "<h3>Missing index.html</h3><p>Please keep index.html in the project root.</p>"

    html = INDEX_FILE.read_text(encoding="utf-8")
    groq_key = st.secrets.get("GROQ_API_KEY", os.environ.get("GROQ_API_KEY", ""))
    if not groq_key and SETTINGS_XML.exists():
        try:
            tree = ET.parse(SETTINGS_XML)
            node = tree.getroot().find("./apiKeys/groq")
            if node is not None and node.text:
                groq_key = node.text.strip()
        except ET.ParseError:
            groq_key = ""
    bootstrap_script = (
        "<script>"
        f"window.__SENTRA_GROQ_KEY = {json.dumps(groq_key)};"
        "</script>"
    )
    html = html.replace("</head>", f"{bootstrap_script}</head>", 1)
    html = _inline_styles(html, ROOT)
    html = _inline_scripts(html, ROOT)
    html = _inline_images(html, ROOT)
    return html


def main() -> None:
    st.set_page_config(page_title="Sentra - Meaningful Gifting", layout="wide")
    st.title("Sentra - Meaningful Gifting")
    st.caption("Streamlit deployment wrapper for your existing frontend.")

    html = load_embedded_html()
    components.html(html, height=1100, scrolling=True)


if __name__ == "__main__":
    main()
