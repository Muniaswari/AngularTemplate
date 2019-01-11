'use strict';

var qs = require('querystring');
var jwt = require('jwt-simple');
var request = require('request');

var verifyToken = require('./../config/verifyToken');
var User = require('./../models/user');
var config = require('./../config/auth-config');
var databse = require('./../config/database');

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
exports.profile = function (req, res) {
    User.findById(req.user, function (err, user) {
        res.send(user);
    });
};

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
exports.me = function (req, res) {
    User.findById(req.user, function (err, user) {
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }
        user.displayName = req.body.displayName || user.displayName;
        user.email = req.body.email || user.email;
        user.save(function (err) {
            res.status(200).end();
        });
    });
};

/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */

exports.login = async function (req, res) {
    var db = databse.getDatabaseConnection(config.DefaultDatabse);
    if (req.body.CompanyName !== undefined && req.body.CompanyName !== null
        && req.body.CompanyName !== "") {
        console.log("came com");
        db = databse.getDatabaseConnection(req.body.CompanyName);
    }
    else {
        db = databse.getDatabaseConnection(config.DefaultDatabse);
    }
    // if (user.CompanyName !== undefined || user.CompanyName !== null || user.CompanyName !== "") {
    //     db = databse.getDatabaseConnection(user.CompanyName);
    // } console.log("login 1", user);

    console.log("login in");
    await db.model("User").findOne({ email: req.body.email }, '+password',
        function (err, user) {
            if (!user) {
                return res.status(401).send({ success: false, message: 'Invalid email and/or password' });
            } console.log("login 3", user);
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (!isMatch) {
                    return res.status(401).send({ success: false, message: 'Invalid email and/or password' });
                }
                console.log("login 2", user);

                res.send({ user: user, success: true, message: 'Success!', token: verifyToken.createJWT(user) });
            });
        });
};

exports.adminlogin = async function (req, res) {
    var db = databse.getDatabaseConnection(config.DefaultDatabse);
    await db.model("User").findOne({ email: req.body.email }, '+password', function (err, user) {
        if (!user) {
            return res.status(401).send({ success: false, message: 'Invalid email and/or password' });
        }
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({ success: false, message: 'Invalid email and/or password' });
            }
            res.send({ success: true, message: 'Success!', token: verifyToken.createAdminJWT(user) });

        });
    });
};

/* ============================================================
   Route to check if user's email is available for registration
============================================================ */
exports.checkEmailAdmin = async function (req, res) {
//    console.log('s 1', dbase);
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("User", User.userSchema);
    // Check if email was provided in paramaters
    if (!req.params.email) {
        res.json({ success: false, message: 'E-mail was not provided' }); // Return error
    } else {
        console.log('s 2');
        // Search for user's e-mail in database;
        var user = await table.findOne({ email: req.params.email })
            .exec()
            .then((info) => {
                return info;
            })
            .catch((err) => {
                res.json({ success: false, message: err }); // Return connection error
            });


        console.log('s 3');
        if (user) {
            res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
        } else {
            res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
        }
        console.log('s 5');
    }
};

