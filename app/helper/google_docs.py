#!/usr/bin/env python3
"""
Standalone upload+convert script
"""
from pathlib import Path
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# ←– Configure these three values:
FOLDER_ID   = "1xnyoRVIe2edmWvEmBF438a2nEJmk_V5E"

# ←– Credentials
SCOPES     = ["https://www.googleapis.com/auth/drive.file"]
KEY_FILE   = Path(__file__).with_name("gen-lang-client-0057847649-f4d80fc7ef12.json")

def upload_docx_as_gdoc(docx_path: Path, title: str, folder_id: str = None):
    creds = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)
    drive = build("drive", "v3", credentials=creds)

    media = MediaFileUpload(
        str(docx_path),
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    metadata = {
        "name": title,
        "mimeType": "application/vnd.google-apps.document",
        "parents": [folder_id] if folder_id else []
    }

    gfile = drive.files().create(
        body=metadata, media_body=media, fields="id, webViewLink"
    ).execute()
    print("Created Google Doc →", gfile["webViewLink"])
    return gfile["webViewLink"]
