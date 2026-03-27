import re

with open("c:/Users/prana/OneDrive/Desktop/FitSense/pdf_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Replace typical names
text = text.replace("BUILDX", "FitSense")
text = text.replace("Buildx", "FitSense")
text = text.replace("A Website Builder Platform For Easy Website Creation", "An AI-Powered Fitness Tracking And Intelligence Application")
text = text.replace("A Website Builder Platform For \nEasy Website Creation", "An AI-Powered Fitness Tracking \nAnd Intelligence Application")
text = text.replace("A Website \nBuilder Platform For Easy Website Creation", "An AI-Powered \nFitness Tracking And Intelligence Application")
text = text.replace("website builder platform", "fitness tracking platform")
text = text.replace("website builder", "fitness tracking application")
text = text.replace("Website Builder", "Fitness Tracking Application")
text = text.replace("website creation", "personalized fitness tracking")
text = text.replace("Website Creation", "Personalized Fitness Tracking")

# Replace Students
text = re.sub(r"Chirag Sharma\s*\(2303031241246\s*\)", "Pranav (2026000010)", text)
text = re.sub(r"Bolisetty Naga Venkata Mukesh\s*\(2303031240274\s*\)", "", text)
text = re.sub(r"Aditya Bhoi\s*\(2303031240176\s*\)", "", text)
text = re.sub(r"Shrey Dixit\s*\(2303031240350\s*\)", "", text)

# Clean up empty lines resulting from removed students
text = re.sub(r'\n\s*\n\s*\n', '\n\n', text)

with open("c:/Users/prana/OneDrive/Desktop/FitSense/FitSense_Project_Report.md", "w", encoding="utf-8") as f:
    f.write(text)

print("Done generating FitSense_Project_Report.md")