async function checkMailAvail(req, dbase) {
    console.log('s 1', dbase);
    var connection = databse.getDatabaseConnection(dbase);
    var table = connection.model("User", User.userSchema);
    // Check if email was provided in paramaters
    if (!req.params.email) {
        res.json({ success: false, message: 'E-mail was not provided' }); // Return error
    } else {
        console.log('s 2');
        // Search for user's e-mail in database;
        var user = await table.findOne({ email: req.params.email })
            .exec()
            .then((info) => {
                return info;
            })
            .catch((err) => {
                res.json({ success: false, message: err }); // Return connection error
            });


        console.log('s 3');
        if (user) {
            res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
        } else {
            res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
        }
        console.log('s 5');
    }
}
/* ============================================================
   Route to check if user's email is available for registration
============================================================ */
exports.checkEmail = async function (req, res) {
    checkMailAvail(req, res, config.DefaultDatabse);
};
/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
exports.adminsignup = async function (req, res) {
    console.log('s 6');
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    console.log('s 7');
    // Check if email was provided
    if (!req.body.email) {
        res.json({ success: false, message: 'You must provide an e-mail' }); // Return error
    } else {
        // Check if password was provided
        if (!req.body.password) {
            res.json({ success: false, message: 'You must provide a password' }); // Return error
        } else {
            console.log('s 8');
            var table = connection.model("User", User.userSchema);
            // Create new user object and apply user input

            let user = new table({
                IsAdmin: req.body.IsAdmin,
                email: req.body.email.toLowerCase(),
                password: req.body.password
            }); console.log('s 9');
            // Save user to database
            await user.save((err) => {
                // Check if error occured
                if (err) {
                    // Check if error is an error indicating duplicate account
                    if (err.code === 11000) {
                        res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
                    } else {
                        // Check if error is a validation rror
                        if (err.errors) {
                            // Check if validation error is in the email field
                            if (err.errors.email) {
                                res.json({ success: false, message: err.errors.email.message }); // Return error
                            } else {
                                // Check if validation error is in the password field
                                if (err.errors.password) {
                                    res.json({ success: false, message: err.errors.password.message }); // Return error
                                } else {
                                    res.json({ success: false, message: err }); // Return any other error not already covered
                                }

                            }
                        } else {
                            console.log(err);
                            res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
                        }
                    }
                } else {
                    res.json({ success: true, message: 'Acount registered!' }); // Return success
                }
            });
        }
    }
};

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
exports.signup = async function (req, res) {
    var db = databse.getDatabaseConnection(config.DefaultDatabse);
    console.log("state", db.readyState);
    var mod = db.model("User");
    if (!req.body.email) {
        res.json({ success: false, message: 'You must provide an e-mail' }); // Return error
    } else {
        if (!req.body.password) {
            res.json({ success: false, message: 'You must provide a password' }); // Return error
        } else {
            let user = new mod({
                IsAdmin: req.body.IsAdmin,
                email: req.body.email.toLowerCase(),
                password: req.body.password,
                picture: '',
                provider: 'local',
                provider_id: '',
                CreatedBy: req.body.CreatedBy
            });
            var country = req.body.Country;
            var contact = req.body.ContactNo;
            var company = req.body.CompanyName;
            if (company !== undefined && company !== null && company !== "") {
                user.CompanyName = company;
            }
            if (contact !== undefined && contact !== null && contact !== "") {
                user.ContactNo = contact;
            }
            if (country !== undefined && country !== null && country !== "") {
                user.Country = country;
            }
            await user.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                        res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
                    } else {
                        if (err.errors) {
                            if (err.errors.email) {
                                res.json({ success: false, message: err.errors.email.message }); // Return error
                            } else {
                                if (err.errors.password) {
                                    res.json({ success: false, message: err.errors.password.message }); // Return error
                                } else {
                                    res.json({ success: false, message: err }); // Return any other error not already covered
                                }

                            }
                        } else {
                            console.log(err);
                            res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
                        }
                    }
                } else {
                    res.json({ success: true, message: 'Acount registered!' }); // Return success
                }
            });
        }
    }
};

/*
 |--------------------------------------------------------------------------
 | Login with Google
 |--------------------------------------------------------------------------
 */
exports.google = function (req, res) {
    var accessTokenUrl = 'https://www.googleapis.com/oauth2/v4/token';
    var peopleApiUrl = 'https://www.googleapis.com/oauth2/v2/userinfo?fields=email%2Cfamily_name%2Cgender%2Cgiven_name%2Chd%2Cid%2Clink%2Clocale%2Cname%2Cpicture%2Cverified_email';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.GOOGLE_SECRET,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };
    var token_request = 'code=' + req.body.code +
        '&client_id=' + req.body.clientId +
        '&client_secret=' + config.GOOGLE_SECRET +
        '&redirect_uri=' + req.body.redirectUri +
        '&grant_type=authorization_code';
    var request_length = token_request.length;
    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, { body: token_request,
         headers: { 'Content-type': 'application/x-www-form-urlencoded' } },
          function (err, response, token) {
        var accessToken = JSON.parse(token).access_token;
        var headers = { Authorization: 'Bearer ' + accessToken };

        // Step 2. Retrieve profile information about the current user.
        request.get({ url: peopleApiUrl, headers: headers, json: true }, function (err, response, profile) {
            if (profile.error) {
                return res.status(500).send({ message: profile.error.message });
            }

            User.findOne({ email: profile.email }, function (err, existingUser) {
                if (existingUser && existingUser.provider == "google") {
                    var token = verifyToken.createJWT(existingUser);
                    res.send({ token: token });
                }
                else if (existingUser && existingUser.provider != "google") {
                    var user = {};
                    user.provider_id = profile.id;
                    user.provider = "google";
                    user.email = profile.email;
                    user.picture = profile.picture.replace('sz=50', 'sz=200');
                    user.displayName = profile.name;
                    User.findOneAndUpdate({ email: existingUser.email }, user, function (err) {
                        var token = verifyToken.createJWT(existingUser);
                        res.send({ token: token });
                    });
                }
                else {
                    var user = new User();
                    user.provider_id = profile.id;
                    user.provider = "google";
                    user.email = profile.email;
                    user.picture = profile.picture.replace('sz=50', 'sz=200');
                    user.displayName = profile.name;
                    user.save(function (err) {
                        var token = verifyToken.createJWT(user);
                        res.send({ token: token });
                    });
                }
                // var token = req.header('Authorization').split(' ')[1];
                // var payload = jwt.decode(token, config.TOKEN_SECRET);
            });
        });
    });
};

