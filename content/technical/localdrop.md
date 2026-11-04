---
title: "LocalDrop: Zero-Configuration Local Wi-Fi File Sharing"
date: "2026-06-10"
summary: "Instant P2P file transfers over local Wi-Fi with no cables, no cloud relays, and no recipient setup."
tags: ["networking", "javascript", "p2p", "tools"]
link: "https://github.com/rishi-msrit/localdrop"
linkLabel: "View on GitHub"
pinned: true
draft: false
---

# LocalDrop

A local Wi-Fi file drop. Start the server on any laptop, open the URL on any device on the same network, and send files. No setup on the receiving device, no cables, no accounts.

Built originally to solve the iPhone-to-Windows transfer problem — there is no native way to wirelessly move photos from an iPhone to a Windows PC without iCloud or a third-party app. LocalDrop fixes that by turning the laptop into a small server the iPhone's browser can talk to directly.

---

## What works

Any device with a browser can both upload and download, as long as it is on the same Wi-Fi as the laptop running the server.

| From | To | How |
| --- | --- | --- |
| iPhone | Windows laptop | Upload from Safari, files appear on disk |
| iPhone | iPhone | One uploads, the other downloads from the gallery |
| iPhone | Android | Same — one uploads, any other device can download |
| Android | Windows | Same flow, works from Chrome on Android |
| Windows | Windows | Works across two laptops on the same network |
| Any device | Any device | Upload on one, download on another |

The laptop running the server is always the storage point. Files land there. Every other device on the network can see and download whatever has been uploaded.

---

## How to run

Requires Node.js 18 or newer.

```bash
git clone https://github.com/YOUR_USERNAME/localdrop.git
cd localdrop
npm install
npm start
```

On Windows you can also just double-click `start.bat`. It installs dependencies automatically if they are missing.

When the server starts, the terminal prints two URLs:

```
Laptop:   http://localhost:3000
iPhone:   http://192.168.x.x:3000 

When you run ```npm start``` your terminal shows the real address
```

Open the laptop URL on your laptop. Open the iPhone URL in Safari on your phone (same Wi-Fi required).

---

## Where files go

Every uploaded file lands in the `uploads/` folder inside the project directory. That is it. The gallery on the website just reads that folder. You can open File Explorer and see files appear there in real time as they upload.

Filenames are renamed to a timestamp plus random number to avoid collisions. The original name is still shown in the UI.

---

## Tech stack

- Node.js with Express for the local server
- Multer for handling file uploads
- Plain HTML, CSS, and JavaScript for the frontend — no build step

Two dependencies total. The whole thing is about 200 lines of backend code.

---

## Notes

- Transfers are local only. Nothing goes to the internet.
- No resume on failed upload. If Wi-Fi drops mid-upload, the files that already reached the server are saved. The rest need to be re-uploaded.
- No authentication. Anyone on the same Wi-Fi can access the URL. Run it on a trusted network.
- The server needs to stay running on the laptop for transfers to work. Close the terminal and it stops.