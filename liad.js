
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
app.get("/getPointOfIntersetDetails/:point", (req, res) => {
    var name = req.params['point'];
    console.log("Got GET Request");
    var sql = "SELECT * FROM Points WHERE Name=" + "'" + name + "'";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        if (result.recordset.length == 0)
            res.status(200).send("Point doesn't exist, Please try again!");
        else
            res.status(200).send([result.recordset[0].Name,
            result.recordset[0].Description,
            result.recordset[0].WatchedBy,
            result.recordset[0].Rank,
            result.recordset[0].Review1,
            result.recordset[0].Review2]);
    });
});


app.post("/login/:obj", (req, res, next) => {

    var obj1 = req.params['obj'];
    var jsonObj = JSON.parse(obj1);
    var username = jsonObj.username;
    var password = jsonObj.password;

    payload = { name: username, password: password, admin: false };
    options = { expiresIn: "1d" };
    const token = jwt.sign(payload, secret, options);
    res.send(token);
    /**
    var sql = "SELECT * FROM Users WHERE UserName='"+username+"' AND Password='"+password+"'";
    var str="";
    var problem = false;
    con.query(sql, function (err, result) {
        if (err) throw err;
        if(result.recordsets.length!=1)
            problem=true;
    });
    if(problem)
    res.status(400).send("Please try again.");
    else
    res.status(200).send("Login successful, Welcome "+username+"!");*/
    next();
});

app.post("/private", (req, res) => {
    const token = req.header("x-auth-token");
    // no token
    if (!token) res.status(401).send("Access denied. No token provided.");
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        req.decoded = decoded;
        if (req.decoded.admin)
            res.status(200).send({ result: "Hello admin." });
        else
            res.status(200).send({ result: "Hello" + req.decoded.username });
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


    var sql = "INSERT INTO Users (UserName, FirstName, LastName, City, Country, Email, Password, QuestionAutentication, AnswerAutentication) " +
        "VALUES ('" + username + "', '" + firstname + "', '" + lastname + "', '" + city + "', '" + country
        + "', '" + email + "', '" + password + "')";

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
    var answer = jsonObj.answer;


    var sql = "SELECT Password FROM Users WHERE UserName='" + username +
        "' AND AnswerAutentication='" + answer + "'";
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


app.post("/saveToFavorites/:obj", (req, res, next) => {
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
        if (value2.length > 0) {
            res.status(400).send("user already have this point")
            next();
        }

    });

    var sql4 = "INSERT INTO User_Points (UserName, PointName) " + "VALUES ('" + username + "', '" + pointname + "')";
    DButilsAzure.execQuery(sql4).then(function (value2) {
        res.status(200).send("Success!");

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


app.get("/getFavoritePoints/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;

    var sql = "SELECT PointName FROM User_Points WHERE UserName=" + "'" + username + "'";
    DButilsAzure.execQuery(sql).then(function (value) {
        if (value.length == 0) {
            res.status(400).send("user doesn't exist or doesn't have points")
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

//todo:don't know if need to do this?
app.get("/getRecentSavedPoints/:obj", (req, res, next) => {
    var points = new Array();
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var username = jsonObj.username;


});


app.get("/getPointsInfo/:obj", (req, res, next) => {
    var points = new Array();
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var pointname = jsonObj.pointname;

    var sql = "SELECT Description FROM Points WHERE Name=" + "'" + pointname + "'";
    DButilsAzure.execQuery(sql).then(function (value) {
        if (value.length == 0) {
            res.status(400).send("point doesn't exist");
        }
        else {
            res.status(200).send(value[0].Description);
        }
    });

});


app.post("/criticizePoint/:obj", (req, res, next) => {
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var pointname = jsonObj.pointname;
    var ciritisizm = jsonObj.ciritisizm;


    var sql = "SELECT * FROM Points WHERE Name='" + pointname + "'";
    DButilsAzure.execQuery(sql).then(function (value2) {
        if (value2.length != 1) {
            res.status(400).send("point doesn't exist")
            next();
        }

    });

    var sql2 = "INSERT INTO Point_Criticism (Name, Criticism) " + "VALUES ('" + pointname + "', '" + ciritisizm + "')";
    DButilsAzure.execQuery(sql2).then(function (value2) {
        res.status(200).send("Success!");

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


app.get("/getPointOfInterestsByCategory/:obj", (req, res, next) => {
    var points = new Array();
    var obj = req.params['obj'];
    var jsonObj = JSON.parse(obj);
    var catagory = jsonObj.category;

    var sql = "SELECT CatagoryID FROM Catagories WHERE Name=" + "'" + catagory + "'";//get catagory id from name
    DButilsAzure.execQuery(sql).then(function (value) {
        if (value.length != 1) {
            res.status(400).send("catagory doesn't exist");
        }
        else {
            var catID = value[0].CatagoryID;
            var sql2 = "SELECT PointName FROM PointCategory WHERE CategoryID=" + "'" + catID + "'";//get all point names with catagory id
            console.log(sql2);
            DButilsAzure.execQuery(sql2).then(function (value2) {
                if (value2.length > 0) {
                    var sql3 = "SELECT * FROM Points WHERE Name='" + value2[0].PointName + "'";//for all point name get the points and add to array:
                    for (var i = 1; i < value2.length; i++) {
                        sql3 = sql3 + " OR  Name='" + value2[i].PointName + "'";
                    }
                    console.log(sql3);
                    DButilsAzure.execQuery(sql3).then(function (value3) {
                        var points = new Array();
                        for (var i = 0; i < value3.length; i++) {//push all point to array
                            points.push(value3[i]);
                        }
                        res.status(200).send(points);
                        next();
                    });
                }
                else {//no points in the category
                    res.status(400).send("catagory doesn't have points of interest");

                }
            });
        }
    });

});

app.get("/explore/", (req, res, next) => {
    var sql = "SELECT Name FROM Points WHERE Rank='5'";
    DButilsAzure.execQuery(sql).then(function (value) {
        if (value.length == 0) {
            res.status(400).send("No popular points.");
        }
        else {
            var rnd = parseInt(Math.random() * (value.length - 1));
            var s = value[rnd].Name;
            value[rnd] = value[value.length - 1];
            if ((value.length - 2) >= 0) {
                var rnd2 = parseInt(Math.random() * (value.length - 2));
                s += "\n" + value[rnd2].Name;
                value[rnd2] = value[value.length - 2];
                if (value.length - 3 >= 0) {
                    var rnd3 = parseInt(Math.random() * (value.length - 3));
                    s += "\n" + value[rnd3].Name;
                }
            }
            res.status(200).send("Popular Places:\n" + s);

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