/*
 |--------------------------------------------------------------------------
 | Login with GitHub
 |--------------------------------------------------------------------------
 */
exports.github = function (req, res) {
    var accessTokenUrl = 'https://github.com/login/oauth/access_token';
    var userApiUrl = 'https://api.github.com/user';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.GITHUB_SECRET,
        redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params }, function (err, response, accessToken) {
        accessToken = qs.parse(accessToken);
        var headers = { 'User-Agent': 'CuppaLabs' };
        //console.log(accessToken);
        // res.send({ token: accessToken });
        // Step 2. Retrieve profile information about the current user.
        request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, function (err, response, profile) {

            // Step 3a. Link user accounts.
            if (req.header('Authorization')) {
                User.findOne({ github: profile.id }, function (err, existingUser) {
                    if (err) {
                        return res.status(500).send({ message: "error occured" });
                    }
                    if (existingUser) {
                        return res.status(409).send({ message: 'There is already a GitHub account that belongs to you' });
                    }
                    var token = req.header('Authorization').split(' ')[1];
                    var payload = jwt.decode(token, config.TOKEN_SECRET);
                    User.findById(payload.sub, function (err, user) {
                        if (!user) {
                            return res.status(400).send({ message: 'User not found' });
                        }
                        user.github = profile.id;
                        user.picture = user.picture || profile.avatar_url;
                        user.displayName = user.displayName || profile.name;
                        user.save(function () {
                            var token = verifyToken.createJWT(user);
                            res.send({ token: token });
                        });
                    });
                });
            } else {
                // Step 3b. Create a new user account or return an existing one.
                User.findOne({ github: profile.id }, function (err, existingUser) {
                    if (existingUser) {
                        var token = verifyToken.createJWT(existingUser);
                        return res.send({ token: token });
                    }
                    var user = new User();
                    user.github = profile.id;
                    user.picture = profile.avatar_url;
                    user.displayName = profile.name;
                    user.email = profile.email;

                    user.save(function (err, user) {
                        var token = verifyToken.createJWT(user);
                        res.send({ token: token });
                    });
                });
            }
        });
    });
};

/*
 |--------------------------------------------------------------------------
 | Login with LinkedIn
 |--------------------------------------------------------------------------
 */
exports.linkedin = function (req, res) {
    var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
    var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.LINKEDIN_SECRET,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };

    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, { form: params, json: true }, function (err, response, body) {
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).send({ message: body.error_description });
        }
        var params = {
            oauth2_access_token: body.access_token,
            format: 'json'
        };

        // Step 2. Retrieve profile information about the current user.
        request.get({ url: peopleApiUrl, qs: params, json: true }, function (err, response, profile) {

            // Step 3b. Create a new user account or return an existing one.
            User.findOne({ email: profile.emailAddress }, function (err, existingUser) {
                if (existingUser && existingUser.provider == "linkedin") {
                    var token = verifyToken.createJWT(existingUser);
                    res.send({ token: token });
                }
                else if (existingUser && existingUser.provider != "linkedin") {
                    var user = {};
                    user.provider_id = profile.id;
                    user.provider = "linkedin";
                    user.email = profile.emailAddress;
                    user.picture = profile.pictureUrl;
                    user.displayName = profile.firstName + ' ' + profile.lastName;
                    User.findOneAndUpdate({ email: existingUser.email }, user, function (err) {
                        var token = verifyToken.createJWT(existingUser);
                        res.send({ token: token });
                    });
                }
                else {
                    var user = new User();
                    user.provider_id = profile.id;
                    user.provider = "linkedin";
                    user.email = profile.emailAddress;
                    user.picture = profile.pictureUrl;
                    user.displayName = profile.firstName + ' ' + profile.lastName;
                    user.save(function () {
                        var token = verifyToken.createJWT(user);
                        res.send({ token: token });
                    });
                }
            });
        });
    });
};

