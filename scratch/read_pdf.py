import pypdf
import sys

pdf_path = "/Users/claudiokurath/Downloads/Stellungnahme Shurgard Polizei.pdf"
reader = pypdf.PdfReader(pdf_path)
print(f"Number of pages: {len(reader.pages)}")

# Print text of first few pages or search for text
for i in range(min(5, len(reader.pages))):
    print(f"--- Page {i+1} ---")
    print(reader.pages[i].extract_text()[:2000])
