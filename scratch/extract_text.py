import os
from pypdf import PdfReader

pdf_path = "/Users/claudiokurath/Library/CloudStorage/GoogleDrive-claudio.kurath@gmail.com/My Drive/CASE_02_IMMIGRATION_APPEAL/SECTION_C_LEGAL_REPRESENTATION/25.05.19 CCL.pdf"

if os.path.exists(pdf_path):
    print(f"Reading: {pdf_path}")
    reader = PdfReader(pdf_path)
    print(f"Pages: {len(reader.pages)}")
    
    # Print first 2 pages
    for i in range(min(2, len(reader.pages))):
        print(f"--- Page {i+1} ---")
        text = reader.pages[i].extract_text()
        print(text)
else:
    print(f"File not found: {pdf_path}")
