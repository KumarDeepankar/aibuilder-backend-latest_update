from app.helper.md_to_docx import html_to_docx
from app.helper.doc_format import Document, process_docx_tables

import os
from google import genai
import os
import json
import yaml
import re
import unicodedata, string
from google.genai import types
from dotenv import load_dotenv
from app.helper.md_to_docx import html_to_docx
from app.helper.doc_format import Document, process_docx_tables
from app.helper.google_docs import upload_docx_as_gdoc
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
model = "gemini-2.5-pro-exp-03-25"
image_dir = "images"
output_dir = "output"

def get_block_info(template_type=None):
    """
    Load block knowledge base and return a formatted string of block types and descriptions.
    Optionally filter by template_type.
    """
    kb_path = "app/aem_block_kb/block_kb.yaml"
    with open(kb_path, "r") as kb_file:
        kb = yaml.safe_load(kb_file)
    blocks = [b for b in kb["blocks"] if not template_type or b.get("element") == template_type]
    return "\n\n".join(
        f"### {b['type']} - {b['description']} ({b['element']})" for b in blocks
    )

# --------------------------------------------------------------------------- #
# helper – extract JSON from Gemini text responses (handles code-fences, etc.)
# --------------------------------------------------------------------------- #
def _extract_json(raw: str) -> str:
    # strip ```json … ``` fences if they exist
    raw = re.sub(r"```(?:json)?\s*", "", raw).replace("```", "").strip()
    # grab substring from first “{” to last “}”
    start, end = raw.find("{"), raw.rfind("}")
    if start != -1 and end != -1 and end > start:
        return raw[start : end + 1]
    # fallback – return whole string
    return raw

def analyze_image(image_path: str) -> dict:
    with open(image_path, "rb") as f:
        img_bytes = f.read()

    prompt = f"""
You have perfect vision and pay great attention to detail, making you an expert at analyzing user interfaces.
Identify every UI section in the screenshot and map it to the most suitable AEM block type.

• For each section include: type, properties, layout, markdown_template, element_type.
• Output MUST be a single, valid JSON object. No extra text, no code fences.

Available block types:
{get_block_info()}

Expected top-level JSON structure:
{{
  "page_title": "Page title",
  "components": [
    {{
      "type": "block_type",
      "properties": {{
        "title": "Component title",
        "description": "Description text",
        "imageRef": "image reference"
      }},
      "layout": "layout information",
      "markdown_template": "block_type",
      "element_type": "page-building or global"
    }}
  ]
}}
""".strip()

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_bytes(mime_type="image/png", data=img_bytes),
                types.Part.from_text(text=prompt),
            ],
        )
    ]
    config = types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_budget=0),
        response_mime_type="text/plain",
    )

    raw = "".join(
        chunk.text
        for chunk in client.models.generate_content_stream(
            model=model, contents=contents, config=config
        )
    )

    payload = _extract_json(raw)
    return json.loads(payload)  # raises if malformed

def load_block_kb(path="app/aem_block_kb/block_kb.yaml"):
    """
    Load the block knowledge base YAML and return a dict mapping block type to block info.
    """
    with open(path) as f:
        kb = yaml.safe_load(f)
    return {b["type"]: b for b in kb["blocks"]}

def _slug(txt: str, fallback: str = "page") -> str:
    """
    Convert a string to a safe filename slug (e.g., "Home Page!" -> "home_page").
    """
    if not txt:
        return fallback
    txt = unicodedata.normalize("NFKD", txt).encode("ascii", "ignore").decode()
    txt = txt.lower()
    allowed = string.ascii_lowercase + string.digits + "_"
    txt = "".join(c if c in allowed else "_" for c in txt)
    txt = re.sub(r"_+", "_", txt).strip("_")
    return txt or fallback

async def map_ui_to_blocks(page_json, block_kb):
    """
    Deterministically map UI JSON to block definitions, including element_type and kb_html.
    """
    mapped = []
    for comp in page_json.get("components", []):
        blk = block_kb.get(comp["type"])
        if not blk:
            continue
        mapped.append({
            "type": comp["type"],
            "element_type": comp.get("element_type", blk.get("element", "page-building")),
            "properties": comp.get("properties", {}),
            "layout": comp.get("layout", ""),
            "kb_html": blk["html"],
        })
    return mapped

def render_markdown(client, model, page_payload):
    """
    Phase 2: Generate HTML content from the mapped JSON and block templates using Gemini.
    - Sends a strict prompt and the JSON payload.
    - Returns the generated HTML.
    """
    prompt = f"""
You are an expert AEM content author.

TASK
----
Create HTML content based on the JSON page payload and HTML templates provided.

STRICT RULES
1. Use ONLY the HTML structure from the templates in `kb_html`, preserving tags, elements, and structure.
2. Replace ALL content in the templates (titles, descriptions, text, image paths) with values from the JSON properties.
3. NEVER copy any placeholder text or content from the template examples.
4. All image src attributes should use "media/image#.jpeg" format where # is a sequential number.
5. Output ONLY the final HTML content—no explanations or code fences.
6. EXCEPTION: Preserve any metadata tables exactly as they appear in the original template.

For example, if kb_html contains:
<h2>Example Heading</h2>
<p>Lorem ipsum dolor sit amet</p>

And your component specifies title "Weather Forecast", your output should be:
<h2>Weather Forecast</h2>
<p>Check the latest weather updates for your area.</p>

CRITICAL: DO NOT KEEP ANY EXAMPLE TEXT FROM THE TEMPLATES EXCEPT FOR METADATA TABLES. Replace all other content while maintaining structure with json provided.

page_payload:
{json.dumps(page_payload, indent=2)}
"""
    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt)]
        )
    ]
    config = types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_budget=0),
        response_mime_type="text/plain",
    )
    return "".join(chunk.text for chunk in client.models.generate_content_stream(model=model, contents=contents, config=config))

def save_html_and_docx(html, fname_base):
    """
    Save HTML to file, convert to DOCX, and enhance DOCX formatting.
    """
    html_fname = f"{fname_base}.html"
    docx_fname = f"{fname_base}.docx"
    with open(html_fname, "w") as f:
        f.write(html)
    print(f"✓ saved → {html_fname}")
    html_to_docx(html_fname, docx_fname)
    print(f"✓ converted to DOCX → {docx_fname}")
    doc = Document(docx_fname)
    process_docx_tables(doc)
    doc.save(docx_fname)
    print(f"✓ enhanced DOCX formatting → {docx_fname}")


async def generate_docs(ui_json, mapped, image_path):

    global_blocks = {}  
    pages = [] 
    page_building = []
    for comp in mapped:
        if comp["element_type"] == "global":
            global_blocks.setdefault(comp["type"], comp)
        else:
            page_building.append(comp)
    pages.append({
        "title": ui_json.get("page_title") or os.path.splitext(os.path.basename(image_path))[0],
        "components": page_building
    })

    # Render and save all global blocks (once per type)
    for blk_type, comp in global_blocks.items():
        html = render_markdown(client, model, {"components": [comp]}).strip()
        if html:
            fname_base = os.path.join(output_dir, _slug(blk_type))
            save_html_and_docx(html, fname_base)

    # Render and save each page (excluding global blocks)
    for page in pages:
        if not page["components"]:
            continue
        html = render_markdown(client, model, {"components": page["components"]}).strip()
        if html:
            fname_base = os.path.join(output_dir, _slug(page['title']))
            save_html_and_docx(html, fname_base)
            google_docs_link = upload_docx_as_gdoc(f"output/{fname_base}",page['title'])
            return google_docs_link
