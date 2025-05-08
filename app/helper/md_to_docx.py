import pypandoc

def md_to_docx(md_file, docx_file):
    output = pypandoc.convert_file(md_file, 'docx', outputfile=docx_file)
    print(f"Converted {md_file} to {docx_file}")
    
def html_to_docx(html_file, docx_file):
    """Phase 1: convert a HTML file into a DOCX file."""
    pypandoc.convert_file(html_file, 'docx', outputfile=docx_file)
    print(f"Converted {html_file} to {docx_file}")

def docx_to_html(docx_file, html_file):
    """Phase 2: convert a DOCX file into a standalone HTML file."""
    pypandoc.convert_file(docx_file, 'html', outputfile=html_file)
    print(f"Converted {docx_file} to {html_file}")

def docx_to_html_in_markdown(docx_file, md_file):
    """Phase 3: embed the converted HTML into a Markdown file (raw HTML block)."""
    html = pypandoc.convert_file(docx_file, 'html')
    with open(md_file, 'w') as f:
        f.write(html)
    print(f"Embedded HTML from {docx_file} into {md_file}")

# if __name__ == "__main__":
#     # example usage
#     md_to_docx('/Users/jayvisaria/Documents/Jay/ARGO/aem_block_kb/test.md', 'test3.docx')
#     # docx_to_html('/Users/jayvisaria/Documents/Jay/ARGO/aem_block_kb/hero.docx', 'hero_embedded.html')
#     # html_to_docx('/Users/jayvisaria/Documents/Jay/ARGO/aem_block_kb/card_embedded.html', 'card1.docx')
#     # docx_to_html_in_markdown('/Users/jayvisaria/Documents/Jay/ARGO/aem_block_kb/nav.docx', 'nav_embedded.md')