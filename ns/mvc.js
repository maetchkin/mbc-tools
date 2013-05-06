module.exports = function(err){
    var compiler = this;
    return {
        "*" : function( node ){
            //console.log(node);
            err( 'not contain open method for ' + node.name );
            //console.log("", node);
        },
        "/*": function( node ){
            err( 'not contain close method for ' + node.name );
        },
        "template": function( node ){

            if (compiler.point !== null) {
                err( "Template format violation: mvc:template must be child of mvc:templates" );
            }

            //console.log("=====",node);

            /*var mtpl = {
                name: ($(node).attr('name') || 'default'),
                content:[],
                parent : compiler.point
            };

            compiler.point = compiler.result.storage[ mtpl.name ] = mtpl;*/
        },
        "/template": function(){
            compiler.point = null;
        },
    }
}
/*
var m = {

        "mvc_text_mode" : false,

        "mvc_param_mode": false,

"mvc:templates": function( node ){
            this.state  = 'started';
        },

        "/mvc:templates": function () {
            this.state  = 'complete';
        },

        "mvc:template": function( node ){
            if (this.point !== null) {
                this.err( "Template format violation: mvc:template must be child of mvc:templates" );
            }

            var mtpl = {
                name: ($(node).attr('name') || 'default'),
                content:[],
                parent : this.point
            };

            this.point = this.result.storage[ mtpl.name ] = mtpl;
        },

        "/mvc:template": function(){
            this.point = null;
        },

        "mvc:apply-templates": function( node ){
            var apply = {
                    mvc     : 'apply-templates',
                    attrs   : $(node).attrs(),
                    content : [],
                    parent  : this.point
                };
            this.slot().push( apply );
            this.point = apply;
        },

        "/mvc:apply-templates": function( ){
            this.point = this.point.parent;
        },

        "mvc:apply-templates:compile": function( ){
            return '" + this.apply() + "';
        },

        "mvc:call-template": function( node ){
            var _call = {
                    mvc     : 'call-template',
                    attrs   : $(node).attrs(),
                    content : [],
                    parent  : this.point
                };
            this.slot().push( _call );
            this.point = _call;
        },

        "/mvc:call-template": function(){
            this.point = this.point.parent;
        },

        "mvc:call-template:compile": function(){
            return '" + this.call() + "';
        },

        "mvc:prop": function( node ){
            var prop = {
                    mvc: 'prop',
                    attrs   : $(node).attrs(),
                    content : [],
                    parent  : this.point
                };
            this.slot().push( prop );
            this.point = prop;
        },

        "/mvc:prop": function( ){
            this.point = this.point.parent;
        },

        "mvc:prop:compile": function( ){
            return '" + this.prop() + "';
        },

        "mvc:param": function( node ){
            var param = { mvc:'param' };
            this.slot().push( param );
            this.mvc_param_mode = param;
        },

        "/mvc:param": function(){
            this.mvc_param_mode = false;
        },

        "mvc:text": function( node ){
            this.mvc_text_mode = true;
        },

        "/mvc:text": function(){
            this.mvc_text_mode = false;
        }
}*/