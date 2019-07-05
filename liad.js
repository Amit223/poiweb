
const express = require("express");
const app = express();
var routerr = express.Router();
const bodyParser = require("body-parser");
const mysql = require('mysql');
var urlencodedParser = app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var DButilsAzure = require("./DButils");
secret = "AmitLiadRocks";
const jwt = require("jsonwebtoken");
const cors = require("cors");
var userLogged="Guest"
app.use(cors());
const port = process.env.PORT || 3000; //environment variable
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


var sql = require("mssql");

// config for your database
var config = {
    server: "liadamit.database.windows.net",
    // host: "liadamit.database.windows.net",
    user: "liadamit",
    password: "bmNf8mje",
    database: "Assignment3db",
    encrypt: true
};

// connect to your database
var con = sql.connect(config, function (err) {
    if (err) console.log(err);
});

// middleware
app.get("/getPointOfIntersetDetails/:obj", (req, res,next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var pointname = jsonObj.pointname;
    var sql = "SELECT * FROM Points WHERE Name=" + "'" + pointname + "'";
     DButilsAzure.execQuery(sql).then(function (value) {
            res.status(200).send(value);
            next();
    });
});

app.get("/getPointIndex/:obj", (req, res,next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;
    var pointname = jsonObj.pointname;
    var sql = "SELECT [Index] FROM User_Points WHERE UserName=" + "'" + username + "' AND PointName='"+pointname+"'";
     DButilsAzure.execQuery(sql).then(function (value) {
            res.status(200).send(value);
            next();
    });
});

app.post("/login/:obj", (req, res, next) => {

    var obj1 = req.params['obj'];
    var jsonObj = JSON.parse(obj1);
    var username = jsonObj.username;
    var password = jsonObj.password;


    var sql = "SELECT * FROM Users WHERE UserName='"+username+"' AND Password='"+password+"'";
    DButilsAzure.execQuery(sql).then(function (value2) {
        if (value2.length == 0) {
            res.status(200).send("X");
            next();
        }
        else {
            payload = { name: username, password: password, admin: false };
            options = { expiresIn: "1d" };
            const token = jwt.sign(payload, secret, options);
            res.status(200).send(token);
            next();
        }
    });
});

app.post("/private", (req, res) => {
    const token = req.header("x-auth-token");
    // no token
    if (!token){res.status(200).send("X");
    return;}
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        req.decoded = decoded;
        userLogged=req.decoded.name;
        if (req.decoded.admin)
            res.status(200).send("admin");
        else
            res.status(200).send(req.decoded.name);
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
});



app.post("/create/:obj", (req, res) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;
    var password = jsonObj.password;
    var firstname = jsonObj.first;
    var lastname = jsonObj.last;
    var email = jsonObj.email;
    var city = jsonObj.city;
    var country = jsonObj.counrty;
    var q1 = jsonObj.q1;
    var a1 = jsonObj.a1;
    var q2 = jsonObj.q2;
    var a2 = jsonObj.a2;




    var sql = "INSERT INTO Users (UserName, FirstName, LastName, City, Country, Email, Password, QuestionOne, AnswerOne ,QuestionTwo ,AnswerTwo) " +
        "VALUES ('" + username + "', '" + firstname + "', '" + lastname + "', '" + city + "', '" + country
        + "', '" + email + "', '" + password + "', '" + q1 + "', '" + a1 + "', '" + q2 + "', '" + a2 + "')";

    con.query(sql, function (err, result) {
        if (err) res.status(400).send("User Registered!");
        console.log("1 record inserted");
    });
    res.status(200).send("User Registered!");

});

app.post("/restorePassword/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;
    var question = jsonObj.question;
    var answer= jsonObj.answer;


    var sql = "SELECT Password FROM Users WHERE UserName='" + username +
        "' AND ( (QuestionOne='"+question+"'And AnswerOne='" +answer+"')OR ("+
        "QuestionTwo='"+question+"'And AnswerTwo='" +answer+"'))";
    DButilsAzure.execQuery(sql).then(function (value2) {
        if (value2.length != 1) {
            res.status(400).send("user with that certain answer doesn't exist!")
            next();
        }
        else {
            res.status(200).send(value2[0].Password)
            next();
        }
    });
});

app.get("/getQA/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;


    var sql = "SELECT QuestionOne, QuestionTwo FROM Users WHERE UserName='" + username + "'";
    DButilsAzure.execQuery(sql).then(function (value) {
        if (value.length == 0) {
            res.status(400).send("user with that certain username doesn't exist!")
            next();
        }
        else {
            var jsonobjToSend={q1: value[0].QuestionOne, q2:value[0].QuestionTwo};
            res.status(200).send(jsonobjToSend)
            next();
        }
    });
});



