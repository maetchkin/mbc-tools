var cli     = require("./cli"),
    fs      = require("fs"),
    path    = require("path"),
    events  = require("events"),
    emitter = new events.EventEmitter(),
    output  = function(err, data){
        if (err) {

            if( err.fatal ) {
                cli.fatal( err );
                process.exit(1);
            } else {
                cli.error( err );
            }

        } else {
            console.log( data );
            process.exit(0);
        }
    };

cli.enable("version","glob");
cli.setUsage("node view.js -s example.xml");
cli.parsePackageJson("./package.json");

var options = cli.parse(
            {
                "source"   : ["s", "XML Source", "file"],
                "output"   : ["o", "Write result to FILE", "file"],
                "encoding" : ["e", "Source's encoding", "string", "utf8"],
                "ns-match" : ["n", "Minimatch for namespaces implementation", "string", "ns/*.js"]
            }
        );

var parser = function( data, options, output ){

    var sax = require("sax")
                .parser( true, { xmlns:true, position:true }),

                compiler = {

                    output : output,

                    ns: {},

                    "on" : function(){
                        return emitter.on.apply(emitter, arguments);
                    },

                    "load" : function( ns ){
                        var n;
                        for (n in ns){

                            console.log("ns",n);

                            this.ns[n] = require( ns[n] );

                            this.ns[n] = this.ns[n].call(
                                this,
                                (function( n ){
                                    var n = n;
                                    return function( err ){
                                        return output("\x1B[35m" + "sax.ns.compiler: \x1B[33m" + n + '\x1B[31m ' + err + '\x1B[0m');
                                    }
                                })( n+"" )
                            );
                        }
                    }
                },

                err = function ( err ) {
                    return output( '\x1B[34m'+ "sax.ns.parser: " + '\x1B[31m'+err+'\x1B[0m' );
                };

    compiler.load( options.ns );
    //console.log('\x1B[34m'+"-----------------compiler-----------------\n"+'\x1B[0m', compiler);

    /* return;*/

    sax.onerror   = err;

    sax.ontext    = function ( text ) {
        emitter.emit( 'text', text );
    };

    sax.onopentag = function ( node ) {
        emitter.emit( 'open', node );
    };

    sax.onclosetag = function (node) {
        emitter.emit( 'close', node );
    };

    sax.onend = function () {
        emitter.emit( 'end' );
    };

    sax.write( data ).close();
}

cli.main(
    function( args, options ){

        if (!options.source) {
            cli.fatal( "template source not defined. try with -h"  );
        }

        options.src = path.join(
            process.cwd(),
            options.source
        );

        options.ns = (
            function( globns ){
                var res = {};
                if ( !( globns instanceof Array ) || globns.length === 0 ) {
                    cli.fatal( "namespaces not detected" );
                }
                for (var i in globns ){
                    res[ path.basename( globns[i], '.js' ) ] = globns[i];
                }
                return res;
            }
        )(
            cli.glob.sync(
                path.join(
                    process.cwd(),
                    options["ns-match"]
                )
            )
        );

        //console.log( "options", options );
        fs.stat(
            options.src,
            function(err, stats) {

                if(err){
                    if (err.code === 'ENOENT') {
                        err = "path " + err.path + " not exists";
                    }
                    cli.fatal( err );
                }

                if( !stats.isFile() ){
                    cli.fatal( "path " + err.path + " not a file");
                }

                if ( stats.size === 0 ){
                    cli.fatal( options.src + " is empty" );
                }

                fs.readFile(
                    options.src,
                    {
                        "encoding"  : options.encoding,
                        "flag"      : "r"
                    },
                    function( err, data ){

                        if(err){
                            if (err.code === 'EACCES') {
                                err = "Permission denied to read " + err.path + "";
                            }
                            cli.fatal( err );
                        }

                        parser( data, options, output );
                    }
                );
            }
        );
    }
);