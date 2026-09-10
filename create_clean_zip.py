import os
import zipfile

SOURCE_DIR = r'C:\Users\anand\.gemini\antigravity\scratch\sih-artisan-app'
OUTPUT_ZIP = os.path.expanduser(r'~\OneDrive\Desktop\Kaarvi_Source_Code.zip')

EXCLUDE_DIRS = {
    'node_modules',
    '.git',
    'dist',
    'dev-dist',
    '.gradle',
    'build',
    '.idea',
    '__pycache__'
}

EXCLUDE_FILES = {
    '.DS_Store',
    'Thumbs.db'
}

def make_clean_zip():
    print(f"Creating clean zip archive at: {OUTPUT_ZIP}")
    total_files = 0
    with zipfile.ZipFile(OUTPUT_ZIP, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(SOURCE_DIR):
            # Prune excluded directories in-place
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            
            for file in files:
                if file in EXCLUDE_FILES or file.endswith(('.tmp', '.log')):
                    continue
                full_path = os.path.join(root, file)
                # Relative path inside the zip
                rel_path = os.path.relpath(full_path, SOURCE_DIR)
                zf.write(full_path, arcname=os.path.join('sih-artisan-app', rel_path))
                total_files += 1

    size_mb = os.path.getsize(OUTPUT_ZIP) / (1024 * 1024)
    print(f"Zip created successfully: {total_files} files packaged, size: {size_mb:.2f} MB")

if __name__ == '__main__':
    make_clean_zip()
