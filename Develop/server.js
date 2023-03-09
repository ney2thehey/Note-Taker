const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
//uuidv4();


//port 
const PORT = process.env.PORT || 3001;
//need to import middleware express
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// GET Route for html pages

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  var options = { encoding: 'utf8', flag: 'r' };
  res.json(JSON.parse(fs.readFileSync('./db/db.json', options)));
});


//Post route to save the notes entered
app.post('/api/notes', (req, res) => {
  console.log(req.body);
  const { title, text } = req.body;
  if (req.body) {
      const newNote = {
          id: uuidv4(),
          title,
          text,
      };
fs.readFile('./db/db.json', 'utf8', (err, data) => {
          if (err) {
              //console.error(err);
              req.status(500).json(err)
          } else {
              const parsedData = JSON.parse(data);
              parsedData.push(newNote);
              //console.log(parsedData);
              const noteString = JSON.stringify(parsedData);   //render to file
              fs.writeFile(`./db/db.json`, noteString, (err) => {
                  if (err) {
                      console.error(err);
                      req.status(500).json(err);
                  } else {
                      res.send(
                          `Note has been entered`,
                      )
                  }
              }
              );
          }
      });
  }
});
  

//delete route
app.delete('/api/notes/:id', (req, res) => {
fs.readFile('db/db.json', (err, data) => {
    if (err) throw err;
      
    let tempData = JSON.parse(data);
    let filteredData = tempData.filter(item => item.id !== req.params.id)
  
  //writefile
      fs.writeFile('db/db.json', JSON.stringify(filteredData), err=> {
        if (err) throw err;
        res.redirect('/notes')

    })
    })
  });
  
  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });