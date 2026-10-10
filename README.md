# eduQuiz

Internal-use web app for the Educational department of **LigaAC**.

## Running locally

Requires Node.js 18+.

```bash
npm install
ADMIN_PASS=choose-a-password npm start
```

Then open http://localhost:5174/main.html (quiz) or http://localhost:5174/admin.html (editor).

### Configuration (environment variables)

| Variable      | Default                  | Purpose                                         |
|---------------|--------------------------|-------------------------------------------------|
| `PORT`        | `5174`                   | HTTP port                                       |
| `ADMIN_USER`  | `edu`                    | Admin username                                  |
| `ADMIN_PASS`  | random, printed at start | Admin password. **Set this in production.**     |
| `CONFIG_PATH` | `./config.json`          | Where the quiz content is stored                |

If `ADMIN_PASS` is not set, the server generates a one-off password on each start and prints it to the console.

On Windows PowerShell:

```powershell
$env:ADMIN_PASS = "choose-a-password"; npm start
```

## Hosting

- **Node server** (recommended): questions edited in the admin page are saved to `config.json` and shown to everyone.
- **GitHub Pages**: the quiz works with the questions built into `quiz-config.js`. The admin page there has no server, so edits only apply in the editor's own browser.

## Project layout

- `main.html`, `script.js`: the quiz
- `admin.html`, `admin.js`: the editor (password-protected on the Node server)
- `quiz-config.js`: default questions/teams and config validation, shared by the browser and the server
- `server.js`: Express server and `/api/config`
- `test/`: run with `npm test`

## Credits

The original project was created by **Robert-Gabriel Gaube**. Subsequent modifications were made by me with assistance from **Cursor** and **Claude Code**, based on my instructions.

The original source can be found at:
`https://github.com/robert-gabriel-gaube/eduQuiz`
