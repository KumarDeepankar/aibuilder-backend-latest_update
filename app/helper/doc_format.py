from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt
from docx.enum.table import WD_TABLE_ALIGNMENT

def set_cell_borders(cell):
    """Set borders for a table cell with direct XML manipulation"""
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    
    borders = {
        'top': {'val': 'single', 'sz': '4', 'color': '000000'},
        'left': {'val': 'single', 'sz': '4', 'color': '000000'},
        'bottom': {'val': 'single', 'sz': '4', 'color': '000000'},
        'right': {'val': 'single', 'sz': '4', 'color': '000000'}
    }
    
    for border, props in borders.items():
        element = OxmlElement(f'w:{border}')
        for attr, value in props.items():
            element.set(qn(f'w:{attr}'), value)
        tcPr.append(element)

def merge_empty_cells(row):
    """Merge consecutive empty cells in a table row, handling both leading and trailing empty cells"""
    cells = row.cells
    if not cells:
        return
    
    # Case 1: Empty cells before content
    first_content_idx = next((i for i, cell in enumerate(cells) if cell.text.strip()), None)
    if first_content_idx is not None and first_content_idx > 0:
        # Merge all empty cells before content into one
        cells[0].merge(cells[first_content_idx-1])
        cells[0].text = ""  # Clear any accidental content
        # Refresh cells list after merge
        cells = row.cells
    
    # Case 2: Empty cells after content
    if cells:  # Check if we still have cells after potential merge
        last_content_idx = len(cells) - 1 - next(
            (i for i, cell in enumerate(reversed(cells)) if cell.text.strip()), 
            len(cells))
        if last_content_idx < len(cells) - 1:
            # Merge all empty cells after content
            cells[last_content_idx].merge(cells[-1])

def process_docx_tables(doc):
    """Process all tables in document for borders and empty cells"""
    for table in doc.tables:
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        
        for row in table.rows:
            merge_empty_cells(row)
            
            # Apply borders to all cells (including merged ones)
            for cell in row.cells:
                set_cell_borders(cell)
                
                # Set consistent formatting
                for paragraph in cell.paragraphs:
                    paragraph.style = doc.styles['Normal']
                    paragraph.paragraph_format.space_after = Pt(0)