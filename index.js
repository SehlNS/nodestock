const express = require('express')
const app = express()
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require("request");
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;


const hbs = exphbs.create({

    //create custom helpers here
    defaultLayout: 'main',
    helpers:{
        negPosChange: function(value, options){
            if(value > 0) {
                return "<div class=\"positive\">+" + options.fn({test: value}) + "</div>";
              }
              else if(value < 0){
                return "<div class=\"negative\">" + options.fn({test: value}) + "</div>";
              }

              else{
                return "<div>" + options.fn({test: value}) + "</div>";
              }
        }
    }

});

//Set handlebars middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');



// use body parser middleware -- using express instead for now
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

 
 // create call API function
function call_api(finishedAPI, ticker){
    request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_403d2f3af3314f18b2fcbfb21198b874', function (err, res, body) {
        if (err) {return console.log(err);}
        if(res.statusCode === 200){
      //console.log(body);
        finishedAPI(JSON.parse(body));
        }
    });
}




//Set handlebar index GET route
app.get('/ticker_page.html', function (req, res) {
    call_api(function(doneAPI){
        res.render('ticker_page', {
            stock: doneAPI
        });
    }, 'fb');  
});

//Set handlebar index POST route
app.post('/', function (req, res) {
    call_api(function(doneAPI){
        //posted_stuff = req.body.stock_search;
        res.render('ticker_page', {
            stock: doneAPI,
        });
    }, req.body.stock_search.toLowerCase().trim());  
});

//Create about page route
app.get('/about.html', function (req, res) {
    res.render('about');
});

//Create about page route
app.get('/', function (req, res) {
    res.render('home/home', {layout : 'home-template'});
});


// Set static folder
app.use(express.static(path.join(__dirname, '/')));


app.listen(PORT, () => console.log('Server listening on port' + PORT));


