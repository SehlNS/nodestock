const express = require('express')
const app = express()
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require("request");
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;


app.engine('handlebars', exphbs({
    //Include helpers here
    helpers:{

        commas: function(value){
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        //check if price change was negative or poositive
        peRatio: function(value, options){
            var val = (value).toFixed(2);
            
            if(value < 20 && value >= 1) {
                return "<div class=\"positive\">" + options.fn({test: val}) + "</div>";
              }
              
              else{
                return "<div class=\"negative\">" + options.fn({test: val}) + "</div>";
              }

        },

        //check if price change was negative or poositive
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
        },

        roundPercent: function(value, options){

            value =  (value * 100).toFixed(2);
            if(value > 0) {
                return "<span class=\"positive\">" + "+" + options.fn({test: value}) + "%</span";
              }
              else if(value < 0){
                return "<span class=\"negative\">" + options.fn({test: value}) + "%</span>";
              }

              else{
                return "<span>" + options.fn({test: value}) + "%</span>"; 
              }
        
        },
        cryptoRound: function(value){
            if(value >= 1){
                return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");; 
            }
            else{
                return parseFloat(value).toFixed(4);
            }
      
    
    },
        basicRound: function(value, options){

           return (value).toFixed(2)
        
        },

        basicPercent: function(value, options){

            return (value * 100).toFixed(2);
         
         }
    },
defaultLayout: 'main'
}));
app.set('view engine', 'handlebars')




// use body parser middleware -- using express instead for now
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

 
 // create call API function
function call_api(finishedAPI, ticker){
    request('https://cloud.iexapis.com/v1/stock/' + ticker + '/batch?types=quote,news,stats,company&token=pk_403d2f3af3314f18b2fcbfb21198b874', function (err, res, body) {
        if (err) {return console.log(err);}
        if(res.statusCode === 200){
      //console.log(body);
        finishedAPI(JSON.parse(body));
        }
    });
}

function call_api2(finishedAPI){
    request('https://cloud.iexapis.com/v1/stock/market/collection/list?collectionName=mostactive&token=pk_403d2f3af3314f18b2fcbfb21198b874', function (err, res, body) {
        if (err) {return console.log(err);}
        if(res.statusCode === 200){
      //console.log(body);
        finishedAPI(JSON.parse(body));
        }
    });

}

function call_apiGainers(finishedAPI){
    request('https://cloud.iexapis.com/v1/stock/market/collection/list?collectionName=gainers&token=pk_403d2f3af3314f18b2fcbfb21198b874', function (err, res, body) {
        if (err) {return console.log(err);}
        if(res.statusCode === 200){
      //console.log(body);
        finishedAPI(JSON.parse(body));
        }
    });
}

function call_apiLosers(finishedAPI){
    request('https://cloud.iexapis.com/v1/stock/market/collection/list?collectionName=losers&token=pk_403d2f3af3314f18b2fcbfb21198b874', function (err, res, body) {
        if (err) {return console.log(err);}
        if(res.statusCode === 200){
      //console.log(body);
        finishedAPI(JSON.parse(body));
        }
    });
}

function call_apiCrypto(finishedAPI){
    request('https://api.nomics.com/v1/currencies/ticker?key=177c96b8a906ce4a9d914e53daddd62aff69b4a5&ids=BTC,ETH,XRP,BNB,ADA,DOGE,USDT,DOT,ICP,BCH,UNI,LTC,LINK,XLM,USDC,SOL,ETC,VET,MATIC,EOS,THETA,TRX,WBTC,FIL,BUSD,XMR,SHIB&interval=1h,1d,7d', function (err, res, body) {
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

//Create Hub page route
app.get('/crypto.html', function (req, res) {
    call_apiCrypto(function(doneAPI){
        res.render('crypto', {
            crypto: doneAPI
        });
    }); 
});

//Create Hub page route
app.get('/hub.html', function (req, res) {
    call_api2(function(doneAPI){
        res.render('hub', {
            stock: doneAPI
        });
    }); 
});


//Create Hub page route
app.post('/gainers', function (req, res) {
    call_apiGainers(function(doneAPI){
        res.render('hub', {
            stock: doneAPI
        });
    }); 
});

app.post('/losers', function (req, res) {
    call_apiLosers(function(doneAPI){
        res.render('hub', {
            stock: doneAPI
        });
    }); 
});

app.post('/most-active', function (req, res) {
    call_api2(function(doneAPI){
        res.render('hub', {
            stock: doneAPI
        });
    }); 
});

//Create home page route
app.get('/graph.html', function (req, res) {
    res.render('graph');
});

//Create home page route
app.get('/', function (req, res) {
    res.render('home/home', {layout : 'home-template'});
});

// Set static folder
app.use(express.static(path.join(__dirname, '/')));


app.listen(PORT, () => console.log('Server listening on port' + PORT));


