// définitions de plusieurs constantes à la fois
const dotenv = require('dotenv').config(),
    fs = require('fs'),
    dayjs = require('dayjs'),
    http = require('http'),
    host = process.env.APP_LOCALHOST,
    port = process.env.APP_PORT,
     students = [{
            name: "Sonia",
            birth: "2019-14-05"
        },
        {
            name: "Antoine",
            birth: "2000-12-05"
        },
        {
            name: "Alice",
            birth: "1990-14-09"
        },
        {
            name: "Sophie",
            birth: "2001-10-02"
        },
        {
            name: "Bernard",
            birth: "1980-21-08"
        }
    ]; 

http.createServer(function (req, res) {

    const url = req.url.replace('/', '');

    if (url === "") {
        const home = fs.readFileSync('./view/home.html');
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(home);
    }

    if (url === "students") {

         res.writeHead(200, {
            "Content-Type": "text/html"
        });
        let users = "<ul>";
        for (const {
                name,
                birth
            } of students) {
            users += `<li>${name} <br> ${dayjs(birth).format("DD/MM/YYYY")}</li> <button type="remove" class="delete-btn">Supprimer</button>
            `;
        }
        users += "</ul>";

        res.end(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Ajouter un utilisateur</title>
                </head>
                <body>
                  ${users}
                  <p><a href="http://${host}:${port}">Home</a></p>
                </body>
            </html>
          `); 
    }

    if (url === "list") {

        const json = JSON.parse(fs.readFileSync('./data/students.json', "utf-8"));
         let users = "<ul>";
        for (const {
                name,
                birth
            } of json.students) {
            users += `<li>${name} <br> ${dayjs(birth).format("DD/MM/YYYY")}</li> <button type="remove" class="delete-btn">Supprimer</button>
            `.replace("\n", " ");
        }
        users += "</ul>"; 
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Ajouter un utilisateur</title>
            </head>
            <body>
              ${JSON.stringify(users)}
              <p><a href="http://${host}:${port}">Home</a></p>
            </body>
        </html>
      `);
    
        return;
    }


    if (req.method === "POST") {

        const body = [];
        req.on("data", (chunk) => {
            //console.log(`Data chunk available: ${chunk}`);
            body.push(chunk);
            //console.log(body)
        });

        // On écoute maintenant la fin de l'envoi des données avec la méthode on et l'attribut end
        req.on("end", () => {
            const arr = Buffer.concat(body).toString().split("&");
            const name = arr[0].split("=")[1];
            const birth = arr[1];
            //console.log(birth)
            //console.log(name)

            if (name && birth) students.push({
                name,
                birth
            });
            // redirection le code 301 indique une redirection permamente
            res.writeHead(301, {
                Location: `http://${host}:${port}`
            });
            res.end();
        });
    }

}).listen(port);
console.log(`Server is running on http://${host}:${port}`);