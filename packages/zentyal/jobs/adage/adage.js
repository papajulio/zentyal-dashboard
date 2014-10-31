module.exports = function(config, dependencies, job_callback) {
    var logger = dependencies.logger;

    var url = config.url;
    var user = config.user;
    var password = config.password;
    var auth = 'Basic ' + new Buffer(user + ':' + password).toString('base64');

    var options = {
        url : url + "/timetracking/punch",
        rejectUnauthorized : false,
        headers : {'authorization': auth, "X-Requested-With": "XMLHttpRequest"}
    };

    dependencies.request(options, function(err, response, body) {
        if (err || !response || response.statusCode != 200) {
            var err_msg = err || (response ? ("bad statusCode: " + response.statusCode + " from " + options.url) : ("bad response from " + options.url));
            logger.error(err_msg);
            job_callback(err_msg);
        } else {
            var display = [];

            var re = /<pre class=\"adage_message\">(.*)<\/pre>/g;
            adage_message = re.exec(body);
            display.push({"quote" : adage_message, "author" : "Peladix" });
            job_callback(null, {quotes: display, title: config.widgetTitle});
        }
    });
};
