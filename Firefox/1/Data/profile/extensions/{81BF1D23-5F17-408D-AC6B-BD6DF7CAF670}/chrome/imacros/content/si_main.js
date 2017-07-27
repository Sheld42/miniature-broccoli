




try {


function __loginf(text) {
    try {
        if (XPCOM) {
            var cs = XPCOM.getService("@mozilla.org/consoleservice;1");
            cs.logStringMessage(text);
        } else if (console) {
            console.log(text);
        }
    } catch(e) {}
    dump(text+"\n");
}



const ErrorDescription = new ctypes.StructType(
    "ErrorDescription",
    [{"str": ctypes.char.ptr}]
);



var getErrorDescription = null;
var freeErrorDescription = null;
var getErrorCode = null;
var getBrowserProcessId = null;
var startServer = null;
var stopServer = null;


var si_main = {
    lib: null,
    running: false,
    listener: null,

    initLibrary: function (path) {
        this.lib = ctypes.open(path);

        getErrorDescription = this.lib.declare(
            "getErrorDescription",
            ctypes.default_abi,
            ctypes.int32_t,
            ErrorDescription.ptr
        );

        freeErrorDescription = this.lib.declare(
            "freeErrorDescription",
            ctypes.default_abi,
            ctypes.void_t,
            ErrorDescription.ptr
        );

        getErrorCode = this.lib.declare(
            "getErrorCode",
            ctypes.default_abi,
            ctypes.int32_t
        );

        getBrowserProcessId = this.lib.declare(
            "getBrowserProcessId",
            ctypes.default_abi,
            ctypes.int32_t
        );

        startServer = this.lib.declare(
            "startServer",
            ctypes.default_abi,
            ctypes.int32_t,
            ctypes.char.ptr,
            ctypes.char.ptr
        );

        stopServer = this.lib.declare(
            "stopServer",
            ctypes.default_abi,
            ctypes.void_t
        );

        setCommandResult = this.lib.declare(
            "setCommandResult",
            ctypes.default_abi,
            ctypes.int32_t,
            ctypes.int32_t,
            ctypes.char.ptr
        );
    },


    postError: function(e) {
        if (!e) {
            e = new ErrorDescription();
            getErrorDescription(e.address());
            postMessage({
                "type": "error",
                "message": e.str.readString(),
                "error_code": getErrorCode()
            });
            freeErrorDescription(e.address());
        } else {
            __loginf("si_main.js error: "+e.toString());
            postMessage({
                "type": "error",
                "message": e.message,
                "error_code": e.error_code || -1
            });
        }
    },


    onListenerClose: function () {
        
        try {

            
            

            if (this.restart) {
                this.restart = false;
                this.start();
            } else {
                close();
            }
            
        } catch(e) {
            this.postError(e);
        }
    },


    startListener: function() {
        try {
            this.listener = new ChromeWorker("si_listener.js");
            this.listener.onerror = function(err) {
                si_main.postError(err);
            };
            
            this.listener.onmessage = function(msg) {
                si_main.onMessage(msg);
            };

            this.listener.postMessage({
                "command": "init",
                "libpath": this.libpath
            });
        } catch(e) {
            this.postError(e);
        }

    },


    start: function() {
        __loginf("Starting server, pipe="+this.pipe);
        if (startServer(this.pipe, "fx") != 0) {
            this.starting = false;
            this.running = false;
            this.postError();
        } else {
            this.running = false;
            this.starting = true;
            this.startListener();
        }
    },


    onMessage: function(evt) {
        var msg = evt.data;
        
        try {
            switch (msg.command) {
            case "init":
                this.initLibrary(msg.libpath)
                this.libpath = msg.libpath;
                postMessage({
                    "type": "pid",
                    "pid": getBrowserProcessId()
                });
                break;

            case "start":
                this.pipe = msg.pipe;

                if (this.starting) {
                    setTimeout(function() {
                        si_main.onMessage({data: msg});
                    }, 100);
                } else if (this.running) {
                    this.restart = true;
                    
                    
                    stopServer();
                } else {
                    this.start();
                }
                break;

            case "send_response":
                if (setCommandResult(msg.clientId, msg.response) != 0)
                    this.postError();
                break;

            case "terminate":
                if (this.running) {
                    this.running = false;
                    this.restart = false;
                    stopServer();
                }
                break;

            case "send_request":
                
                postMessage({
                    "type": "request",
                    "request": msg.request,
                    "clientId": msg.clientId
                });
                break;

            case "throw_error":
                
                this.postError(msg);
                break;

            case "do_onlistenerrun":
                this.running = true;
                this.starting = false;
                break;

            case "do_onlistenerclose":
                this.onListenerClose();
                break;

            case "do_onlistenererror":
                this.postError(msg.error);
                stopServer();
                break;
            }
        } catch(e) {
            this.postError(e);
        }
    }
};



onmessage = function(evt) {
    si_main.onMessage(evt);
};

} catch(e) {
    __loginf("si_main.js exception "+e.toSource());
}