app.post("/saveToFavorites/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;
    var pointname = jsonObj.pointname;
    var index=jsonObj.index;

    var sql = "SELECT * FROM Users WHERE UserName='" + username + "'";
    DButilsAzure.execQuery(sql).then(function (value2) {
        if (value2.length != 1) {
            res.status(400).send("user doesn't exist")
            next();
        }

    });

    var sql2 = "SELECT * FROM Points WHERE Name='" + pointname + "'";
    DButilsAzure.execQuery(sql2).then(function (value2) {
        if (value2.length != 1) {
            res.status(400).send("point doesn't exist")
            next();
        }

    });

    var sql3 = "SELECT * FROM User_Points WHERE UserName='" + username + "' AND PointName='" + pointname + "'";
    DButilsAzure.execQuery(sql3).then(function (value2) {
        if (value2.length > 0) {
            res.status(400).send("user already have this point")
            next();
        }

    });
    var date = new Date();
    var dateInsert=date.toUTCString().substr(date.toUTCString().indexOf(",") + 2);
    console.log(dateInsert);

    var sql4 = "INSERT INTO User_Points (UserName, PointName,[Index],Date) " + "VALUES ('" + username + "', '" + pointname + "',"+ index+",'"+dateInsert+"')";
    DButilsAzure.execQuery(sql4).then(function (value2) {
        res.status(200).send("Success!");

    });
});


app.post("/addCategoryToUser/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;
    var category = jsonObj.category;
    var sql = "INSERT INTO UserCategory (UserName, CategoryName) " + "VALUES ('" + username + "', '" + category + "')";
    DButilsAzure.execQuery(sql).then(function (value2) {
        res.status(200).send("Success!");
        next();
    });
});


app.get("/getCategoryFromUser/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;
    var sql = "SELECT CategoryName FROM UserCategory WHERE UserName='"+ username + "'";
    DButilsAzure.execQuery(sql).then(function (value2) {
        res.status(200).send(value2);
        next();
    });
});


app.get("/getPOIByCategory/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var categoryname = jsonObj.categoryname;
    var sql = "SELECT * FROM Points WHERE Category='"+ categoryname + "'";
    DButilsAzure.execQuery(sql).then(function (value2) {
        res.status(200).send(value2);
        next();
    });
});

app.post("/updateIndex/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;
    var pointname = jsonObj.pointname;
    var newIndex=jsonObj.index;
    var sql = "UPDATE User_Points SET [Index]='" + newIndex +"' WHERE  UserName='" +username+"' AND PointName='"+ pointname + "'";
    DButilsAzure.execQuery(sql).then(function (value2) {
        res.status(200).send("Success!");
        next();
    });
});

app.post("/deleteFromFavorites/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;
    var pointname = jsonObj.pointname;

    var sql = "SELECT * FROM Users WHERE UserName='" + username + "'";
    DButilsAzure.execQuery(sql).then(function (value2) {
        if (value2.length != 1) {
            res.status(400).send("user doesn't exist")
            next();
        }

    });

    var sql2 = "SELECT * FROM Points WHERE Name='" + pointname + "'";
    DButilsAzure.execQuery(sql2).then(function (value2) {
        if (value2.length != 1) {
            res.status(400).send("point doesn't exist")
            next();
        }

    });

    var sql3 = "SELECT * FROM User_Points WHERE UserName='" + username + "' AND PointName='" + pointname + "'";
    DButilsAzure.execQuery(sql3).then(function (value2) {
        if (value2.length == 0) {
            res.status(400).send("user doesn't have this point")
            next();
        }

    });

    var sql4 = "Delete FROM User_Points  WHERE UserName='" + username + "' AND PointName='" + pointname + "'";
    DButilsAzure.execQuery(sql4).then(function (value2) {
        res.status(200).send("Success!");

    });
});


app.get("/getFavoritePointsAll/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;

    var sql = "SELECT PointName FROM User_Points WHERE UserName=" + "'" + username + "'";
    DButilsAzure.execQuery(sql).then(function (value) {
        if (value.length == 0) {
            var points=new Array();
            res.status(200).send(points)
            next();
        }
        else {
            var sql2 = "SELECT * FROM Points WHERE Name='" + value[0].PointName + "'";
            for (var i = 1; i < value.length; i++) {//push all point to array
                sql2 = sql2 + " OR  Name='" + value[i].PointName + "'";
            }
            DButilsAzure.execQuery(sql2).then(function (value2) {
                var points = new Array();
                for (var i = 0; i < value2.length; i++) {//push all point to array
                    points.push(value2[i]);
                }
                res.status(200).send(points);
                next();
            });


        }
    });
});

app.get("/getFavoritePoints/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;

    var sql = "SELECT * FROM User_Points WHERE UserName=" + "'" + username + "'";
    DButilsAzure.execQuery(sql).then(function (value) {
        if (value.length == 0) {
            var points=new Array();
            res.status(200).send(points)
            next();
        }
        else {
                res.status(200).send(value);
                next();


        }
    });
});


