import os
import pypdf

folder = "/Users/claudiokurath/Desktop/Brother"
for filename in os.listdir(folder):
    if filename.endswith(".pdf"):
        filepath = os.path.join(folder, filename)
        print(f"=== File: {filename} ===")
        try:
            reader = pypdf.PdfReader(filepath)
            print(f"Pages: {len(reader.pages)}")
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    print(f"--- Page {i+1} ---")
                    print(text[:1000]) # Print first 1000 chars
                else:
                    print(f"--- Page {i+1} has no extractable text ---")
        except Exception as e:
            print(f"Error reading {filename}: {e}")
