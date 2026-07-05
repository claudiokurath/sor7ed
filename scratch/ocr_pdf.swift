import Foundation
import PDFKit
import Vision

guard CommandLine.arguments.count > 1 else {
    print("Usage: swift ocr_pdf.swift <path_to_pdf>")
    exit(1)
}

let pdfPath = CommandLine.arguments[1]
let url = URL(fileURLWithPath: pdfPath)

guard let document = PDFDocument(url: url) else {
    print("Failed to load PDF document at \(pdfPath)")
    exit(1)
}

print("Number of pages: \(document.pageCount)")

for i in 0..<document.pageCount {
    print("\n=== Page \(i + 1) ===")
    guard let page = document.page(at: i) else { continue }
    
    // Render PDF page to NSImage / CGImage
    let pageRect = page.bounds(for: .mediaBox)
    let renderer = transformPageToImage(page: page, rect: pageRect)
    
    guard let cgImage = renderer else {
        print("Failed to render page \(i+1)")
        continue
    }
    
    // Perform OCR
    let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    let request = VNRecognizeTextRequest { request, error in
        if let error = error {
            print("OCR Error: \(error.localizedDescription)")
            return
        }
        guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
        
        let recognizedStrings = observations.compactMap { observation in
            observation.topCandidates(1).first?.string
        }
        print(recognizedStrings.joined(separator: "\n"))
    }
    
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    
    do {
        try requestHandler.perform([request])
    } catch {
        print("Failed to perform OCR: \(error.localizedDescription)")
    }
}

func transformPageToImage(page: PDFPage, rect: CGRect) -> CGImage? {
    // Render PDFPage to CGImage via NSImage
    let size = rect.size
    let nsImage = NSImage(size: size)
    nsImage.lockFocus()
    
    guard let context = NSGraphicsContext.current?.cgContext else {
        nsImage.unlockFocus()
        return nil
    }
    
    // Clear background
    context.setFillColor(NSColor.white.cgColor)
    context.fill(CGRect(origin: .zero, size: size))
    
    // Draw PDF page
    page.draw(with: .mediaBox, to: context)
    
    nsImage.unlockFocus()
    
    var imageRect = CGRect(origin: .zero, size: size)
    return nsImage.cgImage(forProposedRect: &imageRect, context: nil, hints: nil)
}