app.get("/getPoints", (req, res, next) => {
    var sql = "SELECT * FROM Points";
    DButilsAzure.execQuery(sql).then(function (value) {
        if (value.length == 0) {
            res.status(400).send("points don't exist")
            next();
        }
        else{
            res.status(200).send(value);
        }

    });

});


app.get("/isSaved/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;
    var pointname=jsonObj.pointname;

    var sql = "SELECT * FROM User_Points WHERE UserName=" + "'" + username + "' AND PointName='"+ pointname+"'";
    DButilsAzure.execQuery(sql).then(function (value) {
        if (value.length == 0) {
            res.status(200).send(false)
            next();
        }
        else {
            res.status(200).send(true)
            next();
        }
    });
});


app.post("/criticizePoint/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var pointname = jsonObj.pointname;
    var ciritisizm = jsonObj.ciritisizm;
    var date = jsonObj.date;


    var sql = "SELECT * FROM Points WHERE Name='" + pointname + "'";
    DButilsAzure.execQuery(sql).then(function (value2) {
        if (value2.length != 1) {
            res.status(400).send("point doesn't exist")
            next();
        }

    });

    var sql2 = "INSERT INTO Point_Criticism (Name, Criticism, Date) " + "VALUES ('" + pointname + "', '" + ciritisizm + "', '"+date+"')";
    DButilsAzure.execQuery(sql2).then(function (value2) {
        res.status(200).send("Success!");

    });
});

app.post("/addviews/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var pointname = jsonObj.pointname;


    var sql = "SELECT * FROM Points WHERE Name='" + pointname + "'";
    DButilsAzure.execQuery(sql).then(function (value2) {
        var newwatchedby=value2[0].WatchedBy+1;
        var sql2 = "UPDATE Points SET WatchedBy='" +newwatchedby  +"' WHERE  Name='" + pointname + "'";
        DButilsAzure.execQuery(sql2).then(function(value3){
            res.status(200).send("done");
            next();
        })

    });
});

app.get("/getCritizes/:obj",(req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var pointname = jsonObj.pointname;



    var sql = "SELECT * FROM Point_Criticism WHERE Name='" + pointname + "'";
    DButilsAzure.execQuery(sql).then(function (value) {
            res.status(200).send(value);
            next();

    });

});

app.post("/rankPoint/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var pointname = jsonObj.pointname;
    var rank = jsonObj.rank;


    var sql = "SELECT Rank,RankedBy FROM Points WHERE Name='" + pointname + "'";
    DButilsAzure.execQuery(sql).then(function (value2) {
        if (value2.length != 1) {
            res.status(400).send("point doesn't exist")
            next();
        }
        else {
            var Calcrank = 0;
            var t = value2[0].RankedBy;
            var rankedbyTot = value2[0].RankedBy + 1;
            var oldRank = value2[0].Rank;
            if (rankedbyTot == 1)//no one ranked yet
                Calcrank = rank;
            else {
                Calcrank = oldRank * t;
                Calcrank = parseInt(Calcrank, 10) + parseInt(rank, 10);
                Calcrank = Calcrank / rankedbyTot;

            }
            var sql2 = "UPDATE Points SET RankedBy='" + rankedbyTot + "' , Rank='" + Calcrank + "' WHERE  Name='" + pointname + "'";
            DButilsAzure.execQuery(sql2).then(function (value2) {
                res.status(200).send("rank updated!");
                next();
            });
        }

    });


});




app.get("/explore", (req, res, next) => {
    var sql = "SELECT * FROM Points WHERE Rank='5'";
    DButilsAzure.execQuery(sql).then(function (value) {
        if (value.length == 0) {
            res.status(400).send("No popular points.");
        }
        else {
            var points=[];
            var rnd = parseInt(Math.random() * (value.length - 1));
            points.push(value[rnd]);
            value[rnd] = value[value.length - 1];
            if ((value.length - 2) >= 0) {
                var rnd2 = parseInt(Math.random() * (value.length - 2));
                points.push(value[rnd2])
                value[rnd2] = value[value.length - 2];
                if (value.length - 3 >= 0) {
                    var rnd3 = parseInt(Math.random() * (value.length - 3));
                    points.push(value[rnd3]);
                }
            }
            res.status(200).send(points);

        }
    });
});



app.get("/getPointOfInterests", (req, res, next) => {

    var sql3 = "SELECT Name FROM Points"
    console.log(sql3);
    DButilsAzure.execQuery(sql3).then(function (value3) {
        var points = new Array();
        for (var i = 0; i < value3.length; i++) {//push all point to array
            points.push(value3[i]);
        }
        res.status(200).send(points);
        next();


    });

});
app.get("/getPointOfInterestsCategories", (req, res, next) => {

    var sql3 = "SELECT Name FROM Catagories"
    console.log(sql3);
    DButilsAzure.execQuery(sql3).then(function (value3) {
        var points = new Array();
        for (var i = 0; i < value3.length; i++) {//push all categories to array
            points.push(value3[i]);
        }
        res.status(200).send(points);
        next();


    });
});

