var resolver = require('./helper.js');
var casper = require('casper').create({
    verbose: true,
    logLevel: 'error'
});

var url = 'http://www.eni-training.com/client_net/mediabook.aspx?idR=300891';

//To debug :

//casper.on("remote.message", function(msg){
//    this.echo("remote.msg: " + msg);
//});
//
//casper.on("resource.error", function(resourceError){
//    this.echo("res.err: " + JSON.stringify(resourceError));
//});
//
//casper.on("resource.requested", function(resource){
//    this.echo("res.req: " + JSON.stringify(resource));
//});


casper
    .start()
    .thenOpen(url, function() {
        this.evaluate(function() {
            document.cookie = "MplusUserSettings=Lng=1; expires=Fri, 1 Aug 2100 20:00:00 UTC; path=/";
            document.cookie = "__rsaxc=c36c9c18286599a4303175b2e80f505e; expires=Fri, 1 Aug 2100 20:00:00 UTC; path=/";
            document.cookie = "__hnwky=1576096093646; expires=Fri, 1 Aug 2100 20:00:00 UTC; path=/";
            document.cookie = "ENI_Editions_Portail=Identifiant=f668f743-f2e2-48ef-ae42-53a9d2dae790&SessionId=350c7a83-7d70-4237-b870-1670d5b0a8cf; expires=Fri, 1 Aug 2100 20:00:00 UTC; path=/";
        });
    })
    .thenOpen(url, function() {
        var links = this.evaluate(function() {
            return Array.prototype.map.call(document.querySelectorAll('ul#Root a'), function(link){
                return link.getAttribute('href');
            });
        });
        this.each(links, function(self, link) {
            var id = /ida=(\d+)/g.exec(link)[1];
            // May be useful to continue from last id
            //if (Number(id) > 000000) {
                self.thenOpen(resolver(link, url), function() {
                        self.download("http://www.eni-training.com/client_net/pdfexport.aspx?exporttype=2", 'docs/DL' + id + '.pdf');
                });
            //}
        });
    })
    .run(function(){
        this.exit();
    });
