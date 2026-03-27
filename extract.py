import sys
try:
    import PyPDF2
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
    import PyPDF2

pdf_path = r"c:\Users\prana\Downloads\BuildX Project Report.pdf"
try:
    reader = PyPDF2.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"

    with open("pdf_text.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Done")
except Exception as e:
    print("Error:", e)