/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
exports.facebook = function (req, res) {
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'picture.type(large)'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.FACEBOOK_SECRET,
        redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params, json: true }, function (err, response, accessToken) {
        if (response.statusCode !== 200) {
            return res.status(500).send({ message: accessToken.error.message });
        }

        // Step 2. Retrieve profile information about the current user.
        request.get({ url: graphApiUrl, qs: accessToken, json: true }, function (err, response, profile) {
            if (response.statusCode !== 200) {
                return res.status(500).send({ message: profile.error.message });
            }
            User.findOne({ email: profile.email }, function (err, existingUser) {
                if (existingUser && existingUser.provider == "facebook") {
                    var token = verifyToken.createJWT(existingUser);
                    res.send({ token: token, User: user });
                }
                else if (existingUser && existingUser.provider != "facebook") {
                    var user = {};
                    user.provider_id = profile.id;
                    user.provider = "facebook";
                    user.email = profile.email;
                    user.picture = profile.picture.data.url;
                    user.displayName = profile.name;
                    User.findOneAndUpdate({ email: existingUser.email }, user, function (err) {
                        var token = verifyToken.createJWT(existingUser);
                        res.send({ token: token, User: user });
                    });
                }
                else {
                    var user = new User();
                    user.provider_id = profile.id;
                    user.provider = "facebook";
                    user.email = profile.email;
                    user.picture = profile.picture.data.url;
                    user.displayName = profile.name;
                    user.save(function (err) {
                        var token = verifyToken.createJWT(user);
                        res.send({ token: token, User: user });
                    });
                }
                // var token = req.header('Authorization').split(' ')[1];
                // var payload = jwt.decode(token, config.TOKEN_SECRET);
            });
        });
    });
};

/*
 |--------------------------------------------------------------------------
 | Login with Yahoo
 |--------------------------------------------------------------------------
 */
