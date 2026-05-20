import os
from pypdf import PdfReader, PdfWriter

base_path = "/Users/claudiokurath/Library/CloudStorage/GoogleDrive-claudio.kurath@gmail.com/My Drive/CASE_02_IMMIGRATION_APPEAL"

files = [
    os.path.join(base_path, "SECTION_A_HOME_OFFICE_DECISIONS", "Deportation Notice.pdf"),
    os.path.join(base_path, "SECTION_C_LEGAL_REPRESENTATION", "25.05.19 CCL.pdf"),
    os.path.join(base_path, "SECTION_D_PERSONAL_STATEMENTS", "Statement Claudio Kurath.pdf"),
    os.path.join(base_path, "SECTION_E_EVIDENCE_IDENTITY", "Swiss ID Docs.pdf"),
    os.path.join(base_path, "SECTION_F_EVIDENCE_FINANCIAL", "NOV.pdf"),
    os.path.join(base_path, "SECTION_F_EVIDENCE_FINANCIAL", "DEC.pdf"),
    os.path.join(base_path, "SECTION_G_EVIDENCE_MEDICAL", "Emailing MEWA Claudio Kurath.pdf"),
]

writer = PdfWriter()

for pdf in files:
    if os.path.exists(pdf):
        print(f"Processing: {pdf}")
        reader = PdfReader(pdf)
        if reader.is_encrypted:
            print(f"  File is encrypted. Trying to decrypt...")
            try:
                reader.decrypt("")
                print("  Successfully decrypted with empty password.")
            except Exception as e:
                print(f"  Failed to decrypt: {e}")
                print(f"  Skipping encrypted file: {pdf}")
                continue
        
        try:
            # Append pages
            for page in reader.pages:
                writer.add_page(page)
            print(f"  Added {len(reader.pages)} pages.")
        except Exception as e:
            print(f"  Error reading pages: {e}")
            print(f"  Skipping file due to read error: {pdf}")
    else:
        print(f"File not found: {pdf}")

output_path = os.path.join(base_path, "MASTER_BUNDLE_v1.pdf")
with open(output_path, "wb") as f:
    writer.write(f)
writer.close()
print(f"Created bundle: {output_path}")
