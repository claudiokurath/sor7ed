import pypdf
import sys

pdf_path = "/Users/claudiokurath/Desktop/Gmail - Fw: Immigration and Asylum appeal: application for Expedite refused.pdf"
reader = pypdf.PdfReader(pdf_path)
print(f"Number of pages: {len(reader.pages)}")

for i in range(len(reader.pages)):
    print(f"=== Page {i+1} ===")
    print(reader.pages[i].extract_text())