exports.yahoo = function (req, res) {
    var accessTokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';
    var clientId = req.body.clientId;
    var clientSecret = config.YAHOO_SECRET;
    var formData = {
        code: req.body.code,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };
    var headers = { Authorization: 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64') };

    // Step 1. Exchange authorization code for access token.
    request.post({ url: accessTokenUrl, form: formData, headers: headers, json: true }, function (err, response, body) {
        var socialApiUrl = 'https://social.yahooapis.com/v1/user/' + body.xoauth_yahoo_guid + '/profile?format=json';
        var headers = { Authorization: 'Bearer ' + body.access_token };

        // Step 2. Retrieve profile information about the current user.
        request.get({ url: socialApiUrl, headers: headers, json: true }, function (err, response, body) {

            // Step 3a. Link user accounts.
            if (req.header('Authorization')) {
                User.findOne({ yahoo: body.profile.guid }, function (err, existingUser) {
                    if (existingUser) {
                        return res.status(409).send({ message: 'There is already a Yahoo account that belongs to you' });
                    }
                    var token = req.header('Authorization').split(' ')[1];
                    var payload = jwt.decode(token, config.TOKEN_SECRET);
                    User.findById(payload.sub, function (err, user) {
                        if (!user) {
                            return res.status(400).send({ message: 'User not found' });
                        }
                        user.yahoo = body.profile.guid;
                        user.displayName = user.displayName || body.profile.nickname;
                        user.save(function () {
                            var token = verifyToken.createJWT(user);
                            res.send({ token: token });
                        });
                    });
                });
            } else {
                // Step 3b. Create a new user account or return an existing one.
                User.findOne({ yahoo: body.profile.guid }, function (err, existingUser) {
                    if (existingUser) {
                        return res.send({ token: verifyToken.createJWT(existingUser) });
                    }
                    var user = new User();
                    user.yahoo = body.profile.guid;
                    user.displayName = body.profile.nickname;
                    user.save(function () {
                        var token = verifyToken.createJWT(user);
                        res.send({ token: token });
                    });
                });
            }
        });
    });
};

/*
 |--------------------------------------------------------------------------
 | Login with Twitter
 | Note: Make sure "Request email addresses from users" is enabled
 | under Permissions tab in your Twitter app. (https://apps.twitter.com)
 |--------------------------------------------------------------------------
 */
exports.twitter = function (req, res) {
    var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    var profileUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';

    // Part 1 of 2: Initial request from Satellizer.
    if (!req.body.oauth_token || !req.body.oauth_verifier) {
        var requestTokenOauth = {
            consumer_key: config.TWITTER_KEY,
            consumer_secret: config.TWITTER_SECRET,
            callback: req.body.redirectUri
        };

        // Step 1. Obtain request token for the authorization popup.
        request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function (err, response, body) {
            var oauthToken = qs.parse(body);

            // Step 2. Send OAuth token back to open the authorization screen.
            res.send(oauthToken);
        });
    } else {
        // Part 2 of 2: Second request after Authorize app is clicked.
        var accessTokenOauth = {
            consumer_key: config.TWITTER_KEY,
            consumer_secret: config.TWITTER_SECRET,
            token: req.body.oauth_token,
            verifier: req.body.oauth_verifier
        };

        // Step 3. Exchange oauth token and oauth verifier for access token.
        request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function (err, response, accessToken) {

            accessToken = qs.parse(accessToken);

            var profileOauth = {
                consumer_key: config.TWITTER_KEY,
                consumer_secret: config.TWITTER_SECRET,
                token: accessToken.oauth_token,
                token_secret: accessToken.oauth_token_secret,
            };

            // Step 4. Retrieve user's profile information and email address.
            request.get({
                url: profileUrl,
                qs: { include_email: true },
                oauth: profileOauth,
                json: true
            }, function (err, response, profile) {

                // Step 5a. Link user accounts.
                if (req.header('Authorization')) {
                    User.findOne({ twitter: profile.id }, function (err, existingUser) {
                        if (existingUser) {
                            return res.status(409).send({ message: 'There is already a Twitter account that belongs to you' });
                        }

                        var token = req.header('Authorization').split(' ')[1];
                        var payload = jwt.decode(token, config.TOKEN_SECRET);

                        User.findById(payload.sub, function (err, user) {
                            if (!user) {
                                return res.status(400).send({ message: 'User not found' });
                            }

                            user.twitter = profile.id;
                            user.email = profile.email;
                            user.displayName = user.displayName || profile.name;
                            user.picture = user.picture || profile.profile_image_url_https.replace('_normal', '');
                            user.save(function (err) {
                                res.send({ token: verifyToken.createJWT(user) });
                            });
                        });
                    });
                } else {
                    // Step 5b. Create a new user account or return an existing one.
                    User.findOne({ twitter: profile.id }, function (err, existingUser) {
                        if (existingUser) {
                            return res.send({ token: verifyToken.createJWT(existingUser) });
                        }

                        var user = new User();
                        user.twitter = profile.id;
                        user.email = profile.email;
                        user.displayName = profile.name;
                        user.picture = profile.profile_image_url_https.replace('_normal', '');
                        user.save(function () {
                            res.send({ token: verifyToken.createJWT(user) });
                        });
                    });
                }
            });
        });
    }
};

/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
exports.unlink = function (req, res) {
    var provider = req.body.provider;
    var providers = ['facebook', 'google', 'github', 'instagram', 'local',
        'linkedin', 'live', 'twitter', 'yahoo'];

    if (providers.indexOf(provider) === -1) {
        return res.status(400).send({ message: 'Unknown OAuth Provider' });
    }

    User.findById(req.user, function (err, user) {
        if (!user) {
            return res.status(400).send({ message: 'User Not Found' });
        }
        user[provider] = undefined;
        user.save(function () {
            res.status(200).end();
        });
    });
};

