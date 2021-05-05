const express = require('express')
const app = express()
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require("request");

const PORT = process.env.PORT || 5000;


 // create call API function
function call_api(finishedAPI){
    request('https://cloud.iexapis.com/stable/stock/TSLA/quote?token=pk_403d2f3af3314f18b2fcbfb21198b874', function (err, res, body) {
        if (err) {return console.log(err);}
        if(res.statusCode === 200){
      //console.log(body);
        finishedAPI(JSON.parse(body));
        }
    });
}

//Set handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Set handlebar index GET route
app.get('/', function (req, res) {
    call_api(function(doneAPI){
        res.render('home', {
            stock: doneAPI
        });
    });  
});

//Set handlebar index POST route
app.post('/', function (req, res) {
    call_api(function(doneAPI){
        res.render('home', {
            stock: doneAPI
        });
    });  
});

//Create about page route
app.get('/about.html', function (req, res) {
    res.render('about');
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, () => console.log('Server listening on port' + PORT));