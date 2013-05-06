var clean = function( str ){
        return str.replace(/\s\+\s\"\"\s/g,' ');
    },
    compile = function( content ){
        var i,n,res='';
        for (i = 0; i < arr.length; i++ ) {
            n = arr[i];
            if (typeof n === "string") {
                res += n;
                continue;
            }
            if (typeof n === "object") {
                if ("mvc" in n) {
                    var method = "mvc:"+n.mvc+":compile";
                    if ( method in this ){
                        res += this[method](n);
                        continue;
                    } else {
                        this.err("method " + method + " not implemented in compiler");
                    }
                }
                res += "<" + n.name;
                res += n.attrs ? this["attrs:compile"]( n.attrs ) : "";
                res += n.content && n.content.length ? ">" + this["tag:compile"]( n.content ) + "</"+n.name+">" : "/>";
                continue;
            }
        }
        return res;
    },

    _$ = {

        attr  : function( name ) {
            var $ = this;
            if ( ( "attributes" in $.node ) && ( name in $.node.attributes ) && ( "value" in $.node.attributes[name] ) ) {
                return $.node.attributes[name].value;
            }
            return false;
        },

        attrs : function() {
            var $ = this,
                res = {},
                a;
            for (a in $.node.attributes){
                res[a] = $.node.attributes[a].value;
            }
            return res;
        },

        ns : function(){
            var n           = [],
                _n          = this.node,
                __default__ = "__default__";

            if ( typeof _n === "string" ) {
                n = _n.indexOf(":") == -1 ? [ __default__ , _n ] : _n.split(":");
            } else if ( typeof _n === "object" ) {
                n = [_n.prefix,_n.name];
            } else {
                this.err("unexpected value " + _n);
            }
            n[0] = n[0] ? n[0] : __default__ ;
            return n;
        }

    },

    $ = function( node ){
        _$.node = node;
        return _$;
    };

module.exports = function( ){

    var compiler = this;

    /*console.log( "compiler", compiler )*/

    compiler.point   = null;
    compiler.tree    = {};
    compiler.slot    = function(){
        return compiler.point ? compiler.point.content : [];
    };


    compiler.on(
        "open",
        function( node ){

            var ns  = $( node ).ns(),
                ns_ = ns[0],
                _ns = ns[1];
            if ( ns_ in compiler.ns ) {
                if ( ! (_ns in compiler.ns[ ns_ ]) ) {
                    _ns = "*";
                }
                compiler.ns[ ns_ ][ _ns ]( node );
            } else {
                return err( "not defined ns for \"" + node.name + "\". check grammars" );
            }
        }
    );
    /*this.on("text", l);*/

compiler        "close",
        function( node ){
            var ns = $( node ).ns();
            console.log(">ns ",ns);
            if ( node.substr( 0, node.indexOf(":") ) in options.ns ) {
                if ( ("/"+node) in compiler ) {
                    compiler[  "/"+node ]( node );
                } else {
                    return err("not defined method for \"/" + node + "\"");
                }
            } else {
                compiler["/*"]( node );
            }
        }
    );

    compiler.on(
        "end",
        function(){
            compiler.output(null, compiler.tree );
            return;
            var res = [], t, content;
            for ( var s in this.tree ){
                content = this.tree[s].content;
                if ( content.length === 0 ) {
                    this.err( "empty \"" + s + "\" template" );
                    break;
                }
                t = '';
                t += '"' + s + '" : function(){\n    return "';
                t += clean( this["compile"]( content ) );
                t += '";\n}';
                res.push(t);
            }

            //this.output( res.join(", ") );
        }
    );

    return {
        "*": function( node ){
            var tag = {
                name    : node.name,
                attrs   : $(node).attrs(),
                content : [],
                parent  : this.point
            };
            this.slot().push( tag );
            this.point = tag;
        },
        "/*": function( node ){
            //console.log( "/:*", node );
        }
    };

}
/*


,

        "run": function(){

            var res = [],
                t;

            this.state  = 'run';

            for ( var s in this.result.storage ){
                if ( this.result.storage[s].content.length === 0 ) {
                    this.err( "empty \"" + s + "\" template" );
                    break;
                }
                t = '';
                t += '"' + s + '" : function(){\n    return "';
                t += this.clean( this["tag:compile"]( this.result.storage[s].content ) );
                t += '";\n}';
                res.push(t);
            }
            return "{\n" + res.join(",\n") + "\n}";
        }

output( null, compiler.run() );

var m = {


"*": function( node ){
    var tag = {
            name    : node.name,
            attrs   : $(node).attrs(),
            content : [],
            parent  : this.point
        };
    this.slot().push( tag );
    this.point = tag;
},

"/*": function( node ){
    this.point = this.point.parent;
},

"text" : function( text ) {
    if ( this.mvc_param_mode ) {
        this.mvc_param_mode.text = text.trim();
        return;
    };

    var t = this.mvc_text_mode ? text : text.trim();
    if (t) {
        this.slot().push( t );
    }
},

"attrs:compile":function( attrs ){
    var res=[], a;
    for (a in attrs) {
        res.push(" "+a+"='"+attrs[a]+"'");
    }

    return res.join("");
},

"tag:compile":function( arr ){

}
}*/