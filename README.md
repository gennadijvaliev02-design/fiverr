# Instagram Booking Website

A static, mobile-first Fiverr portfolio website by Valiev Company. It demonstrates how a local business can turn Instagram visitors into booking requests.

## Files

- `index.html` — page structure and content
- `styles.css` — responsive styling and animation
- `script.js` — navigation, calendar, booking flow and demo confirmation

No build tool, package manager, API or database is required.

## Open locally

Double-click `index.html`, or right-click it and choose a browser. The complete demo works from the local file.

For an optional local server, open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a new empty GitHub repository.
2. Upload the four files from this folder to the repository root.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then click **Save**.
6. GitHub will show the public website address after deployment finishes.

## Before using it publicly

- Replace `hello@example.com` in `index.html` with the final email or Fiverr contact link.
- Replace the Instagram and Fiverr placeholder links in the footer.
- Connect the form only when a webhook is ready. The intended integration point is clearly marked with `FUTURE WEBHOOK` comments in `index.html` and `script.js`.

The current form is intentionally a demonstration: it does not transmit or store personal information.
